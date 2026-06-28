import React, { useState } from 'react';
import { Activity, Bot, Shield, Network, Eye, Radio, Server, Code, MapPin, Zap, Database, Search, Target, Skull, User, PieChart, Users, Crosshair, Box } from 'lucide-react';

export default function AICommandCenter() {
  const [activeTab, setActiveTab] = useState('Overview'); // Overview, NPCs, Monsters
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>('GBL-001');

  const npcs = [
    { id: 'NPC-001', name: 'Eldorin The Wise', role: 'Archmage / Quest Giver', faction: 'Council of Kirin', coords: 'X: 442 Y: 12', status: 'Idle', health: 1200, mana: 5000, img: 'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&q=80&w=200&h=200', details: 'High-level caster. Maintains the protective barrier over the capital.', age: 342, affinity: 'Arcane', mood: 'Contemplative', recentLogs: ['Reading ancient tome', 'Sipped mana potion'] },
    { id: 'NPC-002', name: 'Kaelen', role: 'Blacksmith', faction: 'Iron Guild', coords: 'X: 410 Y: -45', status: 'Working', health: 450, mana: 0, img: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=200&h=200', details: 'Master of steel. Currently fulfilling a massive order for the Royal Guard.', age: 45, affinity: 'Fire', mood: 'Focused', recentLogs: ['Hammering steel', 'Quenching blade'] },
    { id: 'NPC-003', name: 'Lyra', role: 'Merchant', faction: 'Free Traders', coords: 'X: 380 Y: -10', status: 'Trading', health: 200, mana: 50, img: 'https://images.unsplash.com/photo-1552699611-e2c208d537d1?auto=format&fit=crop&q=80&w=200&h=200', details: 'Travels between towns. Known for rare herbs.', age: 28, affinity: 'Nature', mood: 'Cheerful', recentLogs: ['Sold Elixir of Life', 'Restocked inventory'] },
  ];

  const monsters = [
    { id: 'GBL-001', name: 'Goblin Warlord', class: 'Elite Boss', threat: 'High', coords: 'X: -1020 Y: 400', status: 'Patrolling', health: '8500 / 8500', aggroRange: 45, img: 'https://images.unsplash.com/photo-1620822646698-10903328eece?auto=format&fit=crop&q=80&w=200&h=200', details: 'Commands the northern horde. Highly dangerous and resistant to fire.', damageType: 'Physical / Dark', vulnerabilities: 'Light / Lightning', recentLogs: ['Barked orders', 'Kicked a barrel'] },
    { id: 'DRG-099', name: 'Obsidian Drake', class: 'Mythic', threat: 'Extreme', coords: 'X: 2000 Y: -1500', status: 'Sleeping', health: '45000 / 45000', aggroRange: 120, img: 'https://images.unsplash.com/photo-1578652520376-78711883be78?auto=format&fit=crop&q=80&w=200&h=200', details: 'Ancient dragon guarding the volcanic core. Capable of flight and AoE annihilation.', damageType: 'Fire / Magma', vulnerabilities: 'Ice / Water', recentLogs: ['Snoring loudly', 'Shifted position in lair'] },
    { id: 'SLM-042', name: 'Venomous Slime', class: 'Common', threat: 'Low', coords: 'X: 120 Y: 45', status: 'Wandering', health: '120 / 120', aggroRange: 15, img: 'https://images.unsplash.com/photo-1563212036-7e04df2cf0fc?auto=format&fit=crop&q=80&w=200&h=200', details: 'Leaves a toxic trail. Splits into two when killed.', damageType: 'Poison', vulnerabilities: 'Fire', recentLogs: ['Absorbed a rat', 'Oozed forward'] },
  ];

  const selectedEntity = [...npcs, ...monsters].find(e => e.id === selectedEntityId) || monsters[0];

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-6 overflow-hidden">
      <div className="flex justify-between items-start mb-6">
         <div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
               <Eye size={28} className="text-[#f85149]"/> Sentinel Multi-Agent Oversight
            </h1>
            <p className="text-[#8b949e] max-w-xl text-sm">Real-time orchestration and telemetry of autonomous AI entities within the game simulation.</p>
         </div>
         <div className="flex bg-[#111116] border border-[#2d2d2d] rounded-lg p-1 gap-1">
             <button onClick={() => setActiveTab('Overview')} className={`px-5 tracking-wide text-sm font-bold flex items-center justify-center gap-2 rounded transition ${activeTab === 'Overview' ? 'bg-[#21262d] text-white shadow' : 'text-[#888] hover:text-[#ccc]'}`}><Network size={16}/> Hive-Mind</button>
             <button onClick={() => setActiveTab('NPCs')} className={`px-5 tracking-wide text-sm font-bold flex items-center justify-center gap-2 rounded transition ${activeTab === 'NPCs' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30 shadow' : 'text-[#888] hover:text-[#ccc]'}`}><Users size={16}/> NPCs (Friendly)</button>
             <button onClick={() => setActiveTab('Monsters')} className={`px-5 tracking-wide text-sm font-bold flex items-center justify-center gap-2 rounded transition ${activeTab === 'Monsters' ? 'bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/30 shadow' : 'text-[#888] hover:text-[#ccc]'}`}><Skull size={16}/> Monsters (Hostile)</button>
         </div>
      </div>
      
      <div className="flex-1 grid grid-cols-4 gap-6 min-h-0">
         
         {/* Agents Map/List */}
         <div className="col-span-3 flex flex-col gap-6">
            
            {activeTab === 'Overview' && (
              <div className="grid grid-cols-3 gap-4 shrink-0">
                 {/* Quick Stats */}
                 <div className="bg-[#111116] border border-[#2d2d2d] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#3fb950]/10 rounded-full flex items-center justify-center border border-[#3fb950]/30"><Bot size={24} className="text-[#3fb950]"/></div>
                    <div>
                       <div className="text-[10px] text-[#888] font-bold uppercase tracking-wider">Active Agents</div>
                       <div className="text-2xl font-mono text-white font-black">1,424</div>
                    </div>
                 </div>
                 <div className="bg-[#111116] border border-[#2d2d2d] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#58a6ff]/10 rounded-full flex items-center justify-center border border-[#58a6ff]/30"><Radio size={24} className="text-[#58a6ff]"/></div>
                    <div>
                       <div className="text-[10px] text-[#888] font-bold uppercase tracking-wider">Messages / Sec</div>
                       <div className="text-2xl font-mono text-white font-black">12.8k</div>
                    </div>
                 </div>
                 <div className="bg-[#111116] border border-[#2d2d2d] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#e3b341]/10 rounded-full flex items-center justify-center border border-[#e3b341]/30"><Activity size={24} className="text-[#e3b341]"/></div>
                    <div>
                       <div className="text-[10px] text-[#888] font-bold uppercase tracking-wider">Brain Token USAGE</div>
                       <div className="text-2xl font-mono text-white font-black">4.2M <span className="text-[#888] text-sm">/ hr</span></div>
                    </div>
                 </div>
              </div>
            )}

            <div className="flex-1 bg-[#111116] border border-[#2d2d2d] rounded-xl overflow-hidden flex flex-col shadow-lg">
               <div className="bg-[#1c1c24] border-b border-[#2d2d2d] p-3 flex justify-between items-center shrink-0">
                   <div className="flex items-center gap-3">
                     <Search size={16} className="text-[#888]"/>
                     <input type="text" placeholder={`Filter ${activeTab}...`} className="bg-transparent border-none outline-none text-sm text-white w-64 placeholder-[#666]" />
                   </div>
                   <div className="flex gap-2">
                     <button className="text-[11px] bg-[#0d0d11] px-3 py-1 rounded border border-[#333] hover:text-white">Sort by Distance</button>
                     <button className="text-[11px] bg-[#0d0d11] px-3 py-1 rounded border border-[#333] hover:text-white">Sort by Threat</button>
                   </div>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4 custom-scrollbar">
                  {/* DYNAMIC LIST RENDER based on TAB */}
                  {(activeTab === 'Monsters' || activeTab === 'Overview' ? monsters : []).map((entity) => (
                     <div key={entity.id} onClick={() => setSelectedEntityId(entity.id)} className={`bg-[#0a0a0c] border rounded-lg p-3 flex gap-4 cursor-pointer transition-colors group ${selectedEntityId === entity.id ? 'border-[#f85149] shadow-[0_0_15px_rgba(248,81,73,0.15)]' : 'border-[#2d2d2d] hover:border-[#444]'}`}>
                        <img src={entity.img} alt={entity.name} className="w-16 h-16 rounded object-cover border border-[#333] grayscale-[30%] group-hover:grayscale-0 transition-all"/>
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-[#f85149] text-[14px] leading-tight">{entity.name}</h4>
                              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#f85149]/20 text-[#f85149]">{entity.status}</span>
                           </div>
                           <div className="text-[10px] text-[#888] font-mono mb-2">{entity.id} • {entity.class}</div>
                           <div className="w-full bg-[#333] h-1.5 rounded-full overflow-hidden">
                              <div className="h-full bg-[#f85149]" style={{ width: '100%' }}></div>
                           </div>
                        </div>
                     </div>
                  ))}

                  {(activeTab === 'NPCs' || activeTab === 'Overview' ? npcs : []).map((entity) => (
                     <div key={entity.id} onClick={() => setSelectedEntityId(entity.id)} className={`bg-[#0a0a0c] border rounded-lg p-3 flex gap-4 cursor-pointer transition-colors group ${selectedEntityId === entity.id ? 'border-[#58a6ff] shadow-[0_0_15px_rgba(88,166,255,0.15)]' : 'border-[#2d2d2d] hover:border-[#444]'}`}>
                        <img src={entity.img} alt={entity.name} className="w-16 h-16 rounded object-cover border border-[#333] grayscale-[30%] group-hover:grayscale-0 transition-all"/>
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-[#58a6ff] text-[14px] leading-tight">{entity.name}</h4>
                              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#58a6ff]/20 text-[#58a6ff]">{entity.status}</span>
                           </div>
                           <div className="text-[10px] text-[#888] font-mono mb-2">{entity.id} • {entity.faction}</div>
                           <div className="w-full bg-[#333] h-1.5 rounded-full overflow-hidden">
                              <div className="h-full bg-[#3fb950]" style={{ width: '100%' }}></div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Details Panel - MASSIVE DETAILS */}
         <div className="col-span-1 bg-[#111116] border border-[#2d2d2d] rounded-xl flex flex-col overflow-hidden shadow-lg h-full">
            <div className="h-56 bg-[#0a0a0c] border-b border-[#2d2d2d] relative flex items-center justify-center overflow-hidden shrink-0 group">
               <img src={selectedEntity.img} alt={selectedEntity.name} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent"></div>
               
               <div className="absolute top-2 right-2 bg-[#000]/80 px-2 py-1 rounded border border-[#333] font-mono text-[9px] text-[#fff] shadow-lg backdrop-blur">ID: {selectedEntity.id}</div>
               <div className="absolute bottom-4 left-4 z-10 w-full pr-8">
                  <h3 className="font-black text-white text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">{selectedEntity.name}</h3>
                  <div className="text-[#e3b341] text-xs font-bold mt-1 drop-shadow-md">{(selectedEntity as any).class || (selectedEntity as any).role}</div>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-10">
               
               <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#0a0a0c] border border-[#2d2d2d] rounded p-2 text-center">
                     <div className="text-[9px] text-[#888] uppercase tracking-wider mb-1">Health</div>
                     <div className="text-[#3fb950] font-mono font-bold text-sm">{selectedEntity.health}</div>
                  </div>
                  <div className="bg-[#0a0a0c] border border-[#2d2d2d] rounded p-2 text-center">
                     <div className="text-[9px] text-[#888] uppercase tracking-wider mb-1">Coordinates</div>
                     <div className="text-[#58a6ff] font-mono font-bold text-sm">{selectedEntity.coords}</div>
                  </div>
                  <div className="bg-[#0a0a0c] border border-[#2d2d2d] rounded p-2 text-center col-span-2">
                     <div className="text-[9px] text-[#888] uppercase tracking-wider mb-1">Current State</div>
                     <div className="text-white font-bold text-sm">{selectedEntity.status}</div>
                  </div>
               </div>

               <div className="space-y-5">
                  <div>
                     <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2 flex items-center gap-2"><Box size={14}/> Entity Profile</h4>
                     <p className="text-[#ccc] text-xs leading-relaxed bg-[#1c1c24] p-3 rounded border border-[#2d2d2d]">
                        {selectedEntity.details}
                     </p>
                  </div>

                  <div>
                     <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2 flex items-center gap-2"><Target size={14}/> Tactical Modifiers</h4>
                     <div className="bg-[#1c1c24] border border-[#2d2d2d] rounded overflow-hidden text-[11px] font-mono">
                        {(selectedEntity as any).damageType && (
                           <div className="flex justify-between p-2 border-b border-[#2d2d2d]">
                              <span className="text-[#666]">Base Dmg Type</span>
                              <span className="text-[#f85149]">{(selectedEntity as any).damageType}</span>
                           </div>
                        )}
                        {(selectedEntity as any).vulnerabilities && (
                           <div className="flex justify-between p-2 border-b border-[#2d2d2d]">
                              <span className="text-[#666]">Vulnerabilities</span>
                              <span className="text-[#3fb950]">{(selectedEntity as any).vulnerabilities}</span>
                           </div>
                        )}
                        {(selectedEntity as any).affinity && (
                           <div className="flex justify-between p-2 border-b border-[#2d2d2d]">
                              <span className="text-[#666]">Affinity</span>
                              <span className="text-[#bc8cff]">{(selectedEntity as any).affinity}</span>
                           </div>
                        )}
                        {(selectedEntity as any).mood && (
                           <div className="flex justify-between p-2">
                              <span className="text-[#666]">Current Mood</span>
                              <span className="text-[#58a6ff]">{(selectedEntity as any).mood}</span>
                           </div>
                        )}
                     </div>
                  </div>

                  <div>
                     <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2 flex items-center gap-2"><Activity size={14}/> LLM Subroutine Log</h4>
                     <div className="bg-[#050505] border border-[#222] rounded p-3 text-[#ccc] space-y-2 font-mono text-[10px]">
                        {selectedEntity.recentLogs.map((log, i) => (
                           <div key={i} className="flex gap-2">
                              <span className="text-[#666] shrink-0">[{Date.now() - (i*1400)}ms]</span>
                              <span className={i === 0 ? 'text-[#fff]' : 'text-[#888]'}>{log}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="pt-4 border-t border-[#2d2d2d] space-y-2">
                     {(selectedEntity as any).threat && (
                        <button className="w-full bg-[#f85149]/10 text-[#f85149] border border-[#f85149]/30 hover:bg-[#f85149]/20 py-2.5 rounded text-xs uppercase font-bold tracking-widest transition flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(248,81,73,0.1)]">
                           <Crosshair size={14}/> Force Engage Protocol
                        </button>
                     )}
                     {!(selectedEntity as any).threat && (
                        <button className="w-full bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/30 hover:bg-[#58a6ff]/20 py-2.5 rounded text-xs uppercase font-bold tracking-widest transition flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(88,166,255,0.1)]">
                           <User size={14}/> Force Interaction Dialogue
                        </button>
                     )}
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
