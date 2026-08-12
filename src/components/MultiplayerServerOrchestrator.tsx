import React, { useState } from 'react';
import { Server, Activity, Network, ShieldAlert, Cpu, Globe, Zap, Users, Play, Radio, Wifi, ArrowRightLeft, ShieldCheck, Database, FileCode2 } from 'lucide-react';

export default function MultiplayerServerOrchestrator() {
  const [activeTab, setActiveTab] = useState('topology');
  const [latency, setLatency] = useState(45);
  const [packetLoss, setPacketLoss] = useState(0);

  const nodes = [
    { id: 'S1', label: 'Dedicated Server', type: 'server', x: 50, y: 20 },
    { id: 'C1', label: 'Client 1 (Host)', type: 'client', x: 20, y: 70 },
    { id: 'C2', label: 'Client 2', type: 'client', x: 50, y: 85 },
    { id: 'C3', label: 'Client 3', type: 'client', x: 80, y: 70 },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#58a6ff]/20 border border-[#58a6ff]/50 rounded">
            <Server className="text-[#58a6ff]" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">Multiplayer Netcode & RPC Architect</h1>
            <p className="text-[10px] text-[#8b949e]">Server-Authoritative State & RPC Routing Simulator</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
            <Activity size={14} /> Profile Bandwidth
          </button>
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b]">
            <Play size={14} /> Start Local Server
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-64 flex flex-col bg-[#161b22] border-r border-[#30363d]">
          <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] flex items-center gap-2">
            <Network size={14} /> NETCODE MODULES
          </div>
          <div className="flex-1 overflow-y-auto">
            <button 
              onClick={() => setActiveTab('topology')}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 border-l-2 ${activeTab === 'topology' ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-[#58a6ff]' : 'border-transparent text-[#c9d1d9] hover:bg-[#21262d]'}`}
            >
              <Globe size={16} /> <span className="text-sm">Network Topology</span>
            </button>
            <button 
              onClick={() => setActiveTab('rpc')}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 border-l-2 ${activeTab === 'rpc' ? 'border-[#d29922] bg-[#d29922]/10 text-[#d29922]' : 'border-transparent text-[#c9d1d9] hover:bg-[#21262d]'}`}
            >
              <ArrowRightLeft size={16} /> <span className="text-sm">RPC Visualizer</span>
            </button>
            <button 
              onClick={() => setActiveTab('simulation')}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 border-l-2 ${activeTab === 'simulation' ? 'border-[#f85149] bg-[#f85149]/10 text-[#f85149]' : 'border-transparent text-[#c9d1d9] hover:bg-[#21262d]'}`}
            >
              <Radio size={16} /> <span className="text-sm">Latency Simulator</span>
            </button>
            <button 
              onClick={() => setActiveTab('replication')}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 border-l-2 ${activeTab === 'replication' ? 'border-[#3fb950] bg-[#3fb950]/10 text-[#3fb950]' : 'border-transparent text-[#c9d1d9] hover:bg-[#21262d]'}`}
            >
              <Database size={16} /> <span className="text-sm">Entity Replication</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-[#0a0a0f] relative overflow-hidden">
          
          {activeTab === 'topology' && (
            <div className="flex-1 p-6 relative">
              <div className="absolute top-6 left-6 z-10">
                <h2 className="text-lg font-bold flex items-center gap-2"><Globe className="text-[#58a6ff]" /> Server Architecture</h2>
                <p className="text-xs text-[#8b949e]">Select the networking model for your game</p>
                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2 p-2 bg-[#161b22] border-2 border-[#58a6ff] rounded cursor-pointer">
                    <input type="radio" name="topo" defaultChecked className="accent-[#58a6ff]" />
                    <div>
                      <div className="text-sm font-bold">Dedicated Server</div>
                      <div className="text-[10px] text-[#8b949e]">Headless server, best for competitive games</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-[#161b22] border border-[#30363d] rounded cursor-pointer hover:border-[#8b949e]">
                    <input type="radio" name="topo" className="accent-[#58a6ff]" />
                    <div>
                      <div className="text-sm font-bold">Listen Server (Host)</div>
                      <div className="text-[10px] text-[#8b949e]">One player acts as server, good for co-op</div>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Canvas Mock */}
              <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
                 <div className="relative w-[500px] h-[400px]">
                   {/* Connections */}
                   <svg className="absolute inset-0 w-full h-full overflow-visible z-0">
                     <path d="M 250 120 L 100 280" stroke="#58a6ff" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                     <path d="M 250 120 L 250 340" stroke="#58a6ff" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                     <path d="M 250 120 L 400 280" stroke="#58a6ff" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                   </svg>
                   
                   {/* Nodes */}
                   <div className="absolute left-[50%] top-[20%] -translate-x-1/2 -translate-y-1/2 bg-[#238636] p-4 rounded-lg border-2 border-[#2ea043] flex flex-col items-center z-10 shadow-[0_0_20px_rgba(46,160,67,0.4)]">
                     <Server size={32} />
                     <span className="text-xs font-bold mt-2">Dedicated Server</span>
                     <span className="text-[10px] bg-black/50 px-2 py-0.5 rounded mt-1">Tick: 64Hz</span>
                   </div>
                   
                   <div className="absolute left-[20%] top-[70%] -translate-x-1/2 -translate-y-1/2 bg-[#161b22] p-3 rounded-lg border border-[#58a6ff] flex flex-col items-center z-10">
                     <Users size={24} />
                     <span className="text-xs mt-2">Client 1</span>
                     <span className="text-[9px] text-[#58a6ff] mt-1">{latency}ms</span>
                   </div>
                   
                   <div className="absolute left-[50%] top-[85%] -translate-x-1/2 -translate-y-1/2 bg-[#161b22] p-3 rounded-lg border border-[#58a6ff] flex flex-col items-center z-10">
                     <Users size={24} />
                     <span className="text-xs mt-2">Client 2</span>
                     <span className="text-[9px] text-[#58a6ff] mt-1">{latency + 12}ms</span>
                   </div>
                   
                   <div className="absolute left-[80%] top-[70%] -translate-x-1/2 -translate-y-1/2 bg-[#161b22] p-3 rounded-lg border border-[#58a6ff] flex flex-col items-center z-10">
                     <Users size={24} />
                     <span className="text-xs mt-2">Client 3</span>
                     <span className="text-[9px] text-[#58a6ff] mt-1">{latency + 5}ms</span>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'rpc' && (
            <div className="p-6 h-full flex flex-col">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6"><ArrowRightLeft className="text-[#d29922]" /> RPC Flow Visualizer</h2>
              
              <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg p-6 relative overflow-hidden flex flex-col gap-8">
                 <div className="flex justify-between items-center relative z-10">
                    <div className="w-64 bg-[#0d1117] p-4 rounded border-2 border-[#58a6ff]">
                       <div className="text-xs text-[#58a6ff] mb-1 font-bold">1. Client 1 (Initiator)</div>
                       <div className="text-sm">Input: `FireWeapon()`</div>
                    </div>
                    <ArrowRightLeft className="text-[#8b949e]" />
                    <div className="w-64 bg-[#0d1117] p-4 rounded border-2 border-[#3fb950] shadow-[0_0_15px_rgba(63,185,80,0.2)]">
                       <div className="text-xs text-[#3fb950] mb-1 font-bold">2. Server (Authority)</div>
                       <div className="text-sm">RPC: `Server_FireWeapon()`</div>
                       <div className="text-[10px] text-[#8b949e] mt-1">Validates ammo & cooldown</div>
                    </div>
                 </div>
                 
                 <div className="flex justify-center relative z-10">
                    <div className="w-0.5 h-12 bg-[#8b949e] relative">
                       <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-8 border-t-[#8b949e]"></div>
                    </div>
                 </div>
                 
                 <div className="flex justify-center relative z-10">
                    <div className="w-96 bg-[#0d1117] p-4 rounded border-2 border-[#d29922]">
                       <div className="text-xs text-[#d29922] mb-1 font-bold">3. Multicast to All Clients</div>
                       <div className="text-sm">RPC: `Multicast_PlayFireFX()`</div>
                       <div className="text-[10px] text-[#8b949e] mt-1">Spawns muzzle flash and sound on everyone's screen</div>
                    </div>
                 </div>
                 
                 <div className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none">
                    <FileCode2 size={400} />
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'simulation' && (
            <div className="p-6 max-w-2xl mx-auto w-full">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6"><Radio className="text-[#f85149]" /> Real-World Network Simulator</h2>
              
              <div className="space-y-8 bg-[#161b22] p-6 border border-[#30363d] rounded-lg">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold flex items-center gap-2"><Wifi size={16}/> Base Latency (Ping)</span>
                    <span className="text-[#58a6ff] font-mono">{latency} ms</span>
                  </div>
                  <input 
                    type="range" min="0" max="500" value={latency} 
                    onChange={(e) => setLatency(Number(e.target.value))}
                    className="w-full accent-[#58a6ff]" 
                  />
                  <div className="flex justify-between text-[10px] text-[#8b949e] mt-1">
                    <span>LAN (0ms)</span>
                    <span>Cross-Continental (250ms+)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold flex items-center gap-2"><Activity size={16}/> Packet Loss</span>
                    <span className="text-[#f85149] font-mono">{packetLoss}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="50" value={packetLoss} 
                    onChange={(e) => setPacketLoss(Number(e.target.value))}
                    className="w-full accent-[#f85149]" 
                  />
                  <div className="flex justify-between text-[10px] text-[#8b949e] mt-1">
                    <span>Stable (0%)</span>
                    <span>Severe Rubberbanding (30%+)</span>
                  </div>
                </div>
                
                <hr className="border-[#30363d]" />
                
                <div className="flex items-start gap-4 p-4 bg-[#0d1117] rounded border border-[#30363d]">
                   <ShieldCheck className="text-[#3fb950] shrink-0 mt-1" />
                   <div>
                     <div className="text-sm font-bold mb-1 text-[#3fb950]">Client-Side Prediction & Reconciliation</div>
                     <div className="text-xs text-[#8b949e]">Engine automatically mitigates perceived lag by moving the player locally and correcting smoothly if the server disagrees.</div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'replication' && (
            <div className="p-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><Database className="text-[#3fb950]" /> Entity Replication Settings</h2>
              
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#30363d] text-[#8b949e] text-xs">
                    <th className="pb-2 font-medium">Entity / Component</th>
                    <th className="pb-2 font-medium">Replication Condition</th>
                    <th className="pb-2 font-medium">Update Frequency</th>
                    <th className="pb-2 font-medium">Interpolation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]">
                  <tr className="hover:bg-[#161b22]">
                    <td className="py-3 flex items-center gap-2"><Cpu size={14} className="text-[#58a6ff]"/> Player.Transform</td>
                    <td className="py-3"><span className="px-2 py-1 bg-[#2ea043]/20 text-[#3fb950] rounded text-[10px]">Always Relevant</span></td>
                    <td className="py-3">Every Tick</td>
                    <td className="py-3 text-[#3fb950]">Enabled</td>
                  </tr>
                  <tr className="hover:bg-[#161b22]">
                    <td className="py-3 flex items-center gap-2"><Cpu size={14} className="text-[#58a6ff]"/> Player.Health</td>
                    <td className="py-3"><span className="px-2 py-1 bg-[#2ea043]/20 text-[#3fb950] rounded text-[10px]">Always Relevant</span></td>
                    <td className="py-3">On Change</td>
                    <td className="py-3 text-[#8b949e]">Disabled</td>
                  </tr>
                  <tr className="hover:bg-[#161b22]">
                    <td className="py-3 flex items-center gap-2"><Cpu size={14} className="text-[#d29922]"/> NPC.AIState</td>
                    <td className="py-3"><span className="px-2 py-1 bg-[#d29922]/20 text-[#d29922] rounded text-[10px]">Distance &gt; 50m</span></td>
                    <td className="py-3">On Change</td>
                    <td className="py-3 text-[#8b949e]">Disabled</td>
                  </tr>
                  <tr className="hover:bg-[#161b22]">
                    <td className="py-3 flex items-center gap-2"><Cpu size={14} className="text-[#8b949e]"/> Player.Inventory</td>
                    <td className="py-3"><span className="px-2 py-1 bg-[#1f6feb]/20 text-[#58a6ff] rounded text-[10px]">Owning Client Only</span></td>
                    <td className="py-3">On Change</td>
                    <td className="py-3 text-[#8b949e]">Disabled</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
