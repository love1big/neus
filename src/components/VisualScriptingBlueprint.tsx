import React, { useState } from 'react';
import { GitMerge, Settings, Play, Target, Share2, Layers, ZoomIn, ZoomOut, Save } from 'lucide-react';

export default function VisualScriptingBlueprint() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-1.5 rounded-lg shadow-lg">
            <GitMerge size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Visual <span className="text-cyan-400">Scripting</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Node-Based Logic Graph</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-gray-300 px-3 py-1.5 rounded text-xs font-bold transition-colors">
             <Save size={14} /> COMPILE
           </button>
           <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-[0_0_10px_rgba(6,182,212,0.4)]">
             <Play size={14} /> SIMULATE
           </button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* Graph Area */}
        <div className="flex-1 bg-[#121212] relative overflow-hidden flex items-center justify-center" style={{
            backgroundImage: `linear-gradient(rgba(62, 62, 66, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(62, 62, 66, 0.4) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
        }}>
           <div className="absolute top-4 left-4 flex gap-2">
              <button className="bg-[#252526] border border-[#3e3e42] p-1.5 rounded text-gray-400 hover:text-white"><ZoomIn size={16}/></button>
              <button className="bg-[#252526] border border-[#3e3e42] p-1.5 rounded text-gray-400 hover:text-white"><ZoomOut size={16}/></button>
           </div>
           
           {/* Mock Nodes */}
           <div className="absolute left-[20%] top-[30%] w-48 bg-[#252526] border border-red-500 rounded-lg shadow-xl flex flex-col">
              <div className="bg-red-900/50 p-2 border-b border-red-500/50 rounded-t-lg flex items-center gap-2 text-xs font-bold text-red-100">
                 <Play size={12} className="text-red-400"/> Event BeginPlay
              </div>
              <div className="p-2 space-y-2">
                 <div className="flex justify-between items-center text-[10px]">
                    <div className="w-3 h-3 border border-gray-500 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div></div>
                    <span className="text-gray-300">Exec</span>
                 </div>
              </div>
           </div>

           <div className="absolute left-[50%] top-[40%] w-56 bg-[#252526] border border-blue-500 rounded-lg shadow-xl flex flex-col">
              <div className="bg-blue-900/50 p-2 border-b border-blue-500/50 rounded-t-lg flex items-center gap-2 text-xs font-bold text-blue-100">
                 <Target size={12} className="text-blue-400"/> Spawn Actor
              </div>
              <div className="p-2 space-y-2">
                 <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-300 flex items-center gap-1"><div className="w-3 h-3 border border-gray-500 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div> In</span>
                    <span className="text-gray-300 flex items-center gap-1">Out <div className="w-3 h-3 border border-gray-500 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div></span>
                 </div>
                 <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 flex items-center gap-1"><div className="w-3 h-3 border border-yellow-500 rounded-full bg-yellow-900/50"></div> Class</span>
                    <span className="text-gray-400 flex items-center gap-1">Return <div className="w-3 h-3 border border-blue-500 rounded-full bg-blue-900/50"></div></span>
                 </div>
                 <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 flex items-center gap-1"><div className="w-3 h-3 border border-orange-500 rounded-full bg-orange-900/50"></div> Transform</span>
                 </div>
              </div>
           </div>
           
           {/* Connecting Line (mock) */}
           <svg className="absolute inset-0 pointer-events-none w-full h-full">
              <path d="M 330 250 C 400 250, 400 350, 480 350" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]" />
           </svg>
        </div>
        
        {/* Right Panel */}
        <div className="w-72 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Details</h3>
           </div>
           <div className="p-4 space-y-4">
              <div className="space-y-2">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase">Variables</h4>
                 <div className="flex items-center gap-2 text-[10px] bg-[#1a1a1c] border border-[#3e3e42] p-1.5 rounded">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div> <span>Health (Float)</span>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] bg-[#1a1a1c] border border-[#3e3e42] p-1.5 rounded">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> <span>TargetActor (Object)</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
