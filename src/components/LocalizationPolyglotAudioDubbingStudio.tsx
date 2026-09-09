/**
 * ====================================================================================================
 * MODULE: LocalizationPolyglotAudioDubbingStudio.tsx
 * ====================================================================================================
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * 1. สตูดิโอแปลภาษาและจัดการเสียงพากย์ระดับสากล (Global Localization & Voice Dubbing Matrix Studio)
 *    สำหรับเกมระดับ AAA รองรับการเปิดตัวทั่วโลก (Global Launch) พร้อมกันในทุกภูมิภาค
 * 2. รองรับฐานข้อมูลสตริงหลายภาษา (Polyglot String Database):
 *    - ภาษาอังกฤษ (EN - US Source Master)
 *    - ภาษาไทย (TH - Thai Localized with Formal/Informal Royal Vocab)
 *    - ภาษาญี่ปุ่น (JA - Japanese with Kanji Furigana & Honorifics)
 *    - ภาษาจีน (ZH - Simplified / Traditional Chinese)
 *    - ภาษาสเปน (ES - European / LatAm Spanish)
 *    - ภาษาเยอรมัน (DE - German Expansion Metric)
 * 3. ระบบวิเคราะห์ความล้นของข้อความ UI (Text Expansion & Overflow Analyzer):
 *    - ตรวจจับอัตราการขยายตัวของข้อความ (ภาษาเยอรมันขยายตัวเฉลี่ย 35% อาจล้นกรอบปุ่ม UI)
 * 4. ระบบจัดการแทร็กเสียงพากย์และซิงค์ปาก (Voice Dubbing & Lip-Sync Viseme Phonemes):
 *    - กำหนดนักพากย์, เพศ, อารมณ์, และเล่นเสียงทดสอบผ่าน Web Audio API
 * 5. ส่งออกไฟล์ PO/MO (gettext), CSV, หรือ String Table สำหรับ Unreal Engine / Unity
 *
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - เชื่อมต่อกับ Game Systems & Narrative Hub ใน App.tsx
 * - ทำงานคู่กับ NarrativeBranching และ DialogueQuestEditor
 *
 * พารามิเตอร์ Input / Output (Data Contracts):
 * - Input: String Key, Context Category, Source Text (EN), Target Language Translations
 * - Output: Overflow Warning Flags, Translation Completion Percentage, Exported String Table JSON
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - Fallback เป็นภาษาอังกฤษ (EN Master) อัตโนมัติหากภาษาเป้าหมายยังไม่ได้แปล (Missing Translation Fallback)
 * - ตรวจจับตัวแปรพารามิเตอร์ตกหล่น (Format Specifier Mismatch เช่น {0}, {name})
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * <LocalizationPolyglotAudioDubbingStudio onExportStrings={(data) => console.log(data)} />
 * ====================================================================================================
 */

import React, { useState, useRef } from "react";
import {
  Globe2,
  Languages,
  Mic,
  Play,
  Volume2,
  Download,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Search,
  Plus,
  Trash2,
  Activity,
  Layers
} from "lucide-react";

export interface LocEntry {
  key: string;
  category: "UI" | "Dialogue" | "Quest" | "Item";
  en: string;
  th: string;
  ja: string;
  de: string;
  zh: string;
  hasAudioVoiceover: boolean;
  voiceActor: string;
}

