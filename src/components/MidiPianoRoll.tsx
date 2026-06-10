import React, { useState } from 'react';
import { Music, Play, Square, Scissors, MousePointer2, Move, Type, Settings2, SkipBack, SkipForward, ChevronDown, ListMusic, AudioLines, FileAudio, ZoomIn } from 'lucide-react';

export default function MidiPianoRoll() {
  const [zoom, setZoom] = useState(1);
  const keys = ['C', 'B', 'A#', 'A', 'G#', 'G', 'F#', 'F', 'E', 'D#', 'D', 'C#'];

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#ccc] font-sans">
      
      {/* Top Bar */}
      <div className="px-4 py-2 border-b border-[#333] bg-[#252525] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50">
             <Music size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
              MIDI Piano Roll editor
            </h2>
            <p className="text-[#888] text-[9px] font-mono">DYNAMIC OST COMPOSER ROUTING • VSTi INSTRUMENTS • VELOCITY EDITING</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-4 border border-[#444] bg-[#111] rounded px-3 py-1.5 shadow-lg">
           <button className="text-[#888] hover:text-white transition"><SkipBack size={16}/></button>
           <button className="text-[#3fb950] hover:text-[#2ea043] transition mx-2"><Play size={20} fill="currentColor"/></button>
           <button className="text-[#888] hover:text-white transition"><Square size={16}/></button>
           <button className="text-[#888] hover:text-white transition"><SkipForward size={16}/></button>
           
           <div className="w-[1px] h-4 bg-[#444] mx-2"></div>
           
           <div className="flex items-center gap-1 font-mono text-[12px]">
              <span className="text-[#e3b341]">120</span> <span className="text-[#888]">BPM</span>
           </div>
           
           <div className="w-[1px] h-4 bg-[#444] mx-2"></div>
           
           <div className="flex items-center gap-1 font-mono text-[12px] text-white">
              001:01:000
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Tools Menu */}
         <div className="w-[60px] bg-[#222] border-r border-[#333] flex flex-col items-center py-4 gap-3 shrink-0 relative z-10">
             <button className="w-10 h-10 rounded flex items-center justify-center bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30 shadow-lg" title="Select (Arrow)">
                <MousePointer2 size={18} />
             </button>
             <button className="w-10 h-10 rounded flex items-center justify-center text-[#888] hover:text-white hover:bg-[#333] transition" title="Draw Note (Pen)">
                <Type size={18} />
             </button>
             <button className="w-10 h-10 rounded flex items-center justify-center text-[#888] hover:text-white hover:bg-[#333] transition" title="Erase Note">
                <Square size={18} /> {/* Using Square as eraser placeholder */}
             </button>
             <button className="w-10 h-10 rounded flex items-center justify-center text-[#888] hover:text-white hover:bg-[#333] transition" title="Cut Note">
                <Scissors size={18} />
             </button>

             <div className="mt-auto flex flex-col gap-3">
                <button className="w-10 h-10 rounded flex items-center justify-center text-[#888] hover:text-white hover:bg-[#333] transition" title="Zoom">
                   <ZoomIn size={18} />
                </button>
             </div>
         </div>

         {/* Main Piano Canvas */}
         <div className="flex-1 flex flex-col min-w-0 bg-[#1a1a1a]">
            
            {/* Timeline Header */}
            <div className="h-8 bg-[#2a2a2a] border-b border-[#333] ml-[60px] relative overflow-hidden flex">
               <div className="w-[2000px] h-full absolute top-0 left-0 flex text-[10px] text-[#888] font-mono items-end pb-1 border-b border-[#444]">
                  {[...Array(20)].map((_, i) => (
                     <div key={i} className="flex-none w-[120px] relative h-full">
                        <span className="absolute bottom-1 left-1 text-white">{i + 1}</span>
                        <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-[#555]"></div>
                        <div className="absolute top-1/2 bottom-0 left-1/4 w-[1px] bg-[#444]"></div>
                        <div className="absolute top-1/2 bottom-0 left-1/2 w-[1px] bg-[#444]"></div>
                        <div className="absolute top-1/2 bottom-0 left-3/4 w-[1px] bg-[#444]"></div>
                     </div>
                  ))}
               </div>
               
               {/* Playhead */}
               <div className="absolute top-0 bottom-0 left-[240px] w-[1px] bg-[#e3b341] z-20">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#e3b341] rotate-45 transform origin-top"></div>
               </div>
            </div>

            {/* Note Canvas & Keyboard Wrapper */}
            <div className="flex-1 flex overflow-y-auto relative custom-scrollbar">
               
               {/* Left Keyboard UI */}
               <div className="w-[60px] bg-[#1a1a1a] flex flex-col border-r border-[#111] shrink-0 sticky left-0 z-10 font-bold uppercase shadow-lg shadow-black/50">
                  {[...Array(4)].map((_, octave) => (
                     keys.map((note, index) => {
                        const isBlack = note.includes('#');
                        return (
                           <div key={`${octave}-${index}`} className={`flex items-center justify-end px-2 text-[9px] h-6 border-b border-black select-none ${isBlack ? 'bg-black text-[#888]' : 'bg-white text-black'}`}>
                              {note === 'C' && <span className="font-mono">{note}{5 - octave}</span>}
                              {note !== 'C' && <span>{note}</span>}
                           </div>
                        );
                     })
                  ))}
               </div>

               {/* Note Grid */}
               <div className="w-[2000px] h-[1152px] relative bg-[#1a1a1a]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '100% 24px' }}>
                  
                  {/* Vertical Guidelines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)]" style={{ backgroundSize: '120px 100%' }}></div>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)]" style={{ backgroundSize: '30px 100%' }}></div>

                  {/* Simulated MIDI Notes (Hardcoded for preview) */}
                  <div className="absolute top-[288px] left-[120px] w-[60px] h-[22px] bg-[#58a6ff] rounded border border-white/50 opacity-90 shadow-md transform hover:brightness-110 cursor-pointer"></div>
                  <div className="absolute top-[336px] left-[180px] w-[60px] h-[22px] bg-[#58a6ff] rounded border border-white/50 opacity-90 shadow-md transform hover:brightness-110 cursor-pointer"></div>
                  <div className="absolute top-[240px] left-[240px] w-[60px] h-[22px] bg-[#58a6ff] rounded border border-white/50 opacity-90 shadow-md transform hover:brightness-110 cursor-pointer"></div>
                  
                  <div className="absolute top-[288px] left-[360px] w-[120px] h-[22px] bg-[#bc8cff] rounded border border-white/50 opacity-90 shadow-md transform hover:brightness-110 cursor-pointer"></div>
                  <div className="absolute top-[192px] left-[360px] w-[120px] h-[22px] bg-[#bc8cff] rounded border border-white/50 opacity-90 shadow-md transform hover:brightness-110 cursor-pointer"></div>

                  <div className="absolute top-[144px] left-[480px] w-[60px] h-[22px] bg-[#58a6ff] rounded border border-white/50 opacity-90 shadow-md transform hover:brightness-110 cursor-pointer"></div>
                  
                  {/* Playhead continue */}
                  <div className="absolute top-0 bottom-0 left-[240px] w-[1px] bg-[#e3b341] shadow-[0_0_5px_#e3b341]"></div>
               </div>

            </div>

            {/* Bottom Velocity Velocity Pane */}
            <div className="h-[150px] bg-[#222] border-t border-[#333] flex flex-col shrink-0">
               <div className="flex justify-between items-center px-4 py-1.5 bg-[#1a1a1a] border-b border-[#333]">
                  <span className="text-[10px] font-bold text-[#888] uppercase tracking-widest flex items-center gap-2"><AudioLines size={12}/> Velocity Control</span>
               </div>
               <div className="flex-1 relative flex">
                  <div className="w-[60px] border-r border-[#333] bg-[#1a1a1a] flex flex-col justify-between items-end p-2 text-[9px] font-mono text-[#666]">
                     <span>127</span>
                     <span>64</span>
                     <span>0</span>
                  </div>
                  <div className="flex-1 relative overflow-hidden" style={{ backgroundSize: '30px 100%', backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px)' }}>
                     {/* Velocity Bars Simulation */}
                     <div className="absolute bottom-0 left-[120px] w-1 h-[80%] bg-[#58a6ff]"></div>
                     <div className="absolute bottom-0 left-[130px] w-1 h-[80%] bg-[#58a6ff]"></div>
                     
                     <div className="absolute bottom-0 left-[180px] w-1 h-[90%] bg-[#58a6ff]"></div>
                     
                     <div className="absolute bottom-0 left-[240px] w-1 h-[100%] bg-[#e3b341] shadow-[0_0_5px_#e3b341]"></div>
                     
                     <div className="absolute bottom-0 left-[360px] w-1 h-[70%] bg-[#bc8cff]"></div>
                     <div className="absolute bottom-0 left-[360px] w-1 h-[70%] bg-[#bc8cff]"></div>
                     
                     <div className="absolute bottom-0 left-[480px] w-1 h-[85%] bg-[#58a6ff]"></div>
                  </div>
               </div>
            </div>

         </div>

         {/* Right VST Inspector */}
         <div className="w-[280px] bg-[#222] border-l border-[#333] flex flex-col shrink-0">
            <div className="p-4 border-b border-[#333] bg-[#2a2a2a]">
               <h3 className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2"><ListMusic size={14} className="text-[#3fb950]"/> Track Inspector</h3>
            </div>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                
                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-[#888]">Active Track</label>
                   <select className="w-full bg-[#1a1a1a] border border-[#444] text-white rounded p-1.5 text-[11px] outline-none">
                      <option>Lead Synth_01</option>
                      <option>Bassline_Massive</option>
                      <option>DrumKit_909</option>
                      <option>Ambient_Choir_Pad</option>
                   </select>
                </div>

                <div className="space-y-1 border-t border-[#333] pt-4">
                   <label className="text-[10px] font-bold uppercase text-[#888] flex items-center gap-1"><FileAudio size={12}/> VST Instrument Routing</label>
                   <button className="w-full bg-[#1a1a1a] border border-[#58a6ff] text-[#58a6ff] hover:bg-[#58a6ff] hover:text-black py-2 rounded text-[11px] font-bold transition flex items-center justify-between px-3">
                      Serum_x64.dll <ChevronDown size={14}/>
                   </button>
                </div>

                <div className="space-y-2 border-t border-[#333] pt-4">
                   <h4 className="text-[10px] font-bold uppercase text-[#e3b341]">MIDI Channel Assign</h4>
                   <div className="grid grid-cols-4 gap-1 text-[10px]">
                      {[1,2,3,4,5,6,7,8].map(ch => (
                         <button key={ch} className={`py-1 rounded border ${ch === 1 ? 'bg-[#e3b341] text-black font-bold border-[#e3b341]' : 'border-[#444] text-[#888] hover:bg-[#333]'}`}>
                            CH {ch}
                         </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#333]">
                   <h4 className="text-[10px] font-bold uppercase text-white flex items-center gap-1"><Settings2 size={12}/> Quantization Setup</h4>
                   <div className="flex items-center gap-2">
                       <select className="flex-1 bg-[#1a1a1a] border border-[#444] text-white rounded p-1 text-[11px]">
                          <option>1/16 Note</option>
                          <option>1/8 Note</option>
                          <option>1/4 Note</option>
                       </select>
                       <button className="bg-[#333] border border-[#444] hover:bg-[#444] text-white px-3 py-1 rounded text-[11px]">Apply</button>
                   </div>
                   <label className="flex items-center gap-2 text-[11px]"><input type="checkbox" className="accent-[#58a6ff]"/> Snap to Grid</label>
                </div>

            </div>
         </div>
      </div>
    </div>
  );
}
