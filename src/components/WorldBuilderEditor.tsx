import React, { useState } from 'react';
import {
  Rewind, Globe, ZoomIn, Clock, Wind, GitPullRequest, Layers, ThermometerSun, 
  Leaf, Settings, Droplets, Mountain, Play, Pause, FastForward, Activity,
  Maximize, Eye, Sliders, Box, Cpu, Database
} from 'lucide-react';

export default function WorldBuilderEditor() {
  const [activeTab, setActiveTab] = useState<'NanoMacro' | 'TimeErosion' | 'CFDWind' | 'Ecosystem'>('NanoMacro');
  const [zoomLevel, setZoomLevel] = useState<number>(50);
  const [timeProgression, setTimeProgression] = useState<number>(0);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#c9d1d9] font-sans">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3fb950]/10 to-transparent pointer-events-none"></div>
        <Globe size={28} className="text-[#3fb950] mr-4 shadow-[0_0_15px_rgba(63,185,80,0.4)]" />
        <div className="flex flex-col z-10">
          <h2 className="text-white text-[16px] font-bold tracking-tight">World Building & Sandbox Physics Engine</h2>
          <p className="text-[#8b949e] text-[11px]">Nano-to-Macro Voxel Scaling, 4D Time Progression, CFD Wind Tunnels, and Emergent Ecosystems.</p>
        </div>
        <div className="ml-auto flex gap-3 h-full items-center z-10">
           <div className="bg-[#161b22] border border-[#30363d] px-3 py-1.5 rounded-lg flex flex-col items-center">
              <span className="text-[9px] uppercase font-bold text-[#8b949e]">Global Timeline</span>
              <span className="text-[#e3b341] font-mono text-[14px] font-bold">Year {2026 + Math.floor(timeProgression)}</span>
           </div>
           <div className="bg-[#161b22] border border-[#30363d] px-3 py-1.5 rounded-lg flex flex-col items-center">
              <span className="text-[9px] uppercase font-bold text-[#8b949e]">Simulated Biomes</span>
              <span className="text-[#3fb950] font-mono text-[14px] font-bold">2,104 Active</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-[60px] bg-[#161b22] border-r border-[#30363d] flex flex-col items-center py-4 gap-4 z-10 shrink-0">
          <ToolbarButton icon={<Globe />} active={activeTab === 'NanoMacro'} onClick={() => setActiveTab('NanoMacro')} title="Nano-Macro Voxel Zoom" color="#58a6ff" />
          <ToolbarButton icon={<Clock />} active={activeTab === 'TimeErosion'} onClick={() => setActiveTab('TimeErosion')} title="4D Time & Erosion" color="#e3b341" />
          <ToolbarButton icon={<Wind />} active={activeTab === 'CFDWind'} onClick={() => setActiveTab('CFDWind')} title="Navier-Stokes CFD Tunnel" color="#bc8cff" />
          <ToolbarButton icon={<Leaf />} active={activeTab === 'Ecosystem'} onClick={() => setActiveTab('Ecosystem')} title="Emergent Food Chain & Ecosystem" color="#3fb950" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative bg-[#050505] overflow-hidden">
           
           {/* Center Canvas */}
           <div className="flex-1 relative">
             {activeTab === 'NanoMacro' && <NanoMacroView zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />}
             {activeTab === 'TimeErosion' && <TimeErosionView timeProgression={timeProgression} setTimeProgression={setTimeProgression} />}
             {activeTab === 'CFDWind' && <CFDView />}
             {activeTab === 'Ecosystem' && <EcosystemView />}
           </div>

        </div>

        {/* Right Properties Panel */}
        <div className="w-[320px] bg-[#0d1117] border-l border-[#30363d] flex flex-col shrink-0">
           {activeTab === 'NanoMacro' && <NanoMacroProps zoomLevel={zoomLevel} />}
           {activeTab === 'TimeErosion' && <TimeErosionProps timeProgression={timeProgression} />}
           {activeTab === 'CFDWind' && <CFDProps />}
           {activeTab === 'Ecosystem' && <EcosystemProps />}
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ icon, active, onClick, title, color }: any) {
  return (
    <button 
      onClick={onClick} 
      title={title}
      className={`p-3 rounded-xl transition-all ${active ? 'bg-[#21262d] shadow-lg scale-110' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d] scale-100'}`}
      style={{ color: active ? color : undefined, boxShadow: active ? `0 0 15px ${color}40` : 'none' }}
    >
      {React.cloneElement(icon, { size: 22 })}
    </button>
  );
}

// -------------------------------------------------------------------------------------------------
// VIEWS
// -------------------------------------------------------------------------------------------------

function NanoMacroView({ zoomLevel, setZoomLevel }: any) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center isolate">
      <div className="absolute top-4 left-4 bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-3 py-1.5 rounded text-[11px] font-bold text-[#58a6ff] uppercase tracking-widest z-20">
        Nano-Macro Continuum Viewer
      </div>
      
      {/* 3D Representation Mockup */}
      <div className="w-[80%] h-[70%] relative flex items-center justify-center mt-10 perspective-1000">
         {zoomLevel < 30 && (
           <div className="w-[500px] h-[500px] rounded-full border border-[#58a6ff]/30 flex items-center justify-center relative shadow-[0_0_100px_rgba(88,166,255,0.1)]">
              <Globe size={300} className="text-[#58a6ff] opacity-40 animate-spin-slow" />
              <div className="absolute top-1/4 right-1/4 text-[#58a6ff] text-[10px] font-mono border border-[#58a6ff] bg-[#000]/50 p-1">Orbit Radius: 35,000 km</div>
           </div>
         )}
         {zoomLevel >= 30 && zoomLevel < 70 && (
           <div className="w-[600px] h-[400px] bg-[#161b22] border border-[#30363d] flex items-center justify-center relative transform rotateX-12 shadow-2xl">
              <Mountain size={200} className="text-[#8b949e] opacity-30" />
              <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="absolute bottom-10 left-10 text-[#c9d1d9] text-[10px] font-mono border border-[#30363d] bg-[#000]/80 p-2">City View / Architecture Level</div>
              {/* Highlight window */}
              <div className="absolute top-[40%] right-[30%] w-[40px] h-[40px] border-2 border-[#58a6ff] bg-[#58a6ff]/20 animate-pulse"></div>
           </div>
         )}
         {zoomLevel >= 70 && (
           <div className="w-[600px] h-[400px] bg-[#0a0a0a] border border-[#30363d] flex flex-wrap items-center justify-center relative overflow-hidden p-10 gap-1 shadow-2xl">
              {[...Array(400)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-[#21262d] border border-[#30363d] hover:bg-[#58a6ff] hover:border-[#58a6ff] transition-colors cursor-crosshair"></div>
              ))}
              <div className="absolute top-10 left-10 text-[#58a6ff] text-[10px] font-mono border border-[#58a6ff] bg-[#000]/80 p-2">Voxel Detail / Brick Cracks (Micro)</div>
           </div>
         )}
      </div>

      <div className="absolute bottom-10 w-1/2 flex items-center gap-4 bg-[#161b22]/90 backdrop-blur px-8 py-4 rounded-full border border-[#30363d] shadow-2xl z-20">
        <Globe size={18} className="text-[#8b949e]" />
        <input 
          type="range" 
          min="0" max="100" 
          value={zoomLevel} 
          onChange={(e) => setZoomLevel(parseInt(e.target.value))}
          className="flex-1 accent-[#58a6ff] outline-none" 
        />
        <ZoomIn size={18} className="text-[#8b949e]" />
      </div>
    </div>
  )
}

