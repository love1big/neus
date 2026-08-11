import React, { useState } from "react";
import { 
  Flame, Wind, Droplet, Target, Maximize, Sliders, Settings, Activity, Server, Zap, HardDrive, Cpu} from "lucide-react";

export default function ChaosPhysicsFluidEngine() {
  const [activeTab, setActiveTab] = useState("destruction");

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#f85149]/20 text-[#f85149] rounded-lg border border-[#f85149]/30">
            <Flame size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Chaos Physics & Fluid Dynamics</h1>
            <div className="text-[10px] text-[#8b949e]">Cinematic Destruction, Volumetrics & Fluid Solvers</div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 flex items-center gap-2 bg-[#21262d] border border-[#30363d] rounded text-xs text-[#8b949e]">
            <Cpu size={14} className="text-[#e3b341]"/> GPU Compute: <span className="text-white">Active</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 flex flex-col bg-[#161b22] border-r border-[#30363d]">
          <div className="p-2 space-y-1">
            <button onClick={() => setActiveTab("destruction")} className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded transition-colors ${activeTab === 'destruction' ? 'bg-[#f85149]/10 text-[#f85149]' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9]'}`}>
              <Target size={14} /> Chaos Destruction
            </button>
            <button onClick={() => setActiveTab("fluid")} className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded transition-colors ${activeTab === 'fluid' ? 'bg-[#58a6ff]/10 text-[#58a6ff]' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9]'}`}>
              <Droplet size={14} /> Fluid Dynamics
            </button>
            <button onClick={() => setActiveTab("cloth")} className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded transition-colors ${activeTab === 'cloth' ? 'bg-[#bc8cff]/10 text-[#bc8cff]' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9]'}`}>
              <Wind size={14} /> Soft Body & Cloth
            </button>
            <button onClick={() => setActiveTab("solver")} className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded transition-colors ${activeTab === 'solver' ? 'bg-[#e3b341]/10 text-[#e3b341]' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9]'}`}>
              <Settings size={14} /> Solver Settings
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#010409]">
          
          {activeTab === "destruction" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-lg">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">Voronoi Fracture Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[#8b949e] flex justify-between"><span>Fracture Levels</span> <span>3</span></label>
                      <input type="range" min="1" max="5" defaultValue="3" className="w-full mt-1 accent-[#f85149]" />
                    </div>
                    <div>
                      <label className="text-xs text-[#8b949e] flex justify-between"><span>Site Count (Level 1)</span> <span>500</span></label>
                      <input type="range" min="10" max="1000" defaultValue="500" className="w-full mt-1 accent-[#f85149]" />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[#c9d1d9]">Clustering Enabled</span>
                      <input type="checkbox" defaultChecked className="accent-[#f85149]" />
                    </div>
                    <button className="w-full mt-2 py-2 bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/30 rounded text-xs hover:bg-[#f85149]/30 transition-colors">
                      Pre-Calculate Fractures
                    </button>
                  </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-lg">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">Strain & Collision Thresholds</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[#8b949e] flex justify-between"><span>Damage Threshold</span> <span>500,000 N</span></label>
                      <input type="range" min="10000" max="1000000" defaultValue="500000" className="w-full mt-1 accent-[#e3b341]" />
                    </div>
                    <div>
                      <label className="text-xs text-[#8b949e] flex justify-between"><span>Mass Density (kg/m³)</span> <span>2400 (Concrete)</span></label>
                      <select className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-white mt-1">
                        <option>Wood (600)</option>
                        <option>Glass (2500)</option>
                        <option selected>Concrete (2400)</option>
                        <option>Steel (7800)</option>
                      </select>
                    </div>
                    <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg mt-4">
                      <div className="text-[10px] text-[#8b949e] uppercase mb-1">Debris Generation</div>
                      <div className="flex justify-between items-center text-xs text-[#c9d1d9]">
                        <span>Spawn Particles on Break</span>
                        <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "fluid" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-lg">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Droplet size={16} className="text-[#58a6ff]"/> Eulerian Grid Solver (Niagara Fluids)</h3>
                 
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-4">
                     <div>
                        <label className="text-xs text-[#8b949e] flex justify-between"><span>Grid Resolution (Voxels)</span> <span>256^3</span></label>
                        <select className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-white mt-1">
                          <option>64x64x64 (Low)</option>
                          <option>128x128x128 (Medium)</option>
                          <option selected>256x256x256 (High)</option>
                          <option>512x512x512 (Cinematic)</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs text-[#8b949e] flex justify-between"><span>Viscosity</span> <span>1.0</span></label>
                        <input type="range" min="0" max="100" defaultValue="1" className="w-full mt-1 accent-[#58a6ff]" />
                     </div>
                   </div>
                   <div className="space-y-4">
                     <div>
                        <label className="text-xs text-[#8b949e] flex justify-between"><span>Vorticity Confinement</span> <span>4.5</span></label>
                        <input type="range" min="0" max="10" step="0.1" defaultValue="4.5" className="w-full mt-1 accent-[#58a6ff]" />
                     </div>
                     <div>
                        <label className="text-xs text-[#8b949e] flex justify-between"><span>Simulation Iterations/Step</span> <span>20</span></label>
                        <input type="range" min="1" max="50" defaultValue="20" className="w-full mt-1 accent-[#58a6ff]" />
                     </div>
                   </div>
                 </div>
              </div>

              <div className="p-4 bg-[#58a6ff]/10 border border-[#58a6ff]/20 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#58a6ff]">Real-time GPU Cache</h4>
                  <p className="text-xs text-[#8b949e] mt-1">Bake fluid simulation to VDB format for optimized rendering.</p>
                </div>
                <button className="px-4 py-2 bg-[#58a6ff] text-[#0d1117] font-bold rounded text-xs hover:bg-[#79b8ff] transition-colors">
                  Bake Simulation
                </button>
              </div>
            </div>
          )}

          {(activeTab === "cloth" || activeTab === "solver") && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <Activity size={48} className="text-[#8b949e] mb-4" />
              <h2 className="text-lg font-bold text-white">Module Initializing</h2>
              <p className="text-sm text-[#8b949e] max-w-sm mt-2">Connecting to local physics compute node...</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
