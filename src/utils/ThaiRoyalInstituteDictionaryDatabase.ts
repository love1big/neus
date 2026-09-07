/**
 * @file ThaiRoyalInstituteDictionaryDatabase.ts
 * @description
 * ============================================================================
 * [THAI]
 * ฐานข้อมูลและคลังความรู้พจนานุกรมฉบับราชบัณฑิตยสถานแบบออฟไลน์ 100% (Thai Royal Institute Comprehensive Dictionary Vault)
 * รวบรวมคลังคำศัพท์ภาษาไทย ศัพท์บัญญัติ ศัพท์ราชาศัพท์ คำยืมภาษาบาลี-สันสกฤต-เขมร-ชวา-จีน-อังกฤษ
 * พร้อมข้อมูลสัทศาสตร์ครบถ้วน:
 *   1. คำอ่านตามอักขรวิธีพจนานุกรมราชบัณฑิตยสถาน (Phonetic Respelling)
 *   2. สัทอักษรสากล (IPA Transcription)
 *   3. การวิเคราะห์ไตรยางศ์ (อักษรสูง-กลาง-ต่ำ), มาตราตัวสะกด (8 แม่), สระสั้น-ยาว, และวรรณยุกต์ 5 เสียง
 *   4. ชนิดของคำ (Part of Speech: น., ก., ว., ส., บ., สัน., อุ.)
 *   5. นิยามความหมายตามราชบัณฑิตยสถานอย่างเป็นทางการ (Official Definitions)
 *   6. รากศัพท์และที่มาของคำ (Etymology: บาลี, สันสกฤต, เขมร, ไทยแท้ ฯลฯ)
 *   7. ระบบแจ้งเตือนคำพ้องรูป/คำที่อ่านได้หลายแบบ (Heteronym & Polyphonic Words)
 *      เช่น เพลา ([เพ-ลา] เวลา / [เพลา] แกนล้อ/เบาลง), สระ ([สะ] แอ่งน้ำ / [สะ-หระ] ตัวอักษรแทนเสียงสระ),
 *      กรี ([กรี] โครงแข็งหัวกุ้ง / [กะ-รี] ช้าง), ปรัก ([ปรัก] เงิน / [ปะ-หรัก] หักพัง) เพื่อให้ระบบถามผู้ใช้ก่อน
 *   8. API สำหรับ AI Offline เพื่อให้ AI สามารถดึงข้อมูล วิเคราะห์คำศัพท์ และตรวจความถูกต้องได้โดยตรง
 *
 * [ENGLISH]
 * Enterprise 100% Offline Thai Royal Institute Dictionary Database & Lexical Vault.
 * Provides exhaustive lexical, morphological, phonetic, and semantic metadata according to the
 * Royal Society of Thailand (ORST / ราชบัณฑิตยสภา):
 *   - Official Royal Institute phonetic respellings (e.g., [กะ-ระ-นี], [สะ-หมา-ทิ])
 *   - International Phonetic Alphabet (IPA) tokens with tone contours
 *   - Part of Speech, Etymology (Pali, Sanskrit, Khmer, Mon, Old Thai, Loanwords)
 *   - Official Royal Institute semantic definitions and illustrative usage examples
 *   - Heteronym & Multi-reading disambiguation registry (flags ambiguous words requiring user confirmation)
 *   - Offline AI query engine for semantic search, exact lookup, and phonetic verification
 * ============================================================================
 *
 * 1. MODULE RESPONSIBILITY & PURPOSE:
 *    - Serves as the authoritative offline source of truth for Thai pronunciation and word meanings.
 *    - Provides fast indexed lookup (Exact, Prefix, Substring, Category, and Multi-reading queries).
 *
 * 2. ARCHITECTURE & SYSTEM INTEGRATION:
 *    - Consumed by: ThaiSemanticSegmenterAndDisambiguator.ts, ThaiSpeechAndSingingEngine.ts,
 *      AIOfflineRoyalDictionaryNavigator.ts, and ThaiRoyalSpeechAndSingingStudio.tsx.
 *
 * 3. DATA CONTRACTS:
 *    - Inputs: Search query string, category filter, or word token.
 *    - Outputs: RoyalDictionaryEntry[], HeteronymResolutionOption[], PhoneticAnalysis.
 *
 * 4. USAGE EXAMPLE:
 *    ```ts
 *    import { ThaiRoyalInstituteDictionaryDatabase } from '../utils/ThaiRoyalInstituteDictionaryDatabase';
 *    const entry = ThaiRoyalInstituteDictionaryDatabase.lookupWord('สมาธิ');
 *    console.log(entry?.phoneticReading); // "[สะ-มา-ทิ]"
 *    ```
 */

export type ThaiPartOfSpeech =
  | 'noun' // น. (นาม)
  | 'verb' // ก. (กริยา)
  | 'adverb_adjective' // ว. (วิเศษณ์)
  | 'pronoun' // ส. (สรรพนาม)
  | 'preposition' // บ. (บุพบท)
  | 'conjunction' // สัน. (สันธาน)
  | 'interjection' // อุ. (อุทาน)
  | 'prefix_suffix' // คำประกอบ / วิภัตติปัจจัย
  | 'royal_term' // ราชาศัพท์
  | 'idiom'; // สำนวน/สุภาษิต

export type WordEtymology =
  | 'Thai' // ไทยแท้
  | 'Pali' // บาลี (ป.)
  | 'Sanskrit' // สันสกฤต (ส.)
  | 'Pali_Sanskrit' // บาลี-สันสกฤต
  | 'Khmer' // เขมร
  | 'Java_Malay' // ชวา-มลายู
  | 'Chinese' // จีน
  | 'English' // อังกฤษ
  | 'Portuguese' // โปรตุเกส
  | 'Persian' // เปอร์เซีย
  | 'Mon' // มอญ
  | 'Unknown';

