import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, BarChart3, AlertCircle, Play, Pause, ChevronRight } from 'lucide-react';

export default function RuntimeProfiler() {
  const [isPlaying, setIsPlaying] = useState(true);
  
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#f85149]/20 border border-[#f85149]/50 rounded">
            <Activity className="text-[#f85149]" size={16} />
          </div>
          <div>
            <h1 className="font-bold text-sm">Advanced Runtime Profiler</h1>
            <p className="text-[10px] text-[#8b949e]">CPU, GPU & Memory Allocation Trace</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
             <Download size={14} /> Export Trace
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Metric Summary */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col z-10 shrink-0">
           <div className="p-3 border-b border-[#30363d]">
              <div className="text-3xl font-bold text-[#3fb950] mb-1">118 FPS</div>
              <div className="text-xs text-[#8b949e]">Frame Time: 8.4ms</div>
           </div>
           <div className="p-3 space-y-4 flex-1 overflow-y-auto">
              
              <MetricCard icon={<Cpu size={14} className="text-[#58a6ff]"/>} title="CPU (Logic Thread)" value="32%" barColor="bg-[#58a6ff]" percent="32" />
              <MetricCard icon={<Activity size={14} className="text-[#a371f7]"/>} title="GPU (Render Thread)" value="84%" barColor="bg-[#a371f7]" percent="84" />
              <MetricCard icon={<HardDrive size={14} className="text-[#d29922]"/>} title="Memory (RAM)" value="4.2 GB / 16GB" barColor="bg-[#d29922]" percent="25" />
              <MetricCard icon={<HardDrive size={14} className="text-[#f85149]"/>} title="VRAM (Textures)" value="6.8 GB / 8GB" barColor="bg-[#f85149]" percent="85" alert />

           </div>
        </div>

        {/* Center: Flame Graph & Timeline */}
        <div className="flex-1 bg-[#010409] flex flex-col relative overflow-hidden">
           
           {/* Top: Flame Graph Summary */}
           <div className="h-64 border-b border-[#30363d] bg-[#0d1117] p-4 flex flex-col">
              <div className="text-xs font-bold text-[#8b949e] mb-2 flex items-center justify-between">
                 <span>CALL STACK (FLAME GRAPH)</span>
                 <span className="text-white bg-[#161b22] px-2 py-1 rounded border border-[#30363d]">Tick: 8.4ms</span>
              </div>
              <div className="flex-1 relative flex flex-col justify-end gap-1 pb-4">
                 {/* Fake Flame Graph Layers */}
                 <div className="h-6 w-full bg-[#30363d] rounded text-[10px] px-2 flex items-center font-mono">Engine Loop</div>
                 <div className="flex gap-1">
                    <div className="h-6 w-1/4 bg-[#58a6ff]/40 border border-[#58a6ff] rounded text-[10px] px-2 flex items-center font-mono text-[#58a6ff]">Physics</div>
                    <div className="h-6 w-1/2 bg-[#3fb950]/40 border border-[#3fb950] rounded text-[10px] px-2 flex items-center font-mono text-[#3fb950]">Render Tick</div>
                    <div className="h-6 w-1/4 bg-[#d29922]/40 border border-[#d29922] rounded text-[10px] px-2 flex items-center font-mono text-[#d29922]">Game Logic</div>
                 </div>
                 <div className="flex gap-1 ml-[25%] w-[75%]">
                    <div className="h-6 w-2/3 bg-[#a371f7]/40 border border-[#a371f7] rounded text-[10px] px-2 flex items-center font-mono text-[#a371f7]">Draw Calls</div>
                    <div className="h-6 w-1/3 bg-[#f85149]/40 border border-[#f85149] rounded text-[10px] px-2 flex items-center font-mono text-[#f85149]">Garbage Collect</div>
                 </div>
              </div>
           </div>

           {/* Bottom: Live Chart */}
           <div className="flex-1 relative p-4 flex flex-col">
              <div className="text-xs font-bold text-[#8b949e] mb-4">LIVE METRIC TIMELINE</div>
              <div className="flex-1 border border-[#30363d] rounded bg-[#161b22] relative overflow-hidden flex items-end p-2">
                 {/* Fake line chart */}
                 <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polyline fill="none" stroke="#3fb950" strokeWidth="2" points="0,50 10,45 20,55 30,30 40,60 50,40 60,70 70,20 80,50 90,45 100,50" />
                    <polyline fill="none" stroke="#58a6ff" strokeWidth="2" points="0,80 10,85 20,75 30,90 40,80 50,85 60,70 70,85 80,80 90,75 100,80" />
                 </svg>
                 {/* Grid lines */}
                 <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 border-t border-[#30363d]">
                    <div className="w-full border-b border-[#30363d]"></div>
                    <div className="w-full border-b border-[#30363d]"></div>
                    <div className="w-full border-b border-[#30363d]"></div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, barColor, percent, alert }: { icon: React.ReactNode, title: string, value: string, barColor: string, percent: string, alert?: boolean }) {
  return (
    <div className={`p-3 rounded border ${alert ? 'bg-[#f85149]/10 border-[#f85149]/50' : 'bg-[#0d1117] border-[#30363d]'}`}>
       <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-xs font-bold text-white">{title}</span>
          {alert && <AlertCircle size={12} className="text-[#f85149] ml-auto animate-pulse" />}
       </div>
       <div className="text-lg font-mono text-white mb-2">{value}</div>
       <div className="w-full h-1.5 bg-[#161b22] rounded-full overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width: `${percent}%` }}></div>
       </div>
    </div>
  );
}
function Download(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
}
