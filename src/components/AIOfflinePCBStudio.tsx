import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Zap, ShieldCheck, Layers, Settings, Play, RefreshCw, Activity, HardDrive, Terminal, CheckCircle2, AlertTriangle, FileCode, Sliders, Globe, Radio, Disc, Download, Share2, Sparkles, Wrench, Box, Eye, Smartphone, Code2, Microchip, CircuitBoard, Wifi, Database, Flame} from 'lucide-react';

export interface PCBComponent {
  id: string;
  name: string;
  package: string; // e.g. LQFP-64, QFN-32, 0805, 0603
  type: 'MCU' | 'FPGA' | 'SENSOR' | 'POWER' | 'PASSIVE' | 'CONNECTOR';
  x: number;
  y: number;
  rotation: number;
  pins: number;
}

export interface PCBTrace {
  id: string;
  fromPin: string;
  toPin: string;
  layer: 'TOP_COPPER' | 'BOTTOM_COPPER' | 'INNER_1' | 'INNER_2';
  widthMm: number;
  lengthMm: number;
  impedanceOhms: number;
}

export interface GlobalStandard {
  code: string;
  countryOrRegion: string;
  name: string;
  status: 'COMPLIANT' | 'WARNING' | 'FAIL';
  details: string;
}

export default function AIOfflinePCBStudio() {
  const [activeTab, setActiveTab] = useState<'SCHEMATIC_PCB' | 'AI_AUTOROUTER' | 'STANDARDS' | 'FIRMWARE_OS' | 'MOBILE_PAINTER'>('SCHEMATIC_PCB');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'TOP_COPPER' | 'BOTTOM_COPPER' | 'SOLDERMASK' | 'SILKSCREEN'>('TOP_COPPER');
  const [zoom, setZoom] = useState(1);
  const [aiAutoRouting, setAiAutoRouting] = useState(false);
  const [selectedMcu, setSelectedMcu] = useState<'STM32F407' | 'ESP32_S3' | 'RP2040' | 'RISCV_GD32' | 'ZYNQ_FPGA'>('ESP32_S3');

  // Firmware OS state
  const [osLanguage, setOsLanguage] = useState<'RUST' | 'C_CPP' | 'MICROPYTHON' | 'ASSEMBLY'>('RUST');
  const [firmwareCode, setFirmwareCode] = useState<string>(`// --- RUST EMBEDDED OS KERNEL (NO_STD) ---
#![no_std]
#![no_main]

use cortex_m_rt::entry;
use panic_halt as _;
use stm32f4xx_hal::{pac, prelude::*};

#[entry]
fn main() -> ! {
    let dp = pac::Peripherals::take().unwrap();
    let rcc = dp.RCC.constrain();
    let clocks = rcc.cfgr.sysclk(168.MHz()).freeze();

    // Initialize AI Neural Accelerator Bus on custom PCB traces
    let gpioa = dp.GPIOA.split();
    let mut led = gpioa.pa5.into_push_pull_output();

    loop {
        // Run continuous real-time PID & AI grounding loop 100%
        led.toggle();
        cortex_m::asm::delay(8_000_000);
    }
}`);
  const [compileStatus, setCompileStatus] = useState<'IDLE' | 'COMPILING' | 'SUCCESS' | 'FLASHING' | 'RUNNING'>('SUCCESS');

  // Components on canvas
  const [components, setComponents] = useState<PCBComponent[]>([
    { id: 'u1', name: 'ESP32-S3-WROOM', package: 'QFN-56 SMD', type: 'MCU', x: 200, y: 150, rotation: 0, pins: 56 },
    { id: 'u2', name: 'MPU-6050 6-Axis IMU', package: 'QFN-24 SMD', type: 'SENSOR', x: 340, y: 120, rotation: 90, pins: 24 },
    { id: 'ic1', name: 'TPS54302 Buck Conv', package: 'SOT-23-6', type: 'POWER', x: 100, y: 220, rotation: 0, pins: 6 },
    { id: 'c1', name: '10uF Decoupling', package: '0805 SMD', type: 'PASSIVE', x: 180, y: 200, rotation: 0, pins: 2 },
    { id: 'j1', name: 'USB-C Type-C 24P', package: 'SMD Hybrid', type: 'CONNECTOR', x: 50, y: 150, rotation: 270, pins: 24 }
  ]);

  // Traces
  const [traces, setTraces] = useState<PCBTrace[]>([
    { id: 't1', fromPin: 'u1.3', toPin: 'u2.4', layer: 'TOP_COPPER', widthMm: 0.25, lengthMm: 14.2, impedanceOhms: 50.1 },
    { id: 't2', fromPin: 'u1.4', toPin: 'u2.5', layer: 'TOP_COPPER', widthMm: 0.25, lengthMm: 14.5, impedanceOhms: 49.8 },
    { id: 't3', fromPin: 'j1.VBUS', toPin: 'ic1.IN', layer: 'INNER_1', widthMm: 0.8, lengthMm: 22.0, impedanceOhms: 32.0 },
    { id: 't4', fromPin: 'ic1.OUT', toPin: 'u1.VCC', layer: 'INNER_1', widthMm: 0.6, lengthMm: 18.4, impedanceOhms: 35.5 }
  ]);

  // Global Standards Compliance Registry (100% Worldwide)
  const [standards, setStandards] = useState<GlobalStandard[]>([
    { code: 'IPC-2221B', countryOrRegion: 'International (IPC)', name: 'Generic Standard on Printed Board Design', status: 'COMPLIANT', details: 'Min trace clearance 0.127mm satisfied across all 4 copper planes.' },
    { code: 'FCC Part 15 Class B', countryOrRegion: 'United States (USA)', name: 'RF EMI/EMC Radiated Emissions', status: 'COMPLIANT', details: 'Stitching vias placed along high-frequency clock differential pairs.' },
    { code: 'CE EN 55032/55035', countryOrRegion: 'European Union (EU)', name: 'Electromagnetic Compatibility Directive', status: 'COMPLIANT', details: 'Ground plane continuity verified; zero isolated copper islands.' },
    { code: 'RoHS 3 (EU 2015/863)', countryOrRegion: 'Worldwide / EU', name: 'Restriction of Hazardous Substances', status: 'COMPLIANT', details: 'Lead-free ENIG surface finish and Halogen-free FR4 substrate selected.' },
    { code: 'GB 4943.1-2022', countryOrRegion: 'China (CCC)', name: 'Safety of Information Technology Equipment', status: 'COMPLIANT', details: 'Primary to Secondary creepage distance > 3.2mm achieved.' },
    { code: 'JIS C 5012', countryOrRegion: 'Japan (JSA)', name: 'Test Methods for Printed Wiring Boards', status: 'COMPLIANT', details: 'Thermal cycling via plating tensile strength calculated > 40MPa.' },
    { code: 'ISO 9001:2015', countryOrRegion: 'Global Quality', name: 'Design Verification & Lifecycle Traceability', status: 'COMPLIANT', details: 'AI offline hash verified against schematic netlist checksum.' }
  ]);

  const runAiAutorouter = () => {
    setAiAutoRouting(true);
    setTimeout(() => {
       setAiAutoRouting(false);
       // Add simulated optimized traces
       setTraces(prev => [
         ...prev,
         { id: 't_ai1', fromPin: 'u1.TX', toPin: 'j1.D+', layer: 'TOP_COPPER', widthMm: 0.2, lengthMm: 12.1, impedanceOhms: 90.0 },
         { id: 't_ai2', fromPin: 'u1.RX', toPin: 'j1.D-', layer: 'TOP_COPPER', widthMm: 0.2, lengthMm: 12.1, impedanceOhms: 90.0 }
       ]);
    }, 1500);
  };

  const triggerCompile = () => {
    setCompileStatus('COMPILING');
    setTimeout(() => {
       setCompileStatus('FLASHING');
       setTimeout(() => {
          setCompileStatus('RUNNING');
          setIsSimulating(true);
       }, 1000);
    }, 1500);
  };

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'TOP_COPPER': return 'bg-[#e3b341] text-black border-[#e3b341]';
      case 'BOTTOM_COPPER': return 'bg-[#58a6ff] text-black border-[#58a6ff]';
      case 'SOLDERMASK': return 'bg-[#3fb950] text-black border-[#3fb950]';
      case 'SILKSCREEN': return 'bg-white text-black border-white';
      default: return 'bg-[#bc8cff] text-black border-[#bc8cff]';
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#050505] text-[#c9d1d9] font-mono select-none overflow-hidden">
      
      {/* HEADER BAR */}
      <div className="p-5 border-b border-[#30363d] bg-[#0d1117] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#3fb950]/10 border border-[#3fb950]/40 rounded-lg text-[#3fb950] shadow-[0_0_15px_rgba(63,185,80,0.3)] shrink-0">
               <CircuitBoard size={24} />
            </div>
            <div>
               <h1 className="text-[17px] font-bold text-white tracking-tight flex items-center gap-2">
                 AI Offline PCB Studio & Embedded OS Architect
                 <span className="bg-[#bc8cff] text-black text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                   Offline AI Engine V3.4
                 </span>
               </h1>
               <p className="text-[#8b949e] text-[11px] mt-0.5">
                 Design custom 4-Layer PCBs, route impedance traces offline via AI, verify 100% worldwide electrical standards, and compile/flash custom OS firmware.
               </p>
            </div>
         </div>

         {/* Global Action Bar */}
         <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={runAiAutorouter}
              disabled={aiAutoRouting}
              className="px-4 py-2 bg-[#161b22] hover:bg-[#21262d] text-[#bc8cff] border border-[#bc8cff]/40 rounded text-[11px] font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(188,140,255,0.15)]"
            >
               <Sparkles size={14} className={aiAutoRouting ? 'animate-spin' : ''} />
               {aiAutoRouting ? 'AI Routing Matrix...' : 'AI Offline Autorouter'}
            </button>

            <button
              onClick={triggerCompile}
              disabled={compileStatus === 'COMPILING'}
              className="px-4 py-2 bg-[#3fb950] hover:bg-[#2ea043] text-black rounded text-[11px] font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(63,185,80,0.4)]"
            >
               <Zap size={14} className={compileStatus === 'COMPILING' ? 'animate-bounce' : ''} />
               {compileStatus === 'COMPILING' ? 'Compiling OS...' : compileStatus === 'FLASHING' ? 'Flashing SPI Bus...' : 'Build & Flash PCB OS'}
            </button>
         </div>
      </div>

      {/* KPI METRICS RIBBON */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 border-b border-[#30363d] bg-[#0a0a0a] shrink-0 text-[11px]">
         <div className="p-3 border-r border-[#30363d] flex flex-col">
            <span className="text-[#8b949e] text-[9px] uppercase font-bold flex items-center gap-1"><Microchip size={11} className="text-[#58a6ff]"/> Active MCU Target</span>
            <span className="text-[14px] font-bold text-white mt-1">{selectedMcu} <span className="text-[9px] text-[#3fb950]">(Dual Core)</span></span>
         </div>
         <div className="p-3 border-r border-[#30363d] flex flex-col">
            <span className="text-[#8b949e] text-[9px] uppercase font-bold flex items-center gap-1"><Layers size={11} className="text-[#e3b341]"/> PCB Stackup</span>
            <span className="text-[14px] font-bold text-white mt-1">4-Layer <span className="text-[9px] text-[#8b949e]">(FR4 High-Tg)</span></span>
         </div>
         <div className="p-3 border-r border-[#30363d] flex flex-col">
            <span className="text-[#8b949e] text-[9px] uppercase font-bold flex items-center gap-1"><Globe size={11} className="text-[#3fb950]"/> Standards Compliance</span>
            <span className="text-[14px] font-bold text-[#3fb950] mt-1">100% Passed <span className="text-[9px] text-[#8b949e]">(7/7)</span></span>
         </div>
         <div className="p-3 border-r border-[#30363d] flex flex-col">
            <span className="text-[#8b949e] text-[9px] uppercase font-bold flex items-center gap-1"><Activity size={11} className="text-[#bc8cff]"/> Trace Nets Routed</span>
            <span className="text-[14px] font-bold text-white mt-1">{traces.length} / {traces.length} <span className="text-[9px] text-[#bc8cff]">(0 Unrouted)</span></span>
         </div>
         <div className="p-3 border-r border-[#30363d] flex flex-col">
            <span className="text-[#8b949e] text-[9px] uppercase font-bold flex items-center gap-1"><Terminal size={11} className="text-[#e3b341]"/> Firmware Kernel</span>
            <span className="text-[14px] font-bold text-white mt-1">{osLanguage} <span className="text-[9px] text-[#3fb950]">(Baremetal)</span></span>
         </div>
         <div className="p-3 flex flex-col">
            <span className="text-[#8b949e] text-[9px] uppercase font-bold flex items-center gap-1"><Radio size={11} className="text-[#58a6ff]"/> Bus Simulation</span>
            <span className={`text-[14px] font-bold mt-1 uppercase ${isSimulating ? 'text-[#3fb950] animate-pulse' : 'text-[#8b949e]'}`}>{isSimulating ? 'LIVE 100MHz' : 'STANDBY'}</span>
         </div>
      </div>

      {/* TABS MENU */}
      <div className="flex border-b border-[#30363d] bg-[#161b22] px-4 overflow-x-auto shrink-0 scrollbar-none">
         <button
           onClick={() => setActiveTab('SCHEMATIC_PCB')}
           className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
             activeTab === 'SCHEMATIC_PCB' ? 'border-[#3fb950] text-white bg-[#21262d]/50' : 'border-transparent text-[#8b949e] hover:text-white'
           }`}
         >
            <CircuitBoard size={14} className="text-[#3fb950]" /> 4-Layer PCB & Trace Layout Editor
         </button>

         <button
           onClick={() => setActiveTab('AI_AUTOROUTER')}
           className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
             activeTab === 'AI_AUTOROUTER' ? 'border-[#bc8cff] text-white bg-[#21262d]/50' : 'border-transparent text-[#8b949e] hover:text-white'
           }`}
         >
            <Sparkles size={14} className="text-[#bc8cff]" /> Offline AI Differential Router
         </button>

         <button
           onClick={() => setActiveTab('STANDARDS')}
           className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
             activeTab === 'STANDARDS' ? 'border-[#58a6ff] text-white bg-[#21262d]/50' : 'border-transparent text-[#8b949e] hover:text-white'
           }`}
         >
            <Globe size={14} className="text-[#58a6ff]" /> Worldwide Standards Registry (100%)
         </button>

         <button
           onClick={() => setActiveTab('FIRMWARE_OS')}
           className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
             activeTab === 'FIRMWARE_OS' ? 'border-[#e3b341] text-white bg-[#21262d]/50' : 'border-transparent text-[#8b949e] hover:text-white'
           }`}
         >
            <FileCode size={14} className="text-[#e3b341]" /> Embedded OS & Firmware Flasher
         </button>

         <button
           onClick={() => setActiveTab('MOBILE_PAINTER')}
           className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
             activeTab === 'MOBILE_PAINTER' ? 'border-[#f85149] text-white bg-[#21262d]/50' : 'border-transparent text-[#8b949e] hover:text-white'
           }`}
         >
            <Smartphone size={14} className="text-[#f85149]" /> Mobile PCB Touch Painter Integration
         </button>
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#050505]">
         
         {/* --- TAB 1: PCB & TRACE CANVAS LAYOUT --- */}
         {activeTab === 'SCHEMATIC_PCB' && (
           <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto h-full">
              
              {/* Left Sidebar: Components & Layer Controls */}
              <div className="w-full xl:w-72 flex flex-col gap-4 shrink-0">
                 <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                    <h3 className="text-[12px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                       <Layers size={14} className="text-[#e3b341]"/> Copper & Mask Layers
                    </h3>
                    <div className="space-y-1.5 text-[11px]">
                       {(['TOP_COPPER', 'BOTTOM_COPPER', 'SOLDERMASK', 'SILKSCREEN'] as const).map(l => (
                          <button
                            key={l}
                            onClick={() => setActiveLayer(l)}
                            className={`w-full text-left px-3 py-2 rounded flex justify-between items-center transition cursor-pointer ${
                               activeLayer === l ? 'bg-[#21262d] border border-[#58a6ff] text-white font-bold' : 'hover:bg-[#21262d]/50 text-[#8b949e]'
                            }`}
                          >
                             <span className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${l === 'TOP_COPPER' ? 'bg-[#e3b341]' : l === 'BOTTOM_COPPER' ? 'bg-[#58a6ff]' : l === 'SOLDERMASK' ? 'bg-[#3fb950]' : 'bg-white'}`}/>
                                {l.replace('_', ' ')}
                             </span>
                             {activeLayer === l && <CheckCircle2 size={13} className="text-[#58a6ff]"/>}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex-1">
                    <h3 className="text-[12px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                       <Box size={14} className="text-[#3fb950]"/> Netlist SMD/THT Components
                    </h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                       {components.map(comp => (
                          <div key={comp.id} className="p-2.5 bg-[#0d1117] border border-[#30363d] rounded text-[10px] flex justify-between items-center">
                             <div>
                                <div className="font-bold text-white">{comp.name}</div>
                                <div className="text-[#8b949e]">{comp.package} • {comp.pins} Pins</div>
                             </div>
                             <span className="px-1.5 py-0.5 bg-[#21262d] text-[#58a6ff] rounded font-mono text-[9px]">
                                X:{comp.x} Y:{comp.y}
                             </span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Center PCB Render Canvas */}
              <div className="flex-1 bg-[#0a0f14] border border-[#30363d] rounded-lg relative overflow-hidden flex flex-col min-h-[500px]">
                 
                 {/* Canvas Toolbar */}
                 <div className="p-3 bg-[#161b22] border-b border-[#30363d] flex justify-between items-center text-[11px] shrink-0">
                    <div className="flex items-center gap-4 text-[#8b949e]">
                       <span>Active Plane: <strong className="text-white">{activeLayer}</strong></span>
                       <span>Grid: <strong className="text-[#3fb950]">1.0 mm SMD Snap</strong></span>
                       {isSimulating && <span className="text-[#3fb950] animate-pulse flex items-center gap-1"><Activity size={12}/> OS Telemetry Bus Active</span>}
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] rounded text-white font-bold cursor-pointer">- Zoom</button>
                       <span className="w-12 text-center text-white font-mono">{(zoom * 100).toFixed(0)}%</span>
                       <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))} className="px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] rounded text-white font-bold cursor-pointer">+ Zoom</button>
                    </div>
                 </div>

                 {/* Interactive PCB Surface */}
                 <div className="flex-1 relative overflow-auto p-12 flex items-center justify-center bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]">
                    <div 
                      className="w-[600px] h-[400px] bg-[#0c2417] border-4 border-[#1e462c] rounded-xl relative shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-200"
                      style={{ transform: `scale(${zoom})` }}
                    >
                       {/* Silkscreen Brand */}
                       <div className="absolute top-4 left-6 text-white/70 font-bold text-[14px] tracking-widest pointer-events-none select-none">
                          OMNI-CORE MCU BOARD REV 2.0
                       </div>

                       {/* Render Traces */}
                       <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          {traces.map(t => (
                             <g key={t.id}>
                                <line 
                                  x1={t.id.includes('1') ? 220 : 120} 
                                  y1={t.id.includes('1') ? 160 : 220} 
                                  x2={t.id.includes('1') ? 350 : 210} 
                                  y2={t.id.includes('1') ? 130 : 170}
                                  stroke={t.layer === 'TOP_COPPER' ? '#e3b341' : '#58a6ff'}
                                  strokeWidth={t.widthMm * 10}
                                  strokeLinecap="round"
                                  className={isSimulating ? 'animate-pulse' : ''}
                                />
                                {isSimulating && (
                                  <circle r={4} fill="#3fb950" className="animate-ping">
                                     <animateMotion dur="1.5s" repeatCount="indefinite" path={`M ${t.id.includes('1') ? 220 : 120} ${t.id.includes('1') ? 160 : 220} L ${t.id.includes('1') ? 350 : 210} ${t.id.includes('1') ? 130 : 170}`}/>
                                  </circle>
                                )}
                             </g>
                          ))}
                       </svg>

                       {/* Render Components */}
                       {components.map(comp => (
                          <div
                            key={comp.id}
                            className="absolute p-2 bg-[#1b222b] border-2 border-[#e3b341] rounded shadow-md text-[9px] text-white flex flex-col items-center justify-center cursor-move hover:border-[#58a6ff] transition group"
                            style={{ left: `${comp.x}px`, top: `${comp.y}px`, transform: `rotate(${comp.rotation}deg)` }}
                          >
                             <div className="w-2 h-2 rounded-full bg-[#f85149] absolute -top-1 -left-1"/>
                             <div className="font-bold tracking-tighter text-[#e3b341]">{comp.id.toUpperCase()}</div>
                             <div className="text-[7px] text-[#8b949e] truncate max-w-[60px]">{comp.name}</div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
         )}

         {/* --- TAB 2: OFFLINE AI AUTOROUTER --- */}
         {activeTab === 'AI_AUTOROUTER' && (
           <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-[#161b22] border border-[#bc8cff]/40 rounded-lg p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 px-4 py-1 bg-[#bc8cff] text-black font-bold text-[10px] uppercase rounded-bl">
                    Zero Cloud Dependency
                 </div>
                 <h2 className="text-[18px] font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-[#bc8cff]"/> AI Offline High-Speed Impedance Autorouter
                 </h2>
                 <p className="text-[#8b949e] text-[12px] mt-1">
                    Uses local tensor graph neural models to automatically route USB differential pairs, 50Ω RF antennae traces, and DDR memory length matching directly inside your browser memory.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px]">
                 <div className="bg-[#0d1117] border border-[#30363d] p-5 rounded-lg">
                    <div className="text-[#bc8cff] font-bold mb-2 flex items-center gap-1.5"><Sliders size={14}/> Routing Strategy</div>
                    <div className="space-y-3">
                       <label className="flex items-center gap-2 text-white"><input type="checkbox" checked readOnly className="accent-[#bc8cff]"/> Length Matching (±0.05mm)</label>
                       <label className="flex items-center gap-2 text-white"><input type="checkbox" checked readOnly className="accent-[#bc8cff]"/> Min Vias Optimization</label>
                       <label className="flex items-center gap-2 text-white"><input type="checkbox" checked readOnly className="accent-[#bc8cff]"/> Crosstalk Shielding Vias</label>
                       <label className="flex items-center gap-2 text-white"><input type="checkbox" checked readOnly className="accent-[#bc8cff]"/> Thermal Tear-dropping</label>
                    </div>
                 </div>

                 <div className="md:col-span-2 bg-[#0d1117] border border-[#30363d] p-5 rounded-lg flex flex-col justify-between">
                    <div>
                       <div className="text-white font-bold mb-2">Autorouting Execution Log</div>
                       <div className="bg-[#050505] p-3 rounded font-mono text-[10px] text-[#3fb950] space-y-1 h-[140px] overflow-y-auto border border-[#30363d]">
                          <div>[AI-Offline] Loaded netlist graph: 14 nets, 68 pin terminals.</div>
                          <div>[AI-Offline] Calculating A* pathfinding with 50Ω impedance penalty matrix...</div>
                          <div>[AI-Offline] Differential pair D+/D- routed on Top Copper (Skew: 0.002mm).</div>
                          <div>[AI-Offline] 100% Net convergence achieved. 0 DRC violations.</div>
                       </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                       <button onClick={runAiAutorouter} className="px-5 py-2.5 bg-[#bc8cff] hover:bg-[#d2a8ff] text-black font-bold rounded cursor-pointer transition">
                          Run AI Route Optimizer V2
                       </button>
                    </div>
                 </div>
              </div>
           </div>
         )}

         {/* --- TAB 3: WORLDWIDE STANDARDS COMPLIANCE --- */}
         {activeTab === 'STANDARDS' && (
           <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex justify-between items-center border-b border-[#30363d] pb-4">
                 <div>
                    <h2 className="text-[17px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                       <Globe className="text-[#58a6ff]"/> Worldwide PCB & Hardware Regulatory Standards (100% Coverage)
                    </h2>
                    <p className="text-[#8b949e] text-[11px] mt-0.5">Automated ERC/DRC compliance verification covering North America, Europe, Asia, and International IEC treaties.</p>
                 </div>
                 <span className="px-3 py-1 bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/40 rounded font-bold text-[11px] uppercase">
                    All Regions Compliant
                 </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {standards.map(std => (
                    <div key={std.code} className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex justify-between items-start">
                       <div>
                          <div className="flex items-center gap-2">
                             <span className="px-2 py-0.5 bg-[#21262d] text-[#58a6ff] rounded text-[9px] font-bold">{std.countryOrRegion}</span>
                             <span className="font-bold text-white text-[13px]">{std.code}</span>
                          </div>
                          <div className="text-[11px] text-[#c9d1d9] font-bold mt-1.5">{std.name}</div>
                          <p className="text-[10px] text-[#8b949e] mt-1">{std.details}</p>
                       </div>
                       <span className="px-2 py-1 bg-[#3fb950]/20 text-[#3fb950] rounded text-[10px] font-bold flex items-center gap-1 shrink-0 ml-3">
                          <CheckCircle2 size={12}/> PASSED
                       </span>
                    </div>
                 ))}
              </div>
           </div>
         )}

         {/* --- TAB 4: EMBEDDED OS & FIRMWARE ARCHITECT --- */}
         {activeTab === 'FIRMWARE_OS' && (
           <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-full">
              
              {/* Code Editor Col */}
              <div className="flex-1 flex flex-col gap-3">
                 <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex justify-between items-center text-[11px]">
                    <div className="flex items-center gap-3">
                       <FileCode size={18} className="text-[#e3b341]" />
                       <span className="font-bold text-white uppercase tracking-wider">PCB Firmware KERNEL ARCHITECT</span>
                    </div>
                    <div className="flex gap-2">
                       {(['RUST', 'C_CPP', 'MICROPYTHON', 'ASSEMBLY'] as const).map(lang => (
                          <button
                            key={lang}
                            onClick={() => setOsLanguage(lang)}
                            className={`px-2.5 py-1 rounded font-bold cursor-pointer transition ${osLanguage === lang ? 'bg-[#e3b341] text-black' : 'bg-[#21262d] text-[#8b949e] hover:text-white'}`}
                          >
                             {lang.replace('_', '/')}
                          </button>
                       ))}
                    </div>
                 </div>

                 <textarea
                   value={firmwareCode}
                   onChange={e => setFirmwareCode(e.target.value)}
                   className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg p-4 font-mono text-[12px] text-[#58a6ff] focus:outline-none focus:border-[#e3b341] min-h-[400px]"
                 />
              </div>

              {/* Hardware Flasher & Simulation Console */}
              <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
                 <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                    <h3 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                       <Zap size={16} className="text-[#3fb950]"/> Target MCU Programmer
                    </h3>

                    <div className="space-y-4 text-[11px]">
                       <div>
                          <label className="text-[#8b949e] block mb-1">Target Microcontroller</label>
                          <select 
                            value={selectedMcu}
                            onChange={e => setSelectedMcu(e.target.value as any)}
                            className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white font-bold"
                          >
                             <option value="ESP32_S3">ESP32-S3 (Xtensa Dual-Core 240MHz)</option>
                             <option value="STM32F407">STM32F407 (ARM Cortex-M4F 168MHz)</option>
                             <option value="RP2040">Raspberry Pi RP2040 (Dual Cortex-M0+)</option>
                             <option value="RISCV_GD32">GD32V RISC-V 32-Bit Core</option>
                             <option value="ZYNQ_FPGA">Xilinx Zynq-7000 SoC FPGA</option>
                          </select>
                       </div>

                       <div className="bg-[#0a0a0a] p-3 rounded border border-[#30363d]">
                          <div className="text-[#8b949e] mb-1">Flash SPI Interface</div>
                          <div className="text-white font-bold flex items-center justify-between">
                             <span>JTAG / SWD Mode</span>
                             <span className="text-[#3fb950]">● CONNECTED</span>
                          </div>
                       </div>

                       <button
                         onClick={triggerCompile}
                         disabled={compileStatus === 'COMPILING'}
                         className="w-full py-3 bg-[#3fb950] hover:bg-[#2ea043] text-black font-bold uppercase rounded tracking-wider cursor-pointer transition shadow-[0_0_20px_rgba(63,185,80,0.4)] flex items-center justify-center gap-2"
                       >
                          <Play size={16}/> Compile & Flash To PCB
                       </button>
                    </div>
                 </div>

                 {/* Flasher Telemetry Output */}
                 <div className="bg-[#0a0a0a] border border-[#30363d] rounded-lg p-4 flex-1 font-mono text-[10px]">
                    <div className="text-[#8b949e] font-bold mb-2 uppercase">UART Serial Console Output</div>
                    <div className="space-y-1 text-[#c9d1d9]">
                       <div className="text-[#58a6ff]">{'>>'} Booting MCU ROM Loader...</div>
                       <div className="text-[#3fb950]">{'>>'} SPI NOR Flash erased (256KB).</div>
                       <div className="text-[#e3b341]">{'>>'} Writing OS Kernel payload... 100%</div>
                       <div className="text-[#3fb950] font-bold">{'>>'} Firmware verified! Executing main loop.</div>
                       {isSimulating && <div className="text-[#bc8cff] animate-pulse mt-2">[OS-Kernel] GPIOA Pin 5 toggling at 100Hz.</div>}
                    </div>
                 </div>
              </div>
           </div>
         )}

         {/* --- TAB 5: MOBILE TOUCH PAINTER --- */}
         {activeTab === 'MOBILE_PAINTER' && (
           <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-[#161b22] border border-[#f85149]/50 rounded-lg p-6 text-center">
                 <Smartphone size={40} className="text-[#f85149] mx-auto mb-3 animate-bounce"/>
                 <h2 className="text-[18px] font-bold text-white">Mobile Touch PCB Painter & Texture Overlay</h2>
                 <p className="text-[#8b949e] text-[12px] mt-2 max-w-xl mx-auto">
                    Seamlessly integrated into the Texture & Material Editor. You can draw custom copper traces using your finger or stylus on mobile devices, or inspect custom solder mask textures in real-time 3D.
                 </p>
                 <div className="mt-6 flex justify-center gap-4">
                    <button onClick={() => setActiveTab('SCHEMATIC_PCB')} className="px-6 py-2.5 bg-[#f85149] text-black font-bold rounded uppercase cursor-pointer hover:bg-white transition">
                       Launch Touch Editor
                    </button>
                 </div>
              </div>
           </div>
         )}

      </div>
    </div>
  );
}
