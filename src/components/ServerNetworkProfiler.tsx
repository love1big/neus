import React, { useState, useEffect } from 'react';
import { Activity, Server, Wifi, Shield, Settings, Play, Pause, Download, Trash2, ArrowDownUp, Globe, Box, Cpu, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Packet {
  id: string;
  time: string;
  type: 'TransformSync' | 'Event' | 'RPC' | 'Ping';
  size: number;
  latency: number;
}

const generateData = () => {
  return Array.from({ length: 30 }).map((_, i) => ({
    time: `10:${Math.floor(i / 60)}${i % 60}`,
    latency: 20 + Math.random() * 80 + (Math.random() > 0.9 ? 150 : 0), // Occasional spikes
    bandwidth: 15 + Math.random() * 10
  }));
};

export default function ServerNetworkProfiler() {
  const [isRecording, setIsRecording] = useState(true);
  const [data, setData] = useState(generateData());
  const [packets, setPackets] = useState<Packet[]>([]);

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString().split(' ')[0],
          latency: 20 + Math.random() * 80 + (Math.random() > 0.9 ? 150 : 0),
          bandwidth: 15 + Math.random() * 10
        }];
        return newData;
      });
      
      if (Math.random() > 0.5) {
        setPackets(prev => {
          const types: ('TransformSync' | 'Event' | 'RPC' | 'Ping')[] = ['TransformSync', 'Event', 'RPC', 'Ping'];
          const newPacket: Packet = {
            id: Math.random().toString(36).substr(2, 9),
            time: new Date().toLocaleTimeString().split(' ')[0],
            type: types[Math.floor(Math.random() * types.length)],
            size: Math.floor(Math.random() * 500) + 50,
            latency: Math.floor(Math.random() * 100) + 10
          };
          return [newPacket, ...prev].slice(0, 50);
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TransformSync': return 'text-blue-400 bg-blue-900/30 border-blue-500/50';
      case 'Event': return 'text-orange-400 bg-orange-900/30 border-orange-500/50';
      case 'RPC': return 'text-purple-400 bg-purple-900/30 border-purple-500/50';
      case 'Ping': return 'text-gray-400 bg-gray-900/30 border-gray-500/50';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-700 p-1.5 rounded-lg shadow-lg">
            <Globe size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Network <span className="text-cyan-400">Profiler</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Multiplayer & Latency Debugger</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setIsRecording(!isRecording)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-colors ${isRecording ? 'bg-orange-600/20 text-orange-400 border border-orange-600/50' : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]'}`}>
            {isRecording ? <Pause size={14} /> : <Play size={14} />} 
            {isRecording ? 'PAUSE RECORDING' : 'START RECORDING'}
          </button>
          <button onClick={() => { setPackets([]); setData(generateData()); }} className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-[#333] hover:bg-[#444] transition-colors">
            <Trash2 size={14} /> CLEAR DATA
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Server Info */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[5px_0_20px_rgba(0,0,0,0.3)]">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Server size={14}/> Server Status</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] text-gray-400">
                  <span>Region</span>
                  <span className="text-white font-bold">us-east-1 (Virginia)</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-400">
                  <span>Connection</span>
                  <span className="text-green-400 font-bold flex items-center gap-1"><Wifi size={10}/> SECURE WSS</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-400">
                  <span>Active Players</span>
                  <span className="text-white font-bold bg-black px-2 py-0.5 rounded border border-[#3e3e42]">24 / 64</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1 flex items-center gap-2">Tick Rate</h4>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Target</span>
                    <span className="font-mono text-white">60 Hz</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Current</span>
                    <span className="font-mono text-cyan-400 font-bold">59.8 Hz</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1 flex items-center gap-2">Bandwidth Limit</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Send (Up)</span>
                    <span className="font-mono">1.2 MB/s</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Receive (Down)</span>
                    <span className="font-mono">5.0 MB/s</span>
                  </div>
                </div>
              </div>

           </div>
        </div>

        {/* Center: Graphs */}
        <div className="flex-1 flex flex-col bg-[#1a1a1c] overflow-hidden">
          
          <div className="flex-1 border-b border-[#3e3e42] p-4 flex flex-col min-h-0">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Activity size={12}/> Latency (Ping) over Time (ms)</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3e3e42" vertical={false} />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={10} tickMargin={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#252526', borderColor: '#3e3e42', borderRadius: '4px', fontSize: '10px' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Area type="monotone" dataKey="latency" stroke="#06b6d4" fillOpacity={1} fill="url(#colorLatency)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex-1 p-4 flex flex-col min-h-0">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><ArrowDownUp size={12}/> Bandwidth Usage (KB/s)</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3e3e42" vertical={false} />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={10} tickMargin={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#252526', borderColor: '#3e3e42', borderRadius: '4px', fontSize: '10px' }}
                    itemStyle={{ color: '#8b5cf6' }}
                  />
                  <Area type="monotone" dataKey="bandwidth" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorBandwidth)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Panel: Packet Stream */}
        <div className="w-[350px] bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.5)]">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c] flex justify-between items-center">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Database size={14}/> Live Packet Stream</h3>
             <span className="text-[9px] bg-red-900/50 text-red-400 border border-red-500/50 px-1.5 py-0.5 rounded flex items-center gap-1">
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div> REC
             </span>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
             
             <table className="w-full text-left text-[10px]">
               <thead className="text-gray-500 uppercase sticky top-0 bg-[#252526] z-10">
                 <tr>
                   <th className="pb-2 font-bold w-16">Time</th>
                   <th className="pb-2 font-bold">Type</th>
                   <th className="pb-2 font-bold text-right">Size</th>
                   <th className="pb-2 font-bold text-right">Lat</th>
                 </tr>
               </thead>
               <tbody className="font-mono text-gray-300">
                 {packets.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="text-center text-gray-500 py-10">No packets recorded yet.</td>
                   </tr>
                 ) : (
                   packets.map((pkt, idx) => (
                     <tr key={idx} className="border-b border-[#3e3e42] hover:bg-[#333]">
                       <td className="py-1.5 text-gray-500">{pkt.time}</td>
                       <td className="py-1.5">
                         <span className={`px-1 py-0.5 rounded border ${getTypeColor(pkt.type)} text-[9px]`}>{pkt.type}</span>
                       </td>
                       <td className="py-1.5 text-right">{pkt.size} B</td>
                       <td className={`py-1.5 text-right ${pkt.latency > 100 ? 'text-red-400 font-bold' : pkt.latency > 50 ? 'text-yellow-400' : 'text-green-400'}`}>{pkt.latency}ms</td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>

           </div>
           
           <div className="p-3 border-t border-[#3e3e42] bg-[#1a1a1c]">
             <div className="flex gap-2">
               <button className="flex-1 py-1.5 bg-[#333] hover:bg-[#444] rounded text-[10px] font-bold text-gray-300 flex justify-center items-center gap-1 transition-colors">
                 <Filter size={12} /> FILTER
               </button>
               <button className="flex-1 py-1.5 bg-[#333] hover:bg-[#444] rounded text-[10px] font-bold text-gray-300 flex justify-center items-center gap-1 transition-colors">
                 <Download size={12} /> EXPORT CSV
               </button>
             </div>
           </div>
        </div>
      </div>
      
    </div>
  );
}

// Mock icon
const Filter = ({size, className}:any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;
