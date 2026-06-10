import React, { useState } from 'react';
import { Play, Square, Settings2, Sliders, Music, Radio, Volume2, Mic, Mic2, Pause, SkipBack, Share2, ZoomIn, Search, Move, Layers, Drum, Plus } from 'lucide-react';

export default function AudioMusicDSPStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="flex flex-col h-full bg-[#111] text-[#c9d1d9] font-sans">
      
      {/* Top Protocol Bar: DSP Studio */}
      <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-gradient-to-br from-[#e3b341] to-[#f85149] text-white">
            <Radio size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
              Audio DSP & Dynamic Music Studio
            </h2>
            <p className="text-[#8b949e] text-[9px] font-mono">FMOD / WWISE INTEGRATION • 3D SPATIAL AUDIO • PROCEDURAL GENERATION</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#0d1117] border border-[#30363d] rounded p-1 shadow-inner">
           <button className="text-[#8b949e] hover:text-[#c9d1d9] px-2"><SkipBack size={14}/></button>
           <button onClick={() => setIsPlaying(!isPlaying)} className={`px-3 py-1 rounded transition ${isPlaying ? 'bg-[#f85149] text-white shadow-[0_0_10px_rgba(248,81,73,0.3)]' : 'bg-[#3fb950] text-[#0d1117] shadow-[0_0_10px_rgba(63,185,80,0.3)]'}`}>
             {isPlaying ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor"/>}
           </button>
           <button className="text-[#8b949e] hover:text-[#c9d1d9] px-2"><Square size={14}/></button>
           
           <div className="w-[1px] h-4 bg-[#30363d] mx-2"></div>
           
           <div className="font-mono text-[11px] text-[#58a6ff]">02:14:59.00</div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Left Navigation / Asset Bank */}
         <div className="w-[260px] bg-[#0d1117] border-r border-[#30363d] flex flex-col shrink-0">
             <div className="p-3 border-b border-[#30363d] font-bold text-[11px] uppercase tracking-widest text-[#8b949e]">
                Audio Bank
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar text-[11px]">
                
                <div className="space-y-1">
                   <h3 className="text-[#c9d1d9] px-2 font-bold mb-1 border-l-2 border-[#58a6ff]">Sound Effects (SFX)</h3>
                   <div className="p-1.5 hover:bg-[#161b22] rounded flex items-center justify-between cursor-pointer group">
                      <span className="flex items-center gap-2"><Volume2 size={12} className="text-[#8b949e]"/> Weapon_Fire_01.wav</span>
                      <Play size={12} className="opacity-0 group-hover:opacity-100 text-[#3fb950]"/>
                   </div>
                   <div className="p-1.5 hover:bg-[#161b22] rounded flex items-center justify-between cursor-pointer group">
                      <span className="flex items-center gap-2"><Volume2 size={12} className="text-[#8b949e]"/> Footstep_Grass.wav</span>
                      <Play size={12} className="opacity-0 group-hover:opacity-100 text-[#3fb950]"/>
                   </div>
                </div>

                <div className="space-y-1">
                   <h3 className="text-[#c9d1d9] px-2 font-bold mb-1 border-l-2 border-[#bc8cff]">Dynamic Music Stems</h3>
                   <div className="p-1.5 hover:bg-[#161b22] rounded flex items-center justify-between cursor-pointer group">
                      <span className="flex items-center gap-2"><Music size={12} className="text-[#8b949e]"/> Combat_Drums_Loop.ogg</span>
                      <Play size={12} className="opacity-0 group-hover:opacity-100 text-[#3fb950]"/>
                   </div>
                   <div className="p-1.5 hover:bg-[#161b22] rounded flex items-center justify-between cursor-pointer group">
                      <span className="flex items-center gap-2"><Music size={12} className="text-[#8b949e]"/> Ambient_Strings_120BPM.ogg</span>
                      <Play size={12} className="opacity-0 group-hover:opacity-100 text-[#3fb950]"/>
                   </div>
                </div>

                <div className="space-y-1">
                   <h3 className="text-[#c9d1d9] px-2 font-bold mb-1 border-l-2 border-[#e3b341]">Voice Over (VO)</h3>
                   <div className="p-1.5 hover:bg-[#161b22] rounded flex items-center justify-between cursor-pointer group">
                      <span className="flex items-center gap-2"><Mic size={12} className="text-[#8b949e]"/> NPC_Gaurd_Alert.wav</span>
                      <Play size={12} className="opacity-0 group-hover:opacity-100 text-[#3fb950]"/>
                   </div>
                </div>

             </div>
         </div>

         {/* Center Timeline / DAW Area */}
         <div className="flex-1 flex flex-col bg-[#161b22] overflow-hidden relative">
            
            {/* Timeline Toolbar */}
            <div className="h-10 border-b border-[#30363d] bg-[#0d1117] flex items-center px-4 justify-between shrink-0">
               <div className="flex gap-2">
                  <button className="p-1.5 bg-[#21262d] rounded hover:text-white text-[#8b949e]"><Move size={14}/></button>
                  <button className="p-1.5 bg-[#21262d] rounded hover:text-white text-[#8b949e]"><ZoomIn size={14}/></button>
                  <button className="p-1.5 bg-[#21262d] rounded hover:text-white text-[#8b949e]"><Layers size={14}/></button>
               </div>
               <div className="flex gap-2">
                  <span className="text-[10px] bg-[#21262d] border border-[#30363d] px-2 py-1 rounded font-mono">Grid: 1/16</span>
                  <span className="text-[10px] bg-[#21262d] border border-[#30363d] px-2 py-1 rounded font-mono">BPM: 120</span>
               </div>
            </div>

            {/* DAW Track List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex">
                
                {/* Track Headers */}
                <div className="w-[200px] border-r border-[#30363d] bg-[#0d1117] shrink-0 sticky left-0 z-20">
                   {/* Track 1 */}
                   <div className="h-24 border-b border-[#30363d] p-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                         <span className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2"><Drum size={12} className="text-[#bc8cff]"/> Drums</span>
                         <div className="flex gap-1">
                            <button className="w-5 h-5 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] text-[9px] rounded font-bold">M</button>
                            <button className="w-5 h-5 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] text-[9px] rounded font-bold">S</button>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                         <Volume2 size={12} className="text-[#8b949e]"/>
                         <input type="range" className="w-full accent-[#58a6ff] bg-black h-1" />
                      </div>
                   </div>
                   {/* Track 2 */}
                   <div className="h-24 border-b border-[#30363d] p-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                         <span className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2"><Music size={12} className="text-[#3fb950]"/> Strings</span>
                         <div className="flex gap-1">
                            <button className="w-5 h-5 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] text-[9px] rounded font-bold">M</button>
                            <button className="w-5 h-5 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] text-[9px] rounded font-bold">S</button>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                         <Volume2 size={12} className="text-[#8b949e]"/>
                         <input type="range" className="w-full accent-[#58a6ff] bg-black h-1" />
                      </div>
                   </div>
                   {/* Track 3 */}
                   <div className="h-24 border-b border-[#30363d] p-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                         <span className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2"><Volume2 size={12} className="text-[#e3b341]"/> SFX_Env</span>
                         <div className="flex gap-1">
                            <button className="w-5 h-5 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] text-[9px] rounded font-bold">M</button>
                            <button className="w-5 h-5 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] text-[9px] rounded font-bold">S</button>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                         <Volume2 size={12} className="text-[#8b949e]"/>
                         <input type="range" className="w-full accent-[#58a6ff] bg-black h-1" />
                      </div>
                   </div>

                   <button className="w-full py-2 text-[10px] text-[#8b949e] hover:text-white uppercase tracking-widest font-bold border-b border-dashed border-[#30363d]">+ Add Track</button>
                </div>

                {/* Timeline Grid */}
                <div className="w-[1200px] bg-[#161b22] relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(90deg, #21262d 1px, transparent 1px)', backgroundSize: '100px 100%' }}>
                   
                   {/* Playhead */}
                   <div className="absolute top-0 bottom-0 left-[350px] w-[1px] bg-[#f85149] z-20 shadow-[0_0_10px_#f85149]">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#f85149] rotate-45 origin-bottom"></div>
                   </div>

                   {/* Track 1 Regions */}
                   <div className="h-24 border-b border-[#30363d] relative">
                      <div className="absolute top-2 left-[10px] w-[280px] h-[70px] bg-[#bc8cff]/20 border border-[#bc8cff]/50 rounded overflow-hidden p-1">
                         <span className="text-[9px] text-white bg-black/50 px-1 rounded font-bold absolute top-1 left-1">Combat_Drums_Loop</span>
                         {/* Fake Waveform */}
                         <div className="absolute inset-x-0 bottom-2 h-[40px] flex items-end gap-[1px] px-1 opacity-50">
                            {[...Array(50)].map((_, i) => (
                               <div key={i} className="flex-1 bg-[#bc8cff]" style={{ height: `${Math.random() * 100}%` }}></div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Track 2 Regions */}
                   <div className="h-24 border-b border-[#30363d] relative">
                      <div className="absolute top-2 left-[200px] w-[400px] h-[70px] bg-[#3fb950]/20 border border-[#3fb950]/50 rounded overflow-hidden p-1">
                         <span className="text-[9px] text-white bg-black/50 px-1 rounded font-bold absolute top-1 left-1">Ambient_Strings_120BPM</span>
                         {/* Fake Waveform */}
                         <div className="absolute inset-x-0 bottom-2 h-[40px] flex items-end gap-[1px] px-1 opacity-50">
                            {[...Array(80)].map((_, i) => (
                               <div key={i} className="flex-1 bg-[#3fb950]" style={{ height: `${Math.random() * 100}%` }}></div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Track 3 Regions */}
                   <div className="h-24 border-b border-[#30363d] relative">
                      <div className="absolute top-4 left-[350px] w-[40px] h-[30px] bg-[#e3b341]/20 border border-[#e3b341]/50 rounded overflow-hidden p-1">
                         <span className="text-[8px] text-white font-bold opacity-0 hover:opacity-100 absolute bg-black/80 px-1 truncate w-full">Impact</span>
                      </div>
                   </div>

                </div>

            </div>
         </div>

         {/* Right Inspector */}
         <div className="w-[300px] bg-[#0d1117] border-l border-[#30363d] flex flex-col shrink-0">
             <div className="p-4 border-b border-[#30363d] bg-[#161b22]">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2"><Settings2 size={16} className="text-[#bc8cff]"/> DSP Node Settings</h3>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-[11px]">
                
                <div className="space-y-4">
                   <h4 className="text-[10px] uppercase font-bold text-[#8b949e]">Audio Reverb Zone (Master)</h4>
                   
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-[#c9d1d9]"><span>Room Size</span><span className="font-mono text-[#58a6ff]">Large Hall</span></div>
                      <select className="w-full bg-[#161b22] border border-[#30363d] p-2 rounded outline-none text-white">
                         <option>Small Room</option>
                         <option>Cave</option>
                         <option selected>Large Hall</option>
                         <option>Custom (DSP)</option>
                      </select>
                   </div>
                   
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-[#c9d1d9]"><span>Wet / Dry Mix</span><span className="font-mono text-[#58a6ff]">45%</span></div>
                      <input type="range" className="w-full accent-[#bc8cff]" min="0" max="100" defaultValue="45" />
                   </div>
                   
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-[#c9d1d9]"><span>Decay Time (s)</span><span className="font-mono text-[#58a6ff]">2.4</span></div>
                      <input type="range" className="w-full accent-[#bc8cff]" min="0.1" max="10" step="0.1" defaultValue="2.4" />
                   </div>
                </div>

                <div className="pt-6 border-t border-[#30363d] space-y-4">
                   <h4 className="text-[10px] uppercase font-bold text-[#e3b341]">Dynamic Music Transition Logic</h4>
                   <div className="bg-[#161b22] border border-[#30363d] p-3 rounded space-y-2">
                      <label className="flex items-center gap-2 text-white"><input type="checkbox" defaultChecked className="accent-[#e3b341]" /> Sync to Bar / Beat</label>
                      <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" className="accent-[#e3b341]" /> Crossfade Duration (ms) <span className="bg-[#0d1117] px-2 py-0.5 rounded ml-auto border border-[#30363d] text-white">500</span></label>
                   </div>
                </div>
                
                <button className="w-full bg-[#3fb950] text-[#0d1117] py-2 rounded text-[11px] font-bold shadow-lg shadow-[#3fb950]/20 hover:bg-[#2ea043] transition mt-8 uppercase tracking-widest flex justify-center items-center gap-2">
                   <Share2 size={14}/> Compile SoundBank
                </button>

             </div>
         </div>
      </div>

    </div>
  );
}
