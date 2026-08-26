/**
 * @file VoiceActorAI.tsx
 * @description
 * ============================================================================
 * [THAI]
 * ระบบสร้างเสียงพากย์ตัวละคร AI และการเทียบรูปปาก (Neural Character Dubbing & Lip-Sync Studio)
 * รองรับการปรับแต่งอารมณ์แบบเรียลไทม์ (โกรธ, ตกใจ, กระซิบ, อ่อนโยน, ฮีโร่, อนิเมะ)
 * ขับเคลื่อนด้วย NaturalVoiceAudioEngine และ ThaiPhoneticsEngineCore
 * ปราศจากเสียงแข็งกระด้างแบบหุ่นยนต์ด้วยโมเดลสรีรวิทยาสายเสียงมนุษย์ (Rosenberg Flow)
 *
 * [ENGLISH]
 * Neural Character Dubbing & Lip-Sync Viseme Studio.
 * Real-time voice actor synthesis with emotion mapping, vocal tract formants,
 * human micro-prosody and 100% Thai phonetic support.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Mic2, Play, Square, Settings, Volume2, Download, Save,
  RefreshCw, AudioLines, Sparkles, Wand2, Activity, User, Heart
} from 'lucide-react';
import { NaturalVoiceAudioEngine, PRESET_VOICES, VoiceEmotion, VoiceProfile } from '../utils/NaturalVoiceAudioEngine';
import { ThaiPhoneticsEngineCore } from '../utils/ThaiPhoneticsEngineCore';

export default function VoiceActorAI() {
  const [dialogueText, setDialogueText] = useState<string>(
    'ฉันบอกนายแล้วไงว่าอย่าเข้าไปในเขตหวงห้าม! ตอนนี้พวกมันรู้แล้วว่าเราอยู่ที่นี่ รีบหนีเร็ว!'
  );
  const [selectedVoiceKey, setSelectedVoiceKey] = useState<string>('cinematic_hero');
  const [emotion, setEmotion] = useState<VoiceEmotion>('heroic');
  const [speed, setSpeed] = useState<number>(1.1);
  const [pitchOffset, setPitchOffset] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>('');

  const handleSpeak = async () => {
    if (isPlaying) {
      NaturalVoiceAudioEngine.stopAll();
      setIsPlaying(false);
      setProgress(0);
      setCurrentWord('');
      return;
    }

    setIsPlaying(true);
    const voice = PRESET_VOICES[selectedVoiceKey] || PRESET_VOICES.cinematic_hero;

    await NaturalVoiceAudioEngine.speakThaiPhonetic(dialogueText, {
      voice,
      speed,
      pitchOffset,
      emotion,
      onProgress: (prog, word) => {
        setProgress(prog);
        setCurrentWord(word);
      },
      onFinished: () => {
        setIsPlaying(false);
        setProgress(100);
        setCurrentWord('');
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050508] text-white font-sans overflow-hidden select-none">
      {/* Header */}
      <div className="h-14 border-b border-[#21262d] bg-[#0d1117] flex items-center justify-between px-6 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#f85149]/20 border border-[#f85149]/50 rounded-xl shadow-[0_0_15px_rgba(248,81,73,0.3)]">
            <Mic2 className="text-[#f85149]" size={18} />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-wide bg-gradient-to-r from-white to-[#f85149] bg-clip-text text-transparent">
              Neural Character Dubbing & Voice Acting
            </h1>
            <p className="text-[11px] text-[#8b949e]">Natural Acoustic Flow • Emotion SSML Matrix • Anti-Robotic Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSpeak}
            className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 transition-all shadow-md ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-gradient-to-r from-[#f85149] to-[#bc8cff] hover:from-[#ea3939] hover:to-[#a855f7] text-white shadow-[0_0_15px_rgba(248,81,73,0.4)]'
            }`}
          >
            {isPlaying ? <Square size={14} /> : <Play size={14} fill="currentColor" />}
            {isPlaying ? 'STOP DUBBING' : 'GENERATE NATURAL DUB'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Input & Emotion */}
        <div className="w-1/2 border-r border-[#21262d] bg-[#090d13] flex flex-col z-10 shrink-0 overflow-y-auto custom-scrollbar p-5 space-y-5">
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5">
                <Wand2 size={14} className="text-[#f85149]" /> DIALOGUE SCRIPT (THAI / ENGLISH)
              </span>
              <button
                onClick={() => setDialogueText('ในที่สุดเจ้าก็มาถึง ข้าเฝ้ารอเวลานี้มาเนิ่นนานแล้ว จงแสดงพลังที่แท้จริงของเจ้าออกมา!')}
                className="text-[11px] text-[#58a6ff] hover:underline"
              >
                Sample Dialogue
              </button>
            </div>
            <textarea
              value={dialogueText}
              onChange={(e) => setDialogueText(e.target.value)}
              rows={4}
              className="w-full bg-[#050508] border border-[#30363d] rounded-xl p-4 text-sm text-white resize-none outline-none focus:border-[#f85149] font-sans shadow-inner leading-relaxed"
              placeholder="พิมพ์บทสนทนาพากย์เสียง..."
            />
          </div>

          {/* Voice Actor Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5">
              <User size={14} className="text-[#58a6ff]" /> Voice Actor Archetype
            </span>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PRESET_VOICES).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setSelectedVoiceKey(k)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col transition-all ${
                    selectedVoiceKey === k
                      ? 'bg-[#f85149]/15 border-[#f85149] text-white shadow-md'
                      : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:border-[#58a6ff]'
                  }`}
                >
                  <span className="text-xs font-bold text-white truncate">{v.name}</span>
                  <span className="text-[10px] text-[#8b949e] truncate">{v.nameThai}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Emotion Mapping */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5">
              <Heart size={14} className="text-[#e3b341]" /> Emotion & Dynamic Pitch State
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['neutral', 'heroic', 'dramatic', 'joy', 'whisper', 'anime'] as VoiceEmotion[]).map((em) => (
                <button
                  key={em}
                  onClick={() => setEmotion(em)}
                  className={`p-2 rounded-lg border text-xs font-bold capitalize transition-all ${
                    emotion === em
                      ? 'bg-[#e3b341]/20 border-[#e3b341] text-white shadow-sm'
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
                <span>Speech Rate (Speed)</span>
                <span className="text-white font-mono">{speed}x</span>
              </div>
              <input
                type="range"
                min="60"
                max="180"
                value={speed * 100}
                onChange={(e) => setSpeed(Number(e.target.value) / 100)}
                className="w-full accent-[#f85149] bg-[#21262d] h-1.5 rounded"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                <span>Pitch Shift</span>
                <span className="text-white font-mono">{pitchOffset > 0 ? `+${pitchOffset}` : pitchOffset} st</span>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                value={pitchOffset}
                onChange={(e) => setPitchOffset(Number(e.target.value))}
                className="w-full accent-[#58a6ff] bg-[#21262d] h-1.5 rounded"
              />
            </div>
          </div>

        </div>

        {/* Right: Stage & Visualizer */}
        <div className="flex-1 bg-[#050508] flex flex-col justify-center items-center p-8 relative overflow-hidden">
          
          <div className="w-full max-w-md bg-[#0d1117] border border-[#30363d] rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#f85149]/20 to-[#bc8cff]/20 border border-[#f85149]/40 flex items-center justify-center shadow-[0_0_30px_rgba(248,81,73,0.2)]">
              <AudioLines
                size={44}
                className={`transition-all duration-300 ${
                  isPlaying ? 'text-[#f85149] scale-110 animate-pulse' : 'text-[#8b949e]'
                }`}
              />
            </div>

            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {isPlaying ? 'DUBBING SYNTHESIS IN PROGRESS' : 'STUDIO READY FOR DUBBING'}
              </h3>
              <p className="text-xs text-[#8b949e] mt-1 font-mono">
                {currentWord ? `Speaking: "${currentWord}"` : 'Awaiting speech playback trigger'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="h-2 w-full bg-[#161b22] rounded-full overflow-hidden border border-[#30363d]">
                <div
                  className="h-full bg-gradient-to-r from-[#f85149] to-[#bc8cff] transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#8b949e] font-mono">
                <span>0%</span>
                <span>{Math.round(progress)}%</span>
                <span>100%</span>
              </div>
            </div>

            <button
              onClick={handleSpeak}
              className="w-full py-3 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
            >
              {isPlaying ? <Square size={16} /> : <Play size={16} fill="currentColor" />}
              {isPlaying ? 'Stop Playback' : 'Play Audition'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
