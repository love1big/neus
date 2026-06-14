import React, { useState } from 'react';
import { 
  Bot, Brain, Cpu, MessageSquare, Image, Layers, Code, Play, Combine, Zap, Shield, Sparkles, Activity
} from 'lucide-react';

export default function OmniAIAssistantStudio() {
  const [activeTab, setActiveTab] = useState('Chat'); // Chat, Sentinel, NLP, Assets, Agents
  const [isInferencing, setIsInferencing] = useState(false);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0E0E10] text-[#ccc] font-sans text-xs overflow-hidden select-none">
      
      {/* ELITE TOP NAVBAR */}
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1.5 rounded border border-[#333] shadow-inner items-center gap-2">
                   <Brain size={18} className="text-[#bc8cff] animate-pulse"/>
                   <span className="text-white font-black tracking-widest text-[12px] uppercase" style={{textShadow: '0 0 10px rgba(188,140,255,0.5)'}}>Omni AI & LLM Engine Core</span>
                </div>
                <div className="h-6 w-px bg-[#333]"></div>
                <div className="flex text-[10px] font-mono gap-5 text-[#8b949e]">
                   <span className="flex items-center gap-1"><Cpu size={12} className="text-[#3fb950]"/> VRAM: 14.2/24GB</span>
                   <span className="flex items-center gap-1"><Activity size={12} className="text-[#58a6ff]"/> T/s: 184</span>
                </div>
            </div>
            
            <div className="flex bg-[#000] border border-[#333] rounded overflow-hidden shadow-inner font-bold text-[10px]">
               <button onClick={() => setIsInferencing(!isInferencing)} className={`px-5 py-1 transition flex items-center justify-center min-w-[90px] ${isInferencing ? 'bg-[#bc8cff] text-[#000] hover:brightness-110' : 'bg-[#1a1a1a] text-[#bc8cff] hover:bg-[#222]'}`}>
                  {isInferencing ? <Zap size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>} <span className="ml-1 tracking-wider uppercase text-[9px]">{isInferencing ? 'Inferencing' : 'Start Engine'}</span>
               </button>
            </div>
         </div>

         <div className="flex px-2 bg-[#0a0a0a] border-t border-[#222]">
            <ModuleTab active={activeTab === 'Chat'} onClick={() => setActiveTab('Chat')} icon={<MessageSquare size={12}/>} label="1. Local LLM Chat" color="text-[#bc8cff]"/>
            <ModuleTab active={activeTab === 'Agents'} onClick={() => setActiveTab('Agents')} icon={<Bot size={12}/>} label="2. Sentient AI Agents" color="text-[#f85149]"/>
            <ModuleTab active={activeTab === 'Assets'} onClick={() => setActiveTab('Assets')} icon={<Image size={12}/>} label="3. GenAI Asset Creator" color="text-[#58a6ff]"/>
            <ModuleTab active={activeTab === 'Code'} onClick={() => setActiveTab('Code')} icon={<Code size={12}/>} label="4. Blueprint Copilot" color="text-[#3fb950]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
         
         {/* MAIN VIEWPORT */}
         <div className="flex-1 bg-[#111] relative flex flex-col">
             
             {activeTab === 'Chat' && (
                <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 relative">
                   <div className="flex-1 overflow-y-auto mb-4 bg-[#0a0a0a] border border-[#333] rounded-lg p-4 space-y-4 shadow-inner">
                      <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-[#111] border border-[#333] flex items-center justify-center shrink-0"><Bot size={14} className="text-[#888]"/></div>
                         <div className="bg-[#1a1a1a] border border-[#222] p-3 rounded-2xl rounded-tl-sm text-[#ccc] flex-1">
                            Greetings, Developer. Multimodal LLM is loaded (Mistral-7B-Instruct / LLaVA). How can I assist with your engine architecture today?
                         </div>
                      </div>
                      <div className="flex gap-3 flex-row-reverse">
                         <div className="w-8 h-8 rounded-full bg-[#bc8cff]/20 border border-[#bc8cff] flex items-center justify-center shrink-0"><Sparkles size={14} className="text-[#bc8cff]"/></div>
                         <div className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 p-3 rounded-2xl rounded-tr-sm text-white max-w-[80%]">
                            Write a C++ script for a character controller that supports double jumping and dashing.
                         </div>
                      </div>
                      <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-[#111] border border-[#bc8cff] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(188,140,255,0.3)]"><Bot size={14} className="text-[#bc8cff]"/></div>
                         <div className="bg-[#1a1a1a] border border-[#222] p-3 rounded-2xl rounded-tl-sm text-[#ccc] flex-1">
                            Certainly! Here is a minimal implementation using standard engine physics APIs:
                            <pre className="bg-[#050505] p-3 rounded border border-[#333] text-[#58a6ff] text-[10px] mt-2 font-mono overflow-x-auto">
                              {'void ACharacterEntity::Tick(float DeltaTime) {\n  if (bCanDash && InputDash) {\n    ApplyImpulse(DashVector * 500.0f);\n  }\n}'}
                            </pre>
                         </div>
                      </div>
                      {isInferencing && (
                        <div className="flex gap-3">
                           <div className="w-8 h-8 rounded-full bg-[#111] border border-[#bc8cff] flex items-center justify-center shrink-0 animate-pulse"><Bot size={14} className="text-[#bc8cff]"/></div>
                           <div className="bg-[#1a1a1a] border border-[#222] p-3 rounded-2xl rounded-tl-sm text-[#ccc] w-24 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-[#888] rounded-full animate-bounce"></span>
                              <span className="w-1.5 h-1.5 bg-[#888] rounded-full animate-bounce delay-100"></span>
                              <span className="w-1.5 h-1.5 bg-[#888] rounded-full animate-bounce delay-200"></span>
                           </div>
                        </div>
                      )}
                   </div>
                   <div className="h-14 bg-[#0a0a0a] border border-[#333] rounded-full flex items-center px-4 relative shrink-0">
                      <input type="text" placeholder="Prompt the AI..." className="w-full bg-transparent outline-none text-[12px] font-mono text-white placeholder-[#555]" />
                      <button className="bg-[#bc8cff] text-[#000] p-2 rounded-full hover:brightness-110 transition"><Zap size={14} fill="currentColor"/></button>
                   </div>
                </div>
             )}

             {activeTab === 'Agents' && (
                <div className="flex-1 flex overflow-hidden">
                   <div className="flex-1 p-6 flex flex-col gap-4">
                      
                      <div className="text-[#888] font-bold text-[12px] tracking-widest uppercase border-b border-[#333] pb-2">Active Sentient AI Agents (NPC Controllers)</div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-[#111] border border-[#333] rounded overflow-hidden flex flex-col">
                            <div className="bg-[#f85149]/10 border-b border-[#f85149]/20 p-2 text-[#f85149] font-bold uppercase tracking-wider text-[10px] flex items-center gap-2">
                               <Bot size={12}/> Agent_Bandit_Captain <span className="ml-auto bg-[#f85149] text-black px-1 rounded text-[8px]">HOSTILE</span>
                            </div>
                            <div className="p-3 text-[10px] space-y-2 font-mono">
                               <div className="flex justify-between"><span className="text-[#888]">Current Goal:</span> <span className="text-[#fff]">Defend Camp</span></div>
                               <div className="flex justify-between"><span className="text-[#888]">Memory State:</span> <span className="text-[#58a6ff]">Suspicious (Heard Noise)</span></div>
                               <div className="flex justify-between"><span className="text-[#888]">Last Action:</span> <span className="text-[#e3b341]">MoveTo(Cover_Point_B)</span></div>
                            </div>
                            <div className="mt-auto border-t border-[#333] bg-[#0a0a0a] p-2">
                               <div className="text-[9px] text-[#555] uppercase font-bold mb-1">Reasoning Log:</div>
                               <div className="text-[#ccc] text-[9px] italic">"I heard a branch snap. I should grab my weapon and check the perimeter instead of sleeping."</div>
                            </div>
                         </div>
                         
                         <div className="bg-[#111] border border-[#333] rounded overflow-hidden flex flex-col">
                            <div className="bg-[#3fb950]/10 border-b border-[#3fb950]/20 p-2 text-[#3fb950] font-bold uppercase tracking-wider text-[10px] flex items-center gap-2">
                               <Bot size={12}/> Agent_Village_Merchant <span className="ml-auto bg-[#3fb950] text-black px-1 rounded text-[8px]">NEUTRAL</span>
                            </div>
                            <div className="p-3 text-[10px] space-y-2 font-mono">
                               <div className="flex justify-between"><span className="text-[#888]">Current Goal:</span> <span className="text-[#fff]">Tend Shop</span></div>
                               <div className="flex justify-between"><span className="text-[#888]">Memory State:</span> <span className="text-[#58a6ff]">Relaxed | Bored</span></div>
                               <div className="flex justify-between"><span className="text-[#888]">Last Action:</span> <span className="text-[#e3b341]">Anim(SweepFloor)</span></div>
                            </div>
                            <div className="mt-auto border-t border-[#333] bg-[#0a0a0a] p-2">
                               <div className="text-[9px] text-[#555] uppercase font-bold mb-1">Reasoning Log:</div>
                               <div className="text-[#ccc] text-[9px] italic">"No customers today. I'll just sweep the floor until the sun goes down."</div>
                            </div>
                         </div>
                      </div>

                   </div>
                </div>
             )}

             {activeTab === 'Assets' && (
                <div className="flex-1 flex overflow-hidden">
                   <div className="w-[300px] border-r border-[#222] bg-[#111] p-4 flex flex-col hide-scrollbar overflow-y-auto">
                      <h3 className="text-[#888] font-bold text-[10px] tracking-widest uppercase mb-4">Prompt Configuration</h3>
                      <textarea className="w-full h-32 bg-[#0a0a0a] border border-[#333] rounded p-2 text-[10px] font-mono text-white outline-none resize-none mb-4" placeholder="Enter image synthesis prompt... (e.g. 'A rusted medieval sword with glowing green runes on the blade, dark fantasy style, isolated on black background')"></textarea>
                      
                      <SliderRow label="CFG Scale" value="7.5" color="bg-[#58a6ff]"/>
                      <SliderRow label="Steps" value="30" color="bg-[#bc8cff]"/>
                      
                      <div className="mt-4 flex flex-col gap-2">
                         <button className="w-full bg-[#bc8cff] text-black py-2 rounded text-[10px] font-bold uppercase hover:brightness-110 transition flex items-center justify-center gap-2"><Sparkles size={12}/> Generate Texture / Icon</button>
                         <button className="w-full border border-[#333] text-[#ccc] py-2 rounded text-[10px] font-bold uppercase hover:bg-[#1a1a1a] transition flex items-center justify-center gap-2"><Combine size={12}/> Generate 3D Model (Mesh)</button>
                      </div>
                   </div>
                   <div className="flex-1 p-6 relative flex items-center justify-center bg-[#050505]">
                      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #222 1px, transparent 1px)', backgroundSize: '15px 15px', opacity: 0.5 }}></div>
                      
                      <div className="relative z-10 w-96 h-96 border-2 border-dashed border-[#555] rounded-xl flex items-center justify-center flex-col bg-[#111] hover:border-[#bc8cff] transition">
                         {isInferencing ? (
                            <>
                               <div className="w-16 h-16 border-4 border-[#333] border-t-[#bc8cff] rounded-full animate-spin mb-4"></div>
                               <span className="text-[#888] font-mono uppercase tracking-wider text-[10px]">Processing Prompt (Step 12/30)...</span>
                            </>
                         ) : (
                            <>
                               <Image size={48} className="text-[#333] mb-4"/>
                               <span className="text-[#555] font-mono uppercase tracking-wider text-[10px]">Viewport Result</span>
                            </>
                         )}
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'Code' && (
                <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
                   <div className="bg-[#111] border border-[#333] rounded p-8 flex flex-col items-center max-w-md text-center shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3fb950] to-transparent opacity-50"></div>
                      <Code size={48} className="text-[#3fb950] mb-4"/>
                      <h2 className="text-[#ccc] text-lg font-black tracking-widest uppercase mb-2">Automated Blueprint Copilot</h2>
                      <p className="text-[#888] text-[10px] leading-relaxed mb-6">Let the AI generate complete Node Graphs and State Machines via natural language prompt. Example: "Create a stealth mechanic where enemies have view cones and suspicion meters."</p>
                      
                      <div className="w-full relative">
                         <input type="text" placeholder="Describe logic..." className="w-full bg-[#050505] border border-[#333] px-3 py-2 pr-10 rounded text-[10px] font-mono text-white outline-none" />
                         <Sparkles size={14} className="absolute right-3 top-2.5 text-[#3fb950] cursor-pointer"/>
                      </div>
                   </div>
                </div>
             )}

         </div>

      </div>
    </div>
  );
}

// ------ STYLED COMPONENT HELPERS ------ //

function ModuleTab({ active, onClick, icon, label, color }) {
   return (
      <div 
         onClick={onClick}
         className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer border-t-[2px] transition-colors
         ${active ? `bg-[#111] text-white ${color.replace('text-', 'border-')}` : 'border-transparent text-[#888] hover:bg-[#1a1a1a] hover:text-[#ccc]'}`}
      >
         <span className={active ? color : 'opacity-70'}>{icon}</span> {label}
      </div>
   );
}

function SliderRow({ label, value, color }) {
   return (
      <div className="flex flex-col gap-1 mb-3">
         <div className="flex justify-between items-end">
            <span className="text-[#888] text-[9px] uppercase">{label}</span>
            <span className="text-white text-[10px] font-mono">{value}</span>
         </div>
         <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden border border-[#333]">
            <div className={`h-full ${color} w-[60%]`}></div>
         </div>
      </div>
   );
}
