import React, { useState } from 'react';
import {
  BrainCircuit, HardDrive, Cpu, Terminal, Zap, DownloadCloud, Server, Database, Activity, Code2, MonitorPlay, Sparkles, Image as ImageIcon, Music, AudioWaveform, Box, Play, CheckCircle, Bone, Sliders, Hexagon, Fingerprint, Layers, X, Maximize, Quote, TrendingUp,
  Plus, Network, FolderTree, Flame, RefreshCw
} from 'lucide-react';

export default function LocalAIStudio({ setActiveTool }: { setActiveTool?: (tool: string) => void }) {
   const [activeCategory, setActiveCategory] = useState<'All' | '3D' | 'Animation' | 'Code' | 'UI' | 'Audio' | 'Fine-Tuning'>('All');
  const [activeModel, setActiveModel] = useState<string | null>('TripoSR');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#8b949e] font-sans">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e3b341]/10 to-transparent pointer-events-none"></div>
        <BrainCircuit size={28} className="text-[#e3b341] mr-4 shadow-[0_0_15px_rgba(227,179,65,0.4)]" />
        <div className="flex flex-col z-10">
          <h2 className="text-[#c9d1d9] text-[16px] font-bold tracking-tight">Omni-Local AI Compute Hub</h2>
          <p className="text-[#8b949e] text-[11px]">100% Offline Machine Learning models. Zero API calls. Runs heavily on local RTX / Apple Silicon.</p>
        </div>
        <div className="ml-auto flex gap-4 h-full items-center z-10">
           <div className="flex flex-col items-end">
              <div className="text-[10px] text-[#8b949e] uppercase font-bold flex gap-2">VRAM Usage <span className="text-[#e3b341]">21.4 GB / 24.0 GB</span></div>
              <div className="flex items-center gap-1 text-[11px]"><Cpu size={10} className="text-[#3fb950]"/> Tensor Cores Active (100%)</div>
           </div>
           <div className="w-[1px] h-8 bg-[#30363d]"></div>
           <button className="bg-[#161b22] border border-[#e3b341]/30 hover:bg-[#e3b341]/10 text-[#e3b341] px-4 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-colors">
              <Zap size={14} className="fill-current"/> Purge VRAM
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left - Model Registry */}
        <div className="w-[300px] border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#30363d]">
              <div className="relative">
                 <input type="text" placeholder="Search 500+ local models..." className="w-full bg-[#0a0a0a] border border-[#30363d] rounded text-[11px] px-3 py-2 outline-none focus:border-[#e3b341] text-white" />
                 <Server size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
              </div>
           </div>
           <div className="flex w-full overflow-x-auto custom-scrollbar border-b border-[#30363d] shrink-0 bg-[#0d1117]">
              {['All', '3D', 'Animation', 'Code', 'UI', 'Audio', 'Fine-Tuning'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${activeCategory === cat ? 'text-[#e3b341] border-b-2 border-[#e3b341] bg-[#161b22]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
                >
                  {cat}
                </button>
              ))}
           </div>

           <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
              
              <ModelItem id="TripoSR" name="TripoSR (Fast 3D)" cat="3D" icon={<Box size={14}/>} color="#58a6ff" active={activeModel} set={setActiveModel} loadState="Loaded (2.4GB)" />
              <ModelItem id="LGM" name="Large Gaussian Model" cat="3D" icon={<Hexagon size={14}/>} color="#58a6ff" active={activeModel} set={setActiveModel} loadState="Disk" />
              <ModelItem id="StableVideo3D" name="Stable Video 3D" cat="3D" icon={<MonitorPlay size={14}/>} color="#58a6ff" active={activeModel} set={setActiveModel} loadState="Disk" />

              <div className="w-full h-[1px] bg-[#30363d] my-1"></div>

              <ModelItem id="Qwen2.5-Coder" name="Qwen2.5-Coder-7B" cat="Code" icon={<Code2 size={14}/>} color="#bc8cff" active={activeModel} set={setActiveModel} loadState="Loaded (4.1GB)" />
              <ModelItem id="DeepSeek-Coder" name="DeepSeek-Coder-33B" cat="Code" icon={<Database size={14}/>} color="#bc8cff" active={activeModel} set={setActiveModel} loadState="Disk" />
              <ModelItem id="Llama3-8B" name="Llama-3-8B-Instruct" cat="Code" icon={<BrainCircuit size={14}/>} color="#bc8cff" active={activeModel} set={setActiveModel} loadState="Disk" />

              <div className="w-full h-[1px] bg-[#30363d] my-1"></div>

              <ModelItem id="MotionGPT" name="MotionGPT (Rig)" cat="Animation" icon={<Bone size={14}/>} color="#f85149" active={activeModel} set={setActiveModel} loadState="Loaded (1.2GB)" />
              <ModelItem id="Audio2Face" name="Local Audio2Face" cat="Animation" icon={<Fingerprint size={14}/>} color="#f85149" active={activeModel} set={setActiveModel} loadState="Disk" />

              <div className="w-full h-[1px] bg-[#30363d] my-1"></div>

              <ModelItem id="Bark" name="Suno Bark (TTS)" cat="Audio" icon={<AudioWaveform size={14}/>} color="#e3b341" active={activeModel} set={setActiveModel} loadState="Loaded (3.5GB)" />
              <ModelItem id="AudioCraft" name="AudioCraft (Music)" cat="Audio" icon={<Music size={14}/>} color="#e3b341" active={activeModel} set={setActiveModel} loadState="Disk" />

              <div className="w-full h-[1px] bg-[#30363d] my-1"></div>

              <ModelItem id="StableDiffusion3" name="Stable Diffusion 3" cat="UI" icon={<ImageIcon size={14}/>} color="#3fb950" active={activeModel} set={setActiveModel} loadState="Disk" />
              <ModelItem id="IPAdapter" name="IP-Adapter UI Gen" cat="UI" icon={<Layers size={14}/>} color="#3fb950" active={activeModel} set={setActiveModel} loadState="Disk" />
              
              <div className="w-full h-[1px] bg-[#30363d] my-1"></div>

              <ModelItem id="LoRATrainer" name="QLoRA Fine-Tuner MAX" cat="Fine-Tuning" icon={<MonitorPlay size={14}/>} color="#ff7b72" active={activeModel} set={setActiveModel} loadState="Tool" />
           </div>
        </div>

        {/* Right - Model Interface */}
        <div className="flex-1 bg-[#050505] relative overflow-y-auto">
            {activeModel === 'TripoSR' && <TripoSRInterface />}
            {activeModel === 'Qwen2.5-Coder' && <LLMInterface modelName="Qwen2.5-Coder-7B" setActiveTool={setActiveTool} />}
            {activeModel === 'Bark' && <BarkInterface />}
            {activeModel === 'MotionGPT' && <MotionGPTInterface />}
            {activeModel === 'LoRATrainer' && <LoRATrainerInterface />}
        </div>
      </div>
    </div>
  )
}

