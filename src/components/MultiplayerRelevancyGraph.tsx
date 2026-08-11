import React, { useState } from 'react';
import { Network, Activity, Settings, Maximize, Orbit, ZoomIn, ZoomOut, Save, Wifi, Server, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = Array.from({ length: 20 }).map((_, i) => ({
  time: i,
  bandwidth: 15 + Math.random() * 10,
  latency: 30 + Math.random() * 20
}));

export default function MultiplayerRelevancyGraph() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-700 p-1.5 rounded-lg shadow-lg">
            <Network size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Network <span className="text-blue-400">Relevancy Graph</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Replication & Net Cull Distance Optimization</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-[#1a1a1c] border border-blue-500/50 text-blue-400 px-3 py-1.5 rounded text-[10px] font-mono font-bold animate-pulse">
             NET: ONLINE (64/64 PEERS)
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Viewport */}
        <div className="flex-1 bg-[#121212] relative flex flex-col overflow-hidden">
           
           <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black">
              
              {/* Fake Network Graph Visualization */}
              
              {/* Central Server Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                 <div className="w-16 h-16 bg-blue-600 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.8)] border-2 border-blue-400 flex items-center justify-center animate-pulse">
                   <Server size={24} className="text-white"/>
                 </div>
                 <span className="text-[10px] font-mono text-blue-400 mt-2 font-bold bg-black/50 px-2 py-1 rounded">DS_MAIN_01</span>
              </div>

              {/* Relevancy Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-blue-500/30 rounded-full border-dashed animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-blue-500/10 rounded-full border-dashed animate-[spin_90s_linear_infinite_reverse]"></div>

              {/* Peer Nodes */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="absolute z-10 flex flex-col items-center" style={{
                  top: `calc(50% + ${Math.sin(i * (Math.PI / 4)) * 200}px)`,
                  left: `calc(50% + ${Math.cos(i * (Math.PI / 4)) * 200}px)`,
                }}>
                   <div className="w-8 h-8 bg-[#252526] rounded-full border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] flex items-center justify-center z-10">
                     <Wifi size={12} className="text-green-400"/>
                   </div>
                   <span className="text-[9px] font-mono text-gray-500 mt-1">Client_{i}</span>
                   
                   {/* Connections to Server */}
                   <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-0" style={{ width: 0, height: 0 }}>
                      <line x1="16" y1="16" x2={-Math.cos(i * (Math.PI / 4)) * 200 + 16} y2={-Math.sin(i * (Math.PI / 4)) * 200 + 16} stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]"/>
                   </svg>
                </div>
              ))}

              {/* Culled Nodes (Outside radius) */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="absolute z-10 flex flex-col items-center opacity-30" style={{
                  top: `calc(50% + ${Math.sin(i * (Math.PI / 2) + 0.5) * 350}px)`,
                  left: `calc(50% + ${Math.cos(i * (Math.PI / 2) + 0.5) * 350}px)`,
                }}>
                   <div className="w-6 h-6 bg-[#252526] rounded-full border-2 border-red-500 flex items-center justify-center">
                   </div>
                   <span className="text-[9px] font-mono text-gray-500 mt-1">Culled</span>
                </div>
              ))}
           </div>
           
           {/* Telemetry Bar */}
           <div className="h-32 bg-[#1a1a1c] border-t border-[#3e3e42] p-4 flex gap-6 shrink-0">
             
             <div className="flex-1 flex flex-col h-full">
               <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Bandwidth (KB/s)</h4>
               <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBw" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3e3e42" vertical={false} />
                      <XAxis dataKey="time" stroke="#6b7280" fontSize={9} />
                      <YAxis stroke="#6b7280" fontSize={9} />
                      <Area type="monotone" dataKey="bandwidth" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBw)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
             </div>

             <div className="w-48 flex flex-col gap-2">
                <div className="bg-[#252526] border border-[#3e3e42] p-2 rounded flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Tick Rate</span>
                  <span className="text-sm font-mono text-green-400">60 Hz</span>
                </div>
                <div className="bg-[#252526] border border-[#3e3e42] p-2 rounded flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Avg Ping</span>
                  <span className="text-sm font-mono text-yellow-400">42 ms</span>
                </div>
                <div className="bg-[#252526] border border-[#3e3e42] p-2 rounded flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Packet Loss</span>
                  <span className="text-sm font-mono text-green-400">0.01%</span>
                </div>
             </div>

           </div>
        </div>

        {/* Right Properties */}
        <div className="w-72 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Replication Settings</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              
              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Culling</h4>
                 <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Net Cull Distance Squared</span>
                      <input type="text" defaultValue="225000000.0" className="w-24 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-white font-mono focus:border-blue-500 outline-none" />
                    </div>
                    <label className="flex items-center gap-2 text-gray-300 mt-2">
                      <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-blue-500 focus:ring-0" /> Always Relevant (Overrides Cull)
                    </label>
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Priority & Rates</h4>
                 <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between text-gray-400">
                      <span>Net Update Frequency</span>
                      <span className="text-white">100.0 / sec</span>
                    </div>
                    <input type="range" defaultValue="100" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-blue-500" />
                    
                    <div className="flex justify-between text-gray-400 mt-4">
                      <span>Min Net Update Frequency</span>
                      <span className="text-white">2.0 / sec</span>
                    </div>
                    <input type="range" defaultValue="2" max="20" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-blue-500" />
                    
                    <div className="flex justify-between items-center text-gray-400 mt-4">
                      <span>Net Priority</span>
                      <input type="number" defaultValue="1.0" className="w-16 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-white text-center font-mono focus:border-blue-500 outline-none" />
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Advanced Filtering</h4>
                 <div className="space-y-2 text-[10px] text-gray-300">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-blue-500 focus:ring-0" /> Replicate Movement
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-blue-500 focus:ring-0" /> Allow Client Side Navigation
                    </label>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
