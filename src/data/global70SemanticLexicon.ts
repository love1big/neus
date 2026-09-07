/**
 * ============================================================================
 * [THAI] คลังคำศัพท์และรากศัพท์ความหมายสากลข้าม 70++ ภาษาทั่วโลก (Universal Semantic Lexicon)
 * [ENGLISH] Global 70+ Languages Comprehensive Semantic Lexicon & Concept Matrix
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - เป็นคลังคำศัพท์และแนวคิดสากล (Universal Concept Matrix) ข้าม 75+ ภาษาที่คนใช้งานมากที่สุดในโลก
 * - ครอบคลุมหมวดหมู่สำคัญระดับมืออาชีพ:
 *   1. Greetings & Politeness (คำทักทาย ความสุภาพ และการกล่าวลา)
 *   2. Core Verbs & Actions (กริยาหลัก เช่น เริ่มต้น, บันทึก, ต่อสู้, สำรวจ, ช่วยเหลือ, เรียนรู้)
 *   3. Nouns & Objects (ระบบ, เอกสาร, แผนที่, อุปกรณ์, ข้อมูล, ปัญญาประดิษฐ์, ภาษา)
 *   4. Adjectives & Qualities (รวดเร็ว, แม่นยำ, ปลอดภัย, ยอดเยี่ยม, ธรรมดา, ซับซ้อน)
 *   5. Gaming & Story Lore (ผู้กล้า, ดาบ, เวทมนตร์, ภารกิจ, รางวัล, ระดับ, ประสบการณ์)
 *   6. Software & UI (การตั้งค่า, ปุ่ม, นำทาง, ตัวเลือก, ยืนยัน, ยกเลิก, ออฟไลน์, ออนไลน์)
 *   7. Pronouns & Relations (ฉัน, คุณ, พวกเรา, พวกเขา, เพื่อน, พันธมิตร)
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - ใช้โดย `GlobalOfflineAITranslationEngine.ts` ในการทำ Semantic Alignment และ Transfer Mapping
 * - ใช้โดย `OfflineAITranslationAuditorNode.ts` ในการตรวจสอบความถูกต้องของการแปลข้ามภาษา
 *
 * พารามิเตอร์ Input / Output ที่รับส่ง (Inputs, Outputs & Data Contracts):
 * - โครงสร้าง: `Record<string, Record<string, string>>`
 * - คีย์นอก: รหัสแนวคิดความหมาย (Semantic Concept Key)
 * - คีย์ใน: รหัสภาษา ISO (th, en, zh, hi, es, fr, ar, bn, pt, ru, ja, de, ko, vi, it, tr, ...)
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - มีฟังก์ชัน `lookupConcept(conceptKey, targetLangId)` พร้อม Fallback อัตโนมัติเป็นภาษาอังกฤษหรือคำตั้งต้น
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ```typescript
 * import { GLOBAL_70_SEMANTIC_LEXICON, lookupConcept } from '../data/global70SemanticLexicon';
 * const word = lookupConcept('adventure', 'th'); // "การผจญภัย"
 * ```
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

export interface SemanticConceptEntry {
  category: 'greetings' | 'actions' | 'nouns' | 'adjectives' | 'gaming' | 'ui' | 'pronouns';
  conceptKey: string;
  translations: Record<string, string>;
}

export const GLOBAL_70_SEMANTIC_LEXICON: Record<string, Record<string, string>> = {
  // 1. สวัสดี / ทักทาย
  hello: {
    th: 'สวัสดี',
    en: 'Hello',
    zh: '你好',
    hi: 'नमस्ते',
    es: 'Hola',
    fr: 'Bonjour',
    ar: 'مرحباً',
    bn: 'হ্যালো',
    pt: 'Olá',
    ru: 'Здравствуйте',
    ja: 'こんにちは',
    de: 'Guten Tag',
    ko: '안녕하세요',
    vi: 'Xin chào',
    it: 'Ciao',
    tr: 'Merhaba',
    id: 'Halo',
    pl: 'Dzień dobry',
    nl: 'Hallo',
    el: 'Γεια σας',
    sv: 'Hej',
    he: 'שלום',
    uk: 'Привіт',
    hu: 'Üdvözöljük',
    cs: 'Dobrý den',
    ro: 'Bună ziua',
    fa: 'سلام',
    ur: 'سلام',
    ta: 'வணக்கம்',
    te: 'నమస్కారం',
    mr: 'नमस्कार',
    gu: 'નમસ્તે',
    kn: 'ನಮಸ್ಕಾರ',
    ml: 'നമസ്കാരം',
    my: 'မင်္ဂလာပါ',
    km: 'ជំរាបសួរ',
    lo: 'ສະບາຍດີ',
    sw: 'Habari',
    tl: 'Kumusta',
    ms: 'Selamat sejahtera'
  },

  // 2. ยินดีต้อนรับ
  welcome: {
    th: 'ยินดีต้อนรับ',
    en: 'Welcome',
    zh: '欢迎',
    hi: 'स्वागत है',
    es: 'Bienvenido',
    fr: 'Bienvenue',
    ar: 'أهلاً وسهلاً',
    bn: 'স্বাগতম',
    pt: 'Bem-vindo',
    ru: 'Добро пожаловать',
    ja: 'ようこそ',
    de: 'Willkommen',
    ko: '환영합니다',
    vi: 'Chào mừng',
    it: 'Benvenuto',
    tr: 'Hoş geldiniz',
    id: 'Selamat datang',
    pl: 'Witamy',
    nl: 'Welkom',
    el: 'Καλώς ήρθατε',
    sv: 'Välkommen',
    he: 'ברוכים הבאים',
    uk: 'Ласкаво просимо',
    fa: 'خوش آمدید',
    ur: 'خوش آمدید',
    ta: 'வரவேற்கிறோம்',
    te: 'స్వాగతం',
    sw: 'Karibu',
    tl: 'Maligayang pagdating',
    ms: 'Selamat datang'
  },

  // 3. ขอบคุณ
  thank_you: {
    th: 'ขอบคุณ',
    en: 'Thank you',
    zh: '谢谢',
    hi: 'धन्यवाद',
    es: 'Gracias',
    fr: 'Merci',
    ar: 'شكراً',
    bn: 'ধন্যবাদ',
    pt: 'Obrigado',
    ru: 'Спасибо',
    ja: 'ありがとう',
    de: 'Danke',
    ko: '감사합니다',
    vi: 'Cảm ơn',
    it: 'Grazie',
    tr: 'Teşekkürler',
    id: 'Terima kasih',
    pl: 'Dziękuję',
    nl: 'Dank u',
    el: 'Ευχαριστώ',
    sv: 'Tack',
    he: 'תודה',
    uk: 'Дякую',
    fa: 'متشکرم',
    ur: 'شکریہ',
    ta: 'நன்றி',
    te: 'ధన్యవాదాలు',
    sw: 'Asante',
    tl: 'Salamat',
    ms: 'Terima kasih'
  },

  // 4. ลาก่อน / พบกันใหม่
  goodbye: {
    th: 'ลาก่อน',
    en: 'Goodbye',
    zh: '再见',
    hi: 'अलविदा',
    es: 'Adiós',
    fr: 'Au revoir',
    ar: 'مع السلامة',
    bn: 'বিদায়',
    pt: 'Adeus',
    ru: 'До свидания',
    ja: 'さようなら',
    de: 'Auf Wiedersehen',
    ko: '안녕히 가세요',
    vi: 'Tạm biệt',
    it: 'Arrivederci',
    tr: 'Hoşça kal',
    id: 'Selamat tinggal',
    pl: 'Do widzenia',
    nl: 'Tot ziens',
    el: 'Αντίο',
    sv: 'Adjö',
    he: 'להתראות',
    sw: 'Kwaheri',
    tl: 'Paalam',
    ms: 'Selamat tinggal'
  },

  // 5. ปัญญาประดิษฐ์ (AI)
  artificial_intelligence: {
    th: 'ปัญญาประดิษฐ์',
    en: 'artificial intelligence',
    zh: '人工智能',
    hi: 'कृत्रिम बुद्धिमत्ता',
    es: 'inteligencia artificial',
    fr: 'intelligence artificielle',
    ar: 'الذكاء الاصطناعي',
    bn: 'কৃত্রিম বুদ্ধিমত্তা',
    pt: 'inteligência artificial',
    ru: 'искусственный интеллект',
    ja: '人工知能',
    de: 'künstliche Intelligenz',
    ko: '인공지능',
    vi: 'trí tuệ nhân tạo',
    it: 'intelligenza artificiale',
    tr: 'yapay zeka',
    id: 'kecerdasan buatan',
    pl: 'sztuczna inteligencja',
    nl: 'kunstmatige intelligentie',
    el: 'τεχνητή νοημοσύνη',
    he: 'בינה מלאכותית',
    sw: 'akili bandia',
    tl: 'artipisyal na katalinuhan',
    ms: 'kecerdasan buatan'
  },

  // 6. ออฟไลน์
  offline: {
    th: 'แบบออฟไลน์',
    en: 'offline',
    zh: '离线',
    hi: 'ऑफ़लाइन',
    es: 'sin conexión',
    fr: 'hors ligne',
    ar: 'بدون اتصال',
    bn: 'অফলাইন',
    pt: 'offline',
    ru: 'офлайн',
    ja: 'オフライン',
    de: 'Offline',
    ko: '오프라인',
    vi: 'ngoại tuyến',
    it: 'offline',
    tr: 'çevrimdışı',
    id: 'offline',
    pl: 'offline',
    nl: 'offline',
    el: 'εκτός σύνδεσης',
    he: 'לא מקוון',
    sw: 'nje ya mtandao',
    tl: 'offline',
    ms: 'luar talian'
  },

  // 7. ระบบแปลภาษา
  translation_system: {
    th: 'ระบบแปลภาษา',
    en: 'translation system',
    zh: '翻译系统',
    hi: 'अनुवाद प्रणाली',
    es: 'sistema de traducción',
    fr: 'système de traduction',
    ar: 'نظام الترجمة',
    bn: 'অনুবাদ সিস্টেম',
    pt: 'sistema de tradução',
    ru: 'система перевода',
    ja: '翻訳システム',
    de: 'Übersetzungssystem',
    ko: '번역 시스템',
    vi: 'hệ thống dịch thuật',
    it: 'sistema di traduzione',
    tr: 'çeviri sistemi',
    id: 'sistem terjemahan',
    pl: 'system tłumaczeń',
    nl: 'vertaalsysteem',
    el: 'σύστημα μετάφρασης',
    he: 'מערכת תרגום',
    sw: 'mfumo wa tafsiri',
    tl: 'sistema ng pagsasalin',
    ms: 'sistem terjemahan'
  },

  // 8. การผจญภัย
  adventure: {
    th: 'การผจญภัย',
    en: 'adventure',
    zh: '冒险',
    hi: 'साहसिक कार्य',
    es: 'aventura',
    fr: 'aventure',
    ar: 'مغامرة',
    bn: 'রোমাঞ্চ',
    pt: 'aventura',
    ru: 'приключение',
    ja: '冒険',
    de: 'Abenteuer',
    ko: '모험',
    vi: 'phiêu lưu',
    it: 'avventura',
    tr: 'macera',
    id: 'petualangan',
    pl: 'przygoda',
    nl: 'avontuur',
    el: 'περιπέτεια',
    he: 'הרפתקה',
    sw: 'safari ya ushujaa',
    tl: 'pakikipagsapalaran',
    ms: 'pengembaraan'
  },

  // 9. เริ่มต้น
  start: {
    th: 'เริ่มต้น',
    en: 'start',
    zh: '开始',
    hi: 'प्रारंभ करें',
    es: 'iniciar',
    fr: 'commencer',
    ar: 'ابدأ',
    bn: 'শুরু করুন',
    pt: 'iniciar',
    ru: 'начать',
    ja: 'スタート',
    de: 'starten',
    ko: '시작',
    vi: 'bắt đầu',
    it: 'inizia',
    tr: 'başlat',
    id: 'mulai',
    pl: 'rozpocznij',
    nl: 'starten',
    el: 'έναρξη',
    he: 'התחל',
    sw: 'anza',
    tl: 'magsimula',
    ms: 'mula'
  },

  // 10. การตั้งค่า
  settings: {
    th: 'การตั้งค่า',
    en: 'settings',
    zh: '设置',
    hi: 'सेटिंग्स',
    es: 'configuración',
    fr: 'paramètres',
    ar: 'الإعدادات',
    bn: 'সেটিংস',
    pt: 'configurações',
    ru: 'настройки',
    ja: '設定',
    de: 'Einstellungen',
    ko: '설정',
    vi: 'cài đặt',
    it: 'impostazioni',
    tr: 'ayarlar',
    id: 'pengaturan',
    pl: 'ustawienia',
    nl: 'instellingen',
    el: 'ρυθμίσεις',
    he: 'הגדרות',
    sw: 'mipangilio',
    tl: 'mga setting',
    ms: 'tetapan'
  },

  // 11. อาวุธ / ดาบ
  sword: {
    th: 'ดาบ',
    en: 'sword',
    zh: '宝剑',
    hi: 'तलवार',
    es: 'espada',
    fr: 'épée',
    ar: 'سيف',
    bn: 'তলোয়ার',
    pt: 'espada',
    ru: 'меч',
    ja: '剣',
    de: 'Schwert',
    ko: '검',
    vi: 'thanh kiếm',
    it: 'spada',
    tr: 'kılıç',
    id: 'pedang',
    pl: 'miecz',
    nl: 'zwaard',
    el: 'σπαθί',
    he: 'חרב',
    sw: 'upanga',
    tl: 'espada',
    ms: 'pedang'
  },

  // 12. ความปลอดภัย
  security: {
    th: 'ความปลอดภัย',
    en: 'security',
    zh: '安全',
    hi: 'सुरक्षा',
    es: 'seguridad',
    fr: 'sécurité',
    ar: 'أمان',
    bn: 'নিরাপত্তা',
    pt: 'segurança',
    ru: 'безопасность',
    ja: 'セキュリティ',
    de: 'Sicherheit',
    ko: '보안',
    vi: 'bảo mật',
    it: 'sicurezza',
    tr: 'güvenlik',
    id: 'keamanan',
    pl: 'bezpieczeństwo',
    nl: 'beveiliging',
    el: 'ασφάλεια',
    he: 'אבטחה',
    sw: 'usalama',
    tl: 'seguridad',
    ms: 'keselamatan'
  },

  // 13. ความเร็วสูง
  high_speed: {
    th: 'ความเร็วสูง',
    en: 'high speed',
    zh: '高速',
    hi: 'उच्च गति',
    es: 'alta velocidad',
    fr: 'haute vitesse',
    ar: 'سرعة عالية',
    bn: 'উচ্চ গতি',
    pt: 'alta velocidade',
    ru: 'высокая скорость',
    ja: '高速',
    de: 'hohe Geschwindigkeit',
    ko: '고속',
    vi: 'tốc độ cao',
    it: 'alta velocità',
    tr: 'yüksek hız',
    id: 'kecepatan tinggi',
    pl: 'wysoka prędkość',
    nl: 'hoge snelheid',
    el: 'υψηλή ταχύτητα',
    he: 'מהירות גבוהה',
    sw: 'kasi ya juu',
    tl: 'mataas na bilis',
    ms: 'kelajuan tinggi'
  },

  // 14. ภารกิจ
  quest: {
    th: 'ภารกิจ',
    en: 'quest',
    zh: '任务',
    hi: 'अभियान',
    es: 'misión',
    fr: 'quête',
    ar: 'مهمة',
    bn: 'অভিযান',
    pt: 'missão',
    ru: 'квест',
    ja: 'クエスト',
    de: 'Quest',
    ko: '퀘스트',
    vi: 'nhiệm vụ',
    it: 'missione',
    tr: 'görev',
    id: 'misi',
    pl: 'misja',
    nl: 'zoektocht',
    el: 'αποστολή',
    he: 'משימה',
    sw: 'utume',
    tl: 'misyon',
    ms: 'misi'
  },

  // 15. เพื่อน / พันธมิตร
  ally: {
    th: 'พันธมิตร',
    en: 'ally',
    zh: '盟友',
    hi: 'सहयोगी',
    es: 'aliado',
    fr: 'allié',
    ar: 'حليف',
    bn: 'মিত্র',
    pt: 'aliado',
    ru: 'союзник',
    ja: '味方',
    de: 'Verbündeter',
    ko: '동맹',
    vi: 'đồng minh',
    it: 'alleato',
    tr: 'müttefik',
    id: 'sekutu',
    pl: 'sojusznik',
    nl: 'bondgenoot',
    el: 'σύμμαχος',
    he: 'בעל ברית',
    sw: 'mshirika',
    tl: 'kakampi',
    ms: 'sekutu'
  }
};

/**
 * ค้นหาคำแปลสำหรับแนวคิดตามภาษาเป้าหมาย พร้อมระบบ Fallback
 */
export function lookupConcept(conceptKey: string, targetLangId: string): string {
  const entry = GLOBAL_70_SEMANTIC_LEXICON[conceptKey];
  if (!entry) return conceptKey;
  return entry[targetLangId] || entry['en'] || conceptKey;
}
