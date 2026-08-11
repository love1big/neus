import React, { useState } from 'react';
import { Activity, Play, Pause, Settings, Layout, Users, Zap, Filter, ArrowUpRight, ArrowDownRight, Database, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateData = () => {
  return Array.from({ length: 24 }).map((_, i) => ({
    time: `${i}:00`,
    ccu: Math.floor(15000 + Math.sin(i / 3) * 10000 + Math.random() * 2000),
    revenue: Math.floor(5000 + Math.sin(i / 3) * 3000 + Math.random() * 500)
  }));
};

export default function LiveOpsManager() {
  const [data] = useState(generateData());
  
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-700 p-1.5 rounded-lg shadow-lg">
            <Globe size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">LiveOps <span className="text-purple-400">Manager</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">A/B Testing & Economy Tuning</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Active Campaigns */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Activity size={14}/> Live Events & Tests</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            
            <div className="bg-[#1a1a1c] border border-[#3e3e42] rounded overflow-hidden">
               <div className="p-2 border-b border-[#3e3e42] flex justify-between items-center bg-[#2d2d2d]">
                 <span className="text-[10px] font-bold text-purple-400">Season 4 Battle Pass</span>
                 <span className="px-1.5 py-0.5 rounded bg-green-900/50 text-green-400 border border-green-500/30 text-[8px] font-bold">ACTIVE</span>
               </div>
               <div className="p-3 text-[10px] text-gray-400 space-y-1">
                 <div className="flex justify-between"><span>End Date</span><span className="text-gray-200">12 Days</span></div>
                 <div className="flex justify-between"><span>Conversion</span><span className="text-green-400">14.2%</span></div>
               </div>
            </div>

            <div className="bg-[#1a1a1c] border border-[#3e3e42] rounded overflow-hidden">
               <div className="p-2 border-b border-[#3e3e42] flex justify-between items-center bg-[#2d2d2d]">
                 <span className="text-[10px] font-bold text-orange-400">A/B: Gem Pricing</span>
                 <span className="px-1.5 py-0.5 rounded bg-green-900/50 text-green-400 border border-green-500/30 text-[8px] font-bold">ACTIVE</span>
               </div>
               <div className="p-3 text-[10px] text-gray-400 space-y-2">
                 <div className="flex justify-between border-b border-[#3e3e42] pb-1"><span>Control ($4.99)</span><span className="text-gray-200">Base</span></div>
                 <div className="flex justify-between"><span>Variant A ($3.99)</span><span className="text-green-400">+12% Rev</span></div>
                 <div className="flex justify-between"><span>Variant B ($5.99)</span><span className="text-red-400">-5% Rev</span></div>
               </div>
            </div>

          </div>
        </div>

        {/* Center: Dashboards */}
        <div className="flex-1 bg-[#1a1a1c] p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
           
           {/* Top Stats */}
           <div className="grid grid-cols-4 gap-4 shrink-0">
             {[
               { label: 'Current CCU', val: '24,592', change: '+12%', color: 'text-green-400', icon: <Users size={14}/> },
               { label: 'Daily Revenue', val: '$142,590', change: '+5.4%', color: 'text-green-400', icon: <Database size={14}/> },
               { label: 'ARPU', val: '$5.82', change: '-1.2%', color: 'text-red-400', icon: <Activity size={14}/> },
               { label: 'Crash Rate', val: '0.12%', change: '-0.05%', color: 'text-green-400', icon: <Zap size={14}/> },
             ].map((stat, i) => (
               <div key={i} className="bg-[#252526] border border-[#3e3e42] p-4 rounded-lg flex flex-col gap-2 shadow-sm">
                 <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase font-bold">
                   <div className="flex items-center gap-1">{stat.icon} {stat.label}</div>
                   <span className={`${stat.color}`}>{stat.change}</span>
                 </div>
                 <div className="text-2xl font-bold text-gray-100">{stat.val}</div>
               </div>
             ))}
           </div>

           {/* Charts */}
           <div className="flex-1 min-h-[300px] flex gap-4">
             <div className="flex-1 bg-[#252526] border border-[#3e3e42] rounded-lg p-4 flex flex-col">
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Concurrent Users (24h)</h3>
               <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCcu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3e3e42" vertical={false} />
                      <XAxis dataKey="time" stroke="#6b7280" fontSize={10} tickMargin={10} />
                      <YAxis stroke="#6b7280" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a1c', borderColor: '#3e3e42', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="ccu" stroke="#a855f7" fillOpacity={1} fill="url(#colorCcu)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
             </div>
           </div>

        </div>

        {/* Right Panel: Remote Config */}
        <div className="w-80 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 z-10">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c] flex justify-between items-center">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Remote Config</h3>
             <button className="bg-purple-600 hover:bg-purple-500 text-white text-[9px] font-bold px-2 py-1 rounded">PUBLISH</button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Economy Tuners</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400">XP Multiplier</span>
                    <input type="number" defaultValue="1.5" className="w-16 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-right text-gray-200 focus:outline-none focus:border-purple-500" />
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400">Gold Drop Rate</span>
                    <input type="number" defaultValue="1.0" className="w-16 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-right text-gray-200 focus:outline-none focus:border-purple-500" />
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400">Gacha SSR Drop %</span>
                    <input type="number" defaultValue="0.6" className="w-16 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-right text-orange-400 font-bold focus:outline-none focus:border-purple-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Feature Flags</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] text-gray-300">
                    <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-purple-500 focus:ring-0" /> Enable Crossplay
                  </label>
                  <label className="flex items-center gap-2 text-[10px] text-gray-300">
                    <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-purple-500 focus:ring-0" /> Show Holiday Decor
                  </label>
                  <label className="flex items-center gap-2 text-[10px] text-gray-300">
                    <input type="checkbox" className="rounded bg-[#1a1a1c] border-[#3e3e42] text-purple-500 focus:ring-0" /> Enable Ranked Matchmaking
                  </label>
                </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
