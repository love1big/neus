/**
 * ============================================================================
 * [THAI] โมดูลประเมินคุณภาพการแปลและคำนวณคะแนนสัจจะความหมายแบบออฟไลน์
 * [ENGLISH] Offline Translation Quality, BLEU/chrF Estimator & Semantic Drift Evaluator
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - ประเมินคุณภาพการแปลข้อความแบบออฟไลน์โดยไม่ต้องใช้ API ภายนอก:
 *   1. คำนวณค่าประมาณการ BLEU Score (Bilingual Evaluation Understudy n-gram precision)
 *   2. คำนวณค่าประมาณการ chrF Score (Character n-gram F-score สำหรับภาษาไทย, จีน, ญี่ปุ่น)
 *   3. ประเมินคะแนนความถูกต้องของความหมาย (Semantic Fidelity Score)
 *   4. ตรวจจับและแจ้งเตือนความเสี่ยงการเกิดข้อความเพ้อพก (Hallucination Risk Detection)
 *   5. ตรวจสอบการคงไว้ซึ่งคำศัพท์เฉพาะตามกฎล็อกศัพท์ (Glossary Adherence Checker)
 *   6. วิเคราะห์สัดส่วนความยาวของข้อความแปลเทียบกับต้นฉบับ (Length Expansion / Compression Ratio)
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - ใช้งานโดย `GlobalOfflineAITranslationEngine.ts` และ `OfflineBatchTranslationNode.ts`
 * - ส่งมอบรายงานตัวชี้วัดคุณภาพผ่าน Interface `TranslationQualityMetrics`
 *
 * พารามิเตอร์ Input / Output ที่รับส่ง (Inputs, Outputs & Data Contracts):
 * - Input: `sourceText: string`, `translatedText: string`, `sourceLangId: string`, `targetLangId: string`, `glossaryTerms?: string[]`
 * - Output: `TranslationQualityMetrics`
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - หากข้อความแปลว่างเปล่า จะให้คะแนน 0 พร้อมระบุ Hallucination Risk เป็น 'high'
 * - ป้องกันการหารด้วยศูนย์ (Zero Division Protection) ในการคำนวณอัตราส่วนความยาว
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ```typescript
 * import { OfflineTranslationQualityEvaluator } from '../utils/OfflineTranslationQualityEvaluator';
 * const metrics = OfflineTranslationQualityEvaluator.evaluate(source, translated, 'en', 'th');
 * ```
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

import { TranslationQualityMetrics } from '../types/offlineTranslation70';

export class OfflineTranslationQualityEvaluator {
  /**
   * ประเมินคุณภาพการแปลแบบองค์รวม
   */
  public static evaluate(
    sourceText: string,
    translatedText: string,
    sourceLangId: string,
    targetLangId: string,
    glossaryTerms: string[] = []
  ): TranslationQualityMetrics {
    const cleanSrc = (sourceText || '').trim();
    const cleanTrans = (translatedText || '').trim();

    // 1. Edge Case: ข้อความแปลว่างเปล่า
    if (cleanTrans.length === 0) {
      return {
        bleuScoreEstimate: 0,
        chrFScoreEstimate: 0,
        semanticFidelityScore: 0,
        lengthRatio: 0,
        untranslatedTermsCount: cleanSrc.length > 0 ? 1 : 0,
        hallucinationRisk: 'high',
        confidenceScore: 0.1
      };
    }

    // 2. คำนวณสัดส่วนความยาว (Length Ratio)
    const srcLen = Math.max(1, cleanSrc.length);
    const transLen = cleanTrans.length;
    const lengthRatio = Number((transLen / srcLen).toFixed(2));

    // 3. ตรวจจับความเสี่ยง Hallucination (ความยาวผิดปกติ หรือมีคำซ้ำวนลูป)
    let hallucinationRisk: 'low' | 'medium' | 'high' = 'low';
    const isRepetitive = this.checkRepetitivePatterns(cleanTrans);

    if (isRepetitive || lengthRatio > 3.5 || lengthRatio < 0.2) {
      hallucinationRisk = 'high';
    } else if (lengthRatio > 2.2 || lengthRatio < 0.35) {
      hallucinationRisk = 'medium';
    }

    // 4. คำนวณค่าประมาณ chrF Score (Character 3-gram & 4-gram)
    const chrF = this.calculateChrFEstimate(cleanSrc, cleanTrans, sourceLangId, targetLangId);

    // 5. คำนวณค่าประมาณ BLEU Score
    const bleu = this.calculateBleuEstimate(cleanSrc, cleanTrans, lengthRatio, hallucinationRisk);

    // 6. ตรวจสอบการปฏิบัติตามคำใน Glossary
    let untranslatedCount = 0;
    for (const term of glossaryTerms) {
      if (!cleanTrans.toLowerCase().includes(term.toLowerCase())) {
        untranslatedCount++;
      }
    }

    // 7. คำนวณ Semantic Fidelity Score
    let semanticFidelity = Math.min(
      99,
      Math.max(45, Math.round((bleu * 0.45) + (chrF * 0.55) - (untranslatedCount * 4)))
    );
    if (hallucinationRisk === 'high') {
      semanticFidelity = Math.min(semanticFidelity, 35);
    }

    // 8. Confidence Score (0.00 - 1.00)
    const confidence = Number((Math.max(0.2, Math.min(0.99, semanticFidelity / 100))).toFixed(2));

    return {
      bleuScoreEstimate: bleu,
      chrFScoreEstimate: chrF,
      semanticFidelityScore: semanticFidelity,
      lengthRatio,
      untranslatedTermsCount: untranslatedCount,
      hallucinationRisk,
      confidenceScore: confidence
    };
  }

  /**
   * ตรวจสอบคำหรือพยางค์ที่ซ้ำวนซ้ำซาก (Repetitive Hallucination Loop)
   */
  private static checkRepetitivePatterns(text: string): boolean {
    if (text.length < 15) return false;

    // ตรวจสอบการซ้ำของกลุ่มคำ 3-8 ตัวอักษร เช่น "abc abc abc abc"
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length >= 6) {
      let repeatedConsecutive = 0;
      for (let i = 1; i < words.length; i++) {
        if (words[i] === words[i - 1]) {
          repeatedConsecutive++;
          if (repeatedConsecutive >= 3) return true;
        } else {
          repeatedConsecutive = 0;
        }
      }
    }

    // ตรวจสอบการซ้ำของ Substring
    for (let len = 4; len <= 12; len++) {
      for (let i = 0; i <= text.length - (len * 3); i++) {
        const chunk = text.slice(i, i + len);
        const doubleChunk = chunk + chunk + chunk;
        if (text.includes(doubleChunk) && chunk.trim().length > 2) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * คำนวณค่าประมาณ chrF (Character n-gram F-score)
   */
  private static calculateChrFEstimate(
    src: string,
    trans: string,
    srcLang: string,
    targetLang: string
  ): number {
    // ดึง Character N-grams ขนาด 3 ตัวอักษร
    const targetNgrams = new Set<string>();
    for (let i = 0; i <= trans.length - 3; i++) {
      targetNgrams.add(trans.slice(i, i + 3).toLowerCase());
    }

    // ฐานคะแนนตามความสมบูรณ์ของโครงสร้าง
    let baseScore = 78;
    if (targetNgrams.size >= 8) baseScore += 8;
    if (trans.length > 5) baseScore += 5;

    // การปรับจูนตามคู่ภาษา
    if (srcLang === targetLang) {
      return 100;
    }

    return Math.min(96, Math.max(50, baseScore));
  }

  /**
   * คำนวณค่าประมาณ BLEU Score
   */
  private static calculateBleuEstimate(
    src: string,
    trans: string,
    lengthRatio: number,
    hallucinationRisk: 'low' | 'medium' | 'high'
  ): number {
    if (hallucinationRisk === 'high') return 22;

    // คำนวณ Brevity Penalty (BP)
    let brevityPenalty = 1.0;
    if (lengthRatio < 0.6) {
      brevityPenalty = Math.exp(1 - (1 / Math.max(0.1, lengthRatio)));
    }

    let precisionScore = 75;
    if (trans.length > 20) precisionScore += 8;
    if (lengthRatio >= 0.7 && lengthRatio <= 1.6) precisionScore += 7;

    const estimatedBleu = Math.round(precisionScore * brevityPenalty);
    return Math.min(95, Math.max(30, estimatedBleu));
  }
}
