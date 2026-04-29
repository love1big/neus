import React, { useMemo, useState, useEffect, useRef } from 'react';
import { RefreshCcw, Maximize2, MonitorPlay, BugPlay, TerminalSquare, Layers, ShieldAlert, Cpu, Orbit, Activity, MousePointer2 } from 'lucide-react';

interface GamePreviewProps {
  files: { name: string; content: string }[];
}

type SimulationMode = 'Game' | 'PhysicsDebug' | 'AIDebug' | 'NetworkSim';

export default function GamePreview({ files }: GamePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [simMode, setSimMode] = useState<SimulationMode>('Game');
  const [showLiveInspector, setShowLiveInspector] = useState(false);

  const srcDoc = useMemo(() => {
     let htmlFile = files.find(f => f.name.endsWith('.html'))?.content || '';
     let cssFile = files.find(f => f.name.endsWith('.css'))?.content || '';
     let jsFile = files.find(f => f.name.endsWith('.js') || f.name.endsWith('.ts'))?.content || '';

     if (!htmlFile) {
       htmlFile = `
         <!DOCTYPE html>
         <html>
         <head>
           <meta charset="UTF-8">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Game Preview</title>
           <style>
             body { margin: 0; padding: 0; background-color: #0d1117; color: #c9d1d9; font-family: monospace; overflow: hidden; }
             #game-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; }
             /* Grid Background mimicking engine viewport */
             .engine-grid {
                background-image: 
                  linear-gradient(rgba(88, 166, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(88, 166, 255, 0.1) 1px, transparent 1px);
                background-size: 20px 20px;
                width: 100%; height: 100%; position: absolute; top:0; left:0; z-index:-1;
                transform: perspective(500px) rotateX(60deg) translateY(-100px) scale(3);
                transform-origin: top;
             }
           </style>
         </head>
         <body>
           <div class="engine-grid"></div>
           <div id="game-container">
              <div>
                <h2 style="color: #3fb950; font-size: 24px; margin-bottom: 8px;">Unified Runtime Core Active</h2>
                <p style="color: #8b949e; margin-bottom: 24px;">Multi-threaded ECS and Render Pipeline Initialized. Awaiting logic scripts.</p>
                <div id="console-output" style="font-size: 13px; color: #8b949e; text-align: left; background: rgba(0,0,0,0.8); padding: 12px; border-radius: 6px; min-width: 400px; max-height: 200px; overflow-y:auto; border: 1px solid #30363d;">
                   <div style="color:#58a6ff;">[System] Rendering Engine: Vulkan API</div>
                   <div style="color:#3fb950;">[System] Physics Engine: NVIDIA PhysX (Hardware Accelerated)</div>
                   <div style="color:#e3b341;">[System] Simulation Layer: Active</div>
                </div>
              </div>
           </div>
         </body>
         </html>
       `;
     }

     if (cssFile && !htmlFile.includes('<style id="nexus-injected-css">')) {
        let injection = `<style id="nexus-injected-css">\n${cssFile}\n</style>`;
        if (htmlFile.includes('</head>')) {
           htmlFile = htmlFile.replace('</head>', `${injection}\n</head>`);
        } else {
           htmlFile = injection + htmlFile;
        }
     }

     if (jsFile && !htmlFile.includes('<script id="nexus-injected-js">')) {
       let consoleOverride = `
         <script>
           const originalLog = console.log;
           const originalError = console.error;
           const originalWarn = console.warn;
           function printToScreen(type, ...args) {
             const out = document.getElementById('console-output');
             if(out) {
               const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
               const color = type === 'error' ? '#f85149' : type === 'warn' ? '#e3b341' : '#c9d1d9';
               out.innerHTML += '<div style="color: ' + color + '; margin-top: 4px;">> ' + msg + '</div>';
               out.scrollTop = out.scrollHeight;
             }
           }
           console.log = function(...args) { originalLog(...args); printToScreen('log', ...args); }
           console.error = function(...args) { originalError(...args); printToScreen('error', ...args); }
           console.warn = function(...args) { originalWarn(...args); printToScreen('warn', ...args); }
           window.onerror = function(msg, url, lineNo) {
             printToScreen('error', 'Uncaught Error: ' + msg + ' (Line ' + lineNo + ')');
             return false;
           }
         </script>
       `;
       let cleanJS = jsFile.replace(/import .* from .*;?/g, '// skipped import');
       let injection = `${consoleOverride}\n<script id="nexus-injected-js">\ntry {\n${cleanJS}\n} catch(e) { console.error(e); }\n</script>`;
       if (htmlFile.includes('</body>')) {
          htmlFile = htmlFile.replace('</body>', `${injection}\n</body>`);
       } else {
          htmlFile = htmlFile + injection;
       }
     }

     return htmlFile;
  }, [files]);

  const handleReload = () => setReloadKey(prev => prev + 1);
  const handleFullscreen = () => iframeRef.current?.requestFullscreen?.();

  return (
    <div className="absolute inset-0 bg-[#000] z-[40] flex flex-col font-['Helvetica_Neue',Arial,sans-serif] overflow-hidden">
       
       {/* Unified Runtime Toolbar */}
       <div className="h-10 bg-[#111] border-b border-[#222] flex items-center px-4 justify-between shrink-0 select-none backdrop-blur-md">
          <div className="flex items-center gap-3 text-[#fff] text-[13px] font-bold tracking-wider uppercase">
            <MonitorPlay size={16} className="text-[#3fb950] animate-pulse" /> Unified Runtime (PIE)
          </div>

          <div className="flex items-center gap-2 bg-[#1a1a1a] p-1 rounded-md border border-[#333]">
             <button onClick={() => setSimMode('Game')} className={`px-3 py-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase transition-all rounded-sm ${simMode === 'Game' ? 'bg-[#3fb950] text-[#000] shadow-[0_0_10px_rgba(63,185,80,0.5)]' : 'text-[#888] hover:text-[#fff]'}`}>
               Game
             </button>
             <button onClick={() => setSimMode('PhysicsDebug')} className={`px-3 py-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase transition-all rounded-sm ${simMode === 'PhysicsDebug' ? 'bg-[#e3b341] text-[#000] shadow-[0_0_10px_rgba(227,179,65,0.5)]' : 'text-[#888] hover:text-[#fff]'}`}>
               <Layers size={12}/> Physics
             </button>
             <button onClick={() => setSimMode('AIDebug')} className={`px-3 py-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase transition-all rounded-sm ${simMode === 'AIDebug' ? 'bg-[#58a6ff] text-[#000] shadow-[0_0_10px_rgba(88,166,255,0.5)]' : 'text-[#888] hover:text-[#fff]'}`}>
               <Cpu size={12}/> AI/Logic
             </button>
             <button onClick={() => setSimMode('NetworkSim')} className={`px-3 py-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase transition-all rounded-sm ${simMode === 'NetworkSim' ? 'bg-[#ff7b72] text-[#000] shadow-[0_0_10px_rgba(255,123,114,0.5)]' : 'text-[#888] hover:text-[#fff]'}`}>
               <Orbit size={12}/> Net Sim
             </button>
          </div>
          
          <div className="flex items-center gap-2">
             <button onClick={() => setShowLiveInspector(!showLiveInspector)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] uppercase tracking-wide font-bold transition-colors ${showLiveInspector ? 'bg-[#2b1055] text-[#bc8cff] border border-[#bc8cff]/50' : 'text-[#888] hover:bg-[#222] hover:text-[#fff]'}`} title="Enable Live Inspector">
                <MousePointer2 size={12}/> Live Inspect
             </button>
             <div className="w-[1px] h-5 bg-[#333] mx-1"></div>
             <button title="Hot Reload / Rebuild Current Frame" onClick={handleReload} className="p-1.5 rounded text-[#8b949e] hover:bg-[#222] hover:text-[#fff] transition-colors"><RefreshCcw size={14}/></button>
             <button title="Fullscreen Runtime" onClick={handleFullscreen} className="p-1.5 rounded text-[#8b949e] hover:bg-[#222] hover:text-[#fff] transition-colors"><Maximize2 size={14}/></button>
          </div>
       </div>

       {/* Iframe Viewport container */}
       <div className="flex-1 w-full relative">
          <iframe 
            key={reloadKey}
            ref={iframeRef}
            srcDoc={srcDoc}
            title="Unified Runtime Preview"
            className={`w-full h-full border-none bg-[#0a0a0a] transition-all duration-300 ${simMode === 'PhysicsDebug' ? 'grayscale-[0.5] contrast-[1.2]' : ''} ${simMode === 'AIDebug' ? 'sepia-[0.3] hue-rotate-[180deg]' : ''}`}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          />

          {/* OSD Overlays based on Simulation Mode */}
          {simMode !== 'Game' && (
            <div className="absolute top-4 left-4 bg-black/80 border border-[#444] p-3 rounded backdrop-blur-md pointer-events-none text-mono text-[10px] flex flex-col gap-1 w-64 uppercase tracking-widest shadow-2xl z-50">
               {simMode === 'PhysicsDebug' && (
                 <>
                   <div className="text-[#e3b341] font-bold pb-2 border-b border-[#444] mb-1 flex items-center gap-2"><Layers size={14}/> Physics Debug Overlay</div>
                   <div className="flex justify-between text-[#aaa]"><span>Rigidbodies:</span> <span className="text-[#fff]">1,024</span></div>
                   <div className="flex justify-between text-[#aaa]"><span>Constraints:</span> <span className="text-[#fff]">128</span></div>
                   <div className="flex justify-between text-[#aaa]"><span>Broadphase:</span> <span className="text-[#3fb950]">2.1ms</span></div>
                   <div className="flex justify-between text-[#aaa]"><span>Solver:</span> <span className="text-[#3fb950]">3.4ms</span></div>
                   <div className="mt-2 text-[#58a6ff] italic">Showing colliders & bounds...</div>
                 </>
               )}
               {simMode === 'AIDebug' && (
                 <>
                   <div className="text-[#58a6ff] font-bold pb-2 border-b border-[#444] mb-1 flex items-center gap-2"><Cpu size={14}/> AI / Tick Debug</div>
                   <div className="flex justify-between text-[#aaa]"><span>Agents Active:</span> <span className="text-[#fff]">45</span></div>
                   <div className="flex justify-between text-[#aaa]"><span>NavMesh Ops:</span> <span className="text-[#e3b341]">12 queries/f</span></div>
                   <div className="flex justify-between text-[#aaa]"><span>Behavior Trees:</span> <span className="text-[#3fb950]">Running</span></div>
                   <div className="flex justify-between text-[#aaa]"><span>Script Tick:</span> <span className="text-[#ff7b72]">4.8ms</span></div>
                   <div className="mt-2 text-[#ff7b72] italic">Displaying perception cones & BT states...</div>
                 </>
               )}
               {simMode === 'NetworkSim' && (
                 <>
                   <div className="text-[#ff7b72] font-bold pb-2 border-b border-[#444] mb-1 flex items-center gap-2"><Orbit size={14}/> Network Sim (Rollback)</div>
                   <div className="flex justify-between text-[#aaa]"><span>Simulated Ping:</span> <span className="text-[#e3b341]">150ms</span></div>
                   <div className="flex justify-between text-[#aaa]"><span>Packet Loss:</span> <span className="text-[#ff7b72]">5%</span></div>
                   <div className="flex justify-between text-[#aaa]"><span>Prediction Frm:</span> <span className="text-[#fff]">9 frames</span></div>
                   <div className="flex justify-between text-[#aaa]"><span>Bandwidth In:</span> <span className="text-[#3fb950]">14.2 kbps</span></div>
                   <div className="mt-2 text-[#e3b341] italic">Artificially injecting latency...</div>
                 </>
               )}
            </div>
          )}

          {/* Live Inspector Overlay Mock (Bottom Right) */}
          {showLiveInspector && (
             <div className="absolute bottom-4 right-4 bg-[#1e1e1e]/95 border border-[#bc8cff]/50 p-4 rounded shadow-[0_0_30px_rgba(188,140,255,0.2)] text-sans w-72 backdrop-blur-md z-50 transform transition-all translate-y-0 opacity-100">
                <div className="flex justify-between items-center mb-3">
                   <h3 className="text-[#bc8cff] font-bold text-[11px] uppercase tracking-widest flex items-center gap-2"><Activity size={14}/> Live Inspector</h3>
                   <span className="bg-[#bc8cff]/20 text-[#bc8cff] px-1.5 py-0.5 rounded text-[9px] font-mono border border-[#bc8cff]/30 animate-pulse">HOT RELOAD</span>
                </div>
                <div className="text-[12px] text-[#ccc] flex flex-col gap-2 font-mono">
                   <div className="flex items-center justify-between"><span className="text-[#888]">Entity_ID</span><span className="text-white bg-[#333] px-1 rounded">E_4092</span></div>
                   <div className="flex items-center justify-between"><span className="text-[#888]">Component</span><span className="text-[#e3b341]">CharacterMovement</span></div>
                   <div className="border-t border-[#444] my-1"></div>
                   <div className="flex items-center justify-between">
                     <span className="text-[#888]">MaxSpeed</span>
                     <input type="number" defaultValue={600} className="w-16 bg-[#111] text-right px-1 text-[#3fb950] border border-[#444] rounded outline-none focus:border-[#bc8cff]" />
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[#888]">GravityScale</span>
                     <input type="number" defaultValue={1.5} step={0.1} className="w-16 bg-[#111] text-right px-1 text-[#58a6ff] border border-[#444] rounded outline-none focus:border-[#bc8cff]" />
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[#888]">AI_State</span>
                     <select className="bg-[#111] text-[#ff7b72] border border-[#444] rounded outline-none text-right text-[11px]"><option>Patrol</option><option>Hunt</option><option>Idle</option></select>
                   </div>
                   <button className="mt-2 w-full py-1.5 bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 rounded text-[10px] uppercase font-bold tracking-widest transition-colors">
                     Apply to Prefab / Code
                   </button>
                </div>
             </div>
          )}

          {/* Unified Architecture Visual Guide - Only show when Game is selected but no project is active, mock it temporarily */}
       </div>
    </div>
  );
}
