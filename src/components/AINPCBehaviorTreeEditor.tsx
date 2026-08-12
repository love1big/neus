import React, { useState } from 'react';
import { BrainCircuit, Play, Settings2, Target, Crosshair, MapPin, Eye, Footprints, ShieldAlert, CheckCircle, XCircle, Search, MessageSquare, Activity, User, Plus } from 'lucide-react';

export default function AINPCBehaviorTreeEditor() {
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#f85149]/20 border border-[#f85149]/50 rounded">
            <BrainCircuit className="text-[#f85149]" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">AI Behavior Tree & Perception</h1>
            <p className="text-[10px] text-[#8b949e]">Hierarchical Task Network & Sensory Subsystems</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
            <Settings2 size={14} /> Blackboard Config
          </button>
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b]">
            <Play size={14} /> Simulate AI Agent
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Blackboard (Memory) */}
        <div className="w-64 border-r border-[#30363d] flex flex-col bg-[#161b22]">
          <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] flex justify-between items-center">
            <div className="flex items-center gap-2"><Target size={14} /> BLACKBOARD (MEMORY)</div>
            <Plus size={14} className="hover:text-white cursor-pointer" />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            
            <div className="mb-4">
              <div className="text-[10px] font-bold text-[#c9d1d9] mb-1 px-2 uppercase">Object References</div>
              <div className="px-3 py-1.5 text-xs text-[#58a6ff] bg-[#0d1117] border border-[#30363d] rounded mb-1 mx-2 flex items-center gap-2">
                <User size={12} /> TargetActor (Actor)
              </div>
              <div className="px-3 py-1.5 text-xs text-[#58a6ff] bg-[#0d1117] border border-[#30363d] rounded mb-1 mx-2 flex items-center gap-2">
                <MapPin size={12} /> HomeLocation (Vector)
              </div>
              <div className="px-3 py-1.5 text-xs text-[#58a6ff] bg-[#0d1117] border border-[#30363d] rounded mb-1 mx-2 flex items-center gap-2">
                <Crosshair size={12} /> LastKnownPos (Vector)
              </div>
            </div>

            <div className="mb-4">
              <div className="text-[10px] font-bold text-[#c9d1d9] mb-1 px-2 uppercase">States & Bools</div>
              <div className="px-3 py-1.5 text-xs text-[#f85149] bg-[#0d1117] border border-[#30363d] rounded mb-1 mx-2 flex items-center gap-2">
                <ShieldAlert size={12} /> IsUnderAttack (Bool)
              </div>
              <div className="px-3 py-1.5 text-xs text-[#3fb950] bg-[#0d1117] border border-[#30363d] rounded mb-1 mx-2 flex items-center gap-2">
                <Eye size={12} /> HasLineOfSight (Bool)
              </div>
            </div>

          </div>
        </div>

        {/* Center: Node Canvas */}
        <div className="flex-1 bg-[#010409] flex flex-col relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
           
           <div className="absolute top-4 right-4 bg-[#161b22] border border-[#30363d] rounded p-3 flex gap-4 text-xs z-10 shadow-lg">
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#8b949e] rounded"></div> Selector (OR)</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#58a6ff] rounded"></div> Sequence (AND)</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#3fb950] rounded"></div> Task (Action)</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#d29922] rounded"></div> Decorator (Condition)</div>
           </div>

           {/* Tree Structure */}
           <div className="absolute inset-0 flex flex-col items-center pt-16">
              
              {/* Root */}
              <div className="bg-[#161b22] border-2 border-[#8b949e] rounded-lg p-3 w-40 text-center relative z-10">
                 <div className="font-bold text-sm">Root</div>
              </div>

              <div className="w-0.5 h-8 bg-[#30363d]"></div>

              {/* Selector */}
              <div className="bg-[#161b22] border-2 border-[#8b949e] rounded-lg p-3 w-48 text-center relative z-10">
                 <div className="text-[10px] text-[#8b949e] font-bold mb-1">SELECTOR</div>
                 <div className="font-bold text-sm">Combat / Patrol</div>
              </div>

              <div className="flex w-[600px] justify-between relative mt-8">
                 {/* Top Horizontal Line */}
                 <div className="absolute -top-8 left-[10%] right-[10%] h-0.5 bg-[#30363d]"></div>
                 <div className="absolute -top-8 left-[10%] w-0.5 h-8 bg-[#30363d]"></div>
                 <div className="absolute -top-8 left-[90%] w-0.5 h-8 bg-[#30363d]"></div>
                 <div className="absolute -top-8 left-[50%] w-0.5 h-8 bg-[#30363d]"></div>

                 {/* Branch 1: Combat Sequence */}
                 <div className="flex flex-col items-center">
                    <div className="bg-[#161b22] border-2 border-[#58a6ff] rounded-lg w-48 relative z-10 shadow-[0_0_15px_rgba(88,166,255,0.1)]">
                       <div className="bg-[#d29922]/20 border-b border-[#d29922] p-1 text-[10px] text-[#d29922] font-bold text-center">
                          (Decorator) TargetActor != null
                       </div>
                       <div className="p-3 text-center">
                          <div className="text-[10px] text-[#58a6ff] font-bold mb-1">SEQUENCE</div>
                          <div className="font-bold text-sm">Engage Target</div>
                       </div>
                    </div>
                    <div className="w-0.5 h-8 bg-[#30363d]"></div>
                    <div className="bg-[#161b22] border-2 border-[#3fb950] rounded-lg p-3 w-40 text-center relative z-10">
                       <div className="font-bold text-sm flex justify-center items-center gap-2"><Footprints size={14}/> Move To Target</div>
                    </div>
                    <div className="w-0.5 h-4 bg-[#30363d]"></div>
                    <div className="bg-[#161b22] border-2 border-[#3fb950] rounded-lg p-3 w-40 text-center relative z-10 shadow-[0_0_15px_rgba(63,185,80,0.2)]">
                       <div className="font-bold text-sm flex justify-center items-center gap-2"><Target size={14}/> Attack Target</div>
                       <div className="absolute -right-2 -top-2 bg-[#3fb950] text-black rounded-full p-0.5"><CheckCircle size={12}/></div>
                    </div>
                 </div>

                 {/* Branch 2: Investigate Sequence */}
                 <div className="flex flex-col items-center">
                    <div className="bg-[#161b22] border-2 border-[#58a6ff] rounded-lg w-48 relative z-10">
                       <div className="bg-[#d29922]/20 border-b border-[#d29922] p-1 text-[10px] text-[#d29922] font-bold text-center">
                          (Decorator) LastKnownPos != null
                       </div>
                       <div className="p-3 text-center">
                          <div className="text-[10px] text-[#58a6ff] font-bold mb-1">SEQUENCE</div>
                          <div className="font-bold text-sm">Investigate</div>
                       </div>
                    </div>
                    <div className="w-0.5 h-8 bg-[#30363d]"></div>
                    <div className="bg-[#161b22] border-2 border-[#3fb950] rounded-lg p-3 w-40 text-center relative z-10">
                       <div className="font-bold text-sm flex justify-center items-center gap-2"><Search size={14}/> Move To Last Pos</div>
                    </div>
                 </div>

                 {/* Branch 3: Patrol Sequence */}
                 <div className="flex flex-col items-center">
                    <div className="bg-[#161b22] border-2 border-[#58a6ff] rounded-lg w-48 relative z-10 opacity-70">
                       <div className="p-3 text-center">
                          <div className="text-[10px] text-[#58a6ff] font-bold mb-1">SEQUENCE</div>
                          <div className="font-bold text-sm">Idle Patrol</div>
                       </div>
                    </div>
                    <div className="w-0.5 h-8 bg-[#30363d] opacity-50"></div>
                    <div className="bg-[#161b22] border-2 border-[#3fb950] rounded-lg p-3 w-40 text-center relative z-10 opacity-70">
                       <div className="font-bold text-sm flex justify-center items-center gap-2"><MapPin size={14}/> Get Random Point</div>
                    </div>
                 </div>
                 
              </div>
           </div>
        </div>

        {/* Right: AI Perception Subsystem */}
        <div className="w-80 border-l border-[#30363d] flex flex-col bg-[#161b22]">
          <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] flex justify-between items-center">
            <div className="flex items-center gap-2"><Activity size={14} /> PERCEPTION SUBSYSTEM</div>
          </div>
          
          <div className="p-4 space-y-6 flex-1 overflow-y-auto">
             
             {/* Sight */}
             <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                   <Eye className="text-[#58a6ff]" size={16} /> Sight Config
                </div>
                <div className="space-y-3 text-xs">
                   <div>
                     <div className="text-[#8b949e] mb-1">Sight Radius (Meters)</div>
                     <input type="range" className="w-full accent-[#58a6ff]" min="1" max="100" defaultValue="45" />
                   </div>
                   <div>
                     <div className="text-[#8b949e] mb-1">Peripheral Vision Angle</div>
                     <input type="range" className="w-full accent-[#58a6ff]" min="1" max="180" defaultValue="90" />
                     <div className="text-right text-[10px] text-[#c9d1d9] mt-1">180° Cone</div>
                   </div>
                </div>
             </div>

             {/* Hearing */}
             <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                   <Activity className="text-[#3fb950]" size={16} /> Hearing Config
                </div>
                <div className="space-y-3 text-xs">
                   <div>
                     <div className="text-[#8b949e] mb-1">Hearing Range (Meters)</div>
                     <input type="range" className="w-full accent-[#3fb950]" min="1" max="100" defaultValue="60" />
                   </div>
                   <div className="flex items-center gap-2 mt-2">
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" defaultChecked />
                       <div className="w-7 h-4 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#3fb950]"></div>
                     </label>
                     <span className="text-[#8b949e]">Detect Footsteps (Tag: Noise.Step)</span>
                   </div>
                </div>
             </div>

          </div>
        </div>

      </div>
    </div>
  );
}
