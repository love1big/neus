/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: AAA Mass Entity ECS & Crowd Processor Studio (Unreal Engine 5 Mass Framework
 *          & Unity DOTS ECS Crowd parity). Simulates thousands of data-oriented mass
 *          entities in real-time, inspects Mass Processors, analyzes spatial hash
 *          grid partition efficiency, and provides interactive crowd density tuning.
 *    - TH: สตูดิโอระบบประมวลผลฝูงชนมวลรวม Mass Entity ECS & Crowd Processor ระดับ AAA
 *          (เทียบเท่า Unreal Engine 5 Mass Framework และ Unity DOTS ECS)
 *          จำลองการเคลื่อนที่ของเอเจนต์นับพันตัวพร้อมกันแบบเรียลไทม์บน Viewport Canvas,
 *          ตรวจสอบการทำงานของ Mass Processors, ดูการแบ่งกริด Spatial Hash,
 *          และปรับแต่งจำนวนประชากรฝูงชนได้ตามต้องการ
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `massEntityTypes.ts` and `MassEntityEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Layers,
  Cpu,
  Zap,
  Sliders,
  Sparkles,
  Activity,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Gauge
} from 'lucide-react';
import { massEntityEngine } from '../utils/MassEntityEngineNode';
import { MassSimulationStats, MassProcessorConfig } from '../types/massEntityTypes';

interface MassStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function MassEntityCrowdSimulationStudio({ onSelectTool }: MassStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stats, setStats] = useState<MassSimulationStats>(() => massEntityEngine.getStats());
  const [processors] = useState<MassProcessorConfig[]>(() => massEntityEngine.getProcessors());
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [entityCount, setEntityCount] = useState<number>(1200);

  useEffect(() => {
    return massEntityEngine.subscribe(() => {
      setStats(massEntityEngine.getStats());
    });
  }, []);

  // Animation Simulation Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (isRunning) {
        massEntityEngine.stepSimulation();
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Dark background with circular boundary
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 220;

      // Draw Boundary ring
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Spatial Hash Grid lines
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      const gridStep = 40;
      for (let x = centerX - radius; x <= centerX + radius; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, centerY - radius);
        ctx.lineTo(x, centerY + radius);
        ctx.stroke();
      }
      for (let y = centerY - radius; y <= centerY + radius; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(centerX - radius, y);
        ctx.lineTo(centerX + radius, y);
        ctx.stroke();
      }

      // Draw Mass Entities
      const entities = massEntityEngine.getEntities();
      for (let i = 0; i < entities.length; i++) {
        const ent = entities[i];
        const px = centerX + (ent.posX / 300) * radius;
        const py = centerY + (ent.posY / 300) * radius;

        ctx.fillStyle = ent.colorHex;
        ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isRunning]);

  const handleRespawn = (newCount: number) => {
    setEntityCount(newCount);
    massEntityEngine.spawnCrowd(newCount);
  };

  return (
    <div className="flex flex-col h-full bg-[#050811] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0c1220] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-600/30 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg">
            <Users size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Mass Entity ECS & Crowd Processor Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 text-[10px] font-bold border border-cyan-500/40 font-mono">
                Unreal Engine 5 Mass Framework Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Data-oriented Mass Entity fragments, Spatial Hash Grid O(1) queries, and parallel avoidance processors.
            </p>
          </div>
        </div>

        {/* Live Simulation Status */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <Activity size={13} className="text-cyan-400 animate-pulse" />
            {stats.totalEntities.toLocaleString()} Mass Entities Active
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1c2438] bg-[#050811] relative">
          
          <div className="p-3 border-b border-[#1c2438] bg-[#0c1220]/80 backdrop-blur flex items-center justify-between z-10">
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-white font-bold">Mass Spatial Viewport</span>
              <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Wandering</span>
              <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Fleeing</span>
              <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-400"></span> Zombie Chase</span>
            </div>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {isRunning ? <Pause size={13} /> : <Play size={13} />}
              {isRunning ? 'Pause Sim' : 'Resume Sim'}
            </button>
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

          {/* Footer Controls */}
          <div className="p-3 border-t border-[#1c2438] bg-[#0c1220] flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#94a3b8] font-mono">Crowd Entity Count:</span>
              <input
                type="range"
                min="300"
                max="3000"
                step="100"
                value={entityCount}
                onChange={(e) => handleRespawn(parseInt(e.target.value))}
                className="w-48 accent-cyan-500 h-1.5 bg-[#1a2336] rounded-lg cursor-pointer"
              />
              <span className="font-mono text-cyan-400">{entityCount.toLocaleString()} entities</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              Processors Frame Time: {stats.simulationFrameTimeMs.toFixed(2)} ms
            </span>
          </div>

        </div>

        {/* MASS PROCESSORS & TELEMETRY (4 cols) */}
        <div className="lg:col-span-4 bg-[#080d18] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1c2438] bg-[#0e1628] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={13} className="text-cyan-400" /> Mass Processors Pipeline
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Parallel Jobs</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Processors List */}
            <div className="p-3.5 rounded-xl bg-[#0e1628] border border-[#1d2b48] space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Executing Parallel Processors
              </span>

              {processors.map(proc => (
                <div key={proc.id} className="p-2.5 rounded-lg bg-[#121c33] border border-[#213254] space-y-1">
                  <div className="flex justify-between text-xs font-bold text-white">
                    <span className="truncate">{proc.name}</span>
                    <span className="text-cyan-400 font-mono">{proc.executionTimeMs} ms</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#94a3b8] font-mono">
                    <span>Parallel Job Batches: {proc.parallelJobBatches}</span>
                    <span className="text-emerald-400">ACTIVE</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Spatial Hash Telemetry */}
            <div className="p-3.5 rounded-xl bg-[#0e1628] border border-[#1d2b48] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Spatial Hash Grid Telemetry
              </span>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-[#121c33] border border-[#213254]">
                  <span className="text-[#94a3b8]">Grid Buckets Allocated:</span>
                  <span className="text-white font-bold">{stats.spatialHashBucketsUsed} cells</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#121c33] border border-[#213254]">
                  <span className="text-[#94a3b8]">Average Crowd Density:</span>
                  <span className="text-cyan-400 font-bold">{stats.crowdDensityAverage} agents/m²</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#121c33] border border-[#213254]">
                  <span className="text-[#94a3b8]">Neighbor Query Speed:</span>
                  <span className="text-emerald-400 font-bold">O(1) Constant Time</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
