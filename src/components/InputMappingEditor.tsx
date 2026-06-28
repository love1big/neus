import React, { useState } from 'react';
import { Keyboard, Mouse, Gamepad2, Settings, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';

export default function InputMapping() {
  const [activeTab, setActiveTab] = useState('PC');
  
  return (
    <div className="flex-1 flex flex-col bg-[#0a0c10] text-[#c9d1d9] font-sans p-6">
      <div className="max-w-6xl mx-auto w-full">
         <div className="flex items-end justify-between border-b border-[#30363d] pb-4 mb-6">
             <div>
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-3"><Keyboard className="text-[#58a6ff]" size={32}/> Unified Input Mapping</h1>
                <p className="text-sm text-[#8b949e] mt-1">Configure Omni-Platform Input Actions, Axis Mappings, and Contextual Overrides.</p>
             </div>
             <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-[#21262d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]"><RotateCcw size={14}/> Reset Defaults</button>
                <button className="px-3 py-1.5 bg-[#238636] text-white rounded text-xs font-bold flex items-center gap-2 hover:bg-[#2ea043]"><Save size={14}/> Save Schema</button>
             </div>
         </div>
         
         <div className="flex border-b border-[#30363d] mb-6">
            <button onClick={() => setActiveTab('PC')} className={`px-6 py-3 font-bold text-sm tracking-wide flex items-center gap-2 border-b-2 ${activeTab==='PC' ? 'border-[#58a6ff] text-[#58a6ff]' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'}`}><Mouse size={16}/> Keyboard & Mouse</button>
            <button onClick={() => setActiveTab('Gamepad')} className={`px-6 py-3 font-bold text-sm tracking-wide flex items-center gap-2 border-b-2 ${activeTab==='Gamepad' ? 'border-[#3fb950] text-[#3fb950]' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'}`}><Gamepad2 size={16}/> Standard Gamepad</button>
            <button onClick={() => setActiveTab('Advanced')} className={`px-6 py-3 font-bold text-sm tracking-wide flex items-center gap-2 border-b-2 ${activeTab==='Advanced' ? 'border-[#bc8cff] text-[#bc8cff]' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'}`}><Settings size={16}/> Advanced Macros</button>
         </div>
         
         <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
             <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#30363d] bg-[#0d1117] font-bold text-xs text-[#8b949e] uppercase tracking-wider">
                 <div className="col-span-4">Action Name</div>
                 <div className="col-span-3">Primary Binding</div>
                 <div className="col-span-3">Secondary Binding</div>
                 <div className="col-span-2 text-right">Actions</div>
             </div>
             
             {[
               { name: 'Move Forward', p: 'W / Up Arrow', s: 'Gamepad L-Stick Up' },
               { name: 'Move Backward', p: 'S / Down Arrow', s: 'Gamepad L-Stick Down' },
               { name: 'Strafe Left', p: 'A / Left Arrow', s: 'Gamepad L-Stick Left' },
               { name: 'Strafe Right', p: 'D / Right Arrow', s: 'Gamepad L-Stick Right' },
               { name: 'Jump', p: 'Spacebar', s: 'Gamepad A / Cross' },
               { name: 'Crouch', p: 'Left Ctl / C', s: 'Gamepad B / Circle' },
               { name: 'Primary Fire', p: 'Left Mouse Button', s: 'Gamepad RT' },
               { name: 'Aim Down Sights', p: 'Right Mouse Button', s: 'Gamepad LT' },
             ].map((action, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-[#30363d] items-center hover:bg-[#21262d] transition group">
                   <div className="col-span-4 font-medium text-[#e6edf3]">{action.name}</div>
                   <div className="col-span-3">
                      <button className="bg-[#0a0c10] border border-[#30363d] px-3 py-1.5 rounded text-xs font-mono text-[#58a6ff] w-full text-left hover:border-[#58a6ff]">{action.p}</button>
                   </div>
                   <div className="col-span-3">
                      <button className="bg-[#0a0c10] border border-[#30363d] px-3 py-1.5 rounded text-xs font-mono text-[#8b949e] w-full text-left hover:border-[#bc8cff]">{action.s}</button>
                   </div>
                   <div className="col-span-2 text-right flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition">
                      <button className="p-1.5 text-[#8b949e] hover:text-[#58a6ff] bg-[#0d1117] rounded"><Plus size={14}/></button>
                      <button className="p-1.5 text-[#8b949e] hover:text-[#f85149] bg-[#0d1117] rounded"><Trash2 size={14}/></button>
                   </div>
                </div>
             ))}
             
             <button className="w-full p-3 text-center text-xs font-bold text-[#58a6ff] hover:bg-[#21262d] flex justify-center items-center gap-2">
                 <Plus size={16}/> Add New Input Action
             </button>
         </div>
      </div>
    </div>
  );
}
