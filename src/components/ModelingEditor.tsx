import React, { useState } from 'react';
import { 
  BoxSelect, MousePointer2, Move3D, Rotate3D, Scale3D, PenTool, Minimize2, Pen, 
  Wind, Triangle, Hexagon, Component, Scissors, DownloadCloud, BrainCircuit, Play, Layers, Eye, Plus, Cpu, Sliders, Server, HardDrive, Database, Settings2, Trash2, Maximize, Orbit, Focus,
  Cpu as CpuIcon, Grid, Ruler, Magnet, Type, Image as ImageIcon, Crosshair, Brush, Palette, Anchor, Lock, ChevronRight, ChevronDown, Activity
} from 'lucide-react';

export default function ModelingEditor() {
  const [activeTab, setActiveTab] = useState<'Blender'|'ZBrush'|'Rigging'|'CAD'|'AI'>('Blender');
  const [rightPanelTab, setRightPanelTab] = useState<'modifiers'|'materials'|'uv_bake'|'lod'>('modifiers');
  const [expandedOutliner, setExpandedOutliner] = useState(true);
  
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#8b949e] font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e3b341]/5 to-transparent pointer-events-none"></div>
        <BoxSelect size={28} className="text-[#e3b341] mr-4" />
        <div className="flex flex-col z-10">
          <h2 className="text-[#c9d1d9] text-[16px] font-bold tracking-tight">Apex 3D Studio & AI Forge</h2>
          <p className="text-[#8b949e] text-[11px]">Professional modeling, UV/Baking, sculpting, Control Rig (MoCap), and Local offline AI-to-3D.</p>
        </div>
      </div>

      <div className="flex h-10 border-b border-[#30363d] bg-[#161b22] px-2 items-center gap-1 overflow-x-auto hide-scrollbar shrink-0">
        <button onClick={() => setActiveTab('Blender')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-colors whitespace-nowrap ${activeTab === 'Blender' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'hover:bg-[#21262d] text-[#c9d1d9]'}`}>Polygon (Vertex/UV)</button>
        <button onClick={() => setActiveTab('ZBrush')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-colors whitespace-nowrap ${activeTab === 'ZBrush' ? 'bg-[#f85149]/20 text-[#f85149]' : 'hover:bg-[#21262d] text-[#c9d1d9]'}`}>Sculpting (ZBrush)</button>
        <button onClick={() => setActiveTab('Rigging')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-colors whitespace-nowrap ${activeTab === 'Rigging' ? 'bg-[#e3b341]/20 text-[#e3b341]' : 'hover:bg-[#21262d] text-[#c9d1d9]'}`}>Control Rig (MoCap)</button>
        <button onClick={() => setActiveTab('CAD')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-colors whitespace-nowrap ${activeTab === 'CAD' ? 'bg-[#3fb950]/20 text-[#3fb950]' : 'hover:bg-[#21262d] text-[#c9d1d9]'}`}>Parametric CAD</button>
        <button onClick={() => setActiveTab('AI')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-colors whitespace-nowrap ${activeTab === 'AI' ? 'bg-[#bc8cff]/20 text-[#bc8cff]' : 'hover:bg-[#21262d] text-[#c9d1d9]'}`}>Local AI 3D</button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Toolbar */}
        <div className="w-[50px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar items-center py-2 gap-2 z-10">
          {activeTab === 'Blender' && (
             <>
                <button className="p-2 text-[#58a6ff] bg-[#21262d] rounded-lg shadow-[0_0_10px_rgba(88,166,255,0.2)]" title="Select Vertex/Edge/Face (Q)"><MousePointer2 size={16} /></button>
                <div className="w-8 h-[1px] bg-[#30363d] my-1"></div>
                <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] rounded-lg" title="Move (W)"><Move3D size={16} /></button>
                <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] rounded-lg" title="Rotate (E)"><Rotate3D size={16} /></button>
                <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] rounded-lg" title="Scale (R)"><Scale3D size={16} /></button>
                <div className="w-8 h-[1px] bg-[#30363d] my-1"></div>
                <button className="p-2 text-[#3fb950] hover:bg-[#21262d] rounded-lg" title="Extrude Target (E)"><Component size={16} /></button>
                <button className="p-2 text-[#3fb950] hover:bg-[#21262d] rounded-lg" title="Inset (I)"><SquareIcon size={16} /></button>
                <button className="p-2 text-[#3fb950] hover:bg-[#21262d] rounded-lg" title="Bevel (Ctrl+B)"><Hexagon size={16} /></button>
                <button className="p-2 text-[#3fb950] hover:bg-[#21262d] rounded-lg" title="Loop Cut (Ctrl+R)"><Scissors size={16} /></button>
                <div className="w-8 h-[1px] bg-[#30363d] my-1"></div>
                <button className="p-2 text-[#e3b341] hover:bg-[#21262d] rounded-lg" title="UV Unwrapping Mode"><Grid size={16} /></button>
                <button className="p-2 text-[#e3b341] hover:bg-[#21262d] rounded-lg" title="Material Baking (Normals/AO)"><Database size={16} /></button>
             </>
          )}
          {activeTab === 'Rigging' && (
             <>
                <button className="p-2 text-[#e3b341] bg-[#21262d] rounded-lg shadow-[0_0_10px_rgba(227,179,65,0.2)]" title="Add Bone Array"><Component size={16} /></button>
                <button className="p-2 text-[#58a6ff] hover:bg-[#21262d] rounded-lg" title="Translate Kinematic"><Move3D size={16} /></button>
                <button className="p-2 text-[#58a6ff] hover:bg-[#21262d] rounded-lg" title="Rotate Joint"><Rotate3D size={16} /></button>
                <div className="w-8 h-[1px] bg-[#30363d] my-1"></div>
                <button className="p-2 text-[#f85149] hover:bg-[#21262d] rounded-lg" title="Weight Paint"><Brush size={16} /></button>
                <button className="p-2 text-[#bc8cff] hover:bg-[#21262d] rounded-lg" title="IK Setup"><Anchor size={16} /></button>
                <button className="p-2 text-[#3fb950] hover:bg-[#21262d] rounded-lg mt-auto mb-2" title="Send to Sequencer"><Activity size={16} /></button>
             </>
          )}
          {activeTab === 'ZBrush' && (
             <>
                <button className="p-2 text-[#f85149] bg-[#21262d] rounded-lg shadow-[0_0_10px_rgba(248,81,73,0.2)]" title="Standard Brush"><PenTool size={16} /></button>
                <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] rounded-lg" title="Smooth Brush"><Wind size={16} /></button>
                <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] rounded-lg" title="Pinch Brush"><Minimize2 size={16} /></button>
                <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] rounded-lg" title="Clay Buildup"><Layers size={16} /></button>
                <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] rounded-lg" title="DamStandard"><Pen size={16} /></button>
                <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] rounded-lg" title="Trim Dynamic"><Scissors size={16} /></button>
                <div className="w-8 h-[1px] bg-[#30363d] my-1"></div>
                <button className="p-2 text-[#e3b341] hover:bg-[#21262d] rounded-lg" title="Polypaint"><Palette size={16} /></button>
                <button className="p-2 text-[#e3b341] hover:bg-[#21262d] rounded-lg" title="Masking"><Brush size={16} /></button>
             </>
          )}
          {activeTab === 'CAD' && (
             <>
                <button className="p-2 text-[#3fb950] bg-[#21262d] rounded-lg shadow-[0_0_10px_rgba(63,185,80,0.2)]" title="Sketch Line"><Pen size={16} /></button>
                <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] rounded-lg" title="Sketch Rectangle"><BoxSelect size={16} /></button>
                <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] rounded-lg" title="Sketch Circle"><Orbit size={16} /></button>
                <div className="w-8 h-[1px] bg-[#30363d] my-1"></div>
                <button className="p-2 text-[#58a6ff] hover:bg-[#21262d] rounded-lg" title="Extrude Profile"><Move3D size={16} /></button>
                <button className="p-2 text-[#58a6ff] hover:bg-[#21262d] rounded-lg" title="Revolve"><Rotate3D size={16} /></button>
                <button className="p-2 text-[#58a6ff] hover:bg-[#21262d] rounded-lg" title="Sweep"><Hexagon size={16} /></button>
                <div className="w-8 h-[1px] bg-[#30363d] my-1"></div>
                <button className="p-2 text-[#e3b341] hover:bg-[#21262d] rounded-lg" title="Dimension (Parametric)"><Ruler size={16} /></button>
                <button className="p-2 text-[#e3b341] hover:bg-[#21262d] rounded-lg" title="Constraints"><Anchor size={16} /></button>
             </>
          )}
          {activeTab === 'AI' && (
             <>
                <button className="p-2 text-[#bc8cff] bg-[#21262d] rounded-lg shadow-[0_0_10px_rgba(188,140,255,0.2)]" title="Prompt to 3D"><BrainCircuit size={16} /></button>
                <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] rounded-lg" title="Image to 3D"><ImageIcon size={16} /></button>
                <button className="p-2 text-[#c9d1d9] hover:bg-[#21262d] rounded-lg" title="PBR Texture Gen"><Palette size={16} /></button>
                <div className="w-8 h-[1px] bg-[#30363d] my-1"></div>
                <button className="p-2 text-[#e3b341] hover:bg-[#21262d] rounded-lg" title="Local Model Manager"><HardDrive size={16} /></button>
             </>
          )}
        </div>

        {/* Viewport */}
        <div className="flex-1 relative bg-[#050505] flex flex-col group">
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(#58a6ff 1px, transparent 1px), linear-gradient(90deg, #58a6ff 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) scale(2)', transformOrigin: 'center 80%' }}></div>
            {/* Center Axis */}
            <div className="absolute w-[2px] h-[50%] bg-[#3fb950] blur-[1px] top-1/4"></div>
            <div className="absolute w-[50%] h-[2px] bg-[#f85149] blur-[1px] left-1/4"></div>
            
            {/* Wireframe Placeholder */}
            {activeTab === 'Blender' && (
               <div className="w-48 h-48 border border-[#58a6ff] absolute shadow-[0_0_20px_rgba(88,166,255,0.2)] flex items-center justify-center" style={{ transform: 'rotateX(60deg) rotateZ(45deg)'}}>
                  <div className="w-full h-full border border-[#58a6ff]/50 absolute rotate-45"></div>
                  <div className="w-full h-full border border-[#58a6ff]/50 absolute -rotate-45"></div>
               </div>
            )}
            {activeTab === 'ZBrush' && (
                <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-[#310c0c] to-[#9e2c2c] shadow-[inset_0_0_50px_rgba(0,0,0,0.8),_0_0_30px_rgba(248,81,73,0.1)] absolute blur-[0.5px]">
                   <div className="w-full h-full rounded-full mix-blend-overlay opacity-30 bg-[url('https://transparenttextures.com/patterns/black-scales.png')]"></div>
                </div>
            )}
            {activeTab === 'CAD' && (
               <div className="flex absolute items-center justify-center">
                  <svg width="400" height="400" viewBox="0 0 400 400" className="opacity-50">
                     <path d="M50 200 L150 100 L350 100 L250 200 Z" fill="rgba(88,166,255,0.1)" stroke="#58a6ff" strokeWidth="2"/>
                     <path d="M50 200 L50 300 L250 300 L250 200" fill="none" stroke="#58a6ff" strokeWidth="2"/>
                     <path d="M350 100 L350 200 L250 300" fill="none" stroke="#58a6ff" strokeWidth="2"/>
                     {/* Dimensions */}
                     <path d="M150 90 L350 90" stroke="#f85149" strokeWidth="1" />
                     <text x="250" y="85" fill="#f85149" fontSize="10" textAnchor="middle">120.00 mm</text>
                  </svg>
               </div>
            )}
          </div>
          
           <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button className="bg-[#161b22]/80 hover:bg-[#21262d] backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-bold text-[#c9d1d9] flex gap-1 items-center">
               <Eye size={12}/> Perspective
            </button>
            <button className="bg-[#161b22]/80 hover:bg-[#21262d] backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-bold text-[#c9d1d9] flex gap-1 items-center">
               <Layers size={12}/> Solid View
            </button>
            {activeTab === 'Rigging' && (
               <button className="bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/30 px-2 py-1 rounded text-[10px] font-bold flex gap-1 items-center">
                  <Activity size={12}/> Bind Pose (X-Ray)
               </button>
            )}
            {activeTab === 'CAD' && (
               <button className="bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/30 px-2 py-1 rounded text-[10px] font-bold flex gap-1 items-center">
                  <Anchor size={12}/> Fully Constrained
               </button>
            )}
          </div>

          <div className="absolute top-4 right-4 z-10 flex gap-2">
             <button className="p-1.5 bg-[#161b22]/80 backdrop-blur border border-[#30363d] rounded text-[#8b949e] hover:text-white" title="Toggle Grid"><Grid size={12} /></button>
             <button className="p-1.5 bg-[#161b22]/80 backdrop-blur border border-[#30363d] rounded text-[#8b949e] hover:text-white" title="Snapping"><Magnet size={12} /></button>
             <button className="p-1.5 bg-[#161b22]/80 backdrop-blur border border-[#30363d] rounded text-[#8b949e] hover:text-white" title="Focus Selected"><Focus size={12} /></button>
          </div>

          {activeTab === 'AI' && (
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[600px] bg-[#161b22]/90 backdrop-blur border border-[#bc8cff]/30 rounded-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-20">
                <div className="flex items-center gap-2 mb-2">
                   <BrainCircuit size={16} className="text-[#bc8cff]" />
                   <span className="text-[#c9d1d9] font-bold text-[12px]">Offline AI 3D Generator (Tripo/Meshy Engine)</span>
                   <span className="ml-auto bg-[#3fb950]/10 text-[#3fb950] text-[9px] px-2 py-0.5 rounded border border-[#3fb950]/30 flex items-center gap-1">
                      <CpuIcon size={10} /> Local Tensor Cores Active
                   </span>
                </div>
                <textarea className="w-full h-24 bg-[#0a0a0a] border border-[#30363d] rounded-lg p-3 text-[11px] text-white resize-none focus:border-[#bc8cff] outline-none mb-3" placeholder="Describe the 3D model with extreme detail. e.g., 'A hyper-realistic steampunk jetpack with brass fittings, leather straps, glowing blue plasma tubes, 4k PBR textures...'"></textarea>
                <div className="flex justify-between items-center">
                   <div className="flex gap-4 text-[10px] font-bold">
                      <label className="flex items-center gap-1 text-[#8b949e]"><input type="checkbox" defaultChecked className="accent-[#bc8cff]" /> Auto-Retopology (Quad)</label>
                      <label className="flex items-center gap-1 text-[#8b949e]"><input type="checkbox" defaultChecked className="accent-[#bc8cff]" /> Bake PBR Materials</label>
                      <label className="flex items-center gap-1 text-[#8b949e]"><input type="checkbox" defaultChecked className="accent-[#bc8cff]" /> Auto-Rig (Humanoid)</label>
                   </div>
                   <button className="bg-[#bc8cff] hover:bg-[#d2a8ff] text-[#0a0a0a] font-bold px-4 py-1.5 rounded flex items-center gap-2 transition-colors text-[11px]">
                      <SparklesIcon size={14} /> Generate High-Poly Model
                   </button>
                </div>
             </div>
          )}

          {/* Timeline for CAD/Animation at bottom */}
          {activeTab === 'CAD' && (
             <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#161b22] border-t border-[#30363d] flex flex-col">
                <div className="h-6 bg-[#21262d] border-b border-[#30363d] flex items-center px-4 text-[9px] font-bold text-[#8b949e] uppercase">Design History (Parametric Timeline)</div>
                <div className="flex-1 flex items-center px-4 gap-1 overflow-x-auto custom-scrollbar">
                   <div className="w-8 h-6 bg-[#30363d] rounded border border-[#8b949e] flex items-center justify-center shrink-0" title="Sketch 1"><Pen size={10} className="text-white"/></div>
                   <div className="w-4 h-[2px] bg-[#30363d]"></div>
                   <div className="w-8 h-6 bg-[#58a6ff]/20 rounded border border-[#58a6ff] flex items-center justify-center shrink-0" title="Extrude 1"><Move3D size={10} className="text-[#58a6ff]"/></div>
                   <div className="w-4 h-[2px] bg-[#30363d]"></div>
                   <div className="w-8 h-6 bg-[#30363d] rounded border border-[#8b949e] flex items-center justify-center shrink-0" title="Sketch 2"><Pen size={10} className="text-white"/></div>
                   <div className="w-4 h-[2px] bg-[#30363d]"></div>
                   <div className="w-8 h-6 bg-[#f85149]/20 rounded border border-[#f85149] flex items-center justify-center shrink-0" title="Cut Extrude"><Scissors size={10} className="text-[#f85149]"/></div>
                   <div className="w-4 h-[2px] bg-[#30363d]"></div>
                   <div className="h-full w-[2px] bg-[#c9d1d9] relative mx-1">
                      <div className="absolute -top-1 -left-1 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-transparent border-t-[#c9d1d9]"></div>
                   </div>
                   <div className="w-4 h-[2px] bg-[#30363d]/50"></div>
                </div>
             </div>
          )}

        </div>

        {/* Right Panel: Properties */}
        <div className="w-[320px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 z-10">
          <div className="h-10 border-b border-[#30363d] flex items-center px-2 justify-between bg-[#21262d]">
             <div className="flex gap-1 h-full pt-2">
                <button 
                  onClick={() => setRightPanelTab('modifiers')} 
                  className={`px-3 py-1 rounded-t border-t border-x border-transparent text-[10px] font-bold uppercase transition-colors ${rightPanelTab === 'modifiers' ? 'bg-[#161b22] border-[#30363d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
                >Modifiers</button>
                <button 
                  onClick={() => setRightPanelTab('materials')} 
                  className={`px-3 py-1 rounded-t border-t border-x border-transparent text-[10px] font-bold uppercase transition-colors ${rightPanelTab === 'materials' ? 'bg-[#161b22] border-[#30363d] text-white' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
                >Materials</button>
                <button 
                  onClick={() => setRightPanelTab('uv_bake')} 
                  className={`px-3 py-1 rounded-t border-t border-x border-transparent text-[10px] font-bold uppercase transition-colors ${rightPanelTab === 'uv_bake' ? 'bg-[#161b22] border-[#30363d] text-[#e3b341]' : 'text-[#8b949e] hover:text-[#e3b341]'}`}
                >UV/Bake</button>
                <button 
                  onClick={() => setRightPanelTab('lod')} 
                  className={`px-3 py-1 rounded-t border-t border-x border-transparent text-[10px] font-bold uppercase transition-colors ${rightPanelTab === 'lod' ? 'bg-[#161b22] border-[#30363d] text-[#bc8cff]' : 'text-[#8b949e] hover:text-[#bc8cff]'}`}
                >Auto-LOD</button>
             </div>
          </div>
          
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
             {/* Transform (Fixed at top) */}
             <div className="p-3 border-b border-[#30363d] space-y-2 shrink-0">
                <div className="text-[10px] font-bold text-[#8b949e] uppercase flex items-center gap-1"><Move3D size={12}/> Transform</div>
                <div className="flex flex-col gap-1">
                   <div className="flex items-center text-[10px]">
                      <span className="w-12 text-[#8b949e]">Location</span>
                      <div className="flex-1 flex border border-[#30363d] rounded overflow-hidden">
                         <div className="flex-1 flex items-center bg-[#0a0a0a] px-1 border-r border-[#30363d]"><span className="text-[#f85149] font-bold mr-1">X</span><input type="text" defaultValue="0.00m" className="w-full bg-transparent outline-none text-white font-mono"/></div>
                         <div className="flex-1 flex items-center bg-[#0a0a0a] px-1 border-r border-[#30363d]"><span className="text-[#3fb950] font-bold mr-1">Y</span><input type="text" defaultValue="2.45m" className="w-full bg-transparent outline-none text-white font-mono"/></div>
                         <div className="flex-1 flex items-center bg-[#0a0a0a] px-1"><span className="text-[#58a6ff] font-bold mr-1">Z</span><input type="text" defaultValue="-1.00m" className="w-full bg-transparent outline-none text-white font-mono"/></div>
                      </div>
                   </div>
                   <div className="flex items-center text-[10px]">
                      <span className="w-12 text-[#8b949e]">Rotation</span>
                      <div className="flex-1 flex border border-[#30363d] rounded overflow-hidden">
                         <div className="flex-1 flex items-center bg-[#0a0a0a] px-1 border-r border-[#30363d]"><span className="text-[#f85149] font-bold mr-1">X</span><input type="text" defaultValue="45°" className="w-full bg-transparent outline-none text-white font-mono"/></div>
                         <div className="flex-1 flex items-center bg-[#0a0a0a] px-1 border-r border-[#30363d]"><span className="text-[#3fb950] font-bold mr-1">Y</span><input type="text" defaultValue="0°" className="w-full bg-transparent outline-none text-white font-mono"/></div>
                         <div className="flex-1 flex items-center bg-[#0a0a0a] px-1"><span className="text-[#58a6ff] font-bold mr-1">Z</span><input type="text" defaultValue="0°" className="w-full bg-transparent outline-none text-white font-mono"/></div>
                      </div>
                   </div>
                   <div className="flex items-center text-[10px]">
                      <span className="w-12 text-[#8b949e]">Scale</span>
                      <div className="flex-1 flex border border-[#30363d] rounded overflow-hidden">
                         <div className="flex-1 flex items-center bg-[#0a0a0a] px-1 border-r border-[#30363d]"><span className="text-[#f85149] font-bold mr-1">X</span><input type="text" defaultValue="1.00" className="w-full bg-transparent outline-none text-white font-mono"/></div>
                         <div className="flex-1 flex items-center bg-[#0a0a0a] px-1 border-r border-[#30363d]"><span className="text-[#3fb950] font-bold mr-1">Y</span><input type="text" defaultValue="1.00" className="w-full bg-transparent outline-none text-white font-mono"/></div>
                         <div className="flex-1 flex items-center bg-[#0a0a0a] px-1"><span className="text-[#58a6ff] font-bold mr-1">Z</span><input type="text" defaultValue="1.00" className="w-full bg-transparent outline-none text-white font-mono"/></div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Tab Content */}
             <div className="flex-1 p-3">
                {rightPanelTab === 'lod' && (
                   <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center px-1">
                         <span className="text-[12px] font-bold text-white flex items-center gap-2"><Layers size={14} className="text-[#bc8cff]"/> Auto-LOD Generator</span>
                         <div className="bg-[#bc8cff]/20 text-[#bc8cff] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border border-[#bc8cff]/30">VRAM Optimized</div>
                      </div>
                      
                      <p className="text-[10px] leading-relaxed text-[#c9d1d9] px-1 border-b border-[#30363d] pb-3 mb-1">
                         Intelligently decimates geometry based on camera distance and polygon density limits. Hand-optimized algorithmic clustering — No AI overhead. Ideal for 1000+ actor scenes.
                      </p>

                      {/* LOD 0 */}
                      <div className="bg-[#161b22] border border-[#58a6ff]/50 rounded overflow-hidden shadow-[0_0_10px_rgba(88,166,255,0.1)]">
                         <div className="bg-[#58a6ff]/10 px-2 py-1.5 flex justify-between items-center border-b border-[#58a6ff]/30">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">LOD 0 (Base)</div>
                            <div className="text-[10px] font-mono text-[#58a6ff]">14,284 Tris</div>
                         </div>
                         <div className="p-2 flex flex-col gap-2 text-[10px]">
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Distance</span>
                               <span className="text-white">0m - 15m</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Screen Size (%)</span>
                               <input type="number" defaultValue={50} className="bg-[#0a0a0a] text-white w-14 rounded px-1 text-center outline-none border border-[#30363d]" />
                            </div>
                         </div>
                      </div>

                      {/* LOD 1 */}
                      <div className="bg-[#0a0a0a] border border-[#30363d] rounded overflow-hidden">
                         <div className="bg-[#21262d] px-2 py-1.5 flex justify-between items-center border-b border-[#30363d]">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">LOD 1</div>
                            <div className="text-[10px] font-mono text-[#e3b341]">7,142 Tris (50%)</div>
                         </div>
                         <div className="p-2 flex flex-col gap-2 text-[10px]">
                            <div className="flex items-center gap-2">
                               <span className="w-16 text-[#8b949e]">Reduction</span>
                               <input type="range" className="flex-1 accent-[#bc8cff]" defaultValue={50} />
                               <span className="w-8 text-right text-white">50%</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Screen Size (%)</span>
                               <input type="number" defaultValue={25} className="bg-[#21262d] text-white w-14 rounded px-1 text-center outline-none border border-[#30363d]" />
                            </div>
                         </div>
                      </div>

                      {/* LOD 2 */}
                      <div className="bg-[#0a0a0a] border border-[#30363d] rounded overflow-hidden">
                         <div className="bg-[#21262d] px-2 py-1.5 flex justify-between items-center border-b border-[#30363d]">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">LOD 2</div>
                            <div className="text-[10px] font-mono text-[#f85149]">1,428 Tris (10%)</div>
                         </div>
                         <div className="p-2 flex flex-col gap-2 text-[10px]">
                            <div className="flex items-center gap-2">
                               <span className="w-16 text-[#8b949e]">Reduction</span>
                               <input type="range" className="flex-1 accent-[#bc8cff]" defaultValue={10} />
                               <span className="w-8 text-right text-white">10%</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Screen Size (%)</span>
                               <input type="number" defaultValue={10} className="bg-[#21262d] text-white w-14 rounded px-1 text-center outline-none border border-[#30363d]" />
                            </div>
                         </div>
                      </div>

                      <button className="w-full py-1.5 mt-2 bg-[#21262d] border border border-dashed border-[#bc8cff]/50 rounded text-[11px] font-bold text-[#bc8cff] hover:bg-[#bc8cff]/10 hover:border-[#bc8cff] transition-colors flex justify-center items-center gap-2">
                         <Plus size={12}/> Add LOD Level
                      </button>

                      <div className="mt-4 pt-4 border-t border-[#30363d] flex flex-col gap-2 border-b pb-4">
                        <h4 className="text-[10px] font-bold text-[#8b949e] uppercase mb-1">Algorithmic Clustering</h4>
                        <label className="flex items-center gap-2 text-[10px] text-[#8b949e]"><input type="checkbox" defaultChecked className="accent-[#bc8cff]"/> Preserve Hard Edges (Normals)</label>
                        <label className="flex items-center gap-2 text-[10px] text-[#8b949e]"><input type="checkbox" defaultChecked className="accent-[#bc8cff]"/> Protect UV Boundaries</label>
                        <label className="flex items-center gap-2 text-[10px] text-[#8b949e]"><input type="checkbox" defaultChecked className="accent-[#bc8cff]"/> Symmetric Reduction</label>
                      </div>
                      
                      <button className="w-full py-2 bg-[#bc8cff] text-[#0a0a0a] rounded text-[11px] font-bold hover:bg-[#d2a8ff] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(188,140,255,0.2)]">
                         <Focus size={14}/> Generate LOD Cluster
                      </button>
                   </div>
                )}
                {rightPanelTab === 'modifiers' && (
                   <div className="flex flex-col gap-3">
                      <button className="w-full py-1.5 bg-[#21262d] border border-[#30363d] rounded text-[11px] font-bold text-[#c9d1d9] hover:bg-[#30363d] transition-colors flex items-center justify-center gap-2">
                         <WrenchIcon size={12}/> Add Modifier <ChevronDown size={12}/>
                      </button>

                      {/* Modifier: Subdivision */}
                      <div className="bg-[#0a0a0a] border border-[#30363d] rounded overflow-hidden">
                         <div className="bg-[#21262d] px-2 py-1.5 flex justify-between items-center border-b border-[#30363d]">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                               <Triangle size={12} className="text-[#58a6ff]"/> Subdivision Surface
                            </div>
                            <div className="flex gap-1 text-[#8b949e]">
                               <button className="hover:text-white" title="Show in Viewport"><Eye size={12}/></button>
                               <button className="hover:text-white" title="Apply"><Settings2 size={12}/></button>
                               <button className="hover:text-[#f85149]" title="Remove"><Trash2 size={12}/></button>
                            </div>
                         </div>
                         <div className="p-2 flex flex-col gap-1.5 text-[10px]">
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Levels Viewport</span>
                               <input type="number" defaultValue={2} className="bg-[#21262d] text-white w-14 rounded px-1 text-center outline-none border border-[#30363d]" />
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[#8b949e]">Levels Render</span>
                               <input type="number" defaultValue={3} className="bg-[#21262d] text-white w-14 rounded px-1 text-center outline-none border border-[#30363d]" />
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                               <label className="flex items-center gap-1 text-[#8b949e]"><input type="checkbox" defaultChecked className="accent-[#58a6ff]" /> Optimal Display</label>
                            </div>
                         </div>
                      </div>

                      {/* Modifier: Boolean */}
                      <div className="bg-[#0a0a0a] border border-[#30363d] rounded overflow-hidden">
                         <div className="bg-[#21262d] px-2 py-1.5 flex justify-between items-center border-b border-[#30363d]">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                               <Hexagon size={12} className="text-[#e3b341]"/> Boolean
                            </div>
                            <div className="flex gap-1 text-[#8b949e]">
                               <button className="hover:text-white" title="Show in Viewport"><Eye size={12}/></button>
                               <button className="hover:text-white" title="Apply"><Settings2 size={12}/></button>
                               <button className="hover:text-[#f85149]" title="Remove"><Trash2 size={12}/></button>
                            </div>
                         </div>
                         <div className="p-2 flex flex-col gap-2 text-[10px]">
                            <div className="flex rounded border border-[#30363d] overflow-hidden">
                               <button className="flex-1 bg-[#30363d] text-white py-1">Difference</button>
                               <button className="flex-1 bg-[#161b22] text-[#8b949e] py-1 border-x border-[#30363d]">Union</button>
                               <button className="flex-1 bg-[#161b22] text-[#8b949e] py-1">Intersect</button>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                               <span className="text-[#8b949e]">Object</span>
                               <div className="flex-1 flex border border-[#30363d] rounded overflow-hidden">
                                 <input type="text" readOnly value="Cube.002" className="flex-1 bg-[#21262d] text-[#c9d1d9] outline-none px-2 py-1" />
                                 <button className="px-2 bg-[#161b22] border-l border-[#30363d] text-[#8b949e] hover:text-white"><Crosshair size={12}/></button>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                )}
                
                {rightPanelTab === 'uv_bake' && (
                   <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center px-1 border-b border-[#30363d] pb-2">
                         <span className="text-[12px] font-bold text-white flex items-center gap-2"><Grid size={14} className="text-[#e3b341]"/> Texture Bake & UV</span>
                      </div>
                      
                      <div className="bg-[#161b22] border border-[#30363d] rounded p-2">
                         <h4 className="text-[10px] font-bold text-[#c9d1d9] mb-2 uppercase">Global UV Projection</h4>
                         <div className="grid grid-cols-2 gap-2 mb-2">
                            <button className="bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] py-1 rounded text-[10px] border border-[#30363d] font-bold">Smart UV Project</button>
                            <button className="bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] py-1 rounded text-[10px] border border-[#30363d] font-bold">Lightmap Pack</button>
                         </div>
                         <div className="flex justify-between items-center text-[10px]">
                            <span className="text-[#8b949e]">Island Margin</span>
                            <input type="number" defaultValue={0.02} className="bg-[#0a0a0a] border border-[#30363d] rounded w-16 px-1 text-white text-right outline-none" />
                         </div>
                      </div>

                      <div className="bg-[#0a0a0a] border border-[#30363d] rounded overflow-hidden">
                         <div className="bg-[#21262d] border-b border-[#30363d] px-2 py-1.5 flex items-center gap-2">
                            <Database size={14} className="text-[#e3b341]"/>
                            <span className="text-[11px] font-bold text-white">Renderer Baking</span>
                         </div>
                         <div className="flex flex-col gap-2 p-2">
                            <div className="flex justify-between items-center text-[10px]">
                               <span className="text-[#8b949e]">Bake Type</span>
                               <select className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] px-1 py-0.5 rounded outline-none">
                                  <option>Normal (Tangent)</option>
                                  <option>Ambient Occlusion</option>
                                  <option>Combined/Diffuse</option>
                                  <option>Curvature</option>
                               </select>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                               <span className="text-[#8b949e]">Resolution</span>
                               <select className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] px-1 py-0.5 rounded outline-none">
                                  <option>2048x2048</option>
                                  <option>4096x4096</option>
                                  <option>8192x8192</option>
                               </select>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] mt-1">
                               <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                               <span className="text-[#8b949e]">Selected to Active (High to Low Poly)</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                               <span className="text-[#8b949e] pl-4">Extrusion</span>
                               <input type="number" defaultValue={0.05} step={0.01} className="bg-[#0a0a0a] border border-[#30363d] rounded w-16 px-1 text-white text-right outline-none" />
                            </div>
                         </div>
                      </div>

                      <button className="w-full py-2 bg-[#e3b341] text-[#0a0a0a] rounded text-[11px] font-bold hover:bg-[#f3cc61] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(227,179,65,0.2)] mt-2">
                         <Play size={14}/> Bake Maps
                      </button>
                   </div>
                )}
                {rightPanelTab === 'materials' && (
                   <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                         <button className="w-8 h-8 rounded bg-[#f85149] border-2 border-white shadow-[0_0_0_1px_#30363d]"></button>
                         <button className="w-8 h-8 rounded bg-[#58a6ff] border border-[#30363d] opacity-50 hover:opacity-100"></button>
                         <button className="w-8 h-8 rounded bg-[#161b22] border border-dashed border-[#58a6ff] text-[#58a6ff] flex items-center justify-center hover:bg-[#58a6ff]/10"><Plus size={14}/></button>
                      </div>

                      <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-2 flex flex-col gap-2 text-[10px]">
                         <div className="flex justify-between items-center">
                            <span className="text-white font-bold">Metallic Paint Red</span>
                            <button className="text-[#bc8cff] flex items-center gap-1 hover:underline"><BrainCircuit size={10}/> AI Material</button>
                         </div>
                         <div className="w-full h-[1px] bg-[#30363d]"></div>
                         
                         <div className="flex items-center gap-2">
                            <span className="w-20 text-[#8b949e]">Base Color</span>
                            <div className="w-12 h-6 rounded bg-[#f85149] border border-[#30363d]"></div>
                            <div className="w-4 h-4 rounded-full border border-dashed border-[#8b949e] ml-auto"></div>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="w-20 text-[#8b949e]">Metallic</span>
                            <input type="range" className="flex-1 h-1 bg-[#333] accent-[#58a6ff]" defaultValue={80} />
                            <span className="w-6 text-right text-white">0.8</span>
                            <div className="w-4 h-4 rounded-full border border-dashed border-[#8b949e]"></div>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="w-20 text-[#8b949e]">Roughness</span>
                            <input type="range" className="flex-1 h-1 bg-[#333] accent-[#58a6ff]" defaultValue={20} />
                            <span className="w-6 text-right text-white">0.2</span>
                            <div className="w-4 h-4 rounded-full border border-dashed border-[#8b949e]"></div>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="w-20 text-[#8b949e]">Normal Map</span>
                            <div className="flex-1 flex gap-1 items-center bg-[#161b22] border border-[#30363d] p-1 rounded text-[#58a6ff] cursor-pointer">
                               <ImageIcon size={10}/> <span className="truncate">scratch_nm.png</span>
                            </div>
                            <span className="w-6 text-right text-white">1.0</span>
                         </div>
                         <button className="w-full mt-2 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-[10px] text-[#8b949e] hover:text-white hover:bg-[#30363d] flex justify-center items-center gap-1">
                            <Component size={12}/> Open Node Editor
                         </button>
                      </div>
                   </div>
                )}
             </div>

             {/* Outliner (Hierarchy) fixed at bottom half */}
             <div className="h-[200px] bg-[#0a0a0a] border-t border-[#30363d] flex flex-col shrink-0 overflow-hidden">
                <div onClick={() => setExpandedOutliner(!expandedOutliner)} className="bg-[#21262d] px-3 py-1.5 border-b border-[#30363d] flex justify-between items-center cursor-pointer">
                   <span className="text-[11px] font-bold text-[#c9d1d9] flex items-center gap-1"><Layers size={14}/> Scene Outliner</span>
                   {expandedOutliner ? <ChevronDown size={14} className="text-[#8b949e]" /> : <ChevronRight size={14} className="text-[#8b949e]" />}
                </div>
                {expandedOutliner && (
                   <div className="p-2 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
                      <div className="flex justify-between items-center bg-[#161b22] p-1 rounded group">
                         <div className="flex items-center gap-1.5 text-[11px] text-[#c9d1d9]"><BoxSelect size={12} className="text-[#e3b341]" /> Scene_Root</div>
                         <div className="flex gap-2 text-[#8b949e] opacity-0 group-hover:opacity-100"><Eye size={12} className="hover:text-white"/><Lock size={12} className="hover:text-white"/></div>
                      </div>
                      <div className="flex flex-col pl-4">
                         <div className="flex justify-between items-center bg-[#21262d] p-1 rounded border border-[#58a6ff]/30 group">
                            <div className="flex items-center gap-1.5 text-[11px] text-[#58a6ff] font-bold"><Triangle size={12} /> ExoSuit_Body <span className="bg-[#f85149] w-2 h-2 rounded-full inline-block ml-1"></span></div>
                            <div className="flex gap-2 text-[#8b949e]"><Eye size={12} className="text-white hover:text-white"/><Lock size={12} className="hover:text-white"/></div>
                         </div>
                         <div className="flex justify-between items-center p-1 rounded group pl-4 hover:bg-[#161b22]">
                            <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]"><Triangle size={12} /> Left_Arm</div>
                            <div className="flex gap-2 text-[#8b949e] opacity-0 group-hover:opacity-100"><Eye size={12}/><Lock size={12}/></div>
                         </div>
                         <div className="flex justify-between items-center p-1 rounded group pl-4 hover:bg-[#161b22]">
                            <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]"><Triangle size={12} /> Right_Arm</div>
                            <div className="flex gap-2 text-[#8b949e] opacity-0 group-hover:opacity-100"><Eye size={12}/><Lock size={12}/></div>
                         </div>
                      </div>
                      <div className="flex justify-between items-center p-1 rounded group hover:bg-[#161b22]">
                         <div className="flex items-center gap-1.5 text-[11px] text-[#c9d1d9]"><Orbit size={12} className="text-[#3fb950]"/> DirectionalLight</div>
                         <div className="flex gap-2 text-[#8b949e]"><Eye size={12} className="text-white"/><Lock size={12}/></div>
                      </div>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SquareIcon({ size, className }: { size?: number, className?: string }) { 
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>; 
}
function WrenchIcon({ size, className }: { size?: number, className?: string }) { return <Settings2 size={size} className={className} />; }
function SparklesIcon({ size, className }: { size?: number, className?: string }) { 
   return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>; 
}
