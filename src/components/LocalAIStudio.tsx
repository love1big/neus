import React, { useState } from 'react';
import { Download, Cpu, HardDrive, Play, Pause, Trash2, Box, Shield, Zap, Search, Layers, Settings, ChevronRight, Brain } from 'lucide-react';

export default function LocalAIStudio() {
  const [downloading, setDownloading] = useState<string | null>('Llama-3-8B-Instruct-Q4');
  const [progress, setProgress] = useState(68);

  const localModels = [
    { id: 'Llama-3-8B-Instruct-Q4', name: 'Llama 3 (8B) Instruct GGUF Q4_K_M', size: '4.9 GB', status: downloading === 'Llama-3-8B-Instruct-Q4' ? 'downloading' : 'installed', type: 'LLM (Causal LM)' },
    { id: 'Mistral-7B-v0.2', name: 'Mistral-7B-v0.2-Instruct-Q5_K_M', size: '5.1 GB', status: 'installed', type: 'LLM (Causal LM)' },
    { id: 'SDXL-Turbo', name: 'Stable Diffusion XL Turbo (safetensors)', size: '6.9 GB', status: 'available', type: 'Vision Gen (Diffusion)' },
    { id: 'LLaVA-1.5-7b', name: 'LLaVA-1.5 Multimodal 7B Q4', size: '4.5 GB', status: 'available', type: 'Multimodal Vision' },
    { id: 'nomic-embed', name: 'Nomic Embed Text v1.5', size: '0.8 GB', status: 'installed', type: 'Embedding / RAG' },
  ];

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-6 overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
            <Cpu size={28} className="text-[#bc8cff]"/> Local AI Models Manager
          </h1>
          <p className="text-[#8b949e] max-w-xl text-sm">Download, quantize, and orchestrate open-weights offline models for Omni Engine.</p>
        </div>
        <div className="flex gap-3 h-10">
          <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]"/>
             <input type="text" placeholder="Search models (HuggingFace)..." className="h-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-9 pr-4 text-sm text-white placeholder-[#8b949e] outline-none focus:border-[#58a6ff] transition-colors w-64"/>
          </div>
          <button className="px-5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/10 text-[#bc8cff] font-bold rounded-lg border border-[#bc8cff]/50 hover:bg-[#bc8cff]/30 transition shadow-[0_0_15px_rgba(188,140,255,0.2)] tracking-wide flex items-center gap-2 text-sm">
             <Zap size={16}/> Connect Hardware
          </button>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-4 gap-6 min-h-0">
        
        {/* Left Side: Installed & Available List */}
        <div className="col-span-3 bg-[#111116] border border-[#2d2d2d] rounded-xl flex flex-col overflow-hidden shadow-lg">
           <div className="bg-[#1c1c24] border-b border-[#2d2d2d] p-4 flex justify-between items-center shrink-0">
               <h3 className="font-bold text-white tracking-wider flex items-center gap-2 text-sm"><Layers size={16} className="text-[#58a6ff]"/> Model Repository</h3>
               <div className="flex gap-2">
                 <button className="text-[11px] bg-[#0d0d11] px-3 py-1 rounded border border-[#333] hover:text-white">All Architecture</button>
                 <button className="text-[11px] bg-[#0d0d11] px-3 py-1 rounded border border-[#333] hover:text-white text-[#58a6ff] border-[#58a6ff]/50">LLMs</button>
                 <button className="text-[11px] bg-[#0d0d11] px-3 py-1 rounded border border-[#333] hover:text-white">Vision</button>
               </div>
           </div>
           
           <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
               {localModels.map(model => (
                 <div key={model.id} className="bg-[#0a0a0c] border border-[#2d2d2d] p-4 rounded-lg flex items-center justify-between hover:border-[#444] transition-colors group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-lg bg-[#1c1c24] border border-[#333] flex items-center justify-center text-[#888] shadow-inner">
                          {model.type.includes('Vision') ? <Box size={24}/> : <Brain size={24}/>}
                       </div>
                       <div>
                          <h4 className="font-bold text-white text-sm group-hover:text-[#58a6ff] transition-colors flex items-center gap-2">{model.name} {model.status === 'installed' && <Shield size={12} className="text-[#3fb950]"/>}</h4>
                          <div className="flex items-center gap-3 text-[11px] text-[#8b949e] mt-1 font-mono">
                             <span>{model.type}</span>
                             <span>•</span>
                             <span><HardDrive size={10} className="inline mr-1"/>{model.size}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                       {model.status === 'downloading' && (
                         <div className="flex flex-col items-end gap-1 min-w-[200px]">
                            <div className="flex justify-between w-full text-[10px] text-[#58a6ff] font-mono">
                               <span>Downloading... 14MB/s</span>
                               <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-[#111] h-1.5 rounded-full overflow-hidden border border-[#333]">
                               <div className="h-full bg-[#58a6ff] shadow-[0_0_10px_#58a6ff]" style={{ width: `${progress}%` }}></div>
                            </div>
                         </div>
                       )}
                       
                       <div className="flex gap-2">
                           {model.status === 'available' && (
                              <button className="px-4 py-1.5 bg-[#21262d] text-[#c9d1d9] font-bold rounded text-xs hover:bg-[#30363d] transition flex items-center justify-center border border-[#30363d]">
                                <Download size={14} className="mr-1"/> Download
                              </button>
                           )}
                           {model.status === 'downloading' && (
                              <button className="w-8 h-8 bg-[#21262d] text-[#f85149] rounded hover:bg-[#30363d] transition flex items-center justify-center border border-[#30363d]">
                                <Pause size={14}/>
                              </button>
                           )}
                           {model.status === 'installed' && (
                              <>
                                <button className="px-4 py-1.5 bg-gradient-to-r from-[#3fb950] to-[#2ea043] text-white font-bold rounded text-xs hover:brightness-110 transition flex items-center justify-center shadow-[0_0_10px_rgba(63,185,80,0.3)]">
                                  <Play size={14} className="mr-1" fill="currentColor"/> Load Model
                                </button>
                                <button className="w-8 h-8 bg-[#21262d] text-[#8b949e] rounded hover:bg-[#30363d] hover:text-[#f85149] transition flex items-center justify-center border border-[#30363d]">
                                  <Trash2 size={14}/>
                                </button>
                              </>
                           )}
                       </div>
                    </div>
                 </div>
               ))}
           </div>
        </div>

        {/* Right Side: Storage & Active Runtime */}
        <div className="col-span-1 flex flex-col gap-6">
           <div className="bg-[#111116] border border-[#2d2d2d] rounded-xl p-5 shadow-lg">
               <h3 className="text-[#e6edf3] font-bold border-b border-[#2d2d2d] pb-2 mb-4 flex items-center gap-2 text-sm"><HardDrive size={16} className="text-[#e3b341]"/> Storage Manager</h3>
               
               <div className="space-y-2 mb-4">
                   <div className="flex justify-between text-[11px] text-[#8b949e]"><span>Local Storage E:</span><span className="font-mono">1.2 TB Free</span></div>
                   <div className="w-full h-3 bg-[#0a0a0c] border border-[#333] rounded-full overflow-hidden flex">
                      <div className="h-full bg-[#f85149]" style={{ width: '45%' }} title="OS & Apps"></div>
                      <div className="h-full bg-[#bc8cff]" style={{ width: '15%' }} title="AI Models"></div>
                      <div className="h-full bg-[#58a6ff]" style={{ width: '10%' }} title="Cached Assets"></div>
                   </div>
                   <div className="flex text-[9px] uppercase tracking-wider text-[#8b949e] justify-between pt-1">
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-[#bc8cff]"></div> AI Models: 145 GB</span>
                      <span className="text-white hover:underline cursor-pointer">Manage Data <ChevronRight size={10} className="inline"/></span>
                   </div>
               </div>
               
               <div className="mt-6 pt-4 border-t border-[#2d2d2d]">
                  <h4 className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-2">HuggingFace Integration</h4>
                  <button className="w-full bg-[#0a0a0c] border border-[#333] hover:border-[#e3b341]/50 text-[#ccc] py-2 rounded text-xs transition flex items-center justify-center gap-2">
                     <Settings size={14}/> Connect HF API Token (Offline Sync)
                  </button>
               </div>
           </div>

           <div className="bg-[#111116] border border-[#2d2d2d] rounded-xl p-5 shadow-lg flex-1 flex flex-col">
               <h3 className="text-[#e6edf3] font-bold border-b border-[#2d2d2d] pb-2 mb-4 flex items-center gap-2 text-sm"><Cpu size={16} className="text-[#3fb950]"/> Active Runtime</h3>
               <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                  <div className="w-16 h-16 rounded-full bg-[#0a0a0c] border border-[#333] flex items-center justify-center mb-3">
                     <Play size={24} className="text-[#333]"/>
                  </div>
                  <span className="text-[#888] text-sm font-bold">No High-VRAM Models Loaded</span>
                  <span className="text-[#666] text-xs mt-1">Load an AI model from the repository into GPU memory to begin using OmniAIAssistant.</span>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
}
