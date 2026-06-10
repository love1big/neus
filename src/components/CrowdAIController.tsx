import React from 'react';
import { Target, Users, Play, Pause, Settings2, Sliders, Activity, Zap, Layers, RefreshCw, Cpu, Radio, Network } from 'lucide-react';

export default function CrowdAIController() {
  return (
    <div className="flex flex-col h-full bg-[#111] text-[#c9d1d9] font-sans">
      <div className="h-12 bg-[#1a1a1a] border-b border-[#333] shadow flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded flex items-center justify-center bg-gradient-to-br from-[#bc8cff] to-[#58a6ff] text-white">
                <Users size={18}/>
             </div>
             <div>
                 <h2 className="font-bold text-[12px] uppercase tracking-widest text-white">Mass Crowd AI & Boid Controller</h2>
                 <p className="text-[9px] text-[#8b949e] font-mono">DOTS / ECS MULTI-THREADED CROWD SIMULATION CACHE</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="bg-[#0d1117] border border-[#30363d] px-3 py-1 rounded flex items-center gap-2">
                 <span className="text-[10px] text-[#8b949e] uppercase font-bold">Simulated Agents</span>
                 <span className="font-mono text-[14px] text-[#3fb950] font-bold">256,042</span>
             </div>
             <div className="flex items-center gap-1 bg-[#21262d] rounded p-1">
                 <button className="bg-[#3fb950] text-[#0d1117] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex gap-1 items-center"><Play size={12}/> Run Sim</button>
                 <button className="text-[#8b949e] hover:text-white px-2"><Pause size={14}/></button>
                 <button className="text-[#8b949e] hover:text-white px-2"><RefreshCw size={14}/></button>
             </div>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          
          {/* Top-down Viewport */}
          <div className="flex-1 bg-[#0d1117] relative overflow-hidden flex flex-col border-r border-[#333]">
             <div className="flex-1 relative" style={{ backgroundImage: 'radial-gradient(#21262d 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
                
                {/* Fake City Block / NavMesh */}
                <div className="absolute inset-x-20 inset-y-20 border-2 border-[#58a6ff]/20 bg-[#58a6ff]/5 flex">
                   <div className="w-1/3 border-r-2 border-[#58a6ff]/20 flex flex-col">
                      <div className="flex-1 border-b-2 border-[#58a6ff]/20"></div>
                      <div className="flex-1"></div>
                   </div>
                   <div className="flex-1 p-10">
                      <div className="w-full h-full bg-black/40 rounded-full border border-[#f85149]/30 flex items-center justify-center">
                         <div className="w-1/2 h-1/2 bg-[#f85149]/10 rounded-full animate-pulse blur-xl"></div>
                      </div>
                   </div>
                </div>

                {/* Fake Flow Vectors */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                   <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#bc8cff" />
                      </marker>
                   </defs>
                   <path d="M 100 100 Q 200 150 300 100" fill="none" stroke="#bc8cff" strokeWidth="2" markerEnd="url(#arrow)" />
                   <path d="M 100 200 Q 250 250 400 200" fill="none" stroke="#bc8cff" strokeWidth="2" markerEnd="url(#arrow)" />
                   <path d="M 100 300 Q 300 350 500 300" fill="none" stroke="#bc8cff" strokeWidth="2" markerEnd="url(#arrow)" />
                </svg>

                {/* Screen Overlays */}
                <div className="absolute top-4 left-4 bg-black/50 border border-[#333] rounded p-2 text-[10px] font-mono space-y-1">
                   <div className="text-[#3fb950]">Frame: 144.2 fps</div>
                   <div className="text-[#bc8cff]">Logic: 1.2 ms (Burst/Jobs)</div>
                   <div className="text-[#58a6ff]">Render: 4.5 ms (GPU Instancing)</div>
                </div>

             </div>
             
             {/* Timeline / Scrub */}
             <div className="h-16 bg-[#161b22] border-t border-[#333] flex items-center px-4 shrink-0">
                <span className="text-[10px] text-[#8b949e] font-mono mr-2">Cache</span>
                <div className="flex-1 h-2 bg-[#0d1117] rounded-full border border-[#333] overflow-hidden">
                   <div className="w-2/3 h-full bg-[#58a6ff] opacity-50 relative">
                     <div className="absolute top-0 bottom-0 left-[80%] right-0 bg-[#f85149]"></div>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Parameters panel */}
          <div className="w-[340px] bg-[#161b22] flex flex-col shrink-0">
             
             <div className="p-3 border-b border-[#333] bg-[#0d1117]">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center gap-2"><Settings2 size={16} className="text-[#bc8cff]"/> Flow Graph & Rules</h3>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-[11px]">
                 
                 {/* Boid Rules */}
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-[#8b949e] uppercase border-b border-[#333] pb-1">Flocking Kinematics (Boids)</h4>
                    
                    <div>
                       <div className="flex justify-between mb-1"><span>Separation Weight</span><span className="font-mono text-[#58a6ff]">1.5</span></div>
                       <input type="range" className="w-full accent-[#58a6ff]" defaultValue="15" />
                    </div>
                    <div>
                       <div className="flex justify-between mb-1"><span>Alignment Weight</span><span className="font-mono text-[#58a6ff]">1.0</span></div>
                       <input type="range" className="w-full accent-[#58a6ff]" defaultValue="10" />
                    </div>
                    <div>
                       <div className="flex justify-between mb-1"><span>Cohesion Weight</span><span className="font-mono text-[#58a6ff]">0.8</span></div>
                       <input type="range" className="w-full accent-[#58a6ff]" defaultValue="8" />
                    </div>
                 </div>

                 {/* Navigation & Avoidance */}
                 <div className="space-y-4 pt-4 border-t border-[#333]">
                    <h4 className="text-[10px] font-bold text-[#8b949e] uppercase border-b border-[#333] pb-1">Local Avoidance (RVO)</h4>
                    
                    <div>
                       <div className="flex justify-between mb-1"><span>Time Horizon (s)</span><span className="font-mono text-[#e3b341]">2.5</span></div>
                       <input type="range" className="w-full accent-[#e3b341]" defaultValue="25" />
                    </div>
                    <div>
                       <div className="flex justify-between mb-1"><span>Neighbor Radius</span><span className="font-mono text-[#e3b341]">5.0m</span></div>
                       <input type="range" className="w-full accent-[#e3b341]" defaultValue="50" />
                    </div>
                    <div>
                       <div className="flex justify-between mb-1"><span>Max Neighbors</span><span className="font-mono text-[#e3b341]">32</span></div>
                       <input type="range" className="w-full accent-[#e3b341]" max="128" defaultValue="32" />
                    </div>
                 </div>

                 {/* AI States */}
                 <div className="space-y-3 pt-4 border-t border-[#333]">
                    <h4 className="text-[10px] font-bold text-[#8b949e] uppercase border-b border-[#333] pb-1">Macro State Machine Distribution</h4>
                    
                    <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] space-y-2">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div>
                           <span className="flex-1">IDLE / WANDER</span>
                           <span className="font-mono">60%</span>
                        </div>
                        <div className="w-full h-1 bg-[#21262d]"><div className="h-full bg-[#3fb950]" style={{width: '60%'}}></div></div>
                        
                        <div className="flex items-center gap-2 mt-2">
                           <div className="w-2 h-2 rounded-full bg-[#e3b341]"></div>
                           <span className="flex-1">FLEE DANGER</span>
                           <span className="font-mono">35%</span>
                        </div>
                        <div className="w-full h-1 bg-[#21262d]"><div className="h-full bg-[#e3b341]" style={{width: '35%'}}></div></div>
                        
                        <div className="flex items-center gap-2 mt-2">
                           <div className="w-2 h-2 rounded-full bg-[#f85149]"></div>
                           <span className="flex-1">ATTACK / PANIC</span>
                           <span className="font-mono">5%</span>
                        </div>
                        <div className="w-full h-1 bg-[#21262d]"><div className="h-full bg-[#f85149]" style={{width: '5%'}}></div></div>
                    </div>
                 </div>

                 <button className="w-full bg-gradient-to-r from-[#21262d] to-[#161b22] hover:from-[#30363d] hover:to-[#21262d] border border-[#444] rounded py-2 text-[11px] font-bold uppercase tracking-widest mt-4">
                    Bake Animation Vertex Texture (VAT)
                 </button>

             </div>

          </div>
      </div>
    </div>
  );
}
