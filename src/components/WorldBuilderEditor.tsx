import React, { useState } from 'react';
import {
  Rewind, Globe, ZoomIn, Clock, Wind, GitPullRequest, Layers, ThermometerSun, 
  Leaf, Settings, Droplets, Mountain, Play, Pause, FastForward, Activity,
  Maximize, Eye, Sliders, Box, Cpu, Database, Network, Flame, Snowflake,
  CloudRain, Map as MapIcon, Workflow, Zap, Target
} from 'lucide-react';

export default function WorldBuilderEditor() {
  const [activeTab, setActiveTab] = useState<'Geology' | 'Climate' | 'Ecosystem' | 'Civilization' | 'NanoMacro'>('Geology');
  const [zoomLevel, setZoomLevel] = useState<number>(50);
  const [timeProgression, setTimeProgression] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#c9d1d9] font-sans">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3fb950]/5 to-[#58a6ff]/5 pointer-events-none"></div>
        <Globe size={28} className="text-[#3fb950] mr-4 shadow-[0_0_15px_rgba(63,185,80,0.4)]" />
        <div className="flex flex-col z-10">
          <h2 className="text-white text-[16px] font-bold tracking-tight">Apex World Builder & Master Simulator</h2>
          <p className="text-[#8b949e] text-[11px]">Procedural Planetary Generation • Tectonics • Hydrology • Atmospheric CFD • Ecosystem Simulation Engine</p>
        </div>
        <div className="ml-auto flex gap-3 h-full items-center z-10">
           <div className="bg-[#161b22] border border-[#30363d] px-3 py-1.5 rounded-lg flex flex-col items-center shadow-inner">
              <span className="text-[9px] uppercase font-bold text-[#8b949e]">Global Timeline</span>
              <span className="text-[#e3b341] font-mono text-[14px] font-bold">Year {2026 + Math.floor(timeProgression)}</span>
           </div>
           <div className="bg-[#161b22] border border-[#30363d] px-3 py-1.5 rounded-lg flex flex-col items-center">
              <span className="text-[9px] uppercase font-bold text-[#8b949e]">Total Entities</span>
              <span className="text-[#58a6ff] font-mono text-[14px] font-bold">142.4M</span>
           </div>
           <div className="bg-[#161b22] border border-[#30363d] px-3 py-1.5 rounded-lg flex flex-col items-center">
              <span className="text-[9px] uppercase font-bold text-[#8b949e]">Simulation Status</span>
              <span className="text-[#3fb950] font-mono text-[14px] font-bold flex items-center gap-1">
                {isPlaying ? <Activity size={12} className="animate-pulse" /> : <Pause size={12} />} 
                {isPlaying ? 'CALCULATING' : 'PAUSED'}
              </span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-[64px] bg-[#0d1117] border-r border-[#30363d] flex flex-col items-center py-4 gap-4 z-10 shrink-0 shadow-[5px_0_15px_rgba(0,0,0,0.4)]">
          <ToolbarButton icon={<Globe />} active={activeTab === 'NanoMacro'} onClick={() => setActiveTab('NanoMacro')} title="Nano-Macro View" color="#58a6ff" />
          <div className="w-8 h-px bg-[#30363d]"></div>
          <ToolbarButton icon={<Mountain />} active={activeTab === 'Geology'} onClick={() => setActiveTab('Geology')} title="Geology & Tectonics" color="#f85149" />
          <ToolbarButton icon={<Wind />} active={activeTab === 'Climate'} onClick={() => setActiveTab('Climate')} title="Climate & Atmosphere" color="#bc8cff" />
          <ToolbarButton icon={<Leaf />} active={activeTab === 'Ecosystem'} onClick={() => setActiveTab('Ecosystem')} title="Flora & Fauna Ecosystem" color="#3fb950" />
          <ToolbarButton icon={<Network />} active={activeTab === 'Civilization'} onClick={() => setActiveTab('Civilization')} title="Civilization & Demographics" color="#e3b341" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative bg-[#000] overflow-hidden">
           {/* Center Canvas */}
           <div className="flex-1 relative">
             {activeTab === 'NanoMacro' && <NanoMacroView zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />}
             {activeTab === 'Geology' && <GeologyView timeProgression={timeProgression} />}
             {activeTab === 'Climate' && <ClimateView timeProgression={timeProgression} />}
             {activeTab === 'Ecosystem' && <EcosystemView />}
             {activeTab === 'Civilization' && <CivilizationView />}
           </div>

           {/* Central Bottom Playback Controls */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#161b22]/95 backdrop-blur px-6 py-3 rounded-2xl border border-[#30363d] shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-20">
              <button 
                className="text-[#8b949e] hover:text-white transition-colors"
                onClick={() => setTimeProgression(0)}
              >
                <Rewind size={20} />
              </button>
              <button 
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all shadow-lg ${isPlaying ? 'bg-[#f85149] text-white hover:bg-[#ff6a64]' : 'bg-[#3fb950] text-white hover:bg-[#4ddf62]'}`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>
              <button 
                className="text-[#8b949e] hover:text-white transition-colors"
                onClick={() => setTimeProgression(t => t + 10)}
              >
                <FastForward size={20} />
              </button>
              <div className="w-px h-8 bg-[#30363d] mx-2"></div>
              <div className="flex flex-col">
                 <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Simulation Speed</span>
                 <input type="range" className="w-32 accent-[#58a6ff] h-1.5" min="0" max="100" defaultValue="10" />
              </div>
           </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-[380px] bg-[#0d1117] border-l border-[#30363d] flex flex-col shrink-0 shadow-[-5px_0_15px_rgba(0,0,0,0.4)] z-10">
           {activeTab === 'NanoMacro' && <NanoMacroProps zoomLevel={zoomLevel} />}
           {activeTab === 'Geology' && <GeologyProps timeProgression={timeProgression} setTimeProgression={setTimeProgression} />}
           {activeTab === 'Climate' && <ClimateProps />}
           {activeTab === 'Ecosystem' && <EcosystemProps />}
           {activeTab === 'Civilization' && <CivilizationProps />}
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
      className={`p-3 rounded-xl transition-all relative group ${active ? 'bg-[#21262d] shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-110' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d] scale-100'}`}
      style={{ color: active ? color : undefined, boxShadow: active ? `inset 2px 0 0 ${color}` : 'none' }}
    >
      {React.cloneElement(icon, { size: 24 })}
      <div className="absolute left-[120%] top-1/2 -translate-y-1/2 bg-black text-white text-[10px] uppercase font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-[#30363d]">
         {title}
      </div>
    </button>
  );
}

// -------------------------------------------------------------------------------------------------
// VIEWS
// -------------------------------------------------------------------------------------------------

function NanoMacroView({ zoomLevel, setZoomLevel }: any) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center isolate">
      <div className="absolute top-4 left-4 bg-[#161b22]/90 backdrop-blur border border-[#30363d] px-3 py-1.5 rounded text-[11px] font-bold text-[#58a6ff] uppercase tracking-widest z-20 flex items-center gap-2">
        <Target size={14} /> Nano-Macro Continuum Viewer
      </div>
      
      <div className="w-[80%] h-[70%] relative flex items-center justify-center mt-10 perspective-1000">
         {zoomLevel < 30 && (
           <div className="w-[500px] h-[500px] rounded-full border border-[#58a6ff]/30 flex items-center justify-center relative shadow-[0_0_100px_rgba(88,166,255,0.1)]">
              <Globe size={300} className="text-[#58a6ff] opacity-40 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-0 rounded-full border-t border-[#58a6ff] animate-[spin_10s_linear_infinite] opacity-50"></div>
              <div className="absolute top-1/4 right-1/4 text-[#58a6ff] text-[10px] font-mono border border-[#58a6ff] bg-[#000]/50 p-1 backdrop-blur">Radius: 6,371 km (Planetary)</div>
           </div>
         )}
         {zoomLevel >= 30 && zoomLevel < 70 && (
           <div className="w-[800px] h-[500px] bg-[#161b22] border border-[#30363d] flex items-center justify-center relative transform rotateX-12 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden">
              <Mountain size={300} className="text-[#8b949e] opacity-30 absolute bottom-[-50px]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d_1px,transparent_1px),linear-gradient(to_bottom,#30363d_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [transform:perspective(500px)_rotateX(60deg)] origin-bottom"></div>
              <div className="absolute bottom-10 left-10 text-[#c9d1d9] text-[10px] font-mono border border-[#30363d] bg-[#000]/80 p-2 backdrop-blur z-10">Biome Scale / Continental (1:100,000)</div>
              {/* Highlight window */}
              <div className="absolute top-[40%] right-[30%] w-[100px] h-[100px] border-2 border-[#58a6ff] bg-[#58a6ff]/10 animate-pulse flex items-center justify-center">
                 <div className="w-2 h-2 bg-[#58a6ff] rounded-full"></div>
              </div>
           </div>
         )}
         {zoomLevel >= 70 && (
           <div className="w-[600px] h-[400px] bg-[#050505] border border-[#30363d] flex flex-wrap items-center justify-center relative overflow-hidden p-10 gap-0.5 shadow-2xl">
              {[...Array(900)].map((_, i) => (
                <div key={i} className="w-[18px] h-[18px] bg-[#161b22] border border-[#21262d] hover:bg-[#58a6ff] hover:border-[#58a6ff] transition-colors cursor-crosshair"></div>
              ))}
              <div className="absolute top-10 left-10 text-[#58a6ff] text-[10px] font-mono border border-[#58a6ff] bg-[#000]/80 p-2 backdrop-blur">Voxel Scale / Cellular (1m³)</div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)] pointer-events-none"></div>
           </div>
         )}
      </div>

      <div className="absolute bottom-24 w-1/2 flex items-center gap-4 bg-[#161b22]/90 backdrop-blur px-8 py-4 rounded-full border border-[#30363d] shadow-2xl z-20">
        <Globe size={18} className="text-[#8b949e]" />
        <input 
          type="range" 
          min="0" max="100" 
          value={zoomLevel} 
          onChange={(e) => setZoomLevel(parseInt(e.target.value))}
          className="flex-1 accent-[#58a6ff] outline-none h-1.5 bg-[#050505] rounded-full appearance-none" 
        />
        <ZoomIn size={18} className="text-[#8b949e]" />
      </div>
    </div>
  )
}

