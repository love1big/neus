import React, { useState, useEffect } from 'react';
import { Server, Square, Play, Blocks, Database, Globe, Terminal, Activity, Cpu, MonitorPlay, ShieldCheck, Bot, Network, Zap, Lock, Users, Cloud, HardDrive, BarChart3, Rocket, Scale, Coins, Wallet, Code2, AlertTriangle, FileCode2 } from 'lucide-react';

export default function NetworkSim() {
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [serverLogs, setServerLogs] = useState<{time: string, msg: string, type: 'info'|'warn'|'error'|'success'}[]>([]);
  const [activeTab, setActiveTab] = useState('core');
  const [projectType, setProjectType] = useState('auto');
  const [hostType, setHostType] = useState('vps');
  const timeoutRefs = React.useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const handleProjectTypeChange = (type: string) => {
    setProjectType(type);
    if (type === 'website') setHostType('shared');
    else if (type === 'game') setHostType('baremetal');
    else if (type === 'app') setHostType('vps');
    else if (type === 'game_web') setHostType('vps'); // Often runs a web server proxy & game server
    else if (type === 'ecosystem') setHostType('baremetal'); // Needs heavy resources
  };
  
  // Fake telemetry
  const [cpuUsage, setCpuUsage] = useState(0);
  const [ramUsage, setRamUsage] = useState(0);
  const [bandwidth, setBandwidth] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isServerRunning) {
      interval = setInterval(() => {
        setCpuUsage(Math.random() * 8 + 2);
        setRamUsage(Math.random() * 200 + 400);
        setBandwidth(Math.random() * 5 + 10);
      }, 1000);
    } else {
      setCpuUsage(0);
      setRamUsage(0);
      setBandwidth(0);
    }
    return () => clearInterval(interval);
  }, [isServerRunning]);

  const addLog = (msg: string, type: 'info'|'warn'|'error'|'success', delay: number) => {
    const time = new Date().toLocaleTimeString();
    if (delay === 0) {
      setServerLogs(prev => [...prev, {time, msg, type}]);
    } else {
      const t = setTimeout(() => setServerLogs(prev => [...prev, {time: new Date().toLocaleTimeString(), msg, type}]), delay);
      timeoutRefs.current.push(t);
    }
  };

  const toggleServer = () => {
    setIsServerRunning(!isServerRunning);
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    
    if (!isServerRunning) {
       if (projectType === 'website') {
           addLog('Provisioning Shared Host container...', 'info', 0);
           addLog('Omnibus NGINX/Apache stack bound to :80 / :443', 'info', 600);
           addLog('Database (MariaDB/MySQL) ready.', 'success', 1200);
           addLog('ALL SYSTEMS NOMINAL. Ready for web traffic.', 'success', 1800);
       } else if (projectType === 'game_web') {
           addLog('Initializing Multi-Tier Architecture...', 'info', 0);
           addLog('Game Server instance bound to 0.0.0.0:7777 (UDP)', 'info', 600);
           addLog('Omnibus Web/API Server bound to 0.0.0.0:443 (TCP)', 'info', 1200);
           addLog('Distributed Database node connected to both instances.', 'success', 1800);
           addLog('ALL SYSTEMS NOMINAL. Ready for player connections & web traffic.', 'success', 2500);
       } else if (projectType === 'ecosystem') {
           addLog('Initializing Load-Balanced Multi-Node Ecosystem...', 'info', 0);
           addLog('[Node 1] Game Server instance bound to 0.0.0.0:7777 (UDP)', 'info', 600);
           addLog('[Node 2] Omnibus Web Portal bound to 0.0.0.0:443 (TCP)', 'info', 1200);
           addLog('[Node 3] Admin Control Panel secured on :8443 (TCP)', 'warn', 1800);
           addLog('Global Redis Cache & PostgreSQL Cluster Synchronized.', 'success', 2500);
           addLog('ALL SYSTEMS NOMINAL. Ecosystem routing is live.', 'success', 3200);
       } else {
           addLog('Initializing Agones Kubernetes cluster in US-East...', 'info', 0);
           addLog('Dedicated Server instance bound to 0.0.0.0:7777 (UDP)', 'info', 600);
           addLog('Spanner Distributed Database node connected.', 'success', 1200);
           addLog('OpenMatch matchmaker online. Skill-based MM active.', 'success', 1800);
           addLog('[AI_WATCHDOG] Observing runtime memory for buffer overflows...', 'warn', 2500);
           addLog('Edge CDN and Anycast Anti-DDoS shields enabled.', 'info', 3000);
           addLog('ALL SYSTEMS NOMINAL. Ready for player connections.', 'success', 3500);
       }
    } else {
       addLog('Sending SIGTERM to all nodes. Draining connections...', 'warn', 0);
       addLog('Server instance(s) fully shut down.', 'error', 800);
    }
  };

  return (
    <div className="flex-1 w-full h-full bg-[#0a0a0a] relative overflow-y-auto font-sans text-[#c9d1d9] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] px-6 py-4 shrink-0 bg-[#0a0a0a] sticky top-0 z-20">
         <div className="flex items-center gap-4">
           <Server className="text-[#58a6ff] border border-[#58a6ff]/30 p-2 rounded-lg bg-[#58a6ff]/10" size={40}/>
           <div>
             <h2 className="text-2xl font-bold text-[#fff] tracking-tight">Multiplayer Backend & Cloud Orchestration</h2>
             <p className="text-[#8b949e] text-[12px] mt-0.5">Configure hyper-scalable clusters, anti-cheat, edge networking, matchmaking, and economy.</p>
           </div>
         </div>
         <button 
           onClick={toggleServer}
           className={`px-6 py-3 font-bold rounded-lg flex items-center gap-2 shadow-xl transition-all ${isServerRunning ? 'bg-[#f85149] text-white hover:bg-[#ff7b72] shadow-[0_0_20px_rgba(248,81,73,0.3)]' : 'bg-[#3fb950] text-[#0a0a0a] hover:bg-[#2ea043] shadow-[0_0_20px_rgba(63,185,80,0.3)]'}`}
         >
            {isServerRunning ? <Square size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}
            {isServerRunning ? 'STOP CLUSTER' : 'DEPLOY LOCAL CLUSTER'}
         </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#161b22] border-b border-[#30363d] h-12 px-6 shrink-0 sticky top-[73px] z-10 w-full overflow-x-auto hide-scrollbar">
        <button onClick={() => setActiveTab('core')} className={`px-4 text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap ${activeTab === 'core' ? 'text-[#58a6ff] border-b-2 border-[#58a6ff]' : 'text-[#8b949e] hover:text-white'}`}>
          <Blocks size={16}/> Core Engine & DB
        </button>
        <button onClick={() => setActiveTab('edge')} className={`px-4 text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap ${activeTab === 'edge' ? 'text-[#bc8cff] border-b-2 border-[#bc8cff]' : 'text-[#8b949e] hover:text-white'}`}>
          <Globe size={16}/> Edge & Matchmaking
        </button>
        <button onClick={() => setActiveTab('security')} className={`px-4 text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap ${activeTab === 'security' ? 'text-[#f85149] border-b-2 border-[#f85149]' : 'text-[#8b949e] hover:text-white'}`}>
          <ShieldCheck size={16}/> Security & AI Watchdog
        </button>
        <button onClick={() => setActiveTab('economy')} className={`px-4 text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap ${activeTab === 'economy' ? 'text-[#e3b341] border-b-2 border-[#e3b341]' : 'text-[#8b949e] hover:text-white'}`}>
          <Coins size={16}/> LiveOps & Economy
        </button>
        <button onClick={() => setActiveTab('telemetry')} className={`px-4 text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap ${activeTab === 'telemetry' ? 'text-[#3fb950] border-b-2 border-[#3fb950]' : 'text-[#8b949e] hover:text-white'}`}>
          <Activity size={16}/> Global Telemetry
        </button>
        <button onClick={() => setActiveTab('web_hosting')} className={`px-4 text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 whitespace-nowrap ${activeTab === 'web_hosting' ? 'text-[#ff7b72] border-b-2 border-[#ff7b72]' : 'text-[#8b949e] hover:text-white'}`}>
          <FileCode2 size={16}/> Web & Media Hosting
        </button>
      </div>
      
      <div className="flex-1 p-6 flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-20">
         
         {activeTab === 'core' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg">
                 <h3 className="text-[#fff] font-bold tracking-wide uppercase text-[14px] mb-5 flex items-center gap-2 border-b border-[#30363d] pb-3">
                    <Cpu size={18} className="text-[#58a6ff]"/> Network Architecture & Topology
                 </h3>
                 <div className="space-y-5">
                    <div>
                       <label className="text-[#8b949e] text-[11px] font-bold uppercase mb-1 block">State Synchronization Model</label>
                       <select className="bg-[#0d1117] border border-[#30363d] text-white rounded w-full p-2.5 focus:border-[#58a6ff] outline-none text-[13px] shadow-inner">
                          <option>Server-Authoritative (Deterministic Physics) - Competitive FPS</option>
                          <option>Client-Predicted, Server-Verifies with Rollback - Fighting/Action</option>
                          <option>Peer-to-Peer Relay w/ Seamless Host Migration - Co-op</option>
                          <option>Distributed ECS (Multiple Server Nodes per Map) - MMO</option>
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="flex flex-col gap-1">
                          <label className="text-[#8b949e] text-[11px] font-bold uppercase">Tick Rate (Hz)</label>
                          <select className="bg-[#0d1117] border border-[#30363d] text-white rounded p-2 focus:border-[#58a6ff] outline-none text-[13px]">
                             <option>20 Hz (RPG/Strategy)</option>
                             <option>60 Hz (Standard Action)</option>
                             <option selected>128 Hz (Esports Tactical)</option>
                          </select>
                       </div>
                       <div className="flex flex-col gap-1">
                          <label className="text-[#8b949e] text-[11px] font-bold uppercase">Max CCU / Shard</label>
                          <input type="number" defaultValue={2000} className="bg-[#0d1117] border border-[#30363d] text-white rounded px-3 py-2 font-mono focus:border-[#58a6ff] outline-none text-[13px]"/>
                       </div>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-[#30363d]">
                       <label className="flex items-center justify-between bg-[#0d1117] p-3 rounded border border-[#30363d] cursor-pointer hover:border-[#58a6ff]/50 transition-colors">
                          <div>
                            <div className="text-white text-[12px] font-bold flex items-center gap-1"><Zap size={14} className="text-[#e3b341]"/> Delta Compression</div>
                            <div className="text-[#8b949e] text-[10px]">Only replicate changed variables over the network.</div>
                          </div>
                          <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-4 h-4"/>
                       </label>
                       <label className="flex items-center justify-between bg-[#0d1117] p-3 rounded border border-[#30363d] cursor-pointer hover:border-[#58a6ff]/50 transition-colors">
                          <div>
                            <div className="text-white text-[12px] font-bold flex items-center gap-1">Interest Management (Spatial)</div>
                            <div className="text-[#8b949e] text-[10px]">Cull network updates for actors outside player relevancy distance.</div>
                          </div>
                          <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-4 h-4"/>
                       </label>
                    </div>
                 </div>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg">
                 <h3 className="text-[#fff] font-bold tracking-wide uppercase text-[14px] mb-5 flex items-center gap-2 border-b border-[#30363d] pb-3">
                    <Database size={18} className="text-[#3fb950]"/> Persistence & Data Warehousing
                 </h3>
                 <div className="space-y-5">
                    <div>
                       <label className="text-[#8b949e] text-[11px] font-bold uppercase mb-1 block">Primary Database Engine</label>
                       <select className="bg-[#0d1117] border border-[#30363d] text-white rounded w-full p-2.5 focus:border-[#3fb950] outline-none text-[13px] shadow-inner">
                          <option>Google Cloud Spanner (Global Sync ACID)</option>
                          <option>Amazon Aurora Serverless (PostgreSQL)</option>
                          <option>MongoDB Atlas (NoSQL Document)</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[#8b949e] text-[11px] font-bold uppercase mb-1 block">High-Speed Caching Layer</label>
                       <select className="bg-[#0d1117] border border-[#30363d] text-white rounded w-full p-2.5 focus:border-[#3fb950] outline-none text-[13px] shadow-inner">
                          <option>Redis Enterprise Cluster (In-Memory K/V)</option>
                          <option>Memcached</option>
                       </select>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-[#30363d]">
                       <label className="flex items-center justify-between bg-[#0d1117] p-3 rounded border border-[#30363d] cursor-pointer">
                          <div>
                            <div className="text-white text-[12px] font-bold">Event-Driven Analytics Pipeline</div>
                            <div className="text-[#8b949e] text-[10px]">Stream gameplay logs to BigQuery/Snowflake via Kafka.</div>
                          </div>
                          <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                       </label>
                       <label className="flex items-center justify-between bg-[#0d1117] p-3 rounded border border-[#30363d] cursor-pointer">
                          <div>
                            <div className="text-white text-[12px] font-bold">Auto-Scaling Shards</div>
                            <div className="text-[#8b949e] text-[10px]">Dynamically provision database nodes based on load.</div>
                          </div>
                          <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                       </label>
                    </div>
                 </div>
              </div>
           </div>
         )}

         {activeTab === 'edge' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg">
                 <h3 className="text-[#fff] font-bold tracking-wide uppercase text-[14px] mb-5 flex items-center gap-2 border-b border-[#30363d] pb-3">
                    <Network size={18} className="text-[#bc8cff]"/> Matchmaking & Allocation
                 </h3>
                 <div className="space-y-4">
                    <div>
                       <label className="text-[#8b949e] text-[11px] font-bold uppercase mb-1 block">Matchmaker Logic</label>
                       <select className="bg-[#0d1117] border border-[#30363d] text-white rounded w-full p-2.5 outline-none text-[13px]">
                          <option>OpenMatch (Skill-Based Elo + Ping Priority)</option>
                          <option>First-In-First-Out (Casual Lobbies)</option>
                          <option>Custom Server Browser (Community Hosted)</option>
                       </select>
                    </div>
                    <div className="space-y-3 pt-2">
                       <label className="flex items-center justify-between bg-[#0d1117] p-3 rounded border border-[#30363d]">
                          <div>
                            <div className="text-white text-[12px] font-bold">Late Join / Backfill Support</div>
                            <div className="text-[#8b949e] text-[10px]">Allow players to join mid-match if someone drops.</div>
                          </div>
                          <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4"/>
                       </label>
                       <label className="flex items-center justify-between bg-[#0d1117] p-3 rounded border border-[#30363d]">
                          <div>
                            <div className="text-white text-[12px] font-bold">Party MMR Averaging</div>
                            <div className="text-[#8b949e] text-[10px]">Calculate group skill rating utilizing non-linear scaling.</div>
                          </div>
                          <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4"/>
                       </label>
                    </div>
                 </div>
              </div>
              
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg">
                 <h3 className="text-[#fff] font-bold tracking-wide uppercase text-[14px] mb-5 flex items-center gap-2 border-b border-[#30363d] pb-3">
                    <Cloud size={18} className="text-[#bc8cff]"/> Global Orchestration & CDN
                 </h3>
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <label className="flex items-start gap-3 bg-[#0d1117] p-3 rounded border border-[#30363d]">
                          <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4 mt-0.5"/>
                          <div>
                             <div className="text-white text-[11px] font-bold mb-1">Agones (Kubernetes)</div>
                             <div className="text-[#8b949e] text-[10px]">Autoscale fleet pods.</div>
                          </div>
                       </label>
                       <label className="flex items-start gap-3 bg-[#0d1117] p-3 rounded border border-[#30363d]">
                          <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4 mt-0.5"/>
                          <div>
                             <div className="text-white text-[11px] font-bold mb-1">Global Anycast IP</div>
                             <div className="text-[#8b949e] text-[10px]">Route to nearest edge via BGP.</div>
                          </div>
                       </label>
                    </div>
                    <div>
                       <label className="text-[#8b949e] text-[11px] font-bold uppercase mb-1 block">Active Data Centers</label>
                       <div className="grid grid-cols-3 gap-2">
                         {['US-East', 'US-West', 'EU-Central', 'EU-West', 'AP-Northeast', 'SA-East'].map(region => (
                           <label key={region} className="flex gap-2 items-center text-[11px] text-[#c9d1d9] bg-[#0d1117] border border-[#30363d] p-1.5 rounded">
                             <input type="checkbox" defaultChecked className="accent-[#bc8cff]"/>
                             {region}
                           </label>
                         ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}
         
         {activeTab === 'security' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="bg-[#161b22] border border-[#f85149]/50 rounded-xl p-6 shadow-[0_0_20px_rgba(248,81,73,0.1)] relative overflow-hidden">
                <div className="absolute top-[-50px] right-[-50px] opacity-10"><ShieldCheck size={200} className="text-[#f85149]"/></div>
                <h3 className="text-[#fff] font-bold tracking-wide uppercase text-[14px] mb-5 flex items-center gap-2 border-b border-[#30363d] pb-3 relative z-10">
                   <ShieldCheck size={18} className="text-[#f85149]"/> Anti-Cheat & Network Throttling
                </h3>
                <div className="space-y-4 relative z-10">
                   <div className="flex justify-between items-center bg-[#0d1117] p-3 rounded border border-[#30363d]">
                      <div>
                        <div className="text-[12px] font-bold text-white flex items-center gap-2"><Lock size={14}/> Kernel-Level Anti-Cheat Integration</div>
                        <div className="text-[10px] text-[#8b949e]">Require client ring-0 driver (EAC / BattlEye equivalent).</div>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-[#f85149] w-5 h-5"/>
                   </div>
                   
                   <div className="pt-4">
                     <p className="text-[11px] text-[#8b949e] uppercase font-bold mb-3">Chaos Engineering Config</p>
                     <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#0d1117] p-3 rounded border border-[#30363d]">
                           <span className="text-[#8b949e] text-[10px] uppercase font-bold">Simulated Ping</span>
                           <input type="number" defaultValue="45" className="w-full bg-[#161b22] text-[#f85149] font-mono border border-[#30363d] rounded p-1.5 mt-1 text-[12px]"/>
                        </div>
                        <div className="bg-[#0d1117] p-3 rounded border border-[#30363d]">
                           <span className="text-[#8b949e] text-[10px] uppercase font-bold">Packet Loss %</span>
                           <input type="number" defaultValue="2" className="w-full bg-[#161b22] text-[#f85149] font-mono border border-[#30363d] rounded p-1.5 mt-1 text-[12px]"/>
                        </div>
                        <div className="bg-[#0d1117] p-3 rounded border border-[#30363d]">
                           <span className="text-[#8b949e] text-[10px] uppercase font-bold">Jitter Variance</span>
                           <input type="number" defaultValue="15" className="w-full bg-[#161b22] text-[#f85149] font-mono border border-[#30363d] rounded p-1.5 mt-1 text-[12px]"/>
                        </div>
                     </div>
                   </div>
                </div>
             </div>

             <div className="bg-[#161b22] border border-[#f85149]/50 rounded-xl p-6 shadow-[0_0_20px_rgba(248,81,73,0.1)] relative overflow-hidden flex flex-col">
                <h3 className="text-[#fff] font-bold tracking-wide uppercase text-[14px] mb-4 flex items-center gap-2 border-b border-[#30363d] pb-3">
                   <Bot size={18} className="text-[#f85149]"/> NPU AI Watchdog Intrusion Detection
                </h3>
                <p className="text-[#8b949e] text-[12px] mb-4">
                  The AI Watchdog continuously monitors payload patterns, RPC frequency, and database anomalies to detect zero-day exploits, aimbots, and DDoS attempts in real-time.
                </p>
                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                   {isServerRunning && (
                     <>
                      <div className="bg-[#f85149]/10 border border-[#f85149]/30 rounded p-3 text-[11px] animate-pulse">
                         <div className="flex justify-between font-bold text-[#f85149] mb-1"><span>[WARN] Aimbot Heuristic Triggered</span> <span>UID: 98124</span></div>
                         <div className="text-[#c9d1d9] mt-2 font-mono">Suspicious rotational velocity detected (DeltaYaw &gt; 180deg/10ms). Action: Shadowbanned to cheater lobby.</div>
                      </div>
                      <div className="bg-[#58a6ff]/10 border border-[#58a6ff]/30 rounded p-3 text-[11px]">
                         <div className="flex justify-between font-bold text-[#58a6ff] mb-1"><span>[INFO] RPC Rate Limiter</span> <span>Route: /inventory/swap</span></div>
                         <div className="text-[#c9d1d9] mt-2 font-mono">User 1192 attempting rapid item swap. Rate limited. No drop detected.</div>
                      </div>
                     </>
                   )}
                   {!isServerRunning && (
                     <div className="text-center text-[#8b949e] italic text-[12px] mt-10">Start the cluster to begin live AI monitoring.</div>
                   )}
                </div>
             </div>
           </div>
         )}
         
         {activeTab === 'economy' && (
           <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 w-full">
             <div className="bg-[#161b22] border border-[#e3b341]/40 rounded-xl p-6 shadow-[0_0_30px_rgba(227,179,65,0.05)]">
                 <h3 className="text-[#fff] font-bold tracking-wide uppercase text-[14px] mb-5 flex items-center gap-2 border-b border-[#30363d] pb-3">
                    <Wallet size={18} className="text-[#e3b341]"/> Cryptographically Secure Economy & Inventory
                 </h3>
                 <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-6">
                       <label className="flex items-start gap-3 bg-[#0d1117] p-3 rounded border border-[#30363d] cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-[#e3b341] w-4 h-4 mt-0.5"/>
                          <div>
                             <div className="text-[#e3b341] text-[12px] font-bold mb-1">Receipt Validation (IAP)</div>
                             <div className="text-[#8b949e] text-[10px]">Server-side validation with Apple/Google/Steam before granting premium currency.</div>
                          </div>
                       </label>
                       <label className="flex items-start gap-3 bg-[#0d1117] p-3 rounded border border-[#30363d] cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-[#e3b341] w-4 h-4 mt-0.5"/>
                          <div>
                             <div className="text-[#e3b341] text-[12px] font-bold mb-1">Double-Entry Ledger Accounting</div>
                             <div className="text-[#8b949e] text-[10px]">Prevent currency duplication glitches using strict distributed transactional ledgers.</div>
                          </div>
                       </label>
                       <label className="flex items-start gap-3 bg-[#0d1117] p-3 rounded border border-[#30363d] cursor-pointer">
                          <input type="checkbox" className="accent-[#e3b341] w-4 h-4 mt-0.5"/>
                          <div>
                             <div className="text-[#e3b341] text-[12px] font-bold mb-1">Web3 / Blockchain Integration</div>
                             <div className="text-[#8b949e] text-[10px]">Mint high-tier items as NFTs. (Requires EVM config).</div>
                          </div>
                       </label>
                       <label className="flex items-start gap-3 bg-[#0d1117] p-3 rounded border border-[#30363d] cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-[#e3b341] w-4 h-4 mt-0.5"/>
                          <div>
                             <div className="text-[#e3b341] text-[12px] font-bold mb-1">Player-to-Player Marketplace</div>
                             <div className="text-[#8b949e] text-[10px]">Enable the safe exchange of items using an escrow transaction system.</div>
                          </div>
                       </label>
                    </div>
                 </div>
             </div>
           </div>
         )}
         
         {activeTab === 'telemetry' && (
           <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
             
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                 <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group shadow-lg">
                     <Cpu size={28} className="text-[#58a6ff] mb-2"/>
                     <span className="text-[#fff] font-bold text-2xl font-mono">{cpuUsage.toFixed(1)}%</span>
                     <span className="text-[#8b949e] text-[10px] uppercase font-bold tracking-widest mt-1">CPU Load</span>
                     <div className="h-1 bg-[#58a6ff] absolute bottom-0 left-0 transition-all duration-1000" style={{ width: `${cpuUsage}%`}}></div>
                 </div>
                 <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
                     <HardDrive size={28} className="text-[#bc8cff] mb-2"/>
                     <span className="text-[#fff] font-bold text-2xl font-mono">{ramUsage.toFixed(0)} MB</span>
                     <span className="text-[#8b949e] text-[10px] uppercase font-bold tracking-widest mt-1">Memory Footprint</span>
                     <div className="h-1 bg-[#bc8cff] absolute bottom-0 left-0 transition-all duration-1000" style={{ width: `${Math.min(100, ramUsage/10)}%`}}></div>
                 </div>
                 <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl flex flex-col items-center justify-center shadow-lg">
                     <Network size={28} className="text-[#3fb950] mb-2"/>
                     <span className="text-[#fff] font-bold text-2xl font-mono">{bandwidth.toFixed(2)} Mbps</span>
                     <span className="text-[#8b949e] text-[10px] uppercase font-bold tracking-widest mt-1">Ingress/Egress</span>
                 </div>
                 <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl flex flex-col items-center justify-center shadow-lg">
                     <Users size={28} className="text-[#e3b341] mb-2"/>
                     <span className="text-[#fff] font-bold text-2xl font-mono">{isServerRunning ? '142' : '0'}</span>
                     <span className="text-[#8b949e] text-[10px] uppercase font-bold tracking-widest mt-1">Active Connections</span>
                 </div>
             </div>
             
             <div className="bg-[#161b22] border border-[#30363d] rounded-xl flex-1 flex flex-col overflow-hidden min-h-[400px] shadow-lg">
                <div className="h-10 border-b border-[#30363d] flex items-center px-4 bg-[#0d1117] shrink-0 justify-between">
                   <h3 className="text-[#fff] font-bold tracking-wide text-[12px] flex items-center gap-2 bg-[#0d1117]"><Terminal size={14}/> Live Fleet Console</h3>
                   {isServerRunning && <span className="flex items-center gap-2 text-[10px] text-[#3fb950] font-bold"><span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></span> SYSTEM HEALTHY</span>}
                </div>
                <div className="flex-1 bg-[#050505] p-4 flex flex-col font-mono text-[12px] overflow-y-auto leading-relaxed hide-scrollbar">
                    {serverLogs.length === 0 ? <span className="text-[#888] italic">Fleet is dormant. Press "Deploy Local Cluster" to boot.</span> : null}
                    {serverLogs.map((log, i) => (
                       <div key={i} className="mb-1 flex gap-3">
                          <span className="text-[#888] shrink-0">[{log.time}]</span> 
                          <span className={`${log.type==='error'?'text-[#f85149]':log.type==='warn'?'text-[#e3b341]':log.type==='success'?'text-[#3fb950]':'text-[#58a6ff]'}`}>{log.msg}</span>
                       </div>
                    ))}
                </div>
                <div className="shrink-0 p-3 bg-[#0d1117] border-t border-[#30363d] flex gap-2">
                   <div className="flex items-center text-[#58a6ff] px-2">&gt;</div>
                   <input type="text" placeholder="Type /sys_help for commands" className="flex-1 bg-transparent font-mono text-[12px] text-white outline-none" disabled={!isServerRunning} />
                   <button className="bg-[#21262d] hover:bg-[#30363d] text-white px-4 py-1.5 rounded text-[11px] font-bold transition disabled:opacity-50" disabled={!isServerRunning}>EXECUTE</button>
                </div>
             </div>
           </div>
         )}
         
         {activeTab === 'web_hosting' && (
           <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300 gap-6 w-full max-w-6xl mx-auto">
             <div className="bg-[#161b22] border border-[#ff7b72]/40 rounded-xl p-6 shadow-[0_0_30px_rgba(255,123,114,0.05)]">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#30363d] pb-4 mb-5 gap-4">
                    <h3 className="text-[#fff] font-bold tracking-wide uppercase text-[14px] flex items-center gap-2">
                       <Server size={18} className="text-[#ff7b72]"/> Server Environment Simulation
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[11px] font-bold text-[#8b949e]">PROJECT TYPE:</span>
                       <select 
                          value={projectType} 
                          onChange={(e) => handleProjectTypeChange(e.target.value)}
                          className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[11px] font-bold px-2 py-1 rounded outline-none focus:border-[#58a6ff]"
                       >
                          <option value="auto">Manual Setup</option>
                          <option value="website">Web / Frontend App</option>
                          <option value="game">Online Multiplayer Game</option>
                          <option value="game_web">Game + Web Portal (Multi-Tier)</option>
                          <option value="ecosystem">Full Ecosystem (Game + Web + Admin + Backend)</option>
                          <option value="app">Custom Program / Backend</option>
                       </select>
                    </div>
                 </div>
                 <p className="text-[#8b949e] text-[12px] mb-6">
                   Select the target server environment. The simulation engine will mimic the permissions, file system structure, and performance bottlenecks of the chosen host type.
                 </p>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <label className={`flex flex-col gap-2 bg-[#0d1117] p-4 rounded border cursor-pointer transition-colors relative focus-within:ring-1 focus-within:ring-[#ff7b72] ${hostType === 'shared' ? 'border-[#ff7b72]/50 bg-[#ff7b72]/5' : 'border-[#30363d] hover:border-[#ff7b72]/50'}`}>
                       <div className="flex items-center gap-2">
                          <input type="radio" name="hostType" checked={hostType === 'shared'} onChange={() => setHostType('shared')} className="accent-[#ff7b72]" />
                          <span className="text-[#c9d1d9] font-bold text-[12px]">Shared Web Hosting</span>
                       </div>
                       <p className="text-[#8b949e] text-[10px] leading-relaxed">Simulates typical cPanel/Plesk environments. Limited permissions, shared resources, strict PHP/Apache limits.</p>
                    </label>
                    
                    <label className={`flex flex-col gap-2 bg-[#0d1117] p-4 rounded border cursor-pointer transition-colors relative focus-within:ring-1 focus-within:ring-[#58a6ff] ${hostType === 'vps' ? 'border-[#58a6ff]/50 bg-[#58a6ff]/5' : 'border-[#30363d] hover:border-[#58a6ff]/50'}`}>
                       <div className="flex items-center gap-2">
                          <input type="radio" name="hostType" checked={hostType === 'vps'} onChange={() => setHostType('vps')} className="accent-[#58a6ff]" />
                          <span className="text-[#c9d1d9] font-bold text-[12px]">Virtual Private Server (VPS)</span>
                       </div>
                       <p className="text-[#8b949e] text-[10px] leading-relaxed">Full root access. Simulates KVM virtualized resources. Ideal for Node.js, Python, and custom docker containers.</p>
                    </label>

                    <label className={`flex flex-col gap-2 bg-[#0d1117] p-4 rounded border cursor-pointer transition-colors relative focus-within:ring-1 focus-within:ring-[#e3b341] ${hostType === 'baremetal' ? 'border-[#e3b341]/50 bg-[#e3b341]/5' : 'border-[#30363d] hover:border-[#e3b341]/50'}`}>
                       <div className="flex items-center gap-2">
                          <input type="radio" name="hostType" checked={hostType === 'baremetal'} onChange={() => setHostType('baremetal')} className="accent-[#e3b341]" />
                          <span className="text-[#c9d1d9] font-bold text-[12px]">Dedicated Bare Metal</span>
                       </div>
                       <p className="text-[#8b949e] text-[10px] leading-relaxed">Zero virtualization overhead. Direct hardware access. Used for intense real-time game servers and massive databases.</p>
                    </label>

                    <label className={`flex flex-col gap-2 bg-[#0d1117] p-4 rounded border cursor-pointer transition-colors relative focus-within:ring-1 focus-within:ring-[#bc8cff] ${hostType === 'serverless' ? 'border-[#bc8cff]/50 bg-[#bc8cff]/5' : 'border-[#30363d] hover:border-[#bc8cff]/50'}`}>
                       <div className="flex items-center gap-2">
                          <input type="radio" name="hostType" checked={hostType === 'serverless'} onChange={() => setHostType('serverless')} className="accent-[#bc8cff]" />
                          <span className="text-[#c9d1d9] font-bold text-[12px]">Serverless / Edge</span>
                       </div>
                       <p className="text-[#8b949e] text-[10px] leading-relaxed">Stateless functions deployed globally. Simulates Vercel, Cloudflare Workers, or AWS Lambda limitations.</p>
                    </label>
                 </div>

                 <h3 className="text-[#fff] font-bold tracking-wide uppercase text-[14px] mb-5 flex items-center gap-2 border-b border-[#30363d] pb-3 mt-8">
                    <FileCode2 size={18} className="text-[#ff7b72]"/> Universal File & Language Parser
                 </h3>
                 <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Web & Scripts */}
                    <div className="bg-[#0d1117] border border-[#30363d] rounded p-4">
                       <h4 className="text-[#58a6ff] font-bold text-[12px] mb-2 border-b border-[#30363d] pb-1">Web & Frontend</h4>
                       <p className="text-[10px] text-[#c9d1d9] font-mono leading-relaxed opacity-80">.html .htm .css<br/>.js .ts .jsx .tsx<br/>.vue .svelte</p>
                       <div className="mt-3 flex justify-between items-center text-[10px] uppercase font-bold tracking-wide">
                          <span className="text-[#8b949e]">Auto-Transpile</span>
                          <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-3 h-3"/>
                       </div>
                    </div>

                    <div className="bg-[#0d1117] border border-[#30363d] rounded p-4">
                       <h4 className="text-[#bc8cff] font-bold text-[12px] mb-2 border-b border-[#30363d] pb-1">Backend Interpreters</h4>
                       <p className="text-[10px] text-[#c9d1d9] font-mono leading-relaxed opacity-80">.php .phtml .php3 .php4 .php5 .phar<br/>.py .pyw .pyc<br/>.mjs .cjs <span className="opacity-50">(Node.js)</span></p>
                       <div className="mt-3 flex justify-between items-center text-[10px] uppercase font-bold tracking-wide">
                          <span className="text-[#8b949e]">CGI / FastCGI</span>
                          <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-3 h-3"/>
                       </div>
                    </div>

                    <div className="bg-[#0d1117] border border-[#30363d] rounded p-4">
                       <h4 className="text-[#f85149] font-bold text-[12px] mb-2 border-b border-[#30363d] pb-1">Compiled Languages</h4>
                       <p className="text-[10px] text-[#c9d1d9] font-mono leading-relaxed opacity-80">.c .cpp .h .hpp<br/>.cs <span className="opacity-50">(ASP.NET)</span><br/>.java .class .jar</p>
                       <div className="mt-3 flex justify-between items-center text-[10px] uppercase font-bold tracking-wide">
                          <span className="text-[#8b949e]">JIT/Pre-Compile</span>
                          <input type="checkbox" defaultChecked className="accent-[#f85149] w-3 h-3"/>
                       </div>
                    </div>

                    <div className="bg-[#0d1117] border border-[#30363d] rounded p-4">
                       <h4 className="text-[#e3b341] font-bold text-[12px] mb-2 border-b border-[#30363d] pb-1">Databases & Configs</h4>
                       <p className="text-[10px] text-[#c9d1d9] font-mono leading-relaxed opacity-80">.sql .db .sqlite<br/>.json .xml .yaml .yml .env .ini<br/>.htaccess .conf</p>
                       <div className="mt-3 flex justify-between items-center text-[10px] uppercase font-bold tracking-wide">
                          <span className="text-[#8b949e]">Protect Auth Routes</span>
                          <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3 h-3"/>
                       </div>
                    </div>

                    <div className="bg-[#0d1117] border border-[#30363d] rounded p-4">
                       <h4 className="text-[#3fb950] font-bold text-[12px] mb-2 border-b border-[#30363d] pb-1">Multimedia Streaming</h4>
                       <p className="text-[10px] text-[#c9d1d9] font-mono leading-relaxed opacity-80">.png .jpg .jpeg .gif .webp .svg .ico<br/>.mp3 .wav .ogg<br/>.mp4 .webm</p>
                       <div className="mt-3 flex justify-between items-center text-[10px] uppercase font-bold tracking-wide">
                          <span className="text-[#8b949e]">Edge Caching</span>
                          <input type="checkbox" defaultChecked className="accent-[#3fb950] w-3 h-3"/>
                       </div>
                    </div>

                    <div className="bg-[#0d1117] border border-[#30363d] rounded p-4">
                       <h4 className="text-[#ccc] font-bold text-[12px] mb-2 border-b border-[#30363d] pb-1">3D Assets & Archives</h4>
                       <p className="text-[10px] text-[#c9d1d9] font-mono leading-relaxed opacity-80">.fbx .obj .blend .glsl<br/>.zip .rar .7z</p>
                       <div className="mt-3 flex justify-between items-center text-[10px] uppercase font-bold tracking-wide">
                          <span className="text-[#8b949e]">GZIP / Brotli Compression</span>
                          <input type="checkbox" defaultChecked className="accent-[#ccc] w-3 h-3"/>
                       </div>
                    </div>
                 </div>

                 <div className="mt-6 flex justify-end">
                    <button className="bg-[#ff7b72]/20 hover:bg-[#ff7b72]/30 text-[#ff7b72] border border-[#ff7b72]/50 font-bold px-6 py-2 rounded text-[12px] transition-colors">
                       Restart Omnibus Server Workers
                    </button>
                 </div>
             </div>
           </div>
         )}
         
      </div>
    </div>
  );
}