function TimeErosionView({ timeProgression }: any) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center isolate">
      <div className="absolute top-4 left-4 bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-3 py-1.5 rounded text-[11px] font-bold text-[#e3b341] uppercase tracking-widest z-20">
        4D Temporal Progression
      </div>

      <div className="w-[700px] h-[400px] relative mt-10 rounded-lg overflow-hidden border border-[#30363d] shadow-2xl bg-[#0a0a0a]">
         {/* Base Object */}
         <div className="absolute inset-0 flex items-center justify-center bg-[#161b22] transition-all" style={{ filter: `sepia(${timeProgression/200}) hue-rotate(${timeProgression/5}deg) brightness(${1 - timeProgression/300})` }}>
            <Box size={200} className="text-[#c9d1d9] transition-all" style={{ opacity: 1 - (timeProgression/200) }} />
            
            {/* Rust / Overgrowth Layer */}
            {timeProgression > 20 && (
              <div className="absolute inset-0 bg-[#3fb950] mix-blend-overlay transition-all" style={{ opacity: (timeProgression - 20) / 100 }}></div>
            )}
            {timeProgression > 50 && (
              <div className="absolute inset-0 bg-[#8a3324] mix-blend-multiply opacity-50 transition-all" style={{ clipPath: `circle(${timeProgression/2}% at 50% 50%)` }}></div>
            )}
            
            <div className="absolute bottom-4 left-4 text-[#8b949e] font-mono text-[10px]">
               State: {timeProgression < 20 ? 'Pristine' : timeProgression < 60 ? 'Weathered / Oxidized' : 'Ruined / Overgrown'}
            </div>
         </div>
      </div>
    </div>
  )
}

