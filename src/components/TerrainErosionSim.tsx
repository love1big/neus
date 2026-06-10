import React from 'react';
import { Mountain, Layers, Droplets, ThermometerSun, Map as MapIcon, Sliders, Play, Maximize, Save, Crosshair, Wind, Eye, CheckCircle, Flame } from 'lucide-react';

export default function TerrainErosionSim() {
  return (
    <div className="flex flex-col h-full bg-[#18181b] text-[#e4e4e7] font-sans">
      
      {/* Top Header */}
      <div className="h-12 bg-[#27272a] border-b border-[#3f3f46] shadow-md flex justify-between items-center px-4 shrink-0 z-20">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-[#10b981] to-[#059669] rounded flex items-center justify-center text-white shadow-inner">
                <Mountain size={18}/>
             </div>
             <div>
                <h2 className="font-bold text-[12px] uppercase tracking-widest text-white shadow-black drop-shadow-sm">Procedural Terrain & Erosion</h2>
                <p className="text-[9px] text-[#a1a1aa] font-mono">HYDRAULIC & THERMAL MULTI-PASS SIMULATOR</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono bg-[#18181b] text-[#10b981] border border-[#3f3f46] px-2 py-1 rounded">Res: 2048 x 2048</span>
              <button className="bg-[#10b981] hover:bg-[#059669] text-white px-4 py-1.5 rounded text-[10px] font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2">
                 <Play size={14} fill="currentColor"/> Generate & Erode
              </button>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Center Viewport */}
         <div className="flex-1 bg-[#09090b] relative flex items-center justify-center overflow-hidden">
            
            {/* Viewport Controls */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur rounded p-1 flex gap-1 border border-[#27272a] z-10">
               <button className="p-1.5 bg-[#3f3f46] rounded text-white"><MapIcon size={14}/></button>
               <button className="p-1.5 hover:bg-[#3f3f46] rounded text-[#a1a1aa]"><Layers size={14}/></button>
               <button className="p-1.5 hover:bg-[#3f3f46] rounded text-[#a1a1aa]"><Eye size={14}/></button>
            </div>

            {/* Fake 3D Terrain Render */}
            <div className="w-[600px] h-[600px] relative transform rotate-x-60 rotate-z-45 perspective-1000">
               <div className="absolute inset-0 bg-gradient-to-br from-[#3f3f46] to-[#09090b] shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden border border-[#27272a] transform shadow-2xl">
                  {/* Terrain Topography visualizer */}
                  <div className="absolute inset-0 opacity-80" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #a1a1aa 0%, transparent 40%), radial-gradient(circle at 70% 60%, #52525b 0%, transparent 50%)' }}></div>
                  
                  {/* Fake Hydraulic Carving Lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M 30 30 Q 40 50, 60 70 T 80 90" fill="none" stroke="#2dd4bf" strokeWidth="0.5" className="opacity-70" />
                     <path d="M 40 20 Q 50 40, 70 60 T 90 80" fill="none" stroke="#2dd4bf" strokeWidth="0.3" className="opacity-50" />
                     <path d="M 20 40 Q 30 60, 50 80 T 70 100" fill="none" stroke="#2dd4bf" strokeWidth="0.4" className="opacity-60" />
                  </svg>
                  
                  {/* Thermal slippage overlay */}
                  <div className="absolute inset-0 opacity-30" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(239,68,68,0.1) 10px, rgba(239,68,68,0.1) 20px)' }}></div>
               </div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-[#18181b]/80 border border-[#27272a] rounded p-2 text-[10px] space-y-1 block max-w-[200px] backdrop-blur font-mono">
               <div className="flex justify-between text-[#a1a1aa]"><span>Polys</span> <span className="text-white">8,388,608</span></div>
               <div className="flex justify-between text-[#a1a1aa]"><span>Sediment</span> <span className="text-[#2dd4bf]">Active</span></div>
               <div className="flex justify-between text-[#a1a1aa]"><span>Iterations</span> <span className="text-white">245 / 500</span></div>
            </div>
         </div>

         {/* Property Inspector */}
         <div className="w-[320px] bg-[#18181b] border-l border-[#27272a] flex flex-col shrink-0 drop-shadow-xl z-20">
             
             <div className="flex pt-2 px-2 bg-[#27272a] border-b border-[#3f3f46]">
                <button className="flex-1 pb-2 border-b-2 border-[#10b981] text-[10px] font-bold uppercase tracking-widest text-[#10b981]">Hydraulic</button>
                <button className="flex-1 pb-2 border-b-2 border-transparent text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa] hover:text-white">Thermal</button>
                <button className="flex-1 pb-2 border-b-2 border-transparent text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa] hover:text-white">Base</button>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-[11px]">
                 
                 {/* Hydraulic Erosion Params */}
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-[#e4e4e7] uppercase flex items-center gap-2"><Droplets size={14} className="text-[#2dd4bf]"/> Fluid Dynamics</h4>
                    
                    <div>
                       <div className="flex justify-between text-[#a1a1aa] mb-1"><span>Rain Amount</span><span className="font-mono text-white">0.012</span></div>
                       <input type="range" className="w-full accent-[#2dd4bf]" min="0" max="100" defaultValue="12" />
                    </div>
                    <div>
                       <div className="flex justify-between text-[#a1a1aa] mb-1"><span>Evaporation Rate</span><span className="font-mono text-white">0.015</span></div>
                       <input type="range" className="w-full accent-[#2dd4bf]" min="0" max="100" defaultValue="15" />
                    </div>
                    <div>
                       <div className="flex justify-between text-[#a1a1aa] mb-1"><span>Gravity</span><span className="font-mono text-white">4.0</span></div>
                       <input type="range" className="w-full accent-[#2dd4bf]" min="0" max="100" defaultValue="40" />
                    </div>
                 </div>

                 {/* Sediment Transport */}
                 <div className="space-y-4 pt-4 border-t border-[#3f3f46]">
                    <h4 className="text-[10px] font-bold text-[#e4e4e7] uppercase flex items-center gap-2"><Wind size={14} className="text-[#d97706]"/> Sediment Capacity</h4>
                    
                    <div>
                       <div className="flex justify-between text-[#a1a1aa] mb-1"><span>Capacity Factor</span><span className="font-mono text-white">8.0</span></div>
                       <input type="range" className="w-full accent-[#d97706]" min="0" max="100" defaultValue="80" />
                    </div>
                    <div>
                       <div className="flex justify-between text-[#a1a1aa] mb-1"><span>Deposition Rate</span><span className="font-mono text-white">0.1</span></div>
                       <input type="range" className="w-full accent-[#d97706]" min="0" max="100" defaultValue="10" />
                    </div>
                    <div>
                       <div className="flex justify-between text-[#a1a1aa] mb-1"><span>Erosion Rate</span><span className="font-mono text-white">0.05</span></div>
                       <input type="range" className="w-full accent-[#d97706]" min="0" max="100" defaultValue="5" />
                    </div>
                 </div>

                 {/* Iteration Control */}
                 <div className="space-y-3 pt-4 border-t border-[#3f3f46]">
                     <h4 className="text-[10px] font-bold text-[#e4e4e7] uppercase flex items-center gap-2"><RefreshCw size={14} className="text-[#6366f1]"/> Simulator Control</h4>
                     
                     <div className="flex items-center justify-between">
                         <span className="text-[#a1a1aa]">Simulate Droplets</span>
                         <input type="number" defaultValue="75000" className="bg-[#27272a] border border-[#3f3f46] text-white p-1 rounded w-24 text-right font-mono" />
                     </div>
                     <div className="flex items-center justify-between">
                         <span className="text-[#a1a1aa]">Max Lifetime</span>
                         <input type="number" defaultValue="30" className="bg-[#27272a] border border-[#3f3f46] text-white p-1 rounded w-24 text-right font-mono" />
                     </div>
                 </div>

                 <div className="pt-4 space-y-2">
                     <button className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white py-2 rounded text-[11px] font-bold border border-[#52525b] uppercase tracking-widest flex items-center justify-center gap-2">
                         <Save size={14}/> Export Heightmap (.R16)
                     </button>
                     <button className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white py-2 rounded text-[11px] font-bold border border-[#52525b] uppercase tracking-widest flex items-center justify-center gap-2">
                         <Layers size={14}/> Export Splatmap
                     </button>
                 </div>

             </div>
         </div>
      </div>
    </div>
  );
}
