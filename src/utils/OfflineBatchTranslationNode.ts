/**
 * ============================================================================
 * [THAI] โหนดประมวลผลแปลเอกสารและไฟล์กลุ่มแบบออฟไลน์ (JSON, CSV, SRT, TXT)
 * [ENGLISH] Offline Batch & Document Translation Node (JSON, CSV, SubRip SRT, TXT)
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - ประมวลผลแปลไฟล์เอกสารหลายรายการพร้อมกันแบบออฟไลน์ 100% บนเครื่องผู้ใช้
 * - รองรับไฟล์มาตรฐานอุตสาหกรรม:
 *   1. JSON Localization Files (Key-Value Dictionaries)
 *   2. SubRip Subtitles (`.srt`) - รักษารหัสเวลา Timecode และลำดับซับไตเติล
 *   3. CSV Translation Sheets (ตารางแปลเกมและแอปพลิเคชัน)
 *   4. Plain Text & Markdown Documents
 * - คำนวณความคืบหน้า (Progress Percentage), รายการข้อผิดพลาด และสถิติคำ
 * - สร้างไฟล์ผลลัพธ์และส่งออกเป็น Download Blob ได้ทันที
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - ใช้ `GlobalOfflineAITranslationEngine.translate()` ในการประมวลผลข้อความแต่ละชุด
 * - ส่งออกผลลัพธ์ไปยัง `GlobalOfflineAITranslationStudio.tsx`
 *
 * พารามิเตอร์ Input / Output ที่รับส่ง (Inputs, Outputs & Data Contracts):
 * - Input: `content: string`, `format: 'json' | 'csv' | 'srt' | 'txt' | 'markdown'`, `config: OfflineTranslationConfig`
 * - Output: `BatchTranslationJob`
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - หากไฟล์ JSON เสียหาย (Malformed JSON) จะแจ้งเตือนข้อผิดพลาดและ Fallback เป็นโหมดแปลทีละบรรทัด
 * - การแปล Subtitle `.srt` จะข้ามบรรทัดตัวเลขลำดับและบรรทัด Timestamp เพื่อไม่ให้รหัสเวลาคลาดเคลื่อน
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ```typescript
 * import { OfflineBatchTranslationNode } from '../utils/OfflineBatchTranslationNode';
 * const job = await OfflineBatchTranslationNode.processBatch(rawContent, 'srt', config);
 * ```
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

import {
  BatchTranslationItem,
  BatchTranslationJob,
  OfflineGlossaryRule,
  OfflineTranslationConfig
} from '../types/offlineTranslation70';
import { GlobalOfflineAITranslationEngine } from './GlobalOfflineAITranslationEngine';

export class OfflineBatchTranslationNode {
  /**
   * ประมวลผลแปลเนื้อหาไฟล์ตามรูปแบบที่ระบุ
   */
  public static async processBatch(
    content: string,
    format: 'json' | 'csv' | 'srt' | 'txt' | 'markdown',
    fileName: string,
    config: OfflineTranslationConfig,
    glossary: OfflineGlossaryRule[] = [],
    onProgress?: (completed: number, total: number) => void
  ): Promise<BatchTranslationJob> {
    const startTime = Date.now();
    const items: BatchTranslationItem[] = [];

    // 1. แยกเนื้อหาตามรูปแบบของไฟล์ (Parsing Phase)
    if (format === 'json') {
      this.parseJsonFormat(content, items);
    } else if (format === 'srt') {
      this.parseSrtFormat(content, items);
    } else if (format === 'csv') {
      this.parseCsvFormat(content, items);
    } else {
      this.parsePlainTextFormat(content, items);
    }

    const totalItems = items.length;
    let completedItems = 0;

    // 2. ดำเนินการแปลข้อความแต่ละรายการ (Translation Phase)
    for (const item of items) {
      if (item.sourceText.trim().length > 0) {
        try {
          const transResult = GlobalOfflineAITranslationEngine.translate(
            item.sourceText,
            config,
            glossary
          );
          item.translatedText = transResult.translatedText;
          item.metrics = transResult.metrics;
          item.status = 'completed';
        } catch (err) {
          item.status = 'failed';
          item.translatedText = item.sourceText;
        }
      } else {
        item.translatedText = '';
        item.status = 'completed';
      }

      completedItems++;
      if (onProgress) {
        onProgress(completedItems, totalItems);
      }
    }

    return {
      jobId: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fileName,
      format,
      sourceLangId: config.sourceLangId,
      targetLangId: config.targetLangId,
      totalItems,
      completedItems,
      items,
      startTime,
      endTime: Date.now()
    };
  }

  /**
   * แยกข้อมูลจากไฟล์ JSON
   */
  private static parseJsonFormat(content: string, items: BatchTranslationItem[]): void {
    try {
      const parsed = JSON.parse(content);
      if (typeof parsed === 'object' && parsed !== null) {
        let index = 0;
        for (const [key, value] of Object.entries(parsed)) {
          if (typeof value === 'string') {
            items.push({
              id: `item_${index++}`,
              key,
              sourceText: value,
              status: 'pending'
            });
          }
        }
      }
    } catch (e) {
      // Fallback เป็นบรรทัด
      this.parsePlainTextFormat(content, items);
    }
  }

  /**
   * แยกข้อมูลจากไฟล์ Subtitle SubRip (.srt)
   * โดยรักษารหัสเวลา (00:00:01,000 --> 00:00:04,000) และเลขลำดับ
   */
  private static parseSrtFormat(content: string, items: BatchTranslationItem[]): void {
    const blocks = content.replace(/\r\n/g, '\n').split(/\n\s*\n/);
    let index = 0;

    for (const block of blocks) {
      const lines = block.split('\n').filter(Boolean);
      if (lines.length >= 2) {
        const seqNum = lines[0].trim();
        const timecode = lines[1].trim();

        // บรรทัดที่ 3 ขึ้นไปคือเนื้อหาบทพูด
        const subtitleText = lines.slice(2).join(' ').trim();
        if (subtitleText.length > 0) {
          items.push({
            id: `srt_${index++}`,
            key: `${seqNum} | ${timecode}`,
            sourceText: subtitleText,
            status: 'pending'
          });
        }
      }
    }
  }

  /**
   * แยกข้อมูลจากไฟล์ CSV
   */
  private static parseCsvFormat(content: string, items: BatchTranslationItem[]): void {
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    let index = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length === 0) continue;

      // ข้ามบรรทัด Header บรรทัดแรกถ้ามีคำว่า id หรือ text
      if (i === 0 && (line.toLowerCase().includes('key') || line.toLowerCase().includes('text'))) {
        continue;
      }

      const parts = line.split(',');
      const text = parts.length > 1 ? parts.slice(1).join(',').replace(/^"|"$/g, '') : parts[0];

      items.push({
        id: `csv_${index++}`,
        key: parts.length > 1 ? parts[0] : `Row ${i + 1}`,
        sourceText: text.trim(),
        status: 'pending'
      });
    }
  }

  /**
   * แยกข้อมูลจากข้อความธรรมดาหรือ Markdown ทีละบรรทัด
   */
  private static parsePlainTextFormat(content: string, items: BatchTranslationItem[]): void {
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    let index = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().length > 0) {
        items.push({
          id: `line_${index++}`,
          key: `Line ${i + 1}`,
          sourceText: line,
          status: 'pending'
        });
      }
    }
  }

  /**
   * ประกอบเนื้อหาผลลัพธ์การแปลกลับเป็นไฟล์สำหรับดาวน์โหลด
   */
  public static exportBatchResult(job: BatchTranslationJob): Blob {
    let outputContent = '';

    if (job.format === 'json') {
      const obj: Record<string, string> = {};
      for (const item of job.items) {
        const k = item.key || item.id;
        obj[k] = item.translatedText || item.sourceText;
      }
      outputContent = JSON.stringify(obj, null, 2);
      return new Blob([outputContent], { type: 'application/json;charset=utf-8;' });
    }

    if (job.format === 'srt') {
      const srtBlocks: string[] = [];
      let counter = 1;
      for (const item of job.items) {
        if (item.key && item.key.includes('|')) {
          const parts = item.key.split('|').map((s) => s.trim());
          const timecode = parts[1] || '00:00:00,000 --> 00:00:02,000';
          srtBlocks.push(`${counter++}\n${timecode}\n${item.translatedText || item.sourceText}`);
        } else {
          srtBlocks.push(`${counter++}\n00:00:00,000 --> 00:00:03,000\n${item.translatedText || item.sourceText}`);
        }
      }
      outputContent = srtBlocks.join('\n\n');
      return new Blob([outputContent], { type: 'text/plain;charset=utf-8;' });
    }

    if (job.format === 'csv') {
      const csvLines = ['key,source_text,translated_text'];
      for (const item of job.items) {
        const k = item.key || item.id;
        const src = `"${(item.sourceText || '').replace(/"/g, '""')}"`;
        const trans = `"${(item.translatedText || '').replace(/"/g, '""')}"`;
        csvLines.push(`${k},${src},${trans}`);
      }
      outputContent = csvLines.join('\n');
      return new Blob([outputContent], { type: 'text/csv;charset=utf-8;' });
    }

    // Default plain text / markdown
    outputContent = job.items.map((item) => item.translatedText || item.sourceText).join('\n');
    return new Blob([outputContent], { type: 'text/plain;charset=utf-8;' });
  }
}
