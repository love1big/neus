import React, { useState } from 'react';
import { Mountain, Droplets, Paintbrush, Eraser, Move, Scissors, Layers, Eye, MousePointer2, Settings2, Hammer, Search, Activity, Pipette, Zap, Target } from 'lucide-react';

export default function MapTerrainEditor() {
  const [activeTool, setActiveTool] = useState('raise');
  const [brushSize, setBrushSize] = useState(25);
  const [brushStrength, setBrushStrength] = useState(0.5);
  const [brushFalloff, setBrushFalloff] = useState('smooth');

  const tools = [
    { id: 'raise', icon: <Mountain size={18} />, label: 'Raise Terrain' },
    { id: 'lower', icon: <Droplets size={18} />, label: 'Lower Terrain' },
    { id: 'flatten', icon: <Layers size={18} />, label: 'Flatten to Target' },
    { id: 'smooth', icon: <Eraser size={18} />, label: 'Smooth/Blur' },
    { id: 'ramp', icon: <Activity size={18} />, label: 'Create Ramp' },
    { id: 'noise', icon: <Zap size={18} />, label: 'Add Noise/Detail' },
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
         <button className="w-12 h-12 rounded flex items-center justify-center text-[#ff7b72] hover:bg-[#ff7b72]/20" title="Hole / Cut Terrain">
            <Scissors size={18} />
         </button>
         <button className="w-12 h-12 rounded flex items-center justify-center text-[#3fb950] hover:bg-[#3fb950]/20" title="Sample Elevation">
            <Pipette size={18} />
         </button>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-[#161621] border-r border-[#2a2b3d] flex flex-col shrink-0">
         <div className="p-4 border-b border-[#2a2b3d]">
            <h2 className="font-bold text-[#58a6ff] flex items-center gap-2 text-lg">
               <Mountain size={20} /> Terrain Sculpting
            </h2>
            <p className="text-xs text-gray-400 mt-1">Directly manipulate the heightmap data using physical brushes.</p>
         </div>

         <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
               {/* Brush Settings */}
               <div>
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Brush Properties</h3>
                  
                  <div className="space-y-4">
                     <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                           <span>Size (Radius)</span>
                           <span className="text-white font-mono">{brushSize}m</span>
                        </div>
                        <input 
                           type="range" 
                           min="1" max="500" 
                           value={brushSize} 
                           onChange={e => setBrushSize(parseInt(e.target.value))}
                           className="w-full accent-[#58a6ff]" 
                        />
                     </div>
                     
                     <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                           <span>Strength / Opacity</span>
                           <span className="text-white font-mono">{(brushStrength * 100).toFixed(0)}%</span>
                        </div>
                        <input 
                           type="range" 
                           min="0.01" max="1" step="0.01" 
                           value={brushStrength} 
                           onChange={e => setBrushStrength(parseFloat(e.target.value))}
                           className="w-full accent-[#58a6ff]" 
                        />
                     </div>

                     <div>
                        <label className="text-xs text-gray-400 mb-2 block">Falloff Curve (Hardness)</label>
                        <div className="grid grid-cols-4 gap-2">
                           {['linear', 'smooth', 'spherical', 'hard'].map(type => (
                              <button 
                                 key={type}
                                 onClick={() => setBrushFalloff(type)}
                                 className={`p-2 rounded border flex justify-center items-center ${brushFalloff === type ? 'bg-[#58a6ff]/20 border-[#58a6ff]' : 'border-[#2a2b3d] hover:bg-[#2a2b3d]'}`}
                                 title={type}
                              >
                                 <Target size={16} className={brushFalloff === type ? 'text-[#58a6ff]' : 'text-gray-500'} />
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Tool Specific Settings */}
               {activeTool === 'flatten' && (
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Flatten Settings</h3>
                     <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-3 rounded">
                        <label className="flex justify-between text-xs text-gray-400 mb-2">
                           <span>Target Height (m)</span>
                           <span className="text-[#3fb950] font-mono">120.5m</span>
                        </label>
                        <input type="number" defaultValue="120.5" className="w-full bg-[#161621] border border-[#2a2b3d] rounded px-2 py-1 text-white text-sm" />
                        <button className="mt-2 w-full bg-[#2a2b3d] hover:bg-[#3b3d54] text-white py-1.5 rounded text-xs transition">
                           Sample from center
                        </button>
                     </div>
                  </div>
               )}

               {activeTool === 'ramp' && (
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Ramp Settings</h3>
                     <p className="text-[10px] text-gray-400 mb-2">Click and drag to define ramp start and end points.</p>
                     <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs text-gray-300">
                           <input type="checkbox" className="accent-[#58a6ff]" defaultChecked /> Smooth edges
                        </label>
                        <div>
                           <label className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Width</span>
                              <span className="text-white">20m</span>
                           </label>
                           <input type="range" className="w-full accent-[#58a6ff]" min="1" max="100" defaultValue="20" />
                        </div>
                     </div>
                  </div>
               )}

               {/* Advanced Splat Maps */}
               <div>
                  <h3 className="text-xs font-bold text-[#d2a8ff] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1 mt-4 flex items-center gap-2">
                     <Layers size={14} /> Splat Map Layers
                  </h3>
                  <div className="space-y-2">
                     <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#d2a8ff]/50 rounded p-2 cursor-pointer">
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 bg-green-700 rounded-sm"></div>
                           <span className="text-xs font-bold">Grass Base</span>
                        </div>
                        <Eye size={14} className="text-[#d2a8ff]" />
                     </div>
                     <div className="flex items-center justify-between bg-[#1e1e2d] border border-[#2a2b3d] rounded p-2 cursor-pointer hover:border-gray-500">
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 bg-yellow-800 rounded-sm"></div>
                           <span className="text-xs text-gray-300">Dirt Patch</span>
                        </div>
                        <Eye size={14} className="text-gray-500" />
                     </div>
                     <div className="flex items-center justify-between bg-[#1e1e2d] border border-[#2a2b3d] rounded p-2 cursor-pointer hover:border-gray-500">
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
                           <span className="text-xs text-gray-300">Rock Cliff</span>
                        </div>
                        <Eye size={14} className="text-gray-500" />
                     </div>
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
               <span>X: <span className="text-white font-mono">1450.2</span></span>
               <span>Y: <span className="text-white font-mono">32.0</span></span>
               <span>Z: <span className="text-white font-mono">-890.5</span></span>
            </div>
         </div>

         {/* Grid background to simulate editor viewport */}
         <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5" style={{ backgroundSize: '100px 100px' }}></div>
         
         {/* Fake Brush Cursor */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-[#58a6ff]/50 rounded-full flex items-center justify-center bg-[#58a6ff]/10 pointer-events-none z-20 shadow-[0_0_20px_rgba(88,166,255,0.2)]">
            <div className="w-2 h-2 bg-[#58a6ff] rounded-full"></div>
            {/* Falloff ring */}
            <div className="absolute w-24 h-24 border border-[#58a6ff]/30 rounded-full border-dashed"></div>
         </div>

         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-[#161621]/90 backdrop-blur border border-[#2a2b3d] px-4 py-2 rounded-lg text-sm text-gray-300 shadow-xl flex items-center gap-4">
            <div className="flex items-center gap-1"><kbd className="bg-[#0a0a0f] border border-[#2a2b3d] rounded px-1.5 py-0.5 text-xs font-mono">Shift</kbd> + Drag to Smooth</div>
            <div className="flex items-center gap-1"><kbd className="bg-[#0a0a0f] border border-[#2a2b3d] rounded px-1.5 py-0.5 text-xs font-mono">Ctrl</kbd> + Drag to Invert (Lower)</div>
            <div className="flex items-center gap-1"><kbd className="bg-[#0a0a0f] border border-[#2a2b3d] rounded px-1.5 py-0.5 text-xs font-mono">[</kbd> / <kbd className="bg-[#0a0a0f] border border-[#2a2b3d] rounded px-1.5 py-0.5 text-xs font-mono">]</kbd> to Change Size</div>
         </div>
      </div>
    </div>
  );
}
