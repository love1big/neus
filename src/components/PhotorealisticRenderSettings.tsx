import React, { useState } from 'react';
import { Camera, Image, Sliders, Play, Maximize, Orbit, Sun } from 'lucide-react';

export default function PhotorealisticRenderSettings() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-1.5 rounded-lg shadow-lg">
            <Orbit size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Photorealistic <span className="text-amber-400">Renderer</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Path Tracing & RTX Config</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-gray-300 px-3 py-1.5 rounded text-xs font-bold transition-colors">
             <Image size={14} /> HI-RES SCREENSHOT
           </button>
           <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-[0_0_10px_rgba(245,158,11,0.4)]">
             <Play size={14} /> RENDER SEQUENCE
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Render Settings */}
        <div className="w-80 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Sliders size={14}/> Engine config</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
             
             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Rendering Mode</h4>
               <select className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1.5 text-[10px] text-gray-200 outline-none">
                 <option>Path Tracing (Offline Quality)</option>
                 <option>Hardware Raytracing (Lumen/RTX)</option>
                 <option>Rasterized (Fast)</option>
               </select>
             </div>

             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Path Tracing Limits</h4>
               <div className="space-y-2 text-[10px]">
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Max Bounces (GI)</span><span>8</span></div>
                   <input type="range" min="1" max="32" defaultValue="8" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-amber-400" />
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Samples per Pixel (SPP)</span><span>1024</span></div>
                   <input type="range" min="1" max="4096" defaultValue="1024" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-amber-400" />
                 </div>
               </div>
             </div>

             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Denoising</h4>
               <select className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1.5 text-[10px] text-gray-200 outline-none">
                 <option>NVIDIA OptiX (AI Denoiser)</option>
                 <option>Intel Open Image Denoise (OIDN)</option>
                 <option>Spatial + Temporal (Real-time)</option>
                 <option>None</option>
               </select>
             </div>
             
             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Features</h4>
               <div className="space-y-2 text-[10px] text-gray-300">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-amber-500 focus:ring-0" /> Caustics (Refractive)
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-amber-500 focus:ring-0" /> Subsurface Scattering (SSS)
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded bg-[#1a1a1c] border-[#3e3e42] text-amber-500 focus:ring-0" /> Depth of Field (DoF)
                  </label>
               </div>
             </div>

          </div>
        </div>

        {/* Center: Live Render Viewport */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
           {/* Fake Render */}
           <div className="w-[80%] h-[70%] border border-gray-600 rounded bg-[#0f0f11] relative overflow-hidden shadow-2xl flex items-center justify-center">
              {/* Fake Path Tracing Noise overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
              
              {/* Mock Objects */}
              <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-white/90 to-white/10 backdrop-blur-md shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center justify-center border border-white/30">
                 {/* Fake Caustic */}
                 <div className="absolute -bottom-10 right-10 w-24 h-12 bg-white/20 blur-xl rotate-12 rounded-full"></div>
              </div>
              
              <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-gradient-to-tr from-amber-700 to-yellow-400 rounded-sm shadow-2xl transform rotate-12"></div>
           </div>
           
           {/* Overlay */}
           <div className="absolute top-4 left-4 bg-[#252526]/80 backdrop-blur border border-[#3e3e42] p-2 rounded text-[10px] font-mono text-gray-300">
             Frame: <span className="text-amber-400">142</span> / 1024 SPP<br/>
             Time: <span className="text-gray-400">00:14.2s</span>
           </div>
           
           <div className="absolute top-4 right-4 bg-[#1a1a1c]/80 backdrop-blur border border-[#3e3e42] px-2 py-1 rounded text-[9px] font-mono text-gray-400 flex items-center gap-1">
             <Camera size={10}/> 35mm f/1.8
           </div>
        </div>

      </div>
    </div>
  );
}
