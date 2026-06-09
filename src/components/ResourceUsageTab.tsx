import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Cpu, Server, Activity } from 'lucide-react';

export default function ResourceUsageTab() {
  const [data, setData] = useState<{time: string, cpu: number, ram: number, gpu: number}[]>([]);

  useEffect(() => {
    // Generate initial data
    const initialData = [];
    const now = new Date();
    for (let i = 60; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 1000);
      initialData.push({
        time: t.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
        cpu: 20 + Math.random() * 10,
        ram: 40 + Math.random() * 5,
        gpu: 15 + Math.random() * 15,
      });
    }
    setData(initialData);

    const interval = setInterval(() => {
      setData(prev => {
        const newTime = new Date();
        const prevCpu = prev[prev.length - 1].cpu;
        const prevRam = prev[prev.length - 1].ram;
        const prevGpu = prev[prev.length - 1].gpu;
        
        let newCpu = prevCpu + (Math.random() - 0.5) * 8;
        let newRam = prevRam + (Math.random() - 0.5) * 2;
        let newGpu = prevGpu + (Math.random() - 0.5) * 12;
        
        if (newCpu < 5) newCpu = 5; if (newCpu > 100) newCpu = 100;
        if (newRam < 10) newRam = 10; if (newRam > 100) newRam = 100;
        if (newGpu < 0) newGpu = 0; if (newGpu > 100) newGpu = 100;

        return [...prev.slice(1), {
          time: newTime.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
          cpu: newCpu,
          ram: newRam,
          gpu: newGpu
        }];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const latest = data.length > 0 ? data[data.length - 1] : { cpu: 0, ram: 0, gpu: 0 };

  return (
    <div className="flex-1 flex flex-col p-4 font-sans h-full min-h-0 bg-[#0d1117] text-[#c9d1d9]">
      <div className="flex gap-6 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center">
            <Cpu className="text-[#58a6ff]" size={20} />
          </div>
          <div>
            <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">CPU Usage</div>
            <div className="text-xl font-mono text-[#58a6ff] leading-none">{latest.cpu.toFixed(1)}%</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center">
            <Server className="text-[#3fb950]" size={20} />
          </div>
          <div>
            <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">RAM Usage</div>
            <div className="text-xl font-mono text-[#3fb950] leading-none">{latest.ram.toFixed(1)}%</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center">
            <Activity className="text-[#f85149]" size={20} />
          </div>
          <div>
            <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">GPU Usage</div>
            <div className="text-xl font-mono text-[#f85149] leading-none">{latest.gpu.toFixed(1)}%</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-[#161b22] rounded border border-[#30363d] p-4 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            <XAxis dataKey="time" stroke="#8b949e" tick={{fill: '#8b949e', fontSize: 10}} minTickGap={30} tickMargin={10} />
            <YAxis domain={[0, 100]} stroke="#8b949e" tick={{fill: '#8b949e', fontSize: 10}} width={30} tickFormatter={(v) => `${v}%`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '4px', fontSize: '12px' }}
              itemStyle={{ fontFamily: 'monospace' }}
              labelStyle={{ color: '#8b949e', marginBottom: '8px' }}
            />
            <Line type="monotone" dataKey="cpu" name="CPU" stroke="#58a6ff" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="ram" name="RAM" stroke="#3fb950" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="gpu" name="GPU" stroke="#f85149" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
