import React from 'react';
import { Microchip, Activity, Settings2, Play } from 'lucide-react';

export default function KernelDebugger() {
  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-6 overflow-hidden">
      <div className="flex justify-between items-start mb-6 border-b border-[#30363d] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#e6edf3] flex items-center gap-3">
             <Microchip className="text-[#58a6ff]" size={28}/> Kernel Panic Analyzer
          </h1>
          <p className="text-[#8b949e] text-sm mt-2">Advanced systems tool integration successfully restored.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 bg-[#21262d] rounded flex items-center gap-2 hover:bg-[#30363d] border border-[#30363d] text-xs font-bold"><Settings2 size={14}/> Configure</button>
           <button className="px-3 py-1.5 bg-[#3fb950] text-[#0d1117] rounded flex items-center gap-2 hover:bg-[#2ea043] font-bold text-xs"><Play size={14}/> Execute</button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-[#0d1117] border border-[#30363d] rounded-xl shadow-inner group">
         <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition duration-500 scale-150 blur-[2px]">
            <Microchip size={200} className="text-[#30363d]"/>
         </div>
         <div className="relative z-10 flex flex-col items-center">
            <Activity className="text-[#3fb950] animate-pulse mb-4" size={48} />
            <div className="text-[#e6edf3] font-mono font-bold tracking-widest bg-[#161b22] px-6 py-2 rounded-full border border-[#30363d]">SYSTEM STANDBY</div>
            <div className="text-[#8b949e] text-xs mt-4">Awaiting telemetry and data streams...</div>
         </div>
         <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
      </div>
    </div>
  );
}
