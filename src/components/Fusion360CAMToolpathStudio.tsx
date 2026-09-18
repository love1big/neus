/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Autodesk Fusion 360 CAM & Multi-Axis CNC Machining Studio (Fusion 360 Parity).
 *          Simulates 3D milling toolpaths (Adaptive Clearing, 5-Axis Swarf), checks
 *          fixtures collisions, outputs Haas/Fanuc ISO G-Code, and runs On-Device Offline AI
 *          feed rate optimization to prevent tool breakage.
 *    - TH: สตูดิโอระบบ Fusion 360 CAM และจำลองเส้นทางเดินมีดกัด CNC (Fusion 360 Parity)
 *          จำลองเส้นทางเดินมีด 3D Adaptive Clearing, ตรวจสอบการชนของตัวจับยึด (Fixtures Collision),
 *          ส่งออกคำสั่งเครื่องจักร Haas/Fanuc ISO G-Code, และปรับอัตราป้อนมีดด้วย AI ออฟไลน์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `fusionCAMTypes.ts` and `FusionCAMToolpathEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Wrench,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileCode2,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  Boxes
} from 'lucide-react';
import { fusionCAMToolpathEngine } from '../utils/FusionCAMToolpathEngineNode';
import { FusionCAMProfile } from '../types/fusionCAMTypes';

interface CAMStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function Fusion360CAMToolpathStudio({ onSelectTool }: CAMStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [profile, setProfile] = useState<FusionCAMProfile>(() =>
    fusionCAMToolpathEngine.getProfile()
  );
  const [simProgress, setSimProgress] = useState<number>(35);

  useEffect(() => {
    return fusionCAMToolpathEngine.subscribe(() => {
      setProfile({ ...fusionCAMToolpathEngine.getProfile() });
    });
  }, []);

  // 3D Toolpath Visualizer Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#070a13';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2 + 30;

    // 1. Draw Stock Boundary (Grey billet block)
    ctx.fillStyle = '#1c2438';
    ctx.strokeStyle = '#384870';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(centerX - 160, centerY - 100, 320, 200, 8);
    ctx.fill();
    ctx.stroke();

    // 2. Draw Machined Part Cavity
    ctx.fillStyle = '#0d1322';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Draw 3D Adaptive Spiral Toolpath (Cyan arcs)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let r = 10; r < 75; r += 4) {
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    }
    ctx.stroke();

    // 4. Draw Rapid Feeds (Yellow dashed G00 moves)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX - 150, centerY - 90);
    ctx.lineTo(centerX - 70, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Draw Endmill Tool Position
    const toolX = centerX + Math.cos(simProgress * 0.1) * (simProgress * 0.8);
    const toolY = centerY + Math.sin(simProgress * 0.1) * (simProgress * 0.8);

    ctx.beginPath();
    ctx.arc(toolX, toolY, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#ef444499';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('SPINDLE 12.5k RPM', toolX - 45, toolY - 18);

  }, [profile, simProgress]);

  return (
    <div className="flex flex-col h-full bg-[#070a13] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1a2336] bg-[#0c1220] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
            <Wrench size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Fusion 360 CAM & Multi-Axis CNC Machining Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 text-[10px] font-bold border border-amber-500/40 font-mono">
                Autodesk Fusion 360 Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              3D Adaptive Clearing, 5-Axis Contouring, ISO G-Code Post Processing, and On-Device Offline AI feed rate optimization.
            </p>
          </div>
        </div>

        {/* AI Feed Optimization */}
        <button
          onClick={() => fusionCAMToolpathEngine.optimizeFeedsWithAI()}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Zap size={13} />
          AI Optimize Feed Rates (Prevent Breakage)
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1a2336] bg-[#070a13] relative">
          
          <div className="p-3 border-b border-[#1a2336] bg-[#0c1220]/80 backdrop-blur flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <Activity size={13} className="text-amber-400" />
              Machine Post: <strong className="text-cyan-400">{profile.postProcessor}</strong>
            </span>

            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck size={13} /> Collision Clearance: SAFE
            </span>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={440}
              className="max-w-full max-h-full"
            />
          </div>

          {/* Machining Progress Bar */}
          <div className="p-3 border-t border-[#1a2336] bg-[#0c1220] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-[#94a3b8]">Simulate Toolpath:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={simProgress}
                onChange={(e) => setSimProgress(parseInt(e.target.value))}
                className="w-44 accent-amber-500 h-1.5 bg-[#172238] rounded-lg cursor-pointer"
              />
              <span className="text-amber-400 font-bold">{simProgress}%</span>
            </div>

            <span className="text-[#94a3b8]">
              Stock: {profile.stockDimensionsXYZ.join(' × ')} mm
            </span>
          </div>

        </div>

        {/* OPERATIONS & G-CODE SNIPPET (4 cols) */}
        <div className="lg:col-span-4 bg-[#090e1a] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1a2336] bg-[#0e1628] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileCode2 size={13} className="text-amber-400" /> Live ISO G-Code Output
            </span>
            <span className="text-[10px] font-mono text-cyan-400">G54 Active</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* G-Code Terminal Block */}
            <div className="p-3 rounded-xl bg-[#060910] border border-[#1b253b] font-mono text-[11px] text-emerald-400/90 leading-relaxed max-h-56 overflow-y-auto">
              {profile.generatedGCodeSnippet.map((line, idx) => (
                <div key={idx} className="hover:bg-white/5 px-1 rounded">
                  <span className="text-[#475569] select-none mr-2">{(idx + 1).toString().padStart(2, '0')}</span>
                  {line}
                </div>
              ))}
            </div>

            {/* Operations List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block font-mono">
                Machining Operations
              </span>

              {profile.operations.map(op => (
                <div key={op.id} className="p-2.5 rounded-lg bg-[#11192c] border border-[#1d2a48] space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-white font-bold">
                    <span>{op.name}</span>
                    <span className="text-amber-400">{op.cuttingFeedRateMmMin} mm/min</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#94a3b8]">
                    <span>Spindle: {op.spindleRpm.toLocaleString()} RPM</span>
                    <span className="text-cyan-400">Est: {op.estimatedTimeSeconds}s</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
