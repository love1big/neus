import React, { useState } from 'react';
import { Hammer, Box, Hexagon, Grid3X3, ArrowUpRight, Cpu, Shapes, Compass, Copy, Layers , Settings2 } from 'lucide-react';

export default function MapArchitectureEditor() {
  const [activeTool, setActiveTool] = useState('wall');
  
  const tools = [
    { id: 'wall', icon: <Box size={18} />, label: 'Draw Walls' },
    { id: 'floor', icon: <Hexagon size={18} />, label: 'Place Floors/Ceilings' },
    { id: 'stairs', icon: <ArrowUpRight size={18} />, label: 'Stairs & Ramps' },
    { id: 'prefab', icon: <Shapes size={18} />, label: 'Prefab Browser' },
    { id: 'gen', icon: <Cpu size={18} />, label: 'AI Architecture Gen' },
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
                  activeTool === tool.id ? 'bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]' : 'text-gray-400 hover:text-white hover:bg-[#2a2b3d]'
               }`}
               title={tool.label}
            >
               {tool.icon}
            </button>
         ))}
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-[#161621] border-r border-[#2a2b3d] flex flex-col shrink-0">
         <div className="p-4 border-b border-[#2a2b3d]">
            <h2 className="font-bold text-[#ff7b72] flex items-center gap-2 text-lg">
               <Hammer size={20} /> Architecture
            </h2>
            <p className="text-xs text-gray-400 mt-1">Grid-snapped modular building tools and structural PCG.</p>
         </div>

         <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-6">
            
            {activeTool === 'wall' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Wall Properties</h3>
                     
                     <div className="space-y-4">
                        <div>
                           <label className="text-xs text-gray-400 mb-2 block">Material Set</label>
                           <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded px-3 py-2 text-sm text-white">
                              <option>Medieval Stone Brick</option>
                              <option>Sci-Fi Hull Plating</option>
                              <option>Modern Concrete</option>
                              <option>Wooden Logs</option>
                           </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           <div>
                              <label className="text-xs text-gray-400 mb-1 block">Height (m)</label>
                              <input type="number" defaultValue={3} className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-white text-center font-mono" />
                           </div>
                           <div>
                              <label className="text-xs text-gray-400 mb-1 block">Thickness</label>
                              <input type="number" defaultValue={0.25} step={0.05} className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-white text-center font-mono" />
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div>
                     <h3 className="text-xs font-bold text-[#ff7b72] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1 flex items-center gap-2">
                        <Grid3X3 size={14} /> Snapping & Grid
                     </h3>
                     <div className="space-y-3">
                        <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2">
                           <span className="text-xs text-gray-300">Snap to Vertex</span>
                           <input type="checkbox" defaultChecked className="accent-[#ff7b72]" />
                        </div>
                        <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2">
                           <span className="text-xs text-gray-300">Snap Angle (15°)</span>
                           <input type="checkbox" defaultChecked className="accent-[#ff7b72]" />
                        </div>
                        <div>
                           <div className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>Grid Size</span>
                              <span className="text-white font-mono">1.0m</span>
                           </div>
                           <input type="range" min="0.1" max="5" step="0.1" defaultValue="1" className="w-full accent-[#ff7b72]" />
                        </div>
                     </div>
                  </div>
               </div>
            )}
            
            {activeTool === 'gen' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#e3b341] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">AI Structure Synth</h3>
                     <p className="text-xs text-gray-400 mb-4">Select a volume and the AI will synthesize a complete building within the bounds using WFC (Wave Function Collapse).</p>
                     
                     <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-3 rounded mb-4">
                        <label className="text-[10px] text-[#8b949e] mb-1 block font-bold">Architectural Prompt</label>
                        <textarea className="w-full h-20 bg-transparent text-xs text-white outline-none resize-none" defaultValue="A gothic cathedral with towering spires, stained glass windows, and flying buttresses. Intricate detailing."></textarea>
                     </div>
                     
                     <div className="space-y-3">
                        <div className="flex justify-between text-xs text-gray-400">
                           <span>Style Coherence</span>
                           <span className="text-white font-mono">High</span>
                        </div>
                        <input type="range" min="0" max="100" defaultValue="80" className="w-full accent-[#e3b341]" />
                     </div>
                     
                     <button className="w-full bg-[#e3b341]/10 hover:bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/30 py-3 rounded text-xs font-bold transition-colors flex justify-center items-center gap-2 mt-6 uppercase tracking-wider">
                        <Cpu size={16} /> Synthesize Volume
                     </button>
                  </div>
               </div>
            )}

         </div>
      </div>

      {/* Main Canvas Area Placeholder */}
      <div className="flex-1 bg-[#1a1b26] relative overflow-hidden flex flex-col">
         
         {/* Blueprint Grid */}
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#4b5b7a 1px, transparent 1px), linear-gradient(90deg, #4b5b7a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#4b5b7a 1px, transparent 1px), linear-gradient(90deg, #4b5b7a 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
         
         {/* Top bar */}
         <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="bg-[#11111b]/90 backdrop-blur border border-[#2a2b3d] rounded px-3 py-1.5 text-xs font-mono text-gray-300 flex items-center gap-4 shadow-lg">
               <span className="flex items-center gap-2"><Compass size={14} className="text-[#ff7b72]"/> TOP-DOWN VIEW</span>
               <span className="border-l border-[#2a2b3d] pl-4">Z-Floor: 0m</span>
               <span className="border-l border-[#2a2b3d] pl-4 flex items-center gap-2"><Layers size={14}/> Snapped</span>
            </div>
         </div>

         {/* Blueprint drawing mockup */}
         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 800">
            {/* Placed walls */}
            <rect x="200" y="200" width="400" height="10" fill="#4b5b7a" />
            <rect x="200" y="200" width="10" height="300" fill="#4b5b7a" />
            <rect x="200" y="500" width="150" height="10" fill="#4b5b7a" />
            <rect x="450" y="500" width="150" height="10" fill="#4b5b7a" />
            <rect x="600" y="200" width="10" height="310" fill="#4b5b7a" />
            
            {/* Active Drawing Tool */}
            <line x1="350" y1="505" x2="450" y2="505" stroke="#ff7b72" strokeWidth="4" strokeDasharray="8,8" className="animate-pulse" />
            <circle cx="350" cy="505" r="6" fill="#1a1b26" stroke="#ff7b72" strokeWidth="2" />
            <circle cx="450" cy="505" r="6" fill="#ff7b72" />
         </svg>

         {/* Floating Context Menu */}
         <div className="absolute top-[480px] left-[350px] bg-[#11111b] border border-[#2a2b3d] rounded shadow-xl p-1 flex gap-1 z-20">
            <button className="p-1.5 hover:bg-[#2a2b3d] text-gray-400 hover:text-white rounded" title="Duplicate"><Copy size={14} /></button>
            <button className="p-1.5 hover:bg-[#2a2b3d] text-gray-400 hover:text-[#ff7b72] rounded" title="Settings"><Settings2 size={14} /></button>
         </div>

      </div>
    </div>
  );
}
