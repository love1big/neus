import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Activity, Server, AlertTriangle, ShieldCheck, Database, Download, Cloud, Globe, BarChart2, PieChart} from 'lucide-react';

export default function LiveOpsDashboard() {
  const [timeframe, setTimeframe] = useState('24h');

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#bc8cff]/10 rounded text-[#bc8cff]"><TrendingUp size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">LiveOps & Analytics Command Center</h2>
              <p className="text-[10px] text-[#8b949e]">Real-time Telemetry, Economy Balancing, and Server Health</p>
            </div>
         </div>
         
         <div className="flex items-center justify-center gap-1 bg-[#0d1117] border border-[#30363d] rounded p-1 text-[11px] font-bold">
            <button onClick={() => setTimeframe('1h')} className={`px-2 py-1 rounded transition-colors ${timeframe === '1h' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white'}`}>1H</button>
            <button onClick={() => setTimeframe('24h')} className={`px-2 py-1 rounded transition-colors ${timeframe === '24h' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white'}`}>24H</button>
            <button onClick={() => setTimeframe('7d')} className={`px-2 py-1 rounded transition-colors ${timeframe === '7d' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white'}`}>7D</button>
            <button onClick={() => setTimeframe('30d')} className={`px-2 py-1 rounded transition-colors ${timeframe === '30d' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white'}`}>30D</button>
         </div>

         <div className="flex gap-2 text-[11px] font-bold">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors text-[#58a6ff]"><Download size={12}/> Export CSV</button>
            <button className="px-3 py-1.5 bg-[#f85149]/20 hover:bg-[#f85149]/30 text-[#f85149] border border-[#f85149]/50 rounded flex items-center gap-2 transition-colors"><AlertTriangle size={12}/> Send Global Alert</button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">
         
         {/* Top KPI Cards */}
         <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-2">
               <div className="flex items-center justify-between text-[#8b949e]">
                  <span className="font-bold text-[11px] uppercase tracking-wide">Concurrent Users (CCU)</span>
                  <Users size={14} className="text-[#58a6ff]" />
               </div>
               <div className="text-3xl font-bold text-white font-mono">14,285</div>
               <div className="text-[10px] text-[#3fb950] font-bold flex items-center gap-1"><TrendingUp size={10}/> +12% vs last hour</div>
            </div>
            
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-2">
               <div className="flex items-center justify-between text-[#8b949e]">
                  <span className="font-bold text-[11px] uppercase tracking-wide">Daily Revenue (IAP)</span>
                  <DollarSign size={14} className="text-[#3fb950]" />
               </div>
               <div className="text-3xl font-bold text-white font-mono">$42,105</div>
               <div className="text-[10px] text-[#3fb950] font-bold flex items-center gap-1"><TrendingUp size={10}/> +5.2% vs yesterday</div>
            </div>

            <div className="bg-[#161b22] border border-[#f85149]/50 shadow-[0_0_15px_rgba(248,81,73,0.1)] rounded-lg p-4 flex flex-col gap-2">
               <div className="flex items-center justify-between text-[#8b949e]">
                  <span className="font-bold text-[11px] uppercase tracking-wide text-[#f85149]">Crash Rate (Critical)</span>
                  <AlertTriangle size={14} className="text-[#f85149]" />
               </div>
               <div className="text-3xl font-bold text-[#f85149] font-mono">2.4%</div>
               <div className="text-[10px] text-[#f85149] font-bold flex items-center gap-1"><TrendingUp size={10}/> Spike detected in EU-West</div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-2">
               <div className="flex items-center justify-between text-[#8b949e]">
                  <span className="font-bold text-[11px] uppercase tracking-wide">Server Health (Global)</span>
                  <Server size={14} className="text-[#e3b341]" />
               </div>
               <div className="text-3xl font-bold text-white font-mono">99.98%</div>
               <div className="text-[10px] text-[#8b949e] font-bold flex items-center gap-1">Average Ping: 42ms</div>
            </div>
         </div>

         <div className="grid grid-cols-3 gap-4 h-[300px]">
            {/* Main Graph (CCU over time) */}
            <div className="col-span-2 bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col relative">
               <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-[11px] uppercase tracking-wide text-[#c9d1d9] flex items-center gap-2"><Activity size={14}/> Active Players Over Time</span>
               </div>
               {/* Mock Graph using SVG */}
               <div className="flex-1 border-b border-l border-[#30363d] relative mt-2">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                     <path d="M0,200 C50,150 100,220 150,180 C200,140 250,50 300,100 C350,150 400,120 450,80 C500,40 550,60 600,20 L600,250 L0,250 Z" fill="rgba(88, 166, 255, 0.1)" stroke="none" />
                     <path d="M0,200 C50,150 100,220 150,180 C200,140 250,50 300,100 C350,150 400,120 450,80 C500,40 550,60 600,20" fill="none" stroke="#58a6ff" strokeWidth="3" vectorEffect="non-scaling-stroke"/>
                  </svg>
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                     <div className="h-px bg-[#8b949e] w-full"></div>
                     <div className="h-px bg-[#8b949e] w-full"></div>
                     <div className="h-px bg-[#8b949e] w-full"></div>
                     <div className="h-px bg-[#8b949e] w-full"></div>
                  </div>
               </div>
               <div className="flex justify-between text-[9px] text-[#8b949e] mt-1 font-mono">
                  <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
               </div>
            </div>

            {/* AI Economy Balancer */}
            <div className="bg-[#bc8cff]/5 border border-[#bc8cff]/30 rounded-lg p-4 flex flex-col relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Database size={100} /></div>
               <div className="flex justify-between items-center mb-4 relative z-10">
                  <span className="font-bold text-[11px] uppercase tracking-wide text-[#bc8cff] flex items-center gap-2"><Globe size={14}/> AI Economy Watchdog</span>
               </div>
               
               <div className="flex-1 flex flex-col gap-3 relative z-10 custom-scrollbar overflow-y-auto">
                  <div className="bg-[#0d1117] border border-[#f85149]/50 rounded p-3">
                     <div className="text-[10px] text-[#f85149] font-bold uppercase mb-1 flex items-center gap-1"><AlertTriangle size={10}/> Inflation Alert</div>
                     <p className="text-[11px] text-[#c9d1d9] leading-snug">"Gold Coins" supply increased by 400% in Sector 4. Likely exploit related to Quest ID "GoblinCave_04".</p>
                     <button className="mt-2 text-[10px] bg-[#f85149]/20 hover:bg-[#f85149]/30 text-white px-2 py-1 rounded w-full border border-[#f85149]/30 transition-colors">Disable Quest Temporarily</button>
                  </div>
                  <div className="bg-[#0d1117] border border-[#e3b341]/50 rounded p-3">
                     <div className="text-[10px] text-[#e3b341] font-bold uppercase mb-1 flex items-center gap-1"><ShieldCheck size={10}/> Shop Recommendation</div>
                     <p className="text-[11px] text-[#c9d1d9] leading-snug">Player retention drops after level 10. Recommend discounting "XP Boost Potion" by 15% for returning players.</p>
                     <button className="mt-2 text-[10px] bg-[#e3b341]/20 hover:bg-[#e3b341]/30 text-white px-2 py-1 rounded w-full border border-[#e3b341]/30 transition-colors">Apply Dynamic Pricing</button>
                  </div>
               </div>
            </div>
         </div>

         {/* Bottom Action Bar */}
         <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3fb950] shadow-[0_0_8px_#3fb950]"></div>
                  <span className="text-[11px] font-bold text-[#c9d1d9]">Matchmaking Services Online</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3fb950] shadow-[0_0_8px_#3fb950]"></div>
                  <span className="text-[11px] font-bold text-[#c9d1d9]">Database Clusters Healthy</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#e3b341] shadow-[0_0_8px_#e3b341]"></div>
                  <span className="text-[11px] font-bold text-[#e3b341]">High Latency (EU-Frankfurt)</span>
               </div>
            </div>
            <button className="text-[11px] font-bold bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30 px-4 py-2 rounded transition-colors flex items-center gap-2">
               <Cloud size={14}/> Provision More Servers
            </button>
         </div>

      </div>
    </div>
  );
}
