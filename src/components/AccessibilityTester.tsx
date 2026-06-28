import React, { useState } from 'react';
import { Eye, Glasses, ZoomIn, Contrast, Layout, Wand2, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AccessibilityTester() {
  const [filter, setFilter] = useState('none');
  
  const filters = [
      { id: 'none', label: 'Standard Vision', color: 'bg-transparent border-[#30363d]' },
      { id: 'protanopia', label: 'Protanopia (Red-blind)', color: 'bg-red-500/20 border-red-500/50' },
      { id: 'deuteranopia', label: 'Deuteranopia (Green-blind)', color: 'bg-green-500/20 border-green-500/50' },
      { id: 'tritanopia', label: 'Tritanopia (Blue-blind)', color: 'bg-blue-500/20 border-blue-500/50' },
      { id: 'achromatopsia', label: 'Achromatopsia (Grayscale)', color: 'bg-gray-500/20 border-gray-500/50' },
      { id: 'blurred', label: 'Cataracts / Blurred', color: 'bg-yellow-500/20 border-yellow-500/50' }
  ];

  return (
    <div className="flex h-full w-full bg-[#0a0c10] text-[#c9d1d9] font-sans">
       <div className="w-72 bg-[#161b22] border-r border-[#30363d] p-4 flex flex-col">
          <h2 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-xs border-b border-[#30363d] pb-3">
             <Glasses className="text-[#bc8cff]" size={16}/> Vision Simulators
          </h2>
          
          <div className="flex flex-col gap-2 flex-1">
             {filters.map(f => (
                <button 
                  key={f.id} 
                  onClick={() => setFilter(f.id)}
                  className={`p-3 rounded text-left text-xs font-medium border flex items-center justify-between transition-all ${filter === f.id ? f.color + ' border-l-4' : 'bg-[#0d1117] border-[#30363d] hover:bg-[#21262d]'}`}
                >
                   {f.label}
                   {filter === f.id && <Activity size={14} className="opacity-70" />}
                </button>
             ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-[#30363d]">
             <div className="bg-[#21262d] rounded-lg p-3 text-xs">
                <div className="flex items-center gap-2 text-[#3fb950] font-bold mb-2"><ShieldCheck size={14}/> Contrast Report</div>
                <div className="flex justify-between text-[#8b949e] mb-1"><span>WCAG 2.1 AAA</span> <span className="text-[#3fb950]">PASS</span></div>
                <div className="flex justify-between text-[#8b949e]"><span>Text vs Bg</span> <span className="text-[#e6edf3]">7.2:1</span></div>
             </div>
          </div>
       </div>
       
       <div className="flex-1 bg-black overflow-hidden relative flex flex-col">
          <div className="h-10 bg-[#161b22] border-b border-[#30363d] flex justify-between items-center px-4">
             <span className="text-xs text-[#8b949e] font-mono">Live UI Preview rendering with active post-process filter</span>
             <div className="flex gap-3 text-[#c9d1d9]">
                <ZoomIn size={16} className="cursor-pointer hover:text-white"/>
                <Layout size={16} className="cursor-pointer hover:text-white"/>
             </div>
          </div>
          
          <div className={`flex-1 p-12 transition-all duration-700 flex items-center justify-center ${filter === 'blurred' ? 'blur-sm' : filter === 'achromatopsia' ? 'grayscale' : filter === 'protanopia' ? 'sepia-[.4] hue-rotate-[-30deg]' : ''}`}>
             {/* Mock Game UI */}
             <div className="w-[800px] h-[500px] bg-[#1a1c23] rounded-xl border border-[#30363d] shadow-2xl relative overflow-hidden flex flex-col">
                 <div className="absolute top-0 w-full h-48 bg-gradient-to-b from-red-500/20 to-transparent pointer-events-none"></div>
                 
                 <div className="flex justify-between p-6 relative z-10">
                    <div className="bg-black/50 p-4 rounded-lg border border-[#30363d] w-64">
                       <h3 className="text-white font-bold text-lg mb-2">Health Status</h3>
                       <div className="h-4 bg-gray-800 rounded-full overflow-hidden mb-2">
                           <div className="h-full bg-red-500 w-[40%]"></div>
                       </div>
                       <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 w-[80%]"></div>
                       </div>
                    </div>
                    
                    <div className="bg-black/50 p-4 rounded-lg border border-[#30363d] text-right">
                       <h3 className="text-white font-bold font-mono text-3xl">Score: 4,028</h3>
                       <p className="text-yellow-400 text-sm">Multiplier x4</p>
                    </div>
                 </div>
                 
                 <div className="mt-auto p-6 flex justify-center pb-12">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-lg font-bold text-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-400">
                        CONTINUE QUEST
                    </button>
                    <button className="bg-transparent border border-gray-600 text-gray-300 px-6 py-4 rounded-lg font-bold text-sm ml-4 hover:bg-gray-800">
                        Cancel
                    </button>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
}
