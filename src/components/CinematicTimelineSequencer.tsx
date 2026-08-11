import React, { useState } from 'react';
import { Film, Play, Pause, FastForward, Rewind, Scissors, Copy, Settings, Video, Camera, Mic2, Volume2, Eye, Sliders, MonitorPlay } from 'lucide-react';

export default function CinematicTimelineSequencer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(14.5); // seconds

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Toolbar */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg shadow-lg">
            <Film size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Cinematic <span className="text-indigo-400">Sequencer</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Multi-Track Timeline & F-Curves</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="bg-[#333] hover:bg-[#444] p-1.5 rounded text-gray-300 transition-colors"><Scissors size={14}/></button>
           <button className="bg-[#333] hover:bg-[#444] p-1.5 rounded text-gray-300 transition-colors"><Copy size={14}/></button>
           <div className="w-px h-6 bg-[#3e3e42] mx-2"></div>
           <button className="bg-[#333] hover:bg-[#444] px-3 py-1.5 rounded text-[10px] font-bold text-gray-300 transition-colors flex items-center gap-2">
             <MonitorPlay size={14}/> RENDER MOVIE
           </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Upper half: Viewport and Properties */}
        <div className="flex-1 flex overflow-hidden border-b border-[#3e3e42]">
          
          {/* Properties Panel */}
          <div className="w-72 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
             <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c] flex items-center gap-2">
               <Sliders size={14} className="text-gray-400"/>
               <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Keyframe Properties</h3>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-[10px]">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-indigo-400 font-bold uppercase border-b border-[#3e3e42] pb-1">
                    <span>Camera_Main (Transform)</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-center text-gray-500 mb-1">
                    <div></div><div>X</div><div>Y</div><div>Z</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-gray-400">Location</span>
                    <input type="number" defaultValue="142.5" className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-1 py-1 text-center text-gray-300" />
                    <input type="number" defaultValue="45.2" className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-1 py-1 text-center text-gray-300" />
                    <input type="number" defaultValue="-12.8" className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-1 py-1 text-center text-gray-300" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-gray-400">Rotation</span>
                    <input type="number" defaultValue="15.0" className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-1 py-1 text-center text-gray-300" />
                    <input type="number" defaultValue="-45.0" className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-1 py-1 text-center text-gray-300" />
                    <input type="number" defaultValue="0.0" className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-1 py-1 text-center text-gray-300" />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-indigo-400 font-bold uppercase border-b border-[#3e3e42] pb-1">
                    <span>Camera Settings</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Focal Length</span>
                    <div className="flex items-center gap-1">
                      <input type="range" className="w-24 h-1 bg-[#3e3e42] rounded-lg appearance-none accent-indigo-500" />
                      <span className="w-8 text-right text-gray-300">35mm</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Aperture (f-stop)</span>
                    <div className="flex items-center gap-1">
                      <input type="range" className="w-24 h-1 bg-[#3e3e42] rounded-lg appearance-none accent-indigo-500" />
                      <span className="w-8 text-right text-gray-300">f/1.8</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Focus Distance</span>
                    <div className="flex items-center gap-1">
                      <input type="range" className="w-24 h-1 bg-[#3e3e42] rounded-lg appearance-none accent-indigo-500" />
                      <span className="w-8 text-right text-gray-300">2.5m</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-indigo-400 font-bold uppercase border-b border-[#3e3e42] pb-1">
                    <span>Interpolation</span>
                  </div>
                  <select className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1.5 text-[10px] text-gray-200 outline-none">
                    <option>Cubic Auto (Smooth)</option>
                    <option>Linear</option>
                    <option>Constant (Step)</option>
                    <option>Bezier (Manual)</option>
                  </select>
                </div>

             </div>
          </div>

          {/* Viewport */}
          <div className="flex-1 bg-[#0a0a0c] relative flex items-center justify-center overflow-hidden">
             
             {/* Mock 3D Scene Cinematic View */}
             <div className="absolute inset-4 bg-gradient-to-t from-black to-transparent border border-gray-700/50 flex flex-col justify-between">
                
                {/* Letterbox margins */}
                <div className="w-full h-12 bg-black opacity-90"></div>
                
                <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-30 mix-blend-screen" style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.2) 0%, transparent 60%)'
                  }}></div>
                  
                  {/* Mock subject (silhouette) */}
                  <div className="w-24 h-48 bg-black border border-gray-800 rounded-t-full shadow-[0_0_50px_rgba(99,102,241,0.2)]"></div>
                  
                  {/* Depth of field blur mocks */}
                  <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full"></div>
                  <div className="absolute bottom-10 right-20 w-48 h-48 bg-purple-500/10 blur-2xl rounded-full"></div>

                  {/* Rule of thirds grid (overlay) */}
                  <div className="absolute inset-0 border border-white/5 pointer-events-none grid grid-cols-3 grid-rows-3">
                    <div className="border-r border-b border-white/5"></div>
                    <div className="border-r border-b border-white/5"></div>
                    <div className="border-b border-white/5"></div>
                    <div className="border-r border-b border-white/5"></div>
                    <div className="border-r border-b border-white/5"></div>
                    <div className="border-b border-white/5"></div>
                    <div className="border-r border-white/5"></div>
                    <div className="border-r border-white/5"></div>
                    <div></div>
                  </div>
                </div>

                <div className="w-full h-12 bg-black opacity-90 flex items-center px-4 justify-between text-[10px] text-gray-500 font-mono">
                  <span>SHOT 04_SCENE_B</span>
                  <span>TC: 01:00:14:12</span>
                </div>
             </div>

             {/* Safe Area Overlays */}
             <div className="absolute top-8 right-8 flex gap-2">
               <button className="bg-black/50 border border-gray-700 p-1.5 rounded text-gray-400 hover:text-white transition-colors"><Eye size={12}/></button>
             </div>
          </div>
        </div>

        {/* Lower half: Timeline Editor */}
        <div className="h-64 bg-[#1e1e1e] flex flex-col shrink-0">
          
          {/* Transport Controls */}
          <div className="h-10 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between">
            <div className="flex items-center gap-1">
              <button className="p-1.5 text-gray-400 hover:text-white"><Rewind size={14}/></button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 text-white bg-indigo-600 rounded mx-1"
              >
                {isPlaying ? <Pause size={14}/> : <Play size={14}/>}
              </button>
              <button className="p-1.5 text-gray-400 hover:text-white"><FastForward size={14}/></button>
              
              <div className="ml-4 px-2 py-1 bg-black rounded border border-[#3e3e42] text-indigo-400 font-mono text-xs">
                {time.toFixed(2)}s
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
               <span className="flex items-center gap-1"><input type="checkbox" className="accent-indigo-500" defaultChecked/> Auto-Key</span>
               <div className="w-px h-4 bg-[#3e3e42] mx-2"></div>
               <span>FPS: 60</span>
            </div>
          </div>

          {/* Tracks Area */}
          <div className="flex-1 flex overflow-hidden relative">
            
            {/* Track Headers */}
            <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col overflow-y-auto custom-scrollbar z-10 shrink-0">
               
               {/* Track 1: Camera */}
               <div className="h-12 border-b border-[#3e3e42] flex items-center px-2 justify-between group">
                 <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
                   <Camera size={14} className="text-blue-400"/> Camera_Main
                 </div>
                 <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                   <div className="w-4 h-4 bg-[#333] rounded flex items-center justify-center text-[8px]">S</div>
                   <div className="w-4 h-4 bg-[#333] rounded flex items-center justify-center text-[8px]">M</div>
                 </div>
               </div>
               
               {/* Track 2: Animation */}
               <div className="h-12 border-b border-[#3e3e42] flex items-center px-2 justify-between group">
                 <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
                   <Video size={14} className="text-orange-400"/> Player_Idle_To_Run
                 </div>
               </div>

               {/* Track 3: Audio */}
               <div className="h-12 border-b border-[#3e3e42] flex items-center px-2 justify-between group">
                 <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
                   <Mic2 size={14} className="text-green-400"/> Dialogue_01
                 </div>
               </div>
               
               {/* Track 4: Particles */}
               <div className="h-12 border-b border-[#3e3e42] flex items-center px-2 justify-between group">
                 <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
                   <Volume2 size={14} className="text-purple-400"/> SFX_Explosion
                 </div>
               </div>
            </div>

            {/* Timeline Grid & Clips */}
            <div className="flex-1 overflow-x-auto overflow-y-auto relative custom-scrollbar bg-[#1a1a1c]">
               
               {/* Time ruler */}
               <div className="sticky top-0 h-6 bg-[#252526] border-b border-[#3e3e42] z-20 flex">
                 {Array.from({length: 50}).map((_, i) => (
                   <div key={i} className="min-w-[50px] border-l border-[#3e3e42] text-[9px] text-gray-500 pl-1 pt-1 font-mono">
                     00:{i.toString().padStart(2, '0')}
                   </div>
                 ))}
               </div>

               {/* Playhead */}
               <div className="absolute top-0 bottom-0 z-30 pointer-events-none" style={{ left: `${(time / 50) * 100 * 50}px` }}>
                 <div className="w-2.5 h-3 bg-red-500 -ml-[5px] cursor-ew-resize" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)'}}></div>
                 <div className="w-px h-full bg-red-500"></div>
               </div>

               {/* Tracks Content */}
               <div className="relative">
                 {/* Grid lines */}
                 <div className="absolute inset-0 pointer-events-none flex" style={{ width: '2500px' }}>
                   {Array.from({length: 50}).map((_, i) => (
                     <div key={i} className="min-w-[50px] border-l border-[#3e3e42]/30 h-full"></div>
                   ))}
                 </div>

                 {/* Camera Keyframes */}
                 <div className="h-12 border-b border-[#3e3e42] relative flex items-center" style={{ width: '2500px' }}>
                    <div className="absolute w-2 h-2 bg-blue-400 rotate-45 left-[50px]"></div>
                    <div className="absolute w-2 h-2 bg-blue-400 rotate-45 left-[250px]"></div>
                    <div className="absolute w-2 h-2 bg-blue-400 rotate-45 left-[750px] shadow-[0_0_10px_#60a5fa]"></div>
                 </div>

                 {/* Animation Clip */}
                 <div className="h-12 border-b border-[#3e3e42] relative flex items-center" style={{ width: '2500px' }}>
                    <div className="absolute left-[100px] w-[600px] h-8 bg-orange-600/30 border border-orange-500 rounded mx-1 flex items-center px-2 text-[10px] text-orange-200">
                      WalkCycle_Blend
                    </div>
                 </div>

                 {/* Audio Clip */}
                 <div className="h-12 border-b border-[#3e3e42] relative flex items-center" style={{ width: '2500px' }}>
                    <div className="absolute left-[300px] w-[400px] h-8 bg-green-600/30 border border-green-500 rounded mx-1 overflow-hidden flex items-center">
                      <div className="w-full h-full opacity-50 flex items-center justify-center gap-[1px]">
                         {Array.from({length: 100}).map((_, i) => (
                           <div key={i} className="w-[2px] bg-green-400" style={{ height: `${Math.random() * 80 + 10}%` }}></div>
                         ))}
                      </div>
                    </div>
                 </div>
                 
                 {/* SFX Clip */}
                 <div className="h-12 border-b border-[#3e3e42] relative flex items-center" style={{ width: '2500px' }}>
                    <div className="absolute left-[700px] w-[150px] h-8 bg-purple-600/30 border border-purple-500 rounded mx-1 overflow-hidden flex items-center">
                      <div className="w-full h-full opacity-50 flex items-center justify-center gap-[1px]">
                         {Array.from({length: 30}).map((_, i) => (
                           <div key={i} className="w-[3px] bg-purple-400" style={{ height: `${(Math.sin(i)*50) + 50}%` }}></div>
                         ))}
                      </div>
                    </div>
                 </div>
               </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
