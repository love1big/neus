import React, { useState } from "react";
import { GitMerge, Camera, Globe, Trees, Map, Settings2, Brush, Eraser, Layers, Compass, Sun, CloudRain, Droplets, Wind, Mountain, Shovel, Eye, Maximize, SlidersHorizontal, Database, Zap, Sparkles, Move, Box, Search, Play, Save, ZoomIn, Target, ChevronDown, Activity, LayoutGrid, BoxSelect, Cpu, Waves, Shield, Castle, Scissors, GripHorizontal, Server, Network} from "lucide-react";

export default function OmniMegaWorldBuilder() {
  const [activeTool, setActiveTool] = useState('sculpt');
  const [brushSize, setBrushSize] = useState(50);
  const [brushStrength, setBrushStrength] = useState(50);
  const [worldSize, setWorldSize] = useState('8km x 8km');
  const [aiMode, setAiMode] = useState('offline');

  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-300 font-sans overflow-hidden">
      {/* Left Sidebar - Tools */}
      <div className="w-[280px] bg-[#141525] border-r border-[#2a2b3d] flex flex-col shrink-0 z-10">
         <div className="p-4 border-b border-[#2a2b3d] bg-[#1a1b2e]">
           <h2 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-wider mb-2">
             <Globe className="text-blue-500" size={18} /> Omni MegaWorld
           </h2>
           <div className="flex gap-2">
              <button onClick={() => setAiMode('offline')} className={`flex-1 text-[10px] font-bold py-1.5 rounded uppercase tracking-wider transition-colors ${aiMode === 'offline' ? 'bg-indigo-600 text-white' : 'bg-[#2a2b3d] text-gray-400 hover:bg-[#3a3b4d]'}`}>
                 <Cpu size={12} className="inline mr-1"/> Offline AI
              </button>
              <button onClick={() => setAiMode('manual')} className={`flex-1 text-[10px] font-bold py-1.5 rounded uppercase tracking-wider transition-colors ${aiMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-[#2a2b3d] text-gray-400 hover:bg-[#3a3b4d]'}`}>
                 <Brush size={12} className="inline mr-1"/> Manual
              </button>
           </div>
         </div>

         <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="p-3">
               <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest px-1">Terrain & Topology</div>
               <div className="grid grid-cols-2 gap-2 mb-4">
                 <ToolBtn id="sculpt" icon={<Mountain />} label="Sculpt" active={activeTool} set={setActiveTool} />
                 <ToolBtn id="paint" icon={<Brush />} label="Paint" active={activeTool} set={setActiveTool} />
                 <ToolBtn id="smooth" icon={<Waves />} label="Smooth" active={activeTool} set={setActiveTool} />
                 <ToolBtn id="flatten" icon={<Shovel />} label="Flatten" active={activeTool} set={setActiveTool} />
                 <ToolBtn id="erosion" icon={<CloudRain />} label="Erosion" active={activeTool} set={setActiveTool} />
                 <ToolBtn id="water" icon={<Droplets />} label="Water" active={activeTool} set={setActiveTool} />
               </div>

               <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest px-1 mt-6">Biomes & Foliage</div>
               <div className="grid grid-cols-2 gap-2 mb-4">
                 <ToolBtn id="forest" icon={<Trees />} label="Forest Gen" active={activeTool} set={setActiveTool} />
                 <ToolBtn id="grass" icon={<LayoutGrid />} label="Grass/Detail" active={activeTool} set={setActiveTool} />
                 <ToolBtn id="rocks" icon={<Box />} label="Scatter Rocks" active={activeTool} set={setActiveTool} />
               </div>

               <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest px-1 mt-6">Civilization & POI</div>
               <div className="grid grid-cols-2 gap-2 mb-4">
                 <ToolBtn id="city" icon={<Castle />} label="City Gen" active={activeTool} set={setActiveTool} />
                 <ToolBtn id="roads" icon={<GitMerge />} label="Road Net" active={activeTool} set={setActiveTool} />
                 <ToolBtn id="caves" icon={<Database />} label="Cave Gen" active={activeTool} set={setActiveTool} />
               </div>
               
               <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest px-1 mt-6">World Partition</div>
               <div className="grid grid-cols-2 gap-2 mb-4">
                 <ToolBtn id="chunks" icon={<BoxSelect />} label="Chunking" active={activeTool} set={setActiveTool} />
                 <ToolBtn id="lod" icon={<Layers />} label="LOD Setup" active={activeTool} set={setActiveTool} />
               </div>
            </div>
         </div>

         {/* Brush Settings */}
         {aiMode === 'manual' && (
           <div className="p-4 bg-[#1a1b2e] border-t border-[#2a2b3d] shrink-0 space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                  <span className="uppercase tracking-wider">Brush Size</span>
                  <span className="text-white">{brushSize}m</span>
                </div>
                <input type="range" min="1" max="200" value={brushSize} onChange={(e)=>setBrushSize(Number(e.target.value))} className="w-full accent-blue-500 h-1" />
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                  <span className="uppercase tracking-wider">Strength / Flow</span>
                  <span className="text-white">{brushStrength}%</span>
                </div>
                <input type="range" min="1" max="100" value={brushStrength} onChange={(e)=>setBrushStrength(Number(e.target.value))} className="w-full accent-blue-500 h-1" />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                 <span className="text-gray-400 uppercase tracking-wider">Falloff</span>
                 <select className="bg-[#0a0a0f] border border-[#2a2b3d] rounded text-white p-1 outline-none">
                    <option>Smooth</option>
                    <option>Linear</option>
                    <option>Spherical</option>
                 </select>
              </div>
           </div>
         )}
         
         {aiMode === 'offline' && (
           <div className="p-4 bg-indigo-900/20 border-t border-indigo-500/30 shrink-0 space-y-3">
              <h3 className="font-bold text-indigo-400 text-xs flex items-center gap-2"><Sparkles size={14}/> LLM World Gen (Local)</h3>
              <textarea 
                className="w-full h-24 bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-white focus:border-indigo-500 outline-none resize-none font-mono placeholder:text-gray-600"
                placeholder="Describe region: e.g., A sprawling volcanic crater with obsidian shards and lava rivers flowing into a dried basin."
              ></textarea>
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-colors">
                Generate Region (Local GPU)
              </button>
           </div>
         )}
      </div>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col relative bg-black">
        {/* Top Viewport Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/80 to-transparent z-20 flex items-center justify-between px-4 pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
             <button className="bg-[#141525]/80 backdrop-blur border border-[#2a2b3d] text-gray-300 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-2">
               <Sun size={14}/> Day/Night
             </button>
             <button className="bg-[#141525]/80 backdrop-blur border border-[#2a2b3d] text-gray-300 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-2">
               <Camera size={14}/> Cinematic
             </button>
             <button className="bg-[#141525]/80 backdrop-blur border border-[#2a2b3d] text-gray-300 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-2">
               <Target size={14}/> Focus Active
             </button>
          </div>
          
          <div className="flex gap-3 items-center pointer-events-auto">
             <div className="bg-[#141525]/80 backdrop-blur border border-[#2a2b3d] text-gray-400 px-3 py-1.5 rounded text-xs font-mono">
               World Size: {worldSize} | Chunks: 1024
             </div>
             <button className="bg-green-600/90 text-white px-4 py-1.5 rounded text-xs font-bold shadow-[0_0_10px_rgba(34,197,94,0.3)] flex items-center gap-2 hover:bg-green-500 transition-colors">
               <Play size={14}/> Simulate World
             </button>
          </div>
        </div>

        {/* 3D Canvas Placeholder */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
           <div className="absolute inset-0 bg-[#0f111a]" />
           {/* Grid */}
           <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'linear-gradient(#4a4b5d 1px, transparent 1px), linear-gradient(90deg, #4a4b5d 1px, transparent 1px)',
              backgroundSize: '100px 100px',
              transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
           }} />
           
           {/* Mock Terrain Heightmap */}
           <div className="absolute inset-0 opacity-50 mix-blend-screen" style={{
             background: 'radial-gradient(circle at 50% 50%, #1e1e2d 0%, #000 70%)'
           }}>
             {/* Some procedural shapes */}
             <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-blue-500/20 blur-[100px] rounded-full" />
             <div className="absolute bottom-1/3 right-1/4 w-[30%] h-[50%] bg-green-500/10 blur-[80px] rounded-full" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-yellow-500/10 blur-[120px] rounded-full" />
           </div>

           {/* Central Target/Cursor */}
           {aiMode === 'manual' && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" style={{ width: brushSize * 3, height: brushSize * 3 }}>
               <div className="w-full h-full border-2 border-white/50 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full" />
               </div>
             </div>
           )}

           {aiMode === 'offline' && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="text-center animate-pulse">
                   <Cpu size={48} className="mx-auto text-indigo-500/50 mb-4" />
                   <div className="text-indigo-400 font-mono text-sm border border-indigo-500/30 bg-indigo-900/40 px-4 py-2 rounded backdrop-blur">AI Voxel Engine Ready</div>
                </div>
             </div>
           )}

           {/* Stats Overlay */}
           <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur border border-[#2a2b3d] p-3 rounded-lg text-[10px] font-mono text-gray-400 space-y-1 z-20">
              <div className="text-white font-bold mb-2 uppercase">Render Stats (Nanite)</div>
              <div className="flex justify-between gap-8"><span>FPS</span><span className="text-green-400">144</span></div>
              <div className="flex justify-between gap-8"><span>Draw Calls</span><span className="text-white">12</span></div>
              <div className="flex justify-between gap-8"><span>Triangles</span><span className="text-white">1.2B</span></div>
              <div className="flex justify-between gap-8"><span>VRAM</span><span className="text-yellow-400">4.2 GB</span></div>
              <div className="flex justify-between gap-8 mt-2 pt-2 border-t border-[#2a2b3d]"><span>Streaming</span><span className="text-blue-400">Optimal</span></div>
           </div>
        </div>
      </div>

      {/* Right Sidebar - Layers & Details */}
      <div className="w-[300px] bg-[#141525] border-l border-[#2a2b3d] flex flex-col shrink-0 z-10">
         <div className="flex border-b border-[#2a2b3d] bg-[#1a1b2e] text-[10px] font-bold uppercase tracking-widest">
           <button className="flex-1 py-3 text-blue-400 border-b-2 border-blue-500 bg-blue-500/5">Layers</button>
           <button className="flex-1 py-3 text-gray-500 hover:text-gray-300">Environment</button>
           <button className="flex-1 py-3 text-gray-500 hover:text-gray-300">Data</button>
         </div>

         <div className="flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar">
            <LayerItem name="Global Lighting" icon={<Sun size={14}/>} active />
            <LayerItem name="Atmospheric Volumetrics" icon={<CloudRain size={14}/>} active />
            <LayerItem name="Water Bodies (Fluid Sim)" icon={<Waves size={14}/>} active />
            <LayerItem name="Foliage & Scatter" icon={<Trees size={14}/>} active />
            <LayerItem name="Base Terrain Mesh" icon={<Mountain size={14}/>} active />
            <LayerItem name="NavMesh (AI)" icon={<Network size={14}/>} />
            <LayerItem name="World Partition Grid" icon={<LayoutGrid size={14}/>} />
         </div>

         <div className="p-4 border-t border-[#2a2b3d] bg-[#1a1b2e]">
            <h3 className="text-xs font-bold text-white mb-3">AI Procedural Rules</h3>
            <div className="space-y-2">
               <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-2 rounded flex items-center justify-between text-xs">
                  <span className="text-gray-400">Steepness &gt; 45°</span>
                  <span className="text-yellow-400 font-mono">Rock Texture</span>
               </div>
               <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-2 rounded flex items-center justify-between text-xs">
                  <span className="text-gray-400">Height &lt; 10m</span>
                  <span className="text-blue-400 font-mono">Sand / Coast</span>
               </div>
               <button className="w-full text-center text-[10px] text-gray-500 hover:text-white uppercase tracking-widest mt-2">+ Add Rule</button>
            </div>
         </div>
      </div>
    </div>
  );
}

function ToolBtn({ id, icon, label, active, set }: { id: string, icon: React.ReactNode, label: string, active: string, set: (id: string) => void }) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => set(id)}
      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${isActive ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]' : 'bg-[#0a0a0f] border-[#2a2b3d] text-gray-400 hover:border-[#4a4b5d] hover:text-gray-200'}`}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

function LayerItem({ name, icon, active = false }: { name: string, icon: React.ReactNode, active?: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 bg-[#1a1b2e] border border-[#2a2b3d] rounded hover:border-[#4a4b5d] transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
         <div className={`${active ? 'text-blue-400' : 'text-gray-600'}`}>
           <Eye size={14} />
         </div>
         <div className="text-gray-400 group-hover:text-white">{icon}</div>
         <span className={`text-xs font-medium ${active ? 'text-gray-200' : 'text-gray-500'}`}>{name}</span>
      </div>
      <GripHorizontal size={14} className="text-gray-600 cursor-grab" />
    </div>
  );
}
