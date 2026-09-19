/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Blender Mantaflow Navier-Stokes Fluid, Smoke, Fire & FLIP Particle Simulation Studio.
 *          Simulates liquid splashing, droplet advection, domain voxel grid calculations,
 *          OpenVDB frame cache baking, and On-Device Offline AI Physics Stability Tuning (Zero-Token Guarantee).
 *    - TH: สตูดิโอจำลองฟิสิกส์ของไหลและควันไฟ Blender Mantaflow Fluid & Smoke Studio
 *          แสดงผลการสาดกระเซ็นของของเหลวบน Canvas, การคำนวณกริด Voxel ความละเอียดสูง,
 *          ระบบ Bake แคช OpenVDB 120 เฟรม, และระบบ AI ออฟไลน์ช่วยวิเคราะห์เสถียรภาพตัวเลข CFL
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `blenderMantaflowTypes.ts` and `BlenderMantaflowEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Droplets,
  Wind,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  Database,
  Layers,
  Box,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { blenderMantaflowEngine } from '../utils/BlenderMantaflowEngineNode';
import { BlenderMantaflowProfile } from '../types/blenderMantaflowTypes';

interface MantaflowStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function BlenderMantaflowFluidStudio({ onSelectTool }: MantaflowStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [profile, setProfile] = useState<BlenderMantaflowProfile>(() =>
    blenderMantaflowEngine.getProfile()
  );

  useEffect(() => {
    return blenderMantaflowEngine.subscribe(() => {
      setProfile({ ...blenderMantaflowEngine.getProfile() });
    });
  }, []);

  // Canvas Liquid / Splash Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Dark 3D Viewport
    ctx.fillStyle = '#050a14';
    ctx.fillRect(0, 0, width, height);

    // Bounding Box (Domain Wireframe)
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, 40, width - 120, height - 80);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('MANTAFLOW DOMAIN BOUNDS (EULERIAN GRID)', 65, 32);

    // Liquid Fluid Body (Simulated Splash Wave)
    const baseY = height - 100;
    const grad = ctx.createLinearGradient(0, baseY - 90, 0, baseY + 60);
    grad.addColorStop(0, '#38bdf8'); // Surface crest
    grad.addColorStop(0.5, '#0284c7');
    grad.addColorStop(1, '#0c4a6e'); // Deep liquid

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(60, baseY + 60);
    ctx.lineTo(60, baseY - 20);

    // Dynamic wave peaks
    ctx.bezierCurveTo(width * 0.25, baseY - 70, width * 0.35, baseY + 30, width * 0.5, baseY - 40);
    ctx.bezierCurveTo(width * 0.65, baseY - 90, width * 0.75, baseY - 10, width - 60, baseY - 25);
    ctx.lineTo(width - 60, baseY + 60);
    ctx.closePath();

    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // FLIP Particle Droplets in the Air
    ctx.fillStyle = '#bae6fd';
    const particles = [
      { x: width * 0.3, y: baseY - 110, r: 3.5 },
      { x: width * 0.33, y: baseY - 130, r: 2.5 },
      { x: width * 0.52, y: baseY - 100, r: 4 },
      { x: width * 0.68, y: baseY - 125, r: 3 },
      { x: width * 0.71, y: baseY - 145, r: 2 }
    ];
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();

    // Voxel density readout overlay
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(`Grid Voxels: ${profile.totalVoxelCount.toLocaleString()}`, 70, height - 55);
    ctx.fillText(`Solver: ${profile.solverType} (FLIP Ratio: ${profile.flipRatio})`, width - 260, height - 55);

  }, [profile]);

  return (
    <div className="flex flex-col h-full bg-[#060a14] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1b253b] bg-[#0c1220] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-lg">
            <Droplets size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Blender Mantaflow Navier-Stokes Fluid & FLIP Particles Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-400 text-[10px] font-bold border border-blue-500/40 font-mono">
                Blender Mantaflow Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Eulerian Incompressible Navier-Stokes Grid, FLIP Particle Advection, and On-Device Offline AI Physics Stability Tuner.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => blenderMantaflowEngine.bakeSimulation()}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition cursor-pointer"
          >
            <Play size={13} fill="currentColor" />
            {profile.isBaked ? `Baked (${profile.bakedFramesCount} Frames)` : 'Bake OpenVDB Simulation'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1b253b] bg-[#060a14] relative">
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1220]/80 backdrop-blur flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <Activity size={13} className="text-blue-400" />
              Domain: <strong className="text-blue-300">{profile.domainName}</strong>
            </span>
            <span className="text-blue-400 font-bold">
              Resolution: {profile.domainResolutionDivisions} Divisions ({(profile.totalVoxelCount / 1e6).toFixed(2)}M Cells)
            </span>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-3">
            <canvas
              ref={canvasRef}
              width={750}
              height={430}
              className="max-w-full max-h-full"
            />
          </div>

          <div className="p-3 border-t border-[#1b253b] bg-[#0c1220] flex items-center justify-between text-xs font-mono">
            <span className="text-[#94a3b8]">Viscosity: <strong>{profile.viscosityBase} cP</strong></span>
            <span className="text-cyan-400 font-bold">Surface Tension: {profile.surfaceTension} N/m</span>
          </div>
        </div>

        {/* CONTROLS & ON-DEVICE AI STABILITY (4 cols) */}
        <div className="lg:col-span-4 bg-[#090d18] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1220] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={13} className="text-blue-400" /> Domain Physics Parameters
            </span>
            <span className="text-[10px] font-mono text-emerald-400">CFL Safe</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {/* Resolution Slider */}
            <div className="p-3.5 rounded-xl bg-[#0e1526] border border-[#1d2943] space-y-2">
              <div className="flex justify-between items-center text-white font-bold font-sans">
                <span>Domain Resolution</span>
                <span className="text-blue-400 font-mono">{profile.domainResolutionDivisions} Div</span>
              </div>
              <input
                type="range"
                min="64"
                max="256"
                step="32"
                value={profile.domainResolutionDivisions}
                onChange={(e) => blenderMantaflowEngine.setResolution(Number(e.target.value))}
                className="w-full accent-blue-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748b]">
                <span>64 (Draft - 262K Voxels)</span>
                <span>256 (Hero - 16.7M Voxels)</span>
              </div>
            </div>

            {/* Solver Type Toggle */}
            <div className="p-3.5 rounded-xl bg-[#0e1526] border border-[#1d2943] space-y-2 font-sans">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Fluid Advection Method
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => blenderMantaflowEngine.setSolverType('FLIP')}
                  className={`py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                    profile.solverType === 'FLIP'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-[#070b14] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  FLIP (Splash/Spray)
                </button>
                <button
                  onClick={() => blenderMantaflowEngine.setSolverType('APIC')}
                  className={`py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                    profile.solverType === 'APIC'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-[#070b14] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  APIC (Stable/Viscous)
                </button>
              </div>
            </div>

            {/* On-Device Offline AI Fluid Optimizer Card */}
            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-blue-400 block uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> On-Device Offline AI Mantaflow Tuner
              </span>
              <p className="text-xs text-blue-200/90 leading-relaxed">
                {profile.offlineAIInsight}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
