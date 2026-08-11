import React from 'react';
import { Type, Edit3, Grid, Save, ZoomIn} from 'lucide-react';

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
                  <div key={i} className={`aspect-square flex items-center justify-center border font-mono text-lg cursor-pointer ${i === 33 ? 'border-[#bc8cff] bg-[#bc8cff]/20 text-white' : 'border-[#30363d] hover:border-[#8b949e]'}`}>
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
                        <div key={i} className={`border border-[#30363d]/50 ${[2,3,4,9,10,14,17,22,25,30,33,34,35,36,37,38,41,46,49,54,57,62].includes(i) ? 'bg-white' : ''}`}></div>
                    ))}
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}
