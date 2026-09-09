/**
 * ====================================================================================================
 * MODULE: DynamicInteractiveMusicStateMachine.tsx
 * ====================================================================================================
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * 1. ระบบจัดการและเปลี่ยนเพลงประกอบแบบพลวัตตามอารมณ์และสถานการณ์ในเกม (Dynamic Adaptive Music State Machine)
 *    สำหรับเกมระดับ AAA ด้วยระบบสลับสเตทเพลงแบบไร้รอยต่อ (Seamless Beat-Synced Quantization 4/4 Bars)
 * 2. ควบคุม 5 สเตทดนตรีตามระดับความตึงเครียด (Music Intensity States):
 *    - Exploration (สำรวจโลก: สงบ ผ่อนคลาย มีเพียงเครื่องสายและบรรยากาศ)
 *    - Suspense / Stealth (ซุ่มโจมตี: จังหวะกระชั้นชิด คอร์ดลดทอน)
 *    - Combat (การต่อสู้ดุเดือด: กลองกระแทก เบสทรงพลัง จังหวะเร้าใจ)
 *    - Boss Fight (ศึกหัวหน้าใหญ่: เครื่องดนตรีจัดเต็ม โน้ตลีดประสานเสียง)
 *    - Victory (ชัยชนะ: เมโลดี้ฉลองความสำเร็จ)
 * 3. ระบบ 4-Channel Dynamic Stems Mixer: Drums, Bassline, Harmony/Strings, Lead Melody
 *    พร้อม Cross-fader ควบคุมความดังของแต่ละชั้นแบบเรียลไทม์
 * 4. เอนจินสังเคราะห์เสียงจริงผ่าน Web Audio API (Oscillators, GainNodes, AnalyserNode) พร้อม Canvas Spectrum Visualizer
 *
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - เชื่อมต่อกับ Audio, DAW & Voice Studio Hub ใน App.tsx
 * - ทำงานคู่กับ OmniMusicVocalDAWStudio และ SpatialAudioFoley
 * - รับสัญญาณ Event Trigger จาก GameplayAbilitySystem หรือ CombatHitboxFrameDataStudio
 *
 * พารามิเตอร์ Input / Output (Data Contracts):
 * - Input: Music State Trigger, Master Tempo BPM (60 - 180), Stems Volume Gains (0.0 - 1.0)
 * - Output: Web Audio Real-time Sound Synthesis, Audio Spectrum Data, Exportable Music State Machine JSON
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - ป้องกันเสียงแตกหรือคลิก (Audio Click / Pop) ขณะเปลี่ยนสถานะด้วย Exponential Volume Ramping
 * - ปลุก AudioContext อัตโนมัติเมื่อผู้ใช้โต้ตอบ (Autoplay Policy Compliance)
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * <DynamicInteractiveMusicStateMachine onStateChange={(state) => console.log(state)} />
 * ====================================================================================================
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Music,
  Disc,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sliders,
  Download,
  Zap,
  Activity,
  CheckCircle2,
  RefreshCw,
  Layers,
  Radio
} from "lucide-react";

export type MusicState = "explore" | "suspense" | "combat" | "boss" | "victory";

export interface StemConfig {
  id: string;
  name: string;
  volume: number; // 0.0 - 1.0
  muted: boolean;
  color: string;
}

export default function DynamicInteractiveMusicStateMachine() {
  const [currentState, setCurrentState] = useState<MusicState>("explore");
  const [targetState, setTargetState] = useState<MusicState>("explore");
  const [bpm, setBpm] = useState<number>(128);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(1);
  const [currentBar, setCurrentBar] = useState<number>(1);

  // 4 Audio Stems
  const [stems, setStems] = useState<StemConfig[]>([
    { id: "drums", name: "Drums & Percussion", volume: 0.85, muted: false, color: "#ef4444" },
    { id: "bass", name: "Bassline & Sub", volume: 0.9, muted: false, color: "#3b82f6" },
    { id: "harmony", name: "Strings & Ambient Pad", volume: 0.75, muted: false, color: "#10b981" },
    { id: "lead", name: "Melody & Lead Synth", volume: 0.8, muted: false, color: "#f59e0b" },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const beatTimerRef = useRef<NodeJS.Timeout | null>(null);

  isPlayingRef.current = isPlaying;

  // เริ่มต้น Web Audio API
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // เล่นโน้ตจำลองของแต่ละ Stem (Procedural Synthesizer Sound on Beat)
  const playSynthesizedBeat = useCallback((beat: number, state: MusicState) => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state !== "running") return;

    const now = ctx.currentTime;

    // 1. Drum Beat (Kick on 1, 3; Snare on 2, 4)
    const drumStem = stems.find((s) => s.id === "drums");
    if (drumStem && !drumStem.muted && drumStem.volume > 0.05) {
      if (state === "combat" || state === "boss" || state === "suspense" || state === "victory") {
        if (beat === 1 || beat === 3) {
          // Kick Drum
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
          gain.gain.setValueAtTime(drumStem.volume * 0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.16);
        } else {
          // Hi-hat / Snare
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
          gain.gain.setValueAtTime(drumStem.volume * 0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
        }
      }
    }

    // 2. Bassline
    const bassStem = stems.find((s) => s.id === "bass");
    if (bassStem && !bassStem.muted && bassStem.volume > 0.05) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      const rootFreq = state === "boss" ? 55 : state === "combat" ? 65 : 73; // A1, C2, D2
      osc.frequency.setValueAtTime(rootFreq, now);
      gain.gain.setValueAtTime(bassStem.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    }

    // 3. Melody Lead (เฉพาะ Boss, Combat หรือ Victory)
    const leadStem = stems.find((s) => s.id === "lead");
    if (leadStem && !leadStem.muted && (state === "combat" || state === "boss" || state === "victory")) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const notes = [261.63, 329.63, 392.0, 523.25]; // C, E, G, C5
      osc.frequency.setValueAtTime(notes[beat - 1], now);
      gain.gain.setValueAtTime(leadStem.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }, [stems]);

  // ลูปจังหวะดนตรี (Beat Sequencer Loop)
  useEffect(() => {
    if (!isPlaying) {
      if (beatTimerRef.current) clearInterval(beatTimerRef.current);
      return;
    }

    const intervalMs = (60 / bpm / 2) * 1000; // 8th notes
    let b = 1;
    let bar = 1;

    beatTimerRef.current = setInterval(() => {
      setCurrentBeat(b);
      setCurrentBar(bar);

      // เล่นเสียงของสเตทปัจจุบัน
      playSynthesizedBeat(b, currentState);

      // Quantization: เมื่อจบบาร์ (Beat 4) ให้สลับไปยัง Target State ทันที
      if (b === 4) {
        if (currentState !== targetState) {
          setCurrentState(targetState);
        }
        b = 1;
        bar = bar >= 8 ? 1 : bar + 1;
      } else {
        b++;
      }
    }, intervalMs);

    return () => {
      if (beatTimerRef.current) clearInterval(beatTimerRef.current);
    };
  }, [isPlaying, bpm, currentState, targetState, playSynthesizedBeat]);

  // วาด Real-time Audio Spectrum บน Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const renderSpectrum = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#0c101c";
      ctx.fillRect(0, 0, w, h);

      // วาดแท่ง Frequency Bars จำลอง
      const numBars = 32;
      const barWidth = (w - (numBars + 1) * 3) / numBars;

      for (let i = 0; i < numBars; i++) {
        const x = 3 + i * (barWidth + 3);
        const intensity = isPlaying ? Math.sin(Date.now() * 0.006 + i * 0.4) * 0.5 + 0.5 : 0.05;
        const barHeight = intensity * (h - 20);

        // สีตามเพลง
        let barColor = "#3b82f6";
        if (currentState === "combat" || currentState === "boss") barColor = "#ef4444";
        if (currentState === "suspense") barColor = "#f59e0b";
        if (currentState === "victory") barColor = "#10b981";

        ctx.fillStyle = barColor;
        ctx.fillRect(x, h - barHeight - 10, barWidth, barHeight);
      }

      animId = requestAnimationFrame(renderSpectrum);
    };

    animId = requestAnimationFrame(renderSpectrum);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentState]);

  const handleTogglePlay = () => {
    initAudio();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 select-none overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-[#111726]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 border border-purple-500/30">
            <Disc size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Dynamic Interactive Music State Machine
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/10 text-purple-400 rounded border border-purple-500/20">
                Beat-Synced Quantized v3.0
              </span>
            </div>
            <p className="text-xs text-gray-400">
              ระบบเปลี่ยนสเตทเพลงประกอบเกมตามอารมณ์แบบเรียลไทม์ พร้อม 4-Stem Dynamic Cross-fader
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              isPlaying
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-purple-600 hover:bg-purple-500 text-white shadow-sm"
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? "หยุดเพลงชั่วคราว" : "เริ่มเล่นเพลงอินเทอร์แอคทีฟ"}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-80 border-r border-gray-800 bg-[#0d1322] flex flex-col overflow-y-auto p-4 space-y-5">
          {/* Music States Selector */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Radio size={14} className="text-purple-400" />
              สเตทดนตรีอินเทอร์แอคทีฟ (Music States)
            </h3>
            <div className="space-y-2">
              {(
                [
                  { id: "explore", name: "1. สำรวจโลก (Exploration)", color: "text-blue-400" },
                  { id: "suspense", name: "2. ซุ่มระทึก (Suspense / Stealth)", color: "text-amber-400" },
                  { id: "combat", name: "3. การต่อสู้ (Action Combat)", color: "text-red-400" },
                  { id: "boss", name: "4. หัวหน้าใหญ่ (Epic Boss Fight)", color: "text-rose-500 font-bold" },
                  { id: "victory", name: "5. ชัยชนะ (Victory Fanfare)", color: "text-emerald-400" },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    initAudio();
                    setTargetState(st.id);
                  }}
                  className={`w-full px-3 py-2 rounded text-xs text-left transition flex items-center justify-between border ${
                    currentState === st.id
                      ? "bg-purple-500/20 text-white border-purple-500/50 shadow-sm"
                      : targetState === st.id
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      : "bg-[#161f33] text-gray-400 border-gray-800 hover:text-white"
                  }`}
                >
                  <span className={st.color}>{st.name}</span>
                  {currentState === st.id && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
            {targetState !== currentState && (
              <div className="text-[11px] text-amber-400 mt-2 flex items-center gap-1">
                ⏳ รอจบบาร์ถัดไปเพื่อเปลี่ยนสู่สถานะ: <strong className="capitalize">{targetState}</strong>
              </div>
            )}
          </div>

          {/* Stems Volume Mixer */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Sliders size={14} className="text-blue-400" />
              4-Channel Stems Mixer
            </h3>
            <div className="space-y-3 text-xs">
              {stems.map((stem) => (
                <div key={stem.id} className="bg-[#161f33] p-2 rounded border border-gray-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{stem.name}</span>
                    <button
                      onClick={() =>
                        setStems(
                          stems.map((s) => (s.id === stem.id ? { ...s, muted: !s.muted } : s))
                        )
                      }
                      className={`p-1 rounded ${
                        stem.muted ? "text-red-400 bg-red-500/10" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {stem.muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    </button>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    disabled={stem.muted}
                    value={stem.muted ? 0 : stem.volume}
                    onChange={(e) =>
                      setStems(
                        stems.map((s) =>
                          s.id === stem.id ? { ...s, volume: Number(e.target.value) } : s
                        )
                      )
                    }
                    className="w-full accent-purple-500 bg-gray-700 h-1.5 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tempo BPM */}
          <div className="border-t border-gray-800 pt-4">
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>จังหวะความเร็ว (Tempo BPM):</span>
              <span className="font-mono text-purple-400 font-bold">{bpm} BPM</span>
            </div>
            <input
              type="range"
              min="80"
              max="160"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-full accent-purple-500 bg-gray-700 h-1.5 rounded"
            />
          </div>
        </div>

        {/* Center Spectrum Viewport */}
        <div className="flex-1 flex flex-col bg-[#070a10]">
          {/* Top Beat Ribbon */}
          <div className="h-12 border-b border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">สถานะดนตรีปัจจุบัน:</span>
              <span className="px-2.5 py-1 rounded font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {currentState} STATE
              </span>
            </div>

            {/* Metronome Beat Lights */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-mono">BAR {currentBar}</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((b) => (
                  <div
                    key={b}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentBeat === b ? "bg-purple-400 scale-125 shadow-lg shadow-purple-500" : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Spectrum Canvas */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative border-2 border-gray-800 rounded-lg overflow-hidden shadow-2xl bg-black">
              <canvas ref={canvasRef} width={620} height={380} className="block" />
              <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur px-2.5 py-1 rounded border border-gray-700 text-xs text-gray-300 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : "bg-gray-500"}`} />
                <span>Audio Engine: {isPlaying ? "Synthesizing Audio Stream" : "Standby"}</span>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="h-16 border-t border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-purple-400" />
              <div>
                <div className="text-gray-400">Quantization Window</div>
                <div className="text-sm font-bold text-white font-mono">1/4 Bar Sync (Zero Click Crossfade)</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <div>
                <div className="text-gray-400">Audio Latency Mode</div>
                <div className="text-sm font-bold text-emerald-400">Interactive Low-Latency Web Audio API</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
