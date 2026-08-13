import React, { useState } from 'react';
import { Sparkles, Play, Settings, Layers, Box, Wind, Droplets, Flame, Pause, SkipBack, Maximize, MousePointer2, Save, Download } from 'lucide-react';

export default function VFXNiagaraGraph() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Top Header */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#f85149]/20 border border-[#f85149]/50 rounded">
            <Sparkles className="text-[#f85149]" size={16} />
          </div>
          <div>
            <h1 className="font-bold text-sm">Niagara VFX Particle Engine</h1>
            <p className="text-[10px] text-[#8b949e]">Real-time GPU Particle Simulation</p>
          </div>
        </div>

        <div className="flex bg-[#010409] border border-[#30363d] rounded-lg px-3 py-1 gap-4 items-center shadow-inner">
           <div className="flex gap-2 text-[#8b949e]">
             <button className="hover:text-white"><SkipBack size={16} /></button>
             <button className="text-white hover:text-[#58a6ff]" onClick={() => setIsPlaying(!isPlaying)}>
               {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
             </button>
           </div>
           <div className="w-[1px] h-4 bg-[#30363d]"></div>
           <div className="font-mono text-sm text-[#f85149] font-bold">
             Frame: 1,204
           </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
             <Save size={14} /> Save Asset
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Emitter Stack */}
        <div className="w-72 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 z-10">
           <div className="p-2 border-b border-[#30363d] font-bold text-xs flex items-center gap-2 text-[#8b949e]">
             <Layers size={14} /> EMITTER STACK
           </div>
           
           <div className="flex-1 overflow-y-auto p-3 space-y-4">
              
              {/* Emitter 1 */}
              <div className="bg-[#0d1117] border border-[#f85149] rounded overflow-hidden">
                 <div className="bg-[#f85149]/20 px-2 py-1.5 border-b border-[#f85149]/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                       <Flame size={14} className="text-[#f85149]"/> Fire_Core
                    </div>
                    <div className="flex gap-1">
                       <button className="w-4 h-4 bg-[#161b22] rounded flex items-center justify-center text-[10px]">✓</button>
                    </div>
                 </div>
                 <div className="p-1 space-y-0.5">
                    <ModuleItem title="Emitter State" color="#58a6ff" />
                    <ModuleItem title="Spawn Rate (300/s)" color="#3fb950" />
                    <ModuleItem title="Initialize Particle" color="#d29922" active />
                    <ModuleItem title="Color Gradient" color="#a371f7" />
                    <ModuleItem title="Sprite Renderer" color="#8b949e" />
                 </div>
              </div>

              {/* Emitter 2 */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded overflow-hidden">
                 <div className="bg-[#30363d]/50 px-2 py-1.5 border-b border-[#30363d] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                       <Wind size={14} className="text-[#8b949e]"/> Smoke_Plume
                    </div>
                    <div className="flex gap-1">
                       <button className="w-4 h-4 bg-[#161b22] rounded flex items-center justify-center text-[10px]">✓</button>
                    </div>
                 </div>
                 <div className="p-1 space-y-0.5 opacity-70">
                    <ModuleItem title="Emitter State" color="#58a6ff" />
                    <ModuleItem title="Spawn Burst" color="#3fb950" />
                    <ModuleItem title="Add Velocity" color="#d29922" />
                    <ModuleItem title="Sprite Renderer" color="#8b949e" />
                 </div>
              </div>

              {/* Emitter 3 */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded overflow-hidden opacity-50">
                 <div className="bg-[#30363d]/30 px-2 py-1.5 border-b border-[#30363d] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-white/50">
                       <Sparkles size={14} className="text-[#8b949e]"/> Sparks_Burst
                    </div>
                    <div className="flex gap-1">
                       <button className="w-4 h-4 bg-[#161b22] rounded flex items-center justify-center text-[10px] text-[#8b949e]">X</button>
                    </div>
                 </div>
              </div>

           </div>
        </div>

        {/* Center: 3D Viewport Simulation */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
           {/* 3D Grid */}
           <div className="absolute inset-0" style={{ 
              backgroundImage: 'linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)', 
              backgroundSize: '40px 40px', 
              transform: 'perspective(600px) rotateX(60deg) scale(2.5)', 
              transformOrigin: 'bottom' 
           }}></div>

           {/* Faux Particle Effect Center */}
           <div className="relative z-10 flex items-center justify-center w-full h-full pb-32">
              
              {/* Flame Base */}
              <div className="absolute w-32 h-32 bg-[#f85149] rounded-full blur-[40px] opacity-60 animate-pulse"></div>
              <div className="absolute w-20 h-20 bg-[#d29922] rounded-full blur-[20px] opacity-80 animate-ping" style={{ animationDuration: '0.5s' }}></div>
              <div className="absolute w-10 h-10 bg-white rounded-full blur-[10px] opacity-90"></div>
              
              {/* Fake Particles Flying Up */}
              <div className="absolute w-full h-full pointer-events-none">
                 {Array.from({length: 20}).map((_, i) => (
                    <div key={i} className="absolute bottom-1/2 left-1/2 w-2 h-2 bg-[#f85149] rounded-full shadow-[0_0_10px_#f85149]"
                         style={{ 
                            transform: `translate(${Math.random() * 200 - 100}px, -${Math.random() * 300 + 50}px) scale(${Math.random()})`,
                            opacity: Math.random(),
                            transition: 'all 0.1s linear'
                         }}>
                    </div>
                 ))}
                 {Array.from({length: 10}).map((_, i) => (
                    <div key={i} className="absolute bottom-1/2 left-1/2 w-1 h-3 bg-[#d29922] rounded-full shadow-[0_0_5px_#d29922] rotate-45"
                         style={{ 
                            transform: `translate(${Math.random() * 150 - 75}px, -${Math.random() * 400 + 100}px) scale(${Math.random()})`,
                            opacity: Math.random()
                         }}>
                    </div>
                 ))}
              </div>

           </div>

           <div className="absolute top-4 left-4 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-[#f85149] border border-[#f85149]/30">
             GPU Particle Count: 14,204
           </div>
           
           <div className="absolute top-4 right-4 flex bg-[#161b22]/80 backdrop-blur rounded border border-[#30363d] overflow-hidden">
              <button className="px-2 py-1 text-xs hover:bg-[#30363d] border-r border-[#30363d] text-white bg-[#30363d]">Lit</button>
              <button className="px-2 py-1 text-xs hover:bg-[#30363d] text-[#8b949e]">Wireframe</button>
           </div>
        </div>

        {/* Right: Module Details */}
        <div className="w-72 border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 border-b border-[#30363d] font-bold text-xs flex items-center gap-2">
             <Settings size={14} className="text-[#8b949e]" /> MODULE DETAILS
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-5">
              
              <div className="bg-[#0d1117] border border-[#d29922]/50 p-3 rounded">
                 <div className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#d29922]"></div> Initialize Particle
                 </div>
                 <p className="text-[10px] text-[#8b949e] leading-relaxed">
                    Sets the initial attributes for particles when they are spawned, such as lifetime, color, and size.
                 </p>
              </div>

              <div className="space-y-4">
                 
                 <div>
                    <div className="text-xs font-bold text-[#8b949e] mb-2 uppercase">Lifetime</div>
                    <div className="flex gap-2">
                       <div className="flex-1">
                          <span className="text-[10px] text-[#8b949e]">Min</span>
                          <input type="text" className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-white font-mono outline-none" defaultValue="0.5" />
                       </div>
                       <div className="flex-1">
                          <span className="text-[10px] text-[#8b949e]">Max</span>
                          <input type="text" className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-white font-mono outline-none" defaultValue="1.2" />
                       </div>
                    </div>
                 </div>

                 <div className="border-t border-[#30363d] pt-4">
                    <div className="text-xs font-bold text-[#8b949e] mb-2 uppercase">Color</div>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded bg-[#f85149] border border-[#30363d]"></div>
                       <input type="text" className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-white font-mono outline-none" defaultValue="R: 1.0, G: 0.2, B: 0.1" />
                    </div>
                 </div>

                 <div className="border-t border-[#30363d] pt-4">
                    <div className="text-xs font-bold text-[#8b949e] mb-2 uppercase">Sprite Size</div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center bg-[#0d1117] border border-[#30363d] rounded px-2 py-1">
                          <span className="text-[10px] text-[#8b949e] font-bold">X</span>
                          <input type="text" className="w-16 bg-transparent text-right text-xs text-white font-mono outline-none" defaultValue="32.0" />
                       </div>
                       <div className="flex justify-between items-center bg-[#0d1117] border border-[#30363d] rounded px-2 py-1">
                          <span className="text-[10px] text-[#8b949e] font-bold">Y</span>
                          <input type="text" className="w-16 bg-transparent text-right text-xs text-white font-mono outline-none" defaultValue="32.0" />
                       </div>
                    </div>
                 </div>

              </div>

           </div>
        </div>
      </div>
    </div>
  );
}

function ModuleItem({ title, color, active }: { title: string, color: string, active?: boolean }) {
  return (
    <div className={`flex items-center px-2 py-1 rounded cursor-pointer ${active ? 'bg-[#30363d] border border-[#8b949e]' : 'hover:bg-[#21262d] border border-transparent'}`}>
       <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: color }}></div>
       <span className={`text-[11px] ${active ? 'text-white font-bold' : 'text-[#c9d1d9]'}`}>{title}</span>
    </div>
  );
}