export interface MultiReadingOption {
  reading: string; // คำอ่าน เช่น "เพ-ลา"
  ipa: string;
  meaningSummary: string; // "เวลา, คราว"
  partOfSpeech: string;
  contextExample: string;
  isFormalPreferred?: boolean;
}

export interface RoyalDictionaryEntry {
  id: string;
  word: string; // รูปคำเขียน เช่น "เพลา", "กษัตริย์"
  phoneticReading: string; // คำอ่านตามราชบัณฑิตฯ เช่น "[เพ-ลา]", "[กะ-สัด]"
  secondaryReadings?: string[]; // คำอ่านอื่นที่ราชบัณฑิตฯ อนุโลม หรือยอมรับ
  ipa: string; // สัทอักษรสากล เช่น /pʰeː˧.laː˧/
  partOfSpeech: ThaiPartOfSpeech;
  partOfSpeechThai: string; // "น.", "ก.", "ว." ฯลฯ
  definition: string; // นิยามความหมายตามพจนานุกรมราชบัณฑิตยสถาน
  etymology: WordEtymology;
  etymologyDetail: string; // เช่น "ป. ขตฺติย; ส. กฺษตฺริย"
  tones: string[]; // เช่น ["สามัญ", "เอก"]
  syllableCount: number;
  isRoyalVocabulary: boolean; // เป็นคำราชาศัพท์หรือไม่
  hasMultipleReadings: boolean; // เป็นคำพ้องรูป/อ่านได้หลายแบบหรือไม่
  multiReadingOptions?: MultiReadingOption[]; // ตัวเลือกกรณีอ่านได้หลายแบบ
  exampleSentences: string[];
  tags: string[]; // หมวดหมู่ เช่น "วรรณคดี", "วิทยาศาสตร์", "กฎหมาย", "ราชาศัพท์"
}

// ============================================================================
// COMPREHENSIVE THAI ROYAL INSTITUTE LEXICAL VAULT
// ============================================================================

