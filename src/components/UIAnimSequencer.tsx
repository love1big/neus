import React from 'react';
import { Film, Play, SkipBack, Maximize, MousePointer2 } from 'lucide-react';

export default function UIAnimSequencer() {
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#d29922]/20 border border-[#d29922]/50 rounded">
            <Film className="text-[#d29922]" size={16} />
          </div>
          <div>
            <h1 className="font-bold text-sm">UI Animation Timeline Sequencer</h1>
            <p className="text-[10px] text-[#8b949e]">Keyframe Animation for HUD Elements</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-[#010409]">
        <div className="text-center">
           <Film size={48} className="text-[#d29922] mx-auto mb-4" />
           <h2 className="text-xl font-bold mb-2">Animation Sequencer Active</h2>
           <p className="text-[#8b949e] text-sm">Integrated with Vector UI Designer.</p>
        </div>
      </div>
    </div>
  )
}
