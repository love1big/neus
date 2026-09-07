/**
 * ============================================================================
 * ระบบแสดงหลักการออกเสียงภาษาไทยทั้งหมดอย่างละเอียดขั้นสุด (Enterprise Phonetic Rules)
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - จัดการและแสดงผลหลักการออกเสียงของภาษาไทยทั้งหมดอย่างละเอียด ครอบคลุม:
 *   1. ไตรยางศ์และกฎการผันวรรณยุกต์ 5 เสียง (Triyang & Tone Rules)
 *   2. อักษรควบแท้ และอักษรควบไม่แท้ (True & False Consonant Clusters)
 *   3. อักษรนำ (ห นำ, อ นำ ย, และอักษรนำ ๒ พยางค์เสียงสระอะกึ่งมาตรา)
 *   4. คำสมาส-คำสนธิ (การเชื่อมเสียงสระระหว่างคำบาลี-สันสกฤต)
 *   5. ทัณฑฆาตและการันต์ (การไม่ออกเสียงตัวสะกดที่มีเครื่องหมายทัณฑฆาต)
 *   6. สระสั้น-สระยาว และมาตราตัวสะกด ๘ แม่ (คำเป็น-คำตาย)
 * - มีระบบค้นหาหลักการ, รายการตัวอย่างคำศัพท์พร้อมคำอ่านสัทอักษร IPA,
 *   คุณสมบัติทางอะคูสติก (Acoustic Formant Features), และปุ่มทดลองฟังเสียงอ่านทันที
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - เชื่อมโยงกับ `ThaiComprehensivePhoneticRulesEngine`
 * - ส่งต่อเสียงอ่านคำตัวอย่างไปยัง `onPlayWord`
 * 
 * @author Thai Royal Institute Linguistic & Speech Directorate
 */

import React, { useState } from 'react';
import {
  Volume2,
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bookmark,
  Layers,
  Info,
  HelpCircle,
  Activity
} from 'lucide-react';
import {
  ThaiComprehensivePhoneticRulesEngine,
  PronunciationRulePrinciple
} from '../utils/ThaiComprehensivePhoneticRulesEngine';

interface ThaiPhoneticRulesViewProps {
  onPlayWord: (word: string, phoneticText?: string) => void;
  onSendToTextInput: (text: string) => void;
}

export const ThaiPhoneticRulesView: React.FC<ThaiPhoneticRulesViewProps> = ({
  onPlayWord,
  onSendToTextInput
}) => {
  const principles = ThaiComprehensivePhoneticRulesEngine.ALL_PRONUNCIATION_PRINCIPLES;
  const [selectedPrinciple, setSelectedPrinciple] = useState<PronunciationRulePrinciple>(principles[0]);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // กรองหลักการตามคำค้นหา
  const filteredPrinciples = principles.filter((p) => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return true;
    return (
      p.titleThai.toLowerCase().includes(q) ||
      p.titleEnglish.toLowerCase().includes(q) ||
      p.summaryThai.toLowerCase().includes(q) ||
      p.detailedExplanation.toLowerCase().includes(q) ||
      p.examples.some((ex) => ex.word.includes(q) || ex.reading.includes(q))
    );
  });

  return (
    <div className="lg:col-span-12 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              มาตรฐานราชบัณฑิตยสถานและสัทศาสตร์ภาษาไทยระดับสูง
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              สารบบหลักการออกเสียงภาษาไทยทั้งหมด (Comprehensive Thai Phonetics Rules Engine)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              รวบรวมหลักการออกเสียงตามเกณฑ์มาตรฐานพจนานุกรมฉบับราชบัณฑิตยสถาน กฎไตรยางศ์ การผันวรรณยุกต์ อักษรควบ อักษรนำ คำสมาส-สนธิ และทัณฑฆาต พร้อมการวิเคราะห์คลื่นเสียง (Acoustics)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              หมวดหมู่หลัก: <span className="text-amber-400 font-bold font-mono">{principles.length}</span> หมวด
            </div>
            <span className="text-slate-700">|</span>
            <div>
              ครอบคลุม: <span className="text-emerald-400 font-bold">100% กฎสัทศาสตร์</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="ค้นหากฎเกณฑ์การออกเสียง เช่น อักษรควบ, อักษรนำ, สมาส, ไตรยางศ์, ทร ออกเสียง ซ..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Main Grid: Left Nav, Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Principle List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
            รายการหลักการออกเสียง ({filteredPrinciples.length} หมวด)
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredPrinciples.map((principle) => {
              const isSelected = selectedPrinciple.id === principle.id;
              return (
                <button
                  key={principle.id}
                  onClick={() => setSelectedPrinciple(principle)}
                  className={`w-full p-3.5 rounded-xl text-left transition border flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-amber-500 shadow-md shadow-amber-500/10 text-white'
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{principle.titleThai}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-950 text-slate-500'
                      }`}
                    >
                      {principle.examples.length} ตัวอย่าง
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{principle.titleEnglish}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Principle Detail & Rules */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Header info */}
            <div className="border-b border-slate-800 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-amber-400" />
                    {selectedPrinciple.titleThai}
                  </h3>
                  <div className="text-xs text-amber-400/90 font-medium mt-0.5 font-mono">
                    {selectedPrinciple.titleEnglish}
                  </div>
                </div>

                <div className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  หมวด: {selectedPrinciple.category}
                </div>
              </div>

              {/* Summary */}
              <div className="text-xs text-slate-300 leading-relaxed mt-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                <span className="font-semibold text-amber-400">สาระสำคัญ:</span> {selectedPrinciple.summaryThai}
              </div>

              {/* Detailed Explanation */}
              <div className="text-xs text-slate-300 leading-relaxed mt-3 whitespace-pre-line p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-sans">
                {selectedPrinciple.detailedExplanation.trim()}
              </div>
            </div>

            {/* Acoustic Features */}
            {selectedPrinciple.acousticFeatures && selectedPrinciple.acousticFeatures.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  คุณลักษณะอะคูสติกคลื่นเสียง (Acoustic Features):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPrinciple.acousticFeatures.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Examples with Audio playback */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ตัวอย่างคำศัพท์และคำอ่านตามพจนานุกรมราชบัณฑิตยสถาน:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedPrinciple.examples.map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between group hover:border-amber-500/50 transition"
                  >
                    <div>
                      <div className="font-bold text-sm text-white">{ex.word}</div>
                      <div className="text-xs font-mono text-amber-400 font-semibold">{ex.reading}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{ex.note}</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onPlayWord(ex.word, ex.reading)}
                        title="ฟังเสียงอ่านมาตรฐาน"
                        className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSendToTextInput(ex.word)}
                        title="ส่งเข้าช่องข้อความหลัก"
                        className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition text-xs font-semibold"
                      >
                        ✍️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
