import React, { useState } from 'react';
import { Camera, Video, Play, Pause, SkipBack, SkipForward, Aperture, Layers, Scissors, Plus, Clock, Move, Eye} from 'lucide-react';

export default function MapCinematicEditor() {
  return (
    <div className="absolute inset-x-0 inset-y-0 z-30 pointer-events-auto bg-[#0a0a0f] flex flex-col">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-[#2a2b3d] bg-[#11111b] flex items-center justify-between px-4">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[#e3b341]">
               <Video size={18} />
               <h1 className="text-sm font-bold">Cinematic Timeline Editor</h1>
            </div>
            <div className="h-6 w-[1px] bg-[#2a2b3d]"></div>
            <div className="flex bg-[#0a0a0f] rounded border border-[#2a2b3d]">
               <button className="px-3 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2a2b3d] rounded-l transition-colors"><SkipBack size={14}/></button>
               <button className="px-4 py-1 text-xs text-white bg-[#e3b341]/20 hover:bg-[#e3b341]/30 border-l border-r border-[#2a2b3d] transition-colors"><Play size={14} className="text-[#e3b341]" /></button>
               <button className="px-3 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2a2b3d] rounded-r transition-colors"><SkipForward size={14}/></button>
            </div>
            <span className="text-xs font-mono text-white bg-[#0a0a0f] px-2 py-1 rounded border border-[#2a2b3d]">00:04:23:15</span>
         </div>
         
         <div className="flex gap-2">
            <button className="bg-[#1a1a24] text-white border border-[#2a2b3d] px-3 py-1.5 rounded text-xs hover:bg-[#2a2b3d] flex items-center gap-2">
               <Eye size={14} /> Camera View
            </button>
            <button className="bg-[#e3b341] text-[#0a0a0f] px-4 py-1.5 rounded text-xs font-bold hover:bg-[#e3b341]/80">
               Compile Cutscene
            </button>
         </div>
      </div>

      {/* Middle Viewport (Placeholder for 3D View) */}
      <div className="flex-1 relative bg-[#0a0a0f] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#e3b341 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="text-center z-10">
              <Aperture size={48} className="text-[#e3b341]/20 mx-auto mb-4" />
              <p className="text-sm font-mono text-gray-500">Cinematic Viewport</p>
              <div className="mt-4 border border-[#e3b341]/30 bg-[#11111b]/80 p-2 rounded text-xs text-[#e3b341] font-mono inline-block">
                 Camera 01: 35mm Lens | DOF: 2.8 | FOV: 60
              </div>
          </div>
          
          {/* Rule of thirds grid */}
          <div className="absolute inset-0 pointer-events-none opacity-20 border-2 border-white">
             <div className="absolute top-1/3 left-0 right-0 border-t border-white border-dashed"></div>
             <div className="absolute top-2/3 left-0 right-0 border-t border-white border-dashed"></div>
             <div className="absolute left-1/3 top-0 bottom-0 border-l border-white border-dashed"></div>
             <div className="absolute left-2/3 top-0 bottom-0 border-l border-white border-dashed"></div>
          </div>
      </div>

      {/* Bottom Timeline */}
      <div className="h-[300px] border-t border-[#2a2b3d] bg-[#11111b] flex flex-col">
         {/* Timeline Header */}
         <div className="h-8 border-b border-[#2a2b3d] bg-[#1a1a24] flex">
            <div className="w-[200px] border-r border-[#2a2b3d] flex items-center px-3 justify-between">
               <span className="text-[10px] font-bold text-gray-400 uppercase">Tracks</span>
               <button className="text-gray-400 hover:text-white"><Plus size={12}/></button>
            </div>
            <div className="flex-1 relative">
               {/* Time markers */}
               <div className="absolute inset-0 flex items-end">
                  {[...Array(20)].map((_, i) => (
                     <div key={i} className="flex-1 border-l border-[#2a2b3d] h-2 relative">
                        <span className="absolute -top-4 -left-2 text-[8px] text-gray-500 font-mono">{i}s</span>
                     </div>
                  ))}
               </div>
               {/* Playhead */}
               <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-[#e3b341] z-20">
                  <div className="absolute -top-0 -left-1.5 w-3 h-3 bg-[#e3b341] rounded-sm transform rotate-45"></div>
               </div>
            </div>
         </div>

         {/* Tracks */}
         <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            {/* Track 1: Director Camera */}
            <div className="flex h-12 border-b border-[#2a2b3d] group">
               <div className="w-[200px] border-r border-[#2a2b3d] bg-[#11111b] flex items-center px-3 gap-2 group-hover:bg-[#1a1a24] transition-colors">
                  <Camera size={14} className="text-[#e3b341]" />
                  <span className="text-xs text-white">Master Camera</span>
               </div>
               <div className="flex-1 relative bg-[#0a0a0f] p-1">
                  <div className="absolute left-0 top-1 bottom-1 w-[40%] bg-[#e3b341]/20 border border-[#e3b341]/50 rounded flex items-center px-2 cursor-pointer">
                     <span className="text-[10px] text-[#e3b341]">Cam_Shot_01 (Dolly In)</span>
                  </div>
                  <div className="absolute left-[40%] top-1 bottom-1 w-[30%] bg-[#e3b341]/20 border border-[#e3b341]/50 rounded flex items-center px-2 cursor-pointer">
                     <span className="text-[10px] text-[#e3b341]">Cam_Shot_02 (Pan Right)</span>
                  </div>
               </div>
            </div>

            {/* Track 2: Actors */}
            <div className="flex h-12 border-b border-[#2a2b3d] group">
               <div className="w-[200px] border-r border-[#2a2b3d] bg-[#11111b] flex items-center px-3 gap-2 group-hover:bg-[#1a1a24] transition-colors">
                  <Move size={14} className="text-[#3fb950]" />
                  <span className="text-xs text-white">Actor: Aldous</span>
               </div>
               <div className="flex-1 relative bg-[#0a0a0f] p-1">
                  <div className="absolute left-[10%] top-1 bottom-1 w-[50%] bg-[#3fb950]/20 border border-[#3fb950]/50 rounded flex items-center px-2 cursor-pointer">
                     <span className="text-[10px] text-[#3fb950]">Walk to Waypoint B</span>
                     {/* Keyframes */}
                     <div className="absolute top-1/2 -translate-y-1/2 left-2 w-1.5 h-1.5 bg-white transform rotate-45"></div>
                     <div className="absolute top-1/2 -translate-y-1/2 right-2 w-1.5 h-1.5 bg-white transform rotate-45"></div>
                  </div>
               </div>
            </div>

            {/* Track 3: Dialogue/Audio */}
            <div className="flex h-12 border-b border-[#2a2b3d] group">
               <div className="w-[200px] border-r border-[#2a2b3d] bg-[#11111b] flex items-center px-3 gap-2 group-hover:bg-[#1a1a24] transition-colors">
                  <Video size={14} className="text-[#bc8cff]" />
                  <span className="text-xs text-white">Dialogue Subtitles</span>
               </div>
               <div className="flex-1 relative bg-[#0a0a0f] p-1">
                  <div className="absolute left-[20%] top-1 bottom-1 w-[25%] bg-[#bc8cff]/20 border border-[#bc8cff]/50 rounded flex items-center px-2 cursor-pointer">
                     <span className="text-[10px] text-[#bc8cff] truncate">"We cannot hold them!"</span>
                  </div>
               </div>
            </div>
            
            {/* Track 4: Events */}
            <div className="flex h-12 border-b border-[#2a2b3d] group">
               <div className="w-[200px] border-r border-[#2a2b3d] bg-[#11111b] flex items-center px-3 gap-2 group-hover:bg-[#1a1a24] transition-colors">
                  <Layers size={14} className="text-[#ff7b72]" />
                  <span className="text-xs text-white">FX / Events</span>
               </div>
               <div className="flex-1 relative bg-[#0a0a0f] p-1">
                  <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#ff7b72] transform rotate-45 shadow-[0_0_8px_#ff7b72]" title="Trigger Explosion FX"></div>
                  <div className="absolute left-[31%] top-1 bottom-1 w-[15%] bg-[#ff7b72]/20 border border-[#ff7b72]/50 rounded flex items-center px-2 cursor-pointer">
                     <span className="text-[10px] text-[#ff7b72] truncate">Screen Shake (Med)</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
