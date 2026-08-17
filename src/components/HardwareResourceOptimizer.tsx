import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Sliders, 
  Zap, 
  Flame, 
  Trash2, 
  RotateCw, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertTriangle, 
  PowerOff, 
  RefreshCw, 
  Layers, 
  Gauge, 
  Sparkles,
  Lock,
  Pause,
  Play
} from 'lucide-react';

interface SubToolAllocation {
  id: string;
  name: string;
  category: 'Viewport 3D' | 'Physics Engine' | 'AI Offline Model' | 'Audio & DSP' | 'Slicer & CAD' | 'Compiler';
  cpuPercent: number;
  gpuPercent: number;
  ramMb: number;
  vramMb: number;
  priority: 'Critical' | 'High' | 'Normal' | 'Background';
  isThrottled: boolean;
  isPaused: boolean;
}

export default function HardwareResourceOptimizer() {
  // Global Budget Caps
  const [maxCpuBudgetPercent, setMaxCpuBudgetPercent] = useState<number>(85);
  const [maxGpuBudgetPercent, setMaxGpuBudgetPercent] = useState<number>(90);
  const [maxRamBudgetGb, setMaxRamBudgetGb] = useState<number>(16);
  const [maxVramBudgetGb, setMaxVramBudgetGb] = useState<number>(8);
  const [autoThrottleOnExceed, setAutoThrottleOnExceed] = useState<boolean>(true);
  const [gcFrequencySec, setGcFrequencySec] = useState<number>(60);
  const [lastGcTime, setLastGcTime] = useState<string>('Just now');

  // Sub-Tools Active Hardware Footprints
  const [toolAllocations, setToolAllocations] = useState<SubToolAllocation[]>([
    { id: 'tool_viewport_3d', name: 'Real-time 3D Viewport & Lumen GI', category: 'Viewport 3D', cpuPercent: 18.5, gpuPercent: 42.0, ramMb: 2450, vramMb: 3200, priority: 'Critical', isThrottled: false, isPaused: false },
    { id: 'tool_ai_assistant', name: 'Offline AI Tensor Copilot (WASM)', category: 'AI Offline Model', cpuPercent: 24.0, gpuPercent: 28.5, ramMb: 3800, vramMb: 2100, priority: 'High', isThrottled: false, isPaused: false },
    { id: 'tool_physics_sim', name: 'Continuous Collision Physics & Chaos', category: 'Physics Engine', cpuPercent: 14.2, gpuPercent: 8.0, ramMb: 1250, vramMb: 450, priority: 'High', isThrottled: false, isPaused: false },
    { id: 'tool_cad_slicer', name: 'Watertight CAD & Slicer Raytracer', category: 'Slicer & CAD', cpuPercent: 8.4, gpuPercent: 6.2, ramMb: 920, vramMb: 680, priority: 'Normal', isThrottled: false, isPaused: false },
    { id: 'tool_audio_matrix', name: 'Spatial Audio Convolution DSP', category: 'Audio & DSP', cpuPercent: 4.8, gpuPercent: 1.0, ramMb: 480, vramMb: 120, priority: 'Normal', isThrottled: false, isPaused: false },
    { id: 'tool_compiler_ast', name: 'Background AST Linter & Compiler', category: 'Compiler', cpuPercent: 3.1, gpuPercent: 0.0, ramMb: 340, vramMb: 0, priority: 'Background', isThrottled: false, isPaused: false }
  ]);

  // Aggregated usage
  const totalCpuUsage = toolAllocations.reduce((acc, t) => acc + (t.isPaused ? 0 : t.cpuPercent), 0);
  const totalGpuUsage = toolAllocations.reduce((acc, t) => acc + (t.isPaused ? 0 : t.gpuPercent), 0);
  const totalRamGb = (toolAllocations.reduce((acc, t) => acc + (t.isPaused ? 0 : t.ramMb), 0) / 1024);
  const totalVramGb = (toolAllocations.reduce((acc, t) => acc + (t.isPaused ? 0 : t.vramMb), 0) / 1024);

  const isCpuOverBudget = totalCpuUsage > maxCpuBudgetPercent;
  const isGpuOverBudget = totalGpuUsage > maxGpuBudgetPercent;
  const isRamOverBudget = totalRamGb > maxRamBudgetGb;
  const isVramOverBudget = totalVramGb > maxVramBudgetGb;
  const isSystemCritical = isCpuOverBudget || isGpuOverBudget || isRamOverBudget || isVramOverBudget;

  const togglePauseTool = (id: string) => {
    setToolAllocations(prev => prev.map(t => t.id === id ? { ...t, isPaused: !t.isPaused } : t));
  };

  const toggleThrottleTool = (id: string) => {
    setToolAllocations(prev => prev.map(t => {
      if (t.id === id) {
        const nextThrottled = !t.isThrottled;
        return {
          ...t,
          isThrottled: nextThrottled,
          cpuPercent: nextThrottled ? t.cpuPercent * 0.4 : t.cpuPercent * 2.5,
          gpuPercent: nextThrottled ? t.gpuPercent * 0.4 : t.gpuPercent * 2.5,
        };
      }
      return t;
    }));
  };

  const triggerEmergencyGarbageCollection = () => {
    setToolAllocations(prev => prev.map(t => ({
      ...t,
      ramMb: Math.round(t.ramMb * 0.75),
      vramMb: Math.round(t.vramMb * 0.82)
    })));
    setLastGcTime(new Date().toLocaleTimeString());
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans overflow-hidden">
      {/* Top Header */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <Gauge className="text-[#38bdf8]" size={20} />
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Hardware Resource & Budget Cap Optimizer
              {isSystemCritical ? (
                <span className="text-[10px] bg-[#f85149]/20 text-[#ff7b72] border border-[#f85149]/40 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1 animate-pulse">
                  <ShieldAlert size={12} /> BUDGET EXCEEDED (THROTTLING ACTIVE)
                </span>
              ) : (
                <span className="text-[10px] bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                  <ShieldCheck size={12} /> ALLOCATIONS STABLE
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerEmergencyGarbageCollection}
            className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white text-xs font-bold rounded flex items-center gap-1.5 transition shadow"
            title="Flush unreferenced textures, geometries, and runtime AST cache"
          >
            <RefreshCw size={13} className="text-[#38bdf8]" /> Trigger VRAM/RAM GC ({lastGcTime})
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Global Hardware Budget Caps */}
        <div className="w-80 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 p-4 space-y-5 overflow-y-auto">
          <div>
            <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider block mb-3">Global Hardware Budget Caps</span>
            <p className="text-[11px] text-[#8b949e] mb-4 leading-relaxed">
              Enforce strict limits on hardware utilization. When a cap is breached, lower-priority sub-tools are automatically throttled or sleep-cycled.
            </p>
          </div>

          {/* CPU Cap */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <Cpu size={14} className="text-[#38bdf8]" /> CPU Budget Cap
              </span>
              <span className="font-mono text-[#38bdf8]">{maxCpuBudgetPercent}%</span>
            </div>
            <input 
              type="range" min={50} max={100} step={5}
              value={maxCpuBudgetPercent} 
              onChange={e => setMaxCpuBudgetPercent(parseInt(e.target.value))}
              className="w-full accent-[#38bdf8]"
            />
          </div>

          {/* GPU Cap */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <Zap size={14} className="text-[#a855f7]" /> GPU Budget Cap
              </span>
              <span className="font-mono text-[#a855f7]">{maxGpuBudgetPercent}%</span>
            </div>
            <input 
              type="range" min={50} max={100} step={5}
              value={maxGpuBudgetPercent} 
              onChange={e => setMaxGpuBudgetPercent(parseInt(e.target.value))}
              className="w-full accent-[#a855f7]"
            />
          </div>

          {/* RAM Cap */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <HardDrive size={14} className="text-[#3fb950]" /> Host RAM Limit
              </span>
              <span className="font-mono text-[#3fb950]">{maxRamBudgetGb} GB</span>
            </div>
            <input 
              type="range" min={4} max={64} step={2}
              value={maxRamBudgetGb} 
              onChange={e => setMaxRamBudgetGb(parseInt(e.target.value))}
              className="w-full accent-[#3fb950]"
            />
          </div>

          {/* VRAM Cap */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-white">
                <Layers size={14} className="text-[#e3b341]" /> Dedicated VRAM Limit
              </span>
              <span className="font-mono text-[#e3b341]">{maxVramBudgetGb} GB</span>
            </div>
            <input 
              type="range" min={2} max={32} step={1}
              value={maxVramBudgetGb} 
              onChange={e => setMaxVramBudgetGb(parseInt(e.target.value))}
              className="w-full accent-[#e3b341]"
            />
          </div>

          {/* Automation Toggles */}
          <div className="border-t border-[#30363d] pt-4 space-y-3">
            <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider block">Crash Prevention Guard</span>
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d]">
              <input 
                type="checkbox" 
                checked={autoThrottleOnExceed} 
                onChange={e => setAutoThrottleOnExceed(e.target.checked)}
                className="accent-[#38bdf8]"
              />
              <span>Auto-Throttle Background Tasks</span>
            </label>
          </div>
        </div>

        {/* Center Live Real-Time Allocation Meters */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
          {/* Top 4 Hardware Gauge Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CPU */}
            <div className={`p-4 rounded-xl border transition ${isCpuOverBudget ? 'bg-[#f85149]/10 border-[#f85149]' : 'bg-[#161b22] border-[#30363d]'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#8b949e] uppercase flex items-center gap-1.5">
                  <Cpu size={14} className="text-[#38bdf8]" /> CPU Usage
                </span>
                <span className={`text-xs font-mono font-bold ${isCpuOverBudget ? 'text-[#ff7b72]' : 'text-white'}`}>
                  {totalCpuUsage.toFixed(1)}% / {maxCpuBudgetPercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#0d1117] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${isCpuOverBudget ? 'bg-[#f85149]' : 'bg-[#38bdf8]'}`}
                  style={{ width: `${Math.min(100, (totalCpuUsage / maxCpuBudgetPercent) * 100)}%` }}
                />
              </div>
            </div>

            {/* GPU */}
            <div className={`p-4 rounded-xl border transition ${isGpuOverBudget ? 'bg-[#f85149]/10 border-[#f85149]' : 'bg-[#161b22] border-[#30363d]'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#8b949e] uppercase flex items-center gap-1.5">
                  <Zap size={14} className="text-[#a855f7]" /> GPU Usage
                </span>
                <span className={`text-xs font-mono font-bold ${isGpuOverBudget ? 'text-[#ff7b72]' : 'text-white'}`}>
                  {totalGpuUsage.toFixed(1)}% / {maxGpuBudgetPercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#0d1117] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${isGpuOverBudget ? 'bg-[#f85149]' : 'bg-[#a855f7]'}`}
                  style={{ width: `${Math.min(100, (totalGpuUsage / maxGpuBudgetPercent) * 100)}%` }}
                />
              </div>
            </div>

            {/* RAM */}
            <div className={`p-4 rounded-xl border transition ${isRamOverBudget ? 'bg-[#f85149]/10 border-[#f85149]' : 'bg-[#161b22] border-[#30363d]'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#8b949e] uppercase flex items-center gap-1.5">
                  <HardDrive size={14} className="text-[#3fb950]" /> Host RAM
                </span>
                <span className={`text-xs font-mono font-bold ${isRamOverBudget ? 'text-[#ff7b72]' : 'text-white'}`}>
                  {totalRamGb.toFixed(2)} GB / {maxRamBudgetGb} GB
                </span>
              </div>
              <div className="w-full h-2 bg-[#0d1117] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${isRamOverBudget ? 'bg-[#f85149]' : 'bg-[#3fb950]'}`}
                  style={{ width: `${Math.min(100, (totalRamGb / maxRamBudgetGb) * 100)}%` }}
                />
              </div>
            </div>

            {/* VRAM */}
            <div className={`p-4 rounded-xl border transition ${isVramOverBudget ? 'bg-[#f85149]/10 border-[#f85149]' : 'bg-[#161b22] border-[#30363d]'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#8b949e] uppercase flex items-center gap-1.5">
                  <Layers size={14} className="text-[#e3b341]" /> VRAM
                </span>
                <span className={`text-xs font-mono font-bold ${isVramOverBudget ? 'text-[#ff7b72]' : 'text-white'}`}>
                  {totalVramGb.toFixed(2)} GB / {maxVramBudgetGb} GB
                </span>
              </div>
              <div className="w-full h-2 bg-[#0d1117] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${isVramOverBudget ? 'bg-[#f85149]' : 'bg-[#e3b341]'}`}
                  style={{ width: `${Math.min(100, (totalVramGb / maxVramBudgetGb) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sub-Tools Resource Allocation Breakdown Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Active Sub-Tool Allocation & Throttling Matrix</h2>
                <p className="text-xs text-[#8b949e]">
                  Isolate runaway sub-systems, throttle clock cycles, or put idle engines to sleep to preserve memory.
                </p>
              </div>
              <span className="text-xs font-mono text-[#8b949e]">
                {toolAllocations.filter(t => !t.isPaused).length} Running / {toolAllocations.length} Tracked
              </span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d1117] text-[#8b949e] uppercase font-bold border-b border-[#30363d]">
                  <tr>
                    <th className="p-3">Sub-Tool Name & ID</th>
                    <th className="p-3">Category / Priority</th>
                    <th className="p-3">CPU %</th>
                    <th className="p-3">GPU %</th>
                    <th className="p-3">RAM</th>
                    <th className="p-3">VRAM</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]">
                  {toolAllocations.map(tool => (
                    <tr key={tool.id} className={`hover:bg-[#1f2937] transition ${tool.isPaused ? 'opacity-50' : ''}`}>
                      <td className="p-3">
                        <div className="font-bold text-white">{tool.name}</div>
                        <div className="text-[10px] font-mono text-[#8b949e]">{tool.id}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-[#8b949e]">{tool.category}</div>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          tool.priority === 'Critical' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                          tool.priority === 'High' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                          'bg-[#3b82f6]/20 text-[#3b82f6]'
                        }`}>
                          {tool.priority}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#38bdf8]">
                        {tool.isPaused ? '0.0%' : `${tool.cpuPercent.toFixed(1)}%`}
                      </td>
                      <td className="p-3 font-mono font-bold text-[#a855f7]">
                        {tool.isPaused ? '0.0%' : `${tool.gpuPercent.toFixed(1)}%`}
                      </td>
                      <td className="p-3 font-mono text-white">
                        {tool.isPaused ? '0 MB' : `${tool.ramMb} MB`}
                      </td>
                      <td className="p-3 font-mono text-white">
                        {tool.isPaused ? '0 MB' : `${tool.vramMb} MB`}
                      </td>
                      <td className="p-3">
                        {tool.isPaused ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#64748b]/20 text-[#94a3b8]">
                            PAUSED / ASLEEP
                          </span>
                        ) : tool.isThrottled ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f59e0b]/20 text-[#f59e0b]">
                            THROTTLED (40%)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#238636]/20 text-[#3fb950]">
                            NORMAL (100%)
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => toggleThrottleTool(tool.id)}
                          disabled={tool.isPaused}
                          className={`px-2 py-1 text-[11px] font-bold rounded border transition ${
                            tool.isThrottled 
                              ? 'bg-[#3fb950]/20 border-[#3fb950] text-[#3fb950]' 
                              : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white'
                          }`}
                          title="Clamp frame rates and thread concurrency by 60%"
                        >
                          {tool.isThrottled ? 'Unclamp' : 'Clamp 40%'}
                        </button>
                        <button
                          onClick={() => togglePauseTool(tool.id)}
                          className={`px-2 py-1 text-[11px] font-bold rounded border transition ${
                            tool.isPaused
                              ? 'bg-[#238636] border-[#238636] text-white'
                              : 'bg-[#da3633]/20 border-[#da3633] text-[#ff7b72] hover:bg-[#da3633] hover:text-white'
                          }`}
                          title="Suspend sub-tool memory pool"
                        >
                          {tool.isPaused ? 'Resume' : 'Sleep'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
