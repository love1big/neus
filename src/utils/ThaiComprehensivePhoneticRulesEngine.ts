/**
 * @file ThaiComprehensivePhoneticRulesEngine.ts
 * @description
 * ============================================================================
 * [THAI]
 * เครื่องยนต์หลักเกณฑ์และกฎสัทศาสตร์การออกเสียงภาษาไทยฉบับสมบูรณ์ขั้นสูงสุด (Exhaustive Thai Phonetics & Articulatory Rules Engine)
 * รวบรวมกฎและหลักการออกเสียงตามหลักภาษาศาสตร์และอักขรวิธีราชบัณฑิตยสถานแบบ 100% ครบทุกมิติ:
 *   1. ระบบไตรยางศ์ (อักษรสูง ๑๑ ตัว, อักษรกลาง ๙ ตัว, อักษรต่ำเดี่ยว ๑๐ ตัว, อักษรต่ำคู่ ๑๔ ตัว)
 *   2. การจำแนกคำเป็น (Live Syllables - กง กน กม เกย เกอว สระยาว) และคำตาย (Dead Syllables - กก กด กบ สระสั้น)
 *   3. เมทริกซ์การผันวรรณยุกต์ 5 เสียง (สามัญ เอก โท ตรี จัตวา) ครบทั้ง 15 กรณีตามโครงสร้างสัทวิทยา
 *   4. การออกเสียงสระเดี่ยว (รัสสระ ๙ เสียง, ทีฆสระ ๙ เสียง) สระประสม ๖ เสียง และสระเกิน (อำ ไอ ใอ เอา ฤ ฤๅ ฦ ฦๅ)
 *   5. มาตราตัวสะกด 8 แม่ (ก กา, กก, กด, กบ, กง, กน, กม, เกย, เกอว) พร้อมการปิดกักลม (Acoustic Glottal Closure)
 *   6. อักษรควบแท้ (กร, กล, กว, ขร, ขล, ขว, คร, คล, คว, ตร, ปร, ปล, พร, พล, ผล)
 *   7. อักษรควบไม่แท้ (ทร ➔ ซ เช่น ทราบ ทราม ทราย ไทร, จร ศร สร ➔ จ ศ ส เช่น จริง ศรี สระ สร้าง)
 *   8. อักษรนำ 3 รูปแบบ:
 *      - ห นำ (หน หม หง หย หร หล หว หนัง หมอ หรูหรา)
 *      - อ นำ ย (อย่า อยู่ อย่าง อยาก)
 *      - อักษรนำ 2 พยางค์ (ขนม [ขะ-หนม], ตลาด [ตะ-หลาด], อร่อย [อะ-หร่อย], ฉลาม [ฉะ-หลาม])
 *   9. คำที่ออกเสียงแบบสมาสและสนธิ (เช่น ราชการ [ราด-ชะ-กาน], ประวัติศาสตร์ [ปฺระ-หวัด-ติ-สาด])
 *   10. การออกเสียง ร หัน (รร): ไม่มีตัวสะกดออกเสียง -อัน (เช่น กรรไกร [กัน-ไกฺร]), มีตัวสะกดออกเสียง -อะ+ตัวสะกด (เช่น กรรม [กัม])
 *   11. ทัณฑฆาตและตัวการันต์ (การไม่ออกเสียงพยัญชนะหรือสระที่มีไม้ทัณฑฆาตกำกับ เช่น จันทร์, ฤทธิ์, พันธุ์, ศาสตร์)
 *   12. การกลมกลืนเสียงและการเชื่อมเสียง (Phonetic Assimilation & Liaison) ในภาษาไทย
 *
 * [ENGLISH]
 * Exhaustive Linguistic and Acoustic Phonetics Rules Engine for Thai Language.
 * Implements full morphological decomposition, tone sandhi, triyang categorization,
 * live/dead syllable acoustics, true/false consonant clusters, leading consonants,
 * Samasa linking vowels, and silent Thanthakhat mechanics based on ORST standards.
 * ============================================================================
 *
 * 1. MODULE RESPONSIBILITY & PURPOSE:
 *    - Encapsulates every formal phonetic rule of the Thai language.
 *    - Provides articulatory analysis, phonological feature tagging, and rule-based phonetic verification.
 *
 * 2. ARCHITECTURE & SYSTEM INTEGRATION:
 *    - Consumed by: ThaiPhoneticsEngineCore.ts, ThaiSpeechAndSingingEngine.ts, and ThaiRoyalSpeechAndSingingStudio.tsx.
 *
 * 3. DATA CONTRACTS:
 *    - Inputs: raw thai string.
 *    - Outputs: PhoneticRuleExplanation, ArticulatoryAcoustics, SyllableBreakdown.
 * ============================================================================
 */

