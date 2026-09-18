/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: AAA Motion Warping & Dynamic Parkour Vaulting Studio (Unreal Engine 5
 *          Motion Warping parity). Visualizes sync point alignment, obstacle raycast
 *          clearance, root motion scale factors, and interactive timeline scrubbing
 *          with dynamic obstacle height/depth adjustments.
 *    - TH: สตูดิโอระบบ Motion Warping และการคำนวณการกระโดดข้ามสิ่งกีดขวางแบบไดนามิก (Parkour Vaulting)
 *          ระดับ AAA (เทียบเท่า UE5 Motion Warping)
 *          แสดงผลจุดเชื่อมโยง (Sync Points), ปรับความสูงและความกว้างของสิ่งกีดขวาง (Obstacle Profile),
 *          และทดสอบการขยับของตัวละครผ่าน Timeline ข้ามสิ่งกีดขวางบน Canvas แบบเรียลไทม์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `motionWarpingTypes.ts` and `MotionWarpingExecutionNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Sparkles,
  Target,
  Maximize2,
  TrendingUp,
  Compass,
  Footprints,
  ShieldAlert
} from 'lucide-react';
import { motionWarpingEngine } from '../utils/MotionWarpingExecutionNode';
import { WarpStyle, MotionWarpingState } from '../types/motionWarpingTypes';

interface MotionWarpingStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function MotionWarpingParkourVaultStudio({ onSelectTool }: MotionWarpingStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [state, setState] = useState<MotionWarpingState>(() => motionWarpingEngine.getState());
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    return motionWarpingEngine.subscribe(() => {
      setState(motionWarpingEngine.getState());
    });
  }, []);

  // Animation Loop
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const loop = () => {
        const nextProgress = (motionWarpingEngine.getState().playbackProgress + 0.015) % 1.0;
        motionWarpingEngine.setProgress(nextProgress);
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Render 2.5D Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Dark grid background
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, width, height);

    const groundY = height - 80;
    const scale = 110; // pixels per meter
    const startX = 60;

    // Ground line
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Draw Obstacle (Box)
    const obs = state.obstacle;
    const obsPixelX = startX + obs.distanceMeters * scale;
    const obsPixelY = groundY - obs.heightMeters * scale;
    const obsPixelW = obs.depthMeters * scale;
    const obsPixelH = obs.heightMeters * scale;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(obsPixelX, obsPixelY, obsPixelW, obsPixelH);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(obsPixelX, obsPixelY, obsPixelW, obsPixelH);

    ctx.fillStyle = '#06b6d4';
    ctx.font = '10px monospace';
    ctx.fillText(`${obs.name} (H:${obs.heightMeters}m, W:${obs.depthMeters}m)`, obsPixelX, obsPixelY - 8);

    // Draw Sync Points
    state.syncPoints.forEach((sync, idx) => {
      const [sx, sy] = sync.targetPosition;
      const px = startX + sx * scale;
      const py = groundY - sy * scale;

      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? '#f59e0b' : idx === 1 ? '#10b981' : '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '9px monospace';
      ctx.fillText(sync.name, px - 20, py - 10);
    });

    // Draw Character Body
    const [cx, cy] = state.characterPosition;
    const charPx = startX + cx * scale;
    const charPy = groundY - cy * scale;

    // Character Capsule
    ctx.beginPath();
    ctx.arc(charPx, charPy - 24, 10, 0, Math.PI * 2); // Head
    ctx.fillStyle = '#f43f5e';
    ctx.fill();

    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(charPx, charPy - 14);
    ctx.lineTo(charPx, charPy); // Torso / legs
    ctx.stroke();

  }, [state]);

  const handleObstacleChange = (height: number, depth: number, dist: number) => {
    motionWarpingEngine.setObstacleDimensions(height, depth, dist);
  };

  return (
    <div className="flex flex-col h-full bg-[#070b14] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0c121e] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-600/30 to-orange-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-lg">
            <Footprints size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Motion Warping & Parkour Vault Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-400 text-[10px] font-bold border border-rose-500/40 font-mono">
                Unreal Engine 5 Motion Warping Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Dynamic sync points, root motion trajectory scale warping, and obstacle raycast height/depth adaptation.
            </p>
          </div>
        </div>

        {/* Warp Style Selector */}
        <div className="flex items-center gap-1.5 bg-[#121927] p-1 rounded-xl border border-[#1e2a3f]">
          {(['VAULT_OVER', 'MANTLE_HIGH', 'STEP_UP', 'SLIDE_UNDER'] as WarpStyle[]).map((style) => (
            <button
              key={style}
              onClick={() => motionWarpingEngine.setWarpStyle(style)}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                state.style === style
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1a2438]'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1c2438] bg-[#070b14] relative">
          
          <div className="p-3 border-b border-[#1c2438] bg-[#0c121e]/80 backdrop-blur flex items-center justify-between z-10">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-white font-bold">Traversal Trajectory Viewport</span>
              <span className="text-rose-400">• Translation Scale: {state.translationWarpMultiplier}x</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                {isPlaying ? 'Pause' : 'Play Loop'}
              </button>
              <button
                onClick={() => motionWarpingEngine.setProgress(0)}
                className="p-1 rounded-lg bg-[#141b2b] hover:bg-[#1c263d] text-[#94a3b8] cursor-pointer"
              >
                <RotateCcw size={14} />
              </button>
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

          {/* Timeline Scrubber */}
          <div className="p-3 border-t border-[#1c2438] bg-[#0c121e] flex items-center gap-4 text-xs">
            <span className="text-[#94a3b8] font-mono">Normalized Frame:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.playbackProgress}
              onChange={(e) => {
                setIsPlaying(false);
                motionWarpingEngine.setProgress(parseFloat(e.target.value));
              }}
              className="flex-1 accent-rose-500 h-1.5 bg-[#1a2336] rounded-lg"
            />
            <span className="font-mono text-rose-400">{(state.playbackProgress * 100).toFixed(0)}%</span>
          </div>

        </div>

        {/* CONTROLS & SYNC POINTS INSPECTOR (4 cols) */}
        <div className="lg:col-span-4 bg-[#0a0e17] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={13} className="text-rose-400" /> Obstacle & Sync Setup
            </span>
            <span className="text-[10px] font-mono text-rose-400">Raycast Target</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Obstacle Dimensions */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Obstacle Geometry Raycast
              </span>

              {/* Height */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94a3b8]">Obstacle Height:</span>
                  <span className="font-mono text-rose-400">{state.obstacle.heightMeters.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={state.obstacle.heightMeters}
                  onChange={(e) => handleObstacleChange(parseFloat(e.target.value), state.obstacle.depthMeters, state.obstacle.distanceMeters)}
                  className="w-full accent-rose-500 h-1.5 bg-[#1a2336] rounded-lg"
                />
              </div>

              {/* Depth */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94a3b8]">Obstacle Depth:</span>
                  <span className="font-mono text-rose-400">{state.obstacle.depthMeters.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.8"
                  step="0.1"
                  value={state.obstacle.depthMeters}
                  onChange={(e) => handleObstacleChange(state.obstacle.heightMeters, parseFloat(e.target.value), state.obstacle.distanceMeters)}
                  className="w-full accent-rose-500 h-1.5 bg-[#1a2336] rounded-lg"
                />
              </div>

              {/* Distance */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94a3b8]">Approach Distance:</span>
                  <span className="font-mono text-rose-400">{state.obstacle.distanceMeters.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.5"
                  step="0.1"
                  value={state.obstacle.distanceMeters}
                  onChange={(e) => handleObstacleChange(state.obstacle.heightMeters, state.obstacle.depthMeters, parseFloat(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-[#1a2336] rounded-lg"
                />
              </div>
            </div>

            {/* Sync Points List */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Calculated Warp Sync Points ({state.syncPoints.length})
              </span>

              {state.syncPoints.map(sp => (
                <div key={sp.id} className="p-2 rounded bg-[#131b2c] border border-[#1f2d47] text-xs font-mono space-y-1">
                  <div className="flex justify-between text-white font-bold">
                    <span>{sp.name}</span>
                    <span className="text-rose-400">@ {(sp.timeNormalized * 100).toFixed(0)}%</span>
                  </div>
                  <div className="text-[10px] text-[#94a3b8]">
                    Pos: [{sp.targetPosition.map(v => v.toFixed(2)).join(', ')}]
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
