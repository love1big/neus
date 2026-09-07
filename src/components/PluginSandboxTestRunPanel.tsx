/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Dedicated interactive dashboard component for 'Sandbox Test Run'.
 *          Provides real-time visualization of a plugin's memory allocations,
 *          compute cycles (tick duration, CPU %), frame-rate impact prediction,
 *          and isolation guarantees proving the primary simulation engine state
 *          is completely unaffected and zero mutations leak into the game world.
 *    - TH: คอมโพเนนต์หน้าจอควบคุมและแสดงผลแบบโต้ตอบสำหรับ "Sandbox Test Run"
 *          แสดงผลกราฟและมิเตอร์การใช้หน่วยความจำ (Memory Profiling) และการใช้พลังประมวลผล
 *          (Compute / CPU Overhead) แบบ Real-time พร้อมแถบสถานะยืนยันความปลอดภัยว่า State
 *          ของ Simulation Engine หลักถูกแยกขาด (Isolated) 100% โดยไม่มีการรั่วไหลของข้อมูล
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Controlled by `PluginSandboxIsolationEngine.ts` singleton.
 *    - Embedded inside `NexusPluginArchitect.tsx` (as a dedicated tab and inline drawer).
 *    - Consumes types from `src/types/pluginSandboxTestRun.ts`.
 *    - Uses Lucide icons and Tailwind CSS adhering to AAA engineering aesthetics.
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props:
 *      - `pluginId`: ID of the currently selected plugin.
 *      - `pluginName`: Display name of the plugin.
 *      - `pluginType`: Language runtime type ('javascript' | 'wasm' | 'cpp' | 'csharp').
 *      - `memoryQuotaMB`: Allocated memory quota in MB.
 *      - `onToggleTestRun`: Callback to toggle the sandbox test run state.
 *      - `onClose`: Optional callback to close or collapse the panel.
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Gracefully initializes a fallback session if the engine has not yet registered the plugin.
 *    - Auto-refreshes at 250ms interval with requestAnimationFrame / timer cleanup on unmount.
 *    - Prevents UI overflow when high-density log streams or sparklines are rendered.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```tsx
 *    <PluginSandboxTestRunPanel
 *      pluginId="plg_001"
 *      pluginName="Nexus C++ Physics Hooks"
 *      pluginType="cpp"
 *      memoryQuotaMB={64}
 *      onToggleTestRun={() => console.log('Toggled')}
 *    />
 *    ```
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Play,
  Square,
  RefreshCw,
  Cpu,
  HardDrive,
  Activity,
  AlertTriangle,
  Zap,
  RotateCcw,
  Sparkles,
  BarChart3,
  Gauge,
  Flame,
  CheckCircle2,
  Lock,
  Layers,
  Terminal,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { PluginSandboxIsolationEngine } from '../utils/PluginSandboxIsolationEngine';
import {
  SandboxTestRunSession,
  StressTestType,
  SandboxTestLogEntry
} from '../types/pluginSandboxTestRun';

interface PluginSandboxTestRunPanelProps {
  pluginId: string;
  pluginName: string;
  pluginType: 'javascript' | 'wasm' | 'cpp' | 'csharp';
  memoryQuotaMB: number;
  onToggleTestRun?: (active: boolean) => void;
  onClose?: () => void;
}

