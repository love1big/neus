import React, { useState } from 'react';
import { Box, Layers, Scissors, Grid, Lock, Unlock, Eye, EyeOff, MousePointer2, Zap, Wand2, Sun, Camera, Type, Settings2, Hexagon, Crosshair, Move, SlidersHorizontal, Trash2, Plus, ArrowDown, ArrowUp, ChevronRight, ChevronDown, Square, Download, FolderOpen, Save, PenTool, Layout, Palette, Maximize, Play, Circle, Minus } from 'lucide-react';

export default function Offline3DModeler() {
  const [activeMode, setActiveMode] = useState('Edit Mode');
  const [activeTool, setActiveTool] = useState('Select');
  const [activePanel, setActivePanel] = useState('Modifiers');

  const tools = ['Select', 'Cursor', 'Move', 'Rotate', 'Scale', 'Transform', 'Measure', 'Extrude', 'Inset', 'Bevel', 'Loop Cut', 'Knife', 'Poly Build', 'Smooth'];
  const outlinerItems = [
    { name: 'Camera', icon: <Camera size={12} />, type: 'camera' },
    { name: 'Sun Light', icon: <Sun size={12} />, type: 'light' },
    { name: 'PlayerChar_BaseMesh', icon: <Hexagon size={12} />, type: 'mesh', active: true },
    { name: 'Weapon_Sword_01', icon: <Hexagon size={12} />, type: 'mesh' },
  ];

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0d1117] text-[#8b949e] font-sans text-xs overflow-hidden select-none">
      {/* Top Menubar */}
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-2 py-1 shrink-0">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1f6feb] text-white rounded text-[10px] font-bold shadow-md cursor-pointer hover:bg-[#388bfd] transition-colors"><Box size={14} /> Offline 3D Modeler</div>
            <div className="flex items-center text-[11px] gap-3">
               <span className="hover:text-white cursor-pointer transition-colors">File</span>
               <span className="hover:text-white cursor-pointer transition-colors">Edit</span>
               <span className="hover:text-white cursor-pointer transition-colors">Render</span>
               <span className="hover:text-white cursor-pointer transition-colors">Window</span>
               <span className="hover:text-white cursor-pointer transition-colors">Help</span>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="flex bg-[#0d1117] rounded border border-[#30363d] overflow-hidden text-[10px] shadow-inner">
               {['Object Mode', 'Edit Mode', 'Sculpt Mode', 'Vertex Paint', 'Texture Paint'].map(m => (
                  <button key={m} onClick={() => setActiveMode(m)} className={`px-3 py-1 transition-colors font-bold ${activeMode === m ? 'bg-[#3fb950]/20 text-[#3fb950] border-b-2 border-[#3fb950]' : 'hover:bg-[#21262d] text-[#c9d1d9] border-b-2 border-transparent'}`}>{m}</button>
               ))}
            </div>
            <div className="w-px h-4 bg-[#30363d]"></div>
            <div className="flex items-center gap-1">
               <button className="p-1.5 hover:bg-[#21262d] rounded transition-colors text-white" title="Vertex Select"><Circle size={14}/></button>
               <button className="p-1.5 bg-[#21262d] rounded transition-colors text-[#3fb950] shadow-inner" title="Edge Select"><Minus size={14} strokeWidth={4}/></button>
               <button className="p-1.5 hover:bg-[#21262d] rounded transition-colors text-white" title="Face Select"><Square size={14}/></button>
            </div>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Left Toolbar */}
         <div className="w-12 bg-[#161b22] border-r border-[#30363d] flex flex-col items-center py-2 gap-1 overflow-y-auto custom-scrollbar shrink-0">
            {tools.map(t => (
               <button 
                 key={t}
                 onClick={() => setActiveTool(t)}
                 className={`w-9 h-9 rounded flex items-center justify-center transition-all ${activeTool === t ? 'bg-[#1f6feb] text-white shadow-lg' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9]'}`}
                 title={t}
               >
                  {t === 'Select' && <MousePointer2 size={16} />}
                  {t === 'Cursor' && <Crosshair size={16} />}
                  {t === 'Move' && <Move size={16} />}
                  {t === 'Rotate' && <Circle size={16} />}
                  {t === 'Scale' && <Maximize size={16} />}
                  {t === 'Extrude' && <Layers size={16} />}
                  {t === 'Bevel' && <Square size={16} />}
                  {t === 'Loop Cut' && <Scissors size={16} />}
                  {t === 'Knife' && <Zap size={16} />}
                  {t === 'Poly Build' && <Hammer size={16} />}
                  {t === 'Smooth' && <Wand2 size={16} />}
                  {t === 'Measure' && <SlidersHorizontal size={16} />}
                  {!['Select', 'Cursor', 'Move', 'Rotate', 'Scale', 'Extrude', 'Bevel', 'Loop Cut', 'Knife', 'Poly Build', 'Smooth', 'Measure'].includes(t) && <Box size={16} />}
               </button>
            ))}
         </div>

         {/* 3D Viewport Simulation */}
         <div className="flex-1 bg-[#090b0e] relative overflow-hidden flex flex-col">
            <div className="absolute top-4 left-4 text-white/50 text-[10px] font-mono Select-none pointer-events-none z-10 flex flex-col gap-1">
               <span>Perspective (X)</span>
               <span>Meters</span>
               <span className="text-[#3fb950] mt-2 font-bold flex items-center gap-2"><Move size={12}/> Move Tool Active</span>
               <span>XYZ: (0.00, 1.45, -0.22)</span>
            </div>
            
            <div className="absolute top-4 right-4 flex bg-[#161b22] border border-[#30363d] rounded text-[10px] shadow-lg z-10 overflow-hidden">
               <button className="px-3 py-1.5 hover:bg-[#21262d] transition-colors border-r border-[#30363d]">Wireframe</button>
               <button className="px-3 py-1.5 bg-[#21262d] text-white font-bold transition-colors border-r border-[#30363d]">Solid</button>
               <button className="px-3 py-1.5 hover:bg-[#21262d] transition-colors border-r border-[#30363d]">Material Preview</button>
               <button className="px-3 py-1.5 hover:bg-[#21262d] transition-colors"><Zap size={10} className="inline mr-1"/>Rendered</button>
            </div>

            {/* Grid Overlay Simulate */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d_1px,transparent_1px),linear-gradient(to_bottom,#30363d_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none transform perspective-1000 rotateX-60 scale-[3.0] origin-center translate-y-1/4"></div>

            {/* Simulated 3D Object */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#3fb950] bg-[#3fb950]/10 flex items-center justify-center rotate-45 transform perspective-1000 shadow-[0_0_50px_rgba(63,185,80,0.2)]">
               <div className="w-full h-full border border-[#3fb950] rotate-45 bg-[#3fb950]/5"></div>
               <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 ring-4 ring-yellow-400/20 z-20"></div>
               <div className="w-2 h-2 bg-white rounded-full absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 z-20"></div>
               <div className="w-2 h-2 bg-white rounded-full absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-20"></div>
               <div className="w-2 h-2 bg-white rounded-full absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 z-20"></div>
               
               <div className="absolute -top-12 -left-12 opacity-50"><Camera size={32}/></div>
               <div className="absolute bottom-12 right-12 opacity-50 text-yellow-500"><Sun size={32}/></div>
               
               {/* Selection Info */}
               <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[10px] bg-black/60 px-3 py-1 rounded backdrop-blur">
                  <span className="text-yellow-400 font-bold">1 Vert Selected</span> | 
                  <span>E: Extrude</span> | 
                  <span>S: Scale</span> | 
                  <span>G: Grab</span>
               </div>
            </div>
         </div>

         {/* Right Sidebar */}
         <div className="w-72 bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 overflow-hidden">
            {/* Outliner */}
            <div className="h-1/3 border-b border-[#30363d] flex flex-col bg-[#0d1117]">
               <div className="px-3 py-2 bg-[#161b22] border-b border-[#30363d] font-bold text-[#c9d1d9] flex items-center gap-2 shadow-sm uppercase tracking-wider text-[10px]">
                  <Layers size={14} className="text-[#bc8cff]" /> Outliner / Scene Hierarchy
               </div>
               <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                  <div className="flex items-center gap-2 mb-1 px-1 text-white"><FolderOpen size={12}/> Scene Collection</div>
                  {outlinerItems.map((item, idx) => (
                     <div key={idx} className={`flex items-center justify-between px-3 py-1 rounded cursor-pointer transition-colors ml-4 ${item.active ? 'bg-[#1f6feb] text-white shadow-sm' : 'hover:bg-[#21262d] text-[#8b949e]'}`}>
                        <div className="flex items-center gap-2">
                           {item.icon} {item.name}
                        </div>
                        <div className="flex items-center gap-2 opacity-60">
                           <Eye size={12}/> <Camera size={12}/>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Properties Panel */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
               <div className="flex bg-[#161b22] border-b border-[#30363d] overflow-x-auto hide-scrollbar shrink-0 shadow-sm">
                  {['Item', 'Tool', 'Modifiers', 'Material', 'Particles', 'Physics'].map(p => (
                     <button 
                       key={p} 
                       onClick={() => setActivePanel(p)}
                       className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${activePanel === p ? 'text-white border-[#1f6feb] bg-[#21262d]' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'}`}
                     >
                       {p}
                     </button>
                  ))}
               </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
                  {activePanel === 'Modifiers' && (
                     <>
                        <button className="w-full py-1.5 bg-[#21262d] border border-[#30363d] rounded flex items-center justify-center gap-2 text-white font-bold hover:bg-[#30363d] transition-colors shadow-sm mb-4">
                           <Plus size={14}/> Add Modifier
                        </button>
                        
                        {/* Modifier Block */}
                        <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden shadow-md">
                           <div className="px-3 py-2 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between cursor-pointer">
                              <div className="flex items-center gap-2 text-white font-bold"><Layers size={14} className="text-[#3fb950]"/> Subdivision Surface</div>
                              <div className="flex items-center gap-2 text-[#8b949e]">
                                 <Camera size={12}/> <Eye size={12}/> <ChevronDown size={14}/> <XIcon/>
                              </div>
                           </div>
                           <div className="p-3 space-y-3">
                              <div className="flex items-center justify-between">
                                 <span>Levels Viewport</span>
                                 <input type="range" min="0" max="6" defaultValue="2" className="w-24 accent-[#1f6feb]"/>
                                 <span className="bg-[#0d1117] border border-[#30363d] px-2 py-0.5 rounded text-white font-mono">2</span>
                              </div>
                              <div className="flex items-center justify-between">
                                 <span>Render Levels</span>
                                 <input type="range" min="0" max="6" defaultValue="3" className="w-24 accent-[#1f6feb]"/>
                                 <span className="bg-[#0d1117] border border-[#30363d] px-2 py-0.5 rounded text-white font-mono">3</span>
                              </div>
                              <div className="flex items-center gap-4 mt-2">
                                 <label className="flex items-center gap-2 text-white"><input type="checkbox" defaultChecked className="accent-[#1f6feb]"/> Optimal Display</label>
                              </div>
                           </div>
                        </div>

                        {/* Mirror Modifier */}
                        <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden shadow-md opacity-80">
                           <div className="px-3 py-2 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between cursor-pointer">
                              <div className="flex items-center gap-2 text-white font-bold"><Layout size={14} className="text-[#58a6ff]"/> Mirror</div>
                              <div className="flex items-center gap-2 text-[#8b949e]">
                                 <Camera size={12}/> <Eye size={12}/> <ChevronDown size={14}/> <XIcon/>
                              </div>
                           </div>
                           <div className="p-3 space-y-3 text-[10px]">
                              <div className="flex items-center gap-4">
                                 <span className="font-bold w-12">Axis:</span>
                                 <button className="px-3 py-1 bg-[#1f6feb] text-white rounded font-bold shadow-sm">X</button>
                                 <button className="px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded hover:bg-[#21262d]">Y</button>
                                 <button className="px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded hover:bg-[#21262d]">Z</button>
                              </div>
                              <div className="flex items-center gap-4">
                                 <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-[#1f6feb]"/> Clipping</label>
                                 <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#1f6feb]"/> Merge</label>
                              </div>
                           </div>
                        </div>
                     </>
                  )}

                  {activePanel === 'Material' && (
                     <div className="space-y-4">
                        <div className="flex bg-[#0d1117] border border-[#30363d] rounded p-1 mb-2">
                           <div className="flex-1 bg-[#21262d] p-1.5 rounded text-white flex items-center justify-between shadow-inner">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Red_Metal_Mat</div>
                              <ChevronDown size={12}/>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                           <div className="flex items-center justify-between col-span-2">
                              <span>Base Color</span>
                              <div className="w-32 h-6 bg-red-500 border border-[#30363d] rounded cursor-pointer shadow-inner"></div>
                           </div>
                           <div className="flex flex-col gap-1 col-span-2 mt-2">
                              <div className="flex justify-between items-center">
                                 <span>Metallic</span>
                                 <span className="bg-[#0d1117] border border-[#30363d] px-2 py-0.5 rounded font-mono text-white">0.850</span>
                              </div>
                              <input type="range" min="0" max="100" defaultValue="85" className="w-full accent-[#1f6feb]"/>
                           </div>
                           <div className="flex flex-col gap-1 col-span-2 mt-2">
                              <div className="flex justify-between items-center">
                                 <span>Roughness</span>
                                 <span className="bg-[#0d1117] border border-[#30363d] px-2 py-0.5 rounded font-mono text-white">0.200</span>
                              </div>
                              <input type="range" min="0" max="100" defaultValue="20" className="w-full accent-[#1f6feb]"/>
                           </div>
                           <div className="flex flex-col gap-1 col-span-2 mt-2">
                              <div className="flex justify-between items-center">
                                 <span>Clearcoat</span>
                                 <span className="bg-[#0d1117] border border-[#30363d] px-2 py-0.5 rounded font-mono text-white">0.000</span>
                              </div>
                              <input type="range" min="0" max="100" defaultValue="0" className="w-full accent-[#1f6feb]"/>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Bottom Timeline */}
      <div className="h-48 border-t border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
         <div className="px-3 py-1 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">
            <div className="flex items-center gap-4">
               <span className="flex items-center gap-1.5 text-white"><Play size={12} className="text-[#3fb950]"/> Timeline / Dope Sheet</span>
               <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-[#30363d] rounded"><SkipBack size={12}/></button>
                  <button className="p-1 hover:bg-[#30363d] rounded"><Play size={12}/></button>
                  <button className="p-1 hover:bg-[#30363d] rounded"><Square size={12}/></button>
                  <button className="p-1 hover:bg-[#30363d] rounded"><SkipForward size={12}/></button>
               </div>
            </div>
            <div className="flex items-center gap-2 font-mono">
               Start: <input type="number" defaultValue="1" className="w-12 bg-[#0d1117] border border-[#30363d] px-1 rounded text-white outline-none"/>
               End: <input type="number" defaultValue="250" className="w-12 bg-[#0d1117] border border-[#30363d] px-1 rounded text-white outline-none"/>
            </div>
         </div>
         {/* Keyframe Area */}
         <div className="flex-1 bg-[#0d1117] relative overflow-hidden flex custom-scrollbar">
            <div className="w-32 border-r border-[#30363d] bg-[#161b22] p-2 space-y-2">
               <div className="flex justify-between items-center text-white"><span className="truncate">CameraAction</span> <ChevronDown size={10}/></div>
               <div className="flex justify-between items-center text-[#ff7b72] pl-2"><span className="truncate">X Location</span> <div className="w-1.5 h-1.5 rounded-full bg-[#ff7b72]"></div></div>
               <div className="flex justify-between items-center text-[#3fb950] pl-2"><span className="truncate">Y Location</span> <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></div></div>
               <div className="flex justify-between items-center text-[#58a6ff] pl-2"><span className="truncate">Z Location</span> <div className="w-1.5 h-1.5 bg-[#58a6ff] rotate-45"></div></div>
            </div>
            <div className="flex-1 relative overflow-x-auto min-w-[800px] bg-[linear-gradient(90deg,#161b22_1px,transparent_1px)] bg-[size:20px_100%]">
               {/* Scrubber */}
               <div className="absolute top-0 bottom-0 left-[200px] w-px bg-yellow-400 z-10 shadow-[0_0_5px_yellow]">
                  <div className="w-3 h-3 bg-yellow-400 absolute -top-1.5 -left-1.5 rotate-45"></div>
               </div>
               
               {/* Keyframes */}
               <div className="absolute top-8 left-[40px] w-2 h-2 bg-yellow-400 rotate-45 shadow-[0_0_5px_yellow] cursor-pointer"></div>
               <div className="absolute top-8 left-[200px] w-2 h-2 bg-yellow-400 rotate-45 shadow-[0_0_5px_yellow] cursor-pointer"></div>
               <div className="absolute top-14 left-[40px] w-2 h-2 bg-yellow-400 rotate-45 shadow-[0_0_5px_yellow] cursor-pointer"></div>
               <div className="absolute top-14 left-[120px] w-2 h-2 bg-[#8b949e] rotate-45 cursor-pointer"></div>
               <div className="absolute top-14 left-[200px] w-2 h-2 bg-[#8b949e] rotate-45 cursor-pointer"></div>
               
               {/* Frame Numbers */}
               <div className="w-full h-5 border-b border-[#30363d] bg-[#161b22]/50 sticky top-0 flex text-[9px] font-mono text-[#8b949e] whitespace-nowrap overflow-hidden items-center">
                  {Array.from({length: 50}).map((_, i) => (
                     <div key={i} className="inline-block w-[20px] text-center border-r border-[#30363d]/50 shrink-0">{i * 5}</div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function XIcon() {
  return <Trash2 size={12} className="hover:text-red-400 transition-colors"/>;
}
