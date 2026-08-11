import React, { useState } from 'react';
import { Server, Network, Activity, Globe, ShieldCheck, Database, Box, Play, RefreshCcw, LayoutDashboard, Terminal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateData = () => {
  return Array.from({ length: 20 }).map((_, i) => ({
    time: `10:${Math.floor(i / 60)}${i % 60}`,
    cpu: 30 + Math.random() * 40,
    ram: 40 + Math.random() * 20
  }));
};

export default function MultiplayerServerOrchestrator() {
  const [data] = useState(generateData());

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-700 p-1.5 rounded-lg shadow-lg">
            <Server size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Server <span className="text-indigo-400">Orchestrator</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Kubernetes & Agones Fleet Manager</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-gray-300 px-3 py-1.5 rounded text-xs font-bold transition-colors">
             <RefreshCcw size={14} /> REFRESH
           </button>
           <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-[0_0_10px_rgba(99,102,241,0.4)]">
             <Play size={14} /> DEPLOY FLEET
           </button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Fleets */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Network size={14}/> Active Fleets</h3>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {['US-East (Virginia)', 'EU-Central (Frankfurt)', 'AP-South (Singapore)'].map((region, i) => (
                <div key={i} className="bg-[#1a1a1c] border border-[#3e3e42] rounded p-3 space-y-2">
                  <div className="flex justify-between items-center border-b border-[#3e3e42] pb-2">
                    <span className="text-[10px] font-bold text-indigo-400">{region}</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Active Servers</span><span className="text-white">124</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Standing By</span><span className="text-white">12</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Center: Metrics & Logs */}
        <div className="flex-1 bg-[#1a1a1c] p-4 flex flex-col gap-4">
           {/* Stats */}
           <div className="grid grid-cols-4 gap-4 shrink-0">
             <div className="bg-[#252526] border border-[#3e3e42] p-4 rounded flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-100">1.2M</span>
                <span className="text-[10px] text-gray-500 uppercase">Global CCU</span>
             </div>
             <div className="bg-[#252526] border border-[#3e3e42] p-4 rounded flex flex-col items-center">
                <span className="text-2xl font-bold text-green-400">99.99%</span>
                <span className="text-[10px] text-gray-500 uppercase">Uptime</span>
             </div>
             <div className="bg-[#252526] border border-[#3e3e42] p-4 rounded flex flex-col items-center">
                <span className="text-2xl font-bold text-orange-400">32ms</span>
                <span className="text-[10px] text-gray-500 uppercase">Avg Matchmaking</span>
             </div>
             <div className="bg-[#252526] border border-[#3e3e42] p-4 rounded flex flex-col items-center">
                <span className="text-2xl font-bold text-indigo-400">4</span>
                <span className="text-[10px] text-gray-500 uppercase">Auto-Scale Events</span>
             </div>
           </div>

           {/* Graph */}
           <div className="flex-1 bg-[#252526] border border-[#3e3e42] rounded p-4 flex flex-col min-h-0">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Resource Utilization</h3>
             <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3e3e42" vertical={false} />
                    <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
                    <YAxis stroke="#6b7280" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1c', borderColor: '#3e3e42', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="cpu" stroke="#6366f1" fillOpacity={1} fill="url(#colorCpu)" />
                    <Area type="monotone" dataKey="ram" stroke="#10b981" fillOpacity={1} fill="url(#colorRam)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
           </div>

           {/* Logs */}
           <div className="h-32 bg-[#121212] border border-[#3e3e42] rounded p-2 overflow-y-auto font-mono text-[10px] text-gray-400">
             <div className="text-indigo-400">[AGONES] Allocating 50 new GameServer instances in US-East...</div>
             <div className="text-green-400">[K8S] Pod gs-match-492ab scheduling successful.</div>
             <div className="text-gray-500">[MATCHMAKER] Ticket resolved for 4 players. Routing to gs-match-112.</div>
             <div className="text-red-400">[HEALTH_CHECK] Pod gs-match-008 unresponsive. Terminating and replacing.</div>
             <div className="text-indigo-400">[AGONES] Fleet capacity at 85%. Triggering autoscaler policy.</div>
           </div>
        </div>
      </div>
    </div>
  );
}
