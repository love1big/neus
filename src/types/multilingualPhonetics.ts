/**
 * ============================================================================
 * [THAI] สัญรูปข้อมูลและโครงสร้างประเภทข้อมูลระบบสัทศาสตร์ 30++ ภาษาทั่วโลก
 * [ENGLISH] Multilingual Phonetics, Streaming & Grammar Verification Types
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - ประกาศ Data Types, Interfaces และ Enums สำหรับระบบสัทศาสตร์และการออกเสียง
 *   ครอบคลุม 30++ ภาษาและสำเนียงภูมิภาคทั่วโลก:
 *   - จีนทุกภาค (Mandarin, Cantonese, Hokkien, Shanghainese, Hakka, Sichuanese)
 *   - ไทยทุกภาค (Central, Isan, Northern/Lanna, Southern)
 *   - เกาหลี (Seoul Standard, Busan/Gyeongsang)
 *   - อังกฤษ (US, UK, Australian, Indian, Scottish)
 *   - ญี่ปุ่น (Tokyo Standard, Kansai)
 *   - อินเดีย (Hindi, Tamil, Telugu, Bengali, Marathi, Punjabi, Gujarati)
 *   - ยุโรปและสากล (French, German, Spanish, Italian, Russian, Arabic, Vietnamese, etc.)
 * - โครงสร้างข้อมูลสำหรับระบบ Audio Streaming แบบ Low-latency และระบบตรวจสอบความถูกต้อง
 *   (Linguistic Accuracy Verification & AI Grammar Translation Verifier)
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - เชื่อมต่อกับ `GlobalPhonetics30Engine` สำหรับคำนวณ IPA, Tone Contours และ Sandhi Rules
 * - เชื่อมต่อกับ `GlobalAudioStreamingEngine` สำหรับการสตรีมเสียงสังเคราะห์แบบ Chunked PCM
 * - เชื่อมต่อกับ `MultilingualGrammarTranslationVerifier` สำหรับตรวจจับไวยากรณ์และความสุภาพ
 *
 * @author Global Linguistic Engineering Directorate & NexusEngine Core Team
 */

export type LanguageFamily =
  | 'Sino-Tibetan'
  | 'Kra-Dai'
  | 'Koreanic'
  | 'Japonic'
  | 'Indo-European'
  | 'Dravidian'
  | 'Afroasiatic'
  | 'Turkic'
  | 'Austroasiatic'
  | 'Austronesian'
  | 'Uralic';

export type ToneType =
  | 'Level'
  | 'Rising'
  | 'Falling'
  | 'High'
  | 'Low'
  | 'Contour'
  | 'Pitch-Accent'
  | 'Non-Tonal';

export interface PhoneticRule {
  id: string;
  ruleNameThai: string;
  ruleNameEnglish: string;
  descriptionThai: string;
  descriptionEnglish: string;
  patternTrigger: string;
  phoneticResultIPA: string;
  exampleWord: string;
  examplePronunciation: string;
  exampleMeaningThai: string;
  acousticFeatureNote: string;
}

export interface DialectVoiceProfile {
  id: string;
  nameThai: string;
  nameEnglish: string;
  languageCode: string;
  region: string;
  family: LanguageFamily;
  toneType: ToneType;
  toneCount: number;
  pitchRangeHz: [number, number];
  formantDefaults: {
    F1: number;
    F2: number;
    F3: number;
  };
  sampleRateHz: number;
  phoneticRules: PhoneticRule[];
  samplePhrases: {
    originalText: string;
    romanization: string;
    ipa: string;
    translationThai: string;
    translationEnglish: string;
    formalityLevel: 'Casual' | 'Polite' | 'Honorific' | 'Formal' | 'Royal';
  }[];
}

export interface LinguisticVerificationResult {
  scorePercent: number;
  isAccurate: boolean;
  phonemeAccuracy: number;
  toneConformity: number;
  prosodicNaturalness: number;
  detectedDialect: string;
  detectedSandhiOrLiaison: string[];
  mismatchesDetected: {
    token: string;
    expectedIPA: string;
    foundIPA: string;
    severity: 'low' | 'medium' | 'high';
    explanationThai: string;
    correctionAdvice: string;
  }[];
  acousticIntegrity: {
    pitchStability: number;
    spectralCentroidHz: number;
    vocalJitterPercent: number;
    shimmerPercent: number;
  };
}

export interface TranslationVerificationReport {
  sourceText: string;
  sourceLangId: string;
  targetLangId: string;
  translatedText: string;
  backTranslatedText: string;
  semanticAlignmentScore: number; // 0-100%
  grammaticalCorrectnessScore: number; // 0-100%
  politenessLevelDetected: 'Casual' | 'Polite' | 'Formal' | 'Honorific' | 'Royal';
  politenessAppropriatenessScore: number; // 0-100%
  grammarAnomalies: {
    issueType: 'Syntax' | 'Tense' | 'Agreement' | 'HonorificMismatch' | 'FalseFriend' | 'CulturalNuance';
    descriptionThai: string;
    offendingPhrase: string;
    recommendedCorrection: string;
  }[];
  ipaTargetPhonetics: string;
  romanizedTargetText: string;
  idiomPreservationNote: string;
}

export interface StreamingAudioChunk {
  chunkIndex: number;
  timestampMs: number;
  durationMs: number;
  pcmData: Float32Array;
  sampleRate: number;
  phonemeMarker?: string;
  isFinalChunk: boolean;
}

export interface StreamingSessionConfig {
  sampleRate: 24000 | 44100 | 48000;
  bufferLatencyMs: number;
  pitchShiftSemitones: number;
  speakingRate: number; // 0.5 to 2.0
  volume: number; // 0 to 1.0
  enableAcousticFilter: boolean;
  enableFormantMorphing: boolean;
}
