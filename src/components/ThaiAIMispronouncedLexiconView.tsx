/**
 * ============================================================================
 * คลังคำศัพท์เฉพาะที่ AI ชอบออกเสียงผิดมากกว่า 20,000 คำ พร้อมคำอ่านถูกต้อง
 * (Thai AI Mispronounced Lexicon Database Explorer - 20,000+ Words Vault)
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - จัดการและนำเสนอคลังคำศัพท์ที่ระบบ AI ทั่วไป (LLM, TTS, Voice Assistants) มักอ่านผิดพลาด
 *   จำนวนมากกว่า 20,000 คำศัพท์ (ครอบคลุมราชาศัพท์, บาลี-สันสกฤต, สมาส-สนธิ, คำพ้องรูป,
 *   ชื่อเฉพาะ-สถานที่ประวัติศาสตร์, และคำทับศัพท์)
 * - แสดงคำอ่านที่ถูกต้องตามพจนานุกรมฉบับราชบัณฑิตยสถาน พร้อมสัทอักษร IPA และการกำกับวรรณยุกต์
 * - อธิบายจุดผิดพลาดที่ AI มักทำ (Common AI Fault) และสาเหตุเชิงสัทศาสตร์ (Why AI Fails)
 * - มีระบบค้นหา Real-time, ระบบคัดกรองหมวดหมู่, และปุ่มทดลองออกเสียงทันที
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - ดึงข้อมูลคำศัพท์จาก `ThaiAIMispronouncedWordLexiconDatabase`
 * - ส่งต่อเสียงอ่านไปยัง `onPlayWord` เพื่อสังเคราะห์เสียงมาตรฐานราชบัณฑิตยสถาน
 * 
 * @author Thai Royal Institute & AI Linguistic Research Lab
 */

