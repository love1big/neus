import React, { useState } from 'react';
import { Bug, Activity, Cpu, Database, Flame, HardDrive, Save, Layers, Clock, Settings, Search, FastForward, Play, Pause, AlertTriangle} from 'lucide-react';

export default function PerformanceProfiler() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stressTestMode, setStressTestMode] = useState(false);
  const [isNavMeshAsync, setIsNavMeshAsync] = useState(false);
  const [memoryStatus, setMemoryStatus] = useState<'idle' | 'filling' | 'trigger_paging' | 'paging' | 'stabilized'>('idle');
  const [ramUsage, setRamUsage] = useState(12);
  const [maxRam] = useState(16);
  const [virtualPool, setVirtualPool] = useState(0);
  const [diskIo, setDiskIo] = useState(0);
  const [simFps, setSimFps] = useState(60);

  const [flameTimings, setFlameTimings] = useState({
    tick: 15.2,
    updateWorld: 9.1,
    physicsTick: 4.5,
    bpController: 3.6,
    navMeshStall: 5.2,
  });

  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
         setFlameTimings(prev => {
            const jitter = () => (Math.random() - 0.5) * 2.0;
            
            let newTick, newPhysics, newUpdateWorld, newBpController, newNavMeshStall;

            if (isNavMeshAsync) {
                newTick = Math.max(9, Math.min(14, prev.tick * 0.8 + 10.0 * 0.2 + jitter()));
                newPhysics = Math.max(2.0, Math.min(6.0, prev.physicsTick + jitter() * 0.5));
                newUpdateWorld = Math.max(4.0, newTick - newPhysics - (1.0 + Math.random())); 
                newBpController = Math.max(2.0, Math.min(5.0, prev.bpController + jitter() * 0.2));
                newNavMeshStall = 0.0;
            } else {
                newTick = Math.max(12, Math.min(24, prev.tick * 0.8 + 15.2 * 0.2 + jitter()));
                newPhysics = Math.max(2.0, Math.min(6.0, prev.physicsTick + jitter() * 0.5));
                newUpdateWorld = Math.max(6.0, newTick - newPhysics - (1.0 + Math.random())); 
                newBpController = Math.max(2.0, Math.min(5.0, prev.bpController + jitter() * 0.2));
                newNavMeshStall = Math.max(2.0, newUpdateWorld - newBpController - 0.5 + jitter() * 0.5);
            }

            return {
               tick: newTick,
               updateWorld: newUpdateWorld,
               physicsTick: newPhysics,
               bpController: newBpController,
               navMeshStall: newNavMeshStall
            };
         });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isNavMeshAsync]);

  React.useEffect(() => {
    if (memoryStatus === 'filling') {
      const interval = setInterval(() => {
        setRamUsage(prev => {
          if (prev >= maxRam - 0.2) {
            setMemoryStatus('trigger_paging');
            return maxRam;
          }
          return prev + 0.5;
        });
        setSimFps(prev => Math.max(15, prev - 2));
      }, 200);
      return () => clearInterval(interval);
    } else if (memoryStatus === 'trigger_paging') {
       const to = setTimeout(() => setMemoryStatus('paging'), 500);
       return () => clearTimeout(to);
    } else if (memoryStatus === 'paging') {
      const interval = setInterval(() => {
        setVirtualPool(prev => {
          if (prev >= 64) {
             setMemoryStatus('stabilized');
             return 64;
          }
          return prev + 4;
        });
        setDiskIo(8.5 + Math.random() * 2);
        setSimFps(12 + Math.random() * 5);
      }, 150);
      return () => clearInterval(interval);
    } else if (memoryStatus === 'stabilized') {
      const interval = setInterval(() => {
        setDiskIo(0.5 + Math.random() * 0.5);
        setSimFps(30 + Math.random() * 2);
        setVirtualPool(prev => prev + Math.random() * 0.2);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [memoryStatus, maxRam]);

  const startStressTest = () => {
     setStressTestMode(true);
     setMemoryStatus('filling');
     setRamUsage(12);
     setVirtualPool(0);
     setDiskIo(0);
     setSimFps(60);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f85149]/10 rounded text-[#f85149]"><Bug size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Advanced Performance Profiler</h2>
              <p className="text-[10px] text-[#8b949e]">Flame Graphs, Memory Leaks, Frame Budget & GPU Trace</p>
            </div>
         </div>
         
         <div className="flex items-center justify-center gap-1 bg-[#0d1117] border border-[#30363d] rounded p-1 text-[11px] font-bold">
            <button onClick={() => setIsPlaying(!isPlaying)} className={`px-4 py-1.5 rounded transition-colors flex items-center gap-2 ${isPlaying ? 'bg-[#f85149]/20 text-[#f85149]' : 'bg-[#2ea043] text-white'}`}>
                {isPlaying ? <><Pause size={12}/> Stop Capture</> : <><Play size={12}/> Start Capture</>}
            </button>
         </div>

         <div className="flex gap-2 text-[11px] font-bold">
            <button onClick={startStressTest} className="px-3 py-1.5 bg-[#f85149]/10 hover:bg-[#f85149]/20 border border-[#f85149]/30 text-[#f85149] rounded flex items-center gap-2 transition-colors"><Database size={12}/> Memory Stress Test</button>
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors"><Save size={12}/> Save Trace</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Summary & Threads */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
            <div className="p-3 border-b border-[#30363d]">
               <div className="text-[11px] font-bold text-[#c9d1d9] uppercase tracking-wide mb-2 flex items-center gap-2"><Activity size={12}/> Target Profile</div>
               <select className="w-full bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-[11px] outline-none text-white font-mono">
                  <option>Client_Windows (Local)</option>
                  <option>Server_Linux (Dedicated)</option>
                  <option>Console_DevKit_01</option>
               </select>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 text-[11px]">
               <div className="font-bold text-[#8b949e] uppercase text-[10px] mb-2 pl-1">Frame Budget</div>
               <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 mb-4">
                  <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-white">Target FPS</span>
                     <span className="text-[#3fb950] font-mono">60.0</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-white">Target MS</span>
                     <span className="text-[#3fb950] font-mono">16.67ms</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-[#30363d]">
                     <span className="font-bold text-[#f85149]">Current MS</span>
                     <span className="text-[#f85149] font-mono font-bold">{(flameTimings.tick + 7.2).toFixed(2)}ms</span>
                  </div>
               </div>

               <div className="font-bold text-[#8b949e] uppercase text-[10px] mb-2 pl-1">Threads</div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 p-1.5 rounded bg-[#f85149]/10 border border-[#f85149]/30 text-white cursor-pointer">
                     <div className="w-2 h-2 rounded-full bg-[#f85149]"></div>
                     <span className="font-mono text-[10px] flex-1">GameThread</span>
                     <span className="font-bold text-[#f85149] transition-all duration-100">{flameTimings.tick.toFixed(1)}ms</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-white cursor-pointer transition-colors">
                     <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                     <span className="font-mono text-[10px] flex-1">RenderThread</span>
                     <span className="font-bold text-[#58a6ff]">6.8ms</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-white cursor-pointer transition-colors">
                     <div className="w-2 h-2 rounded-full bg-[#e3b341]"></div>
                     <span className="font-mono text-[10px] flex-1">PhysicsThread</span>
                     <span className="font-bold text-[#e3b341]">2.1ms</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-white cursor-pointer transition-colors">
                     <div className="w-2 h-2 rounded-full bg-[#bc8cff]"></div>
                     <span className="font-mono text-[10px] flex-1">AudioThread</span>
                     <span className="font-bold text-[#bc8cff]">0.4ms</span>
                  </div>
                  {isNavMeshAsync && (
                     <div className="flex items-center gap-2 p-1.5 rounded bg-[#2ea043]/10 border border-[#2ea043]/30 text-white cursor-pointer transition-colors animate-in fade-in zoom-in duration-300">
                        <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></div>
                        <span className="font-mono text-[10px] flex-1 text-[#3fb950]">AI_WorkerThread</span>
                        <span className="font-bold text-[#3fb950] opacity-80">Async</span>
                     </div>
                  )}
               </div>
            </div>
        </div>

        {/* Right Side: Visualizers */}
        <div className="flex-1 bg-[#0a0a0a] flex flex-col relative overflow-hidden">
           
           {/* Timeline Context */}
           <div className="h-16 border-b border-[#30363d] bg-[#161b22] px-4 py-2 flex flex-col justify-end relative">
              <div className="flex justify-between text-[9px] text-[#8b949e] font-mono absolute top-2 left-4 right-4">
                 <span>0.0s</span><span>0.5s</span><span>1.0s</span><span>1.5s</span><span>2.0s</span>
              </div>
              <div className="h-6 bg-[#0d1117] border border-[#30363d] rounded flex relative overflow-hidden w-full">
                 {/* Mock Timeline Data */}
                 <div className="absolute top-0 bottom-0 bg-[#3fb950]/30 w-full"></div>
                 {/* Spikes */}
                 <div className="absolute top-0 bottom-0 bg-[#f85149]/60 w-1 left-[20%]"></div>
                 <div className="absolute top-0 bottom-0 bg-[#f85149]/60 w-2 left-[55%]"></div>
                 <div className="absolute top-0 bottom-0 bg-[#f85149] w-4 left-[80%]"></div>
                 
                 {/* Selection Box */}
                 <div className="absolute top-0 bottom-0 bg-[#58a6ff]/10 border-x border-[#58a6ff] w-32 left-[70%]"></div>
              </div>
           </div>

           {/* Flame Graph Window */}
           <div className="flex-1 p-4 flex flex-col relative">
              <div className="flex justify-between items-center mb-4">
                 <span className="font-bold text-[11px] uppercase tracking-wide text-[#c9d1d9] flex items-center gap-2"><Flame size={14} className="text-[#f85149]"/> GameThread Flame Graph (Selected Range)</span>
                 <div className="text-[10px] text-[#8b949e] bg-[#21262d] px-2 py-1 rounded">Zoom: 400x</div>
              </div>

              {/* Flame Graph Mock */}
              <div className="flex-1 overflow-auto custom-scrollbar relative border border-[#30363d] bg-[#111] p-2 rounded block">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zOSA0MHYtNDBoMXY0MEgzOXptLTQtNDBoMXY0MGgtMXYtNDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] pointer-events-none opacity-50"></div>
                  
                  <div className="relative mt-[2px] h-6 bg-[#f85149]/80 border border-[#f85149] rounded-[2px] text-[10px] font-mono text-black font-bold flex items-center px-2 shadow-sm hover:brightness-125 cursor-pointer overflow-hidden transition-all duration-100 ease-linear" style={{ width: `${Math.min(100, flameTimings.tick * 3.5)}%` }}>Tick ({flameTimings.tick.toFixed(1)}ms)</div>
                  
                  <div className="flex relative mt-[2px] transition-all duration-100 ease-linear" style={{ width: `${Math.min(100, flameTimings.tick * 3.5)}%` }}>
                     <div className="h-6 bg-[#f85149]/70 border border-[#f85149] rounded-[2px] text-[10px] font-mono text-black font-bold flex items-center px-2 shadow-sm hover:brightness-125 cursor-pointer overflow-hidden transition-all duration-100 ease-linear" style={{ width: `${(flameTimings.updateWorld / flameTimings.tick) * 100}%` }}>UpdateWorld ({flameTimings.updateWorld.toFixed(1)}ms)</div>
                     <div className="h-6 bg-[#e3b341]/80 border border-[#e3b341] rounded-[2px] text-[10px] font-mono text-black font-bold flex items-center px-2 ml-[2px] shadow-sm hover:brightness-125 cursor-pointer overflow-hidden transition-all duration-100 ease-linear" style={{ width: `${(flameTimings.physicsTick / flameTimings.tick) * 100}%` }}>PhysicsTick ({flameTimings.physicsTick.toFixed(1)}ms)</div>
                     <div className="h-6 bg-[#58a6ff]/80 border border-[#58a6ff] rounded-[2px] text-[10px] font-mono text-black font-bold flex items-center px-2 ml-[2px] flex-1 shadow-sm hover:brightness-125 cursor-pointer truncate overflow-hidden transition-all duration-100 ease-linear">Wait</div>
                  </div>

                  <div className="flex relative mt-[2px] transition-all duration-100 ease-linear" style={{ width: `${Math.min(100, flameTimings.tick * 3.5) * (flameTimings.updateWorld / flameTimings.tick)}%` }}>
                     <div className="h-6 bg-[#f85149]/60 border border-[#f85149] rounded-[2px] text-[10px] font-mono text-black font-bold flex items-center px-2 shadow-sm hover:brightness-125 cursor-pointer overflow-hidden flex-shrink-0 transition-all duration-100 ease-linear" style={{ width: `${(flameTimings.bpController / flameTimings.updateWorld) * 100}%` }}>BP_PlayerCtrl ({flameTimings.bpController.toFixed(1)}ms)</div>
                     <div className="h-6 bg-[#f85149]/50 border border-[#f85149] rounded-[2px] text-[10px] font-mono text-black font-bold flex items-center px-2 ml-[2px] flex-1 shadow-sm hover:brightness-125 cursor-pointer overflow-hidden transition-all duration-100 ease-linear">AI_Pathfinding ({Math.max(0, flameTimings.updateWorld - flameTimings.bpController).toFixed(1)}ms)</div>
                  </div>

                  <div className="flex relative mt-[2px] transition-all duration-100 ease-linear" style={{ width: `${Math.min(100, flameTimings.tick * 3.5) * (flameTimings.updateWorld / flameTimings.tick)}%` }}>
                     <div className="transition-all duration-100 ease-linear flex-shrink-0" style={{ width: `${(flameTimings.bpController / flameTimings.updateWorld) * 100}%` }}></div>
                     {isNavMeshAsync ? (
                        <div className="h-6 bg-[#2ea043]/30 border border-[#2ea043]/50 rounded-[2px] text-[10px] font-mono text-[#3fb950] flex items-center px-2 shadow-sm cursor-pointer overflow-hidden ml-[2px] transition-all duration-100 ease-linear w-full opacity-60">Offloaded to Worker Thread (Async)</div>
                     ) : (
                        <div className="h-6 bg-[#8b949e] border border-white/20 rounded-[2px] text-[10px] font-mono text-white flex items-center px-2 shadow-sm animate-pulse cursor-pointer overflow-hidden ml-[2px] transition-all duration-100 ease-linear" style={{ width: `${(flameTimings.navMeshStall / flameTimings.updateWorld) * 100}%` }}>NavMesh Sync [STALL] ({flameTimings.navMeshStall.toFixed(1)}ms)</div>
                     )}
                  </div>
              </div>

               {/* AI Insight Box - Top 3 Bottlenecks */}
               <div className="mt-4 bg-[#f85149]/10 border border-[#f85149]/30 rounded-lg p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                     <AlertTriangle size={16} className="text-[#f85149]"/>
                     <h3 className="text-[12px] font-bold text-[#f85149] uppercase tracking-wide">Top 3 Frame Time Bottlenecks (AI Analysis)</h3>
                  </div>
                  <div className="flex flex-col gap-3 mt-1">
                     <div className={`bg-[#161b22] border ${isNavMeshAsync ? 'border-[#3fb950]/50' : 'border-[#30363d]'} rounded p-3 transition-colors`}>
                        <div className="flex justify-between items-center mb-1">
                           <span className={`text-[11px] font-bold ${isNavMeshAsync ? 'text-[#3fb950]' : 'text-[#c9d1d9]'}`}>{isNavMeshAsync ? '1. NavMesh (Async Worker Thread)' : '1. NavMesh Sync [STALL]'}</span>
                           <span className={`text-[11px] font-mono ${isNavMeshAsync ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>{isNavMeshAsync ? '0.0ms (Main Thread)' : '~5.2ms'}</span>
                        </div>
                        <p className="text-[11px] text-[#8b949e] mb-2">{isNavMeshAsync ? 'Pathfinding queries are now safely calculated in the background without hitching the main event loop.' : 'Synchronous pathfinding recalculation blocks the Main Thread during AI navigation updates.'}</p>
                        {!isNavMeshAsync && (
                            <div onClick={() => setIsNavMeshAsync(true)} className="text-[11px] text-[#3fb950] font-bold cursor-pointer hover:underline flex items-center gap-1"><FastForward size={12}/> Refactor: Move pathfinding queries to an Async Task Graph (Worker Thread).</div>
                        )}
                     </div>
                     <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-[11px] font-bold text-[#c9d1d9]">2. PhysicsTick</span>
                           <span className="text-[11px] font-mono text-[#e3b341]">~4.5ms</span>
                        </div>
                        <p className="text-[11px] text-[#8b949e] mb-2">High processing time resolving complex collision meshes and overlapping rigidbodies.</p>
                        <div className="text-[11px] text-[#3fb950] font-bold cursor-pointer hover:underline flex items-center gap-1"><FastForward size={12}/> Refactor: Simplify collision hulls (use primitives) and reduce physics sub-stepping frequency.</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-[11px] font-bold text-[#c9d1d9]">3. Blueprint: BP_PlayerController</span>
                           <span className="text-[11px] font-mono text-[#e3b341]">~3.6ms</span>
                        </div>
                        <p className="text-[11px] text-[#8b949e] mb-2">VM execution overhead caused by complex visual scripting logic running on Event Tick.</p>
                        <div className="text-[11px] text-[#3fb950] font-bold cursor-pointer hover:underline flex items-center gap-1"><FastForward size={12}/> Refactor: Nativize math operations to C++ and migrate from Event Tick to Event-Driven logic.</div>
                     </div>
                  </div>
               </div>
           </div>

        </div>
      </div>
      
      {stressTestMode && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
           <div className="bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl w-[600px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center px-4 py-3 border-b border-[#30363d] bg-[#0d1117]">
                  <div className="flex items-center gap-2">
                     <HardDrive size={18} className="text-[#f85149]"/>
                     <span className="font-bold text-[#c9d1d9]">Memory Pressure Stress Test</span>
                  </div>
                  <button onClick={() => { setStressTestMode(false); setMemoryStatus('idle'); }} className="text-[#8b949e] hover:text-white">&times;</button>
               </div>
               <div className="p-6 flex flex-col gap-6">
                  <p className="text-[12px] text-[#8b949e]">
                    Simulating aggressive memory allocation to dry out Physical RAM and verify the <strong className="text-[#58a6ff]">Infinite Virtual Memory Paging</strong> survival mechanism.
                  </p>

                  <div className="flex flex-col gap-4">
                     <div>
                        <div className="flex justify-between text-[11px] mb-1 uppercase tracking-wide font-bold">
                           <span className={memoryStatus !== 'idle' && ramUsage >= maxRam ? "text-[#f85149] animate-pulse" : "text-[#c9d1d9]"}>Physical RAM</span>
                           <span className="text-white font-mono">{ramUsage.toFixed(1)} GB / {maxRam} GB</span>
                        </div>
                        <div className="w-full bg-[#0d1117] h-3 rounded-full overflow-hidden border border-[#30363d]">
                            <div className="h-full bg-gradient-to-r from-[#3fb950] via-[#e3b341] to-[#f85149] transition-all duration-200" style={{width: `${(ramUsage/maxRam)*100}%`}}></div>
                        </div>
                     </div>

                     <div className={`transition-opacity duration-500 ${virtualPool > 0 ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="flex justify-between text-[11px] mb-1 uppercase tracking-wide font-bold">
                           <span className="text-[#58a6ff]">Virtual Storage Pool (NVMe/SSD)</span>
                           <span className="text-[#58a6ff] font-mono">{virtualPool.toFixed(1)} GB Allocated</span>
                        </div>
                        <div className="w-full bg-[#0d1117] h-3 rounded-full overflow-hidden border border-[#58a6ff]/30">
                            <div className="h-full bg-[#58a6ff] transition-all duration-100" style={{width: `${Math.min((virtualPool/100)*100, 100)}%`}}></div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 flex flex-col items-center justify-center">
                         <span className="text-[10px] text-[#8b949e] uppercase font-bold text-center">Disk I/O Bandwidth</span>
                         <span className="text-2xl font-mono font-bold text-[#e3b341] mt-1">{diskIo.toFixed(2)} <span className="text-[14px]">GB/s</span></span>
                      </div>
                      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 flex flex-col items-center justify-center">
                         <span className="text-[10px] text-[#8b949e] uppercase font-bold text-center">Main Thread FPS</span>
                         <span className={`text-2xl font-mono font-bold mt-1 ${simFps < 20 ? 'text-[#f85149]' : 'text-[#3fb950]'}`}>{simFps.toFixed(0)} <span className="text-[14px]">FPS</span></span>
                      </div>
                  </div>

                  <div className="bg-[#161b22] border-l-4 border-[#3fb950] border-y border-r border-y-[#30363d] border-r-[#30363d] p-3 text-[11px] text-[#c9d1d9]">
                      {memoryStatus === 'idle' ? 'Ready to initiate test.' :
                       memoryStatus === 'filling' ? 'Allocating 8K textures and procedural meshes into RAM...' :
                       memoryStatus === 'trigger_paging' ? <span className="text-[#f85149] font-bold">CRITICAL: Physical Memory Exhausted! Engine crash imminent...</span> :
                       memoryStatus === 'paging' ? <span className="text-[#58a6ff] font-bold">ALERT: Unified Virtual Pool engaged. Hot-swapping memory pages to NVMe array...</span> :
                       <span className="text-[#3fb950] font-bold">STABILIZED: Engine survived memory exhaustion. Performance degraded but process remains alive!</span>}
                  </div>
               </div>
           </div>
        </div>
      )}
    </div>
  );
}
