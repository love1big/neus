import React, { useState } from 'react';
import { DollarSign, BarChart2, TrendingUp, Users, Settings, Plus, ShoppingCart, RefreshCw, Zap, ShieldAlert, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const arpuData = Array.from({ length: 30 }).map((_, i) => ({
  day: `Day ${i + 1}`,
  ARPU: 1.2 + Math.random() * 0.8 + (i * 0.05),
  ARPPU: 12.5 + Math.random() * 5 + (i * 0.2)
}));

const economyData = [
  { name: 'Hard Currency (Gems)', amount: 15420000 },
  { name: 'Soft Currency (Coins)', amount: 8400000000 },
  { name: 'Energy (Stamina)', amount: 420000 },
];

export default function EconomyLiveOpsEditor() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-1.5 rounded-lg shadow-lg">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">LiveOps <span className="text-emerald-400">Economy Director</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">A/B Testing, Monetization & Inflation Control</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="bg-[#333] hover:bg-[#444] px-3 py-1.5 rounded text-[10px] font-bold text-gray-300 transition-colors flex items-center gap-2">
             <RefreshCw size={14}/> SYNC CATALOG
           </button>
           <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-[10px] font-bold transition-colors shadow-[0_0_10px_rgba(16,185,129,0.4)]">
             <Zap size={14}/> PUSH LIVE UPDATE
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Store Catalog & A/B Tests */}
        <div className="w-80 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c] flex justify-between items-center">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><ShoppingCart size={14}/> Store Catalog</h3>
             <button className="text-emerald-400 hover:text-emerald-300"><Plus size={14}/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
             
             {/* Bundles */}
             <div className="bg-[#1a1a1c] border border-[#3e3e42] rounded p-2">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex justify-between">
                  <span>Starter Pack (SKU: SP_01)</span>
                  <span className="text-gray-500">$4.99</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-300 mb-2">
                  <span className="bg-[#333] px-1.5 py-0.5 rounded text-white flex items-center gap-1"><Award size={10}/> 500 Gems</span>
                  <span className="bg-[#333] px-1.5 py-0.5 rounded text-white">+ Exclusive Skin</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#3e3e42] pt-2 mt-1">
                   <div className="text-[9px] text-gray-500 flex items-center gap-1">
                     <Users size={10}/> 24.5k Purchases (7D)
                   </div>
                   <span className="text-[9px] font-bold text-green-400">Active</span>
                </div>
             </div>

             <div className="bg-[#1a1a1c] border border-blue-500/50 rounded p-2 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 flex justify-between">
                  <span>Weekend Sale [A/B Test]</span>
                  <span className="text-gray-500">Var A: $9.99 / Var B: $14.99</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-300 mb-2">
                  <span className="bg-[#333] px-1.5 py-0.5 rounded text-white">1200 Gems</span>
                  <span className="bg-[#333] px-1.5 py-0.5 rounded text-white">2x Exp Boost</span>
                </div>
                <div className="flex justify-between items-center border-t border-blue-500/30 pt-2 mt-1">
                   <div className="text-[9px] text-gray-500 flex items-center gap-1">
                     <BarChart2 size={10}/> Var A +14% LTV
                   </div>
                   <span className="text-[9px] font-bold text-blue-400">Testing (62%)</span>
                </div>
             </div>

             <div className="bg-[#1a1a1c] border border-[#3e3e42] rounded p-2 opacity-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex justify-between">
                  <span>Whale Pack (SKU: WP_99)</span>
                  <span className="text-gray-500">$99.99</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-300 mb-2">
                  <span className="bg-[#333] px-1.5 py-0.5 rounded text-white">15000 Gems</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#3e3e42] pt-2 mt-1">
                   <div className="text-[9px] text-gray-500 flex items-center gap-1">
                     <ShieldAlert size={10}/> Pending Approval
                   </div>
                   <span className="text-[9px] font-bold text-yellow-500">Draft</span>
                </div>
             </div>

          </div>
        </div>

        {/* Center Dashboard */}
        <div className="flex-1 bg-[#121212] relative flex flex-col overflow-hidden">
           
           {/* Top KPIs */}
           <div className="h-24 bg-[#1a1a1c] border-b border-[#3e3e42] p-4 flex gap-4 shrink-0">
             
             <div className="flex-1 bg-[#252526] rounded border border-[#3e3e42] p-3 flex flex-col justify-between">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Daily Active Users (DAU)</div>
               <div className="flex items-end justify-between">
                 <div className="text-2xl font-bold text-white font-mono">1.24M</div>
                 <div className="text-[10px] text-green-400 font-bold flex items-center gap-1"><TrendingUp size={12}/> +4.2%</div>
               </div>
             </div>

             <div className="flex-1 bg-[#252526] rounded border border-[#3e3e42] p-3 flex flex-col justify-between">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Daily Revenue</div>
               <div className="flex items-end justify-between">
                 <div className="text-2xl font-bold text-emerald-400 font-mono">$342,500</div>
                 <div className="text-[10px] text-green-400 font-bold flex items-center gap-1"><TrendingUp size={12}/> +12.5%</div>
               </div>
             </div>

             <div className="flex-1 bg-[#252526] rounded border border-[#3e3e42] p-3 flex flex-col justify-between">
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ARPU (Average Revenue Per User)</div>
               <div className="flex items-end justify-between">
                 <div className="text-2xl font-bold text-blue-400 font-mono">$0.27</div>
                 <div className="text-[10px] text-green-400 font-bold flex items-center gap-1"><TrendingUp size={12}/> +0.02</div>
               </div>
             </div>

           </div>

           {/* Charts */}
           <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              
              <div className="h-64 bg-[#1a1a1c] rounded border border-[#3e3e42] p-4 flex flex-col">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">ARPU vs ARPPU (Last 30 Days)</h4>
                 <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={arpuData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3e3e42" vertical={false} />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={9} />
                        <YAxis stroke="#6b7280" fontSize={9} yAxisId="left" />
                        <YAxis stroke="#6b7280" fontSize={9} yAxisId="right" orientation="right" />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#252526', borderColor: '#3e3e42', fontSize: '10px' }} />
                        <Line yAxisId="left" type="monotone" dataKey="ARPU" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="ARPPU" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="flex gap-4 h-64">
                
                {/* Inflation Monitor */}
                <div className="flex-1 bg-[#1a1a1c] rounded border border-[#3e3e42] p-4 flex flex-col">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <ShieldAlert size={14} className="text-red-400"/> Currency Inflation Monitor
                   </h4>
                   <div className="flex-1 min-h-0 flex flex-col gap-2 justify-center text-[10px]">
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-gray-300">
                           <span>Hard Currency Sinks</span>
                           <span className="text-green-400">Healthy (Ratio: 1.2 : 1)</span>
                        </div>
                        <div className="w-full bg-[#3e3e42] h-2 rounded-full overflow-hidden">
                           <div className="bg-green-500 h-full w-[60%]"></div>
                        </div>
                      </div>

                      <div className="space-y-1 mt-4">
                        <div className="flex justify-between text-gray-300">
                           <span>Soft Currency Sinks</span>
                           <span className="text-red-400">Inflation Warning (Ratio: 0.8 : 1)</span>
                        </div>
                        <div className="w-full bg-[#3e3e42] h-2 rounded-full overflow-hidden">
                           <div className="bg-red-500 h-full w-[35%]"></div>
                        </div>
                        <div className="text-[9px] text-gray-500">Players are generating soft currency faster than they can spend it. Recommend increasing gold costs for upgrades.</div>
                      </div>

                   </div>
                </div>

                {/* Event Calendar Mock */}
                <div className="flex-1 bg-[#1a1a1c] rounded border border-[#3e3e42] p-4 flex flex-col">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Upcoming Live Events</h4>
                   <div className="flex-1 min-h-0 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                      <div className="bg-[#252526] border-l-2 border-emerald-500 p-2 rounded text-[10px]">
                         <div className="font-bold text-white">Season 4 Battle Pass Launch</div>
                         <div className="text-emerald-400 mt-1">Starts in 2 Days</div>
                      </div>
                      <div className="bg-[#252526] border-l-2 border-blue-500 p-2 rounded text-[10px]">
                         <div className="font-bold text-white">Double EXP Weekend</div>
                         <div className="text-blue-400 mt-1">Starts in 5 Days</div>
                      </div>
                      <div className="bg-[#252526] border-l-2 border-purple-500 p-2 rounded text-[10px]">
                         <div className="font-bold text-white">Limited Time Gacha: Cyber Ninja</div>
                         <div className="text-purple-400 mt-1">Starts in 12 Days</div>
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
