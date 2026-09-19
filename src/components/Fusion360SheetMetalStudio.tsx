/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Autodesk Fusion 360 Sheet Metal Flange Bending, K-Factor & Flat Pattern Unfold Studio.
 *          Visualizes 3D Folded Sheet Metal and 2D Unfolded Flat Pattern with bend lines,
 *          calculates K-factor and press brake tonnage, and provides On-Device Offline AI
 *          Springback compensation parameters (Zero-Token Guarantee).
 *    - TH: สตูดิโอออกแบบแผ่นโลหะขึ้นรูป Autodesk Fusion 360 Sheet Metal Studio
 *          แสดงผลแผ่นโลหะแบบ 3 มิติ (พับขึ้นรูป) สลับกับแผ่นคลี่เรียบ 2D Flat Pattern พร้อมเส้นแนวพับ,
 *          คำนวณค่า K-Factor และแรงกดเครื่องพับ (Tonnage), พร้อมระบบ AI ออฟไลน์ช่วยชดเชยการดีดกลับของโลหะ
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `fusionSheetMetalTypes.ts` and `Fusion360SheetMetalEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Layers,
  Compass,
  Scissors,
  Wrench,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { fusion360SheetMetalEngine } from '../utils/Fusion360SheetMetalEngineNode';
import { FusionSheetMetalProfile } from '../types/fusionSheetMetalTypes';

interface SheetMetalStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function Fusion360SheetMetalStudio({ onSelectTool }: SheetMetalStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [profile, setProfile] = useState<FusionSheetMetalProfile>(() =>
    fusion360SheetMetalEngine.getProfile()
  );

  useEffect(() => {
    return fusion360SheetMetalEngine.subscribe(() => {
      setProfile({ ...fusion360SheetMetalEngine.getProfile() });
    });
  }, []);

  // Sheet Metal Canvas Renderer (3D Folded vs 2D Flat Pattern)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Dark CAD Blueprint background
    ctx.fillStyle = '#070c17';
    ctx.fillRect(0, 0, width, height);

    // Subtle technical grid
    ctx.strokeStyle = '#121b2f';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    const centerX = width / 2;
    const centerY = height / 2;

    if (profile.isUnfoldedFlatPattern) {
      // 2D UNFOLDED FLAT PATTERN RENDER
      const sheetW = 340;
      const sheetH = 220;
      const left = centerX - sheetW / 2;
      const top = centerY - sheetH / 2;

      // Outer Sheet Contour
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(left, top, sheetW, sheetH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(left, top, sheetW, sheetH);

      // Corner Relief Notches (Round reliefs)
      ctx.fillStyle = '#070c17';
      // Top corners
      ctx.beginPath(); ctx.arc(left, top, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(left + sheetW, top, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // Bottom corners
      ctx.beginPath(); ctx.arc(left, top + sheetH, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(left + sheetW, top + sheetH, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Dotted Bend Lines
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);

      // Left Flange Bend Line
      ctx.beginPath();
      ctx.moveTo(left + 65, top);
      ctx.lineTo(left + 65, top + sheetH);
      ctx.stroke();

      // Right Flange Bend Line
      ctx.beginPath();
      ctx.moveTo(left + sheetW - 65, top);
      ctx.lineTo(left + sheetW - 65, top + sheetH);
      ctx.stroke();

      ctx.setLineDash([]); // Reset dash

      // Annotation text
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('BEND UP 90° (R2.0)', left + 10, centerY);
      ctx.fillText('BEND UP 90° (R2.0)', left + sheetW - 120, centerY);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText(`FLAT PATTERN BOUNDS: ${profile.flatPatternLengthMm}mm × ${profile.flatPatternWidthMm}mm`, left, top - 15);

    } else {
      // 3D FOLDED COMPONENT RENDER (Isometric Projection)
      ctx.save();
      ctx.translate(centerX, centerY);

      // Base plate
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(-120, 30);
      ctx.lineTo(60, 90);
      ctx.lineTo(160, 40);
      ctx.lineTo(-20, -20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Left Upward Flange
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(-120, 30);
      ctx.lineTo(-120, -70);
      ctx.lineTo(-20, -120);
      ctx.lineTo(-20, -20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // Right Upward Flange
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(60, 90);
      ctx.lineTo(60, -10);
      ctx.lineTo(160, -60);
      ctx.lineTo(160, 40);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      ctx.restore();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText('3D FORMED SHEET METAL PART (BENT AT 90°)', centerX - 140, 50);
    }

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
                Autodesk Fusion 360 Sheet Metal Flange Bending & Flat Pattern Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 text-[10px] font-bold border border-cyan-500/40 font-mono">
                Fusion 360 Sheet Metal Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              K-Factor Neutral Axis Shift, Bend Allowance, Corner Reliefs, and On-Device Offline AI Springback Tuner.
            </p>
          </div>
        </div>

        {/* Unfold Flat Pattern Toggle Button */}
        <button
          onClick={() => fusion360SheetMetalEngine.toggleFlatPattern()}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition cursor-pointer"
        >
          {profile.isUnfoldedFlatPattern ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          {profile.isUnfoldedFlatPattern ? 'Fold to 3D Part' : 'Unfold 2D Flat Pattern'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* CAD CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1b253b] bg-[#060a14] relative">
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1220]/80 backdrop-blur flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold">
              Part: <strong className="text-cyan-300">{profile.partName}</strong>
            </span>
            <span className="text-cyan-400 font-bold">
              Material: {profile.materialName} ({profile.thicknessMm}mm Thickness)
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
            <span className="text-[#94a3b8]">K-Factor: <strong>{profile.kFactor}</strong></span>
            <span className="text-amber-400 font-bold">Press Brake Tonnage: {profile.pressBrakeTonnageRequired} Tons</span>
          </div>
        </div>

        {/* METRICS & ON-DEVICE AI SPRINGBACK (4 cols) */}
        <div className="lg:col-span-4 bg-[#090d18] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1220] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Wrench size={13} className="text-cyan-400" /> Bending Parameters
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Sheet Metal Rule</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {/* Sheet Thickness Slider */}
            <div className="p-3.5 rounded-xl bg-[#0e1526] border border-[#1d2943] space-y-2">
              <div className="flex justify-between items-center text-white font-bold font-sans">
                <span>Material Gauge Thickness</span>
                <span className="text-cyan-400 font-mono">{profile.thicknessMm} mm</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.5"
                value={profile.thicknessMm}
                onChange={(e) => fusion360SheetMetalEngine.setThickness(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748b]">
                <span>1.0 mm (Thin Gauge)</span>
                <span>6.0 mm (Heavy Plate)</span>
              </div>
            </div>

            {/* Bend Deductions List */}
            <div className="p-3.5 rounded-xl bg-[#0e1526] border border-[#1d2943] space-y-2 font-sans">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Calculated Bend Allowances
              </span>
              <div className="space-y-2 font-mono text-xs">
                {profile.bends.map(b => (
                  <div key={b.bendId} className="p-2 rounded bg-[#070b14] border border-[#1a253a] flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{b.bendId}</div>
                      <div className="text-[10px] text-[#94a3b8]">{b.angleDegrees}° Bend • Inner R{b.innerRadiusMm}mm</div>
                    </div>
                    <span className="text-cyan-300 font-bold">BA: {b.bendAllowanceMm}mm</span>
                  </div>
                ))}
              </div>
            </div>

            {/* On-Device Offline AI Springback Card */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> On-Device Offline AI Springback Tuner
              </span>
              <p className="text-xs text-cyan-200/90 leading-relaxed">
                {profile.offlineAISpringbackRecommendation}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