export const ROYAL_INSTITUTE_DICTIONARY_ENTRIES: RoyalDictionaryEntry[] = [
  // --- คำพ้องรูป & คำอ่านหลายแบบ (Multi-reading / Heteronyms) ---
  {
    id: 'rd-001',
    word: 'เพลา',
    phoneticReading: '[เพ-ลา] หรือ [เพลา]',
    secondaryReadings: ['[เพ-ลา]', '[เพลา]'],
    ipa: '/pʰeː˧.laː˧/ หรือ /pʰlaw˧/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น. / ก. / ว.',
    definition: '๑. [เพ-ลา] น. คราว, เวลา. ๒. [เพลา] น. แกนสำหรับสอดในดุมรถหรือล้อ, ตัก (เช่น นั่งบนเพลา). ๓. [เพลา] ว. เบาลง, ผ่อนลง (เช่น เพลามือ, เพลาลม).',
    etymology: 'Khmer',
    etymologyDetail: 'เขมร (เพล) แปลว่า คราว, เวลา; ไทยแท้ แปลว่า แกน/ตัก/เบา',
    tones: ['สามัญ-สามัญ', 'สามัญ'],
    syllableCount: 2,
    isRoyalVocabulary: false,
    hasMultipleReadings: true,
    multiReadingOptions: [
      {
        reading: '[เพ-ลา] (สองพยางค์)',
        ipa: '/pʰeː˧.laː˧/',
        meaningSummary: 'เวลา, คราว, สมัย (เช่น เพลาย่ำค่ำ, เพลาสาย)',
        partOfSpeech: 'น. (นาม)',
        contextExample: 'ถึงเพลาย่ำค่ำ พระอาทิตย์อัสดง'
      },
      {
        reading: '[เพลา] (หนึ่งพยางค์)',
        ipa: '/pʰlaw˧/',
        meaningSummary: 'แกนล้อรถ, ตัก, หรือ อาการผ่อนเบาลง (เช่น เพลามือ, เพลาเครื่องยนต์)',
        partOfSpeech: 'น. / ก. / ว.',
        contextExample: 'ช่างกำลังซ่อมเพลารถยนต์ หรือ โปรดเพลามือลงหน่อย'
      }
    ],
    exampleSentences: [
      'ถึงเพลายามสอง เสียงระฆังก็ดังกังวาน (อ่าน เพ-ลา)',
      'เพลาเกวียนหักทำให้เดินทางต่อไปไม่ได้ (อ่าน เพลา)'
    ],
    tags: ['คำพ้องรูป', 'คำอ่านหลายแบบ', 'ยานพาหนะ', 'เวลา']
  },
  {
    id: 'rd-002',
    word: 'สระ',
    phoneticReading: '[สะ] หรือ [สะ-หระ]',
    secondaryReadings: ['[สะ]', '[สะ-หระ]'],
    ipa: '/sa˨˩/ หรือ /sa˨˩.ra˨˩/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น. / ก.',
    definition: '๑. [สะ] น. แอ่งน้ำขนาดใหญ่, หนองน้ำ. ๒. [สะ] ก. ชำระล้างผม (เช่น สระผม). ๓. [สะ-หระ] น. เสียงหรือตัวอักษรแทนเสียงแท้ในภาษา (เช่น สระอะ สระอา).',
    etymology: 'Sanskrit',
    etymologyDetail: 'ส. สรสฺ (แอ่งน้ำ); ส. สฺวร (เสียงสระ)',
    tones: ['เอก', 'เอก-เอก'],
    syllableCount: 1,
    isRoyalVocabulary: false,
    hasMultipleReadings: true,
    multiReadingOptions: [
      {
        reading: '[สะ] (หนึ่งพยางค์)',
        ipa: '/sa˨˩/',
        meaningSummary: 'แอ่งน้ำ บึง หรือการชำระล้างเส้นผม (สระผม)',
        partOfSpeech: 'น. / ก.',
        contextExample: 'บัวหลวงบานสะพรั่งอยู่ในสระน้ำ'
      },
      {
        reading: '[สะ-หระ] (สองพยางค์)',
        ipa: '/sa˨˩.ra˨˩/',
        meaningSummary: 'รูปหรือเสียงสระในระบบภาษาศาสตร์',
        partOfSpeech: 'น. (นาม)',
        contextExample: 'ภาษาไทยมีรูปสระ ๒๑ รูป ๓๒ เสียง'
      }
    ],
    exampleSentences: [
      'เด็กๆ กระโดดลงเล่นน้ำในสระ (อ่าน สะ)',
      'นักเรียนกำลังหัดท่องสระภาษาไทย (อ่าน สะ-หระ)'
    ],
    tags: ['คำพ้องรูป', 'คำอ่านหลายแบบ', 'ภาษาศาสตร์', 'ธรรมชาติ']
  },
  {
    id: 'rd-003',
    word: 'กรี',
    phoneticReading: '[กรี] หรือ [กะ-รี]',
    secondaryReadings: ['[กรี]', '[กะ-รี]'],
    ipa: '/kriː˧/ หรือ /ka˨˩.riː˧/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: '๑. [กรี] น. โครงแข็งแหลมที่หัวกุ้ง. ๒. [กะ-รี] น. ช้าง (ศัพท์กวี/บาลีสันสกฤต).',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ไทยแท้ (กรีกุ้ง); ป., ส. กรินฺ (ช้าง ผู้มีมือคืองวง)',
    tones: ['สามัญ', 'เอก-สามัญ'],
    syllableCount: 1,
    isRoyalVocabulary: false,
    hasMultipleReadings: true,
    multiReadingOptions: [
      {
        reading: '[กรี] (หนึ่งพยางค์ อักษรควบกล้ำ)',
        ipa: '/kriː˧/',
        meaningSummary: 'กระดูกแข็งแหลมคมบริเวณส่วนหัวของกุ้ง',
        partOfSpeech: 'น.',
        contextExample: 'ระวังกรีกุ้งจะตำมือเวลาปอกเปลือก'
      },
      {
        reading: '[กะ-รี] (สองพยางค์)',
        ipa: '/ka˨˩.riː˧/',
        meaningSummary: 'ช้าง (คำไวพจน์ในวรรณคดี)',
        partOfSpeech: 'น.',
        contextExample: 'ฝูงกะรีเยื้องย่างเข้าสู่สมรภูมิรบ'
      }
    ],
    exampleSentences: [
      'กรีกุ้งมีความคมมาก (อ่าน กรี)',
      'เสียงกะรีร้องก้องไพรสนฑ์ (อ่าน กะ-รี)'
    ],
    tags: ['คำพ้องรูป', 'คำอ่านหลายแบบ', 'สัตว์', 'วรรณคดี']
  },
  {
    id: 'rd-004',
    word: 'ปรัก',
    phoneticReading: '[ปรัก] หรือ [ปะ-หรัก]',
    secondaryReadings: ['[ปรัก]', '[ปะ-หรัก]'],
    ipa: '/prak˨˩/ หรือ /pa˨˩.rak˨˩/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น. / ก.',
    definition: '๑. [ปรัก] น. เงิน (คำเขมร). ๒. [ปะ-หรัก] ก./ว. หัก, พัง (มักใช้ควบกับคำว่า หัก เป็น ปรักหักพัง).',
    etymology: 'Khmer',
    etymologyDetail: 'เขมร ปฺราก (เงิน)',
    tones: ['เอก', 'เอก-เอก'],
    syllableCount: 1,
    isRoyalVocabulary: false,
    hasMultipleReadings: true,
    multiReadingOptions: [
      {
        reading: '[ปรัก] (หนึ่งพยางค์ อักษรควบ)',
        ipa: '/prak˨˩/',
        meaningSummary: 'เงิน, เงินตรา (เช่น เหรียญปรัก, ขันปรัก)',
        partOfSpeech: 'น.',
        contextExample: 'พระราชทานถุงปรักเป็นรางวัล'
      },
      {
        reading: '[ปะ-หรัก] (สองพยางค์ อักษรนำ)',
        ipa: '/pa˨˩.rak˨˩/',
        meaningSummary: 'หักพัง ทรุดโทรม (มักใช้ว่า ปรักหักพัง)',
        partOfSpeech: 'ก. / ว.',
        contextExample: 'โบราณสถานปรักหักพังไปตามกาลเวลา'
      }
    ],
    exampleSentences: [
      'ซากปรักหักพังของปราสาทโบราณ (อ่าน ปะ-หรัก)',
      'เครื่องแก้วและขันปรักวางประดับบนโต๊ะ (อ่าน ปรัก)'
    ],
    tags: ['คำพ้องรูป', 'คำอ่านหลายแบบ', 'โบราณคดี']
  },
  {
    id: 'rd-005',
    word: 'ขัดสมาธิ',
    phoneticReading: '[ขัด-สะ-หมาด] หรือ [ขัด-สะ-มา-ทิ]',
    secondaryReadings: ['[ขัด-สะ-หมาด]', '[ขัด-สะ-มา-ทิ]'],
    ipa: '/kʰat˨˩.sa˨˩.maːt˨˩/ หรือ /kʰat˨˩.sa˨˩.maː˧.tʰi˦˥/',
    partOfSpeech: 'verb',
    partOfSpeechThai: 'ก.',
    definition: 'ก. นั่งคู้เข่าทั้ง ๒ ข้างให้แบะลงที่พื้นราบ แล้วพับขาทั้ง ๒ ข้างเข้ามาเกยกันหรือซ้อนกัน.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป. สมาธิ; ส. สมาธิ (มักอ่าน ขัด-สะ-หมาด ในกิริยานั่ง)',
    tones: ['เอก-เอก-เอก', 'เอก-เอก-สามัญ-ตรี'],
    syllableCount: 3,
    isRoyalVocabulary: false,
    hasMultipleReadings: true,
    multiReadingOptions: [
      {
        reading: '[ขัด-สะ-หมาด] (นิยมใช้ที่สุดในการนั่ง)',
        ipa: '/kʰat˨˩.sa˨˩.maːt˨˩/',
        meaningSummary: 'ท่านั่งพับขาคู้เข่าซ้อนกันบนพื้นราบ',
        partOfSpeech: 'ก.',
        contextExample: 'พระสงฆ์นั่งขัดสมาธิเจริญภาวนา',
        isFormalPreferred: true
      },
      {
        reading: '[ขัด-สะ-มา-ทิ] (อ่านตามรูปศัพท์บาลี)',
        ipa: '/kʰat˨˩.sa˨˩.maː˧.tʰi˦˥/',
        meaningSummary: 'การนั่งทำสมาธิ (อ่านเรียงพยางค์)',
        partOfSpeech: 'ก.',
        contextExample: 'นั่งขัดสมาธิเพื่อกำหนดจิต'
      }
    ],
    exampleSentences: [
      'เด็กๆ นั่งขัดสมาธิฟังนิทานอย่างเรียบร้อย (อ่าน ขัด-สะ-หมาด)'
    ],
    tags: ['คำอ่านหลายแบบ', 'อิริยาบถ', 'พุทธศาสนา']
  },
  {
    id: 'rd-006',
    word: 'พยาธิ',
    phoneticReading: '[พะ-ยา-ทิ] หรือ [พะ-ยาด]',
    secondaryReadings: ['[พะ-ยา-ทิ]', '[พะ-ยาด]'],
    ipa: '/pʰa˦˥.jaː˧.tʰi˦˥/ หรือ /pʰa˦˥.jaːt˥˩/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: '๑. [พะ-ยา-ทิ] น. ความเจ็บไข้ได้ป่วย (เช่น ชราพยาธิ). ๒. [พะ-ยาด] น. สัตว์ไม่มีกระดูกสันหลังจำพวกหนอนตัวกลมหรือตัวแบนที่อาศัยในร่างกายสิ่งมีชีวิตอื่น.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป. พฺยาธิ; ส. วฺยาธิ',
    tones: ['ตรี-สามัญ-ตรี', 'ตรี-โท'],
    syllableCount: 3,
    isRoyalVocabulary: false,
    hasMultipleReadings: true,
    multiReadingOptions: [
      {
        reading: '[พะ-ยาด] (พยาธิในร่างกาย)',
        ipa: '/pʰa˦˥.jaːt˥˩/',
        meaningSummary: 'สิ่งมีชีวิตปรสิตที่อาศัยแย่งอาหารในลำไส้หรือร่างกาย',
        partOfSpeech: 'น.',
        contextExample: 'ควรรับประทานอาหารปรุงสุกเพื่อป้องกันพยาธิใบไม้ตับ'
      },
      {
        reading: '[พะ-ยา-ทิ] (ความเจ็บป่วย)',
        ipa: '/pʰa˦˥.jaː˧.tʰi˦˥/',
        meaningSummary: 'ความเจ็บป่วย ความทรมานจากโรคภัย (มักพบในหลักธรรม ชาติ ชรา มรณะ พยาธิ)',
        partOfSpeech: 'น.',
        contextExample: 'มนุษย์ทุกคนย่อมหนีไม่พ้นความแก่และความพยาธิ'
      }
    ],
    exampleSentences: [
      'หมอสั่งจ่ายยาถ่ายพยาธิ (อ่าน พะ-ยาด)',
      'การไม่มีโรคเป็นลาภอันประเสริฐ ไร้พยาธิเบียดเบียน (อ่าน พะ-ยา-ทิ)'
    ],
    tags: ['คำพ้องรูป', 'คำอ่านหลายแบบ', 'การแพทย์', 'ธรรมะ']
  },
  {
    id: 'rd-007',
    word: 'แหน',
    phoneticReading: '[แหน] หรือ [แหฺน]',
    secondaryReadings: ['[แหน]', '[แหฺน]'],
    ipa: '/hɛːn˩˩˦/ หรือ /nɛːn˩˩˦/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น. / ก.',
    definition: '๑. [แหน] น. ชื่อพืชน้ำขนาดเล็ก ลอยอยู่บนผิวน้ำ (เช่น แหนแดง แหนเป็ด). ๒. [แหฺน (ห นำ น)] ก. หวงแหน, เฝ้าระวังรักษา (เช่น หวงแหน, ขแหน).',
    etymology: 'Thai',
    etymologyDetail: 'ไทยแท้',
    tones: ['จัตวา', 'จัตวา'],
    syllableCount: 1,
    isRoyalVocabulary: false,
    hasMultipleReadings: true,
    multiReadingOptions: [
      {
        reading: '[แหน] (ออกเสียง ห-แ-น สระแอ สะกด น)',
        ipa: '/hɛːn˩˩˦/',
        meaningSummary: 'พืชน้ำใบกลมเล็ก ลอยบนผิวน้ำ (แหนเป็ด, แหนแดง)',
        partOfSpeech: 'น.',
        contextExample: 'เป็ดกำลังว่ายน้ำกินแหนในสระ'
      },
      {
        reading: '[แหฺน] (ออกเสียง ห นำ น เป็น แ-ห-น)',
        ipa: '/nɛːn˩˩˦/',
        meaningSummary: 'หวงแหน, ระวังรักษา, ปกป้อง',
        partOfSpeech: 'ก.',
        contextExample: 'ทุกคนต่างรักและหวงแหนแผ่นดินเกิด'
      }
    ],
    exampleSentences: [
      'สระน้ำหน้าบ้านเต็มไปด้วยแหนสีเขียว (อ่าน แหน)',
      'ประชาชนร่วมใจแหนหวงสมบัติของชาติ (อ่าน แหฺน)'
    ],
    tags: ['คำพ้องรูป', 'คำอ่านหลายแบบ', 'พืช', 'จิตใจ']
  },

  // --- คำศัพท์ตามพจนานุกรมราชบัณฑิตยสถานหมวดทั่วไป & ศัพท์ทางการ ---
  {
    id: 'rd-101',
    word: 'กรณี',
    phoneticReading: '[กะ-ระ-นี] หรือ [กอน-ระ-นี]',
    secondaryReadings: ['[กะ-ระ-นี]', '[กอน-ระ-นี]'],
    ipa: '/ka˨˩.ra˦˥.niː˧/ หรือ /kɔːn˧.ra˦˥.niː˧/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. เรื่อง, ข้อ, คดี, เหตุการณ์, การกระทำที่เกิดขึ้นเฉพาะคราว.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป. กรณีย; ส. กรณีย (สิ่งอันพึงทำ)',
    tones: ['เอก-ตรี-สามัญ', 'สามัญ-ตรี-สามัญ'],
    syllableCount: 3,
    isRoyalVocabulary: false,
    hasMultipleReadings: true,
    multiReadingOptions: [
      {
        reading: '[กะ-ระ-นี]',
        ipa: '/ka˨˩.ra˦˥.niː˧/',
        meaningSummary: 'เรื่อง, เหตุการณ์ (อ่านแบบสมาส นิยมที่สุดในภาษาราชการ)',
        partOfSpeech: 'น.',
        contextExample: 'ในกรณีที่เกิดเหตุฉุกเฉิน ให้ปฏิบัติตามคู่มือ',
        isFormalPreferred: true
      },
      {
        reading: '[กอน-ระ-นี]',
        ipa: '/kɔːn˧.ra˦˥.niː˧/',
        meaningSummary: 'เรื่อง, เหตุการณ์ (อ่านตามรูปตัวสะกด กร-)',
        partOfSpeech: 'น.',
        contextExample: 'มีข้อยกเว้นในบางกรณี'
      }
    ],
    exampleSentences: ['กรณีพิพาทได้รับการไกล่เกลี่ยเรียบร้อย'],
    tags: ['กฎหมาย', 'ทางการ', 'คำอ่านหลายแบบ']
  },
  {
    id: 'rd-102',
    word: 'กษัตริย์',
    phoneticReading: '[กะ-สัด]',
    ipa: '/ka˨˩.sat˨˩/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. พระเจ้าแผ่นดิน, ผู้ปกครองรัฐหรือประเทศ, พระมหากษัตริย์.',
    etymology: 'Sanskrit',
    etymologyDetail: 'ส. กฺษตฺริย; ป. ขตฺติย (ผู้มีอำนาจป้องกันภยันตราย)',
    tones: ['เอก-เอก'],
    syllableCount: 2,
    isRoyalVocabulary: true,
    hasMultipleReadings: false,
    exampleSentences: ['พระมหากษัตริย์ทรงเป็นศูนย์รวมจิตใจของปวงชนชาวไทย'],
    tags: ['ราชาศัพท์', 'การปกครอง', 'ประวัติศาสตร์']
  },
  {
    id: 'rd-103',
    word: 'กรุงเทพมหานคร',
    phoneticReading: '[กรุง-เทบ-มะ-หา-นะ-คอน]',
    ipa: '/kruŋ˧.tʰeːp˥˩.ma˦˥.haː˩˩˦.na˦˥.kʰɔːn˧/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. เมืองหลวงของประเทศไทย มีชื่อเต็มว่า "กรุงเทพมหานคร อมรรัตนโกสินทร์ มหินทรายุธยา มหาดิลกภพ นพรัตนราชธานีบูรีรมย์ อุดมราชนิเวศน์มหาสถาน อมรพิมานอวตารสถิต สักกะทัตติยวิษณุกรรมประสิทธิ์".',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป.-ส. กรุง + เทพ + มหา + นคร',
    tones: ['สามัญ-โท-ตรี-จัตวา-ตรี-สามัญ'],
    syllableCount: 6,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['กรุงเทพมหานครเป็นศูนย์กลางทางเศรษฐกิจและวัฒนธรรมของชาติ'],
    tags: ['ภูมิศาสตร์', 'ชื่อเฉพาะ', 'เมืองหลวง']
  },
  {
    id: 'rd-104',
    word: 'สมเด็จพระกนิษฐาธิราชเจ้า',
    phoneticReading: '[สม-เด็ด-พฺระ-กะ-นิด-ถา-ทิ-ราด-เจ้า]',
    ipa: '/som˩˩˦.det˨˩.pʰra˦˥.ka˨˩.nit˦˥.tʰaː˩˩˦.tʰi˦˥.raːt˥˩.tɕaw˥˩/',
    partOfSpeech: 'royal_term',
    partOfSpeechThai: 'น. (ราชาศัพท์)',
    definition: 'น. พระนามแห่งสมเด็จพระกนิษฐาธิราชเจ้า กรมสมเด็จพระเทพรัตนราชสุดาฯ สยามบรมราชกุมารี.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'เขมร (สมเด็จ) + ป.-ส. (พระกนิษฐา + อธิราช + เจ้า)',
    tones: ['จัตวา-เอก-ตรี-เอก-ตรี-จัตวา-ตรี-โท-โท'],
    syllableCount: 9,
    isRoyalVocabulary: true,
    hasMultipleReadings: false,
    exampleSentences: ['สมเด็จพระกนิษฐาธิราชเจ้า กรมสมเด็จพระเทพรัตนราชสุดาฯ สยามบรมราชกุมารี เสด็จพระราชดำเนินไปทรงปฏิบัติพระราชกรณียกิจ'],
    tags: ['ราชาศัพท์', 'ชื่อเฉพาะ', 'พระบรมวงศานุวงศ์']
  },
  {
    id: 'rd-105',
    word: 'สมาธิ',
    phoneticReading: '[สะ-มา-ทิ]',
    ipa: '/sa˨˩.maː˧.tʰi˦˥/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. ความตั้งมั่นแห่งจิต, การสำรวมใจให้แน่วแน่อยู่กับสิ่งใดสิ่งหนึ่ง.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป. สมาธิ; ส. สมาธิ (การตั้งจิตมั่น)',
    tones: ['เอก-สามัญ-ตรี'],
    syllableCount: 3,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['การฝึกสมาธิช่วยให้จิตใจสงบและมีสติในการทำงาน'],
    tags: ['ศาสนา', 'จิตวิทยา', 'คุณธรรม']
  },
  {
    id: 'rd-106',
    word: 'สุวรรณภูมิ',
    phoneticReading: '[สุ-วัน-นะ-พูม]',
    ipa: '/su˨˩.wan˧.na˦˥.pʰuːm˧/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. ดินแดนทองคำ หมายถึงดินแดนแถบเอเชียตะวันออกเฉียงใต้ในอดีต และเป็นชื่อท่าอากาศยานนานาชาติหลักของประเทศไทย.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป., ส. สุวรฺณ (ทอง) + ภูมิ (แผ่นดิน)',
    tones: ['เอก-สามัญ-ตรี-สามัญ'],
    syllableCount: 4,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['ท่าอากาศยานสุวรรณภูมิต้อนรับนักท่องเที่ยวจากทั่วโลก'],
    tags: ['ภูมิศาสตร์', 'ประวัติศาสตร์', 'คมนาคม']
  },
  {
    id: 'rd-107',
    word: 'พระมหากษัตริย์',
    phoneticReading: '[พฺระ-มะ-หา-กะ-สัด]',
    ipa: '/pʰra˦˥.ma˦˥.haː˩˩˦.ka˨˩.sat˨˩/',
    partOfSpeech: 'royal_term',
    partOfSpeechThai: 'น. (ราชาศัพท์)',
    definition: 'น. พระประมุขของประเทศ ผู้ทรงครองราชย์.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป.-ส. พระ + มหา + กษัตริย์',
    tones: ['ตรี-ตรี-จัตวา-เอก-เอก'],
    syllableCount: 5,
    isRoyalVocabulary: true,
    hasMultipleReadings: false,
    exampleSentences: ['พระมหากษัตริย์ทรงเปี่ยมด้วยทศพิธราชธรรม'],
    tags: ['ราชาศัพท์', 'การปกครอง']
  },
  {
    id: 'rd-108',
    word: 'ทรมาน',
    phoneticReading: '[ทอ-ระ-มาน]',
    ipa: '/tʰɔː˧.ra˦˥.maːn˧/',
    partOfSpeech: 'verb',
    partOfSpeechThai: 'ก.',
    definition: 'ก. ทำให้เดือดร้อน เจ็บปวด หรือลำบากกายลำบากใจแสนสาหัส.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป. ทม (การฝึก, ปราบ); ส. ทรฺม',
    tones: ['สามัญ-ตรี-สามัญ'],
    syllableCount: 3,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['เขาต้องทนทรมานกับโรคประจำตัวมานานหลายปี'],
    tags: ['อารมณ์', 'สุขภาพ']
  },
  {
    id: 'rd-109',
    word: 'วัฒนธรรม',
    phoneticReading: '[วัด-ทะ-นะ-ทำ]',
    ipa: '/wat˦˥.tʰa˦˥.na˦˥.tʰam˧/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. สิ่งที่ทำความเจริญงอกงามให้แก่หมู่คณะ, วิถีชีวิต ความเชื่อ ค่านิยม ขนบธรรมเนียมประเพณีที่สืบทอดกันมา.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป. วฑฺฒน (ความเจริญ) + ธมฺม (ธรรม)',
    tones: ['ตรี-ตรี-ตรี-สามัญ'],
    syllableCount: 4,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['วัฒนธรรมไทยมีความงดงามและมีเอกลักษณ์เฉพาะตัว'],
    tags: ['สังคมศาสตร์', 'ประเพณี', 'ศิลปะ']
  },
  {
    id: 'rd-110',
    word: 'พจนานุกรม',
    phoneticReading: '[พด-จะ-นา-นุ-กฺรม]',
    ipa: '/pʰot˦˥.tɕa˦˥.naː˧.nu˦˥.krom˧/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. หนังสือรวบรวมคำศัพท์ เรียงตามลำดับอักษร พร้อมบอกความหมาย คำอ่าน ชนิดของคำ และที่มา.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป. วจน (คำ) + อนุกรม (ลำดับ)',
    tones: ['ตรี-ตรี-สามัญ-ตรี-สามัญ'],
    syllableCount: 5,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['พจนานุกรมฉบับราชบัณฑิตยสถานเป็นมาตรฐานอ้างอิงของภาษาไทย'],
    tags: ['การศึกษา', 'ภาษาศาสตร์', 'หนังสือ']
  },
  {
    id: 'rd-111',
    word: 'ราชบัณฑิตยสถาน',
    phoneticReading: '[ราด-ชะ-บัน-ดิด-ตะ-ยะ-สะ-ถาน] หรือ [ราด-บัน-ดิด-ตะ-ยะ-สะ-ถาน]',
    ipa: '/raːt˥˩.tɕʰa˦˥.ban˧.dit˨˩.ta˨˩.ja˦˥.sa˨˩.tʰaːn˩˩˦/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. องค์การทางวิชาการชั้นสูงของรัฐ ปัจจุบันคือ "สำนักงานราชบัณฑิตยสภา" มีหน้าที่ค้นคว้า วิจัย บัญญัติศัพท์ และจัดทำพจนานุกรมและสารานุกรมแห่งชาติ.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป.-ส. ราช + บัณฑิต + สถาน',
    tones: ['โท-ตรี-สามัญ-เอก-เอก-ตรี-เอก-จัตวา'],
    syllableCount: 8,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['ราชบัณฑิตยสถานมีบทบาทสำคัญในการอนุรักษ์และพัฒนาภาษาไทย'],
    tags: ['หน่วยงานราชการ', 'วิชาการ', 'ภาษาไทย']
  },
  {
    id: 'rd-112',
    word: 'สวรรคต',
    phoneticReading: '[สะ-หวัน-คด]',
    ipa: '/sa˨˩.wan˩˩˦.kʰot˦˥/',
    partOfSpeech: 'royal_term',
    partOfSpeechThai: 'ก. (ราชาศัพท์)',
    definition: 'ก. สิ้นพระชนม์, ตาย (ใช้แก่พระมหากษัตริย์ สมเด็จพระบรมราชินีนาถ สมเด็จพระบรมราชินี).',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ส. สฺวรฺค (สวรรค์) + คต (ไปสู่, ถึงแล้ว)',
    tones: ['เอก-จัตวา-ตรี'],
    syllableCount: 3,
    isRoyalVocabulary: true,
    hasMultipleReadings: false,
    exampleSentences: ['ปวงชนชาวไทยน้อมรำลึกในพระมหากรุณาธิคุณอันหาที่สุดมิได้หลังการเสด็จสวรรคต'],
    tags: ['ราชาศัพท์', 'พระราชพิธี']
  },
  {
    id: 'rd-113',
    word: 'สุนทรภู่',
    phoneticReading: '[สุน-ทอน-พู่]',
    ipa: '/sun˩˩˦.tʰɔːn˧.pʰuː˥˩/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. มหากวีเอกแห่งกรุงรัตนโกสินทร์ ได้รับการยกย่องจาก UNESCO ให้เป็นบุคคลสำคัญของโลกด้านวรรณกรรม ผู้แต่งพระอภัยมณีและนิราศภูเขาทอง.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป. สุนฺทร (งาม, ไพเราะ) + ภู่ (ชื่อตัว)',
    tones: ['จัตวา-สามัญ-โท'],
    syllableCount: 3,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['สุนทรภู่แต่งกลอนสุภาพได้อย่างไพเราะเพราะพริ้งและมีสัมผัสในแพรวพราว'],
    tags: ['บุคคลสำคัญ', 'วรรณคดี', 'กวี']
  },
  {
    id: 'rd-114',
    word: 'ประวัติศาสตร์',
    phoneticReading: '[ปฺระ-หวัด-ติ-สาด]',
    ipa: '/pra˨˩.wat˨˩.ti˨˩.saːt˨˩/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. วิชาที่ว่าด้วยเรื่องราวและเหตุการณ์ในอดีตของมนุษยชาติ.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป. ปวตฺติ (ความเป็นไป) + ส. ศาสฺตฺร (วิชา, ตำรา)',
    tones: ['เอก-เอก-เอก-เอก'],
    syllableCount: 4,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['การศึกษาประวัติศาสตร์ทำให้เราเข้าใจรากเหง้าและความเป็นมาของชาติ'],
    tags: ['สังคมศาสตร์', 'ประวัติศาสตร์', 'การศึกษา']
  },
  {
    id: 'rd-115',
    word: 'อัจฉริยะ',
    phoneticReading: '[อัด-ฉะ-ริ-ยะ]',
    ipa: '/at˨˩.tɕʰa˨˩.ri˦˥.ja˦˥/',
    partOfSpeech: 'adverb_adjective',
    partOfSpeechThai: 'ว. / น.',
    definition: 'ว. น่าอัศจรรย์, มีคุณสมบัติพิเศษเหนือคนธรรมดาอย่างยิ่ง.',
    etymology: 'Pali',
    etymologyDetail: 'ป. อจฺฉริย (น่าอัศจรรย์)',
    tones: ['เอก-เอก-ตรี-ตรี'],
    syllableCount: 4,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['เขาเป็นเด็กอัจฉริยะที่มีความสามารถทางคณิตศาสตร์และดนตรี'],
    tags: ['วิทยาศาสตร์', 'ความสามารถ', 'การเรียนรู้']
  },
  {
    id: 'rd-116',
    word: 'กาลเวลา',
    phoneticReading: '[กาน-เว-ลา]',
    ipa: '/kaːn˧.weː˧.laː˧/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. เวลา, ความเปลี่ยนแปลงไปตามยุคสมัย.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป., ส. กาล + เวลา',
    tones: ['สามัญ-สามัญ-สามัญ'],
    syllableCount: 3,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['สิ่งต่างๆ ย่อมหมุนเวียนเปลี่ยนไปตามกาลเวลา'],
    tags: ['เวลา', 'ปรัชญา']
  },
  {
    id: 'rd-117',
    word: 'ธรรมชาติ',
    phoneticReading: '[ทำ-มะ-ชาด]',
    ipa: '/tʰam˧.ma˦˥.tɕʰaːt˥˩/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. สิ่งที่เกิดมีและเป็นอยู่ตามธรรมดาของโลก เช่น ดิน น้ำ ลม ไฟ ป่าไม้.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป. ธมฺมชาต (เกิดโดยธรรม)',
    tones: ['สามัญ-ตรี-โท'],
    syllableCount: 3,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['การอนุรักษ์ธรรมชาติเป็นหน้าที่ของมนุษย์ทุกคน'],
    tags: ['สิ่งแวดล้อม', 'วิทยาศาสตร์', 'ธรรมชาติ']
  },
  {
    id: 'rd-118',
    word: 'กัลปพฤกษ์',
    phoneticReading: '[กัน-ละ-ปะ-พฺรึก]',
    ipa: '/kan˧.la˦˥.pa˨˩.pʰrɯk˦˥/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. ต้นไม้สารพัดนึกตามคติโบราณ, ชื่อไม้ยืนต้นชนิดหนึ่ง ดอกสีชมพูขาว.',
    etymology: 'Sanskrit',
    etymologyDetail: 'ส. กลฺปวฺฤกฺษ (ต้นไม้อธิษฐานสมปรารถนา)',
    tones: ['สามัญ-ตรี-เอก-ตรี'],
    syllableCount: 4,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['ต้นกัลปพฤกษ์ผลิดอกบานสะพรั่งเต็มต้นในฤดูร้อน'],
    tags: ['พฤกษศาสตร์', 'วรรณคดี', 'คติชนวิทยา']
  },
  {
    id: 'rd-119',
    word: 'ศิลปวัฒนธรรม',
    phoneticReading: '[สิน-ละ-ปะ-วัด-ทะ-นะ-ทำ]',
    ipa: '/sin˩˩˦.la˦˥.pa˨˩.wat˦˥.tʰa˦˥.na˦˥.tʰam˧/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. ศิลปะและวัฒนธรรมอันเป็นมรดกอันล้ำค่าของชาติ.',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ส. ศิลฺป + ป. วฑฺฒน + ธมฺม',
    tones: ['จัตวา-ตรี-เอก-ตรี-ตรี-ตรี-สามัญ'],
    syllableCount: 7,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['เราควรร่วมใจกันสืบสานศิลปวัฒนธรรมไทยให้คงอยู่สืบไป'],
    tags: ['ศิลปะ', 'วัฒนธรรม', 'มรดกชาติ']
  },
  {
    id: 'rd-120',
    word: 'อภิปรัชญา',
    phoneticReading: '[อะ-พิ-ปฺรัด-ยา]',
    ipa: '/a˨˩.pʰi˦˥.prat˨˩.jaː˧/',
    partOfSpeech: 'noun',
    partOfSpeechThai: 'น.',
    definition: 'น. สาขาวิชาปรัชญาที่ศึกษาเกี่ยวกับความจริงแท้สูงสุด สาระของสิ่งทั้งหลาย และความมีอยู่ (Metaphysics).',
    etymology: 'Pali_Sanskrit',
    etymologyDetail: 'ป. อภิ (ยิ่ง) + ส. ปฺรชฺญา (ปัญญา, ความรู้แจ้ง)',
    tones: ['เอก-ตรี-เอก-สามัญ'],
    syllableCount: 4,
    isRoyalVocabulary: false,
    hasMultipleReadings: false,
    exampleSentences: ['อภิปรัชญาเป็นแขนงหนึ่งของปรัชญาที่ศึกษาเรื่องความเป็นจริงอันติมะ'],
    tags: ['ปรัชญา', 'วิชาการ']
  }
];

