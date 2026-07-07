import React from 'react';
import { Activity, Users, MousePointerClick, TrendingUp, BarChart2, PieChart } from 'lucide-react';

export default function AdvancedAnalyticsTelemetry() {
  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0f] text-gray-200 font-sans overflow-y-auto">
      <div className="p-6 max-w-6xl mx-auto w-full flex flex-col gap-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2"><Activity className="text-blue-500"/> Live Game Telemetry</h1>
               <p className="text-sm text-gray-400">Real-time player behavior and performance metrics.</p>
            </div>
            <div className="flex gap-2 text-xs">
               <select className="bg-[#141525] border border-[#2a2b3d] rounded px-3 py-2 text-white outline-none">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
               </select>
            </div>
         </div>

         {/* KPIs */}
         <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-xl flex flex-col gap-2">
               <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase">Concurrent Players (CCU)</span>
                  <Users size={16}/>
               </div>
               <span className="text-3xl font-mono text-white">4,281</span>
               <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded w-max">+12% vs last hour</span>
            </div>
            <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-xl flex flex-col gap-2">
               <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase">Avg Session Length</span>
                  <Activity size={16}/>
               </div>
               <span className="text-3xl font-mono text-white">42m 15s</span>
               <span className="text-[10px] text-gray-500 font-bold bg-gray-500/10 px-2 py-0.5 rounded w-max">Stable</span>
            </div>
            <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-xl flex flex-col gap-2">
               <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase">Crash Free Sessions</span>
                  <TrendingUp size={16}/>
               </div>
               <span className="text-3xl font-mono text-emerald-400">99.4%</span>
               <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded w-max">Target: 99.0%</span>
            </div>
            <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-xl flex flex-col gap-2">
               <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase">Total Revenue (24h)</span>
                  <span className="font-bold text-yellow-500">$</span>
               </div>
               <span className="text-3xl font-mono text-white">$12,450</span>
               <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded w-max">+5.2% vs yesterday</span>
            </div>
         </div>

         {/* Charts Row */}
         <div className="grid grid-cols-2 gap-6">
            {/* Chart 1 */}
            <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-xl flex flex-col gap-4 h-80">
               <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2"><BarChart2 size={16}/> Daily Active Users (DAU)</h3>
               <div className="flex-1 relative border-l border-b border-[#2a2b3d] ml-4 mb-4">
                  <div className="absolute inset-0 flex items-end justify-between px-2 pt-4">
                     {/* Mock bars */}
                     {[40, 60, 45, 80, 95, 85, 100].map((h, i) => (
                        <div key={i} className="w-8 bg-blue-500/80 rounded-t hover:bg-blue-400 transition-colors" style={{height: `${h}%`}}></div>
                     ))}
                  </div>
                  <div className="absolute -bottom-6 w-full flex justify-between text-[10px] text-gray-500 font-mono px-2">
                     <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
               </div>
            </div>

            {/* Funnel / Pie Chart */}
            <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-xl flex flex-col gap-4 h-80">
               <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2"><MousePointerClick size={16}/> Tutorial Completion Funnel</h3>
               <div className="flex-1 flex flex-col justify-center gap-2 px-8">
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-xs text-gray-400"><span>Started Tutorial</span> <span>100%</span></div>
                     <div className="w-full h-4 bg-[#2a2b3d] rounded-full overflow-hidden"><div className="w-full h-full bg-blue-500"></div></div>
                  </div>
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-xs text-gray-400"><span>Completed Combat Basics</span> <span>85%</span></div>
                     <div className="w-full h-4 bg-[#2a2b3d] rounded-full overflow-hidden"><div className="w-[85%] h-full bg-blue-400"></div></div>
                  </div>
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-xs text-gray-400"><span>Completed Inventory Mgmt</span> <span>72%</span></div>
                     <div className="w-full h-4 bg-[#2a2b3d] rounded-full overflow-hidden"><div className="w-[72%] h-full bg-blue-300"></div></div>
                  </div>
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-xs text-gray-400"><span>Finished Tutorial</span> <span>68%</span></div>
                     <div className="w-full h-4 bg-[#2a2b3d] rounded-full overflow-hidden"><div className="w-[68%] h-full bg-green-500"></div></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
