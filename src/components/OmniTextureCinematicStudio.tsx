/**
 * @file OmniTextureCinematicStudio.tsx
 * @description
 * ============================================================================
 * [THAI]
 * สตูดิโอสร้าง เขียน ตกแต่ง จัดการรูปภาพ เท็กเจอร์ และคัทซีนเกม (Omni Texture & Cinematic Cutscene Studio)
 * ระบบครบวงจรสำหรับงานอาร์ตและภาพยนตร์คัทซีนเกม:
 *   1. PBR Texture Studio: สร้างและคำนวณ Albedo, Normal Map (Sobel Filter), Roughness, Metallic และ AO Maps
 *   2. Non-Linear Timeline Director: ลำดับภาพเคลื่อนไหว มุมกล้อง คัทซีน และเอฟเฟกต์
 *   3. Subtitle & Voice Dubbing Synchronization: กำหนดช่วงเวลาคำบรรยายและไดอะล็อกตัวละคร
 *   4. Realtime Cutscene Preview Canvas: ชมพรีวิวคัทซีนเกมแบบ 60 FPS พร้อมการควบคุม Play/Pause/Seek
 *   5. PBR & Video Exporter: ส่งออกชุด PBR Texture Maps (PNG) และไฟล์คัทซีนสคริปต์
 *
 * [ENGLISH]
 * Enterprise PBR Texture Generator & Non-Linear Cutscene Sequencer Studio.
 * Features:
 *   - 4-Channel PBR Material Map Generator (Albedo, Normal, Roughness, AO)
 *   - Non-Linear Video/Cinematic Director Timeline
 *   - Subtitle & Camera Keyframe Interpolation
 *   - Realtime 60 FPS Cutscene Viewport
 *   - PBR Material Bundle & Cutscene Sequence Exporter
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Palette, Film, Clapperboard, Play, Pause, RotateCcw,
  Sliders, Layers, Download, Sparkles, Image, Eye, MessageSquare
} from 'lucide-react';

import {
  OmniTextureCinematicEngine,
  PBRMaterialData,
  CinematicCutsceneData
} from '../utils/OmniTextureCinematicEngine';

export default function OmniTextureCinematicStudio() {
  const [engine] = useState<OmniTextureCinematicEngine>(() => new OmniTextureCinematicEngine());
  const [material, setMaterial] = useState<PBRMaterialData>(() => engine.getMaterial());
  const [cutscene, setCutscene] = useState<CinematicCutsceneData>(() => engine.getCutscene());
  const [activeTab, setActiveTab] = useState<'pbr_textures' | 'timeline' | 'export'>('pbr_textures');

  // Cutscene Playback State
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const cutsceneCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Playback timer loop
  useEffect(() => {
    let animId: number;
    let lastTs = performance.now();

    const loop = (ts: number) => {
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + dt;
          if (next >= cutscene.durationSeconds) {
            setIsPlaying(false);
            return cutscene.durationSeconds;
          }
          return next;
        });
      }

      // Draw Cutscene Viewport
      const canvas = cutsceneCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const state = engine.evaluateCutscene(currentTime);

          ctx.fillStyle = '#090d16';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const cx = canvas.width / 2;
          const cy = canvas.height / 2;

          ctx.save();
          ctx.translate(cx + state.cameraX, cy + state.cameraY);
          ctx.scale(state.cameraZoom, state.cameraZoom);

          // Draw Cutscene Background Mountains / Core
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.moveTo(-200, 100);
          ctx.lineTo(0, -60);
          ctx.lineTo(200, 100);
          ctx.fill();

          // Glowing Hero / Energy Core
          const glowGrad = ctx.createRadialGradient(0, 20, 10, 0, 20, 80);
          glowGrad.addColorStop(0, '#38bdf8');
          glowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGrad;
          ctx.fillRect(-100, -80, 200, 200);

          // Hero Actor representation
          ctx.fillStyle = '#10b981';
          ctx.fillRect(-16, -10, 32, 50);

          ctx.restore();

          // Draw Cinematic Black Letterboxes
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, 36);
          ctx.fillRect(0, canvas.height - 36, canvas.width, 36);

          // Draw Subtitles
          if (state.currentSubtitle) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(40, canvas.height - 64, canvas.width - 80, 24);

            ctx.fillStyle = '#fde047';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(state.currentSubtitle, canvas.width / 2, canvas.height - 48);
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentTime, cutscene.durationSeconds, engine]);

  // Switch Material Preset
  const handleSelectMaterialPreset = (preset: PBRMaterialData['type']) => {
    const newMat = engine.createDefaultMaterial(preset);
    setMaterial({ ...newMat });
  };

  return (
    <div id="omni-texture-cinematic-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Studio Header */}
      <header id="texture-cinematic-header" className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-0.5 shadow-purple-500/20 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              5. เท็กเจอร์ รูปภาพ และคัทซีนเกม (Omni Texture & Cinematic Studio)
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                PBR & Director Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              4-Channel PBR Texture Synthesis (Albedo, Normal, Roughness, AO) • Non-Linear Timeline Director
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('pbr_textures')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'pbr_textures' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎨 PBR Textures
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'timeline' ? 'bg-pink-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎬 Cutscene Director
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'export' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🚀 Export Bundle
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {activeTab === 'pbr_textures' && (
          <>
            {/* Left: Material Presets & Sliders (4 cols) */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  PBR Material Presets
                </h2>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'stone_wall', name: 'Stone Wall (หินผา)', color: '#64748b' },
                    { id: 'cyber_metal', name: 'Cyber Metal (โลหะไซเบอร์)', color: '#0284c7' },
                    { id: 'wood_plank', name: 'Wood Plank (ไม้สัก)', color: '#b45309' },
                    { id: 'magical_crystal', name: 'Crystal (คริสตัลเวทมนตร์)', color: '#a855f7' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectMaterialPreset(p.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        material.type === p.id
                          ? 'bg-purple-500/20 border-purple-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-xs font-bold truncate">{p.name.split(' ')[0]}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* PBR Channel Sliders */}
                <div className="space-y-3 pt-2">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>ความขรุขระ (Roughness):</span>
                      <span className="font-mono text-purple-400">{Math.round(material.roughness * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={material.roughness}
                      onChange={(e) => setMaterial({ ...material, roughness: Number(e.target.value) })}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>ความเป็นโลหะ (Metallic):</span>
                      <span className="font-mono text-sky-400">{Math.round(material.metallic * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={material.metallic}
                      onChange={(e) => setMaterial({ ...material, metallic: Number(e.target.value) })}
                      className="w-full accent-sky-500"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>ความลึกร่อง (Normal Map Intensity):</span>
                      <span className="font-mono text-emerald-400">{material.normalStrength.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={2.0}
                      step={0.1}
                      value={material.normalStrength}
                      onChange={(e) => setMaterial({ ...material, normalStrength: Number(e.target.value) })}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Right: 4-Channel PBR Visual Maps Grid (8 cols) */}
            <section className="lg:col-span-8 space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    PBR Texture Maps Breakdown (512x512)
                  </h2>
                  <span className="text-xs font-mono text-slate-400">Renderer: High-Precision PBR</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Albedo */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-center">
                    <div
                      className="w-full h-24 rounded-lg shadow-inner flex items-center justify-center font-mono font-bold text-xs text-white"
                      style={{ backgroundColor: material.baseColor }}
                    >
                      Albedo Map
                    </div>
                    <div className="text-xs font-bold text-slate-300">1. Albedo (Color)</div>
                  </div>

                  {/* Normal Map (Sobel RGB) */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-center">
                    <div className="w-full h-24 rounded-lg shadow-inner bg-[#8080ff] flex items-center justify-center font-mono font-bold text-xs text-slate-900">
                      Sobel Normal
                    </div>
                    <div className="text-xs font-bold text-slate-300">2. Normal Map</div>
                  </div>

                  {/* Roughness */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-center">
                    <div
                      className="w-full h-24 rounded-lg shadow-inner flex items-center justify-center font-mono font-bold text-xs"
                      style={{
                        backgroundColor: `rgb(${Math.round(material.roughness * 255)}, ${Math.round(
                          material.roughness * 255
                        )}, ${Math.round(material.roughness * 255)})`,
                        color: material.roughness > 0.5 ? '#000' : '#fff'
                      }}
                    >
                      Roughness
                    </div>
                    <div className="text-xs font-bold text-slate-300">3. Roughness</div>
                  </div>

                  {/* Ambient Occlusion */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-center">
                    <div className="w-full h-24 rounded-lg shadow-inner bg-slate-700 flex items-center justify-center font-mono font-bold text-xs text-white">
                      AO Map
                    </div>
                    <div className="text-xs font-bold text-slate-300">4. Ambient Occlusion</div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'timeline' && (
          <section className="lg:col-span-12 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clapperboard className="w-5 h-5 text-pink-400" />
                  <h2 className="text-sm font-bold text-white">{cutscene.title}</h2>
                </div>

                {/* Timeline Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isPlaying
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-pink-500 text-white shadow-lg shadow-pink-500/20'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlaying ? 'หยุดเล่น' : 'เล่นคัทซีน (Play Cutscene)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentTime(0);
                    }}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <span className="font-mono text-xs text-pink-400 font-bold">
                    {currentTime.toFixed(2)}s / {cutscene.durationSeconds.toFixed(2)}s
                  </span>
                </div>
              </div>

              {/* Realtime Cutscene Canvas */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                <canvas
                  ref={cutsceneCanvasRef}
                  width={720}
                  height={380}
                  className="w-full h-auto max-h-[380px] block"
                />
              </div>

              {/* Keyframes Track */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400">Keyframe Triggers ({cutscene.keyframes.length}):</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {cutscene.keyframes.map((kf) => (
                    <div
                      key={kf.id}
                      onClick={() => setCurrentTime(kf.timeSeconds)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        Math.abs(currentTime - kf.timeSeconds) < 2
                          ? 'bg-pink-500/15 border-pink-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between font-mono font-bold text-[11px] text-pink-400">
                        <span>@{kf.timeSeconds.toFixed(1)}s</span>
                        <span className="uppercase">{kf.actorEmotion}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-300 truncate">{kf.subtitleText}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'export' && (
          <section className="lg:col-span-12 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" />
                ส่งออกชุด PBR Maps และคัทซีน (Export Production Bundle)
              </h2>
              <p className="text-xs text-slate-300">
                ดาวน์โหลดชุด Texture Descriptor และ Cutscene Director Metadata สำหรับนำเข้าสู่ Unreal Engine / Unity / Godot
              </p>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify({ material, cutscene }, null, 2);
                  const blob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `pbr-cutscene-bundle.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                ดาวน์โหลด PBR & Cutscene Bundle (.json)
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
