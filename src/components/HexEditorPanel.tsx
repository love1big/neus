import React from 'react';
import { Binary, Search, Save, Edit3, Cpu } from 'lucide-react';

export default function HexEditorPanel() {
  return (
    <div className="flex-1 flex flex-col bg-[#0a0c10] text-[#c9d1d9] font-mono text-sm p-4 h-full">
      <div className="flex justify-between items-center mb-4 bg-[#161b22] p-3 rounded border border-[#30363d]">
         <div className="flex items-center gap-3 font-bold text-[#e6edf3] font-sans">
            <Binary size={20} className="text-[#e3b341]"/> Ultimate Hex / Binary Editor
         </div>
         <div className="flex items-center gap-2">
            <button className="p-1.5 bg-[#21262d] rounded hover:bg-[#30363d]"><Search size={14}/></button>
            <button className="px-3 py-1.5 bg-[#238636] text-white rounded text-xs flex items-center gap-2"><Save size={14}/> Write to Disk</button>
         </div>
      </div>
      
      <div className="flex-1 flex border border-[#30363d] rounded overflow-hidden">
         {/* Offset Column */}
         <div className="bg-[#0d1117] w-24 p-4 border-r border-[#30363d] text-[#8b949e]">
            {Array.from({length: 20}).map((_, i) => (
                <div key={i}>{(i * 16).toString(16).padStart(8, '0').toUpperCase()}</div>
            ))}
         </div>
         
         {/* Hex Values */}
         <div className="flex-1 bg-[#161b22] p-4 text-[#e6edf3] grid grid-cols-16 gap-x-2 gap-y-0 text-center tracking-wider focus:outline-none" contentEditable>
            {Array.from({length: 20 * 16}).map((_, i) => {
                const isSelected = i === 42 || i === 43;
                return (
                 <span key={i} className={`px-1 rounded ${isSelected ? 'bg-[#58a6ff] text-white' : 'hover:bg-[#30363d] cursor-text'}`}>
                    {Math.floor(Math.random()*255).toString(16).padStart(2,'0').toUpperCase()}
                 </span>
            )})}
         </div>
         
         {/* ASCII Display */}
         <div className="w-48 bg-[#0d1117] p-4 border-l border-[#30363d] text-[#8b949e] overflow-hidden break-all">
            {Array.from({length: 20}).map((_, i) => (
                <div key={i}>{String.fromCharCode(...Array.from({length:16}).map(() => Math.floor(Math.random()*90)+32))}</div>
            ))}
         </div>
      </div>
      
      <div className="h-10 mt-4 bg-[#161b22] border border-[#30363d] rounded flex items-center px-4 justify-between text-xs font-sans">
         <span className="text-[#e3b341]">Offset: <span className="font-mono text-white">0000002A</span></span>
         <span className="text-[#58a6ff]">Data Type: <span className="font-mono text-white">Uint32 (Little Endian) -&gt; 2451928</span></span>
      </div>
    </div>
  );
}
