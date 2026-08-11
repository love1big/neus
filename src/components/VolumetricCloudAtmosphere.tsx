import React, { useState } from 'react';
import { Cloud, Sun, Moon, Wind, Settings, Play, CloudRain } from 'lucide-react';

export default function VolumetricCloudAtmosphere() {
  const [timeOfDay, setTimeOfDay] = useState(12);

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-1.5 rounded-lg shadow-lg">
            <Cloud size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Volumetric <span className="text-cyan-400">Atmosphere</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Sky, Weather & Lighting Time-of-Day</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-[#1a1a1c] border border-[#3e3e42] px-3 py-1.5 rounded text-xs font-mono text-cyan-400 font-bold">
             {Math.floor(timeOfDay).toString().padStart(2, '0')}:00
           </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Weather Settings */}
        <div className="w-72 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Atmosphere</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
             
             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Time of Day</h4>
               <input type="range" min="0" max="24" step="0.1" value={timeOfDay} onChange={(e) => setTimeOfDay(Number(e.target.value))} className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-cyan-400" />
               <div className="flex justify-between text-[9px] text-gray-500">
                 <span>0:00</span><span>12:00</span><span>24:00</span>
               </div>
             </div>

             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Volumetric Clouds</h4>
               <div className="space-y-2 text-[10px]">
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Coverage</span><span>65%</span></div>
                   <input type="range" defaultValue="65" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-gray-300" />
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Density (Extinction)</span><span>0.8</span></div>
                   <input type="range" defaultValue="80" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-gray-300" />
                 </div>
               </div>
             </div>

             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Rayleigh / Mie Scattering</h4>
               <div className="space-y-2 text-[10px]">
                 <div className="flex justify-between items-center text-gray-400">
                   <span>Rayleigh (Sky Color)</span>
                   <div className="w-6 h-4 bg-blue-500 rounded border border-[#3e3e42]"></div>
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Mie (Haze/Sun Halo)</span><span>0.4</span></div>
                   <input type="range" defaultValue="40" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-blue-400" />
                 </div>
               </div>
             </div>

          </div>
        </div>

        {/* Center: Live Preview window */}
        <div className="flex-1 bg-black relative overflow-hidden flex flex-col items-center justify-center">
           {/* Fake Sky rendering based on timeOfDay */}
           <div className="absolute inset-0 transition-colors duration-1000" style={{
             background: timeOfDay > 6 && timeOfDay < 18 ? 'linear-gradient(to bottom, #3b82f6, #93c5fd)' : 'linear-gradient(to bottom, #020617, #1e1b4b)'
           }}>
              {/* Fake Sun/Moon */}
              <div className="absolute rounded-full transition-all duration-1000" style={{
                left: `${(timeOfDay / 24) * 100}%`,
                top: `${Math.sin((timeOfDay / 24) * Math.PI) * 50 + 20}%`,
                width: '60px', height: '60px',
                backgroundColor: timeOfDay > 6 && timeOfDay < 18 ? '#fef08a' : '#cbd5e1',
                boxShadow: timeOfDay > 6 && timeOfDay < 18 ? '0 0 50px rgba(253, 224, 71, 0.8)' : '0 0 30px rgba(203, 213, 225, 0.5)'
              }}></div>
              
              {/* Fake Clouds */}
              <div className="absolute top-[20%] left-[10%] w-64 h-24 bg-white/40 blur-xl rounded-full"></div>
              <div className="absolute top-[30%] right-[20%] w-96 h-32 bg-white/30 blur-2xl rounded-full"></div>
           </div>
           
           <div className="absolute bottom-4 left-4 bg-[#252526]/80 backdrop-blur border border-[#3e3e42] p-2 rounded text-[10px] font-mono text-gray-300">
             Skybox Render Path: <span className="text-cyan-400">Raymarched Volume</span>
           </div>
        </div>

      </div>
    </div>
  );
}
