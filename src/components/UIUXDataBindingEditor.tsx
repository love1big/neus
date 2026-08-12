import React, { useState } from 'react';
import { LayoutDashboard, Database, Link2, Settings2, Code2, Paintbrush, Play, MousePointer2, Brackets, Percent, Type, MoveRight, AlignLeft, Search, Plus } from 'lucide-react';

export default function UIUXDataBindingEditor() {
  const [selectedUI, setSelectedUI] = useState('hp_bar');
  const [draggedData, setDraggedData] = useState<string | null>(null);

  const uiElements = [
    { id: 'hp_bar', name: 'Player Health Bar', type: 'ProgressBar', boundData: 'Player.Health.Current' },
    { id: 'stamina_bar', name: 'Stamina Ring', type: 'RadialProgress', boundData: 'Player.Stamina.Current' },
    { id: 'ammo_text', name: 'Ammo Counter', type: 'TextLabel', boundData: 'Weapon.Clip.Current' },
    { id: 'money_text', name: 'Gold Display', type: 'TextLabel', boundData: null },
    { id: 'skill_icon', name: 'Ultimate Skill Icon', type: 'Image', boundData: 'Skill.Ultimate.IsReady' },
  ];

  const dataSources = [
    { category: 'Player.Health', variables: ['Current', 'Max', 'RegenRate'] },
    { category: 'Player.Stamina', variables: ['Current', 'Max', 'IsExhausted'] },
    { category: 'Weapon.Clip', variables: ['Current', 'Max', 'IsReloading'] },
    { category: 'Player.Inventory', variables: ['Gold', 'Weight'] },
  ];

  const activeElement = uiElements.find(e => e.id === selectedUI);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#d29922]/20 border border-[#d29922]/50 rounded">
            <Link2 className="text-[#d29922]" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">MVVM Data Binding Architect</h1>
            <p className="text-[10px] text-[#8b949e]">Real-time Logic-to-UI Node Mapper & Interpolation</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
            <Code2 size={14} /> Export View-Model
          </button>
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b]">
            <Play size={14} /> Simulate Live Data
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Data Context (The Model) */}
        <div className="w-64 border-r border-[#30363d] flex flex-col bg-[#161b22]">
          <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] flex justify-between items-center">
            <div className="flex items-center gap-2"><Database size={14} /> DATA SOURCES</div>
            <Search size={14} />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {dataSources.map(group => (
              <div key={group.category} className="mb-4">
                <div className="text-xs font-bold text-[#c9d1d9] mb-2 px-2">{group.category}</div>
                {group.variables.map(v => (
                  <div 
                    key={v}
                    draggable
                    onDragStart={() => setDraggedData(`${group.category}.${v}`)}
                    className="px-3 py-1.5 text-xs text-[#58a6ff] bg-[#0d1117] border border-[#30363d] rounded mb-1 mx-2 cursor-grab active:cursor-grabbing hover:border-[#58a6ff]/50 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <Brackets size={12} /> {v}
                    </div>
                    <MoveRight size={12} className="text-[#8b949e]" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Center: UI Mapping Canvas */}
        <div className="flex-1 bg-[#010409] flex flex-col relative">
           <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button className="p-2 bg-[#161b22] border border-[#30363d] rounded text-white"><MousePointer2 size={16} /></button>
              <button className="p-2 bg-[#161b22] border border-[#30363d] rounded text-[#8b949e] hover:text-white"><LayoutDashboard size={16} /></button>
           </div>

           <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden" 
                style={{ backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
              
              {/* Visual Binding Node Example */}
              <div className="w-full max-w-2xl bg-[#161b22]/90 backdrop-blur border border-[#30363d] rounded-xl shadow-2xl overflow-hidden flex flex-col">
                 <div className="px-4 py-2 border-b border-[#30363d] bg-[#0d1117] flex justify-between items-center text-xs text-[#8b949e]">
                    <span className="font-bold">UI Component: {activeElement?.name}</span>
                    <span className="px-2 py-0.5 bg-[#30363d] rounded text-white">{activeElement?.type}</span>
                 </div>
                 
                 <div className="p-6 flex items-center justify-between gap-4">
                    {/* Left: The Logic Var */}
                    <div className="w-1/3 flex flex-col gap-2 relative">
                       <div className="text-xs font-bold text-[#8b949e] text-center mb-2">GAME LOGIC STATE</div>
                       {activeElement?.boundData ? (
                         <div className="p-3 bg-[#0d1117] border-2 border-[#58a6ff] rounded text-sm text-[#58a6ff] font-mono shadow-[0_0_15px_rgba(88,166,255,0.2)] text-center">
                            {activeElement.boundData}
                         </div>
                       ) : (
                         <div className="p-3 bg-[#0d1117] border-2 border-dashed border-[#30363d] rounded text-sm text-[#8b949e] text-center italic">
                            Drag Data Source Here
                         </div>
                       )}
                    </div>

                    {/* Middle: Data Transformer / Formatter */}
                    <div className="flex-1 flex flex-col items-center">
                       <div className="w-full h-0.5 bg-[#30363d] relative">
                         {activeElement?.boundData && (
                           <>
                             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#58a6ff] to-[#3fb950] -translate-y-1/2"></div>
                             <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_white]"></div>
                           </>
                         )}
                       </div>
                       
                       <div className="mt-4 p-2 bg-[#21262d] border border-[#30363d] rounded-lg flex items-center gap-2 cursor-pointer hover:border-[#8b949e]">
                          <Settings2 size={14} className="text-[#d29922]" />
                          <span className="text-[10px] text-[#c9d1d9] font-mono">Normalize(0, 100) → [0.0 - 1.0]</span>
                       </div>
                    </div>

                    {/* Right: The UI Property */}
                    <div className="w-1/3 flex flex-col gap-2">
                       <div className="text-xs font-bold text-[#8b949e] text-center mb-2">UI PROPERTY</div>
                       <div className="p-3 bg-[#0d1117] border-2 border-[#3fb950] rounded text-sm text-[#3fb950] font-mono shadow-[0_0_15px_rgba(63,185,80,0.2)] flex justify-between items-center">
                          <Percent size={14} /> <span>Fill Amount</span>
                       </div>
                    </div>
                 </div>

                 {/* Visual Preview */}
                 <div className="p-6 bg-[#0d1117] border-t border-[#30363d] flex flex-col items-center gap-4">
                    <div className="text-[10px] text-[#8b949e]">LIVE PREVIEW</div>
                    {activeElement?.id === 'hp_bar' && (
                      <div className="w-64 h-4 bg-[#21262d] rounded-full overflow-hidden border border-[#30363d]">
                        <div className="w-[85%] h-full bg-gradient-to-r from-[#ea4aaa] to-[#f85149] shadow-[0_0_10px_#f85149]"></div>
                      </div>
                    )}
                    {activeElement?.id === 'ammo_text' && (
                      <div className="text-3xl font-bold font-mono text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                        24 <span className="text-[#8b949e] text-xl">/ 30</span>
                      </div>
                    )}
                    {activeElement?.id === 'stamina_bar' && (
                       <div className="w-16 h-16 rounded-full border-4 border-[#30363d] border-t-[#3fb950] border-r-[#3fb950] border-b-[#3fb950] transform -rotate-45"></div>
                    )}
                    {!['hp_bar', 'ammo_text', 'stamina_bar'].includes(activeElement?.id || '') && (
                      <div className="w-16 h-16 bg-[#21262d] rounded border-2 border-dashed border-[#30363d] flex items-center justify-center text-[#8b949e]">UI</div>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* Right: UI Hierarchy & Inspector */}
        <div className="w-80 border-l border-[#30363d] flex flex-col bg-[#161b22]">
          <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] flex justify-between items-center">
            <div className="flex items-center gap-2"><LayoutDashboard size={14} /> UI HIERARCHY</div>
            <Plus size={14} className="hover:text-white cursor-pointer" />
          </div>
          
          <div className="flex-1 overflow-y-auto border-b border-[#30363d]">
            {uiElements.map(ui => (
              <div 
                key={ui.id}
                onClick={() => setSelectedUI(ui.id)}
                className={`w-full text-left px-4 py-2 flex items-center justify-between text-xs cursor-pointer ${
                  selectedUI === ui.id ? 'bg-[#3fb950]/20 text-[#3fb950] border-l-2 border-[#3fb950]' : 'text-[#c9d1d9] hover:bg-[#21262d] border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  {ui.type === 'ProgressBar' || ui.type === 'RadialProgress' ? <Percent size={14} /> : <Type size={14} />}
                  {ui.name}
                </div>
                {ui.boundData && <Link2 size={12} className="text-[#58a6ff]" />}
              </div>
            ))}
          </div>

          <div className="h-1/2 overflow-y-auto bg-[#0d1117]">
             <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] sticky top-0 bg-[#0d1117] z-10 flex items-center gap-2">
               <Settings2 size={14} /> BINDING INSPECTOR
             </div>
             <div className="p-4 space-y-4 text-sm">
                <div>
                  <div className="text-xs text-[#8b949e] mb-1">Binding Mode</div>
                  <select className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white outline-none focus:border-[#58a6ff]">
                    <option>One-Way (Logic → UI)</option>
                    <option>Two-Way (Logic ↔ UI)</option>
                    <option>One-Time (Initialize only)</option>
                  </select>
                </div>

                <div>
                  <div className="text-xs text-[#8b949e] mb-1">Data Transformer (Modifier)</div>
                  <select className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white outline-none focus:border-[#58a6ff]">
                    <option>Normalized (0.0 to 1.0)</option>
                    <option>String Format</option>
                    <option>Integer Rounding</option>
                    <option>Boolean to Visibility</option>
                    <option>None (Raw Value)</option>
                  </select>
                </div>

                {activeElement?.type === 'TextLabel' && (
                  <div>
                    <div className="text-xs text-[#8b949e] mb-1">String Format Mask</div>
                    <input type="text" defaultValue="{value} / {max}" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-[#58a6ff] font-mono outline-none focus:border-[#58a6ff]" />
                  </div>
                )}

                <div>
                  <div className="text-xs text-[#8b949e] mb-1">Interpolation (Smoothing)</div>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-7 h-4 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#3fb950]"></div>
                    </label>
                    <span className="text-xs">Smooth Lerp (DeltaTime)</span>
                  </div>
                  <div className="mt-2 pl-9">
                    <div className="text-[10px] text-[#8b949e] mb-1">Lerp Speed</div>
                    <input type="range" className="w-full accent-[#3fb950]" min="1" max="20" defaultValue="10" />
                  </div>
                </div>

             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
