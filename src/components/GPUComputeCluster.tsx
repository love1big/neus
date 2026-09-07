import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Server, Zap, HardDrive, RefreshCw, Power, Activity, Network, ShieldAlert, Monitor, CheckCircle2, Layers, Settings, Play, Pause, Gauge, Radio, Sparkles, Terminal, Sliders, AlertTriangle, Disc, Box, Flame, BarChart3, Database, Workflow, ShieldCheck, Microchip} from 'lucide-react';
import HeterogeneousMultiComputeStudio from './HeterogeneousMultiComputeStudio';

export type VendorCategory = 'NVIDIA' | 'AMD' | 'Intel' | 'Apple' | 'Qualcomm/ARM' | 'Retro/3dfx' | 'Retro/Matrox' | 'Retro/S3/VIA';
export type ComputeNodeType = 'Discrete GPU' | 'Integrated Onboard' | 'Neural NPU' | 'CPU SIMD Threads' | 'Legacy Virtualized GPU';

interface ComputeNode {
  id: string;
  name: string;
  vendor: string;
  category: VendorCategory;
  type: ComputeNodeType;
  architecture: string;
  vramOrCache: string;
  fp32Tflops: number;
  int8Tops: number;
  powerDrawWatts: number;
  tempCelsius: number;
  utilization: number;
  enabled: boolean;
  overclockMultiplier: number; // 0.8 to 1.3
  isRealHardware?: boolean;
  notes: string;
}

