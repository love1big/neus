import React, { useState } from 'react';
import { Clapperboard, Play, Pause, SkipBack, SkipForward, Video, Scissors, Key, Layers, MousePointer2, Maximize, Settings, Camera, Move3d, Film, Sparkles } from 'lucide-react';

export default function DirectorTimeline() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState('camera1');

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Header Toolbar */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#d29922]/20 border border-[#d29922]/50 rounded">
            <Clapperboard className="text-[#d29922]" size={16} />
          </div>
          <div>
            <h1 className="font-bold text-sm">Cinematic Director Sequencer</h1>
            <p className="text-[10px] text-[#8b949e]">Multi-Cam & Event Timeline Orchestration</p>
          </div>
        </div>

        <div className="flex bg-[#010409] border border-[#30363d] rounded-lg px-3 py-1 gap-4 items-center shadow-inner">
           <div className="flex gap-2 text-[#8b949e]">
             <button className="hover:text-white"><SkipBack size={16} /></button>
             <button className="text-white hover:text-[#58a6ff]" onClick={() => setIsPlaying(!isPlaying)}>
               {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
             </button>
             <button className="hover:text-white"><SkipForward size={16} /></button>
           </div>
           <div className="w-[1px] h-4 bg-[#30363d]"></div>
           <div className="font-mono text-sm text-[#58a6ff] font-bold">
             00:01:24:15
           </div>
           <div className="text-[10px] text-[#8b949e] flex gap-2">
             <span>24 FPS</span>
             <span>1080p</span>
           </div>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
             <Video size={14} /> Render Sequence
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col">
        {/* Viewport Top Area */}
        <div className="h-1/2 flex border-b border-[#30363d]">
          {/* Main Camera View */}
          <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden border-r border-[#30363d]">
             {/* Fake 3D Scene / Render View */}
             <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
             
             {/* Grid / Safe Margins */}
             <div className="absolute inset-4 border border-white/20 pointer-events-none">
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/10"></div>
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/10"></div>
             </div>

             <div className="absolute top-4 left-4 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-white border border-white/20">
               CAM: Main_Hero_Shot_01
             </div>
             
             <div className="absolute top-4 right-4 flex bg-[#161b22]/80 backdrop-blur rounded border border-[#30363d] overflow-hidden">
                <button className="px-2 py-1 text-xs hover:bg-[#30363d] border-r border-[#30363d] text-white"><Maximize size={12}/></button>
                <button className="px-2 py-1 text-xs hover:bg-[#30363d] text-white"><Settings size={12}/></button>
             </div>
          </div>
          
          {/* Properties / Keyframes Inspector */}
          <div className="w-72 bg-[#161b22] flex flex-col shrink-0">
             <div className="p-2 border-b border-[#30363d] font-bold text-xs flex items-center gap-2">
               <Camera size={14} className="text-[#8b949e]" /> CAMERA PROPERTIES
             </div>
             <div className="p-3 space-y-4 flex-1 overflow-y-auto">
                <div className="space-y-2">
                   <PropSlider label="Focal Length (mm)" value="35.0" />
                   <PropSlider label="Aperture (f-stop)" value="1.8" />
                   <PropSlider label="Focus Distance (m)" value="2.5" />
                </div>
                
                <div className="border-t border-[#30363d] pt-3">
                   <div className="text-xs text-[#8b949e] mb-2 font-bold">TRANSFORM</div>
                   <div className="grid grid-cols-3 gap-2">
                      <TransformInput axis="X" value="12.4" />
                      <TransformInput axis="Y" value="4.2" />
                      <TransformInput axis="Z" value="-8.1" />
                   </div>
                   <div className="grid grid-cols-3 gap-2 mt-2">
                      <TransformInput axis="Pitch" value="15°" />
                      <TransformInput axis="Yaw" value="45°" />
                      <TransformInput axis="Roll" value="0°" />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Timeline Bottom Area */}
        <div className="h-1/2 bg-[#010409] flex flex-col shrink-0 relative">
           
           <div className="h-8 border-b border-[#30363d] bg-[#0d1117] flex items-center px-2 justify-between">
              <div className="flex bg-[#161b22] rounded border border-[#30363d] p-0.5 gap-0.5">
                 <button className="p-1 bg-[#30363d] text-white rounded"><MousePointer2 size={12}/></button>
                 <button className="p-1 text-[#8b949e] hover:text-white"><Scissors size={12}/></button>
                 <button className="p-1 text-[#8b949e] hover:text-white"><Key size={12}/></button>
              </div>
           </div>

           <div className="flex flex-1 overflow-hidden">
              {/* Track Headers */}
              <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 z-10 overflow-y-auto">
                 <TrackHeader title="Director Cut (Master)" color="#d29922" icon={<Film size={12}/>} />
                 <TrackHeader title="Main_Hero_Shot_01" color="#58a6ff" icon={<Camera size={12}/>} active={activeTrack === 'camera1'} onClick={() => setActiveTrack('camera1')} />
                 <TrackHeader title="Drone_Tracking_02" color="#3fb950" icon={<Camera size={12}/>} active={activeTrack === 'camera2'} onClick={() => setActiveTrack('camera2')} />
                 <TrackHeader title="Explosion_VFX_Trigger" color="#a371f7" icon={<Sparkles size={12}/>} />
                 <TrackHeader title="Character_Anim_Run" color="#f85149" icon={<Move3d size={12}/>} />
              </div>

              {/* Tracks View */}
              <div className="flex-1 relative overflow-auto">
                 {/* Timeline Grid */}
                 <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(90deg, #30363d 1px, transparent 1px)', backgroundSize: '100px 100%' }}></div>
                 
                 {/* Playhead */}
                 <div className="absolute top-0 bottom-0 left-[250px] w-[2px] bg-[#58a6ff] z-20 shadow-[0_0_8px_#58a6ff]">
                    <div className="absolute -top-3 -translate-x-1/2 w-3 h-3 bg-[#58a6ff] rounded-sm transform rotate-45"></div>
                 </div>

                 {/* Regions / Clips */}
                 <div className="relative w-[2000px] flex flex-col">
                    <Lane>
                       <Clip color="#d29922" left={0} width={250} label="Cam 01" />
                       <Clip color="#d29922" left={250} width={300} label="Cam 02" />
                    </Lane>
                    <Lane>
                       <Clip color="#58a6ff" left={0} width={400} label="Tracking Arc" hasKeyframes />
                    </Lane>
                    <Lane>
                       <Clip color="#3fb950" left={250} width={500} label="Flyover Spline" hasKeyframes />
                    </Lane>
                    <Lane>
                       <div className="absolute top-2 left-[300px] w-2 h-2 bg-[#a371f7] rounded-full shadow-[0_0_5px_#a371f7]"></div>
                       <div className="absolute top-2 left-[450px] w-2 h-2 bg-[#a371f7] rounded-full shadow-[0_0_5px_#a371f7]"></div>
                    </Lane>
                    <Lane>
                       <Clip color="#f85149" left={50} width={300} label="Run_Cycle_Loop" />
                    </Lane>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

function PropSlider({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#8b949e]">{label}</span>
        <span className="text-white font-mono">{value}</span>
      </div>
      <input type="range" className="w-full accent-[#58a6ff]" min="0" max="100" defaultValue="50" />
    </div>
  );
}

function TransformInput({ axis, value }: { axis: string, value: string }) {
  return (
    <div className="flex bg-[#0d1117] border border-[#30363d] rounded overflow-hidden">
      <div className="bg-[#21262d] text-[#8b949e] px-1.5 py-1 text-[10px] font-bold border-r border-[#30363d]">{axis}</div>
      <input type="text" className="w-full bg-transparent text-white text-[10px] px-1 font-mono text-center outline-none" defaultValue={value} />
    </div>
  );
}

function TrackHeader({ title, color, icon, active, onClick }: { title: string, color: string, icon: React.ReactNode, active?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`h-12 border-b border-[#30363d] px-2 flex items-center justify-between cursor-pointer transition-colors ${active ? 'bg-[#30363d]/50' : 'hover:bg-[#21262d]'}`}>
       <div className="flex items-center gap-2">
         <div className="p-1 rounded text-white" style={{ backgroundColor: color }}>{icon}</div>
         <span className="text-xs font-bold text-white truncate max-w-[120px]">{title}</span>
       </div>
       <div className="flex gap-1">
          <button className="w-4 h-4 rounded border border-[#30363d] flex items-center justify-center text-[8px] text-[#8b949e] hover:text-white">👁</button>
          <button className="w-4 h-4 rounded border border-[#30363d] flex items-center justify-center text-[8px] text-[#8b949e] hover:text-white">🔒</button>
       </div>
    </div>
  );
}

function Lane({ children }: { children: React.ReactNode }) {
  return <div className="h-12 border-b border-[#30363d] relative flex items-center">{children}</div>;
}

function Clip({ color, left, width, label, hasKeyframes }: { color: string, left: number, width: number, label: string, hasKeyframes?: boolean }) {
  return (
    <div className="absolute h-8 top-2 rounded border border-white/20 shadow-md flex items-center px-2 overflow-hidden group cursor-pointer" 
         style={{ left: `${left}px`, width: `${width}px`, backgroundColor: `${color}40` }}>
       <span className="text-[10px] font-bold text-white/80 whitespace-nowrap">{label}</span>
       {hasKeyframes && (
         <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 flex items-center gap-8 px-4">
            <div className="w-1.5 h-1.5 bg-white transform rotate-45 shadow-[0_0_2px_#fff]"></div>
            <div className="w-1.5 h-1.5 bg-white transform rotate-45 shadow-[0_0_2px_#fff]"></div>
            <div className="w-1.5 h-1.5 bg-white transform rotate-45 shadow-[0_0_2px_#fff]"></div>
         </div>
       )}
    </div>
  );
}
