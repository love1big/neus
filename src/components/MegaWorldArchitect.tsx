import React, { useState } from 'react';
import { 
  Globe, Trees, Map, Settings2, Brush, Eraser, MousePointer2, Layers, Compass, 
  Sun, CloudRain, Droplets, Wind, Mountain, Shovel, Eye, Maximize,
  SlidersHorizontal, Database, Zap, Sparkles, Move, Box, Flower2, Search, Play, Save, ZoomIn, Target, ChevronDown, ListTree, GripVertical, Flame, Thermometer, MapPin, Route, Activity, LayoutGrid, BoxSelect, Cpu, Waves, Shield, Castle
} from 'lucide-react';

export default function MegaWorldArchitect() {
  const [activeTool, setActiveTool] = useState('Geology'); // Geology, Sculpt, Erosion, Biomes, Foliage, Hydrology, Roads, Cities, Atmos, Props
  const [selectedBrush, setSelectedBrush] = useState('Tectonic Push');
  const [activeOverlay, setActiveOverlay] = useState('Topography');
  
  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0a0a] text-[#cccccc] font-sans text-xs overflow-hidden select-none">
      
      {/* 💥 ELITE TOP NAVBAR 💥 */}
      <div className="h-14 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1 rounded border border-[#333] shadow-inner items-center gap-2">
                   <Globe size={16} className="text-[#3fb950] animate-pulse"/>
                   <span className="text-white font-black tracking-widest text-[11px] uppercase" style={{textShadow: '0 0 10px rgba(63,185,80,0.5)'}}>Atlas Mega-Engine</span>
                   <span className="text-[#666] font-mono text-[9px] ml-2">v4.0.9 (Build 8821)</span>
                </div>
                <div className="h-6 w-px bg-[#333]"></div>
                <div className="flex text-[9px] font-mono gap-4 text-[#8b949e]">
                   <span className="flex items-center gap-1" title="Memory Limit: 128GB"><Database size={10} className="text-[#bc8cff]"/> RAM: 42.1GB / 128.0GB</span>
                   <span className="flex items-center gap-1"><Cpu size={10} className="text-[#e3b341]"/> CPU: 84% (64 Threads)</span>
                   <span className="flex items-center gap-1"><Activity size={10} className="text-[#3fb950]"/> VRAM: 18.4GB</span>
                   <span className="flex items-center gap-1"><Zap size={10} className="text-red-400"/> Poly Count: 1.2 Billion</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <button className="px-3 py-1 bg-[#1a1a1a] border border-[#333] text-white rounded hover:bg-[#222] transition flex items-center gap-2 font-bold text-[10px]"><Settings2 size={12}/> Partition Setup</button>
                 <button className="px-5 py-1.5 bg-gradient-to-r from-[#0070d2] to-[#005ea6] text-white font-black rounded shadow-[0_0_15px_rgba(0,112,210,0.6)] hover:shadow-[0_0_25px_rgba(0,112,210,0.8)] transition flex items-center gap-2 text-[11px] uppercase tracking-widest border border-[#308ce6]"><Play size={12} fill="currentColor"/> Bake Mega-Texture</button>
            </div>
         </div>
         {/* Deep Tool Ribbon */}
         <div className="flex overflow-x-auto custom-scrollbar px-2 pb-1 gap-1">
            <RibbonBtn active={activeTool === 'Geology'} onClick={() => setActiveTool('Geology')} icon={<Globe size={12}/>} label="Tectonics & Geology" color="text-[#f85149]"/>
            <RibbonBtn active={activeTool === 'Sculpt'} onClick={() => setActiveTool('Sculpt')} icon={<Shovel size={12}/>} label="Terrain Sculpting" color="text-[#8b949e]"/>
            <RibbonBtn active={activeTool === 'Erosion'} onClick={() => setActiveTool('Erosion')} icon={<Wind size={12}/>} label="Thermal & Wind Erosion" color="text-[#e3b341]"/>
            <RibbonBtn active={activeTool === 'Hydrology'} onClick={() => setActiveTool('Hydrology')} icon={<Waves size={12}/>} label="Hydrology & Rivers" color="text-[#58a6ff]"/>
            <RibbonBtn active={activeTool === 'Biomes'} onClick={() => setActiveTool('Biomes')} icon={<Map size={12}/>} label="Biome Rulesets" color="text-[#3fb950]"/>
            <RibbonBtn active={activeTool === 'Foliage'} onClick={() => setActiveTool('Foliage')} icon={<Trees size={12}/>} label="Foliage Ecosystems" color="text-[#3fb950]"/>
            <RibbonBtn active={activeTool === 'Roads'} onClick={() => setActiveTool('Roads')} icon={<Route size={12}/>} label="Spline Networks" color="text-[#ccc]"/>
            <RibbonBtn active={activeTool === 'Cities'} onClick={() => setActiveTool('Cities')} icon={<Castle size={12}/>} label="Procedural Urbanism" color="text-[#bc8cff]"/>
            <RibbonBtn active={activeTool === 'Atmos'} onClick={() => setActiveTool('Atmos')} icon={<CloudRain size={12}/>} label="Atmosphere & Climate" color="text-[#58a6ff]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* --- LEFT TOOLBAR: DEEP ENGINE PARAMETERS --- */}
        <div className="w-[340px] bg-[#111] border-r border-[#2d2d2d] flex flex-col shrink-0 overflow-hidden shadow-[5px_0_20px_rgba(0,0,0,0.5)] z-20">
           
           <div className="p-2 border-b border-[#2d2d2d] flex items-center justify-between bg-gradient-to-r from-[#1a1a1a] to-[#111]">
              <span className="font-black text-white uppercase tracking-widest text-[11px] drop-shadow-md">{activeTool} Parameters</span>
              <Settings2 size={14} className="text-[#888] hover:text-white cursor-pointer"/>
           </div>

           <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-5">
              
              {activeTool === 'Geology' && (
                 <>
                  <div>
                     <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 block">Tectonic Plate Forces</label>
                     <div className="grid grid-cols-2 gap-2">
                        <BrushBtn active={selectedBrush === 'Tectonic Push'} icon={<Mountain size={14}/>} label="Convergent Push" onClick={() => setSelectedBrush('Tectonic Push')}/>
                        <BrushBtn active={selectedBrush === 'Tectonic Pull'} icon={<Maximize size={14}/>} label="Divergent Rift" onClick={() => setSelectedBrush('Tectonic Pull')}/>
                        <BrushBtn active={selectedBrush === 'Fault Slip'} icon={<LayoutGrid size={14}/>} label="Transform Fault" onClick={() => setSelectedBrush('Fault Slip')}/>
                        <BrushBtn active={selectedBrush === 'Magma Plume'} icon={<Flame size={14}/>} label="Hotspot Uplift" onClick={() => setSelectedBrush('Magma Plume')}/>
                     </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-[#2d2d2d]">
                     <Slider label="Continental Mantle Viscosity" value="4.2 x 10^21" color="bg-[#f85149]" percent="70"/>
                     <Slider label="Subduction Rate" value="50 mm/yr" color="bg-[#f85149]" percent="30"/>
                     <Slider label="Orogeny Multiplier" value="1.85x" color="bg-[#e3b341]" percent="85"/>
                     <div className="bg-[#0a0a0a] border border-[#333] rounded p-2 text-center text-[#888] hover:text-white hover:border-[#555] cursor-pointer transition select-none flex items-center justify-center gap-2">
                        <Activity size={14} className="text-[#f85149]"/> Simulate 1 Million Years
                     </div>
                  </div>
                 </>
              )}

              {activeTool === 'Erosion' && (
                 <>
                  <div>
                     <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 block">Simulated Erosion Models</label>
                     <div className="space-y-2">
                        <ToggleRow label="Hydraulic (Fluvial) Erosion" active={true} color="#58a6ff"/>
                        <ToggleRow label="Thermal Weathering" active={true} color="#e3b341"/>
                        <ToggleRow label="Aeolian (Wind) Transport" active={false} color="#888"/>
                        <ToggleRow label="Glacial Scouring" active={false} color="#ffffff"/>
                     </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-[#2d2d2d]">
                     <Slider label="Rainfall Penetration" value="2.5m" color="bg-[#58a6ff]" percent="45"/>
                     <Slider label="Sediment Carrying Capacity" value="0.12 kg/m³" color="bg-[#8b5a2b]" percent="60"/>
                     <Slider label="Talus Angle (Repose)" value="35.0°" color="bg-[#888]" percent="35"/>
                     <div className="bg-[#0a0a0a] p-2 border border-[#333] rounded flex justify-between">
                         <div className="text-[10px] text-[#aaa]">Simulation Iterations</div>
                         <div className="text-[10px] text-[#3fb950] font-mono">1,024 Cycles</div>
                     </div>
                  </div>
                 </>
              )}

              {activeTool === 'Hydrology' && (
                 <>
                  <div>
                     <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 flex justify-between">
                        <span>River Network Generation</span>
                        <span className="text-[#58a6ff] cursor-pointer hover:underline">Calculate Flow</span>
                     </label>
                     <Slider label="Spring Generation Threshold" value="0.85" color="bg-[#58a6ff]" percent="85"/>
                     <Slider label="River Meander Wavelength" value="450m" color="bg-[#3fb950]" percent="45"/>
                     <Slider label="Oxbow Lake Probability" value="12%" color="bg-[#3a6e7a]" percent="12"/>
                     <Slider label="Delta Branching Factor" value="3.5" color="bg-[#4a8a9a]" percent="70"/>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-[#2d2d2d]">
                     <div className="text-[10px] text-white font-bold mb-2">Simulated Aquifers</div>
                     <ToggleRow label="Groundwater Permeability" active={true} color="#bc8cff"/>
                     <ToggleRow label="Karst Topography (Sinkholes)" active={true} color="#bc8cff"/>
                  </div>
                 </>
              )}

              {activeTool === 'Biomes' && (
                 <>
                  <div>
                     <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 block">Whittaker Biome Rules</label>
                     <div className="w-full h-32 bg-gradient-to-tr from-[#3fb950] via-[#e3b341] to-[#f85149] rounded border border-[#333] relative overflow-hidden mb-4 shadow-[0_0_15px_rgba(0,0,0,0.5)] inset-shadow">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] pointer-events-none mix-blend-overlay"></div>
                        <div className="absolute top-2 left-2 text-[9px] font-bold text-white drop-shadow-md">T. Rainforest</div>
                        <div className="absolute bottom-2 right-2 text-[9px] font-bold text-white drop-shadow-md">Desert</div>
                        <div className="absolute top-2 right-2 text-[9px] font-bold text-black drop-shadow-md">Savanna</div>
                        <div className="absolute bottom-2 left-2 text-[9px] font-bold text-white drop-shadow-md">Tundra</div>
                        
                        {/* Cursor simulating Whittaker graph point */}
                        <div className="absolute top-[40%] left-[30%] w-2 h-2 bg-white rounded-full border border-black shadow-[0_0_10px_white]"></div>
                     </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-[#2d2d2d]">
                     <Slider label="Global Temp Offset" value="+1.2°C" color="bg-[#f85149]" percent="60"/>
                     <Slider label="Global Precipitation" value="1200 mm/yr" color="bg-[#58a6ff]" percent="50"/>
                     <Slider label="Elevation Lapse Rate" value="-6.5°C / km" color="bg-[#bc8cff]" percent="65"/>
                  </div>
                  <div className="pt-4 border-t border-[#2d2d2d] space-y-2">
                     <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 block">Biome Map Layers</label>
                     <div className="bg-[#111] border border-[#333] p-1.5 rounded flex justify-between items-center text-[10px] group cursor-pointer hover:border-[#555]">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#1b4d24]"></span> Boreal Forest</span>
                        <span className="text-[#888] group-hover:text-white">Edit Splat Map</span>
                     </div>
                     <div className="bg-[#111] border border-[#333] p-1.5 rounded flex justify-between items-center text-[10px] group cursor-pointer hover:border-[#555]">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#d2b48c]"></span> Arid Steppe</span>
                        <span className="text-[#888] group-hover:text-white">Edit Splat Map</span>
                     </div>
                  </div>
                 </>
              )}

              {activeTool === 'Cities' && (
                 <>
                  <div>
                     <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 block">Procedural Urban Generator</label>
                     <Slider label="Population Density Target" value="12,500/km²" color="bg-[#bc8cff]" percent="75"/>
                     <Slider label="City Radius Limit" value="15.0 km" color="bg-[#888]" percent="50"/>
                     <Slider label="Commercial Zoning" value="18%" color="bg-[#e3b341]" percent="18"/>
                     <Slider label="Industrial Zoning" value="12%" color="bg-[#f85149]" percent="12"/>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-[#2d2d2d]">
                     <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 block">Street Network Algorithms</label>
                     <select className="w-full bg-[#0a0a0a] border border-[#333] text-white text-[10px] p-2 rounded outline-none">
                        <option>Organic (Topography Adherent)</option>
                        <option>Radial (Concentric Hubs)</option>
                        <option>Grid (Manhattan Block)</option>
                        <option>Tensor Field (Advanced L-System)</option>
                     </select>
                     <ToggleRow label="Snap roads to river banks" active={true} color="#58a6ff"/>
                     <ToggleRow label="Generate Bridges Auto" active={true} color="#888"/>
                  </div>
                  <div className="mt-4 bg-[#bc8cff]/10 border border-[#bc8cff]/30 p-2 rounded text-center cursor-pointer hover:bg-[#bc8cff]/20 transition flex items-center justify-center gap-2">
                     <Castle size={12} className="text-[#bc8cff]"/> <span className="text-[#bc8cff] font-bold text-[10px] uppercase tracking-widest ">Generate Metropolis</span>
                  </div>
                 </>
              )}

              {/* Add deep parameters for others if needed */}
              {(activeTool === 'Sculpt' || activeTool === 'Foliage' || activeTool === 'Atmos' || activeTool === 'Props' || activeTool === 'Roads') && (
                 <div className="flex flex-col items-center justify-center h-40 text-[#666] border border-dashed border-[#333] rounded">
                    <Activity size={24} className="mb-2 opacity-50"/>
                    <span>Deep parameters initialized.</span>
                 </div>
              )}
           </div>
        </div>

        {/* --- CENTER VIEWPORT: THE DATA-RICH CANVAS --- */}
        <div className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col group cursor-crosshair ring-1 ring-inset ring-[#222]">
            
            {/* Overlay Toggles */}
            <div className="absolute top-3 right-3 z-30 flex bg-[#0a0a0a]/90 backdrop-blur border border-[#333] rounded overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
               <OverlayBtn active={activeOverlay === 'Topography'} onClick={() => setActiveOverlay('Topography')} label="Topography" />
               <OverlayBtn active={activeOverlay === 'Heatmap'} onClick={() => setActiveOverlay('Heatmap')} label="Temp Heatmap" color="text-red-400" />
               <OverlayBtn active={activeOverlay === 'Moisture'} onClick={() => setActiveOverlay('Moisture')} label="Moisture" color="text-[#58a6ff]" />
               <OverlayBtn active={activeOverlay === 'Tectonic'} onClick={() => setActiveOverlay('Tectonic')} label="Plates/Stress" color="text-[#bc8cff]" />
               <OverlayBtn active={activeOverlay === 'Urban'} onClick={() => setActiveOverlay('Urban')} label="Zoning" color="text-[#e3b341]" />
               <OverlayBtn active={activeOverlay === 'Wireframe'} onClick={() => setActiveOverlay('Wireframe')} label="Mesh" />
            </div>

            {/* Diagnostic Logs Top Left */}
            <div className="absolute top-3 left-3 z-30 flex flex-col gap-0.5 pointer-events-none">
               <div className="text-[9px] font-mono text-[#3fb950] font-bold drop-shadow-[0_1px_2px_black] bg-black/50 px-1 rounded w-max">LOD_0 Verts: 4.8M</div>
               <div className="text-[9px] font-mono text-[#58a6ff] font-bold drop-shadow-[0_1px_2px_black] bg-black/50 px-1 rounded w-max mt-0.5">Hydraulic Nodes: 240,192</div>
               <div className="text-[9px] font-mono text-[#f85149] font-bold drop-shadow-[0_1px_2px_black] bg-black/50 px-1 rounded w-max mt-0.5">Erosion Deltas Processing...</div>
               <div className="text-[9px] font-mono text-[#e3b341] font-bold drop-shadow-[0_1px_2px_black] bg-black/50 px-1 rounded w-max mt-0.5">City Blocks: 4,092</div>
            </div>

            {/* THE RENDERING CONTEXT (Simulated) */}
            <div className={`absolute inset-0 transition-colors duration-1000 ${
               activeOverlay === 'Topography' ? 'bg-[#1a211a]' : 
               activeOverlay === 'Heatmap' ? 'bg-gradient-to-tr from-[#000080] via-[#00ff00] to-[#ff0000]' : 
               activeOverlay === 'Moisture' ? 'bg-[#001f3f]' :
               activeOverlay === 'Tectonic' ? 'bg-[#111111]' :
               activeOverlay === 'Urban' ? 'bg-[#1e1e1e]' : 'bg-[#000]'
            } overflow-hidden`}>
               
               {/* Base Grid */}
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>

               {/* Central Map Entity Container (Scaled and Transformed to look like a huge 3D plane) */}
               <div className="absolute top-1/2 left-1/2 w-[2400px] h-[1800px] border border-[#333] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col items-center justify-center pointer-events-none" 
                    style={{ transform: 'translate(-50%, -50%) rotateX(50deg) rotateZ(-30deg) scale(0.6)', transformStyle: 'preserve-3d' }}>
                  
                  {/* Topography View */}
                  {activeOverlay === 'Topography' && (
                     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC4wMSIgbnVtT2N0YXZlcz0iOCIgc2VlZD0iNDIiLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMC4xIDAgMCAwIDAuMSAgMCAwLjQgMCAwIDAuNCAgMCAwIDAuMSAwIDAuMSAgMCAwIDAgMSAwIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==')] opacity-100 bg-cover mix-blend-screen shadow-inner">
                        {/* Fake Mountains Relief */}
                        <div className="absolute top-[20%] left-[30%] w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)] mix-blend-overlay opacity-80 blur-xl"></div>
                        <div className="absolute bottom-[30%] right-[20%] w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.6)_0%,transparent_70%)] mix-blend-overlay opacity-60 blur-lg"></div>
                        {/* Deep Ocean Trench */}
                        <div className="absolute top-[40%] right-[10%] w-[200px] h-[1000px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.9)_0%,transparent_70%)] mix-blend-multiply opacity-80 blur-xl rotate-45 transform origin-center"></div>
                     </div>
                  )}

                  {/* Rivers / Hydrology Network (Rendered in Most Views) */}
                  {(activeOverlay === 'Topography' || activeOverlay === 'Moisture' || activeOverlay === 'Urban') && (
                     <svg className="absolute inset-0 w-full h-full opacity-80 filter drop-shadow-[0_0_10px_rgba(88,166,255,0.8)]">
                         <path d="M 1200 400 Q 1300 600 1100 800 T 1300 1200 T 1600 1800" fill="none" stroke="#58a6ff" strokeWidth="12" strokeLinecap="round" />
                         <path d="M 800 600 Q 900 700 1100 800" fill="none" stroke="#58a6ff" strokeWidth="6" strokeLinecap="round" />
                         <path d="M 600 500 Q 700 550 800 600" fill="none" stroke="#58a6ff" strokeWidth="3" strokeLinecap="round" />
                         <path d="M 1500 1000 Q 1400 1100 1300 1200" fill="none" stroke="#58a6ff" strokeWidth="8" strokeLinecap="round" />
                     </svg>
                  )}

                  {/* Tectonic Overlay */}
                  {activeOverlay === 'Tectonic' && (
                     <svg className="absolute inset-0 w-full h-full opacity-90">
                        <path d="M 400 0 L 600 500 L 500 1000 L 800 1800" fill="none" stroke="#f85149" strokeWidth="8" strokeDasharray="30 20" />
                        <path d="M 1600 0 L 1400 600 L 1700 1200 L 1500 1800" fill="none" stroke="#e3b341" strokeWidth="6" />
                        
                        <polygon points="500,750 530,730 530,770" fill="#f85149" />
                        <polygon points="550,500 580,480 580,520" fill="#f85149" />
                        
                        <circle cx="1400" cy="600" r="200" fill="url(#stressGrad)" opacity="0.6"/>
                        <circle cx="600" cy="500" r="300" fill="url(#stressGrad2)" opacity="0.8"/>
                        
                        <defs>
                           <radialGradient id="stressGrad">
                              <stop offset="0%" stopColor="#bc8cff"/>
                              <stop offset="100%" stopColor="transparent"/>
                           </radialGradient>
                           <radialGradient id="stressGrad2">
                              <stop offset="0%" stopColor="#f85149"/>
                              <stop offset="100%" stopColor="transparent"/>
                           </radialGradient>
                        </defs>
                     </svg>
                  )}

                  {/* Procedural Cities Zoning */}
                  {activeOverlay === 'Urban' && (
                     <div className="absolute inset-0 pointer-events-auto">
                        <div className="absolute top-[1100px] left-[1250px] w-[400px] h-[400px] rounded-full border-2 border-dashed border-[#bc8cff] bg-[#bc8cff]/10 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair group hover:bg-[#bc8cff]/20">
                            <div className="absolute w-[150px] h-[150px] bg-[#f85149]/40 rounded-full blur-[10px]"></div>
                            <div className="absolute w-[250px] h-[250px] border-[20px] border-[#e3b341]/30 rounded-full blur-[5px]"></div>
                            <svg className="absolute inset-0 w-full h-full opacity-50">
                               <line x1="200" y1="200" x2="0" y2="0" stroke="#ccc" strokeWidth="4" />
                               <line x1="200" y1="200" x2="400" y2="0" stroke="#ccc" strokeWidth="4" />
                               <line x1="200" y1="200" x2="400" y2="400" stroke="#ccc" strokeWidth="4" />
                               <line x1="200" y1="200" x2="0" y2="400" stroke="#ccc" strokeWidth="4" />
                               <rect x="150" y="150" width="100" height="100" fill="none" stroke="#bc8cff" strokeWidth="2" strokeDasharray="10 10"/>
                            </svg>
                            <span className="absolute -top-10 text-white font-bold text-2xl drop-shadow-[0_2px_5px_black]">Nexus Prime (Cap.) <br/><span className="text-sm font-mono text-[#bc8cff]">Pop: 4.2M</span></span>
                        </div>
                        
                        <div className="absolute top-[500px] left-[700px] w-[200px] h-[200px] rounded-full border border-dashed border-[#e3b341] bg-[#e3b341]/10 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
                            <div className="absolute w-[80px] h-[80px] bg-[#f85149]/40 rounded-full blur-[5px]"></div>
                            <span className="absolute -top-10 text-white font-bold text-xl drop-shadow-[0_2px_5px_black]">Riverguard <br/><span className="text-sm font-mono text-[#e3b341]">Pop: 850K</span></span>
                        </div>
                     </div>
                  )}

                  {/* Wireframe (Mesh) view */}
                  {activeOverlay === 'Wireframe' && (
                     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGw0MCA0ME00MCAwbC00MCA0ME0wIDIwaDQwTTIwIDB2NDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDI1NSw4MCwwLjMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-80 mix-blend-screen bg-repeat"></div>
                  )}

               </div>
               
               {/* 3D Space Depth Fog */}
               <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10"></div>
               <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-10"></div>
            </div>

        </div>

        {/* --- RIGHT PANEL: RAW DATA OUTLINER & STRATIGRAPHY --- */}
        <div className="w-[300px] bg-[#141414] border-l border-[#2d2d2d] flex flex-col shrink-0 shadow-[-5px_0_20px_rgba(0,0,0,0.5)] z-20">
           <div className="p-2 border-b border-[#2d2d2d] bg-[#1a1a1a]">
              <div className="bg-[#0a0a0a] border border-[#333] rounded flex items-center px-2 py-1.5 focus-within:border-[#58a6ff] transition-colors">
                 <Search size={12} className="text-[#666]"/>
                 <input type="text" placeholder="Search Mega-Entities..." className="bg-transparent border-none outline-none text-white px-2 w-full text-[10px] placeholder:text-[#555]" />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1 text-[10px]">
              
              <OutlinerFolder name="Tectonic Framework" icon={<Activity size={12} className="text-[#f85149]"/>} open>
                 <OutlinerItem name="Plate_Eurasia_01" active />
                 <OutlinerItem name="Plate_Pacific_02" />
                 <OutlinerItem name="FaultLine_San_Andreas" />
                 <OutlinerItem name="MantlePlume_Hotspot_A" />
              </OutlinerFolder>

              <OutlinerFolder name="Stratigraphy (Deep Layers)" icon={<Layers size={12} className="text-[#8b949e]"/>}>
                 <OutlinerItem name="Bedrock_Granite_Layer" />
                 <OutlinerItem name="Sediment_Limestone_Karst" />
                 <OutlinerItem name="Aquifer_Deep_Zone" />
                 <OutlinerItem name="Topsoil_Organic_01" />
              </OutlinerFolder>

              <OutlinerFolder name="Atmospheric Volume" icon={<CloudRain size={12} className="text-[#58a6ff]"/>}>
                 <OutlinerItem name="Jetstream_VectorField" />
                 <OutlinerItem name="VolumetricCloud_Layer_Low" />
                 <OutlinerItem name="VolumetricCloud_Layer_High" />
                 <OutlinerItem name="GlobalIllumination_Sun" />
                 <OutlinerItem name="Raytraced_Skylight" />
              </OutlinerFolder>

              <OutlinerFolder name="Procedural City Hubs" icon={<Castle size={12} className="text-[#bc8cff]"/>} open>
                 <OutlinerItem name="Hub_NexusPrime" />
                 <OutlinerItem name="Hub_Riverguard" />
                 <OutlinerItem name="NavMesh_Pedestrian_Global" />
                 <OutlinerItem name="TrafficSpline_Highway_Network" />
              </OutlinerFolder>

              <OutlinerFolder name="Hydrologic Spawners" icon={<Waves size={12} className="text-[#58a6ff]"/>}>
                 <OutlinerItem name="RiverSource_Glacial_01" />
                 <OutlinerItem name="Lake_Basin_Crater" />
                 <OutlinerItem name="Ocean_Volume_Global" />
              </OutlinerFolder>

           </div>

           {/* Mini Inspector for Selected Entity */}
           <div className="h-48 border-t border-[#2d2d2d] bg-[#111] shrink-0 flex flex-col p-2 overflow-y-auto custom-scrollbar">
              <div className="font-bold text-[11px] text-white flex items-center gap-2 mb-2"><Activity size={12} className="text-[#f85149]"/> Plate_Eurasia_01</div>
              <div className="space-y-1">
                 <PropRow label="Entity Type" value="Tectonic Simulation Node" />
                 <PropRow label="Area" value="84,241,000 km²" />
                 <PropRow label="Velocity Vector" value="<0.4, -0.1, 0.0>" />
                 <PropRow label="Density" value="2.7 g/cm³" />
                 <div className="mt-2 bg-[#1a1a1a] border border-[#333] p-1.5 rounded">
                    <span className="text-[#888] font-bold text-[9px] block mb-1">Stress Computation</span>
                    <div className="w-full bg-[#000] h-1.5 rounded-full overflow-hidden border border-[#222]">
                       <div className="h-full bg-gradient-to-r from-[#bc8cff] to-[#f85149]" style={{width: '92%'}}></div>
                    </div>
                    <div className="text-[9px] text-[#f85149] font-mono mt-1 w-full text-right">Yield limit approaching</div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponents

function RibbonBtn({active, icon, label, color, onClick}: {active: boolean, icon: React.ReactNode, label: string, color: string, onClick: () => void}) {
   return (
      <button onClick={onClick} className={`px-3 py-1.5 rounded transition font-bold flex items-center gap-1.5 whitespace-nowrap text-[10px] ${active ? 'bg-[#222] text-white shadow-inner border border-[#444]' : 'bg-transparent text-[#888] hover:bg-[#1a1a1a] hover:text-[#ccc] border border-transparent'}`}>
         <span className={`${active ? color : ''}`}>{icon}</span> <span>{label}</span>
      </button>
   );
}

function BrushBtn({active, icon, label, onClick}: {active: boolean, icon: React.ReactNode, label: string, onClick: () => void}) {
   return (
      <button onClick={onClick} className={`flex flex-col items-center gap-1.5 p-2 rounded transition border ${active ? 'bg-[#1a1a1a] border-[#e3b341] text-white shadow-[inset_0_0_10px_rgba(227,179,65,0.2)]' : 'bg-[#0a0a0a] border-[#333] text-[#888] hover:bg-[#141414] hover:text-[#ccc]'}`}>
         {icon}
         <span className="text-[9px] uppercase font-bold text-center leading-tight">{label}</span>
      </button>
   );
}

function Slider({label, value, color, percent}: {label: string, value: string, color: string, percent: string}) {
   return (
      <div className="bg-[#0a0a0a] border border-[#333] rounded px-2 py-1.5">
         <div className="flex justify-between items-center mb-1">
            <span className="text-[#aaa] font-bold text-[9px] uppercase">{label}</span>
            <span className="text-[#fff] font-mono text-[9px] bg-[#222] px-1 rounded shadow-inner">{value}</span>
         </div>
         <div className="w-full bg-[#111] h-[3px] rounded-full overflow-hidden border border-[#222]">
            <div className={`h-full ${color}`} style={{width: `${percent}%`}}></div>
         </div>
      </div>
   );
}

function ToggleRow({label, active, color}: {label: string, active: boolean, color: string}) {
   return (
      <div className="flex justify-between items-center bg-[#0a0a0a] border border-[#333] px-2 py-1.5 rounded cursor-pointer hover:border-[#555] group">
         <span className={`text-[10px] font-bold ${active ? 'text-white' : 'text-[#666] group-hover:text-[#888]'}`}>{label}</span>
         <div className={`w-6 h-3 rounded-full relative transition-colors ${active ? '' : 'bg-[#222]'}`} style={{backgroundColor: active ? color : undefined}}>
            <div className={`w-2.5 h-2.5 rounded-full bg-white absolute top-[1px] transition-transform ${active ? 'translate-x-[12px]' : 'translate-x-[1px]'}`}></div>
         </div>
      </div>
   );
}

function OverlayBtn({active, label, color, onClick}: {active: boolean, label: string, color?: string, onClick: () => void}) {
   return (
      <button onClick={onClick} className={`px-2 py-1 text-[9px] font-bold uppercase transition ${active ? 'bg-[#333] text-white' : 'text-[#888] hover:bg-[#222] hover:text-white'}`}>
         <span className={active ? color : ''}>{label}</span>
      </button>
   );
}

function OutlinerFolder({name, icon, open, children}: {name: string, icon: React.ReactNode, open?: boolean, children: React.ReactNode}) {
   return (
      <div className="select-none">
         <div className="flex items-center gap-1.5 px-1 py-1 text-[#ccc] hover:bg-[#222] rounded cursor-pointer group text-[10px] font-bold">
            <ChevronDown size={12} className={`text-[#666] group-hover:text-white transition-transform ${open ? '' : '-rotate-90'}`} />
            {icon} {name}
         </div>
         <div className={`pl-4 border-l border-[#333] ml-2 ${open ? 'block' : 'hidden'}`}>
            {children}
         </div>
      </div>
   );
}

function OutlinerItem({name, active}: {name: string, active?: boolean}) {
   return (
      <div className={`flex justify-between items-center px-1 py-1 rounded cursor-pointer text-[9px] ${active ? 'bg-[#004a77] text-white font-bold' : 'text-[#888] hover:bg-[#222] hover:text-[#ccc]'}`}>
         <div className="flex items-center gap-2 truncate">
            <div className={`w-1 h-1 rounded-full ${active ? 'bg-[#58a6ff]' : 'bg-[#444]'}`}></div>
            {name}
         </div>
         <Eye size={10} className="text-[#555] hover:text-white opacity-0 group-hover:opacity-100"/>
      </div>
   );
}

function PropRow({label, value}: {label: string, value: string}) {
   return (
      <div className="flex justify-between items-center text-[9px]">
         <span className="text-[#888]">{label}</span>
         <span className="text-white font-mono">{value}</span>
      </div>
   );
}