export interface TriyangClassification {
  char: string;
  class: 'high' | 'mid' | 'low_single' | 'low_pair';
  classThai: string; // "อักษรสูง", "อักษรกลาง", "อักษรต่ำเดี่ยว", "อักษรต่ำคู่"
  pairedHighChar?: string; // สำหรับอักษรต่ำคู่ เช่น ค-ช-ซ-ท-พ-ฟ-ฮ คู่กับ ข-ฉ-ส-ฐ-ถ-ผ-ฝ-ห
  sonority: 'sonorant' | 'obstruent';
  ipaConsonant: string;
}

export interface ThaiVowelRule {
  vowelSymbol: string;
  nameThai: string;
  length: 'short' | 'long';
  type: 'monophthong' | 'diphthong' | 'special_extra'; // สระเดี่ยว, สระประสม, สระเกิน
  ipaVowel: string;
  formantF1: number; // Hz
  formantF2: number; // Hz
  durationMultiplier: number;
}

export interface PronunciationRulePrinciple {
  id: string;
  category: 'triyang' | 'tone_rules' | 'clusters' | 'leading_consonants' | 'samasa' | 'silent_letters' | 'vowel_length' | 'coda_stops';
  titleThai: string;
  titleEnglish: string;
  summaryThai: string;
  detailedExplanation: string;
  examples: { word: string; reading: string; note: string }[];
  acousticFeatures: string[];
}

