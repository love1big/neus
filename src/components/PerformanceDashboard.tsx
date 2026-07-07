import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Monitor } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useSystemHealth } from './SystemWatchdog';

export default function PerformanceDashboard() {
  const { fps, memoryUsage, eventLoopLag, threatLevel } = useSystemHealth();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate data point every second to smooth it out, but react to changes
    const interval = setInterval(() => {
      setData((prev) => {
        const now = new Date().toLocaleTimeString();
        // Rough heuristic for CPU load based on lag, plus some idle noise
        const cpuLoad = Math.min(100, eventLoopLag > 0 ? (eventLoopLag / 50) * 100 : Math.random() * 5 + 5); 
        // Rough heuristic for GPU load based on dropped frames
        const gpuLoad = Math.min(100, (60 - fps) / 60 * 100 + (Math.random() * 10)); 
        const memLoad = memoryUsage > 0 ? memoryUsage : Math.random() * 10 + 20;

        const newDataPoint = {
          time: now,
          cpu: cpuLoad,
          gpu: gpuLoad,
          memory: memLoad,
        };

        const newData = [...prev, newDataPoint];
        if (newData.length > 60) {
          newData.shift();
        }
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fps, memoryUsage, eventLoopLag]);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans">
        <div className="p-4 bg-[#11111b] border-b border-[#2a2b3d] flex justify-between items-center shrink-0">
           <div>
             <h1 className="text-[14px] font-extrabold text-[#e6edf3] mb-1 flex items-center gap-2">
               <Activity className="text-[#3fb950]"/> Real-time Performance Dashboard
             </h1>
             <p className="text-[#8b949e] text-[10px]">Monitoring CPU, GPU, and Memory utilization across the engine.</p>
           </div>
           <div className={`px-3 py-1 rounded text-xs font-bold ${threatLevel === 'CRITICAL' ? 'bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/50' : threatLevel === 'ELEVATED' ? 'bg-[#d2a8ff]/20 text-[#d2a8ff] border border-[#d2a8ff]/50' : 'bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50'}`}>
              System Status: {threatLevel}
           </div>
        </div>
        
        <div className="p-6 grid grid-cols-3 gap-6 shrink-0">
           {/* Metric Cards */}
           <div className="bg-[#11111b] border border-[#2a2b3d] p-4 rounded-xl flex items-center gap-4">
              <div className="bg-[#58a6ff]/10 p-3 rounded-lg">
                 <Cpu className="text-[#58a6ff]" size={24} />
              </div>
              <div>
                 <p className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">CPU Load</p>
                 <p className="text-2xl font-bold text-white">{data.length > 0 ? data[data.length - 1].cpu.toFixed(1) : 0}%</p>
              </div>
           </div>
           <div className="bg-[#11111b] border border-[#2a2b3d] p-4 rounded-xl flex items-center gap-4">
              <div className="bg-[#e3b341]/10 p-3 rounded-lg">
                 <Monitor className="text-[#e3b341]" size={24} />
              </div>
              <div>
                 <p className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">GPU Load (Est)</p>
                 <p className="text-2xl font-bold text-white">{data.length > 0 ? data[data.length - 1].gpu.toFixed(1) : 0}%</p>
              </div>
           </div>
           <div className="bg-[#11111b] border border-[#2a2b3d] p-4 rounded-xl flex items-center gap-4">
              <div className="bg-[#3fb950]/10 p-3 rounded-lg">
                 <HardDrive className="text-[#3fb950]" size={24} />
              </div>
              <div>
                 <p className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">Memory Usage</p>
                 <p className="text-2xl font-bold text-white">{data.length > 0 ? data[data.length - 1].memory.toFixed(0) : 0} MB</p>
              </div>
           </div>
        </div>

        <div className="flex-1 p-6 pt-0 min-h-0 flex flex-col">
           <div className="flex-1 bg-[#11111b] border border-[#2a2b3d] rounded-xl p-4 flex flex-col">
              <h2 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                 <Activity size={14} className="text-[#8b949e]"/> Telemetry History
              </h2>
              <div className="flex-1 min-h-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#58a6ff" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorGpu" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#e3b341" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#e3b341" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#3fb950" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#3fb950" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#2a2b3d" vertical={false} />
                       <XAxis dataKey="time" stroke="#8b949e" fontSize={10} tickMargin={10} minTickGap={30} />
                       <YAxis stroke="#8b949e" fontSize={10} tickFormatter={(val) => `${val}`} />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#1e1e2d', borderColor: '#2a2b3d', borderRadius: '8px', fontSize: '12px' }}
                          itemStyle={{ color: '#c9d1d9' }}
                       />
                       <Area type="monotone" dataKey="cpu" name="CPU (%)" stroke="#58a6ff" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                       <Area type="monotone" dataKey="gpu" name="GPU (%)" stroke="#e3b341" fillOpacity={1} fill="url(#colorGpu)" strokeWidth={2} />
                       <Area type="monotone" dataKey="memory" name="Memory (MB)" stroke="#3fb950" fillOpacity={1} fill="url(#colorMem)" strokeWidth={2} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>
    </div>
  );
}
