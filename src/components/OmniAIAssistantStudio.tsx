import React, { useState } from 'react';
import { 
  Bot, Brain, Cpu, MessageSquare, Image, Layers, Code, Play, Combine, Zap, Shield, Sparkles, Activity, FileText, Settings, Key, UploadCloud, Database, Server, Cpu as CpuIcon, Maximize, PlayCircle, BarChart2} from 'lucide-react';

export default function OmniAIAssistantStudio() {
  const [activeTab, setActiveTab] = useState('Chat'); // Chat, RAG, Assets, Agents, Vision
  const [isInferencing, setIsInferencing] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Llama-3-8B-Instruct-Q4_K_M');

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0a0c] text-[#ccc] font-sans text-xs overflow-hidden select-none">
      
      {/* ELITE TOP NAVBAR */}
      <div className="h-16 border-b border-[#2d2d2d] bg-[#111114] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1.5 rounded border border-[#333] shadow-inner items-center gap-2">
                   <Brain size={18} className="text-[#bc8cff] animate-pulse"/>
                   <span className="text-white font-black tracking-widest text-[12px] uppercase" style={{textShadow: '0 0 10px rgba(188,140,255,0.5)'}}>Omni Offline AI EngineCore</span>
                </div>
                <div className="h-6 w-px bg-[#333]"></div>
                <div className="flex text-[10px] font-mono gap-5 text-[#8b949e]">
                   <span className="flex items-center gap-1"><Cpu size={12} className="text-[#3fb950]"/> VRAM: 8.4/24GB</span>
                   <span className="flex items-center gap-1"><Activity size={12} className="text-[#58a6ff]"/> T/s: 84.2</span>
                   <span className="flex items-center gap-1"><Server size={12} className="text-[#e3b341]"/> Context: 4096/8192</span>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-[#1a1a1a] text-[#c9d1d9] border border-[#333] rounded px-2 py-1 outline-none font-mono text-[10px]"
                >
                   <option value="Llama-3-8B-Instruct-Q4_K_M">Llama-3-8B-Instruct (GGUF)</option>
                   <option value="Mistral-7B-v0.2-Q5_K_M">Mistral-7B-Nemo (GGUF)</option>
                   <option value="Phi-3-Mini-4k-Instruct-q4">Phi-3-Mini-4k (GGUF)</option>
                   <option value="SDXL-Turbo-fp16">SDXL-Turbo-fp16 (Diffusion)</option>
                   <option value="LLaVA-1.5-7b-Q4_K">LLaVA-1.5-7b (Vision)</option>
                </select>
                <div className="flex bg-[#000] border border-[#333] rounded overflow-hidden shadow-inner font-bold text-[10px]">
                   <button onClick={() => setIsInferencing(!isInferencing)} className={`px-5 py-1.5 transition flex items-center justify-center min-w-[120px] ${isInferencing ? 'bg-[#bc8cff] text-[#000] shadow-[0_0_15px_rgba(188,140,255,0.5)]' : 'bg-[#1a1a1a] text-[#bc8cff] hover:bg-[#222]'}`}>
                      {isInferencing ? <Zap size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>} <span className="ml-1 tracking-wider uppercase text-[10px]">{isInferencing ? 'Engine Active' : 'Start Engine'}</span>
                   </button>
                </div>
            </div>
         </div>

         <div className="flex px-2 bg-[#050505] border-t border-[#222]">
            <ModuleTab active={activeTab === 'Chat'} onClick={() => setActiveTab('Chat')} icon={<MessageSquare size={12}/>} label="1. Local LLM / Code Copilot" color="text-[#bc8cff]"/>
            <ModuleTab active={activeTab === 'Agents'} onClick={() => setActiveTab('Agents')} icon={<Bot size={12}/>} label="2. Sentient AI Agents" color="text-[#f85149]"/>
            <ModuleTab active={activeTab === 'Assets'} onClick={() => setActiveTab('Assets')} icon={<Image size={12}/>} label="3. GenAI 2D/3D Asset Creator" color="text-[#58a6ff]"/>
            <ModuleTab active={activeTab === 'RAG'} onClick={() => setActiveTab('RAG')} icon={<Database size={12}/>} label="4. Vector DB & Lore RAG" color="text-[#e3b341]"/>
            <ModuleTab active={activeTab === 'Vision'} onClick={() => setActiveTab('Vision')} icon={<Sparkles size={12}/>} label="5. LLaVA Vision Analyzer" color="text-[#3fb950]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
         
         {/* SIDEBAR */}
         <div className="w-[280px] bg-[#0d0d11] border-r border-[#2d2d2d] flex flex-col p-4 overflow-y-auto custom-scrollbar">
            <h2 className="text-[10px] uppercase tracking-widest text-[#888] font-bold mb-4 flex items-center gap-2"><Settings size={14}/> Engine Parameters</h2>
            
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-[#ccc] text-[11px] mb-1"><span>System Prompt</span><span className="text-[#58a6ff]">Global</span></div>
                  <textarea 
                    className="w-full h-24 bg-[#14141a] border border-[#333] rounded p-2 text-[11px] outline-none resize-none font-mono text-[#8b949e]" 
                    defaultValue={"You are an expert game developer assistant running offline inside OmniEngine. Answer concisely and output clean C++/TS code."}
                  />
               </div>

               <Slider label="Temperature" value="0.75" />
               <Slider label="Top P" value="0.95" />
               <Slider label="Top K" value="40" />
               <Slider label="Repetition Penalty" value="1.15" />
               <Slider label="Context Size (Threads)" value="8" />
               
               <div className="pt-4 border-t border-[#2d2d2d]">
                  <h3 className="text-[#888] text-[10px] font-bold uppercase tracking-wider mb-2">GPU Acceleration</h3>
                  <div className="bg-[#14141a] border border-[#3fb950]/50 rounded p-2 flex items-center justify-between text-[11px] font-mono">
                     <span className="text-[#3fb950]">CUDA / CuBLAS</span>
                     <span className="bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded">ENABLED</span>
                  </div>
                  <div className="bg-[#14141a] border border-[#333] rounded p-2 flex items-center justify-between text-[11px] font-mono mt-2">
                     <span className="text-[#888]">Ollama Endpoint</span>
                     <span className="bg-[#333] text-[#888] px-2 py-0.5 rounded">http://127.0.0.1:11434</span>
                  </div>
               </div>
            </div>
         </div>

         {/* MAIN VIEWPORT */}
         <div className="flex-1 bg-[#121218] relative flex flex-col">
             
             {activeTab === 'Chat' && (
                <div className="flex-1 flex flex-col w-full mx-auto relative px-10 py-6">
                   <div className="flex-1 overflow-y-auto mb-4 border border-[#2d2d2d] rounded-xl p-6 space-y-6 bg-gradient-to-br from-[#0a0a0c] to-[#121216]">
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded bg-[#1c1c24] border border-[#333] flex items-center justify-center shrink-0 shadow-lg"><Bot size={18} className="text-[#888]"/></div>
                         <div className="bg-[#1c1c24] border border-[#333] p-4 rounded-xl rounded-tl-sm text-[#ccc] flex-1 shadow-md text-[13px] leading-relaxed">
                            Greetings, Developer. I am active offline. I have access to your local engine source code via RAG. What are we building today?
                         </div>
                      </div>
                      <div className="flex gap-4 flex-row-reverse">
                         <div className="w-10 h-10 rounded bg-[#bc8cff]/20 border border-[#bc8cff] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(188,140,255,0.2)]"><Sparkles size={18} className="text-[#bc8cff]"/></div>
                         <div className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 p-4 rounded-xl rounded-tr-sm text-white max-w-[80%] text-[13px] shadow-md leading-relaxed">
                            Write a highly optimized A* pathfinding algorithm for our grid map system in TypeScript, utilizing a priority queue.
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded bg-[#1c1c24] border border-[#bc8cff] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(188,140,255,0.4)]"><Bot size={18} className="text-[#bc8cff]"/></div>
                         <div className="bg-[#1c1c24] border border-[#2d2d2d] p-4 rounded-xl rounded-tl-sm text-[#ccc] flex-1 shadow-md text-[13px] leading-relaxed">
                            Here is an extremely fast A* implementation using a custom binary heap priority queue.
                            <pre className="bg-[#050505] p-4 rounded-lg border border-[#333] text-[#58a6ff] text-[11px] mt-3 font-mono overflow-x-auto shadow-inner">
                              {`class PriorityQueue<T> {
  private data: { priority: number; item: T }[] = [];
  push(item: T, priority: number) { this.data.push({ item, priority }); this.data.sort((a,b) => a.priority - b.priority); }
  pop(): T | undefined { return this.data.shift()?.item; }
  isEmpty() { return this.data.length === 0; }
}

export function findPathAStar(start: Node, goal: Node, grid: Grid): Node[] {
  const openSet = new PriorityQueue<Node>();
  // ... (Full implementation streaming)
}`}
                            </pre>
                         </div>
                      </div>
                      {isInferencing && (
                        <div className="flex gap-4">
                           <div className="w-10 h-10 rounded bg-[#1c1c24] border border-[#bc8cff] flex items-center justify-center shrink-0 animate-pulse"><Bot size={18} className="text-[#bc8cff]"/></div>
                           <div className="bg-[#1c1c24] border border-[#2d2d2d] p-4 rounded-xl rounded-tl-sm text-[#ccc] w-24 flex items-center gap-2 shadow-md">
                              <span className="w-2 h-2 bg-[#888] rounded-full animate-bounce"></span>
                              <span className="w-2 h-2 bg-[#888] rounded-full animate-bounce delay-100"></span>
                              <span className="w-2 h-2 bg-[#888] rounded-full animate-bounce delay-200"></span>
                           </div>
                        </div>
                      )}
                   </div>
                   <div className="h-16 bg-[#1a1a24] border border-[#333] rounded-xl flex items-center px-4 relative shrink-0 shadow-lg">
                      <div className="flex gap-2 mr-3 border-r border-[#333] pr-3">
                         <button className="text-[#888] hover:text-white transition"><UploadCloud size={18}/></button>
                         <button className="text-[#888] hover:text-[#58a6ff] transition"><Database size={18}/></button>
                      </div>
                      <input type="text" placeholder="Type prompt here... (Local LLM Active. Code context: Enabled)" className="w-full bg-transparent outline-none text-[13px] font-sans text-white placeholder-[#666]" />
                      <button className="bg-[#bc8cff] text-[#000] w-10 h-10 rounded-lg shrink-0 flex items-center justify-center hover:brightness-110 transition shadow-[0_0_20px_rgba(188,140,255,0.4)]"><Zap size={18} fill="currentColor"/></button>
                   </div>
                </div>
             )}

             {activeTab === 'RAG' && (
                <div className="flex-1 p-8 overflow-y-auto">
                   <div className="flex justify-between items-end border-b border-[#2d2d2d] pb-4 mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1">Local Knowledge Base & Lore RAG</h2>
                        <p className="text-[#888] text-[11px]">Manage local documents and game lore that the offline AI can cite using Vector Embeddings.</p>
                      </div>
                      <button className="bg-gradient-to-r from-blue-600 to-[#58a6ff] text-white px-4 py-2 rounded font-bold shadow-[0_0_15px_rgba(88,166,255,0.4)] hover:brightness-110">
                        + Unify New Lore Directory
                      </button>
                   </div>

                   <div className="grid grid-cols-3 gap-6">
                      <div className="bg-[#14141a] border border-[#2d2d2d] rounded-lg p-5">
                         <h3 className="font-bold text-[#e3b341] mb-2 text-sm flex items-center gap-2"><Database size={16}/> Vector Database Stats</h3>
                         <div className="space-y-3 mt-4 text-[11px]">
                            <div className="flex justify-between"><span className="text-[#888]">Engine</span> <span className="font-mono text-white">ChromaDB / SQLite VSS</span></div>
                            <div className="flex justify-between"><span className="text-[#888]">Embedding Model</span> <span className="font-mono text-[#58a6ff]">nomic-embed-text</span></div>
                            <div className="flex justify-between"><span className="text-[#888]">Total Documents</span> <span className="font-mono text-white">1,421 files</span></div>
                            <div className="flex justify-between"><span className="text-[#888]">Vector Count</span> <span className="font-mono text-[#bc8cff]">14,204 chunks</span></div>
                         </div>
                      </div>
                      
                      <div className="col-span-2 bg-[#14141a] border border-[#2d2d2d] rounded-lg p-5">
                         <h3 className="font-bold text-white mb-4 text-sm">Indexed Collections (Context)</h3>
                         <div className="overflow-hidden border border-[#333] rounded-lg">
                           <table className="w-full text-left text-[11px]">
                             <thead className="bg-[#1c1c24] border-b border-[#333]">
                               <tr>
                                  <th className="p-3 text-[#888]">Collection Name</th>
                                  <th className="p-3 text-[#888]">Type</th>
                                  <th className="p-3 text-[#888]">Status</th>
                                  <th className="p-3 text-[#888]">Tokens</th>
                               </tr>
                             </thead>
                             <tbody>
                               <tr className="border-b border-[#2d2d2d] hover:bg-[#1c1c24]/50 cursor-pointer">
                                  <td className="p-3 font-semibold text-[#58a6ff]">Engine_Source_Code_v1</td>
                                  <td className="p-3"><span className="bg-[#21262d] px-2 py-1 rounded text-[#ccc] border border-[#30363d]">C++ / TS</span></td>
                                  <td className="p-3 text-[#3fb950] flex items-center gap-1"><div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full"></div> Synchronized</td>
                                  <td className="p-3 font-mono">1.2M</td>
                               </tr>
                               <tr className="border-b border-[#2d2d2d] hover:bg-[#1c1c24]/50 cursor-pointer">
                                  <td className="p-3 font-semibold text-[#e3b341]">World_Bible_Lore_Master</td>
                                  <td className="p-3"><span className="bg-[#21262d] px-2 py-1 rounded text-[#ccc] border border-[#30363d]">Markdown</span></td>
                                  <td className="p-3 text-[#3fb950] flex items-center gap-1"><div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full"></div> Synchronized</td>
                                  <td className="p-3 font-mono">345K</td>
                               </tr>
                               <tr className="hover:bg-[#1c1c24]/50 cursor-pointer">
                                  <td className="p-3 font-semibold text-[#bc8cff]">API_Docs_Unreal_Godot</td>
                                  <td className="p-3"><span className="bg-[#21262d] px-2 py-1 rounded text-[#ccc] border border-[#30363d]">HTML / PDF</span></td>
                                  <td className="p-3 text-[#f85149] flex items-center gap-1"><Activity size={10}/> Vectorizing (42%)</td>
                                  <td className="p-3 font-mono">800K</td>
                               </tr>
                             </tbody>
                           </table>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'Assets' && (
                <div className="flex-1 flex items-center justify-center p-8">
                   <div className="text-center max-w-lg">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#bc8cff] to-[#58a6ff] rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(188,140,255,0.4)]">
                         <Sparkles size={40} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Stable Diffusion (SDXL) Integration</h2>
                      <p className="text-[#888] leading-relaxed mb-8">Generate concept art, seamless textures, UI elements, and sprite sheets completely offline using direct GPU access and the Diffusers pipeline.</p>
                      <button className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-[0_5px_15px_rgba(255,255,255,0.2)] hover:bg-[#ccc] transition pulse-animation">
                         Initialize Local GPU Pipeline
                      </button>
                   </div>
                </div>
             )}

             {/* Placeholder blocks for other tabs... */}
             {activeTab === 'Agents' && <div className="flex-1 flex items-center justify-center text-[#555] font-mono text-lg">Initializing Multi-Agent Sentinel Swarm...</div>}
             {activeTab === 'Vision' && <div className="flex-1 flex items-center justify-center text-[#555] font-mono text-lg">Booting LLaVA-1.5 Multimodal Vision Engine...</div>}

         </div>
      </div>
    </div>
  );
}

function ModuleTab({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }) {
   return (
      <div 
         onClick={onClick}
         className={`px-5 py-3 text-[11px] font-bold tracking-widest flex items-center gap-2 cursor-pointer border-b-[2px] transition-alls
         ${active ? `bg-[#1a1a24] text-white ${color.replace('text-', 'border-')}` : 'border-transparent text-[#888] hover:bg-[#111] hover:text-[#ccc]'}`}
      >
         <span className={active ? color : 'opacity-70'}>{icon}</span> {label}
      </div>
   );
}

function Slider({ label, value }: { label: string, value: string }) {
   return (
      <div className="flex flex-col gap-1.5">
         <div className="flex justify-between items-end">
            <span className="text-[#888] text-[9px] uppercase font-bold tracking-wider">{label}</span>
            <span className="text-[#58a6ff] text-[10px] font-mono">{value}</span>
         </div>
         <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden border border-[#333] cursor-pointer">
            <div className="h-full bg-[#58a6ff]" style={{ width: `${Math.random() * 40 + 30}%` }}></div>
         </div>
      </div>
   );
}

