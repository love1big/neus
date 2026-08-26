/**
 * @file VoiceEmotionalMappingDashboard.tsx
 * @description
 * ============================================================================
 * [THAI]
 * แดชบอร์ดปรับแต่งและแมปปิ้งกราฟอารมณ์เสียงร้อง AI ระดับสตูดิโอมืออาชีพ (Voice Emotional Mapping Dashboard)
 * 
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้ (Module Purpose & Responsibility):
 *    - ควบคุมกราฟความเข้มข้นอารมณ์ (Emotion Intensity Curves) 4 อารมณ์หลัก:
 *      * Joy (ความสุข / สดใส / ร่าเริง): ยกฟอร์แมนต์เสียงสูง เพิ่ม Vibrato เร็ว ไร้ความสั่นเครือ
 *      * Sadness (ความเศร้า / ซาบซึ้ง / สั่นเครือ): เพิ่มลมหายใจ (Breathiness), หักมุมเสียงตก (Falling pitch), ชะลอ Vibrato
 *      * Anger (ความโกรธ / ดุดัน / ทรงพลัง): เพิ่มความตึงเส้นเสียง (Vocal Tension), ฮาร์โมนิก Tube Saturation, Attack เร็ว
 *      * Neutral (ปกติ / มั่นคง / สมดุล): เสียงร้องสตูดิโอมาตรฐาน คมชัด ชัดถ้อยชัดคำ
 *    - ปรับแต่งและแยกคีย์เฟรมตามแต่ละท่อนร้อง (Individual Vocal Lines & Time Keyframes: Start, Mid, End)
 *    - Interactive 2D Valence-Arousal Emotion Pad (Russell's Circumplex Model of Affect)
 *    - Real-Time Offline Audio Synthesis Preview ด้วย Web Audio API & DiffSinger Engine
 *
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 *    - เชื่อมโยงกับ `AIOfflineVoiceModelsEngine.ts` ในการส่งผ่าน `VocalLineEmotionMapping`
 *    - ทำงานร่วมกับ `AIOfflineVocalMusicWorkstation.tsx` เพื่อซิงค์กับขั้นตอน DiffSinger และ Master Track
 *    - ใช้ `ThaiPhoneticsEngineCore.ts` ในการวิเคราะห์สัทศาสตร์ของแต่ละวรรคคำ
 *
 * 3. พารามิเตอร์ Input / Output ที่รับส่ง (Inputs, Outputs & Data Contracts):
 *    - Props:
 *      * vocalLines: VocalLineEmotionMapping[]
 *      * onUpdateVocalLines: (updated: VocalLineEmotionMapping[]) => void
 *      * activeVoiceModel: DiffSingerVoice
 *      * onSelectVoiceModel?: (model: DiffSingerVoice) => void
 *
 * 4. การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 *    - ตรวจสอบความถูกต้องของคีย์เฟรม ป้องกันค่า NaN หรือเวลาข้ามช่วง
 *    - ป้องกัน AudioContext ค้าง (Safe resume & node garbage collection)
 *
 * 5. ตัวอย่างการเรียกใช้งาน (Usage Example):
 *    <VoiceEmotionalMappingDashboard
 *      vocalLines={songProject.vocalLines}
 *      onUpdateVocalLines={(lines) => setSongProject(p => ({ ...p, vocalLines: lines }))}
 *      activeVoiceModel="Mali_ThaiDiva"
 *    />
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, Sparkles, Sliders, Play, Square, RefreshCw, Layers,
  Activity, Zap, Music, Volume2, Shield, ArrowRight, Eye, Check,
  ChevronDown, Flame, Droplets, Smile, Compass, Plus, Trash2, Copy
} from 'lucide-react';
import {
  VocalLineEmotionMapping,
  EmotionIntensityPoint,
  DiffSingerVoice,
  AIOfflineVoiceModelsEngine
} from '../utils/AIOfflineVoiceModelsEngine';

interface VoiceEmotionalMappingDashboardProps {
  vocalLines: VocalLineEmotionMapping[];
  onUpdateVocalLines: (lines: VocalLineEmotionMapping[]) => void;
  activeVoiceModel?: DiffSingerVoice;
  onSelectVoiceModel?: (voice: DiffSingerVoice) => void;
}

export const VoiceEmotionalMappingDashboard: React.FC<VoiceEmotionalMappingDashboardProps> = ({
  vocalLines,
  onUpdateVocalLines,
  activeVoiceModel = 'Mali_ThaiDiva',
  onSelectVoiceModel
}) => {
  // Currently selected vocal line index
  const [selectedLineIndex, setSelectedLineIndex] = useState<number>(0);
  
  // Selected Keyframe index (0: Start 0%, 1: Mid 50%, 2: End 100%)
  const [selectedKeyframeIndex, setSelectedKeyframeIndex] = useState<number>(1);

  // Solo playback state
  const [isPlayingSolo, setIsPlayingSolo] = useState<boolean>(false);
  const [soloProgress, setSoloProgress] = useState<number>(0);
  const [currentPreviewSyllable, setCurrentPreviewSyllable] = useState<string>('');

  // 2D Emotion Pad dragging state
  const padRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingPad, setIsDraggingPad] = useState<boolean>(false);

  // Formant visualizer canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeLine: VocalLineEmotionMapping | undefined = vocalLines[selectedLineIndex] || vocalLines[0];

  // Helper to update active vocal line
  const updateCurrentLine = (updater: (prev: VocalLineEmotionMapping) => VocalLineEmotionMapping) => {
    if (!activeLine) return;
    const newLines = [...vocalLines];
    const updated = updater(activeLine);
    newLines[selectedLineIndex] = updated;
    onUpdateVocalLines(newLines);
  };

  // Helper to update specific keyframe of active vocal line
  const updateKeyframe = (kfIdx: number, emotionKey: keyof Omit<EmotionIntensityPoint, 'timePct'>, value: number) => {
    updateCurrentLine(line => {
      const newKeyframes = [...line.keyframes];
      const target = { ...newKeyframes[kfIdx], [emotionKey]: Math.max(0, Math.min(1, value)) };
      newKeyframes[kfIdx] = target;

      // Recalculate average weights
      const avgJoy = newKeyframes.reduce((acc, k) => acc + k.joy, 0) / newKeyframes.length;
      const avgSad = newKeyframes.reduce((acc, k) => acc + k.sadness, 0) / newKeyframes.length;
      const avgAnger = newKeyframes.reduce((acc, k) => acc + k.anger, 0) / newKeyframes.length;
      const avgNeutral = newKeyframes.reduce((acc, k) => acc + k.neutral, 0) / newKeyframes.length;

      return {
        ...line,
        keyframes: newKeyframes,
        joyWeight: Number(avgJoy.toFixed(2)),
        sadnessWeight: Number(avgSad.toFixed(2)),
        angerWeight: Number(avgAnger.toFixed(2)),
        neutralWeight: Number(avgNeutral.toFixed(2)),
        colorPreset: 'Custom Curve'
      };
    });
  };

  // Apply quick emotion preset
  const handleApplyPreset = (presetName: string) => {
    if (!activeLine) return;
    const updated = AIOfflineVoiceModelsEngine.applyEmotionPresetToLine(activeLine, presetName);
    const newLines = [...vocalLines];
    newLines[selectedLineIndex] = updated;
    onUpdateVocalLines(newLines);
  };

  // Batch apply preset to all lines
  const handleBatchApplyPreset = (presetName: string) => {
    const updated = vocalLines.map(line => AIOfflineVoiceModelsEngine.applyEmotionPresetToLine(line, presetName));
    onUpdateVocalLines(updated);
  };

  // Handle 2D Emotion Pad Interaction (Russell's Valence-Arousal Model)
  const handlePadInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    // Normalize from -1.0 to +1.0
    // Valence: -1 (Sad/Unpleasant) to +1 (Joy/Pleasant)
    const valence = (x / rect.width) * 2 - 1;
    // Arousal: -1 (Calm/Neutral) to +1 (Anger/High Arousal)
    const arousal = 1 - (y / rect.height) * 2;

    // Convert (valence, arousal) to (Joy, Sadness, Anger, Neutral) weights
    let joy = 0;
    let sad = 0;
    let anger = 0;
    let neutral = 0;

    if (valence >= 0 && arousal >= 0) {
      // Top-Right: High Joy / Excitement
      joy = Math.sqrt(valence * valence + arousal * arousal) * 0.9;
      anger = arousal * 0.3;
      neutral = Math.max(0, 1 - (joy + anger));
    } else if (valence < 0 && arousal >= 0) {
      // Top-Left: High Anger / Frustration
      anger = Math.sqrt(valence * valence + arousal * arousal) * 0.9;
      sad = Math.abs(valence) * 0.3;
      neutral = Math.max(0, 1 - (anger + sad));
    } else if (valence < 0 && arousal < 0) {
      // Bottom-Left: Sadness / Depressed / Melancholy
      sad = Math.sqrt(valence * valence + arousal * arousal) * 0.9;
      neutral = Math.max(0, 1 - sad);
    } else {
      // Bottom-Right: Calm / Relaxed / Neutral
      neutral = 0.7 + (1 - Math.abs(arousal)) * 0.3;
      joy = valence * 0.3;
    }

    // Normalize sum to 1.0
    const sum = (joy + sad + anger + neutral) || 1;
    joy /= sum;
    sad /= sum;
    anger /= sum;
    neutral /= sum;

    updateCurrentLine(line => {
      const newKeyframes = line.keyframes.map(k => ({
        ...k,
        joy: Number(joy.toFixed(2)),
        sadness: Number(sad.toFixed(2)),
        anger: Number(anger.toFixed(2)),
        neutral: Number(neutral.toFixed(2))
      }));
      return {
        ...line,
        keyframes: newKeyframes,
        joyWeight: Number(joy.toFixed(2)),
        sadnessWeight: Number(sad.toFixed(2)),
        angerWeight: Number(anger.toFixed(2)),
        neutralWeight: Number(neutral.toFixed(2)),
        colorPreset: '2D Pad Map'
      };
    });
  };

  // Play Solo Emotional Preview
  const handlePlaySolo = async () => {
    if (isPlayingSolo) {
      AIOfflineVoiceModelsEngine.stopAll();
      setIsPlayingSolo(false);
      return;
    }
    if (!activeLine) return;

    setIsPlayingSolo(true);
    setSoloProgress(0);

    await AIOfflineVoiceModelsEngine.renderEmotionalVocalLine(
      activeLine,
      activeVoiceModel,
      (pct, lyric) => {
        setSoloProgress(pct);
        setCurrentPreviewSyllable(lyric);
      },
      () => {
        setIsPlayingSolo(false);
        setSoloProgress(0);
        setCurrentPreviewSyllable('');
      }
    );
  };

  // Live Canvas Wave & Formant Animation
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid Lines
      ctx.strokeStyle = '#1e2633';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (!activeLine) {
        animId = requestAnimationFrame(render);
        return;
      }

      const centerY = canvas.height / 2;
      const jW = activeLine.joyWeight;
      const sW = activeLine.sadnessWeight;
      const aW = activeLine.angerWeight;
      const nW = activeLine.neutralWeight;

      // Draw 4 distinct emotional formant curves
      // 1. Joy (Yellow/Amber - High frequency ripple)
      ctx.beginPath();
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.3 + jW * 0.7})`;
      ctx.lineWidth = 2 + jW * 2;
      for (let x = 0; x < canvas.width; x++) {
        const t = (x / canvas.width) * Math.PI * 8 + phase * (1 + jW * 1.5);
        const y = centerY - 15 - Math.sin(t * 1.8) * (8 + jW * 24);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. Sadness (Sky/Blue - Slow, smooth, decaying wave)
      ctx.beginPath();
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.3 + sW * 0.7})`;
      ctx.lineWidth = 2 + sW * 2;
      for (let x = 0; x < canvas.width; x++) {
        const t = (x / canvas.width) * Math.PI * 4 + phase * 0.6;
        const decay = 1 - (x / canvas.width) * 0.3;
        const y = centerY + 10 + Math.sin(t) * (6 + sW * 18) * decay;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 3. Anger (Rose/Red - Sharp jagged harmonic bursts)
      ctx.beginPath();
      ctx.strokeStyle = `rgba(244, 63, 94, ${0.3 + aW * 0.7})`;
      ctx.lineWidth = 2 + aW * 2;
      for (let x = 0; x < canvas.width; x++) {
        const t = (x / canvas.width) * Math.PI * 12 + phase * (2 + aW * 2);
        const jitter = (Math.random() - 0.5) * aW * 10;
        const y = centerY + (Math.sin(t) > 0 ? 1 : -1) * (4 + aW * 20) + jitter;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 4. Neutral (Emerald - Pure balanced sine wave)
      ctx.beginPath();
      ctx.strokeStyle = `rgba(52, 211, 153, ${0.3 + nW * 0.7})`;
      ctx.lineWidth = 1.5;
      for (let x = 0; x < canvas.width; x++) {
        const t = (x / canvas.width) * Math.PI * 6 + phase;
        const y = centerY + Math.sin(t) * (4 + nW * 10);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isPlayingSolo ? 0.08 : 0.02;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeLine, isPlayingSolo]);

  return (
    <div id="voice-emotional-mapping-dashboard" className="w-full bg-[#0d1117] text-[#e6edf3] rounded-2xl border border-[#30363d] p-6 shadow-2xl space-y-6">
      
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#21262d] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500/20 via-amber-500/20 to-cyan-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Voice Emotional Mapping Dashboard
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 font-medium">
                  Intensity Curves & Prosody Morpher
                </span>
              </h2>
              <p className="text-xs text-[#8b949e]">
                แมปปิ้งกราฟความเข้มข้นอารมณ์ (Joy, Sadness, Anger, Neutral) ทีละท่อนร้อง พร้อมสังเคราะห์เสียงร้องระดับสตูดิโอ
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls & Voice Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#161b22] px-3 py-1.5 rounded-lg border border-[#30363d] text-xs">
            <span className="text-[#8b949e]">AI Vocalist:</span>
            <select
              value={activeVoiceModel}
              onChange={(e) => onSelectVoiceModel && onSelectVoiceModel(e.target.value as DiffSingerVoice)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="Mali_ThaiDiva" className="bg-[#161b22]">มะลิ (Mali) - Thai Diva</option>
              <option value="Airi_JPop" className="bg-[#161b22]">Airi - J-Pop Anime Idol</option>
              <option value="Ken_PopRock" className="bg-[#161b22]">เคน (Ken) - Pop Rock</option>
              <option value="Elena_Cinematic" className="bg-[#161b22]">Elena - Epic Cinematic</option>
              <option value="Kaito_Vocaloid" className="bg-[#161b22]">Kaito - Synthetic Vocaloid</option>
            </select>
          </div>

          <button
            onClick={handlePlaySolo}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-md ${
              isPlayingSolo
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                : 'bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white shadow-pink-500/25'
            }`}
          >
            {isPlayingSolo ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            {isPlayingSolo ? 'หยุดการทดลองฟัง' : `ฟังท่อนที่ #${(selectedLineIndex + 1)} แบบเดี่ยว`}
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Vocal Line List & Presets | Right = Curve Editor & 2D Pad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Vocal Lines Selector & Presets (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Vocal Lines Selector Card */}
          <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                ท่อนร้องในเพลง ({vocalLines.length} ท่อน)
              </span>
              <button
                onClick={() => {
                  const newLines = [...vocalLines];
                  const newIndex = newLines.length;
                  newLines.push({
                    id: `vocal_line_${newIndex + 1}`,
                    lineIndex: newIndex,
                    text: 'เธอคือความหวังในใจ',
                    startSec: newIndex * 2.5,
                    durationSec: 2.2,
                    keyframes: [
                      { timePct: 0.0, joy: 0.3, sadness: 0.1, anger: 0.0, neutral: 0.6 },
                      { timePct: 0.5, joy: 0.5, sadness: 0.2, anger: 0.1, neutral: 0.2 },
                      { timePct: 1.0, joy: 0.4, sadness: 0.3, anger: 0.0, neutral: 0.3 }
                    ],
                    joyWeight: 0.4,
                    sadnessWeight: 0.2,
                    angerWeight: 0.05,
                    neutralWeight: 0.35,
                    pitchShiftCents: 0,
                    formantShift: 0,
                    vocalTension: 0.35,
                    breathiness: 0.25,
                    vibratoRateHz: 5.6,
                    vibratoDepth: 3.5,
                    colorPreset: 'Balanced Studio'
                  });
                  onUpdateVocalLines(newLines);
                  setSelectedLineIndex(newIndex);
                }}
                className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20"
              >
                <Plus className="w-3 h-3" /> เพิ่มท่อนร้อง
              </button>
            </div>

            <div className="space-y-2 max-h-[310px] overflow-y-auto pr-1">
              {vocalLines.map((line, idx) => {
                const isSelected = selectedLineIndex === idx;
                return (
                  <div
                    key={line.id || idx}
                    onClick={() => setSelectedLineIndex(idx)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer text-left space-y-1.5 ${
                      isSelected
                        ? 'bg-pink-500/10 border-pink-500/50 shadow-sm'
                        : 'bg-[#0d1117] border-[#21262d] hover:border-[#30363d]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          line.joyWeight > 0.5 ? 'bg-amber-400' :
                          line.sadnessWeight > 0.5 ? 'bg-sky-400' :
                          line.angerWeight > 0.5 ? 'bg-rose-500' : 'bg-emerald-400'
                        }`} />
                        Line {idx + 1}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#161b22] text-[#8b949e] border border-[#30363d]">
                        {line.colorPreset || 'Custom'}
                      </span>
                    </div>

                    <p className="text-xs text-[#c9d1d9] font-medium truncate">
                      "{line.text}"
                    </p>

                    {/* Mini Emotion Weight Bar */}
                    <div className="h-1.5 w-full bg-[#21262d] rounded-full flex overflow-hidden">
                      <div style={{ width: `${line.joyWeight * 100}%` }} className="bg-amber-400" title={`Joy: ${Math.round(line.joyWeight * 100)}%`} />
                      <div style={{ width: `${line.sadnessWeight * 100}%` }} className="bg-sky-400" title={`Sadness: ${Math.round(line.sadnessWeight * 100)}%`} />
                      <div style={{ width: `${line.angerWeight * 100}%` }} className="bg-rose-500" title={`Anger: ${Math.round(line.angerWeight * 100)}%`} />
                      <div style={{ width: `${line.neutralWeight * 100}%` }} className="bg-emerald-400" title={`Neutral: ${Math.round(line.neutralWeight * 100)}%`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Preset Library */}
          <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                พรีเซ็ตอารมณ์สำเร็จรูป (Emotion Presets)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Joyful Uplift (สุข/สดใส)', color: 'border-amber-500/40 text-amber-300 hover:bg-amber-500/10', icon: Smile },
                { name: 'Melancholy Tears (เศร้า/ซาบซึ้ง)', color: 'border-sky-500/40 text-sky-300 hover:bg-sky-500/10', icon: Droplets },
                { name: 'Dramatic Climax (โกรธ/ดุดัน)', color: 'border-rose-500/40 text-rose-300 hover:bg-rose-500/10', icon: Flame },
                { name: 'Intimate Whisper (กระซิบอ่อนโยน)', color: 'border-purple-500/40 text-purple-300 hover:bg-purple-500/10', icon: Heart },
                { name: 'Tense Rising Arc (จากสงบสู่ปลดปล่อย)', color: 'border-orange-500/40 text-orange-300 hover:bg-orange-500/10', icon: Zap },
                { name: 'Balanced Studio', color: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10', icon: Check }
              ].map((preset) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.name}
                    onClick={() => handleApplyPreset(preset.name)}
                    className={`p-2 rounded-lg border text-[11px] font-medium text-left transition-all flex items-center gap-1.5 ${preset.color} bg-[#0d1117]`}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    <span className="truncate">{preset.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleBatchApplyPreset(activeLine?.colorPreset || 'Joyful Uplift (สุข/สดใส)')}
              className="w-full mt-2 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-[11px] rounded-lg border border-[#30363d] transition-all flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3 h-3" /> นำอารมณ์ท่อนนี้ไปใช้กับทุกท่อนในเพลง
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Keyframe Curve Editor & 2D Affect Pad (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Active Vocal Line Header & Text Editor */}
          {activeLine && (
            <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#21262d] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    กำลังปรับแต่ง: Line {selectedLineIndex + 1}
                    <span className="text-xs font-normal text-[#8b949e]">
                      (เวลาเริ่มต้น {activeLine.startSec.toFixed(1)}s, ความยาว {activeLine.durationSec.toFixed(1)}s)
                    </span>
                  </h3>
                </div>
                
                {/* Keyframe Selector Tabs */}
                <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
                  <span className="text-[10px] text-[#8b949e] px-2 font-medium">คีย์เฟรม:</span>
                  {activeLine.keyframes.map((kf, kfIdx) => {
                    const isKfSelected = selectedKeyframeIndex === kfIdx;
                    const label = kfIdx === 0 ? 'ต้นท่อน (0%)' : kfIdx === 1 ? 'กลางท่อน (50%)' : 'ท้ายท่อน (100%)';
                    return (
                      <button
                        key={kfIdx}
                        onClick={() => setSelectedKeyframeIndex(kfIdx)}
                        className={`text-[11px] px-2.5 py-1 rounded font-medium transition-all ${
                          isKfSelected
                            ? 'bg-pink-500 text-white shadow-sm'
                            : 'text-[#8b949e] hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editable Lyrics for this line */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={activeLine.text}
                  onChange={(e) => updateCurrentLine(l => ({ ...l, text: e.target.value }))}
                  className="flex-1 bg-[#0d1117] border border-[#30363d] focus:border-pink-500 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                  placeholder="ข้อความเนื้อเพลงประจำท่อน..."
                />
                <div className="text-[11px] text-pink-400 font-mono bg-pink-500/10 px-3 py-1.5 rounded-lg border border-pink-500/20 shrink-0">
                  {isPlayingSolo ? `กำลังร้อง: ${currentPreviewSyllable || '...'}` : `พร้อมเล่น ${activeLine.durationSec.toFixed(1)}s`}
                </div>
              </div>

              {/* 4 Emotion Intensity Sliders for the Selected Keyframe */}
              {activeLine.keyframes[selectedKeyframeIndex] && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* JOY (Amber) */}
                  <div className="bg-[#0d1117] p-3 rounded-lg border border-amber-500/30 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-amber-400">
                      <span className="flex items-center gap-1.5">
                        <Smile className="w-3.5 h-3.5" /> Joy (ความสุข / สดใส)
                      </span>
                      <span className="font-mono">{Math.round(activeLine.keyframes[selectedKeyframeIndex].joy * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={activeLine.keyframes[selectedKeyframeIndex].joy}
                      onChange={(e) => updateKeyframe(selectedKeyframeIndex, 'joy', parseFloat(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer h-1.5 bg-[#21262d] rounded-lg"
                    />
                    <p className="text-[10px] text-[#8b949e]">
                      ยกฟอร์แมนต์สูง (F1/F2 Brightness), Vibrato สม่ำเสมอ (+15 cents)
                    </p>
                  </div>

                  {/* SADNESS (Sky) */}
                  <div className="bg-[#0d1117] p-3 rounded-lg border border-sky-500/30 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-sky-400">
                      <span className="flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5" /> Sadness (เศร้า / ซาบซึ้ง)
                      </span>
                      <span className="font-mono">{Math.round(activeLine.keyframes[selectedKeyframeIndex].sadness * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={activeLine.keyframes[selectedKeyframeIndex].sadness}
                      onChange={(e) => updateKeyframe(selectedKeyframeIndex, 'sadness', parseFloat(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer h-1.5 bg-[#21262d] rounded-lg"
                    />
                    <p className="text-[10px] text-[#8b949e]">
                      เพิ่มเสียงลมหายใจ (Breathiness), หักมุมเสียงตกท้ายคำ (Falling inflection)
                    </p>
                  </div>

                  {/* ANGER (Rose) */}
                  <div className="bg-[#0d1117] p-3 rounded-lg border border-rose-500/30 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-rose-400">
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" /> Anger (โกรธ / ดุดัน)
                      </span>
                      <span className="font-mono">{Math.round(activeLine.keyframes[selectedKeyframeIndex].anger * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={activeLine.keyframes[selectedKeyframeIndex].anger}
                      onChange={(e) => updateKeyframe(selectedKeyframeIndex, 'anger', parseFloat(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer h-1.5 bg-[#21262d] rounded-lg"
                    />
                    <p className="text-[10px] text-[#8b949e]">
                      เพิ่มความตึงเส้นเสียง (Vocal Tension 90%), Tube Drive, Attack เฉียบพลัน
                    </p>
                  </div>

                  {/* NEUTRAL (Emerald) */}
                  <div className="bg-[#0d1117] p-3 rounded-lg border border-emerald-500/30 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> Neutral (ปกติ / สมดุล)
                      </span>
                      <span className="font-mono">{Math.round(activeLine.keyframes[selectedKeyframeIndex].neutral * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={activeLine.keyframes[selectedKeyframeIndex].neutral}
                      onChange={(e) => updateKeyframe(selectedKeyframeIndex, 'neutral', parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-[#21262d] rounded-lg"
                    />
                    <p className="text-[10px] text-[#8b949e]">
                      เสียงร้องสตูดิโอมาตรฐาน นิ่ง คมชัด ไร้การปรุงแต่งรุนแรง
                    </p>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* Bottom Dual Tools: 2D Affect Pad & Realtime Canvas Waveform */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 2D Emotion Pad (Russell's Circumplex Model) */}
            <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  2D Emotion Pad (Valence-Arousal Plane)
                </span>
                <span className="text-[10px] text-[#8b949e]">คลิกลากเพื่อผสมอารมณ์สด</span>
              </div>

              {/* The Interactive Coordinate Pad */}
              <div
                ref={padRef}
                onClick={handlePadInteraction}
                onMouseMove={(e) => {
                  if (e.buttons === 1) handlePadInteraction(e);
                }}
                className="relative w-full h-[180px] bg-[#090d13] rounded-xl border border-[#30363d] overflow-hidden cursor-crosshair select-none"
              >
                {/* Coordinate Crosshairs */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#21262d]" />
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#21262d]" />

                {/* 4 Quadrant Labels */}
                <span className="absolute top-2 left-2 text-[10px] text-rose-400/70 font-semibold">
                  Anger / Aggressive
                </span>
                <span className="absolute top-2 right-2 text-[10px] text-amber-400/70 font-semibold">
                  Joy / Excited
                </span>
                <span className="absolute bottom-2 left-2 text-[10px] text-sky-400/70 font-semibold">
                  Sadness / Melancholy
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] text-emerald-400/70 font-semibold">
                  Neutral / Serene
                </span>

                {/* Draggable Active Emotion Node Indicator */}
                {activeLine && (
                  <div
                    style={{
                      left: `${Math.max(8, Math.min(92, 50 + (activeLine.joyWeight - activeLine.sadnessWeight) * 45))}%`,
                      top: `${Math.max(8, Math.min(92, 50 - (activeLine.angerWeight + activeLine.joyWeight * 0.4 - activeLine.sadnessWeight * 0.6) * 45))}%`
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-pink-500/40 border-2 border-pink-400 flex items-center justify-center shadow-lg shadow-pink-500/50 animate-pulse pointer-events-none"
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>

              {/* Numeric Feedback Values */}
              <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                <div className="bg-[#0d1117] p-1 rounded border border-[#21262d] text-amber-400">
                  Joy: {Math.round((activeLine?.joyWeight || 0) * 100)}%
                </div>
                <div className="bg-[#0d1117] p-1 rounded border border-[#21262d] text-sky-400">
                  Sad: {Math.round((activeLine?.sadnessWeight || 0) * 100)}%
                </div>
                <div className="bg-[#0d1117] p-1 rounded border border-[#21262d] text-rose-400">
                  Anger: {Math.round((activeLine?.angerWeight || 0) * 100)}%
                </div>
                <div className="bg-[#0d1117] p-1 rounded border border-[#21262d] text-emerald-400">
                  Neut: {Math.round((activeLine?.neutralWeight || 0) * 100)}%
                </div>
              </div>
            </div>

            {/* Realtime Formant Trajectory & Acoustic Modifiers */}
            <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-pink-400" />
                  Acoustic Spectrum & Formant Trajectory
                </span>
                <span className="text-[10px] text-pink-400 font-mono">
                  {isPlayingSolo ? 'LIVE SENSING' : 'READY'}
                </span>
              </div>

              {/* Canvas Waveform */}
              <canvas
                ref={canvasRef}
                width={360}
                height={110}
                className="w-full h-[110px] bg-[#090d13] rounded-xl border border-[#30363d]"
              />

              {/* Micro-Acoustic Fine Tuning Sliders */}
              {activeLine && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#8b949e]">
                      <span>Vocal Tension:</span>
                      <span className="text-white font-mono">{Math.round(activeLine.vocalTension * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={activeLine.vocalTension}
                      onChange={(e) => updateCurrentLine(l => ({ ...l, vocalTension: parseFloat(e.target.value) }))}
                      className="w-full accent-pink-500 cursor-pointer h-1 bg-[#21262d] rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#8b949e]">
                      <span>Breathiness:</span>
                      <span className="text-white font-mono">{Math.round(activeLine.breathiness * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={activeLine.breathiness}
                      onChange={(e) => updateCurrentLine(l => ({ ...l, breathiness: parseFloat(e.target.value) }))}
                      className="w-full accent-sky-400 cursor-pointer h-1 bg-[#21262d] rounded-lg"
                    />
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