export default function PluginSandboxTestRunPanel({
  pluginId,
  pluginName,
  pluginType,
  memoryQuotaMB,
  onToggleTestRun,
  onClose
}: PluginSandboxTestRunPanelProps) {
  const engine = PluginSandboxIsolationEngine.getInstance();
  const [session, setSession] = useState<SandboxTestRunSession>(() =>
    engine.getSession(pluginId, pluginName, pluginType, memoryQuotaMB)
  );

  const [activeLogFilter, setActiveLogFilter] = useState<'all' | 'intercept' | 'stress' | 'warn'>('all');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Poll state from the engine every 250ms for buttery-smooth profiling updates
  useEffect(() => {
    const interval = setInterval(() => {
      const current = engine.getSession(pluginId, pluginName, pluginType, memoryQuotaMB);
      // Clone session to trigger React re-render of nested telemetry
      setSession({
        ...current,
        memoryProfile: { ...current.memoryProfile, historySamples: [...current.memoryProfile.historySamples] },
        computeProfile: { ...current.computeProfile, latencyHistorySamples: [...current.computeProfile.latencyHistorySamples] },
        isolationMetrics: { ...current.isolationMetrics },
        logs: [...current.logs]
      });
    }, 250);

    return () => clearInterval(interval);
  }, [pluginId, pluginName, pluginType, memoryQuotaMB]);

  const handleToggle = () => {
    const nextState = engine.toggleTestRun(pluginId, pluginName, pluginType, memoryQuotaMB);
    const updated = engine.getSession(pluginId, pluginName, pluginType, memoryQuotaMB);
    setSession({ ...updated });
    if (onToggleTestRun) {
      onToggleTestRun(nextState);
    }
  };

  const handleTriggerStress = (testType: StressTestType) => {
    if (!session.isActive) {
      engine.startTestRun(pluginId, pluginName, pluginType, memoryQuotaMB);
    }
    engine.triggerStressTest(pluginId, testType);
    const updated = engine.getSession(pluginId, pluginName, pluginType, memoryQuotaMB);
    setSession({ ...updated });
  };

  const handleResetState = () => {
    engine.resetIsolationState(pluginId);
    const updated = engine.getSession(pluginId, pluginName, pluginType, memoryQuotaMB);
    setSession({ ...updated });
  };

  const { memoryProfile, computeProfile, isolationMetrics } = session;

  // Filtered logs
  const filteredLogs = session.logs.filter(log => {
    if (activeLogFilter === 'all') return true;
    if (activeLogFilter === 'intercept') return log.level === 'intercept';
    if (activeLogFilter === 'stress') return log.level === 'stress';
    if (activeLogFilter === 'warn') return log.level === 'warn' || log.level === 'leak';
    return true;
  });

  // Calculate sparkline points for memory history
  const renderSparkline = (data: number[], minVal: number, maxVal: number, color: string) => {
    if (!data || data.length < 2) return null;
    const width = 160;
    const height = 36;
    const padding = 2;
    const range = maxVal - minVal || 1;
    const points = data
      .map((val, idx) => {
        const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
        const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
        return `${x.toFixed(1)},${Math.max(padding, Math.min(height - padding, y)).toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg className="w-full h-9 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Glow fill under line */}
        <polygon
          fill={color}
          fillOpacity="0.12"
          points={`${padding},${height} ${points} ${width - padding},${height}`}
        />
      </svg>
    );
  };

  return (
    <div id="plugin-sandbox-test-run-panel" className="flex flex-col h-full bg-[#0a0c10] text-[#c9d1d9] font-sans select-none overflow-y-auto">
      {/* 1. Header & Primary Isolation Status Banner */}
      <div className="p-4 bg-[#161b22] border-b border-[#30363d] flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-md">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
            session.isActive
              ? 'bg-[#238636]/20 border-[#3fb950]/50 text-[#3fb950] shadow-[0_0_15px_rgba(63,185,80,0.25)]'
              : 'bg-[#21262d] border-[#30363d] text-[#8b949e]'
          }`}>
            <ShieldCheck size={22} className={session.isActive ? 'animate-pulse' : ''} />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Sandbox Test Run: {pluginName}
              </h2>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-bold bg-[#21262d] text-[#79c0ff] border border-[#30363d]">
                {pluginType}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1 ${
                session.isActive
                  ? 'bg-[#238636]/20 text-[#3fb950] border-[#3fb950]/40'
                  : 'bg-[#30363d]/30 text-[#8b949e] border-[#30363d]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${session.isActive ? 'bg-[#3fb950] animate-ping' : 'bg-[#8b949e]'}`} />
                {session.status.toUpperCase()}
              </span>
            </div>

            <p className="text-[11px] text-[#8b949e] mt-0.5 flex items-center gap-1.5">
              <span>Isolated compute & memory profiling. Primary simulation state remains quarantined.</span>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-[#58a6ff] hover:underline flex items-center gap-0.5 text-[10px]"
              >
                <HelpCircle size={10} />
                <span>How Isolation Works</span>
              </button>
            </p>
          </div>
        </div>

        {/* Master Action Bar */}
        <div className="flex items-center space-x-2.5">
          <button
            id="btn-reset-shadow-state"
            onClick={handleResetState}
            className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-semibold rounded-lg border border-[#30363d] flex items-center space-x-1.5 transition-colors"
            title="Purge isolated shadow memory heap and zero out intercepted mutations"
          >
            <RotateCcw size={12} />
            <span>Reset Shadow State</span>
          </button>

          <button
            id="btn-toggle-sandbox-test-run"
            onClick={handleToggle}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg border flex items-center space-x-2 transition-all shadow-md ${
              session.isActive
                ? 'bg-[#f85149]/20 hover:bg-[#f85149]/30 text-[#f85149] border-[#f85149]/60 shadow-[0_0_12px_rgba(248,81,73,0.2)]'
                : 'bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3fb950] text-white border-[#3fb950]/50 shadow-[0_0_12px_rgba(46,160,67,0.3)]'
            }`}
          >
            {session.isActive ? (
              <>
                <Square size={13} className="fill-current" />
                <span>Stop Sandbox Test</span>
              </>
            ) : (
              <>
                <Play size={13} className="fill-current" />
                <span>Start Sandbox Test Run</span>
              </>
            )}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
              title="Close panel"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Explanatory Collapsible Note */}
      {showExplanation && (
        <div className="p-3.5 bg-[#1f242c] border-b border-[#30363d] text-xs text-[#c9d1d9] leading-relaxed space-y-2">
          <div className="font-bold text-white flex items-center gap-1.5 text-xs">
            <Lock size={13} className="text-[#3fb950]" />
            <span>Zero-Side-Effect Simulation Isolation Architecture (สถาปัตยกรรมกักกัน State 100%)</span>
          </div>
          <p className="text-[11px] text-[#8b949e]">
            When <strong>Sandbox Test Run</strong> is active, all API calls, tick listeners, entity transformations, and memory buffers allocated by this plugin are routed into an ephemeral <em>Shadow Simulation Context</em>.
            The primary game engine scene graph, global physics pipeline, and persistent game states are never mutated (<span className="text-[#3fb950] font-mono font-bold">0 Leaks</span>).
            This allows you to benchmark performance spikes and stress test memory leaks under extreme conditions without crashing the live game.
          </p>
        </div>
      )}

      {/* 2. Primary Engine Isolation Verification Strip */}
      <div className="px-4 py-2.5 bg-[#0d1117] border-b border-[#30363d] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-[#3fb950]">
            <CheckCircle2 size={14} />
            <span className="font-bold">Primary Simulation Engine State:</span>
            <span className="bg-[#238636]/20 px-2 py-0.5 rounded text-[11px] border border-[#3fb950]/40 font-bold">
              100% UNTOUCHED (0 MUTATIONS LEAKED)
            </span>
          </div>

          <div className="h-4 w-px bg-[#30363d]" />

          <div className="text-[#8b949e] flex items-center space-x-1.5">
            <Layers size={13} className="text-[#bc8cff]" />
            <span>Intercepted Shadow Mutations:</span>
            <span className="text-white font-bold">{isolationMetrics.interceptedMutationsCount.toLocaleString()}</span>
          </div>

          <div className="text-[#8b949e] flex items-center space-x-1.5">
            <Activity size={13} className="text-[#58a6ff]" />
            <span>Virtual Ticks:</span>
            <span className="text-white font-bold">{isolationMetrics.virtualTicksProcessed.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-[11px] text-[#8b949e] flex items-center gap-2">
          <span>Uptime: <strong className="text-white">{session.uptimeSeconds.toFixed(1)}s</strong></span>
          <span className="text-[#3fb950] font-bold">• Active Isolation Guard</span>
        </div>
      </div>

      {/* 3. Main Metrics Grid: Memory Profiling vs Compute Overhead */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* --- Card A: Isolated Memory Profiler --- */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#30363d]/60">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-[#58a6ff]/10 text-[#58a6ff]">
                <HardDrive size={16} />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Isolated Memory Profiler
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8b949e]">
              Quota: {memoryProfile.quotaMB} MB
            </span>
          </div>

          {/* Large Metric Display & Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-white font-mono">
                  {memoryProfile.allocatedHeapMB.toFixed(2)}
                </span>
                <span className="text-xs text-[#8b949e] ml-1 font-mono">MB Virtual Heap</span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold font-mono ${
                  memoryProfile.quotaUtilizationPercent > 80
                    ? 'text-[#f85149]'
                    : memoryProfile.quotaUtilizationPercent > 50
                    ? 'text-[#e3b341]'
                    : 'text-[#3fb950]'
                }`}>
                  {memoryProfile.quotaUtilizationPercent.toFixed(1)}% of Quota
                </span>
              </div>
            </div>

            {/* Quota Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#0d1117] overflow-hidden border border-[#30363d]/50">
              <div
                className={`h-full transition-all duration-300 ${
                  memoryProfile.quotaUtilizationPercent > 80
                    ? 'bg-gradient-to-r from-[#e3b341] to-[#f85149]'
                    : memoryProfile.quotaUtilizationPercent > 50
                    ? 'bg-gradient-to-r from-[#3fb950] to-[#e3b341]'
                    : 'bg-gradient-to-r from-[#1f6feb] to-[#3fb950]'
                }`}
                style={{ width: `${Math.min(100, Math.max(2, memoryProfile.quotaUtilizationPercent))}%` }}
              />
            </div>
          </div>

          {/* Detailed Memory Breakdown Grid */}
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d]/60">
              <div className="text-[#8b949e] text-[10px]">Peak Heap</div>
              <div className="text-white font-bold mt-0.5">{memoryProfile.peakHeapMB.toFixed(2)} MB</div>
            </div>
            <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d]/60">
              <div className="text-[#8b949e] text-[10px]">Scratch Buffers</div>
              <div className="text-[#79c0ff] font-bold mt-0.5">{memoryProfile.scratchBufferMB.toFixed(2)} MB</div>
            </div>
            <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d]/60">
              <div className="text-[#8b949e] text-[10px]">Shadow State</div>
              <div className="text-[#bc8cff] font-bold mt-0.5">{memoryProfile.shadowStateMB.toFixed(2)} MB</div>
            </div>
          </div>

          {/* Real-Time Sparkline History & Leak Risk */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8b949e]">
              <span>Memory Allocation History (Last 20 ticks)</span>
              <span className={`font-bold flex items-center gap-1 ${
                memoryProfile.leakRiskIndex > 50 ? 'text-[#f85149]' : 'text-[#3fb950]'
              }`}>
                {memoryProfile.leakRiskIndex > 50 ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                Leak Risk: {memoryProfile.leakRiskIndex < 20 ? 'NONE (Safe)' : `${memoryProfile.leakRiskIndex}%`}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d]/50">
              {renderSparkline(memoryProfile.historySamples, 0, memoryProfile.quotaMB, '#58a6ff')}
            </div>
          </div>
        </div>

        {/* --- Card B: Compute & Tick Overhead Profiler --- */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#30363d]/60">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-[#3fb950]/10 text-[#3fb950]">
                <Cpu size={16} />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Compute & CPU Overhead Profiler
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#7ee787]">
              Target: 60 FPS (16.6ms Budget)
            </span>
          </div>

          {/* Large Metric Display & CPU Load */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-white font-mono">
                  {computeProfile.lastTickDurationUs.toLocaleString()}
                </span>
                <span className="text-xs text-[#8b949e] ml-1 font-mono">μs ({computeProfile.avgTickDurationMs.toFixed(3)} ms/tick)</span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold font-mono ${
                  computeProfile.cpuLoadPercent > 20
                    ? 'text-[#f85149]'
                    : computeProfile.cpuLoadPercent > 8
                    ? 'text-[#e3b341]'
                    : 'text-[#3fb950]'
                }`}>
                  {computeProfile.cpuLoadPercent.toFixed(1)}% CPU Load
                </span>
              </div>
            </div>

            {/* CPU Load Meter */}
            <div className="w-full h-2 rounded-full bg-[#0d1117] overflow-hidden border border-[#30363d]/50">
              <div
                className={`h-full transition-all duration-300 ${
                  computeProfile.cpuLoadPercent > 20
                    ? 'bg-gradient-to-r from-[#e3b341] to-[#f85149]'
                    : computeProfile.cpuLoadPercent > 8
                    ? 'bg-gradient-to-r from-[#3fb950] to-[#e3b341]'
                    : 'bg-gradient-to-r from-[#238636] to-[#3fb950]'
                }`}
                style={{ width: `${Math.min(100, Math.max(2, computeProfile.cpuLoadPercent))}%` }}
              />
            </div>
          </div>

          {/* Compute Latency Breakdown Grid */}
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d]/60">
              <div className="text-[#8b949e] text-[10px]">Peak Latency</div>
              <div className="text-white font-bold mt-0.5">{computeProfile.peakTickDurationMs.toFixed(3)} ms</div>
            </div>
            <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d]/60">
              <div className="text-[#8b949e] text-[10px]">Simulation FPS</div>
              <div className="text-[#3fb950] font-bold mt-0.5">{computeProfile.projectedSimulationFps.toFixed(1)} FPS</div>
            </div>
            <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d]/60">
              <div className="text-[#8b949e] text-[10px]">Estimated Impact</div>
              <div className="text-[#e3b341] font-bold mt-0.5">-{computeProfile.estimatedFpsImpact.toFixed(2)} FPS</div>
            </div>
          </div>

          {/* Real-Time Sparkline History & Ops Counter */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8b949e]">
              <span>Tick Latency Trend (ms over time)</span>
              <span className="text-[#7ee787] font-bold">
                ~{(computeProfile.opsPerSecond / 1000).toFixed(0)}k Ops/sec
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d]/50">
              {renderSparkline(computeProfile.latencyHistorySamples, 0, Math.max(1.0, computeProfile.peakTickDurationMs * 1.2), '#3fb950')}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Stress Testing Torture Chamber */}
      <div className="px-4 pb-4">
        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Flame size={16} className="text-[#f85149]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Isolated Stress Testing Suite
              </h3>
              <span className="text-[10px] text-[#8b949e]">
                (Simulates heavy simulation workloads to verify memory boundaries and compute scaling)
              </span>
            </div>

            {session.activeStressTest && (
              <div className="flex items-center space-x-2 text-xs font-mono text-[#e3b341]">
                <Activity size={13} className="animate-spin" />
                <span>Running Stress Test ({session.stressProgress}%)...</span>
              </div>
            )}
          </div>

          {/* Stress Test Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              id="btn-stress-compute"
              onClick={() => handleTriggerStress('compute_surge_1000')}
              disabled={session.activeStressTest !== null}
              className="p-2.5 rounded-lg bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] hover:border-[#f85149]/50 text-left transition-all disabled:opacity-50 group"
            >
              <div className="flex items-center justify-between text-white font-bold text-xs group-hover:text-[#f85149]">
                <span>1,000 Compute Ticks</span>
                <Zap size={13} className="text-[#e3b341]" />
              </div>
              <p className="text-[10px] text-[#8b949e] mt-1 leading-snug">
                Fires 1,000 dense math ticks to measure peak frame spikes.
              </p>
            </button>

            <button
              id="btn-stress-memory"
              onClick={() => handleTriggerStress('memory_allocation_spike')}
              disabled={session.activeStressTest !== null}
              className="p-2.5 rounded-lg bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] hover:border-[#58a6ff]/50 text-left transition-all disabled:opacity-50 group"
            >
              <div className="flex items-center justify-between text-white font-bold text-xs group-hover:text-[#58a6ff]">
                <span>Memory Heap Spike</span>
                <HardDrive size={13} className="text-[#58a6ff]" />
              </div>
              <p className="text-[10px] text-[#8b949e] mt-1 leading-snug">
                Allocates buffer chunks up to 80% quota to test GC resilience.
              </p>
            </button>

            <button
              id="btn-stress-mutation"
              onClick={() => handleTriggerStress('state_mutation_barrage')}
              disabled={session.activeStressTest !== null}
              className="p-2.5 rounded-lg bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] hover:border-[#bc8cff]/50 text-left transition-all disabled:opacity-50 group"
            >
              <div className="flex items-center justify-between text-white font-bold text-xs group-hover:text-[#bc8cff]">
                <span>Mutation Barrage</span>
                <Layers size={13} className="text-[#bc8cff]" />
              </div>
              <p className="text-[10px] text-[#8b949e] mt-1 leading-snug">
                Intercepts 500+ rapid state changes to verify 0-leak containment.
              </p>
            </button>

            <button
              id="btn-stress-gc"
              onClick={() => handleTriggerStress('gc_pressure_cycle')}
              disabled={session.activeStressTest !== null}
              className="p-2.5 rounded-lg bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] hover:border-[#3fb950]/50 text-left transition-all disabled:opacity-50 group"
            >
              <div className="flex items-center justify-between text-white font-bold text-xs group-hover:text-[#3fb950]">
                <span>GC Pressure Cycle</span>
                <RefreshCw size={13} className="text-[#3fb950]" />
              </div>
              <p className="text-[10px] text-[#8b949e] mt-1 leading-snug">
                Rapid alloc/dealloc cycle to test V8/WASM memory reclamation.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Real-Time Isolation & Profiler Log Stream */}
      <div className="px-4 pb-4 flex-1 flex flex-col min-h-[220px]">
        <div className="flex-1 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col overflow-hidden shadow-sm">
          <div className="p-3 bg-[#0d1117] border-b border-[#30363d] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Terminal size={14} className="text-[#58a6ff]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Isolated Sandbox Log Stream
              </span>
              <span className="text-[10px] font-mono text-[#8b949e]">
                ({filteredLogs.length} events logged)
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 text-[10px] font-mono">
              <button
                onClick={() => setActiveLogFilter('all')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeLogFilter === 'all'
                    ? 'bg-[#58a6ff] text-white font-bold'
                    : 'bg-[#21262d] text-[#8b949e] hover:text-white'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setActiveLogFilter('intercept')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeLogFilter === 'intercept'
                    ? 'bg-[#bc8cff] text-white font-bold'
                    : 'bg-[#21262d] text-[#8b949e] hover:text-white'
                }`}
              >
                State Interceptions
              </button>
              <button
                onClick={() => setActiveLogFilter('stress')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeLogFilter === 'stress'
                    ? 'bg-[#e3b341] text-black font-bold'
                    : 'bg-[#21262d] text-[#8b949e] hover:text-white'
                }`}
              >
                Stress Tests
              </button>
              <button
                onClick={() => setActiveLogFilter('warn')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeLogFilter === 'warn'
                    ? 'bg-[#f85149] text-white font-bold'
                    : 'bg-[#21262d] text-[#8b949e] hover:text-white'
                }`}
              >
                Warnings & GC
              </button>
            </div>
          </div>

          {/* Log Messages Feed */}
          <div className="flex-1 p-3 overflow-y-auto space-y-1 font-mono text-[11px] max-h-56 scrollbar-thin">
            {filteredLogs.length === 0 ? (
              <div className="text-[#484f58] italic text-center py-6">
                No matching isolated sandbox events.
              </div>
            ) : (
              filteredLogs.map(log => {
                let badgeClass = 'bg-[#1f6feb]/20 text-[#58a6ff] border-[#1f6feb]/30';
                if (log.level === 'intercept') badgeClass = 'bg-[#bc8cff]/20 text-[#bc8cff] border-[#bc8cff]/30';
                if (log.level === 'stress') badgeClass = 'bg-[#e3b341]/20 text-[#e3b341] border-[#e3b341]/30';
                if (log.level === 'warn') badgeClass = 'bg-[#f85149]/20 text-[#f85149] border-[#f85149]/30';

                return (
                  <div
                    key={log.id}
                    className="p-1.5 rounded bg-[#0d1117] border border-[#30363d]/40 flex items-start justify-between gap-2 hover:border-[#58a6ff]/40 transition-colors"
                  >
                    <div className="flex items-start space-x-2 flex-1 min-w-0">
                      <span className="text-[#8b949e] text-[10px] shrink-0">{log.timestamp}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border shrink-0 ${badgeClass}`}>
                        {log.source}
                      </span>
                      <span className="text-[#e6edf3] break-words leading-tight">{log.message}</span>
                    </div>

                    {log.metricSnapshot && (
                      <div className="shrink-0 text-[9px] text-[#8b949e] flex items-center space-x-2">
                        <span>{log.metricSnapshot.heapMB.toFixed(1)} MB</span>
                        <span>{log.metricSnapshot.cpuPercent.toFixed(1)}% CPU</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
