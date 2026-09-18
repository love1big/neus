/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: AAA StateTree Hierarchical Decision & Logic Graph Studio (Unreal Engine 5.3+
 *          StateTree & Modular Behavior Tree parity). Visualizes hierarchical state
 *          inheritance trees, live state selection, running task pipelines, transition
 *          conditions, and interactive blackboard parameter manipulation.
 *    - TH: สตูดิโอระบบ StateTree และการตัดสินใจลำดับชั้นระดับ AAA (เทียบเท่า Unreal 5.3+
 *          StateTree & Modular Behavior Tree)
 *          แสดงผังต้นไม้ลำดับชั้นของสถานะ (Parent/Child Hierarchy), ตรวจสอบสถานะที่กำลังทำงาน (Active State),
 *          จัดการคิวงานย่อย (Tasks), แสดงเงื่อนไขการเปลี่ยนสถานะ (Transitions),
 *          และแผงควบคุมตัวแปรบนกระดานดำ (Blackboard Inspector) แบบอินเตอร์แอคทีฟ
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Backed by `StateTreeDecisionNode.ts` and `stateTreeTypes.ts`
 *    - Drives intelligent NPC decisions, boss phases, and combat tactics
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Graceful fallback when navigating states without valid parent links.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```tsx
 *    <StateTreeHierarchicalDecisionStudio onSelectTool={handleSelect} />
 *    ```
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Play,
  Layers,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  FolderTree,
  Database,
  ArrowRight,
  Shield,
  Swords,
  Footprints,
  Eye,
  RefreshCw
} from 'lucide-react';
import { stateTreeEngine } from '../utils/StateTreeDecisionNode';
import { StateTreeSchema, StateTreeNode } from '../types/stateTreeTypes';

interface StateTreeStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function StateTreeHierarchicalDecisionStudio({ onSelectTool }: StateTreeStudioProps) {
  const [schema, setSchema] = useState<StateTreeSchema>(() => stateTreeEngine.getSchema());
  const [activeStateId, setActiveStateId] = useState<string>(() => stateTreeEngine.getActiveStateId());
  const [selectedStateId, setSelectedStateId] = useState<string>(() => stateTreeEngine.getActiveStateId());

  useEffect(() => {
    return stateTreeEngine.subscribe(() => {
      setSchema(stateTreeEngine.getSchema());
      setActiveStateId(stateTreeEngine.getActiveStateId());
    });
  }, []);

  const selectedState = schema.states.find(s => s.id === selectedStateId) || schema.states[0];

  const handleStateSelect = (stateId: string) => {
    setSelectedStateId(stateId);
    stateTreeEngine.selectState(stateId);
  };

  const handleToggleTarget = () => {
    const curr = schema.blackboard.hasTarget.value;
    stateTreeEngine.setBlackboardValue('hasTarget', !curr);
  };

  const handleHealthChange = (newVal: number) => {
    stateTreeEngine.setBlackboardValue('healthPercent', newVal);
  };

  const handleNoiseChange = (newVal: number) => {
    stateTreeEngine.setBlackboardValue('suspiciousNoiseLevel', newVal);
  };

