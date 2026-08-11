import React, { useState } from 'react';
import { Network, Activity, Server, Smartphone, Cpu, ShieldAlert, BarChart2, Zap, Clock, Search, Sliders, Settings2, Eye, ShieldCheck, Database, RefreshCw} from 'lucide-react';

export default function NetworkReplicationSim() {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#ededed] font-sans">
      <div className="h-12 bg-[#111] border-b border-[#222] shadow-md flex items-center justify-between px-4 shrink-0 z-20">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-white shadow-inner">
               <Network size={18}/>
            </div>
            <div>
               <h2 className="font-bold text-[12px] uppercase tracking-widest text-white">Netcode Replication Sim</h2>
               <p className="text-[9px] text-[#737373] font-mono">DEDICATED SERVER • CLIENT PREDICTION • ROLLBACK</p>
            </div>
         </div>
         <div className="flex items-center gap-4 border border-[#333] bg-[#1a1a1a] rounded px-3 py-1">
             <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                 <span className="text-[10px] font-bold text-[#10b981]">SERVER TICK: 60Hz</span>
             </div>
             <div className="w-[1px] h-4 bg-[#333]"></div>
             <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-[#60a5fa]">STATE: AUTHORITATIVE</span>
             </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Live Simulation View */}
         <div className="flex-1 bg-[#171717] relative flex flex-col items-center justify-center border-r border-[#222] overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* World Container */}
            <div className="w-full max-w-4xl h-[400px] relative mt-10">
               
               {/* Server Authoritative Object (Ghost/Shadow) */}
               <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-transparent border-2 border-[#10b981]/50 border-dashed rounded transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                   <div className="text-[8px] font-bold text-[#10b981] absolute -top-4 whitespace-nowrap">Server State</div>
               </div>

               {/* Client 1 Predicted Object */}
               <div className="absolute top-1/2 left-[55%] w-12 h-12 bg-[#3b82f6]/20 border-2 border-[#3b82f6] rounded transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center z-10 transition-transform duration-100">
                   <div className="text-[8px] font-bold text-[#3b82f6] absolute -top-4 whitespace-nowrap">Client Pred (Local)</div>
                   <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
               </div>

               {/* Interpolated Other Client Object */}
               <div className="absolute top-[40%] left-[30%] w-10 h-10 bg-[#ef4444]/20 border-2 border-[#ef4444] rounded flex items-center justify-center opacity-80">
                   <div className="text-[8px] font-bold text-[#ef4444] absolute -top-4 whitespace-nowrap">Client 2 (Interpolated)</div>
                   <div className="w-2 h-2 bg-[#ef4444] rounded-full"></div>
               </div>
               
               {/* Connection Lines */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                   <path d="M 50% 50% L 55% 50%" className="animate-pulse" stroke="#10b981" strokeWidth="1" strokeDasharray="4 2" fill="none" />
                   <path d="M 50% 50% L 30% 40%" className="animate-pulse delay-100" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" fill="none" />
               </svg>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-6 w-full px-12 flex justify-between gap-6 pointer-events-none">
                <div className="bg-[#111] border border-[#333] p-3 rounded flex-1 pointer-events-auto">
                    <h4 className="text-[10px] font-bold text-[#3b82f6] mb-2 flex justify-between">
                       <span>LOCAL CLIENT (PREDICTING)</span>
                       <span className="font-mono">Ping: 45ms</span>
                    </h4>
                    <div className="space-y-1 mt-2">
                       <div className="flex justify-between text-[9px] text-[#737373]"><span>Input Buffer</span><span>2 frames</span></div>
                       <div className="flex justify-between text-[9px] text-[#737373]"><span>Correction Delta</span><span className="text-[#10b981]">0.02cm</span></div>
                    </div>
                </div>
                <div className="bg-[#111] border border-[#333] p-3 rounded flex-1 pointer-events-auto shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <h4 className="text-[10px] font-bold text-[#10b981] mb-2 flex justify-between">
                       <span>AUTHORITATIVE SERVER</span>
                       <span className="font-mono">Load: 12%</span>
                    </h4>
                    <div className="space-y-1 mt-2">
                       <div className="flex justify-between text-[9px] text-[#737373]"><span>Unacked Inputs</span><span>14</span></div>
                       <div className="flex justify-between text-[9px] text-[#737373]"><span>Tick Accumulator</span><span>0.016s</span></div>
                    </div>
                </div>
            </div>
         </div>

         {/* Right Details Panel */}
         <div className="w-[340px] bg-[#111] border-l border-[#222] flex flex-col shrink-0 z-10">
             
             <div className="p-3 border-b border-[#222] bg-[#171717] flex justify-between items-center">
                 <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3] flex items-center gap-2"><Settings2 size={16}/> Net Variables</h3>
                 <button className="w-5 h-5 bg-[#222] hover:bg-[#333] rounded flex items-center justify-center text-[#737373]"><RefreshCw size={12}/></button>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-[11px]">
                 
                 {/* Connection Simulation */}
                 <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-[#737373] uppercase border-b border-[#333] pb-1 flex justify-between">
                       <span>Simulate Network Conditions</span>
                       <Activity size={12}/>
                    </h4>
                    
                    <div>
                       <div className="flex justify-between text-[#a3a3a3] mb-1">
                          <span>Artificial Latency (Ping)</span>
                          <span className="font-mono text-[#f59e0b]">45 ms</span>
                       </div>
                       <input type="range" className="w-full accent-[#f59e0b]" min="0" max="500" defaultValue="45"/>
                    </div>
                    
                    <div>
                       <div className="flex justify-between text-[#a3a3a3] mb-1">
                          <span>Packet Loss (%)</span>
                          <span className="font-mono text-[#ef4444]">2%</span>
                       </div>
                       <input type="range" className="w-full accent-[#ef4444]" min="0" max="25" defaultValue="2"/>
                    </div>
                    
                    <div>
                       <div className="flex justify-between text-[#a3a3a3] mb-1">
                          <span>Jitter (ms)</span>
                          <span className="font-mono text-[#8b5cf6]">10 ms</span>
                       </div>
                       <input type="range" className="w-full accent-[#8b5cf6]" min="0" max="100" defaultValue="10"/>
                    </div>
                 </div>

                 {/* Replication Settings */}
                 <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-bold text-[#737373] uppercase border-b border-[#333] pb-1 flex justify-between">
                       <span>Object Replication Graph</span>
                       <Database size={12}/>
                    </h4>
                    
                    <div className="bg-[#171717] p-2 rounded border border-[#333] space-y-2">
                        <div className="flex items-center justify-between">
                           <span className="text-[#a3a3a3]">Interpolation Time</span>
                           <input type="number" defaultValue="0.1" step="0.01" className="w-16 bg-[#222] border border-[#444] p-1 rounded text-right font-mono" />
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-[#a3a3a3]">Max Rollback Frames</span>
                           <input type="number" defaultValue="60" step="1" className="w-16 bg-[#222] border border-[#444] p-1 rounded text-right font-mono" />
                        </div>
                        <label className="flex items-center gap-2 pt-1 text-[#a3a3a3]">
                           <input type="checkbox" defaultChecked className="accent-[#8b5cf6]" /> Enable Dead Reckoning
                        </label>
                        <label className="flex items-center gap-2 text-[#a3a3a3]">
                           <input type="checkbox" defaultChecked className="accent-[#8b5cf6]" /> Server Reconciliation
                        </label>
                    </div>
                 </div>

                 {/* Data Bandwidth Profile */}
                 <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-bold text-[#737373] uppercase border-b border-[#333] pb-1 flex justify-between">
                       <span>Bandwidth Profile (Per Sec)</span>
                       <BarChart2 size={12}/>
                    </h4>
                    
                    <div className="bg-[#171717] p-3 rounded border border-[#333] flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[10px]">
                           <span className="text-[#3b82f6]">Sent (Up)</span>
                           <span className="font-mono font-bold text-[#e5e5e5]">12.4 KB/s</span>
                        </div>
                        <div className="w-full h-1 bg-[#222]"><div className="h-full bg-[#3b82f6]" style={{width: '20%'}}></div></div>
                        
                        <div className="flex justify-between items-center text-[10px] mt-2">
                           <span className="text-[#10b981]">Recv (Down)</span>
                           <span className="font-mono font-bold text-[#e5e5e5]">64.8 KB/s</span>
                        </div>
                        <div className="w-full h-1 bg-[#222]"><div className="h-full bg-[#10b981]" style={{width: '60%'}}></div></div>
                    </div>
                 </div>

             </div>
         </div>
      </div>
    </div>
  );
}
