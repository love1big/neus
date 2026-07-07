import React, { useState } from 'react';
import { Clock, Play, Pause, SkipBack, SkipForward, Plus, Settings, Video, Music, Type, Layers, Maximize2, MousePointer2, Scissors, Copy, Move } from 'lucide-react';

export default function AdvancedTimelineEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      {/* Top Header & Transport */}
      <div className="h-14 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#58a6ff]">
            <Clock size={18} />
            <span className="font-bold text-sm">Advanced Timeline</span>
          </div>
          <div className="h-6 w-px bg-[#2a2b3d]"></div>
          <div className="flex items-center gap-2 bg-[#0a0a0f] p-1 rounded border border-[#2a2b3d]">
            <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white"><MousePointer2 size={14} /></button>
            <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white"><Scissors size={14} /></button>
            <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white"><Copy size={14} /></button>
            <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white"><Move size={14} /></button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-mono text-xl font-bold text-[#58a6ff] tracking-wider">
            00:00:{(currentTime / 10).toFixed(2).padStart(5, '0')}
          </span>
          <div className="flex items-center gap-2 bg-[#0a0a0f] p-1 rounded border border-[#2a2b3d]">
            <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400"><SkipBack size={16} /></button>
            <button className="p-1.5 bg-[#238636] hover:bg-[#2ea043] rounded text-white" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400"><SkipForward size={16} /></button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#2a2b3d] hover:bg-[#30363d] rounded text-xs font-medium border border-[#30363d]">Export</button>
          <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400"><Settings size={16} /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Preview Area & Inspector */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-black relative flex items-center justify-center border-b border-[#2a2b3d]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
            <div className="z-10 text-center">
              <Maximize2 size={32} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Preview Canvas</p>
            </div>
            
            {/* Safe Zones */}
            <div className="absolute inset-8 border border-white/10 pointer-events-none"></div>
            <div className="absolute inset-16 border border-white/5 pointer-events-none"></div>
          </div>
        </div>

        {/* Inspector Sidebar */}
        <div className="w-80 border-l border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#2a2b3d] bg-[#1a1b26] font-medium text-sm text-gray-300">
            Inspector
          </div>
          <div className="p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-3 flex flex-col gap-3">
               <h3 className="text-xs font-bold text-gray-400 uppercase">Transform</h3>
               <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col gap-1"><span className="text-gray-500">Position X</span><input type="text" className="bg-[#141525] border border-[#2a2b3d] rounded p-1 text-white" value="0.0" readOnly/></div>
                  <div className="flex flex-col gap-1"><span className="text-gray-500">Position Y</span><input type="text" className="bg-[#141525] border border-[#2a2b3d] rounded p-1 text-white" value="10.5" readOnly/></div>
                  <div className="flex flex-col gap-1"><span className="text-gray-500">Scale X</span><input type="text" className="bg-[#141525] border border-[#2a2b3d] rounded p-1 text-white" value="1.0" readOnly/></div>
                  <div className="flex flex-col gap-1"><span className="text-gray-500">Scale Y</span><input type="text" className="bg-[#141525] border border-[#2a2b3d] rounded p-1 text-white" value="1.0" readOnly/></div>
               </div>
            </div>
            <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-3 flex flex-col gap-3">
               <h3 className="text-xs font-bold text-gray-400 uppercase">Effects</h3>
               <button className="w-full py-1.5 bg-[#2a2b3d] hover:bg-[#30363d] rounded text-xs border border-[#30363d] flex justify-center items-center gap-2"><Plus size={12}/> Add Effect</button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Panel */}
      <div className="h-72 flex flex-col bg-[#141525] shrink-0 border-t border-[#2a2b3d]">
        {/* Timeline Header (Time Ruler) */}
        <div className="h-8 border-b border-[#2a2b3d] flex bg-[#1a1b26]">
          <div className="w-64 border-r border-[#2a2b3d] p-2 flex items-center justify-between shrink-0">
             <span className="text-xs font-medium text-gray-400">Tracks</span>
             <div className="flex gap-1">
                <button className="text-gray-500 hover:text-white"><Plus size={14}/></button>
                <button className="text-gray-500 hover:text-white"><Layers size={14}/></button>
             </div>
          </div>
          <div className="flex-1 relative overflow-hidden">
             {/* Ruler Ticks */}
             <div className="absolute inset-0 flex items-end opacity-30 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 99px, #fff 99px, #fff 100px)'}}>
                {[...Array(20)].map((_, i) => (
                   <span key={i} className="absolute text-[9px] font-mono mb-1 ml-1" style={{left: `${i * 100}px`}}>00:0{i}</span>
                ))}
             </div>
             {/* Playhead */}
             <div className="absolute top-0 bottom-0 w-px bg-red-500 z-20" style={{ left: '250px' }}>
                <div className="w-3 h-3 bg-red-500 -ml-1.5 transform rotate-45 -mt-1.5"></div>
             </div>
          </div>
        </div>

        {/* Tracks Area */}
        <div className="flex-1 flex overflow-y-auto">
          <div className="flex flex-col min-w-full">
            {/* Track 1 */}
            <div className="flex h-16 border-b border-[#2a2b3d]/50 bg-[#0a0a0f]/50">
               <div className="w-64 border-r border-[#2a2b3d] p-2 flex flex-col justify-center shrink-0 bg-[#141525]">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                     <Video size={14} className="text-blue-400"/> V1 - Main Camera
                  </div>
               </div>
               <div className="flex-1 relative">
                  <div className="absolute top-2 bottom-2 left-10 w-96 bg-blue-600/30 border border-blue-500/50 rounded flex items-center px-2 text-[10px] text-blue-200 overflow-hidden">
                     Hero_Shot_01.mp4
                  </div>
               </div>
            </div>
            {/* Track 2 */}
            <div className="flex h-16 border-b border-[#2a2b3d]/50 bg-[#0a0a0f]/50">
               <div className="w-64 border-r border-[#2a2b3d] p-2 flex flex-col justify-center shrink-0 bg-[#141525]">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                     <Type size={14} className="text-yellow-400"/> T1 - Subtitles
                  </div>
               </div>
               <div className="flex-1 relative">
                  <div className="absolute top-2 bottom-2 left-64 w-48 bg-yellow-600/30 border border-yellow-500/50 rounded flex items-center px-2 text-[10px] text-yellow-200 overflow-hidden">
                     Subtitle Block
                  </div>
               </div>
            </div>
            {/* Track 3 */}
            <div className="flex h-16 border-b border-[#2a2b3d]/50 bg-[#0a0a0f]/50">
               <div className="w-64 border-r border-[#2a2b3d] p-2 flex flex-col justify-center shrink-0 bg-[#141525]">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                     <Music size={14} className="text-green-400"/> A1 - BGM
                  </div>
               </div>
               <div className="flex-1 relative">
                  <div className="absolute top-2 bottom-2 left-0 w-[800px] bg-green-600/30 border border-green-500/50 rounded flex items-center px-2 text-[10px] text-green-200 overflow-hidden">
                     Ambient_Theme.wav
                     <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
                        <path d="M0,15 Q5,5 10,15 T20,15 T30,15 T40,15 T50,15" stroke="white" fill="none" vectorEffect="non-scaling-stroke"/>
                     </svg>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
