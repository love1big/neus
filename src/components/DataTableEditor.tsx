import React, { useState } from 'react';
import { Database, Plus, Search, TableProperties, Download, Upload, Save, Settings, PlusSquare, Trash2, ArrowUpDown } from 'lucide-react';

export default function DataTableEditor() {
  const [activeTable, setActiveTable] = useState('ItemsMaster');
  const [search, setSearch] = useState('');
  
  const tables = ['ItemsMaster', 'CharacterStats', 'EnemyLoot', 'CraftingRecipes', 'QuestRewards', 'SpellDatabase'];
  
  const [data, setData] = useState([
    { id: 'itm_001', name: 'Iron Sword', type: 'Weapon', rarity: 'Common', damage: 15, weight: 2.5, cost: 100 },
    { id: 'itm_002', name: 'Health Potion', type: 'Consumable', rarity: 'Common', damage: 0, weight: 0.1, cost: 25 },
    { id: 'itm_003', name: 'Mythril Chestplate', type: 'Armor', rarity: 'Rare', damage: 0, weight: 12.0, cost: 1500 },
    { id: 'itm_004', name: 'Staff of Flames', type: 'Weapon', rarity: 'Epic', damage: 45, weight: 3.2, cost: 2800 },
    { id: 'itm_005', name: 'Dragon Scale', type: 'Material', rarity: 'Legendary', damage: 0, weight: 0.5, cost: 5000 },
    { id: 'itm_006', name: 'Leather Boots', type: 'Armor', rarity: 'Common', damage: 0, weight: 1.5, cost: 80 },
    { id: 'itm_007', name: 'Mana Crystal', type: 'Consumable', rarity: 'Uncommon', damage: 0, weight: 0.1, cost: 150 },
  ]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3fb950]/10 rounded text-[#3fb950]"><Database size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Data Table Editor</h2>
              <p className="text-[10px] text-[#8b949e]">Manage Game Configuration, Items, Stats, and Balance</p>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] font-bold flex items-center gap-2 transition-colors"><Upload size={12}/> Import CSV</button>
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] font-bold flex items-center gap-2 transition-colors"><Download size={12}/> Export JSON</button>
            <button className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-[11px] font-bold flex items-center gap-2 transition-colors"><Save size={12}/> Save Changes</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-[#30363d] bg-[#0d1117] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#30363d]">
              <button className="w-full py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] text-[#58a6ff] font-bold flex items-center justify-center gap-2"><PlusSquare size={14}/> New Data Table</button>
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
             {tables.map(table => (
                <button 
                  key={table}
                  onClick={() => setActiveTable(table)}
                  className={`w-full text-left px-3 py-2 rounded text-[11px] font-bold flex items-center gap-2 transition-colors ${activeTable === table ? 'bg-[#1f6feb]/20 text-[#58a6ff]' : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'}`}
                >
                  <TableProperties size={12} className={activeTable === table ? 'text-[#58a6ff]' : 'text-[#8b949e]'}/>
                  {table}
                </button>
             ))}
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden relative">
          {/* Toolbar */}
          <div className="p-2 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]">
             <div className="flex items-center gap-2">
                <button className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[10px] flex items-center gap-1.5"><Plus size={10}/> Add Row</button>
                <button className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[10px] flex items-center gap-1.5"><TableProperties size={10}/> Edit Schema</button>
             </div>
             <div className="relative">
                <Search size={12} className="absolute left-2 top-1.5 text-[#8b949e]" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rows..." 
                  className="bg-[#0d1117] border border-[#30363d] rounded pl-6 pr-2 py-1 text-[10px] outline-none text-white w-48 focus:border-[#58a6ff] transition-colors"
                />
             </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar relative">
             <table className="w-full text-left border-collapse font-sans text-[11px] whitespace-nowrap">
                <thead className="sticky top-0 bg-[#161b22] z-10 shadow-sm border-b border-[#30363d]">
                   <tr>
                     <th className="p-2 font-bold text-[#8b949e] border-r border-[#30363d] w-10 text-center"><div className="flex justify-center"><Settings size={12}/></div></th>
                     <th className="p-2 font-bold text-[#8b949e] border-r border-[#30363d]"><div className="flex items-center gap-1 cursor-pointer hover:text-[#c9d1d9]">ID <ArrowUpDown size={10}/></div></th>
                     <th className="p-2 font-bold text-[#8b949e] border-r border-[#30363d]"><div className="flex items-center gap-1 cursor-pointer hover:text-[#c9d1d9]">Name <ArrowUpDown size={10}/></div></th>
                     <th className="p-2 font-bold text-[#8b949e] border-r border-[#30363d]">Type</th>
                     <th className="p-2 font-bold text-[#8b949e] border-r border-[#30363d]">Rarity</th>
                     <th className="p-2 font-bold text-[#8b949e] border-r border-[#30363d] text-right">Damage/Value</th>
                     <th className="p-2 font-bold text-[#8b949e] border-r border-[#30363d] text-right">Weight</th>
                     <th className="p-2 font-bold text-[#8b949e] text-right">Cost (Gold)</th>
                   </tr>
                </thead>
                <tbody>
                   {data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.id.includes(search)).map((row, i) => (
                      <tr key={i} className="border-b border-[#30363d] hover:bg-[#161b22]/50 group">
                         <td className="p-2 border-r border-[#30363d] text-center text-[#8b949e]">
                            <button className="opacity-0 group-hover:opacity-100 hover:text-[#f85149] transition-opacity"><Trash2 size={12}/></button>
                            <span className="group-hover:hidden">{i+1}</span>
                         </td>
                         <td className="p-1 border-r border-[#30363d]"><input className="w-full bg-transparent border border-transparent hover:border-[#30363d] focus:border-[#58a6ff] focus:bg-[#0d1117] rounded px-1 py-0.5 outline-none text-[#58a6ff] font-mono" defaultValue={row.id} /></td>
                         <td className="p-1 border-r border-[#30363d]"><input className="w-full bg-transparent border border-transparent hover:border-[#30363d] focus:border-[#58a6ff] focus:bg-[#0d1117] rounded px-1 py-0.5 outline-none text-white font-bold" defaultValue={row.name} /></td>
                         <td className="p-1 border-r border-[#30363d]">
                            <select className="w-full bg-transparent border border-transparent hover:border-[#30363d] focus:border-[#58a6ff] focus:bg-[#0d1117] rounded px-1 py-0.5 outline-none text-[#c9d1d9]" defaultValue={row.type}>
                               <option>Weapon</option><option>Armor</option><option>Consumable</option><option>Material</option>
                            </select>
                         </td>
                         <td className="p-1 border-r border-[#30363d]">
                            <select className="w-full bg-transparent border border-transparent hover:border-[#30363d] focus:border-[#58a6ff] focus:bg-[#0d1117] rounded px-1 py-0.5 outline-none text-[#c9d1d9]" defaultValue={row.rarity}>
                               <option>Common</option><option>Uncommon</option><option>Rare</option><option>Epic</option><option>Legendary</option>
                            </select>
                         </td>
                         <td className="p-1 border-r border-[#30363d]"><input type="number" className="w-full bg-transparent border border-transparent hover:border-[#30363d] focus:border-[#58a6ff] focus:bg-[#0d1117] rounded px-1 py-0.5 outline-none text-[#d2a8ff] text-right font-mono" defaultValue={row.damage} /></td>
                         <td className="p-1 border-r border-[#30363d]"><input type="number" className="w-full bg-transparent border border-transparent hover:border-[#30363d] focus:border-[#58a6ff] focus:bg-[#0d1117] rounded px-1 py-0.5 outline-none text-[#3fb950] text-right font-mono" defaultValue={row.weight} /></td>
                         <td className="p-1"><input type="number" className="w-full bg-transparent border border-transparent hover:border-[#30363d] focus:border-[#58a6ff] focus:bg-[#0d1117] rounded px-1 py-0.5 outline-none text-[#e3b341] text-right font-mono" defaultValue={row.cost} /></td>
                      </tr>
                   ))}
                </tbody>
             </table>
             
             {/* AI Auto-Balance Assistant Overlay */}
             <div className="absolute bottom-4 right-4 bg-[#161b22] border border-[#d2a8ff]/40 rounded-lg shadow-xl p-3 w-72 flex flex-col gap-2 z-20">
                <div className="flex justify-between items-center pb-2 border-b border-[#30363d]">
                  <h3 className="text-[#d2a8ff] font-bold text-[10px] uppercase flex items-center gap-1.5"><Database size={12}/> AI Game Balancer</h3>
                  <button className="text-[#8b949e] hover:text-white"><Settings size={10}/></button>
                </div>
                <p className="text-[#8b949e] text-[9px]">Ask AI to re-balance the entire table based on player progression curves.</p>
                <div className="flex gap-2 mt-1">
                   <input type="text" placeholder="e.g. 'Make Epics cost 3x more'" className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[9px] outline-none text-white focus:border-[#d2a8ff]"/>
                   <button className="bg-[#d2a8ff]/20 text-[#d2a8ff] hover:bg-[#d2a8ff]/30 px-2 py-1 rounded text-[9px] font-bold transition-colors">Balance</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
