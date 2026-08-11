import React, { useState } from 'react';
import { Brush, Mountain, Droplets, Thermometer, Box, Network, Cpu, Download, Leaf, Trees, Sprout } from 'lucide-react';

export default function MapBiomeEditor() {
  const [activeTool, setActiveTool] = useState('brush');
  const [biomeElevation, setBiomeElevation] = useState(50);
  const [biomeMoisture, setBiomeMoisture] = useState(50);
  const [biomeTemperature, setBiomeTemperature] = useState(50);
  const [activeBiomeType, setActiveBiomeType] = useState('AI_AUTO');

  const tools = [
    { id: 'brush', icon: <Brush size={18} />, label: 'AI Biome Brush' },
    { id: 'flora', icon: <Leaf size={18} />, label: 'Foliage Painter' },
    { id: 'rules', icon: <Network size={18} />, label: 'Ecosystem Rules' },
    { id: 'generate', icon: <Cpu size={18} />, label: 'Global Simulation' },
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
                  activeTool === tool.id ? 'bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]' : 'text-gray-400 hover:text-white hover:bg-[#2a2b3d]'
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
            <h2 className="font-bold text-[#ff9900] flex items-center gap-2 text-lg">
               <Sprout size={20} /> Ecosystems
            </h2>
            <p className="text-xs text-gray-400 mt-1">Simulate biological spread, climate mapping, and flora density.</p>
         </div>

         <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            
            {activeTool === 'brush' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Climate Parameters</h3>
                     
                     <div className="space-y-4">
                        <div>
                           <label className="text-xs text-[#c9d1d9] mb-1 block">Elevation Override (Altitude)</label>
                           <div className="flex items-center gap-2 mb-1">
                              <Mountain size={14} className="text-gray-400"/>
                              <input type="range" min="0" max="100" value={biomeElevation} onChange={e => setBiomeElevation(Number(e.target.value))} className="w-full accent-[#ff9900]" />
                              <span className="text-xs text-white font-mono w-6 text-right">{biomeElevation}</span>
                           </div>
                        </div>
                        <div>
                           <label className="text-xs text-[#c9d1d9] mb-1 block">Atmospheric Moisture</label>
                           <div className="flex items-center gap-2 mb-1">
                              <Droplets size={14} className="text-blue-400"/>
                              <input type="range" min="0" max="100" value={biomeMoisture} onChange={e => setBiomeMoisture(Number(e.target.value))} className="w-full accent-blue-500" />
                              <span className="text-xs text-white font-mono w-6 text-right">{biomeMoisture}</span>
                           </div>
                        </div>
                        <div>
                           <label className="text-xs text-[#c9d1d9] mb-1 block">Ambient Temperature</label>
                           <div className="flex items-center gap-2 mb-1">
                              <Thermometer size={14} className="text-red-400"/>
                              <input type="range" min="0" max="100" value={biomeTemperature} onChange={e => setBiomeTemperature(Number(e.target.value))} className="w-full accent-red-500" />
                              <span className="text-xs text-white font-mono w-6 text-right">{biomeTemperature}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded mt-2">
                     <h3 className="text-xs font-bold text-white mb-2 flex justify-between">
                        Predicted Biome Result
                        {activeBiomeType === 'AI_AUTO' && (
                           <span className="text-[9px] text-[#3fb950] border border-[#3fb950]/50 bg-[#3fb950]/10 px-1 rounded flex items-center">
                              {biomeElevation < 30 && biomeMoisture > 70 ? 'OCEAN' : 
                               biomeTemperature < 30 ? 'TUNDRA' : 
                               biomeTemperature > 70 && biomeMoisture < 30 ? 'DESERT' : 
                               biomeTemperature > 70 && biomeMoisture > 70 ? 'JUNGLE' : 
                               'FOREST'}
                           </span>
                        )}
                     </h3>
                     <select
                        value={activeBiomeType}
                        onChange={(e) => setActiveBiomeType(e.target.value)}
                        className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded px-2 py-1.5 text-xs text-white font-bold mb-3"
                     >
                        <option value="AI_AUTO">🤖 AI Auto-Detect via Params</option>
                        <option value="TUNDRA">❄️ Tundra (Cold / Dry)</option>
                        <option value="DESERT">🏜️ Desert (Hot / Dry)</option>
                        <option value="FOREST">🌲 Forest (Balanced)</option>
                        <option value="JUNGLE">🌴 Jungle (Hot / Wet)</option>
                        <option value="OCEAN">🌊 Deep Ocean (Low Elev / Wet)</option>
                     </select>
                     
                     <div className="flex flex-col gap-2 border-t border-[#2a2b3d] pt-3">
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" defaultChecked className="accent-[#ff9900] w-3 h-3" />
                           <span className="text-[10px] text-[#8b949e] group-hover:text-white transition">Procedural Flora Seed (Density)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" defaultChecked className="accent-[#ff9900] w-3 h-3" />
                           <span className="text-[10px] text-[#8b949e] group-hover:text-white transition">Hydrological Erosion Parsing</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" className="accent-[#ff9900] w-3 h-3" />
                           <span className="text-[10px] text-[#8b949e] group-hover:text-white transition">Tectonic Plate Collision</span>
                        </label>
                     </div>
                  </div>
                  
                  <button className="w-full bg-[#ff9900]/10 hover:bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/30 py-3 rounded text-xs font-bold transition-colors flex justify-center items-center gap-2 mt-2 uppercase tracking-wider">
                     <Brush size={16} /> Enable Painting
                  </button>
               </div>
            )}
            
            {activeTool === 'flora' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#3fb950] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Foliage Assets</h3>
                     
                     <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#1e1e2d] border border-[#3fb950] rounded p-2 flex flex-col items-center justify-center gap-2 cursor-pointer">
                           <Trees size={24} className="text-[#3fb950]" />
                           <span className="text-[9px] text-white">Pine Tree_01</span>
                        </div>
                        <div className="bg-[#0a0a0f] border border-[#2a2b3d] hover:border-[#3fb950]/50 rounded p-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                           <Leaf size={24} className="text-gray-500" />
                           <span className="text-[9px] text-gray-400">Fern_Large_04</span>
                        </div>
                        <div className="bg-[#0a0a0f] border border-[#2a2b3d] hover:border-[#3fb950]/50 rounded p-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                           <Sprout size={24} className="text-gray-500" />
                           <span className="text-[9px] text-gray-400">Grass_Clump</span>
                        </div>
                        <div className="bg-[#0a0a0f] border border-[#2a2b3d] hover:border-[#3fb950]/50 rounded p-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors flex-col">
                           <Box size={24} className="text-gray-500" />
                           <span className="text-[9px] text-gray-400">+ Add Asset</span>
                        </div>
                     </div>
                     
                     <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-xs text-gray-400">
                           <span>Brush Density</span>
                           <span className="text-white font-mono">15/m²</span>
                        </div>
                        <input type="range" min="1" max="100" defaultValue="15" className="w-full accent-[#3fb950]" />
                        
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                           <span>Random Scale Variation</span>
                           <span className="text-white font-mono">±20%</span>
                        </div>
                        <input type="range" min="0" max="50" defaultValue="20" className="w-full accent-[#3fb950]" />
                     </div>
                  </div>
               </div>
            )}

         </div>
      </div>

      {/* Main Canvas Area Placeholder */}
      <div className="flex-1 bg-[#0a0a0f] relative overflow-hidden flex flex-col items-center justify-center">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ff9900 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         
         <div className="w-full h-full max-w-4xl max-h-[800px] relative">
            <div className="absolute top-8 left-8 bg-[#161621]/90 backdrop-blur border border-[#2a2b3d] p-3 rounded-lg shadow-2xl z-20">
               <h3 className="text-[#ff9900] text-xs font-bold mb-2">CLIMATE MAP OVERLAY</h3>
               <div className="flex flex-col gap-1 text-[10px] font-mono text-gray-400">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500/50 rounded"></div> Temp Isobars</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500/50 rounded"></div> Moisture Map</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#3fb950]/50 rounded"></div> Flora Density</div>
               </div>
            </div>
            
            {/* Visualizer */}
            <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 1000 800" preserveAspectRatio="none">
               {/* Temp gradient overlay */}
               <defs>
                  <linearGradient id="temp" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#ff0000" stopOpacity="0.1" />
                     <stop offset="50%" stopColor="#ffff00" stopOpacity="0.05" />
                     <stop offset="100%" stopColor="#0000ff" stopOpacity="0.15" />
                  </linearGradient>
               </defs>
               <rect x="0" y="0" width="1000" height="800" fill="url(#temp)" />
               
               {/* Isobars */}
               <path d="M 0 200 Q 250 100 500 300 T 1000 400" fill="none" stroke="#ff9900" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
               <path d="M 0 400 Q 250 300 500 500 T 1000 600" fill="none" stroke="#ff9900" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
            </svg>
            
            {activeTool === 'brush' && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-[#ff9900] rounded-full flex items-center justify-center animate-pulse bg-[#ff9900]/10 pointer-events-none">
                  <div className="w-2 h-2 bg-[#ff9900] rounded-full"></div>
               </div>
            )}
         </div>

      </div>
    </div>
  );
}
