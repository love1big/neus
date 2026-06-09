import React from 'react';
import { Network, Plus, Zap, Play, Search, ZoomIn, ZoomOut, Save } from 'lucide-react';

export default function NodeGraphEditor() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans relative overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-12 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Network size={16} className="text-[#bc8cff]" />
            <h2 className="text-sm font-bold text-white tracking-wide">Logic & Dialogue Graph (No-AI)</h2>
          </div>
          <div className="w-[1px] h-4 bg-[#30363d] mx-2"></div>
          <select className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-white focus:outline-none">
            <option>Quest_Main_Act1</option>
            <option>Dialogue_KingAlaric</option>
            <option>State_Machine_BossFight</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-[#21262d] rounded text-[#8b949e] transition-colors"><ZoomOut size={16} /></button>
          <span className="text-xs font-mono w-12 text-center text-[#8b949e]">100%</span>
          <button className="p-1.5 hover:bg-[#21262d] rounded text-[#8b949e] transition-colors"><ZoomIn size={16} /></button>
          <div className="w-[1px] h-4 bg-[#30363d] mx-2"></div>
          <button className="flex items-center gap-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-3 py-1.5 rounded text-xs transition-colors">
            <Save size={14} className="text-[#3fb950]"/> Save Graph
          </button>
          <button className="flex items-center gap-1.5 bg-[#2ea043] hover:bg-[#2c974b] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
            <Play size={14} fill="currentColor"/> Test Logic
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative bg-[#090b0f] overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        {/* Canvas Elements - Floating Nodes */}
        <div className="absolute inset-0 z-10 p-10">
          
          {/* Node 1 */}
          <div className="absolute left-[100px] top-[150px] w-64 bg-[#161b22] border border-[#f85149] rounded-lg shadow-2xl flex flex-col">
             <div className="h-8 bg-[#f85149]/20 border-b border-[#f85149]/30 rounded-t-lg flex items-center px-3 justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Event: On Interact</span>
                <Zap size={12} className="text-[#f85149]" />
             </div>
             <div className="p-3">
                <div className="text-xs text-[#8b949e] mb-2">Triggered when player talks to NPC.</div>
                <div className="flex justify-end mt-2">
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] text-[#8b949e]">Exec (Out)</span>
                     <div className="w-3 h-3 rounded-full border-2 border-white bg-[#0d1117]"></div>
                   </div>
                </div>
             </div>
          </div>

          {/* Connection Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
             <path d="M 356 200 C 400 200, 400 150, 450 150" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 2" className="animate-pulse" />
             <path d="M 706 180 C 750 180, 750 250, 800 250" fill="none" stroke="#58a6ff" strokeWidth="2" />
             <path d="M 706 220 C 750 220, 750 350, 800 350" fill="none" stroke="#f85149" strokeWidth="2" />
          </svg>

          {/* Node 2 */}
          <div className="absolute left-[450px] top-[100px] w-64 bg-[#161b22] border border-[#bc8cff] rounded-lg shadow-2xl flex flex-col">
             <div className="h-8 bg-[#bc8cff]/20 border-b border-[#bc8cff]/30 rounded-t-lg flex items-center px-3 justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Dialogue Node</span>
                <span className="text-[10px] bg-[#0d1117] px-1.5 rounded text-[#bc8cff]">King Alaric</span>
             </div>
             <div className="p-3">
                <textarea 
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs focus:outline-none focus:border-[#bc8cff] text-[#c9d1d9] resize-none h-20"
                  defaultValue="Brave traveler, have you found the ancient artifact in the cursed ruins?"
                ></textarea>
                
                <div className="flex flex-col gap-2 mt-4 text-[10px]">
                   <div className="flex items-center justify-between border border-[#30363d] rounded p-1.5 bg-[#0d1117]">
                      <span>Choice: Yes, I have it.</span>
                      <div className="w-3 h-3 rounded-full border-2 border-[#58a6ff] bg-[#58a6ff]"></div>
                   </div>
                   <div className="flex items-center justify-between border border-[#30363d] rounded p-1.5 bg-[#0d1117]">
                      <span>Choice: Not yet, sorry.</span>
                      <div className="w-3 h-3 rounded-full border-2 border-[#f85149] bg-[#f85149]"></div>
                   </div>
                </div>
             </div>
             <div className="absolute -left-1.5 top-[50px] w-3 h-3 rounded-full border-2 border-white bg-[#161b22]"></div>
          </div>

          {/* Node 3 */}
          <div className="absolute left-[800px] top-[200px] w-48 bg-[#161b22] border border-[#58a6ff] rounded-lg shadow-2xl flex flex-col">
             <div className="h-8 bg-[#58a6ff]/20 border-b border-[#58a6ff]/30 rounded-t-lg flex items-center px-3 justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Action: Give Item</span>
             </div>
             <div className="p-3 flex justify-center text-xs text-[#58a6ff] font-bold">
                +1000 Gold
             </div>
             <div className="absolute -left-1.5 top-[50px] w-3 h-3 rounded-full border-2 border-[#58a6ff] bg-[#161b22]"></div>
          </div>

          {/* Node 4 */}
          <div className="absolute left-[800px] top-[300px] w-48 bg-[#161b22] border border-[#f85149] rounded-lg shadow-2xl flex flex-col">
             <div className="h-8 bg-[#f85149]/20 border-b border-[#f85149]/30 rounded-t-lg flex items-center px-3 justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Action: Wait</span>
             </div>
             <div className="p-3 text-xs text-[#8b949e]">
                Objective updates.
             </div>
             <div className="absolute -left-1.5 top-[50px] w-3 h-3 rounded-full border-2 border-[#f85149] bg-[#161b22]"></div>
          </div>

        </div>

        {/* Right Click Menu Mockup */}
        <div className="absolute right-10 bottom-10 bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl w-56 flex flex-col py-2 z-30">
           <div className="px-3 pb-2 border-b border-[#30363d] relative">
              <Search size={14} className="absolute left-4 top-2 text-[#888]" />
              <input type="text" placeholder="Search nodes..." className="w-full bg-[#0d1117] border border-[#30363d] rounded px-7 py-1 text-xs focus:outline-none focus:border-[#58a6ff]" />
           </div>
           <div className="px-2 pt-2 text-[#8b949e] font-bold text-[10px] uppercase mb-1">Logic Nodes</div>
           <button className="text-left px-4 py-1 hover:bg-[#58a6ff] hover:text-white text-xs text-[#c9d1d9] transition-colors">Branch (If/Else)</button>
           <button className="text-left px-4 py-1 hover:bg-[#58a6ff] hover:text-white text-xs text-[#c9d1d9] transition-colors">Sequence</button>
           <button className="text-left px-4 py-1 hover:bg-[#58a6ff] hover:text-white text-xs text-[#c9d1d9] transition-colors">State Machine</button>
           
           <div className="px-2 pt-2 text-[#8b949e] font-bold text-[10px] uppercase mb-1 mt-1">Dialogue</div>
           <button className="text-left px-4 py-1 hover:bg-[#bc8cff] hover:text-white text-xs text-[#c9d1d9] transition-colors">Speak Text</button>
           <button className="text-left px-4 py-1 hover:bg-[#bc8cff] hover:text-white text-xs text-[#c9d1d9] transition-colors">Player Choice</button>
        </div>

      </div>
    </div>
  );
}
