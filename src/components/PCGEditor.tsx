import React, { useState } from 'react';
import { Workflow, Play, Save, Settings, Layers, Box, Move, GitMerge, Mountain, Trees, Compass, Eye, Network } from 'lucide-react';

export default function PCGEditor() {
  const [activeTab, setActiveTab] = useState('Graph');
  
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ff7b72]/10 rounded text-[#ff7b72]"><Workflow size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Procedural Content Generator</h2>
              <p className="text-[10px] text-[#8b949e]">Node-based PCG rules, Biome Spawning, and Spline Operations</p>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] font-bold flex items-center gap-2 transition-colors"><Layers size={12}/> Inspect Nodes</button>
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] font-bold flex items-center gap-2 transition-colors text-[#3fb950]"><Play size={12}/> Generate Preview</button>
            <button className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-[11px] font-bold flex items-center gap-2 transition-colors"><Save size={12}/> Bake to Level</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-48 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 text-[10px] font-bold text-[#8b949e] uppercase tracking-wider border-b border-[#30363d]">Generators & Inputs</div>
           <div className="p-2 space-y-1">
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded text-[11px] flex gap-2 items-center"><Mountain size={12} className="text-[#58a6ff]"/> Surface Sampler</button>
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded text-[11px] flex gap-2 items-center"><GitMerge size={12} className="text-[#58a6ff]"/> Spline Sampler</button>
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded text-[11px] flex gap-2 items-center"><Box size={12} className="text-[#58a6ff]"/> Volume Sampler</button>
           </div>
           
           <div className="p-2 text-[10px] font-bold text-[#8b949e] uppercase tracking-wider border-b border-[#30363d] mt-2">Points Operations</div>
           <div className="p-2 space-y-1">
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#ff7b72] rounded text-[11px] flex gap-2 items-center"><Network size={12} className="text-[#ff7b72]"/> Density Filter</button>
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#ff7b72] rounded text-[11px] flex gap-2 items-center"><Move size={12} className="text-[#ff7b72]"/> Transform Points</button>
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#ff7b72] rounded text-[11px] flex gap-2 items-center"><Compass size={12} className="text-[#ff7b72]"/> Distance Check</button>
           </div>

           <div className="p-2 text-[10px] font-bold text-[#8b949e] uppercase tracking-wider border-b border-[#30363d] mt-2">Spawners</div>
           <div className="p-2 space-y-1 overflow-y-auto custom-scrollbar flex-1">
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] rounded text-[11px] flex gap-2 items-center"><Trees size={12} className="text-[#3fb950]"/> Static Mesh Spawner</button>
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] rounded text-[11px] flex gap-2 items-center"><Layers size={12} className="text-[#3fb950]"/> Actor Spawner</button>
           </div>
        </div>

        {/* Graph Area */}
        <div className="flex-1 bg-[#0d1117] relative overflow-hidden flex items-center justify-center p-10" style={{ backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
           <div className="text-[#333] text-4xl font-bold tracking-widest uppercase rotate-[-10deg] opacity-20 pointer-events-none absolute">PCG Graph Active</div>
           
           {/* Graph connection lines (mock) */}
           <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
             <path d="M 290 350 C 350 350, 350 350, 410 350" fill="none" stroke="#58a6ff" strokeWidth="3" />
             <path d="M 590 350 C 650 350, 650 350, 710 350" fill="none" stroke="#ff7b72" strokeWidth="3" />
           </svg>

           {/* Input Node */}
           <div className="absolute top-[300px] left-[100px] w-48 bg-[#161b22] border border-[#58a6ff] rounded shadow-lg overflow-hidden z-10">
              <div className="bg-[#58a6ff]/20 p-2 border-b border-[#30363d] flex items-center gap-2">
                 <Mountain size={14} className="text-[#58a6ff]"/>
                 <span className="text-[11px] font-bold text-white uppercase">Surface Sampler</span>
              </div>
              <div className="p-2">
                 <div className="flex justify-between items-center text-[10px] text-[#8b949e]">
                    <span>Points Out</span>
                    <div className="w-3 h-3 rounded-full bg-[#58a6ff] border-2 border-[#161b22] translate-x-1/2"></div>
                 </div>
              </div>
           </div>

           {/* Processing Node */}
           <div className="absolute top-[300px] left-[400px] w-52 bg-[#161b22] border border-[#ff7b72] rounded shadow-lg overflow-hidden z-10">
              <div className="bg-[#ff7b72]/20 p-2 border-b border-[#30363d] flex items-center gap-2">
                 <Network size={14} className="text-[#ff7b72]"/>
                 <span className="text-[11px] font-bold text-white uppercase">Density Filter</span>
              </div>
              <div className="p-2 space-y-2">
                 <div className="flex justify-between items-center text-[10px] text-[#8b949e]">
                    <div className="w-3 h-3 rounded-full bg-[#58a6ff] border-2 border-[#161b22] -translate-x-1/2"></div>
                    <span>Points In</span>
                 </div>
                 <div className="flex flex-col gap-1 px-1">
                    <span className="text-[9px] text-[#c9d1d9] font-bold">Lower Bound: 0.2</span>
                    <input type="range" className="w-full accent-[#ff7b72]" defaultValue="20" />
                    <span className="text-[9px] text-[#c9d1d9] font-bold mt-1">Upper Bound: 0.8</span>
                    <input type="range" className="w-full accent-[#ff7b72]" defaultValue="80" />
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-[#8b949e] pt-1">
                    <span>Points Out</span>
                    <div className="w-3 h-3 rounded-full bg-[#ff7b72] border-2 border-[#161b22] translate-x-1/2"></div>
                 </div>
              </div>
           </div>

           {/* Output Node */}
           <div className="absolute top-[300px] left-[720px] w-48 bg-[#161b22] border border-[#3fb950] rounded shadow-lg overflow-hidden z-10">
              <div className="bg-[#3fb950]/20 p-2 border-b border-[#30363d] flex items-center gap-2">
                 <Trees size={14} className="text-[#3fb950]"/>
                 <span className="text-[11px] font-bold text-white uppercase">Static Mesh Spawner</span>
              </div>
              <div className="p-2">
                 <div className="flex items-center text-[10px] text-[#8b949e] mb-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff7b72] border-2 border-[#161b22] -translate-x-1/2"></div>
                    <span className="ml-1">Points In</span>
                 </div>
                 <div className="border border-[#30363d] bg-[#0d1117] rounded p-2 text-[10px] text-[#e3b341] font-mono flex items-center gap-2">
                    <Box size={12}/> SM_PineTree_01
                 </div>
              </div>
           </div>
        </div>

        {/* Properties Panel */}
        <div className="w-72 border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 border-b border-[#30363d] flex justify-between items-center">
              <span className="font-bold text-[11px] uppercase tracking-wider text-[#8b949e]">Properties: Density Filter</span>
              <Settings size={12} className="text-[#8b949e]"/>
           </div>
           
           <div className="p-3 flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar text-[11px]">
              <div className="flex flex-col gap-1">
                 <label className="font-bold text-[#8b949e]">Filter Type</label>
                 <select className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 outline-none text-white">
                    <option>Threshold</option>
                    <option>Noise Pattern</option>
                    <option>Attribute Match</option>
                 </select>
              </div>
              <div className="flex flex-col gap-1">
                 <label className="font-bold text-[#8b949e]">Lower Bound</label>
                 <input type="number" defaultValue="0.2" step="0.1" className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 outline-none text-[#58a6ff] font-mono" />
              </div>
              <div className="flex flex-col gap-1">
                 <label className="font-bold text-[#8b949e]">Upper Bound</label>
                 <input type="number" defaultValue="0.8" step="0.1" className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 outline-none text-[#58a6ff] font-mono" />
              </div>
              <div className="flex items-center gap-2">
                 <input type="checkbox" className="accent-[#ff7b72] w-3 h-3" />
                 <span className="text-[#c9d1d9] font-bold">Invert Filter</span>
              </div>
              <div className="flex items-center gap-2">
                 <input type="checkbox" className="accent-[#ff7b72] w-3 h-3" defaultChecked />
                 <span className="text-[#c9d1d9] font-bold">Keep Points with Zero Density</span>
              </div>

              <div className="h-px bg-[#30363d] my-2"></div>

              <div className="flex flex-col gap-2">
                 <span className="font-bold text-[#e3b341] uppercase tracking-wider text-[10px]">AI Assistant</span>
                 <p className="text-[10px] text-[#8b949e]">Instruct the AI to generate a complex procedural generation graph for your biome automatically.</p>
                 <textarea className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-[10px] outline-none text-white h-16 resize-none" placeholder="'Generate a dense redwood forest with scattered rocks near water splines...'" />
                 <button className="bg-[#e3b341]/20 hover:bg-[#e3b341]/30 text-[#e3b341] py-1.5 rounded text-[10px] font-bold border border-[#e3b341]/50 transition-colors">Generate Graph</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
