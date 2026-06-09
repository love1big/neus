import React, { useState } from 'react';
import { MonitorPlay, Settings2, Zap, Layers, RefreshCw, Cpu, Activity, Info, Sliders, ServerCog, Box, Maximize, Target, DatabaseZap } from 'lucide-react';

function ShaderCompiler() {
  const [compiling, setCompiling] = useState(false);
  const [progress, setProgress] = useState(100);
  const [variants, setVariants] = useState(4823);

  const handleRecompile = () => {
    if (compiling) return;
    setCompiling(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setCompiling(false);
          setVariants(Math.floor(Math.random() * 1000) + 4000);
          return 100;
        }
        return p + Math.floor(Math.random() * 10) + 2;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#161b22] border border-[#f85149]/40 rounded-lg p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f85149] rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
        <div className="flex items-start justify-between relative z-10 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Cpu className="text-[#f85149]"/> Shader Compiler Pipeline</h2>
            <p className="text-[#8b949e] text-sm mt-2 max-w-xl">Manage shader permutation matrix, pre-caching, and compilation logs to prevent runtime stuttering.</p>
          </div>
          <button 
            onClick={handleRecompile}
            disabled={compiling}
            className={`font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-[0_0_20px_rgba(248,81,73,0.3)] transition-all ${compiling ? 'bg-[#30363d] text-[#8b949e] shadow-none cursor-not-allowed' : 'bg-[#f85149] hover:bg-[#f85149]/80 text-[#0a0a0a]'}`}
          >
            <RefreshCw size={18} className={compiling ? 'animate-spin' : ''}/> {compiling ? 'Compiling...' : 'Recompile All'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex flex-col justify-center items-center">
            <span className="text-[#8b949e] text-[11px] font-bold uppercase tracking-wider mb-2">Variant Cache Status</span>
            <span className={compiling ? "text-[#e3b341] font-mono text-2xl font-bold" : "text-[#3fb950] font-mono text-2xl font-bold"}>{compiling ? 'REBUILDING' : 'OPTIMIZED'}</span>
          </div>
          <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex flex-col justify-center items-center">
            <span className="text-[#8b949e] text-[11px] font-bold uppercase tracking-wider mb-2">Cached Permutations</span>
            <span className="text-white font-mono text-2xl font-bold">{variants.toLocaleString()}</span>
          </div>
          <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex flex-col justify-center items-center">
            <span className="text-[#8b949e] text-[11px] font-bold uppercase tracking-wider mb-2">Active Worker Threads</span>
            <span className="text-[#58a6ff] font-mono text-2xl font-bold">{compiling ? '16' : '0'}</span>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#30363d] p-5 rounded-lg space-y-4 relative z-10">
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-[#c9d1d9] font-bold flex items-center gap-2"><Zap size={14} className="text-[#e3b341]" /> Compilation Progress</span>
            <span className="text-[#8b949e] font-mono text-[14px]">{Math.min(progress, 100)}%</span>
          </div>
          
          <div className="w-full h-4 bg-[#161b22] rounded-full overflow-hidden border border-[#30363d] shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[#f85149] via-[#e3b341] to-[#3fb950] transition-all duration-200" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          
          {compiling && (
            <div className="p-3 bg-[#161b22] border border-[#30363d] rounded font-mono text-[11px] text-[#8b949e] h-24 overflow-y-auto custom-scrollbar flex flex-col-reverse">
               <div>[ShaderCompiler] Transpiling GLSL to SPIR-V...</div>
               <div>[Worker 5] Compiled Material_PBR_Opaque_Instanced ({Math.floor((progress / 100) * variants)}/{variants})</div>
               <div>[Worker 2] Optimizing Register Allocation for PS_AmbientOcclusion...</div>
               <div className="text-[#58a6ff]">[System] Distributed task across 16 local threads...</div>
            </div>
          )}
          {!compiling && (
            <div className="p-3 bg-[#161b22] border border-[#30363d] rounded font-mono text-[11px] text-[#3fb950]">
               [System] All shader variants are fully compiled and cached in the PSO (Pipeline State Object) cache.
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
         <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
           <h3 className="text-white font-bold border-b border-[#30363d] pb-2 mb-4">On-Demand Pre-Caching</h3>
           <p className="text-[#8b949e] text-[11px] mb-4">Prevent traversal stuttering by forcing the engine to compile all potential shader permutations before rendering.</p>
           <label className="flex items-center justify-between text-[11px] p-2 bg-[#0d1117] rounded border border-[#30363d] mb-2 cursor-pointer">
              <span className="text-[#c9d1d9] font-bold">Synchronous PSO Loading</span>
              <input type="checkbox" defaultChecked className="accent-[#f85149] w-4 h-4"/>
           </label>
           <label className="flex items-center justify-between text-[11px] p-2 bg-[#0d1117] rounded border border-[#30363d] cursor-pointer">
              <span className="text-[#c9d1d9] font-bold">Background Async Compilation</span>
              <input type="checkbox" defaultChecked className="accent-[#f85149] w-4 h-4"/>
           </label>
         </div>

         <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
           <h3 className="text-white font-bold border-b border-[#30363d] pb-2 mb-4">Diagnostics</h3>
           <p className="text-[#8b949e] text-[11px] mb-4">Analyze the memory footprint and compile time of individual shader assets.</p>
           <div className="space-y-2 text-[11px]">
             <div className="flex justify-between items-center bg-[#0d1117] px-3 py-2 rounded">
                <span className="text-[#c9d1d9]">M_Water_Volumetric_Instanced</span>
                <span className="text-[#e3b341]">245ms / 1.2MB</span>
             </div>
             <div className="flex justify-between items-center bg-[#0d1117] px-3 py-2 rounded">
                <span className="text-[#c9d1d9]">M_Skin_Subsurface_Profile</span>
                <span className="text-[#e3b341]">180ms / 850KB</span>
             </div>
             <div className="flex justify-between items-center bg-[#0d1117] px-3 py-2 rounded">
                <span className="text-[#c9d1d9]">PP_DeferredDecals_RayTraced</span>
                <span className="text-[#f85149]">410ms / 2.1MB</span>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}

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
        <button onClick={() => setActiveTab('shaders')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'shaders' ? 'text-[#f85149] border-b-2 border-[#f85149]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><Cpu size={14}/> Shaders & Cache</button>
        <button onClick={() => setActiveTab('post-process')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'post-process' ? 'text-[#e3b341] border-b-2 border-[#e3b341]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><MonitorPlay size={14}/> Post-Process</button>
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
                        <div className="text-[#8b949e] text-[10px] mt-0.5">Stream high-res textures into RAM only when proximal to the player, dynamically downscaling distant areas to prevent VRAM overflow.</div>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-4 h-4"/>
                    </label>
                    <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d]">
                      <div>
                        <div className="text-white font-bold">Virtual Texture Streaming</div>
                        <div className="text-[#8b949e] text-[10px] mt-0.5">Segment textures into 128x128 tiles and stream only the exact tiles visible in the camera frustum, eradicating memory bottlenecks.</div>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-4 h-4"/>
                    </label>
                    <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d]">
                      <div>
                        <div className="text-white font-bold">Object Pooling Aggressiveness</div>
                        <div className="text-[#8b949e] text-[10px] mt-0.5">Preallocate memory to prevent GC spikes.</div>
                      </div>
                      <select defaultValue="Aggressive (Max FPS)" className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-white outline-none">
                        <option>Moderate</option>
                        <option>Aggressive (Max FPS)</option>
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
                      <select defaultValue="120 FPS" className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-white outline-none">
                        <option>60 FPS</option>
                        <option>120 FPS</option>
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
                         <h3 className="text-white font-bold text-[14px]">AI Upscaling & Frame Generation</h3>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" defaultChecked className="sr-only peer" />
                           <div className="w-9 h-5 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#8b949e] peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bc8cff]"></div>
                         </label>
                      </div>
                      <p className="text-[#8b949e] text-[11px] mb-3">Render at lower internal resolution and use AI to reconstruct high-quality images, plus insert AI-generated artificial frames to multiply FPS.</p>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                           <select defaultValue="FSR 3.0 (AMD/Universal)" className="bg-[#0d1117] border border-[#30363d] text-[11px] px-2 py-1 rounded outline-none text-[#c9d1d9] flex-1">
                              <option>DLSS (NVIDIA)</option>
                              <option>FSR 3.0 (AMD/Universal)</option>
                              <option>XeSS (Intel)</option>
                           </select>
                           <select defaultValue="Balanced" className="bg-[#0d1117] border border-[#30363d] text-[11px] px-2 py-1 rounded outline-none text-[#c9d1d9] flex-1">
                              <option>Quality</option>
                              <option>Balanced</option>
                              <option>Performance</option>
                           </select>
                        </div>
                        <label className="flex items-center justify-between text-[11px] bg-[#0d1117] p-2 rounded border border-[#30363d]">
                           <div className="flex-[0.9]">
                              <span className="text-[#c9d1d9] font-bold">Enable AI Frame Generation</span>
                              <div className="text-[9px] text-[#8b949e]">Synthesizes intermediate frames to essentially double your framerate for extreme smoothness.</div>
                           </div>
                           <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4"/>
                        </label>
                      </div>
                   </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg flex items-start gap-4">
                   <div className="p-3 bg-[#e3b341]/10 rounded-lg text-[#e3b341]"><ServerCog size={24}/></div>
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                         <h3 className="text-white font-bold text-[14px]">Lighting Calculation Mode (GI & Reflections)</h3>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" defaultChecked className="sr-only peer" />
                           <div className="w-9 h-5 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#8b949e] peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e3b341]"></div>
                         </label>
                      </div>
                      <p className="text-[#8b949e] text-[11px] mb-3">Balance between dynamic real-time computations and pre-calculated memory structures to maximize GPU performance.</p>
                      <div className="flex gap-4 items-center flex-wrap mb-4">
                         <label className="flex items-center gap-2 text-[11px] text-[#c9d1d9]">
                            <input type="radio" name="gi-mode" defaultChecked className="accent-[#e3b341]"/>
                            Hardware RT (Dynamic)
                         </label>
                         <label className="flex items-center gap-2 text-[11px] text-[#c9d1d9]">
                            <input type="radio" name="gi-mode" className="accent-[#e3b341]"/>
                            Screen-Space (SSGI)
                         </label>
                      </div>

                      <div className="bg-[#0a0a0a] p-3 rounded border border-[#30363d] mb-4">
                         <div className="flex justify-between items-center mb-2">
                           <h4 className="text-[12px] text-[#58a6ff] font-bold">Dynamic RT Quality Scaling (VRAM Aware)</h4>
                           <span className="text-[10px] bg-[#58a6ff]/20 text-[#58a6ff] px-2 py-0.5 rounded border border-[#58a6ff]/30">Target: 60+ FPS</span>
                         </div>
                         <p className="text-[11px] text-[#8b949e] mb-3">Automatically modulates hardware-accelerated ray limits and denoising algorithms on the fly based on VRAM capacity and frame-time thresholds.</p>
                         <div className="space-y-3">
                           <div className="flex items-center justify-between">
                              <span className="text-[11px] text-[#c9d1d9]">Max Bounce Depth Limit</span>
                              <select defaultValue="Progressive (Auto 1-4 Bounces)" className="bg-[#161b22] border border-[#30363d] text-[11px] text-white rounded px-2 py-1 outline-none min-w-[170px]">
                                <option>Conservative (1 Bounce)</option>
                                <option>Balanced (Auto 1-2 Bounces)</option>
                                <option>Progressive (Auto 1-4 Bounces)</option>
                                <option>Cinematic (8 Bounces - High Cost)</option>
                              </select>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-[11px] text-[#c9d1d9]">Denoising Execution Pass</span>
                              <select defaultValue="Temporal Reprojection (Medium)" className="bg-[#161b22] border border-[#30363d] text-[11px] text-white rounded px-2 py-1 outline-none min-w-[170px]">
                                <option>Spatial Filter Only (Fast)</option>
                                <option>Temporal Reprojection (Medium)</option>
                                <option>AI-Accelerated Engine (DLSS/XeSS)</option>
                              </select>
                           </div>
                           <label className="flex items-start justify-between border-t border-[#30363d] pt-3 mt-1">
                             <div className="flex-[0.9]">
                               <span className="text-[11px] text-[#c9d1d9]">Half-Resolution Fallback (OOM Protection)</span>
                               <div className="text-[9px] text-[#8b949e]">Traces rays at exactly 50% internal resolution and uses motion vectors to interpolate gaps during extreme VRAM starvation.</div>
                             </div>
                             <input type="checkbox" defaultChecked className="accent-[#e3b341] w-4 h-4"/>
                           </label>
                         </div>
                      </div>

                      <div className="border-t border-[#30363d] pt-3 mt-1 space-y-2">
                         <h4 className="text-[11px] text-white font-bold mb-2">Screen Space Optimizations</h4>
                         <label className="flex items-start justify-between text-[11px] bg-[#0d1117] p-2 rounded border border-[#30363d] mb-2">
                           <div className="flex-[0.9]">
                              <span className="text-[#c9d1d9] font-bold">Screen Space Reflection (SSR)</span>
                              <div className="text-[9px] text-[#8b949e]">Calculates beautiful water and metallic reflections purely by sampling the pixels already rendered on-screen, ignoring out-of-bounds geometry. Dramatically outperforms Ray Tracing.</div>
                           </div>
                           <input type="checkbox" defaultChecked className="accent-[#e3b341] w-4 h-4"/>
                         </label>

                         <h4 className="text-[11px] text-white font-bold mb-2 mt-4">Static Optimization Strategies (Zero Runtime Cost)</h4>
                         <label className="flex items-start justify-between text-[11px] bg-[#0d1117] p-2 rounded border border-[#30363d] mb-2">
                           <div className="flex-[0.9]">
                              <span className="text-[#c9d1d9] font-bold">Texture Baking</span>
                              <div className="text-[9px] text-[#8b949e]">Fuse complex lighting, shadows, and ambient occlusion directly into surface texture maps offline. Negates the need for real-time calculation completely.</div>
                           </div>
                           <input type="checkbox" defaultChecked className="accent-[#e3b341] w-4 h-4"/>
                         </label>
                         <label className="flex items-start justify-between text-[11px] bg-[#0d1117] p-2 rounded border border-[#30363d]">
                           <div className="flex-[0.9]">
                              <span className="text-[#c9d1d9] font-bold">Precomputed Lightmapping</span>
                              <div className="text-[9px] text-[#8b949e]">Store static directional light and shadow data for immobile objects (i.e. terrain, buildings) into a separate low-res coordinate map, severely reducing rendering burdens.</div>
                           </div>
                           <input type="checkbox" defaultChecked className="accent-[#e3b341] w-4 h-4"/>
                         </label>
                      </div>
                   </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg flex items-start gap-4">
                   <div className="p-3 bg-[#3fb950]/10 rounded-lg text-[#3fb950]"><Layers size={24}/></div>
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                         <h3 className="text-white font-bold text-[14px]">Object Rendering & Batching</h3>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" defaultChecked className="sr-only peer" />
                           <div className="w-9 h-5 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#8b949e] peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3fb950]"></div>
                         </label>
                      </div>
                      <p className="text-[#8b949e] text-[11px] mb-3">Group operations to relieve CPU bottlenecking when sending massive amounts of draw calls to the GPU.</p>
                      <div className="space-y-3">
                        <label className="flex items-start justify-between text-[11px] bg-[#0d1117] p-2 rounded border border-[#30363d]">
                           <div className="flex-[0.9]">
                              <span className="text-[#c9d1d9] font-bold">Instanced Rendering (GPU Instancing)</span>
                              <div className="text-[9px] text-[#8b949e]">Draws thousands of identical objects (like grass blades, trees, or crowds) in a single GPU command by passing transform matrices to the shader, effectively erasing CPU processing constraints.</div>
                           </div>
                           <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                        </label>
                        <label className="flex items-start justify-between text-[11px] bg-[#0d1117] p-2 rounded border border-[#30363d]">
                           <div className="flex-[0.9]">
                              <span className="text-[#c9d1d9] font-bold">Draw Call Batching</span>
                           <div className="text-[9px] text-[#8b949e]">Merges multiple separate objects sharing the exact same Material/Texture into a single coherent mesh just before rendering, keeping GPU command queues short.</div>
                           </div>
                           <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                        </label>
                      </div>
                   </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg flex items-start gap-4">
                   <div className="p-3 bg-[#f85149]/10 rounded-lg text-[#f85149]"><Zap size={24}/></div>
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                         <h3 className="text-white font-bold text-[14px]">Shadow Rendering Pipeline</h3>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" defaultChecked className="sr-only peer" />
                           <div className="w-9 h-5 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#8b949e] peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f85149]"></div>
                         </label>
                      </div>
                      <p className="text-[#8b949e] text-[11px] mb-3">Optimize shadow resolution and rendering methods for better performance and lighting fidelity.</p>
                      <div className="flex gap-4 items-center mb-3">
                         <label className="flex items-center gap-2 text-[11px] text-[#c9d1d9]" title="Divides the camera frustum into multiple cascades (LODs) to prioritize shadow resolution near the player while using low-res shadows for distant objects.">
                            <input type="radio" name="shadow-mode" className="accent-[#f85149]"/>
                            Cascaded Shadows (Shadow LOD)
                         </label>
                         <label className="flex items-center gap-2 text-[11px] text-[#c9d1d9]">
                            <input type="radio" name="shadow-mode" defaultChecked className="accent-[#f85149]"/>
                            Virtual Shadow Maps (VSM)
                         </label>
                         <label className="flex items-center gap-2 text-[11px] text-[#c9d1d9]">
                            <input type="radio" name="shadow-mode" className="accent-[#f85149]"/>
                            Ray-Traced Shadows
                         </label>
                      </div>
                      <div className="p-2 bg-[#f85149]/10 border border-[#f85149]/20 rounded text-[11px] text-[#f85149] flex gap-2 items-start mt-2">
                         <Info size={14} className="shrink-0 mt-0.5"/>
                         <p><strong>VSM Memory Optimization Active:</strong> High-fidelity shadows are paged dynamically into VRAM using Sparse Virtual Textures. Static object shadows are permanently cached, eradicating cascaded draw call overhead and massively reducing active memory bandwidth footprint.</p>
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
                  
                  <div className="p-3 bg-[#3fb950]/10 border border-[#3fb950]/20 rounded text-[11px] text-[#3fb950] flex gap-2 items-start mb-4">
                     <Info size={14} className="shrink-0 mt-0.5"/>
                     <p>When enabled, standard LODs are ignored. Geometry is directly streamed from disk to GPU memory based on screen cluster projection (Nanite architecture).</p>
                  </div>

                  <h3 className="text-white font-bold border-b border-[#30363d] pb-2 mt-6">Hardware Tessellation</h3>
                  <p className="text-[#8b949e] text-[11px] mb-2">Dynamically subdivides coarse polygons into finer geometry in real-time as the camera approaches. Perfect for creating highly detailed displacements (like snow tracks or cobblestones) without heavy base meshes.</p>
                  <label className="flex items-center justify-between text-[11px] bg-[#0d1117] p-2 rounded border border-[#30363d]">
                     <span className="text-[12px] font-bold text-[#c9d1d9]">Enable Distance-Based Tessellation</span>
                     <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                  </label>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg space-y-4">
                  <h3 className="text-white font-bold border-b border-[#30363d] pb-2">Frustum & Occlusion Culling</h3>
                  <p className="text-[#8b949e] text-[11px]">Aggressively purge unviewable meshes to preserve GPU rasterization cycles.</p>

                  <div className="space-y-2">
                     <label className="flex items-center justify-between text-[11px]">
                        <div>
                           <span className="text-[#c9d1d9] font-bold">Frustum Culling</span>
                           <div className="text-[9px] text-[#8b949e]">Instantly skip rendering of objects positioned outside the camera's active Field of View (FOV).</div>
                        </div>
                        <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                     </label>
                     <label className="flex items-center justify-between text-[11px] mt-2">
                        <div>
                           <span className="text-[#c9d1d9] font-bold">Occlusion Culling (HZB)</span>
                           <div className="text-[9px] text-[#8b949e]">Avoid processing objects completely obscured by other solid objects (e.g., hidden behind walls) using Hierarchical Z-Buffer depth testing.</div>
                        </div>
                        <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                     </label>
                  </div>

                  <h3 className="text-white font-bold border-b border-[#30363d] pb-2 pt-4">Animation & Simulation Culling</h3>
                  <div className="space-y-2">
                     <label className="flex items-center justify-between text-[11px]">
                        <div>
                           <span className="text-[#c9d1d9] font-bold">Animation Culling / Tick Suppression</span>
                           <div className="text-[9px] text-[#8b949e]">Halt complex bone calculations and IK logic for distant or off-screen NPCs, liberating the CPU.</div>
                        </div>
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
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#a371f7] rounded-full mix-blend-multiply filter blur-[140px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#58a6ff] rounded-full mix-blend-multiply filter blur-[120px] opacity-10"></div>
                
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Box className="text-[#a371f7]"/> Infinite Polygon Scaling (Micro-Mesh Engine) <span className="ml-2 bg-[#3fb950]/20 text-[#3fb950] text-[10px] uppercase font-bold py-1 px-2 rounded-full border border-[#3fb950]/30 animate-pulse tracking-widest hidden sm:flex items-center gap-1"><Zap size={10} className="fill-[#3fb950] text-[#3fb950]"/> Fully Autonomous</span></h2>
                    <p className="text-[#8b949e] text-sm mt-3 max-w-3xl leading-relaxed">
                       A deterministic, next-generation geometric virtualization system engineered for hyper-realistic graphics on minimal hardware constraints. Whether rendering a dense game world, a full-scale architectural CAD model, or a high-fidelity cinematic scene containing over <strong className="text-[#a371f7]">10,000,000,000,000 (10 Trillion+) polygons</strong>, the engine natively collapses the geometry DAG (Directed Acyclic Graph) in real-time. 
                       <br/><br/>
                       Crucially, <strong className="text-white">original model files are NEVER reduced, decimated, or altered</strong>. The engine rigorously evaluates continuous screen-space error bounds to guarantee pixel-perfect representation, dynamically filtering the geometry to enforce a strict rendering budget of exactly <strong className="text-[#3fb950]">100,000 triangles</strong> active in the camera frustum at any given time. 
                       <br/><br/>
                       <span className="text-[#c9d1d9] border-l-2 border-[#3fb950] pl-3 py-0.5 block italic bg-[#3fb950]/5">This entire pipeline is 100% autonomous both in-game and during editing. No manual LODs, no stuttering—just flawless, cinematic visual fidelity at a perfectly locked frame rate.</span>
                    </p>
                  </div>
                  <button className="bg-[#a371f7] hover:bg-[#a371f7]/80 text-[#0a0a0a] font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-[0_0_20px_rgba(163,113,247,0.3)] transition-all shrink-0">
                    <DatabaseZap size={18}/> Bake DAG Hierarchy
                  </button>
                </div>
                
                <div className="mt-6 relative z-10 bg-[#0d1117] border border-[#30363d] rounded-lg p-5 flex flex-col items-center">
                    <div className="w-full flex flex-col md:flex-row gap-8 items-center h-full">
                       
                       {/* Source Complexity */}
                       <div className="flex-1 w-full space-y-3">
                           <div className="flex justify-between items-center text-[11px] font-bold">
                               <span className="text-[#c9d1d9] uppercase tracking-wider flex items-center gap-2"><Layers size={14} className="text-[#a371f7]"/> Uncompressed Scene Complexity</span>
                               <span className="text-[#a371f7] font-mono text-[16px] drop-shadow-[0_0_8px_rgba(163,113,247,0.8)]">10,000,000,000,000+ Triangles</span>
                           </div>
                           <div className="w-full h-3 bg-[#111] rounded overflow-hidden shadow-inner border border-[#30363d]/50 relative">
                              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zOSA0MHYtNDBoMXY0MEgzOXptLTQtNDBoMXY0MGgtMXYtNDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')]"></div>
                              <div className="h-full bg-gradient-to-r from-[#a371f7] via-[#bc8cff] to-[#f85149] w-[98%] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(163,113,247,0.5)]"></div>
                           </div>
                           <div className="text-[10px] text-[#8b949e]">Original unoptimized geometry (e.g. ZBrush sculpts, raw LiDAR point clouds, unoptimized CAD engineering parts) taking petabytes if loaded to RAM.</div>
                           
                           <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#30363d] to-transparent my-4"></div>

                           {/* Render Budget */}
                           <div className="flex justify-between items-center text-[11px] font-bold">
                               <span className="text-[#c9d1d9] uppercase tracking-wider flex items-center gap-2"><Target size={14} className="text-[#3fb950]"/> Filtered Frustum Render Budget</span>
                               <span className="text-[#3fb950] font-mono text-[16px] drop-shadow-[0_0_8px_rgba(63,185,80,0.8)]">100,000 Triangles</span>
                           </div>
                           <div className="w-full h-3 bg-[#111] rounded overflow-hidden shadow-inner border border-[#30363d]/50">
                              <div className="h-full bg-[#3fb950] w-[1%] shadow-[0_0_10px_rgba(63,185,80,0.8)] relative">
                                 <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                           </div>
                           <div className="text-[10px] text-[#3fb950]">Memory footprint dynamically capped. Sub-pixel triangles merged via BVH node evaluation. Invisible to the naked eye.</div>
                       </div>

                       <div className="w-[1px] h-32 bg-[#30363d] hidden md:block"></div>

                       {/* Stats */}
                       <div className="flex flex-row md:flex-col items-center justify-center gap-6 md:w-48 shrink-0">
                           <div className="text-center w-full bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                               <div className="text-[10px] text-[#8b949e] uppercase font-bold mb-1">Guaranteed Output</div>
                               <div className="text-4xl font-mono font-bold text-[#3fb950]">120<span className="text-[14px]">FPS</span></div>
                           </div>
                           <div className="text-center w-full bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                               <div className="text-[10px] text-[#8b949e] uppercase font-bold mb-1">Perceived Fidelity</div>
                               <div className="text-4xl font-mono font-bold text-[#58a6ff]">100<span className="text-[14px]">%</span></div>
                           </div>
                       </div>
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. BVH Cluster Partitioning */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 hover:border-[#a371f7]/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3 border-b border-[#30363d] pb-3">
                     <div className="p-2 bg-[#a371f7]/10 rounded-lg text-[#a371f7]"><Target size={18}/></div>
                     <h3 className="text-white font-bold text-[13px]">1. BVH Cluster Partitioning (DAG)</h3>
                  </div>
                  <p className="text-[#8b949e] text-[11px] leading-relaxed mb-4">
                     Trillions of source triangles are grouped into hierarchical bounding volume clusters (max 128 triangles each). The engine evaluates the screen-space error of every cluster node. If a detailed cluster occupies less than a pixel on screen, it mathematically collapses to a simplified parent node seamlessly without any visible LOD "popping".
                  </p>
                  <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d] cursor-pointer hover:bg-[#21262d] transition-colors">
                     <span className="text-white font-bold">Continuous Screen-Space Error Bound</span>
                     <input type="checkbox" defaultChecked className="accent-[#a371f7] w-4 h-4"/>
                  </label>
                </div>

                {/* 2. Direct NVMe Streaming */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 hover:border-[#58a6ff]/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3 border-b border-[#30363d] pb-3">
                     <div className="p-2 bg-[#58a6ff]/10 rounded-lg text-[#58a6ff]"><ServerCog size={18}/></div>
                     <h3 className="text-white font-bold text-[13px]">2. Direct NVMe-to-VRAM Paging</h3>
                  </div>
                  <p className="text-[#8b949e] text-[11px] leading-relaxed mb-4">
                     Storing trillions of polygons in RAM is physically impossible. This engine bypasses the CPU and System RAM entirely by utilizing DirectStorage, directly paging required cluster data blocks from the NVMe SSD into a fixed-size 512MB VRAM ring buffer exactly when the camera looks at them.
                  </p>
                  <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d] cursor-pointer hover:bg-[#21262d] transition-colors">
                     <span className="text-white font-bold">On-Demand Cluster Streaming (Zero-Copy)</span>
                     <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-4 h-4"/>
                  </label>
                </div>

                {/* 3. Compute Shader Software Rasterization */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 hover:border-[#3fb950]/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3 border-b border-[#30363d] pb-3">
                     <div className="p-2 bg-[#3fb950]/10 rounded-lg text-[#3fb950]"><Cpu size={18}/></div>
                     <h3 className="text-white font-bold text-[13px]">3. Hybrid Hardware/Software Rasterization</h3>
                  </div>
                  <p className="text-[#8b949e] text-[11px] leading-relaxed mb-4">
                     Traditional hardware rasterizers choke on microscopic triangles. When virtual triangles shrink to sub-pixel sizes (≤ 1 pixel), the pipeline automatically redirects them to highly parallelized software rasterizer Compute Shaders, avoiding the fixed-function quad-rasterization bottlenecks altogether.
                  </p>
                  <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d] cursor-pointer hover:bg-[#21262d] transition-colors">
                     <span className="text-white font-bold">Asynchronous Compute Rasterization</span>
                     <input type="checkbox" defaultChecked className="accent-[#3fb950] w-4 h-4"/>
                  </label>
                </div>

                {/* 4. HZB Occlusion Culling */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 hover:border-[#f85149]/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3 border-b border-[#30363d] pb-3">
                     <div className="p-2 bg-[#f85149]/10 rounded-lg text-[#f85149]"><Maximize size={18}/></div>
                     <h3 className="text-white font-bold text-[13px]">4. 100% Granular GPU Culling</h3>
                  </div>
                  <p className="text-[#8b949e] text-[11px] leading-relaxed mb-4">
                     Leverages Two-Pass Hierarchical Z-Buffer (HZB). Millions of clusters are evaluated against previous-frame depth buffers on the GPU. Any cluster fully blocked by a closer object (e.g., a screw inside a motor block, or an entire city behind a wall) is instantly discarded in nanoseconds before vertex processing begins.
                  </p>
                  <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d] cursor-pointer hover:bg-[#21262d] transition-colors">
                     <span className="text-white font-bold">Strict GPU HZB Occlusion Pass</span>
                     <input type="checkbox" defaultChecked className="accent-[#f85149] w-4 h-4"/>
                  </label>
                </div>

                {/* 5. ML Predictive Frustum Prefetching */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 hover:border-[#ff7b72]/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3 border-b border-[#30363d] pb-3">
                     <div className="p-2 bg-[#ff7b72]/10 rounded-lg text-[#ff7b72]"><Zap size={18}/></div>
                     <h3 className="text-white font-bold text-[13px]">5. ML Predictive Camera Prefetching</h3>
                  </div>
                  <p className="text-[#8b949e] text-[11px] leading-relaxed mb-4">
                     A lightweight machine-learning agent predicts camera velocity vectors and player pathing. It actively preloads massive VRAM geometry pages milliseconds <i>before</i> they enter the frustum, completely eradicating traversal stutter and guaranteeing a smooth experience at extreme speeds.
                  </p>
                  <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d] cursor-pointer hover:bg-[#21262d] transition-colors">
                     <span className="text-white font-bold">ML Predictive Traversal Cache</span>
                     <input type="checkbox" defaultChecked className="accent-[#ff7b72] w-4 h-4"/>
                  </label>
                </div>

                {/* 6. Sub-Pixel Fractional Precision */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 hover:border-[#bc8cff]/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3 border-b border-[#30363d] pb-3">
                     <div className="p-2 bg-[#bc8cff]/10 rounded-lg text-[#bc8cff]"><Target size={18}/></div>
                     <h3 className="text-white font-bold text-[13px]">6. Sub-Pixel Fractional Precision</h3>
                  </div>
                  <p className="text-[#8b949e] text-[11px] leading-relaxed mb-4">
                     Extends filtering accuracy beyond standard pixels. Geometry edges are evaluated fractionally for sub-pixel anti-aliasing during software rasterization. This generates cinematic-grade, razor-sharp silhouettes for microscopic details without the crushing performance cost of MSAA or Supersampling.
                  </p>
                  <label className="flex items-center justify-between text-[12px] bg-[#161b22] p-3 rounded border border-[#30363d] cursor-pointer hover:bg-[#21262d] transition-colors">
                     <span className="text-white font-bold">Fractional Anti-Aliased Silhouettes</span>
                     <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4"/>
                  </label>
                </div>
                
              </div>

               {/* 5. Application Scope */}
              <div className="bg-[#161b22] border border-[#e3b341]/40 rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center">
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-[#e3b341]/10 rounded-lg text-[#e3b341]"><Box size={18}/></div>
                       <h3 className="text-white font-bold text-[14px]">Universal Industry Application</h3>
                    </div>
                    <p className="text-[#8b949e] text-[12px] leading-relaxed">
                       This technology extends far beyond next-generation gaming. It radically transforms how professional software handles massive datasets. Industrial designers can natively load untouched multi-billion-polygon assemblies from Solidworks or Catia. Geospatial operations can stream city-scale Drone/LiDAR point cloud scans instantly, while cinematography studios deploy film-quality unoptimized ZBrush assets directly into real-time sets.
                    </p>
                 </div>
                 <div className="w-full md:w-72 bg-[#0d1117] p-4 border border-[#30363d] rounded-lg space-y-4 shadow-lg shrink-0">
                    <div className="text-[10px] text-[#c9d1d9] font-bold uppercase tracking-wider mb-2 border-b border-[#30363d] pb-2">Active Use-Case Targets</div>
                    
                    <div className="flex justify-between items-center text-[11px]">
                       <span className="text-[#8b949e] flex items-center gap-2"><div className="w-2 h-2 bg-[#a371f7] rounded-full"></div> Next-Gen Gaming</span>
                       <span className="text-[#c9d1d9] font-bold">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                       <span className="text-[#8b949e] flex items-center gap-2"><div className="w-2 h-2 bg-[#e3b341] rounded-full"></div> CAD & Engineering</span>
                       <span className="text-[#c9d1d9] font-bold">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                       <span className="text-[#8b949e] flex items-center gap-2"><div className="w-2 h-2 bg-[#ff7b72] rounded-full"></div> VFX & Virtual Production</span>
                       <span className="text-[#c9d1d9] font-bold">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                       <span className="text-[#8b949e] flex items-center gap-2"><div className="w-2 h-2 bg-[#58a6ff] rounded-full"></div> LiDAR Point Clouds</span>
                       <span className="text-[#c9d1d9] font-bold">Enabled</span>
                    </div>
                 </div>
              </div>

            </div>
          )}

          {activeTab === 'shaders' && (
            <ShaderCompiler />
          )}

          {activeTab === 'post-process' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><MonitorPlay className="text-[#e3b341]"/> Post-Process Volume Editor</h2>
              
              <div className="grid grid-cols-2 gap-6">
                 {/* Bloom */}
                 <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg space-y-4">
                    <h3 className="text-white font-bold border-b border-[#30363d] pb-2">Bloom & Glare</h3>
                    <p className="text-[#8b949e] text-[11px]">Control the bleeding of light from bright areas to simulate camera lenses and atmospheric scattering.</p>
                    <div className="space-y-3">
                       <div>
                          <div className="flex justify-between text-[11px] text-[#c9d1d9] mb-1">
                             <span>Bloom Intensity</span>
                             <span className="text-[#e3b341] font-mono">1.5</span>
                          </div>
                          <input type="range" className="w-full accent-[#e3b341] bg-[#0a0a0a]" min="0" max="10" step="0.1" defaultValue="1.5"/>
                       </div>
                       <div>
                          <div className="flex justify-between text-[11px] text-[#c9d1d9] mb-1">
                             <span>Bloom Threshold</span>
                             <span className="text-[#e3b341] font-mono">0.8</span>
                          </div>
                          <input type="range" className="w-full accent-[#e3b341] bg-[#0a0a0a]" min="0" max="5" step="0.1" defaultValue="0.8"/>
                       </div>
                    </div>
                 </div>

                 {/* Depth of Field */}
                 <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg space-y-4">
                    <h3 className="text-white font-bold border-b border-[#30363d] pb-2">Depth of Field (Cinematic DoF)</h3>
                    <p className="text-[#8b949e] text-[11px]">Replicate physical camera apertures and focal planes to isolate subjects.</p>
                    <div className="space-y-3">
                       <div>
                          <div className="flex justify-between text-[11px] text-[#c9d1d9] mb-1">
                             <span>Focal Distance (m)</span>
                             <span className="text-[#58a6ff] font-mono">2.5</span>
                          </div>
                          <input type="range" className="w-full accent-[#58a6ff] bg-[#0a0a0a]" min="0.1" max="100" step="0.1" defaultValue="2.5"/>
                       </div>
                       <div>
                          <div className="flex justify-between text-[11px] text-[#c9d1d9] mb-1">
                             <span>Aperture (f-stop)</span>
                             <span className="text-[#58a6ff] font-mono">f/1.8</span>
                          </div>
                          <input type="range" className="w-full accent-[#58a6ff] bg-[#0a0a0a]" min="0.8" max="22" step="0.1" defaultValue="1.8"/>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Color Grading & LUTs */}
              <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg space-y-4">
                  <h3 className="text-white font-bold border-b border-[#30363d] pb-2">Color Grading & Film Emulation (LUT)</h3>
                  <p className="text-[#8b949e] text-[11px]">Apply professional 3D Look-Up Tables (LUTs) to stylize the final image output globally.</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                     <div className="col-span-1 space-y-4">
                        <label className="block text-[11px] text-[#c9d1d9] font-bold mb-1">Active LUT Profile</label>
                        <select className="w-full bg-[#0d1117] border border-[#30363d] text-white text-[12px] p-2 rounded outline-none" defaultValue="Matrix_Green">
                           <option value="None">None (Linear Rec.709)</option>
                           <option value="Matrix_Green">Sci-Fi Matrix (Green Tint)</option>
                           <option value="Cinematic_TealOrange">Cinematic (Teal & Orange)</option>
                           <option value="Cyberpunk_Neon">Cyberpunk (Neon High Contrast)</option>
                           <option value="BleachBypass">Bleach Bypass (Desaturated)</option>
                        </select>
                        <div className="pt-2">
                           <div className="flex justify-between text-[11px] text-[#c9d1d9] mb-1">
                              <span className="font-bold">LUT Blend Weight</span>
                              <span className="text-[#bc8cff] font-mono">1.0</span>
                           </div>
                           <input type="range" className="w-full accent-[#bc8cff] bg-[#0a0a0a]" min="0" max="1" step="0.05" defaultValue="1.0" />
                        </div>
                     </div>
                     <div className="col-span-2 grid grid-cols-3 gap-2">
                         <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-2 flex flex-col gap-1 items-center justify-center cursor-pointer hover:border-[#bc8cff] transition">
                            <div className="w-16 h-12 bg-gradient-to-br from-[#0f172a] to-[#042f2e] border border-[#333] rounded"></div>
                            <span className="text-[9px] text-[#c9d1d9]">Matrix Green</span>
                         </div>
                         <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-2 flex flex-col gap-1 items-center justify-center cursor-pointer hover:border-[#bc8cff] transition">
                            <div className="w-16 h-12 bg-gradient-to-br from-[#1e3a8a] to-[#9a3412] border border-[#333] rounded"></div>
                            <span className="text-[9px] text-[#c9d1d9]">Teal & Orange</span>
                         </div>
                         <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-2 flex flex-col gap-1 items-center justify-center cursor-pointer hover:border-[#bc8cff] transition">
                            <div className="w-16 h-12 bg-gradient-to-br from-[#db2777] to-[#0284c7] border border-[#333] rounded"></div>
                            <span className="text-[9px] text-[#c9d1d9]">Cyberpunk</span>
                         </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#30363d]">
                     <div>
                        <div className="flex justify-between text-[11px] text-[#c9d1d9] mb-1">
                           <span>Contrast</span>
                           <span className="text-white font-mono">1.10</span>
                        </div>
                        <input type="range" className="w-full accent-[#bc8cff] bg-[#0a0a0a]" min="0.5" max="2.0" step="0.01" defaultValue="1.10" />
                     </div>
                     <div>
                        <div className="flex justify-between text-[11px] text-[#c9d1d9] mb-1">
                           <span>Saturation</span>
                           <span className="text-white font-mono">1.25</span>
                        </div>
                        <input type="range" className="w-full accent-[#bc8cff] bg-[#0a0a0a]" min="0" max="2.0" step="0.01" defaultValue="1.25" />
                     </div>
                     <div>
                        <div className="flex justify-between text-[11px] text-[#c9d1d9] mb-1">
                           <span>Film Grain</span>
                           <span className="text-white font-mono">0.15</span>
                        </div>
                        <input type="range" className="w-full accent-[#bc8cff] bg-[#0a0a0a]" min="0" max="1.0" step="0.01" defaultValue="0.15" />
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