function GeologyView({ timeProgression }: any) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] p-10">
      <div className="absolute top-4 left-4 bg-[#161b22]/80 backdrop-blur border border-[#f85149]/30 px-3 py-1.5 rounded text-[11px] font-bold text-[#f85149] uppercase tracking-widest z-20 flex items-center gap-2">
        <Mountain size={14} /> Tectonics & Fluid Erosion Simulator
      </div>

      <div className="w-full h-full border border-[#30363d] rounded-2xl relative overflow-hidden bg-black shadow-[0_0_50px_rgba(248,81,73,0.1)]">
         {/* Tectonic Map Mockup */}
         <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 1000 600">
            {/* Plates Boundaries */}
            <path d="M 200,0 Q 300,200 250,400 T 300,600" fill="none" stroke="#f85149" strokeWidth="3" strokeDasharray="10,5" className="animate-[dash_10s_linear_infinite]" />
            <path d="M 700,0 Q 600,300 800,500 T 750,600" fill="none" stroke="#e3b341" strokeWidth="3" strokeDasharray="10,5" />
            <path d="M 0,300 Q 250,350 450,250 T 1000,350" fill="none" stroke="#3fb950" strokeWidth="2" />
            
            {/* Heatmaps / Mantle plumes */}
            <circle cx="280" cy="300" r="100" fill="url(#magmaGrad)" opacity="0.4" className="animate-pulse" />
            <circle cx="750" cy="200" r="150" fill="url(#magmaGrad)" opacity="0.3" className="animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Heightmap base layer mock */}
            <path d="M 300,300 Q 350,250 400,300 T 500,250 T 600,300 T 700,200" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="50" filter="blur(20px)" />
            
            <defs>
               <radialGradient id="magmaGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f85149" />
                  <stop offset="50%" stopColor="#e3b341" />
                  <stop offset="100%" stopColor="transparent" />
               </radialGradient>
            </defs>
         </svg>
         
         <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03] pointer-events-none"></div>

         <div className="absolute bottom-6 right-6 bg-[#0a0a0a]/80 backdrop-blur border border-[#30363d] p-4 rounded-xl flex flex-col gap-2 font-mono text-[10px]">
            <div className="flex justify-between w-48 text-[#8b949e]"><span>Plate Velocity</span><span className="text-white">4.2 cm/yr</span></div>
            <div className="flex justify-between w-48 text-[#8b949e]"><span>Mantle Temp</span><span className="text-[#f85149]">1,452 °C</span></div>
            <div className="flex justify-between w-48 text-[#8b949e]"><span>Hydraulic Ero.</span><span className="text-[#58a6ff]">2.1 mm/yr</span></div>
         </div>
      </div>
    </div>
  )
}

