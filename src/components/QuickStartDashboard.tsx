/**
 * @file QuickStartDashboard.tsx
 * @description
 * ============================================================================
 * [THAI]
 * แดชบอร์ดเริ่มต้น (Quick Start Launcher Dashboard) สไตล์สตูดิโอเกมระดับ AAA
 * รวบรวมโปรเจกต์ล่าสุด, เทมเพลตเริ่มต้น (RPG, Platformer, Visual Novel, Blank),
 * ระบบมอนิเตอร์ฮาร์ดแวร์และทรัพยากรเรียลไทม์ (CPU, RAM, GPU, VRAM, Disk IO, NetIO)
 * และปุ่มลัดสำหรับเปิดเครื่องมือวิศวกรรมหลัก
 * 
 * [ENGLISH]
 * AAA Game Engine Launcher & Quick Start Dashboard.
 * Hosts recent project history, template quick-starters, live hardware telemetry,
 * and direct one-click launchers for core offline IDE toolchains.
 * ============================================================================
 */

import React from 'react';
import { 
  Play, FileCode2, Map, Users, Settings, BookOpen, Clock, Plus, Zap, 
  Box, Layers, Cpu, HardDrive, Activity, Network, Sparkles, FolderOpen, 
  ChevronRight, Compass, ShieldCheck, ArrowUpRight
} from 'lucide-react';
import { useSystemTelemetry } from '../lib/telemetry';

