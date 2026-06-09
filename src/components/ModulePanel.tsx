import React, { useState, useEffect } from 'react';
import NPCEditor from './NPCEditor';
import AudioEditor from './AudioEditor';
import ModelingEditor from './ModelingEditor';
import ImageEditor from './ImageEditor';
import TerrainGenerator from './TerrainGenerator';
import UIUXEditor from './UIUXEditor';
import ScriptEditor from './ScriptEditor';
import { Database, Waypoints, Bot, FileText, Settings, Ghost, Map as MapIcon, Users, Settings2, Globe, Globe2, Mountain, HardDrive, Gamepad2, Orbit, Droplets, Flame, Wind, Zap, Blocks, Cpu, MonitorPlay, Activity, Cloud, ShieldCheck, BoxSelect, Layers, Code2, Network, AudioWaveform, Videotape, Fingerprint, CloudCog, ShieldAlert, ActivitySquare, CheckCircle, Bug, TrendingUp, DownloadCloud, UserSquare, Workflow, Image as ImageIcon, Music, Play, Pause, FastForward, Rewind, Mic, Sliders, Wand2, Plus, Sparkles, Clapperboard, PersonStanding, FolderTree, TerminalSquare, AlertTriangle, ShieldX, Copy, RefreshCw, Ruler, X, Eye, Lock, Sun, CloudRain, MousePointer2, Move3D, Rotate3D, Scale3D, PenTool, Minimize2, Pen, Scissors, ChevronRight, Video, ChevronDown, Bone, Wrench, Dot, Minus, Square, FileCode2, Volume2, Search, Variable, Palette, SlidersHorizontal, LayoutDashboard, Layout, Box, AlignLeft, AlignCenter, AlignRight, Link2, MoveHorizontal, MoveVertical, RotateCw, List, BookOpen, BrainCircuit, Glasses, Terminal, Server, ArrowUpSquare } from 'lucide-react';


const AITestingQAPanel = ({ renderHeader }: { renderHeader: any }) => {
  const [testActive, setTestActive] = useState(false);
  const [logs, setLogs] = useState<{msg: string, status: 'info'|'warn'|'error'|'success'}[]>([]);
  const [phase, setPhase] = useState('Standby');
  const [progress, setProgress] = useState(0);
  const [vulnerabilitiesFound, setVulnerabilitiesFound] = useState(0);
  const timeoutRefs = React.useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const runAudit = () => {
     timeoutRefs.current.forEach(clearTimeout);
     timeoutRefs.current = [];
     setTestActive(true);
     setLogs([]);
     setVulnerabilitiesFound(0);
     setProgress(0);
     
     const sequence = [
       { p: 5, ph: 'Compiling Unit Tests', l: { m: '[Core] Linking automated integration tests...', s: 'info' }, t: 200 },
       { p: 15, ph: 'Memory Profiling', l: { m: '[Audit] Profiling heap allocations in game tick loop...', s: 'info' }, t: 800 },
       { p: 20, ph: 'Memory Profiling', l: { m: '[WARN] High garbage collection overhead detected in chunk rendering', s: 'warn' }, t: 1500 },
       { p: 28, ph: 'Physics Profiling', l: { m: '[Audit] Executing raycast penetration tests (1000 iter/tick)...', s: 'info' }, t: 2200 },
       { p: 35, ph: 'Physics Profiling', l: { m: '[VULN] Object clipping through floor at high velocity (-9999 z/s)', s: 'error' }, t: 3000 },
       { p: 40, ph: 'Physics Profiling', l: { m: '[Log] Logging physics collision exception to tracker.', s: 'info' }, t: 3600 },
       { p: 45, ph: 'Network Fuzzing', l: { m: '[Audit] Injecting packet latency constraints (jitter: +300ms)...', s: 'info' }, t: 4100 },
       { p: 55, ph: 'Network Fuzzing', l: { m: '[VULN] Client has authority over Z-axis (Fly Hack possible)!', s: 'error' }, t: 4800 },
       { p: 68, ph: 'Network Fuzzing', l: { m: '[Log] Generated ticket: "Enforce Z-axis gravity checks server-side"', s: 'warn' }, t: 5500 },
       { p: 75, ph: 'Economy Rules', l: { m: '[Audit] Testing boundary ranges on inventory quantities...', s: 'warn' }, t: 6200 },
       { p: 80, ph: 'Economy Rules', l: { m: '[VULN] Transaction bypass allowed when sending exactly -2,147,483,648 gold.', s: 'error' }, t: 6900 },
       { p: 88, ph: 'Economy Rules', l: { m: '[Log] Updating Jenkins test runner with CVE parameters.', s: 'info' }, t: 7500 },
       { p: 95, ph: 'Verifying Integrity', l: { m: '[Check] Finalizing continuous integration (CI) workflow...', s: 'info' }, t: 8200 },
       { p: 100, ph: 'System Secure', l: { m: '[Complete] QA test execution completed. 3 Issues logged.', s: 'success' }, t: 8800 }
     ];

     sequence.forEach((step, i) => {
        const t = setTimeout(() => {
           setProgress(step.p);
           setPhase(step.ph);
           setLogs(prev => [...prev, step.l as any]);
           if(step.l.s === 'error') {
              setVulnerabilitiesFound(v => v + 1);
           }
           if (i === sequence.length - 1) {
              setTestActive(false);
           }
        }, step.t);
        timeoutRefs.current.push(t);
     });
  };

  return (
    <div className="flex flex-col h-full">
      {renderHeader('Apex Profiler & QA Matrix', 'Deep systemic checks, frame rendering profiling, memory leaks, and logic vulnerability scanner.', <ShieldCheck size={28} />)}
      
      <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
         {/* Threat Intelligence Bar */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] p-4 rounded flex flex-col items-center justify-center relative overflow-hidden group">
               <ShieldAlert size={24} className="text-[#f85149] mb-2" />
               <span className="text-[#c9d1d9] font-bold text-lg">{vulnerabilitiesFound}</span>
               <span className="text-[#8b949e] text-[10px] uppercase tracking-wider">Unresolved Vulnerabilities</span>
               <div className="absolute inset-0 bg-[#f85149]/5 translate-y-[80%] group-hover:translate-y-[70%] transition-transform"></div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] p-4 rounded flex flex-col items-center justify-center relative overflow-hidden group">
               <Cpu size={24} className="text-[#58a6ff] mb-2" />
               <span className="text-[#c9d1d9] font-bold text-lg">1.4B Cycles/s</span>
               <span className="text-[#8b949e] text-[10px] uppercase tracking-wider">Simulation Speed</span>
               <div className="absolute inset-0 bg-[#58a6ff]/5 translate-y-[80%] group-hover:translate-y-[70%] transition-transform"></div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] p-4 rounded flex flex-col items-center justify-center relative overflow-hidden group">
               <ShieldCheck size={24} className="text-[#3fb950] mb-2" />
               <span className="text-[#c9d1d9] font-bold text-lg text-center">CI/CD Pipeline</span>
               <span className="text-[#8b949e] text-[10px] uppercase tracking-wider">Status: Healthy</span>
               <div className="absolute inset-0 bg-[#3fb950]/5 translate-y-[80%] group-hover:translate-y-[70%] transition-transform"></div>
            </div>
         </div>

         {/* Hack Console */}
         <div className="bg-[#0a0a0a] border border-[#30363d] rounded-lg flex flex-col h-[300px] overflow-hidden relative">
            {testActive && <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#f85149] to-transparent animate-pulse"></div>}
            
            <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex justify-between items-center z-10 shrink-0">
               <div className="flex items-center gap-2">
                 <TerminalSquare size={14} className="text-[#8b949e]"/>
                 <span className="text-[#c9d1d9] text-[12px] font-bold tracking-wide uppercase">QA Debug Terminal</span>
               </div>
               <span className="text-[#f85149] text-[11px] font-mono animate-pulse">{phase}</span>
            </div>

            <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto flex flex-col gap-1.5 custom-scrollbar">
               {logs.length === 0 && !testActive && (
                 <div className="h-full flex flex-col items-center justify-center text-[#8b949e] gap-2 opacity-50">
                    <ShieldX size={32} />
                    <span>Awaiting Unit & Profiler Execution...</span>
                 </div>
               )}
               {logs.map((log, idx) => (
                 <div key={idx} className="flex items-start gap-2 break-all">
                    <span className="text-[#8b949e]">[{String(idx+1).padStart(4, '0')}]</span>
                    {log.status === 'info' && <span className="text-[#58a6ff]">{log.msg}</span>}
                    {log.status === 'warn' && <span className="text-[#e3b341]">{log.msg}</span>}
                    {log.status === 'error' && <span className="text-[#f85149] font-bold bg-[#f85149]/10 px-1">{log.msg}</span>}
                    {log.status === 'success' && <span className="text-[#3fb950] font-bold"><CheckCircle size={10} className="inline mr-1 mb-0.5"/>{log.msg}</span>}
                 </div>
               ))}
               {/* Spacer */}
               <div className="h-4"></div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-[#161b22] shrink-0">
               <div className="h-full bg-gradient-to-r from-[#58a6ff] via-[#bc8cff] to-[#f85149] transition-all duration-300" style={{width: `${progress}%`}}></div>
            </div>
         </div>

         {/* Trigger Action */}
         <div>
            <button 
              onClick={runAudit}
              disabled={testActive}
              className={`w-full py-3 rounded uppercase font-bold tracking-[2px] transition flex justify-center items-center gap-2 ${testActive ? 'bg-[#21262d] text-[#8b949e] cursor-not-allowed' : 'bg-[#f85149] hover:bg-[#ff7b72] text-white shadow-[0_0_20px_rgba(248,81,73,0.3)] hover:shadow-[0_0_30px_rgba(248,81,73,0.5)]'}`}
           >
              <AlertTriangle size={16} />
              {testActive ? 'Running Automated Specs...' : 'Run Automated Integration Tests'}
           </button>
         </div>
      </div>
    </div>
  );
};

export const PhysicsCollisionMatrix = () => {
  const [layers, setLayers] = useState<string[]>(['Default', 'Player', 'Enemy', 'Projectile', 'World', 'PhysicsBody', 'UI']);
  const [newLayer, setNewLayer] = useState('');
  
  // matrix[layerA][layerB] = boolean
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    Default: { Default: true, Player: true, Enemy: true, Projectile: true, World: true, PhysicsBody: true, UI: false },
    Player: { Default: true, Player: false, Enemy: true, Projectile: true, World: true, PhysicsBody: true, UI: false },
    Enemy: { Default: true, Player: true, Enemy: false, Projectile: true, World: true, PhysicsBody: true, UI: false },
    Projectile: { Default: true, Player: true, Enemy: true, Projectile: false, World: true, PhysicsBody: true, UI: false },
    World: { Default: true, Player: true, Enemy: true, Projectile: true, World: true, PhysicsBody: true, UI: false },
    PhysicsBody: { Default: true, Player: true, Enemy: true, Projectile: true, World: true, PhysicsBody: true, UI: false },
    UI: { Default: false, Player: false, Enemy: false, Projectile: false, World: false, PhysicsBody: false, UI: false },
  });

  const handleAddLayer = () => {
    if (!newLayer || layers.includes(newLayer)) return;
    setLayers([...layers, newLayer]);
    setMatrix(prev => {
      const newMatrix = { ...prev };
      // add row
      newMatrix[newLayer] = {};
      layers.forEach(l => {
        newMatrix[newLayer][l] = true; // default true
      });
      newMatrix[newLayer][newLayer] = false;
      // add col to existing rows
      layers.forEach(l => {
        if (!newMatrix[l]) newMatrix[l] = {};
        newMatrix[l][newLayer] = true;
      });
      return newMatrix;
    });
    setNewLayer('');
  };

  const handleToggle = (row: string, col: string) => {
    setMatrix(prev => {
      const next = { ...prev };
      if (!next[row]) next[row] = {};
      if (!next[col]) next[col] = {};
      const val = !next[row][col];
      next[row][col] = val;
      next[col][row] = val; // keep symmetric
      return next;
    });
  };

  const handleRemoveLayer = (layer: string) => {
    if (layers.length <= 1) return;
    setLayers(layers.filter(l => l !== layer));
    setMatrix(prev => {
      const next = { ...prev };
      delete next[layer];
      Object.keys(next).forEach(k => {
        delete next[k][layer];
      });
      return next;
    });
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col pt-1">
       <div className="p-3 border-b border-[#30363d] flex justify-between items-center">
          <span className="text-[12px] font-bold text-[#c9d1d9]">Layer Collision Matrix</span>
          <div className="flex items-center gap-2">
             <input type="text" placeholder="New Layer..." className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[10px] w-24 outline-none text-[#c9d1d9]" value={newLayer} onChange={e => setNewLayer(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddLayer()} />
             <button onClick={handleAddLayer} className="text-[#58a6ff] hover:text-white px-2 bg-[#21262d] rounded text-[10px] border border-[#30363d]">+</button>
          </div>
       </div>
       <div className="p-4 overflow-x-auto text-[10px] text-[#8b949e]">
          <table className="w-full text-center border-collapse">
             <thead>
                <tr>
                   <th className="p-1 border border-[#30363d]"></th>
                   {layers.map(col => (
                     <th key={col} className="p-1 border border-[#30363d] min-w-[30px]" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', paddingBottom: '8px' }}>
                       <div className="flex items-center justify-between gap-1">
                          {col !== 'Default' && <button onClick={() => handleRemoveLayer(col)} className="text-[#f85149] hover:text-red-400 opacity-50 hover:opacity-100" title="Remove Layer"><X size={8} /></button>}
                          <span>{col}</span>
                       </div>
                     </th>
                   ))}
                </tr>
             </thead>
             <tbody>
                {layers.map(row => (
                  <tr key={row}>
                     <td className="p-1 border border-[#30363d] font-bold text-right pr-2">
                        {row}
                     </td>
                     {layers.map(col => {
                       // Only show triangular or full matrix. Let's do full symmetric for ease.
                       const isChecked = matrix[row]?.[col] ?? false;
                       return (
                         <td key={col} className={`p-1 border border-[#30363d] ${isChecked ? 'bg-[#3fb950]/20' : 'bg-[#f85149]/20'}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => handleToggle(row, col)} className={isChecked ? 'accent-[#3fb950]' : 'accent-[#f85149]'} />
                         </td>
                       );
                     })}
                  </tr>
                ))}
             </tbody>
          </table>
          <p className="mt-2 text-[9px] italic">Checked layers map to physical collisions. Unchecked pass through.</p>
       </div>
    </div>
  );
};

interface ModulePanelProps {

  moduleType: string;
}

export default function ModulePanel({ moduleType }: ModulePanelProps) {
  const [showPhysicsGizmos, setShowPhysicsGizmos] = useState(true);

  const renderHeader = (title: string, desc: string, icon: React.ReactNode) => (
    <div className="border-b border-[#30363d] p-6 bg-[#0d1117] flex items-center gap-4 shrink-0">
      <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-lg text-[#58a6ff]">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-[#c9d1d9] tracking-wide uppercase">{title}</h2>
        <p className="text-[#8b949e] text-[13px] mt-1">{desc}</p>
      </div>
    </div>
  );

  const renderToolButton = (label: string) => (
    <button className="bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] hover:bg-[#21262d] text-[#c9d1d9] px-3 py-2 rounded text-[12px] flex items-center justify-between transition-colors">
      <span>{label}</span>
      <span className="text-[#3fb950] bg-[#3fb950]/10 px-1 rounded text-[10px]">AI</span>
    </button>
  );

  const getModuleContent = () => {
    switch (moduleType) {
      case 'Landscape':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex Terrain & Planet Editor', 'Advanced procedural heightmap sculpting, hydraulic erosion, volumetric clouds, and planetary geology.', <Mountain size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               {/* Sidebar Tools */}
               <div className="w-[350px] border-r border-[#30363d] bg-[#161b22] flex flex-col p-4 gap-6 overflow-y-auto custom-scrollbar shrink-0">
                 
                 {/* Heightmap Importer */}
                 <div className="flex flex-col gap-2">
                   <div className="text-[10px] uppercase font-bold text-[#e3b341] tracking-wider flex justify-between border-b border-[#30363d] pb-1">
                     <span className="flex items-center gap-2"><Globe2 size={12}/> Planetary Generation</span>
                   </div>
                   <div className="flex flex-col gap-2 text-[11px]">
                      <button className="bg-[#21262d] border border-[#30363d] text-[#c9d1d9] py-1.5 rounded hover:bg-[#30363d] text-center w-full flex justify-center items-center gap-2 font-bold"><MapIcon size={14} className="text-[#58a6ff]"/> Import RAW/PNG-16</button>
                      <button className="bg-[#21262d] border border-[#30363d] text-[#c9d1d9] py-1.5 rounded hover:bg-[#30363d] text-center w-full flex justify-center items-center gap-2 font-bold"><Workflow size={14} className="text-[#bc8cff]"/> Sub-Graph Noise Generator</button>
                   </div>
                 </div>

                 {/* Sculpting Tools */}
                 <div className="flex flex-col gap-3">
                   <div className="text-[10px] uppercase font-bold text-[#8b949e] tracking-wider border-b border-[#30363d] pb-1">Voxel & Heightmap Brushes</div>
                   <div className="grid grid-cols-3 gap-2">
                     <button className="bg-[#21262d] border border-[#58a6ff] text-[#58a6ff] rounded p-2 text-[10px] flex flex-col items-center gap-1 font-bold shadow-[0_0_10px_rgba(88,166,255,0.2)]"><Mountain size={16}/> Raise (Z)</button>
                     <button className="bg-[#0a0a0a] border border-[#30363d] hover:border-[#8b949e] text-[#8b949e] rounded p-2 text-[10px] flex flex-col items-center gap-1"><Droplets size={16}/> Lower</button>
                     <button className="bg-[#0a0a0a] border border-[#30363d] hover:border-[#8b949e] text-[#8b949e] rounded p-2 text-[10px] flex flex-col items-center gap-1"><Wind size={16}/> Smooth</button>
                     <button className="bg-[#0a0a0a] border border-[#30363d] hover:border-[#8b949e] text-[#8b949e] rounded p-2 text-[10px] flex flex-col items-center gap-1"><BoxSelect size={16}/> Flatten</button>
                     <button className="bg-[#0a0a0a] border border-[#30363d] hover:border-[#e3b341] text-[#e3b341] rounded p-2 text-[10px] flex flex-col items-center gap-1"><Flame size={16}/> Erode (Hyd)</button>
                     <button className="bg-[#0a0a0a] border border-[#30363d] hover:border-[#bc8cff] text-[#bc8cff] rounded p-2 text-[10px] flex flex-col items-center gap-1"><Zap size={16}/> Perturb</button>
                   </div>
                 </div>

                 {/* Climate & Weather */}
                 <div className="flex flex-col gap-3">
                   <div className="text-[10px] uppercase font-bold text-[#58a6ff] tracking-wider border-b border-[#30363d] pb-1 flex items-center gap-2"><Cloud size={12}/> Dynamic Climate Engine</div>
                   
                   <div className="flex flex-col gap-1.5">
                      <span className="text-[#8b949e] font-bold text-[10px]">Cloud Volumetrics (Raymarched)</span>
                      <select defaultValue="Cumulonimbus (Storm Coverage)" className="bg-[#0d1117] border border-[#30363d] rounded p-1.5 outline-none text-[11px] text-[#c9d1d9]">
                         <option>Cumulus (Low Altitude)</option>
                         <option>Cirrus (High Altitude)</option>
                         <option>Cumulonimbus (Storm Coverage)</option>
                         <option>Overcast Stratus</option>
                      </select>
                   </div>
                   
                   <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                         <span className="text-[#8b949e] font-bold">Hurricane/Storm Intensity</span>
                         <span className="text-[#58a6ff] font-mono">Category 3</span>
                      </div>
                      <input type="range" min="0" max="5" defaultValue="3" className="w-full accent-[#58a6ff]"/>
                   </div>

                   <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                         <span className="text-[#8b949e] font-bold">Global Wind Vector (Knots)</span>
                         <span className="text-[#3fb950] font-mono">45 kts</span>
                      </div>
                      <div className="flex gap-1">
                         <input type="number" defaultValue="45.0" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-full text-center text-[11px] text-[#ff7b72] outline-none" />
                         <input type="number" defaultValue="12.5" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-full text-center text-[11px] text-[#3fb950] outline-none" />
                         <input type="number" defaultValue="0.0" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-full text-center text-[11px] text-[#58a6ff] outline-none" />
                      </div>
                   </div>
                 </div>

                 {/* Planetary Time of Day */}
                 <div className="flex flex-col gap-3">
                   <div className="text-[10px] uppercase font-bold text-[#ff7b72] tracking-wider border-b border-[#30363d] pb-1 flex items-center gap-2"><Sun size={12}/> Orbital Time & Light</div>
                   
                   <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                         <span className="text-[#8b949e] font-bold">Time of Day (24h)</span>
                         <span className="text-[#e3b341] font-mono">18:45 (Golden Hour)</span>
                      </div>
                      <input type="range" min="0" max="24" step="0.1" defaultValue="18.75" className="w-full accent-[#e3b341]"/>
                   </div>
                   
                   <div className="flex flex-col gap-1.5">
                      <span className="text-[#8b949e] font-bold text-[10px]">Solar Rayleigh Scattering Multiplier</span>
                      <input type="number" step="0.01" defaultValue="0.035" className="bg-[#0d1117] border border-[#30363d] rounded p-1.5 outline-none text-[11px] text-[#c9d1d9] text-right font-mono" />
                   </div>
                 </div>

                 {/* Brush Settings */}
                 <div className="flex flex-col gap-3">
                   <div className="text-[10px] uppercase font-bold text-[#8b949e] tracking-wider border-b border-[#30363d] pb-1">Brush Settings</div>
                   <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-[11px] text-[#c9d1d9]"><span>Size</span> <span>1024</span></div>
                     <input type="range" className="w-full accent-[#58a6ff]" defaultValue="50" />
                   </div>
                   <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-[11px] text-[#c9d1d9]"><span>Falloff</span> <span>0.5</span></div>
                     <input type="range" className="w-full accent-[#58a6ff]" defaultValue="30" />
                   </div>
                   <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-[11px] text-[#c9d1d9]"><span>Strength</span> <span>0.2</span></div>
                     <input type="range" className="w-full accent-[#58a6ff]" defaultValue="20" />
                   </div>
                 </div>

                 {/* Paint Layers */}
                 <div className="flex flex-col gap-3">
                   <div className="text-[10px] uppercase font-bold text-[#8b949e] tracking-wider border-b border-[#30363d] pb-1 flex justify-between items-center">
                     <span>Paint Layers</span>
                     <button className="hover:text-white"><Plus size={12}/></button>
                   </div>
                   <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 bg-[#21262d] border border-[#30363d] rounded p-1.5 cursor-pointer">
                        <div className="w-6 h-6 rounded bg-[#3fb950] border border-black"></div>
                        <span className="text-[12px] text-[#c9d1d9] flex-1">Grass Base</span>
                     </div>
                     <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#30363d] hover:border-[#8b949e] rounded p-1.5 cursor-pointer">
                        <div className="w-6 h-6 rounded bg-[#8b5a2b] border border-black"></div>
                        <span className="text-[12px] text-[#8b949e] flex-1">Dirt Track</span>
                     </div>
                     <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#30363d] hover:border-[#8b949e] rounded p-1.5 cursor-pointer">
                        <div className="w-6 h-6 rounded bg-[#666] border border-black"></div>
                        <span className="text-[12px] text-[#8b949e] flex-1">Cliff Rock</span>
                     </div>
                   </div>
                   <button className="bg-[#1a1a1a] border border-[#333] text-[#888] text-[10px] py-1 rounded w-full hover:bg-[#222] hover:text-white transition-colors">Compute Slope-Based Masking</button>
                 </div>
               </div>

               {/* Main Viewport Area Placeholder for Terrain */}
               <div className="flex-1 relative flex items-center justify-center">
                  <TerrainGenerator />
               </div>
             </div>
           </div>
         );

      case 'Sequencer':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex Director & Cinematics', 'Non-linear video editing, keyframing, post-processing, and offline AI cinematography tools.', <Clapperboard size={28} />)}
             
             {/* Main Area: Split into Top (Preview & Tools) and Bottom (Timeline) */}
             <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Half: 3 columns -> Offline AI, Viewport, Attributes */}
                <div className="h-[50%] flex border-b border-[#30363d] shrink-0">
                   {/* Left: Offline AI Cinematography Suite */}
                   <div className="w-[300px] border-r border-[#30363d] bg-[#161b22] flex flex-col overflow-y-auto custom-scrollbar">
                      <div className="p-2 border-b border-[#30363d] bg-[#0d1117] flex justify-between items-center text-[11px] font-bold text-[#c9d1d9] sticky top-0 z-10">
                        <span className="flex items-center gap-1.5"><Cpu size={14} className="text-[#f85149]"/> OFFLINE AI STUDIO</span>
                        <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" title="Tensor Compute Online"></div>
                      </div>
                      <div className="p-2 flex flex-col gap-3">
                         {/* Offline MoCap */}
                         <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#c9d1d9]">
                               <span className="flex items-center gap-1"><PersonStanding size={12}/> Monocular MoCap</span>
                            </div>
                            <div className="text-[9px] text-[#8b949e]">Generate 3D skeletal animation from 2D video locally. No internet required.</div>
                            <button className="bg-[#30363d] text-white border border-[#8b949e]/50 font-semibold text-[10px] py-1 rounded hover:bg-[#404852] text-left px-2 flex justify-between items-center">
                              Select source video... <span>(MP4/MKV)</span>
                            </button>
                            <div className="flex items-center gap-2 text-[9px] text-[#8b949e]">
                               <input type="checkbox" defaultChecked className="accent-[#58a6ff]" /> Smooth Jitter (Butterworth Filter)
                            </div>
                            <button className="bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50 font-bold text-[10px] py-1.5 rounded hover:bg-[#3fb950]/30 transition-colors shadow-inner">
                               Estimate Rig Poses (Retarget)
                            </button>
                         </div>

                         {/* Offline Lip Sync */}
                         <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#c9d1d9]">
                               <span className="flex items-center gap-1"><AudioWaveform size={12}/> AI Audio-to-Face</span>
                            </div>
                            <div className="text-[9px] text-[#8b949e]">Extract phonemes from dialogue and auto-key blendshapes.</div>
                            <select className="bg-[#0a0a0a] border border-[#30363d] text-[10px] text-[#c9d1d9] p-1 rounded outline-none w-full">
                               <option>Target: Hero_Head_Mesh</option>
                               <option>Target: Villain_Rigid</option>
                            </select>
                            <select className="bg-[#0a0a0a] border border-[#30363d] text-[10px] text-[#8b949e] p-1 rounded outline-none w-full">
                               <option>Model: Wav2Lip-Standard (Fast)</option>
                               <option>Model: Wav2Lip-GAN (High Fidelity)</option>
                            </select>
                            <button className="bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/50 font-bold text-[10px] py-1.5 rounded hover:bg-[#e3b341]/30 transition-colors shadow-inner">
                               Generate Viseme Keys
                            </button>
                         </div>

                         {/* Frame Interpolation */}
                         <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#c9d1d9]">
                               <span className="flex items-center gap-1"><Videotape size={12}/> RIFE Interpolation</span>
                            </div>
                            <div className="text-[9px] text-[#8b949e]">Smooth low-FPS animations via optical flow neural network.</div>
                            <div className="flex items-center gap-2">
                               <button className="flex-1 bg-[#30363d] hover:bg-[#404852] text-white text-[10px] py-1 rounded">24 fps &rarr; 60 fps</button>
                               <button className="flex-1 bg-[#30363d] hover:bg-[#404852] text-white text-[10px] py-1 rounded">30 fps &rarr; 120 fps</button>
                            </div>
                         </div>
                         
                         {/* Roto Brush Auto-Masking */}
                         <div className="bg-[#58a6ff]/10 border border-[#58a6ff]/30 p-2 rounded flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#58a6ff]">
                               <span className="flex items-center gap-1"><Scissors size={12}/> AI Roto Segmentation</span>
                            </div>
                            <div className="text-[9px] text-[#c9d1d9]">Local SAM (Segment Anything Model) for pixel-perfect matte extraction.</div>
                            <button className="bg-[#58a6ff] text-[#000] font-bold text-[10px] py-1.5 rounded hover:bg-[#79b8ff] transition-colors shadow-inner">
                               Generate Alpha Matte
                            </button>
                         </div>

                         {/* NeRF Environment Extractor */}
                         <div className="bg-[#ff7b72]/10 border border-[#ff7b72]/30 p-2 rounded flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#ff7b72]">
                               <span className="flex items-center gap-1"><Mountain size={12}/> NeRF Scene Builder</span>
                            </div>
                            <div className="text-[9px] text-[#c9d1d9]">Convert drone footage to volumetric 3D bounds offline.</div>
                            <div className="text-[9px] text-[#8b949e]">Requires CUDA acceleration.</div>
                            <button className="bg-[#ff7b72] text-[#000] font-bold text-[10px] py-1.5 rounded hover:bg-[#f85149] transition-colors shadow-inner">
                               Process View Synthesis
                            </button>
                         </div>

                         {/* AI Director Framing */}
                         <div className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 p-2 rounded flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#bc8cff]">
                               <span className="flex items-center gap-1"><Ghost size={12}/> AI Director Auto-Framing</span>
                            </div>
                            <div className="text-[9px] text-[#c9d1d9]">Automatically generates camera keyframes to track targets adhering to cinematic rules.</div>
                            <select className="bg-[#0a0a0a] border border-[#30363d] text-[10px] text-[#8b949e] p-1 rounded outline-none w-full">
                               <option>Rule of Thirds</option>
                               <option>Center Focus</option>
                               <option>Dynamic Over-the-Shoulder</option>
                            </select>
                            <button className="bg-[#bc8cff] text-[#000] font-bold text-[10px] py-1.5 rounded hover:bg-[#d0a7ff] transition-colors shadow-inner">
                               Generate Camera Path
                            </button>
                         </div>
                      </div>
                   </div>

                   {/* Center: Viewport Preview */}
                   <div className="flex-1 bg-[#050505] relative flex flex-col items-center justify-center border-r border-[#30363d] overflow-hidden">
                      {/* Top Overlay UI for Viewport */}
                      <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#000] to-transparent z-10 flex justify-between p-2 pointer-events-none">
                         <div className="flex gap-2 pointer-events-auto">
                            <select className="bg-[#161b22]/80 border border-[#30363d] text-[#c9d1d9] text-[10px] px-2 py-0.5 rounded outline-none backdrop-blur-md">
                              <option>Perspective (Master_Rig)</option>
                              <option>Top</option>
                              <option>Front</option>
                            </select>
                            <button className="bg-[#161b22]/80 border border-[#30363d] text-[#c9d1d9] text-[10px] px-2 py-0.5 rounded hover:text-white backdrop-blur-md">Cinematic Overlay</button>
                         </div>
                         <div className="text-[10px] font-mono text-[#f85149] pointer-events-auto bg-[#000]/50 px-2 py-0.5 rounded border border-[#f85149]/50 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-[#f85149] animate-pulse"></div> REC (Proxy)
                         </div>
                      </div>

                      {/* Viewport Content */}
                      <div className="w-[80%] aspect-video bg-[#111] relative border border-[#333] shadow-2xl flex items-center justify-center group overflow-hidden">
                         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,#fff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                         
                         {/* Cinematic Letterbox Mask */}
                         <div className="absolute top-0 inset-x-0 h-[10%] bg-black pointer-events-none z-20"></div>
                         <div className="absolute bottom-0 inset-x-0 h-[10%] bg-black pointer-events-none z-20"></div>
                         
                         {/* Rule of Thirds Grid overlay mock */}
                         <div className="absolute inset-0 border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <div className="absolute top-1/3 inset-x-0 h-[1px] bg-white/20"></div>
                            <div className="absolute top-2/3 inset-x-0 h-[1px] bg-white/20"></div>
                            <div className="absolute left-1/3 inset-y-0 w-[1px] bg-white/20"></div>
                            <div className="absolute left-2/3 inset-y-0 w-[1px] bg-white/20"></div>
                         </div>
                         
                         {/* Safe Area Box */}
                         <div className="absolute inset-[5%] border border-[#e3b341]/30 border-dashed pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         
                         {/* Mock Render Graphic */}
                         <Videotape size={64} className="text-[#30363d]" />
                         
                         {/* Bottom Overlay UI inside Viewport */}
                         <div className="absolute bottom-2 left-2 flex gap-4 text-[9px] font-mono text-[#8b949e] z-30">
                            <span>FOCAL: 50mm</span>
                            <span>F-STOP: f/1.8</span>
                            <span>FOCUS DIST: 2.5m</span>
                            <span>ISO: 800</span>
                         </div>
                      </div>
                   </div>

                   {/* Right: Keyframe Attributes & Pro Properties */}
                   <div className="w-[300px] bg-[#161b22] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                      <div className="p-2 border-b border-[#30363d] bg-[#0d1117] flex justify-between items-center text-[11px] font-bold text-[#c9d1d9] sticky top-0 z-10">
                        <span className="flex items-center gap-1.5"><Settings2 size={14}/> ATTRIBUTES & KEYFRAMING</span>
                      </div>
                      <div className="p-3 flex flex-col gap-4">
                         
                         {/* Graph Editor Mini */}
                         <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-[10px] text-[#8b949e] uppercase font-bold tracking-wider mb-1">
                               Curve Editor
                               <button className="bg-[#21262d] px-1.5 py-0.5 rounded text-white border border-[#30363d]">Dope Sheet</button>
                            </div>
                            <div className="h-[80px] bg-[#050505] border border-[#30363d] rounded p-1 relative overflow-hidden">
                               {/* Mock curve */}
                               <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                  <path d="M 0 35 C 30 35, 40 5, 100 5" stroke="#f85149" strokeWidth="2" fill="none" />
                                  <path d="M 0 30 C 50 30, 60 15, 100 15" stroke="#3fb950" strokeWidth="2" fill="none" />
                                  <path d="M 0 20 C 20 20, 80 25, 100 25" stroke="#58a6ff" strokeWidth="2" fill="none" />
                                  {/* Tangent handles */}
                                  <circle cx="40" cy="5" r="1.5" fill="#fff" />
                                  <line x1="20" y1="5" x2="60" y2="5" stroke="#888" strokeWidth="0.5" />
                               </svg>
                            </div>
                            <div className="flex gap-1 mt-1">
                               <button className="flex-1 bg-[#21262d] py-1 rounded text-[10px] text-[#c9d1d9] hover:bg-[#30363d] border border-[#30363d]" title="Linear">📏 Lin</button>
                               <button className="flex-1 bg-[#21262d] py-1 rounded text-[10px] text-[#c9d1d9] hover:bg-[#30363d] border border-[#30363d]" title="Bezier">➰ Bez</button>
                               <button className="flex-1 bg-[#21262d] py-1 rounded text-[10px] text-[#c9d1d9] hover:bg-[#30363d] border border-[#30363d]" title="Constant/Stepped">🪜 Step</button>
                            </div>
                         </div>

                         <div className="h-[1px] bg-[#30363d]"></div>

                         {/* Selection Properties */}
                         <div className="flex flex-col gap-2">
                            <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">Transform (Absolute)</div>
                            <div className="flex items-center text-[10px] gap-2">
                               <span className="w-2.5 text-[#f85149] font-bold">X</span>
                               <input className="flex-1 bg-[#0a0a0a] border border-[#30363d] px-2 py-0.5 rounded text-[#c9d1d9]" defaultValue="120.45" />
                               <span className="w-2.5 text-[#3fb950] font-bold">Y</span>
                               <input className="flex-1 bg-[#0a0a0a] border border-[#30363d] px-2 py-0.5 rounded text-[#c9d1d9]" defaultValue="0.00" />
                               <span className="w-2.5 text-[#58a6ff] font-bold">Z</span>
                               <input className="flex-1 bg-[#0a0a0a] border border-[#30363d] px-2 py-0.5 rounded text-[#c9d1d9]" defaultValue="-45.22" />
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                               <button className="px-2 py-1 bg-[#e3b341]/20 text-[#e3b341] text-[10px] rounded border border-[#e3b341]/30 font-bold hover:bg-[#e3b341]/30 shrink-0 shadow-[0_0_5px_rgba(227,179,65,0.2)]">Key Position</button>
                               <button className="px-2 py-1 bg-[#21262d] text-[#c9d1d9] text-[10px] rounded border border-[#30363d] hover:bg-[#30363d] font-bold flex-1">Auto-Key: ON</button>
                            </div>
                         </div>

                         <div className="h-[1px] bg-[#30363d]"></div>
                         
                         {/* Camera Lens Properties */}
                         <div className="flex flex-col gap-2">
                            <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">Physical Camera Options</div>
                            <div className="flex justify-between items-center text-[10px]">
                               <span className="text-[#c9d1d9]">Focal Length</span>
                               <div className="flex items-center gap-1">
                                  <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-2 py-0.5 rounded text-[#c9d1d9] text-right" defaultValue="50.0" />
                                  <span className="text-[#8b949e]">mm</span>
                                  <div className="w-2 h-2 rotate-45 bg-[#e3b341] ml-1 cursor-pointer"></div>
                               </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                               <span className="text-[#c9d1d9]">Aperture (F-Stop)</span>
                               <div className="flex items-center gap-1">
                                  <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-2 py-0.5 rounded text-[#c9d1d9] text-right" defaultValue="1.8" />
                                  <span className="text-transparent">mm</span>
                                  <div className="w-2 h-2 rotate-45 border border-[#888] ml-1 cursor-pointer"></div>
                               </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                               <span className="text-[#c9d1d9]">Focus Distance</span>
                               <div className="flex items-center gap-1">
                                  <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-2 py-0.5 rounded text-[#c9d1d9] text-right" defaultValue="250" />
                                  <span className="text-[#8b949e]">cm</span>
                                  <div className="w-2 h-2 rotate-45 border border-[#888] ml-1 cursor-pointer"></div>
                               </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                               <span className="text-[#c9d1d9]">Motion Blur Amount</span>
                               <div className="flex items-center gap-1">
                                  <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-2 py-0.5 rounded text-[#c9d1d9] text-right" defaultValue="0.5" />
                                  <span className="text-transparent">cm</span>
                                  <div className="w-2 h-2 rotate-45 border border-[#888] ml-1 cursor-pointer"></div>
                               </div>
                            </div>
                            <button className="mt-1 bg-[#21262d] border border-[#30363d] text-[#c9d1d9] font-bold text-[10px] py-1 rounded hover:bg-[#30363d]">Pick Focus Target <MousePointer2 size={10} className="inline"/></button>
                         </div>

                         <div className="h-[1px] bg-[#30363d]"></div>

                         {/* Advanced Color Grading */}
                         <div className="flex flex-col gap-2 pb-2">
                            <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider flex justify-between">
                               Color Grading / Post
                               <button className="text-[#58a6ff] hover:text-white"><Plus size={12}/></button>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                               <div className="flex justify-between items-center text-[10px]">
                                  <span className="text-[#c9d1d9]">LUT Array</span>
                                  <select className="bg-[#0a0a0a] border border-[#30363d] text-[9px] text-[#c9d1d9] p-0.5 rounded outline-none">
                                     <option>Film_Kodak_2383_D65</option>
                                     <option>Bleach_Bypass_Matrix</option>
                                     <option>Custom_Log_C...</option>
                                  </select>
                               </div>
                            </div>

                            {/* Color Wheels Mock */}
                            <div className="flex justify-between mt-2 gap-1">
                               <div className="flex flex-col items-center gap-1 group cursor-pointer">
                                  <div className="w-10 h-10 rounded-full border border-[#30363d] relative overflow-hidden bg-gradient-to-br from-[#111] to-[#222]">
                                     {/* Color wheel mock gradient */}
                                     <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,red,yellow,lime,aqua,blue,magenta,red)] opacity-20"></div>
                                     <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-[200%] translate-y-[100%] shadow-[0_0_2px_#000]"></div>
                                  </div>
                                  <span className="text-[8px] text-[#8b949e] uppercase tracking-widest group-hover:text-white">Shadows</span>
                               </div>
                               <div className="flex flex-col items-center gap-1 group cursor-pointer">
                                  <div className="w-10 h-10 rounded-full border border-[#30363d] relative overflow-hidden bg-gradient-to-br from-[#111] to-[#222]">
                                     <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,red,yellow,lime,aqua,blue,magenta,red)] opacity-20"></div>
                                     <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full translate-x-[50%] -translate-y-[150%] shadow-[0_0_2px_#000]"></div>
                                  </div>
                                  <span className="text-[8px] text-[#8b949e] uppercase tracking-widest group-hover:text-white">Midtones</span>
                               </div>
                               <div className="flex flex-col items-center gap-1 group cursor-pointer">
                                  <div className="w-10 h-10 rounded-full border border-[#30363d] relative overflow-hidden bg-gradient-to-br from-[#111] to-[#222]">
                                     <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,red,yellow,lime,aqua,blue,magenta,red)] opacity-20"></div>
                                     <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-[50%] -translate-y-[50%] shadow-[0_0_2px_#000]"></div>
                                  </div>
                                  <span className="text-[8px] text-[#8b949e] uppercase tracking-widest group-hover:text-white">Highlights</span>
                               </div>
                            </div>
                            
                            <div className="mt-2 flex items-center justify-between text-[10px]">
                               <span className="text-[#c9d1d9] flex-1">Exposure</span>
                               <input type="range" className="flex-1 accent-[#58a6ff] mx-2" defaultValue="50" />
                               <span className="text-[#8b949e] w-6 text-right">+0.2</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                               <span className="text-[#c9d1d9] flex-1">Contrast</span>
                               <input type="range" className="flex-1 accent-[#58a6ff] mx-2" defaultValue="60" />
                               <span className="text-[#8b949e] w-6 text-right">1.1</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                               <span className="text-[#c9d1d9] flex-1">Saturation</span>
                               <input type="range" className="flex-1 accent-[#58a6ff] mx-2" defaultValue="45" />
                               <span className="text-[#8b949e] w-6 text-right">0.9</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Bottom: Timeline Header & Track Editor */}
                <div className="flex-1 flex flex-col bg-[#0d1117] relative min-h-0">
                   {/* Timeline Toolbar Settings */}
                   <div className="h-10 flex items-center gap-4 px-2 bg-[#161b22] border-b border-[#30363d] shrink-0 border-t-2 border-t-black">
                      <div className="flex items-center gap-1 bg-[#0a0a0a] rounded p-1 border border-[#30363d] shadow-inner">
                         <button className="p-1 text-[#8b949e] hover:text-white" title="Go to Start"><Rewind size={16} /></button>
                         <button className="p-1 px-3 text-[#3fb950] hover:text-[#2ea043] bg-[#3fb950]/10 rounded border border-[#3fb950]/30 shadow-[0_0_10px_rgba(63,185,80,0.2)]"><Play size={20} className="fill-current" /></button>
                         <button className="p-1 text-[#8b949e] hover:text-white" title="Pause"><Pause size={16} /></button>
                         <button className="p-1 text-[#8b949e] hover:text-white" title="Go to End"><FastForward size={16} /></button>
                         <div className="w-[1px] h-4 bg-[#30363d] mx-1"></div>
                         <button className="p-1 text-[#f85149] hover:text-[#ff7b72] bg-[#f85149]/10 rounded border border-transparent hover:border-[#f85149]/50" title="Render Export..."><DownloadCloud size={16}/></button>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[14px] font-mono font-bold text-[#58a6ff] bg-[#000] px-3 py-1 rounded border border-[#333] shadow-inner tracking-widest">
                        00:04:12:08
                      </div>
                      <div className="text-[10px] text-[#8b949e] flex flex-col leading-none justify-center gap-0.5">
                         <span>/ 01:30:00:00</span>
                         <span>FPS: 60.0DF</span>
                      </div>

                      <div className="flex-1"></div>

                      <div className="flex gap-2">
                         <div className="flex items-center text-[10px] text-[#8b949e] bg-[#0a0a0a] border border-[#30363d] rounded p-0.5">
                            <button className="px-2 py-0.5 hover:bg-[#21262d] rounded"><Rotate3D size={12}/></button>
                            <button className="px-2 py-0.5 hover:bg-[#21262d] rounded"><Move3D size={12}/></button>
                            <button className="px-2 py-0.5 hover:bg-[#21262d] rounded bg-[#21262d] text-white shadow-inner"><Scale3D size={12}/></button>
                         </div>
                         
                         <div className="flex items-center text-[10px] text-[#8b949e] bg-[#0a0a0a] border border-[#30363d] rounded p-0.5">
                            <button className="px-2 py-0.5 hover:bg-[#21262d] rounded flex gap-1 items-center bg-[#21262d] text-white" title="Enable Snapping"><Network size={12}/> Snap</button>
                            <div className="w-[1px] h-3 bg-[#30363d]"></div>
                            <button className="px-1 py-0.5 hover:bg-[#21262d] rounded flex items-center"><ChevronDown size={12}/></button>
                         </div>

                         <button className="flex items-center gap-1 bg-[#1a1a1a] border border-[#333] hover:border-[#888] text-[#ccc] px-3 py-1.5 rounded text-[11px] font-bold transition-colors">
                           <Plus size={14} /> Add Track
                         </button>
                      </div>
                   </div>

                   {/* Tracks vs Keyframes Layout */}
                   <div className="flex-1 flex overflow-hidden">
                      {/* Left Block: Track Definitions */}
                      <div className="w-[300px] border-r border-[#30363d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar bg-[#0d1117] relative z-20">
                         {/* Header matching ruler height */}
                         <div className="h-6 sticky top-0 bg-[#0d1117] border-b border-[#30363d] flex items-center px-2 text-[9px] font-bold text-[#8b949e] z-30 uppercase tracking-widest shadow-sm">
                            <span className="flex-1">Track Name</span>
                            <span className="w-12 text-center">Solo/Mute</span>
                         </div>
                         
                         {/* Video Track */}
                         <div className="flex flex-col border-b border-[#222]">
                           <div className="flex items-center justify-between pl-1 pr-2 py-1.5 bg-[#161b22] hover:bg-[#21262d] cursor-pointer group border-l-4 border-t-transparent border-b-transparent border-[#e3b341]">
                              <div className="flex items-center gap-1.5">
                                <ChevronDown size={14} className="text-[#888]"/>
                                <Videotape size={14} className="text-[#e3b341]"/>
                                <span className="text-[11px] font-bold text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]">V1: Cinematic Output</span>
                              </div>
                              <div className="flex gap-1 text-[#8b949e]">
                                 <div className="w-4 h-4 rounded flex items-center justify-center hover:bg-[#30363d] hover:text-white bg-[#0a0a0a] border border-[#30363d]">S</div>
                                 <div className="w-4 h-4 rounded flex items-center justify-center hover:bg-[#30363d] hover:text-white bg-[#0a0a0a] border border-[#30363d]">M</div>
                              </div>
                           </div>
                           <div className="pl-6 pr-2 py-1 bg-[#050505] hover:bg-[#111] flex justify-between items-center text-[#8b949e] text-[10px]">
                              <span>Opacity/Fade</span>
                              <div className="w-2 h-2 rotate-45 border border-[#888] cursor-pointer hover:bg-white bg-[#58a6ff] border-[#58a6ff]"></div>
                           </div>
                           <div className="pl-6 pr-2 py-1 bg-[#050505] hover:bg-[#111] flex justify-between items-center text-[#8b949e] text-[10px]">
                              <span>Time Remap</span>
                              <div className="w-2 h-2 rotate-45 border border-[#888] cursor-pointer hover:bg-white"></div>
                           </div>
                         </div>

                         {/* Camera Track */}
                         <div className="flex flex-col border-b border-[#222]">
                           <div className="flex items-center justify-between pl-1 pr-2 py-1.5 bg-[#161b22] hover:bg-[#21262d] cursor-pointer group border-l-4 border-t-transparent border-b-transparent border-[#58a6ff]">
                              <div className="flex items-center gap-1.5">
                                <ChevronRight size={14} className="text-[#888]"/>
                                <MonitorPlay size={14} className="text-[#58a6ff]"/>
                                <span className="text-[11px] font-bold text-[#c9d1d9]">Master_Camera_Rig</span>
                              </div>
                           </div>
                         </div>

                         {/* Skeleton Track */}
                         <div className="flex flex-col border-b border-[#222]">
                           <div className="flex items-center justify-between pl-1 pr-2 py-1.5 bg-[#161b22] hover:bg-[#21262d] cursor-pointer group border-l-4 border-t-transparent border-b-transparent border-[#bc8cff]">
                              <div className="flex items-center gap-1.5">
                                <ChevronDown size={14} className="text-[#888]"/>
                                <Bone size={14} className="text-[#bc8cff]"/>
                                <span className="text-[11px] font-bold text-[#c9d1d9]">Hero_Character_Armature</span>
                              </div>
                           </div>
                           <div className="pl-6 pr-2 py-1 bg-[#050505] hover:bg-[#111] flex justify-between items-center text-[#8b949e] text-[10px]">
                              <span className="flex items-center gap-1"><FolderTree size={10}/> Neck_Jnt</span>
                              <div className="w-2 h-2 rotate-45 border border-[#888] cursor-pointer hover:bg-white bg-[#bc8cff] border-[#bc8cff]"></div>
                           </div>
                           <div className="pl-8 pr-2 py-1 bg-[#050505] hover:bg-[#111] flex justify-between items-center text-[#8b949e] text-[10px]">
                              <span>Rotation Y</span>
                              <div className="w-2 h-2 rotate-45 border border-[#888] cursor-pointer hover:bg-white bg-[#bc8cff] border-[#bc8cff] shadow-[0_0_5px_#bc8cff]"></div>
                           </div>
                         </div>

                         {/* Audio Track */}
                         <div className="flex flex-col border-b border-[#222]">
                           <div className="flex items-center justify-between pl-1 pr-2 py-1.5 bg-[#0a0a0a] hover:bg-[#111] cursor-pointer group border-l-4 border-t-transparent border-b-transparent border-[#3fb950]">
                              <div className="flex items-center gap-1.5">
                                <ChevronDown size={14} className="text-[#888]"/>
                                <AudioWaveform size={14} className="text-[#3fb950]"/>
                                <span className="text-[11px] font-bold text-[#c9d1d9]">A1: Dialogue_Audio</span>
                              </div>
                              <div className="flex gap-1 text-[#8b949e]">
                                 <div className="w-4 h-4 rounded flex items-center justify-center hover:bg-[#30363d] hover:text-white bg-[#050505] border border-[#30363d]">S</div>
                                 <div className="w-4 h-4 rounded flex items-center justify-center hover:bg-[#30363d] hover:text-white bg-[#050505] border border-[#30363d]">M</div>
                              </div>
                           </div>
                         </div>
                      </div>

                      {/* Right Block: Ruler & Keyframe Area */}
                      <div className="flex-1 bg-[#0a0a0a] relative overflow-hidden flex flex-col">
                         {/* Timeline Ruler */}
                         <div className="h-6 border-b border-[#30363d] bg-[#111] shrink-0 sticky top-0 z-20 flex text-[#8b949e] text-[9px] relative font-mono overflow-hidden cursor-text">
                            {Array.from({length: 30}).map((_, i) => (
                              <div key={i} className="absolute h-full border-l border-[#333] pl-1 top-0 flex flex-col justify-end pb-1" style={{ left: `${i * 10}%` }}>
                                <span>{`00:00:0${i}:00`}</span>
                              </div>
                            ))}
                            {/* Inner tick marks mock */}
                            {Array.from({length: 300}).map((_, i) => i % 10 !== 0 ? (
                              <div key={`tick-${i}`} className="absolute bottom-0 h-1 border-l border-[#222]" style={{ left: `${i}%` }}></div>
                            ) : null)}
                            
                            {/* In/Out Markers */}
                            <div className="absolute top-0 bottom-0 bg-white/10 pointer-events-none" style={{ left: '20%', width: '40%' }}>
                               <div className="absolute top-0 left-0 w-2 h-full bg-[#f85149] rounded-br-[40%] rounded-tr-[40%]"></div>
                               <div className="absolute top-0 right-0 w-2 h-full bg-[#f85149] rounded-bl-[40%] rounded-tl-[40%]"></div>
                            </div>
                            
                            {/* Playhead */}
                            <div className="absolute top-0 bottom-0 w-[1px] bg-[#f85149] z-30 pointer-events-none" style={{ left: '35%' }}>
                               <div className="w-0 h-0 border-l-4 border-r-4 border-t-[6px] border-l-transparent border-r-transparent border-t-[#f85149] -mt-[1px] -translate-x-[3px] shadow-[0_0_8px_#f85149]"></div>
                            </div>
                         </div>
                         
                         {/* Grid & Nodes */}
                         <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar pb-10">
                            {/* Active Region bg */}
                            <div className="absolute top-0 bottom-0 bg-white/5 pointer-events-none border-x border-[#f85149]/20" style={{ left: '20%', width: '40%' }}></div>
                            
                            {/* Playhead Line down */}
                            <div className="absolute top-0 bottom-0 w-[1px] bg-[#f85149] z-40 pointer-events-none shadow-[0_0_8px_#f85149]" style={{ left: '35%' }}></div>

                            <div className="hover:bg-white/5 transition-colors absolute inset-x-0 group">
                               {/* Video Row Layout */}
                               <div className="h-[28px] border-b border-[#222]">
                                  {/* Clip block */}
                                  <div className="absolute top-0.5 bottom-0.5 bg-[#e3b341] border border-[#d29922] rounded shadow-[0_0_8px_inset_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer" style={{ left: '10%', width: '35%' }}>
                                     {/* Thumbnail mock inside clip */}
                                     {Array.from({length: 10}).map((_, i) => (
                                       <div key={i} className="absolute inset-y-0 w-10 border-r border-[#000]/20 bg-[#fff]/10" style={{ left: `${i * 10}%` }}></div>
                                     ))}
                                     <div className="absolute inset-0 flex items-center px-1 text-[9px] font-bold text-black drop-shadow w-full truncate">Action_Sequence_CamA.mov</div>
                                  </div>
                               </div>
                               <div className="h-[24px] border-b border-[#222] relative group-hover:bg-[#1a1a1a]/50">
                                 <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#58a6ff] rounded-sm cursor-pointer hover:bg-white" style={{ left: '15%' }}></div>
                                 <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#58a6ff] rounded-sm cursor-pointer hover:bg-white" style={{ left: '42%' }}></div>
                                 <svg className="absolute w-full h-full top-0 left-0 pointer-events-none"><path d="M 15% 50% Q 25% 30% 42% 50%" stroke="#58a6ff" strokeWidth="1" fill="none"/></svg>
                               </div>
                               <div className="h-[24px] border-b border-[#30363d] relative"></div>

                               {/* Camera row layout */}
                               <div className="h-[28px] border-b border-[#30363d]"></div>

                               {/* Skeleton row layout */}
                               <div className="h-[28px] border-b border-[#222]"></div>
                               <div className="h-[24px] border-b border-[#222]">
                                  <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#bc8cff] rounded-sm cursor-pointer hover:bg-white" style={{ left: '20%' }}></div>
                               </div>
                               <div className="h-[24px] border-b border-[#30363d] relative">
                                  <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#bc8cff] rounded-sm cursor-pointer hover:bg-white shadow-[0_0_5px_#bc8cff]" style={{ left: '35%' }}></div>
                               </div>

                               {/* Audio row layout */}
                               <div className="h-[28px] border-b border-[#30363d] relative flex items-center px-0.5">
                                  <div className="absolute top-0.5 bottom-0.5 bg-[#3fb950]/20 border border-[#2ea043] rounded cursor-pointer overflow-hidden" style={{ left: '0%', width: '100%' }}>
                                     <div className="absolute inset-0 w-full h-full text-[#3fb950] opacity-50 flex items-center overflow-hidden">
                                        {/* Waveform Mock via repeating SVG or dashes */}
                                        <svg className="w-full h-full" preserveAspectRatio="none">
                                           {Array.from({length: 100}).map((_, i) => (
                                              <line key={i} x1={`${i}%`} x2={`${i}%`} y1={`${50 - Math.random() * 40}%`} y2={`${50 + Math.random() * 40}%`} stroke="currentColor" strokeWidth="2" />
                                           ))}
                                        </svg>
                                     </div>
                                     <span className="relative z-10 text-[9px] text-[#3fb950] px-1 font-bold mix-blend-screen shadow-black drop-shadow-md">Dialogue_04_FINAL_mix.wav</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
         );

      case 'MapEdit':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex World Builder & Cartography', 'Advanced procedural map generation, heightmap erosion, PCG splines, and intelligent 2D/3D tile placement.', <MapIcon size={28} />)}
             
             <div className="flex-1 flex overflow-hidden">
               {/* Left Panel: Tools & Layers */}
               <div className="w-[320px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 overflow-hidden">
                 {/* Tabs */}
                 <div className="flex text-[11px] font-bold text-[#8b949e] border-b border-[#30363d] bg-[#0d1117] shrink-0">
                    <button className="flex-1 py-2 text-center hover:bg-[#161b22] hover:text-white border-b-2 border-[#58a6ff] text-white bg-[#161b22]">Terrain & Layers</button>
                    <button className="flex-1 py-2 text-center hover:bg-[#161b22] hover:text-white border-b-2 border-transparent">Proc Graph</button>
                    <button className="flex-1 py-2 text-center hover:bg-[#161b22] hover:text-white border-b-2 border-transparent">PCG Splines</button>
                 </div>

                 <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar p-3 gap-4">
                    {/* Brush Settings */}
                    <div className="flex flex-col gap-2">
                       <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#c9d1d9] tracking-wider mb-1">
                          <span>Brush Settings</span>
                          <Settings2 size={12} className="text-[#8b949e] cursor-pointer" />
                       </div>
                       
                       <div className="grid grid-cols-[80px_1fr] items-center gap-2 text-[11px] text-[#8b949e]">
                         <span>Radius</span>
                         <input type="range" className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" />
                       </div>
                       <div className="grid grid-cols-[80px_1fr] items-center gap-2 text-[11px] text-[#8b949e]">
                         <span>Falloff</span>
                         <input type="range" className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" />
                       </div>
                       <div className="grid grid-cols-[80px_1fr] items-center gap-2 text-[11px] text-[#8b949e]">
                         <span>Strength</span>
                         <input type="range" className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" />
                       </div>
                       <div className="grid grid-cols-[80px_1fr] items-center gap-2 text-[11px] text-[#8b949e]">
                         <span>Jitter</span>
                         <input type="range" className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" />
                       </div>
                       
                       <div className="flex flex-wrap gap-1 mt-2">
                         <button className="flex-1 bg-[#21262d] py-1 border border-[#58a6ff] text-[#58a6ff] rounded text-[10px] font-bold shadow-[0_0_10px_rgba(88,166,255,0.2)]">Raise</button>
                         <button className="flex-1 bg-[#0a0a0a] py-1 border border-[#30363d] text-[#8b949e] hover:text-white rounded text-[10px]">Lower</button>
                         <button className="flex-1 bg-[#0a0a0a] py-1 border border-[#30363d] text-[#8b949e] hover:text-white rounded text-[10px]">Flatten</button>
                         <button className="flex-1 bg-[#0a0a0a] py-1 border border-[#30363d] text-[#8b949e] hover:text-white rounded text-[10px]">Smooth</button>
                         <button className="flex-1 bg-[#0a0a0a] py-1 border border-[#30363d] text-[#8b949e] hover:text-white rounded text-[10px]">Ramp</button>
                         <button className="flex-1 bg-[#0a0a0a] py-1 border border-[#30363d] text-[#8b949e] hover:text-white rounded text-[10px]">Noise</button>
                       </div>
                    </div>

                    <div className="w-full h-[1px] bg-[#30363d]"></div>

                    {/* Terrain Layers (Photoshop style for Splat maps) */}
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#c9d1d9] tracking-wider mb-1">
                       <span>Terrain Layers & Masks</span>
                       <button className="hover:text-white bg-[#21262d] p-1 rounded border border-[#30363d]"><Plus size={12} /></button>
                    </div>

                    <div className="flex flex-col gap-1">
                       {/* Layer 1 */}
                       <div className="bg-[#161b22] border border-[#58a6ff] rounded p-1.5 flex items-center justify-between cursor-pointer">
                         <div className="flex items-center gap-2">
                           <Eye size={12} className="text-[#c9d1d9]"/>
                           <div className="w-5 h-5 rounded overflow-hidden relative">
                             <div className="absolute inset-0 bg-[#2ea043] opacity-50"></div>
                             <div className="absolute bottom-0 right-0 w-2 h-2 bg-white rounded-tl-sm border-t border-l border-[#000]"></div>
                           </div>
                           <span className="text-[11px] text-white font-bold">L_Grass_Lush</span>
                         </div>
                         <div className="text-[9px] text-[#8b949e] flex gap-1 items-center">
                           <span>100%</span>
                           <Lock size={10}/>
                         </div>
                       </div>
                       
                       {/* Layer 2 with mask */}
                       <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-1.5 flex flex-col gap-1 cursor-pointer hover:border-[#8b949e]">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <Eye size={12} className="text-[#c9d1d9]"/>
                             <div className="w-5 h-5 rounded bg-[#8b5a2b] border border-[#222]"></div>
                             <span className="text-[11px] text-[#8b949e] font-bold">L_Mud_Wet</span>
                           </div>
                           <div className="text-[9px] text-[#8b949e]">85%</div>
                         </div>
                         <div className="flex items-center gap-2 pl-7 pt-1 border-t border-[#222] mt-1 -mb-0.5">
                           <span className="bg-[#21262d] text-[#c9d1d9] text-[9px] px-1 rounded flex items-center gap-1"><Mountain size={8}/> Height Mask [0.2 - 0.4]</span>
                         </div>
                       </div>
                       
                       {/* Layer 3 */}
                       <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-1.5 flex items-center justify-between cursor-pointer hover:border-[#8b949e]">
                         <div className="flex items-center gap-2">
                           <Eye size={12} className="text-[#c9d1d9]"/>
                           <div className="w-5 h-5 rounded bg-[#aaa] border border-[#222]"></div>
                           <span className="text-[11px] text-[#8b949e] font-bold">L_Rock_Cliff</span>
                         </div>
                         <div className="text-[9px] text-[#8b949e]">100%</div>
                       </div>
                    </div>
                    
                    <button className="bg-[#1f6feb]/20 text-[#58a6ff] text-[10px] py-1.5 rounded border border-[#1f6feb]/40 font-bold flex items-center justify-center gap-1 mt-2">
                      <Settings2 size={12}/> Generate Auto-Masks
                    </button>
                 </div>
               </div>

               {/* Center Viewport */}
               <div className="flex-1 bg-[#050505] relative flex flex-col overflow-hidden w-full">
                 {/* Top Toolbar */}
                 <div className="h-10 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 shrink-0 shadow-md">
                   <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1 bg-[#0a0a0a] rounded border border-[#30363d] p-0.5 text-[11px]">
                       <button className="px-2 py-1 bg-[#21262d] text-white rounded cursor-pointer shadow-inner shadow-black/50 border border-[#30363d]" title="Sculpt Mode">Sculpt</button>
                       <button className="px-2 py-1 text-[#8b949e] hover:text-white rounded cursor-pointer" title="Paint Splatmap">Paint</button>
                       <button className="px-2 py-1 text-[#8b949e] hover:text-white rounded cursor-pointer" title="PCG Splines/Roads">Spline</button>
                       <button className="px-2 py-1 text-[#8b949e] hover:text-white rounded cursor-pointer" title="Foliage Instancer">Foliage</button>
                       <button className="px-2 py-1 text-[#8b949e] hover:text-white rounded cursor-pointer text-[#e3b341]" title="Volume/Weather">Volumes</button>
                     </div>
                     <span className="text-[#8b949e] text-[12px] font-bold">World: <span className="text-white">Aethelgard_Map_01</span></span>
                   </div>
                   
                   <div className="flex items-center gap-2">
                     <button className="bg-[#3fb950] text-[#0a0a0a] font-bold text-[11px] px-3 py-1.5 rounded flex items-center gap-1">
                       <RefreshCw size={12} className="text-[#0a0a0a]" /> Build NavMesh & Lighting
                     </button>
                   </div>
                 </div>

                 {/* Canvas Area */}
                 <div className="flex-1 relative overflow-hidden flex items-center justify-center cursor-crosshair">
                   {/* Huge 3D Viewport Mock */}
                   <div className="absolute inset-0 bg-[#0d1117] flex items-center justify-center">
                     {/* Background Horizon */}
                     <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#1f6feb]/10 to-[#0d1117]"></div>
                     
                     {/* Terrain Grid wireframe */}
                     <div className="absolute inset-x-0 bottom-0 top-[20%] right-[-50%] left-[-50%] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none origin-top" style={{ transform: 'perspective(500px) rotateX(60deg) translateY(0px)' }}></div>
                     
                     {/* Spline Path Representation (River/Road) */}
                     <svg className="absolute inset-0 w-full h-full text-[#3fb950] pointer-events-none opacity-60" viewBox="0 0 100 100">
                        <path d="M 0 60 Q 30 70, 50 50 T 100 40" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M 0 60 Q 30 70, 50 50 T 100 40" fill="none" stroke="#e3b341" strokeWidth="0.5" strokeDasharray="1,1" />
                        <circle cx="28" cy="62" r="0.5" fill="#fff" />
                        <circle cx="50" cy="50" r="0.5" fill="#fff" />
                        <circle cx="78" cy="42" r="0.5" fill="#fff" />
                     </svg>

                     {/* Brush Tool overlay in center */}
                     <div className="absolute w-32 h-32 border-2 border-[#58a6ff] rounded-full flex items-center justify-center opacity-70 pointer-events-none drop-shadow-[0_0_10px_rgba(88,166,255,1)]" style={{ transform: 'scaleY(0.5)' }}>
                        <div className="w-16 h-16 border border-[#58a6ff] border-dashed rounded-full"></div>
                        <div className="absolute w-0.5 h-4 bg-[#58a6ff] top-0 -mt-2"></div>
                        <div className="absolute w-0.5 h-4 bg-[#58a6ff] bottom-0 -mb-2"></div>
                        <div className="absolute h-0.5 w-4 bg-[#58a6ff] left-0 -ml-2"></div>
                        <div className="absolute h-0.5 w-4 bg-[#58a6ff] right-0 -mr-2"></div>
                     </div>
                     
                     {/* 3D Transform Gizmo (Translation / Rotation / Scale) */}
                     <div className="absolute flex items-center justify-center pointer-events-auto cursor-pointer" style={{ transform: 'translate(100px, 50px)' }}>
                         {/* Origin */}
                         <div className="w-3 h-3 bg-white rounded-sm absolute z-10 hover:scale-125 transition-transform shadow-md"></div>
                         {/* X-Axis (Red) */}
                         <div className="absolute w-16 h-1 bg-[#f85149] right-[-64px] top-[1px] origin-left group hover:h-2 transition-all flex justify-end">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[8px] border-l-[#f85149] transform translate-x-2 -translate-y-[3px] group-hover:border-l-[12px]"></div>
                         </div>
                         {/* Y-Axis (Green) */}
                         <div className="absolute w-1 h-16 bg-[#3fb950] top-[-64px] left-[1px] origin-bottom group hover:w-2 transition-all flex flex-col items-center">
                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-[#3fb950] transform -translate-y-[8px] group-hover:border-b-[12px]"></div>
                         </div>
                         {/* Z-Axis (Blue) */}
                         <div className="absolute w-12 h-12 border-l-2 border-b-2 border-transparent border-l-[#58a6ff] rounded-bl-full left-[-48px] bottom-[-48px] opacity-70 group hover:border-l-4 hover:opacity-100 transition-all flex items-end">
                            <div className="w-2 h-2 bg-[#58a6ff] rounded-full transform -translate-x-1 translate-y-1"></div>
                         </div>
                     </div>
                   </div>

                   <div className="absolute bottom-4 left-4 bg-[#0a0a0a]/90 backdrop-blur rounded p-2 text-[10px] text-[#8b949e] border border-[#30363d] font-mono flex flex-col gap-1 shadow-lg">
                     <div className="flex gap-4"><span>Loc (cm):</span> <span>X: 142055</span> <span>Y: -80400</span> <span>Z: 2541</span></div>
                     <div className="text-[#3fb950] font-bold">LOD: 0 (High Detail)</div>
                     <div className="text-[#c9d1d9]">Brush: Smooth / Falloff: Bell / Size: 15.0m</div>
                   </div>
                 </div>
               </div>

               {/* Right Panel: Auto-Tiling, PCG Rules, Splines */}
               <div className="w-[320px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                  
                  {/* Smart Scale & Proportion Validator (Added per user request) */}
                  <div className="p-3 border-b border-[#30363d] bg-[#1a0a00]">
                    <div className="flex justify-between items-center text-[11px] font-bold text-[#e3b341] uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1"><Ruler size={14} className="text-[#e3b341]" /> Smart Scale Validator</span>
                      <span className="bg-[#e3b341]/20 px-1.5 py-0.5 rounded text-[#e3b341] text-[9px] animate-pulse">ACTIVE</span>
                    </div>
                    <div className="text-[10px] text-[#8b949e] mb-2 leading-tight">
                      Dynamically checks scene proportions for realistic scaling (e.g. 180cm human vs 210cm door). Warns on giant/dwarf discrepancies.
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#e3b341]/40 rounded p-2 flex flex-col gap-2">
                       <div className="flex justify-between items-center text-[10px]">
                         <span className="text-[#8b949e]">Reference Base:</span>
                         <select className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] rounded px-1 outline-none text-[9px]">
                           <option>Standard Human (180cm)</option>
                           <option>Giant / Troll (450cm)</option>
                           <option>Halfling (110cm)</option>
                         </select>
                       </div>
                       <div className="h-[1px] w-full bg-[#e3b341]/20"></div>
                       <div className="flex flex-col gap-1 text-[10px]">
                         <div className="flex justify-between text-[#e3b341]">
                            <span className="flex items-center gap-1"><AlertTriangle size={10} /> <b>Warning:</b> Doorway_01_Wood</span>
                         </div>
                         <div className="text-[#8b949e]">Door height is 175cm. Below standard human threshold (min 210cm). AI Suggests scale * 1.25.</div>
                         <button className="self-start mt-1 text-[#0a0a0a] bg-[#e3b341] px-2 py-0.5 rounded font-bold text-[9px] hover:bg-[#ffeb8f]">Auto-Scale to Reference</button>
                       </div>
                    </div>
                  </div>

                  <div className="p-3 border-b border-[#30363d] text-[11px] font-bold text-[#c9d1d9] uppercase tracking-wider flex justify-between items-center">
                     Procedural Content Gen
                     <Network size={14} className="text-[#ff7b72]"/>
                  </div>
                  
                  {/* PCG Splines */}
                  <div className="p-3 flex flex-col gap-3 border-b border-[#30363d]">
                     <div className="flex justify-between items-center text-[11px] font-bold text-[#c9d1d9]">
                        <span className="flex items-center gap-1"><Workflow size={12} className="text-[#3fb950]"/> Spline Rules</span>
                        <button className="bg-[#21262d] p-0.5 rounded text-white"><Plus size={10}/></button>
                     </div>

                     <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-2 flex flex-col gap-2 relative">
                        <div className="flex justify-between items-center border-b border-[#222] pb-1 cursor-pointer hover:text-white">
                          <span className="text-[#c9d1d9] text-[10px] font-bold flex items-center gap-1">River Network_01</span>
                          <span className="text-[#f85149] text-[8px] border border-[#f85149] px-1 rounded uppercase">Destructive</span>
                        </div>
                        <div className="grid grid-cols-[80px_1fr] items-center gap-2 text-[10px] text-[#8b949e]">
                          <span>Width Spline</span>
                          <input type="text" className="bg-[#161b22] border border-[#30363d] rounded px-1.5 py-0.5 text-white" defaultValue="12.0m" />
                        </div>
                        <div className="grid grid-cols-[80px_1fr] items-center gap-2 text-[10px] text-[#8b949e]">
                          <span>Depth Sculpt</span>
                          <input type="text" className="bg-[#161b22] border border-[#30363d] rounded px-1.5 py-0.5 text-white" defaultValue="-4.5m" />
                        </div>
                        <div className="grid grid-cols-[80px_1fr] items-center gap-2 text-[10px] text-[#8b949e]">
                          <span>Bank Material</span>
                          <select className="bg-[#161b22] border border-[#30363d] rounded px-1.5 py-0.5 text-white outline-none">
                             <option>L_Mud_Wet</option>
                          </select>
                        </div>
                     </div>
                  </div>

                  {/* World Settings */}
                  <div className="p-3 border-b border-[#30363d]">
                     <span className="text-[10px] uppercase font-bold text-[#c9d1d9] mb-3 tracking-wider block">World Settings</span>
                     <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-[11px] items-center">
                           <span className="text-[#8b949e] flex items-center gap-1"><GridIcon size={10}/> Grid Resolution</span>
                           <select className="bg-[#0d1117] border border-[#30363d] text-right px-2 py-1 rounded text-white font-mono w-24 outline-none">
                              <option>8192 x 8192</option>
                              <option>4096 x 4096</option>
                              <option>2048 x 2048</option>
                           </select>
                        </div>
                        <div className="flex justify-between text-[11px] items-center">
                           <span className="text-[#8b949e] flex items-center gap-1"><Database size={10}/> Chunk Size</span>
                           <select className="bg-[#0d1117] border border-[#30363d] text-right px-2 py-1 rounded text-white font-mono w-24 outline-none">
                              <option>256 x 256</option>
                              <option>128 x 128</option>
                           </select>
                        </div>
                        <div className="flex justify-between text-[11px] items-center">
                           <span className="text-[#8b949e] flex items-center gap-1"><Sun size={10}/> Time Of Day</span>
                           <input type="time" className="bg-[#0d1117] border border-[#30363d] text-right px-2 py-1 rounded text-[#e3b341] font-mono w-24" defaultValue="14:30" />
                        </div>
                     </div>
                  </div>

                  {/* Weather / Volumes */}
                  <div className="p-3 flex flex-col gap-2">
                     <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#c9d1d9] tracking-wider mb-1">
                        <span>Volumes (Physics / Weather)</span>
                     </div>
                     <div className="bg-[#1f6feb]/10 border border-[#1f6feb]/30 rounded p-1.5 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                           <CloudRain size={12} className="text-[#58a6ff]"/>
                           <span className="text-[11px] text-[#58a6ff] font-bold">Rain_Volume_Heavy</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[#3fb950] shadow-[0_0_5px_#3fb950]"></div>
                     </div>
                     <div className="bg-[#f85149]/10 border border-[#f85149]/30 rounded p-1.5 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                           <Flame size={12} className="text-[#f85149]"/>
                           <span className="text-[11px] text-[#f85149] font-bold">KillZ_Volume_Lava</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[#8b949e]"></div>
                     </div>
                  </div>

               </div>
             </div>
           </div>
         );

      case 'WorldBible':

         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('World Design & Story DB', 'Centralized management for lore, regions, factions, and branching narrative nodes.', <Globe size={28} />)}
             <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex flex-col">
                     <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-[#58a6ff] uppercase text-[12px] tracking-wider">Universe Timeline Map</h3>
                       <button className="bg-[#21262d] px-2 py-1 rounded text-white text-[10px]"><Plus size={10} className="inline mr-1"/>New Event</button>
                     </div>
                     <ul className="text-[12px] space-y-3 text-[#8b949e] relative pl-4 border-l border-[#333] ml-2">
                       <li className="relative">
                         <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-[#58a6ff] rounded-full border-2 border-[#161b22]"></div>
                         <strong className="text-[#c9d1d9]">Year 0:</strong> The Great Cataclysm. The celestial event that fractured the central continent.
                       </li>
                       <li className="relative">
                         <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-[#58a6ff] rounded-full border-2 border-[#161b22]"></div>
                         <strong className="text-[#c9d1d9]">Year 400:</strong> The First Age of Arcane-Machinery integration.
                       </li>
                       <li className="relative">
                         <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-[#58a6ff] rounded-full border-2 border-[#161b22]"></div>
                         <strong className="text-[#c9d1d9]">Year 1250:</strong> Foundation of the 5 Nations and the signing of the Concordat.
                       </li>
                     </ul>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex flex-col">
                     <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-[#58a6ff] uppercase text-[12px] tracking-wider">World Cultures & Religions</h3>
                       <button className="bg-[#21262d] px-2 py-1 rounded text-white text-[10px]"><Plus size={10} className="inline mr-1"/>New Faction</button>
                     </div>
                     <ul className="text-[12px] space-y-3 text-[#8b949e] overflow-y-auto">
                       <li className="bg-[#0a0a0a] border border-[#333] p-2 rounded">
                         <strong className="text-[#c9d1d9] block mb-1">Aethelgard</strong>
                         <p>Monotheistic, values steel and honor. Adheres strictly to the 50 tenets of the Iron Code.</p>
                       </li>
                       <li className="bg-[#0a0a0a] border border-[#333] p-2 rounded">
                         <strong className="text-[#c9d1d9] block mb-1">Zenshia</strong>
                         <p>Nature worshipping, advanced biological engineering. Distinct Southern and Northern tribal hierarchies.</p>
                       </li>
                     </ul>
                  </div>
               </div>
               <div className="bg-[#0d1117] border border-[#3fb950]/30 p-4 rounded-lg flex flex-col gap-2 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Workflow size={64} className="text-[#3fb950]"/>
                 </div>
                 <h3 className="text-[#c9d1d9] text-[14px] font-bold z-10 flex items-center gap-2"><CheckCircle size={14} className="text-[#3fb950]"/> Story Node Validation</h3>
                 <p className="text-[12px] text-[#8b949e] z-10">Narrative graph parsed successfully. All quests, branching dialogues, and NPC schedules are consistent with the current world state.</p>
               </div>
             </div>
           </div>
        );
      case 'Modeling':
         return <ModelingEditor />;
      case 'ImageEdit':
         return <ImageEditor />;
      case 'EffectEdit':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex VFX & Particle Studio', 'Professional 2D & 3D Effect Editor. Earth, Water, Wind, Fire, Lightning, Light, Darkness, Bullets, Explosions and over 1,000,000,000+ elements.', <Flame size={28} />)}
             <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Library & Layers */}
                <div className="w-[300px] border-r border-[#30363d] bg-[#0d1117] flex flex-col shrink-0 flex-shrink-0">
                   <div className="p-2 border-b border-[#30363d] flex gap-2 w-full">
                      <div className="relative w-full">
                         <Search size={12} className="absolute left-2 top-1.5 text-[#8b949e]"/>
                         <input type="text" placeholder="Search 1,000,000,000+ Effects..." className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] py-1 pl-6 pr-2 rounded w-full outline-none focus:border-[#58a6ff]"/>
                      </div>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-2">
                       <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-1 mt-2">Primary Elements</div>
                       
                       <div className="flex flex-col gap-1">
                          <button className="flex items-center gap-2 p-1.5 hover:bg-[#161b22] rounded text-left text-[11px] text-[#c9d1d9] group transition-colors">
                             <Flame size={14} className="text-[#ff7b72]"/> Fire & Explosions <span className="ml-auto text-[9px] text-[#8b949e] group-hover:text-white">100M+ Items</span>
                          </button>
                          <button className="flex items-center gap-2 p-1.5 hover:bg-[#161b22] rounded text-left text-[11px] text-[#c9d1d9] group transition-colors">
                             <Droplets size={14} className="text-[#58a6ff]"/> Water & Ice <span className="ml-auto text-[9px] text-[#8b949e] group-hover:text-white">100M+ Items</span>
                          </button>
                          <button className="flex items-center gap-2 p-1.5 hover:bg-[#161b22] rounded text-left text-[11px] text-[#c9d1d9] group transition-colors">
                             <Wind size={14} className="text-[#a5d6ff]"/> Wind & Storms <span className="ml-auto text-[9px] text-[#8b949e] group-hover:text-white">100M+ Items</span>
                          </button>
                          <button className="flex items-center gap-2 p-1.5 hover:bg-[#161b22] rounded text-left text-[11px] text-[#c9d1d9] group transition-colors">
                             <Mountain size={14} className="text-[#d2a8ff]"/> Earth & Rock <span className="ml-auto text-[9px] text-[#8b949e] group-hover:text-white">100M+ Items</span>
                          </button>
                          <button className="flex items-center gap-2 p-1.5 hover:bg-[#161b22] rounded text-left text-[11px] text-[#c9d1d9] group transition-colors">
                             <Zap size={14} className="text-[#e3b341]"/> Lightning & Energy <span className="ml-auto text-[9px] text-[#8b949e] group-hover:text-white">10M+ Items</span>
                          </button>
                          <button className="flex items-center gap-2 p-1.5 hover:bg-[#161b22] rounded text-left text-[11px] text-[#c9d1d9] group transition-colors">
                             <Sun size={14} className="text-[#f0e68c]"/> Radiant Light <span className="ml-auto text-[9px] text-[#8b949e] group-hover:text-white">10M+ Items</span>
                          </button>
                          <button className="flex items-center gap-2 p-1.5 hover:bg-[#161b22] rounded text-left text-[11px] text-[#c9d1d9] group transition-colors">
                             <Ghost size={14} className="text-[#7e56c2]"/> Darkness & Void <span className="ml-auto text-[9px] text-[#8b949e] group-hover:text-white">10M+ Items</span>
                          </button>
                          <button className="flex items-center gap-2 p-1.5 hover:bg-[#161b22] rounded text-left text-[11px] text-[#c9d1d9] group transition-colors">
                             <Orbit size={14} className="text-[#bc8cff]"/> Projectiles & Bullets <span className="ml-auto text-[9px] text-[#8b949e] group-hover:text-white">999M+ Items</span>
                          </button>
                       </div>

                       <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-1 mt-4">Active Layers</div>
                       
                       <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col gap-2">
                           <div className="flex justify-between items-center bg-[#21262d] border border-[#ff7b72]/30 p-1 rounded">
                              <div className="flex gap-2 items-center text-[10px] text-white font-semibold">
                                 <Eye size={12} className="text-[#8b949e]"/> Core Explosion Emitter
                              </div>
                              <Lock size={10} className="text-[#8b949e]"/>
                           </div>
                           <div className="flex justify-between items-center bg-[#21262d] border border-[#e3b341]/30 p-1 rounded">
                              <div className="flex gap-2 items-center text-[10px] text-[#c9d1d9]">
                                 <Eye size={12} className="text-[#8b949e]"/> Shockwave Ring
                              </div>
                              <Lock size={10} className="text-[#8b949e]"/>
                           </div>
                           <div className="flex justify-between items-center bg-[#21262d] border border-[#30363d] p-1 rounded">
                              <div className="flex gap-2 items-center text-[10px] text-[#8b949e]">
                                 <Eye size={12} className="text-[#30363d]"/> Smoke Volume (Hidden)
                              </div>
                              <Lock size={10} className="text-[#30363d]"/>
                           </div>
                           
                           <button className="border border-dashed border-[#30363d] text-[#8b949e] text-[10px] rounded p-1 hover:bg-[#30363d] hover:text-white transition-colors flex justify-center items-center gap-1">
                               <Plus size={10}/> Add Emitter Layer
                           </button>
                       </div>
                   </div>
                </div>

                {/* Center: VFX Canvas & Timeline */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] relative">
                   <div className="absolute top-4 left-4 bg-black/60 border border-[#30363d] text-white text-[10px] py-1 px-3 rounded backdrop-blur-sm z-10 flex gap-4">
                      <span>FPS: <span className="text-[#3fb950]">120</span></span>
                      <span>Particles: <span className="text-[#e3b341]">1,504,392</span></span>
                      <span>Draw Calls: <span className="text-[#f85149]">1</span></span>
                   </div>
                   
                   <div className="absolute top-4 right-4 bg-[#161b22] border border-[#30363d] rounded p-1 flex gap-1 z-10">
                      <button className="p-1 px-3 text-[10px] text-white bg-[#21262d] rounded shadow-inner">3D Preview</button>
                      <button className="p-1 px-3 text-[10px] text-[#8b949e] hover:text-white">2D Sprite Sheet</button>
                   </div>

                   {/* Main Canvas rendering area */}
                   <div className="flex-1 flex justify-center items-center relative overflow-hidden bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-opacity-20 blend-overlay">
                      <div className="w-[200px] h-[200px] bg-gradient-to-tr from-[#ff7b72] to-[#e3b341] rounded-full blur-[60px] animate-pulse opacity-50 absolute"></div>
                      <div className="w-[100px] h-[100px] bg-white rounded-full blur-[10px] absolute"></div>
                      {/* Fake particles */}
                      <div className="absolute w-[2px] h-[20px] bg-white rotate-45 transform -translate-x-[60px] -translate-y-[60px]"></div>
                      <div className="absolute w-[3px] h-[3px] bg-[#ff7b72] rounded-full transform translate-x-[40px] -translate-y-[80px]"></div>
                      <div className="absolute w-[4px] h-[4px] bg-[#e3b341] rounded-full transform -translate-x-[80px] translate-y-[30px]"></div>
                      <div className="absolute w-[1px] h-[10px] bg-white -rotate-12 transform translate-x-[70px] translate-y-[50px]"></div>
                      <div className="absolute w-[2px] h-[2px] bg-white rounded-full transform translate-x-[90px] translate-y-[100px]"></div>
                   </div>

                   {/* Timeline */}
                   <div className="h-[200px] bg-[#161b22] border-t border-[#30363d] flex flex-col shrink-0">
                      <div className="p-1.5 border-b border-[#30363d] bg-[#0d1117] flex justify-between items-center text-[11px] text-[#8b949e]">
                         <div className="flex gap-2 items-center">
                            <button className="hover:text-white p-1"><Rewind size={14}/></button>
                            <button className="text-white bg-[#21262d] p-1 rounded hover:bg-[#30363d]"><Play size={14}/></button>
                            <button className="hover:text-white p-1"><FastForward size={14}/></button>
                            <span className="ml-4 font-mono">00:01:23 / 00:05:00</span>
                         </div>
                         <div className="flex gap-2">
                             <div className="h-1 bg-[#30363d] rounded w-24 overflow-hidden self-center">
                                 <div className="h-full bg-[#58a6ff] w-[40%]"></div>
                             </div>
                         </div>
                      </div>
                      <div className="flex-1 relative flex text-[#8b949e] text-[10px]">
                         <div className="w-[150px] border-r border-[#30363d] flex flex-col">
                            <div className="h-8 border-b border-[#30363d] p-2 bg-[#21262d]">Explosion Core</div>
                            <div className="h-8 border-b border-[#30363d] p-2 bg-[#21262d]">Shockwave</div>
                            <div className="h-8 border-b border-[#30363d] p-2 bg-[#0d1117]">Smoke</div>
                         </div>
                         <div className="flex-1 relative overflow-x-auto">
                            {/* Ruler */}
                            <div className="absolute top-0 w-full h-4 border-b border-[#30363d] flex text-[8px] px-2 text-[#484f58]">
                               <div className="w-10">0s</div><div className="w-10">1s</div><div className="w-10">2s</div><div className="w-10">3s</div>
                            </div>
                            {/* Tracks */}
                            <div className="absolute top-4 w-full flex flex-col">
                               <div className="h-8 border-b border-[#30363d]/50 p-1 relative">
                                  <div className="absolute left-2 w-32 h-6 bg-[#ff7b72] rounded opacity-70 border border-[#ff7b72]"></div>
                               </div>
                               <div className="h-8 border-b border-[#30363d]/50 p-1 relative">
                                  <div className="absolute left-10 w-20 h-6 bg-[#e3b341] rounded opacity-70 border border-[#e3b341]"></div>
                               </div>
                               <div className="h-8 border-b border-[#30363d]/50 p-1 relative">
                                  <div className="absolute left-4 w-48 h-6 bg-[#8b949e] rounded opacity-70 border border-[#8b949e]"></div>
                               </div>
                            </div>
                            {/* Playhead */}
                            <div className="absolute left-[80px] top-0 bottom-0 w-[1px] bg-[#f85149] z-10 text-[8px] text-[#f85149]">
                               <div className="absolute -top-3 -translate-x-1.5"><ChevronDown size={12}/></div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Right Panel: Advanced Property Inspector & AI Tools */}
                <div className="w-[300px] border-l border-[#30363d] bg-[#0d1117] flex flex-col shrink-0 flex-shrink-0">
                    <div className="p-2 border-b border-[#30363d] bg-[#161b22] text-[#c9d1d9] text-[11px] font-bold flex justify-between items-center sticky top-0 z-10 shrink-0">
                       VFX System Inspector <SlidersHorizontal size={12}/>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                       <div className="p-3 flex flex-col gap-4 text-[11px]">
                          {/* Manual Pro Tools */}
                          <div className="flex flex-col gap-2">
                             <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-1">Standard Dynamics</div>
                             
                             <div className="flex flex-col gap-1 text-[#8b949e]">
                                <div className="flex justify-between"><span>Spawn Rate (s)</span><span className="text-white">500</span></div>
                                <input type="range" className="w-full h-1 bg-[#333] accent-[#58a6ff]" />
                             </div>
                             
                             <div className="flex flex-col gap-1 text-[#8b949e]">
                                <div className="flex justify-between"><span>Life Time (min-max)</span><span className="text-white">0.5 - 1.2</span></div>
                                <div className="flex gap-2">
                                   <input type="number" className="w-1/2 bg-[#161b22] border border-[#30363d] rounded p-1 text-white outline-none" value="0.5" />
                                   <input type="number" className="w-1/2 bg-[#161b22] border border-[#30363d] rounded p-1 text-white outline-none" value="1.2" />
                                </div>
                             </div>

                             <div className="flex flex-col gap-1 text-[#8b949e]">
                                <div className="flex justify-between"><span>Start Size / End Size</span><span className="text-white">Curve</span></div>
                                <div className="h-[40px] bg-[#161b22] border border-[#30363d] rounded relative mt-1 overflow-hidden">
                                    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full stroke-[#58a6ff] stroke-2 fill-none">
                                        <path d="M0,35 C30,35 60,5 100,5" />
                                    </svg>
                                </div>
                             </div>

                             <div className="flex flex-col gap-1 text-[#8b949e]">
                                <div className="flex justify-between"><span>Gravity Scale</span><span className="text-white">-0.5</span></div>
                                <input type="range" className="w-full h-1 bg-[#333] accent-[#58a6ff]" />
                             </div>
                             
                             <button className="bg-[#21262d] border border-[#30363d] py-1.5 px-2 rounded font-semibold text-center text-[#c9d1d9] hover:bg-[#30363d] transition-colors mt-2">
                                Edit Vector Field
                             </button>
                          </div>
                          
                          <div className="w-full h-[1px] bg-[#30363d] my-1"></div>

                          {/* AI Generation Tools */}
                          <div className="flex flex-col gap-2">
                             <div className="flex justify-between items-center text-[10px] text-[#ff7b72] font-bold uppercase tracking-wider mb-1">
                                Deep AI Generation <Sparkles size={11} className="text-[#ff7b72]"/>
                             </div>
                             
                             <div className="bg-[#ff7b72]/10 border border-[#ff7b72]/30 p-2 rounded flex flex-col gap-2">
                                <span className="text-[10px] font-bold text-white">Generate Effect via Prompt</span>
                                <textarea 
                                  placeholder="e.g. A massive spiraling fireball that transitions into dark void matter with lightning arcs..."
                                  className="bg-[#0a0a0a] border border-[#ff7b72]/40 rounded p-1.5 text-white text-[10px] outline-none min-h-[50px] resize-none"
                                ></textarea>
                                <button className="bg-[#ff7b72] text-[#000] font-bold text-[10px] py-1.5 rounded w-full hover:bg-[#ff958f] transition-colors">Generate VFX Data</button>
                             </div>

                             <div className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 p-2 rounded flex flex-col gap-2 mt-1">
                                <span className="text-[10px] font-bold text-[#c9d1d9] flex justify-between">
                                  AI Optimization
                                  <span className="text-[#3fb950] border border-[#3fb950]/30 bg-[#3fb950]/10 px-1 rounded text-[8px]">OFFLINE</span>
                                </span>
                                <div className="text-[9px] text-[#8b949e] mb-1">Compress 1.5M particles into a 512x512 sprite sheet automatically.</div>
                                <button className="bg-transparent border border-[#bc8cff] text-[#bc8cff] font-bold text-[10px] py-1 rounded w-full hover:bg-[#bc8cff]/20 transition-colors">Auto-Sprite Atlas</button>
                             </div>
                             
                             <div className="bg-[#3fb950]/10 border border-[#3fb950]/30 p-2 rounded flex flex-col gap-2 mt-1">
                                <span className="text-[10px] font-bold text-[#c9d1d9]">Physics Bake</span>
                                <div className="text-[9px] text-[#8b949e] mb-1">Pre-calculate collision data using AI regression models for 0-cost runtime.</div>
                                <button className="bg-[#3fb950] text-[#000] font-bold text-[10px] py-1 rounded w-full hover:bg-[#5cdb6d] transition-colors">Bake Simulation (VDB)</button>
                             </div>
                          </div>

                       </div>
                    </div>
                </div>
             </div>
           </div>
         );
      case 'UIUXEdit':
         return <UIUXEditor />;
      case 'AudioEdit':
         return <AudioEditor />;
      case 'NPCEdit':
         return <NPCEditor />;
      case 'MonsterEdit':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex Entity Combat & Stat Designer', 'Database-driven stat editing, loot tables, and mechanical constraints.', <Ghost size={28} />)}
             <div className="flex-1 overflow-auto custom-scrollbar p-6">
                <div className="bg-[#161b22] border border-[#30363d] rounded flex shadow-lg">
                   {/* Entity List */}
                   <div className="w-[250px] border-r border-[#30363d] flex flex-col">
                      <div className="p-2 border-b border-[#30363d] flex justify-between items-center bg-[#21262d]">
                         <input type="text" placeholder="Search entity..." className="bg-transparent text-[11px] outline-none text-[#c9d1d9] w-full"/>
                         <Search size={14} className="text-[#8b949e]"/>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
                         <div className="p-2 bg-[#0d1117] border border-[#58a6ff] rounded text-[11px] text-[#c9d1d9] font-bold">Dire Wolf</div>
                         <div className="p-2 hover:bg-[#21262d] rounded text-[11px] text-[#8b949e] cursor-pointer">Goblin Grunt</div>
                         <div className="p-2 hover:bg-[#21262d] rounded text-[11px] text-[#8b949e] cursor-pointer">Orc Shaman</div>
                         <div className="p-2 hover:bg-[#21262d] rounded text-[11px] text-[#8b949e] cursor-pointer">Skeleton Warrior</div>
                         <div className="p-2 hover:bg-[#21262d] rounded text-[11px] text-[#e3b341] cursor-pointer">Dragon (Boss)</div>
                      </div>
                      <div className="p-2 border-t border-[#30363d] flex justify-center">
                         <button className="px-4 py-1.5 bg-[#21262d] border border-[#30363d] text-[#c9d1d9] text-[11px] font-bold rounded flex gap-2 items-center hover:bg-[#30363d]"><Plus size={12}/> New Entity</button>
                      </div>
                   </div>

                   {/* Editor Form */}
                   <div className="flex-1 bg-[#0d1117] p-6 flex flex-col gap-6">
                      <div className="flex justify-between items-end border-b border-[#30363d] pb-4">
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-[#8b949e]">Entity ID: npc_dire_wolf_01</span>
                            <input type="text" className="bg-transparent text-[24px] font-bold text-white outline-none" defaultValue="Dire Wolf" />
                         </div>
                         <button className="px-4 py-2 bg-[#3fb950] text-[#0d1117] font-bold rounded text-[12px]">Save Changes</button>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                         {/* Core Stats */}
                         <div className="flex flex-col gap-4 text-[12px] text-[#c9d1d9]">
                            <h4 className="font-bold text-[#58a6ff] border-b border-[#30363d] pb-2">Core Base Stats</h4>
                            
                            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                               <label className="text-[#8b949e]">Max HP</label>
                               <input type="number" className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none" defaultValue="250" />
                            </div>
                            
                            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                               <label className="text-[#8b949e]">Max Mana/EP</label>
                               <input type="number" className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none" defaultValue="0" />
                            </div>
                            
                            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                               <label className="text-[#8b949e]">Move Speed</label>
                               <input type="number" className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none" defaultValue="450" />
                            </div>

                            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                               <label className="text-[#8b949e]">Armor Rating</label>
                               <input type="number" className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none" defaultValue="15" />
                            </div>
                         </div>

                         {/* Combat & Logic */}
                         <div className="flex flex-col gap-4 text-[12px] text-[#c9d1d9]">
                            <h4 className="font-bold text-[#ff7b72] border-b border-[#30363d] pb-2">Combat Logic</h4>
                            
                            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                               <label className="text-[#8b949e]">Faction</label>
                               <select className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none">
                                  <option>Beasts</option>
                                  <option>Undead</option>
                                  <option>Humanoid</option>
                               </select>
                            </div>

                            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                               <label className="text-[#8b949e]">Behavior Tree</label>
                               <select className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none text-[#bc8cff]">
                                  <option>BT_AggressivePack</option>
                                  <option>BT_Cowardly</option>
                                  <option>BT_PatrolOnly</option>
                               </select>
                            </div>

                            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                               <label className="text-[#8b949e]">Aggro Range</label>
                               <input type="number" className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none" defaultValue="1200" />
                            </div>
                            
                            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                               <label className="text-[#8b949e]">Base Damage</label>
                               <input type="number" className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none" defaultValue="35" />
                            </div>
                         </div>
                      </div>

                      {/* Loot Table */}
                      <div className="flex flex-col gap-2 mt-4">
                         <div className="flex justify-between items-center border-b border-[#30363d] pb-2">
                            <h4 className="font-bold text-[#e3b341] text-[12px]">Loot Table (On Death)</h4>
                            <button className="text-[#58a6ff] hover:text-white px-2 py-1 bg-[#21262d] rounded text-[10px] flex gap-1 items-center"><Plus size={10}/> Add Item</button>
                         </div>
                         
                         <table className="w-full text-left text-[11px] text-[#8b949e]">
                            <thead className="bg-[#161b22] border-b border-[#30363d]">
                               <tr>
                                  <th className="p-2 font-normal">Item ID</th>
                                  <th className="p-2 font-normal">Drop Chance %</th>
                                  <th className="p-2 font-normal">Min QTY</th>
                                  <th className="p-2 font-normal">Max QTY</th>
                                  <th className="p-2 w-10"></th>
                               </tr>
                            </thead>
                            <tbody>
                               <tr className="border-b border-[#30363d] bg-[#0d1117]">
                                  <td className="p-2 text-[#c9d1d9]"><input type="text" className="bg-transparent outline-none w-full" defaultValue="item_wolf_pelt"/></td>
                                  <td className="p-2"><input type="number" className="bg-[#161b22] border border-[#30363d] rounded px-1 w-16" defaultValue="85"/></td>
                                  <td className="p-2"><input type="number" className="bg-[#161b22] border border-[#30363d] rounded px-1 w-16" defaultValue="1"/></td>
                                  <td className="p-2"><input type="number" className="bg-[#161b22] border border-[#30363d] rounded px-1 w-16" defaultValue="1"/></td>
                                  <td className="p-2 text-right"><span className="text-[#f85149] cursor-pointer">X</span></td>
                               </tr>
                               <tr className="border-b border-[#30363d] bg-[#0d1117]">
                                  <td className="p-2 text-[#c9d1d9]"><input type="text" className="bg-transparent outline-none w-full" defaultValue="item_sharp_fang"/></td>
                                  <td className="p-2"><input type="number" className="bg-[#161b22] border border-[#30363d] rounded px-1 w-16" defaultValue="30"/></td>
                                  <td className="p-2"><input type="number" className="bg-[#161b22] border border-[#30363d] rounded px-1 w-16" defaultValue="1"/></td>
                                  <td className="p-2"><input type="number" className="bg-[#161b22] border border-[#30363d] rounded px-1 w-16" defaultValue="2"/></td>
                                  <td className="p-2 text-right"><span className="text-[#f85149] cursor-pointer">X</span></td>
                               </tr>
                            </tbody>
                         </table>
                      </div>
                      
                      {/* Deep AI Entity Metanarrative & Procedural Generation Details */}
                      <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-[#30363d]">
                         <div className="bg-[#1f0d0d] border border-[#ff7b72]/30 rounded p-4 flex flex-col gap-4 shadow-[0_0_15px_rgba(255,123,114,0.05)]">
                            <h4 className="font-bold text-[#ff7b72] flex items-center gap-2 border-b border-[#30363d] pb-2 text-[12px] uppercase tracking-wider"><Bot size={14}/> Ultra-Deep AI Scripting Profile</h4>
                            
                            <div className="grid grid-cols-2 gap-6 text-[12px] text-[#c9d1d9]">
                               <div className="flex flex-col gap-3">
                                  <div className="flex flex-col gap-1">
                                     <label className="text-[#8b949e]">Ecological Niche & Habitat Logic</label>
                                     <input type="text" className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none text-[#ff7b72]" defaultValue="Apex predator of the Northern Tundra." />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                     <label className="text-[#8b949e]">Psychological Drive / Motivation</label>
                                     <input type="text" className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none" defaultValue="Territorial dominance, insatiable hunger." />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                     <label className="text-[#8b949e]">Vocalization / Roar Profile (For Audio Gen)</label>
                                     <input type="text" className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none" defaultValue="Deep guttural growls escalating to piercing howls; heavy bass resonance." />
                                  </div>
                               </div>

                               <div className="flex flex-col gap-3">
                                  <div className="flex flex-col gap-1">
                                     <label className="text-[#8b949e]">Reaction to Player States (Stealth, Injury)</label>
                                     <input type="text" className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none" defaultValue="Becomes highly aggressive when player HP < 30%. Ignores heavily armored." />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                     <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Dynamic Lore Evolution Hooks</label>
                                     <textarea className="bg-[#161b22] border border-[#30363d] rounded p-1.5 outline-none resize-none h-[64px]" defaultValue={`JSON:\n{"triggers": ["Kills_Player", "Survives_Encounter"],\n "evolution": "Becomes an Alpha marked with scars, stats +15%"}`}></textarea>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="bg-[#050505] p-3 rounded border border-[#f85149]/40 flex justify-between items-center relative overflow-hidden mt-2 z-10 shadow-[0_0_10px_rgba(248,81,73,0.1)] group">
                               <div className="absolute inset-0 bg-[#f85149]/10 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
                               <div className="flex flex-col relative z-20">
                                  <span className="text-[#f85149] font-bold text-[11px] uppercase tracking-wider">Adult Combat Protocol (18+ / 20+)</span>
                                  <span className="text-[#8b949e] text-[10px] max-w-xl mt-1">Enables extreme gore, explicitly violent takedowns/fatalities, psychological horror descriptors, and unconstrained beast morphology logic.</span>
                               </div>
                               <div className="flex items-center gap-2 relative z-20">
                                  <input type="checkbox" id="monster-adult-override" className="accent-[#f85149] w-4 h-4 shadow-[0_0_5px_rgba(248,81,73,0.8)] cursor-pointer" />
                                  <label htmlFor="monster-adult-override" className="text-[12px] text-[#f85149] font-bold cursor-pointer">Unleash Unrestricted AI</label>
                               </div>
                            </div>
                         </div>
                      </div>


                   </div>
                </div>
             </div>
           </div>
         );
      case 'PhysicsEngine':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex Physics & Collision Configurator', 'Configure rigidbodies, colliders, physics materials, and collision matrices.', <Orbit size={28} />)}
             <div className="flex-1 overflow-auto custom-scrollbar p-6">
                
                <div className="grid grid-cols-2 gap-6">
                   {/* AI Physics Material Gen */}
                   <div className="bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] rounded shadow-lg flex flex-col p-4 col-span-2 mb-4">
                     <h3 className="text-[#bc8cff] font-bold text-[13px] flex items-center gap-2 mb-2"><Bot size={14}/> AI Physics Material Generator</h3>
                     <p className="text-[#8b949e] text-[11px] mb-3">Generate friction, restitution, and density profiles from text.</p>
                     <div className="flex gap-2">
                       <input type="text" className="flex-1 bg-[#161b22] border border-[#30363d] p-2 text-white text-[12px] rounded outline-none" placeholder="e.g. Sticky, high friction rubber with low bounciness" />
                       <button className="bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 px-4 rounded text-[12px] font-bold flex items-center gap-2"><Sparkles size={14} /> Generate Profile</button>
                     </div>
                   </div>

                   {/* Collision Matrix */}
                   <PhysicsCollisionMatrix />

                   {/* Global Physics Settings */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] flex justify-between">
                         Global Physics Config
                         <button className="text-[#58a6ff] hover:text-white px-2 bg-[#21262d] rounded text-[10px]">Apply Changes</button>
                      </div>
                      <div className="p-4 flex flex-col gap-4 text-[12px] text-[#c9d1d9]">
                         <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center bg-[#0d1117] p-1.5 rounded border border-[#30363d]">
                               <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider flex items-center gap-1"><RotateCw size={10} className="text-[#bc8cff]"/> Gravity Mode</span>
                               <select className="bg-[#161b22] border border-[#30363d] rounded p-1 outline-none text-[#bc8cff] text-[10px]">
                                  <option>Directional (Standard)</option>
                                  <option>Point-Source (Planetary)</option>
                                  <option>Zero-G (Space)</option>
                               </select>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Global Gravity Vector</span>
                               <div className="flex gap-1">
                                  <input type="number" defaultValue="0" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-12 text-center text-[#ff7b72] outline-none" />
                                  <input type="number" defaultValue="-9.81" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-16 text-center text-[#3fb950] outline-none" />
                                  <input type="number" defaultValue="0" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-12 text-center text-[#58a6ff] outline-none" />
                               </div>
                            </div>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[#8b949e]">Default Material</span>
                            <select className="bg-[#0d1117] border border-[#30363d] rounded p-1 outline-none text-[#bc8cff]">
                               <option>PhysMat_RoughWood</option>
                               <option>PhysMat_BouncyRubber</option>
                               <option>PhysMat_Ice</option>
                            </select>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[#8b949e]">Max Depenetration Velocity</span>
                            <input type="number" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-24 outline-none text-right" defaultValue="10.0" />
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[#8b949e]">Bounce Threshold</span>
                            <input type="number" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-24 outline-none text-right" defaultValue="2.0" />
                         </div>
                         
                         <div className="w-full h-[1px] bg-[#30363d] my-1"></div>

                         <div className="flex justify-between items-center">
                            <span className="text-[#8b949e]">Enable CCD (Continuous Collision)</span>
                            <input type="checkbox" className="accent-[#58a6ff]" defaultChecked/>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[#8b949e]">Auto-Sync Transforms</span>
                            <input type="checkbox" className="accent-[#58a6ff]" defaultChecked/>
                         </div>
                         
                         <div className="w-full h-[1px] bg-[#30363d] my-1"></div>
                         
                         <div className="flex flex-col gap-1 mt-1">
                            <div className="flex justify-between items-center">
                               <span className="text-[#e3b341] font-bold">Show Physics Gizmos in 3D Viewport</span>
                               <input type="checkbox" className="accent-[#e3b341]" checked={showPhysicsGizmos} onChange={(e) => setShowPhysicsGizmos(e.target.checked)} />
                            </div>
                            <span className="text-[10px] text-[#8b949e] italic">Toggle visibility of physics gizmos in the 3D viewport, such as collider shapes, interaction matrices, and mathematical properties (mass, velocity vectors) for selected objects.</span>
                         </div>
                         {showPhysicsGizmos && (
                            <div className="mt-2 p-3 bg-[#0d1117] border border-[#e3b341]/50 border-dashed rounded relative overflow-hidden h-24 flex items-center justify-center">
                               <div className="absolute inset-0 grid grid-cols-[repeat(10,1fr)] grid-rows-[repeat(10,1fr)] opacity-20 pointer-events-none">
                                  {Array.from({length: 100}).map((_, i) => <div key={i} className="border border-[#e3b341]"></div>)}
                               </div>
                               <div className="flex flex-col items-center gap-1 z-10 text-[#e3b341] drop-shadow-md">
                                  <div className="flex items-center gap-2">
                                     <Box size={16} /> 
                                     <span className="text-xs font-mono font-bold tracking-widest uppercase">Gizmos Visible in Viewport</span>
                                  </div>
                                  <span className="text-[10px] text-[#c9d1d9] font-mono">Showing: Collider Shapes, Vectors, Mass & Matrices</span>
                               </div>
                            </div>
                         )}
                      </div>
                   </div>

                   {/* Environment & Aerodynamics */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col col-span-2 mt-2">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#58a6ff] flex items-center gap-2">
                         <Wind size={16}/> Atmospheric, Fluid & Aerodynamics Dynamics
                      </div>
                      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-[12px] text-[#c9d1d9]">
                         <div className="flex flex-col gap-1.5">
                            <span className="text-[#8b949e] font-bold uppercase text-[10px]">Global Air Density</span>
                            <div className="flex items-center gap-2">
                               <input type="range" min="0" max="2" step="0.01" defaultValue="1.22" className="w-full accent-[#58a6ff]" />
                               <span className="text-[10px] w-8">1.22</span>
                            </div>
                         </div>
                         <div className="flex flex-col gap-1.5">
                            <span className="text-[#8b949e] font-bold uppercase text-[10px]">Wind Vector (X, Y, Z)</span>
                            <div className="flex gap-1">
                               <input type="number" defaultValue="5.0" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-full text-center text-[#ff7b72] outline-none" />
                               <input type="number" defaultValue="0.0" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-full text-center text-[#3fb950] outline-none" />
                               <input type="number" defaultValue="-2.5" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-full text-center text-[#58a6ff] outline-none" />
                            </div>
                         </div>
                         <div className="flex flex-col gap-1.5">
                            <span className="text-[#8b949e] font-bold uppercase text-[10px]">Fluid Buoyancy Override</span>
                            <input type="number" step="0.1" defaultValue="9.8" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-full outline-none text-right" title="Archimedes principle force multiplier" />
                         </div>
                         <div className="flex flex-col gap-1.5">
                            <span className="text-[#8b949e] font-bold uppercase text-[10px]">Aero / Fluid Drag Multiplier</span>
                            <input type="number" step="0.1" defaultValue="1.0" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-full outline-none text-right" />
                         </div>
                      </div>
                   </div>

                   {/* Deep Material Deformation & Fracture Physics */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col col-span-2 mt-2">
                       <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#f85149] flex items-center gap-2">
                          <Variable size={16}/> Advanced Deformation, Fracture & Soft-Body Physics
                       </div>
                       <div className="flex bg-[#0d1117] h-[400px]">
                          {/* Material Library Sidebar */}
                          <div className="w-[300px] border-r border-[#30363d] flex flex-col">
                             <div className="p-2 border-b border-[#30363d]">
                                <input type="text" className="w-full bg-[#161b22] border border-[#30363d] p-1.5 text-white text-[11px] rounded outline-none" placeholder="Search 10,000+ Materials..." />
                             </div>
                             <div className="flex-1 overflow-auto custom-scrollbar p-2">
                                <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-2">Metals & Alloys</div>
                                <div className="pl-2 flex flex-col gap-1 mb-3 text-[11px]">
                                   <div className="text-[#c9d1d9] bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-[#58a6ff]">Titanium (Grade 5)</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Carbon Steel (A36)</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Aluminum (7075-T6)</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Cast Iron</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Copper (Pure)</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Brass (Naval)</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Inconel 718</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Tungsten Carbide</div>
                                </div>
                                <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-2">Polymers & Rubbers</div>
                                <div className="pl-2 flex flex-col gap-1 mb-3 text-[11px]">
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Polycarbonate (PC)</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Nylon 6/6</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Vulcanized Rubber</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Silicone (Shore 40A)</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Kevlar (Aramid)</div>
                                </div>
                                <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-2">Glass & Ceramics</div>
                                <div className="pl-2 flex flex-col gap-1 mb-3 text-[11px]">
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Tempered Glass</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Fused Quartz</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Borosilicate</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Alumina Ceramic</div>
                                </div>
                                <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-2">Wood & Organics</div>
                                <div className="pl-2 flex flex-col gap-1 mb-3 text-[11px]">
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Oak (White)</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Pine (Southern)</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Balsa</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Bone (Cortical)</div>
                                </div>
                                <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-2">Concrete & Stone</div>
                                <div className="pl-2 flex flex-col gap-1 mb-3 text-[11px]">
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Concrete (4000 PSI)</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Granite</div>
                                   <div className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded cursor-pointer border-l-2 border-transparent">Sandstone</div>
                                </div>
                             </div>
                          </div>

                          {/* Material Properties Editor */}
                          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                             <div className="flex justify-between items-start">
                                <div>
                                   <h4 className="text-[16px] font-bold text-[#c9d1d9] flex items-center gap-2">Titanium (Grade 5 - Ti-6Al-4V) <span className="px-2 py-0.5 bg-[#58a6ff]/20 text-[#58a6ff] text-[9px] rounded uppercase">Metal</span></h4>
                                   <p className="text-[#8b949e] text-[11px] mt-1">High-strength, aerospace-grade alloy with excellent corrosion resistance and high yield strength.</p>
                                </div>
                                <button className="bg-[#21262d] border border-[#30363d] px-3 py-1 rounded text-[#c9d1d9] text-[11px] hover:bg-[#30363d]">Duplicate</button>
                             </div>

                             <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[11px]">
                                {/* General Physics */}
                                <div className="col-span-2 border-b border-[#30363d] pb-2 mb-2 flex justify-between items-end">
                                   <h5 className="text-[#c9d1d9] font-bold text-[12px]">General Physics Parameters</h5>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Static Friction</span>
                                      <span className="text-[#c9d1d9] font-mono">0.36</span>
                                   </div>
                                   <input type="range" min="0" max="2" step="0.01" defaultValue="0.36" className="w-full accent-[#c9d1d9]" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Dynamic Friction</span>
                                      <span className="text-[#c9d1d9] font-mono">0.30</span>
                                   </div>
                                   <input type="range" min="0" max="2" step="0.01" defaultValue="0.30" className="w-full accent-[#c9d1d9]" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Restitution (Bounciness)</span>
                                      <span className="text-[#c9d1d9] font-mono">0.05</span>
                                   </div>
                                   <input type="range" min="0" max="1" step="0.05" defaultValue="0.05" className="w-full accent-[#c9d1d9]" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Density (kg/m³)</span>
                                      <span className="text-[#c9d1d9] font-mono">4430</span>
                                   </div>
                                   <input type="number" defaultValue="4430" className="bg-[#161b22] border border-[#30363d] p-1 text-[11px] text-[#c9d1d9] rounded outline-none" />
                                </div>

                                {/* Elasticity & Yield */}
                                <div className="col-span-2 border-b border-[#30363d] pb-2 mb-2 mt-2">
                                   <h5 className="text-[#e3b341] font-bold text-[12px]">Stress, Strain, & Yield (Deformation)</h5>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Young's Modulus (Stiffness)</span>
                                      <span className="text-[#58a6ff] font-mono">113.8 GPa</span>
                                   </div>
                                   <input type="range" min="10" max="250" defaultValue="113" className="w-full accent-[#58a6ff]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Yield Strength (Elastic limit)</span>
                                      <span className="text-[#58a6ff] font-mono">880 MPa</span>
                                   </div>
                                   <input type="range" min="100" max="2000" defaultValue="880" className="w-full accent-[#58a6ff]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Ultimate Tensile Strength (UTS)</span>
                                      <span className="text-[#f85149] font-mono">950 MPa</span>
                                   </div>
                                   <input type="range" min="100" max="2000" defaultValue="950" className="w-full accent-[#f85149]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Poisson's Ratio (Transverse strain)</span>
                                      <span className="text-[#3fb950] font-mono">0.34</span>
                                   </div>
                                   <input type="range" min="0.1" max="0.5" step="0.01" defaultValue="0.34" className="w-full accent-[#3fb950]" />
                                </div>

                                {/* Fracture & Tearing */}
                                <div className="col-span-2 border-b border-[#30363d] pb-2 mt-2 mb-2">
                                   <h5 className="text-[#f85149] font-bold text-[12px]">Fracture, Tearing & Splintering Mechanics</h5>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Fracture Toughness</span>
                                      <span className="text-[#f85149] font-mono">75 MPa·m½</span>
                                   </div>
                                   <input type="range" min="1" max="150" defaultValue="75" className="w-full accent-[#f85149]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between items-center h-[24px]">
                                      <span className="text-[#8b949e]">Fracture Mode</span>
                                      <select className="bg-[#161b22] border border-[#30363d] p-1 text-[10px] text-[#c9d1d9] rounded outline-none">
                                         <option>Ductile (Necking/Tearing)</option>
                                         <option>Brittle (Shattering)</option>
                                         <option>Splintering (Wood/Fibers)</option>
                                         <option>Soft-Body (Jello/Flesh)</option>
                                      </select>
                                   </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Plastic Deformation Rate</span>
                                      <span className="text-[#e3b341] font-mono">14% (Elongation)</span>
                                   </div>
                                   <input type="range" min="1" max="100" defaultValue="14" className="w-full accent-[#e3b341]" />
                                </div>
                                
                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between items-center h-[24px]">
                                      <span className="text-[#8b949e]">Voronoi Shatter Threshold</span>
                                      <div className="flex items-center gap-2">
                                        <input type="checkbox" className="accent-[#f85149]" defaultChecked /> <span className="text-[10px] text-[#8b949e]">Enable</span>
                                      </div>
                                   </div>
                                </div>

                                {/* Bending & Soft Body */}
                                <div className="col-span-2 border-b border-[#30363d] pb-2 mt-2 mb-2">
                                   <h5 className="text-[#3fb950] font-bold text-[12px]">Soft-Body, Bending & Dents</h5>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Plasticity Retention (Dents stay)</span>
                                      <span className="text-[#3fb950] font-mono">98%</span>
                                   </div>
                                   <input type="range" min="0" max="100" defaultValue="98" className="w-full accent-[#3fb950]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between items-center h-[24px]">
                                      <span className="text-[#8b949e]">Soft-body Simulation</span>
                                      <select className="bg-[#161b22] border border-[#30363d] p-1 text-[10px] text-[#c9d1d9] rounded outline-none">
                                         <option>Rigid (Requires FEM solver)</option>
                                         <option>FEM (Finite Element Method)</option>
                                         <option>Position-Based Dynamics (PBD)</option>
                                      </select>
                                   </div>
                                </div>

                                {/* Thermodynamics & Heat Transfer */}
                                <div className="col-span-2 border-b border-[#30363d] pb-2 mt-2 mb-2">
                                   <h5 className="text-[#ff7b72] font-bold text-[12px] flex items-center gap-1"><Flame size={12}/> Thermodynamics, Phase Change & Pyrolysis</h5>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Melting Point (Solid to Liquid)</span>
                                      <span className="text-[#ff7b72] font-mono">1668 °C</span>
                                   </div>
                                   <input type="range" min="-273" max="4000" defaultValue="1668" className="w-full accent-[#ff7b72]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Boiling Point (Liquid to Gas)</span>
                                      <span className="text-[#ff7b72] font-mono">3287 °C</span>
                                   </div>
                                   <input type="range" min="-273" max="6000" defaultValue="3287" className="w-full accent-[#ff7b72]" />
                                </div>
                                
                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Thermal Conductivity (k)</span>
                                      <span className="text-[#ff7b72] font-mono">21.9 W/(m·K)</span>
                                   </div>
                                   <input type="range" min="0" max="500" defaultValue="21.9" step="0.1" className="w-full accent-[#ff7b72]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Specific Heat Capacity (c)</span>
                                      <span className="text-[#ff7b72] font-mono">522.5 J/(kg·K)</span>
                                   </div>
                                   <input type="range" min="100" max="5000" defaultValue="522.5" step="0.5" className="w-full accent-[#ff7b72]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Latent Heat of Fusion (L_f)</span>
                                      <span className="text-[#ff7b72] font-mono">290 kJ/kg</span>
                                   </div>
                                   <input type="range" min="100" max="1000" defaultValue="290" className="w-full accent-[#ff7b72]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Thermal Expansion Coefficient (α)</span>
                                      <span className="text-[#ff7b72] font-mono">8.6 µm/(m·K)</span>
                                   </div>
                                   <input type="range" min="0" max="50" step="0.1" defaultValue="8.6" className="w-full accent-[#ff7b72]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Emissivity (ε) for Radiation</span>
                                      <span className="text-[#ff7b72] font-mono">0.15 (Polished)</span>
                                   </div>
                                   <input type="range" min="0" max="1" step="0.01" defaultValue="0.15" className="w-full accent-[#ff7b72]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between items-center h-[24px]">
                                      <span className="text-[#8b949e]">Sublimation (Solid to Gas directly)</span>
                                      <div className="flex items-center gap-2">
                                        <input type="checkbox" className="accent-[#ff7b72]" /> <span className="text-[10px] text-[#8b949e]">Capable</span>
                                      </div>
                                   </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between items-center h-[24px]">
                                      <span className="text-[#8b949e]">Combustion / Pyrolysis</span>
                                      <div className="flex items-center gap-2">
                                        <input type="checkbox" className="accent-[#ff7b72]" /> <span className="text-[10px] text-[#8b949e]">Flammable</span>
                                      </div>
                                   </div>
                                </div>

                                {/* Fluid Dynamics & Aerodynamics */}
                                <div className="col-span-2 border-b border-[#30363d] pb-2 mt-2 mb-2">
                                   <h5 className="text-[#58a6ff] font-bold text-[12px] flex items-center gap-1"><Wind size={12}/> Aerodynamics & Fluid Dynamics (SPH & Eulerian)</h5>
                                </div>
                                
                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between items-center h-[24px]">
                                      <span className="text-[#8b949e]">Wind Tunnel Interaction</span>
                                      <select className="bg-[#161b22] border border-[#30363d] p-1 text-[10px] text-[#c9d1d9] rounded outline-none">
                                         <option>Full Aerodynamic Profile</option>
                                         <option>Simplified Drag Only</option>
                                         <option>Bypass Wind Simulation</option>
                                      </select>
                                   </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Drag Coefficient (Cd)</span>
                                      <span className="text-[#58a6ff] font-mono">Varied by surface</span>
                                   </div>
                                   <input type="range" min="0.01" max="2" defaultValue="0.5" step="0.01" className="w-full accent-[#58a6ff]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Fluid Viscosity (if molten/liquid)</span>
                                      <span className="text-[#58a6ff] font-mono">1.2 mPa·s</span>
                                   </div>
                                   <input type="range" min="0" max="10000" defaultValue="1" className="w-full accent-[#58a6ff]" />
                                </div>

                                {/* Electromagnetism & Subatomic */}
                                <div className="col-span-2 border-b border-[#30363d] pb-2 mt-2 mb-2">
                                   <h5 className="text-[#a371f7] font-bold text-[12px] flex items-center gap-1"><Zap size={12}/> Electromagnetisms & Subatomic Physics</h5>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Electrical Conductivity</span>
                                      <span className="text-[#a371f7] font-mono">2.34 × 10^6 S/m</span>
                                   </div>
                                   <input type="range" min="0" max="100" defaultValue="50" className="w-full accent-[#a371f7]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between items-center h-[24px]">
                                      <span className="text-[#8b949e]">Magnetic Permeability</span>
                                      <select className="bg-[#161b22] border border-[#30363d] p-1 text-[10px] text-[#c9d1d9] rounded outline-none">
                                         <option>Paramagnetic (Weakly attracted)</option>
                                         <option>Diamagnetic (Repelled)</option>
                                         <option>Ferromagnetic (Strongly attracted)</option>
                                      </select>
                                   </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between items-center h-[24px]">
                                      <span className="text-[#8b949e]">Radioactive Decay / Isotope</span>
                                      <div className="flex items-center gap-2">
                                        <input type="checkbox" className="accent-[#a371f7]" /> <span className="text-[10px] text-[#8b949e]">Emits Radiation</span>
                                      </div>
                                   </div>
                                </div>

                                {/* Acoustics / Sound Wave Simulation */}
                                <div className="col-span-2 border-b border-[#30363d] pb-2 mt-2 mb-2">
                                   <h5 className="text-[#e3b341] font-bold text-[12px] flex items-center gap-1"><AudioWaveform size={12}/> Acoustics & Sound Wave Propagation</h5>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Speed of Sound in Material</span>
                                      <span className="text-[#e3b341] font-mono">6140 m/s</span>
                                   </div>
                                   <input type="range" min="300" max="12000" defaultValue="6140" className="w-full accent-[#e3b341]" />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                   <div className="flex justify-between">
                                      <span className="text-[#8b949e]">Acoustic Absorption Coefficient</span>
                                      <span className="text-[#e3b341] font-mono">0.02 (Reflective)</span>
                                   </div>
                                   <input type="range" min="0" max="1" step="0.01" defaultValue="0.02" className="w-full accent-[#e3b341]" />
                                </div>

                                <div className="col-span-2 bg-[#21262d] rounded border border-[#3fb950]/30 p-2 mt-4 text-[#3fb950] text-[10px] flex items-center gap-2 font-bold justify-center cursor-pointer hover:bg-[#3fb950]/10 transition-colors">
                                  <Sparkles size={12}/> IMPORT CUSTOM MATERIAL DEFINITION (.XML / JSON)
                                </div>

                             </div>
                          </div>
                       </div>
                   </div>

                   {/* Computational Fluid Dynamics & Weather */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col col-span-2">
                       <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#58a6ff] flex justify-between items-center bg-[#21262d]">
                          <div className="flex items-center gap-2"><Wind size={16}/> Advanced Computational Fluid Dynamics (CFD) & Atmospheric Engine</div>
                          <span className="text-[#3fb950] text-[9px] animate-pulse">Running Eulerian Solver [Voxel Resolution: 8K]</span>
                       </div>
                       <div className="p-4 grid grid-cols-3 gap-6">
                           {/* Eulerian / Atmospheric */}
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] border-b border-[#30363d] pb-1">Eulerian Atmosphere (Gas/Air)</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Air Density</span><span className="text-[#c9d1d9]">1.225 kg/m³</span></div>
                                 <input type="range" min="0" max="5" step="0.01" defaultValue="1.225" className="w-full accent-[#58a6ff] opacity-80" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Barometric Pressure</span><span className="text-[#c9d1d9]">101.3 kPa</span></div>
                                 <input type="range" min="0" max="200" step="1" defaultValue="101" className="w-full accent-[#58a6ff] opacity-80" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Coriolis Effect Coefficient</span><span className="text-[#c9d1d9]">0.0000729</span></div>
                                 <input type="range" min="0" max="0.001" step="0.00001" defaultValue="0.00007" className="w-full accent-[#58a6ff] opacity-80" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Turbulence Navier-Stokes</span><span className="text-[#c9d1d9]">k-epsilon model</span></div>
                                 <select className="bg-[#0a0a0a] border border-[#30363d] p-1 rounded text-[#c9d1d9]">
                                    <option>k-epsilon (Standard)</option>
                                    <option>k-omega SST</option>
                                    <option>Large Eddy Simulation (LES)</option>
                                    <option>Direct Numerical Sim (DNS)</option>
                                 </select>
                              </div>
                           </div>
                           {/* Lagrangian / Particle Water */}
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] border-b border-[#30363d] pb-1">Lagrangian Fluids (SPH Liquids)</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Rest Density (Water)</span><span className="text-[#3fb950]">998 kg/m³</span></div>
                                 <input type="range" min="500" max="2000" step="1" defaultValue="998" className="w-full accent-[#3fb950] opacity-80" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Surface Tension (Rayleigh)</span><span className="text-[#3fb950]">0.0728 N/m</span></div>
                                 <input type="range" min="0" max="1" step="0.001" defaultValue="0.0728" className="w-full accent-[#3fb950] opacity-80" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Kinematic Viscosity</span><span className="text-[#3fb950]">1.003e-6 m²/s</span></div>
                                 <input type="range" min="0" max="0.001" step="0.000001" defaultValue="0.000001" className="w-full accent-[#3fb950] opacity-80" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#f85149] font-bold">Non-Newtonian Behavior</span>
                                 <input type="checkbox" className="accent-[#f85149]" />
                              </div>
                           </div>
                           {/* Thermal / Convection */}
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#ff7b72] font-bold text-[11px] border-b border-[#30363d] pb-1">Thermodynamics & Convection</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Base Ambient Temp</span><span className="text-[#ff7b72]">293.15 K</span></div>
                                 <input type="range" min="0" max="5000" step="1" defaultValue="293" className="w-full accent-[#ff7b72] opacity-80" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Thermal Buoyancy (Alpha)</span><span className="text-[#ff7b72]">0.025</span></div>
                                 <input type="range" min="0" max="1" step="0.001" defaultValue="0.025" className="w-full accent-[#ff7b72] opacity-80" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Heat Dissipation Rate</span><span className="text-[#ff7b72]">0.5 J/s</span></div>
                                 <input type="range" min="0" max="10" step="0.1" defaultValue="0.5" className="w-full accent-[#ff7b72] opacity-80" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Convection Heat Transfer (h)</span><span className="text-[#ff7b72]">10.0 W/(m²·K)</span></div>
                                 <input type="range" min="1" max="1000" step="1" defaultValue="10" className="w-full accent-[#ff7b72] opacity-80" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Stefan-Boltzmann Const (σ)</span><span className="text-[#ff7b72]">5.67×10⁻⁸</span></div>
                                 <input type="text" defaultValue="5.670374e-8" className="bg-[#0a0a0a] border border-[#30363d] p-1 text-right text-mono text-[#ff7b72] rounded" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Wet-Bulb Temp / Humidity Solver</span>
                                 <input type="checkbox" defaultChecked className="accent-[#ff7b72]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Wind Chill Calculation</span>
                                 <input type="checkbox" defaultChecked className="accent-[#ff7b72]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#e3b341] font-bold">Radiative Heat Transfer</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                           </div>
                       </div>
                   </div>

                   {/* Astrophysical & Orbital Mechanics */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col col-span-2">
                       <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#e3b341] flex justify-between items-center bg-[#21262d]">
                          <div className="flex items-center gap-2"><Globe2 size={16}/> Astrophysics, Orbital & Relativistic Engine</div>
                       </div>
                       <div className="p-4 grid grid-cols-2 gap-8">
                           <div className="flex flex-col gap-3">
                              <h5 className="text-[#a371f7] font-bold text-[11px] border-b border-[#30363d] pb-1">Gravity & Orbit (N-Body Solver)</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Universal Gravitation Constant (G)</span><span className="text-[#c9d1d9]">6.674×10⁻¹¹</span></div>
                                 <input type="text" defaultValue="6.67430e-11" className="bg-[#0a0a0a] border border-[#30363d] p-1 text-right text-mono text-[#c9d1d9] rounded" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">N-Body Integration Method</span>
                                 <select className="bg-[#0a0a0a] border border-[#30363d] p-1 rounded text-[#c9d1d9]">
                                    <option>Symplectic Simple (Euler-Cromer)</option>
                                    <option>Runge-Kutta 4th Order (RK4)</option>
                                    <option>Verlet Integration (High Precision)</option>
                                    <option>Gauss-Radau (Adaptive Step)</option>
                                 </select>
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Roche Limit Tearing</span>
                                 <input type="checkbox" defaultChecked className="accent-[#a371f7]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-3">
                              <h5 className="text-[#ff7b72] font-bold text-[11px] border-b border-[#30363d] pb-1">Relativistic & Space-time Effects</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Time Dilation (Special Relativity)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#ff7b72]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Gravity Well Warping (General Relativity)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#ff7b72]" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Speed of Light (c) overriding</span><span className="text-[#c9d1d9]">299,792,458 m/s</span></div>
                                 <input type="number" defaultValue="299792458" className="bg-[#0a0a0a] border border-[#30363d] p-1 text-right text-mono text-[#c9d1d9] rounded" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Event Horizon Simulation (Blackholes)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#ff7b72]" />
                              </div>
                           </div>
                       </div>
                   </div>

                   {/* Micro-Physics & Granular Materials */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col col-span-2">
                       <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#b392f0] flex justify-between items-center bg-[#21262d]">
                          <div className="flex items-center gap-2"><Dot size={16}/> Granular Materials, Soil Mechanics & Subatomic</div>
                       </div>
                       <div className="p-4 grid grid-cols-3 gap-6">
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#e3b341] font-bold text-[11px] border-b border-[#30363d] pb-1">Granular Flow (Sand, Snow, Dirt)</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Angle of Repose</span><span className="text-[#e3b341]">34°</span></div>
                                 <input type="range" min="0" max="90" step="1" defaultValue="34" className="w-full accent-[#e3b341]" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Cohesion (Stickiness)</span><span className="text-[#e3b341]">Low</span></div>
                                 <input type="range" min="0" max="100" defaultValue="15" className="w-full accent-[#e3b341]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Avalanche Dynamics Solver</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#58a6ff] font-bold text-[11px] border-b border-[#30363d] pb-1">Atomic & Chemical Bonding</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Molecular Dynamics (MD) Solver</span>
                                 <input type="checkbox" className="accent-[#58a6ff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Lennard-Jones Potential</span>
                                 <select className="bg-[#0a0a0a] border border-[#30363d] p-1 rounded text-[#c9d1d9] w-24">
                                    <option>Active</option>
                                    <option>Disabled</option>
                                 </select>
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Chemical Reaction Speed (Arrhenius)</span><span className="text-[#58a6ff]">1.0x</span></div>
                                 <input type="range" min="0.1" max="100" step="0.1" defaultValue="1.0" className="w-full accent-[#58a6ff]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4 border-l border-[#30363d] pl-6">
                              <div className="flex flex-col gap-2 items-center justify-center text-center mt-4">
                                 <Cpu size={32} className="text-[#8b949e]" />
                                 <span className="text-[#c9d1d9] font-bold text-[12px]">Quantum Level Computing</span>
                                 <span className="text-[#8b949e] text-[10px]">Utilizes Google Quantum AI APIs or Q# local solvers to compute absolute sub-atomic entanglement and superposition interference.</span>
                                 <button className="bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 px-3 py-1.5 mt-2 rounded text-[10px] font-bold">ENABLE QUANTUM PASSTHROUGH</button>
                              </div>
                           </div>
                       </div>
                   </div>

                   {/* Plasma & High-Energy Physics */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col col-span-2">
                       <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#ff7b72] flex justify-between items-center bg-[#21262d]">
                          <div className="flex items-center gap-2"><Flame size={16}/> Plasma Physics, Magnetohydrodynamics (MHD) & Fusion</div>
                       </div>
                       <div className="p-4 grid grid-cols-3 gap-6">
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#a371f7] font-bold text-[11px] border-b border-[#30363d] pb-1">Plasma State (4th State)</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Degree of Ionization</span><span className="text-[#a371f7]">99.9%</span></div>
                                 <input type="range" min="0" max="100" step="0.1" defaultValue="99.9" className="w-full accent-[#a371f7] opacity-80" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Electron Temperature (Te)</span><span className="text-[#a371f7]">1.5e7 K</span></div>
                                 <input type="text" defaultValue="1.5e7" className="bg-[#0a0a0a] border border-[#30363d] p-1 text-right font-mono text-[#a371f7] rounded" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Debye Shielding Simulation</span>
                                 <input type="checkbox" defaultChecked className="accent-[#a371f7]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#58a6ff] font-bold text-[11px] border-b border-[#30363d] pb-1">Magnetic Fields (MHD)</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Magnetic Field Strength (B)</span><span className="text-[#58a6ff]">5.0 Tesla</span></div>
                                 <input type="range" min="0" max="100" step="0.1" defaultValue="5.0" className="w-full accent-[#58a6ff] opacity-80" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Lorentz Force Solver</span>
                                 <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Magnetic Reconnection</span>
                                 <select className="bg-[#0a0a0a] border border-[#30363d] p-1 rounded text-[#c9d1d9]">
                                    <option>Sweet-Parker Model</option>
                                    <option>Petschek Model</option>
                                    <option>Collisionless Reconnection</option>
                                 </select>
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#e3b341] font-bold text-[11px] border-b border-[#30363d] pb-1">Nuclear Fusion</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Lawson Criterion (NτT)</span><span className="text-[#e3b341]">Auto</span></div>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Reaction Type</span>
                                 <select className="bg-[#0a0a0a] border border-[#30363d] p-1 rounded text-[#c9d1d9]">
                                    <option>D-T (Deuterium-Tritium)</option>
                                    <option>D-D (Deuterium-Deuterium)</option>
                                    <option>He3-He3 (Aneutronic)</option>
                                    <option>p-B11 (Boron)</option>
                                 </select>
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Bremsstrahlung Radiation Loss</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                           </div>
                       </div>
                   </div>

                   {/* Exotic Matter & String Theory */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col col-span-2">
                       <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#bc8cff] flex justify-between items-center bg-[#21262d]">
                          <div className="flex items-center gap-2"><Network size={16}/> Multiversal, String Theory & Exotic Matter Physics</div>
                       </div>
                       <div className="p-4 grid grid-cols-2 gap-8">
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#8b949e] font-bold text-[11px] border-b border-[#30363d] pb-1">Dark Matter & Exotic Particles</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Dark Matter Halo Density</span><span className="text-[#c9d1d9]">0.3 GeV/cm³</span></div>
                                 <input type="range" min="0" max="10" step="0.1" defaultValue="0.3" className="w-full accent-[#c9d1d9] opacity-80" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Antimatter Annihilation Trigger</span>
                                 <input type="checkbox" defaultChecked className="accent-[#f85149]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Tachyon (FTL Particle) Inclusion</span>
                                 <select className="bg-[#0a0a0a] border border-[#30363d] p-1 rounded text-[#c9d1d9]">
                                    <option>Forbidden (Causality Maintained)</option>
                                    <option>Allowed (Retrocausality Active)</option>
                                 </select>
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Negative Mass (Exotic Matter)</span><span className="text-[#bc8cff]">-1.0 kg</span></div>
                                 <input type="range" min="-10" max="0" step="0.1" defaultValue="-1.0" className="w-full accent-[#bc8cff] opacity-80" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#bc8cff] font-bold text-[11px] border-b border-[#30363d] pb-1">String Theory & Extra Dimensions</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Calabi-Yau Manifold Projection</span><span className="text-[#bc8cff]">Active</span></div>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Active Dimensions</span><span className="text-[#bc8cff]">11 (M-Theory)</span></div>
                                 <input type="range" min="3" max="26" step="1" defaultValue="11" className="w-full accent-[#bc8cff] opacity-80" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Quantum Loop Gravity Subgrid</span>
                                 <input type="checkbox" className="accent-[#bc8cff]" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Brane Collision Probability</span><span className="text-[#bc8cff]">0.00001% / tick</span></div>
                                 <input type="range" min="0" max="0.01" step="0.00001" defaultValue="0.00001" className="w-full accent-[#bc8cff] opacity-80" />
                              </div>
                           </div>
                       </div>
                   </div>

                   {/* Optics & Non-Linear Light */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col col-span-2">
                       <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#e3b341] flex justify-between items-center bg-[#21262d]">
                          <div className="flex items-center gap-2"><Sun size={16}/> Absolute Optics, Photonics & Non-Linear Light Physics</div>
                       </div>
                       <div className="p-4 grid grid-cols-3 gap-6">
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#58a6ff] font-bold text-[11px] border-b border-[#30363d] pb-1">Rayleigh & Mie Scattering</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Rayleigh Coefficient (Sky color)</span><span className="text-[#58a6ff]">Standard (Earth)</span></div>
                                 <select className="bg-[#0a0a0a] border border-[#30363d] p-1 rounded text-[#c9d1d9]">
                                    <option>Earth (Blue Sky, Red Sunset)</option>
                                    <option>Mars (Red Sky, Blue Sunset)</option>
                                    <option>Venus (Yellow-White haze)</option>
                                    <option>Custom Matrix</option>
                                 </select>
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Mie Coefficient (Fog/Aerosols)</span><span className="text-[#58a6ff]">0.0021</span></div>
                                 <input type="range" min="0" max="0.05" step="0.0001" defaultValue="0.0021" className="w-full accent-[#58a6ff] opacity-80" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#3fb950] font-bold text-[11px] border-b border-[#30363d] pb-1">Wave Optics (Diffraction/Interference)</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Thin-Film Interference (Iridescence)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Double-Slit Diffraction Modeling</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Index of Refraction Map (IoR)</span><span className="text-[#3fb950]">Dynamic</span></div>
                                 <select className="bg-[#0a0a0a] border border-[#30363d] p-1 rounded text-[#c9d1d9]">
                                    <option>Volumetric (Thermal Mirages)</option>
                                    <option>Surface Based (Glass/Water)</option>
                                 </select>
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#bc8cff] font-bold text-[11px] border-b border-[#30363d] pb-1">Non-Linear Photonics</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Cherenkov Radiation (Blue glow)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Kerr Effect (Refraction config)</span>
                                 <input type="checkbox" className="accent-[#bc8cff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Raman Scattering</span>
                                 <input type="checkbox" className="accent-[#bc8cff]" />
                              </div>
                           </div>
                       </div>
                   </div>

                   {/* Absolute Periodic Table & Nucleosynthesis Simulation */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col col-span-2">
                       <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#b392f0] flex justify-between items-center bg-[#21262d]">
                          <div className="flex items-center gap-2"><Orbit size={16}/> Absolute Periodic Table, Isotopes & Nucleosynthesis Forge</div>
                       </div>
                       <div className="p-4 grid grid-cols-3 gap-6">
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#e3b341] font-bold text-[11px] border-b border-[#30363d] pb-1">Known Elements (1-118)</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Enable All Standard Elements</span><span className="text-[#e3b341]">Active</span></div>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Isotope Decay Tracking (Half-life)</span><span className="text-[#e3b341]">Real-time</span></div>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Transmutation Base Probability</span>
                                 <input type="range" min="0" max="1" step="0.01" defaultValue="0" className="w-24 accent-[#e3b341]" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Atomic Mass Variance (AMU)</span><span className="text-[#e3b341]">Standard</span></div>
                                 <select className="bg-[#0a0a0a] border border-[#30363d] p-1 rounded text-[#c9d1d9]">
                                    <option>Standard Earth Isotopic Ratios</option>
                                    <option>Dynamic Stellar Ratios</option>
                                 </select>
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#bc8cff] font-bold text-[11px] border-b border-[#30363d] pb-1">Stellar Nucleosynthesis (Forge)</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Proton-Proton Chain Reaction</span>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">CNO Cycle (Carbon-Nitrogen-Oxygen)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Triple-Alpha Process (Helium to Carbon)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>R-Process / S-Process Simulation</span><span className="text-[#bc8cff]">Supernova/AGB</span></div>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#ff7b72] font-bold text-[11px] border-b border-[#30363d] pb-1">Custom Element Creation (119+)</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Island of Stability Extension</span><span className="text-[#ff7b72]">Enabled</span></div>
                                 <input type="checkbox" defaultChecked className="accent-[#ff7b72]" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Subatomic Composition (Protons/Neutrons)</span></div>
                                 <div className="flex gap-2">
                                     <input type="number" placeholder="Z (Protons)" className="w-full bg-[#0a0a0a] border border-[#30363d] p-1 text-[#ff7b72] rounded text-center" defaultValue="119" />
                                     <input type="number" placeholder="N (Neutrons)" className="w-full bg-[#0a0a0a] border border-[#30363d] p-1 text-[#ff7b72] rounded text-center" defaultValue="180" />
                                 </div>
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Electron Shell / Orbital Prediction</span><span className="text-[#ff7b72]">Dirac Eq.</span></div>
                                 <select className="bg-[#0a0a0a] border border-[#30363d] p-1 rounded text-[#c9d1d9]">
                                    <option>Extrapolated Madelung Rule</option>
                                    <option>Relativistic Dirac-Fock Solver</option>
                                 </select>
                              </div>
                              <button className="bg-[#ff7b72]/10 hover:bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/30 px-3 py-1.5 rounded text-[10px] font-bold w-full mt-1 flex justify-center items-center gap-1"><Zap size={12}/> SYNTHESIZE EXOTIC ATOM</button>
                           </div>
                       </div>
                   </div>

                   {/* Universal Chemical Simulation Engine (Basic to Advanced Tiering) */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col col-span-2">
                       <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#58a6ff] flex justify-between items-center bg-[#21262d]">
                          <div className="flex items-center gap-2"><Droplets size={16}/> Multilevel Chemistry Curriculum & Simulation Engine</div>
                       </div>
                       
                       {/* Basic Chemistry Tier */}
                       <div className="p-4 grid grid-cols-3 gap-6 border-b border-[#30363d] bg-[#0d1117]">
                           <div className="flex flex-col gap-4 col-span-3">
                              <h5 className="text-[#3fb950] font-bold text-[12px] border-b border-[#30363d] pb-1 uppercase tracking-wider">Level 1: Basic Chemistry (Foundations & Elements)</h5>
                              <p className="text-[10px] text-[#8b949e]">Ideal for beginners / Middle School / Foundations. Focuses on atomic structure, basic periodic trends, states of matter, and simple bonding.</p>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Atomic & Periodic Theory</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Bohr Model Visualization (p+, n0, e-)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Periodic Trends (Electronegativity, Radius)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">States & Properties</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Matter States (Solid, Liquid, Gas)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Physical vs. Chemical Changes</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Basic Bonding</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Ionic vs Covalent Recognition</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Chemical Formula Parsing</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                           </div>
                       </div>

                       {/* Intermediate Chemistry Tier */}
                       <div className="p-4 grid grid-cols-3 gap-6 border-b border-[#30363d] bg-[#161b22]">
                           <div className="flex flex-col gap-4 col-span-3">
                              <h5 className="text-[#e3b341] font-bold text-[12px] border-b border-[#30363d] pb-1 uppercase tracking-wider">Level 2: Intermediate Chemistry (Dynamics & Algorithms)</h5>
                              <p className="text-[10px] text-[#8b949e]">Ideal for High School / Serious Simulation / Exams. Focus on mole concept, balancing, acid-base pH, kinetics, and thermochemistry.</p>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Stoichiometry & Moles</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Mole Concept & Avogadro's Number</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Automated Equation Balancing</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                              <div className="flex justify-between text-[#8b949e] text-[11px]"><span>Reaction Yield Calc</span><span className="text-[#e3b341]">Theoretical/Actual</span></div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Acid-Base & Equilibrium</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>pH / pOH Tracking Solver</span><span className="text-[#e3b341]">Precision</span></div>
                                 <input type="range" min="0" max="14" step="0.1" defaultValue="7" className="w-full accent-[#e3b341]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Le Chatelier's Principle Logic</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Kinetics & Thermodynamics</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Reaction Rate (Arrhenius multiplier)</span><span className="text-[#e3b341]">1.0x</span></div>
                                 <input type="range" min="0" max="5" step="0.01" defaultValue="1" className="w-full accent-[#e3b341]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Exothermic/Endothermic Exchanger</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                           </div>
                       </div>

                       {/* Advanced Chemistry Tier */}
                       <div className="p-4 grid grid-cols-3 gap-6 bg-[#0d1117]">
                           <div className="flex flex-col gap-4 col-span-3">
                              <h5 className="text-[#f85149] font-bold text-[12px] border-b border-[#30363d] pb-1 uppercase tracking-wider">Level 3: Advanced Chemistry (Quantum, Analytical & Research)</h5>
                              <p className="text-[10px] text-[#8b949e]">Ideal for University / Deep Science / Research Games. Extrema physics, quantum chemistry, complex mechanisms, and spectroscopy.</p>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Advanced Organic Mechanisms</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">SN1/SN2/E1/E2 Path Prediction</span>
                                 <input type="checkbox" defaultChecked className="accent-[#f85149]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Stereochemistry (Chirality, R/S)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#f85149]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Curved Arrow Mechanism Generation</span>
                                 <button className="bg-[#f85149]/10 text-[#f85149] border border-[#f85149]/30 px-2 py-0.5 rounded text-[9px]">AI GENERATE</button>
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Physical & Quantum Chemistry</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Schrödinger Equation Orbitals</span>
                                 <input type="checkbox" defaultChecked className="accent-[#f85149]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Statistical Thermodynamics</span>
                                 <input type="checkbox" defaultChecked className="accent-[#f85149]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Molecular Dynamics (MD) Simulation</span>
                                 <input type="checkbox" defaultChecked className="accent-[#f85149]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Analytical & Spectroscopy</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">NMR (Nuclear Magnetic Resonance)</span>
                                 <select className="bg-[#0a0a0a] border border-[#30363d] p-1 rounded text-[#c9d1d9] text-[9px]"><option>1H NMR</option><option>13C NMR</option></select>
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">IR (Infrared) Peak Simulation</span>
                                 <input type="checkbox" defaultChecked className="accent-[#f85149]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Mass Spectrometry Fragmentation</span>
                                 <input type="checkbox" defaultChecked className="accent-[#f85149]" />
                              </div>
                           </div>
                       </div>
                   </div>

                   {/* Universal Biological Curriculum & Simulation Engine (Basic to Master Tiering) */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col col-span-2">
                       <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#3fb950] flex justify-between items-center bg-[#21262d]">
                          <div className="flex items-center gap-2"><Activity size={16}/> Multilevel Biological Curriculum & Ecosystem Engine</div>
                       </div>
                       
                       {/* Basic Biology Tier */}
                       <div className="p-4 grid grid-cols-3 gap-6 border-b border-[#30363d] bg-[#0d1117]">
                           <div className="flex flex-col gap-4 col-span-3">
                              <h5 className="text-[#3fb950] font-bold text-[12px] border-b border-[#30363d] pb-1 uppercase tracking-wider">Level 1: Basic Biology (Foundations of Life)</h5>
                              <p className="text-[10px] text-[#8b949e]">Ideal for beginners / Middle School. Focuses on cell structure, living vs non-living, basic systems, and simple ecosystems.</p>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Cellular Foundations</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Cell Theory & Structure Explorer</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Living vs Non-Living Diagnostics</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">System Basics</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Basic Body Systems (Respiratory, Digestive)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Reproduction Overview</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Ecosystems & Plants</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Photosynthesis Engine</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Food Web & Simple Habitats</span>
                                 <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                              </div>
                           </div>
                       </div>

                       {/* Intermediate Biology Tier */}
                       <div className="p-4 grid grid-cols-3 gap-6 border-b border-[#30363d] bg-[#161b22]">
                           <div className="flex flex-col gap-4 col-span-3">
                              <h5 className="text-[#58a6ff] font-bold text-[12px] border-b border-[#30363d] pb-1 uppercase tracking-wider">Level 2: Intermediate Biology (Genetics & Form)</h5>
                              <p className="text-[10px] text-[#8b949e]">Ideal for High School. Cell division, DNA/RNA, Mendelian genetics, immune systems, and evolutionary theory.</p>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Genetics & Division</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Mitosis & Meiosis Sandbox</span>
                                 <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">DNA Replication Simulator</span>
                                 <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Mendelian Inheritance Predictor</span>
                                 <button className="bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/30 px-2 py-0.5 rounded text-[9px]">PUNNETT</button>
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Physiology & Defense</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Detailed Anatomical Systems</span>
                                 <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Basic Immune Response Mapping</span>
                                 <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Evolution Models</h5>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Selection Pressure Threshold</span><span className="text-[#58a6ff]">Medium</span></div>
                                 <input type="range" min="0" max="100" step="1" defaultValue="50" className="w-full accent-[#58a6ff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Natural Selection Algorithims</span>
                                 <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                              </div>
                           </div>
                       </div>

                       {/* Advanced Biology Tier */}
                       <div className="p-4 grid grid-cols-3 gap-6 border-b border-[#30363d] bg-[#0d1117]">
                           <div className="flex flex-col gap-4 col-span-3">
                              <h5 className="text-[#e3b341] font-bold text-[12px] border-b border-[#30363d] pb-1 uppercase tracking-wider">Level 3: Advanced Biology (Molecules & Systems)</h5>
                              <p className="text-[10px] text-[#8b949e]">Ideal for University / Deep Science. Biomolecules, metabolism, microbiology, nervous systems, and deep ecology.</p>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Biochemistry & Enzymes</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Protein Synthesis & Gene Expression</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                              <div className="flex flex-col gap-1.5 text-[11px]">
                                 <div className="flex justify-between text-[#8b949e]"><span>Enzyme Kinetics (Michaelis-Menten)</span><span className="text-[#e3b341]">High</span></div>
                                 <input type="range" min="0" max="1" step="0.01" defaultValue="0.8" className="w-full accent-[#e3b341]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Metabolic Pathways (Krebs/Glycolysis)</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Neurology & Endocrine</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Neurotransmitter Diffusion Mapping</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Hormonal Feedback Loops</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Synaptic Plasticity</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Micro & Deep Ecology</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Microbiology Pathogen Vectors</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Deep Ecological Symbiosis</span>
                                 <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                              </div>
                           </div>
                       </div>

                       {/* Master/Expert Biology Tier */}
                       <div className="p-4 grid grid-cols-3 gap-6 bg-[#161b22]">
                           <div className="flex flex-col gap-4 col-span-3">
                              <h5 className="text-[#bc8cff] font-bold text-[12px] border-b border-[#30363d] pb-1 uppercase tracking-wider">Level 4: Master Biology (Synthetic & Computational)</h5>
                              <p className="text-[10px] text-[#8b949e]">For Experts and Researchers. Systems biology, CRISPR, Synthetic editing, Bioinformatics, and cutting-edge biotech.</p>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Bioinformatics & Systems</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Computational Bioinformatics Engine</span>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Systems Biology Network Mapping</span>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Literature/Paper Parser API</span>
                                 <button className="bg-[#bc8cff]/10 text-[#bc8cff] border border-[#bc8cff]/30 px-2 py-0.5 rounded text-[9px]">CONNECT</button>
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Synthetic Biology</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">De Novo Cell Creation</span>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">CRISPR-Cas9 Editing Suite</span>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Plasmid & Vector Assembly</span>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-4">
                              <h5 className="text-[#c9d1d9] font-bold text-[11px] pb-1">Advanced Biotech</h5>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Stem Cell & Tissue Culturing</span>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                 <span className="text-[#8b949e]">Nanobiotechnology Interactions</span>
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff]" />
                              </div>
                           </div>
                       </div>
                   </div>

                   {/* Universal Engine Export */}
                   <div className="bg-[#bc8cff]/10 border border-[#bc8cff]/50 rounded shadow-[0_0_20px_rgba(188,140,255,0.1)] flex flex-col col-span-2 mt-4 p-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                          <DownloadCloud size={120} />
                       </div>
                       <h3 className="text-[#bc8cff] font-bold text-[16px] flex items-center gap-2 mb-2 z-10"><HardDrive size={18} /> Compile & Export Global Simulation Rules Registry</h3>
                       <p className="text-[#c9d1d9] text-[12px] mb-4 z-10 max-w-[80%]">Compile all Physics (Quantum, Relativity, Astro), Chemistry (Periodic Elements, Reactions), Biology (Genetics, Cellular), and Geological simulation configs into a universal serialized format (.SIM, .JSON, .H) compatible with future projects, custom engines (Unreal, Unity), or AI Generation pipelines.</p>
                       <div className="flex items-center gap-4 z-10">
                           <button onClick={() => alert("Simulations exported to .OMNISIM Global Registry successfully! All future generated games will inherit these Physical, Chemical, and Biological models.")} className="bg-[#bc8cff] hover:bg-[#a371f7] text-[#0a0a0a] font-bold uppercase tracking-wider px-6 py-3 rounded text-[12px] flex items-center gap-2 shadow-[0_0_15px_rgba(188,140,255,0.4)] transition-all transform hover:scale-105 active:scale-95">
                               <Code2 size={16} /> Export to Global Engine Registry (.OMNISIM)
                           </button>
                           <button onClick={() => alert("C++/C# Data structures saved to Virtual File System!")} className="bg-[#0d1117] hover:bg-[#161b22] text-[#bc8cff] border border-[#bc8cff]/50 font-bold uppercase tracking-wider px-6 py-3 rounded text-[12px] flex items-center gap-2 transition-colors">
                               <FileCode2 size={16} /> Generate C++ / C# Structs
                           </button>
                       </div>
                   </div>

                </div>
             </div>
           </div>
         );
               case 'GameSystems':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex Grand Systems Architect', 'Configure trillions of finite state machines, unlimited physics matrices, dynamic code bases, and universe-scale save state persistence. Current active systems: 1,000,000,000,000+', <Blocks size={28} />)}
             <div className="flex-1 overflow-auto custom-scrollbar p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                   
                   {/* Logic Node Bank */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col h-[500px] lg:h-full shadow-lg">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] bg-[#21262d] flex justify-between items-center">
                         Infinite Game & Code Providers
                         <button className="text-[#58a6ff] hover:text-white px-2 py-1 bg-[#0d1117] rounded text-[10px]">&gt;_ Compile Trillion Lines</button>
                      </div>
                      <div className="p-2 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 relative">
                         <div className="absolute top-2 right-2 bg-black/60 text-[#3fb950] font-mono text-[9px] px-2 border border-[#3fb950]/50 rounded animate-pulse">OVER 100000000000000000+ PHYSICS/CODE MODULES LOADED</div>
                         <div className="border border-[#7e56c2]/50 bg-[#7e56c2]/10 rounded p-2 text-[#c9d1d9] text-[11px] cursor-grab mt-6">
                            <span className="font-bold text-[#bc8cff]">QuestManager_Main & AI Branching (Module 1/999,999,999)</span>
                            <p className="text-[9px] text-[#8b949e]">Handles infinite progression, dynamic journal updates, and non-deterministic NPC states.</p>
                         </div>
                         <div className="border border-[#3fb950]/50 bg-[#3fb950]/10 rounded p-2 text-[#c9d1d9] text-[11px] cursor-grab">
                            <span className="font-bold text-[#3fb950]">OmniInventory_System (Module 2)</span>
                            <p className="text-[9px] text-[#8b949e]">Manages items, weight, limitless dimensionality slots, and quantum durability.</p>
                         </div>
                         <div className="border border-[#f85149]/50 bg-[#f85149]/10 rounded p-2 text-[#c9d1d9] text-[11px] cursor-grab">
                            <span className="font-bold text-[#f85149]">God-Physics_Matrix (Module 3)</span>
                            <p className="text-[9px] text-[#8b949e]">Sub-atomic collision, soft-body tear, mass-energy equivalence simulation in real-time.</p>
                         </div>
                         <div className="border border-[#58a6ff]/50 bg-[#58a6ff]/10 rounded p-2 text-[#c9d1d9] text-[11px] cursor-grab">
                            <span className="font-bold text-[#58a6ff]">Hyper-Code Architecture Gen 9 (Module 4)</span>
                            <p className="text-[9px] text-[#8b949e]">1,000,000,000+ base programming snippets, auto-compiling binary routines, memory-safe threading.</p>
                         </div>
                         
                         <div className="mt-4 border-t border-[#30363d] pt-2 flex flex-col gap-1">
                           <div className="flex items-center gap-2 p-1 text-[10px] text-[#8b949e]"><ChevronDown size={10}/>... 999,999,999,999+ Other Systems Hidden</div>
                         </div>
                      </div>
                   </div>

                   {/* Inspector */}
                   <div className="col-span-1 lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg overflow-y-auto custom-scrollbar">
                      <div className="p-4 border-b border-[#30363d] text-[14px] font-bold text-[#c9d1d9] flex justify-between items-center">
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-[#3fb950] uppercase">Selected Node</span>
                            <span className="text-[16px] text-white">OmniInventory_System</span>
                         </div>
                         <div className="flex gap-2">
                            <button className="px-3 py-1.5 border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded text-[11px]">Compile C#</button>
                            <button className="px-3 py-1.5 bg-[#58a6ff] text-[#0d1117] font-bold rounded text-[11px]">Save Prefab</button>
                         </div>
                      </div>

                      <div className="p-6 flex flex-col gap-6 text-[12px] text-[#c9d1d9]">
                         
                         {/* Properties */}
                         <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-[#58a6ff] border-b border-[#30363d] pb-2">Component Properties</h4>
                            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                               <label className="text-[#8b949e]">Inventory Type</label>
                               <select defaultValue="Slot-Based (WoW style)" className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none">
                                  <option>Grid-Based (Resident Evil style)</option>
                                  <option>Slot-Based (WoW style)</option>
                                  <option>List-Based (Skyrim style)</option>
                               </select>
                            </div>
                            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                               <label className="text-[#8b949e]">Max Slots</label>
                               <input type="number" className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-24" defaultValue="36" />
                            </div>
                            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                               <label className="text-[#8b949e]">Allow Encumbrance</label>
                               <input type="checkbox" className="accent-[#58a6ff]" defaultChecked/>
                            </div>
                            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                               <label className="text-[#8b949e]">Max Weight</label>
                               <input type="number" className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-24" defaultValue="150.0" />
                            </div>
                         </div>

                         {/* Events */}
                         <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-[#e3b341] border-b border-[#30363d] pb-2">Event Bindings</h4>
                            
                            <div className="bg-[#0d1117] border border-[#30363d] rounded p-3 flex flex-col gap-2">
                               <div className="flex justify-between items-center text-[11px] font-bold">
                                  <span className="text-[#c9d1d9]">OnItemAdded(Item item)</span>
                                  <button className="text-[#58a6ff] hover:underline">+ Add Listener</button>
                               </div>
                               <div className="flex gap-2">
                                  <select className="bg-[#161b22] border border-[#30363d] rounded p-1 outline-none text-[#bc8cff] w-1/3">
                                     <option>UIManager (Object)</option>
                                  </select>
                                  <select className="bg-[#161b22] border border-[#30363d] rounded p-1 outline-none text-[#c9d1d9] flex-1">
                                     <option>UIManager.RefreshInventoryUI</option>
                                  </select>
                                  <button className="text-[#f85149] px-2 border border-[#30363d] rounded bg-[#21262d]">X</button>
                               </div>
                               <div className="flex gap-2">
                                  <select className="bg-[#161b22] border border-[#30363d] rounded p-1 outline-none text-[#bc8cff] w-1/3">
                                     <option>SoundManager (Object)</option>
                                  </select>
                                  <select className="bg-[#161b22] border border-[#30363d] rounded p-1 outline-none text-[#c9d1d9] flex-1">
                                     <option>SoundManager.PlayPickupSound</option>
                                  </select>
                                  <button className="text-[#f85149] px-2 border border-[#30363d] rounded bg-[#21262d]">X</button>
                               </div>
                            </div>

                            <div className="bg-[#0d1117] border border-[#30363d] rounded p-3 flex flex-col gap-2">
                               <div className="flex justify-between items-center text-[11px] font-bold">
                                  <span className="text-[#c9d1d9]">OnInventoryFull()</span>
                                  <button className="text-[#58a6ff] hover:underline">+ Add Listener</button>
                               </div>
                               <div className="flex gap-2">
                                  <select className="bg-[#161b22] border border-[#30363d] rounded p-1 outline-none text-[#bc8cff] w-1/3">
                                     <option>NotificationSys (Object)</option>
                                  </select>
                                  <select className="bg-[#161b22] border border-[#30363d] rounded p-1 outline-none text-[#c9d1d9] flex-1">
                                     <option>NotificationSys.ShowErrorMsg</option>
                                  </select>
                                  <button className="text-[#f85149] px-2 border border-[#30363d] rounded bg-[#21262d]">X</button>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                </div>
             </div>
           </div>
         );
      case 'EngineCore':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex Engine Core & Architectonics', 'High-performance memory allocation, thread dispatching, and hardware scalability profiling.', <Cpu size={28} />)}
             <div className="flex-1 overflow-auto custom-scrollbar p-6">
                
                <div className="grid grid-cols-2 gap-6 h-full">

                   {/* Thread Pools & Schedulers */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] flex justify-between items-center bg-[#21262d]">
                         <span>Thread Topology & Schedulers</span>
                         <button className="text-[#58a6ff] hover:text-white px-2 py-0.5 bg-[#161b22] border border-[#30363d] rounded text-[10px]">&gt; Attach VTune Profiler</button>
                      </div>
                      <div className="p-4 flex flex-col gap-4 text-[11px] text-[#c9d1d9] overflow-y-auto custom-scrollbar">
                         <div className="flex flex-col gap-2 border border-[#30363d] rounded p-3 bg-[#0d1117] shadow-inner">
                            <div className="flex justify-between items-center font-bold text-[#58a6ff]">
                               <span className="flex items-center gap-1"><MonitorPlay size={12}/> Render (RHI) Thread</span>
                               <span>Affinity Mask: Core 0</span>
                            </div>
                            <div className="flex justify-between text-[#8b949e]">
                               <span>Thread Priority (OS Level)</span>
                               <select defaultValue="High (+1)" className="bg-[#161b22] border border-[#30363d] rounded outline-none p-1">
                                  <option>Normal (0)</option>
                                  <option>High (+1)</option>
                                  <option>Realtime / Time-Critical (+2)</option>
                               </select>
                            </div>
                            <div className="flex justify-between text-[#8b949e]">
                               <span>Command Buffer Size</span>
                               <select defaultValue="64 MB" className="bg-[#161b22] border border-[#30363d] rounded outline-none p-1">
                                  <option>16 MB</option>
                                  <option>64 MB</option>
                                  <option>256 MB (Cinematic)</option>
                               </select>
                            </div>
                         </div>

                         <div className="flex flex-col gap-2 border border-[#30363d] rounded p-3 bg-[#0d1117] shadow-inner">
                            <div className="flex justify-between items-center font-bold text-[#3fb950]">
                               <span className="flex items-center gap-1"><Workflow size={12}/> Physics & Logic Worker Pool</span>
                               <span>Active Count: <input type="number" className="bg-[#161b22] border border-[#30363d] w-12 p-1 outline-none text-center" defaultValue="6"/></span>
                            </div>
                            <div className="flex justify-between text-[#8b949e]">
                               <span>Job Stealing Algorithm</span>
                               <select defaultValue="Cilk-style" className="bg-[#161b22] border border-[#30363d] rounded outline-none p-1 w-24">
                                  <option>Cilk-style</option>
                                  <option>Lock-free FIFO</option>
                               </select>
                            </div>
                            <div className="flex justify-between text-[#8b949e]">
                               <span>Affinity Mask (Hex)</span>
                               <input type="text" className="bg-[#161b22] border border-[#30363d] rounded p-1 outline-none w-24 text-center font-mono" defaultValue="0x0F00" />
                            </div>
                         </div>

                         <div className="flex flex-col gap-2 border border-[#30363d] rounded p-3 bg-[#0d1117] shadow-inner">
                            <div className="flex justify-between items-center font-bold text-[#bc8cff]">
                               <span className="flex items-center gap-1"><Database size={12}/> Async I/O (Streaming)</span>
                               <span>Active Count: <input type="number" className="bg-[#161b22] border border-[#30363d] w-12 p-1 outline-none text-center" defaultValue="2"/></span>
                            </div>
                            <div className="flex justify-between text-[#8b949e]">
                               <span>File Decompression API</span>
                               <select defaultValue="DirectStorage/Oodle" className="bg-[#161b22] border border-[#30363d] rounded outline-none p-1 w-24">
                                  <option>Zlib (Slow)</option>
                                  <option>LZ4 (Fast)</option>
                                  <option>DirectStorage/Oodle</option>
                               </select>
                            </div>
                            <div className="flex justify-between text-[#8b949e]">
                               <span>Priority</span>
                               <select defaultValue="Normal (0)" className="bg-[#161b22] border border-[#30363d] rounded outline-none p-1 w-24">
                                  <option>Background (-1)</option>
                                  <option>Normal (0)</option>
                               </select>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Subsystem Toggles & Settings */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg overflow-hidden">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] bg-[#21262d] flex justify-between">
                         Engine Subsystem Config
                         <button className="text-[#3fb950] px-2 py-0.5 border border-[#3fb950]/50 rounded bg-[#3fb950]/10 text-[10px]">Recompile Core</button>
                      </div>
                      <div className="p-4 flex flex-col gap-6 text-[12px] text-[#c9d1d9] overflow-y-auto custom-scrollbar">

                         <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-[#ff7b72] border-b border-[#30363d] pb-2 flex items-center gap-2"><Database size={14}/> Custom Memory Allocators</h4>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e] font-bold">Garbage Collection Arch</span>
                               <select defaultValue="Incremental (Time-slicing per frame)" className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none text-[#ff7b72]">
                                  <option>Generational (Stop-the-world)</option>
                                  <option>Incremental (Time-slicing per frame)</option>
                                  <option>Manual (Require explicitly freeing)</option>
                                  <option>Arena / Bump Allocators Only</option>
                               </select>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e] font-bold">Memory Pool Sizes</span>
                               <button className="bg-[#21262d] px-2 py-1 border border-[#30363d] rounded text-[10px] hover:bg-[#30363d]">Configure 8 Heaps...</button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                               <div className="bg-[#050505] border border-[#30363d] p-2 rounded flex flex-col items-center">
                                  <span className="text-[9px] uppercase tracking-wider text-[#8b949e]">Global Heap</span>
                                  <span className="font-mono font-bold text-[#c9d1d9]">1024 MB</span>
                               </div>
                               <div className="bg-[#050505] border border-[#30363d] p-2 rounded flex flex-col items-center">
                                  <span className="text-[9px] uppercase tracking-wider text-[#8b949e]">Frame Linear</span>
                                  <span className="font-mono font-bold text-[#c9d1d9]">16 MB</span>
                               </div>
                               <div className="bg-[#050505] border border-[#30363d] p-2 rounded flex flex-col items-center">
                                  <span className="text-[9px] uppercase tracking-wider text-[#8b949e]">Physics Arena</span>
                                  <span className="font-mono font-bold text-[#c9d1d9]">128 MB</span>
                               </div>
                               <div className="bg-[#050505] border border-[#30363d] p-2 rounded flex flex-col items-center">
                                  <span className="text-[9px] uppercase tracking-wider text-[#8b949e]">Audio DSP</span>
                                  <span className="font-mono font-bold text-[#c9d1d9]">32 MB</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-[#e3b341] border-b border-[#30363d] pb-2 flex items-center gap-2"><Cpu size={14}/> Hardware Scalability & Legacy Targets</h4>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e] font-bold">Instruction Set Target</span>
                               <select defaultValue="Modern (AVX2, FMA3)" className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none text-[#e3b341]">
                                  <option>Universal (Multi-Arch binaries)</option>
                                  <option>Modern (AVX2, FMA3)</option>
                                  <option>Legacy / Potato (SSE4.2 max)</option>
                               </select>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e] font-bold">Pipelined Execution Mode</span>
                               <select defaultValue="Staged: CPU &rarr; RAM &rarr; NPU &rarr; GPU" className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none text-[#e3b341] w-48">
                                  <option>Fully Asynchronous (Stutters on Legacy)</option>
                                  <option>Staged: CPU &rarr; RAM &rarr; NPU &rarr; GPU</option>
                               </select>
                            </div>
                            <div className="bg-[#e3b341]/10 border border-[#e3b341]/50 p-2 rounded">
                              <p className="text-[10px] text-[#e3b341] italic leading-tight">
                                Staged pipeline execution guarantees smooth frametimes on very old PCs by completing CPU routines fully before RAM loads, bypassing modern asynchronous bottlenecks that older OS task schedulers fail to prioritize properly.
                              </p>
                            </div>
                            <div className="flex justify-between items-center mt-2 border-t border-[#30363d] pt-2">
                               <span className="text-[#8b949e] font-bold">Hard Limit System RAM</span>
                               <select defaultValue="8 GB (Normal Desktop)" className="bg-[#0d1117] border border-[#30363d] rounded p-1 outline-none max-w-[120px]">
                                  <option>1-2 GB (Aggressive Pagefile)</option>
                                  <option>4 GB (Minimum Target)</option>
                                  <option>8 GB (Normal Desktop)</option>
                                  <option>16 GB+ (Uncapped Pool)</option>
                               </select>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e] font-bold">Hard Limit Direct VRAM</span>
                               <select defaultValue="4 GB (Standard Console)" className="bg-[#0d1117] border border-[#30363d] rounded p-1 outline-none max-w-[120px]">
                                  <option>512 MB (Barebone 2D only)</option>
                                  <option>2 GB (Aggressive Texture Mips)</option>
                                  <option>4 GB (Standard Console)</option>
                                  <option>8 GB+ (High Res Cinematic)</option>
                               </select>
                            </div>
                         </div>
                         
                         <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-[#bc8cff] border-b border-[#30363d] pb-2 flex items-center gap-2"><Eye size={14}/> Profiling Telemetry</h4>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Runtime Frame Profiler Overlay</span>
                               <input type="checkbox" className="accent-[#bc8cff]" defaultChecked/>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Dump Memory Leaks on Exit (JSON)</span>
                               <input type="checkbox" className="accent-[#bc8cff]" defaultChecked/>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Trace Deadlocks (Performance Hit)</span>
                               <input type="checkbox" className="accent-[#bc8cff]"/>
                            </div>
                         </div>

                      </div>
                   </div>

                </div>
             </div>
           </div>
         );
      case 'GraphicsRender':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex Render Pipeline & Graphics', 'Advanced path-tracing, real-time GI, optical lenses, and micro-polygon geometry.', <MonitorPlay size={28} />)}
             <div className="flex-1 overflow-auto custom-scrollbar p-6">
                
                <div className="grid grid-cols-[300px_1fr] gap-6 h-full">

                   {/* Graphics Settings Tree */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg overflow-hidden shrink-0">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] bg-[#21262d]">Pipeline Configuration</div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col text-[11px] text-[#c9d1d9] pb-4">
                         <div className="p-2 border-b border-[#30363d] cursor-pointer bg-[#58a6ff]/10 text-[#58a6ff] border-l-2 border-l-[#58a6ff] font-bold">Hardware & Hardware Accelerators</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Quality Profiles & Scalability</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Micro-Polygon (Nanite) Engine</div>
                         
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] font-bold mt-2">Raytracing & Path Tracing</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Hardware RT Shadows</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">RT Reflections & Caustics</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Path-Traced Global Illumination</div>
                         
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] font-bold mt-2">Volumetrics & Atmosphere</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Volumetric Fog & Light Shafts</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Rayleigh & Mie Scattering</div>
                         
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] font-bold mt-2">Post Processing & Optics</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Color Grading (3D LUTs)</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Cinematic Depth of Field</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Chromatic Aberration</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Film Grain & Vignette</div>
                      </div>
                   </div>

                   {/* Main Settings Panel */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg overflow-hidden">
                      <div className="p-4 border-b border-[#30363d] flex justify-between items-center text-[#c9d1d9]">
                         <div className="flex gap-2 items-center">
                            <Sliders size={18} className="text-[#58a6ff]"/>
                            <span className="font-bold text-[14px]">Advanced Rendering & Shader Limits</span>
                         </div>
                         <div className="flex gap-2">
                           <button className="px-3 py-1 bg-[#21262d] border border-[#30363d] text-[#c9d1d9] font-bold rounded text-[11px] hover:bg-[#30363d]">Discard</button>
                           <button className="px-3 py-1 bg-[#238636] text-white font-bold rounded text-[11px] border border-[#2ea043] hover:bg-[#2ea043]">Recompile Shaders</button>
                         </div>
                      </div>

                      <div className="p-6 flex flex-col gap-8 text-[12px] text-[#c9d1d9] overflow-y-auto custom-scrollbar">
                         
                         {/* Path Tracing & Global Illumination */}
                         <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-[#bc8cff] border-b border-[#30363d] pb-2 flex items-center gap-2"><Sparkles size={16}/> Path Tracing & Hardware Raytracing</h4>
                            
                            <div className="grid grid-cols-[250px_1fr] items-center gap-4">
                               <label className="text-[#8b949e] font-bold">Raytracing API Framework</label>
                               <select defaultValue="Hardware RT (DXR 1.2 / Vulkan RT)" className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-2/3 cursor-pointer text-[#bc8cff]">
                                  <option>Software RT (Compute Shaders)</option>
                                  <option>Hardware RT (DXR 1.2 / Vulkan RT)</option>
                                  <option>Neural Path Tracing (DLSS-RR)</option>
                               </select>
                            </div>
                            
                            <div className="grid grid-cols-[250px_1fr] items-center gap-4">
                               <label className="text-[#8b949e] font-bold">Global Illumination Bounces</label>
                               <div className="flex items-center gap-4 w-2/3">
                                  <input type="range" min="1" max="16" defaultValue="4" className="w-full accent-[#bc8cff]"/>
                                  <span className="font-mono text-[#bc8cff] bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px] text-center w-12">4</span>
                               </div>
                            </div>

                            <div className="grid grid-cols-[250px_1fr] items-center gap-4">
                               <label className="text-[#8b949e] font-bold">Reflection Bounces</label>
                               <div className="flex flex-col gap-1 w-2/3">
                                 <div className="flex items-center gap-4">
                                    <input type="range" min="1" max="8" defaultValue="2" className="w-full accent-[#58a6ff]"/>
                                    <span className="font-mono text-[#58a6ff] bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px] text-center w-12">2</span>
                                 </div>
                                 <span className="text-[10px] text-[#8b949e] italic">Higher bounces allow mirrors reflecting mirrors, but exponentially costs VRAM.</span>
                               </div>
                            </div>
                            
                            <div className="grid grid-cols-[250px_1fr] items-center gap-4">
                               <label className="text-[#8b949e] font-bold">Ray-Traced Caustics (Water/Glass)</label>
                               <input type="checkbox" className="accent-[#bc8cff]" defaultChecked/>
                            </div>
                         </div>

                         {/* Micro-Polygon Virtualized Geometry */}
                         <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-[#3fb950] border-b border-[#30363d] pb-2 flex items-center gap-2"><Layers size={16}/> Virtualized Micro-Polygon Geometry</h4>
                            
                            <div className="grid grid-cols-[250px_1fr] items-center gap-4">
                               <label className="text-[#8b949e] font-bold">Hardware Tessellation Mode</label>
                               <select defaultValue="Continuous Virtual Geometry (Nanite-like)" className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-2/3 cursor-pointer text-[#3fb950]">
                                  <option>Disabled (LODs only)</option>
                                  <option>Adaptive Distance Tessellation</option>
                                  <option>Continuous Virtual Geometry (Nanite-like)</option>
                               </select>
                            </div>

                            <div className="grid grid-cols-[250px_1fr] items-center gap-4">
                               <label className="text-[#8b949e] font-bold">Max Sub-Pixel Target</label>
                               <input type="number" step="0.1" defaultValue="1.0" className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-24 text-center font-mono text-[#3fb950]" title="Target pixel size per triangle. 1.0 means extremely high detail." />
                            </div>
                         </div>

                         {/* Advanced Optics & Camera Limits */}
                         <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-[#e3b341] border-b border-[#30363d] pb-2 flex items-center gap-2"><Video size={16}/> Cinematic Physical Camera & Optics</h4>
                            
                            <div className="grid grid-cols-[250px_1fr] items-center gap-4">
                               <label className="text-[#8b949e] font-bold">Depth of Field (Bokeh Shape)</label>
                               <select defaultValue="Octagonal (8-blade Anamorphic)" className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-2/3 cursor-pointer text-[#e3b341]">
                                  <option>Circular (Standard)</option>
                                  <option>Hexagonal (6-blade aperture)</option>
                                  <option>Octagonal (8-blade Anamorphic)</option>
                               </select>
                            </div>

                            <div className="grid grid-cols-[250px_1fr] items-center gap-4">
                               <label className="text-[#8b949e] font-bold">Chromatic Aberration Spread</label>
                               <div className="flex items-center gap-4 w-2/3">
                                  <input type="range" min="0" max="5" step="0.1" defaultValue="1.5" className="w-full accent-[#e3b341]"/>
                                  <span className="font-mono text-[#e3b341] bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px] text-center w-12">1.5px</span>
                               </div>
                            </div>
                            
                            <div className="grid grid-cols-[250px_1fr] items-center gap-4">
                               <label className="text-[#8b949e] font-bold">Film Grain Intensity (ISO Noise)</label>
                               <div className="flex items-center gap-4 w-2/3">
                                  <input type="range" min="0" max="1" step="0.01" defaultValue="0.15" className="w-full accent-[#e3b341]"/>
                                  <span className="font-mono text-[#e3b341] bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px] text-center w-12">0.15</span>
                               </div>
                            </div>
                         </div>

                         {/* Atmosphere & Volumetrics */}
                         <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-[#58a6ff] border-b border-[#30363d] pb-2 flex items-center gap-2"><Wind size={16}/> Atmosphere & Volumetrics</h4>
                            
                            <div className="grid grid-cols-[250px_1fr] items-center gap-4">
                               <label className="text-[#8b949e] font-bold">Volumetric Fog Voxel Grid</label>
                               <select defaultValue="256 x 256 x 128 (High)" className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-2/3 cursor-pointer text-[#58a6ff]">
                                  <option>64 x 64 x 64</option>
                                  <option>128 x 128 x 128</option>
                                  <option>256 x 256 x 128 (High)</option>
                                  <option>512 x 512 x 256 (Cinematic)</option>
                               </select>
                            </div>
                            
                            <div className="grid grid-cols-[250px_1fr] items-center gap-4">
                               <label className="text-[#8b949e] font-bold">Rayleigh / Mie Scattering Sim</label>
                               <input type="checkbox" className="accent-[#58a6ff]" defaultChecked/>
                            </div>
                         </div>

                      </div>
                   </div>

                </div>
             </div>
           </div>
         );
      case 'AnimationAudio':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex Motion & Skeleton Studio', 'Professional keyframing, rigging, and audio sync with local AI MoCap pipelines.', <Activity size={28} />)}
             <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Skeleton Hierarchy & Media */}
                <div className="w-[280px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                   <div className="p-3 border-b border-[#30363d] text-[11px] font-bold text-[#c9d1d9] uppercase tracking-wider flex justify-between">
                      Project Data
                      <FolderTree size={12} className="text-[#8b949e]" />
                   </div>
                   
                   {/* Skeleton Tree */}
                   <div className="flex flex-col">
                      <div className="px-3 py-2 bg-[#21262d] border-b border-[#30363d] text-[11px] font-bold text-[#58a6ff] flex items-center gap-2">
                         <Bone size={12}/> Skeleton Hierarchy
                      </div>
                      <div className="p-2 flex flex-col gap-1 text-[11px] text-[#8b949e] font-mono">
                         <div className="flex items-center gap-1 hover:text-white cursor-pointer"><ChevronRight size={10}/> root</div>
                         <div className="flex items-center gap-1 hover:text-white cursor-pointer pl-3"><ChevronDown size={10}/> pelvis</div>
                         <div className="flex items-center gap-1 hover:text-white cursor-pointer pl-6 bg-[#bc8cff]/10 text-[#bc8cff]"><ChevronRight size={10}/> spine_01</div>
                         <div className="flex items-center gap-1 hover:text-white cursor-pointer pl-9"><ChevronRight size={10}/> spine_02</div>
                         <div className="flex items-center gap-1 hover:text-white cursor-pointer pl-6"><ChevronRight size={10}/> thigh_L</div>
                         <div className="flex items-center gap-1 hover:text-white cursor-pointer pl-6"><ChevronRight size={10}/> thigh_R</div>
                      </div>
                   </div>

                   {/* Media Pool */}
                   <div className="flex flex-col border-t border-[#30363d]">
                      <div className="px-3 py-2 bg-[#21262d] border-b border-[#30363d] text-[11px] font-bold text-[#e3b341] flex items-center gap-2">
                         <Mic size={12}/> Audio & References
                      </div>
                      <div className="p-2 flex flex-col gap-2">
                         <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 flex justify-between items-center text-[10px]">
                            <span className="text-[#c9d1d9] flex-1 truncate"><Video size={10} className="inline mr-1 text-[#8b949e]"/> mocap_reference.mp4</span>
                            <Play size={10} className="text-[#3fb950] cursor-pointer"/>
                         </div>
                         <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 flex justify-between items-center text-[10px]">
                            <span className="text-[#c9d1d9] flex-1 truncate"><Music size={10} className="inline mr-1 text-[#8b949e]"/> dialog_01.wav</span>
                            <Play size={10} className="text-[#3fb950] cursor-pointer"/>
                         </div>
                         <button className="bg-[#21262d] text-[#8b949e] border border-[#30363d] border-dashed hover:text-white hover:border-[#8b949e] rounded text-[10px] py-1 text-center">+ Import Media</button>
                      </div>
                   </div>
                </div>

                {/* Center Panel: Viewport & Timeline */}
                <div className="flex-1 bg-[#050505] flex flex-col relative overflow-hidden">
                   {/* Top Viewport Toolbar */}
                   <div className="h-10 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 shrink-0 shadow-md">
                     <div className="flex items-center gap-2">
                        <select className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] text-[11px] px-2 py-1 rounded outline-none">
                           <option>Pose Mode</option>
                           <option>Edit Mode</option>
                           <option>Object Mode</option>
                        </select>
                        <div className="flex items-center gap-1 bg-[#0a0a0a] rounded border border-[#30363d] p-0.5 text-[11px]">
                           <button className="px-2 py-1 text-[#8b949e] hover:text-white rounded cursor-pointer" title="Auto Keyframe">Auto-K</button>
                           <button className="px-2 py-1 bg-[#bc8cff]/20 text-[#bc8cff] rounded cursor-pointer border border-[#bc8cff]/50" title="Ghosts/Onion Skinning"><Ghost size={12} className="inline mr-1"/>Onion</button>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#8b949e]">Frame: <span className="text-white font-mono">145</span></span>
                     </div>
                   </div>

                   {/* 3D Viewport Canvas Area */}
                   <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                     {/* Background Grid */}
                     <div className="absolute inset-0 bg-[#0d1117] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'rotateX(60deg) scale(2)', transformOrigin: 'top center' }}></div>
                     
                     {/* Mock Skeleton */}
                     <div className="relative w-[300px] h-[500px] flex items-center justify-center filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                        <PersonStanding size={250} className="text-[#30363d]" strokeWidth={1} style={{ transform: 'rotate(-5deg)' }}/>
                        <div className="absolute w-full h-full inset-0">
                           <div className="absolute top-[20%] left-[50%] w-3 h-3 bg-[#f85149] rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#f85149]"></div>
                           <div className="absolute top-[40%] left-[50%] w-3 h-3 bg-[#58a6ff] rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#58a6ff]"></div>
                           <div className="absolute top-[55%] left-[50%] w-4 h-4 border-2 border-[#3fb950] rounded transform -translate-x-1/2 -translate-y-1/2 bg-[#3fb950]/20 shadow-[0_0_10px_#3fb950]"></div>
                        </div>
                     </div>
                   </div>

                   {/* Timeline / Dopesheet / Graph Editor */}
                   <div className="h-[250px] bg-[#0d1117] border-t border-[#30363d] flex flex-col shrink-0">
                      {/* Timeline Header */}
                      <div className="h-8 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between">
                         <div className="flex gap-4 items-center">
                            <span className="text-[11px] font-bold text-[#c9d1d9]"><Waypoints size={12} className="inline mr-1 text-[#f85149]"/> Dopesheet & Graph</span>
                            <div className="flex items-center gap-1 bg-[#0a0a0a] rounded border border-[#30363d] p-0.5 text-[11px]">
                               <button className="px-2 py-0.5 hover:bg-[#21262d] text-[#8b949e] hover:text-white rounded">Dopesheet</button>
                               <button className="px-2 py-0.5 bg-[#21262d] text-white rounded">Graph Editor</button>
                            </div>
                         </div>
                         <div className="flex gap-2">
                           <button className="text-[#8b949e] hover:text-white"><Rewind size={14}/></button>
                           <button className="text-[#3fb950] hover:text-[#56d364]"><Play size={14}/></button>
                           <button className="text-[#8b949e] hover:text-white"><Pause size={14}/></button>
                           <button className="text-[#8b949e] hover:text-white"><FastForward size={14}/></button>
                         </div>
                      </div>
                      {/* Graph Area Mock */}
                      <div className="flex-1 relative overflow-hidden bg-[#0a0a0a]">
                         <div className="absolute left-[50px] inset-y-0 right-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                         
                         {/* Playhead */}
                         <div className="absolute top-0 bottom-0 left-[250px] w-[1px] bg-[#58a6ff] z-10 shadow-[0_0_5px_#58a6ff]"></div>
                         
                         {/* Keyframes layer left */}
                         <div className="absolute top-0 bottom-0 left-0 w-[150px] bg-[#161b22] border-r border-[#30363d] flex flex-col font-mono text-[9px] text-[#8b949e]">
                            <div className="py-1 px-2 border-b border-[#30363d] flex justify-between"><span className="text-[#f85149]">Location X</span></div>
                            <div className="py-1 px-2 border-b border-[#30363d] flex justify-between"><span className="text-[#3fb950]">Location Y</span></div>
                            <div className="py-1 px-2 border-b border-[#30363d] flex justify-between"><span className="text-[#58a6ff]">Location Z</span></div>
                            <div className="py-1 px-2 border-b border-[#30363d] flex justify-between"><span className="text-[#e3b341]">Rotation Z</span></div>
                         </div>

                         {/* Splines Mock */}
                         <svg className="absolute top-0 bottom-0 left-[150px] w-full h-full overflow-visible opacity-80" viewBox="0 0 1000 200" preserveAspectRatio="none">
                            <path d="M 0,50 C 100,50 200,150 300,100 C 400,50 500,20 600,80" fill="none" stroke="#f85149" strokeWidth="2" />
                            <path d="M 0,100 C 50,150 150,150 250,50 C 350,-50 450,100 550,100" fill="none" stroke="#3fb950" strokeWidth="2" />
                            <circle cx="100" cy="50" r="4" fill="#f85149"/>
                            <circle cx="300" cy="100" r="4" fill="#f85149"/>
                            <circle cx="250" cy="50" r="4" fill="#3fb950"/>
                         </svg>
                      </div>
                   </div>
                </div>

                {/* Right Panel: Rig Properties & Offline AI MoCap */}
                <div className="w-[320px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                   
                   {/* Manual Rig Tools */}
                   <div className="p-3 border-b border-[#30363d] text-[11px] font-bold text-[#c9d1d9] uppercase tracking-wider flex items-center gap-1">
                      <Wrench size={12}/> Manual Controls & IK
                   </div>
                   <div className="p-4 flex flex-col gap-4 border-b border-[#30363d] bg-[#0d1117]">
                      <div className="flex flex-col gap-2">
                         <span className="text-[11px] font-bold text-[#bc8cff]">Bone Transform (spine_01)</span>
                         <div className="grid grid-cols-[30px_1fr_1fr_1fr] gap-1 items-center text-[10px]">
                            <span className="text-[#8b949e] text-right pr-2">Loc</span>
                            <input type="text" className="bg-[#0a0a0a] border border-[#30363d] rounded px-1.5 py-1 text-white text-center" defaultValue="0 m" />
                            <input type="text" className="bg-[#0a0a0a] border border-[#30363d] rounded px-1.5 py-1 text-white text-center" defaultValue="1.2 m" />
                            <input type="text" className="bg-[#0a0a0a] border border-[#30363d] rounded px-1.5 py-1 text-white text-center" defaultValue="0 m" />
                         </div>
                         <div className="grid grid-cols-[30px_1fr_1fr_1fr] gap-1 items-center text-[10px]">
                            <span className="text-[#8b949e] text-right pr-2">Rot</span>
                            <input type="text" className="bg-[#0a0a0a] border border-[#30363d] rounded px-1.5 py-1 text-white text-center" defaultValue="-15°" />
                            <input type="text" className="bg-[#0a0a0a] border border-[#30363d] rounded px-1.5 py-1 text-white text-center" defaultValue="0°" />
                            <input type="text" className="bg-[#0a0a0a] border border-[#30363d] rounded px-1.5 py-1 text-white text-center" defaultValue="0°" />
                         </div>
                      </div>

                      <div className="flex flex-col gap-2">
                         <span className="text-[11px] font-bold text-[#3fb950]">IK Solvers / Constraints</span>
                         <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col gap-1 text-[10px]">
                            <div className="flex justify-between items-center text-[#c9d1d9] font-bold mb-1">
                               <span>FABRIK Solver - Hand.L</span>
                               <span className="text-[#f85149] cursor-pointer">X</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Target</span>
                               <span className="bg-[#0a0a0a] px-2 py-0.5 rounded border border-[#30363d] text-white">IK_Target_Hand_L</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                               <span className="text-[#8b949e]">Influence</span>
                               <input type="range" className="w-[100px] accent-[#3fb950]" min="0" max="100" defaultValue="100" />
                            </div>
                         </div>
                         <button className="w-full py-1 text-center bg-[#21262d] border border-[#30363d] text-[#c9d1d9] text-[10px] rounded hover:bg-[#30363d] font-bold">+ Add Constraint</button>
                      </div>
                   </div>

                   {/* Offline AI Studio */}
                   <div className="flex-1 bg-[#161b22]">
                      <div className="p-3 bg-[#e3b341]/5 flex flex-col gap-3 h-full">
                         <div className="flex items-center justify-between text-[11px] font-bold text-[#e3b341]">
                            <span className="flex items-center gap-1.5"><Cpu size={14}/> OFFLINE AI STUDIO</span>
                            <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" title="Tensor Compute Online"></div>
                         </div>

                         {/* AI Video to MoCap */}
                         <div className="bg-[#21262d] border border-[#30363d] rounded p-3 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[10px] font-bold text-[#c9d1d9]">
                               <span className="flex items-center gap-1"><Video size={12} className="text-[#bc8cff]"/> AI Video to MoCap</span>
                            </div>
                            <div className="text-[9px] text-[#8b949e] leading-tight">Extract full-body skeletal animation from standard 2D video entirely offline.</div>
                            
                            <select className="bg-[#0d1117] border border-[#30363d] text-[10px] p-1.5 rounded text-[#c9d1d9] outline-none">
                               <option>Target Rig: MetaHuman Base</option>
                               <option>Target Rig: Mixamo</option>
                               <option>Target Rig: Custom UE5 Rig</option>
                            </select>
                            
                            <div className="flex items-center gap-2 text-[9px] text-[#c9d1d9]">
                               <input type="checkbox" className="accent-[#bc8cff]" defaultChecked/> Extract Hands & Fingers
                            </div>
                            <button className="w-full bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/50 font-bold text-[10px] py-1.5 rounded hover:bg-[#bc8cff]/30 shadow-inner">Bake Video to Keyframes</button>
                         </div>

                         {/* AI Lip-Sync & Audio Features */}
                         <div className="bg-[#21262d] border border-[#30363d] rounded p-3 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[10px] font-bold text-[#c9d1d9]">
                               <span className="flex items-center gap-1"><AudioWaveform size={12} className="text-[#f85149]"/> Offline Audio Lip-Sync</span>
                            </div>
                            <div className="text-[9px] text-[#8b949e] leading-tight">Automatically map audio visemes to morph targets / blendshapes locally.</div>
                            <select className="bg-[#0d1117] border border-[#30363d] text-[10px] p-1.5 rounded text-[#c9d1d9] outline-none">
                               <option>Source: dialog_01.wav</option>
                            </select>
                            <button className="w-full bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/50 font-bold text-[10px] py-1.5 rounded hover:bg-[#f85149]/30 shadow-inner">Generate Blendshape Keys</button>
                         </div>

                         {/* AI Keyframe Cleanup */}
                         <div className="bg-[#21262d] border border-[#30363d] rounded p-3 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[10px] font-bold text-[#c9d1d9]">
                               <span className="flex items-center gap-1"><Sparkles size={12} className="text-[#3fb950]"/> AI Keyframe Reduction</span>
                            </div>
                            <div className="text-[9px] text-[#8b949e] leading-tight">Use neural decimation to clean up noisy MoCap data while preserving fluidity.</div>
                            <button className="w-full bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50 font-bold text-[10px] py-1.5 rounded hover:bg-[#3fb950]/30 shadow-inner">Despike & Smooth Motion</button>
                         </div>

                      </div>
                   </div>
                </div>

             </div>
           </div>
         );
      case 'BackendCloud':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Network, Cloud & Multiplayer', 'Matchmaking, DB, Leaderboards, Sync, and Export handling.', <Cloud size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1">
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <div className="bg-[#161b22] border border-[#30363d] p-3 rounded flex flex-col">
                    <div className="text-[#c9d1d9] text-[12px] font-bold border-b border-[#30363d] pb-1 mb-2 flex justify-between items-center">Multiplayer <Network size={14}/></div>
                    <ul className="text-[11px] text-[#8b949e] space-y-1">
                      <li>• Server / Client Architect</li>
                      <li>• Player Tick Data Sync</li>
                      <li>• Matchmaking Lobbies</li>
                      <li>• Cross-platform / Crossplay</li>
                    </ul>
                 </div>
                 <div className="bg-[#161b22] border border-[#30363d] p-3 rounded flex flex-col">
                    <div className="text-[#c9d1d9] text-[12px] font-bold border-b border-[#30363d] pb-1 mb-2 flex justify-between items-center">Database & Services <Database size={14}/></div>
                    <ul className="text-[11px] text-[#8b949e] space-y-1">
                      <li>• JWT Login / Accounts</li>
                      <li>• Cloud Save & Progression</li>
                      <li>• Game Economy Systems</li>
                      <li>• Global Leaderboards</li>
                    </ul>
                 </div>
                 <div className="bg-[#161b22] border border-[#30363d] p-3 rounded flex flex-col">
                    <div className="text-[#c9d1d9] text-[12px] font-bold border-b border-[#30363d] pb-1 mb-2 flex justify-between items-center">Deployment <CloudCog size={14}/></div>
                    <ul className="text-[11px] text-[#8b949e] space-y-1">
                      <li>• Export to PC/Mobile/Console</li>
                      <li>• Auto Upload to Steam/Play</li>
                      <li>• Cloud Gaming Ready Stream</li>
                      <li>• Update Patch Gen & Sync</li>
                    </ul>
                 </div>
               </div>

               {/* Simulated Database Configuration */}
               <div className="bg-[#161b22] border border-[#30363d] rounded p-4 flex flex-col gap-3">
                 <h3 className="text-[#c9d1d9] text-[13px] font-bold border-b border-[#30363d] pb-2 flex items-center gap-2"><Database size={16} className="text-[#e3b341]"/> Simulated Server Database (SQL)</h3>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                       <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Database Engine</label>
                       <select className="bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-[11px] text-[#c9d1d9] outline-none">
                          <option>SQLite (Ultra-Low Memory, Local)</option>
                          <option>MySQL (Standard Lightweight)</option>
                          <option>PostgreSQL (Heavy, Relational)</option>
                          <option>MongoDB (NoSQL, Document)</option>
                       </select>
                    </div>
                    <div className="flex flex-col gap-1">
                       <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Connection Max Pools</label>
                       <input type="number" defaultValue="10" className="bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-[11px] text-[#c9d1d9] outline-none" />
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">ORM Data Mapping Strategy</label>
                    <select className="bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-[11px] text-[#58a6ff] outline-none">
                       <option>Raw SQL Queries (Lowest Overhead/Fastest)</option>
                       <option>Prisma ORM (Balanced)</option>
                       <option>TypeORM (Heavy Framework)</option>
                    </select>
                    <span className="text-[10px] text-[#8b949e] italic mt-1">If deploying to a highly constrained legacy server (15+ Years Old), prioritize "SQLite" and "Raw SQL Queries" to save RAM.</span>
                 </div>
               </div>

               {/* Supreme Logic Script Controller */}
               <div className="bg-[#161b22] border border-[#30363d] rounded p-4 flex flex-col gap-3">
                 <h3 className="text-[#c9d1d9] text-[13px] font-bold border-b border-[#30363d] pb-2 flex items-center gap-2"><FileCode2 size={16} className="text-[#bc8cff]"/> Extreme Detail Scene Scripting Engine</h3>
                 <p className="text-[11px] text-[#8b949e]">Micro-manage every single detail instantiated by the server before distributing to clients. This allows logic scripts to define shadow types, alarm queues, light intensity limits, and max concurrent physics bodies per scene.</p>
                 
                 <div className="flex flex-col gap-2 p-3 bg-[#0d1117] rounded border border-[#30363d] font-mono text-[10px]">
                    <div className="text-[#ff7b72]">class <span className="text-[#d2a8ff]">LevelDescriptorScript</span> {'{'}</div>
                    <div className="pl-4 text-[#8b949e]">// Enforce extreme server-level limits per scene</div>
                    <div className="pl-4 text-[#c9d1d9]">maxGlobalShadowCasters: <span className="text-[#79c0ff]">12</span>,</div>
                    <div className="pl-4 text-[#c9d1d9]">volumetricFogResolution: <span className="text-[#a5d6ff]">'Low'</span>,</div>
                    <div className="pl-4 text-[#c9d1d9]">entityAlarmAggroLimits: <span className="text-[#79c0ff]">5</span>,</div>
                    <div className="pl-4 text-[#c9d1d9]">globalLightBouncePasses: <span className="text-[#79c0ff]">0</span>, <span className="text-[#8b949e]">// Save server calculations</span></div>
                    <div className="text-[#ff7b72]">{'}'}</div>
                 </div>
                 
                 <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] text-[11px] font-bold py-1.5 rounded transition-colors w-max px-4">Open Matrix Editor</button>
               </div>

               <div className="bg-[#0d1117] border border-[#58a6ff]/30 p-4 rounded text-[12px] flex flex-col gap-1 mt-auto">
                 <span className="font-bold text-[#58a6ff] flex items-center gap-2"><TrendingUp size={16}/> LiveOps Analytics Platform</span>
                 <span className="text-[#8b949e] text-[11px]">Track player behavior, retention rates, drop-offs, and dynamically adjust game balance via hot over-the-air patches without full redeploys.</span>
               </div>
             </div>
           </div>
         );
      case 'AITestingQA':
         return (
           <AITestingQAPanel renderHeader={renderHeader} />
         );
      case 'Niagara':
         return (
           <>
             {renderHeader('Niagara Particle FX', 'Next-gen node-based VFX system. Create fire, smoke, magic, and fluid simulations.', <Sparkles size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="flex gap-4 h-[350px]">
                 <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg relative overflow-hidden flex items-center justify-center">
                    {/* Simulated Particle Sparkles */}
                    <div className="absolute inset-0 bg-[#0d1117] flex items-center justify-center">
                       <div className="relative w-32 h-32 flex justify-center items-center">
                         <div className="absolute w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_20px_10px_rgba(251,146,60,0.8)] animate-ping"></div>
                         <div className="absolute w-1 h-1 bg-yellow-300 rounded-full shadow-[0_0_15px_5px_rgba(253,224,71,0.9)] animate-pulse" style={{ transform: 'translate(20px, -30px)' }}></div>
                         <div className="absolute w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_25px_8px_rgba(239,68,68,0.8)] animate-bounce" style={{ transform: 'translate(-30px, 10px)' }}></div>
                         <div className="absolute w-3 h-3 bg-orange-500/50 rounded-full blur-md" style={{ transform: 'translate(10px, 20px)' }}></div>
                       </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-[#3fb950]">Sprite Render: 12,504 Particles</div>
                 </div>
                 <div className="w-[300px] bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex flex-col gap-4">
                    <h3 className="text-[#c9d1d9] text-[13px] font-bold uppercase tracking-wider border-b border-[#30363d] pb-2">Emitter Settings</h3>
                    <div className="flex flex-col gap-2">
                       <span className="text-[11px] text-[#8b949e]">Spawn Rate</span>
                       <input type="range" className="w-full" defaultValue="80" />
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[11px] text-[#8b949e]">Wind Velocity</span>
                       <div className="flex gap-2">
                         <input type="number" className="w-1/3 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-1" defaultValue="0" />
                         <input type="number" className="w-1/3 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-1" defaultValue="0" />
                         <input type="number" className="w-1/3 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-1" defaultValue="150" />
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[11px] text-[#8b949e]">Gravity Modifier</span>
                       <input type="range" min="-1" max="1" step="0.1" className="w-full" defaultValue="-0.2" />
                    </div>
                    <div className="mt-auto">
                       <button className="w-full mt-2 bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] py-1.5 rounded font-bold text-[12px] transition-colors">Compile Emitter</button>
                    </div>
                 </div>
               </div>
             </div>
           </>
         );
      case 'PCG':
         return (
           <div className="flex flex-col h-full bg-[#030509]">
             {renderHeader('Ecliptic PCG Network', 'Stochastic neural generation, infinite bio-habitats, and fractal scattering.', <Workflow size={28} className="text-[#3fb950]" />)}
             <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                 {/* Left Panel: Realtime Density Map */}
                 <div className="bg-[#0f1118] border border-[#30363d] rounded-lg p-5 flex flex-col relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Globe size={100}/></div>
                   <h3 className="font-bold text-[#c9d1d9] flex items-center gap-2 border-b border-[#30363d] pb-2 shrink-0">
                      <MapIcon size={14} className="text-[#58a6ff]"/> Topographic Neural Filter
                   </h3>
                   <div className="flex-1 mt-4 relative border border-[#3fb950]/30 rounded overflow-hidden">
                      {/* Grid overlay */}
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PG1hdGggZD0iTTAgMGg0MHY0MEgwenIiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMCAzdjM0bTQwLTRWM000IDBoMzJtLTMyIDQwaDMyIiBzdHJva2U9IiMzZmI5NTAiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')]"></div>
                      
                      {/* Generative shapes animated */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-[#3fb950]/20 to-[#bc8cff]/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#58a6ff]/30 blur-2xl rounded-full"></div>
                      
                      {/* Spline Path */}
                      <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_5px_#3fb950]">
                         <path d="M 50 250 C 100 150, 200 100, 300 200 S 500 50, 600 150" fill="transparent" stroke="#3fb950" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
                         <circle cx="50" cy="250" r="4" fill="#3fb950" />
                         <circle cx="300" cy="200" r="4" fill="#3fb950" />
                         <circle cx="600" cy="150" r="4" fill="#3fb950" />
                      </svg>
                      {/* Overlay Stats */}
                      <div className="absolute bottom-2 left-2 bg-[#0a0a0a]/80 backdrop-blur border border-[#30363d] p-2 rounded text-[10px] font-mono text-[#8b949e]">
                         <div>Seed: 0x9F4A2B99</div>
                         <div>Biome: Boreal Transition</div>
                         <div className="text-[#3fb950]">Yield: 1.4M Instances</div>
                      </div>
                   </div>
                 </div>

                 {/* Right Panel: Logic Graph */}
                 <div className="bg-[#0f1118] border border-[#30363d] rounded-lg p-5 flex flex-col relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Network size={100}/></div>
                   <h3 className="font-bold text-[#c9d1d9] flex items-center gap-2 border-b border-[#30363d] pb-2 shrink-0">
                      <Settings size={14} className="text-[#bc8cff]"/> Operator Chain
                   </h3>
                   <div className="flex-1 mt-4 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
                      {/* Node mockups vertically */}
                      <div className="bg-[#161b22] border-l-2 border-[#e3b341] border-y border-r border-[#30363d] p-3 rounded flex justify-between items-center relative">
                         <div className="flex flex-col">
                            <span className="text-[#c9d1d9] font-bold text-[12px]">Get Spline Data</span>
                            <span className="text-[#8b949e] font-mono text-[9px] uppercase">Input Component</span>
                         </div>
                         <span className="bg-[#e3b341]/10 text-[#e3b341] font-mono text-[10px] px-2 py-0.5 rounded">V:2</span>
                         <div className="absolute -bottom-3 left-6 w-0.5 h-3 bg-[#e3b341]/50"></div>
                      </div>

                      <div className="bg-[#161b22] border-l-2 border-[#58a6ff] border-y border-r border-[#30363d] p-3 rounded flex flex-col gap-2 relative mt-2">
                         <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                               <span className="text-[#c9d1d9] font-bold text-[12px]">Surface Sampler</span>
                               <span className="text-[#8b949e] font-mono text-[9px] uppercase">Generator</span>
                            </div>
                            <span className="bg-[#58a6ff]/10 text-[#58a6ff] font-mono text-[10px] px-2 py-0.5 rounded">0.05ms</span>
                         </div>
                         <div className="flex items-center justify-between text-[10px] font-mono bg-[#0d1117] p-1.5 rounded border border-[#30363d]">
                            <span className="text-[#8b949e]">Points/Sqm</span>
                            <span className="text-white">4.5</span>
                         </div>
                         <div className="absolute -bottom-3 left-6 w-0.5 h-3 bg-[#58a6ff]/50"></div>
                      </div>

                      <div className="bg-[#161b22] border-l-2 border-[#bc8cff] border-y border-r border-[#30363d] p-3 rounded flex flex-col gap-2 relative mt-2">
                         <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                               <span className="text-[#c9d1d9] font-bold text-[12px]">Density Noise Filter</span>
                               <span className="text-[#8b949e] font-mono text-[9px] uppercase">Math Transform</span>
                            </div>
                            <span className="bg-[#bc8cff]/10 text-[#bc8cff] font-mono text-[10px] px-2 py-0.5 rounded">Perlin 3D</span>
                         </div>
                         <div className="absolute -bottom-3 left-6 w-0.5 h-3 bg-[#bc8cff]/50"></div>
                      </div>

                      <div className="bg-[#161b22] border-l-2 border-[#3fb950] border-y border-r border-[#30363d] p-3 rounded flex flex-col gap-2 relative mt-2">
                         <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                               <span className="text-[#c9d1d9] font-bold text-[12px]">Static Mesh Spawner</span>
                               <span className="text-[#8b949e] font-mono text-[9px] uppercase">Output Stage</span>
                            </div>
                            <span className="bg-[#3fb950]/10 text-[#3fb950] font-mono text-[10px] px-2 py-0.5 rounded">ACTOR</span>
                         </div>
                         <div className="flex flex-col text-[10px] font-mono bg-[#0a0a0a] border border-[#3fb950]/30 rounded mt-1 overflow-hidden">
                            <div className="flex justify-between px-2 py-1 border-b border-[#30363d]"><span className="text-[#8b949e]">Mesh[0]</span><span className="text-[#3fb950]">SM_Pine_Large (1.2M)</span></div>
                            <div className="flex justify-between px-2 py-1 border-b border-[#30363d]"><span className="text-[#8b949e]">Mesh[1]</span><span className="text-[#3fb950]">SM_Pine_Dead (300K)</span></div>
                            <div className="flex justify-between px-2 py-1"><span className="text-[#8b949e]">Collisions</span><span className="text-[#ff7b72]">Complex As Simple</span></div>
                         </div>
                      </div>
                   </div>
                 </div>
               </div>
               
               <div className="flex justify-end mt-auto gap-4">
                  <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded p-3 flex justify-between items-center">
                     <div className="flex flex-col font-mono text-[11px]">
                        <span className="text-[#8b949e] uppercase">Status</span>
                        <span className="text-[#3fb950] font-bold animate-pulse">Generation Complete</span>
                     </div>
                     <div className="flex flex-col font-mono text-[11px] text-right">
                        <span className="text-[#8b949e] uppercase">Compute Time</span>
                        <span className="text-[#c9d1d9] font-bold">14.2 seconds</span>
                     </div>
                  </div>
                  <button className="px-8 py-3 bg-[#3fb950] hover:bg-[#2ea043] text-white font-bold tracking-widest uppercase rounded shadow-[0_0_15px_rgba(63,185,80,0.4)] hover:shadow-[0_0_25px_rgba(63,185,80,0.6)] transition-all">
                     Open PCG Blueprint Graph
                  </button>
               </div>
             </div>
             
             <style>{`
                @keyframes dash {
                   to {
                     stroke-dashoffset: -1000;
                   }
                }
             `}</style>
           </div>
         );
      case 'ControlRig':
         return (
           <>
             {renderHeader('Character & Rigging (Control Rig)', 'Forward/Inverse Kinematics setup, bone assignments, and facial blendshapes.', <PersonStanding size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="grid grid-cols-3 gap-4">
                 <div className="bg-[#161b22] border border-[#30363d] rounded p-4 flex flex-col gap-2">
                    <h3 className="text-[#c9d1d9] font-bold text-[13px] border-b border-[#30363d] pb-1">Hierarchy</h3>
                    <div className="text-[11px] font-mono text-[#8b949e] space-y-1">
                      <div><FolderTree size={10} className="inline mr-1"/> root</div>
                      <div className="ml-4"><FolderTree size={10} className="inline mr-1"/> pelvis</div>
                      <div className="ml-8"><FolderTree size={10} className="inline mr-1"/> spine_01</div>
                      <div className="ml-12"><FolderTree size={10} className="inline mr-1"/> spine_02</div>
                      <div className="ml-16 text-[#58a6ff]"><FolderTree size={10} className="inline mr-1"/> neck_01</div>
                      <div className="ml-20"><FolderTree size={10} className="inline mr-1"/> head</div>
                    </div>
                 </div>
                 <div className="col-span-2 bg-[#0d1117] border border-[#30363d] rounded relative flex items-center justify-center overflow-hidden h-[300px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent"></div>
                    <PersonStanding size={150} className="text-[#e3b341] opacity-50 relative z-10" />
                    
                    {/* Mock bones overlay */}
                    <div className="absolute top-[80px] w-4 h-4 rounded-full border-2 border-[#f85149] z-20 shadow-[0_0_10px_2px_rgba(248,81,73,0.5)]"></div>
                    <div className="absolute top-[130px] right-[100px] w-3 h-3 rounded-sm border-2 border-[#58a6ff] z-20"></div>
                 </div>
               </div>
               <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded flex items-center justify-between text-[12px] text-[#8b949e]">
                 <span>Current Solver: <strong className="text-[#c9d1d9]">Full Body IK (FBIK)</strong></span>
                 <button className="bg-[#238636] text-white px-3 py-1 rounded">Bake to Animation</button>
               </div>
               
               {/* AI Rigging */}
               <div className="bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] shadow-lg rounded p-4">
                 <h3 className="text-[#bc8cff] font-bold text-[14px] mb-2 flex items-center gap-2"><Bot size={16}/> AI Control Rig Generator</h3>
                 <div className="flex flex-col gap-3">
                   <div>
                     <label className="text-[11px] text-[#8b949e]">Rig Prompt (Specify morphology, structure):</label>
                     <textarea className="w-full bg-[#161b22] border border-[#30363d] rounded p-2 text-white text-[12px] h-16 outline-none resize-none mt-1" placeholder="e.g. Generate a spider rig with 8 legs, multi-segmented abdomen, and IK setups on all foot effectors."></textarea>
                   </div>
                   <div className="flex gap-4">
                     <div className="flex items-center gap-2">
                       <input type="checkbox" className="accent-[#bc8cff]" defaultChecked />
                       <span className="text-[11px] text-[#c9d1d9]">Generate FK Controls</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <input type="checkbox" className="accent-[#bc8cff]" defaultChecked />
                       <span className="text-[11px] text-[#c9d1d9]">Generate IK Solvers</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <input type="checkbox" className="accent-[#bc8cff]" />
                       <span className="text-[11px] text-[#c9d1d9]">Facial Blendshapes Setup</span>
                     </div>
                   </div>
                   <button className="bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 py-2 rounded text-[12px] font-bold tracking-wider flex items-center justify-center gap-2">
                     <Sparkles size={14}/> Generate Structure & Rig
                   </button>
                 </div>
               </div>

             </div>
           </>
         );
      case 'MetaHuman':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('MetaHuman Creator Offline', 'Next-generation digital human generator with strand-based hair and ARKit facial tracking.', <UserSquare size={28} />)}
             <div className="flex-1 p-6 overflow-auto custom-scrollbar flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6 h-full min-h-[400px]">
                   <div className="bg-[#0d1117] border border-[#3f3f3f] rounded relative overflow-hidden flex items-center justify-center">
                       {/* Placeholder for Face render */}
                       <div className="absolute inset-0 bg-[#000]"></div>
                       <UserSquare size={200} className="text-[#58a6ff] opacity-40" />
                       <div className="absolute bottom-4 right-4 bg-[#161b22]/80 border border-[#30363d] px-2 py-1 text-[10px] font-mono text-[#c9d1d9] rounded backdrop-blur">
                          LOD 0 (Cinematic) | 120k tris | Groom: 50k strands
                       </div>
                   </div>

                   <div className="flex flex-col gap-4 bg-[#161b22] p-4 border border-[#30363d] rounded shadow-lg overflow-y-auto">
                      <h4 className="text-[#c9d1d9] font-bold border-b border-[#30363d] pb-2 text-[13px] uppercase tracking-wider">DNA Blending</h4>
                      <div className="flex flex-col gap-3">
                         <div className="flex justify-between items-center text-[11px] text-[#8b949e]">
                            <span>Base Archetype</span>
                            <select defaultValue="Caucasian Male Early-30s" className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded p-1">
                               <option>Asian Female Mid-20s</option>
                               <option>Caucasian Male Early-30s</option>
                               <option>African Female 40s</option>
                               <option>Custom DNA Import</option>
                            </select>
                         </div>
                         
                         <div className="flex flex-col gap-1 text-[11px] text-[#8b949e]">
                            <div className="flex justify-between pt-2"><span>Nasal Bridge Depth</span><span className="text-[#58a6ff]">-0.4</span></div>
                            <input type="range" className="accent-[#58a6ff]" defaultValue="-0.4" min="-1" max="1" step="0.1"/>
                         </div>

                         <div className="flex flex-col gap-1 text-[11px] text-[#8b949e]">
                            <div className="flex justify-between pt-2"><span>Jawline Width</span><span className="text-[#58a6ff]">0.8</span></div>
                            <input type="range" className="accent-[#58a6ff]" defaultValue="0.8" min="-1" max="1" step="0.1"/>
                         </div>
                         
                         <h4 className="text-[#c9d1d9] font-bold border-b border-[#30363d] pb-2 text-[13px] uppercase tracking-wider mt-4">Skin & Textures</h4>
                         <div className="flex justify-between items-center text-[11px] text-[#8b949e]">
                            <span>Melanin Base</span>
                            <div className="w-2/3 h-3 bg-gradient-to-r from-red-200 via-orange-400 to-amber-900 rounded border border-[#30363d] relative">
                               <div className="absolute top-0 bottom-0 w-1 bg-white left-[30%] shadow-[0_0_5px_0_white]"></div>
                            </div>
                         </div>
                         
                         <div className="flex justify-between items-center text-[11px] text-[#8b949e]">
                            <span>Pore Detail Normal Strength</span>
                            <input type="range" className="accent-[#bc8cff] w-24" defaultValue="0.8" min="0" max="1" step="0.1"/>
                         </div>

                         <div className="flex justify-between items-center text-[11px] text-[#8b949e]">
                            <span>Micro-Freckles Generation</span>
                            <input type="checkbox" className="accent-[#bc8cff]" defaultChecked/>
                         </div>

                      </div>
                   </div>
                </div>
             </div>
           </div>
         );
      case 'ScriptEditor':
         return <ScriptEditor />;
      case 'BuildPublish':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('One-Click Build & Pipeline', 'Configure platform targets, graphics scaling, and one-click compiling.', <Globe2 size={28} />)}
             <div className="flex-1 overflow-auto custom-scrollbar p-6">
                <div className="grid grid-cols-2 gap-6">
                   
                   {/* Build Profiles */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] flex justify-between items-center bg-[#21262d]">
                         <span>Build Target Profiles</span>
                         <button className="text-[#3fb950] px-2 py-0.5 bg-[#161b22] border border-[#30363d] rounded text-[10px]">&gt; Start Pre-Build</button>
                      </div>
                      <div className="p-4 flex flex-col gap-4 text-[11px] text-[#c9d1d9]">
                         
                         <div className="flex flex-col gap-2 border border-[#30363d] rounded p-3 bg-[#0d1117] shadow-inner relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-1 bg-[#3fb950]/10 text-[#3fb950] text-[9px] font-bold rounded-bl border-b border-l border-[#3fb950]/30 hidden group-hover:block">ACTIVE</div>
                            <div className="flex justify-between items-center font-bold text-[#58a6ff]">
                               <span className="flex items-center gap-2"><Globe2 size={14}/> WebGL / Browser</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                               <span className="text-[#8b949e]">Graphics Quality Override</span>
                               <select defaultValue="Half Graphics (50% Scaling)" className="bg-[#161b22] border border-[#30363d] rounded text-[10px] p-1 text-[#ff7b72] outline-none">
                                  <option>Max Engine Settings</option>
                                  <option>Half Graphics (50% Scaling)</option>
                                  <option>Potato (No Shadows/PostFX)</option>
                               </select>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">WASM Streaming</span>
                               <input type="checkbox" className="accent-[#58a6ff]" defaultChecked/>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Target Device</span>
                               <span className="text-[#c9d1d9] font-mono text-[10px]">Mobile + Desktop Browsers</span>
                            </div>
                         </div>

                         <div className="flex flex-col gap-2 border border-[#30363d] rounded p-3 bg-[#0d1117] shadow-inner cursor-pointer hover:border-[#bc8cff]/50 transition-colors">
                            <div className="flex justify-between items-center font-bold text-[#bc8cff]">
                               <span className="flex items-center gap-2"><MonitorPlay size={14}/> PC / Steam (Windows)</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                               <span className="text-[#8b949e]">Graphics Quality Override</span>
                               <select defaultValue="Maximum Graphics (100%)" className="bg-[#161b22] border border-[#30363d] rounded text-[10px] p-1 text-[#3fb950] outline-none border-[#3fb950]/50">
                                  <option>Maximum Graphics (100%)</option>
                                  <option>Dynamic (DLSS/FSR)</option>
                               </select>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">API Choice</span>
                               <select className="bg-[#161b22] border border-[#30363d] rounded text-[10px] p-1 outline-none">
                                  <option>DirectX 12 Ultimate</option>
                                  <option>Vulkan 1.3</option>
                               </select>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Steamworks Integration</span>
                               <input type="checkbox" className="accent-[#bc8cff]" defaultChecked/>
                            </div>
                         </div>

                      </div>
                   </div>

                   {/* Hardware Optimization Check */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#e3b341] bg-[#21262d] flex items-center gap-2">
                         <Cpu size={14} /> Hardware Pre-Flight Checks
                      </div>
                      <div className="p-4 flex flex-col gap-4 text-[11px] text-[#c9d1d9] overflow-y-auto">
                         <p className="text-[10px] text-[#8b949e] italic leading-relaxed">
                            Pipeline sequence is managed strictly: CPU &rarr; RAM &rarr; NPU &rarr; GPU.<br/>
                            Ensures legacy compatibility for 15+ year old machines.
                         </p>

                         <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center border-b border-[#30363d] pb-1">
                               <span className="font-bold flex items-center gap-1 text-[#ff7b72]"><Cpu size={12}/> CPU Allocation</span>
                               <span className="text-[#c9d1d9] font-mono text-[10px]">Loaded 1st</span>
                            </div>
                            <p className="text-[#8b949e] text-[10px]">Pre-calculating rigidbodies, matrix transforms, and routing game logic to avoid stalls.</p>
                         </div>

                         <div className="flex flex-col gap-2 mt-2">
                            <div className="flex justify-between items-center border-b border-[#30363d] pb-1">
                               <span className="font-bold flex items-center gap-1 text-[#58a6ff]"><Database size={12}/> RAM Constraints</span>
                               <span className="text-[#c9d1d9] font-mono text-[10px]">Loaded 2nd</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Minimum Memory Ceiling</span>
                               <span className="font-mono text-[#3fb950] font-bold">4 GB Max</span>
                            </div>
                            <p className="text-[#8b949e] text-[10px]">Forcing aggressive garbage collection to fit in ultra-low memory setups.</p>
                         </div>

                         <div className="flex flex-col gap-2 mt-2">
                            <div className="flex justify-between items-center border-b border-[#30363d] pb-1">
                               <span className="font-bold flex items-center gap-1 text-[#bc8cff]"><Bot size={12}/> AI / NPU Dispatch</span>
                               <span className="text-[#c9d1d9] font-mono text-[10px]">Loaded 3rd</span>
                            </div>
                            <p className="text-[#8b949e] text-[10px]">Executing NPC decision trees and Guard patrol routes directly on NPU if available, else fallback to CPU.</p>
                         </div>

                         <div className="flex flex-col gap-2 mt-2">
                            <div className="flex justify-between items-center border-b border-[#30363d] pb-1">
                               <span className="font-bold flex items-center gap-1 text-[#3fb950]"><MonitorPlay size={12}/> GPU / VRAM Upload</span>
                               <span className="text-[#c9d1d9] font-mono text-[10px]">Loaded 4th</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">VRAM Target</span>
                               <span className="font-mono text-[#e3b341] font-bold">1-2 GB Target</span>
                            </div>
                            <p className="text-[#8b949e] text-[10px]">Texture mip-maps limited. Final rendering instructions only sent after CPU/RAM are stable to prevent bottlenecks.</p>
                         </div>
                         
                         <button className="mt-2 w-full bg-[#3fb950]/10 hover:bg-[#3fb950]/20 border border-[#3fb950]/50 text-[#3fb950] font-bold py-2 rounded text-[11px] transition-colors">
                            Run Full Hardware Validation
                         </button>

                      </div>
                   </div>

                </div>
             </div>
           </div>
         );

      case 'AssetPipeline':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Asset Pipeline & Source Control', 'Auto-LOD Generation, Git integration, and Texture Compression pipelines.', <FolderTree size={28} />)}
             <div className="flex-1 overflow-auto custom-scrollbar p-6">
                <div className="grid grid-cols-2 gap-6 h-full">
                   {/* Version Control */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] bg-[#21262d] flex justify-between items-center">
                         <span>Source Control (Git / Perforce)</span>
                         <button className="text-[#58a6ff] hover:text-white px-2 py-0.5 bg-[#161b22] border border-[#30363d] rounded text-[10px]">Sync Origin</button>
                      </div>
                      <div className="p-4 flex flex-col gap-4 text-[11px] text-[#c9d1d9]">
                         <div className="flex flex-col gap-2 p-3 bg-[#0d1117] border border-[#30363d] rounded shadow-inner">
                            <div className="flex justify-between items-center font-bold text-[#3fb950] border-b border-[#30363d] pb-2">
                               <span><Network size={12} className="inline mr-1"/> Current Branch: feature/combat-rework</span>
                               <span className="text-[#8b949e]">2 commits ahead</span>
                            </div>
                            <div className="flex flex-col gap-1 mt-1">
                               <div className="flex justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                  <span className="text-[#c9d1d9]">Updated PlayerActor.cpp physics impulses</span>
                                  <span className="text-[#8b949e] font-mono text-[9px]">4m ago</span>
                               </div>
                               <div className="flex justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                  <span className="text-[#c9d1d9]">Merge branch 'main' into feature/combat</span>
                                  <span className="text-[#8b949e] font-mono text-[9px]">2h ago</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex justify-between items-center border border-[#30363d] rounded p-2 bg-[#050505]">
                            <span className="text-[#8b949e]">Lock Binary Assets (Perforce Style)</span>
                            <input type="checkbox" className="accent-[#58a6ff]" defaultChecked/>
                         </div>
                         <div className="flex justify-between items-center border border-[#30363d] rounded p-2 bg-[#050505]">
                            <span className="text-[#8b949e]">Auto-Resolve Blueprint Conflicts</span>
                            <input type="checkbox" className="accent-[#58a6ff]" defaultChecked/>
                         </div>
                      </div>
                   </div>

                   {/* Generative Assets & Auto-LOD */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#e3b341] bg-[#21262d] flex items-center gap-2">
                         <Layers size={14}/> Geometry Auto-LOD & Compression
                      </div>
                      <div className="p-4 flex flex-col gap-4 text-[11px] text-[#c9d1d9]">
                         
                         <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Global Auto-LOD Generation</span>
                               <select defaultValue="Balanced" className="bg-[#0d1117] border border-[#30363d] rounded p-1 outline-none">
                                  <option>Aggressive (Saves Memory)</option>
                                  <option>Balanced</option>
                                  <option>Cinematic (High Poly)</option>
                               </select>
                            </div>
                            <div className="p-3 border border-[#30363d] rounded bg-[#0d1117] flex gap-2 overflow-x-auto custom-scrollbar">
                               <div className="flex flex-col items-center gap-1 min-w-max p-2 bg-[#161b22] rounded border border-[#30363d]">
                                  <span className="text-[#ff7b72] font-mono font-bold">LOD 0</span>
                                  <Box size={24} className="text-[#c9d1d9]"/>
                                  <span className="text-[9px] text-[#8b949e]">100% Tris</span>
                               </div>
                               <div className="flex flex-col items-center gap-1 min-w-max p-2 bg-[#161b22] rounded border border-[#30363d]">
                                  <span className="text-[#e3b341] font-mono font-bold">LOD 1</span>
                                  <Box size={20} className="text-[#c9d1d9] opacity-80"/>
                                  <span className="text-[9px] text-[#8b949e]">50% Tris</span>
                               </div>
                               <div className="flex flex-col items-center gap-1 min-w-max p-2 bg-[#161b22] rounded border border-[#30363d]">
                                  <span className="text-[#3fb950] font-mono font-bold">LOD 2</span>
                                  <Box size={16} className="text-[#c9d1d9] opacity-60"/>
                                  <span className="text-[9px] text-[#8b949e]">25% Tris</span>
                               </div>
                               <div className="flex flex-col items-center gap-1 min-w-max p-2 bg-[#161b22] rounded border border-[#30363d]">
                                  <span className="text-[#58a6ff] font-mono font-bold">LOD 3</span>
                                  <Box size={12} className="text-[#c9d1d9] opacity-40"/>
                                  <span className="text-[9px] text-[#8b949e]">Imposter</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="h-[1px] bg-[#30363d] w-full"></div>
                         
                         <div className="flex flex-col gap-2">
                            <span className="font-bold text-[#bc8cff] flex items-center gap-2"><ImageIcon size={12}/> Texture Streaming Pipeline</span>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Max Diffuse Resolution</span>
                               <select defaultValue="4096x4096 (HQ)" className="bg-[#0d1117] border border-[#30363d] rounded p-1 outline-none text-[#bc8cff]">
                                  <option>1024x1024</option>
                                  <option>2048x2048 (4K downsample)</option>
                                  <option>4096x4096 (HQ)</option>
                                  <option>8192x8192 (Film)</option>
                               </select>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Texture Compression</span>
                               <select defaultValue="BC7 (DX11+)" className="bg-[#0d1117] border border-[#30363d] rounded p-1 outline-none">
                                  <option>BC7 (DX11+)</option>
                                  <option>ASTC (Mobile Target)</option>
                               </select>
                            </div>
                         </div>

                      </div>
                   </div>

                </div>
             </div>
           </div>
         );

      case 'MetaSound':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('MetaSound & Advanced Audio Mixer', 'Interactive audio graph, DSP effects, Voice/BGM buses, and acoustic occlusion occlusion.', <Music size={28} />)}
             <div className="flex-1 overflow-auto custom-scrollbar p-6">
                <div className="flex flex-col gap-6">
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg p-4">
                      <h4 className="font-bold text-[#e3b341] border-b border-[#30363d] pb-2 flex items-center gap-2 mb-4"><Sliders size={14}/> Audio Routing Buses (Hardware Accelerated)</h4>
                      <div className="grid grid-cols-4 gap-4">
                         {['Master', 'SFX', 'BGM', 'Voice/Dialogue'].map((bus, i) => (
                           <div key={i} className="flex flex-col gap-2 p-3 bg-[#0d1117] border border-[#30363d] rounded items-center">
                              <span className="text-[11px] font-bold text-[#c9d1d9]">{bus}</span>
                              <div className="w-4 h-32 bg-[#21262d] rounded-full relative overflow-hidden flex items-end">
                                 <div className="w-full bg-gradient-to-t from-[#3fb950] via-[#e3b341] to-[#ff7b72]" style={{height: `${80 - i*15}%`}}></div>
                              </div>
                              <span className="font-mono text-[#8b949e] text-[9px]">{ `-${i * 2}.5 dB` }</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                      <div className="bg-[#161b22] border border-[#30363d] p-4 rounded shadow-lg flex flex-col gap-3">
                         <h4 className="font-bold text-[#bc8cff] border-b border-[#30363d] pb-2"><Settings2 size={14} className="inline mr-2"/> DSP & Acoustic Environment</h4>
                         <div className="flex justify-between items-center text-[11px] text-[#c9d1d9]">
                            <span>Global Reverb Type</span>
                            <select defaultValue="Open Forest / Field" className="bg-[#0d1117] border border-[#30363d] rounded p-1 outline-none text-[#bc8cff]">
                               <option>Cave / Large Hall</option>
                               <option>Open Forest / Field</option>
                               <option>Small Concrete Room</option>
                            </select>
                         </div>
                         <div className="flex justify-between items-center text-[11px] text-[#c9d1d9]">
                            <span>Geometry Acoustic Occlusion</span>
                            <input type="checkbox" className="accent-[#bc8cff]" defaultChecked/>
                         </div>
                         <div className="flex justify-between items-center text-[11px] text-[#c9d1d9]">
                            <span>HRTF (Spatial 3D Audio)</span>
                            <input type="checkbox" className="accent-[#bc8cff]" defaultChecked/>
                         </div>
                      </div>
                      
                      <div className="bg-[#161b22] border border-[#30363d] p-4 rounded shadow-lg flex flex-col gap-3">
                         <h4 className="font-bold text-[#58a6ff] border-b border-[#30363d] pb-2"><Activity size={14} className="inline mr-2"/> Dynamic Music System</h4>
                         <div className="flex justify-between items-center text-[11px] text-[#c9d1d9]">
                            <span>Combat Aggro Parameter</span>
                            <input type="range" className="accent-[#58a6ff] w-24" defaultValue="0"/>
                         </div>
                         <div className="flex justify-between items-center text-[11px] text-[#c9d1d9]">
                            <span>Transition Crossfade (ms)</span>
                            <input type="number" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-16 outline-none text-center" defaultValue="1500"/>
                         </div>
                         <div className="text-[10px] text-[#8b949e] italic mt-2">Links directly to NPC "Combat Watch Dist" and Player Health Blueprint hooks.</div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
         );

      case 'BlueprintGen':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('AI Blueprint/Logic Generator', 'Generate node graphs and script structures from natural language.', <Network size={28} />)}
             <div className="flex-1 flex flex-col p-6 items-center justify-center">
               <div className="w-full max-w-2xl bg-[#161b22] border border-[#30363d] shadow-2xl rounded-xl p-8 flex flex-col items-center">
                 <Bot size={48} className="text-[#bc8cff] mb-4" />
                 <h2 className="text-[#c9d1d9] text-xl font-bold mb-2">Prompt-to-Blueprint</h2>
                 <p className="text-[#8b949e] text-sm text-center mb-6">Describe the game logic you want to implement. The AI will output a fully connected Blueprint Node Graph, identifying required variables and event triggers.</p>
                 <textarea className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#bc8cff] p-4 text-white rounded-lg h-32 outline-none resize-none transition-colors mb-4" placeholder="e.g. When the player enters a trigger volume, wait 2 seconds, play a sound, and spawn an explosion array..."></textarea>
                 <button className="w-full bg-gradient-to-r from-[#bc8cff]/20 to-[#58a6ff]/20 hover:from-[#bc8cff]/30 hover:to-[#58a6ff]/30 text-white border border-[#bc8cff]/50 py-3 rounded-lg font-bold tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all">
                   <Sparkles size={18} className="text-[#bc8cff]" /> Generate Logic Graph
                 </button>
               </div>
             </div>
           </div>
         );

      case 'Blueprint':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Visual Scripting / Blueprint Editor', 'Node-based logic with execution pins, variables, and pure functions.', <Workflow size={28} />)}
             <div className="flex-1 flex overflow-hidden">
                <div className="w-[280px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
                   <div className="p-2 border-b border-[#30363d] text-[11px] font-bold text-[#c9d1d9] flex justify-between items-center">
                     <span>My Blueprint</span>
                     <Settings2 size={12}/>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-3 text-[11px] text-[#c9d1d9] font-mono">
                      <div className="flex flex-col gap-1">
                         <div className="flex justify-between items-center text-[#8b949e] font-sans font-bold uppercase text-[9px]">Graphs <Plus size={10}/></div>
                         <div className="flex items-center gap-2 pl-2 py-1 bg-[#21262d] rounded cursor-pointer text-white"> <Network size={12} className="text-[#3fb950]"/> EventGraph</div>
                         <div className="flex items-center gap-2 pl-2 py-1 hover:bg-[#21262d] rounded cursor-pointer"> <Network size={12} className="text-[#58a6ff]"/> ConstructionScript</div>
                      </div>
                      <div className="flex flex-col gap-1">
                         <div className="flex justify-between items-center text-[#8b949e] font-sans font-bold uppercase text-[9px]">Functions <Plus size={10}/></div>
                         <div className="flex items-center gap-2 pl-2 py-1 hover:bg-[#21262d] rounded cursor-pointer"> <Variable size={12} className="text-[#bc8cff]"/> CalculateDamage</div>
                      </div>
                      <div className="flex flex-col gap-1 border-t border-[#30363d] pt-2">
                         <div className="flex justify-between items-center text-[#8b949e] font-sans font-bold uppercase text-[9px]">Variables <Plus size={10}/></div>
                         <div className="flex items-center justify-between pl-2 hover:bg-[#21262d] py-0.5 rounded cursor-pointer">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#f85149]"></div> Health</div>
                            <div className="w-3 h-1.5 rounded-full bg-[#3fb950] opacity-50" title="Public Visible"></div>
                         </div>
                         <div className="flex items-center justify-between pl-2 hover:bg-[#21262d] py-0.5 rounded cursor-pointer">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-[#58a6ff]"></div> PlayerName</div>
                            <div className="w-3 h-1.5 rounded-full bg-[#3fb950] opacity-50"></div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex-1 relative bg-[#0d1117] overflow-hidden">
                   <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                   
                   {/* Node 1: Event BeginPlay */}
                   <div className="absolute top-[10%] left-[10%] w-[180px] bg-[#1c1c1c] rounded-md border border-[#30363d] shadow-lg flex flex-col overflow-hidden">
                      <div className="bg-gradient-to-r from-[#f85149] to-[#802a26] px-2 py-1 flex items-center gap-2 font-bold text-white text-[11px]">
                         <Activity size={14}/> Event BeginPlay
                      </div>
                      <div className="p-2 flex flex-col gap-2">
                         <div className="flex justify-end relative h-4">
                            <div className="absolute right-[-14px] top-1 w-3 h-3 border-2 border-white rounded-full bg-transparent flex items-center justify-center after:content-[''] after:w-1 after:h-1 after:bg-white after:rounded-full"></div>
                         </div>
                      </div>
                   </div>

                   {/* Connection Line */}
                   <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white" fill="none">
                      <path d="M 180 80 C 220 80, 220 180, 260 180" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]" />
                   </svg>

                   {/* Node 2: Print String */}
                   <div className="absolute top-[20%] left-[30%] w-[200px] bg-[#1c1c1c] rounded-md border border-[#30363d] shadow-lg flex flex-col overflow-hidden">
                      <div className="bg-gradient-to-r from-[#1f6feb] to-[#113875] px-2 py-1 flex items-center gap-2 font-bold text-white text-[11px]">
                         <Code2 size={14}/> Print String
                      </div>
                      <div className="p-2 flex flex-col gap-2 relative">
                         <div className="flex justify-between relative h-4 items-center mb-1">
                            <div className="absolute left-[-14px] w-3 h-3 border-2 border-white rounded-full bg-transparent flex items-center justify-center after:content-[''] after:w-1 after:h-1 after:bg-white after:rounded-full"></div>
                            <div className="absolute right-[-14px] w-3 h-3 border-2 border-white rounded-full bg-transparent flex items-center justify-center after:content-[''] after:w-1 after:h-1 after:bg-white after:rounded-full"></div>
                         </div>
                         <div className="flex items-center gap-2 ml-2">
                            <div className="w-2 h-2 bg-[#bc8cff] rounded-full absolute left-[-6px]"></div>
                            <span className="text-[10px] text-[#c9d1d9] mr-2">In String</span>
                            <input type="text" className="bg-[#0a0a0a] border border-[#333] rounded px-1 w-20 text-[10px] text-[#bc8cff]" defaultValue="Hello World" />
                         </div>
                         <div className="flex items-center gap-2 ml-2">
                            <div className="w-2 h-2 bg-[#f85149] rounded-full absolute left-[-6px]"></div>
                            <span className="text-[10px] text-[#c9d1d9] mr-2">Print to Screen</span>
                            <input type="checkbox" defaultChecked className="accent-[#f85149]" />
                         </div>
                      </div>
                   </div>

                </div>
                
                <div className="w-[300px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0">
                   <div className="p-2 border-b border-[#30363d] text-[11px] font-bold text-[#c9d1d9] uppercase tracking-wider">Details</div>
                   <div className="p-3 flex flex-col gap-3 text-[11px] text-[#c9d1d9]">
                      <div className="flex flex-col gap-1">
                         <span className="text-[#8b949e]">Variable Name</span>
                         <input type="text" className="bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-1 outline-none" defaultValue="Health" />
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[#8b949e]">Variable Type</span>
                         <select className="bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-1 outline-none">
                            <option>Float (Single Precision)</option>
                            <option>Integer</option>
                            <option>Boolean</option>
                            <option>String</option>
                         </select>
                      </div>
                      <div className="flex flex-col gap-1 border-t border-[#30363d] pt-2">
                         <span className="text-[#8b949e]">Default Value</span>
                         <input type="text" className="bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-1 outline-none text-[#58a6ff]" defaultValue="100.0" />
                      </div>
                   </div>
                </div>
             </div>
           </div>
         );
      
      // =========================================================
      // GDevelop / Code.org (Game Lab) / Construct Style LogicVisual
      // =========================================================
      case 'LogicVisual':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Event Sheet Logic', 'Visual condition-action scripting similar to GDevelop & Construct 3.', <Blocks size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               {/* Left Panel: Event Sheets & AI Auto-Complete */}
               <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
                  <div className="p-3 border-b border-[#30363d] flex items-center justify-between">
                     <span className="text-[#c9d1d9] font-bold text-[12px]">Event Sheets</span>
                     <Plus size={14} className="text-[#8b949e] cursor-pointer hover:text-white" />
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                     <div className="px-2 py-1.5 bg-[#238636]/20 text-[#3fb950] border border-[#3fb950]/30 rounded text-[12px] flex items-center gap-2 cursor-pointer font-bold">
                        <FileCode2 size={12}/> Player_Controller_Events
                     </div>
                     <div className="px-2 py-1.5 text-[#8b949e] hover:bg-[#21262d] rounded text-[12px] flex items-center gap-2 cursor-pointer">
                        <FileCode2 size={12}/> Global_GameManager
                     </div>
                     <div className="px-2 py-1.5 text-[#8b949e] hover:bg-[#21262d] rounded text-[12px] flex items-center gap-2 cursor-pointer">
                        <FileCode2 size={12}/> EnemyAI_FSM
                     </div>

                     {/* AI Offline Event Generator */}
                     <div className="mt-8 p-3 bg-[#0d1117] border border-[#bc8cff]/30 shadow-lg rounded">
                        <div className="flex items-center gap-2 text-[#bc8cff] font-bold text-[12px] mb-2"><Bot size={14}/> AI Event Sheet Scripter</div>
                        <p className="text-[10px] text-[#8b949e] mb-3">Offline AI can parse natural language and auto-populate Event-Action rows.</p>
                        <textarea className="w-full bg-[#0a0a0a] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[11px] h-20 outline-none resize-none mb-2" placeholder="e.g. When Player health < 0, play death animation, wait 3 seconds, then restart layout."></textarea>
                        <button className="w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 border border-[#bc8cff]/30 text-[#bc8cff] font-bold py-1.5 rounded text-[11px] flex justify-center items-center gap-2">
                           <Sparkles size={12}/> Generate Events
                        </button>
                     </div>
                  </div>
               </div>

               {/* Right Panel: The Event Sheet Canvas */}
               <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto custom-scrollbar p-6">
                 {/* Event Block 1 */}
                 <div className="bg-[#161b22] border border-[#30363d] rounded-lg mb-4 overflow-hidden flex shadow-lg">
                    {/* Condition side */}
                    <div className="w-1/2 border-r border-[#30363d] bg-gradient-to-r from-[#161b22] to-[#0d1117] flex flex-col">
                       <div className="px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
                          <span className="text-[#e3b341] font-bold text-[12px] uppercase">Condition</span>
                          <span className="text-[#8b949e] text-[10px]">Event 1</span>
                       </div>
                       <div className="p-4 flex flex-col gap-2 relative">
                         {/* Visual vertical line connecting logic */}
                         <div className="absolute left-6 top-4 bottom-4 w-px bg-[#30363d]"></div>
                         <div className="flex items-center gap-3 pl-8 relative">
                            <div className="absolute left-2 w-3 h-px bg-[#30363d]"></div>
                            <UserSquare size={16} className="text-[#58a6ff]"/>
                            <span className="text-[#c9d1d9] text-[13px] font-bold">Player Object</span>
                            <span className="text-[#8b949e] text-[13px]">Is on floor</span>
                         </div>
                         <div className="flex items-center gap-3 pl-8 relative">
                            <div className="absolute left-2 w-3 h-px bg-[#30363d]"></div>
                            <HardDrive size={16} className="text-[#f85149]"/>
                            <span className="text-[#c9d1d9] text-[13px] font-bold">Keyboard</span>
                            <span className="text-[#8b949e] text-[13px]">&#39;Space&#39; key is pressed</span>
                         </div>
                         <button className="text-[#58a6ff] hover:text-white text-[11px] font-bold mt-2 ml-8 flex items-center gap-1 w-max"><Plus size={12}/> Add Condition</button>
                       </div>
                    </div>
                    {/* Action side */}
                    <div className="w-1/2 flex flex-col bg-[#161b22]">
                       <div className="px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
                          <span className="text-[#3fb950] font-bold text-[12px] uppercase">Action</span>
                       </div>
                       <div className="p-4 flex flex-col gap-2 relative">
                         <div className="absolute left-6 top-4 bottom-4 w-px bg-[#30363d]"></div>
                         <div className="flex items-center gap-3 pl-8 relative">
                            <div className="absolute left-2 w-3 h-px bg-[#30363d]"></div>
                            <UserSquare size={16} className="text-[#58a6ff]"/>
                            <span className="text-[#c9d1d9] text-[13px] font-bold">Player Object</span>
                            <span className="text-[#8b949e] text-[13px]">Simulate Jump Input</span>
                         </div>
                         <div className="flex items-center gap-3 pl-8 relative">
                            <div className="absolute left-2 w-3 h-px bg-[#30363d]"></div>
                            <AudioWaveform size={16} className="text-[#e3b341]"/>
                            <span className="text-[#c9d1d9] text-[13px] font-bold">Audio System</span>
                            <span className="text-[#8b949e] text-[13px]">Play sound "Jump_01.wav", Volume: 0.8</span>
                         </div>
                         <button className="text-[#3fb950] hover:text-white text-[11px] font-bold mt-2 ml-8 flex items-center gap-1 w-max"><Plus size={12}/> Add Action</button>
                       </div>
                    </div>
                 </div>

                 {/* Dropzone for new events */}
                 <div className="border border-dashed border-[#58a6ff]/50 bg-[#58a6ff]/5 hover:bg-[#58a6ff]/10 text-[#58a6ff] cursor-pointer py-4 rounded-lg flex items-center justify-center font-bold text-[12px] gap-2 transition-colors">
                    <Plus size={16}/> Add New Event Group
                 </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // Dialogue & Quests (RPG Maker/Disco Elysium deep logic)
      // =========================================================
      case 'DialogueQuest':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Narrative & Quest Logic', 'Deep dialogue trees, branching quests, stats checks (RPG Maker style).', <BookOpen size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="w-[320px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 p-4">
                 <h3 className="text-[#c9d1d9] font-bold text-[14px] mb-4">Quest Databases</h3>
                 <div className="space-y-2">
                    <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex items-center gap-2 cursor-pointer border-l-4 border-l-[#e3b341]">
                        <BookOpen size={16} className="text-[#e3b341]" />
                        <span className="text-[13px] text-[#c9d1d9] font-bold flex-1">MQ01_Awakening</span>
                        <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div>
                    </div>
                    <div className="bg-[#161b22] hover:bg-[#21262d] p-2 rounded flex items-center gap-2 cursor-pointer border-l-4 border-l-transparent">
                        <BookOpen size={16} className="text-[#8b949e]" />
                        <span className="text-[13px] text-[#8b949e] font-bold flex-1">SQ04_LostAmulet</span>
                        <div className="w-2 h-2 rounded-full bg-[#f85149]"></div>
                    </div>
                 </div>

                 {/* Offline AI Narrative Designer */}
                 <div className="mt-8 bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] p-4 rounded shadow-lg">
                    <h3 className="text-[#bc8cff] font-bold text-[13px] flex items-center gap-2 mb-2"><Bot size={14}/> AI Novelist & Flag Generator</h3>
                    <p className="text-[10px] text-[#8b949e] mb-3">Offline AI can write branching dialogue with correct game logic flags & stat checks attached automatically.</p>
                    <textarea className="w-full bg-[#0a0a0a] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[11px] h-24 outline-none resize-none mb-2" placeholder="e.g. Generate dialogue for a sarcastic guard. He stops the player. If player 'Charisma' > 5, he lets them pass. Otherwise fight."></textarea>
                    <button className="w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 border border-[#bc8cff]/30 text-[#bc8cff] font-bold py-2 rounded text-[11px] flex justify-center items-center gap-2">
                       <Sparkles size={14}/> Auto-Write & Map Node Tree
                    </button>
                 </div>
               </div>

               {/* Central Visual Node Editor for Dialogue */}
               <div className="flex-1 bg-[#0d1117] relative overflow-hidden custom-scrollbar">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#58a6ff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
                  <div className="absolute inset-0 p-8 overflow-auto">
                     
                     {/* NPC Root Node */}
                     <div className="w-64 bg-[#161b22] border border-[#ff7b72] rounded-lg shadow-xl mb-8 relative z-10">
                        <div className="px-3 py-2 bg-gradient-to-r from-[#ff7b72]/30 to-transparent border-b border-[#30363d] flex items-center gap-2">
                           <UserSquare size={14} className="text-[#ff7b72]"/>
                           <span className="font-bold text-[#c9d1d9] text-[12px]">NPC: City Guard</span>
                        </div>
                        <div className="p-3 text-[12px] text-[#c9d1d9] italic border-b border-[#30363d]">
                          "Halt! No one passes the gate without the Duke's signet ring."
                        </div>
                        <div className="bg-[#0a0a0a] p-2 flex flex-col gap-1">
                           <div className="p-1 px-2 border border-[#30363d] rounded text-[10px] text-[#8b949e] bg-[#21262d] flex justify-between group cursor-pointer hover:border-[#58a6ff]">
                              [Show Ring] I have the signet right here.
                              <div className="w-2 h-2 rounded-full bg-[#58a6ff] mt-1 ml-2 ring-2 ring-[#0a0a0a]"></div>
                           </div>
                           <div className="p-1 px-2 border border-[#30363d] rounded text-[10px] text-[#8b949e] bg-[#21262d] flex justify-between group cursor-pointer hover:border-[#e3b341]">
                              [Charisma {'>'} 5] Does this gold coin change your mind?
                              <div className="w-2 h-2 rounded-full bg-[#e3b341] mt-1 ml-2 ring-2 ring-[#0a0a0a]"></div>
                           </div>
                           <div className="p-1 px-2 border border-[#30363d] rounded text-[10px] text-[#8b949e] bg-[#21262d] flex justify-between group cursor-pointer hover:border-[#f85149]">
                              [Attack] Out of my way!
                              <div className="w-2 h-2 rounded-full bg-[#f85149] mt-1 ml-2 ring-2 ring-[#0a0a0a]"></div>
                           </div>
                        </div>
                     </div>

                     {/* Next logic step */}
                     <div className="flex gap-12 ml-16 mt-[-10px] relative z-10">
                        <div className="w-64 bg-[#161b22] border border-[#58a6ff] rounded-lg shadow-xl relative top-12">
                           <div className="px-3 py-2 bg-gradient-to-r from-[#58a6ff]/30 to-transparent border-b border-[#30363d] flex items-center gap-2">
                              <Box size={14} className="text-[#58a6ff]"/>
                              <span className="font-bold text-[#c9d1d9] text-[12px]">Check Item Logic</span>
                           </div>
                           <div className="p-3 bg-[#0a0a0a]">
                              <div className="text-[11px] text-[#c9d1d9] flex justify-between items-center bg-[#238636]/20 p-1 px-2 rounded border border-[#3fb950]/30 mb-2">
                                 <span className="font-mono text-[#3fb950]">HasItem("DukesRing") == True</span>
                              </div>
                              <div className="text-[12px] text-[#c9d1d9]">
                                "Ah, my apologies. Proceed into the city."
                              </div>
                           </div>
                        </div>

                        <div className="w-64 bg-[#161b22] border border-[#e3b341] rounded-lg shadow-xl">
                           <div className="px-3 py-2 bg-gradient-to-r from-[#e3b341]/30 to-transparent border-b border-[#30363d] flex items-center gap-2">
                              <Activity size={14} className="text-[#e3b341]"/>
                              <span className="font-bold text-[#c9d1d9] text-[12px]">Stat Roll</span>
                           </div>
                           <div className="p-3 bg-[#0a0a0a]">
                              <div className="text-[11px] text-[#c9d1d9] flex justify-between items-center bg-[#e3b341]/20 p-1 px-2 rounded border border-[#e3b341]/30 mb-2">
                                 <span className="font-mono text-[#e3b341]">DICE ROLL: Char(6) vs DC(5)</span>
                              </div>
                              <div className="text-[10px] text-[#58a6ff] font-bold mb-1">SUCCESS PATH</div>
                              <div className="text-[12px] text-[#c9d1d9] mb-3">
                                "*Sigh*, fine. Just don't let the captain see you."
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // ProBuilder / BSP Level Design / TrenchBroom Style
      // =========================================================
      case 'LevelDesign':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Level Assembly & ProBuilder', 'Construct BSP geometry, boolean operations, and exact snapping for professional greyboxing/blockouts.', <Mountain size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               {/* Toolbox Menu */}
               <div className="w-[60px] bg-[#161b22] border-r border-[#30363d] flex flex-col items-center py-4 gap-4 shrink-0">
                  <div className="p-2 bg-[#21262d] rounded cursor-pointer border border-[#58a6ff] text-[#58a6ff]" title="Select Face/Edge/Vertex"><MousePointer2 size={18}/></div>
                  <div className="p-2 hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] rounded cursor-pointer" title="New Cube (BSP)"><Box size={18}/></div>
                  <div className="p-2 hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] rounded cursor-pointer" title="Extrude Face"><Rotate3D size={18} /></div> 
                  <div className="p-2 hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] rounded cursor-pointer" title="Boolean Carve (Subtract)"><Scissors size={18}/></div>
                  <div className="p-2 hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] rounded cursor-pointer" title="Stair Generator"><Blocks size={18}/></div>
                  <div className="w-8 h-px bg-[#30363d] my-2"></div>
                  <div className="p-2 text-[#bc8cff] bg-[#bc8cff]/10 border border-[#bc8cff]/30 rounded cursor-pointer relative group" title="Offline AI Level Gen">
                     <Bot size={18}/>
                  </div>
               </div>

               {/* Right Panel Properties + AI Gen */}
               <div className="w-[300px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 order-last p-4 overflow-y-auto">
                 <h3 className="text-[#c9d1d9] font-bold text-[14px] mb-4 border-b border-[#30363d] pb-2">Properties: BSP Cube_003</h3>
                 <div className="grid grid-cols-2 gap-2 text-[11px] mb-4">
                    <div className="text-[#8b949e] flex items-center justify-between col-span-2">
                       <span>World X</span> <input className="w-20 bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] px-1 rounded text-right" defaultValue="450.0" />
                    </div>
                    <div className="text-[#8b949e] flex items-center justify-between col-span-2">
                       <span>World Y</span> <input className="w-20 bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] px-1 rounded text-right" defaultValue="0.0" />
                    </div>
                    <div className="text-[#8b949e] flex items-center justify-between col-span-2">
                       <span>World Z</span> <input className="w-20 bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] px-1 rounded text-right" defaultValue="120.0" />
                    </div>
                 </div>

                 {/* Offline AI Architecture Generator */}
                 <div className="mt-8 bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] p-4 rounded shadow-lg">
                    <h3 className="text-[#bc8cff] font-bold text-[13px] flex items-center gap-2 mb-2"><Bot size={14}/> AI Blockout Arch-Gen</h3>
                    <p className="text-[10px] text-[#8b949e] mb-3">Uses offline procedural WFC (Wave Function Collapse) + Deep Learning to generate entire playable 3D blockout geometry.</p>
                    <textarea className="w-full bg-[#0a0a0a] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[11px] h-20 outline-none resize-none mb-2" placeholder="e.g. Generate a fast-paced arena shooter layout with sniper nests, 3 main choke points, and verticality."></textarea>
                    
                    <div className="flex gap-2 mb-3">
                       <label className="text-[10px] text-[#8b949e] flex items-center gap-1"><input type="checkbox" className="accent-[#bc8cff]" defaultChecked/> Cover placement</label>
                       <label className="text-[10px] text-[#8b949e] flex items-center gap-1"><input type="checkbox" className="accent-[#bc8cff]" defaultChecked/> NavMesh Build</label>
                    </div>

                    <button className="w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 border border-[#bc8cff]/30 text-[#bc8cff] font-bold py-2 rounded text-[11px] flex justify-center items-center gap-2">
                       <Orbit size={14}/> Generate Greybox BSP
                    </button>
                 </div>
               </div>

               {/* Center Viewport */}
               <div className="flex-1 bg-[#111] relative flex items-center justify-center border-t border-t-[#30363d]">
                  {/* Grid overlay concept */}
                  <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
                  
                  {/* Fake Viewport Gizmo */}
                  <div className="absolute top-4 right-4 z-10 w-16 h-16 opacity-50 pointer-events-none">
                     <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#58a6ff] transform -translate-x-1/2"></div>
                     <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#f85149] transform -translate-y-1/2"></div>
                     <div className="absolute left-1/2 top-1/2 w-12 h-0.5 bg-[#3fb950] transform -translate-y-1/2 -rotate-45 origin-left"></div>
                  </div>

                  <div className="z-10 text-[#30363d] font-bold text-2xl rotate-12 drop-shadow-lg flex items-center gap-4">
                     <Box size={120} /> <span className="uppercase tracking-[1rem]">Perspective View</span>
                  </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // Performance Profiler & Bug Hunter
      // =========================================================
      case 'PerformanceProfile':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('AAA Profiler & Bug Hunter', 'Real-time Flamegraphs, Memory allocation tracking, and offline AI Root-Cause analyzer.', <Bug size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                 {/* Top Graphs */}
                 <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4 shadow-lg flex flex-col items-center">
                       <h3 className="text-[#8b949e] font-bold text-[12px] uppercase mb-4 w-full text-left">Frame Time (ms)</h3>
                       <div className="text-[#3fb950] text-3xl font-mono font-bold">16.4<span className="text-xl">ms</span></div>
                       <div className="text-[10px] text-[#8b949e] mt-1">~ 60 FPS Target</div>
                    </div>
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4 shadow-lg flex flex-col items-center">
                       <h3 className="text-[#8b949e] font-bold text-[12px] uppercase mb-4 w-full text-left">VRAM Allocation</h3>
                       <div className="text-[#e3b341] text-3xl font-mono font-bold">1,824<span className="text-xl">MB</span></div>
                       <div className="text-[10px] text-[#8b949e] mt-1">Peak: 2,100 MB</div>
                    </div>
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4 shadow-lg flex flex-col items-center">
                       <h3 className="text-[#8b949e] font-bold text-[12px] uppercase mb-4 w-full text-left">Draw Calls</h3>
                       <div className="text-[#f85149] text-3xl font-mono font-bold">4,208</div>
                       <div className="text-[10px] text-[#f85149] mt-1 font-bold">WARNING: High Batch Count</div>
                    </div>
                 </div>

                 {/* Flame Graph Mock */}
                 <div className="w-full bg-[#161b22] border border-[#30363d] rounded p-4 shadow-lg mb-6 flex flex-col">
                    <h3 className="text-[#c9d1d9] font-bold text-[13px] mb-4">CPU Frame Hierarchy (Flame Graph)</h3>
                    <div className="w-full h-[140px] flex flex-col gap-1 overflow-hidden relative">
                       <div className="w-full h-8 bg-[#3fb950]/80 rounded border border-[#3fb950] flex items-center px-4 text-[#000] text-[10px] font-bold">MainEngineLoop.Tick [100%]</div>
                       <div className="flex gap-1">
                          <div className="w-[60%] h-8 bg-[#e3b341]/80 rounded border border-[#e3b341] flex items-center px-4 text-[#000] text-[10px] font-bold">FEngineLoop::Tick [60%]</div>
                          <div className="w-[40%] h-8 bg-[#58a6ff]/80 rounded border border-[#58a6ff] flex items-center px-4 text-[#000] text-[10px] font-bold">RenderThread::Tick [40%]</div>
                       </div>
                       <div className="flex gap-1 ml-[10%] w-[50%]">
                          <div className="w-[80%] h-8 bg-[#f85149]/80 rounded border border-[#f85149] flex items-center px-4 text-[#000] text-[10px] font-bold truncate">UCharacterMovementComponent::PerformMovement [40ms SPIKE!]</div>
                          <div className="w-[20%] h-8 bg-[#bc8cff]/80 rounded border border-[#bc8cff] flex items-center px-4 text-[#000] text-[10px] font-bold truncate">AnimUpdate</div>
                       </div>
                       {/* Line indicator */}
                       <div className="absolute left-[30%] top-0 bottom-0 w-px bg-red-500 z-10 shadow-lg pointer-events-none"></div>
                    </div>
                 </div>

                 {/* Offline AI Bug Hunter & Fixer */}
                 <div className="w-full bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] rounded p-6 shadow-lg flex gap-6">
                    <div className="flex flex-col flex-1">
                       <h3 className="text-[#bc8cff] font-bold text-[16px] mb-2 flex items-center gap-2"><Bot size={18}/> Deep Offline AI Bug Hunter & Auto-Fix Tool</h3>
                       <p className="text-[12px] text-[#8b949e] mb-4">The AI parses the Flamegraph, C++ core dumps, and GC (Garbage Collection) memory traces to find O(N^2) loops and memory leaks. It then outputs the optimized code automatically.</p>
                       <div className="flex items-center gap-4">
                          <button className="bg-[#bc8cff] hover:bg-[#bc8cff]/80 text-[#000] font-bold py-2 px-6 rounded text-[12px] flex items-center gap-2 shadow-lg transition-colors">
                             <Search size={16}/> Analyze CPU Spike
                          </button>
                          <span className="text-[12px] text-[#e3b341] font-bold animate-pulse flex items-center gap-1"><AlertTriangle size={14}/> Found performance anomaly in CharacterMovementCode.cpp (Line 1204)</span>
                       </div>
                    </div>
                    <div className="w-[350px] bg-[#0a0a0a] border border-[#bc8cff]/20 rounded p-4 text-[10px] font-mono text-[#58a6ff]">
                       <div className="text-[#8b949e] mb-2">// AI AUTO-OPTIMIZATION SUGGESTION:</div>
                       <div className="text-[#f85149] line-through mb-1">- for(auto Actor : AllWorldActors) &#123; <br/>&nbsp;&nbsp;if(Actor-&gt;Id == Target) ... <br/>&#125;</div>
                       <div className="text-[#3fb950] font-bold mb-2">+ auto Actor = ActorMap.Find(Target); // Fixed 40ms O(N) lookup.</div>
                       <button className="mt-2 text-[#fff] bg-[#238636] px-3 py-1 rounded inline-block">Apply Patch</button>
                    </div>
                 </div>

               </div>
             </div>
           </div>
         );
  
      // =========================================================
      // Animation Graph & Deep Physics Rigging (Cascadeur Style)
      // =========================================================
      case 'AnimGraph':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Advanced AnimGraph & Deep Physics', 'Pro animation state machines, IK Solvers, and Deep Learning Physics Posing (Cascadeur style).', <PersonStanding size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               {/* Left Panel */}
               <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
                  <div className="p-3 border-b border-[#30363d]">
                     <span className="text-[#c9d1d9] font-bold text-[12px] uppercase">State Machines</span>
                  </div>
                  <div className="p-2 space-y-1 border-b border-[#30363d] pb-4">
                     <div className="px-2 py-1.5 bg-[#21262d] text-[#c9d1d9] rounded text-[12px] flex items-center justify-between cursor-pointer border-l-4 border-l-[#58a6ff]">
                        <div className="flex items-center gap-2"><Settings2 size={14}/> Locomotion</div>
                        <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div>
                     </div>
                     <div className="px-2 py-1.5 text-[#8b949e] hover:bg-[#21262d] rounded text-[12px] flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2"><Activity size={14}/> Combat_Melee</div>
                     </div>
                     <div className="px-2 py-1.5 text-[#8b949e] hover:bg-[#21262d] rounded text-[12px] flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2"><Orbit size={14}/> FullBody_IK_Solver</div>
                     </div>
                  </div>

                  {/* Offline AI Physics/Mocap */}
                  <div className="p-4 bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] shadow-lg rounded m-2 mt-4">
                     <h3 className="text-[#bc8cff] font-bold text-[13px] flex items-center gap-2 mb-2"><Bot size={14}/> AI Deep Physics Auto-Posing</h3>
                     <p className="text-[10px] text-[#8b949e] mb-3">Uses neural networks (like Cascadeur) to automatically generate center of mass, angular momentum, and realistic secondary motion offline.</p>
                     <div className="flex gap-2">
                        <button className="flex-1 bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 py-1.5 rounded text-[10px] font-bold">Predict Physics</button>
                        <button className="flex-1 bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30 py-1.5 rounded text-[10px] font-bold">Video to Mocap</button>
                     </div>
                  </div>
               </div>

               {/* Central Editor */}
               <div className="flex-1 bg-[#0d1117] relative overflow-hidden custom-scrollbar">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#30363d 2px, transparent 2px), linear-gradient(90deg, #30363d 2px, transparent 2px)", backgroundSize: "30px 30px" }}></div>
                  <div className="absolute inset-0 p-8">
                     {/* Nodes */}
                     <div className="w-[200px] h-16 bg-[#161b22] border border-[#3fb950] rounded-full shadow-xl flex items-center justify-center absolute top-20 left-1/4 z-10">
                        <span className="font-bold text-[#3fb950] tracking-wider">IDLE STATE</span>
                     </div>
                     <div className="w-[180px] h-16 bg-[#161b22] border border-[#e3b341] rounded-full shadow-xl flex items-center justify-center absolute top-56 left-1/2 z-10">
                        <span className="font-bold text-[#e3b341] tracking-wider">RUN CYCLE (1D Blend)</span>
                     </div>
                     <div className="w-[200px] h-16 bg-[#161b22] border border-[#f85149] rounded-full shadow-xl flex items-center justify-center absolute top-20 right-1/4 z-10">
                        <span className="font-bold text-[#f85149] tracking-wider">ATTACK_HEAVY</span>
                     </div>
                     
                     {/* Connections */}
                     <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        <path d="M 350 110 C 450 110, 450 250, 550 250" fill="none" stroke="#e3b341" strokeWidth="3" markerEnd="url(#arrow)" strokeDasharray="5,5"/>
                     </svg>
                  </div>

                  {/* Deep Physics Panel Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 h-48 bg-[#161b22]/95 border border-[#30363d] backdrop-blur-md rounded-lg shadow-2xl flex p-4 shadow-black">
                     <div className="w-1/3 border-r border-[#30363d] pr-4">
                        <div className="flex justify-between items-center mb-4">
                           <span className="font-bold text-[#c9d1d9] text-[12px]">Auto-Physics Track</span>
                           <span className="bg-[#bc8cff] text-black text-[9px] font-bold px-2 rounded-full">AI ACTIVE</span>
                        </div>
                        <div className="space-y-4 text-[10px] text-[#8b949e]">
                           <div>
                              <div className="flex justify-between mb-1"><span>Center of Mass Stability</span><span className="text-[#3fb950]">89%</span></div>
                              <div className="w-full bg-[#0a0a0a] h-1.5 rounded"><div className="bg-[#3fb950] h-1.5 rounded" style={{width: '89%'}}></div></div>
                           </div>
                           <div>
                              <div className="flex justify-between mb-1"><span>Angular Momentum</span><span className="text-[#f85149]">Critical Warning</span></div>
                              <div className="w-full bg-[#0a0a0a] h-1.5 rounded"><div className="bg-[#f85149] h-1.5 rounded" style={{width: '100%'}}></div></div>
                              <span className="text-[9px] text-[#f85149]">Character likely to fall forward. AI proposing counter-balance swing on arm_r.</span>
                           </div>
                           <button className="w-full bg-[#bc8cff] text-[#000] font-bold py-1.5 rounded mt-2">Apply AI Pose Correction</button>
                        </div>
                     </div>
                     <div className="flex-1 flex flex-col pl-4 relative">
                        {/* Timeline */}
                        <div className="absolute inset-0 flex items-center">
                           <div className="w-full h-px bg-[#30363d]"></div>
                        </div>
                        <div className="z-10 flex h-full items-end gap-1 pb-2">
                           {[...Array(60)].map((_,i) => (
                              <div key={i} className="w-1 bg-[#58a6ff]/30 flex-1 hover:bg-[#58a6ff] cursor-pointer rounded-t" style={{height: `${Math.random() * 80 + 20}%`}}></div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // Procedural Content Generation (Houdini-Style PCG)
      // =========================================================
      case 'ProceduralGen':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Houdini-Style PCG World Gen', 'Node-based procedural content generation, Splines, Biomes, and advanced scattering rules.', <Layers size={28} />)}
             <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-6 shadow-2xl flex-1 flex flex-col relative overflow-hidden">
                   
                   <div className="flex justify-between items-center border-b border-[#30363d] pb-4 mb-4 z-10 font-bold">
                      <div className="flex items-center gap-2 text-[#c9d1d9]"><CloudRain size={16}/> PCG Rule System: <span className="text-[#3fb950]">Biome_PineForest_01</span></div>
                      <div className="bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30 px-3 py-1 rounded text-[11px] shadow">EXECUTE RULESET IN VIEWPORT</div>
                   </div>

                   {/* Node Graph Mock for PCG */}
                   <div className="flex-1 relative flex items-center justify-center">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#8b949e 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                      
                      <div className="flex gap-16 relative z-10 w-full h-full items-center justify-center p-8">
                         {/* Input */}
                         <div className="w-[180px] bg-[#0a0a0a] border border-[#58a6ff] rounded p-2 shadow-lg">
                           <div className="font-bold text-[#58a6ff] text-[11px] mb-2 uppercase">Get Spline Data</div>
                           <div className="text-[9px] text-[#8b949e]">Filters points inside Spline_Area_1</div>
                         </div>
                         {/* Modifier */}
                         <div className="w-[200px] bg-[#0a0a0a] border border-[#e3b341] rounded p-2 shadow-lg relative">
                           <div className="absolute top-1/2 -left-16 w-16 h-0.5 bg-[#58a6ff]"></div>
                           <div className="font-bold text-[#e3b341] text-[11px] mb-2 uppercase">Surface Sampler</div>
                           <div className="text-[10px] text-[#c9d1d9] flex justify-between bg-[#21262d] p-1 rounded border border-[#30363d]"><span>Points per m2</span><span>0.15</span></div>
                         </div>
                         {/* AI Modifier */}
                         <div className="w-[220px] bg-[#0a0a0a] border border-[#bc8cff] rounded p-2 shadow-[0_0_15px_rgba(188,140,255,0.2)] relative">
                           <div className="absolute top-1/2 -left-16 w-16 h-0.5 bg-[#e3b341]"></div>
                           <div className="font-bold text-[#bc8cff] text-[11px] mb-2 uppercase flex items-center gap-1"><Bot size={12}/> AI Density Mask</div>
                           <div className="text-[10px] text-[#8b949e] italic mb-1">Uses ML to avoid placing trees in unnatural terrain logic (e.g., steep cliffs, underwater).</div>
                         </div>
                         {/* Spawner */}
                         <div className="w-[180px] bg-[#0a0a0a] border border-[#3fb950] rounded p-2 shadow-lg relative">
                           <div className="absolute top-1/2 -left-16 w-16 h-0.5 bg-[#bc8cff]"></div>
                           <div className="font-bold text-[#3fb950] text-[11px] mb-2 uppercase">Static Mesh Spawner</div>
                           <div className="text-[9px] text-[#c9d1d9]">- SM_PineTree_A<br/>- SM_PineTree_B<br/>- SM_BrambleBush</div>
                         </div>
                      </div>

                   </div>

                   {/* AI World Gen Prompter */}
                   <div className="mt-4 bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] rounded p-4 flex gap-4 h-32 z-10 shrink-0">
                     <div className="flex flex-col flex-1">
                        <div className="text-[#bc8cff] text-[13px] font-bold flex items-center gap-2 mb-1"><Bot size={14}/> Text-to-PCG Node Tree Builder</div>
                        <p className="text-[10px] text-[#8b949e]">Generating complex node trees manually is slow. Describe your procedural needs here.</p>
                        <textarea className="w-full bg-[#0a0a0a] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[11px] mt-2 outline-none resize-none flex-1" placeholder="e.g. Generate a rocky path that follows the river spline, spawn grass near it, and place pebbles exactly on top of the soil layer..."></textarea>
                     </div>
                     <button className="w-[200px] bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff] font-bold rounded flex flex-col items-center justify-center gap-2 transition-all">
                        <Sparkles size={24}/> Auto-Wire Nodes
                     </button>
                   </div>
                </div>
             </div>
           </div>
         );

      // =========================================================
      // Netcode & Multiplayer Server Manager
      // =========================================================
      case 'Netcode':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Network & Rollback Multiplayer', 'Dedicated server fleet scaler, tick rate config, variable replication, and Rollback netcode.', <Globe size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               {/* Left Panel */}
               <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 p-4">
                  <h3 className="text-[#c9d1d9] font-bold text-[14px] mb-4">Multiplayer Config</h3>
                  
                  <div className="space-y-4 text-[11px]">
                     <div className="border border-[#30363d] bg-[#0d1117] p-3 rounded">
                        <span className="text-[#8b949e] font-bold block mb-2">Netcode Architecture</span>
                        <select className="w-full bg-[#161b22] border border-[#30363d] text-[#c9d1d9] p-1 rounded outline-none">
                           <option>Client-Server (Authoritative)</option>
                           <option>P2P (Lockstep)</option>
                           <option>P2P (Rollback / GGPO)</option>
                           <option>Client-Server (State Sync)</option>
                        </select>
                     </div>

                     <div className="border border-[#30363d] bg-[#0d1117] p-3 rounded space-y-2">
                        <div className="flex justify-between items-center text-[#c9d1d9]"><span>Server Tick Rate</span><span className="font-bold text-[#58a6ff]">64 Hz</span></div>
                        <input type="range" className="w-full accent-[#58a6ff]" min="10" max="128" defaultValue="64" />
                        <div className="flex justify-between items-center text-[#c9d1d9] mt-2"><span>Rollback Frames Max</span><span className="font-bold text-[#f85149]">8 Frames</span></div>
                        <input type="range" className="w-full accent-[#f85149]" min="1" max="16" defaultValue="8" />
                     </div>
                  </div>

                  {/* AI Bandwidth Optimizer */}
                  <div className="mt-8 bg-[#0d1117] border border-[#bc8cff]/30 p-3 rounded border-l-4 border-l-[#bc8cff]">
                     <h3 className="text-[#bc8cff] font-bold text-[12px] flex items-center gap-2 mb-2"><Bot size={14}/> AI Traffic Optimizer</h3>
                     <p className="text-[10px] text-[#8b949e] mb-2">Analyzes multiplayer variable replication across the project.</p>
                     <button className="w-full bg-[#bc8cff]/10 border border-[#bc8cff]/30 text-[#bc8cff] font-bold py-1.5 rounded text-[10px]">Recommend Bit-Packing</button>
                  </div>
               </div>

               {/* Central Editor */}
               <div className="flex-1 bg-[#0d1117] p-6 overflow-y-auto custom-scrollbar">
                  <h2 className="text-[#c9d1d9] text-xl font-bold mb-4">Replication Graph Inspector</h2>
                  
                  {/* Bandwidth Monitor */}
                  <div className="w-full bg-[#161b22] border border-[#30363d] rounded p-4 shadow-lg mb-6 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <Activity size={32} className="text-[#3fb950]"/>
                        <div>
                           <div className="text-[14px] text-[#c9d1d9] font-bold">Total Bandwidth (Out/In)</div>
                           <div className="text-[20px] text-[#3fb950] font-mono leading-none">12.4 <span className="text-[12px]">KB/s</span> <span className="text-[#8b949e] text-[12px]">|</span> 4.1 <span className="text-[12px]">KB/s</span></div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-[10px] text-[#8b949e] uppercase font-bold">Simulated Latency</div>
                        <div className="text-[18px] text-[#f85149] font-mono font-bold">120ms <span className="text-[10px] text-[#f85149]">3% Pkt Loss</span></div>
                     </div>
                  </div>

                  {/* Replication List */}
                  <div className="space-y-2">
                     {/* Item 1 */}
                     <div className="bg-[#161b22] border border-[#30363d] p-3 rounded flex justify-between items-center group hover:border-[#58a6ff]">
                        <div className="flex gap-4 items-center">
                           <div className="flex flex-col">
                              <span className="text-[#c9d1d9] text-[12px] font-bold">BP_PlayerCharacter</span>
                              <span className="text-[#8b949e] text-[10px] uppercase">Replicated (Transform, Health)</span>
                           </div>
                           <span className="bg-[#f85149]/20 text-[#f85149] text-[9px] px-2 py-0.5 rounded border border-[#f85149]/30 font-bold">RELIABLE DORMANT</span>
                        </div>
                        <div className="flex gap-6 items-center">
                           <div className="text-right flex flex-col">
                              <span className="text-[#8b949e] text-[10px]">Net Update Freq</span>
                              <span className="text-[#c9d1d9] text-[12px] font-bold">10 Hz</span>
                           </div>
                           <div className="text-right flex flex-col">
                              <span className="text-[#8b949e] text-[10px]">Current Cost</span>
                              <span className="text-[#e3b341] text-[12px] font-bold font-mono">24 bytes/tick</span>
                           </div>
                        </div>
                     </div>
                     {/* Item 2 */}
                     <div className="bg-[#161b22] border border-[#30363d] p-3 rounded flex justify-between items-center group hover:border-[#58a6ff]">
                        <div className="flex gap-4 items-center">
                           <div className="flex flex-col">
                              <span className="text-[#c9d1d9] text-[12px] font-bold">GM_BattleRoyale (GameMode)</span>
                              <span className="text-[#8b949e] text-[10px] uppercase">Auth: SERVER ONLY</span>
                           </div>
                           <span className="bg-[#58a6ff]/20 text-[#58a6ff] text-[9px] px-2 py-0.5 rounded border border-[#58a6ff]/30 font-bold">SERVER AUTHORITY</span>
                        </div>
                     </div>
                     {/* Item 3 */}
                     <div className="bg-[#0a0a0a] border border-[#bc8cff]/50 p-3 rounded flex justify-between items-center shadow-[0_0_10px_rgba(188,140,255,0.1)]">
                        <div className="flex gap-4 items-center">
                           <Bot size={16} className="text-[#bc8cff]"/>
                           <div className="flex flex-col">
                              <span className="text-[#bc8cff] text-[12px] font-bold">AI Suggestion: BP_Projectile Arrow</span>
                              <span className="text-[#8b949e] text-[10px]">Do not replicate exact position (64-byte vector/tick).</span>
                           </div>
                        </div>
                        <div className="text-[11px] text-[#c9d1d9]">
                           Use <span className="text-[#3fb950] font-bold">Client-Side Prediction</span> via origin/velocity parameters.
                           <button className="ml-4 bg-[#bc8cff] text-black font-bold px-2 py-1 rounded text-[10px]">Apply Fix</button>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // LiveOps, Analytics & Economy Simulator
      // =========================================================
      case 'LiveOps':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('LiveOps & Data Analytics', 'Monetization pipelines, AB testing, Cloud Economy tracking, and Matchmaking data.', <TrendingUp size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="w-full flex flex-col p-6 overflow-y-auto">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                     <div className="bg-[#161b22] border border-[#30363d] p-4 rounded shadow">
                        <div className="text-[#8b949e] text-[11px] uppercase font-bold mb-1">DAU (Daily Active)</div>
                        <div className="text-[#c9d1d9] text-2xl font-bold">24,591</div>
                        <div className="text-[#3fb950] text-[10px] font-bold flex items-center gap-1">+5.2%</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#30363d] p-4 rounded shadow">
                        <div className="text-[#8b949e] text-[11px] uppercase font-bold mb-1">ARPDAU (Revenue)</div>
                        <div className="text-[#c9d1d9] text-2xl font-bold">$1.24</div>
                        <div className="text-[#f85149] text-[10px] font-bold flex items-center gap-1">-0.4%</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#30363d] p-4 rounded shadow">
                        <div className="text-[#8b949e] text-[11px] uppercase font-bold mb-1">D1 Retention</div>
                        <div className="text-[#c9d1d9] text-2xl font-bold">42.8%</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#30363d] p-4 rounded shadow">
                        <div className="text-[#8b949e] text-[11px] uppercase font-bold mb-1">Matchmaking Queue</div>
                        <div className="text-[#c9d1d9] text-2xl font-bold">14 Secs</div>
                     </div>
                  </div>

                  <div className="flex gap-6">
                     <div className="flex-1 bg-[#161b22] border border-[#30363d] p-4 rounded shadow-lg flex flex-col items-center justify-center min-h-[300px]">
                        <ActivitySquare size={48} className="text-[#8b949e] mb-4 opacity-50"/>
                        <span className="text-[#8b949e] text-[14px]">Economy Sink/Source Graph Placeholder</span>
                        <span className="text-[#8b949e] text-[10px] mt-2">Visualizing 'Gold' generation vs spending.</span>
                     </div>
                     
                     <div className="w-[350px] flex flex-col gap-4 shrink-0">
                        <div className="bg-[#161b22] border border-[#30363d] p-4 rounded shadow">
                           <h3 className="text-[#c9d1d9] font-bold text-[13px] mb-3">A/B Experiments</h3>
                           <div className="space-y-3">
                              <div>
                                 <div className="flex justify-between text-[11px] mb-1"><span className="text-[#58a6ff]">Variant A (Hard Turret)</span><span className="text-[#c9d1d9]">50%</span></div>
                                 <div className="w-full bg-[#0a0a0a] h-1.5 rounded"><div className="bg-[#58a6ff] h-1.5 rounded" style={{width: '50%'}}></div></div>
                              </div>
                              <div>
                                 <div className="flex justify-between text-[11px] mb-1"><span className="text-[#f85149]">Variant B (Soft Turret)</span><span className="text-[#c9d1d9]">50%</span></div>
                                 <div className="w-full bg-[#0a0a0a] h-1.5 rounded"><div className="bg-[#f85149] h-1.5 rounded" style={{width: '50%'}}></div></div>
                              </div>
                           </div>
                        </div>

                        {/* Offline AI Economy Balancer */}
                        <div className="bg-[#0d1117] border border-[#bc8cff]/30 p-4 rounded shadow-lg border-l-4 border-l-[#bc8cff]">
                           <h3 className="text-[#bc8cff] font-bold text-[13px] flex items-center gap-2 mb-2"><Bot size={14}/> AI Economy Simulator</h3>
                           <p className="text-[10px] text-[#8b949e] mb-3">Simulates 10,000 player journeys at 1000x speed to find hyper-inflation in the game economy.</p>
                           <textarea className="w-full bg-[#0a0a0a] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[11px] outline-none resize-none mb-2" rows={2} defaultValue="Found exploit: Crafting 'Iron Sword' yields net positive gold at level 15."></textarea>
                           <button className="w-full bg-[#bc8cff]/10 border border-[#bc8cff]/30 text-[#bc8cff] font-bold py-1.5 rounded text-[11px]">Auto-Balance Drop Rates</button>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
           </div>
         );
  
      // =========================================================
      // Cinematic Sequencer (UE Sequencer / Unity Timeline)
      // =========================================================
      case 'CinematicSequencer':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Timeline & Cinematic Sequencer', 'Multi-track timeline for cutscenes, camera animation, event triggering, and audio syncing.', <Clapperboard size={28} />)}
             <div className="flex-1 flex flex-col overflow-hidden">
               {/* 3D Viewport preview for cutscenes */}
               <div className="flex-1 bg-[#111] border-b border-[#30363d] relative flex items-center justify-center">
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black to-transparent z-10"></div>
                  {/* Fake Viewport */}
                  <div className="w-3/4 h-3/4 bg-[#161b22] border border-[#30363d] rounded flex items-center justify-center relative shadow-2xl overflow-hidden">
                     <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwaC00MHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMCAwbDEwIDEwTDIwIDBoMjB2MjBMMzAgMzBsMTAgMTBoLTIwTDEwIDQwbC0xMC0xMFYweiIgZmlsbD0iIzMzMyIvPjwvc3ZnPg==')]"></div>
                     {/* Safe Area overlays */}
                     <div className="absolute inset-4 border-2 border-[#c9d1d9]/20 border-dashed pointer-events-none"></div>
                     <div className="text-[#8b949e] font-bold text-xl flex items-center gap-3 drop-shadow"><Video size={32}/> Camera Cuts Viewport Preview</div>
                     <div className="absolute top-2 left-2 bg-[#f85149] text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-widest animate-pulse">REC</div>
                     <div className="absolute bottom-2 left-2 text-[#c9d1d9] text-[12px] font-mono font-bold bg-black/50 px-2 py-1 rounded">TC 00:01:24:16</div>
                  </div>
               </div>

               {/* Timeline Tracks */}
               <div className="h-[300px] bg-[#161b22] flex flex-col shrink-0">
                  {/* Toolbar */}
                  <div className="h-10 border-b border-[#30363d] flex items-center px-4 justify-between bg-[#0d1117]">
                     <div className="flex items-center gap-2">
                        <button className="text-[#8b949e] hover:text-white"><Rewind size={16}/></button>
                        <button className="text-[#3fb950] hover:text-[#58a6ff] mx-2"><Play size={20} fill="currentColor"/></button>
                        <button className="text-[#8b949e] hover:text-white"><FastForward size={16}/></button>
                        <div className="w-px h-4 bg-[#30363d] mx-2"></div>
                        <span className="font-mono text-[#c9d1d9] text-[12px]">00:01:24:16</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-3 py-1 rounded text-[11px] text-[#c9d1d9] font-bold flex items-center gap-1"><Plus size={14}/> Add Track</button>
                     </div>
                  </div>

                  {/* Tracks */}
                  <div className="flex-1 flex overflow-hidden">
                     {/* Track Headers */}
                     <div className="w-[250px] border-r border-[#30363d] bg-[#0d1117] flex flex-col z-10 shrink-0">
                        <div className="h-8 border-b border-[#30363d] flex items-center px-2"></div>
                        <div className="flex flex-col">
                           <div className="h-10 border-b border-[#30363d] flex items-center px-3 gap-2 group hover:bg-[#161b22] cursor-pointer">
                              <Video size={14} className="text-[#58a6ff]"/>
                              <span className="text-[#c9d1d9] text-[11px] font-bold flex-1">Camera Cuts</span>
                              <Eye size={12} className="text-[#8b949e] group-hover:text-[#c9d1d9]"/>
                           </div>
                           <div className="h-10 border-b border-[#30363d] flex items-center px-3 gap-2 group hover:bg-[#161b22] cursor-pointer">
                              <PersonStanding size={14} className="text-[#f85149]"/>
                              <span className="text-[#c9d1d9] text-[11px] font-bold flex-1">Hero_Actor</span>
                              <Eye size={12} className="text-[#8b949e] group-hover:text-[#c9d1d9]"/>
                           </div>
                           <div className="h-10 border-b border-[#30363d] flex items-center px-3 gap-2 group hover:bg-[#161b22] cursor-pointer pl-6">
                              <RotateCw size={14} className="text-[#e3b341]"/>
                              <span className="text-[#8b949e] text-[11px] flex-1">Transform</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-[#e3b341]"></div>
                           </div>
                           <div className="h-10 border-b border-[#30363d] flex items-center px-3 gap-2 group hover:bg-[#161b22] cursor-pointer pl-6">
                              <Bone size={14} className="text-[#bc8cff]"/>
                              <span className="text-[#8b949e] text-[11px] flex-1">Animation: Idle_To_Run</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-[#bc8cff]"></div>
                           </div>
                        </div>
                        {/* Offline AI Track Generator */}
                        <div className="m-2 mt-auto p-2 bg-[#bc8cff]/5 border border-[#bc8cff]/30 rounded flex flex-col gap-1">
                           <span className="text-[#bc8cff] text-[10px] font-bold flex items-center gap-1"><Bot size={12}/> AI Cinematic Director</span>
                           <input type="text" className="bg-[#0a0a0a] border border-[#30363d] rounded px-1.5 py-1 text-[9px] text-[#c9d1d9] outline-none" placeholder="e.g. Generate 5 sec Dutch angle panning shot around Hero_Actor"/>
                        </div>
                     </div>

                     {/* Track Body (Keyframes) */}
                     <div className="flex-1 bg-[#161b22] relative overflow-x-auto overflow-y-hidden custom-scrollbar">
                        {/* Playhead */}
                        <div className="absolute top-0 bottom-0 left-[200px] w-px bg-[#f85149] z-20 pointer-events-none shadow-[0_0_5px_rgba(248,81,73,0.5)]">
                           <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-[#f85149] absolute -translate-x-1/2"></div>
                        </div>
                        {/* Time Ruler */}
                        <div className="h-8 border-b border-[#30363d] flex items-end pl-2 gap-[48px] bg-[#0a0a0a]">
                           {[...Array(20)].map((_, i) => (
                              <div key={i} className="text-[9px] text-[#8b949e] shrink-0 font-mono relative">
                                 <div className="absolute -left-px bottom-0 h-2 w-px bg-[#30363d]"></div>
                                 <div className="pl-1 mb-1">{String(i).padStart(2, '0')}:00</div>
                              </div>
                           ))}
                        </div>
                        {/* Track content */}
                        <div className="relative">
                           <div className="h-10 border-b border-[#30363d] relative">
                              <div className="absolute left-[50px] top-2 bottom-2 w-[150px] bg-[#58a6ff]/20 border border-[#58a6ff]/50 rounded text-[9px] text-[#58a6ff] flex items-center px-2 font-bold select-none cursor-ew-resize">CameraAct_01</div>
                           </div>
                           <div className="h-10 border-b border-[#30363d]"></div>
                           <div className="h-10 border-b border-[#30363d] relative">
                              <div className="absolute left-[100px] top-1/2 w-2 h-2 bg-[#e3b341] rotate-45 transform -translate-y-1/2 -mt-[1px] shadow-[0_0_5px_rgba(227,179,65,0.8)] cursor-pointer hover:bg-white"></div>
                              <div className="absolute left-[150px] top-1/2 w-2 h-2 bg-[#e3b341] rotate-45 transform -translate-y-1/2 -mt-[1px] shadow-[0_0_5px_rgba(227,179,65,0.8)] cursor-pointer hover:bg-white"></div>
                              <div className="absolute left-[200px] top-1/2 w-2 h-2 bg-[#f85149] rotate-45 transform -translate-y-1/2 -mt-[1px] shadow-[0_0_5px_rgba(248,81,73,0.8)] cursor-pointer"></div>
                           </div>
                           <div className="h-10 border-b border-[#30363d] relative">
                              <div className="absolute left-[100px] top-2 bottom-2 w-[220px] bg-[#bc8cff]/20 border border-[#bc8cff]/50 rounded text-[9px] text-[#bc8cff] flex items-center justify-between px-2 font-bold select-none cursor-ew-resize">
                                 <span>Idle_To_Run_Anim</span>
                                 <span>100%</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // Advanced NavMesh & Crowd AI
      // =========================================================
      case 'AdvancedNavMesh':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('NavMesh & Crowd AI', 'Recast NavMesh generation, Dynamic Obstacle carving, steering behaviors, and Mass Crowd simulation.', <Users size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="w-[320px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 overflow-y-auto">
                 <div className="p-4 border-b border-[#30363d]">
                    <h3 className="text-[#c9d1d9] font-bold text-[14px] flex items-center gap-2"><MapIcon size={16}/> NavMesh Generator</h3>
                    <div className="mt-4 space-y-3">
                       <div>
                          <label className="text-[11px] text-[#8b949e] font-bold uppercase block mb-1">Agent Radius</label>
                          <div className="flex gap-2">
                             <input type="range" className="flex-1 accent-[#58a6ff]" min="10" max="100" defaultValue="34" />
                             <span className="text-[#c9d1d9] text-[11px] font-mono">34.0</span>
                          </div>
                       </div>
                       <div>
                          <label className="text-[11px] text-[#8b949e] font-bold uppercase block mb-1">Agent Height</label>
                          <div className="flex gap-2">
                             <input type="range" className="flex-1 accent-[#58a6ff]" min="50" max="300" defaultValue="144" />
                             <span className="text-[#c9d1d9] text-[11px] font-mono">144.0</span>
                          </div>
                       </div>
                       <div>
                          <label className="text-[11px] text-[#8b949e] font-bold uppercase block mb-1">Max Slope Angle</label>
                          <div className="flex gap-2">
                             <input type="range" className="flex-1 accent-[#e3b341]" min="0" max="90" defaultValue="45" />
                             <span className="text-[#e3b341] text-[11px] font-mono">45°</span>
                          </div>
                       </div>
                       <button className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-2 rounded text-[12px] shadow flex justify-center items-center gap-2 mt-4">
                          <Layers size={14}/> Build Recast NavMesh
                       </button>
                    </div>
                 </div>

                 <div className="p-4 border-b border-[#30363d]">
                    <h3 className="text-[#c9d1d9] font-bold text-[14px] flex items-center gap-2 mb-4"><Users size={16}/> Crowd Simulation (Mass)</h3>
                    <div className="bg-[#0d1117] border border-[#30363d] rounded p-3">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[12px] text-[#c9d1d9] font-bold">Simulated Agents</span>
                          <span className="text-[#3fb950] font-mono text-[12px] font-bold">10,000</span>
                       </div>
                       <div className="text-[10px] text-[#8b949e] mb-3">Flocking, Flow Fields, and Avoidance managed via Data-Oriented ECS.</div>
                       <div className="space-y-1 text-[11px]">
                          <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> RVO Avoidance</label>
                          <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Dynamic Obstacle Carving</label>
                          <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" className="accent-[#58a6ff]"/> AI Path Prediction</label>
                       </div>
                    </div>
                 </div>

                 {/* Offline AI Boids & Behavior Injector */}
                 <div className="p-4 bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] shadow-lg m-4 rounded">
                     <h3 className="text-[#bc8cff] font-bold text-[12px] flex items-center gap-2 mb-2"><Bot size={14}/> AI Crowd Behavior Synthesizer</h3>
                     <p className="text-[10px] text-[#8b949e] mb-3">Trains an offline neural net to handle massive scale flocking behavior bypassing expensive A* CPU calls.</p>
                     <button className="w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 py-1.5 rounded text-[11px] font-bold">Compute Flow Field using ML</button>
                 </div>
               </div>

               <div className="flex-1 bg-[#111] relative flex items-center justify-center p-8">
                  {/* Fake NavMesh Render */}
                  <div className="relative w-[500px] h-[500px]" style={{ transform: 'rotateX(60deg) rotateZ(45deg)', transformStyle: 'preserve-3d' }}>
                     {/* Floor */}
                     <div className="absolute inset-0 bg-[#30363d] border border-[#444] rounded shadow-2xl"></div>
                     {/* NavMesh Polygons (Simulated) */}
                     <div className="absolute inset-4 bg-[#3fb950]/30 border border-[#3fb950]/50" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 70% 70%, 70% 100%, 0% 100%)' }}></div>
                     <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-transparent border-2 border-red-500/50 flex items-center justify-center">
                        <span className="text-red-500 font-bold -mt-8 bg-black/50 px-2 rounded">Obstacle Hole</span>
                     </div>
                     
                     {/* Path / Stream */}
                     <svg className="absolute inset-0 w-full h-full pointer-events-none transform -rotate-z-45" style={{ filter: 'drop-shadow(0 0 5px #58a6ff)'}}>
                        <path d="M 50 50 Q 200 100, 200 250 T 400 400" fill="none" stroke="#58a6ff" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10"/>
                        <circle cx="50" cy="50" r="8" fill="#58a6ff" />
                        <circle cx="400" cy="400" r="8" fill="#e3b341" />
                     </svg>
                     <div className="absolute left-[380px] top-[380px] bg-[#e3b341] text-black font-bold px-2 rounded text-[10px] transform -rotate-z-45">GOAL</div>

                     {/* Crowd Boids */}
                     {[...Array(30)].map((_,i) => (
                        <div key={i} className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white]" style={{ 
                           left: `${Math.random() * 200 + 100}px`, 
                           top: `${Math.random() * 200 + 100}px`,
                           opacity: Math.random() * 0.5 + 0.5
                        }}></div>
                     ))}
                  </div>

                  {/* UI Overlay */}
                  <div className="absolute top-4 right-4 bg-[#161b22]/90 border border-[#30363d] backdrop-blur p-4 rounded shadow-2xl">
                     <div className="text-[12px] font-bold text-[#c9d1d9] mb-2 border-b border-[#30363d] pb-2">NavMesh Data</div>
                     <div className="flex justify-between gap-8 text-[11px]"><span className="text-[#8b949e]">Polygons</span><span className="text-[#3fb950] font-mono">1,424</span></div>
                     <div className="flex justify-between gap-8 text-[11px]"><span className="text-[#8b949e]">Vertices</span><span className="text-[#3fb950] font-mono">3,890</span></div>
                     <div className="flex justify-between gap-8 text-[11px] mt-2 border-t border-[#30363d] pt-2"><span className="text-[#8b949e]">Build Time</span><span className="text-[#c9d1d9] font-mono">0.421s</span></div>
                  </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // 2.5D / HD-2D Hybrid Engine (GameMaker3D / Octopath style)
      // =========================================================
      case 'HD2DHybridEditor':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('2.5D & HD-2D Hybrid Pipeline', 'Combine 2D Sprites with 3D normal mapping, dynamic lighting, and depth of field (Octopath / GameMaker 3D style).', <Layers size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 p-4 overflow-y-auto custom-scrollbar">
                  <h3 className="text-[#c9d1d9] font-bold text-[14px] flex items-center gap-2 mb-4 border-b border-[#30363d] pb-2">Sprite 3D Normal Setup</h3>
                  
                  <div className="w-full aspect-square bg-[#0a0a0a] border border-[#30363d] rounded mb-4 flex items-center justify-center relative overflow-hidden group">
                     {/* Fake Pixel Art Sprite Mock */}
                     <div className="absolute inset-0 bg-[#111]" style={{ backgroundImage: "linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
                     <UserSquare size={80} className="text-[#58a6ff] drop-shadow-[0_0_15px_rgba(88,166,255,0.8)] relative z-10 filter blur-[0.5px]" strokeWidth={1}/>
                     
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity z-20">
                        <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-white text-[11px] px-3 py-1 rounded font-bold">Select Sprite Sheet</button>
                     </div>
                  </div>

                  <div className="space-y-4 text-[11px]">
                     <label className="flex items-center justify-between text-[#c9d1d9]">
                        <span>Billboard Mode</span>
                        <select className="bg-[#0a0a0a] border border-[#30363d] rounded p-1 text-[#58a6ff] outline-none">
                           <option>Y-Axis (Cylindrical)</option>
                           <option>Camera Facing</option>
                           <option>Fixed</option>
                        </select>
                     </label>

                     <label className="flex items-center justify-between text-[#c9d1d9]">
                        <span>Cast 3D Shadows</span>
                        <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                     </label>

                     <label className="flex items-center justify-between text-[#c9d1d9]">
                        <span>Receive Lights (Normals)</span>
                        <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                     </label>
                  </div>

                  {/* Normal Map Generator */}
                  <div className="mt-6 border border-[#30363d] bg-[#0d1117] rounded p-3">
                     <h4 className="text-[#c9d1d9] font-bold text-[12px] mb-2 flex justify-between items-center">
                        Generated Normal Map <span className="bg-[#3fb950]/20 text-[#3fb950] px-1.5 py-0.5 rounded text-[9px] border border-[#3fb950]/30 filter saturate-200">ACTIVE</span>
                     </h4>
                     <div className="w-full h-24 bg-[#7f7fff] rounded border border-[#30363d] flex items-center justify-center mb-2 shadow-inner">
                        <UserSquare size={60} className="text-[#ff7f7f] mix-blend-color-dodge" strokeWidth={1}/>
                     </div>
                  </div>

                  {/* Offline AI Sprite to Normal Map */}
                  <div className="mt-8 bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] p-3 rounded shadow-lg">
                     <h3 className="text-[#bc8cff] font-bold text-[12px] flex items-center gap-2 mb-2"><Bot size={14}/> AI Sprite Enhancer </h3>
                     <p className="text-[10px] text-[#8b949e] mb-3">Offline AI can automatically infer 3D depth and generate Normal Maps, Emissive Maps, and Height Maps from flat 2D pixel art.</p>
                     <button className="w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 py-1.5 rounded text-[11px] font-bold flex items-center justify-center gap-2">
                        <Sparkles size={12}/> Generate HD-2D Textures
                     </button>
                  </div>
               </div>

               <div className="flex-1 bg-[#111] relative flex items-center justify-center border-l border-[#30363d] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#0a0a0a]"></div>
                  
                  {/* Fake 3D World rendering 2D sprites */}
                  <div className="relative w-[600px] h-[400px] perspective-[800px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                     
                     {/* 3D Floor (Grid) */}
                     <div className="absolute w-[800px] h-[800px] bg-[#222] border border-[#444] rounded-full shadow-[0_0_50px_rgba(0,0,0,0.8)]" style={{ transform: 'rotateX(75deg) translateZ(-100px)'}}>
                        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(#333 2px, transparent 2px), linear-gradient(90deg, #333 2px, transparent 2px)", backgroundSize: "40px 40px" }}></div>
                     </div>
                     
                     {/* 3D Box (Geometry) */}
                     <div className="absolute w-32 h-32 bg-[#30363d] border-2 border-[#58a6ff] drop-shadow-2xl flex items-center justify-center font-bold text-[#c9d1d9]" style={{ transform: 'rotateX(75deg) translateZ(40px) translateX(-150px) translateY(-50px)'}}>
                        3D PROP
                     </div>

                     {/* 2D Sprite standing up (Billboard) */}
                     <div className="absolute filter drop-shadow-2xl transform hover:scale-110 transition-transform cursor-pointer" style={{ transform: 'translateZ(0) translateY(-60px)' }}>
                        {/* Shadow cast on the floor */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/60 rounded-full blur-[4px]"></div>
                        
                        <div className="relative">
                           {/* Emulated dynamic lighting on sprite */}
                           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-500/30 to-[#58a6ff]/40 mix-blend-overlay z-10 pointer-events-none"></div>
                           <UserSquare size={140} className="text-[#3fb950] relative z-0" fill="#161b22" strokeWidth={1}/>
                        </div>
                     </div>

                     {/* Particle FX */}
                     <div className="absolute w-4 h-4 bg-orange-400 rounded-full blur-[2px] animate-ping" style={{ transform: 'translateZ(50px) translateX(60px) translateY(-40px)' }}></div>
                     <div className="absolute w-2 h-2 bg-yellow-300 rounded-full blur-[1px]" style={{ transform: 'translateZ(50px) translateX(55px) translateY(-35px)' }}></div>

                  </div>

                  {/* Engine HUD overlay */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                     <span className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] text-[#8b949e] px-2 py-1 rounded text-[10px] font-bold">Post-Process: <span className="text-[#3fb950]">Tilt Shift Blur ACTIVE</span></span>
                     <span className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] text-[#8b949e] px-2 py-1 rounded text-[10px] font-bold">Shadows: <span className="text-[#58a6ff]">Cascaded Soft</span></span>
                  </div>
               </div>
             </div>
           </div>
         );
  
      // =========================================================
      // Voxel & Destructible Engine (Teardown/Minecraft style)
      // =========================================================
      case 'VoxelEngine':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Voxel & Destruction Engine', 'Volumetric worlds, Marching Cubes, and real-time rigid body destruction.', <Box size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 p-4">
                  <h3 className="text-[#c9d1d9] font-bold text-[14px] mb-4">Voxel Chunk Settings</h3>
                  <div className="space-y-4 text-[11px]">
                     <div className="border border-[#30363d] bg-[#0d1117] p-3 rounded">
                        <label className="text-[#8b949e] font-bold block mb-2">Generation Algorithm</label>
                        <select className="w-full bg-[#161b22] border border-[#30363d] text-[#c9d1d9] p-1 rounded outline-none">
                           <option>3D Perlin + Octaves</option>
                           <option>FastNoise Lite</option>
                           <option>Marching Cubes (Smooth)</option>
                           <option>Dual Contouring</option>
                        </select>
                     </div>
                     <div className="border border-[#30363d] bg-[#0d1117] p-3 rounded space-y-2">
                        <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#f85149]"/> Real-time Destruction</label>
                        <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Asynchronous Chunk Meshing</label>
                        <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" className="accent-[#e3b341]"/> GPU Compute Shaders</label>
                     </div>
                  </div>

                  {/* AI Voxel Sculptor */}
                  <div className="mt-8 bg-[#0d1117] border border-[#f85149]/30 border-l-4 border-l-[#f85149] p-4 rounded shadow-lg">
                    <h3 className="text-[#f85149] font-bold text-[13px] flex items-center gap-2 mb-2"><Bot size={14}/> AI Volumetric Architect</h3>
                    <p className="text-[10px] text-[#8b949e] mb-3">Instruct the offline AI to generate complex volumetric structures or voxel art instantly.</p>
                    <textarea className="w-full bg-[#0a0a0a] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[11px] h-20 outline-none resize-none mb-2" placeholder="e.g. Generate a massive Gothic cathedral made entirely of 1x1m destructible stone voxels."></textarea>
                    <button className="w-full bg-[#f85149]/10 hover:bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/30 font-bold py-2 rounded text-[11px] flex justify-center items-center gap-2">
                       <Orbit size={14}/> Generate Voxel Blueprint
                    </button>
                 </div>
               </div>

               <div className="flex-1 bg-[#111] relative flex items-center justify-center p-8 overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
                  
                  {/* Fake Voxel Render View */}
                  <div className="relative w-[500px] h-[400px] flex items-center justify-center perspective-[800px]">
                     {/* Floating chunks chunk */}
                     <div className="absolute w-64 h-64 border-2 border-[#58a6ff]/50 bg-[#30363d]/50" style={{ transform: 'rotateX(60deg) rotateZ(45deg)', transformStyle: 'preserve-3d' }}>
                        {/* Voxels */}
                        {[...Array(9)].map((_, i) => (
                           <div key={i} className="absolute w-8 h-8 bg-[#3fb950] border border-[#238636] shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{
                              left: `${(i % 3) * 32 + 80}px`,
                              top: `${Math.floor(i / 3) * 32 + 80}px`,
                              transform: `translateZ(${Math.random() * 32}px)`
                           }}></div>
                        ))}
                     </div>

                     {/* Explosion / Destruction effect */}
                     <div className="absolute w-12 h-12 bg-orange-500 rounded-full blur-[10px] animate-pulse" style={{ transform: 'translateZ(100px) translateX(-50px)' }}></div>
                     {[...Array(12)].map((_, i) => (
                         <div key={'debris'+i} className="absolute w-2 h-2 bg-[#8b949e] border border-[#30363d]" style={{
                           transform: `translate(${(Math.random() - 0.5) * 150}px, ${(Math.random() - 0.5) * 150}px) rotate(${Math.random() * 360}deg)`
                         }}></div>
                     ))}
                  </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // Advanced Vehicle Physics Engine
      // =========================================================
      case 'VehiclePhysics':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Vehicle Dynamics Configurator', 'Tire friction curves (Pacejka), suspension telemetry, aerodynamic drag, and engine torque curves.', <Activity size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                  
                  <div className="flex gap-6">
                  <div className="w-[450px] bg-[#161b22] border border-[#30363d] rounded shadow-lg shrink-0 flex flex-col max-h-[500px]">
                     <div className="p-4 border-b border-[#30363d]">
                        <h3 className="text-[#c9d1d9] font-bold text-[14px] flex items-center gap-2"><Flame size={16} className="text-[#f85149]" /> Powertrain & Extreme Modification</h3>
                     </div>
                     <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-6">
                        
                        {/* Powertrain Type Selection */}
                        <div className="flex bg-[#0a0a0a] rounded border border-[#30363d] p-1">
                           <button className="flex-1 py-1.5 px-2 bg-[#21262d] text-[#c9d1d9] rounded text-[11px] font-bold">ICE (Combustion)</button>
                           <button className="flex-1 py-1.5 px-2 hover:bg-[#21262d] text-[#8b949e] rounded text-[11px] font-bold transition-colors">EV (Electric)</button>
                           <button className="flex-1 py-1.5 px-2 hover:bg-[#21262d] text-[#8b949e] rounded text-[11px] font-bold transition-colors">Hybrid (PHEV)</button>
                        </div>

                        {/* Internal Combustion Engine (ICE) Mods */}
                        <div className="flex flex-col gap-4">
                           <div className="flex justify-between items-center">
                              <label className="text-[#c9d1d9] text-[11px] font-bold">Engine Block</label>
                              <select className="bg-[#0a0a0a] border border-[#30363d] text-[#58a6ff] text-[11px] rounded px-2 py-1 outline-none font-bold">
                                 <option>Inline-4 2.0L</option>
                                 <option>Inline-6 3.0L</option>
                                 <option>V6 3.5L Twin-Turbo</option>
                                 <option>V8 5.0L Supercharged</option>
                                 <option>V10 5.2L N/A</option>
                                 <option>V12 6.5L N/A</option>
                                 <option>Rotary 1.3L</option>
                                 <option>Flat-6 4.0L</option>
                              </select>
                           </div>

                           <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px]">
                              <div>
                                 <label className="text-[#8b949e] font-bold block mb-1">Forged Internals (Pistons/Rods)</label>
                                 <select className="w-full bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded px-2 py-1">
                                    <option>Stock Cast</option>
                                    <option>Stage 1 Forged</option>
                                    <option>Billet Titanium (Max RPMS)</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="text-[#8b949e] font-bold block mb-1">Camshaft Profile</label>
                                 <select className="w-full bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded px-2 py-1">
                                    <option>Street (Smooth Idle)</option>
                                    <option>Track (Medium Lift)</option>
                                    <option>Drag (High Lift, Choppy)</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="text-[#8b949e] font-bold block mb-1">Forced Induction</label>
                                 <select className="w-full bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded px-2 py-1">
                                    <option>Naturally Aspirated</option>
                                    <option>Single Turbo (Big)</option>
                                    <option>Twin Turbo (Sequential)</option>
                                    <option>Roots Supercharger</option>
                                    <option>Centrifugal Supercharger</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="text-[#8b949e] font-bold block mb-1">Boost Pressure (PSI)</label>
                                 <div className="flex items-center gap-2">
                                    <input type="range" className="flex-1 accent-[#f85149]" min="0" max="45" defaultValue="18" />
                                    <span className="text-[#f85149] font-mono text-[10px] w-4 text-right">18</span>
                                 </div>
                              </div>
                              <div>
                                 <label className="text-[#8b949e] font-bold block mb-1">ECU Tuning</label>
                                 <select className="w-full bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded px-2 py-1">
                                    <option>Factory Base Map</option>
                                    <option>Piggyback Tuner</option>
                                    <option>Standalone ECU (Motec)</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="text-[#8b949e] font-bold block mb-1">Fuel Injectors</label>
                                 <select className="w-full bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded px-2 py-1">
                                    <option>500cc (Pump Gas)</option>
                                    <option>1000cc (E85 Ready)</option>
                                    <option>2000cc (Methanol)</option>
                                 </select>
                              </div>
                           </div>

                           {/* EV Options (Conditional mock UI) */}
                           <div className="mt-2 pt-4 border-t border-[#30363d]">
                              <h4 className="text-[#8b949e] font-bold text-[11px] mb-3 flex items-center gap-1"><Zap size={12} className="text-[#e3b341]" /> EV / Hybrid Powertrain Options</h4>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px]">
                                 <div>
                                    <label className="text-[#8b949e] block mb-1">Motor Configuration</label>
                                    <select className="w-full bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded px-2 py-1">
                                       <option>Single Motor (RWD)</option>
                                       <option>Dual Motor (AWD)</option>
                                       <option>Tri-Motor (Plaid)</option>
                                       <option>Quad Motor (Torque Vectoring)</option>
                                    </select>
                                 </div>
                                 <div>
                                    <label className="text-[#8b949e] block mb-1">Battery Chemistry</label>
                                    <select className="w-full bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded px-2 py-1">
                                       <option>Lithium-Ion (NMC)</option>
                                       <option>LiFePO4 (LFP)</option>
                                       <option>Solid State (High Density)</option>
                                    </select>
                                 </div>
                                 <div>
                                    <label className="text-[#8b949e] block mb-1">Inverter Mod</label>
                                    <select className="w-full bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded px-2 py-1">
                                       <option>Stock Silicon Max 400A</option>
                                       <option>Silicon Carbide (SiC) 800A</option>
                                       <option>Extreme SiC 1200A</option>
                                    </select>
                                 </div>
                                 <div>
                                    <label className="text-[#8b949e] block mb-1">Battery Cooling</label>
                                    <select className="w-full bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded px-2 py-1">
                                       <option>Air Cooled</option>
                                       <option>Liquid Glycol</option>
                                       <option>Immersion Cooling (Track)</option>
                                    </select>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="mt-2">
                           <h3 className="text-[#c9d1d9] font-bold text-[12px] mb-2 border-b border-[#30363d] pb-1">Live Engine Torque Curve</h3>
                           <div className="h-[120px] w-full bg-[#0d1117] relative border-l border-b border-[#30363d] rounded-bl">
                              {/* Torque Curve SVG Fake */}
                              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                 <path d="M 0 100 Q 100 10, 200 20 Q 300 30, 450 110" fill="none" stroke="#f85149" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                                 <path d="M 0 110 Q 150 5, 250 25 Q 350 50, 450 120" fill="none" stroke="#e3b341" strokeWidth="3" />
                              </svg>
                              <div className="absolute bottom-1 right-2 text-[8px] text-[#8b949e]">RPM</div>
                              <div className="absolute top-1 left-2 text-[8px] text-[#8b949e] tracking-wider" style={{ writingMode: 'vertical-rl' }}>TORQUE</div>
                           </div>
                        </div>

                     </div>
                  </div>

                     <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded p-4 shadow-lg flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b border-[#30363d] pb-2">
                           <h3 className="text-[#c9d1d9] font-bold text-[14px]">Suspension & Tire Model</h3>
                           <label className="flex items-center gap-2 text-[#c9d1d9] text-[11px] font-bold">
                              <input type="checkbox" defaultChecked className="accent-[#58a6ff]"/> Auto-Sync Transforms
                           </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-[11px]">
                           <div>
                              <label className="text-[#8b949e] font-bold block mb-1">Spring Stiffness</label>
                              <input type="range" className="w-full accent-[#58a6ff]" min="0" max="100" defaultValue="45" />
                           </div>
                           <div>
                              <label className="text-[#8b949e] font-bold block mb-1">Damping Compression</label>
                              <input type="range" className="w-full accent-[#58a6ff]" min="0" max="100" defaultValue="70" />
                           </div>
                           <div>
                              <div className="flex justify-between">
                                 <label className="text-[#8b949e] font-bold block mb-1">Pacejka Friction B (Stiffness)</label>
                                 <span className="text-[#3fb950] font-mono">0.8</span>
                              </div>
                              <input type="range" className="w-full accent-[#3fb950]" min="0" max="2" step="0.1" defaultValue="0.8" />
                           </div>
                           <div>
                              <div className="flex justify-between">
                                 <label className="text-[#8b949e] font-bold block mb-1">Pacejka Friction C (Shape)</label>
                                 <span className="text-[#3fb950] font-mono">0.5</span>
                              </div>
                              <input type="range" className="w-full accent-[#3fb950]" min="0" max="2" step="0.1" defaultValue="0.5" />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Telemetry Viewport */}
                  <div className="w-full h-[300px] bg-[#111] border border-[#30363d] rounded relative flex items-center justify-center overflow-hidden">
                     {/* Fake Car */}
                     <div className="w-[150px] h-[300px] border-4 border-[#30363d] rounded-[30px] flex items-center justify-center relative bg-gradient-to-t from-[#222] to-[#111]">
                        {/* Wheels */}
                        <div className="absolute -left-6 top-8 w-6 h-16 bg-[#f85149] rounded flex items-center justify-center"><div className="w-full h-0.5 bg-black"></div></div>
                        <div className="absolute -right-6 top-8 w-6 h-16 bg-[#f85149] rounded flex items-center justify-center"><div className="w-full h-0.5 bg-black"></div></div>
                        <div className="absolute -left-6 bottom-8 w-6 h-16 bg-[#3fb950] rounded flex items-center justify-center"><div className="w-full h-0.5 bg-black"></div></div>
                        <div className="absolute -right-6 bottom-8 w-6 h-16 bg-[#3fb950] rounded flex items-center justify-center"><div className="w-full h-0.5 bg-black"></div></div>
                        
                        {/* Forces Overlay */}
                        <div className="absolute left-1/2 top-1/2 w-0.5 h-32 bg-[#e3b341] origin-bottom transform translate-y-[-100%] rotate-12">
                           <div className="w-3 h-3 bg-[#e3b341] rounded-full absolute -top-1.5 -left-1"></div>
                        </div>
                        <span className="absolute top-1/2 left-1/2 ml-4 -mt-16 text-[#e3b341] font-mono text-[10px] font-bold">1.2G</span>
                     </div>

                     <div className="absolute right-4 top-4 bg-black/80 px-4 py-2 border border-[#30363d] rounded text-[10px] font-mono font-bold text-[#c9d1d9] space-y-1">
                        <div>Speed: <span className="text-[#3fb950]">142 km/h</span></div>
                        <div>Gear: <span className="text-[#58a6ff]">4th</span></div>
                        <div>Steer: <span className="text-[#e3b341]">-12.4 deg</span></div>
                        <div>Slip_RR: <span className="text-[#f85149]">1.04 !</span></div>
                     </div>
                  </div>

                  {/* Offline AI Vehicle Tuner */}
                   <div className="w-full bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] p-4 flex gap-6 items-center shadow-lg rounded">
                     <div className="flex-1">
                        <h3 className="text-[#bc8cff] font-bold text-[14px] flex items-center gap-2 mb-2"><Bot size={16}/> AI Handling Engineer (Reinforcement Learning)</h3>
                        <p className="text-[11px] text-[#8b949e]">The AI drives your vehicle 10,000 times around a virtual track, tweaking the suspension and downforce until it matches your desired handling profile.</p>
                     </div>
                     <select className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] p-2 text-[11px] outline-none">
                        <option>Target: Arcade Drift (Mario Kart style)</option>
                        <option>Target: Simcade (Forza style)</option>
                        <option>Target: Hardcore Sim (Assetto Corsa style)</option>
                     </select>
                     <button className="bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 py-2 px-6 rounded text-[11px] font-bold shadow">
                        Let AI Tune Car (2 mins)
                     </button>
                  </div>

               </div>
             </div>
           </div>
         );

      // =========================================================
      // Machine Learning Training Room (Unity ML-Agents style)
      // =========================================================
      case 'MLAgents':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Machine Learning Training Room', 'Deep Reinforcement Learning (PPO/SAC). Train NPCs to walk, balance, fight, or drive entirely via neural networks.', <BrainCircuit size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               {/* Left Controls */}
               <div className="w-[350px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 p-4 overflow-y-auto">
                  <h3 className="text-[#c9d1d9] font-bold text-[14px] mb-4">RL Hyperparameters</h3>
                  
                  <div className="space-y-3 mb-6 border-b border-[#30363d] pb-6 text-[11px]">
                     <div className="flex justify-between items-center text-[#c9d1d9]"><span>Learning Rate</span><input type="text" className="w-20 bg-[#0a0a0a] border border-[#30363d] p-1 text-right rounded font-mono" defaultValue="3.0e-4"/></div>
                     <div className="flex justify-between items-center text-[#c9d1d9]"><span>Batch Size</span><input type="text" className="w-20 bg-[#0a0a0a] border border-[#30363d] p-1 text-right rounded font-mono" defaultValue="1024"/></div>
                     <div className="flex justify-between items-center text-[#c9d1d9]"><span>Epochs</span><input type="text" className="w-20 bg-[#0a0a0a] border border-[#30363d] p-1 text-right rounded font-mono" defaultValue="3"/></div>
                     <div className="flex justify-between items-center text-[#c9d1d9]"><span>Algorithm</span>
                        <select className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] p-1 rounded">
                           <option>PPO (Proximal Policy)</option>
                           <option>SAC (Soft Actor-Critic)</option>
                           <option>DQN</option>
                        </select>
                     </div>
                  </div>

                  <h3 className="text-[#c9d1d9] font-bold text-[14px] mb-4 text-[#e3b341]">Reward Signals</h3>
                  <div className="space-y-2 mb-6">
                     <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex justify-between items-center">
                        <span className="text-[11px] text-[#3fb950] font-bold">Distance Traveled</span><span className="text-[#8b949e] text-[11px] font-mono">+1.0 / m</span>
                     </div>
                     <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex justify-between items-center">
                        <span className="text-[11px] text-[#f85149] font-bold">Fall Over</span><span className="text-[#8b949e] text-[11px] font-mono">-100.0</span>
                     </div>
                     <button className="text-[#58a6ff] hover:text-white text-[11px] font-bold flex items-center gap-1">+ Add Reward Logic</button>
                  </div>

                  <button className="w-full bg-[#3fb950] hover:bg-[#2ea043] text-white font-bold py-3 rounded-lg text-[14px] shadow-[0_0_15px_rgba(63,185,80,0.4)] flex justify-center items-center gap-2">
                     <Network size={18}/> START TRAINING LOOP
                  </button>
               </div>

               {/* Right Viewport (Grid of bots) */}
               <div className="flex-1 bg-[#111] relative p-8 flex flex-col">
                  {/* Grid of environments */}
                  <div className="flex-1 grid grid-cols-3 gap-6 relative z-10">
                     {[...Array(6)].map((_,i) => (
                        <div key={i} className="bg-[#161b22] border border-[#30363d] shadow-lg rounded-xl flex items-center justify-center relative overflow-hidden">
                           <div className="absolute bottom-4 w-3/4 h-2 bg-[#30363d] rounded"></div>
                           {/* Ragdoll / Bot mock */}
                           <div className="absolute w-8 h-12 flex flex-col items-center gap-1" style={{ transform: `rotate(${(Math.random()-0.5)*40}deg) translateY(${(Math.random() - 0.5)*20}px)` }}>
                              <div className="w-4 h-4 bg-[#58a6ff] rounded-full"></div>
                              <div className="w-6 h-8 bg-[#58a6ff] rounded-sm"></div>
                           </div>
                           <div className="absolute top-2 right-2 text-[9px] font-mono text-[#8b949e]">Env_{i}</div>
                           <div className="absolute bottom-2 left-2 text-[9px] font-mono font-bold text-[#e3b341]">Reward: {(Math.random() * 50).toFixed(1)}</div>
                        </div>
                     ))}
                  </div>
                  
                  {/* TensorBoard style graphs */}
                  <div className="h-[200px] w-full mt-6 bg-[#161b22] border border-[#30363d] rounded shadow-lg p-4 flex gap-6 z-10">
                     <div className="flex-1 flex flex-col">
                        <span className="text-[11px] text-[#c9d1d9] font-bold mb-2">Cumulative Reward</span>
                        <div className="flex-1 bg-[#0a0a0a] border-l border-b border-[#30363d] relative">
                           <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                              <path d="M 0 100 Q 100 80, 200 40 T 400 10" fill="none" stroke="#58a6ff" strokeWidth="2" />
                           </svg>
                        </div>
                     </div>
                     <div className="flex-1 flex flex-col">
                        <span className="text-[11px] text-[#c9d1d9] font-bold mb-2">Policy Loss</span>
                        <div className="flex-1 bg-[#0a0a0a] border-l border-b border-[#30363d] relative">
                           <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                              <path d="M 0 10 Q 50 80, 150 90 T 400 95" fill="none" stroke="#f85149" strokeWidth="2" />
                           </svg>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // XR / VR Development Hub (OpenXR)
      // =========================================================
      case 'VRXREngine':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('OpenXR VR/MR Development Hub', 'Foveated rendering, Passthrough config, Hand-tracking simulators, and spatial anchors.', <Glasses size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] flex flex-col p-4">
                  <h3 className="text-[#c9d1d9] font-bold text-[14px] flex items-center gap-2 mb-4"><MonitorPlay size={16}/> Target Hardware</h3>
                  <select className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] p-2 text-[12px] rounded outline-none w-full mb-6">
                     <option>Meta Quest 3 (Android OpenXR)</option>
                     <option>Apple Vision Pro (visionOS)</option>
                     <option>PC VR (SteamVR / Oculus PC)</option>
                     <option>PS VR2</option>
                  </select>

                  <h3 className="text-[#c9d1d9] font-bold text-[14px] flex items-center gap-2 mb-4">Rendering Pipeline</h3>
                  <div className="space-y-2 text-[11px] mb-6">
                     <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#bc8cff]"/> Stereo Instancing (Single Pass)</label>
                     <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" defaultChecked className="accent-[#bc8cff]"/> Fixed Foveated Rendering</label>
                     <label className="flex items-center gap-2 text-[#c9d1d9]"><input type="checkbox" className="accent-[#bc8cff]"/> Application SpaceWarp</label>
                  </div>

                  <h3 className="text-[#c9d1d9] font-bold text-[14px] flex items-center gap-2 mb-4">Mixed Reality</h3>
                  <div className="space-y-2 text-[11px]">
                     <label className="flex items-center gap-2 text-[#e3b341]"><input type="checkbox" className="accent-[#e3b341]"/> Enable Passthrough</label>
                     <label className="flex items-center gap-2 text-[#e3b341]"><input type="checkbox" className="accent-[#e3b341]"/> Spatial Anchors</label>
                     <label className="flex items-center gap-2 text-[#e3b341]"><input type="checkbox" className="accent-[#e3b341]"/> Scene Understanding (Plane gen)</label>
                  </div>
               </div>

               <div className="flex-1 bg-[#111] relative flex items-center justify-center border-l border-[#30363d]">
                  
                  {/* VR Simulator View */}
                  <div className="relative w-full h-full flex flex-col p-8">
                     <div className="text-[#8b949e] font-bold text-xl flex items-center gap-3 drop-shadow mb-4"><Eye size={24}/> Binocular Rendering Preview</div>
                     <div className="flex gap-4 h-[300px] w-full justify-center items-center">
                        {/* Left Eye */}
                        <div className="w-[300px] h-[300px] bg-black rounded-full overflow-hidden border-4 border-[#30363d] relative flex items-center justify-center shadow-2xl">
                           <div className="absolute inset-x-0 h-px bg-red-500/30"></div>
                           <div className="absolute inset-y-0 w-px bg-green-500/30"></div>
                           <Box size={100} className="text-[#c9d1d9] transform -translate-x-2"/>
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50" style={{ mixBlendMode: 'multiply' }}></div>
                        </div>
                        {/* Right Eye */}
                        <div className="w-[300px] h-[300px] bg-black rounded-full overflow-hidden border-4 border-[#30363d] relative flex items-center justify-center shadow-2xl">
                           <div className="absolute inset-x-0 h-px bg-red-500/30"></div>
                           <div className="absolute inset-y-0 w-px bg-green-500/30"></div>
                           <Box size={100} className="text-[#c9d1d9] transform translate-x-2"/>
                           <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/50" style={{ mixBlendMode: 'multiply' }}></div>
                        </div>
                     </div>

                     {/* Hand Tracking Simulator UI */}
                     <div className="mt-auto bg-[#161b22] border border-[#30363d] p-6 rounded-lg flex items-center gap-8 shadow-lg">
                        <div className="flex flex-col gap-2 flex-1">
                           <span className="text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2"><Activity size={14} className="text-[#3fb950]"/> Hand Tracking Emulator (Mouse inputs)</span>
                           <span className="text-[10px] text-[#8b949e]">Hold Space + Move Mouse to translate hands. Hold Shift to rotate. Click to pinch.</span>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-[#f85149] animate-pulse"></span>
                              <span className="text-[11px] text-[#f85149] font-bold">Left Hand: Lost</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-[#3fb950]"></span>
                              <span className="text-[11px] text-[#3fb950] font-bold">Right Hand: Tracking</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
           </div>
         );

      // =========================================================
      // DevOps & CI/CD Cross-Platform Builder
      // =========================================================
      case 'DevOpsBuilder':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Cross-Platform Matrix & DevOps Config', 'Configure IL2CPP, Shader Compilation, Code Signing, and one-click publish pipelines.', <Terminal size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               <div className="flex-1 flex flex-col p-6 overflow-y-auto w-full custom-scrollbar">
                  
                  <h2 className="text-xl font-bold text-[#c9d1d9] mb-6 flex items-center gap-2"><Server size={20}/> Build Targets & Pipeline</h2>
                  
                  <div className="grid grid-cols-4 gap-4 mb-8">
                     <div className="bg-[#21262d] border border-[#58a6ff] rounded p-4 shadow-lg cursor-pointer hover:bg-[#30363d]">
                        <div className="flex justify-between items-center mb-3">
                           <Activity size={24} className="text-[#58a6ff]"/>
                           <span className="bg-[#3fb950]/20 text-[#3fb950] text-[9px] font-bold px-2 py-0.5 rounded border border-[#3fb950]/30">ACTIVE</span>
                        </div>
                        <h3 className="text-[#c9d1d9] font-bold text-[14px]">Windows 64-bit</h3>
                        <div className="text-[10px] text-[#8b949e] mt-1">DirectX 12 / Vulkan</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#30363d] rounded p-4 shadow cursor-pointer hover:bg-[#21262d]">
                        <div className="flex justify-between items-center mb-3">
                           <Gamepad2 size={24} className="text-[#8b949e]"/>
                        </div>
                        <h3 className="text-[#c9d1d9] font-bold text-[14px]">PlayStation 5</h3>
                        <div className="text-[10px] text-[#8b949e] mt-1">Require DevKit SDK</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#30363d] rounded p-4 shadow cursor-pointer hover:bg-[#21262d]">
                        <div className="flex justify-between items-center mb-3">
                           <BoxSelect size={24} className="text-[#8b949e]"/>
                        </div>
                        <h3 className="text-[#c9d1d9] font-bold text-[14px]">Xbox Series X|S</h3>
                        <div className="text-[10px] text-[#8b949e] mt-1">GDK Installed</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#30363d] rounded p-4 shadow cursor-pointer hover:bg-[#21262d]">
                        <div className="flex justify-between items-center mb-3">
                           <Ghost size={24} className="text-[#8b949e]"/>
                        </div>
                        <h3 className="text-[#c9d1d9] font-bold text-[14px]">Nintendo Switch™</h3>
                        <div className="text-[10px] text-[#f85149] mt-1 font-bold">SDK Missing</div>
                     </div>
                  </div>

                  <div className="flex gap-6">
                     <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded shadow p-6">
                        <h3 className="text-[#c9d1d9] font-bold text-[14px] border-b border-[#30363d] pb-2 mb-4">Windows Build Settings</h3>
                        
                        <div className="grid grid-cols-2 gap-6 text-[12px]">
                           <div>
                              <p className="text-[#8b949e] font-bold mb-2">Scripting Backend</p>
                              <select className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded p-2 w-full outline-none">
                                 <option>IL2CPP (AOT Compilation)</option>
                                 <option>Mono (JIT)</option>
                              </select>
                           </div>
                           <div>
                              <p className="text-[#8b949e] font-bold mb-2">C++ Compiler Config</p>
                              <select className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] rounded p-2 w-full outline-none">
                                 <option>Release (O3, LTO enabled)</option>
                                 <option>Development</option>
                                 <option>Debug</option>
                              </select>
                           </div>
                        </div>

                        <div className="mt-6 border-t border-[#30363d] pt-4 flex items-center justify-between">
                           <label className="flex items-center gap-2 text-[#c9d1d9] text-[12px]"><input type="checkbox" defaultChecked className="accent-[#3fb950]"/> Compress Pak/Asset Bundles (LZ4HC)</label>
                           <button className="bg-[#3fb950] hover:bg-[#2ea043] text-white font-bold py-2 px-8 rounded shadow text-[14px] flex items-center gap-2"><ArrowUpSquare size={16}/> Build Now</button>
                        </div>
                     </div>

                     <div className="w-[350px] bg-[#0d1117] border border-[#bc8cff]/30 border-l-4 border-l-[#bc8cff] p-4 rounded shadow-lg shrink-0 flex flex-col gap-3">
                        <h3 className="text-[#bc8cff] font-bold text-[13px] flex items-center gap-2 mb-2"><Bot size={14}/> AI Cloud Compiler Agent</h3>
                        <p className="text-[11px] text-[#8b949e]">Why wait 3 hours for shaders to compile? The AI Agent offloads massive C++ compilation and Shader variant caching to our massively scalable cloud GPUs.</p>
                        
                        <div className="bg-[#0a0a0a] border border-[#30363d] p-2 rounded flex justify-between items-center">
                           <div className="text-[10px] text-[#c9d1d9]">Local Build Est.</div>
                           <div className="text-[12px] text-[#f85149] font-mono font-bold">~ 2h 15m</div>
                        </div>
                        <div className="bg-[#21262d] border border-[#bc8cff]/50 p-2 rounded flex justify-between items-center shadow-[0_0_10px_rgba(188,140,255,0.1)]">
                           <div className="text-[10px] text-[#c9d1d9] flex gap-1"><Cloud size={12} className="text-[#bc8cff]"/> AI Cloud Burst Est.</div>
                           <div className="text-[12px] text-[#3fb950] font-mono font-bold">~ 4m 30s</div>
                        </div>

                        <button className="w-full mt-auto bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 py-2 rounded text-[11px] font-bold flex justify-center items-center gap-2">
                           <Zap size={14}/> Initiate AI Turbo Build
                        </button>
                     </div>
                  </div>
               </div>
             </div>
           </div>
         );
  default:
         return (
           <div className="flex items-center justify-center h-full text-[#8b949e] flex-col gap-4">
             <Settings2 size={48} className="opacity-20" />
             <div className="text-[14px]">Advanced Integration for {moduleType}</div>
             <div className="text-[12px] opacity-70">Apex Engine Core Configuration</div>
           </div>
         );
    }
  };

  return (
    <div className="w-full h-full bg-[#0d1117] flex flex-col font-['Helvetica_Neue',Arial,sans-serif]">
       {getModuleContent()}
    </div>
  );
}

// simple inline icon
function GridIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="3" y1="15" x2="21" y2="15"></line>
      <line x1="9" y1="3" x2="9" y2="21"></line>
      <line x1="15" y1="3" x2="15" y2="21"></line>
    </svg>
  );
}