function ClimateView({ timeProgression }: any) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] p-10">
      <div className="absolute top-4 left-4 bg-[#161b22]/80 backdrop-blur border border-[#bc8cff]/30 px-3 py-1.5 rounded text-[11px] font-bold text-[#bc8cff] uppercase tracking-widest z-20 flex items-center gap-2">
        <Wind size={14} /> Atmosphere & Climate CFD
      </div>

      <div className="w-full h-full border border-[#30363d] rounded-2xl relative overflow-hidden bg-[#0d1117] shadow-[0_0_50px_rgba(188,140,255,0.1)]">
         {/* Wind / Climate lines Mockup */}
         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600">
            {/* Equator/Tropics lines */}
            <line x1="0" y1="300" x2="1000" y2="300" stroke="#f85149" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
            <line x1="0" y1="200" x2="1000" y2="200" stroke="#e3b341" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />
            <line x1="0" y1="400" x2="1000" y2="400" stroke="#e3b341" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />

            {/* Coriolis Wind vectors */}
            {[...Array(15)].map((_, i) => (
                <path 
                  key={`n_${i}`}
                  d={`M ${i*80}, 200 Q ${i*80 + 30}, 250 ${i*80 - 20}, 300`} 
                  fill="none" stroke="#bc8cff" strokeWidth="2" opacity="0.4"
                  className="animate-[dash_2s_linear_infinite]"
                  strokeDasharray="20,10"
                />
            ))}
            {[...Array(15)].map((_, i) => (
                <path 
                  key={`s_${i}`}
                  d={`M ${i*80}, 400 Q ${i*80 + 30}, 350 ${i*80 - 20}, 300`} 
                  fill="none" stroke="#58a6ff" strokeWidth="2" opacity="0.4"
                  className="animate-[dash_2s_linear_infinite]"
                  strokeDasharray="20,10"
                />
            ))}

            {/* Jet stream */}
            <path d="M 0,100 Q 200,50 400,120 T 800,80 T 1000,150" fill="none" stroke="#c9d1d9" strokeWidth="15" opacity="0.1" filter="blur(5px)" />
            
            {/* Precipitation heatmap */}
            <circle cx="600" cy="250" r="150" fill="url(#rainGrad)" opacity="0.5" className="animate-pulse" />
            
            <defs>
               <radialGradient id="rainGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#58a6ff" />
                  <stop offset="100%" stopColor="transparent" />
               </radialGradient>
            </defs>
         </svg>
         
         <div className="absolute top-[40%] left-[20%] text-[#bc8cff] opacity-80 z-20 transform -rotate-12">
            <CloudRain size={80} strokeWidth={1} />
         </div>

         <div className="absolute bottom-6 right-6 bg-[#0a0a0a]/80 backdrop-blur border border-[#30363d] p-4 rounded-xl flex flex-col gap-2 font-mono text-[10px]">
            <div className="flex justify-between w-48 text-[#8b949e]"><span>Global Temp</span><span className="text-[#f85149]">15.4 °C</span></div>
            <div className="flex justify-between w-48 text-[#8b949e]"><span>CO2 Level</span><span className="text-[#e3b341]">285 ppm</span></div>
            <div className="flex justify-between w-48 text-[#8b949e]"><span>Sea Level</span><span className="text-[#58a6ff]">+0.0 m</span></div>
         </div>
      </div>
    </div>
  )
}

