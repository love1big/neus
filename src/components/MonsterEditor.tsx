import React, { useState } from 'react';
import { Skull, Activity, Shield, Zap, Target, Sliders, Dna, Save, Filter, Search, Layers, RefreshCcw, Bone, Flame} from 'lucide-react';
import Viewport3D from './Viewport3D';

export default function MonsterEditor() {
  const [selectedMonster, setSelectedMonster] = useState('Goblin Warrior');
  return (
    <div className="flex h-full w-full bg-[#0a0c10] text-[#c9d1d9] font-sans">
      <div className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col">
        <div className="p-3 border-b border-[#30363d] flex items-center gap-2 text-[#e3b341] font-bold text-sm uppercase">
          <Skull size={18} /> Monster Bestiary
        </div>
        <div className="p-2 border-b border-[#30363d]">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 text-[#8b949e]" size={14} />
            <input type="text" placeholder="Search entity..." className="w-full bg-[#0d1117] border border-[#30363d] rounded text-xs py-1.5 pl-7 pr-2" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
           {['Goblin Warrior', 'Ogre Brute', 'Cave Troll', 'Lich King', 'Shadow Fiend'].map(name => (
             <button key={name} onClick={() => setSelectedMonster(name)} className={`w-full text-left px-3 py-2 text-xs rounded transition flex items-center justify-between ${selectedMonster === name ? 'bg-[#3fb950]/20 border border-[#3fb950]/50 text-[#3fb950]' : 'hover:bg-[#21262d]'}`}>
                <span>{name}</span>
                {selectedMonster === name && <Activity size={12} />}
             </button>
           ))}
        </div>
        <button className="m-3 mt-auto p-2 bg-[#f85149] text-white rounded text-xs font-bold text-center hover:bg-[#ff7b72] flex justify-center items-center gap-2">
           <Zap size={14}/> Spawn New Entity
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
        {/* Monster 3D Viewport Area */}
        <div className="w-full h-[50vh] bg-[#0d1117] border-b border-[#30363d] relative">
           <Viewport3D activeTool="MonsterEdit" activeFile={undefined} />
        </div>

        <div className="max-w-5xl w-full p-6">
           <div className="flex justify-between items-end mb-6 border-b border-[#30363d] pb-4">
              <div>
                 <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2">{selectedMonster}</h1>
                 <p className="text-[#8b949e] text-xs">Entity Class: Humanoid / Aggressive | Threat Level: Medium</p>
              </div>
              <button className="bg-[#238636] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#2ea043]"><Save size={16}/> Save Blueprint</button>
           </div>
           
           <div className="grid grid-cols-3 gap-6">
              {/* Stats Panel */}
              <div className="col-span-1 bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                 <h3 className="text-[#e6edf3] font-bold mb-4 flex items-center gap-2"><Target size={16} className="text-[#ff7b72]" /> Combat Stats</h3>
                 <div className="space-y-3">
                    <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-[#8b949e]">Health (HP)</span> <span className="font-mono text-[#3fb950]">850</span></div>
                       <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden"><div className="bg-[#3fb950] h-full" style={{width: '60%'}}></div></div>
                    </div>
                    <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-[#8b949e]">Damage (DMG)</span> <span className="font-mono text-[#f85149]">120</span></div>
                       <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden"><div className="bg-[#f85149] h-full" style={{width: '40%'}}></div></div>
                    </div>
                    <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-[#8b949e]">Armor (DEF)</span> <span className="font-mono text-[#58a6ff]">45</span></div>
                       <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden"><div className="bg-[#58a6ff] h-full" style={{width: '25%'}}></div></div>
                    </div>
                    <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-[#8b949e]">Speed (SPD)</span> <span className="font-mono text-[#e3b341]">1.2x</span></div>
                       <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden"><div className="bg-[#e3b341] h-full" style={{width: '50%'}}></div></div>
                    </div>
                 </div>
              </div>
              
              {/* Behaviors */}
              <div className="col-span-2 bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                 <h3 className="text-[#e6edf3] font-bold mb-4 flex items-center gap-2"><Dna size={16} className="text-[#bc8cff]" /> AI Behaviors & Traits</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded">
                       <h4 className="text-xs font-bold text-[#e6edf3] mb-2 flex items-center gap-1"><Shield size={14} className="text-[#3fb950]"/> Aggro Radius</h4>
                       <input type="range" className="w-full accent-[#3fb950]" defaultValue="60" />
                       <p className="text-[10px] text-[#8b949e] mt-2">Distance to trigger combat state.</p>
                    </div>
                    <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded">
                       <h4 className="text-xs font-bold text-[#e6edf3] mb-2 flex items-center gap-1"><Flame size={14} className="text-[#f85149]"/> Attack Pattern</h4>
                       <select className="w-full bg-[#161b22] border border-[#30363d] text-xs p-1 rounded text-[#e6edf3]">
                          <option>Melee Brute Force</option>
                          <option>Hit and Run</option>
                          <option>Ranged Support</option>
                          <option>Ambush Predator</option>
                       </select>
                       <p className="text-[10px] text-[#8b949e] mt-2">Default combat algorithm logic.</p>
                    </div>
                    <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded col-span-2">
                       <h4 className="text-xs font-bold text-[#e6edf3] mb-2 flex items-center gap-1"><Bone size={14} className="text-[#e3b341]"/> Loot Drops & Modifiers</h4>
                       <div className="flex gap-2">
                          <span className="bg-[#f85149]/10 text-[#f85149] px-2 py-1 rounded text-xs border border-[#f85149]/30">Health Potion 15%</span>
                          <span className="bg-[#58a6ff]/10 text-[#58a6ff] px-2 py-1 rounded text-xs border border-[#58a6ff]/30">Rusty Sword 5%</span>
                          <span className="bg-[#bc8cff]/10 text-[#bc8cff] px-2 py-1 rounded text-xs border border-[#bc8cff]/30">Gold Coins 40%</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