export default function QuickStartDashboard({ onSelectTool }: { onSelectTool?: (tool: string) => void }) {
  const { stats: systemStats, threadLoads } = useSystemTelemetry();

  const recentProjects = [
    { name: 'Fantasy RPG Sandbox', path: 'D:/Projects/FantasyRPG', date: '10 mins ago', type: '3D Project', tagColor: 'text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/30' },
    { name: 'Cyberpunk Metroidvania', path: 'D:/Projects/Cybervania', date: '2 days ago', type: '2D / HD-2D', tagColor: 'text-[#ec4899] bg-[#ec4899]/10 border-[#ec4899]/30' },
    { name: 'Multiplayer FPS Server Node', path: 'D:/Projects/NetFPS', date: 'Last week', type: 'Server Logic', tagColor: 'text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/30' },
  ];

  const templates = [
    { 
      id: '3d_rpg', 
      name: 'Open World RPG', 
      desc: 'Pre-configured Cameras, NavMesh, Combat Matrix & State Graphs', 
      icon: <Map className="text-[#38bdf8] group-hover:scale-110 transition-transform" size={28} />,
      accent: 'border-[#38bdf8]/40 hover:border-[#38bdf8] hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]'
    },
    { 
      id: '2d_platformer', 
      name: '2D Platformer & Metroidvania', 
      desc: 'Tilemaps, Rigidbody2D, Sprite Rigging & Parallax Backgrounds', 
      icon: <Layers className="text-[#ec4899] group-hover:scale-110 transition-transform" size={28} />,
      accent: 'border-[#ec4899]/40 hover:border-[#ec4899] hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]'
    },
    { 
      id: 'visual_novel', 
      name: 'Narrative & Visual Novel', 
      desc: 'Branching Dialogue Trees, World Lore DB & Expressive UI HUD', 
      icon: <BookOpen className="text-[#a855f7] group-hover:scale-110 transition-transform" size={28} />,
      accent: 'border-[#a855f7]/40 hover:border-[#a855f7] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
    },
    { 
      id: 'blank', 
      name: 'Blank Clean Masterpiece', 
      desc: 'Clean ultra-fast engine canvas for raw custom architectures', 
      icon: <Box className="text-[#10b981] group-hover:scale-110 transition-transform" size={28} />,
      accent: 'border-[#10b981]/40 hover:border-[#10b981] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#07090e] text-[#c9d1d9] font-sans p-6 sm:p-10 flex justify-center custom-scrollbar">
       <div className="max-w-6xl w-full flex flex-col gap-8">
          
          {/* Top Banner Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-[#21262d]">
             <div>
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                   <Zap className="text-black" size={24} />
                 </div>
                 <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                   Nexus Studio <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#818cf8]">Pro Engine</span>
                 </h1>
                 <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#161b22] border border-[#30363d] text-[#8b949e]">
                   v5.4.0 OFFLINE
                 </span>
               </div>
               <p className="text-xs sm:text-sm text-[#8b949e] max-w-2xl leading-relaxed">
                 Professional High-Performance Offline IDE for Next-Gen 2D/3D Game Development, Procedural Worlds, Deterministic Physics & Neural Logic.
               </p>
             </div>
             
             <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => onSelectTool?.('OmniMegaEngine300Studio')}
                  className="bg-gradient-to-r from-[#38bdf8] to-[#6366f1] hover:from-[#7dd3fc] hover:to-[#818cf8] text-black font-black px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:scale-105"
                >
                   <Plus size={16} /> New Game Project
                </button>
                <button 
                  onClick={() => onSelectTool?.('ContentBrowser')}
                  className="bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                >
                   <FolderOpen size={16} className="text-[#8b949e]" /> Open Local Directory
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Left Column: Recent Projects, Diagnostics & Telemetry */}
             <div className="lg:col-span-1 flex flex-col gap-6">
                
                {/* Recent Projects Card */}
                <div className="bg-[#0e121a] border border-[#21262d] rounded-2xl p-5 shadow-lg">
                   <div className="flex items-center justify-between mb-4">
                     <h2 className="font-bold text-white flex items-center gap-2 uppercase tracking-wider text-xs">
                       <Clock size={15} className="text-[#38bdf8]" />
                       Recent Projects
                     </h2>
                     <span className="text-[10px] text-[#8b949e] font-mono">3 Saved</span>
                   </div>

                   <div className="flex flex-col gap-2.5">
                      {recentProjects.map((p, i) => (
                         <div 
                           key={i} 
                           onClick={() => onSelectTool?.('Select')}
                           className="group p-3.5 rounded-xl bg-[#131722] border border-[#21262d] hover:border-[#38bdf8]/60 cursor-pointer transition-all relative overflow-hidden"
                         >
                           <div className="absolute top-0 left-0 bottom-0 w-1 bg-transparent group-hover:bg-[#38bdf8] transition-colors"></div>
                           <div className="flex items-center justify-between mb-1">
                             <h3 className="font-bold text-white group-hover:text-[#38bdf8] text-xs transition-colors">{p.name}</h3>
                             <ArrowUpRight size={13} className="text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <p className="text-[10px] text-[#8b949e] font-mono truncate mb-2">{p.path}</p>
                           <div className="flex justify-between items-center text-[10px]">
                              <span className={`px-2 py-0.5 rounded border text-[9px] font-mono ${p.tagColor}`}>{p.type}</span>
                              <span className="text-[#8b949e]">{p.date}</span>
                           </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Real-time System Resource Monitor */}
                <div className="bg-[#0e121a] border border-[#21262d] rounded-2xl p-5 shadow-lg">
                   <div className="flex items-center justify-between mb-4">
                     <h2 className="font-bold text-white flex items-center gap-2 uppercase tracking-wider text-xs">
                       <Activity size={15} className="text-[#10b981] animate-pulse" />
                       Hardware Telemetry (Live)
                     </h2>
                     <span className="text-[9px] font-mono text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30">60 FPS IDE</span>
                   </div>
                   
                   <div className="flex flex-col gap-4">
                      {/* CPU */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1.5">
                          <span className="flex items-center gap-1.5 text-[#c9d1d9] font-medium"><Cpu size={13} className="text-[#38bdf8]"/> CPU (16-Core AMD Ryzen)</span>
                          <div className="flex gap-2 text-[10px] font-mono">
                             <span className="text-[#8b949e]">{(45 + (systemStats.cpu * 0.4)).toFixed(0)}°C</span>
                             <span className="text-[#38bdf8] font-bold">{systemStats.cpu.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-[#161b22] h-2 rounded-full overflow-hidden border border-[#21262d] flex relative">
                          <div className="h-full bg-gradient-to-r from-[#38bdf8] to-[#818cf8] transition-all duration-300 rounded-full" style={{ width: `${systemStats.cpu}%` }}></div>
                        </div>
                        {/* Threads mini bar */}
                        <div className="flex gap-[2px] mt-1.5">
                           {threadLoads.map((load, i) => (
                             <div key={i} className="h-[5px] flex-1 bg-[#161b22] rounded-[1px] overflow-hidden">
                                <div className="h-full bg-[#38bdf8] transition-all duration-300 opacity-75" style={{ width: `${load}%` }}></div>
                             </div>
                           ))}
                        </div>
                      </div>

                      {/* RAM */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1.5">
                          <span className="flex items-center gap-1.5 text-[#c9d1d9] font-medium"><HardDrive size={13} className="text-[#10b981]"/> System RAM (DDR5)</span>
                          <span className="font-mono text-[10px] text-[#10b981] font-bold">{((systemStats.ram / 100) * 64).toFixed(1)} / 64 GB</span>
                        </div>
                        <div className="w-full bg-[#161b22] h-2 rounded-full overflow-hidden border border-[#21262d] relative">
                          <div className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] transition-all duration-300 rounded-full" style={{ width: `${systemStats.ram}%` }}></div>
                        </div>
                      </div>

                      {/* GPU */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1.5">
                          <span className="flex items-center gap-1.5 text-[#c9d1d9] font-medium"><Box size={13} className="text-[#a855f7]"/> GPU Core (Vulkan / DX12)</span>
                          <div className="flex gap-2 text-[10px] font-mono">
                             <span className="text-[#8b949e]">{(35 + (systemStats.gpu * 0.4)).toFixed(0)}°C</span>
                             <span className="text-[#a855f7] font-bold">{systemStats.gpu.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-[#161b22] h-2 rounded-full overflow-hidden border border-[#21262d]">
                          <div className="h-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] transition-all duration-300 rounded-full" style={{ width: `${systemStats.gpu}%` }}></div>
                        </div>
                      </div>

                      {/* VRAM */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1.5">
                          <span className="flex items-center gap-1.5 text-[#c9d1d9] font-medium"><Layers size={13} className="text-[#f59e0b]"/> GPU VRAM Allocated</span>
                          <span className="font-mono text-[10px] text-[#f59e0b] font-bold">{((systemStats.vram / 100) * 24).toFixed(1)} / 24 GB</span>
                        </div>
                        <div className="w-full bg-[#161b22] h-2 rounded-full overflow-hidden border border-[#21262d]">
                          <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] transition-all duration-300 rounded-full" style={{ width: `${systemStats.vram}%` }}></div>
                        </div>
                      </div>

                      {/* Disk I/O & Network */}
                      <div className="grid grid-cols-2 gap-3 mt-1 border-t border-[#21262d] pt-3">
                         <div className="bg-[#131722] p-2.5 rounded-xl border border-[#21262d]">
                            <div className="text-[9px] text-[#8b949e] mb-1 flex items-center gap-1"><HardDrive size={10}/> Disk NVMe IO</div>
                            <div className="font-mono text-[#c9d1d9] text-[10px]">R: {(systemStats.cpu * 12).toFixed(0)} MB/s</div>
                            <div className="font-mono text-[#8b949e] text-[10px]">W: {(systemStats.cpu * 2).toFixed(0)} MB/s</div>
                         </div>
                         <div className="bg-[#131722] p-2.5 rounded-xl border border-[#21262d]">
                            <div className="text-[9px] text-[#8b949e] mb-1 flex items-center gap-1"><Network size={10}/> Local Mesh Net</div>
                            <div className="font-mono text-[#c9d1d9] text-[10px]">↓ {(systemStats.ram * 0.5).toFixed(1)} Kbps</div>
                            <div className="font-mono text-[#8b949e] text-[10px]">↑ {(systemStats.ram * 0.1).toFixed(1)} Kbps</div>
                         </div>
                      </div>
                   </div>
                </div>

             </div>

             {/* Right Column: Templates & Tool Suites */}
             <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Templates Grid */}
                <div className="bg-[#0e121a] border border-[#21262d] rounded-2xl p-6 shadow-lg">
                   <div className="flex items-center justify-between mb-4">
                     <h2 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                       <Sparkles size={15} className="text-[#f59e0b]" />
                       Project Starters & Production Presets
                     </h2>
                     <span className="text-[10px] text-[#8b949e]">Click to scaffold</span>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {templates.map(t => (
                        <div 
                          key={t.id} 
                          onClick={() => onSelectTool?.('OmniMegaEngine300Studio')}
                          className={`bg-[#131722] border rounded-xl p-4.5 flex flex-col justify-between cursor-pointer transition-all group ${t.accent}`}
                        >
                           <div>
                             <div className="mb-3">
                               {t.icon}
                             </div>
                             <h3 className="font-bold text-white text-sm mb-1.5">{t.name}</h3>
                             <p className="text-[11px] text-[#8b949e] leading-relaxed">{t.desc}</p>
                           </div>
                           <div className="mt-4 flex items-center justify-between text-[10px] text-[#8b949e] font-mono border-t border-[#21262d] pt-2">
                             <span>Instant Init</span>
                             <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform text-[#38bdf8]" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Jump Direct to Core Engines */}
                <div className="bg-[#0e121a] border border-[#21262d] rounded-2xl p-6 shadow-lg">
                   <div className="flex items-center justify-between mb-4">
                     <h2 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                       <Compass size={15} className="text-[#38bdf8]" />
                       Launch Core Studios & Toolchains
                     </h2>
                     <span className="text-[10px] text-[#8b949e]">335+ Tools Available</span>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <button 
                        onClick={() => onSelectTool?.('AIOfflineVocalMusicWorkstation')}
                        className="bg-[#131722] border border-[#21262d] hover:border-pink-500/60 p-4 rounded-xl flex items-start gap-3.5 transition-all text-left group hover:shadow-[0_0_20px_rgba(236,72,153,0.12)]"
                      >
                         <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                           <Activity size={20} className="text-pink-400" />
                         </div>
                         <div>
                            <h3 className="font-bold text-white text-xs mb-1 group-hover:text-pink-300">AI Vocal & Singing DAW</h3>
                            <p className="text-[11px] text-[#8b949e] leading-snug">6-Stage Song Pipeline with Thai DiffSinger, emotion curves & neural DSP mastering.</p>
                         </div>
                      </button>

                      <button 
                        onClick={() => onSelectTool?.('OmniMegaEngine300Studio')}
                        className="bg-[#131722] border border-[#21262d] hover:border-[#38bdf8]/60 p-4 rounded-xl flex items-start gap-3.5 transition-all text-left group hover:shadow-[0_0_20px_rgba(56,189,248,0.12)]"
                      >
                         <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                           <Cpu size={20} className="text-[#38bdf8]" />
                         </div>
                         <div>
                            <h3 className="font-bold text-white text-xs mb-1 group-hover:text-[#38bdf8]">Omni 335+ Engine Master</h3>
                            <p className="text-[11px] text-[#8b949e] leading-snug">12 AAA engineering categories: Physics, Biomes, Shaders, AI Swarms & Netcode.</p>
                         </div>
                      </button>

                      <button 
                        onClick={() => onSelectTool?.('AIHubMaster')}
                        className="bg-[#131722] border border-[#21262d] hover:border-[#a855f7]/60 p-4 rounded-xl flex items-start gap-3.5 transition-all text-left group hover:shadow-[0_0_20px_rgba(168,85,247,0.12)]"
                      >
                         <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                           <Zap size={20} className="text-[#a855f7]" />
                         </div>
                         <div>
                            <h3 className="font-bold text-white text-xs mb-1 group-hover:text-[#c084fc]">AI Swarm Hub & Memory Shield</h3>
                            <p className="text-[11px] text-[#8b949e] leading-snug">Zero-repeat error immunity, continuous neural learning, and local GGUF models.</p>
                         </div>
                      </button>

                      <button 
                         onClick={() => onSelectTool?.('CodeEditor')}
                         className="bg-[#131722] border border-[#21262d] hover:border-[#10b981]/60 p-4 rounded-xl flex items-start gap-3.5 transition-all text-left group hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]"
                      >
                         <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                           <FileCode2 size={20} className="text-[#10b981]" />
                         </div>
                         <div>
                            <h3 className="font-bold text-white text-xs mb-1 group-hover:text-[#34d399]">Raw C++/Rust/TS Code IDE</h3>
                            <p className="text-[11px] text-[#8b949e] leading-snug">Multi-tab syntax highlighting, AST parser, compiler toolchain & embedded terminal.</p>
                         </div>
                      </button>

                   </div>
                </div>

             </div>
          </div>
       </div>
    </div>
  );
}
