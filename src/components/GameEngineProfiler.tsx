import React from 'react';
import { Activity, Flame, Cpu, Database, Network, Clock, AlertTriangle, Search, Filter, Server, Laptop, Settings, Play, Pause, ChevronDown, RefreshCw, BarChart2, PieChart} from 'lucide-react';

export default function GameEngineProfiler() {
  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0d1117] text-[#c9d1d9] font-sans text-xs overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2 shrink-0 z-10 shadow-md">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded text-[10px] font-black shadow uppercase tracking-widest border border-red-500">
               <Activity size={14} className="animate-pulse"/> PerfAnalyzer 
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
               <span className="text-[#3fb950] font-bold">120.4 FPS</span>
               <span className="text-[#8b949e]">|</span>
               <span className="text-[#58a6ff] font-bold">8.3ms</span>
               <span className="text-[#8b949e]">|</span>
               <span className="text-[#e3b341] font-bold">MEM: 4.2 GB</span>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="flex bg-[#21262d] rounded border border-[#30363d] overflow-hidden text-[#8b949e] font-bold">
               <button className="px-4 py-1 hover:text-white transition-colors border-r border-[#30363d]">Capture Frame</button>
               <button className="px-4 py-1 bg-[#30363d] text-white transition-colors flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Profiling...</button>
            </div>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Flame Graph & Timelines (Main) */}
         <div className="flex-1 flex flex-col min-w-[500px]">
            {/* Thread CPU Usage summary graph */}
            <div className="h-32 border-b border-[#30363d] bg-[#161b22] flex flex-col p-2 relative shrink-0">
               <div className="flex justify-between items-center text-[10px] font-bold text-[#8b949e] mb-1">
                  <span className="flex items-center gap-1"><Cpu size={12}/> CPU Utilization History</span>
                  <span>100%</span>
               </div>
               <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded flex items-end p-1 gap-[1px] relative overflow-hidden">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                     <div className="border-b border-[#30363d]/30 h-1/4"></div>
                     <div className="border-b border-[#30363d]/30 h-1/4"></div>
                     <div className="border-b border-[#30363d]/30 h-1/4"></div>
                     <div className="h-1/4"></div>
                  </div>
                  {/* Fake Histogram Bars */}
                  {Array.from({length: 100}).map((_, i) => {
                     const height1 = 20 + Math.sin(i * 0.1) * 10 + Math.random() * 5;
                     const height2 = 10 + Math.cos(i * 0.2) * 5 + Math.random() * 5;
                     const isSpike = i === 75 || i === 76;
                     const spikeHeight = isSpike ? 80 + Math.random() * 10 : 0;
                     return (
                        <div key={i} className="flex-1 flex flex-col justify-end min-w-[2px]">
                           {isSpike && <div className="w-full bg-red-500 opacity-80" style={{height: `${spikeHeight}%`}}></div>}
                           {!isSpike && (
                              <>
                                 <div className="w-full bg-[#e3b341] opacity-80" style={{height: `${height2}%`}}></div>
                                 <div className="w-full bg-[#58a6ff] opacity-80" style={{height: `${height1}%`}}></div>
                              </>
                           )}
                        </div>
                     );
                  })}
                  {/* Playhead marker simulating the spike point */}
                  <div className="absolute top-0 bottom-0 left-[75%] w-px bg-white z-10 shadow-[0_0_5px_white]"></div>
               </div>
            </div>

            {/* Deep Flame Graph View */}
            <div className="flex-1 bg-[#0d1117] flex flex-col relative overflow-hidden">
               <div className="h-8 border-b border-[#30363d] bg-[#161b22] w-full flex items-center px-4 font-bold text-[#8b949e] uppercase tracking-wider text-[10px] shrink-0 justify-between">
                  <div className="flex gap-4">
                     <span className="text-white border-b-2 border-white pb-1 mt-1">CPU Flame Graph (Frame 42,901)</span>
                     <span className="hover:text-white cursor-pointer ml-4">GPU Timings</span>
                     <span className="hover:text-white cursor-pointer ml-4">Memory Allocations</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Filter size={12}/> Filter Threads...
                  </div>
               </div>
               
               <div className="flex-1 overflow-auto custom-scrollbar p-2 bg-[linear-gradient(90deg,#161b22_1px,transparent_1px)] bg-[size:50px_100%] min-w-max relative font-mono text-[9px] text-white">
                  {/* Simulated Frame Time Ruler */}
                  <div className="w-[1000px] h-4 flex mb-2 border-b border-[#30363d] sticky top-0 bg-[#0d1117] z-20 text-[#8b949e]">
                     {Array.from({length: 10}).map((_, i) => (
                        <div key={i} className="flex-1 border-l border-[#30363d] pl-1">{i} ms</div>
                     ))}
                  </div>

                  {/* Thread: Main */}
                  <div className="w-[1000px] mb-6 relative">
                     <div className="sticky left-0 bg-[#0d1117]/80 backdrop-blur text-[#8b949e] font-bold py-1 z-10 font-sans w-max px-2 border border-[#30363d] rounded mb-1">
                        Main Thread (0x1A42) - 8.3ms
                     </div>
                     {/* Flame blocks level 1 */}
                     <div className="h-4 relative flex w-full">
                        <FlameBlock color="bg-[#58a6ff]" w="w-[83%]" label="EngineTick" />
                        <FlameBlock color="bg-transparent" w="w-[17%]" label="Idle" textClass="text-[#8b949e] pl-1"/>
                     </div>
                     {/* Flame blocks level 2 */}
                     <div className="h-4 relative flex w-[83%]">
                        <FlameBlock color="bg-[#3fb950]" w="w-[15%]" label="ProcessInput" />
                        <FlameBlock color="bg-[#e3b341]" w="w-[45%]" label="WorldTick" />
                        <FlameBlock color="bg-[#bc8cff]" w="w-[40%]" label="RenderCommandBase" />
                     </div>
                     {/* Flame blocks level 3 */}
                     <div className="h-4 relative flex w-[83%]">
                        <div className="w-[15%]"></div>
                        <div className="w-[45%] flex">
                           <FlameBlock color="bg-[#d29922]" w="w-[30%]" label="TickPhysics" />
                           <FlameBlock color="bg-[#d29922]" w="w-[50%]" label="TickActors" />
                           <FlameBlock color="bg-red-500" w="w-[20%]" label="GarbageCollect (Spike)" />
                        </div>
                        <div className="w-[40%] flex">
                           <FlameBlock color="bg-[#a371f7]" w="w-[70%]" label="EnqueueDrawCalls" />
                           <FlameBlock color="bg-[#a371f7]" w="w-[30%]" label="WaitOnGPU" opacity="opacity-50"/>
                        </div>
                     </div>
                     {/* Flame blocks level 4 */}
                     <div className="h-4 relative flex w-[83%]">
                        <div className="w-[15%]"></div>
                        <div className="w-[45%] flex">
                           <div className="w-[30%]"></div>
                           <div className="w-[50%] flex">
                              <FlameBlock color="bg-[#fb8500]" w="w-[40%]" label="UpdateTransforms" />
                              <FlameBlock color="bg-[#fb8500]" w="w-[60%]" label="BlueprintUpdate" />
                           </div>
                           <div className="w-[20%]"></div>
                        </div>
                        <div className="w-[40%]"></div>
                     </div>
                  </div>

                  {/* Thread: Render */}
                  <div className="w-[1000px] mb-6 relative">
                     <div className="sticky left-0 bg-[#0d1117]/80 backdrop-blur text-[#8b949e] font-bold py-1 z-10 font-sans w-max px-2 border border-[#30363d] rounded mb-1">
                        Render Thread (0x2B11) - 7.1ms
                     </div>
                     <div className="h-4 relative flex w-[71%]">
                        <FlameBlock color="bg-[#bc8cff]" w="w-[100%]" label="ProcessRenderCommands" />
                     </div>
                     <div className="h-4 relative flex w-[71%]">
                        <FlameBlock color="bg-[#a371f7]" w="w-[20%]" label="ShadowDepths" />
                        <FlameBlock color="bg-[#a371f7]" w="w-[30%]" label="BasePass" />
                        <FlameBlock color="bg-[#a371f7]" w="w-[15%]" label="Lighting" />
                        <FlameBlock color="bg-[#a371f7]" w="w-[25%]" label="PostProcessing" />
                        <FlameBlock color="bg-[#a371f7]" w="w-[10%]" label="Present" />
                     </div>
                  </div>

                  {/* Thread: Audio */}
                  <div className="w-[1000px] relative">
                     <div className="sticky left-0 bg-[#0d1117]/80 backdrop-blur text-[#8b949e] font-bold py-1 z-10 font-sans w-max px-2 border border-[#30363d] rounded mb-1">
                        Audio Thread (0x3C99) - 1.2ms
                     </div>
                     <div className="h-4 relative flex w-[12%]">
                        <FlameBlock color="bg-[#1f6feb]" w="w-[100%]" label="AudioMixer" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Stats & Inspector */}
         <div className="w-80 bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0">
            <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] font-bold text-white uppercase tracking-wider text-[11px] flex gap-2 items-center shadow-sm">
               <Search size={14} className="text-[#58a6ff]"/> Selected Event Detail
            </div>
            
            {/* Inspector Details */}
            <div className="p-4 space-y-4 border-b border-[#30363d]">
               <h3 className="font-bold text-red-500 text-[14px]">GarbageCollect</h3>
               <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="text-[#8b949e]">Duration:</span>
                  <span className="font-mono text-white text-right font-bold text-red-400">1.66 ms</span>
                  <span className="text-[#8b949e]">Start Time:</span>
                  <span className="font-mono text-white text-right">3.32 ms</span>
                  <span className="text-[#8b949e]">Thread ID:</span>
                  <span className="font-mono text-white text-right">0x1A42</span>
                  <span className="text-[#8b949e]">Allocations Freed:</span>
                  <span className="font-mono text-white text-right">14,204</span>
               </div>
               <div className="bg-[#0d1117] border border-red-900/50 rounded p-2 text-red-400 mt-2 flex gap-2">
                  <AlertTriangle size={14} className="shrink-0"/>
                  <span className="text-[10px]">Warning: GC spike exceeded 1.0ms budget. Consider pre-allocating complex object structures or utilizing object pooling for Projectile instances.</span>
               </div>
            </div>

            {/* Network / Misc Stats breakdown */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
               <div className="px-2 py-1.5 bg-[#21262d] border border-[#30363d] rounded font-bold text-white text-[10px] uppercase tracking-wider flex justify-between items-center mb-2">
                  <span className="flex items-center gap-1.5"><Database size={12}/> Memory Pools</span>
               </div>
               <div className="space-y-2 px-2 mb-4">
                  <StatBar label="Texture VRAM" value="2.1 GB" percent="65%" color="bg-[#bc8cff]"/>
                  <StatBar label="Geometry" value="840 MB" percent="25%" color="bg-[#3fb950]"/>
                  <StatBar label="Audio Buffer" value="120 MB" percent="15%" color="bg-[#e3b341]"/>
                  <StatBar label="Physics Heap" value="45 MB" percent="5%" color="bg-[#d29922]"/>
               </div>

               <div className="px-2 py-1.5 bg-[#21262d] border border-[#30363d] rounded font-bold text-white text-[10px] uppercase tracking-wider flex justify-between items-center mb-2">
                  <span className="flex items-center gap-1.5"><Network size={12}/> Network Replication</span>
               </div>
               <div className="space-y-2 px-2 pb-4 text-[11px]">
                  <div className="flex justify-between items-center"><span className="text-[#8b949e]">Bits Sent per Frame</span><span className="font-mono text-white font-bold">12,042 b</span></div>
                  <div className="flex justify-between items-center"><span className="text-[#8b949e]">Bits Recv per Frame</span><span className="font-mono text-white font-bold">1,840 b</span></div>
                  <div className="flex justify-between items-center"><span className="text-[#8b949e]">Packet Loss</span><span className="font-mono text-[#3fb950] font-bold">0.02%</span></div>
                  <div className="flex justify-between items-center"><span className="text-[#8b949e]">Avg Ping</span><span className="font-mono text-white font-bold">34 ms</span></div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}

function FlameBlock({color, w, label, textClass, opacity}: {color: string, w: string, label: string, textClass?: string, opacity?: string}) {
   return (
      <div className={`${w} ${color} ${opacity || ''} border-r border-[#0d1117] relative overflow-hidden flex items-center group cursor-pointer hover:brightness-125`}>
         <span className={`absolute left-1 whitespace-nowrap text-[8px] font-bold ${textClass || 'text-white drop-shadow-md'}`}>{label}</span>
         {color !== 'bg-transparent' && <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors pointer-events-none"></div>}
      </div>
   );
}

function StatBar({label, value, percent, color}: {label: string, value: string, percent: string, color: string}) {
   return (
      <div className="flex flex-col gap-1 text-[10px]">
         <div className="flex justify-between items-center"><span className="text-[#c9d1d9]">{label}</span><span className="font-mono font-bold text-white">{value}</span></div>
         <div className="w-full bg-[#0d1117] h-1.5 rounded-full overflow-hidden border border-[#30363d]">
            <div className={`h-full ${color}`} style={{width: percent}}></div>
         </div>
      </div>
   );
}
