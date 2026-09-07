/**
 * ============================================================================
 * MODULE: Heterogeneous Multi-Compute Studio (CPU, GPU, NPU Multi-Vendor Workstation)
 * FILE: src/components/HeterogeneousMultiComputeStudio.tsx
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * หน้าจอเวิร์กสเตชันระดับมืออาชีพ (AAA Workstation) สำหรับบริหารจัดการ, ตรวจสอบ,
 * และกระจายการประมวลผลไปยังฮาร์ดแวร์หลากหลายสถาปัตยกรรม (Heterogeneous Computing)
 * รองรับ CPU, Discrete GPU, Integrated GPU, NPU, และ TPU/LPU พร้อมกันหลายตัว
 * จากผู้ผลิตหลากหลายยี่ห้อ (NVIDIA, AMD, Intel, Apple, Qualcomm, Google, Tenstorrent, Groq)
 * 
 * ============================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Cpu, 
  Server, 
  Zap, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Layers, 
  Settings2, 
  Play, 
  RefreshCw, 
  Flame, 
  Gauge, 
  Network, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Monitor, 
  Radio, 
  ArrowRightLeft, 
  Microchip, 
  Terminal, 
  Share2, 
  SlidersHorizontal,
  Power
} from 'lucide-react';

import { 
  HeterogeneousComputeNode, 
  ComputeVendor, 
  ComputeDeviceClass, 
  WorkloadType, 
  HeterogeneousComputeTask 
} from '../types/heterogeneousCompute';
import { HeterogeneousDeviceRegistryNode } from '../utils/HeterogeneousDeviceRegistryNode';
import { MultiVendorWorkloadDispatcherNode } from '../utils/MultiVendorWorkloadDispatcherNode';
import { HeterogeneousMemoryFabricNode } from '../utils/HeterogeneousMemoryFabricNode';
import { CrossVendorFaultToleranceWatchdogNode, WatchdogAlertEvent } from '../utils/CrossVendorFaultToleranceWatchdogNode';

export const HeterogeneousMultiComputeStudio: React.FC<{ onSelectTool?: (toolId: string) => void }> = ({ onSelectTool }) => {
  const [activeView, setActiveView] = useState<'TOPOLOGY' | 'DISPATCHER' | 'MEMORY_FABRIC' | 'WATCHDOG' | 'HOST_PROBE'>('TOPOLOGY');
  
  // Singleton Engines
  const registry = useMemo(() => HeterogeneousDeviceRegistryNode.getInstance(), []);
  const dispatcher = useMemo(() => MultiVendorWorkloadDispatcherNode.getInstance(), []);
  const memoryFabric = useMemo(() => HeterogeneousMemoryFabricNode.getInstance(), []);
  const watchdog = useMemo(() => CrossVendorFaultToleranceWatchdogNode.getInstance(), []);

  // State bindings
  const [nodes, setNodes] = useState<HeterogeneousComputeNode[]>(() => registry.getAllNodes());
  const [taskHistory, setTaskHistory] = useState<HeterogeneousComputeTask[]>(() => dispatcher.getTaskHistory());
  const [alerts, setAlerts] = useState<WatchdogAlertEvent[]>(() => watchdog.getAlerts());
  const [filterVendor, setFilterVendor] = useState<string>('ALL');
  const [filterClass, setFilterClass] = useState<string>('ALL');
  
  // Dispatcher Test Form
  const [selectedWorkload, setSelectedWorkload] = useState<WorkloadType>('RAYTRACING_BVH');
  const [selectedTargetDevice, setSelectedTargetDevice] = useState<string>('AUTO_BALANCED');
  const [payloadSizeMb, setPayloadSizeMb] = useState<number>(850);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);

  // Cross-Vendor Memory Transfer Tester
  const [transferFromNodeId, setTransferFromNodeId] = useState<string>('node-nv-rtx4090');
  const [transferToNodeId, setTransferToNodeId] = useState<string>('node-amd-rx7900xtx');
  const [transferResult, setTransferResult] = useState<any>(null);

  // Host probe info
  const [hostProbeData, setHostProbeData] = useState<any>(null);

  // Refresh live cluster metrics
  const clusterSummary = useMemo(() => registry.computeClusterAggregateSummary(), [nodes, registry]);

  // Periodic telemetry tick
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate subtle realistic utilization fluctuations
      setNodes(prev => prev.map(n => {
        if (!n.enabled) return n;
        const deltaLoad = (Math.random() * 4) - 2;
        const newLoad = Math.min(98, Math.max(15, Math.round(n.telemetry.utilizationPercent + deltaLoad)));
        return {
          ...n,
          telemetry: {
            ...n.telemetry,
            utilizationPercent: newLoad
          }
        };
      }));

      // Periodic thermal check
      const latestAlerts = watchdog.performThermalAndHealthAudit();
      setAlerts([...latestAlerts]);
      setTaskHistory(dispatcher.getTaskHistory());
    }, 2500);

    return () => clearInterval(interval);
  }, [watchdog, dispatcher]);

  // Handle probe real host device
  const handleProbeHost = async () => {
    const probe = await registry.probeRealBrowserHardware();
    setHostProbeData(probe);
    setNodes(registry.getAllNodes());
  };

  // Run massive concurrent benchmark across all vendors
  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    dispatcher.runConcurrentMultiVendorBenchmark();
    setTimeout(() => {
      setNodes(registry.getAllNodes());
      setTaskHistory(dispatcher.getTaskHistory());
      setIsBenchmarking(false);
    }, 1200);
  };

  // Toggle enable/disable node
  const handleToggleNode = (id: string) => {
    registry.toggleNodeEnabled(id);
    setNodes([...registry.getAllNodes()]);
  };

  // Manual dispatch task
  const handleDispatchManualTask = () => {
    dispatcher.dispatchTask({
      name: `User Pipeline: ${selectedWorkload}`,
      type: selectedWorkload,
      priority: 'HIGH',
      dataPayloadSizeMb: payloadSizeMb,
      assignedDeviceId: selectedTargetDevice,
      targetPrecision: 'FP16'
    });

    setTimeout(() => {
      setNodes(registry.getAllNodes());
      setTaskHistory(dispatcher.getTaskHistory());
    }, 400);
  };

  // Memory transfer test
  const handleExecuteTensorTransfer = () => {
    const result = memoryFabric.transferTensorAcrossVendors(transferFromNodeId, transferToNodeId, 512);
    setTransferResult(result);
    setNodes([...registry.getAllNodes()]);
  };

  // Trigger Driver Failover Simulation
  const handleSimulateCrash = (deviceId: string) => {
    watchdog.triggerSimulatedDriverCrashAndFailover(deviceId);
    setNodes([...registry.getAllNodes()]);
    setAlerts([...watchdog.getAlerts()]);
  };

  // Filtered nodes
  const filteredNodes = nodes.filter(n => {
    const matchVendor = filterVendor === 'ALL' || n.vendor === filterVendor;
    const matchClass = filterClass === 'ALL' || n.deviceClass === filterClass;
    return matchVendor && matchClass;
  });

  // Vendor color helper
  const getVendorBadge = (vendor: ComputeVendor) => {
    switch (vendor) {
      case 'NVIDIA':
        return { bg: 'bg-[#76b900]/15', text: 'text-[#76b900]', border: 'border-[#76b900]/40' };
      case 'AMD':
        return { bg: 'bg-[#ed1c24]/15', text: 'text-[#ff6b6b]', border: 'border-[#ed1c24]/40' };
      case 'Intel':
        return { bg: 'bg-[#0071c5]/15', text: 'text-[#58a6ff]', border: 'border-[#0071c5]/40' };
      case 'Apple':
        return { bg: 'bg-[#a3aaae]/15', text: 'text-[#e6edf3]', border: 'border-[#a3aaae]/40' };
      case 'Qualcomm':
        return { bg: 'bg-[#ff5722]/15', text: 'text-[#ff8a65]', border: 'border-[#ff5722]/40' };
      case 'Groq':
        return { bg: 'bg-[#00e676]/15', text: 'text-[#3fb950]', border: 'border-[#00e676]/40' };
      case 'Tenstorrent':
        return { bg: 'bg-[#9c27b0]/15', text: 'text-[#bc8cff]', border: 'border-[#9c27b0]/40' };
      default:
        return { bg: 'bg-[#30363d]', text: 'text-[#8b949e]', border: 'border-[#30363d]' };
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden">
      {/* ===================================================================== */}
      {/* 1. TOP HEADER & TELEMETRY DASHBOARD GAUGE                             */}
      {/* ===================================================================== */}
      <div className="bg-[#161b22] border-b border-[#30363d] p-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#1f6feb]/20 border border-[#1f6feb]/40 rounded-lg text-[#58a6ff]">
              <Microchip size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white tracking-wide">
                  Heterogeneous Multi-Compute Orchestrator
                </h1>
                <span className="px-2 py-0.5 bg-[#238636]/20 border border-[#238636]/40 text-[#3fb950] text-[10px] font-extrabold uppercase rounded-full">
                  Multi-Vendor Active
                </span>
              </div>
              <p className="text-xs text-[#8b949e]">
                รองรับการประมวลผลคู่ขนานพร้อมกันระหว่าง CPU, GPU, NPU และ TPU/LPU จากหลากหลายยี่ห้อ (NVIDIA, AMD, Intel, Apple, Qualcomm, Groq, Tenstorrent)
              </p>
            </div>
          </div>
        </div>

        {/* Global Cluster Stats */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="bg-[#0d1117] border border-[#30363d] px-3 py-1.5 rounded-lg flex flex-col">
            <span className="text-[10px] text-[#8b949e] font-semibold">Total FP32 Compute</span>
            <span className="text-sm font-bold text-[#58a6ff] font-mono">
              {clusterSummary.totalFp32Tflops} <span className="text-xs text-[#8b949e]">TFLOPS</span>
            </span>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] px-3 py-1.5 rounded-lg flex flex-col">
            <span className="text-[10px] text-[#8b949e] font-semibold">Total Neural INT8</span>
            <span className="text-sm font-bold text-[#bc8cff] font-mono">
              {clusterSummary.totalInt8Tops} <span className="text-xs text-[#8b949e]">TOPS</span>
            </span>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] px-3 py-1.5 rounded-lg flex flex-col">
            <span className="text-[10px] text-[#8b949e] font-semibold">Unified Memory</span>
            <span className="text-sm font-bold text-[#3fb950] font-mono">
              {clusterSummary.usedVramGb} / {clusterSummary.totalVramGb} <span className="text-xs text-[#8b949e]">GB</span>
            </span>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] px-3 py-1.5 rounded-lg flex flex-col">
            <span className="text-[10px] text-[#8b949e] font-semibold">Aggregate Power</span>
            <span className="text-sm font-bold text-[#d29922] font-mono">
              {clusterSummary.aggregatePowerWatts} <span className="text-xs text-[#8b949e]">W</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRunBenchmark}
              disabled={isBenchmarking}
              className="flex items-center space-x-1.5 px-3 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              title="รันการทดสอบประมวลผลคู่ขนานทุกค่ายพร้อมกัน"
            >
              <Zap size={14} className={isBenchmarking ? 'animate-bounce' : ''} />
              <span>{isBenchmarking ? 'Benchmarking...' : 'Concurrent Test'}</span>
            </button>

            <button
              onClick={handleProbeHost}
              className="flex items-center space-x-1.5 px-3 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] rounded-lg text-xs font-bold transition-all"
              title="ตรวจจับฮาร์ดแวร์จริงของเครื่องผู้ใช้ผ่าน WebGPU / WebNN"
            >
              <Monitor size={14} />
              <span>ตรวจจับฮาร์ดแวร์เครื่อง</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. SUB-NAVIGATION TABS                                                 */}
      {/* ===================================================================== */}
      <div className="bg-[#161b22] px-4 border-b border-[#30363d] flex items-center justify-between overflow-x-auto">
        <div className="flex items-center space-x-1 py-2">
          <button
            onClick={() => setActiveView('TOPOLOGY')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'TOPOLOGY'
                ? 'bg-[#1f6feb] text-white shadow-sm font-bold'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Server size={14} />
            <span>ผังอุปกรณ์ข้ามค่าย (Topology Matrix)</span>
          </button>

          <button
            onClick={() => setActiveView('DISPATCHER')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'DISPATCHER'
                ? 'bg-[#1f6feb] text-white shadow-sm font-bold'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <ArrowRightLeft size={14} />
            <span>ตัวจัดสรรภาระงาน (Workload Dispatcher)</span>
          </button>

          <button
            onClick={() => setActiveView('MEMORY_FABRIC')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'MEMORY_FABRIC'
                ? 'bg-[#1f6feb] text-white shadow-sm font-bold'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Network size={14} />
            <span>หน่วยความจำรวม (Unified Memory & Fabric)</span>
          </button>

          <button
            onClick={() => setActiveView('WATCHDOG')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'WATCHDOG'
                ? 'bg-[#1f6feb] text-white shadow-sm font-bold'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <ShieldCheck size={14} />
            <span>ความทนทานต่อข้อผิดพลาด (Fault Tolerance & Failover)</span>
          </button>

          <button
            onClick={() => setActiveView('HOST_PROBE')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'HOST_PROBE'
                ? 'bg-[#1f6feb] text-white shadow-sm font-bold'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Terminal size={14} />
            <span>WebGPU / WebNN Host Diagnostics</span>
          </button>
        </div>

        <div className="text-xs text-[#8b949e] font-mono hidden md:block">
          Active Cluster Nodes: <span className="text-[#3fb950] font-bold">{clusterSummary.activeNodes}</span> / {clusterSummary.totalNodes}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. MAIN WORKSPACE VIEW CONTENT                                        */}
      {/* ===================================================================== */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0d1117]">
        {/* VIEW 1: TOPOLOGY MATRIX */}
        {activeView === 'TOPOLOGY' && (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-[#161b22] p-3 rounded-xl border border-[#30363d] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-[#8b949e] font-semibold">กรองยี่ห้อ (Vendor):</span>
                <select
                  value={filterVendor}
                  onChange={(e) => setFilterVendor(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] rounded-md px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                >
                  <option value="ALL">ทั้งหมด (All Vendors)</option>
                  <option value="NVIDIA">NVIDIA</option>
                  <option value="AMD">AMD</option>
                  <option value="Intel">Intel</option>
                  <option value="Apple">Apple</option>
                  <option value="Qualcomm">Qualcomm</option>
                  <option value="Groq">Groq</option>
                  <option value="Tenstorrent">Tenstorrent</option>
                </select>

                <span className="text-xs text-[#8b949e] font-semibold">ประเภท (Class):</span>
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] rounded-md px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                >
                  <option value="ALL">ทั้งหมด (All Classes)</option>
                  <option value="GPU_DISCRETE">Discrete GPU</option>
                  <option value="GPU_INTEGRATED">Integrated GPU</option>
                  <option value="NPU_DEDICATED">Dedicated NPU</option>
                  <option value="CPU">Host CPU</option>
                  <option value="TPU_LPU_ACCELERATOR">AI Accelerator / LPU</option>
                </select>
              </div>

              <div className="text-xs text-[#8b949e]">
                แสดงผล <span className="text-white font-bold">{filteredNodes.length}</span> อุปกรณ์ในคลัสเตอร์
              </div>
            </div>

            {/* Device Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredNodes.map(node => {
                const badge = getVendorBadge(node.vendor);
                return (
                  <div
                    key={node.id}
                    className={`bg-[#161b22] border rounded-xl p-4 transition-all ${
                      node.enabled
                        ? 'border-[#30363d] hover:border-[#58a6ff]/50 shadow-sm'
                        : 'border-[#30363d]/50 opacity-60'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {node.vendor}
                          </span>
                          <span className="text-[10px] text-[#8b949e] font-mono">
                            {node.deviceClass.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1">
                          {node.name}
                        </h3>
                        <div className="text-[11px] text-[#8b949e] font-mono">
                          {node.architecture}
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleNode(node.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          node.enabled
                            ? 'bg-[#238636]/20 border-[#238636]/40 text-[#3fb950] hover:bg-[#238636]/40'
                            : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white'
                        }`}
                        title={node.enabled ? 'คลิกเพื่อปิดการใช้งานโหนด' : 'คลิกเพื่อเปิดใช้งานโหนด'}
                      >
                        <Power size={14} />
                      </button>
                    </div>

                    {/* Metrics Bar */}
                    <div className="grid grid-cols-3 gap-2 bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d] text-center mb-3">
                      <div>
                        <div className="text-[10px] text-[#8b949e]">FP32 TFLOPS</div>
                        <div className="text-xs font-bold text-[#58a6ff] font-mono">{node.fp32Tflops}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#8b949e]">INT8 TOPS</div>
                        <div className="text-xs font-bold text-[#bc8cff] font-mono">{node.int8Tops}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#8b949e]">Power (TDP)</div>
                        <div className="text-xs font-bold text-[#d29922] font-mono">{node.telemetry.currentPowerWatts}W</div>
                      </div>
                    </div>

                    {/* VRAM / Memory Pool */}
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#8b949e]">
                          VRAM / SRAM ({node.memoryPool.type}):
                        </span>
                        <span className="text-white font-mono font-semibold">
                          {(node.telemetry.vramUsedMb / 1024).toFixed(1)} / {(node.memoryPool.totalMb / 1024).toFixed(1)} GB
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#21262d] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3fb950] transition-all duration-500"
                          style={{ width: `${Math.min(100, (node.telemetry.vramUsedMb / node.memoryPool.totalMb) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Live Load & Thermals */}
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#8b949e] flex items-center gap-1">
                          <Activity size={12} className="text-[#58a6ff]" /> Load Utilization:
                        </span>
                        <span className="text-white font-mono font-semibold">
                          {node.telemetry.utilizationPercent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#21262d] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            node.telemetry.utilizationPercent > 85 ? 'bg-[#f85149]' : 'bg-[#58a6ff]'
                          }`}
                          style={{ width: `${node.telemetry.utilizationPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Backend & Interconnect Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#30363d] text-[10px]">
                      <span className="px-1.5 py-0.5 bg-[#21262d] text-[#8b949e] rounded font-mono">
                        {node.interconnect}
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#1f6feb]/20 text-[#58a6ff] rounded font-mono font-bold">
                        {node.preferredBackend}
                      </span>
                      <span className="ml-auto text-[#8b949e] font-mono flex items-center gap-1">
                        <Flame size={12} className={node.telemetry.temperatureCelsius > 75 ? 'text-[#f85149]' : 'text-[#d29922]'} />
                        {node.telemetry.temperatureCelsius}°C
                      </span>
                    </div>

                    {/* Failover Test Button */}
                    <div className="mt-3 pt-2 border-t border-[#30363d]/60 flex justify-between items-center">
                      <span className="text-[10px] text-[#8b949e]">
                        Tasks: <span className="text-white font-mono">{node.telemetry.totalTasksCompleted}</span>
                      </span>
                      <button
                        onClick={() => handleSimulateCrash(node.id)}
                        className="px-2 py-0.5 bg-[#da3633]/20 hover:bg-[#da3633]/40 text-[#f85149] border border-[#da3633]/40 rounded text-[10px] font-bold transition-all"
                        title="ทดสอบจำลองไดรเวอร์ค้างเพื่อดูการกู้คืนข้ามยี่ห้ออัตโนมัติ"
                      >
                        Simulate TDR Crash
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: WORKLOAD DISPATCHER & BENCHMARK */}
        {activeView === 'DISPATCHER' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Interactive Dispatcher Form */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft size={16} className="text-[#58a6ff]" />
                  ส่งงานสู่ Heterogeneous Pipeline
                </h3>
                <p className="text-xs text-[#8b949e] mt-1">
                  เลือกประเภทงานประมวลผล เพื่อให้ระบบส่งงานไปยังฮาร์ดแวร์ที่เหมาะสมที่สุดตามความถนัดของแต่ละค่าย
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#8b949e]">ประเภทงาน (Workload Type):</label>
                <select
                  value={selectedWorkload}
                  onChange={(e) => setSelectedWorkload(e.target.value as WorkloadType)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                >
                  <option value="RAYTRACING_BVH">Hardware Ray Tracing & BVH (NVIDIA/AMD)</option>
                  <option value="NEURAL_INFERENCE_LLM">LLM & Dialogue Matrix Math (Groq/Apple/Tenstorrent)</option>
                  <option value="AUDIO_DSP_SYNTHESIS">Neural Audio Vocoder & TTS Dubbing (Apple ANE/Qualcomm)</option>
                  <option value="VIDEO_ENCODE_AV1">AV1 Video Transcoder & Streaming (Intel Arc)</option>
                  <option value="PHYSICS_COLLISION_ECS">Chaos Physics & Deterministic ECS (Host CPU/AMD)</option>
                  <option value="OCTREE_TERRAIN_PCG">Procedural Map & Octree Voxel PCG (Intel/AMD CPU)</option>
                  <option value="GRAPHICS_RASTER">Standard 3D Rasterization & Shaders</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#8b949e]">อุปกรณ์ปลายทาง (Target Compute Node):</label>
                <select
                  value={selectedTargetDevice}
                  onChange={(e) => setSelectedTargetDevice(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                >
                  <option value="AUTO_BALANCED">⚡ AUTO-BALANCED (ระบบวิเคราะห์ Affinity ที่ดีที่สุดให้อัตโนมัติ)</option>
                  {nodes.filter(n => n.enabled).map(n => (
                    <option key={n.id} value={n.id}>
                      [{n.vendor}] {n.name} ({n.deviceClass})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8b949e] font-semibold">ขนาดข้อมูล Payload:</span>
                  <span className="text-white font-mono font-bold">{payloadSizeMb} MB</span>
                </div>
                <input
                  type="range"
                  min={64}
                  max={4096}
                  step={64}
                  value={payloadSizeMb}
                  onChange={(e) => setPayloadSizeMb(Number(e.target.value))}
                  className="w-full accent-[#58a6ff] cursor-pointer"
                />
              </div>

              <button
                onClick={handleDispatchManualTask}
                className="w-full py-2.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded-lg text-xs font-bold transition-all shadow flex items-center justify-center space-x-2"
              >
                <Play size={14} />
                <span>ประมวลผลงานทันที (Dispatch Workload)</span>
              </button>

              <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] text-xs text-[#8b949e] space-y-1">
                <div className="font-semibold text-white">กลยุทธ์การจัดสรรอัจฉริยะ (Smart Policy):</div>
                <div>• คำนวณ Architecture Affinity Weight 50%</div>
                <div>• ตรวจสอบความว่างของฮาร์ดแวร์ (Utilization) 30%</div>
                <div>• ปริมาณขีดความสามารถประมวลผล (Throughput Capacity) 20%</div>
              </div>
            </div>

            {/* Right: Task Execution Stream */}
            <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity size={16} className="text-[#3fb950]" />
                    ประวัติการรันงานบนคลัสเตอร์ (Execution History)
                  </h3>
                  <p className="text-xs text-[#8b949e]">
                    แสดงความเร็วในการประมวลผล (Latency) และ Throughput ของแต่ละอุปกรณ์
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#21262d] text-white text-xs font-mono font-bold rounded-md">
                  {taskHistory.length} Recorded Tasks
                </span>
              </div>

              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[500px] pr-1">
                {taskHistory.map(task => {
                  const node = registry.getNodeById(task.assignedDeviceId);
                  const badge = node ? getVendorBadge(node.vendor) : { bg: 'bg-gray-800', text: 'text-gray-300', border: 'border-gray-700' };

                  return (
                    <div
                      key={task.id}
                      className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {node?.vendor || 'Multi-Vendor'}
                          </span>
                          <span className="font-bold text-white">{task.name}</span>
                          <span className="px-1.5 py-0.5 bg-[#21262d] text-[#8b949e] text-[10px] font-mono rounded">
                            {task.backendUsed}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#8b949e]">
                          โหนด: <span className="text-[#c9d1d9]">{node?.name || task.assignedDeviceId}</span> | 
                          Payload: <span className="font-mono text-white">{task.dataPayloadSizeMb} MB</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right font-mono">
                          <div className="text-[10px] text-[#8b949e]">Latency</div>
                          <div className="font-bold text-[#58a6ff]">{task.executionTimeMs} ms</div>
                        </div>

                        <div className="text-right font-mono">
                          <div className="text-[10px] text-[#8b949e]">Throughput</div>
                          <div className="font-bold text-[#3fb950]">{task.throughputScore} ops</div>
                        </div>

                        <span className="px-2 py-0.5 bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 rounded text-[10px] font-bold uppercase">
                          {task.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: UNIFIED MEMORY & INTERCONNECT FABRIC */}
        {activeView === 'MEMORY_FABRIC' && (
          <div className="space-y-6">
            {/* Cross-Vendor P2P Tester */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft size={16} className="text-[#58a6ff]" />
                  ทดสอบการส่งถ่ายเทนเซอร์ข้ามค่าย (Cross-Vendor Tensor Shard Transfer)
                </h3>
                <p className="text-xs text-[#8b949e]">
                  จำลองการเคลื่อนย้ายเทนเซอร์โมเดล AI ขนาดใหญ่ระหว่างการ์ดจอต่างยี่ห้อผ่าน PCIe Gen 5 และ CXL 3.0 Fabric
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="text-xs text-[#8b949e] font-semibold">จากโหนด (Source Node):</label>
                  <select
                    value={transferFromNodeId}
                    onChange={(e) => setTransferFromNodeId(e.target.value)}
                    className="w-full mt-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>[{n.vendor}] {n.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#8b949e] font-semibold">ไปยังโหนด (Destination Node):</label>
                  <select
                    value={transferToNodeId}
                    onChange={(e) => setTransferToNodeId(e.target.value)}
                    className="w-full mt-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>[{n.vendor}] {n.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-5">
                  <button
                    onClick={handleExecuteTensorTransfer}
                    className="w-full py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-xs font-bold transition-all shadow flex items-center justify-center space-x-2"
                  >
                    <Share2 size={14} />
                    <span>ทดสอบโอนถ่าย 512 MB Tensor</span>
                  </button>
                </div>
              </div>

              {transferResult && (
                <div className="p-3 bg-[#0d1117] border border-[#238636]/50 rounded-lg text-xs flex items-center justify-between">
                  <span className="text-[#3fb950] font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> โอนถ่ายสำเร็จผ่าน {transferResult.routingPath}
                  </span>
                  <div className="flex items-center space-x-4 font-mono">
                    <span className="text-white">Duration: <b className="text-[#58a6ff]">{transferResult.transferDurationMs} ms</b></span>
                    <span className="text-white">Bandwidth: <b className="text-[#d29922]">{transferResult.effectiveBandwidthGbps} GB/s</b></span>
                  </div>
                </div>
              )}
            </div>

            {/* Memory Pools Matrix */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers size={16} className="text-[#3fb950]" />
                สัดส่วนหน่วยความจำรวม (Unified Virtual Address Space)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {memoryFabric.getUnifiedMemoryPartitions().map((p, idx) => (
                  <div key={idx} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-xs space-y-2">
                    <div className="flex justify-between font-bold text-white">
                      <span>{p.poolName}</span>
                      <span className="text-[#58a6ff] font-mono">{(p.usedBytesMb / 1024).toFixed(1)} / {(p.totalBytesMb / 1024).toFixed(1)} GB</span>
                    </div>

                    <div className="w-full h-2 bg-[#21262d] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#238636]"
                        style={{ width: `${Math.min(100, (p.usedBytesMb / p.totalBytesMb) * 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-[#8b949e]">
                      <span>{p.memoryType}</span>
                      <span>{p.isZeroCopyUnified ? 'Zero-Copy Unified Pool' : 'Discrete Dedicated VRAM'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: FAULT TOLERANCE & FAILOVER WATCHDOG */}
        {activeView === 'WATCHDOG' && (
          <div className="space-y-6">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#3fb950]" />
                    บันทึกการเฝ้าระวังและกู้คืนระบบ (Fault Tolerance Radar)
                  </h3>
                  <p className="text-xs text-[#8b949e]">
                    ระบบคอยตรวจจับอุณหภูมิ, ไดรเวอร์สะดุด (TDR), และโยกย้ายงานไปยังอุปกรณ์ต่างยี่ห้อโดยอัตโนมัติ
                  </p>
                </div>

                <button
                  onClick={() => watchdog.clearAlerts()}
                  className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-xs font-semibold rounded text-[#c9d1d9]"
                >
                  ล้างประวัติ (Clear Logs)
                </button>
              </div>

              <div className="space-y-2.5">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-[#da3633]/10 border-[#da3633]/40'
                        : alert.severity === 'WARNING'
                        ? 'bg-[#d29922]/10 border-[#d29922]/40'
                        : alert.severity === 'RECOVERED'
                        ? 'bg-[#238636]/10 border-[#238636]/40'
                        : 'bg-[#0d1117] border-[#30363d]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-[#8b949e] font-mono">{alert.timestamp}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          alert.severity === 'CRITICAL' ? 'bg-[#f85149] text-white' :
                          alert.severity === 'WARNING' ? 'bg-[#d29922] text-black' :
                          alert.severity === 'RECOVERED' ? 'bg-[#3fb950] text-black' :
                          'bg-[#21262d] text-[#8b949e]'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="font-bold text-white">{alert.deviceName}</span>
                      </div>
                      <div className="text-white">{alert.message}</div>
                      <div className="text-[11px] text-[#58a6ff]">
                        <b>การบรรเทาข้อผิดพลาด:</b> {alert.mitigationActionTaken}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: HOST PROBE DIAGNOSTICS */}
        {activeView === 'HOST_PROBE' && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal size={16} className="text-[#58a6ff]" />
                ข้อมูลฮาร์ดแวร์จริงของผู้ใช้ (Real Host Hardware Diagnostics)
              </h3>
              <p className="text-xs text-[#8b949e]">
                ตรวจพบจากบราวเซอร์ของผู้ใช้ผ่าน W3C WebGPU, WebGL Unmasked Info, และ WebNN Standards
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] space-y-2 text-xs">
                <div className="text-white font-bold border-b border-[#30363d] pb-2">สถานะการเชื่อมต่อบราวเซอร์</div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">WebGPU Driver:</span>
                  <span className={(navigator as any).gpu ? 'text-[#3fb950] font-bold' : 'text-[#f85149]'}>
                    {(navigator as any).gpu ? 'AVAILABLE (Hardware Accelerated)' : 'SOFTWARE EMULATION'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">WebNN AI Context:</span>
                  <span className={(navigator as any).ml ? 'text-[#3fb950] font-bold' : 'text-[#8b949e]'}>
                    {(navigator as any).ml ? 'AVAILABLE (NPU Accelerated)' : 'FALLBACK SIMD'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Logical CPU Threads:</span>
                  <span className="text-white font-mono font-bold">{navigator.hardwareConcurrency || 8} Threads</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b949e]">Estimated Device RAM:</span>
                  <span className="text-white font-mono font-bold">{(navigator as any).deviceMemory || 16} GB</span>
                </div>
              </div>

              <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] space-y-2 text-xs">
                <div className="text-white font-bold border-b border-[#30363d] pb-2">ฮาร์ดแวร์กราฟิกที่ตรวจพบ (Probed Adapter)</div>
                {hostProbeData ? (
                  <>
                    <div className="text-white font-semibold">{hostProbeData.detectedGpuRenderer}</div>
                    <div className="text-[#8b949e]">ผู้ผลิตที่ระบุ: <span className="text-[#58a6ff] font-bold">{hostProbeData.detectedGpuVendor}</span></div>
                    <div className="text-[#3fb950] text-[11px]">✓ อุปกรณ์ได้รับการเพิ่มเข้าสารบบคลัสเตอร์เพื่อร่วมประมวลผลแล้ว</div>
                  </>
                ) : (
                  <div className="text-[#8b949e]">
                    กดปุ่ม <b className="text-white">"ตรวจจับฮาร์ดแวร์เครื่อง"</b> ด้านบน เพื่อรันการสำรวจสเปกเครื่องจริงของคุณ
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeterogeneousMultiComputeStudio;
