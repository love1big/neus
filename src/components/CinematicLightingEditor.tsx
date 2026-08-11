import React, { useState } from 'react';
import { Sun, Moon, Cloud, CloudRain, Droplets, Wind, Zap, Eye, Save, Settings2, Sliders, Image as ImageIcon, Video, Hexagon, Component, RadioReceiver} from 'lucide-react';

export default function CinematicLightingEditor() {
  return (
    <div className="flex flex-col h-full bg-[#111] text-[#c9d1d9] font-sans">
      
      {/* Top Protocol Bar */}
      <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.5)] z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-gradient-to-tr from-[#e3b341] to-[#f85149] text-black shadow-lg shadow-[#e3b341]/20">
             <Sun size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
              Atmosphere & Cinematic Lighting System
            </h2>
            <p className="text-[#8b949e] text-[9px] font-mono">VOLUMETRIC CLOUDS • RAY-TRACED GI • HDR SKY SPHERE • DAY/NIGHT CYCLE</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-white px-3 py-1.5 flex items-center gap-2 text-[11px] font-bold rounded transition"><Save size={14}/> Bake Lighting Profile</button>
           <button className="bg-[#f85149] hover:bg-[#e04540] text-white px-4 py-1.5 flex items-center gap-2 text-[11px] font-bold rounded shadow-lg shadow-[#f85149]/20 transition"><Zap size={14}/> Force Path Trace Preview</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Render Viewport */}
         <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
             
             {/* Scene Preview (Simulated with CSS gradients) */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#E0F6FF] to-[#1e1e1e] opacity-80 mix-blend-screen"></div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,200,0.4),transparent_60%)]"></div>
             
             {/* Dynamic Light source icon */}
             <div className="absolute top-[30%] left-[60%] flex flex-col items-center gap-1 group cursor-pointer">
                <Sun size={48} className="text-[#FFD700] drop-shadow-[0_0_20px_#e3b341] opacity-90 animate-pulse"/>
                <span className="text-[10px] text-white bg-black/50 px-1 rounded opacity-0 group-hover:opacity-100 transition">DirectionalLight_Sun</span>
             </div>

             {/* UI Overlay Controls */}
             <div className="absolute top-4 right-4 bg-[#161b22]/90 border border-[#30363d] rounded p-2 backdrop-blur z-10 flex gap-2 shadow-lg">
                <button className="text-[#c9d1d9] hover:text-white bg-[#0d1117] border border-[#30363d] p-1.5 rounded"><Sun size={14}/></button>
                <button className="text-[#c9d1d9] hover:text-white bg-[#0d1117] border border-[#30363d] p-1.5 rounded"><Moon size={14}/></button>
                <button className="text-[#c9d1d9] hover:text-white bg-[#0d1117] border border-[#30363d] p-1.5 rounded"><Cloud size={14}/></button>
             </div>

             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[80%] bg-[#161b22]/80 backdrop-blur border border-[#30363d] rounded-full px-6 py-2 flex items-center justify-between z-10">
                <span className="text-[10px] font-bold text-white tracking-widest uppercase">Time of Day Simulator</span>
                <input type="range" className="w-[60%] accent-[#e3b341]" min="0" max="24" step="0.1" defaultValue="14" />
                <span className="text-[11px] font-mono text-[#e3b341]">14:00 PM</span>
             </div>
         </div>

         {/* Settings & Parameters Right Sidebar */}
         <div className="w-[340px] bg-[#0d1117] border-l border-[#30363d] flex flex-col shrink-0 z-20 shadow-2xl">
            <div className="flex font-bold text-[10px] uppercase tracking-widest bg-[#161b22] border-b border-[#30363d] shrink-0">
               <button className="flex-1 py-3 text-white border-b-2 border-[#e3b341]">Directional</button>
               <button className="flex-1 py-3 text-[#8b949e] hover:text-white border-b-2 border-transparent">SkyAtmosphere</button>
               <button className="flex-1 py-3 text-[#8b949e] hover:text-white border-b-2 border-transparent">Volumetric</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-[11px]">
               
               {/* Light Source */}
               <div className="space-y-3 font-mono">
                  <h3 className="text-[#e3b341] font-bold uppercase border-b border-[#30363d] pb-2 flex items-center gap-2"><Sun size={12}/> Primary Source (Sun)</h3>
                  
                  <div className="space-y-1">
                     <div className="flex justify-between items-center text-[#c9d1d9]"><span>Intensity (Lux)</span><input type="text" defaultValue="100000" className="bg-[#161b22] border border-[#30363d] w-16 text-center text-white px-1 py-0.5 rounded outline-none"/></div>
                     <input type="range" className="w-full accent-[#58a6ff] bg-black" min="0" max="150000" defaultValue="100000" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                     <span className="text-[#c9d1d9]">Light Color</span>
                     <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded p-1">
                        <div className="w-12 h-4 bg-[#FFFAE6] rounded border border-[#444]"></div>
                        <input type="text" defaultValue="FFFAE6" className="w-14 bg-transparent outline-none text-[#58a6ff] uppercase"/>
                     </div>
                  </div>

                  <div className="flex items-center justify-between">
                     <span className="text-[#c9d1d9]">Source Angle (Soft Shadows)</span>
                     <input type="text" defaultValue="0.53" className="bg-[#161b22] border border-[#30363d] w-16 text-center text-white px-1 py-0.5 rounded outline-none"/>
                  </div>
               </div>

               {/* GI Setup */}
               <div className="space-y-3 font-mono mt-4 pt-4 border-t border-[#30363d]">
                  <h3 className="text-[#f85149] font-bold uppercase border-b border-[#30363d] pb-2 flex items-center gap-2"><RadioReceiver size={12}/> Global Illumination Method</h3>
                  
                  <select className="w-full bg-[#161b22] border border-[#30363d] rounded p-2 text-white outline-none">
                     <option>Lumen (Software RayTraced)</option>
                     <option>Hardware RayTracing (RTX)</option>
                     <option>Screen Space (SSGI)</option>
                     <option>Baked Lightmaps / Voxel</option>
                  </select>

                  <div className="bg-[#161b22] border border-[#30363d] p-2 rounded space-y-2 mt-2 text-[10px]">
                     <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#f85149]"/> Use Hardware Ray Tracing if available</label>
                     <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#f85149]"/> Final Gather Quality</label>
                     <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" className="accent-[#f85149]"/> Emissive Material Interaction</label>
                  </div>
               </div>

               {/* Volumetric Fog */}
               <div className="space-y-3 font-mono mt-4 pt-4 border-t border-[#30363d]">
                  <h3 className="text-[#58a6ff] font-bold uppercase border-b border-[#30363d] pb-2 flex items-center gap-2"><Component size={12}/> Exponential Height Fog</h3>
                  
                  <div className="space-y-1">
                     <div className="flex justify-between items-center text-[#c9d1d9]"><span>Fog Density</span><input type="text" defaultValue="0.02" className="bg-[#161b22] border border-[#30363d] w-16 text-center text-white px-1 py-0.5 rounded outline-none"/></div>
                     <input type="range" className="w-full accent-[#58a6ff] bg-black" min="0" max="0.1" step="0.01" defaultValue="0.02" />
                  </div>
                  
                  <div className="space-y-1">
                     <div className="flex justify-between items-center text-[#c9d1d9]"><span>Fog Falloff</span><input type="text" defaultValue="0.2" className="bg-[#161b22] border border-[#30363d] w-16 text-center text-white px-1 py-0.5 rounded outline-none"/></div>
                     <input type="range" className="w-full accent-[#58a6ff] bg-black" min="0" max="2" step="0.1" defaultValue="0.2" />
                  </div>

                  <div className="flex items-center justify-between">
                     <span className="text-[#c9d1d9]">Inscattering Color</span>
                     <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded p-1">
                        <div className="w-12 h-4 bg-[#AACCFF] rounded border border-[#444]"></div>
                     </div>
                  </div>
                  
                  <label className="flex items-center gap-2 text-[#c9d1d9] mt-2 font-bold bg-[#161b22] p-2 rounded border border-[#30363d]">
                     <input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Enable Volumetric Lighting (God Rays)
                  </label>
               </div>

            </div>
         </div>

      </div>
    </div>
  );
}
