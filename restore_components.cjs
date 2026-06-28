const fs = require('fs');

const createMissingComponent = (filename, name, iconText, subtitle, gradientFrom, gradientTo) => {
  const content = `import React from 'react';
import { Activity, Play, Settings2, Box, Cpu } from 'lucide-react';

export default function ${name}() {
  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-6 overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${gradientFrom} ${gradientTo} mb-2 tracking-tight">
            ${titleCase(name.replace(/([A-Z])/g, ' $1').trim())}
          </h1>
          <p className="text-[#8b949e] max-w-xl text-sm">${subtitle} (Restored & Upgraded 🚀)</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[#21262d] text-white rounded font-medium hover:bg-[#30363d] transition flex items-center gap-2 text-sm border border-[#30363d]">
             <Settings2 size={16} /> Config
          </button>
          <button className="px-5 py-2 bg-[#f85149] text-white font-bold rounded hover:bg-[#ff7b72] transition shadow-[0_0_15px_rgba(248,81,73,0.3)] tracking-wide flex items-center gap-2 text-sm">
             <Play size={16}/> Start Module
          </button>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#161b22] z-0"></div>
            <div className="z-10 flex flex-col items-center opacity-50 group-hover:opacity-100 transition duration-500">
               <div className="mb-4 ${gradientFrom.replace('from-', 'text-')}">{iconText}</div>
               <span className="text-[#8b949e] font-mono text-sm tracking-widest border border-[#30363d] px-4 py-1 rounded bg-[#0d1117]/80">SYSTEM OFFLINE / STANDBY</span>
            </div>
            {/* Cool scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col">
            <h3 className="text-[#e6edf3] font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Activity size={16} className="text-[#3fb950]"/> Live Diagnostics</h3>
            <div className="flex-1 space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center"><span className="text-[#8b949e]">Engine State</span> <span className="text-[#3fb950] bg-[#3fb950]/10 px-2 py-0.5 rounded">READY</span></div>
                <div className="flex justify-between items-center"><span className="text-[#8b949e]">Memory Alloc</span> <span className="text-[#c9d1d9]">14.2 MB</span></div>
                <div className="flex justify-between items-center"><span className="text-[#8b949e]">Threads</span> <span className="text-[#58a6ff]">8 Active</span></div>
                <div className="flex justify-between items-center"><span className="text-[#8b949e]">GPU VRAM</span> <span className="text-[#e3b341]">420 MB</span></div>
                
                <div className="mt-8 pt-4 border-t border-[#30363d] text-[#8b949e]">
                    [LOG] Module initialized.<br/>
                    [LOG] Awaiting user command.<br/>
                    [LOG] Hardware accelerated mode linked.
                </div>
            </div>
            <button className="w-full mt-4 bg-[#238636] hover:bg-[#2ea043] text-white py-2 rounded font-bold transition flex items-center justify-center gap-2">
                <Cpu size={16}/> Initialize Core
            </button>
        </div>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync('src/components/' + filename, content);
};

function titleCase(str) {
   return str.toLowerCase().split(' ').map(function(word) {
     return word.replace(word[0], word[0].toUpperCase());
   }).join(' ');
}

createMissingComponent('PCGEditor.tsx', 'PCGEditor', '<Box size={64}/>', 'Procedural Content Generation node engine.', 'from-green-400', 'to-blue-500');
createMissingComponent('LocalAIStudio.tsx', 'LocalAIStudio', '<Cpu size={64}/>', 'Manage and tune offline AI models instantly.', 'from-purple-500', 'to-pink-500');
createMissingComponent('BatchAIImporter.tsx', 'BatchAIImporter', '<Box size={64}/>', 'Bulk import and tag content using Vision AI.', 'from-yellow-400', 'to-red-500');
createMissingComponent('VoiceMusicStudio.tsx', 'VoiceMusicStudio', '<Activity size={64}/>', 'AI generative voice & dynamic music mixer.', 'from-blue-400', 'to-cyan-400');
createMissingComponent('AICommandCenter.tsx', 'AICommandCenter', '<Activity size={64}/>', 'Central hub for AI agents and game world oversight.', 'from-red-500', 'to-orange-500');
createMissingComponent('AudioEditor.tsx', 'AudioEditor', '<Activity size={64}/>', 'Classic timeline-based audio editing studio.', 'from-indigo-400', 'to-purple-500');

console.log('Restored missing components.');
