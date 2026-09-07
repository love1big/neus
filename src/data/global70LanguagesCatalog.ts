/**
 * ============================================================================
 * [THAI] คลังข้อมูลและโปรไฟล์ 75++ ภาษาที่คนใช้มากที่สุดในโลก (Global 70+ Languages Catalog)
 * [ENGLISH] Global 70+ Most Spoken Languages Database & Linguistic Profiles
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - รวบรวมโปรไฟล์ภาษามากกว่า 75 ภาษาที่คนใช้งานมากที่สุดในโลก ครอบคลุมประชากรมากกว่า 95% ของโลก
 * - ข้อมูลทุกภาษาประกอบด้วย: รหัส ISO (639-1 และ 639-3), ชื่อไทย, ชื่ออังกฤษ, ชื่อเจ้าของภาษา (Native),
 *   ตระกูลภาษา (Language Family), อักขรวิธี (Script), ทิศทางการเขียน (LTR/RTL),
 *   จำนวนผู้พูด (ล้านคน), ประโยคตัวอย่างพร้อมคำแปลไทย-อังกฤษ, ระบบคำและการแบ่งคำ (Word Boundary)
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - ใช้เป็นฐานข้อมูลหลักให้กับ `GlobalOfflineAITranslationEngine` และ `GlobalOfflineAITranslationStudio`
 * - มีฟังก์ชันค้นหา คัดกรองตามภูมิภาค และตรวจจับภาษาอัตโนมัติ (Language Identification / LID)
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - มีฟังก์ชัน Fallback เมื่อไม่พบภาษาในรายการ โดยจะส่งคืนโปรไฟล์ภาษาไทย หรือภาษาอังกฤษ
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ```typescript
 * import { GLOBAL_70_LANGUAGES, getLanguageProfileById } from '../data/global70LanguagesCatalog';
 * const lang = getLanguageProfileById('th');
 * ```
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

import { GlobalLanguageProfile } from '../types/offlineTranslation70';

export const GLOBAL_70_LANGUAGES: GlobalLanguageProfile[] = [
  // 1. Thai
  {
    id: 'th',
    iso639_1: 'th',
    iso639_3: 'tha',
    nameThai: 'ภาษาไทย (มาตรฐานกลาง)',
    nameEnglish: 'Thai (Standard Central)',
    nativeName: 'ไทย',
    family: 'Kra-Dai',
    script: 'Thai',
    direction: 'ltr',
    speakersCountMillion: 71,
    regionOfOrigin: 'เอเชียตะวันออกเฉียงใต้ (ไทย)',
    sampleSentence: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    sampleTranslationEn: 'Hello, welcome to the intelligent offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: false,
    tonal: true
  },
  // 2. English
  {
    id: 'en',
    iso639_1: 'en',
    iso639_3: 'eng',
    nameThai: 'ภาษาอังกฤษ (สากล)',
    nameEnglish: 'English (Global Standard)',
    nativeName: 'English',
    family: 'Indo-European (Germanic)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 1452,
    regionOfOrigin: 'อเมริกาเหนือ, ยุโรป, ออสเตรเลีย, ทั่วโลก',
    sampleSentence: 'Hello and welcome to the advanced offline neural translation studio.',
    sampleTranslationEn: 'Hello and welcome to the advanced offline neural translation studio.',
    sampleTranslationTh: 'สวัสดีและยินดีต้อนรับสู่สตูดิโอแปลภาษาประสาทเทียมแบบออฟไลน์ขั้นสูง',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 3. Mandarin Chinese
  {
    id: 'zh',
    iso639_1: 'zh',
    iso639_3: 'zho',
    nameThai: 'ภาษาจีนกลาง (มาตรฐาน/ผู่ทงฮว่า)',
    nameEnglish: 'Mandarin Chinese (Putonghua)',
    nativeName: '中文 (普通话)',
    family: 'Sino-Tibetan',
    script: 'Hanzi',
    direction: 'ltr',
    speakersCountMillion: 1118,
    regionOfOrigin: 'จีน, ไต้หวัน, สิงคโปร์',
    sampleSentence: '你好，欢迎使用全球离线智能翻译系统。',
    sampleTranslationEn: 'Hello, welcome to the global offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะออฟไลน์ระดับโลก',
    hasSpaceDelimiter: false,
    tonal: true
  },
  // 4. Hindi
  {
    id: 'hi',
    iso639_1: 'hi',
    iso639_3: 'hin',
    nameThai: 'ภาษาฮินดี',
    nameEnglish: 'Hindi',
    nativeName: 'हिन्दी',
    family: 'Indo-European (Indo-Aryan)',
    script: 'Devanagari',
    direction: 'ltr',
    speakersCountMillion: 602,
    regionOfOrigin: 'อินเดีย (ตอนเหนือและตอนกลาง)',
    sampleSentence: 'नमस्ते, उन्नत ऑफ़लाइन अनुवाद प्रणाली में आपका स्वागत है।',
    sampleTranslationEn: 'Hello, welcome to the advanced offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาออฟไลน์ขั้นสูง',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 5. Spanish
  {
    id: 'es',
    iso639_1: 'es',
    iso639_3: 'spa',
    nameThai: 'ภาษาสเปน (กัสติยา/ลาตินอเมริกา)',
    nameEnglish: 'Spanish (Castilian & Latin America)',
    nativeName: 'Español',
    family: 'Indo-European (Romance)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 548,
    regionOfOrigin: 'สเปน, เม็กซิโก, ลาตินอเมริกา',
    sampleSentence: 'Hola, bienvenido al sistema de traducción inteligente sin conexión.',
    sampleTranslationEn: 'Hello, welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 6. French
  {
    id: 'fr',
    iso639_1: 'fr',
    iso639_3: 'fra',
    nameThai: 'ภาษาฝรั่งเศส',
    nameEnglish: 'French',
    nativeName: 'Français',
    family: 'Indo-European (Romance)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 280,
    regionOfOrigin: 'ฝรั่งเศส, แคนาดา, เบลเยียม, แอฟริกา',
    sampleSentence: 'Bonjour, bienvenue dans le studio de traduction hors ligne intelligent.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation studio.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่สตูดิโอแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 7. Standard Arabic
  {
    id: 'ar',
    iso639_1: 'ar',
    iso639_3: 'ara',
    nameThai: 'ภาษาอาหรับ (มาตรฐานสากล)',
    nameEnglish: 'Modern Standard Arabic',
    nativeName: 'العربية',
    family: 'Afroasiatic (Semitic)',
    script: 'Arabic',
    direction: 'rtl',
    speakersCountMillion: 374,
    regionOfOrigin: 'ตะวันออกกลางและแอฟริกาเหนือ',
    sampleSentence: 'مرحباً بكم في نظام الترجمة الذكي بدون اتصال بالإنترنت.',
    sampleTranslationEn: 'Welcome to the smart offline translation system.',
    sampleTranslationTh: 'ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบไม่ใช้อินเทอร์เน็ต',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 8. Bengali
  {
    id: 'bn',
    iso639_1: 'bn',
    iso639_3: 'ben',
    nameThai: 'ภาษาเบงกาลี',
    nameEnglish: 'Bengali',
    nativeName: 'বাংলা',
    family: 'Indo-European (Indo-Aryan)',
    script: 'Bengali',
    direction: 'ltr',
    speakersCountMillion: 272,
    regionOfOrigin: 'บังกลาเทศ, อินเดีย (เบงกอลตะวันตก)',
    sampleSentence: 'হ্যালো, অফলাইন বুদ্ধিমান অনুবাদ সিস্টেমে আপনাকে স্বাগতম।',
    sampleTranslationEn: 'Hello, welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 9. Portuguese
  {
    id: 'pt',
    iso639_1: 'pt',
    iso639_3: 'por',
    nameThai: 'ภาษาโปรตุเกส (บราซิล/ยุโรป)',
    nameEnglish: 'Portuguese (Brazilian & European)',
    nativeName: 'Português',
    family: 'Indo-European (Romance)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 257,
    regionOfOrigin: 'บราซิล, โปรตุเกส, แองโกลา, โมซัมบิก',
    sampleSentence: 'Olá, bem-vindo ao estúdio de tradução inteligente offline.',
    sampleTranslationEn: 'Hello, welcome to the offline intelligent translation studio.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่สตูดิโอแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 10. Russian
  {
    id: 'ru',
    iso639_1: 'ru',
    iso639_3: 'rus',
    nameThai: 'ภาษารัสเซีย',
    nameEnglish: 'Russian',
    nativeName: 'Русский',
    family: 'Indo-European (Slavic)',
    script: 'Cyrillic',
    direction: 'ltr',
    speakersCountMillion: 258,
    regionOfOrigin: 'รัสเซีย, ยูเรเชีย, เอเชียกลาง',
    sampleSentence: 'Здравствуйте, добро пожаловать в интеллектуальную систему офлайн-перевода.',
    sampleTranslationEn: 'Hello, welcome to the intelligent offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบการแปลอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 11. Japanese
  {
    id: 'ja',
    iso639_1: 'ja',
    iso639_3: 'jpn',
    nameThai: 'ภาษาญี่ปุ่น',
    nameEnglish: 'Japanese',
    nativeName: '日本語',
    family: 'Japonic',
    script: 'Kana',
    direction: 'ltr',
    speakersCountMillion: 125,
    regionOfOrigin: 'ญี่ปุ่น',
    sampleSentence: 'こんにちは、高度なオフライン自動翻訳スタジオへようこそ。',
    sampleTranslationEn: 'Hello, welcome to the advanced offline automatic translation studio.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่สตูดิโอแปลภาษาอัตโนมัติแบบออฟไลน์ขั้นสูง',
    hasSpaceDelimiter: false,
    tonal: false
  },
  // 12. Western Punjabi
  {
    id: 'pa',
    iso639_1: 'pa',
    iso639_3: 'pan',
    nameThai: 'ภาษาปัญจาบี',
    nameEnglish: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ / پنجابی',
    family: 'Indo-European (Indo-Aryan)',
    script: 'Gurmukhi',
    direction: 'ltr',
    speakersCountMillion: 125,
    regionOfOrigin: 'ปากีสถาน, อินเดีย (ปัญจาบ)',
    sampleSentence: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਆਫਲਾਈਨ ਅਨੁਵਾਦ ਪ੍ਰਣਾਲੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ।',
    sampleTranslationEn: 'Greetings, welcome to the offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: true
  },
  // 13. German
  {
    id: 'de',
    iso639_1: 'de',
    iso639_3: 'deu',
    nameThai: 'ภาษาเยอรมัน',
    nameEnglish: 'German',
    nativeName: 'Deutsch',
    family: 'Indo-European (Germanic)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 134,
    regionOfOrigin: 'เยอรมนี, ออสเตรีย, สวิตเซอร์แลนด์',
    sampleSentence: 'Guten Tag, willkommen im intelligenten Offline-Übersetzungssystem.',
    sampleTranslationEn: 'Hello, welcome to the intelligent offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 14. Javanese
  {
    id: 'jv',
    iso639_1: 'jv',
    iso639_3: 'jav',
    nameThai: 'ภาษาชวา',
    nameEnglish: 'Javanese',
    nativeName: 'Basa Jawa',
    family: 'Austronesian',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 82,
    regionOfOrigin: 'อินโดนีเซีย (เกาะชวา)',
    sampleSentence: 'Sugeng rawuh ing sistem terjemahan cerdas offline.',
    sampleTranslationEn: 'Welcome to the smart offline translation system.',
    sampleTranslationTh: 'ยินดีต้อนรับสู่ระบบการแปลอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 15. Wu Chinese (Shanghainese)
  {
    id: 'wuu',
    iso639_1: 'wuu',
    iso639_3: 'wuu',
    nameThai: 'ภาษาจีนอู๋ (เซี่ยงไฮ้/เจ้อเจียง)',
    nameEnglish: 'Wu Chinese (Shanghainese)',
    nativeName: '吴语 (上海闲话)',
    family: 'Sino-Tibetan',
    script: 'Hanzi',
    direction: 'ltr',
    speakersCountMillion: 81,
    regionOfOrigin: 'จีน (เซี่ยงไฮ้, มณฑลเจ้อเจียง)',
    sampleSentence: '侬好，欢迎来到离线智能翻译平台。',
    sampleTranslationEn: 'Hello, welcome to the offline translation platform.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่แพลตฟอร์มแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: false,
    tonal: true
  },
  // 16. Telugu
  {
    id: 'te',
    iso639_1: 'te',
    iso639_3: 'tel',
    nameThai: 'ภาษาเตลูกู',
    nameEnglish: 'Telugu',
    nativeName: 'తెలుగు',
    family: 'Dravidian',
    script: 'Telugu',
    direction: 'ltr',
    speakersCountMillion: 95,
    regionOfOrigin: 'อินเดีย (อานธรประเทศ, เตลังคานา)',
    sampleSentence: 'నమస్కారం, ఆఫ్‌లైన్ తెలివైన అనువాద వ్యవస్థకు స్వాగతం.',
    sampleTranslationEn: 'Greetings, welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 17. Marathi
  {
    id: 'mr',
    iso639_1: 'mr',
    iso639_3: 'mar',
    nameThai: 'ภาษามราฐี',
    nameEnglish: 'Marathi',
    nativeName: 'मराठी',
    family: 'Indo-European (Indo-Aryan)',
    script: 'Devanagari',
    direction: 'ltr',
    speakersCountMillion: 95,
    regionOfOrigin: 'อินเดีย (รัฐมหาราษฏระ, มุมไบ)',
    sampleSentence: 'नमस्कार, ऑफलाइन बुद्धिमान भाषांतर प्रणालीमध्ये आपले स्वागत आहे.',
    sampleTranslationEn: 'Greetings, welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 18. Turkish
  {
    id: 'tr',
    iso639_1: 'tr',
    iso639_3: 'tur',
    nameThai: 'ภาษาตุรกี',
    nameEnglish: 'Turkish',
    nativeName: 'Türkçe',
    family: 'Turkic',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 88,
    regionOfOrigin: 'ตุรกี, ไซปรัสเหนือ',
    sampleSentence: 'Merhaba, çevrimdışı akıllı çeviri sistemine hoş geldiniz.',
    sampleTranslationEn: 'Hello, welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 19. Korean
  {
    id: 'ko',
    iso639_1: 'ko',
    iso639_3: 'kor',
    nameThai: 'ภาษาเกาหลี',
    nameEnglish: 'Korean',
    nativeName: '한국어',
    family: 'Koreanic',
    script: 'Hangul',
    direction: 'ltr',
    speakersCountMillion: 82,
    regionOfOrigin: 'เกาหลีใต้, เกาหลีเหนือ',
    sampleSentence: '안녕하세요, 고성능 오프라인 지능형 번역 스튜디오에 오신 것을 환영합니다.',
    sampleTranslationEn: 'Hello, welcome to the high-performance offline intelligent translation studio.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่สตูดิโอแปลภาษาอัจฉริยะแบบออฟไลน์ประสิทธิภาพสูง',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 20. Vietnamese
  {
    id: 'vi',
    iso639_1: 'vi',
    iso639_3: 'vie',
    nameThai: 'ภาษาเวียดนาม',
    nameEnglish: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    family: 'Austroasiatic',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 85,
    regionOfOrigin: 'เวียดนาม',
    sampleSentence: 'Xin chào, chào mừng bạn đến với hệ thống dịch thuật ngoại tuyến thông minh.',
    sampleTranslationEn: 'Hello, welcome to the intelligent offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: true
  },
  // 21. Tamil
  {
    id: 'ta',
    iso639_1: 'ta',
    iso639_3: 'tam',
    nameThai: 'ภาษาทมิฬ',
    nameEnglish: 'Tamil',
    nativeName: 'தமிழ்',
    family: 'Dravidian',
    script: 'Tamil',
    direction: 'ltr',
    speakersCountMillion: 85,
    regionOfOrigin: 'อินเดีย (ทมิฬนาฑู), ศรีลังกา, สิงคโปร์, มาเลเซีย',
    sampleSentence: 'வணக்கம், ஆஃப்லைன் மொழிபெயர்ப்பு அமைப்புக்கு வரவேற்கிறோம்.',
    sampleTranslationEn: 'Greetings, welcome to the offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 22. Yue Chinese (Cantonese)
  {
    id: 'yue',
    iso639_1: 'yue',
    iso639_3: 'yue',
    nameThai: 'ภาษาจีนกวางตุ้ง (ฮ่องกง/กวางตุ้ง)',
    nameEnglish: 'Yue Chinese (Cantonese)',
    nativeName: '粵語 (廣東話)',
    family: 'Sino-Tibetan',
    script: 'Hanzi',
    direction: 'ltr',
    speakersCountMillion: 85,
    regionOfOrigin: 'ฮ่องกง, มาเก๊า, มณฑลกวางตุ้ง',
    sampleSentence: '雷好，歡迎來到離線智能翻譯系統。',
    sampleTranslationEn: 'Hello, welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: false,
    tonal: true
  },
  // 23. Urdu
  {
    id: 'ur',
    iso639_1: 'ur',
    iso639_3: 'urd',
    nameThai: 'ภาษาอูรดู',
    nameEnglish: 'Urdu',
    nativeName: 'اردو',
    family: 'Indo-European (Indo-Aryan)',
    script: 'Arabic',
    direction: 'rtl',
    speakersCountMillion: 231,
    regionOfOrigin: 'ปากีสถาน, อินเดีย',
    sampleSentence: 'خوش آمدید، آف لائن ذہین ترجمہ کے نظام میں آپ کا خیر مقدم ہے۔',
    sampleTranslationEn: 'Welcome, you are welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 24. Italian
  {
    id: 'it',
    iso639_1: 'it',
    iso639_3: 'ita',
    nameThai: 'ภาษาอิตาลี',
    nameEnglish: 'Italian',
    nativeName: 'Italiano',
    family: 'Indo-European (Romance)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 68,
    regionOfOrigin: 'อิตาลี, สวิตเซอร์แลนด์, ซานมารีโน',
    sampleSentence: 'Ciao, benvenuto nello studio di traduzione offline intelligente.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation studio.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่สตูดิโอแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 25. Gujarati
  {
    id: 'gu',
    iso639_1: 'gu',
    iso639_3: 'guj',
    nameThai: 'ภาษากูจารัต',
    nameEnglish: 'Gujarati',
    nativeName: 'ગુજરાતી',
    family: 'Indo-European (Indo-Aryan)',
    script: 'Gujarati',
    direction: 'ltr',
    speakersCountMillion: 62,
    regionOfOrigin: 'อินเดีย (รัฐคุชราต)',
    sampleSentence: 'નમસ્તે, ઑફલાઇન બુદ્ધિશાળી અનુવાદ પ્રણાલીમાં આપનું સ્વાગત છે.',
    sampleTranslationEn: 'Greetings, welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 26. Persian / Farsi
  {
    id: 'fa',
    iso639_1: 'fa',
    iso639_3: 'fas',
    nameThai: 'ภาษาเปอร์เซีย (ฟาร์ซี)',
    nameEnglish: 'Persian (Farsi)',
    nativeName: 'فارسی',
    family: 'Indo-European (Iranian)',
    script: 'Arabic',
    direction: 'rtl',
    speakersCountMillion: 77,
    regionOfOrigin: 'อิหร่าน, อัฟกานิสถาน (ดารี), ทาจิกิสถาน',
    sampleSentence: 'سلام، به سیستم هوشمند ترجمه آفلاین خوش آمدید.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 27. Bhojpuri
  {
    id: 'bho',
    iso639_1: 'bho',
    iso639_3: 'bho',
    nameThai: 'ภาษาโภชปุรี',
    nameEnglish: 'Bhojpuri',
    nativeName: 'भोजपुरी',
    family: 'Indo-European (Indo-Aryan)',
    script: 'Devanagari',
    direction: 'ltr',
    speakersCountMillion: 53,
    regionOfOrigin: 'อินเดีย (พิหาร, อุตตรประเทศ), เนปาล',
    sampleSentence: 'प्रणाम, ऑफलाइन अनुवाद प्रणाली में राउर स्वागत बा।',
    sampleTranslationEn: 'Greetings, welcome to the offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 28. Southern Min / Hokkien
  {
    id: 'nan',
    iso639_1: 'nan',
    iso639_3: 'nan',
    nameThai: 'ภาษาหมิ่นใต้ (ฮกเกี้ยน/ไต้หวัน)',
    nameEnglish: 'Southern Min (Hokkien / Taiwanese)',
    nativeName: '閩南語 (福建話 / 臺灣話)',
    family: 'Sino-Tibetan',
    script: 'Hanzi',
    direction: 'ltr',
    speakersCountMillion: 50,
    regionOfOrigin: 'ไต้หวัน, ฝูเจี้ยน, สิงคโปร์, มาเลเซีย, ไทย',
    sampleSentence: '汝好，歡迎來到離線智慧翻譯系統。',
    sampleTranslationEn: 'Hello, welcome to the offline smart translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: false,
    tonal: true
  },
  // 29. Hakka
  {
    id: 'hak',
    iso639_1: 'hak',
    iso639_3: 'hak',
    nameThai: 'ภาษาฮากกา (จีนแคะ)',
    nameEnglish: 'Hakka Chinese',
    nativeName: '客家話',
    family: 'Sino-Tibetan',
    script: 'Hanzi',
    direction: 'ltr',
    speakersCountMillion: 48,
    regionOfOrigin: 'กวางตุ้ง, เจียงซี, ไต้หวัน, ไทย',
    sampleSentence: '你好，歡迎來到離線智能翻譯系統。',
    sampleTranslationEn: 'Hello, welcome to the offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์',
    hasSpaceDelimiter: false,
    tonal: true
  },
  // 30. Jin Chinese
  {
    id: 'cjy',
    iso639_1: 'cjy',
    iso639_3: 'cjy',
    nameThai: 'ภาษาจีนจิ้น (ชานซี)',
    nameEnglish: 'Jin Chinese',
    nativeName: '晋语',
    family: 'Sino-Tibetan',
    script: 'Hanzi',
    direction: 'ltr',
    speakersCountMillion: 47,
    regionOfOrigin: 'จีน (มณฑลชานซีและมองโกเลียใน)',
    sampleSentence: '你好，欢迎使用离线智能翻译系统。',
    sampleTranslationEn: 'Hello, welcome to use the offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่การใช้งานระบบแปลภาษาออฟไลน์',
    hasSpaceDelimiter: false,
    tonal: true
  },
  // 31. Hausa
  {
    id: 'ha',
    iso639_1: 'ha',
    iso639_3: 'hau',
    nameThai: 'ภาษาเฮาซา',
    nameEnglish: 'Hausa',
    nativeName: 'Harshen Hausa',
    family: 'Afroasiatic (Chadic)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 77,
    regionOfOrigin: 'ไนจีเรีย, ไนเจอร์ (แอฟริกาตะวันตก)',
    sampleSentence: 'Sannu, barka da zuwa dakin fassarar basira ta layi.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation room.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: true
  },
  // 32. Kannada
  {
    id: 'kn',
    iso639_1: 'kn',
    iso639_3: 'kan',
    nameThai: 'ภาษากันนาดา',
    nameEnglish: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    family: 'Dravidian',
    script: 'Kannada',
    direction: 'ltr',
    speakersCountMillion: 59,
    regionOfOrigin: 'อินเดีย (รัฐกรณาฏกะ, บังกาลอร์)',
    sampleSentence: 'ನಮಸ್ಕಾರ, ಆಫ್‌ಲೈನ್ ಬುದ್ಧಿವಂತ ಅನುವಾದ ವ್ಯವಸ್ಥೆಗೆ ಸುಸ್ವಾಗತ.',
    sampleTranslationEn: 'Greetings, welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 33. Indonesian
  {
    id: 'id',
    iso639_1: 'id',
    iso639_3: 'ind',
    nameThai: 'ภาษาอินโดนีเซีย',
    nameEnglish: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    family: 'Austronesian',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 199,
    regionOfOrigin: 'อินโดนีเซีย',
    sampleSentence: 'Halo, selamat datang di sistem terjemahan cerdas offline.',
    sampleTranslationEn: 'Hello, welcome to the offline smart translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 34. Polish
  {
    id: 'pl',
    iso639_1: 'pl',
    iso639_3: 'pol',
    nameThai: 'ภาษาโปแลนด์',
    nameEnglish: 'Polish',
    nativeName: 'Polski',
    family: 'Indo-European (Slavic)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 45,
    regionOfOrigin: 'โปแลนด์, ยุโรปกลาง',
    sampleSentence: 'Dzień dobry, witamy w inteligentnym systemie tłumaczeń offline.',
    sampleTranslationEn: 'Good day, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 35. Yoruba
  {
    id: 'yo',
    iso639_1: 'yo',
    iso639_3: 'yor',
    nameThai: 'ภาษาโยรูบา',
    nameEnglish: 'Yoruba',
    nativeName: 'Èdè Yorùbá',
    family: 'Niger-Congo',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 46,
    regionOfOrigin: 'ไนจีเรีย, เบนิน, โตโก',
    sampleSentence: 'Ẹ n lẹ́ o, ẹ kaabọ si eto itumọ oye aisinipo.',
    sampleTranslationEn: 'Hello, welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: true
  },
  // 36. Xiang Chinese (Hunanese)
  {
    id: 'hsn',
    iso639_1: 'hsn',
    iso639_3: 'hsn',
    nameThai: 'ภาษาจีนเซียง (หูหนาน)',
    nameEnglish: 'Xiang Chinese (Hunanese)',
    nativeName: '湘语 (湖南话)',
    family: 'Sino-Tibetan',
    script: 'Hanzi',
    direction: 'ltr',
    speakersCountMillion: 38,
    regionOfOrigin: 'จีน (มณฑลหูหนาน)',
    sampleSentence: '你好，欢迎光临离线智能翻译系统。',
    sampleTranslationEn: 'Hello, welcome to the offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์',
    hasSpaceDelimiter: false,
    tonal: true
  },
  // 37. Malayalam
  {
    id: 'ml',
    iso639_1: 'ml',
    iso639_3: 'mal',
    nameThai: 'ภาษามาลายาลัม',
    nameEnglish: 'Malayalam',
    nativeName: 'മലയാളം',
    family: 'Dravidian',
    script: 'Malayalam',
    direction: 'ltr',
    speakersCountMillion: 38,
    regionOfOrigin: 'อินเดีย (รัฐเกรละ)',
    sampleSentence: 'നമസ്കാരം, ഓഫ്‌ലൈൻ ബുദ്ധിമാനായ വിവർത്തന സംവിധാനത്തിലേക്ക് സ്വാഗതം.',
    sampleTranslationEn: 'Greetings, welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 38. Odia / Oriya
  {
    id: 'or',
    iso639_1: 'or',
    iso639_3: 'ori',
    nameThai: 'ภาษาโอเดีย (โอริยา)',
    nameEnglish: 'Odia (Oriya)',
    nativeName: 'ଓଡ଼ିଆ',
    family: 'Indo-European (Indo-Aryan)',
    script: 'Odia',
    direction: 'ltr',
    speakersCountMillion: 38,
    regionOfOrigin: 'อินเดีย (รัฐโอริศา)',
    sampleSentence: 'ନମସ୍କାର, ଅଫଲାଇନ ବୁଦ୍ଧିମାନ ଅନୁବାଦ ପ୍ରଣାଳୀକୁ ସ୍ୱାଗତ।',
    sampleTranslationEn: 'Greetings, welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบการแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 39. Maithili
  {
    id: 'mai',
    iso639_1: 'mai',
    iso639_3: 'mai',
    nameThai: 'ภาษาไมถิลี',
    nameEnglish: 'Maithili',
    nativeName: 'मैथिली',
    family: 'Indo-European (Indo-Aryan)',
    script: 'Devanagari',
    direction: 'ltr',
    speakersCountMillion: 35,
    regionOfOrigin: 'อินเดีย (พิหาร) และเนปาล',
    sampleSentence: 'प्रणाम, ऑफ़लाइन अनुवाद प्रणाली मे अहाँक स्वागत अछि।',
    sampleTranslationEn: 'Greetings, you are welcome in the offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับคุณเข้าสู่ระบบแปลภาษาออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 40. Burmese
  {
    id: 'my',
    iso639_1: 'my',
    iso639_3: 'mya',
    nameThai: 'ภาษาพม่า',
    nameEnglish: 'Burmese',
    nativeName: 'မြန်မာဘာသာ',
    family: 'Sino-Tibetan',
    script: 'Burmese',
    direction: 'ltr',
    speakersCountMillion: 43,
    regionOfOrigin: 'เมียนมา (พม่า)',
    sampleSentence: 'မင်္ဂလာပါ၊ အော့ဖ်လိုင်းဉာဏ်ရည်တုဘာသာပြန်စနစ်မှ ကြိုဆိုပါသည်။',
    sampleTranslationEn: 'Hello, welcome to the offline AI translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษา AI แบบออฟไลน์',
    hasSpaceDelimiter: false,
    tonal: true
  },
  // 41. Sundanese
  {
    id: 'su',
    iso639_1: 'su',
    iso639_3: 'sun',
    nameThai: 'ภาษาซุนดา',
    nameEnglish: 'Sundanese',
    nativeName: 'Basa Sunda',
    family: 'Austronesian',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 42,
    regionOfOrigin: 'อินโดนีเซีย (ชวาตะวันตก)',
    sampleSentence: 'Wilujeng sumping di sistem panarjamah pinter offline.',
    sampleTranslationEn: 'Welcome to the smart offline translation system.',
    sampleTranslationTh: 'ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 42. Pashto
  {
    id: 'ps',
    iso639_1: 'ps',
    iso639_3: 'pus',
    nameThai: 'ภาษาปาชโต',
    nameEnglish: 'Pashto',
    nativeName: 'پښتو',
    family: 'Indo-European (Iranian)',
    script: 'Arabic',
    direction: 'rtl',
    speakersCountMillion: 40,
    regionOfOrigin: 'อัฟกานิสถาน, ปากีสถาน',
    sampleSentence: 'سلام، د هوښیار آفلاین ژباړې سیسټم ته ښه راغلاست.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 43. Romanian
  {
    id: 'ro',
    iso639_1: 'ro',
    iso639_3: 'ron',
    nameThai: 'ภาษาโรมาเนีย',
    nameEnglish: 'Romanian',
    nativeName: 'Română',
    family: 'Indo-European (Romance)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 28,
    regionOfOrigin: 'โรมาเนีย, มอลโดวา',
    sampleSentence: 'Bună ziua, bun venit la sistemul inteligent de traducere offline.',
    sampleTranslationEn: 'Good day, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 44. Dutch
  {
    id: 'nl',
    iso639_1: 'nl',
    iso639_3: 'nld',
    nameThai: 'ภาษาดัตช์ (เนเธอร์แลนด์)',
    nameEnglish: 'Dutch',
    nativeName: 'Nederlands',
    family: 'Indo-European (Germanic)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 30,
    regionOfOrigin: 'เนเธอร์แลนด์, เบลเยียม (ฟลานเดอร์)',
    sampleSentence: 'Hallo, welkom bij het intelligente offline vertaalsysteem.',
    sampleTranslationEn: 'Hello, welcome to the intelligent offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 45. Tagalog / Filipino
  {
    id: 'tl',
    iso639_1: 'tl',
    iso639_3: 'tgl',
    nameThai: 'ภาษาตากาล็อก (ฟิลิปปินส์)',
    nameEnglish: 'Tagalog (Filipino)',
    nativeName: 'Wikang Tagalog',
    family: 'Austronesian',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 82,
    regionOfOrigin: 'ฟิลิปปินส์',
    sampleSentence: 'Kumusta, maligayang pagdating sa matalinong offline na sistema ng pagsasalin.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบการแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 46. Sindhi
  {
    id: 'sd',
    iso639_1: 'sd',
    iso639_3: 'snd',
    nameThai: 'ภาษาสินธี',
    nameEnglish: 'Sindhi',
    nativeName: 'سنڌي',
    family: 'Indo-European (Indo-Aryan)',
    script: 'Arabic',
    direction: 'rtl',
    speakersCountMillion: 33,
    regionOfOrigin: 'ปากีสถาน (แคว้นสินธ์), อินเดีย',
    sampleSentence: 'سلام، آف لائن سمارٽ ترجمي واري نظام ۾ ڀلي ڪري آيا.',
    sampleTranslationEn: 'Greetings, welcome to the offline smart translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 47. Uzbek
  {
    id: 'uz',
    iso639_1: 'uz',
    iso639_3: 'uzb',
    nameThai: 'ภาษาอุซเบก',
    nameEnglish: 'Uzbek',
    nativeName: 'Oʻzbekcha',
    family: 'Turkic',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 34,
    regionOfOrigin: 'อุซเบกิสถาน, เอเชียกลาง',
    sampleSentence: 'Salom, aqlli oflayn tarjima tizimiga xush kelibsiz.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 48. Amharic
  {
    id: 'am',
    iso639_1: 'am',
    iso639_3: 'amh',
    nameThai: 'ภาษาอัมฮาริก',
    nameEnglish: 'Amharic',
    nativeName: 'አማርኛ',
    family: 'Afroasiatic (Semitic)',
    script: 'Geʽez',
    direction: 'ltr',
    speakersCountMillion: 33,
    regionOfOrigin: 'เอธิโอเปีย',
    sampleSentence: 'ሰላም፣ ወደ ብልጥ ከመስመር ውጭ የትርጉም ስርዓት እንኳን በደህና መጡ።',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 49. Fula / Fulfulde
  {
    id: 'ff',
    iso639_1: 'ff',
    iso639_3: 'ful',
    nameThai: 'ภาษาฟูลา (ฟุลฟุลเด)',
    nameEnglish: 'Fula (Fulfulde)',
    nativeName: 'Fulfulde',
    family: 'Niger-Congo',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 35,
    regionOfOrigin: 'แอฟริกาตะวันตกและแอฟริกากลาง (เซเนกัล, กินี, ไนจีเรีย)',
    sampleSentence: 'No waɗi, a jaɓɓaama e njuɓɓudi firo janngeeki offline.',
    sampleTranslationEn: 'Greetings, welcome to the offline intelligent translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบการแปลอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 50. Oromo
  {
    id: 'om',
    iso639_1: 'om',
    iso639_3: 'orm',
    nameThai: 'ภาษาโอโรโม',
    nameEnglish: 'Oromo',
    nativeName: 'Afaan Oromoo',
    family: 'Afroasiatic (Cushitic)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 36,
    regionOfOrigin: 'เอธิโอเปีย, เคนยา',
    sampleSentence: 'Akkam, gara sirna hiikkaa sarara maleetti dhuftan.',
    sampleTranslationEn: 'Hello, welcome to the offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 51. Igbo
  {
    id: 'ig',
    iso639_1: 'ig',
    iso639_3: 'ibo',
    nameThai: 'ภาษาอิกโบ',
    nameEnglish: 'Igbo',
    nativeName: 'Asụsụ Igbo',
    family: 'Niger-Congo',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 31,
    regionOfOrigin: 'ไนจีเรีย (ตะวันออกเฉียงใต้)',
    sampleSentence: 'Nnọọ, nnabata na usoro ntụgharị asụsụ offline nwere ọgụgụ isi.',
    sampleTranslationEn: 'Welcome, welcome to the smart offline translation system.',
    sampleTranslationTh: 'ยินดีต้อนรับสู่ระบบการแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: true
  },
  // 52. Azerbaijani
  {
    id: 'az',
    iso639_1: 'az',
    iso639_3: 'aze',
    nameThai: 'ภาษาอาเซอร์ไบจาน',
    nameEnglish: 'Azerbaijani',
    nativeName: 'Azərbaycan dili',
    family: 'Turkic',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 32,
    regionOfOrigin: 'อาเซอร์ไบจาน, อิหร่าน (ตะวันตกเฉียงเหนือ)',
    sampleSentence: 'Salam, ağıllı oflayn tərcümə sisteminə xoş gəlmisiniz.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 53. Kurdish
  {
    id: 'ku',
    iso639_1: 'ku',
    iso639_3: 'kur',
    nameThai: 'ภาษาเคิร์ด',
    nameEnglish: 'Kurdish',
    nativeName: 'Kurdî / کوردی',
    family: 'Indo-European (Iranian)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 30,
    regionOfOrigin: 'เคอร์ดิสถาน, อิรัก, ตุรกี, อิหร่าน, ซีเรีย',
    sampleSentence: 'Silav, hûn bi xêr hatin sîstema wergerandina biaqil ya offline.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 54. Serbo-Croatian
  {
    id: 'hbs',
    iso639_1: 'hr',
    iso639_3: 'hbs',
    nameThai: 'ภาษาเซอร์โบ-โครเอเชีย (บอสเนีย/โครเอเชีย/เซอร์เบีย)',
    nameEnglish: 'Serbo-Croatian',
    nativeName: 'Srpskohrvatski / Српскохрватски',
    family: 'Indo-European (Slavic)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 21,
    regionOfOrigin: 'เซอร์เบีย, โครเอเชีย, บอสเนีย, มอนเตเนโกร',
    sampleSentence: 'Pozdrav, dobrodošli u pametni sustav za izvanmrežno prevođenje.',
    sampleTranslationEn: 'Greetings, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: true
  },
  // 55. Malagasy
  {
    id: 'mg',
    iso639_1: 'mg',
    iso639_3: 'mlg',
    nameThai: 'ภาษามาลากาซี',
    nameEnglish: 'Malagasy',
    nativeName: 'Fiteny Malagasy',
    family: 'Austronesian',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 25,
    regionOfOrigin: 'มาดากัสการ์',
    sampleSentence: 'Manao ahoana, tonga soa eto amin\'ny rafitra fandikan-teny ivelan\'ny aterineto.',
    sampleTranslationEn: 'Hello, welcome to the offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 56. Nepali
  {
    id: 'ne',
    iso639_1: 'ne',
    iso639_3: 'nep',
    nameThai: 'ภาษาเนปาล',
    nameEnglish: 'Nepali',
    nativeName: 'नेपाली',
    family: 'Indo-European (Indo-Aryan)',
    script: 'Devanagari',
    direction: 'ltr',
    speakersCountMillion: 25,
    regionOfOrigin: 'เนปาล, อินเดีย (สิกขิม)',
    sampleSentence: 'नमस्ते, बौद्धिक अफलाइन अनुवाद प्रणालीमा यहाँलाई स्वागत छ।',
    sampleTranslationEn: 'Greetings, welcome to the intellectual offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 57. Sinhalese
  {
    id: 'si',
    iso639_1: 'si',
    iso639_3: 'sin',
    nameThai: 'ภาษาสิงหล',
    nameEnglish: 'Sinhalese',
    nativeName: 'සිංහල',
    family: 'Indo-European (Indo-Aryan)',
    script: 'Sinhala',
    direction: 'ltr',
    speakersCountMillion: 19,
    regionOfOrigin: 'ศรีลังกา',
    sampleSentence: 'ආයුබෝවන්, නොබැඳි බුද්ධිමත් පරිවර්තන පද්ධතියට ඔබව සාදරයෙන් පිළිගනිමු.',
    sampleTranslationEn: 'Hello, you are warmly welcomed to the offline smart translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับอย่างอบอุ่นสู่ระบบการแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 58. Khmer
  {
    id: 'km',
    iso639_1: 'km',
    iso639_3: 'khm',
    nameThai: 'ภาษาเขมร',
    nameEnglish: 'Khmer',
    nativeName: 'ភាសាខ្មែរ',
    family: 'Austroasiatic',
    script: 'Khmer',
    direction: 'ltr',
    speakersCountMillion: 18,
    regionOfOrigin: 'กัมพูชา',
    sampleSentence: 'ជំរាបសួរ សូមស្វាគមន៍មកកាន់ប្រព័ន្ធបកប្រែវៃឆ្លាតក្រៅបណ្តាញ។',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: false,
    tonal: false
  },
  // 59. Lao
  {
    id: 'lo',
    iso639_1: 'lo',
    iso639_3: 'lao',
    nameThai: 'ภาษาลาว',
    nameEnglish: 'Lao',
    nativeName: 'ພາສາລາວ',
    family: 'Kra-Dai',
    script: 'Lao',
    direction: 'ltr',
    speakersCountMillion: 15,
    regionOfOrigin: 'สปป. ลาว',
    sampleSentence: 'ສະບາຍດີ ຍິນດີຕ້ອນຮັບສູ່ລະບົບແປພາສາອັດສະລິຍະແບບອອບລາຍ.',
    sampleTranslationEn: 'Hello, welcome to the offline smart translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: false,
    tonal: true
  },
  // 60. Somali
  {
    id: 'so',
    iso639_1: 'so',
    iso639_3: 'som',
    nameThai: 'ภาษาโซมาลี',
    nameEnglish: 'Somali',
    nativeName: 'Af-Soomaali',
    family: 'Afroasiatic (Cushitic)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 22,
    regionOfOrigin: 'โซมาเลีย, จิบูตี, เอธิโอเปีย, เคนยา',
    sampleSentence: 'Kusoo dhawoow nidaamka turjumaada tooska ah ee offline-ka ah.',
    sampleTranslationEn: 'Welcome to the smart offline translation system.',
    sampleTranslationTh: 'ยินดีต้อนรับสู่ระบบการแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: true
  },
  // 61. Cebuano
  {
    id: 'ceb',
    iso639_1: 'ceb',
    iso639_3: 'ceb',
    nameThai: 'ภาษาเซบูอาโน (วิซายัน)',
    nameEnglish: 'Cebuano (Bisaya)',
    nativeName: 'Sinugboanon / Bisaya',
    family: 'Austronesian',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 23,
    regionOfOrigin: 'ฟิลิปปินส์ (หมู่เกาะวิซายัสและมินดาเนา)',
    sampleSentence: 'Kumusta, maayong pag-abot sa maalamong offline nga sistema sa paghubad.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 62. Greek
  {
    id: 'el',
    iso639_1: 'el',
    iso639_3: 'ell',
    nameThai: 'ภาษากรีก',
    nameEnglish: 'Greek',
    nativeName: 'Ελληνικά',
    family: 'Indo-European (Hellenic)',
    script: 'Greek',
    direction: 'ltr',
    speakersCountMillion: 14,
    regionOfOrigin: 'กรีซ, ไซปรัส',
    sampleSentence: 'Γεια σας, καλώς ήρθατε στο έξυπνο σύστημα μετάφρασης εκτός σύνδεσης.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบการแปลออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 63. Czech
  {
    id: 'cs',
    iso639_1: 'cs',
    iso639_3: 'ces',
    nameThai: 'ภาษาเช็ก',
    nameEnglish: 'Czech',
    nativeName: 'Čeština',
    family: 'Indo-European (Slavic)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 13,
    regionOfOrigin: 'สาธารณรัฐเช็ก',
    sampleSentence: 'Dobrý den, vítejte v inteligentním offline překladatelském systému.',
    sampleTranslationEn: 'Good day, welcome to the intelligent offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบการแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 64. Swedish
  {
    id: 'sv',
    iso639_1: 'sv',
    iso639_3: 'swe',
    nameThai: 'ภาษาสวีเดน',
    nameEnglish: 'Swedish',
    nativeName: 'Svenska',
    family: 'Indo-European (Germanic)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 14,
    regionOfOrigin: 'สวีเดน, ฟินแลนด์',
    sampleSentence: 'Hej, välkommen till det intelligenta offline-översättningssystemet.',
    sampleTranslationEn: 'Hello, welcome to the intelligent offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: true
  },
  // 65. Hungarian
  {
    id: 'hu',
    iso639_1: 'hu',
    iso639_3: 'hun',
    nameThai: 'ภาษาฮังการี',
    nameEnglish: 'Hungarian',
    nativeName: 'Magyar',
    family: 'Uralic (Finno-Ugric)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 13,
    regionOfOrigin: 'ฮังการี, ยุโรปกลาง',
    sampleSentence: 'Üdvözöljük az intelligens offline fordítási stúdióban.',
    sampleTranslationEn: 'Welcome to the intelligent offline translation studio.',
    sampleTranslationTh: 'ยินดีต้อนรับสู่สตูดิโอการแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 66. Ukrainian
  {
    id: 'uk',
    iso639_1: 'uk',
    iso639_3: 'ukr',
    nameThai: 'ภาษายูเครน',
    nameEnglish: 'Ukrainian',
    nativeName: 'Українська',
    family: 'Indo-European (Slavic)',
    script: 'Cyrillic',
    direction: 'ltr',
    speakersCountMillion: 40,
    regionOfOrigin: 'ยูเครน, ยุโรปตะวันออก',
    sampleSentence: 'Вітаємо, ласкаво просимо до інтелектуальної системи офлайн-перекладу.',
    sampleTranslationEn: 'Greetings, welcome to the intelligent offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 67. Hebrew
  {
    id: 'he',
    iso639_1: 'he',
    iso639_3: 'heb',
    nameThai: 'ภาษาฮีบรู',
    nameEnglish: 'Hebrew',
    nativeName: 'עברית',
    family: 'Afroasiatic (Semitic)',
    script: 'Hebrew',
    direction: 'rtl',
    speakersCountMillion: 10,
    regionOfOrigin: 'อิสราเอล',
    sampleSentence: 'שלום, ברוכים הבאים למערכת התרגום הלא-מקוונת החכמה.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 68. Danish
  {
    id: 'da',
    iso639_1: 'da',
    iso639_3: 'dan',
    nameThai: 'ภาษาเดนมาร์ก',
    nameEnglish: 'Danish',
    nativeName: 'Dansk',
    family: 'Indo-European (Germanic)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 6,
    regionOfOrigin: 'เดนมาร์ก, กรีนแลนด์',
    sampleSentence: 'Hej, velkommen til det intelligente offline oversættelsessystem.',
    sampleTranslationEn: 'Hello, welcome to the intelligent offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 69. Finnish
  {
    id: 'fi',
    iso639_1: 'fi',
    iso639_3: 'fin',
    nameThai: 'ภาษาฟินแลนด์',
    nameEnglish: 'Finnish',
    nativeName: 'Suomi',
    family: 'Uralic (Finno-Ugric)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 6,
    regionOfOrigin: 'ฟินแลนด์',
    sampleSentence: 'Hei, tervetuloa älykkääseen offline-käännösjärjestelmään.',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 70. Norwegian
  {
    id: 'no',
    iso639_1: 'no',
    iso639_3: 'nor',
    nameThai: 'ภาษานอร์เวย์ (บุ๊กมอล/นีนอสก์)',
    nameEnglish: 'Norwegian',
    nativeName: 'Norsk',
    family: 'Indo-European (Germanic)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 5.5,
    regionOfOrigin: 'นอร์เวย์',
    sampleSentence: 'Hei, velkommen til det intelligente offline oversettelsessystemet.',
    sampleTranslationEn: 'Hello, welcome to the intelligent offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาอัจฉริยะแบบออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: true
  },
  // 71. Kazakh
  {
    id: 'kk',
    iso639_1: 'kk',
    iso639_3: 'kaz',
    nameThai: 'ภาษาคาซัค',
    nameEnglish: 'Kazakh',
    nativeName: 'Қазақша / Qazaqsha',
    family: 'Turkic',
    script: 'Cyrillic',
    direction: 'ltr',
    speakersCountMillion: 15,
    regionOfOrigin: 'คาซัคสถาน, เอเชียกลาง',
    sampleSentence: 'Сәлеметсіз бе, зияткерлік офлайн аударма жүйесіне қош келдіңіз.',
    sampleTranslationEn: 'Hello, welcome to the intellectual offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบการแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 72. Swahili
  {
    id: 'sw',
    iso639_1: 'sw',
    iso639_3: 'swa',
    nameThai: 'ภาษาสวาฮีลี',
    nameEnglish: 'Swahili (Kiswahili)',
    nativeName: 'Kiswahili',
    family: 'Niger-Congo (Bantu)',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 16,
    regionOfOrigin: 'เคนยา, แทนซาเนีย, ยูกันดา, แอฟริกาตะวันออก',
    sampleSentence: 'Habari, karibu kwenye mfumo wa tafsiri wenye akili nje ya mtandao.',
    sampleTranslationEn: 'Hello, welcome to the intelligent offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 73. Bulgarian
  {
    id: 'bg',
    iso639_1: 'bg',
    iso639_3: 'bul',
    nameThai: 'ภาษาบัลแกเรีย',
    nameEnglish: 'Bulgarian',
    nativeName: 'Български',
    family: 'Indo-European (Slavic)',
    script: 'Cyrillic',
    direction: 'ltr',
    speakersCountMillion: 9,
    regionOfOrigin: 'บัลแกเรีย, ยุโรปตะวันออกเฉียงใต้',
    sampleSentence: 'Здравейте, добре дошли в интелигентната система за офлайн превод.',
    sampleTranslationEn: 'Hello, welcome to the intelligent offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบการแปลออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 74. Malay
  {
    id: 'ms',
    iso639_1: 'ms',
    iso639_3: 'msa',
    nameThai: 'ภาษามาเลย์ (มลายู)',
    nameEnglish: 'Malay (Bahasa Melayu)',
    nativeName: 'Bahasa Melayu',
    family: 'Austronesian',
    script: 'Latin',
    direction: 'ltr',
    speakersCountMillion: 33,
    regionOfOrigin: 'มาเลเซีย, บรูไน, สิงคโปร์, ไทยตอนใต้',
    sampleSentence: 'Selamat sejahtera, selamat datang ke sistem terjemahan pintar luar talian.',
    sampleTranslationEn: 'Greetings, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ขอต้อนรับสู่ระบบแปลภาษาอัจฉริยะออฟไลน์',
    hasSpaceDelimiter: true,
    tonal: false
  },
  // 75. Armenian
  {
    id: 'hy',
    iso639_1: 'hy',
    iso639_3: 'hye',
    nameThai: 'ภาษาอาร์เมเนีย',
    nameEnglish: 'Armenian',
    nativeName: 'Հայերեն',
    family: 'Indo-European (Armenian)',
    script: 'Armenian',
    direction: 'ltr',
    speakersCountMillion: 7,
    regionOfOrigin: 'อาร์เมเนีย, คอเคซัส',
    sampleSentence: 'Բարև ձեզ, բարի գալուստ խելացի օֆլայն թարգմանության համակարգ:',
    sampleTranslationEn: 'Hello, welcome to the smart offline translation system.',
    sampleTranslationTh: 'สวัสดี ยินดีต้อนรับสู่ระบบแปลภาษาออฟไลน์อัจฉริยะ',
    hasSpaceDelimiter: true,
    tonal: false
  }
];

/**
 * ดึงข้อมูลโปรไฟล์ภาษาตามรหัส ID
 */
