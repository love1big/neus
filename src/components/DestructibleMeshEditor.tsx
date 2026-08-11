import React, { useState } from 'react';
import { Box, Layers, Scissors, Settings, Maximize, Play, RotateCcw, AlertTriangle, Shield, MousePointer2 } from 'lucide-react';

export default function DestructibleMeshEditor() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-amber-700 p-1.5 rounded-lg shadow-lg">
            <Scissors size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Chaos <span className="text-orange-400">Destruction Editor</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Voronoi Fracturing & Dynamic Crumble</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="bg-[#333] hover:bg-[#444] px-3 py-1.5 rounded text-[10px] font-bold text-gray-300 transition-colors flex items-center gap-2">
             <RotateCcw size={14}/> RESET MESH
           </button>
           <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded text-[10px] font-bold transition-colors shadow-[0_0_10px_rgba(249,115,22,0.4)]">
             <Play size={14}/> FRACTURE
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Geometry Collections */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> Fracture Hierarchy</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar text-[10px]">
             
             <div className="flex items-center gap-2 py-1 px-2 hover:bg-[#333] rounded cursor-pointer">
               <Box size={12} className="text-orange-400"/> SM_ConcretePillar_01
             </div>
             
             {/* Level 1 Fracture */}
             <div className="flex items-center gap-2 py-1 px-2 ml-4 bg-[#333] rounded cursor-pointer border border-[#3e3e42]">
               <Box size={12} className="text-gray-400"/> Fracture Level 1 (Selected)
             </div>
             
             {/* Fake Chunks */}
             <div className="flex items-center gap-2 py-1 px-2 ml-8 hover:bg-[#333] rounded cursor-pointer text-gray-500">
               <Layers size={10}/> Chunk_0 (Root)
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-12 hover:bg-[#333] rounded cursor-pointer text-gray-500">
               <Layers size={10}/> Chunk_1
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-12 hover:bg-[#333] rounded cursor-pointer text-gray-500">
               <Layers size={10}/> Chunk_2
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-12 hover:bg-[#333] rounded cursor-pointer text-gray-500">
               <Layers size={10}/> Chunk_3
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-12 hover:bg-[#333] rounded cursor-pointer text-gray-500">
               <Layers size={10}/> Chunk_4
             </div>
             
             {/* Level 2 Fracture */}
             <div className="flex items-center gap-2 py-1 px-2 ml-4 hover:bg-[#333] rounded cursor-pointer mt-2 text-gray-400">
               <Box size={12}/> Fracture Level 2
             </div>

          </div>
        </div>

        {/* Center Viewport */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden group">
           
           <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a2a2a] via-[#111] to-black"></div>
           
           {/* Tools */}
           <div className="absolute top-4 left-4 flex gap-2 z-20">
             <button className="bg-orange-600 border border-orange-500/50 p-1.5 rounded text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]"><MousePointer2 size={16}/></button>
             <button className="bg-[#252526] border border-[#3e3e42] p-1.5 rounded text-gray-400 hover:text-white"><Settings size={16}/></button>
           </div>
           
           {/* Fake 3D Mesh (A destructible pillar) */}
           <div className="relative z-10 w-32 h-80 flex flex-col perspective-[1000px] transform-style-3d rotate-x-[-10deg] rotate-y-[30deg]">
              
              {/* Base un-fractured part */}
              <div className="w-full h-1/3 bg-stone-700 border-2 border-stone-600 border-t-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-50 mix-blend-overlay"></div>
              </div>

              {/* Fractured mid part */}
              <div className="w-full h-1/3 relative flex flex-wrap content-start">
                 
                 {/* Fake voronoi chunks */}
                 <div className="w-1/2 h-1/2 bg-stone-600 border border-orange-500/50 transform translate-x-2 -translate-y-1 rotate-6 shadow-[inset_0_0_10px_rgba(0,0,0,0.5),_0_5px_15px_rgba(0,0,0,0.5)] z-20 cursor-pointer hover:border-white transition-all relative">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-50 mix-blend-overlay"></div>
                   {/* internal face */}
                   <div className="absolute inset-0 bg-stone-500 opacity-0 hover:opacity-100 transition-opacity"></div>
                 </div>
                 
                 <div className="w-1/2 h-1/3 bg-stone-700 border border-orange-500/50 transform -translate-x-1 translate-y-2 -rotate-3 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10 cursor-pointer hover:border-white transition-all relative">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-50 mix-blend-overlay"></div>
                 </div>

                 <div className="w-full h-1/2 bg-stone-800 border border-orange-500/50 transform translate-y-1 rotate-1 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-0 cursor-pointer hover:border-white transition-all relative">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-50 mix-blend-overlay"></div>
                 </div>

                 {/* Fracture web overlay */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 20 L40 50 L20 80" stroke="rgba(249,115,22,0.8)" strokeWidth="2" fill="none" className="drop-shadow-[0_0_2px_rgba(249,115,22,1)]"/>
                    <path d="M40 50 L80 40 L100 70" stroke="rgba(249,115,22,0.8)" strokeWidth="2" fill="none" className="drop-shadow-[0_0_2px_rgba(249,115,22,1)]"/>
                 </svg>
              </div>

              {/* Base un-fractured part top */}
              <div className="w-full h-1/3 bg-stone-700 border-2 border-stone-600 border-b-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-50 mix-blend-overlay"></div>
              </div>

           </div>
           
           <div className="absolute bottom-4 right-4 bg-[#1a1a1c]/80 backdrop-blur border border-[#3e3e42] p-2 rounded text-[9px] font-mono text-gray-300">
             Chunks: <span className="text-orange-400">42</span> / Max: 100
           </div>
        </div>

        {/* Right Properties */}
        <div className="w-72 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Fracture Settings</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              
              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Voronoi Generation</h4>
                 <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Sites / Chunks</span>
                      <input type="number" defaultValue="42" className="w-20 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-white text-center font-mono focus:border-orange-500 outline-none" />
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Random Seed</span>
                      <div className="flex">
                        <input type="text" defaultValue="84729" className="w-16 bg-[#1a1a1c] border border-[#3e3e42] border-r-0 rounded-l px-2 py-1 text-white text-center font-mono focus:border-orange-500 outline-none" />
                        <button className="bg-[#333] border border-[#3e3e42] rounded-r px-2 py-1 hover:bg-[#444]"><RotateCcw size={10}/></button>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Noise & Detail</h4>
                 <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between text-gray-400">
                      <span>Amplitude</span>
                      <span className="text-white">0.5</span>
                    </div>
                    <input type="range" defaultValue="50" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-orange-500" />
                    
                    <div className="flex justify-between text-gray-400 mt-4">
                      <span>Frequency</span>
                      <span className="text-white">1.2</span>
                    </div>
                    <input type="range" defaultValue="120" max="300" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-orange-500" />
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Physics & Collisions</h4>
                 <div className="space-y-2 text-[10px] text-gray-300">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-orange-500 focus:ring-0" /> Generate Collision Hulls
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-orange-500 focus:ring-0" /> Internal Materials
                    </label>
                    
                    <div className="flex justify-between items-center text-gray-400 mt-2">
                      <span>Damage Threshold</span>
                      <input type="text" defaultValue="500.0" className="w-20 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-white text-center font-mono focus:border-orange-500 outline-none" />
                    </div>
                 </div>
              </div>
              
              <div className="bg-orange-900/20 border border-orange-500/50 p-2 rounded flex gap-2">
                 <AlertTriangle size={14} className="text-orange-500 shrink-0 mt-0.5"/>
                 <div className="text-[9px] text-orange-200 leading-tight">
                   High chunk counts ( &gt; 100 ) per fracture level will severely impact runtime physics performance. Use Level of Detail (LOD) for distant destructibles.
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