function EcosystemView() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] p-10">
      <div className="absolute top-4 left-4 bg-[#161b22]/80 backdrop-blur border border-[#3fb950]/30 px-3 py-1.5 rounded text-[11px] font-bold text-[#3fb950] uppercase tracking-widest z-20 flex items-center gap-2">
        <Leaf size={14} /> Emergent Flora/Fauna System
      </div>

      <div className="w-full h-full relative border border-[#30363d] rounded-2xl bg-[#050505] p-8 shadow-2xl overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(63,185,80,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(63,185,80,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

         {/* Node Graph Mockup */}
         <div className="relative w-[600px] h-[400px]">
             <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#30363d]" strokeWidth="2" strokeDasharray="4,4">
                <line x1="25%" y1="25%" x2="50%" y2="50%" className="animate-pulse" stroke="#f85149" />
                <line x1="50%" y1="50%" x2="75%" y2="75%" className="animate-pulse" stroke="#e3b341" />
                <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="#58a6ff" />
             </svg>
             
             {/* Nodes */}
             <div className="absolute top-[20%] left-[20%] w-24 h-24 rounded-full bg-[#f85149]/10 border-2 border-[#f85149] flex flex-col items-center justify-center text-[10px] text-[#f85149] shadow-[0_0_30px_rgba(248,81,73,0.2)] hover:scale-110 transition-transform cursor-pointer backdrop-blur">
                <span className="font-bold">Apex Predators</span>
                <span className="font-mono">Pop: 12,504</span>
             </div>
             
             <div className="absolute top-[50%] left-[50%] w-32 h-32 rounded-full bg-[#e3b341]/10 border-2 border-[#e3b341] flex flex-col items-center justify-center text-[10px] text-[#e3b341] shadow-[0_0_30px_rgba(227,179,65,0.2)] translate-x-[-50%] translate-y-[-50%] hover:scale-110 transition-transform cursor-pointer backdrop-blur">
                <span className="font-bold">Herbivores</span>
                <span className="font-mono">Pop: 1.2M</span>
             </div>
             
             <div className="absolute bottom-[10%] right-[15%] w-40 h-40 rounded-full bg-[#3fb950]/10 border-2 border-[#3fb950] flex flex-col items-center justify-center text-[10px] text-[#3fb950] shadow-[0_0_30px_rgba(63,185,80,0.2)] hover:scale-110 transition-transform cursor-pointer backdrop-blur">
                <span className="font-bold">Flora (Producers)</span>
                <span className="font-mono">Biomass: 98%</span>
             </div>

             <div className="absolute bottom-[15%] left-[10%] w-20 h-20 rounded-full bg-[#58a6ff]/10 border-2 border-[#58a6ff] flex flex-col items-center justify-center text-[10px] text-[#58a6ff] shadow-[0_0_30px_rgba(88,166,255,0.2)] hover:scale-110 transition-transform cursor-pointer backdrop-blur">
                <span className="font-bold">Aquatic</span>
                <span className="font-mono">Pop: 400K</span>
             </div>
         </div>
      </div>
    </div>
  )
}

