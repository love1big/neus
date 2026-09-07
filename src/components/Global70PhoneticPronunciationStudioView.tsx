/**
 * ============================================================================
 * [THAI] สตูดิโอสัทศาสตร์และการออกเสียงธรรมชาติ AI ออฟไลน์ 70++ ภาษาทั่วโลก
 * [ENGLISH] Global 70+ Languages Offline AI Phonetic & Natural Pronunciation Studio View
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - วิเคราะห์และสังเคราะห์การออกเสียงอย่างถูกต้องและเป็นธรรมชาติตามหลักสัทศาสตร์สากล (IPA):
 *   1. International Phonetic Alphabet (IPA): แปลงอักษรเป็นสัทอักษรแม่นยำ 75+ ภาษา
 *   2. Tone & Sandhi Engine: วิเคราะห์ระดับเสียง วรรณยุกต์ (5 เสียงไทย, 4 เสียงจีน, Pitch Accent ญี่ปุ่น)
 *   3. Interactive Pitch Contour Graph: กราฟเส้นความถี่เสียงและความสูงต่ำตามกาลเวลา
 *   4. Acoustic Formant Resonances (F0, F1, F2, F3): คำนวณความถี่การสั่นของเส้นเสียง ช่องปาก และโคนลิ้น
 *   5. Dual Audio Playback:
 *      - 100% Offline Acoustic Formant Speech Synthesizer (Web Audio API BiquadFilter Bank)
 *      - Native Web Speech Engine
 *   6. Articulatory Guidance: คำแนะนำรูปปาก ตำแหน่งลิ้น และข้อควรระวังในการออกเสียงประจำภาษา
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - เชื่อมโยงกับ `Global70PhoneticPronunciationEngine` และ `OfflineAcousticFormantSpeechSynthesizer`
 * - Export เป็น React Functional Component ใช้งานใน `GlobalOfflineAITranslationStudio.tsx`
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

import React, { useState, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Copy,
  Check,
  Globe,
  Waves,
  Mic,
  Activity,
  Sparkles,
  Info,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import {
  PhoneticPronunciationProfile,
  SyllablePhonemeDetail
} from '../types/offlineTranslation70';
import {
  GLOBAL_70_LANGUAGES,
  getLanguageProfileById
} from '../data/global70LanguagesCatalog';
import { Global70PhoneticPronunciationEngine } from '../utils/Global70PhoneticPronunciationEngine';
import { OfflineAcousticFormantSpeechSynthesizer } from '../utils/OfflineAcousticFormantSpeechSynthesizer';

interface Global70PhoneticPronunciationStudioViewProps {
  initialLangId?: string;
  initialText?: string;
}

export const Global70PhoneticPronunciationStudioView: React.FC<Global70PhoneticPronunciationStudioViewProps> = ({
  initialLangId = 'th',
  initialText = 'สวัสดีครับ ยินดีต้อนรับสู่ระบบสัทศาสตร์ออฟไลน์'
}) => {
  // การเลือกภาษาและข้อความ
  const [selectedLangId, setSelectedLangId] = useState<string>(initialLangId);
  const [inputText, setInputText] = useState<string>(initialText);
  const [voiceGender, setVoiceGender] = useState<'neutral' | 'female' | 'male'>('neutral');

  // สถานะเสียง
  const [isPlayingAcoustic, setIsPlayingAcoustic] = useState<boolean>(false);
  const [isPlayingNative, setIsPlayingNative] = useState<boolean>(false);
  const [copiedIpa, setCopiedIpa] = useState<boolean>(false);

  // ดึงข้อมูลโปรไฟล์ภาษา
  const langProfile = useMemo(() => getLanguageProfileById(selectedLangId), [selectedLangId]);

  // วิเคราะห์สัทศาสตร์
  const phoneticProfile = useMemo(() => {
    return Global70PhoneticPronunciationEngine.analyze(inputText, selectedLangId, {
      gender: voiceGender
    });
  }, [inputText, selectedLangId, voiceGender]);

  // เล่นเสียง Acoustic Formant Synthesizer 100% ออฟไลน์
  const handlePlayAcoustic = async () => {
    if (!phoneticProfile) return;
    setIsPlayingAcoustic(true);
    try {
      await OfflineAcousticFormantSpeechSynthesizer.playAcoustic(phoneticProfile);
    } catch (err) {
      console.warn('Acoustic synth error:', err);
    } finally {
      setIsPlayingAcoustic(false);
    }
  };

  const handleStopAcoustic = () => {
    OfflineAcousticFormantSpeechSynthesizer.stopSpeech();
    setIsPlayingAcoustic(false);
  };

  // ฟังเสียง Native Web Speech
  const handlePlayNative = async () => {
    if (!inputText) return;
    setIsPlayingNative(true);
    try {
      await OfflineAcousticFormantSpeechSynthesizer.playWebSpeechNative(inputText, langProfile.iso639_1);
    } catch (err) {
      console.warn('Native speech error:', err);
    } finally {
      setIsPlayingNative(false);
    }
  };

  // คัดลอก IPA
  const handleCopyIpa = () => {
    if (phoneticProfile?.overallIpa) {
      navigator.clipboard.writeText(phoneticProfile.overallIpa);
      setCopiedIpa(true);
      setTimeout(() => setCopiedIpa(false), 2000);
    }
  };

  // คำนวณระยะเวลารวม
  const estimatedDurationMs = useMemo(() => {
    if (!phoneticProfile) return 0;
    return phoneticProfile.syllables.reduce((acc, s) => acc + s.formants.durationMs + 30, 0);
  }, [phoneticProfile]);

  // รวบรวมจุด Pitch Contour
  const pitchContourPoints = useMemo(() => {
    if (!phoneticProfile) return [50, 50];
    const points: number[] = [];
    phoneticProfile.syllables.forEach((s) => {
      if (s.pitchContour && s.pitchContour.length > 0) {
        points.push(...s.pitchContour);
      } else {
        points.push(Math.round(s.formants.f0Hz / 2.5));
      }
    });
    return points.length >= 2 ? points : [50, 60, 55, 45];
  }, [phoneticProfile]);

  // คำนวณ Pitch Contour SVG Path
  const pitchContourSvgPath = useMemo(() => {
    if (!pitchContourPoints || pitchContourPoints.length < 2) return '';
    const points = pitchContourPoints;
    const width = 600;
    const height = 120;
    const padding = 20;

    const minPitch = Math.min(...points);
    const maxPitch = Math.max(...points);
    const pitchRange = maxPitch - minPitch || 1;

    const coords = points.map((p, idx) => {
      const x = padding + (idx / (points.length - 1)) * (width - 2 * padding);
      const normalizedPitch = (p - minPitch) / pitchRange;
      const y = height - padding - normalizedPitch * (height - 2 * padding);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${coords.join(' L ')}`;
  }, [pitchContourPoints]);

  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto p-6 space-y-6">
      {/* 1. Header Toolbar */}
      <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-[#8957e5]/20 text-[#a371f7] border border-[#8957e5]/40">
              <Waves size={24} />
            </span>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>สตูดิโอสัทศาสตร์และการออกเสียงธรรมชาติ 70++ ภาษา</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#8957e5]/20 text-[#a371f7] border border-[#8957e5]/40">
                  ACOUSTIC FORMANT SYNTH
                </span>
              </h2>
              <p className="text-xs text-[#8b949e]">
                วิเคราะห์สัทอักษรสากล (IPA) เส้นโค้งวรรณยุกต์ (Pitch Contour) และจำลองเสียงพูดเรโซแนนซ์โพรงเสียงมนุษย์แบบออฟไลน์
              </p>
            </div>
          </div>
        </div>

        {/* Controls: Language, Gender, and Audio Playback */}
        <div className="flex flex-wrap items-center gap-3 bg-[#0d1117] p-3 rounded-xl border border-[#30363d]">
          <div>
            <label className="text-[10px] text-[#8b949e] block mb-0.5">เลือกภาษา (Language)</label>
            <select
              value={selectedLangId}
              onChange={(e) => setSelectedLangId(e.target.value)}
              className="bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#8957e5]"
            >
              {GLOBAL_70_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.nameThai} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[#8b949e] block mb-0.5">วรรณะเสียง (Voice Timbre)</label>
            <select
              value={voiceGender}
              onChange={(e) => setVoiceGender(e.target.value as any)}
              className="bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-xs text-[#a371f7] font-semibold focus:outline-none focus:border-[#8957e5]"
            >
              <option value="neutral">Neutral (มาตรฐาน)</option>
              <option value="female">Female (F0 220Hz หญิง)</option>
              <option value="male">Male (F0 120Hz ชาย)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-3 md:pt-0">
            {isPlayingAcoustic ? (
              <button
                onClick={handleStopAcoustic}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#da3633] hover:bg-[#f85149] text-white text-xs font-bold rounded-lg transition-all shadow"
              >
                <Square size={13} />
                <span>หยุดเสียง</span>
              </button>
            ) : (
              <button
                onClick={handlePlayAcoustic}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#8957e5] hover:bg-[#a371f7] text-white text-xs font-bold rounded-lg transition-all shadow"
              >
                <Play size={13} />
                <span>🔊 เปล่งเสียงอะคูสติกส์ออฟไลน์</span>
              </button>
            )}

            <button
              onClick={handlePlayNative}
              disabled={isPlayingNative}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-semibold rounded-lg border border-[#30363d] transition-all"
            >
              <Volume2 size={13} />
              <span>🌐 Web Speech</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Text Input & Quick Examples */}
      <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Mic size={14} className="text-[#a371f7]" />
            <span>ข้อความที่ต้องการวิเคราะห์การออกเสียงและสัทศาสตร์</span>
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#8b949e]">ตัวอย่างประจำภาษา:</span>
            <button
              onClick={() => setInputText(langProfile.sampleSentence)}
              className="text-xs text-[#58a6ff] hover:underline"
            >
              "{langProfile.sampleSentence}"
            </button>
          </div>
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          dir={langProfile.direction}
          placeholder="พิมพ์ข้อความที่ต้องการทดสอบการออกเสียง..."
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-base text-white focus:outline-none focus:border-[#8957e5]"
        />
      </div>

      {/* 3. IPA Display Banner */}
      <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              สัทอักษรสากล (International Phonetic Alphabet - IPA):
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#8957e5]/20 text-[#a371f7] border border-[#8957e5]/40 font-mono">
              {langProfile.nameThai}
            </span>
          </div>

          <button
            onClick={handleCopyIpa}
            className="flex items-center space-x-1 px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs rounded border border-[#30363d] transition-all"
          >
            {copiedIpa ? <Check size={12} className="text-[#3fb950]" /> : <Copy size={12} />}
            <span>{copiedIpa ? 'คัดลอก IPA แล้ว' : 'คัดลอก IPA'}</span>
          </button>
        </div>

        <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-mono text-[#a371f7] tracking-wider font-semibold select-text">
              {phoneticProfile.overallIpa || '—'}
            </div>
            <div className="text-xs text-[#8b949e]">
              สัทอักษรสะกดโรมัน (Romanization):{' '}
              <b className="text-white font-mono">{phoneticProfile.romanizedGuide || '—'}</b>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end text-xs space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[#8b949e]">ระบบวรรณยุกต์/พยางค์:</span>
              <span className="px-2 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/30 font-semibold">
                {phoneticProfile.tonalClassification}
              </span>
            </div>
            <div className="text-[#8b949e]">
              แบบแผนจังหวะ: <b className="text-white font-mono">{phoneticProfile.stressRhythmPattern}</b> |
              ระยะเวลารวม: <b className="text-[#38bdf8] font-mono">{estimatedDurationMs} ms</b>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Pitch Contour Interactive Graph */}
      <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Activity size={14} className="text-[#38bdf8]" />
            <span>เส้นโค้งวรรณยุกต์และทำนองเสียงสูง-ต่ำ (Pitch Contour F0 Curve)</span>
          </h3>
          <span className="text-xs text-[#8b949e]">
            จุดพล็อต: {pitchContourPoints.length} จุดตัวอย่าง
          </span>
        </div>

        <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] relative">
          <svg viewBox="0 0 600 120" className="w-full h-32 overflow-visible">
            {/* Background Grid Lines */}
            <line x1="20" y1="20" x2="580" y2="20" stroke="#30363d" strokeDasharray="3,3" />
            <line x1="20" y1="60" x2="580" y2="60" stroke="#30363d" strokeDasharray="3,3" />
            <line x1="20" y1="100" x2="580" y2="100" stroke="#30363d" strokeDasharray="3,3" />

            {/* Pitch Contour Line */}
            {pitchContourSvgPath && (
              <path
                d={pitchContourSvgPath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Points */}
            {pitchContourPoints.map((val, idx) => {
              const points = pitchContourPoints;
              const width = 600;
              const height = 120;
              const padding = 20;
              const minPitch = Math.min(...points);
              const maxPitch = Math.max(...points);
              const pitchRange = maxPitch - minPitch || 1;
              const x = padding + (idx / (points.length - 1 || 1)) * (width - 2 * padding);
              const normalized = (val - minPitch) / pitchRange;
              const y = height - padding - normalized * (height - 2 * padding);
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#a371f7"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>

          <div className="flex items-center justify-between text-[10px] text-[#8b949e] mt-2 px-2 font-mono">
            <span>เริ่มต้นประโยค (Onset)</span>
            <span>กึ่งกลางพยางค์ (Vowel Nucleus)</span>
            <span>สิ้นสุดพยางค์ (Coda Release)</span>
          </div>
        </div>
      </div>

      {/* 5. Syllable Breakdown & Formant Resonances Table */}
      <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <BookOpen size={14} className="text-[#3fb950]" />
            <span>ตารางวิเคราะห์พยางค์ โฟเนม และคลื่นความถี่ Formants (F0, F1, F2, F3)</span>
          </h3>
          <span className="text-xs text-[#8b949e]">
            {phoneticProfile.syllables.length} พยางค์ที่ประมวลผล
          </span>
        </div>

        <div className="border border-[#30363d] rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0d1117] border-b border-[#30363d] text-[#8b949e]">
              <tr>
                <th className="p-3 w-16">พยางค์</th>
                <th className="p-3">สัทอักษร (IPA)</th>
                <th className="p-3">คำอ่านโรมัน</th>
                <th className="p-3">วรรณยุกต์/ระดับเสียง</th>
                <th className="p-3 text-right">F0 (เส้นเสียง)</th>
                <th className="p-3 text-right">F1 (รูปปาก)</th>
                <th className="p-3 text-right">F2 (โคนลิ้น)</th>
                <th className="p-3 text-right">F3 (เรโซแนนซ์)</th>
                <th className="p-3 text-right">ระยะเวลา</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
              {phoneticProfile.syllables.map((syl, idx) => (
                <tr key={idx} className="hover:bg-[#21262d]/40">
                  <td className="p-3 font-semibold text-white">{syl.syllableText}</td>
                  <td className="p-3 font-mono text-[#a371f7] font-semibold">{syl.ipa}</td>
                  <td className="p-3 font-mono text-[#8b949e]">{syl.romanization}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#1f6feb]/15 text-[#58a6ff] border border-[#1f6feb]/30 text-[11px]">
                      {syl.toneType || 'ปกติ'}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-[#3fb950]">{syl.formants.f0Hz} Hz</td>
                  <td className="p-3 text-right font-mono text-[#38bdf8]">{syl.formants.f1Hz} Hz</td>
                  <td className="p-3 text-right font-mono text-[#d2a8ff]">{syl.formants.f2Hz} Hz</td>
                  <td className="p-3 text-right font-mono text-[#8b949e]">{syl.formants.f3Hz} Hz</td>
                  <td className="p-3 text-right font-mono text-white">{syl.formants.durationMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Articulatory Guide & Pronunciation Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mouth & Tongue Position */}
        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Sparkles size={14} className="text-[#e3b341]" />
            <span>คำแนะนำตำแหน่งรูปปากและลิ้น (Articulatory Positioning)</span>
          </h4>
          <p className="text-xs text-[#c9d1d9] leading-relaxed bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
            {phoneticProfile.articulatoryMouthPositionTh || 'ผ่อนคลายกล้ามเนื้อขากรรไกร ลิ้นอยู่ในตำแหน่งกลางเพดานปาก'}
          </p>
        </div>

        {/* Language Tips */}
        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Info size={14} className="text-[#58a6ff]" />
            <span>คำแนะนำการออกเสียงเจาะจง ({langProfile.nameThai})</span>
          </h4>
          <div className="text-xs text-[#c9d1d9] space-y-2 bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
            {phoneticProfile.pronunciationTipsTh.map((tip, idx) => (
              <p key={idx}>• {tip}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Global70PhoneticPronunciationStudioView;
