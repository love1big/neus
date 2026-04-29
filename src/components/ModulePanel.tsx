import React, { useState, useEffect } from 'react';
import { Database, Bot, FileText, Settings, Ghost, Map as MapIcon, Users, Settings2, Globe, Mountain, HardDrive, Gamepad2, Orbit, Droplets, Flame, Wind, Zap, Blocks, Cpu, MonitorPlay, Activity, Cloud, ShieldCheck, BoxSelect, Layers, Code2, Network, AudioWaveform, Videotape, Fingerprint, CloudCog, ShieldAlert, ActivitySquare, CheckCircle, Bug, TrendingUp, DownloadCloud, UserSquare, Workflow, Image as ImageIcon, Music, Play, Pause, FastForward, Rewind, Mic, Sliders, Wand2, Plus, Sparkles, Clapperboard, PersonStanding, FolderTree, TerminalSquare, AlertTriangle, ShieldX, Copy, RefreshCw, Ruler, X, Eye, Lock, Sun, CloudRain, MousePointer2, Move3D, Rotate3D, Scale3D, PenTool, Minimize2, Pen, Scissors, ChevronRight, Video, ChevronDown, Bone, Wrench, Dot, Minus, Square, FileCode2, Volume2, Search, Variable, Palette, SlidersHorizontal, LayoutDashboard, Layout, Box, AlignLeft, AlignCenter, AlignRight, Link2, MoveHorizontal, MoveVertical, RotateCw } from 'lucide-react';

