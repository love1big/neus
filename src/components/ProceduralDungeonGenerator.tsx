import React, { useState } from 'react';
import { Blocks, Settings, Play, RefreshCw, Layers, Grid, Save } from 'lucide-react';

export default function ProceduralDungeonGenerator() {
  const [seed, setSeed] = useState("A9B8-X1");

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-1.5 rounded-lg shadow-lg">
            <Blocks size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Procedural <span className="text-purple-400">Dungeons</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">WFC & Cellular Automata Map Gen</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 gap-2">
             <span className="text-[9px] text-gray-500 uppercase">Seed</span>
             <input type="text" value={seed} onChange={(e) => setSeed(e.target.value)} className="bg-transparent border-none outline-none text-xs font-mono text-purple-400 w-24" />
           </div>
           <button className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-gray-300 px-3 py-1.5 rounded text-xs font-bold transition-colors">
             <RefreshCw size={14} /> GENERATE
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Generation Rules */}
        <div className="w-72 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Algorithm Rules</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
             
             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Algorithm</h4>
               <select className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1.5 text-[10px] text-gray-200 outline-none">
                 <option>Wave Function Collapse (WFC)</option>
                 <option>Cellular Automata (Caves)</option>
                 <option>BSP Tree (Rooms)</option>
                 <option>Random Walk (Corridors)</option>
               </select>
             </div>

             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-pink-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Parameters</h4>
               <div className="space-y-2 text-[10px]">
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Grid Size</span><span>64x64</span></div>
                   <input type="range" defaultValue="64" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-purple-400" />
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Room Density</span><span>40%</span></div>
                   <input type="range" defaultValue="40" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-pink-400" />
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-gray-400"><span>Corridor Complexity</span><span>High</span></div>
                   <input type="range" defaultValue="80" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-pink-400" />
                 </div>
               </div>
             </div>

             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Spawn Rules</h4>
               <div className="space-y-2 text-[10px] text-gray-300">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-purple-500 focus:ring-0" /> Spawn Boss Room
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-purple-500 focus:ring-0" /> Place Locked Doors
                  </label>
               </div>
             </div>

          </div>
        </div>

        {/* Center: Map Preview */}
        <div className="flex-1 bg-[#121212] relative flex items-center justify-center overflow-hidden p-8">
           {/* Fake Dungeon Map Render */}
           <div className="w-full h-full max-w-2xl max-h-2xl bg-[#0a0a0a] border border-[#3e3e42] rounded shadow-2xl relative overflow-hidden" style={{
              backgroundImage: `linear-gradient(#1a1a1c 1px, transparent 1px), linear-gradient(90deg, #1a1a1c 1px, transparent 1px)`,
              backgroundSize: '16px 16px'
           }}>
              {/* Mock Rooms */}
              <div className="absolute top-10 left-10 w-32 h-32 bg-gray-600/50 border border-gray-400 rounded-sm"></div>
              <div className="absolute top-10 left-42 w-16 h-8 bg-gray-500/50"></div> {/* Corridor */}
              <div className="absolute top-10 left-58 w-48 h-48 bg-gray-600/50 border border-gray-400 rounded-sm flex items-center justify-center">
                 <span className="text-red-500 text-[10px] font-bold">BOSS ROOM</span>
              </div>
              <div className="absolute top-42 left-20 w-8 h-32 bg-gray-500/50"></div> {/* Corridor */}
              <div className="absolute top-74 left-10 w-40 h-24 bg-gray-600/50 border border-gray-400 rounded-sm"></div>
              
              {/* Entrances / Points of Interest */}
              <div className="absolute top-12 left-12 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              <div className="absolute top-34 left-80 w-4 h-4 bg-yellow-500 rounded-sm shadow-[0_0_10px_#eab308]"></div> {/* Chest */}
           </div>
        </div>

      </div>
    </div>
  );
}
