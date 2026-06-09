import React, { useState } from 'react';
import { Mountain, CloudRain, Wind, Zap, Layers, Map, Waypoints, Activity, Compass, Target, Focus, Hexagon, PenTool, Plus, Minus, Settings2, Palette, Download, Save, Upload, SlidersHorizontal, Maximize, Play, Pause, ChevronDown, ChevronRight, Eye, Grid, Camera } from 'lucide-react';

export default function AdvancedTerrainEditor() {
  const [activeBrush, setActiveBrush] = useState('Raise');
  const brushes = ['Raise', 'Lower', 'Flatten', 'Smooth', 'Ramp', 'Noise', 'Erosion', 'Hydro', 'Biome Paint', 'Foliage'];
  const layers = ['Alpine Snow', 'Rocky Cliff', 'Dirt Base', 'Grassland', 'Mud Area'];

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0d1117] text-[#8b949e] font-sans text-xs overflow-hidden select-none">
      {/* Top Menubar */}
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-3 py-1.5 shrink-0">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#3fb950] text-[#0d1117] rounded text-[10px] font-bold shadow-md uppercase tracking-wider"><Mountain size={14} /> Terrain Engine Pro</div>
            <div className="flex items-center text-[11px] font-bold uppercase tracking-wider gap-4 pl-2">
               <span className="hover:text-white cursor-pointer transition-colors text-white border-b border-white pb-[2px]">Sculpt</span>
               <span className="hover:text-white cursor-pointer transition-colors">Paint Layer</span>
               <span className="hover:text-white cursor-pointer transition-colors">Erosion Sim</span>
               <span className="hover:text-white cursor-pointer transition-colors">Splines / Roads</span>
               <span className="hover:text-white cursor-pointer transition-colors">Foliage Scatter</span>
               <span className="hover:text-white cursor-pointer transition-colors">Landscape Material</span>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#21262d] text-white px-3 py-1 rounded border border-[#30363d] hover:bg-[#30363d] transition-colors font-bold shadow-sm"><Save size={12}/> Bake Terrain</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Left Brush Panel */}
         <div className="w-72 bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
            <div className="p-3 border-b border-[#30363d]">
               <h3 className="text-white font-bold text-[11px] uppercase tracking-wider mb-3 flex items-center gap-2"><PenTool size={14} className="text-[#3fb950]" /> Brush Tools</h3>
               <div className="grid grid-cols-2 gap-2">
                  {brushes.map(b => (
                     <button 
                       key={b}
                       onClick={() => setActiveBrush(b)}
                       className={`py-1.5 px-2 rounded font-bold text-center border transition-all ${activeBrush === b ? 'bg-[#3fb950]/20 border-[#3fb950]/50 text-[#3fb950] shadow-inner' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-[#8b949e] hover:text-white'}`}
                     >
                        {b}
                     </button>
                  ))}
               </div>
            </div>

            <div className="p-3 border-b border-[#30363d] space-y-4">
               <h3 className="text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-2"><SlidersHorizontal size={14} className="text-[#3fb950]" /> Brush Settings</h3>
               
               <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                     <span>Brush Size / Radius</span>
                     <span className="bg-[#0d1117] border border-[#30363d] px-2 rounded font-mono text-white">400 m</span>
                  </div>
                  <input type="range" min="1" max="1000" defaultValue="400" className="w-full accent-[#3fb950]"/>
               </div>

               <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                     <span>Tool Strength</span>
                     <span className="bg-[#0d1117] border border-[#30363d] px-2 rounded font-mono text-white">0.35</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="35" className="w-full accent-[#3fb950]"/>
               </div>

               <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                     <span>Brush Falloff</span>
                     <span className="bg-[#0d1117] border border-[#30363d] px-2 rounded font-mono text-white">Smooth</span>
                  </div>
                  <input type="range" min="1" max="100" defaultValue="50" className="w-full accent-[#3fb950]"/>
               </div>

               <div className="pt-2">
                  <div className="text-[10px] mb-2 font-bold text-white">Falloff Curve Shape</div>
                  <div className="flex gap-1 h-12">
                     <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded cursor-pointer relative overflow-hidden group">
                        <svg className="w-full h-full text-[#3fb950] absolute bottom-0 left-0" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,100 C50,100 50,0 100,0 L100,100 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/></svg>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>
                     <div className="flex-1 bg-[#1f6feb]/20 border border-[#1f6feb]/50 rounded cursor-pointer relative overflow-hidden shadow-inner">
                        <svg className="w-full h-full text-[#1f6feb] absolute bottom-0 left-0" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,100 L100,0 L100,100 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/></svg>
                     </div>
                     <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded cursor-pointer relative overflow-hidden group">
                        <svg className="w-full h-full text-[#3fb950] absolute bottom-0 left-0" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,100 C0,100 0,0 100,0 L100,100 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/></svg>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-3">
               <h3 className="text-white font-bold text-[11px] uppercase tracking-wider mb-3 flex items-center gap-2"><Layers size={14} className="text-[#3fb950]" /> Target Layer Weights</h3>
               <div className="space-y-2">
                  {layers.map((layer, i) => (
                     <div key={i} className={`flex items-center gap-3 p-2 rounded cursor-pointer border transition-colors ${i === 3 ? 'bg-[#3fb950]/10 border-[#3fb950]/30' : 'bg-[#0d1117] border-[#30363d] hover:bg-[#21262d]'}`}>
                        <div className={`w-8 h-8 rounded border ${i === 0 ? 'bg-white border-gray-300' : i === 1 ? 'bg-gray-600 border-gray-500' : i === 2 ? 'bg-yellow-900 border-yellow-800' : i === 3 ? 'bg-green-600 border-green-500 ring-2 ring-[#3fb950] ring-offset-2 ring-offset-[#0d1117]' : 'bg-yellow-800 border-yellow-700'}`}></div>
                        <div className="flex-1">
                           <div className={`font-bold ${i === 3 ? 'text-white' : 'text-[#c9d1d9]'}`}>{layer}</div>
                           <div className="w-full bg-[#161b22] h-1.5 mt-1.5 rounded-full overflow-hidden border border-[#30363d]">
                              <div className="h-full bg-[#3fb950]" style={{ width: i === 3 ? '100%' : i === 2 ? '40%' : '0%' }}></div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
               <button className="w-full mt-3 py-1.5 border border-dashed border-[#30363d] rounded text-[#c9d1d9] font-bold hover:bg-[#21262d] transition-colors flex items-center justify-center gap-2">
                  <Plus size={14}/> Create New Layer Info
               </button>
            </div>
         </div>

         {/* 3D Viewport Terrain Simulation */}
         <div className="flex-1 bg-[#090b0e] relative overflow-hidden flex flex-col justify-between">
            {/* Viewport Info Overlay */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 font-mono text-[10px]">
               <span className="text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur border border-white/10 shadow-sm"><strong className="text-[#3fb950]">8K</strong> Heightmap Resolution</span>
               <span className="text-[#8b949e] bg-black/60 px-2 py-0.5 rounded backdrop-blur border border-white/10 w-fit">World Bounds: 16km x 16km</span>
               <span className="text-yellow-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur border border-white/10 w-fit font-bold flex items-center gap-1 mt-2">
                  <Target size={10} /> X: 4502.11  Y: -1089.04  Z: 85.00
               </span>
            </div>

            {/* Brush Reticle Simulation */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center translate-y-[20%] translate-x-[10%]">
               <div className="w-48 h-16 border-2 border-dashed border-[#3fb950] rounded-[100%] absolute transform perspective-1000 rotateX-60 flex items-center justify-center shadow-[0_0_30px_rgba(63,185,80,0.3)]">
                  <div className="w-2 h-2 bg-[#3fb950] rounded-full"></div>
                  <div className="absolute left-1/2 bottom-full bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded border border-white/10 font-mono -translate-x-1/2 mb-1">
                     Radius: 400m
                  </div>
               </div>
            </div>

            {/* Simulated Terrain Mesh (Wireframe over Solid gradient) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#090b0e] via-[#121c16] to-[#0d161a] pointer-events-none -z-10"></div>
            <div 
               className="absolute top-1/2 left-0 right-0 h-96 opacity-30 transform perspective-1000 rotateX-60 pointer-events-none"
               style={{ 
                 backgroundImage: 'linear-gradient(to right, #3fb950 1px, transparent 1px), linear-gradient(to bottom, #3fb950 1px, transparent 1px)', 
                 backgroundSize: '40px 40px',
                 maskImage: 'radial-gradient(ellipse at center, white 0%, transparent 60%)',
                 WebkitMaskImage: 'radial-gradient(ellipse at center, white 0%, transparent 60%)'
               }}
            ></div>

            {/* Viewport Toolbar */}
            <div className="absolute top-4 right-4 z-10 flex text-[10px] bg-[#161b22] border border-[#30363d] rounded overflow-hidden shadow-lg font-bold">
               <button className="px-3 py-1.5 hover:bg-[#21262d] text-[#c9d1d9] border-r border-[#30363d] transition-colors"><Map size={12} className="inline mr-1"/> Topology View</button>
               <button className="px-3 py-1.5 bg-[#21262d] text-[#3fb950] border-r border-[#30363d] transition-colors flex items-center gap-1.5"><Layers size={12}/> Material Paint View</button>
               <button className="px-3 py-1.5 hover:bg-[#21262d] text-[#c9d1d9] border-r border-[#30363d] transition-colors"><Maximize size={12} className="inline mr-1"/> Wireframe</button>
               <button className="px-3 py-1.5 hover:bg-[#21262d] text-[#c9d1d9] transition-colors">Lighting</button>
            </div>
         </div>
      </div>

      {/* Bottom Processor Graph (Simulating World Machine or Houdini PCG logic) */}
      <div className="h-56 border-t border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
         <div className="px-3 py-1 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
            <div className="flex items-center gap-2">
               <Activity size={14} className="text-[#58a6ff]"/> Procedural Terrain Generation Graph
            </div>
            <div className="flex items-center gap-3">
               <button className="flex items-center gap-1 px-2 py-0.5 bg-[#1f6feb] text-white rounded hover:bg-[#388bfd] transition-colors"><Play size={10} fill="currentColor"/> Execute Generation Pipeline</button>
            </div>
         </div>
         
         <div className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9IiMwZDExMTciIGZpbGwtb3BhY2l0eT0iMSIgLz4KPHBhdGggZD0iTTAgNDBoNDBNNDAgMHY0TTEwIDEwaDEwTTMwIDMwaDEwIiBzdHJva2U9IiMzMDM2M2QiIHN0cm9rZS13aWR0aD0iMSIvPgo8cGF0aCBkPSJNMCAyMGg0ME0yMCAwdjQwIiBzdHJva2U9IiMzMDM2M2QiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=')] relative overflow-hidden flex items-center px-10">
            {/* Very fake Node Graph implementation */}
            <div className="flex items-center gap-10 opacity-90 drop-shadow-lg scale-90 origin-left">
               {/* Node 1 */}
               <div className="w-48 bg-[#0d1117] border border-[#30363d] rounded shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-900 to-teal-800 px-3 py-1.5 flex items-center justify-between border-b border-teal-700/50">
                     <span className="text-teal-100 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5"><Grid size={12}/> Advanced Perlin</span>
                     <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_5px_rgba(45,212,191,1)]"></div>
                  </div>
                  <div className="p-2 space-y-1.5 bg-[#161b22]">
                     <div className="flex items-center justify-between text-[9px]"><span className="text-[#8b949e]">Scale</span><span className="font-mono text-white">4.50</span></div>
                     <div className="flex items-center justify-between text-[9px]"><span className="text-[#8b949e]">Octaves</span><span className="font-mono text-white">9</span></div>
                     <div className="flex justify-end mt-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black shadow-[0_0_5px_rgba(250,204,21,1)] relative">
                           {/* Connection Wire */}
                           <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-32 h-10 pointer-events-none" style={{overflow: 'visible'}}>
                              <path d="M 0 0 C 20 0, 20 20, 36 20" fill="none" stroke="currentColor" className="text-yellow-400" strokeWidth="2" />
                           </svg>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Node 2 */}
               <div className="w-48 bg-[#0d1117] border-2 border-yellow-500 rounded shadow-xl overflow-hidden translate-y-5 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                  <div className="bg-gradient-to-r from-orange-900 to-orange-800 px-3 py-1.5 flex items-center justify-between border-b border-orange-700/50">
                     <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,1)]"></div>
                     <span className="text-orange-100 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5"><Wind size={12}/> Thermal Erosion</span>
                     <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,1)]"></div>
                  </div>
                  <div className="p-2 space-y-1.5 bg-[#161b22]">
                     <div className="flex items-center justify-between text-[9px]"><span className="text-[#8b949e]">Talus Angle</span><span className="font-mono text-white">35.0</span></div>
                     <div className="flex items-center justify-between text-[9px]"><span className="text-[#8b949e]">Iterations</span><span className="font-mono text-white">150</span></div>
                     <div className="flex justify-between items-center mt-2 px-1">
                         <div className="w-2.5 h-2.5 rounded-full bg-blue-400 border border-black"></div>
                         <div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-black shadow-[0_0_5px_rgba(74,222,128,1)] relative">
                             {/* Connection Wire */}
                             <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-48 h-10 pointer-events-none" style={{overflow: 'visible'}}>
                                <path d="M 0 0 C 20 0, 20 -20, 48 -20" fill="none" stroke="currentColor" className="text-green-400" strokeWidth="2" />
                             </svg>
                         </div>
                     </div>
                  </div>
               </div>

               {/* Node 3 */}
               <div className="w-48 bg-[#0d1117] border border-[#30363d] rounded shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5 flex items-center justify-between border-b border-blue-700/50">
                     <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,1)]"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                     </div>
                     <span className="text-blue-100 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5"><CloudRain size={12}/> Hydro Erosion</span>
                     <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,1)]"></div>
                  </div>
                  <div className="p-2 space-y-1.5 bg-[#161b22]">
                     <div className="flex items-center justify-between text-[9px]"><span className="text-[#8b949e]">Rain Amount</span><span className="font-mono text-white">4.2</span></div>
                     <div className="flex items-center justify-between text-[9px]"><span className="text-[#8b949e]">Solubility</span><span className="font-mono text-white">0.8</span></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
