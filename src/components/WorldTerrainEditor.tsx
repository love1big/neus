import React, { useState } from 'react';
import { Mountain, Trees, Droplets, Map, Maximize, Minus, Plus, Settings, Layers, MousePointer2, Paintbrush, Undo, Redo, Download, Play, Eye } from 'lucide-react';

export default function WorldTerrainEditor() {
  const [activeTool, setActiveTool] = useState('raise');
  const [brushSize, setBrushSize] = useState(50);
  const [brushStrength, setBrushStrength] = useState(25);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#3fb950] font-bold">
            <Mountain size={18} />
            <span>Procedural Voxel & Terrain Engine</span>
          </div>
          <div className="h-6 w-[1px] bg-[#30363d] mx-2"></div>
          <div className="flex bg-[#0d1117] rounded border border-[#30363d] p-0.5">
            <ToolButton icon={<MousePointer2 size={14} />} active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
            <ToolButton icon={<Mountain size={14} />} active={activeTool === 'raise'} onClick={() => setActiveTool('raise')} />
            <ToolButton icon={<Minus size={14} />} active={activeTool === 'lower'} onClick={() => setActiveTool('lower')} />
            <ToolButton icon={<Paintbrush size={14} />} active={activeTool === 'smooth'} onClick={() => setActiveTool('smooth')} />
            <ToolButton icon={<Map size={14} />} active={activeTool === 'flatten'} onClick={() => setActiveTool('flatten')} />
          </div>
          <div className="h-6 w-[1px] bg-[#30363d] mx-2"></div>
          <div className="flex gap-2">
            <button className="p-1.5 text-[#8b949e] hover:text-white rounded"><Undo size={14} /></button>
            <button className="p-1.5 text-[#8b949e] hover:text-white rounded"><Redo size={14} /></button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
            <Download size={14} /> Export Heightmap
          </button>
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b] text-white font-medium">
            <Play size={14} /> Simulate Physics
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Brush Settings */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col">
          <div className="p-3 font-bold text-xs border-b border-[#30363d] flex items-center gap-2">
            <Settings size={14} className="text-[#8b949e]" /> BRUSH SETTINGS
          </div>
          <div className="p-4 space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#8b949e]">Radius (m)</span>
                <span className="text-white font-mono">{brushSize}</span>
              </div>
              <input type="range" className="w-full accent-[#58a6ff]" min="1" max="200" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#8b949e]">Strength/Intensity</span>
                <span className="text-white font-mono">{brushStrength}%</span>
              </div>
              <input type="range" className="w-full accent-[#58a6ff]" min="1" max="100" value={brushStrength} onChange={e => setBrushStrength(parseInt(e.target.value))} />
            </div>
            <div>
              <div className="text-xs text-[#8b949e] mb-2">Falloff Profile</div>
              <div className="flex gap-2 h-8">
                <div className="flex-1 bg-[#0d1117] border border-[#58a6ff] rounded flex items-center justify-center cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-white to-transparent opacity-80"></div>
                </div>
                <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded flex items-center justify-center cursor-pointer hover:border-[#8b949e]">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
                <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded flex items-center justify-center cursor-pointer hover:border-[#8b949e]">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-white opacity-80"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-3 font-bold text-xs border-y border-[#30363d] mt-auto flex items-center gap-2">
            <Trees size={14} className="text-[#3fb950]" /> FOLIAGE SCATTER
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
             <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0d1117] border border-[#58a6ff] rounded p-2 text-center cursor-pointer">
                   <div className="text-xs font-bold text-white mb-1">Oak Tree</div>
                   <div className="text-[10px] text-[#8b949e]">Density: 40%</div>
                </div>
                <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-center cursor-pointer hover:border-[#8b949e]">
                   <div className="text-xs font-bold text-white mb-1">Pine Tree</div>
                   <div className="text-[10px] text-[#8b949e]">Density: 60%</div>
                </div>
                <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-center cursor-pointer hover:border-[#8b949e]">
                   <div className="text-xs font-bold text-white mb-1">Boulders</div>
                   <div className="text-[10px] text-[#8b949e]">Density: 15%</div>
                </div>
             </div>
          </div>
        </div>

        {/* Center - 3D Viewport Simulation */}
        <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
          {/* Wireframe Grid Background to simulate 3D engine space */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#58a6ff 1px, transparent 1px), linear-gradient(90deg, #58a6ff 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) scale(2)', transformOrigin: 'top' }}></div>
          
          {/* Faux Terrain Map */}
          <div className="relative z-10 w-[600px] h-[400px] bg-gradient-to-tr from-[#1b2520] via-[#2c4033] to-[#40392c] rounded-lg border border-[#58a6ff]/30 shadow-[0_0_50px_rgba(88,166,255,0.1)] overflow-hidden">
             {/* Heightmap contours */}
             <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, transparent 20%, #000 21%, transparent 22%), radial-gradient(circle at 30% 40%, transparent 40%, #000 41%, transparent 42%), radial-gradient(circle at 70% 60%, transparent 15%, #000 16%, transparent 17%)' }}></div>
             
             {/* Brush Cursor */}
             <div className="absolute left-[40%] top-[45%] w-24 h-24 rounded-full border-2 border-[#58a6ff] bg-[#58a6ff]/10 animate-pulse pointer-events-none transform -translate-x-1/2 -translate-y-1/2" style={{ width: `${brushSize * 2}px`, height: `${brushSize * 2}px` }}>
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#58a6ff] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
             </div>
          </div>

          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-[#161b22]/80 backdrop-blur px-3 py-1.5 rounded border border-[#30363d] text-xs font-mono">
              X: 1450.2 Y: 89.4 Z: -340.1
            </div>
            <div className="bg-[#161b22]/80 backdrop-blur px-3 py-1.5 rounded border border-[#30363d] text-xs font-mono text-[#3fb950]">
              120 FPS
            </div>
          </div>
          
          <div className="absolute top-4 right-4 flex bg-[#161b22]/80 backdrop-blur rounded border border-[#30363d] overflow-hidden">
             <button className="px-3 py-1.5 text-xs hover:bg-[#30363d] border-r border-[#30363d] font-bold text-white bg-[#30363d]">Lit</button>
             <button className="px-3 py-1.5 text-xs hover:bg-[#30363d] border-r border-[#30363d] text-[#8b949e]">Wireframe</button>
             <button className="px-3 py-1.5 text-xs hover:bg-[#30363d] text-[#8b949e]">Unlit</button>
          </div>
        </div>

        {/* Right Panel - Layers & Biomes */}
        <div className="w-64 border-l border-[#30363d] bg-[#161b22] flex flex-col">
          <div className="p-3 font-bold text-xs border-b border-[#30363d] flex items-center gap-2">
            <Layers size={14} className="text-[#8b949e]" /> TERRAIN LAYERS
          </div>
          <div className="flex-1 p-2 space-y-1">
             <LayerItem name="Snow Peaks" material="Snow_Mat_HQ" opacity="100%" active />
             <LayerItem name="Alpine Grass" material="Grass_Wild_02" opacity="100%" />
             <LayerItem name="Bedrock" material="Rock_Cliff_Dark" opacity="100%" />
             <LayerItem name="Base Dirt" material="Dirt_Wet_01" opacity="100%" />
          </div>

          <div className="p-3 font-bold text-xs border-y border-[#30363d] flex items-center gap-2">
            <Droplets size={14} className="text-[#58a6ff]" /> WATER & OCEAN
          </div>
          <div className="p-4 space-y-4">
             <div>
               <div className="flex justify-between text-xs mb-2">
                 <span className="text-[#8b949e]">Sea Level</span>
                 <span className="text-white font-mono">45.0m</span>
               </div>
               <input type="range" className="w-full accent-[#58a6ff]" min="0" max="100" defaultValue="45" />
             </div>
             <div className="flex items-center gap-2">
               <input type="checkbox" className="accent-[#58a6ff]" defaultChecked />
               <span className="text-xs text-[#c9d1d9]">Enable Wave Simulation</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolButton({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${active ? 'bg-[#58a6ff] text-white' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}
    >
      {icon}
    </button>
  );
}

function LayerItem({ name, material, opacity, active = false }: { name: string, material: string, opacity: string, active?: boolean }) {
  return (
    <div className={`p-2 rounded border flex items-center justify-between cursor-pointer ${active ? 'bg-[#58a6ff]/10 border-[#58a6ff]/50' : 'bg-[#0d1117] border-[#30363d] hover:border-[#8b949e]'}`}>
       <div className="flex items-center gap-2">
          <Eye size={14} className={active ? 'text-[#58a6ff]' : 'text-[#8b949e]'} />
          <div>
            <div className="text-xs font-bold text-white">{name}</div>
            <div className="text-[10px] text-[#8b949e]">{material}</div>
          </div>
       </div>
       <div className="text-xs font-mono text-[#8b949e]">{opacity}</div>
    </div>
  );
}
