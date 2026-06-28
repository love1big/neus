import React from 'react';
import { Share2, Network, GitMerge, Cpu, Play, Settings2, BoxSelect, Database, Workflow, Bot, BrainCircuit } from 'lucide-react';

export default function AIWorkflowEditor() {
  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans">
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Workflow className="text-[#3fb950] animate-pulse" size={20} />
          <span className="font-bold text-sm text-[#e6edf3]">AI Automated Workflow Engine</span>
          <span className="bg-[#3fb950]/10 text-[#3fb950] px-2 py-0.5 rounded text-[10px] border border-[#3fb950]/20 hidden sm:block">LOCAL n8n STYLE</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs hover:bg-[#30363d] transition">Templates</button>
          <button className="px-3 py-1.5 bg-[#3fb950] text-[#0d1117] font-bold rounded text-xs hover:bg-[#2ea043] transition shadow-[0_0_10px_rgba(63,185,80,0.3)] flex items-center gap-2"><Play size={12}/> Execute Workflow</button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Node Library */}
        <div className="w-[220px] bg-[#0d1117] border-r border-[#30363d] flex flex-col">
          <div className="p-3 border-b border-[#30363d]">
            <input type="text" placeholder="Search AI nodes..." className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-1.5 text-xs text-[#e6edf3] outline-none" />
          </div>
          <div className="p-3 overflow-y-auto space-y-4">
             <div>
                <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-2">Triggers</div>
                <div className="space-y-1">\n                   <NodeItem icon={<Play className="text-[#3fb950]" size={12}/>} name="Manual Trigger" />
                   <NodeItem icon={<Share2 className="text-[#e3b341]" size={12}/>} name="Webhook Receive" />
                   <NodeItem icon={<Database className="text-[#58a6ff]" size={12}/>} name="On Database Change" />
                </div>
             </div>
             <div>
                <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-2">AI Processing</div>
                <div className="space-y-1">
                   <NodeItem icon={<BrainCircuit className="text-[#bc8cff]" size={12}/>} name="LLM Inference (Offline)" />
                   <NodeItem icon={<Bot className="text-[#ff7b72]" size={12}/>} name="Vision Analysis" />
                   <NodeItem icon={<Cpu className="text-[#58a6ff]" size={12}/>} name="Code Generation" />
                </div>
             </div>
             <div>
                <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-2">Logic & Routing</div>
                <div className="space-y-1">
                   <NodeItem icon={<GitMerge className="text-[#e3b341]" size={12}/>} name="If / Else Branch" />
                   <NodeItem icon={<Network className="text-[#3fb950]" size={12}/>} name="Switch Statement" />
                   <NodeItem icon={<Settings2 className="text-[#8b949e]" size={12}/>} name="Data Mapper" />
                </div>
             </div>
          </div>
        </div>

        {/* Center: Canvas Workspace */}
        <div className="flex-1 relative bg-[#050505] overflow-hidden" style={{ backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
             {/* Mockup Canvas */}
             <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
                 <path d="M 200 150 C 250 150, 250 150, 300 150" fill="none" stroke="#58a6ff" strokeWidth="3" className="animate-pulse" />
                 <path d="M 450 150 C 500 150, 500 220, 550 220" fill="none" stroke="#bc8cff" strokeWidth="2" strokeDasharray="5,5" />
                 <path d="M 450 150 C 500 150, 500 80, 550 80" fill="none" stroke="#3fb950" strokeWidth="2" />
             </svg>
             
             {/* Trigger Node */}
             <div className="absolute top-[120px] left-[50px] w-40 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl cursor-move group hover:border-[#58a6ff] transition-colors">
                 <div className="h-6 bg-[#3fb950]/20 rounded-t-lg flex items-center px-2">
                     <Play size={10} className="text-[#3fb950] mr-2" />
                     <span className="text-[#3fb950] text-[10px] font-bold uppercase">Manual Trigger</span>
                 </div>
                 <div className="p-2 flex justify-between items-center text-[#c9d1d9] text-[10px]">
                     <span>Start</span>
                     <div className="w-3 h-3 rounded-full bg-[#58a6ff] ml-2 border-2 border-[#161b22] shadow-[0_0_8px_#58a6ff]"></div>
                 </div>
             </div>

             {/* AI Agent Node */}
             <div className="absolute top-[110px] left-[300px] w-48 bg-[#161b22] border border-[#bc8cff]/50 rounded-lg shadow-[0_0_20px_rgba(188,140,255,0.1)] cursor-move group hover:border-[#bc8cff] transition-colors">
                 <div className="h-6 bg-[#bc8cff]/20 rounded-t-lg flex items-center px-2">
                     <BrainCircuit size={10} className="text-[#bc8cff] mr-2" />
                     <span className="text-[#bc8cff] text-[10px] font-bold uppercase">LLM Offline (Llama 3.2)</span>
                 </div>
                 <div className="p-2 space-y-2">
                     <div className="flex justify-between items-center text-[#8b949e] text-[10px]">
                         <div className="flex items-center"><div className="w-3 h-3 rounded-full border-2 border-[#8b949e] mr-2"></div> Input Prompt</div>
                         <div className="flex items-center">Result <div className="w-3 h-3 rounded-full bg-[#bc8cff] ml-2 shadow-[0_0_8px_#bc8cff]"></div></div>
                     </div>
                     <div className="bg-[#0d1117] rounded p-1 text-[9px] text-[#c9d1d9] whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                         System: "You are a senior coder..."
                     </div>
                 </div>
             </div>

             {/* Action Node 1 */}
             <div className="absolute top-[50px] left-[550px] w-40 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl cursor-move group hover:border-[#3fb950] transition-colors">
                 <div className="h-6 bg-[#30363d] rounded-t-lg flex items-center px-2">
                     <BoxSelect size={10} className="text-[#c9d1d9] mr-2" />
                     <span className="text-[#c9d1d9] text-[10px] font-bold uppercase">Save File</span>
                 </div>
                 <div className="p-2 flex justify-between items-center text-[#8b949e] text-[10px]">
                     <div className="flex items-center"><div className="w-3 h-3 rounded-full border-2 border-[#3fb950] mr-2"></div> Content</div>
                 </div>
             </div>

             {/* Action Node 2 */}
             <div className="absolute top-[190px] left-[550px] w-40 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl cursor-move group hover:border-[#ff7b72] transition-colors">
                 <div className="h-6 bg-[#30363d] rounded-t-lg flex items-center px-2">
                     <Share2 size={10} className="text-[#c9d1d9] mr-2" />
                     <span className="text-[#c9d1d9] text-[10px] font-bold uppercase">Send Webhook</span>
                 </div>
                 <div className="p-2 flex justify-between items-center text-[#8b949e] text-[10px]">
                     <div className="flex items-center"><div className="w-3 h-3 rounded-full border-2 border-[#bc8cff] mr-2"></div> Payload</div>
                 </div>
             </div>
        </div>

        {/* Right Side: Properties Panel */}
        <div className="w-[260px] bg-[#0d1117] border-l border-[#30363d] flex flex-col p-4 shadow-xl z-10">
           <div className="text-white text-xs font-bold mb-4 uppercase tracking-widest border-b border-[#30363d] pb-2">Properties</div>
           <div className="text-[#8b949e] text-[10px] text-center mt-10">Select a node to view properties.</div>
        </div>
      </div>
    </div>
  );
}

function NodeItem({ icon, name }) {
   return (
      <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#161b22] border border-transparent hover:border-[#30363d] rounded cursor-grab transition-colors group">
         {icon}
         <span className="text-[#c9d1d9] text-xs font-medium group-hover:text-white">{name}</span>
      </div>
   );
}
