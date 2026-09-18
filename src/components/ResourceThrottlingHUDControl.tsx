/**
 * ============================================================================
 * MODULE: ResourceThrottlingHUDControl.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของคอมโพเนนต์ (Component Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * คอมโพเนนต์ควบคุมการจำกัดทรัพยากรระบบสำหรับติดตั้งภายใน PerformanceHUD
 * (Resource Throttling Control Sub-Module for PerformanceHUD):
 *   - ให้สวิตช์ Toggle เปิด/ปิด "Resource Throttling" แบบ One-Click
 *   - แสดงสถานะการแคป (CAP: 50% LOAD, ECO 35%, หรือ GUARDED 68%) อย่างชัดเจน
 *   - มี Popover ปรับแต่งละเอียด: ปรับเปลี่ยน Profile, เลื่อน Slider กำหนด CPU/GPU Cap %,
 *     แสดงจำนวนรอบการคำนวณที่ถูกหน่วง (Suppressed Lockup Cycles), และตัววัดสถานะความปลอดภัย
 *   - รองรับการเรนเดอร์ทั้งในแบบ Badge กะทัดรัด (สำหรับ Pill/Compact Mode)
 *     และกล่องควบคุมละเอียด (สำหรับ Expanded Mode)
 * 
 * [ENGLISH]
 * 1. Component Purpose & Responsibility:
 * ----------------------------------------------------------------------------
 * Dedicated sub-component for Resource Throttling within PerformanceHUD:
 *   - Provides instant 1-click toggle to force-cap CPU & GPU utilization.
 *   - Real-time visual indicator showing whether hardware throttling is STANDBY or SUPPRESSING.
 *   - Interactive Quick Settings panel: Profile selection (ECO, BALANCED, GUARDED, CUSTOM),
 *     dynamic CPU/GPU slider caps, frame pacing delay, and lockup prevention metrics.
 *   - Modular layout supporting Compact / Pill mode chips as well as Expanded mode panels.
 * 
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - นำเข้าใน: `src/components/PerformanceHUD.tsx`
 * - ควบคุมผ่าน: `src/utils/ResourceThrottlingControllerNode.ts`
 * 
 * 3. พารามิเตอร์ Input / Output ที่รับส่ง (Inputs & Outputs):
 * ----------------------------------------------------------------------------
 * - Props:
 *     - `variant`: 'compact-chip' | 'expanded-panel' | 'header-toggle'
 *     - `showDetailsPopover?: boolean`
 *     - `onTogglePopover?: () => void`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp,
  Cpu,
  Box,
  Thermometer,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  ResourceThrottlingControllerNode,
  ResourceThrottlingState,
  ThrottlingProfileType,
  THROTTLING_PROFILES
} from '../utils/ResourceThrottlingControllerNode';

interface ResourceThrottlingHUDControlProps {
  variant?: 'compact-chip' | 'expanded-panel' | 'header-toggle';
  className?: string;
}

export default function ResourceThrottlingHUDControl({
  variant = 'compact-chip',
  className = ''
}: ResourceThrottlingHUDControlProps) {
  const controller = ResourceThrottlingControllerNode.getInstance();
  const [state, setState] = useState<ResourceThrottlingState>(controller.getState());
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  useEffect(() => {
    const unsubscribe = controller.subscribe(nextState => {
      setState(nextState);
    });
    return () => unsubscribe();
  }, [controller]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    controller.toggleThrottling();
  };

  const handleSelectProfile = (profile: Exclude<ThrottlingProfileType, 'CUSTOM'>) => {
    controller.setProfile(profile);
  };

  // 1. Header Toggle Variant (Small icon button for the HUD title bar)
  if (variant === 'header-toggle') {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <button
          onClick={handleToggle}
          className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer border ${
            state.enabled
              ? state.isCurrentlySuppressing
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)] animate-pulse'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_6px_rgba(6,182,212,0.25)]'
              : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-white hover:bg-[#30363d]'
          }`}
          title={
            state.enabled
              ? `Resource Throttling ACTIVE (${state.maxCpuPercent}% CPU / ${state.maxGpuPercent}% GPU Cap). Click to lift cap.`
              : 'Resource Throttling OFF (Click to force-cap CPU/GPU to prevent lockups)'
          }
        >
          {state.enabled ? (
            state.isCurrentlySuppressing ? (
              <ShieldAlert size={10} className="text-amber-400 shrink-0" />
            ) : (
              <ShieldCheck size={10} className="text-cyan-400 shrink-0" />
            )
          ) : (
            <Shield size={10} className="shrink-0 opacity-60" />
          )}
          <span>{state.enabled ? `CAP ${state.maxCpuPercent}%` : 'UNCAPPED'}</span>
        </button>
      </div>
    );
  }

  // 2. Compact Chip Variant (Used inside Compact Mode / Status Bar)
  if (variant === 'compact-chip') {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-between gap-1 p-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              onClick={handleToggle}
              className={`p-1 rounded cursor-pointer transition-all border ${
                state.enabled
                  ? state.isCurrentlySuppressing
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.35)]'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-[#161b22] text-[#8b949e] border-[#30363d] hover:text-white'
              }`}
              title="Toggle Force Resource Throttling"
            >
              {state.enabled ? (
                state.isCurrentlySuppressing ? (
                  <ShieldAlert size={11} className="text-amber-400 animate-pulse" />
                ) : (
                  <ShieldCheck size={11} className="text-cyan-400" />
                )
              ) : (
                <Shield size={11} />
              )}
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] font-bold text-white truncate">
                  {state.enabled ? 'Throttling Active' : 'Resource Throttle'}
                </span>
                {state.enabled && (
                  <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    ≤{state.maxCpuPercent}%
                  </span>
                )}
              </div>
              <span className="text-[8px] text-[#8b949e] font-sans truncate">
                {state.enabled
                  ? state.isCurrentlySuppressing
                    ? 'Clamping active simulation spike'
                    : `Capping CPU & GPU load`
                  : 'Full hardware power (No cap)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleToggle}
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                state.enabled
                  ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/50'
                  : 'bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-[#30363d] border border-[#30363d]'
              }`}
            >
              {state.enabled ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setIsOpenPopover(!isOpenPopover)}
              className="p-1 rounded text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#21262d] transition-colors cursor-pointer"
              title="Configure Resource Throttle Limits"
            >
              <Sliders size={10} />
            </button>
          </div>
        </div>

        {/* Quick Popover Settings */}
        {isOpenPopover && (
          <div className="mt-1.5 p-2.5 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl text-[10px] space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between border-b border-[#30363d]/60 pb-1">
              <span className="font-bold text-white flex items-center gap-1">
                <Sliders size={11} className="text-[#38bdf8]" />
                <span>Throttling Profile</span>
              </span>
              <button
                onClick={() => setIsOpenPopover(false)}
                className="text-[9px] text-[#8b949e] hover:text-white"
              >
                Done
              </button>
            </div>

            {/* Profile Selection */}
            <div className="grid grid-cols-3 gap-1">
              {(['ECO', 'BALANCED', 'GUARDED'] as const).map(p => {
                const config = THROTTLING_PROFILES[p];
                const isSelected = state.profile === p;
                return (
                  <button
                    key={p}
                    onClick={() => handleSelectProfile(p)}
                    className={`p-1.5 rounded text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold'
                        : 'bg-[#0d1117] text-[#8b949e] border-[#21262d] hover:bg-[#21262d] hover:text-white'
                    }`}
                  >
                    <div className="text-[9px] truncate">{config.label}</div>
                    <div className="text-[8px] font-mono text-white/80">{config.cpuCap}% Cap</div>
                  </button>
                );
              })}
            </div>

            {/* Custom Range Sliders */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-[#8b949e] flex items-center gap-1">
                  <Cpu size={10} className="text-[#38bdf8]" /> Max CPU Cap:
                </span>
                <span className="text-white font-mono font-bold">{state.maxCpuPercent}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="90"
                step="5"
                value={state.maxCpuPercent}
                onChange={e =>
                  controller.setCustomLimits(
                    Number(e.target.value),
                    state.maxGpuPercent,
                    state.framePacingDelayMs,
                    state.thermalCeilingCelsius
                  )
                }
                className="w-full accent-[#38bdf8] h-1.5 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[9px] pt-1">
                <span className="text-[#8b949e] flex items-center gap-1">
                  <Box size={10} className="text-[#c084fc]" /> Max GPU Cap:
                </span>
                <span className="text-white font-mono font-bold">{state.maxGpuPercent}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="90"
                step="5"
                value={state.maxGpuPercent}
                onChange={e =>
                  controller.setCustomLimits(
                    state.maxCpuPercent,
                    Number(e.target.value),
                    state.framePacingDelayMs,
                    state.thermalCeilingCelsius
                  )
                }
                className="w-full accent-[#c084fc] h-1.5 cursor-pointer"
              />
            </div>

            {/* Status Footer */}
            <div className="p-1.5 rounded bg-[#0d1117] border border-[#21262d] text-[8.5px] text-[#8b949e] flex items-center justify-between">
              <span>Lockup Cycles Prevented:</span>
              <strong className="text-cyan-400 font-mono">{state.totalCappedCycles}</strong>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Expanded Panel Variant (Detailed view for Expanded HUD mode)
  return (
    <div className={`p-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-2.5 ${className}`}>
      {/* Header and Toggle Row */}
      <div className="flex items-center justify-between gap-2 border-b border-[#30363d]/60 pb-1.5">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-md border ${
              state.enabled
                ? state.isCurrentlySuppressing
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-[#161b22] text-[#8b949e] border-[#30363d]'
            }`}
          >
            {state.enabled ? (
              <ShieldCheck size={14} className={state.isCurrentlySuppressing ? 'text-amber-400' : 'text-cyan-400'} />
            ) : (
              <Shield size={14} className="opacity-60" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10.5px] font-bold text-white tracking-wide">
                RESOURCE THROTTLING
              </span>
              <span
                className={`px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold border ${
                  state.enabled
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
                }`}
              >
                {state.enabled ? `ACTIVE (${state.profile})` : 'DISENGAGED'}
              </span>
            </div>
            <span className="text-[9px] text-[#8b949e] block font-sans">
              Force-cap hardware loads to prevent browser/system freeze during heavy simulations
            </span>
          </div>
        </div>

        {/* Master Switch */}
        <button
          onClick={handleToggle}
          className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
            state.enabled
              ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
              : 'bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white border-[#30363d]'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              state.enabled
                ? state.isCurrentlySuppressing
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-cyan-400'
                : 'bg-[#8b949e]'
            }`}
          />
          <span>{state.enabled ? 'ENABLED' : 'ENABLE'}</span>
        </button>
      </div>

      {/* Preset Profiles Buttons */}
      <div className="grid grid-cols-3 gap-1.5">
        {(['ECO', 'BALANCED', 'GUARDED'] as const).map(p => {
          const config = THROTTLING_PROFILES[p];
          const isSelected = state.profile === p;
          return (
            <button
              key={p}
              onClick={() => handleSelectProfile(p)}
              className={`p-1.5 rounded-md text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-sm'
                  : 'bg-[#161b22] text-[#8b949e] border-[#21262d] hover:bg-[#21262d] hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9.5px] font-bold text-white">{config.label}</span>
                {isSelected && <Check size={10} className="text-cyan-400" />}
              </div>
              <div className="text-[8.5px] font-mono text-cyan-300/90">
                CPU: {config.cpuCap}% • GPU: {config.gpuCap}%
              </div>
              <div className="text-[7.5px] text-[#8b949e] line-clamp-1 mt-0.5">
                {config.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sliders for fine-tuning */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* CPU Cap Slider */}
        <div className="p-2 bg-[#161b22] border border-[#21262d] rounded-md space-y-1">
          <div className="flex items-center justify-between text-[9px]">
            <span className="text-[#8b949e] flex items-center gap-1 font-semibold">
              <Cpu size={10} className="text-[#38bdf8]" /> CPU Upper Ceiling
            </span>
            <span className="text-[#38bdf8] font-mono font-bold">≤{state.maxCpuPercent}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="85"
            step="5"
            value={state.maxCpuPercent}
            onChange={e =>
              controller.setCustomLimits(
                Number(e.target.value),
                state.maxGpuPercent,
                state.framePacingDelayMs,
                state.thermalCeilingCelsius
              )
            }
            className="w-full accent-[#38bdf8] h-1.5 cursor-pointer"
          />
        </div>

        {/* GPU Cap Slider */}
        <div className="p-2 bg-[#161b22] border border-[#21262d] rounded-md space-y-1">
          <div className="flex items-center justify-between text-[9px]">
            <span className="text-[#8b949e] flex items-center gap-1 font-semibold">
              <Box size={10} className="text-[#c084fc]" /> GPU Upper Ceiling
            </span>
            <span className="text-[#c084fc] font-mono font-bold">≤{state.maxGpuPercent}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="85"
            step="5"
            value={state.maxGpuPercent}
            onChange={e =>
              controller.setCustomLimits(
                state.maxCpuPercent,
                Number(e.target.value),
                state.framePacingDelayMs,
                state.thermalCeilingCelsius
              )
            }
            className="w-full accent-[#c084fc] h-1.5 cursor-pointer"
          />
        </div>
      </div>

      {/* Telemetry & Safety Metrics Bar */}
      <div className="p-2 bg-[#161b22] border border-[#30363d]/70 rounded-md grid grid-cols-3 gap-2 text-[9px] font-mono">
        <div>
          <span className="text-[#8b949e] block text-[8px]">ACTIVE STATUS</span>
          <span
            className={`font-bold flex items-center gap-1 ${
              state.enabled
                ? state.isCurrentlySuppressing
                  ? 'text-amber-400'
                  : 'text-cyan-400'
                : 'text-[#8b949e]'
            }`}
          >
            {state.enabled
              ? state.isCurrentlySuppressing
                ? 'CLAMPING SPIKE'
                : 'ARMED & SAFE'
              : 'UNCAPPED'}
          </span>
        </div>
        <div>
          <span className="text-[#8b949e] block text-[8px]">FRAME DELAY</span>
          <span className="text-white font-bold">{state.framePacingDelayMs} ms pacing</span>
        </div>
        <div>
          <span className="text-[#8b949e] block text-[8px]">LOCKUPS PREVENTED</span>
          <span className="text-emerald-400 font-bold">{state.totalCappedCycles} cycles</span>
        </div>
      </div>
    </div>
  );
}
