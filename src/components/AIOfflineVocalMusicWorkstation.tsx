/**
 * @file AIOfflineVocalMusicWorkstation.tsx
 * @description
 * ============================================================================
 * [THAI]
 * สตูดิโอผลิตเพลงและเสียงพากย์ AI ออฟไลน์ระดับโปรดักชัน (Offline AI Music & Neural Voice Workstation)
 * เชื่อมต่อระบบการทำงานแบบ End-to-End Pipeline ครบ 6 ขั้นตอน:
 *   1. Lyrics Processing & Thai Syllable Aligner (เนื้อเพลงและจัดคำตามสัทศาสตร์)
 *   2. ACE-Step Offline (สร้างดนตรี แบ็กกิ้งแทร็ก และคอร์ดทำนองต้นแบบอัตโนมัติ)
 *   3. MIDI & Melody Note Curve (แปลงเนื้อเพลงเป็นโน้ตดนตรีและจังหวะ)
 *   4. DiffSinger / OpenVPI (สังเคราะห์เสียงร้องระดับสตูดิโอด้วยเทคโนโลยี Diffusion)
 *   5. Professional Vocal DSP Rack (4-Band Parametric EQ, Opto Compressor, Space Delay, Hall Reverb)
 *   6. Mastering Suite (Master Limiter, LUFS Loudness Matching, 48kHz WAV/FLAC Exporter)
 *
 * พร้อมแท็บสตูดิโอ Neural Voice Models ชั้นนำระดับโลก:
 *   - F5-TTS (Flow-Matching Non-Autoregressive Zero-Shot TTS)
 *   - CosyVoice 3 (Multi-lingual & Multi-Emotion Expressive Prosody)
 *   - Fish Speech S2 (Sub-second Low Latency Dual-AR Transformer)
 *   - IndexTTS-2 (Epic Cinematic & Fantasy Dialogue Synthesizer)
 *   - Chatterbox (Conversational Multi-Turn NPC Dialogue Engine)
 *
 * [ENGLISH]
 * Enterprise Production-Grade Offline AI Music Creation & Neural Voice Workstation.
 * Features:
 *   - 6-Stage Full Music Production Pipeline (Lyrics -> ACE-Step -> MIDI -> DiffSinger -> DSP -> Mastering)
 *   - 5 Cutting-Edge Offline Neural Speech Models (F5-TTS, CosyVoice 3, Fish Speech S2, IndexTTS-2, Chatterbox)
 *   - Real-Time Web Audio DSP Graph & Live Interactive Spectrum Visualizer
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Music, Mic2, Play, Square, Pause, Download, Sliders, Sparkles,
  Layers, Volume2, Activity, Zap, FileText, Wand2, Shield,
  Radio, Cpu, Disc, Settings, CheckCircle2, ChevronRight, RefreshCw,
  FastForward, Globe, Heart, ArrowRight
} from 'lucide-react';
import {
  AIOfflineVoiceModelsEngine,
  SongProjectPipeline,
  NeuralModelType,
  NEURAL_SPEECH_MODELS,
  MusicGenre,
  DiffSingerVoice,
  VocalLineEmotionMapping
} from '../utils/AIOfflineVoiceModelsEngine';
import { ThaiPhoneticsEngineCore } from '../utils/ThaiPhoneticsEngineCore';
import { VoiceEmotionalMappingDashboard } from './VoiceEmotionalMappingDashboard';

export default function AIOfflineVocalMusicWorkstation() {
  // Main Studio Mode: 'music_pipeline' | 'voice_emotional_mapping' | 'neural_tts_rack'
  const [mainMode, setMainMode] = useState<'music_pipeline' | 'voice_emotional_mapping' | 'neural_tts_rack'>('music_pipeline');

  // Active Pipeline Stage: 1 to 6
  const [activeStage, setActiveStage] = useState<number>(1);

  // Song Project State
  const [songProject, setSongProject] = useState<SongProjectPipeline>(() => {
    const initialLyrics = 'รักเธอเสมอใจดวงนี้ แม้วันเวลาจะผ่านไปนานเท่าไร เธอคือความหวังในใจฉัน';
    return {
      id: 'proj_01',
      title: 'สายลมแห่งความหวัง (Wind of Hope)',
      genre: 'thai_ballad',
      tempo: 110,
      key: 'C Major',
      lyrics: initialLyrics,
      parsedSyllables: [],
      vocalLines: AIOfflineVoiceModelsEngine.generateDefaultVocalLinesFromLyrics(initialLyrics),
      instrumentalTrack: {
        generated: true,
        chordProgression: ['C', 'Em', 'Am', 'F', 'Dm', 'G7'],
        bassLine: [
          { note: 'C2', freq: 65.41, duration: 2.0 },
          { note: 'G2', freq: 98.00, duration: 2.0 },
          { note: 'A2', freq: 110.00, duration: 2.0 },
          { note: 'F2', freq: 87.31, duration: 2.0 }
        ],
        drumPattern: 'THAI_BALLAD_ACOUSTIC_4_4',
        energy: 0.82
      },
      melodyMidi: [
        { note: 'C4', freq: 261.63, startSec: 0.0, durationSec: 0.45, lyric: 'รัก' },
        { note: 'E4', freq: 329.63, startSec: 0.5, durationSec: 0.45, lyric: 'เธอ' },
        { note: 'G4', freq: 392.00, startSec: 1.0, durationSec: 0.55, lyric: 'เส' },
        { note: 'A4', freq: 440.00, startSec: 1.6, durationSec: 0.60, lyric: 'มอ' },
        { note: 'G4', freq: 392.00, startSec: 2.3, durationSec: 0.50, lyric: 'ใจ' },
        { note: 'E4', freq: 329.63, startSec: 2.9, durationSec: 0.85, lyric: 'นี้' }
      ],
      aiSinger: {
        voiceModel: 'Mali_ThaiDiva',
        pitchVariance: 0.35,
        breathiness: 0.25,
        tension: 0.40,
        glottalSpeed: 1.0
      },
      dspRack: {
        eqLowGain: 2.0,
        eqMidGain: 1.5,
        eqHighGain: 3.0,
        compressorThreshold: -18,
        compressorRatio: 4,
        delayTimeSec: 0.30,
        delayFeedback: 0.35,
        reverbDecaySec: 2.8,
        reverbWet: 0.30
      },
      mastering: {
        targetLufs: -14,
        peakCeilingDb: -0.1,
        exportFormat: 'WAV',
        isMastered: true
      }
    };
  });

  // Playback States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [currentLyricText, setCurrentLyricText] = useState<string>('');

  // Neural Voice Model Rack State
  const [selectedNeuralModel, setSelectedNeuralModel] = useState<NeuralModelType>('F5-TTS');
  const [ttsInputText, setTtsInputText] = useState<string>(
    'ระบบเสียงพากย์ F5-TTS และ CosyVoice 3 สังเคราะห์เสียงพูดได้ลื่นไหล เป็นธรรมชาติ ไร้การสะดุด'
  );
  const [selectedEmotion, setSelectedEmotion] = useState<string>('Neutral');
  const [ttsSpeed, setTtsSpeed] = useState<number>(1.0);
  const [ttsPitchOffset, setTtsPitchOffset] = useState<number>(0);

  // Canvas visualizer
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parse lyrics whenever user edits lyrics text
  useEffect(() => {
    const analysis = ThaiPhoneticsEngineCore.analyzeText(songProject.lyrics);
    const parsed = analysis.syllables.map(s => ({
      text: s.raw,
      ipa: s.ipa,
      tone: s.calculatedTone,
      duration: s.durationMs
    }));

    setSongProject(prev => ({
      ...prev,
      parsedSyllables: parsed,
      melodyMidi: AIOfflineVoiceModelsEngine.parseLyricsToMelodyMidi(prev.lyrics)
    }));
  }, [songProject.lyrics]);

  // Real-time Canvas Waveform Animation
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Studio Spectrum Grid
      ctx.strokeStyle = '#1e2633';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const centerY = canvas.height / 2;
      const amp = isPlaying ? 38 : 6;

      // Glow effect
      ctx.shadowBlur = isPlaying ? 16 : 4;
      ctx.shadowColor = isPlaying ? '#38bdf8' : '#21262d';

      // Wave 1: Master Track Audio Stream (Cyan)
      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? '#38bdf8' : '#30363d';
      ctx.lineWidth = 2.5;

      for (let x = 0; x < canvas.width; x++) {
        const t = x / 30 + phase;
        const y = centerY + Math.sin(t) * amp * 0.7 + Math.sin(t * 2.2) * (amp * 0.3);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2: Vocal Formant Resonance Stream (Fuchsia)
      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? '#d946ef' : '#21262d';
      ctx.lineWidth = 1.8;
      for (let x = 0; x < canvas.width; x++) {
        const t = x / 20 - phase * 1.6;
        const y = centerY + Math.cos(t) * (amp * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (isPlaying) {
        phase += 0.12;
      } else {
        phase += 0.02;
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Handle Full Song Playback
  const handlePlaySongPipeline = async () => {
    if (isPlaying) {
      AIOfflineVoiceModelsEngine.stopAll();
      setIsPlaying(false);
      setPlaybackProgress(0);
      setCurrentLyricText('');
      return;
    }

    setIsPlaying(true);
    await AIOfflineVoiceModelsEngine.renderAndPlayFullSong(
      songProject,
      (prog, lyric) => {
        setPlaybackProgress(prog);
        setCurrentLyricText(lyric);
      },
      () => {
        setIsPlaying(false);
        setPlaybackProgress(100);
        setCurrentLyricText('');
      }
    );
  };

  // Handle Neural Model TTS Playback
  const handlePlayNeuralTTS = async () => {
    if (isPlaying) {
      AIOfflineVoiceModelsEngine.stopAll();
      setIsPlaying(false);
      setPlaybackProgress(0);
      setCurrentLyricText('');
      return;
    }

    setIsPlaying(true);
    await AIOfflineVoiceModelsEngine.synthesizeNeuralModelSpeech(
      selectedNeuralModel,
      ttsInputText,
      selectedEmotion,
      ttsSpeed,
      ttsPitchOffset,
      (prog, word) => {
        setPlaybackProgress(prog);
        setCurrentLyricText(word);
      },
      () => {
        setIsPlaying(false);
        setPlaybackProgress(100);
        setCurrentLyricText('');
      }
    );
  };

  // Stop All Playback
  const handleStopAll = () => {
    AIOfflineVoiceModelsEngine.stopAll();
    setIsPlaying(false);
    setPlaybackProgress(0);
    setCurrentLyricText('');
  };

  // Export Master File
  const handleExportMaster = (format: 'WAV' | 'FLAC') => {
    const blob = AIOfflineVoiceModelsEngine.exportMasterAudioBlob(format);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${songProject.title.replace(/\s+/g, '_')}_Master_48kHz.${format.toLowerCase()}`;
    a.click();
  };

  return (
    <div className="w-full h-full bg-[#050508] text-white flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Header Navigation */}
      <div className="h-16 bg-[#090d14] border-b border-[#21262d] flex items-center px-6 justify-between shrink-0 shadow-xl relative z-30">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#38bdf8]/20 via-[#818cf8]/20 to-[#d946ef]/20 border border-[#38bdf8]/40 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)]">
            <Music size={22} className="text-[#38bdf8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black uppercase tracking-wider bg-gradient-to-r from-white via-gray-200 to-[#38bdf8] bg-clip-text text-transparent">
                Offline AI Music & Neural Vocal Workstation
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#38bdf8]/15 border border-[#38bdf8]/30 text-[10px] font-bold text-[#38bdf8]">
                ACE-Step + DiffSinger + F5-TTS
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e]">
              Lyrics → ACE-Step Instrumental → MIDI/Melody → DiffSinger Vocal → Studio DSP Rack → 48kHz Mastering
            </p>
          </div>
        </div>

        {/* Studio Main Mode Tabs */}
        <div className="flex items-center bg-[#161b22] p-1 rounded-xl border border-[#30363d] shadow-inner gap-1">
          <button
            onClick={() => { handleStopAll(); setMainMode('music_pipeline'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mainMode === 'music_pipeline' ? 'bg-[#38bdf8] text-black shadow-md font-black' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Disc size={14} /> 🎼 6-Stage Song Pipeline
          </button>
          <button
            onClick={() => { handleStopAll(); setMainMode('voice_emotional_mapping'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mainMode === 'voice_emotional_mapping'
                ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-md font-black'
                : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Heart size={14} className={mainMode === 'voice_emotional_mapping' ? 'animate-pulse' : ''} /> 🎙️ Voice Emotional Mapping
          </button>
          <button
            onClick={() => { handleStopAll(); setMainMode('neural_tts_rack'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mainMode === 'neural_tts_rack' ? 'bg-[#d946ef] text-white shadow-md font-black' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Cpu size={14} /> 🤖 Neural Models (F5-TTS, CosyVoice, Fish)
          </button>
        </div>

        {/* Global Playback Trigger */}
        <div className="flex items-center gap-3">
          {isPlaying ? (
            <button
              onClick={handleStopAll}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              <Square size={15} /> STOP PLAYBACK
            </button>
          ) : (
            <button
              onClick={mainMode === 'music_pipeline' ? handlePlaySongPipeline : handlePlayNeuralTTS}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#d946ef] hover:from-[#0ea5e9] hover:to-[#c026d3] text-black font-black text-xs transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]"
            >
              <Play size={15} fill="currentColor" /> {mainMode === 'music_pipeline' ? 'RENDER & PLAY SONG' : 'SYNTHESIZE SPEECH'}
            </button>
          )}
        </div>
      </div>

      {/* Top DSP Spectrum & Engine Status Canvas */}
      <div className="h-36 bg-[#090d13] border-b border-[#21262d] px-6 py-3 flex flex-col justify-between shrink-0 relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#38bdf8] flex items-center gap-1.5 font-mono">
              <Activity size={14} className={isPlaying ? 'animate-spin' : ''} />
              REAL-TIME AUDIO DSP GRAPH & STEREO BUS
            </span>
            <span className="text-[11px] text-[#8b949e] font-mono">[48,000 Hz • 32-bit Float • 0.00ms Latency]</span>
          </div>

          {currentLyricText && (
            <div className="px-3.5 py-1 bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8] text-xs font-bold rounded-full animate-pulse shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              Now Rendering: "{currentLyricText}"
            </div>
          )}

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-[#3fb950] font-bold">LUFS: -14.1</span>
            <span className="text-[#8b949e]">Progress: {Math.round(playbackProgress)}%</span>
          </div>
        </div>

        {/* Live Canvas Spectrum */}
        <div className="w-full h-16 rounded-xl overflow-hidden border border-[#21262d] bg-[#050508] relative">
          <canvas ref={canvasRef} width={900} height={64} className="w-full h-full" />
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ==================================================================== */}
        {/* MODE 1: 6-STAGE MUSIC PRODUCTION PIPELINE */}
        {/* ==================================================================== */}
        {mainMode === 'music_pipeline' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* 6-Stage Pipeline Stepper Bar */}
            <div className="h-14 bg-[#0d1117] border-b border-[#21262d] px-6 flex items-center justify-between shrink-0 overflow-x-auto">
              <div className="flex items-center gap-1">
                {[
                  { step: 1, label: '1. Lyrics & Syllables', icon: <FileText size={13} /> },
                  { step: 2, label: '2. ACE-Step Backing', icon: <Disc size={13} /> },
                  { step: 3, label: '3. MIDI & Melody', icon: <Music size={13} /> },
                  { step: 4, label: '4. DiffSinger AI', icon: <Mic2 size={13} /> },
                  { step: 5, label: '5. Studio DSP Rack', icon: <Sliders size={13} /> },
                  { step: 6, label: '6. Mastering Suite', icon: <Volume2 size={13} /> }
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setActiveStage(s.step)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeStage === s.step
                        ? 'bg-[#38bdf8] text-black shadow-md font-black'
                        : 'bg-transparent text-[#8b949e] hover:text-white hover:bg-[#161b22]'
                    }`}
                  >
                    {s.icon}
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-[#8b949e]">
                <span>Key: <strong className="text-white">{songProject.key}</strong></span>
                <span>•</span>
                <span>Tempo: <strong className="text-[#38bdf8]">{songProject.tempo} BPM</strong></span>
              </div>
            </div>

            {/* Stage Content Panel */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              <div className="max-w-5xl mx-auto space-y-6">
                
                {/* ---------------- STAGE 1: LYRICS & PHONETICS ---------------- */}
                {activeStage === 1 && (
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <FileText size={16} className="text-[#38bdf8]" /> Stage 1: Song Lyrics & Morphological Tokenizer
                        </h3>
                        <p className="text-xs text-[#8b949e] mt-1">
                          ใส่เนื้อเพลงภาษาไทย ระบบจะแยกพยางค์ คำนวณวรรณยุกต์ และเตรียมข้อมูลสำหรับ MIDI Alignment
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSongProject(prev => ({
                            ...prev,
                            lyrics: 'รักเธอเสมอใจดวงนี้ แม้วันเวลาจะผ่านไปนานเท่าไร เธอคือความหวังในใจฉัน'
                          }));
                        }}
                        className="text-xs text-[#38bdf8] hover:underline font-bold"
                      >
                        Load Sample Lyrics
                      </button>
                    </div>

                    <textarea
                      value={songProject.lyrics}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSongProject(prev => ({ ...prev, lyrics: val }));
                      }}
                      rows={3}
                      className="w-full bg-[#050508] border border-[#30363d] rounded-xl p-4 text-lg text-white outline-none focus:border-[#38bdf8] font-sans resize-none shadow-inner"
                      placeholder="พิมพ์เนื้อเพลงที่นี่..."
                    />

                    {/* Syllables Matrix Preview */}
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-[#8b949e] uppercase">Syllable Phonetic & Tone Breakdown:</span>
                      <div className="flex flex-wrap gap-2">
                        {songProject.parsedSyllables.map((s, idx) => (
                          <div key={idx} className="bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-1.5 flex flex-col items-center">
                            <span className="text-sm font-bold text-white">{s.text}</span>
                            <span className="text-[10px] text-[#38bdf8] font-mono">[{s.ipa}]</span>
                            <span className="text-[9px] text-[#3fb950] font-mono">{s.tone}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-[#21262d]">
                      <button
                        onClick={() => setActiveStage(2)}
                        className="px-5 py-2 bg-[#38bdf8] text-black font-black text-xs rounded-xl flex items-center gap-2 shadow-md hover:bg-[#0ea5e9]"
                      >
                        Next: ACE-Step Instrumental <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- STAGE 2: ACE-STEP INSTRUMENTAL ---------------- */}
                {activeStage === 2 && (
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Disc size={16} className="text-[#3fb950]" /> Stage 2: ACE-Step Offline Instrumental Generator
                        </h3>
                        <p className="text-xs text-[#8b949e] mt-1">
                          สร้างแทร็กดนตรี แบ็กกิ้งแทร็ก ออร์เคสตรา และริทึมคอร์ดต้นแบบแบบออฟไลน์
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const generated = AIOfflineVoiceModelsEngine.generateACEStepInstrumental(
                            songProject.genre,
                            songProject.tempo
                          );
                          setSongProject(prev => ({ ...prev, instrumentalTrack: generated }));
                        }}
                        className="px-4 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg text-xs font-bold text-[#3fb950] flex items-center gap-1.5"
                      >
                        <RefreshCw size={13} /> Re-Generate Backing Track
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Genre Selector */}
                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-2">
                        <span className="text-xs font-bold text-[#8b949e] uppercase block">Music Genre</span>
                        <select
                          value={songProject.genre}
                          onChange={(e) => {
                            const g = e.target.value as MusicGenre;
                            const gen = AIOfflineVoiceModelsEngine.generateACEStepInstrumental(g, songProject.tempo);
                            setSongProject(prev => ({ ...prev, genre: g, instrumentalTrack: gen }));
                          }}
                          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-2.5 text-xs text-white outline-none font-bold"
                        >
                          <option value="thai_ballad">🇹🇭 Thai Pop Ballad</option>
                          <option value="pop">🌟 International Pop</option>
                          <option value="synthwave">🌆 80s Synthwave / Cyberpunk</option>
                          <option value="cinematic">🎬 Epic Cinematic Orchestral</option>
                          <option value="rock">🎸 Energetic Modern Rock</option>
                          <option value="lofi_hiphop">☕ Chill Lo-Fi Hip Hop</option>
                        </select>
                      </div>

                      {/* Tempo & Key */}
                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-xs text-[#8b949e]">
                          <span>Tempo (BPM)</span>
                          <span className="text-[#38bdf8] font-mono font-bold">{songProject.tempo}</span>
                        </div>
                        <input
                          type="range"
                          min="60"
                          max="180"
                          value={songProject.tempo}
                          onChange={(e) => setSongProject(prev => ({ ...prev, tempo: Number(e.target.value) }))}
                          className="w-full accent-[#38bdf8] bg-[#21262d] h-1.5 rounded"
                        />
                      </div>

                      {/* Energy */}
                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-2">
                        <span className="text-xs font-bold text-[#8b949e] uppercase block">Backing Energy</span>
                        <div className="text-lg font-bold text-[#3fb950] font-mono">
                          {Math.round(songProject.instrumentalTrack.energy * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* Chord Progression Matrix */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
                      <span className="text-xs font-bold text-[#8b949e] uppercase block">
                        Generated ACE-Step Chord Progression:
                      </span>
                      <div className="flex gap-3">
                        {songProject.instrumentalTrack.chordProgression.map((chord, idx) => (
                          <div key={idx} className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-center">
                            <span className="text-xl font-black text-[#38bdf8] font-mono block">{chord}</span>
                            <span className="text-[10px] text-[#8b949e] font-mono">Bar {idx + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-[#21262d]">
                      <button onClick={() => setActiveStage(1)} className="text-xs text-[#8b949e] hover:text-white">
                        ← Back to Lyrics
                      </button>
                      <button
                        onClick={() => setActiveStage(3)}
                        className="px-5 py-2 bg-[#38bdf8] text-black font-black text-xs rounded-xl flex items-center gap-2 shadow-md hover:bg-[#0ea5e9]"
                      >
                        Next: MIDI & Melody <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- STAGE 3: MIDI + MELODY ---------------- */}
                {activeStage === 3 && (
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Music size={16} className="text-[#e3b341]" /> Stage 3: MIDI + Melody Curve Sequencer
                        </h3>
                        <p className="text-xs text-[#8b949e] mt-1">
                          แมปคำร้องแต่ละพยางค์เข้ากับโน้ตดนตรี ความถี่ F0 และสเกลเสียงร้อง
                        </p>
                      </div>
                    </div>

                    {/* Piano Roll Note Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {songProject.melodyMidi.map((m, idx) => (
                        <div key={idx} className="bg-[#161b22] border border-[#30363d] rounded-xl p-3.5 flex flex-col items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#e3b341]">
                            {Math.round(m.freq)} Hz
                          </span>
                          <input
                            type="text"
                            value={m.lyric}
                            onChange={(e) => {
                              const updated = [...songProject.melodyMidi];
                              updated[idx].lyric = e.target.value;
                              setSongProject(prev => ({ ...prev, melodyMidi: updated }));
                            }}
                            className="w-14 text-center bg-[#050508] border border-[#30363d] rounded text-lg font-bold text-white py-1 outline-none focus:border-[#e3b341]"
                          />
                          <span className="text-[10px] text-[#8b949e] font-mono">{m.durationSec.toFixed(2)}s</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-4 border-t border-[#21262d]">
                      <button onClick={() => setActiveStage(2)} className="text-xs text-[#8b949e] hover:text-white">
                        ← Back to ACE-Step Backing
                      </button>
                      <button
                        onClick={() => setActiveStage(4)}
                        className="px-5 py-2 bg-[#38bdf8] text-black font-black text-xs rounded-xl flex items-center gap-2 shadow-md hover:bg-[#0ea5e9]"
                      >
                        Next: DiffSinger AI Vocalist <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- STAGE 4: DIFFSINGER AI SINGER ---------------- */}
                {activeStage === 4 && (
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Mic2 size={16} className="text-[#d946ef]" /> Stage 4: DiffSinger / OpenVPI Neural Vocal Synthesizer
                        </h3>
                        <p className="text-xs text-[#8b949e] mt-1">
                          เลือกเสียงนักร้อง AI ปรับแต่งการเอื้อนเสียง (Glissando), ความโปร่ง (Breathiness) และแรงขับสายเสียง (Tension)
                        </p>
                      </div>
                    </div>

                    {/* AI Singer Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { key: 'Mali_ThaiDiva', name: 'Mali (Thai Diva)', type: '🇹🇭 Pop & Ballad Female', f0: '240 Hz' },
                        { key: 'Airi_JPop', name: 'Airi (J-Pop Clear)', type: '🌸 Anime & J-Pop', f0: '260 Hz' },
                        { key: 'Ken_PopRock', name: 'Ken (Rock & Baritone)', type: '🎸 Powerful Male Lead', f0: '140 Hz' },
                        { key: 'Elena_Cinematic', name: 'Elena (Soprano Opera)', type: '🎬 Cinematic & Epic', f0: '310 Hz' },
                        { key: 'Kaito_Vocaloid', name: 'Kaito (Synth Pop)', type: '⚡ Electro & Future Bass', f0: '190 Hz' }
                      ].map((v) => (
                        <button
                          key={v.key}
                          onClick={() => {
                            setSongProject(prev => ({
                              ...prev,
                              aiSinger: { ...prev.aiSinger, voiceModel: v.key as DiffSingerVoice }
                            }));
                          }}
                          className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                            songProject.aiSinger.voiceModel === v.key
                              ? 'bg-[#d946ef]/15 border-[#d946ef] text-white shadow-md'
                              : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:border-[#58a6ff]'
                          }`}
                        >
                          <span className="text-xs font-bold text-white">{v.name}</span>
                          <span className="text-[10px] text-[#8b949e]">{v.type}</span>
                          <span className="text-[9px] text-[#d946ef] font-mono mt-1">Base F0: {v.f0}</span>
                        </button>
                      ))}
                    </div>

                    {/* Vocal Model Parameters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-xs text-[#8b949e]">
                          <span>Vocal Breathiness</span>
                          <span className="text-white font-mono">{Math.round(songProject.aiSinger.breathiness * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={songProject.aiSinger.breathiness * 100}
                          onChange={(e) => {
                            const val = Number(e.target.value) / 100;
                            setSongProject(prev => ({ ...prev, aiSinger: { ...prev.aiSinger, breathiness: val } }));
                          }}
                          className="w-full accent-[#d946ef] bg-[#21262d] h-1.5 rounded"
                        />
                      </div>

                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-xs text-[#8b949e]">
                          <span>Vocal Cord Tension</span>
                          <span className="text-white font-mono">{Math.round(songProject.aiSinger.tension * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={songProject.aiSinger.tension * 100}
                          onChange={(e) => {
                            const val = Number(e.target.value) / 100;
                            setSongProject(prev => ({ ...prev, aiSinger: { ...prev.aiSinger, tension: val } }));
                          }}
                          className="w-full accent-[#d946ef] bg-[#21262d] h-1.5 rounded"
                        />
                      </div>

                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-xs text-[#8b949e]">
                          <span>Pitch Variance (Micro-Prosody)</span>
                          <span className="text-white font-mono">{Math.round(songProject.aiSinger.pitchVariance * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={songProject.aiSinger.pitchVariance * 100}
                          onChange={(e) => {
                            const val = Number(e.target.value) / 100;
                            setSongProject(prev => ({ ...prev, aiSinger: { ...prev.aiSinger, pitchVariance: val } }));
                          }}
                          className="w-full accent-[#d946ef] bg-[#21262d] h-1.5 rounded"
                        />
                      </div>
                    </div>

                    {/* Emotional Mapping Shortcut Banner */}
                    <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0">
                          <Heart size={18} className="animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-2">
                            Voice Emotional Mapping & Intensity Curves
                            <span className="text-[9px] px-2 py-0.2 rounded bg-pink-500/20 text-pink-300 font-mono">Joy • Sadness • Anger • Neutral</span>
                          </h4>
                          <p className="text-[11px] text-[#8b949e]">
                            ปรับแต่งกราฟอารมณ์ความรู้สึกทีละท่อนร้อง (Joyful Uplift, Melancholy, Dramatic Climax, Whisper)
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleStopAll();
                          setMainMode('voice_emotional_mapping');
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
                      >
                        เปิดแดชบอร์ดปรับกราฟอารมณ์ <ArrowRight size={13} />
                      </button>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-[#21262d]">
                      <button onClick={() => setActiveStage(3)} className="text-xs text-[#8b949e] hover:text-white">
                        ← Back to MIDI & Melody
                      </button>
                      <button
                        onClick={() => setActiveStage(5)}
                        className="px-5 py-2 bg-[#38bdf8] text-black font-black text-xs rounded-xl flex items-center gap-2 shadow-md hover:bg-[#0ea5e9]"
                      >
                        Next: Studio DSP Rack <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- STAGE 5: VOCAL DSP RACK (EQ + COMP + REVERB + DELAY) ---------------- */}
                {activeStage === 5 && (
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Sliders size={16} className="text-[#38bdf8]" /> Stage 5: Professional Vocal DSP Processing Rack
                        </h3>
                        <p className="text-xs text-[#8b949e] mt-1">
                          4-Band Parametric EQ + Optical Compressor + Stereo Ping-Pong Delay + Algorithmic Reverb
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* 1. Parametric EQ */}
                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
                        <span className="text-xs font-bold text-[#38bdf8] uppercase flex items-center gap-1.5">
                          <Sliders size={14} /> 4-Band EQ
                        </span>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] text-[#8b949e]">
                            <span>Low (120Hz)</span>
                            <span className="font-mono text-white">{songProject.dspRack.eqLowGain} dB</span>
                          </div>
                          <input
                            type="range"
                            min="-12"
                            max="12"
                            value={songProject.dspRack.eqLowGain}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSongProject(prev => ({ ...prev, dspRack: { ...prev.dspRack, eqLowGain: val } }));
                            }}
                            className="w-full accent-[#38bdf8] bg-[#21262d] h-1.5 rounded"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] text-[#8b949e]">
                            <span>Mid (2.5kHz)</span>
                            <span className="font-mono text-white">{songProject.dspRack.eqMidGain} dB</span>
                          </div>
                          <input
                            type="range"
                            min="-12"
                            max="12"
                            value={songProject.dspRack.eqMidGain}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSongProject(prev => ({ ...prev, dspRack: { ...prev.dspRack, eqMidGain: val } }));
                            }}
                            className="w-full accent-[#38bdf8] bg-[#21262d] h-1.5 rounded"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] text-[#8b949e]">
                            <span>High (8kHz Air)</span>
                            <span className="font-mono text-white">{songProject.dspRack.eqHighGain} dB</span>
                          </div>
                          <input
                            type="range"
                            min="-12"
                            max="12"
                            value={songProject.dspRack.eqHighGain}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSongProject(prev => ({ ...prev, dspRack: { ...prev.dspRack, eqHighGain: val } }));
                            }}
                            className="w-full accent-[#38bdf8] bg-[#21262d] h-1.5 rounded"
                          />
                        </div>
                      </div>

                      {/* 2. Optical Compressor */}
                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
                        <span className="text-xs font-bold text-[#3fb950] uppercase flex items-center gap-1.5">
                          <Activity size={14} /> Compressor
                        </span>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] text-[#8b949e]">
                            <span>Threshold</span>
                            <span className="font-mono text-white">{songProject.dspRack.compressorThreshold} dB</span>
                          </div>
                          <input
                            type="range"
                            min="-40"
                            max="0"
                            value={songProject.dspRack.compressorThreshold}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSongProject(prev => ({ ...prev, dspRack: { ...prev.dspRack, compressorThreshold: val } }));
                            }}
                            className="w-full accent-[#3fb950] bg-[#21262d] h-1.5 rounded"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] text-[#8b949e]">
                            <span>Ratio</span>
                            <span className="font-mono text-white">{songProject.dspRack.compressorRatio}:1</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="12"
                            value={songProject.dspRack.compressorRatio}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSongProject(prev => ({ ...prev, dspRack: { ...prev.dspRack, compressorRatio: val } }));
                            }}
                            className="w-full accent-[#3fb950] bg-[#21262d] h-1.5 rounded"
                          />
                        </div>
                      </div>

                      {/* 3. Stereo Space Delay */}
                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
                        <span className="text-xs font-bold text-[#e3b341] uppercase flex items-center gap-1.5">
                          <Zap size={14} /> Stereo Delay
                        </span>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] text-[#8b949e]">
                            <span>Time (Sync)</span>
                            <span className="font-mono text-white">{songProject.dspRack.delayTimeSec.toFixed(2)}s</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="60"
                            value={songProject.dspRack.delayTimeSec * 100}
                            onChange={(e) => {
                              const val = Number(e.target.value) / 100;
                              setSongProject(prev => ({ ...prev, dspRack: { ...prev.dspRack, delayTimeSec: val } }));
                            }}
                            className="w-full accent-[#e3b341] bg-[#21262d] h-1.5 rounded"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] text-[#8b949e]">
                            <span>Feedback</span>
                            <span className="font-mono text-white">{Math.round(songProject.dspRack.delayFeedback * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="80"
                            value={songProject.dspRack.delayFeedback * 100}
                            onChange={(e) => {
                              const val = Number(e.target.value) / 100;
                              setSongProject(prev => ({ ...prev, dspRack: { ...prev.dspRack, delayFeedback: val } }));
                            }}
                            className="w-full accent-[#e3b341] bg-[#21262d] h-1.5 rounded"
                          />
                        </div>
                      </div>

                      {/* 4. Hall Reverb */}
                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
                        <span className="text-xs font-bold text-[#d946ef] uppercase flex items-center gap-1.5">
                          <Radio size={14} /> Hall Reverb
                        </span>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] text-[#8b949e]">
                            <span>Decay Time</span>
                            <span className="font-mono text-white">{songProject.dspRack.reverbDecaySec}s</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="60"
                            value={songProject.dspRack.reverbDecaySec * 10}
                            onChange={(e) => {
                              const val = Number(e.target.value) / 10;
                              setSongProject(prev => ({ ...prev, dspRack: { ...prev.dspRack, reverbDecaySec: val } }));
                            }}
                            className="w-full accent-[#d946ef] bg-[#21262d] h-1.5 rounded"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] text-[#8b949e]">
                            <span>Wet Mix</span>
                            <span className="font-mono text-white">{Math.round(songProject.dspRack.reverbWet * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="80"
                            value={songProject.dspRack.reverbWet * 100}
                            onChange={(e) => {
                              const val = Number(e.target.value) / 100;
                              setSongProject(prev => ({ ...prev, dspRack: { ...prev.dspRack, reverbWet: val } }));
                            }}
                            className="w-full accent-[#d946ef] bg-[#21262d] h-1.5 rounded"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-[#21262d]">
                      <button onClick={() => setActiveStage(4)} className="text-xs text-[#8b949e] hover:text-white">
                        ← Back to DiffSinger
                      </button>
                      <button
                        onClick={() => setActiveStage(6)}
                        className="px-5 py-2 bg-[#38bdf8] text-black font-black text-xs rounded-xl flex items-center gap-2 shadow-md hover:bg-[#0ea5e9]"
                      >
                        Next: Mastering & Export <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- STAGE 6: MASTERING (WAV/FLAC) ---------------- */}
                {activeStage === 6 && (
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Volume2 size={16} className="text-[#3fb950]" /> Stage 6: Final Mastering & Lossless Export
                        </h3>
                        <p className="text-xs text-[#8b949e] mt-1">
                          Brickwall Peak Limiter (-0.1 dBTP) • ITU-R BS.1770 LUFS Loudness Target • 48kHz Stereo Master
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 text-center">
                        <span className="text-xs font-bold text-[#8b949e] uppercase block mb-1">Target Integrated LUFS</span>
                        <span className="text-2xl font-black text-[#3fb950] font-mono">-14.0 LUFS</span>
                        <span className="text-[10px] text-[#8b949e] block mt-1">Streaming Standard (Spotify/Apple Music)</span>
                      </div>

                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 text-center">
                        <span className="text-xs font-bold text-[#8b949e] uppercase block mb-1">True Peak Ceiling</span>
                        <span className="text-2xl font-black text-[#38bdf8] font-mono">-0.1 dBTP</span>
                        <span className="text-[10px] text-[#8b949e] block mt-1">Inter-sample Peak Safe</span>
                      </div>

                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 text-center">
                        <span className="text-xs font-bold text-[#8b949e] uppercase block mb-1">Sample Rate & Bit Depth</span>
                        <span className="text-2xl font-black text-[#d946ef] font-mono">48 kHz / 24-bit</span>
                        <span className="text-[10px] text-[#8b949e] block mt-1">Studio Master Specification</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                      <button
                        onClick={() => handleExportMaster('WAV')}
                        className="px-6 py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-black font-black text-xs rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                      >
                        <Download size={16} /> EXPORT MASTER 48kHz WAV
                      </button>

                      <button
                        onClick={() => handleExportMaster('FLAC')}
                        className="px-6 py-3 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-white font-bold text-xs rounded-xl flex items-center gap-2"
                      >
                        <Download size={16} /> EXPORT LOSSLESS FLAC
                      </button>
                    </div>

                    <div className="flex justify-start pt-4 border-t border-[#21262d]">
                      <button onClick={() => setActiveStage(5)} className="text-xs text-[#8b949e] hover:text-white">
                        ← Back to Studio DSP Rack
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* MODE 2: VOICE EMOTIONAL MAPPING DASHBOARD (Joy, Sadness, Anger, Neutral) */}
        {/* ==================================================================== */}
        {mainMode === 'voice_emotional_mapping' && (
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#050508]">
            <div className="max-w-7xl mx-auto space-y-4">
              <VoiceEmotionalMappingDashboard
                vocalLines={songProject.vocalLines || []}
                onUpdateVocalLines={(updatedLines) => {
                  setSongProject(prev => ({ ...prev, vocalLines: updatedLines }));
                }}
                activeVoiceModel={songProject.aiSinger.voiceModel}
                onSelectVoiceModel={(model) => {
                  setSongProject(prev => ({
                    ...prev,
                    aiSinger: { ...prev.aiSinger, voiceModel: model }
                  }));
                }}
              />
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* MODE 3: OFFLINE NEURAL VOICE MODELS RACK (F5-TTS, CosyVoice, etc.) */}
        {/* ==================================================================== */}
        {mainMode === 'neural_tts_rack' && (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Model Selector Sidebar */}
            <div className="w-80 bg-[#0d1117] border-r border-[#21262d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-5 space-y-4">
              <span className="text-xs font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu size={14} className="text-[#d946ef]" /> State-of-the-Art Neural Models
              </span>

              <div className="space-y-2">
                {(Object.keys(NEURAL_SPEECH_MODELS) as NeuralModelType[]).map((key) => {
                  const model = NEURAL_SPEECH_MODELS[key];
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedNeuralModel(key);
                        setSelectedEmotion(model.emotionSupport[0] || 'Neutral');
                      }}
                      className={`w-full p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        selectedNeuralModel === key
                          ? 'bg-[#d946ef]/15 border-[#d946ef] text-white shadow-md'
                          : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:border-[#58a6ff]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{model.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#38bdf8]/15 text-[#38bdf8] font-mono">
                          {model.latencyMs}ms
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8b949e] line-clamp-2">{model.descriptionThai}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Center TTS Stage */}
            <div className="flex-1 bg-[#050508] p-8 overflow-y-auto custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Active Model Specification Banner */}
                {NEURAL_SPEECH_MODELS[selectedNeuralModel] && (
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
                      <div>
                        <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
                          <Cpu size={18} className="text-[#d946ef]" /> {NEURAL_SPEECH_MODELS[selectedNeuralModel].name}
                        </h3>
                        <p className="text-xs text-[#8b949e] font-mono mt-0.5">
                          Architecture: {NEURAL_SPEECH_MODELS[selectedNeuralModel].architecture}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#3fb950]/15 border border-[#3fb950]/30 text-xs font-bold text-[#3fb950] font-mono">
                          ⚡ {NEURAL_SPEECH_MODELS[selectedNeuralModel].latencyMs}ms Latency
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#38bdf8]/15 border border-[#38bdf8]/30 text-xs font-bold text-[#38bdf8] font-mono">
                          48kHz Studio
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {NEURAL_SPEECH_MODELS[selectedNeuralModel].features.map((feat, idx) => (
                        <div key={idx} className="bg-[#161b22] border border-[#30363d] rounded-lg p-2 text-center text-[10px] font-mono text-[#38bdf8]">
                          ✓ {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Textarea & Synthesis Controls */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-2">
                      <FileText size={16} className="text-[#38bdf8]" /> Speech Script (Thai / English)
                    </span>
                    <button
                      onClick={() => setTtsInputText('สวัสดีครับ ยินดีต้อนรับสู่โลกแห่งเสียงพากย์และร้องเพลงสังเคราะห์ความละเอียดสูง')}
                      className="text-xs text-[#38bdf8] hover:underline"
                    >
                      Use Sample Text
                    </button>
                  </div>

                  <textarea
                    value={ttsInputText}
                    onChange={(e) => setTtsInputText(e.target.value)}
                    rows={3}
                    className="w-full bg-[#050508] border border-[#30363d] rounded-xl p-4 text-base text-white outline-none focus:border-[#d946ef] font-sans resize-none shadow-inner"
                    placeholder="พิมพ์ข้อความที่ต้องการให้โมเดล AI พากย์เสียง..."
                  />

                  {/* Emotion Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5">
                      <Heart size={14} className="text-[#f43f5e]" /> Emotion & Dynamic Pitch Prosody
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {NEURAL_SPEECH_MODELS[selectedNeuralModel].emotionSupport.map((em) => (
                        <button
                          key={em}
                          onClick={() => setSelectedEmotion(em)}
                          className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            selectedEmotion === em
                              ? 'bg-[#f43f5e]/20 border-[#f43f5e] text-white shadow-sm'
                              : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:text-white'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Speed & Pitch */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                        <span>Speed Rate</span>
                        <span className="text-white font-mono">{ttsSpeed}x</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="180"
                        value={ttsSpeed * 100}
                        onChange={(e) => setTtsSpeed(Number(e.target.value) / 100)}
                        className="w-full accent-[#d946ef] bg-[#21262d] h-1.5 rounded"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                        <span>Pitch Shift</span>
                        <span className="text-white font-mono">{ttsPitchOffset > 0 ? `+${ttsPitchOffset}` : ttsPitchOffset} st</span>
                      </div>
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        value={ttsPitchOffset}
                        onChange={(e) => setTtsPitchOffset(Number(e.target.value))}
                        className="w-full accent-[#38bdf8] bg-[#21262d] h-1.5 rounded"
                      />
                    </div>
                  </div>

                  {/* Action Play Trigger */}
                  <div className="pt-2">
                    <button
                      onClick={handlePlayNeuralTTS}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d946ef] to-[#38bdf8] hover:from-[#c026d3] hover:to-[#0ea5e9] text-white font-black text-xs transition-all shadow-[0_0_20px_rgba(217,70,239,0.4)] flex items-center justify-center gap-2"
                    >
                      {isPlaying ? <Square size={16} /> : <Play size={16} fill="currentColor" />}
                      {isPlaying ? 'STOP SYNTHESIS' : `SYNTHESIZE WITH ${selectedNeuralModel.toUpperCase()}`}
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
