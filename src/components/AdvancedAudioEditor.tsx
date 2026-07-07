import React from 'react';
import { Activity, Play, Pause, SkipBack, Volume2, Sliders, Mic, Square, Scissors } from 'lucide-react';

export default function AdvancedAudioEditor() {
  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-4 shrink-0">
         <div className="flex items-center gap-3">
            <Activity size={18} className="text-pink-500" />
            <span className="font-bold text-sm">Audio Engine DSP</span>
         </div>
         <div className="flex items-center gap-4 bg-[#0a0a0f] px-4 py-1.5 rounded-full border border-[#2a2b3d]">
            <button className="text-gray-400 hover:text-white"><SkipBack size={18}/></button>
            <button className="w-8 h-8 flex items-center justify-center bg-pink-600 hover:bg-pink-500 text-white rounded-full"><Play size={16} className="ml-1"/></button>
            <button className="text-gray-400 hover:text-red-500"><Square size={16}/></button>
            <button className="text-gray-400 hover:text-red-500 ml-4"><Mic size={18}/></button>
         </div>
         <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-pink-400 bg-pink-500/10 px-2 py-1 rounded">44.1 kHz</span>
            <span className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded">24-bit</span>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Main Waveform Area */}
         <div className="flex-1 flex flex-col bg-[#0a0a0f]">
            <div className="h-8 border-b border-[#2a2b3d] bg-[#1a1b26] flex items-end">
               <div className="w-full h-4 relative">
                  {[...Array(50)].map((_, i) => (
                     <div key={i} className="absolute bottom-0 w-px bg-gray-600" style={{ left: `${i * 2}%`, height: i%5===0 ? '10px' : '5px' }}></div>
                  ))}
               </div>
            </div>
            <div className="flex-1 relative overflow-y-auto flex flex-col gap-1 p-2">
               {/* Track 1 */}
               <div className="h-32 bg-[#141525] border border-[#2a2b3d] rounded flex overflow-hidden">
                  <div className="w-48 bg-[#1a1b26] border-r border-[#2a2b3d] p-3 flex flex-col justify-between shrink-0">
                     <div className="font-bold text-xs text-pink-400">Main_Vocal.wav</div>
                     <div className="flex items-center gap-2">
                        <button className="w-6 h-6 rounded bg-[#2a2b3d] text-[10px] font-bold hover:bg-[#30363d]">M</button>
                        <button className="w-6 h-6 rounded bg-[#2a2b3d] text-[10px] font-bold hover:bg-[#30363d]">S</button>
                        <Volume2 size={14} className="text-gray-500 ml-auto"/>
                     </div>
                  </div>
                  <div className="flex-1 relative bg-[#0d1117] flex items-center p-2">
                     {/* Fake Waveform using SVG */}
                     <svg className="w-full h-full text-pink-500" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,50 Q2,10 4,50 T8,50 T12,50 T16,20 T20,50 T24,80 T28,50 T32,50 T36,10 T40,50 T44,50 T48,90 T52,50 T56,50 T60,20 T64,50 T68,50 T72,10 T76,50 T80,50 T84,80 T88,50 T92,50 T96,20 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
                        <path d="M0,50 Q2,20 4,50 T8,50 T12,50 T16,30 T20,50 T24,70 T28,50 T32,50 T36,20 T40,50 T44,50 T48,80 T52,50 T56,50 T60,30 T64,50 T68,50 T72,20 T76,50 T80,50 T84,70 T88,50 T92,50 T96,30 T100,50" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5" vectorEffect="non-scaling-stroke"/>
                     </svg>
                     <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50 shadow-[0_0_5px_white]"></div>
                  </div>
               </div>
               
               {/* Track 2 */}
               <div className="h-32 bg-[#141525] border border-[#2a2b3d] rounded flex overflow-hidden">
                  <div className="w-48 bg-[#1a1b26] border-r border-[#2a2b3d] p-3 flex flex-col justify-between shrink-0">
                     <div className="font-bold text-xs text-blue-400">Synth_Pad.wav</div>
                     <div className="flex items-center gap-2">
                        <button className="w-6 h-6 rounded bg-[#2a2b3d] text-[10px] font-bold hover:bg-[#30363d]">M</button>
                        <button className="w-6 h-6 rounded bg-[#2a2b3d] text-[10px] font-bold hover:bg-[#30363d]">S</button>
                        <Volume2 size={14} className="text-gray-500 ml-auto"/>
                     </div>
                  </div>
                  <div className="flex-1 relative bg-[#0d1117] flex items-center p-2">
                     <svg className="w-full h-full text-blue-500 opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,50 Q5,40 10,50 T20,50 T30,50 T40,50 T50,50 T60,50 T70,50 T80,50 T90,50 T100,50" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
                     </svg>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Mixer / FX Panel */}
         <div className="w-80 border-l border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
            <div className="h-10 border-b border-[#2a2b3d] bg-[#1a1b26] flex items-center px-4 font-semibold text-sm text-gray-200 gap-2">
               <Sliders size={16} /> FX Chain
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
               {/* EQ Node */}
               <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded-lg overflow-hidden">
                  <div className="bg-[#1a1b26] border-b border-[#2a2b3d] px-3 py-2 flex justify-between items-center text-xs font-bold">
                     <span>Parametric EQ</span>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="p-3">
                     <div className="h-20 bg-[#141525] rounded border border-[#2a2b3d] relative mb-3 overflow-hidden">
                        {/* Fake EQ Curve */}
                        <svg className="w-full h-full" preserveAspectRatio="none">
                           <path d="M0,40 Q20,40 30,20 T50,40 T70,60 T100,40" fill="none" stroke="#58a6ff" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                        </svg>
                        <div className="absolute top-1/2 w-full h-px bg-white/10"></div>
                     </div>
                     <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                        <span>Low Cut: 80Hz</span>
                        <span>High Shelf: +2dB</span>
                     </div>
                  </div>
               </div>

               {/* Reverb Node */}
               <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded-lg overflow-hidden">
                  <div className="bg-[#1a1b26] border-b border-[#2a2b3d] px-3 py-2 flex justify-between items-center text-xs font-bold">
                     <span>Convolution Reverb</span>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="p-3 flex flex-col gap-3">
                     <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-gray-400"><span>Mix</span> <span>35%</span></div>
                        <input type="range" className="w-full accent-pink-500" defaultValue="35"/>
                     </div>
                     <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-gray-400"><span>Decay</span> <span>2.4s</span></div>
                        <input type="range" className="w-full accent-pink-500" defaultValue="60"/>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
