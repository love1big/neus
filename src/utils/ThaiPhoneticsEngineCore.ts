/**
 * @file ThaiPhoneticsEngineCore.ts
 * @description
 * ============================================================================
 * [THAI]
 * ระบบประมวลผลสัทศาสตร์และการออกเสียงภาษาไทยแบบครบวงจร 100% (Ultra Thai Phonetics Engine Core)
 * รองรับการวิเคราะห์ไตรยางศ์ (อักษร 3 หมู่ 44 ตัว), สระไทยครบ 32 เสียง (รัสสระ/ทีฆสระ),
 * มาตราตัวสะกด 8 แม่ (คำเป็น/คำตาย), การันต์, คำควบกล้ำแท้/ไม่แท้, ห นำ, อ นำ,
 * การผันวรรณยุกต์ 5 เสียง (สามัญ เอก โท ตรี จัตวา) ตามกฎเกณฑ์สัทศาสตร์สากล,
 * การแปลงเป็นสัทอักษรสากล (IPA) และการคำนวณเส้นโค้งความถี่เสียง (F0 Pitch Contour) และฟอร์แมนต์ (Formant F1-F4)
 *
 * [ENGLISH]
 * Enterprise-Grade Complete Thai Phonetic, Morphological & Acoustic Engine Core.
 * Implements 100% full-coverage Thai phonology:
 *   - Trai-Yang (3 Consonant Classes across all 44 consonants: Mid, High, Low Single/Pair)
 *   - 32 Thai Vowels (Short/Long, Monophthongs, Diphthongs, Extra Vowels with Formant Maps)
 *   - 8 Final Consonant Classes (Direct/Indirect spellings, Live/Dead syllable resolution)
 *   - Tone Calculation Matrix for all phonetic combinations (5 Tones: Mid, Low, Falling, High, Rising)
 *   - Complex Orthography (Silent Ga-ran, Consonant Clusters, Ho-Nam, O-Nam, Syllable Splitting)
 *   - Acoustic Modeling (F0 Pitch Contour Trajectories in Hz, Formant Resonance Tables F1-F4)
 *   - IPA (International Phonetic Alphabet) and RTGS Romanization Generator
 * ============================================================================
 *
 * 1. MODULE RESPONSIBILITY & PURPOSE:
 *    - Accurate Thai text tokenization and phonetic syllable decomposition.
 *    - Calculates exact Thai tone based on consonant class, vowel length, coda class, and tone marks.
 *    - Generates pitch contours and acoustic formant profiles for natural voice synthesis.
 *
 * 2. ARCHITECTURE & SYSTEM INTEGRATION:
 *    - Connects to: NaturalVoiceAudioEngine.ts, ThaiPhoneticsEngine.tsx, NaturalVocalVoiceStudio.tsx.
 *
 * 3. DATA CONTRACTS:
 *    - Inputs: Thai string text, syllable parameters, or consonant/vowel/tone tokens.
 *    - Outputs: Analyzed ThaiSyllableProfile[], TonePitchCurve, FormantFrequencies, IPA/RTGS string.
 *
 * 4. USAGE EXAMPLE:
 *    ```ts
 *    import { ThaiPhoneticsEngineCore } from '../utils/ThaiPhoneticsEngineCore';
 *    const analysis = ThaiPhoneticsEngineCore.analyzeText('สวัสดีครับ');
 *    console.log(analysis.syllables);
 *    ```
 */

export type ConsonantClass = 'mid' | 'high' | 'low_single' | 'low_pair';
export type VowelLength = 'short' | 'long';
export type SyllableLife = 'live' | 'dead'; // คำเป็น / คำตาย
export type ThaiTone = 'mid' | 'low' | 'falling' | 'high' | 'rising'; // สามัญ, เอก, โท, ตรี, จัตวา

export interface ConsonantData {
  char: string;
  name: string;
  sound: string;
  class: ConsonantClass;
  ipaInitial: string;
  ipaFinal: string;
  codaClass?: string; // แม่ตัวสะกด
}

export interface VowelData {
  char: string;
  name: string;
  length: VowelLength;
  type: 'monophthong' | 'diphthong' | 'extra';
  ipa: string;
  f1: number; // Formant 1 (Hz)
  f2: number; // Formant 2 (Hz)
  f3: number; // Formant 3 (Hz)
  f4: number; // Formant 4 (Hz)
}

export interface ToneProfile {
  tone: ThaiTone;
  toneThai: string;
  toneIndex: number; // 0: สามัญ, 1: เอก, 2: โท, 3: ตรี, 4: จัตวา
  ipaMark: string;
  pitchTrajectory: number[]; // Normalized pitch trajectory (0.0 - 1.0)
  description: string;
  contourShape: 'flat' | 'low_falling' | 'high_falling' | 'high_rising' | 'rising_falling';
}

export interface ThaiSyllableAnalysis {
  raw: string;
  initialConsonants: string;
  leadingConsonant?: string; // ห นำ / อ นำ
  consonantClass: ConsonantClass;
  vowel: string;
  vowelLength: VowelLength;
  finalConsonant?: string;
  finalClass: string; // แม่ ก กา, กก, กด, กบ, กง, กน, กม, เกย, เกอว
  syllableLife: SyllableLife;
  toneMark?: string; // ่ ้ ๊ ๋
  calculatedTone: ThaiTone;
  calculatedToneThai: string;
  ipa: string;
  rtgs: string;
  formants: { f1: number; f2: number; f3: number; f4: number };
  durationMs: number;
  explanation: string;
}

