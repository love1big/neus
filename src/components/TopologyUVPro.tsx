import React, { useState } from 'react';
import { Box, Crosshair, Scissors, Layers, Settings2, Download, Maximize, MousePointer2, Move, Rotate3D, Grid, Sliders, Brush, Wrench, Spline, Frame, Square, Orbit, Pipette, Magnet, Activity } from 'lucide-react';

export default function TopologyUVPro() {
  const [activeTab, setActiveTab] = useState<'retopo' | 'uv'>('uv');
  
  return (
    <div className="flex h-full bg-[#0a0a0a] text-white overflow-hidden font-sans">
      
      {/* Left Tools Panel */}
      <div className="w-[60px] bg-[#111111] border-r border-[#222] flex flex-col items-center py-4 gap-4 shrink-0">
         <div className="w-10 h-10 bg-gradient-to-br from-[#bc8cff] to-[#58a6ff] rounded flex items-center justify-center shadow-lg shadow-[#bc8cff]/20">
           <Crosshair size={24} className="text-white" />
         </div>
         
         <div className="h-[1px] w-8 bg-[#333]"></div>

         <button onClick={() => setActiveTab('retopo')} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${activeTab === 'retopo' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50' : 'text-[#888] hover:text-white hover:bg-[#222]'}`} title="Retopology (Vertex/Edge)">
            <Frame size={18} />
         </button>
         <button onClick={() => setActiveTab('uv')} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${activeTab === 'uv' ? 'bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/50' : 'text-[#888] hover:text-white hover:bg-[#222]'}`} title="UV UV Editor">
            <Grid size={18} />
         </button>

         <div className="h-[1px] w-8 bg-[#333]"></div>

         <button className="w-10 h-10 rounded flex items-center justify-center text-[#888] hover:text-white hover:bg-[#222]"><MousePointer2 size={18}/></button>
         <button className="w-10 h-10 rounded flex items-center justify-center text-[#888] hover:text-white hover:bg-[#222]"><Move size={18}/></button>
         <button className="w-10 h-10 rounded flex items-center justify-center text-[#888] hover:text-white hover:bg-[#222]"><Rotate3D size={18}/></button>
         <button className="w-10 h-10 rounded flex items-center justify-center text-[#888] hover:text-white hover:bg-[#222]"><Scissors size={18}/></button>
         <button className="w-10 h-10 rounded flex items-center justify-center text-[#888] hover:text-white hover:bg-[#222]"><Pipette size={18}/></button>

         <div className="mt-auto">
            <button className="w-10 h-10 rounded flex items-center justify-center text-[#555] hover:text-white"><Settings2 size={18}/></button>
         </div>
      </div>

      {/* Main Work Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
         {/* Top Toolbar */}
         <div className="h-12 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 shrink-0">
             <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#c9d1d9] tracking-widest uppercase">
                  {activeTab === 'uv' ? 'Advanced UV Unwrapping & Packing' : 'Manual Retopology Engine'}
                </span>
                
                <div className="h-4 w-[1px] bg-[#444]"></div>

                <div className="flex bg-[#0d1117] border border-[#30363d] rounded text-[10px]">
                   <button className="px-3 py-1 text-[#8b949e] hover:text-white hover:bg-[#21262d] border-r border-[#30363d] font-bold">Vertex</button>
                   <button className="px-3 py-1 text-white bg-[#21262d] border-r border-[#30363d] font-bold">Edge / Seam</button>
                   <button className="px-3 py-1 text-[#8b949e] hover:text-white hover:bg-[#21262d] border-r border-[#30363d] font-bold">Face (Island)</button>
                   <button className="px-3 py-1 text-[#8b949e] hover:text-white hover:bg-[#21262d] font-bold">UV Island</button>
                </div>

                <div className="flex items-center gap-2">
                   <button className="flex items-center gap-1 text-[10px] text-[#8b949e] hover:text-[#58a6ff]"><Magnet size={12}/> Snap to Grid</button>
                </div>
             </div>

             <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#888] bg-[#0d1117] px-2 py-1 rounded border border-[#30363d]">Vertices: 142,084 | Edges: 284,168 | Tris: 142,084</span>
             </div>
         </div>

         {/* Viewports (Split Mode for UV) */}
         <div className="flex-1 flex bg-[#010409]">
             
             {/* 3D Viewport (always visible) */}
             <div className="flex-1 relative border-r border-[#30363d] flex flex-col">
                <div className="absolute top-2 left-2 flex gap-2 z-10">
                   <select className="bg-black/60 border border-[#444] text-[10px] text-white px-2 py-1 rounded outline-none backdrop-blur">
                      <option>Perspective</option>
                      <option>Orthographic View</option>
                   </select>
                   <select className="bg-black/60 border border-[#444] text-[10px] text-white px-2 py-1 rounded outline-none backdrop-blur">
                      <option>Wireframe on Shaded</option>
                      <option>UV Checker Pattern</option>
                      <option>Flat Shading</option>
                   </select>
                </div>
                
                {/* Simulated 3D Space */}
                <div className="flex-1 relative flex items-center justify-center group overflow-hidden">
                   <div className="absolute inset-0 bg-[#0d1117] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_80%)]"></div>
                   
                   {/* 3D Grid */}
                   <div className="absolute bottom-10 w-[600px] h-[600px] border border-white/5 rounded-full rotate-x-[60deg] select-none pointer-events-none" style={{ transform: 'rotateX(75deg)' }}>
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }}></div>
                   </div>
                   
                   {/* Dummy Model Representation */}
                   <div className="w-64 h-64 border border-[#58a6ff]/30 bg-gradient-to-b from-[#111] to-[#222] rounded-[30%] relative flex items-center justify-center shadow-[0_0_50px_rgba(88,166,255,0.1)]">
                      {/* Wireframe lines simulation */}
                      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-40">
                         <path d="M 50 0 L 100 50 L 50 100 L 0 50 Z" fill="none" stroke="#58a6ff" strokeWidth="0.5"/>
                         <path d="M 50 10 L 90 50 L 50 90 L 10 50 Z" fill="none" stroke="#58a6ff" strokeWidth="0.5"/>
                         <path d="M 0 50 Q 50 20 100 50 Q 50 80 0 50" fill="none" stroke="#58a6ff" strokeWidth="0.5"/>
                         <path d="M 50 0 Q 20 50 50 100 Q 80 50 50 0" fill="none" stroke="#58a6ff" strokeWidth="0.5"/>
                         {/* Highlighted Seam */}
                         <path d="M 50 0 Q 30 50 50 100" fill="none" stroke="#f85149" strokeWidth="1.5" className="drop-shadow-[0_0_2px_#f85149]"/>
                      </svg>
                      <div className="absolute bg-[#f85149] w-1.5 h-1.5 rounded-full top-[50%] left-[30%] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_5px_#f85149]"></div>
                      <div className="absolute bg-[#58a6ff] w-1 h-1 rounded-full top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="absolute bg-[#58a6ff] w-1 h-1 rounded-full top-[80%] left-[50%] -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="absolute bg-white/20 text-[8px] font-mono text-[#f85149] px-1 rounded backdrop-blur top-[52%] left-[30%]">Edge_Seam_01</div>
                   </div>

                   {/* Gizmo */}
                   <div className="absolute right-4 bottom-4 w-16 h-16 opacity-80">
                      <div className="absolute bottom-2 left-2 w-10 h-[2px] bg-red-500 origin-left"></div>
                      <div className="absolute bottom-2 left-2 h-10 w-[2px] bg-green-500 origin-bottom"></div>
                      <div className="absolute bottom-2 left-2 w-8 h-[2px] bg-blue-500 origin-left rotate-45"></div>
                   </div>
                </div>
             </div>

             {/* UV Editor Panel (conditional) */}
             {activeTab === 'uv' && (
                <div className="flex-1 relative bg-[#111115] flex flex-col">
                   <div className="absolute top-2 left-2 flex gap-2 z-10">
                      <span className="bg-black/60 border border-[#444] text-[10px] text-white px-2 py-1 rounded backdrop-blur font-mono flex items-center gap-2">
                        <Grid size={10}/> UV Toolkit: UDIM 1001
                      </span>
                   </div>
                   
                   {/* UV Space (0-1) */}
                   <div className="flex-1 p-8 flex items-center justify-center">
                      <div className="w-full max-w-[500px] aspect-square border border-[#444] bg-[#0a0a0a] relative overflow-hidden group">
                         {/* Checker Texture / Grid */}
                         <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] opacity-50" style={{ backgroundSize: '10% 10%' }}></div>
                         <div className="absolute bottom-0 left-0 w-full h-[1px] bg-red-500"></div>
                         <div className="absolute bottom-0 left-0 h-full w-[1px] bg-green-500"></div>
                         <span className="absolute bottom-1 left-1 text-[8px] text-[#555] font-mono">0,0</span>
                         <span className="absolute top-1 right-1 text-[8px] text-[#555] font-mono">1,1</span>

                         {/* UV Islands Simulation */}
                         <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Island 1 */}
                            <path d="M 10 10 L 40 10 L 35 40 L 5 35 Z" fill="rgba(88,166,255,0.2)" stroke="#58a6ff" strokeWidth="0.5" className="hover:fill-[rgba(88,166,255,0.4)] cursor-pointer" />
                            {/* Island 2 (Selected) */}
                            <path d="M 50 15 L 90 20 L 85 45 L 45 40 Z" fill="rgba(188,140,255,0.4)" stroke="#bc8cff" strokeWidth="1" className="cursor-pointer drop-shadow-[0_0_5px_rgba(188,140,255,0.5)]" />
                            <circle cx="50" cy="15" r="1.5" fill="white" />
                            <circle cx="90" cy="20" r="1.5" fill="white" />
                            <circle cx="85" cy="45" r="1.5" fill="white" />
                            <circle cx="45" cy="40" r="1.5" fill="white" />
                            
                            {/* Island 3 */}
                            <path d="M 20 60 Q 50 50 80 60 Q 90 80 50 90 Q 10 80 20 60" fill="rgba(88,166,255,0.2)" stroke="#58a6ff" strokeWidth="0.5" className="hover:fill-[rgba(88,166,255,0.4)] cursor-pointer" />
                         </svg>
                      </div>
                   </div>
                </div>
             )}

         </div>
      </div>

      {/* Right Inspector & Tools */}
      <div className="w-[320px] bg-[#0d1117] border-l border-[#30363d] overflow-y-auto custom-scrollbar shrink-0">
          <div className="p-4 border-b border-[#30363d] bg-[#161b22]">
             <h3 className="text-[12px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Wrench size={14} className="text-[#bc8cff]"/> Tool Configuration
             </h3>
          </div>

          <div className="p-4 border-b border-[#30363d] space-y-4">
             <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-2 flex items-center gap-1"><Scissors size={12}/> Select & Cut</div>
             <div className="bg-[#161B22] border border-[#30363d] p-3 rounded space-y-2">
                <button className="w-full text-left py-1.5 px-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] font-bold text-white flex justify-between items-center transition">
                   Mark Seam (Edge) <span className="text-[#888] font-mono text-[9px]">Shift+E</span>
                </button>
                <button className="w-full text-left py-1.5 px-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] font-bold text-white flex justify-between items-center transition">
                   Clear Seam <span className="text-[#888] font-mono text-[9px]">Ctrl+E</span>
                </button>
                <div className="h-[1px] bg-[#30363d] my-2"></div>
                <label className="flex items-center gap-2 text-[10px] text-[#c9d1d9]"><input type="checkbox" className="accent-[#58a6ff]"/> Select Shortest Path</label>
                <label className="flex items-center gap-2 text-[10px] text-[#c9d1d9]"><input type="checkbox" className="accent-[#58a6ff]"/> Select Island (L)</label>
             </div>
          </div>

          <div className="p-4 border-b border-[#30363d] space-y-4">
             <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-2 flex items-center gap-1"><Grid size={12}/> UV Unwrapping Algorithms</div>
             
             <div className="bg-[#161B22] border border-[#30363d] p-3 rounded space-y-3">
                <button className="w-full py-2 bg-[#bc8cff]/10 text-[#bc8cff] border border-[#bc8cff]/30 rounded text-[11px] font-bold hover:bg-[#bc8cff] hover:text-black transition flex items-center justify-center gap-2">
                   <Grid size={14}/> Unwrap Selected (Angle Based)
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                   <button className="py-1.5 bg-[#21262d] border border-[#30363d] rounded text-[10px] text-[#c9d1d9] hover:text-white hover:bg-[#30363d] transition">Conformal</button>
                   <button className="py-1.5 bg-[#21262d] border border-[#30363d] rounded text-[10px] text-[#c9d1d9] hover:text-white hover:bg-[#30363d] transition">Cylinder / Cube</button>
                </div>
                
                <div className="pt-2">
                   <div className="flex justify-between text-[10px] text-[#8b949e] mb-1">
                      <span>Area Weight</span>
                      <span className="text-white font-mono">0.0</span>
                   </div>
                   <input type="range" className="w-full accent-[#bc8cff] bg-[#0a0a0a]" min="0" max="1" step="0.1" defaultValue="0" />
                </div>
             </div>
          </div>

          <div className="p-4 space-y-4">
             <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-2 flex items-center gap-1"><Box size={12}/> Packing & Layout</div>
             
             <div className="bg-[#161B22] border border-[#30363d] p-3 rounded space-y-3">
                 <button className="w-full py-1.5 bg-white text-black rounded text-[11px] font-bold hover:bg-[#ddd] transition flex items-center justify-center gap-2">
                   Pack UV Islands
                 </button>
                 
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] text-[#c9d1d9]">Margin (px)</span>
                       <input type="number" defaultValue={8} className="bg-black border border-[#30363d] text-white w-14 rounded text-[10px] p-1 text-center font-mono outline-none"/>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] text-[#c9d1d9]">Rotate</span>
                       <select className="bg-black border border-[#30363d] text-white rounded text-[10px] p-1 outline-none">
                         <option>Any Angle</option>
                         <option>90 Degrees</option>
                         <option>Off</option>
                       </select>
                    </div>
                 </div>

                 <div className="h-[1px] bg-[#30363d] my-2"></div>
                 
                 {/* Live Heatmap for distortion */}
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8b949e]">Distortion Heatmap</span>
                    <button className="w-8 h-4 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded border border-[#444] opacity-80 hover:opacity-100"></button>
                 </div>
                 
                 {/* Overlapping check */}
                 <button className="w-full mt-2 py-1.5 border border-red-500/30 text-red-400 bg-red-500/10 rounded text-[10px] hover:bg-red-500/20 transition flex items-center justify-center gap-1">
                   <Activity size={10}/> Detect Overlapping UVs
                 </button>
             </div>
          </div>

      </div>
    </div>
  );
}
