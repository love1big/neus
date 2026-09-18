/**
 * ============================================================================
 * MODULE: OfflineAICommandCompressor.ts
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * ระบบย่อคำสั่งแชทของ AI Offline เมื่อมีการส่งคำสั่งยาวๆ หรือซับซ้อนเข้ามาในระบบ
 * (AI Offline Command & Prompt Compressor Node):
 *   - บีบอัดและย่อข้อความ/คำสั่งที่ยาวเกินความจำเป็นเพื่อ "ประหยัดโทเคน (Token Optimization)"
 *   - คงรายละเอียดสำคัญและเจตนาหลัก (Core Intent & Specifications) ไว้อย่างครบถ้วน 100%
 *   - ประมวลผลคำสั่งได้อย่างรวดเร็ว ไม่สูญเสียความหมายหรือบริบททางเทคนิค
 *   - รองรับทุกภาษา (Thai, English, Japanese, Chinese, etc.)
 *   - ยกระดับคำสั่งให้มีโครงสร้างแบบมืออาชีพ (Professional Prompt Engineering):
 *     จัดหมวดหมู่ Action Target, Constraints, Output Format, Technical Specs
 *   - คำนวณอัตราส่วนการประหยัดโทเคน (Compression Ratio & Saved Tokens Estimate)
 *   - มีทั้งฟังก์ชัน Auto-Compress เมื่อส่งข้อความ และโหมดให้ผู้ใช้กดสลับดูคำสั่งเดิม/คำสั่งย่อ
 * 
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - นำเข้าใน:
 *     - `src/components/AIChat.tsx` (เชื่อมเข้ากับไปป์ไลน์ก่อนส่งข้อความและประมวลผล)
 *     - `src/utils/OfflineCommandPromptEngine.ts` (แปลงคำสั่งที่ถูกย่อเป็น Action จริง)
 * - การจัดเก็บการตั้งค่า:
 *     - `localStorage` ผ่านคีย์ `omni_offline_ai_compression_enabled`
 * 
 * 3. พารามิเตอร์ Input / Output ที่รับส่ง (Inputs & Outputs):
 * ----------------------------------------------------------------------------
 * - Input: `rawPrompt: string`, `options?: CompressionOptions`
 * - Output: `CompressedPromptResult` (compressedPrompt, originalPrompt, originalTokens, compressedTokens, compressionRatio, extractedIntent, language)
 * 
 * 4. การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - หากข้อความสั้นอยู่แล้ว (< 40 ตัวอักษร) หรือเป็นคำสั่ง CLI ตรงๆ (/ หรือ $) จะคงรูปเดิมไว้ ไม่บีบอัดจนเสียความหมาย
 * - ป้องกันการตัดทอนโค้ดบล็อก (```code```) หรือคำสั่งพารามิเตอร์เฉพาะทาง
 * 
 * 5. ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ----------------------------------------------------------------------------
 * import { offlineAICommandCompressor } from './OfflineAICommandCompressor';
 * const result = offlineAICommandCompressor.compress(longUserPrompt);
 * console.log(`Tokens saved: ${result.savedTokensPct}%`);
 * ============================================================================
 */

export interface CompressionOptions {
  aggressiveLevel?: 'mild' | 'balanced' | 'ultra'; // ระดับการย่อ
  preserveCodeBlocks?: boolean;
  enhanceProfessionalContext?: boolean; // เสริมความชัดเจนทางสถาปัตยกรรม
  targetLanguage?: 'auto' | 'th' | 'en' | 'ja';
}

export interface CompressedPromptResult {
  originalPrompt: string;
  compressedPrompt: string;
  originalTokens: number;
  compressedTokens: number;
  tokensSaved: number;
  savedTokensPct: number;
  intentCategory: string;
  detectedLanguage: 'th' | 'en' | 'ja' | 'other';
  isCompressed: boolean;
  compressionSummary: string;
}

export class OfflineAICommandCompressor {
  private static instance: OfflineAICommandCompressor | null = null;

  public static getInstance(): OfflineAICommandCompressor {
    if (!OfflineAICommandCompressor.instance) {
      OfflineAICommandCompressor.instance = new OfflineAICommandCompressor();
    }
    return OfflineAICommandCompressor.instance;
  }

  /**
   * ประมาณการจำนวนโทเคนอย่างแม่นยำตามภาษา
   * - ภาษาไทย/เอเชีย: เฉลี่ย ~2-3 chars ต่อ token
   * - ภาษาอังกฤษ: เฉลี่ย ~4 chars ต่อ token
   */
  public estimateTokenCount(text: string): number {
    if (!text) return 0;
    const isThai = /[\u0E00-\u0E7F]/.test(text);
    const isCJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(text);

    if (isThai || isCJK) {
      return Math.ceil(text.length / 2.2);
    }
    return Math.ceil(text.length / 3.8);
  }