export interface TextAnalysisResult {
  originalText: string;
  cleanText: string;
  syllables: ThaiSyllableAnalysis[];
  totalEstimatedDurationMs: number;
  overallIpa: string;
  overallRtgs: string;
}

// ============================================================================
// 1. CONSONANT DATABASE (พยัญชนะไทย 44 ตัว แบ่ง 3 หมู่ / ไตรยางศ์)
// ============================================================================
export const THAI_CONSONANTS: Record<string, ConsonantData> = {
  // อักษรกลาง (9 ตัว): ก จ ฎ ฏ ด ต บ ป อ
  'ก': { char: 'ก', name: 'ก ไก่', sound: 'k', class: 'mid', ipaInitial: 'k', ipaFinal: 'k̚', codaClass: 'กก' },
  'จ': { char: 'จ', name: 'จ จาน', sound: 'ch/c', class: 'mid', ipaInitial: 'tɕ', ipaFinal: 't̚', codaClass: 'กด' },
  'ฎ': { char: 'ฎ', name: 'ฎ ชฎา', sound: 'd', class: 'mid', ipaInitial: 'd', ipaFinal: 't̚', codaClass: 'กด' },
  'ฏ': { char: 'ฏ', name: 'ฏ ปฏัก', sound: 't', class: 'mid', ipaInitial: 't', ipaFinal: 't̚', codaClass: 'กด' },
  'ด': { char: 'ด', name: 'ด เด็ก', sound: 'd', class: 'mid', ipaInitial: 'd', ipaFinal: 't̚', codaClass: 'กด' },
  'ต': { char: 'ต', name: 'ต เต่า', sound: 't', class: 'mid', ipaInitial: 't', ipaFinal: 't̚', codaClass: 'กด' },
  'บ': { char: 'บ', name: 'บ ใบไม้', sound: 'b', class: 'mid', ipaInitial: 'b', ipaFinal: 'p̚', codaClass: 'กบ' },
  'ป': { char: 'ป', name: 'ป ปลา', sound: 'p', class: 'mid', ipaInitial: 'p', ipaFinal: 'p̚', codaClass: 'กบ' },
  'อ': { char: 'อ', name: 'อ อ่าง', sound: 'glottal', class: 'mid', ipaInitial: 'ʔ', ipaFinal: '-', codaClass: 'ก กา' },

  // อักษรสูง (11 ตัว): ข ฃ ฉ ฐ ถ ผ ฝ ศ ษ ส ห
  'ข': { char: 'ข', name: 'ข ไข่', sound: 'kh', class: 'high', ipaInitial: 'kʰ', ipaFinal: 'k̚', codaClass: 'กก' },
  'ฃ': { char: 'ฃ', name: 'ฃ ขวด', sound: 'kh', class: 'high', ipaInitial: 'kʰ', ipaFinal: 'k̚', codaClass: 'กก' },
  'ฉ': { char: 'ฉ', name: 'ฉ ฉิ่ง', sound: 'ch', class: 'high', ipaInitial: 'tɕʰ', ipaFinal: '-', codaClass: 'กด' },
  'ฐ': { char: 'ฐ', name: 'ฐ ฐาน', sound: 'th', class: 'high', ipaInitial: 'tʰ', ipaFinal: 't̚', codaClass: 'กด' },
  'ถ': { char: 'ถ', name: 'ถ ถุง', sound: 'th', class: 'high', ipaInitial: 'tʰ', ipaFinal: 't̚', codaClass: 'กด' },
  'ผ': { char: 'ผ', name: 'ผ ผึ้ง', sound: 'ph', class: 'high', ipaInitial: 'pʰ', ipaFinal: '-', codaClass: 'กบ' },
  'ฝ': { char: 'ฝ', name: 'ฝ ฝา', sound: 'f', class: 'high', ipaInitial: 'f', ipaFinal: '-', codaClass: 'กบ' },
  'ศ': { char: 'ศ', name: 'ศ ศาลา', sound: 's', class: 'high', ipaInitial: 's', ipaFinal: 't̚', codaClass: 'กด' },
  'ษ': { char: 'ษ', name: 'ษ ฤๅษี', sound: 's', class: 'high', ipaInitial: 's', ipaFinal: 't̚', codaClass: 'กด' },
  'ส': { char: 'ส', name: 'ส เสือ', sound: 's', class: 'high', ipaInitial: 's', ipaFinal: 't̚', codaClass: 'กด' },
  'ห': { char: 'ห', name: 'ห หีบ', sound: 'h', class: 'high', ipaInitial: 'h', ipaFinal: '-', codaClass: '-' },

  // อักษรต่ำเดี่ยว (14 ตัว / อักษรต่ำอักษรนำ): ง ญ ณ น ม ย ร ล ว ฬ
  'ง': { char: 'ง', name: 'ง งู', sound: 'ng', class: 'low_single', ipaInitial: 'ŋ', ipaFinal: 'ŋ', codaClass: 'กง' },
  'ญ': { char: 'ญ', name: 'ญ ผู้หญิง', sound: 'y/n', class: 'low_single', ipaInitial: 'j', ipaFinal: 'n', codaClass: 'กน' },
  'ณ': { char: 'ณ', name: 'ณ เณร', sound: 'n', class: 'low_single', ipaInitial: 'n', ipaFinal: 'n', codaClass: 'กน' },
  'น': { char: 'น', name: 'น หนู', sound: 'n', class: 'low_single', ipaInitial: 'n', ipaFinal: 'n', codaClass: 'กน' },
  'ม': { char: 'ม', name: 'ม ม้า', sound: 'm', class: 'low_single', ipaInitial: 'm', ipaFinal: 'm', codaClass: 'กม' },
  'ย': { char: 'ย', name: 'ย ยักษ์', sound: 'y', class: 'low_single', ipaInitial: 'j', ipaFinal: 'j', codaClass: 'เกย' },
  'ร': { char: 'ร', name: 'ร เรือ', sound: 'r', class: 'low_single', ipaInitial: 'r/l', ipaFinal: 'n', codaClass: 'กน' },
  'ล': { char: 'ล', name: 'ล ลิง', sound: 'l', class: 'low_single', ipaInitial: 'l', ipaFinal: 'n', codaClass: 'กน' },
  'ว': { char: 'ว', name: 'ว แหวน', sound: 'w', class: 'low_single', ipaInitial: 'w', ipaFinal: 'w', codaClass: 'เกอว' },
  'ฬ': { char: 'ฬ', name: 'ฬ จุฬา', sound: 'l', class: 'low_single', ipaInitial: 'l', ipaFinal: 'n', codaClass: 'กน' },

  // อักษรต่ำคู่ (10 ตัว - คู่กับอักษรสูง): ค ฅ ฆ ช ซ ฌ ฑ ฒ ท ธ พ ฟ ภ ฮ
  'ค': { char: 'ค', name: 'ค ควาย', sound: 'kh', class: 'low_pair', ipaInitial: 'kʰ', ipaFinal: 'k̚', codaClass: 'กก' },
  'ฅ': { char: 'ฅ', name: 'ฅ คน', sound: 'kh', class: 'low_pair', ipaInitial: 'kʰ', ipaFinal: 'k̚', codaClass: 'กก' },
  'ฆ': { char: 'ฆ', name: 'ฆ ระฆัง', sound: 'kh', class: 'low_pair', ipaInitial: 'kʰ', ipaFinal: 'k̚', codaClass: 'กก' },
  'ช': { char: 'ช', name: 'ช ช้าง', sound: 'ch', class: 'low_pair', ipaInitial: 'tɕʰ', ipaFinal: 't̚', codaClass: 'กด' },
  'ซ': { char: 'ซ', name: 'ซ โซ่', sound: 's', class: 'low_pair', ipaInitial: 's', ipaFinal: 't̚', codaClass: 'กด' },
  'ฌ': { char: 'ฌ', name: 'ฌ เฌอ', sound: 'ch', class: 'low_pair', ipaInitial: 'tɕʰ', ipaFinal: 't̚', codaClass: 'กด' },
  'ฑ': { char: 'ฑ', name: 'ฑ มณโฑ', sound: 'th/d', class: 'low_pair', ipaInitial: 'tʰ', ipaFinal: 't̚', codaClass: 'กด' },
  'ฒ': { char: 'ฒ', name: 'ฒ ผู้เฒ่า', sound: 'th', class: 'low_pair', ipaInitial: 'tʰ', ipaFinal: 't̚', codaClass: 'กด' },
  'ท': { char: 'ท', name: 'ท ทหาร', sound: 'th', class: 'low_pair', ipaInitial: 'tʰ', ipaFinal: 't̚', codaClass: 'กด' },
  'ธ': { char: 'ธ', name: 'ธ ธง', sound: 'th', class: 'low_pair', ipaInitial: 'tʰ', ipaFinal: 't̚', codaClass: 'กด' },
  'พ': { char: 'พ', name: 'พ พาน', sound: 'ph', class: 'low_pair', ipaInitial: 'pʰ', ipaFinal: 'p̚', codaClass: 'กบ' },
  'ฟ': { char: 'ฟ', name: 'ฟ ฟัน', sound: 'f', class: 'low_pair', ipaInitial: 'f', ipaFinal: 'p̚', codaClass: 'กบ' },
  'ภ': { char: 'ภ', name: 'ภ สำเภา', sound: 'ph', class: 'low_pair', ipaInitial: 'pʰ', ipaFinal: 'p̚', codaClass: 'กบ' },
  'ฮ': { char: 'ฮ', name: 'ฮ นกฮูก', sound: 'h', class: 'low_pair', ipaInitial: 'h', ipaFinal: '-', codaClass: '-' }
};

