/**
 * ============================================================================
 * [THAI] สัญญาข้อมูลและประเภทข้อมูลสำหรับระบบ AI แปลภาษาออฟไลน์ 70++ ภาษาทั่วโลก
 * [ENGLISH] Data Contracts and Types for 70+ Global Languages Offline AI Translation Engine
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - กำหนด Type Definitions, Data Contracts, และ Interfaces ครบถ้วนสำหรับ:
 *   1. โปรไฟล์ภาษา 70++ ภาษาที่คนใช้มากที่สุดในโลก (ISO Code, Native Name, Family, Speakers, RTL/LTR)
 *   2. พารามิเตอร์การตั้งค่าการแปลแบบออฟไลน์ (Offline Translation Config: Register, Domain, Speed)
 *   3. รายงานผลการแปลระดับลึก (Translation Result, Subword Tokens, Quality Metrics, Semantic Drift)
 *   4. พจนานุกรมและคลังคำศัพท์เฉพาะ (Glossary & Terminology Preservation Rules)
 *   5. ผลการแปลเอกสาร/ไฟล์แบบกลุ่ม (Batch Translation Job & Subtitle SRT Support)
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - นำไปใช้โดย `global70LanguagesCatalog.ts`, `GlobalOfflineAITranslationEngine.ts`,
 *   `OfflineTranslationQualityEvaluator.ts`, `OfflineBatchTranslationNode.ts`
 *   และหน้าจอแสดงผล `GlobalOfflineAITranslationStudio.tsx`
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - มี Fallback ภาษาเริ่มต้น (Source: 'auto' หรือ 'en', Target: 'th')
 * - ป้องกัน Unidentified Tokens และ Unknown Punctuation ด้วย Fallback Token Pass-through
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ```typescript
 * import { OfflineTranslationConfig, OfflineTranslationResult } from '../types/offlineTranslation70';
 * ```
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

export type WritingDirection = 'ltr' | 'rtl';

export type LanguageScriptFamily =
  | 'Latin'
  | 'Cyrillic'
  | 'Arabic'
  | 'Devanagari'
  | 'Thai'
  | 'Hanzi'
  | 'Kana'
  | 'Hangul'
  | 'Bengali'
  | 'Tamil'
  | 'Telugu'
  | 'Gujarati'
  | 'Gurmukhi'
  | 'Kannada'
  | 'Malayalam'
  | 'Odia'
  | 'Burmese'
  | 'Khmer'
  | 'Lao'
  | 'Sinhala'
  | 'Greek'
  | 'Hebrew'
  | 'Geʽez'
  | 'Armenian';

export type TranslationRegister =
  | 'neutral'     // สุภาพปานกลาง ทั่วไป
  | 'formal'      // ทางการ รัฐพิธี เอกสารราชการ
  | 'casual'      // สนทนาทั่วไป เพื่อนร่วมงาน เป็นกันเอง
  | 'literary'    // วรรณกรรม นิยาย ละคร บรรยายอารมณ์
  | 'technical';  // เทคนิค วิศวกรรม การแพทย์ เกมมิ่ง

export type TranslationDomain =
  | 'general'
  | 'gaming'
  | 'software_ui'
  | 'dialogue'
  | 'business'
  | 'travel'
  | 'academic';

export interface GlobalLanguageProfile {
  id: string;                      // รหัส ISO เช่น 'th', 'en', 'zh', 'hi', 'es'
  iso639_1: string;                // รหัส 2 ตัวอักษร
  iso639_3: string;                // รหัส 3 ตัวอักษร
  nameThai: string;                // ชื่อภาษาภาษาไทย เช่น 'ภาษาไทย', 'ภาษาจีนกลาง'
  nameEnglish: string;             // ชื่อภาษาภาษาอังกฤษ เช่น 'Thai', 'Mandarin Chinese'
  nativeName: string;              // ชื่อภาษาในภาษาท้องถิ่น เช่น 'ไทย', '中文', 'Español'
  family: string;                  // ตระกูลภาษา เช่น 'Kra-Dai', 'Sino-Tibetan', 'Indo-European'
  script: LanguageScriptFamily;     // อักขรวิธี เช่น 'Thai', 'Hanzi', 'Latin', 'Devanagari'
  direction: WritingDirection;     // 'ltr' หรือ 'rtl'
  speakersCountMillion: number;    // จำนวนผู้พูดโดยประมาณ (ล้านคน)
  regionOfOrigin: string;          // ภูมิภาคหลัก
  sampleSentence: string;          // ตัวอย่างประโยคทักทาย/ใช้งานจริง
  sampleTranslationEn: string;     // คำแปลประโยคตัวอย่างเป็นภาษาอังกฤษ
  sampleTranslationTh: string;     // คำแปลประโยคตัวอย่างเป็นภาษาไทย
  hasSpaceDelimiter: boolean;      // มีเว้นวรรคระหว่างคำหรือไม่ (false สำหรับ Thai, Chinese, Japanese, Lao, Khmer)
  tonal: boolean;                  // เป็นภาษาวรรณยุกต์หรือไม่
}

export interface OfflineGlossaryRule {
  id: string;
  sourceTerm: string;
  targetTerm: string;
  sourceLang: string;
  targetLang: string;
  caseSensitive: boolean;
  domain: TranslationDomain;
  notes?: string;
}

export interface OfflineTranslationConfig {
  sourceLangId: string;           // 'auto' หรือรหัสภาษา เช่น 'en', 'th', 'zh'
  targetLangId: string;           // รหัสภาษาเป้าหมาย เช่น 'th', 'ja', 'es'
  register: TranslationRegister;   // ระดับความเป็นทางการ
  domain: TranslationDomain;       // บริบทหัวข้อ
  preserveFormatting: boolean;    // รักษารูปแบบ Markdown / แท็กโค้ด
  preserveGlossary: boolean;      // บังคับใช้คลังคำศัพท์เฉพาะ
  subwordTokenization: boolean;   // ใช้อัลกอริทึม BPE / Subword ย่อยคำ
  detectToneDrift: boolean;       // ตรวจจับการผิดเพี้ยนของน้ำเสียง
}

export interface SubwordToken {
  text: string;
  posTag?: string;
  weight: number;
  isLockedGlossary?: boolean;
}

export interface TranslationQualityMetrics {
  bleuScoreEstimate: number;      // 0 - 100
  chrFScoreEstimate: number;       // 0 - 100
  semanticFidelityScore: number;  // 0 - 100
  lengthRatio: number;             // สัดส่วนความยาวเทียบกับต้นฉบับ
  untranslatedTermsCount: number;  // คำที่ไม่ได้แปลหรือทับศัพท์
  hallucinationRisk: 'low' | 'medium' | 'high';
  confidenceScore: number;         // 0.00 - 1.00
}

export interface OfflineTranslationResult {
  id: string;
  sourceLangId: string;
  detectedSourceLangId: string;
  targetLangId: string;
  sourceText: string;
  translatedText: string;
  backTranslatedText: string;
  subwordTokens: SubwordToken[];
  appliedGlossaryTerms: string[];
  metrics: TranslationQualityMetrics;
  processingTimeMs: number;
  timestamp: number;
}

export interface BatchTranslationItem {
  id: string;
  key?: string;
  sourceText: string;
  translatedText?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metrics?: TranslationQualityMetrics;
}

export interface BatchTranslationJob {
  jobId: string;
  fileName: string;
  format: 'json' | 'csv' | 'srt' | 'txt' | 'markdown';
  sourceLangId: string;
  targetLangId: string;
  totalItems: number;
  completedItems: number;
  items: BatchTranslationItem[];
  startTime: number;
  endTime?: number;
}

// ============================================================================
// ประเภทข้อมูลสำหรับการตรวจสอบคุณภาพการแปลโดย AI ออฟไลน์ (Translation Audit Suite)
// ============================================================================

export type AuditSeverity = 'pass' | 'info' | 'warning' | 'critical';

export interface AuditIssueItem {
  id: string;
  category:
    | 'grammar_syntax'
    | 'semantic_drift'
    | 'hallucination'
    | 'register_politeness'
    | 'terminology_glossary'
    | 'length_balance'
    | 'script_punctuation'
    | 'cultural_context';
  severity: AuditSeverity;
  titleTh: string;
  descriptionTh: string;
  affectedSegment?: string;
  suggestedFix?: string;
}

export interface AuditDimensionScore {
  nameTh: string;
  nameEn: string;
  score: number; // 0 - 100
  status: AuditSeverity;
  summaryTh: string;
}

export interface TranslationAuditReport {
  id: string;
  timestamp: number;
  sourceText: string;
  translatedText: string;
  sourceLangId: string;
  targetLangId: string;
  overallHealthScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  dimensions: {
    grammarSyntax: AuditDimensionScore;
    semanticFidelity: AuditDimensionScore;
    hallucinationRisk: AuditDimensionScore;
    registerPoliteness: AuditDimensionScore;
    terminologyAdherence: AuditDimensionScore;
    lengthBalance: AuditDimensionScore;
    scriptPunctuation: AuditDimensionScore;
    culturalAppropriateness: AuditDimensionScore;
  };
  detectedIssues: AuditIssueItem[];
  autoCorrectedSuggestion?: string;
  isPassedVerification: boolean;
}

// ============================================================================
// ประเภทข้อมูลสำหรับระบบวิเคราะห์การออกเสียงและอะคูสติกส์ 70++ ภาษา (Phonetic & Speech Engine)
// ============================================================================

export interface AcousticFormantSpec {
  f0Hz: number;        // ความถี่มูลฐาน (Fundamental Pitch)
  f1Hz: number;        // Formant ที่ 1 (Vowel height / jaw openness)
  f2Hz: number;        // Formant ที่ 2 (Vowel backness / tongue position)
  f3Hz: number;        // Formant ที่ 3 (Lip rounding & acoustic color)
  bandwidthHz: number; // แบนด์วิดท์ตัวกรอง
  durationMs: number;  // ระยะเวลาเปล่งเสียง
}

export interface SyllablePhonemeDetail {
  syllableText: string;
  ipa: string;
  romanization: string;
  toneType?: string;          // เช่น สามัญ, เอก, โท, ตรี, จัตวา, Tone 1-4, Falling, Rising
  pitchContour?: number[];    // ระดับ Pitch Contour เส้นทางเดินเสียง 0 - 100
  stress: 'primary' | 'secondary' | 'unstressed';
  formants: AcousticFormantSpec;
  phonemeSegments: {
    initialConsonant?: string;
    vowel: string;
    finalConsonant?: string;
    toneMark?: string;
  };
}

export interface PhoneticPronunciationProfile {
  languageId: string;
  languageNameTh: string;
  rawText: string;
  overallIpa: string;
  romanizedGuide: string;
  tonalClassification: string;
  stressRhythmPattern: string;
  syllables: SyllablePhonemeDetail[];
  pronunciationTipsTh: string[];
  articulatoryMouthPositionTh: string;
  voiceGenderSimulation: 'neutral' | 'female' | 'male';
}
