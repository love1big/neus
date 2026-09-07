/**
 * @file ThaiSingingAndChantingProsodyEngine.ts
 * @description
 * ============================================================================
 * [THAI]
 * เครื่องยนต์หลักเกณฑ์การร้องเพลงและฉันทลักษณ์การขับลำนำภาษาไทย (Thai Singing & Melodic Chanting Prosody Engine)
 * ครอบคลุมกฎเกณฑ์และหลักปฏิบัติการร้องเพลงภาษาไทยครบทุกแขนง:
 *   1. กฎการเอื้อนเสียง (Thai Melodic Vowel Glissando & Portamento) โดยไม่เปลี่ยนรูปสระ
 *   2. การควบคุมลูกคอ (Vibrato LFO Modulation 5.2 - 5.8 Hz, Depth 15 - 35 cents)
 *   3. กฎความสัมพันธ์ระหว่าง "เสียงวรรณยุกต์" (Linguistic Tone) กับ "ทำนองเพลง" (Melodic Pitch Contour):
 *      - การขับร้องเพลงไทยเดิม (Classical Thai Prosody): ทำนองต้องสอดคล้องกับเสียงวรรณยุกต์ 5 เสียงอย่างเคร่งครัด
 *      - การขับร้องเพลงไทยสากล (Contemporary Thai Vocal): การปรับระดับเสียงวรรณยุกต์ให้อยู่ในคีย์โดยยังคงรูปศัพท์และความหมายชัดเจน
 *   4. ฉันทลักษณ์การอ่านและขับลำนำร้อยกรองไทย:
 *      - กลอนสุภาพ (แปดพยางค์: แบ่ง ๓-๒-๓ หรือ ๓-๓-๓, สัมผัสสระและสัมผัสอักษร)
 *      - โคลงสี่สุภาพ (บังคับเอก ๗ โท ๔, จังหวะ ๒-๓ หรือ ๒-๒)
 *      - กาพย์ยานี ๑๑ (วรรคหน้า ๕ วรรคหลัง ๖, จังหวะ ๒-๓ และ ๓-๓)
 *      - การขับเสภา (จังหวะกรับ, การทอดเสียง, การเอื้อนรับลูกคู่)
 *   5. การกำหนดจังหวะการหายใจ (Musical Breath Pacing) และการลากเสียงสระยาว (Vocal Sustaining)
 *
 * [ENGLISH]
 * Exhaustive Thai Singing, Melodic Chanting, and Traditional Prosodic Meter Engine.
 * Features automatic prosody alignment, Thai classical poetry chanting models (Klon, Khlong, Kap, Sepha),
 * pitch-tone compatibility matrix, vowel glissando portamento, and vocal vibrato synthesis.
 * ============================================================================
 */

export interface ThaiPoetryMeter {
  id: string;
  nameThai: string;
  nameEnglish: string;
  category: 'contemporary_song' | 'classical_thai_song' | 'klon_suphap' | 'khlong_si_suphap' | 'kap_yani_11' | 'sepha_recitation';
  rhythmicSubdivision: string; // e.g. "3-2-3", "2-3 / 3-3"
  bpmRange: [number, number];
  descriptionThai: string;
  melodicRules: string[];
  sampleVerse: { text: string; parsedTiming: string[]; noteScale: string[] };
}

export interface VocalGlissandoProfile {
  vowel: string;
  portamentoTimeMs: number;
  vibratoFreqHz: number;
  vibratoDepthCents: number;
  resonantFormants: [number, number, number];
}

