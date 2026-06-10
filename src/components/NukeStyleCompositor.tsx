import React from 'react';
import { Layers, MonitorPlay, Settings2, Sliders, Play, Maximize, Target, Combine, Focus, Disc, Activity } from 'lucide-react';

export default function NukeStyleCompositor() {
  return (
    <div className="flex flex-col h-full bg-[#1c1c1c] text-[#d4d4d4] font-sans">
      
      {/* Top Protocol Bar */}
      <div className="h-10 border-b border-[#333] bg-[#222] shadow flex justify-between items-center px-4 shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-r from-[#eab308] to-[#f97316] w-6 h-6 flex items-center justify-center rounded text-black shadow-inner">
                <Combine size={14} className="opacity-80"/>
             </div>
             <span className="text-[12px] font-bold text-white tracking-widest uppercase">Node Compositing Core</span>
          </div>
          <div className="flex bg-[#111] p-0.5 rounded border border-[#333]">
              <button className="px-3 py-1 text-[10px] uppercase font-bold hover:bg-[#333] rounded">Viewer 1</button>
              <button className="px-3 py-1 text-[10px] uppercase font-bold bg-[#333] rounded text-[#eab308]">Node Graph</button>
              <button className="px-3 py-1 text-[10px] uppercase font-bold hover:bg-[#333] rounded">Curve Editor</button>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Node Graph view */}
         <div className="flex-1 relative bg-[#151515] overflow-hidden" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            
            {/* Fake Nodes */}
            <div className="absolute top-20 left-20 w-32 bg-[#444] rounded border-2 border-[#111] shadow-xl overflow-hidden cursor-move">
               <div className="bg-[#1f2937] text-white text-[10px] font-bold p-1 px-2 border-b border-[#111] flex justify-between items-center">
                  Read1 <Target size={10} className="text-[#9ca3af]"/>
               </div>
               <div className="p-2 flex flex-col items-center">
                  <div className="w-full h-16 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center border border-[#222] mb-1"></div>
                  <span className="text-[9px] text-[#9ca3af]">EXR Sequence</span>
               </div>
               {/* Base Port */}
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#eab308] rounded-full border-2 border-[#111]"></div>
            </div>

            <div className="absolute top-20 left-64 w-32 bg-[#444] rounded border-2 border-[#111] shadow-xl overflow-hidden cursor-move">
               <div className="bg-[#1f2937] text-white text-[10px] font-bold p-1 px-2 border-b border-[#111] flex justify-between items-center">
                  Read2_Depth <Target size={10} className="text-[#9ca3af]"/>
               </div>
               <div className="p-2 flex flex-col items-center">
                  <div className="w-full h-16 bg-gradient-to-br from-white to-black border border-[#222] mb-1"></div>
                  <span className="text-[9px] text-[#9ca3af]">Z-Depth Map</span>
               </div>
               {/* Base Port */}
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#eab308] rounded-full border-2 border-[#111]"></div>
            </div>

            <div className="absolute top-56 left-[140px] w-32 bg-[#4b3c20] rounded border-2 border-[#eab308] shadow-[0_0_15px_rgba(234,179,8,0.3)] overflow-hidden cursor-move z-10">
               {/* Input Ports */}
               <div className="absolute -top-2 left-1/4 -translate-x-1/2 w-3 h-3 bg-[#111] rounded border border-[#eab308]"></div>
               <div className="absolute -top-2 left-3/4 -translate-x-1/2 w-3 h-3 bg-[#111] rounded border border-[#eab308]"></div>
               
               <div className="bg-[#713f12] text-white text-[10px] font-bold p-1 px-2 border-b border-[#4d2c0b] flex justify-between items-center">
                  ZDefocus1 <Focus size={10} className="text-[#fde047]"/>
               </div>
               <div className="p-2 flex flex-col items-center justify-center h-12">
                  <span className="text-[9px] text-[#fcd34d]">Focal: 0.52</span>
               </div>
               {/* Base Port */}
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#eab308] rounded-full border-2 border-[#111]"></div>
            </div>

            {/* Merge Node */}
            <div className="absolute top-80 left-[140px] w-24 bg-[#1e3a8a] rounded border-2 border-[#60a5fa] shadow-[0_0_15px_rgba(96,165,250,0.3)] overflow-hidden cursor-move z-10">
               {/* Input Ports */}
               <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111] rounded-full border border-[#60a5fa]"></div>
               <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 bg-[#111] rounded border border-[#60a5fa]"></div>
               
               <div className="p-2 flex flex-col items-center justify-center">
                  <span className="text-[14px] font-bold text-white">Merge1</span>
                  <span className="text-[9px] text-[#93c5fd]">Over</span>
               </div>
               {/* Base Port */}
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#eab308] rounded-full border-2 border-[#111]"></div>
            </div>

            <div className="absolute top-[420px] left-[140px] w-28 bg-[#1f2937] rounded border-2 border-[#111] shadow-xl overflow-hidden cursor-move">
               {/* Input Port */}
               <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111] rounded border border-[#666]"></div>
               <div className="bg-[#111] text-white text-[10px] font-bold p-1 px-2 border-b border-[#000] flex justify-between items-center">
                  Write1 <Disc size={10} className="text-[#9ca3af]"/>
               </div>
               <div className="p-2 flex flex-col items-center justify-center h-10">
                  <span className="text-[9px] text-[#9ca3af] truncate w-full flex justify-center text-center">/out/final_%04d.exr</span>
               </div>
            </div>

            {/* Wires (Fake CSS Lines) */}
            {/* Read1 to ZDefocus */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
               <path d="M 144 144 C 144 190, 160 190, 160 216" fill="none" stroke="#666" strokeWidth="2" />
               <path d="M 320 144 C 320 190, 192 190, 192 216" fill="none" stroke="#666" strokeWidth="2" />
               <path d="M 176 280 C 176 300, 176 300, 176 312" fill="none" stroke="#eab308" strokeWidth="2" />
               <path d="M 176 360 C 176 390, 176 390, 176 412" fill="none" stroke="#60a5fa" strokeWidth="2" />
            </svg>

            {/* Floating Palette */}
            <div className="absolute top-4 right-4 bg-[#222] border border-[#333] shadow-2xl rounded flex flex-col w-12">
               <button className="h-10 hover:bg-[#333] flex items-center justify-center text-[#9ca3af] hover:text-white border-b border-[#333]"><Settings2 size={16}/></button>
               <button className="h-10 hover:bg-[#333] flex items-center justify-center text-[#eab308] border-b border-[#333]"><Layers size={16}/></button>
               <button className="h-10 hover:bg-[#333] flex items-center justify-center text-[#9ca3af] hover:text-white border-b border-[#333]"><Activity size={16}/></button>
               <button className="h-10 hover:bg-[#333] flex items-center justify-center text-[#9ca3af] hover:text-white border-b border-[#333]"><MonitorPlay size={16}/></button>
               <button className="h-10 hover:bg-[#333] flex items-center justify-center text-[#9ca3af] hover:text-white"><Sliders size={16}/></button>
            </div>
         </div>

         {/* Property Panel (Right) */}
         <div className="w-[340px] bg-[#222] border-l border-[#333] overflow-y-auto shrink-0 z-10 flex flex-col custom-scrollbar shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
            <div className="bg-[#111] p-2 flex justify-between items-center border-b border-[#333]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#eab308]">Properties</span>
                <button className="text-[#666] hover:text-white"><Maximize size={12}/></button>
            </div>
            
            {/* ZDefocus Properties */}
            <div className="p-3">
                <div className="bg-[#713f12] text-white text-[12px] font-bold p-1.5 px-3 rounded-t border border-[#4d2c0b] flex justify-between items-center">
                  ZDefocus1
                  <button className="w-4 h-4 bg-[#111] rounded text-[#eab308] flex items-center justify-center text-[10px] font-bold border border-[#eab308]">?</button>
                </div>
                <div className="bg-[#1a1a1a] border border-[#333] border-t-0 rounded-b p-3 space-y-3">
                   
                   <div className="flex gap-4 border-b border-[#333] pb-2 text-[11px]">
                      <button className="text-white font-bold border-b-2 border-[#eab308] pb-1">ZDefocus</button>
                      <button className="text-[#888] hover:text-white pb-1">Mask</button>
                   </div>
                   
                   <div className="space-y-4 pt-2">
                       <div className="flex items-center">
                          <span className="w-24 text-[11px] text-[#9ca3af] text-right pr-3">math</span>
                          <select className="flex-1 bg-[#222] border border-[#444] text-white text-[11px] p-1 rounded outline-none h-6">
                             <option>direct</option>
                             <option selected>depth</option>
                             <option>far = 0</option>
                          </select>
                       </div>

                       <div className="flex items-center">
                          <span className="w-24 text-[11px] text-[#9ca3af] text-right pr-3 hover:text-white cursor-ew-resize">focus plane</span>
                          <div className="flex-1 flex gap-1">
                             <input type="number" defaultValue={0.52} step={0.01} className="w-[60px] bg-[#222] border border-[#444] text-white text-[11px] p-1 rounded outline-none text-right placeholder-gray-600 focus:border-[#eab308]" />
                             <input type="range" className="flex-1 accent-[#eab308] h-1.5 mt-2" min={0} max={1} step={0.01} defaultValue={0.52} />
                          </div>
                          <button className="w-4 h-4 rounded ml-1 bg-[#333] border border-[#555] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#eab308] rounded-full"></div></button>
                       </div>

                       <div className="flex items-center">
                          <span className="w-24 text-[11px] text-[#9ca3af] text-right pr-3 hover:text-white cursor-ew-resize">depth of field</span>
                          <div className="flex-1 flex gap-1">
                             <input type="number" defaultValue={0.05} step={0.001} className="w-[60px] bg-[#222] border border-[#444] text-white text-[11px] p-1 rounded outline-none text-right focus:border-[#eab308]" />
                             <input type="range" className="flex-1 accent-[#eab308] h-1.5 mt-2" min={0} max={0.2} step={0.001} defaultValue={0.05} />
                          </div>
                          <button className="w-4 h-4 rounded ml-1 bg-[#333] border border-[#555] flex items-center justify-center opacity-0"></button>
                       </div>

                       <div className="flex items-center">
                          <span className="w-24 text-[11px] text-[#9ca3af] text-right pr-3 hover:text-white cursor-ew-resize">size</span>
                          <div className="flex-1 flex gap-1">
                             <input type="number" defaultValue={15} step={1} className="w-[60px] bg-[#222] border border-[#444] text-white text-[11px] p-1 rounded outline-none text-right focus:border-[#eab308]" />
                             <input type="range" className="flex-1 accent-[#eab308] h-1.5 mt-2" min={0} max={100} step={1} defaultValue={15} />
                          </div>
                           <button className="w-4 h-4 rounded ml-1 bg-[#333] border border-[#555] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#eab308] rounded-full"></div></button>
                       </div>

                       <div className="flex items-center">
                          <span className="w-24 text-[11px] text-[#9ca3af] text-right pr-3 hover:text-white cursor-ew-resize">max size</span>
                          <div className="flex-1 flex gap-1">
                             <input type="number" defaultValue={100} step={1} className="w-[60px] bg-[#222] border border-[#444] text-white text-[11px] p-1 rounded outline-none text-right focus:border-[#eab308]" />
                             <input type="range" className="flex-1 accent-[#eab308] h-1.5 mt-2" min={0} max={500} step={1} defaultValue={100} />
                          </div>
                       </div>
                       
                       <div className="w-full h-[1px] bg-[#333] my-2"></div>

                       <div className="flex items-center">
                          <span className="w-24 text-[11px] text-[#9ca3af] text-right pr-3">filter shape</span>
                          <select className="flex-1 bg-[#222] border border-[#444] text-white text-[11px] p-1 rounded outline-none h-6">
                             <option>disc</option>
                             <option selected>bladed</option>
                             <option>image</option>
                          </select>
                       </div>
                       <div className="flex items-center">
                          <span className="w-24 text-[11px] text-[#9ca3af] text-right pr-3 hover:text-white cursor-ew-resize">blades</span>
                          <div className="flex-1 flex gap-1">
                             <input type="number" defaultValue={6} step={1} className="w-[60px] bg-[#222] border border-[#444] text-white text-[11px] p-1 rounded outline-none text-right focus:border-[#eab308]" />
                             <input type="range" className="flex-1 accent-[#eab308] h-1.5 mt-2" min={3} max={12} step={1} defaultValue={6} />
                          </div>
                           <button className="w-4 h-4 rounded ml-1 bg-[#333] border border-[#555] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#eab308] rounded-full"></div></button>
                       </div>
                       <div className="flex items-center">
                          <span className="w-24 text-[11px] text-[#9ca3af] text-right pr-3 hover:text-white cursor-ew-resize">aspect ratio</span>
                          <div className="flex-1 flex gap-1">
                             <input type="number" defaultValue={1.0} step={0.1} className="w-[60px] bg-[#222] border border-[#444] text-white text-[11px] p-1 rounded outline-none text-right focus:border-[#eab308]" />
                             <input type="range" className="flex-1 accent-[#eab308] h-1.5 mt-2" min={0.1} max={2.0} step={0.1} defaultValue={1.0} />
                          </div>
                           <button className="w-4 h-4 rounded ml-1 bg-[#333] border border-[#555] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#eab308] rounded-full"></div></button>
                       </div>

                   </div>
                </div>
            </div>

            {/* Merge Properties */}
            <div className="p-3 pt-0">
                <div className="bg-[#1e3a8a] text-white text-[12px] font-bold p-1.5 px-3 rounded-t border border-[#60a5fa] flex justify-between items-center">
                  Merge1
                  <button className="w-4 h-4 bg-[#111] rounded text-[#60a5fa] flex items-center justify-center text-[10px] font-bold border border-[#60a5fa]">?</button>
                </div>
                <div className="bg-[#1a1a1a] border border-[#333] border-t-0 rounded-b p-3 space-y-3">
                   <div className="flex items-center">
                      <span className="w-24 text-[11px] text-[#9ca3af] text-right pr-3">operation</span>
                      <select className="flex-1 bg-[#222] border border-[#444] text-white text-[11px] p-1 rounded outline-none h-6 focus:border-[#60a5fa]">
                         <option>atop</option>
                         <option>average</option>
                         <option>multiply</option>
                         <option selected>over</option>
                         <option>screen</option>
                         <option>plus</option>
                      </select>
                   </div>
                   <div className="flex items-center">
                      <span className="w-24 text-[11px] text-[#9ca3af] text-right pr-3 hover:text-white cursor-ew-resize">mix</span>
                      <div className="flex-1 flex gap-1">
                         <input type="number" defaultValue={1.0} step={0.01} className="w-[60px] bg-[#222] border border-[#444] text-white text-[11px] p-1 rounded outline-none text-right focus:border-[#60a5fa]" />
                         <input type="range" className="flex-1 accent-[#60a5fa] h-1.5 mt-2" min={0} max={1.0} step={0.01} defaultValue={1.0} />
                      </div>
                       <button className="w-4 h-4 rounded ml-1 bg-[#333] border border-[#555] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#60a5fa] rounded-full"></div></button>
                   </div>
                </div>
            </div>

         </div>

      </div>

      {/* Frame Timeline / Playback bar */}
      <div className="h-10 bg-[#111] border-t border-[#333] flex items-center px-4 shrink-0 shadow-[0_-5px_15px_rgba(0,0,0,0.5)] z-20">
         <div className="flex gap-1 items-center mr-4">
             <button className="w-6 h-6 rounded bg-[#222] hover:bg-[#333] text-[#aaa] flex items-center justify-center text-[10px]">|&lt;</button>
             <button className="w-6 h-6 rounded bg-[#222] hover:bg-[#333] text-[#aaa] flex items-center justify-center text-[10px]">&lt;</button>
             <button className="w-8 h-8 rounded bg-[#333] hover:bg-[#444] text-[#eab308] border border-[#555] flex items-center justify-center"><Play size={14} fill="currentColor" /></button>
             <button className="w-6 h-6 rounded bg-[#222] hover:bg-[#333] text-[#aaa] flex items-center justify-center text-[10px]">&gt;</button>
             <button className="w-6 h-6 rounded bg-[#222] hover:bg-[#333] text-[#aaa] flex items-center justify-center text-[10px]">&gt;|</button>
         </div>
         <div className="flex-1 flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#666]">1</span>
            <div className="flex-1 h-3 bg-[#222] rounded flex items-center relative cursor-text">
                <div className="absolute top-0 bottom-0 left-[20%] right-[30%] bg-[#eab308]/20 border-l border-r border-[#eab308]/50"></div>
                <div className="w-1.5 h-4 bg-[#eab308] rounded ml-[45%] z-10 shadow-[0_0_5px_#eab308]"></div>
            </div>
            <span className="text-[10px] font-mono text-[#666]">100</span>
         </div>
         <div className="ml-4 flex items-center gap-3 bg-[#222] px-2 py-1 rounded border border-[#333]">
             <span className="text-[11px] font-bold text-white font-mono">45</span>
             <span className="text-[9px] text-[#888]">/ 100</span>
         </div>
      </div>

    </div>
  );
}
