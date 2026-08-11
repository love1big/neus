import React, { useState } from 'react';
import { Box, Layers, MousePointer2, Move3D, Maximize, Scissors, CircleOff, Pencil, Eraser, Brush, Palette, MonitorPlay, Save, Download, Sliders, Contrast, Droplet, RefreshCw} from 'lucide-react';

export default function ZBrushStyleSculptingStudio() {
  const [activeBrush, setActiveBrush] = useState('clayBuildUp');
  const [subDivLevel, setSubDivLevel] = useState(3);
  
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#c9d1d9] font-sans">
      
      {/* Top Toolbar */}
      <div className="h-12 bg-[#2a2a2a] border-b border-[#3b3b3b] shadow-md flex items-center justify-between px-4 shrink-0">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c94b4b] to-[#4b134f] flex items-center justify-center text-white">
                  <Box size={18}/>
               </div>
               <span className="font-bold text-white tracking-widest text-[12px] uppercase">Digital Sculpt Studio</span>
            </div>
            
            <div className="w-[1px] h-6 bg-[#444] mx-2"></div>
            
            <div className="flex gap-1">
               <button className="px-3 py-1.5 bg-[#333] hover:bg-[#444] rounded text-[11px] font-bold">File</button>
               <button className="px-3 py-1.5 bg-[#333] hover:bg-[#444] rounded text-[11px] font-bold">Edit</button>
               <button className="px-3 py-1.5 bg-[#333] hover:bg-[#444] rounded text-[11px] font-bold">Tool</button>
               <button className="px-3 py-1.5 bg-[#333] hover:bg-[#444] rounded text-[11px] font-bold">Geometry</button>
               <button className="px-3 py-1.5 bg-[#333] hover:bg-[#444] rounded text-[11px] font-bold">Texture</button>
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="text-[10px] bg-[#111] px-3 py-1.5 rounded border border-[#333] flex gap-4">
               <span>Active Points: <strong className="text-[#58a6ff]">{(12500000 * Math.pow(4, subDivLevel - 3)).toLocaleString()}</strong></span>
               <span>Total Points: <strong className="text-[#3fb950]">{(25400000 * Math.pow(4, subDivLevel - 3)).toLocaleString()}</strong></span>
            </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         
         {/* Left Tool Palette */}
         <div className="w-16 bg-[#252525] border-r border-[#3b3b3b] flex flex-col items-center py-4 gap-3 shrink-0 z-10 overflow-y-auto custom-scrollbar">
            
            <div className="text-[9px] font-bold text-[#888] uppercase mb-1">Brushes</div>
            
            <button onClick={() => setActiveBrush('standard')} className={`w-10 h-10 rounded flex items-center justify-center transition-all ${activeBrush === 'standard' ? 'bg-[#c94b4b] text-white shadow-inner' : 'bg-[#333] hover:bg-[#444] text-[#aaa]'}`} title="Standard">
               <Brush size={20}/>
            </button>
            <button onClick={() => setActiveBrush('clayBuildUp')} className={`w-10 h-10 rounded flex items-center justify-center transition-all ${activeBrush === 'clayBuildUp' ? 'bg-[#c94b4b] text-white shadow-inner' : 'bg-[#333] hover:bg-[#444] text-[#aaa]'}`} title="Clay BuildUp">
               <Layers size={20}/>
            </button>
            <button onClick={() => setActiveBrush('damStandard')} className={`w-10 h-10 rounded flex items-center justify-center transition-all ${activeBrush === 'damStandard' ? 'bg-[#c94b4b] text-white shadow-inner' : 'bg-[#333] hover:bg-[#444] text-[#aaa]'}`} title="Dam_Standard (Crease)">
               <Scissors size={20}/>
            </button>
            <button onClick={() => setActiveBrush('move')} className={`w-10 h-10 rounded flex items-center justify-center transition-all ${activeBrush === 'move' ? 'bg-[#c94b4b] text-white shadow-inner' : 'bg-[#333] hover:bg-[#444] text-[#aaa]'}`} title="Move">
               <Move3D size={20}/>
            </button>
            <button onClick={() => setActiveBrush('smooth')} className={`w-10 h-10 rounded flex items-center justify-center transition-all ${activeBrush === 'smooth' ? 'bg-[#c94b4b] text-white shadow-inner' : 'bg-[#333] hover:bg-[#444] text-[#aaa]'}`} title="Smooth">
               <Droplet size={20}/>
            </button>
            <button onClick={() => setActiveBrush('flatten')} className={`w-10 h-10 rounded flex items-center justify-center transition-all ${activeBrush === 'flatten' ? 'bg-[#c94b4b] text-white shadow-inner' : 'bg-[#333] hover:bg-[#444] text-[#aaa]'}`} title="Flatten / Polish">
               <Eraser size={20}/>
            </button>

            <div className="w-8 h-[1px] bg-[#444] my-2"></div>
            
            <div className="text-[9px] font-bold text-[#888] uppercase mb-1">Stroke</div>
            <button className="w-10 h-10 rounded bg-[#333] hover:bg-[#444] text-[#aaa] flex items-center justify-center"><Pencil size={20}/></button>
            
            <div className="w-8 h-[1px] bg-[#444] my-2"></div>
            
            <div className="text-[9px] font-bold text-[#888] uppercase mb-1">Alpha</div>
            <button className="w-10 h-10 rounded bg-[#111] border border-[#555] p-1 flex items-center justify-center hover:border-white">
               <div className="w-full h-full rounded-full bg-gradient-to-b from-white via-white/50 to-transparent"></div>
            </button>
            <button className="w-10 h-10 rounded bg-[#111] border border-[#555] p-1 flex items-center justify-center hover:border-white">
               <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_white_0%,_transparent_70%)]"></div>
            </button>
         </div>

         {/* Center Viewport */}
         <div className="flex-1 bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #2a2a2a 0%, #111 100%)' }}>
            
            {/* Viewport Controls Overlays */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
               <button className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded flex items-center justify-center text-white font-bold text-[10px] flex-col"><Maximize size={16}/> Frame</button>
               <button className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded flex flex-col items-center justify-center text-white font-bold text-[10px]"><Move3D size={16}/> Move</button>
               <button className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded flex flex-col items-center justify-center text-white font-bold text-[10px]"><Box size={16}/> Scale</button>
               <button className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded flex flex-col items-center justify-center text-white font-bold text-[10px]"><RefreshCw size={16}/> Rot</button>
            </div>
            
            <div className="absolute top-4 left-4 flex gap-4 z-10">
               <div className="bg-black/50 backdrop-blur p-3 rounded border border-[#333] space-y-3 w-[200px]">
                  <div>
                     <div className="flex justify-between text-[10px] font-bold mb-1 text-white"><span>Draw Size</span> <span>64</span></div>
                     <input type="range" className="w-full accent-[#c94b4b] bg-[#111] h-1" min="1" max="256" defaultValue="64" />
                  </div>
                  <div>
                     <div className="flex justify-between text-[10px] font-bold mb-1 text-white"><span>Z Intensity</span> <span>25</span></div>
                     <input type="range" className="w-full accent-[#c94b4b] bg-[#111] h-1" min="1" max="100" defaultValue="25" />
                  </div>
                  <div>
                     <div className="flex justify-between text-[10px] font-bold mb-1 text-white"><span>Focal Shift</span> <span>0</span></div>
                     <input type="range" className="w-full accent-[#c94b4b] bg-[#111] h-1" min="-100" max="100" defaultValue="0" />
                  </div>
                  <div className="flex gap-2 pt-2">
                     <button className="flex-1 bg-[#444] hover:bg-[#555] py-1 rounded text-[10px] font-bold shadow-inner border border-[#666]">Zadd</button>
                     <button className="flex-1 bg-[#222] hover:bg-[#333] py-1 rounded text-[10px] font-bold border border-[#444] text-[#888]">Zsub</button>
                  </div>
               </div>
            </div>

            {/* Fake 3D Object (CSS Representation for UI demo) */}
            <div className="relative w-96 h-96">
               <div className="absolute inset-0 bg-[#c2a68d] rounded-[40%] shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.8),inset_20px_20px_40px_rgba(255,255,255,0.4),0_20px_50px_rgba(0,0,0,0.5)] transform rotate-12 flex items-center justify-center">
                  
                  {/* Fake geometry lines */}
                  <div className="absolute inset-0 rounded-[40%] overflow-hidden opacity-[0.03]" style={{ 
                     backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
                     backgroundSize: '8px 8px'
                  }}></div>
                  
                  {/* Fake Sculpt Marks */}
                  <div className="absolute top-1/4 left-1/4 w-32 h-16 bg-black/20 rounded-full blur-md transform -rotate-12"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                   <div className="absolute top-1/2 left-1/2 w-48 h-8 bg-black/30 rounded-full blur-md transform rotate-45 -translate-x-1/2 -translate-y-1/2 shadow-[inset_2px_2px_10px_rgba(0,0,0,0.5)]"></div>

               </div>
               
               {/* Cursor representing the active brush */}
               <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full border border-[#c94b4b] bg-[#c94b4b]/10 backdrop-blur-[1px] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#c94b4b] rounded-full"></div>
               </div>
               
            </div>
            
         </div>

         {/* Right Details Panel */}
         <div className="w-[300px] bg-[#252525] border-l border-[#3b3b3b] overflow-y-auto custom-scrollbar shrink-0 z-10 flex flex-col">
            
            {/* Color Palette Mini */}
            <div className="p-4 border-b border-[#3b3b3b]">
               <div className="w-full h-24 bg-gradient-to-br from-white via-[#c2a68d] to-black rounded border border-[#555] mb-2 relative cursor-pointer">
                  <div className="absolute top-[40%] left-[60%] w-3 h-3 bg-transparent border-2 border-white rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2"></div>
               </div>
               <div className="flex gap-2">
                  <div className="w-8 h-8 rounded bg-[#c2a68d] border border-white"></div>
                  <div className="w-8 h-8 rounded bg-[#111] border border-[#555]"></div>
                  <button className="flex-1 bg-[#333] hover:bg-[#444] rounded text-[10px] font-bold border border-[#555]">FillObject</button>
               </div>
            </div>

            {/* Accordions */}
            <div className="flex-1">
               
               {/* Tool / SubTool */}
               <div className="border-b border-[#3b3b3b]">
                  <div className="bg-[#333] p-2 px-3 text-[11px] font-bold text-white tracking-widest cursor-pointer flex justify-between items-center group hover:bg-[#444]">
                     SUBTOOL <span className="text-[#888] group-hover:text-white">▼</span>
                  </div>
                  <div className="p-3 space-y-2 bg-[#1e1e1e]">
                     <div className="bg-[#2a2a2a] border border-[#555] rounded p-2 flex items-center justify-between cursor-pointer hover:bg-[#333]">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-[#c2a68d] rounded shadow-inner flex items-center justify-center text-[8px] font-bold text-black/50">Base</div>
                           <span className="text-[11px] font-bold text-white">Hero_BodyMesh</span>
                        </div>
                        <MonitorPlay size={14} className="text-[#888] hover:text-white"/>
                     </div>
                     <div className="bg-[#111] border border-[#333] rounded p-2 flex items-center justify-between cursor-pointer hover:bg-[#222]">
                        <div className="flex items-center gap-2 opacity-50">
                           <div className="w-8 h-8 bg-[#777] rounded shadow-inner flex items-center justify-center text-[8px] font-bold text-black/50">Armr</div>
                           <span className="text-[11px] font-bold text-white">ShoulderPad_L</span>
                        </div>
                        <MonitorPlay size={14} className="text-[#444] hover:text-white"/>
                     </div>
                     
                     <div className="flex gap-2 pt-2">
                        <button className="flex-1 bg-[#333] hover:bg-[#444] rounded py-1 text-[10px] font-bold border border-[#555]">Append</button>
                        <button className="flex-1 bg-[#333] hover:bg-[#444] rounded py-1 text-[10px] font-bold border border-[#555]">Duplicate</button>
                        <button className="flex-1 bg-[#4a1c1c] hover:bg-[#662222] rounded py-1 text-[10px] font-bold border border-[#c94b4b]/50 text-red-200">Delete</button>
                     </div>
                  </div>
               </div>

               {/* Geometry */}
               <div className="border-b border-[#3b3b3b]">
                  <div className="bg-[#333] p-2 px-3 text-[11px] font-bold text-white tracking-widest cursor-pointer flex justify-between items-center group hover:bg-[#444]">
                     GEOMETRY <span className="text-[#888] group-hover:text-white">▼</span>
                  </div>
                  <div className="p-3 space-y-3 bg-[#1e1e1e]">
                     
                     <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-[#aaa]">
                           <span>SDiv</span>
                           <span className="font-mono text-white bg-[#111] px-2 py-0.5 rounded">{subDivLevel}</span>
                        </div>
                        <input type="range" className="w-full accent-[#58a6ff] bg-[#111] h-1.5" min="1" max="6" value={subDivLevel} onChange={(e) => setSubDivLevel(parseInt(e.target.value))} />
                     </div>
                     
                     <div className="flex gap-2">
                        <button 
                           onClick={() => setSubDivLevel(Math.max(1, subDivLevel - 1))}
                           className="flex-1 bg-[#333] hover:bg-[#444] rounded py-1 text-[10px] font-bold border border-[#555]"
                        >
                           Lower Res
                        </button>
                        <button 
                           onClick={() => setSubDivLevel(Math.min(6, subDivLevel + 1))}
                           className="flex-1 bg-[#333] hover:bg-[#444] rounded py-1 text-[10px] font-bold border border-[#555]"
                        >
                           Higher Res
                        </button>
                     </div>
                     
                     <button className="w-full bg-[#116e3c] hover:bg-[#1a8a4d] rounded py-2 text-[11px] font-bold shadow-lg shadow-black/50 border border-[#3fb950] uppercase tracking-widest">Divide</button>
                     
                     <div className="w-full h-[1px] bg-[#3b3b3b] my-2"></div>
                     
                     <h4 className="text-[10px] font-bold text-white uppercase tracking-widest bg-[#2a2a2a] p-1 text-center rounded border border-[#3b3b3b] mb-2">Dynamesh</h4>
                     <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-[#aaa] w-20">Resolution</span>
                        <input type="range" className="flex-1 accent-[#e3b341] bg-[#111] h-1.5" min="16" max="2048" defaultValue="128" />
                        <span className="text-[10px] font-mono text-white bg-[#111] px-1 py-0.5 rounded border border-[#3b3b3b]">128</span>
                     </div>
                     <button className="w-full bg-[#333] hover:bg-[#444] rounded py-1.5 text-[10px] font-bold border border-[#555] active:bg-[#c94b4b] transition-colors duration-300">DynaMesh</button>

                     <div className="w-full h-[1px] bg-[#3b3b3b] my-2"></div>
                     <h4 className="text-[10px] font-bold text-white uppercase tracking-widest bg-[#2a2a2a] p-1 text-center rounded border border-[#3b3b3b] mb-2">ZRemesher</h4>
                     <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-[#aaa] w-20">Target Poly</span>
                        <input type="range" className="flex-1 accent-[#bc8cff] bg-[#111] h-1.5" min="0.1" max="100" defaultValue="5" />
                        <span className="text-[10px] font-mono text-white bg-[#111] px-1 py-0.5 rounded border border-[#3b3b3b]">5k</span>
                     </div>
                     <button className="w-full bg-[#333] hover:bg-[#444] rounded py-1.5 text-[10px] font-bold border border-[#555] text-[#bc8cff]">ZRemesher</button>
                  </div>
               </div>

               {/* Export */}
               <div className="p-4">
                  <button className="w-full bg-gradient-to-r from-[#21262d] to-[#161b22] hover:from-[#30363d] hover:to-[#21262d] rounded py-2 text-[11px] font-bold border border-[#444] flex items-center justify-center gap-2 mb-2 text-white">
                     <Download size={14} className="text-[#58a6ff]" /> Export (.OBJ / .FBX)
                  </button>
                  <button className="w-full bg-[#111] hover:bg-[#222] rounded py-2 text-[11px] font-bold border border-[#333] flex items-center justify-center gap-2 text-[#aaa]">
                     <Layers size={14} className="text-[#bc8cff]" /> Extract Displacement Map
                  </button>
               </div>
            </div>

         </div>

      </div>

    </div>
  );
}
