import React, { useState } from 'react';
import { Music, Play, Square, Circle, SkipBack, SkipForward, Volume2, Mic, Settings, SlidersHorizontal, Scissors, Copy, MousePointer2 } from 'lucide-react';

export default function AudioDAWStudio() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Top Header & Transport Controls */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#f85149]/20 border border-[#f85149]/50 rounded">
            <Music className="text-[#f85149]" size={18} />
          </div>
          <div>
            <h1 className="font-bold text-sm">Multi-Track DAW & Orchestrator</h1>
            <p className="text-[10px] text-[#8b949e]">Audio Engineering & MIDI Sequencing</p>
          </div>
        </div>

        {/* Transport */}
        <div className="flex items-center bg-[#010409] border border-[#30363d] rounded-lg px-4 py-1.5 gap-4">
           <div className="flex gap-2">
             <button className="text-[#8b949e] hover:text-white"><SkipBack size={18} /></button>
             <button className="text-white hover:text-[#58a6ff]" onClick={() => setIsPlaying(!isPlaying)}>
               {isPlaying ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
             </button>
             <button className="text-[#8b949e] hover:text-white"><SkipForward size={18} /></button>
             <div className="w-[1px] h-5 bg-[#30363d] mx-1"></div>
             <button className="text-[#f85149] hover:text-red-400"><Circle size={16} fill="currentColor" /></button>
           </div>
           
           <div className="flex flex-col items-center justify-center font-mono text-white bg-[#161b22] px-3 py-0.5 rounded border border-[#30363d]">
             <span className="text-sm">01:04:22:05</span>
             <span className="text-[9px] text-[#8b949e]">BAR 32 BEAT 1</span>
           </div>

           <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8b949e]">BPM</span>
              <input type="text" className="w-12 bg-[#161b22] border border-[#30363d] rounded px-1 text-center font-mono text-white" defaultValue="120" />
           </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
             Export Mixdown
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Track Headers */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col z-10 shrink-0">
           <div className="h-8 border-b border-[#30363d] bg-[#0d1117] flex items-center px-2">
             <div className="flex bg-[#161b22] rounded border border-[#30363d] p-0.5 gap-0.5">
               <button className="p-1 bg-[#30363d] text-white rounded"><MousePointer2 size={12}/></button>
               <button className="p-1 text-[#8b949e] hover:text-white"><Scissors size={12}/></button>
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto">
             <TrackHeader name="Cinematic Strings" type="midi" color="#58a6ff" active />
             <TrackHeader name="Heavy Brass" type="midi" color="#d29922" />
             <TrackHeader name="War Drums" type="audio" color="#3fb950" />
             <TrackHeader name="Dialogue (Hero)" type="audio" color="#a371f7" />
             <TrackHeader name="Ambient Wind" type="audio" color="#8b949e" />
           </div>
        </div>

        {/* Center: Timeline & Regions */}
        <div className="flex-1 bg-[#010409] flex flex-col overflow-hidden relative">
           
           {/* Timeline Ruler */}
           <div className="h-8 border-b border-[#30363d] bg-[#0d1117] flex items-end px-4 relative overflow-hidden shrink-0 font-mono text-[10px] text-[#8b949e]">
              <div className="absolute bottom-0 left-4 flex gap-16">
                 <div>| 1</div><div>| 5</div><div>| 9</div><div>| 13</div><div>| 17</div><div>| 21</div><div>| 25</div><div>| 29</div><div>| 33</div>
              </div>
              {/* Playhead Marker */}
              <div className="absolute bottom-0 left-[180px] w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
           </div>

           {/* Tracks Area */}
           <div className="flex-1 overflow-auto relative">
              {/* Playhead Line */}
              <div className="absolute top-0 bottom-0 left-[180px] w-[1px] bg-white z-20 pointer-events-none shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
              
              {/* Grid Background */}
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(90deg, #30363d 1px, transparent 1px)', backgroundSize: '64px 100%' }}></div>
              
              <div className="relative w-[2000px] flex flex-col">
                 <TrackLane>
                    <Region type="midi" color="#58a6ff" left={64} width={256} name="Strings Intro" />
                    <Region type="midi" color="#58a6ff" left={384} width={512} name="Main Theme Arp" />
                 </TrackLane>
                 <TrackLane>
                    <Region type="midi" color="#d29922" left={384} width={256} name="Brass Stabs" />
                 </TrackLane>
                 <TrackLane>
                    <Region type="audio" color="#3fb950" left={0} width={128} name="Timpani Fill" />
                    <Region type="audio" color="#3fb950" left={384} width={512} name="Epic Loop 01" />
                 </TrackLane>
                 <TrackLane>
                    <Region type="audio" color="#a371f7" left={200} width={100} name="Hero_Line_04.wav" />
                 </TrackLane>
                 <TrackLane>
                    <Region type="audio" color="#8b949e" left={0} width={1000} name="Wind_Howling_Loop" />
                 </TrackLane>
              </div>
           </div>

           {/* Bottom: Piano Roll / Audio Editor (Split View) */}
           <div className="h-64 border-t border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
              <div className="h-8 border-b border-[#30363d] bg-[#0d1117] flex items-center px-4 justify-between text-xs font-bold text-white">
                 <span>MIDI Editor: Cinematic Strings</span>
                 <div className="flex gap-2">
                   <span className="text-[#8b949e]">Velocity</span>
                   <span className="text-[#8b949e]">Quantize: 1/16</span>
                 </div>
              </div>
              <div className="flex-1 flex overflow-hidden bg-[#010409]">
                 {/* Piano Keys */}
                 <div className="w-16 border-r border-[#30363d] flex flex-col">
                    <PianoKey note="C4" type="white" />
                    <PianoKey note="B3" type="white" />
                    <PianoKey note="Bb3" type="black" />
                    <PianoKey note="A3" type="white" />
                    <PianoKey note="G#3" type="black" />
                    <PianoKey note="G3" type="white" />
                    <PianoKey note="F#3" type="black" />
                    <PianoKey note="F3" type="white" />
                 </div>
                 {/* MIDI Grid */}
                 <div className="flex-1 relative overflow-auto" style={{ backgroundImage: 'linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                    <div className="absolute top-[32px] left-[64px] h-7 w-24 bg-[#58a6ff] rounded border border-white opacity-80 shadow-md"></div>
                    <div className="absolute top-[64px] left-[160px] h-7 w-16 bg-[#58a6ff] rounded border border-white opacity-80 shadow-md"></div>
                    <div className="absolute top-[160px] left-[224px] h-7 w-32 bg-[#58a6ff] rounded border border-white opacity-80 shadow-md"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TrackHeader({ name, type, color, active = false }: { name: string, type: 'midi'|'audio', color: string, active?: boolean }) {
  return (
    <div className={`h-24 border-b border-[#30363d] flex flex-col p-2 transition-colors ${active ? 'bg-[#21262d]' : 'bg-[#161b22]'}`}>
       <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: color, color: color }}></div>
             <span className="text-xs font-bold text-white truncate max-w-[120px]">{name}</span>
          </div>
          <div className="flex gap-1">
             <button className="w-5 h-5 rounded bg-[#0d1117] border border-[#30363d] text-[10px] font-bold text-[#8b949e] hover:text-white hover:bg-yellow-600">S</button>
             <button className="w-5 h-5 rounded bg-[#0d1117] border border-[#30363d] text-[10px] font-bold text-[#8b949e] hover:text-white hover:bg-red-600">M</button>
             <button className="w-5 h-5 rounded bg-[#0d1117] border border-[#30363d] text-[10px] font-bold text-[#8b949e] hover:text-white hover:bg-red-500"><Circle size={10} className="mx-auto" /></button>
          </div>
       </div>
       <div className="mt-auto flex items-center gap-2 text-xs text-[#8b949e]">
          <Volume2 size={12} />
          <input type="range" className="flex-1 h-1 bg-[#0d1117] rounded outline-none" style={{ accentColor: color }} defaultValue="80" />
       </div>
    </div>
  );
}

function TrackLane({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-24 border-b border-[#30363d] relative flex items-center bg-[#010409]/50">
      {children}
    </div>
  );
}

function Region({ type, color, left, width, name }: { type: 'midi'|'audio', color: string, left: number, width: number, name: string }) {
  return (
    <div className="absolute h-20 top-2 rounded border border-white/20 shadow-md flex flex-col overflow-hidden group hover:border-white cursor-pointer" 
         style={{ left: `${left}px`, width: `${width}px`, backgroundColor: `${color}40` }}>
       <div className="h-4 bg-black/40 text-[9px] font-bold px-1 flex items-center text-white/80 truncate">
         {name}
       </div>
       <div className="flex-1 relative opacity-70 flex items-center justify-center p-1">
          {type === 'audio' ? (
             // Mock Audio Waveform
             <div className="w-full h-full flex items-center justify-between gap-[1px]">
               {Array.from({length: Math.floor(width/4)}).map((_, i) => (
                 <div key={i} className="w-[2px] bg-current rounded-full" style={{ height: `${Math.random() * 80 + 10}%`, color: color }}></div>
               ))}
             </div>
          ) : (
             // Mock MIDI Notes
             <div className="w-full h-full relative">
                {Array.from({length: Math.floor(width/16)}).map((_, i) => (
                  <div key={i} className="absolute h-1 bg-current rounded" style={{ left: `${i*16 + Math.random()*8}px`, top: `${Math.random()*80 + 10}%`, width: `${Math.random()*10 + 4}px`, color: color }}></div>
                ))}
             </div>
          )}
       </div>
    </div>
  );
}

function PianoKey({ note, type }: { note: string, type: 'white'|'black' }) {
  if (type === 'black') {
    return <div className="h-8 bg-black border-y border-black text-[9px] text-[#8b949e] flex items-center justify-end px-1 w-10 z-10 -my-4 relative self-start shadow-md">{note}</div>
  }
  return <div className="h-8 bg-[#f0f6fc] border-b border-[#d0d7de] text-[10px] font-bold text-[#1f2328] flex items-center justify-end px-2">{note}</div>
}
