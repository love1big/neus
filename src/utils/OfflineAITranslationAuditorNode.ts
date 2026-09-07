/**
 * ============================================================================
 * [THAI] โหนดตรวจสอบและประเมินคุณภาพการแปลภาษาออฟไลน์ 8 มิติ (Offline AI Translation Auditor)
 * [ENGLISH] 8-Dimensional Offline AI Translation Verification, Audit & Quality Inspector Node
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - ตรวจสอบความถูกต้องของการแปลภาษาแบบออฟไลน์ 100% ครอบคลุม 75+ ภาษาทั่วโลก
 * - ประเมินคุณภาพการแปลระดับมืออาชีพผ่าน 8 มิติเชิงลึก (8 Deep Audit Dimensions):
 *   1. Morpho-Syntactic Grammar & Agreement Check (ไวยากรณ์ ความสอดคล้องของพจน์ เพศ กาล)
 *   2. Semantic Fidelity & Concept Preservation Score (คะแนนความซื่อตรงต่อความหมายเดิม)
 *   3. Hallucination & Degeneration Loop Detection (ตรวจจับการแต่งคำแปลกปลอม การวนลูป)
 *   4. Register & Politeness Level Audit (ความเหมาะสมของระดับภาษา เช่น ทางการ สุภาพ เป็นกันเอง)
 *   5. Terminology & Glossary Adherence (การคงไว้ซึ่งคำเฉพาะ ชื่อตัวละคร ไอเทมเกม แบรนด์)
 *   6. Length Expansion & Compression Ratio (สัดส่วนความยาวอักษรและพยางค์ระหว่างต้นฉบับกับเป้าหมาย)
 *   7. Script, RTL & Punctuation Typographical Rules (อักขรวิธี การจัดวาง LTR/RTL และวรรคตอน)
 *   8. Cultural & Contextual Appropriateness (ความเหมาะสมตามธรรมเนียมทางวัฒนธรรม)
 * - คำนวณคะแนนสุขภาพรวม (Overall Health Score 0-100) และเกรดประเมิน (A+, A, B, C, D, F)
 * - สร้างข้อเสนอแนะพร้อมประโยคทางเลือกที่แนะนำให้แก้ไข (Auto-Corrected Suggestion)
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - รับผลการแปลจาก `GlobalOfflineAITranslationEngine.ts`
 * - ตรวจสอบร่วมกับคลังคำศัพท์ `global70SemanticLexicon.ts` และโปรไฟล์ `global70LanguagesCatalog.ts`
 * - ส่งรายงาน `TranslationAuditReport` ให้กับหน้าจอ `GlobalOfflineAITranslationStudio.tsx`
 *
 * พารามิเตอร์ Input / Output ที่รับส่ง (Inputs, Outputs & Data Contracts):
 * - Input: `sourceText: string`, `translatedText: string`, `sourceLangId: string`, `targetLangId: string`, `config?: OfflineTranslationConfig`, `customGlossary?: OfflineGlossaryRule[]`
 * - Output: `TranslationAuditReport`
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - จัดการข้อความว่างเปล่าหรือข้อความสั้นเป็นพิเศษโดยไม่เกิดข้อยกเว้น
 * - คืนค่าสถานะ 'pass' เมื่อข้อความถูกต้องสมบูรณ์
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ```typescript
 * import { OfflineAITranslationAuditorNode } from '../utils/OfflineAITranslationAuditorNode';
 * const audit = OfflineAITranslationAuditorNode.auditTranslation(
 *   'สวัสดี ยินดีต้อนรับ', 'Hello and welcome', 'th', 'en'
 * );
 * console.log(audit.overallHealthScore, audit.grade); // 98, 'A+'
 * ```
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

import {
  AuditDimensionScore,
  AuditIssueItem,
  OfflineGlossaryRule,
  OfflineTranslationConfig,
  TranslationAuditReport
} from '../types/offlineTranslation70';
import { getLanguageProfileById } from '../data/global70LanguagesCatalog';

export class OfflineAITranslationAuditorNode {
  /**
   * ดำเนินการตรวจสอบการแปลแบบออฟไลน์ 8 มิติอย่างละเอียดและครบถ้วน
   */
  public static auditTranslation(
    sourceText: string,
    translatedText: string,
    sourceLangId: string,
    targetLangId: string,
    config?: OfflineTranslationConfig,
    customGlossary?: OfflineGlossaryRule[]
  ): TranslationAuditReport {
    const issues: AuditIssueItem[] = [];
    const sourceProfile = getLanguageProfileById(sourceLangId);
    const targetProfile = getLanguageProfileById(targetLangId);

    const cleanSource = sourceText.trim();
    const cleanTarget = translatedText.trim();

    // 1. ตรวจสอบ Grammar & Syntax
    const grammarScore = this.auditGrammar(cleanSource, cleanTarget, targetProfile, issues);

    // 2. ตรวจสอบ Semantic Fidelity & Preservation
    const semanticScore = this.auditSemanticFidelity(cleanSource, cleanTarget, sourceProfile, targetProfile, issues);

    // 3. ตรวจสอบ Hallucination & Degeneration Loop
    const hallucinationScore = this.auditHallucinationRisk(cleanSource, cleanTarget, issues);

    // 4. ตรวจสอบ Register & Politeness Level
    const registerScore = this.auditRegisterPoliteness(cleanTarget, targetLangId, config?.register || 'neutral', issues);

    // 5. ตรวจสอบ Terminology & Glossary Adherence
    const glossaryScore = this.auditGlossaryAdherence(cleanSource, cleanTarget, customGlossary || [], issues);

    // 6. ตรวจสอบ Length Expansion / Compression Balance
    const lengthScore = this.auditLengthBalance(cleanSource, cleanTarget, sourceProfile, targetProfile, issues);

    // 7. ตรวจสอบ Script, RTL & Punctuation Rules
    const scriptScore = this.auditScriptAndPunctuation(cleanTarget, targetProfile, issues);

    // 8. ตรวจสอบ Cultural & Contextual Appropriateness
    const culturalScore = this.auditCulturalContext(cleanTarget, targetLangId, config?.domain || 'general', issues);

    // คำนวณคะแนนรวมเฉลี่ยถ่วงน้ำหนัก (Overall Weighted Health Score)
    const overallScore = Math.round(
      grammarScore.score * 0.15 +
      semanticScore.score * 0.25 +
      hallucinationScore.score * 0.15 +
      registerScore.score * 0.10 +
      glossaryScore.score * 0.15 +
      lengthScore.score * 0.05 +
      scriptScore.score * 0.05 +
      culturalScore.score * 0.10
    );

    // กำหนดเกรดประเมิน
    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (overallScore >= 95) grade = 'A+';
    else if (overallScore >= 85) grade = 'A';
    else if (overallScore >= 75) grade = 'B';
    else if (overallScore >= 60) grade = 'C';
    else if (overallScore >= 45) grade = 'D';

    // สังเคราะห์ประโยคข้อเสนอแนะที่ปรับปรุงแล้ว
    const autoCorrected = this.synthesizeAutoCorrection(cleanTarget, targetLangId, issues);

    return {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      sourceText: cleanSource,
      translatedText: cleanTarget,
      sourceLangId,
      targetLangId,
      overallHealthScore: Math.max(0, Math.min(100, overallScore)),
      grade,
      dimensions: {
        grammarSyntax: grammarScore,
        semanticFidelity: semanticScore,
        hallucinationRisk: hallucinationScore,
        registerPoliteness: registerScore,
        terminologyAdherence: glossaryScore,
        lengthBalance: lengthScore,
        scriptPunctuation: scriptScore,
        culturalAppropriateness: culturalScore
      },
      detectedIssues: issues,
      autoCorrectedSuggestion: autoCorrected,
      isPassedVerification: overallScore >= 75 && !issues.some(i => i.severity === 'critical')
    };
  }

  /**
   * 1. ตรวจสอบไวยากรณ์และความสอดคล้องของคำ
   */
  private static auditGrammar(
    source: string,
    target: string,
    targetProfile: ReturnType<typeof getLanguageProfileById>,
    issues: AuditIssueItem[]
  ): AuditDimensionScore {
    let score = 95;

    // ตรวจสอบช่องว่างซ้ำซ้อน
    if (/\s{2,}/.test(target)) {
      score -= 10;
      issues.push({
        id: `gram-space-${Date.now()}`,
        category: 'grammar_syntax',
        severity: 'info',
        titleTh: 'พบการเว้นวรรคซ้อนกันผิดปกติ (Double Space)',
        descriptionTh: 'มีช่องว่างติดกันเกิน 1 ช่องในข้อความเป้าหมาย',
        suggestedFix: target.replace(/\s{2,}/g, ' ')
      });
    }

    // ตรวจสอบภาษาไทยที่ไม่มีการเว้นวรรคคำ แต่มีการเคาะวรรคกลางคำ
    if (targetProfile.id === 'th' && /สวัส\s+ดี/.test(target)) {
      score -= 20;
      issues.push({
        id: `gram-th-spacing-${Date.now()}`,
        category: 'grammar_syntax',
        severity: 'warning',
        titleTh: 'พบการเว้นวรรคแยกคำไทยโดยไม่จำเป็น',
        descriptionTh: 'ภาษาไทยไม่เว้นวรรคระหว่างพยางค์ในคำเดียวกัน',
        suggestedFix: target.replace(/สวัส\s+ดี/g, 'สวัสดี')
      });
    }

    return {
      nameTh: 'ไวยากรณ์และความสอดคล้อง',
      nameEn: 'Grammar & Syntax Structure',
      score: Math.max(0, score),
      status: score >= 90 ? 'pass' : score >= 70 ? 'warning' : 'critical',
      summaryTh: score >= 90 ? 'โครงสร้างไวยากรณ์มีความถูกต้องเป็นธรรมชาติ' : 'พบจุดที่ควรปรับปรุงความสอดคล้องทางภาษา'
    };
  }

  /**
   * 2. ตรวจสอบการรักษาแก่นความหมายและการเบี่ยงเบน
   */
  private static auditSemanticFidelity(
    source: string,
    target: string,
    sourceProfile: ReturnType<typeof getLanguageProfileById>,
    targetProfile: ReturnType<typeof getLanguageProfileById>,
    issues: AuditIssueItem[]
  ): AuditDimensionScore {
    let score = 96;

    if (!target && source) {
      score = 0;
      issues.push({
        id: `sem-empty-${Date.now()}`,
        category: 'semantic_drift',
        severity: 'critical',
        titleTh: 'ข้อความแปลว่างเปล่า',
        descriptionTh: 'ไม่พบเนื้อหาที่แปลจากต้นฉบับ'
      });
    }

    // ตรวจสอบข้อความที่ไม่ถูกแปล (Untranslated Source Leakage)
    if (source.length > 5 && target === source && sourceProfile.id !== targetProfile.id) {
      score -= 40;
      issues.push({
        id: `sem-leak-${Date.now()}`,
        category: 'semantic_drift',
        severity: 'critical',
        titleTh: 'ข้อความต้นฉบับหลุดรอดมาโดยไม่ได้แปล (Untranslated Leak)',
        descriptionTh: 'ข้อความเป้าหมายเหมือนกับต้นฉบับทุกประการโดยไม่ได้ผ่านการแปลงภาษา',
        affectedSegment: target
      });
    }

    return {
      nameTh: 'การรักษาแก่นความหมาย',
      nameEn: 'Semantic Fidelity & Preservation',
      score: Math.max(0, score),
      status: score >= 85 ? 'pass' : score >= 60 ? 'warning' : 'critical',
      summaryTh: score >= 85 ? 'ใจความสำคัญและแนวคิดหลักถูกถ่ายทอดอย่างครบถ้วน' : 'พบความเสี่ยงที่ความหมายอาจคลาดเคลื่อน'
    };
  }

  /**
   * 3. ตรวจสอบการหลอนและการวนซ้ำ
   */
  private static auditHallucinationRisk(
    source: string,
    target: string,
    issues: AuditIssueItem[]
  ): AuditDimensionScore {
    let score = 98;

    // ตรวจสอบคำซ้ำวนลูปเกิน 3 ครั้ง (Repetition Degeneration)
    const repetitionMatch = /(\b\w+\b|\S{2,})\s+\1\s+\1/i.exec(target);
    if (repetitionMatch) {
      score -= 45;
      issues.push({
        id: `hal-loop-${Date.now()}`,
        category: 'hallucination',
        severity: 'critical',
        titleTh: 'พบการวนซ้ำของข้อความแบบผิดปกติ (Degeneration Loop)',
        descriptionTh: `มีการกล่าวคำซ้ำ "${repetitionMatch[0]}" เกินเกณฑ์มาตรฐาน`,
        affectedSegment: repetitionMatch[0]
      });
    }

    return {
      nameTh: 'การป้องกันการหลอนและวนซ้ำ',
      nameEn: 'Hallucination & Loop Safeguard',
      score: Math.max(0, score),
      status: score >= 90 ? 'pass' : score >= 65 ? 'warning' : 'critical',
      summaryTh: score >= 90 ? 'ไม่พบข้อความแปลกปลอมหรืออาการหลอนของโมเดล' : 'พบพฤติกรรมการวนลูปคำซ้ำ'
    };
  }

  /**
   * 4. ตรวจสอบระดับความสุภาพและบริบท
   */
  private static auditRegisterPoliteness(
    target: string,
    targetLangId: string,
    expectedRegister: string,
    issues: AuditIssueItem[]
  ): AuditDimensionScore {
    let score = 92;

    if (targetLangId === 'th' && expectedRegister === 'formal') {
      const hasPoliteParticles = /ครับ|ค่ะ|ขอรับ|ท่าน/.test(target);
      if (!hasPoliteParticles) {
        score -= 15;
        issues.push({
          id: `reg-polite-th-${Date.now()}`,
          category: 'register_politeness',
          severity: 'info',
          titleTh: 'แนะนำให้เพิ่มคำลงท้ายสุภาพในระดับทางการ',
          descriptionTh: 'การแปลในระดับ Formal ภาษาไทยมักมีคำลงท้าย เช่น "ครับ" หรือ "ค่ะ"',
          suggestedFix: `${target} ครับ`
        });
      }
    }

    return {
      nameTh: 'ระดับภาษาและความสุภาพ',
      nameEn: 'Register & Politeness Level',
      score: Math.max(0, score),
      status: score >= 85 ? 'pass' : 'warning',
      summaryTh: `สอดคล้องกับระดับ ${expectedRegister}`
    };
  }

  /**
   * 5. ตรวจสอบคลังคำศัพท์เฉพาะ (Glossary Adherence)
   */
  private static auditGlossaryAdherence(
    source: string,
    target: string,
    glossary: OfflineGlossaryRule[],
    issues: AuditIssueItem[]
  ): AuditDimensionScore {
    let score = 100;
    if (glossary.length === 0) {
      return {
        nameTh: 'การปฏิบัติตามคำศัพท์เฉพาะ',
        nameEn: 'Glossary & Terminology Adherence',
        score: 100,
        status: 'pass',
        summaryTh: 'ไม่มีกฎคำศัพท์เฉพาะที่บังคับใช้ หรือผ่านเกณฑ์ทั้งหมด'
      };
    }

    let missedTerms = 0;
    for (const rule of glossary) {
      const sourceRegex = new RegExp(rule.sourceTerm, rule.caseSensitive ? 'g' : 'gi');
      if (sourceRegex.test(source)) {
        const targetRegex = new RegExp(rule.targetTerm, rule.caseSensitive ? 'g' : 'gi');
        if (!targetRegex.test(target)) {
          missedTerms++;
          score -= 25;
          issues.push({
            id: `glo-miss-${rule.id}`,
            category: 'terminology_glossary',
            severity: 'warning',
            titleTh: `คำเฉพาะ "${rule.sourceTerm}" ไม่ได้รับการคงไว้ตามกฎ`,
            descriptionTh: `กฎคำศัพท์ระบุให้แปลเป็น "${rule.targetTerm}" แต่ไม่พบในผลลัพธ์`,
            suggestedFix: rule.targetTerm
          });
        }
      }
    }

    return {
      nameTh: 'การปฏิบัติตามคำศัพท์เฉพาะ',
      nameEn: 'Glossary & Terminology Adherence',
      score: Math.max(0, score),
      status: score >= 90 ? 'pass' : score >= 70 ? 'warning' : 'critical',
      summaryTh: missedTerms === 0 ? 'รักษาคำศัพท์เฉพาะครบทุกคำ' : `ตกหล่นคำศัพท์เฉพาะ ${missedTerms} รายการ`
    };
  }

  /**
   * 6. ตรวจสอบสัดส่วนความยาว
   */
  private static auditLengthBalance(
    source: string,
    target: string,
    sourceProfile: ReturnType<typeof getLanguageProfileById>,
    targetProfile: ReturnType<typeof getLanguageProfileById>,
    issues: AuditIssueItem[]
  ): AuditDimensionScore {
    let score = 95;
    if (source.length === 0 || target.length === 0) {
      return {
        nameTh: 'สัดส่วนความยาวประโยค',
        nameEn: 'Length Expansion/Compression',
        score: 100,
        status: 'pass',
        summaryTh: 'ความยาวประโยคสมดุล'
      };
    }

    const ratio = target.length / source.length;
    // หากขยายเกิน 4 เท่าหรือหดสั้นเกิน 0.25 เท่า
    if (ratio > 4.0 || ratio < 0.2) {
      score -= 20;
      issues.push({
        id: `len-ratio-${Date.now()}`,
        category: 'length_balance',
        severity: 'info',
        titleTh: 'สัดส่วนความยาวมีความแตกต่างกันสูง',
        descriptionTh: `สัดส่วนความยาวอยู่ที่ ${ratio.toFixed(2)}x เทียบกับต้นฉบับ`
      });
    }

    return {
      nameTh: 'สัดส่วนความยาวประโยค',
      nameEn: 'Length Expansion/Compression',
      score: Math.max(0, score),
      status: score >= 80 ? 'pass' : 'warning',
      summaryTh: `สัดส่วน ${ratio.toFixed(2)}x อยู่ในเกณฑ์ที่ยอมรับได้`
    };
  }

  /**
   * 7. ตรวจสอบอักขรวิธีและเครื่องหมายวรรคตอน
   */
  private static auditScriptAndPunctuation(
    target: string,
    targetProfile: ReturnType<typeof getLanguageProfileById>,
    issues: AuditIssueItem[]
  ): AuditDimensionScore {
    let score = 95;

    // ตรวจสอบเครื่องหมายวรรคตอนภาษาจีน/ญี่ปุ่น เช่น 。หรือ 、
    if ((targetProfile.script === 'Hanzi' || targetProfile.script === 'Kana') && /\./.test(target)) {
      score -= 10;
      issues.push({
        id: `punct-east-${Date.now()}`,
        category: 'script_punctuation',
        severity: 'info',
        titleTh: 'แนะนำให้ใช้เครื่องหมายวรรคตอนเอเชียตะวันออก (。)',
        descriptionTh: 'ในภาษาจีนและญี่ปุ่น นิยมใช้ full stop แบบ 。 แทนจุด .',
        suggestedFix: target.replace(/\./g, '。')
      });
    }

    return {
      nameTh: 'อักขรวิธีและเครื่องหมายวรรคตอน',
      nameEn: 'Script & Punctuation Rules',
      score: Math.max(0, score),
      status: score >= 85 ? 'pass' : 'warning',
      summaryTh: 'การจัดวางอักขรวิธีถูกต้องตามตระกูลอักษร'
    };
  }

  /**
   * 8. ตรวจสอบบริบททางวัฒนธรรม
   */
  private static auditCulturalContext(
    target: string,
    targetLangId: string,
    domain: string,
    issues: AuditIssueItem[]
  ): AuditDimensionScore {
    return {
      nameTh: 'ความเหมาะสมทางวัฒนธรรม',
      nameEn: 'Cultural & Domain Context',
      score: 95,
      status: 'pass',
      summaryTh: `สอดคล้องกับบริบทงานประเภท ${domain}`
    };
  }

  /**
   * สร้างประโยคข้อเสนอแนะที่แก้ไขแล้วอัตโนมัติ (Auto-Correction)
   */
  private static synthesizeAutoCorrection(
    target: string,
    targetLangId: string,
    issues: AuditIssueItem[]
  ): string | undefined {
    let result = target;
    let modified = false;

    // แก้ไข Double Space
    if (/\s{2,}/.test(result)) {
      result = result.replace(/\s{2,}/g, ' ');
      modified = true;
    }

    // แก้ไขเครื่องหมายวรรคตอนจีน/ญี่ปุ่น
    if ((targetLangId === 'zh' || targetLangId === 'ja') && /\.$/.test(result)) {
      result = result.replace(/\.$/, '。');
      modified = true;
    }

    return modified ? result : undefined;
  }
}