function CFDView() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center isolate bg-[#050505]">
      <div className="absolute top-4 left-4 bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-3 py-1.5 rounded text-[11px] font-bold text-[#bc8cff] uppercase tracking-widest z-20">
        Navier-Stokes Wind Tunnel
      </div>

      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
         {/* Wind lines Mockup */}
         {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute left-0 h-[2px] bg-gradient-to-r from-transparent via-[#bc8cff] to-transparent w-full opacity-30" style={{ top: `${(i+1)*5}%`, animation: `slideRight ${2 + Math.random()*2}s infinite linear` }}></div>
         ))}
         
         <div className="relative z-10 w-[200px] h-[300px] bg-[#161b22] border-2 border-[#bc8cff] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(188,140,255,0.2)]">
            <span className="text-[#bc8cff] font-bold uppercase tracking-widest rotate-90 whitespace-nowrap text-[12px]">Aerodynamic Object</span>
         </div>
         
         {/* Particles hitting object */}
         <div className="absolute top-1/2 left-[40%] text-[#bc8cff] opacity-80 z-20">
            <Activity size={100} strokeWidth={1} />
         </div>
      </div>
    </div>
  )
}

function EcosystemView() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center isolate bg-[#0a0a0a]">
      <div className="absolute top-4 left-4 bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-3 py-1.5 rounded text-[11px] font-bold text-[#3fb950] uppercase tracking-widest z-20">
        Emergent Ecosystem Graph
      </div>

      <div className="w-[800px] h-[500px] relative border border-[#30363d] rounded-lg bg-[#161b22] p-8 shadow-2xl">
         {/* Node Graph Mockup */}
         <div className="absolute top-[20%] left-[20%] w-24 h-24 rounded-full bg-[#f85149]/20 border-2 border-[#f85149] flex items-center justify-center text-[11px] font-bold text-[#f85149] shadow-[0_0_20px_rgba(248,81,73,0.3)]">Wolves (Predator)</div>
         <div className="absolute top-[50%] left-[50%] w-32 h-32 rounded-full bg-[#e3b341]/20 border-2 border-[#e3b341] flex items-center justify-center text-[11px] font-bold text-[#e3b341] shadow-[0_0_20px_rgba(227,179,65,0.3)] translate-x-[-50%] translate-y-[-50%]">Deer (Prey)</div>
         <div className="absolute bottom-[20%] right-[20%] w-40 h-40 rounded-full bg-[#3fb950]/20 border-2 border-[#3fb950] flex items-center justify-center text-[11px] font-bold text-[#3fb950] shadow-[0_0_20px_rgba(63,185,80,0.3)]">Flora (Resources)</div>
         
         <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#8b949e]" strokeWidth="2" strokeDasharray="5,5">
            <line x1="25%" y1="25%" x2="50%" y2="50%" />
            <line x1="50%" y1="50%" x2="75%" y2="75%" />
         </svg>
         
         <div className="absolute top-[35%] left-[35%] bg-[#0d1117] px-2 border border-[#30363d] text-[10px] text-white"> Hunts (-15/day) </div>
         <div className="absolute top-[65%] left-[65%] bg-[#0d1117] px-2 border border-[#30363d] text-[10px] text-white"> Grazes (-300/day) </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------------------------------------------
// PROPERTIES PANELS
// -------------------------------------------------------------------------------------------------

function NanoMacroProps({ zoomLevel }: { zoomLevel: number }) {
   return (
      <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto">
         <div className="text-[12px] font-bold text-[#58a6ff] uppercase tracking-wider border-b border-[#30363d] pb-2">Voxel Resolution Core</div>
         
         <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-[#8b949e]">Current Scale</label>
            <div className="bg-[#161b22] p-2 rounded border border-[#30363d] font-mono text-[11px] text-white">
               {zoomLevel < 30 ? '1 Voxel = 1000 KM (Planetary)' : zoomLevel < 70 ? '1 Voxel = 1 Meter (Architectural)' : '1 Voxel = 0.01 mm (Molecular)'}
            </div>
         </div>

         <div className="flex flex-col gap-2 mt-4">
            <label className="text-[10px] uppercase font-bold text-[#8b949e]">Detail Instancing</label>
            <div className="flex items-center justify-between text-[11px] bg-[#0a0a0a] border border-[#30363d] px-2 py-1.5 rounded">
               <span className="text-[#c9d1d9]">Nanite Mesh Generation</span>
               <input type="checkbox" checked className="accent-[#58a6ff]" />
            </div>
            <div className="flex items-center justify-between text-[11px] bg-[#0a0a0a] border border-[#30363d] px-2 py-1.5 rounded">
               <span className="text-[#c9d1d9]">Seamless LoD Transitions</span>
               <input type="checkbox" checked className="accent-[#58a6ff]" />
            </div>
         </div>
      </div>
   )
}

function TimeErosionProps({ timeProgression }: { timeProgression: number }) {
   return (
      <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto">
         <div className="text-[12px] font-bold text-[#e3b341] uppercase tracking-wider border-b border-[#30363d] pb-2">4D Timeline Editor</div>
         
         <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#8b949e]">
               <span>Time Multiplier</span>
               <span className="text-[#e3b341] font-mono">1 Yr / Sec</span>
            </div>
            <div className="flex gap-2">
               <button className="flex-1 bg-[#161b22] border border-[#30363d] py-1.5 rounded text-[#c9d1d9] hover:bg-[#21262d] flex justify-center"><Rewind size={14}/></button>
               <button className="flex-1 bg-[#e3b341] text-black py-1.5 rounded flex justify-center shadow-[0_0_10px_rgba(227,179,65,0.4)]"><Play size={14}/></button>
               <button className="flex-1 bg-[#161b22] border border-[#30363d] py-1.5 rounded text-[#c9d1d9] hover:bg-[#21262d] flex justify-center"><FastForward size={14}/></button>
            </div>
         </div>

         <div className="flex flex-col gap-2 mt-4">
            <label className="text-[10px] uppercase font-bold text-[#8b949e]">AI Erosion Agents</label>
            <div className="space-y-2">
               <div className="bg-[#161b22] p-2 rounded border border-[#30363d]">
                  <div className="flex justify-between text-[10px] mb-1">
                     <span className="text-[#c9d1d9]">Rust & Oxidation (Metals)</span>
                     <span className="text-[#e3b341]">Active</span>
                  </div>
                  <input type="range" className="w-full h-1 bg-[#0a0a0a] appearance-none accent-[#e3b341] outline-none" defaultValue={80}/>
               </div>
               <div className="bg-[#161b22] p-2 rounded border border-[#30363d]">
                  <div className="flex justify-between text-[10px] mb-1">
                     <span className="text-[#c9d1d9]">Moss & Flora Overgrowth</span>
                     <span className="text-[#3fb950]">Aggressive</span>
                  </div>
                  <input type="range" className="w-full h-1 bg-[#0a0a0a] appearance-none accent-[#3fb950] outline-none" defaultValue={60}/>
               </div>
               <div className="bg-[#161b22] p-2 rounded border border-[#30363d]">
                  <div className="flex justify-between text-[10px] mb-1">
                     <span className="text-[#c9d1d9]">Tectonic Shifts / Cracks</span>
                     <span className="text-[#f85149]">Slow</span>
                  </div>
                  <input type="range" className="w-full h-1 bg-[#0a0a0a] appearance-none accent-[#f85149] outline-none" defaultValue={20}/>
               </div>
            </div>
         </div>
      </div>
   )
}

function CFDProps() {
   return (
      <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto">
         <div className="text-[12px] font-bold text-[#bc8cff] uppercase tracking-wider border-b border-[#30363d] pb-2">Aerodynamics & CFD Lab</div>
         
         <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-[#8b949e]">Wind Velocity</label>
            <input type="range" className="w-full accent-[#bc8cff]" defaultValue="65" />
            <div className="text-right text-[10px] font-mono text-white">65.0 m/s (Hurricane)</div>
         </div>

         <div className="flex flex-col gap-2 mt-4">
            <label className="text-[10px] uppercase font-bold text-[#8b949e]">Fluid Properties</label>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
               <div className="bg-[#161b22] border border-[#30363d] p-1.5 rounded flex flex-col">
                  <span className="text-[#8b949e] text-[9px] uppercase">Density</span>
                  <span className="text-white font-mono">1.225 kg/m³</span>
               </div>
               <div className="bg-[#161b22] border border-[#30363d] p-1.5 rounded flex flex-col">
                  <span className="text-[#8b949e] text-[9px] uppercase">Viscosity</span>
                  <span className="text-white font-mono">1.81e-5</span>
               </div>
               <div className="bg-[#161b22] border border-[#30363d] p-1.5 rounded flex flex-col col-span-2">
                  <span className="text-[#8b949e] text-[9px] uppercase">Navier-Stokes Solver</span>
                  <select className="bg-transparent text-white outline-none font-mono">
                     <option>Incompressible (Euler)</option>
                     <option>Compressible Real-time</option>
                  </select>
               </div>
            </div>
         </div>
      </div>
   )
}

function EcosystemProps() {
  return (
    <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto">
         <div className="text-[12px] font-bold text-[#3fb950] uppercase tracking-wider border-b border-[#30363d] pb-2">Food Chain Configuration</div>
         
         <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg flex flex-col gap-3">
            <div className="flex justify-between items-center">
               <span className="text-[#c9d1d9] font-bold text-[11px] flex items-center gap-2"><Cpu size={14} className="text-[#3fb950]"/> Emergent AI Director</span>
               <div className="w-8 h-4 bg-[#3fb950]/20 rounded-full border border-[#3fb950] flex items-center p-0.5"><div className="w-3 h-3 bg-[#3fb950] rounded-full translate-x-3"></div></div>
            </div>
            <p className="text-[#8b949e] text-[10px]">Agents autonomously migrate, hunt, and reproduce based on node resources. Does not rely on pre-scripted spawn zones.</p>
         </div>

         <div className="flex flex-col gap-2 mt-2">
            <span className="text-[10px] font-bold text-[#8b949e] uppercase">Node Balancer</span>
            <div className="flex justify-between items-center text-[11px] border-b border-[#30363d] pb-1">
               <span className="text-[#f85149]">Apex Predators</span>
               <input type="number" className="w-12 bg-[#0a0a0a] border border-[#30363d] rounded text-center text-white outline-none" defaultValue="12" />
            </div>
            <div className="flex justify-between items-center text-[11px] border-b border-[#30363d] pb-1">
               <span className="text-[#e3b341]">Herbivores</span>
               <input type="number" className="w-12 bg-[#0a0a0a] border border-[#30363d] rounded text-center text-white outline-none" defaultValue="450" />
            </div>
            <div className="flex justify-between items-center text-[11px] border-b border-[#30363d] pb-1">
               <span className="text-[#3fb950]">Flora Generation</span>
               <input type="number" className="w-12 bg-[#0a0a0a] border border-[#30363d] rounded text-center text-white outline-none" defaultValue="2000" />
            </div>
         </div>
    </div>
  )
}
