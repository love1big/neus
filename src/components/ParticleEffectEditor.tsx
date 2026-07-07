import React, { useState } from "react";
import { Sparkles, Play, Square, Settings, Sliders, Palette, Wind, Layers, Plus, RotateCcw } from "lucide-react";

export default function ParticleEffectEditor() {
  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200">
      {/* Settings Panel */}
      <div className="w-[300px] border-r border-[#2a2b3d] flex flex-col bg-[#141525] shrink-0">
        <div className="p-3 border-b border-[#2a2b3d] shrink-0">
          <h2 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider mb-2">
            <Sparkles size={16} className="text-pink-400" />
            Particle Designer
          </h2>
          <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded px-2 py-1.5 text-xs text-white outline-none">
            <option>Fireball_Explosion.vfx</option>
            <option>Magic_Aura.vfx</option>
            <option>Rain_Heavy.vfx</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar p-2">
          {/* Emitter Settings */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 px-1 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              <Settings size={12} /> Emitter
            </div>
            <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Rate (p/s)</span>
                <input type="text" className="w-16 bg-[#141525] border border-[#2a2b3d] rounded px-1.5 py-1 text-right text-xs" defaultValue="50" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Duration</span>
                <input type="text" className="w-16 bg-[#141525] border border-[#2a2b3d] rounded px-1.5 py-1 text-right text-xs" defaultValue="2.5s" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Looping</span>
                <input type="checkbox" defaultChecked className="accent-pink-500" />
              </div>
            </div>
          </div>

          {/* Shape & Physics */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 px-1 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              <Wind size={12} /> Dynamics
            </div>
            <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Shape</span>
                <select className="w-24 bg-[#141525] border border-[#2a2b3d] rounded px-1.5 py-1 text-xs">
                  <option>Sphere</option>
                  <option>Cone</option>
                  <option>Box</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Start Velocity</span>
                  <span>10.0</span>
                </div>
                <input type="range" className="w-full accent-pink-500" min="0" max="100" defaultValue="10" />
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Gravity</span>
                  <span>-9.8</span>
                </div>
                <input type="range" className="w-full accent-pink-500" min="-20" max="20" defaultValue="-9.8" />
              </div>
            </div>
          </div>

          {/* Rendering */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 px-1 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              <Palette size={12} /> Appearance
            </div>
            <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Material</span>
                <button className="text-xs bg-[#141525] border border-[#2a2b3d] rounded px-2 py-1">Select...</button>
              </div>
              <div>
                <span className="text-xs text-gray-400 mb-1 block">Color over Lifetime</span>
                <div className="h-6 w-full rounded bg-gradient-to-r from-yellow-200 via-orange-500 to-transparent border border-[#2a2b3d]" />
              </div>
              <div>
                <span className="text-xs text-gray-400 mb-1 block">Size over Lifetime</span>
                <svg className="w-full h-12 bg-[#141525] border border-[#2a2b3d] rounded">
                  <path d="M 0 48 Q 50 0 100 48" fill="none" stroke="#f472b6" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Viewport */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#1a1a24] to-[#050508]">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-[#141525]/80 backdrop-blur-sm border-b border-[#2a2b3d] z-20 flex items-center justify-between px-4">
           <div className="flex items-center gap-2">
             <button className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"><Play size={14} /></button>
             <button className="p-1.5 text-red-400 hover:bg-[#2a2b3d] rounded transition-colors"><Square size={14} /></button>
             <button className="p-1.5 text-blue-400 hover:bg-[#2a2b3d] rounded transition-colors"><RotateCcw size={14} /></button>
           </div>
           
           <div className="flex items-center gap-3">
             <span className="text-[10px] text-gray-500 font-mono">Particles: 1,024</span>
             <span className="text-[10px] text-gray-500 font-mono">Sim Time: 1.2s</span>
           </div>
        </div>

        {/* 3D Simulation Canvas */}
        <div className="flex-1 flex items-center justify-center relative">
           {/* Center Grid */}
           <div className="w-64 h-64 border border-white/5 rounded-full absolute" style={{ transform: 'rotateX(60deg)' }} />
           <div className="w-32 h-32 border border-white/10 rounded-full absolute" style={{ transform: 'rotateX(60deg)' }} />
           
           {/* Simulated Particles */}
           <div className="relative">
              <div className="w-4 h-4 bg-yellow-100 rounded-full blur-[2px] absolute -top-10 -left-5 animate-pulse" />
              <div className="w-6 h-6 bg-orange-400 rounded-full blur-[4px] absolute -top-20 left-10 opacity-80" />
              <div className="w-3 h-3 bg-red-500 rounded-full blur-[1px] absolute -top-32 -left-12 opacity-60" />
              <div className="w-8 h-8 bg-orange-500/50 rounded-full blur-[8px] absolute top-0 left-0 animate-ping" />
              <div className="w-20 h-20 bg-orange-600/20 rounded-full blur-[12px] absolute -top-10 -left-10" />
              <Sparkles size={32} className="text-yellow-300 absolute -top-16 left-2 animate-bounce" />
           </div>

           <div className="absolute bottom-6 text-center w-full">
             <p className="text-gray-500 text-xs tracking-widest uppercase">Live Simulation Preview</p>
           </div>
        </div>
      </div>
    </div>
  );
}
