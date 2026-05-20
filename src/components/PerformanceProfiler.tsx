import React, { useState } from 'react';
import { Bug, Activity, Cpu, Database, Flame, MemoryStick, Save, Layers, Clock, Settings, Search, FastForward, Play, Pause, AlertTriangle } from 'lucide-react';

export default function PerformanceProfiler() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f85149]/10 rounded text-[#f85149]"><Bug size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Advanced Performance Profiler</h2>
              <p className="text-[10px] text-[#8b949e]">Flame Graphs, Memory Leaks, Frame Budget & GPU Trace</p>
            </div>
         </div>
         
         <div className="flex items-center justify-center gap-1 bg-[#0d1117] border border-[#30363d] rounded p-1 text-[11px] font-bold">
            <button onClick={() => setIsPlaying(!isPlaying)} className={`px-4 py-1.5 rounded transition-colors flex items-center gap-2 ${isPlaying ? 'bg-[#f85149]/20 text-[#f85149]' : 'bg-[#2ea043] text-white'}`}>
                {isPlaying ? <><Pause size={12}/> Stop Capture</> : <><Play size={12}/> Start Capture</>}
            </button>
         </div>

         <div className="flex gap-2 text-[11px] font-bold">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors"><Save size={12}/> Save Trace</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Summary & Threads */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
            <div className="p-3 border-b border-[#30363d]">
               <div className="text-[11px] font-bold text-[#c9d1d9] uppercase tracking-wide mb-2 flex items-center gap-2"><Activity size={12}/> Target Profile</div>
               <select className="w-full bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-[11px] outline-none text-white font-mono">
                  <option>Client_Windows (Local)</option>
                  <option>Server_Linux (Dedicated)</option>
                  <option>Console_DevKit_01</option>
               </select>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 text-[11px]">
               <div className="font-bold text-[#8b949e] uppercase text-[10px] mb-2 pl-1">Frame Budget</div>
               <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 mb-4">
                  <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-white">Target FPS</span>
                     <span className="text-[#3fb950] font-mono">60.0</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-white">Target MS</span>
                     <span className="text-[#3fb950] font-mono">16.67ms</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-[#30363d]">
                     <span className="font-bold text-[#f85149]">Current MS</span>
                     <span className="text-[#f85149] font-mono font-bold">22.40ms</span>
                  </div>
               </div>

               <div className="font-bold text-[#8b949e] uppercase text-[10px] mb-2 pl-1">Threads</div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 p-1.5 rounded bg-[#f85149]/10 border border-[#f85149]/30 text-white cursor-pointer">
                     <div className="w-2 h-2 rounded-full bg-[#f85149]"></div>
                     <span className="font-mono text-[10px] flex-1">GameThread</span>
                     <span className="font-bold text-[#f85149]">15.2ms</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-white cursor-pointer transition-colors">
                     <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                     <span className="font-mono text-[10px] flex-1">RenderThread</span>
                     <span className="font-bold text-[#58a6ff]">6.8ms</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-white cursor-pointer transition-colors">
                     <div className="w-2 h-2 rounded-full bg-[#e3b341]"></div>
                     <span className="font-mono text-[10px] flex-1">PhysicsThread</span>
                     <span className="font-bold text-[#e3b341]">2.1ms</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-white cursor-pointer transition-colors">
                     <div className="w-2 h-2 rounded-full bg-[#bc8cff]"></div>
                     <span className="font-mono text-[10px] flex-1">AudioThread</span>
                     <span className="font-bold text-[#bc8cff]">0.4ms</span>
                  </div>
               </div>
            </div>
        </div>

        {/* Right Side: Visualizers */}
        <div className="flex-1 bg-[#0a0a0a] flex flex-col relative overflow-hidden">
           
           {/* Timeline Context */}
           <div className="h-16 border-b border-[#30363d] bg-[#161b22] px-4 py-2 flex flex-col justify-end relative">
              <div className="flex justify-between text-[9px] text-[#8b949e] font-mono absolute top-2 left-4 right-4">
                 <span>0.0s</span><span>0.5s</span><span>1.0s</span><span>1.5s</span><span>2.0s</span>
              </div>
              <div className="h-6 bg-[#0d1117] border border-[#30363d] rounded flex relative overflow-hidden w-full">
                 {/* Mock Timeline Data */}
                 <div className="absolute top-0 bottom-0 bg-[#3fb950]/30 w-full"></div>
                 {/* Spikes */}
                 <div className="absolute top-0 bottom-0 bg-[#f85149]/60 w-1 left-[20%]"></div>
                 <div className="absolute top-0 bottom-0 bg-[#f85149]/60 w-2 left-[55%]"></div>
                 <div className="absolute top-0 bottom-0 bg-[#f85149] w-4 left-[80%]"></div>
                 
                 {/* Selection Box */}
                 <div className="absolute top-0 bottom-0 bg-[#58a6ff]/10 border-x border-[#58a6ff] w-32 left-[70%]"></div>
              </div>
           </div>

           {/* Flame Graph Window */}
           <div className="flex-1 p-4 flex flex-col relative">
              <div className="flex justify-between items-center mb-4">
                 <span className="font-bold text-[11px] uppercase tracking-wide text-[#c9d1d9] flex items-center gap-2"><Flame size={14} className="text-[#f85149]"/> GameThread Flame Graph (Selected Range)</span>
                 <div className="text-[10px] text-[#8b949e] bg-[#21262d] px-2 py-1 rounded">Zoom: 400x</div>
              </div>

              {/* Flame Graph Mock */}
              <div className="flex-1 overflow-auto custom-scrollbar relative border border-[#30363d] bg-[#111] p-2 rounded block">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zOSA0MHYtNDBoMXY0MEgzOXptLTQtNDBoMXY0MGgtMXYtNDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] pointer-events-none opacity-50"></div>
                  
                  <div className="relative mt-[2px] h-6 bg-[#f85149]/80 border border-[#f85149] rounded-[2px] text-[10px] font-mono text-black font-bold flex items-center px-2 w-[98%] shadow-sm hover:brightness-125 cursor-pointer">Tick (15.2ms)</div>
                  
                  <div className="flex w-[98%] relative mt-[2px]">
                     <div className="h-6 bg-[#f85149]/70 border border-[#f85149] rounded-[2px] text-[10px] font-mono text-black font-bold flex items-center px-2 w-[60%] shadow-sm hover:brightness-125 cursor-pointer">UpdateWorld (9.1ms)</div>
                     <div className="h-6 bg-[#e3b341]/80 border border-[#e3b341] rounded-[2px] text-[10px] font-mono text-black font-bold flex items-center px-2 ml-[2px] w-[30%] shadow-sm hover:brightness-125 cursor-pointer">PhysicsTick (4.5ms)</div>
                     <div className="h-6 bg-[#58a6ff]/80 border border-[#58a6ff] rounded-[2px] text-[10px] font-mono text-black font-bold flex items-center px-2 ml-[2px] flex-1 shadow-sm hover:brightness-125 cursor-pointer truncate">Wait (1.6ms)</div>
                  </div>

                  <div className="flex w-[60%] relative mt-[2px]">
                     <div className="h-6 bg-[#f85149]/60 border border-[#f85149] rounded-[2px] text-[10px] font-mono text-black font-bold flex items-center px-2 w-[40%] shadow-sm hover:brightness-125 cursor-pointer">Blueprint: BP_PlayerController (3.6ms)</div>
                     <div className="h-6 bg-[#f85149]/50 border border-[#f85149] rounded-[2px] text-[10px] font-mono text-black font-bold flex items-center px-2 ml-[2px] flex-1 shadow-sm hover:brightness-125 cursor-pointer">AI_Pathfinding (5.5ms)</div>
                  </div>

                  <div className="flex relative mt-[2px]">
                     <div className="w-[24%] ml-[24%]">
                        <div className="h-6 bg-[#8b949e] border border-white/20 rounded-[2px] text-[10px] font-mono text-white flex items-center px-2 shadow-sm animate-pulse cursor-pointer">NavMesh Sync [STALL] (5.2ms)</div>
                     </div>
                  </div>
              </div>

               {/* AI Insight Box */}
               <div className="mt-4 bg-[#f85149]/10 border border-[#f85149]/30 rounded-lg p-3 flex gap-3">
                  <div className="p-2 bg-[#f85149]/20 rounded h-min text-[#f85149]"><AlertTriangle size={20}/></div>
                  <div className="flex-1">
                     <h3 className="text-[11px] font-bold text-[#f85149] uppercase tracking-wide">AI Performance Insight</h3>
                     <p className="text-[11px] text-[#c9d1d9] mt-1 pr-4">Critical stall on GameThread detected. <span className="font-mono text-[#8b949e]">AI_Pathfinding</span> is calling <span className="font-mono text-[#8b949e] bg-[#21262d] px-1 rounded">NavMesh Sync</span> synchronously during Tick. </p>
                     <p className="text-[11px] text-[#3fb950] font-bold mt-2 cursor-pointer hover:underline">Auto-Fix Suggestion: Move Pathfinding to Async Task Graph.</p>
                  </div>
               </div>
           </div>

        </div>
      </div>
    </div>
  );
}
