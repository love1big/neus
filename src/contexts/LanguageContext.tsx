import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LanguageCode = 
  | 'en' | 'th' | 'ja' | 'zh' | 'ko' | 'es' | 'fr' | 'de' | 'it' | 'pt' 
  | 'ru' | 'ar' | 'hi' | 'tr' | 'vi' | 'id' | 'ms' | 'fi' | 'sv' | 'no' 
  | 'da' | 'nl' | 'pl' | 'uk' | 'cs' | 'hu' | 'ro' | 'el' | 'he' | 'tl' 
  | 'sw';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  langName: string;
  t: (key: string) => string;
}

export const languages: { code: LanguageCode, name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'th', name: 'ภาษาไทย (Thai)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'ko', name: '한국어 (Korean)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'it', name: 'Italiano (Italian)' },
  { code: 'pt', name: 'Português (Portuguese)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'tr', name: 'Türkçe (Turkish)' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'fi', name: 'Suomi (Finnish)' },
  { code: 'sv', name: 'Svenska (Swedish)' },
  { code: 'no', name: 'Norsk (Norwegian)' },
  { code: 'da', name: 'Dansk (Danish)' },
  { code: 'nl', name: 'Nederlands (Dutch)' },
  { code: 'pl', name: 'Polski (Polish)' },
  { code: 'uk', name: 'Українська (Ukrainian)' },
  { code: 'cs', name: 'Čeština (Czech)' },
  { code: 'hu', name: 'Magyar (Hungarian)' },
  { code: 'ro', name: 'Română (Romanian)' },
  { code: 'el', name: 'Ελληνικά (Greek)' },
  { code: 'he', name: 'עברית (Hebrew)' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'sw', name: 'Kiswahili (Swahili)' }
];

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    'app.title': 'NexusEngine Sandbox',
    'sidebar.explorer': 'EXPLORER',
    'sidebar.search': 'SEARCH',
    'sidebar.outline': 'OUTLINE',
    'chat.placeholder': 'Ask AI for debugging or code fixes...',
    'chat.think_normal': 'Normal',
    'chat.think_think': 'Think',
    'chat.think_deep': 'Deep Think',
    'settings.title': 'Settings',
    'settings.language': 'Display Language',
    'settings.chatLanguage': 'Chat Language',
    'settings.theme': 'Theme',
    'settings.swarm': 'Swarm Compute',
  },
  th: {
    'app.title': 'เน็กซัสเอนจิน แซนด์บ็อกซ์',
    'sidebar.explorer': 'จัดการไฟล์',
    'sidebar.search': 'ค้นหา',
    'sidebar.outline': 'โครงสร้าง',
    'chat.placeholder': 'ถาม AI เพื่อดีบักและแก้โค้ด...',
    'chat.think_normal': 'ปกติ (Normal)',
    'chat.think_think': 'คิด (Think)',
    'chat.think_deep': 'คิดให้ลึก (Deep Think)',
    'settings.title': 'การตั้งค่า',
    'settings.language': 'ภาษาของโปรแกรม',
    'settings.chatLanguage': 'ภาษาแชทหลัก',
    'settings.theme': 'ธีม',
    'settings.swarm': 'เครือข่ายประมวลผล',
  },
  ja: {
    'app.title': 'ネクサスエンジンサンドボックス',
    'sidebar.explorer': 'エクスプローラー',
    'sidebar.search': '検索',
    'sidebar.outline': 'アウトライン',
    'chat.placeholder': 'AIにデバッグやコードの修正を依頼する...',
    'chat.think_normal': '通常 (Normal)',
    'chat.think_think': '考える (Think)',
    'chat.think_deep': '深く考える (Deep Think)',
    'settings.title': '設定',
    'settings.language': '表示言語',
    'settings.chatLanguage': 'チャット言語',
    'settings.theme': 'テーマ',
    'settings.swarm': 'スウォームコンピューティング',
  },
  zh: {
    'app.title': 'NexusEngine 沙盒',
    'sidebar.explorer': '资源管理器',
    'sidebar.search': '搜索',
    'sidebar.outline': '大纲',
    'chat.placeholder': '向 AI 询问调试或代码修复...',
    'chat.think_normal': '正常',
    'chat.think_think': '思考',
    'chat.think_deep': '深度思考',
    'settings.title': '设置',
    'settings.language': '显示语言',
    'settings.chatLanguage': '聊天语言',
    'settings.theme': '主题',
    'settings.swarm': '网格计算 (Swarm)',
  },
  ko: { 'app.title': 'NexusEngine 샌드박스', 'sidebar.explorer': '탐색기' }, // etc...
  es: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'EXPLORADOR' },
  fr: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'EXPLORATEUR' },
  de: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'EXPLORER' },
  it: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'ESPLORA' },
  pt: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'EXPLORADOR' },
  ru: { 'app.title': 'NexusEngine Песочница', 'sidebar.explorer': 'ПРОВОДНИК' },
  ar: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'مستكشف' },
  hi: { 'app.title': 'NexusEngine सैंडबॉक्स', 'sidebar.explorer': 'एक्सप्लोरर' },
  tr: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'GEZGİN' },
  vi: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'TRÌNH KHÁM PHÁ' },
  id: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'PENJELAJAH' },
  ms: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'PENEROKA' },
  fi: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'RESURSSIENSelain' },
  sv: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'UTFORSKAREN' },
  no: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'UTFORSKER' },
  da: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'STIFINDER' },
  nl: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'VERKENNER' },
  pl: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'EKSPLORATOR' },
  uk: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'ПРОВІДНИК' },
  cs: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'PRŮZKUMNÍK' },
  hu: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'INTÉZŐ' },
  ro: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'EXPLORATOR' },
  el: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'ΕΞΕΡΕΥΝΗΣΗ' },
  he: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'סייר' },
  tl: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'EXPLORER' },
  sw: { 'app.title': 'NexusEngine Sandbox', 'sidebar.explorer': 'KIGUNDUZI' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: string): string => {
    // If not found in current lang, fallback to english, if not found then return key
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const langName = languages.find(l => l.code === language)?.name || 'English';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, langName, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