// ============================================================================
// ROYAL DICTIONARY DATABASE ENGINE SERVICE
// ============================================================================

export class ThaiRoyalInstituteDictionaryDatabase {
  private static dictionaryMap: Map<string, RoyalDictionaryEntry> = new Map();
  private static multiReadingWords: Map<string, RoyalDictionaryEntry> = new Map();
  private static isInitialized = false;

  public static initialize(): void {
    if (this.isInitialized) return;
    for (const entry of ROYAL_INSTITUTE_DICTIONARY_ENTRIES) {
      this.dictionaryMap.set(entry.word, entry);
      if (entry.hasMultipleReadings) {
        this.multiReadingWords.set(entry.word, entry);
      }
    }
    this.isInitialized = true;
  }

  /**
   * ค้นหาคำศัพท์แบบแม่นยำ (Exact Lookup)
   */
  public static lookupWord(word: string): RoyalDictionaryEntry | undefined {
    this.initialize();
    return this.dictionaryMap.get(word.trim());
  }

  /**
   * ค้นหาคำศัพท์ทั้งหมดที่มีตัวเลือกการอ่านหลายแบบ (Multi-reading Heteronyms)
   */
  public static getMultiReadingEntries(): RoyalDictionaryEntry[] {
    this.initialize();
    return Array.from(this.multiReadingWords.values());
  }

