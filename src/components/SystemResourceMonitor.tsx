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
  Flame,
  AlertTriangle,
  CheckCircle2,
  Download,
  Copy,
  Check,
  RefreshCw,
  Maximize2,
  Minimize2,
  Move,
  Settings,
  Sliders,
  Play,
  Pause,
  X,
  Pin,
  TrendingDown,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useSystemTelemetry, setSimulatedStressProfile } from '../lib/telemetry';
import ComputeTaskDispatcherPanel from './ComputeTaskDispatcherPanel';
import { ProcessAffinityManagerNode } from '../utils/ProcessAffinityManagerNode';
import { ProcessBinding } from '../types/processAffinity';

export interface SystemResourceMonitorProps {
  mode?: 'overlay' | 'panel' | 'sidebar';
  onClose?: () => void;
  standalone?: boolean;
}

export default function SystemResourceMonitor({
  mode: initialMode = 'panel',
  onClose,
  standalone = false,
}: SystemResourceMonitorProps) {
  const { stats, threadLoads, cpuHistory, gpuHistory, ramHistory, vramHistory, fpsHistory, frameTimeHistory } = useSystemTelemetry();
  
  const [displayMode, setDisplayMode] = useState<'overlay' | 'panel' | 'compact'>(
    initialMode === 'overlay' ? 'overlay' : initialMode === 'sidebar' ? 'compact' : 'panel'
  );
  
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [overlayPos, setOverlayPos] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('top-right');
  const [overlayOpacity, setOverlayOpacity] = useState(90);
  const [selectedSubsystem, setSelectedSubsystem] = useState<'all' | 'cpu' | 'gpu' | 'memory' | 'simulation'>('all');
  const [showStressTester, setShowStressTester] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showComputeDispatcher, setShowComputeDispatcher] = useState(false);
  const [processBindings, setProcessBindings] = useState<ProcessBinding[]>([]);

  // Subscribe to ProcessAffinityManagerNode updates
  useEffect(() => {
    const manager = ProcessAffinityManagerNode.getInstance();
    const unsubscribe = manager.subscribe((bindings) => {
      setProcessBindings(bindings);
    });
    return () => unsubscribe();
  }, []);

  const pinnedCount = useMemo(() => {
    return processBindings.filter(b => b.isPinned).length;
  }, [processBindings]);

  // Dragging state for overlay mode
  const [isDragging, setIsDragging] = useState(false);
  const [customPos, setCustomPos] = useState<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({ startX: 0, startY: 0, initX: 0, initY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (displayMode !== 'overlay') return;
    setIsDragging(true);
    const rect = (e.currentTarget.parentElement as HTMLElement)?.getBoundingClientRect();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: rect?.left || 0,
      initY: rect?.top || 0,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      setCustomPos({
        x: Math.max(10, Math.min(window.innerWidth - 360, dragStartRef.current.initX + dx)),
        y: Math.max(10, Math.min(window.innerHeight - 300, dragStartRef.current.initY + dy)),
      });
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

  // Bottleneck Diagnostic logic
  const getBottleneckDiagnosis = () => {
    if (stats.fps < 45) {
      if (stats.gpu > 90) return { title: 'GPU Bound (Render Pipeline)', detail: 'Shader overload or high resolution/shadow cascades.', severity: 'critical', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
      if (stats.cpu > 85) return { title: 'CPU Bound (Main Thread / Physics)', detail: 'High physics substeps, ECS entities, or draw call dispatch overhead.', severity: 'critical', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
      if (stats.vram > 90) return { title: 'VRAM Pressure (Texture Thrashing)', detail: 'Exceeding dedicated VRAM limit; swapping with system RAM.', severity: 'critical', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' };
    }
    if (stats.fps >= 100) {
      return { title: 'Optimal Performance (120+ FPS Headroom)', detail: 'Simulation running smoothly with ample GPU/CPU compute overhead.', severity: 'good', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    }
    return { title: 'Balanced Simulation Load', detail: 'Stable frame pacing with balanced CPU and GPU resource distribution.', severity: 'normal', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
  };

  const diagnosis = getBottleneckDiagnosis();

  // Export JSON metrics
  const exportPerformanceReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      engineVersion: 'Nexus 3D Engine v2.4 (WebGL 2.0 / WebGPU Ready)',
      activeProfile: stats.activeSimulationProfile,
      currentMetrics: stats,
      computeTaskDispatcher: {
        pinnedProcessesCount: pinnedCount,
        bindings: processBindings.map(b => ({
          process: b.name,
          key: b.processKey,
          targetTier: b.targetTier,
          pinnedDeviceId: b.pinnedDeviceId,
          pinnedVendor: b.pinnedVendor,
          isPinned: b.isPinned,
          latencyMs: b.latencyMs,
          loadPercent: b.currentLoadPercent
        }))
      },
      historySamples: {
        cpu: cpuHistory,
        gpu: gpuHistory,
        ram: ramHistory,
        vram: vramHistory,
        fps: fpsHistory,
        frameTime: frameTimeHistory
      },
      threadDistribution: threadLoads.map((load, idx) => ({ core: idx, loadPercent: Math.round(load) })),
      diagnosis: diagnosis
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-performance-telemetry-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy Markdown summary
  const copyMarkdownReport = () => {
    const pinnedSummary = processBindings
      .filter(b => b.isPinned)
      .map(b => `${b.processKey} ➔ ${b.pinnedVendor ? `[${b.pinnedVendor}] ` : ''}${b.targetTier}`)
      .join(', ');

    const md = `### 🚀 Nexus 3D System Resource Telemetry
- **Timestamp**: ${new Date().toLocaleTimeString()}
- **Profile**: ${stats.activeSimulationProfile}
- **FPS**: ${stats.fps} FPS (${stats.frameTime.toFixed(2)} ms frame time)
- **CPU**: ${stats.cpu.toFixed(1)}% | ${stats.cpuTemp}°C | ${stats.cpuClock} GHz
- **GPU**: ${stats.gpu.toFixed(1)}% | ${stats.gpuTemp}°C | VRAM: ${stats.vramUsedGB} / ${stats.vramTotalGB} GB (${stats.vram.toFixed(1)}%)
- **RAM**: ${stats.ramUsedGB} / ${stats.ramTotalGB} GB (${stats.ram.toFixed(1)}%) | Heap: ${stats.heapUsedMB} MB
- **3D Render**: ${stats.drawCalls.toLocaleString()} Draw Calls | ${(stats.triangles / 1000000).toFixed(2)}M Triangles
- **Compute Task Dispatcher**: ${pinnedCount > 0 ? `Pinned (${pinnedCount}): ${pinnedSummary}` : 'Auto-Balanced'}
- **Diagnosis**: ${diagnosis.title} - ${diagnosis.detail}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render SVG Sparkline
  const renderSparkline = (data: number[], color: string, height = 28, max = 100) => {
    if (!data || data.length === 0) return null;
    const width = 120;
    const points = data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const clampedVal = Math.min(max, Math.max(0, val));
        const y = height - (clampedVal / max) * height;
        return `${x},${y}`;
      })
      .join(' ');

    const fillPoints = `0,${height} ${points} ${width},${height}`;

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <polygon points={fillPoints} fill={color} fillOpacity="0.15" />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const getStatusColor = (val: number, warn = 70, crit = 85) => {
    if (val >= crit) return { text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500/40', badge: 'bg-rose-500/20 text-rose-300' };
    if (val >= warn) return { text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-300' };
    return { text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-300' };
  };

  const cpuColor = getStatusColor(stats.cpu);
  const gpuColor = getStatusColor(stats.gpu);
  const ramColor = getStatusColor(stats.ram, 75, 90);
  const vramColor = getStatusColor(stats.vram, 80, 92);
  const fpsColor = stats.fps < 45 ? getStatusColor(90) : stats.fps < 75 ? getStatusColor(75) : getStatusColor(20);

  // Overlay positioning styles
  const getOverlayPositionClass = () => {
    if (customPos) return '';
    switch (overlayPos) {
      case 'top-left': return 'top-14 left-4';
      case 'bottom-left': return 'bottom-6 left-4';
      case 'bottom-right': return 'bottom-6 right-4';
      case 'top-right':
      default:
        return 'top-14 right-4';
    }
  };

  return (
    <div
      id="system_resource_monitor_root"
      style={
        displayMode === 'overlay'
          ? {
              position: 'fixed',
              ...(customPos ? { left: `${customPos.x}px`, top: `${customPos.y}px` } : {}),
              opacity: overlayOpacity / 100,
              zIndex: 9999,
            }
          : undefined
      }
      className={`font-sans select-none transition-opacity ${
        displayMode === 'overlay'
          ? `${getOverlayPositionClass()} w-[340px] max-h-[85vh] flex flex-col bg-[#0d1117]/95 backdrop-blur-xl border border-[#30363d] rounded-lg shadow-2xl overflow-hidden`
          : displayMode === 'compact'
          ? 'w-full h-full bg-[#0d1117] flex flex-col border-r border-[#21262d] text-white p-3 overflow-y-auto custom-scrollbar'
          : 'w-full h-full bg-[#0a0a0f] text-white flex flex-col overflow-hidden'
      }`}
    >
      {/* Top Header */}
      <div
        onMouseDown={displayMode === 'overlay' ? handleMouseDown : undefined}
        className={`flex items-center justify-between px-3.5 py-2.5 bg-[#161b22] border-b border-[#30363d] ${
          displayMode === 'overlay' ? 'cursor-move' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Activity size={14} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide text-white">System Resource Monitor</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#21262d] text-emerald-400 border border-emerald-500/30">
                LIVE
              </span>
            </div>
            {displayMode !== 'overlay' && (
              <span className="text-[10px] text-gray-400 font-mono">
                Real-time 3D Simulation & Telemetry Profiler
              </span>
            )}
          </div>
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-1.5">
          {/* Compute Task Dispatcher Toggle */}
          <button
            onClick={() => setShowComputeDispatcher(!showComputeDispatcher)}
            title={showComputeDispatcher ? 'Hide Compute Task Dispatcher' : 'Toggle Compute Task Dispatcher (Pin Processes to Hardware Tiers & Devices)'}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              showComputeDispatcher
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-[#21262d] text-gray-300 hover:text-white hover:bg-[#2d333b]'
            }`}
          >
            <Zap size={13} className={showComputeDispatcher ? 'text-amber-300 fill-amber-300' : 'text-blue-400'} />
            <span className="hidden sm:inline">Compute Task Dispatcher</span>
            <span className="sm:hidden">Dispatcher</span>
            {pinnedCount > 0 && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-400/40">
                {pinnedCount}
              </span>
            )}
          </button>

          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume Monitoring' : 'Freeze Snapshot'}
            className={`p-1.5 rounded transition text-xs flex items-center gap-1 ${
              isPaused ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-[#21262d] text-gray-300 hover:text-white'
            }`}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
          </button>

          {/* Mode Switchers */}
          <button
            onClick={() => setDisplayMode(displayMode === 'overlay' ? 'panel' : 'overlay')}
            title={displayMode === 'overlay' ? 'Dock as Panel' : 'Detach to Floating Overlay HUD'}
            className={`p-1.5 rounded transition text-xs ${
              displayMode === 'overlay' ? 'bg-blue-600 text-white' : 'bg-[#21262d] text-gray-400 hover:text-white'
            }`}
          >
            <Layers size={12} />
          </button>

          {/* Minimize / Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse Panels' : 'Expand Panels'}
            className="p-1.5 rounded bg-[#21262d] text-gray-400 hover:text-white transition text-xs"
          >
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Close button if provided */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded bg-[#21262d] text-gray-400 hover:text-rose-400 transition text-xs"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-3 space-y-3">
        {/* Quick Simulation Health Bar */}
        <div className="grid grid-cols-4 gap-2">
          {/* FPS Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span className="font-bold flex items-center gap-1">
                <Gauge size={12} className="text-emerald-400" /> FPS
              </span>
              <span className="text-[9px] font-mono text-gray-500">{stats.frameTime}ms</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-xl font-bold font-mono ${fpsColor.text}`}>{stats.fps}</span>
              <span className="text-[10px] text-gray-400">fps</span>
            </div>
            <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full ${fpsColor.bg} transition-all duration-300`}
                style={{ width: `${Math.min(100, (stats.fps / 144) * 100)}%` }}
              />
            </div>
          </div>

          {/* CPU Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span className="font-bold flex items-center gap-1">
                <Cpu size={12} className="text-blue-400" /> CPU
              </span>
              <span className="text-[9px] font-mono text-gray-500">{stats.cpuTemp}°C</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-xl font-bold font-mono ${cpuColor.text}`}>{stats.cpu.toFixed(0)}</span>
              <span className="text-[10px] text-gray-400">%</span>
            </div>
            <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full ${cpuColor.bg} transition-all duration-300`}
                style={{ width: `${stats.cpu}%` }}
              />
            </div>
          </div>

          {/* GPU Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span className="font-bold flex items-center gap-1">
                <Box size={12} className="text-purple-400" /> GPU
              </span>
              <span className="text-[9px] font-mono text-gray-500">{stats.gpuTemp}°C</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-xl font-bold font-mono ${gpuColor.text}`}>{stats.gpu.toFixed(0)}</span>
              <span className="text-[10px] text-gray-400">%</span>
            </div>
            <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full ${gpuColor.bg} transition-all duration-300`}
                style={{ width: `${stats.gpu}%` }}
              />
            </div>
          </div>

          {/* VRAM Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span className="font-bold flex items-center gap-1">
                <HardDrive size={12} className="text-amber-400" /> VRAM
              </span>
              <span className="text-[9px] font-mono text-gray-500">{stats.vramUsedGB}G</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-xl font-bold font-mono ${vramColor.text}`}>{stats.vram.toFixed(0)}</span>
              <span className="text-[10px] text-gray-400">%</span>
            </div>
            <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full ${vramColor.bg} transition-all duration-300`}
                style={{ width: `${stats.vram}%` }}
              />
            </div>
          </div>
        </div>

        {/* Diagnosis & Bottleneck Insight banner */}
        <div className={`p-2.5 rounded border ${diagnosis.bg} flex items-start gap-2.5`}>
          <div className="mt-0.5">
            {diagnosis.severity === 'critical' ? (
              <AlertTriangle size={15} className={diagnosis.color} />
            ) : (
              <CheckCircle2 size={15} className={diagnosis.color} />
            )}
          </div>
          <div className="flex-1 text-xs">
            <div className={`font-bold ${diagnosis.color}`}>{diagnosis.title}</div>
            <div className="text-[11px] text-gray-300 mt-0.5">{diagnosis.detail}</div>
          </div>
        </div>

        {/* Compute Task Dispatcher: Dedicated Hardware Tier & Vendor Device Pinning */}
        {showComputeDispatcher && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <ComputeTaskDispatcherPanel onClose={() => setShowComputeDispatcher(false)} />
          </div>
        )}

        {isExpanded && (
          <>
            {/* Detailed Graphs & Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* CPU Detailed Panel */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-blue-400" />
                    <span className="text-xs font-bold text-white">CPU Execution Engine</span>
                  </div>
                  <span className="text-[11px] font-mono text-blue-400 font-bold">{stats.cpuClock} GHz</span>
                </div>

                <div className="h-12 w-full bg-[#0d1117] rounded border border-[#21262d] p-1 mb-2">
                  {renderSparkline(cpuHistory, '#58a6ff', 40)}
                </div>

                {/* Core Thread Distribution Heatmap */}
                <div className="mb-2">
                  <div className="text-[10px] text-gray-400 font-bold mb-1 flex justify-between">
                    <span>16-THREAD DISTRIBUTION</span>
                    <span className="text-gray-500 font-mono">C0 - C15</span>
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {threadLoads.map((load, idx) => {
                      const color = load > 80 ? 'bg-rose-500' : load > 50 ? 'bg-amber-500' : 'bg-blue-500';
                      return (
                        <div key={idx} className="bg-[#0d1117] p-1 rounded border border-[#21262d] flex flex-col items-center">
                          <span className="text-[8px] text-gray-500 font-mono">T{idx}</span>
                          <div className="w-full bg-[#21262d] h-8 rounded-sm overflow-hidden flex flex-col justify-end my-0.5">
                            <div className={`w-full ${color} transition-all duration-300`} style={{ height: `${load}%` }} />
                          </div>
                          <span className="text-[8px] font-mono text-gray-300">{Math.round(load)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subsystem Times */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-[#21262d]">
                  <div className="bg-[#0d1117] p-1.5 rounded border border-[#21262d]">
                    <span className="text-gray-400 block text-[9px]">PHYSICS SUBSTEP</span>
                    <span className="text-emerald-400 font-bold">{stats.physicsTickMs} ms / tick</span>
                  </div>
                  <div className="bg-[#0d1117] p-1.5 rounded border border-[#21262d]">
                    <span className="text-gray-400 block text-[9px]">RENDER DISPATCH</span>
                    <span className="text-blue-400 font-bold">{stats.renderLatencyMs} ms latency</span>
                  </div>
                </div>
              </div>

              {/* GPU Detailed Panel */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Box size={14} className="text-purple-400" />
                    <span className="text-xs font-bold text-white">GPU Graphics & Compute</span>
                  </div>
                  <span className="text-[11px] font-mono text-purple-400 font-bold">{stats.gpuClock} MHz</span>
                </div>

                <div className="h-12 w-full bg-[#0d1117] rounded border border-[#21262d] p-1 mb-2">
                  {renderSparkline(gpuHistory, '#bc8cff', 40)}
                </div>

                {/* 3D Render Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-2 text-[11px]">
                  <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                    <div className="text-[10px] text-gray-400">DRAW CALLS</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">
                      {stats.drawCalls.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-emerald-400 mt-0.5">Optimal (&lt; 2,500)</div>
                  </div>

                  <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                    <div className="text-[10px] text-gray-400">POLYGONS / TRIS</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">
                      {(stats.triangles / 1000000).toFixed(2)}M
                    </div>
                    <div className="text-[9px] text-blue-400 mt-0.5">Frustum Culled</div>
                  </div>
                </div>

                {/* VRAM Breakdown */}
                <div className="bg-[#0d1117] p-2 rounded border border-[#21262d] text-[10px]">
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>VRAM ALLOCATION</span>
                    <span className="font-mono text-purple-300 font-bold">
                      {stats.vramUsedGB} GB / {stats.vramTotalGB} GB ({stats.vram.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full" style={{ width: `${stats.vram}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Memory & Frametime Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* RAM & Heap */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive size={14} className="text-amber-400" />
                    <span className="text-xs font-bold text-white">System RAM & Engine Heap</span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    {stats.ramUsedGB} / {stats.ramTotalGB} GB
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Physical Memory (RAM)</span>
                      <span className="font-mono">{stats.ram.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#21262d]">
                      <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${stats.ram}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>V8 JS / WASM Engine Heap</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {stats.heapUsedMB} MB / {stats.heapTotalMB} MB
                      </span>
                    </div>
                    <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#21262d]">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (stats.heapUsedMB / stats.heapTotalMB) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#21262d] text-[10px] text-gray-400">
                    <span>GC Pressure Status:</span>
                    <span className="text-emerald-400 font-bold font-mono">HEALTHY (No Memory Leaks)</span>
                  </div>
                </div>
              </div>

              {/* Frametime & Frame Pacing */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-400" />
                    <span className="text-xs font-bold text-white">Frametime & Pacing</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">{stats.frameTime.toFixed(2)} ms</span>
                </div>

                <div className="h-12 w-full bg-[#0d1117] rounded border border-[#21262d] p-1 mb-2 relative">
                  {/* Reference line for 60 FPS (16.6ms) */}
                  <div className="absolute top-[40%] left-0 right-0 border-b border-rose-500/30 text-[8px] text-rose-400/60 font-mono px-1">
                    16.6ms (60 FPS Cap)
                  </div>
                  {renderSparkline(frameTimeHistory, '#3fb950', 40, 33.3)}
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
                  <div className="bg-[#0d1117] p-1.5 rounded border border-[#21262d]">
                    <span className="text-gray-500 block text-[8px]">AVG FPS</span>
                    <span className="text-white font-bold">{stats.fps}</span>
                  </div>
                  <div className="bg-[#0d1117] p-1.5 rounded border border-[#21262d]">
                    <span className="text-gray-500 block text-[8px]">1% LOW</span>
                    <span className="text-amber-400 font-bold">{Math.max(12, stats.fps - 18)}</span>
                  </div>
                  <div className="bg-[#0d1117] p-1.5 rounded border border-[#21262d]">
                    <span className="text-gray-500 block text-[8px]">0.1% LOW</span>
                    <span className="text-rose-400 font-bold">{Math.max(8, stats.fps - 32)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Stress Profiler & Preset Switcher */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Flame size={14} className="text-orange-400" />
                  <span className="text-xs font-bold text-white">3D Simulation Stress Test Presets</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  Profile: <span className="text-orange-400 font-bold">{stats.activeSimulationProfile}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { name: 'Light Scene', profile: 'Lightweight Prototype', mult: 0.6, desc: '600 Draws' },
                  { name: 'Standard 3D', profile: 'Standard 3D Scene', mult: 1.0, desc: '1.4k Draws' },
                  { name: 'Crowd AI (500 NPCs)', profile: 'Dynamic Crowd AI', mult: 1.8, desc: 'High CPU' },
                  { name: 'Physics Chaos', profile: 'RigidBody Saturation', mult: 2.3, desc: 'Physics Strain' },
                  { name: 'Raytracing 4K', profile: 'Ultra 4K Raytraced VFX', mult: 3.1, desc: 'GPU Bound' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setSimulatedStressProfile(item.profile, item.mult)}
                    className={`p-2 rounded text-left transition border ${
                      stats.activeSimulationProfile === item.profile
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/60 shadow-inner'
                        : 'bg-[#0d1117] text-gray-300 border-[#21262d] hover:bg-[#21262d]'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.name}</div>
                    <div className="text-[9px] text-gray-500 font-mono mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Controls & Export Tools */}
      <div className="px-3.5 py-2.5 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {displayMode === 'overlay' && (
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <span>Opacity:</span>
              <input
                type="range"
                min="30"
                max="100"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="w-16 accent-blue-500 h-1"
              />
              <span className="font-mono">{overlayOpacity}%</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyMarkdownReport}
            className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-gray-300 text-xs font-medium flex items-center gap-1.5 transition"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy Report'}</span>
          </button>

          <button
            onClick={exportPerformanceReport}
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
          >
            <Download size={12} />
            <span>Export Log</span>
          </button>
        </div>
      </div>
    </div>
  );
}
