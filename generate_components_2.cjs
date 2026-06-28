const fs = require('fs');

function createRegexTester() {
    return `import React from 'react';
import { Type, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function RegexTesterPanel() {
  return (
    <div className="flex-1 flex flex-col bg-[#0a0c10] text-[#c9d1d9] font-sans p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4 text-[#e6edf3]"><Type size={24} className="text-[#3fb950]"/> RegEx Engine Tester</h1>
      <div className="bg-[#161b22] border border-[#30363d] rounded p-4 mb-4">
         <label className="text-xs text-[#8b949e] font-bold uppercase mb-2 block">Regular Expression</label>
         <div className="flex">
            <span className="bg-[#0d1117] border border-r-0 border-[#30363d] rounded-l px-3 py-2 text-[#8b949e] font-mono">/</span>
            <input type="text" defaultValue="^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6})*$" className="flex-1 bg-[#0a0c10] border border-[#30363d] text-[#58a6ff] font-mono px-3 py-2 outline-none"/>
            <span className="bg-[#0d1117] border border-l-0 border-[#30363d] rounded-r px-3 py-2 text-[#8b949e] font-mono">/gm</span>
         </div>
      </div>
      
      <div className="bg-[#161b22] border border-[#30363d] rounded p-4 flex-1 flex flex-col">
         <label className="text-xs text-[#8b949e] font-bold uppercase mb-2 block">Test String</label>
         <textarea className="flex-1 bg-[#0a0c10] border border-[#30363d] rounded p-3 text-[#c9d1d9] font-mono outline-none resize-none" defaultValue="user@example.com\ninvalid-email@.com\ntest.user@domain.co.uk"></textarea>
         <div className="mt-4 pt-4 border-t border-[#30363d] flex items-center justify-between">
            <span className="flex items-center gap-2 text-[#3fb950] bg-[#3fb950]/10 px-3 py-1 rounded text-sm"><CheckCircle size={16}/> 2 Matches Found</span>
            <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] px-4 py-2 rounded font-bold text-xs flex items-center gap-2"><RefreshCw size={14}/> Re-Evaluate</button>
         </div>
      </div>
    </div>
  );
}
`;
}

function createFontEditor() {
    return `import React from 'react';
import { Type, Edit3, Grid, Save, ZoomIn } from 'lucide-react';

export default function FontEditor() {
  return (
    <div className="flex-1 flex flex-col bg-[#0a0c10] text-[#c9d1d9] font-sans h-full">
      <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex justify-between items-center px-4">
         <div className="font-bold flex items-center gap-2 text-white"><Type size={18} className="text-[#bc8cff]"/> Bitmap Font & Glyph Editor</div>
         <button className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2"><Save size={14}/> Export .FNT</button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
         <div className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col">
            <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] uppercase">Glyph Index</div>
            <div className="grid grid-cols-4 gap-1 p-2 overflow-y-auto">
               {Array.from({length: 64}).map((_, i) => (
                  <div key={i} className={\`aspect-square flex items-center justify-center border font-mono text-lg cursor-pointer \${i === 33 ? 'border-[#bc8cff] bg-[#bc8cff]/20 text-white' : 'border-[#30363d] hover:border-[#8b949e]'}\`}>
                     {String.fromCharCode(i + 32)}
                  </div>
               ))}
            </div>
         </div>
         
         <div className="flex-1 bg-black overflow-hidden flex flex-col">
             <div className="p-2 border-b border-[#30363d] bg-[#0d1117] flex justify-between">
                <div className="text-xs text-[#8b949e] uppercase font-bold flex items-center gap-2">Editing Glyph: <span className="text-white text-lg">A</span> (ASCII: 65)</div>
                <div className="flex gap-2">
                   <button className="p-1 hover:bg-[#30363d] rounded"><Grid size={16} className="text-[#8b949e]"/></button>
                   <button className="p-1 hover:bg-[#30363d] rounded"><ZoomIn size={16} className="text-[#8b949e]"/></button>
                </div>
             </div>
             
             <div className="flex-1 flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(#161b22 1px, transparent 1px), linear-gradient(90deg, #161b22 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                 <div className="w-[320px] h-[320px] border-2 border-[#bc8cff] bg-black grid grid-cols-8 grid-rows-8">
                    {Array.from({length: 64}).map((_, i) => (
                        <div key={i} className={\`border border-[#30363d]/50 \${[2,3,4,9,10,14,17,22,25,30,33,34,35,36,37,38,41,46,49,54,57,62].includes(i) ? 'bg-white' : ''}\`}></div>
                    ))}
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}
`;
}

