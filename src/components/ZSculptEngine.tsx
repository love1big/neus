import React, { useState } from 'react';
import { MousePointer2, Paintbrush, CircleSlash, Maximize, Undo, Redo, Download, ZoomIn, Grip, Trash2, Sliders, Layers } from 'lucide-react';

export default function ZSculptEngine() {
  const [activeTool, setActiveTool] = useState('sculpt');

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#58a6ff]/20 border border-[#58a6ff]/50 rounded">
            <MousePointer2 className="text-[#58a6ff]" size={16} />
          </div>
          <div>
            <h1 className="font-bold text-sm">Dynamic Topology Sculpting Engine</h1>
            <p className="text-[10px] text-[#8b949e]">High-Poly Mesh Editing & Detail Sculpting</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex bg-[#010409] border border-[#30363d] rounded p-0.5 gap-0.5 shadow-inner">
           <ToolBtn icon={<Paintbrush size={14} />} active={activeTool === 'sculpt'} onClick={() => setActiveTool('sculpt')} />
           <ToolBtn icon={<CircleSlash size={14} />} active={activeTool === 'smooth'} onClick={() => setActiveTool('smooth')} />
           <ToolBtn icon={<Grip size={14} />} active={activeTool === 'grab'} onClick={() => setActiveTool('grab')} />
           <div className="w-[1px] h-4 bg-[#30363d] my-auto mx-1"></div>
           <ToolBtn icon={<Undo size={14} />} active={false} onClick={() => {}} />
           <ToolBtn icon={<Redo size={14} />} active={false} onClick={() => {}} />
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
             <Download size={14} /> Export Mesh (.obj)
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Brush Settings */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 z-10">
           <div className="p-2 border-b border-[#30363d] font-bold text-xs flex items-center gap-2 text-[#8b949e]">
             <Sliders size={14} /> BRUSH SETTINGS
           </div>
           <div className="p-4 flex-1 overflow-y-auto space-y-6">
              
              <div>
                 <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                    <span>Radius</span><span>45px</span>
                 </div>
                 <input type="range" className="w-full accent-[#58a6ff]" min="1" max="100" defaultValue="45" />
              </div>
              
              <div>
                 <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                    <span>Strength</span><span>0.8</span>
                 </div>
                 <input type="range" className="w-full accent-[#58a6ff]" min="0" max="1" step="0.1" defaultValue="0.8" />
              </div>

              <div className="border-t border-[#30363d] pt-4">
                 <div className="text-xs font-bold text-[#8b949e] mb-2">Alpha / Stroke</div>
                 <div className="grid grid-cols-3 gap-2">
                    <div className="aspect-square bg-[#0d1117] border border-[#58a6ff] rounded flex items-center justify-center cursor-pointer">
                       <div className="w-6 h-6 rounded-full bg-white opacity-80 blur-[2px]"></div>
                    </div>
                    <div className="aspect-square bg-[#0d1117] border border-[#30363d] rounded flex items-center justify-center cursor-pointer hover:border-[#8b949e]">
                       <div className="w-6 h-6 rounded-full bg-white opacity-90 blur-none"></div>
                    </div>
                    <div className="aspect-square bg-[#0d1117] border border-[#30363d] rounded flex items-center justify-center cursor-pointer hover:border-[#8b949e]">
                       <div className="w-6 h-6 rounded-sm bg-white opacity-80 blur-[1px]"></div>
                    </div>
                 </div>
              </div>
              
              <div className="border-t border-[#30363d] pt-4">
                 <label className="flex items-center gap-2 text-xs text-[#c9d1d9] cursor-pointer">
                    <input type="checkbox" className="accent-[#58a6ff]" defaultChecked /> Enable Dynamic Topology
                 </label>
                 <div className="text-[10px] text-[#8b949e] mt-1 ml-5">Tessellates mesh on the fly where detail is needed.</div>
              </div>

           </div>
        </div>

        {/* Center: 3D Viewport */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
           
           {/* Fake 3D Sculpt View */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Fake MatCap Sphere showing sculpt detail */}
              <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#c9d1d9] via-[#8b949e] to-[#21262d] shadow-[inset_0_-20px_40px_rgba(0,0,0,0.8),_inset_0_20px_40px_rgba(255,255,255,0.2)] relative overflow-hidden">
                 
                 {/* Fake sculpting strokes */}
                 <div className="absolute top-[20%] left-[30%] w-[100px] h-[40px] bg-black/20 rounded-full blur-[4px] transform -rotate-12"></div>
                 <div className="absolute top-[25%] left-[28%] w-[90px] h-[30px] bg-white/20 rounded-full blur-[2px] transform -rotate-12"></div>
                 
                 <div className="absolute top-[40%] right-[20%] w-[120px] h-[120px] bg-black/10 rounded-full blur-[8px]"></div>

                 {/* Brush Cursor overlay on sphere */}
                 <div className="absolute top-[45%] left-[45%] w-16 h-16 rounded-full border-2 border-[#58a6ff]/50 bg-[#58a6ff]/10">
                    <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                 </div>
              </div>
           </div>

           <div className="absolute top-4 left-4 bg-[#161b22]/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-white border border-[#30363d]">
             Polygons: 1,402,841
           </div>
           
           <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button className="p-2 bg-[#161b22]/80 backdrop-blur border border-[#30363d] rounded text-[#8b949e] hover:text-white hover:bg-[#30363d]"><ZoomIn size={16}/></button>
              <button className="p-2 bg-[#161b22]/80 backdrop-blur border border-[#30363d] rounded text-[#8b949e] hover:text-white hover:bg-[#30363d]"><Maximize size={16}/></button>
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
      className={`p-1.5 rounded transition-colors ${active ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}
    >
      {icon}
    </button>
  );
}
