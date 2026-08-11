import React, { useState } from 'react';
import { Grid, Layers, Activity, Zap, Server, Code, Sparkles, AudioWaveform, UserSquare, Maximize, Cpu, Box, Camera, Play, Settings, Database, CloudRain, Sun, Moon, Map, Share2, Eye, GitBranch} from 'lucide-react';

export default function NextGenEngineHub() {
  const [activeTab, setActiveTab] = useState('megalights');

  const features = [
    { id: 'megalights', name: 'MegaLights & Rendering', icon: <Sparkles size={16} />, desc: 'Global Illumination & Hardware Raytracing' },
    { id: 'motion', name: 'Motion Matching', icon: <Activity size={16} />, desc: 'AI-driven Animation Blending' },
    { id: 'metahuman', name: 'Local MetaHuman', icon: <UserSquare size={16} />, desc: 'Next-gen Digital Human Creator' },
    { id: 'metasounds', name: 'MetaSounds', icon: <AudioWaveform size={16} />, desc: 'Procedural Audio DSP Graph' },
    { id: 'substrate', name: 'Substrate Materials', icon: <Layers size={16} />, desc: 'Multi-BRDF Material Authoring' },
    { id: 'scan', name: 'RealityScan & ICVFX', icon: <Maximize size={16} />, desc: 'Photogrammetry & Virtual Production' },
    { id: 'dots', name: 'DOTS & Mass Entity', icon: <Code size={16} />, desc: 'Data-Oriented Tech Stack (ECS)' },
    { id: 'streaming', name: 'Pixel Streaming 2', icon: <Server size={16} />, desc: 'Cloud Rendering Delivery' },
    { id: 'nanite', name: 'Micro-polygon Engine', icon: <Box size={16} />, desc: 'Virtual Geometry (Nanite Eq.)' },
    { id: 'chaos', name: 'Chaos Physics', icon: <Zap size={16} />, desc: 'Rigid body & Destruction' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-gray-300 font-sans">
      <div className="flex items-center justify-between p-4 border-b border-[#2a2b3d] bg-[#161622] shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <Cpu className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white uppercase tracking-wider">Next-Gen Architecture Hub</h1>
            <p className="text-xs text-gray-400">UE5 + Unity DOTS + Custom Deep Engine Integrations</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2b3d] hover:bg-[#3a3b4d] text-white rounded text-xs font-bold transition-colors">
            <Activity size={14} /> Global Engine Profiler
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/50 rounded text-xs font-bold transition-colors">
            <Play size={14} /> Compile Core Modules
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-[#2a2b3d] bg-[#101018] flex flex-col p-3 gap-1 overflow-y-auto hide-scrollbar">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Core Engine Systems</div>
          {features.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveTab(f.id)}
              className={`flex flex-col items-start gap-1 p-3 rounded-lg text-sm font-medium transition-colors border ${activeTab === f.id ? 'bg-indigo-600/20 text-white border-indigo-500/50 shadow-[inset_0_0_20px_rgba(79,70,229,0.2)]' : 'bg-[#1a1a24] border-[#2a2b3d] hover:border-[#4a4b5d] text-gray-400'}`}
            >
              <div className="flex items-center gap-2 font-bold">
                <span className={activeTab === f.id ? 'text-indigo-400' : 'text-gray-500'}>{f.icon}</span> 
                {f.name}
              </div>
              <span className="text-[10px] text-gray-500 ml-6 text-left leading-tight">{f.desc}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative bg-[#0a0a0f] p-6">
           <div className="absolute top-4 right-4 text-[10px] font-mono text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded bg-indigo-500/10">CORE_MODULE_ACTIVE</div>
           
           {activeTab === 'megalights' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="border-b border-[#2a2b3d] pb-4">
                  <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                    <Sparkles className="text-yellow-400" size={32}/> MegaLights & Dynamic GI
                  </h2>
                  <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-3xl">
                    Implement cinematic-quality lighting in real-time. Supports millions of local area lights without performance degradation. Uses a clustered deferred renderer combined with stochastic light sampling and Hardware Ray Tracing (Vulkan/DX12).
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Realtime Preview Mock */}
                  <div className="bg-[#161622] rounded-xl border border-[#2a2b3d] overflow-hidden flex flex-col">
                    <div className="bg-[#1e1e2d] px-4 py-2 border-b border-[#2a2b3d] flex justify-between items-center text-xs font-bold text-gray-400">
                      <span>Viewport: Lit (Lumen/MegaLights)</span>
                      <span className="text-green-400 flex items-center gap-1"><Activity size={12}/> 120 FPS | 8.2ms</span>
                    </div>
                    <div className="h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative flex items-center justify-center p-8">
                       {/* Mock 3D scene with lights */}
                       <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                       <div className="relative w-32 h-32 bg-gray-800 rounded-lg shadow-[0_0_60px_rgba(250,204,21,0.4)] border border-gray-600 transform rotate-12 flex items-center justify-center">
                          <div className="w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                       </div>
                       <div className="absolute bottom-10 left-10 w-12 h-12 bg-blue-500/50 rounded-full blur-2xl"></div>
                       <div className="absolute top-10 right-10 w-16 h-16 bg-red-500/50 rounded-full blur-2xl"></div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="bg-[#161622] rounded-xl border border-[#2a2b3d] p-4 flex flex-col gap-4">
                    <h3 className="font-bold text-white text-sm">Light Evaluation & Caching</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Light Sampling Cache</span><span className="text-white">High (Stochastic)</span></div>
                        <input type="range" className="w-full accent-indigo-500" defaultValue="80" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Ray Tracing Bounces</span><span className="text-white">4 Bounces</span></div>
                        <input type="range" className="w-full accent-indigo-500" defaultValue="4" min="1" max="16" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-[#1e1e2d] rounded border border-[#2a2b3d]">
                        <span className="text-xs font-medium text-gray-300">Volumetric Fog Integration</span>
                        <div className="w-8 h-4 bg-indigo-500 rounded-full relative"><div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div></div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-[#1e1e2d] rounded border border-[#2a2b3d]">
                        <span className="text-xs font-medium text-gray-300">Virtual Shadow Maps</span>
                        <div className="w-8 h-4 bg-indigo-500 rounded-full relative"><div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div></div>
                      </div>
                    </div>
                    
                    <div className="mt-auto p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-start gap-3">
                       <Cpu className="text-blue-400 mt-0.5 shrink-0" size={16} />
                       <div className="text-xs text-blue-200">
                         <strong>AI Offline Optimizer:</strong> Auto-tuning light bounds and culling based on camera frustum. Saves ~2.4ms per frame.
                       </div>
                    </div>
                  </div>
                </div>
             </div>
           )}

           {activeTab === 'motion' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="border-b border-[#2a2b3d] pb-4">
                  <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                    <Activity className="text-green-400" size={32}/> Motion Matching
                  </h2>
                  <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-3xl">
                    A revolutionary animation system that discards complex State Machines. It continuously searches a massive database of raw motion capture data to find the pose that best matches the character's current velocity, input, and physics trajectory.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Database Panel */}
                  <div className="bg-[#161622] rounded-xl border border-[#2a2b3d] p-4 flex flex-col gap-4">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2"><Database size={16}/> Pose Database</h3>
                    <div className="text-3xl font-black text-green-400">142,850</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Active Frames Indexed</div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-xs bg-[#1e1e2d] p-2 rounded"><span>Locomotion_Walk</span><span className="text-gray-400">12m 40s</span></div>
                      <div className="flex justify-between text-xs bg-[#1e1e2d] p-2 rounded"><span>Locomotion_Run</span><span className="text-gray-400">8m 15s</span></div>
                      <div className="flex justify-between text-xs bg-[#1e1e2d] p-2 rounded"><span>Combat_Melee_Sword</span><span className="text-gray-400">45m 20s</span></div>
                    </div>
                    <button className="mt-auto w-full bg-[#2a2b3d] hover:bg-[#3a3b4d] text-white text-xs py-2 rounded">Import FBX/BVH</button>
                  </div>

                  {/* Visualizer */}
                  <div className="col-span-2 bg-[#161622] rounded-xl border border-[#2a2b3d] overflow-hidden flex flex-col">
                    <div className="bg-[#1e1e2d] px-4 py-2 border-b border-[#2a2b3d] flex justify-between items-center text-xs font-bold text-gray-400">
                      <span>Trajectory Prediction & Cost Function</span>
                    </div>
                    <div className="h-full min-h-[300px] bg-[#0a0a0f] relative p-6">
                       {/* Abstract visualization of trajectory matching */}
                       <svg className="w-full h-full" viewBox="0 0 400 200">
                         {/* Future Trajectory */}
                         <path d="M 50 150 Q 150 150 200 100 T 350 50" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="5 5" className="animate-[dash_2s_linear_infinite]"/>
                         {/* Current Pose Point */}
                         <circle cx="50" cy="150" r="8" fill="#fff" />
                         {/* Predicted Future Points */}
                         <circle cx="125" cy="140" r="4" fill="#4ade80" />
                         <circle cx="200" cy="100" r="4" fill="#4ade80" />
                         <circle cx="275" cy="65" r="4" fill="#4ade80" />
                         <circle cx="350" cy="50" r="4" fill="#4ade80" />
                         
                         {/* KD-Tree Search Visualization */}
                         <g className="opacity-30">
                           <line x1="200" y1="100" x2="180" y2="70" stroke="#fff" strokeWidth="1" />
                           <line x1="200" y1="100" x2="220" y2="130" stroke="#fff" strokeWidth="1" />
                           <circle cx="180" cy="70" r="3" fill="#ef4444" />
                           <circle cx="220" cy="130" r="3" fill="#3b82f6" />
                         </g>
                       </svg>
                       <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-2 rounded text-xs border border-gray-800">
                         <span className="text-gray-400">Current Cost:</span> <span className="text-green-400 font-mono">0.0124 (Optimal)</span><br/>
                         <span className="text-gray-400">Query Time:</span> <span className="text-white font-mono">0.4 ms</span>
                       </div>
                    </div>
                  </div>
                </div>
             </div>
           )}

           {activeTab === 'metahuman' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="border-b border-[#2a2b3d] pb-4">
                  <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                    <UserSquare className="text-blue-400" size={32}/> Local MetaHuman Creator
                  </h2>
                  <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-3xl">
                    Create photorealistic digital humans directly inside the engine. Advanced DNA calibration, strand-based hair rendering, and real-time facial rigging.
                  </p>
                </div>
                
                <div className="flex gap-6 h-[500px]">
                  <div className="w-64 bg-[#161622] rounded-xl border border-[#2a2b3d] flex flex-col p-4 overflow-y-auto hide-scrollbar">
                    <h3 className="font-bold text-white text-xs mb-4 uppercase tracking-widest">DNA Sliders</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[10px] mb-1 text-gray-400"><span>Jaw Width</span><span>0.65</span></div>
                        <input type="range" className="w-full accent-blue-500 h-1" defaultValue="65" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-1 text-gray-400"><span>Cheekbone Depth</span><span>0.32</span></div>
                        <input type="range" className="w-full accent-blue-500 h-1" defaultValue="32" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-1 text-gray-400"><span>Eye Spacing</span><span>0.50</span></div>
                        <input type="range" className="w-full accent-blue-500 h-1" defaultValue="50" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-1 text-gray-400"><span>Nose Bridge</span><span>0.80</span></div>
                        <input type="range" className="w-full accent-blue-500 h-1" defaultValue="80" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-1 text-gray-400"><span>Lip Fullness</span><span>0.45</span></div>
                        <input type="range" className="w-full accent-blue-500 h-1" defaultValue="45" />
                      </div>
                    </div>
                    
                    <div className="mt-8">
                       <h3 className="font-bold text-white text-xs mb-3 uppercase tracking-widest">Skin Shading</h3>
                       <div className="grid grid-cols-3 gap-2">
                         <div className="w-full aspect-square rounded bg-[#fbc0a2] cursor-pointer border-2 border-blue-500"></div>
                         <div className="w-full aspect-square rounded bg-[#8d5524] cursor-pointer"></div>
                         <div className="w-full aspect-square rounded bg-[#c68642] cursor-pointer"></div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-[#161622] rounded-xl border border-[#2a2b3d] flex items-center justify-center relative overflow-hidden">
                     {/* 3D Viewport Mock */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900 to-[#1a1a24]"></div>
                     <UserSquare size={200} className="text-gray-700/50 relative z-10" strokeWidth={0.5} />
                     <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-gray-400 border border-gray-700">
                        85,420 Verts | 12 Materials | SSS Profile Active
                     </div>
                     <div className="absolute bottom-4 left-4 flex gap-2">
                        <button className="bg-[#2a2b3d] p-2 rounded hover:bg-[#3a3b4d]"><Eye size={16}/></button>
                        <button className="bg-[#2a2b3d] p-2 rounded hover:bg-[#3a3b4d]"><Sun size={16}/></button>
                        <button className="bg-blue-600 p-2 rounded hover:bg-blue-500 text-white font-bold text-xs px-4">Generate Rig (ControlRig)</button>
                     </div>
                  </div>
                </div>
             </div>
           )}

           {activeTab === 'dots' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="border-b border-[#2a2b3d] pb-4">
                  <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                    <Code className="text-purple-400" size={32}/> DOTS & Mass Entity
                  </h2>
                  <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-3xl">
                    Data-Oriented Technology Stack. Shifts programming from Object-Oriented (OOP) to Data-Oriented (DOP). Components are stored contiguously in memory arrays, maximizing CPU L1/L2 cache hits. Combined with Job Systems for perfect multi-threading.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#161622] rounded-xl border border-[#2a2b3d] p-6">
                     <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Grid size={18} className="text-purple-400"/> Memory Layout: OOP vs DOTS</h3>
                     <div className="space-y-6">
                       <div>
                         <h4 className="text-xs text-red-400 font-bold mb-2">Traditional OOP (Cache Misses)</h4>
                         <div className="flex gap-1 flex-wrap">
                           {[...Array(20)].map((_, i) => (
                             <div key={i} className={`w-6 h-6 ${i % 3 === 0 ? 'bg-red-500' : 'bg-gray-800'} rounded border border-gray-700`}></div>
                           ))}
                         </div>
                         <p className="text-[10px] text-gray-500 mt-1">Data scattered across the heap. Pointer chasing.</p>
                       </div>
                       <div>
                         <h4 className="text-xs text-green-400 font-bold mb-2">DOTS ECS (Contiguous Memory)</h4>
                         <div className="flex gap-1 flex-wrap">
                           {[...Array(20)].map((_, i) => (
                             <div key={i} className={`w-6 h-6 ${i < 7 ? 'bg-green-500' : 'bg-gray-800'} rounded border border-gray-700`}></div>
                           ))}
                         </div>
                         <p className="text-[10px] text-gray-500 mt-1">Packed tightly in Archetype Chunks. Blazing fast iteration.</p>
                       </div>
                     </div>
                  </div>
                  
                  <div className="bg-[#161622] rounded-xl border border-[#2a2b3d] p-4 flex flex-col">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white text-sm">Burst Compiler / ISPC</h3>
                        <span className="bg-purple-900/40 text-purple-300 border border-purple-500/50 px-2 py-0.5 rounded text-[10px] font-mono">SIMD VECTORIZED</span>
                     </div>
                     <div className="flex-1 bg-[#0a0a0f] rounded border border-[#2a2b3d] p-4 font-mono text-xs overflow-auto">
                        <div className="text-gray-500">// Native Code Output (AVX2/SSE4)</div>
                        <div className="text-blue-400">vmovaps <span className="text-green-300">ymm0</span>, ymmword ptr [rcx]</div>
                        <div className="text-blue-400">vaddps <span className="text-green-300">ymm0</span>, ymm0, ymmword ptr [rdx]</div>
                        <div className="text-blue-400">vmovaps <span className="text-white">ymmword ptr [r8]</span>, ymm0</div>
                        <div className="text-gray-500 mt-2">// Processed 8 floats in a single CPU cycle</div>
                     </div>
                  </div>
                </div>
             </div>
           )}

           {/* Generic Placeholder for others */}
           {!['megalights', 'motion', 'metahuman', 'dots'].includes(activeTab) && (
             <div className="flex items-center justify-center h-full flex-col text-gray-500 gap-4 animate-in fade-in">
               <Settings size={48} className="animate-spin-slow opacity-20" />
               <div className="text-center">
                 <h2 className="text-xl font-bold text-white mb-2 capitalize">{activeTab} System</h2>
                 <p className="max-w-md mx-auto text-sm">This advanced engine architecture module is currently being compiled into the workspace. Advanced parameters will be available shortly.</p>
               </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
