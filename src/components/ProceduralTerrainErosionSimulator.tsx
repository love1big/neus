import React, { useState } from 'react';
import { Mountain, CloudRain, Droplet, Sun, Play, Pause, Settings, Layers, Wind, Activity, Download } from 'lucide-react';

export default function ProceduralTerrainErosionSimulator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [iterations, setIterations] = useState(14020);

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Header */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-1.5 rounded-lg shadow-lg">
            <Mountain size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Terrain <span className="text-emerald-400">Erosion Simulator</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Hydraulic & Thermal Weathering</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="bg-[#333] hover:bg-[#444] px-3 py-1.5 rounded text-xs font-bold text-gray-300 transition-colors flex items-center gap-2">
             <Download size={14}/> EXPORT HEIGHTMAP
           </button>
           <button 
             onClick={() => setIsSimulating(!isSimulating)}
             className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition-colors ${isSimulating ? 'bg-orange-600/20 text-orange-400 border border-orange-600/50' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'}`}
           >
             {isSimulating ? <Pause size={14}/> : <Play size={14}/>}
             {isSimulating ? 'PAUSE EROSION' : 'SIMULATE EROSION'}
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Simulation Parameters */}
        <div className="w-80 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Erosion Properties</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
             
             {/* Hydraulic */}
             <div className="space-y-4">
               <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1 flex items-center gap-2">
                 <Droplet size={12}/> Hydraulic Erosion
               </h4>
               
               <div className="space-y-3 text-[10px]">
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Rainfall Rate</span><span>0.12</span></div>
                   <input type="range" defaultValue="40" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-blue-500" />
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Evaporation Speed</span><span>0.015</span></div>
                   <input type="range" defaultValue="15" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-blue-500" />
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Sediment Capacity</span><span>0.08</span></div>
                   <input type="range" defaultValue="80" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-blue-500" />
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Erosion / Deposition Rate</span><span>0.05</span></div>
                   <input type="range" defaultValue="50" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-blue-500" />
                 </div>
               </div>
             </div>

             {/* Thermal */}
             <div className="space-y-4">
               <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1 flex items-center gap-2">
                 <Sun size={12}/> Thermal Weathering
               </h4>
               
               <div className="space-y-3 text-[10px]">
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Talus Angle (Repose)</span><span>35°</span></div>
                   <input type="range" defaultValue="35" max="60" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-orange-500" />
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Weathering Rate</span><span>0.02</span></div>
                   <input type="range" defaultValue="20" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-orange-500" />
                 </div>
               </div>
             </div>

             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Simulation Settings</h4>
               <div className="space-y-2 text-[10px] text-gray-300">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-emerald-500 focus:ring-0" /> GPU Acceleration (Compute Shaders)
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-emerald-500 focus:ring-0" /> Wrap Edges (Seamless)
                  </label>
               </div>
             </div>

          </div>
        </div>

        {/* Center: 3D Preview (Top-down heightmap/3D visualization mock) */}
        <div className="flex-1 bg-[#121212] relative overflow-hidden flex flex-col">
           
           {/* Visual Map Render (Mock) */}
           <div className="flex-1 flex items-center justify-center p-8 relative">
              
              {/* Outer map container */}
              <div className="w-[500px] h-[500px] rounded-lg overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-[#3e3e42]"
                   style={{
                     background: 'radial-gradient(circle at 30% 30%, #4b5563 0%, #1f2937 60%, #111827 100%)',
                     boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
                   }}>
                   
                 {/* Fake topographical lines */}
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay scale-150"></div>
                 
                 {/* Fake erosion valleys / river beds */}
                 <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 500 500">
                   <path d="M 100 0 Q 150 150 300 250 T 500 400" fill="none" stroke="#60a5fa" strokeWidth="8" filter="blur(4px)" className={isSimulating ? "animate-pulse" : ""} />
                   <path d="M 100 0 Q 150 150 300 250 T 500 400" fill="none" stroke="#2dd4bf" strokeWidth="3" />
                   
                   <path d="M 0 150 Q 200 200 300 250" fill="none" stroke="#60a5fa" strokeWidth="6" filter="blur(3px)" />
                   <path d="M 0 150 Q 200 200 300 250" fill="none" stroke="#2dd4bf" strokeWidth="2" />
                 </svg>

                 {/* Fake sediment deposits */}
                 <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-900/40 blur-3xl rounded-full"></div>
                 <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-800/30 blur-2xl rounded-full"></div>
                 
                 {/* Simulation active overlay particles (fake rain drops) */}
                 {isSimulating && (
                   <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-screen animate-[ping_1s_infinite]"></div>
                 )}
              </div>

           </div>

           {/* Bottom Overlay Stats */}
           <div className="absolute bottom-6 left-6 bg-[#252526]/90 backdrop-blur border border-[#3e3e42] p-4 rounded-lg flex gap-8">
             <div className="flex flex-col">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Map Resolution</span>
               <span className="text-sm font-mono text-white">2048 x 2048</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Iterations</span>
               <span className="text-sm font-mono text-emerald-400">{isSimulating ? (iterations + Math.floor(Math.random()*100)).toLocaleString() : iterations.toLocaleString()}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Sediment Moved</span>
               <span className="text-sm font-mono text-orange-400">{isSimulating ? (42.5 + Math.random()).toFixed(2) : '42.50'} MT</span>
             </div>
           </div>

           {/* View Modes */}
           <div className="absolute top-6 right-6 bg-[#252526]/90 backdrop-blur border border-[#3e3e42] p-1.5 rounded flex gap-1">
             <button className="px-3 py-1.5 bg-[#1a1a1c] text-emerald-400 text-[10px] font-bold rounded uppercase">Heightmap</button>
             <button className="px-3 py-1.5 hover:bg-[#333] text-gray-400 text-[10px] font-bold rounded uppercase transition-colors">Water Flow</button>
             <button className="px-3 py-1.5 hover:bg-[#333] text-gray-400 text-[10px] font-bold rounded uppercase transition-colors">Sediment</button>
           </div>
        </div>

      </div>
    </div>
  );
}
