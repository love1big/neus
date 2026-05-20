import React, { useState } from 'react';
import { Globe, Server, Package, HardDrive, Cpu, Cloud, UploadCloud, ShieldCheck, Activity, Terminal, CheckCircle2, AlertTriangle, Blocks, MonitorPlay } from 'lucide-react';

export default function BuildPublishEditor() {
  const [activeTab, setActiveTab] = useState('build');

  return (
    <div className="flex h-full bg-[#0d1117] text-white overflow-hidden font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#161b22] border-r border-[#30363d] p-3 flex flex-col gap-2 shrink-0">
         <h2 className="text-[12px] font-bold text-[#8b949e] uppercase tracking-wider mb-2 flex items-center gap-2"><Globe size={14}/> DevOps & Publish</h2>
         
         <button onClick={() => setActiveTab('build')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'build' ? 'bg-[#21262d] text-[#3fb950]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <Package size={16}/> Build & Package
         </button>
         <button onClick={() => setActiveTab('cloud')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'cloud' ? 'bg-[#21262d] text-[#58a6ff]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <Cloud size={16}/> Backend & Cloud Sync
         </button>
         <button onClick={() => setActiveTab('assets')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'assets' ? 'bg-[#21262d] text-[#e3b341]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <Blocks size={16}/> Asset Pipeline
         </button>
         <button onClick={() => setActiveTab('security')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'security' ? 'bg-[#21262d] text-[#bc8cff]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <ShieldCheck size={16}/> Anticheat & Security
         </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative bg-[#0a0a0a]">
         {activeTab === 'build' && (
            <div className="max-w-5xl mx-auto">
               <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Package className="text-[#3fb950]"/> One-Click Build & Pipeline</h1>
               
               <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Target Platforms */}
                  <div className="space-y-4">
                     <h2 className="text-sm font-bold text-[#c9d1d9] border-b border-[#30363d] pb-2">Target Platforms</h2>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#161b22] border border-[#3fb950] p-4 rounded text-center cursor-pointer relative overflow-hidden group">
                           <div className="absolute inset-0 bg-[#3fb950]/10 flex items-center justify-center"></div>
                           <Globe size={24} className="mx-auto mb-2 text-[#3fb950] relative z-10"/>
                           <div className="font-bold text-[13px] relative z-10">Web (HTML5/WASM)</div>
                           <div className="text-[10px] text-[#8b949e] relative z-10">WebGL 2.0 / WebGPU</div>
                           <div className="absolute top-2 right-2 text-[#3fb950]"><CheckCircle2 size={14}/></div>
                        </div>
                        <div className="bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] p-4 rounded text-center cursor-pointer transition-colors relative overflow-hidden group">
                           <div className="absolute inset-0 bg-transparent group-hover:bg-[#8b949e]/5 transition-colors"></div>
                           <MonitorPlay size={24} className="mx-auto mb-2 text-[#c9d1d9] relative z-10"/>
                           <div className="font-bold text-[13px] relative z-10">Windows (PC)</div>
                           <div className="text-[10px] text-[#8b949e] relative z-10">DirectX 12 / Vulkan</div>
                        </div>
                        <div className="bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] p-4 rounded text-center cursor-pointer transition-colors">
                           <HardDrive size={24} className="mx-auto mb-2 text-[#c9d1d9]"/>
                           <div className="font-bold text-[13px]">Linux / SteamOS</div>
                           <div className="text-[10px] text-[#8b949e]">Vulkan</div>
                        </div>
                        <div className="bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] p-4 rounded text-center cursor-pointer transition-colors">
                           <Cpu size={24} className="mx-auto mb-2 text-[#c9d1d9]"/>
                           <div className="font-bold text-[13px]">Next-Gen Console</div>
                           <div className="text-[10px] text-[#8b949e]">DevKit Required</div>
                        </div>
                     </div>
                     
                     <h2 className="text-sm font-bold text-[#c9d1d9] border-b border-[#30363d] pb-2 mt-8">Build Configuration</h2>
                     <div className="bg-[#161b22] border border-[#30363d] p-4 rounded space-y-3">
                         <label className="flex items-center justify-between text-[11px]">
                             <span className="text-[#8b949e]">Build Type</span>
                             <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded min-w-[120px] outline-none">
                                <option>Development</option>
                                <option selected>Shipping (Production)</option>
                                <option>Test / QA</option>
                             </select>
                         </label>
                         <label className="flex items-center justify-between text-[11px]">
                             <span className="text-[#8b949e]">Asset Compression</span>
                             <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded min-w-[120px] outline-none">
                                <option>Oodle (High)</option>
                                <option>LZ4 (Fast)</option>
                                <option>Zlib (Standard)</option>
                             </select>
                         </label>
                         <label className="flex items-center justify-between text-[11px]">
                             <span className="text-[#8b949e]">Strip Debug Symbols</span>
                             <input type="checkbox" defaultChecked className="accent-[#3fb950]"/>
                         </label>
                     </div>
                  </div>

                  {/* Right Column - Console & Action */}
                  <div className="flex flex-col h-full bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                     <div className="bg-[#0d1117] p-2 border-b border-[#30363d] flex justify-between items-center text-[11px] font-bold text-[#8b949e] uppercase tracking-wide">
                        <span className="flex items-center gap-1"><Terminal size={14}/> Output Log</span>
                        <span className="text-[#3fb950] flex items-center gap-1"><CheckCircle2 size={12}/> Ready to Build</span>
                     </div>
                     <div className="flex-1 p-3 font-mono text-[10px] text-[#8b949e] overflow-y-auto space-y-1">
                        <div>[00:00:01] LogProjectBase: Target platforms fully validated.</div>
                        <div>[00:00:01] LogAssetRegistry: Loaded 14,235 assets from registry.</div>
                        <div className="text-[#e3b341]">[00:00:02] Warning: Texture 'T_Dirt_01' exceeds recommended mobile budget (4K).</div>
                        <div>[00:00:02] LogCooker: Awaiting compile instruction...</div>
                     </div>
                     <div className="p-4 bg-[#0d1117] border-t border-[#30363d]">
                        <button className="w-full bg-[#3fb950] hover:bg-[#2ea043] text-white font-bold py-3 rounded flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(63,185,80,0.3)] transition-all transform hover:scale-[1.02]">
                           <UploadCloud size={18}/> PACKAGE PROJECT (SHIPPING)
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
         
         {activeTab === 'cloud' && (
            <div className="max-w-5xl mx-auto space-y-6">
               <h1 className="text-2xl font-bold flex items-center gap-2"><Cloud className="text-[#58a6ff]"/> Backend & Cloud Sync</h1>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded space-y-4">
                     <h2 className="text-sm font-bold text-white border-b border-[#30363d] pb-2 flex items-center justify-between">
                         <span>Player Data Services</span>
                         <span className="text-[10px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded">Connected</span>
                     </h2>
                     <div className="space-y-3">
                         <label className="flex items-center justify-between text-[11px] p-2 bg-[#0d1117] border border-[#30363d] rounded">
                             <div className="flex flex-col">
                                 <span className="font-bold text-[#c9d1d9]">Inventory & Entitlements Sync</span>
                                 <span className="text-[9px] text-[#8b949e]">Server-authoritative item grants</span>
                             </div>
                             <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-4 h-4"/>
                         </label>
                         <label className="flex items-center justify-between text-[11px] p-2 bg-[#0d1117] border border-[#30363d] rounded">
                             <div className="flex flex-col">
                                 <span className="font-bold text-[#c9d1d9]">Cross-platform Save Data</span>
                                 <span className="text-[9px] text-[#8b949e]">Cloud save auto-resolution</span>
                             </div>
                             <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-4 h-4"/>
                         </label>
                         <label className="flex items-center justify-between text-[11px] p-2 bg-[#0d1117] border border-[#30363d] rounded">
                             <div className="flex flex-col">
                                 <span className="font-bold text-[#c9d1d9]">Matchmaking Queue (Flex)</span>
                                 <span className="text-[9px] text-[#8b949e]">Skill-based ticket allocation</span>
                             </div>
                             <input type="checkbox" className="accent-[#58a6ff] w-4 h-4"/>
                         </label>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded space-y-4">
                     <h2 className="text-sm font-bold text-white border-b border-[#30363d] pb-2 flex items-center justify-between">
                         <span>Dedicated Server Fleet</span>
                         <span className="text-[10px] bg-[#21262d] text-[#8b949e] px-2 py-0.5 rounded">Not Provisioned</span>
                     </h2>
                     <div className="text-[11px] text-[#8b949e] mb-4">
                        Allocate and manage headless Game Server (GS) instances for multiplier topology.
                     </div>
                     <div className="space-y-3">
                        <label className="flex items-center justify-between text-[11px]">
                           <span>Auto-Scaling Strategy</span>
                           <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none w-32">
                              <option>Buffer (10% warm)</option>
                              <option>Aggressive (30%)</option>
                              <option>Manual Only</option>
                           </select>
                        </label>
                        <label className="flex items-center justify-between text-[11px]">
                           <span>Tickrate Targeting</span>
                           <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none w-32">
                              <option>30 Hz (Standard)</option>
                              <option>60 Hz (Competitive)</option>
                              <option>120 Hz (Esports)</option>
                           </select>
                        </label>
                     </div>
                     <button className="w-full mt-4 bg-[#58a6ff]/10 border border-[#58a6ff]/50 text-[#58a6ff] hover:bg-[#58a6ff]/20 font-bold py-2 rounded transition-colors text-[11px]">
                        Provision Server Fleet
                     </button>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'assets' && (
            <div className="max-w-5xl mx-auto space-y-6">
               <h1 className="text-2xl font-bold flex items-center gap-2"><Blocks className="text-[#e3b341]"/> Asset Pipeline & Optimization</h1>
               <div className="bg-[#161b22] border border-[#30363d] p-1 rounded">
                  <table className="w-full text-left text-[11px]">
                     <thead>
                        <tr className="bg-[#0d1117] text-[#8b949e] uppercase border-b border-[#30363d]">
                           <th className="p-2 font-bold w-1/3">Asset Group</th>
                           <th className="p-2 font-bold text-center">Compression Mode</th>
                           <th className="p-2 font-bold text-center">LOD Generation</th>
                           <th className="p-2 font-bold text-center">Memory Budget</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#30363d]">
                        <tr className="hover:bg-[#21262d]">
                           <td className="p-2 font-bold text-[#c9d1d9] flex justify-between">Hero Characters <span className="text-[#8b949e] font-normal">850MB</span></td>
                           <td className="p-2 text-center">LZ4 / BC7</td>
                           <td className="p-2 text-center text-[#3fb950]">Aggressive (Auto)</td>
                           <td className="p-2 text-center">High (1.2GB)</td>
                        </tr>
                        <tr className="hover:bg-[#21262d]">
                           <td className="p-2 font-bold text-[#c9d1d9] flex justify-between">Foliage & Environment <span className="text-[#8b949e] font-normal">4.2GB</span></td>
                           <td className="p-2 text-center">Oodle / BC5</td>
                           <td className="p-2 text-center text-[#3fb950]">Nanite (Virtual)</td>
                           <td className="p-2 text-center">Scalable</td>
                        </tr>
                        <tr className="hover:bg-[#21262d]">
                           <td className="p-2 font-bold text-[#c9d1d9] flex justify-between">UI/UX Textures <span className="text-[#8b949e] font-normal">120MB</span></td>
                           <td className="p-2 text-center">Uncompressed</td>
                           <td className="p-2 text-center text-[#ff7b72]">None</td>
                           <td className="p-2 text-center">Strict (200MB)</td>
                        </tr>
                        <tr className="hover:bg-[#21262d]">
                           <td className="p-2 font-bold text-[#c9d1d9] flex justify-between">Audio Streams <span className="text-[#8b949e] font-normal">1.8GB</span></td>
                           <td className="p-2 text-center">Ogg Vorbis / Bink</td>
                           <td className="p-2 text-center text-[#8b949e]">Quality Dep.</td>
                           <td className="p-2 text-center">Standard</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
               <div className="flex justify-end gap-3 mt-4">
                  <button className="px-4 py-2 bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-white rounded text-[11px] font-bold transition-colors">Run Asset Audit</button>
                  <button className="px-4 py-2 bg-[#e3b341] hover:bg-[#d29e2f] text-black rounded text-[11px] font-bold shadow-[0_0_10px_rgba(227,179,65,0.2)] transition-colors">Bake & Optimize All</button>
               </div>
            </div>
         )}
         
         {activeTab === 'security' && (
            <div className="max-w-5xl mx-auto space-y-6">
               <h1 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="text-[#bc8cff]"/> Anticheat & Security Metrics</h1>
               <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 bg-[#161b22] border border-[#30363d] p-5 rounded">
                     <h2 className="text-sm font-bold text-white border-b border-[#30363d] pb-2 mb-4">Integrity Enforcements</h2>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-[#3fb950]/20 flex items-center justify-center shrink-0">
                              <CheckCircle2 size={20} className="text-[#3fb950]"/>
                           </div>
                           <div>
                              <div className="font-bold text-[12px] text-white">Client Bundle Obfuscation</div>
                              <div className="text-[10px] text-[#8b949e]">Runtime memory and string encryption active. Map symbols stripped.</div>
                           </div>
                           <label className="ml-auto flex items-center">
                               <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4"/>
                           </label>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-[#3fb950]/20 flex items-center justify-center shrink-0">
                              <CheckCircle2 size={20} className="text-[#3fb950]"/>
                           </div>
                           <div>
                              <div className="font-bold text-[12px] text-white">Kernel-Level Anticheat Hooks</div>
                              <div className="text-[10px] text-[#8b949e]">EasyAntiCheat/BattlEye bootstrapper included in final package.</div>
                           </div>
                           <label className="ml-auto flex items-center">
                               <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4"/>
                           </label>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-[#f85149]/20 flex items-center justify-center shrink-0">
                              <AlertTriangle size={20} className="text-[#f85149]"/>
                           </div>
                           <div>
                              <div className="font-bold text-[12px] text-white">Network Packet Encryption</div>
                              <div className="text-[10px] text-[#f85149]">AES-256 handshake not enforced on developer builds. Risk of packet injection.</div>
                           </div>
                           <button className="ml-auto bg-[#21262d] border border-[#30363d] px-3 py-1 rounded text-[10px] hover:bg-[#30363d]">Enable</button>
                        </div>
                     </div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded text-center flex flex-col justify-center items-center gap-2 h-[300px]">
                     <ShieldCheck size={64} className="text-[#bc8cff] mb-2"/>
                     <div className="text-2xl font-bold text-white">Security Score</div>
                     <div className="text-3xl font-black text-[#e3b341]">85/100</div>
                     <div className="text-[10px] text-[#8b949e] mt-4 max-w-[200px]">
                        Your build has strong client protection but lacks strict network encryption.
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
