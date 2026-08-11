import React from 'react';
import { Flame, Box, Maximize, Play, Sun, Layers, Droplet} from 'lucide-react';

export default function AdvancedShaderEditor() {
  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      {/* Node Graph */}
      <div className="flex-1 flex flex-col relative bg-[#0d1117] overflow-hidden">
         <div className="h-12 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-4 shrink-0 z-10 shadow-md">
            <div className="flex items-center gap-3">
               <Flame size={16} className="text-red-500" />
               <span className="font-bold text-sm">PBR Material Shader Graph</span>
            </div>
            <button className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded shadow">Compile Shader</button>
         </div>

         <div className="flex-1 relative" style={{
             backgroundImage: 'linear-gradient(#2a2b3d 1px, transparent 1px), linear-gradient(90deg, #2a2b3d 1px, transparent 1px)',
             backgroundSize: '30px 30px'
         }}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
               <path d="M 200 150 C 300 150, 400 200, 500 200" fill="none" stroke="#facc15" strokeWidth="2" />
               <path d="M 200 300 C 350 300, 350 250, 500 230" fill="none" stroke="#60a5fa" strokeWidth="2" />
            </svg>

            {/* Texture Sample Node */}
            <div className="absolute top-[100px] left-[50px] w-48 bg-[#141525] border border-[#2a2b3d] rounded shadow-xl">
               <div className="bg-[#1a1b26] border-b border-[#2a2b3d] px-3 py-1.5 text-xs font-bold flex items-center gap-2 rounded-t">
                  <Box size={12} className="text-green-400" /> Texture Sample
               </div>
               <div className="p-2 flex flex-col gap-2">
                  <div className="h-20 bg-gray-800 rounded border border-[#2a2b3d] flex items-center justify-center text-[10px] text-gray-500 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Texture"/>
                  </div>
                  <div className="flex justify-end text-xs text-yellow-400 gap-2 items-center">
                     RGB <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  </div>
               </div>
            </div>

            {/* Value Node */}
            <div className="absolute top-[280px] left-[50px] w-40 bg-[#141525] border border-[#2a2b3d] rounded shadow-xl">
               <div className="bg-[#1a1b26] border-b border-[#2a2b3d] px-3 py-1.5 text-xs font-bold rounded-t">
                  Float Constant
               </div>
               <div className="p-2 flex justify-between items-center">
                  <input type="number" className="w-16 bg-[#0a0a0f] border border-[#2a2b3d] text-xs p-1 text-white rounded" defaultValue="0.8" />
                  <div className="flex gap-2 items-center text-xs text-blue-400">
                     <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
               </div>
            </div>

            {/* Master Material Node */}
            <div className="absolute top-[150px] left-[500px] w-56 bg-[#141525] border border-red-500/50 rounded shadow-[0_0_20px_rgba(239,68,68,0.1)]">
               <div className="bg-gradient-to-r from-red-900/30 to-transparent border-b border-[#2a2b3d] px-3 py-2 text-xs font-bold rounded-t flex items-center gap-2">
                  <Layers size={14} className="text-red-400" /> Base Material
               </div>
               <div className="p-3 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                     <div className="w-3 h-3 rounded-full border-2 border-yellow-400 bg-[#0a0a0f] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div></div> Base Color
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                     <div className="w-3 h-3 rounded-full border-2 border-gray-500 bg-[#0a0a0f]"></div> Metallic
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                     <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-[#0a0a0f] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div></div> Roughness
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                     <div className="w-3 h-3 rounded-full border-2 border-purple-400 bg-[#0a0a0f]"></div> Normal Map
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Real-time Preview Panel */}
      <div className="w-80 border-l border-[#2a2b3d] flex flex-col shrink-0 bg-[#050505]">
         <div className="h-64 border-b border-[#2a2b3d] relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-2 right-2 flex gap-1 z-10">
               <button className="bg-[#141525]/80 p-1.5 rounded border border-[#2a2b3d] text-gray-400 hover:text-white"><Sun size={14}/></button>
               <button className="bg-[#141525]/80 p-1.5 rounded border border-[#2a2b3d] text-gray-400 hover:text-white"><Box size={14}/></button>
            </div>
            {/* Fake 3D Sphere Preview */}
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-300 via-gray-500 to-gray-900 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.5)]">
               <div className="w-full h-full rounded-full opacity-40 bg-[url('https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=200&auto=format&fit=crop')] mix-blend-overlay"></div>
               {/* Specular Highlight */}
               <div className="absolute top-16 left-24 w-8 h-8 bg-white rounded-full blur-md opacity-60"></div>
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-green-400 bg-black/60 px-2 py-1 rounded border border-[#2a2b3d]">
               Shader Compiled Successfully
            </div>
         </div>
         <div className="flex-1 bg-[#141525] p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
               <h3 className="text-xs font-bold text-gray-400 uppercase">Material Properties</h3>
               <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Blend Mode</span>
                  <select className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1 text-white"><option>Opaque</option><option>Translucent</option></select>
               </div>
               <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Two Sided</span>
                  <input type="checkbox" className="rounded bg-[#0a0a0f] border-[#2a2b3d]" />
               </div>
            </div>
            <div className="h-px bg-[#2a2b3d] w-full"></div>
            <div className="flex flex-col gap-2">
               <h3 className="text-xs font-bold text-gray-400 uppercase">Performance</h3>
               <div className="flex justify-between text-[10px] font-mono text-gray-300">
                  <span>Instruction Count</span><span className="text-blue-400">142</span>
               </div>
               <div className="flex justify-between text-[10px] font-mono text-gray-300">
                  <span>Texture Samplers</span><span className="text-yellow-400">3 / 16</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
