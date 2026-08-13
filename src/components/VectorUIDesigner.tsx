import React, { useState } from 'react';
import { LayoutDashboard, MousePointer2, Type, Image as ImageIcon, Square, Circle, PenTool, Layout, AlignLeft, AlignCenter, AlignRight, Play, Maximize, Save, Share2, Eye, Lock, Unlock, Settings, ChevronDown, Move } from 'lucide-react';

export default function VectorUIDesigner() {
  const [activeTool, setActiveTool] = useState('select');

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Top Header */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#3fb950]/20 border border-[#3fb950]/50 rounded">
            <LayoutDashboard className="text-[#3fb950]" size={16} />
          </div>
          <div>
            <h1 className="font-bold text-sm">Vector UI Designer</h1>
            <p className="text-[10px] text-[#8b949e]">HUD, Menus & Screen Prototyping</p>
          </div>
        </div>

        {/* Tools */}
        <div className="flex bg-[#010409] border border-[#30363d] rounded p-0.5 gap-0.5 shadow-inner">
           <ToolBtn icon={<MousePointer2 size={14} />} active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
           <ToolBtn icon={<Square size={14} />} active={activeTool === 'rect'} onClick={() => setActiveTool('rect')} />
           <ToolBtn icon={<Circle size={14} />} active={activeTool === 'circle'} onClick={() => setActiveTool('circle')} />
           <ToolBtn icon={<Type size={14} />} active={activeTool === 'text'} onClick={() => setActiveTool('text')} />
           <ToolBtn icon={<PenTool size={14} />} active={activeTool === 'pen'} onClick={() => setActiveTool('pen')} />
           <ToolBtn icon={<ImageIcon size={14} />} active={activeTool === 'image'} onClick={() => setActiveTool('image')} />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center text-xs text-[#8b949e] mr-4">
             <span className="font-mono">100%</span>
             <ChevronDown size={14} className="ml-1" />
          </div>
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
             <Play size={14} className="text-[#3fb950]" /> Preview HUD
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Layers */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 z-10">
           <div className="p-2 border-b border-[#30363d] font-bold text-xs flex items-center gap-2">
             <LayersIcon size={14} className="text-[#8b949e]" /> LAYERS & HIERARCHY
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <LayerItem icon={<Layout size={12}/>} name="Main Menu Screen" active>
                 <div className="pl-4 mt-1 space-y-1">
                    <LayerItem icon={<Square size={12}/>} name="Background Blur" locked />
                    <LayerItem icon={<LayoutDashboard size={12}/>} name="Navigation Bar">
                       <div className="pl-4 mt-1 space-y-1">
                          <LayerItem icon={<Type size={12}/>} name="Title Text" />
                          <LayerItem icon={<Square size={12}/>} name="Start Button" />
                          <LayerItem icon={<Square size={12}/>} name="Options Button" />
                       </div>
                    </LayerItem>
                    <LayerItem icon={<ImageIcon size={12}/>} name="Hero Character Art" />
                 </div>
              </LayerItem>
              <LayerItem icon={<Layout size={12}/>} name="Inventory HUD" visible={false} />
           </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 bg-[#010409] relative overflow-hidden flex items-center justify-center">
           {/* Grid */}
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#8b949e 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
           
           {/* Canvas Artboard */}
           <div className="relative w-[800px] h-[450px] bg-[#0d1117] border border-[#30363d] shadow-2xl overflow-hidden group">
              {/* Fake UI Composition */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop')] bg-cover opacity-30 blur-sm"></div>
              
              <div className="absolute top-0 left-0 w-64 h-full bg-black/60 backdrop-blur-md border-r border-white/10 p-6 flex flex-col justify-center">
                 <h1 className="text-4xl font-bold italic tracking-tighter mb-8 text-white uppercase" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>Neon<br/><span className="text-[#3fb950]">Drifter</span></h1>
                 
                 <div className="space-y-4">
                    <div className="relative p-3 bg-white text-black font-bold text-sm uppercase tracking-widest cursor-pointer w-48 text-center border-l-4 border-[#3fb950]">
                       Continue Game
                       {/* Selection Box */}
                       <div className="absolute -inset-1 border border-[#3fb950] pointer-events-none z-10 flex justify-between items-center">
                          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-[#3fb950]"></div>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-[#3fb950]"></div>
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-[#3fb950]"></div>
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-[#3fb950]"></div>
                       </div>
                    </div>
                    <div className="p-3 text-white/70 font-bold text-sm uppercase tracking-widest hover:text-white cursor-pointer w-48 text-center transition-colors">
                       New Game
                    </div>
                    <div className="p-3 text-white/70 font-bold text-sm uppercase tracking-widest hover:text-white cursor-pointer w-48 text-center transition-colors">
                       Options
                    </div>
                    <div className="p-3 text-white/70 font-bold text-sm uppercase tracking-widest hover:text-white cursor-pointer w-48 text-center transition-colors">
                       Quit
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-6 right-6 text-xs font-mono text-white/50">
                 v1.0.4.build_92
              </div>
           </div>

           {/* Canvas Controls */}
           <div className="absolute bottom-4 flex bg-[#161b22] border border-[#30363d] rounded p-1 shadow-lg gap-2 text-[#8b949e]">
              <button className="px-2 py-1 text-xs hover:text-white font-mono">1920x1080 (16:9)</button>
              <div className="w-[1px] h-4 bg-[#30363d] my-auto"></div>
              <button className="px-2 py-1 text-xs hover:text-white"><Move size={14}/></button>
           </div>
        </div>

        {/* Right: Inspector */}
        <div className="w-72 border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 border-b border-[#30363d] font-bold text-xs flex items-center gap-2">
             <Settings size={14} className="text-[#8b949e]" /> PROPERTIES
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* Alignment */}
              <div>
                 <div className="flex gap-2 mb-4">
                    <AlignBtn icon={<AlignLeft size={14}/>} />
                    <AlignBtn icon={<AlignCenter size={14}/>} />
                    <AlignBtn icon={<AlignRight size={14}/>} />
                    <div className="w-[1px] h-6 bg-[#30363d] mx-1"></div>
                    <AlignBtn icon={<Maximize size={14}/>} />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 items-center">
                       <span className="text-[#8b949e] w-4">X</span>
                       <input type="text" className="bg-transparent outline-none w-full text-white font-mono" defaultValue="64" />
                    </div>
                    <div className="flex bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 items-center">
                       <span className="text-[#8b949e] w-4">Y</span>
                       <input type="text" className="bg-transparent outline-none w-full text-white font-mono" defaultValue="320" />
                    </div>
                    <div className="flex bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 items-center">
                       <span className="text-[#8b949e] w-4">W</span>
                       <input type="text" className="bg-transparent outline-none w-full text-white font-mono" defaultValue="192" />
                    </div>
                    <div className="flex bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 items-center">
                       <span className="text-[#8b949e] w-4">H</span>
                       <input type="text" className="bg-transparent outline-none w-full text-white font-mono" defaultValue="48" />
                    </div>
                 </div>
              </div>

              {/* Fill */}
              <div className="border-t border-[#30363d] pt-4">
                 <div className="flex items-center justify-between text-xs font-bold mb-3">
                    <span>Fill</span>
                    <button className="text-[#8b949e] hover:text-white">+</button>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white border border-[#30363d]"></div>
                    <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs font-mono text-white">#FFFFFF</div>
                    <div className="w-12 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs font-mono text-white text-right">100%</div>
                 </div>
              </div>

              {/* Stroke */}
              <div className="border-t border-[#30363d] pt-4">
                 <div className="flex items-center justify-between text-xs font-bold mb-3">
                    <span>Stroke (Border)</span>
                    <button className="text-[#8b949e] hover:text-white">+</button>
                 </div>
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-[#3fb950] border border-[#30363d]"></div>
                    <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs font-mono text-white">#3FB950</div>
                    <div className="w-12 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs font-mono text-white text-right">100%</div>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="flex bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 items-center w-1/2">
                       <span className="text-[#8b949e] text-[10px] w-6">Line</span>
                       <select className="bg-transparent outline-none text-white text-[10px] w-full">
                          <option>Inside</option>
                          <option>Center</option>
                          <option>Outside</option>
                       </select>
                    </div>
                    <div className="flex bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 items-center w-1/2">
                       <span className="text-[#8b949e] text-[10px] w-6">Px</span>
                       <input type="text" className="bg-transparent outline-none text-white text-[10px] w-full" defaultValue="4" />
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}

function ToolBtn({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${active ? 'bg-[#3fb950] text-black' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}
    >
      {icon}
    </button>
  );
}

function LayersIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>
}

function LayerItem({ icon, name, active, locked, visible = true, children }: { icon: React.ReactNode, name: string, active?: boolean, locked?: boolean, visible?: boolean, children?: React.ReactNode }) {
  return (
    <div>
       <div className={`flex items-center justify-between p-1 rounded cursor-pointer text-xs ${active ? 'bg-[#3fb950]/20 text-white font-medium' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-white'}`}>
          <div className="flex items-center gap-2">
             <div className={active ? 'text-[#3fb950]' : ''}>{icon}</div>
             <span className="truncate">{name}</span>
          </div>
          <div className="flex gap-1 opacity-50 hover:opacity-100">
             {locked ? <Lock size={12}/> : null}
             {!visible ? <Eye size={12} className="opacity-40" /> : <Eye size={12}/>}
          </div>
       </div>
       {children}
    </div>
  )
}

function AlignBtn({ icon }: { icon: React.ReactNode }) {
  return <button className="p-1.5 bg-[#0d1117] border border-[#30363d] rounded text-[#8b949e] hover:text-white hover:border-[#8b949e]">{icon}</button>
}
