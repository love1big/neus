/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Visual Studio Hot Reload & Memory Snapshot Leak Profiler Studio
 *          (Visual Studio Diagnostic Tools parity).
 *          Live GC generation breakdown (Gen 0/1/2/LOH), memory retention graph,
 *          Hot Reload (Edit & Continue) IL patch telemetry, and On-Device Offline AI
 *          memory leak root cause detection.
 *    - TH: สตูดิโอตรวจวัดหน่วยความจำและ Hot Reload ระดับ Visual Studio Enterprise
 *          (Visual Studio Diagnostics Tools Parity)
 *          ตรวจสอบการจัดสรรหน่วยความจำแบ่งตาม Generation ของ GC, รายการวัตถุที่สงสัยว่า
 *          เกิดการรั่วไหล (Memory Leak Suspects), บันทึกการทำ Hot Reload (EnC),
 *          และขับเคลื่อนด้วย AI ออฟไลน์ในการค้นหาจุดบกพร่องของ Event Handlers
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `vsHotReloadMemoryTypes.ts` and `VSHotReloadMemoryProfilerNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Zap,
  Activity,
  Trash2,
  Bug,
  Cpu,
  Layers,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCode2
} from 'lucide-react';
import { vsHotReloadMemoryProfiler } from '../utils/VSHotReloadMemoryProfilerNode';
import { VSMemoryDiagnosticsProfile } from '../types/vsHotReloadMemoryTypes';

interface VSStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function VSHotReloadMemoryLeakProfilerStudio({ onSelectTool }: VSStudioProps) {
  const [profile, setProfile] = useState<VSMemoryDiagnosticsProfile>(() =>
    vsHotReloadMemoryProfiler.getProfile()
  );

  useEffect(() => {
    return vsHotReloadMemoryProfiler.subscribe(() => {
      setProfile({ ...vsHotReloadMemoryProfiler.getProfile() });
    });
  }, []);

  const totalMb = (profile.totalHeapAllocatedBytes / (1024 * 1024)).toFixed(1);

  return (
    <div className="flex flex-col h-full bg-[#080b12] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1a2336] bg-[#0d1322] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shrink-0 shadow-lg">
            <Flame size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Visual Studio Hot Reload & Memory Snapshot Leak Profiler
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-violet-950/80 text-violet-400 text-[10px] font-bold border border-violet-500/40 font-mono">
                Visual Studio Enterprise Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Edit-and-Continue Delta IL Hot Reload, GC Generations (Gen 0/1/2/LOH), and On-Device Offline AI Memory Leak Detection.
            </p>
          </div>
        </div>

        {/* Diagnostic Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => vsHotReloadMemoryProfiler.triggerHotReload('CharacterMovementComponent.ApplyAcceleration()')}
            className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
          >
            <Zap size={14} />
            Hot Reload (Apply Code Changes)
          </button>

          <button
            onClick={() => vsHotReloadMemoryProfiler.forceGarbageCollection()}
            className="px-3.5 py-1.5 rounded-xl bg-[#1a243b] hover:bg-[#233150] text-[#94a3b8] hover:text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer border border-[#26375a]"
          >
            <Trash2 size={13} />
            Force GC (Collect)
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* HEAP TELEMETRY (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1a2336] bg-[#080b12] p-4 space-y-4 overflow-y-auto">
          
          {/* Top Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#0e1526] border border-[#1d2b48]">
              <span className="text-[10px] font-mono text-[#94a3b8] block">Managed Heap</span>
              <span className="text-xl font-black text-white font-mono">{totalMb} MB</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e1526] border border-[#1d2b48]">
              <span className="text-[10px] font-mono text-emerald-400 block">Gen 0 Collections</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{profile.gen0Collections}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e1526] border border-[#1d2b48]">
              <span className="text-[10px] font-mono text-cyan-400 block">Gen 1 Collections</span>
              <span className="text-xl font-black text-cyan-400 font-mono">{profile.gen1Collections}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e1526] border border-[#1d2b48]">
              <span className="text-[10px] font-mono text-rose-400 block">Gen 2 (Full GC)</span>
              <span className="text-xl font-black text-rose-400 font-mono">{profile.gen2Collections}</span>
            </div>
          </div>

          {/* Live Object Allocations Table */}
          <div className="rounded-xl bg-[#0e1526] border border-[#1d2b48] overflow-hidden flex flex-col">
            <div className="p-3 border-b border-[#1d2b48] bg-[#121c33] flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={13} className="text-violet-400" /> Heap Object Snapshot & Retainment Paths
              </span>
              <span className="text-[10px] font-mono text-violet-400">Snapshot #{profile.gen2Collections}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0b111f] text-[#94a3b8] border-b border-[#1d2b48]">
                  <tr>
                    <th className="p-2.5">Object Class</th>
                    <th className="p-2.5">Count</th>
                    <th className="p-2.5">Inclusive Size</th>
                    <th className="p-2.5">GC Gen</th>
                    <th className="p-2.5">Dominator Root Path</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1d2b48]">
                  {profile.liveObjects.map(obj => (
                    <tr key={obj.id} className={obj.isLeakingSuspect ? 'bg-rose-950/20' : ''}>
                      <td className="p-2.5 font-bold flex items-center gap-1.5">
                        {obj.isLeakingSuspect && <AlertTriangle size={13} className="text-rose-400 shrink-0" />}
                        <span className={obj.isLeakingSuspect ? 'text-rose-400' : 'text-white'}>{obj.className}</span>
                      </td>
                      <td className="p-2.5 text-white">{obj.count.toLocaleString()}</td>
                      <td className="p-2.5 text-[#94a3b8]">{(obj.sizeBytes / 1024).toFixed(0)} KB</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          obj.generation === 'LOH' ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40' :
                          obj.generation === 'GEN_2' ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40' :
                          'bg-cyan-950/80 text-cyan-400 border border-cyan-500/40'
                        }`}>
                          {obj.generation}
                        </span>
                      </td>
                      <td className="p-2.5 text-[11px] text-[#94a3b8] truncate max-w-xs">{obj.retainingPath}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Root Cause Leak Box */}
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-start gap-3">
            <ShieldAlert size={20} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-rose-400 block uppercase tracking-wider">
                On-Device Offline AI Memory Leak Diagnosis
              </span>
              <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                {profile.offlineAILeakAnalysis}
              </p>
            </div>
          </div>

        </div>

        {/* HOT RELOAD TIMELINE (4 cols) */}
        <div className="lg:col-span-4 bg-[#0a0f1c] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1a2336] bg-[#0f1728] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileCode2 size={13} className="text-violet-400" /> Edit-and-Continue (EnC) Patches
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Live Process Active</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {profile.recentHotReloadPatches.map(patch => (
              <div key={patch.patchId} className="p-3 rounded-xl bg-[#121b2f] border border-[#1d2b48] space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-violet-400 font-bold">{patch.patchId}</span>
                  <span className="text-[10px] text-[#94a3b8]">{patch.timestamp}</span>
                </div>
                <div className="text-white text-[11px] truncate">
                  {patch.modifiedMethod}
                </div>
                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="text-[#94a3b8]">Delta IL: {patch.deltaIlBytes} bytes</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={10} /> Applied
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
