import React, { useState } from 'react';
import { Mountain, Trees, Box, Image as ImageIcon, Layers, Zap, PenTool, Brush, Move, RefreshCw, Sun, Wind, ChevronDown, Check, Droplets } from 'lucide-react';

export default function LandscapeEditor() {
  const [activeTool, setActiveTool] = useState('Sculpt');
  const tools = [
    { id: 'Sculpt', icon: <Mountain size={16}/>, label: 'Sculpt' },
    { id: 'Paint', icon: <Brush size={16}/>, label: 'Paint' },
    { id: 'Foliage', icon: <Trees size={16}/>, label: 'Foliage' },
    { id: 'Water', icon: <Droplets size={16}/>, label: 'Water' },
    { id: 'Manage', icon: <Layers size={16}/>, label: 'Manage' }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3fb950]/10 rounded text-[#3fb950]"><Mountain size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Apex Terrain Editor</h2>
              <p className="text-[10px] text-[#8b949e]">Nanite Displacement, Biome Painting, and Water Systems</p>
            </div>
         </div>

         {/* Mode Switcher */}
         <div className="flex gap-1 bg-[#0d1117] border border-[#30363d] rounded text-[11px] font-bold p-1 overflow-visible">
            {tools.map(t => (
               <button 
                  key={t.id}
                  onClick={() => setActiveTool(t.id)}
                  className={`px-3 py-1.5 flex flex-col gap-1 items-center justify-center min-w-[70px] rounded transition-colors ${activeTool === t.id ? 'bg-[#21262d] text-[#3fb950] shadow-sm' : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'}`}>
                  {t.icon}
                  <span className="text-[9px]">{t.label}</span>
               </button>
            ))}
         </div>

         <div className="flex gap-2 text-[11px] font-bold">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors"><Sun size={12}/> Bake Lighting</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Options Panel */}
        <div className="w-72 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
           
           <div className="p-3 border-b border-[#30363d] bg-[#0d1117]">
              <span className="font-bold text-[11px] uppercase tracking-wider text-[#c9d1d9] flex items-center gap-2">
                 {tools.find(t => t.id === activeTool)?.icon} 
                 {activeTool} Tools
              </span>
           </div>

           <div className="p-3 flex flex-col gap-4 text-[11px]">
              
              {/* Common Brush Settings */}
              {(activeTool === 'Sculpt' || activeTool === 'Paint' || activeTool === 'Foliage') && (
                 <>
                    <div>
                       <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-[#8b949e]"><span>Brush Size</span><span className="text-white font-mono">1024</span></div>
                       <input type="range" className={`w-full ${activeTool === 'Sculpt' ? 'accent-[#58a6ff]' : activeTool === 'Foliage' ? 'accent-[#3fb950]' : 'accent-[#e3b341]'}`} defaultValue="40" />
                    </div>
                    <div>
                       <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-[#8b949e]"><span>Tool Strength</span><span className="text-white font-mono">0.25</span></div>
                       <input type="range" className={`w-full ${activeTool === 'Sculpt' ? 'accent-[#58a6ff]' : activeTool === 'Foliage' ? 'accent-[#3fb950]' : 'accent-[#e3b341]'}`} defaultValue="25" />
                    </div>
                    <div>
                       <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-[#8b949e]"><span>Falloff</span><span className="text-white font-mono">Smooth</span></div>
                       <input type="range" className={`w-full ${activeTool === 'Sculpt' ? 'accent-[#58a6ff]' : activeTool === 'Foliage' ? 'accent-[#3fb950]' : 'accent-[#e3b341]'}`} defaultValue="60" />
                    </div>
                    <div className="h-px bg-[#30363d] my-1"></div>
                 </>
              )}

              {/* Sculpt Specific */}
              {activeTool === 'Sculpt' && (
                 <>
                    <div className="grid grid-cols-2 gap-2">
                       <button className="bg-[#21262d] border border-[#58a6ff] text-[#58a6ff] rounded p-2 text-[10px] font-bold">Raise/Lower</button>
                       <button className="bg-[#0d1117] border border-[#30363d] hover:border-white text-[#8b949e] hover:text-white rounded p-2 text-[10px] font-bold">Smooth</button>
                       <button className="bg-[#0d1117] border border-[#30363d] hover:border-white text-[#8b949e] hover:text-white rounded p-2 text-[10px] font-bold">Flatten</button>
                       <button className="bg-[#0d1117] border border-[#30363d] hover:border-white text-[#8b949e] hover:text-white rounded p-2 text-[10px] font-bold">Erosion</button>
                       <button className="bg-[#0d1117] border border-[#30363d] hover:border-white text-[#8b949e] hover:text-white rounded p-2 text-[10px] font-bold">Noise</button>
                       <button className="bg-[#0d1117] border border-[#30363d] hover:border-white text-[#8b949e] hover:text-white rounded p-2 text-[10px] font-bold">Terrace</button>
                    </div>
                 </>
              )}

              {/* Paint Specific */}
              {activeTool === 'Paint' && (
                 <>
                    <h3 className="font-bold text-[#c9d1d9]">Target Layers</h3>
                    <div className="flex flex-col gap-1 border border-[#30363d] bg-[#0d1117] rounded p-1">
                       <div className="flex flex-col gap-1">
                          <button className="flex items-center gap-2 p-1.5 bg-[#21262d] border border-[#e3b341] rounded text-[10px] font-bold text-white text-left">
                             <div className="w-5 h-5 rounded-[2px] bg-[url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=64&auto=format&fit=crop')] bg-cover"></div>
                             Grass_Fresh
                          </button>
                          <button className="flex items-center gap-2 p-1.5 hover:bg-[#21262d] border border-transparent rounded text-[10px] font-bold text-[#8b949e] text-left">
                             <div className="w-5 h-5 rounded-[2px] bg-[url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=64&auto=format&fit=crop')] bg-cover"></div>
                             Dirt_Path
                          </button>
                          <button className="flex items-center gap-2 p-1.5 hover:bg-[#21262d] border border-transparent rounded text-[10px] font-bold text-[#8b949e] text-left">
                             <div className="w-5 h-5 rounded-[2px] bg-[url('https://images.unsplash.com/photo-1522069169874-c58ced4b69c5?q=80&w=64&auto=format&fit=crop')] bg-cover"></div>
                             Rock_Cliff
                          </button>
                       </div>
                    </div>
                 </>
              )}

              {/* AI Auto-Gen Box */}
              <div className="mt-auto border border-[#3fb950]/30 bg-[#3fb950]/5 rounded p-3 text-[10px]">
                 <div className="font-bold text-[#3fb950] uppercase mb-1 flex items-center gap-1"><Zap size={10}/> AI Landscape AI</div>
                 <p className="text-[#8b949e] mb-2 leading-tight">Type a prompt to automatically raise mountains, carve rivers, and paint logical biomes instantly.</p>
                 <textarea className="w-full bg-[#0d1117] border border-[#30363d] py-1.5 px-2 rounded text-white resize-none h-12 outline-none mb-2" defaultValue="A volcanic island hit by a meteor..."></textarea>
                 <button className="w-full bg-[#3fb950]/20 hover:bg-[#3fb950]/30 text-[#3fb950] border border-[#3fb950]/50 py-1.5 font-bold rounded transition-colors">Generate 8km² World</button>
              </div>

           </div>
        </div>

        {/* Viewport Area (3D Terrain Mock) */}
        <div className="flex-1 bg-gradient-to-t from-[#111] to-[#0a0a0a] relative overflow-hidden flex flex-col cursor-crosshair">
           
           {/* Mock Terrain Visual */}
           <div className="absolute inset-0 z-0">
               <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-30 text-[#3fb950]">
                  <path d="M0,100 L0,70 Q20,60 40,80 T80,50 T100,60 L100,100 Z" fill="currentColor" />
                  <path d="M0,100 L0,80 Q30,90 50,60 T90,70 T100,50 L100,100 Z" fill="currentColor" className="opacity-50" />
               </svg>
               {/* Brush Reticle Mock (Following cursor usually, but static for mock) */}
               <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-dashed ${activeTool === 'Sculpt' ? 'border-[#58a6ff]' : activeTool === 'Paint' ? 'border-[#e3b341]' : 'border-[#3fb950]'} opacity-50 bg-white/5`}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
               </div>
           </div>

           {/* Metrics Overlay */}
           <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none z-10">
              <span className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-mono text-[#8b949e]">X: 1420 Y: -450 Z: 200</span>
              <span className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-mono text-[#c9d1d9]">Brush: Raise [1024u]</span>
              <span className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-mono text-[#3fb950]">Auto-LOD: LOD0</span>
           </div>

           <div className="text-[120px] font-bold text-black/40 tracking-tighter mix-blend-overlay absolute bottom-0 right-0 select-none pointer-events-none z-0">TERRAIN</div>
        </div>

      </div>
    </div>
  );
}
