import React, { useState } from 'react';
import { Settings, SlidersHorizontal, Box, Wrench, Activity, Hexagon, Component, Cpu, Server, Terminal, Lock, HardDrive, Filter, Gauge, Database, Layers, Network, Code2, Shield, Workflow, MemoryStick, Binary, Bug, AlignLeft, Wifi, Globe, FileJson, Microscope, FileDigit, Microchip, Fingerprint, LockKeyhole, FolderLock, Radar, Stethoscope, CircuitBoard, Cable } from 'lucide-react';

export default function GlobalUniversalDetailsPanel({ activeTool }: { activeTool: string }) {
  const [activeTab, setActiveTab] = useState('properties');

  return (
    <div className="w-[300px] xl:w-[350px] bg-[#0d1117] border-l border-[#30363d] flex flex-col shrink-0 h-full font-sans text-xs shadow-[-5px_0_15px_rgba(0,0,0,0.5)] z-20 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col bg-[#161b22] border-b border-[#30363d] shrink-0">
         <div className="py-2 px-3 flex items-center justify-between border-b border-[#30363d]/50">
             <div className="flex items-center gap-2">
                 <SlidersHorizontal size={14} className="text-[#e3b341]" />
                 <span className="font-bold tracking-wider text-[#c9d1d9] uppercase text-[10px]">Universal Inspector</span>
             </div>
             <div className="flex items-center gap-1 bg-[#0d1117] rounded border border-[#30363d] px-1.5 py-0.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
                 <span className="text-[9px] text-[#8b949e] font-mono">ONLINE</span>
             </div>
         </div>
         
         {/* Tabs */}
         <div className="flex overflow-x-auto no-scrollbar">
             <button 
                 onClick={() => setActiveTab('properties')}
                 className={`flex-1 min-w-fit px-3 py-1.5 text-[10px] font-bold uppercase transition-colors shrink-0 ${activeTab === 'properties' ? 'text-[#c9d1d9] border-b-2 border-[#58a6ff]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
             >
                 Properties
             </button>
             <button 
                 onClick={() => setActiveTab('nonaiools')}
                 className={`flex-1 min-w-fit px-3 py-1.5 text-[10px] font-bold uppercase transition-colors shrink-0 flex items-center gap-1 ${activeTab === 'nonaiools' ? 'text-[#f85149] border-b-2 border-[#f85149]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
             >
                 <Wrench size={10} /> SysTools
             </button>
             <button 
                 onClick={() => setActiveTab('security')}
                 className={`flex-1 min-w-fit px-3 py-1.5 text-[10px] font-bold uppercase transition-colors shrink-0 flex items-center gap-1 ${activeTab === 'security' ? 'text-[#a371f7] border-b-2 border-[#a371f7]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
             >
                 <Shield size={10} /> Sec & Net
             </button>
             <button 
                 onClick={() => setActiveTab('hardware')}
                 className={`flex-1 min-w-fit px-3 py-1.5 text-[10px] font-bold uppercase transition-colors shrink-0 flex items-center gap-1 ${activeTab === 'hardware' ? 'text-[#3fb950] border-b-2 border-[#3fb950]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
             >
                 <CircuitBoard size={10} /> Hardware
             </button>
             <button 
                 onClick={() => setActiveTab('metrics')}
                 className={`flex-1 min-w-fit px-3 py-1.5 text-[10px] font-bold uppercase transition-colors shrink-0 ${activeTab === 'metrics' ? 'text-[#e3b341] border-b-2 border-[#e3b341]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
             >
                 Metrics
             </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#040506]">
          {activeTab === 'properties' && (
              <div className="p-3 flex flex-col gap-4">
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-2">
                       <div className="text-[9px] text-[#8b949e] font-bold uppercase mb-2">Context: {activeTool}</div>
                       <div className="flex flex-col gap-2">
                           <div className="flex justify-between items-center text-[11px]">
                               <span className="text-[#c9d1d9]">Engine Tick Rate</span>
                               <input type="number" defaultValue="60" className="w-[60px] bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded px-1 text-right outline-none focus:border-[#58a6ff]" />
                           </div>
                           <div className="flex justify-between items-center text-[11px]">
                               <span className="text-[#c9d1d9]">Memory Allocation</span>
                               <select className="w-[80px] bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded px-1 outline-none focus:border-[#58a6ff]">
                                  <option>Auto</option><option>2GB Limit</option><option>4GB Limit</option><option>Uncapped</option>
                               </select>
                           </div>
                           <div className="flex justify-between items-center text-[11px]">
                               <span className="text-[#c9d1d9]">Thread Affinity</span>
                               <label className="flex items-center gap-1 cursor-pointer">
                                  <input type="checkbox" className="accent-[#58a6ff]" defaultChecked /> <span className="text-[#8b949e]">Locked</span>
                               </label>
                           </div>
                       </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded p-2">
                      <div className="text-[9px] text-[#8b949e] font-bold uppercase mb-2">Data Serialization</div>
                      <div className="flex flex-col gap-2">
                           <div className="flex justify-between items-center text-[11px]">
                               <span className="text-[#c9d1d9]">Format</span>
                               <select className="w-[80px] bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded px-1 outline-none focus:border-[#58a6ff]">
                                  <option>JSON</option><option>BSON</option><option>MessagePack</option><option>YAML</option>
                               </select>
                           </div>
                           <div className="flex justify-between items-center text-[11px]">
                               <span className="text-[#c9d1d9]">Compression</span>
                               <select className="w-[80px] bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded px-1 outline-none focus:border-[#58a6ff]">
                                  <option>None</option><option>LZ4</option><option>ZSTD</option><option>GZIP</option>
                               </select>
                           </div>
                      </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded p-2">
                      <div className="text-[9px] text-[#8b949e] font-bold uppercase mb-2">Build Configuration</div>
                      <div className="flex flex-col gap-2">
                           <div className="flex justify-between items-center text-[11px]">
                               <span className="text-[#c9d1d9]">Target Platform</span>
                               <select className="w-[80px] bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded px-1 outline-none focus:border-[#58a6ff]">
                                  <option>Win64/DX12</option><option>Linux/Vulkan</option><option>Mac/Metal</option><option>PS5/GMN</option>
                               </select>
                           </div>
                           <div className="flex justify-between items-center text-[11px]">
                               <span className="text-[#c9d1d9]">Optimization</span>
                               <select className="w-[80px] bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded px-1 outline-none focus:border-[#58a6ff]">
                                  <option>O0 (Debug)</option><option>O2 (Release)</option><option>O3 (Aggressive)</option>
                               </select>
                           </div>
                           <div className="flex justify-between items-center text-[11px]">
                               <span className="text-[#c9d1d9]">Link Time Opt</span>
                               <input type="checkbox" className="accent-[#58a6ff]" defaultChecked />
                           </div>
                           <div className="flex justify-between items-center text-[11px]">
                               <span className="text-[#c9d1d9]">PDB Generation</span>
                               <input type="checkbox" className="accent-[#58a6ff]" defaultChecked />
                           </div>
                      </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded p-2">
                       <span className="text-[9px] text-[#8b949e] font-bold uppercase mb-2 block">Environment Variables</span>
                       <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 font-mono text-[9px] text-[#8b949e] space-y-1">
                           <div className="flex items-center justify-between"><span className="text-[#f85149]">NODE_ENV</span> <span className="text-[#c9d1d9]">production</span></div>
                           <div className="flex items-center justify-between"><span className="text-[#f85149]">GPU_DEBUG_LAYER</span> <span className="text-[#c9d1d9]">1</span></div>
                           <div className="flex items-center justify-between"><span className="text-[#f85149]">LUA_PATH</span> <span className="text-[#c9d1d9]">/usr/local/share/lua</span></div>
                           <div className="flex items-center justify-between"><span className="text-[#f85149]">HEAP_SIZE</span> <span className="text-[#c9d1d9]">4096</span></div>
                       </div>
                       <button className="w-full mt-2 text-[#58a6ff] border border-[#58a6ff]/30 hover:bg-[#58a6ff]/10 py-1 text-[9px] uppercase tracking-wider rounded transition-colors">+ Add Variable</button>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col gap-2">
                      <div className="text-[9px] text-[#8b949e] font-bold uppercase">Physics & Collision Matrix</div>
                      <button className="w-full bg-[#21262d] border border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d] py-1 rounded transition-colors text-[10px]">Open Collision Override Table</button>
                      <button className="w-full bg-[#21262d] border border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d] py-1 rounded transition-colors text-[10px]">Material Friction Editor</button>
                  </div>
              </div>
          )}

          {activeTab === 'nonaiools' && (
              <div className="p-3 flex flex-col gap-3">
                  <div className="text-[10px] text-[#8b949e] leading-tight mb-1 font-mono italic">
                     Massive collection of pure logic, system, networking, and filesystem tools. 100% Non-AI operations.
                  </div>
                  
                  {/* Category 1 */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                      <div className="bg-[#21262d] px-2 py-1 text-[9px] font-bold text-[#c9d1d9] border-b border-[#30363d] flex items-center gap-1">
                          <Terminal size={10} /> POSIX Shell & Binaries
                      </div>
                      <div className="p-2 grid grid-cols-2 gap-1.5">
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] text-[9px] text-[#8b949e] hover:text-[#58a6ff] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              <Terminal size={10}/> Execute Bash
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] text-[9px] text-[#8b949e] hover:text-[#58a6ff] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              <Code2 size={10}/> C++ Complier
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] text-[9px] text-[#8b949e] hover:text-[#58a6ff] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              <Box size={10}/> ELF Inspector
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] text-[9px] text-[#8b949e] hover:text-[#58a6ff] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              <Gauge size={10}/> Perf Profiler
                          </button>
                      </div>
                  </div>

                  {/* Category 2 */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                      <div className="bg-[#21262d] px-2 py-1 text-[9px] font-bold text-[#c9d1d9] border-b border-[#30363d] flex items-center gap-1">
                          <Network size={10} /> Networking & IO Protocols
                      </div>
                      <div className="p-2 grid grid-cols-2 gap-1.5">
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#f0883e] text-[9px] text-[#8b949e] hover:text-[#f0883e] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              TCP Proxy
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#f0883e] text-[9px] text-[#8b949e] hover:text-[#f0883e] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              UDP Broadcast
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#f0883e] text-[9px] text-[#8b949e] hover:text-[#f0883e] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Wireshark Log
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#f0883e] text-[9px] text-[#8b949e] hover:text-[#f0883e] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              DNS Resolver
                          </button>
                      </div>
                  </div>

                  {/* Category 3 */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                      <div className="bg-[#21262d] px-2 py-1 text-[9px] font-bold text-[#c9d1d9] border-b border-[#30363d] flex items-center gap-1">
                          <Database size={10} /> Data Pipelines & SQL
                      </div>
                      <div className="p-2 grid grid-cols-2 gap-1.5">
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] text-[9px] text-[#8b949e] hover:text-[#3fb950] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              SQLite Exec
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] text-[9px] text-[#8b949e] hover:text-[#3fb950] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Redis Flush
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] text-[9px] text-[#8b949e] hover:text-[#3fb950] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Schema Sync
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] text-[9px] text-[#8b949e] hover:text-[#3fb950] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              JSON Extract
                          </button>
                      </div>
                  </div>

                  {/* Category 4 */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                      <div className="bg-[#21262d] px-2 py-1 text-[9px] font-bold text-[#c9d1d9] border-b border-[#30363d] flex items-center gap-1">
                          <Layers size={10} /> Asset Compilation
                      </div>
                      <div className="p-2 grid grid-cols-2 gap-1.5">
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] text-[9px] text-[#8b949e] hover:text-[#bc8cff] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Bake ASTC
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] text-[9px] text-[#8b949e] hover:text-[#bc8cff] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Pack VFS
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] text-[9px] text-[#8b949e] hover:text-[#bc8cff] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Shader Build
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] text-[9px] text-[#8b949e] hover:text-[#bc8cff] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Audio Trim
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'security' && (
              <div className="p-3 flex flex-col gap-3">
                  <div className="text-[10px] text-[#8b949e] leading-tight mb-1 font-mono italic">
                      Zero-trust networking, deep packet inspection, and memory-safe enclave compilation.
                  </div>
                  
                  <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                      <div className="bg-[#21262d] px-2 py-1 text-[9px] font-bold text-[#c9d1d9] border-b border-[#30363d] flex items-center gap-1">
                          <LockKeyhole size={10} /> Cryptography
                      </div>
                      <div className="p-2 grid grid-cols-2 gap-1.5">
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#a371f7] text-[9px] text-[#8b949e] hover:text-[#a371f7] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Generate RSA
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#a371f7] text-[9px] text-[#8b949e] hover:text-[#a371f7] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              SHA256 Hash
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#a371f7] text-[9px] text-[#8b949e] hover:text-[#a371f7] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              AES Encrypter
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#a371f7] text-[9px] text-[#8b949e] hover:text-[#a371f7] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Verify JWT
                          </button>
                      </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                      <div className="bg-[#21262d] px-2 py-1 text-[9px] font-bold text-[#c9d1d9] border-b border-[#30363d] flex items-center gap-1">
                          <Radar size={10} /> Malware & Diagnostics
                      </div>
                      <div className="p-2 grid grid-cols-2 gap-1.5">
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#f85149] text-[9px] text-[#8b949e] hover:text-[#f85149] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Heuristic Scan
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#f85149] text-[9px] text-[#8b949e] hover:text-[#f85149] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Decompile APK
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#f85149] text-[9px] text-[#8b949e] hover:text-[#f85149] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Inject Hex
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#f85149] text-[9px] text-[#8b949e] hover:text-[#f85149] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Memory Dump
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'hardware' && (
              <div className="p-3 flex flex-col gap-3">
                  <div className="text-[10px] text-[#8b949e] leading-tight mb-1 font-mono italic">
                      Low-level hardware access, interrupts, bus analyzers, and firmware tools.
                  </div>
                  
                  <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                      <div className="bg-[#21262d] px-2 py-1 text-[9px] font-bold text-[#c9d1d9] border-b border-[#30363d] flex items-center gap-1">
                          <Microchip size={10} /> Threading & Cores
                      </div>
                      <div className="p-2 grid grid-cols-2 gap-1.5">
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] text-[9px] text-[#8b949e] hover:text-[#58a6ff] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Affinity Mask
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] text-[9px] text-[#8b949e] hover:text-[#58a6ff] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Spinlock Trace
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] text-[9px] text-[#8b949e] hover:text-[#58a6ff] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              SIMD Opt
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] text-[9px] text-[#8b949e] hover:text-[#58a6ff] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              Cache Flush
                          </button>
                      </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                      <div className="bg-[#21262d] px-2 py-1 text-[9px] font-bold text-[#c9d1d9] border-b border-[#30363d] flex items-center gap-1">
                          <Cable size={10} /> I/O & Bus 
                      </div>
                      <div className="flex flex-col p-2 gap-2">
                          <div className="flex justify-between items-center text-[10px]">
                              <span className="text-[#8b949e]">PCIe Gen</span>
                              <span className="text-[#3fb950] font-mono">4.0 x16</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                              <span className="text-[#8b949e]">VRAM Clock</span>
                              <span className="text-[#3fb950] font-mono">19.5 Gbps</span>
                          </div>
                      </div>
                      <div className="p-2 border-t border-[#30363d]/50 grid grid-cols-2 gap-1.5">
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] text-[9px] text-[#8b949e] hover:text-[#3fb950] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              USB Packet
                          </button>
                          <button className="bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] text-[9px] text-[#8b949e] hover:text-[#3fb950] py-1.5 rounded transition-colors flex items-center justify-center gap-1">
                              UART Send
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'metrics' && (
              <div className="p-3 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col items-center">
                          <Activity size={16} className="text-[#3fb950] mb-1" />
                          <span className="text-[10px] text-[#8b949e] max-w-[80px] truncate">CPU</span>
                          <span className="text-[16px] font-mono text-[#c9d1d9]">14%</span>
                      </div>
                      <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col items-center">
                          <HardDrive size={16} className="text-[#58a6ff] mb-1" />
                          <span className="text-[10px] text-[#8b949e] max-w-[80px] truncate">RAM</span>
                          <span className="text-[16px] font-mono text-[#c9d1d9]">4.2G</span>
                      </div>
                      <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col items-center">
                          <Gauge size={16} className="text-[#e3b341] mb-1" />
                          <span className="text-[10px] text-[#8b949e] max-w-[80px] truncate">FPS</span>
                          <span className="text-[16px] font-mono text-[#c9d1d9]">120</span>
                      </div>
                      <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col items-center">
                          <Server size={16} className="text-[#bc8cff] mb-1" />
                          <span className="text-[10px] text-[#8b949e] max-w-[80px] truncate">Draw calls</span>
                          <span className="text-[16px] font-mono text-[#c9d1d9]">428</span>
                      </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded p-2">
                       <span className="text-[9px] text-[#8b949e] font-bold uppercase mb-2 block">System Topography Logs</span>
                       <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 font-mono text-[9px] text-[#8b949e] h-[150px] overflow-y-auto space-y-1">
                           <div className="text-[#58a6ff]">[SYS] Engine tick instantiated.</div>
                           <div>[MEM] Allocated 512MB for VBOs.</div>
                           <div>[NET] Listeners bound to 0.0.0.0:3000</div>
                           <div className="text-[#e3b341]">[WARN] Delayed mesh swap on Thread 4.</div>
                           <div>[PHYS] RigidBody state synchronized.</div>
                           <div>[SYS] Tool context updated to: {activeTool}</div>
                           <div>[RENDER] Culling pass completed in 0.04ms</div>
                       </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
