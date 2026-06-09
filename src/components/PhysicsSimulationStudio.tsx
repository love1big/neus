import React, { useState } from 'react';
import { Target, Activity, Settings, Waves, Maximize, Play, Pause, RefreshCw, BoxSelect, Cpu } from 'lucide-react';

export default function PhysicsSimulationStudio() {
  const [activeTab, setActiveTab] = useState<'rigid' | 'fluid' | 'cloth'>('rigid');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Header */}
      <div className="h-14 border-b border-[#30363d] flex items-center justify-between px-6 bg-[#161b22] shrink-0">
        <div className="flex items-center gap-3">
          <Target className="text-[#e3b341]" size={20} />
          <div>
            <h1 className="text-sm font-bold text-white">Chaos Physics & Simulation Studio</h1>
            <p className="text-[10px] text-[#8b949e]">Deterministic rigid body, fluid dynamics, and cloth solvers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setIsPlaying(!isPlaying)} className={`px-4 py-1.5 rounded textxs font-bold flex items-center gap-2 shadow-sm border ${isPlaying ? 'bg-[#238636] border-[#2ea043] text-white' : 'bg-[#21262d] border-[#30363d] text-[#c9d1d9]'}`}>
             {isPlaying ? <Pause size={14}/> : <Play size={14}/>} {isPlaying ? "Simulating Compute Raster..." : "Run Physics Solver"}
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Subsystems */}
        <div className="w-64 border-r border-[#30363d] bg-[#0d1117] flex flex-col shrink-0 overflow-y-auto">
           <div className="p-3 border-b border-[#30363d]">
              <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Simulation Solvers</span>
           </div>
           
           <button onClick={() => setActiveTab('rigid')} className={`flex items-center gap-3 w-full p-3 text-left border-b border-[#30363d]/50 transition-colors ${activeTab === 'rigid' ? 'bg-[#1f242c] border-l-2 border-l-[#58a6ff]' : 'hover:bg-[#161b22] border-l-2 border-l-transparent'}`}>
             <BoxSelect size={16} className={activeTab === 'rigid' ? 'text-[#58a6ff]' : 'text-[#8b949e]'}/>
             <div>
               <div className={`text-[12px] font-bold ${activeTab === 'rigid' ? 'text-white' : 'text-[#c9d1d9]'}`}>Rigid Body & Fracture</div>
               <div className="text-[10px] text-[#8b949e]">Voronoi, Restitution, Friction</div>
             </div>
           </button>

           <button onClick={() => setActiveTab('fluid')} className={`flex items-center gap-3 w-full p-3 text-left border-b border-[#30363d]/50 transition-colors ${activeTab === 'fluid' ? 'bg-[#1f242c] border-l-2 border-l-[#3fb950]' : 'hover:bg-[#161b22] border-l-2 border-l-transparent'}`}>
             <Waves size={16} className={activeTab === 'fluid' ? 'text-[#3fb950]' : 'text-[#8b949e]'}/>
             <div>
               <div className={`text-[12px] font-bold ${activeTab === 'fluid' ? 'text-white' : 'text-[#c9d1d9]'}`}>Eulerian Fluid Grid</div>
               <div className="text-[10px] text-[#8b949e]">Vorticity, Density, Viscosity</div>
             </div>
           </button>

           <button onClick={() => setActiveTab('cloth')} className={`flex items-center gap-3 w-full p-3 text-left border-b border-[#30363d]/50 transition-colors ${activeTab === 'cloth' ? 'bg-[#1f242c] border-l-2 border-l-[#bc8cff]' : 'hover:bg-[#161b22] border-l-2 border-l-transparent'}`}>
             <Maximize size={16} className={activeTab === 'cloth' ? 'text-[#bc8cff]' : 'text-[#8b949e]'}/>
             <div>
               <div className={`text-[12px] font-bold ${activeTab === 'cloth' ? 'text-white' : 'text-[#c9d1d9]'}`}>Cloth & Soft Body</div>
               <div className="text-[10px] text-[#8b949e]">Strain, Bending Springs, Wind</div>
             </div>
           </button>
        </div>

        {/* Center Workspace */}
        <div className="flex-1 flex flex-col items-center justify-center relative bg-[#040506]">
            {/* Ambient grid background */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#161b22 1px, transparent 1px), linear-gradient(90deg, #161b22 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }} />
            
            {/* Viewport Overlay Info */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-10 font-mono">
               <span className="text-[#3fb950] text-[10px] font-bold">FPS: 119.4</span>
               <span className="text-[#8b949e] text-[10px]">Solver Sub-steps: 16</span>
               <span className="text-[#8b949e] text-[10px]">Active Colliders: {isPlaying ? '4,028' : '0'}</span>
            </div>

            <div className="z-10 flex flex-col items-center justify-center p-8 bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl relative">
              <Activity size={48} className={`mb-4 ${isPlaying ? "text-[#e3b341] animate-pulse" : "text-[#484f58]"}`}/>
              <h2 className="text-xl font-bold text-white mb-2 text-center">
                {activeTab === 'rigid' ? 'Voronoi Fracture Geometry Viewer' : activeTab === 'fluid' ? 'Eulerian Fluid Density Field Viewer' : 'Implicit Cloth Constraint Solver Viewer'}
              </h2>
              <p className="text-sm text-[#8b949e] max-w-sm text-center">
                This is a purely deterministic engine environment. No AI agents are utilized in this specific compute shader sandbox.
              </p>
            </div>
        </div>

        {/* Right Parameters Panel */}
        <div className="w-80 border-l border-[#30363d] bg-[#0d1117] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#30363d] flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#c9d1d9] uppercase tracking-wider flex items-center gap-2"><Settings size={14}/> Parameters</span>
           </div>
           
           <div className="p-4 flex flex-col gap-6 overflow-y-auto">
              {activeTab === 'rigid' && (
                 <>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-[#c9d1d9]">Voronoi Sites (Fracture Pieces)</label>
                    <input type="range" min="1" max="1000" defaultValue="250" className="w-full accent-[#58a6ff]" />
                    <div className="flex justify-between text-[10px] text-[#8b949e]"><span>1</span><span>1000 chunks</span></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-[#c9d1d9]">Impact Threshold (Strain)</label>
                    <input type="range" min="1" max="100" defaultValue="50" className="w-full accent-[#58a6ff]" />
                    <div className="flex justify-between text-[10px] text-[#8b949e]"><span>Brittle</span><span>Indestructible</span></div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="text-[11px] font-bold text-[#c9d1d9]">Restitution (Bounciness)</label>
                     <input type="text" defaultValue="0.25" className="bg-[#161b22] border border-[#30363d] p-1.5 rounded text-[12px] text-[#c9d1d9] outline-none font-mono" />
                  </div>
                 </>
              )}

              {activeTab === 'fluid' && (
                 <>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-[#c9d1d9]">Grid Resolution (Voxel Data)</label>
                    <select className="bg-[#161b22] border border-[#30363d] p-1.5 rounded text-[12px] text-[#c9d1d9] outline-none">
                       <option>64 x 64 x 64</option>
                       <option>128 x 128 x 128</option>
                       <option selected>256 x 256 x 256 (High)</option>
                       <option>512 x 512 x 512 (Ultra)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-[#c9d1d9]">Vorticity Confinement (Swirliness)</label>
                    <input type="range" min="1" max="100" defaultValue="40" className="w-full accent-[#3fb950]" />
                    <div className="flex justify-between text-[10px] text-[#8b949e]"><span>Laminar</span><span>Turbulent</span></div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="text-[11px] font-bold text-[#c9d1d9]">Viscosity Co-efficient</label>
                     <input type="text" defaultValue="0.00018" className="bg-[#161b22] border border-[#30363d] p-1.5 rounded text-[12px] text-[#c9d1d9] outline-none font-mono" />
                  </div>
                 </>
              )}

              {activeTab === 'cloth' && (
                 <>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-[#c9d1d9]">Solver Iterations</label>
                    <input type="range" min="1" max="32" defaultValue="8" className="w-full accent-[#bc8cff]" />
                    <div className="flex justify-between text-[10px] text-[#8b949e]"><span>1 iter (Loose)</span><span>32 iter (Stiff)</span></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-[#c9d1d9]">Bending Springs Stiffness</label>
                    <input type="range" min="0" max="100" defaultValue="15" className="w-full accent-[#bc8cff]" />
                    <div className="flex justify-between text-[10px] text-[#8b949e]"><span>Silk</span><span>Leather</span></div>
                  </div>
                  <div className="flex flex-col gap-1">
                     <label className="text-[11px] font-bold text-[#c9d1d9] mb-1">Self-Collision Check</label>
                     <div className="flex items-center gap-2">
                       <input type="checkbox" id="selfColl" defaultChecked className="accent-[#bc8cff]"/>
                       <label htmlFor="selfColl" className="text-[#8b949e] text-[10px]">Enable O(n log n) broadphase</label>
                     </div>
                  </div>
                 </>
              )}

              <div className="mt-8 pt-4 border-t border-[#30363d]">
                 <span className="text-[10px] text-[#8b949e] leading-relaxed block">
                    All calculations are performed deterministically on the GPU compute pipeline utilizing discrete math integrations (RK4/Verlet). No Generative AI or Offline Agents are involved in physical simulation parameters.
                 </span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
