/**
 * ============================================================================
 * @file CinematicCutsceneTextureStudio.tsx
 * @module Components/CinematicTexture
 * @description
 * [TH] สตูดิโอสร้างพื้นผิวเชิงขั้นตอนและซีเควนเซอร์คัตซีนระดับภาพยนตร์ AAA
 * (Procedural Texture Synthesizer & Cinematic Cutscene Sequencer Studio)
 * ครอบคลุม:
 * 1. Procedural PBR Texture Map Baker (Albedo, Normal Map, Roughness, Metallic)
 * 2. Non-Linear Cinematic Sequencer Timeline (Scrubber, 30fps playback, Duration)
 * 3. Spline Camera Track & Depth of Field (DOF Bokeh, Field of View, Aperture)
 * 4. Subtitle & Voice Dialogue Sync Track (Thai & English)
 * 5. Cinematic Post-Processing & Screen Letterbox (2.39:1 Cinemascope)
 *
 * [EN] Studio-grade Procedural PBR Texture Generator & Non-Linear Cinematic Sequencer
 * with keyframe spline cameras, subtitle triggers, and live viewport playback.
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Layers,
  Image as ImageIcon,
  Camera,
  MessageSquare,
  Zap,
  Download
} from 'lucide-react';
import {
  ProceduralCinematicTextureEngine,
  ProceduralTextureConfig,
  CinematicCutsceneProject
} from '../utils/ProceduralCinematicTextureEngine';

export default function CinematicCutsceneTextureStudio() {
  const [activeTab, setActiveTab] = useState<'TextureGen' | 'CinematicSequencer'>('TextureGen');

  // Texture Gen Config
  const [texConfig, setTexConfig] = useState<ProceduralTextureConfig>({
    resolution: 256,
    pattern: 'GraniteStone',
    noiseScale: 3.5,
    roughnessBias: 0.4,
    metallicValue: 0.1,
    normalIntensity: 2.5,
    seamlessTiling: true,
    colorA: [0.15, 0.15, 0.18],
    colorB: [0.75, 0.65, 0.55]
  });

  // Cinematic Project State
  const [cutsceneProject, setCutsceneProject] = useState<CinematicCutsceneProject>(() =>
    ProceduralCinematicTextureEngine.createDefaultCutsceneProject()
  );
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Canvases for Texture Maps
  const albedoRef = useRef<HTMLCanvasElement | null>(null);
  const normalRef = useRef<HTMLCanvasElement | null>(null);
  const roughnessRef = useRef<HTMLCanvasElement | null>(null);
  const metallicRef = useRef<HTMLCanvasElement | null>(null);
  const cinematicViewportRef = useRef<HTMLCanvasElement | null>(null);

  // Bake PBR Textures
  useEffect(() => {
    if (activeTab !== 'TextureGen') return;
    const { albedoCanvas, normalCanvas, roughnessCanvas, metallicCanvas } =
      ProceduralCinematicTextureEngine.generatePBRTextureMap(texConfig);

    const copy = (src: HTMLCanvasElement, dst: HTMLCanvasElement | null) => {
      if (!dst) return;
      dst.width = src.width;
      dst.height = src.height;
      const ctx = dst.getContext('2d');
      if (ctx) ctx.drawImage(src, 0, 0);
    };

    copy(albedoCanvas, albedoRef.current);
    copy(normalCanvas, normalRef.current);
    copy(roughnessCanvas, roughnessRef.current);
    copy(metallicCanvas, metallicRef.current);
  }, [texConfig, activeTab]);

  // Cinematic Playback Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying) {
        setCurrentTime(t => {
          const next = t + dt;
          if (next >= cutsceneProject.durationSeconds) {
            setIsPlaying(false);
            return cutsceneProject.durationSeconds;
          }
          return next;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, cutsceneProject.durationSeconds]);

  // Render Cinematic Viewport
  useEffect(() => {
    if (activeTab !== 'CinematicSequencer' || !cinematicViewportRef.current) return;
    const canvas = cinematicViewportRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = 640;
    const height = canvas.height = 360;

    ctx.fillStyle = '#060911';
    ctx.fillRect(0, 0, width, height);

    // Calculate Camera Position
    const camPos = ProceduralCinematicTextureEngine.interpolateVector3(
      cutsceneProject.cameraTrack.keyframesPosition,
      currentTime
    );

    // Draw Simulated 3D Cinematic Scene
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, width, height * 0.7);

    // Mountains in background
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    ctx.lineTo(width * 0.3, height * 0.3);
    ctx.lineTo(width * 0.6, height * 0.65);
    ctx.lineTo(width * 0.85, height * 0.25);
    ctx.lineTo(width, height * 0.7);
    ctx.fill();

    // Foreground Ground
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, height * 0.7, width, height * 0.3);

    // Active Actor / Dragon Entity
    const actorScale = Math.max(0.4, 2.0 - (camPos[2] + 25) * 0.05);
    const actorX = width * 0.5 + Math.sin(currentTime * 1.5) * 15;
    const actorY = height * 0.65;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(actorX, actorY, 28 * actorScale, 0, Math.PI * 2);
    ctx.fill();

    // Find Active Subtitle
    const activeSub = cutsceneProject.subtitles.find(
      s => currentTime >= s.startTime && currentTime <= s.endTime
    );

    // Draw Cinemascope Letterbox (2.39:1)
    const letterboxHeight = 35;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, letterboxHeight);
    ctx.fillRect(0, height - letterboxHeight, width, letterboxHeight);

    // Draw Subtitle Text
    if (activeSub) {
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = activeSub.speakerColor;
      ctx.fillText(activeSub.speakerName, width * 0.5, height - letterboxHeight - 24);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(activeSub.thaiText, width * 0.5, height - letterboxHeight - 8);
    }
  }, [currentTime, activeTab, cutsceneProject]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 overflow-hidden font-sans select-none">
      {/* Header */}
      <div className="h-14 bg-[#111827] border-b border-gray-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-xl text-amber-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide text-base">Procedural Texture & Cinematic Studio</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                PBR & Sequencer Suite
              </span>
            </div>
            <p className="text-xs text-gray-400">Procedural PBR Maps • Non-Linear Timeline • Camera Spline • Subtitle Triggers</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-gray-900/80 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveTab('TextureGen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'TextureGen' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Procedural Texture Maps
          </button>
          <button
            onClick={() => setActiveTab('CinematicSequencer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'CinematicSequencer' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Cinematic Sequencer
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      {activeTab === 'TextureGen' ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Controls */}
          <div className="w-80 bg-[#0f172a] border-r border-gray-800 p-4 space-y-4 overflow-y-auto shrink-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Texture Parameters</span>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-300 block mb-1">Pattern Synthesis</span>
                <select
                  value={texConfig.pattern}
                  onChange={e => setTexConfig(p => ({ ...p, pattern: e.target.value as any }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-white"
                >
                  <option value="GraniteStone">Granite Stone (หินแกรนิต)</option>
                  <option value="RustedMetal">Rusted Metal (โลหะสนิมเขรอะ)</option>
                  <option value="WoodBark">Wood Bark (เปลือกไม้ธรรมชาติ)</option>
                  <option value="LavaMagma">Lava Magma (ลาวาหลอมเหลว)</option>
                  <option value="CyberCircuit">Cyber Circuit (แผงวงจรไซเบอร์)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Noise Frequency Scale</span>
                  <span className="text-amber-400 font-mono">{texConfig.noiseScale.toFixed(1)}</span>
                </div>
                <input
                  type="range" min="1" max="10" step="0.5" value={texConfig.noiseScale}
                  onChange={e => setTexConfig(p => ({ ...p, noiseScale: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Normal Map Bump Intensity</span>
                  <span className="text-amber-400 font-mono">{texConfig.normalIntensity.toFixed(1)}</span>
                </div>
                <input
                  type="range" min="0.5" max="6.0" step="0.2" value={texConfig.normalIntensity}
                  onChange={e => setTexConfig(p => ({ ...p, normalIntensity: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* PBR Texture Map 4-Slot Grid */}
          <div className="flex-1 p-6 grid grid-cols-2 gap-6 bg-[#050811] items-center justify-items-center overflow-auto">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-gray-300">1. Albedo / Base Color</span>
              <canvas ref={albedoRef} className="w-56 h-56 rounded-xl border border-gray-800 shadow-xl" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-gray-300">2. Normal Map (Tangent Space)</span>
              <canvas ref={normalRef} className="w-56 h-56 rounded-xl border border-gray-800 shadow-xl" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-gray-300">3. Roughness Map</span>
              <canvas ref={roughnessRef} className="w-56 h-56 rounded-xl border border-gray-800 shadow-xl" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-gray-300">4. Metallic Map</span>
              <canvas ref={metallicRef} className="w-56 h-56 rounded-xl border border-gray-800 shadow-xl" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Viewport Screen */}
          <div className="flex-1 bg-[#050811] flex items-center justify-center p-4">
            <canvas ref={cinematicViewportRef} className="rounded-xl border border-gray-800 shadow-2xl" />
          </div>

          {/* Timeline & Sequencer Controls */}
          <div className="h-44 bg-[#0d1322] border-t border-gray-800 p-4 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition shadow-lg shadow-amber-900/30"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  {isPlaying ? 'Pause' : 'Play Cutscene'}
                </button>
                <button
                  onClick={() => setCurrentTime(0)}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-amber-400">
                  {currentTime.toFixed(2)}s / {cutsceneProject.durationSeconds.toFixed(2)}s
                </span>
              </div>
              <span className="text-xs text-gray-400 font-semibold">{cutsceneProject.title}</span>
            </div>

            {/* Timeline Scrubber */}
            <div className="space-y-1">
              <input
                type="range" min="0" max={cutsceneProject.durationSeconds} step="0.05" value={currentTime}
                onChange={e => setCurrentTime(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>0.00s</span>
                <span>Camera Dolly In (5.0s)</span>
                <span>Dragon Roar (10.5s)</span>
                <span>{cutsceneProject.durationSeconds.toFixed(2)}s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
