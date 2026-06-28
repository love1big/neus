import React, { useState } from 'react';
import { Film, Play, Pause, SkipBack, SkipForward, Square, Camera, Volume2, UserSquare, Video, Settings2, ZoomIn, ZoomOut, Scissors, Plus, Mic, Settings, Maximize, Activity, Code, Music, Eye, Zap } from 'lucide-react';

export default function CinematicDirector() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#161b22] text-[#c9d1d9] font-sans text-xs overflow-hidden select-none">
      {/* Top Menu */}
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-3 py-1.5 shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#bc8cff] text-[#0d1117] rounded text-[10px] font-black uppercase tracking-widest shadow">
               <Film size={14} fill="currentColor"/> Master Sequencer
            </div>
            <div className="flex items-center text-[11px] font-bold gap-4 text-[#8b949e]">
               <span className="hover:text-white cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#bc8cff] pb-1">Cutscene_Opening</span>
               <span className="text-white cursor-pointer transition-colors border-b-2 border-[#bc8cff] pb-1">Battle_Intro_Boss</span>
               <span className="hover:text-white cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#bc8cff] pb-1">Ending_Credits</span>
            </div>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Main Viewport & Properties */}
         <div className="flex-1 flex flex-col min-w-[400px]">
             {/* Center Viewport Preview */}
             <div className="flex-1 bg-black relative flex flex-col items-center justify-center overflow-hidden border-b border-[#30363d]">
                 {/* Cinematic Letterbox effect */}
                 <div className="absolute top-0 w-full h-[10%] bg-black z-20 shadow-[0_5px_20px_rgba(0,0,0,0.8)] border-b border-white/5"></div>
                 <div className="absolute bottom-0 w-full h-[10%] bg-black z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.8)] border-t border-white/5 flex items-center justify-center">
                     {/* Fake Subtitle */}
                     <span className="text-white font-serif text-[16px] drop-shadow-[0_2px_2px_black] text-center max-w-2xl">
                         "So, you finally arrived at the core. Pity you're too late."
                     </span>
                 </div>
                 
                 {/* Fake 3D Scene */}
                 <div className="absolute inset-0 bg-[#0d1117] flex items-center justify-center overflow-hidden" style={{transform: isPlaying ? 'scale(1.05)' : 'scale(1)', transition: 'transform 10s linear'}}>
                    {/* Background Structure */}
                    <div className="w-[120%] h-[120%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMjBMNDAgMjBNMjAgMEwyMCA0MCIgc3Ryb2tlPSIjMjIyIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] opacity-50 absolute transform perspective-1000 rotateX-45 scale-150"></div>
                 
                    <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                       {/* Character Silhouette */}
                       <div className="absolute inset-0 flex items-end justify-center transform drop-shadow-[0_0_30px_rgba(188,140,255,0.4)]">
                          <svg width="150" height="250" viewBox="0 0 100 200">
                             <path d="M40,30 C40,15 60,15 60,30 C60,45 40,45 40,30 M30,50 L70,50 L85,110 L65,110 L60,70 L50,80 L60,200 L40,200 L50,80 L40,70 L35,110 L15,110 Z" fill="#fff" />
                          </svg>
                       </div>
                    </div>
                    {/* Fake Camera Lens Flares or depth of field overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                 </div>

                 {/* Top Overlays */}
                 <div className="absolute top-2 left-2 z-30 text-red-500 font-mono text-[10px] font-bold flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> REC (Camera_Shot_02)
                 </div>
                 <div className="absolute top-2 right-2 z-30 text-[#8b949e] font-mono text-[10px] flex flex-col items-end gap-1 bg-black/50 px-2 py-1 rounded">
                    <span>TIMECODE</span>
                    <span className="text-white text-[14px]">00:01:24:12</span>
                 </div>

                 {/* Safe Area guides */}
                 <div className="absolute inset-[5%] border border-[#ffffff1a] pointer-events-none z-10"></div>
                 <div className="absolute inset-[10%] border border-[#ffffff1a] pointer-events-none z-10"></div>
             </div>
             
             {/* Transport Controls */}
             <div className="h-12 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                   <button className="text-[#8b949e] hover:text-white px-2"><SkipBack size={16} fill="currentColor"/></button>
                   <button onClick={() => setIsPlaying(!isPlaying)} className={`p-1.5 rounded-full text-white ${isPlaying ? 'bg-[#bc8cff]' : 'bg-[#0d1117] border border-[#30363d] hover:bg-[#30363d]'}`}>
                      {isPlaying ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor" className="ml-0.5"/>}
                   </button>
                   <button className="text-[#8b949e] hover:text-white px-2"><Square size={16} fill="currentColor"/></button>
                   <button className="text-[#8b949e] hover:text-white px-2"><SkipForward size={16} fill="currentColor"/></button>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-[#8b949e]">
                    <span>Start: 00:00:00:00</span>
                    <span className="text-[#bc8cff] text-[14px]">00:01:24:12</span>
                    <span>End: 00:03:00:00</span>
                </div>
                <div className="flex items-center gap-2">
                   <button className="px-3 py-1 bg-[#21262d] border border-[#30363d] rounded text-white hover:bg-[#30363d] transition-colors"><Settings2 size={14}/></button>
                </div>
             </div>
         </div>

         {/* Right Inspector */}
         <div className="w-64 bg-[#0d1117] border-l border-[#30363d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
            <div className="px-3 py-2 bg-[#161b22] border-b border-[#30363d] font-bold text-white uppercase tracking-wider text-[10px] flex justify-between items-center shadow-sm">
               Selected Track <span className="text-[#bc8cff] font-mono">Camera_Shot_02</span>
            </div>
            <div className="p-3 space-y-4 text-[10px]">
               <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                  <div className="bg-[#21262d] px-2 py-1.5 font-bold text-white border-b border-[#30363d]">Camera Lens</div>
                  <div className="p-2 space-y-2">
                     <div className="flex justify-between items-center"><span className="text-[#8b949e]">Focal Length</span><input type="text" defaultValue="35.0 mm" className="w-20 bg-[#0d1117] border border-[#30363d] rounded px-1.5 py-0.5 text-white font-mono text-right"/></div>
                     <div className="flex justify-between items-center"><span className="text-[#8b949e]">Aperture (f-stop)</span><input type="text" defaultValue="1.4" className="w-20 bg-[#0d1117] border border-[#30363d] rounded px-1.5 py-0.5 text-white font-mono text-right"/></div>
                     <div className="flex justify-between items-center"><span className="text-[#8b949e]">Focus Distance</span><input type="text" defaultValue="120.5 cm" className="w-20 bg-[#0d1117] border border-[#30363d] rounded px-1.5 py-0.5 text-[#bc8cff] font-mono text-right border-[#bc8cff]/50"/></div>
                  </div>
               </div>
               <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                  <div className="bg-[#21262d] px-2 py-1.5 font-bold text-white border-b border-[#30363d]">Post Processing</div>
                  <div className="p-2 space-y-2">
                     <div className="flex items-center gap-2 text-white"><input type="checkbox" defaultChecked className="accent-[#bc8cff]"/> Depth of Field</div>
                     <div className="flex items-center gap-2 text-white"><input type="checkbox" defaultChecked className="accent-[#bc8cff]"/> Motion Blur</div>
                     <div className="flex items-center gap-2 text-white"><input type="checkbox" defaultChecked className="accent-[#bc8cff]"/> Bloom <span className="ml-auto bg-[#0d1117] border border-[#30363d] px-1 rounded text-[#8b949e]">Intensity 0.5</span></div>
                     <div className="flex items-center gap-2 text-white"><input type="checkbox" defaultChecked className="accent-[#bc8cff]"/> Color Grading <span className="ml-auto bg-[#0d1117] border border-[#30363d] px-1 rounded text-[#8b949e]">LUT_03_Cinematic</span></div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Bottom Complex Timeline */}
      <div className="h-72 border-t border-[#30363d] bg-[#0d1117] flex flex-col shrink-0">
          <div className="flex-1 flex overflow-hidden">
              {/* Tracks Header */}
              <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] flex flex-col overflow-y-auto custom-scrollbar z-10">
                 <div className="h-6 border-b border-[#30363d] bg-[#21262d] sticky top-0 z-20 flex items-center justify-between px-2">
                    <span className="font-bold text-white text-[10px] uppercase tracking-wider">Tracks</span>
                    <div className="flex gap-1 text-[#8b949e]">
                       <button className="hover:text-white"><Plus size={12}/></button>
                       <button className="hover:text-white"><Settings2 size={12}/></button>
                    </div>
                 </div>

                 <TrackHeader icon={<Camera size={12} className="text-[#58a6ff]"/>} name="Camera Cuts" />
                 <TrackHeader icon={<UserSquare size={12} className="text-[#3fb950]"/>} name="Boss_Character" />
                 <div className="pl-6 py-1 border-b border-[#30363d]/50 bg-[#0d1117] flex justify-between group">
                    <span className="text-[10px] text-[#8b949e] flex items-center gap-1">Animation</span>
                 </div>
                 <div className="pl-6 py-1 border-b border-[#30363d]/50 bg-[#0d1117] flex justify-between group">
                    <span className="text-[10px] text-[#8b949e] flex items-center gap-1">Transform</span>
                 </div>
                 <TrackHeader icon={<Volume2 size={12} className="text-[#e3b341]"/>} name="Audio / Dialogue" />
                 <TrackHeader icon={<Video size={12} className="text-white"/>} name="Subtitles" />
                 <TrackHeader icon={<Code size={12} className="text-[#bc8cff]"/>} name="Event Triggers" />
              </div>

              {/* Timeline Grid */}
              <div className="flex-1 bg-[#090b0e] relative overflow-x-auto overflow-y-hidden bg-[linear-gradient(90deg,#161b22_1px,transparent_1px)] bg-[size:20px_100%] shadow-[inset_10px_0_10px_-10px_rgba(0,0,0,0.5)] custom-scrollbar">
                  {/* Ruler */}
                  <div className="h-6 border-b border-[#30363d] bg-[#161b22]/90 sticky top-0 z-20 flex text-[9px] font-mono text-[#8b949e] items-end pointer-events-none">
                     {Array.from({length: 60}).map((_, i) => (
                        <div key={i} className="min-w-[20px] h-full border-l border-[#30363d]/50 flex flex-col justify-end pl-0.5 shrink-0 relative">
                           {i % 5 === 0 && <span className="absolute top-0 opacity-80">{i}s</span>}
                        </div>
                     ))}
                  </div>

                  {/* Playhead */}
                  <div className="absolute top-0 bottom-0 left-[240px] w-px bg-red-500 z-30 shadow-[0_0_5px_red] pointer-events-none">
                     <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-red-500 absolute -top-0 -left-[4px]"></div>
                  </div>

                  {/* Clips */}
                  <div className="relative">
                      {/* Camera Cuts */}
                      <div className="h-[25px] border-b border-[#30363d]/50 relative flex items-center hover:bg-white/5">
                         <div className="absolute left-0 w-[100px] h-[18px] bg-[#58a6ff]/20 border border-[#58a6ff]/50 rounded-sm text-[9px] px-1 font-bold text-[#58a6ff] overflow-hidden">Shot_01_Wide</div>
                         <div className="absolute left-[100px] w-[200px] h-[18px] bg-[#58a6ff]/40 border border-[#58a6ff] rounded-sm text-[9px] px-1 font-bold text-white shadow-inner overflow-hidden flex items-center justify-between group">
                            Shot_02_CloseUp <Scissors size={10} className="opacity-0 group-hover:opacity-100 cursor-crosshair"/>
                         </div>
                         <div className="absolute left-[300px] w-[150px] h-[18px] bg-[#58a6ff]/20 border border-[#58a6ff]/50 rounded-sm text-[9px] px-1 font-bold text-[#58a6ff] overflow-hidden">Shot_03_Action</div>
                      </div>

                      {/* Character Header (empty track) */}
                      <div className="h-[25px] border-b border-[#30363d]/50 relative"></div>
                      
                      {/* Character Anim */}
                      <div className="h-[21px] border-b border-[#30363d]/50 relative bg-[#090b0e]">
                         <div className="absolute left-[20px] w-[350px] h-[15px] bg-[#3fb950]/20 border border-[#3fb950]/50 rounded-sm top-1 text-[8px] font-bold text-[#3fb950] px-1 overflow-hidden flex items-center">
                            Boss_Idle_To_DrawWeapon
                            {/* Blend line */}
                            <div className="absolute right-0 w-[50px] h-full bg-gradient-to-l from-transparent to-[#3fb950]/30 z-10 border-l border-dashed border-[#3fb950]"></div>
                         </div>
                         <div className="absolute left-[340px] w-[400px] h-[15px] bg-[#3fb950]/20 border border-[#3fb950]/50 rounded-sm top-1 text-[8px] font-bold text-[#3fb950] px-1 overflow-hidden flex items-center pl-[20px]">
                            Boss_Combat_Stance_Loop
                         </div>
                      </div>

                      {/* Character Transform (Keyframes) */}
                      <div className="h-[21px] border-b border-[#30363d]/50 relative bg-[#090b0e]">
                         <div className="absolute top-1/2 -translate-y-1/2 left-[20px] w-2 h-2 bg-red-400 rotate-45 border border-black shadow-[0_0_2px_black]"></div>
                         <div className="absolute top-1/2 -translate-y-1/2 left-[200px] w-2 h-2 bg-red-400 rotate-45 border border-black shadow-[0_0_2px_black]"></div>
                         <div className="absolute top-1/2 -translate-y-1/2 left-[300px] w-2 h-2 bg-red-400 rotate-45 border border-black shadow-[0_0_2px_black]"></div>
                         <div className="absolute top-[10px] left-[24px] w-[176px] h-[1px] bg-red-400/30"></div>
                         <div className="absolute top-[10px] left-[204px] w-[96px] h-[1px] bg-red-400/30"></div>
                      </div>

                      {/* Audio */}
                      <div className="h-[25px] border-b border-[#30363d]/50 relative flex items-center mt-[1px]">
                         <div className="absolute left-[50px] w-[250px] h-[18px] bg-[#e3b341]/20 border border-[#e3b341]/50 rounded-sm text-[9px] px-1 font-bold text-[#e3b341] overflow-hidden flex items-end">
                            Dialogue_Line_01.wav
                            <svg className="absolute inset-0 w-full h-full text-[#e3b341] opacity-50" preserveAspectRatio="none"><path d="M0,18 Q10,5 20,18 T40,18 T80,18 T120,5 T150,18" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
                         </div>
                      </div>

                      {/* Subtitles */}
                      <div className="h-[25px] border-b border-[#30363d]/50 relative flex items-center">
                         <div className="absolute left-[80px] w-[180px] h-[14px] bg-white/20 border border-white/50 rounded-sm text-[8px] px-1 font-bold text-white overflow-hidden text-center flex items-center justify-center">
                            "So, you finally arrived..."
                         </div>
                      </div>

                      {/* Events */}
                      <div className="h-[25px] border-b border-[#30363d]/50 relative flex items-center">
                         <div className="absolute left-[290px] bg-[#bc8cff]/80 text-black px-1 py-0.5 rounded text-[8px] font-bold border border-[#bc8cff] shadow-[0_0_8px_rgba(188,140,255,0.5)] flex items-center gap-1 cursor-pointer">
                            <Zap size={8} fill="currentColor"/> Unlock_Player_Movement
                         </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

function TrackHeader({icon, name}: {icon: React.ReactNode, name: string}) {
   return (
       <div className="px-2 py-1.5 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between group cursor-pointer hover:bg-[#21262d]">
          <div className="flex items-center gap-2 font-bold text-white text-[11px] truncate">
             {icon} {name}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 text-[#8b949e]">
             <Eye size={12} className="hover:text-white"/>
             <Lock size={12} className="hover:text-white"/>
          </div>
       </div>
   );
}
function Lock({size, className}: {size: number, className: string}) {
    return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}
