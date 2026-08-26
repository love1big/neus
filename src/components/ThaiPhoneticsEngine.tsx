/**
 * @file ThaiPhoneticsEngine.tsx
 * @description
 * ============================================================================
 * [THAI]
 * ศูนย์กลางสัทศาสตร์และการออกเสียงภาษาไทยแบบครบวงจร 100% (Ultra Thai Phonetics & Tone Engine Studio)
 * ครอบคลุมหลักไวยากรณ์และสัทศาสตร์ภาษาไทยระดับมืออาชีพอย่างลึกซึ้ง:
 *   - ไตรยางศ์ (อักษร 3 หมู่ 44 ตัว: อักษรกลาง 9, อักษรสูง 11, อักษรต่ำเดี่ยว 14, อักษรต่ำคู่ 10)
 *   - สระไทยครบ 32 เสียง (รัสสระ/สระสั้น, ทีฆสระ/สระยาว, สระเดี่ยว, สระประสม, สระเกิน) พร้อมค่า Formant F1-F4
 *   - มาตราตัวสะกด 8 แม่ (แม่กง, กน, กม, เกย, เกอว, กก, กด, กบ) และกฎคำเป็น-คำตาย
 *   - การผันวรรณยุกต์ 5 เสียง (สามัญ, เอก, โท, ตรี, จัตวา) ตารางเทียบเสียงสมบูรณ์แบบ
 *   - ระบบตัดคำ วิเคราะห์คำควบกล้ำแท้/ไม่แท้, ห นำ, อ นำ, การันต์, สระลดรูป/เปลี่ยนรูป
 *   - เครื่องกำเนิดเสียงสังเคราะห์ตามหลักสรีรวิทยาของสายเสียง (Natural Acoustic F0 Trajectory & Formants)
 *   - มินิเกมทดสอบการฟังแยกแยะเสียงวรรณยุกต์ไทย (Tone Ear Training Quiz)
 *
 * [ENGLISH]
 * Enterprise Complete Thai Phonology, Morphological Analysis & Acoustic Matrix Studio.
 * Implements 100% comprehensive Thai linguistic engines:
 *   - Trai-Yang Consonant Classification (Mid, High, Low Single, Low Pair across all 44 consonants)
 *   - 32 Complete Thai Vowels (Monophthongs, Diphthongs, Extra Vowels with Formants F1-F4)
 *   - 8 Final Consonant Classes & Live/Dead Syllable Resolution
 *   - 5 Thai Tone Inflection Matrix & Real-time Pitch Contours
 *   - Interactive Natural Voice Soundboard & Syllable Tokenizer
 *   - Interactive Thai Tone Ear Training Challenge
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Globe, Volume2, Mic, Activity, BrainCircuit, Play, Pause,
  Square, Sparkles, Layers, Sliders, CheckCircle2, RotateCcw,
  BookOpen, HelpCircle, FastForward, Award, ArrowRight, Zap,
  FileText, Download, Music
} from 'lucide-react';
import {
  ThaiPhoneticsEngineCore,
  THAI_CONSONANTS,
  THAI_VOWELS,
  THAI_TONE_PROFILES,
  ThaiTone,
  ConsonantClass,
  TextAnalysisResult
} from '../utils/ThaiPhoneticsEngineCore';
import { NaturalVoiceAudioEngine, PRESET_VOICES } from '../utils/NaturalVoiceAudioEngine';

export default function ThaiPhoneticsEngine() {
  // Navigation tabs: 'analyzer' | 'consonants' | 'vowels' | 'tone_matrix' | 'ear_training'
  const [activeTab, setActiveTab] = useState<'analyzer' | 'consonants' | 'vowels' | 'tone_matrix' | 'ear_training'>('analyzer');

  // Analyzer Input State
  const [inputText, setInputText] = useState<string>('ไปไหนดีจ๊ะ ขอบคุณครับ สวัสดีครับ');
  const [analysisResult, setAnalysisResult] = useState<TextAnalysisResult | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playProgress, setPlayProgress] = useState<number>(0);
  const [activeSyllableIdx, setActiveSyllableIdx] = useState<number>(-1);

  // Consonant soundboard filter
  const [consonantFilter, setConsonantFilter] = useState<'all' | ConsonantClass>('all');

  // Tone Matrix Word Selector
  const [matrixBaseWord, setMatrixBaseWord] = useState<string>('กา');

  // Ear Training Quiz State
  const [quizQuestion, setQuizQuestion] = useState<{ word: string; correctTone: ThaiTone; options: ThaiTone[] } | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizSelectedTone, setQuizSelectedTone] = useState<ThaiTone | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);

  // Tone contour canvas ref
  const contourCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Perform linguistic analysis whenever input changes
  useEffect(() => {
    const res = ThaiPhoneticsEngineCore.analyzeText(inputText);
    setAnalysisResult(res);
  }, [inputText]);

  // Generate a new Ear Training Quiz Question
  const generateQuizQuestion = () => {
    const quizWords: Array<{ word: string; correctTone: ThaiTone }> = [
      { word: 'กา', correctTone: 'mid' },
      { word: 'ก่า', correctTone: 'low' },
      { word: 'ก้า', correctTone: 'falling' },
      { word: 'ก๊า', correctTone: 'high' },
      { word: 'ก๋า', correctTone: 'rising' },
      { word: 'ขา', correctTone: 'rising' },
      { word: 'ข่า', correctTone: 'low' },
      { word: 'ค่า', correctTone: 'falling' },
      { word: 'ค้า', correctTone: 'high' },
      { word: 'มา', correctTone: 'mid' },
      { word: 'ม้า', correctTone: 'high' },
      { word: 'หม่า', correctTone: 'low' },
      { word: 'หน้า', correctTone: 'falling' },
      { word: 'หมา', correctTone: 'rising' },
      { word: 'ปิด', correctTone: 'low' },
      { word: 'รัก', correctTone: 'high' },
      { word: 'มาก', correctTone: 'falling' }
    ];

    const random = quizWords[Math.floor(Math.random() * quizWords.length)];
    const allTones: ThaiTone[] = ['mid', 'low', 'falling', 'high', 'rising'];
    setQuizQuestion({
      word: random.word,
      correctTone: random.correctTone,
      options: allTones
    });
    setQuizAnswered(false);
    setQuizSelectedTone(null);
  };

  useEffect(() => {
    if (activeTab === 'ear_training' && !quizQuestion) {
      generateQuizQuestion();
    }
  }, [activeTab]);

  // Handle Playback of full text
  const handlePlayFullText = async () => {
    if (isPlaying) {
      NaturalVoiceAudioEngine.stopAll();
      setIsPlaying(false);
      setPlayProgress(0);
      setActiveSyllableIdx(-1);
      return;
    }

    setIsPlaying(true);
    setPlayProgress(0);

    await NaturalVoiceAudioEngine.speakThaiPhonetic(inputText, {
      voice: PRESET_VOICES.natural_thai_female,
      speed: 1.0,
      onProgress: (prog, currentSyl) => {
        setPlayProgress(prog);
        if (analysisResult) {
          const idx = analysisResult.syllables.findIndex(s => s.raw === currentSyl);
          setActiveSyllableIdx(idx);
        }
      },
      onFinished: () => {
        setIsPlaying(false);
        setPlayProgress(100);
        setActiveSyllableIdx(-1);
      }
    });
  };

  // Play a single consonant sound
  const handlePlayConsonant = (char: string) => {
    NaturalVoiceAudioEngine.speakThaiPhonetic(`${char}อ`, {
      voice: PRESET_VOICES.natural_thai_female,
      speed: 1.0
    });
  };

  // Play a single vowel sound
  const handlePlayVowel = (vowelKey: string) => {
    NaturalVoiceAudioEngine.speakThaiPhonetic(vowelKey, {
      voice: PRESET_VOICES.natural_thai_female,
      speed: 1.0
    });
  };

  // Render Tone Pitch Contours on Canvas
  useEffect(() => {
    const canvas = contourCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Grid
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Tone curves colors
    const toneColors: Record<ThaiTone, string> = {
      mid: '#3fb950', // Green
      low: '#58a6ff', // Blue
      falling: '#f85149', // Red
      high: '#e3b341', // Gold
      rising: '#bc8cff' // Purple
    };

    // Draw each tone curve
    (Object.keys(THAI_TONE_PROFILES) as ThaiTone[]).forEach((toneKey) => {
      const profile = THAI_TONE_PROFILES[toneKey];
      const color = toneColors[toneKey];
      const points = profile.pitchTrajectory;

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;

      for (let i = 0; i < points.length; i++) {
        const x = (i / (points.length - 1)) * (canvas.width - 40) + 20;
        // Invert Y: 1.0 is top (high pitch), 0.0 is bottom (low pitch)
        const y = canvas.height - (points[i] * (canvas.height - 40) + 20);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }, [activeTab]);

  return (
    <div className="w-full h-full bg-[#050508] text-white flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="h-16 bg-[#0d1117] border-b border-[#21262d] flex items-center px-6 justify-between shrink-0 shadow-lg relative z-20">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#bc8cff]/20 to-[#8a2be2]/20 border border-[#bc8cff]/40 flex items-center justify-center shadow-[0_0_15px_rgba(188,140,255,0.25)]">
            <Globe size={22} className="text-[#bc8cff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-wide uppercase bg-gradient-to-r from-white via-gray-200 to-[#bc8cff] bg-clip-text text-transparent">
                Ultra Thai Phonetics & Tone Engine Studio
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#bc8cff]/15 border border-[#bc8cff]/30 text-[10px] font-bold text-[#bc8cff] uppercase">
                100% Thai Phonology
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e]">
              ไตรยางศ์ (อักษร 3 หมู่ 44 ตัว) • สระ 32 เสียง • ตัวสะกด 8 แม่ • คำเป็น/คำตาย • ผันวรรณยุกต์ 5 เสียง • สัทอักษรสากล IPA
            </p>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <div className="flex items-center bg-[#161b22] p-1 rounded-lg border border-[#30363d]">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === 'analyzer' ? 'bg-[#bc8cff] text-black shadow-md' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Activity size={14} /> วิเคราะห์สัทศาสตร์
          </button>
          <button
            onClick={() => setActiveTab('consonants')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === 'consonants' ? 'bg-[#3fb950] text-black shadow-md' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Layers size={14} /> ไตรยางศ์ 44 ตัว
          </button>
          <button
            onClick={() => setActiveTab('vowels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === 'vowels' ? 'bg-[#58a6ff] text-black shadow-md' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Music size={14} /> สระ 32 เสียง (Formants)
          </button>
          <button
            onClick={() => setActiveTab('tone_matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === 'tone_matrix' ? 'bg-[#e3b341] text-black shadow-md' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Sliders size={14} /> ตารางผันวรรณยุกต์ 5 เสียง
          </button>
          <button
            onClick={() => setActiveTab('ear_training')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === 'ear_training' ? 'bg-[#f85149] text-white shadow-md' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Award size={14} /> ฝึกฟังเสียงวรรณยุกต์
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        
        {/* ==================================================================== */}
        {/* TAB 1: REAL-TIME TEXT PHONETIC ANALYZER */}
        {/* ==================================================================== */}
        {activeTab === 'analyzer' && (
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Input & Action Panel */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-2">
                  <FileText size={16} className="text-[#bc8cff]" /> Thai Text Input & Morphological Tokenizer
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInputText('ไปไหนดีจ๊ะ ขอบคุณครับ สวัสดีครับ ร้องเพลงพากย์เสียงธรรมชาติ')}
                    className="text-xs text-[#bc8cff] hover:underline"
                  >
                    Load Sample Sentence
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={2}
                  className="flex-1 bg-[#050508] border border-[#30363d] rounded-xl p-4 text-white text-lg font-sans outline-none focus:border-[#bc8cff] shadow-inner resize-none"
                  placeholder="พิมพ์ข้อความภาษาไทยเพื่อวิเคราะห์สัทศาสตร์และการออกเสียง..."
                />
                <button
                  onClick={handlePlayFullText}
                  className="px-6 rounded-xl bg-gradient-to-br from-[#bc8cff] to-[#8a2be2] hover:from-[#a855f7] hover:to-[#7c3aed] text-black font-black text-xs flex flex-col items-center justify-center gap-1 transition-all shadow-[0_0_20px_rgba(188,140,255,0.4)] shrink-0 min-w-[130px]"
                >
                  {isPlaying ? (
                    <>
                      <Square size={20} fill="currentColor" />
                      <span>STOP</span>
                    </>
                  ) : (
                    <>
                      <Play size={20} fill="currentColor" />
                      <span>SPEAK VOICE</span>
                    </>
                  )}
                </button>
              </div>

              {/* Summary Stats Row */}
              {analysisResult && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                    <span className="text-[10px] text-[#8b949e] uppercase font-bold block">Total Syllables</span>
                    <span className="text-base font-bold text-white font-mono">{analysisResult.syllables.length} พยางค์</span>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                    <span className="text-[10px] text-[#8b949e] uppercase font-bold block">Estimated Duration</span>
                    <span className="text-base font-bold text-[#3fb950] font-mono">{analysisResult.totalEstimatedDurationMs} ms</span>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                    <span className="text-[10px] text-[#8b949e] uppercase font-bold block">IPA Transcription</span>
                    <span className="text-xs font-bold text-[#58a6ff] font-mono truncate block">{analysisResult.overallIpa || '-'}</span>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                    <span className="text-[10px] text-[#8b949e] uppercase font-bold block">RTGS Romanization</span>
                    <span className="text-xs font-bold text-[#e3b341] font-mono truncate block">{analysisResult.overallRtgs || '-'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Syllable Breakdown Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit size={16} className="text-[#3fb950]" /> Syllable-by-Syllable Phonetic Decomposition
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisResult?.syllables.map((syl, idx) => (
                  <div
                    key={idx}
                    className={`bg-[#0d1117] border rounded-xl p-4 flex flex-col justify-between transition-all shadow-md ${
                      activeSyllableIdx === idx
                        ? 'border-[#bc8cff] bg-[#bc8cff]/10 scale-[1.02] shadow-[0_0_15px_rgba(188,140,255,0.3)]'
                        : 'border-[#30363d] hover:border-[#58a6ff]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-black text-white font-sans">{syl.raw}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#bc8cff]/15 border border-[#bc8cff]/30 text-[11px] font-bold text-[#bc8cff]">
                            {syl.calculatedToneThai}
                          </span>
                          <button
                            onClick={() => NaturalVoiceAudioEngine.speakThaiPhonetic(syl.raw, { voice: PRESET_VOICES.natural_thai_female })}
                            className="p-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff]"
                            title="Play Syllable"
                          >
                            <Volume2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-[#8b949e] border-t border-[#21262d] pt-2">
                        <div className="flex justify-between">
                          <span>พยัญชนะต้น:</span>
                          <span className="text-white font-bold">{syl.initialConsonants} ({syl.consonantClass.toUpperCase()})</span>
                        </div>
                        <div className="flex justify-between">
                          <span>สระ:</span>
                          <span className="text-white font-bold">{syl.vowel} ({syl.vowelLength === 'short' ? 'รัสสระ/สั้น' : 'ทีฆสระ/ยาว'})</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ตัวสะกด / มาตรา:</span>
                          <span className="text-white font-bold">{syl.finalClass} ({syl.syllableLife === 'live' ? 'คำเป็น' : 'คำตาย'})</span>
                        </div>
                        <div className="flex justify-between">
                          <span>สัทอักษร (IPA):</span>
                          <span className="text-[#58a6ff] font-mono">{syl.ipa}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Formants (F1/F2):</span>
                          <span className="text-[#e3b341] font-mono">{syl.formants.f1}Hz / {syl.formants.f2}Hz</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#21262d] text-[10px] text-[#3fb950] font-mono">
                      💡 {syl.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* F0 Pitch Curves Comparison Panel */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity size={16} className="text-[#58a6ff]" /> 5 Thai Tone F0 Pitch Curves Trajectory
                </span>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1"><span className="w-3 h-1 bg-[#3fb950] rounded"></span> สามัญ (Mid)</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-1 bg-[#58a6ff] rounded"></span> เอก (Low)</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-1 bg-[#f85149] rounded"></span> โท (Falling)</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-1 bg-[#e3b341] rounded"></span> ตรี (High)</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-1 bg-[#bc8cff] rounded"></span> จัตวา (Rising)</span>
                </div>
              </h3>

              <div className="w-full h-48 bg-[#050508] border border-[#30363d] rounded-xl overflow-hidden relative p-2">
                <canvas ref={contourCanvasRef} width={800} height={180} className="w-full h-full" />
              </div>
            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: TRAI-YANG 44 CONSONANTS SOUNDBOARD */}
        {/* ==================================================================== */}
        {activeTab === 'consonants' && (
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Filter Bar */}
            <div className="flex items-center justify-between bg-[#0d1117] border border-[#30363d] rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#8b949e] uppercase">หมู่อักษร (Trai-Yang):</span>
                <button
                  onClick={() => setConsonantFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    consonantFilter === 'all' ? 'bg-white text-black' : 'bg-[#161b22] text-[#8b949e]'
                  }`}
                >
                  ทั้งหมด (44 ตัว)
                </button>
                <button
                  onClick={() => setConsonantFilter('mid')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    consonantFilter === 'mid' ? 'bg-[#3fb950] text-black' : 'bg-[#161b22] text-[#3fb950]'
                  }`}
                >
                  อักษรกลาง (9 ตัว)
                </button>
                <button
                  onClick={() => setConsonantFilter('high')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    consonantFilter === 'high' ? 'bg-[#f85149] text-white' : 'bg-[#161b22] text-[#f85149]'
                  }`}
                >
                  อักษรสูง (11 ตัว)
                </button>
                <button
                  onClick={() => setConsonantFilter('low_single')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    consonantFilter === 'low_single' ? 'bg-[#58a6ff] text-black' : 'bg-[#161b22] text-[#58a6ff]'
                  }`}
                >
                  อักษรต่ำเดี่ยว (14 ตัว)
                </button>
                <button
                  onClick={() => setConsonantFilter('low_pair')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    consonantFilter === 'low_pair' ? 'bg-[#e3b341] text-black' : 'bg-[#161b22] text-[#e3b341]'
                  }`}
                >
                  อักษรต่ำคู่ (10 ตัว)
                </button>
              </div>
            </div>

            {/* Consonants Grid Soundboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {Object.entries(THAI_CONSONANTS)
                .filter(([_, c]) => consonantFilter === 'all' || c.class === consonantFilter)
                .map(([char, c]) => (
                  <button
                    key={char}
                    onClick={() => handlePlayConsonant(char)}
                    className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] hover:scale-105 rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all shadow-sm group"
                  >
                    <span className="text-3xl font-black text-white font-sans group-hover:text-[#bc8cff]">{c.char}</span>
                    <span className="text-xs font-bold text-[#8b949e] truncate w-full text-center">{c.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      c.class === 'mid' ? 'bg-[#3fb950]/15 text-[#3fb950]' :
                      c.class === 'high' ? 'bg-[#f85149]/15 text-[#f85149]' :
                      c.class === 'low_single' ? 'bg-[#58a6ff]/15 text-[#58a6ff]' :
                      'bg-[#e3b341]/15 text-[#e3b341]'
                    }`}>
                      {c.class === 'mid' ? 'กลาง' : c.class === 'high' ? 'สูง' : c.class === 'low_single' ? 'ต่ำเดี่ยว' : 'ต่ำคู่'}
                    </span>
                    <span className="text-[9px] text-[#8b949e] font-mono">IPA: [{c.ipaInitial}]</span>
                  </button>
                ))}
            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: 32 THAI VOWELS & FORMANTS */}
        {/* ==================================================================== */}
        {activeTab === 'vowels' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Music size={16} className="text-[#58a6ff]" /> Complete 32 Thai Vowels & Acoustic Formant Matrix (F1-F4)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(THAI_VOWELS).map(([vKey, v]) => (
                  <div
                    key={vKey}
                    onClick={() => handlePlayVowel(vKey)}
                    className="bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] rounded-xl p-4 flex flex-col justify-between transition-all cursor-pointer group shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-black text-white font-sans group-hover:text-[#58a6ff]">{v.char}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.length === 'short' ? 'bg-[#f85149]/15 text-[#f85149]' : 'bg-[#3fb950]/15 text-[#3fb950]'
                        }`}>
                          {v.length === 'short' ? 'รัสสระ (สั้น)' : 'ทีฆสระ (ยาว)'}
                        </span>
                      </div>
                      <div className="text-xs text-[#8b949e] font-medium mb-2">{v.name}</div>
                    </div>

                    <div className="border-t border-[#21262d] pt-2 text-[10px] font-mono text-[#8b949e] space-y-0.5">
                      <div className="flex justify-between"><span>IPA:</span><span className="text-[#58a6ff]">/{v.ipa}/</span></div>
                      <div className="flex justify-between"><span>F1 / F2:</span><span className="text-[#e3b341]">{v.f1}Hz / {v.f2}Hz</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: 5 THAI TONE INFLECTION MATRIX */}
        {/* ==================================================================== */}
        {activeTab === 'tone_matrix' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders size={18} className="text-[#e3b341]" /> 5 Thai Tone Inflection Matrix (ตารางการผันวรรณยุกต์ครบ 5 เสียง)
                  </h3>
                  <p className="text-xs text-[#8b949e] mt-1">
                    เปรียบเทียบการผันเสียงตามหมู่อักษรและคำเป็น/คำตาย
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8b949e]">เลือกคำเทียบเสียง:</span>
                  {['กา', 'ปา', 'คา', 'ปอง', 'มา', 'ทา'].map((word) => (
                    <button
                      key={word}
                      onClick={() => setMatrixBaseWord(word)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        matrixBaseWord === word ? 'bg-[#e3b341] text-black font-black' : 'bg-[#161b22] text-[#8b949e]'
                      }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complete 5-Tone Inflection Row */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {[
                  { tone: 'mid', label: 'เสียงสามัญ', mark: 'ไม่มีรูป', sample: matrixBaseWord, color: '#3fb950' },
                  { tone: 'low', label: 'เสียงเอก', mark: 'รูปเอก ( ่)', sample: `${matrixBaseWord.slice(0, 1)}่${matrixBaseWord.slice(1)}`, color: '#58a6ff' },
                  { tone: 'falling', label: 'เสียงโท', mark: 'รูปโท ( ้)', sample: `${matrixBaseWord.slice(0, 1)}้${matrixBaseWord.slice(1)}`, color: '#f85149' },
                  { tone: 'high', label: 'เสียงตรี', mark: 'รูปตรี ( ๊)', sample: `${matrixBaseWord.slice(0, 1)}๊${matrixBaseWord.slice(1)}`, color: '#e3b341' },
                  { tone: 'rising', label: 'เสียงจัตวา', mark: 'รูปจัตวา ( ๋)', sample: `${matrixBaseWord.slice(0, 1)}๋${matrixBaseWord.slice(1)}`, color: '#bc8cff' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => NaturalVoiceAudioEngine.speakThaiPhonetic(item.sample, { voice: PRESET_VOICES.natural_thai_female })}
                    className="bg-[#161b22] border border-[#30363d] hover:border-[#e3b341] rounded-xl p-5 flex flex-col items-center justify-between text-center transition-all cursor-pointer group shadow-md"
                  >
                    <div>
                      <span className="text-3xl font-black text-white font-sans group-hover:scale-110 transition-transform block mb-2">
                        {item.sample}
                      </span>
                      <span className="text-sm font-bold block" style={{ color: item.color }}>
                        {item.label}
                      </span>
                      <span className="text-[11px] text-[#8b949e]">{item.mark}</span>
                    </div>

                    <button className="mt-4 p-2 rounded-full bg-[#21262d] group-hover:bg-[#e3b341] group-hover:text-black text-[#e3b341] transition-all">
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: EAR TRAINING QUIZ */}
        {/* ==================================================================== */}
        {activeTab === 'ear_training' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-8 shadow-xl text-center space-y-6">
              <div className="flex items-center justify-between border-b border-[#21262d] pb-4">
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Award size={20} className="text-[#f85149]" /> Thai Tone Ear Training Challenge
                </h3>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-[#3fb950]">Score: {quizScore}</span>
                  <span className="text-[#e3b341]">Streak: {quizStreak}🔥</span>
                </div>
              </div>

              {quizQuestion && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs text-[#8b949e] uppercase font-bold block mb-2">Click to Listen</span>
                    <button
                      onClick={() => NaturalVoiceAudioEngine.speakThaiPhonetic(quizQuestion.word, { voice: PRESET_VOICES.natural_thai_female })}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f85149] to-[#bc8cff] text-white flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(248,81,73,0.4)] hover:scale-105 transition-transform"
                    >
                      <Volume2 size={36} />
                    </button>
                    <div className="text-2xl font-black text-white mt-3 font-sans">"{quizQuestion.word}"</div>
                  </div>

                  <div className="text-sm font-bold text-[#8b949e]">
                    คำนี้ออกเสียงวรรณยุกต์ใด? (What tone is this word?)
                  </div>

                  {/* 5 Tone Options Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {[
                      { key: 'mid', label: 'สามัญ (Mid)' },
                      { key: 'low', label: 'เอก (Low)' },
                      { key: 'falling', label: 'โท (Falling)' },
                      { key: 'high', label: 'ตรี (High)' },
                      { key: 'rising', label: 'จัตวา (Rising)' }
                    ].map((opt) => {
                      const isCorrect = opt.key === quizQuestion.correctTone;
                      const isSelected = quizSelectedTone === opt.key;

                      let btnClass = 'bg-[#161b22] border-[#30363d] text-white hover:border-[#f85149]';
                      if (quizAnswered) {
                        if (isCorrect) btnClass = 'bg-[#3fb950] border-[#3fb950] text-black font-black';
                        else if (isSelected && !isCorrect) btnClass = 'bg-[#f85149] border-[#f85149] text-white';
                      }

                      return (
                        <button
                          key={opt.key}
                          disabled={quizAnswered}
                          onClick={() => {
                            setQuizSelectedTone(opt.key as ThaiTone);
                            setQuizAnswered(true);
                            if (opt.key === quizQuestion.correctTone) {
                              setQuizScore(s => s + 10);
                              setQuizStreak(st => st + 1);
                            } else {
                              setQuizStreak(0);
                            }
                          }}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all ${btnClass}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswered && (
                    <div className="pt-4 flex flex-col items-center gap-3 animate-fadeIn">
                      <div className={`text-sm font-bold ${quizSelectedTone === quizQuestion.correctTone ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                        {quizSelectedTone === quizQuestion.correctTone ? '🎉 ถูกต้อง! (Correct!)' : `❌ ผิด! คำตอบที่ถูกต้องคือ ${THAI_TONE_PROFILES[quizQuestion.correctTone].toneThai}`}
                      </div>
                      <button
                        onClick={generateQuizQuestion}
                        className="px-6 py-2 bg-white hover:bg-gray-200 text-black font-black text-xs rounded-lg flex items-center gap-2 transition-all shadow-md"
                      >
                        Next Word <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