function CivilizationView() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] p-10">
      <div className="absolute top-4 left-4 bg-[#161b22]/80 backdrop-blur border border-[#e3b341]/30 px-3 py-1.5 rounded text-[11px] font-bold text-[#e3b341] uppercase tracking-widest z-20 flex items-center gap-2">
        <Network size={14} /> Settlement & Pathfinding
      </div>

      <div className="w-full h-full relative border border-[#30363d] rounded-2xl bg-black p-8 shadow-2xl overflow-hidden">
         {/* Map Background */}
         <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 600">
            <path d="M 100,500 Q 300,200 400,300 T 800,100" fill="none" stroke="#58a6ff" strokeWidth="8" filter="blur(2px)" />
         </svg>
         
         {/* Settlement Nodes & Roads */}
         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600">
            <line x1="300" y1="200" x2="500" y2="350" stroke="#e3b341" strokeWidth="2" opacity="0.6" />
            <line x1="500" y1="350" x2="750" y2="280" stroke="#e3b341" strokeWidth="2" opacity="0.6" />
            <line x1="500" y1="350" x2="450" y2="500" stroke="#e3b341" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
            
            {/* Cities */}
            <circle cx="300" cy="200" r="15" fill="#161b22" stroke="#e3b341" strokeWidth="3" />
            <circle cx="500" cy="350" r="25" fill="#161b22" stroke="#e3b341" strokeWidth="4" />
            <circle cx="750" cy="280" r="12" fill="#161b22" stroke="#e3b341" strokeWidth="2" />
            <circle cx="450" cy="500" r="8" fill="#161b22" stroke="#8b949e" strokeWidth="2" />
            
            {/* Agent dots moving on roads */}
            <circle cx="400" cy="275" r="3" fill="white" className="animate-ping" />
            <circle cx="625" cy="315" r="3" fill="white" className="animate-ping" style={{ animationDelay: '0.5s' }} />
         </svg>

         <div className="absolute top-[50%] left-[50%] bg-[#0a0a0a]/80 backdrop-blur px-2 py-1 border border-[#e3b341] rounded text-[10px] text-white font-mono translate-x-4"> Capital: Apex Prime </div>
         
         <div className="absolute bottom-6 right-6 bg-[#0a0a0a]/80 backdrop-blur border border-[#30363d] p-4 rounded-xl flex flex-col gap-2 font-mono text-[10px]">
            <div className="flex justify-between w-48 text-[#8b949e]"><span>Total Pop</span><span className="text-[#e3b341]">4.2 Billion</span></div>
            <div className="flex justify-between w-48 text-[#8b949e]"><span>Tech Level</span><span className="text-[#bc8cff]">Industrial Age</span></div>
            <div className="flex justify-between w-48 text-[#8b949e]"><span>Settlements</span><span className="text-white">12,402</span></div>
         </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------------------------------------------
