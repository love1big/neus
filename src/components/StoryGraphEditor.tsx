import React, { useState } from 'react';
import { GitMerge, MessageSquare, Plus, Move, Play, Save, Settings, UserCircle, Search, Copy, Trash2, ArrowRight } from 'lucide-react';

export default function StoryGraphEditor() {
  const [activeTab, setActiveTab] = useState('Graph');
  
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ff7b72]/10 rounded text-[#ff7b72]"><MessageSquare size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Story & Dialogue Graph</h2>
              <p className="text-[10px] text-[#8b949e]">Interactive Narrative, Quests, and Non-Linear Dialogue Trees</p>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] font-bold flex items-center gap-2 transition-colors"><Search size={12}/> Find Node</button>
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] font-bold flex items-center gap-2 transition-colors text-[#3fb950]"><Play size={12}/> Simulate Chat</button>
            <button className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-[11px] font-bold flex items-center gap-2 transition-colors"><Save size={12}/> Compile</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-14 border-r border-[#30363d] bg-[#161b22] flex flex-col items-center py-2 gap-2 shrink-0 z-10">
           <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#0d1117] text-[#8b949e] hover:text-[#58a6ff] transition-colors" title="Dialogue Node"><MessageSquare size={18}/></button>
           <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#0d1117] text-[#8b949e] hover:text-[#ff7b72] transition-colors" title="Branch Option"><GitMerge size={18}/></button>
           <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#0d1117] text-[#8b949e] hover:text-[#e3b341] transition-colors" title="Event / Trigger"><Play size={18}/></button>
           <div className="w-8 h-px bg-[#30363d] my-1"></div>
           <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#0d1117] text-[#8b949e] hover:text-white transition-colors"><Move size={18}/></button>
        </div>

        {/* Blueprint Graph Area (Mock) */}
        <div className="flex-1 bg-[#0d1117] relative overflow-hidden flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
           <div className="text-[#333] text-4xl font-bold tracking-widest uppercase rotate-[-10deg] opacity-20 pointer-events-none">Story Graph Active</div>
           
           {/* Mock Nodes */}
           <div className="absolute top-20 left-20 w-64 bg-[#161b22] border border-[#ff7b72] rounded-lg shadow-xl overflow-hidden shadow-[#ff7b72]/10 z-10">
              <div className="bg-gradient-to-r from-[#ff7b72]/30 to-transparent p-2 border-b border-[#30363d] flex items-center gap-2">
                 <UserCircle size={14} className="text-[#ff7b72]"/>
                 <span className="text-[11px] font-bold text-white uppercase tracking-wider">NPC Dialog</span>
                 <span className="ml-auto text-[9px] text-[#ff7b72] font-mono">D_001</span>
              </div>
              <div className="p-3">
                 <select className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[10px] outline-none text-[#c9d1d9] mb-2 font-bold">
                    <option>NPC: Eldon the Wise</option>
                 </select>
                 <textarea className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-[11px] outline-none text-white h-20 resize-none custom-scrollbar" defaultValue="Ah, traveler! I've been waiting for you. The crystal shards have scattered across the valley. Will you help me gather them?" />
                 <div className="mt-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[9px] font-bold bg-[#30363d]/50 rounded px-2 py-1 relative">
                       <span className="text-white">Option 1: Yes, I will help.</span>
                       <div className="w-2 h-2 rounded-full border border-[#58a6ff] bg-[#0d1117] absolute -right-4 cursor-pointer"></div>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-bold bg-[#30363d]/50 rounded px-2 py-1 relative mt-1">
                       <span className="text-white">Option 2: Not right now.</span>
                       <div className="w-2 h-2 rounded-full border border-[#f85149] bg-[#0d1117] absolute -right-4 cursor-pointer"></div>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-bold bg-[#30363d]/50 rounded px-2 py-1 relative mt-1">
                       <span className="text-white">Option 3: What crystal shards?</span>
                       <div className="w-2 h-2 rounded-full border border-[#e3b341] bg-[#0d1117] absolute -right-4 cursor-pointer"></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Connection Line */}
           <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
             <path d="M 345 190 C 400 190, 400 240, 470 240" fill="none" stroke="#58a6ff" strokeWidth="2" strokeDasharray="4 2" />
             <path d="M 345 220 C 400 220, 400 340, 470 340" fill="none" stroke="#f85149" strokeWidth="2" strokeDasharray="4 2" />
             <path d="M 345 245 C 400 245, 400 480, 470 480" fill="none" stroke="#e3b341" strokeWidth="2" strokeDasharray="4 2" />
           </svg>

           {/* Option Node 1 */}
           <div className="absolute top-40 left-[470px] w-64 bg-[#161b22] border border-[#58a6ff] rounded-lg shadow-xl overflow-hidden shadow-[#58a6ff]/10 z-10">
              <div className="bg-gradient-to-r from-[#58a6ff]/30 to-transparent p-2 border-b border-[#30363d] flex items-center gap-2 relative">
                 <div className="w-2 h-2 rounded-full border border-[#58a6ff] bg-[#58a6ff] absolute -left-4"></div>
                 <MessageSquare size={14} className="text-[#58a6ff]"/>
                 <span className="text-[11px] font-bold text-white uppercase tracking-wider">Player Response</span>
              </div>
              <div className="p-3 bg-[#0d1117]/50">
                 <div className="text-[10px] text-[#58a6ff] border border-[#58a6ff]/30 bg-[#58a6ff]/10 rounded p-1 mb-2 font-mono flex items-center gap-1"><Play size={10}/> Event: AcceptQuest("GatherCrystals")</div>
                 <textarea className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-[11px] outline-none text-gray-400 h-10 resize-none" defaultValue="Excellent! Bring me 5 shards." disabled />
                 <div className="flex justify-end mt-2">
                    <div className="w-2 h-2 rounded-full border border-white bg-[#0d1117] cursor-pointer"></div>
                 </div>
              </div>
           </div>

           {/* Option Node 2 */}
           <div className="absolute top-[320px] left-[470px] w-64 bg-[#161b22] border border-[#f85149] rounded-lg shadow-xl overflow-hidden shadow-[#f85149]/10 z-10">
              <div className="bg-gradient-to-r from-[#f85149]/30 to-transparent p-2 border-b border-[#30363d] flex items-center gap-2 relative">
                 <div className="w-2 h-2 rounded-full border border-[#f85149] bg-[#f85149] absolute -left-4"></div>
                 <MessageSquare size={14} className="text-[#f85149]"/>
                 <span className="text-[11px] font-bold text-white uppercase tracking-wider">Player Response</span>
              </div>
              <div className="p-3 bg-[#0d1117]/50">
                 <div className="text-[10px] text-[#f85149] border border-[#f85149]/30 bg-[#f85149]/10 rounded p-1 mb-2 font-mono flex items-center gap-1"><Play size={10}/> Event: EndDialogue()</div>
                 <textarea className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-[11px] outline-none text-gray-400 h-10 resize-none" defaultValue="Fine. Return when you are ready." disabled />
                 <div className="flex justify-end mt-2">
                    <div className="w-2 h-2 rounded-full border border-white bg-[#0d1117] cursor-pointer"></div>
                 </div>
              </div>
           </div>

           {/* Option Node 3 */}
           <div className="absolute top-[480px] left-[470px] w-64 bg-[#161b22] border border-[#e3b341] rounded-lg shadow-xl overflow-hidden shadow-[#e3b341]/10 z-10">
              <div className="bg-gradient-to-r from-[#e3b341]/30 to-transparent p-2 border-b border-[#30363d] flex items-center gap-2 relative">
                 <div className="w-2 h-2 rounded-full border border-[#e3b341] bg-[#e3b341] absolute -left-4"></div>
                 <MessageSquare size={14} className="text-[#e3b341]"/>
                 <span className="text-[11px] font-bold text-white uppercase tracking-wider">Player Response</span>
              </div>
              <div className="p-3 bg-[#0d1117]/50">
                 <div className="text-[10px] text-[#e3b341] border border-[#e3b341]/30 bg-[#e3b341]/10 rounded p-1 mb-2 font-mono flex items-center gap-1"><Play size={10}/> Event: GiveInfo("Crystals")</div>
                 <textarea className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-[11px] outline-none text-gray-400 h-10 resize-none" defaultValue="They are ancient artifacts scattered across the realm." disabled />
                 <div className="flex justify-end mt-2">
                    <div className="w-2 h-2 rounded-full border border-white bg-[#0d1117] cursor-pointer"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Properties Panel */}
        <div className="w-72 border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 border-b border-[#30363d] flex font-bold text-[11px] uppercase tracking-wider text-[#8b949e]">
              Node Properties
           </div>
           <div className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-[#8b949e]">Node ID</label>
                 <input type="text" className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px] outline-none text-white font-mono" defaultValue="D_001" />
              </div>
              <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-[#8b949e]">Speaker</label>
                 <div className="flex gap-1">
                   <select className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px] outline-none text-[#c9d1d9]">
                      <option>Eldon the Wise (NPC)</option>
                   </select>
                   <button className="bg-[#21262d] border border-[#30363d] rounded px-2 hover:bg-[#30363d]"><Plus size={12} className="text-white"/></button>
                 </div>
              </div>
              <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-[#8b949e]">Dialogue Text</label>
                 <textarea className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-[11px] outline-none text-white h-24 resize-none" defaultValue="Ah, traveler! I've been waiting for you. The crystal shards have scattered across the valley. Will you help me gather them?" />
                 <button className="bg-[#bc8cff]/10 text-[#bc8cff] border border-[#bc8cff]/30 rounded py-1 text-[10px] font-bold mt-1">✨ Write with AI</button>
              </div>

              <div className="h-px bg-[#30363d] my-2"></div>
              
              <div className="flex justify-between items-center mb-1">
                 <label className="text-[10px] font-bold text-[#8b949e]">Conditions & Events</label>
                 <button className="text-[#3fb950] hover:text-white"><Plus size={12}/></button>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] p-2 rounded text-[10px] flex justify-between items-center">
                 <span className="text-[#e3b341]">HasItem("Map", 1)</span>
                 <Trash2 size={10} className="text-red-400 cursor-pointer hover:text-white"/>
              </div>

              {/* Translation/Localization */}
              <div className="mt-auto pt-4">
                 <label className="text-[10px] font-bold text-[#8b949e] mb-1 block">Localization</label>
                 <div className="flex gap-2">
                    <select className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[10px] outline-none text-[#c9d1d9]">
                       <option>English</option><option>Spanish</option><option>Japanese</option>
                    </select>
                    <button className="bg-[#21262d] border border-[#30363d] rounded px-2 text-[10px] font-bold hover:bg-[#30363d]">Auto-Translate</button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
