import React, { useState } from "react";
import { Network, Play, Save, Settings, Plus, Code2, Download, Upload, ZoomIn, ZoomOut, Maximize, AlertCircle } from "lucide-react";

export default function VisualScriptEditor() {
  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200">
      {/* Node Palette */}
      <div className="w-[260px] border-r border-[#2a2b3d] flex flex-col bg-[#141525] shrink-0">
        <div className="p-3 border-b border-[#2a2b3d] shrink-0">
          <h2 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider mb-3">
            <Network size={16} className="text-blue-400" />
            Visual Scripts
          </h2>
          <input 
            type="text" 
            placeholder="Search nodes..." 
            className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 hide-scrollbar">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide px-1">Events</div>
              <div className="space-y-1">
                <NodeTemplate name="On Start" color="bg-red-500/20 border-red-500/50 text-red-200" />
                <NodeTemplate name="On Update" color="bg-red-500/20 border-red-500/50 text-red-200" />
                <NodeTemplate name="On Collision Enter" color="bg-red-500/20 border-red-500/50 text-red-200" />
              </div>
            </div>
            
            <div>
              <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide px-1">Math</div>
              <div className="space-y-1">
                <NodeTemplate name="Add (Float)" color="bg-blue-500/20 border-blue-500/50 text-blue-200" />
                <NodeTemplate name="Multiply (Vector3)" color="bg-blue-500/20 border-blue-500/50 text-blue-200" />
                <NodeTemplate name="Lerp" color="bg-blue-500/20 border-blue-500/50 text-blue-200" />
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide px-1">Actions</div>
              <div className="space-y-1">
                <NodeTemplate name="Set Position" color="bg-green-500/20 border-green-500/50 text-green-200" />
                <NodeTemplate name="Apply Force" color="bg-green-500/20 border-green-500/50 text-green-200" />
                <NodeTemplate name="Play Sound" color="bg-green-500/20 border-green-500/50 text-green-200" />
                <NodeTemplate name="Instantiate" color="bg-green-500/20 border-green-500/50 text-green-200" />
                <NodeTemplate name="Destroy" color="bg-green-500/20 border-green-500/50 text-green-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Toolbar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-[#141525]/80 backdrop-blur-sm border-b border-[#2a2b3d] z-20 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-gray-300">PlayerController.vs</span>
            <div className="h-4 w-px bg-gray-700" />
            <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
              <Save size={14} /> Save
            </button>
            <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
              <Code2 size={14} /> Compile
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2b3d] rounded"><ZoomOut size={16} /></button>
            <span className="text-xs font-mono text-gray-500">100%</span>
            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2b3d] rounded"><ZoomIn size={16} /></button>
            <div className="h-4 w-px bg-gray-700 mx-1" />
            <button className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 text-green-400 border border-green-600/50 rounded hover:bg-green-600/30 transition-colors text-xs font-bold uppercase tracking-wider">
              <Play size={14} /> Run Script
            </button>
          </div>
        </div>

        {/* Node Graph Background */}
        <div className="flex-1 bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(#2a2b3d 1px, transparent 1px)', 
            backgroundSize: '24px 24px',
            opacity: 0.5
          }} />

          {/* Example Nodes placed on canvas */}
          <div className="relative w-full h-full">
            {/* Event Node */}
            <div className="absolute top-[120px] left-[100px] w-48 bg-[#141525] border border-red-500/50 rounded-lg shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-red-500/20 px-3 py-2 border-b border-red-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-red-200">On Update</span>
                <Settings size={12} className="text-red-400/50" />
              </div>
              <div className="p-3 flex flex-col gap-2 relative">
                <div className="flex justify-end items-center">
                  <span className="text-[10px] text-gray-400 mr-2">Out</span>
                  <div className="w-3 h-3 rounded-full border-2 border-red-400 bg-[#0a0a0f] -mr-4 z-10" />
                </div>
                <div className="flex justify-end items-center mt-2">
                  <span className="text-[10px] text-gray-400 mr-2">Delta Time</span>
                  <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-[#0a0a0f] -mr-4 z-10" />
                </div>
              </div>
            </div>

            {/* Action Node */}
            <div className="absolute top-[120px] left-[380px] w-48 bg-[#141525] border border-green-500/50 rounded-lg shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-green-500/20 px-3 py-2 border-b border-green-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-green-200">Set Position</span>
                <Settings size={12} className="text-green-400/50" />
              </div>
              <div className="p-3 flex flex-col gap-2 relative">
                <div className="flex justify-between items-center">
                  <div className="w-3 h-3 rounded-full border-2 border-red-400 bg-[#0a0a0f] -ml-4 z-10" />
                  <span className="text-[10px] text-gray-400 ml-2">In</span>
                  <span className="text-[10px] text-gray-400 mr-2">Out</span>
                  <div className="w-3 h-3 rounded-full border-2 border-red-400 bg-[#0a0a0f] -mr-4 z-10" />
                </div>
                
                <div className="flex items-center mt-2">
                  <div className="w-3 h-3 rounded-full border-2 border-yellow-400 bg-[#0a0a0f] -ml-4 z-10" />
                  <span className="text-[10px] text-gray-400 ml-2">Target (Object)</span>
                </div>
                
                <div className="flex items-center mt-2">
                  <div className="w-3 h-3 rounded-full border-2 border-purple-400 bg-[#0a0a0f] -ml-4 z-10" />
                  <span className="text-[10px] text-gray-400 ml-2">Vector3</span>
                </div>
              </div>
            </div>

            {/* SVG Line connecting them */}
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
              <path 
                d="M 292 147 C 336 147 336 147 380 147" 
                fill="none" 
                stroke="#f87171" 
                strokeWidth="3"
                className="opacity-60"
              />
            </svg>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <div className="bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs px-3 py-1.5 rounded flex items-center gap-2">
              <AlertCircle size={14} /> 1 Warning: Unused output 'Delta Time'
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NodeTemplate({ name, color }: { name: string, color: string }) {
  return (
    <div className={`border rounded px-2 py-1.5 text-xs font-medium cursor-grab active:cursor-grabbing hover:brightness-110 transition-all ${color}`}>
      {name}
    </div>
  );
}
