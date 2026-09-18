/**
 * @file PerformanceHUD.tsx
 * @description
 * ============================================================================
 * [THAI - ภาษาไทย]
 * ระบบโอเวอร์เลย์แสดงประสิทธิภาพเครื่องยนต์เกมและทรัพยากรระบบแบบเรียลไทม์ (Engine Performance HUD Overlay)
 * 
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 *    - แสดงผลการใช้ CPU, GPU, RAM, VRAM, FPS, Frame Time, อุณหภูมิ (Thermals), และ Draw Calls แบบเรียลไทม์
 *    - บันทึกสถานะการแสดงผล (Visibility), รูปแบบการแสดงผล (Pill / Compact / Expanded), ตำแหน่ง (Position),
 *      และความทึบแสง (Opacity) ลงใน `localStorage` เพื่อความต่อเนื่อง (Persistent Overlay)
 *    - ทำงานประสานงานโดยตรงกับคอมโพเนนต์ `SystemResourceMonitor.tsx` โดยมีปุ่มลัดสำหรับเปิดหน้าต่างวิเคราะห์เต็มรูปแบบ
 *    - รองรับการลากย้ายตำแหน่งอย่างอิสระ (Draggable) และการล็อกตามมุมจอ (Top-Right, Top-Left, Bottom-Right, Bottom-Left)
 *    - มีระบบสั่งล้างหน่วยความจำด่วน (Quick RAM Garbage Collection Purge)
 * 
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 *    - ดึงข้อมูล Telemetry แบบ Realtime จาก: `src/lib/telemetry.ts` ผ่านฮุก `useSystemTelemetry()`
 *    - เชื่อมโยงกับ: `src/components/SystemResourceMonitor.tsx` (เปิดหน้าต่าง Monitor หรือเรียกใช้ Stress Profile)
 *    - ส่ง Custom Event: `switch-tool` หรือ `open-system-monitor` เพื่อสลับไปหน้าระบบมอนิเตอร์
 *    - ปุ่มลัดคีย์บอร์ดระดับสากล: `Alt + P` หรือ `F3` เพื่อเปิด/ปิด HUD ได้จากทุกที่
 * 
 * 3. พารามิเตอร์ Input / Output ที่รับส่ง (Inputs, Outputs & Data Contracts):
 *    - Props:
 *      - `onOpenFullMonitor?: () => void`: ฟังก์ชันเปิดหน้าต่าง SystemResourceMonitor ตัวเต็ม
 *      - `onSelectTool?: (toolId: string) => void`: ฟังก์ชันสลับหน้าเครื่องมือใน App.tsx
 * 
 * 4. การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 *    - หากข้อมูลประวัติ (Sparkline History) ยังไม่พร้อม จะแสดง Fallback Placeholder
 *    - ตรวจจับขอบหน้าต่างอัตโนมัติ (Clamp Bounds) เพื่อไม่ให้ลากกล่องหลุดออกนอกจอ
 * 
 * 5. ตัวอย่างการเรียกใช้งาน (Usage Example):
 *    ```tsx
 *    <PerformanceHUD
 *      onOpenFullMonitor={() => setActiveTool('SystemResourceMonitor')}
 *      onSelectTool={setActiveTool}
 *    />
 *    ```
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Box,
  Zap,
  Gauge,
  Thermometer,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Move,
  Settings,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { useSystemTelemetry, setSimulatedStressProfile } from '../lib/telemetry';
import ResourceThrottlingHUDControl from './ResourceThrottlingHUDControl';
import { ResourceThrottlingControllerNode } from '../utils/ResourceThrottlingControllerNode';

export type HUDMode = 'pill' | 'compact' | 'expanded';
export type HUDPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'custom';

interface HUDConfig {
  isVisible: boolean;
  mode: HUDMode;
  position: HUDPosition;
  opacity: number;
  customX: number;
  customY: number;
  pinned: boolean;
}

const DEFAULT_CONFIG: HUDConfig = {
  isVisible: true,
  mode: 'compact',
  position: 'top-right',
  opacity: 92,
  customX: 20,
  customY: 60,
  pinned: true
};

const STORAGE_KEY = 'omni_engine_performance_hud_config_v2';

interface PerformanceHUDProps {
  onOpenFullMonitor?: () => void;
  onSelectTool?: (toolId: string) => void;
}

export default function PerformanceHUD({ onOpenFullMonitor, onSelectTool }: PerformanceHUDProps) {
  const {
    stats,
    threadLoads,
    cpuHistory,
    gpuHistory,
    ramHistory,
    vramHistory,
    fpsHistory,
    frameTimeHistory
  } = useSystemTelemetry();

  // Load persistent configuration
  const [config, setConfig] = useState<HUDConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse HUD config from localStorage', e);
    }
    return DEFAULT_CONFIG;
  });

  // Local interaction states
  const [isDragging, setIsDragging] = useState(false);
  const [isPurgingRAM, setIsPurgingRAM] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  
  const hudRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0
  });

  // Save config changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save HUD config', e);
    }
  }, [config]);

  // Global Keyboard shortcut: Alt+P or F3 to toggle visibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'p') || e.key === 'F3') {
        e.preventDefault();
        setConfig(prev => ({ ...prev, isVisible: !prev.isVisible }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dragging logic
  const handleDragStart = (e: React.MouseEvent) => {
    if (config.pinned) return;
    setIsDragging(true);
    const rect = hudRef.current?.getBoundingClientRect();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: rect?.left || config.customX,
      initY: rect?.top || config.customY
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      const newX = Math.max(10, Math.min(window.innerWidth - 240, dragStartRef.current.initX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 80, dragStartRef.current.initY + dy));
      
      setConfig(prev => ({
        ...prev,
        position: 'custom',
        customX: newX,
        customY: newY
      }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Open Full Monitor
  const handleOpenSystemMonitor = () => {
    if (onOpenFullMonitor) {
      onOpenFullMonitor();
    } else if (onSelectTool) {
      onSelectTool('SystemResourceMonitor');
    } else {
      window.dispatchEvent(new CustomEvent('switch-tool', { detail: 'SystemResourceMonitor' }));
    }
  };

  // Quick Memory Purge simulation
  const handleQuickPurgeRAM = () => {
    setIsPurgingRAM(true);
    setTimeout(() => {
      setIsPurgingRAM(false);
      setPurgeSuccess(true);
      setTimeout(() => setPurgeSuccess(false), 2500);
    }, 800);
  };

  // Sparkline renderer
  const renderSparkline = (data: number[], color: string, width = 64, height = 16, max = 100) => {
    if (!data || data.length === 0) return null;
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = Math.max(1, Math.min(height - 1, height - ((val / max) * height)));
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="opacity-90 shrink-0">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  // Position CSS mapping
  const positionStyles = useMemo((): React.CSSProperties => {
    if (config.position === 'custom') {
      return {
        top: `${config.customY}px`,
        left: `${config.customX}px`
      };
    }
    switch (config.position) {
      case 'top-left':
        return { top: '56px', left: '16px' };
      case 'bottom-left':
        return { bottom: '24px', left: '16px' };
      case 'bottom-right':
        return { bottom: '24px', right: '16px' };
      case 'top-right':
      default:
        return { top: '56px', right: '16px' };
    }
  }, [config.position, config.customX, config.customY]);

  // FPS Color logic
  const getFpsColor = (fps: number) => {
    if (fps >= 100) return 'text-emerald-400';
    if (fps >= 60) return 'text-cyan-400';
    if (fps >= 30) return 'text-amber-400';
    return 'text-rose-400 animate-pulse';
  };

  if (!config.isVisible) {
    return (
      <button
        onClick={() => setConfig(prev => ({ ...prev, isVisible: true }))}
        className="fixed top-14 right-4 z-40 bg-[#161b22]/80 hover:bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white px-2 py-1 rounded-md text-[10px] font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all cursor-pointer"
        title="Show Engine Performance HUD (Alt + P / F3)"
      >
        <Activity size={12} className="text-[#3fb950]" />
        <span>HUD</span>
      </button>
    );
  }

  return (
    <div
      ref={hudRef}
      style={{
        ...positionStyles,
        opacity: config.opacity / 100
      }}
      className={`fixed z-[9998] font-mono select-none transition-opacity duration-150 backdrop-blur-xl border rounded-xl shadow-2xl text-white ${
        config.mode === 'pill'
          ? 'bg-[#090d13]/95 border-[#30363d] px-3 py-1.5 min-w-[280px]'
          : config.mode === 'compact'
          ? 'bg-[#090d13]/95 border-[#30363d] p-3 w-[240px]'
          : 'bg-[#090d13]/98 border-[#58a6ff]/40 p-3.5 w-[330px]'
      }`}
    >
      {/* HUD Header Bar */}
      <div
        onMouseDown={handleDragStart}
        className={`flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#30363d]/60 ${
          config.pinned ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
        }`}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <Activity size={13} className="text-emerald-400 animate-pulse" />
          <span className="text-[#c9d1d9] tracking-wider text-[10px]">ENGINE HUD</span>
          <span className={`text-[10px] font-bold ${getFpsColor(stats.fps)}`}>
            {stats.fps} <span className="text-[8.5px] font-normal text-[#8b949e]">FPS</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Resource Throttling Quick Toggle */}
          <ResourceThrottlingHUDControl variant="header-toggle" />

          {/* Mode Switcher */}
          <button
            onClick={() =>
              setConfig(prev => ({
                ...prev,
                mode: prev.mode === 'pill' ? 'compact' : prev.mode === 'compact' ? 'expanded' : 'pill'
              }))
            }
            className="p-1 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#58a6ff] transition-colors cursor-pointer"
            title={`Current: ${config.mode.toUpperCase()} (Click to toggle modes)`}
          >
            {config.mode === 'expanded' ? (
              <Minimize2 size={11} />
            ) : (
              <Maximize2 size={11} />
            )}
          </button>

          {/* Quick Open System Resource Monitor */}
          <button
            onClick={handleOpenSystemMonitor}
            className="p-1 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-emerald-400 transition-colors cursor-pointer"
            title="Open Full System Resource Monitor Dashboard"
          >
            <ExternalLink size={11} />
          </button>

          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettingsPopover(!showSettingsPopover)}
            className={`p-1 rounded hover:bg-[#21262d] transition-colors cursor-pointer ${
              showSettingsPopover ? 'text-[#58a6ff] bg-[#58a6ff]/15' : 'text-[#8b949e] hover:text-white'
            }`}
            title="HUD Overlay Settings"
          >
            <Settings size={11} />
          </button>

          {/* Close HUD */}
          <button
            onClick={() => setConfig(prev => ({ ...prev, isVisible: false }))}
            className="p-1 rounded hover:bg-rose-500/20 text-[#8b949e] hover:text-rose-400 transition-colors cursor-pointer"
            title="Hide HUD (Alt + P / F3)"
          >
            <X size={11} />
          </button>
        </div>
      </div>

      {/* Settings Popover Dropdown */}
      {showSettingsPopover && (
        <div className="mb-2.5 p-2 bg-[#161b22] border border-[#30363d] rounded-lg text-[10px] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#8b949e]">Dock Position:</span>
            <select
              value={config.position}
              onChange={e => setConfig(prev => ({ ...prev, position: e.target.value as HUDPosition }))}
              className="bg-[#0d1117] border border-[#30363d] rounded px-1.5 py-0.5 text-white text-[9.5px] focus:outline-none"
            >
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="custom">Free Drag</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8b949e]">Opacity ({config.opacity}%):</span>
            <input
              type="range"
              min="30"
              max="100"
              value={config.opacity}
              onChange={e => setConfig(prev => ({ ...prev, opacity: Number(e.target.value) }))}
              className="w-20 accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8b949e]">Lock Position:</span>
            <button
              onClick={() => setConfig(prev => ({ ...prev, pinned: !prev.pinned }))}
              className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                config.pinned ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-[#21262d] text-[#8b949e]'
              }`}
            >
              {config.pinned ? 'Pinned (Locked)' : 'Draggable'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#30363d]/60">
            <span className="text-[#8b949e]">Resource Throttle:</span>
            <button
              onClick={() => ResourceThrottlingControllerNode.getInstance().toggleThrottling()}
              className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-colors ${
                stats.isThrottled
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-[#21262d] text-[#8b949e] hover:text-white'
              }`}
            >
              {stats.isThrottled ? `Cap Active (≤${stats.throttlingCpuCap ?? 50}%)` : 'Disabled (Full Power)'}
            </button>
          </div>
        </div>
      )}

      {/* 1. PILL MODE */}
      {config.mode === 'pill' && (
        <div className="flex items-center justify-between gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-[#58a6ff]">
            <Cpu size={11} /> {stats.cpu.toFixed(0)}%
          </span>
          <span className="flex items-center gap-1 text-[#bc8cff]">
            <Box size={11} /> {stats.gpu.toFixed(0)}%
          </span>
          <span className="flex items-center gap-1 text-[#3fb950]">
            <HardDrive size={11} /> {stats.ram.toFixed(0)}%
          </span>
          {stats.isThrottled && (
            <span className="px-1 py-0.2 rounded text-[8px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
              CAP ≤{stats.throttlingCpuCap}%
            </span>
          )}
          <span className="text-[#8b949e] text-[9px]">
            {stats.frameTime.toFixed(1)}ms
          </span>
        </div>
      )}

      {/* 2. COMPACT MODE (Standard Engine Overlay) */}
      {config.mode === 'compact' && (
        <div className="space-y-2 text-[11px]">
          {/* CPU Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-[70px]">
              <Cpu size={12} className="text-[#58a6ff]" />
              <span className="text-[#8b949e] text-[10px]">CPU</span>
              <span className="text-white font-bold">{stats.cpu.toFixed(0)}%</span>
            </div>
            {renderSparkline(cpuHistory, '#58a6ff', 70, 14)}
            <span className="text-[9.5px] text-[#8b949e] w-10 text-right">{stats.cpuTemp}°C</span>
          </div>

          {/* GPU Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-[70px]">
              <Box size={12} className="text-[#bc8cff]" />
              <span className="text-[#8b949e] text-[10px]">GPU</span>
              <span className="text-white font-bold">{stats.gpu.toFixed(0)}%</span>
            </div>
            {renderSparkline(gpuHistory, '#bc8cff', 70, 14)}
            <span className="text-[9.5px] text-[#8b949e] w-10 text-right">{stats.gpuTemp}°C</span>
          </div>

          {/* RAM Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-[70px]">
              <HardDrive size={12} className="text-[#3fb950]" />
              <span className="text-[#8b949e] text-[10px]">RAM</span>
              <span className="text-white font-bold">{stats.ram.toFixed(0)}%</span>
            </div>
            {renderSparkline(ramHistory, '#3fb950', 70, 14)}
            <span className="text-[9.5px] text-[#8b949e] w-10 text-right">{stats.ramUsedGB}G</span>
          </div>

          {/* Resource Throttling Compact Chip Control */}
          <ResourceThrottlingHUDControl variant="compact-chip" />

          {/* Secondary Stats Row */}
          <div className="pt-1.5 border-t border-[#30363d]/50 flex items-center justify-between text-[9px] text-[#8b949e]">
            <span>Frame: <strong className="text-white">{stats.frameTime}ms</strong></span>
            <span>Draws: <strong className="text-[#79c0ff]">{stats.drawCalls}</strong></span>
            <button
              onClick={handleQuickPurgeRAM}
              disabled={isPurgingRAM}
              className="text-[#3fb950] hover:text-[#56d364] flex items-center gap-1 cursor-pointer"
              title="Trigger Instant GC Memory Flush"
            >
              <Trash2 size={9} />
              <span>{isPurgingRAM ? 'Flushing...' : purgeSuccess ? 'Cleaned!' : 'GC'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. EXPANDED MODE (Full In-Game Telemetry Matrix) */}
      {config.mode === 'expanded' && (
        <div className="space-y-2.5 text-[11px]">
          {/* Primary Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* CPU Block */}
            <div className="p-2 bg-[#0d1117] border border-[#30363d] rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1 text-[10px] text-[#58a6ff] font-bold">
                  <Cpu size={11} /> CPU LOAD
                </span>
                <span className="text-[10px] text-white font-bold">{stats.cpu.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden mb-1.5">
                <div
                  className="bg-[#58a6ff] h-full rounded-full transition-all duration-300"
                  style={{ width: `${stats.cpu}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[9px] text-[#8b949e]">
                <span>{stats.cpuClock} GHz</span>
                <span className="text-amber-400">{stats.cpuTemp}°C</span>
              </div>
            </div>

            {/* GPU Block */}
            <div className="p-2 bg-[#0d1117] border border-[#30363d] rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1 text-[10px] text-[#bc8cff] font-bold">
                  <Box size={11} /> GPU LOAD
                </span>
                <span className="text-[10px] text-white font-bold">{stats.gpu.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden mb-1.5">
                <div
                  className="bg-[#bc8cff] h-full rounded-full transition-all duration-300"
                  style={{ width: `${stats.gpu}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[9px] text-[#8b949e]">
                <span>{stats.gpuClock} MHz</span>
                <span className="text-amber-400">{stats.gpuTemp}°C</span>
              </div>
            </div>
          </div>

          {/* Memory Section (RAM + VRAM) */}
          <div className="p-2 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-1 text-[#3fb950] font-semibold">
                <HardDrive size={10} /> SYSTEM RAM
              </span>
              <span className="text-white font-bold">{stats.ramUsedGB} / {stats.ramTotalGB} GB ({stats.ram.toFixed(0)}%)</span>
            </div>
            <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#3fb950] h-full rounded-full transition-all duration-300"
                style={{ width: `${stats.ram}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] pt-1">
              <span className="flex items-center gap-1 text-[#a371f7] font-semibold">
                <Layers size={10} /> VIDEO VRAM
              </span>
              <span className="text-white font-bold">{stats.vramUsedGB} / {stats.vramTotalGB} GB ({stats.vram.toFixed(0)}%)</span>
            </div>
            <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#a371f7] h-full rounded-full transition-all duration-300"
                style={{ width: `${stats.vram}%` }}
              />
            </div>
          </div>

          {/* Resource Throttling Control Panel */}
          <ResourceThrottlingHUDControl variant="expanded-panel" />

          {/* 16-Core Thread Micro Distribution */}
          <div className="p-2 bg-[#0d1117] border border-[#30363d] rounded-lg">
            <div className="flex items-center justify-between text-[9px] text-[#8b949e] mb-1">
              <span>16-THREAD DISTRIBUTION</span>
              <span>Physics / Render Cores</span>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {threadLoads.map((load, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="w-full bg-[#21262d] h-5 rounded flex flex-col justify-end p-0.5">
                    <div
                      className={`w-full rounded-sm ${
                        load > 85 ? 'bg-rose-500' : load > 60 ? 'bg-amber-400' : 'bg-[#58a6ff]'
                      }`}
                      style={{ height: `${Math.max(10, Math.min(100, load))}%` }}
                    />
                  </div>
                  <span className="text-[7.5px] text-[#8b949e]">T{i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Engine Stats */}
          <div className="grid grid-cols-3 gap-1 text-[9px] text-center bg-[#0d1117] p-1.5 rounded-lg border border-[#30363d]">
            <div>
              <span className="text-[#8b949e] block">DRAW CALLS</span>
              <span className="text-[#58a6ff] font-bold">{stats.drawCalls}</span>
            </div>
            <div>
              <span className="text-[#8b949e] block">TRIANGLES</span>
              <span className="text-[#3fb950] font-bold">{(stats.triangles / 1000000).toFixed(2)}M</span>
            </div>
            <div>
              <span className="text-[#8b949e] block">JS HEAP</span>
              <span className="text-[#bc8cff] font-bold">{stats.heapUsedMB} MB</span>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between pt-1 gap-1.5">
            <button
              onClick={handleQuickPurgeRAM}
              disabled={isPurgingRAM}
              className={`flex-1 py-1 px-2 rounded text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                purgeSuccess
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border-[#30363d]'
              }`}
            >
              <Trash2 size={11} className={isPurgingRAM ? 'animate-spin' : ''} />
              <span>{isPurgingRAM ? 'Purging GC...' : purgeSuccess ? 'RAM Purged!' : 'Purge Memory'}</span>
            </button>

            <button
              onClick={handleOpenSystemMonitor}
              className="py-1 px-2.5 rounded text-[10px] font-semibold bg-[#238636] hover:bg-[#2ea043] text-white flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <ExternalLink size={11} />
              <span>Full Monitor</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
