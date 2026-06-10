import React from 'react';
import { Network, Server, Play, Pause, AlertTriangle, CheckCircle, Clock, HardDrive, Cpu, MemoryStick, Maximize, Activity, RefreshCw } from 'lucide-react';

export default function PhysicsChaosDestruction() {
  return (
    <div className="flex flex-col h-full bg-[#000000] text-[#f8fafc] font-sans">
      <div className="h-12 bg-[#0f172a] border-b border-[#1e293b] shadow-md flex items-center justify-between px-4 shrink-0 z-20">
         <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-[#ef4444] flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]">
               <AlertTriangle size={18}/>
            </div>
            <div>
               <h2 className="font-black tracking-widest text-[12px] uppercase text-white">Chaos Physics Destruction</h2>
               <p className="text-[9px] text-[#94a3b8] font-mono tracking-widest">VORONOI FRACTURE • REAL-TIME RIGID BODY SIM • STRAIN FIELDS</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
             <div className="text-[10px] font-mono border border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444] px-2 py-1 rounded font-bold">SOLVER: ON</div>
             <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-2"><RefreshCw size={14}/> Re-Fracture</button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Viewport */}
         <div className="flex-1 flex justify-center items-center relative overflow-hidden bg-[#020617] border-r border-[#1e293b]">
             {/* Physics Debug View */}
             <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
             
             {/* Fake Demolition View */}
             <div className="w-[400px] h-[400px] relative">
                 {/* Plinth */}
                 <div className="absolute bottom-[0] left-[10%] right-[10%] h-8 bg-[#1e293b] rounded-sm border-t border-[#334155] transform perspective-500 rotate-x-12"></div>
                 
                 {/* Fractured Pillar */}
                 <div className="absolute bottom-[30px] left-[30%] right-[30%] h-[300px] bg-[#334155] border border-[#475569] flex flex-wrap content-start">
                     <div className="w-full h-1/2 relative bg-[#475569] border border-[#64748b]">
                         {/* Fake Voronoi chunks falling */}
                         <div className="absolute -bottom-8 -left-4 w-12 h-16 bg-[#475569] border border-[#64748b] transform rotate-12 drop-shadow-2xl"></div>
                         <div className="absolute -bottom-16 right-0 w-16 h-12 bg-[#475569] border border-[#64748b] transform -rotate-45 drop-shadow-2xl"></div>
                         {/* Impact point */}
                         <div className="absolute top-[80%] left-[60%] w-12 h-12 bg-[#ef4444]/40 rounded-full blur-xl mix-blend-screen animate-pulse"></div>
                     </div>
                 </div>
                 
                 {/* Airborne chunks */}
                 <div className="absolute bottom-[20%] left-[20%] w-8 h-8 bg-[#475569] border border-[#94a3b8] transform rotate-45 blur-[1px]"></div>
                 <div className="absolute bottom-[40%] right-[20%] w-10 h-10 bg-[#475569] border border-[#94a3b8] transform -rotate-12 blur-[2px]"></div>
             </div>

             <div className="absolute top-4 left-4 font-mono text-[10px] space-y-1">
                 <div className="text-[#3b82f6]">Active Rigid Bodies: 4,096</div>
                 <div className="text-[#ef4444]">Strain Max: 12.4 MPa</div>
                 <div className="text-[#10b981]">Sim Time: 2.1ms</div>
             </div>
         </div>

         {/* Controller UI */}
         <div className="w-[340px] bg-[#0f172a] flex flex-col shrink-0 z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
             <div className="p-3 border-b border-[#1e293b] text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] flex items-center gap-2">
                 <HardDrive size={14} className="text-[#ef4444]"/> Fracture Settings
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-[11px]">
                 
                 {/* Voronoi Settings */}
                 <div className="space-y-4">
                     <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#334155] pb-1">Voronoi Sites</h3>
                     <div>
                        <div className="flex justify-between text-[#94a3b8] mb-1"><span>Site Count (Level 1)</span><span className="font-mono text-white">250</span></div>
                        <input type="range" className="w-full accent-[#3b82f6]" min="10" max="1000" defaultValue="250" />
                     </div>
                     <div>
                        <div className="flex justify-between text-[#94a3b8] mb-1"><span>Site Count (Level 2)</span><span className="font-mono text-white">4000</span></div>
                        <input type="range" className="w-full accent-[#3b82f6]" min="100" max="10000" defaultValue="4000" />
                     </div>
                     <div>
                        <div className="flex justify-between text-[#94a3b8] mb-1"><span>Damage Threshold</span><span className="font-mono text-[#ef4444]">High</span></div>
                        <input type="range" className="w-full accent-[#ef4444]" min="0" max="100" defaultValue="80" />
                     </div>
                 </div>

                 {/* Clustering */}
                 <div className="space-y-4 pt-4 border-t border-[#1e293b]">
                     <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#334155] pb-1">Geometry Clustering</h3>
                     <div className="flex justify-between items-center text-[#94a3b8]">
                         <span>Damage Model</span>
                         <select className="bg-[#1e293b] border border-[#334155] text-white p-1 rounded font-mono w-28">
                             <option>Strain Based</option>
                             <option selected>Impact Velocity</option>
                             <option>Distance</option>
                         </select>
                     </div>
                     <div className="flex justify-between items-center text-[#94a3b8]">
                         <span>Cluster Radius</span>
                         <input type="number" defaultValue="0.25" step="0.01" className="bg-[#1e293b] border border-[#334155] text-white p-1 rounded font-mono w-20 text-right" />
                     </div>
                 </div>

                 {/* Solver */}
                 <div className="space-y-2 pt-4 border-t border-[#1e293b]">
                     <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#334155] pb-1">Rigid Body Physics</h3>
                     <label className="flex items-center gap-2 text-[#94a3b8]"><input type="checkbox" defaultChecked className="accent-[#ef4444]" /> Asynchronous Tick</label>
                     <label className="flex items-center gap-2 text-[#94a3b8]"><input type="checkbox" defaultChecked className="accent-[#ef4444]" /> GPU Sim (Compute)</label>
                     <label className="flex items-center gap-2 text-[#94a3b8]"><input type="checkbox" /> Sleep on Rest</label>
                 </div>

                 <button className="w-full mt-4 bg-[#1e293b] hover:bg-[#334155] text-white py-2 rounded text-[10px] font-bold border border-[#475569] uppercase tracking-widest flex items-center justify-center gap-2">
                     <MemoryStick size={14}/> Cache to Disk (VAT)
                 </button>

             </div>
         </div>
      </div>
    </div>
  );
}
