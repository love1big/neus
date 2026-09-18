/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: AAA Chaos Flesh Muscle & Soft-Body Deformation Studio (Unreal Engine 5
 *          Chaos Flesh & FEM soft-body parity). Provides interactive tetrahedral mesh
 *          visualization, real-time muscle contraction flexing, Poisson volume bulging,
 *          stress-strain tensor heatmaps, and biological tissue stiffness tuning.
 *    - TH: สตูดิโอระบบ Chaos Flesh Soft-Body & Muscle Deformation ระดับ AAA
 *          (เทียบเท่าสถาปัตยกรรม UE5 Chaos Flesh)
 *          แสดงผลโครงตาข่ายเตตระฮีดรอล (Tetrahedral Mesh), ปรับแต่งการเกร็งกล้ามเนื้อสดๆ
 *          (Muscle Contraction Activation), จำลองการป่องขยายรักษาปริมาตร (Poisson Ratio Bulge),
 *          และแสดง Heatmap ความเค้นความเครียด (Stress Tensor) แบบเรียลไทม์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `chaosFleshTypes.ts` and `ChaosFleshSimulationNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Zap,
  Sliders,
  Sparkles,
  Flame,
  Shield,
  Layers,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { chaosFleshEngine } from '../utils/ChaosFleshSimulationNode';
import { ChaosFleshRigProfile, MuscleFiber } from '../types/chaosFleshTypes';

interface ChaosFleshStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function ChaosFleshMuscleDeformationStudio({ onSelectTool }: ChaosFleshStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [profile] = useState<ChaosFleshRigProfile>(() => chaosFleshEngine.getProfile());
  const [muscle, setMuscle] = useState<MuscleFiber>(() => chaosFleshEngine.getMuscleFiber());
  const [rotationAngle, setRotationAngle] = useState<number>(0.4);

  useEffect(() => {
    return chaosFleshEngine.subscribe(() => {
      setMuscle(chaosFleshEngine.getMuscleFiber());
    });
  }, []);

  // 3D Wireframe Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Canvas background
    ctx.fillStyle = '#060912';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 140;

    const verts = chaosFleshEngine.getVertices();

    // Rotate and project vertices to 2D
    const cos = Math.cos(rotationAngle);
    const sin = Math.sin(rotationAngle);

    const projected = verts.map(v => {
      const [x, y, z] = v.currentPos;
      // Rotate around Y axis
      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      const px = centerX + rx * scale;
      const py = centerY - y * scale;
      return { ...v, px, py, rz };
    });

    // Draw connecting lattice lines (rings and longitudinals)
    ctx.lineWidth = 1.5;
    for (let i = 0; i < projected.length; i += 4) {
      // Ring
      ctx.beginPath();
      ctx.moveTo(projected[i].px, projected[i].py);
      ctx.lineTo(projected[i + 1].px, projected[i + 1].py);
      ctx.lineTo(projected[i + 2].px, projected[i + 2].py);
      ctx.lineTo(projected[i + 3].px, projected[i + 3].py);
      ctx.closePath();
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      // Longitudinal connectors
      if (i + 4 < projected.length) {
        for (let k = 0; k < 4; k++) {
          ctx.beginPath();
          ctx.moveTo(projected[i + k].px, projected[i + k].py);
          ctx.lineTo(projected[i + 4 + k].px, projected[i + 4 + k].py);

          // Color by stress
          const avgStress = (projected[i + k].stress + projected[i + 4 + k].stress) / 2;
          ctx.strokeStyle = avgStress > 0.6 ? '#f43f5e' : avgStress > 0.3 ? '#f59e0b' : '#3b82f6';
          ctx.stroke();
        }
      }
    }

    // Draw Vertices
    projected.forEach(v => {
      ctx.beginPath();
      ctx.arc(v.px, v.py, v.isBonePinned ? 6 : 4, 0, Math.PI * 2);

      if (v.isBonePinned) {
        ctx.fillStyle = '#ffffff';
      } else {
        // Stress gradient
        ctx.fillStyle = v.stress > 0.6 ? '#f43f5e' : v.stress > 0.3 ? '#f59e0b' : '#06b6d4';
      }

      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

  }, [muscle, rotationAngle]);

  return (
    <div className="flex flex-col h-full bg-[#060912] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0c121e] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-lg">
            <Flame size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Chaos Flesh Muscle & Soft-Body Deformation Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-400 text-[10px] font-bold border border-purple-500/40 font-mono">
                Unreal Engine 5 Chaos Flesh Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Tetrahedral FEM lattice simulation, biological muscle fiber contraction, Poisson volume conservation, and stress tensors.
            </p>
          </div>
        </div>

        {/* Live Contraction Status */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <Activity size={13} className="text-purple-400 animate-pulse" />
            Activation: {(muscle.activation * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1c2438] bg-[#060912] relative">
          
          <div className="p-3 border-b border-[#1c2438] bg-[#0c121e]/80 backdrop-blur flex items-center justify-between z-10">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-white font-bold">{profile.muscleName}</span>
              <span className="text-purple-400">• FEM Lattice ({profile.tetVertexCount} Verts)</span>
            </div>

            {/* Stress Legend */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Low Strain
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Moderate
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span> Max Tension
              </span>
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={440}
              className="max-w-full max-h-full"
            />
          </div>

          {/* Viewport Bottom Orbit Controls */}
          <div className="p-3 border-t border-[#1c2438] bg-[#0c121e] flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#94a3b8] font-mono">Orbit Angle:</span>
              <input
                type="range"
                min="0"
                max={Math.PI * 2}
                step="0.05"
                value={rotationAngle}
                onChange={(e) => setRotationAngle(parseFloat(e.target.value))}
                className="w-48 accent-purple-500 h-1.5 bg-[#1a2336] rounded-lg"
              />
            </div>
            <button
              onClick={() => chaosFleshEngine.setActivation(muscle.activation === 1 ? 0 : 1)}
              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono cursor-pointer"
            >
              {muscle.activation > 0 ? 'Relax Muscle' : 'Max Flex'}
            </button>
          </div>

        </div>

        {/* CONTROLS & MUSCLE PARAMETERS (4 cols) */}
        <div className="lg:col-span-4 bg-[#0a0e17] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={13} className="text-purple-400" /> Muscle Fiber Controls
            </span>
            <span className="text-[10px] font-mono text-purple-400">FEM Solver</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Activation Slider */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Muscle Contraction (Activation)</span>
                <span className="font-mono text-purple-400">{(muscle.activation * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={muscle.activation}
                onChange={(e) => chaosFleshEngine.setActivation(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-[#1a2336] rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-[#64748b] block">
                Shortens longitudinal fiber and triggers Poisson radial expansion
              </span>
            </div>

            {/* Biological Properties */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Biomechanical Tissue Parameters
              </span>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-[#131b2c] border border-[#1f2d47]">
                  <span className="text-[#94a3b8]">Young's Modulus (Stiffness):</span>
                  <span className="text-white font-bold">{profile.youngsModulusKPa} kPa</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#131b2c] border border-[#1f2d47]">
                  <span className="text-[#94a3b8]">Poisson's Ratio (Volume):</span>
                  <span className="text-emerald-400 font-bold">{profile.poissonRatio} (Incompressible)</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#131b2c] border border-[#1f2d47]">
                  <span className="text-[#94a3b8]">Max Contractile Force:</span>
                  <span className="text-rose-400 font-bold">{muscle.maxContractileForceNewton} N</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