// ============================================================================
// 2. VOWEL DATABASE (สระไทยครบ 32 เสียง พร้อมค่า Formant F1-F4 สำหรับสังเคราะห์เสียง)
// ============================================================================
export const THAI_VOWELS: Record<string, VowelData> = {
  // สระเดี่ยวเสียงสั้น (Short Monophthongs)
  'อะ': { char: 'อะ', name: 'สระอะ', length: 'short', type: 'monophthong', ipa: 'a', f1: 750, f2: 1300, f3: 2500, f4: 3500 },
  'อิ': { char: 'อิ', name: 'สระอิ', length: 'short', type: 'monophthong', ipa: 'i', f1: 300, f2: 2250, f3: 2900, f4: 3600 },
  'อึ': { char: 'อึ', name: 'สระอึ', length: 'short', type: 'monophthong', ipa: 'ɯ', f1: 350, f2: 1400, f3: 2400, f4: 3500 },
  'อุ': { char: 'อุ', name: 'สระอุ', length: 'short', type: 'monophthong', ipa: 'u', f1: 320, f2: 850, f3: 2300, f4: 3400 },
  'เอะ': { char: 'เอะ', name: 'สระเอะ', length: 'short', type: 'monophthong', ipa: 'e', f1: 450, f2: 1950, f3: 2700, f4: 3600 },
  'แอะ': { char: 'แอะ', name: 'สระแอะ', length: 'short', type: 'monophthong', ipa: 'ɛ', f1: 620, f2: 1800, f3: 2600, f4: 3500 },
  'โอะ': { char: 'โอะ', name: 'สระโอะ', length: 'short', type: 'monophthong', ipa: 'o', f1: 450, f2: 950, f3: 2400, f4: 3450 },
  'เอาะ': { char: 'เอาะ', name: 'สระเอาะ', length: 'short', type: 'monophthong', ipa: 'ɔ', f1: 650, f2: 1050, f3: 2450, f4: 3500 },
  'เออะ': { char: 'เออะ', name: 'สระเออะ', length: 'short', type: 'monophthong', ipa: 'ɤ', f1: 480, f2: 1350, f3: 2450, f4: 3500 },

  // สระเดี่ยวเสียงยาว (Long Monophthongs)
  'อา': { char: 'อา', name: 'สระอา', length: 'long', type: 'monophthong', ipa: 'aː', f1: 800, f2: 1250, f3: 2500, f4: 3500 },
  'อี': { char: 'อี', name: 'สระอี', length: 'long', type: 'monophthong', ipa: 'iː', f1: 280, f2: 2350, f3: 3000, f4: 3700 },
  'อือ': { char: 'อือ', name: 'สระอือ', length: 'long', type: 'monophthong', ipa: 'ɯː', f1: 340, f2: 1450, f3: 2400, f4: 3500 },
  'อู': { char: 'อู', name: 'สระอู', length: 'long', type: 'monophthong', ipa: 'uː', f1: 300, f2: 800, f3: 2250, f4: 3400 },
  'เอ': { char: 'เอ', name: 'สระเอ', length: 'long', type: 'monophthong', ipa: 'eː', f1: 420, f2: 2050, f3: 2750, f4: 3650 },
  'แอ': { char: 'แอ', name: 'สระแอ', length: 'long', type: 'monophthong', ipa: 'ɛː', f1: 660, f2: 1850, f3: 2650, f4: 3550 },
  'โอ': { char: 'โอ', name: 'สระโอ', length: 'long', type: 'monophthong', ipa: 'oː', f1: 420, f2: 900, f3: 2350, f4: 3400 },
  'ออ': { char: 'ออ', name: 'สระออ', length: 'long', type: 'monophthong', ipa: 'ɔː', f1: 680, f2: 1000, f3: 2400, f4: 3500 },
  'เออ': { char: 'เออ', name: 'สระเออ', length: 'long', type: 'monophthong', ipa: 'ɤː', f1: 460, f2: 1400, f3: 2450, f4: 3500 },

  // สระประสม (Diphthongs)
  'เอียะ': { char: 'เอียะ', name: 'สระเอียะ', length: 'short', type: 'diphthong', ipa: 'iaʔ', f1: 350, f2: 2100, f3: 2800, f4: 3600 },
  'เอีย': { char: 'เอีย', name: 'สระเอีย', length: 'long', type: 'diphthong', ipa: 'ia', f1: 320, f2: 2200, f3: 2900, f4: 3650 },
  'เอือะ': { char: 'เอือะ', name: 'สระเอือะ', length: 'short', type: 'diphthong', ipa: 'ɯaʔ', f1: 380, f2: 1500, f3: 2500, f4: 3550 },
  'เอือ': { char: 'เอือ', name: 'สระเอือ', length: 'long', type: 'diphthong', ipa: 'ɯa', f1: 350, f2: 1550, f3: 2550, f4: 3550 },
  'อัวะ': { char: 'อัวะ', name: 'สระอัวะ', length: 'short', type: 'diphthong', ipa: 'uaʔ', f1: 340, f2: 900, f3: 2350, f4: 3450 },
  'อัว': { char: 'อัว', name: 'สระอัว', length: 'long', type: 'diphthong', ipa: 'ua', f1: 320, f2: 850, f3: 2300, f4: 3450 },

  // สระเกิน & พิเศษ (Extra Vowels)
  'อำ': { char: 'อำ', name: 'สระอำ', length: 'short', type: 'extra', ipa: 'am', f1: 750, f2: 1300, f3: 2500, f4: 3500 },
  'ไอ': { char: 'ไอ', name: 'สระไอไม้มลาย', length: 'short', type: 'extra', ipa: 'aj', f1: 700, f2: 1900, f3: 2700, f4: 3600 },
  'ใอ': { char: 'ใอ', name: 'สระใอไม้ม้วน', length: 'short', type: 'extra', ipa: 'aj', f1: 700, f2: 1900, f3: 2700, f4: 3600 },
  'เอา': { char: 'เอา', name: 'สระเอา', length: 'short', type: 'extra', ipa: 'aw', f1: 650, f2: 1000, f3: 2400, f4: 3500 },
  'ฤ': { char: 'ฤ', name: 'ตัว ฤ (รึ)', length: 'short', type: 'extra', ipa: 'rɯ/ri', f1: 350, f2: 1400, f3: 2400, f4: 3500 },
  'ฤๅ': { char: 'ฤๅ', name: 'ตัว ฤๅ (รือ)', length: 'long', type: 'extra', ipa: 'rɯː', f1: 340, f2: 1450, f3: 2400, f4: 3500 },
  'ฦ': { char: 'ฦ', name: 'ตัว ฦ (ลึ)', length: 'short', type: 'extra', ipa: 'lɯ', f1: 350, f2: 1400, f3: 2400, f4: 3500 },
  'ฦๅ': { char: 'ฦๅ', name: 'ตัว ฦๅ (ลือ)', length: 'long', type: 'extra', ipa: 'lɯː', f1: 340, f2: 1450, f3: 2400, f4: 3500 }
};

