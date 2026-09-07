/**
 * ============================================================================
 * [THAI] สัญญาข้อมูลและประเภทข้อมูลสำหรับแดชบอร์ดตรวจสอบและยืนยันความถูกต้องของการแปลตามบริบท
 * [ENGLISH] Data Contracts & Types for Automated Localization Verification Dashboard
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - กำหนดโครงสร้างข้อมูลสำหรับการตรวจสอบความถูกต้องของการแปลภาษาเทียบกับบริบทต้นทาง (Context Cross-Checking)
 * - ครอบคลุมการตรวจหาข้อผิดพลาดทางบริบท (Gaming HUD, RPG Dialogue, Lore, UI Strings, Quests)
 * - การตรวจสอบตัวแปรและเพลสโฮลเดอร์ (Placeholders & Variable Integrity เช่น {player}, %s, <color>)
 * - การประเมินความปลอดภัยของขนาดตัวอักษรต่อ UI (UI Overflow & Length Expansion Ratio)
 * - ทางเลือกการแปลตามบริบทเฉพาะ (Contextual Localization Variants)
 * - ข้อมูลสรุปและคะแนนสุขภาพการโลคัลไลซ์ (Verification Metrics & Health Score)
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - ใช้ร่วมกับ `LocalizationVerificationEngineNode.ts`
 * - แสดงผลผ่าน `LocalizationVerificationDashboard.tsx` ใน `GlobalOfflineAITranslationStudio.tsx`
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

import { GlobalLanguageProfile } from './offlineTranslation70';

export type LocalizationContextCategory =
  | 'gaming_hud_ui'       // ปุ่มในเกม, เมนู, HUD, แถบสถานะ (ต้องการความกระชับ ไม่ล้นกรอบ)
  | 'gaming_dialogue'     // บทสนทนาตัวละคร RPG/NPC (ต้องการอารมณ์ น้ำเสียง และความเป็นธรรมชาติ)
  | 'gaming_lore'         // เนื้อเรื่อง ปกรณัม ตำนาน โบราณคดี (ต้องการภาษาที่สละสลวย ดื่มด่ำ)
  | 'quest_objective'     // ภารกิจ คำสั่ง เงื่อนไขชัยชนะ (ต้องการความชัดเจน เข้าใจง่าย ไม่กำกวม)
  | 'store_monetization'  // ร้านค้า แพ็กเกจ ราคา เงื่อนไขการเติมเงิน (ต้องการความถูกต้องทางกฎหมาย/ชัดเจน)
  | 'technical_settings'  // การตั้งค่ากราฟิก เสียง ระบบ อินพุต (ต้องการศัพท์เทคนิคที่ได้มาตรฐาน)
  | 'general_conversation'; // บทสนทนาทั่วไป หรือบริบทกว้าง

export type VerificationSeverity = 'critical' | 'warning' | 'tip' | 'pass';

export interface LocalizationVerificationIssue {
  id: string;
  category:
    | 'variable_corruption'     // ตัวแปรหรือ placeholder หาย/ผิดรูป เช่น {0} กลายเป็น { 0 }
    | 'context_mismatch'        // แปลผิดบริบท เช่น "Save" แปลเป็น "ช่วยชีวิต" แทนที่จะเป็น "บันทึกข้อมูล"
    | 'ui_overflow_risk'        // ตัวอักษรยาวเกิน อาจล้นกล่อง UI หรือ Subtitle
    | 'tone_inconsistency'      // น้ำเสียงไม่สอดคล้องกับบริบท (ทางการเกินไปในบทสนทนา หรือห้วนเกินไปในข้อความระบบ)
    | 'negation_polarity_loss'  // คำปฏิเสธตกหล่น (เช่น "ห้าม" หรือ "ไม่" หายไป)
    | 'lore_glossary_deviation' // ไม่ตรงกับคำศัพท์เฉพาะของเกมที่กำหนดไว้
    | 'punctuation_bidi_defect';// เครื่องหมายวรรคตอนหรือทิศทางอักษรผิดเพี้ยน
  severity: VerificationSeverity;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  affectedSource?: string;
  affectedTarget?: string;
  suggestedFix?: string;
  autoFixAvailable: boolean;
}

export interface ContextualLocalizationVariant {
  id: string;
  contextCategory: LocalizationContextCategory;
  labelTh: string;
  labelEn: string;
  text: string;
  descriptionTh: string;
  characterCount: number;
  expansionPercent: number; // เทียบกับต้นฉบับ (+20%, -30%)
  uiSafetyRating: 'safe' | 'warning' | 'overflow_risk';
  badgeColor: string;
}

export interface LocalizationVerificationMetrics {
  overallAccuracyScore: number;     // 0 - 100 คะแนนรวมความแม่นยำในการโลคัลไลซ์
  contextAdherenceScore: number;    // 0 - 100 ความสอดคล้องกับบริบทที่เลือก
  variablePreservationScore: number;// 0 - 100 ความสมบูรณ์ของตัวแปรและโค้ด
  uiSafetyScore: number;            // 0 - 100 ความปลอดภัยด้านความยาวต่อ UI/HUD
  culturalNuanceScore: number;      // 0 - 100 ความสอดคล้องทางวัฒนธรรมและสำนวน
  status: 'optimal' | 'acceptable' | 'needs_review' | 'critical_defect';
  lengthExpansionRatio: number;     // อัตราส่วนความยาว เช่น 1.25 (ยาวขึ้น 25%)
  characterCountSource: number;
  characterCountTarget: number;
  detectedVariablesInSource: string[];
  detectedVariablesInTarget: string[];
  missingOrAlteredVariables: string[];
}

export interface SourceContextInsights {
  detectedContext: LocalizationContextCategory;
  detectedIntentTh: string;
  grammaticalToneTh: string;
  targetCulturalAdaptationNotes: string[];
  potentialUiOverflowRisk: boolean;
  entityPreservationStatus: 'intact' | 'corrupted' | 'partial' | 'none_present';
}

export interface LocalizationVerificationReport {
  id: string;
  timestamp: number;
  sourceText: string;
  translatedText: string;
  sourceLang: GlobalLanguageProfile;
  targetLang: GlobalLanguageProfile;
  activeContext: LocalizationContextCategory;
  metrics: LocalizationVerificationMetrics;
  insights: SourceContextInsights;
  issues: LocalizationVerificationIssue[];
  suggestedVariants: ContextualLocalizationVariant[];
  autoHealedTranslation: string;
  isFullyVerified: boolean;
}

export interface BatchLocalizationItem {
  id: string;
  keyName: string;
  contextCategory: LocalizationContextCategory;
  sourceText: string;
  translatedText: string;
  metrics?: LocalizationVerificationMetrics;
  issuesCount?: {
    critical: number;
    warning: number;
    tip: number;
  };
  status: 'pending' | 'verified_pass' | 'verified_warning' | 'verified_critical';
  suggestedFix?: string;
}
