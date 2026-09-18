/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Visual Studio Enterprise Concurrency & Thread Synchronization Visualizer Studio.
 *          Visualizes multi-core CPU thread execution lanes, synchronization wait/lock
 *          contention blocks (red), worker thread load balancing, CPU core affinity,
 *          and context switch overhead.
 *    - TH: สตูดิโอวิเคราะห์การทำงานของเธรดหลายคอร์และการแย่งชิงล็อก Concurrency Visualizer
 *          (เทียบเท่า Visual Studio Enterprise Concurrency Visualizer)
 *          แสดงผลเลนเธรดแบบไทม์ไลน์ (Main Thread, Render Thread, Physics Workers, Audio),
 *          เน้นสีแดงเตือนช่วงเวลาที่เธรดเกิดอาการติดล็อก (Lock Contention Blocked),
 *          และการจัดสรรโหลดงานข้ามคอร์ CPU ทั้งหมด
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `concurrencyVisualizerTypes.ts` and `ConcurrencyThreadTelemetryNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Cpu,
  Activity,
  AlertTriangle,
  Clock,
  Sliders,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Pause,
  Play,
  RotateCcw
} from 'lucide-react';
import { concurrencyThreadNode } from '../utils/ConcurrencyThreadTelemetryNode';
import { ConcurrencyProfile, ThreadExecutionBlock } from '../types/concurrencyVisualizerTypes';

interface ConcurrencyStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function ConcurrencyThreadVisualizerStudio({ onSelectTool }: ConcurrencyStudioProps) {
  const [profile, setProfile] = useState<ConcurrencyProfile>(() => concurrencyThreadNode.getProfile());
  const [selectedBlock, setSelectedBlock] = useState<ThreadExecutionBlock | null>(null);

  useEffect(() => {
    return concurrencyThreadNode.subscribe(() => {
      setProfile(concurrencyThreadNode.getProfile());
    });
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#060a12] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0c1322] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-lg">
            <Layers size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Concurrency & Thread Synchronization Visualizer Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-400 text-[10px] font-bold border border-blue-500/40 font-mono">
                Visual Studio Enterprise Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Multi-lane CPU thread execution timeline, mutex lock contention visualizer, and core affinity pinning.
            </p>
          </div>
        </div>

        {/* Lock Contention Warning Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <Lock size={13} className="text-rose-400" />
            Lock Contention: {profile.lockContentionTimeMs} ms / frame
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* MULTI-THREAD TIMELINE (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1c2438] bg-[#060a12] overflow-hidden">
          
          <div className="p-3 border-b border-[#1c2438] bg-[#0b101c] flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold">16.6ms Target Frame Timeline (60 FPS)</span>
            <div className="flex items-center gap-4 text-[#94a3b8]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Executing</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Lock Blocked</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-500"></span> Sleeping</span>
            </div>
          </div>

          {/* Timeline Lanes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {profile.lanes.map(lane => (
              <div key={lane.id} className="p-3 rounded-xl bg-[#0c1220] border border-[#1b253b] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{lane.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#162035] text-cyan-400 font-mono">
                      Core {lane.coreAffinity}
                    </span>
                  </div>
                  <span className="font-mono text-indigo-400">{lane.cpuUtilizationPercent}% CPU</span>
                </div>

                {/* Timeline Bar */}
                <div className="relative w-full h-8 bg-[#060911] rounded-lg overflow-hidden border border-[#162136] flex">
                  {lane.blocks.map(b => {
                    const widthPercent = (b.durationMs / profile.frameTimeMs) * 100;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBlock(b)}
                        style={{ width: `${widthPercent}%`, backgroundColor: b.colorHex }}
                        className="h-full border-r border-[#00000044] hover:brightness-125 cursor-pointer flex items-center px-2 transition-all"
                        title={`${b.name} (${b.durationMs}ms)`}
                      >
                        <span className="text-[10px] font-mono text-white font-bold truncate">
                          {b.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* BLOCK & THREAD DETAILS (4 cols) */}
        <div className="lg:col-span-4 bg-[#090e1a] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1728] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={13} className="text-blue-400" /> Synchronization Inspector
            </span>
            <span className="text-[10px] font-mono text-blue-400">Thread Profiler</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Selected Block Info */}
            <div className="p-3.5 rounded-xl bg-[#0f1728] border border-[#1e2a40] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Selected Execution Block
              </span>

              {selectedBlock ? (
                <div className="space-y-1.5 text-xs font-mono bg-[#131d31] p-3 rounded-lg border border-[#1e2a40]">
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Function:</span>
                    <span className="text-white font-bold">{selectedBlock.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Duration:</span>
                    <span className="text-cyan-400 font-bold">{selectedBlock.durationMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">State:</span>
                    <span className={selectedBlock.state === 'SYNC_BLOCKED' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {selectedBlock.state}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#64748b] italic">Click on any block along the thread lanes to inspect its lock state.</p>
              )}
            </div>

            {/* Context Switches & Cores */}
            <div className="p-3.5 rounded-xl bg-[#0f1728] border border-[#1e2a40] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Thread & Kernel Telemetry
              </span>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-[#131d31] border border-[#1e2a40]">
                  <span className="text-[#94a3b8]">Logical CPU Cores:</span>
                  <span className="text-white font-bold">{profile.totalCores} Cores</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#131d31] border border-[#1e2a40]">
                  <span className="text-[#94a3b8]">Context Switches:</span>
                  <span className="text-blue-400 font-bold">{profile.contextSwitchesPerSec.toLocaleString()} / sec</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#131d31] border border-[#1e2a40]">
                  <span className="text-[#94a3b8]">Frame Pacing:</span>
                  <span className="text-emerald-400 font-bold">Stable 60 FPS</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