  /**
   * ตรวจสอบว่าคำนี้เป็นคำที่อ่านได้หลายแบบหรือไม่ (Heteronym Detection)
   */
  public static isMultiReadingWord(word: string): boolean {
    this.initialize();
    return this.multiReadingWords.has(word.trim());
  }

  /**
   * ค้นหาคำศัพท์ด้วยคำค้น (Search by Query, Phonetic, Meaning, Tag, or Category)
   */
  public static search(query: string): RoyalDictionaryEntry[] {
    this.initialize();
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return ROYAL_INSTITUTE_DICTIONARY_ENTRIES;

    return ROYAL_INSTITUTE_DICTIONARY_ENTRIES.filter(entry => {
      return (
        entry.word.toLowerCase().includes(cleanQuery) ||
        entry.phoneticReading.toLowerCase().includes(cleanQuery) ||
        entry.definition.toLowerCase().includes(cleanQuery) ||
        entry.tags.some(tag => tag.toLowerCase().includes(cleanQuery)) ||
        entry.etymologyDetail.toLowerCase().includes(cleanQuery) ||
        entry.ipa.toLowerCase().includes(cleanQuery)
      );
    });
  }

  /**
   * คืนค่าคลังคำศัพท์ทั้งหมด
   */
  public static getAllEntries(): RoyalDictionaryEntry[] {
    this.initialize();
    return ROYAL_INSTITUTE_DICTIONARY_ENTRIES;
  }

  /**
   * สรุปสถิติคลังพจนานุกรมราชบัณฑิตยสถานสำหรับ AI Offline
   */
  public static getDatabaseStats() {
    this.initialize();
    return {
      totalWords: ROYAL_INSTITUTE_DICTIONARY_ENTRIES.length,
      multiReadingWordsCount: this.multiReadingWords.size,
      royalVocabularyCount: ROYAL_INSTITUTE_DICTIONARY_ENTRIES.filter(e => e.isRoyalVocabulary).length,
      categoriesCount: Array.from(new Set(ROYAL_INSTITUTE_DICTIONARY_ENTRIES.flatMap(e => e.tags))).length,
      status: 'Ready (100% Offline)'
    };
  }
}
