import React, { useState } from 'react';
import { Cpu, MemoryStick, Search, Plus, Save, Activity, Box, Hexagon, Component, AlignLeft, Shield, AlertTriangle } from 'lucide-react';

export default function EngineCoreEditor() {
  const [activeTab, setActiveTab] = useState('Subsystems');

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#bc8cff]/10 rounded text-[#bc8cff]"><Cpu size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Engine Core Architecture</h2>
              <p className="text-[10px] text-[#8b949e]">Subsystems, ECS, Memory Pooling, and Multi-threading</p>
            </div>
         </div>

         <div className="flex gap-2 text-[11px] font-bold">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors text-[#58a6ff]"><Save size={12}/> Compile Core</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Nav */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 p-2 gap-1">
           <button onClick={() => setActiveTab('Subsystems')} className={`text-left px-3 py-2 rounded text-[11px] font-bold flex items-center gap-2 ${activeTab === 'Subsystems' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'}`}>
              <Box size={14}/> Engine Subsystems
           </button>
           <button onClick={() => setActiveTab('ECS')} className={`text-left px-3 py-2 rounded text-[11px] font-bold flex items-center gap-2 ${activeTab === 'ECS' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'}`}>
              <Component size={14}/> ECS (Entity-Component)
           </button>
           <button onClick={() => setActiveTab('Memory')} className={`text-left px-3 py-2 rounded text-[11px] font-bold flex items-center gap-2 ${activeTab === 'Memory' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'}`}>
              <MemoryStick size={14}/> Memory Management
           </button>
           <button onClick={() => setActiveTab('Threads')} className={`text-left px-3 py-2 rounded text-[11px] font-bold flex items-center gap-2 ${activeTab === 'Threads' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'}`}>
              <Activity size={14}/> Thread Scheduler
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#0a0a0a] overflow-y-auto custom-scrollbar p-6">
           
           {activeTab === 'Subsystems' && (
              <div className="max-w-4xl mx-auto space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Engine Subsystems</h3>
                    <button className="bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50 px-3 py-1 rounded text-[11px] font-bold flex items-center gap-2"><Plus size={12}/> New Subsystem</button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-3">
                       <div className="flex justify-between items-start">
                          <h4 className="font-bold text-[#58a6ff] text-sm flex items-center gap-2"><Cpu size={16}/> UGameInstanceSubsystem</h4>
                          <span className="text-[9px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded border border-[#3fb950]/30 font-bold tracking-wider">ACTIVE</span>
                       </div>
                       <p className="text-[11px] text-[#8b949e] leading-relaxed">Spans the entire lifecycle of the application. Good for persistent managers like user profiles, achievements, and global state.</p>
                       <div className="mt-auto pt-3 border-t border-[#30363d] flex justify-between items-center">
                          <span className="text-[10px] font-mono text-[#8b949e]">Registered: 4 classes</span>
                          <button className="text-[10px] text-white bg-[#21262d] px-2 py-1 rounded">Edit</button>
                       </div>
                    </div>

                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-3">
                       <div className="flex justify-between items-start">
                          <h4 className="font-bold text-[#e3b341] text-sm flex items-center gap-2"><Box size={16}/> UWorldSubsystem</h4>
                          <span className="text-[9px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded border border-[#3fb950]/30 font-bold tracking-wider">ACTIVE</span>
                       </div>
                       <p className="text-[11px] text-[#8b949e] leading-relaxed">Tied to the lifecycle of a specific World (Level). Good for level-specific managers like day/night cycles, wave spawners.</p>
                       <div className="mt-auto pt-3 border-t border-[#30363d] flex justify-between items-center">
                          <span className="text-[10px] font-mono text-[#8b949e]">Registered: 12 classes</span>
                          <button className="text-[10px] text-white bg-[#21262d] px-2 py-1 rounded">Edit</button>
                       </div>
                    </div>

                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-3">
                       <div className="flex justify-between items-start">
                          <h4 className="font-bold text-[#bc8cff] text-sm flex items-center gap-2"><Component size={16}/> ULocalPlayerSubsystem</h4>
                          <span className="text-[9px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded border border-[#3fb950]/30 font-bold tracking-wider">ACTIVE</span>
                       </div>
                       <p className="text-[11px] text-[#8b949e] leading-relaxed">Tied to a specific local player (e.g., split-screen). Manages player-specific UI states, local saves, and controller mappings.</p>
                       <div className="mt-auto pt-3 border-t border-[#30363d] flex justify-between items-center">
                          <span className="text-[10px] font-mono text-[#8b949e]">Registered: 2 classes</span>
                          <button className="text-[10px] text-white bg-[#21262d] px-2 py-1 rounded">Edit</button>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'ECS' && (
              <div className="max-w-4xl mx-auto space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Entity-Component-System (ECS)</h3>
                    <div className="flex gap-2">
                       <button className="bg-[#21262d] text-white border border-[#30363d] px-3 py-1 rounded text-[11px] font-bold flex items-center gap-2">New Component</button>
                       <button className="bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50 px-3 py-1 rounded text-[11px] font-bold flex items-center gap-2">New System</button>
                    </div>
                 </div>

                 <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
                    <table className="w-full text-[11px] text-left">
                       <thead className="bg-[#0d1117] text-[#8b949e] uppercase tracking-wider border-b border-[#30363d]">
                          <tr>
                             <th className="p-3 font-bold">System Name</th>
                             <th className="p-3 font-bold">Components Queried</th>
                             <th className="p-3 font-bold">Exec Group</th>
                             <th className="p-3 font-bold">Avg Ms / Frame</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-[#30363d]">
                          <tr className="hover:bg-[#21262d]">
                             <td className="p-3 font-bold text-[#c9d1d9]">MovementSystem</td>
                             <td className="p-3 text-[#8b949e] font-mono">[Transform, Velocity]</td>
                             <td className="p-3 text-[#58a6ff]">PrePhysics</td>
                             <td className="p-3 font-mono text-[#3fb950]">0.42 ms</td>
                          </tr>
                          <tr className="hover:bg-[#21262d]">
                             <td className="p-3 font-bold text-[#c9d1d9]">HealthSystem</td>
                             <td className="p-3 text-[#8b949e] font-mono">[Health, DamageEvent]</td>
                             <td className="p-3 text-[#e3b341]">GameLogic</td>
                             <td className="p-3 font-mono text-[#3fb950]">0.11 ms</td>
                          </tr>
                          <tr className="hover:bg-[#21262d]">
                             <td className="p-3 font-bold text-[#c9d1d9]">AiPathfindingSystem</td>
                             <td className="p-3 text-[#8b949e] font-mono">[Transform, NavAgent, Target]</td>
                             <td className="p-3 text-[#bc8cff]">AsyncTasks</td>
                             <td className="p-3 font-mono text-[#f85149]">4.50 ms</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>

                 <div className="bg-[#f85149]/10 border border-[#f85149]/30 rounded-lg p-3 flex gap-3 text-[11px]">
                     <div className="p-2 bg-[#f85149]/20 rounded h-min text-[#f85149]"><AlertTriangle size={16}/></div>
                     <div>
                        <h4 className="font-bold text-[#f85149] uppercase tracking-wide">Data Oriented Design Warning</h4>
                        <p className="text-[#c9d1d9] mt-1">Component <span className="font-mono text-[#8b949e]">NavAgent</span> size is 256 bytes, exceeding cache line size (64 bytes). Consider splitting into <span className="font-mono text-[#8b949e]">NavState</span> and <span className="font-mono text-[#8b949e]">NavConfig</span> for better SoA iteration performance.</p>
                     </div>
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
}
