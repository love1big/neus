import React, { useState } from 'react';
import {
  Brain, FileVideo, Users, MessageSquare, Plus, Crosshair, 
  Settings2, Activity, Play, Zap, Bot, Bone, Hexagon, Database, 
  LayoutTemplate, Video, Camera, Network, ChevronRight, Eye
} from 'lucide-react';

export default function SentientAIEditor() {
  const [activeTab, setActiveTab] = useState<'Brain' | 'Director' | 'MoCap' | 'StateGraph'>('Brain');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#c9d1d9] font-sans">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f85149]/10 to-transparent pointer-events-none"></div>
        <Brain size={28} className="text-[#f85149] mr-4 shadow-[0_0_15px_rgba(248,81,73,0.4)]" />
        <div className="flex flex-col z-10">
          <h2 className="text-white text-[16px] font-bold tracking-tight">Sentient AI & NPC Director Editor</h2>
          <p className="text-[#8b949e] text-[11px]">Vector-Memory Brains (RAG), AI Drama Tension Graph, and Local Offline MoCap Synthesis.</p>
        </div>
        <div className="ml-auto flex gap-3 h-full items-center z-10">
           <div className="bg-[#161b22] border border-[#30363d] px-3 py-1.5 rounded-lg flex flex-col items-center">
              <span className="text-[9px] uppercase font-bold text-[#8b949e]">Active RAG Datastores</span>
              <span className="text-[#58a6ff] font-mono text-[14px] font-bold">4 (1.2GB)</span>
           </div>
        </div>
      </div>

      <div className="flex bg-[#161b22] border-b border-[#30363d] h-10 px-4">
        <button onClick={() => setActiveTab('Brain')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Brain' ? 'text-[#f85149] border-b-2 border-[#f85149]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><Database size={14}/> Vector-Memory Brain</button>
        <button onClick={() => setActiveTab('Director')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Director' ? 'text-[#e3b341] border-b-2 border-[#e3b341]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><Activity size={14}/> AI Drama Director</button>
        <button onClick={() => setActiveTab('MoCap')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'MoCap' ? 'text-[#bc8cff] border-b-2 border-[#bc8cff]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><FileVideo size={14}/> Motion Synthesis</button>
        <button onClick={() => setActiveTab('StateGraph')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'StateGraph' ? 'text-[#3fb950] border-b-2 border-[#3fb950]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><Network size={14}/> State Graph</button>
      </div>

      <div className="flex-1 overflow-hidden relative">
         {activeTab === 'Brain' && <VectorMemoryBrain />}
         {activeTab === 'Director' && <AIDramaDirector />}
         {activeTab === 'MoCap' && <MotionSynthesis />}
         {activeTab === 'StateGraph' && <AIAgentStateGraph />}
      </div>
    </div>
  );
}

function VectorMemoryBrain() {
  return (
    <div className="flex h-full">
      <div className="w-[300px] border-r border-[#30363d] bg-[#0d1117] flex flex-col">
         <div className="p-3 border-b border-[#30363d] text-[11px] font-bold text-[#f85149] uppercase tracking-wider flex justify-between items-center">
            NPC Profiles <Plus size={14} className="text-[#8b949e] hover:text-white cursor-pointer"/>
         </div>
         <div className="p-2 flex flex-col gap-1 overflow-y-auto">
            <div className="bg-[#21262d] border border-[#f85149]/30 rounded p-2 flex items-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(248,81,73,0.1)]">
               <div className="w-8 h-8 bg-[#161b22] border border-[#30363d] rounded-full flex items-center justify-center text-[#f85149]"><Bot size={16}/></div>
               <div className="flex flex-col">
                  <span className="text-[#c9d1d9] text-[12px] font-bold">Blacksmith_Eldrin</span>
                  <span className="text-[#8b949e] text-[9px] uppercase">RAG: Lore_TownA.db</span>
               </div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex items-center gap-2 cursor-pointer hover:border-[#8b949e]">
               <div className="w-8 h-8 bg-[#0a0a0a] border border-[#30363d] rounded-full flex items-center justify-center text-[#8b949e]"><Bot size={16}/></div>
               <div className="flex flex-col">
                  <span className="text-[#c9d1d9] text-[12px] font-bold">King_Arthur</span>
                  <span className="text-[#8b949e] text-[9px] uppercase">RAG: Lore_Kingdom.db</span>
               </div>
            </div>
         </div>
      </div>

      <div className="flex-1 bg-[#050505] flex flex-col p-6 gap-6 overflow-y-auto">
         <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
            <h3 className="text-[#c9d1d9] text-[14px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Hexagon size={18} className="text-[#f85149]"/> OCEAN Personalization Matrix</h3>
            <p className="text-[#8b949e] text-[11px] mb-4">Instead of dialogue trees, define the psychological traits. The LLM will strictly adhere to this personality matrix.</p>
            
            <div className="grid grid-cols-2 gap-4">
               {[ {name: "Openness", val: 30}, {name: "Conscientiousness", val: 80}, {name: "Extraversion", val: 20}, {name: "Agreeableness", val: 60}, {name: "Neuroticism", val: 40} ].map(trait => (
                 <div key={trait.name} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[11px] font-bold text-[#8b949e] uppercase">
                       <span>{trait.name}</span>
                       <span className="text-white">{trait.val}%</span>
                    </div>
                    <input type="range" className="w-full h-1 bg-[#0a0a0a] appearance-none accent-[#f85149]" defaultValue={trait.val} />
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
            <h3 className="text-[#c9d1d9] text-[14px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Database size={18} className="text-[#58a6ff]"/> Vector Database (RAG) Injection</h3>
            <p className="text-[#8b949e] text-[11px] mb-4">Inject thousands of pages of world lore. The NPC will fetch relevant history in real-time when talking to the player without breaking character.</p>
            
            <div className="border-2 border-dashed border-[#58a6ff]/30 bg-[#58a6ff]/5 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#58a6ff]/60 transition-colors">
               <Database size={32} className="text-[#58a6ff] mb-2" />
               <span className="text-[#58a6ff] font-bold text-[12px] uppercase">Upload .TXT / .PDF / .JSON Lore</span>
               <span className="text-[#8b949e] text-[10px] mt-1">Automatically chunks and creates vector embeddings locally.</span>
            </div>
         </div>
      </div>
    </div>
  )
}

function AIDramaDirector() {
  return (
    <div className="flex h-full flex-col p-6 bg-[#050505]">
       <div className="flex justify-between items-start mb-6 border-b border-[#30363d] pb-4">
          <div>
             <h1 className="text-white text-[24px] font-bold tracking-tight mb-1">AI Pacing & Drama Tension Graph</h1>
             <p className="text-[#8b949e] text-[12px]">Design the emotional rollercoaster. The AI Director will spawn enemies or drop loot based on this curve.</p>
          </div>
          <button className="bg-[#e3b341] text-black px-4 py-2 rounded font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
             <Play size={14}/> Simulate Run
          </button>
       </div>

       <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg relative overflow-hidden p-6">
          {/* Tension Graph Mockup */}
          <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-[#30363d]"></div>
          <div className="absolute left-6 bottom-6 right-6 h-[2px] bg-[#30363d]"></div>
          
          <div className="absolute left-2 top-6 text-[10px] text-[#8b949e] font-bold">100 (Peak)</div>
          <div className="absolute left-2 bottom-6 text-[10px] text-[#8b949e] font-bold">0 (Calm)</div>

          <svg className="w-full h-full ml-4" preserveAspectRatio="none" viewBox="0 0 100 100">
             {/* The curve */}
             <path d="M0,90 Q10,90 20,60 T40,20 T50,80 T70,30 T90,10 T100,50" fill="none" stroke="#e3b341" strokeWidth="2" />
             {/* Gradient fill */}
             <path d="M0,90 Q10,90 20,60 T40,20 T50,80 T70,30 T90,10 T100,50 L100,100 L0,100 Z" fill="rgba(227, 179, 65, 0.1)" />
          </svg>

          {/* Annotations */}
          <div className="absolute top-[20%] left-[30%] bg-[#e3b341]/20 border border-[#e3b341] px-2 py-1 rounded text-[9px] text-[#e3b341] font-bold shadow-[0_0_10px_rgba(227,179,65,0.4)]">
             Horde Assualt (Peak Tension)
          </div>
          <div className="absolute top-[80%] left-[50%] bg-[#3fb950]/20 border border-[#3fb950] px-2 py-1 rounded text-[9px] text-[#3fb950] font-bold shadow-[0_0_10px_rgba(63,185,80,0.4)]">
             Safe Room / Loot Drops (Relief)
          </div>
       </div>

       <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-[#161b22] border border-[#30363d] p-3 rounded">
             <span className="text-[#8b949e] text-[10px] font-bold uppercase block mb-1">Max Population Cap</span>
             <span className="text-white font-mono text-[16px]">120 Units</span>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] p-3 rounded">
             <span className="text-[#8b949e] text-[10px] font-bold uppercase block mb-1">Music Dynamic Sync</span>
             <span className="text-[#58a6ff] font-mono text-[16px]">Enabled (Stems)</span>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] p-3 rounded">
             <span className="text-[#8b949e] text-[10px] font-bold uppercase block mb-1">Player Skill Tracker</span>
             <span className="text-[#f85149] font-mono text-[16px]">Aggressive Learning</span>
          </div>
       </div>
    </div>
  )
}

function MotionSynthesis() {
  return (
    <div className="flex h-full p-6 bg-[#050505] gap-6">
       <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
             <h3 className="text-[#c9d1d9] text-[14px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Camera size={18} className="text-[#bc8cff]"/> Local Video MoCap</h3>
             <p className="text-[#8b949e] text-[11px] mb-4">Drop an MP4 of yourself dancing or fighting. The offline PoseNet/MotionGPT AI will extract the skeleton and retarget to your 3D Rig automatically.</p>
             
             <div className="border-2 border-dashed border-[#bc8cff]/30 bg-[#bc8cff]/5 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#bc8cff]/60 transition-colors">
                <Video size={32} className="text-[#bc8cff] mb-2" />
                <span className="text-[#bc8cff] font-bold text-[12px] uppercase">Upload MP4 / WebM</span>
             </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col gap-2">
             <label className="text-[10px] font-bold text-[#8b949e] uppercase">Retargeting Skeleton</label>
             <select className="bg-[#0a0a0a] border border-[#30363d] text-white p-2 text-[11px] outline-none rounded">
               <option>Unreal Engine 5 Mannequin (Manny)</option>
               <option>Mixamo Standard Skeleton</option>
               <option>Custom_Humanoid_Rig.fbx</option>
             </select>
          </div>
          
          <button className="bg-[#bc8cff] text-black font-bold uppercase tracking-widest py-3 rounded text-[12px] shadow-[0_0_15px_rgba(188,140,255,0.4)] flex items-center justify-center gap-2">
             <Zap size={16}/> Extract & Bake Animation
          </button>
       </div>

       <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg relative overflow-hidden flex items-center justify-center">
          {/* 3D Viewport Mockup */}
          <div className="absolute inset-0 bg-[#000] opacity-50 z-0"></div>
          <div className="relative z-10 flex items-center gap-16">
             <div className="flex flex-col items-center">
                <div className="w-48 h-64 border-2 border-[#8b949e] border-dashed rounded flex items-center justify-center text-[#8b949e] font-bold mb-2">Input Video</div>
             </div>
             <div className="text-[#bc8cff] animate-pulse"><Zap size={32}/></div>
             <div className="flex flex-col items-center">
                <div className="w-48 h-64 border border-[#bc8cff] bg-[#bc8cff]/10 rounded flex items-center justify-center flex-col text-[#bc8cff] mb-2 shadow-[0_0_30px_rgba(188,140,255,0.2)]">
                   <Bone size={64} className="mb-2" />
                   <span className="font-bold text-[10px] uppercase">Synthesized 3D FBX</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

function AIAgentStateGraph() {
  return (
    <div className="flex h-full bg-[#050505]">
       {/* Left Panel - State Details */}
       <div className="w-[300px] border-r border-[#30363d] bg-[#0d1117] flex flex-col">
          <div className="p-3 border-b border-[#30363d] text-[11px] font-bold text-[#3fb950] uppercase tracking-wider flex justify-between items-center">
             Agent States
          </div>
          <div className="p-4 flex flex-col gap-4">
             <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                <h3 className="text-[#c9d1d9] text-[12px] font-bold mb-2">Current State</h3>
                <div className="flex items-center gap-2 text-[#3fb950] font-mono text-[14px]">
                   <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></span>
                   Investigate_Noise
                </div>
             </div>
             
             <div className="flex flex-col gap-2">
                <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Available States</div>
                {['Idle_Patrol', 'Investigate_Noise', 'Combat_Melee', 'Flee', 'Dead'].map(state => (
                  <div key={state} className={`px-2 py-1.5 rounded text-[11px] border ${state === 'Investigate_Noise' ? 'bg-[#3fb950]/10 border-[#3fb950] text-[#3fb950]' : 'bg-[#161b22] border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e] cursor-pointer'}`}>
                     {state}
                  </div>
                ))}
             </div>
             
             <div className="bg-[#161b22] border border-[#30363d] rounded p-3 mt-2">
                <h3 className="text-[#8b949e] text-[10px] font-bold uppercase mb-2">Transitions from Current</h3>
                <div className="flex flex-col gap-2 text-[11px]">
                   <div className="flex justify-between items-center">
                      <span className="text-white">See_Enemy</span>
                      <ChevronRight size={14} className="text-[#8b949e]"/>
                      <span className="text-[#e3b341]">Combat_Melee</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-white">Timeout (10s)</span>
                      <ChevronRight size={14} className="text-[#8b949e]"/>
                      <span className="text-[#c9d1d9]">Idle_Patrol</span>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Right Panel - Graph View */}
       <div className="flex-1 relative overflow-hidden bg-[#0d1117]" style={{ backgroundImage: 'linear-gradient(#161b22 1px, transparent 1px), linear-gradient(90deg, #161b22 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          <div className="absolute top-4 left-4 bg-[#161b22] border border-[#30363d] px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
             <Network size={14} className="text-[#3fb950]"/>
             <span className="text-[11px] font-bold text-white uppercase tracking-wider">State Transition Graph</span>
          </div>
          
          {/* Node: Idle_Patrol */}
          <div className="absolute top-1/4 left-1/4 bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg cursor-pointer hover:border-[#c9d1d9] z-10 w-40 justify-center">
             <Eye size={14} className="text-[#8b949e]" />
             <span className="text-[12px] font-bold text-[#c9d1d9]">Idle_Patrol</span>
          </div>

          {/* Node: Investigate_Noise */}
          <div className="absolute top-1/3 left-1/2 bg-[#3fb950]/10 border-2 border-[#3fb950] rounded-lg px-4 py-2 flex items-center gap-2 shadow-[0_0_15px_rgba(63,185,80,0.2)] cursor-pointer z-10 w-40 justify-center">
             <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></div>
             <span className="text-[12px] font-bold text-white">Investigate_Noise</span>
          </div>
          
          {/* Node: Combat_Melee */}
          <div className="absolute top-[60%] left-[45%] bg-[#161b22] border-2 border-[#e3b341] rounded-lg px-4 py-2 flex items-center gap-2 shadow-[0_0_15px_rgba(227,179,65,0.2)] cursor-pointer hover:border-[#c9d1d9] z-10 w-40 justify-center">
             <Crosshair size={14} className="text-[#e3b341]"/>
             <span className="text-[12px] font-bold text-[#c9d1d9]">Combat_Melee</span>
          </div>

          {/* Node: Flee */}
          <div className="absolute top-3/4 left-1/4 bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:border-[#c9d1d9] z-10 w-32">
             <span className="text-[12px] font-bold text-[#c9d1d9]">Flee</span>
          </div>

          {/* Node: Dead */}
          <div className="absolute top-[80%] left-[65%] bg-[#161b22] border border-[#f85149] rounded-lg px-4 py-2 flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:border-[#c9d1d9] z-10 w-32">
             <span className="text-[12px] font-bold text-[#f85149]">Dead</span>
          </div>
          
          {/* Lines using SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
             <defs>
               <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                 <polygon points="0 0, 10 3.5, 0 7" fill="#8b949e" />
               </marker>
               <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                 <polygon points="0 0, 10 3.5, 0 7" fill="#3fb950" />
               </marker>
               <marker id="arrowhead-warning" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                 <polygon points="0 0, 10 3.5, 0 7" fill="#e3b341" />
               </marker>
             </defs>
             
             {/* Note: In a real app we'd compute connection points based on node rects.
                 Since this is fixed CSS absolute positioning, we will hardcode the paths */}
             
             {/* From Idle to Investigate */}
             <path d="M 380 250 C 450 250, 480 300, 520 320" fill="none" stroke="#3fb950" strokeWidth="2" markerEnd="url(#arrowhead-active)"/>
             <rect x="410" y="270" width="80" height="20" fill="#0d1117" rx="4" ry="4" stroke="#3fb950" />
             <text x="420" y="284" fill="#3fb950" fontSize="10" fontWeight="bold">Hear_Noise</text>

             {/* From Investigate to Combat */}
             <path d="M 520 360 C 500 420, 500 450, 480 500" fill="none" stroke="#e3b341" strokeWidth="2" markerEnd="url(#arrowhead-warning)"/>
             <rect x="460" y="420" width="80" height="20" fill="#0d1117" rx="4" ry="4" stroke="#e3b341" />
             <text x="470" y="434" fill="#e3b341" fontSize="10" fontWeight="bold">See_Enemy</text>
             
             {/* From Investigate back to Idle */}
             <path d="M 600 320 C 680 300, 750 200, 380 230" fill="none" stroke="#8b949e" strokeWidth="1" strokeDasharray="4" markerEnd="url(#arrowhead)"/>
             <rect x="620" y="235" width="85" height="20" fill="#0d1117" rx="4" ry="4" stroke="#30363d" />
             <text x="630" y="249" fill="#8b949e" fontSize="10" fontWeight="bold">Timeout (10s)</text>
             
             {/* From Combat to Flee */}
             <path d="M 440 540 C 380 540, 350 630, 310 650" fill="none" stroke="#8b949e" strokeWidth="2" markerEnd="url(#arrowhead)"/>
             {/* From Combat to Dead */}
             <path d="M 500 550 C 550 580, 580 620, 600 680" fill="none" stroke="#8b949e" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          </svg>
       </div>
    </div>
  )
}