import React, { useState } from 'react';
import { Share2, GitBranch, Layers, Settings, Play, Save, ZoomIn, ZoomOut, MousePointer, Move, Plus, ChevronRight, Hash, Type, Code2 } from 'lucide-react';

export default function AdvancedNodeGraphEditor() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Header */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md z-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 p-1.5 rounded-lg shadow-lg">
            <Share2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Advanced <span className="text-fuchsia-400">Node Graph</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">HLSL Shader / Logic Graph Editor</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-gray-300 px-3 py-1.5 rounded text-xs font-bold transition-colors">
             <Save size={14} /> COMPILE GRAPH
           </button>
           <button className="flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-[0_0_10px_rgba(192,38,211,0.4)]">
             <Play size={14} /> APPLY TO MATERIAL
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Toolbar (Tools) */}
        <div className="w-12 bg-[#252526] border-r border-[#3e3e42] flex flex-col items-center py-4 gap-4 shrink-0 z-10">
           <button className="p-2 bg-fuchsia-600/20 text-fuchsia-400 rounded"><MousePointer size={18}/></button>
           <button className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors"><Move size={18}/></button>
           <div className="w-6 h-px bg-[#3e3e42]"></div>
           <button className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors"><Plus size={18}/></button>
        </div>

        {/* Center: Node Canvas */}
        <div className="flex-1 bg-[#121212] relative overflow-hidden" 
             style={{
               backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
               backgroundSize: '20px 20px',
               backgroundPosition: 'center center'
             }}>
           
           {/* Canvas Controls */}
           <div className="absolute bottom-4 left-4 flex gap-2 z-20">
             <button className="bg-[#252526] border border-[#3e3e42] p-1.5 rounded text-gray-400 hover:text-white"><ZoomIn size={16}/></button>
             <button className="bg-[#252526] border border-[#3e3e42] p-1.5 rounded text-gray-400 hover:text-white"><ZoomOut size={16}/></button>
             <span className="bg-[#252526] border border-[#3e3e42] px-3 py-1.5 rounded text-xs font-mono text-gray-400 flex items-center">100%</span>
           </div>

           {/* --- NODE 1: Texture Sample --- */}
           <div className="absolute left-[15%] top-[20%] w-56 bg-[#1e1e1e] border border-gray-600 rounded-lg shadow-xl flex flex-col select-none">
              <div className="bg-gradient-to-r from-emerald-900 to-[#1e1e1e] p-2 border-b border-gray-600 rounded-t-lg flex items-center gap-2">
                 <Layers size={14} className="text-emerald-400"/>
                 <span className="text-xs font-bold text-gray-100">Texture Sample 2D</span>
              </div>
              
              <div className="p-3 flex justify-between">
                 {/* Inputs */}
                 <div className="space-y-3">
                   <div className="flex items-center gap-2 text-[10px]">
                      <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div></div>
                      <span className="text-gray-400">UVs</span>
                   </div>
                 </div>
                 {/* Outputs */}
                 <div className="space-y-3">
                   <div className="flex items-center justify-end gap-2 text-[10px]">
                      <span className="text-gray-200">RGB</span>
                      <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div></div>
                   </div>
                   <div className="flex items-center justify-end gap-2 text-[10px]">
                      <span className="text-gray-200">R</span>
                      <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-red-400"></div></div>
                   </div>
                 </div>
              </div>
              <div className="p-2 border-t border-gray-700">
                <div className="w-full h-16 bg-gray-900 rounded border border-gray-700 flex items-center justify-center text-[9px] text-gray-500">T_Noise_01.png</div>
              </div>
           </div>

           {/* --- NODE 2: Multiply --- */}
           <div className="absolute left-[45%] top-[25%] w-48 bg-[#1e1e1e] border border-gray-600 rounded-lg shadow-xl flex flex-col select-none ring-2 ring-fuchsia-500/50">
              <div className="bg-gradient-to-r from-gray-700 to-[#1e1e1e] p-2 border-b border-gray-600 rounded-t-lg flex items-center gap-2">
                 <span className="text-xs font-bold text-gray-100 flex items-center gap-2">Multiply</span>
              </div>
              
              <div className="p-3 flex justify-between">
                 <div className="space-y-3">
                   <div className="flex items-center gap-2 text-[10px]">
                      <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div></div>
                      <span className="text-gray-200">A</span>
                   </div>
                   <div className="flex items-center gap-2 text-[10px]">
                      <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div></div>
                      <span className="text-gray-200">B</span>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <div className="flex items-center justify-end gap-2 text-[10px]">
                      <span className="text-gray-200">Out</span>
                      <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div></div>
                   </div>
                 </div>
              </div>
           </div>

           {/* --- NODE 3: Material Output --- */}
           <div className="absolute left-[75%] top-[15%] w-56 bg-[#1e1e1e] border border-gray-600 rounded-lg shadow-xl flex flex-col select-none">
              <div className="bg-gradient-to-r from-blue-900 to-[#1e1e1e] p-2 border-b border-gray-600 rounded-t-lg flex items-center gap-2">
                 <Code2 size={14} className="text-blue-400"/>
                 <span className="text-xs font-bold text-gray-100">Main Material Node</span>
              </div>
              
              <div className="p-3 space-y-4">
                 <div className="flex items-center gap-2 text-[10px]">
                    <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center"></div>
                    <span className="text-gray-300 font-bold">Base Color</span>
                 </div>
                 <div className="flex items-center gap-2 text-[10px]">
                    <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center"></div>
                    <span className="text-gray-300 font-bold">Metallic</span>
                 </div>
                 <div className="flex items-center gap-2 text-[10px]">
                    <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center"></div>
                    <span className="text-gray-300 font-bold">Roughness</span>
                 </div>
                 <div className="flex items-center gap-2 text-[10px]">
                    <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div></div>
                    <span className="text-gray-300 font-bold">Emissive Color</span>
                 </div>
                 <div className="flex items-center gap-2 text-[10px]">
                    <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center"></div>
                    <span className="text-gray-300 font-bold">Normal</span>
                 </div>
              </div>
           </div>

           {/* Connecting Splines (SVG Mock) */}
           <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
             <path d="M 330 250 C 420 250, 420 270, 510 270" fill="none" stroke="#facc15" strokeWidth="3" />
             <path d="M 680 290 C 760 290, 760 300, 840 300" fill="none" stroke="#facc15" strokeWidth="3" />
           </svg>

        </div>

        {/* Right Panel (Details) */}
        <div className="w-72 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 z-10">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Node Details</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              
              <div className="bg-[#1a1a1c] border border-fuchsia-500/50 p-3 rounded">
                 <div className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest mb-1">Selected Node</div>
                 <div className="text-sm font-bold text-white">Multiply (Math)</div>
              </div>
              
              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Input Constants</h4>
                 
                 <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Const A</span>
                      <input type="text" disabled value="[Connected]" className="w-20 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-gray-500 text-center" />
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Const B</span>
                      <input type="number" defaultValue="5.0" className="w-20 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-white text-center focus:border-fuchsia-500 outline-none" />
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Graph Stats</h4>
                 <div className="bg-[#1a1a1c] p-3 rounded border border-[#3e3e42] text-[10px] font-mono text-gray-400 space-y-1">
                    <div className="flex justify-between"><span>Instruction Count:</span><span className="text-fuchsia-400">142</span></div>
                    <div className="flex justify-between"><span>Texture Samplers:</span><span className="text-white">3 / 16</span></div>
                    <div className="flex justify-between"><span>Shader Model:</span><span className="text-white">SM 6.5</span></div>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
