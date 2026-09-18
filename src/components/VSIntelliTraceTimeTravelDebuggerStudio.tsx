/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Visual Studio IntelliTrace & Time-Travel Historical Debugger Studio (VS Enterprise parity).
 *          Reverse debugging timeline, Step Back / Step Forward buttons, historical
 *          local variable inspection, and On-Device Offline AI root-cause analysis.
 *    - TH: สตูดิโอย้อนเวลาการรันโค้ด Visual Studio IntelliTrace & Time-Travel Debugger
 *          (VS Enterprise Parity)
 *          ปุ่มถอยหลังย้อนเวลา (Step Back), ตรวจสอบค่าตัวแปรในอดีต (Historical Locals),
 *          เส้นเวลาเหตุการณ์ Exception และ Call Stack, พร้อม AI ออฟไลน์ระบุจุดต้นตอของบัก
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `vsIntelliTraceTypes.ts` and `VSIntelliTraceEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Play,
  Bug,
  AlertTriangle,
  History,
  Activity,
  Layers,
  Sparkles,
  ShieldAlert,
  Clock,
  Cpu,
  CornerDownRight,
  Zap
} from 'lucide-react';
import { vsIntelliTraceEngine } from '../utils/VSIntelliTraceEngineNode';
import { VSIntelliTraceProfile } from '../types/vsIntelliTraceTypes';

interface TTDStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function VSIntelliTraceTimeTravelDebuggerStudio({ onSelectTool }: TTDStudioProps) {
  const [profile, setProfile] = useState<VSIntelliTraceProfile>(() =>
    vsIntelliTraceEngine.getProfile()
  );

  useEffect(() => {
    return vsIntelliTraceEngine.subscribe(() => {
      setProfile({ ...vsIntelliTraceEngine.getProfile() });
    });
  }, []);

  const activeEvent = profile.events[profile.currentPlaybackIndex];

  return (
    <div className="flex flex-col h-full bg-[#070a13] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1a2336] bg-[#0c1220] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
            <History size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Visual Studio IntelliTrace & Time-Travel Debugger Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-400 text-[10px] font-bold border border-indigo-500/40 font-mono">
                VS Enterprise TTD Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Historical Execution Recording, Step Back / Step Forward, and On-Device Offline AI Root Cause Pinpointing.
            </p>
          </div>
        </div>

        {/* Time Travel Stepper Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => vsIntelliTraceEngine.stepBack()}
            disabled={profile.currentPlaybackIndex <= 0}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
          >
            <RotateCcw size={13} />
            Step Back (Rewind Time)
          </button>

          <button
            onClick={() => vsIntelliTraceEngine.stepForward()}
            disabled={profile.currentPlaybackIndex >= profile.events.length - 1}
            className="px-3.5 py-1.5 rounded-xl bg-[#1e293b] hover:bg-[#334155] disabled:opacity-40 text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer border border-[#334155] transition-all"
          >
            <Play size={13} />
            Step Forward
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* TIMELINE OF EVENTS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1a2336] bg-[#070a13] p-4 space-y-4 overflow-y-auto">
          
          <div className="p-3 border-b border-[#1a2336] bg-[#0c1220] rounded-xl flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <Clock size={13} className="text-indigo-400" />
              Playback Position: Sequence #{activeEvent?.sequenceId} ({activeEvent?.timestamp})
            </span>

            <span className="text-emerald-400 font-bold">
              Recording Buffer: {profile.totalRecordedEvents.toLocaleString()} events
            </span>
          </div>

          {/* Events Timeline */}
          <div className="space-y-2">
            {profile.events.map((evt, idx) => {
              const isCurrent = idx === profile.currentPlaybackIndex;
              return (
                <div
                  key={evt.sequenceId}
                  className={`p-3 rounded-xl border transition-all font-mono text-xs ${
                    isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-[#0f1728] border-[#1c273e] text-[#94a3b8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evt.eventType === 'EXCEPTION' ? 'bg-rose-950 text-rose-400 border border-rose-500/40' :
                        evt.eventType === 'MUTEX_ACQUIRE' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                        'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                      }`}>
                        {evt.eventType}
                      </span>
                      <span className="text-white font-bold">Seq #{evt.sequenceId}</span>
                      <span className="text-[10px] text-[#64748b]">{evt.timestamp}</span>
                    </div>

                    <span className="text-xs text-indigo-400">Thread #{evt.threadId}</span>
                  </div>

                  <div className="mt-2 text-white font-semibold">
                    {evt.methodName}
                  </div>

                  {evt.isCulpritEvent && (
                    <div className="mt-2 p-2 rounded bg-amber-950/50 border border-amber-500/40 text-amber-300 text-[11px] flex items-center gap-1.5 font-sans">
                      <AlertTriangle size={13} className="text-amber-400 shrink-0" />
                      <strong>Root Cause Event:</strong> WeaponSlot.EquippedWeapon set to null here!
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Offline AI Root Cause Summary */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/40 flex items-start gap-3 font-sans">
            <ShieldAlert size={20} className="text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-indigo-400 block uppercase tracking-wider">
                On-Device Offline AI Root Cause Analysis
              </span>
              <p className="text-xs text-indigo-200/90 mt-1 leading-relaxed">
                {profile.offlineAIRootCauseSummary}
              </p>
            </div>
          </div>

        </div>

        {/* HISTORICAL LOCALS (4 cols) */}
        <div className="lg:col-span-4 bg-[#090e1a] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1a2336] bg-[#0e1628] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-indigo-400" /> Historical Variable Snapshot
            </span>
            <span className="text-[10px] font-mono text-indigo-400">Time-Travel Frame</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2 font-sans">
              Local Variables at Seq #{activeEvent?.sequenceId}
            </span>

            {activeEvent && Object.entries(activeEvent.variableSnapshot).map(([key, val]) => (
              <div key={key} className="p-2.5 rounded-lg bg-[#11192c] border border-[#1d2a48] space-y-1">
                <div className="flex justify-between">
                  <span className="text-indigo-400">{key}:</span>
                  <span className={val === null ? 'text-rose-400 font-bold' : 'text-white'}>
                    {val === null ? 'null' : String(val)}
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
