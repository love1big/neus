import React, { useState } from 'react';
import { Route, Map, Flag, Hexagon, Maximize, MousePointer2, GitCommit, Waypoints, ShieldAlert, Cpu, ZoomIn, BoxSelect, Eraser, Move, Target, Eye, Settings2} from 'lucide-react';

export default function NavMeshRouter() {
  const [activeTab, setActiveTab] = useState<'build' | 'test'>('build');
  
  return (
    <div className="flex flex-col h-full bg-[#111] text-white font-sans overflow-hidden">
      {/* Top Protocol Bar */}
      <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50">
            <Waypoints size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
              Advanced NavMesh & Pathfinding Router
            </h2>
            <p className="text-[#8b949e] text-[10px] font-mono">ASTAR ROUTES • NAVMODIFIERS • AGENT RADII • OBSTACLE AVOIDANCE</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] rounded p-1">
           <button onClick={() => setActiveTab('build')} className={`px-4 py-1 rounded text-xs font-bold transition-colors ${activeTab === 'build' ? 'bg-[#58a6ff] text-black' : 'text-[#8b949e] hover:text-white'}`}>Build Mode</button>
           <button onClick={() => setActiveTab('test')} className={`px-4 py-1 rounded text-xs font-bold transition-colors ${activeTab === 'test' ? 'bg-[#3fb950] text-black' : 'text-[#8b949e] hover:text-white'}`}>Test & Simulation</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Tools Menu */}
         <div className="w-[60px] bg-[#0d1117] border-r border-[#30363d] flex flex-col items-center py-4 gap-3 shrink-0">
             <button className="w-10 h-10 rounded flex items-center justify-center text-[#888] hover:text-white hover:bg-[#222]" title="Select">
                <MousePointer2 size={18} />
             </button>
             <button className="w-10 h-10 rounded flex items-center justify-center bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30" title="Draw NavModifier Volume">
                <BoxSelect size={18} />
             </button>
             <button className="w-10 h-10 rounded flex items-center justify-center text-[#888] hover:text-white hover:bg-[#222]" title="Add Jump Link / Fall Link">
                <GitCommit size={18} />
             </button>
             <button className="w-10 h-10 rounded flex items-center justify-center text-[#888] hover:text-white hover:bg-[#222]" title="Erase NavData">
                <Eraser size={18} />
             </button>
         </div>

         {/* Canvas Center */}
         <div className="flex-1 relative bg-black/90 overflow-hidden flex items-center justify-center">
            {/* Viewport UI Overlay */}
            <div className="absolute top-4 right-4 flex gap-2">
               <button className="bg-black/60 border border-[#30363d] p-1.5 rounded text-white flex items-center justify-center shadow-lg"><Eye size={14}/></button>
               <button className="bg-black/60 border border-[#30363d] p-1.5 rounded text-white flex items-center justify-center shadow-lg"><Settings2 size={14}/></button>
            </div>

            {/* Grid & Simulated NavMesh Projection */}
            <div className="absolute inset-0 bg-[#000] rotate-x-60 scale-150" style={{ transform: 'perspective(1000px) rotateX(60deg) scale(1.5)', transformOrigin: 'center 80%' }}>
               {/* Base Grid */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)]" style={{ backgroundSize: '50px 50px' }}></div>
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#444_1px,transparent_1px),linear-gradient(to_bottom,#444_1px,transparent_1px)]" style={{ backgroundSize: '250px 250px' }}></div>
               
               {/* NavMesh Polygons (Green/Blue) */}
               <svg className="absolute inset-0 w-full h-full opacity-60">
                  {/* Primary Nav Area */}
                  <polygon points="450,300 700,300 800,500 750,700 400,650 350,450" fill="rgba(63, 185, 80, 0.3)" stroke="#3fb950" strokeWidth="2" />
                  {/* Narrow Bridge */}
                  <polygon points="700,300 800,200 850,220 750,350" fill="rgba(63, 185, 80, 0.3)" stroke="#3fb950" strokeWidth="2" />
                  {/* Upper Platform */}
                  <polygon points="800,100 1000,100 950,200 800,200" fill="rgba(63, 185, 80, 0.3)" stroke="#3fb950" strokeWidth="2" />
                  
                  {/* NavModifier - Penalty Area (Red) */}
                  <rect x="550" y="400" width="150" height="150" fill="rgba(248, 81, 73, 0.4)" stroke="#f85149" strokeWidth="2" />
                  
                  {/* Water / Swamp Area (Blue) */}
                  <ellipse cx="400" cy="550" rx="100" ry="80" fill="rgba(88, 166, 255, 0.4)" stroke="#58a6ff" strokeWidth="2" />

                  {/* Off-Mesh Link (Jump) */}
                  <path d="M 825,210 Q 750,250 780,320" fill="none" stroke="#e3b341" strokeWidth="3" strokeDasharray="5,5" className="animate-pulse" />
                  <circle cx="825" cy="210" r="5" fill="#e3b341" />
                  <circle cx="780" cy="320" r="5" fill="#e3b341" />

                  {/* Test Route Simulation */}
                  {activeTab === 'test' && (
                     <>
                        <path d="M 400,350 L 500,350 L 520,380 L 720,380 L 800,200 L 900,150" fill="none" stroke="#bc8cff" strokeWidth="4" className="drop-shadow-[0_0_5px_rgba(188,140,255,1)]" />
                        <circle cx="400" cy="350" r="8" fill="#bc8cff" />
                        <circle cx="900" cy="150" r="8" fill="#ff7b72" />
                     </>
                  )}
               </svg>
            </div>
         </div>

         {/* Property Inspector */}
         <div className="w-[320px] bg-[#0d1117] border-l border-[#30363d] overflow-y-auto shrink-0 flex flex-col">
            <div className="p-4 border-b border-[#30363d] bg-[#161b22]">
                <h3 className="text-xs font-bold uppercase text-white flex items-center gap-2 tracking-widest"><Settings2 size={14} className="text-[#58a6ff]"/> Generation Settings</h3>
            </div>
            
            <div className="p-4 space-y-5 flex-1 custom-scrollbar overflow-y-auto">
                <div className="space-y-3">
                   <h4 className="text-[10px] text-[#8b949e] uppercase font-bold flex items-center gap-1"><Cpu size={12}/> Agent Constraints</h4>
                   <div className="space-y-2">
                       <div className="flex justify-between items-center text-[11px] text-[#c9d1d9] bg-[#161b22] px-2 py-1.5 rounded border border-[#30363d]">
                          <span>Agent Radius (cm)</span>
                          <input type="number" defaultValue="34.0" className="bg-black border border-[#444] text-[#58a6ff] w-16 px-1 text-center outline-none font-mono" />
                       </div>
                       <div className="flex justify-between items-center text-[11px] text-[#c9d1d9] bg-[#161b22] px-2 py-1.5 rounded border border-[#30363d]">
                          <span>Agent Height (cm)</span>
                          <input type="number" defaultValue="144.0" className="bg-black border border-[#444] text-[#58a6ff] w-16 px-1 text-center outline-none font-mono" />
                       </div>
                       <div className="flex justify-between items-center text-[11px] text-[#c9d1d9] bg-[#161b22] px-2 py-1.5 rounded border border-[#30363d]">
                          <span>Max Climb (cm)</span>
                          <input type="number" defaultValue="45.0" className="bg-black border border-[#444] text-[#58a6ff] w-16 px-1 text-center outline-none font-mono" />
                       </div>
                       <div className="flex justify-between items-center text-[11px] text-[#c9d1d9] bg-[#161b22] px-2 py-1.5 rounded border border-[#30363d]">
                          <span>Max Slope Angle (deg)</span>
                          <input type="number" defaultValue="44" className="bg-black border border-[#444] text-[#58a6ff] w-16 px-1 text-center outline-none font-mono" />
                       </div>
                   </div>
                </div>

                <div className="space-y-3">
                   <h4 className="text-[10px] text-[#8b949e] uppercase font-bold flex items-center gap-1"><Hexagon size={12}/> Heuristic Modifiers</h4>
                   
                   <div className="bg-[#161b22] border border-[#30363d] rounded p-2 text-[11px] space-y-1 font-mono">
                      <div className="flex justify-between p-1 bg-[#444] rounded text-white">
                         <span>NavArea_Default</span>
                         <span className="text-[#3fb950]">Cost: 1.0</span>
                      </div>
                      <div className="flex justify-between p-1 hover:bg-[#222] rounded text-[#ccc] cursor-pointer">
                         <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f85149]"></div> NavArea_Lava</span>
                         <span className="text-[#f85149]">Cost: 1000.0</span>
                      </div>
                      <div className="flex justify-between p-1 hover:bg-[#222] rounded text-[#ccc] cursor-pointer">
                         <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#e3b341]"></div> NavArea_Mud</span>
                         <span className="text-[#e3b341]">Cost: 3.5</span>
                      </div>
                      <div className="flex justify-between p-1 hover:bg-[#222] rounded text-[#ccc] cursor-pointer">
                         <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div> NavArea_Water</span>
                         <span className="text-[#58a6ff]">Cost: 4.0</span>
                      </div>
                   </div>
                   <button className="w-full text-[10px] py-1 border border-dashed border-[#555] text-[#aaa] rounded uppercase tracking-widest hover:text-white hover:border-[#aaa]">+ Add Custom Area Class</button>
                </div>

                <button className="w-full bg-[#3fb950] text-black font-bold py-2 rounded uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#3fb950]/20 hover:bg-[#2ea043] transition mt-4">
                   <Waypoints size={14}/> Rebuild NavMesh
                </button>

            </div>
         </div>

      </div>
    </div>
  );
}