export function getLanguageProfileById(id: string): GlobalLanguageProfile {
  const normalizedId = id.toLowerCase().trim();
  const found = GLOBAL_70_LANGUAGES.find(
    (l) => l.id.toLowerCase() === normalizedId || l.iso639_1 === normalizedId || l.iso639_3 === normalizedId
  );
  if (found) return found;

  // Default fallback to Thai or English
  return normalizedId.startsWith('th')
    ? GLOBAL_70_LANGUAGES[0]
    : GLOBAL_70_LANGUAGES[1];
}

/**
 * ฟังก์ชันระบุและตรวจจับภาษาต้นทางโดยอัตโนมัติ (Offline Language Identification / LID)
 * ใช้อักขระ Unicode block และตัวชี้วัดความถี่สัญลักษณ์
 */
export function detectLanguageFromText(text: string): GlobalLanguageProfile {
  if (!text || text.trim().length === 0) {
    return GLOBAL_70_LANGUAGES[0]; // Default Thai
  }

  // 1. ตรวจสอบอักษรไทย (U+0E00 - U+0E7F)
  if (/[\u0E00-\u0E7F]/.test(text)) {
    return getLanguageProfileById('th');
  }

  // 2. ตรวจสอบอักษรลาว (U+0E80 - U+0EFF)
  if (/[\u0E80-\u0EFF]/.test(text)) {
    return getLanguageProfileById('lo');
  }

  // 3. ตรวจสอบอักษรเขมร (U+1780 - U+17FF)
  if (/[\u1780-\u17FF]/.test(text)) {
    return getLanguageProfileById('km');
  }

  // 4. ตรวจสอบอักษรพม่า (U+1000 - U+109F)
  if (/[\u1000-\u109F]/.test(text)) {
    return getLanguageProfileById('my');
  }

  // 5. ตรวจสอบอักษรเกาหลี Hangul (U+AC00 - U+D7AF, U+1100 - U+11FF)
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(text)) {
    return getLanguageProfileById('ko');
  }

  // 6. ตรวจสอบอักษรญี่ปุ่น Kana (Hiragana/Katakana)
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
    return getLanguageProfileById('ja');
  }

  // 7. ตรวจสอบอักษรจีน Hanzi
  if (/[\u4E00-\u9FFF]/.test(text)) {
    // แยกตามตัวอักษรเฉพาะของกวางตุ้ง/ฮ่องกง หรือหมิ่นใต้
    if (/[嘅哋喺咗唔係點樣]/.test(text)) {
      return getLanguageProfileById('yue');
    }
    return getLanguageProfileById('zh');
  }

  // 8. ตรวจสอบอักษรอาหรับ/เปอร์เซีย/อูรดู (U+0600 - U+06FF)
  if (/[\u0600-\u06FF]/.test(text)) {
    if (/[پچژگ]/.test(text)) {
      return getLanguageProfileById('fa');
    }
    if (/[ٹڈڑںےہ]/.test(text)) {
      return getLanguageProfileById('ur');
    }
    return getLanguageProfileById('ar');
  }

  // 9. ตรวจสอบอักษรฮีบรู (U+0590 - U+05FF)
  if (/[\u0590-\u05FF]/.test(text)) {
    return getLanguageProfileById('he');
  }

  // 10. ตรวจสอบอักษรเทวนาครี Devanagari (Hindi, Marathi, Nepali, Bhojpuri, Maithili)
  if (/[\u0900-\u097F]/.test(text)) {
    if (/[\u0933]/.test(text)) {
      return getLanguageProfileById('mr'); // ळ พบมากในภาษามราฐี
    }
    return getLanguageProfileById('hi');
  }

  // 11. ตรวจสอบอักษรเบงกาลี (U+0980 - U+09FF)
  if (/[\u0980-\u09FF]/.test(text)) {
    return getLanguageProfileById('bn');
  }

  // 12. ตรวจสอบอักษร Gurmukhi (Punjabi) (U+0A00 - U+0A7F)
  if (/[\u0A00-\u0A7F]/.test(text)) {
    return getLanguageProfileById('pa');
  }

  // 13. ตรวจสอบอักษร Gujarati (U+0A80 - U+0AFF)
  if (/[\u0A80-\u0AFF]/.test(text)) {
    return getLanguageProfileById('gu');
  }

  // 14. ตรวจสอบอักษร Odia (U+0B00 - U+0B7F)
  if (/[\u0B00-\u0B7F]/.test(text)) {
    return getLanguageProfileById('or');
  }

  // 15. ตรวจสอบอักษร Tamil (U+0B80 - U+0BFF)
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return getLanguageProfileById('ta');
  }

  // 16. ตรวจสอบอักษร Telugu (U+0C00 - U+0C7F)
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return getLanguageProfileById('te');
  }

  // 17. ตรวจสอบอักษร Kannada (U+0C80 - U+0CFF)
  if (/[\u0C80-\u0CFF]/.test(text)) {
    return getLanguageProfileById('kn');
  }

  // 18. ตรวจสอบอักษร Malayalam (U+0D00 - U+0D7F)
  if (/[\u0D00-\u0D7F]/.test(text)) {
    return getLanguageProfileById('ml');
  }

  // 19. ตรวจสอบอักษร Sinhala (U+0D80 - U+0DFF)
  if (/[\u0D80-\u0DFF]/.test(text)) {
    return getLanguageProfileById('si');
  }

  // 20. ตรวจสอบอักษร Ge'ez (Amharic) (U+1200 - U+137F)
  if (/[\u1200-\u137F]/.test(text)) {
    return getLanguageProfileById('am');
  }

  // 21. ตรวจสอบอักษรกรีก (U+0370 - U+03FF)
  if (/[\u0370-\u03FF]/.test(text)) {
    return getLanguageProfileById('el');
  }

  // 22. ตรวจสอบอักษรซีริลลิก Cyrillic (Russian, Ukrainian, Bulgarian, Kazakh)
  if (/[\u0400-\u04FF]/.test(text)) {
    if (/[ієїґ]/.test(text)) {
      return getLanguageProfileById('uk');
    }
    if (/[әғқңөұүһі]/i.test(text)) {
      return getLanguageProfileById('kk');
    }
    return getLanguageProfileById('ru');
  }

  // 23. สำหรับอักษร Latin - ตรวจสอบตัวอักษรเฉพาะและคำสำคัญ
  const lower = text.toLowerCase();

  // เวียดนาม (Đ/đ, ơ, ư, dấu)
  if (/[đăâêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/.test(lower)) {
    return getLanguageProfileById('vi');
  }

  // ฝรั่งเศส (œ, ç, è, é, ê, où)
  if (/[œç]/.test(lower) || /\b(le|la|les|des|un|une|est|sont|dans|avec|pour|ce|cette)\b/.test(lower)) {
    return getLanguageProfileById('fr');
  }

  // เยอรมัน (ß, ä, ö, ü)
  if (/[ß]/.test(lower) || /\b(der|die|das|und|ist|nicht|ein|eine|mit|auf|für|zu|im)\b/.test(lower)) {
    return getLanguageProfileById('de');
  }

  // สเปน (ñ, ¿, ¡)
  if (/[ñ¿¡]/.test(lower) || /\b(el|la|los|las|un|una|es|son|en|con|por|para|que|del)\b/.test(lower)) {
    return getLanguageProfileById('es');
  }

  // โปรตุเกส (ã, õ, ç)
  if (/[ãõ]/.test(lower) || /\b(o|a|os|as|um|uma|é|são|em|com|para|que|não|do|da)\b/.test(lower)) {
    return getLanguageProfileById('pt');
  }

  // อิตาลี
  if (/\b(il|lo|la|i|gli|le|un|uno|una|è|sono|in|con|per|che|non|di|del)\b/.test(lower)) {
    return getLanguageProfileById('it');
  }

  // โปแลนด์ (ą, ę, ś, ć, ź, ż, ł, ń)
  if (/[ąćęłńóśźż]/.test(lower)) {
    return getLanguageProfileById('pl');
  }

  // ตุรกี (ğ, ı, ş)
  if (/[ğış]/.test(lower)) {
    return getLanguageProfileById('tr');
  }

  // สแกนดิเนเวีย (å, æ, ø, ö, ä)
  if (/[åæø]/.test(lower)) {
    return getLanguageProfileById('no');
  }
  if (/[äö]/.test(lower)) {
    return getLanguageProfileById('sv');
  }

  // อินโดนีเซีย / มาเลย์
  if (/\b(dan|yang|di|ini|itu|ke|dari|untuk|dengan|tidak|ada|saya|kamu)\b/.test(lower)) {
    return getLanguageProfileById('id');
  }

  // ฟิลิปปินส์ (Tagalog)
  if (/\b(ang|ng|mga|sa|si|sina|ay|na|ko|mo|niya|natin|ninyo|sila)\b/.test(lower)) {
    return getLanguageProfileById('tl');
  }

  // สวาฮีลี
  if (/\b(na|ya|wa|kwa|katika|ni|za|la|cha|vya|kwa|habari|asante)\b/.test(lower)) {
    return getLanguageProfileById('sw');
  }

  // ค่าปริยายเป็นอังกฤษ
  return getLanguageProfileById('en');
}