// PROPERTIES PANELS
// -------------------------------------------------------------------------------------------------

function NanoMacroProps({ zoomLevel }: { zoomLevel: number }) {
   return (
      <div className="p-6 flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar">
         <div>
            <div className="text-[14px] font-bold text-[#58a6ff] uppercase tracking-wider border-b border-[#30363d] pb-3 flex items-center gap-2">
               <Database size={16}/> Resolution Core
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
               <label className="text-[10px] uppercase font-bold text-[#8b949e]">Active LOD Scale</label>
               <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] font-mono text-[12px] text-white shadow-inner">
                  {zoomLevel < 30 ? 'PLANETARY (1:1M)' : zoomLevel < 70 ? ' CONTINENTAL (1:1000)' : ' MOLECULAR (1:0.01)'}
               </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
               <label className="text-[10px] uppercase font-bold text-[#8b949e]">Detail Instancing Engines</label>
               <div className="space-y-2">
                  <ToggleSwitch label="Nanite Virtualized Geometry" active={true} color="#58a6ff" />
                  <ToggleSwitch label="Hardware Raytracing (Lumen)" active={true} color="#58a6ff" />
                  <ToggleSwitch label="Virtual Shadow Maps" active={false} color="#58a6ff" />
                  <ToggleSwitch label="Procedural Foliage Volumes" active={true} color="#58a6ff" />
               </div>
            </div>
         </div>
         
         <div className="mt-auto bg-[#161b22]/50 border border-[#30363d] p-4 rounded-xl">
            <h4 className="text-[11px] font-bold text-white mb-2 flex items-center gap-2"><Cpu size={14} className="text-[#8b949e]" /> Engine Telemetry</h4>
            <div className="space-y-1 font-mono text-[10px] text-[#8b949e]">
               <div className="flex justify-between"><span>VRAM Usage:</span> <span className="text-[#3fb950]">14.2 GB / 24 GB</span></div>
               <div className="flex justify-between"><span>Draw Calls:</span> <span className="text-white">1,402</span></div>
               <div className="flex justify-between"><span>Poly Count:</span> <span className="text-white">45.2M</span></div>
            </div>
         </div>
      </div>
   )
}

function GeologyProps({ timeProgression, setTimeProgression }: { timeProgression: number, setTimeProgression: any }) {
   return (
      <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
         <div className="text-[14px] font-bold text-[#f85149] uppercase tracking-wider border-b border-[#30363d] pb-3 flex items-center gap-2">
            <Mountain size={16}/> Tectonics & Erosion
         </div>
         
         <div className="flex flex-col gap-3">
            <label className="text-[10px] uppercase font-bold text-[#8b949e]">Mantle & Plates</label>
            <div className="space-y-4 bg-[#161b22] border border-[#30363d] p-4 rounded-xl">
               <SliderControl label="Mantle Heat Plumes" value={80} color="#f85149" />
               <SliderControl label="Tectonic Drift Speed" value={30} color="#f85149" />
               <SliderControl label="Volcanic Activity" value={45} color="#f85149" />
               <div className="pt-2 border-t border-[#30363d]">
                  <button className="w-full py-2 bg-[#f85149]/10 text-[#f85149] border border-[#f85149]/30 hover:bg-[#f85149]/20 rounded text-[11px] font-bold transition-all">Fractionalize Plates</button>
               </div>
            </div>
         </div>

         <div className="flex flex-col gap-3 mt-2">
            <label className="text-[10px] uppercase font-bold text-[#8b949e]">Hydrology & Weathering</label>
            <div className="space-y-4 bg-[#161b22] border border-[#30363d] p-4 rounded-xl">
               <SliderControl label="Hydraulic Erosion" value={75} color="#58a6ff" />
               <SliderControl label="Thermal Weathering" value={40} color="#e3b341" />
               <SliderControl label="River Channel Depth" value={60} color="#58a6ff" />
               <ToggleSwitch label="Dynamic Water Table" active={true} color="#58a6ff" />
            </div>
         </div>
      </div>
   )
}

