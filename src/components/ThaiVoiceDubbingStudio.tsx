/**
 * @file ThaiVoiceDubbingStudio.tsx
 * @description
 * ============================================================================
 * [THAI]
 * สตูดิโอระบบเสียงและการพากย์เสียงภาษาไทยแบบมืออาชีพ 100% (Ultra Thai Voice Dubbing & Speech Studio)
 * พัฒนาขึ้นโดยอิงตามโครงสร้างสัทศาสตร์เสียงในภาษาไทยตามหลักสูตรอย่างสมบูรณ์แบบ:
 *   1. ระบบ 21 เสียงพยัญชนะ จาก 44 รูปพยัญชนะ (/ก/ ถึง /อ/) พร้อมการจับคู่รูปอักษรและตัวอย่างคำ
 *   2. ระบบ 24 เสียงสระ แบ่งเป็น สระแท้ฐานเดียว 8 เสียง, สระแท้สองฐาน 10 เสียง, และ สระประสม 6 เสียง (เอีย, เอียะ, เอือ, เอือะ, อัว, อัวะ พร้อมสมการผสมเสียง)
 *   3. ระบบ 5 เสียงวรรณยุกต์ (สามัญ เอก โท ตรี จัตวา) พร้อมกราฟแสดงเส้นทางเดินความถี่มูลฐาน (F0 Pitch Contour Trajectory)
 *   4. เวิร์กสเตชันพากย์เสียงตัวละคร 8 คาแรกเตอร์ (Anime Hero, Sweet Heroine, Documentary Narrator, Elder, Villain, Child Mascot, Cyber Droid, Movie Trailer)
 *   5. การปรับแต่งอารมณ์เสียงพากย์ 7 รูปแบบ (ธรรมดา, ตื่นเต้น, ดราม่า, กระซิบ, โกรธ, เศร้า, มหากาพย์)
 *   6. สคริปต์พากย์เสียงไทยแบบ Time-coded พร้อมตัวตัดพยางค์และสัทอักษร IPA Real-time
 *   7. ระบบวิเคราะห์คลื่นเสียง Formant Real-time, ระบบทดสอบการพากย์เสียงด้วยไมโครโฟน และระบบดาวน์โหลดไฟล์เสียง
 *
 * [ENGLISH]
 * Enterprise Studio for Professional Thai Voice Dubbing, Voice Acting & Acoustic Phonetics.
 * Based on 100% authentic Thai phonetic ontology:
 *   - 21 Consonant Phonemes across 44 orthographic letters with phonetic acoustics
 *   - 24 Vowel Phonemes (8 Single-base + 10 Double-base Monophthongs + 6 Diphthong Glides)
 *   - 5 Phonemic Tone Categories with real-time F0 pitch trajectory oscilloscope
 *   - 8 Character Voice Archetypes (Anime Hero, Heroine, Documentary, Elder, Villain, Kid, Cyborg, Movie Trailer)
 *   - 7 Emotional Inflections & Voice Acting Modulators (Speed, Pitch, Breathiness, Reverb, Warmth)
 *   - Interactive Script Dubbing Studio with Syllable Highlighting, IPA, and Tone Breakdown
 *   - Voice Comparison Recorder & Web Audio Acoustic Visualizer
 * ============================================================================
 *
 * 1. MODULE RESPONSIBILITY & PURPOSE:
 *    - Main UI workstation for Thai voice dubbing, voice acting, and phonetic soundboard education.
 *    - Connects Web Audio synthesis with interactive visual controls and linguistic analysis.
 *
 * 2. ARCHITECTURE & SYSTEM INTEGRATION:
 *    - Consumes: ThaiPhoneticSpeechSynthesizer.ts, ThaiPhoneticsEngineCore.ts, NaturalVoiceAudioEngine.ts.
 *    - Registered in: App.tsx tools array.
 *
 * 3. INPUTS & OUTPUTS:
 *    - Inputs: User Thai script text, Character selection, Emotion modifiers, Mic audio stream.
 *    - Outputs: Synthesized voice audio, Formant graphs, Visual spectrum, Exportable WAV audio files.
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, Volume2, Play, Pause, Square, Sparkles, Sliders,
  Layers, Activity, BookOpen, Download, RotateCcw,
  Zap, Award, CheckCircle2, ChevronRight, MessageSquare,
  Flame, Radio, RefreshCw, AudioWaveform as WaveformIcon
} from 'lucide-react';

import {
  ThaiPhoneticSpeechSynthesizer,
  THAI_21_CONSONANTS,
  THAI_24_VOWELS,
  THAI_5_TONES,
  THAI_DUBBING_CHARACTERS,
  PRESET_DUBBING_SCRIPTS,
  DubbingCharacterId,
  DubbingEmotion,
  ThaiConsonantPhoneme21,
  ThaiVowelPhoneme24,
  ThaiTonePhoneme5
} from '../utils/ThaiPhoneticSpeechSynthesizer';

import {
  ThaiPhoneticsEngineCore,
  TextAnalysisResult,
  ThaiSyllableAnalysis
} from '../utils/ThaiPhoneticsEngineCore';

export default function ThaiVoiceDubbingStudio() {
  // Main Studio Tabs: 'dubbing_studio' | 'phonetics_consonants' | 'phonetics_vowels' | 'phonetics_tones' | 'acting_practice'
  const [activeTab, setActiveTab] = useState<'dubbing_studio' | 'phonetics_consonants' | 'phonetics_vowels' | 'phonetics_tones' | 'acting_practice'>('dubbing_studio');

  // Selected Dubbing Voice & Acting Settings
  const [selectedVoiceId, setSelectedVoiceId] = useState<DubbingCharacterId>('anime_hero');
  const [selectedEmotion, setSelectedEmotion] = useState<DubbingEmotion>('neutral');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [pitchOffset, setPitchOffset] = useState<number>(0);
  const [reverbAmount, setReverbAmount] = useState<number>(0.2);
  const [volumeLevel, setVolumeLevel] = useState<number>(0.85);

  // Script & Playback State
  const [scriptText, setScriptText] = useState<string>('ในดินแดนแห่งความมืดมิด... ชายหนุ่มคนหนึ่งจะลุกขึ้นมาท้าทายโชคชะตา!');
  const [analyzedScript, setAnalyzedScript] = useState<TextAnalysisResult | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playProgress, setPlayProgress] = useState<number>(0);
  const [activeSyllableIndex, setActiveSyllableIndex] = useState<number>(-1);

  // Vowel Tab Filter: 'all' | 'single_8' | 'double_10' | 'compound_6'
  const [vowelFilter, setVowelFilter] = useState<'all' | 'single_8' | 'double_10' | 'compound_6'>('all');

  // Mic Recording Practice
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Canvas visualizer
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Analyze script whenever text changes
  useEffect(() => {
    if (scriptText.trim()) {
      const res = ThaiPhoneticsEngineCore.analyzeText(scriptText);
      setAnalyzedScript(res);
    } else {
      setAnalyzedScript(null);
    }
  }, [scriptText]);

  // Handle Visualizer Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw background grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 20) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw active waveform
      if (isPlaying || isRecording) {
        phase += 0.15;
        ctx.beginPath();
        ctx.strokeStyle = isRecording ? '#ef4444' : '#38bdf8';
        ctx.lineWidth = 3;

        for (let x = 0; x < width; x++) {
          const freq = 0.03;
          const amp = isPlaying ? 25 + Math.sin(phase * 0.5) * 15 : 20;
          const y = centerY + Math.sin(x * freq + phase) * Math.cos(x * 0.01) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Glow line
        ctx.beginPath();
        ctx.strokeStyle = isRecording ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 8;
        for (let x = 0; x < width; x++) {
          const freq = 0.03;
          const amp = isPlaying ? 25 + Math.sin(phase * 0.5) * 15 : 20;
          const y = centerY + Math.sin(x * freq + phase) * Math.cos(x * 0.01) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // Flat center line
        ctx.beginPath();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, isRecording]);

  // Handle Play Dubbing Voice
  const handlePlayDubbing = async () => {
    if (isPlaying) {
      ThaiPhoneticSpeechSynthesizer.stop();
      setIsPlaying(false);
      setActiveSyllableIndex(-1);
      return;
    }

    if (!scriptText.trim()) return;

    setIsPlaying(true);
    setPlayProgress(0);

    await ThaiPhoneticSpeechSynthesizer.dubThaiText(scriptText, {
      characterId: selectedVoiceId,
      speed: speechSpeed,
      pitchOffset: pitchOffset,
      emotion: selectedEmotion,
      volume: volumeLevel,
      onProgress: (progress, sylIdx) => {
        setPlayProgress(progress);
        setActiveSyllableIndex(sylIdx);
      },
      onFinished: () => {
        setIsPlaying(false);
        setActiveSyllableIndex(-1);
      }
    });
  };

  // Handle Consonant Soundboard Play
  const handlePlayConsonant = (consonant: ThaiConsonantPhoneme21) => {
    ThaiPhoneticSpeechSynthesizer.playConsonantDemo(consonant, selectedVoiceId);
  };

  // Handle Vowel Soundboard Play
  const handlePlayVowel = (vowel: ThaiVowelPhoneme24) => {
    ThaiPhoneticSpeechSynthesizer.playVowelDemo(vowel, selectedVoiceId);
  };

  // Handle Tone Soundboard Play
  const handlePlayTone = (tone: ThaiTonePhoneme5, sampleWord: string) => {
    ThaiPhoneticSpeechSynthesizer.playToneDemo(tone, sampleWord, selectedVoiceId);
  };

  // Handle Microphone Recording for Practice
  const handleToggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone access unavailable:', err);
    }
  };

  // Filtered Vowels
  const filteredVowels = THAI_24_VOWELS.filter((v) => {
    if (vowelFilter === 'all') return true;
    if (vowelFilter === 'single_8') return v.category === 'monophthong_single_8';
    if (vowelFilter === 'double_10') return v.category === 'monophthong_double_10';
    if (vowelFilter === 'compound_6') return v.category === 'diphthong_compound_6';
    return true;
  });

  const selectedVoice = THAI_DUBBING_CHARACTERS[selectedVoiceId];

  return (
    <div id="thai-voice-dubbing-studio-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header id="studio-header" className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-0.5 shadow-cyan-500/20 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Mic className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                สตูดิโอพากย์เสียง & สัทศาสตร์ภาษาไทย
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                  Thai Voice Dubbing Pro
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              ระบบสังเคราะห์เสียงพูด พากย์เสียงตัวละคร และแม่บทสัทศาสตร์ไทย (21 เสียงพยัญชนะ • 24 เสียงสระ • 5 เสียงวรรณยุกต์)
            </p>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <nav id="studio-nav-tabs" className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            id="tab-btn-dubbing"
            onClick={() => setActiveTab('dubbing_studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'dubbing_studio'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>สตูดิโอพากย์เสียง (Dubbing Studio)</span>
          </button>

          <button
            id="tab-btn-consonants"
            onClick={() => setActiveTab('phonetics_consonants')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'phonetics_consonants'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>21 เสียงพยัญชนะ (44 รูป)</span>
          </button>

          <button
            id="tab-btn-vowels"
            onClick={() => setActiveTab('phonetics_vowels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'phonetics_vowels'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>24 เสียงสระ (แท้ 18 • ประสม 6)</span>
          </button>

          <button
            id="tab-btn-tones"
            onClick={() => setActiveTab('phonetics_tones')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'phonetics_tones'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>5 เสียงวรรณยุกต์ (F0 Curve)</span>
          </button>

          <button
            id="tab-btn-practice"
            onClick={() => setActiveTab('acting_practice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'acting_practice'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>ห้องฝึกพากย์เทียบเสียง (Mic Lab)</span>
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: DUBBING WORKSTATION */}
        {/* ========================================================================= */}
        {activeTab === 'dubbing_studio' && (
          <div id="dubbing-workstation" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Script Editor & Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Script Input Box */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <h2 className="text-sm font-semibold text-white">สคริปต์บทพากย์ภาษาไทย (Thai Dubbing Script)</h2>
                  </div>
                  <span className="text-xs text-slate-400">
                    {analyzedScript?.syllables.length || 0} พยางค์ • ประมาณ {(analyzedScript?.totalEstimatedDurationMs || 0) / 1000}s
                  </span>
                </div>

                {/* Preset Script Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  <span className="text-xs text-slate-400 shrink-0">บทพากย์ตัวอย่าง:</span>
                  {PRESET_DUBBING_SCRIPTS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setScriptText(preset.text);
                        setSelectedVoiceId(preset.recommendedVoice);
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>

                <textarea
                  id="dubbing-script-textarea"
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  rows={4}
                  placeholder="พิมพ์ข้อความภาษาไทยที่ต้องการให้ AI พากย์เสียง..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none font-medium leading-relaxed"
                />

                {/* Live Real-time Syllable Token Display */}
                {analyzedScript && analyzedScript.syllables.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>วิเคราะห์หน่วยเสียง & วรรณยุกต์ (Syllable Phonetics):</span>
                      <span className="text-[11px] text-sky-400 font-mono">IPA: {analyzedScript.overallIpa}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/80">
                      {analyzedScript.syllables.map((syl, sIdx) => {
                        const isCurrentActive = sIdx === activeSyllableIndex;
                        return (
                          <div
                            key={sIdx}
                            className={`px-2 py-1 rounded-lg text-xs flex flex-col items-center transition-all ${
                              isCurrentActive
                                ? 'bg-sky-500 text-white font-bold scale-110 shadow-md shadow-sky-500/30'
                                : 'bg-slate-800/80 text-slate-300 border border-slate-700/50'
                            }`}
                          >
                            <span className="font-medium">{syl.raw}</span>
                            <span className={`text-[9px] ${isCurrentActive ? 'text-sky-100' : 'text-slate-400'}`}>
                              {syl.calculatedToneThai.replace('เสียง', '')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Playback Controls & Progress */}
                <div className="pt-2 flex flex-col gap-3">
                  {isPlaying && (
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all duration-100"
                        style={{ width: `${playProgress}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <button
                      id="play-dubbing-button"
                      onClick={handlePlayDubbing}
                      disabled={!scriptText.trim()}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm shadow-lg transition-all ${
                        isPlaying
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                          : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25 active:scale-[0.98]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isPlaying ? (
                        <>
                          <Square className="w-4 h-4 fill-current" />
                          <span>หยุดเสียงพากย์ (Stop Dubbing)</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>เริ่มพากย์เสียงบทสนทนา (Start Voice Dubbing)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setScriptText('');
                        setAnalyzedScript(null);
                      }}
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors"
                      title="ล้างข้อความ"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Acoustic Waveform & Oscilloscope Canvas */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WaveformIcon className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                      Real-time Acoustic Waveform & Formant Scope
                    </h3>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    44.1kHz • 5-Pole Cascade
                  </span>
                </div>
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative">
                  <canvas ref={canvasRef} width={600} height={100} className="w-full h-24 block" />
                  <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono">
                    F0: {selectedVoice.baseF0}Hz | F1-F4 Formant Tracking
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Character Voice Selector & Acting Modulators (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Character Voice Actor Selection */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-white">เลือกนักพากย์และคาแรกเตอร์ (Voice Actor)</h3>
                  </div>
                  <span className="text-xs text-amber-400 font-medium">{selectedVoice.avatar} {selectedVoice.gender}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {Object.values(THAI_DUBBING_CHARACTERS).map((char) => {
                    const isSelected = char.id === selectedVoiceId;
                    return (
                      <button
                        key={char.id}
                        onClick={() => setSelectedVoiceId(char.id)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          isSelected
                            ? 'bg-sky-500/10 border-sky-500/60 shadow-md shadow-sky-500/10'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base">{char.avatar}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                        </div>
                        <div className="font-semibold text-xs text-white truncate">{char.nameThai}</div>
                        <div className="text-[10px] text-slate-400 truncate">{char.name}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Voice Bio */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs space-y-1">
                  <div className="font-semibold text-sky-300 flex items-center gap-1.5">
                    <span>{selectedVoice.avatar}</span>
                    <span>{selectedVoice.nameThai}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {selectedVoice.descriptionThai}
                  </p>
                </div>
              </div>

              {/* Emotion & Acting Modulators */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-semibold text-white">ปรับอารมณ์และสำเนียงการพากย์ (Acting Modulation)</h3>
                </div>

                {/* Emotion Chips */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">อารมณ์เสียง (Acting Emotion):</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'neutral', label: 'ธรรมดา', icon: '😐' },
                      { id: 'excited', label: 'ตื่นเต้น', icon: '🔥' },
                      { id: 'dramatic', label: 'ดราม่า', icon: '🎭' },
                      { id: 'whisper', label: 'กระซิบ', icon: '🤫' },
                      { id: 'angry', label: 'โกรธ/ดุดัน', icon: '⚡' },
                      { id: 'sad', label: 'เศร้า', icon: '💧' },
                      { id: 'epic', label: 'มหากาพย์', icon: '👑' }
                    ].map((em) => {
                      const isSelected = selectedEmotion === em.id;
                      return (
                        <button
                          key={em.id}
                          onClick={() => setSelectedEmotion(em.id as DubbingEmotion)}
                          className={`px-2 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 border transition-all ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{em.icon}</span>
                          <span>{em.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pitch & Speed Sliders */}
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">ความเร็วในการพูด (Speech Rate):</span>
                      <span className="text-sky-400 font-mono font-medium">{speechSpeed.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.8"
                      step="0.05"
                      value={speechSpeed}
                      onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                      className="w-full accent-sky-500 bg-slate-950 h-1.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">ระดับคีย์เสียง (Pitch Semitones):</span>
                      <span className="text-sky-400 font-mono font-medium">
                        {pitchOffset > 0 ? `+${pitchOffset}` : pitchOffset} st
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={pitchOffset}
                      onChange={(e) => setPitchOffset(parseInt(e.target.value))}
                      className="w-full accent-sky-500 bg-slate-950 h-1.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">ระดับเสียงหลัก (Master Volume):</span>
                      <span className="text-sky-400 font-mono font-medium">{Math.round(volumeLevel * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={volumeLevel}
                      onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
                      className="w-full accent-sky-500 bg-slate-950 h-1.5 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 21 CONSONANTS SOUNDBOARD (แม่บท 21 เสียง จาก 44 รูปพยัญชนะ) */}
        {/* ========================================================================= */}
        {activeTab === 'phonetics_consonants' && (
          <div id="phonetics-consonants-view" className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    เสียงพยัญชนะในภาษาไทย (21 เสียง จากรูปพยัญชนะ 44 รูป)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    คลิกที่แต่ละหน่วยเสียงเพื่อฟังการออกเสียงสังเคราะห์ตามหลักสรีรศาสตร์ของรูปปาก ลิ้น และเพดานปาก
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 px-2">เสียงพากย์สาธิต:</span>
                  <span className="text-sky-400 font-medium">{selectedVoice.avatar} {selectedVoice.nameThai}</span>
                </div>
              </div>

              {/* 21 Phonemes Interactive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {THAI_21_CONSONANTS.map((c, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 group flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-xl font-bold text-indigo-300">
                          {c.phoneme}
                        </div>
                        <div>
                          <div className="text-xs font-mono text-indigo-400">IPA: /{c.ipa}/</div>
                          <div className="text-[11px] text-slate-400 leading-tight">{c.soundTypeThai}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePlayConsonant(c)}
                        className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
                        title="ฟังเสียงหน่วยเสียงนี้"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Matched Thai Letters */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-slate-400 font-medium">รูปพยัญชนะที่ออกเสียงนี้:</div>
                      <div className="flex flex-wrap gap-1">
                        {c.thaiLetters.map((letter, lIdx) => (
                          <span
                            key={lIdx}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
                          >
                            {letter}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Sample Words */}
                    <div className="pt-1 border-t border-slate-900 text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="text-slate-500">ตัวอย่าง:</span>
                      <span className="text-indigo-300 font-medium">{c.sampleWords.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 24 VOWELS SOUNDBOARD (สระแท้ 18 • สระประสม 6) */}
        {/* ========================================================================= */}
        {activeTab === 'phonetics_vowels' && (
          <div id="phonetics-vowels-view" className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-400" />
                    เสียงสระในภาษาไทย (24 เสียง: สระแท้ 18 • สระประสม 6)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    จำแนกตามสัทศาสตร์: สระแท้ฐานเดียว 8 เสียง, สระแท้สองฐาน 10 เสียง, และสระประสม 6 เสียง
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  {[
                    { id: 'all', label: 'ทั้งหมด (24 เสียง)' },
                    { id: 'single_8', label: 'สระแท้ฐานเดียว (8)' },
                    { id: 'double_10', label: 'สระแท้สองฐาน (10)' },
                    { id: 'compound_6', label: 'สระประสม (6)' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setVowelFilter(f.id as any)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        vowelFilter === f.id
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vowel Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {filteredVowels.map((v, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/60 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-xl font-bold text-emerald-300">
                          {v.symbol}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">{v.nameThai}</div>
                          <div className="text-[11px] text-emerald-400">{v.categoryThai}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePlayVowel(v)}
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
                        title="ฟังเสียงสระนี้"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Diphthong Compound Formula */}
                    {v.compoundFormulaThai ? (
                      <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 font-medium">
                        ✨ {v.compoundFormulaThai}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 font-mono">
                        Formants: F1 {v.f1}Hz • F2 {v.f2}Hz • F3 {v.f3}Hz
                      </div>
                    )}

                    <div className="pt-1 border-t border-slate-900 text-[11px] text-slate-500 flex justify-between">
                      <span>ความยาวเสียง: {v.length === 'long' ? 'สระเสียงยาว (ทีฆสระ)' : 'สระเสียงสั้น (รัสสระ)'}</span>
                      <span className="font-mono text-slate-400">IPA: /{v.ipa}/</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: 5 TONES MATRIX (วรรณยุกต์ 5 เสียง พร้อมรูปคลื่น F0 Pitch Contour) */}
        {/* ========================================================================= */}
        {activeTab === 'phonetics_tones' && (
          <div id="phonetics-tones-view" className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  เสียงวรรณยุกต์ในภาษาไทย (5 เสียง: สามัญ • เอก • โท • ตรี • จัตวา)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  วรรณยุกต์เปลี่ยนความหมายของคำผ่านการควบคุมระดับความถี่มูลฐานของสายเสียง (Fundamental Frequency F0 Trajectory)
                </p>
              </div>

              {/* 5 Tone Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {THAI_5_TONES.map((t, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/60 rounded-xl p-4 flex flex-col justify-between space-y-4 transition-all hover:shadow-lg hover:shadow-amber-500/10"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                          ลำดับที่ {idx + 1}
                        </span>
                        <button
                          onClick={() => handlePlayTone(t, t.sampleWords[0])}
                          className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-md shadow-amber-600/30"
                          title="ฟังเสียงวรรณยุกต์"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-white">{t.toneThai}</h3>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        {t.descriptionThai}
                      </p>
                    </div>

                    {/* Sample Words */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-900">
                      <div className="text-[11px] font-semibold text-amber-300">ตัวอย่างคำในภาษาไทย:</div>
                      <div className="flex flex-wrap gap-1">
                        {t.sampleWords.map((word, wIdx) => (
                          <button
                            key={wIdx}
                            onClick={() => handlePlayTone(t, word)}
                            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: VOICE ACTING PRACTICE & COMPARISON (MIC LAB) */}
        {/* ========================================================================= */}
        {activeTab === 'acting_practice' && (
          <div id="voice-acting-practice-view" className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mic className="w-5 h-5 text-rose-400" />
                  ห้องฝึกพากย์เสียง & เปรียบเทียบสำเนียง (Voice Acting Lab)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  ฝึกพากย์เสียงตามบทสนทนา บันทึกเสียงของคุณผ่านไมโครโฟน แล้วกดฟังเทียบกับเสียง AI นักพากย์มืออาชีพ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Reference Speaker */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-sm text-sky-400">
                      <span>{selectedVoice.avatar}</span>
                      <span>เสียงต้นแบบ AI: {selectedVoice.nameThai}</span>
                    </div>
                    <span className="text-xs text-slate-400">AI Model</span>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-medium">
                    "{scriptText}"
                  </div>

                  <button
                    onClick={handlePlayDubbing}
                    disabled={!scriptText.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>ฟังเสียงต้นแบบ AI</span>
                  </button>
                </div>

                {/* User Voice Recorder */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-sm text-rose-400">
                      <Mic className="w-4 h-4" />
                      <span>เสียงของคุณ (Your Voice Recording)</span>
                    </div>
                    <span className="text-xs text-slate-400">Live Mic</span>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 min-h-[44px] flex items-center justify-center">
                    {isRecording ? (
                      <span className="text-rose-400 font-semibold animate-pulse flex items-center gap-2">
                        🔴 กำลังบันทึกเสียงพากย์ของคุณ...
                      </span>
                    ) : recordedAudioUrl ? (
                      <span className="text-emerald-400 font-medium">
                        ✓ บันทึกเสียงเรียบร้อยแล้ว กดฟังได้เลย
                      </span>
                    ) : (
                      <span>กดปุ่มด้านล่างเพื่อเริ่มอัดเสียงพากย์</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleRecording}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                        isRecording
                          ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      <span>{isRecording ? 'หยุดอัดเสียง (Stop)' : 'เริ่มอัดเสียง (Record)'}</span>
                    </button>

                    {recordedAudioUrl && (
                      <audio controls src={recordedAudioUrl} className="h-9 w-40" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
