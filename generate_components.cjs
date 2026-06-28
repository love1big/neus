const fs = require('fs');

function createMonsterEditor() {
    return `import React, { useState } from 'react';
import { Skull, Activity, Shield, Zap, Target, Sliders, Dna, Save, Filter, Search, Layers, RefreshCcw, Bone, Flame } from 'lucide-react';

export default function MonsterEditor() {
  const [selectedMonster, setSelectedMonster] = useState('Goblin Warrior');
  return (
    <div className="flex h-full w-full bg-[#0a0c10] text-[#c9d1d9] font-sans">
      <div className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col">
        <div className="p-3 border-b border-[#30363d] flex items-center gap-2 text-[#e3b341] font-bold text-sm uppercase">
          <Skull size={18} /> Monster Bestiary
        </div>
        <div className="p-2 border-b border-[#30363d]">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 text-[#8b949e]" size={14} />
            <input type="text" placeholder="Search entity..." className="w-full bg-[#0d1117] border border-[#30363d] rounded text-xs py-1.5 pl-7 pr-2" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
           {['Goblin Warrior', 'Ogre Brute', 'Cave Troll', 'Lich King', 'Shadow Fiend'].map(name => (
             <button key={name} onClick={() => setSelectedMonster(name)} className={\`w-full text-left px-3 py-2 text-xs rounded transition flex items-center justify-between \${selectedMonster === name ? 'bg-[#3fb950]/20 border border-[#3fb950]/50 text-[#3fb950]' : 'hover:bg-[#21262d]'}\`}>
                <span>{name}</span>
                {selectedMonster === name && <Activity size={12} />}
             </button>
           ))}
        </div>
        <button className="m-3 mt-auto p-2 bg-[#f85149] text-white rounded text-xs font-bold text-center hover:bg-[#ff7b72] flex justify-center items-center gap-2">
           <Zap size={14}/> Spawn New Entity
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto">
        <div className="max-w-5xl w-full">
           <div className="flex justify-between items-end mb-6 border-b border-[#30363d] pb-4">
              <div>
                 <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2">{selectedMonster}</h1>
                 <p className="text-[#8b949e] text-xs">Entity Class: Humanoid / Aggressive | Threat Level: Medium</p>
              </div>
              <button className="bg-[#238636] text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#2ea043]"><Save size={16}/> Save Blueprint</button>
           </div>
           
           <div className="grid grid-cols-3 gap-6">
              {/* Stats Panel */}
              <div className="col-span-1 bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                 <h3 className="text-[#e6edf3] font-bold mb-4 flex items-center gap-2"><Target size={16} className="text-[#ff7b72]" /> Combat Stats</h3>
                 <div className="space-y-3">
                    <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-[#8b949e]">Health (HP)</span> <span className="font-mono text-[#3fb950]">850</span></div>
                       <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden"><div className="bg-[#3fb950] h-full" style={{width: '60%'}}></div></div>
                    </div>
                    <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-[#8b949e]">Damage (DMG)</span> <span className="font-mono text-[#f85149]">120</span></div>
                       <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden"><div className="bg-[#f85149] h-full" style={{width: '40%'}}></div></div>
                    </div>
                    <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-[#8b949e]">Armor (DEF)</span> <span className="font-mono text-[#58a6ff]">45</span></div>
                       <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden"><div className="bg-[#58a6ff] h-full" style={{width: '25%'}}></div></div>
                    </div>
                    <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-[#8b949e]">Speed (SPD)</span> <span className="font-mono text-[#e3b341]">1.2x</span></div>
                       <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden"><div className="bg-[#e3b341] h-full" style={{width: '50%'}}></div></div>
                    </div>
                 </div>
              </div>
              
              {/* Behaviors */}
              <div className="col-span-2 bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                 <h3 className="text-[#e6edf3] font-bold mb-4 flex items-center gap-2"><Dna size={16} className="text-[#bc8cff]" /> AI Behaviors & Traits</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded">
                       <h4 className="text-xs font-bold text-[#e6edf3] mb-2 flex items-center gap-1"><Shield size={14} className="text-[#3fb950]"/> Aggro Radius</h4>
                       <input type="range" className="w-full accent-[#3fb950]" defaultValue="60" />
                       <p className="text-[10px] text-[#8b949e] mt-2">Distance to trigger combat state.</p>
                    </div>
                    <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded">
                       <h4 className="text-xs font-bold text-[#e6edf3] mb-2 flex items-center gap-1"><Flame size={14} className="text-[#f85149]"/> Attack Pattern</h4>
                       <select className="w-full bg-[#161b22] border border-[#30363d] text-xs p-1 rounded text-[#e6edf3]">
                          <option>Melee Brute Force</option>
                          <option>Hit and Run</option>
                          <option>Ranged Support</option>
                          <option>Ambush Predator</option>
                       </select>
                       <p className="text-[10px] text-[#8b949e] mt-2">Default combat algorithm logic.</p>
                    </div>
                    <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded col-span-2">
                       <h4 className="text-xs font-bold text-[#e6edf3] mb-2 flex items-center gap-1"><Bone size={14} className="text-[#e3b341]"/> Loot Drops & Modifiers</h4>
                       <div className="flex gap-2">
                          <span className="bg-[#f85149]/10 text-[#f85149] px-2 py-1 rounded text-xs border border-[#f85149]/30">Health Potion 15%</span>
                          <span className="bg-[#58a6ff]/10 text-[#58a6ff] px-2 py-1 rounded text-xs border border-[#58a6ff]/30">Rusty Sword 5%</span>
                          <span className="bg-[#bc8cff]/10 text-[#bc8cff] px-2 py-1 rounded text-xs border border-[#bc8cff]/30">Gold Coins 40%</span>
                       </div>
                    </div>
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

function createInputMapping() {
    return `import React, { useState } from 'react';
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
            <button onClick={() => setActiveTab('PC')} className={\`px-6 py-3 font-bold text-sm tracking-wide flex items-center gap-2 border-b-2 \${activeTab==='PC' ? 'border-[#58a6ff] text-[#58a6ff]' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'}\`}><Mouse size={16}/> Keyboard & Mouse</button>
            <button onClick={() => setActiveTab('Gamepad')} className={\`px-6 py-3 font-bold text-sm tracking-wide flex items-center gap-2 border-b-2 \${activeTab==='Gamepad' ? 'border-[#3fb950] text-[#3fb950]' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'}\`}><Gamepad2 size={16}/> Standard Gamepad</button>
            <button onClick={() => setActiveTab('Advanced')} className={\`px-6 py-3 font-bold text-sm tracking-wide flex items-center gap-2 border-b-2 \${activeTab==='Advanced' ? 'border-[#bc8cff] text-[#bc8cff]' : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'}\`}><Settings size={16}/> Advanced Macros</button>
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
`;
}

function createAccessibilityTester() {
    return `import React, { useState } from 'react';
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
                  className={\`p-3 rounded text-left text-xs font-medium border flex items-center justify-between transition-all \${filter === f.id ? f.color + ' border-l-4' : 'bg-[#0d1117] border-[#30363d] hover:bg-[#21262d]'}\`}
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
          
          <div className={\`flex-1 p-12 transition-all duration-700 flex items-center justify-center \${filter === 'blurred' ? 'blur-sm' : filter === 'achromatopsia' ? 'grayscale' : filter === 'protanopia' ? 'sepia-[.4] hue-rotate-[-30deg]' : ''}\`}>
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
`;
}

function createVideoEncoder() {
    return `import React from 'react';
import { Film, Video, Scissors, HardDrive, Settings, MonitorPlay, FastForward } from 'lucide-react';

export default function VideoEncoderStudio() {
   return (
      <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-8">
         <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6 flex items-center gap-3">
             <Video size={36} className="text-red-500" /> Advanced Video Encoder & Compressor
         </h1>
         
         <div className="grid grid-cols-2 gap-8 h-full">
            <div className="flex flex-col gap-6">
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                    <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Film size={18}/> Source Media</h2>
                    <div className="border-2 border-dashed border-[#30363d] rounded-lg p-10 flex flex-col items-center justify-center text-[#8b949e] hover:border-[#58a6ff] hover:bg-[#58a6ff]/5 transition cursor-pointer">
                        <HardDrive size={32} className="mb-3 opacity-50" />
                        <p className="font-bold">Drag and drop raw renders here</p>
                        <p className="text-xs mt-1">Supports MP4, AVI, MKV, ProRes, EXR seq</p>
                    </div>
                </div>
                
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex-1">
                    <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Settings size={18}/> Encoding Settings</h2>
                    
                    <div className="space-y-4">
                        <div>
                           <label className="text-xs font-bold text-[#8b949e] uppercase mb-1 block">Codec</label>
                           <select className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-sm text-[#e6edf3]">
                               <option>H.265 / HEVC (NVENC)</option>
                               <option>H.264 / AVC (NVENC)</option>
                               <option>AV1 (Hardware Accelerated)</option>
                               <option>Apple ProRes 422 HQ</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-xs font-bold text-[#8b949e] uppercase mb-1 block">Resolution & Framerate</label>
                           <div className="flex gap-2">
                               <select className="flex-1 bg-[#0d1117] border border-[#30363d] rounded p-2 text-sm text-[#e6edf3]">
                                   <option>4K UHD (3840x2160)</option>
                                   <option>1080p FHD (1920x1080)</option>
                               </select>
                               <select className="w-24 bg-[#0d1117] border border-[#30363d] rounded p-2 text-sm text-[#e6edf3]">
                                   <option>60 FPS</option>
                                   <option>30 FPS</option>
                                   <option>24 FPS</option>
                               </select>
                           </div>
                        </div>
                        <div>
                           <label className="text-xs font-bold text-[#8b949e] uppercase mb-1 block">Bitrate Control</label>
                           <input type="range" className="w-full accent-[#58a6ff]" />
                           <div className="flex justify-between text-[#8b949e] text-xs">
                               <span>VBR</span>
                               <span>Target: 25 Mbps</span>
                               <span>CBR</span>
                           </div>
                        </div>
                    </div>
                    
                    <button className="w-full mt-8 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-3 rounded overflow-hidden shadow-lg hover:shadow-red-500/20 transition flex items-center justify-center gap-2 cursor-pointer">
                        <FastForward size={18}/> Start Encoding Queue
                    </button>
                </div>
            </div>
            
            <div className="bg-black border border-[#30363d] rounded-xl flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <MonitorPlay size={64} className="text-[#30363d]" />
                </div>
                <div className="mt-auto absolute bottom-0 w-full bg-[#161b22]/90 backdrop-blur border-t border-[#30363d] p-4 p-4 text-xs font-mono">
                    <div className="flex justify-between items-center text-[#c9d1d9] mb-2 font-bold">
                        <span>Status: IDLE</span>
                        <span className="text-[#8b949e]">GPU VRAM: 0%</span>
                    </div>
                </div>
            </div>
         </div>
      </div>
   );
}
`;
}

function createHexEditor() {
    return `import React from 'react';
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
                 <span key={i} className={\`px-1 rounded \${isSelected ? 'bg-[#58a6ff] text-white' : 'hover:bg-[#30363d] cursor-text'}\`}>
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
`;
}

function createASTNodeWeaver() {
    return `import React from 'react';
import { Network, Component, FileCode2, Layers, Cpu, Play } from 'lucide-react';

export default function ASTNodeWeaver() {
  return (
    <div className="flex-1 flex w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans">
      <div className="w-80 bg-[#161b22] border-r border-[#30363d] flex flex-col">
        <div className="p-4 border-b border-[#30363d]">
           <h2 className="text-[#ff7b72] font-bold flex items-center gap-2"><Network size={18}/> AST Logic Weaver</h2>
           <p className="text-xs text-[#8b949e] mt-1">Directly manipulate Abstract Syntax Trees to weave logic flows visually.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
           <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b949e] mb-3">Syntax Nodes</h3>
           <div className="space-y-2">
              <div className="p-2 border border-[#30363d] bg-[#0d1117] rounded shadow cursor-grab"><Component size={14} className="inline mr-2 text-[#58a6ff]"/> VariableDeclaration</div>
              <div className="p-2 border border-[#30363d] bg-[#0d1117] rounded shadow cursor-grab"><Layers size={14} className="inline mr-2 text-[#e3b341]"/> ArrowFunctionExpr</div>
              <div className="p-2 border border-[#30363d] bg-[#0d1117] rounded shadow cursor-grab"><FileCode2 size={14} className="inline mr-2 text-[#3fb950]"/> IfStatement</div>
              <div className="p-2 border border-[#30363d] bg-[#0d1117] rounded shadow cursor-grab"><Cpu size={14} className="inline mr-2 text-[#bc8cff]"/> TryCatchBlock</div>
           </div>
        </div>
        <div className="p-4 border-t border-[#30363d]">
           <button className="w-full bg-[#238636] text-white py-2 rounded text-sm font-bold flex justify-center items-center gap-2 hover:bg-[#2ea043]"><Play size={16}/> Compile AST to Script</button>
        </div>
      </div>
      
      <div className="flex-1 bg-[#050505] relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(#161b22 1px, transparent 1px), linear-gradient(90deg, #161b22 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
         {/* Canvas Mockup */}
         <div className="absolute top-20 left-20 w-48 bg-[#161b22] border-2 border-[#58a6ff] rounded shadow-2xl p-3">
             <div className="font-bold text-xs text-[#58a6ff] mb-2 border-b border-[#30363d] pb-1">VariableDeclaration</div>
             <div className="text-[10px] text-white font-mono break-all">name: "EngineCore"</div>
             <div className="text-[10px] text-white font-mono break-all mt-1">type: "const"</div>
             <div className="w-3 h-3 bg-[#58a6ff] rounded-full absolute -right-2 top-1/2 transform -translate-y-1/2"></div>
         </div>
         
         <svg className="absolute inset-0 pointer-events-none w-full h-full"><path d="M 212 110 C 250 110, 300 220, 350 220" fill="none" stroke="#e3b341" strokeWidth="2"/></svg>
         
         <div className="absolute top-48 left-[350px] w-56 bg-[#161b22] border-2 border-[#e3b341] rounded shadow-2xl p-3">
             <div className="h-3 w-3 bg-[#e3b341] rounded-full absolute -left-2 top-1/2 transform -translate-y-1/2"></div>
             <div className="font-bold text-xs text-[#e3b341] mb-2 border-b border-[#30363d] pb-1">ArrowFunctionExpr</div>
             <div className="text-[10px] text-white font-mono mt-1 text-[#8b949e]">async () =&gt; &#123; ... &#125;</div>
         </div>
      </div>
    </div>
  );
}
`;
}

const files = {
    'MonsterEditor.tsx': createMonsterEditor(),
    'InputMappingEditor.tsx': createInputMapping(),
    'AccessibilityTester.tsx': createAccessibilityTester(),
    'VideoEncoderStudio.tsx': createVideoEncoder(),
    'HexEditorPanel.tsx': createHexEditor(),
    'ASTNodeWeaver.tsx': createASTNodeWeaver()
};

for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync('src/components/' + filename, content);
}
console.log('Done creating generic UI replacements.');
