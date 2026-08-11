import React, { useState } from 'react';
import { Dices, Play, Settings, RefreshCw, Save, Layers, Mountain, Trees, Droplets, Map, CheckCircle2, Box, Eye, Cpu, Braces, Sparkles, AlertTriangle, Workflow, SlidersHorizontal, Share2, Shuffle } from 'lucide-react';

export default function MapPCGEditor() {
  const [seed, setSeed] = useState('8a4f9b2c-1049');
  const [activeTab, setActiveTab] = useState('generators');
  const [resolution, setResolution] = useState(1024);

  return (
    <div className="flex-1 h-full bg-[#11111b] flex flex-col text-white">
      {/* Header */}
      <div className="h-12 border-b border-[#2a2b3d] bg-[#161621] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2 text-[#58a6ff]">
          <Dices size={18} />
          <h2 className="font-bold text-sm">Advanced PCG Engine (Procedural Content Generation)</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0a0a0f] px-2 py-1 rounded border border-[#2a2b3d]">
            <span className="text-xs text-gray-400">Seed:</span>
            <input 
              type="text" 
              value={seed} 
              onChange={e => setSeed(e.target.value)} 
              className="bg-transparent border-none outline-none text-white font-mono text-xs w-32"
            />
            <button onClick={() => setSeed(Math.random().toString(36).substring(2, 10))} className="text-gray-400 hover:text-white">
              <Shuffle size={12} />
            </button>
          </div>
          <button className="flex items-center gap-2 bg-[#3fb950] hover:bg-[#2ea043] text-[#0a0a0f] px-3 py-1.5 rounded text-xs font-bold transition">
            <Play size={14} /> Generate World
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - PCG Modules */}
        <div className="w-64 border-r border-[#2a2b3d] bg-[#161621] flex flex-col">
          <div className="p-3 border-b border-[#2a2b3d]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">PCG Graph Modules</h3>
            <div className="flex flex-col gap-1">
              <button onClick={() => setActiveTab('generators')} className={`flex items-center gap-2 px-3 py-2 rounded text-xs transition ${activeTab === 'generators' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50' : 'text-gray-300 hover:bg-[#2a2b3d]'}`}>
                <Mountain size={14} /> Terrain Generators
              </button>
              <button onClick={() => setActiveTab('biomes')} className={`flex items-center gap-2 px-3 py-2 rounded text-xs transition ${activeTab === 'biomes' ? 'bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50' : 'text-gray-300 hover:bg-[#2a2b3d]'}`}>
                <Trees size={14} /> Biome Spawners
              </button>
              <button onClick={() => setActiveTab('erosion')} className={`flex items-center gap-2 px-3 py-2 rounded text-xs transition ${activeTab === 'erosion' ? 'bg-[#79c0ff]/20 text-[#79c0ff] border border-[#79c0ff]/50' : 'text-gray-300 hover:bg-[#2a2b3d]'}`}>
                <Droplets size={14} /> Erosion Simulation
              </button>
              <button onClick={() => setActiveTab('structures')} className={`flex items-center gap-2 px-3 py-2 rounded text-xs transition ${activeTab === 'structures' ? 'bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/50' : 'text-gray-300 hover:bg-[#2a2b3d]'}`}>
                <Box size={14} /> Structure Scatter
              </button>
              <button onClick={() => setActiveTab('rules')} className={`flex items-center gap-2 px-3 py-2 rounded text-xs transition ${activeTab === 'rules' ? 'bg-[#d2a8ff]/20 text-[#d2a8ff] border border-[#d2a8ff]/50' : 'text-gray-300 hover:bg-[#2a2b3d]'}`}>
                <Braces size={14} /> Rules & Logic
              </button>
            </div>
          </div>
          <div className="p-3 flex-1 overflow-y-auto">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Active Graph</h3>
             <div className="flex flex-col gap-2 relative">
                <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-[#2a2b3d]"></div>
                
                <div className="flex gap-2 relative z-10">
                   <div className="w-6 h-6 rounded-full bg-[#161621] border border-[#2a2b3d] flex items-center justify-center text-gray-400 mt-1 shrink-0">1</div>
                   <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-2 flex-1">
                      <div className="text-xs font-bold text-white flex justify-between">Perlin Noise Base <span>100%</span></div>
                      <div className="text-[10px] text-gray-400 mt-1">Scale: 500, Octaves: 8</div>
                   </div>
                </div>
                
                <div className="flex gap-2 relative z-10">
                   <div className="w-6 h-6 rounded-full bg-[#161621] border border-[#2a2b3d] flex items-center justify-center text-gray-400 mt-1 shrink-0">2</div>
                   <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-2 flex-1">
                      <div className="text-xs font-bold text-white flex justify-between">Voronoi Cells <span>80%</span></div>
                      <div className="text-[10px] text-gray-400 mt-1">Mode: Distance, Jitter: 1.0</div>
                   </div>
                </div>

                <div className="flex gap-2 relative z-10">
                   <div className="w-6 h-6 rounded-full bg-[#161621] border border-[#79c0ff] flex items-center justify-center text-[#79c0ff] mt-1 shrink-0">3</div>
                   <div className="bg-[#1e1e2d] border border-[#79c0ff]/50 shadow-[0_0_10px_rgba(121,192,255,0.1)] rounded p-2 flex-1">
                      <div className="text-xs font-bold text-[#79c0ff] flex justify-between">Hydraulic Erosion <span>Active</span></div>
                      <div className="text-[10px] text-gray-400 mt-1">Droplets: 1M, Iterations: 50</div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-[#0a0a0f]">
           {activeTab === 'generators' && (
              <div className="p-6">
                 <h2 className="text-xl font-bold text-white mb-4">Terrain Generators</h2>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#161621] border border-[#2a2b3d] rounded-lg p-4">
                       <h3 className="font-bold text-[#58a6ff] mb-2 flex items-center gap-2"><Mountain size={16}/> Base Shape Generation</h3>
                       
                       <div className="space-y-4 mt-4">
                          <div>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Algorithm</span>
                             </label>
                             <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded px-3 py-2 text-sm text-white">
                                <option>Simplex Noise (Smooth)</option>
                                <option>Perlin Noise (Classic)</option>
                                <option>Voronoi (Ridged/Cellular)</option>
                                <option>Diamond-Square (Fractal)</option>
                             </select>
                          </div>
                          <div>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Scale (Feature Size)</span>
                                <span className="text-[#58a6ff]">2500m</span>
                             </label>
                             <input type="range" className="w-full" min="10" max="10000" defaultValue="2500" />
                          </div>
                          <div>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Octaves (Detail Level)</span>
                                <span className="text-[#58a6ff]">8</span>
                             </label>
                             <input type="range" className="w-full" min="1" max="12" defaultValue="8" />
                          </div>
                          <div>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Persistence (Roughness)</span>
                                <span className="text-[#58a6ff]">0.5</span>
                             </label>
                             <input type="range" className="w-full" min="0.1" max="1" step="0.05" defaultValue="0.5" />
                          </div>
                          <div>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Lacunarity (Frequency Multiplier)</span>
                                <span className="text-[#58a6ff]">2.0</span>
                             </label>
                             <input type="range" className="w-full" min="1" max="4" step="0.1" defaultValue="2.0" />
                          </div>
                       </div>
                    </div>

                    <div className="bg-[#161621] border border-[#2a2b3d] rounded-lg p-4">
                       <h3 className="font-bold text-[#d2a8ff] mb-2 flex items-center gap-2"><Layers size={16}/> Modifiers & Masks</h3>
                       
                       <div className="space-y-4 mt-4">
                          <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-3">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-white">Terracing</span>
                                <input type="checkbox" defaultChecked className="accent-[#d2a8ff]" />
                             </div>
                             <p className="text-xs text-gray-400 mb-3">Creates stepped plateaus, ideal for canyon or rice-paddy looks.</p>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Terrace Count</span>
                                <span className="text-[#d2a8ff]">12</span>
                             </label>
                             <input type="range" className="w-full" min="2" max="50" defaultValue="12" />
                          </div>

                          <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-3">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-white">Island Mask (Radial)</span>
                                <input type="checkbox" defaultChecked className="accent-[#d2a8ff]" />
                             </div>
                             <p className="text-xs text-gray-400 mb-3">Forces edges to ocean level based on distance from center.</p>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Falloff Curve</span>
                                <span className="text-[#d2a8ff]">Exponential</span>
                             </label>
                             <select className="w-full bg-[#161621] border border-[#2a2b3d] rounded px-2 py-1 text-xs text-white">
                                <option>Linear</option>
                                <option>Exponential</option>
                                <option>Sigmoid</option>
                             </select>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'erosion' && (
              <div className="p-6">
                 <h2 className="text-xl font-bold text-white mb-4">Erosion Simulation</h2>
                 <p className="text-gray-400 text-sm mb-6">Physically based simulations to age the terrain and create realistic ridges, valleys, and riverbeds.</p>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#161621] border border-[#79c0ff]/50 rounded-lg p-4 shadow-[0_0_15px_rgba(121,192,255,0.05)]">
                       <h3 className="font-bold text-[#79c0ff] mb-2 flex items-center gap-2"><Droplets size={16}/> Hydraulic Erosion</h3>
                       
                       <div className="space-y-4 mt-4">
                          <div>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Droplet Count (Simulation Particles)</span>
                                <span className="text-[#79c0ff]">2,500,000</span>
                             </label>
                             <input type="range" className="w-full" min="10000" max="10000000" defaultValue="2500000" />
                          </div>
                          <div>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Erosion Rate</span>
                                <span className="text-[#79c0ff]">0.12</span>
                             </label>
                             <input type="range" className="w-full" min="0.01" max="1" step="0.01" defaultValue="0.12" />
                          </div>
                          <div>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Deposition Rate</span>
                                <span className="text-[#79c0ff]">0.08</span>
                             </label>
                             <input type="range" className="w-full" min="0.01" max="1" step="0.01" defaultValue="0.08" />
                          </div>
                          <div>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Evaporation Speed</span>
                                <span className="text-[#79c0ff]">0.02</span>
                             </label>
                             <input type="range" className="w-full" min="0.001" max="0.1" step="0.001" defaultValue="0.02" />
                          </div>
                          <button className="w-full mt-4 bg-[#79c0ff]/10 hover:bg-[#79c0ff]/20 text-[#79c0ff] border border-[#79c0ff]/30 rounded py-2 text-sm font-bold transition flex justify-center items-center gap-2">
                             <Play size={16} /> Run Hydraulic Simulation
                          </button>
                       </div>
                    </div>

                    <div className="bg-[#161621] border border-[#ff7b72]/30 rounded-lg p-4">
                       <h3 className="font-bold text-[#ff7b72] mb-2 flex items-center gap-2"><Mountain size={16}/> Thermal Erosion</h3>
                       <p className="text-xs text-gray-400 mb-4">Simulates rock tumbling down steep inclines (talus slopes) to smooth out sheer cliffs.</p>
                       <div className="space-y-4">
                          <div>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Talus Angle (Max steepness)</span>
                                <span className="text-[#ff7b72]">45°</span>
                             </label>
                             <input type="range" className="w-full" min="10" max="80" defaultValue="45" />
                          </div>
                          <div>
                             <label className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Iterations</span>
                                <span className="text-[#ff7b72]">15</span>
                             </label>
                             <input type="range" className="w-full" min="1" max="50" defaultValue="15" />
                          </div>
                          <button className="w-full mt-4 bg-[#ff7b72]/10 hover:bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/30 rounded py-2 text-sm font-bold transition flex justify-center items-center gap-2">
                             <Play size={16} /> Run Thermal Simulation
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'biomes' && (
              <div className="p-6">
                 <h2 className="text-xl font-bold text-white mb-4">Biome Ruleset Spawner</h2>
                 <div className="bg-[#161621] border border-[#2a2b3d] rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-[#0a0a0f] border-b border-[#2a2b3d]">
                             <th className="p-3 text-xs font-bold text-gray-400">Biome Name</th>
                             <th className="p-3 text-xs font-bold text-gray-400">Elevation Range</th>
                             <th className="p-3 text-xs font-bold text-gray-400">Moisture Range</th>
                             <th className="p-3 text-xs font-bold text-gray-400">Temp Range</th>
                             <th className="p-3 text-xs font-bold text-gray-400">Assets</th>
                          </tr>
                       </thead>
                       <tbody className="text-sm">
                          <tr className="border-b border-[#2a2b3d] hover:bg-[#2a2b3d]/50">
                             <td className="p-3 font-bold text-[#3fb950] flex items-center gap-2"><Trees size={16} /> Dense Forest</td>
                             <td className="p-3 text-gray-300">0.2 - 0.6</td>
                             <td className="p-3 text-gray-300">0.5 - 1.0</td>
                             <td className="p-3 text-gray-300">10°C - 25°C</td>
                             <td className="p-3 text-gray-400">Pine, Oak, Ferns</td>
                          </tr>
                          <tr className="border-b border-[#2a2b3d] hover:bg-[#2a2b3d]/50">
                             <td className="p-3 font-bold text-[#e3b341] flex items-center gap-2"><Mountain size={16} /> Desert Dunes</td>
                             <td className="p-3 text-gray-300">0.1 - 0.5</td>
                             <td className="p-3 text-gray-300">0.0 - 0.2</td>
                             <td className="p-3 text-gray-300">30°C - 50°C</td>
                             <td className="p-3 text-gray-400">Cactus, Dead Bush</td>
                          </tr>
                          <tr className="border-b border-[#2a2b3d] hover:bg-[#2a2b3d]/50">
                             <td className="p-3 font-bold text-[#79c0ff] flex items-center gap-2"><Sparkles size={16} /> Snow Peaks</td>
                             <td className="p-3 text-gray-300">0.7 - 1.0</td>
                             <td className="p-3 text-gray-300">0.0 - 1.0</td>
                             <td className="p-3 text-gray-300">-20°C - 0°C</td>
                             <td className="p-3 text-gray-400">Snow, Ice Rocks</td>
                          </tr>
                          <tr className="border-b border-[#2a2b3d] hover:bg-[#2a2b3d]/50">
                             <td className="p-3 font-bold text-[#ff7b72] flex items-center gap-2"><AlertTriangle size={16} /> Volcanic</td>
                             <td className="p-3 text-gray-300">0.3 - 0.8</td>
                             <td className="p-3 text-gray-300">0.0 - 0.3</td>
                             <td className="p-3 text-gray-300">60°C - 100°C</td>
                             <td className="p-3 text-gray-400">Lava, Basalt, Ash</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
                 <button className="mt-4 bg-[#2a2b3d] hover:bg-[#3b3d54] text-white px-4 py-2 rounded text-sm font-bold">
                    + Add Custom Biome Rule
                 </button>
              </div>
           )}

        </div>
      </div>
    </div>
  );
}
