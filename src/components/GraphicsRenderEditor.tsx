import React, { useState } from 'react';
import { MonitorPlay, Settings2, Zap, Layers, RefreshCw, Cpu, Activity, Info, Sliders, ServerCog, Box, Maximize, Target, DatabaseZap } from 'lucide-react';

export default function GraphicsRenderEditor() {
  const [activeTab, setActiveTab] = useState('optimization');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#c9d1d9] font-sans">
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff7b72]/10 to-transparent pointer-events-none"></div>
        <MonitorPlay size={28} className="text-[#ff7b72] mr-4 shadow-[0_0_15px_rgba(255,123,114,0.4)]" />
        <div className="flex flex-col z-10">
          <h2 className="text-white text-[16px] font-bold tracking-tight">Graphics & Rendering Optimization</h2>
          <p className="text-[#8b949e] text-[11px]">Maximum graphical fidelity with minimum hardware specifications. (FPS Boost)</p>
        </div>
      </div>

      <div className="flex bg-[#161b22] border-b border-[#30363d] h-10 px-4">
        <button onClick={() => setActiveTab('optimization')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'optimization' ? 'text-[#ff7b72] border-b-2 border-[#ff7b72]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><Zap size={14}/> Auto-Optimization</button>
        <button onClick={() => setActiveTab('rendering')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'rendering' ? 'text-[#58a6ff] border-b-2 border-[#58a6ff]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><Layers size={14}/> Rendering Tech</button>
        <button onClick={() => setActiveTab('culling')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'culling' ? 'text-[#3fb950] border-b-2 border-[#3fb950]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><Settings2 size={14}/> Culling & LOD</button>
        <button onClick={() => setActiveTab('smart-lod')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'smart-lod' ? 'text-[#a371f7] border-b-2 border-[#a371f7]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><Box size={14}/> Smart LOD Pipeline</button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {activeTab === 'optimization' && (
            <div className="space-y-6">
              <div className="bg-[#161b22] border border-[#ff7b72]/30 rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7b72] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Zap className="text-[#ff7b72]"/> 1-Click Absolute Optimization</h2>
                    <p className="text-[#8b949e] text-sm mt-2 max-w-xl">Apply industry-standard ML heuristics to analyze your game scene and automatically configure LODs, texture streaming, and occlusion boundaries for maximum FPS.</p>
                  </div>
                  <button className="bg-[#ff7b72] hover:bg-[#ff7b72]/80 text-[#0a0a0a] font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-[0_0_20px_rgba(255,123,114,0.3)] transition-all">
                    <RefreshCw size={18}/> Optimize Project Now
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Cpu size={16} className="text-[#58a6ff]"/> Memory & Streaming</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d]">
                      <div>
                        <div className="text-white font-bold">Asynchronous Texture Streaming</div>
                        <div className="text-[#8b949e] text-[10px] mt-0.5">Reduce initial load times and improve runtime memory efficiency by loading textures in the background.</div>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-4 h-4"/>
                    </label>
                    <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d]">
                      <div>
                        <div className="text-white font-bold">Virtual Texture Streaming</div>
                        <div className="text-[#8b949e] text-[10px] mt-0.5">Stream high-res textures only when visible.</div>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-4 h-4"/>
                    </label>
                    <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d]">
                      <div>
                        <div className="text-white font-bold">Object Pooling Aggressiveness</div>
                        <div className="text-[#8b949e] text-[10px] mt-0.5">Preallocate memory to prevent GC spikes.</div>
                      </div>
                      <select className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-white outline-none">
                        <option>Moderate</option>
                        <option selected>Aggressive (Max FPS)</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Activity size={16} className="text-[#e3b341]"/> Performance Targets</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d]">
                      <div>
                        <div className="text-white font-bold">Target Frame Rate (FPS)</div>
                        <div className="text-[#8b949e] text-[10px] mt-0.5">Dynamic resolution scales to meet target.</div>
                      </div>
                      <select className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-white outline-none">
                        <option>60 FPS</option>
                        <option selected>120 FPS</option>
                        <option>Unlimited</option>
                      </select>
                    </label>
                    <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d]">
                      <div>
                        <div className="text-white font-bold">Dynamic Resolution Scaling</div>
                        <div className="text-[#8b949e] text-[10px] mt-0.5">Automatically lower res during heavy GPU load.</div>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-[#e3b341] w-4 h-4"/>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Layers size={16} className="text-[#bc8cff]"/> Multi-GPU Workload Distribution (Cross-Vendor)</h3>
                <p className="text-[#8b949e] text-[12px] mb-4">Utilize multiple GPUs simultaneously, including integrated and discrete GPUs from different vendors (e.g., AMD and NVIDIA), splitting workloads intelligently for maximum performance.</p>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-start gap-3 text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d]">
                    <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4 mt-1"/>
                    <div>
                      <div className="text-white font-bold">Asynchronous Compute (AI & Physics)</div>
                      <div className="text-[#8b949e] text-[10px] mt-0.5">Offload AI pathfinding, neural networks, and physics simulations to the secondary GPU (e.g., Integrated Graphics) while saving the primary GPU for rendering.</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d]">
                    <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4 mt-1"/>
                    <div>
                      <div className="text-white font-bold">Explicit Multi-GPU Rendering (mGPU)</div>
                      <div className="text-[#8b949e] text-[10px] mt-0.5">Use alternate frame rendering (AFR) or split frame rendering (SFR) across devices via DirectX 12 / Vulkan. Vendor agnostic.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rendering' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Layers className="text-[#58a6ff]"/> Advanced Rendering Tech</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg flex items-start gap-4">
                   <div className="p-3 bg-[#bc8cff]/10 rounded-lg text-[#bc8cff]"><MonitorPlay size={24}/></div>
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                         <h3 className="text-white font-bold text-[14px]">AI Upscaling (DLSS / FSR / XeSS)</h3>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" defaultChecked className="sr-only peer" />
                           <div className="w-9 h-5 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#8b949e] peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bc8cff]"></div>
                         </label>
                      </div>
                      <p className="text-[#8b949e] text-[11px] mb-3">Render at lower internal resolution and use AI to reconstruct high-quality images. Massive FPS boost.</p>
                      <div className="flex gap-2">
                        <select className="bg-[#0d1117] border border-[#30363d] text-[11px] px-2 py-1 rounded outline-none text-[#c9d1d9]">
                           <option>DLSS (NVIDIA)</option>
                           <option selected>FSR 3.0 (AMD/Universal)</option>
                           <option>XeSS (Intel)</option>
                        </select>
                        <select className="bg-[#0d1117] border border-[#30363d] text-[11px] px-2 py-1 rounded outline-none text-[#c9d1d9]">
                           <option>Quality</option>
                           <option selected>Balanced</option>
                           <option>Performance</option>
                        </select>
                      </div>
                   </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg flex items-start gap-4">
                   <div className="p-3 bg-[#e3b341]/10 rounded-lg text-[#e3b341]"><ServerCog size={24}/></div>
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                         <h3 className="text-white font-bold text-[14px]">Real-Time Global Illumination (GI)</h3>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" defaultChecked className="sr-only peer" />
                           <div className="w-9 h-5 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#8b949e] peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e3b341]"></div>
                         </label>
                      </div>
                      <p className="text-[#8b949e] text-[11px] mb-3">Bounced lighting and reflections. Software Ray-Traced (SDF) provides high quality with low-spec requirements.</p>
                      <div className="flex gap-4 items-center">
                         <label className="flex items-center gap-2 text-[11px] text-[#c9d1d9]">
                            <input type="radio" name="gi-mode" className="accent-[#e3b341]"/>
                            Hardware Raytracing (RTX)
                         </label>
                         <label className="flex items-center gap-2 text-[11px] text-[#c9d1d9]">
                            <input type="radio" name="gi-mode" defaultChecked className="accent-[#e3b341]"/>
                            Software Tracing (SDF) - Fast
                         </label>
                         <label className="flex items-center gap-2 text-[11px] text-[#c9d1d9]">
                            <input type="radio" name="gi-mode" className="accent-[#e3b341]"/>
                            Baked Lightmaps (Mobile)
                         </label>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'culling' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Settings2 className="text-[#3fb950]"/> Geometry & Culling Techniques</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg space-y-4">
                  <h3 className="text-white font-bold border-b border-[#30363d] pb-2">Level of Detail (LOD) Management</h3>
                  <p className="text-[#8b949e] text-[11px]">Automatically swap meshes depending on camera distance to optimize the rendering pipeline.</p>
                  
                  <div className="space-y-2">
                     <label className="flex items-center justify-between text-[11px]">
                        <span className="text-[#c9d1d9]">Enable Mesh LODs</span>
                        <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                     </label>
                     <label className="flex items-center justify-between text-[11px]">
                        <span className="text-[#c9d1d9]">Auto-Compute LOD Distances</span>
                        <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                     </label>
                  </div>

                  <h3 className="text-white font-bold border-b border-[#30363d] pb-2 mt-6">Virtual Geometry (Micro-polygons)</h3>
                  <p className="text-[#8b949e] text-[11px]">Stream cinematic-quality meshes with millions of polygons by automatically scaling triangles to pixel-size in real-time. Eliminates manual LOD creation.</p>
                  
                  <div className="flex items-center justify-between bg-[#0d1117] p-2 rounded border border-[#30363d]">
                     <span className="text-[12px] font-bold text-[#3fb950]">Enable Virtual Geometry</span>
                     <input type="checkbox" className="accent-[#3fb950] w-4 h-4"/>
                  </div>
                  
                  <div className="p-3 bg-[#3fb950]/10 border border-[#3fb950]/20 rounded text-[11px] text-[#3fb950] flex gap-2 items-start">
                     <Info size={14} className="shrink-0 mt-0.5"/>
                     <p>When enabled, standard LODs are ignored. Geometry is directly streamed from disk to GPU memory based on screen cluster projection.</p>
                  </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg space-y-4">
                  <h3 className="text-white font-bold border-b border-[#30363d] pb-2">Frustum & Occlusion Culling</h3>
                  <p className="text-[#8b949e] text-[11px]">Do not render what the camera cannot see or what is blocked by other objects. Saves massive GPU cycles.</p>

                  <div className="space-y-2">
                     <label className="flex items-center justify-between text-[11px]">
                        <span className="text-[#c9d1d9]">Frustum Culling</span>
                        <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                     </label>
                     <label className="flex items-center justify-between text-[11px]">
                        <span className="text-[#c9d1d9]">GPU Culling (Compute Shader)</span>
                        <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                     </label>
                     <label className="flex items-center justify-between text-[11px]">
                        <span className="text-[#c9d1d9]">Hierarchical Z-Buffer Occlusion</span>
                        <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                     </label>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#30363d]">
                     <span className="text-[11px] font-bold text-white block mb-2">Distance Culling Multiplier</span>
                     <div className="flex items-center gap-3">
                        <input type="range" className="flex-1 accent-[#3fb950]" min="0" max="2" step="0.1" defaultValue="1.0" />
                        <span className="text-[11px] text-white bg-[#0d1117] px-2 py-1 rounded border border-[#30363d] font-mono">1.0x</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'smart-lod' && (
            <div className="space-y-6">
              <div className="bg-[#161b22] border border-[#a371f7]/40 rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a371f7] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Box className="text-[#a371f7]"/> Intelligent LOD & Virtual Geometry Pipeline</h2>
                    <p className="text-[#8b949e] text-sm mt-2 max-w-2xl leading-relaxed">A Deterministic (Non-AI) system engineered for hyper-realistic graphics on minimal hardware. Streams millions of polygons by strictly aligning geometry data with screen-space pixel projection, bypassing CPU bottlenecks.</p>
                  </div>
                  <button className="bg-[#a371f7] hover:bg-[#a371f7]/80 text-[#0a0a0a] font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-[0_0_20px_rgba(163,113,247,0.3)] transition-all">
                    <DatabaseZap size={18}/> Rebuild LOD Clusters
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Micro-Polygon */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3 border-b border-[#30363d] pb-3">
                     <div className="p-2 bg-[#a371f7]/10 rounded-lg text-[#a371f7]"><Target size={18}/></div>
                     <h3 className="text-white font-bold text-[13px]">1. Micro-Polygon Virtualized Geometry</h3>
                  </div>
                  <p className="text-[#8b949e] text-[11px] leading-relaxed mb-4">
                     Groups dense triangles into clusters. Strictly streams and renders clusters resolving only to the screen's pixel size. Unloads unseen clusters from VRAM instantly.
                  </p>
                  <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d]">
                     <span className="text-white font-bold">Enable Cluster Streaming</span>
                     <input type="checkbox" defaultChecked className="accent-[#a371f7] w-4 h-4"/>
                  </label>
                </div>

                {/* 2. Hardware Instancing */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3 border-b border-[#30363d] pb-3">
                     <div className="p-2 bg-[#3fb950]/10 rounded-lg text-[#3fb950]"><Layers size={18}/></div>
                     <h3 className="text-white font-bold text-[13px]">2. Hardware Instancing & GPU Culling</h3>
                  </div>
                  <p className="text-[#8b949e] text-[11px] leading-relaxed mb-4">
                     Dispatches bounding boxes directly to Compute Shaders for hardware frustum culling. Render 100,000 dense actors (like trees or crowds) with massive draw call reduction.
                  </p>
                  <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d]">
                     <span className="text-white font-bold">Strict GPU Compute Culling</span>
                     <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                  </label>
                </div>

                {/* 3. VSM & SSGI */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3 border-b border-[#30363d] pb-3">
                     <div className="p-2 bg-[#e3b341]/10 rounded-lg text-[#e3b341]"><Zap size={18}/></div>
                     <h3 className="text-white font-bold text-[13px]">3. Virtual Shadow Maps (VSM) & SSGI</h3>
                  </div>
                  <p className="text-[#8b949e] text-[11px] leading-relaxed mb-4">
                     Virtualizes shadow maps strictly where shadow fidelity is needed based on screen projection. Fused with Screen-Space Global Illumination for light bounce.
                  </p>
                  <div className="flex items-center gap-3 bg-[#161b22] p-3 rounded border border-[#30363d]">
                     <span className="text-[11px] font-bold text-white whitespace-nowrap">VSM Resolution</span>
                     <input type="range" className="flex-1 accent-[#e3b341]" min="1" max="4" defaultValue="2" />
                     <span className="text-[11px] text-[#e3b341] font-mono">Dynamic</span>
                  </div>
                </div>

                {/* 4. HZB Occlusion */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3 border-b border-[#30363d] pb-3">
                     <div className="p-2 bg-[#f85149]/10 rounded-lg text-[#f85149]"><Maximize size={18}/></div>
                     <h3 className="text-white font-bold text-[13px]">4. HZB Occlusion Culling</h3>
                  </div>
                  <p className="text-[#8b949e] text-[11px] leading-relaxed mb-4">
                     Hierarchical Z-Buffer tests depth before the main render pass. Objects entirely occluded by closer solid walls are aggressively discarded to save VRAM and Cycles.
                  </p>
                  <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d]">
                     <span className="text-white font-bold">Two-Pass Early-Z Depth</span>
                     <input type="checkbox" defaultChecked className="accent-[#f85149] w-4 h-4"/>
                  </label>
                </div>
                
              </div>

               {/* 5. Virtual Texturing */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center">
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                       <div className="p-2 bg-[#58a6ff]/10 rounded-lg text-[#58a6ff]"><ServerCog size={18}/></div>
                       <h3 className="text-white font-bold text-[14px]">5. Sparse Virtual Texturing (SVT)</h3>
                    </div>
                    <p className="text-[#8b949e] text-[12px] leading-relaxed">
                       Shatters 8K environment textures into tiles. Only loads the exact MIP tiles actively visible by the camera into a fixed-size texture cache pool. Limits total texture VRAM overhead across vast open worlds to under 2GB, regardless of world scale.
                    </p>
                 </div>
                 <div className="w-full md:w-64 bg-[#0d1117] p-3 border border-[#30363d] rounded space-y-3">
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="text-[#c9d1d9]">Physical Memory Cache</span>
                       <span className="text-[#58a6ff] font-bold">512 MB</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#222] rounded overflow-hidden">
                       <div className="h-full bg-[#58a6ff] w-[45%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px]">
                       <span className="text-[#8b949e]">Tiles in Memory: 4,120</span>
                       <span className="text-[#8b949e]">Max: 10,000</span>
                    </div>
                 </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
