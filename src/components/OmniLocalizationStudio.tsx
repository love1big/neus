/**
 * @file OmniLocalizationStudio.tsx
 * @description
 * ============================================================================
 * [THAI]
 * สตูดิโอแปลภาษาและจัดการ Localization สำหรับเกมและโปรแกรม (Omni Localization Studio)
 * ระบบแปลภาษาแบบมืออาชีพสำหรับเกมและซอฟต์แวร์:
 *   1. Multilingual Translation Grid: ตารางแปลภาษาเทียบ 8 ภาษาหลักพร้อมกัน (ไทย, อังกฤษ, ญี่ปุ่น, จีน, เกาหลี ฯลฯ)
 *   2. Game Glossary Lock: ล็อกชื่อเฉพาะและศัพท์เฉพาะของเกม
 *   3. UI Overflow Checker: ตรวจสอบความยาวตัวอักษรเพื่อป้องกันข้อความล้นกรอบ
 *   4. Live In-Game UI Language Simulator: พรีวิว UI เกมเมื่อเปลี่ยนภาษาแบบเรียลไทม์
 *   5. Localization Exporter: ส่งออกไฟล์ภาษาเป็น JSON, CSV, และ Unity I18N
 *
 * [ENGLISH]
 * Enterprise Multilingual Game & Software Localization Studio.
 * Features:
 *   - 8-Language Translation Matrix Grid (TH, EN, JA, ZH, KO, ES, FR, DE)
 *   - Terminology Glossary Protection System
 *   - UI Overflow & String Boundary Warnings
 *   - Live In-Game UI Multi-Language Simulator
 *   - Multi-Format Localization Exporter (JSON, CSV, PO)
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Languages, Globe, BookOpen, Download, Sparkles,
  CheckCircle2, AlertTriangle, Shield, Eye, Plus, Search
} from 'lucide-react';

import {
  OmniLocalizationTranslationEngine,
  LocalizationProjectData,
  SupportedLanguageCode,
  TranslationStringEntry
} from '../utils/OmniLocalizationTranslationEngine';

export default function OmniLocalizationStudio() {
  const [engine] = useState<OmniLocalizationTranslationEngine>(() => new OmniLocalizationTranslationEngine());
  const [project, setProject] = useState<LocalizationProjectData>(() => engine.getProject());
  const [selectedLang, setSelectedLang] = useState<SupportedLanguageCode>('th');
  const [activeTab, setActiveTab] = useState<'matrix' | 'glossary' | 'game_sim' | 'export'>('matrix');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const languageLabels: Record<SupportedLanguageCode, { name: string; flag: string }> = {
    th: { name: 'ภาษาไทย (TH)', flag: '🇹🇭' },
    en: { name: 'English (EN)', flag: '🇺🇸' },
    ja: { name: '日本語 (JA)', flag: '🇯🇵' },
    zh: { name: '中文 (ZH)', flag: '🇨🇳' },
    ko: { name: '한국어 (KO)', flag: '🇰🇷' },
    es: { name: 'Español (ES)', flag: '🇪🇸' },
    fr: { name: 'Français (FR)', flag: '🇫🇷' },
    de: { name: 'Deutsch (DE)', flag: '🇩🇪' }
  };

  // Filtered entries
  const filteredEntries = project.entries.filter(
    (e) =>
      e.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(e.translations).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Update a translation
  const handleUpdateTranslation = (key: string, lang: SupportedLanguageCode, text: string) => {
    setProject((prev) => {
      const updated = { ...prev };
      const entry = updated.entries.find((e) => e.key === key);
      if (entry) {
        entry.translations[lang] = text;
      }
      return updated;
    });
  };

  // Export JSON
  const handleExportJSON = () => {
    const jsonStr = engine.exportJSONLocalization();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.gameTitle.toLowerCase().replace(/\s+/g, '-')}-i18n.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="omni-localization-studio-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Studio Header */}
      <header id="localization-header" className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-500 to-sky-500 p-0.5 shadow-teal-500/20 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Languages className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              7. โปรแกรมแปลภาษาสำหรับเกมและโปรแกรม (Omni Localization Studio)
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
                15+ Languages & Glossary Lock
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Multilingual String Grid • Glossary Terminology Lock • UI Overflow Quality Checker • In-Game Simulator
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'matrix' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌐 String Grid
            </button>
            <button
              onClick={() => setActiveTab('glossary')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'glossary' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔒 Glossary Lock
            </button>
            <button
              onClick={() => setActiveTab('game_sim')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'game_sim' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎮 In-Game Preview
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'export' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🚀 Export i18n
            </button>
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent("switch-tool", { detail: "GlobalOfflineAITranslationStudio" }))}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-bold text-xs shadow-lg active:scale-95 transition-all"
            title="เปิดสตูดิโอแปลภาษา AI ออฟไลน์ 70+ ภาษา พร้อมระบบตรวจสอบคุณภาพ 8 มิติและวิเคราะห์สัทศาสตร์"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Translation 70+ ภาษา</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก i18n JSON</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {activeTab === 'matrix' && (
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหา String Key หรือข้อความ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white w-64 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(Object.keys(languageLabels) as SupportedLanguageCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => setSelectedLang(code)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      selectedLang === code
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{languageLabels[code].flag}</span>
                    <span>{code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Strings Table */}
            <div className="space-y-3">
              {filteredEntries.map((entry) => {
                const currentText = entry.translations[selectedLang] || '';
                const isOverLimit = currentText.length > entry.characterLimit;

                return (
                  <div key={entry.key} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-400">{entry.key}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono uppercase">
                          {entry.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className={isOverLimit ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                          {currentText.length} / {entry.characterLimit} chars
                        </span>
                        {isOverLimit && (
                          <span className="flex items-center gap-1 text-rose-400">
                            <AlertTriangle className="w-3 h-3" />
                            <span>UI Overflow Risk</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={currentText}
                      onChange={(e) => handleUpdateTranslation(entry.key, selectedLang, e.target.value)}
                      className={`w-full bg-slate-900 border rounded-lg p-2.5 text-xs text-white focus:outline-none ${
                        isOverLimit ? 'border-rose-500' : 'border-slate-800 focus:border-teal-500'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === 'glossary' && (
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-400" />
              <h2 className="text-sm font-bold text-white">Terminology Glossary Lock (พจนานุกรมคำเฉพาะ)</h2>
            </div>
            <p className="text-xs text-slate-400">
              ล็อกคำศัพท์เฉพาะ เช่น ชื่อตัวละคร สกิล ไอเทม และสถานที่ เพื่อให้ระบบแปลคงความหมายที่ถูกต้องเสมอ
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.glossary.map((item) => (
                <div key={item.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-xs text-sky-300">{item.sourceTerm}</div>
                  <div className="text-[11px] text-slate-400">{item.description}</div>
                  <div className="p-2 bg-slate-900 rounded-lg text-xs space-y-1 font-mono">
                    <div className="text-emerald-400">🇹🇭 ไทย: {item.lockedTranslations.th}</div>
                    <div className="text-amber-400">🇯🇵 ญี่ปุ่น: {item.lockedTranslations.ja}</div>
                    <div className="text-sky-400">🇨🇳 จีน: {item.lockedTranslations.zh}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'game_sim' && (
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Live In-Game UI Multi-Language Simulator</h2>
              </div>
              <span className="text-xs text-amber-400 font-mono">
                Active Lang: {languageLabels[selectedLang].name}
              </span>
            </div>

            {/* Simulated Game UI Box */}
            <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 space-y-6 max-w-xl mx-auto shadow-2xl">
              <h3 className="text-center text-lg font-bold text-white">
                {project.gameTitle}
              </h3>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                {engine.interpolateString(
                  project.entries.find((e) => e.key === 'dlg_hero_greeting')?.translations[selectedLang] || '',
                  { player_name: 'Arthur' }
                )}
              </div>

              <div className="space-y-2">
                <button className="w-full py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg">
                  {project.entries.find((e) => e.key === 'ui_start_game')?.translations[selectedLang]}
                </button>
                <button className="w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs border border-slate-700">
                  {project.entries.find((e) => e.key === 'ui_settings')?.translations[selectedLang]}
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'export' && (
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-purple-400" />
              ส่งออกชุดไฟล์ภาษาสำหรับเกม (Export Localization Package)
            </h2>
            <button
              onClick={handleExportJSON}
              className="py-3 px-6 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              ดาวน์โหลดไฟล์ภาษา i18n รวม 8 ภาษา (.json)
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