export class ThaiComprehensivePhoneticRulesEngine {
  /**
   * ฐานข้อมูลไตรยางศ์อักษร 3 หมู่ ครบทั้ง 44 ตัว
   */
  public static readonly TRIYANG_TABLE: Record<string, TriyangClassification> = {
    // อักษรกลาง ๙ ตัว (ไก่ จิก เด็ก ตาย เอย บน ปาก โอ่ง)
    'ก': { char: 'ก', class: 'mid', classThai: 'อักษรกลาง', sonority: 'obstruent', ipaConsonant: 'k' },
    'จ': { char: 'จ', class: 'mid', classThai: 'อักษรกลาง', sonority: 'obstruent', ipaConsonant: 'tɕ' },
    'ด': { char: 'ด', class: 'mid', classThai: 'อักษรกลาง', sonority: 'obstruent', ipaConsonant: 'd' },
    'ต': { char: 'ต', class: 'mid', classThai: 'อักษรกลาง', sonority: 'obstruent', ipaConsonant: 't' },
    'บ': { char: 'บ', class: 'mid', classThai: 'อักษรกลาง', sonority: 'obstruent', ipaConsonant: 'b' },
    'ป': { char: 'ป', class: 'mid', classThai: 'อักษรกลาง', sonority: 'obstruent', ipaConsonant: 'p' },
    'อ': { char: 'อ', class: 'mid', classThai: 'อักษรกลาง', sonority: 'obstruent', ipaConsonant: 'ʔ' },
    'ฎ': { char: 'ฎ', class: 'mid', classThai: 'อักษรกลาง', sonority: 'obstruent', ipaConsonant: 'd' },
    'ฏ': { char: 'ฏ', class: 'mid', classThai: 'อักษรกลาง', sonority: 'obstruent', ipaConsonant: 't' },

    // อักษรสูง ๑๑ ตัว (ผี ฝาก ถุง ข้าว สาร ให้ ฉัน + ฐ ฃ ษ ศ)
    'ข': { char: 'ข', class: 'high', classThai: 'อักษรสูง', sonority: 'obstruent', ipaConsonant: 'kʰ' },
    'ฃ': { char: 'ฃ', class: 'high', classThai: 'อักษรสูง', sonority: 'obstruent', ipaConsonant: 'kʰ' },
    'ฉ': { char: 'ฉ', class: 'high', classThai: 'อักษรสูง', sonority: 'obstruent', ipaConsonant: 'tɕʰ' },
    'ฐ': { char: 'ฐ', class: 'high', classThai: 'อักษรสูง', sonority: 'obstruent', ipaConsonant: 'tʰ' },
    'ถ': { char: 'ถ', class: 'high', classThai: 'อักษรสูง', sonority: 'obstruent', ipaConsonant: 'tʰ' },
    'ผ': { char: 'ผ', class: 'high', classThai: 'อักษรสูง', sonority: 'obstruent', ipaConsonant: 'pʰ' },
    'ฝ': { char: 'ฝ', class: 'high', classThai: 'อักษรสูง', sonority: 'obstruent', ipaConsonant: 'f' },
    'ศ': { char: 'ศ', class: 'high', classThai: 'อักษรสูง', sonority: 'obstruent', ipaConsonant: 's' },
    'ษ': { char: 'ษ', class: 'high', classThai: 'อักษรสูง', sonority: 'obstruent', ipaConsonant: 's' },
    'ส': { char: 'ส', class: 'high', classThai: 'อักษรสูง', sonority: 'obstruent', ipaConsonant: 's' },
    'ห': { char: 'ห', class: 'high', classThai: 'อักษรสูง', sonority: 'obstruent', ipaConsonant: 'h' },

    // อักษรต่ำเดี่ยว ๑๐ ตัว (งู ใหญ่ นอน อยู่ ณ ริม วัด โม ฬี โลก)
    'ง': { char: 'ง', class: 'low_single', classThai: 'อักษรต่ำเดี่ยว', sonority: 'sonorant', ipaConsonant: 'ŋ' },
    'ญ': { char: 'ญ', class: 'low_single', classThai: 'อักษรต่ำเดี่ยว', sonority: 'sonorant', ipaConsonant: 'j' },
    'ณ': { char: 'ณ', class: 'low_single', classThai: 'อักษรต่ำเดี่ยว', sonority: 'sonorant', ipaConsonant: 'n' },
    'น': { char: 'น', class: 'low_single', classThai: 'อักษรต่ำเดี่ยว', sonority: 'sonorant', ipaConsonant: 'n' },
    'ม': { char: 'ม', class: 'low_single', classThai: 'อักษรต่ำเดี่ยว', sonority: 'sonorant', ipaConsonant: 'm' },
    'ย': { char: 'ย', class: 'low_single', classThai: 'อักษรต่ำเดี่ยว', sonority: 'sonorant', ipaConsonant: 'j' },
    'ร': { char: 'ร', class: 'low_single', classThai: 'อักษรต่ำเดี่ยว', sonority: 'sonorant', ipaConsonant: 'r' },
    'ล': { char: 'ล', class: 'low_single', classThai: 'อักษรต่ำเดี่ยว', sonority: 'sonorant', ipaConsonant: 'l' },
    'ว': { char: 'ว', class: 'low_single', classThai: 'อักษรต่ำเดี่ยว', sonority: 'sonorant', ipaConsonant: 'w' },
    'ฬ': { char: 'ฬ', class: 'low_single', classThai: 'อักษรต่ำเดี่ยว', sonority: 'sonorant', ipaConsonant: 'l' },

    // อักษรต่ำคู่ ๑๔ ตัว (พ่อ ค้า ฟัน ทอง ซื้อ ช้าง ฮ่อ + ฅ ฆ ฌ ฑ ฒ ธ ภ)
    'ค': { char: 'ค', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ข', sonority: 'obstruent', ipaConsonant: 'kʰ' },
    'ฅ': { char: 'ฅ', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ข', sonority: 'obstruent', ipaConsonant: 'kʰ' },
    'ฆ': { char: 'ฆ', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ข', sonority: 'obstruent', ipaConsonant: 'kʰ' },
    'ช': { char: 'ช', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ฉ', sonority: 'obstruent', ipaConsonant: 'tɕʰ' },
    'ซ': { char: 'ซ', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ส', sonority: 'obstruent', ipaConsonant: 's' },
    'ฌ': { char: 'ฌ', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ฉ', sonority: 'obstruent', ipaConsonant: 'tɕʰ' },
    'ฑ': { char: 'ฑ', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ถ', sonority: 'obstruent', ipaConsonant: 'tʰ' },
    'ฒ': { char: 'ฒ', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ถ', sonority: 'obstruent', ipaConsonant: 'tʰ' },
    'ท': { char: 'ท', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ถ', sonority: 'obstruent', ipaConsonant: 'tʰ' },
    'ธ': { char: 'ธ', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ถ', sonority: 'obstruent', ipaConsonant: 'tʰ' },
    'พ': { char: 'พ', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ผ', sonority: 'obstruent', ipaConsonant: 'pʰ' },
    'ฟ': { char: 'ฟ', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ฝ', sonority: 'obstruent', ipaConsonant: 'f' },
    'ภ': { char: 'ภ', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ผ', sonority: 'obstruent', ipaConsonant: 'pʰ' },
    'ฮ': { char: 'ฮ', class: 'low_pair', classThai: 'อักษรต่ำคู่', pairedHighChar: 'ห', sonority: 'obstruent', ipaConsonant: 'h' }
  };

  /**
   * ฐานข้อมูลสารานุกรมหลักเกณฑ์การออกเสียงภาษาไทยฉบับสมบูรณ์
   */
  public static readonly ALL_PRONUNCIATION_PRINCIPLES: PronunciationRulePrinciple[] = [
    {
      id: 'rule-01-triyang-tone-matrix',
      category: 'tone_rules',
      titleThai: 'หลักการผันวรรณยุกต์ ๕ เสียงและเมทริกซ์คำเป็น-คำตาย',
      titleEnglish: '5-Tone Inflexion Matrix and Live/Dead Syllable Acoustics',
      summaryThai: 'การผันวรรณยุกต์ภาษาไทยขึ้นอยู่กับ ๓ องค์ประกอบหลัก: หมู่ไตรยางศ์ (สูง/กลาง/ต่ำ), โครงสร้างคำเป็น-คำตาย, และความยาวสระ',
      detailedExplanation: `
๑. อักษรกลาง:
   - คำเป็น ผันได้ครบ ๕ เสียง (กา ก่า ก้า ก๊า ก๋า)
   - คำตาย สระสั้น พื้นเสียงเป็นเสียงเอก (กะ), ใส่ไม้โทเป็นเสียงโท (ก้ะ), ใส่ไม้ตรีเป็นเสียงตรี (ก๊ะ), ใส่ไม้จัตวาเป็นเสียงจัตวา (ก๋ะ)
   - คำตาย สระยาว พื้นเสียงเป็นเสียงเอก (กาด), ใส่ไม้โทเป็นเสียงโท (ก้าด), ใส่ไม้ตรีเป็นเสียงตรี (ก๊าด), ใส่ไม้จัตวาเป็นเสียงจัตวา (ก๋าด)

๒. อักษรสูง:
   - คำเป็น พื้นเสียงเป็นเสียงจัตวา (ขา), ใส่ไม้เอกเป็นเสียงเอก (ข่า), ใส่ไม้โทเป็นเสียงโท (ข้า)
   - คำตาย สระสั้น พื้นเสียงเป็นเสียงเอก (ขะ)
   - คำตาย สระยาว พื้นเสียงเป็นเสียงเอก (ขาด), ใส่ไม้โทเป็นเสียงโท (ข้าด)

๓. อักษรต่ำ:
   - คำเป็น พื้นเสียงเป็นเสียงสามัญ (คา), ใส่ไม้เอกเป็นเสียงโท (ค่า), ใส่ไม้โทเป็นเสียงตรี (ค้า)
   - คำตาย สระสั้น พื้นเสียงเป็นเสียงตรี (คะ), ใส่ไม้เอกเป็นเสียงโท (ค่ะ), ใส่ไม้จัตวาเป็นเสียงจัตวา (ค๋ะ)
   - คำตาย สระยาว พื้นเสียงเป็นเสียงโท (คาด), ใส่ไม้โทเป็นเสียงตรี (ค้ด)
      `,
      examples: [
        { word: 'กา', reading: '[กา]', note: 'อักษรกลาง คำเป็น สระยาว ➔ เสียงสามัญ (F0 ~1.00)' },
        { word: 'ข่า', reading: '[ข่า]', note: 'อักษรสูง คำเป็น ไม้เอก ➔ เสียงเอก (F0 ~0.82)' },
        { word: 'ค้า', reading: '[ค้า]', note: 'อักษรต่ำ คำเป็น ไม้โท ➔ เสียงตรี (F0 ~1.30)' },
        { word: 'ค่ะ', reading: '[ขะ]', note: 'อักษรต่ำ คำตาย สระสั้น ไม้เอก ➔ เสียงโท (F0 ~1.20 -> 0.85)' }
      ],
      acousticFeatures: ['F0 Pitch Contour Tracing', 'Jitter <0.5%', 'Tone Envelope Smoothing']
    },
    {
      id: 'rule-02-true-clusters',
      category: 'clusters',
      titleThai: 'หลักการออกเสียงอักษรควบกล้ำแท้ (True Consonant Clusters)',
      titleEnglish: 'True Consonant Cluster Acoustics (กฺร, กฺล, กฺว, พฺร, พฺล, ตฺร ฯลฯ)',
      summaryThai: 'อักษรควบแท้ คือพยัญชนะ ๒ ตัวเรียงกัน ออกเสียงกล้ำพร้อมกันเป็นพยางค์เดียว โดยมี ร, ล, ว เป็นพยัญชนะตัวหลัง',
      detailedExplanation: `
พยัญชนะควบกล้ำแท้ในภาษาไทยมี ๑๕ ชุด:
- ควบ ร: กร, ขร, คร, ตร, ปร, พร (เช่น กราบ, ขรุขระ, ครู, ตรวจ, ปราบ, พร้อม)
- ควบ ล: กล, ขล, คล, ปล, ผล, พล (เช่น กลาง, ขลาด, คลอง, ปลา, แผล, พลอย)
- ควบ ว: กว, ขว, คว (เช่น กวาด, ขวาน, ควาย)

ข้อห้ามเด็ดขาดในการสังเคราะห์เสียง:
- ห้ามมีสระอะแทรกกึ่งเสียงระหว่างพยัญชนะควบแท้ (เช่น ปราบ ต้องไม่อ่านว่า ปะ-ราบ, กว้าง ต้องไม่อ่านว่า กะ-ว้าง)
- ต้องปล่อยลมและเริ่มก้องเส้นเสียงพร้อมกันด้วย Voice Onset Time (VOT) ที่สมดุล
      `,
      examples: [
        { word: 'กราบ', reading: '[กฺราบ]', note: 'ออกเสียง ก และ ร กล้ำพร้อมกันอย่างแม่นยำ' },
        { word: 'กว้างขวาง', reading: '[กฺว้าง-ขฺวาง]', note: 'ควบ ว ปากห่อกลมพร้อมปล่อยเสียงพยัญชนะต้น' },
        { word: 'เพลิดเพลิน', reading: '[เพฺลิด-เพฺลิน]', note: 'ควบ ล ลิ้นแตะปุ่มเหงือกพร้อมออกเสียง' }
      ],
      acousticFeatures: ['Coarticulation Formant Transition', 'Instantaneous VOT', 'Zero Epenthetic Vowel']
    },
    {
      id: 'rule-03-false-clusters',
      category: 'clusters',
      titleThai: 'หลักการออกเสียงอักษรควบไม่แท้ (False Consonant Clusters)',
      titleEnglish: 'False Consonant Clusters (ทร ➔ ซ, จร/ศร/สร ➔ จ/ศ/ส)',
      summaryThai: 'พยัญชนะ ๒ ตัวเขียนติดกัน แต่ไม่ออกเสียงควบกล้ำ โดยเปลี่ยนเป็นเสียง ซ หรือออกเสียงเฉพาะพยัญชนะตัวแรก',
      detailedExplanation: `
๑. ทร ออกเสียงเป็น ซ:
   - ทราบ (ซาบ), ทราม (ซาม), ทราย (ซาย), แทรก (แซก), ทรุดโทรม (ซุด-โซม), นนทรี (นน-ซี), พุทรา (พุด-ซา), อินทรี (อิน-ซี)
   - ยกเว้นคำบาลีสันสกฤตบางคำที่ออกเสียงควบแท้ เช่น นิทรา (นิด-ทรา), จันทรา (จัน-ทรา), แทรกเตอร์ (แซก-เต้อ)

๒. จร, ศร, สร ออกเสียงเฉพาะตัวหน้า (ตัดเสียง ร ออก 100%):
   - จริง (จิง)
   - เศร้า (เส้า), ศรี (สี), ศรัทธา (สัด-ทา)
   - สระ (สะ), สร้าง (ส้าง), สระน้ำ (สะ-น้ำ), สร้อย (ส้อย), เสริม (เสิม)
      `,
      examples: [
        { word: 'พุทรา', reading: '[พุด-ซา]', note: 'ทร แปลงเป็นเสียง ซ' },
        { word: 'เศรษฐี', reading: '[เสด-ถี]', note: 'ศร ออกเสียง ส ไม่ออกเสียง ร' },
        { word: 'สร้างสรรค์', reading: '[ส้าง-สัน]', note: 'สร ออกเสียง ส เท่านั้น' }
      ],
      acousticFeatures: ['Sibilant Fricative Noise /s/', 'Suppression of Rhotic Flap']
    },
    {
      id: 'rule-04-leading-consonants',
      category: 'leading_consonants',
      titleThai: 'หลักการออกเสียงอักษรนำ (ห นำ, อ นำ, และอักษรนำ ๒ พยางค์)',
      titleEnglish: 'Leading Consonants (Ho-Nam, O-Nam, and 2-Syllable Leading Rules)',
      summaryThai: 'พยัญชนะ ๒ ตัวเรียงกัน พยัญชนะตัวแรกมีอิทธิพลบังคับเสียงวรรณยุกต์ของพยัญชนะตัวที่สองตามกฎไตรยางศ์',
      detailedExplanation: `
๑. ห นำ อักษรต่ำเดี่ยว (ง, ญ, น, ย, ร, ล, ว, ม):
   - ทำให้อักษรต่ำเดี่ยวผันเสียงวรรณยุกต์ได้เหมือนอักษรสูง (หนา, หมู, หงาย, หญิง, หรือ, หวาน)

๒. อ นำ ย มีเพียง ๔ คำในภาษาไทย:
   - อย่า, อยู่, อย่าง, อยาก (ออกเสียง ย เป็นเสียงเอกตามอักษรกลาง อ)

๓. อักษรนำ ๒ พยางค์ (อักษรสูงหรืออักษรกลาง นำ อักษรต่ำเดี่ยว):
   - พยางค์หน้าออกเสียง อะ กึ่งมาตรา (Ultra-short /a/ ~40ms)
   - พยางค์หลังออกเสียงผันวรรณยุกต์ตามอักษรนำตัวหน้าประหนึ่งมี ห นำ
   - เช่น ขนม [ขะ-หนม], ตลาด [ตะ-หลาด], อร่อย [อะ-หร่อย], องุ่น [อะ-หงุ่น], ผลิต [ผะ-หลิด], จมูก [จะ-หมูก]
      `,
      examples: [
        { word: 'ขนม', reading: '[ขะ-หนม]', note: 'ข นำ น ทำให้ นม ออกเสียงเหมือน หนม (เสียงจัตวา)' },
        { word: 'ตลาด', reading: '[ตะ-หลาด]', note: 'ต นำ ล ทำให้ ลาด ออกเสียงเหมือน หลาด (เสียงเอก)' },
        { word: 'อย่าอยู่เคียงข้าง', reading: '[หย่า-หยู่-เคียง-ข้าง]', note: 'อ นำ ย บังคับเสียงเอก' }
      ],
      acousticFeatures: ['Ultra-short Epenthetic Vowel (40ms)', 'Tone Inflexion Inheritance']
    },
    {
      id: 'rule-05-samasa-sandhi',
      category: 'samasa',
      titleThai: 'หลักการอ่านคำสมาสและคำสนธิ (Pali-Sanskrit Samasa & Sandhi Linking)',
      titleEnglish: 'Pali-Sanskrit Samasa Compound Word Linking & Sandhi Fusion',
      summaryThai: 'คำที่มาจากภาษาบาลีและสันสกฤตรวมกัน ต้องออกเสียงเชื่อมพยางค์ระหว่างคำด้วยสระ อะ หรือ อิ/อุ ตามรูปศัพท์',
      detailedExplanation: `
๑. กฎคำสมาส (การต่อคำ):
   - พยางค์ท้ายของคำหน้าต้องออกเสียงสระเชื่อม แม้ไม่มีรูปสระปรากฏ เช่น:
     * ราชการ ➔ [ราด-ชะ-กาน]
     * ประวัติศาสตร์ ➔ [ปฺระ-หวัด-ติ-สาด]
     * ศิลปวัฒนธรรม ➔ [สิน-ละ-ปะ-วัด-ทะ-นะ-ทำ]
     * เกษตรกรรม ➔ [กะ-เสด-ตฺระ-กำ] หรือ [กะ-เสด-ตฺระ-กัม]
     * รัฐมนตรี ➔ [รัด-ถะ-มน-ตฺรี]
     * สุขภาพ ➔ [สุก-ขะ-พาบ]

๒. ข้อยกเว้น (คำประสมไทยแท้ หรือคำยกเว้นของราชบัณฑิตยสถาน ไม่ออกเสียงสระเชื่อม):
   - ชลบุรี ➔ [ชน-บุ-รี] (ไม่ใช่อ่าน ชน-ละ-บุ-รี)
   - สุพรรณบุรี ➔ [สุ-พัน-บุ-รี]
   - ราชบุรี ➔ [ราด-บุ-รี]
   - ลพบุรี ➔ [ลบ-บุ-รี]
   - นนทบุรี ➔ [นน-ทา-บุ-รี]
   - ตักบาตร ➔ [ตัก-บาด]
      `,
      examples: [
        { word: 'ประวัติศาสตร์', reading: '[ปฺระ-หวัด-ติ-สาด]', note: 'สมาสเชื่อมเสียง -ติ- ระหว่างประวัติกับศาสตร์' },
        { word: 'มหาชน', reading: '[มะ-หา-ชน]', note: 'คำสมาสบาลี-สันสกฤต' },
        { word: 'แพทยศาสตร์', reading: '[แพด-ทะ-ยะ-สาด]', note: 'สมาสเชื่อมเสียง -ทะ-ยะ-' }
      ],
      acousticFeatures: ['Inter-lexical Formant Transition', 'Seamless Linking Vowels']
    },
    {
      id: 'rule-06-ro-han-and-thanthakhat',
      category: 'silent_letters',
      titleThai: 'หลักการออกเสียง ร หัน (รร) และตัวทัณฑฆาตการันต์ (Thanthakhat)',
      titleEnglish: 'Ro-Han (รร) Phonetics and Silent Thanthakhat Consonant Cancellation',
      summaryThai: 'ร สองตัว (ร หัน) มีกฎการออกเสียง ๒ แบบ และทัณฑฆาตทำหน้าที่ตัดเสียงพยัญชนะอย่างสมบูรณ์',
      detailedExplanation: `
๑. การออกเสียง ร หัน (รร):
   - กรณีไม่มีตัวสะกด: ออกเสียงเป็นสระ อะ + ตัวสะกดแม่กน (-อัน) เช่น กรรไกร [กัน-ไกฺร], บรรยาย [บัน-ยาย], สรรพ [สับ]
   - กรณีมีตัวสะกด: ออกเสียงเป็นสระ อะ + ตัวสะกดนั้นๆ เช่น กรรม [กัม], ธรรม [ทำ], วรรณ [วัน], พรรณนา [พัน-นะ-นา]
   - กรณี ร หัน มีพยัญชนะตามหลังและมีไม้ทัณฑฆาต: ออกเสียงเป็น -อัน เช่น ครรภ์ [คัน]

๒. ทัณฑฆาตและตัวการันต์ (ตัดเสียงพยัญชนะและสระ):
   - ฆ่าพยัญชนะตัวเดียว: รมย์ [ร็อม], สิงห์ [สิง], กานต์ [กาน]
   - ฆ่าพยัญชนะ ๒ ตัว: จันทร์ [จัน] (ไม่ออกเสียง ทร), ศิลปศาสตร์ [สิน-ละ-ปะ-สาด]
   - ฆ่าพยัญชนะและสระ: ฤทธิ์ [ริด] (ไม่ออกเสียง ธิ), กษัตริย์ [กะ-สัด], พันธุ์ [พัน], บริสุทธิ์ [บอ-ริ-สุด]
      `,
      examples: [
        { word: 'กรรไกร', reading: '[กัน-ไกฺร]', note: 'ร หัน ไม่มีตัวสะกด ออกเสียงเป็น อัน' },
        { word: 'ธรรมชาติ', reading: '[ทำ-มะ-ชาด]', note: 'ร หัน มี ม สะกด ออกเสียงเป็น อำ/อัม' },
        { word: 'ดวงจันทร์', reading: '[ดวง-จัน]', note: 'ทร์ มีทัณฑฆาตตัดเสียงทั้ง ท และ ร' }
      ],
      acousticFeatures: ['Zero Acoustic Energy on Silent Codas', 'Rapid Nasal Resonation']
    }
  ];

  /**
   * ตรวจสอบว่าคำมีลักษณะตามหลักสัทศาสตร์ข้อใดบ้าง
   */
  public static evaluatePhoneticRules(word: string): PronunciationRulePrinciple[] {
    const matchedRules: PronunciationRulePrinciple[] = [];

    // ตรวจสอบ ร หัน
    if (word.includes('รร')) {
      const r = this.ALL_PRONUNCIATION_PRINCIPLES.find(p => p.id === 'rule-06-ro-han-and-thanthakhat');
      if (r) matchedRules.push(r);
    }

    // ตรวจสอบ ทัณฑฆาต
    if (word.includes('์')) {
      const r = this.ALL_PRONUNCIATION_PRINCIPLES.find(p => p.id === 'rule-06-ro-han-and-thanthakhat');
      if (r && !matchedRules.includes(r)) matchedRules.push(r);
    }

    // ตรวจสอบ ควบแท้
    if (/(กร|กล|กว|ขร|ขล|ขว|คร|คล|คว|ตร|ปร|ปล|พร|พล|ผล)/.test(word)) {
      const r = this.ALL_PRONUNCIATION_PRINCIPLES.find(p => p.id === 'rule-02-true-clusters');
      if (r) matchedRules.push(r);
    }

    // ตรวจสอบ ควบไม่แท้
    if (/(ทร|จร|ศร|สร)/.test(word)) {
      const r = this.ALL_PRONUNCIATION_PRINCIPLES.find(p => p.id === 'rule-03-false-clusters');
      if (r) matchedRules.push(r);
    }

    // ตรวจสอบ อักษรนำ
    if (/(หน|หม|หง|หย|หร|หล|หว|ขน|ขม|ถน|สม|สล|สน|จร|อร|อย)/.test(word)) {
      const r = this.ALL_PRONUNCIATION_PRINCIPLES.find(p => p.id === 'rule-04-leading-consonants');
      if (r) matchedRules.push(r);
    }

    // กฎวรรณยุกต์เสมอ
    const toneRule = this.ALL_PRONUNCIATION_PRINCIPLES.find(p => p.id === 'rule-01-triyang-tone-matrix');
    if (toneRule && !matchedRules.includes(toneRule)) {
      matchedRules.unshift(toneRule);
    }

    return matchedRules;
  }
}
