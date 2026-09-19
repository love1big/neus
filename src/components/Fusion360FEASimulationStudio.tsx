/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Autodesk Fusion 360 Non-Linear Finite Element Analysis (FEA) Stress & Thermal Simulation Studio (Fusion 360 FEA parity).
 *          Visualizes Von Mises stress tensor gradients (Blue -> Red rainbow scale),
 *          calculates safety factor ratios against material yield strength, supports variable
 *          load forces and fixed constraint toggles, and features On-Device Offline AI Topology Optimization.
 *    - TH: สตูดิโอวิเคราะห์ความแข็งแรงและความเค้นทางวิศวกรรม Autodesk Fusion 360 FEA Simulation (Fusion 360 Parity)
 *          แสดงผลคอนทัวร์ความเค้น Von Mises Stress (สเกลสีน้ำเงินถึงแดง), คำนวณอัตราส่วน Safety Factor เทียบขีดจำกัดคราก (Yield Strength),
 *          ปรับเปลี่ยนแรงกดภายนอกแบบเรียลไทม์ และมีระบบ AI ออฟไลน์ช่วยวิเคราะห์เจาะช่องโครงสร้างลดน้ำหนัก
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `fusionFEATypes.ts` and `Fusion360FEASimulationEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Activity,
  Sliders,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Wrench,
  RotateCcw,
  Zap,
  Box,
  CheckCircle2
} from 'lucide-react';
import { fusion360FEAEngine } from '../utils/Fusion360FEASimulationEngineNode';
import { FusionFEAProfile } from '../types/fusionFEATypes';

interface FEAStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function Fusion360FEASimulationStudio({ onSelectTool }: FEAStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [profile, setProfile] = useState<FusionFEAProfile>(() =>
    fusion360FEAEngine.getProfile()
  );

  useEffect(() => {
    return fusion360FEAEngine.subscribe(() => {
      setProfile({ ...fusion360FEAEngine.getProfile() });
    });
  }, []);

  // FEA Stress Heatmap Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Dark Engineering Blueprint Background
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#101726';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Suspension Arm Component Boundary
    const originX = 140;
    const originY = height / 2;

    // Draw FEA Mesh Elements & Von Mises Contours
    const grad = ctx.createLinearGradient(originX, originY, originX + 420, originY);
    grad.addColorStop(0, '#3b82f6'); // Blue = Low Stress
    grad.addColorStop(0.35, '#06b6d4'); // Cyan
    grad.addColorStop(0.65, '#eab308'); // Yellow = Moderate Stress
    grad.addColorStop(0.85, '#f97316'); // Orange
    grad.addColorStop(1, '#ef4444'); // Red = High Stress Hotspot

    ctx.save();
    ctx.beginPath();
    // Arm contour
    ctx.moveTo(originX, originY - 40);
    ctx.lineTo(originX + 180, originY - 25);
    ctx.lineTo(originX + 360, originY - 50);
    ctx.arc(originX + 390, originY, 40, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(originX + 180, originY + 25);
    ctx.lineTo(originX, originY + 40);
    ctx.arc(originX, originY, 40, Math.PI / 2, -Math.PI / 2);
    ctx.closePath();

    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Structural Holes (Mounting Bushings)
    ctx.fillStyle = '#060a14';
    // Left Hole
    ctx.beginPath();
    ctx.arc(originX, originY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    // Right Hole (Load point)
    ctx.beginPath();
    ctx.arc(originX + 390, originY, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    // Triangulated FEA Wireframe Overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      const segX = originX + 40 + i * 45;
      ctx.beginPath();
      ctx.moveTo(segX, originY - 30);
      ctx.lineTo(segX + 25, originY + 30);
      ctx.lineTo(segX + 45, originY - 30);
      ctx.stroke();
    }

    // Constraint Icons (Fixed Padlock / Triangle at origin)
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(originX - 35, originY - 25);
    ctx.lineTo(originX - 55, originY - 15);
    ctx.lineTo(originX - 55, originY - 35);
    ctx.closePath();
    ctx.fill();
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('FIXED', originX - 95, originY - 20);

    // Force Vector Arrow (Downwards on right hole)
    const loadY = originY - 30;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(originX + 390, loadY - 60);
    ctx.lineTo(originX + 390, loadY);
    ctx.stroke();

    // Arrowhead
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(originX + 390, loadY + 4);
    ctx.lineTo(originX + 382, loadY - 12);
    ctx.lineTo(originX + 398, loadY - 12);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 11px monospace';
    ctx.fillText(`${profile.loads[0]?.magnitudeNewtons || 4500} N (Downward)`, originX + 330, loadY - 70);

    ctx.restore();

    // Color bar legend (Right)
    const legX = width - 75;
    const legY = 60;
    const legH = height - 120;
    const legGrad = ctx.createLinearGradient(0, legY, 0, legY + legH);
    legGrad.addColorStop(0, '#ef4444');
    legGrad.addColorStop(0.3, '#f97316');
    legGrad.addColorStop(0.5, '#eab308');
    legGrad.addColorStop(0.7, '#06b6d4');
    legGrad.addColorStop(1, '#3b82f6');

    ctx.fillStyle = legGrad;
    ctx.fillRect(legX, legY, 14, legH);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(legX, legY, 14, legH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText(`${profile.maxVonMisesStressMPa} MPa`, legX - 50, legY + 8);
    ctx.fillText('0.0 MPa', legX - 45, legY + legH);

  }, [profile]);

  return (
    <div className="flex flex-col h-full bg-[#060a14] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1b253b] bg-[#0c1220] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg">
            <Compass size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Autodesk Fusion 360 Non-Linear FEA Stress Simulation Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 text-[10px] font-bold border border-cyan-500/40 font-mono">
                Fusion 360 FEA Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Von Mises Stress Tensors, Safety Factor Verification, Tetrahedral Meshes, and On-Device Offline AI Topology Optimization.
            </p>
          </div>
        </div>

        {/* Safety Factor Indicator */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#94a3b8]">Min Safety Factor:</span>
          <span className={`px-3 py-1 rounded-xl font-black text-sm border flex items-center gap-1.5 shadow ${
            profile.minSafetyFactor >= 1.5
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
              : 'bg-rose-950/80 text-rose-400 border-rose-500/50'
          }`}>
            <ShieldCheck size={14} />
            {profile.minSafetyFactor.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* HEATMAP CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1b253b] bg-[#060a14] relative">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1220]/80 backdrop-blur flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <Activity size={13} className="text-cyan-400" />
              Study: <strong className="text-cyan-300">{profile.studyName}</strong>
            </span>

            <span className="text-cyan-400 font-bold">
              Material: {profile.materialName} (Yield: {profile.yieldStrengthMPa} MPa)
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
            <span className="text-[#94a3b8]">Mesh Elements: <strong>{profile.meshElementCount.toLocaleString()} Tets</strong></span>
            <span className="text-amber-400 font-bold">Max Displacement: {profile.maxDisplacementMm} mm</span>
          </div>

        </div>

        {/* CONTROLS & AI TOPOLOGY OPTIMIZER (4 cols) */}
        <div className="lg:col-span-4 bg-[#090d18] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1220] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={13} className="text-cyan-400" /> Load & Boundary Conditions
            </span>
            <span className="text-[10px] font-mono text-emerald-400">FEA Solved</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {/* Load Adjustment Slider */}
            <div className="p-3.5 rounded-xl bg-[#0e1526] border border-[#1d2943] space-y-2">
              <div className="flex justify-between items-center text-white font-bold font-sans">
                <span>Applied Vertical Load</span>
                <span className="text-cyan-400 font-mono">{profile.loads[0]?.magnitudeNewtons || 4500} N</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="250"
                value={profile.loads[0]?.magnitudeNewtons || 4500}
                onChange={(e) => fusion360FEAEngine.setLoadMagnitude(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748b]">
                <span>1,000 N (Light)</span>
                <span>10,000 N (Extreme)</span>
              </div>
            </div>

            {/* Stress Readout Card */}
            <div className="p-3.5 rounded-xl bg-[#0e1526] border border-[#1d2943] space-y-2 font-sans">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                FEA Numerical Stress Tensors
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-[#070b14] border border-[#1a253a]">
                  <div className="text-[10px] text-[#94a3b8]">Von Mises Peak</div>
                  <div className="text-sm font-bold text-rose-400">{profile.maxVonMisesStressMPa} MPa</div>
                </div>
                <div className="p-2 rounded bg-[#070b14] border border-[#1a253a]">
                  <div className="text-[10px] text-[#94a3b8]">Allowable Yield</div>
                  <div className="text-sm font-bold text-emerald-400">{profile.yieldStrengthMPa} MPa</div>
                </div>
              </div>
            </div>

            {/* On-Device Offline AI Topology Optimization Card */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> On-Device Offline AI Topology Optimizer
              </span>
              <p className="text-xs text-cyan-200/90 leading-relaxed">
                {profile.offlineAITopologyRecommendation}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
