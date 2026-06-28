import React from 'react';
import { Network, Server, Play, Pause, AlertTriangle, CheckCircle, Clock, HardDrive, Cpu, MemoryStick, Maximize, Activity, RefreshCw, Layers } from 'lucide-react';

export default function RenderFarmManager() {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#ededed] font-sans">
      
      {/* Top Protocol Bar */}
      <div className="h-14 bg-[#111] border-b border-[#222] shadow-md flex items-center justify-between px-6 shrink-0 z-20">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0284c7] to-[#0369a1] rounded flex items-center justify-center text-white shadow-[0_0_15px_rgba(2,132,199,0.5)]">
               <Server size={22}/>
            </div>
            <div>
               <h2 className="font-black tracking-widest text-[14px] uppercase text-white shadow-black drop-shadow-md">Distributed Render Farm</h2>
               <p className="text-[10px] text-[#737373] font-mono tracking-widest">NETWORK QUEUE MANAGER • CLOUD SCALING</p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="flex flex-col items-end">
               <span className="text-[9px] text-[#737373] uppercase font-bold tracking-widest">Total Nodes</span>
               <span className="text-[16px] font-mono text-[#38bdf8] font-bold">128</span>
            </div>
            <div className="flex flex-col items-end border-l border-[#333] pl-4">
               <span className="text-[9px] text-[#737373] uppercase font-bold tracking-widest">Active Jobs</span>
               <span className="text-[16px] font-mono text-[#a3e635] font-bold">4</span>
            </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         
         {/* Grid View of Nodes */}
         <div className="flex-1 bg-[#171717] p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            
            {/* Header info */}
            <div className="flex justify-between items-center">
               <h3 className="text-[14px] font-bold tracking-widest text-[#a3a3a3] uppercase flex items-center gap-2"><Network size={16}/> Cluster Topology Overview</h3>
               <button className="bg-[#222] hover:bg-[#333] border border-[#444] text-[#a3a3a3] px-3 py-1.5 rounded text-[11px] font-bold tracking-wider flex items-center gap-2"><RefreshCw size={12}/> Refresh Network</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
               
               {/* Generate Fake Nodes */}
               {[...Array(24)].map((_, i) => {
                  const status = i < 18 ? 'rendering' : i < 22 ? 'idle' : 'offline';
                  const cpuLoad = status === 'rendering' ? 80 + Math.random() * 20 : status === 'idle' ? 1 + Math.random() * 5 : 0;
                  const temp = status === 'rendering' ? 70 + Math.random() * 15 : status === 'idle' ? 35 : 0;
                  
                  return (
                     <div key={i} className={`bg-[#262626] border rounded p-3 flex flex-col shadow-lg transition-all ${status === 'rendering' ? 'border-[#0284c7]' : status === 'idle' ? 'border-[#3f3f46]' : 'border-[#991b1b] opacity-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[11px] font-bold text-white font-mono">NODE-{`00${i+1}`.slice(-3)}</span>
                           {status === 'rendering' ? <div className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse"></div> : 
                            status === 'idle' ? <div className="w-2 h-2 rounded-full bg-[#a3e635]"></div> : 
                            <div className="w-2 h-2 rounded-full bg-[#991b1b]"></div>}
                        </div>
                        
                        {status !== 'offline' && (
                           <>
                              <div className="space-y-1.5 mt-2">
                                 <div className="flex justify-between text-[9px] text-[#737373]">
                                    <span>CPU Thread Load</span>
                                    <span className="font-mono text-white">{cpuLoad.toFixed(0)}%</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-[#111] rounded overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8]" style={{ width: `${cpuLoad}%` }}></div>
                                 </div>
                              </div>
                              <div className="mt-3 flex justify-between items-center text-[9px] text-[#737373] font-mono border-t border-[#3f3f46] pt-2">
                                 <span className="flex items-center gap-1"><Cpu size={10}/> {temp.toFixed(0)}°C</span>
                                 <span className="flex items-center gap-1"><MemoryStick size={10}/> 64GB</span>
                              </div>
                           </>
                        )}
                        {status === 'offline' && (
                           <div className="flex-1 flex items-center justify-center text-[10px] font-bold text-[#991b1b] uppercase tracking-widest mt-4">
                               Connection Lost
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         </div>

         {/* Job Queue Side Panel */}
         <div className="w-[400px] bg-[#111] border-l border-[#222] flex flex-col shrink-0 shadow-2xl z-10">
            <div className="p-4 bg-[#171717] border-b border-[#222] text-[12px] uppercase font-bold text-white tracking-widest flex items-center gap-2">
               <Layers size={16} className="text-[#38bdf8]"/> Job Queue Manager
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
               
               {/* Active Job */}
               <div className="bg-[#0284c7]/20 border border-[#0284c7] rounded p-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#0284c7]"></div>
                  <div className="flex justify-between items-start mb-2 pl-2">
                     <div>
                        <h4 className="text-[12px] font-bold text-white leading-tight">SEQ_FINAL_BATTLE_v004.exr</h4>
                        <p className="text-[10px] font-mono text-[#0ea5e9]">Project: OmniCreator / Shots / sc04</p>
                     </div>
                     <span className="bg-[#0284c7] text-[#fff] text-[9px] px-2 py-0.5 rounded font-bold uppercase animate-pulse">Rendering</span>
                  </div>
                  <div className="pl-2 mt-3 space-y-2">
                     <div className="flex justify-between text-[10px] text-[#a3a3a3]">
                        <span>Progress: Frames 100-240 / 500</span>
                        <span className="text-white font-mono font-bold">48%</span>
                     </div>
                     <div className="w-full h-2 bg-[#111] border border-[#0284c7]/30 rounded overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8]" style={{ width: '48%' }}></div>
                     </div>
                     <div className="flex justify-between text-[9px] font-mono text-[#737373] pt-1">
                        <span className="flex items-center gap-1"><Clock size={10}/> ETA: 02h 15m</span>
                        <span className="flex items-center gap-1"><Activity size={10}/> Nodes: 18</span>
                     </div>
                  </div>
               </div>

               {/* Queued Job */}
               <div className="bg-[#262626] border border-[#404040] rounded p-3 relative opacity-80">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#f59e0b]"></div>
                  <div className="flex justify-between items-start mb-2 pl-2">
                     <div>
                        <h4 className="text-[12px] font-bold text-white leading-tight">CACHING_FLUID_SIM_SC05</h4>
                        <p className="text-[10px] font-mono text-[#a3a3a3]">Project: OmniCreator / Assets / FX</p>
                     </div>
                     <span className="bg-[#f59e0b] text-[#fff] text-[9px] px-2 py-0.5 rounded font-bold uppercase">Queued</span>
                  </div>
               </div>

               {/* Queued Job 2 */}
               <div className="bg-[#262626] border border-[#404040] rounded p-3 relative opacity-80">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#f59e0b]"></div>
                  <div className="flex justify-between items-start mb-2 pl-2">
                     <div>
                        <h4 className="text-[12px] font-bold text-white leading-tight">ENV_LIGHTMAP_BAKE_HIGH</h4>
                        <p className="text-[10px] font-mono text-[#a3a3a3]">Project: OmniCreator / Levels / Lvl_01</p>
                     </div>
                     <span className="bg-[#f59e0b] text-[#fff] text-[9px] px-2 py-0.5 rounded font-bold uppercase">Queued</span>
                  </div>
               </div>

               {/* Completed Job */}
               <div className="bg-[#171717] border border-[#22c55e]/30 rounded p-3 relative opacity-60">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#22c55e]"></div>
                  <div className="flex justify-between items-start mb-2 pl-2">
                     <div>
                        <h4 className="text-[12px] font-bold line-through text-[#a3a3a3] leading-tight">CHAR_RIG_PREVIEW_v2.mp4</h4>
                        <p className="text-[10px] font-mono text-[#737373]">Project: OmniCreator / Dailies / 10-24</p>
                     </div>
                     <span className="text-[#22c55e] border border-[#22c55e] text-[9px] px-2 py-0.5 rounded font-bold uppercase">Done</span>
                  </div>
               </div>

            </div>
            
            {/* Add Job Action */}
            <div className="p-4 border-t border-[#222] bg-[#171717]">
               <button className="w-full bg-[#0ea5e9] hover:bg-[#38bdf8] text-black py-3 rounded text-[12px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(14,165,233,0.3)] transition"><div className="flex items-center justify-center gap-2">Submit New Job <Maximize size={14}/></div></button>
            </div>
         </div>
      </div>
    </div>
  );
}