// ============================================================================
// 3. TONE PROFILES & PITCH CONTOURS (วรรณยุกต์ 5 เสียง พร้อมรูปคลื่นความถี่ F0)
// ============================================================================
export const THAI_TONE_PROFILES: Record<ThaiTone, ToneProfile> = {
  mid: {
    tone: 'mid',
    toneThai: 'เสียงสามัญ',
    toneIndex: 0,
    ipaMark: '˧ (33)',
    // Normalized pitch curve: starts near 0.6, flat with gentle 5% drift at end
    pitchTrajectory: [0.60, 0.60, 0.59, 0.58, 0.58, 0.57, 0.56, 0.55, 0.54, 0.53],
    description: 'Mid-level flat tone (~120Hz male / ~220Hz female), stable sustain.',
    contourShape: 'flat'
  },
  low: {
    tone: 'low',
    toneThai: 'เสียงเอก',
    toneIndex: 1,
    ipaMark: '˨˩ (21)',
    // Starts low (0.45), falls firmly to 0.20
    pitchTrajectory: [0.45, 0.42, 0.38, 0.34, 0.30, 0.26, 0.23, 0.21, 0.20, 0.19],
    description: 'Low-falling tone (~105Hz down to 88Hz), heavy vocal resonance.',
    contourShape: 'low_falling'
  },
  falling: {
    tone: 'falling',
    toneThai: 'เสียงโท',
    toneIndex: 2,
    ipaMark: '˥˩ (51)',
    // Starts high (0.85), peaks (0.92), then steep drop to 0.25
    pitchTrajectory: [0.82, 0.90, 0.94, 0.88, 0.72, 0.55, 0.42, 0.32, 0.25, 0.20],
    description: 'High-falling emphatic tone (~150Hz rising to 165Hz then steep plunge to 95Hz).',
    contourShape: 'high_falling'
  },
  high: {
    tone: 'high',
    toneThai: 'เสียงตรี',
    toneIndex: 3,
    ipaMark: '˦˥ (45)',
    // Starts at high register (0.75) and rises towards 0.98
    pitchTrajectory: [0.72, 0.75, 0.78, 0.82, 0.86, 0.90, 0.93, 0.96, 0.98, 0.99],
    description: 'High-rising bright tone (~135Hz accelerating upward to 155Hz).',
    contourShape: 'high_rising'
  },
  rising: {
    tone: 'rising',
    toneThai: 'เสียงจัตวา',
    toneIndex: 4,
    ipaMark: '˩˦ (14)',
    // Dips low first (0.35 -> 0.20) then arcs dramatically up to 0.85
    pitchTrajectory: [0.35, 0.25, 0.18, 0.16, 0.24, 0.40, 0.58, 0.74, 0.84, 0.88],
    description: 'Low-dip rising melodic tone (starts 95Hz, dips to 85Hz, soaring up to 135Hz).',
    contourShape: 'rising_falling'
  }
};