const AITestingQAPanel = ({ renderHeader }: { renderHeader: any }) => {
  const [testActive, setTestActive] = useState(false);
  const [logs, setLogs] = useState<{msg: string, status: 'info'|'warn'|'error'|'success'}[]>([]);
  const [phase, setPhase] = useState('Standby');
  const [progress, setProgress] = useState(0);
  const [vulnerabilitiesFound, setVulnerabilitiesFound] = useState(0);

  const runAudit = () => {
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
        setTimeout(() => {
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

interface ModulePanelProps {

  moduleType: string;
}

export default function ModulePanel({ moduleType }: ModulePanelProps) {
  
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
             {renderHeader('Apex Terrain & Landscape Editor', 'Advanced procedural heightmap sculpting, hydraulic erosion, and layer painting.', <Mountain size={28} />)}
             <div className="flex-1 flex overflow-hidden">
               {/* Sidebar Tools */}
               <div className="w-[300px] border-r border-[#30363d] bg-[#161b22] flex flex-col p-4 gap-6 overflow-y-auto custom-scrollbar shrink-0">
                 
                 {/* Heightmap Importer */}
                 <div className="flex flex-col gap-2">
                   <div className="text-[10px] uppercase font-bold text-[#8b949e] tracking-wider flex justify-between">
                     <span>Base Generation</span>
                   </div>
                   <div className="flex flex-col gap-2 text-[11px]">
                      <button className="bg-[#21262d] border border-[#30363d] text-white py-1.5 rounded hover:bg-[#30363d] text-center w-full flex justify-center items-center gap-1"><MapIcon size={12}/> Import RAW/PNG-16</button>
                      <button className="bg-[#21262d] border border-[#30363d] text-white py-1.5 rounded hover:bg-[#30363d] text-center w-full flex justify-center items-center gap-1"><Workflow size={12}/> Sub-Graph Generator</button>
                   </div>
                 </div>

                 {/* Sculpting Tools */}
                 <div className="flex flex-col gap-3">
                   <div className="text-[10px] uppercase font-bold text-[#8b949e] tracking-wider border-b border-[#30363d] pb-1">Sculpting Brushes</div>
                   <div className="grid grid-cols-3 gap-2">
                     <button className="bg-[#21262d] border border-[#58a6ff] text-[#58a6ff] rounded p-2 text-[10px] flex flex-col items-center gap-1 font-bold shadow-[0_0_10px_rgba(88,166,255,0.2)]"><Mountain size={16}/> Raise</button>
                     <button className="bg-[#0a0a0a] border border-[#30363d] hover:border-[#8b949e] text-[#8b949e] rounded p-2 text-[10px] flex flex-col items-center gap-1"><Droplets size={16}/> Lower</button>
                     <button className="bg-[#0a0a0a] border border-[#30363d] hover:border-[#8b949e] text-[#8b949e] rounded p-2 text-[10px] flex flex-col items-center gap-1"><Wind size={16}/> Smooth</button>
                     <button className="bg-[#0a0a0a] border border-[#30363d] hover:border-[#8b949e] text-[#8b949e] rounded p-2 text-[10px] flex flex-col items-center gap-1"><BoxSelect size={16}/> Flatten</button>
                     <button className="bg-[#0a0a0a] border border-[#30363d] hover:border-[#8b949e] text-[#8b949e] rounded p-2 text-[10px] flex flex-col items-center gap-1"><Flame size={16}/> Erode</button>
                     <button className="bg-[#0a0a0a] border border-[#30363d] hover:border-[#8b949e] text-[#8b949e] rounded p-2 text-[10px] flex flex-col items-center gap-1"><Zap size={16}/> Noise</button>
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
               <div className="flex-1 bg-[#000] relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" style={{ perspective: '800px', transform: 'rotateX(60deg) scale(2)' }}></div>
                  
                  <div className="flex flex-col items-center gap-4 z-10 opacity-30">
                    <Mountain size={64} className="text-[#3fb950]" />
                    <span className="text-[#8b949e] font-mono text-[14px]">3D Viewport: Select a brush to start sculpting here.</span>
                  </div>

                  <div className="absolute top-4 left-4 flex gap-2">
                     <button className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] px-2 py-1 rounded">Top</button>
                     <button className="bg-[#21262d] border border-[#58a6ff] text-[#58a6ff] text-[11px] px-2 py-1 rounded">Perspective</button>
                     <button className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] px-2 py-1 rounded">Wireframe</button>
                  </div>
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
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex 3D & 2D Studio', 'High-end 3D modeling, sculpting, UV unwrapping, and 2D texture editing (ZBrush/Maya/Blender equivalent)', <BoxSelect size={28} />)}
             
             <div className="flex-1 flex overflow-hidden">
               {/* Left Panel: Tool Shelf (Blender/Maya style) */}
               <div className="w-[60px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar items-center py-2 gap-2">
                 <button className="p-2 text-[#58a6ff] hover:bg-[#21262d] rounded-lg" title="Select (Q)"><MousePointer2 size={20} /></button>
                 <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] hover:text-[#58a6ff] rounded-lg" title="Move (W)"><Move3D size={20} /></button>
                 <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] hover:text-[#58a6ff] rounded-lg" title="Rotate (E)"><Rotate3D size={20} /></button>
                 <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] hover:text-[#58a6ff] rounded-lg" title="Scale (R)"><Scale3D size={20} /></button>
                 <div className="w-8 h-[1px] bg-[#30363d] my-1"></div>
                 {/* Sculpting Tools (ZBrush style) */}
                 <button className="p-2 text-[#f85149] hover:bg-[#21262d] hover:text-[#f85149] rounded-lg" title="Sculpt: Draw"><PenTool size={20} /></button>
                 <button className="p-2 text-[#8b949e] hover:bg-[#21262d] hover:text-[#f85149] rounded-lg" title="Sculpt: Smooth"><Wind size={20} /></button>
                 <button className="p-2 text-[#8b949e] hover:bg-[#21262d] hover:text-[#f85149] rounded-lg" title="Sculpt: Pinch"><Minimize2 size={20} /></button>
                 <button className="p-2 text-[#8b949e] hover:bg-[#21262d] hover:text-[#f85149] rounded-lg" title="Sculpt: Flatten"><BoxSelect size={20} /></button>
                 <div className="w-8 h-[1px] bg-[#30363d] my-1"></div>
                 {/* Retopology & UV (Maya/3ds Max style) */}
                 <button className="p-2 text-[#3fb950] hover:bg-[#21262d] hover:text-[#3fb950] rounded-lg" title="Retopology / Polygon Pen"><Pen size={20} /></button>
                 <button className="p-2 text-[#e3b341] hover:bg-[#21262d] hover:text-[#e3b341] rounded-lg" title="UV Unwrapping"><Scissors size={20} /></button>
               </div>

               {/* Center Workspace */}
               <div className="flex-1 bg-[#111] relative flex flex-col items-center justify-center border-r border-[#30363d] overflow-hidden group/viewport">
                 <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-50 group-hover/viewport:opacity-100 transition-opacity">
                    <select className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] px-2 py-1 rounded outline-none">
                      <option>Shading: Lit</option>
                      <option>Shading: Wireframe</option>
                      <option>Shading: Solid</option>
                    </select>
                    <select className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] px-2 py-1 rounded outline-none">
                      <option>View: Perspective</option>
                      <option>View: Front</option>
                      <option>View: Top</option>
                    </select>
                 </div>

                 {/* Mock 3D Grid Overlay */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [transform:rotateX(60deg)_scale(2)] origin-bottom pointer-events-none"></div>
                 
                 {/* Gizmo Mock */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none flex items-center justify-center">
                    <div className="w-16 h-1 bg-[#f85149] absolute ml-16 transform translate-x-4 shadow-[0_0_10px_#f85149]"></div>
                    <div className="w-1 h-16 bg-[#3fb950] absolute mb-16 transform -translate-y-4 shadow-[0_0_10px_#3fb950]"></div>
                    <div className="w-1 h-12 bg-[#58a6ff] absolute transform -translate-x-4 translate-y-4 rotate-45 shadow-[0_0_10px_#58a6ff]"></div>
                    <div className="w-3 h-3 bg-white border border-black z-10"></div>
                 </div>

                 <div className="opacity-30 absolute">
                    <Box size={180} className="text-[#58a6ff]" />
                 </div>
                 
                 {/* Bottom Context Bar */}
                 <div className="absolute bottom-4 left-4 z-10 flex gap-2 text-[10px] text-[#8b949e]">
                    <div className="bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-1">Verts: 24,512</div>
                    <div className="bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-1">Faces: 24,510</div>
                    <div className="bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-1">Tris: 49,020</div>
                 </div>
               </div>

               {/* Right Panel: Advanced Outliner, Properties, and AI */}
               <div className="w-[320px] bg-[#0d1117] flex flex-col shrink-0 overflow-hidden">
                 {/* Tabs */}
                 <div className="flex text-[11px] font-bold text-[#8b949e] border-b border-[#30363d] bg-[#0d1117] shrink-0">
                    <button className="flex-1 py-1.5 text-center hover:bg-[#161b22] hover:text-white border-b-2 border-transparent">Outliner</button>
                    <button className="flex-1 py-1.5 text-center hover:bg-[#161b22] hover:text-[#58a6ff] border-b-2 border-[#58a6ff] text-white bg-[#161b22]">Properties</button>
                    <button className="flex-1 py-1.5 text-center hover:bg-[#161b22] hover:text-white border-b-2 border-transparent flex gap-1 justify-center items-center"><Sparkles size={10} className="text-[#e3b341]"/> AI Gen</button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                    
                    {/* Transform Properties */}
                    <div className="p-3 border-b border-[#30363d] flex flex-col gap-2">
                       <div className="text-[11px] text-[#c9d1d9] font-bold uppercase tracking-wide">Transform</div>
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-[10px]">
                             <span className="text-[#8b949e] w-12">Location</span>
                             <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-1 py-0.5 rounded text-[#f85149] text-right font-mono" defaultValue="0.0m" />
                             <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-1 py-0.5 rounded text-[#3fb950] text-right font-mono" defaultValue="2.5m" />
                             <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-1 py-0.5 rounded text-[#58a6ff] text-right font-mono" defaultValue="-1.0m" />
                          </div>
                          <div className="flex items-center gap-2 text-[10px]">
                             <span className="text-[#8b949e] w-12">Rotation</span>
                             <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-1 py-0.5 rounded text-[#f85149] text-right font-mono" defaultValue="0°" />
                             <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-1 py-0.5 rounded text-[#3fb950] text-right font-mono" defaultValue="45°" />
                             <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-1 py-0.5 rounded text-[#58a6ff] text-right font-mono" defaultValue="0°" />
                          </div>
                          <div className="flex items-center gap-2 text-[10px]">
                             <span className="text-[#8b949e] w-12">Scale</span>
                             <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-1 py-0.5 rounded text-[#f85149] text-right font-mono" defaultValue="1.0" />
                             <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-1 py-0.5 rounded text-[#3fb950] text-right font-mono" defaultValue="1.0" />
                             <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-1 py-0.5 rounded text-[#58a6ff] text-right font-mono" defaultValue="1.0" />
                          </div>
                       </div>
                    </div>

                    {/* Modifier Stack (3ds Max/Blender style) */}
                    <div className="flex flex-col border-b border-[#30363d]">
                       <div className="px-3 py-2 bg-[#161b22] text-[11px] font-bold text-[#c9d1d9] flex justify-between items-center cursor-pointer hover:bg-[#21262d]">
                          <span className="flex items-center gap-2"><Wrench size={12}/> Modifiers</span>
                          <button className="bg-[#58a6ff]/20 px-2 py-0.5 rounded text-[#58a6ff] hover:bg-[#58a6ff]/30 flex items-center gap-1 border border-[#58a6ff]/50">Add <ChevronDown size={10}/></button>
                       </div>
                       <div className="p-2 bg-[#0d1117] flex flex-col gap-2">
                          <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col">
                             <div className="flex justify-between items-center p-1.5 text-[10px] text-[#c9d1d9] font-bold bg-[#21262d] rounded-t border-b border-[#30363d]">
                               <span className="flex items-center gap-1"><Layers size={10} className="text-[#58a6ff]"/> Subdivision Surface</span>
                               <div className="flex gap-2 text-[#8b949e]">
                                 <Eye size={12} className="hover:text-white cursor-pointer"/> <X size={12} className="hover:text-[#f85149] cursor-pointer"/>
                               </div>
                             </div>
                             <div className="p-2 text-[10px] flex flex-col gap-1">
                               <div className="flex justify-between items-center text-[#8b949e]">
                                 <span>Algorithm</span>
                                 <select className="bg-[#0a0a0a] border border-[#30363d] rounded px-1 text-white"><option>Catmull-Clark</option></select>
                               </div>
                               <div className="flex justify-between items-center text-[#8b949e] mt-1">
                                 <span>Levels Viewport</span>
                                 <input type="range" className="w-16 accent-[#58a6ff]" defaultValue="2"/>
                                 <span className="text-white w-4 text-right">2</span>
                               </div>
                               <div className="flex justify-between items-center text-[#8b949e]">
                                 <span>Levels Render</span>
                                 <input type="range" className="w-16 accent-[#58a6ff]" defaultValue="4"/>
                                 <span className="text-white w-4 text-right">4</span>
                               </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Additional Modifiers AI Toolset */}
                    <div className="bg-[#161b22] border-x border-b border-[#30363d] px-2 pb-2">
                       <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col">
                          <div className="flex justify-between items-center p-1.5 text-[10px] text-[#c9d1d9] font-bold bg-[#21262d] rounded-t border-b border-[#30363d]">
                            <span className="flex items-center gap-1"><AlignLeft size={10} className="text-[#3fb950]"/> Boolean</span>
                            <div className="flex gap-2 text-[#8b949e]">
                              <Eye size={12} className="hover:text-white cursor-pointer"/> <X size={12} className="hover:text-[#f85149] cursor-pointer"/>
                            </div>
                          </div>
                          <div className="p-2 text-[10px] flex flex-col gap-1">
                            <div className="flex justify-between items-center text-[#8b949e]">
                              <span>Operation</span>
                              <select className="bg-[#0a0a0a] border border-[#30363d] rounded px-1 text-white"><option>Difference</option><option>Union</option><option>Intersect</option></select>
                            </div>
                            <div className="flex justify-between items-center text-[#8b949e] mt-1">
                              <span>Target</span>
                              <select className="bg-[#0a0a0a] border border-[#30363d] rounded px-1 text-white"><option>Cutter_Cube_01</option></select>
                            </div>
                          </div>
                       </div>
                    </div>

                    {/* Offline AI Toolset */}
                    <div className="p-3 bg-[#e3b341]/5 flex flex-col gap-3">
                       <div className="flex items-center justify-between text-[11px] font-bold text-[#e3b341]">
                          <span className="flex items-center gap-1.5"><Cpu size={14}/> OFFLINE AI STUDIO</span>
                          <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" title="Tensor Compute Online"></div>
                       </div>
                       
                       {/* AI Auto-Retopology */}
                       <div className="bg-[#21262d] border border-[#30363d] rounded p-2 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-[#c9d1d9]">
                             <span className="flex items-center gap-1"><RefreshCw size={10} className="text-[#58a6ff]"/> AI Quad-Remesher</span>
                          </div>
                          <div className="text-[9px] text-[#8b949e] leading-tight">Convert dense sculpted meshes or photogrammetry into clean, animation-ready quad topology locally.</div>
                          <div className="flex gap-2 text-[9px] items-center text-[#8b949e]">
                             Target Polycount: <input className="w-16 bg-[#0a0a0a] border border-[#30363d] px-1 py-0.5 rounded text-[#fff]" defaultValue="15000" />
                          </div>
                          <div className="flex items-center gap-2 text-[9px] text-[#c9d1d9]">
                             <input type="checkbox" className="accent-[#58a6ff]" defaultChecked/> Preserve Hard Edges
                          </div>
                          <button className="w-full bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50 font-bold text-[10px] py-1 rounded hover:bg-[#58a6ff]/30 mt-1 shadow-inner">Retopologize Mesh</button>
                       </div>

                       {/* AI UV Seamer */}
                       <div className="bg-[#21262d] border border-[#30363d] rounded p-2 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-[#c9d1d9]">
                             <span className="flex items-center gap-1"><Scissors size={10} className="text-[#3fb950]"/> AI UV Auto-Seamer</span>
                          </div>
                          <div className="text-[9px] text-[#8b949e] leading-tight">Neural UV unwrapping to calculate optimal seams, minimizing distortion and texture stretching.</div>
                          <button className="w-full bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50 font-bold text-[10px] py-1 rounded hover:bg-[#3fb950]/30 mt-1 shadow-inner">Generate UV Seams</button>
                       </div>

                       {/* Image to 3D */}
                       <div className="bg-[#21262d] border border-[#30363d] rounded p-2 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-[#c9d1d9]">
                             <span className="flex items-center gap-1"><ImageIcon size={10} className="text-[#bc8cff]"/> Image to 3D (TripoSR/LGM)</span>
                          </div>
                          <div className="text-[9px] text-[#8b949e] leading-tight">Offline rapid inference: Upload a single image to generate a base 3D mesh + textures.</div>
                          <button className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[9px] py-1 rounded hover:bg-[#30363d] flex justify-center items-center gap-1"><Plus size={10}/> Select Image Reference</button>
                          <button className="w-full bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/50 font-bold text-[10px] py-1 rounded hover:bg-[#bc8cff]/30 mt-1 shadow-inner">Generate 3D Model</button>
                       </div>

                       {/* AI Photogrammetry */}
                       <div className="bg-[#21262d] border border-[#30363d] rounded p-2 flex flex-col gap-1.5 ">
                          <div className="flex items-center justify-between text-[10px] font-bold text-[#c9d1d9]">
                             <span className="flex items-center gap-1"><Video size={10} className="text-[#f85149]"/> Offline Photogrammetry</span>
                          </div>
                          <div className="text-[9px] text-[#8b949e] leading-tight">Convert a video or image sequence into a high-density 3D scan locally.</div>
                          <button className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[9px] py-1 rounded hover:bg-[#30363d] flex justify-center items-center gap-1"><Plus size={10}/> Add Video / Seq</button>
                          <div className="w-full bg-[#0a0a0a] rounded h-1 mt-1"><div className="bg-[#f85149] w-[0%] h-full rounded"></div></div>
                          <button className="w-full bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/50 font-bold text-[10px] py-1 rounded hover:bg-[#f85149]/30 shadow-inner">Start Point Cloud Gen</button>
                       </div>

                       {/* PBR Material Gen */}
                       <div className="bg-[#21262d] border border-[#30363d] rounded p-2 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-[#c9d1d9]">
                             <span className="flex items-center gap-1"><Palette size={10} className="text-[#e3b341]"/> AI PBR Material Extraction</span>
                          </div>
                          <div className="text-[9px] text-[#8b949e] leading-tight">Generate Normal, Roughness, Metallic, and Ambient Occlusion maps directly from diffuse albedo.</div>
                          <button className="w-full bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/50 font-bold text-[10px] py-1 rounded hover:bg-[#e3b341]/30 shadow-inner">Extract PBR Maps</button>
                       </div>
                    </div>
                 </div>
               </div>
             </div>
           </div>
         );
                           case 'ImageEdit':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex Compositing & Texture Studio', 'Professional 2D texture editing, layer compositing, node-based VFX, and color grading.', <ImageIcon size={28} />)}
             <div className="flex-1 flex overflow-hidden">
                {/* Left Tool Palette */}
                <div className="w-[50px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 items-center py-2 gap-2 text-[#8b949e] overflow-y-auto custom-scrollbar">
                   <button className="p-2 hover:bg-[#21262d] hover:text-white rounded text-[#58a6ff]" title="Move Tool (V)"><MousePointer2 size={16}/></button>
                   <button className="p-2 hover:bg-[#21262d] hover:text-white rounded" title="Marquee Selection (M)"><BoxSelect size={16}/></button>
                   <button className="p-2 hover:bg-[#21262d] hover:text-white rounded" title="Magic Wand AI Select (W)"><Wand2 size={16}/></button>
                   <button className="p-2 hover:bg-[#21262d] hover:text-white rounded" title="Auto Crop (C)"><Scissors size={16}/></button>
                   <div className="w-6 h-[1px] bg-[#30363d] my-1"></div>
                   <button className="p-2 hover:bg-[#21262d] hover:text-white rounded" title="Pen Tool (P)"><PenTool size={16}/></button>
                   <button className="p-2 hover:bg-[#21262d] hover:text-white rounded" title="Brush (B)"><Pen size={16}/></button>
                   <button className="p-2 hover:bg-[#21262d] hover:text-white rounded" title="Clone Stamp (S)"><Copy size={16}/></button>
                   <button className="p-2 hover:bg-[#21262d] hover:text-white rounded" title="Healing Brush (J)"><Wrench size={16}/></button>
                   <div className="w-6 h-[1px] bg-[#30363d] my-1"></div>
                   <button className="p-2 hover:bg-[#21262d] hover:text-white rounded" title="Blur / Sharpen"><Droplets size={16}/></button>
                   <button className="p-2 hover:bg-[#21262d] hover:text-white rounded" title="Dodge / Burn"><Sun size={16}/></button>
                   <button className="p-2 hover:bg-[#21262d] hover:text-white rounded" title="Color Picker (I)"><Palette size={16}/></button>
                   <button className="p-2 hover:bg-[#21262d] hover:text-white rounded" title="Ruler / Measure (U)"><Ruler size={16}/></button>
                   <div className="flex-1"></div>
                   <div className="w-6 h-[1px] bg-[#30363d] my-1"></div>
                   <div className="w-6 h-6 rounded-full border-2 border-white bg-[#f85149] shadow-[0_0_10px_#f85149]"></div>
                   <div className="w-6 h-6 rounded-full border border-[#8b949e] bg-[#000]"></div>
                </div>

                {/* Center Image View & Node Editor combo */}
                <div className="flex-1 flex flex-col relative bg-[#050505] overflow-hidden">
                   <div className="h-8 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 text-[11px] text-[#c9d1d9] shrink-0 z-10 shadow-sm relative">
                      <div className="flex gap-4 items-center">
                         <span className="font-mono text-[#8b949e]">View: 135% <ChevronDown size={10} className="inline"/></span>
                         <div className="w-[1px] h-3 bg-[#30363d]"></div>
                         <span className="font-mono text-[#8b949e]">8192 x 4096 px</span>
                         <div className="w-[1px] h-3 bg-[#30363d]"></div>
                         <span className="text-[#3fb950] font-bold">16-bit Float</span>
                         <span className="text-[#8b949e]">Linear sRGB</span>
                      </div>
                      <div className="flex gap-2 items-center">
                         <button className="px-2 py-0.5 hover:bg-[#21262d] rounded text-[#8b949e] hover:text-[#c9d1d9] border border-transparent hover:border-[#30363d]">Soft Proofing</button>
                         <button className="px-2 py-0.5 hover:bg-[#21262d] rounded text-[#8b949e] hover:text-[#c9d1d9] border border-transparent hover:border-[#30363d]">Gamut Warning</button>
                         <div className="w-[1px] h-3 bg-[#30363d] mx-1"></div>
                         <button className="px-2 py-0.5 bg-[#21262d] rounded border border-[#58a6ff] text-[#58a6ff] shadow-[0_0_5px_rgba(88,166,255,0.2)]">RGB</button>
                         <button className="px-2 py-0.5 hover:bg-[#21262d] rounded border border-transparent hover:border-[#30363d]">Alpha</button>
                         <button className="px-2 py-0.5 hover:bg-[#21262d] rounded border border-transparent hover:border-[#30363d]">Z-Depth</button>
                      </div>
                   </div>

                   {/* Canvas Area */}
                   <div className="flex-1 relative flex items-center justify-center border-b border-[#30363d] bg-[#111] overflow-hidden">
                      {/* Checkerboard Pattern via inline style or classes */}
                      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222), linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
                      
                      {/* Perspective Grid Overlay Mock */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(88,166,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(88,166,255,1) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
                      
                      {/* Mock Image Content */}
                      <div className="w-[450px] h-[300px] bg-gradient-to-tr from-[#1f2937] to-[#374151] relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-[#333] overflow-hidden group">
                         {/* Base Texture */}
                         <div className="absolute inset-0 bg-[#000] opacity-50 mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }}></div>
                         
                         {/* Some shape simulating an object */}
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#bc8cff] rounded-lg blur-[2px] opacity-80 rotate-12 mix-blend-screen shadow-2xl"></div>
                         
                         {/* Selection Marquee Mock */}
                         <div className="absolute top-12 left-16 w-32 h-64 border border-white border-dashed opacity-80 rounded-sm bg-white/5"></div>
                         
                         {/* AI SAM (Segment Anything) Overlay Dots */}
                         <div className="absolute top-[40%] left-[45%] w-3 h-3 bg-[#3fb950] border-2 border-white rounded-full shadow-[0_0_10px_#3fb950] animate-pulse"></div>
                         <div className="absolute top-[60%] left-[55%] w-3 h-3 bg-[#f85149] border-2 border-white rounded-full shadow-[0_0_10px_#f85149]"></div>
                         
                         {/* AI Polygon Overlay Outline Mock */}
                         <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 450 300">
                            <polygon points="175,70 280,50 330,150 260,250 150,220 120,130" fill="rgba(88, 166, 255, 0.2)" stroke="#58a6ff" strokeWidth="2" strokeDasharray="4 4" />
                            <circle cx="175" cy="70" r="4" fill="white" />
                            <circle cx="280" cy="50" r="4" fill="white" />
                            <circle cx="330" cy="150" r="4" fill="white" />
                            <circle cx="260" cy="250" r="4" fill="white" />
                            <circle cx="150" cy="220" r="4" fill="white" />
                            <circle cx="120" cy="130" r="4" fill="white" />
                         </svg>
                      </div>
                   </div>

                   {/* Compositing Node Graph Area */}
                   <div className="h-[280px] bg-[#0d1117] relative shrink-0 overflow-hidden">
                      <div className="absolute top-2 left-2 text-[10px] font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-2 z-10 bg-[#0d1117] px-2 py-1 rounded border border-[#30363d]">
                         <Network size={12}/> Advanced Vector & AI Graph
                      </div>
                      <div className="absolute inset-0 opacity-[0.2] bg-[radial-gradient(circle,#8b949e_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

                      {/* Node Graph Lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#8b949e]" fill="none">
                         <path d="M 128 56 C 150 56, 170 120, 208 120" strokeWidth="2" />
                         <path d="M 128 176 C 150 176, 170 120, 208 120" strokeWidth="2" />
                         <path d="M 320 120 L 380 120" strokeWidth="2" />
                         <path d="M 492 120 L 540 120" strokeWidth="2" className="stroke-[#bc8cff]" />
                         <path d="M 320 120 C 350 120, 360 216, 380 216" strokeWidth="2" />
                         <path d="M 492 216 C 520 216, 520 140, 540 130" strokeWidth="2" className="stroke-[#f85149]" />
                         <path d="M 652 120 L 700 120" strokeWidth="2" />
                      </svg>
                      
                      {/* Node: Read 1 */}
                      <div className="absolute top-[32px] left-[16px] w-[112px] bg-[#21262d] border-t-4 border-[#e3b341] rounded-sm shadow-lg text-[10px] text-white">
                         <div className="p-1 px-2 border-b border-[#30363d] flex justify-between">
                            <span>Read1</span> <FileCode2 size={10}/>
                         </div>
                         <div className="p-1 px-2 text-[#8b949e] truncate flex flex-col gap-1">
                            <span>Base_Color.png</span>
                            <span className="text-[8px] border border-[#30363d] rounded text-center bg-[#161b22]">8192x4096 RGB</span>
                         </div>
                         <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-2 h-2 rounded bg-[#e3b341]"></div>
                      </div>

                      {/* Node: Read 2 */}
                      <div className="absolute top-[152px] left-[16px] w-[112px] bg-[#21262d] border-t-4 border-[#e3b341] rounded-sm shadow-lg text-[10px] text-white">
                         <div className="p-1 px-2 border-b border-[#30363d] flex justify-between">
                            <span>Read2</span> <FileCode2 size={10}/>
                         </div>
                         <div className="p-1 px-2 text-[#8b949e] truncate flex flex-col gap-1">
                            <span>Glow_Mask.exr</span>
                            <span className="text-[8px] border border-[#30363d] rounded text-center bg-[#161b22]">32F Float</span>
                         </div>
                         <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-2 h-2 rounded bg-[#e3b341]"></div>
                      </div>
                      
                      {/* Node: Merge */}
                      <div className="absolute top-[96px] left-[208px] w-[112px] bg-[#21262d] border-t-4 border-[#58a6ff] rounded-sm shadow-lg text-[10px] text-white">
                         <div className="absolute top-[16px] left-[-6px] w-2 h-2 rounded bg-[#58a6ff]"></div>
                         <div className="absolute bottom-[16px] left-[-6px] w-2 h-2 rounded bg-[#58a6ff]"></div>
                         <div className="p-1 px-2 border-b border-[#30363d] flex justify-between">
                            <span>Merge1 (Over)</span> <Layers size={10}/>
                         </div>
                         <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-2 h-2 rounded bg-[#58a6ff]"></div>
                      </div>

                      {/* Node: ColorCorrect */}
                      <div className="absolute top-[96px] left-[380px] w-[112px] bg-[#0d1117] border border-[#bc8cff] border-t-4 border-t-[#bc8cff] rounded-sm shadow-lg text-[10px] text-white shadow-[0_0_15px_rgba(188,140,255,0.2)]">
                         <div className="absolute top-1/2 left-[-6px] -translate-y-1/2 w-2 h-2 rounded bg-[#bc8cff]"></div>
                         <div className="p-1 px-2 border-b border-[#30363d] flex justify-between bg-[#21262d]">
                            <span>Grade1</span> <Settings2 size={10} className="text-[#bc8cff]"/>
                         </div>
                         <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-2 h-2 rounded bg-[#bc8cff]"></div>
                      </div>

                      {/* Node: AI Local Upscaler */}
                      <div className="absolute top-[192px] left-[380px] w-[112px] bg-[#21262d] border-t-4 border-[#f85149] rounded-sm shadow-lg text-[10px] text-white">
                         <div className="absolute top-1/2 left-[-6px] -translate-y-1/2 w-2 h-2 rounded border border-[#f85149] bg-black"></div>
                         <div className="p-1 px-2 border-b border-[#30363d] flex justify-between text-[#f85149]">
                            <span>AI_Depth (MiDaS)</span> <Cpu size={10}/>
                         </div>
                         <div className="p-1 px-2 text-[#8b949e] truncate flex flex-col gap-1">
                            <div className="bg-[#f85149]/20 text-center rounded text-[8px] py-0.5 text-[#f85149]">INFERENCING...</div>
                         </div>
                         <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-2 h-2 rounded bg-[#f85149]"></div>
                      </div>

                      {/* Node: Composite Finish */}
                      <div className="absolute top-[96px] left-[540px] w-[112px] bg-[#21262d] border-t-4 border-[#3fb950] rounded-sm shadow-lg text-[10px] text-white">
                         <div className="absolute top-[16px] left-[-6px] w-2 h-2 rounded bg-[#bc8cff]"></div>
                         <div className="absolute bottom-[16px] left-[-6px] w-2 h-2 rounded bg-[#f85149]"></div>
                         <div className="p-1 px-2 border-b border-[#30363d] flex justify-between text-[#3fb950]">
                            <span>PBR_Export</span> <DownloadCloud size={10}/>
                         </div>
                         <div className="p-1 px-2 text-[#8b949e] flex flex-col gap-1 text-[8px]">
                            <div className="flex gap-1 items-center"><div className="w-2 h-2 bg-[#bc8cff] rounded-sm"></div> Albedo</div>
                            <div className="flex gap-1 items-center"><div className="w-2 h-2 bg-[#f85149] rounded-sm"></div> Depth/AO</div>
                         </div>
                         <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-2 h-2 rounded bg-[#3fb950]"></div>
                      </div>

                   </div>
                </div>

                {/* Right Panel: Layers & Properties */}
                <div className="w-[280px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0">
                   {/* Histogram */}
                   <div className="h-[120px] bg-[#0d1117] border-b border-[#30363d] p-2 flex flex-col gap-1">
                      <span className="text-[9px] text-[#8b949e] uppercase font-bold tracking-wider">Histogram</span>
                      <div className="flex-1 border border-[#30363d] bg-[#0a0a0a] relative flex items-end opacity-80 overflow-hidden">
                         <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                           <path d="M 0 100 L 0 80 Q 20 60, 40 90 T 80 40 L 100 70 L 100 100 Z" fill="#58a6ff" opacity="0.5" />
                           <path d="M 0 100 L 0 50 Q 30 20, 50 80 T 90 20 L 100 50 L 100 100 Z" fill="#f85149" opacity="0.5" />
                           <path d="M 0 100 L 0 90 Q 40 80, 60 50 T 70 80 L 100 90 L 100 100 Z" fill="#3fb950" opacity="0.5" />
                         </svg>
                      </div>
                   </div>
                   
                   {/* Layers */}
                   <div className="flex-1 flex flex-col border-b border-[#30363d] min-h-0">
                      <div className="p-2 text-[10px] text-[#c9d1d9] font-bold uppercase tracking-wider flex justify-between items-center bg-[#161b22]">
                         <span>Layers & Masks</span>
                         <div className="flex gap-2">
                            <button title="New Layer"><Layers size={12} className="hover:text-white"/></button>
                            <button title="Add Mask"><Plus size={12} className="hover:text-white"/></button>
                            <button title="Lock Layer"><Lock size={12} className="hover:text-[#f85149]"/></button>
                         </div>
                      </div>
                      <div className="flex px-2 py-1 gap-2 text-[10px] text-[#c9d1d9] bg-[#0d1117] border-y border-[#30363d] items-center">
                         <span>Blend: </span>
                         <select className="bg-[#161b22] border border-[#30363d] rounded outline-none flex-1 font-bold text-[#58a6ff] px-1 py-0.5">
                            <option>Normal</option>
                            <option>Multiply</option>
                            <option>Screen</option>
                            <option>Overlay</option>
                            <option>Hard Light</option>
                            <option>Color Dodge</option>
                            <option>Linear Burn</option>
                            <option>Difference</option>
                         </select>
                         <span className="flex items-center gap-1">Op: <input className="w-8 bg-[#161b22] border border-[#30363d] rounded text-center" defaultValue="100"/>%</span>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
                         <div className="flex items-center gap-2 p-1 bg-[#21262d] rounded border border-[#58a6ff] text-[11px] text-white">
                            <Eye size={12}/>
                            <div className="w-6 h-6 bg-[#f85149] rounded-sm border border-[#444] shadow-[0_0_5px_#f85149]"></div>
                            <span className="flex-1 truncate">Magic_Glow_FX</span>
                            <div className="w-6 h-6 bg-white rounded-sm border border-[#444] flex items-center justify-center p-0.5" title="Layer Mask">
                               <div className="w-full h-full bg-black rounded-sm relative">
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full blur-[2px]"></div>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-2 p-1 hover:bg-[#21262d] rounded text-[11px] text-[#8b949e]">
                            <Eye size={12} className="text-[#c9d1d9]"/>
                            <div className="w-6 h-6 bg-[#222] rounded-sm border border-[#444] relative overflow-hidden">
                               <div className="absolute inset-0 bg-transparent bg-[radial-gradient(#555_1px,transparent_1px)] bg-[size:4px_4px]"></div>
                               <div className="absolute inset-0 bg-[#bc8cff] opacity-50"></div>
                            </div>
                            <span className="flex-1 truncate text-[#c9d1d9]">Character_Mask (AI Generated)</span>
                         </div>
                         <div className="flex items-center gap-2 p-1 hover:bg-[#21262d] rounded text-[11px] text-[#8b949e]">
                            <Eye size={12} className="text-[#30363d]"/>
                            <div className="w-6 h-6 bg-[#e3b341]/20 rounded-sm border border-[#444] flex items-center justify-center">
                               <Settings2 size={10} className="text-[#e3b341]"/>
                            </div>
                            <span className="flex-1 truncate text-[#8b949e] line-through">Hue/Saturation 1</span>
                         </div>
                         <div className="flex items-center gap-2 p-1 hover:bg-[#21262d] rounded text-[11px] text-[#8b949e]">
                            <Eye size={12} className="text-[#c9d1d9]"/>
                            <div className="w-6 h-6 bg-[#58a6ff] rounded-sm border border-[#444]"></div>
                            <span className="flex-1 truncate text-[#c9d1d9]">Base_Background</span>
                            <Lock size={10} className="text-[#f85149]"/>
                         </div>
                      </div>
                   </div>

                   {/* Properties & Offline AI Tools */}
                   <div className="h-[250px] bg-[#0d1117] flex flex-col shrink-0 custom-scrollbar overflow-y-auto">
                      <div className="p-2 text-[10px] text-[#c9d1d9] font-bold uppercase tracking-wider bg-[#161b22] border-b border-[#30363d] flex justify-between shrink-0 top-0 sticky z-10">
                         Property: Grade1 <Settings2 size={12}/>
                      </div>
                      <div className="p-3 flex flex-col gap-3 text-[11px]">
                         {/* Original Properties */}
                         <div className="flex flex-col gap-1 text-[#8b949e]">
                            <div className="flex justify-between"><span>Blackpoint</span><span className="text-white">0.0</span></div>
                            <div className="flex gap-1 items-center">
                               <div className="w-2 h-2 rounded-full bg-[#f85149]"></div><input type="range" className="w-full h-1 bg-[#333]" />
                            </div>
                            <div className="flex gap-1 items-center">
                               <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div><input type="range" className="w-full h-1 bg-[#333]" />
                            </div>
                            <div className="flex gap-1 items-center">
                               <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div><input type="range" className="w-full h-1 bg-[#333]" />
                            </div>
                         </div>
                         <div className="w-full h-[1px] bg-[#30363d] my-1"></div>
                         
                         {/* Professional Tools */}
                         <div className="flex flex-col gap-2">
                             <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#8b949e] tracking-wider mb-1">
                                Advanced Compositing & Retouching <SlidersHorizontal size={12}/>
                             </div>
                             
                             {/* Retouching Tools */}
                             <div className="flex flex-col gap-1">
                               <div className="text-[9px] text-[#8b949e] uppercase mb-1">Retouching</div>
                               <button className="bg-[#21262d] border border-[#30363d] py-1 px-2 rounded text-[10px] text-left hover:bg-[#30363d] text-[#c9d1d9] flex justify-between">High-Pass Sharpen <span>Ctrl+H</span></button>
                               <button className="bg-[#21262d] border border-[#30363d] py-1 px-2 rounded text-[10px] text-left hover:bg-[#30363d] text-[#c9d1d9] flex justify-between">Frequency Separation <span>F9</span></button>
                               <button className="bg-[#21262d] border border-[#30363d] py-1 px-2 rounded text-[10px] text-left hover:bg-[#30363d] text-[#c9d1d9]">Dodging & Burning Curves</button>
                             </div>

                             {/* PBR & Texture Auth */}
                             <div className="flex flex-col gap-1 mt-1">
                               <div className="text-[9px] text-[#8b949e] uppercase mb-1">Texture Authoring (Node)</div>
                               <button className="bg-[#21262d] border border-[#30363d] py-1 px-2 rounded text-[10px] text-left hover:bg-[#30363d] text-[#e3b341]">Diffuse to Normal Map</button>
                               <button className="bg-[#21262d] border border-[#30363d] py-1 px-2 rounded text-[10px] text-left hover:bg-[#30363d] text-[#e3b341]">Extract Roughness Match</button>
                               <button className="bg-[#21262d] border border-[#30363d] py-1 px-2 rounded text-[10px] text-left hover:bg-[#30363d] text-[#e3b341]">Bake Ambient Occlusion</button>
                             </div>

                             {/* Math & Channels */}
                             <div className="flex flex-col gap-1 mt-1">
                               <div className="text-[9px] text-[#8b949e] uppercase mb-1">Color Math & Optics</div>
                               <button className="bg-[#21262d] border border-[#30363d] py-1 px-2 rounded text-[10px] text-left hover:bg-[#30363d] text-[#c9d1d9]">Chromatic Aberration (Lens)</button>
                               <button className="bg-[#21262d] border border-[#30363d] py-1 px-2 rounded text-[10px] text-left hover:bg-[#30363d] text-[#c9d1d9]">EXR Multi-Channel Split</button>
                               <button className="bg-[#21262d] border border-[#30363d] py-1 px-2 rounded text-[10px] text-left hover:bg-[#30363d] text-[#c9d1d9]">Custom Convolution Matrix</button>
                               <button className="bg-[#21262d] border border-[#30363d] py-1 px-2 rounded text-[10px] text-left hover:bg-[#30363d] text-[#c9d1d9]">ACES / OCIO LUT Application</button>
                             </div>
                         </div>

                         <div className="w-full h-[1px] bg-[#30363d] my-2"></div>

                         {/* Offline AI Tools */}
                         <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#bc8cff] tracking-wider mb-1">
                               Deep Offline AI Toolkit <Cpu size={12}/>
                            </div>
                            
                            <div className="text-[9px] text-[#8b949e] mb-1">Running entirely ON-DEVICE via Local Tensor Compute. Zero latency.</div>

                            {/* Generative */}
                            <div className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 p-2 rounded flex flex-col gap-2">
                               <div className="flex items-center gap-2 text-[11px] font-bold text-[#c9d1d9]">
                                  <Sparkles size={12} className="text-[#bc8cff]"/> Stable Diffusion Inpaint (Local)
                               </div>
                               <input type="text" placeholder="Enter positive prompt..." className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] text-[9px] py-1 px-2 rounded outline-none" />
                               <input type="text" placeholder="Enter negative prompt..." className="bg-[#0a0a0a] border border-[#f85149]/50 text-[#f85149] text-[9px] py-1 px-2 rounded outline-none" />
                               <div className="flex gap-2 text-[9px] items-center text-[#8b949e]">
                                  <span>Denoise: 0.75</span>
                                  <input type="range" className="w-full h-1 bg-[#333] accent-[#bc8cff]" defaultValue={75}/>
                               </div>
                               <button className="bg-[#bc8cff] text-[#000] font-bold text-[10px] py-1 rounded w-full hover:bg-[#d0a7ff]">Generate Fill (Masked Area)</button>
                            </div>

                            {/* Segmentation */}
                            <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex flex-col gap-2">
                               <div className="flex justify-between items-center text-[11px] font-bold text-[#c9d1d9]">
                                  <span>Segment Anything (SAM)</span>
                                  <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></div>
                               </div>
                               <div className="text-[9px] text-[#8b949e]">Click anywhere on the image to auto-mask complex objects using Meta SAM offline model.</div>
                               <button className="bg-[#30363d] text-white font-semibold text-[10px] py-1 rounded hover:bg-[#404852] border border-[#8b949e]/50">Enable Hover Masking</button>
                            </div>

                            {/* Upscale */}
                            <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex flex-col gap-2 text-[#c9d1d9]">
                               <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span>Neural Upscale Network</span>
                               </div>
                               <select className="bg-[#0a0a0a] border border-[#30363d] text-[10px] text-[#8b949e] p-1 outline-none w-full">
                                  <option>ESRGAN_4x_Photo (Standard)</option>
                                  <option>Real-ESRGAN-AnimeVideo_v3</option>
                                  <option>SwinIR_Large_NoiseReduce</option>
                                  <option>DAT_x4_HighRes</option>
                               </select>
                               <div className="flex gap-2">
                                  <button className="flex-1 bg-[#30363d] text-white font-semibold text-[10px] py-1 rounded hover:bg-[#404852] border border-[#8b949e]/50">x2</button>
                                  <button className="flex-1 bg-[#3fb950]/20 text-[#3fb950] font-semibold text-[10px] py-1 rounded hover:bg-[#3fb950]/30 border border-[#3fb950]/50">x4</button>
                                  <button className="flex-1 bg-[#30363d] text-white font-semibold text-[10px] py-1 rounded hover:bg-[#404852] border border-[#8b949e]/50">x8</button>
                               </div>
                            </div>
                            
                            {/* Materials */}
                            <div className="bg-[#ff7b72]/10 border border-[#ff7b72]/30 p-2 rounded flex flex-col gap-2">
                               <div className="flex items-center justify-between text-[11px] font-bold text-[#ff7b72]">
                                  <span>PBR Material Estimator</span>
                               </div>
                               <div className="text-[9px] text-[#c9d1d9]">Uses offline AI to estimate Depth, Normal, and Roughness from a single Diffuse map.</div>
                               <button className="bg-[#ff7b72]/20 border border-[#ff7b72]/50 text-[#ff7b72] font-semibold text-[10px] py-1 rounded hover:bg-[#ff7b72]/30">Extract Depth Map (MiDaS)</button>
                               <button className="bg-[#ff7b72]/20 border border-[#ff7b72]/50 text-[#ff7b72] font-semibold text-[10px] py-1 rounded hover:bg-[#ff7b72]/30">Extract Normals (Bae et al.)</button>
                            </div>

                            {/* Utility */}
                            <div className="flex gap-2 mt-1">
                               <button className="flex-1 bg-[#21262d] border border-[#30363d] py-1.5 px-2 rounded text-center hover:bg-[#30363d] font-bold text-[#58a6ff] text-[10px] flex justify-center items-center gap-1">
                                  <Scissors size={10}/> Auto-Crop Subject
                               </button>
                               <button className="flex-1 bg-[#21262d] border border-[#30363d] py-1.5 px-2 rounded text-center hover:bg-[#30363d] font-bold text-[#ff7b72] text-[10px] flex justify-center items-center gap-1">
                                  <Sparkles size={10}/> Relight Output
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
         );
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
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex UI/UX Builder', 'Professional layout design, design systems, and offline AI UX analysis.', <LayoutDashboard size={28} />)}
             <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Layers and Assets */}
                <div className="w-[260px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 overflow-hidden">
                   <div className="flex h-8 border-b border-[#30363d] text-[10px] uppercase font-bold text-[#8b949e]">
                      <button className="flex-1 hover:text-white border-b-2 border-[#58a6ff] text-white">Layers</button>
                      <button className="flex-1 hover:text-white">Assets</button>
                      <button className="flex-1 hover:text-white">AI Gen</button>
                   </div>
                   
                   <div className="p-2 border-b border-[#30363d] relative">
                      <Search size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b949e]" />
                      <input type="text" placeholder="Filter layers..." className="w-full bg-[#0d1117] border border-[#30363d] rounded pl-7 pr-2 py-1 text-[11px] text-[#c9d1d9] outline-none" />
                   </div>

                   <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-0.5">
                      {/* Page node */}
                      <div className="flex items-center gap-1.5 px-1 py-1 hover:bg-[#21262d] rounded cursor-pointer group">
                         <ChevronDown size={14} className="text-[#888]" />
                         <span className="font-bold text-[11px] text-[#c9d1d9]">Page 1</span>
                      </div>
                      
                      {/* Frame */}
                      <div className="flex flex-col pl-4">
                         <div className="flex items-center gap-1.5 px-1 py-1 bg-[#21262d] rounded cursor-pointer border border-[#58a6ff]/30 group">
                            <ChevronDown size={12} className="text-[#888]" />
                            <LayoutDashboard size={12} className="text-[#8b949e]" />
                            <span className="font-bold text-[11px] text-[#58a6ff]">Main_Dashboard_Desktop</span>
                            <Eye size={10} className="ml-auto text-[#8b949e]" />
                         </div>
                         
                         {/* Components inside frame */}
                         <div className="flex flex-col pl-4 mt-0.5 gap-0.5">
                            <div className="flex items-center gap-1.5 px-1 py-0.5 hover:bg-[#21262d] rounded cursor-pointer group">
                               <ChevronRight size={12} className="text-[#888] opacity-0" />
                               <Layout size={12} className="text-[#bc8cff]" />
                               <span className="text-[11px] text-[#c9d1d9]">Sidebar_Nav (Instance)</span>
                            </div>
                            <div className="flex flex-col">
                               <div className="flex items-center gap-1.5 px-1 py-0.5 hover:bg-[#21262d] rounded cursor-pointer group">
                                  <ChevronDown size={12} className="text-[#888]" />
                                  <div className="flex items-center justify-center w-3 h-3 text-[#8b949e]">
                                     <div className="w-2 h-2 border border-current rounded-sm"></div>
                                  </div>
                                  <span className="text-[11px] text-[#c9d1d9]">Header_Container</span>
                               </div>
                               <div className="flex flex-col pl-4 gap-0.5">
                                  <div className="flex items-center gap-1.5 px-1 py-0.5 hover:bg-[#21262d] rounded cursor-pointer">
                                     <div className="w-3 text-center text-[#8b949e] font-serif text-[12px] leading-none">T</div>
                                     <span className="text-[11px] text-[#c9d1d9]">Page Title</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 px-1 py-0.5 hover:bg-[#21262d] rounded cursor-pointer">
                                     <div className="w-3 text-center text-[#8b949e]">
                                        <div className="w-2.5 h-2.5 rounded-full border border-current"></div>
                                     </div>
                                     <span className="text-[11px] text-[#c9d1d9]">User_Avatar</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Center Workspace */}
                <div className="flex-1 flex flex-col relative bg-[#111] overflow-hidden">
                   {/* Top Toolbar */}
                   <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl px-2 py-1.5 flex gap-1 z-50">
                      <button className="p-1.5 bg-[#21262d] text-white rounded shadow-inner" title="Move (V)"><MousePointer2 size={16} /></button>
                      <div className="w-[1px] h-6 bg-[#30363d] self-center mx-1"></div>
                      <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded" title="Frame (F)"><LayoutDashboard size={16} /></button>
                      <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded relative" title="Shapes (R)">
                         <Square size={16} />
                         <div className="absolute bottom-1 right-1 w-0 h-0 border-l-[3px] border-b-[3px] border-l-transparent border-b-[#8b949e]"></div>
                      </button>
                      <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded" title="Pen (P)"><PenTool size={16} /></button>
                      <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded" title="Text (T)"><div className="font-serif font-bold text-[14px] leading-none text-center w-4">T</div></button>
                      <div className="w-[1px] h-6 bg-[#30363d] self-center mx-1"></div>
                      <button className="p-1.5 text-[#8b949e] hover:text-[#bc8cff] hover:bg-[#bc8cff]/10 rounded" title="Create Component (Ctrl+Alt+K)"><Box size={16} /></button>
                      <button className="p-1.5 text-[#8b949e] hover:text-[#bc8cff] hover:bg-[#bc8cff]/10 rounded" title="AI Tools"><Sparkles size={16} /></button>
                   </div>

                   {/* Canvas Grid Background */}
                   <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundPosition: '-10px -10px' }}></div>
                   <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px', backgroundPosition: '-10px -10px' }}></div>

                   {/* Canvas Scale Indicator */}
                   <div className="absolute bottom-4 left-4 bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-[10px] font-mono text-[#8b949e] shadow-lg flex gap-2">
                      <button className="hover:text-white">-</button>
                      <span>140%</span>
                      <button className="hover:text-white">+</button>
                   </div>

                   {/* Mock UI Frame */}
                   <div className="flex-1 flex items-center justify-center overflow-auto">
                      <div className="relative w-[600px] h-[400px] bg-[#0d1117] shadow-2xl border border-[#30363d] group">
                         {/* Frame Label */}
                         <div className="absolute -top-5 left-0 text-[11px] font-bold text-[#58a6ff]">Main_Dashboard_Desktop</div>
                         
                         {/* Selection Bounds */}
                         <div className="absolute inset-0 border-2 border-[#58a6ff] z-40 pointer-events-none">
                            <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border border-[#58a6ff]"></div>
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border border-[#58a6ff]"></div>
                            <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border border-[#58a6ff]"></div>
                            <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2.5 h-2.5 bg-white border border-[#58a6ff]"></div>
                            <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-white border border-[#58a6ff]"></div>
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border border-[#58a6ff]"></div>
                            <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border border-[#58a6ff]"></div>
                            <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2.5 h-2.5 bg-white border border-[#58a6ff]"></div>
                         </div>
                         
                         {/* Layout Mockup inside Frame */}
                         <div className="flex h-full">
                            {/* Sidebar Mock */}
                            <div className="w-[140px] border-r border-[#30363d] bg-[#161b22] flex flex-col p-3 gap-2 border-[1.5px] border-dashed border-[#bc8cff]">
                               <div className="absolute top-1 left-2 text-[8px] font-mono text-[#bc8cff] bg-[#161b22] px-1 pointer-events-none">Sidebar_Nav</div>
                               <div className="w-full h-8 bg-[#21262d] rounded flex items-center px-2 gap-2 mt-2">
                                  <div className="w-4 h-4 rounded bg-[#58a6ff]"></div>
                                  <div className="h-2 w-12 rounded bg-[#30363d]"></div>
                               </div>
                               <div className="w-full h-6 bg-[#30363d] rounded mt-4 opacity-50"></div>
                               <div className="w-full h-6 bg-[#21262d] rounded"></div>
                               <div className="w-full h-6 bg-[#21262d] rounded"></div>
                            </div>
                            
                            {/* Main Area Mock */}
                            <div className="flex-1 flex flex-col p-4 gap-4 bg-[#050505]">
                               <div className="flex justify-between items-center bg-[#050505] relative border hover:border-[#58a6ff]/50 border-transparent p-1 -m-1 rounded transition-colors group/header">
                                  <div className="absolute -top-4 left-0 text-[8px] font-mono text-[#8b949e] opacity-0 group-hover/header:opacity-100">Header_Container</div>
                                  <div className="text-[18px] font-bold text-white font-serif tracking-tight">Dashboard Overview</div>
                                  <div className="w-8 h-8 rounded-full bg-[#f85149] border-2 border-[#30363d] shadow-[0_0_10px_#f85149]"></div>
                               </div>
                               
                               <div className="flex gap-4">
                                  <div className="flex-1 h-24 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col justify-center px-4 gap-2">
                                     <div className="h-2 w-16 bg-[#8b949e] rounded"></div>
                                     <div className="text-[24px] font-mono text-white">$12,450</div>
                                  </div>
                                  <div className="flex-1 h-24 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col justify-center px-4 gap-2 relative">
                                     <div className="absolute -inset-[1px] border border-[#f85149] rounded-xl pointer-events-none opacity-50"></div>
                                     <div className="h-2 w-16 bg-[#8b949e] rounded"></div>
                                     <div className="text-[24px] font-mono text-white">4,210</div>
                                  </div>
                                  <div className="flex-1 h-24 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col justify-center px-4 gap-2">
                                     <div className="h-2 w-16 bg-[#8b949e] rounded"></div>
                                     <div className="text-[24px] font-mono text-white">98.2%</div>
                                  </div>
                               </div>
                               
                               <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl relative overflow-hidden">
                                  {/* Mock Chart */}
                                  <svg className="w-full h-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 50">
                                     <path d="M 0 50 L 10 40 L 20 45 L 30 30 L 40 35 L 50 15 L 60 25 L 70 10 L 80 20 L 90 5 L 100 15 L 100 50 Z" fill="rgba(88,166,255,0.2)" />
                                     <path d="M 0 50 L 10 40 L 20 45 L 30 30 L 40 35 L 50 15 L 60 25 L 70 10 L 80 20 L 90 5 L 100 15" stroke="#58a6ff" strokeWidth="1.5" fill="none" />
                                  </svg>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Right Panel: Properties */}
                <div className="w-[280px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0">
                   <div className="flex border-b border-[#30363d] text-[10px] uppercase font-bold text-[#8b949e]">
                      <button className="flex-1 py-1.5 hover:text-white border-b-2 border-[#58a6ff] text-white">Design</button>
                      <button className="flex-1 py-1.5 hover:text-white">Prototype</button>
                      <button className="flex-1 py-1.5 hover:text-white">Inspect</button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-6">
                      
                      {/* Alignment */}
                      <div className="p-3 border-b border-[#30363d] flex justify-between text-[#8b949e]">
                         <button className="hover:text-white p-1 hover:bg-[#21262d] rounded"><AlignLeft size={14}/></button>
                         <button className="hover:text-white p-1 hover:bg-[#21262d] rounded"><AlignCenter size={14}/></button>
                         <button className="hover:text-white p-1 hover:bg-[#21262d] rounded"><AlignRight size={14}/></button>
                         <div className="w-[1px] h-4 bg-[#30363d] self-center"></div>
                         <button className="hover:text-white p-1 hover:bg-[#21262d] rounded"><AlignLeft size={14} className="rotate-90"/></button>
                         <button className="hover:text-white p-1 hover:bg-[#21262d] rounded"><AlignCenter size={14} className="rotate-90"/></button>
                         <button className="hover:text-white p-1 hover:bg-[#21262d] rounded"><AlignRight size={14} className="rotate-90"/></button>
                      </div>

                      {/* Transform */}
                      <div className="p-3 border-b border-[#30363d] flex flex-col gap-2">
                         <div className="flex gap-2">
                            <div className="flex flex-1 items-center gap-1.5 bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-0.5">
                               <span className="text-[10px] text-[#8b949e]">X</span>
                               <input type="text" className="w-full bg-transparent text-[#c9d1d9] text-[11px] outline-none" defaultValue="0" />
                            </div>
                            <div className="flex flex-1 items-center gap-1.5 bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-0.5">
                               <span className="text-[10px] text-[#8b949e]">Y</span>
                               <input type="text" className="w-full bg-transparent text-[#c9d1d9] text-[11px] outline-none" defaultValue="0" />
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <div className="flex flex-1 items-center gap-1.5 bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-0.5">
                               <span className="text-[10px] text-[#8b949e]">W</span>
                               <input type="text" className="w-full bg-transparent text-[#c9d1d9] text-[11px] outline-none" defaultValue="1440" />
                            </div>
                            <div className="flex items-center text-[#8b949e] px-1 hover:text-white cursor-pointer"><Link2 size={12}/></div>
                            <div className="flex flex-1 items-center gap-1.5 bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-0.5">
                               <span className="text-[10px] text-[#8b949e]">H</span>
                               <input type="text" className="w-full bg-transparent text-[#c9d1d9] text-[11px] outline-none" defaultValue="1024" />
                            </div>
                         </div>
                         <div className="flex gap-2 mt-1">
                            <div className="flex flex-1 items-center gap-1.5 bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-0.5">
                               <RotateCw size={10} className="text-[#8b949e]" />
                               <input type="text" className="w-full bg-transparent text-[#c9d1d9] text-[11px] outline-none" defaultValue="0°" />
                            </div>
                            <div className="flex flex-1 items-center gap-1.5 bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-0.5">
                               <Square size={10} className="text-[#8b949e] rounded-sm" />
                               <input type="text" className="w-full bg-transparent text-[#c9d1d9] text-[11px] outline-none" defaultValue="0" />
                            </div>
                         </div>
                      </div>

                      {/* Auto Layout */}
                      <div className="p-3 border-b border-[#30363d] flex flex-col gap-2">
                         <div className="flex items-center justify-between group cursor-pointer">
                            <span className="text-[11px] font-bold text-[#c9d1d9]">Auto layout</span>
                            <div className="flex items-center gap-2">
                               <button className="text-[#8b949e] hover:text-white opacity-0 group-hover:opacity-100"><Minus size={14}/></button>
                               <button className="text-[#8b949e] hover:text-[#58a6ff]"><LayoutDashboard size={14} className="rotate-90"/></button>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button className="flex-1 bg-[#21262d] border border-[#58a6ff] rounded py-1 flex items-center justify-center text-[#58a6ff] shadow-[0_0_5px_rgba(88,166,255,0.2)]">↓</button>
                            <button className="flex-1 bg-[#0a0a0a] border border-[#30363d] rounded py-1 flex items-center justify-center text-[#8b949e] hover:bg-[#21262d]">→</button>
                            <button className="flex-1 bg-[#0a0a0a] border border-[#30363d] rounded py-1 flex items-center justify-center text-[#8b949e] hover:bg-[#21262d]">↘</button>
                         </div>
                         <div className="flex gap-2 text-[11px] text-[#c9d1d9]">
                            <div className="flex-1 flex gap-1 items-center bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-1">
                               <MoveHorizontal size={10} className="text-[#8b949e]"/>
                               <input type="text" className="w-full bg-transparent outline-none" defaultValue="24" />
                            </div>
                            <div className="flex-1 flex gap-1 items-center bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-1">
                               <MoveVertical size={10} className="text-[#8b949e]"/>
                               <input type="text" className="w-full bg-transparent outline-none" defaultValue="24" />
                            </div>
                         </div>
                      </div>

                      {/* Offline AI Toolset inside UI panel */}
                      <div className="p-3 border-b border-[#30363d] bg-[#f85149]/5 flex flex-col gap-3">
                         <div className="flex items-center justify-between text-[11px] font-bold text-[#f85149]">
                            <span className="flex items-center gap-1.5"><Cpu size={14}/> Deep UX Copilot</span>
                         </div>
                         
                         <div className="flex flex-col gap-2">
                            <div className="bg-[#21262d] border border-[#f85149]/30 rounded p-2">
                               <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#c9d1d9] mb-1">
                                  <Eye size={12} className="text-[#f85149]"/> Heatmap Predictor
                               </div>
                               <div className="text-[9px] text-[#8b949e] mb-2 leading-tight">Run offline inference to predict user eye-tracking and attention hotspots.</div>
                               <button className="w-full bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/50 font-bold text-[10px] py-1 rounded hover:bg-[#f85149]/30">Generate Salience Map</button>
                            </div>

                            <div className="bg-[#21262d] border border-[#bc8cff]/30 rounded p-2">
                               <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#c9d1d9] mb-1">
                                  <Sparkles size={12} className="text-[#bc8cff]"/> Wireframe ➔ Hi-Fi
                               </div>
                               <div className="text-[9px] text-[#8b949e] mb-2 leading-tight">Use local ControlNet to generate styled components from rough rectangles.</div>
                               <select className="w-full bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] text-[9px] outline-none rounded p-1 mb-2">
                                  <option>Style: Cyberpunk Dark</option>
                                  <option>Style: Clean SaaS</option>
                                  <option>Style: Neumorphism</option>
                               </select>
                               <button className="w-full bg-[#bc8cff] text-[#000] font-bold text-[10px] py-1 rounded hover:bg-[#d0a7ff]">Run Inference</button>
                            </div>

                            <div className="bg-[#21262d] border border-[#58a6ff]/30 rounded p-2">
                               <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#c9d1d9] mb-1">
                                  <LayoutDashboard size={12} className="text-[#58a6ff]"/> AI Auto-Layout Magic
                               </div>
                               <div className="text-[9px] text-[#8b949e] mb-2 leading-tight">Analyzes overlapping layers to automatically structure proper CSS flexbox/Auto-Layout hierarchies.</div>
                               <button className="w-full bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50 font-bold text-[10px] py-1 rounded hover:bg-[#58a6ff]/30">Structure Selected Nodes</button>
                            </div>
                         </div>
                      </div>

                      {/* Fill */}
                      <div className="p-3 border-b border-[#30363d] flex flex-col gap-2">
                         <div className="flex items-center justify-between group">
                            <span className="text-[11px] font-bold text-[#c9d1d9]">Fill</span>
                            <button className="text-[#8b949e] hover:text-white opacity-0 group-hover:opacity-100"><Plus size={14}/></button>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-sm bg-[#0d1117] border border-[#30363d] flex-shrink-0 cursor-pointer"></div>
                            <div className="flex-1 font-mono text-[11px] text-[#c9d1d9] uppercase tracking-wide">0D1117</div>
                            <div className="text-[11px] text-[#8b949e] font-mono w-10 text-right">100%</div>
                         </div>
                      </div>

                      {/* Stroke */}
                      <div className="p-3 border-b border-[#30363d] flex flex-col gap-2">
                         <div className="flex items-center justify-between group">
                            <span className="text-[11px] font-bold text-[#c9d1d9]">Stroke</span>
                            <button className="text-[#8b949e] hover:text-white"><Plus size={14}/></button>
                         </div>
                         <div className="text-[10px] text-[#8b949e] italic">No active strokes.</div>
                      </div>
                      
                      {/* Export */}
                      <div className="p-3 border-b border-[#30363d] flex flex-col gap-2 mt-auto">
                         <div className="flex items-center justify-between group cursor-pointer">
                            <span className="text-[11px] font-bold text-[#c9d1d9]">Export</span>
                            <button className="text-[#8b949e] hover:text-white"><Plus size={14}/></button>
                         </div>
                         <div className="flex gap-2 text-[10px]">
                            <button className="flex-1 bg-[#21262d] border border-[#30363d] py-1 rounded text-[#c9d1d9] hover:bg-[#30363d]">SVG</button>
                            <button className="flex-1 bg-[#21262d] border border-[#30363d] py-1 rounded text-[#c9d1d9] hover:bg-[#30363d]">React Code</button>
                         </div>
                         <button className="w-full bg-[#f85149] text-white font-bold text-[11px] py-1.5 rounded mt-1 shadow-lg border border-[#ff7b72] hover:bg-[#ff7b72]">Export Ready Assets</button>
                      </div>

                   </div>
                </div>
             </div>
           </div>
         );
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex Fairlight Audio / DAW', 'Professional non-linear audio editing, EQ, compression, routing, and VST support.', <AudioWaveform size={28} />)}
             <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Tracks Control */}
                <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
                   <div className="h-8 border-b border-[#30363d] flex items-center px-2 justify-between text-[#8b949e] shrink-0">
                      <div className="flex gap-1">
                         <button className="p-1 hover:bg-[#21262d] rounded"><Plus size={14} className="text-[#3fb950]"/></button>
                         <button className="p-1 hover:bg-[#21262d] rounded"><FolderTree size={14}/></button>
                      </div>
                      <Settings2 size={12}/>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                      {/* Track 1 */}
                      <div className="h-[80px] border-b border-[#30363d] bg-[#21262d] flex flex-col justify-between p-1.5 border-l-4 border-l-[#58a6ff]">
                         <div className="flex justify-between items-center text-[11px] text-white font-bold">
                            <span>Audio 1 (Dialogue)</span>
                            <div className="flex gap-1 text-[9px]">
                               <button className="w-4 h-4 bg-[#f85149] rounded text-white flex items-center justify-center font-bold">R</button>
                               <button className="w-4 h-4 bg-[#e3b341] rounded text-[#0a0a0a] flex items-center justify-center font-bold">S</button>
                               <button className="w-4 h-4 bg-[#3fb950] rounded text-[#0a0a0a] flex items-center justify-center font-bold">M</button>
                            </div>
                         </div>
                         <div className="flex gap-2 items-center">
                            <Volume2 size={12} className="text-[#8b949e]"/>
                            <input type="range" className="w-[80px] h-1 bg-[#30363d] rounded appearance-none accent-[#58a6ff]" defaultValue="80" />
                            <div className="flex-1 h-2 bg-[#050505] rounded flex overflow-hidden">
                               <div className="h-full bg-[#58a6ff]" style={{width: '60%'}}></div>
                               <div className="h-full bg-[#f85149]" style={{width: '0%'}}></div>
                            </div>
                         </div>
                         <div className="flex justify-between text-[9px] text-[#8b949e]">
                            <span>IN: 1</span> <span>OUT: Master</span>
                         </div>
                      </div>

                      {/* Track 2 */}
                      <div className="h-[80px] border-b border-[#30363d] bg-[#161b22] flex flex-col justify-between p-1.5 border-l-4 border-l-[#3fb950]">
                         <div className="flex justify-between items-center text-[11px] text-[#c9d1d9] font-bold">
                            <span>Audio 2 (SFX)</span>
                            <div className="flex gap-1 text-[9px]">
                               <button className="w-4 h-4 bg-[#30363d] rounded text-[#8b949e] flex items-center justify-center font-bold hover:bg-[#444]">R</button>
                               <button className="w-4 h-4 bg-[#30363d] rounded text-[#8b949e] flex items-center justify-center font-bold hover:bg-[#444]">S</button>
                               <button className="w-4 h-4 bg-[#30363d] rounded text-[#8b949e] flex items-center justify-center font-bold hover:bg-[#444]">M</button>
                            </div>
                         </div>
                         <div className="flex gap-2 items-center">
                            <Volume2 size={12} className="text-[#8b949e]"/>
                            <input type="range" className="w-[80px] h-1 bg-[#30363d] rounded appearance-none accent-[#3fb950]" defaultValue="40" />
                            <div className="flex-1 h-2 bg-[#050505] rounded flex overflow-hidden">
                               <div className="h-full bg-[#3fb950]" style={{width: '30%'}}></div>
                            </div>
                         </div>
                         <div className="flex justify-between text-[9px] text-[#8b949e]">
                            <span>IN: 2</span> <span>OUT: Master</span>
                         </div>
                      </div>

                      {/* Track 3 */}
                      <div className="h-[80px] border-b border-[#30363d] bg-[#161b22] flex flex-col justify-between p-1.5 border-l-4 border-l-[#bc8cff]">
                         <div className="flex justify-between items-center text-[11px] text-[#c9d1d9] font-bold">
                            <span>Music (Stereo)</span>
                            <div className="flex gap-1 text-[9px]">
                               <button className="w-4 h-4 bg-[#30363d] rounded text-[#8b949e] flex items-center justify-center font-bold hover:bg-[#444]">R</button>
                               <button className="w-4 h-4 bg-[#30363d] rounded text-[#8b949e] flex items-center justify-center font-bold hover:bg-[#444]">S</button>
                               <button className="w-4 h-4 bg-[#30363d] rounded text-[#8b949e] flex items-center justify-center font-bold hover:bg-[#444]">M</button>
                            </div>
                         </div>
                         <div className="flex gap-2 items-center">
                            <Volume2 size={12} className="text-[#8b949e]"/>
                            <input type="range" className="w-[80px] h-1 bg-[#30363d] rounded appearance-none accent-[#bc8cff]" defaultValue="65" />
                            <div className="flex-1 h-2 bg-[#050505] rounded flex overflow-hidden"></div>
                         </div>
                         <div className="flex justify-between text-[9px] text-[#8b949e]">
                            <span>IN: None</span> <span>OUT: Master</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Center Timeline */}
                <div className="flex-1 bg-[#050505] flex flex-col relative overflow-hidden">
                   {/* Top Time Ruler */}
                   <div className="h-8 border-b border-[#30363d] bg-[#161b22] relative shrink-0">
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,#30363d_1px,transparent_1px)] bg-[size:100px_100%]"></div>
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,#222_1px,transparent_1px)] bg-[size:25px_100%]"></div>
                      <div className="absolute top-1 left-[100px] text-[9px] text-[#8b949e]">00:00:01:00</div>
                      <div className="absolute top-1 left-[200px] text-[9px] text-[#8b949e]">00:00:02:00</div>
                      <div className="absolute top-1 left-[300px] text-[9px] text-[#8b949e]">00:00:03:00</div>
                      {/* Playhead Handle */}
                      <div className="absolute top-0 bottom-0 left-[150px] w-[9px] ml-[-4px] bg-[#f85149] clip-path-triangle z-20 cursor-ew-resize"></div>
                   </div>

                   {/* Timeline Tracks Area */}
                   <div className="flex-1 relative overflow-y-auto custom-scrollbar flex flex-col">
                      <div className="absolute top-0 bottom-0 left-[150px] w-[1px] bg-[#f85149] z-10 pointer-events-none"></div>
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_40px] pointer-events-none"></div>

                      {/* Track 1 Region */}
                      <div className="h-[80px] border-b border-[#30363d] relative">
                         <div className="absolute top-2 bottom-2 left-[50px] w-[180px] bg-[#58a6ff]/20 border border-[#58a6ff] rounded cursor-pointer overflow-hidden flex items-center">
                            {/* Fake Waveform SVG */}
                            <svg className="w-full h-full text-[#58a6ff] opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
                               <path d="M0 50 Q 5 20, 10 50 T 20 50 Q 25 80, 30 50 T 40 50 Q 45 10, 50 50 T 60 50 Q 65 90, 70 50 T 80 50 Q 85 30, 90 50 T 100 50 L100 50" stroke="currentColor" strokeWidth="1" fill="none" />
                            </svg>
                            <span className="absolute top-1 left-1 text-[9px] font-bold text-white shadow-black drop-shadow-md">Hero_Voice_01.wav</span>
                         </div>
                      </div>

                      {/* Track 2 Region */}
                      <div className="h-[80px] border-b border-[#30363d] relative">
                         <div className="absolute top-2 bottom-2 left-[250px] w-[80px] bg-[#3fb950]/20 border border-[#3fb950] rounded cursor-pointer overflow-hidden flex items-center">
                            <svg className="w-full h-full text-[#3fb950] opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
                               <path d="M0 50 Q 10 0, 20 50 T 40 50 Q 50 100, 60 50 T 80 50 Q 90 0, 100 50" stroke="currentColor" strokeWidth="1" fill="none" />
                            </svg>
                            <span className="absolute top-1 left-1 text-[9px] font-bold text-white shadow-black drop-shadow-md">Sword_Clash.wav</span>
                         </div>
                      </div>

                      {/* Track 3 Region */}
                      <div className="h-[80px] border-b border-[#30363d] relative"></div>
                   </div>

                   {/* Transport Controls (Bottom) */}
                   <div className="h-12 border-t border-[#30363d] bg-[#161b22] px-4 flex items-center justify-center gap-6 shrink-0 relative">
                     <div className="flex gap-2">
                        <button className="p-2 text-[#8b949e] hover:text-white"><Rewind size={16}/></button>
                        <button className="p-2 text-[#0a0a0a] bg-[#3fb950] rounded hover:bg-[#2ea043]"><Play size={16} fill="currentColor"/></button>
                        <button className="p-2 text-[#8b949e] hover:text-white"><Pause size={16} fill="currentColor"/></button>
                        <button className="p-2 text-[#8b949e] hover:text-white"><FastForward size={16}/></button>
                        <button className="p-2 text-[#f85149] border border-[#f85149]/50 rounded ml-4 hover:bg-[#f85149]/20"><div className="w-3 h-3 rounded-full bg-[#f85149]"></div></button>
                     </div>
                     <div className="font-mono text-[#58a6ff] text-[18px] font-bold bg-[#0a0a0a] border border-[#30363d] px-3 py-0.5 rounded shadow-inner">
                        00:00:01:15
                     </div>
                   </div>
                </div>

                {/* Right Panel: Rack / Inserts */}
                <div className="w-[300px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0">
                   <div className="p-2 border-b border-[#30363d] text-[11px] font-bold text-[#c9d1d9] uppercase tracking-wider flex justify-between">
                      Inspector: Audio 1
                      <Settings2 size={12}/>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-2 gap-3">
                      {/* Parametric EQ Widget */}
                      <div className="flex flex-col gap-1 border border-[#30363d] rounded bg-[#0d1117] overflow-hidden">
                         <div className="px-2 py-1 text-[10px] text-white font-bold bg-[#21262d] flex justify-between items-center transition-colors">
                            <span>Parametric EQ (ProChannel)</span>
                            <div className="w-2 h-2 rounded-full bg-[#3fb950] shadow-[0_0_5px_#3fb950]"></div>
                         </div>
                         <div className="h-[80px] bg-[#050505] relative p-1 m-1 border border-[#30363d] rounded overflow-hidden">
                             {/* Mock EQ Curve */}
                             <svg className="w-full h-full stroke-[#58a6ff]" fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path d="M 0 50 C 20 50, 25 10, 40 10 C 55 10, 60 70, 70 70 C 80 70, 85 50, 100 50" strokeWidth="2" />
                             </svg>
                             <div className="absolute top-1/2 left-2 w-2 h-2 rounded-full bg-[#f85149] border border-white transform -translate-y-[80px]"></div>
                             <div className="absolute top-[70%] left-[65%] w-2 h-2 rounded-full bg-[#e3b341] border border-white"></div>
                         </div>
                         <div className="grid grid-cols-3 gap-1 px-1 pb-1 text-[9px] text-[#8b949e]">
                            <div className="flex flex-col items-center"><span className="text-white">120 Hz</span><span>Freq</span></div>
                            <div className="flex flex-col items-center"><span className="text-white">+4.5 dB</span><span>Gain</span></div>
                            <div className="flex flex-col items-center"><span className="text-white">1.0</span><span>Q</span></div>
                         </div>
                      </div>

                      {/* Compressor */}
                      <div className="flex flex-col gap-1 border border-[#30363d] rounded bg-[#0d1117] overflow-hidden">
                         <div className="px-2 py-1 text-[10px] text-white font-bold bg-[#21262d] flex justify-between items-center transition-colors">
                            <span>FET Compressor</span>
                            <div className="w-2 h-2 rounded-full bg-[#3fb950] shadow-[0_0_5px_#3fb950]"></div>
                         </div>
                         <div className="p-2 grid grid-cols-2 gap-2 text-[10px] text-[#8b949e]">
                            <div className="flex flex-col">
                               <div className="flex justify-between"><span>Thresh</span><span className="text-[#c9d1d9]">-14.0</span></div>
                               <input type="range" className="w-full h-1 bg-[#30363d] appearance-none accent-[#58a6ff]" />
                            </div>
                            <div className="flex flex-col">
                               <div className="flex justify-between"><span>Ratio</span><span className="text-[#c9d1d9]">4:1</span></div>
                               <input type="range" className="w-full h-1 bg-[#30363d] appearance-none accent-[#58a6ff]" />
                            </div>
                            <div className="flex flex-col">
                               <div className="flex justify-between"><span>Attack</span><span className="text-[#c9d1d9]">Fast</span></div>
                               <input type="range" className="w-full h-1 bg-[#30363d] appearance-none accent-[#58a6ff]" />
                            </div>
                            <div className="flex flex-col">
                               <div className="flex justify-between"><span>Release</span><span className="text-[#c9d1d9]">140ms</span></div>
                               <input type="range" className="w-full h-1 bg-[#30363d] appearance-none accent-[#58a6ff]" />
                            </div>
                         </div>
                      </div>

                      {/* Inserts / Sends */}
                      <div className="flex flex-col gap-1 mt-2">
                         <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-1">Inserts</span>
                         <div className="bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-[10px] text-[#c9d1d9] flex justify-between hover:bg-[#21262d] cursor-pointer">
                            1. Vintage Reverb <Settings2 size={10}/>
                         </div>
                         <div className="bg-[#161b22] border border-[#30363d] border-dashed rounded px-2 py-1 text-[10px] text-[#8b949e] text-center hover:bg-[#21262d] cursor-pointer">
                            + Add VST/Effect
                         </div>
                      </div>

                      <div className="flex flex-col gap-1 mt-2">
                         <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-1">Sends</span>
                         <div className="bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-[10px] text-[#c9d1d9] flex justify-between items-center hover:bg-[#21262d] cursor-pointer">
                            <span>S1: Master Delay</span>
                            <span className="text-[#58a6ff]">-6.5 dB</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
         );
      case 'NPCEdit':
         return (
           <div className="flex flex-col h-full bg-[#0a0a0a]">
             {renderHeader('Apex NPC State Machine & Behavior Editor', 'Traditional node-based behavior trees, finite state machines, and dialogue branching.', <Users size={28} />)}
             <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Available Nodes */}
                <div className="w-[250px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
                  <div className="p-2 border-b border-[#30363d] flex justify-between items-center text-[#8b949e]">
                     <span className="text-[11px] font-bold uppercase tracking-wider text-[#c9d1d9]">Nodes & States</span>
                     <Search size={14}/>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-4">
                     {/* Composites */}
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Composites</span>
                        <div className="bg-[#21262d] border-l-4 border-l-[#58a6ff] rounded p-2 text-[11px] text-[#c9d1d9] cursor-grab hover:bg-[#30363d]">Selector (Fallback)</div>
                        <div className="bg-[#21262d] border-l-4 border-l-[#3fb950] rounded p-2 text-[11px] text-[#c9d1d9] cursor-grab hover:bg-[#30363d]">Sequence (AND)</div>
                        <div className="bg-[#21262d] border-l-4 border-l-[#bc8cff] rounded p-2 text-[11px] text-[#c9d1d9] cursor-grab hover:bg-[#30363d]">Parallel</div>
                     </div>
                     {/* Decorators */}
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Decorators</span>
                        <div className="bg-[#21262d] border border-dashed border-[#e3b341] rounded p-2 text-[11px] text-[#e3b341] cursor-grab hover:bg-[#30363d]">Inverter</div>
                        <div className="bg-[#21262d] border border-dashed border-[#e3b341] rounded p-2 text-[11px] text-[#e3b341] cursor-grab hover:bg-[#30363d]">Repeater (Loop)</div>
                        <div className="bg-[#21262d] border border-dashed border-[#e3b341] rounded p-2 text-[11px] text-[#e3b341] cursor-grab hover:bg-[#30363d]">Cooldown Timer</div>
                     </div>
                     {/* Actions */}
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-[#8b949e] mb-1">Actions</span>
                        <div className="bg-[#21262d] rounded p-2 text-[11px] text-[#c9d1d9] cursor-grab hover:bg-[#30363d] flex gap-2 items-center"><Activity size={12}/> MoveToLocation</div>
                        <div className="bg-[#21262d] rounded p-2 text-[11px] text-[#c9d1d9] cursor-grab hover:bg-[#30363d] flex gap-2 items-center"><Eye size={12}/> PlayAnimation</div>
                        <div className="bg-[#21262d] rounded p-2 text-[11px] text-[#c9d1d9] cursor-grab hover:bg-[#30363d] flex gap-2 items-center"><Search size={12}/> FindTarget</div>
                        <div className="bg-[#21262d] rounded p-2 text-[11px] text-[#c9d1d9] cursor-grab hover:bg-[#30363d] flex gap-2 items-center"><UserSquare size={12}/> StartDialogue</div>
                     </div>
                  </div>
                </div>

                {/* Center Panel: Node Graph Canvas */}
                <div className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col">
                   <div className="h-8 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center gap-4 text-[11px] text-[#8b949e] shrink-0">
                      <span className="text-[#58a6ff] font-bold">TownGuard_BehaviorTree</span>
                      <span className="px-2 py-0.5 bg-[#21262d] rounded">Zoom: 100%</span>
                   </div>
                   
                   {/* Node Canvas Area */}
                   <div className="flex-1 relative cursor-grab">
                      {/* Grid Background */}
                      <div className="absolute inset-0 opacity-[0.2] bg-[linear-gradient(to_right,#8b949e_1px,transparent_1px),linear-gradient(to_bottom,#8b949e_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                      {/* Connection Lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
                         <path d="M 400 100 C 400 150, 250 150, 250 200" stroke="#8b949e" strokeWidth="2" strokeDasharray="5,5" />
                         <path d="M 400 100 C 400 150, 550 150, 550 200" stroke="#8b949e" strokeWidth="2" />
                         
                         <path d="M 250 240 C 250 280, 150 280, 150 320" stroke="#8b949e" strokeWidth="2" />
                         <path d="M 250 240 C 250 280, 350 280, 350 320" stroke="#8b949e" strokeWidth="2" />
                      </svg>

                      {/* Root Node */}
                      <div className="absolute top-[60px] left-[350px] w-[100px] bg-[#161b22] border-t-4 border-t-white rounded shadow-lg flex flex-col items-center">
                         <div className="px-2 py-1 text-[11px] font-bold text-white w-full text-center border-b border-[#30363d]">Root</div>
                         <div className="w-full flex justify-center p-1"><div className="w-3 h-3 rounded-full bg-[#30363d] border border-[#8b949e]"></div></div>
                      </div>

                      {/* Selector Node */}
                      <div className="absolute top-[200px] left-[200px] w-[100px] bg-[#161b22] border-t-4 border-t-[#58a6ff] rounded shadow-lg flex flex-col items-center">
                         <div className="w-full flex justify-center p-1"><div className="w-3 h-3 rounded-full bg-[#58a6ff]"></div></div>
                         <div className="px-2 py-1 text-[11px] font-bold text-[#c9d1d9] w-full text-center border-y border-[#30363d]">Selector ?</div>
                         <div className="w-full flex justify-center p-1"><div className="w-3 h-3 rounded-full bg-[#30363d] border border-[#8b949e]"></div></div>
                      </div>

                      {/* Sequence Node */}
                      <div className="absolute top-[200px] left-[500px] w-[100px] bg-[#161b22] border-t-4 border-t-[#3fb950] rounded shadow-lg flex flex-col items-center ring-2 ring-[#3fb950]">
                         <div className="w-full flex justify-center p-1"><div className="w-3 h-3 rounded-full bg-[#3fb950]"></div></div>
                         <div className="px-2 py-1 text-[11px] font-bold text-[#c9d1d9] w-full text-center border-y border-[#30363d]">Sequence -&gt;</div>
                         <div className="w-full flex justify-center p-1"><div className="w-3 h-3 rounded-full bg-[#30363d] border border-[#8b949e]"></div></div>
                      </div>

                      {/* Action: Investigate */}
                      <div className="absolute top-[320px] left-[100px] w-[100px] bg-[#21262d] rounded shadow-lg flex flex-col items-center border border-[#30363d]">
                         <div className="w-full flex justify-center p-1"><div className="w-3 h-3 rounded-full bg-[#58a6ff]"></div></div>
                         <div className="px-2 py-2 text-[10px] text-[#c9d1d9] w-full text-center">Investigate Noise</div>
                      </div>

                      {/* Action: Patrol */}
                      <div className="absolute top-[320px] left-[300px] w-[100px] bg-[#21262d] rounded shadow-lg flex flex-col items-center border border-[#30363d]">
                         <div className="w-full flex justify-center p-1"><div className="w-3 h-3 rounded-full bg-[#58a6ff]"></div></div>
                         <div className="px-2 py-2 text-[10px] text-[#c9d1d9] w-full text-center">Patrol Waypoints</div>
                      </div>
                   </div>
                </div>

                {/* Right Panel: Node Properties Blackboard */}
                <div className="w-[300px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0">
                   <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] bg-[#0d1117]">
                      Selection Details
                   </div>
                   <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                      <div className="flex flex-col gap-2">
                         <label className="text-[10px] font-bold text-[#8b949e] uppercase">Node Type</label>
                         <div className="bg-[#21262d] border border-[#3fb950] text-[#3fb950] px-3 py-1.5 rounded text-[12px] font-bold text-center">
                            Sequence
                         </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                         <label className="text-[10px] font-bold text-[#8b949e] uppercase">Node Label</label>
                         <input type="text" className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[12px] outline-none focus:border-[#58a6ff]" defaultValue="Sequence ->" />
                      </div>

                      <div className="w-full h-[1px] bg-[#30363d] my-2"></div>

                      <div className="flex flex-col gap-2">
                         <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-[#8b949e] uppercase">Blackboard Keys</label>
                            <button className="text-[#58a6ff] hover:text-white"><Plus size={14}/></button>
                         </div>
                         
                         <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 flex flex-col gap-2">
                            <div className="flex justify-between items-center border-b border-[#30363d] pb-2">
                               <div className="flex flex-col">
                                  <span className="text-[11px] text-[#c9d1d9] font-bold">HasTarget</span>
                                  <span className="text-[9px] text-[#e3b341]">Boolean</span>
                               </div>
                               <input type="checkbox" defaultChecked className="accent-[#58a6ff]"/>
                            </div>
                            
                            <div className="flex justify-between items-center border-b border-[#30363d] pb-2">
                               <div className="flex flex-col">
                                  <span className="text-[11px] text-[#c9d1d9] font-bold">PatrolIndex</span>
                                  <span className="text-[9px] text-[#3fb950]">Integer</span>
                               </div>
                               <input type="number" defaultValue="0" className="w-[60px] bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[11px] p-1 rounded outline-none"/>
                            </div>

                            <div className="flex justify-between items-center">
                               <div className="flex flex-col">
                                  <span className="text-[11px] text-[#c9d1d9] font-bold">TargetActor</span>
                                  <span className="text-[9px] text-[#bc8cff]">Object Ref</span>
                               </div>
                               <button className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-[10px] text-[#8b949e]">None</button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
         );
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
                   {/* Collision Matrix */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9]">Layer Collision Matrix</div>
                      <div className="p-4 overflow-x-auto text-[10px] text-[#8b949e]">
                         <table className="w-full text-center border-collapse">
                            <thead>
                               <tr>
                                  <th className="p-1 border border-[#30363d]"></th>
                                  <th className="p-1 border border-[#30363d] writing-mode-vertical">Default</th>
                                  <th className="p-1 border border-[#30363d] writing-mode-vertical">Player</th>
                                  <th className="p-1 border border-[#30363d] writing-mode-vertical">Enemy</th>
                                  <th className="p-1 border border-[#30363d] writing-mode-vertical">Projectile</th>
                               </tr>
                            </thead>
                            <tbody>
                               <tr>
                                  <td className="p-1 border border-[#30363d] font-bold text-right pr-2">Default</td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                               </tr>
                               <tr>
                                  <td className="p-1 border border-[#30363d] font-bold text-right pr-2">Player</td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                                  <td className="p-1 border border-[#30363d] bg-[#f85149]/20"><input type="checkbox" /></td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                               </tr>
                               <tr>
                                  <td className="p-1 border border-[#30363d] font-bold text-right pr-2">Enemy</td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                                  <td className="p-1 border border-[#30363d] bg-[#f85149]/20"><input type="checkbox" /></td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                               </tr>
                               <tr>
                                  <td className="p-1 border border-[#30363d] font-bold text-right pr-2">Projectile</td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                                  <td className="p-1 border border-[#30363d] bg-[#3fb950]/20"><input type="checkbox" defaultChecked /></td>
                                  <td className="p-1 border border-[#30363d] bg-[#f85149]/20"><input type="checkbox" /></td>
                               </tr>
                            </tbody>
                         </table>
                         <p className="mt-2 text-[9px] italic">Checkboxes indicate which layers map to physical collisions.</p>
                      </div>
                   </div>

                   {/* Global Physics Settings */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] flex justify-between">
                         Global Physics Config
                         <button className="text-[#58a6ff] hover:text-white px-2 bg-[#21262d] rounded text-[10px]">Apply Changes</button>
                      </div>
                      <div className="p-4 flex flex-col gap-4 text-[12px] text-[#c9d1d9]">
                         <div className="flex justify-between items-center">
                            <span className="text-[#8b949e]">Gravity (Y)</span>
                            <input type="number" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-24 outline-none text-right" defaultValue="-9.81" />
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
                      </div>
                   </div>

                   {/* Physics Material Editor */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded shadow-lg flex flex-col col-span-2">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#e3b341]">Physics Materials Manager</div>
                      <div className="p-4 grid grid-cols-2 gap-8">
                         <div>
                            <select size={5} className="w-full bg-[#0d1117] border border-[#30363d] rounded text-[11px] text-[#c9d1d9] outline-none custom-scrollbar p-1">
                               <option className="p-1 hover:bg-[#21262d]">PhysMat_Default</option>
                               <option className="p-1 hover:bg-[#21262d]">PhysMat_Ice</option>
                               <option className="p-1 hover:bg-[#21262d]">PhysMat_Rubber</option>
                               <option className="p-1 hover:bg-[#21262d]">PhysMat_Stone</option>
                               <option className="p-1 hover:bg-[#21262d]">PhysMat_Mud</option>
                            </select>
                            <div className="flex gap-2 mt-2">
                               <button className="px-2 py-1 bg-[#21262d] rounded text-[10px] text-[#c9d1d9] border border-[#30363d]">+ Create New</button>
                            </div>
                         </div>
                         
                         <div className="flex flex-col gap-3 text-[11px] text-[#c9d1d9]">
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Static Friction</span>
                               <input type="number" step="0.1" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-20 outline-none text-right" defaultValue="0.1" />
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Dynamic Friction</span>
                               <input type="number" step="0.1" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-20 outline-none text-right" defaultValue="0.05" />
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Bounciness (Restitution)</span>
                               <input type="number" step="0.1" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-20 outline-none text-right" defaultValue="0.0" />
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Friction Combine Mode</span>
                               <select className="bg-[#0d1117] border border-[#30363d] rounded p-1 outline-none text-[#58a6ff]">
                                  <option>Average</option>
                                  <option>Minimum</option>
                                  <option>Multiply</option>
                                  <option>Maximum</option>
                               </select>
                            </div>
                         </div>
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
                               <select className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none">
                                  <option>Grid-Based (Resident Evil style)</option>
                                  <option selected>Slot-Based (WoW style)</option>
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
             {renderHeader('Apex Task & Thread Manager', 'Configure thread pools, memory allocators, and job execution priority.', <Cpu size={28} />)}
             <div className="flex-1 overflow-auto custom-scrollbar p-6">
                
                <div className="grid grid-cols-2 gap-6 h-full">

                   {/* Thread Pools */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] flex justify-between">
                         Active Thread Pools
                         <button className="text-[#58a6ff] hover:text-white px-2 bg-[#21262d] rounded text-[10px]">&gt; Profile Performance</button>
                      </div>
                      <div className="p-4 flex flex-col gap-4 text-[11px] text-[#c9d1d9] overflow-y-auto custom-scrollbar">
                         <div className="flex flex-col gap-2 border border-[#30363d] rounded p-3 bg-[#0d1117]">
                            <div className="flex justify-between items-center font-bold text-[#58a6ff]">
                               <span>Main (Render) Thread</span>
                               <span>Affinity: Core 0</span>
                            </div>
                            <div className="flex justify-between text-[#8b949e]">
                               <span>Priority</span>
                               <select className="bg-[#161b22] border border-[#30363d] rounded outline-none p-1">
                                  <option>Normal</option>
                                  <option selected>High</option>
                                  <option>Time-Critical</option>
                               </select>
                            </div>
                         </div>
                         <div className="flex flex-col gap-2 border border-[#30363d] rounded p-3 bg-[#0d1117]">
                            <div className="flex justify-between items-center font-bold text-[#3fb950]">
                               <span>Physics Worker Pool</span>
                               <span>Count: <input type="number" className="bg-[#161b22] border border-[#30363d] w-12 p-1 outline-none text-center" defaultValue="4"/></span>
                            </div>
                            <div className="flex justify-between text-[#8b949e]">
                               <span>Affinity Mask</span>
                               <input type="text" className="bg-[#161b22] border border-[#30363d] rounded p-1 outline-none w-24 text-center font-mono" defaultValue="0x0F00" />
                            </div>
                         </div>
                         <div className="flex flex-col gap-2 border border-[#30363d] rounded p-3 bg-[#0d1117]">
                            <div className="flex justify-between items-center font-bold text-[#bc8cff]">
                               <span>Async IO / Streaming</span>
                               <span>Count: <input type="number" className="bg-[#161b22] border border-[#30363d] w-12 p-1 outline-none text-center" defaultValue="2"/></span>
                            </div>
                            <div className="flex justify-between text-[#8b949e]">
                               <span>Priority</span>
                               <select className="bg-[#161b22] border border-[#30363d] rounded outline-none p-1">
                                  <option>Background</option>
                                  <option selected>Normal</option>
                                  <option>High</option>
                               </select>
                            </div>
                         </div>
                         <div className="flex flex-col gap-2 border border-[#30363d] rounded p-3 bg-[#0d1117]">
                            <div className="flex justify-between items-center font-bold text-[#e3b341]">
                               <span>Audio Thread</span>
                               <span>Affinity: Auto</span>
                            </div>
                            <div className="flex justify-between text-[#8b949e]">
                               <span>DSP Buffer Size</span>
                               <select className="bg-[#161b22] border border-[#30363d] rounded outline-none p-1">
                                  <option>256 Samples</option>
                                  <option selected>512 Samples</option>
                                  <option>1024 Samples</option>
                               </select>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Subsystem Toggles & Settings */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9]">Engine Subsystem Config</div>
                      <div className="p-4 flex flex-col gap-6 text-[12px] text-[#c9d1d9] overflow-y-auto custom-scrollbar">
                         
                         <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-[#3fb950] border-b border-[#30363d] pb-2">Job System</h4>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Max Concurrent Jobs</span>
                               <input type="number" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-20 outline-none text-right" defaultValue="4096" />
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Job Execution Time Slice (ms)</span>
                               <input type="number" step="0.5" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-20 outline-none text-right" defaultValue="16.6" />
                            </div>
                         </div>

                         <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-[#ff7b72] border-b border-[#30363d] pb-2">Memory Allocation</h4>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Garbage Collection Mode</span>
                               <select className="bg-[#0d1117] border border-[#30363d] rounded p-1 outline-none">
                                  <option>Generational (Stop-the-world)</option>
                                  <option selected>Incremental (Time-slicing)</option>
                                  <option>Manual / Disabled</option>
                               </select>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Pre-allocated Pool Size (MB)</span>
                               <input type="number" className="bg-[#0d1117] border border-[#30363d] rounded p-1 w-20 outline-none text-right" defaultValue="1024" />
                            </div>
                         </div>

                         <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-[#bc8cff] border-b border-[#30363d] pb-2">Logging & Profiling</h4>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Log Level</span>
                               <select className="bg-[#0d1117] border border-[#30363d] rounded p-1 outline-none">
                                  <option>None</option>
                                  <option>Errors Only</option>
                                  <option selected>Warnings & Errors</option>
                                  <option>Info</option>
                                  <option>Verbose</option>
                               </select>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Enable Frame Profiler</span>
                               <input type="checkbox" className="accent-[#58a6ff]" defaultChecked/>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Dump Memory Leaks on Exit</span>
                               <input type="checkbox" className="accent-[#58a6ff]" defaultChecked/>
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
             {renderHeader('Apex Render Pipeline & Graphics', 'Configure materials, post-processing, and render passes.', <MonitorPlay size={28} />)}
             <div className="flex-1 overflow-auto custom-scrollbar p-6">
                
                <div className="grid grid-cols-[300px_1fr] gap-6 h-full">

                   {/* Graphics Settings Tree */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg overflow-hidden">
                      <div className="p-3 border-b border-[#30363d] text-[12px] font-bold text-[#c9d1d9] bg-[#21262d]">Pipeline Configuration</div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col text-[11px] text-[#c9d1d9]">
                         <div className="p-2 border-b border-[#30363d] cursor-pointer bg-[#58a6ff]/10 text-[#58a6ff] border-l-2 border-l-[#58a6ff] font-bold">Global Settings</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Quality Profiles</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Anti-Aliasing</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Shadow Maps</div>
                         
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] font-bold mt-2">Post Processing Layers</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Color Grading (LUT)</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Bloom & Lens Dirt</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Depth of Field</div>
                         <div className="p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] pl-6 text-[#8b949e]">Ambient Occlusion (SSAO)</div>
                      </div>
                   </div>

                   {/* Main Settings Panel */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded flex flex-col shadow-lg overflow-hidden">
                      <div className="p-4 border-b border-[#30363d] flex justify-between items-center text-[#c9d1d9]">
                         <div className="flex gap-2 items-center">
                            <Sliders size={18} className="text-[#58a6ff]"/>
                            <span className="font-bold text-[14px]">Global Rendering Settings</span>
                         </div>
                         <button className="px-3 py-1 bg-[#238636] text-white font-bold rounded text-[11px] border border-[#2ea043] hover:bg-[#2ea043]">Apply Changes</button>
                      </div>

                      <div className="p-6 flex flex-col gap-6 text-[12px] text-[#c9d1d9] overflow-y-auto custom-scrollbar">
                         
                         {/* Core Resolution */}
                         <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-[#e3b341] border-b border-[#30363d] pb-2">Resolution & Display</h4>
                            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                               <label className="text-[#8b949e]">Render API</label>
                               <select className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-1/2 cursor-pointer">
                                  <option>DirectX 11 (Legacy)</option>
                                  <option selected>DirectX 12 / Vulkan</option>
                                  <option>Metal (macOS)</option>
                               </select>
                            </div>
                            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                               <label className="text-[#8b949e]">V-Sync</label>
                               <select className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-1/2 cursor-pointer">
                                  <option>Don't Sync</option>
                                  <option selected>Every VBlank</option>
                                  <option>Every Second VBlank</option>
                               </select>
                            </div>
                            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                               <label className="text-[#8b949e]">Resolution Scaling</label>
                               <div className="flex items-center gap-2">
                                  <input type="range" className="w-1/2 accent-[#58a6ff]" defaultValue="100"/>
                                  <span className="font-mono text-[#58a6ff] bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px]">100%</span>
                               </div>
                            </div>
                         </div>

                         {/* Lighting & Shadows */}
                         <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-[#ff7b72] border-b border-[#30363d] pb-2">Lighting & Shadow Fidelity</h4>
                            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                               <label className="text-[#8b949e]">Shadow Resolution</label>
                               <select className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-1/2 cursor-pointer">
                                  <option>Low (512x512)</option>
                                  <option>Medium (1024x1024)</option>
                                  <option selected>High (2048x2048)</option>
                                  <option>Ultra (4096x4096)</option>
                               </select>
                            </div>
                            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                               <label className="text-[#8b949e]">Shadow Cascades</label>
                               <select className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-1/2 cursor-pointer">
                                  <option>No Cascades</option>
                                  <option>2 Cascades</option>
                                  <option selected>4 Cascades</option>
                               </select>
                            </div>
                            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                               <label className="text-[#8b949e]">Soft Shadows (PCF)</label>
                               <input type="checkbox" className="accent-[#58a6ff]" defaultChecked/>
                            </div>
                            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                               <label className="text-[#8b949e]">Realtime GI Emission</label>
                               <input type="checkbox" className="accent-[#58a6ff]" defaultChecked/>
                            </div>
                         </div>

                         {/* Texture & Material */}
                         <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-[#3fb950] border-b border-[#30363d] pb-2">Texture & Material Quality</h4>
                            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                               <label className="text-[#8b949e]">Anisotropic Filtering</label>
                               <select className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-1/2 cursor-pointer">
                                  <option>Disabled</option>
                                  <option>2x</option>
                                  <option>4x</option>
                                  <option>8x</option>
                                  <option selected>16x</option>
                               </select>
                            </div>
                            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                               <label className="text-[#8b949e]">Texture Mipmap Bias</label>
                               <input type="number" step="0.1" className="bg-[#0d1117] border border-[#30363d] rounded p-2 outline-none w-24 text-center font-mono" defaultValue="0.0" />
                            </div>
                            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                               <label className="text-[#8b949e]">Decal Draw Distance</label>
                               <div className="flex items-center gap-2">
                                  <input type="range" className="w-1/2 accent-[#3fb950]" defaultValue="80"/>
                                  <span className="font-mono text-[#3fb950] bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px]">80m</span>
                               </div>
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
           <>
             {renderHeader('Network, Cloud & Multiplayer', 'Matchmaking, DB, Leaderboards, Sync, and Export handling.', <Cloud size={28} />)}
             <div className="p-6 flex flex-col gap-4 overflow-y-auto">
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <div className="bg-[#161b22] border border-[#30363d] p-3 rounded">
                    <div className="text-[#c9d1d9] text-[12px] font-bold border-b border-[#30363d] pb-1 mb-2 flex justify-between items-center">Multiplayer <Network size={14}/></div>
                    <ul className="text-[11px] text-[#8b949e] space-y-1">
                      <li>• Server / Client Architect</li>
                      <li>• Player Tick Data Sync</li>
                      <li>• Matchmaking Lobbies</li>
                      <li>• Cross-platform / Crossplay</li>
                    </ul>
                 </div>
                 <div className="bg-[#161b22] border border-[#30363d] p-3 rounded">
                    <div className="text-[#c9d1d9] text-[12px] font-bold border-b border-[#30363d] pb-1 mb-2 flex justify-between items-center">Database & Services <Database size={14}/></div>
                    <ul className="text-[11px] text-[#8b949e] space-y-1">
                      <li>• JWT Login / Accounts</li>
                      <li>• Cloud Save & Progression</li>
                      <li>• Game Economy Systems</li>
                      <li>• Global Leaderboards</li>
                    </ul>
                 </div>
                 <div className="bg-[#161b22] border border-[#30363d] p-3 rounded">
                    <div className="text-[#c9d1d9] text-[12px] font-bold border-b border-[#30363d] pb-1 mb-2 flex justify-between items-center">Deployment <CloudCog size={14}/></div>
                    <ul className="text-[11px] text-[#8b949e] space-y-1">
                      <li>• Export to PC/Mobile/Console</li>
                      <li>• Auto Upload to Steam/Play</li>
                      <li>• Cloud Gaming Ready Stream</li>
                      <li>• Update Patch Gen & Sync</li>
                    </ul>
                 </div>
               </div>
               <div className="bg-[#0d1117] border border-[#58a6ff]/30 p-4 rounded text-[12px] flex flex-col gap-1">
                 <span className="font-bold text-[#58a6ff] flex items-center gap-2"><TrendingUp size={16}/> LiveOps Analytics Platform</span>
                 <span className="text-[#8b949e] text-[11px]">Track player behavior, retention rates, drop-offs, and dynamically adjust game balance via hot over-the-air patches without full redeploys.</span>
               </div>
             </div>
           </>
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
      case 'MetaHuman':
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
             </div>
           </>
         );
      case 'MetaSound':
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
