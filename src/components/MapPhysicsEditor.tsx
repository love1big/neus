import React, { useState } from 'react';
import { Flame, Pickaxe, Droplets, Grab, Play, Shield, Wind, Anchor, Network, Target, Triangle, Cuboid as Cube, ArrowDown } from 'lucide-react';

export default function MapPhysicsEditor() {
  const [activeTab, setActiveTab] = useState('rigid');

  const tabs = [
    { id: 'rigid', icon: <Cube size={16} />, label: 'Rigid Bodies' },
    { id: 'chaos', icon: <Pickaxe size={16} />, label: 'Chaos Destruction' },
    { id: 'soft', icon: <Grab size={16} />, label: 'Soft Bodies & Cloth' },
    { id: 'fluid', icon: <Droplets size={16} />, label: 'Fluid Dynamics' },
    { id: 'aero', icon: <Wind size={16} />, label: 'Aerodynamics' },
    { id: 'constraints', icon: <Anchor size={16} />, label: 'Constraints & Joints' },
  ];

  return (
    <div className="absolute inset-x-0 inset-y-0 z-30 pointer-events-auto bg-[#0f111a] flex">
      {/* Left Toolbar - SubTabs */}
      <div className="w-16 bg-[#161621] border-r border-[#2a2b3d] flex flex-col items-center py-4 gap-3 shrink-0">
         {tabs.map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-12 h-12 rounded flex items-center justify-center transition-all ${
                  activeTab === tab.id ? 'bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]' : 'text-gray-400 hover:text-white hover:bg-[#2a2b3d]'
               }`}
               title={tab.label}
            >
               {tab.icon}
            </button>
         ))}
      </div>

      <div className="w-[350px] border-r border-[#2a2b3d] bg-[#11111b] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#2a2b3d]">
             <h2 className="font-bold text-[#ff7b72] flex items-center gap-2 text-lg">
                <Flame size={20} /> Physics Engine
             </h2>
             <p className="text-xs text-gray-400 mt-1">Advanced deterministic simulation, fracture, and fluid dynamics.</p>
          </div>

          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              {activeTab === 'rigid' && (
                 <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase border-b border-[#2a2b3d] pb-2">Material Physics Profiles</h3>
                    <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] text-white text-xs p-2 rounded">
                       <option>PhysMat_Concrete</option>
                       <option>PhysMat_Wood</option>
                       <option>PhysMat_Rubber</option>
                       <option>PhysMat_Ice</option>
                       <option>PhysMat_Custom</option>
                    </select>

                    <div className="space-y-3">
                       <div>
                          <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Friction (Static)</span> <span className="text-white">0.85</span></label>
                          <input type="range" min="0" max="100" defaultValue="85" className="w-full accent-[#ff7b72]" />
                       </div>
                       <div>
                          <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Friction (Dynamic)</span> <span className="text-white">0.65</span></label>
                          <input type="range" min="0" max="100" defaultValue="65" className="w-full accent-[#ff7b72]" />
                       </div>
                       <div>
                          <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Restitution (Bounciness)</span> <span className="text-white">0.15</span></label>
                          <input type="range" min="0" max="100" defaultValue="15" className="w-full accent-[#ff7b72]" />
                       </div>
                       <div>
                          <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Density (kg/m³)</span> <span className="text-white">2400</span></label>
                          <input type="number" defaultValue="2400" className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-xs text-white" />
                       </div>
                    </div>
                    
                    <h3 className="text-xs font-bold text-white uppercase border-b border-[#2a2b3d] pb-2 pt-4">Sleep Settings</h3>
                    <div className="space-y-2 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" defaultChecked className="accent-[#ff7b72] w-3 h-3" />
                           <span className="text-gray-400 group-hover:text-white transition">Start Awake</span>
                        </label>
                        <div>
                           <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Linear Sleep Threshold</span> <span className="text-white">0.01</span></label>
                           <input type="number" defaultValue="0.01" step="0.01" className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1 text-xs text-white" />
                        </div>
                    </div>
                 </div>
              )}

              {activeTab === 'chaos' && (
                 <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase border-b border-[#2a2b3d] pb-2">Voronoi Fracture Generation</h3>
                    
                    <div className="space-y-3 bg-[#1e1e2d] border border-[#ff7b72]/30 p-3 rounded">
                       <div>
                          <label className="text-[10px] text-[#ff7b72] mb-1 flex justify-between"><span>Site Count (Pieces)</span> <span className="text-white">250</span></label>
                          <input type="range" min="10" max="1000" defaultValue="250" className="w-full accent-[#ff7b72]" />
                       </div>
                       <div>
                          <label className="text-[10px] text-gray-400 mb-1 flex justify-between"><span>Cluster Radius</span> <span className="text-white">0.5m</span></label>
                          <input type="range" min="0" max="100" defaultValue="50" className="w-full accent-[#ff7b72]" />
                       </div>
                       <div>
                          <label className="text-[10px] text-gray-400 mb-1 flex justify-between"><span>Noise Offset</span> <span className="text-white">12%</span></label>
                          <input type="range" min="0" max="50" defaultValue="12" className="w-full accent-[#ff7b72]" />
                       </div>
                       <button className="w-full bg-[#ff7b72] text-white hover:bg-[#ff7b72]/80 p-2 rounded text-xs font-bold transition-colors mt-2">
                           Generate Geometry Collection
                       </button>
                    </div>

                    <h3 className="text-xs font-bold text-white uppercase border-b border-[#2a2b3d] pb-2 pt-2">Structural Integrity</h3>
                    <div className="space-y-2 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" defaultChecked className="accent-[#ff7b72] w-3 h-3" />
                           <span className="text-gray-400 group-hover:text-white transition">Enable Damage Thresholds</span>
                        </label>
                        <div>
                           <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Base Damage Required (Strain)</span> <span className="text-white">5000 N</span></label>
                           <input type="number" defaultValue="5000" className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1 text-xs text-white" />
                        </div>
                    </div>
                 </div>
              )}

              {activeTab === 'soft' && (
                 <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase border-b border-[#2a2b3d] pb-2">Cloth Simulation</h3>
                    
                    <div className="space-y-3">
                       <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" defaultChecked className="accent-[#ff7b72] w-3 h-3" />
                           <span className="text-gray-400 group-hover:text-white transition">Self-Collision Enabled</span>
                        </label>
                       <div>
                          <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Bend Stiffness</span> <span className="text-white">0.2</span></label>
                          <input type="range" min="0" max="100" defaultValue="20" className="w-full accent-[#ff7b72]" />
                       </div>
                       <div>
                          <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Stretch Stiffness</span> <span className="text-white">0.9</span></label>
                          <input type="range" min="0" max="100" defaultValue="90" className="w-full accent-[#ff7b72]" />
                       </div>
                       <div>
                          <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Damping Coefficient</span> <span className="text-white">0.05</span></label>
                          <input type="range" min="0" max="100" defaultValue="5" className="w-full accent-[#ff7b72]" />
                       </div>
                       <button className="w-full bg-[#2a2b3d] text-white hover:bg-[#3b3d54] border border-[#2a2b3d] p-2 rounded text-xs transition-colors mt-2 flex items-center justify-center gap-2">
                           <Target size={14} /> Paint Vertex Weights (Max Distance)
                       </button>
                    </div>

                    <h3 className="text-xs font-bold text-white uppercase border-b border-[#2a2b3d] pb-2 pt-4">Soft Body (Jiggle)</h3>
                    <div className="space-y-3">
                       <div>
                          <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Volume Preservation</span> <span className="text-white">95%</span></label>
                          <input type="range" min="0" max="100" defaultValue="95" className="w-full accent-[#ff7b72]" />
                       </div>
                       <div>
                          <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Plastic Deformation</span> <span className="text-white">0%</span></label>
                          <input type="range" min="0" max="100" defaultValue="0" className="w-full accent-[#ff7b72]" />
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'fluid' && (
                 <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase border-b border-[#2a2b3d] pb-2">SPH Particle Fluids</h3>
                    
                    <div className="space-y-3">
                       <div>
                          <label className="text-[10px] text-[#79c0ff] flex justify-between mb-1"><span>Fluid Preset</span></label>
                          <select className="w-full bg-[#0a0a0f] border border-[#79c0ff]/50 text-white text-xs p-1.5 rounded">
                             <option>Water (Low Viscosity)</option>
                             <option>Oil (Medium Viscosity)</option>
                             <option>Lava (High Viscosity)</option>
                             <option>Honey (Extreme Viscosity)</option>
                          </select>
                       </div>
                       
                       <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                          <div>
                             <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Particle Count Constraint</span> <span className="text-white">100,000</span></label>
                             <input type="range" min="1000" max="500000" defaultValue="100000" className="w-full accent-[#79c0ff]" />
                          </div>
                          <div>
                             <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Rest Density</span> <span className="text-white">1000</span></label>
                             <input type="range" min="500" max="3000" defaultValue="1000" className="w-full accent-[#79c0ff]" />
                          </div>
                          <div>
                             <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Surface Tension</span> <span className="text-white">0.072</span></label>
                             <input type="range" min="0" max="100" defaultValue="7" className="w-full accent-[#79c0ff]" />
                          </div>
                       </div>
                       <button className="w-full bg-[#79c0ff]/20 text-[#79c0ff] border border-[#79c0ff]/50 p-2 rounded text-xs font-bold transition-colors mt-2 flex items-center justify-center gap-2">
                           <Play size={14} /> Run Voxelization Pre-Pass
                       </button>
                    </div>
                 </div>
              )}
              
              {activeTab === 'aero' && (
                 <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase border-b border-[#2a2b3d] pb-2">Aerodynamics & Wind</h3>
                    
                    <div className="space-y-3">
                       <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" defaultChecked className="accent-[#ff7b72] w-3 h-3" />
                           <span className="text-gray-400 group-hover:text-white transition">Apply Drag to Rigid Bodies</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" defaultChecked className="accent-[#ff7b72] w-3 h-3" />
                           <span className="text-gray-400 group-hover:text-white transition">Apply Lift (Foil approximation)</span>
                        </label>
                        
                       <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3 mt-4">
                          <h4 className="text-[10px] font-bold text-white">Global Wind Vector</h4>
                          <div className="grid grid-cols-3 gap-2">
                             <div><span className="text-[9px] text-gray-500">X</span><input type="number" defaultValue="4.5" className="w-full bg-[#0a0a0f] border border-[#2a2b3d] text-white text-xs p-1 text-center rounded"/></div>
                             <div><span className="text-[9px] text-gray-500">Y</span><input type="number" defaultValue="-1.2" className="w-full bg-[#0a0a0f] border border-[#2a2b3d] text-white text-xs p-1 text-center rounded"/></div>
                             <div><span className="text-[9px] text-gray-500">Z</span><input type="number" defaultValue="0" className="w-full bg-[#0a0a0f] border border-[#2a2b3d] text-white text-xs p-1 text-center rounded"/></div>
                          </div>
                          <div>
                             <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Gust Frequency</span> <span className="text-white">2.5 Hz</span></label>
                             <input type="range" min="0" max="100" defaultValue="25" className="w-full accent-white" />
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'constraints' && (
                 <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase border-b border-[#2a2b3d] pb-2">Physics Constraints</h3>
                    
                    <div className="flex flex-col gap-2">
                        <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded cursor-pointer hover:border-[#ff7b72]/50">
                           <div className="text-xs font-bold text-white mb-1">Hinge Joint</div>
                           <div className="text-[9px] text-gray-400 flex justify-between"><span>Door_Left_01</span> <span>-&gt;</span> <span>Wall_Frame</span></div>
                        </div>
                        <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded cursor-pointer hover:border-[#ff7b72]/50">
                           <div className="text-xs font-bold text-white mb-1">Ball and Socket</div>
                           <div className="text-[9px] text-gray-400 flex justify-between"><span>Chain_Link_04</span> <span>-&gt;</span> <span>Chain_Link_05</span></div>
                        </div>
                        <button className="bg-[#0a0a0f] border border-[#2a2b3d] border-dashed p-2 rounded text-xs text-gray-400 hover:text-white mt-2">
                           + Create New Constraint
                        </button>
                    </div>

                    <div className="bg-[#1e1e2d] border border-[#ff7b72]/30 p-3 rounded flex flex-col gap-3 mt-2">
                        <h4 className="text-[10px] font-bold text-white">Angular Limits (Hinge)</h4>
                        <div>
                             <label className="text-[10px] text-gray-400 flex justify-between mb-1"><span>Swing 1 Limit</span> <span className="text-white">45°</span></label>
                             <input type="range" min="0" max="180" defaultValue="45" className="w-full accent-[#ff7b72]" />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer group mt-1">
                           <input type="checkbox" className="accent-[#ff7b72] w-3 h-3" />
                           <span className="text-gray-400 group-hover:text-white transition text-xs">Enable Soft Limits</span>
                        </label>
                    </div>
                 </div>
              )}
          </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden bg-[#0a0a0f]">
         
         {/* Blueprint background */}
         <div className="absolute inset-0 opacity-10 bg-[url('https://transparenttextures.com/patterns/graphy.png')]"></div>
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#ff7b72 1px, transparent 1px), linear-gradient(90deg, #ff7b72 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
         
         <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button className="bg-[#2a2b3d] hover:bg-[#ff7b72] text-white px-4 py-2 rounded text-xs font-bold transition-colors flex items-center gap-2 shadow-lg">
                <Play size={14} /> Play Simulation
            </button>
         </div>

         {/* Abstract Physics Simulation Viewport */}
         <div className="relative w-[600px] h-[500px]">
             
             {/* Gravity Vector */}
             <div className="absolute top-10 left-10 flex flex-col items-center gap-1 opacity-50">
                 <ArrowDown size={32} className="text-[#ff7b72]" />
                 <span className="text-[10px] font-mono text-[#ff7b72] font-bold">G: -9.81 m/s²</span>
             </div>

             {activeTab === 'rigid' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="w-32 h-32 bg-[#ff7b72]/20 border-2 border-[#ff7b72] transform rotate-12 shadow-[0_0_30px_rgba(255,123,114,0.3)] flex items-center justify-center backdrop-blur-sm">
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                      <div className="w-full h-[1px] bg-[#ff7b72]/50 absolute top-1/2 left-0"></div>
                      <div className="w-[1px] h-full bg-[#ff7b72]/50 absolute left-1/2 top-0"></div>
                   </div>
                   {/* Normal force vector */}
                   <div className="absolute bottom-[-60px] left-[80%] h-[100px] w-1 bg-blue-500 origin-bottom transform rotate-12 shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                      <div className="w-3 h-3 border-t-2 border-r-2 border-blue-500 transform -rotate-45 absolute -top-1 -left-1"></div>
                   </div>
                   <div className="absolute bottom-[-70px] left-[-50px] w-64 h-2 bg-gray-600 rounded"></div>
                </div>
             )}

             {activeTab === 'chaos' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-80">
                      {/* Voronoi cracks visualization */}
                      <path d="M 0 0 L 50 20 L 30 80 L 0 50 Z" fill="#ff7b72" fillOpacity="0.1" stroke="#ff7b72" strokeWidth="2" />
                      <path d="M 50 20 L 120 10 L 90 70 L 30 80 Z" fill="#ff7b72" fillOpacity="0.2" stroke="#ff7b72" strokeWidth="2" />
                      <path d="M 120 10 L 200 0 L 180 90 L 90 70 Z" fill="#ff7b72" fillOpacity="0.15" stroke="#ff7b72" strokeWidth="2" />
                      <path d="M 0 50 L 30 80 L 40 150 L 0 160 Z" fill="#ff7b72" fillOpacity="0.25" stroke="#ff7b72" strokeWidth="2" />
                      <path d="M 30 80 L 90 70 L 110 130 L 40 150 Z" fill="#ff7b72" fillOpacity="0.4" stroke="#ff7b72" strokeWidth="2" /> {/* Highlighted shard */}
                      <path d="M 90 70 L 180 90 L 150 170 L 110 130 Z" fill="#ff7b72" fillOpacity="0.1" stroke="#ff7b72" strokeWidth="2" />
                      <path d="M 0 160 L 40 150 L 60 200 L 0 200 Z" fill="#ff7b72" fillOpacity="0.15" stroke="#ff7b72" strokeWidth="2" />
                      <path d="M 40 150 L 110 130 L 140 200 L 60 200 Z" fill="#ff7b72" fillOpacity="0.2" stroke="#ff7b72" strokeWidth="2" />
                      <path d="M 110 130 L 150 170 L 200 180 L 200 200 L 140 200 Z" fill="#ff7b72" fillOpacity="0.1" stroke="#ff7b72" strokeWidth="2" />
                      <path d="M 180 90 L 200 0 L 200 180 Z" fill="#ff7b72" fillOpacity="0.05" stroke="#ff7b72" strokeWidth="2" />
                   </svg>
                   {/* Impact point */}
                   <div className="absolute top-[80px] left-[70px] w-8 h-8 rounded-full border-4 border-white animate-ping opacity-50"></div>
                   <div className="absolute top-[80px] left-[70px] w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                   </div>
                </div>
             )}

             {activeTab === 'fluid' && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[300px] border-b-4 border-l-4 border-r-4 border-[#2a2b3d] rounded-b-xl flex items-end justify-center overflow-hidden">
                    {/* Simulated fluid particles */}
                    <svg width="400" height="300" viewBox="0 0 400 300" className="opacity-80 absolute bottom-0">
                       <path d="M 0 300 L 0 150 Q 50 120 100 160 T 200 150 T 300 180 T 400 140 L 400 300 Z" fill="#79c0ff" fillOpacity="0.3" stroke="#79c0ff" strokeWidth="3" />
                       <path d="M 0 300 L 0 170 Q 50 140 100 180 T 200 170 T 300 200 T 400 160 L 400 300 Z" fill="#79c0ff" fillOpacity="0.5" />
                       
                       {/* Velocity vectors */}
                       <line x1="80" y1="180" x2="100" y2="190" stroke="white" strokeWidth="1" strokeOpacity="0.5" markerEnd="url(#arrow)" />
                       <line x1="180" y1="170" x2="210" y2="160" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
                       <line x1="280" y1="210" x2="320" y2="190" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
                       
                       {/* Splashes */}
                       <circle cx="210" cy="130" r="3" fill="#79c0ff" />
                       <circle cx="225" cy="110" r="2" fill="#79c0ff" />
                       <circle cx="195" cy="140" r="1.5" fill="#79c0ff" />
                    </svg>
                </div>
             )}

         </div>

      </div>
    </div>
  );
}
