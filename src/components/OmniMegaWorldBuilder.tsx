import React, { useState } from 'react';
import { 
  Globe, Trees, Map, Settings2, Brush, Eraser, Layers, Compass, 
  Sun, CloudRain, Droplets, Wind, Mountain, Shovel, Eye, Maximize,
  SlidersHorizontal, Database, Zap, Sparkles, Move, Box, Search, 
  Play, Save, ZoomIn, Target, ChevronDown, Activity, LayoutGrid, BoxSelect, Cpu, Waves, Shield, Castle, Scissors, GripHorizontal, Box as BoxIcon, Network
} from 'lucide-react';

import Viewport3D from './Viewport3D';

export default function OmniMegaWorldBuilder() {
  const [activeModule, setActiveModule] = useState('Terrain'); // Terrain, BSP, PCG, Props, Tiled, Partition
  const [activeTool, setActiveTool] = useState('Sculpt'); // Varies per module
  
  const [worldState, setWorldState] = useState({
     polyCount: '1.2B',
     memory: '42.1GB',
     dimensions: '64km x 64km',
     chunks: 1024
  });

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0a0a] text-[#cccccc] font-sans text-xs overflow-hidden select-none">
      
      {/* 💥 ELITE TOP NAVBAR 💥 */}
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1.5 rounded border border-[#333] shadow-inner items-center gap-2">
                   <Globe size={18} className="text-[#3fb950] animate-pulse"/>
                   <span className="text-white font-black tracking-widest text-[12px] uppercase" style={{textShadow: '0 0 10px rgba(63,185,80,0.5)'}}>Omni MegaWorld Builder</span>
                   <span className="text-[#666] font-mono text-[9px] ml-2">Ultimate Edition</span>
                </div>
                <div className="h-6 w-px bg-[#333]"></div>
                <div className="flex text-[10px] font-mono gap-5 text-[#8b949e]">
                   <span className="flex items-center gap-1" title="World Size"><Map size={12} className="text-[#58a6ff]"/> {worldState.dimensions}</span>
                   <span className="flex items-center gap-1"><Database size={12} className="text-[#bc8cff]"/> RAM: {worldState.memory}</span>
                   <span className="flex items-center gap-1"><LayoutGrid size={12} className="text-[#e3b341]"/> Chunks: {worldState.chunks}</span>
                   <span className="flex items-center gap-1"><Zap size={12} className="text-red-400"/> Poly: {worldState.polyCount}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <button className="px-3 py-1.5 bg-[#1a1a1a] border border-[#333] text-white rounded hover:bg-[#222] transition flex items-center gap-2 font-bold text-[10px]"><Save size={12}/> Commit World State</button>
                 <button className="px-5 py-1.5 bg-gradient-to-r from-[#3fb950] to-[#2ea043] text-white font-black rounded shadow-[0_0_15px_rgba(63,185,80,0.4)] hover:shadow-[0_0_25px_rgba(63,185,80,0.6)] transition flex items-center gap-2 text-[11px] uppercase tracking-widest border border-[#3fb950]"><Play size={12} fill="currentColor"/> Live Sim</button>
            </div>
         </div>

         {/* Meta-Module Ribbon */}
         <div className="flex px-2 bg-[#0a0a0a] border-t border-[#222]">
            <ModuleTab active={activeModule === 'Terrain'} onClick={() => {setActiveModule('Terrain'); setActiveTool('Sculpt');}} icon={<Mountain size={12}/>} label="1. Terrain & Landscape" color="text-[#3fb950]"/>
            <ModuleTab active={activeModule === 'BSP'} onClick={() => {setActiveModule('BSP'); setActiveTool('Blockout');}} icon={<BoxIcon size={12}/>} label="2. BSP Architect" color="text-[#e3b341]"/>
            <ModuleTab active={activeModule === 'PCG'} onClick={() => {setActiveModule('PCG'); setActiveTool('Rules');}} icon={<Network size={12}/>} label="3. PCG Generation" color="text-[#58a6ff]"/>
            <ModuleTab active={activeModule === 'Props'} onClick={() => {setActiveModule('Props'); setActiveTool('Placement');}} icon={<Trees size={12}/>} label="4. Level Design" color="text-[#bc8cff]"/>
            <ModuleTab active={activeModule === 'Tiled'} onClick={() => {setActiveModule('Tiled'); setActiveTool('Tiles');}} icon={<LayoutGrid size={12}/>} label="5. Tiled Mapping" color="text-[#f85149]"/>
            <ModuleTab active={activeModule === 'Partition'} onClick={() => {setActiveModule('Partition'); setActiveTool('Streaming');}} icon={<Layers size={12}/>} label="6. World Partition" color="text-[#888]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* --- LEFT TOOLBAR: DEEP ENGINE PARAMETERS --- */}
        <div className="w-[340px] bg-[#111] border-r border-[#2d2d2d] flex flex-col shrink-0 overflow-hidden shadow-[5px_0_20px_rgba(0,0,0,0.5)] z-20">
           
           {/* Sub-tools based on Active Module */}
           <div className="p-2 border-b border-[#2d2d2d] bg-gradient-to-r from-[#1a1a1a] to-[#111]">
              <div className="flex overflow-x-auto gap-1 hide-scrollbar">
                 {activeModule === 'Terrain' && (
                    <>
                       <SubToolBtn active={activeTool === 'Sculpt'} onClick={() => setActiveTool('Sculpt')} label="Sculpt"/>
                       <SubToolBtn active={activeTool === 'Erosion'} onClick={() => setActiveTool('Erosion')} label="Erosion"/>
                       <SubToolBtn active={activeTool === 'Paint'} onClick={() => setActiveTool('Paint')} label="Paint"/>
                       <SubToolBtn active={activeTool === 'Biomes'} onClick={() => setActiveTool('Biomes')} label="Biomes"/>
                       <SubToolBtn active={activeTool === 'Hydrology'} onClick={() => setActiveTool('Hydrology')} label="Hydrology"/>
                    </>
                 )}
                 {activeModule === 'BSP' && (
                    <>
                       <SubToolBtn active={activeTool === 'Blockout'} onClick={() => setActiveTool('Blockout')} label="Primitives"/>
                       <SubToolBtn active={activeTool === 'Boolean'} onClick={() => setActiveTool('Boolean')} label="CSG Boolean"/>
                       <SubToolBtn active={activeTool === 'Vertex'} onClick={() => setActiveTool('Vertex')} label="Vertex Edit"/>
                    </>
                 )}
                 {activeModule === 'PCG' && (
                    <>
                       <SubToolBtn active={activeTool === 'Rules'} onClick={() => setActiveTool('Rules')} label="Node Rules"/>
                       <SubToolBtn active={activeTool === 'Splines'} onClick={() => setActiveTool('Splines')} label="Spline Paths"/>
                       <SubToolBtn active={activeTool === 'Volumes'} onClick={() => setActiveTool('Volumes')} label="Spawn Volumes"/>
                    </>
                 )}
                 {activeModule === 'Props' && (
                    <>
                       <SubToolBtn active={activeTool === 'Placement'} onClick={() => setActiveTool('Placement')} label="Hand Place"/>
                       <SubToolBtn active={activeTool === 'Physics'} onClick={() => setActiveTool('Physics')} label="Phys-Drop"/>
                       <SubToolBtn active={activeTool === 'Decals'} onClick={() => setActiveTool('Decals')} label="Decals"/>
                    </>
                 )}
                 {activeModule === 'Tiled' && (
                    <>
                       <SubToolBtn active={activeTool === 'Tiles'} onClick={() => setActiveTool('Tiles')} label="Tile Palettes"/>
                       <SubToolBtn active={activeTool === 'AutoTile'} onClick={() => setActiveTool('AutoTile')} label="Auto-Tiling"/>
                       <SubToolBtn active={activeTool === 'Elevation'} onClick={() => setActiveTool('Elevation')} label="Elevation"/>
                    </>
                 )}
                 {activeModule === 'Partition' && (
                    <>
                       <SubToolBtn active={activeTool === 'Streaming'} onClick={() => setActiveTool('Streaming')} label="Chunk Streaming"/>
                       <SubToolBtn active={activeTool === 'LOD'} onClick={() => setActiveTool('LOD')} label="HLOD Setup"/>
                    </>
                 )}
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-5">
              
              {/* TERRAIN MODULE */}
              {activeModule === 'Terrain' && activeTool === 'Sculpt' && (
                 <>
                  <div>
                     <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 block">Brushes</label>
                     <div className="grid grid-cols-2 gap-2">
                        <BrushBtn active={true} icon={<Mountain size={14}/>} label="Raise / Lower"/>
                        <BrushBtn active={false} icon={<Maximize size={14}/>} label="Flatten"/>
                        <BrushBtn active={false} icon={<LayoutGrid size={14}/>} label="Smooth"/>
                        <BrushBtn active={false} icon={<Mountain size={14}/>} label="Ramp"/>
                     </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-[#2d2d2d]">
                     <Slider label="Brush Size" value="512m" color="bg-[#f85149]" percent="40"/>
                     <Slider label="Brush Strength" value="0.8" color="bg-[#f85149]" percent="80"/>
                     <Slider label="Falloff" value="Smooth" color="bg-[#e3b341]" percent="50"/>
                  </div>
                 </>
              )}
              {activeModule === 'Terrain' && activeTool === 'Erosion' && (
                 <>
                   <div className="space-y-2">
                       <ToggleRow label="Hydraulic (Fluvial) Erosion" active={true} color="#58a6ff"/>
                       <ToggleRow label="Thermal Weathering" active={true} color="#e3b341"/>
                       <ToggleRow label="Aeolian (Wind) Transport" active={false} color="#888"/>
                   </div>
                   <div className="space-y-4 pt-4 border-t border-[#2d2d2d]">
                      <Slider label="Rainfall Penetration" value="2.5m" color="bg-[#58a6ff]" percent="45"/>
                      <Slider label="Sediment Carrying Capacity" value="0.12 kg/m³" color="bg-[#8b5a2b]" percent="60"/>
                      <div className="bg-[#0a0a0a] border border-[#333] rounded p-2 text-center text-[#888] hover:text-white hover:border-[#58a6ff] cursor-pointer transition select-none flex items-center justify-center gap-2">
                         <Waves size={14} className="text-[#58a6ff]"/> Simulate Erosion (1,024 Cycles)
                      </div>
                   </div>
                 </>
              )}

              {/* BSP MODULE */}
              {activeModule === 'BSP' && (
                 <>
                   <div>
                     <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 block">CSG Primitives</label>
                     <div className="grid grid-cols-3 gap-2 mb-4">
                        <BrushBtn active={true} icon={<BoxIcon size={14}/>} label="Cube"/>
                        <BrushBtn active={false} icon={<CircleIcon/>} label="Sphere"/>
                        <BrushBtn active={false} icon={<CylinderIcon/>} label="Cylinder"/>
                        <BrushBtn active={false} icon={<StairsIcon/>} label="Stairs"/>
                        <BrushBtn active={false} icon={<ConeIcon/>} label="Cone"/>
                        <BrushBtn active={false} icon={<BoxIcon size={14}/>} label="Plane"/>
                     </div>
                     <ToggleRow label="Additive Brush" active={true} color="#3fb950"/>
                     <ToggleRow label="Subtractive (Hole)" active={false} color="#f85149"/>
                   </div>
                   <div className="space-y-4 pt-4 border-t border-[#2d2d2d]">
                      <Slider label="Grid Snap Size" value="100cm" color="bg-[#58a6ff]" percent="50"/>
                      <button className="w-full bg-[#1a1a1a] border border-[#333] rounded py-1.5 text-white text-[10px] uppercase font-bold hover:bg-[#222]">Convert BSP to Static Mesh</button>
                   </div>
                 </>
              )}

              {/* PCG MODULE */}
              {activeModule === 'PCG' && (
                 <>
                   <div className="space-y-3">
                     <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider block">Node Graph Constraints</label>
                     <div className="bg-[#111] p-2 border border-[#333] rounded flex justify-between items-center text-[10px]">
                        <span className="flex items-center gap-2 text-white"><Map size={12} className="text-[#e3b341]"/> Slope Angle</span>
                        <span className="text-[#888]">15° - 45°</span>
                     </div>
                     <div className="bg-[#111] p-2 border border-[#333] rounded flex justify-between items-center text-[10px]">
                        <span className="flex items-center gap-2 text-white"><Waves size={12} className="text-[#58a6ff]"/> Avoid Water</span>
                        <span className="text-[#888]">&gt; 50m</span>
                     </div>
                     <div className="bg-[#111] p-2 border border-[#333] rounded flex justify-between items-center text-[10px]">
                        <span className="flex items-center gap-2 text-white"><Trees size={12} className="text-[#3fb950]"/> Density Map</span>
                        <span className="text-[#888]">Forest_Mask</span>
                     </div>
                   </div>
                   <button className="w-full mt-4 bg-gradient-to-r from-[#58a6ff]/20 to-transparent border border-[#58a6ff]/50 rounded py-2 text-[#58a6ff] text-[10px] uppercase font-bold hover:bg-[#58a6ff]/30 flex items-center justify-center gap-2">
                       <Network size={14}/> Open Full PCG Graph Editor
                   </button>
                 </>
              )}

              {/* PARTITION MODULE */}
              {activeModule === 'Partition' && (
                 <>
                   <div className="space-y-4">
                      <Slider label="Cell Size" value="256m" color="bg-[#888]" percent="25"/>
                      <Slider label="Loading Range" value="1024m" color="bg-[#bc8cff]" percent="50"/>
                      <Slider label="HLOD Generation Distance" value="2048m" color="bg-[#e3b341]" percent="75"/>
                   </div>
                   <div className="mt-4 p-2 bg-[#1a1a1a] border border-[#333] rounded text-[#888] text-[10px] leading-relaxed">
                     World Partition automatically divides the world into a grid and streams cells based on the camera's location, ensuring optimal memory usage for vast open worlds.
                   </div>
                 </>
              )}

           </div>
        </div>

        {/* --- CENTER VIEWPORT: THE DATA-RICH CANVAS --- */}
        <div className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col group cursor-crosshair ring-1 ring-inset ring-[#222]">
           
           {/* Viewport Toolbar */}
           <div className="absolute top-2 left-2 z-10 flex gap-2">
              <div className="bg-[#111]/90 backdrop-blur border border-[#333] rounded flex overflow-hidden shadow-lg">
                 <button className="px-3 py-1.5 hover:bg-[#222] text-[#888] hover:text-white text-[10px] font-bold border-r border-[#333]">Perspective</button>
                 <button className="px-3 py-1.5 hover:bg-[#222] text-[#888] hover:text-white text-[10px] font-bold border-r border-[#333]">Lit</button>
                 <button className="px-3 py-1.5 hover:bg-[#222] text-[#888] hover:text-[#58a6ff] text-[10px] font-bold flex items-center gap-1"><Maximize size={10}/> Grid</button>
              </div>
           </div>
           
           <div className="absolute top-2 right-2 z-10 flex gap-2">
              <div className="bg-[#111]/90 backdrop-blur border border-[#333] rounded flex overflow-hidden shadow-lg p-1 gap-1">
                 <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#222] text-[#888] hover:text-white" title="Move"><Move size={12}/></button>
                 <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#222] text-[#888] hover:text-white" title="Rotate"><Activity size={12}/></button>
                 <button className="w-6 h-6 flex items-center justify-center rounded bg-[#222] text-[#58a6ff]" title="Scale"><Maximize size={12}/></button>
              </div>
           </div>

           {/* Central 3D Canvas */}
           <div className="flex-1 relative w-full h-full">
              {/* Actual Viewport3D */}
              <div className="absolute inset-0 z-0">
                 <Viewport3D activeTool="OmniWorldBuilder" activeFile={undefined} />
              </div>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-[#555] tracking-widest uppercase flex items-center gap-4 z-10 pointer-events-none">
                  <span>Engine Output: 3D Render Running</span>
                  <span className="w-1 h-1 bg-[#3fb950] rounded-full shadow-[0_0_5px_#3fb950] animate-pulse"></span>
              </div>
           </div>

           {/* Floating Info Panel */}
           <div className="absolute bottom-4 right-4 bg-[#0a0a0a]/80 backdrop-blur border border-[#333] p-2 rounded shadow-2xl z-20 pointer-events-auto min-w-[200px]">
               <div className="text-[10px] text-[#888] font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Target size={12}/> World Coordinates</div>
               <div className="flex flex-col gap-1 font-mono text-[11px] text-[#ccc]">
                  <div className="flex justify-between"><span>X:</span> <span className="text-[#58a6ff]">145,202.44</span></div>
                  <div className="flex justify-between"><span>Y:</span> <span className="text-[#3fb950]">-82,109.11</span></div>
                  <div className="flex justify-between"><span>Z (Elevation):</span> <span className="text-[#e3b341]">+412.5m</span></div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// ------ STYLED COMPONENT HELPERS ------ //

function ModuleTab({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }) {
   return (
      <div 
         onClick={onClick}
         className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer border-t-[2px] transition-colors
         ${active ? `bg-[#111] text-white ${color.replace('text-', 'border-')}` : 'border-transparent text-[#888] hover:bg-[#1a1a1a] hover:text-[#ccc]'}`}
      >
         <span className={active ? color : 'opacity-70'}>{icon}</span> {label}
      </div>
   );
}

function SubToolBtn({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
   return (
      <div 
         onClick={onClick}
         className={`px-3 py-1 text-[10px] rounded cursor-pointer transition-colors whitespace-nowrap
         ${active ? 'bg-[#333] text-white font-bold' : 'text-[#888] hover:text-[#ccc] hover:bg-[#222]'}`}
      >
         {label}
      </div>
   );
}

function BrushBtn({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick?: () => void }) {
   return (
       <div 
         onClick={onClick}
         className={`flex flex-col items-center justify-center p-2 rounded border cursor-pointer transition-all gap-1
         ${active ? 'bg-[#58a6ff]/10 border-[#58a6ff]/50 text-[#58a6ff] shadow-[inset_0_0_10px_rgba(88,166,255,0.1)]' : 'bg-[#1a1a1a] border-[#333] text-[#888] hover:bg-[#222] hover:text-[#ccc]'}`}
       >
          {icon}
          <span className="text-[9px] font-bold whitespace-nowrap">{label}</span>
       </div>
   );
}

function Slider({ label, value, color, percent }: { label: string, value: string, color: string, percent: string }) {
   return (
      <div className="flex flex-col gap-1">
         <div className="flex justify-between items-end">
            <span className="text-[#888] text-[9px] uppercase font-bold tracking-wider">{label}</span>
            <span className="text-white text-[10px] font-mono">{value}</span>
         </div>
         <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden border border-[#333] flex items-center group cursor-pointer">
            <div className={`h-full ${color} w-[${percent}%] relative shadow-[0_0_10px_currentColor]`}></div>
         </div>
      </div>
   );
}

function ToggleRow({ label, active, color }: { label: string, active: boolean, color: string }) {
   return (
      <div className="flex items-center justify-between p-1.5 bg-[#111] border border-[#333] rounded hover:border-[#555] cursor-pointer group transition-colors">
         <span className="text-[#888] text-[10px] group-hover:text-white transition-colors">{label}</span>
         <div className={`w-6 h-3 rounded-full relative transition-colors ${active ? 'bg-opacity-20' : 'bg-[#333]'}`} style={{ backgroundColor: active ? `${color}33` : undefined }}>
            <div className={`absolute top-[1px] w-[10px] h-[10px] rounded-full transition-all ${active ? 'left-[13px]' : 'left-[1px] bg-[#666]'}`} style={{ backgroundColor: active ? color : undefined }}></div>
         </div>
      </div>
   );
}

// Icons
function CircleIcon() { return <div className="w-3.5 h-3.5 rounded-full border-2 border-current"></div>; }
function CylinderIcon() { return <div className="w-3.5 h-3.5 border-2 border-current rounded-[2px]"></div>; }
function StairsIcon() { return <div className="w-3.5 h-3.5 border-b-2 border-l-2 border-current rounded-bl-[2px]"></div>; }
function ConeIcon() { return <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-current"></div>; }