function ModelItem({ id, name, cat, icon, color, active, set, loadState }: any) {
  const isLoaded = loadState.includes('Loaded');
  return (
    <div onClick={() => set(id)} className={`p-2 rounded-lg cursor-pointer border flex justify-between items-center group transition-colors ${active === id ? 'bg-[#21262d] border-[#e3b341]/50' : 'bg-[#161b22] border-[#30363d] hover:border-[#8b949e]'}`}>
       <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#0a0a0a] border border-[#30363d]" style={{color}}>
             {icon}
          </div>
          <div className="flex flex-col">
             <span className={`text-[11px] font-bold ${active === id ? 'text-white' : 'text-[#c9d1d9]'}`}>{name}</span>
             <span className="text-[9px] text-[#8b949e] uppercase tracking-wider">{cat}</span>
          </div>
       </div>
       <div className="flex items-center gap-2">
          {isLoaded ? (
            <div className="w-2 h-2 rounded-full bg-[#3fb950] shadow-[0_0_5px_#3fb950]" title={loadState}></div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-[#30363d]" title={loadState}></div>
          )}
       </div>
    </div>
  )
}

function TripoSRInterface() {
   return (
      <div className="p-6 max-w-[1200px] mx-auto flex flex-col gap-6">
         <div className="flex justify-between items-start border-b border-[#30363d] pb-4">
            <div>
               <h1 className="text-white text-[24px] font-bold tracking-tight mb-1">TripoSR (Large Reconstruction Model)</h1>
               <p className="text-[#8b949e] text-[12px]">Deterministic offline Image-to-3D inference. Utilizes Signed Distance Fields (SDF) and highly optimized Marching Cubes for Sub-1s mesh extraction. Zero server dependency.</p>
            </div>
            <div className="flex flex-col items-end gap-1">
               <div className="bg-[#161b22] px-3 py-1.5 rounded border border-[#30363d] text-[10px] text-[#3fb950] font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(63,185,80,0.2)]">
                  <CheckCircle size={12}/> MODEL LOADED IN VRAM (2.4GB FP16)
               </div>
               <div className="text-[9px] text-[#8b949e]">TensorRT Engine: <span className="text-[#e3b341] font-bold">ACTIVE</span> (CUDA 12.x)</div>
            </div>
         </div>

         <div className="flex gap-6">
            <div className="w-[380px] shrink-0 flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-2 h-[calc(100vh-200px)]">
               
               {/* Input Config */}
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                  <h3 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4 border-b border-[#30363d] pb-2 text-[#58a6ff] flex items-center gap-2"><ImageIcon size={14}/> Input Processing</h3>
                  <div className="bg-[#0a0a0a] border border-[#30363d] border-dashed rounded-lg p-1 aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-[#21262d] transition-colors relative group overflow-hidden mb-4">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590725140246-20092306c116?q=80&w=300')] bg-cover bg-center opacity-50"></div>
                     <div className="relative z-10 flex flex-col items-center bg-[#161b22]/90 p-4 rounded backdrop-blur border border-[#30363d]">
                        <ImageIcon size={24} className="text-[#c9d1d9] mb-2" />
                        <span className="text-[11px] text-white font-bold">Input Base Image</span>
                        <span className="text-[9px] text-[#8b949e]">(Drag & Drop or RGB Tensor Array)</span>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                     <label className="flex items-center justify-between text-[11px] bg-[#0a0a0a] p-2 rounded border border-[#30363d]">
                        <span className="text-[#c9d1d9] font-bold">Auto Background Removal (Rembg)</span>
                        <input type="checkbox" defaultChecked className="accent-[#58a6ff]"/>
                     </label>
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#8b949e] flex justify-between">
                           <span>Foreground Ratio Padding</span>
                           <span className="text-white font-mono bg-[#161b22] px-1 rounded">0.85</span>
                        </label>
                        <input type="range" className="w-full accent-[#58a6ff]" defaultValue="85" />
                     </div>
                  </div>
               </div>

               {/* Advanced Math Parameters */}
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                  <h3 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4 border-b border-[#30363d] pb-2 text-[#e3b341] flex items-center gap-2"><Cpu size={14}/> Sub-Grid Volumetric Config</h3>
                  
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[#c9d1d9] flex justify-between">
                           <span>Marching Cubes Resolution (Grid Bounds)</span>
                           <span className="text-[#e3b341] font-mono">256^3</span>
                        </label>
                        <select defaultValue="256 (LRM Native Optimized)" className="bg-[#0a0a0a] border border-[#30363d] text-[#8b949e] font-mono text-[11px] p-2 rounded outline-none focus:border-[#e3b341]">
                           <option>128 (Faster / Low Poly)</option>
                           <option>256 (LRM Native Optimized)</option>
                           <option>512 (High Dense / Extreme VRAM)</option>
                        </select>
                     </div>

                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[#c9d1d9] flex justify-between">
                           <span>Iso-Surface Threshold</span>
                           <span className="text-white font-mono">25.0</span>
                        </label>
                        <input type="range" className="w-full accent-[#e3b341]" min="10" max="50" defaultValue="25" />
                        <p className="text-[9px] text-[#8b949e] leading-relaxed">Higher threshold forces geometry closure but may lose thin structures (like hair/weapons).</p>
                     </div>

                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[#a371f7] flex justify-between uppercase tracking-widest mt-2 border-t border-[#30363d] pt-3">
                           <span>Auto-LOD Decimation Pass</span>
                           <span className="text-white font-mono">Max 15k Tris</span>
                        </label>
                        <input type="range" className="w-full accent-[#a371f7]" min="1000" max="100000" defaultValue="15000" />
                     </div>
                  </div>
               </div>

               <button className="bg-[#58a6ff] hover:bg-[#79c0ff] text-black font-bold uppercase tracking-widest text-[12px] py-4 rounded-lg mt-2 shadow-[0_0_20px_rgba(88,166,255,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-95 group">
                  <Box size={18} className="group-hover:rotate-180 transition-transform duration-500"/> COMPILE TO MESH (INFERENCE) 
               </button>
            </div>

            {/* Viewport Area */}
            <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg relative flex flex-col h-[calc(100vh-200px)] overflow-hidden">
               
               {/* Top Control Bar */}
               <div className="h-10 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between px-3 shrink-0">
                  <div className="flex gap-2">
                     <button className="bg-[#21262d] border border-[#30363d] text-[#c9d1d9] text-[10px] font-bold px-3 py-1 rounded hover:bg-[#30363d] hover:text-white">Lit</button>
                     <button className="bg-[#0a0a0a] border border-[#58a6ff]/50 text-[#58a6ff] text-[10px] font-bold px-3 py-1 rounded shadow-[0_0_10px_rgba(88,166,255,0.2)]">Wireframe</button>
                     <button className="bg-[#21262d] border border-[#30363d] text-[#8b949e] text-[10px] font-bold px-3 py-1 rounded hover:bg-[#30363d] hover:text-white">Albedo Maps</button>
                  </div>
                  <div className="flex gap-3 text-[10px] font-mono text-[#8b949e]">
                     <div>Polys: <span className="text-white">14,892</span></div>
                     <div>Verts: <span className="text-white">7,448</span></div>
                     <div>Time: <span className="text-[#3fb950] font-bold">0.84s (CUDA FastPath)</span></div>
                  </div>
               </div>

               {/* Viewport Core */}
               <div className="flex-1 flex items-center justify-center relative">
                  <div className="absolute inset-0 z-0 opacity-30" style={{backgroundImage: 'radial-gradient(#58a6ff 1.5px, transparent 1.5px)', backgroundSize: '30px 30px'}}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-0"></div>
                  
                  <div className="relative z-10 flex flex-col items-center mt-[-50px]">
                     <div className="relative">
                        <Box size={160} className="text-[#58a6ff] opacity-90 animate-pulse" style={{filter: 'drop-shadow(0 0 30px rgba(88,166,255,0.6))'}}/>
                        {/* Wireframe Mock overlay */}
                        <Box size={160} className="text-white absolute top-0 left-0 opacity-20 mix-blend-overlay"/>
                     </div>
                     <div className="mt-8 bg-[#0a0a0a] border border-[#30363d] px-4 py-2 rounded-lg backdrop-blur flex items-center gap-3">
                        <div className="w-3 h-3 bg-[#58a6ff] rounded-full animate-ping"></div>
                        <span className="text-[#c9d1d9] text-[11px] font-bold tracking-widest uppercase">Inference Engine Active</span>
                     </div>
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2 z-20">
                     <button className="bg-[#58a6ff]/20 p-2.5 rounded-lg border border-[#58a6ff] hover:bg-[#58a6ff]/40 text-[#58a6ff] transition-colors" title="Export as FBX/GLTF">
                        <DownloadCloud size={16}/>
                     </button>
                     <button className="bg-[#21262d] p-2.5 rounded-lg border border-[#30363d] hover:bg-[#30363d] text-[#c9d1d9]">
                        <Maximize size={16}/>
                     </button>
                  </div>
               </div>

               {/* Dev Log Terminal via Output */}
               <div className="h-[120px] bg-[#0a0a0a] border-t border-[#30363d] flex flex-col shrink-0 font-mono text-[10px]">
                  <div className="text-[#8b949e] font-bold py-1 px-3 border-b border-[#30363d] bg-[#161b22] uppercase tracking-wider flex justify-between">
                     <span>C++ CUDA Kernel Logs</span>
                     <span className="text-[#3fb950]">Status: Idle</span>
                  </div>
                  <div className="p-3 overflow-y-auto space-y-1 text-[#c9d1d9]">
                     <div className="text-[#8b949e]">[TripoSR Backend] Initializing ONNX Runtime GPU (CUDA 12.1)...</div>
                     <div className="text-[#8b949e]">[TripoSR Backend] Allocated 2.41GB VRAM for TripoSR.onnx</div>
                     <div className="text-[#c9d1d9]">[Inference] Extracting Vit features... Latency: 42ms</div>
                     <div className="text-[#e3b341]">[MarchingCubes_CUDA] Allocating Dense Grid 256x256x256. Found 14,892 triangles.</div>
                     <div className="text-[#3fb950] font-bold">[Success] Mesh generation completed. Auto-LOD executed. 0.84s total.</div>
                  </div>
               </div>

            </div>
         </div>
      </div>
   )
}

function LLMInterface({ modelName, setActiveTool }: { modelName: string, setActiveTool?: (tool: string) => void }) {
  return (
    <div className="p-6 max-w-[1400px] mx-auto flex gap-6 h-full">
       <div className="flex-1 border border-[#30363d] bg-[#161b22] rounded-lg overflow-hidden flex flex-col h-full">
          <div className="flex justify-between items-center border-b border-[#30363d] p-4 shrink-0 bg-[#0d1117]">
             <div>
                <h1 className="text-white text-[20px] font-bold tracking-tight flex items-center gap-2"><BrainCircuit className="text-[#bc8cff]"/> {modelName}</h1>
                <p className="text-[#8b949e] text-[11px] mt-1">Multi-Agent Code Synthesis & RAG Context Engine.</p>
             </div>
             <div className="flex gap-4">
               <div className="flex flex-col text-right">
                  <span className="text-[#8b949e] text-[10px] uppercase font-bold">KV Cache / Context</span>
                  <span className="text-[#bc8cff] font-mono text-[12px] font-bold">14.6K / 32K</span>
               </div>
               <div className="bg-[#bc8cff]/10 px-3 py-1.5 rounded border border-[#bc8cff]/30 text-[10px] text-[#bc8cff] font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(188,140,255,0.2)]">
                  <Activity size={12}/> INFERENCE @ 84 tokens/s
               </div>
             </div>
          </div>

          <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
             {/* Chat Mockup */}
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded border border-[#30363d] bg-[#21262d] flex justify-center items-center shrink-0 shadow-inner">U</div>
                <div className="mt-1 text-[13px] text-[#c9d1d9] leading-relaxed">Analyze the memory layout of my multithreaded ECS renderer. I'm hitting false sharing across CPU cores.</div>
             </div>
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded border border-[#bc8cff]/50 bg-[#bc8cff]/10 text-[#bc8cff] flex justify-center items-center shrink-0 shadow-[0_0_10px_rgba(188,140,255,0.2)]"><BrainCircuit size={16}/></div>
                <div className="mt-1 text-[13px] text-[#c9d1d9] w-full">
                   <p className="mb-4 leading-relaxed">False sharing occurs because your `TransformComponent` array aligns components from different entities onto the same 64-byte L1 cache line. Thread A modifying Entity 1 invalidates the cache for Thread B reading Entity 2. <br/><br/>You need to align the struct to the cache line size using `alignas(64)` and pad the data, or swap to a Data-Oriented SoA (Structure of Arrays) layout instead of AoS.</p>
                   
                   <div className="bg-[#0a0a0a] border border-[#30363d] rounded-lg overflow-hidden mb-4 shadow-lg">
                      <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-2 flex items-center justify-between text-[11px] font-mono text-[#8b949e]">
                         <span>ECS_TransformComponent.h (Cache-Aligned)</span>
                         <span>C++20</span>
                      </div>
                      <div className="p-4 font-mono text-[12px] leading-relaxed">
                         <span className="text-[#a5d6ff]">#include</span> <span className="text-[#a371f7]">&lt;immintrin.h&gt;</span>{'\n'}
                         <span className="text-[#ff7b72]">struct</span> <span className="text-[#d2a8ff]">alignas</span>(<span className="text-[#79c0ff]">64</span>) <span className="text-[#ff7b72]">TransformComponent</span> {'\n'}
                         <span className="text-[#c9d1d9]">&#123;</span>{'\n'}
                         <span className="text-[#8b949e]">    // Position Data (SIMD __m256 optimized)</span>{'\n'}
                         <span className="text-[#ff7b72]">    __m256</span> <span className="text-[#c9d1d9]">PositionData</span>;{'\n'}
                         <span className="text-[#8b949e]">    // Padding to fill exactly 64-bytes (L1 cache line)</span>{'\n'}
                         <span className="text-[#ff7b72]">    float</span> <span className="text-[#c9d1d9]">padding[</span><span className="text-[#79c0ff]">8</span><span className="text-[#c9d1d9]">]</span>;{'\n'}
                         <span className="text-[#c9d1d9]">&#125;</span>;
                      </div>
                   </div>
                   
                   <div className="flex gap-2 mb-6 border-b border-[#30363d] pb-6">
                     <button className="bg-[#21262d] border border-[#30363d] px-3 py-1.5 rounded text-[11px] font-bold hover:text-white hover:bg-[#30363d] transition-colors shadow">Copy Code</button>
                     <button className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 text-[#bc8cff] px-3 py-1.5 font-bold rounded text-[11px] hover:bg-[#bc8cff] hover:text-black transition-colors shadow">Patch to Workspace</button>
                     <button onClick={() => setActiveTool?.('ScriptEditor')} className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 text-[#bc8cff] px-3 py-1.5 font-bold rounded text-[11px] hover:bg-[#bc8cff] hover:text-black transition-colors shadow flex gap-2 items-center"><TrendingUp size={12}/> Deploy & Jump to Script</button>
                   </div>
                   
                   <div className="bg-[#0a0a0a] border border-[#bc8cff]/30 p-4 rounded-lg flex flex-col gap-4 relative overflow-hidden group">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-[#bc8cff] mix-blend-screen opacity-10 filter blur-[40px] rounded-full pointer-events-none"></div>
                      <div className="flex items-center gap-3 border-b border-[#bc8cff]/20 pb-3 relative z-10">
                        <div className="p-2 bg-[#bc8cff]/20 rounded-lg text-[#bc8cff]"><Layers size={20}/></div>
                        <div className="flex-1">
                           <div className="text-[12px] font-bold text-white tracking-wide">Orchestrate Engine Blueprint</div>
                           <div className="text-[10px] text-[#8b949e]">Generate a full C++ CMake ecosystem. Automatic Network Simulator bridging included.</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 relative z-10">
                         <label className="flex items-center gap-3 bg-[#161b22] border border-[#30363d] p-3 rounded-lg cursor-pointer hover:border-[#bc8cff] transition-colors">
                            <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4" />
                            <span className="text-[11px] text-[#c9d1d9] font-bold">Unreal Engine / Unity Plugin</span>
                         </label>
                         <label className="flex items-center gap-3 bg-[#161b22] border border-[#30363d] p-3 rounded-lg cursor-pointer hover:border-[#bc8cff] transition-colors">
                            <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4" />
                            <span className="text-[11px] text-[#c9d1d9] font-bold">Go / Rust Dedicated Server</span>
                         </label>
                         <label className="flex items-center gap-3 bg-[#161b22] border border-[#30363d] p-3 rounded-lg cursor-pointer hover:border-[#bc8cff] transition-colors">
                            <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-4 h-4" />
                            <span className="text-[11px] text-[#c9d1d9] font-bold">WebRTC Web Portal</span>
                         </label>
                         <label className="flex items-center gap-3 bg-[#161b22] border border-[#30363d] p-3 rounded-lg cursor-pointer hover:border-[#bc8cff] transition-colors">
                            <input type="checkbox" className="accent-[#bc8cff] w-4 h-4" />
                            <span className="text-[11px] text-[#c9d1d9] font-bold">Kubernetes Orchestration YAML</span>
                         </label>
                      </div>
                      <div className="flex justify-end mt-2 relative z-10">
                        <button className="bg-[#bc8cff] text-[#0a0a0a] font-bold px-6 py-2.5 rounded-lg text-[11px] uppercase tracking-widest hover:bg-[#d2a8ff] transition-transform active:scale-95 shadow-[0_0_20px_rgba(188,140,255,0.4)] flex items-center gap-2">
                           <Sparkles size={16} /> scaffold ecosystem
                        </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <div className="p-4 bg-[#0a0a0a] border-t border-[#30363d]">
             <div className="relative">
                <textarea className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-4 pl-4 pr-32 text-[12px] text-white resize-none outline-none focus:border-[#bc8cff] focus:shadow-[0_0_10px_rgba(188,140,255,0.1)] transition-all shadow-inner" placeholder="Execute offline coding task or prompt codebase analysis..." rows={3}></textarea>
                <div className="absolute bottom-4 right-4 flex gap-2">
                   <button className="p-2 text-[#8b949e] hover:text-[#bc8cff] hover:bg-[#bc8cff]/10 rounded border border-transparent transition-colors"><ImageIcon size={16}/></button>
                   <button className="p-2 text-[#8b949e] hover:text-[#bc8cff] hover:bg-[#bc8cff]/10 rounded border border-transparent transition-colors"><Code2 size={16}/></button>
                   <button className="px-4 py-2 bg-[#bc8cff] text-[#0a0a0a] font-bold uppercase tracking-wider text-[11px] rounded hover:bg-[#d2a8ff] flex items-center gap-2 shadow-[0_4px_10px_rgba(188,140,255,0.3)]"><Zap size={14}/> Run</button>
                </div>
             </div>
          </div>
       </div>

       {/* Technical Hyper-parameter Side Panel */}
       <div className="w-[320px] bg-[#161b22] border border-[#30363d] rounded-lg shrink-0 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-[#30363d] bg-[#0d1117] flex items-center gap-2">
             <Sliders size={16} className="text-[#8b949e]"/>
             <h3 className="text-white text-[12px] font-bold uppercase tracking-widest">Inference Engine Tech</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
             
             {/* Quantization */}
             <div className="space-y-3">
                <label className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest flex items-center gap-2"><Database size={12}/> Weights Loading</label>
                <div className="grid grid-cols-3 gap-2">
                   <button className="bg-[#21262d] border text-[#8b949e] border-[#30363d] rounded py-1.5 text-[10px] font-mono hover:bg-[#30363d] transition-colors">INT4</button>
                   <button className="bg-[#bc8cff]/10 border text-[#bc8cff] border-[#bc8cff] rounded py-1.5 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(188,140,255,0.2)]">INT8 (Q8_0)</button>
                   <button className="bg-[#21262d] border text-[#8b949e] border-[#30363d] rounded py-1.5 text-[10px] font-mono hover:bg-[#30363d] transition-colors">FP16</button>
                </div>
                <div className="text-[9px] text-[#8b949e] leading-relaxed">INT8 provides the best instruction-following for code generation while saving 50% VRAM compared to FP16.</div>
             </div>

             {/* Compute Optimizations */}
             <div className="space-y-3 pt-4 border-t border-[#30363d]">
                <label className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest flex items-center gap-2"><Cpu size={12}/> GPU Compute Acceleration</label>
                
                <label className="flex items-center justify-between p-2 bg-[#0a0a0a] border border-[#30363d] rounded cursor-pointer group">
                   <span className="text-[11px] text-[#c9d1d9] group-hover:text-white">Flash Attention 2</span>
                   <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-3.5 h-3.5" />
                </label>
                
                <label className="flex items-center justify-between p-2 bg-[#0a0a0a] border border-[#30363d] rounded cursor-pointer group">
                   <div className="flex flex-col">
                     <span className="text-[11px] text-[#c9d1d9] group-hover:text-white">Speculative Decoding</span>
                     <span className="text-[9px] text-[#8b949e]">Using Medusa Draft Model</span>
                   </div>
                   <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-3.5 h-3.5" />
                </label>

                <label className="flex flex-col gap-2 p-3 bg-[#0a0a0a] border border-[#30363d] rounded">
                   <div className="flex justify-between items-center">
                     <span className="text-[11px] text-[#c9d1d9]">GPU Layers Offloaded</span>
                     <span className="text-[10px] font-mono text-[#bc8cff]">32/32</span>
                   </div>
                   <input type="range" className="accent-[#bc8cff] w-full" defaultValue="32" min="0" max="32" />
                </label>
             </div>

             {/* Generation Params */}
             <div className="space-y-4 pt-4 border-t border-[#30363d]">
                <label className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest flex items-center gap-2"><Sparkles size={12}/> Sampling Params</label>
                
                <div className="flex flex-col gap-1.5">
                   <span className="text-[10px] text-[#c9d1d9] flex justify-between">Temperature <span className="font-mono">0.10</span></span>
                   <input type="range" className="accent-[#bc8cff] w-full" defaultValue="10" min="0" max="100"/>
                   <span className="text-[8px] text-[#8b949e]">Kept low for deterministic code syntax.</span>
                </div>
                
                <div className="flex flex-col gap-1.5">
                   <span className="text-[10px] text-[#c9d1d9] flex justify-between">Top P (Nucleus) <span className="font-mono">0.95</span></span>
                   <input type="range" className="accent-[#bc8cff] w-full" defaultValue="95" min="0" max="100"/>
                </div>
                
                <div className="flex flex-col gap-1.5">
                   <span className="text-[10px] text-[#c9d1d9] flex justify-between">Repetition Penalty <span className="font-mono">1.15</span></span>
                   <input type="range" className="accent-[#bc8cff] w-full" defaultValue="115" min="100" max="200"/>
                </div>
             </div>

             {/* LoRA Adapters */}
             <div className="space-y-3 pt-4 border-t border-[#30363d]">
                <label className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest flex items-center gap-2"><Layers size={12}/> Active LoRA Adapters</label>
                <div className="flex items-center justify-between p-2 bg-[#bc8cff]/10 border border-[#bc8cff]/30 rounded">
                   <span className="text-[11px] text-[#bc8cff] font-bold">Unreal_Engine_CPP_Instruct.safetensors</span>
                   <span className="text-[10px] text-[#8b949e] font-mono">r=64</span>
                </div>
                <button className="w-full bg-[#161b22] border border-[#30363d] border-dashed hover:border-[#8b949e] text-[#8b949e] text-[10px] uppercase font-bold py-2 rounded transition-colors flex items-center justify-center gap-2">
                   <Plus size={12}/> Load LoRA Weights
                </button>
             </div>

          </div>
       </div>
    </div>
  )
}

function BarkInterface() {
  return (
    <div className="p-6 max-w-[1200px] mx-auto flex flex-col h-full gap-6">
      <div className="flex justify-between items-start border-b border-[#30363d] pb-4 shrink-0">
          <div>
             <h1 className="text-white text-[24px] font-bold tracking-tight mb-1 flex items-center gap-3"><AudioWaveform className="text-[#e3b341]"/> Suno Bark & AudioCraft Hub</h1>
             <p className="text-[#8b949e] text-[12px]">Generative 3D Audio, Neural Text-to-Speech with emotions, and procedural soundscapes. Runs locally.</p>
          </div>
          <div className="flex flex-col items-end gap-1">
             <div className="bg-[#161b22] px-3 py-1.5 rounded border border-[#30363d] text-[10px] text-[#3fb950] font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(63,185,80,0.2)]">
                <CheckCircle size={12}/> BARK LOADED (3.5GB)
             </div>
             <div className="text-[9px] text-[#8b949e]">Sampling Hz: <span className="text-white font-bold">48,000 (Studio Quality)</span></div>
          </div>
       </div>

       <div className="flex gap-6 h-full min-h-0">
         {/* Generator Config */}
         <div className="flex-[4] flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-2 pb-6">
            
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
               <h3 className="text-[#e3b341] text-[12px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Quote size={14}/> Semantic Text Prompt</h3>
               <textarea className="w-full h-32 bg-[#0a0a0a] border border-[#30363d] rounded-lg p-4 text-[13px] text-white focus:border-[#e3b341] outline-none shadow-inner leading-relaxed" defaultValue={`[clears throat] Hello! This is a completely offline, local AI voice. [laughs] Isn't that crazy? ♪ The background music begins to swell with an epic orchestral wave ♪`}></textarea>
               <div className="mt-2 text-[10px] text-[#8b949e] font-mono">Use [laughs], [sighs], [gasps], or ♪ for musical cues.</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                  <h3 className="text-[#c9d1d9] text-[11px] font-bold uppercase tracking-widest mb-4 border-b border-[#30363d] pb-2">Acoustic Settings</h3>
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold text-[#8b949e]">Speaker Embedding (Cloning)</label>
                        <select className="bg-[#0a0a0a] border border-[#30363d] text-white p-2.5 rounded text-[11px] outline-none w-full">
                           <option>EN_Speaker_0 (Standard)</option>
                           <option>Hero_Commander_Base.pt (Cloned Voiceline)</option>
                           <option>Gravely_Monster_02.pt</option>
                           <option>System_AI_Female.nemo</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold text-[#8b949e] flex justify-between"><span>Semantic Temp</span> <span className="text-white">0.7</span></label>
                        <input type="range" className="w-full accent-[#e3b341]" defaultValue="70"/>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold text-[#8b949e] flex justify-between"><span>Waveform Temp</span> <span className="text-white">0.8</span></label>
                        <input type="range" className="w-full accent-[#e3b341]" defaultValue="80"/>
                     </div>
                  </div>
               </div>

               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                  <h3 className="text-[#c9d1d9] text-[11px] font-bold uppercase tracking-widest mb-4 border-b border-[#30363d] pb-2">Audio Mixing & FX Master</h3>
                  <div className="flex flex-col gap-3">
                     <label className="flex justify-between items-center bg-[#0a0a0a] p-2 rounded cursor-pointer border border-[#30363d]">
                        <span className="text-[11px] text-[#c9d1d9] font-bold">Auto-Denoise (Spectral)</span>
                        <input type="checkbox" defaultChecked className="accent-[#e3b341]"/>
                     </label>
                     <label className="flex justify-between items-center bg-[#0a0a0a] p-2 rounded cursor-pointer border border-[#30363d]">
                        <span className="text-[11px] text-[#c9d1d9] font-bold">Limit Audio Peaks (Compressor)</span>
                        <input type="checkbox" defaultChecked className="accent-[#e3b341]"/>
                     </label>
                     <div className="mt-2 flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold text-[#8b949e] flex items-center justify-between">
                           <span><Network size={12} className="inline mr-1"/> Spatial HRTF Engine</span>
                           <span className="text-[#e3b341]">Dolby Atmos 7.1</span>
                        </label>
                     </div>
                  </div>
               </div>
            </div>

            <button className="bg-[#e3b341] hover:bg-[#f1c24e] text-black font-bold uppercase tracking-widest text-[14px] py-4 rounded-lg shadow-[0_0_20px_rgba(227,179,65,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-95 group">
               <AudioWaveform size={20} className="group-hover:animate-pulse"/> Generate Audio Sequence
            </button>
         </div>

         {/* Spectral View & Library */}
         <div className="flex-[3] bg-[#161b22] border border-[#30363d] rounded-lg flex flex-col overflow-hidden h-full">
            <div className="p-4 border-b border-[#30363d] bg-[#0d1117]">
               <h3 className="text-white text-[12px] uppercase font-bold tracking-widest flex items-center gap-2"><Layers size={14}/> Output Spectrogram & Library</h3>
            </div>
            
            {/* Spectral Viewer Mock */}
            <div className="h-[200px] bg-[#0a0a0a] border-b border-[#30363d] relative overflow-hidden group">
               <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800')] bg-cover bg-center filter grayscale contrast-150 mix-blend-screen"></div>
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#e3b341]/20 to-transparent mix-blend-overlay"></div>
               
               {/* Playhead */}
               <div className="absolute top-0 bottom-0 w-[1px] bg-[#ff7b72] left-1/3 shadow-[0_0_10px_#ff7b72] z-10 transition-transform cursor-ew-resize">
                  <div className="w-2 h-2 bg-[#ff7b72] rounded -ml-[3.5px]"></div>
               </div>

               <div className="absolute top-2 right-2 flex gap-2 z-20">
                  <span className="bg-[#161b22] border border-[#30363d] px-2 py-0.5 rounded text-[9px] text-[#e3b341] font-mono">00:03.400</span>
               </div>
               <button className="absolute bottom-4 left-4 bg-[#e3b341] text-black rounded-full p-3 shadow-lg hover:scale-105 active:scale-95 transition-all z-20">
                  <Play size={18} className="translate-x-[1px]"/>
               </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-2">
               {[
                  { name: 'NPC_Greeting_Bark_04.wav', len: '4.2s', size: '204KB' },
                  { name: 'Boss_Laugh_Demonic.wav', len: '8.1s', size: '440KB', active: true },
                  { name: 'Ambient_Wind_Howl_Layer.wav', len: '15.0s', size: '900KB' },
               ].map(t => (
                  <div className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer group transition-colors ${t.active ? 'bg-[#e3b341]/10 border-[#e3b341]/50' : 'bg-[#0a0a0a] border-[#30363d] hover:border-[#8b949e]'}`}>
                     <div className="flex flex-col">
                        <span className={`text-[11px] font-bold ${t.active ? 'text-[#e3b341]' : 'text-[#c9d1d9]'}`}>{t.name}</span>
                        <div className="flex text-[9px] text-[#8b949e] font-mono gap-3 mt-1">
                           <span>{t.len}</span> <span>{t.size}</span> <span>48kHz</span>
                        </div>
                     </div>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-[#8b949e] hover:text-white bg-[#161b22] rounded border border-[#30363d]"><Box size={12} /></button>
                        <button className="p-1.5 text-[#8b949e] hover:text-[#e3b341] bg-[#161b22] rounded border border-[#30363d]"><DownloadCloud size={12}/></button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
       </div>
    </div>
  )
}

function MotionGPTInterface() {
   return (
      <div className="p-6 max-w-[1400px] mx-auto flex flex-col h-full gap-6">
         <div className="flex justify-between items-start border-b border-[#30363d] pb-4 shrink-0">
            <div>
               <h1 className="text-white text-[24px] font-bold tracking-tight mb-1 flex items-center gap-3"><Bone className="text-[#f85149]"/> MotionGPT & Neural Rig Logic</h1>
               <p className="text-[#8b949e] text-[12px]">Text-to-Motion neural synthesis and Inverse Kinematics (IK) physics solver. Generate AAA animations from text prompts instantly offline.</p>
            </div>
            <div className="flex flex-col items-end gap-1">
               <div className="bg-[#161b22] px-3 py-1.5 rounded border border-[#30363d] text-[10px] text-[#3fb950] font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(63,185,80,0.2)]">
                  <CheckCircle size={12}/> MOTION_GPTV2.BIN (1.2GB)
               </div>
               <div className="text-[9px] text-[#8b949e]">Rig Structure: <span className="text-[#f85149] font-bold">Unreal Engine 5 Core (62 Bones)</span></div>
            </div>
         </div>

         <div className="flex gap-6 h-full min-h-0">
            {/* Input & Parameters */}
            <div className="flex-[2] flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-2 pb-6">
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                  <h3 className="text-[#f85149] text-[12px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Cpu size={14}/> Semantic Kinematics Prompt</h3>
                  <textarea className="w-full h-24 bg-[#0a0a0a] border border-[#30363d] rounded-lg p-4 text-[13px] text-white focus:border-[#f85149] outline-none shadow-inner leading-relaxed" defaultValue={`The character performs a heavy backflip, lands on one knee to absorb the impact, and immediately goes into a defensive guard stance.`}></textarea>
               </div>

               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                  <h3 className="text-[#c9d1d9] text-[11px] font-bold uppercase tracking-widest mb-4 border-b border-[#30363d] pb-2">Physics & IK Retargeting Constraints</h3>
                  
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold text-[#8b949e] flex justify-between">
                           <span>Center of Mass Gravity (m/s²)</span>
                           <span className="text-white font-mono">-9.81</span>
                        </label>
                        <input type="range" className="w-full accent-[#f85149]" defaultValue="98" min="10" max="250"/>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold text-[#8b949e] flex justify-between">
                           <span>Joint Impedance (Stiffness)</span>
                           <span className="text-white font-mono">High</span>
                        </label>
                        <input type="range" className="w-full accent-[#f85149]" defaultValue="80" min="0" max="100"/>
                        <p className="text-[9px] text-[#8b949e]">Higher stiffness = robotic/heavy combat. Lower = organic/fluid.</p>
                     </div>
                     
                     <div className="mt-2 space-y-2">
                        <label className="flex justify-between items-center bg-[#0a0a0a] p-2 rounded cursor-pointer border border-[#30363d]">
                           <span className="text-[11px] text-[#c9d1d9] font-bold">Lock Foot IK (Prevent Sliding)</span>
                           <input type="checkbox" defaultChecked className="accent-[#f85149]"/>
                        </label>
                        <label className="flex justify-between items-center bg-[#0a0a0a] p-2 rounded cursor-pointer border border-[#30363d]">
                           <span className="text-[11px] text-[#c9d1d9] font-bold">Auto-Root Motion Extraction</span>
                           <input type="checkbox" defaultChecked className="accent-[#f85149]"/>
                        </label>
                     </div>
                  </div>
               </div>

               <button className="bg-[#f85149] hover:bg-[#ff7b72] text-black font-bold uppercase tracking-widest text-[14px] py-4 rounded-lg shadow-[0_0_20px_rgba(248,81,73,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-95 group mt-auto">
                  <Activity size={20} className="group-hover:animate-ping"/> Synthesize Anim Sequence
               </button>
            </div>

            {/* Animation Viewer Node Graph Hybrid */}
            <div className="flex-[5] bg-[#161b22] border border-[#30363d] rounded-lg relative flex flex-col overflow-hidden h-full">
               <div className="h-10 bg-[#0d1117] border-b border-[#30363d] flex items-center px-4 shrink-0 justify-between">
                  <div className="flex items-center gap-4">
                     <button className="text-[#8b949e] hover:text-white"><Play size={16}/></button>
                     <div className="w-[200px] h-1 bg-[#30363d] rounded relative cursor-pointer">
                        <div className="absolute top-0 bottom-0 bg-[#f85149] rounded" style={{width: '65%'}}></div>
                        <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow" style={{left: '65%'}}></div>
                     </div>
                     <span className="text-[#f85149] font-mono text-[10px]">FR: 114 / 280</span>
                  </div>
                  <div className="flex gap-2">
                     <button className="bg-[#21262d] p-1.5 rounded border border-[#30363d] hover:bg-[#30363d] text-[#c9d1d9]"><MonitorPlay size={14}/></button>
                  </div>
               </div>

               <div className="flex-1 relative flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#f85149 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                  
                  {/* Bone Hierarchy / Stick Figure representation */}
                  <div className="relative w-full h-full flex items-center justify-center pointer-events-none z-10">
                     <svg width="400" height="400" viewBox="0 0 100 100" className="text-[#f85149] opacity-80 filter drop-shadow-[0_0_8px_rgba(248,81,73,0.8)] overflow-visible">
                        {/* Fake animated stick logic */}
                        <circle cx="50" cy="20" r="4" fill="currentColor"/>
                        {/* Spine */}
                        <line x1="50" y1="24" x2="50" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        {/* Arms */}
                        <line x1="50" y1="30" x2="30" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="30" y1="40" x2="20" y2="60" stroke="#ff7b72" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="50" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="70" y1="30" x2="80" y2="15" stroke="#ff7b72" strokeWidth="2" strokeLinecap="round"/>
                        {/* Legs */}
                        <line x1="50" y1="50" x2="35" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="35" y1="70" x2="30" y2="95" stroke="#ff7b72" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="50" y1="50" x2="60" y2="65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="60" y1="65" x2="80" y2="85" stroke="#ff7b72" strokeWidth="2" strokeLinecap="round"/>
                        {/* Ground plane */}
                        <line x1="-100" y1="95" x2="200" y2="95" stroke="#30363d" strokeWidth="1" strokeDasharray="4"/>
                     </svg>
                  </div>
                  
                  {/* Floating IK Target Mockups */}
                  <div className="absolute bottom-[20%] left-[30%] w-3 h-3 border-2 border-[#58a6ff] rounded-sm bg-transparent pointer-events-auto cursor-move shadow-[0_0_10px_#58a6ff]"></div>
                  <div className="absolute top-[30%] right-[30%] w-3 h-3 border-2 border-[#58a6ff] rounded-sm bg-transparent pointer-events-auto cursor-move shadow-[0_0_10px_#58a6ff]"></div>

                  <div className="absolute bottom-4 left-4 bg-[#161b22]/90 border border-[#30363d] p-3 rounded backdrop-blur">
                     <div className="text-[10px] text-[#f85149] font-bold uppercase tracking-widest mb-2 border-b border-[#30363d] pb-1">Kinematic Velocity (pelvis)</div>
                     <div className="flex gap-4 font-mono text-[11px] text-[#c9d1d9]">
                        <div>vx: <span className="text-white">4.21</span></div>
                        <div>vy: <span className="text-white">12.5</span></div>
                        <div>vz: <span className="text-white">-0.05</span></div>
                     </div>
                  </div>
               </div>

               {/* Timeline Keys Mockup */}
               <div className="h-24 bg-[#0d1117] border-t border-[#30363d] p-2 flex flex-col gap-1 overflow-x-auto custom-scrollbar relative font-mono text-[9px] text-[#8b949e]">
                  <div className="flex items-center gap-2 border-b border-[#30363d] pb-1 w-[800px]">
                     <div className="w-16 shrink-0 text-[#f85149]">Root (Z)</div>
                     <div className="flex-1 relative h-4">
                        <div className="absolute top-1.5 w-full h-[1px] bg-[#30363d]"></div>
                        {[10, 25, 45, 65, 85].map(p => (
                           <div key={p} className="absolute top-1 w-1.5 h-1.5 bg-[#f85149] rounded-[1px] rotate-45 transform origin-center cursor-pointer hover:scale-150 transition-transform" style={{left: `${p}%`}}></div>
                        ))}
                     </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-[#30363d] pb-1 w-[800px]">
                     <div className="w-16 shrink-0 text-[#c9d1d9]">Spine_01</div>
                     <div className="flex-1 relative h-4">
                        <div className="absolute top-1.5 w-full h-[1px] bg-[#30363d]"></div>
                        {[20, 50, 70].map(p => (
                           <div key={p} className="absolute top-1 w-1.5 h-1.5 bg-[#c9d1d9] rounded-[1px] rotate-45 transform origin-center cursor-pointer hover:scale-150 transition-transform" style={{left: `${p}%`}}></div>
                        ))}
                     </div>
                  </div>
                  <div className="flex items-center gap-2 w-[800px]">
                     <div className="w-16 shrink-0 text-[#c9d1d9]">Foot_R_IK</div>
                     <div className="flex-1 relative h-4">
                        <div className="absolute top-1.5 w-full h-[1px] bg-[#30363d]"></div>
                        {/* Fixed constraint blocks for Foot IK */}
                        <div className="absolute top-0.5 h-3 bg-[#e3b341]/30 border border-[#e3b341] rounded-[2px]" style={{left: '0%', width: '15%'}}></div>
                        <div className="absolute top-0.5 h-3 bg-[#e3b341]/30 border border-[#e3b341] rounded-[2px]" style={{left: '60%', width: '40%'}}></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

function LoRATrainerInterface() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto flex flex-col h-full gap-6">
      <div className="flex justify-between items-start border-b border-[#30363d] pb-4 shrink-0">
          <div>
             <h1 className="text-white text-[24px] font-bold tracking-tight mb-1 flex items-center gap-3"><Database className="text-[#ff7b72]"/> QLoRA Deep Fine-Tuning Studio</h1>
             <p className="text-[#8b949e] text-[12px]">Train low-rank adaptation weights on your local codebase or datasets. Injects project-specific context permanently without RAG overhead.</p>
          </div>
          <div className="flex flex-col items-end gap-1">
             <div className="bg-[#161b22] px-3 py-1.5 rounded border border-[#30363d] text-[10px] text-[#ff7b72] font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(255,123,114,0.2)]">
                <Database size={12}/> VIRTUAL MEMORY (PAGED OPTIMIZER)
             </div>
             <div className="text-[9px] text-[#8b949e]">Framework: <span className="text-white font-bold">Unsloth/HuggingFace PEFT</span></div>
          </div>
       </div>

       <div className="flex gap-6 h-full min-h-0">
          {/* Dataset & Params */}
          <div className="flex-[2] flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-2 pb-6">
             <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                <h3 className="text-[#58a6ff] text-[12px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><FolderTree size={14}/> Dataset Preparation</h3>
                <div className="border border-dashed border-[#58a6ff]/50 rounded-lg p-5 bg-[#0a0a0a] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#21262d] transition-colors">
                   <Code2 size={24} className="text-[#58a6ff] mb-2"/>
                   <span className="text-[11px] font-bold text-white mb-1">Scan Entire Workspace `.cpp/.h`</span>
                   <span className="text-[9px] text-[#8b949e]">Automatically parse AST and generate Instruction-Response pairs for your codebase architecture.</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] bg-[#0d1117] p-2 rounded border border-[#30363d]">
                   <span className="text-[#c9d1d9]">Pairs Extracted:</span>
                   <span className="text-[#3fb950] font-mono font-bold">14,204</span>
                </div>
             </div>

             <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                <h3 className="text-[#ff7b72] text-[12px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Sliders size={14}/> QLoRA Hyper-parameters</h3>
                
                <div className="flex flex-col gap-4">
                   <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-[#c9d1d9] flex justify-between font-bold"><span>Rank (r)</span><span className="text-white font-mono">64</span></label>
                      <input type="range" className="w-full accent-[#ff7b72]" defaultValue="64" min="8" max="256" step="8"/>
                      <span className="text-[8px] text-[#8b949e]">Higher = more fidelity, higher VRAM training cost.</span>
                   </div>
                   
                   <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-[#c9d1d9] flex justify-between font-bold"><span>Alpha (Scaling)</span><span className="text-white font-mono">128</span></label>
                      <input type="range" className="w-full accent-[#ff7b72]" defaultValue="128" min="16" max="512" step="16"/>
                   </div>

                   <div className="grid grid-cols-2 gap-3 mt-2 border-t border-[#30363d] pt-3">
                      <div className="flex flex-col gap-2">
                         <label className="text-[10px] text-[#8b949e] font-bold">Target Modules</label>
                         <select className="bg-[#0a0a0a] border border-[#30363d] text-white p-2 rounded text-[10px] outline-none">
                            <option>All Linear (q, k, v, o, gate, up, down)</option>
                            <option>Attention Only (q, v)</option>
                         </select>
                      </div>
                      <div className="flex flex-col gap-2">
                         <label className="text-[10px] text-[#8b949e] font-bold">Learning Rate</label>
                         <input type="text" defaultValue="2e-4" className="bg-[#0a0a0a] border border-[#30363d] text-white p-2 rounded text-[10px] outline-none font-mono"/>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3 mt-1">
                      <label className="flex items-center gap-2 bg-[#0a0a0a] p-2 rounded border border-[#30363d]">
                         <input type="checkbox" defaultChecked className="accent-[#ff7b72]"/>
                         <span className="text-[10px] text-[#c9d1d9] font-bold">Gradient Checkpointing</span>
                      </label>
                      <label className="flex items-center gap-2 bg-[#0a0a0a] p-2 rounded border border-[#30363d]">
                         <input type="checkbox" defaultChecked className="accent-[#ff7b72]"/>
                         <span className="text-[10px] text-[#c9d1d9] font-bold">Paged AdamW 8-bit</span>
                      </label>
                   </div>
                </div>
             </div>

             <button className="bg-[#ff7b72] hover:bg-[#ff948f] text-black font-bold uppercase tracking-widest text-[14px] py-4 rounded-lg shadow-[0_0_20px_rgba(255,123,114,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-95 group mt-auto">
                <Flame size={20} className="group-hover:animate-bounce"/> Initiate Model Fine-Tuning
             </button>
          </div>

          {/* Metrics & Graph Terminal */}
          <div className="flex-[3] bg-[#050505] border border-[#30363d] rounded-lg flex flex-col overflow-hidden h-full">
             <div className="h-12 bg-[#0d1117] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0">
                <h3 className="text-white text-[12px] uppercase font-bold tracking-widest flex items-center gap-2"><TrendingUp size={14} className="text-[#3fb950]"/> TensorBoard Metrics</h3>
                <div className="flex gap-4 font-mono text-[10px]">
                   <span className="text-[#8b949e]">Epoch: <span className="text-white">1.4 / 3.0</span></span>
                   <span className="text-[#8b949e]">Step: <span className="text-[#58a6ff]">214 / 800</span></span>
                   <span className="text-[#8b949e]">Loss: <span className="text-[#ff7b72]">0.842</span></span>
                </div>
             </div>

             <div className="flex-1 p-6 relative flex flex-col">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800')] bg-cover mix-blend-screen filter grayscale"></div>
                
                {/* Loss Curve Graph Chart Mockup */}
                <div className="flex-1 border-b border-l border-[#30363d] relative mb-6 ml-6 flex items-end ml-[1px]">
                   <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <path d="M0,25% L100%,25% M0,50% L100%,50% M0,75% L100%,75%" stroke="#30363d" strokeWidth="1" strokeDasharray="4" fill="none"/>
                      {/* Loss Line Curve */}
                      <path d="M 0,20 Q 10,80 30,70 T 60,85 T 80,90 T 100,92" fill="none" stroke="#ff7b72" strokeWidth="3" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_8px_rgba(255,123,114,0.6)]"/>
                      {/* Validation Loss Line Curve */}
                      <path d="M 0,10 Q 15,60 30,65 T 70,80 T 100,85" fill="none" stroke="#58a6ff" strokeWidth="2" strokeDasharray="4" vectorEffect="non-scaling-stroke"/>
                   </svg>
                   <div className="absolute -left-8 top-0 text-[9px] text-[#8b949e] font-mono">2.5</div>
                   <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[9px] text-[#8b949e] font-mono">1.0</div>
                   <div className="absolute -left-8 bottom-0 text-[9px] text-[#8b949e] font-mono">0.0</div>
                   
                   <div className="absolute left-[30%] -bottom-6 text-[9px] text-[#8b949e] font-mono">200</div>
                   <div className="absolute left-[60%] -bottom-6 text-[9px] text-[#8b949e] font-mono">400</div>
                   <div className="absolute right-0 -bottom-6 text-[9px] text-[#8b949e] font-mono">Steps</div>

                   {/* Legend */}
                   <div className="absolute top-2 right-2 bg-[#161b22]/80 border border-[#30363d] p-2 rounded backdrop-blur">
                      <div className="flex items-center gap-2 text-[10px] text-white"><div className="w-3 h-[2px] bg-[#ff7b72]"></div> Train Loss</div>
                      <div className="flex items-center gap-2 text-[10px] text-white mt-1"><div className="w-3 h-[2px] bg-[#58a6ff] border-t border-dashed border-[#58a6ff]"></div> Eval Loss</div>
                   </div>
                </div>

                {/* Training Console Logs */}
                <div className="h-[120px] bg-[#0a0a0a] border border-[#30363d] rounded-lg p-3 font-mono text-[9px] overflow-y-auto space-y-1 relative z-10 shadow-lg">
                   <div className="text-[#8b949e]">[Trainer] Loading model weights... Qwen2.5-Coder-7B (4-bit)</div>
                   <div className="text-[#8b949e]">[Trainer] Injecting LoRA adapters (r=64, alpha=128)... Trainable params: 1.2M</div>
                   <div className="text-[#e3b341]">[Warning] Gradient Checkpointing is ON. Memory usage reduced, but training time +20%.</div>
                   <div className="text-[#c9d1d9]">[Step 100/800] loss: 1.4502, learning_rate: 0.00018</div>
                   <div className="text-[#c9d1d9]">[Step 200/800] loss: 0.9210, learning_rate: 0.00015</div>
                   <div className="text-[#3fb950]">[Eval] Validating against holdout set... eval_loss: 0.892</div>
                   <div className="text-white animate-pulse">Running step 215...</div>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}
