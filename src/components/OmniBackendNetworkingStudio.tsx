import React, { useState } from 'react';
import { 
  Server, Globe, Database, Wifi, Shield, Lock, Activity, TrendingUp, Users, Cpu, Key, Play, Pause, Square, AlertTriangle, Terminal, Zap, Settings, Command, Network} from 'lucide-react';

export default function OmniBackendNetworkingStudio() {
  const [activeTab, setActiveTab] = useState('Topology'); // Topology, Database, LiveOps, Security, Traffic
  const [isSimulating, setIsSimulating] = useState(false);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0E0E10] text-[#ccc] font-sans text-xs overflow-hidden select-none">
      
      {/* 💥 ELITE TOP NAVBAR 💥 */}
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1.5 rounded border border-[#333] shadow-inner items-center gap-2">
                   <Server size={18} className="text-[#58a6ff] animate-pulse"/>
                   <span className="text-white font-black tracking-widest text-[12px] uppercase" style={{textShadow: '0 0 10px rgba(88,166,255,0.5)'}}>Omni Backend & Netcode Studio</span>
                   <span className="text-[#666] font-mono text-[9px] ml-2">Enterprise Edition</span>
                </div>
                <div className="h-6 w-px bg-[#333]"></div>
                <div className="flex text-[10px] font-mono gap-5 text-[#8b949e]">
                   <span className="flex items-center gap-1"><Users size={12} className="text-[#3fb950]"/> CCU: 148,205</span>
                   <span className="flex items-center gap-1"><Activity size={12} className="text-[#f85149]"/> Traffic: 42 Gbps</span>
                   <span className="flex items-center gap-1"><Shield size={12} className="text-[#e3b341]"/> Auth: Secure</span>
                </div>
            </div>
            
            <div className="flex bg-[#000] border border-[#333] rounded overflow-hidden shadow-inner font-bold text-[10px]">
               <button onClick={() => setIsSimulating(!isSimulating)} className={`px-5 py-1 transition flex items-center justify-center min-w-[80px] ${isSimulating ? 'bg-[#58a6ff] text-[#000] hover:bg-[#3b8eed]' : 'bg-[#1a1a1a] text-[#58a6ff] hover:bg-[#222]'}`}>
                  {isSimulating ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>} <span className="ml-1 tracking-wider uppercase text-[9px]">Live Traffic</span>
               </button>
               <button onClick={() => setIsSimulating(false)} className="px-4 py-1 bg-[#1a1a1a] hover:bg-[#222] transition text-[#f85149] flex items-center gap-1"><Square size={12} fill="currentColor"/> Drop All</button>
            </div>
         </div>

         <div className="flex px-2 bg-[#0a0a0a] border-t border-[#222]">
            <ModuleTab active={activeTab === 'Topology'} onClick={() => setActiveTab('Topology')} icon={<Network size={12}/>} label="1. Server Topology & VMs" color="text-[#58a6ff]"/>
            <ModuleTab active={activeTab === 'Database'} onClick={() => setActiveTab('Database')} icon={<Database size={12}/>} label="2. Redis & NoSQL DBs" color="text-[#3fb950]"/>
            <ModuleTab active={activeTab === 'Traffic'} onClick={() => setActiveTab('Traffic')} icon={<Activity size={12}/>} label="3. Load Balancer & Traffic" color="text-[#bc8cff]"/>
            <ModuleTab active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} icon={<Shield size={12}/>} label="4. Anti-Cheat & Crypto" color="text-[#f85149]"/>
            <ModuleTab active={activeTab === 'LiveOps'} onClick={() => setActiveTab('LiveOps')} icon={<TrendingUp size={12}/>} label="5. LiveOps & Economy" color="text-[#e3b341]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
         
         {/* SIDEBAR PARAMETERS */}
         <div className="w-[300px] bg-[#111] border-r border-[#222] flex flex-col z-20 shrink-0 shadow-lg">
             <div className="p-3 border-b border-[#222] bg-[#1a1a1a]">
                   <h3 className="text-[#888] font-bold text-[10px] tracking-widest uppercase mb-2">Cloud Configuration</h3>
                   <input type="text" placeholder="Search config keys..." className="w-full bg-[#0a0a0a] border border-[#333] p-1.5 rounded text-[10px] outline-none" />
             </div>
             <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-4">
                 
                 {activeTab === 'Topology' && (
                    <>
                       <PropertyGroup title="Instance Groups">
                          <SliderRow label="Matchmaking Nodes" value="45 / 100" color="bg-[#58a6ff]"/>
                          <SliderRow label="Game Dedicated Server (GDS)" value="1200 / 5000" color="bg-[#3fb950]"/>
                       </PropertyGroup>
                       <PropertyGroup title="Fleet Health">
                          <div className="flex flex-col gap-1 text-[10px] font-mono">
                             <div className="flex justify-between text-[#3fb950]"><span>us-east-1</span> <span>HEALTHY (99.9%)</span></div>
                             <div className="flex justify-between text-[#3fb950]"><span>eu-central-1</span> <span>HEALTHY (99.5%)</span></div>
                             <div className="flex justify-between text-[#f85149]"><span>ap-northeast-2</span> <span>DEGRADED (82.1%)</span></div>
                          </div>
                       </PropertyGroup>
                       <button className="w-full bg-[#58a6ff]/20 border border-[#58a6ff] text-[#58a6ff] py-2 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#58a6ff]/30 transition">Deploy Fleet Update</button>
                    </>
                 )}

                 {activeTab === 'Database' && (
                    <>
                      <PropertyGroup title="Cluster Metrics">
                         <SliderRow label="Redis IOPS" value="84k/s" color="bg-[#f85149]"/>
                         <SliderRow label="PostgreSQL Connections" value="4,021" color="bg-[#3fb950]"/>
                         <SliderRow label="MongoDB Cache Hit" value="98.2%" color="bg-[#e3b341]"/>
                      </PropertyGroup>
                      <PropertyGroup title="Query Analyzer">
                         <div className="bg-[#050505] border border-[#333] p-2 rounded font-mono text-[9px] text-[#888]">
                            <span className="text-[#bc8cff]">SELECT</span> player_id, obj_data <span className="text-[#bc8cff]">FROM</span> Inventory <br/>
                            <span className="text-[#bc8cff]">WHERE</span> item_tier = <span className="text-[#3fb950]">'Legendary'</span><br/>
                            <span className="text-[#bc8cff]">ORDER BY</span> acquired_at <span className="text-[#bc8cff]">DESC</span>;
                         </div>
                         <div className="text-[#f85149] text-[9px] mt-1 text-right">Slow Query Detected: 840ms</div>
                      </PropertyGroup>
                    </>
                 )}

                 {activeTab === 'Traffic' && (
                    <>
                      <PropertyGroup title="Ingress Details">
                         <div className="flex items-center justify-between bg-[#1a1a1a] p-2 rounded border border-[#333] mb-2">
                            <span className="text-[#ccc] text-[10px] uppercase font-bold">TCP Offload</span>
                            <span className="text-[#3fb950] text-[10px] font-mono">ACTIVE</span>
                         </div>
                         <div className="flex items-center justify-between bg-[#1a1a1a] p-2 rounded border border-[#333]">
                            <span className="text-[#ccc] text-[10px] uppercase font-bold">UDP Relay</span>
                            <span className="text-[#3fb950] text-[10px] font-mono">ACTIVE</span>
                         </div>
                      </PropertyGroup>
                      <PropertyGroup title="Traffic Splitting (A/B)">
                         <SliderRow label="v1.2 (Stable)" value="80%" color="bg-[#3fb950]"/>
                         <SliderRow label="v1.3.rc1 (Canary)" value="20%" color="bg-[#e3b341]"/>
                      </PropertyGroup>
                    </>
                 )}

                 {activeTab === 'Security' && (
                    <>
                       <PropertyGroup title="Kernel Auth & Telemetry">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                             <div className="bg-[#1a1a1a] border border-[#f85149] p-2 rounded text-center">
                                <Shield size={16} className="text-[#f85149] mx-auto mb-1"/>
                                <div className="text-[#f85149] text-[12px] font-black">204</div>
                                <div className="text-[#888] text-[8px] uppercase">Bans Today</div>
                             </div>
                             <div className="bg-[#1a1a1a] border border-[#333] p-2 rounded text-center">
                                <Key size={16} className="text-[#888] mx-auto mb-1"/>
                                <div className="text-[#ccc] text-[12px] font-black">1.2M</div>
                                <div className="text-[#888] text-[8px] uppercase">Tokens ISS</div>
                             </div>
                          </div>
                          <button className="w-full bg-[#f85149]/20 border border-[#f85149] text-[#f85149] py-1.5 rounded text-[9px] font-bold uppercase hover:bg-[#f85149]/30 transition">Force Global Token Refresh</button>
                       </PropertyGroup>
                    </>
                 )}

                 {activeTab === 'LiveOps' && (
                    <>
                       <PropertyGroup title="Economy Balancing">
                          <SliderRow label="Gold Inflation Rate" value="+2.4%" color="bg-[#e3b341]"/>
                          <SliderRow label="Premium Currency Spend" value="45K / Hr" color="bg-[#58a6ff]"/>
                       </PropertyGroup>
                       <PropertyGroup title="Active Events">
                          <div className="bg-[#050505] border border-[#333] p-2 rounded flex flex-col gap-1 text-[10px]">
                             <div className="flex justify-between items-center text-[#fff] font-bold"><span className="flex items-center gap-1"><Zap size={10} className="text-[#e3b341]"/> Lunar Festival Drop</span> <span className="bg-[#e3b341] text-[#000] px-1 rounded text-[8px]">ACTIVE</span></div>
                             <div className="text-[#888]">Ends in: 14h 22m</div>
                          </div>
                       </PropertyGroup>
                       <button className="w-full bg-[#bc8cff]/20 border border-[#bc8cff] text-[#bc8cff] py-2 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#bc8cff]/30 transition flex justify-center items-center gap-2"> Inject Live Config (Hot Reload)</button>
                    </>
                 )}

             </div>
         </div>

         {/* MAIN VIEWPORT */}
         <div className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col">
             
             {/* Dynamic Central Visualization */}
             <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
                {/* Global Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(88,166,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(88,166,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                {activeTab === 'Topology' && (
                   <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute top-10 text-[#888] font-mono text-[10px]">USA EAST ARCHITECTURE (AWS / GCP MULTI-CLOUD)</div>
                      
                      {/* Gateway Node */}
                      <div className="absolute z-10 bg-[#111] border-2 border-[#58a6ff] text-[#58a6ff] p-3 rounded-lg shadow-[0_0_20px_rgba(88,166,255,0.2)] flex flex-col items-center top-[20%]">
                         <Globe size={24} className={isSimulating ? 'animate-spin-slow' : ''}/>
                         <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">L7 API Gateway</span>
                      </div>

                      {/* Microservices */}
                      <div className="absolute top-[50%] left-[20%] bg-[#111] border border-[#333] text-[#ccc] p-3 rounded shadow-lg flex flex-col items-center">
                         <Key size={16} className="text-[#e3b341] mb-1"/>
                         <span className="text-[9px] uppercase font-bold">Auth Service</span>
                      </div>

                      <div className="absolute top-[50%] left-[45%] bg-[#111] border-2 border-[#3fb950] text-[#ccc] p-3 rounded shadow-[0_0_15px_rgba(63,185,80,0.2)] flex flex-col items-center">
                         <Server size={20} className="text-[#3fb950] mb-1"/>
                         <span className="text-[9px] uppercase font-bold">Matchmaking GDS</span>
                      </div>

                      <div className="absolute top-[50%] left-[70%] bg-[#111] border border-[#333] text-[#ccc] p-3 rounded shadow-lg flex flex-col items-center">
                         <Activity size={16} className="text-[#bc8cff] mb-1"/>
                         <span className="text-[9px] uppercase font-bold">Telemetry</span>
                      </div>

                      {/* Databases */}
                      <div className="absolute top-[80%] left-[30%] bg-[#111] border-b-[4px] border-[#f85149] text-[#ccc] p-3 shadow-lg flex flex-col items-center w-24">
                         <Database size={16} className="text-[#f85149] mb-1"/>
                         <span className="text-[9px] uppercase font-bold">Redis Cache</span>
                      </div>
                      
                      <div className="absolute top-[80%] left-[60%] bg-[#111] border-b-[4px] border-[#58a6ff] text-[#ccc] p-3 shadow-lg flex flex-col items-center w-24">
                         <Database size={16} className="text-[#58a6ff] mb-1"/>
                         <span className="text-[9px] uppercase font-bold">PostgreSQL</span>
                      </div>

                      {/* Connecting Lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#333] stroke-2 fill-none z-0">
                         {/* From Gateway to Services */}
                         <path d="M 50% 28% L 25% 50%" className={isSimulating ? "animate-[dash_1s_linear_infinite]" : ""} strokeDasharray="5,5"/>
                         <path d="M 50% 28% L 50% 50%" className={isSimulating ? "animate-[dash_1s_linear_infinite]" : ""} strokeDasharray="5,5"/>
                         <path d="M 50% 28% L 75% 50%" className={isSimulating ? "animate-[dash_1s_linear_infinite]" : ""} strokeDasharray="5,5"/>
                         {/* From Services to DBs */}
                         <path d="M 25% 58% L 35% 80%" stroke="#555"/>
                         <path d="M 50% 58% L 35% 80%" stroke="#555"/>
                         <path d="M 50% 58% L 65% 80%" stroke="#555"/>
                         <path d="M 75% 58% L 65% 80%" stroke="#555"/>
                      </svg>
                   </div>
                )}

                {activeTab === 'Database' && (
                   <div className="w-full h-full flex flex-col text-left">
                       <div className="text-[#888] font-bold text-[10px] tracking-widest uppercase mb-4">Live Database Queries</div>
                       <table className="w-full text-[10px] text-left border-collapse font-mono">
                          <thead>
                             <tr className="border-b border-[#333] text-[#555]">
                                <th className="pb-2 font-normal">TIMESTAMP</th>
                                <th className="pb-2 font-normal">NODE</th>
                                <th className="pb-2 font-normal">EXEC TIME</th>
                                <th className="pb-2 font-normal">QUERY STRING</th>
                             </tr>
                          </thead>
                          <tbody>
                             <tr className="border-b border-[#222]">
                                <td className="py-2 text-[#ccc]">10:42:01.045</td>
                                <td className="py-2 text-[#3fb950]">pg-db-01</td>
                                <td className="py-2 text-[#58a6ff]">12ms</td>
                                <td className="py-2 text-[#888]">UPDATE players SET exp = 450 WHERE id = 'A1X'</td>
                             </tr>
                             <tr className="border-b border-[#222]">
                                <td className="py-2 text-[#ccc]">10:42:01.080</td>
                                <td className="py-2 text-[#f85149]">redis-cache</td>
                                <td className="py-2 text-[#58a6ff]">2ms</td>
                                <td className="py-2 text-[#888]">HGET session_data:A1X</td>
                             </tr>
                             <tr className="border-b border-[#222]">
                                <td className="py-2 text-[#ccc]">10:42:01.120</td>
                                <td className="py-2 text-[#3fb950]">pg-db-02</td>
                                <td className="py-2 text-[#f85149] font-bold">1420ms</td>
                                <td className="py-2 text-[#bc8cff]">SELECT * FROM transaction_logs WHERE status='PENDING'</td>
                             </tr>
                             <tr className="border-b border-[#222]">
                                <td className="py-2 text-[#ccc]">10:42:01.125</td>
                                <td className="py-2 text-[#3fb950]">pg-db-01</td>
                                <td className="py-2 text-[#58a6ff]">45ms</td>
                                <td className="py-2 text-[#888]">INSERT INTO chat_logs (room, msg) VALUES ('global', '...')</td>
                             </tr>
                          </tbody>
                       </table>
                   </div>
                )}

                {activeTab === 'Traffic' && (
                   <div className="w-full h-full flex flex-col justify-end relative">
                      <div className="absolute top-0 left-0 text-[#888] font-bold text-[10px] tracking-widest uppercase mb-4">Ingress Traffic Volume (Last 60s)</div>
                      
                      {/* Fake Bar Chart for Traffic */}
                      <div className="flex items-end gap-1 w-full h-[60%] border-b border-[#333] px-2 opacity-80">
                         {Array.from({length: 40}).map((_, i) => (
                            <div key={i} className="flex-1 bg-[#58a6ff] hover:bg-[#fff] transition-colors" style={{ height: `${Math.random() * 80 + 20}%`}}></div>
                         ))}
                      </div>
                   </div>
                )}

                {activeTab === 'Security' && (
                   <div className="w-full h-full flex items-center justify-center">
                      <div className="bg-[#111] border border-[#333] rounded p-8 flex flex-col items-center max-w-[400px] text-center shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f85149] to-transparent opacity-50"></div>
                         <Shield size={64} className="text-[#333] mb-4"/>
                         <h2 className="text-[#ccc] text-lg font-black tracking-widest uppercase mb-2">Anti-Cheat Engine</h2>
                         <p className="text-[#888] text-[10px] leading-relaxed mb-6">Monitoring client-side heuristics, memory injection attempts, and packet manipulation patterns across 148,205 active sessions.</p>
                         
                         <div className="w-full border-t border-[#222] pt-4 flex justify-between text-[10px] font-mono">
                            <div className="flex flex-col text-[#3fb950]"><span className="text-white text-lg font-black">0</span>False Positives</div>
                            <div className="flex flex-col text-[#f85149]"><span className="text-white text-lg font-black">204</span>Auto-Bans</div>
                         </div>
                      </div>
                   </div>
                )}
                
                {activeTab === 'LiveOps' && (
                   <div className="w-full h-full grid grid-cols-2 gap-4">
                      {/* ARPU Card */}
                      <div className="bg-[#111] border border-[#333] rounded p-4 flex flex-col">
                         <span className="text-[#888] text-[10px] uppercase font-bold tracking-widest">ARPU (Average Rev Per User)</span>
                         <span className="text-[#e3b341] text-3xl font-black mt-2">$4.21</span>
                         <span className="text-[#3fb950] text-[10px] font-mono mt-1">+0.12 (Last 24h)</span>
                      </div>
                      
                      <div className="bg-[#111] border border-[#333] rounded p-4 flex flex-col">
                         <span className="text-[#888] text-[10px] uppercase font-bold tracking-widest">Concurrent Users (CCU)</span>
                         <span className="text-[#58a6ff] text-3xl font-black mt-2">148,205</span>
                         <span className="text-[#f85149] text-[10px] font-mono mt-1">-1,204 (Leaving NA Evening)</span>
                      </div>

                      <div className="col-span-2 bg-[#111] border border-[#333] rounded p-4 flex flex-col relative overflow-hidden">
                         <span className="text-[#888] text-[10px] uppercase font-bold tracking-widest mb-4">Action Feed</span>
                         <div className="space-y-2 text-[10px] font-mono relative z-10 w-2/3">
                            <div className="text-[#ccc]"><span className="text-[#58a6ff]">[System]</span> A/B Test 'Store_Variant_C' concluded successfully.</div>
                            <div className="text-[#ccc]"><span className="text-[#e3b341]">[Economy]</span> Detected massive spike in 'Iron_Ore' trading volume. Flagged for review.</div>
                            <div className="text-[#ccc]"><span className="text-[#3fb950]">[LiveOps]</span> Push Notification "Weekend XP Boost" delivered to 1.2M users.</div>
                         </div>
                         <TrendingUp size={150} className="absolute right-[-20px] bottom-[-20px] text-[#222] z-0"/>
                      </div>
                   </div>
                )}

             </div>

             {/* SERVER CONSOLE TERMINAL */}
             <div className="h-[200px] bg-[#0a0a0a] border-t border-[#222] font-mono text-[10px] overflow-hidden flex flex-col shrink-0">
                <div className="bg-[#1a1a1a] border-b border-[#333] px-3 py-1 flex items-center justify-between text-[#888]">
                   <span className="flex items-center gap-2"><Terminal size={12}/> <span className="font-bold">GLOBAL SSH TERMINAL</span></span>
                   <span className="text-[#3fb950]">● CONNECTED</span>
                </div>
                <div className="p-3 overflow-y-auto flex-1 text-[#aaa] space-y-1">
                   <div>[10:45:00] <span className="text-[#58a6ff]">INFO</span>  - Orchestrator: Scaling up EU matchmaking nodes...</div>
                   <div>[10:45:02] <span className="text-[#3fb950]">SUCCESS</span>- Provisioned 5 new nodes in eu-central-1.</div>
                   <div>[10:45:10] <span className="text-[#e3b341]">WARN</span>  - Redis cluster near 85% memory threshold.</div>
                   {isSimulating && (
                      <div className="animate-pulse">[10:45:12] <span className="text-[#58a6ff]">INFO</span>  - Processing 4,021 incoming packets/sec...</div>
                   )}
                   <div className="flex mt-2">
                       <span className="text-[#58a6ff] mr-2">root@nexus-cloud:~$</span>
                       <span className="animate-pulse w-1.5 h-3 bg-[#ccc] block self-center"></span>
                   </div>
                </div>
             </div>

         </div>

      </div>
    </div>
  );
}

// ------ STYLED COMPONENT HELPERS ------ //

function ModuleTab({ active, onClick, icon, label, color }) {
   return (
      <div 
         onClick={onClick}
         className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer border-t-[2px] transition-colors
         ${active ? `bg-[#111] text-white ${color.replace('text-', 'border-')}` : 'border-transparent text-[#888] hover:bg-[#1a1a1a] hover:text-[#ccc]'}`}
      >
         <span className={active ? color : 'opacity-70'}>{icon}</span> {label}
      </div>
   );
}

function PropertyGroup({ title, children }) {
   return (
      <div className="mb-4">
         <div className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 border-b border-[#2d2d2d] pb-1">{title}</div>
         <div className="flex flex-col gap-2">
            {children}
         </div>
      </div>
   );
}

function SliderRow({ label, value, color }) {
   return (
      <div className="flex flex-col gap-1">
         <div className="flex justify-between items-end">
            <span className="text-[#888] text-[9px] uppercase">{label}</span>
            <span className="text-white text-[10px] font-mono">{value}</span>
         </div>
         <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden border border-[#333]">
            <div className={`h-full ${color} w-[60%]`}></div>
         </div>
      </div>
   );
}