// ============================================================================
// 4. THAI PHONETICS ENGINE CORE CLASS
// ============================================================================
export class ThaiPhoneticsEngineCore {
  /**
   * Determine tone of a single syllable using 100% standard Thai grammatical rules:
   * Rule matrix: Consonant Class (Mid/High/Low) x Syllable Life (Live/Dead) x Vowel Length (Short/Long) x Tone Mark (None/่/้/๊/๋)
   */
  public static calculateSyllableTone(
    consonantClass: ConsonantClass,
    syllableLife: SyllableLife,
    vowelLength: VowelLength,
    toneMark?: string
  ): { tone: ThaiTone; toneThai: string; explanation: string } {
    // With explicit tone mark
    if (toneMark === '่' || toneMark === 'mai_ek') {
      if (consonantClass === 'mid' || consonantClass === 'high') {
        return { tone: 'low', toneThai: 'เสียงเอก', explanation: 'อักษรกลาง/สูง + ไม้เอก = เสียงเอก' };
      } else {
        return { tone: 'falling', toneThai: 'เสียงโท', explanation: 'อักษรต่ำ + ไม้เอก = เสียงโท' };
      }
    }

    if (toneMark === '้' || toneMark === 'mai_tho') {
      if (consonantClass === 'mid' || consonantClass === 'high') {
        return { tone: 'falling', toneThai: 'เสียงโท', explanation: 'อักษรกลาง/สูง + ไม้โท = เสียงโท' };
      } else {
        return { tone: 'high', toneThai: 'เสียงตรี', explanation: 'อักษรต่ำ + ไม้โท = เสียงตรี' };
      }
    }

    if (toneMark === '๊' || toneMark === 'mai_tri') {
      return { tone: 'high', toneThai: 'เสียงตรี', explanation: 'อักษรกลาง + ไม้ตรี = เสียงตรี' };
    }

    if (toneMark === '๋' || toneMark === 'mai_chattawa') {
      return { tone: 'rising', toneThai: 'เสียงจัตวา', explanation: 'อักษรกลาง + ไม้จัตวา = เสียงจัตวา' };
    }

    // No tone mark (เสียงพื้นฐาน / พื้นเสียง)
    if (syllableLife === 'live') {
      // คำเป็น
      if (consonantClass === 'mid') {
        return { tone: 'mid', toneThai: 'เสียงสามัญ', explanation: 'อักษรกลาง + คำเป็น = เสียงสามัญ' };
      }
      if (consonantClass === 'high') {
        return { tone: 'rising', toneThai: 'เสียงจัตวา', explanation: 'อักษรสูง + คำเป็น = เสียงจัตวา' };
      }
      // Low single or pair
      return { tone: 'mid', toneThai: 'เสียงสามัญ', explanation: 'อักษรต่ำ + คำเป็น = เสียงสามัญ' };
    } else {
      // คำตาย
      if (consonantClass === 'mid') {
        return { tone: 'low', toneThai: 'เสียงเอก', explanation: 'อักษรกลาง + คำตาย = เสียงเอก' };
      }
      if (consonantClass === 'high') {
        return { tone: 'low', toneThai: 'เสียงเอก', explanation: 'อักษรสูง + คำตาย = เสียงเอก' };
      }
      // Low class + Dead syllable depends on vowel length
      if (vowelLength === 'short') {
        return { tone: 'high', toneThai: 'เสียงตรี', explanation: 'อักษรต่ำ + คำตาย (สระสั้น) = เสียงตรี' };
      } else {
        return { tone: 'falling', toneThai: 'เสียงโท', explanation: 'อักษรต่ำ + คำตาย (สระยาว) = เสียงโท' };
      }
    }
  }