function ClimateProps() {
   return (
      <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
         <div className="text-[14px] font-bold text-[#bc8cff] uppercase tracking-wider border-b border-[#30363d] pb-3 flex items-center gap-2">
            <Wind size={16}/> Atmosphere / Climate
         </div>
         
         <div className="flex flex-col gap-3">
            <label className="text-[10px] uppercase font-bold text-[#8b949e]">Simulated Factors</label>
            <div className="space-y-4 bg-[#161b22] border border-[#30363d] p-4 rounded-xl">
               <SliderControl label="Axial Tilt (Seasons)" value={23.5} max={90} color="#bc8cff" unit="°" />
               <SliderControl label="Solar Irradiance" value={1361} max={2000} color="#e3b341" unit=" W/m²" />
               <SliderControl label="Atmospheric Density" value={1} max={5} color="#c9d1d9" unit=" atm" />
            </div>
         </div>

         <div className="flex flex-col gap-3 mt-2">
            <label className="text-[10px] uppercase font-bold text-[#8b949e]">Fluid Dynamics (Navier-Stokes)</label>
            <div className="space-y-2">
               <ToggleSwitch label="Coriolis Effect" active={true} color="#bc8cff" />
               <ToggleSwitch label="Hadley/Ferrel Cells" active={true} color="#bc8cff" />
               <ToggleSwitch label="Orographic Lift (Rain Shadow)" active={true} color="#58a6ff" />
               <ToggleSwitch label="Ocean Currents (Thermohaline)" active={true} color="#58a6ff" />
            </div>
         </div>
         
         <button className="mt-4 w-full py-3 bg-[#bc8cff]/10 text-[#bc8cff] border border-[#bc8cff]/30 hover:bg-[#bc8cff]/20 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-2">
            <Workflow size={16} /> Re-Bake Climate Map
         </button>
      </div>
   )
}

