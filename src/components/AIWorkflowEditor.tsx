import React, { useState } from 'react';
import { Share2, Network, GitMerge, Cpu, Play, Settings2, BoxSelect, Database, Workflow, Bot, BrainCircuit, Search, Save, History, FileText, Globe, Cloud, Code, TerminalSquare, AlertCircle, Zap, Shield, Sparkles, SlidersHorizontal, Package, RefreshCw} from 'lucide-react';

export default function AIWorkflowEditor() {
  const [activeTab, setActiveTab] = useState('editor');
  
  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans">
      {/* Top Header */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Workflow className="text-[#3fb950]" size={20} />
          <div className="flex flex-col">
             <span className="font-bold text-sm text-[#e6edf3]">Omni AI Workflow Engine</span>
             <span className="text-[10px] text-[#8b949e]">Pipeline: Auto-NPC Behavior Generation</span>
          </div>
          <div className="h-4 w-px bg-[#30363d] mx-2" />
          <div className="flex items-center gap-1 bg-[#0d1117] border border-[#30363d] rounded p-0.5">
             <button onClick={() => setActiveTab('editor')} className={`px-3 py-1 text-xs rounded transition-colors ${activeTab === 'editor' ? 'bg-[#21262d] text-white font-bold' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}>Editor</button>
             <button onClick={() => setActiveTab('executions')} className={`px-3 py-1 text-xs rounded transition-colors ${activeTab === 'executions' ? 'bg-[#21262d] text-white font-bold' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}>Executions (12)</button>
             <button onClick={() => setActiveTab('credentials')} className={`px-3 py-1 text-xs rounded transition-colors ${activeTab === 'credentials' ? 'bg-[#21262d] text-white font-bold' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}>Credentials</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs hover:bg-[#30363d] transition flex items-center gap-2 text-[#8b949e]">
            <History size={14}/> Version History
          </button>
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs hover:bg-[#30363d] transition flex items-center gap-2 text-[#8b949e]">
            <Save size={14}/> Save
          </button>
          <button className="px-4 py-1.5 bg-[#3fb950] text-[#0d1117] font-bold rounded text-xs hover:bg-[#2ea043] transition shadow-[0_0_15px_rgba(63,185,80,0.3)] flex items-center gap-2">
            <Play size={14}/> Execute Pipeline
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Node Library */}
        <div className="w-[260px] bg-[#0d1117] border-r border-[#30363d] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#30363d] bg-[#161b22]">
            <div className="relative">
               <Search className="absolute left-3 top-2.5 text-[#8b949e]" size={14} />
               <input type="text" placeholder="Search nodes, apps..." className="w-full bg-[#0d1117] border border-[#30363d] rounded-md pl-9 pr-3 py-2 text-xs text-[#e6edf3] outline-none focus:border-[#58a6ff]" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-5 hide-scrollbar">
             <div>
                <div className="text-[10px] text-[#8b949e] font-black uppercase tracking-widest mb-2 px-1 flex justify-between items-center">
                  Triggers 
                  <span className="bg-[#30363d] text-[8px] px-1.5 py-0.5 rounded">6</span>
                </div>
                <div className="space-y-1">
                   <NodeItem icon={<Play className="text-[#3fb950]" size={14}/>} name="Manual Trigger" />
                   <NodeItem icon={<Share2 className="text-[#e3b341]" size={14}/>} name="Webhook Receive" />
                   <NodeItem icon={<Database className="text-[#58a6ff]" size={14}/>} name="On Database Change" />
                   <NodeItem icon={<Globe className="text-[#bc8cff]" size={14}/>} name="HTTP Request (Polling)" />
                   <NodeItem icon={<RefreshCw className="text-[#79c0ff]" size={14}/>} name="Cron Schedule" />
                </div>
             </div>
             
             <div>
                <div className="text-[10px] text-[#8b949e] font-black uppercase tracking-widest mb-2 px-1 flex justify-between items-center">
                  AI & Logic (Offline)
                  <span className="bg-[#30363d] text-[8px] px-1.5 py-0.5 rounded">12</span>
                </div>
                <div className="space-y-1">
                   <NodeItem icon={<BrainCircuit className="text-[#bc8cff]" size={14}/>} name="LLM Inference (Local)" />
                   <NodeItem icon={<Bot className="text-[#ff7b72]" size={14}/>} name="Vision Analysis" />
                   <NodeItem icon={<Cpu className="text-[#58a6ff]" size={14}/>} name="Code Generation" />
                   <NodeItem icon={<Sparkles className="text-[#e3b341]" size={14}/>} name="Text Embeddings" />
                   <NodeItem icon={<Zap className="text-[#3fb950]" size={14}/>} name="Function Calling" />
                   <NodeItem icon={<GitMerge className="text-[#8b949e]" size={14}/>} name="Switch / If-Else" />
                   <NodeItem icon={<Network className="text-[#8b949e]" size={14}/>} name="Data Merge / Split" />
                </div>
             </div>

             <div>
                <div className="text-[10px] text-[#8b949e] font-black uppercase tracking-widest mb-2 px-1 flex justify-between items-center">
                  Game Engine Actions
                  <span className="bg-[#30363d] text-[8px] px-1.5 py-0.5 rounded">24</span>
                </div>
                <div className="space-y-1">
                   <NodeItem icon={<BoxSelect className="text-[#79c0ff]" size={14}/>} name="Spawn Entity" />
                   <NodeItem icon={<Package className="text-[#79c0ff]" size={14}/>} name="Update Component" />
                   <NodeItem icon={<Database className="text-[#79c0ff]" size={14}/>} name="Query ECS Database" />
                   <NodeItem icon={<TerminalSquare className="text-[#79c0ff]" size={14}/>} name="Execute Editor Script" />
                </div>
             </div>
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 relative bg-[#0a0c10] overflow-hidden">
          <div className="absolute inset-0" style={{ 
             backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', 
             backgroundSize: '24px 24px',
             opacity: 0.6
          }} />
          
          <div className="absolute inset-0" style={{ transform: 'scale(1)', transformOrigin: 'center' }}>
             
             {/* SVG Wires */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
               {/* Trigger -> Query ECS */}
               <path d="M 280 150 C 330 150, 320 220, 370 220" fill="none" stroke="#30363d" strokeWidth="3" />
               <path d="M 280 150 C 330 150, 320 220, 370 220" fill="none" stroke="#e6edf3" strokeWidth="1" strokeDasharray="5 5" className="animate-[dash_1s_linear_infinite]" />
               
               {/* Query ECS -> LLM Inference */}
               <path d="M 620 220 C 670 220, 680 220, 730 220" fill="none" stroke="#30363d" strokeWidth="3" />
               <path d="M 620 220 C 670 220, 680 220, 730 220" fill="none" stroke="#e6edf3" strokeWidth="1" strokeDasharray="5 5" className="animate-[dash_1s_linear_infinite]" />
               
               {/* LLM Inference -> Update Component */}
               <path d="M 980 220 C 1030 220, 1040 320, 1090 320" fill="none" stroke="#30363d" strokeWidth="3" />
               <path d="M 980 220 C 1030 220, 1040 320, 1090 320" fill="none" stroke="#3fb950" strokeWidth="1" strokeDasharray="5 5" className="animate-[dash_1s_linear_infinite]" />
             </svg>

             {/* Trigger Node */}
             <div className="absolute top-[110px] left-[60px] w-56 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl shadow-black/50 pointer-events-auto">
                <div className="p-3 border-b border-[#30363d] flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="p-1.5 bg-[#3fb950]/10 rounded text-[#3fb950]"><RefreshCw size={14} /></div>
                     <span className="text-xs font-bold text-[#e6edf3]">Cron Schedule</span>
                   </div>
                </div>
                <div className="p-3 flex flex-col gap-2 relative">
                   <div className="text-[10px] text-[#8b949e]">Runs every 5 minutes</div>
                   <div className="w-4 h-4 rounded-full border-2 border-[#161b22] bg-[#30363d] absolute -right-2 top-1/2 -translate-y-1/2" />
                </div>
             </div>

             {/* Query ECS Node */}
             <div className="absolute top-[180px] left-[370px] w-64 bg-[#161b22] border border-[#58a6ff]/50 rounded-lg shadow-xl shadow-[#58a6ff]/5 pointer-events-auto ring-1 ring-[#58a6ff]">
                <div className="p-3 border-b border-[#30363d] flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="p-1.5 bg-[#58a6ff]/10 rounded text-[#58a6ff]"><Database size={14} /></div>
                     <span className="text-xs font-bold text-[#e6edf3]">Query ECS Database</span>
                   </div>
                   <Settings2 size={14} className="text-[#8b949e] cursor-pointer hover:text-white" />
                </div>
                <div className="p-3 relative">
                   <div className="w-4 h-4 rounded-full border-2 border-[#161b22] bg-[#30363d] absolute -left-2 top-1/2 -translate-y-1/2" />
                   
                   <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 mb-2">
                      <div className="text-[10px] text-[#8b949e] mb-1">Component Filter</div>
                      <div className="text-xs font-mono text-[#79c0ff]">Has(NPCBrain) && NeedsTask(True)</div>
                   </div>
                   <div className="text-[10px] text-[#8b949e]">Outputs: array of EntityID</div>
                   
                   <div className="w-4 h-4 rounded-full border-2 border-[#161b22] bg-[#30363d] absolute -right-2 top-1/2 -translate-y-1/2" />
                </div>
             </div>

             {/* Local LLM Inference Node */}
             <div className="absolute top-[160px] left-[730px] w-64 bg-[#161b22] border border-[#bc8cff]/50 rounded-lg shadow-xl shadow-[#bc8cff]/5 pointer-events-auto">
                <div className="p-3 border-b border-[#30363d] flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="p-1.5 bg-[#bc8cff]/10 rounded text-[#bc8cff]"><BrainCircuit size={14} /></div>
                     <span className="text-xs font-bold text-[#e6edf3]">LLM Inference (Local)</span>
                   </div>
                   <Settings2 size={14} className="text-[#8b949e] cursor-pointer hover:text-white" />
                </div>
                <div className="p-3 relative flex flex-col gap-3">
                   <div className="w-4 h-4 rounded-full border-2 border-[#161b22] bg-[#30363d] absolute -left-2 top-8" />
                   
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-[#8b949e]">Model</span>
                      <select className="bg-[#0d1117] border border-[#30363d] text-xs text-white p-1.5 rounded">
                        <option>Llama-3-8B-Instruct (GGUF)</option>
                        <option>Mistral-Nemo-12B (GGUF)</option>
                      </select>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-[#8b949e]">System Prompt</span>
<textarea className="bg-[#0d1117] border border-[#30363d] text-[10px] text-white p-1.5 rounded h-16 resize-none font-mono" defaultValue='You are an NPC. Decide your next action based on world state. Return JSON: {"action": "string", "target": "vec3"}'></textarea>
                   </div>
                   
                   <div className="w-4 h-4 rounded-full border-2 border-[#161b22] bg-[#30363d] absolute -right-2 top-1/2 -translate-y-1/2" />
                </div>
             </div>

             {/* Update Component Node */}
             <div className="absolute top-[280px] left-[1090px] w-64 bg-[#161b22] border border-[#3fb950]/50 rounded-lg shadow-xl shadow-[#3fb950]/5 pointer-events-auto">
                <div className="p-3 border-b border-[#30363d] flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="p-1.5 bg-[#3fb950]/10 rounded text-[#3fb950]"><Package size={14} /></div>
                     <span className="text-xs font-bold text-[#e6edf3]">Update Component</span>
                   </div>
                </div>
                <div className="p-3 relative flex flex-col gap-3">
                   <div className="w-4 h-4 rounded-full border-2 border-[#161b22] bg-[#30363d] absolute -left-2 top-8" />
                   
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-[#8b949e]">Component Name</span>
                      <input type="text" className="bg-[#0d1117] border border-[#30363d] text-xs text-white p-1.5 rounded" value="TargetDestination" readOnly/>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-[#8b949e]">JSON Payload Mapping</span>
                      <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[10px] font-mono text-[#79c0ff]">
                        {"{{$json.target}}"}
                      </div>
                   </div>
                </div>
             </div>

          </div>
        </div>

        {/* Right Side: Execution Output / Node Properties */}
        <div className="w-[300px] bg-[#0d1117] border-l border-[#30363d] flex flex-col shrink-0">
          <div className="h-10 border-b border-[#30363d] flex items-center px-4 bg-[#161b22]">
             <span className="text-xs font-bold text-[#e6edf3]">Query ECS Database</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
             <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
                <div className="bg-[#21262d] px-3 py-1.5 text-[10px] font-bold text-[#8b949e] border-b border-[#30363d] flex justify-between">
                   PARAMETERS
                </div>
                <div className="p-3 space-y-3">
                   <div className="flex flex-col gap-1">
                     <label className="text-[10px] text-[#8b949e]">Database Connection</label>
                     <select className="bg-[#0d1117] border border-[#30363d] text-xs text-white p-1.5 rounded outline-none">
                       <option>Local In-Memory ECS</option>
                       <option>Spanner Dedicated Server</option>
                     </select>
                   </div>
                   <div className="flex flex-col gap-1">
                     <label className="text-[10px] text-[#8b949e]">World Partition ID</label>
                     <input type="text" className="bg-[#0d1117] border border-[#30363d] text-xs text-white p-1.5 rounded outline-none" placeholder="Leave blank for global" />
                   </div>
                </div>
             </div>

             <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden flex-1 flex flex-col">
                <div className="bg-[#21262d] px-3 py-1.5 text-[10px] font-bold text-[#8b949e] border-b border-[#30363d] flex justify-between items-center">
                   LAST OUTPUT 
                   <span className="text-[#3fb950] flex items-center gap-1"><Play size={10}/> 12ms</span>
                </div>
                <div className="p-3 flex-1 overflow-y-auto bg-[#0a0c10] font-mono text-[10px] text-[#e6edf3]">
                   <pre>
{JSON.stringify([
  {
    "EntityID": 48291,
    "Position": {"x": 102.5, "y": 0, "z": -45.2},
    "NPCBrain": {"state": "IDLE"}
  },
  {
    "EntityID": 48292,
    "Position": {"x": 105.0, "y": 0, "z": -48.0},
    "NPCBrain": {"state": "IDLE"}
  }
], null, 2)}
                   </pre>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NodeItem({ icon, name }: { icon: React.ReactNode, name: string }) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-[#161b22] rounded cursor-grab transition border border-transparent hover:border-[#30363d]">
      <div className="w-6 h-6 rounded bg-[#21262d] flex items-center justify-center shrink-0 border border-[#30363d]">
        {icon}
      </div>
      <span className="text-xs text-[#c9d1d9] font-medium">{name}</span>
    </div>
  );
}
