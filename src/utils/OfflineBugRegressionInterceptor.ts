/**
 * ====================================================================================================
 * MODULE: OfflineBugRegressionInterceptor.ts
 * PURPOSE: Proactive Pre-Execution Static Analysis & Real-Time Zero-Regression Interceptor
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์:
 * 1. ตรวจจับและสกัดกั้นโค้ดที่มีรูปแบบ (Pattern) ตรงกับบัคในอดีตก่อนที่โค้ดจะถูกรันหรือบันทึก
 * 2. ประเมินความเสี่ยงระดับความรุนแรง (Critical Crash, High Regression, Warning) แบบ Real-time
 * 3. ชี้พิกัดบรรทัด (Line & Column Number) ที่เกิด Anti-Pattern อย่างแม่นยำ
 * 4. มอบแนวทางแก้ไขทันที (1-Click Auto-Patch Fix) เพื่อเปลี่ยนโค้ดอันตรายเป็นโค้ดที่มีภูมิคุ้มกัน (Immune Code)
 * 5. บันทึกสถิติการป้องกันความผิดพลาดซ้ำ (Prevented Bug Counter) เพื่อยืนยันว่าไม่มีการทำผิดซ้ำ 100%
 * 
 * ARCHITECTURE & SYSTEM INTEGRATION:
 * - ดึง Anti-Pattern Rules จาก OfflineErrorMemoryStore
 * - เรียกใช้งานโดย CodeEditor, OfflineAICodingAssistant, AICodeAgentStudio และ ContinuousErrorLearningStudio
 * 
 * ERROR HANDLING & FALLBACKS:
 * - ป้องกัน Safe Regex Evaluation ด้วย Try/Catch แยกทีละกฎ เพื่อไม่ให้กฎที่ผิดพลาดทำให้กระบวนการทั้งหมดหยุดชะงัก
 * ====================================================================================================
 */

import { BugKnowledgeRecord } from './OfflineAIErrorImmunityCore';
import { OfflineErrorMemoryStore } from './OfflineErrorMemoryStore';

export interface InterceptionDiagnostic {
  id: string;
  ruleId: string;
  bugRecordId: string;
  bugTitle: string;
  bugTitleThai: string;
  domain: string;
  severity: 'CRITICAL_CRASH' | 'HIGH_REGRESSION' | 'MEDIUM_DEGRADATION' | 'LOW_COSMETIC';
  lineNumber: number;
  columnNumber: number;
  matchedSnippet: string;
  explanationThai: string;
  explanationEng: string;
  suggestedPatch: string;
}

export interface InterceptionScanReport {
  scannedLines: number;
  scannedBytes: number;
  scanDurationMs: number;
  diagnostics: InterceptionDiagnostic[];
  isImmune: boolean; // True if 0 regressions found
  zeroRegressionScore: number; // 0 - 100%
}

export class OfflineBugRegressionInterceptor {
  /**
   * สแกนโค้ดอย่างละเอียดเปรียบเทียบกับฐานความจำบัคทั้งหมด
   */
  public static scanCode(code: string, filename: string = 'ActiveModule.ts'): InterceptionScanReport {
    const startTime = performance.now();
    const records = OfflineErrorMemoryStore.getAllRecords();
    const lines = code.split('\n');
    const diagnostics: InterceptionDiagnostic[] = [];

    for (const record of records) {
      const antiPattern = record.antiPattern;
      if (!antiPattern || !antiPattern.forbiddenCodeRegex || antiPattern.forbiddenCodeRegex.length === 0) {
        continue;
      }

      for (const regexStr of antiPattern.forbiddenCodeRegex) {
        try {
          const regex = new RegExp(regexStr, 'gi');
          
          // Check line by line for precise line numbers
          lines.forEach((lineText, lineIdx) => {
            const match = regex.exec(lineText);
            if (match) {
              diagnostics.push({
                id: `DIAG_${record.id}_L${lineIdx + 1}_${Math.random().toString(36).substring(2, 6)}`,
                ruleId: antiPattern.ruleId,
                bugRecordId: record.id,
                bugTitle: record.title,
                bugTitleThai: record.titleThai,
                domain: record.domain,
                severity: record.severity,
                lineNumber: lineIdx + 1,
                columnNumber: match.index + 1,
                matchedSnippet: match[0],
                explanationThai: `[ตรวจพบบัคเดิมในอดีต]: ${record.titleThai} — ${antiPattern.patternDescriptionThai}`,
                explanationEng: `[Zero-Regression Warning]: Detected known anti-pattern: ${record.title}`,
                suggestedPatch: record.immuneCodeSample
              });

              // Record prevention counter
              OfflineErrorMemoryStore.recordPrevention(record.id);
            }
          });
        } catch (err) {
          // Ignore invalid regex patterns safely
        }
      }
    }

    const duration = performance.now() - startTime;
    const isImmune = diagnostics.length === 0;
    const zeroRegressionScore = isImmune 
      ? 100 
      : Math.max(0, 100 - (diagnostics.length * 15));

    return {
      scannedLines: lines.length,
      scannedBytes: new Blob([code]).size,
      scanDurationMs: parseFloat(duration.toFixed(2)),
      diagnostics,
      isImmune,
      zeroRegressionScore
    };
  }

  /**
   * นำ Immune Patch ไปแทนที่โค้ดที่มีปัญหาโดยอัตโนมัติ (1-Click Auto Immunity Fix)
   */
  public static applyImmunePatch(code: string, diagnostic: InterceptionDiagnostic): string {
    const lines = code.split('\n');
    if (diagnostic.lineNumber > 0 && diagnostic.lineNumber <= lines.length) {
      // Replace the problematic line with the suggested patch
      lines[diagnostic.lineNumber - 1] = `// [IMMUNE AUTO-PATCH APPLIED]: Resolved ${diagnostic.bugTitle}\n${diagnostic.suggestedPatch}`;
      return lines.join('\n');
    }
    return code;
  }
}
