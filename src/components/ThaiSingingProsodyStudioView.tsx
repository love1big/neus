/**
 * ============================================================================
 * สตูดิโอร้องเพลงไทยและขับทำนองเสนาะตามฉันทลักษณ์ราชบัณฑิตยสถาน
 * (Thai Melodic Singing & Traditional Chanting Prosody Studio View)
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - รองรับการสังเคราะห์เสียงร้องเพลงไทยสากล เพลงไทยเดิม และการขับทำนองเสนาะบทกวี
 * - ครอบคลุมฉันทลักษณ์กวีนิพนธ์ไทยทุกแขนง: กลอนสุภาพ (กลอน ๘), กาพย์ยานี ๑๑, โคลงสี่สุภาพ,
 *   กาพย์ฉบัง ๑๖, เสภาขับร้อง, เพลงไทยเดิม/สากล
 * - แสดงแผนผังฉันทลักษณ์ (Prosody Meter Map), กฎเสียงวรรณยุกต์ท้ายวรรค (สดับ รับ รอง ส่ง),
 *   สัมผัสนอก-สัมผัสใน, และการเอื้อนเสียง (Thai Melisma/Embellishment)
 * - มี Karaoke Lyrical Melody Tracker ให้ปรับเปลี่ยนโน้ตดนตรีไทย-สากล (Hz), ความยาวสระ (Duration),
 *   และลูกคอ (Vibrato) ได้ทุกพยางค์
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - เชื่อมต่อกับ `ThaiSingingAndChantingProsodyEngine` สำหรับแม่แบบฉันทลักษณ์และการแปลงกลอนเป็นโน้ตเพลง
 * - เชื่อมต่อกับ `ThaiSpeechAndSingingEngine` เพื่อเล่นเสียงสังเคราะห์ Melodic Chanting
 * 
 * @author Thai Royal Institute Speech & Musicology Division
 */

import React, { useState } from 'react';
import {
  Music,
  Play,
  Square,
  Download,
  Sparkles,
  BookOpen,
  Sliders,
  CheckCircle2,
  Info,
  Radio,
  FileAudio
} from 'lucide-react';
import {
  ThaiSingingAndChantingProsodyEngine,
  ThaiPoetryMeter
} from '../utils/ThaiSingingAndChantingProsodyEngine';
import {
  ThaiSpeechAndSingingEngine,
  SingingNote,
  PlaybackTimingEvent
} from '../utils/ThaiSpeechAndSingingEngine';

interface ThaiSingingProsodyStudioViewProps {
  singingNotes: SingingNote[];
  setSingingNotes: React.Dispatch<React.SetStateAction<SingingNote[]>>;
  isPlaying: boolean;
  activeSyllable: PlaybackTimingEvent | null;
  onPlaySinging: () => void;
  onExportWav: () => void;
}

