import React, { useState } from 'react';
import { User, Skull, Target, MessageSquare, Scroll, Crosshair, Heart, Shield, Zap, Search, Plus, List, Route, Activity, Save } from 'lucide-react';

export default function MapEntityEditor() {
  const [activeTab, setActiveTab] = useState('npcs');

  return (
    <div className="absolute inset-x-0 inset-y-0 z-30 pointer-events-auto bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <div className="w-[300px] border-r border-[#2a2b3d] bg-[#11111b] flex flex-col shadow-xl z-20 relative">
        <div className="p-4 border-b border-[#2a2b3d]">
          <h2 className="text-sm font-bold text-[#ffa657] flex items-center gap-2 mb-2">
             <User size={16} /> NPC & Quests Engine
          </h2>
          <p className="text-[10px] text-gray-400 leading-tight">Advanced character linkage, AI behaviors, and quest scripting.</p>
        </div>

        <div className="flex border-b border-[#2a2b3d]">
           <button onClick={() => setActiveTab('npcs')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === 'npcs' ? 'border-[#ffa657] text-[#ffa657]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>NPCs</button>
           <button onClick={() => setActiveTab('quests')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === 'quests' ? 'border-[#d2a8ff] text-[#d2a8ff]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Quests</button>
           <button onClick={() => setActiveTab('factions')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === 'factions' ? 'border-[#ff7b72] text-[#ff7b72]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Factions</button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2">
           {activeTab === 'npcs' && (
              <>
                 <div className="relative mb-2">
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                   <input type="text" placeholder="Search NPCs..." className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded text-xs text-white pl-8 pr-3 py-2 focus:outline-none focus:border-[#ffa657]" />
                 </div>
                 <button className="w-full bg-[#ffa657]/10 hover:bg-[#ffa657]/20 text-[#ffa657] border border-[#ffa657]/30 py-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 mb-2">
                    <Plus size={14} /> Create New NPC
                 </button>
                 
                 <div className="bg-[#1a1a24] border border-[#ffa657]/30 rounded p-2 flex items-center gap-3 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#ffa657]/20 flex items-center justify-center text-[#ffa657]"><User size={16}/></div>
                    <div className="flex-1">
                       <h4 className="text-xs font-bold text-white">Captain Aldous</h4>
                       <p className="text-[10px] text-gray-400">Quest Giver • Guard</p>
                    </div>
                 </div>
                 <div className="bg-[#1a1a24] border border-[#2a2b3d] rounded p-2 flex items-center gap-3 cursor-pointer hover:border-gray-500">
                    <div className="w-8 h-8 rounded-full bg-[#ff7b72]/20 flex items-center justify-center text-[#ff7b72]"><Skull size={16}/></div>
                    <div className="flex-1">
                       <h4 className="text-xs font-bold text-white">Bandit Leader</h4>
                       <p className="text-[10px] text-gray-400">Hostile • Boss</p>
                    </div>
                 </div>
                 <div className="bg-[#1a1a24] border border-[#2a2b3d] rounded p-2 flex items-center gap-3 cursor-pointer hover:border-gray-500">
                    <div className="w-8 h-8 rounded-full bg-[#3fb950]/20 flex items-center justify-center text-[#3fb950]"><MessageSquare size={16}/></div>
                    <div className="flex-1">
                       <h4 className="text-xs font-bold text-white">Merchant Lyra</h4>
                       <p className="text-[10px] text-gray-400">Trader • Civilian</p>
                    </div>
                 </div>
              </>
           )}
           {activeTab === 'quests' && (
              <>
                 <button className="w-full bg-[#d2a8ff]/10 hover:bg-[#d2a8ff]/20 text-[#d2a8ff] border border-[#d2a8ff]/30 py-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 mb-2">
                    <Plus size={14} /> New Quest Line
                 </button>
                 <div className="bg-[#1a1a24] border border-[#d2a8ff]/30 rounded p-2 cursor-pointer">
                    <h4 className="text-xs font-bold text-white">The Lost Artifact</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Main Story • Level 5</p>
                 </div>
                 <div className="bg-[#1a1a24] border border-[#2a2b3d] rounded p-2 cursor-pointer hover:border-gray-500">
                    <h4 className="text-xs font-bold text-white">Bandit Threat</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Side Quest • Level 3</p>
                 </div>
              </>
           )}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 bg-[#0f111a] flex flex-col overflow-y-auto custom-scrollbar p-6">
         {activeTab === 'npcs' && (
            <div className="max-w-4xl mx-auto w-full space-y-6">
               <div className="flex items-center justify-between border-b border-[#2a2b3d] pb-4">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-full bg-[#ffa657]/20 flex items-center justify-center border-2 border-[#ffa657] shadow-[0_0_15px_rgba(255,166,87,0.2)]">
                        <User size={32} className="text-[#ffa657]"/>
                     </div>
                     <div>
                        <h1 className="text-2xl font-bold text-white">Captain Aldous</h1>
                        <p className="text-sm text-gray-400">ID: NPC_GUARD_CAPTAIN_01</p>
                     </div>
                  </div>
                  <button className="bg-[#3fb950] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#3fb950]/80">
                     <Save size={16} /> Save NPC
                  </button>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  {/* Stats */}
                  <div className="bg-[#11111b] border border-[#2a2b3d] rounded-lg p-4">
                     <h2 className="text-xs font-bold text-white uppercase mb-4 flex items-center gap-2 border-b border-[#2a2b3d] pb-2"><Activity size={14} className="text-[#ffa657]"/> Combat Stats</h2>
                     <div className="space-y-3">
                        <div>
                           <label className="text-[10px] text-gray-400 flex justify-between"><span>Health (HP)</span> <span className="text-white">1200</span></label>
                           <input type="range" min="100" max="10000" defaultValue="1200" className="w-full accent-[#ff7b72] h-1" />
                        </div>
                        <div>
                           <label className="text-[10px] text-gray-400 flex justify-between"><span>Armor (AC)</span> <span className="text-white">45</span></label>
                           <input type="range" min="0" max="100" defaultValue="45" className="w-full accent-[#58a6ff] h-1" />
                        </div>
                        <div>
                           <label className="text-[10px] text-gray-400 flex justify-between"><span>Movement Speed</span> <span className="text-white">4.2 m/s</span></label>
                           <input type="range" min="1" max="10" defaultValue="4" className="w-full accent-[#3fb950] h-1" />
                        </div>
                     </div>
                  </div>

                  {/* AI & Behavior */}
                  <div className="bg-[#11111b] border border-[#2a2b3d] rounded-lg p-4">
                     <h2 className="text-xs font-bold text-white uppercase mb-4 flex items-center gap-2 border-b border-[#2a2b3d] pb-2"><Target size={14} className="text-[#a5d6ff]"/> AI & Behavior</h2>
                     <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                           <label className="text-[10px] text-gray-400">Default State</label>
                           <select className="bg-[#0a0a0f] border border-[#2a2b3d] text-white text-xs p-2 rounded">
                              <option>Patrol Route (ID: PR_TOWN_01)</option>
                              <option>Guard Point</option>
                              <option>Wander (Radius: 10m)</option>
                              <option>Idle Animation</option>
                           </select>
                        </div>
                        <div className="flex flex-col gap-1">
                           <label className="text-[10px] text-gray-400">Aggro Profile</label>
                           <select className="bg-[#0a0a0f] border border-[#2a2b3d] text-white text-xs p-2 rounded">
                              <option>Defensive (Attacks if attacked)</option>
                              <option>Aggressive (Attacks enemies on sight)</option>
                              <option>Passive (Flees)</option>
                           </select>
                        </div>
                        <button className="w-full mt-2 bg-[#2a2b3d] hover:bg-[#3a3b4d] text-white py-2 rounded text-xs transition-colors flex items-center justify-center gap-2">
                           <Route size={14} /> Edit Patrol Path on Map
                        </button>
                     </div>
                  </div>

                  {/* Quests & Dialogue */}
                  <div className="col-span-2 bg-[#11111b] border border-[#2a2b3d] rounded-lg p-4">
                     <h2 className="text-xs font-bold text-white uppercase mb-4 flex items-center gap-2 border-b border-[#2a2b3d] pb-2"><Scroll size={14} className="text-[#d2a8ff]"/> Quest & Dialogue Links</h2>
                     
                     <div className="flex gap-4">
                        <div className="flex-1 bg-[#0a0a0f] border border-[#2a2b3d] rounded p-3">
                           <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Offered Quests</h3>
                           <div className="bg-[#1a1a24] border border-[#d2a8ff]/30 p-2 rounded text-xs text-white mb-2 flex justify-between items-center">
                              <span>The Lost Artifact</span>
                              <span className="text-[10px] bg-[#d2a8ff]/20 text-[#d2a8ff] px-1.5 py-0.5 rounded">Active</span>
                           </div>
                           <button className="text-[10px] text-[#d2a8ff] hover:underline flex items-center gap-1"><Plus size={10}/> Add Quest Link</button>
                        </div>

                        <div className="flex-1 bg-[#0a0a0f] border border-[#2a2b3d] rounded p-3">
                           <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Dialogue Trees</h3>
                           <div className="bg-[#1a1a24] border border-[#2a2b3d] p-2 rounded text-xs text-white mb-2 flex justify-between items-center">
                              <span>Greeting_Default</span>
                              <button className="text-gray-400 hover:text-white"><List size={14}/></button>
                           </div>
                           <div className="bg-[#1a1a24] border border-[#2a2b3d] p-2 rounded text-xs text-white mb-2 flex justify-between items-center">
                              <span>Quest_LostArtifact_Intro</span>
                              <button className="text-gray-400 hover:text-white"><List size={14}/></button>
                           </div>
                           <button className="text-[10px] text-[#58a6ff] hover:underline flex items-center gap-1"><Plus size={10}/> Add Dialogue Node</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
