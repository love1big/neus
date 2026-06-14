import React, { useState } from 'react';
import { LayoutTemplate, Move, MousePointer2, Type, Square, Circle, Image as ImageIcon, Plus, AlignLeft, AlignCenter, AlignRight, Play, Maximize, Share2, Layers, Settings2, Palette, Component, Lock, Eye } from 'lucide-react';

export default function FigmaStyleCanvas() {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex h-full bg-[#1e1e1e] text-[#ccc] font-sans overflow-hidden">
      
      {/* Top Toolbar */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-[#2c2c2c] border-b border-[#444] flex items-center justify-between px-4 z-20">
         <div className="flex items-center gap-4">
            <h2 className="text-white font-bold text-[13px] flex items-center gap-2">
               <LayoutTemplate size={16} className="text-[#F24E1E]" /> UI/UX Canvas Builder
            </h2>
            <div className="h-6 w-[1px] bg-[#444]"></div>
            
            <div className="flex items-center gap-1">
               <button className="w-8 h-8 rounded hover:bg-[#444] text-white flex items-center justify-center transition"><MousePointer2 size={16}/></button>
               <button className="w-8 h-8 rounded hover:bg-[#444] flex items-center justify-center transition"><Square size={16}/></button>
               <button className="w-8 h-8 rounded hover:bg-[#444] flex items-center justify-center transition"><Circle size={16}/></button>
               <button className="w-8 h-8 rounded hover:bg-[#444] flex items-center justify-center transition"><Type size={16}/></button>
               <button className="w-8 h-8 rounded hover:bg-[#444] flex items-center justify-center transition"><Component size={16}/></button>
            </div>
         </div>

         <div className="flex items-center gap-3">
             <div className="text-[11px] font-mono bg-[#444] px-2 py-1 rounded">{(zoom * 100).toFixed(0)}%</div>
             <button className="bg-[#18A0FB] hover:bg-[#0B85DB] text-white px-3 py-1.5 rounded flex items-center gap-2 text-[12px] font-bold"><Play size={12}/> Present</button>
         </div>
      </div>

      {/* Left Layer Panel */}
      <div className="w-[240px] pt-12 bg-[#2c2c2c] border-r border-[#444] flex flex-col shrink-0 relative z-10">
         <div className="p-3 border-b border-[#444] flex justify-between items-center text-[11px] font-bold text-white uppercase tracking-widest">
            Layers
         </div>
         <div className="flex-1 overflow-y-auto p-2 space-y-1 text-[11px] custom-scrollbar">
            {/* Screen 1 */}
            <div className="flex items-center justify-between p-1.5 hover:bg-[#333] rounded cursor-pointer group">
               <span className="flex items-center gap-2 font-bold text-white"><Square size={12}/> Game_HUD_Main</span>
               <div className="hidden group-hover:flex gap-2 text-[#888]">
                  <Lock size={12}/><Eye size={12}/>
               </div>
            </div>
            
            <div className="pl-6 space-y-1">
               <div className="flex items-center justify-between p-1.5 hover:bg-[#333] rounded cursor-pointer group bg-[#18A0FB]/20 text-[#18A0FB]">
                  <span className="flex items-center gap-2"><Square size={12}/> Health_Bar_Container</span>
                  <div className="hidden group-hover:flex gap-2"><Lock size={12}/><Eye size={12}/></div>
               </div>
               <div className="pl-6 space-y-1">
                  <div className="flex items-center justify-between p-1 hover:bg-[#333] rounded cursor-pointer group text-[#ccc]">
                     <span className="flex items-center gap-2"><Square size={12}/> Fill_Red</span>
                  </div>
                  <div className="flex items-center justify-between p-1 hover:bg-[#333] rounded cursor-pointer group text-[#ccc]">
                     <span className="flex items-center gap-2"><Type size={12}/> HP Text</span>
                  </div>
               </div>

               <div className="flex items-center justify-between p-1.5 hover:bg-[#333] rounded cursor-pointer group text-[#ccc]">
                  <span className="flex items-center gap-2"><ImageIcon size={12}/> Minimap_Radar</span>
               </div>
               <div className="flex items-center justify-between p-1.5 hover:bg-[#333] rounded cursor-pointer group text-[#ccc]">
                  <span className="flex items-center gap-2"><Component size={12}/> Skill_Slot_Group</span>
               </div>
            </div>

            {/* Screen 2 */}
            <div className="flex items-center justify-between p-1.5 hover:bg-[#333] rounded cursor-pointer group mt-4 text-[#888]">
               <span className="flex items-center gap-2 font-bold text-white"><Square size={12}/> Inventory_Screen</span>
            </div>
         </div>
      </div>

      {/* Infinite Canvas */}
      <div className="flex-1 bg-[#1e1e1e] pt-12 relative overflow-hidden flex items-center justify-center">
         {/* Transform Wrapper */}
         <div className="absolute inset-0 origin-center" style={{ transform: `scale(${zoom})` }}>
            
            {/* HUD Screen Artboard */}
            <div className="absolute top-[10%] left-[10%] w-[1920px] h-[1080px] bg-black border border-[#555] shadow-2xl relative overflow-hidden group">
               <span className="absolute -top-6 left-0 text-[#888] font-bold text-[14px]">Game_HUD_Main</span>
               
               {/* Safe Zone Guides */}
               <div className="absolute inset-8 border border-red-500/30 pointer-events-none"></div>

               {/* Simulated UI Elements */}
               {/* Health Bar (Selected) */}
               <div className="absolute top-12 left-12 w-[400px] h-8 bg-[#222] border-[3px] border-[#18A0FB] ring-1 ring-[#18A0FB]/50 rounded overflow-hidden">
                  <div className="h-full bg-red-600 w-[75%] skew-x-[-15deg] origin-left border-r-2 border-white"></div>
                  <span className="absolute inset-0 flex items-center px-4 font-black italic text-white text-[18px]" style={{ textShadow: '1px 1px 0 #000' }}>HP 75/100</span>
                  
                  {/* Selection Handles */}
                  <div className="absolute top-0 left-0 w-2 h-2 bg-white border border-[#18A0FB] -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-white border border-[#18A0FB] translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-white border border-[#18A0FB] -translate-x-1/2 translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-white border border-[#18A0FB] translate-x-1/2 translate-y-1/2"></div>
               </div>

               {/* Minimap */}
               <div className="absolute top-12 right-12 w-[250px] h-[250px] bg-[#111] rounded-full border-4 border-[#333] shadow-lg flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.1),transparent_70%)]"></div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="40" fill="none" stroke="#222" strokeWidth="1" />
                     <circle cx="50" cy="50" r="20" fill="none" stroke="#222" strokeWidth="1" />
                     <line x1="50" y1="0" x2="50" y2="100" stroke="#222" strokeWidth="1" />
                     <line x1="0" y1="50" x2="100" y2="50" stroke="#222" strokeWidth="1" />
                     
                     {/* Blips */}
                     <circle cx="50" cy="50" r="2" fill="white" />
                     <circle cx="30" cy="40" r="2" fill="red" />
                     <circle cx="70" cy="80" r="2" fill="red" />
                     <circle cx="60" cy="30" r="2" fill="green" />
                  </svg>
               </div>

               {/* Skill Hotbar */}
               <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                  <div className="w-[60px] h-[60px] bg-[#222] border-2 border-[#444] rounded flex items-center justify-center text-white font-bold text-xl relative shadow-lg">1<span className="absolute bottom-1 right-1 text-[10px] text-gray-400">Q</span></div>
                  <div className="w-[60px] h-[60px] bg-[#222] border-2 border-[#444] rounded flex items-center justify-center text-white font-bold text-xl relative shadow-lg">2<span className="absolute bottom-1 right-1 text-[10px] text-gray-400">W</span></div>
                  <div className="w-[60px] h-[60px] bg-[#222] border-2 border-[#444] rounded flex items-center justify-center text-white font-bold text-xl relative shadow-lg">3<span className="absolute bottom-1 right-1 text-[10px] text-gray-400">E</span></div>
                  <div className="w-[60px] h-[60px] bg-[#222] border-2 border-[#444] rounded flex items-center justify-center text-white font-bold text-xl relative shadow-lg overflow-hidden">
                     <div className="absolute inset-0 bg-blue-500/20 translate-y-1/2"></div>
                     R<span className="absolute bottom-1 right-1 text-[10px] text-gray-400">R</span>
                  </div>
               </div>

            </div>
         </div>
      </div>

      {/* Right Properties Panel */}
      <div className="w-[280px] pt-12 bg-[#2c2c2c] border-l border-[#444] flex flex-col shrink-0 relative z-10">
         <div className="p-3 border-b border-[#444] flex justify-between items-center text-[11px] font-bold text-white uppercase tracking-widest">
            Design
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Alignment */}
            <div className="p-4 border-b border-[#444] flex justify-between text-[#aaa]">
               <button className="hover:text-white"><AlignLeft size={16}/></button>
               <button className="hover:text-white"><AlignCenter size={16}/></button>
               <button className="hover:text-white"><AlignRight size={16}/></button>
            </div>

            {/* Dimensions */}
            <div className="p-4 border-b border-[#444] space-y-3 font-mono text-[11px]">
               <div className="flex justify-between items-center">
                  <span className="text-[#888] w-4">X</span>
                  <input type="text" className="w-[70px] bg-[#1e1e1e] border border-transparent hover:border-[#555] rounded px-2 py-1 outline-none text-white focus:border-[#18A0FB]" defaultValue="48.0" />
                  <span className="text-[#888] w-4 ml-4">Y</span>
                  <input type="text" className="w-[70px] bg-[#1e1e1e] border border-transparent hover:border-[#555] rounded px-2 py-1 outline-none text-white focus:border-[#18A0FB]" defaultValue="48.0" />
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[#888] w-4">W</span>
                  <input type="text" className="w-[70px] bg-[#1e1e1e] border border-transparent hover:border-[#555] rounded px-2 py-1 outline-none text-white focus:border-[#18A0FB]" defaultValue="400.0" />
                  <span className="text-[#888] w-4 ml-4">H</span>
                  <input type="text" className="w-[70px] bg-[#1e1e1e] border border-transparent hover:border-[#555] rounded px-2 py-1 outline-none text-white focus:border-[#18A0FB]" defaultValue="32.0" />
               </div>
               <div className="flex justify-between items-center pt-2">
                  <span className="text-[#888] w-4">∠</span>
                  <input type="text" className="w-[70px] bg-[#1e1e1e] border border-transparent hover:border-[#555] rounded px-2 py-1 outline-none text-white focus:border-[#18A0FB]" defaultValue="0°" />
                  <span className="text-[#888] w-4 ml-4 flex items-center justify-center"><div className="w-3 h-3 border border-[#888] rounded-sm"></div></span>
                  <input type="text" className="w-[70px] bg-[#1e1e1e] border border-transparent hover:border-[#555] rounded px-2 py-1 outline-none text-white focus:border-[#18A0FB]" defaultValue="4" />
               </div>
            </div>

            {/* Fill */}
            <div className="p-4 border-b border-[#444] space-y-2">
               <div className="flex justify-between items-center">
                  <h3 className="text-[12px] font-bold text-white">Fill</h3>
                  <button className="text-[#888] hover:text-white"><Plus size={14}/></button>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-[#555] bg-red-600"></div>
                  <input type="text" className="flex-1 bg-[#1e1e1e] border border-transparent hover:border-[#555] rounded px-2 py-1 outline-none text-white font-mono text-[11px] focus:border-[#18A0FB]" defaultValue="D32F2F" />
                  <input type="text" className="w-12 bg-[#1e1e1e] border border-transparent hover:border-[#555] rounded px-1 py-1 outline-none text-white text-right font-mono text-[11px] focus:border-[#18A0FB]" defaultValue="100%" />
               </div>
            </div>

            {/* Stroke */}
            <div className="p-4 border-b border-[#444] space-y-2">
               <div className="flex justify-between items-center">
                  <h3 className="text-[12px] font-bold text-white">Stroke</h3>
                  <button className="text-[#888] hover:text-white"><Plus size={14}/></button>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-[#555] bg-white"></div>
                  <input type="text" className="flex-1 bg-[#1e1e1e] border border-transparent hover:border-[#555] rounded px-2 py-1 outline-none text-white font-mono text-[11px] focus:border-[#18A0FB]" defaultValue="FFFFFF" />
                  <input type="text" className="w-12 bg-[#1e1e1e] border border-transparent hover:border-[#555] rounded px-1 py-1 outline-none text-white text-right font-mono text-[11px] focus:border-[#18A0FB]" defaultValue="100%" />
               </div>
               <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 flex justify-center"><Settings2 size={12} className="text-[#888]"/></div>
                  <select className="flex-1 bg-[#1e1e1e] border border-transparent hover:border-[#555] rounded p-1 outline-none text-white text-[11px] focus:border-[#18A0FB]">
                     <option>Inside</option>
                     <option>Center</option>
                     <option>Outside</option>
                  </select>
                  <input type="text" className="w-12 bg-[#1e1e1e] border border-transparent hover:border-[#555] rounded px-1 py-1 outline-none text-white text-right font-mono text-[11px] focus:border-[#18A0FB]" defaultValue="2" />
               </div>
            </div>

            {/* Export */}
            <div className="p-4 border-b border-[#444]">
               <h3 className="text-[12px] font-bold text-white mb-2 text-center">Export to UI Binding</h3>
               <button className="w-full bg-[#1e1e1e] border border-[#555] text-white hover:border-[#18A0FB] hover:text-[#18A0FB] py-1.5 rounded text-[11px] font-bold transition flex justify-center items-center gap-2">
                  <Component size={14}/> Generate UMG / React UI
               </button>
            </div>

         </div>
      </div>

    </div>
  );
}
