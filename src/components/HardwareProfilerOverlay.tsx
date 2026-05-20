import React, { useState, useEffect } from 'react';
import { Cpu, MemoryStick, Activity, Flame, LayoutDashboard, Target, Zap, Server, HardDrive, Wifi, Eye, RadioReceiver, Sliders, Monitor, Plus, X } from 'lucide-react';

type Era = 'Past (1970-2010)' | 'Present (2010-2026)' | 'Future (2027+)';

interface GPUConfig {
  id: string;
  name: string;
  vendor: 'NVIDIA' | 'AMD' | 'Intel' | 'FutureTech';
  isIGPU: boolean;
  type: 'GPU' | 'TPU' | 'NPU';
  vramMax: number;
}

export default function HardwareProfilerOverlay() {
  const [expanded, setExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showArchitect, setShowArchitect] = useState(false); // Simulator configuration
  
  // Hardware Loadout Configuration
  const [cpuName, setCpuName] = useState('AMD Ryzen 9 9950X3D');
  const [ramName, setRamName] = useState('128GB DDR5-8000');
  const [accelerators, setAccelerators] = useState<GPUConfig[]>([
    { id: '1', name: 'Radeon™ 800M Graphics', vendor: 'AMD', isIGPU: true, type: 'GPU', vramMax: 8 },
    { id: '2', name: 'GeForce RTX 5090', vendor: 'NVIDIA', isIGPU: false, type: 'GPU', vramMax: 32 },
    { id: '3', name: 'DeepMind TPU v7', vendor: 'FutureTech', isIGPU: false, type: 'TPU', vramMax: 128 },
    { id: '4', name: 'Hexagon™ NPU Elite', vendor: 'Intel', isIGPU: false, type: 'NPU', vramMax: 0 }
  ]);

  // Power limits
  const [powerLimit, setPowerLimit] = useState(100);
  const [fanCurve, setFanCurve] = useState('aggressive');
  
  const [stats, setStats] = useState({
    fps: 144.2,
    fps1Low: 82.4,
    frameTime: 6.93,
    cpuUsage: 12,
    cpuTemp: 60,
    ramUsage: 14.2,
    drawCalls: 4204,
    cores: [45,20,80,10,15,60,95,5,10,20,15,5,8,4,2,1],
    cpuPwr: 45,
    accelStats: {} as Record<string, { usage: number, temp: number, pwr: number, vram: number }>
  });

  useEffect(() => {
    let frameId: number;
    let lastUpdate = Date.now();

    const loop = () => {
      const now = Date.now();
      if (now - lastUpdate > 500) { // Update every 500ms
        setStats(prev => {
           const plMult = powerLimit / 100;
           
           // Generate random stats for each dynamic accelerator
           const newAccelStats: Record<string, { usage: number, temp: number, pwr: number, vram: number }> = {};
           accelerators.forEach((acc, i) => {
             const prevStat = prev.accelStats[acc.id] || { usage: 50, temp: 50, pwr: 50, vram: 0 };
             newAccelStats[acc.id] = {
               usage: Math.max(0, Math.min(100, prevStat.usage + (Math.random() * 10 - 5))),
               temp: Math.max(30, Math.min(105, prevStat.temp + (Math.random() * 4 - 2))),
               pwr: Math.max(5, Math.min(600 * plMult, prevStat.pwr + (Math.random() * 20 - 10))),
               vram: Math.max(0, Math.min(acc.vramMax, prevStat.vram + (Math.random() * 0.5 - 0.25)))
             };
           });

           return {
             fps: prev.fps + (Math.random() * 4 - 2) * plMult,
             fps1Low: Math.max(30, prev.fps1Low + (Math.random() * 10 - 5) * plMult),
             frameTime: (1000 / (prev.fps + (Math.random() * 4 - 2))),
             cpuUsage: Math.max(5, Math.min(100, prev.cpuUsage + (Math.random() * 10 - 5))),
             cpuTemp: Math.max(40, Math.min(95, prev.cpuTemp + (Math.random() * 2 - 1))),
             ramUsage: Math.max(2, Math.min(128, prev.ramUsage + (Math.random() * 0.5 - 0.2))),
             drawCalls: Math.max(1000, Math.min(100000, prev.drawCalls + Math.floor(Math.random() * 500 - 250))),
             cores: prev.cores.map(c => Math.max(0, Math.min(100, c + (Math.random() * 20 - 10)))),
             cpuPwr: Math.max(10, Math.min(250 * plMult, prev.cpuPwr + (Math.random() * 10 - 5))),
             accelStats: newAccelStats
           };
        });
        lastUpdate = now;
      }
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [powerLimit, accelerators]);

  const addAccelerator = () => {
    setAccelerators([...accelerators, {
       id: Math.random().toString(), 
       name: 'Custom Accelerator', 
       vendor: 'FutureTech', 
       isIGPU: false, 
       type: 'GPU', 
       vramMax: 64 
    }]);
  };

  const removeAccelerator = (id: string) => {
    setAccelerators(accelerators.filter(a => a.id !== id));
  };

  if (!expanded) {
    return (
       <div 
         onClick={() => setExpanded(true)}
         className="absolute top-16 right-4 z-[100] bg-[#161b22]/90 backdrop-blur border border-[#30363d] rounded-lg p-2 shadow-xl cursor-pointer hover:border-[#58a6ff] transition-colors flex flex-col gap-1 w-[220px] text-[10px] font-mono">
          <div className="flex justify-between items-center text-white mb-1">
             <span className="font-bold flex items-center gap-1"><Activity size={10} className="text-[#58a6ff]"/> MULTI-ARCH PROFILER</span>
             <span className="text-[#3fb950] font-bold">{stats.fps.toFixed(1)} FPS</span>
          </div>
          <div className="flex justify-between text-[#8b949e] truncate" title={cpuName}><span>CPU:</span> <span>{stats.cpuUsage.toFixed(1)}% ({stats.cpuTemp.toFixed(1)}°C)</span></div>
          {accelerators.slice(0, 2).map(acc => (
              <div key={acc.id} className="flex justify-between text-[#8b949e] truncate" title={acc.name}>
                 <span>{acc.type}:</span> <span>{stats.accelStats[acc.id]?.usage.toFixed(1)}% ({stats.accelStats[acc.id]?.temp.toFixed(1)}°C)</span>
              </div>
          ))}
          {accelerators.length > 2 && <div className="text-[8px] text-right text-[#58a6ff]">+{accelerators.length - 2} more accelerators active</div>}
          <div className="h-1 w-full bg-[#0d1117] rounded-full overflow-hidden mt-1 flex">
             <div className="h-full bg-[#f85149]" style={{ width: `${stats.cpuUsage}%` }}></div>
             <div className="h-full bg-[#3fb950]" style={{ width: `${stats.accelStats[accelerators[0]?.id]?.usage || 0}%` }}></div>
             <div className="h-full bg-[#bc8cff]" style={{ width: `${stats.accelStats[accelerators[1]?.id]?.usage || 0}%` }}></div>
          </div>
       </div>
    );
  }

  return (
    <div className="absolute top-16 right-4 bottom-24 w-[420px] z-[100] bg-[#161b22]/95 backdrop-blur-xl border border-[#30363d] rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#c9d1d9] transition-all">
      <div className="flex items-center justify-between p-3 border-b border-[#30363d] bg-[#0d1117] shrink-0">
         <h3 className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <LayoutDashboard size={14} className="text-[#58a6ff]"/> Heterogeneous Profiler
         </h3>
         <div className="flex gap-2">
            <button onClick={() => setShowArchitect(!showArchitect)} className={`text-[#8b949e] hover:text-[#bc8cff] transition-colors p-1 ${showArchitect ? 'text-[#bc8cff]' : ''}`} title="Hardware Architect (Past/Present/Future)"><Monitor size={14} /></button>
            <button onClick={() => setShowSettings(!showSettings)} className={`text-[#8b949e] hover:text-[#58a6ff] transition-colors p-1 ${showSettings ? 'text-[#58a6ff]' : ''}`} title="Tuning Settings"><Sliders size={14} /></button>
            <button onClick={() => setExpanded(false)} className="text-[#8b949e] hover:text-white transition-colors text-[10px] uppercase font-bold border border-[#30363d] px-2 py-0.5 rounded">Collapse</button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-4 text-[10px] font-mono">
         
         {/* Hardware Architect Form */}
         {showArchitect && (
            <div className="bg-[#0d1117] border border-[#bc8cff]/30 rounded p-3 mb-2 flex flex-col gap-4 shadow-[0_0_15px_rgba(188,140,255,0.1)] relative">
               <h4 className="text-[12px] font-bold text-[#bc8cff] border-b border-[#30363d] pb-2 flex items-center gap-2">
                 <Server size={14}/> Hardware Architecture Array
               </h4>
               <p className="text-[#8b949e] text-[9px] leading-tight">Simulate and harness computing power from the past, present, and future simultaneously across multiple interconnected fabrics.</p>
               
               {/* CPU & RAM Config */}
               <div className="flex flex-col gap-2">
                  <label className="text-[9px] text-[#8b949e] uppercase">CPU Core Complex</label>
                  <select className="bg-[#161b22] text-white py-1 px-2 rounded border border-[#30363d] outline-none" value={cpuName} onChange={e => setCpuName(e.target.value)}>
                      <optgroup label="Past (Legacy)">
                         <option>Intel 8086 (16-bit)</option>
                         <option>Pentium 4 HT (x86_64)</option>
                         <option>IBM Cell Broadband Engine</option>
                      </optgroup>
                      <optgroup label="Present">
                         <option>Intel Core i9-14900KS</option>
                         <option>AMD Ryzen 9 9950X3D</option>
                         <option>Apple M3 Max</option>
                      </optgroup>
                      <optgroup label="Future (Quantum / Photonic)">
                         <option>Quantum-Optic Core v1</option>
                         <option>Bio-Neural Processor (AGI-Sync)</option>
                         <option>Dyson Swarm Compute Node</option>
                      </optgroup>
                  </select>

                  <label className="text-[9px] text-[#8b949e] uppercase mt-2">System Memory (RAM)</label>
                  <select className="bg-[#161b22] text-white py-1 px-2 rounded border border-[#30363d] outline-none" value={ramName} onChange={e => setRamName(e.target.value)}>
                      <option>16MB EDO RAM (Legacy)</option>
                      <option>32GB DDR4-3600</option>
                      <option>128GB DDR5-8000</option>
                      <option>1TB Quantum-State Memory (QRAM)</option>
                  </select>
               </div>

               {/* Multi-GPU / TPU Array */}
               <div className="flex flex-col gap-2 border-t border-[#30363d] pt-2">
                  <div className="flex justify-between items-center text-[9px] text-[#8b949e] uppercase">
                    <span>Heterogeneous Accelerators (GPU/NPU/TPU)</span>
                    <button onClick={addAccelerator} className="bg-[#bc8cff]/20 text-[#bc8cff] px-1 py-0.5 rounded flex items-center hover:bg-[#bc8cff]/40"><Plus size={10}/> Add Node</button>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                     {accelerators.map((acc, index) => (
                        <div key={acc.id} className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col gap-1 relative group">
                           <button onClick={() => removeAccelerator(acc.id)} className="absolute top-1 right-1 text-[#f85149] opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                           
                           <div className="flex gap-2">
                              <select 
                                className="bg-[#0a0a0a] text-white py-0.5 px-1 rounded border border-[#30363d] outline-none flex-1"
                                value={acc.type}
                                onChange={e => {
                                   const newAcc = [...accelerators];
                                   newAcc[index].type = e.target.value as any;
                                   setAccelerators(newAcc);
                                }}>
                                 <option value="GPU">GPU</option>
                                 <option value="TPU">TPU</option>
                                 <option value="NPU">NPU</option>
                              </select>
                              <select 
                                className="bg-[#0a0a0a] text-white py-0.5 px-1 rounded border border-[#30363d] outline-none flex-1"
                                value={acc.vendor}
                                onChange={e => {
                                   const newAcc = [...accelerators];
                                   newAcc[index].vendor = e.target.value as any;
                                   setAccelerators(newAcc);
                                }}>
                                 <option>NVIDIA</option>
                                 <option>AMD</option>
                                 <option>Intel</option>
                                 <option>Google</option>
                                 <option>FutureTech</option>
                              </select>
                           </div>
                           
                           <input 
                             type="text" 
                             className="bg-[#0a0a0a] text-white py-0.5 px-1 rounded border border-[#30363d] outline-none w-full" 
                             value={acc.name} 
                             onChange={e => {
                                const newAcc = [...accelerators];
                                newAcc[index].name = e.target.value;
                                setAccelerators(newAcc);
                             }} 
                             placeholder="Component Name (e.g. RTX 5090)" 
                           />
                           
                           <div className="flex items-center gap-2 mt-1">
                             <label className="flex items-center gap-1 text-[#8b949e]">
                               <input 
                                 type="checkbox" 
                                 className="accent-[#bc8cff]" 
                                 checked={acc.isIGPU} 
                                 onChange={e => {
                                   const newAcc = [...accelerators];
                                   newAcc[index].isIGPU = e.target.checked;
                                   setAccelerators(newAcc);
                                 }}/> iGPU
                             </label>
                             <div className="flex items-center gap-1 flex-1 text-right justify-end text-[#8b949e]">
                                VRAM/Mem (GB):
                                <input 
                                 type="number" 
                                 className="bg-[#0a0a0a] text-white py-0.5 px-1 rounded border border-[#30363d] outline-none w-12" 
                                 value={acc.vramMax}
                                 onChange={e => {
                                   const newAcc = [...accelerators];
                                   newAcc[index].vramMax = parseInt(e.target.value) || 0;
                                   setAccelerators(newAcc);
                                 }}
                                />
                             </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="bg-[#2ea043]/10 border border-[#2ea043]/50 text-[#3fb950] p-2 rounded flex gap-2 items-start mt-2">
                     <RadioReceiver size={14} className="shrink-0 mt-0.5"/>
                     <span className="text-[9px]">Infinity Fabric / NVLink / Compute Express Link (CXL) sync active. Asymmetric rendering enabled simultaneously across all vendors.</span>
                  </div>
               </div>
            </div>
         )}
         
         {showSettings && (
            <div className="bg-[#0d1117] border border-[#58a6ff]/30 rounded p-3 mb-2 flex flex-col gap-4 shadow-[0_0_15px_rgba(88,166,255,0.1)]">
              <h4 className="text-[12px] font-bold text-[#58a6ff] border-b border-[#30363d] pb-2 flex items-center gap-2"><Flame size={14} className="text-[#f85149]"/> Deep Tuning & Limits</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] text-[#8b949e] mb-1">
                     <span>Global Asymmetric TDP Limit</span>
                    <span className="text-white font-bold">{powerLimit}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" max="150" 
                    value={powerLimit} 
                    onChange={(e) => setPowerLimit(parseInt(e.target.value))}
                    className="w-full accent-[#58a6ff] cursor-pointer"
                  />
                </div>
              </div>
            </div>
         )}
         
         {/* FPS & Frame Time */}
         <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-2">
               <span className="font-bold text-[#c9d1d9] flex items-center gap-1"><Target size={12} className="text-[#3fb950]"/> Asymmetric Render Pipeline</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
               <div className="flex flex-col">
                  <span className="text-[#8b949e] text-[9px]">Combined FPS</span>
                  <span className="text-xl font-bold text-[#3fb950]">{stats.fps.toFixed(1)}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[#8b949e] text-[9px]">1% Lows (Stutter)</span>
                  <span className="text-xl font-bold text-[#f85149]">{stats.fps1Low.toFixed(1)}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[#8b949e] text-[9px]">Avg Frame Time</span>
                  <span className="text-sm font-bold text-white">{stats.frameTime.toFixed(2)} ms</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[#8b949e] text-[9px]">Total Draw Calls</span>
                  <span className="text-sm font-bold text-[#e3b341]">{stats.drawCalls.toLocaleString()}</span>
               </div>
            </div>
         </div>

         {/* CPU Usage */}
         <div className="bg-[#0d1117] border border-[#30363d] rounded p-2">
            <div className="flex justify-between items-center mb-2">
               <span className="font-bold text-[#c9d1d9] flex items-center gap-1 truncate max-w-[60%]"><Cpu size={12} className="text-[#58a6ff] shrink-0"/> {cpuName}</span>
               <span className="text-[#8b949e]">Pkg: <span className={stats.cpuTemp > 80 ? "text-[#f85149]" : "text-[#e3b341]"}>{stats.cpuTemp.toFixed(1)}°C</span> | {stats.cpuPwr.toFixed(0)}W</span>
            </div>
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                  <span className="w-16 text-[#8b949e] truncate">App Logic</span>
                  <div className="flex-1 h-1.5 bg-[#21262d] rounded-full overflow-hidden"><div className="h-full bg-[#58a6ff] transition-all duration-300" style={{ width: `${Math.min(100, stats.cpuUsage * 1.5)}%` }}></div></div>
                  <span className="w-8 text-right">{(stats.frameTime * 0.4).toFixed(1)}ms</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-16 text-[#8b949e] truncate">Dispatching</span>
                  <div className="flex-1 h-1.5 bg-[#21262d] rounded-full overflow-hidden"><div className="h-full bg-[#e3b341] transition-all duration-300" style={{ width: `${Math.min(100, stats.cpuUsage * 0.8)}%` }}></div></div>
                  <span className="w-8 text-right">{(stats.frameTime * 0.25).toFixed(1)}ms</span>
               </div>
               
               <div className="grid grid-cols-16 gap-0.5 mt-2 pt-2 border-t border-[#30363d]">
                  {stats.cores.map((load, i) => (
                     <div key={i} className="h-4 bg-[#21262d] rounded-[1px] relative flex items-end">
                        <div className={`w-full rounded-[1px] transition-all duration-300 ${load > 85 ? 'bg-[#f85149]' : load > 50 ? 'bg-[#e3b341]' : 'bg-[#3fb950]'}`} style={{height: `${load}%`}}></div>
                     </div>
                  ))}
               </div>
               <div className="flex justify-between items-center text-[8px] text-[#8b949e] mt-1">
                   <span>Logical Threads</span>
                   <span>Global Load: {stats.cpuUsage.toFixed(1)}%</span>
               </div>
            </div>
         </div>

         {/* Heterogeneous Nodes */}
         {accelerators.map(acc => {
            const accStat = stats.accelStats[acc.id] || { usage: 0, temp: 0, pwr: 0, vram: 0 };
            
            let icon = <HardDrive size={12} className="text-[#e3b341] shrink-0"/>;
            if(acc.type === 'TPU') icon = <Monitor size={12} className="text-[#bc8cff] shrink-0"/>;
            if(acc.type === 'NPU') icon = <Zap size={12} className="text-[#3fb950] shrink-0"/>;

            return (
               <div key={acc.id} className="bg-[#0d1117] border border-[#30363d] rounded p-2">
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-[#c9d1d9] flex items-center gap-1 truncate max-w-[60%]">
                         {icon} {acc.name} 
                         {acc.isIGPU && <span className="text-[8px] bg-[#58a6ff]/20 text-[#58a6ff] px-1 rounded ml-1 border border-[#58a6ff]/50">iGPU</span>}
                     </span>
                     <span className="text-[#8b949e] shrink-0">
                        {accStat.temp.toFixed(1)}°C | {accStat.pwr.toFixed(0)}W
                     </span>
                  </div>
                  <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-16 text-[#8b949e]">Compute</span>
                        <div className="flex-1 h-2 bg-[#21262d] rounded-full overflow-hidden relative">
                           <div className={`h-full transition-all duration-300 ${acc.type === 'GPU' ? 'bg-[#e3b341]' : acc.type === 'TPU' ? 'bg-[#bc8cff]' : 'bg-[#3fb950]'}`} style={{ width: `${accStat.usage}%` }}></div>
                        </div>
                        <span className="w-8 text-right font-bold text-white">{accStat.usage.toFixed(0)}%</span>
                      </div>
                      
                      {acc.vramMax > 0 && (
                         <div className="flex items-center gap-2">
                            <span className="w-16 text-[#8b949e]">{acc.isIGPU ? 'Shared' : 'VRAM'}</span>
                            <div className="flex-1 h-1 bg-[#21262d] rounded-full overflow-hidden relative">
                               <div className={`h-full transition-all duration-300 bg-[#f85149]`} style={{ width: `${(accStat.vram / acc.vramMax) * 100}%` }}></div>
                            </div>
                            <span className="w-12 text-right text-[8px] text-[#8b949e] truncate">{accStat.vram.toFixed(1)}/{acc.vramMax}G</span>
                         </div>
                      )}
                  </div>
               </div>
            )
         })}

         {/* RAM */}
         <div className="bg-[#0d1117] border border-[#30363d] rounded p-2">
            <div className="flex justify-between items-center mb-1">
               <span className="font-bold text-[#c9d1d9] flex items-center gap-1"><MemoryStick size={12} className="text-[#58a6ff]"/> Main System Memory (UMA Base)</span>
            </div>
            <div className="text-[#8b949e] mb-1 truncate text-[9px]">{ramName}</div>
            <div className="text-[#8b949e] mb-1">Usage: <span className="text-white font-bold">{stats.ramUsage.toFixed(1)} GB</span> Allocated</div>
            <div className="w-full h-2 bg-[#21262d] rounded-full overflow-hidden flex">
               <div className="h-full bg-[#58a6ff] transition-all duration-500" style={{ width: `40%` }} title="OS & Core"></div>
               <div className="h-full bg-[#bc8cff] transition-all duration-500" style={{ width: `30%` }} title="Assets & Matrices"></div>
               <div className="h-full bg-[#e3b341] transition-all duration-500" style={{ width: `10%` }} title="iGPU Shared Pool"></div>
            </div>
         </div>

      </div>
    </div>
  );
}

