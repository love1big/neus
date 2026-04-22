import React, { useMemo, useState, useEffect, useRef } from 'react';
import { RefreshCcw, Maximize2, MonitorPlay, BugPlay, TerminalSquare } from 'lucide-react';

interface GamePreviewProps {
  files: { name: string; content: string }[];
}

export default function GamePreview({ files }: GamePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [reloadKey, setReloadKey] = useState(0); // Used to force reload

  const srcDoc = useMemo(() => {
     let htmlFile = files.find(f => f.name.endsWith('.html'))?.content || '';
     let cssFile = files.find(f => f.name.endsWith('.css'))?.content || '';
     let jsFile = files.find(f => f.name.endsWith('.js') || f.name.endsWith('.ts'))?.content || '';

     // If no HTML, build a skeleton
     if (!htmlFile) {
       htmlFile = `
         <!DOCTYPE html>
         <html>
         <head>
           <meta charset="UTF-8">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Game Preview</title>
           <style>
             body { margin: 0; padding: 0; background-color: #0d1117; color: #c9d1d9; font-family: monospace; }
             #game-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; }
           </style>
         </head>
         <body>
           <div id="game-container">
              <div>
                <h2 style="color: #3fb950; font-size: 24px; margin-bottom: 8px;">NexusEngine Runtime Active</h2>
                <p style="color: #8b949e; margin-bottom: 24px;">Waiting for valid canvas or DOM context. Outputting logs below:</p>
                <div id="console-output" style="font-size: 13px; color: #8b949e; text-align: left; background: #000; padding: 12px; border-radius: 6px; min-width: 400px; min-height: 200px;"></div>
              </div>
           </div>
         </body>
         </html>
       `;
     }

     // Inject CSS
     if (cssFile && !htmlFile.includes('<style id="nexus-injected-css">')) {
        let injection = `<style id="nexus-injected-css">\n${cssFile}\n</style>`;
        if (htmlFile.includes('</head>')) {
           htmlFile = htmlFile.replace('</head>', `${injection}\n</head>`);
        } else {
           htmlFile = injection + htmlFile;
        }
     }

     // Inject JS (wrap in script) and Console override
     if (jsFile && !htmlFile.includes('<script id="nexus-injected-js">')) {
       // Also inject a console override to pass logs back up (optional, but good)
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
               out.innerHTML += '<div style="color: ' + color + '; padding: 4px 0; border-bottom: 1px solid #30363d;">> ' + msg + '</div>';
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

       // If it's react or import based, we might need a bundler, but for simple vanilla JS it works directly.
       // Convert imports simply or ignore for now, assuming raw JS format.
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

  const handleReload = () => {
    setReloadKey(prev => prev + 1);
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="absolute inset-0 bg-[#0d1117] z-[40] flex flex-col font-['Helvetica_Neue',Arial,sans-serif] shadow-2xl overflow-hidden animate-in fade-in duration-300">
       
       {/* Toolbar */}
       <div className="h-9 bg-[#161b22] border-b border-[#3fb950]/30 shadow-[0_4px_20px_rgba(63,185,80,0.1)] flex items-center px-4 justify-between shrink-0 select-none">
          <div className="flex items-center gap-2 text-[#3fb950] text-[12px] font-bold tracking-wider uppercase">
            <MonitorPlay size={14} className="animate-pulse" /> NexusEngine Runtime [LIVE VIEW]
          </div>
          
          <div className="flex items-center gap-1">
             <div className="flex items-center gap-2 text-[10px] text-[#8b949e] font-mono mr-4 bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
               <BugPlay size={12} className="text-[#e3b341]" />
               Debugging Context Attached
             </div>
             
             <button title="Reload Engine" onClick={handleReload} className="p-1.5 rounded text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9] transition-colors"><RefreshCcw size={14}/></button>
             <button title="Fullscreen" onClick={handleFullscreen} className="p-1.5 rounded text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9] transition-colors"><Maximize2 size={14}/></button>
          </div>
       </div>

       {/* Iframe Viewport container */}
       <div className="flex-1 w-full relative bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgC/7//8/AwICXhSADRRMGBvL00AWRxAEAE3cLN+F9/1gAAAAASUVORK5CYII=')]">
          <iframe 
            key={reloadKey}
            ref={iframeRef}
            srcDoc={srcDoc}
            title="Game Runtime Preview"
            className="w-full h-full border-none bg-transparent"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          />
       </div>

    </div>
  );
}
