import React, { useState } from 'react';
import { Route, Search, Navigation, Spline, ArrowRight, Save, Trash2, Map, Mountain, GitCommit, Link, Settings2 } from 'lucide-react';

export default function MapRoadEditor() {
  const [activeTool, setActiveTool] = useState('spline');
  const [roadType, setRoadType] = useState('dirt');
  const [roadWidth, setRoadWidth] = useState(4);

  const tools = [
    { id: 'spline', icon: <Spline size={18} />, label: 'Draw Spline Path' },
    { id: 'connect', icon: <Link size={18} />, label: 'Connect Nodes' },
    { id: 'edit', icon: <GitCommit size={18} />, label: 'Edit Control Points' },
    { id: 'erase', icon: <Trash2 size={18} />, label: 'Delete Segment' },
  ];

  return (
    <div className="flex-1 h-full bg-[#11111b] flex text-white overflow-hidden">
      
      {/* Left Toolbar */}
      <div className="w-16 bg-[#161621] border-r border-[#2a2b3d] flex flex-col items-center py-4 gap-3 shrink-0">
         {tools.map(tool => (
            <button
               key={tool.id}
               onClick={() => setActiveTool(tool.id)}
               className={`w-12 h-12 rounded flex items-center justify-center transition-all ${
                  activeTool === tool.id ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]' : 'text-gray-400 hover:text-white hover:bg-[#2a2b3d]'
               }`}
               title={tool.label}
            >
               {tool.icon}
            </button>
         ))}
         <div className="w-10 h-[1px] bg-[#2a2b3d] my-2"></div>
         <button className="w-12 h-12 rounded flex items-center justify-center text-[#e3b341] hover:bg-[#e3b341]/20" title="Snap to Terrain">
            <Mountain size={18} />
         </button>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-[#161621] border-r border-[#2a2b3d] flex flex-col shrink-0">
         <div className="p-4 border-b border-[#2a2b3d]">
            <h2 className="font-bold text-[#58a6ff] flex items-center gap-2 text-lg">
               <Route size={20} /> Road Networks
            </h2>
            <p className="text-xs text-gray-400 mt-1">Design splines for roads, rivers, and AI patrol paths.</p>
         </div>

         <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
               {/* Spline Settings */}
               <div>
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Path Properties</h3>
                  
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs text-gray-400 mb-2 block">Material / Type</label>
                        <select 
                           value={roadType} 
                           onChange={e => setRoadType(e.target.value)}
                           className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded px-3 py-2 text-sm text-white"
                        >
                           <option value="dirt">Dirt Trail</option>
                           <option value="cobble">Cobblestone Path</option>
                           <option value="asphalt">Asphalt Road</option>
                           <option value="river">River / Waterway</option>
                           <option value="invisible">Invisible AI Nav Path</option>
                        </select>
                     </div>

                     <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                           <span>Width (m)</span>
                           <span className="text-white font-mono">{roadWidth}m</span>
                        </div>
                        <input 
                           type="range" 
                           min="1" max="20" step="0.5"
                           value={roadWidth} 
                           onChange={e => setRoadWidth(parseFloat(e.target.value))}
                           className="w-full accent-[#58a6ff]" 
                        />
                     </div>
                  </div>
               </div>

               <div>
                  <h3 className="text-xs font-bold text-[#d2a8ff] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1 mt-4 flex items-center gap-2">
                     <Settings2 size={14} /> Advanced Spline
                  </h3>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2">
                        <span className="text-xs text-gray-300">Flatten Terrain to Road</span>
                        <input type="checkbox" defaultChecked className="accent-[#d2a8ff]" />
                     </div>
                     <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2">
                        <span className="text-xs text-gray-300">Snap to Grid</span>
                        <input type="checkbox" className="accent-[#d2a8ff]" />
                     </div>
                     <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2">
                        <span className="text-xs text-gray-300">Closed Loop</span>
                        <input type="checkbox" className="accent-[#d2a8ff]" />
                     </div>
                     
                     <button className="w-full bg-[#d2a8ff]/10 hover:bg-[#d2a8ff]/20 text-[#d2a8ff] border border-[#d2a8ff]/30 py-2 rounded text-xs transition-colors flex justify-center items-center gap-2 mt-4">
                        <Mountain size={14} /> Bake Terrain Deformation
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Main Canvas Area Placeholder */}
      <div className="flex-1 bg-[#0a0a0f] relative overflow-hidden flex flex-col">
         {/* Top bar inside canvas */}
         <div className="absolute top-4 right-4 z-10 flex gap-2">
            <div className="bg-[#161621]/80 backdrop-blur border border-[#2a2b3d] rounded px-3 py-1.5 text-xs text-gray-300 flex items-center gap-2 shadow-lg">
               <span>Nodes: <span className="text-white font-mono">14</span></span>
               <span>Length: <span className="text-white font-mono">1.2km</span></span>
            </div>
         </div>

         {/* Grid background */}
         <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5" style={{ backgroundSize: '100px 100px' }}></div>
         
         {/* Fake Spline Rendering */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 800" preserveAspectRatio="none">
            {/* The Road */}
            <path d="M 100 700 C 200 600, 300 300, 500 400 S 700 100, 900 200" fill="none" stroke="#e3b341" strokeWidth="20" strokeLinecap="round" opacity="0.4" />
            <path d="M 100 700 C 200 600, 300 300, 500 400 S 700 100, 900 200" fill="none" stroke="#58a6ff" strokeWidth="2" strokeDasharray="10,10" />
            
            {/* Control Points */}
            <circle cx="100" cy="700" r="6" fill="#fff" stroke="#58a6ff" strokeWidth="2" className="cursor-pointer pointer-events-auto hover:fill-[#58a6ff]" />
            <circle cx="300" cy="450" r="6" fill="#fff" stroke="#58a6ff" strokeWidth="2" className="cursor-pointer pointer-events-auto hover:fill-[#58a6ff]" />
            <circle cx="500" cy="400" r="6" fill="#fff" stroke="#58a6ff" strokeWidth="2" className="cursor-pointer pointer-events-auto hover:fill-[#58a6ff]" />
            <circle cx="700" cy="250" r="6" fill="#fff" stroke="#58a6ff" strokeWidth="2" className="cursor-pointer pointer-events-auto hover:fill-[#58a6ff]" />
            <circle cx="900" cy="200" r="6" fill="#fff" stroke="#58a6ff" strokeWidth="2" className="cursor-pointer pointer-events-auto hover:fill-[#58a6ff]" />
         </svg>

         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-[#161621]/90 backdrop-blur border border-[#2a2b3d] px-4 py-2 rounded-lg text-sm text-gray-300 shadow-xl flex items-center gap-4">
            <div className="flex items-center gap-1"><kbd className="bg-[#0a0a0f] border border-[#2a2b3d] rounded px-1.5 py-0.5 text-xs font-mono">Click</kbd> to add node</div>
            <div className="flex items-center gap-1"><kbd className="bg-[#0a0a0f] border border-[#2a2b3d] rounded px-1.5 py-0.5 text-xs font-mono">Drag</kbd> node to move</div>
            <div className="flex items-center gap-1"><kbd className="bg-[#0a0a0f] border border-[#2a2b3d] rounded px-1.5 py-0.5 text-xs font-mono">Alt</kbd> + Click to delete</div>
         </div>
      </div>
    </div>
  );
}
