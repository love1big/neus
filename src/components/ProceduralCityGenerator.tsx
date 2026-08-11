import React, { useState } from 'react';
import { Building2, Map, Layout, Shuffle, Play, Pause, Download, Settings, Trash2, Maximize, Target, Zap, Activity } from 'lucide-react';

export default function ProceduralCityGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  const [density, setDensity] = useState(75);
  
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-green-700 p-1.5 rounded-lg shadow-lg">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Procedural <span className="text-emerald-400">City Gen</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Houdini-style PCG Graph</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setSeed(Math.floor(Math.random() * 1000000))} className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-[#333] hover:bg-[#444] transition-colors">
            <Shuffle size={14} /> NEW SEED
          </button>
          <button onClick={() => setIsGenerating(!isGenerating)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-colors ${isGenerating ? 'bg-orange-600/20 text-orange-400 border border-orange-600/50' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'}`}>
            {isGenerating ? <Pause size={14} /> : <Play size={14} />} 
            {isGenerating ? 'HALT GENERATION' : 'GENERATE CITY'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Settings Panel */}
        <div className="w-72 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Parameters</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Global Config</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400"><span>Seed</span><span className="font-mono">{seed}</span></div>
                <div className="flex justify-between text-[10px] text-gray-400"><span>Area Size</span><span className="font-mono">4km x 4km</span></div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Zoning Weights</h4>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400"><span>Commercial (Downtown)</span><span>{density}%</span></div>
                <input type="range" min="0" max="100" value={density} onChange={(e) => setDensity(Number(e.target.value))} className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400"><span>Residential (Suburbs)</span><span>60%</span></div>
                <input type="range" min="0" max="100" defaultValue="60" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400"><span>Industrial</span><span>30%</span></div>
                <input type="range" min="0" max="100" defaultValue="30" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none cursor-pointer accent-orange-500" />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Road Network</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] text-gray-400">
                  <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-emerald-500 focus:ring-0" /> Use L-System Branching
                </label>
                <label className="flex items-center gap-2 text-[10px] text-gray-400">
                  <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-emerald-500 focus:ring-0" /> Cul-de-sac generation
                </label>
                <label className="flex items-center gap-2 text-[10px] text-gray-400">
                  <input type="checkbox" className="rounded bg-[#1a1a1c] border-[#3e3e42] text-emerald-500 focus:ring-0" /> Topography adaptation (Slopes)
                </label>
              </div>
            </div>
            
          </div>
        </div>

        {/* 3D/Map Viewport */}
        <div className="flex-1 bg-[#121212] relative overflow-hidden flex items-center justify-center">
          
          {/* Decorative Grid Background simulating 3D plane */}
          <div className="absolute inset-0 z-0" style={{
            backgroundImage: `
              linear-gradient(rgba(62, 62, 66, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(62, 62, 66, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-10%)',
            transformOrigin: 'top center'
          }}>
            {/* Simulating procedural generation nodes on the grid */}
            {Array.from({length: 20}).map((_, i) => (
              <div key={i} className="absolute border border-emerald-500/30 bg-emerald-900/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]" style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                width: `${Math.random() * 100 + 20}px`,
                height: `${Math.random() * 100 + 20}px`,
                backdropFilter: 'blur(2px)'
              }}>
                <div className="text-[8px] text-emerald-500/50 font-mono text-center">BLK_{i}</div>
              </div>
            ))}
          </div>

          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button className="bg-[#252526] border border-[#3e3e42] p-2 rounded hover:bg-[#333] transition-colors"><Map size={16} className="text-gray-300"/></button>
            <button className="bg-[#252526] border border-[#3e3e42] p-2 rounded hover:bg-[#333] transition-colors"><Layout size={16} className="text-gray-300"/></button>
          </div>
          
          <div className="absolute bottom-4 left-4 z-10 bg-[#252526]/80 backdrop-blur border border-[#3e3e42] p-3 rounded-lg flex flex-col gap-1 w-64">
             <div className="text-[10px] font-bold text-gray-400 uppercase">Gen Status</div>
             <div className="w-full bg-[#1a1a1c] h-1.5 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500" style={{ width: isGenerating ? '100%' : '15%', transition: 'width 2s ease-in-out' }}></div>
             </div>
             <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1">
               <span>Stage: Building Splines</span>
               <span>{isGenerating ? 'Running...' : 'Idle'}</span>
             </div>
          </div>

        </div>

        {/* Right Panel: Stats & Nodes */}
        <div className="w-80 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 z-10">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Activity size={14}/> Statistics</h3>
           </div>
           
           <div className="p-4 space-y-4 border-b border-[#3e3e42]">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1a1a1c] border border-[#3e3e42] p-3 rounded flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-200">12,402</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">Buildings</span>
                </div>
                <div className="bg-[#1a1a1c] border border-[#3e3e42] p-3 rounded flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-200">843</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">Intersections</span>
                </div>
              </div>
              <div className="bg-[#1a1a1c] border border-[#3e3e42] p-3 rounded flex justify-between items-center">
                <span className="text-[10px] text-gray-400 uppercase">Draw Calls (Est)</span>
                <span className="text-xs font-mono text-orange-400 font-bold">1,402</span>
              </div>
           </div>

           <div className="p-3 bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Layout size={14}/> Node Graph</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
             {/* Fake Node Graph List */}
             <div className="space-y-2 relative">
               <div className="absolute left-3.5 top-2 bottom-2 w-px bg-[#3e3e42] z-0"></div>
               
               {[
                 { name: "Terrain Input", type: "Input", color: "text-gray-400", time: "0ms" },
                 { name: "Water Body Mask", type: "Filter", color: "text-blue-400", time: "12ms" },
                 { name: "Primary Arteries", type: "Spline", color: "text-orange-400", time: "45ms" },
                 { name: "Secondary Roads", type: "L-System", color: "text-orange-400", time: "120ms" },
                 { name: "Lot Subdivider", type: "Geometry", color: "text-emerald-400", time: "340ms" },
                 { name: "Building Extruder", type: "Instancer", color: "text-purple-400", time: "850ms" },
               ].map((node, i) => (
                 <div key={i} className="relative z-10 flex items-center gap-3 bg-[#252526] border border-[#3e3e42] p-2 rounded hover:border-gray-500 transition-colors cursor-pointer">
                   <div className="w-2 h-2 rounded-full bg-gray-500 shrink-0"></div>
                   <div className="flex-1 min-w-0">
                     <div className={`text-[10px] font-bold truncate ${node.color}`}>{node.name}</div>
                     <div className="text-[8px] text-gray-500 uppercase">{node.type}</div>
                   </div>
                   <div className="text-[9px] font-mono text-gray-600">{node.time}</div>
                 </div>
               ))}
             </div>
           </div>
           
        </div>

      </div>
    </div>
  );
}
