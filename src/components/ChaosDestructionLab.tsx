import React, { useState } from 'react';
import { Flame, Play, Pause, Activity, Maximize, Target, Bomb, Layers, Settings, ChevronRight } from 'lucide-react';

export default function ChaosDestructionLab() {
  const [isSimulating, setIsSimulating] = useState(false);

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-600 to-orange-600 p-1.5 rounded-lg shadow-lg">
            <Bomb size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Chaos <span className="text-red-400">Destruction Lab</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Real-time Voronoi Fracturing & Physics</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setIsSimulating(!isSimulating)} className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition-colors ${isSimulating ? 'bg-orange-600/20 text-orange-400 border border-orange-600/50' : 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.4)]'}`}>
            {isSimulating ? <Pause size={14} /> : <Play size={14} />} 
            {isSimulating ? 'PAUSE SIMULATION' : 'SIMULATE IMPACT'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Physics Parameters */}
        <div className="w-72 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Material Properties</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Geometry Fracturing</h4>
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Method</span>
                  <select className="bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-gray-200 outline-none w-28">
                    <option>Voronoi</option>
                    <option>Boolean Slicing</option>
                    <option>Clustered</option>
                  </select>
                </div>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-gray-400"><span>Cell Count</span><span>450</span></div>
                  <input type="range" min="10" max="1000" defaultValue="450" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-red-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-gray-400"><span>Noise Displacement</span><span>0.15</span></div>
                  <input type="range" min="0" max="1" step="0.01" defaultValue="0.15" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-red-500" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Structural Integrity</h4>
              <div className="space-y-2 text-[10px]">
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-gray-400"><span>Strain Threshold</span><span className="text-orange-400">High</span></div>
                  <input type="range" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-orange-500" />
                </div>
                <label className="flex items-center gap-2 text-[10px] text-gray-300 mt-2">
                  <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-red-500 focus:ring-0" /> Strain Caching
                </label>
                <label className="flex items-center gap-2 text-[10px] text-gray-300">
                  <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-red-500 focus:ring-0" /> Generate Dust Particles
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Center: 3D Viewport (Mock) */}
        <div className="flex-1 bg-[#0a0a0c] relative overflow-hidden flex items-center justify-center">
           {/* Abstract visualization of a fracturing wall */}
           <div className="relative w-[400px] h-[400px]">
             {/* Base Structure */}
             <div className={`absolute inset-0 bg-gray-700 border border-gray-600 shadow-2xl transition-all duration-700 ${isSimulating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest">Reinforced Concrete Wall</div>
             </div>

             {/* Fractured Pieces */}
             {isSimulating && Array.from({length: 40}).map((_, i) => (
               <div key={i} className="absolute bg-gray-600 border border-gray-500" style={{
                 left: `${Math.random() * 80}%`,
                 top: `${Math.random() * 80}%`,
                 width: `${Math.random() * 60 + 20}px`,
                 height: `${Math.random() * 60 + 20}px`,
                 clipPath: `polygon(${Math.random()*20}% 0%, 100% ${Math.random()*20}%, ${80+Math.random()*20}% 100%, 0% ${80+Math.random()*20}%)`,
                 transform: `translate(${(Math.random()-0.5)*300}px, ${(Math.random())*400}px) rotate(${(Math.random()-0.5)*360}deg)`,
                 transition: 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.5s',
                 opacity: 1
               }}></div>
             ))}
             
             {/* Explosion Force indicator */}
             {isSimulating && (
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500 rounded-full mix-blend-screen blur-xl opacity-0 animate-[ping_0.5s_ease-out_forwards]"></div>
             )}
           </div>

           <div className="absolute top-4 right-4 bg-[#252526]/80 backdrop-blur border border-[#3e3e42] p-3 rounded-lg flex flex-col gap-2 min-w-[200px]">
             <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase">
               <span>Solver</span>
               <span className="text-green-400 font-bold">Chaos Physics</span>
             </div>
             <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase">
               <span>Active Rigidbodies</span>
               <span className="text-white font-mono">{isSimulating ? '450' : '1'}</span>
             </div>
             <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase">
               <span>Tick Time</span>
               <span className="text-orange-400 font-mono">{isSimulating ? '12.4ms' : '0.1ms'}</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
