import React, { useState } from 'react';
import { 
  Waypoints, GitBranch, Share2, Network, GitMerge, Activity, CheckCircle2, AlertTriangle, 
  Settings2, Play, Cpu, Bot, Zap, PlusSquare, Trash2, BoxSelect, Maximize,
  Sliders, ArrowUpRight, Copy, TerminalSquare, Eye, ChevronDown, Flag, Database
} from 'lucide-react';

export default function OmniVisualScriptingEngine() {
  const [activeTab, setActiveTab] = useState('BehaviorTree'); // Custom, BehaviorTree, AppLogic, StateMachine, Execution

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0a0a] text-[#cccccc] font-sans text-xs overflow-hidden select-none">
      
      {/* 💥 ELITE TOP NAVBAR 💥 */}
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1.5 rounded border border-[#333] shadow-inner items-center gap-2">
                   <Network size={18} className="text-[#bc8cff] animate-pulse"/>
                   <span className="text-white font-black tracking-widest text-[12px] uppercase" style={{textShadow: '0 0 10px rgba(188,140,255,0.5)'}}>Omni Visual Scripting</span>
                   <span className="text-[#666] font-mono text-[9px] ml-2">Node Engine Core</span>
                </div>
                <div className="h-6 w-px bg-[#333]"></div>
                <div className="flex text-[10px] font-mono gap-5 text-[#8b949e]">
                   <span className="flex items-center gap-1"><Cpu size={12} className="text-[#58a6ff]"/> Virtual Machine: IDLE</span>
                   <span className="flex items-center gap-1"><Activity size={12} className="text-[#3fb950]"/> 0 Calls/Frame</span>
                   <span className="flex items-center gap-1"><GitBranch size={12} className="text-[#e3b341]"/> Sub-Graphs: 3</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                 <button className="px-3 py-1.5 bg-[#1a1a1a] border border-[#333] text-white rounded hover:bg-[#222] transition flex items-center gap-2 font-bold text-[10px]"><Zap size={12} className="text-[#e3b341]"/> Compile C++</button>
                 <button className={`px-5 py-1.5 bg-[#1a1a1a] text-white font-black rounded shadow-[0_0_15px_rgba(255,255,255,0.1)] transition flex items-center gap-2 text-[11px] uppercase tracking-widest border border-white/20 hover:bg-[#222]`}>
                    <Play size={12} className="text-[#3fb950]"/> Simulate Local
                 </button>
            </div>
         </div>

         {/* Meta-Module Ribbon */}
         <div className="flex px-2 bg-[#0a0a0a] border-t border-[#222]">
            <ModuleTab active={activeTab === 'BehaviorTree'} onClick={() => setActiveTab('BehaviorTree')} icon={<Bot size={12}/>} label="1. AI Behavior Tree" color="text-[#e3b341]"/>
            <ModuleTab active={activeTab === 'AppLogic'} onClick={() => setActiveTab('AppLogic')} icon={<Waypoints size={12}/>} label="2. Data-Flow Execution" color="text-[#3fb950]"/>
            <ModuleTab active={activeTab === 'StateMachine'} onClick={() => setActiveTab('StateMachine')} icon={<GitMerge size={12}/>} label="3. FSM Action Graph" color="text-[#bc8cff]"/>
            <ModuleTab active={activeTab === 'Execution'} onClick={() => setActiveTab('Execution')} icon={<Activity size={12}/>} label="4. Live Execution Visualizer" color="text-[#f85149]"/>
            <ModuleTab active={activeTab === 'GameState'} onClick={() => setActiveTab('GameState')} icon={<Database size={12}/>} label="5. Game State Vector Regedit" color="text-[#58a6ff]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-full h-full flex bg-[#050505]">

           {/* TOOLBAR */}
           <div className="w-[200px] border-r border-[#222] bg-[#111] flex flex-col custom-scrollbar z-20 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
              <div className="p-2 border-b border-[#333]">
                 <input type="text" placeholder="Search Node DB..." className="w-full bg-[#1a1a1a] border border-[#333] text-[#ccc] px-2 py-1.5 text-[10px] rounded outline-none" />
              </div>
              <div className="p-2 overflow-y-auto">
                 <NodeCategory title="Logic Events">
                    <DraggableNode label="On Initialize" icon={<Play size={10} className="text-[#3fb950]"/>}/>
                    <DraggableNode label="On Tick (Update)" icon={<RotateCw size={10} className="text-[#58a6ff]"/>}/>
                    <DraggableNode label="Sequence" icon={<Layers size={10} className="text-[#bc8cff]"/>}/>
                    <DraggableNode label="Branch (If/Else)" icon={<GitBranch size={10} className="text-[#e3b341]"/>}/>
                 </NodeCategory>
                 
                 <NodeCategory title="AI Context">
                    <DraggableNode label="Selector (Fallback)" icon={<Share2 size={10} className="text-[#888]"/>}/>
                    <DraggableNode label="Move To Location" icon={<ArrowUpRight size={10} className="text-[#3fb950]"/>}/>
                    <DraggableNode label="Check Blackboard" icon={<Database size={10} className="text-[#58a6ff]"/>}/>
                    <DraggableNode label="Wait" icon={<AlertTriangle size={10} className="text-[#e3b341]"/>}/>
                 </NodeCategory>
                 
                 <NodeCategory title="Game State Vectors">
                    <DraggableNode label="Read Flag" icon={<Flag size={10} className="text-[#f85149]"/>}/>
                    <DraggableNode label="Write Flag" icon={<PlusSquare size={10} className="text-[#3fb950]"/>}/>
                    <DraggableNode label="Trigger Event" icon={<Zap size={10} className="text-[#e3b341]"/>}/>
                 </NodeCategory>
              </div>
           </div>

           {/* MAIN WORKSPACE AREA */}
           <div className="flex-1 relative overflow-hidden flex flex-col">
              
              {activeTab === 'BehaviorTree' && (
                 <div className="w-full h-full relative" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                     
                     <div className="absolute top-4 right-4 bg-[#111] border border-[#333] p-2 rounded text-[#888] font-bold text-[9px] uppercase tracking-wider backdrop-blur bg-opacity-80">Root: AI_Guard_Agent</div>
                     
                     {/* Tree Root */}
                     <BTNode title="ROOT" type="root" x={350} y={40} color="border-[#888]" bg="bg-[#222]" />
                     
                     {/* Selectors & Sequences */}
                     <BTNode title="Selector (Main Logic)" type="composite" x={350} y={150} color="border-[#e3b341]" bg="bg-[#e3b341]/10" />
                     
                     <BTNode title="Sequence (Combat)" type="composite" x={200} y={260} color="border-[#58a6ff]" bg="bg-[#58a6ff]/10" />
                     <BTNode title="Sequence (Patrol)" type="composite" x={500} y={260} color="border-[#58a6ff]" bg="bg-[#58a6ff]/10" />
                     
                     {/* Leaves & Actions */}
                     <BTNode title="Check Health < 20" type="decorator" x={120} y={370} color="border-[#bc8cff]" bg="bg-[#bc8cff]/10" />
                     <BTNode title="Flee To Cover" type="task" x={280} y={370} color="border-[#3fb950]" bg="bg-[#3fb950]/10" />
                     
                     <BTNode title="Get Next Waypoint" type="task" x={420} y={370} color="border-[#3fb950]" bg="bg-[#3fb950]/10" />
                     <BTNode title="Move To Local" type="task" x={580} y={370} color="border-[#3fb950]" bg="bg-[#3fb950]/10" />
                     
                     <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
                         <path d="M420 80 L 420 150" stroke="#555" fill="none" strokeWidth="2" />
                         <path d="M420 190 L 270 260" stroke="#555" fill="none" strokeWidth="2" />
                         <path d="M420 190 L 570 260" stroke="#555" fill="none" strokeWidth="2" />
                         <path d="M270 300 L 190 370" stroke="#555" fill="none" strokeWidth="2" />
                         <path d="M270 300 L 350 370" stroke="#555" fill="none" strokeWidth="2" />
                         <path d="M570 300 L 490 370" stroke="#555" fill="none" strokeWidth="2" />
                         <path d="M570 300 L 650 370" stroke="#555" fill="none" strokeWidth="2" />
                     </svg>
                 </div>
              )}

              {activeTab === 'AppLogic' && (
                 <div className="w-full h-full relative" style={{ backgroundImage: 'radial-gradient(circle at center, #222 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                    <LogicNode title="Event OnTakeDamage" x={50} y={150} color="border-[#f85149]">
                       <div className="flex justify-between items-center bg-[#1a1a1a] rounded px-1 py-0.5 mt-1 border border-[#333]"><span className="text-[#888]">(Float) Damage</span><div className="w-2 h-2 rounded-full bg-[#3fb950]"></div></div>
                       <div className="flex justify-between items-center bg-[#1a1a1a] rounded px-1 py-0.5 mt-1 border border-[#333]"><span className="text-[#888]">(Instigator) HitBy</span><div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div></div>
                    </LogicNode>
                    
                    <LogicNode title="Subtract" x={250} y={150} color="border-[#3fb950]">
                       <div className="flex justify-between items-center bg-[#1a1a1a] rounded px-1 py-0.5 mt-1 border border-[#333]"><div className="w-2 h-2 rounded-full bg-[#3fb950]"></div><span className="text-[#888]">A</span></div>
                       <div className="flex justify-between items-center bg-[#1a1a1a] rounded px-1 py-0.5 mt-1 border border-[#333]"><div className="w-2 h-2 rounded-full bg-[#3fb950]"></div><span className="text-[#888]">B</span></div>
                       <div className="flex justify-end items-center bg-[#1a1a1a] rounded px-1 py-0.5 mt-2 border border-[#333]"><span className="text-[#888]">Result</span><div className="w-2 h-2 rounded-full bg-[#3fb950] ml-2"></div></div>
                    </LogicNode>

                    <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
                        <path d="M190 190 Q 220 190, 250 190" stroke="#3fb950" fill="none" strokeWidth="2" />
                        <path d="M190 160 Q 220 160, 250 215" stroke="#fff" strokeOpacity="0.3" fill="none" strokeWidth="2" />
                    </svg>
                 </div>
              )}

              {activeTab === 'Execution' && (
                 <div className="w-full h-full relative p-4 flex flex-col gap-4">
                     <div className="flex items-center gap-2 text-[#f85149] font-bold"><Activity className="animate-pulse"/> LIVE EXECUTION TRACE LOGGER</div>
                     <div className="flex-1 bg-[#111] border border-[#333] rounded overflow-y-auto font-mono text-[10px] p-2 space-y-1">
                        <div className="text-[#888]">[00:15:22.41] <span className="text-[#58a6ff]">PlayerController_BP</span> executed <span className="text-white">Event_Tick</span> (0.012ms)</div>
                        <div className="text-[#888]">[00:15:22.41] <span className="text-[#3fb950]">WeaponSystem_BP</span> variable <span className="text-[#e3b341]">CurrentAmmo</span> changed from 30 -{">"} 29</div>
                        <div className="text-[#888]">[00:15:22.42] <span className="text-[#bc8cff]">AI_Guard_Agent_BP</span> entered state <span className="text-[#f85149]">COMBAT_ENGAGE</span></div>
                        <div className="text-[#888]">[00:15:22.43] <span className="text-[#58a6ff]">PlayerController_BP</span> executed <span className="text-white">FireWeapon</span> (0.450ms) <Activity className="inline text-[#f85149] w-3 h-3"/> Warning: High Latency</div>
                     </div>
                 </div>
              )}

              {activeTab === 'GameState' && (
                  <div className="w-full h-full p-4 flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                          <div className="text-[#58a6ff] font-bold text-lg tracking-widest uppercase"><Database className="inline mr-2"/> Global Game State Flags & Variables</div>
                          <button className="bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50 px-3 py-1 rounded flex items-center gap-2"><PlusSquare size={14}/> Add Global Flag</button>
                      </div>
                      <div className="bg-[#111] border border-[#333] rounded-t p-2 grid grid-cols-4 font-bold text-[#888] uppercase tracking-wider text-[10px] ">
                          <div>Variable ID</div>
                          <div>Data Type</div>
                          <div>Current Value</div>
                          <div>Persistence</div>
                      </div>
                      <div className="flex flex-col border border-t-0 border-[#333] rounded-b bg-[#0a0a0a]">
                          <FlagRow id="MainQuest_Stage" type="Integer" val="4" persist="Save Game" />
                          <FlagRow id="HasMet_Elder_NPC" type="Boolean" val="true" persist="Save Game" color="text-[#3fb950] textShadow-glow" />
                          <FlagRow id="Session_Kills" type="Integer" val="14" persist="Session Only" color="text-[#f85149]" />
                          <FlagRow id="Current_Music_Tension" type="Float" val="0.85" persist="Transient" />
                          <FlagRow id="Player_SubFaction" type="Enum" val="MAGE_GUILD" persist="Save Game" color="text-[#bc8cff]" />
                      </div>
                  </div>
              )}

           </div>

        </div>
      </div>
    </div>
  );
}

// ------ STYLED COMPONENT HELPERS ------ //

function ModuleTab({ active, onClick, icon, label, color }) {
   return (
      <div 
         onClick={onClick}
         className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer border-t-[2px] transition-colors
         ${active ? `bg-[#111] text-white ${color.replace('text-', 'border-')}` : 'border-transparent text-[#888] hover:bg-[#1a1a1a] hover:text-[#ccc]'}`}
      >
         <span className={active ? color : 'opacity-70'}>{icon}</span> {label}
      </div>
   );
}

function NodeCategory({ title, children }) {
    return (
        <div className="mb-4">
            <div className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 flex items-center gap-1">
                <ChevronDown size={10}/> {title}
            </div>
            <div className="flex flex-col gap-1 ml-2">
                {children}
            </div>
        </div>
    );
}

function DraggableNode({ label, icon }) {
    return (
        <div className="bg-[#1a1a1a] border border-[#333] hover:border-[#555] rounded px-2 py-1 flex items-center gap-2 text-[10px] cursor-grab transition-colors">
            {icon} <span className="text-[#ccc]">{label}</span>
        </div>
    );
}

function BTNode({ title, type, x, y, color, bg }) {
    return (
        <div className={`absolute w-[140px] ${bg} border-2 ${color} rounded shadow-xl z-20 flex flex-col items-center justify-center p-2 text-center transform -translate-x-1/2`} style={{ left: x, top: y }}>
            <div className="text-white font-bold text-[10px] mb-1 leading-tight">{title}</div>
            <div className={`text-[8px] uppercase tracking-wider ${color.replace('border-', 'text-')}`}>{type}</div>
        </div>
    );
}

function LogicNode({ title, x, y, color, children }) {
    return (
        <div className={`absolute w-[180px] bg-[#111] border-t-4 ${color} border-l border-r border-b border-[#333] rounded shadow-xl z-20 overflow-hidden opacity-90`} style={{ left: x, top: y }}>
            <div className="px-2 py-1 text-[10px] font-bold text-white border-b border-[#333] flex justify-between items-center tracking-wide" style={{ backgroundColor: color.replace('border-', 'bg-').replace(']', ']/20') }}>
                {title}
            </div>
            <div className="p-2 flex flex-col font-mono text-[9px] bg-[#0a0a0a]">
                {children}
            </div>
        </div>
    );
}

function FlagRow({ id, type, val, persist, color = "text-white" }) {
    return (
        <div className="grid grid-cols-4 py-2 px-3 border-b border-[#222] text-[10px] hover:bg-[#111] transition-colors font-mono">
            <div className="text-[#58a6ff]">{id}</div>
            <div className="text-[#888]">{type}</div>
            <div className={`font-bold ${color}`}>{val}</div>
            <div className="text-[#666] uppercase text-[9px]">{persist}</div>
        </div>
    )
}
