import React, { useState } from 'react';
import {
  Server, ShieldX, Network, Cpu, Activity, Globe, Zap, TerminalSquare, Fingerprint, Lock, ShieldCheck, ActivitySquare} from 'lucide-react';

export default function ArchitectureDevOpsEditor() {
  const [activeTab, setActiveTab] = useState<'Cluster' | 'AntiCheat'>('Cluster');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#8b949e] font-sans">
       {/* Header */}
       <div className="h-[64px] bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#58a6ff]/10 to-transparent pointer-events-none"></div>
        <Server size={28} className="text-[#58a6ff] mr-4 shadow-[0_0_15px_rgba(88,166,255,0.4)]" />
        <div className="flex flex-col z-10">
          <h2 className="text-[#c9d1d9] text-[16px] font-bold tracking-tight">System Architecture & DevOps Manager</h2>
          <p className="text-[11px]">Server Cluster Matrix Simulator and Anti-Cheat Local Pentesting.</p>
        </div>
      </div>

      <div className="flex bg-[#161b22] border-b border-[#30363d] h-10 px-4">
        <button onClick={() => setActiveTab('Cluster')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Cluster' ? 'text-[#3fb950] border-b-2 border-[#3fb950] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Globe size={14}/> Cluster Matrix Editor</button>
        <button onClick={() => setActiveTab('AntiCheat')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'AntiCheat' ? 'text-[#f85149] border-b-2 border-[#f85149] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><ShieldX size={14}/> Anti-Cheat & Security</button>
      </div>

      <div className="flex-1 overflow-hidden relative">
         {activeTab === 'Cluster' && <ClusterEditor />}
         {activeTab === 'AntiCheat' && <AntiCheatVisualizer />}
      </div>
    </div>
  );
}

function ClusterEditor() {
   return (
      <div className="flex h-full">
         <div className="flex-1 bg-[#050505] relative overflow-hidden p-6 flex flex-col justify-center">
            
            {/* World Map Background Mockup */}
            <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
               <Globe size={600} strokeWidth={1} />
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto h-[500px] border border-[#30363d] bg-[#161b22]/80 backdrop-blur rounded-xl p-8 flex flex-col">
               <h3 className="text-[#c9d1d9] text-[14px] font-bold uppercase tracking-widest mb-6">Global Topology Simulator</h3>
               
               <div className="flex-1 relative">
                  {/* Nodes */}
                  <div className="absolute top-[20%] left-[20%] flex flex-col items-center">
                     <div className="w-16 h-16 rounded-full bg-[#58a6ff]/20 border-2 border-[#58a6ff] flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(88,166,255,0.4)]">
                        <Server size={24} className="text-[#58a6ff]" />
                     </div>
                     <span className="text-[10px] font-bold text-white uppercase">US-East</span>
                     <span className="text-[9px] text-[#3fb950]">Load: 45%</span>
                  </div>

                  <div className="absolute top-[60%] left-[80%] flex flex-col items-center">
                     <div className="w-16 h-16 rounded-full bg-[#f85149]/20 border-2 border-[#f85149] flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(248,81,73,0.4)] animate-pulse">
                        <Server size={24} className="text-[#f85149]" />
                     </div>
                     <span className="text-[10px] font-bold text-white uppercase">Asia-South</span>
                     <span className="text-[9px] text-[#f85149]">Load: 98% (Bottleneck!)</span>
                  </div>

                  <div className="absolute top-[10%] left-[50%] flex flex-col items-center">
                     <div className="w-12 h-12 rounded bg-[#e3b341]/20 border border-[#e3b341] flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(227,179,65,0.4)]">
                        <ActivitySquare size={20} className="text-[#e3b341]" />
                     </div>
                     <span className="text-[10px] font-bold text-[#e3b341] uppercase">Load Balancer Matrix</span>
                  </div>

                  {/* Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                     <line x1="25%" y1="30%" x2="50%" y2="15%" stroke="#58a6ff" strokeWidth="2" strokeDasharray="4 4" />
                     <line x1="80%" y1="65%" x2="50%" y2="15%" stroke="#f85149" strokeWidth="4" />
                  </svg>
               </div>
            </div>
         </div>

         <div className="w-[300px] border-l border-[#30363d] bg-[#0d1117] flex flex-col p-4 gap-4">
            <div className="text-[12px] font-bold text-[#58a6ff] uppercase tracking-wider mb-2 border-b border-[#30363d] pb-2">Simulation Tools</div>
            
            <button className="bg-[#161b22] border border-[#30363d] p-3 text-left rounded hover:border-[#58a6ff] hover:bg-[#21262d] transition-all">
               <span className="text-[11px] font-bold text-[#c9d1d9] block mb-1">Simulate Traffic Spike</span>
               <span className="text-[9px] block text-[#8b949e]">Injects 1,000,000 requests to selected region.</span>
            </button>
            <button className="bg-[#161b22] border border-[#30363d] p-3 text-left rounded hover:border-[#58a6ff] hover:bg-[#21262d] transition-all">
               <span className="text-[11px] font-bold text-[#c9d1d9] block mb-1">Auto-Scale Sandbox</span>
               <span className="text-[9px] block text-[#8b949e]">Automatically deploy containers when SLA drops below 99%.</span>
            </button>

            <div className="mt-4 flex flex-col gap-2">
               <span className="text-[10px] uppercase font-bold text-[#8b949e]">Real-time Constraints</span>
               <div className="bg-[#0a0a0a] border border-[#30363d] p-2 text-[11px] font-mono rounded flex justify-between">
                  <span>Asia-South Latency</span> <span className="text-[#f85149]">340ms↑</span>
               </div>
            </div>
         </div>
      </div>
   )
}

function AntiCheatVisualizer() {
   return (
      <div className="flex h-full">
         <div className="w-1/4 max-w-[300px] border-r border-[#30363d] bg-[#0d1117] flex flex-col p-4 gap-4 overflow-y-auto">
            <div className="text-[12px] font-bold text-[#f85149] uppercase tracking-wider mb-2 border-b border-[#30363d] pb-2">Red Team Pentesting</div>
            
            <button className="bg-[#f85149]/10 border border-[#f85149]/30 p-3 text-left rounded hover:border-[#f85149] transition-all shadow-[0_0_10px_rgba(248,81,73,0.1)]">
               <span className="text-[11px] font-bold text-[#f85149] flex items-center gap-2 mb-1"><Zap size={14}/> Execute Package Injection</span>
               <span className="text-[9px] block text-[#8b949e]">Simulate modified client packets.</span>
            </button>

            <button className="bg-[#161b22] border border-[#30363d] p-3 text-left rounded hover:border-[#8b949e] transition-all">
               <span className="text-[11px] font-bold text-[#c9d1d9] flex items-center gap-2 mb-1"><Activity size={14}/> Memory Leak Scanner</span>
               <span className="text-[9px] block text-[#8b949e]">Audit runtime memory addresses.</span>
            </button>
            <button className="bg-[#161b22] border border-[#30363d] p-3 text-left rounded hover:border-[#8b949e] transition-all">
               <span className="text-[11px] font-bold text-[#c9d1d9] flex items-center gap-2 mb-1"><Lock size={14}/> Emulate DLL Hooking</span>
               <span className="text-[9px] block text-[#8b949e]">Test engine resistance to wallhacks.</span>
            </button>
         </div>

         <div className="flex-1 bg-[#050505] p-6 flex flex-col">
            <h3 className="text-white text-[20px] font-bold tracking-tight mb-4 flex items-center gap-2"><Fingerprint size={24} className="text-[#f85149]"/> Memory Integrity & Anti-Cheat</h3>
            
            <div className="flex-1 grid grid-rows-2 gap-6">
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 font-mono text-[11px] overflow-hidden flex flex-col">
                  <div className="text-[#8b949e] uppercase mb-2 font-bold tracking-widest flex justify-between">
                     <span>Package Inspection (Live Data Stream)</span>
                     <span className="text-[#3fb950] animate-pulse items-center flex gap-1"><ShieldCheck size={14}/> Secure</span>
                  </div>
                  <div className="flex-1 bg-[#0a0a0a] border border-[#30363d] p-3 rounded overflow-y-auto text-white">
                     <div>[SYS] Checking packet signature 0x8F32... <span className="text-[#3fb950]">VERIFIED</span></div>
                     <div>[SYS] Checking packet signature 0x1A4F... <span className="text-[#3fb950]">VERIFIED</span></div>
                     <div className="text-[#f85149] mt-2">[WARN] Unexpected jump in player Z-coordinate (Possible Aimbot/Flyhack)</div>
                     <div>[SYS] Auto-flagged user UID: 554890. Isolating instance loop...</div>
                  </div>
               </div>

               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 font-mono text-[11px] relative overflow-hidden">
                   <div className="text-[#8b949e] uppercase mb-4 font-bold tracking-widest">Memory Matrix Block (Heap)</div>
                   <div className="grid grid-cols-[repeat(auto-fill,minmax(24px,1fr))] gap-1">
                      {[...Array(200)].map((_, i) => {
                         const rand = Math.random();
                         let bg = '#21262d';
                         if (rand > 0.98) bg = '#f85149'; // injected
                         else if (rand > 0.95) bg = '#e3b341'; // flagged
                         return (
                           <div key={i} className="h-6 border border-[#30363d] rounded cursor-pointer hover:border-white transition-colors" style={{ backgroundColor: bg }} title={`Memory Addr: 0x${(100+i).toString(16).toUpperCase()}`}></div>
                         )
                      })}
                   </div>
                   <div className="absolute bottom-4 right-4 flex gap-4 bg-[#0a0a0a] border border-[#30363d] p-2 rounded">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#21262d] rounded"></div> <span className="text-[10px] text-[#8b949e]">Safe</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#e3b341] rounded"></div> <span className="text-[10px] text-[#8b949e]">Flagged</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#f85149] rounded"></div> <span className="text-[10px] text-[#8b949e]">Compromised</span></div>
                   </div>
               </div>
            </div>
         </div>
      </div>
   )
}