  return (
    <div className="flex flex-col h-full bg-[#090d14] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0d1320] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600/30 to-violet-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
            <GitBranch size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                StateTree Hierarchical Decision & Logic Graph Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-400 text-[10px] font-bold border border-indigo-500/40 font-mono">
                Unreal Engine 5.3+ StateTree Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Modular hierarchical state machines, transition condition evaluators, enter/exit tasks, and synchronized blackboard state.
            </p>
          </div>
        </div>

        {/* Live Active State Indicator */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <Activity size={13} className="text-indigo-400 animate-pulse" />
            Active: {schema.states.find(s => s.id === activeStateId)?.name}
          </span>
        </div>
      </div>

      {/* Main 3 Columns */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* COLUMN 1: Hierarchical State Tree View (4 cols) */}
        <div className="lg:col-span-4 border-r border-[#1c2438] bg-[#0c111c] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FolderTree size={13} className="text-indigo-400" /> State Hierarchy ({schema.states.length})
            </span>
            <span className="text-[10px] font-mono text-[#64748b]">Select to Focus</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {schema.states.map(state => {
              const isActive = state.id === activeStateId;
              const isSelected = state.id === selectedStateId;
              const isChild = state.parentId !== null;
              const isGrandChild = state.parentId && state.parentId !== 'state_root';

              return (
                <div
                  key={state.id}
                  onClick={() => handleStateSelect(state.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isGrandChild ? 'ml-6' : isChild ? 'ml-3' : 'ml-0'
                  } ${
                    isActive
                      ? 'bg-indigo-950/50 border-indigo-500/70 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500'
                      : isSelected
                      ? 'bg-[#151c2e] border-indigo-500/40'
                      : 'bg-[#121826] border-[#1f293d] hover:border-[#334155]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: state.color }}></span>
                      <span className="font-bold text-white text-xs">{state.name}</span>
                    </div>

                    {isActive && (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500 text-white font-mono font-bold animate-pulse">
                        RUNNING
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#94a3b8] mt-1 line-clamp-1">{state.description}</p>

                  <div className="flex items-center gap-3 mt-2 text-[10px] text-[#64748b] font-mono">
                    <span>Tasks: {state.tasks.length}</span>
                    <span>•</span>
                    <span>Transitions: {state.transitions.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: Active State Tasks & Transitions Inspector (4 cols) */}
        <div className="lg:col-span-4 border-r border-[#1c2438] bg-[#080b12] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={13} className="text-amber-400" /> State Inspector: {selectedState.name}
            </span>
            <span className="text-[10px] font-mono text-[#64748b]">{selectedState.id}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Tasks Pipeline */}
            <div className="p-3.5 rounded-xl bg-[#0d1424] border border-[#1e2b45] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Executing Tasks ({selectedState.tasks.length})
              </span>

              {selectedState.tasks.length === 0 ? (
                <p className="text-xs text-[#64748b] italic">No active tasks assigned to this state container.</p>
              ) : (
                selectedState.tasks.map(task => (
                  <div key={task.id} className="p-2.5 rounded-lg bg-[#141b2d] border border-[#23314d] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-xs block">{task.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">{task.category}</span>
                    </div>
                    <span className="text-xs font-mono text-[#94a3b8]">{task.durationSec}s</span>
                  </div>
                ))
              )}
            </div>

            {/* Transitions Rules */}
            <div className="p-3.5 rounded-xl bg-[#0d1424] border border-[#1e2b45] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Outbound Transitions ({selectedState.transitions.length})
              </span>

              {selectedState.transitions.length === 0 ? (
                <p className="text-xs text-[#64748b] italic">Inherits transitions from parent state hierarchy.</p>
              ) : (
                selectedState.transitions.map(tr => (
                  <div key={tr.id} className="p-2.5 rounded-lg bg-[#141b2d] border border-[#23314d] space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <ArrowRight size={13} /> {tr.targetStateId}
                      </span>
                      <span className="text-[10px] font-mono text-[#64748b]">Priority {tr.priority}</span>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono text-[#94a3b8] bg-[#0b0f1a] p-2 rounded">
                      {tr.conditions.map(c => (
                        <div key={c.id}>
                          Condition: <strong className="text-indigo-400">{c.variableKey}</strong> {c.operator} <strong className="text-white">{String(c.targetValue)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* COLUMN 3: Live Blackboard Variable Controls (4 cols) */}
        <div className="lg:col-span-4 bg-[#0c111c] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Database size={13} className="text-indigo-400" /> Blackboard Parameters
            </span>
            <span className="text-[10px] font-mono text-indigo-400">Live Agent Memory</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Target Perception Switch */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Adversary Sighted (hasTarget)</span>
                  <span className="text-[10px] text-[#64748b]">Triggers Combat vs Passive Tree branches</span>
                </div>
                <button
                  onClick={handleToggleTarget}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                    schema.blackboard.hasTarget.value
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40'
                      : 'bg-[#1a2336] hover:bg-[#25324d] text-[#94a3b8]'
                  }`}
                >
                  {schema.blackboard.hasTarget.value ? 'TARGET DETECTED' : 'NO TARGET'}
                </button>
              </div>
            </div>

            {/* Health Percentage Slider */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Agent Health (healthPercent)</span>
                <span className="font-mono text-indigo-400">{schema.blackboard.healthPercent.value}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={schema.blackboard.healthPercent.value}
                onChange={(e) => handleHealthChange(parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-[#1a2336] rounded-lg"
              />
              <span className="text-[10px] text-[#64748b] block">
                Below 25% triggers Combat Retreat cover sequence
              </span>
            </div>

            {/* Suspicious Noise Level Slider */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Acoustic Noise Level</span>
                <span className="font-mono text-indigo-400">{schema.blackboard.suspiciousNoiseLevel.value} dB</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={schema.blackboard.suspiciousNoiseLevel.value}
                onChange={(e) => handleNoiseChange(parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-[#1a2336] rounded-lg"
              />
              <span className="text-[10px] text-[#64748b] block">
                Above 50 dB triggers Investigate Disturbance routine
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
