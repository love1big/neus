import React from 'react';
import { Bot, PlayCircle, Layers, Settings, Maximize2, Move3d, Terminal, ChevronRight, Activity, Cloud } from 'lucide-react';

interface Tool {
  id: string;
  title: string;
  icon: React.ReactElement<any>;
  activeColor: string;
  category: string;
}

export default function GenericToolPanel({ toolId, tools }: { toolId: string; tools: Tool[] }) {
  const tool = tools.find(t => t.id === toolId) || {
    id: toolId,
    title: toolId,
    icon: <Bot size={20} />,
    activeColor: 'text-[#58a6ff]',
    category: 'ASCENSION CORE'
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#101015] p-1.5 gap-1.5">
      {/* Top Header */}
      <div className="h-[48px] bg-[#161726] border border-[#2a2b3d] rounded-[4px] flex items-center px-4 justify-between shrink-0 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-[20%] w-[100px] h-full bg-[#bc8cff]/10 blur-3xl rounded-full"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className={`p-2 bg-[#21262d] rounded-[4px] border border-[#30363d] shadow-inner ${tool.activeColor}`}>
             {React.cloneElement(tool.icon, { size: 24, className: 'drop-shadow-md' })}
          </div>
          <div>
            <h1 className="text-white font-black tracking-widest text-[14px] uppercase">{tool.title}</h1>
            <p className="text-gray-400 font-mono text-[10px] uppercase">{tool.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="bg-[#2c2d46] hover:bg-[#3d3f5e] border border-[#4a4c6e] text-white px-3 py-1.5 rounded-[4px] text-[11px] font-bold flex items-center gap-1 transition-colors"><Settings size={12}/> Configure</button>
           <button className="bg-gradient-to-r from-blue-600 to-[#bc8cff] hover:opacity-90 border border-blue-400/30 text-white px-4 py-1.5 rounded-[4px] text-[11px] font-black tracking-wider flex items-center gap-2 transition-opacity shadow-lg"><PlayCircle size={14}/> INITIALIZE MODULE</button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex gap-1.5 min-h-0">
         {/* Left Side Panel */}
         <div className="w-[280px] bg-[#161726] border border-[#2a2b3d] rounded-[4px] p-3 flex flex-col gap-4">
            <div>
               <h2 className="text-[#8b949e] font-black text-[10px] tracking-widest mb-2 border-b border-[#2a2b3d] pb-1">MODULE STATUS</h2>
               <div className="space-y-2 text-[11px]">
                 <div className="flex justify-between items-center bg-[#1e1e2d] p-1.5 rounded border border-[#30363d]">
                   <span className="text-gray-400 flex items-center gap-1.5"><Activity size={12}/> Heartbeat</span>
                   <span className="text-[#3fb950] font-mono font-bold blink">ONLINE</span>
                 </div>
                 <div className="flex justify-between items-center bg-[#1e1e2d] p-1.5 rounded border border-[#30363d]">
                   <span className="text-gray-400 flex items-center gap-1.5"><Layers size={12}/> Core Threads</span>
                   <span className="text-white font-mono font-bold">12 / 16</span>
                 </div>
                 <div className="flex justify-between items-center bg-[#1e1e2d] p-1.5 rounded border border-[#30363d]">
                   <span className="text-gray-400 flex items-center gap-1.5"><Cloud size={12}/> Network Link</span>
                   <span className="text-[#e3b341] font-mono font-bold">STABLE</span>
                 </div>
               </div>
            </div>

            <div className="flex-1">
               <h2 className="text-[#8b949e] font-black text-[10px] tracking-widest mb-2 border-b border-[#2a2b3d] pb-1">QUICK ACTIONS</h2>
               <div className="flex flex-col gap-1">
                 <button className="text-left px-2 py-1.5 rounded text-[11px] text-gray-300 hover:text-white hover:bg-[#21262d] flex justify-between items-center border border-transparent hover:border-[#30363d]">Compile Assets <ChevronRight size={12} className="text-gray-500"/></button>
                 <button className="text-left px-2 py-1.5 rounded text-[11px] text-gray-300 hover:text-white hover:bg-[#21262d] flex justify-between items-center border border-transparent hover:border-[#30363d]">Run Diagnostics <ChevronRight size={12} className="text-gray-500"/></button>
                 <button className="text-left px-2 py-1.5 rounded text-[11px] text-gray-300 hover:text-white hover:bg-[#21262d] flex justify-between items-center border border-transparent hover:border-[#30363d]">Sync to Cloud <ChevronRight size={12} className="text-gray-500"/></button>
                 <button className="text-left px-2 py-1.5 rounded text-[11px] text-[#f85149] hover:text-[#ff7b72] hover:bg-[#21262d] flex justify-between items-center border border-transparent hover:border-[#30363d]">Force Restart <ChevronRight size={12} className="text-gray-500"/></button>
               </div>
            </div>
         </div>

         {/* Center Main Area */}
         <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            {/* 3D / Graph Viewport Mock */}
            <div className="flex-1 bg-[#1a1b2e] border border-[#2a2b3d] rounded-[4px] relative overflow-hidden flex flex-col shadow-inner">
               <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
               
               <div className="h-[30px] bg-[#11111b] border-b border-[#2a2b3d] flex items-center px-3 justify-between z-10 shrink-0">
                 <div className="flex gap-2">
                   <div className="text-[10px] font-bold text-white bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">Viewport</div>
                   <div className="text-[10px] font-bold text-gray-400 hover:text-white cursor-pointer px-2 py-0.5">Metrics</div>
                 </div>
                 <div className="flex gap-1">
                    <button className="p-1 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white transition-colors"><Move3d size={12}/></button>
                    <button className="p-1 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white transition-colors"><Maximize2 size={12}/></button>
                 </div>
               </div>

               <div className="flex-1 flex items-center justify-center relative p-8">
                  {/* Fake Grid Background */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                  
                  {/* Central Concept Art / Symbol */}
                  <div className="relative flex flex-col items-center animate-pulse-slow">
                     <div className={`p-8 rounded-full border border-[#2a2b3d] bg-[#11111b] shadow-[0_0_50px_rgba(0,0,0,0.5)] ${tool.activeColor}`}>
                        {React.cloneElement(tool.icon, { size: 64, className: 'drop-shadow-2xl' })}
                     </div>
                     <h3 className="mt-6 text-white font-black tracking-[0.2em] text-lg uppercase drop-shadow-md text-center">{tool.title}</h3>
                     <p className="mt-2 text-gray-400 text-[11px] font-mono tracking-widest bg-black/50 px-3 py-1 rounded-full border border-[#333]">OPERATIONAL STANDBY</p>
                  </div>
               </div>
               
               <div className="h-[24px] bg-[#0d1117]/80 backdrop-blur border-t border-[#2a2b3d] flex items-center px-4 justify-between z-10 shrink-0 text-[10px] font-mono text-gray-500">
                  <span>Engine: Omni Core v3.0.4</span>
                  <span>Mem: 452MB | CPU: 2%</span>
               </div>
            </div>

            {/* Bottom Log Terminal */}
            <div className="h-[180px] bg-[#0d1117] border border-[#2a2b3d] rounded-[4px] shrink-0 font-mono text-[11px] flex flex-col">
               <div className="h-[28px] bg-[#161726] border-b border-[#2a2b3d] flex items-center px-3 z-10 text-gray-400">
                 <Terminal size={12} className="mr-2"/> SYSTEM_LOG <span className="bg-[#3fb950] w-1.5 h-1.5 rounded-full ml-auto animate-pulse"></span>
               </div>
               <div className="p-3 text-gray-300 leading-relaxed overflow-y-auto custom-scrollbar flex-1">
                 <div className="flex gap-3"><span className="text-gray-500">00:00.01</span><span className="text-[#58a6ff]">[SYS] Allocating memory block... Done.</span></div>
                 <div className="flex gap-3"><span className="text-gray-500">00:00.05</span><span className="text-[#3fb950]">[MODULE] Initialize {tool.id} subsystem.</span></div>
                 <div className="flex gap-3"><span className="text-gray-500">00:00.12</span><span>Mounting virtual file system.</span></div>
                 <div className="flex gap-3"><span className="text-gray-500">00:00.18</span><span>Syncing with core data context...</span></div>
                 <div className="flex gap-3"><span className="text-gray-500">00:00.22</span><span className="text-[#e3b341]">[WARN] Extension not found, using default configs.</span></div>
                 <div className="flex gap-3"><span className="text-gray-500">00:00.30</span><span className="text-[#3fb950]">[OK] Module '{tool.title}' successfully loaded and verified.</span></div>
               </div>
            </div>
         </div>
      </div>
      
      <style>{`
        .animate-pulse-slow {
           animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-slow {
           0%, 100% { opacity: 1; transform: scale(1); }
           50% { opacity: 0.8; transform: scale(0.98); }
        }
      `}</style>
    </div>
  );
}