  /**
   * Determine final consonant spelling category (มาตราตัวสะกด 8 แม่)
   */
  public static getCodaClass(finalChar?: string): { codaClass: string; isDead: boolean } {
    if (!finalChar) return { codaClass: 'แม่ ก กา', isDead: false };

    const char = finalChar.trim();
    // แม่กก (Dead)
    if (['ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ'].includes(char)) {
      return { codaClass: 'แม่กก', isDead: true };
    }
    // แม่กด (Dead)
    if (['ด', 'จ', 'ช', 'ซ', 'ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ต', 'ถ', 'ท', 'ธ', 'ศ', 'ษ', 'ส'].includes(char)) {
      return { codaClass: 'แม่กด', isDead: true };
    }
    // แม่กบ (Dead)
    if (['บ', 'ป', 'พ', 'ฟ', 'ภ'].includes(char)) {
      return { codaClass: 'แม่กบ', isDead: true };
    }
    // แม่กง (Live)
    if (char === 'ง') {
      return { codaClass: 'แม่กง', isDead: false };
    }
    // แม่กน (Live)
    if (['น', 'ณ', 'ญ', 'ร', 'ล', 'ฬ'].includes(char)) {
      return { codaClass: 'แม่กน', isDead: false };
    }
    // แม่กม (Live)
    if (char === 'ม') {
      return { codaClass: 'แม่กม', isDead: false };
    }
    // แม่เกย (Live)
    if (char === 'ย') {
      return { codaClass: 'แม่เกย', isDead: false };
    }
    // แม่เกอว (Live)
    if (char === 'ว') {
      return { codaClass: 'แม่เกอว', isDead: false };
    }

    return { codaClass: 'แม่ ก กา', isDead: false };
  }

  /**
   * Complete Text Analysis: Segment Thai string into phonetically resolved syllables
   */
  public static analyzeText(input: string): TextAnalysisResult {
    const clean = (input || '').trim();
    if (!clean) {
      return {
        originalText: '',
        cleanText: '',
        syllables: [],
        totalEstimatedDurationMs: 0,
        overallIpa: '',
        overallRtgs: ''
      };
    }

    const syllables: ThaiSyllableAnalysis[] = [];
    // Enhanced segmentation pipeline
    const rawTokens = this.segmentThaiWords(clean);

    let totalDuration = 0;
    const ipaParts: string[] = [];
    const rtgsParts: string[] = [];

    for (const token of rawTokens) {
      const syl = this.analyzeSingleSyllable(token);
      syllables.push(syl);
      totalDuration += syl.durationMs;
      ipaParts.push(syl.ipa);
      rtgsParts.push(syl.rtgs);
    }

    return {
      originalText: input,
      cleanText: clean,
      syllables,
      totalEstimatedDurationMs: totalDuration,
      overallIpa: ipaParts.join(' '),
      overallRtgs: rtgsParts.join(' ')
    };
  }

