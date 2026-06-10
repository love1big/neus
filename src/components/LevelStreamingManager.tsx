import React, { useState } from 'react';
import { Network, Server, Layers, Settings2, Loader, Save, SkipForward, Play, FileCode2, Maximize, Cpu, Target, Boxes, Eye, Archive } from 'lucide-react';

export default function LevelStreamingManager() {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#ccc] font-sans">
      
      {/* Top Header */}
      <div className="px-4 py-3 border-b border-[#333] bg-[#252525] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-blue-500/20 text-blue-400 border border-blue-500/50">
             <Boxes size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
              World Partition & Level Streaming Manager
            </h2>
            <p className="text-[#888] text-[9px] font-mono">HZB OCCLUSION • DATA LAYERS • GRID-BASED LOADING • HLOD</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button className="bg-[#333] border border-[#555] hover:bg-[#444] text-white px-3 py-1.5 flex items-center gap-2 text-xs font-bold rounded transition"><Save size={14}/> Save Partition Settings</button>
           <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 flex items-center gap-2 text-xs font-bold rounded shadow-lg shadow-blue-500/20 transition"><Server size={14}/> Generate HLODs</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Left Side Hierarchy Layer */}
         <div className="w-[280px] bg-[#222] border-r border-[#333] flex flex-col shrink-0">
             <div className="p-3 border-b border-[#333]">
                <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Data Layers</h3>
                <p className="text-[9px] text-[#888] mt-1">Runtime toggleable chunk layers.</p>
             </div>
             <div className="p-2 flex-1 overflow-y-auto space-y-1">
                 {/* Item 1 */}
                 <div className="bg-[#333] border border-[#444] p-2 rounded flex items-center justify-between cursor-pointer group">
                    <div className="flex justify-start gap-2 items-center">
                       <input type="checkbox" defaultChecked className="accent-blue-500"/>
                       <span className="text-[11px] font-bold text-white">Base_Terrain_Geometry</span>
                    </div>
                    <Eye size={12} className="text-[#888] group-hover:text-white" />
                 </div>
                 {/* Item 2 */}
                 <div className="bg-[#333] border border-[#444] p-2 rounded flex items-center justify-between cursor-pointer group">
                    <div className="flex justify-start gap-2 items-center">
                       <input type="checkbox" defaultChecked className="accent-blue-500"/>
                       <span className="text-[11px] font-bold text-white">Vegetation_Dense_Trees</span>
                    </div>
                    <Eye size={12} className="text-[#888] group-hover:text-white" />
                 </div>
                 {/* Item 3 */}
                 <div className="bg-[#1a1a1a] border border-[#333] p-2 rounded flex items-center justify-between cursor-pointer group">
                    <div className="flex justify-start gap-2 items-center">
                       <input type="checkbox" className="accent-blue-500"/>
                       <span className="text-[11px] font-bold text-[#888]">Story_Act1_Static_Props</span>
                    </div>
                    <Eye size={12} className="text-[#555] group-hover:text-white" />
                 </div>
                 <button className="w-full text-[10px] text-center border-dashed border border-[#555] text-[#888] py-1.5 rounded hover:text-white hover:border-[#aaa] transition">
                    + Create New Data Layer
                 </button>
             </div>
             <div className="p-4 border-t border-[#333] bg-[#1a1a1a]">
                <div className="flex justify-between items-center text-[10px] font-mono">
                   <span className="text-[#888]">Total Streaming Grid Size:</span>
                   <span className="text-white">64 km²</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono mt-1">
                   <span className="text-[#888]">Loaded Cells (Current):</span>
                   <span className="text-blue-400 font-bold">12 / 1024</span>
                </div>
             </div>
         </div>

         {/* Center Grid View */}
         <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
             
             {/* Map Controls */}
             <div className="absolute top-4 right-4 flex gap-2 z-20">
                <select className="bg-[#222] border border-[#444] text-white text-[10px] rounded px-2 outline-none">
                   <option>Heatmap: Memory Load</option>
                   <option>View: Cell Status</option>
                   <option>View: HLOD Boundaries</option>
                </select>
             </div>

             {/* Grid Simulation */}
             <div className="w-[800px] h-[800px] border border-[#333] relative grid grid-cols-8 grid-rows-8 gap-[1px] bg-[#222]">
                 {[...Array(64)].map((_, i) => {
                    // Logic to simulate active player area and around it
                    const isCenter = i === 27 || i === 28 || i === 35 || i === 36;
                    const isFringe = i === 18 || i === 19 || i === 20 || i === 21 || i === 26 || i === 29 || i === 34 || i === 37 || i === 42 || i === 43 || i === 44 || i === 45;
                    
                    let bgClass = "bg-[#111]";
                    if (isCenter) bgClass = "bg-blue-600/60 shadow-[inset_0_0_10px_#2563eb]";
                    else if (isFringe) bgClass = "bg-blue-900/30";

                    return (
                       <div key={i} className={`w-full h-full ${bgClass} relative flex items-center justify-center group cursor-pointer hover:border hover:border-white z-10 transition-colors`}>
                          <span className="text-[8px] text-[#555] font-mono select-none group-hover:text-white">C{i}</span>
                          {/* Simulate Player location in center */}
                          {i === 27 && <div className="absolute w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></div>}
                       </div>
                    )
                 })}
                 
                 {/* Visual radius circle */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-dashed border-blue-500/50 pointer-events-none z-0"></div>
             </div>

         </div>

         {/* Right Inspector */}
         <div className="w-[300px] bg-[#222] border-l border-[#333] flex flex-col shrink-0">
             <div className="p-4 border-b border-[#333]">
                <h3 className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2"><Settings2 size={14} className="text-yellow-400"/> Loading Range Setup</h3>
             </div>
             
             <div className="flex-1 p-4 overflow-y-auto space-y-5 custom-scrollbar">
                
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-[10px] text-[#aaa]">
                      <span>Grid Cell Size</span>
                      <span className="text-white font-mono">12800 cm</span>
                   </div>
                   <input type="range" className="w-full accent-blue-500" min="0" max="100" defaultValue="40"/>
                   
                   <div className="flex justify-between items-center text-[10px] text-[#aaa] mt-4">
                      <span>Loading Radius (Cells)</span>
                      <span className="text-white font-mono">3 Cells</span>
                   </div>
                   <input type="range" className="w-full accent-blue-500" min="1" max="10" defaultValue="3"/>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#333]">
                   <h4 className="text-[11px] font-bold text-white uppercase">HLOD (Hierarchical LOD)</h4>
                   <div className="bg-[#1a1a1a] border border-[#444] rounded p-2 text-[10px] space-y-2">
                       <label className="flex items-center gap-2 text-white"><input type="checkbox" defaultChecked className="accent-blue-500"/> Auto-Generate Imposters</label>
                       <label className="flex items-center gap-2 text-[#aaa]"><input type="checkbox" defaultChecked className="accent-blue-500"/> Merge Static Meshes</label>
                       <label className="flex items-center gap-2 text-[#aaa]"><input type="checkbox" defaultChecked className="accent-blue-500"/> Bake Materials to Atlas</label>
                   </div>
                   <div className="text-[9px] text-[#888] p-1">Compiles distant regions into low-poly surrogate meshes to save draw calls.</div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#333]">
                   <h4 className="text-[11px] font-bold text-white uppercase flex items-center gap-1"><Cpu size={12}/> Memory Pools</h4>
                   <div className="bg-[#1a1a1a] border border-[#444] p-3 rounded space-y-2 font-mono text-[10px]">
                      <div className="flex justify-between">
                         <span className="text-[#aaa]">Geometry Block</span>
                         <span className="text-blue-400">1.2 GB</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-[#aaa]">Texture Streaming</span>
                         <span className="text-yellow-400">2.8 GB</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-[#aaa]">NavMesh / ASTAR</span>
                         <span className="text-white">124 MB</span>
                      </div>
                   </div>
                </div>

             </div>
         </div>

      </div>
    </div>
  );
}
