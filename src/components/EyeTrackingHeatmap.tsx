import React from 'react';
import { Eye, Layers, Camera, Play, BarChart} from 'lucide-react';

export default function EyeTrackingHeatmap() {
  return (
    <div className="flex-1 flex flex-col bg-[#0a0c10] text-[#c9d1d9] font-sans">
      <div className="flex justify-between items-center p-4 border-b border-[#30363d] bg-[#161b22]">
         <div className="font-bold flex items-center gap-2 text-white"><Eye size={20} className="text-[#f85149]"/> Biometric Eye Tracking & Heatmap Analyser</div>
         <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs hover:bg-[#30363d] flex items-center gap-2"><Layers size={14}/> Opacity</button>
            <button className="px-3 py-1.5 bg-[#f85149] text-white rounded font-bold text-xs flex items-center gap-2 hover:bg-[#ff7b72]"><Play size={14}/> Replay Session</button>
         </div>
      </div>
      
      <div className="flex-1 flex">
         <div className="flex-1 relative bg-[#050505] overflow-hidden flex items-center justify-center p-8">
            <div className="w-[800px] h-[450px] bg-[#161b22] border border-[#30363d] rounded shadow-2xl relative overflow-hidden">
               {/* Mock UI Background */}
               <div className="absolute inset-0 bg-black flex flex-col opacity-50">
                  <div className="h-16 bg-[#0d1117] flex items-center px-6 justify-between"><div className="w-32 h-6 bg-[#30363d] rounded"></div><div className="flex gap-4"><div className="w-16 h-6 bg-[#30363d] rounded"></div><div className="w-16 h-6 bg-[#30363d] rounded"></div></div></div>
                  <div className="flex-1 flex p-6 gap-6"><div className="flex-1 bg-[#0d1117] rounded-xl"></div><div className="w-64 bg-[#0d1117] rounded-xl flex flex-col gap-4"><div className="flex-1 bg-[#161b22] rounded-xl"></div><div className="flex-1 bg-[#161b22] rounded-xl"></div></div></div>
               </div>
               
               {/* Overlay Heatmap Blobs (Simulated with CSS) */}
               <div className="absolute top-[30%] left-[60%] w-64 h-64 bg-red-500 rounded-full blur-[60px] opacity-70 mix-blend-screen pointer-events-none"></div>
               <div className="absolute top-[20%] left-[80%] w-48 h-48 bg-yellow-500 rounded-full blur-[40px] opacity-60 mix-blend-screen pointer-events-none"></div>
               <div className="absolute top-[70%] left-[30%] w-56 h-56 bg-orange-500 rounded-full blur-[50px] opacity-60 mix-blend-screen pointer-events-none"></div>
               <div className="absolute top-[10%] left-[20%] w-32 h-32 bg-green-500 rounded-full blur-[30px] opacity-40 mix-blend-screen pointer-events-none"></div>
            </div>
         </div>
         
         <div className="w-72 bg-[#161b22] border-l border-[#30363d] p-4 flex flex-col gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
               <h3 className="text-xs font-bold text-[#8b949e] uppercase mb-4 flex items-center gap-2"><BarChart size={14}/> UX Analytics Metrics</h3>
               <div className="space-y-4">
                   <div>
                       <div className="flex justify-between text-xs mb-1"><span>Time to First Fixation</span> <span className="font-mono text-[#58a6ff]">0.42s</span></div>
                       <div className="w-full bg-[#161b22] h-1.5 rounded overflow-hidden"><div className="bg-[#58a6ff] w-[20%] h-full"></div></div>
                   </div>
                   <div>
                       <div className="flex justify-between text-xs mb-1"><span>Average Fixation Duration</span> <span className="font-mono text-[#3fb950]">250ms</span></div>
                       <div className="w-full bg-[#161b22] h-1.5 rounded overflow-hidden"><div className="bg-[#3fb950] w-[60%] h-full"></div></div>
                   </div>
                   <div>
                       <div className="flex justify-between text-xs mb-1"><span>Saccade Amplitude</span> <span className="font-mono text-[#e3b341]">High</span></div>
                       <div className="w-full bg-[#161b22] h-1.5 rounded overflow-hidden"><div className="bg-[#e3b341] w-[80%] h-full"></div></div>
                   </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
