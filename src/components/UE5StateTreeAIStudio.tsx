/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Unreal Engine 5 StateTree AI & Hierarchical State Machine (HSM) Decision Studio.
 *          Visualizes hierarchical StateTree states, active nodes, tasks, transitions,
 *          evaluators, and provides On-Device Offline AI State Machine Optimization (Zero-Token Guarantee).
 *    - TH: สตูดิโอออกแบบพฤติกรรม AI ด้วย Unreal Engine 5 StateTree (StateTree Decision Studio)
 *          แสดงผลโครงสร้างสถานะลำดับชั้น (Hierarchical State Tree), สถานะการทำงานปัจจุบัน (Active State),
 *          Tasks, Evaluators, เงื่อนไขการเปลี่ยนผ่าน (Transitions), และระบบ AI ออฟไลน์ช่วยปรับปรุงโครงสร้าง
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `ue5StateTreeTypes.ts` and `UE5StateTreeEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  GitFork,
  Cpu,
  Zap,
  Sparkles,
  ArrowRight,
  Activity,
  Shield,
  Layers,
  CheckCircle2,
  Settings,
  Bot
} from 'lucide-react';
import { ue5StateTreeEngine } from '../utils/UE5StateTreeEngineNode';
import { UE5StateTreeProfile } from '../types/ue5StateTreeTypes';

interface UE5StateTreeStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function UE5StateTreeAIStudio({ onSelectTool }: UE5StateTreeStudioProps) {
  const [profile, setProfile] = useState<UE5StateTreeProfile>(() =>
    ue5StateTreeEngine.getProfile()
  );

  useEffect(() => {
    return ue5StateTreeEngine.subscribe(() => {
      setProfile({ ...ue5StateTreeEngine.getProfile() });
    });
  }, []);

  const activeState = profile.states.find(s => s.id === profile.activeStateId);

  return (
    <div className="flex flex-col h-full bg-[#080d1a] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1b263e] bg-[#0c1326] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
            <GitFork size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Unreal Engine 5 StateTree AI & Hierarchical State Machine (HSM)
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 text-[10px] font-bold border border-amber-500/40 font-mono">
                UE5 StateTree Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              High-performance decision trees for MassEntity ECS, Evaluators, Tasks, and On-Device Offline AI State Optimizers.
            </p>
          </div>
        </div>

        {/* Schema Badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#94a3b8]">Schema:</span>
          <span className="px-3 py-1 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5 shadow">
            <Cpu size={14} />
            {profile.schemaType}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* STATE HIERARCHY TREE (5 cols) */}
        <div className="lg:col-span-5 flex flex-col border-r border-[#1b263e] bg-[#060a14] overflow-hidden">
          <div className="p-3 border-b border-[#1b263e] bg-[#0c1220] flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-1.5">
              <Layers size={13} className="text-amber-400" />
              State Hierarchy ({profile.states.length} States)
            </span>
            <span className="text-[10px] text-amber-400">Click to Transition</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 font-mono text-xs">
            {profile.states.map(state => {
              const isActive = state.id === profile.activeStateId;
              const isRoot = state.id === 'STATE_ROOT';

              return (
                <div
                  key={state.id}
                  onClick={() => !isRoot && ue5StateTreeEngine.transitionTo(state.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-950/40 border-amber-500/70 shadow-lg'
                      : 'bg-[#0d1424] border-[#1c2944] hover:border-slate-600'
                  } ${isRoot ? 'opacity-75 cursor-default' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white font-sans flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-400 animate-pulse' : 'bg-[#475569]'}`} />
                      {state.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-[#1e293b] text-[#94a3b8]'
                    }`}>
                      {state.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#94a3b8]">
                    ID: {state.id} • {state.tasks.length} Tasks • {state.transitions.length} Transitions
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIVE STATE INSPECTOR & ON-DEVICE AI INSIGHT (7 cols) */}
        <div className="lg:col-span-7 bg-[#090d18] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1b263e] bg-[#0c1220] flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={13} className="text-amber-400" />
              Active State Inspector: {activeState?.name || 'None'}
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Tick: 50ms</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {/* Executable Tasks */}
            <div className="p-3.5 rounded-xl bg-[#0e1628] border border-[#1d2b48] space-y-2 font-sans">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Active State Tasks & Evaluators
              </span>
              {activeState?.tasks && activeState.tasks.length > 0 ? (
                <div className="space-y-2">
                  {activeState.tasks.map(task => (
                    <div key={task.id} className="p-2.5 rounded-lg bg-[#070b14] border border-[#1a253a] flex items-start justify-between">
                      <div>
                        <div className="text-white font-bold text-xs flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-amber-400" />
                          {task.name}
                        </div>
                        <p className="text-[11px] text-[#94a3b8] mt-0.5">{task.description}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-mono text-[10px] shrink-0">
                        {task.executionRateHz} Hz
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[#64748b] text-xs italic">No executable tasks in this state.</div>
              )}
            </div>

            {/* Outgoing Transitions */}
            <div className="p-3.5 rounded-xl bg-[#0e1628] border border-[#1d2b48] space-y-2 font-sans">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                State Transition Logic (Guards & Triggers)
              </span>
              {activeState?.transitions && activeState.transitions.length > 0 ? (
                <div className="space-y-2">
                  {activeState.transitions.map((tr, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#070b14] border border-[#1a253a] space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-300 font-bold">Event: {tr.event}</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ArrowRight size={11} /> {tr.targetStateId}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#94a3b8] bg-[#0c1220] p-1.5 rounded">
                        Condition: <code className="text-cyan-300">{tr.conditionText}</code>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[#64748b] text-xs italic">No transitions configured.</div>
              )}
            </div>

            {/* On-Device Offline AI StateTree Optimizer Card */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> On-Device Offline AI StateTree Evaluator
              </span>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {profile.offlineAIInsight}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
