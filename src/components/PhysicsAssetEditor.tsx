import React, { useState } from 'react';
import { Bone, Activity, Settings, Maximize, Orbit, ZoomIn, ZoomOut, Save, ShieldAlert, Cpu } from 'lucide-react';

export default function PhysicsAssetEditor() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-600 to-rose-800 p-1.5 rounded-lg shadow-lg">
            <Bone size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Physics <span className="text-red-400">Asset Editor</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Ragdolls & Collision Hulls</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="bg-[#333] hover:bg-[#444] px-3 py-1.5 rounded text-[10px] font-bold text-gray-300 transition-colors flex items-center gap-2">
             <Save size={14}/> SAVE ASSET
           </button>
           <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded text-[10px] font-bold transition-colors shadow-[0_0_10px_rgba(220,38,38,0.4)]">
             <Activity size={14}/> SIMULATE RAGDOLL
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Tree */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Skeleton Tree</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar text-[10px]">
             
             {/* Skeleton Mock */}
             <div className="flex items-center gap-2 py-1 px-2 hover:bg-[#333] rounded cursor-pointer">
               <Bone size={12} className="text-gray-500"/> root
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-4 bg-[#333] rounded cursor-pointer border border-[#3e3e42]">
               <Bone size={12} className="text-red-400"/> pelvis (Selected)
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-8 hover:bg-[#333] rounded cursor-pointer">
               <Bone size={12} className="text-gray-500"/> spine_01
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-12 hover:bg-[#333] rounded cursor-pointer">
               <Bone size={12} className="text-gray-500"/> spine_02
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-16 hover:bg-[#333] rounded cursor-pointer">
               <Bone size={12} className="text-gray-500"/> spine_03
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-20 hover:bg-[#333] rounded cursor-pointer">
               <Bone size={12} className="text-gray-500"/> neck_01
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-24 hover:bg-[#333] rounded cursor-pointer">
               <Bone size={12} className="text-gray-500"/> head
             </div>
             
             <div className="flex items-center gap-2 py-1 px-2 ml-8 hover:bg-[#333] rounded cursor-pointer">
               <Bone size={12} className="text-gray-500"/> thigh_l
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-12 hover:bg-[#333] rounded cursor-pointer">
               <Bone size={12} className="text-gray-500"/> calf_l
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-16 hover:bg-[#333] rounded cursor-pointer">
               <Bone size={12} className="text-gray-500"/> foot_l
             </div>

             <div className="flex items-center gap-2 py-1 px-2 ml-8 hover:bg-[#333] rounded cursor-pointer">
               <Bone size={12} className="text-gray-500"/> thigh_r
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-12 hover:bg-[#333] rounded cursor-pointer">
               <Bone size={12} className="text-gray-500"/> calf_r
             </div>
             <div className="flex items-center gap-2 py-1 px-2 ml-16 hover:bg-[#333] rounded cursor-pointer">
               <Bone size={12} className="text-gray-500"/> foot_r
             </div>

          </div>
        </div>

        {/* Center Viewport */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
           
           <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 mix-blend-overlay"></div>
           
           <div className="absolute top-4 left-4 flex gap-2 z-20">
             <button className="bg-[#252526] border border-[#3e3e42] p-1.5 rounded text-gray-400 hover:text-white"><ZoomIn size={16}/></button>
             <button className="bg-[#252526] border border-[#3e3e42] p-1.5 rounded text-gray-400 hover:text-white"><ZoomOut size={16}/></button>
           </div>
           
           {/* Fake 3D Skeleton + Colliders */}
           <div className="relative z-10 w-48 h-96 flex flex-col items-center">
              
              {/* Head collider */}
              <div className="w-16 h-20 border-2 border-green-500 rounded-full bg-green-900/30 shadow-[0_0_15px_rgba(34,197,94,0.3)] mb-2 flex items-center justify-center">
                 <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              
              {/* Torso colliders */}
              <div className="w-20 h-16 border-2 border-green-500 rounded-xl bg-green-900/30 shadow-[0_0_15px_rgba(34,197,94,0.3)] mb-1 flex items-center justify-center"></div>
              <div className="w-18 h-16 border-2 border-green-500 rounded-xl bg-green-900/30 shadow-[0_0_15px_rgba(34,197,94,0.3)] mb-1 flex items-center justify-center"></div>
              
              {/* Pelvis collider (Selected) */}
              <div className="w-24 h-16 border-2 border-red-500 rounded-2xl bg-red-900/50 shadow-[0_0_20px_rgba(239,68,68,0.5)] mb-2 relative flex items-center justify-center">
                 
                 {/* Widget */}
                 <div className="absolute w-20 h-20 rounded-full border border-blue-500/50 rotate-45 pointer-events-none"></div>
                 <div className="absolute w-20 h-20 rounded-full border border-red-500/50 rotate-0 pointer-events-none transform -skew-x-12"></div>
                 <div className="absolute w-20 h-20 rounded-full border border-green-500/50 rotate-90 pointer-events-none transform skew-y-12"></div>
                 
                 <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>

              {/* Legs */}
              <div className="flex gap-4 w-full justify-center">
                 <div className="flex flex-col items-center gap-1">
                   <div className="w-8 h-24 border-2 border-green-500 rounded-full bg-green-900/30 shadow-[0_0_15px_rgba(34,197,94,0.3)] transform -rotate-[10deg] origin-top"></div>
                   <div className="w-6 h-20 border-2 border-green-500 rounded-full bg-green-900/30 shadow-[0_0_15px_rgba(34,197,94,0.3)] transform -rotate-[5deg] origin-top"></div>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                   <div className="w-8 h-24 border-2 border-green-500 rounded-full bg-green-900/30 shadow-[0_0_15px_rgba(34,197,94,0.3)] transform rotate-[10deg] origin-top"></div>
                   <div className="w-6 h-20 border-2 border-green-500 rounded-full bg-green-900/30 shadow-[0_0_15px_rgba(34,197,94,0.3)] transform rotate-[5deg] origin-top"></div>
                 </div>
              </div>

           </div>
           
           <div className="absolute bottom-4 right-4 bg-[#1a1a1c]/80 backdrop-blur border border-[#3e3e42] p-2 rounded text-[9px] font-mono text-gray-300">
             Physics Engine: <span className="text-red-400">Chaos Physics</span>
           </div>
        </div>

        {/* Right Properties */}
        <div className="w-72 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Cpu size={14}/> Body Settings</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              
              <div className="bg-[#1a1a1c] border border-red-500/50 p-3 rounded">
                 <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Selected Body</div>
                 <div className="text-sm font-bold text-white">pelvis</div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Collision Geometry</h4>
                 <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Shape</span>
                      <select className="bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-gray-200 outline-none w-24">
                        <option>Capsule</option>
                        <option>Sphere</option>
                        <option>Box</option>
                        <option>Convex Hull</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Radius</span>
                      <input type="number" defaultValue="14.2" className="w-20 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-white text-center focus:border-red-500 outline-none" />
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Height</span>
                      <input type="number" defaultValue="25.0" className="w-20 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-white text-center focus:border-red-500 outline-none" />
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Physical Material</h4>
                 <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Mass (kg)</span>
                      <input type="number" defaultValue="25.0" className="w-20 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-white text-center focus:border-red-500 outline-none" />
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Linear Damping</span>
                      <input type="number" defaultValue="0.01" className="w-20 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-white text-center focus:border-red-500 outline-none" />
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Angular Damping</span>
                      <input type="number" defaultValue="0.0" className="w-20 bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-white text-center focus:border-red-500 outline-none" />
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Constraints</h4>
                 <div className="space-y-2 text-[10px] text-gray-300">
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={12} className="text-yellow-400"/>
                      <span>Parent: root</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Linear Limits</span>
                      <span className="text-white">Locked</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Angular Limits</span>
                      <span className="text-white">Limited</span>
                    </div>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