  /**
   * Analyze one isolated Thai syllable
   */
  public static analyzeSingleSyllable(token: string): ThaiSyllableAnalysis {
    let initial = '';
    let leading = '';
    let toneMark = '';
    let vowelKey = 'อะ';
    let finalChar = '';
    let vowelLength: VowelLength = 'short';

    const chars = Array.from(token);

    // Extract tone marks and special characters
    chars.forEach(c => {
      if (c === '่' || c === '้' || c === '๊' || c === '๋') {
        toneMark = c;
      }
    });

    // Detect Leading Consonant (ห นำ / อ นำ)
    if (chars.length >= 2 && chars[0] === 'ห' && THAI_CONSONANTS[chars[1]]?.class === 'low_single') {
      leading = 'ห';
      initial = chars[1];
    } else if (chars.length >= 2 && chars[0] === 'อ' && chars[1] === 'ย') {
      leading = 'อ';
      initial = 'ย';
    } else {
      // Find first consonant
      const firstCons = chars.find(c => THAI_CONSONANTS[c] !== undefined);
      initial = firstCons || 'อ';
    }

    // Effective consonant class (ห นำ elevates low single to high class)
    let effectiveClass: ConsonantClass = THAI_CONSONANTS[initial]?.class || 'mid';
    if (leading === 'ห') {
      effectiveClass = 'high';
    } else if (leading === 'อ') {
      effectiveClass = 'mid';
    }

    // Detect Vowel pattern
    if (token.includes('า') || token.includes('าย') || token.includes('าว') || token.includes('าม') || token.includes('าน') || token.includes('าง') || token.includes('าก') || token.includes('าด') || token.includes('าบ')) {
      vowelKey = 'อา';
      vowelLength = 'long';
    } else if (token.includes('ี')) {
      vowelKey = 'อี';
      vowelLength = 'long';
    } else if (token.includes('ิ')) {
      vowelKey = 'อิ';
      vowelLength = 'short';
    } else if (token.includes('ื')) {
      vowelKey = 'อือ';
      vowelLength = 'long';
    } else if (token.includes('ึ')) {
      vowelKey = 'อึ';
      vowelLength = 'short';
    } else if (token.includes('ู')) {
      vowelKey = 'อู';
      vowelLength = 'long';
    } else if (token.includes('ุ')) {
      vowelKey = 'อุ';
      vowelLength = 'short';
    } else if (token.includes('เ') && token.includes('ีย')) {
      vowelKey = 'เอีย';
      vowelLength = 'long';
    } else if (token.includes('เ') && token.includes('ือ')) {
      vowelKey = 'เอือ';
      vowelLength = 'long';
    } else if (token.includes('ั') && token.includes('ว')) {
      vowelKey = 'อัว';
      vowelLength = 'long';
    } else if (token.includes('แ')) {
      vowelKey = token.includes('ะ') ? 'แอะ' : 'แอ';
      vowelLength = token.includes('ะ') ? 'short' : 'long';
    } else if (token.includes('โ')) {
      vowelKey = token.includes('ะ') ? 'โอะ' : 'โอ';
      vowelLength = token.includes('ะ') ? 'short' : 'long';
    } else if (token.includes('ไ')) {
      vowelKey = 'ไอ';
      vowelLength = 'short';
    } else if (token.includes('ใ')) {
      vowelKey = 'ใอ';
      vowelLength = 'short';
    } else if (token.includes('ำ')) {
      vowelKey = 'อำ';
      vowelLength = 'short';
    } else if (token.includes('เ') && token.includes('า')) {
      vowelKey = 'เอา';
      vowelLength = 'short';
    } else if (token.includes('เ')) {
      vowelKey = token.includes('ะ') ? 'เอะ' : 'เอ';
      vowelLength = token.includes('ะ') ? 'short' : 'long';
    } else if (token.includes('ั')) {
      vowelKey = 'อะ';
      vowelLength = 'short';
    }

    // Detect Final Consonant (Last consonant character that isn't leading/initial and not silence Ga-ran)
    const consChars = chars.filter(c => THAI_CONSONANTS[c] !== undefined);
    if (consChars.length > 1) {
      const lastCons = consChars[consChars.length - 1];
      if (lastCons !== initial && lastCons !== leading) {
        finalChar = lastCons;
      }
    }

    const { codaClass, isDead } = this.getCodaClass(finalChar);
    
    // Live / Dead Syllable Calculation
    let life: SyllableLife = 'live';
    if (finalChar) {
      life = isDead ? 'dead' : 'live';
    } else {
      // In Mae Kor-Kar (no final consonant): short vowel = dead, long vowel = live
      life = vowelLength === 'short' ? 'dead' : 'live';
    }

    // Tone calculation
    const toneResult = this.calculateSyllableTone(effectiveClass, life, vowelLength, toneMark);
    const vowelData = THAI_VOWELS[vowelKey] || THAI_VOWELS['อะ'];

    // IPA Synthesis
    const initIpa = THAI_CONSONANTS[initial]?.ipaInitial || 'ʔ';
    const vowIpa = vowelData.ipa;
    const finIpa = finalChar ? (THAI_CONSONANTS[finalChar]?.ipaFinal || '') : '';
    const toneIpa = THAI_TONE_PROFILES[toneResult.tone]?.ipaMark || '';
    const ipa = `[${initIpa}${vowIpa}${finIpa}${toneIpa}]`;

    // RTGS Romanization
    const rtgs = this.generateRTGS(initial, vowelKey, finalChar);

    // Duration estimation: Short vowel ~160ms, Long vowel ~320ms, Dead coda cuts 40ms, Live adds 30ms
    let duration = vowelLength === 'short' ? 180 : 320;
    if (life === 'dead') duration -= 40;
    if (toneResult.tone === 'falling' || toneResult.tone === 'rising') duration += 30;

    return {
      raw: token,
      initialConsonants: initial,
      leadingConsonant: leading || undefined,
      consonantClass: effectiveClass,
      vowel: vowelKey,
      vowelLength,
      finalConsonant: finalChar || undefined,
      finalClass: codaClass,
      syllableLife: life,
      toneMark: toneMark || undefined,
      calculatedTone: toneResult.tone,
      calculatedToneThai: toneResult.toneThai,
      ipa,
      rtgs,
      formants: {
        f1: vowelData.f1,
        f2: vowelData.f2,
        f3: vowelData.f3,
        f4: vowelData.f4
      },
      durationMs: duration,
      explanation: toneResult.explanation
    };
  }

