import React, { useState } from 'react';
import { Mountain, Trees, Box, Hexagon, Move3D, Eye, Camera, Settings, Target, Map, Plus } from 'lucide-react';

export default function LevelDesignEditor() {
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#e3b341]/10 rounded text-[#e3b341]"><Map size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Level Design Toolkit</h2>
              <p className="text-[10px] text-[#8b949e]">Whiteboxing, Metrics, Logic Volumes, and Flow</p>
            </div>
         </div>
         
         <div className="flex gap-2 text-[11px] font-bold">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors text-[#58a6ff]"><Target size={12}/> Run Metrics Check</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbox */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 border-b border-[#30363d] bg-[#0d1117]">
              <span className="font-bold text-[11px] uppercase tracking-wider text-[#c9d1d9]">BSP / Whitebox</span>
           </div>
           
           <div className="grid grid-cols-2 gap-2 p-2">
              <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 text-[10px] text-[#8b949e] hover:text-[#e3b341] transition-colors"><Box size={20}/> Box</button>
              <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 text-[10px] text-[#8b949e] hover:text-[#e3b341] transition-colors"><Hexagon size={20}/> Cylinder</button>
              <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 text-[10px] text-[#8b949e] hover:text-[#e3b341] transition-colors">
                 <div className="w-5 h-5 border-b-[6px] border-r-[6px] border-current transform rotate-45"></div> Stairs
              </button>
              <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 text-[10px] text-[#8b949e] hover:text-[#e3b341] transition-colors">
                 <div className="border-l-[10px] border-l-transparent border-b-[16px] border-b-current border-r-[10px] border-r-transparent"></div> Ramp
              </button>
           </div>

           <div className="p-2 border-y border-[#30363d] bg-[#0d1117] mt-2">
              <span className="font-bold text-[11px] uppercase tracking-wider text-[#c9d1d9]">Gameplay Volumes</span>
           </div>

           <div className="flex flex-col gap-1 p-2 text-[10px]">
              <div className="flex items-center gap-2 p-1.5 hover:bg-[#21262d] rounded cursor-pointer text-[#8b949e]">
                 <div className="w-3 h-3 border border-[#f85149] bg-[#f85149]/20"></div> KillZ Volume
              </div>
              <div className="flex items-center gap-2 p-1.5 hover:bg-[#21262d] rounded cursor-pointer text-[#8b949e]">
                 <div className="w-3 h-3 border border-[#3fb950] bg-[#3fb950]/20"></div> NavMesh Bounds
              </div>
              <div className="flex items-center gap-2 p-1.5 hover:bg-[#21262d] rounded cursor-pointer text-[#8b949e]">
                 <div className="w-3 h-3 border border-[#58a6ff] bg-[#58a6ff]/20"></div> PostProcess Volume
              </div>
              <div className="flex items-center gap-2 p-1.5 hover:bg-[#21262d] rounded cursor-pointer text-[#8b949e]">
                 <div className="w-3 h-3 border border-[#bc8cff] bg-[#bc8cff]/20"></div> Trigger Volume
              </div>
              <div className="flex items-center gap-2 p-1.5 hover:bg-[#21262d] rounded cursor-pointer text-[#8b949e]">
                 <div className="w-3 h-3 border border-[#e3b341] bg-[#e3b341]/20"></div> Blocking Volume
              </div>
           </div>
        </div>

        {/* Level Viewport (Top Down Map Style) */}
        <div className="flex-1 bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            
            {/* Toolbar Top Viewport */}
            <div className="absolute top-2 left-2 flex gap-1 z-10">
               <button className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1 bg-[#21262d]">Top</button>
               <button className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-bold text-[#c9d1d9] flex items-center gap-1 hover:bg-[#21262d]">Front</button>
               <button className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-bold text-[#c9d1d9] flex items-center gap-1 hover:bg-[#21262d]">Side</button>
            </div>

            {/* Mock Level Layout */}
            <div className="relative w-[600px] h-[400px]">
               {/* Ground */}
               <div className="absolute inset-0 border-2 border-[#58a6ff]/30 bg-[#58a6ff]/5"></div>
               {/* Walls */}
               <div className="absolute top-10 left-10 w-40 h-10 border border-[#e3b341] bg-[#e3b341]/20 flex items-center justify-center text-[10px] font-mono text-[#e3b341]">Wall_1</div>
               <div className="absolute top-10 left-10 w-10 h-60 border border-[#e3b341] bg-[#e3b341]/20"></div>
               <div className="absolute top-[240px] left-10 w-60 h-10 border border-[#e3b341] bg-[#e3b341]/20"></div>
               {/* Cover Props */}
               <div className="absolute top-40 left-40 w-8 h-8 border border-[#c9d1d9] bg-[#c9d1d9]/20"></div>
               <div className="absolute top-50 left-60 w-12 h-8 border border-[#c9d1d9] bg-[#c9d1d9]/20"></div>
               {/* Player Start */}
               <div className="absolute top-20 left-20 w-6 h-6 border-2 border-[#3fb950] rounded-full flex items-center justify-center">
                  <div className="w-1 h-3 bg-[#3fb950]"></div>
               </div>
               
               {/* Metric Tool Display */}
               <div className="absolute top-20 left-20 border-t-2 border-dashed border-[#f85149] w-[80px] origin-left rotate-45 pointer-events-none"></div>
               <span className="absolute top-24 left-32 text-[9px] font-mono text-[#f85149] bg-[#0a0a0a] px-1 rounded">2m (Cover dist)</span>
            </div>

            <div className="absolute right-4 bottom-4 bg-[#161b22]/90 backdrop-blur border border-[#3cfb950]/30 border-[#3fb950] p-3 rounded-lg w-64 shadow-lg text-[11px]">
               <h3 className="font-bold text-[#3fb950] uppercase tracking-wide flex items-center gap-2 mb-2"><Target size={14}/> Auto-Metrics</h3>
               <div className="space-y-1 text-[#c9d1d9]">
                  <div className="flex justify-between"><span>Minimum Door Width</span> <span className="text-[#3fb950]">PASS</span></div>
                  <div className="flex justify-between"><span>Cover Height &gt; 110cm</span> <span className="text-[#3fb950]">PASS</span></div>
                  <div className="flex justify-between"><span>Jump Gap &lt; 400cm</span> <span className="text-[#f85149] font-bold">FAIL (1 err)</span></div>
               </div>
            </div>
        </div>

      </div>
    </div>
  );
}
