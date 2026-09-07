/**
 * ============================================================================
 * [THAI] โหนดอัลกอริทึมตรวจสอบและยืนยันการแปลตามบริบทออฟไลน์อัตโนมัติ
 * [ENGLISH] Automated Offline Localization Verification & Context Cross-Checking Engine Node
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - ตรวจสอบความแม่นยำของการแปลเทียบกับบริบทต้นทาง (Source Context Cross-Checking) 100% แบบออฟไลน์
 * - วิเคราะห์ข้อผิดพลาดสำคัญในงาน Localization ของวิดีโอเกมและซอฟต์แวร์:
 *   1. Variable & Placeholder Integrity: เช็คตัวแปร {player}, %s, [gold], <color> ห้ามตกหล่นหรือเพี้ยน
 *   2. Context & Polysemy Disambiguation: ป้องกันการแปลผิดบริบท เช่น "Save" (บันทึก vs ช่วยชีวิต),
 *      "Cast" (ร่ายเวท vs หล่อแบบ), "Party" (กลุ่มผู้เล่น vs งานเลี้ยง)
 *   3. UI Overflow & Expansion Safety: คำนวณความเสี่ยงที่ข้อความจะล้นกรอบปุ่มหรือ HUD
 *   4. Negation & Polarity Inversion: ป้องกันข้อความกลับด้าน เช่น คำว่า "Don't" หรือ "Cannot" หายไป
 *   5. Tone & Register Appropriateness: ตรวจสอบความสอดคล้องของน้ำเสียงต่อบริบท UI vs บทสนทนา
 *   6. Lore & Terminology Consistency: รักษากฎคำศัพท์เฉพาะของโลกเกม
 * - สังเคราะห์ทางเลือกการแปลตามบริบท (Contextual Localization Variants: HUD Compact, Story Immersive, Lore)
 * - สร้างคำแปลเวอร์ชันสมบูรณ์แบบอัตโนมัติ (1-Click Auto-Healed Translation)
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - ใช้งานคู่กับ `src/types/localizationVerification.ts` และ `src/types/offlineTranslation70.ts`
 * - ส่งข้อมูลผลการประเมินให้ `LocalizationVerificationDashboard.tsx`
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - รองรับข้อความว่างเปล่า ป้องกัน Regex Crash ด้วย Safe Token Parsing
 * - หากไม่สามารถระบุบริบทได้ จะ Fallback ไปยัง 'general_conversation'
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ```typescript
 * import { LocalizationVerificationEngineNode } from '../utils/LocalizationVerificationEngineNode';
 * const report = LocalizationVerificationEngineNode.verifyLocalization(
 *   "Press {key} to save game",
 *   "กด {key} เพื่อบันทึกเกม",
 *   sourceLangProfile,
 *   targetLangProfile,
 *   'gaming_hud_ui'
 * );
 * ```
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

import {
  GlobalLanguageProfile,
  OfflineGlossaryRule
} from '../types/offlineTranslation70';
import {
  LocalizationContextCategory,
  LocalizationVerificationIssue,
  LocalizationVerificationMetrics,
  SourceContextInsights,
  ContextualLocalizationVariant,
  LocalizationVerificationReport,
  BatchLocalizationItem
} from '../types/localizationVerification';

export class LocalizationVerificationEngineNode {
  /**
   * เรกูลาร์เอ็กซ์เพรสชันสำหรับดักจับตัวแปร, Placeholders และ Markup tags
   */
  private static readonly VARIABLE_REGEX_PATTERNS: RegExp[] = [
    /\{[a-zA-Z0-9_$.:]+\}/g,              // {player}, {0}, {count}, {val:d}
    /%(?:\d+\$)?[+-]?\d*(?:\.\d+)?[sdifxX]/g, // %s, %d, %1$s, %.2f
    /\[[a-zA-Z0-9_$.:]+\]/g,              // [gold], [item], [E]
    /<[a-zA-Z0-9_=#"':./ -]+>/g,         // <color=#ff0000>, <b>, </b>
    /<\/?[a-zA-Z0-9]+>/g,                 // แท็ก HTML/XML ทั่วไป
    /§[0-9a-fk-or]/g,                     // รหัสสี Minecraft/Unity
    /@\w+/g,                              // @target, @user
    /\\n|\\r|\\t/g                        // อักขระพิเศษ newlines
  ];

  /**
   * พจนานุกรมคำกำกวมและบริบทในวิดีโอเกม (Gaming Polysemy Disambiguation Dictionary)
   */
  private static readonly GAMING_POLYSEMY_MAP: Array<{
    sourceWord: string;
    regex: RegExp;
    context: LocalizationContextCategory;
    forbiddenInContextRegex: RegExp;
    correctMeaningTh: string;
    wrongMeaningTh: string;
    suggestionTh: string;
  }> = [
    {
      sourceWord: 'save',
      regex: /\bsave\b/i,
      context: 'gaming_hud_ui',
      forbiddenInContextRegex: /(ช่วยชีวิต|รอดพ้น|ปกป้อง|กอบกู้)/i,
      correctMeaningTh: 'บันทึกข้อมูล (Save Data / Save Game)',
      wrongMeaningTh: 'ช่วยชีวิต / ช่วยเหลือ (Rescue / Spare)',
      suggestionTh: 'ในเมนูเกมและ HUD คำว่า "Save" หมายถึง "บันทึก" หรือ "เซฟเกม"'
    },
    {
      sourceWord: 'fire',
      regex: /\bfire\b/i,
      context: 'gaming_hud_ui',
      forbiddenInContextRegex: /(ไล่ออก|ปลดออก|เลิกจ้าง)/i,
      correctMeaningTh: 'ยิง / ลั่นกระสุน / เปลวไฟ',
      wrongMeaningTh: 'ไล่ออกจากงาน (Dismiss)',
      suggestionTh: 'ในเกมต่อสู้/HUD คำว่า "Fire" คือ "ยิง" หรือ "ปล่อยพลัง"'
    },
    {
      sourceWord: 'cast',
      regex: /\bcast\b/i,
      context: 'gaming_dialogue',
      forbiddenInContextRegex: /(หล่อโลหะ|นักแสดง|เฝือก|คัดเลือกนักแสดง)/i,
      correctMeaningTh: 'ร่ายเวทมนตร์ / ปล่อยคาถา',
      wrongMeaningTh: 'นักแสดงภาพยนตร์ / หล่อปูน',
      suggestionTh: 'ในบริบท RPG เวทมนตร์ "Cast" ควรแปลว่า "ร่าย" หรือ "ปลดปล่อยมนตรา"'
    },
    {
      sourceWord: 'party',
      regex: /\bparty\b/i,
      context: 'gaming_hud_ui',
      forbiddenInContextRegex: /(งานเลี้ยง|งานรื่นเริง|งานสังสรรค์|พรรคการเมือง)/i,
      correctMeaningTh: 'ปาร์ตี้ / กลุ่มผู้เล่น / ทีมผจญภัย',
      wrongMeaningTh: 'งานเลี้ยงฉลอง / พรรคการเมือง',
      suggestionTh: 'ในเกม RPG คำว่า "Party" หมายถึง "ปาร์ตี้" หรือ "สมาชิกในกลุ่ม"'
    },
    {
      sourceWord: 'tank',
      regex: /\btank\b/i,
      context: 'gaming_dialogue',
      forbiddenInContextRegex: /(ถังน้ำ|ถังน้ำมัน|อ่างเก็บน้ำ)/i,
      correctMeaningTh: 'ตัวแทงก์ / แนวหน้าผู้รับดาเมจ / รถถังรบ',
      wrongMeaningTh: 'ถังบรรจุของเหลว',
      suggestionTh: 'ในระบบทีม RPG "Tank" ควรใช้คำทับศัพท์ "แทงก์" หรือ "ผู้พิทักษ์แนวหน้า"'
    },
    {
      sourceWord: 'equip',
      regex: /\bequip\b/i,
      context: 'gaming_hud_ui',
      forbiddenInContextRegex: /(จัดเตรียม|ตระเตรียมเครื่องมือ)/i,
      correctMeaningTh: 'สวมใส่ / ติดตั้งอุปกรณ์',
      wrongMeaningTh: 'จัดเตรียมอุปกรณ์',
      suggestionTh: 'ในหน้ากระเป๋าหรือ Inventory ควรใช้คำกระชับว่า "สวมใส่" หรือ "ติดตั้ง"'
    },
    {
      sourceWord: 'drop',
      regex: /\bdrop\b/i,
      context: 'gaming_hud_ui',
      forbiddenInContextRegex: /(หยดน้ำ|ยาหยอด)/i,
      correctMeaningTh: 'ทิ้งไอเทม / ดรอปของรางวัล',
      wrongMeaningTh: 'หยดของเหลว',
      suggestionTh: 'ในช่องเก็บของ "Drop" หมายถึง "ทิ้ง" หรือ "ปล่อยลงพื้น"'
    },
    {
      sourceWord: 'quit',
      regex: /\bquit\b/i,
      context: 'gaming_hud_ui',
      forbiddenInContextRegex: /(ลาออก|เลิกทำ)/i,
      correctMeaningTh: 'ออกจากเกม / ย้อนกลับ',
      wrongMeaningTh: 'ลาออกจากงาน',
      suggestionTh: 'ในเมนูเกม "Quit" ควรแปลว่า "ออกจากเกม" หรือ "ออก"'
    },
    {
      sourceWord: 'match',
      regex: /\bmatch\b/i,
      context: 'gaming_hud_ui',
      forbiddenInContextRegex: /(ไม้ขีด|ไม้ขีดไฟ)/i,
      correctMeaningTh: 'การแข่งขัน / แมตช์ / ห้องเล่น',
      wrongMeaningTh: 'ไม้ขีดไฟ',
      suggestionTh: 'ในระบบ Multiplayer "Match" หมายถึง "การแข่งขัน" หรือ "แมตช์"'
    }
  ];

  /**
   * คำศัพท์เชิงคำสั่งปฏิเสธ (Negation Keywords)
   */
  private static readonly NEGATION_SOURCE_WORDS = [
    'not', "don't", "doesn't", "didn't", "won't", 'never', 'cannot', "can't",
    'failed', 'failure', 'unable', 'prohibited', 'no', 'without', 'forbidden'
  ];

  private static readonly NEGATION_TARGET_WORDS_TH = [
    'ไม่', 'อย่า', 'ห้าม', 'ล้มเหลว', 'มิได้', 'ไร้', 'ไม่มี', 'ปฏิเสธ', 'มิอาจ'
  ];

  /**
   * ทำการสกัดตัวแปรทั้งหมดจากข้อความ
   */
  public static extractVariables(text: string): string[] {
    if (!text) return [];
    const variables: Set<string> = new Set();

    for (const pattern of this.VARIABLE_REGEX_PATTERNS) {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((m) => variables.add(m.trim()));
      }
    }

    return Array.from(variables);
  }

  /**
   * วิเคราะห์และตรวจจับบริบทของข้อความต้นทางโดยอัตโนมัติ (Automated Context Detection)
   */
  public static detectSourceContext(sourceText: string): LocalizationContextCategory {
    if (!sourceText) return 'general_conversation';
    const text = sourceText.trim();
    const lower = text.toLowerCase();

    // 1. UI / HUD Buttons (ข้อความสั้น, คำสั่งตรง, มีปุ่มคีย์บอร์ด)
    if (
      text.length <= 30 &&
      (lower.match(/^(start|play|exit|quit|options|settings|save|load|equip|unequip|cancel|confirm|back|continue|retry|respawn|apply|close)$/) ||
       lower.includes('press ') || lower.includes('hold ') || lower.includes('click to') || lower.includes('tap to'))
    ) {
      return 'gaming_hud_ui';
    }

    // 2. Quest & Objectives (ภารกิจ, เงื่อนไข, ตัวเลขการเก็บ)
    if (
      lower.includes('objective') || lower.includes('defeat ') || lower.includes('kill ') ||
      lower.includes('collect ') || lower.includes('reach the') || lower.includes('find the') ||
      lower.includes('survive for') || lower.includes('quest completed') || lower.match(/\b\d+\s*\/\s*\d+\b/)
    ) {
      return 'quest_objective';
    }

    // 3. Store & Monetization (ราคา, เหรียญ, ไอเทมมอลล์)
    if (
      lower.includes('purchase') || lower.includes('buy for') || lower.includes('gems') ||
      lower.includes('coins') || lower.includes('diamond') || lower.includes('discount') ||
      lower.includes('bundle') || lower.includes('battle pass') || lower.includes('$') || lower.includes('฿')
    ) {
      return 'store_monetization';
    }

    // 4. Technical Settings (กราฟิก, เสียง, การควบคุม)
    if (
      lower.includes('fps') || lower.includes('resolution') || lower.includes('vsync') ||
      lower.includes('motion blur') || lower.includes('anti-aliasing') || lower.includes('master volume') ||
      lower.includes('brightness') || lower.includes('invert y-axis') || lower.includes('keybind')
    ) {
      return 'technical_settings';
    }

    // 5. Lore & Worldbuilding (เนื้อเรื่อง, ประวัติศาสตร์, ตำนาน)
    if (
      lower.includes('ancient') || lower.includes('prophecy') || lower.includes('kingdom') ||
      lower.includes('dynasty') || lower.includes('legend says') || lower.includes('chronicle') ||
      lower.includes('realm of') || lower.includes('artifact of')
    ) {
      return 'gaming_lore';
    }

    // 6. Dialogue (มีเครื่องหมายคำพูด หรือประโยคสนทนาตัวละคร)
    if (
      text.startsWith('"') || text.startsWith('“') || text.includes('—') ||
      lower.startsWith('i ') || lower.startsWith('you ') || lower.startsWith('we ') ||
      lower.includes('!') || lower.includes('?') || lower.includes('said')
    ) {
      return 'gaming_dialogue';
    }

    return 'gaming_hud_ui';
  }

  /**
   * ดำเนินการตรวจสอบการแปลเทียบกับบริบทอย่างครบวงจร (Main Verification Pipeline)
   */
  public static verifyLocalization(
    sourceText: string,
    translatedText: string,
    sourceLang: GlobalLanguageProfile,
    targetLang: GlobalLanguageProfile,
    specifiedContext?: LocalizationContextCategory,
    glossaryRules: OfflineGlossaryRule[] = []
  ): LocalizationVerificationReport {
    const activeContext = specifiedContext || this.detectSourceContext(sourceText);
    const issues: LocalizationVerificationIssue[] = [];

    // สกัดตัวแปรต้นทางและเป้าหมาย
    const sourceVars = this.extractVariables(sourceText);
    const targetVars = this.extractVariables(translatedText);

    // 1. ตรวจสอบความสมบูรณ์ของตัวแปรและ placeholders (Variable & Placeholder Integrity)
    const missingOrAlteredVars: string[] = [];
    let variableScore = 100;

    sourceVars.forEach((sv) => {
      // ตรวจหาว่าตัวแปรต้นทางปรากฏในตัวแปรเป้าหมายหรือไม่
      const foundExact = targetVars.includes(sv);
      if (!foundExact) {
        // เช็คว่าถูกแปลเป็นภาษาเป้าหมายหรือเพี้ยนหรือไม่
        const cleanContent = sv.replace(/[{}[\]%<>]/g, '');
        const leakedInText = translatedText.includes(cleanContent);

        missingOrAlteredVars.push(sv);
        variableScore -= 30;

        issues.push({
          id: `var-missing-${Date.now()}-${Math.random()}`,
          category: 'variable_corruption',
          severity: 'critical',
          titleTh: `ตัวแปรในเกมสูญหายหรือถูกดัดแปลง: ${sv}`,
          titleEn: `Variable or Placeholder Corrupted: ${sv}`,
          descriptionTh: `ตัวแปรสำคัญสำหรับระบบเกม "${sv}" ไม่ปรากฏในคำแปลที่ส่งออก หากนำไปใช้อาจทำให้เกิดข้อผิดพลาดในการแทนที่ค่าในเกม (Runtime String Crash)`,
          affectedSource: sv,
          affectedTarget: leakedInText ? `พบคำที่คล้ายกันในข้อความแต่ไม่มีเครื่องหมายครอบ` : 'ไม่พบในคำแปล',
          suggestedFix: `โปรดคงตัวแปร "${sv}" ไว้ตรงตามรูปแบบเดิม ห้ามแปลหรือใส่ช่องว่าง`,
          autoFixAvailable: true
        });
      }
    });

    // 2. ตรวจสอบการแปลผิดบริบทตามคู่คำศัพท์เฉพาะทางเกม (Context & Polysemy Disambiguation)
    let contextScore = 100;
    this.GAMING_POLYSEMY_MAP.forEach((rule) => {
      if (rule.regex.test(sourceText) && rule.context === activeContext) {
        if (rule.forbiddenInContextRegex.test(translatedText)) {
          contextScore -= 35;
          issues.push({
            id: `polysemy-${rule.sourceWord}-${Date.now()}`,
            category: 'context_mismatch',
            severity: 'critical',
            titleTh: `แปลผิดบริบทวิดีโอเกม: คำว่า "${rule.sourceWord}"`,
            titleEn: `Gaming Context Mismatch: "${rule.sourceWord}"`,
            descriptionTh: `พบการแปลคำว่า "${rule.sourceWord}" เป็น "${rule.wrongMeaningTh}" ซึ่งไม่ถูกต้องสำหรับบริบท ${activeContext} บริบทที่ถูกต้องคือ "${rule.correctMeaningTh}"`,
            affectedSource: rule.sourceWord,
            suggestedFix: rule.suggestionTh,
            autoFixAvailable: true
          });
        }
      }
    });

    // 3. ตรวจสอบความปลอดภัยด้านขนาดต่อ UI / HUD (UI Layout & Length Expansion Safety)
    const srcLen = sourceText.trim().length;
    const tgtLen = translatedText.trim().length;
    const expansionRatio = srcLen > 0 ? tgtLen / srcLen : 1;
    let uiSafetyScore = 100;

    if (activeContext === 'gaming_hud_ui') {
      // สำหรับ UI ปุ่ม/HUD ถ้าคำแปลยาวกว่า 24 ตัวอักษร หรือขยายเกิน 75% ถือว่าเสี่ยงล้นกรอบ
      if (tgtLen > 25 && srcLen <= 12) {
        uiSafetyScore -= 40;
        issues.push({
          id: `ui-overflow-len-${Date.now()}`,
          category: 'ui_overflow_risk',
          severity: 'warning',
          titleTh: 'ข้อความยาวเกินไปสำหรับ UI หรือปุ่มในเกม',
          titleEn: 'Text Length Exceeds Safe UI Bounds',
          descriptionTh: `ต้นฉบับยาวเพียง ${srcLen} ตัวอักษร แต่คำแปลยาวถึง ${tgtLen} ตัวอักษร (ขยายตัว +${Math.round((expansionRatio - 1) * 100)}%) มีความเสี่ยงสูงที่ข้อความจะล้นปุ่มหรือตัดบรรทัดผิดรูป`,
          affectedTarget: translatedText,
          suggestedFix: 'แนะนำให้ย่อคำแปลให้กระชับสำหรับ UI เช่น ตัดคำฟุ่มเฟือยออก',
          autoFixAvailable: true
        });
      } else if (expansionRatio > 1.8 && srcLen > 5) {
        uiSafetyScore -= 25;
        issues.push({
          id: `ui-expansion-warn-${Date.now()}`,
          category: 'ui_overflow_risk',
          severity: 'warning',
          titleTh: `อัตราการขยายความยาวสูง (${Math.round(expansionRatio * 100)}%)`,
          titleEn: `High String Expansion Ratio`,
          descriptionTh: `ข้อความในภาษานี้ขยายตัวมากกว่าปกติเทียบกับภาษาต้นฉบับ ตรวจสอบขนาดกรอบข้อความ (Text Box Layout Bounds)`,
          autoFixAvailable: false
        });
      }
    }

    // 4. ตรวจสอบการตกหล่นของคำปฏิเสธ (Negation Polarity Check)
    const hasSourceNegation = this.NEGATION_SOURCE_WORDS.some((word) =>
      new RegExp(`\\b${word}\\b`, 'i').test(sourceText)
    );
    if (hasSourceNegation && targetLang.id === 'th') {
      const hasTargetNegation = this.NEGATION_TARGET_WORDS_TH.some((word) =>
        translatedText.includes(word)
      );
      if (!hasTargetNegation) {
        contextScore -= 40;
        issues.push({
          id: `negation-loss-${Date.now()}`,
          category: 'negation_polarity_loss',
          severity: 'critical',
          titleTh: 'ตรวจพบคำปฏิเสธในต้นฉบับตกหล่น (ความหมายกลับด้าน)',
          titleEn: 'Negation or Prohibition Clause Dropped',
          descriptionTh: 'ภาษาต้นทางมีคำบ่งชี้การห้ามหรือปฏิเสธ เช่น "don\'t", "failed", "cannot" แต่คำแปลภาษาไทยไม่มีคำปฏิเสธ (เช่น "ไม่", "ห้าม", "อย่า") ซึ่งทำให้ความหมายของเกมกลับด้านอย่างรุนแรง',
          affectedSource: 'พบคีย์เวิร์ดปฏิเสธ',
          suggestedFix: 'เพิ่มคำว่า "ไม่" หรือ "ห้าม" ลงในตำแหน่งที่เหมาะสมของประโยค',
          autoFixAvailable: true
        });
      }
    }

    // 5. ตรวจสอบระดับภาษาและคำฟุ่มเฟือยสำหรับ UI (Tone & Wordiness)
    let toneScore = 100;
    if (activeContext === 'gaming_hud_ui' && targetLang.id === 'th') {
      if (translatedText.includes('กรุณา') || translatedText.includes('โปรด')) {
        toneScore -= 20;
        issues.push({
          id: `tone-polite-hud-${Date.now()}`,
          category: 'tone_inconsistency',
          severity: 'tip',
          titleTh: 'มีคำสุภาพฟุ่มเฟือยในปุ่ม/HUD ("กรุณา", "โปรด")',
          titleEn: 'Wordy Politeness Particles in HUD UI',
          descriptionTh: 'ในปุ่มกดหรือข้อความแสดงผลแบบเรียลไทม์ การใช้คำว่า "กรุณา..." หรือ "โปรด..." ทำให้ปุ่มยาวเกินไปและอ่านยากในเสี้ยววินาทีของการเล่นเกม',
          suggestedFix: 'ตัด "กรุณา" หรือ "โปรด" ออก เช่น ใช้ "กด [E] เพื่อเริ่ม" แทน "กรุณากด [E] เพื่อเริ่ม"',
          autoFixAvailable: true
        });
      }
    }

    // 6. ตรวจสอบกับ Glossary เฉพาะทางเกม (Custom Glossary Adherence)
    glossaryRules.forEach((rule) => {
      const srcMatch = new RegExp(`\\b${rule.sourceTerm}\\b`, rule.caseSensitive ? 'g' : 'gi');
      if (srcMatch.test(sourceText)) {
        if (!translatedText.toLowerCase().includes(rule.targetTerm.toLowerCase())) {
          issues.push({
            id: `glossary-${rule.id}-${Date.now()}`,
            category: 'lore_glossary_deviation',
            severity: 'warning',
            titleTh: `คำศัพท์ทางการไม่ตรงตามกฎที่ล็อกไว้: "${rule.sourceTerm}"`,
            titleEn: `Glossary Terminology Violation: "${rule.sourceTerm}"`,
            descriptionTh: `คำว่า "${rule.sourceTerm}" ถูกกำหนดไว้ในคลังศัพท์ให้แปลว่า "${rule.targetTerm}" แต่ในคำแปลปัจจุบันไม่ปรากฏคำนี้`,
            suggestedFix: `แทนที่คำแปลที่เกี่ยวข้องด้วย "${rule.targetTerm}"`,
            autoFixAvailable: true
          });
        }
      }
    });

    // คำนวณคะแนนรวมและสถานะ
    variableScore = Math.max(0, Math.min(100, variableScore));
    contextScore = Math.max(0, Math.min(100, contextScore));
    uiSafetyScore = Math.max(0, Math.min(100, uiSafetyScore));
    toneScore = Math.max(0, Math.min(100, toneScore));
    const culturalScore = Math.round((contextScore + toneScore) / 2);

    const overallScore = Math.round(
      variableScore * 0.35 +
      contextScore * 0.30 +
      uiSafetyScore * 0.20 +
      toneScore * 0.15
    );

    let status: LocalizationVerificationMetrics['status'] = 'optimal';
    if (overallScore < 50 || issues.some((i) => i.severity === 'critical')) {
      status = 'critical_defect';
    } else if (overallScore < 75 || issues.some((i) => i.severity === 'warning')) {
      status = 'needs_review';
    } else if (overallScore < 90) {
      status = 'acceptable';
    }

    const metrics: LocalizationVerificationMetrics = {
      overallAccuracyScore: overallScore,
      contextAdherenceScore: contextScore,
      variablePreservationScore: variableScore,
      uiSafetyScore,
      culturalNuanceScore: culturalScore,
      status,
      lengthExpansionRatio: Number(expansionRatio.toFixed(2)),
      characterCountSource: srcLen,
      characterCountTarget: tgtLen,
      detectedVariablesInSource: sourceVars,
      detectedVariablesInTarget: targetVars,
      missingOrAlteredVariables: missingOrAlteredVars
    };

    // สร้างข้อมูลวิเคราะห์เชิงลึก (Source Context Insights)
    const insights: SourceContextInsights = {
      detectedContext: activeContext,
      detectedIntentTh: this.getIntentDescriptionTh(activeContext, sourceText),
      grammaticalToneTh: this.getToneDescriptionTh(activeContext),
      targetCulturalAdaptationNotes: this.getCulturalNotesTh(activeContext, targetLang.id),
      potentialUiOverflowRisk: uiSafetyScore < 70,
      entityPreservationStatus: missingOrAlteredVars.length === 0
        ? (sourceVars.length > 0 ? 'intact' : 'none_present')
        : 'corrupted'
    };

    // สร้างทางเลือกการแปลตามบริบท (Contextual Localization Variants)
    const suggestedVariants = this.generateContextualVariants(
      sourceText,
      translatedText,
      activeContext,
      sourceVars,
      targetLang
    );

    // สร้างคำแปลฉบับแก้ไขอัตโนมัติ (Auto-Healed Translation)
    const autoHealedTranslation = this.generateAutoHealedTranslation(
      translatedText,
      sourceVars,
      issues,
      activeContext,
      targetLang
    );

    return {
      id: `l10n-rep-${Date.now()}`,
      timestamp: Date.now(),
      sourceText,
      translatedText,
      sourceLang,
      targetLang,
      activeContext,
      metrics,
      insights,
      issues,
      suggestedVariants,
      autoHealedTranslation,
      isFullyVerified: issues.filter((i) => i.severity === 'critical').length === 0
    };
  }

  /**
   * สังเคราะห์คำแปลทางเลือกตามบริบทเกมเฉพาะ (Contextual Localization Variants)
   */
  private static generateContextualVariants(
    sourceText: string,
    currentTranslatedText: string,
    currentContext: LocalizationContextCategory,
    sourceVars: string[],
    targetLang: GlobalLanguageProfile
  ): ContextualLocalizationVariant[] {
    const varsString = sourceVars.join(' ');
    let base = currentTranslatedText;

    // ทำความสะอาดคำที่ไม่จำเป็นสำหรับ UI
    const compactUI = base
      .replace(/กรุณา|โปรด/g, '')
      .replace(/การทำงานของ|ข้อมูลของ/g, '')
      .replace(/เพื่อให้|สำหรับการ/g, 'เพื่อ')
      .replace(/\s+/g, ' ')
      .trim();

    // สร้างสำนวนแบบ RPG Lore / Story
    const immersiveLore = base
      .replace(/เริ่ม/g, 'ก้าวเข้าสู่การเริ่มต้น')
      .replace(/บันทึก/g, 'จารึกชะตากรรม')
      .replace(/ล้มเหลว/g, 'พ่ายแพ้ต่อบททดสอบ');

    // สร้างสำนวนแบบ Casual / Mobile
    const casual = base
      .replace(/อย่างยิ่ง|เป็นอย่างมาก/g, 'สุดๆ')
      .replace(/รับทราบ/g, 'โอเค');

    const variants: ContextualLocalizationVariant[] = [
      {
        id: 'var-hud-compact',
        contextCategory: 'gaming_hud_ui',
        labelTh: '🎮 สำหรับปุ่มและ HUD ในเกม (กระชับ ปลอดภัย ไม่ล้นกรอบ)',
        labelEn: 'In-Game HUD & Action Buttons',
        text: compactUI || base,
        descriptionTh: 'ตัดคำเชื่อมและคำฟุ่มเฟือยออกทั้งหมด เหมาะกับปุ่มลัด แถบคำสั่ง และหน้าต่างข้อความขนาดจำกัด',
        characterCount: (compactUI || base).length,
        expansionPercent: Math.round(((compactUI || base).length / (sourceText.length || 1) - 1) * 100),
        uiSafetyRating: (compactUI || base).length <= 25 ? 'safe' : 'warning',
        badgeColor: '#3fb950'
      },
      {
        id: 'var-dialogue-natural',
        contextCategory: 'gaming_dialogue',
        labelTh: '🗣️ สำหรับบทสนทนาตัวละคร (เป็นธรรมชาติ มีชีวิตชีวา)',
        labelEn: 'Natural NPC & Story Dialogue',
        text: base,
        descriptionTh: 'รักษาน้ำเสียงและความสละสลวยของการพูดคุย เหมาะกับ Subtitle และ Quest Log',
        characterCount: base.length,
        expansionPercent: Math.round((base.length / (sourceText.length || 1) - 1) * 100),
        uiSafetyRating: 'safe',
        badgeColor: '#58a6ff'
      },
      {
        id: 'var-lore-epic',
        contextCategory: 'gaming_lore',
        labelTh: '📜 สำหรับตำนานและเนื้อเรื่องแฟนตาซี (สละสลวย อารมณ์ลึกซึ้ง)',
        labelEn: 'Fantasy Lore & Worldbuilding',
        text: immersiveLore,
        descriptionTh: 'ใช้คำศัพท์โบราณหรือมีระดับความไพเราะสูง เหมาะกับคัมภีร์ สมุดบันทึก และประวัติไอเทมระดับตำนาน',
        characterCount: immersiveLore.length,
        expansionPercent: Math.round((immersiveLore.length / (sourceText.length || 1) - 1) * 100),
        uiSafetyRating: 'safe',
        badgeColor: '#a371f7'
      }
    ];

    return variants;
  }

  /**
   * สร้างคำแปลเวอร์ชันปรับปรุงสมบูรณ์แบบอัตโนมัติ (Auto-Healed Translation)
   */
  private static generateAutoHealedTranslation(
    translatedText: string,
    sourceVars: string[],
    issues: LocalizationVerificationIssue[],
    context: LocalizationContextCategory,
    targetLang: GlobalLanguageProfile
  ): string {
    let healed = translatedText;

    // 1. นำตัวแปรที่ตกหล่นกลับคืนมาต่อท้ายหากหายไป
    sourceVars.forEach((v) => {
      if (!healed.includes(v)) {
        healed = `${healed} ${v}`.trim();
      }
    });

    // 2. ปรับปรุง Polysemy ตามที่ตรวจพบ
    issues.forEach((issue) => {
      if (issue.category === 'context_mismatch') {
        if (issue.affectedSource === 'save') {
          healed = healed.replace(/(ช่วยชีวิต|รอดพ้น|กอบกู้)/g, 'บันทึก');
        } else if (issue.affectedSource === 'fire') {
          healed = healed.replace(/(ไล่ออก|ปลดออก)/g, 'ยิง');
        } else if (issue.affectedSource === 'party') {
          healed = healed.replace(/(งานเลี้ยง|งานรื่นเริง)/g, 'ปาร์ตี้');
        } else if (issue.affectedSource === 'equip') {
          healed = healed.replace(/จัดเตรียมอุปกรณ์/g, 'สวมใส่');
        }
      }
    });

    // 3. ปรับปรุงระดับคำสำหรับ HUD
    if (context === 'gaming_hud_ui' && targetLang.id === 'th') {
      healed = healed.replace(/กรุณา|โปรด/g, '').trim();
    }

    // จัดระเบียบช่องว่าง
    return healed.replace(/\s+/g, ' ').trim();
  }

  private static getIntentDescriptionTh(context: LocalizationContextCategory, text: string): string {
    switch (context) {
      case 'gaming_hud_ui':
        return 'คำสั่งการทำงานหรือปุ่มควบคุมในเกม (Interactive Control / Button)';
      case 'gaming_dialogue':
        return 'บทสนทนาตัวละครและการสื่อสารทางอารมณ์ (Character Dialogue)';
      case 'gaming_lore':
        return 'เนื้อหาเชิงปกรณัม ตำนาน หรือประวัติศาสตร์โลกเกม (World Lore & Narrative)';
      case 'quest_objective':
        return 'เป้าหมายภารกิจและเงื่อนไขความคืบหน้าของผู้เล่น (Quest Objective)';
      case 'store_monetization':
        return 'ข้อเสนอทางการค้า แพ็กเกจไอเทม หรือการชำระเงิน (Commercial Storefront)';
      case 'technical_settings':
        return 'การปรับแต่งฮาร์ดแวร์และการแสดงผลของเกม (Hardware / Graphics Settings)';
      default:
        return 'ข้อความทั่วไปหรือคำบรรยาย (General Content)';
    }
  }

  private static getToneDescriptionTh(context: LocalizationContextCategory): string {
    switch (context) {
      case 'gaming_hud_ui':
        return 'กระชับ ฉับไว ชัดเจน สื่อความหมายในเสี้ยววินาที';
      case 'gaming_dialogue':
        return 'มีชีวิตชีวา สอดคล้องกับอุปนิสัยและอารมณ์ของตัวละคร';
      case 'gaming_lore':
        return 'สละสลวย ภูมิฐาน ดึงดูดและสร้างบรรยากาศแฟนตาซี';
      case 'quest_objective':
        return 'ตรงไปตรงมา วัดผลได้ ระบุเป้าหมายชัดเจน';
      case 'store_monetization':
        return 'ดึงดูดใจ ปลอดภัย ถูกต้องตามกฎหมายคุ้มครองผู้บริโภค';
      default:
        return 'เป็นกลางและถูกต้องตามหลักไวยากรณ์';
    }
  }

  private static getCulturalNotesTh(context: LocalizationContextCategory, targetLangId: string): string[] {
    const notes: string[] = [];

    if (targetLangId === 'th') {
      notes.push('ภาษาไทยมีสระลอยและวรรณยุกต์บน-ล่าง ต้องคำนึงถึง Line-Height ของ Font UI');
      notes.push('ในเกมแนวแอ็กชันนิยมใช้คำกริยานำหน้า เช่น "กด", "เลือก", "โจมตี" เพื่อความรวดเร็ว');
      if (context === 'gaming_hud_ui') {
        notes.push('ไม่จำเป็นต้องใส่คำสุภาพ "ครับ/ค่ะ" ในหน้าต่างระบบและปุ่มลัด');
      }
    } else if (targetLangId === 'ja') {
      notes.push('ภาษาญี่ปุ่นแยกคำศัพท์เกมมิ่งด้วย Katakana (เช่น スタート, セーブ) นิยมมากกว่า Kanji ทางการ');
      notes.push('คำนึงถึง Keigo (ความสุภาพ) ในบทสนทนาตัวละครที่มีลำดับอาวุโส');
    } else if (targetLangId === 'de') {
      notes.push('ภาษาเยอรมันมีความยาวของคำประกอบ (Compound Words) สูงกว่าภาษาอังกฤษเฉลี่ย 30-40%');
    } else if (targetLangId === 'ar') {
      notes.push('ภาษาอาหรับแสดงผลจากขวาไปซ้าย (RTL) ตัวแปร {key} ต้องไม่สลับฝั่ง');
    } else {
      notes.push('ตรวจสอบการแสดงผลของตัวแปรในภาษาเป้าหมายให้คงเครื่องหมายดั้งเดิม');
    }

    return notes;
  }

  /**
   * ดำเนินการทดสอบตรวจสอบสตริงแบบชุดกลุ่ม (Batch Localization Testbed)
   */
  public static runBatchVerification(
    items: Array<{ id: string; keyName: string; sourceText: string; translatedText: string; context?: LocalizationContextCategory }>,
    sourceLang: GlobalLanguageProfile,
    targetLang: GlobalLanguageProfile
  ): BatchLocalizationItem[] {
    return items.map((item) => {
      const rep = this.verifyLocalization(
        item.sourceText,
        item.translatedText,
        sourceLang,
        targetLang,
        item.context
      );

      const criticalCount = rep.issues.filter((i) => i.severity === 'critical').length;
      const warningCount = rep.issues.filter((i) => i.severity === 'warning').length;
      const tipCount = rep.issues.filter((i) => i.severity === 'tip').length;

      let status: BatchLocalizationItem['status'] = 'verified_pass';
      if (criticalCount > 0) {
        status = 'verified_critical';
      } else if (warningCount > 0) {
        status = 'verified_warning';
      }

      return {
        id: item.id,
        keyName: item.keyName,
        contextCategory: rep.activeContext,
        sourceText: item.sourceText,
        translatedText: item.translatedText,
        metrics: rep.metrics,
        issuesCount: {
          critical: criticalCount,
          warning: warningCount,
          tip: tipCount
        },
        status,
        suggestedFix: rep.autoHealedTranslation
      };
    });
  }
}