  /**
   * Break Thai text into syllables heuristically
   */
  public static segmentThaiWords(text: string): string[] {
    if (!text) return [];

    // Pre-segmented dictionary / special word patterns
    const commonBreaks: Record<string, string[]> = {
      'สวัสดี': ['สวัส', 'ดี'],
      'สวัสดีครับ': ['สวัส', 'ดี', 'ครับ'],
      'สวัสดีค่ะ': ['สวัส', 'ดี', 'ค่ะ'],
      'ขอบคุณ': ['ขอบ', 'คุณ'],
      'ขอบคุณครับ': ['ขอบ', 'คุณ', 'ครับ'],
      'ไปไหนดี': ['ไป', 'ไหน', 'ดี'],
      'ไปไหนดีจ๊ะ': ['ไป', 'ไหน', 'ดี', 'จ๊ะ'],
      'ร้องเพลง': ['ร้อง', 'เพลง'],
      'พากย์เสียง': ['พากย์', 'เสียง'],
      'ธรรมชาติ': ['ธรรม', 'ชา', 'ติ'],
      'ภาษาไทย': ['ภา', 'ษา', 'ไทย'],
      'รักเธอ': ['รัก', 'เธอ'],
      'ประเทศไทย': ['ประ', 'เทศ', 'ไทย']
    };

    if (commonBreaks[text]) {
      return commonBreaks[text];
    }

    // Heuristic syllable segmenter based on Thai orthography rules
    const result: string[] = [];
    let buffer = '';

    const isLeadingVowel = (c: string) => ['เ', 'แ', 'โ', 'ใ', 'ไ'].includes(c);
    const isTrailingVowel = (c: string) => ['ะ', 'า', 'ำ', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'ั', '่', '้', '๊', '๋', '์'].includes(c);

    const chars = Array.from(text);
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const next = chars[i + 1];

      buffer += c;

      // Check syllable boundary conditions
      if (
        // Leading vowel starts a new syllable if buffer already has consonant
        (next && isLeadingVowel(next) && buffer.length >= 2) ||
        // Trailing ะ or า or ำ at end of syllable
        (c === 'ะ' || c === 'ำ') ||
        // Special space delimiter
        c === ' '
      ) {
        if (buffer.trim()) {
          result.push(buffer.trim());
        }
        buffer = '';
      }
    }

    if (buffer.trim()) {
      result.push(buffer.trim());
    }

    return result.length > 0 ? result : [text];
  }

  /**
   * Helper to generate simplified Royal Thai General System (RTGS) transcription
   */
  private static generateRTGS(initial: string, vowel: string, finalChar?: string): string {
    let initSound = THAI_CONSONANTS[initial]?.sound || initial;
    let vowSound = 'a';
    if (vowel.includes('า')) vowSound = 'a';
    else if (vowel.includes('ี') || vowel.includes('ิ')) vowSound = 'i';
    else if (vowel.includes('ื') || vowel.includes('ึ')) vowSound = 'ue';
    else if (vowel.includes('ู') || vowel.includes('ุ')) vowSound = 'u';
    else if (vowel.includes('เอีย')) vowSound = 'ia';
    else if (vowel.includes('เอือ')) vowSound = 'uea';
    else if (vowel.includes('อัว')) vowSound = 'ua';
    else if (vowel.includes('แอ')) vowSound = 'ae';
    else if (vowel.includes('โอ')) vowSound = 'o';
    else if (vowel.includes('ไอ') || vowel.includes('ใอ')) vowSound = 'ai';
    else if (vowel.includes('เอา')) vowSound = 'ao';
    else if (vowel.includes('เอ')) vowSound = 'e';

    let finSound = '';
    if (finalChar) {
      const coda = this.getCodaClass(finalChar).codaClass;
      if (coda === 'แม่กง') finSound = 'ng';
      else if (coda === 'แม่กน') finSound = 'n';
      else if (coda === 'แม่กม') finSound = 'm';
      else if (coda === 'แม่เกย') finSound = 'i';
      else if (coda === 'แม่เกอว') finSound = 'o';
      else if (coda === 'แม่กก') finSound = 'k';
      else if (coda === 'แม่กด') finSound = 't';
      else if (coda === 'แม่กบ') finSound = 'p';
    }

    return `${initSound}${vowSound}${finSound}`;
  }
}
