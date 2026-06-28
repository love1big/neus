import React from 'react';
import { Camera, Blocks, Save, Eye, Map as MapIcon, Sliders, Play, Maximize, Target, Aperture, Combine, Trash2, Crosshair, Cloud, ShieldCheck, CheckCircle, Activity } from 'lucide-react';

export default function PhotogrammetryMeshBuilder() {
  return (
    <div className="flex flex-col h-full bg-[#1c1c1e] text-[#f2f2f7] font-sans">
      <div className="h-12 bg-[#2c2c2e] border-b border-[#3a3a3c] shadow flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-gradient-to-br from-[#ff9f0a] to-[#ff375f] flex items-center justify-center text-white">
                <Camera size={18}/>
             </div>
             <div>
                 <h2 className="font-bold text-[12px] uppercase tracking-widest text-white">Photogrammetry 3D Scanner</h2>
                 <p className="text-[9px] text-[#aeaeb2] font-mono">POINT CLOUD • MESH RECONSTRUCTION • UV BAKE</p>
             </div>
          </div>
          
          <div className="flex gap-2">
             <button className="bg-[#3a3a3c] hover:bg-[#48484a] border border-[#aeaeb2]/30 px-3 py-1.5 rounded text-[10px] font-bold text-white uppercase"><Combine size={14} className="inline mr-1"/> Merge Sets</button>
             <button className="bg-[#34c759] hover:bg-[#30b753] text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase shadow-[0_0_10px_rgba(52,199,89,0.3)]"><Play size={14} className="inline mr-1" fill="currentColor"/> Start Processing</button>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Left Picture Set */}
         <div className="w-64 bg-[#1c1c1e] border-r border-[#3a3a3c] flex flex-col shrink-0">
            <div className="p-3 bg-[#2c2c2e] border-b border-[#3a3a3c] text-[11px] font-bold uppercase tracking-widest text-[#aeaeb2] flex justify-between items-center">
               Image Dataset (242)
               <span className="bg-[#1c1c1e] px-2 py-0.5 rounded text-[9px] text-white">98% Aligned</span>
            </div>
            
            <div className="flex-1 p-2 grid grid-cols-2 gap-2 overflow-y-auto custom-scrollbar content-start">
               {/* Fakes pics */}
               {[...Array(14)].map((_, i) => (
                  <div key={i} className={`bg-[#2c2c2e] aspect-square rounded border ${i===0?'border-[#ff9f0a]':'border-[#3a3a3c]'} overflow-hidden relative cursor-pointer group`}>
                     <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center pt-2">
                        <Camera size={16} className="text-[#8e8e93] opacity-30"/>
                     </div>
                     <div className="absolute bottom-1 left-1 bg-black/60 px-1 rounded text-[8px] font-mono text-white">IMG_{4050+i}.CR3</div>
                     {i===0 && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#34c759] shadow-[0_0_5px_#34c759]"></div>}
                  </div>
               ))}
               <div className="aspect-square border-2 border-dashed border-[#3a3a3c] rounded flex items-center justify-center text-[#8e8e93] hover:text-white hover:border-[#8e8e93] cursor-pointer">
                  <div className="text-[20px] font-light">+</div>
               </div>
            </div>
         </div>

         {/* Center Viewport */}
         <div className="flex-1 bg-black relative flex flex-col items-center justify-center overflow-hidden border-r border-[#3a3a3c]">
            {/* Viewport UI layer */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
               <button className="bg-[#2c2c2e]/80 p-2 rounded hover:bg-[#3a3a3c] border border-[#48484a] text-[#f2f2f7]"><Crosshair size={14}/></button>
               <button className="bg-[#2c2c2e]/80 p-2 rounded hover:bg-[#3a3a3c] border border-[#48484a] text-[#f2f2f7]"><Maximize size={14}/></button>
            </div>

            <div className="absolute bottom-4 left-0 w-full flex justify-center z-10">
               <div className="bg-[#2c2c2e]/80 backdrop-blur border border-[#48484a] rounded-full px-4 py-1.5 flex gap-4 text-[10px] font-bold text-[#aeaeb2] uppercase">
                  <button className="hover:text-white">Cameras</button>
                  <button className="hover:text-white">Tie Points</button>
                  <button className="text-[#ff9f0a]">Dense Cloud</button>
                  <button className="hover:text-white">Mesh</button>
                  <button className="hover:text-white">Textured</button>
               </div>
            </div>

            {/* Fake Point Cloud Visual rendering */}
            <div className="w-[500px] h-[500px] relative">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 relative animate-pulse" style={{ animationDuration: '4s' }}>
                     {/* Simulating dense points via CSS shadow hacks or radial gradients */}
                     <div className="absolute inset-0 rounded-[30%] blur-[1px] opacity-70 transform rotate-12" style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, white 0%, transparent 2%), radial-gradient(circle at 30% 60%, #ff9f0a 0%, transparent 2%), radial-gradient(circle at 70% 40%, #ff375f 0%, transparent 2%)',
                        backgroundSize: '10px 10px'
                     }}></div>
                     <div className="absolute inset-4 rounded-[40%] blur-[2px] opacity-50 transform -rotate-12 bg-white/10" style={{
                         backgroundImage: 'radial-gradient(circle at center, #34c759 0%, transparent 1%)',
                         backgroundSize: '8px 8px'
                     }}></div>
                  </div>
               </div>
            </div>

         </div>

         {/* Settings Menu */}
         <div className="w-[340px] bg-[#1c1c1e] flex flex-col shrink-0 z-10">
            <div className="p-3 bg-[#2c2c2e] border-b border-[#3a3a3c] text-[11px] font-bold uppercase tracking-widest text-white flex gap-2 items-center">
               <Sliders size={14} className="text-[#32ade6]"/> Pipeline Processing
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-6 custom-scrollbar text-[11px]">
               
               {/* Alignment */}
               <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-[#3a3a3c] pb-1">
                     <span className="font-bold text-[#ff9f0a] uppercase tracking-widest font-mono text-[10px]">1. Align Photos</span>
                     <CheckCircle size={14} className="text-[#34c759]"/>
                  </div>
                  <div className="flex justify-between items-center text-[#aeaeb2]">
                     <span>Accuracy</span>
                     <select defaultValue="High" className="bg-[#2c2c2e] border border-[#48484a] text-white p-1 rounded font-mono w-24">
                        <option>Highest</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                     </select>
                  </div>
                  <div className="flex justify-between items-center text-[#aeaeb2]">
                     <span>Key point limit</span>
                     <input type="number" defaultValue="40000" className="bg-[#2c2c2e] border border-[#48484a] text-white p-1 rounded font-mono w-24 text-right" />
                  </div>
               </div>

               {/* Dense Cloud */}
               <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-[#3a3a3c] pb-1">
                     <span className="font-bold text-[#ff9f0a] uppercase tracking-widest font-mono text-[10px]">2. Build Dense Cloud</span>
                     <Activity size={14} className="text-[#32ade6] animate-spin-slow"/>
                  </div>
                  <div className="flex justify-between items-center text-[#aeaeb2]">
                     <span>Quality</span>
                     <select defaultValue="High" className="bg-[#2c2c2e] border border-[#48484a] text-white p-1 rounded font-mono w-24">
                        <option>Ultra High</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                     </select>
                  </div>
                  <div className="flex justify-between items-center text-[#aeaeb2]">
                     <span>Depth filtering</span>
                     <select defaultValue="Mild" className="bg-[#2c2c2e] border border-[#48484a] text-white p-1 rounded font-mono w-24">
                        <option>Disabled</option>
                        <option>Mild</option>
                        <option>Moderate</option>
                        <option>Aggressive</option>
                     </select>
                  </div>
               </div>

               {/* Mesh Recon */}
               <div className="space-y-3 opacity-50">
                  <div className="flex justify-between items-center border-b border-[#3a3a3c] pb-1">
                     <span className="font-bold text-[#f2f2f7] uppercase tracking-widest font-mono text-[10px]">3. Build Mesh</span>
                     <div className="w-3 h-3 rounded-full border border-[#8e8e93]"></div>
                  </div>
                  <div className="flex justify-between items-center text-[#aeaeb2]">
                     <span>Source data</span>
                     <select disabled className="bg-[#2c2c2e] border border-[#48484a] text-white p-1 rounded font-mono w-24">
                        <option>Dense cloud</option>
                     </select>
                  </div>
                  <div className="flex justify-between items-center text-[#aeaeb2]">
                     <span>Face count</span>
                     <select disabled className="bg-[#2c2c2e] border border-[#48484a] text-white p-1 rounded font-mono w-24">
                        <option>High (1.2M)</option>
                     </select>
                  </div>
               </div>
               
               {/* Base info details */}
               <div className="mt-8 bg-[#2c2c2e] border border-[#3a3a3c] rounded p-3 text-[10px] space-y-1">
                  <div className="flex justify-between text-[#aeaeb2]"><span>Estimated RAM:</span> <span className="font-mono text-white">48.2 GB</span></div>
                  <div className="flex justify-between text-[#aeaeb2]"><span>GPU Compute:</span> <span className="font-mono text-[#32ade6]">Enabled (CUDA)</span></div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
}
