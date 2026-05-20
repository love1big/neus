import React from 'react';
import { Clapperboard, Play, Pause, Square, SkipBack, SkipForward, Video, Film, Scissors, Layers, Eye } from 'lucide-react';

export default function CinematicSequencerEditor() {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#c9d1d9] font-sans">
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <Film className="text-[#58a6ff] mr-4 border border-[#58a6ff]/30 p-2 rounded-lg bg-[#58a6ff]/10" size={36} />
        <div>
          <h2 className="text-white text-[16px] font-bold tracking-tight">Timeline & Cinematic Sequencer</h2>
          <p className="text-[#8b949e] text-[11px]">Non-linear editor for cutscenes, trailers, and scripted events.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 bg-[#111] border-b border-[#30363d] p-2 flex justify-center items-center relative">
          <div className="absolute top-2 left-2 flex gap-2">
            <span className="bg-black/50 px-2 py-1 rounded text-white border border-white/20 text-[10px] uppercase font-bold flex items-center gap-1"><Video size={10}/> Shot_01_Intro_Cam</span>
          </div>
          {/* Fake Viewport inside the sequencer */}
          <div className="w-[60%] aspect-video bg-black rounded border border-[#333] shadow-2xl relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850715649-1d0106293cb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-30 grayscale filter mix-blend-screen"></div>
             <div className="text-[#333] text-4xl block font-bold relative z-10 font-mono">NO SIGNAL</div>
             <div className="absolute top-4 right-4 text-[#f85149] font-bold animate-pulse text-[12px] flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f85149]"></div> REC</div>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="h-12 bg-[#161b22] border-b border-[#30363d] shrink-0 flex items-center justify-between px-4">
           <div className="flex items-center gap-2">
             <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded"><SkipBack size={16}/></button>
             <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded"><Play size={16} fill="currentColor"/></button>
             <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded"><Pause size={16}/></button>
             <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded"><Square size={16} fill="currentColor"/></button>
             <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded"><SkipForward size={16}/></button>
           </div>
           <div className="font-mono text-[#58a6ff] text-[14px] bg-[#0d1117] px-3 py-1 rounded border border-[#30363d]">
             00:01:24:15
           </div>
           <div className="flex items-center gap-2">
             <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded" title="Split Clip"><Scissors size={14}/></button>
             <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded" title="Toggle Snapping"><Layers size={14}/></button>
           </div>
        </div>

        {/* Tracks Area */}
        <div className="h-64 bg-[#0d1117] shrink-0 flex overflow-hidden">
           {/* Track Headers */}
           <div className="w-48 bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
             <div className="h-8 border-b border-[#30363d] flex items-center px-2 text-[10px] text-[#8b949e]">Tracks</div>
             <div className="h-12 border-b border-[#30363d] flex items-center px-2 justify-between bg-[#0d1117]">
               <div className="flex items-center gap-2 text-[11px] text-white font-bold"><Video size={12} className="text-[#58a6ff]"/> Director Track</div>
               <Eye size={12} className="text-[#8b949e]"/>
             </div>
             <div className="h-12 border-b border-[#30363d] flex items-center px-2 justify-between">
               <div className="flex items-center gap-2 text-[11px] text-white"><Clapperboard size={12} className="text-[#f85149]"/> Camera Cuts</div>
               <Eye size={12} className="text-[#8b949e]"/>
             </div>
             <div className="h-12 border-b border-[#30363d] flex items-center px-2 justify-between bg-[#161b22]/50">
               <div className="flex items-center gap-2 text-[11px] text-white"><Layers size={12} className="text-[#3fb950]"/> Character_Hero_Anim</div>
               <Eye size={12} className="text-[#8b949e]"/>
             </div>
           </div>

           {/* Timeline Grid */}
           <div className="flex-1 bg-[#0a0a0a] relative overflow-x-auto">
             {/* Time Ruler */}
             <div className="h-8 border-b border-[#30363d] flex items-end px-2 opacity-50 relative pointer-events-none">
                <div className="w-full flex justify-between font-mono text-[9px] text-[#8b949e] pb-1">
                   <span>00:00</span><span>00:01</span><span>00:02</span><span>00:03</span><span>00:04</span><span>00:05</span>
                </div>
             </div>
             
             {/* Playhead */}
             <div className="absolute top-0 bottom-0 w-px bg-[#f85149] z-20" style={{ left: '30%' }}>
               <div className="absolute -top-1 -left-1.5 w-3 h-3 rotate-45 bg-[#f85149]"></div>
             </div>

             {/* Clips */}
             <div className="relative">
               {/* Director Track Clips */}
               <div className="h-12 border-b border-[#30363d]/30 relative">
                  <div className="absolute top-2 bottom-2 left-10 w-40 bg-[#58a6ff]/20 border border-[#58a6ff]/50 rounded text-[9px] text-[#58a6ff] font-bold px-2 py-1 truncate">Shot_01_Intro</div>
                  <div className="absolute top-2 bottom-2 left-[150px] w-64 bg-[#58a6ff]/20 border border-[#58a6ff]/50 rounded text-[9px] text-[#58a6ff] font-bold px-2 py-1 truncate">Shot_02_Action</div>
               </div>
               
               {/* Camera Cuts Clips */}
               <div className="h-12 border-b border-[#30363d]/30 relative">
                  <div className="absolute top-3 bottom-3 left-10 w-40 bg-[#f85149]/20 border border-[#f85149]/50 rounded text-[9px] text-white px-2 flex items-center">Cam_Dolly_01</div>
                  <div className="absolute top-3 bottom-3 left-[150px] w-32 bg-[#f85149]/20 border border-[#f85149]/50 rounded text-[9px] text-white px-2 flex items-center">Cam_Static_Wide</div>
               </div>

               {/* Anim Clips */}
               <div className="h-12 border-b border-[#30363d]/30 relative">
                  <div className="absolute top-3 bottom-3 left-12 w-64 bg-[#3fb950]/20 border border-[#3fb950]/50 rounded text-[9px] text-white px-2 flex items-center">Anim_Hero_WalkIn_01</div>
               </div>
             </div>

           </div>
        </div>
      </div>
    </div>
  );
}
