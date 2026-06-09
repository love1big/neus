import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign, Activity, Settings, RefreshCw, BarChart2 } from 'lucide-react';

export default function EconomicBalancer() {
  const [activeTab, setActiveTab] = useState('items');

  const [items] = useState([
    { id: 1, name: 'Health Potion', cost: 50, dropRate: '15%', maxStack: 99, category: 'Consumable' },
    { id: 2, name: 'Iron Sword', cost: 150, dropRate: '5%', maxStack: 1, category: 'Weapon' },
    { id: 3, name: 'Dragon Scale', cost: 5000, dropRate: '0.1%', maxStack: 99, category: 'Material' },
  ]);

  const [enemies] = useState([
    { id: 1, name: 'Goblin', hp: 50, damage: 5, exp: 10, goldDrop: '1-5' },
    { id: 2, name: 'Orc', hp: 150, damage: 15, exp: 35, goldDrop: '5-20' },
    { id: 3, name: 'Dragon', hp: 5000, damage: 150, exp: 1000, goldDrop: '500-2000' },
  ]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans">
      <div className="flex bg-[#161b22] border-b border-[#30363d] p-2 items-center gap-4 shrink-0">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp size={16} className="text-[#3fb950]" />
          Economic & Balance Matrix
        </h2>
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1 rounded text-xs transition-colors ${activeTab === 'items' ? 'bg-[#58a6ff] text-white' : 'bg-[#21262d] hover:bg-[#30363d]'}`}
            onClick={() => setActiveTab('items')}
          >
            Item Economy
          </button>
          <button 
            className={`px-3 py-1 rounded text-xs transition-colors ${activeTab === 'enemies' ? 'bg-[#f85149] text-white' : 'bg-[#21262d] hover:bg-[#30363d]'}`}
            onClick={() => setActiveTab('enemies')}
          >
            Combat Balance
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        {activeTab === 'items' && (
          <div className="bg-[#161b22] border border-[#30363d] rounded w-full">
            <div className="p-2 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117]">
              <span className="font-semibold text-xs tracking-wide">Item Database & Cost Curve</span>
              <button className="bg-[#2ea043] hover:bg-[#2c974b] text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <RefreshCw size={12} /> Recalculate Inflation
              </button>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d1117] text-[#8b949e]">
                <tr>
                  <th className="p-2 border-b border-[#30363d]">ID</th>
                  <th className="p-2 border-b border-[#30363d]">Name</th>
                  <th className="p-2 border-b border-[#30363d]">Category</th>
                  <th className="p-2 border-b border-[#30363d]">Buy Cost (G)</th>
                  <th className="p-2 border-b border-[#30363d]">Drop Rate</th>
                  <th className="p-2 border-b border-[#30363d]">Max Stack</th>
                  <th className="p-2 border-b border-[#30363d]">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-[#30363d] hover:bg-[#21262d]">
                    <td className="p-2">{item.id}</td>
                    <td className="p-2 font-semibold text-[#58a6ff]">{item.name}</td>
                    <td className="p-2"><span className="px-2 py-0.5 bg-[#30363d] rounded-full text-[10px]">{item.category}</span></td>
                    <td className="p-2 flex items-center gap-1"><DollarSign size={12} className="text-[#e3b341]"/> {item.cost}</td>
                    <td className="p-2 text-[#3fb950]">{item.dropRate}</td>
                    <td className="p-2">{item.maxStack}</td>
                    <td className="p-2"><button className="text-[#8b949e] hover:text-white"><Settings size={14}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'enemies' && (
          <div className="bg-[#161b22] border border-[#30363d] rounded w-full">
            <div className="p-2 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117]">
              <span className="font-semibold text-xs tracking-wide">Enemy Stat Matrix & TTK (Time to Kill) Analyzer</span>
              <button className="bg-[#2ea043] hover:bg-[#2c974b] text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <BarChart2 size={12} /> Run DPS Simulation
              </button>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d1117] text-[#8b949e]">
                <tr>
                  <th className="p-2 border-b border-[#30363d]">ID</th>
                  <th className="p-2 border-b border-[#30363d]">Name</th>
                  <th className="p-2 border-b border-[#30363d]">Base HP</th>
                  <th className="p-2 border-b border-[#30363d]">Base Damage</th>
                  <th className="p-2 border-b border-[#30363d]">EXP Yield</th>
                  <th className="p-2 border-b border-[#30363d]">Gold Range</th>
                </tr>
              </thead>
              <tbody>
                {enemies.map(en => (
                  <tr key={en.id} className="border-b border-[#30363d] hover:bg-[#21262d]">
                    <td className="p-2">{en.id}</td>
                    <td className="p-2 font-semibold text-[#f85149]">{en.name}</td>
                    <td className="p-2 text-[#3fb950] font-mono">{en.hp}</td>
                    <td className="p-2 text-[#f85149] font-mono">{en.damage}</td>
                    <td className="p-2 text-[#bc8cff] font-mono">{en.exp}</td>
                    <td className="p-2 text-[#e3b341] font-mono">{en.goldDrop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
