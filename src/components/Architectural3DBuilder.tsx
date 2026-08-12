import React, { useState } from 'react';
import { Home, Ruler, Grid3X3, ArrowUpFromLine, Maximize, BoxSelect, Columns, Hammer, Box, Undo, Redo, Download, Share2, Layers, Move3d } from 'lucide-react';

export default function Architectural3DBuilder() {
  const [mode, setMode] = useState<'draw' | 'edit'>('draw');

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#d29922] font-bold">
            <Home size={18} />
            <span>Parametric Architecture Builder</span>
          </div>
          <div className="h-6 w-[1px] bg-[#30363d] mx-2"></div>
          
          <div className="flex bg-[#0d1117] rounded border border-[#30363d] p-0.5">
            <ToolBtn icon={<BoxSelect size={14} />} label="Select" active={mode === 'edit'} onClick={() => setMode('edit')} />
            <ToolBtn icon={<Hammer size={14} />} label="Draw Wall" active={mode === 'draw'} onClick={() => setMode('draw')} />
            <ToolBtn icon={<Columns size={14} />} label="Door/Window" active={false} onClick={() => {}} />
            <ToolBtn icon={<ArrowUpFromLine size={14} />} label="Roof" active={false} onClick={() => {}} />
          </div>

          <div className="flex items-center gap-3 ml-4 text-xs text-[#8b949e]">
             <label className="flex items-center gap-1 cursor-pointer hover:text-white">
               <input type="checkbox" className="accent-[#d29922]" defaultChecked /> Snap to Grid (1m)
             </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#0d1117] rounded border border-[#30363d] p-0.5 mr-2">
            <button className="px-3 py-1 bg-[#30363d] text-white text-xs rounded shadow">2D Plan</button>
            <button className="px-3 py-1 text-[#8b949e] hover:text-white text-xs rounded flex items-center gap-1"><Move3d size={12}/> 3D View</button>
          </div>
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
            <Download size={14} /> Export .STL / .OBJ
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Component Library */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col">
          <div className="p-3 font-bold text-xs border-b border-[#30363d] flex items-center gap-2">
            <Box size={14} className="text-[#8b949e]" /> STRUCTURAL ELEMENTS
          </div>
          <div className="p-3 grid grid-cols-2 gap-2 flex-1 overflow-y-auto content-start">
             <LibItem name="Exterior Wall" desc="0.3m thick" type="wall" />
             <LibItem name="Interior Wall" desc="0.15m thick" type="wall" />
             <LibItem name="Single Door" desc="0.9x2.1m" type="door" />
             <LibItem name="Double Door" desc="1.8x2.1m" type="door" />
             <LibItem name="Sliding Window" desc="1.2x1.2m" type="window" />
             <LibItem name="Floor Slab" desc="Concrete" type="floor" />
          </div>

          <div className="p-3 font-bold text-xs border-y border-[#30363d] flex items-center gap-2">
            <Layers size={14} className="text-[#8b949e]" /> FLOOR MANAGER
          </div>
          <div className="p-3 space-y-1">
             <div className="flex justify-between items-center bg-[#0d1117] border border-[#30363d] p-2 rounded text-xs">
                <span className="text-[#8b949e]">Roof</span>
                <span className="text-[10px] bg-[#30363d] px-1 rounded">Hidden</span>
             </div>
             <div className="flex justify-between items-center bg-[#d29922]/10 border border-[#d29922]/50 p-2 rounded text-xs font-bold text-white">
                <span>Ground Floor</span>
                <span className="text-[#d29922]">Active</span>
             </div>
          </div>
        </div>

        {/* Center: Blueprint Grid */}
        <div className="flex-1 bg-[#010409] relative overflow-hidden flex items-center justify-center cursor-crosshair">
          {/* Blueprint Grid */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px), linear-gradient(#161b22 1px, transparent 1px), linear-gradient(90deg, #161b22 1px, transparent 1px)', 
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px', 
            backgroundPosition: 'center center' 
          }}></div>
          
          {/* Faux Drawn Plan */}
          <div className="relative z-10 w-[600px] h-[500px]">
             {/* Walls */}
             <div className="absolute top-10 left-10 w-[400px] h-4 bg-white border border-[#8b949e]"></div>
             <div className="absolute top-10 left-10 w-4 h-[300px] bg-white border border-[#8b949e]"></div>
             <div className="absolute top-[306px] left-10 w-[400px] h-4 bg-white border border-[#8b949e]"></div>
             <div className="absolute top-10 left-[406px] w-4 h-[300px] bg-white border border-[#8b949e]"></div>
             
             {/* Interior Wall */}
             <div className="absolute top-10 left-[200px] w-3 h-[150px] bg-white border border-[#8b949e]"></div>
             
             {/* Door Gap / Marker */}
             <div className="absolute top-[306px] left-[150px] w-[80px] h-4 bg-[#010409] border-x border-[#d29922] flex items-center justify-center">
               <div className="w-full h-[1px] bg-[#d29922] border-dashed border-b border-[#d29922]"></div>
               <div className="absolute w-[80px] h-[80px] border-t border-r border-[#d29922] rounded-tr-full bottom-full left-0 opacity-50"></div>
             </div>

             {/* Dimensions */}
             <div className="absolute -top-6 left-10 w-[400px] flex items-center justify-between text-[#8b949e] text-[10px]">
                <div className="w-1 h-3 bg-[#8b949e]"></div>
                <div>8.00m</div>
                <div className="w-1 h-3 bg-[#8b949e]"></div>
             </div>
             <div className="absolute top-10 -left-6 h-[300px] flex flex-col items-center justify-between text-[#8b949e] text-[10px]">
                <div className="w-3 h-1 bg-[#8b949e]"></div>
                <div className="-rotate-90">6.00m</div>
                <div className="w-3 h-1 bg-[#8b949e]"></div>
             </div>
             
             <div className="absolute top-[160px] left-[200px] flex items-center justify-center">
                 <div className="w-3 h-3 bg-[#d29922] rounded-full animate-ping absolute opacity-50"></div>
                 <div className="w-3 h-3 bg-[#d29922] rounded-full border-2 border-white relative z-10"></div>
             </div>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-[#161b22] border border-[#30363d] px-4 py-2 rounded shadow-lg text-xs font-mono">
             <div className="flex flex-col">
               <span className="text-[#8b949e]">Length</span>
               <span className="text-white">4.50m</span>
             </div>
             <div className="w-[1px] h-6 bg-[#30363d]"></div>
             <div className="flex flex-col">
               <span className="text-[#8b949e]">Angle</span>
               <span className="text-white">90.0°</span>
             </div>
          </div>
        </div>

        {/* Right: Properties Inspector */}
        <div className="w-72 border-l border-[#30363d] bg-[#161b22] flex flex-col">
          <div className="p-3 font-bold text-xs border-b border-[#30363d] flex items-center gap-2">
            <Ruler size={14} className="text-[#8b949e]" /> PROPERTIES
          </div>
          <div className="p-4 space-y-5 flex-1 overflow-y-auto">
             
             <div className="bg-[#0d1117] border border-[#30363d] rounded p-3">
                <div className="text-xs font-bold text-white mb-3 pb-2 border-b border-[#30363d]">Selected: Interior Wall</div>
                
                <div className="space-y-3">
                   <PropInput label="Height (m)" value="2.80" />
                   <PropInput label="Thickness (m)" value="0.15" />
                   <PropInput label="Base Offset" value="0.00" />
                </div>
             </div>

             <div className="bg-[#0d1117] border border-[#30363d] rounded p-3">
                <div className="text-xs font-bold text-white mb-3 pb-2 border-b border-[#30363d]">Materials</div>
                
                <div className="space-y-2">
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-[#8b949e]">Side A (Int)</span>
                     <button className="bg-[#30363d] px-2 py-1 rounded text-white flex items-center gap-2">
                       <div className="w-3 h-3 bg-white rounded-full"></div> Plaster
                     </button>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-[#8b949e]">Side B (Ext)</span>
                     <button className="bg-[#30363d] px-2 py-1 rounded text-white flex items-center gap-2">
                       <div className="w-3 h-3 bg-red-800 rounded-full"></div> Brick
                     </button>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ToolBtn({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${active ? 'bg-[#d29922] text-black font-medium' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}
    >
      {icon} {label}
    </button>
  );
}

function LibItem({ name, desc, type }: { name: string, desc: string, type: 'wall'|'door'|'window'|'floor' }) {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-center cursor-pointer hover:border-[#d29922] group">
       <div className="h-12 flex items-center justify-center mb-1 text-[#8b949e] group-hover:text-[#d29922]">
          {type === 'wall' && <Columns size={24} />}
          {type === 'door' && <div className="w-6 h-10 border-2 border-current rounded-t"></div>}
          {type === 'window' && <div className="w-8 h-6 border-2 border-current grid grid-cols-2 gap-0.5"><div className="bg-current/20"></div><div className="bg-current/20"></div></div>}
          {type === 'floor' && <Grid3X3 size={24} />}
       </div>
       <div className="text-[10px] font-bold text-white truncate">{name}</div>
       <div className="text-[9px] text-[#8b949e]">{desc}</div>
    </div>
  );
}

function PropInput({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
       <span className="text-[#8b949e]">{label}</span>
       <input type="text" className="w-16 bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-white text-right font-mono" defaultValue={value} />
    </div>
  );
}
