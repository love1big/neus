import React, { useState } from 'react';
import { Grid, MousePointer2, Scissors, Type, Play, Maximize, Move, Settings, CheckCircle, PackageOpen } from 'lucide-react';

export default function UVMappingStudio() {
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#8b949e]/20 border border-[#8b949e]/50 rounded">
            <Grid className="text-white" size={16} />
          </div>
          <div>
            <h1 className="font-bold text-sm">AI Smart UV Unwrapping Studio</h1>
            <p className="text-[10px] text-[#8b949e]">Automated Seam Generation & Packing</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b] font-medium text-white">
             <Play size={14} /> Auto Unwrap (AI)
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Tools & Settings */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col z-10 shrink-0">
           <div className="p-2 border-b border-[#30363d] font-bold text-xs flex items-center gap-2 text-[#8b949e]">
             <Settings size={14} /> ALGORITHM SETTINGS
           </div>
           <div className="p-4 space-y-4 flex-1">
              <div>
                 <div className="text-xs text-[#8b949e] mb-1">Unwrap Method</div>
                 <select className="w-full bg-[#0d1117] border border-[#30363d] text-white text-xs p-1.5 rounded outline-none">
                    <option>Angle Based (ABF)</option>
                    <option>Least Squares (LSCM)</option>
                    <option>AI Semantic Seam</option>
                 </select>
              </div>
              <div>
                 <div className="text-xs text-[#8b949e] mb-1">Margin / Padding</div>
                 <input type="range" className="w-full accent-[#58a6ff]" min="0" max="16" defaultValue="4" />
              </div>
              <div className="pt-2">
                 <button className="w-full py-2 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center justify-center gap-2 hover:bg-[#30363d]">
                    <PackageOpen size={14} /> Pack Islands
                 </button>
              </div>
           </div>
        </div>

        {/* Center: UV Editor Viewport */}
        <div className="flex-1 bg-[#010409] relative flex items-center justify-center overflow-hidden">
           {/* Checkerboard Background for UV checking */}
           <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: 'repeating-linear-gradient(45deg, #8b949e 25%, transparent 25%, transparent 75%, #8b949e 75%, #8b949e), repeating-linear-gradient(45deg, #8b949e 25%, transparent 25%, transparent 75%, #8b949e 75%, #8b949e)', 
              backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px'
           }}></div>
           
           {/* The 0-1 UV Space Square */}
           <div className="relative w-[500px] h-[500px] bg-[#0d1117] border-2 border-[#58a6ff]/50 shadow-[0_0_30px_rgba(88,166,255,0.1)]">
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#58a6ff 1px, transparent 1px), linear-gradient(90deg, #58a6ff 1px, transparent 1px)', backgroundSize: '10% 10%' }}></div>
              
              {/* Fake UV Islands (Polygons) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="0 0 100 100">
                 {/* Island 1 */}
                 <polygon points="10,10 40,10 50,30 20,40" fill="rgba(88,166,255,0.2)" stroke="#58a6ff" strokeWidth="0.5" />
                 <polygon points="40,10 70,15 80,35 50,30" fill="rgba(88,166,255,0.2)" stroke="#58a6ff" strokeWidth="0.5" />
                 {/* Island 2 */}
                 <polygon points="15,50 45,45 55,75 25,85" fill="rgba(88,166,255,0.2)" stroke="#58a6ff" strokeWidth="0.5" />
                 <polygon points="60,40 90,50 85,80 50,70" fill="rgba(88,166,255,0.2)" stroke="#58a6ff" strokeWidth="0.5" />
                 {/* Highlighted edge / Seam */}
                 <line x1="40" y1="10" x2="50" y2="30" stroke="#f85149" strokeWidth="1" />
              </svg>
           </div>
           
           <div className="absolute top-4 right-4 flex bg-[#161b22]/80 backdrop-blur rounded border border-[#30363d] overflow-hidden">
              <button className="p-1.5 text-white hover:bg-[#30363d] border-r border-[#30363d] bg-[#30363d]"><MousePointer2 size={14}/></button>
              <button className="p-1.5 text-[#8b949e] hover:bg-[#30363d] border-r border-[#30363d]"><Move size={14}/></button>
              <button className="p-1.5 text-[#8b949e] hover:bg-[#30363d]"><Scissors size={14}/></button>
           </div>
        </div>

      </div>
    </div>
  );
}