function EcosystemProps() {
  return (
    <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
         <div className="text-[14px] font-bold text-[#3fb950] uppercase tracking-wider border-b border-[#30363d] pb-3 flex items-center gap-2">
            <Leaf size={16}/> Food Chain Dynamics
         </div>
         
         <div className="bg-[#161b22] border border-[#3fb950]/30 p-4 rounded-xl flex flex-col gap-3 shadow-[0_0_15px_rgba(63,185,80,0.05)]">
            <div className="flex justify-between items-center border-b border-[#3fb950]/20 pb-2">
               <span className="text-[#c9d1d9] font-bold text-[12px] flex items-center gap-2"><Cpu size={14} className="text-[#3fb950]"/> Evolutionary AI</span>
               <div className="w-8 h-4 bg-[#3fb950]/20 rounded-full border border-[#3fb950] flex items-center p-0.5"><div className="w-3 h-3 bg-[#3fb950] rounded-full translate-x-3 shadow-[0_0_5px_#3fb950]"></div></div>
            </div>
            <p className="text-[#8b949e] text-[11px] leading-relaxed">Agents utilize neural networks to mutate behaviors, migrate, hunt, and reproduce based on local voxel resources. Rulesets are purely emergent.</p>
         </div>

         <div className="bg-[#161b22] border border-[#a371f7]/30 p-4 rounded-xl flex flex-col gap-3 shadow-[0_0_15px_rgba(163,113,247,0.05)]">
            <div className="flex justify-between items-center border-b border-[#a371f7]/20 pb-2">
               <span className="text-white font-bold text-[12px] flex items-center gap-2"><Settings size={14} className="text-[#a371f7]"/> Bio-Evolution Engine & Metamorphosis</span>
               <div className="w-8 h-4 bg-[#a371f7]/20 rounded-full border border-[#a371f7] flex items-center p-0.5"><div className="w-3 h-3 bg-[#a371f7] rounded-full translate-x-3 shadow-[0_0_5px_#a371f7]"></div></div>
            </div>
            <p className="text-[#8b949e] text-[11px] leading-relaxed">Enable real-time entity metamorphosis driven by environmental stress markers.</p>
            <div className="space-y-2 mt-2 bg-[#0a0a0a] border border-[#30363d] p-3 rounded-xl text-[11px]">
               <ToggleSwitch label="Thermal Stress Mutagenesis" active={true} color="#f85149" />
               <ToggleSwitch label="Toxic/Radioactive Melting" active={true} color="#3fb950" />
               <ToggleSwitch label="Convergent Trait Morphing" active={true} color="#58a6ff" />
               <ToggleSwitch label="Predator DNA Consumption" active={false} color="#e3b341" />
            </div>
         </div>

         <div className="flex flex-col gap-3 mt-2">
            <span className="text-[10px] font-bold text-[#8b949e] uppercase">Population Constraints</span>
            <div className="space-y-4 bg-[#0a0a0a] border border-[#30363d] p-4 rounded-xl">
               <SliderControl label="Mutation Rate" value={15} color="#e3b341" />
               <SliderControl label="Stress Tolerance Threshold" value={30} color="#a371f7" />
               <SliderControl label="Metabolism Baseline" value={50} color="#f85149" />
               <SliderControl label="Flora Regrowth Rate" value={80} color="#3fb950" />
            </div>
         </div>

         <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-[#8b949e] uppercase mb-1">Mass Extinction Triggers</span>
            <button className="w-full py-2 bg-[#f85149]/10 text-[#f85149] border border-[#f85149]/30 hover:bg-[#f85149]/20 rounded flex items-center justify-center gap-2 text-[11px] font-bold transition-all"><Flame size={14}/> Trigger Supervolcano</button>
            <button className="w-full py-2 bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/30 hover:bg-[#58a6ff]/20 rounded flex items-center justify-center gap-2 text-[11px] font-bold transition-all"><Snowflake size={14}/> Trigger Ice Age</button>
         </div>
    </div>
  )
}

function CivilizationProps() {
  return (
    <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
         <div className="text-[14px] font-bold text-[#e3b341] uppercase tracking-wider border-b border-[#30363d] pb-3 flex items-center gap-2">
            <Network size={16}/> Societies & Demographics
         </div>
         
         <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-[#8b949e] uppercase">Settlement Logic</span>
            <div className="space-y-2 bg-[#161b22] border border-[#30363d] p-3 rounded-xl text-[11px]">
               <ToggleSwitch label="Spawn Near Water (Rivers/Coasts)" active={true} color="#58a6ff" />
               <ToggleSwitch label="Avoid Extreme Terrains (>45° pitch)" active={true} color="#e3b341" />
               <ToggleSwitch label="Seek Mineral Deposits" active={true} color="#3fb950" />
            </div>
         </div>

         <div className="flex flex-col gap-3 mt-2">
            <span className="text-[10px] font-bold text-[#8b949e] uppercase">Pathfinding Matrix (A*)</span>
            <div className="space-y-4 bg-[#0a0a0a] border border-[#30363d] p-4 rounded-xl">
               <SliderControl label="Road Connectivity Bias" value={85} color="#e3b341" />
               <SliderControl label="Tunnel/Bridge Tolerance" value={40} color="#8b949e" />
               <ToggleSwitch label="Trade Route Generation" active={true} color="#e3b341" />
            </div>
         </div>

         <div className="bg-[#161b22] border border-[#f85149]/30 p-4 rounded-xl mt-4">
             <h4 className="text-[#f85149] font-bold text-[12px] mb-2 flex items-center gap-2"><Flame size={14}/> Conflict Generator</h4>
             <p className="text-[10px] text-[#8b949e] mb-3">Enable borders, resource contention, and political faction simulations based on spatial boundaries.</p>
             <button className="w-full py-2 bg-[#f85149] text-white rounded font-bold text-[11px] hover:bg-[#ff6a64] shadow-[0_4px_10px_rgba(248,81,73,0.3)]">Enable Geopolitics Engine</button>
         </div>
    </div>
  )
}

// GUI Components

function SliderControl({ label, value, max=100, color, unit="" }: any) {
  return (
    <div className="flex flex-col gap-1.5">
       <div className="flex justify-between items-center text-[10px] font-bold">
          <span className="text-[#8b949e] uppercase">{label}</span>
          <span style={{color}} className="font-mono">{value}{unit}</span>
       </div>
       <input type="range" className="w-full h-1.5 bg-[#050505] appearance-none outline-none rounded-full" style={{accentColor: color}} min="0" max={max} defaultValue={value} />
    </div>
  )
}

function ToggleSwitch({ label, active, color }: any) {
  const [isOn, setIsOn] = useState(active);
  return (
     <div className="flex items-center justify-between py-1.5 cursor-pointer group" onClick={() => setIsOn(!isOn)}>
        <span className="text-[11px] text-[#c9d1d9] group-hover:text-white transition-colors">{label}</span>
        <div className={`w-7 h-4 rounded-full flex items-center p-0.5 border transition-all ${isOn ? 'bg-opacity-20' : 'bg-[#0a0a0a] border-[#30363d]'}`} style={{ borderColor: isOn ? color : undefined, backgroundColor: isOn ? `${color}33` : undefined }}>
           <div className={`w-3 h-3 rounded-full transition-all shadow-sm ${isOn ? 'translate-x-3' : 'translate-x-0 bg-[#8b949e]'}`} style={{ backgroundColor: isOn ? color : undefined }}></div>
        </div>
     </div>
  )
}
