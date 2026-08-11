import React, { useState } from 'react';
import { Layers, Paintbrush, Pipette, Zap, Download, Sun, Droplets, Layout, Maximize, MousePointer2} from 'lucide-react';

export default function SubstanceStyleTexturePainter() {
  const [activeChannel, setActiveChannel] = useState('baseColor');

  return (
    <div className="flex flex-col h-full bg-[#111] text-[#c9d1d9] font-sans">
      <div className="h-12 bg-[#1a1a1a] border-b border-[#333] shadow flex items-center justify-between px-4 shrink-0">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#bc8cff] to-[#58a6ff] rounded flex items-center justify-center text-white font-bold">
               <Paintbrush size={18}/>
            </div>
            <span className="font-bold text-[12px] uppercase tracking-widest text-white">Procedural Texture Painter</span>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Left Shelf / Materials */}
         <div className="w-64 bg-[#161b22] border-r border-[#333] flex flex-col shrink-0">
             <div className="p-3 border-b border-[#333] bg-[#0d1117] text-[10px] font-bold uppercase text-[#888] tracking-widest">
                Shelf - Smart Materials
             </div>
             <div className="flex-1 overflow-y-auto p-2 grid grid-cols-2 gap-2 custom-scrollbar content-start">
                {[...Array(12)].map((_, i) => (
                   <div key={i} className="bg-[#21262d] border border-[#30363d] rounded p-1 hover:border-[#58a6ff] cursor-pointer flex flex-col items-center">
                      <div className="w-full aspect-square bg-[#30363d] rounded-sm mb-1 flex items-center justify-center">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#888] to-[#222] shadow-inner"></div>
                      </div>
                      <span className="text-[10px] text-[#8b949e] truncate w-full text-center">Metal_Scratched_{i+1}</span>
                   </div>
                ))}
             </div>
         </div>

         {/* Center Viewport */}
         <div className="flex-1 bg-[#0d1117] relative flex items-center justify-center">
            {/* Fake 3D Object overlay */}
            <div className="w-96 h-96 relative">
                <div className="absolute inset-0 rounded-[20%] bg-[#555] shadow-[inset_-20px_-20px_60px_rgba(0,0,0,0.8),inset_20px_20px_40px_rgba(255,255,255,0.2)] transform rotate-12">
                   {/* Fake painted strokes mapped to object */}
                   <div className="absolute top-1/4 left-1/4 w-32 h-10 bg-[#bc8cff]/40 rounded-full blur-md transform -rotate-12 mix-blend-overlay"></div>
                   <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-[#58a6ff]/30 rounded-full blur-xl mix-blend-overlay"></div>
                   
                   {/* Normal map bump effect fake */}
                   <div className="absolute inset-0 rounded-[20%] opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                </div>
                
                {/* 3D view controls */}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                   <button className="w-8 h-8 bg-black/50 rounded flex items-center justify-center text-white border border-[#333] hover:border-[#58a6ff]"><Sun size={14}/></button>
                   <button className="w-8 h-8 bg-black/50 rounded flex items-center justify-center text-white border border-[#333] hover:border-[#58a6ff]"><Layout size={14}/></button>
                </div>
            </div>
         </div>

         {/* Right Settings */}
         <div className="w-[320px] bg-[#161b22] border-l border-[#333] flex flex-col shrink-0 z-10 shadow-xl">
             <div className="flex flex-col h-1/2 border-b border-[#333]">
                 <div className="p-2 bg-[#0d1117] border-b border-[#333] text-[10px] uppercase font-bold text-white flex justify-between">
                    <span>Layers</span>
                    <div className="flex gap-2">
                       <button className="text-[#888] hover:text-white">+</button>
                       <button className="text-[#888] hover:text-white">F</button>
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    <div className="bg-[#21262d] p-2 rounded border border-[#58a6ff] flex items-center gap-2 cursor-pointer">
                       <div className="w-6 h-6 bg-[#bc8cff] rounded-sm"></div>
                       <span className="text-[11px] text-white">Paint Layer 1</span>
                    </div>
                    <div className="bg-[#111] p-2 rounded border border-[#30363d] flex items-center gap-2 cursor-pointer opacity-80">
                       <div className="w-6 h-6 bg-gradient-to-br from-[#555] to-[#222] rounded-sm"></div>
                       <span className="text-[11px] text-[#8b949e]">Steel Scratched Base</span>
                    </div>
                 </div>
             </div>

             <div className="flex flex-col h-1/2">
                 <div className="p-2 bg-[#0d1117] border-b border-[#333] text-[10px] uppercase font-bold text-white">
                    Properties - Paint
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[11px]">
                     <div>
                        <div className="flex justify-between text-[#8b949e] mb-1"><span>Size</span><span>3.54</span></div>
                        <input type="range" className="w-full accent-[#bc8cff]" defaultValue="30" />
                     </div>
                     <div>
                        <div className="flex justify-between text-[#8b949e] mb-1"><span>Flow</span><span>100</span></div>
                        <input type="range" className="w-full accent-[#bc8cff]" defaultValue="100" />
                     </div>
                     <div>
                        <div className="flex justify-between text-[#8b949e] mb-1"><span>Stroke Opacity</span><span>100</span></div>
                        <input type="range" className="w-full accent-[#bc8cff]" defaultValue="100" />
                     </div>
                     
                     <div className="w-full h-px bg-[#333] my-2"></div>
                     
                     <div className="text-[10px] font-bold text-white mb-2 uppercase tracking-widest">Material Channels</div>
                     <div className="flex gap-1 mb-3">
                        <button onClick={() => setActiveChannel('color')} className={`flex-1 py-1 rounded border ${activeChannel === 'color' ? 'bg-[#bc8cff]/20 border-[#bc8cff] text-white' : 'bg-[#21262d] border-[#333] text-[#8b949e]'}`}>Color</button>
                        <button onClick={() => setActiveChannel('height')} className={`flex-1 py-1 rounded border ${activeChannel === 'height' ? 'bg-[#bc8cff]/20 border-[#bc8cff] text-white' : 'bg-[#21262d] border-[#333] text-[#8b949e]'}`}>Height</button>
                        <button onClick={() => setActiveChannel('rough')} className={`flex-1 py-1 rounded border ${activeChannel === 'rough' ? 'bg-[#bc8cff]/20 border-[#bc8cff] text-white' : 'bg-[#21262d] border-[#333] text-[#8b949e]'}`}>Rough</button>
                        <button onClick={() => setActiveChannel('metal')} className={`flex-1 py-1 rounded border ${activeChannel === 'metal' ? 'bg-[#bc8cff]/20 border-[#bc8cff] text-white' : 'bg-[#21262d] border-[#333] text-[#8b949e]'}`}>Metal</button>
                        <button onClick={() => setActiveChannel('nrm')} className={`flex-1 py-1 rounded border ${activeChannel === 'nrm' ? 'bg-[#bc8cff]/20 border-[#bc8cff] text-white' : 'bg-[#21262d] border-[#333] text-[#8b949e]'}`}>Nrm</button>
                     </div>
                     
                     {/* Base Color Picker */}
                     <div className="flex gap-3">
                        <div className="flex-1 h-20 bg-gradient-to-br from-[#bc8cff] to-black rounded border border-[#444] shadow-inner relative">
                           <div className="w-2 h-2 rounded-full border-2 border-white absolute top-4 left-4 shadow"></div>
                        </div>
                        <div className="w-8 h-20 bg-gradient-to-b from-[red] via-[lime] to-[blue] rounded border border-[#444]"></div>
                     </div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}
