import React, { useState } from 'react';
import { Flag, Search, Plus, Save, Activity, Trash2, Edit2, Play, GitBranch, ShieldCheck } from 'lucide-react';

export default function GameStateFlagTree() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="flex h-full bg-[#0d1117] text-[#c9d1d9] font-sans">
      
      {/* Sidebar Categories */}
      <div className="w-[250px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
         <div className="p-4 border-b border-[#30363d]">
            <h2 className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
               <Flag size={18} className="text-[#3fb950]" /> Global State Flags
            </h2>
         </div>
         <div className="p-3 border-b border-[#30363d]">
            <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded px-2">
               <Search size={14} className="text-[#8b949e]"/>
               <input type="text" placeholder="Search categories..." className="bg-transparent border-none outline-none text-[#c9d1d9] text-[11px] w-full p-2" />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar text-[11px]">
            {['All', 'Story_Act1', 'Story_Act2', 'Player_Unlocks', 'World_Events', 'Combat_Tutorials', 'Achievements', 'Hidden_Secrets'].map(cat => (
               <div 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-2 rounded cursor-pointer flex justify-between items-center transition ${activeCategory === cat ? 'bg-[#58a6ff]/10 text-[#58a6ff] font-bold' : 'hover:bg-[#21262d] text-[#8b949e]'}`}
               >
                  <span>{cat.replace('_', ' ')}</span>
                  {cat !== 'All' && <span className="text-[9px] bg-[#161b22] px-1 rounded font-mono">12</span>}
               </div>
            ))}
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
         <div className="px-6 py-4 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117]">
            <div>
               <h1 className="text-lg font-bold text-white flex items-center gap-2">Viewing: {activeCategory.replace('_', ' ')}</h1>
               <p className="text-[11px] text-[#8b949e] mt-1 font-mono">Boolean and Integer flags that drive game logic and save states.</p>
            </div>
            <div className="flex items-center gap-3">
               <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-2"><Play size={14}/> Live Sim</button>
               <button className="bg-[#3fb950] hover:bg-[#2ea043] text-black px-4 py-1.5 rounded text-xs font-bold shadow-lg shadow-[#3fb950]/20 transition flex items-center gap-2"><Plus size={14}/> New Flag</button>
            </div>
         </div>

         {/* Flags Table */}
         <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0d1117]">
            <table className="w-full text-left border-collapse text-[12px]">
               <thead>
                  <tr className="border-b-2 border-[#30363d] text-[#8b949e] uppercase tracking-widest font-bold text-[10px]">
                     <th className="pb-3 pl-2 w-[40px]">Type</th>
                     <th className="pb-3 w-[250px]">Flag ID</th>
                     <th className="pb-3">Description</th>
                     <th className="pb-3 w-[150px]">Default Val</th>
                     <th className="pb-3 w-[100px] text-right pr-4">Actions</th>
                  </tr>
               </thead>
               <tbody className="font-mono">
                  
                  <tr className="border-b border-[#21262d] hover:bg-[#161b22] group transition">
                     <td className="py-3 pl-2"><div className="w-6 h-6 rounded bg-[#bc8cff]/20 text-[#bc8cff] flex items-center justify-center font-bold text-[10px]">B</div></td>
                     <td className="py-3 text-[#58a6ff]">Has_Met_Elder</td>
                     <td className="py-3 text-[#8b949e] font-sans">Triggered when player first speaks to village elder.</td>
                     <td className="py-3">
                        <select className="bg-[#21262d] border border-[#30363d] text-white rounded outline-none p-1 text-[11px]">
                           <option>False</option>
                           <option>True</option>
                        </select>
                     </td>
                     <td className="py-3 pr-4 text-right opacity-0 group-hover:opacity-100 transition">
                        <button className="text-[#8b949e] hover:text-white mx-1"><Edit2 size={14}/></button>
                        <button className="text-[#8b949e] hover:text-[#f85149] mx-1"><Trash2 size={14}/></button>
                     </td>
                  </tr>

                  <tr className="border-b border-[#21262d] hover:bg-[#161b22] group transition">
                     <td className="py-3 pl-2"><div className="w-6 h-6 rounded bg-[#e3b341]/20 text-[#e3b341] flex items-center justify-center font-bold text-[10px]">I</div></td>
                     <td className="py-3 text-[#58a6ff]">Quest_01_Stage</td>
                     <td className="py-3 text-[#8b949e] font-sans">0: Not started, 1: Accepted, 2: Collected, 3: Turned in.</td>
                     <td className="py-3">
                        <input type="number" defaultValue="0" className="w-16 bg-[#21262d] border border-[#30363d] text-white rounded outline-none p-1 text-[11px] text-center" />
                     </td>
                     <td className="py-3 pr-4 text-right opacity-0 group-hover:opacity-100 transition">
                        <button className="text-[#8b949e] hover:text-white mx-1"><Edit2 size={14}/></button>
                        <button className="text-[#8b949e] hover:text-[#f85149] mx-1"><Trash2 size={14}/></button>
                     </td>
                  </tr>

                  <tr className="border-b border-[#21262d] hover:bg-[#161b22] group transition">
                     <td className="py-3 pl-2"><div className="w-6 h-6 rounded bg-[#bc8cff]/20 text-[#bc8cff] flex items-center justify-center font-bold text-[10px]">B</div></td>
                     <td className="py-3 text-[#58a6ff]">Tutorial_Combat_Done</td>
                     <td className="py-3 text-[#8b949e] font-sans">If true, skip combat popups.</td>
                     <td className="py-3">
                        <select className="bg-[#21262d] border border-[#30363d] text-white rounded outline-none p-1 text-[11px]">
                           <option>False</option>
                           <option>True</option>
                        </select>
                     </td>
                     <td className="py-3 pr-4 text-right opacity-0 group-hover:opacity-100 transition">
                        <button className="text-[#8b949e] hover:text-white mx-1"><Edit2 size={14}/></button>
                        <button className="text-[#8b949e] hover:text-[#f85149] mx-1"><Trash2 size={14}/></button>
                     </td>
                  </tr>

               </tbody>
            </table>
         </div>
      </div>

      {/* Right Details Panel */}
      <div className="w-[300px] border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#30363d]">
             <h3 className="text-[12px] font-bold text-white uppercase tracking-widest flex items-center gap-2"><GitBranch size={16} className="text-[#bc8cff]"/> Data References</h3>
          </div>
          <div className="p-4 space-y-4">
             <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded space-y-2">
                <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-widest">Select a flag</span>
                <p className="text-[11px] text-[#c9d1d9]">Click a flag to see which scripts and blueprints read or modify it.</p>
             </div>

             <div className="pt-4 border-t border-[#30363d] space-y-2">
                <h4 className="text-[10px] font-bold text-[#3fb950] uppercase flex items-center gap-1"><ShieldCheck size={12}/> Security & Sync</h4>
                <label className="flex items-center gap-2 text-[11px]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Cloud Save Sync</label>
                <label className="flex items-center gap-2 text-[11px]"><input type="checkbox" defaultChecked className="accent-[#f85149]"/> Server-Authoritative (Anti-Cheat)</label>
             </div>
          </div>
      </div>

    </div>
  );
}
