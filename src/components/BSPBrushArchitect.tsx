import React, { useState } from 'react';
import { Box, Layers, MousePointer2, Move, Grid, Settings2, Scissors, PaintBucket, Hammer, Wrench, Spline, Plus, Rotate3D, Scan, Maximize, Play, Save } from 'lucide-react';

export default function BSPBrushArchitect() {
  const [gridSize, setGridSize] = useState(16);
  const [activeTool, setActiveTool] = useState('add');

  return (
    <div className="flex flex-col h-full bg-[#0d0d10] text-[#eee] font-sans overflow-hidden">
       {/* Top Bar Navigation */}
       <div className="px-4 py-2 border-b border-[#222] bg-[#1a1a20] flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-[#e3b341] to-[#f85149] rounded flex items-center justify-center text-black">
                <Box size={18} />
             </div>
             <div>
                <h2 className="text-[14px] font-black tracking-widest uppercase text-white flex items-center gap-2">
                   BSP Brush Architect & Level Blockout <span className="px-1.5 py-[1px] bg-[#e3b341] text-black text-[9px] rounded font-bold">MANUAL</span>
                </h2>
                <div className="flex gap-4 text-[9px] text-[#888] font-mono mt-0.5">
                   <span>Grid: {gridSize} UU</span>
                   <span>Snap: ON</span>
                   <span>Mode: Additive</span>
                </div>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="bg-[#222] hover:bg-[#333] border border-[#444] px-3 py-1 flex items-center gap-2 text-xs font-bold rounded text-[#ccc]"><Save size={14}/> Save Map</button>
             <button className="bg-[#3fb950] hover:bg-[#2ea043] text-black px-4 py-1 flex items-center gap-2 text-xs font-bold rounded shadow-lg shadow-[#3fb950]/20"><Play size={14}/> Build Geometry</button>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden">
          
          {/* Main Left Toolbar */}
          <div className="w-[50px] bg-[#111] border-r border-[#222] flex flex-col items-center py-2 gap-2 relative z-10 shrink-0">
              <button 
                onClick={() => setActiveTool('select')}
                className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${activeTool === 'select' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50' : 'text-[#888] hover:text-white hover:bg-[#222]'}`} title="Select Object (S)">
                <MousePointer2 size={18}/>
              </button>
              <button 
                onClick={() => setActiveTool('move')}
                className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${activeTool === 'move' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50' : 'text-[#888] hover:text-white hover:bg-[#222]'}`} title="Move Tool (W)">
                <Move size={18}/>
              </button>
              <button 
                onClick={() => setActiveTool('rotate')}
                className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${activeTool === 'rotate' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50' : 'text-[#888] hover:text-white hover:bg-[#222]'}`} title="Rotate Tool (E)">
                <Rotate3D size={18}/>
              </button>

              <div className="w-6 h-[1px] bg-[#333] my-1"></div>

              <button 
                onClick={() => setActiveTool('add')}
                className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${activeTool === 'add' ? 'bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/50' : 'text-[#888] hover:text-white hover:bg-[#222]'}`} title="Draw BSP Brush">
                <Plus size={20}/>
              </button>
              <button 
                onClick={() => setActiveTool('clip')}
                className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${activeTool === 'clip' ? 'bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/50' : 'text-[#888] hover:text-white hover:bg-[#222]'}`} title="Clip/Cut Brush">
                <Scissors size={18}/>
              </button>
              <button 
                onClick={() => setActiveTool('paint')}
                className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${activeTool === 'paint' ? 'bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/50' : 'text-[#888] hover:text-white hover:bg-[#222]'}`} title="Face Properties / Material">
                <PaintBucket size={18}/>
              </button>
          </div>

          {/* Quad Viewport Array (Hammer style) */}
          <div className="flex-1 bg-black relative flex flex-col">
             {/* Dynamic Layout Control Toolbar */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex gap-1 pointer-events-none opacity-20">
                <div className="w-[2px] h-[400px] bg-[#333]"></div>
                <div className="absolute top-1/2 left-[-200px] right-[-200px] h-[2px] bg-[#333] -translate-y-1/2 pointer-events-none"></div>
             </div>

             {/* 4 Split Views */}
             <div className="flex-1 grid grid-cols-2 grid-rows-2 relative border-l border-[#222] z-10 p-0.5 gap-0.5 bg-[#222]">
                
                {/* Viewport 1 (Top) XY Orthographic */}
                <div className="bg-[#0f0f12] relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[#0f0f12]" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`, backgroundSize: `${Math.max(10, gridSize)}px ${Math.max(10, gridSize)}px` }}></div>
                   {/* Thicker primary grid lines */}
                   <div className="absolute inset-0 bg-transparent" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: `${Math.max(10, gridSize) * 8}px ${Math.max(10, gridSize) * 8}px` }}></div>
                   <div className="absolute left-0 bottom-1/2 w-full h-[1px] bg-[#3fb950] opacity-50"></div> {/* X Axis */}
                   <div className="absolute left-1/2 bottom-0 w-[1px] h-full bg-[#f85149] opacity-50"></div> {/* Y Axis */}
                   
                   <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 rounded backdrop-blur text-[10px] font-bold text-white shadow-sm border border-[#333]">Top (X/Y)</span>
                   
                   {/* Draw Brush Wireframe Simulation */}
                   <div className="absolute top-[30%] left-[40%] w-[30%] h-[40%] border-2 border-white pointer-events-none drop-shadow-[0_0_2px_#fff]"></div>
                   <div className="absolute top-[20%] left-[20%] w-[15%] h-[20%] border border-[#3fb950] bg-[#3fb950]/10 pointer-events-none"></div>
                </div>

                {/* Viewport 2 (Perspective 3D) */}
                <div className="bg-[#111] relative overflow-hidden group">
                   <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 rounded backdrop-blur text-[10px] font-bold text-[#e3b341] shadow-sm border border-[#333] z-10 flex items-center gap-1"><Scan size={10}/> 3D Shaded</span>
                   
                   {/* Simulated 3D Projection */}
                   <div className="absolute inset-0 flex items-center justify-center">
                       {/* Box */}
                       <div className="w-[120px] h-[120px] bg-[#333] relative rotate-x-[60deg] rotate-y-45 border border-[#555] shadow-2xl flex items-center justify-center" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}>
                           <div className="absolute inset-0 bg-[#e3b341]/20 border-2 border-[#e3b341]"></div>
                       </div>
                       <div className="w-[60px] h-[60px] bg-[#3fb950] relative rotate-x-[60deg] rotate-y-45 absolute left-[20%] bottom-[30%] border border-green-300 shadow-2xl" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}>
                           <div className="absolute inset-0 border-2 border-[#3fb950] bg-[#3fb950]/40"></div>
                       </div>
                   </div>

                   {/* Lighting/Render Mode Overlay */}
                   <div className="absolute right-2 top-2 flex gap-1">
                      <button className="w-5 h-5 bg-black/60 rounded text-[#888] flex items-center justify-center hover:text-white border border-[#333]"><Wrench size={10}/></button>
                      <button className="w-5 h-5 bg-black/60 rounded text-[#888] flex items-center justify-center hover:text-white border border-[#333]"><Maximize size={10}/></button>
                   </div>
                </div>

                {/* Viewport 3 (Front) XZ Orthographic */}
                <div className="bg-[#0f0f12] relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[#0f0f12]" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`, backgroundSize: `${Math.max(10, gridSize)}px ${Math.max(10, gridSize)}px` }}></div>
                   <div className="absolute inset-0 bg-transparent" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: `${Math.max(10, gridSize) * 8}px ${Math.max(10, gridSize) * 8}px` }}></div>
                   <div className="absolute left-0 top-[60%] w-full h-[1px] bg-[#3fb950] opacity-50"></div> {/* X Axis */}
                   <div className="absolute left-1/2 bottom-0 w-[1px] h-full bg-[#58a6ff] opacity-50"></div> {/* Z Axis */}

                   <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 rounded backdrop-blur text-[10px] font-bold text-white shadow-sm border border-[#333]">Front (X/Z)</span>
                   
                   {/* Draw Brush Wireframe Simulation */}
                   <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] border-2 border-white pointer-events-none drop-shadow-[0_0_2px_#fff]"></div>
                   <div className="absolute top-[40%] left-[20%] w-[15%] h-[20%] border border-[#3fb950] bg-[#3fb950]/10 pointer-events-none"></div>
                </div>

                {/* Viewport 4 (Side) YZ Orthographic */}
                <div className="bg-[#0f0f12] relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[#0f0f12]" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`, backgroundSize: `${Math.max(10, gridSize)}px ${Math.max(10, gridSize)}px` }}></div>
                   <div className="absolute inset-0 bg-transparent" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: `${Math.max(10, gridSize) * 8}px ${Math.max(10, gridSize) * 8}px` }}></div>
                   <div className="absolute left-0 top-[60%] w-full h-[1px] bg-[#f85149] opacity-50"></div> {/* Y Axis */}
                   <div className="absolute left-1/2 bottom-0 w-[1px] h-full bg-[#58a6ff] opacity-50"></div> {/* Z Axis */}

                   <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 rounded backdrop-blur text-[10px] font-bold text-white shadow-sm border border-[#333]">Side (Y/Z)</span>

                   {/* Draw Brush Wireframe Simulation */}
                   <div className="absolute top-[30%] left-[40%] w-[40%] h-[30%] border-2 border-white pointer-events-none drop-shadow-[0_0_2px_#fff]"></div>
                   <div className="absolute top-[40%] left-[20%] w-[20%] h-[20%] border border-[#3fb950] bg-[#3fb950]/10 pointer-events-none"></div>
                </div>

             </div>
          </div>

          {/* Right Inspector Palette */}
          <div className="w-[300px] border-l border-[#222] bg-[#15151a] flex flex-col shrink-0">
             
             {/* Panel Tabs */}
             <div className="flex bg-[#0a0a0a] border-b border-[#222]">
               <button className="flex-1 py-2 text-[10px] font-bold text-white bg-[#1a1a20] border-b-2 border-[#e3b341]">Block Properties</button>
               <button className="flex-1 py-2 text-[10px] font-bold text-[#888] hover:text-[#ccc] border-b-2 border-transparent hover:border-[#444]">Map Texture / Face</button>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">

                {/* Primary Primitives */}
                <div className="space-y-2">
                   <h3 className="text-[10px] uppercase text-[#888] font-bold mb-2 flex items-center gap-1"><Box size={10}/> New Brush Type</h3>
                   <div className="grid grid-cols-3 gap-2">
                      <button className="bg-[#222] border border-[#ffb000] text-[#ffb000] py-2 rounded flex flex-col items-center gap-1 hover:bg-[#ffb000]/10 transition group">
                         <span className="w-5 h-5 border border-current rounded-[2px]"></span>
                         <span className="text-[9px] font-bold">Block</span>
                      </button>
                      <button className="bg-[#222] border border-[#333] text-[#ccc] py-2 rounded flex flex-col items-center gap-1 hover:border-[#666] transition">
                         <span className="w-5 h-5 border border-current rounded-full"></span>
                         <span className="text-[9px] font-bold">Cylinder</span>
                      </button>
                      <button className="bg-[#222] border border-[#333] text-[#ccc] py-2 rounded flex flex-col items-center gap-1 hover:border-[#666] transition group relative">
                         <div className="w-5 h-5 border border-current rounded-[2px] transform -skew-y-12"></div>
                         <span className="text-[9px] font-bold mt-1">Wedge</span>
                      </button>
                      <button className="bg-[#222] border border-[#333] text-[#ccc] py-2 rounded flex flex-col items-center gap-1 hover:border-[#666] transition">
                         <span className="w-5 h-5 border border-current rounded-full"></span>
                         <span className="text-[9px] font-bold">Sphere</span>
                      </button>
                      <button className="bg-[#222] border border-[#333] text-[#ccc] py-2 rounded flex flex-col items-center gap-1 hover:border-[#666] transition group">
                         <div className="w-5 h-5 overflow-hidden">
                           <div className="w-0 h-0 border-l-[10px] border-l-transparent border-b-[18px] border-b-current border-r-[10px] border-r-transparent"></div>
                         </div>
                         <span className="text-[9px] font-bold mt-1">Cone</span>
                      </button>
                   </div>
                </div>

                {/* CSG Operations */}
                <div className="space-y-3 bg-[#111] p-3 rounded border border-[#333]">
                   <h3 className="text-[10px] uppercase text-[#888] font-bold mb-2 flex items-center gap-1"><Layers size={10}/> CSG Operations</h3>
                   
                   <div className="flex gap-2">
                      <button className="flex-1 bg-[#1a3d24] border border-[#3fb950]/50 text-[#3fb950] py-1.5 rounded text-[10px] font-bold hover:bg-[#3fb950] hover:text-black transition">Additive (Solid)</button>
                      <button className="flex-1 bg-[#4a1a1a] border border-[#f85149]/50 text-[#f85149] py-1.5 rounded text-[10px] font-bold hover:bg-[#f85149] hover:text-black transition">Subtractive (Air)</button>
                   </div>

                   <button className="w-full text-left py-1.5 px-2 bg-[#222] hover:bg-[#333] border border-[#444] rounded text-[11px] font-bold text-white flex justify-between items-center transition mt-2">
                       Hollow Block <span className="text-[#888] font-mono text-[9px]">-16 UU</span>
                   </button>
                   <button className="w-full text-left py-1.5 px-2 bg-[#222] hover:bg-[#333] border border-[#444] rounded text-[11px] font-bold text-white flex justify-between items-center transition">
                       Intersect <span className="text-[#888] font-mono text-[9px]">Shift+I</span>
                   </button>
                   <button className="w-full text-left py-1.5 px-2 bg-[#222] hover:bg-[#333] border border-[#444] rounded text-[11px] font-bold text-white flex justify-between items-center transition">
                       De-Intersect <span className="text-[#888] font-mono text-[9px]">Shift+D</span>
                   </button>
                </div>

                {/* Advanced Geometry Alignments */}
                <div className="space-y-2">
                   <h3 className="text-[10px] uppercase text-[#888] font-bold mb-2 flex items-center gap-1"><Grid size={10}/> Grid & Alignment</h3>
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] text-[#ccc] w-12">Grid Size</span>
                      <select 
                         value={gridSize} 
                         onChange={(e) => setGridSize(Number(e.target.value))}
                         className="flex-1 bg-black border border-[#444] text-white rounded text-[11px] p-1 outline-none font-mono"
                      >
                         <option value="1">1</option>
                         <option value="4">4</option>
                         <option value="8">8</option>
                         <option value="16">16 (Default)</option>
                         <option value="32">32</option>
                         <option value="64">64</option>
                         <option value="128">128</option>
                      </select>
                   </div>
                   <div className="flex gap-2">
                      <button className="flex-1 bg-[#222] text-[#888] hover:text-white border border-[#444] py-1 rounded text-[10px] transition">Snap to Grid</button>
                      <button className="flex-1 bg-[#222] text-[#888] hover:text-white border border-[#444] py-1 rounded text-[10px] transition">Align Floor</button>
                   </div>
                </div>

                {/* Face Materials Panel */}
                <div className="space-y-3 pt-2 border-t border-[#333]">
                   <h3 className="text-[10px] uppercase text-[#888] font-bold flex items-center gap-1"><PaintBucket size={10}/> Default Texture Scale</h3>
                   <div className="grid grid-cols-2 gap-3">
                      <div>
                         <span className="text-[9px] text-[#666]">Scale U</span>
                         <input type="number" defaultValue="1.00" className="w-full bg-black border border-[#444] text-white text-[10px] font-mono px-1 py-0.5 rounded outline-none"/>
                      </div>
                      <div>
                         <span className="text-[9px] text-[#666]">Scale V</span>
                         <input type="number" defaultValue="1.00" className="w-full bg-black border border-[#444] text-white text-[10px] font-mono px-1 py-0.5 rounded outline-none"/>
                      </div>
                      <div>
                         <span className="text-[9px] text-[#666]">Offset U</span>
                         <input type="number" defaultValue="0" className="w-full bg-black border border-[#444] text-white text-[10px] font-mono px-1 py-0.5 rounded outline-none"/>
                      </div>
                      <div>
                         <span className="text-[9px] text-[#666]">Offset V</span>
                         <input type="number" defaultValue="0" className="w-full bg-black border border-[#444] text-white text-[10px] font-mono px-1 py-0.5 rounded outline-none"/>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="flex-1 bg-[#222] text-[#888] hover:text-white border border-[#444] py-1 rounded text-[10px] transition text-center whitespace-nowrap">Planar</button>
                      <button className="flex-1 bg-[#222] text-[#888] hover:text-white border border-[#444] py-1 rounded text-[10px] transition text-center whitespace-nowrap">Wall</button>
                      <button className="flex-1 bg-[#222] text-[#888] hover:text-white border border-[#444] py-1 rounded text-[10px] transition text-center whitespace-nowrap">Fit</button>
                   </div>
                </div>

             </div>
          </div>
       </div>

    </div>
  );
}