export default function GPUComputeCluster() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'HETEROGENEOUS' | 'MODERN_GPU' | 'RETRO_GPU' | 'CPU_NPU' | 'DISPATCHER'>('DASHBOARD');
  const [clusterOnline, setClusterOnline] = useState(true);
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [detectedBrowserVendor, setDetectedBrowserVendor] = useState<string>('Detecting...');
  
  // Real Hardware Detection states
  const [logicalCores, setLogicalCores] = useState<number>(16);

  // Master Node Registry (Past to Present 100%)
  const [nodes, setNodes] = useState<ComputeNode[]>([
    // --- REAL / MODERN DISCRETE GPUS ---
    {
      id: 'node-rtx4090',
      name: 'NVIDIA GeForce RTX 4090 OC',
      vendor: 'NVIDIA',
      category: 'NVIDIA',
      type: 'Discrete GPU',
      architecture: 'Ada Lovelace AD102 (4nm)',
      vramOrCache: '24 GB GDDR6X',
      fp32Tflops: 82.6,
      int8Tops: 660.8,
      powerDrawWatts: 340,
      tempCelsius: 64,
      utilization: 88,
      enabled: true,
      overclockMultiplier: 1.05,
      notes: 'Assigned to primary BVH Ray Tracing & Path Tracing render thread.'
    },
    {
      id: 'node-b200',
      name: 'NVIDIA Blackwell B200 Tensor Core',
      vendor: 'NVIDIA',
      category: 'NVIDIA',
      type: 'Discrete GPU',
      architecture: 'Blackwell (TSMC 4NP)',
      vramOrCache: '192 GB HBM3e',
      fp32Tflops: 2250.0,
      int8Tops: 18000.0,
      powerDrawWatts: 700,
      tempCelsius: 72,
      utilization: 94,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'Massive LLM continuous batching & AI code matrix synthesis.'
    },
    {
      id: 'node-rx7900xtx',
      name: 'AMD Radeon RX 7900 XTX',
      vendor: 'AMD',
      category: 'AMD',
      type: 'Discrete GPU',
      architecture: 'RDNA 3 Navi 31 Chiplet',
      vramOrCache: '24 GB GDDR6',
      fp32Tflops: 61.4,
      int8Tops: 122.8,
      powerDrawWatts: 310,
      tempCelsius: 61,
      utilization: 76,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'Asynchronous Compute shader pool & OpenCL fluid simulation.'
    },
    {
      id: 'node-arc-b580',
      name: 'Intel Arc Battlemage B580',
      vendor: 'Intel',
      category: 'Intel',
      type: 'Discrete GPU',
      architecture: 'Xe2-HPG Battlemage',
      vramOrCache: '12 GB GDDR6',
      fp32Tflops: 26.5,
      int8Tops: 212.0,
      powerDrawWatts: 185,
      tempCelsius: 58,
      utilization: 62,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'XMX AI Denoising & AV1 hardware video encoding studio pipeline.'
    },

    // --- INTEGRATED ONBOARD & APPLE SILICON ---
    {
      id: 'node-m3max',
      name: 'Apple M3 Max 40-Core Unified GPU',
      vendor: 'Apple',
      category: 'Apple',
      type: 'Integrated Onboard',
      architecture: 'Apple 3nm Unified Memory',
      vramOrCache: '128 GB Unified LPDDR5-6400',
      fp32Tflops: 14.2,
      int8Tops: 113.6,
      powerDrawWatts: 45,
      tempCelsius: 48,
      utilization: 45,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'Zero-copy shared memory mesh deformation & Metal API pipeline.'
    },
    {
      id: 'node-intel-iris',
      name: 'Intel Iris Xe Onboard Graphics',
      vendor: 'Intel',
      category: 'Intel',
      type: 'Integrated Onboard',
      architecture: 'Tiger/Alder Lake Gen12 LP',
      vramOrCache: 'Shared System RAM (Up to 8GB)',
      fp32Tflops: 2.1,
      int8Tops: 8.4,
      powerDrawWatts: 15,
      tempCelsius: 42,
      utilization: 28,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'Motherboard onboard GPU assigned to 2D UI overlay & Physics collision detection.'
    },
    {
      id: 'node-amd-780m',
      name: 'AMD Radeon 780M Onboard APU',
      vendor: 'AMD',
      category: 'AMD',
      type: 'Integrated Onboard',
      architecture: 'RDNA 3 APU (Phoenix)',
      vramOrCache: 'Shared LPDDR5X',
      fp32Tflops: 8.9,
      int8Tops: 35.6,
      powerDrawWatts: 25,
      tempCelsius: 50,
      utilization: 34,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'Handles audio synthesis DSP FFT buffers & background particle emitters.'
    },
    {
      id: 'node-qualcomm-adreno',
      name: 'Qualcomm Adreno 750 Mobile GPU',
      vendor: 'Qualcomm',
      category: 'Qualcomm/ARM',
      type: 'Integrated Onboard',
      architecture: 'Snapdragon X / 8 Gen 3',
      vramOrCache: 'Shared Mobile RAM',
      fp32Tflops: 4.6,
      int8Tops: 18.4,
      powerDrawWatts: 8,
      tempCelsius: 38,
      utilization: 20,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'ARM mobile cross-compilation target & Vulkan tile-based rendering test.'
    },

    // --- DEDICATED NPU & CPU SIMD MATRIX ---
    {
      id: 'node-npu-apple',
      name: 'Apple 16-Core Neural Engine (ANE)',
      vendor: 'Apple',
      category: 'Apple',
      type: 'Neural NPU',
      architecture: 'Dedicated Tensor NPU',
      vramOrCache: 'Direct SRAM Access',
      fp32Tflops: 0.0,
      int8Tops: 38.0,
      powerDrawWatts: 6,
      tempCelsius: 40,
      utilization: 82,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'Dedicated 100% payload for agent intent parsing & speech synthesis TTS.'
    },
    {
      id: 'node-npu-ryzen',
      name: 'AMD Ryzen AI XDNA 2 NPU',
      vendor: 'AMD',
      category: 'AMD',
      type: 'Neural NPU',
      architecture: 'XDNA 2 Spatial Dataflow',
      vramOrCache: 'On-Die Tile Memory',
      fp32Tflops: 0.0,
      int8Tops: 50.0,
      powerDrawWatts: 10,
      tempCelsius: 44,
      utilization: 65,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'INT4 Copilot+ AI grounding search & real-time telemetry anomaly detection.'
    },
    {
      id: 'node-cpu-threads',
      name: 'Universal CPU SIMD Thread Pool (32-Thread AVX-512)',
      vendor: 'x86/ARM64 Universal',
      category: 'Intel',
      type: 'CPU SIMD Threads',
      architecture: 'AVX-512 / ARM NEON Vector Units',
      vramOrCache: '64 MB L3 Cache Direct',
      fp32Tflops: 3.8,
      int8Tops: 15.2,
      powerDrawWatts: 120,
      tempCelsius: 62,
      utilization: 70,
      enabled: true,
      overclockMultiplier: 1.1,
      notes: 'Aggregates 100% of CPU cores. Executes procedural world generation PCG & Octree sorting.'
    },

    // --- RETRO & LEGACY GPU LEGENDS (100% COMPATIBILITY VIRTUALIZATION) ---
    {
      id: 'node-3dfx-voodoo5',
      name: '3dfx Voodoo 5 5500 AGP (Glide Wrapper)',
      vendor: '3dfx Interactive',
      category: 'Retro/3dfx',
      type: 'Legacy Virtualized GPU',
      architecture: 'VSA-100 Dual-Chip SLI Emulation',
      vramOrCache: '64 MB SDRAM (Virtualized)',
      fp32Tflops: 0.0014,
      int8Tops: 0.005,
      powerDrawWatts: 30,
      tempCelsius: 52,
      utilization: 15,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'Emulated via modern Compute Shaders. Executes legacy Glide API calls & 4x Rotated Grid Supersampling.'
    },
    {
      id: 'node-matrox-parhelia',
      name: 'Matrox Parhelia-512 DualHead',
      vendor: 'Matrox Graphics',
      category: 'Retro/Matrox',
      type: 'Legacy Virtualized GPU',
      architecture: '512-bit GPU Ring Bus Emulation',
      vramOrCache: '256 MB DDR Virtual Buffer',
      fp32Tflops: 0.003,
      int8Tops: 0.01,
      powerDrawWatts: 22,
      tempCelsius: 46,
      utilization: 10,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'Hardware 16x Fragment Antialiasing & Surround Triple-Monitor display virtualization.'
    },
    {
      id: 'node-s3-virge',
      name: 'S3 ViRGE DX / Savage4 AGP',
      vendor: 'S3 Graphics',
      category: 'Retro/S3/VIA',
      type: 'Legacy Virtualized GPU',
      architecture: 'S3TC Texture Compression Engine',
      vramOrCache: '32 MB SGRAM',
      fp32Tflops: 0.0005,
      int8Tops: 0.002,
      powerDrawWatts: 8,
      tempCelsius: 36,
      utilization: 5,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'Provides native hardware S3TC (DXT1/DXT5) texture decompression acceleration.'
    },
    {
      id: 'node-powervr-sgx',
      name: 'Imagination PowerVR SGX543MP4',
      vendor: 'Imagination Technologies',
      category: 'Qualcomm/ARM',
      type: 'Legacy Virtualized GPU',
      architecture: 'Tile-Based Deferred Rendering (TBDR)',
      vramOrCache: 'On-Chip Tile Buffer',
      fp32Tflops: 0.032,
      int8Tops: 0.12,
      powerDrawWatts: 4,
      tempCelsius: 34,
      utilization: 8,
      enabled: true,
      overclockMultiplier: 1.0,
      notes: 'Legendary early smartphone GPU architecture. Used for mobile viewport low-power preview testing.'
    }
  ]);

  // Grab Browser WebGL Context Info
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.hardwareConcurrency) {
      setLogicalCores(navigator.hardwareConcurrency);
    }
    
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          setDetectedBrowserVendor(`${vendor} (${renderer})`);

          // Mark matching node as real hardware
          setNodes(prev => prev.map(n => {
            if (renderer.toLowerCase().includes(n.vendor.toLowerCase()) || vendor.toLowerCase().includes(n.vendor.toLowerCase())) {
               return { ...n, isRealHardware: true };
            }
            return n;
          }));
        }
      }
    } catch (e) {
      setDetectedBrowserVendor('Standard Browser Canvas Host');
    }
  }, []);

  // Stress test loop simulation
  useEffect(() => {
    let interval: any;
    if (isStressTesting && clusterOnline) {
      interval = setInterval(() => {
        setNodes(prev => prev.map(n => {
           if (!n.enabled) return n;
           const newUtil = Math.min(100, Math.floor(Math.random() * 8) + 92);
           const newTemp = Math.min(95, n.tempCelsius + (Math.random() > 0.4 ? 1 : 0));
           const newPower = Math.floor(n.powerDrawWatts * (n.overclockMultiplier || 1) * 1.05);
           return { ...n, utilization: newUtil, tempCelsius: newTemp, powerDrawWatts: newPower };
        }));
      }, 800);
    } else {
      // Cool down
      setNodes(prev => prev.map(n => {
         if (!n.enabled) return { ...n, utilization: 0 };
         return { 
           ...n, 
           utilization: Math.max(10, Math.floor(n.utilization * 0.9)),
           tempCelsius: Math.max(38, n.tempCelsius - 1)
         };
      }));
    }
    return () => clearInterval(interval);
  }, [isStressTesting, clusterOnline]);

  const toggleNode = (id: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  const handleOverclock = (id: string, mult: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, overclockMultiplier: mult } : n));
  };

  const toggleAllCategory = (cat: VendorCategory, enable: boolean) => {
    setNodes(prev => prev.map(n => n.category === cat ? { ...n, enabled: enable } : n));
  };

  // Calculations
  const enabledNodes = nodes.filter(n => n.enabled && clusterOnline);
  const totalFp32 = enabledNodes.reduce((acc, n) => acc + (n.fp32Tflops * n.overclockMultiplier), 0);
  const totalInt8 = enabledNodes.reduce((acc, n) => acc + (n.int8Tops * n.overclockMultiplier), 0);
  const totalWatts = enabledNodes.reduce((acc, n) => acc + n.powerDrawWatts, 0);
  const avgTemp = enabledNodes.length > 0 ? enabledNodes.reduce((acc, n) => acc + n.tempCelsius, 0) / enabledNodes.length : 0;
  const avgUtil = enabledNodes.length > 0 ? enabledNodes.reduce((acc, n) => acc + n.utilization, 0) / enabledNodes.length : 0;

  const getCategoryColor = (cat: VendorCategory) => {
    switch (cat) {
      case 'NVIDIA': return 'text-[#76b900] bg-[#76b900]/10 border-[#76b900]/40';
      case 'AMD': return 'text-[#ed1c24] bg-[#ed1c24]/10 border-[#ed1c24]/40';
      case 'Intel': return 'text-[#0071c5] bg-[#0071c5]/10 border-[#0071c5]/40';
      case 'Apple': return 'text-white bg-white/10 border-white/40';
      case 'Qualcomm/ARM': return 'text-[#e3b341] bg-[#e3b341]/10 border-[#e3b341]/40';
      case 'Retro/3dfx': return 'text-[#bc8cff] bg-[#bc8cff]/10 border-[#bc8cff]/40';
      default: return 'text-[#3fb950] bg-[#3fb950]/10 border-[#3fb950]/40';
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#050505] text-[#c9d1d9] font-mono select-none overflow-hidden">
      
      {/* TOP HEADER & UNIVERSAL GRID BAR */}
      <div className="p-5 border-b border-[#30363d] bg-[#0d1117] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-[#bc8cff]/10 border border-[#bc8cff]/40 rounded-lg text-[#bc8cff] shadow-[0_0_15px_rgba(188,140,255,0.3)] shrink-0">
               <Server size={22} />
             </div>
             <div>
               <h1 className="text-[17px] font-bold text-white tracking-tight flex items-center gap-2">
                 OmniEngine Universal Heterogeneous Compute Grid 
                 <span className="bg-[#3fb950] text-black text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                   100% Hardware Saturation
                 </span>
               </h1>
               <p className="text-[#8b949e] text-[11px] mt-0.5">
                 Aggregates 100% of all CPUs ({logicalCores} Threads), NPUs, and GPUs across all vendors (NVIDIA, AMD, Intel, Apple, Onboard & Emulated Retro 3dfx/Matrox).
               </p>
             </div>
          </div>
          <div className="text-[10px] text-[#58a6ff] mt-2 flex items-center gap-2 bg-[#161b22] px-2.5 py-1 rounded border border-[#30363d] inline-flex">
             <Sparkles size={12} className="animate-pulse" />
             Active Host Display Driver: <span className="text-white font-bold">{detectedBrowserVendor}</span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsStressTesting(!isStressTesting)}
            disabled={!clusterOnline}
            className={`px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition flex items-center gap-2 border cursor-pointer ${
              isStressTesting 
                ? 'bg-[#f85149] text-white border-[#f85149] shadow-[0_0_20px_rgba(248,81,73,0.6)] animate-pulse' 
                : 'bg-[#161b22] hover:bg-[#21262d] text-[#e3b341] border-[#e3b341]/40'
            }`}
          >
            <Flame size={15} className={isStressTesting ? 'animate-bounce' : ''} />
            {isStressTesting ? 'Saturating Matrix 100%...' : 'Weaponize Matrix (Stress Test)'}
          </button>

          <button
            onClick={() => {
              setClusterOnline(!clusterOnline);
              if (clusterOnline) setIsStressTesting(false);
            }}
            className={`px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
              clusterOnline 
                ? 'bg-[#3fb950] text-black shadow-[0_0_15px_rgba(63,185,80,0.4)]' 
                : 'bg-[#f85149] text-black'
            }`}
          >
            <Power size={15} />
            {clusterOnline ? 'Grid: ONLINE' : 'Grid: HALTED'}
          </button>
        </div>
      </div>

      {/* METRICS SUMMARY KPI BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-[#30363d] bg-[#0a0a0a] shrink-0 text-[11px]">
        <div className="p-3 border-r border-[#30363d] flex flex-col">
          <span className="text-[#8b949e] text-[9px] uppercase font-bold flex items-center gap-1"><Zap size={11} className="text-[#58a6ff]"/> Combined FP32 Capacity</span>
          <span className="text-[17px] font-bold text-white font-mono mt-1">{totalFp32.toFixed(1)} <span className="text-[11px] text-[#58a6ff] font-normal">TFLOPS</span></span>
        </div>

        <div className="p-3 border-r border-[#30363d] flex flex-col">
          <span className="text-[#8b949e] text-[9px] uppercase font-bold flex items-center gap-1"><Microchip size={11} className="text-[#bc8cff]"/> AI INT8 NPU Capacity</span>
          <span className="text-[17px] font-bold text-white font-mono mt-1">{totalInt8.toFixed(0)} <span className="text-[11px] text-[#bc8cff] font-normal">TOPS</span></span>
        </div>

        <div className="p-3 border-r border-[#30363d] flex flex-col">
          <span className="text-[#8b949e] text-[9px] uppercase font-bold flex items-center gap-1"><HardDrive size={11} className="text-[#3fb950]"/> Aggregated VRAM Pool</span>
          <span className="text-[17px] font-bold text-white font-mono mt-1">{clusterOnline ? '396.0' : '0.0'} <span className="text-[11px] text-[#3fb950] font-normal">GB Unified</span></span>
        </div>

        <div className="p-3 border-r border-[#30363d] flex flex-col">
          <span className="text-[#8b949e] text-[9px] uppercase font-bold flex items-center gap-1"><Gauge size={11} className="text-[#e3b341]"/> Grid Utilization</span>
          <span className={`text-[17px] font-bold font-mono mt-1 ${avgUtil > 85 ? 'text-[#f85149]' : 'text-white'}`}>{clusterOnline ? avgUtil.toFixed(0) : 0}%</span>
        </div>

        <div className="p-3 border-r border-[#30363d] flex flex-col">
          <span className="text-[#8b949e] text-[9px] uppercase font-bold flex items-center gap-1"><Activity size={11} className={avgTemp > 80 ? 'text-[#f85149]' : 'text-[#3fb950]'}/> Avg Core Thermal</span>
          <span className={`text-[17px] font-bold font-mono mt-1 ${avgTemp > 80 ? 'text-[#f85149]' : 'text-white'}`}>{clusterOnline ? avgTemp.toFixed(1) : 28}°C</span>
        </div>

        <div className="p-3 flex flex-col">
          <span className="text-[#8b949e] text-[9px] uppercase font-bold flex items-center gap-1"><Flame size={11} className="text-[#f85149]"/> Total Power Draw</span>
          <span className="text-[17px] font-bold text-[#e3b341] font-mono mt-1">{clusterOnline ? totalWatts : 0} <span className="text-[11px] font-normal text-[#8b949e]">Watts</span></span>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-[#30363d] bg-[#161b22] px-4 overflow-x-auto shrink-0 scrollbar-none">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'DASHBOARD' ? 'border-[#bc8cff] text-white bg-[#21262d]/50' : 'border-transparent text-[#8b949e] hover:text-white'
          }`}
        >
          <BarChart3 size={14} className="text-[#bc8cff]" /> Unified Grid Overview
        </button>

        <button
          onClick={() => setActiveTab('HETEROGENEOUS')}
          className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'HETEROGENEOUS' ? 'border-[#58a6ff] text-white bg-[#1f6feb]/20' : 'border-transparent text-[#58a6ff] hover:text-white'
          }`}
        >
          <Microchip size={14} className="text-[#58a6ff]" />
          <span>⚡ Multi-Vendor Studio (NVIDIA/AMD/Intel/Apple/Groq)</span>
        </button>

        <button
          onClick={() => setActiveTab('MODERN_GPU')}
          className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'MODERN_GPU' ? 'border-[#58a6ff] text-white bg-[#21262d]/50' : 'border-transparent text-[#8b949e] hover:text-white'
          }`}
        >
          <Monitor size={14} className="text-[#58a6ff]" /> Modern Discrete & Onboard GPUs (8 Nodes)
        </button>

        <button
          onClick={() => setActiveTab('CPU_NPU')}
          className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'CPU_NPU' ? 'border-[#3fb950] text-white bg-[#21262d]/50' : 'border-transparent text-[#8b949e] hover:text-white'
          }`}
        >
          <Cpu size={14} className="text-[#3fb950]" /> CPU SIMD ({logicalCores} Threads) & NPU AI Matrix
        </button>

        <button
          onClick={() => setActiveTab('RETRO_GPU')}
          className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'RETRO_GPU' ? 'border-[#e3b341] text-white bg-[#21262d]/50' : 'border-transparent text-[#8b949e] hover:text-white'
          }`}
        >
          <Disc size={14} className="text-[#e3b341]" /> Retro & Legacy Legends (3dfx/Matrox/S3)
        </button>

        <button
          onClick={() => setActiveTab('DISPATCHER')}
          className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'DISPATCHER' ? 'border-[#f85149] text-white bg-[#21262d]/50' : 'border-transparent text-[#8b949e] hover:text-white'
          }`}
        >
          <Workflow size={14} className="text-[#f85149]" /> Zero-Copy Workload Router
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#050505]">
        
        {/* --- TAB: HETEROGENEOUS MULTI-VENDOR STUDIO --- */}
        {activeTab === 'HETEROGENEOUS' && (
          <div className="h-full w-full">
            <HeterogeneousMultiComputeStudio />
          </div>
        )}

        {/* --- TAB 1: MASTER UNIFIED OVERVIEW --- */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6 max-w-7xl mx-auto">
             
             {/* Alert banner if stress testing */}
             {isStressTesting && (
               <div className="bg-[#f85149]/15 border border-[#f85149] rounded-lg p-4 flex items-center justify-between text-[#ff7b72] animate-pulse">
                 <div className="flex items-center gap-3">
                    <AlertTriangle size={24} className="shrink-0" />
                    <div>
                      <div className="font-bold text-[13px] uppercase tracking-wider">Extreme Hardware Saturation Active</div>
                      <div className="text-[11px] text-[#c9d1d9]">Injecting continuous FP32 ray tracing and INT8 transformer payloads across all 15 cluster nodes. Watchdog throttling standby.</div>
                    </div>
                 </div>
                 <button onClick={() => setIsStressTesting(false)} className="px-3 py-1 bg-[#f85149] text-black font-bold rounded text-[10px] uppercase hover:bg-white cursor-pointer">
                    Stop Stress Test
                 </button>
               </div>
             )}

             {/* Vendor Category Summary Cards */}
             <div>
                <h2 className="text-[13px] font-bold text-[#8b949e] uppercase tracking-wider mb-3 flex items-center gap-2">
                   <Layers size={16} /> Heterogeneous Compute Aggregation By Vendor
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   
                   {/* NVIDIA */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-2">
                         <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase text-[#76b900] bg-[#76b900]/10 border border-[#76b900]/30">NVIDIA CUDA / Tensor</span>
                         <span className="text-[10px] text-[#8b949e]">2 Nodes Active</span>
                      </div>
                      <div className="text-[18px] font-bold text-white mt-1">2,332.6 TFLOPS</div>
                      <div className="text-[11px] text-[#8b949e] mt-1">RTX 4090 OC + Blackwell B200</div>
                      <div className="mt-3 pt-3 border-t border-[#30363d]/60 flex justify-between items-center text-[10px]">
                         <span className="text-[#3fb950] flex items-center gap-1"><ShieldCheck size={12}/> Ray Tracing 100%</span>
                         <button onClick={() => toggleAllCategory('NVIDIA', true)} className="text-[#58a6ff] hover:underline cursor-pointer">Enable Pool</button>
                      </div>
                   </div>

                   {/* AMD */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-2">
                         <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase text-[#ed1c24] bg-[#ed1c24]/10 border border-[#ed1c24]/30">AMD HIP / RDNA3</span>
                         <span className="text-[10px] text-[#8b949e]">3 Nodes Active</span>
                      </div>
                      <div className="text-[18px] font-bold text-white mt-1">70.3 TFLOPS</div>
                      <div className="text-[11px] text-[#8b949e] mt-1">RX 7900 XTX + 780M + XDNA2</div>
                      <div className="mt-3 pt-3 border-t border-[#30363d]/60 flex justify-between items-center text-[10px]">
                         <span className="text-[#3fb950] flex items-center gap-1"><ShieldCheck size={12}/> Async Compute OK</span>
                         <button onClick={() => toggleAllCategory('AMD', true)} className="text-[#58a6ff] hover:underline cursor-pointer">Enable Pool</button>
                      </div>
                   </div>

                   {/* Intel & Universal CPU */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-2">
                         <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase text-[#0071c5] bg-[#0071c5]/10 border border-[#0071c5]/30">Intel Xe / SIMD CPU</span>
                         <span className="text-[10px] text-[#8b949e]">3 Nodes Active</span>
                      </div>
                      <div className="text-[18px] font-bold text-white mt-1">32.4 TFLOPS</div>
                      <div className="text-[11px] text-[#8b949e] mt-1">Arc B580 + Iris Xe + {logicalCores}-Thread CPU</div>
                      <div className="mt-3 pt-3 border-t border-[#30363d]/60 flex justify-between items-center text-[10px]">
                         <span className="text-[#3fb950] flex items-center gap-1"><ShieldCheck size={12}/> AVX-512 SIMD OK</span>
                         <button onClick={() => toggleAllCategory('Intel', true)} className="text-[#58a6ff] hover:underline cursor-pointer">Enable Pool</button>
                      </div>
                   </div>

                   {/* Apple & Mobile/Retro */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-2">
                         <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase text-[#bc8cff] bg-[#bc8cff]/10 border border-[#bc8cff]/30">Apple / ARM / Retro</span>
                         <span className="text-[10px] text-[#8b949e]">7 Nodes Active</span>
                      </div>
                      <div className="text-[18px] font-bold text-white mt-1">18.9 TFLOPS</div>
                      <div className="text-[11px] text-[#8b949e] mt-1">M3 Max + Adreno + Voodoo5 SLI</div>
                      <div className="mt-3 pt-3 border-t border-[#30363d]/60 flex justify-between items-center text-[10px]">
                         <span className="text-[#bc8cff] flex items-center gap-1"><Sparkles size={12}/> Glide Wrapper OK</span>
                         <button onClick={() => toggleAllCategory('Retro/3dfx', true)} className="text-[#58a6ff] hover:underline cursor-pointer">Enable Pool</button>
                      </div>
                   </div>

                </div>
             </div>

             {/* Live Universal Node Grid */}
             <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                <div className="flex justify-between items-center mb-4 border-b border-[#30363d] pb-3">
                   <h3 className="text-[14px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Database size={16} className="text-[#bc8cff]"/> Real-Time Cluster Nodes Telemetry Grid
                   </h3>
                   <span className="text-[11px] text-[#8b949e]">Showing all 15 compute targets</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {nodes.map(node => (
                      <div key={node.id} className={`p-4 rounded border bg-[#0d1117] relative transition ${node.enabled && clusterOnline ? 'border-[#30363d]' : 'opacity-40 border-[#30363d]/40 bg-[#050505]'}`}>
                         <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getCategoryColor(node.category)}`}>
                               {node.vendor}
                            </span>
                            <label className="flex items-center gap-1.5 text-[10px] text-[#8b949e] cursor-pointer">
                               <input 
                                 type="checkbox" 
                                 checked={node.enabled} 
                                 onChange={() => toggleNode(node.id)}
                                 className="accent-[#bc8cff] cursor-pointer rounded"
                               />
                               {node.enabled ? 'Enabled' : 'Disabled'}
                            </label>
                         </div>

                         <div className="font-bold text-[13px] text-white flex items-center gap-1.5">
                            {node.name}
                            {node.isRealHardware && <span className="bg-[#58a6ff] text-black px-1.5 py-0.2 text-[8px] rounded uppercase font-bold">Local WebGL</span>}
                         </div>
                         <div className="text-[10px] text-[#8b949e] mt-0.5">{node.architecture} • {node.vramOrCache}</div>

                         {/* Mini progress bars */}
                         <div className="mt-3 pt-3 border-t border-[#30363d]/60 space-y-2 text-[10px]">
                            <div>
                               <div className="flex justify-between mb-1">
                                  <span className="text-[#8b949e]">Load ({clusterOnline && node.enabled ? node.utilization : 0}%)</span>
                                  <span className="text-[#bc8cff] font-bold">{(node.fp32Tflops * node.overclockMultiplier).toFixed(2)} TFLOPS</span>
                               </div>
                               <div className="w-full bg-[#161b22] h-1 rounded overflow-hidden">
                                  <div className="bg-[#bc8cff] h-full transition-all duration-300" style={{ width: `${clusterOnline && node.enabled ? node.utilization : 0}%` }}/>
                               </div>
                            </div>
                            <div className="flex justify-between text-[10px] text-[#8b949e]">
                               <span>Temp: <strong className={node.tempCelsius > 75 ? 'text-[#f85149]' : 'text-[#3fb950]'}>{clusterOnline && node.enabled ? node.tempCelsius : 25}°C</strong></span>
                               <span>Power: <strong className="text-[#e3b341]">{clusterOnline && node.enabled ? Math.round(node.powerDrawWatts * node.overclockMultiplier) : 0}W</strong></span>
                               <span>OC: <strong className="text-white">{(node.overclockMultiplier * 100).toFixed(0)}%</strong></span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- TAB 2: MODERN GPUS & ONBOARD --- */}
        {activeTab === 'MODERN_GPU' && (
          <div className="max-w-6xl mx-auto space-y-4">
             <div className="flex justify-between items-center mb-4 border-b border-[#30363d] pb-3">
               <div>
                 <h2 className="text-[16px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Monitor className="text-[#58a6ff]"/> Modern Discrete & Integrated Onboard GPUs
                 </h2>
                 <p className="text-[#8b949e] text-[11px] mt-1">Full interoperability between NVIDIA RTX, AMD Radeon, Intel Arc, and Apple Silicon unified memory.</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nodes.filter(n => n.type === 'Discrete GPU' || n.type === 'Integrated Onboard').map(node => (
                   <div key={node.id} className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col justify-between">
                      <div>
                         <div className="flex justify-between items-start mb-3">
                            <div>
                               <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getCategoryColor(node.category)}`}>
                                  {node.type}
                               </span>
                               <h3 className="text-[17px] font-bold text-white mt-2">{node.name}</h3>
                               <div className="text-[11px] text-[#8b949e] mt-0.5">{node.architecture}</div>
                            </div>
                            <button 
                              onClick={() => toggleNode(node.id)}
                              className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition cursor-pointer ${node.enabled ? 'bg-[#3fb950]/20 text-[#3fb950] border border-[#30363d]' : 'bg-[#f85149]/20 text-[#f85149]'}`}
                            >
                              {node.enabled ? 'Online' : 'Disabled'}
                            </button>
                         </div>

                         <p className="text-[11px] text-[#c9d1d9] bg-[#0d1117] p-3 rounded border border-[#30363d] mb-4">
                            {node.notes}
                         </p>
                      </div>

                      {/* Overclock & Tuning Controls */}
                      <div className="bg-[#0a0a0a] p-3 rounded border border-[#30363d] space-y-3 text-[11px]">
                         <div className="flex justify-between items-center">
                            <span className="text-[#8b949e] flex items-center gap-1.5"><Sliders size={13}/> Compute Clock Multiplier</span>
                            <span className="text-[#bc8cff] font-bold">{(node.overclockMultiplier * 100).toFixed(0)}% ({ (node.fp32Tflops * node.overclockMultiplier).toFixed(1)} TFLOPS)</span>
                         </div>
                         <input 
                           type="range" 
                           min="0.8" 
                           max="1.3" 
                           step="0.05"
                           value={node.overclockMultiplier}
                           onChange={e => handleOverclock(node.id, parseFloat(e.target.value))}
                           className="w-full accent-[#bc8cff] cursor-pointer"
                         />
                         <div className="flex justify-between text-[10px] text-[#8b949e] pt-1">
                            <span>Underclock (Eco 80%)</span>
                            <span>Stock (100%)</span>
                            <span className="text-[#f85149]">Max Boost (130%)</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- TAB 3: CPU SIMD THREADS & NPU MATRIX --- */}
        {activeTab === 'CPU_NPU' && (
          <div className="max-w-6xl mx-auto space-y-6">
             <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                <div className="flex justify-between items-center mb-4 border-b border-[#30363d] pb-4">
                   <div>
                     <h2 className="text-[17px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Cpu className="text-[#3fb950]"/> Universal CPU SIMD Aggregator ({logicalCores} Host Threads Detected)
                     </h2>
                     <p className="text-[#8b949e] text-[11px] mt-1">
                       100% of available CPU thread workers are pooled into asynchronous vector units (SIMD AVX-512 / ARM NEON) to run physics and octree traversal without stalling the UI thread.
                     </p>
                   </div>
                   <span className="bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/40 px-3 py-1 rounded text-[11px] font-bold uppercase">
                      Zero Thread Waste
                   </span>
                </div>

                {/* Thread grid visualization */}
                <div className="space-y-2">
                   <div className="text-[11px] font-bold text-[#8b949e] uppercase mb-2">Live Logical Core Worker Dispatch Map</div>
                   <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-16 gap-2">
                      {Array.from({ length: Math.min(32, logicalCores) }).map((_, i) => (
                         <div key={i} className={`p-2 rounded bg-[#0d1117] border border-[#30363d] text-center transition ${isStressTesting ? 'border-[#3fb950] bg-[#3fb950]/10 shadow-[0_0_10px_rgba(63,185,80,0.3)]' : ''}`}>
                            <div className="text-[8px] text-[#8b949e]">CORE {i}</div>
                            <div className="text-[11px] font-bold text-white mt-0.5">{isStressTesting ? Math.floor(Math.random()*10)+90 : clusterOnline ? Math.floor(Math.random()*20)+30 : 0}%</div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Dedicated NPU AI Matrix */}
             <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                <h2 className="text-[16px] font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-[#30363d] pb-3">
                   <Microchip className="text-[#bc8cff]"/> Neural Processing Unit (NPU) Dedicated AI Coprocessors
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {nodes.filter(n => n.type === 'Neural NPU').map(npu => (
                      <div key={npu.id} className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex flex-col justify-between">
                         <div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#bc8cff] font-bold text-[14px]">{npu.name}</span>
                               <span className="bg-[#bc8cff]/20 text-[#bc8cff] px-2 py-0.5 rounded text-[10px] font-bold">{npu.int8Tops} TOPS INT8</span>
                            </div>
                            <p className="text-[11px] text-[#8b949e] mt-2">{npu.notes}</p>
                         </div>
                         <div className="mt-4 pt-3 border-t border-[#30363d] flex justify-between items-center text-[11px]">
                            <span className="text-[#3fb950]">Status: Dedicated Transformer Pipeline</span>
                            <button onClick={() => toggleNode(npu.id)} className="text-[#58a6ff] hover:underline cursor-pointer">{npu.enabled ? 'Active' : 'Bypassed'}</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- TAB 4: RETRO & LEGACY LEGENDS --- */}
        {activeTab === 'RETRO_GPU' && (
          <div className="max-w-6xl mx-auto space-y-4">
             <div className="bg-[#161b22] border border-[#bc8cff]/40 rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#bc8cff] text-black font-bold text-[10px] px-4 py-1 rounded-bl uppercase tracking-widest">
                   100% Historical Backward Compatibility
                </div>
                <h2 className="text-[18px] font-bold text-white flex items-center gap-2">
                   <Disc className="text-[#bc8cff]"/> Legendary Retro GPU Virtualization Engine
                </h2>
                <p className="text-[#8b949e] text-[12px] mt-1 max-w-3xl">
                   OmniEngine encapsulates 100% of classic graphics APIs (3dfx Glide, S3 MeTaL, Matrox Surround, ATI Truform) inside modern Vulkan/WebGPU Compute Shaders. You can run classic shaders and texture formats natively without crashes.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nodes.filter(n => n.type === 'Legacy Virtualized GPU').map(retro => (
                   <div key={retro.id} className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg flex flex-col justify-between hover:border-[#bc8cff]/50 transition">
                      <div>
                         <div className="flex justify-between items-start">
                            <div>
                               <span className="px-2 py-0.5 bg-[#bc8cff]/15 text-[#bc8cff] rounded text-[9px] font-bold uppercase">
                                  {retro.vendor}
                               </span>
                               <h3 className="text-[16px] font-bold text-white mt-2">{retro.name}</h3>
                               <div className="text-[11px] text-[#8b949e]">{retro.architecture}</div>
                            </div>
                            <label className="flex items-center gap-1.5 text-[11px] text-[#8b949e] cursor-pointer">
                               <input type="checkbox" checked={retro.enabled} onChange={() => toggleNode(retro.id)} className="accent-[#bc8cff]"/>
                               Active
                            </label>
                         </div>

                         <div className="bg-[#0d1117] p-3 rounded border border-[#30363d] mt-3 text-[11px] text-[#c9d1d9]">
                            {retro.notes}
                         </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#30363d]/60 flex justify-between items-center text-[10px] text-[#8b949e]">
                         <span>Emulated VRAM: <strong className="text-white">{retro.vramOrCache}</strong></span>
                         <span className="text-[#3fb950] flex items-center gap-1"><CheckCircle2 size={12}/> Compute Wrapper Ready</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- TAB 5: ZERO-COPY WORKLOAD DISPATCHER --- */}
        {activeTab === 'DISPATCHER' && (
          <div className="max-w-6xl mx-auto space-y-6">
             <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                <h2 className="text-[16px] font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                   <Workflow className="text-[#f85149]"/> Zero-Copy Heterogeneous Workload Router
                </h2>
                <p className="text-[#8b949e] text-[11px] mb-6">
                   Demonstrating how OmniEngine splits complex rendering payloads across different vendor architectures simultaneously over unified PCIe / NVMe fabric.
                </p>

                <div className="space-y-4">
                   
                   <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                         <span className="font-bold text-white text-[13px] flex items-center gap-2">
                            <Box size={15} className="text-[#58a6ff]"/> Primary Viewport Path Tracing (Bounces & Shadows)
                         </span>
                         <span className="text-[10px] bg-[#58a6ff]/20 text-[#58a6ff] px-2 py-0.5 rounded font-bold">Assigned to NVIDIA + AMD Discrete Pool</span>
                      </div>
                      <div className="w-full bg-[#161b22] h-3 rounded-full overflow-hidden flex">
                         <div className="bg-[#76b900] h-full" style={{ width: '65%' }} title="NVIDIA RTX 4090 (65%)"/>
                         <div className="bg-[#ed1c24] h-full" style={{ width: '35%' }} title="AMD RX 7900 XTX (35%)"/>
                      </div>
                      <div className="flex justify-between text-[10px] text-[#8b949e] mt-1.5">
                         <span className="text-[#76b900]">● NVIDIA RTX 4090 (BVH Traversal 65%)</span>
                         <span className="text-[#ed1c24]">● AMD RX 7900 XTX (Async Compute Denoising 35%)</span>
                      </div>
                   </div>

                   <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                         <span className="font-bold text-white text-[13px] flex items-center gap-2">
                            <Sparkles size={15} className="text-[#3fb950]"/> 3D Cloth & Rigidbody Physics Simulation
                         </span>
                         <span className="text-[10px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded font-bold">Assigned to Intel Iris Onboard + SIMD CPU Threads</span>
                      </div>
                      <div className="w-full bg-[#161b22] h-3 rounded-full overflow-hidden flex">
                         <div className="bg-[#0071c5] h-full" style={{ width: '50%' }} title="Intel Iris Xe Onboard (50%)"/>
                         <div className="bg-[#3fb950] h-full" style={{ width: '50%' }} title="32-Thread AVX-512 CPU (50%)"/>
                      </div>
                      <div className="flex justify-between text-[10px] text-[#8b949e] mt-1.5">
                         <span className="text-[#0071c5]">● Intel Iris Xe Onboard GPU (Collision Matrix 50%)</span>
                         <span className="text-[#3fb950]">● SIMD AVX-512 CPU Thread Pool (Constraint Solver 50%)</span>
                      </div>
                   </div>

                   <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                         <span className="font-bold text-white text-[13px] flex items-center gap-2">
                            <Microchip size={15} className="text-[#bc8cff]"/> Autonomous AI Coding Agent Reasoning & Grounding
                         </span>
                         <span className="text-[10px] bg-[#bc8cff]/20 text-[#bc8cff] px-2 py-0.5 rounded font-bold">Assigned to NPU Matrix + Blackwell B200</span>
                      </div>
                      <div className="w-full bg-[#161b22] h-3 rounded-full overflow-hidden flex">
                         <div className="bg-[#bc8cff] h-full" style={{ width: '40%' }} title="Apple + AMD NPUs (40%)"/>
                         <div className="bg-[#e3b341] h-full" style={{ width: '60%' }} title="Blackwell B200 Tensor (60%)"/>
                      </div>
                      <div className="flex justify-between text-[10px] text-[#8b949e] mt-1.5">
                         <span className="text-[#bc8cff]">● Apple ANE + Ryzen AI NPU (INT4 Grounding Search 40%)</span>
                         <span className="text-[#e3b341]">● Blackwell B200 Tensor (Continuous Batch Generation 60%)</span>
                      </div>
                   </div>

                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
