import React, { useState } from 'react';
import { BookOpen, Users, GitMerge, FileText, Settings, Play, Target, Network, MessageSquare, Bot, AlertTriangle, ChevronRight, Zap } from 'lucide-react';

export default function QuestDirectorEditor() {
  const [activeTab, setActiveTab] = useState('Ecology');

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f85149]/10 rounded text-[#f85149]"><Bot size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Dynamic AI Director</h2>
              <p className="text-[10px] text-[#8b949e]">Procedural Quests, Faction Ecology, and Player Profiling</p>
            </div>
         </div>

         <div className="flex gap-2 text-[11px] font-bold">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors"><Play size={12}/> Simulate 24h</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Nav */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 p-2 gap-1">
           <button onClick={() => setActiveTab('Ecology')} className={`text-left px-3 py-2 rounded text-[11px] font-bold flex items-center gap-2 ${activeTab === 'Ecology' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'}`}>
              <Network size={14}/> Faction Ecology
           </button>
           <button onClick={() => setActiveTab('Quests')} className={`text-left px-3 py-2 rounded text-[11px] font-bold flex items-center gap-2 ${activeTab === 'Quests' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'}`}>
              <BookOpen size={14}/> Quest Generators
           </button>
           <button onClick={() => setActiveTab('Profiling')} className={`text-left px-3 py-2 rounded text-[11px] font-bold flex items-center gap-2 ${activeTab === 'Profiling' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'}`}>
              <Users size={14}/> Player Profiling Models
           </button>
           <button onClick={() => setActiveTab('Dialogue')} className={`text-left px-3 py-2 rounded text-[11px] font-bold flex items-center gap-2 ${activeTab === 'Dialogue' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'}`}>
              <MessageSquare size={14}/> LLM Dialogue Prompts
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#0a0a0a] overflow-y-auto custom-scrollbar p-6">
           {activeTab === 'Ecology' && (
              <div className="max-w-4xl mx-auto space-y-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2"><Network size={20} className="text-[#3fb950]"/> Faction Ecosystem State</h3>
                 </div>

                 {/* Hex Map / Network Mock */}
                 <div className="h-64 bg-[#161b22] border border-[#30363d] rounded-lg relative overflow-hidden flex items-center justify-center p-4">
                     <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#58a6ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                     
                     <div className="relative w-full h-full max-w-lg">
                        {/* Faction A */}
                        <div className="absolute top-10 left-10 text-center animate-bounce duration-1000">
                           <div className="w-16 h-16 rounded-full bg-[#f85149]/20 border-2 border-[#f85149] mx-auto flex items-center justify-center"><Users size={24} className="text-[#f85149]"/></div>
                           <span className="text-[10px] font-bold text-white mt-1 block">Goblin Horde</span>
                           <span className="text-[9px] text-[#f85149] bg-[#f85149]/10 px-1 rounded">Power: 85%</span>
                        </div>
                        {/* Faction B */}
                        <div className="absolute top-[40%] right-10 text-center">
                           <div className="w-16 h-16 rounded-full bg-[#58a6ff]/20 border-2 border-[#58a6ff] mx-auto flex items-center justify-center"><Users size={24} className="text-[#58a6ff]"/></div>
                           <span className="text-[10px] font-bold text-white mt-1 block">City Guard</span>
                           <span className="text-[9px] text-[#58a6ff] bg-[#58a6ff]/10 px-1 rounded">Power: 42%</span>
                        </div>
                        {/* Faction C */}
                        <div className="absolute bottom-10 left-[40%] text-center">
                           <div className="w-16 h-16 rounded-full bg-[#e3b341]/20 border-2 border-[#e3b341] mx-auto flex items-center justify-center"><Users size={24} className="text-[#e3b341]"/></div>
                           <span className="text-[10px] font-bold text-white mt-1 block">Merchants Guild</span>
                           <span className="text-[9px] text-[#e3b341] bg-[#e3b341]/10 px-1 rounded">Wealth: 95%</span>
                        </div>

                        {/* Tensions */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
                           <path d="M100 80 Q 200 50 380 120" stroke="#f85149" fill="none" strokeWidth="4" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]"/>
                           <text x="240" y="70" fill="#f85149" fontSize="10" fontWeight="bold">AT WAR</text>

                           <path d="M100 120 Q 150 200 230 250" stroke="#e3b341" fill="none" strokeWidth="2" />
                           <text x="130" y="200" fill="#e3b341" fontSize="10">RAIDING</text>

                           <path d="M400 150 Q 350 200 270 250" stroke="#3fb950" fill="none" strokeWidth="2" />
                           <text x="350" y="210" fill="#3fb950" fontSize="10">TRADE AGREEMENT</text>
                        </svg>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
                       <h4 className="font-bold text-[11px] text-[#e3b341] uppercase mb-4 flex items-center gap-2"><Zap size={14}/> Emergent Event Generator</h4>
                       <div className="space-y-3">
                          <div className="border-l-2 border-[#f85149] pl-3">
                             <div className="text-[11px] font-bold text-white">Goblin Siege Initiated</div>
                             <div className="text-[10px] text-[#8b949e] mt-1">Condition Triggered: Goblin Horde Power &gt; City Guard Power * 2</div>
                             <div className="text-[10px] text-[#58a6ff] mt-1 font-mono">Action: Spawning 30 NPCs at Navigation nodes surrounding gates.</div>
                          </div>
                          <div className="border-l-2 border-[#e3b341] pl-3">
                             <div className="text-[11px] font-bold text-white">Merchant Caravan Ambush</div>
                             <div className="text-[10px] text-[#8b949e] mt-1">Condition Triggered: Merchants Wealth &gt; 90% near Goblin Territory</div>
                             <div className="text-[10px] text-[#58a6ff] mt-1 font-mono">Action: Generated radiant quest [Help Caravan] for nearby players.</div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
                       <h4 className="font-bold text-[11px] text-[#bc8cff] uppercase mb-4 flex items-center gap-2"><Target size={14}/> AI Director Variables</h4>
                       <div className="space-y-3 text-[11px]">
                          <div>
                             <div className="flex justify-between text-[#8b949e] mb-1"><span>Global Tension Level</span> <span>High (0.8)</span></div>
                             <div className="h-2 bg-[#0d1117] rounded shadow-inner overflow-hidden"><div className="h-full w-[80%] bg-[#f85149]"></div></div>
                          </div>
                          <div>
                             <div className="flex justify-between text-[#8b949e] mb-1"><span>Economy Inflation</span> <span>Stable (0.2)</span></div>
                             <div className="h-2 bg-[#0d1117] rounded shadow-inner overflow-hidden"><div className="h-full w-[20%] bg-[#3fb950]"></div></div>
                          </div>
                          <div>
                             <div className="flex justify-between text-[#8b949e] mb-1"><span>Magic Anomaly Rate</span> <span>Surging (0.95)</span></div>
                             <div className="h-2 bg-[#0d1117] rounded shadow-inner overflow-hidden"><div className="h-full w-[95%] bg-[#bc8cff]"></div></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'Profiling' && (
              <div className="max-w-4xl mx-auto space-y-6 text-[11px]">
                 <div className="flex items-start gap-4 p-4 border border-[#58a6ff]/30 bg-[#58a6ff]/10 rounded-lg">
                    <Users size={24} className="text-[#58a6ff] shrink-0 mt-1"/>
                    <div>
                       <h3 className="font-bold text-[#58a6ff] text-base mb-1">Bartle Taxonomy AI Profiler</h3>
                       <p className="text-[#c9d1d9] leading-relaxed">
                          The AI Director tracks player inputs, locations visited, dialogue choices, and kill/death ratios to assign a continuous playstyle vector. It then dynamically routes localized radiant quests and spawns loot tuned to these profiles.
                       </p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    {/* Achiever */}
                    <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg">
                       <h4 className="font-bold text-white text-sm">Achiever</h4>
                       <p className="text-[#8b949e] mt-1 mb-3">Focuses on points, levels, equipment and concrete measurements of success.</p>
                       <div className="bg-[#0d1117] p-2 rounded border border-[#30363d]">
                          <span className="text-[#3fb950] font-bold mb-1 block">AI Director Response:</span>
                          <ul className="list-disc pl-4 text-white space-y-1">
                             <li>Generates "Kill X / Collect Y" quests.</li>
                             <li>Increases probability of rare loot drops slightly after long grinds.</li>
                             <li>Highlights progression UI elements.</li>
                          </ul>
                       </div>
                    </div>
                    {/* Explorer */}
                    <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg">
                       <h4 className="font-bold text-white text-sm">Explorer</h4>
                       <p className="text-[#8b949e] mt-1 mb-3">Focuses on discovering the map, finding secrets, and understanding game lore.</p>
                       <div className="bg-[#0d1117] p-2 rounded border border-[#30363d]">
                          <span className="text-[#58a6ff] font-bold mb-1 block">AI Director Response:</span>
                          <ul className="list-disc pl-4 text-white space-y-1">
                             <li>Generates "Investigate the anomaly" quests.</li>
                             <li>Spawns hidden lore books in unvisited map sectors.</li>
                             <li>Reduces frequency of random combat encounters while wandering.</li>
                          </ul>
                       </div>
                    </div>
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
}
