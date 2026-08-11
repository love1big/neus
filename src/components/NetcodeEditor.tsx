import React, { useState } from 'react';
import { Globe, Server, Activity, ArrowDownUp, ShieldCheck, Database, Play, Pause, AlertTriangle, RadioTower, Clock, Network} from 'lucide-react';

export default function NetcodeEditor() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#58a6ff]/10 rounded text-[#58a6ff]"><Globe size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Netcode & Server Orchestration</h2>
              <p className="text-[10px] text-[#8b949e]">Rollback Netcode, RPCs, Latency Simulation, and Authoritative State</p>
            </div>
         </div>
         
         <div className="flex gap-2 bg-[#0d1117] border border-[#30363d] rounded p-1 text-[11px] font-bold items-center px-3">
            <span className="text-[#8b949e] uppercase tracking-wider text-[9px] mr-2">Network Emulation</span>
            <select className="bg-transparent text-white outline-none">
               <option>LAN (1ms, 0% Loss)</option>
               <option>WiFi Good (25ms, 1% Loss)</option>
               <option>4G Mobile (80ms, 5% Loss)</option>
               <option>Satellite (300ms, 10% Jitter)</option>
            </select>
         </div>

         <div className="flex gap-2 text-[11px] font-bold">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors"><Database size={12}/> Manage Fleet</button>
            <div className="w-px h-6 bg-[#30363d] mx-1"></div>
            <button onClick={() => setIsRunning(!isRunning)} className={`px-4 py-1.5 rounded flex items-center gap-2 transition-colors ${isRunning ? 'bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/30' : 'bg-[#2ea043] text-white hover:bg-[#238636]'}`}>
               {isRunning ? <><Pause size={12}/> Stop Server</> : <><Play size={12}/> Boot Local Server</>}
            </button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Connection List & RPCs */}
        <div className="w-72 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
            <div className="p-3 border-b border-[#30363d] bg-[#0d1117] flex justify-between items-center">
               <span className="font-bold text-[11px] uppercase tracking-wider text-[#c9d1d9] flex items-center gap-2"><Server size={14}/> Active Clients</span>
               <span className="bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded text-[10px] font-bold border border-[#3fb950]/30">{isRunning ? '3 / 64' : '0 / 64'}</span>
            </div>

            <div className="flex flex-col gap-1 p-2 border-b border-[#30363d] max-h-48 overflow-y-auto custom-scrollbar">
               {isRunning ? (
                  <>
                     <div className="bg-[#0d1117] border border-[#30363d] p-2 rounded flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-[#3fb950] shadow-[0_0_5px_#3fb950]"></div>
                           <span className="font-mono text-[#c9d1d9]">Client_0A</span>
                        </div>
                        <span className="font-mono text-[#e3b341]">24ms</span>
                     </div>
                     <div className="bg-[#0d1117] border border-[#30363d] p-2 rounded flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-[#3fb950] shadow-[0_0_5px_#3fb950]"></div>
                           <span className="font-mono text-[#c9d1d9]">Client_1B</span>
                        </div>
                        <span className="font-mono text-[#e3b341]">35ms</span>
                     </div>
                     <div className="bg-[#0d1117] border border-[#f85149]/30 p-2 rounded flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-[#f85149] shadow-[0_0_5px_#f85149]"></div>
                           <span className="font-mono text-[#f85149]">Client_4C</span>
                        </div>
                        <span className="font-mono text-[#f85149]">340ms <span className="text-[8px]">(LAG)</span></span>
                     </div>
                  </>
               ) : (
                  <div className="text-center py-4 text-[#8b949e] text-[10px] italic">Server offline.</div>
               )}
            </div>

            <div className="p-3 border-b border-[#30363d] bg-[#0d1117] flex justify-between items-center">
               <span className="font-bold text-[11px] uppercase tracking-wider text-[#c9d1d9] flex items-center gap-2"><ArrowDownUp size={14}/> Network Events (RPCs)</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 font-mono text-[9px] space-y-1">
               {isRunning ? (
                  <>
                     <div className="text-[#3fb950] bg-[#161b22] px-1 py-0.5 rounded">[00:01:24] Server_AcceptConnection: Client_0A</div>
                     <div className="text-[#58a6ff] bg-[#161b22] px-1 py-0.5 rounded">[00:01:25] RPC_NetPlayerSpawn (Reliable) -&gt; Client_0A</div>
                     <div className="text-[#8b949e] bg-[#161b22] px-1 py-0.5 rounded">[00:01:25] Sync_Transform [120Hz]</div>
                     <div className="text-[#3fb950] bg-[#161b22] px-1 py-0.5 rounded">[00:01:26] Server_AcceptConnection: Client_1B</div>
                     <div className="text-[#f85149] bg-[#161b22] px-1 py-0.5 rounded">[00:01:30] WARNING: Dropped packet from Client_4C</div>
                     <div className="text-[#e3b341] bg-[#161b22] px-1 py-0.5 rounded">[00:01:32] ROLLBACK: Client_0A frame 1402 -&gt; 1398</div>
                     <div className="text-[#58a6ff] bg-[#161b22] px-1 py-0.5 rounded">[00:01:33] Server_RPC_PlayerFire (Reliable)</div>
                  </>
               ) : null}
            </div>
        </div>

        {/* Center: Graph & Console */}
        <div className="flex-1 bg-[#0a0a0a] flex flex-col relative">
           
           <div className="h-1/2 border-b border-[#30363d] p-4 flex flex-col relative overflow-hidden">
               <div className="flex justify-between items-center mb-4 relative z-10">
                  <span className="font-bold text-[11px] uppercase tracking-wide text-[#c9d1d9] flex items-center gap-2"><Activity size={14}/> Bandwidth In/Out</span>
               </div>
               
               {/* Mock Graph */}
               <div className="flex-1 relative z-0">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                     <path d="M0,80 C20,90 40,70 60,85 T100,50 T150,60 T200,90 T250,50 T300,40" fill="none" stroke="#3fb950" strokeWidth="2" vectorEffect="non-scaling-stroke" className={isRunning ? 'animate-[dash_5s_linear_infinite]' : ''}/>
                     <path d="M0,150 C30,120 50,140 80,110 T120,130 T180,90 T220,100 T300,80" fill="none" stroke="#58a6ff" strokeWidth="2" vectorEffect="non-scaling-stroke" className={isRunning ? 'animate-[dash_6s_linear_infinite]' : ''}/>
                  </svg>
                  <div className="absolute top-2 right-2 flex flex-col gap-1 text-[9px] font-mono font-bold bg-[#161b22]/80 backdrop-blur border border-[#30363d] p-2 rounded">
                     <div className="flex items-center gap-2 text-[#3fb950]"><ArrowDownUp size={10}/> OUT: {isRunning ? '1.2' : '0.0'} MB/s</div>
                     <div className="flex items-center gap-2 text-[#58a6ff]"><ArrowDownUp size={10}/> IN: {isRunning ? '0.4' : '0.0'} MB/s</div>
                     <div className="flex items-center gap-2 text-[#c9d1d9]"><Clock size={10}/> Tick Rate: 60Hz</div>
                  </div>
               </div>
           </div>

               {/* Rollback Details Visualizer */}
               <div className="flex-1 p-4 flex flex-col bg-[#0d1117] overflow-y-auto custom-scrollbar">
                   <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-[11px] uppercase tracking-wide text-[#e3b341] flex items-center gap-2"><Network size={14}/> Rollback Window Profiler</span>
                   </div>
                   
                   <div className="flex flex-col gap-2 shrink-0">
                      <div className="flex items-center text-[10px] font-mono text-[#8b949e]">
                         <span className="w-16">Local</span>
                         <div className="flex-1 h-2 bg-[#21262d] rounded-full relative">
                            <div className="absolute right-[10%] w-3 h-3 bg-[#3fb950] rounded-full -top-[2px] shadow-[0_0_5px_#3fb950]"></div>
                         </div>
                         <span className="w-16 text-right">Frame 1420</span>
                      </div>
                      <div className="flex items-center text-[10px] font-mono text-[#8b949e]">
                         <span className="w-16">Server</span>
                         <div className="flex-1 h-2 bg-[#21262d] rounded-full relative">
                            <div className="absolute right-[20%] w-3 h-3 bg-[#58a6ff] rounded-full -top-[2px] shadow-[0_0_5px_#58a6ff]"></div>
                         </div>
                         <span className="w-16 text-right">Frame 1412</span>
                      </div>
                      <div className="flex items-center text-[10px] font-mono text-[#e3b341]">
                         <span className="w-16">Remote</span>
                         <div className="flex-1 h-2 bg-[#21262d] rounded-full relative opacity-50">
                            <div className="absolute right-[40%] w-3 h-3 bg-[#e3b341] rounded-full -top-[2px]"></div>
                            {/* Rollback visualization */}
                            <div className="absolute right-[40%] text-[#e3b341] -top-6 flex items-center gap-1"><ArrowDownUp size={10}/> Rollback delta: 6 frames</div>
                         </div>
                         <span className="w-16 text-right">Frame 1395</span>
                      </div>
                   </div>
    
                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-8 shrink-0">
                       {/* AI Security Box */}
                       <div className="bg-[#3fb950]/10 border border-[#3fb950]/30 rounded-lg p-3 flex gap-3 h-full">
                          <div className="p-2 bg-[#3fb950]/20 rounded h-min text-[#3fb950] shrink-0"><ShieldCheck size={20}/></div>
                          <div className="flex-1 flex flex-col justify-between">
                             <div>
                                 <h3 className="text-[11px] font-bold text-[#3fb950] uppercase tracking-wide">Anti-Cheat Guardian Online</h3>
                                 <p className="text-[11px] text-[#c9d1d9] mt-1 pr-4">Analyzing player input vectors for impossible physics logic. <span className="font-mono text-[#8b949e]">0</span> violations detected in this session.</p>
                             </div>
                             <div className="mt-2 text-[10px] text-[#8b949e] font-mono bg-[#0d1117] border border-[#30363d] p-1.5 rounded self-start">Rule DB: ApexSec_v1.4 Loaded</div>
                          </div>
                       </div>
                       
                       {/* AI Optimization Box */}
                       <div className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 rounded-lg p-3 flex gap-3 h-full">
                          <div className="p-2 bg-[#bc8cff]/20 rounded h-min text-[#bc8cff] shrink-0"><AlertTriangle size={20}/></div>
                          <div className="flex-1 flex flex-col justify-between">
                             <div>
                                 <h3 className="text-[11px] font-bold text-[#bc8cff] uppercase tracking-wide">AI Replication Graph Analysis</h3>
                                 <p className="text-[10px] text-[#c9d1d9] mt-1 pr-2">
                                    Bandwidth anomaly: 400 background NPCs are replicating skeletal IK at 60Hz. <strong className="text-white">Suggested Pruning Strategy:</strong>
                                 </p>
                                 <ul className="text-[9px] text-[#8b949e] mt-2 list-disc pl-3 space-y-1 font-mono">
                                     <li>Enable <b>Net Dormancy</b> for NPCs outside 50m frustum.</li>
                                     <li>Drop tick rate to <b>10Hz</b> for out-of-sight entities.</li>
                                     <li>Prune <b>IK Transforms</b>; replicate only root motion & local state enums.</li>
                                 </ul>
                             </div>
                             <button className="mt-3 px-3 py-1 bg-[#bc8cff]/20 hover:bg-[#bc8cff]/40 border border-[#bc8cff]/50 rounded text-[10px] font-bold text-white transition-colors self-start tracking-wide uppercase flex items-center gap-1"><Database size={10} /> Apply Pruning Matrix</button>
                          </div>
                       </div>
                   </div>
               </div>

        </div>

      </div>
    </div>
  );
}