function createEyeTrackingHeatmap() {
    return `import React from 'react';
import { Eye, Layers, Camera, Play, BarChart } from 'lucide-react';

export default function EyeTrackingHeatmap() {
  return (
    <div className="flex-1 flex flex-col bg-[#0a0c10] text-[#c9d1d9] font-sans">
      <div className="flex justify-between items-center p-4 border-b border-[#30363d] bg-[#161b22]">
         <div className="font-bold flex items-center gap-2 text-white"><Eye size={20} className="text-[#f85149]"/> Biometric Eye Tracking & Heatmap Analyser</div>
         <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs hover:bg-[#30363d] flex items-center gap-2"><Layers size={14}/> Opacity</button>
            <button className="px-3 py-1.5 bg-[#f85149] text-white rounded font-bold text-xs flex items-center gap-2 hover:bg-[#ff7b72]"><Play size={14}/> Replay Session</button>
         </div>
      </div>
      
      <div className="flex-1 flex">
         <div className="flex-1 relative bg-[#050505] overflow-hidden flex items-center justify-center p-8">
            <div className="w-[800px] h-[450px] bg-[#161b22] border border-[#30363d] rounded shadow-2xl relative overflow-hidden">
               {/* Mock UI Background */}
               <div className="absolute inset-0 bg-black flex flex-col opacity-50">
                  <div className="h-16 bg-[#0d1117] flex items-center px-6 justify-between"><div className="w-32 h-6 bg-[#30363d] rounded"></div><div className="flex gap-4"><div className="w-16 h-6 bg-[#30363d] rounded"></div><div className="w-16 h-6 bg-[#30363d] rounded"></div></div></div>
                  <div className="flex-1 flex p-6 gap-6"><div className="flex-1 bg-[#0d1117] rounded-xl"></div><div className="w-64 bg-[#0d1117] rounded-xl flex flex-col gap-4"><div className="flex-1 bg-[#161b22] rounded-xl"></div><div className="flex-1 bg-[#161b22] rounded-xl"></div></div></div>
               </div>
               
               {/* Overlay Heatmap Blobs (Simulated with CSS) */}
               <div className="absolute top-[30%] left-[60%] w-64 h-64 bg-red-500 rounded-full blur-[60px] opacity-70 mix-blend-screen pointer-events-none"></div>
               <div className="absolute top-[20%] left-[80%] w-48 h-48 bg-yellow-500 rounded-full blur-[40px] opacity-60 mix-blend-screen pointer-events-none"></div>
               <div className="absolute top-[70%] left-[30%] w-56 h-56 bg-orange-500 rounded-full blur-[50px] opacity-60 mix-blend-screen pointer-events-none"></div>
               <div className="absolute top-[10%] left-[20%] w-32 h-32 bg-green-500 rounded-full blur-[30px] opacity-40 mix-blend-screen pointer-events-none"></div>
            </div>
         </div>
         
         <div className="w-72 bg-[#161b22] border-l border-[#30363d] p-4 flex flex-col gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
               <h3 className="text-xs font-bold text-[#8b949e] uppercase mb-4 flex items-center gap-2"><BarChart size={14}/> UX Analytics Metrics</h3>
               <div className="space-y-4">
                   <div>
                       <div className="flex justify-between text-xs mb-1"><span>Time to First Fixation</span> <span className="font-mono text-[#58a6ff]">0.42s</span></div>
                       <div className="w-full bg-[#161b22] h-1.5 rounded overflow-hidden"><div className="bg-[#58a6ff] w-[20%] h-full"></div></div>
                   </div>
                   <div>
                       <div className="flex justify-between text-xs mb-1"><span>Average Fixation Duration</span> <span className="font-mono text-[#3fb950]">250ms</span></div>
                       <div className="w-full bg-[#161b22] h-1.5 rounded overflow-hidden"><div className="bg-[#3fb950] w-[60%] h-full"></div></div>
                   </div>
                   <div>
                       <div className="flex justify-between text-xs mb-1"><span>Saccade Amplitude</span> <span className="font-mono text-[#e3b341]">High</span></div>
                       <div className="w-full bg-[#161b22] h-1.5 rounded overflow-hidden"><div className="bg-[#e3b341] w-[80%] h-full"></div></div>
                   </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
`;
}

const files = {
    'RegexTesterPanel.tsx': createRegexTester(),
    'FontEditor.tsx': createFontEditor(),
    'EyeTrackingHeatmap.tsx': createEyeTrackingHeatmap()
};

for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync('src/components/' + filename, content);
}
console.log('Created remaining UI elements.');
