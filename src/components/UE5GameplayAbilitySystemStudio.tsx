/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Unreal Engine 5 Gameplay Ability System (GAS) & Gameplay Tag Studio (UE5 parity).
 *          Visual Tag Container tree hierarchy, Attribute Set live gauges with modifiers,
 *          Gameplay Effect stacking timeline, and On-Device Offline AI balance formula auditor.
 *    - TH: สตูดิโอระบบสกิลและสถานะตัวละคร UE5 Gameplay Ability System (GAS Parity)
 *          แผนภูมิต้นไม้ Gameplay Tags แบบลำดับชั้น (Dot Notation), เกจวัด Attribute Set
 *          (Health, Mana, Stamina), รายการ Gameplay Effects พร้อมระยะเวลาคูลดาวน์,
 *          และระบบ AI ออฟไลน์ตรวจสอบสมดุลตัวเลขความเสียหาย
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `ue5GASTypes.ts` and `UE5GameplayAbilitySystemEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Zap,
  Activity,
  Tags,
  Sparkles,
  Layers,
  Heart,
  Flame,
  CheckCircle2,
  AlertCircle,
  Sword,
  Target
} from 'lucide-react';
import { ue5GameplayAbilitySystemEngine } from '../utils/UE5GameplayAbilitySystemEngineNode';
import { UE5GASProfile } from '../types/ue5GASTypes';

interface GASStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function UE5GameplayAbilitySystemStudio({ onSelectTool }: GASStudioProps) {
  const [profile, setProfile] = useState<UE5GASProfile>(() =>
    ue5GameplayAbilitySystemEngine.getProfile()
  );

  useEffect(() => {
    return ue5GameplayAbilitySystemEngine.subscribe(() => {
      setProfile({ ...ue5GameplayAbilitySystemEngine.getProfile() });
    });
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#060913] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1b253b] bg-[#0b1020] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
            <Shield size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                UE5 Gameplay Ability System (GAS) & Gameplay Tag Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 text-[10px] font-bold border border-amber-500/40 font-mono">
                Unreal Engine 5 GAS Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Hierarchical Gameplay Tags, AttributeSets (Base/Current), Gameplay Effects, and On-Device Offline AI Formula Auditing.
            </p>
          </div>
        </div>

        {/* Character Class Badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#94a3b8]">Target Avatar:</span>
          <span className="px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 font-bold border border-amber-500/40">
            {profile.characterClass}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* ATTRIBUTE SET GAUGES (6 cols) */}
        <div className="lg:col-span-6 flex flex-col border-r border-[#1b253b] bg-[#060913] p-4 space-y-4 overflow-y-auto">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0b1020] rounded-xl flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <Activity size={13} className="text-amber-400" />
              Active AttributeSet (PreAttributeChange Clamped)
            </span>
            <span className="text-emerald-400 font-bold">{profile.attributes.length} Core Attributes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {profile.attributes.map(attr => {
              const pct = Math.round((attr.currentValue / attr.maxValue) * 100);
              return (
                <div key={attr.name} className="p-3 rounded-xl bg-[#0e1526] border border-[#1d2943] space-y-2">
                  <div className="flex justify-between text-white font-bold">
                    <span>{attr.name}</span>
                    <span className="text-amber-400">{attr.currentValue.toFixed(1)} / {attr.maxValue}</span>
                  </div>
                  <div className="w-full bg-[#18233a] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        attr.name === 'Health' ? 'bg-rose-500' :
                        attr.name === 'Mana' ? 'bg-blue-500' :
                        attr.name === 'Stamina' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#64748b]">
                    <span>Base: {attr.baseValue}</span>
                    <span>Ratio: {pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gameplay Effects List */}
          <div className="space-y-2 font-mono text-xs">
            <span className="text-xs font-bold text-white uppercase tracking-wider block font-sans">
              Active Gameplay Effects (Modifiers Pipeline)
            </span>

            {profile.activeEffects.map(ge => (
              <div key={ge.id} className="p-2.5 rounded-lg bg-[#0e1526] border border-[#1d2943] flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">{ge.name}</div>
                  <div className="text-[10px] text-[#94a3b8]">
                    Target: {ge.targetAttribute} | Policy: {ge.durationPolicy} {ge.durationSeconds > 0 ? `(${ge.durationSeconds}s)` : ''}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/40">
                  {ge.modifierOp === 'ADD' ? `${ge.magnitude > 0 ? '+' : ''}${ge.magnitude}` : `x${ge.magnitude}`}
                </span>
              </div>
            ))}
          </div>

          {/* AI Audit */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5 font-sans">
            <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {profile.offlineAIFormulaAudit}
            </p>
          </div>

        </div>

        {/* GAMEPLAY TAG TREE (6 cols) */}
        <div className="lg:col-span-6 bg-[#080d1a] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0b1020] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Tags size={13} className="text-amber-400" /> Gameplay Tag Container Hierarchy
            </span>
            <span className="text-[10px] font-mono text-amber-400">Dot Notation Queries</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {profile.gameplayTags.map(tag => (
              <div
                key={tag.tag}
                onClick={() => ue5GameplayAbilitySystemEngine.toggleTag(tag.tag)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  tag.isActive
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                    : 'bg-[#0f172a] border-[#1e293b] text-[#94a3b8]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${tag.isActive ? 'bg-amber-400' : 'bg-slate-600'}`} />
                    {tag.tag}
                  </span>
                  <span className={`text-[10px] font-bold ${tag.isActive ? 'text-amber-400' : 'text-slate-500'}`}>
                    {tag.isActive ? 'GRANTED' : 'INACTIVE'}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#94a3b8] font-sans">
                  {tag.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
