import React, { useState } from 'react';
import { Camera, Play, Circle, Save, PersonStanding, Bone, Eye, Activity } from 'lucide-react';

export default function MotionCaptureStudio() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-teal-500 to-green-600 p-1.5 rounded-lg shadow-lg">
            <Camera size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Motion <span className="text-teal-400">Capture Studio</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Live Retargeting & Recording</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setIsRecording(!isRecording)}
             className={`flex items-center gap-2 ${isRecording ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.4)]' : 'bg-[#333] hover:bg-[#444]'} text-white px-4 py-1.5 rounded text-xs font-bold transition-colors`}
           >
             {isRecording ? <><Circle size={12} className="fill-white animate-pulse" /> RECORDING (00:12)</> : <><Circle size={12} /> REC</>}
           </button>
           <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-[0_0_10px_rgba(20,184,166,0.4)]">
             <Save size={14} /> EXPORT FBX
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Input Sources */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><PersonStanding size={14}/> Input Devices</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
             
             <div className="bg-[#1a1a1c] border border-[#3e3e42] p-3 rounded">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-[10px] font-bold text-teal-400 flex items-center gap-1"><Camera size={12}/> WebCam (MediaPipe)</span>
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               </div>
               <div className="text-[9px] text-gray-500">Tracking: Full Body + Hands</div>
             </div>
             
             <div className="bg-[#1a1a1c] border border-[#3e3e42] p-3 rounded opacity-50">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Activity size={12}/> Rokoko Suit</span>
                 <span className="w-2 h-2 rounded-full bg-gray-500"></span>
               </div>
               <div className="text-[9px] text-gray-600">Status: Disconnected</div>
             </div>
             
             <div className="space-y-2 mt-4">
               <h4 className="text-[10px] font-bold text-gray-500 uppercase px-1">Retargeting Skeleton</h4>
               <select className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1.5 text-[10px] text-gray-200 outline-none">
                 <option>UE5 Manny (SK_Mannequin)</option>
                 <option>Mixamo Standard</option>
                 <option>Metahuman Base</option>
               </select>
             </div>

          </div>
        </div>

        {/* Center: Live Viewer */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
           {/* Mock viewport rendering */}
           <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1c] to-black"></div>
           
           {/* Fake Grid */}
           <div className="absolute bottom-0 w-full h-1/2" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              transform: 'perspective(500px) rotateX(60deg) scale(2)',
              transformOrigin: 'top center'
           }}></div>
           
           {/* Fake Stick Figure representing mocap skeleton */}
           <div className="relative z-10 w-32 h-64 flex flex-col items-center">
              {/* Head */}
              <div className="w-8 h-10 border-2 border-teal-500 rounded-[40%] bg-teal-900/30"></div>
              {/* Spine */}
              <div className="w-1 h-20 bg-teal-500 my-1 relative">
                 {/* Arms */}
                 <div className="absolute top-2 left-1/2 w-24 h-1 bg-teal-500 -translate-x-1/2 flex justify-between">
                    <div className="w-2 h-2 rounded-full bg-white -mt-0.5 -ml-1"></div>
                    <div className="w-2 h-2 rounded-full bg-white -mt-0.5 -mr-1"></div>
                 </div>
              </div>
              {/* Pelvis */}
              <div className="w-8 h-2 bg-teal-500 rounded-full flex justify-between relative">
                 {/* Legs */}
                 <div className="w-1 h-24 bg-teal-500 absolute top-2 left-1 origin-top rotate-[15deg]"></div>
                 <div className="w-1 h-24 bg-teal-500 absolute top-2 right-1 origin-top -rotate-[15deg]"></div>
              </div>
           </div>
           
           {/* Overlay */}
           <div className="absolute top-4 left-4 bg-[#252526]/80 backdrop-blur border border-[#3e3e42] p-2 rounded text-[10px] font-mono text-teal-400">
             FPS: 60 | Latency: 12ms | Smoothing: 0.4
           </div>
           
           {isRecording && (
             <div className="absolute top-4 right-4 bg-red-900/80 text-red-100 font-bold px-3 py-1 rounded border border-red-500 animate-pulse text-[10px]">
               RECORDING TAKE 04
             </div>
           )}
        </div>

        {/* Right: Smoothing/Filters */}
        <div className="w-64 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Bone size={14}/> Filters</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
             
             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-teal-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Real-Time Smoothing</h4>
               <div className="space-y-2 text-[10px]">
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Translation Filter</span><span>High</span></div>
                   <input type="range" defaultValue="70" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-teal-400" />
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Rotation Jitter reduction</span><span>Medium</span></div>
                   <input type="range" defaultValue="50" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-teal-400" />
                 </div>
               </div>
             </div>
             
             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-teal-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">IK Overrides</h4>
               <div className="space-y-2 text-[10px] text-gray-300">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-teal-500 focus:ring-0" /> Lock Feet to Ground (IK)
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded bg-[#1a1a1c] border-[#3e3e42] text-teal-500 focus:ring-0" /> Prevent Hand Intersections
                  </label>
               </div>
             </div>

          </div>
        </div>

      </div>
    </div>
  );
}