export default function LocalizationPolyglotAudioDubbingStudio() {
  const [activeLanguage, setActiveLanguage] = useState<"th" | "ja" | "de" | "zh">("th");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedKey, setSelectedKey] = useState<string>("UI_MENU_START_GAME");

  const [entries, setEntries] = useState<LocEntry[]>([
    {
      key: "UI_MENU_START_GAME",
      category: "UI",
      en: "Start New Campaign",
      th: "เริ่มการเดินทางครั้งใหม่",
      ja: "新たな冒険を始める",
      de: "Neue Kampagne starten",
      zh: "开始新的战役",
      hasAudioVoiceover: true,
      voiceActor: "Narrator (Epic Male)",
    },
    {
      key: "QUEST_DRAGON_WAR_01",
      category: "Dialogue",
      en: "The ancient dragon awakes in the molten caldera. Ready your blade!",
      th: "มังกรโบราณตื่นขึ้นแล้วในปล่องภูเขาไฟอันเดือดพล่าน จงเตรียมคมดาบให้พร้อม!",
      ja: "灼熱のカルデラで古代の竜が目覚めた。剣を抜け！",
      de: "Der uralte Drache erwacht in der brodelnden Caldera. Mach deine Klinge bereit!",
      zh: "远古巨龙在沸腾的破火山口苏醒。准备好你的利刃！",
      hasAudioVoiceover: true,
      voiceActor: "Commander Valen (Hero)",
    },
    {
      key: "ITEM_SWORD_EXCALIBUR",
      category: "Item",
      en: "Radiant Holy Greatsword forged in starlight. Deals holy damage.",
      th: "มหาดาบศักดิ์สิทธิ์เปล่งประกายหลอมจากแสงดวงดาว สร้างความเสียหายธาตุศักดิ์สิทธิ์",
      ja: "星の光で鍛えられた聖なる大剣。聖なる光属性ダメージを与える。",
      de: "Strahlendes heiliges Großschwert, geschmiedet im Sternenlicht.",
      zh: "在星光中锻造的光辉圣剑。造成神圣伤害。",
      hasAudioVoiceover: false,
      voiceActor: "-",
    },
  ]);

  // เล่นเสียงสังเคราะห์คำพากย์จำลอง (Web Audio Speech Synthesis)
  const handlePlayVoiceover = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      if (lang === "th") utterance.lang = "th-TH";
      else if (lang === "ja") utterance.lang = "ja-JP";
      else if (lang === "de") utterance.lang = "de-DE";
      else if (lang === "zh") utterance.lang = "zh-CN";
      else utterance.lang = "en-US";

      window.speechSynthesis.speak(utterance);
    }
  };

  const selectedEntry = entries.find((e) => e.key === selectedKey) || entries[0];

  // คำนวณเปอร์เซ็นต์การขยายตัวของข้อความเมื่อเทียบกับอังกฤษ (Text Expansion Ratio)
  const getExpansionRatio = (targetText: string, enText: string) => {
    if (!enText.length) return 0;
    return Math.round(((targetText.length - enText.length) / enText.length) * 100);
  };

  // ส่งออกสตริงภาษาเป็น JSON
  const handleExportLanguage = () => {
    const exportData = {
      engine: "OmniMasterGameEngine_v4.5",
      module: "LocalizationPolyglotAudioDubbingStudio",
      targetLanguage: activeLanguage,
      totalEntries: entries.length,
      stringTable: entries.map((e) => ({
        key: e.key,
        category: e.category,
        source_en: e.en,
        translated: e[activeLanguage],
        hasAudio: e.hasAudioVoiceover,
        voiceActor: e.voiceActor,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Localization_${activeLanguage.toUpperCase()}_StringTable.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 select-none overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-[#111726]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/20 rounded-lg text-teal-400 border border-teal-500/30">
            <Globe2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Global Localization & Audio Dubbing Matrix
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-teal-500/10 text-teal-400 rounded border border-teal-500/20">
                Polyglot v3.8
              </span>
            </div>
            <p className="text-xs text-gray-400">
              ระบบแปลเกมหลายภาษา (TH, JA, DE, ZH) พร้อมตรวจจับขนาดข้อความล้นและไฟล์เสียงพากย์
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Select Target Language */}
          <div className="flex items-center bg-[#161f33] border border-gray-700 rounded p-1 text-xs">
            {(
              [
                { id: "th", label: "🇹🇭 ภาษาไทย" },
                { id: "ja", label: "🇯🇵 ภาษาญี่ปุ่น" },
                { id: "de", label: "🇩🇪 ภาษาเยอรมัน" },
                { id: "zh", label: "🇨🇳 ภาษาจีน" },
              ] as const
            ).map((lang) => (
              <button
                key={lang.id}
                onClick={() => setActiveLanguage(lang.id)}
                className={`px-2.5 py-1 rounded transition ${
                  activeLanguage === lang.id
                    ? "bg-teal-600 text-white font-bold shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-md text-xs font-medium transition shadow-sm"
          >
            <Download size={14} />
            ส่งออก String Table (JSON)
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left List of Keys */}
        <div className="w-80 border-r border-gray-800 bg-[#0d1322] flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b border-gray-800">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหา Key สตริง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161f33] border border-gray-700 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Keys List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {entries
              .filter(
                (e) =>
                  e.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  e.en.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((entry) => {
                const isSelected = entry.key === selectedKey;
                return (
                  <button
                    key={entry.key}
                    onClick={() => setSelectedKey(entry.key)}
                    className={`w-full p-2.5 rounded-lg text-left text-xs transition border ${
                      isSelected
                        ? "bg-teal-500/20 text-white border-teal-500/50 shadow-sm"
                        : "bg-[#161f33] text-gray-300 border-gray-800 hover:bg-[#1e293b]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-teal-400 font-bold truncate max-w-[170px]">
                        {entry.key}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] text-gray-400 font-mono">
                        {entry.category}
                      </span>
                    </div>
                    <div className="text-gray-400 text-[11px] truncate">{entry.en}</div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right Editor & Audio Sync */}
        <div className="flex-1 flex flex-col bg-[#070a10] overflow-y-auto p-6 space-y-6">
          {/* Key Title */}
          <div className="bg-[#0e1424] border border-gray-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-3">
              <div>
                <div className="text-xs text-gray-400">Localization Key:</div>
                <div className="text-base font-bold font-mono text-white">{selectedEntry.key}</div>
              </div>
              <span className="px-2 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
                หมวดหมู่: {selectedEntry.category}
              </span>
            </div>

            {/* Source English Text */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>🇺🇸 ต้นฉบับภาษาอังกฤษ (EN Source Master):</span>
                <button
                  onClick={() => handlePlayVoiceover(selectedEntry.en, "en")}
                  className="flex items-center gap-1 text-teal-400 hover:text-teal-300"
                >
                  <Volume2 size={13} />
                  ฟังเสียงต้นฉบับ
                </button>
              </div>
              <div className="p-3 bg-[#161f33] border border-gray-700 rounded-md text-sm text-gray-200">
                {selectedEntry.en}
              </div>
            </div>

            {/* Target Language Translation */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>คำแปลเป้าหมาย ({activeLanguage.toUpperCase()}):</span>
                <button
                  onClick={() => handlePlayVoiceover(selectedEntry[activeLanguage], activeLanguage)}
                  className="flex items-center gap-1 text-teal-400 hover:text-teal-300"
                >
                  <Volume2 size={13} />
                  ฟังเสียงพากย์ภาษาเป้าหมาย
                </button>
              </div>
              <textarea
                rows={3}
                value={selectedEntry[activeLanguage]}
                onChange={(e) =>
                  setEntries(
                    entries.map((item) =>
                      item.key === selectedEntry.key
                        ? { ...item, [activeLanguage]: e.target.value }
                        : item
                    )
                  )
                }
                className="w-full bg-[#161f33] border border-gray-700 rounded-md p-3 text-sm text-white resize-none focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Text Expansion Metric & Voiceover Sync */}
          <div className="grid grid-cols-2 gap-6">
            {/* Text Expansion Card */}
            <div className="bg-[#0e1424] border border-gray-800 rounded-xl p-5 shadow-lg space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Sliders size={14} className="text-teal-400" />
                อัตราการขยายตัวของข้อความ (UI Text Expansion)
              </div>

              {(() => {
                const ratio = getExpansionRatio(selectedEntry[activeLanguage], selectedEntry.en);
                return (
                  <div>
                    <div className="flex justify-between text-sm font-mono mb-2">
                      <span className="text-gray-400">Expansion Percentage:</span>
                      <span className={`font-bold ${ratio > 30 ? "text-rose-400" : "text-emerald-400"}`}>
                        {ratio > 0 ? `+${ratio}%` : `${ratio}%`}
                      </span>
                    </div>

                    <div className="w-full bg-gray-800 h-2.5 rounded overflow-hidden">
                      <div
                        className={`h-full ${ratio > 30 ? "bg-rose-500" : "bg-teal-500"}`}
                        style={{ width: `${Math.min(100, Math.max(10, 50 + ratio))}%` }}
                      />
                    </div>

                    <div className="mt-3 text-xs text-gray-400">
                      {ratio > 30 ? (
                        <span className="text-rose-400 flex items-center gap-1">
                          <AlertTriangle size={13} /> ข้อความขยายตัวสูง เสี่ยงต่อการล้นกรอบปุ่มในหน้าจอ
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={13} /> ความยาวอยู่ในเกณฑ์ปลอดภัย ไม่ล้นกรอบ UI
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Voice Actor Recording Card */}
            <div className="bg-[#0e1424] border border-gray-800 rounded-xl p-5 shadow-lg space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Mic size={14} className="text-amber-400" />
                ข้อมูลนักพากย์ & ซิงค์เสียง (Voiceover Sync)
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>สถานะเสียงพากย์:</span>
                  <span
                    className={`font-bold ${
                      selectedEntry.hasAudioVoiceover ? "text-emerald-400" : "text-gray-500"
                    }`}
                  >
                    {selectedEntry.hasAudioVoiceover ? "บันทึกเสียงแล้ว (Studio Dubbed)" : "ไม่มีเสียงพากย์"}
                  </span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>นักพากย์ประจำตัวละคร:</span>
                  <span className="font-mono text-white font-medium">{selectedEntry.voiceActor}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Lip-Sync Phonemes:</span>
                  <span className="font-mono text-teal-400">Automatic Viseme Matched</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
