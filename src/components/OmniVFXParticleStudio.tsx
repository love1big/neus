import React, { useState } from 'react';
import { 
  Sparkles, Flame, Droplets, Wind, Activity, Zap, Combine, Share2, 
  Layers, Play, Pause, Save, Eye, Settings2, Sliders, Brush, MousePointer2,
  AlertTriangle, RotateCw, MonitorPlay, Infinity as InfinityIcon
} from 'lucide-react';

export default function OmniVFXParticleStudio() {
  const [activeTab, setActiveTab] = useState('Graph'); // Graph, Compositor, Chaos, Hitbox, Emitters
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0a0a] text-[#cccccc] font-sans text-xs overflow-hidden select-none">
      
      {/* 💥 ELITE TOP NAVBAR 💥 */}
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1.5 rounded border border-[#333] shadow-inner items-center gap-2">
                   <Flame size={18} className="text-[#f85149] animate-[pulse_0.5s_infinite]"/>
                   <span className="text-white font-black tracking-widest text-[12px] uppercase" style={{textShadow: '0 0 10px rgba(248,81,73,0.6)'}}>Omni VFX & Particle Node Studio</span>
                   <span className="text-[#666] font-mono text-[9px] ml-2">Hyper-Realism Module</span>
                </div>
                <div className="h-6 w-px bg-[#333]"></div>
                <div className="flex text-[10px] font-mono gap-5 text-[#8b949e]">
                   <span className="flex items-center gap-1" title="Particle Count"><Sparkles size={12} className="text-[#e3b341]"/> 2.4M Particles</span>
                   <span className="flex items-center gap-1" title="Simulation Time"><Activity size={12} className="text-[#58a6ff]"/> 0.45ms / frame</span>
                   <span className="flex items-center gap-1"><AlertTriangle size={12} className="text-[#f85149]"/> Chaos Solver: ACTIVE</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                 <button className="px-3 py-1.5 bg-[#1a1a1a] border border-[#333] text-white rounded hover:bg-[#222] transition flex items-center gap-2 font-bold text-[10px]"><Save size={12}/> Compile Shader</button>
                 <button onClick={() => setIsPlaying(!isPlaying)} className={`px-5 py-1.5 ${isPlaying ? 'bg-[#f85149]' : 'bg-[#3fb950]'} text-white font-black rounded shadow-[0_0_15px_rgba(248,81,73,0.4)] transition flex items-center gap-2 text-[11px] uppercase tracking-widest border border-white/20`}>
                    {isPlaying ? <Pause size={12} fill="currentColor"/> : <Play size={12} fill="currentColor"/>} {isPlaying ? 'Pause Sim' : 'Play Sim'}
                 </button>
            </div>
         </div>

         {/* Meta-Module Ribbon */}
         <div className="flex px-2 bg-[#0a0a0a] border-t border-[#222]">
            <ModuleTab active={activeTab === 'Graph'} onClick={() => setActiveTab('Graph')} icon={<Share2 size={12}/>} label="1. Node Graph (Niagara Equivalent)" color="text-[#58a6ff]"/>
            <ModuleTab active={activeTab === 'Emitters'} onClick={() => setActiveTab('Emitters')} icon={<Sparkles size={12}/>} label="2. Emitter Configs" color="text-[#e3b341]"/>
            <ModuleTab active={activeTab === 'Compositor'} onClick={() => setActiveTab('Compositor')} icon={<Combine size={12}/>} label="3. Nuke Compositor" color="text-[#bc8cff]"/>
            <ModuleTab active={activeTab === 'Chaos'} onClick={() => setActiveTab('Chaos')} icon={<AlertTriangle size={12}/>} label="4. Chaos Destruction & Physics" color="text-[#f85149]"/>
            <ModuleTab active={activeTab === 'Hitbox'} onClick={() => setActiveTab('Hitbox')} icon={<MonitorPlay size={12}/>} label="5. VFX Frame & Hitbox Sync" color="text-[#3fb950]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-full h-full flex bg-[#050505]">

           {/* MAIN WORKSPACE AREA */}
           <div className="flex-1 relative overflow-hidden flex flex-col border-r border-[#222]">
              {activeTab === 'Graph' && (
                 <div className="w-full h-full relative" style={{ backgroundImage: 'radial-gradient(circle at center, #1a1a1a 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                     <NodeMockup title="Spawn Rate" x={50} y={100} color="border-[#3fb950]">
                         <div className="flex justify-between"><span>Rate:</span><span className="text-white">100,000 / s</span></div>
                     </NodeMockup>
                     <NodeMockup title="GPU Compute Shader" x={250} y={80} color="border-[#58a6ff]">
                         <div className="flex justify-between text-[#58a6ff]"><span>Material:</span><span>Fire_Mat_01</span></div>
                         <div className="flex justify-between mt-1"><span>Blend:</span><span className="text-white">Additive</span></div>
                     </NodeMockup>
                     <NodeMockup title="Vortex Force Area" x={250} y={200} color="border-[#e3b341]">
                         <div className="flex justify-between"><span>Pull:</span><span className="text-white">450.0</span></div>
                         <div className="flex justify-between"><span>Radius:</span><span className="text-white">15m</span></div>
                     </NodeMockup>
                     <NodeMockup title="Output Renderer" x={500} y={140} color="border-[#f85149]">
                         <div className="flex justify-between"><span>Align:</span><span className="text-white">Velocity</span></div>
                     </NodeMockup>
                     
                     {/* Links */}
                     <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
                         <path d="M150 140 C 200 140, 200 110, 250 110" stroke="#3fb950" fill="none" strokeWidth="2" />
                         <path d="M150 140 C 200 140, 200 230, 250 230" stroke="#3fb950" fill="none" strokeWidth="2" />
                         <path d="M350 110 C 420 110, 420 160, 500 160" stroke="#58a6ff" fill="none" strokeWidth="2" />
                         <path d="M350 230 C 420 230, 420 180, 500 180" stroke="#e3b341" fill="none" strokeWidth="2" />
                     </svg>
                 </div>
              )}
              {activeTab === 'Compositor' && (
                 <div className="w-full h-full relative" style={{ backgroundImage: 'radial-gradient(circle at center, #1a1a1a 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                    <div className="absolute top-4 left-4 bg-[#111] p-2 border border-[#333] rounded text-[#888]">Nuke Style Image Compositing Pipeline</div>
                    <NodeMockup title="Read (Beauty Pass)" x={80} y={80} color="border-[#3fb950]"/>
                    <NodeMockup title="Read (Z-Depth)" x={80} y={180} color="border-[#888]"/>
                    <NodeMockup title="ZDefocus" x={250} y={130} color="border-[#e3b341]"/>
                    <NodeMockup title="Glow (Threshold)" x={420} y={130} color="border-[#bc8cff]"/>
                    <NodeMockup title="Write (Final)" x={600} y={130} color="border-[#f85149]"/>
                 </div>
              )}
              {activeTab === 'Chaos' && (
                  <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-b from-[#111] to-[#000]">
                      <div className="absolute top-4 left-4 text-[#f85149] font-bold text-lg tracking-widest uppercase"><AlertTriangle className="inline mr-2"/> Chaos Destruction Physics Viewer</div>
                      {/* Simulating a fractured mesh */}
                      <div className="w-[300px] h-[300px] relative animate-pulse" style={{ perspective: '1000px' }}>
                          <div className="absolute inset-0 border-2 border-[#f85149] rotate-12 -skew-x-12 opacity-50 bg-[#f85149]/10"></div>
                          <div className="absolute inset-4 border border-[#e3b341] -rotate-6 skew-y-6 opacity-70 bg-[#e3b341]/10"></div>
                          <div className="absolute inset-8 border border-[#58a6ff] rotate-45 opacity-40 bg-[#58a6ff]/10"></div>
                          {isPlaying && <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white] -translate-x-1/2 -translate-y-1/2 animate-[ping_1s_infinite]"></div>}
                      </div>
                  </div>
              )}
              {activeTab === 'Hitbox' && (
                  <div className="w-full h-full flex flex-col pt-10 px-10">
                      <div className="h-[200px] bg-[#111] border border-[#222] mb-4 flex items-end relative overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=800&auto=format&fit=crop" className="opacity-20 absolute inset-0 w-full h-full object-cover" alt="bg"/>
                          <div className="absolute top-1/2 left-1/2 w-[100px] h-[100px] border-2 border-[#f85149] bg-[#f85149]/20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                              <span className="bg-[#f85149] text-white px-1 text-[8px] font-bold absolute -top-4">Active Hitbox (Frame 12-45)</span>
                          </div>
                      </div>
                      <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded p-2">
                          <div className="text-[#888] font-bold mb-2">Timeline Frame Editor</div>
                          <div className="flex bg-[#000] h-8 relative w-full border border-[#444] items-center">
                              <div className="absolute left-[30%] w-[40%] h-full bg-[#f85149]/40 border-x border-[#f85149] flex items-center justify-center text-[#f85149] text-[9px] font-bold">DAMAGE FRAMES</div>
                              {isPlaying && <div className="absolute left-[35%] w-0.5 h-full bg-white z-10 shadow-[0_0_5px_white]"></div>}
                          </div>
                      </div>
                  </div>
              )}
              {activeTab === 'Emitters' && (
                  <div className="w-full h-full flex items-center justify-center">
                      <div className="w-[100px] h-[100px] rounded-full border border-[#bc8cff] bg-[#bc8cff]/10 relative shadow-[0_0_50px_rgba(188,140,255,0.4)] flex items-center justify-center">
                         <Sparkles size={32} className="text-[#bc8cff] animate-spin"/>
                         <div className="absolute -inset-10 border border-[#58a6ff]/30 rounded-full animate-ping"></div>
                      </div>
                  </div>
              )}
           </div>

           {/* DETAILS PANEL */}
           <div className="w-[300px] bg-[#111] border-l border-[#2d2d2d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-3 space-y-4 z-20">
              <div className="bg-[#1a1a1a] border border-[#333] rounded px-2 py-1 flex justify-between items-center text-[10px]">
                 <span className="font-bold text-white">System:</span>
                 <span className="text-[#e3b341]">P_Explosion_Core_01</span>
              </div>
              
              <div>
                 <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 block">Emitter Properties</label>
                 <Slider label="Spawn Rate" value="Infinite" color="bg-[#58a6ff]" percent="100"/>
                 <Slider label="Life Cycle" value="1.5s" color="bg-[#bc8cff]" percent="30"/>
                 <Slider label="Gravity Mod" value="-0.2" color="bg-[#e3b341]" percent="45"/>
                 <Slider label="Drag / Friction" value="1.2" color="bg-[#f85149]" percent="60"/>
              </div>

              <div className="border-t border-[#333] pt-4">
                 <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 block">Material Override</label>
                 <div className="bg-[#0a0a0a] border border-[#333] p-2 rounded flex justify-between items-center">
                    <span className="text-white text-[10px]">M_Fire_Additive_SubUV</span>
                    <button className="bg-[#333] hover:bg-[#444] px-2 py-0.5 rounded text-white text-[9px]">Edit</button>
                 </div>
              </div>

              <div className="border-t border-[#333] pt-4">
                 <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 block">Performance Budget Tracker</label>
                 <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-[#888]"><span>Draw Calls</span> <span className="text-[#3fb950]">1 / 10</span></div>
                    <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden"><div className="h-full bg-[#3fb950] w-[10%]"></div></div>
                    
                    <div className="flex justify-between text-[9px] text-[#888] mt-2"><span>Fill Rate Capacity</span> <span className="text-[#e3b341]">45%</span></div>
                    <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden"><div className="h-full bg-[#e3b341] w-[45%]"></div></div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

// ------ STYLED COMPONENT HELPERS ------ //

function ModuleTab({ active, onClick, icon, label, color }) {
   return (
      <div 
         onClick={onClick}
         className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer border-t-[2px] transition-colors
         ${active ? `bg-[#111] text-white ${color.replace('text-', 'border-')}` : 'border-transparent text-[#888] hover:bg-[#1a1a1a] hover:text-[#ccc]'}`}
      >
         <span className={active ? color : 'opacity-70'}>{icon}</span> {label}
      </div>
   );
}

function Slider({ label, value, color, percent }) {
   return (
      <div className="flex flex-col gap-1 mb-3">
         <div className="flex justify-between items-end">
            <span className="text-[#888] text-[9px] uppercase font-bold tracking-wider">{label}</span>
            <span className="text-white text-[10px] font-mono">{value}</span>
         </div>
         <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden border border-[#333] flex items-center group cursor-pointer">
            <div className={`h-full ${color} w-[${percent}%] relative shadow-[0_0_10px_currentColor]`}></div>
         </div>
      </div>
   );
}

function NodeMockup({ title, color, x, y, children }) {
    return (
        <div className={`absolute w-[140px] bg-[#111] border-t-2 ${color} border-l border-r border-b border-[#333] rounded shadow-xl z-20`} style={{ left: x, top: y }}>
            <div className="bg-[#1a1a1a] px-2 py-1 text-[10px] font-bold text-white border-b border-[#333] rounded-t flex justify-between items-center">
                {title} <Settings2 size={10} className="text-[#666]"/>
            </div>
            <div className="p-2 flex flex-col gap-1 text-[9px] text-[#888] bg-[#0a0a0a]">
                {children || <span className="italic opacity-50">Passthrough</span>}
            </div>
        </div>
    );
}
