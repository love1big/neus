import React from 'react';
import { Play, FileCode2, Map, Users, Settings, BookOpen, Clock, Plus, Zap, Box, Layers, Cpu, HardDrive, Activity, Network} from 'lucide-react';
import { useSystemTelemetry } from '../lib/telemetry';

export default function QuickStartDashboard({ onSelectTool }: { onSelectTool?: (tool: string) => void }) {
  const { stats: systemStats, threadLoads } = useSystemTelemetry();

  const recentProjects = [
    { name: 'Fantasy RPG Sandbox', path: 'D:/Projects/FantasyRPG', date: '10 mins ago', type: '3D Project' },
    { name: 'Cyberpunk Metroidvania', path: 'D:/Projects/Cybervania', date: '2 days ago', type: '2D / HD-2D' },
    { name: 'Multiplayer FPS Node', path: 'D:/Projects/NetFPS', date: 'Last week', type: 'Server Logic' },
  ];

  const templates = [
    { id: '3d_rpg', name: 'Open World RPG', desc: 'Pre-config: Cameras, NavMesh, Combat Matrix', icon: <Map className="text-[#3fb950] mb-2" size={32} /> },
    { id: '2d_platformer', name: '2D Platformer', desc: 'Pre-config: Tilemaps, Physics, Sprite Animator', icon: <Layers className="text-[#58a6ff] mb-2" size={32} /> },
    { id: 'visual_novel', name: 'Visual Novel', desc: 'Pre-config: Dialogue Trees, Lore DB, UI', icon: <BookOpen className="text-[#bc8cff] mb-2" size={32} /> },
    { id: 'blank', name: 'Blank Masterpiece', desc: 'Empty canvas for your wildest dreams.', icon: <Box className="text-[#8b949e] mb-2" size={32} /> },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0d1117] text-[#c9d1d9] font-sans p-10 flex justify-center">
       <div className="max-w-5xl w-full flex flex-col gap-10">
          
          <div className="flex justify-between items-end">
             <div>
               <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
                 <Zap className="text-[#e3b341]" size={36} />
                 Nexus Studio <span className="text-[#e3b341]">Pro</span>
               </h1>
               <p className="text-[#8b949e]">The ultimate offline IDE for Game Development, Logic, and Lore.</p>
             </div>
             <div className="flex gap-4">
                <button className="bg-[#2ea043] hover:bg-[#2c974b] text-white px-6 py-2 rounded font-bold transition-colors flex items-center gap-2 shadow-lg shadow-[#2ea043]/20">
                   <Plus size={18} /> New Project
                </button>
                <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white px-6 py-2 rounded transition-colors flex items-center gap-2">
                   <FileCode2 size={18} /> Open Local Folder
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             
             {/* Left Column: Recent & Setup */}
             <div className="md:col-span-1 flex flex-col gap-6">
                
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                   <h2 className="font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
                     <Clock size={16} className="text-[#8b949e]" />
                     Recent Projects
                   </h2>
                   <div className="flex flex-col gap-2">
                      {recentProjects.map((p, i) => (
                         <div key={i} className="group p-3 rounded bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] cursor-pointer transition-colors relative overflow-hidden">
                           <div className="absolute top-0 left-0 bottom-0 w-1 bg-transparent group-hover:bg-[#58a6ff] transition-colors"></div>
                           <h3 className="font-bold text-[#58a6ff] group-hover:underline text-sm mb-1">{p.name}</h3>
                           <p className="text-[10px] text-[#8b949e] font-mono truncate">{p.path}</p>
                           <div className="mt-2 flex justify-between items-center text-[10px]">
                              <span className="text-[#c9d1d9] bg-[#21262d] px-2 py-0.5 rounded">{p.type}</span>
                              <span className="text-[#888]">{p.date}</span>
                           </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                   <h2 className="font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
                     <Settings size={16} className="text-[#8b949e]" />
                     Environment Check (Offline)
                   </h2>
                   <div className="flex flex-col gap-3 text-xs">
                      <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
                        <span>Compiler (C++/Rust)</span>
                        <span className="text-[#3fb950] font-bold">READY</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
                        <span>Graphics API (Vulkan/DX12)</span>
                        <span className="text-[#3fb950] font-bold">OK</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
                        <span>Local Vector DB (Lore AI)</span>
                        <span className="text-[#f85149] font-bold">OFFLINE</span>
                      </div>
                      <p className="text-[10px] text-[#8b949e] italic mt-1">If AI features are disabled, the system operates as a standard high-performance engine IDE.</p>
                   </div>
                </div>

                {/* Real-time System Resource Monitor */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                   <h2 className="font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
                     <Activity size={16} className="text-[#8b949e]" />
                     System Resource Telemetry
                   </h2>
                   
                   <div className="flex flex-col gap-4">
                      {/* CPU */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="flex items-center gap-1.5 text-[#c9d1d9]"><Cpu size={13} className="text-[#58a6ff]"/> CPU (AMD Ryzen 9)</span>
                          <div className="flex gap-3">
                             <span className="font-mono text-[#8b949e]">{(45 + (systemStats.cpu * 0.4)).toFixed(0)}°C</span>
                             <span className="font-mono text-[#58a6ff]">{systemStats.cpu.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#30363d] flex relative">
                          <div className="h-full bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] transition-all duration-300" style={{ width: `${systemStats.cpu}%` }}></div>
                        </div>
                        {/* Threads mini bar */}
                        <div className="flex gap-[1px] mt-1.5">
                           {threadLoads.map((load, i) => (
                             <div key={i} className="h-[6px] flex-1 bg-[#0d1117] border border-[#30363d] rounded-[1px] overflow-hidden">
                                <div className="h-full bg-[#58a6ff] transition-all duration-300 opacity-80" style={{ width: `${load}%` }}></div>
                             </div>
                           ))}
                        </div>
                      </div>

                      {/* RAM */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="flex items-center gap-1.5 text-[#c9d1d9]"><HardDrive size={13} className="text-[#3fb950]"/> System RAM (DDR5)</span>
                          <span className="font-mono text-[#3fb950]">{((systemStats.ram / 100) * 64).toFixed(1)} GB / 64 GB</span>
                        </div>
                        <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#30363d] relative">
                          <div className="h-full bg-[#238636] transition-all duration-300 absolute left-0 top-0" style={{ width: `${systemStats.ram}%` }}></div>
                          {/* Swap bar */}
                          <div className="h-full bg-[#8b949e] opacity-40 transition-all duration-300 absolute left-0 top-0" style={{ width: `${Math.min(100, systemStats.ram + 10)}%`, zIndex: 0 }}></div>
                        </div>
                      </div>

                      {/* GPU */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="flex items-center gap-1.5 text-[#c9d1d9]"><Box size={13} className="text-[#bc8cff]"/> GPU Core (RTX 4090)</span>
                          <div className="flex gap-3">
                             <span className="font-mono text-[#8b949e]">{(30 + (systemStats.gpu * 0.5)).toFixed(0)}°C</span>
                             <span className="font-mono text-[#bc8cff]">{systemStats.gpu.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#30363d]">
                          <div className="h-full bg-gradient-to-r from-[#8957e5] to-[#bc8cff] transition-all duration-300" style={{ width: `${systemStats.gpu}%` }}></div>
                        </div>
                      </div>

                      {/* VRAM */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="flex items-center gap-1.5 text-[#c9d1d9]"><Layers size={13} className="text-[#e3b341]"/> GPU VRAM Alloc</span>
                          <span className="font-mono text-[#e3b341]">{((systemStats.vram / 100) * 24).toFixed(1)} GB / 24 GB</span>
                        </div>
                        <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#30363d]">
                          <div className="h-full bg-[#d29922] transition-all duration-300" style={{ width: `${systemStats.vram}%` }}></div>
                        </div>
                      </div>

                      {/* Disk I/O & Network */}
                      <div className="grid grid-cols-2 gap-4 mt-2 border-t border-[#30363d] pt-3">
                         <div>
                            <div className="text-[10px] text-[#8b949e] mb-1 flex items-center gap-1"><HardDrive size={10}/> Disk IOPS (Gen5 CVMe)</div>
                            <div className="font-mono text-[#c9d1d9] text-[11px]">R: {(systemStats.cpu * 12).toFixed(0)} MB/s</div>
                            <div className="font-mono text-[#c9d1d9] text-[11px]">W: {(systemStats.cpu * 2).toFixed(0)} MB/s</div>
                         </div>
                         <div>
                            <div className="text-[10px] text-[#8b949e] mb-1 flex items-center gap-1"><Network size={10}/> P2P NetIO (Host)</div>
                            <div className="font-mono text-[#c9d1d9] text-[11px]">↓ {(systemStats.ram * 0.5).toFixed(1)} Kbps</div>
                            <div className="font-mono text-[#c9d1d9] text-[11px]">↑ {(systemStats.ram * 0.1).toFixed(1)} Kbps</div>
                         </div>
                      </div>
                   </div>
                </div>

             </div>

             {/* Right Column: Workflows, Templates, Tools */}
             <div className="md:col-span-2 flex flex-col gap-6">
                
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                   <h2 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Start from Template (Manual Mode)</h2>
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {templates.map(t => (
                        <div key={t.id} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex flex-col items-center text-center cursor-pointer hover:border-[#e3b341] transition-colors group">
                           <div className="group-hover:scale-110 transition-transform duration-300">
                             {t.icon}
                           </div>
                           <h3 className="font-bold text-[#c9d1d9] text-sm mb-1">{t.name}</h3>
                           <p className="text-[10px] text-[#8b949e]">{t.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                   <h2 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">Jump Direct to Major Offline Tools</h2>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      
                      <button 
                        onClick={() => onSelectTool?.('WorldBible')}
                        className="bg-[#0d1117] border border-[#30363d] hover:border-[#d2a8ff] p-4 rounded-lg flex items-start gap-4 transition-colors text-left group"
                      >
                         <div className="bg-[#21262d] p-3 rounded group-hover:bg-[#d2a8ff]/20 transition-colors">
                           <BookOpen size={24} className="text-[#d2a8ff]" />
                         </div>
                         <div>
                            <h3 className="font-bold text-[#c9d1d9] mb-1">World Bible Editor</h3>
                            <p className="text-xs text-[#8b949e]">Write lore, characters, politics, and scripts manually in extreme detail.</p>
                         </div>
                      </button>

                      <button 
                        onClick={() => onSelectTool?.('NodeGraphEditor')}
                        className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] p-4 rounded-lg flex items-start gap-4 transition-colors text-left group"
                      >
                         <div className="bg-[#21262d] p-3 rounded group-hover:bg-[#58a6ff]/20 transition-colors">
                           <Users size={24} className="text-[#58a6ff]" />
                         </div>
                         <div>
                            <h3 className="font-bold text-[#c9d1d9] mb-1">Dialogue & Logic Graph</h3>
                            <p className="text-xs text-[#8b949e]">Build state machines and branching dialogue visually without AI.</p>
                         </div>
                      </button>

                      <button 
                        onClick={() => onSelectTool?.('EconomicBalancer')}
                        className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] p-4 rounded-lg flex items-start gap-4 transition-colors text-left group"
                      >
                         <div className="bg-[#21262d] p-3 rounded group-hover:bg-[#e3b341]/20 transition-colors">
                           <Map size={24} className="text-[#e3b341]" />
                         </div>
                         <div>
                            <h3 className="font-bold text-[#c9d1d9] mb-1">Economic & Combat Balancer</h3>
                            <p className="text-xs text-[#8b949e]">Spreadsheet logic for RPG stats, items, drop rates, and TTK analysis.</p>
                         </div>
                      </button>

                      <button 
                         onClick={() => onSelectTool?.('Select')}
                         className="bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] p-4 rounded-lg flex items-start gap-4 transition-colors text-left group"
                      >
                         <div className="bg-[#21262d] p-3 rounded group-hover:bg-[#3fb950]/20 transition-colors">
                           <FileCode2 size={24} className="text-[#3fb950]" />
                         </div>
                         <div>
                            <h3 className="font-bold text-[#c9d1d9] mb-1">Raw Code Editor IDE</h3>
                            <p className="text-xs text-[#8b949e]">Just write code. Multi-tabs, terminal, compiler. Pure programming.</p>
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
