/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Blender EEVEE-Next Real-Time Raytracing & GI Studio (Blender 4.2+ parity).
 *          Interactive viewport with Screen-Space Global Illumination, Ray Steps sliders,
 *          Volumetric Fog Light Shafts, presets (Ultra/Balanced/Perf), and On-Device Offline AI
 *          temporal wavelet denoiser.
 *    - TH: สตูดิโอเรนเดอร์ภาพเสมือนจริงแบบเรียลไทม์ Blender EEVEE-Next (Blender Parity)
 *          วิวพอร์ตจำลองแสงตกกระทบหลายทิศทาง (Horizon Scan GI), แสงลำหมอกควัน (Volumetric Fog),
 *          การสะท้อนพื้นผิวแบบ PBR สมจริง, ตัวปรับแต่งสเต็ปการยิงรังสี และระบบ AI ลดเม็ดสโนว์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `blenderEEVEENextTypes.ts` and `BlenderEEVEENextEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
  Zap,
  Eye,
  Camera,
  Flame,
  CloudRain
} from 'lucide-react';
import { blenderEEVEENextEngine } from '../utils/BlenderEEVEENextEngineNode';
import { BlenderEEVEENextProfile } from '../types/blenderEEVEENextTypes';

interface EEVEENextStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function BlenderEEVEENextStudio({ onSelectTool }: EEVEENextStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [profile, setProfile] = useState<BlenderEEVEENextProfile>(() =>
    blenderEEVEENextEngine.getProfile()
  );

  useEffect(() => {
    return blenderEEVEENextEngine.subscribe(() => {
      setProfile({ ...blenderEEVEENextEngine.getProfile() });
    });
  }, []);

  // EEVEE-Next Raytracing Viewport Simulator Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // 1. Dark Room Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#05070e');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Volumetric Light Shafts (God Rays from top-left)
    if (profile.volumetricShadows) {
      const rayGrad = ctx.createLinearGradient(60, 20, 450, height);
      rayGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      rayGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.20)');
      rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(60, 20);
      ctx.lineTo(240, 20);
      ctx.lineTo(520, height - 40);
      ctx.lineTo(340, height - 40);
      ctx.fill();
    }

    // 3. Ground Plane with Screen Space Reflections
    ctx.fillStyle = '#0a101f';
    ctx.fillRect(40, height - 90, width - 80, 70);

    // Reflection Glare
    if (profile.screenSpaceRaytracing) {
      const reflGrad = ctx.createLinearGradient(0, height - 90, 0, height - 20);
      reflGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      reflGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = reflGrad;
      ctx.fillRect(180, height - 90, 200, 50);
    }

    // 4. Central PBR Metallic Sphere
    const sphereX = width / 2;
    const sphereY = height / 2;
    const radius = 80;

    const sphereGrad = ctx.createRadialGradient(
      sphereX - 25, sphereY - 30, 10,
      sphereX, sphereY, radius
    );
    sphereGrad.addColorStop(0, '#ffffff');
    sphereGrad.addColorStop(0.2, '#38bdf8');
    sphereGrad.addColorStop(0.7, '#1e293b');
    sphereGrad.addColorStop(1, '#090d16');

    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(sphereX, sphereY, radius, 0, Math.PI * 2);
    ctx.fill();

    // 5. Fast GI Indirect Light Bounce (Warm Ambient Glow beneath the sphere)
    if (profile.fastGIEnabled) {
      const giGrad = ctx.createRadialGradient(
        sphereX, sphereY + radius + 10, 10,
        sphereX, sphereY + radius + 10, 120
      );
      giGrad.addColorStop(0, 'rgba(249, 115, 22, 0.45)');
      giGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = giGrad;
      ctx.beginPath();
      ctx.ellipse(sphereX, sphereY + radius + 15, 120, 25, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Viewport Info Overlay
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`EEVEE-Next | Horizon GI: ${profile.fastGIEnabled ? 'ON' : 'OFF'} | Ray Steps: ${profile.settings.raySteps}`, 50, 45);

  }, [profile]);

  return (
    <div className="flex flex-col h-full bg-[#05070e] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#18233c] bg-[#0a1020] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
            <Sun size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Blender EEVEE-Next Real-Time Raytracing & GI Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 text-[10px] font-bold border border-amber-500/40 font-mono">
                Blender 4.2+ EEVEE-Next Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Horizon Scan GI, Screen-Space Raytracing, Volumetrics, and On-Device Offline AI Temporal Denoising.
            </p>
          </div>
        </div>

        {/* Quality Presets */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#94a3b8]">Engine Preset:</span>
          {(['PERFORMANCE', 'BALANCED', 'ULTRA_CINEMATIC'] as const).map(p => (
            <button
              key={p}
              onClick={() => blenderEEVEENextEngine.setPreset(p)}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                profile.currentPreset === p
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-[#18233a] text-[#94a3b8] hover:text-white'
              }`}
            >
              {p.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#18233c] bg-[#05070e] relative">
          
          <div className="p-3 border-b border-[#18233c] bg-[#0a1020]/80 backdrop-blur flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <Camera size={13} className="text-amber-400" />
              Viewport: <strong className="text-amber-300">{profile.sceneName}</strong>
            </span>

            <span className="text-emerald-400 font-bold">
              Temporal Samples: {profile.viewportRenderSamples} SPP
            </span>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
            <canvas
              ref={canvasRef}
              width={720}
              height={420}
              className="max-w-full max-h-full rounded-xl shadow-2xl border border-slate-800"
            />
          </div>

          <div className="p-3 border-t border-[#18233c] bg-[#0a1020] flex items-center justify-between text-xs font-mono">
            <span className="text-[#94a3b8]">Volumetric Tile: <strong>{profile.settings.volumetricTileSize}px</strong></span>
            <span className="text-amber-400 font-bold">Burley Subsurface Scattering: ACTIVE</span>
          </div>

        </div>

        {/* SETTINGS INSPECTOR (4 cols) */}
        <div className="lg:col-span-4 bg-[#080d19] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#18233c] bg-[#0a1020] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={13} className="text-amber-400" /> Raytracing Parameters
            </span>
            <span className="text-[10px] font-mono text-amber-400">{profile.settings.raySteps} Steps</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#0f172a] border border-[#1e293b] space-y-2">
              <div className="flex justify-between items-center text-white font-bold">
                <span>Horizon Fast GI</span>
                <button
                  onClick={() => blenderEEVEENextEngine.toggleFastGI()}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    profile.fastGIEnabled ? 'bg-amber-600 text-white' : 'bg-[#1e293b] text-slate-400'
                  }`}
                >
                  {profile.fastGIEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
              <p className="text-[11px] text-[#94a3b8] font-sans">
                Computes ambient occlusion and indirect bounce lighting at half or full screen resolution.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0f172a] border border-[#1e293b] space-y-1.5">
              <div className="flex justify-between text-white font-bold">
                <span>Volumetric Shadow Cascades</span>
                <span className="text-amber-400">Tile {profile.settings.volumetricTileSize}px</span>
              </div>
              <p className="text-[11px] text-[#94a3b8] font-sans">
                Renders volumetric god rays and dust motes through atmospheric scattering.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">
                On-Device Offline AI Denoising
              </span>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {profile.offlineAIDenoisingSummary}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
