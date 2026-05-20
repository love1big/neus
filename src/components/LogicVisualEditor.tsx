import React, { useState } from 'react';
import { Puzzle, Play, Save, Settings, PlayCircle, Plus, Copy, Trash2, Hash, Type, MousePointer2, Keyboard, Zap, Database } from 'lucide-react';

export default function LogicVisualEditor() {
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3fb950]/10 rounded text-[#3fb950]"><Puzzle size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Event Sheet / Visual Logic</h2>
              <p className="text-[10px] text-[#8b949e]">No-code Action/Condition Blocks (Construct/GDevelop Style)</p>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] font-bold flex items-center gap-2 transition-colors text-[#58a6ff]"><Play size={12}/> Run Game</button>
            <button className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-[11px] font-bold flex items-center gap-2 transition-colors"><Save size={12}/> Combine Logic</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar / Globals */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117]">
              <span className="text-[11px] font-bold text-[#c9d1d9] uppercase tracking-wide">Global Variables</span>
              <button className="text-[#3fb950] hover:text-white px-1"><Plus size={14}/></button>
           </div>
           <div className="p-2 space-y-1">
              <div className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 flex items-center justify-between text-[11px]">
                 <div className="flex items-center gap-2 text-[#58a6ff]"><Hash size={12}/> Score</div>
                 <input type="number" defaultValue="0" className="w-16 bg-[#161b22] border border-[#30363d] rounded px-1 outline-none text-white text-[10px] font-mono text-right"/>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 flex items-center justify-between text-[11px]">
                 <div className="flex items-center gap-2 text-[#e3b341]"><Hash size={12}/> PlayerHealth</div>
                 <input type="number" defaultValue="100" className="w-16 bg-[#161b22] border border-[#30363d] rounded px-1 outline-none text-white text-[10px] font-mono text-right"/>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 flex items-center justify-between text-[11px]">
                 <div className="flex items-center gap-2 text-[#bc8cff]"><Type size={12}/> PlayerName</div>
                 <input type="text" defaultValue="Hero" className="w-16 bg-[#161b22] border border-[#30363d] rounded px-1 outline-none text-white text-[10px] font-mono text-right"/>
              </div>
           </div>

           <div className="p-2 mt-4 border-b border-t border-[#30363d] flex justify-between items-center bg-[#0d1117]">
              <span className="text-[11px] font-bold text-[#c9d1d9] uppercase tracking-wide">Object Instances</span>
           </div>
           <div className="p-2 space-y-1 custom-scrollbar overflow-y-auto flex-1">
              <div className="text-[11px] text-[#8b949e] flex items-center gap-2 hover:bg-[#0d1117] p-1 rounded cursor-pointer"><Puzzle size={12}/> obj_Player</div>
              <div className="text-[11px] text-[#8b949e] flex items-center gap-2 hover:bg-[#0d1117] p-1 rounded cursor-pointer"><Puzzle size={12}/> obj_Enemy</div>
              <div className="text-[11px] text-[#8b949e] flex items-center gap-2 hover:bg-[#0d1117] p-1 rounded cursor-pointer"><Puzzle size={12}/> obj_Bullet</div>
              <div className="text-[11px] text-[#8b949e] flex items-center gap-2 hover:bg-[#0d1117] p-1 rounded cursor-pointer"><Keyboard size={12}/> Keyboard</div>
              <div className="text-[11px] text-[#8b949e] flex items-center gap-2 hover:bg-[#0d1117] p-1 rounded cursor-pointer"><MousePointer2 size={12}/> Mouse</div>
           </div>
        </div>

        {/* Event Sheet Area */}
        <div className="flex-1 bg-[#0d1117] relative overflow-y-auto custom-scrollbar p-6">
           <div className="text-[#333] text-4xl font-bold tracking-widest uppercase rotate-[-10deg] opacity-20 pointer-events-none absolute right-10 bottom-20">Event Sheet</div>
           
           <div className="flex justify-between items-center mb-4">
              <span className="text-[12px] font-bold text-[#c9d1d9] px-2 border-l-2 border-[#3fb950]">GameLogic.es</span>
              <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-2 text-white"><Plus size={12}/> Add Event</button>
           </div>

           <div className="flex flex-col gap-2">
              
              {/* Event 1 */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden flex shadow-md group">
                 {/* Left Condition Box */}
                 <div className="w-1/2 border-r border-[#30363d] bg-[#0d1117]/80 hover:bg-[#21262d]/50 transition-colors p-3 flex flex-col gap-2 cursor-pointer relative">
                    <div className="absolute top-1 left-2 text-[#30363d] font-bold text-[10px]">1</div>
                    <div className="flex items-center gap-2 ml-4">
                       <Keyboard size={14} className="text-[#8b949e]"/>
                       <span className="text-[11px] font-bold text-[#c9d1d9]">Keyboard: On Key Pressed</span>
                       <span className="bg-[#f85149] text-white px-1.5 py-0.5 rounded text-[9px] font-mono shadow-[0_0_5px_#f85149]">Spacebar</span>
                    </div>
                 </div>
                 {/* Right Action Box */}
                 <div className="w-1/2 bg-[#161b22] hover:bg-[#21262d] transition-colors p-3 flex flex-col gap-2 cursor-pointer">
                    <div className="flex items-center justify-between text-[11px] group-hover:bg-[#0d1117] p-1.5 rounded -mx-1.5 -my-1.5 transition-colors">
                       <div className="flex items-center gap-2">
                          <Puzzle size={14} className="text-[#58a6ff]"/>
                          <span className="text-[#c9d1d9]"><span className="font-bold">obj_Player:</span> Set Y velocity to</span>
                          <span className="bg-[#0d1117] border border-[#30363d] text-[#e3b341] px-1.5 py-0.5 rounded text-[9px] font-mono">-500</span>
                       </div>
                       <Trash2 size={12} className="text-[#8b949e] opacity-0 group-hover:opacity-100 hover:text-red-400" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] group-hover:bg-[#0d1117] p-1.5 rounded -mx-1.5 transition-colors">
                       <div className="flex items-center gap-2">
                          <Puzzle size={14} className="text-[#e3b341]"/>
                          <span className="text-[#c9d1d9]"><span className="font-bold">Audio:</span> Play</span>
                          <span className="bg-[#0d1117] border border-[#30363d] text-[#3fb950] px-1.5 py-0.5 rounded text-[9px] font-mono">"Jump_SFX"</span>
                       </div>
                       <Trash2 size={12} className="text-[#8b949e] opacity-0 group-hover:opacity-100 hover:text-red-400" />
                    </div>
                 </div>
              </div>

              {/* Event 2 */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden flex shadow-md group">
                 {/* Left Condition Box */}
                 <div className="w-1/2 border-r border-[#30363d] bg-[#0d1117]/80 hover:bg-[#21262d]/50 transition-colors p-3 flex flex-col gap-2 cursor-pointer relative">
                    <div className="absolute top-1 left-2 text-[#30363d] font-bold text-[10px]">2</div>
                    <div className="flex items-center gap-2 ml-4">
                       <Puzzle size={14} className="text-[#58a6ff]"/>
                       <span className="text-[11px] font-bold text-[#c9d1d9]">obj_Bullet: On Collision with <span className="text-[#f85149]">obj_Enemy</span></span>
                    </div>
                 </div>
                 {/* Right Action Box */}
                 <div className="w-1/2 bg-[#161b22] hover:bg-[#21262d] transition-colors p-3 flex flex-col gap-2 cursor-pointer">
                    <div className="flex items-center justify-between text-[11px] hover:bg-[#0d1117] p-1.5 rounded -mx-1.5 -my-1.5 transition-colors">
                       <div className="flex items-center gap-2">
                          <Puzzle size={14} className="text-[#f85149]"/>
                          <span className="text-[#c9d1d9]"><span className="font-bold">obj_Enemy:</span> Destroy</span>
                       </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] hover:bg-[#0d1117] p-1.5 rounded -mx-1.5 transition-colors">
                       <div className="flex items-center gap-2">
                          <Puzzle size={14} className="text-[#58a6ff]"/>
                          <span className="text-[#c9d1d9]"><span className="font-bold">obj_Bullet:</span> Destroy</span>
                       </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] hover:bg-[#0d1117] p-1.5 rounded -mx-1.5 transition-colors">
                       <div className="flex items-center gap-2">
                          <Database size={14} className="text-[#3fb950]"/>
                          <span className="text-[#c9d1d9]"><span className="font-bold">System:</span> Add</span>
                          <span className="bg-[#0d1117] border border-[#30363d] text-[#e3b341] px-1.5 py-0.5 rounded text-[9px] font-mono">15</span>
                          <span className="text-[#c9d1d9]">to Score</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Event 3 */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden flex shadow-md opacity-70 group hover:opacity-100 transition-opacity">
                 {/* Left Condition Box */}
                 <div className="w-1/2 border-r border-[#30363d] p-3 flex flex-col items-center justify-center cursor-pointer relative bg-[#21262d]/20 hover:bg-[#21262d]/40">
                    <span className="text-[11px] font-bold text-[#8b949e] flex items-center gap-1"><Plus size={12}/> Add Condition</span>
                 </div>
                 {/* Right Action Box */}
                 <div className="w-1/2 p-3 flex flex-col items-center justify-center cursor-pointer bg-[#21262d]/10 hover:bg-[#21262d]/30">
                    <span className="text-[11px] font-bold text-[#8b949e] flex items-center gap-1"><Plus size={12}/> Add Action</span>
                 </div>
              </div>

           </div>

           {/* AI Prompt Bar */}
           <div className="mt-8 bg-[#1f6feb]/10 border border-[#58a6ff]/30 rounded-lg p-3 flex items-center gap-3">
              <Zap size={16} className="text-[#58a6ff] shrink-0" />
              <input type="text" placeholder="Generate logic: 'Make the player double jump when they are falling...'" className="w-full bg-transparent outline-none text-[#c9d1d9] text-[11px]" />
              <button className="bg-[#58a6ff] hover:bg-[#1f6feb] text-white px-3 py-1.5 rounded text-[10px] font-bold tracking-wide transition-colors shrink-0">AI Insert</button>
           </div>
        </div>
      </div>
    </div>
  );
}
