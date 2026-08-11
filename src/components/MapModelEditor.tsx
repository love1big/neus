import React, { useState } from 'react';
import { Box, Layers, Play, Bone, ShieldAlert, Cpu, Settings2, Sliders, Hash, Image as ImageIcon, Zap, Activity, Grid, Move3d, Network, Scissors, Brush, ScissorsSquare, Maximize, EyeOff, LayoutGrid, Target } from 'lucide-react';

export default function MapModelEditor() {
  const [activeSubTab, setActiveSubTab] = useState('geometry');
  
  const subTabs = [
    { id: 'geometry', icon: <Box size={18} />, label: 'Geometry & LODs' },
    { id: 'materials', icon: <ImageIcon size={18} />, label: 'PBR Materials' },
    { id: 'nodes', icon: <Network size={18} />, label: 'Shader Node Editor' },
    { id: 'uv', icon: <LayoutGrid size={18} />, label: 'UV Mapping & Layout' },
    { id: 'vertex', icon: <Brush size={18} />, label: 'Vertex Paint & Weights' },
    { id: 'boolean', icon: <ScissorsSquare size={18} />, label: 'Boolean Sculpting' },
    { id: 'collision', icon: <ShieldAlert size={18} />, label: 'Collision & Bounds' },
    { id: 'rigging', icon: <Bone size={18} />, label: 'Rigging & Sockets' },
    { id: 'animation', icon: <Play size={18} />, label: 'Animation States' },
    { id: 'events', icon: <Zap size={18} />, label: 'Anim Notifies' },
    { id: 'tags', icon: <Hash size={18} />, label: 'Tags & Data Links' },
  ];

  return (
    <div className="flex-1 h-full bg-[#11111b] flex text-white overflow-hidden">
      
      {/* Left Toolbar - SubTabs */}
      <div className="w-16 bg-[#161621] border-r border-[#2a2b3d] flex flex-col items-center py-4 gap-3 shrink-0 overflow-y-auto custom-scrollbar">
         {subTabs.map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveSubTab(tab.id)}
               className={`w-12 h-12 shrink-0 rounded flex items-center justify-center transition-all ${
                  activeSubTab === tab.id ? 'bg-[#ff69b4]/20 text-[#ff69b4] border border-[#ff69b4]' : 'text-gray-400 hover:text-white hover:bg-[#2a2b3d]'
               }`}
               title={tab.label}
            >
               {tab.icon}
            </button>
         ))}
      </div>

      {/* Properties Panel */}
      <div className="w-[400px] bg-[#161621] border-r border-[#2a2b3d] flex flex-col shrink-0">
         <div className="p-4 border-b border-[#2a2b3d]">
            <h2 className="font-bold text-[#ff69b4] flex items-center gap-2 text-lg">
               <Move3d size={20} /> 3D Model Editor
            </h2>
            <p className="text-xs text-gray-400 mt-1">Deep manual inspection and modification of mesh assets.</p>
         </div>

         <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            
            {activeSubTab === 'geometry' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Mesh Statistics</h3>
                     <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-3 grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="text-gray-400">Vertices: <span className="text-white">24,512</span></div>
                        <div className="text-gray-400">Triangles: <span className="text-white">48,102</span></div>
                        <div className="text-gray-400">UV Channels: <span className="text-white">2</span></div>
                        <div className="text-gray-400">Materials: <span className="text-white">3</span></div>
                     </div>
                  </div>

                  <div>
                     <h3 className="text-xs font-bold text-[#ff69b4] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">LOD Settings (Level of Detail)</h3>
                     <div className="space-y-3">
                        <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-white">LOD 0 (Base)</span>
                              <span className="text-[10px] bg-[#3fb950]/20 text-[#3fb950] px-1 rounded">Active</span>
                           </div>
                           <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                              <span>Screen Size</span>
                              <span className="text-white font-mono">1.0 - 0.5</span>
                           </div>
                           <input type="range" min="0" max="100" defaultValue="50" className="w-full accent-[#ff69b4]" />
                        </div>
                        <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded opacity-70">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-white">LOD 1</span>
                              <span className="text-[10px] text-gray-400">Triangles: 12,400</span>
                           </div>
                           <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                              <span>Screen Size</span>
                              <span className="text-white font-mono">0.5 - 0.1</span>
                           </div>
                           <input type="range" min="0" max="100" defaultValue="10" className="w-full accent-[#ff69b4]" />
                        </div>
                        <button className="w-full bg-[#2a2b3d] hover:bg-[#3b3d54] border border-[#2a2b3d] text-xs py-2 rounded text-white flex items-center justify-center gap-2">
                           <Settings2 size={14} /> Manually Import Custom LOD
                        </button>
                     </div>
                  </div>
                  
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Normals & Tangents</h3>
                     <div className="space-y-2 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" defaultChecked className="accent-[#ff69b4] w-3 h-3" />
                           <span className="text-gray-400 group-hover:text-white transition">Auto-Compute Tangents</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" className="accent-[#ff69b4] w-3 h-3" />
                           <span className="text-gray-400 group-hover:text-white transition">Flip Green Channel (OpenGL Normal)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" className="accent-[#ff69b4] w-3 h-3" />
                           <span className="text-gray-400 group-hover:text-white transition">Two-Sided Geometry</span>
                        </label>
                     </div>
                  </div>
               </div>
            )}
            
            {activeSubTab === 'materials' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#ff69b4] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Material Slots</h3>
                     <div className="flex flex-col gap-2">
                        <div className="bg-[#ff69b4]/10 border border-[#ff69b4]/50 p-2 rounded cursor-pointer">
                           <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-[#ff69b4]">Mat_Armor_Plates</span>
                              <span className="text-[10px] text-gray-400">Slot 0</span>
                           </div>
                        </div>
                        <div className="bg-[#0a0a0f] border border-[#2a2b3d] hover:border-gray-500 p-2 rounded cursor-pointer transition-colors">
                           <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white">Mat_Leather_Straps</span>
                              <span className="text-[10px] text-gray-400">Slot 1</span>
                           </div>
                        </div>
                        <div className="bg-[#0a0a0f] border border-[#2a2b3d] hover:border-gray-500 p-2 rounded cursor-pointer transition-colors">
                           <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white">Mat_Glow_Visor</span>
                              <span className="text-[10px] text-gray-400">Slot 2</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Texture Maps (Mat_Armor_Plates)</h3>
                     <div className="space-y-3">
                        {['Albedo / Base Color', 'Normal Map', 'ORM (Occlusion/Roughness/Metallic)', 'Emissive'].map((map, i) => (
                           <div key={i} className="flex items-center gap-3 bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded">
                              <div className="w-10 h-10 bg-[#0a0a0f] border border-[#2a2b3d] rounded flex items-center justify-center shrink-0 overflow-hidden relative group cursor-pointer">
                                 <ImageIcon size={14} className="text-gray-500" />
                                 <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                                    <span className="text-[8px] font-bold">CHANGE</span>
                                 </div>
                              </div>
                              <div className="flex-1">
                                 <div className="text-[10px] font-bold text-white">{map}</div>
                                 <div className="text-[9px] text-gray-400 font-mono mt-0.5">T_{map.split(' ')[0]}_01.png</div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Shader Parameters</h3>
                     <div className="space-y-3">
                        <div>
                           <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Roughness Multiplier</span>
                              <span className="text-white font-mono">1.2</span>
                           </div>
                           <input type="range" min="0" max="200" defaultValue="120" className="w-full accent-[#ff69b4]" />
                        </div>
                        <div>
                           <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Metallic Multiplier</span>
                              <span className="text-white font-mono">0.8</span>
                           </div>
                           <input type="range" min="0" max="200" defaultValue="80" className="w-full accent-[#ff69b4]" />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer group mt-2">
                           <input type="checkbox" className="accent-[#ff69b4] w-3 h-3" />
                           <span className="text-xs text-gray-400 group-hover:text-white transition">Enable Subsurface Scattering</span>
                        </label>
                     </div>
                  </div>
               </div>
            )}
            
            {activeSubTab === 'nodes' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#ff69b4] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Shader Graph Editor</h3>
                     <p className="text-[10px] text-gray-400 mb-4">Visually program shaders using node-based logic networks.</p>
                     
                     <div className="flex flex-col gap-2">
                        <button className="w-full bg-[#ff69b4]/20 hover:bg-[#ff69b4]/30 text-[#ff69b4] border border-[#ff69b4]/50 py-2 rounded text-xs font-bold transition-colors flex items-center justify-center gap-2">
                           <Network size={14} /> Open Full Graph Window
                        </button>
                        <button className="w-full bg-[#1e1e2d] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] py-2 rounded text-xs transition-colors flex items-center justify-center gap-2">
                           <Settings2 size={14} /> Compile Shader Graph
                        </button>
                     </div>
                  </div>
                  
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Common Node Additions</h3>
                     <div className="grid grid-cols-2 gap-2 text-xs">
                        <button className="bg-[#0a0a0f] border border-[#2a2b3d] p-2 rounded text-gray-400 hover:text-white hover:border-gray-500 text-left">
                           + Texture Sample
                        </button>
                        <button className="bg-[#0a0a0f] border border-[#2a2b3d] p-2 rounded text-gray-400 hover:text-white hover:border-gray-500 text-left">
                           + Multiply / Add
                        </button>
                        <button className="bg-[#0a0a0f] border border-[#2a2b3d] p-2 rounded text-gray-400 hover:text-white hover:border-gray-500 text-left">
                           + Lerp / Blend
                        </button>
                        <button className="bg-[#0a0a0f] border border-[#2a2b3d] p-2 rounded text-gray-400 hover:text-white hover:border-gray-500 text-left">
                           + Fresnal Effect
                        </button>
                        <button className="bg-[#0a0a0f] border border-[#2a2b3d] p-2 rounded text-gray-400 hover:text-white hover:border-gray-500 text-left">
                           + Noise Pattern
                        </button>
                        <button className="bg-[#0a0a0f] border border-[#2a2b3d] p-2 rounded text-gray-400 hover:text-white hover:border-gray-500 text-left">
                           + Time Variable
                        </button>
                     </div>
                  </div>
               </div>
            )}
            
            {activeSubTab === 'uv' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#ff69b4] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">UV Channels</h3>
                     <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] text-white text-xs p-2 rounded mb-2">
                        <option>UV Channel 0 (Albedo/Normal)</option>
                        <option>UV Channel 1 (Lightmap)</option>
                        <option>UV Channel 2 (Detail Masks)</option>
                     </select>
                     <button className="w-full bg-[#1e1e2d] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] py-1.5 rounded text-[10px] transition-colors">
                        + Generate Lightmap UVs
                     </button>
                  </div>
                  
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">UV Layout Tools</h3>
                     <div className="space-y-2">
                        <button className="w-full bg-[#0a0a0f] hover:bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded text-xs text-left flex justify-between items-center text-gray-300">
                           <span>Auto-Unwrap (Smart Project)</span>
                           <Maximize size={12} className="text-[#ff69b4]" />
                        </button>
                        <button className="w-full bg-[#0a0a0f] hover:bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded text-xs text-left flex justify-between items-center text-gray-300">
                           <span>Pack UV Islands</span>
                           <Box size={12} className="text-[#ff69b4]" />
                        </button>
                        <button className="w-full bg-[#0a0a0f] hover:bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded text-xs text-left flex justify-between items-center text-gray-300">
                           <span>Mark Seams</span>
                           <Scissors size={12} className="text-[#ff69b4]" />
                        </button>
                     </div>
                  </div>
               </div>
            )}
            
            {activeSubTab === 'vertex' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#ff69b4] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Vertex Paint Tools</h3>
                     
                     <div className="grid grid-cols-2 gap-2 mb-4">
                        <button className="bg-[#ff69b4]/20 border border-[#ff69b4]/50 p-2 rounded text-xs text-[#ff69b4] font-bold text-center">
                           Paint Weight
                        </button>
                        <button className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded text-xs text-gray-400 hover:text-white text-center">
                           Paint Color
                        </button>
                        <button className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded text-xs text-gray-400 hover:text-white text-center">
                           Smooth
                        </button>
                        <button className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded text-xs text-gray-400 hover:text-white text-center">
                           Erase
                        </button>
                     </div>
                     
                     <div className="space-y-3">
                        <div>
                           <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Brush Size</span> <span className="text-white font-mono">15</span></label>
                           <input type="range" min="1" max="100" defaultValue="15" className="w-full accent-[#ff69b4]" />
                        </div>
                        <div>
                           <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Brush Strength</span> <span className="text-white font-mono">0.5</span></label>
                           <input type="range" min="0" max="100" defaultValue="50" className="w-full accent-[#ff69b4]" />
                        </div>
                     </div>
                  </div>
                  
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Target Bone / Group</h3>
                     <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] text-white text-xs p-2 rounded mb-2">
                        <option>Thigh_L</option>
                        <option>Calf_L</option>
                        <option>Foot_L</option>
                        <option>Pelvis</option>
                     </select>
                  </div>
               </div>
            )}
            
            {activeSubTab === 'boolean' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#ff69b4] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Boolean Operations</h3>
                     <p className="text-[10px] text-gray-400 mb-4">Constructive solid geometry. Subtract, intersect, or merge meshes.</p>
                     
                     <div className="space-y-2">
                        <div className="flex gap-2">
                           <select className="flex-1 bg-[#0a0a0f] border border-[#2a2b3d] text-white text-xs p-2 rounded">
                              <option>SM_Cube_Cutter_01</option>
                              <option>SM_Sphere_02</option>
                           </select>
                           <button className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded text-gray-400 hover:text-white" title="Pick Mesh from Scene">
                              <Target size={14} />
                           </button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-bold">
                           <button className="bg-[#ff69b4]/10 border border-[#ff69b4]/30 hover:border-[#ff69b4] text-[#ff69b4] py-2 rounded text-center">
                              Difference
                           </button>
                           <button className="bg-[#1e1e2d] border border-[#2a2b3d] hover:border-white text-white py-2 rounded text-center">
                              Union
                           </button>
                           <button className="bg-[#1e1e2d] border border-[#2a2b3d] hover:border-white text-white py-2 rounded text-center">
                              Intersect
                           </button>
                        </div>
                     </div>
                     <button className="w-full mt-4 bg-[#ff69b4] hover:bg-[#ff69b4]/80 text-[#0a0a0f] py-2 rounded text-xs font-bold transition-colors">
                        Apply Boolean
                     </button>
                  </div>
                  
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Mesh Cleanup</h3>
                     <div className="space-y-2">
                        <button className="w-full bg-[#1e1e2d] hover:bg-[#2a2b3d] border border-[#2a2b3d] p-2 rounded text-xs text-left text-gray-300">
                           Merge Vertices by Distance (0.001m)
                        </button>
                        <button className="w-full bg-[#1e1e2d] hover:bg-[#2a2b3d] border border-[#2a2b3d] p-2 rounded text-xs text-left text-gray-300">
                           Triangulate N-Gons
                        </button>
                     </div>
                  </div>
               </div>
            )}
            
            {activeSubTab === 'collision' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#ff69b4] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Collision Primitives</h3>
                     
                     <div className="flex flex-col gap-2 mb-4">
                        <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] border border-[#2a2b3d] p-2 rounded text-xs text-white text-left flex justify-between items-center group">
                           <span>Capsule (Root)</span>
                           <span className="text-[10px] text-gray-500 group-hover:text-[#ff69b4]">Edit</span>
                        </button>
                        <button className="bg-[#ff69b4]/10 border border-[#ff69b4]/50 p-2 rounded text-xs text-[#ff69b4] text-left flex justify-between items-center">
                           <span>Box (Torso Hitbox)</span>
                           <span className="text-[10px] text-white">Active</span>
                        </button>
                        <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] border border-[#2a2b3d] border-dashed p-2 rounded text-xs text-gray-400 text-center hover:text-white">
                           + Add Collision Primitive
                        </button>
                     </div>
                  </div>
                  
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Box Properties</h3>
                     <div className="space-y-3">
                        <div>
                           <label className="text-[10px] text-gray-400 mb-1 block">Collision Channel</label>
                           <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-xs text-white">
                              <option>Hitbox (Takes Damage)</option>
                              <option>Hurtbox (Deals Damage)</option>
                              <option>BlockAll (Physics)</option>
                              <option>Overlap (Trigger)</option>
                           </select>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-2">
                           <div>
                              <label className="text-[10px] text-gray-400 block mb-1">Scale X</label>
                              <input type="number" defaultValue="45" className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1 text-xs text-white font-mono text-center" />
                           </div>
                           <div>
                              <label className="text-[10px] text-gray-400 block mb-1">Scale Y</label>
                              <input type="number" defaultValue="30" className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1 text-xs text-white font-mono text-center" />
                           </div>
                           <div>
                              <label className="text-[10px] text-gray-400 block mb-1">Scale Z</label>
                              <input type="number" defaultValue="60" className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1 text-xs text-white font-mono text-center" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1 mt-4">Physics Constraints</h3>
                     <div className="space-y-2 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" className="accent-[#ff69b4] w-3 h-3" />
                           <span className="text-gray-400 group-hover:text-white transition">Simulate Physics (Ragdoll)</span>
                        </label>
                        <div>
                           <div className="flex justify-between text-[10px] text-gray-400 mb-1 mt-2">
                              <span>Mass (kg)</span>
                              <span className="text-white font-mono">85.0</span>
                           </div>
                           <input type="range" min="1" max="500" defaultValue="85" className="w-full accent-[#ff69b4]" />
                        </div>
                     </div>
                  </div>
               </div>
            )}
            
            {activeSubTab === 'rigging' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#ff69b4] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Skeleton Tree</h3>
                     
                     <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-2 rounded h-48 overflow-y-auto custom-scrollbar font-mono text-[10px]">
                        <div className="text-white py-1">► Root</div>
                        <div className="text-gray-400 pl-4 py-1 border-l border-[#2a2b3d] ml-1">▼ Pelvis</div>
                        <div className="text-gray-400 pl-8 py-1 border-l border-[#2a2b3d] ml-5">► Thigh_L</div>
                        <div className="text-gray-400 pl-8 py-1 border-l border-[#2a2b3d] ml-5">► Thigh_R</div>
                        <div className="text-white bg-[#ff69b4]/20 pl-8 py-1 border-l border-[#2a2b3d] ml-5 font-bold">▼ Spine_01</div>
                        <div className="text-gray-400 pl-12 py-1 border-l border-[#2a2b3d] ml-9">► Spine_02</div>
                        <div className="text-gray-400 pl-16 py-1 border-l border-[#2a2b3d] ml-[52px]">► Neck</div>
                        <div className="text-gray-400 pl-16 py-1 border-l border-[#2a2b3d] ml-[52px]">► Clavicle_L</div>
                        <div className="text-gray-400 pl-16 py-1 border-l border-[#2a2b3d] ml-[52px]">► Clavicle_R</div>
                     </div>
                  </div>
                  
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Sockets (Attachment Points)</h3>
                     <div className="flex flex-col gap-2">
                        <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded flex justify-between items-center">
                           <div>
                              <div className="text-xs font-bold text-white">Weapon_R_Socket</div>
                              <div className="text-[9px] text-gray-400">Bone: Hand_R</div>
                           </div>
                           <button className="text-[10px] text-[#ff69b4] border border-[#ff69b4]/50 px-2 py-1 rounded">Edit</button>
                        </div>
                        <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded flex justify-between items-center">
                           <div>
                              <div className="text-xs font-bold text-white">Backpack_Socket</div>
                              <div className="text-[9px] text-gray-400">Bone: Spine_03</div>
                           </div>
                           <button className="text-[10px] text-gray-400 border border-[#2a2b3d] hover:border-gray-400 px-2 py-1 rounded">Edit</button>
                        </div>
                        <button className="bg-[#0a0a0f] border border-[#2a2b3d] border-dashed p-2 rounded text-xs text-gray-400 hover:text-white">
                           + Add Socket
                        </button>
                     </div>
                  </div>
               </div>
            )}
            
            {activeSubTab === 'animation' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#ff69b4] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Animation State Machine</h3>
                     <p className="text-[10px] text-gray-400 mb-4">Define manual transition rules between animation clips.</p>
                     
                     <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-3 rounded flex flex-col gap-2">
                        <div className="text-xs font-bold text-white mb-1">State: Locomotion</div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] text-gray-400 w-16">Blendspace</span>
                           <select className="flex-1 bg-[#1e1e2d] border border-[#2a2b3d] rounded p-1 text-[10px] text-white">
                              <option>BS_Idle_Walk_Run</option>
                           </select>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-[#2a2b3d]">
                           <div className="text-[10px] font-bold text-gray-400 mb-1">Transitions Out:</div>
                           <div className="bg-[#1e1e2d] p-2 rounded flex items-center justify-between">
                              <span className="text-[10px] text-white">-&gt; Jump_Start</span>
                              <span className="text-[9px] text-[#ff69b4]">If: IsInAir == true</span>
                           </div>
                           <div className="bg-[#1e1e2d] p-2 rounded flex items-center justify-between mt-1">
                              <span className="text-[10px] text-white">-&gt; Melee_Attack_01</span>
                              <span className="text-[9px] text-[#ff69b4]">If: TriggerAttack</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Root Motion</h3>
                     <div className="space-y-2 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" defaultChecked className="accent-[#ff69b4] w-3 h-3" />
                           <span className="text-gray-400 group-hover:text-white transition">Enable Root Motion</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" className="accent-[#ff69b4] w-3 h-3" />
                           <span className="text-gray-400 group-hover:text-white transition">Force Root Lock (Z Axis)</span>
                        </label>
                     </div>
                  </div>
               </div>
            )}
            
            {activeSubTab === 'tags' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#ff69b4] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Model Tags & Classifications</h3>
                     <p className="text-[10px] text-gray-400 mb-4">Assign gameplay tags and semantic categories for logic filtering.</p>
                     <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-[#1e1e2d] border border-[#ff69b4]/50 text-[#ff69b4] px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                           Enemy.Grunt <button className="text-gray-400 hover:text-white">×</button>
                        </span>
                        <span className="bg-[#1e1e2d] border border-[#2a2b3d] text-gray-300 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                           Material.Flesh <button className="text-gray-400 hover:text-white">×</button>
                        </span>
                        <span className="bg-[#1e1e2d] border border-[#2a2b3d] text-gray-300 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                           Targetable <button className="text-gray-400 hover:text-white">×</button>
                        </span>
                     </div>
                     <div className="flex gap-2">
                        <input type="text" placeholder="Add Tag (e.g. Weapon.Melee)" className="flex-1 bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-white" />
                        <button className="bg-[#ff69b4]/10 hover:bg-[#ff69b4]/20 text-[#ff69b4] border border-[#ff69b4]/30 px-3 rounded text-xs font-bold">Add</button>
                     </div>
                  </div>
                  <div>
                     <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Node Links & Dependencies</h3>
                     <p className="text-[10px] text-gray-400 mb-4">Connect this model directly to other scene assets or logic nodes.</p>
                     <div className="space-y-2">
                        <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Spawns On Death</span>
                              <Network size={12} className="text-[#ff69b4]" />
                           </div>
                           <div className="bg-[#0a0a0f] p-2 rounded border border-[#2a2b3d] flex justify-between items-center">
                              <span className="text-xs text-white">BP_LootDrop_Generic</span>
                              <button className="text-[10px] text-gray-500 hover:text-white">Unlink</button>
                           </div>
                        </div>
                        <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Parent Blueprint</span>
                              <Network size={12} className="text-[#58a6ff]" />
                           </div>
                           <button className="w-full bg-[#0a0a0f] p-2 rounded border border-[#2a2b3d] border-dashed text-gray-400 text-xs hover:text-white">
                              + Connect Node
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeSubTab === 'events' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-[#ff69b4] uppercase tracking-wider mb-4 border-b border-[#2a2b3d] pb-1">Animation Notifies (Timeline)</h3>
                     <p className="text-[10px] text-gray-400 mb-4">Trigger sounds, particles, or script events at specific animation frames.</p>
                     
                     <div className="flex flex-col gap-2">
                        <div className="bg-[#1e1e2d] border border-[#ff69b4]/30 p-2 rounded">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-white">Play Sound: Footstep_Dirt</span>
                              <span className="text-[10px] font-mono text-[#ff69b4]">Frame 14</span>
                           </div>
                           <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#ff69b4] h-full w-[25%]"></div>
                           </div>
                        </div>
                        <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-white">Play Sound: Footstep_Dirt</span>
                              <span className="text-[10px] font-mono text-gray-400">Frame 32</span>
                           </div>
                           <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full overflow-hidden">
                              <div className="bg-gray-500 h-full w-[65%]"></div>
                           </div>
                        </div>
                        <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-white">Spawn Particle: Dust_Puff</span>
                              <span className="text-[10px] font-mono text-gray-400">Frame 14</span>
                           </div>
                           <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full overflow-hidden">
                              <div className="bg-gray-500 h-full w-[25%]"></div>
                           </div>
                        </div>
                        <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-[#ff9900]">Trigger Custom Script Event</span>
                              <span className="text-[10px] font-mono text-gray-400">Frame 45</span>
                           </div>
                           <div className="text-[9px] text-gray-500 mt-1">Event: "Melee_Damage_Active"</div>
                        </div>
                     </div>
                     <button className="w-full mt-4 bg-[#ff69b4]/10 hover:bg-[#ff69b4]/20 text-[#ff69b4] border border-[#ff69b4]/30 py-2 rounded text-xs font-bold transition-colors">
                        + Add Timeline Notify
                     </button>
                  </div>
               </div>
            )}

         </div>
      </div>

      {/* Main Canvas Area Placeholder */}
      <div className="flex-1 bg-[#0a0a0f] relative overflow-hidden flex flex-col items-center justify-center">
         
         <div className="absolute inset-0 opacity-10 bg-[url('https://transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ff69b4 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         
         {/* 3D Viewport Mockup */}
         <div className="relative w-full h-full flex items-center justify-center">
             
             {/* Toolbar overlay in viewport */}
             <div className="absolute top-4 left-4 flex gap-2 z-10">
                 <div className="bg-[#11111b]/90 backdrop-blur border border-[#2a2b3d] rounded px-3 py-1.5 text-[10px] font-mono text-gray-300 flex items-center gap-4 shadow-lg">
                    <span className="text-white">Perspective</span>
                    <span className="border-l border-[#2a2b3d] pl-4">Lit</span>
                    <span className="border-l border-[#2a2b3d] pl-4">Show: Bones, Collision, UV Layout</span>
                 </div>
             </div>

             {/* Dynamic Render based on Active Tab */}
             {activeSubTab === 'nodes' ? (
                /* Shader Graph Canvas Overlay */
                <div className="absolute inset-4 bg-[#11111b] border border-[#2a2b3d] rounded-lg shadow-2xl overflow-hidden flex">
                    <div className="flex-1 relative overflow-hidden">
                       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#2a2b3d 1px, transparent 1px), linear-gradient(90deg, #2a2b3d 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                       
                       {/* Node 1: Texture Sample */}
                       <div className="absolute top-20 left-10 w-48 bg-[#1e1e2d] border border-[#2a2b3d] rounded shadow-lg shadow-black/50">
                          <div className="bg-[#3b3d54] px-2 py-1 text-[10px] font-bold text-white rounded-t flex justify-between">
                             <span>Texture Sample</span>
                             <span className="text-[#3fb950]">RGBA</span>
                          </div>
                          <div className="p-2 space-y-2">
                             <div className="flex justify-between items-center text-[9px] text-gray-300">
                                <span>UVs</span>
                                <div className="w-2 h-2 rounded-full bg-[#ff9900]"></div>
                             </div>
                             <div className="flex justify-between items-center text-[9px] text-gray-300">
                                <span>Texture (T_Armor_Albedo)</span>
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                             </div>
                          </div>
                       </div>

                       {/* Node 2: Multiply */}
                       <div className="absolute top-40 left-64 w-32 bg-[#1e1e2d] border border-[#2a2b3d] rounded shadow-lg shadow-black/50">
                          <div className="bg-gray-600 px-2 py-1 text-[10px] font-bold text-white rounded-t">
                             Multiply
                          </div>
                          <div className="p-2 space-y-2">
                             <div className="flex justify-between items-center text-[9px] text-gray-300">
                                <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
                                <span>A</span>
                                <span></span>
                             </div>
                             <div className="flex justify-between items-center text-[9px] text-gray-300">
                                <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
                                <span>B (Color)</span>
                                <span></span>
                             </div>
                             <div className="flex justify-end items-center text-[9px] text-gray-300 mt-2 border-t border-[#2a2b3d] pt-1">
                                <span className="mr-2">Result</span>
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                             </div>
                          </div>
                       </div>
                       
                       {/* Node 3: Material Output */}
                       <div className="absolute top-20 right-10 w-48 bg-[#1e1e2d] border border-[#ff69b4]/50 rounded shadow-lg shadow-[#ff69b4]/20">
                          <div className="bg-[#ff69b4]/20 px-2 py-1 text-[10px] font-bold text-[#ff69b4] rounded-t border-b border-[#ff69b4]/50">
                             Material Output
                          </div>
                          <div className="p-2 space-y-2">
                             <div className="flex items-center text-[9px] text-gray-300">
                                <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
                                <span>Base Color</span>
                             </div>
                             <div className="flex items-center text-[9px] text-gray-300">
                                <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                                <span>Metallic</span>
                             </div>
                             <div className="flex items-center text-[9px] text-gray-300">
                                <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                                <span>Roughness</span>
                             </div>
                             <div className="flex items-center text-[9px] text-gray-300">
                                <div className="w-2 h-2 rounded-full bg-[#58a6ff] mr-2"></div>
                                <span>Normal</span>
                             </div>
                          </div>
                       </div>
                       
                       {/* Connection Lines */}
                       <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <path d="M 230 50 C 270 50, 250 170, 280 170" fill="none" stroke="white" strokeWidth="1.5" />
                          <path d="M 388 200 C 450 200, 480 60, 550 60" fill="none" stroke="white" strokeWidth="1.5" />
                       </svg>
                    </div>
                </div>
             ) : activeSubTab === 'uv' ? (
                /* UV Layout Canvas */
                <div className="absolute inset-4 bg-[#11111b] border border-[#2a2b3d] rounded-lg shadow-2xl flex items-center justify-center p-8">
                    <div className="w-[500px] h-[500px] border-2 border-gray-600 relative overflow-hidden">
                       <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/UV_Checker_Map_by_Serr.png/512px-UV_Checker_Map_by_Serr.png')] opacity-30 bg-cover"></div>
                       
                       {/* Mock UV Islands */}
                       <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                          {/* Selected Island */}
                          <path d="M 10 10 L 40 10 L 40 40 L 25 50 L 10 40 Z" fill="#ff69b4" fillOpacity="0.3" stroke="#ff69b4" strokeWidth="0.5" />
                          {/* Unselected Islands */}
                          <path d="M 50 10 L 90 10 L 90 30 L 50 30 Z" fill="none" stroke="#3fb950" strokeWidth="0.5" />
                          <path d="M 10 60 L 45 60 L 45 90 L 10 90 Z" fill="none" stroke="#3fb950" strokeWidth="0.5" />
                          <path d="M 55 40 L 85 50 L 80 85 L 50 75 Z" fill="none" stroke="#3fb950" strokeWidth="0.5" />
                       </svg>
                    </div>
                </div>
             ) : (
                /* Standard 3D Viewport with mesh */
                <div className="relative w-64 h-96">
                   {/* Wireframe / Silhouette approximation */}
                   <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 200">
                      {/* Character Body Base */}
                      <path d="M 30 180 L 40 100 L 25 50 L 50 30 L 75 50 L 60 100 L 70 180" fill={activeSubTab === 'vertex' ? '#3b3d54' : 'none'} stroke="#4b5b7a" strokeWidth="2" strokeLinejoin="round" />
                      
                      {activeSubTab === 'vertex' && (
                         <>
                            <circle cx="25" cy="50" r="15" fill="#ff0000" fillOpacity="0.6" filter="blur(2px)" />
                            <circle cx="40" cy="70" r="20" fill="#ffff00" fillOpacity="0.4" filter="blur(3px)" />
                            <circle cx="60" cy="120" r="10" fill="#00ff00" fillOpacity="0.5" filter="blur(2px)" />
                            {/* Brush cursor */}
                            <circle cx="35" cy="65" r="15" fill="none" stroke="#ff69b4" strokeWidth="1" strokeDasharray="2,2" />
                         </>
                      )}

                      {/* Active Rigging / Bones overlay */}
                      {activeSubTab === 'rigging' && (
                         <>
                            <circle cx="50" cy="110" r="3" fill="#ff69b4" /> {/* Pelvis */}
                            <line x1="50" y1="110" x2="50" y2="70" stroke="#ff69b4" strokeWidth="1.5" /> {/* Spine */}
                            <circle cx="50" cy="70" r="3" fill="#ff69b4" /> {/* Spine_01 */}
                            <line x1="50" y1="70" x2="50" y2="40" stroke="#ff69b4" strokeWidth="1.5" /> {/* Neck */}
                            
                            <line x1="50" y1="60" x2="25" y2="70" stroke="#ff69b4" strokeWidth="1.5" /> {/* Arm_L */}
                            <circle cx="25" cy="70" r="2" fill="#fff" /> 
                            <line x1="50" y1="60" x2="75" y2="70" stroke="#ff69b4" strokeWidth="1.5" /> {/* Arm_R */}
                            <circle cx="75" cy="70" r="2" fill="#fff" /> 
                         </>
                      )}

                      {/* Active Collision overlay */}
                      {activeSubTab === 'collision' && (
                         <>
                            <rect x="35" y="45" width="30" height="60" fill="#ff69b4" fillOpacity="0.2" stroke="#ff69b4" strokeWidth="1" /> {/* Torso Hitbox */}
                            <rect x="40" y="20" width="20" height="25" fill="#3fb950" fillOpacity="0.2" stroke="#3fb950" strokeWidth="1" /> {/* Head Hitbox */}
                         </>
                      )}

                      {/* Tags & Links Visualization */}
                      {activeSubTab === 'tags' && (
                         <>
                            {/* Floating tag indicators */}
                            <rect x="30" y="15" width="40" height="12" rx="2" fill="#1e1e2d" fillOpacity="0.9" stroke="#ff69b4" strokeWidth="0.5" />
                            <text x="50" y="23" fill="#ff69b4" fontSize="6" fontFamily="monospace" textAnchor="middle">Enemy.Grunt</text>
                            <line x1="50" y1="27" x2="50" y2="35" stroke="#ff69b4" strokeWidth="0.5" strokeDasharray="1,1" />

                            {/* Node connection lines going off-screen */}
                            <path d="M 70 100 Q 90 90 110 100" fill="none" stroke="#ff69b4" strokeWidth="1" strokeDasharray="2,2" />
                            <circle cx="110" cy="100" r="3" fill="#ff69b4" />
                         </>
                      )}

                      {/* Boolean Visualization */}
                      {activeSubTab === 'boolean' && (
                         <>
                            <rect x="10" y="70" width="40" height="40" fill="none" stroke="#ff69b4" strokeWidth="1" strokeDasharray="4,2" />
                            <text x="15" y="65" fill="#ff69b4" fontSize="8" fontFamily="monospace">SM_Cube_Cutter</text>
                         </>
                      )}
                   </svg>

                   {/* Center Pivot Marker */}
                   {activeSubTab !== 'vertex' && activeSubTab !== 'boolean' && (
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-16 h-[1px] bg-red-500 absolute top-1/2 -translate-y-1/2 -left-8"></div>
                        <div className="w-[1px] h-16 bg-blue-500 absolute left-1/2 -translate-x-1/2 -top-8"></div>
                        <div className="w-4 h-4 rounded-full border-2 border-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 transform origin-center"></div>
                     </div>
                   )}
                </div>
             )}

             {/* Animation Playback Controls (if Animation or Events tab) */}
             {(activeSubTab === 'animation' || activeSubTab === 'events') && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#161621]/90 backdrop-blur border border-[#2a2b3d] rounded-lg p-3 w-[600px] shadow-2xl flex flex-col gap-2 z-20">
                   <div className="flex items-center gap-4">
                      <button className="text-gray-400 hover:text-white"><Play size={16}/></button>
                      <div className="flex-1 bg-[#0a0a0f] h-2 rounded-full relative">
                         <div className="absolute top-0 left-[25%] bottom-0 w-[1px] bg-red-500 z-10" title="Notify: Footstep"></div>
                         <div className="absolute top-0 left-0 bottom-0 bg-[#ff69b4] w-[45%] rounded-full opacity-50"></div>
                         <div className="absolute top-1/2 -translate-y-1/2 left-[45%] w-3 h-3 bg-white rounded-full shadow cursor-pointer transform -translate-x-1/2"></div>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 w-12 text-right">0:01.4</span>
                   </div>
                </div>
             )}
             
         </div>

      </div>
    </div>
  );
}
