import React, { useState } from 'react';
import { Network, Play, Save, Plus, MousePointer2, Settings, ChevronRight, Zap, Box, Code2, Copy, Trash2, Maximize, Move } from 'lucide-react';

export default function VisualScriptingGraph() {
  const [activeTool, setActiveTool] = useState('select');

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Top Header */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#a371f7]/20 border border-[#a371f7]/50 rounded">
            <Network className="text-[#a371f7]" size={16} />
          </div>
          <div>
            <h1 className="font-bold text-sm">Visual Blueprint Compiler</h1>
            <p className="text-[10px] text-[#8b949e]">Node-Based Game Logic Engine</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex bg-[#010409] border border-[#30363d] rounded p-0.5 gap-0.5 shadow-inner">
           <ToolBtn icon={<MousePointer2 size={14} />} active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
           <ToolBtn icon={<Move size={14} />} active={activeTool === 'pan'} onClick={() => setActiveTool('pan')} />
           <div className="w-[1px] h-4 bg-[#30363d] my-auto mx-1"></div>
           <ToolBtn icon={<Copy size={14} />} active={false} onClick={() => {}} />
           <ToolBtn icon={<Trash2 size={14} />} active={false} onClick={() => {}} />
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
             <Save size={14} /> Compile & Save
          </button>
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b] font-medium text-white">
             <Play size={14} /> Simulate Logic
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Node Library */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 z-10">
           <div className="p-2 border-b border-[#30363d] font-bold text-xs flex items-center justify-between text-[#8b949e]">
             <div className="flex items-center gap-2"><Box size={14} /> NODE LIBRARY</div>
             <button className="hover:text-white"><Plus size={14}/></button>
           </div>
           
           <div className="p-2 border-b border-[#30363d]">
              <input type="text" placeholder="Search nodes..." className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 text-xs text-white outline-none focus:border-[#58a6ff]" />
           </div>

           <div className="flex-1 overflow-y-auto p-2 space-y-3">
              <div>
                 <div className="text-[10px] font-bold text-[#8b949e] mb-1 px-1 uppercase">Events</div>
                 <div className="space-y-1">
                    <LibraryItem name="Event BeginPlay" color="#f85149" />
                    <LibraryItem name="Event Tick" color="#f85149" />
                    <LibraryItem name="On Component Hit" color="#f85149" />
                 </div>
              </div>
              <div>
                 <div className="text-[10px] font-bold text-[#8b949e] mb-1 px-1 uppercase">Logic</div>
                 <div className="space-y-1">
                    <LibraryItem name="Branch (If)" color="#d29922" />
                    <LibraryItem name="Sequence" color="#d29922" />
                    <LibraryItem name="For Loop" color="#d29922" />
                 </div>
              </div>
              <div>
                 <div className="text-[10px] font-bold text-[#8b949e] mb-1 px-1 uppercase">Actions</div>
                 <div className="space-y-1">
                    <LibraryItem name="Set Actor Location" color="#58a6ff" />
                    <LibraryItem name="Spawn Actor" color="#58a6ff" />
                    <LibraryItem name="Play Sound 2D" color="#58a6ff" />
                 </div>
              </div>
              <div>
                 <div className="text-[10px] font-bold text-[#8b949e] mb-1 px-1 uppercase">Math</div>
                 <div className="space-y-1">
                    <LibraryItem name="Add (Float)" color="#3fb950" />
                    <LibraryItem name="Multiply (Vector)" color="#3fb950" />
                    <LibraryItem name="Dot Product" color="#3fb950" />
                 </div>
              </div>
           </div>
        </div>

        {/* Center: Graph Canvas */}
        <div className="flex-1 bg-[#010409] relative overflow-hidden flex items-center justify-center">
           {/* Grid Background */}
           <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', 
              backgroundSize: '24px 24px' 
           }}></div>
           
           {/* SVG Splines */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <path d="M 220 180 C 280 180, 280 180, 350 180" fill="none" stroke="white" strokeWidth="3" className="drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
              <path d="M 500 180 C 550 180, 550 180, 620 180" fill="none" stroke="white" strokeWidth="3" className="drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
              <path d="M 500 230 C 560 230, 560 280, 620 280" fill="none" stroke="#f85149" strokeWidth="2" strokeDasharray="4" />
           </svg>

           {/* Canvas Nodes */}
           <div className="absolute inset-0 pointer-events-auto">
              
              {/* Event BeginPlay Node */}
              <div className="absolute top-[140px] left-[50px] w-48 bg-[#161b22] border border-[#f85149]/50 rounded shadow-2xl flex flex-col z-10">
                 <div className="bg-gradient-to-r from-[#f85149]/30 to-[#161b22] border-b border-[#30363d] px-3 py-2 flex items-center gap-2 rounded-t">
                    <Zap size={14} className="text-[#f85149]" />
                    <span className="text-xs font-bold text-white">Event BeginPlay</span>
                 </div>
                 <div className="p-2 py-3 flex flex-col gap-2 relative">
                    <div className="flex justify-end items-center gap-2 text-[10px] text-white">
                       <div className="absolute -right-[7px] w-3 h-3 bg-white rounded-full border-2 border-[#161b22] shadow-[0_0_5px_white]"></div>
                    </div>
                 </div>
              </div>

              {/* Branch Node */}
              <div className="absolute top-[140px] left-[350px] w-40 bg-[#161b22] border border-[#d29922]/50 rounded shadow-2xl flex flex-col z-10">
                 <div className="bg-gradient-to-r from-[#d29922]/30 to-[#161b22] border-b border-[#30363d] px-3 py-2 flex items-center gap-2 rounded-t">
                    <Network size={14} className="text-[#d29922]" />
                    <span className="text-xs font-bold text-white">Branch</span>
                 </div>
                 <div className="p-2 flex flex-col gap-3 relative">
                    {/* Inputs */}
                    <div className="flex justify-start items-center gap-2 text-[10px] text-white">
                       <div className="absolute -left-[7px] w-3 h-3 bg-white rounded-full border-2 border-[#161b22]"></div>
                    </div>
                    <div className="flex justify-start items-center gap-2 text-[10px] text-white">
                       <div className="absolute -left-[7px] w-3 h-3 bg-[#f85149] rounded-full border-2 border-[#161b22]"></div>
                       <span className="ml-2">Condition</span>
                    </div>
                    
                    {/* Outputs */}
                    <div className="flex justify-end items-center gap-2 text-[10px] text-white mt-2">
                       True
                       <div className="absolute -right-[7px] w-3 h-3 bg-white rounded-full border-2 border-[#161b22] shadow-[0_0_5px_white]"></div>
                    </div>
                    <div className="flex justify-end items-center gap-2 text-[10px] text-white">
                       False
                       <div className="absolute -right-[7px] w-3 h-3 bg-white rounded-full border-2 border-[#161b22]"></div>
                    </div>
                 </div>
              </div>

              {/* Spawn Actor Node */}
              <div className="absolute top-[140px] left-[620px] w-56 bg-[#161b22] border border-[#58a6ff]/50 rounded shadow-2xl flex flex-col z-10">
                 <div className="bg-gradient-to-r from-[#58a6ff]/30 to-[#161b22] border-b border-[#30363d] px-3 py-2 flex items-center gap-2 rounded-t">
                    <Box size={14} className="text-[#58a6ff]" />
                    <span className="text-xs font-bold text-white">Spawn Actor from Class</span>
                 </div>
                 <div className="p-2 flex flex-col gap-2 relative">
                    {/* Inputs */}
                    <div className="flex justify-start items-center gap-2 text-[10px] text-white">
                       <div className="absolute -left-[7px] w-3 h-3 bg-white rounded-full border-2 border-[#161b22]"></div>
                    </div>
                    <div className="flex justify-start items-center gap-2 text-[10px] text-white">
                       <div className="absolute -left-[7px] w-3 h-3 bg-[#a371f7] rounded-full border-2 border-[#161b22]"></div>
                       <span className="ml-2">Class</span>
                       <select className="ml-auto bg-[#0d1117] border border-[#30363d] rounded px-1 py-0.5 outline-none w-20">
                          <option>BP_Enemy</option>
                       </select>
                    </div>
                    <div className="flex justify-start items-center gap-2 text-[10px] text-white">
                       <div className="absolute -left-[7px] w-3 h-3 bg-[#d29922] rounded-full border-2 border-[#161b22]"></div>
                       <span className="ml-2">Spawn Transform</span>
                    </div>

                    {/* Outputs */}
                    <div className="flex justify-end items-center gap-2 text-[10px] text-white mt-4">
                       <div className="absolute -right-[7px] w-3 h-3 bg-white rounded-full border-2 border-[#161b22]"></div>
                    </div>
                    <div className="flex justify-end items-center gap-2 text-[10px] text-white">
                       Return Value
                       <div className="absolute -right-[7px] w-3 h-3 bg-[#58a6ff] rounded-full border-2 border-[#161b22]"></div>
                    </div>
                 </div>
              </div>

           </div>

           {/* Viewport Info Overlay */}
           <div className="absolute top-4 right-4 flex bg-[#161b22]/80 backdrop-blur rounded border border-[#30363d] p-1 text-[#8b949e]">
              <button className="px-2 py-1 text-xs hover:text-white border-r border-[#30363d] flex items-center gap-1"><Maximize size={12}/> Zoom to Fit</button>
              <div className="px-2 py-1 text-xs font-mono flex items-center gap-1 text-[#3fb950]"><Code2 size={12}/> Clean</div>
           </div>
        </div>

        {/* Right: Details Panel */}
        <div className="w-72 border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 border-b border-[#30363d] font-bold text-xs flex items-center gap-2">
             <Settings size={14} className="text-[#8b949e]" /> DETAILS
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded">
                 <div className="text-xs font-bold text-white mb-2">Selected: Branch</div>
                 <p className="text-[10px] text-[#8b949e] leading-relaxed">
                    Evaluates a boolean condition. If true, execution continues from the True pin. If false, it continues from the False pin.
                 </p>
              </div>

              <div className="space-y-3">
                 <div className="text-xs font-bold text-[#8b949e] border-b border-[#30363d] pb-1">Default Values</div>
                 
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-white">Condition</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" className="accent-[#f85149]" />
                       <span className="text-[10px] text-[#8b949e]">False</span>
                    </label>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}

function ToolBtn({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${active ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}
    >
      {icon}
    </button>
  );
}

function LibraryItem({ name, color }: { name: string, color: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#21262d] cursor-pointer group">
       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
       <span className="text-xs text-[#c9d1d9] group-hover:text-white">{name}</span>
    </div>
  );
}
