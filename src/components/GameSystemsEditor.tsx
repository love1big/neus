import React, { useState } from 'react';
import { Settings, Cpu, Car, Navigation, Brain, Box, Glasses, Database, Zap, Plus, Search, ShieldCheck, Layers, Dna, BarChart2, Activity} from 'lucide-react';

export default function GameSystemsBuilder() {
  const [activeTab, setActiveTab] = useState('systems');

  return (
    <div className="flex h-full bg-[#0d1117] text-white overflow-hidden font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#161b22] border-r border-[#30363d] p-3 flex flex-col gap-2 shrink-0">
         <h2 className="text-[12px] font-bold text-[#8b949e] uppercase tracking-wider mb-2 flex items-center gap-2"><Cpu size={14}/> Game Systems</h2>
         
         <button onClick={() => setActiveTab('systems')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'systems' ? 'bg-[#21262d] text-[#58a6ff]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <Zap size={16}/> Core Game Systems
         </button>
         <button onClick={() => setActiveTab('navmesh')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'navmesh' ? 'bg-[#21262d] text-[#3fb950]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <Navigation size={16}/> Advanced NavMesh
         </button>
         <button onClick={() => setActiveTab('vehicle')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'vehicle' ? 'bg-[#21262d] text-[#ff7b72]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <Car size={16}/> Vehicle Physics
         </button>
         <button onClick={() => setActiveTab('voxel')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'voxel' ? 'bg-[#21262d] text-[#e3b341]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <Box size={16}/> Voxel Engine Config
         </button>
         <button onClick={() => setActiveTab('mlagents')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'mlagents' ? 'bg-[#21262d] text-[#bc8cff]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <Brain size={16}/> ML-Agents Training
         </button>
         <button onClick={() => setActiveTab('vrxr')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'vrxr' ? 'bg-[#21262d] text-[#3fb950]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <Glasses size={16}/> VR / XR Engine Config
         </button>
         <button onClick={() => setActiveTab('bioevo')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'bioevo' ? 'bg-[#21262d] text-[#f85149]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <Dna size={16}/> Bio-Evolution
         </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative bg-[#0a0a0a]">
         {activeTab === 'systems' && (
            <div className="max-w-4xl mx-auto">
               <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl font-bold flex items-center gap-2"><Zap className="text-[#58a6ff]"/> Core Game Systems</h1>
                 <button className="flex items-center gap-1 bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded text-[11px] font-bold transition-colors">
                    <Plus size={14}/> Add Custom System
                 </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* System Card */}
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-[#58a6ff]/5 to-transparent pointer-events-none"></div>
                     <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="flex items-center gap-2">
                           <Database size={16} className="text-[#58a6ff]"/>
                           <h3 className="font-bold text-[13px]">Inventory System v2.0</h3>
                        </div>
                        <span className="text-[9px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded font-bold uppercase tracking-wide">Active</span>
                     </div>
                     <p className="text-[11px] text-[#8b949e] mb-4 relative z-10">Grid-based spatial inventory with weight enforcement and crafting station hooking.</p>
                     <div className="flex items-center gap-2 relative z-10">
                         <button className="bg-[#21262d] border border-[#30363d] px-2 py-1 rounded text-[10px] hover:bg-[#30363d]">Edit Structure</button>
                         <button className="bg-[#21262d] border border-[#30363d] px-2 py-1 rounded text-[10px] hover:bg-[#30363d]">View Blueprint</button>
                     </div>
                  </div>

                  {/* System Card */}
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-[#e3b341]/5 to-transparent pointer-events-none"></div>
                     <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="flex items-center gap-2">
                           <ShieldCheck size={16} className="text-[#e3b341]"/>
                           <h3 className="font-bold text-[13px]">Skill & Ability System</h3>
                        </div>
                        <span className="text-[9px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded font-bold uppercase tracking-wide">Active</span>
                     </div>
                     <p className="text-[11px] text-[#8b949e] mb-4 relative z-10">Effect execution framework (damage, heal, buff) with cooldown and resource cost checks.</p>
                     <div className="flex items-center gap-2 relative z-10">
                         <button className="bg-[#21262d] border border-[#30363d] px-2 py-1 rounded text-[10px] hover:bg-[#30363d]">Edit Effects Data</button>
                         <button className="bg-[#21262d] border border-[#30363d] px-2 py-1 rounded text-[10px] hover:bg-[#30363d]">Animation Hooks</button>
                     </div>
                  </div>
               </div>
            </div>
         )}
         
         {activeTab === 'navmesh' && (
            <div className="max-w-4xl mx-auto">
               <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Navigation className="text-[#3fb950]"/> Advanced NavMesh Configuration</h1>
               
               <div className="bg-[#161b22] border border-[#30363d] p-5 rounded space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <h3 className="text-xs font-bold text-[#c9d1d9] border-b border-[#30363d] pb-2 mb-3">Agent Specs</h3>
                        <label className="flex items-center justify-between text-[11px] py-1">
                            <span className="text-[#8b949e]">Agent Radius</span>
                            <input type="number" defaultValue="34.0" className="bg-[#0d1117] border border-[#30363d] w-20 text-center text-white p-1 rounded outline-none"/>
                        </label>
                        <label className="flex items-center justify-between text-[11px] py-1">
                            <span className="text-[#8b949e]">Agent Height</span>
                            <input type="number" defaultValue="144.0" className="bg-[#0d1117] border border-[#30363d] w-20 text-center text-white p-1 rounded outline-none"/>
                        </label>
                        <label className="flex items-center justify-between text-[11px] py-1">
                            <span className="text-[#8b949e]">Max Step Height</span>
                            <input type="number" defaultValue="35.0" className="bg-[#0d1117] border border-[#30363d] w-20 text-center text-white p-1 rounded outline-none"/>
                        </label>
                     </div>
                     <div>
                        <h3 className="text-xs font-bold text-[#c9d1d9] border-b border-[#30363d] pb-2 mb-3">Generation Settings</h3>
                        <label className="flex items-center justify-between text-[11px] py-1">
                            <span className="text-[#8b949e]">Cell Size</span>
                            <input type="number" defaultValue="19.0" className="bg-[#0d1117] border border-[#30363d] w-20 text-center text-white p-1 rounded outline-none"/>
                        </label>
                        <label className="flex items-center justify-between text-[11px] py-1">
                            <span className="text-[#8b949e]">Chunk Size</span>
                            <input type="number" defaultValue="1024" className="bg-[#0d1117] border border-[#30363d] w-20 text-center text-white p-1 rounded outline-none"/>
                        </label>
                     </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-[#30363d] flex justify-end gap-3">
                     <button className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-white rounded text-[11px] font-bold transition-colors">Clear NavMesh</button>
                     <button className="px-4 py-2 bg-[#3fb950] hover:bg-[#2ea043] text-white rounded text-[11px] font-bold shadow-[0_0_10px_rgba(63,185,80,0.2)] transition-colors">Bake Static NavMesh</button>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'mlagents' && (
            <div className="max-w-5xl mx-auto space-y-6">
               <h1 className="text-2xl font-bold flex items-center gap-2"><Brain className="text-[#bc8cff]"/> Machine Learning Agents (PPO/SAC)</h1>
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded space-y-4">
                     <h2 className="text-sm font-bold text-white border-b border-[#30363d] pb-2 flex items-center justify-between">
                         <span>Reward Function Designer</span>
                         <span className="text-[10px] bg-[#f85149]/20 text-[#f85149] px-2 py-0.5 rounded animate-pulse">Untrained</span>
                     </h2>
                     <div className="space-y-3 pt-2">
                         <div className="flex items-center justify-between text-[11px] bg-[#0d1117] border border-[#30363d] p-2 rounded">
                            <span className="text-[#3fb950] font-bold">+1.0</span>
                            <span className="text-white w-32 border-l border-[#30363d] pl-2 text-right">Target Reached</span>
                         </div>
                         <div className="flex items-center justify-between text-[11px] bg-[#0d1117] border border-[#30363d] p-2 rounded">
                            <span className="text-[#f85149] font-bold">-0.1</span>
                            <span className="text-white w-32 border-l border-[#30363d] pl-2 text-right">Step Penalty</span>
                         </div>
                         <div className="flex items-center justify-between text-[11px] bg-[#0d1117] border border-[#30363d] p-2 rounded">
                            <span className="text-[#f85149] font-bold">-1.0</span>
                            <span className="text-white w-32 border-l border-[#30363d] pl-2 text-right">Fall Off Ledge</span>
                         </div>
                         <button className="text-[10px] text-[#8b949e] border border-dashed border-[#30363d] w-full py-1.5 rounded hover:bg-[#21262d]">+ Add Reward Signal</button>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded flex flex-col items-center justify-center text-center space-y-4">
                     <Brain size={48} className="text-[#bc8cff]"/>
                     <div className="space-y-1">
                        <div className="font-bold text-white text-[14px]">Offline Tensor Training</div>
                        <div className="text-[11px] text-[#8b949e]">Train agent models locally using your GPU compute. Time estimated: ~30 mins.</div>
                     </div>
                     <div className="w-full bg-[#0d1117] h-2 rounded-full border border-[#30363d] overflow-hidden">
                        <div className="bg-[#bc8cff] w-0 h-full"></div>
                     </div>
                     <button className="px-6 py-2 bg-[#bc8cff] text-black hover:bg-[#a371f7] text-[11px] font-bold rounded shadow-[0_0_15px_rgba(188,140,255,0.4)]">
                        Initialize Training Session
                     </button>
                  </div>
               </div>
            </div>
         )}
         
         {activeTab === 'vehicle' && (
            <div className="max-w-5xl mx-auto space-y-6">
               <h1 className="text-2xl font-bold flex items-center gap-2"><Car className="text-[#ff7b72]"/> Chaos Vehicle Physics</h1>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded space-y-4">
                     <h2 className="text-sm font-bold text-white border-b border-[#30363d] pb-2 flex items-center justify-between">
                         <span>Engine & Transmission Spec</span>
                         <span className="text-[10px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded">Active Template</span>
                     </h2>
                     <div className="space-y-3 pt-2">
                        <label className="flex items-center justify-between text-[11px]">
                            <span className="text-[#8b949e]">Max Torque (Nm)</span>
                            <div className="flex bg-[#0d1117] border border-[#30363d] rounded">
                               <input type="range" className="accent-[#ff7b72] w-24 mx-2" defaultValue="450"/>
                               <span className="px-2 text-white font-mono w-12 text-center border-l border-[#30363d]">450</span>
                            </div>
                        </label>
                        <label className="flex items-center justify-between text-[11px]">
                            <span className="text-[#8b949e]">Max RPM</span>
                            <div className="flex bg-[#0d1117] border border-[#30363d] rounded">
                               <input type="range" className="accent-[#ff7b72] w-24 mx-2" defaultValue="8000" min="2000" max="15000"/>
                               <span className="px-2 text-white font-mono w-12 text-center border-l border-[#30363d]">8K</span>
                            </div>
                        </label>
                        <label className="flex items-center justify-between text-[11px]">
                           <span className="text-[#8b949e]">Gearbox Type</span>
                           <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none w-32">
                              <option>Automatic (6-spd)</option>
                              <option>Manual (Sequential)</option>
                              <option>CVT</option>
                           </select>
                        </label>
                     </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded space-y-4">
                     <h2 className="text-sm font-bold text-white border-b border-[#30363d] pb-2 text-[#e3b341]">Suspension & Tire Friction</h2>
                     <div className="space-y-3 pt-2">
                         <div className="flex space-x-2 text-[10px] uppercase font-bold text-white mb-2">
                            <button className="flex-1 bg-[#21262d] py-1 rounded border border-[#30363d] hover:bg-[#30363d]">Front Wheels</button>
                            <button className="flex-1 bg-transparent py-1 rounded border border-[#30363d] text-[#8b949e] hover:bg-[#21262d]">Rear Wheels</button>
                         </div>
                         <label className="flex items-center justify-between text-[11px]">
                            <span className="text-[#8b949e]">Spring Rate (N/m)</span>
                            <input type="number" defaultValue="250.0" className="bg-[#0d1117] border border-[#30363d] w-20 text-center text-white p-1 rounded outline-none"/>
                         </label>
                         <label className="flex items-center justify-between text-[11px]">
                            <span className="text-[#8b949e]">Damping Ratio</span>
                            <input type="number" defaultValue="0.75" className="bg-[#0d1117] border border-[#30363d] w-20 text-center text-white p-1 rounded outline-none"/>
                         </label>
                         <label className="flex items-center justify-between text-[11px]">
                            <span className="text-[#8b949e]">Tire Grip Scale</span>
                            <input type="number" defaultValue="1.2" className="bg-[#0d1117] border border-[#30363d] w-20 text-center text-white p-1 rounded outline-none"/>
                         </label>
                     </div>
                  </div>
               </div>
            </div>
         )}
         
         {activeTab === 'voxel' && (
            <div className="max-w-5xl mx-auto space-y-6">
               <h1 className="text-2xl font-bold flex items-center gap-2"><Box className="text-[#e3b341]"/> Real-Time Voxel Engine Config</h1>
               <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 bg-[#161b22] border border-[#30363d] p-5 rounded">
                     <h2 className="text-sm font-bold text-white border-b border-[#30363d] pb-2 mb-4">Chunk & LOD Pipeline</h2>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-[#3fb950]/20 flex items-center justify-center shrink-0">
                              <Database size={20} className="text-[#3fb950]"/>
                           </div>
                           <div>
                              <div className="font-bold text-[12px] text-white">Octree Density Instancing</div>
                              <div className="text-[10px] text-[#8b949e]">Utilizes GPU compute shaders for rapid chunk meshing.</div>
                           </div>
                           <label className="ml-auto flex items-center">
                               <input type="checkbox" defaultChecked className="accent-[#e3b341] w-4 h-4"/>
                           </label>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-[#3fb950]/20 flex items-center justify-center shrink-0">
                              <Layers size={20} className="text-[#3fb950]"/>
                           </div>
                           <div>
                              <div className="font-bold text-[12px] text-white">Greedy Meshing Optimization</div>
                              <div className="text-[10px] text-[#8b949e]">Combines adjacent coplanar faces to reduce draw calls significantly.</div>
                           </div>
                           <label className="ml-auto flex items-center">
                               <input type="checkbox" defaultChecked className="accent-[#e3b341] w-4 h-4"/>
                           </label>
                        </div>
                     </div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded space-y-4">
                     <h2 className="text-sm font-bold text-white border-b border-[#30363d] pb-2">Generation Limits</h2>
                     <label className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8b949e]">Chunk Size</span>
                        <span className="text-white bg-[#0d1117] border border-[#30363d] px-2 py-1 rounded">32x32x32</span>
                     </label>
                     <label className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8b949e]">Render Distance</span>
                        <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none w-20">
                           <option>16 Chunks</option>
                           <option>32 Chunks</option>
                        </select>
                     </label>
                     <button className="w-full mt-4 bg-[#e3b341]/10 border border-[#e3b341]/50 text-[#e3b341] hover:bg-[#e3b341]/20 font-bold py-2 rounded transition-colors text-[11px]">
                        Rebuild Voxel Cache
                     </button>
                  </div>
               </div>
            </div>
         )}
         
         {activeTab === 'vrxr' && (
            <div className="max-w-5xl mx-auto space-y-6">
               <h1 className="text-2xl font-bold flex items-center gap-2"><Glasses className="text-[#3fb950]"/> OpenXR / VR Engine Configuration</h1>
               
               <div className="bg-[#161b22] border border-[#30363d] p-5 rounded space-y-4">
                  <h2 className="text-sm font-bold text-white border-b border-[#30363d] pb-2 text-[#3fb950]">Headset & Controller Tracking</h2>
                  <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-3">
                         <label className="flex items-center justify-between text-[11px]">
                            <span className="text-[#8b949e]">Tracking Origin</span>
                            <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none w-32">
                               <option>Floor Level</option>
                               <option>Eye Level</option>
                            </select>
                         </label>
                         <label className="flex items-center justify-between text-[11px]">
                            <span className="text-[#8b949e]">World Scale</span>
                            <div className="flex bg-[#0d1117] border border-[#30363d] rounded">
                               <input type="range" className="accent-[#3fb950] w-24 mx-2" defaultValue="100"/>
                               <span className="px-2 text-white font-mono w-12 text-center border-l border-[#30363d]">100</span>
                            </div>
                         </label>
                      </div>
                      <div className="space-y-3">
                         <label className="flex items-center gap-2 text-[11px]">
                             <input type="checkbox" defaultChecked className="accent-[#3fb950] w-3 h-3"/>
                             <span className="text-white">Enable Hand Tracking (If Supported)</span>
                         </label>
                         <label className="flex items-center gap-2 text-[11px]">
                             <input type="checkbox" defaultChecked className="accent-[#3fb950] w-3 h-3"/>
                             <span className="text-white">Instanced Stereo Rendering</span>
                         </label>
                         <label className="flex items-center gap-2 text-[11px]">
                             <input type="checkbox" defaultChecked className="accent-[#3fb950] w-3 h-3"/>
                             <span className="text-white">Foveated Rendering (Variable Rate)</span>
                         </label>
                      </div>
                  </div>
               </div>
            </div>
         )}
         {activeTab === 'bioevo' && (
            <div className="max-w-4xl mx-auto">
               <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Dna className="text-[#f85149]"/> Bio-Evolution Engine & Metamorphosis</h1>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                     <div className="bg-[#161b22] border border-[#f85149]/40 p-5 rounded-lg shadow-[0_0_15px_rgba(248,81,73,0.05)]">
                        <h3 className="text-xs font-bold text-[#c9d1d9] border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Settings size={14}/> Active Mutation Pathways</h3>
                        
                        <div className="space-y-3">
                           <label className="flex items-center gap-3 text-[11px] p-2 bg-[#0d1117] rounded border border-[#30363d] cursor-pointer hover:border-[#f85149]/50 transition-colors">
                               <input type="checkbox" defaultChecked className="accent-[#f85149] w-4 h-4"/>
                               <div className="flex-1">
                                  <span className="text-white font-bold block">Environmental Threshold Morphing</span>
                                  <span className="text-[#8b949e] mt-0.5 block">Entities mutate into new species when hazard stress exceeds 100%</span>
                               </div>
                           </label>
                           
                           <label className="flex items-center gap-3 text-[11px] p-2 bg-[#0d1117] rounded border border-[#30363d] cursor-pointer hover:border-[#58a6ff]/50 transition-colors">
                               <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-4 h-4"/>
                               <div className="flex-1">
                                  <span className="text-white font-bold block">Adaptive Convergence (Predation)</span>
                                  <span className="text-[#8b949e] mt-0.5 block">Predators can consume prey to steal elemental attributes</span>
                               </div>
                           </label>

                           <label className="flex items-center gap-3 text-[11px] p-2 bg-[#0d1117] rounded border border-[#30363d] cursor-pointer hover:border-[#3fb950]/50 transition-colors">
                               <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                               <div className="flex-1">
                                  <span className="text-white font-bold block">Symbiotic Mutualism</span>
                                  <span className="text-[#8b949e] mt-0.5 block">Different species merge to survive toxic/abyssal biomes</span>
                               </div>
                           </label>
                           
                           <label className="flex items-center gap-3 text-[11px] p-2 bg-[#0d1117] rounded border border-[#30363d] cursor-pointer hover:border-[#bc8cff]/50 transition-colors">
                               <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4"/>
                               <div className="flex-1">
                                  <span className="text-white font-bold block">Recessive Flaw Manifestation</span>
                                  <span className="text-[#8b949e] mt-0.5 block">Mutations have a chance to yield powerful defects (e.g. Failed Necrosis)</span>
                               </div>
                           </label>
                           
                           <label className="flex items-center gap-3 text-[11px] p-2 bg-[#0d1117] rounded border border-[#30363d] cursor-pointer hover:border-[#a371f7]/50 transition-colors">
                               <input type="checkbox" defaultChecked className="accent-[#a371f7] w-4 h-4"/>
                               <div className="flex-1">
                                  <span className="text-white font-bold block">Mechanical Crystallization</span>
                                  <span className="text-[#8b949e] mt-0.5 block">Electromagnetic storms can convert organic tissue into bio-mech structures</span>
                               </div>
                           </label>

                           <label className="flex items-center gap-3 text-[11px] p-2 bg-[#0d1117] rounded border border-[#30363d] cursor-pointer hover:border-[#d29922]/50 transition-colors">
                               <input type="checkbox" defaultChecked className="accent-[#d29922] w-4 h-4"/>
                               <div className="flex-1">
                                  <span className="text-white font-bold block">Chrono-Reversal Evolution</span>
                                  <span className="text-[#8b949e] mt-0.5 block">Chrono-radiation reverts entities back to their primordial ancestors</span>
                               </div>
                           </label>

                           <label className="flex items-center gap-3 text-[11px] p-2 bg-[#0d1117] rounded border border-[#30363d] cursor-pointer hover:border-[#4ade80]/50 transition-colors">
                               <input type="checkbox" defaultChecked className="accent-[#4ade80] w-4 h-4"/>
                               <div className="flex-1">
                                  <span className="text-white font-bold block">Gravitational Shift</span>
                                  <span className="text-[#8b949e] mt-0.5 block">Localized gravitational stress alters entity mass and movement dynamics</span>
                               </div>
                           </label>

                           <label className="flex items-center gap-3 text-[11px] p-2 bg-[#0d1117] rounded border border-[#30363d] cursor-pointer hover:border-[#e879f9]/50 transition-colors">
                               <input type="checkbox" defaultChecked className="accent-[#e879f9] w-4 h-4"/>
                               <div className="flex-1">
                                  <span className="text-white font-bold block">Subatomic Resonance</span>
                                  <span className="text-[#8b949e] mt-0.5 block">Quantum probability collapses cause phase-shifting and erratic blinking adaptations</span>
                               </div>
                           </label>
                        </div>
                     </div>

                     <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg">
                        <h3 className="text-xs font-bold text-[#c9d1d9] border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Activity size={14}/> Stress Accumulation Rates</h3>
                        <div className="space-y-4">
                           <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                 <span className="text-[#8b949e]">Thermal (Lava/Fire)</span>
                                 <span className="text-[#f85149] font-mono">15.0 / sec</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden">
                                 <div className="h-full bg-[#f85149]" style={{ width: '80%' }}></div>
                              </div>
                           </div>
                           <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                 <span className="text-[#8b949e]">Toxic/Radioactive</span>
                                 <span className="text-[#3fb950] font-mono">8.5 / sec</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden">
                                 <div className="h-full bg-[#3fb950]" style={{ width: '45%' }}></div>
                              </div>
                           </div>
                           <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                 <span className="text-[#8b949e]">Absolute Zero</span>
                                 <span className="text-[#58a6ff] font-mono">12.0 / sec</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden">
                                 <div className="h-full bg-[#58a6ff]" style={{ width: '65%' }}></div>
                              </div>
                           </div>
                           <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                 <span className="text-[#8b949e]">Abyssal Pressure</span>
                                 <span className="text-[#bc8cff] font-mono">5.0 / sec</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden">
                                 <div className="h-full bg-[#bc8cff]" style={{ width: '25%' }}></div>
                              </div>
                           </div>
                           <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                 <span className="text-[#8b949e]">Chrono-Radiation</span>
                                 <span className="text-[#d29922] font-mono">0.8 / sec</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden">
                                 <div className="h-full bg-[#d29922]" style={{ width: '12%' }}></div>
                              </div>
                           </div>
                           <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                 <span className="text-[#8b949e]">Localized Gravity</span>
                                 <span className="text-[#4ade80] font-mono">7.4 / sec</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden">
                                 <div className="h-full bg-[#4ade80]" style={{ width: '40%' }}></div>
                              </div>
                           </div>
                           <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                 <span className="text-[#8b949e]">Electromagnetic Storm</span>
                                 <span className="text-[#a371f7] font-mono">4.2 / sec</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden">
                                 <div className="h-full bg-[#a371f7]" style={{ width: '38%' }}></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg flex flex-col h-full">
                        <h3 className="text-xs font-bold text-[#c9d1d9] border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><BarChart2 size={14}/> Probability Distributions</h3>
                        
                        <div className="flex-1 flex flex-col items-center justify-center py-6">
                           <div className="relative w-48 h-48 rounded-full border-4 border-[#30363d] flex items-center justify-center shadow-[0_0_30px_rgba(248,81,73,0.15)]">
                              {/* Mock Donut Chart Segments built with CSS conic-gradient */}
                              <div 
                                className="absolute inset-0 rounded-full" 
                                style={{
                                   background: 'conic-gradient(#58a6ff 0% 15%, #bc8cff 15% 20%, #30363d 20% 70%, #f85149 70% 100%)',
                                   clipPath: 'circle(50% at 50% 50%)'
                                }}
                              >
                                 <div className="absolute inset-4 bg-[#161b22] rounded-full flex flex-col items-center justify-center">
                                    <span className="text-[#8b949e] text-[10px] uppercase font-bold tracking-widest mb-1">Next Cycle</span>
                                    <span className="text-white text-2xl font-mono font-bold">142</span>
                                    <span className="text-[#f85149] text-[10px] font-bold">Pending Morphs</span>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-8 w-full">
                              <div className="flex items-center gap-2 text-[11px]">
                                 <div className="w-3 h-3 bg-[#30363d] rounded-sm"></div>
                                 <span className="text-[#8b949e] flex-1">Minor Traits</span>
                                 <span className="text-white font-mono">40%</span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px]">
                                 <div className="w-3 h-3 bg-[#f85149] rounded-sm shadow-[0_0_5px_#f85149]"></div>
                                 <span className="text-[#8b949e] flex-1">Complete Morph</span>
                                 <span className="text-white font-mono">30%</span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px]">
                                 <div className="w-3 h-3 bg-[#58a6ff] rounded-sm"></div>
                                 <span className="text-[#8b949e] flex-1">Symbiosis</span>
                                 <span className="text-white font-mono">15%</span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px]">
                                 <div className="w-3 h-3 bg-[#a371f7] rounded-sm"></div>
                                 <span className="text-[#8b949e] flex-1">Crystallization</span>
                                 <span className="text-white font-mono">10%</span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px]">
                                 <div className="w-3 h-3 bg-[#4ade80] rounded-sm"></div>
                                 <span className="text-[#8b949e] flex-1">Grav. Shift</span>
                                 <span className="text-white font-mono">8%</span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px]">
                                 <div className="w-3 h-3 bg-[#e879f9] rounded-sm"></div>
                                 <span className="text-[#8b949e] flex-1">Phase Drift</span>
                                 <span className="text-white font-mono">4%</span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px]">
                                 <div className="w-3 h-3 bg-[#bc8cff] rounded-sm shadow-[0_0_5px_#bc8cff]"></div>
                                 <span className="text-[#8b949e] flex-1">Failed Necrosis</span>
                                 <span className="text-white font-mono">3%</span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px]">
                                 <div className="w-3 h-3 bg-[#d29922] rounded-sm shadow-[0_0_5px_#d29922]"></div>
                                 <span className="text-[#8b949e] flex-1">Chrono-Reversal</span>
                                 <span className="text-white font-mono">2%</span>
                              </div>
                           </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#30363d] flex gap-3">
                           <button className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-white py-2 rounded text-[11px] font-bold border border-[#30363d] transition-colors">Force Global Trigger</button>
                           <button className="flex-1 bg-[#f85149] hover:bg-[#ff7b72] text-[#0d1117] py-2 rounded text-[11px] font-bold transition-colors">Purge Unstable DNA</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