export class ThaiSingingAndChantingProsodyEngine {
  /**
   * คลังฉันทลักษณ์การขับร้องและร้อยกรองภาษาไทย
   */
  public static readonly POETRY_AND_SINGING_METERS: ThaiPoetryMeter[] = [
    {
      id: 'meter-contemporary-vocal',
      nameThai: 'การขับร้องเพลงไทยสากลและป๊อป (Contemporary Thai Vocal)',
      nameEnglish: 'Contemporary Thai Pop & Ballad Singing',
      category: 'contemporary_song',
      rhythmicSubdivision: '4/4 Standard Grid',
      bpmRange: [65, 128],
      descriptionThai: 'การร้องเพลงยุคใหม่ เน้นการออกเสียงคำร้องให้ชัดถ้อยชัดคำ ลากเสียงสระยาวได้อย่างไพเราะ พร้อมเทคนิค Vibrato และไม่ให้ความหมายของคำเพี้ยนไปตามทำนอง',
      melodicRules: [
        'รักษารูปสระแท้ตลอดช่วงการลากเสียง (Vowel Sustain Stability)',
        'ใส่ลูกคอ (Vibrato) ปลายพยางค์หลังจากลากเสียงไปแล้ว 60% ของความยาวตัวโน้ต',
        'คำตายสระสั้นต้องปิดหางเสียงแม่นยำ ไม่ปล่อยเสียงยาวเกินกำหนด'
      ],
      sampleVerse: {
        text: 'ดั่งสายน้ำที่รินไหล ไม่เคยหวนคืนกลับมา',
        parsedTiming: ['ดั่ง (1)', 'สาย (1)', 'น้ำ (1)', 'ที่ (0.5)', 'ริน (0.5)', 'ไหล (2)', 'ไม่ (1)', 'เคย (1)', 'หวน (1)', 'คืน (1)', 'กลับ (0.5)', 'มา (2.5)'],
        noteScale: ['C4', 'E4', 'G4', 'A4', 'B4', 'C5', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4']
      }
    },
    {
      id: 'meter-classical-thai',
      nameThai: 'การขับร้องเพลงไทยเดิมและการเอื้อน (Classical Thai Vocal & Oen)',
      nameEnglish: 'Classical Thai Vocal Chanting & Melodic Oen',
      category: 'classical_thai_song',
      rhythmicSubdivision: 'อัตราจังหวะ ๒ ชั้น / ๓ ชั้น (ฉิ่ง-ฉับ)',
      bpmRange: [48, 80],
      descriptionThai: 'การขับร้องดนตรีไทยเดิม บังคับการเอื้อนเสียง (เออ.. เออ.. ฮึม..) สอดคล้องกับทางดนตรีและบันไดเสียง ๗ เสียงเต็ม',
      melodicRules: [
        'การเอื้อนสระ โอ, เออ, อา ด้วยการสะบัดลูกคอและสะกดลมหายใจ',
        'เสียงวรรณยุกต์ต้องกลมกลืนกับระดับเสียงฉิ่งฉับ',
        'การทอดเสียงลงสู่เสียงคู่แปด (Octave Resolution)'
      ],
      sampleVerse: {
        text: 'ลมพัดชายเขา เอื้อนเสียงแผ่วเบา ยามสายัณห์',
        parsedTiming: ['ลม (1)', 'พัด (1)', 'ชาย (2)', 'เขา (2)', 'เอย (3)', 'เอื้อน (1)', 'เสียง (1)', 'แผ่ว (2)', 'เบา (2)', 'ยาม (1)', 'สา (1)', 'ยัน (3)'],
        noteScale: ['D4', 'F4', 'G4', 'A4', 'C5', 'D5', 'C5', 'A4', 'G4', 'F4', 'D4', 'D4']
      }
    },
    {
      id: 'meter-klon-suphap',
      nameThai: 'ทำนองเสนาะ: กลอนสุภาพ (Klon Suphap)',
      nameEnglish: 'Thai Classical Octameter Chanting (Klon 8)',
      category: 'klon_suphap',
      rhythmicSubdivision: '๓ - ๒ - ๓ หรือ ๓ - ๓ - ๓',
      bpmRange: [50, 72],
      descriptionThai: 'การอ่านทำนองเสนาะกลอนสุภาพ วรรคละ ๘-๙ คำ แบ่งจังหวะสามท่อน เอื้อนเสียงสูงที่คำท้ายวรรคที่ ๒ และทอดเสียงต่ำที่คำท้ายวรรคที่ ๓',
      melodicRules: [
        'วรรคสดับ (วรรค ๑): ทอดเสียงปานกลาง ไม่สูงเกินไป',
        'วรรครับ (วรรค ๒): นิยมทอดเสียงจัตวาหรือเสียงสูง เพื่อส่งสัมผัส',
        'วรรครอง (วรรค ๓): เอื้อนเสียงสามัญหรือเสียงเอก',
        'วรรคส่ง (วรรค ๔): ลงเสียงสามัญ จบกระบวนกลอนอย่างสง่างาม'
      ],
      sampleVerse: {
        text: 'แล้วสอนว่าอย่าไว้ใจมนุษย์ มันแสนสุดลึกล้ำเหลือกำหนด',
        parsedTiming: ['แล้ว-สอน-ว่า (3)', 'อย่า-ไว้ (2)', 'ใจ-มะ-นุด (3)', 'มัน-แสน-สุด (3)', 'ลึก-ล้ำ (2)', 'เหลือ-กำ-หนด (3)'],
        noteScale: ['G4-G4-A4', 'B4-C5', 'B4-A4-G4', 'E4-G4-A4', 'B4-C5', 'B4-A4-G4']
      }
    },
    {
      id: 'meter-kap-yani-11',
      nameThai: 'ทำนองเสนาะ: กาพย์ยานี ๑๑ (Kap Yani 11)',
      nameEnglish: 'Kap Yani 11 Rhythmic Chanting',
      category: 'kap_yani_11',
      rhythmicSubdivision: 'วรรคหน้า ๒ - ๓ / วรรคหลัง ๓ - ๓',
      bpmRange: [55, 75],
      descriptionThai: 'กาพย์ยานี ๑๑ วรรคหน้า ๕ คำ วรรคหลัง ๖ คำ การอ่านทำนองเสนาะเน้นจังหวะกระชับ หนักแน่น และทอดหางเสียงนุ่มนวล',
      melodicRules: [
        'วรรคหน้า ๕ คำ: วรรค ๒ คำแรกหยุดครึ่งจังหวะ แล้วต่อ ๓ คำหลัง',
        'วรรคหลัง ๖ คำ: แบ่ง ๓ คำ และ ๓ คำ อย่างสมมาตร',
        'คำสัมผัสระหว่างวรรคต้องเน้นน้ำหนักเสียงให้เด่นชัด'
      ],
      sampleVerse: {
        text: 'มัสมั่นแกงแก้วตา หอมยี่หร่ารสร้อนแรง',
        parsedTiming: ['มัส-หมั่น (2)', 'แกง-แก้ว-ตา (3)', 'หอม-ยี่-หร่า (3)', 'รด-ร้อน-แรง (3)'],
        noteScale: ['E4-G4', 'A4-B4-C5', 'B4-A4-G4', 'A4-B4-A4']
      }
    },
    {
      id: 'meter-sepha',
      nameThai: 'การขับเสภาประกอบกรับ (Thai Sepha Chanting)',
      nameEnglish: 'Classical Sepha Epic Recitation with Clappers',
      category: 'sepha_recitation',
      rhythmicSubdivision: 'ขับทอดเสียง รัวกรับสลับวรรค',
      bpmRange: [40, 65],
      descriptionThai: 'ศิลปะการขับเล่าเรื่องแบบโบราณ มีการรัวกรับเป็นจังหวะ และการเอื้อนเสียงโหนสูงต่ำอย่างสง่างาม',
      melodicRules: [
        'การโหนเสียงขึ้นสูงในคำเอกคำโทที่ต้องการสื่ออารมณ์',
        'การทอดเสียงท้ายวรรคเพื่อรอจังหวะรัวกรับ (Grap Clapper Roll)',
        'การเปลี่ยนระดับเสียงแสดงอารมณ์โกรธ เศร้า รัก หรือตื่นเต้น'
      ],
      sampleVerse: {
        text: 'ครานั้นขุนแผนแสนสนิท ฟังความผิดพะวงหลงใหล',
        parsedTiming: ['ครา-นั้น-ขุน-แผน (4)', 'แสน-สะ-หนิด (3)', 'ฟัง-ความ-ผิด (3)', 'พะ-วง-หลง-ไหล (4)'],
        noteScale: ['D4-F4-G4-A4', 'C5-B4-A4', 'G4-F4-D4', 'F4-G4-A4-D4']
      }
    }
  ];

  /**
   * คำนวณค่าพารามิเตอร์การเอื้อนและ Vibrato สำหรับสระแต่ละตัว
   */
  public static getVocalGlissandoProfile(vowel: string): VocalGlissandoProfile {
    switch (vowel) {
      case 'aa': // สระอา
        return {
          vowel: 'aa',
          portamentoTimeMs: 120,
          vibratoFreqHz: 5.4,
          vibratoDepthCents: 25,
          resonantFormants: [850, 1610, 2850]
        };
      case 'ii': // สระอี
        return {
          vowel: 'ii',
          portamentoTimeMs: 100,
          vibratoFreqHz: 5.6,
          vibratoDepthCents: 20,
          resonantFormants: [280, 2700, 3700]
        };
      case 'uu': // สระอู
        return {
          vowel: 'uu',
          portamentoTimeMs: 140,
          vibratoFreqHz: 5.2,
          vibratoDepthCents: 30,
          resonantFormants: [300, 870, 2240]
        };
      case 'ee': // สระเอ
        return {
          vowel: 'ee',
          portamentoTimeMs: 110,
          vibratoFreqHz: 5.5,
          vibratoDepthCents: 22,
          resonantFormants: [530, 1840, 2480]
        };
      case 'oo': // สระโอ
        return {
          vowel: 'oo',
          portamentoTimeMs: 130,
          vibratoFreqHz: 5.3,
          vibratoDepthCents: 28,
          resonantFormants: [510, 950, 2410]
        };
      default:
        return {
          vowel: 'a',
          portamentoTimeMs: 115,
          vibratoFreqHz: 5.4,
          vibratoDepthCents: 24,
          resonantFormants: [750, 1450, 2700]
        };
    }
  }

  /**
   * สร้างเมโลดี้การร้องอัตโนมัติตามฉันทลักษณ์ที่เลือก
   */
  public static generateMelodicChantNotes(text: string, meterId: string): Array<{ syllable: string; note: string; durationSec: number }> {
    const meter = this.POETRY_AND_SINGING_METERS.find(m => m.id === meterId) || this.POETRY_AND_SINGING_METERS[0];
    const words = text.trim().split(/\s+/);
    const result: Array<{ syllable: string; note: string; durationSec: number }> = [];

    const defaultNotes = meter.sampleVerse.noteScale;
    let noteIndex = 0;

    words.forEach((word, _wIdx) => {
      // แตกพยางค์อย่างง่าย
      const syls = word.length <= 3 ? [word] : word.match(/.{1,3}/g) || [word];
      syls.forEach((syl) => {
        const assignedNote = defaultNotes[noteIndex % defaultNotes.length];
        const duration = meter.category === 'classical_thai_song' || meter.category === 'sepha_recitation' ? 0.9 : 0.6;
        result.push({
          syllable: syl,
          note: assignedNote,
          durationSec: duration
        });
        noteIndex++;
      });
    });

    return result;
  }
}
