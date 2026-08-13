import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Cpu, HardDrive, AlertTriangle, Zap, Server, BarChart3, ShieldAlert, RefreshCw, TerminalSquare } from 'lucide-react';
import { useSystemHealth } from './SystemWatchdog';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricHistory {
  time: string;
  fps: number;
  memory: number;
  cpuLag: number;
}

export default function PerformanceDashboard() {
  const { fps, memoryUsage, eventLoopLag, threatLevel, isThrottled, activeWarnings, triggerPanic } = useSystemHealth();
  const [history, setHistory] = useState<MetricHistory[]>([]);
  const [isRecording, setIsRecording] = useState(true);

  // Sample data every second
  useEffect(() => {
    if (!isRecording) return;
    
    const interval = setInterval(() => {
      setHistory(prev => {
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const newPoint: MetricHistory = {
          time: timeStr,
          fps,
          memory: parseFloat(memoryUsage.toFixed(1)),
          cpuLag: parseFloat(eventLoopLag.toFixed(1))
        };
        const next = [...prev, newPoint];
        if (next.length > 60) next.shift(); // Keep last 60 data points (60 seconds)
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fps, memoryUsage, eventLoopLag, isRecording]);

  const getThreatColor = (level: string) => {
    switch(level) {
      case 'NORMAL': return 'text-[#3fb950] border-[#3fb950]/30 bg-[#3fb950]/10';
      case 'ELEVATED': return 'text-[#d29922] border-[#d29922]/30 bg-[#d29922]/10';
      case 'CRITICAL': return 'text-[#f85149] border-[#f85149]/30 bg-[#f85149]/10';
      default: return 'text-[#8b949e] border-[#30363d] bg-[#161b22]';
    }
  };

  const threatColorClass = getThreatColor(threatLevel);

  return (
    <div className="w-full h-full bg-[#0d1117] text-[#c9d1d9] flex flex-col font-mono overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Server size={18} className="text-[#58a6ff]" />
          <h1 className="text-[14px] font-bold tracking-wide uppercase text-white shadow-[#58a6ff]">NexusEngine Telemetry</h1>
          <div className={`ml-4 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border flex items-center gap-2 ${threatColorClass}`}>
            <Activity size={12} />
            {threatLevel} STATUS
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsRecording(!isRecording)} 
             className={`px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-2 transition ${isRecording ? 'bg-[#238636] hover:bg-[#2ea043] text-white' : 'bg-[#21262d] hover:bg-[#30363d] text-[#8b949e]'}`}
           >
             {isRecording ? <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> : <div className="w-2 h-2 rounded-full bg-[#8b949e]" />}
             {isRecording ? 'REC' : 'PAUSED'}
           </button>
           <button 
             onClick={() => triggerPanic("Manual diagnostics panic triggered by user from Performance Dashboard.")}
             className="px-3 py-1.5 bg-[#21262d] hover:bg-[#f85149] hover:text-white border border-[#30363d] hover:border-[#f85149] rounded text-[11px] font-bold transition flex items-center gap-2 text-[#8b949e]"
           >
             <AlertTriangle size={12} /> Test Panic
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        
        {/* Top KPI Cards */}
        <div className="grid grid-cols-3 gap-6">
          {/* FPS Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#58a6ff]/50 transition-colors">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#58a6ff] to-transparent opacity-50" />
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-[#8b949e] font-bold text-[12px] uppercase tracking-wider">
                  <Zap size={14} className="text-[#58a6ff]" /> Render Engine (FPS)
                </div>
                <div className={`text-[10px] px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d] ${fps < 30 ? 'text-[#f85149]' : 'text-[#3fb950]'}`}>
                  {fps >= 60 ? 'OPTIMAL' : fps >= 30 ? 'STABLE' : 'DEGRADED'}
                </div>
             </div>
             <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-black ${fps < 30 ? 'text-[#f85149]' : 'text-white'}`}>{fps}</span>
                <span className="text-[#8b949e] text-[12px]">Hz</span>
             </div>
             <div className="text-[11px] text-[#8b949e] mt-4 flex justify-between">
                <span>Target: 60 FPS</span>
                <span>Avg: {history.length ? Math.round(history.reduce((a, b) => a + b.fps, 0) / history.length) : fps} FPS</span>
             </div>
          </div>

          {/* Memory Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#d29922]/50 transition-colors">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d29922] to-transparent opacity-50" />
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-[#8b949e] font-bold text-[12px] uppercase tracking-wider">
                  <HardDrive size={14} className="text-[#d29922]" /> JS Heap Memory
                </div>
                <div className={`text-[10px] px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d] ${memoryUsage > 1000 ? 'text-[#f85149]' : 'text-[#3fb950]'}`}>
                  {memoryUsage > 1000 ? 'HIGH USAGE' : memoryUsage > 500 ? 'MODERATE' : 'OPTIMAL'}
                </div>
             </div>
             <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{memoryUsage.toFixed(0)}</span>
                <span className="text-[#8b949e] text-[12px]">MB</span>
             </div>
             <div className="text-[11px] text-[#8b949e] mt-4 flex justify-between">
                <span>Limit: 2000 MB</span>
                <span>Peak: {history.length ? Math.max(...history.map(h => h.memory)) : memoryUsage.toFixed(0)} MB</span>
             </div>
          </div>

          {/* CPU Lag Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#f85149]/50 transition-colors">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f85149] to-transparent opacity-50" />
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-[#8b949e] font-bold text-[12px] uppercase tracking-wider">
                  <Cpu size={14} className="text-[#f85149]" /> Event Loop Lag
                </div>
                <div className={`text-[10px] px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d] ${eventLoopLag > 50 ? 'text-[#f85149]' : 'text-[#3fb950]'}`}>
                  {eventLoopLag > 100 ? 'SATURATED' : eventLoopLag > 50 ? 'ELEVATED' : 'IDLE'}
                </div>
             </div>
             <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-black ${eventLoopLag > 50 ? 'text-[#f85149]' : 'text-white'}`}>{eventLoopLag.toFixed(1)}</span>
                <span className="text-[#8b949e] text-[12px]">ms</span>
             </div>
             <div className="text-[11px] text-[#8b949e] mt-4 flex justify-between">
                <span>Throttle: {'>'}150ms</span>
                <span className="flex items-center gap-1">
                  Throttling: <span className={isThrottled ? 'text-[#f85149] font-bold' : 'text-[#3fb950]'}>{isThrottled ? 'ACTIVE' : 'OFF'}</span>
                </span>
             </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
          {/* FPS & CPU Overlays */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-2"><BarChart3 size={14} /> Render & Thread Performance</h3>
             </div>
             <div className="flex-1 w-full min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={history} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorFps" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#58a6ff" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorLag" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#f85149" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#f85149" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                   <XAxis dataKey="time" stroke="#8b949e" fontSize={10} tickMargin={10} minTickGap={30} />
                   <YAxis yAxisId="left" stroke="#58a6ff" fontSize={10} domain={[0, 65]} />
                   <YAxis yAxisId="right" orientation="right" stroke="#f85149" fontSize={10} domain={[0, 200]} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#0d1117', borderColor: '#30363d', borderRadius: '8px', fontSize: '11px', color: '#c9d1d9' }} 
                     itemStyle={{ fontWeight: 'bold' }}
                   />
                   <Area yAxisId="left" type="monotone" dataKey="fps" name="FPS" stroke="#58a6ff" strokeWidth={2} fillOpacity={1} fill="url(#colorFps)" isAnimationActive={false} />
                   <Area yAxisId="right" type="monotone" dataKey="cpuLag" name="CPU Lag (ms)" stroke="#f85149" strokeWidth={2} fillOpacity={1} fill="url(#colorLag)" isAnimationActive={false} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Memory Usage */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-2"><HardDrive size={14} /> JS Heap Allocation (MB)</h3>
             </div>
             <div className="flex-1 w-full min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={history} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#d29922" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#d29922" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                   <XAxis dataKey="time" stroke="#8b949e" fontSize={10} tickMargin={10} minTickGap={30} />
                   <YAxis stroke="#d29922" fontSize={10} domain={['auto', 'auto']} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#0d1117', borderColor: '#30363d', borderRadius: '8px', fontSize: '11px', color: '#c9d1d9' }} 
                     itemStyle={{ fontWeight: 'bold', color: '#d29922' }}
                   />
                   <Area type="monotone" dataKey="memory" name="Memory (MB)" stroke="#d29922" strokeWidth={2} fillOpacity={1} fill="url(#colorMem)" isAnimationActive={false} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Console / Active Warnings */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col h-[250px]">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-2"><TerminalSquare size={14} /> Diagnostic Console</h3>
              <div className="text-[11px] text-[#8b949e]">Total Active Alerts: {activeWarnings.length}</div>
           </div>
           
           <div className="flex-1 bg-[#0d1117] rounded border border-[#30363d] overflow-y-auto p-3 font-mono text-[11px] space-y-2">
             {activeWarnings.length === 0 ? (
               <div className="text-[#8b949e] flex items-center gap-2 h-full justify-center italic">
                 <ShieldAlert size={14} /> No active warnings. System running optimally.
               </div>
             ) : (
               activeWarnings.map((warn, i) => (
                 <div key={i} className="text-[#f85149] bg-[#f85149]/10 border-l-2 border-[#f85149] pl-2 py-1 flex items-start gap-2">
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                    <span>[{new Date().toISOString().split('T')[1].slice(0, -1)}] {warn}</span>
                 </div>
               ))
             )}
             
             {/* Simulated diagnostic trace log */}
             <div className="text-[#8b949e] opacity-50">
               {history.length > 0 && `> Watchdog telemetry streaming... [${history[history.length - 1].time}]`}
             </div>
           </div>
        </div>
        
      </div>
    </div>
  );
}
