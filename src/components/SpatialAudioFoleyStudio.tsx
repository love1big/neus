import React, { useState } from "react";
import { 
  Mic, Headphones, Volume2, Waves, Radio, Speaker, Move3d, BoxSelect, Ear, LayoutGrid} from "lucide-react";

export default function SpatialAudioFoleyStudio() {
  const [activeTab, setActiveTab] = useState("spatial");

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#a371f7]/20 text-[#a371f7] rounded-lg border border-[#a371f7]/30">
            <Ear size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Spatial Audio & Adaptive Foley</h1>
            <div className="text-[10px] text-[#8b949e]">HRTF, Acoustic Propagation & Dynamic Material Audio</div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 flex flex-col items-center py-4 border-r border-[#30363d] bg-[#161b22] gap-4 z-10">
          <button onClick={() => setActiveTab("spatial")} className={`p-2 rounded-lg transition-colors ${activeTab === 'spatial' ? 'bg-[#a371f7]/20 text-[#a371f7] border border-[#a371f7]/30' : 'text-[#8b949e] hover:text-white'}`} title="Spatialization & HRTF">
            <Move3d size={20} />
          </button>
          <button onClick={() => setActiveTab("propagation")} className={`p-2 rounded-lg transition-colors ${activeTab === 'propagation' ? 'bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/30' : 'text-[#8b949e] hover:text-white'}`} title="Acoustic Propagation (Raytracing)">
            <Radio size={20} />
          </button>
          <button onClick={() => setActiveTab("foley")} className={`p-2 rounded-lg transition-colors ${activeTab === 'foley' ? 'bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/30' : 'text-[#8b949e] hover:text-white'}`} title="Adaptive Foley System">
            <Mic size={20} />
          </button>
          <button onClick={() => setActiveTab("reverb")} className={`p-2 rounded-lg transition-colors ${activeTab === 'reverb' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30' : 'text-[#8b949e] hover:text-white'}`} title="Reverb Volumes">
            <BoxSelect size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#010409]">
          
          {activeTab === "spatial" && (
            <div className="max-w-5xl mx-auto">
              <h2 className="text-lg font-bold text-white mb-6 border-b border-[#30363d] pb-2">3D Spatialization (HRTF)</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Headphones size={16} className="text-[#a371f7]"/> Binaural Renderer Settings</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs text-[#8b949e] mb-1 block">HRTF Dataset</label>
                      <select className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-xs text-white">
                        <option>SOFA Standard (Default)</option>
                        <option>Resonance Audio</option>
                        <option>Steam Audio HRTF</option>
                        <option>Custom Profile</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#8b949e] flex justify-between"><span>Distance Attenuation Model</span></label>
                      <select className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-xs text-white mt-1">
                        <option>Logarithmic (Realistic)</option>
                        <option>Linear</option>
                        <option>Inverse Square</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#8b949e] flex justify-between"><span>Doppler Effect Intensity</span> <span>1.0x</span></label>
                      <input type="range" min="0" max="2" step="0.1" defaultValue="1" className="w-full mt-1 accent-[#a371f7]" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col">
                  <h3 className="text-white font-bold mb-4">Listener Focus (Air Absorption)</h3>
                  <div className="flex-1 flex items-center justify-center border border-[#30363d] border-dashed rounded-lg bg-[#0d1117] relative">
                     <div className="absolute inset-0 pattern-grid-lg opacity-20"></div>
                     <div className="text-center z-10">
                       <Ear size={32} className="mx-auto text-[#8b949e] mb-2" />
                       <span className="text-xs text-[#8b949e]">Interactive Frequency Graph</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "propagation" && (
            <div className="max-w-4xl mx-auto">
               <h2 className="text-lg font-bold text-white mb-6 border-b border-[#30363d] pb-2 flex items-center gap-2">
                 <Radio size={20} className="text-[#3fb950]"/> Acoustic Raytracing (Sound Propagation)
               </h2>
               <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-white font-bold">Enable Real-Time Raytracing</span>
                       <div className="w-10 h-5 bg-[#3fb950] rounded-full relative cursor-pointer">
                         <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                       </div>
                     </div>
                     <p className="text-xs text-[#8b949e]">Simulates sound bouncing, occlusion, and diffraction physically accurately based on scene geometry.</p>
                     
                     <div className="pt-4 border-t border-[#30363d]">
                        <label className="text-xs text-[#8b949e] flex justify-between"><span>Max Bounces</span> <span>3</span></label>
                        <input type="range" min="1" max="8" defaultValue="3" className="w-full mt-1 accent-[#3fb950]" />
                     </div>
                     <div>
                        <label className="text-xs text-[#8b949e] flex justify-between"><span>Rays Per Source</span> <span>1024</span></label>
                        <input type="range" min="256" max="4096" defaultValue="1024" className="w-full mt-1 accent-[#3fb950]" />
                     </div>
                   </div>
                   <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                     <div className="text-xs font-bold text-[#c9d1d9] mb-3">Material Acoustic Properties</div>
                     <div className="space-y-2">
                       <div className="flex justify-between items-center bg-[#161b22] p-2 rounded text-xs border border-[#30363d]">
                         <span className="text-white">Concrete</span>
                         <span className="text-[#8b949e]">Absorption: 0.05 (High Bounce)</span>
                       </div>
                       <div className="flex justify-between items-center bg-[#161b22] p-2 rounded text-xs border border-[#30363d]">
                         <span className="text-white">Carpet</span>
                         <span className="text-[#8b949e]">Absorption: 0.70 (Low Bounce)</span>
                       </div>
                       <div className="flex justify-between items-center bg-[#161b22] p-2 rounded text-xs border border-[#30363d]">
                         <span className="text-white">Glass</span>
                         <span className="text-[#8b949e]">Absorption: 0.10 (High Bounce)</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === "foley" && (
            <div className="max-w-5xl mx-auto">
               <h2 className="text-lg font-bold text-white mb-6 border-b border-[#30363d] pb-2 flex items-center gap-2">
                 <Mic size={20} className="text-[#f85149]"/> Adaptive Foley & Locomotion Audio
               </h2>
               <div className="grid grid-cols-3 gap-6">
                 <div className="col-span-1 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
                   <div className="p-3 bg-[#0d1117] border-b border-[#30363d] font-bold text-xs">Physical Materials map</div>
                   <div className="p-2 space-y-1">
                     <button className="w-full text-left px-3 py-2 text-xs bg-[#f85149]/10 text-[#f85149] rounded">PM_Grass_Wet</button>
                     <button className="w-full text-left px-3 py-2 text-xs text-[#c9d1d9] hover:bg-[#21262d] rounded">PM_Concrete</button>
                     <button className="w-full text-left px-3 py-2 text-xs text-[#c9d1d9] hover:bg-[#21262d] rounded">PM_Wood_Hollow</button>
                     <button className="w-full text-left px-3 py-2 text-xs text-[#c9d1d9] hover:bg-[#21262d] rounded">PM_Snow_Deep</button>
                     <button className="w-full text-left px-3 py-2 text-xs text-[#c9d1d9] hover:bg-[#21262d] rounded">PM_Metal_Grate</button>
                   </div>
                 </div>
                 
                 <div className="col-span-2 bg-[#161b22] border border-[#30363d] rounded-xl p-5">
                   <h3 className="text-white font-bold mb-4">Event Triggers for: PM_Grass_Wet</h3>
                   <div className="space-y-4">
                     <div className="border border-[#30363d] rounded p-3 bg-[#0d1117]">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-[#c9d1d9]">Footstep_Walk</span>
                         <span className="text-[10px] px-2 py-1 bg-[#30363d] rounded text-[#8b949e]">MetaSound Patch</span>
                       </div>
                       <div className="flex gap-2">
                         <div className="h-8 w-24 bg-[#238636]/20 border border-[#238636]/50 rounded flex items-center justify-center">
                           <Volume2 size={14} className="text-[#2ea043]"/>
                         </div>
                         <div className="flex-1 flex flex-col justify-center">
                            <div className="text-[10px] text-[#8b949e] mb-1">Pitch Randomization</div>
                            <div className="w-full h-1 bg-[#30363d] rounded"><div className="h-full w-1/3 bg-[#58a6ff] rounded"></div></div>
                         </div>
                       </div>
                     </div>
                     <div className="border border-[#30363d] rounded p-3 bg-[#0d1117]">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-[#c9d1d9]">Footstep_Sprint</span>
                         <span className="text-[10px] px-2 py-1 bg-[#30363d] rounded text-[#8b949e]">MetaSound Patch</span>
                       </div>
                       <div className="flex gap-2">
                         <div className="h-8 w-24 bg-[#238636]/20 border border-[#238636]/50 rounded flex items-center justify-center">
                           <Volume2 size={14} className="text-[#2ea043]"/>
                         </div>
                         <div className="flex-1 flex flex-col justify-center">
                            <div className="text-[10px] text-[#8b949e] mb-1">Gain / Velocity Curve</div>
                            <div className="w-full h-1 bg-[#30363d] rounded"><div className="h-full w-2/3 bg-[#f85149] rounded"></div></div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