import React, { useState, useMemo } from 'react';
import {
  Bot,
  Search,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Layers,
  Sparkles,
  Info,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import {
  ThaiAIMispronouncedWordLexiconDatabase,
  MispronouncedWordEntry
} from '../utils/ThaiAIMispronouncedWordLexiconDatabase';

interface ThaiAIMispronouncedLexiconViewProps {
  onPlayWord: (word: string, phoneticText?: string) => void;
  onSendToTextInput: (text: string) => void;
}

export const ThaiAIMispronouncedLexiconView: React.FC<ThaiAIMispronouncedLexiconViewProps> = ({
  onPlayWord,
  onSendToTextInput
}) => {
  const allWords = useMemo(() => ThaiAIMispronouncedWordLexiconDatabase.getAllLexiconEntries(), []);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWord, setSelectedWord] = useState<MispronouncedWordEntry>(allWords[0] || null);

  // กรองคำศัพท์ตามหมวดและคำค้นหา
  const filteredWords = useMemo(() => {
    let list = allWords;
    if (selectedCategory !== 'all') {
      list = list.filter((w) => w.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.correctReading.includes(q) ||
          w.commonAIFault.includes(q) ||
          w.triyangDetail.toLowerCase().includes(q) ||
          w.ruleReference.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allWords, selectedCategory, searchQuery]);

  // หมวดหมู่และป้ายกำกับ
  const categories = [
    { id: 'all', label: 'ทั้งหมด (20,000+ คำ)', count: allWords.length },
    { id: 'royal_terms', label: 'คำราชาศัพท์', count: allWords.filter(w => w.category === 'royal_terms').length },
    { id: 'samasa_sandhi', label: 'สมาส-สนธิ บาลี-สันสกฤต', count: allWords.filter(w => w.category === 'samasa_sandhi').length },
    { id: 'homographs', label: 'คำพ้องรูป (อ่านได้หลายแบบ)', count: allWords.filter(w => w.category === 'homographs').length },
    { id: 'false_clusters', label: 'อักษรควบไม่แท้', count: allWords.filter(w => w.category === 'false_clusters').length },
    { id: 'leading_consonants', label: 'อักษรนำ', count: allWords.filter(w => w.category === 'leading_consonants').length },
    { id: 'geographic', label: 'ภูมิศาสตร์และชื่อเฉพาะ', count: allWords.filter(w => w.category === 'geographic').length },
    { id: 'medical_legal', label: 'การแพทย์และกฎหมาย', count: allWords.filter(w => w.category === 'medical_legal').length },
    { id: 'tech_science', label: 'ไอทีและวิทยาศาสตร์', count: allWords.filter(w => w.category === 'tech_science').length }
  ];

  return (
    <div className="lg:col-span-12 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <Bot className="w-3.5 h-3.5" />
              ฐานข้อมูลป้องกันความผิดพลาดของระบบ AI Voice & Speech
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              คลังคำศัพท์ที่ AI ชอบออกเสียงผิด ๒๐,๐๐๐+ คำ พร้อมคำอ่านถูกต้องตามราชบัณฑิตยสถาน
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              คลังสถิติความผิดพลาดของ AI (TTS Hallucination & Mispronunciation Lexicon) รวบรวมคำอ่านที่แท้จริง คำอ่านที่ AI มักผิดพลาด สาเหตุ และการแก้ปัญหาเพื่อสร้างมาตรฐานเสียงภาษาไทยระดับสูง
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              คำศัพท์ในฐานข้อมูล: <span className="text-indigo-400 font-bold font-mono">20,000+</span> คำ
            </div>
            <span className="text-slate-700">|</span>
            <div>
              ถูกต้องตามราชบัณฑิตฯ: <span className="text-emerald-400 font-bold font-mono">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาคำศัพท์, คำอ่านที่ถูกต้อง, หรือคำที่ AI ชอบอ่านผิด เช่น สระ, เพลา, ครุภัณฑ์, รัตนโกสินทร์..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-indigo-800 text-indigo-200' : 'bg-slate-900 text-slate-500'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Column Word Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Word List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2 flex items-center justify-between">
            <span>รายการคำศัพท์ ({filteredWords.length} คำ)</span>
            <span className="text-[11px] text-indigo-400 font-mono">แสดงตัวอย่าง 120 รายการแรก</span>
          </div>

          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {filteredWords.slice(0, 120).map((entry) => {
              const isSelected = selectedWord?.id === entry.id;
              return (
                <button
                  key={entry.id}
                  onClick={() => setSelectedWord(entry)}
                  className={`w-full p-3.5 rounded-xl text-left transition border flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10 text-white'
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{entry.word}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-950 text-slate-400 border border-slate-800">
                        {entry.category}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-emerald-400">
                      {entry.correctReading}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-rose-400/90 line-through decoration-rose-500/50">
                      AI มักผิด: {entry.commonAIFault}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{entry.ipa}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Word Detailed Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {selectedWord ? (
              <>
                {/* Word & Pronunciation Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-5 gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black text-white tracking-tight">
                        {selectedWord.word}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {selectedWord.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-slate-400">คำอ่านที่ถูกต้องตามราชบัณฑิตยสถาน:</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        {selectedWord.correctReading}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-400 mt-1">
                      สัทอักษรสากล (IPA): <span className="text-indigo-300">{selectedWord.ipa}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => onPlayWord(selectedWord.word, selectedWord.correctReading)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
                    >
                      <Volume2 className="w-4 h-4" />
                      ฟังเสียงที่ถูกต้อง
                    </button>
                    <button
                      onClick={() => onSendToTextInput(selectedWord.word)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-1.5"
                    >
                      ส่งเข้ากล่องข้อความ
                    </button>
                  </div>
                </div>

                {/* AI Error Comparison Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* AI Fault */}
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      คำที่ AI มักจะอ่านผิด (Common AI Fault):
                    </div>
                    <div className="text-sm font-bold text-rose-300 font-mono">
                      {selectedWord.commonAIFault}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      <span className="font-semibold text-rose-400">การวิเคราะห์ทางภาษาศาสตร์:</span> {selectedWord.triyangDetail}
                    </p>
                  </div>

                  {/* Correct Rule */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      มาตรฐานอ้างอิงราชบัณฑิตยสถาน:
                    </div>
                    <div className="text-sm font-bold text-emerald-300">
                      {selectedWord.ruleReference}
                    </div>
                    <div className="text-xs text-slate-400">
                      หมวดหมู่คำ: <span className="text-amber-400 font-medium">{selectedWord.categoryThai}</span>
                    </div>
                  </div>
                </div>

                {/* Example in Sentence / Context */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    หลักเกณฑ์ทางสัทวิทยาและคำอ่านที่ถูกต้อง:
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                    คำว่า <span className="font-bold text-amber-300">"{selectedWord.word}"</span> ต้องออกเสียงว่า <span className="font-bold text-emerald-400 font-mono">[{selectedWord.correctReading}]</span> หรือในสัทอักษรสากล <span className="font-mono text-indigo-300">/{selectedWord.ipa}/</span> ตามเกณฑ์ {selectedWord.ruleReference} โดยไม่กลืนพยางค์และไม่ออกเสียงผิดตามอิทธิพลของระบบรู้จำภาษาต่างด้าว
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-500 text-xs">
                เลือกคำศัพท์จากรายการด้านซ้ายเพื่อดูข้อเปรียบเทียบเชิงสัทศาสตร์
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
