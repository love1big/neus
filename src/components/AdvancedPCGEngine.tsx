import React, { useState } from "react";
import { 
  Mountain, Trees, Map, Workflow, Sliders, BoxSelect, Layers, Waves, Droplet, Wind, Network, Settings, Database, Play, Pause, Save, Grid3X3, CheckCircle2, Activity} from "lucide-react";

export default function AdvancedPCGEngine() {
  const [activeTab, setActiveTab] = useState("terrain");

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#238636]/20 text-[#2ea043] rounded-lg border border-[#2ea043]/30">
            <Workflow size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Advanced PCG Graph Engine</h1>
            <div className="text-[10px] text-[#8b949e]">Procedural World Generation & Rule Sets</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-xs transition-colors">
            <Save size={14} /> Save Graph
          </button>
          <button className="px-3 py-1.5 flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white border border-transparent rounded text-xs transition-colors">
            <Play size={14} /> Generate World
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 flex flex-col items-center py-4 border-r border-[#30363d] bg-[#161b22] gap-4 z-10">
          <button onClick={() => setActiveTab("terrain")} className={`p-2 rounded-lg transition-colors ${activeTab === 'terrain' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30' : 'text-[#8b949e] hover:text-white'}`} title="Terrain Erosion & Shape">
            <Mountain size={20} />
          </button>
          <button onClick={() => setActiveTab("biomes")} className={`p-2 rounded-lg transition-colors ${activeTab === 'biomes' ? 'bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/30' : 'text-[#8b949e] hover:text-white'}`} title="Biome & Flora Distribution">
            <Trees size={20} />
          </button>
          <button onClick={() => setActiveTab("splines")} className={`p-2 rounded-lg transition-colors ${activeTab === 'splines' ? 'bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30' : 'text-[#8b949e] hover:text-white'}`} title="Spline Paths (Rivers/Roads)">
            <Network size={20} />
          </button>
          <button onClick={() => setActiveTab("rules")} className={`p-2 rounded-lg transition-colors ${activeTab === 'rules' ? 'bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/30' : 'text-[#8b949e] hover:text-white'}`} title="Rule-based Placement">
            <Sliders size={20} />
          </button>
          <button onClick={() => setActiveTab("city")} className={`p-2 rounded-lg transition-colors ${activeTab === 'city' ? 'bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/30' : 'text-[#8b949e] hover:text-white'}`} title="City & Road Generator">
            <Map size={20} />
          </button>
          <button onClick={() => setActiveTab("dungeon")} className={`p-2 rounded-lg transition-colors ${activeTab === 'dungeon' ? 'bg-[#a5d6ff]/20 text-[#a5d6ff] border border-[#a5d6ff]/30' : 'text-[#8b949e] hover:text-white'}`} title="Dungeon Architect">
            <BoxSelect size={20} />
          </button>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col bg-[#010409] relative overflow-hidden">
          {/* Mock Node Graph Area */}
          <div className="absolute inset-0 pattern-grid-lg text-[#30363d]/30 opacity-50 pointer-events-none"></div>
          
          <div className="flex-1 p-6 z-0 overflow-y-auto">
            {activeTab === "terrain" && (
              <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto">
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-lg">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Wind size={16} className="text-[#58a6ff]" /> Hydraulic & Thermal Erosion</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[#8b949e] flex justify-between"><span>Rainfall Rate</span> <span>850 mm/yr</span></label>
                      <input type="range" className="w-full mt-1 accent-[#58a6ff]" min="0" max="1000" defaultValue="850" />
                    </div>
                    <div>
                      <label className="text-xs text-[#8b949e] flex justify-between"><span>Evaporation Factor</span> <span>0.45</span></label>
                      <input type="range" className="w-full mt-1 accent-[#58a6ff]" min="0" max="1" step="0.01" defaultValue="0.45" />
                    </div>
                    <div>
                      <label className="text-xs text-[#8b949e] flex justify-between"><span>Thermal Weathering Angle</span> <span>35°</span></label>
                      <input type="range" className="w-full mt-1 accent-[#58a6ff]" min="0" max="90" defaultValue="35" />
                    </div>
                    <div className="pt-2">
                      <button className="w-full py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-xs text-[#c9d1d9] transition-colors">Simulate 1000 Years</button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-lg">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Map size={16} className="text-[#bc8cff]" /> Heightmap Composition</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-[#0d1117] border border-[#30363d] rounded text-xs">
                      <span className="flex items-center gap-2"><Layers size={14}/> Voronoi Cell Noise</span>
                      <span className="text-[#8b949e]">Multiply</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#0d1117] border border-[#30363d] rounded text-xs">
                      <span className="flex items-center gap-2"><Layers size={14}/> Ridged Multi-Fractal</span>
                      <span className="text-[#8b949e]">Add</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#0d1117] border border-[#30363d] rounded text-xs">
                      <span className="flex items-center gap-2"><Layers size={14}/> Terrace Filter</span>
                      <span className="text-[#8b949e]">Clamp</span>
                    </div>
                    <button className="w-full py-2 border border-dashed border-[#30363d] text-[#8b949e] rounded text-xs hover:border-[#8b949e] hover:text-[#c9d1d9] transition-colors">+ Add Noise Layer</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "biomes" && (
              <div className="max-w-5xl mx-auto space-y-6">
                 <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-lg">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Trees size={16} className="text-[#3fb950]" /> Density & Instance Spawning</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#0d1117] border border-[#30363d] rounded p-3">
                      <div className="text-sm font-bold text-white mb-1">Boreal Forest</div>
                      <div className="text-xs text-[#8b949e] mb-3">Density: High • Alt: 200-800m</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px]"><span className="text-[#c9d1d9]">Pine Trees (SM_Pine01)</span> <span className="text-[#3fb950]">65%</span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-[#c9d1d9]">Rocks (SM_RockMoss)</span> <span className="text-[#3fb950]">20%</span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-[#c9d1d9]">Ferns (SM_FernGroup)</span> <span className="text-[#3fb950]">15%</span></div>
                      </div>
                    </div>
                    <div className="bg-[#0d1117] border border-[#30363d] rounded p-3">
                      <div className="text-sm font-bold text-white mb-1">Alpine Tundra</div>
                      <div className="text-xs text-[#8b949e] mb-3">Density: Sparse • Alt: 1200m+</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px]"><span className="text-[#c9d1d9]">Snow Rocks (SM_SnowRk)</span> <span className="text-[#58a6ff]">80%</span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-[#c9d1d9]">Dead Shrubs (SM_Shrub)</span> <span className="text-[#58a6ff]">20%</span></div>
                      </div>
                    </div>
                    <div className="border border-dashed border-[#30363d] rounded p-3 flex items-center justify-center cursor-pointer hover:border-[#8b949e] hover:bg-[#161b22] transition-colors">
                      <span className="text-xs text-[#8b949e]">+ Create Biome Profile</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-lg">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Grid3X3 size={16} className="text-[#bc8cff]" /> Spatial Grid Partitioning (Octree)</h3>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="text-xs text-[#8b949e] flex justify-between"><span>Grid Cell Size</span> <span>1024x1024</span></label>
                        <select defaultValue="1024x1024 Units" className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 text-xs text-white mt-1">
                          <option>512x512 Units</option>
                          <option>1024x1024 Units</option>
                          <option>2048x2048 Units</option>
                        </select>
                      </div>
                      <div>
                         <label className="text-xs text-[#8b949e] flex justify-between"><span>Max Instances Per Cell</span> <span>15,000</span></label>
                         <input type="range" className="w-full mt-1 accent-[#bc8cff]" min="1000" max="50000" defaultValue="15000" />
                      </div>
                    </div>
                    <div className="w-48 h-24 bg-[#0d1117] border border-[#30363d] rounded p-2 flex items-center justify-center">
                       <div className="text-[10px] text-[#8b949e] text-center">Hierarchical Instanced Static Mesh (HISM) Preview</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "splines" && (
               <div className="max-w-3xl mx-auto flex flex-col items-center justify-center h-full text-center">
                 <Network size={48} className="text-[#bc8cff] mb-4 opacity-50" />
                 <h2 className="text-xl font-bold text-white mb-2">Procedural Spline Generation</h2>
                 <p className="text-[#8b949e] text-sm mb-6 max-w-md">Define pathfinding rules for automatic generation of rivers, road networks, and cliff ledges based on terrain slope and curvature.</p>
                 <button className="px-4 py-2 bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 rounded-lg hover:bg-[#bc8cff]/30 transition-colors">
                   + Add Spline Generator Node
                 </button>
               </div>
            )}

            {activeTab === "rules" && (
               <div className="max-w-3xl mx-auto flex flex-col items-center justify-center h-full text-center">
                 <Sliders size={48} className="text-[#e3b341] mb-4 opacity-50" />
                 <h2 className="text-xl font-bold text-white mb-2">Rule-Based Placement Logic</h2>
                 <p className="text-[#8b949e] text-sm mb-6 max-w-md">Create complex boolean logic for spawning structures (e.g. "Spawn village if slope &lt; 10deg AND distance_to_river &lt; 50m").</p>
                 <button className="px-4 py-2 bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/30 rounded-lg hover:bg-[#e3b341]/30 transition-colors">
                   + Add Logic Rule
                 </button>
               </div>
            )}

            {activeTab === "city" && (
              <div className="max-w-5xl mx-auto space-y-6">
                 <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-lg">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Map size={16} className="text-[#ff7b72]" /> City & Road Network Generator</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-[#8b949e] flex justify-between"><span>City Style Theme</span></label>
                        <select className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-xs text-white mt-1">
                          <option>Cyberpunk (High-density, vertical)</option>
                          <option>Modern Grid (American style)</option>
                          <option>European Old Town (Radial, organic)</option>
                          <option>Sci-Fi Mega-structure</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-xs text-[#8b949e] flex justify-between"><span>Road Network Density</span> <span>75%</span></label>
                        <input type="range" className="w-full mt-1 accent-[#ff7b72]" min="0" max="100" defaultValue="75" />
                      </div>
                      
                      <div>
                        <label className="text-xs text-[#8b949e] flex justify-between"><span>Building Verticality (Max Height)</span> <span>High</span></label>
                        <input type="range" className="w-full mt-1 accent-[#ff7b72]" min="1" max="10" defaultValue="8" />
                      </div>

                      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#30363d]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#c9d1d9]">Auto-generate Streetlights & Props</span>
                          <input type="checkbox" defaultChecked className="accent-[#ff7b72]" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#c9d1d9]">Zoning (Commercial, Residential, Industrial)</span>
                          <input type="checkbox" defaultChecked className="accent-[#ff7b72]" />
                        </div>
                      </div>

                      <button className="w-full py-2 bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/30 rounded text-xs hover:bg-[#ff7b72]/30 transition-colors mt-4">
                        Generate City Block
                      </button>
                    </div>

                    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 pattern-grid-lg text-[#30363d]/50 pointer-events-none"></div>
                       <div className="z-10 text-center">
                         <div className="w-48 h-32 border-2 border-dashed border-[#ff7b72]/50 rounded mb-4 relative">
                           {/* Mock city generation preview */}
                           <div className="absolute inset-2 border-b-2 border-r-2 border-[#58a6ff]/40"></div>
                           <div className="absolute inset-4 border-t-2 border-l-2 border-[#3fb950]/40"></div>
                           <div className="absolute bottom-2 left-2 w-4 h-12 bg-[#c9d1d9]/20"></div>
                           <div className="absolute top-2 right-2 w-8 h-8 bg-[#c9d1d9]/20"></div>
                           <div className="absolute bottom-4 right-4 w-6 h-16 bg-[#c9d1d9]/20"></div>
                         </div>
                         <p className="text-xs text-[#8b949e]">Draw boundaries on the map to define the city limits. Directional arrows dictate primary traffic flow.</p>
                       </div>
                    </div>
                  </div>
                 </div>
              </div>
            )}

            {activeTab === "dungeon" && (
              <div className="max-w-5xl mx-auto space-y-6">
                 <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-lg">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><BoxSelect size={16} className="text-[#a5d6ff]" /> Dungeon Architect & Playability Guarantee</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-[#8b949e] flex justify-between"><span>Generation Algorithm</span></label>
                        <select className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-xs text-white mt-1">
                          <option>Cellular Automata (Cave-like)</option>
                          <option>BSP Tree (Rooms & Corridors)</option>
                          <option>Random Walk (Organic Maze)</option>
                          <option>Grid-based Template Stitching</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-[#8b949e] flex justify-between"><span>Room Count</span> <span>15-25</span></label>
                          <input type="range" className="w-full mt-1 accent-[#a5d6ff]" min="5" max="50" defaultValue="20" />
                        </div>
                        <div>
                          <label className="text-xs text-[#8b949e] flex justify-between"><span>Branching Factor</span> <span>0.6</span></label>
                          <input type="range" className="w-full mt-1 accent-[#a5d6ff]" min="0" max="1" step="0.1" defaultValue="0.6" />
                        </div>
                      </div>

                      <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                        <div className="text-xs font-bold text-white mb-2">Entity Spawning Logic</div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center bg-[#161b22] p-2 rounded text-xs border border-[#30363d]">
                            <span className="text-[#c9d1d9]">Enemy Spawns</span>
                            <span className="text-[#a5d6ff]">Avg 3 per Room</span>
                          </div>
                          <div className="flex justify-between items-center bg-[#161b22] p-2 rounded text-xs border border-[#30363d]">
                            <span className="text-[#c9d1d9]">Treasure Chests</span>
                            <span className="text-[#e3b341]">1 per Dead End</span>
                          </div>
                          <div className="flex justify-between items-center bg-[#161b22] p-2 rounded text-xs border border-[#30363d]">
                            <span className="text-[#c9d1d9]">Boss Room / Exit</span>
                            <span className="text-[#ff7b72]">Furthest from Start</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                         <div className="flex items-center justify-between mb-3">
                           <span className="text-sm font-bold text-white flex items-center gap-2"><Network size={16} className="text-[#3fb950]"/> Playability Guarantee</span>
                           <span className="text-[10px] px-2 py-1 bg-[#3fb950]/20 text-[#3fb950] rounded-full border border-[#3fb950]/30">AI Simulation</span>
                         </div>
                         <p className="text-xs text-[#8b949e] mb-4">
                           Runs an AI pathfinding simulation to verify that the start point can reach the boss room/exit, ensuring all necessary keys and switches are accessible in the correct order.
                         </p>
                         
                         <div className="space-y-2 text-xs">
                           <div className="flex items-center gap-2 text-[#3fb950]">
                             <CheckCircle2 size={14} /> <span>Path to Exit: Validated</span>
                           </div>
                           <div className="flex items-center gap-2 text-[#3fb950]">
                             <CheckCircle2 size={14} /> <span>Key/Lock Logic: Solvable</span>
                           </div>
                           <div className="flex items-center gap-2 text-[#8b949e]">
                             <Activity size={14} /> <span>Combat Balance: Simulating...</span>
                           </div>
                         </div>
                         
                         <button className="w-full py-2 bg-[#21262d] text-[#c9d1d9] border border-[#30363d] rounded text-xs hover:bg-[#30363d] transition-colors mt-4">
                           Run Full Simulation
                         </button>
                      </div>
                      
                      <button className="w-full py-3 bg-[#a5d6ff]/20 text-[#a5d6ff] font-bold border border-[#a5d6ff]/30 rounded text-sm hover:bg-[#a5d6ff]/30 transition-colors">
                        Generate Dungeon Seed
                      </button>
                    </div>
                  </div>
                 </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Details Panel */}
        <div className="w-72 bg-[#161b22] border-l border-[#30363d] flex flex-col">
          <div className="p-3 border-b border-[#30363d] font-bold text-xs text-white uppercase tracking-wider">
            Node Properties
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="text-xs text-[#8b949e] text-center mt-10">Select a node in the graph to edit properties.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
