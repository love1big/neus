/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: AAA Lumen Dynamic GI & Surface Cache Architecture Studio (Unreal Engine 5
 *          Lumen Parity). Inspects Surface Cache card projections, Mesh Signed Distance
 *          Fields (Mesh SDF), Software vs Hardware Ray Tracing, multi-bounce indirect
 *          diffuse lighting probes, and real-time GPU frame times.
 *    - TH: สตูดิโอระบบสถาปัตยกรรมแสงไดนามิก Lumen Surface Cache & Global Illumination
 *          ระดับ AAA (เทียบเท่าสถาปัตยกรรม Unreal Engine 5 Lumen)
 *          ตรวจสอบผังการฉายการ์ดแคชพื้นผิว (Surface Cache Cards), โครงข่าย SDF,
 *          การสลับระหว่าง Hardware Ray Tracing (HWRT) กับ Software SDF (SWRT),
 *          การสะท้อนแสงทางอ้อมหลายรอบ (Multi-Bounce Indirect GI),
 *          และติดตามระยะเวลาประมวลผลของ GPU (Frame Time Ms)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `lumenGITypes.ts` and `LumenGIArchitectureNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Layers,
  Zap,
  Sliders,
  Sparkles,
  Eye,
  Activity,
  Maximize2,
  CheckCircle2,
  Box,
  Compass,
  Cpu
} from 'lucide-react';
import { lumenGIArchitectureNode } from '../utils/LumenGIArchitectureNode';
import { LumenRayTracingMode, LumenDebugViewMode, LumenGIProfile } from '../types/lumenGITypes';

interface LumenStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function LumenSurfaceCacheGlobalIlluminationStudio({ onSelectTool }: LumenStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [profile, setProfile] = useState<LumenGIProfile>(() => lumenGIArchitectureNode.getProfile());
  const [orbitAngle, setOrbitAngle] = useState<number>(0.5);

  useEffect(() => {
    return lumenGIArchitectureNode.subscribe(() => {
      setProfile(lumenGIArchitectureNode.getProfile());
    });
  }, []);

  // Render 3D/Isometric Lumen Viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Dark ambient space
    ctx.fillStyle = '#05070d';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 55;

    const cards = lumenGIArchitectureNode.getSurfaceCards();
    const probes = lumenGIArchitectureNode.getProbes();

    const cos = Math.cos(orbitAngle);
    const sin = Math.sin(orbitAngle);

    // Draw Surface Cache Cards
    cards.forEach(card => {
      const [x, y, z] = card.worldPosition;
      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      const px = centerX + rx * scale;
      const py = centerY - y * scale;

      const [w, h] = card.sizeMeters;
      const pw = w * scale;
      const ph = h * scale;

      ctx.save();
      ctx.translate(px, py);

      if (profile.debugView === 'SURFACE_CACHE') {
        ctx.fillStyle = card.albedoColor + '44';
        ctx.strokeStyle = card.albedoColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
        ctx.fillRect(-pw / 2, -ph / 2, pw, ph);

        // Atlas index
        ctx.fillStyle = '#ffffff';
        ctx.font = '9px monospace';
        ctx.fillText(`Card ${card.cardIndex}`, -pw / 2 + 4, -ph / 2 + 12);
      } else if (profile.debugView === 'MESH_SDF') {
        // Distance field concentric rings
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(15, pw / 2), 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // LUMEN_SCENE / RADIANCE
        ctx.fillStyle = '#eab30833';
        ctx.strokeStyle = '#fde047';
        ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
        ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
      }

      ctx.restore();
    });

    // Draw Radiance Probes & Indirect Photons
    probes.forEach(probe => {
      const [x, y, z] = probe.position;
      const rx = x * cos - z * sin;
      const px = centerX + rx * scale;
      const py = centerY - y * scale;

      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = probe.indirectColorHex;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Bounce lines connecting to nearby cards
      if (profile.debugView === 'RADIANCE_PROBES' || profile.maxBounces > 2) {
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + 25, py - 20);
        ctx.strokeStyle = probe.indirectColorHex + '66';
        ctx.stroke();
      }
    });

  }, [profile, orbitAngle]);

  return (
    <div className="flex flex-col h-full bg-[#05070d] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0a0f1c] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-yellow-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
            <Sun size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Lumen Surface Cache & Global Illumination Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 text-[10px] font-bold border border-amber-500/40 font-mono">
                Unreal Engine 5 Lumen Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Surface Cache atlas cards, Mesh Signed Distance Fields (Mesh SDF), Software vs Hardware Ray Tracing, and multi-bounce indirect diffuse GI.
            </p>
          </div>
        </div>

        {/* RT Mode Selector */}
        <div className="flex items-center gap-1.5 bg-[#12182b] p-1 rounded-xl border border-[#1e2742]">
          {(['SOFTWARE_SDF', 'HARDWARE_RAYTRACING', 'SCREEN_TRACES_HYBRID'] as LumenRayTracingMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => lumenGIArchitectureNode.setRayTracingMode(mode)}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                profile.rtMode === mode
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1b2542]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1c2438] bg-[#05070d] relative">
          
          {/* Debug View Selector Bar */}
          <div className="p-3 border-b border-[#1c2438] bg-[#0a0f1c]/80 backdrop-blur flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              {(['SURFACE_CACHE', 'MESH_SDF', 'RADIANCE_PROBES', 'LUMEN_SCENE'] as LumenDebugViewMode[]).map(view => (
                <button
                  key={view}
                  onClick={() => lumenGIArchitectureNode.setDebugView(view)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                    profile.debugView === view
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-amber-400 font-bold">
              GPU Cost: {profile.gpuFrameTimeMs.toFixed(2)} ms
            </span>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={440}
              className="max-w-full max-h-full"
            />
          </div>

          {/* Orbit Control Footer */}
          <div className="p-3 border-t border-[#1c2438] bg-[#0a0f1c] flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#94a3b8] font-mono">Orbit View:</span>
              <input
                type="range"
                min="0"
                max={Math.PI * 2}
                step="0.05"
                value={orbitAngle}
                onChange={(e) => setOrbitAngle(parseFloat(e.target.value))}
                className="w-48 accent-amber-500 h-1.5 bg-[#18233c] rounded-lg cursor-pointer"
              />
            </div>
            <span className="text-[11px] font-mono text-[#64748b]">
              Allocated Surface Cards: {profile.totalSurfaceCardsAllocated} | Resident Mesh SDFs: {profile.totalSDFMeshesResident}
            </span>
          </div>

        </div>

        {/* LUMEN CONFIG & TELEMETRY (4 cols) */}
        <div className="lg:col-span-4 bg-[#080d1a] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1c2438] bg-[#0f172c] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={13} className="text-amber-400" /> Lumen Parameters
            </span>
            <span className="text-[10px] font-mono text-amber-400">UE5 Engine</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Max Bounces Slider */}
            <div className="p-3.5 rounded-xl bg-[#0f172c] border border-[#1e2a48] space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Indirect Diffuse Bounces</span>
                <span className="font-mono text-amber-400">{profile.maxBounces} Bounces</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={profile.maxBounces}
                onChange={(e) => lumenGIArchitectureNode.setMaxBounces(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-[#18233c] rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-[#64748b] block">
                Higher bounces increase radiance color bleeding into shadowed alcoves
              </span>
            </div>

            {/* Architecture Details Card */}
            <div className="p-3.5 rounded-xl bg-[#0f172c] border border-[#1e2a48] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Lumen Ray Tracer Breakdown
              </span>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-[#131e38] border border-[#1e2a48]">
                  <span className="text-[#94a3b8]">Active Tracer:</span>
                  <span className="text-amber-400 font-bold">{profile.rtMode}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#131e38] border border-[#1e2a48]">
                  <span className="text-[#94a3b8]">Surface Cache Scale:</span>
                  <span className="text-white font-bold">{profile.surfaceCacheResolutionScale.toFixed(1)}x</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#131e38] border border-[#1e2a48]">
                  <span className="text-[#94a3b8]">Max Trace Distance:</span>
                  <span className="text-emerald-400 font-bold">{profile.rayStepDistanceMeters} meters</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
