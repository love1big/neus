import React, { useState } from 'react';
import { Volume2, Play, Pause, Disc, Waves, Settings, Maximize, Mic2, FileAudio, Sliders } from 'lucide-react';

export default function SpatialAudioMixer() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-700 p-1.5 rounded-lg shadow-lg">
            <Volume2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Spatial <span className="text-indigo-400">Audio Mixer</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">3D Sound & Reverb Zones</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-gray-300 px-3 py-1.5 rounded text-xs font-bold transition-colors">
             <Sliders size={14} /> MIXER SETTINGS
           </button>
           <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-[0_0_10px_rgba(99,102,241,0.4)]">
             <Play size={14} /> PLAY PREVIEW
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Tracks */}
        <div className="w-80 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <div className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Disc size={14}/> Audio Buses</div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
             {[
               { name: "Master", vol: 90, peak: -3 },
               { name: "SFX (Spatial)", vol: 75, peak: -12 },
               { name: "Ambience", vol: 60, peak: -24 },
               { name: "Dialogue", vol: 85, peak: -6 },
               { name: "Music", vol: 70, peak: -15 },
             ].map((bus, i) => (
               <div key={i} className="bg-[#1a1a1c] border border-[#3e3e42] p-2 rounded flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold ${i === 0 ? 'text-indigo-400' : 'text-gray-300'}`}>{bus.name}</span>
                    <span className="text-[9px] font-mono text-gray-500">{bus.peak}dB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-5 h-5 bg-[#333] rounded text-[9px] font-bold text-gray-400 hover:text-white flex items-center justify-center">M</button>
                    <button className="w-5 h-5 bg-[#333] rounded text-[9px] font-bold text-gray-400 hover:text-white flex items-center justify-center">S</button>
                    <input type="range" className="flex-1 h-1 bg-[#3e3e42] rounded-lg appearance-none accent-indigo-500" defaultValue={bus.vol} />
                  </div>
                  <div className="h-1.5 bg-[#000] rounded-full overflow-hidden flex">
                    <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" style={{ width: `${bus.vol}%` }}></div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Center: 3D Stage Viewer */}
        <div className="flex-1 bg-[#121212] relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 z-0 flex items-center justify-center">
             {/* Simple visual mock of a spatial stage */}
             <div className="relative w-64 h-64 border-2 border-indigo-900/30 rounded-full flex items-center justify-center">
               <div className="w-48 h-48 border border-indigo-900/20 rounded-full flex items-center justify-center">
                 <div className="w-32 h-32 border border-indigo-900/10 rounded-full flex items-center justify-center">
                   {/* Listener */}
                   <div className="w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
                 </div>
               </div>
               
               {/* Emitters */}
               <div className="absolute top-10 left-10 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                 <div className="absolute top-4 left-0 text-[9px] text-red-400 font-bold whitespace-nowrap">Explosion_Cue</div>
               </div>
               
               <div className="absolute bottom-10 right-20 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]">
                 <div className="absolute top-4 left-0 text-[9px] text-blue-400 font-bold whitespace-nowrap">River_Ambience</div>
               </div>
             </div>
          </div>
        </div>

        {/* Right: Properties */}
        <div className="w-64 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Node Settings</h3>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Attenuation (Falloff)</h4>
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Algorithm</span>
                    <select className="bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-gray-200 outline-none w-24">
                      <option>Logarithmic</option>
                      <option>Linear</option>
                      <option>Inverse</option>
                    </select>
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-gray-400"><span>Inner Radius</span><span>150 uu</span></div>
                    <input type="range" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-400"><span>Max Radius</span><span>4000 uu</span></div>
                    <input type="range" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">HRTF Spatialization</h4>
                <div className="space-y-2 text-[10px]">
                  <label className="flex items-center gap-2 text-gray-300">
                    <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-indigo-500 focus:ring-0" /> Enable Binaural Processing
                  </label>
                  <label className="flex items-center gap-2 text-gray-300">
                    <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-indigo-500 focus:ring-0" /> Lowpass Filter on Distance
                  </label>
                </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