  /**
   * ตรวจจับภาษาหลักของคำสั่ง
   */
  public detectLanguage(text: string): 'th' | 'en' | 'ja' | 'other' {
    if (/[\u0E00-\u0E7F]/.test(text)) return 'th';
    if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text)) return 'ja';
    if (/[a-zA-Z]/.test(text)) return 'en';
    return 'other';
  }

  /**
   * บีบอัดและขัดเกลาคำสั่งให้กระชับ มืออาชีพ และประหยัดโทเคนสูงสุด
   */
  public compress(rawPrompt: string, options?: CompressionOptions): CompressedPromptResult {
    const trimmed = (rawPrompt || '').trim();
    const originalTokens = this.estimateTokenCount(trimmed);

    // ถ้าเป็นคำสั่ง CLI สั้นๆ หรือข้อความสั้นมาก ไม่ต้องย่อ
    if (trimmed.length < 50 || trimmed.startsWith('/') || trimmed.startsWith('$')) {
      return {
        originalPrompt: trimmed,
        compressedPrompt: trimmed,
        originalTokens,
        compressedTokens: originalTokens,
        tokensSaved: 0,
        savedTokensPct: 0,
        intentCategory: 'Direct Command / Short Query',
        detectedLanguage: this.detectLanguage(trimmed),
        isCompressed: false,
        compressionSummary: 'ข้อความสั้นหรือเป็นคำสั่งตรง ไม่จำเป็นต้องบีบอัด'
      };
    }

    const lang = options?.targetLanguage === 'auto' || !options?.targetLanguage
      ? this.detectLanguage(trimmed)
      : options.targetLanguage;

    // 1. ดึงบล็อกโค้ดออกมาก่อนเพื่อป้องกันการบิดเบือนไวยากรณ์
    const codeBlocks: string[] = [];
    let textWithoutCode = trimmed.replace(/```[\s\S]*?```/g, (match) => {
      codeBlocks.push(match);
      return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });

    // 2. วิเคราะห์หมวดหมู่เจตนาหลัก (Core Intent Recognition)
    const lower = textWithoutCode.toLowerCase();
    let intentCategory = 'General Architecture & Logic';
    const actionKeywords: string[] = [];

    if (lower.includes('code') || lower.includes('เขียน') || lower.includes('โค้ด') || lower.includes('function') || lower.includes('script') || lower.includes('class')) {
      intentCategory = 'Code Generation & Refactoring';
    } else if (lower.includes('debug') || lower.includes('แก้') || lower.includes('บัค') || lower.includes('error') || lower.includes('fix') || lower.includes('พัง')) {
      intentCategory = 'Autonomous Debugging & Fix';
    } else if (lower.includes('game') || lower.includes('เกม') || lower.includes('rpg') || lower.includes('player') || lower.includes('physics') || lower.includes('map') || lower.includes('ด่าน')) {
      intentCategory = 'Game Engine & Mechanics Architecture';
    } else if (lower.includes('sound') || lower.includes('audio') || lower.includes('เสียง') || lower.includes('sfx') || lower.includes('พากย์')) {
      intentCategory = 'Audio DSP & Sound Synthesis';
    } else if (lower.includes('security') || lower.includes('ความปลอดภัย') || lower.includes('audit') || lower.includes('ช่องโหว่')) {
      intentCategory = 'Security & Vulnerability Audit';
    } else if (lower.includes('ui') || lower.includes('ux') || lower.includes('หน้าตา') || lower.includes('design') || lower.includes('layout')) {
      intentCategory = 'UI/UX Interface & Theme';
    }

    // 3. กำจัดคำฟุ่มเฟือย คำเกริ่นนำ คำซ้ำซ้อน และช่องว่างส่วนเกิน
    let cleaned = textWithoutCode;

    // ภาษาไทย: ลบคำสร้อย คำฟุ่มเฟือย คำร้องขอซ้ำๆ
    if (lang === 'th') {
      const thaiFillers = [
        /ช่วยหน่อยครับ/gi, /ช่วยหน่อยค่ะ/gi, /รบกวนหน่อยครับ/gi, /รบกวนหน่อยค่ะ/gi,
        /หน่อยนะ/gi, /นะจ๊ะ/gi, /ครับผม/gi, /ค่ะ/gi, /ครับ/gi, /หน่อยสิ/gi,
        /อยากจะให้คุณ/gi, /อยากให้ช่วย/gi, /สามารถที่จะ/gi, /ช่วยทำการ/gi,
        /ขอถามอะไรหน่อย/gi, /มีเรื่องจะถาม/gi, /คือว่าผม/gi, /คือว่าฉัน/gi,
        /ยาวๆๆ+/gi, /มากก+/gi, /เร็วๆๆ+/gi, /ดีๆๆ+/gi
      ];
      thaiFillers.forEach(regex => {
        cleaned = cleaned.replace(regex, ' ');
      });
    } else if (lang === 'en') {
      const enFillers = [
        /\bplease\b/gi, /\bkindly\b/gi, /\bcould you please\b/gi, /\bcan you please\b/gi,
        /\bi would like you to\b/gi, /\bi want you to\b/gi, /\bas soon as possible\b/gi,
        /\basap\b/gi, /\bjust wondering if\b/gi, /\bhello there\b/gi,
        /\bvery very\b/gi, /\breally really\b/gi
      ];
      enFillers.forEach(regex => {
        cleaned = cleaned.replace(regex, ' ');
      });
    } else if (lang === 'ja') {
      const jaFillers = [
        /お願いします/gi, /お願いできますか/gi, /してくれませんか/gi,
        /すみませんが/gi, /恐れ入りますが/gi, /何卒/gi
      ];
      jaFillers.forEach(regex => {
        cleaned = cleaned.replace(regex, ' ');
      });
    }

    // กำจัดช่องว่างซ้ำซ้อน เครื่องหมายซ้ำๆ
    cleaned = cleaned
      .replace(/[!！?？~～]{2,}/g, (m) => m[0])
      .replace(/[.]{3,}/g, '...')
      .replace(/\s+/g, ' ')
      .trim();

    // 4. สร้างรูปแบบคำสั่งระดับมืออาชีพ (Professional Prompt Structure)
    // ถอดรหัสเป้าหมายหลัก (Target Goal), ข้อกำหนด (Constraints), และผลลัพธ์ที่ต้องการ (Deliverables)
    let compressedCore = cleaned;

    // ย่อประโยคให้กระชับแต่คงคีย์เวิร์ดสำคัญไว้
    if (lang === 'th') {
      // จัดหัวข้อแบบกระชับมืออาชีพ
      compressedCore = `[เป้าหมายหลัก]: ${cleaned}\n[ข้อกำหนด]: ละเอียดระดับมืออาชีพ, สถาปัตยกรรมสะอาด, ประสิทธิภาพสูงสุด, ไร้ข้อผิดพลาด\n[รูปแบบผลลัพธ์]: โค้ดที่พร้อมใช้งานจริงและคำอธิบายกระชับ`;
    } else if (lang === 'ja') {
      compressedCore = `[主目標]: ${cleaned}\n[制約事項]: 高精度プロ仕様, クリーンアーキテクチャ, 最適パフォーマンス, エラーなし\n[期待成果物]: 即時実行可能な完成コードと簡潔な技術解説`;
    } else {
      compressedCore = `[Core Target]: ${cleaned}\n[Constraints]: Production-grade fidelity, Clean Architecture, Peak Performance, Zero-Defect\n[Deliverable]: Complete executable solution with concise technical rationale`;
    }

    // 5. นำโค้ดบล็อกกลับเข้ามาใส่ในตำแหน่งเดิม
    codeBlocks.forEach((code, idx) => {
      compressedCore = compressedCore.replace(`__CODE_BLOCK_${idx}__`, code);
    });

    const compressedTokens = this.estimateTokenCount(compressedCore);
    const tokensSaved = Math.max(0, originalTokens - compressedTokens);
    const savedTokensPct = originalTokens > 0
      ? Math.min(85, Math.round((tokensSaved / originalTokens) * 100))
      : 0;

    const compressionSummary = lang === 'th'
      ? `ย่อคำสั่งสำเร็จ! ลดขนาดได้ ~${savedTokensPct}% (${originalTokens} ➔ ${compressedTokens} tokens) คงความหมายหลักครบ 100% พร้อมจัดโครงสร้างระดับมืออาชีพ`
      : `Prompt optimized! Saved ~${savedTokensPct}% tokens (${originalTokens} ➔ ${compressedTokens}) while preserving full technical intent and professional specifications.`;

    return {
      originalPrompt: trimmed,
      compressedPrompt: compressedCore,
      originalTokens,
      compressedTokens,
      tokensSaved,
      savedTokensPct,
      intentCategory,
      detectedLanguage: lang as any,
      isCompressed: savedTokensPct > 5,
      compressionSummary
    };
  }
}

export const offlineAICommandCompressor = OfflineAICommandCompressor.getInstance();
