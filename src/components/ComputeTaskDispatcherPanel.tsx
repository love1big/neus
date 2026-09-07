/**
 * ============================================================================
 * MODULE: Compute Task Dispatcher & Engine Process Affinity Control Panel
 * FILE: src/components/ComputeTaskDispatcherPanel.tsx
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * [THAI]
 * คอมโพเนนต์แผงควบคุมระบบ 'Compute Task Dispatcher' สำหรับ SystemResourceMonitor
 * ช่วยให้ผู้พัฒนาสามารถปักหมุด (Manually Pin) กระบวนการย่อยของเอนจินเกม เช่น
 * Physics Simulation, 3D Rendering, Hardware Ray Tracing, AI Inference,
 * Audio DSP, และ Terrain PCG ไปยังระดับฮาร์ดแวร์เฉพาะ (Dedicated Hardware Tiers)
 * หรืออุปกรณ์ฮาร์ดแวร์ของผู้ผลิตที่เจาะจง (Specific Vendor Devices: NVIDIA, AMD,
 * Intel, Apple, Qualcomm, Groq) พร้อมแสดงผลกระทบต่อ Throughput และ Latency สดๆ
 * 
 * [ENGLISH]
 * Enterprise user interface panel for the 'Compute Task Dispatcher' within the
 * SystemResourceMonitor. Allows engine developers to manually pin specific game
 * engine processes (e.g. Physics, Rendering, Ray Tracing, AI Inference, Audio DSP,
 * Voxel PCG) to dedicated hardware tiers or specific vendor devices. Features live
 * dispatching, dynamic latency benchmarking, preset management, and hardware telemetry.
 * 
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * 1. ProcessAffinityManagerNode: State repository และคำนวณ Offload Dividends
 * 2. HeterogeneousDeviceRegistryNode: ให้ข้อมูลรายชื่อฮาร์ดแวร์ สเปก และสถานะ
 * 3. MultiVendorWorkloadDispatcherNode: จัดสรรคิวงานและจำลองการส่ง Task
 * 4. SystemResourceMonitor: ทำหน้าที่เป็น Host Shell สำหรับเปิด/ปิดแผงควบคุมนี้
 * 
 * ============================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  Cpu, 
  Box, 
  Layers, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Pin, 
  PinOff, 
  Play, 
  Activity, 
  AlertCircle, 
  Sliders, 
  Gauge, 
  TrendingUp, 
  Radio, 
  Download, 
  CheckCircle2, 
  ChevronRight, 
  Info,
  Server,
  Flame,
  Volume2,
  Mountain,
  Video
} from 'lucide-react';
import { 
  EngineProcessKey, 
  HardwareTier, 
  ProcessBinding 
} from '../types/processAffinity';
import { HeterogeneousComputeNode, ComputeVendor } from '../types/heterogeneousCompute';
import { ProcessAffinityManagerNode } from '../utils/ProcessAffinityManagerNode';
import { HeterogeneousDeviceRegistryNode } from '../utils/HeterogeneousDeviceRegistryNode';

export interface ComputeTaskDispatcherPanelProps {
  onClose?: () => void;
  isCompact?: boolean;
}

export default function ComputeTaskDispatcherPanel({
  onClose,
  isCompact = false
}: ComputeTaskDispatcherPanelProps) {
  const affinityManager = useMemo(() => ProcessAffinityManagerNode.getInstance(), []);
  const deviceRegistry = useMemo(() => HeterogeneousDeviceRegistryNode.getInstance(), []);

  const [bindings, setBindings] = useState<ProcessBinding[]>([]);
  const [devices, setDevices] = useState<HeterogeneousComputeNode[]>([]);
  const [isDispatching, setIsDispatching] = useState(false);
  const [lastDispatchReport, setLastDispatchReport] = useState<{
    dispatchedCount: number;
    avgLatencyMs: number;
    totalThroughputMflops: number;
  } | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PINNED' | 'AUTO'>('ALL');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Subscribe to affinity manager updates
  useEffect(() => {
    const unsubscribe = affinityManager.subscribe((updatedBindings) => {
      setBindings([...updatedBindings]);
    });
    setDevices(deviceRegistry.getAllNodes());
    return () => unsubscribe();
  }, [affinityManager, deviceRegistry]);

  // Compute offload efficiency dividends
  const efficiency = useMemo(() => {
    return affinityManager.computeEfficiencyScore();
  }, [affinityManager, bindings]);

  // Handle tier switch
  const handleTierChange = (key: EngineProcessKey, tier: HardwareTier) => {
    affinityManager.setProcessTier(key, tier);
  };

  // Handle specific device pin
  const handleDevicePinChange = (key: EngineProcessKey, deviceId: string) => {
    if (deviceId === 'AUTO') {
      affinityManager.unpinProcess(key);
    } else {
      affinityManager.pinProcessToDevice(key, deviceId);
    }
  };

  // Trigger manual single frame dispatch test
  const handleDispatchFrame = async () => {
    setIsDispatching(true);
    try {
      const report = await affinityManager.dispatchFrameWorkloads();
      setLastDispatchReport({
        dispatchedCount: report.dispatchedCount,
        avgLatencyMs: report.avgLatencyMs,
        totalThroughputMflops: report.totalThroughputMflops
      });
    } finally {
      setTimeout(() => setIsDispatching(false), 300);
    }
  };

  // Export pinning configuration to JSON
  const handleExportProfile = () => {
    const data = {
      timestamp: new Date().toISOString(),
      generator: 'Nexus Engine Heterogeneous Process Dispatcher v2.5',
      efficiencyScore: efficiency.efficiency,
      bindings: bindings.map(b => ({
        process: b.name,
        key: b.processKey,
        targetTier: b.targetTier,
        pinnedDeviceId: b.pinnedDeviceId,
        pinnedVendor: b.pinnedVendor,
        isPinned: b.isPinned,
        latencyMs: b.latencyMs
      }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-process-affinity-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Exported affinity profile JSON');
  };

  const showNotice = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  // Helper to get process icon
  const getProcessIcon = (key: EngineProcessKey) => {
    switch (key) {
      case 'PHYSICS':
        return <Activity size={16} className="text-amber-400" />;
      case 'RENDERING':
        return <Box size={16} className="text-blue-400" />;
      case 'RAYTRACING':
        return <Sparkles size={16} className="text-purple-400" />;
      case 'AI_INFERENCE':
        return <Zap size={16} className="text-emerald-400" />;
      case 'AUDIO_DSP':
        return <Volume2 size={16} className="text-cyan-400" />;
      case 'TERRAIN_PCG':
        return <Mountain size={16} className="text-orange-400" />;
      case 'VIDEO_FRAME_GEN':
        return <Video size={16} className="text-pink-400" />;
      default:
        return <Cpu size={16} className="text-gray-400" />;
    }
  };

  // Vendor color badge helper
  const getVendorBadge = (vendor?: ComputeVendor) => {
    switch (vendor) {
      case 'NVIDIA':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">NVIDIA</span>;
      case 'AMD':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-500/40">AMD</span>;
      case 'Apple':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-gray-200 border border-gray-500/40">Apple Silicon</span>;
      case 'Intel':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-500/40">Intel</span>;
      case 'Qualcomm':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-500/40">Qualcomm</span>;
      case 'Groq':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-500/40">Groq LPU</span>;
      default:
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">Dynamic</span>;
    }
  };

  // Filter bindings
  const filteredBindings = bindings.filter(b => {
    if (activeFilter === 'PINNED') return b.isPinned;
    if (activeFilter === 'AUTO') return !b.isPinned;
    return true;
  });

  return (
    <div className="bg-[#0b0e14] border border-[#262c36] rounded-xl overflow-hidden shadow-2xl flex flex-col font-sans text-white transition-all">
      {/* Top Banner & Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#161b26] via-[#10141d] to-[#161b26] border-b border-[#262c36] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-inner">
            <Zap size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wide text-white">
                Compute Task Dispatcher
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                HARDWARE PINNING v2.5
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Manually pin engine workloads to dedicated hardware tiers or specific vendor devices
            </p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          {copiedNotification && (
            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <Check size={12} /> {copiedNotification}
            </span>
          )}

          <button
            onClick={handleDispatchFrame}
            disabled={isDispatching}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow ${
              isDispatching 
                ? 'bg-blue-700 text-white cursor-wait opacity-80' 
                : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
            }`}
            title="Dispatch a synchronous test frame across all pinned devices"
          >
            <Play size={12} className={isDispatching ? 'animate-spin' : ''} />
            <span>{isDispatching ? 'Dispatching...' : 'Dispatch Test Frame'}</span>
          </button>

          <button
            onClick={handleExportProfile}
            className="p-1.5 rounded-lg bg-[#1c222d] hover:bg-[#283141] text-gray-300 hover:text-white border border-[#2d3748] text-xs transition"
            title="Export Affinity Profile (JSON)"
          >
            <Download size={14} />
          </button>

          <button
            onClick={() => affinityManager.resetToDefaults()}
            className="p-1.5 rounded-lg bg-[#1c222d] hover:bg-[#283141] text-gray-300 hover:text-white border border-[#2d3748] text-xs transition"
            title="Reset All Process Pins to Default"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Performance Dividends & Efficiency Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-[#0d1117] border-b border-[#21262d] text-xs">
        {/* Efficiency Metric */}
        <div className="p-2.5 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Gauge size={12} className="text-blue-400" /> Dispatch Efficiency
            </div>
            <div className="text-lg font-bold font-mono text-blue-400 mt-0.5">
              {efficiency.efficiency}%
            </div>
          </div>
          <div className="w-9 h-9 rounded-full border-2 border-blue-500/40 flex items-center justify-center text-[10px] font-mono text-blue-300">
            {efficiency.efficiency > 80 ? 'HIGH' : 'NORM'}
          </div>
        </div>

        {/* GPU Offload Dividend */}
        <div className="p-2.5 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Box size={12} className="text-emerald-400" /> GPU VRAM Unburdened
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              +{efficiency.unburdenedGpuPercent}%
            </div>
          </div>
          <TrendingUp size={16} className="text-emerald-400 opacity-70" />
        </div>

        {/* CPU Offload Dividend */}
        <div className="p-2.5 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Cpu size={12} className="text-purple-400" /> CPU Core Headroom
            </div>
            <div className="text-lg font-bold font-mono text-purple-400 mt-0.5">
              +{efficiency.unburdenedCpuPercent}%
            </div>
          </div>
          <TrendingUp size={16} className="text-purple-400 opacity-70" />
        </div>

        {/* FPS Headroom Estimate */}
        <div className="p-2.5 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Flame size={12} className="text-orange-400" /> FPS Headroom Boost
            </div>
            <div className="text-lg font-bold font-mono text-orange-400 mt-0.5">
              +{efficiency.fpsHeadroomBoost} FPS
            </div>
          </div>
          <Sparkles size={16} className="text-orange-400 opacity-70" />
        </div>
      </div>

      {/* Quick Preset Selector */}
      <div className="px-3 py-2 bg-[#12161f] border-b border-[#21262d] flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
          <Sliders size={12} className="text-blue-400" />
          <span className="font-semibold text-gray-300">Affinity Presets:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {affinityManager.getPresets().map(preset => (
            <button
              key={preset.id}
              onClick={() => {
                affinityManager.applyPreset(preset.id);
                showNotice(`Applied: ${preset.name}`);
              }}
              className="px-2.5 py-1 rounded text-[11px] font-medium bg-[#1a212d] hover:bg-[#253040] text-gray-300 hover:text-white border border-[#2e3a4e] transition"
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Filter View Selector */}
        <div className="flex items-center gap-1 bg-[#090c10] p-0.5 rounded border border-[#21262d] text-[10px] font-mono">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-2 py-0.5 rounded ${activeFilter === 'ALL' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            All ({bindings.length})
          </button>
          <button
            onClick={() => setActiveFilter('PINNED')}
            className={`px-2 py-0.5 rounded ${activeFilter === 'PINNED' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Pinned ({bindings.filter(b => b.isPinned).length})
          </button>
          <button
            onClick={() => setActiveFilter('AUTO')}
            className={`px-2 py-0.5 rounded ${activeFilter === 'AUTO' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Auto ({bindings.filter(b => !b.isPinned).length})
          </button>
        </div>
      </div>

      {/* Main Process Pinning Cards Container */}
      <div className="p-3 space-y-2.5 max-h-[55vh] overflow-y-auto custom-scrollbar">
        {filteredBindings.map((binding) => {
          return (
            <div
              key={binding.processKey}
              className={`p-3 rounded-xl border transition-all ${
                binding.isPinned
                  ? 'bg-[#131822] border-blue-500/40 shadow-sm'
                  : 'bg-[#0e121a] border-[#222834] hover:border-[#2f3747]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left: Process Identity & Telemetry */}
                <div className="flex items-start gap-3 min-w-[220px]">
                  <div className="p-2 rounded-lg bg-[#1a212e] border border-[#2b3545] shrink-0 mt-0.5">
                    {getProcessIcon(binding.processKey)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white tracking-wide">
                        {binding.name}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1e2533] text-gray-400 border border-[#2c374b]">
                        {binding.category}
                      </span>
                      {binding.isPinned ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1 font-semibold">
                          <Pin size={9} /> PINNED
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-gray-800 text-gray-400">
                          AUTO-BALANCED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                      {binding.description}
                    </p>
                    
                    {/* Live Process Metrics */}
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-gray-400">
                      <span>Latency: <strong className="text-emerald-400">{binding.latencyMs} ms</strong></span>
                      <span>•</span>
                      <span>Load: <strong className="text-blue-400">{binding.currentLoadPercent}%</strong></span>
                      <span>•</span>
                      <span>Throughput: <strong className="text-purple-400">{binding.throughputValue} {binding.throughputMetric}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Hardware Tier & Specific Vendor Device Selectors */}
                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                  {/* Tier Selector Dropdown */}
                  <div className="flex flex-col text-[10px] text-gray-400 min-w-[150px]">
                    <span className="mb-1 font-mono text-[9px] text-gray-400 flex items-center gap-1">
                      <Layers size={10} /> Hardware Tier:
                    </span>
                    <select
                      value={binding.targetTier}
                      onChange={(e) => handleTierChange(binding.processKey, e.target.value as HardwareTier)}
                      className="bg-[#18202c] border border-[#2d394d] text-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500 transition font-sans cursor-pointer"
                    >
                      <option value="TIER_AUTO_BALANCED">⚡ Tier Auto (Dynamic)</option>
                      <option value="TIER_1_DISCRETE_GPU">🚀 Tier 1: Discrete GPU</option>
                      <option value="TIER_2_DEDICATED_NPU">🧠 Tier 2: Dedicated NPU / AI</option>
                      <option value="TIER_3_HOST_CPU">💻 Tier 3: Multi-Core Host CPU</option>
                      <option value="TIER_4_INTEGRATED_APU">🔋 Tier 4: Integrated APU</option>
                    </select>
                  </div>

                  {/* Specific Device Selector Dropdown */}
                  <div className="flex flex-col text-[10px] text-gray-400 min-w-[190px]">
                    <span className="mb-1 font-mono text-[9px] text-gray-400 flex items-center gap-1">
                      <Server size={10} /> Vendor Device:
                    </span>
                    <select
                      value={binding.pinnedDeviceId}
                      onChange={(e) => handleDevicePinChange(binding.processKey, e.target.value)}
                      className="bg-[#18202c] border border-[#2d394d] text-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500 transition font-sans cursor-pointer"
                    >
                      <option value="AUTO">-- Auto Float (Dynamic) --</option>
                      <optgroup label="Discrete GPUs (NVIDIA / AMD / Intel)">
                        {devices
                          .filter(d => d.deviceClass === 'GPU_DISCRETE')
                          .map(d => (
                            <option key={d.id} value={d.id}>
                              [{d.vendor}] {d.name} ({d.preferredBackend})
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Dedicated NPUs & Accelerators (Apple / Groq / QCOM)">
                        {devices
                          .filter(d => d.deviceClass === 'NPU_DEDICATED' || d.deviceClass === 'TPU_LPU_ACCELERATOR')
                          .map(d => (
                            <option key={d.id} value={d.id}>
                              [{d.vendor}] {d.name} ({d.preferredBackend})
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Host CPUs & Cores (Intel / AMD)">
                        {devices
                          .filter(d => d.deviceClass === 'CPU')
                          .map(d => (
                            <option key={d.id} value={d.id}>
                              [{d.vendor}] {d.name} ({d.architecture})
                            </option>
                          ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Quick Toggle Pin/Unpin Button */}
                  <div className="flex items-end pt-3 md:pt-0">
                    <button
                      onClick={() => {
                        if (binding.isPinned) {
                          affinityManager.unpinProcess(binding.processKey);
                        } else {
                          // Pin to Tier 1 by default if unpinned
                          affinityManager.setProcessTier(binding.processKey, 'TIER_1_DISCRETE_GPU');
                        }
                      }}
                      className={`p-2 rounded-lg border transition text-xs flex items-center justify-center ${
                        binding.isPinned
                          ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 hover:bg-blue-600/30'
                          : 'bg-[#18202c] text-gray-400 border-[#2b3545] hover:text-white hover:bg-[#222b3a]'
                      }`}
                      title={binding.isPinned ? 'Unlock / Unpin Process' : 'Pin Process to Current Tier'}
                    >
                      {binding.isPinned ? <Pin size={14} className="text-blue-400" /> : <PinOff size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected Hardware Details Tag */}
              {binding.isPinned && binding.pinnedVendor && (
                <div className="mt-2.5 pt-2 border-t border-[#1e2533] flex items-center justify-between text-[10px] text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Hardware Bound:</span>
                    {getVendorBadge(binding.pinnedVendor)}
                    <span className="font-mono text-gray-300">
                      {devices.find(d => d.id === binding.pinnedDeviceId)?.name || binding.pinnedDeviceId}
                    </span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[9px] flex items-center gap-1">
                    <CheckCircle2 size={10} /> Active Pinning Route
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info & Last Dispatch Feedback */}
      <div className="px-4 py-2.5 bg-[#0e121a] border-t border-[#262c36] flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Info size={13} className="text-blue-400 shrink-0" />
          <span className="text-[11px]">
            {lastDispatchReport 
              ? `Last Frame Dispatch: ${lastDispatchReport.dispatchedCount} tasks dispatched in ${lastDispatchReport.avgLatencyMs}ms avg latency`
              : 'Workloads dynamically steer across PCIe 5.0, NVLink, and Apple Unified Fabric buses'}
          </span>
        </div>

        <div className="text-[10px] font-mono text-gray-500">
          Sync: <span className="text-blue-400">LocalStorage Active</span>
        </div>
      </div>
    </div>
  );
}
