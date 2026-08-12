import React from 'react';
import { Network, Box, Save, Play, Image as ImageIcon, Sparkles, Layers, Sliders, Hash, Droplet, Sun, MousePointer2, Plus } from 'lucide-react';

export default function PBRMaterialGraph() {
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#a371f7]/20 border border-[#a371f7]/50 rounded">
            <Network className="text-[#a371f7]" size={16} />
          </div>
          <div>
            <h1 className="font-bold text-sm">Node-Based PBR Material Alchemy</h1>
            <p className="text-[10px] text-[#8b949e]">Procedural Texture Generation & Shader Graph</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
            <Save size={14} /> Save Material
          </button>
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b] font-medium text-white">
            <Play size={14} /> Compile Shader
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Preview & Properties */}
        <div className="w-72 border-r border-[#30363d] bg-[#161b22] flex flex-col z-20">
          <div className="h-64 border-b border-[#30363d] bg-black relative flex items-center justify-center">
             {/* Render Sphere Mockup */}
             <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#8a7b66] via-[#4a4237] to-[#1a1713] shadow-[inset_0_-20px_40px_rgba(0,0,0,0.8),_inset_0_20px_40px_rgba(255,255,255,0.2)] relative overflow-hidden">
                {/* Specular highlight */}
                <div className="absolute top-6 left-8 w-12 h-8 bg-white opacity-40 rounded-full blur-md transform rotate-12"></div>
                {/* Normal map bump simulation */}
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, transparent 20%, #000 21%, transparent 22%)', backgroundSize: '4px 4px' }}></div>
             </div>
             
             <div className="absolute bottom-2 right-2 flex bg-[#161b22]/80 backdrop-blur border border-[#30363d] rounded p-1">
                <button className="p-1 text-white bg-[#30363d] rounded"><Box size={14}/></button>
                <button className="p-1 text-[#8b949e] hover:text-white"><Sun size={14}/></button>
             </div>
          </div>
          
          <div className="p-3 font-bold text-xs border-b border-[#30363d] flex items-center gap-2 text-[#8b949e]">
            <Sliders size={14} /> NODE PROPERTIES
          </div>
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
             <div className="text-sm font-bold text-white mb-2">Voronoi Noise</div>
             
             <div className="space-y-3">
                <div>
                   <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                      <span>Scale</span><span>12.5</span>
                   </div>
                   <input type="range" className="w-full accent-[#a371f7]" min="1" max="100" defaultValue="12.5" />
                </div>
                <div>
                   <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                      <span>Randomness</span><span>1.0</span>
                   </div>
                   <input type="range" className="w-full accent-[#a371f7]" min="0" max="100" defaultValue="100" />
                </div>
                <div className="pt-2 border-t border-[#30363d]">
                   <label className="text-xs text-[#8b949e] block mb-1">Output Map</label>
                   <select className="w-full bg-[#0d1117] border border-[#30363d] text-white text-xs p-1.5 rounded">
                      <option>Distance</option>
                      <option>Color</option>
                      <option>Position</option>
                   </select>
                </div>
             </div>
          </div>
        </div>

        {/* Center: Graph Editor */}
        <div className="flex-1 bg-[#010409] relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
           
           <div className="absolute top-4 left-4 flex bg-[#161b22] border border-[#30363d] rounded p-1 shadow-lg z-10">
              <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded flex items-center gap-1 text-xs">
                 <Plus size={14}/> Add Node
              </button>
           </div>

           {/* Nodes Canvas (Interactive Simulation) */}
           <div className="absolute inset-0 pointer-events-auto">
              
              {/* Spline Connections (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                 <path d="M 280 200 C 350 200, 350 300, 480 300" fill="none" stroke="#58a6ff" strokeWidth="3" className="drop-shadow-[0_0_5px_rgba(88,166,255,0.5)]" />
                 <path d="M 280 380 C 380 380, 380 330, 480 330" fill="none" stroke="#8b949e" strokeWidth="2" />
                 <path d="M 280 500 C 400 500, 400 360, 480 360" fill="none" stroke="#a371f7" strokeWidth="3" className="drop-shadow-[0_0_5px_rgba(163,113,247,0.5)]" />
              </svg>

              {/* Node 1: Voronoi */}
              <div className="absolute top-[160px] left-[100px] w-48 bg-[#161b22] border border-[#30363d] rounded shadow-xl z-10 flex flex-col">
                 <div className="bg-[#a371f7]/20 border-b border-[#a371f7]/50 px-3 py-1.5 flex justify-between items-center">
                    <span className="text-xs font-bold text-[#a371f7]">Voronoi Noise</span>
                 </div>
                 <div className="p-2 py-3 flex flex-col gap-2">
                    <div className="flex justify-end items-center gap-2 text-[10px] text-white">
                       Distance <div className="w-3 h-3 bg-[#58a6ff] rounded-full border-2 border-[#0d1117] ring-1 ring-[#58a6ff]"></div>
                    </div>
                    <div className="flex justify-end items-center gap-2 text-[10px] text-white">
                       Color <div className="w-3 h-3 bg-[#d29922] rounded-full border-2 border-[#0d1117] ring-1 ring-[#d29922]"></div>
                    </div>
                 </div>
              </div>

              {/* Node 2: Color Ramp */}
              <div className="absolute top-[340px] left-[100px] w-48 bg-[#161b22] border border-[#30363d] rounded shadow-xl z-10 flex flex-col">
                 <div className="bg-[#30363d]/50 border-b border-[#30363d] px-3 py-1.5 flex justify-between items-center">
                    <span className="text-xs font-bold text-white">Color Ramp</span>
                 </div>
                 <div className="p-2 py-3 flex flex-col gap-2">
                    <div className="flex justify-start items-center gap-2 text-[10px] text-white mb-2">
                       <div className="w-3 h-3 bg-[#8b949e] rounded-full border-2 border-[#0d1117] ring-1 ring-[#8b949e]"></div> Fac
                    </div>
                    <div className="w-full h-4 rounded bg-gradient-to-r from-black to-white border border-[#30363d]"></div>
                    <div className="flex justify-end items-center gap-2 text-[10px] text-white mt-2">
                       Color <div className="w-3 h-3 bg-[#d29922] rounded-full border-2 border-[#0d1117] ring-1 ring-[#d29922]"></div>
                    </div>
                 </div>
              </div>

              {/* Node 3: Normal Map */}
              <div className="absolute top-[480px] left-[100px] w-48 bg-[#161b22] border border-[#30363d] rounded shadow-xl z-10 flex flex-col">
                 <div className="bg-[#58a6ff]/20 border-b border-[#58a6ff]/50 px-3 py-1.5 flex justify-between items-center">
                    <span className="text-xs font-bold text-[#58a6ff]">Normal Map</span>
                 </div>
                 <div className="p-2 py-3 flex flex-col gap-2">
                    <div className="flex justify-start items-center gap-2 text-[10px] text-white">
                       <div className="w-3 h-3 bg-[#d29922] rounded-full border-2 border-[#0d1117] ring-1 ring-[#d29922]"></div> Color
                    </div>
                    <div className="flex justify-end items-center gap-2 text-[10px] text-white mt-2">
                       Normal <div className="w-3 h-3 bg-[#a371f7] rounded-full border-2 border-[#0d1117] ring-1 ring-[#a371f7]"></div>
                    </div>
                 </div>
              </div>

              {/* Node 4: Master Output (PBR Material) */}
              <div className="absolute top-[250px] left-[500px] w-56 bg-[#161b22] border-2 border-[#3fb950]/50 rounded shadow-2xl z-10 flex flex-col shadow-[0_0_30px_rgba(63,185,80,0.1)]">
                 <div className="bg-[#3fb950]/20 border-b border-[#3fb950]/50 px-3 py-2 flex justify-between items-center">
                    <span className="text-sm font-bold text-white flex items-center gap-2"><Layers size={14}/> Standard PBR Surface</span>
                 </div>
                 <div className="p-3 flex flex-col gap-3">
                    <div className="flex justify-start items-center gap-2 text-xs text-white">
                       <div className="w-3 h-3 bg-[#58a6ff] rounded-full border-2 border-[#0d1117] ring-2 ring-[#58a6ff]/50"></div> Base Color
                    </div>
                    <div className="flex justify-start items-center gap-2 text-xs text-white">
                       <div className="w-3 h-3 bg-[#8b949e] rounded-full border-2 border-[#0d1117] ring-1 ring-[#8b949e]"></div> Metallic (0.0)
                    </div>
                    <div className="flex justify-start items-center gap-2 text-xs text-white">
                       <div className="w-3 h-3 bg-[#8b949e] rounded-full border-2 border-[#0d1117] ring-2 ring-[#8b949e]/50"></div> Roughness
                    </div>
                    <div className="flex justify-start items-center gap-2 text-xs text-white">
                       <div className="w-3 h-3 bg-[#a371f7] rounded-full border-2 border-[#0d1117] ring-2 ring-[#a371f7]/50"></div> Normal
                    </div>
                    <div className="flex justify-start items-center gap-2 text-xs text-white">
                       <div className="w-3 h-3 bg-[#8b949e] rounded-full border-2 border-[#0d1117] ring-1 ring-[#8b949e]"></div> Ambient Occlusion
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}