export const ThaiSingingProsodyStudioView: React.FC<ThaiSingingProsodyStudioViewProps> = ({
  singingNotes,
  setSingingNotes,
  isPlaying,
  activeSyllable,
  onPlaySinging,
  onExportWav
}) => {
  const meters = ThaiSingingAndChantingProsodyEngine.POETRY_AND_SINGING_METERS;
  const [selectedMeter, setSelectedMeter] = useState<ThaiPoetryMeter>(meters[0]);
  const [activeTab, setActiveTab] = useState<'tracker' | 'rules' | 'meters'>('tracker');

  // โหลดตัวอย่างกลอนเข้าแทร็กโน้ตร้องเพลง
  const handleLoadMeterVerse = (meter: ThaiPoetryMeter) => {
    setSelectedMeter(meter);
    const generated = ThaiSingingAndChantingProsodyEngine.generateMelodicChantNotes(
      meter.sampleVerse.text,
      meter.id
    );
    setSingingNotes(
      generated.map((g) => ({
        syllable: g.syllable,
        note: g.note,
        frequency: ThaiSpeechAndSingingEngine.NOTE_FREQUENCIES[g.note] || 440,
        durationSec: g.durationSec,
        vibrato: true
      }))
    );
  };

  return (
    <div className="lg:col-span-12 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
              <Music className="w-3.5 h-3.5" />
              การขับร้องและทำนองเสนาะตามแบบแผนดุริยางคศาสตร์ไทย
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              สตูดิโอร้องเพลงและขับทำนองเสนาะภาษาไทย (Thai Melodic Singing & Prosody Studio)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              เทคโนโลยีสังเคราะห์เสียงร้องคีย์ตรงตามบันไดเสียงดนตรีไทยและสากล พร้อมหลักการเอื้อนเสียง (Melisma) ลูกคอ (Vibrato) และการรักษาฐานเสียงวรรณยุกต์แท้ไม่ให้เพี้ยนตามฉันทลักษณ์
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onPlaySinging}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition flex items-center gap-2 ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-purple-500/20'
              }`}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              {isPlaying ? 'หยุดร้องเพลง' : 'เริ่มร้องเพลง / ขับเสนาะ'}
            </button>
            <button
              onClick={onExportWav}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              บันทึก WAV
            </button>
          </div>
        </div>
      </div>

      {/* Meter Switcher Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-300">เลือกแม่แบบฉันทลักษณ์บทกวี / สไตล์เพลงไทย:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === 'tracker' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              โน้ตดนตรี (Melody Track)
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === 'rules' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              หลักการขับร้องและเอื้อน
            </button>
            <button
              onClick={() => setActiveTab('meters')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === 'meters' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              ผังฉันทลักษณ์ทั้ง ๖ ชนิด
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
          {meters.map((meter) => {
            const isSelected = selectedMeter.id === meter.id;
            return (
              <button
                key={meter.id}
                onClick={() => handleLoadMeterVerse(meter)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-500/20 border-purple-500 text-purple-200 shadow-md shadow-purple-500/10'
                    : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-white">{meter.nameThai}</div>
                  <div className="text-[10px] text-purple-400/80 font-mono mt-0.5">{meter.rhythmicSubdivision}</div>
                </div>
                <div className="text-[9px] text-slate-500 mt-2">คลิกเพื่อโหลดทำนอง</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Note Melody Tracker */}
      {activeTab === 'tracker' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                ห้องเพลงและโน้ตดนตรีรายพยางค์ ({singingNotes.length} พยางค์):
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                กำลังเล่นแบบ: <span className="text-purple-300 font-semibold">{selectedMeter.nameThai}</span> — ปรับระดับเสียง โน้ต ระยะเวลา และลูกคอได้อิสระ
              </p>
            </div>

            <div className="text-xs text-slate-400">
              จังหวะ: <span className="text-white font-mono">{selectedMeter.bpmRange[0]}-{selectedMeter.bpmRange[1]} BPM</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[480px] overflow-y-auto p-1">
            {singingNotes.map((item, idx) => {
              const isCurrent = isPlaying && activeSyllable?.syllableIndex === idx;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition flex flex-col items-center justify-between text-center gap-2 ${
                    isCurrent
                      ? 'bg-purple-500/30 border-purple-400 shadow-lg shadow-purple-500/20 scale-105 ring-2 ring-purple-400'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <span className="text-base font-bold text-white">{item.syllable}</span>

                  <select
                    value={item.note}
                    onChange={(e) => {
                      const newNote = e.target.value;
                      const newFreq = ThaiSpeechAndSingingEngine.NOTE_FREQUENCIES[newNote] || 440;
                      setSingingNotes((prev) => {
                        const copy = [...prev];
                        copy[idx] = { ...copy[idx], note: newNote, frequency: newFreq };
                        return copy;
                      });
                    }}
                    className="bg-slate-900 border border-slate-700 text-[11px] font-mono text-purple-300 rounded px-1.5 py-0.5 focus:outline-none w-full text-center"
                  >
                    {Object.keys(ThaiSpeechAndSingingEngine.NOTE_FREQUENCIES).map((n) => (
                      <option key={n} value={n}>
                        {n} ({ThaiSpeechAndSingingEngine.NOTE_FREQUENCIES[n]}Hz)
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center justify-between w-full text-[10px] text-slate-400 px-1">
                    <span>{item.durationSec}s</span>
                    <input
                      type="range"
                      min="0.2"
                      max="1.5"
                      step="0.1"
                      value={item.durationSec}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setSingingNotes((prev) => {
                          const copy = [...prev];
                          copy[idx] = { ...copy[idx], durationSec: val };
                          return copy;
                        });
                      }}
                      className="w-10 accent-purple-500 h-1 bg-slate-800 rounded"
                    />
                  </div>

                  <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.vibrato}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSingingNotes((prev) => {
                          const copy = [...prev];
                          copy[idx] = { ...copy[idx], vibrato: checked };
                          return copy;
                        });
                      }}
                      className="accent-purple-500 rounded"
                    />
                    ลูกคอ
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Rules & Techniques of Thai Singing */}
      {activeTab === 'rules' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">
              หลักการอ่านออกเสียงและขับร้องเพลงไทยทั้งหมด (Principles of Thai Singing & Chanting)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              รวบรวมหลักการตามแบบแผนดนตรีไทยเดิม ดุริยางคศิลป์สากล และราชบัณฑิตยสถาน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                ๑. การรักษาฐานเสียงวรรณยุกต์แท้ (Tonal Integrity in Melodic Lines)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ในเพลงไทย คำที่มีวรรณยุกต์เอก โท ตรี จัตวา ต้องไม่ถูกโน้ตดนตรีบิดเบือนจนเปลี่ยนความหมาย หากโน้ตดนตรีขึ้นสูง คำเสียงเอกต้องใช้เทคนิค "เอื้อนเสียงขึ้นจากต่ำ" หรือใช้หางเสียงบังคับ เพื่อให้ผู้ฟังจับใจความได้อย่างถูกต้อง 100%
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                ๒. การลากเสียงสระและการเชื่อมสระ (Vowel Elongation & Melisma)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                สระสั้น (รัสสระ เช่น อะ, อิ, อุ) ในคำร้องเพลงไทยโบราณไม่ควรลากเสียงยาวเกินไป หากจำเป็นต้องลากจังหวะ ให้เปลี่ยนเป็นเสียงสระยาวคู่ขนาน (เช่น สระอะ เป็น สระอา ในช่วงท้ายคำ) เพื่อความนุ่มนวลและไม่สะดุดหู
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                ๓. การเอื้อนเสียงและลูกคอ (Thai Vocal Vibrato & Embellishments)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                การเอื้อนเสียงในทำนองเสนาะและเพลงไทยเดิม คือการประคองลมหายใจผ่านสายเสียงให้เกิดการสั่นสะเทือนแบบละมุน (ประมาณ ๕.๕ - ๖.๕ Hz) นิยมใช้ในคำสุดท้ายของแต่ละวรรคเพื่อสร้างความสะเทือนอารมณ์และส่งสัมผัส
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                ๔. การแบ่งวรรคตอนจังหวะหายใจ (Caesura & Breath Cadence)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                การขับร้องต้องไม่ตัดคำกลางคัน เช่น "พระ-บาท" ห้ามหายใจระหว่าง พระ กับ บาท ในกลอนสุภาพแบ่งวรรค ๓-๒-๓ หรือ ๓-๓-๓ ส่วนกาพย์ยานี ๑๑ วรรคหน้า ๒-๓ วรรคหลัง ๓-๓ เพื่อความไพเราะและไม่เสียจังหวะฉันทลักษณ์
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Meters Reference */}
      {activeTab === 'meters' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">
              ผังฉันทลักษณ์กวีนิพนธ์ไทยทั้ง ๖ แบบ (Complete Thai Poetry Meters)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              ศึกษากฎเกณฑ์จำนวนคำ สัมผัสนอก สัมผัสใน และเสียงวรรณยุกต์ท้ายวรรคของบทกวีไทย
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meters.map((m) => (
              <div key={m.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{m.nameThai}</h4>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono">
                    {m.bpmRange[0]}-{m.bpmRange[1]} BPM
                  </span>
                </div>
                <p className="text-xs text-slate-400">{m.descriptionThai}</p>
                <div className="text-xs font-mono text-amber-300/90 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  โครงสร้างจังหวะและการแบ่งวรรค: {m.rhythmicSubdivision}
                </div>
                <div className="text-xs text-slate-300 bg-purple-950/20 p-2.5 rounded-lg border border-purple-500/30">
                  <span className="text-purple-400 font-semibold">ระเบียบทำนองและฉันทลักษณ์: </span>
                  {m.melodicRules.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
