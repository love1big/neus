import React, { useState } from 'react';
import { Target, User, Crosshair, BrainCircuit, Activity, Edit2, Play, Save, Map, Search } from 'lucide-react';

export default function AINPCBehaviorTreeEditor() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-1.5 rounded-lg shadow-lg">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">AI NPC <span className="text-yellow-400">Behavior Editor</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Behavior Trees & Utility AI</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-gray-300 px-3 py-1.5 rounded text-xs font-bold transition-colors">
             <Save size={14} /> SAVE TREE
           </button>
           <button className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-[0_0_10px_rgba(234,179,8,0.4)]">
             <Play size={14} /> TEST BEHAVIOR
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Nodes Toolbox */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <div className="relative">
               <input type="text" placeholder="Search nodes..." className="w-full bg-[#1e1e1e] border border-[#3e3e42] rounded px-3 py-1.5 pl-8 text-[10px] text-gray-200 focus:outline-none focus:border-yellow-500" />
               <Search size={12} className="absolute left-2.5 top-2 text-gray-500" />
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
             
             <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase px-2 mb-1">Composites</h4>
                  <div className="space-y-1">
                     <div className="bg-[#1a1a1c] border border-[#3e3e42] p-2 rounded text-[10px] text-gray-300 flex items-center gap-2 cursor-grab hover:border-gray-500">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> Sequence
                     </div>
                     <div className="bg-[#1a1a1c] border border-[#3e3e42] p-2 rounded text-[10px] text-gray-300 flex items-center gap-2 cursor-grab hover:border-gray-500">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> Selector (Fallback)
                     </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase px-2 mb-1">Decorators</h4>
                  <div className="space-y-1">
                     <div className="bg-[#1a1a1c] border border-[#3e3e42] p-2 rounded text-[10px] text-gray-300 flex items-center gap-2 cursor-grab hover:border-gray-500">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div> Force Success
                     </div>
                     <div className="bg-[#1a1a1c] border border-[#3e3e42] p-2 rounded text-[10px] text-gray-300 flex items-center gap-2 cursor-grab hover:border-gray-500">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div> Cooldown
                     </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase px-2 mb-1">Tasks</h4>
                  <div className="space-y-1">
                     <div className="bg-[#1a1a1c] border border-[#3e3e42] p-2 rounded text-[10px] text-gray-300 flex items-center gap-2 cursor-grab hover:border-gray-500">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Move To
                     </div>
                     <div className="bg-[#1a1a1c] border border-[#3e3e42] p-2 rounded text-[10px] text-gray-300 flex items-center gap-2 cursor-grab hover:border-gray-500">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Play Animation
                     </div>
                     <div className="bg-[#1a1a1c] border border-[#3e3e42] p-2 rounded text-[10px] text-gray-300 flex items-center gap-2 cursor-grab hover:border-gray-500">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Attack Target
                     </div>
                  </div>
                </div>
             </div>
             
           </div>
        </div>

        {/* Center: Graph Viewport */}
        <div className="flex-1 bg-[#121212] relative overflow-hidden flex items-center justify-center">
           {/* Grid */}
           <div className="absolute inset-0 z-0 opacity-20" style={{
              backgroundImage: `linear-gradient(#3e3e42 1px, transparent 1px), linear-gradient(90deg, #3e3e42 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
           }}></div>

           {/* Tree Structure */}
           <div className="relative z-10 flex flex-col items-center">
              
              <div className="bg-blue-900/40 border border-blue-500 p-3 rounded-lg flex flex-col items-center min-w-[120px] shadow-lg">
                <span className="text-[10px] text-blue-400 font-bold uppercase">Root</span>
                <span className="text-[9px] text-gray-400 mt-1">Selector</span>
              </div>
              
              <div className="w-px h-8 bg-gray-500 my-1"></div>

              <div className="flex gap-16 relative">
                 <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gray-500"></div>
                 
                 <div className="flex flex-col items-center pt-4 relative">
                   <div className="absolute top-0 left-1/2 w-px h-4 bg-gray-500"></div>
                   <div className="bg-red-900/40 border border-red-500 p-2 rounded flex flex-col items-center min-w-[100px] mb-4">
                     <span className="text-[9px] text-red-400 font-bold uppercase">Decorator</span>
                     <span className="text-[9px] text-gray-300">Is Enemy Visible?</span>
                   </div>
                   <div className="w-px h-4 bg-gray-500"></div>
                   <div className="bg-green-900/40 border border-green-500 p-3 rounded-lg flex flex-col items-center min-w-[120px]">
                     <span className="text-[10px] text-green-400 font-bold uppercase">Sequence</span>
                     <span className="text-[9px] text-gray-400 mt-1">Combat Logic</span>
                   </div>
                 </div>

                 <div className="flex flex-col items-center pt-4 relative">
                   <div className="absolute top-0 left-1/2 w-px h-4 bg-gray-500"></div>
                   <div className="bg-green-900/40 border border-green-500 p-3 rounded-lg flex flex-col items-center min-w-[120px]">
                     <span className="text-[10px] text-green-400 font-bold uppercase">Sequence</span>
                     <span className="text-[9px] text-gray-400 mt-1">Patrol Logic</span>
                   </div>
                 </div>
              </div>

           </div>
           
           <div className="absolute bottom-4 left-4 bg-[#252526]/90 border border-[#3e3e42] p-2 rounded flex gap-4 text-[10px] font-mono text-gray-400">
             <span>Blackboard: <span className="text-white">Enemy_Melee_BB</span></span>
             <span>Active Node: <span className="text-yellow-400">None</span></span>
           </div>
        </div>
        
        {/* Right: Blackboard & Details */}
        <div className="w-72 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Map size={14}/> Blackboard Keys</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
             
             <div className="flex justify-between items-center bg-[#1a1a1c] border border-[#3e3e42] p-2 rounded">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 <span className="text-[10px] text-gray-300">TargetActor</span>
               </div>
               <span className="text-[9px] text-gray-500 bg-[#333] px-1 rounded">Object</span>
             </div>
             
             <div className="flex justify-between items-center bg-[#1a1a1c] border border-[#3e3e42] p-2 rounded">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                 <span className="text-[10px] text-gray-300">PatrolLocation</span>
               </div>
               <span className="text-[9px] text-gray-500 bg-[#333] px-1 rounded">Vector3</span>
             </div>
             
             <div className="flex justify-between items-center bg-[#1a1a1c] border border-[#3e3e42] p-2 rounded">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500"></div>
                 <span className="text-[10px] text-gray-300">HasLineOfSight</span>
               </div>
               <span className="text-[9px] text-gray-500 bg-[#333] px-1 rounded">Boolean</span>
             </div>

             <button className="w-full mt-4 bg-[#333] hover:bg-[#444] border border-[#444] border-dashed text-gray-400 py-1.5 rounded text-[10px] transition-colors">
               + Add Key
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
