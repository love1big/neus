import React, { useState } from 'react';
import { Volume2, Radio, Waves, ActivitySquare, Settings, Play, Music, Mic2, Plus, Sliders} from 'lucide-react';

export default function MapAudioTools() {
  return (
    <div className="absolute inset-x-0 inset-y-0 z-30 pointer-events-auto bg-[#0a0a0f] flex">
      {/* Sidebar Controls */}
      <div className="w-[320px] border-r border-[#2a2b3d] bg-[#11111b] flex flex-col shadow-xl z-20 relative overflow-y-auto custom-scrollbar">
         <div className="p-4 border-b border-[#2a2b3d]">
            <h2 className="text-sm font-bold text-[#e3b341] flex items-center gap-2 mb-2">
               <Volume2 size={16} /> Massive Audio Engine
            </h2>
            <p className="text-[10px] text-gray-400 leading-tight">Create deep acoustic spaces, interactive music, and immersive soundscapes.</p>
         </div>

         <div className="p-4 flex flex-col gap-6">
            {/* Audio Zones / Reverb */}
            <div>
               <h3 className="text-xs font-bold text-white uppercase border-b border-[#2a2b3d] pb-2 mb-3 flex items-center gap-2"><Waves size={14} className="text-[#58a6ff]"/> Acoustic Volumes</h3>
               <button className="w-full bg-[#1a1a24] hover:bg-[#2a2b3d] border border-[#2a2b3d] hover:border-[#58a6ff]/50 py-2 rounded text-xs text-white transition-all flex justify-center items-center gap-2 mb-3">
                  <Plus size={14} /> Add Reverb Box Zone
               </button>
               <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-3 rounded space-y-3">
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-[#8b949e]">Preset</span>
                     <select className="bg-[#1a1a24] border border-[#2a2b3d] text-white rounded p-1">
                        <option>Cave / Large</option>
                        <option>Stone Hall</option>
                        <option>Small Room</option>
                        <option>Forest Outdoor</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-[10px] text-[#8b949e] flex justify-between"><span>Decay Time</span> <span className="text-white">2.4s</span></label>
                     <input type="range" min="0" max="100" defaultValue="40" className="w-full accent-[#58a6ff] h-1" />
                  </div>
                  <div>
                     <label className="text-[10px] text-[#8b949e] flex justify-between"><span>High Cut</span> <span className="text-white">4500 Hz</span></label>
                     <input type="range" min="0" max="100" defaultValue="70" className="w-full accent-[#58a6ff] h-1" />
                  </div>
               </div>
            </div>

            {/* Ambient Emitters */}
            <div>
               <h3 className="text-xs font-bold text-white uppercase border-b border-[#2a2b3d] pb-2 mb-3 flex items-center gap-2"><Radio size={14} className="text-[#3fb950]"/> 3D Emitters</h3>
               <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-3 rounded space-y-3">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-[#3fb950]/20 rounded flex items-center justify-center text-[#3fb950]"><Mic2 size={16}/></div>
                     <div className="flex-1">
                        <div className="text-xs text-white font-bold">Waterfall_Lg_01</div>
                        <div className="text-[10px] text-gray-400">Looping • Spatial 3D</div>
                     </div>
                  </div>
                  <div>
                     <label className="text-[10px] text-[#8b949e] flex justify-between"><span>Min Radius (100% Vol)</span> <span className="text-white">5m</span></label>
                     <input type="range" min="0" max="100" defaultValue="10" className="w-full accent-[#3fb950] h-1" />
                  </div>
                  <div>
                     <label className="text-[10px] text-[#8b949e] flex justify-between"><span>Max Radius (0% Vol)</span> <span className="text-white">40m</span></label>
                     <input type="range" min="0" max="100" defaultValue="60" className="w-full accent-[#3fb950] h-1" />
                  </div>
               </div>
            </div>

            {/* Dynamic Music */}
            <div>
               <h3 className="text-xs font-bold text-white uppercase border-b border-[#2a2b3d] pb-2 mb-3 flex items-center gap-2"><Music size={14} className="text-[#d2a8ff]"/> Dynamic Soundtrack</h3>
               <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-3 rounded space-y-2">
                  <div className="flex justify-between items-center bg-[#1a1a24] p-2 rounded border border-[#2a2b3d]">
                     <span className="text-[10px] text-white">Exploration State</span>
                     <span className="text-[9px] bg-[#2a2b3d] px-1.5 py-0.5 rounded text-gray-300">Track_Forest_Day</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#1a1a24] p-2 rounded border border-[#d2a8ff]/30">
                     <span className="text-[10px] text-white">Combat State</span>
                     <span className="text-[9px] bg-[#d2a8ff]/20 text-[#d2a8ff] px-1.5 py-0.5 rounded">Track_Battle_01</span>
                  </div>
                  <button className="text-[10px] text-[#d2a8ff] hover:underline flex items-center gap-1 mt-1"><Settings size={10}/> Configure Crossfade Rules</button>
               </div>
            </div>
         </div>
      </div>

      {/* Main Mixer & Map View */}
      <div className="flex-1 bg-[#0f111a] flex flex-col">
         {/* Top Info Bar */}
         <div className="h-12 border-b border-[#2a2b3d] bg-[#11111b] flex items-center px-4 justify-between">
            <div className="flex gap-4">
               <span className="text-[10px] font-mono text-[#8b949e] bg-[#0a0a0f] px-2 py-1 rounded border border-[#2a2b3d]">ACTIVE VOICES: 34 / 128</span>
               <span className="text-[10px] font-mono text-[#8b949e] bg-[#0a0a0f] px-2 py-1 rounded border border-[#2a2b3d]">CPU LOAD: 1.2%</span>
            </div>
            <button className="bg-[#e3b341]/10 text-[#e3b341] border border-[#e3b341]/30 px-3 py-1.5 rounded text-xs hover:bg-[#e3b341]/20 flex items-center gap-2 transition-colors">
               <ActivitySquare size={14} /> Open Master Mixer
            </button>
         </div>
         
         {/* Audio Visualizer Viewport */}
         <div className="flex-1 relative flex items-center justify-center p-8">
            <div className="w-full h-full max-w-5xl border border-[#2a2b3d] bg-[#11111b] rounded-xl relative overflow-hidden flex shadow-2xl">
                {/* Simulated 3D Map Area */}
                <div className="flex-1 relative bg-[#0a0a0f]">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#e3b341 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    
                    {/* Reverb Zone Representation */}
                    <div className="absolute top-[20%] left-[20%] w-[300px] h-[200px] border-2 border-[#58a6ff]/40 bg-[#58a6ff]/5 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] text-[#58a6ff] font-bold bg-[#11111b] px-2 py-1 rounded opacity-70">ZONE: CAVE VERB</span>
                    </div>

                    {/* Sound Emitter */}
                    <div className="absolute top-[30%] left-[40%]">
                        <div className="w-4 h-4 bg-[#3fb950] rounded-full relative z-10 shadow-[0_0_10px_#3fb950]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] border border-[#3fb950]/50 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-[#3fb950]/20 rounded-full"></div>
                    </div>
                </div>

                {/* Vertical Mixer Strip */}
                <div className="w-[120px] border-l border-[#2a2b3d] bg-[#11111b] flex flex-col p-2">
                   <h4 className="text-[9px] font-bold text-gray-400 text-center mb-4 mt-2">MASTER OUT</h4>
                   
                   <div className="flex-1 flex justify-center py-4">
                      {/* Fader */}
                      <div className="relative w-8 h-full bg-[#0a0a0f] border border-[#2a2b3d] rounded-full flex justify-center">
                         <div className="absolute bottom-0 w-full h-[75%] bg-gradient-to-t from-[#3fb950] via-[#e3b341] to-[#ff7b72] rounded-full opacity-20"></div>
                         <div className="absolute bottom-[75%] w-10 h-6 bg-[#2a2b3d] border border-gray-500 rounded translate-y-1/2 cursor-grab shadow-lg flex items-center justify-center">
                            <div className="w-6 h-[2px] bg-gray-400"></div>
                         </div>
                         
                         {/* VU Meter */}
                         <div className="absolute right-[-12px] bottom-0 w-1.5 h-full bg-[#0a0a0f] rounded-full overflow-hidden">
                            <div className="absolute bottom-0 w-full h-[60%] bg-[#3fb950]"></div>
                            <div className="absolute bottom-[60%] w-full h-[15%] bg-[#e3b341]"></div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="text-center mt-2">
                      <span className="text-white text-xs font-mono">-6.0 dB</span>
                   </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
