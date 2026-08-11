import React, { useState } from 'react';
import { Droplets, Cloud, Scan, Layers, Sliders, Waves, Activity, Download, Settings2, Wind } from 'lucide-react';

export default function MapWaterEditor() {
  const [activeTool, setActiveTool] = useState('ocean');
  const [seaLevel, setSeaLevel] = useState(0);

  const tools = [
    { id: 'ocean', icon: <Droplets size={18} />, label: 'Global Ocean Plane' },
    { id: 'river', icon: <Cloud size={18} />, label: 'River Spring/Source' },
    { id: 'lake', icon: <Scan size={18} />, label: 'Lake Volume Mask' },
    { id: 'erosion', icon: <Waves size={18} />, label: 'Hydraulic Erosion Simulation' },
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
                  activeTool === tool.id ? 'bg-[#79c0ff]/20 text-[#79c0ff] border border-[#79c0ff]' : 'text-gray-400 hover:text-white hover:bg-[#2a2b3d]'
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
            <h2 className="font-bold text-[#79c0ff] flex items-center gap-2 text-lg">
               <Waves size={20} /> Fluid Dynamics
            </h2>
            <p className="text-xs text-gray-400 mt-1">Simulate oceans, rivers, and complex water physics over terrain.</p>
         </div>

         <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            
            {activeTool === 'ocean' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Ocean Plane Settings</h3>
                     
                     <div className="space-y-4">
                        <div>
                           <div className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>Global Sea Level (Z)</span>
                              <span className="text-white font-mono">{seaLevel}m</span>
                           </div>
                           <input 
                              type="range" 
                              min="-100" max="500" step="1"
                              value={seaLevel} 
                              onChange={e => setSeaLevel(parseInt(e.target.value))}
                              className="w-full accent-[#79c0ff]" 
                           />
                        </div>
                        
                        <div>
                           <label className="text-xs text-gray-400 mb-2 block">Water Preset (Shader)</label>
                           <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded px-3 py-2 text-sm text-white">
                              <option>Tropical Cyan (Clear)</option>
                              <option>Deep Atlantic (Dark)</option>
                              <option>Murky Swamp (Green)</option>
                              <option>Frozen Ice Sheet</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  <div>
                     <h3 className="text-xs font-bold text-[#79c0ff] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1 flex items-center gap-2">
                        <Activity size={14} /> Surface Physics
                     </h3>
                     <div className="space-y-4">
                        <div>
                           <div className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>Wave Amplitude</span>
                              <span className="text-white font-mono">1.2m</span>
                           </div>
                           <input type="range" min="0" max="100" defaultValue="40" className="w-full accent-[#79c0ff]" />
                        </div>
                        <div>
                           <div className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>Wind Reactivity</span>
                              <span className="text-white font-mono">High</span>
                           </div>
                           <input type="range" min="0" max="100" defaultValue="80" className="w-full accent-[#79c0ff]" />
                        </div>
                        
                        <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 mt-4">
                           <span className="text-xs text-gray-300">Foam at Shoreline</span>
                           <input type="checkbox" defaultChecked className="accent-[#79c0ff]" />
                        </div>
                        <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2">
                           <span className="text-xs text-gray-300">Planar Reflections</span>
                           <input type="checkbox" defaultChecked className="accent-[#79c0ff]" />
                        </div>
                     </div>
                  </div>
               </div>
            )}
            
            {activeTool === 'erosion' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#e3b341] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Hydraulic Erosion Bake</h3>
                     <p className="text-xs text-gray-400 mb-4">Simulates rainfall and water flow over time to carve realistic valleys into the terrain mesh.</p>
                     
                     <div className="space-y-4">
                        <div>
                           <div className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>Simulation Iterations</span>
                              <span className="text-white font-mono">50,000</span>
                           </div>
                           <input type="range" min="1000" max="200000" defaultValue="50000" className="w-full accent-[#e3b341]" />
                        </div>
                        <div>
                           <div className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>Erosion Rate</span>
                              <span className="text-white font-mono">0.02</span>
                           </div>
                           <input type="range" min="1" max="100" defaultValue="20" className="w-full accent-[#e3b341]" />
                        </div>
                        <div>
                           <div className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>Deposition Rate</span>
                              <span className="text-white font-mono">0.05</span>
                           </div>
                           <input type="range" min="1" max="100" defaultValue="50" className="w-full accent-[#e3b341]" />
                        </div>
                     </div>
                     
                     <button className="w-full bg-[#e3b341]/10 hover:bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/30 py-3 rounded text-xs font-bold transition-colors flex justify-center items-center gap-2 mt-6 uppercase tracking-wider">
                        <Download size={16} /> Run GPU Simulation
                     </button>
                  </div>
               </div>
            )}

         </div>
      </div>

      {/* Main Canvas Area Placeholder */}
      <div className="flex-1 bg-[#050914] relative overflow-hidden flex flex-col items-center justify-center">
         
         <div className="absolute inset-0 opacity-10 bg-[url('https://transparenttextures.com/patterns/cubes.png')]"></div>
         
         {/* Animated Water Graphic */}
         <div className="relative w-full h-full max-w-2xl max-h-[600px] flex items-end justify-center">
             <div className="absolute top-10 left-10 p-4 bg-[#11111b]/80 border border-[#2a2b3d] rounded-lg shadow-2xl backdrop-blur z-20 max-w-sm">
                 <h4 className="text-[#79c0ff] font-bold flex items-center gap-2 mb-2"><Waves size={16} /> Fluid Solver Active</h4>
                 <div className="space-y-2 font-mono text-[10px] text-gray-400">
                     <div className="flex justify-between"><span>Compute Device:</span> <span className="text-white">GPU CUDA</span></div>
                     <div className="flex justify-between"><span>Grid Res:</span> <span className="text-white">1024x1024</span></div>
                     <div className="flex justify-between"><span>Particles:</span> <span className="text-white">2.4 Million</span></div>
                 </div>
             </div>

             {/* Sea Level Vis */}
             <div className="w-full relative flex items-center justify-center">
                 <div className="w-full h-[300px] border-t-2 border-[#79c0ff] bg-gradient-to-b from-[#79c0ff]/20 to-transparent relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-[200%] h-4 bg-gradient-to-b from-[#ffffff]/10 to-transparent opacity-50"></div>
                 </div>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0f] text-[#79c0ff] border border-[#79c0ff]/30 px-3 py-1 rounded font-mono text-xs shadow-lg">
                    SEA LEVEL = Z:{seaLevel}m
                 </div>
             </div>
         </div>

      </div>
    </div>
  );
}
