import React, { useState, useEffect } from 'react';
import { Activity, Play, Pause, Square, SkipBack, SkipForward, Circle, Maximize, Settings2, SlidersHorizontal, Share2, ZoomIn, Box, Layers, Zap, Flame, Wind, Droplets, Snowflake, Shield, Settings, Download, Save, Grid, Cpu, Database, Network } from 'lucide-react';

export default function VFXGraphEditor() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('Graph'); // Graph, System, Materials

  // Simulate particles
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, z: number, life: number, maxLife: number, size: number, color: string}>>([]);

  useEffect(() => {
     if (!isPlaying) return;
     let frameId: number;
     let idCounter = 0;

     const updateParticles = () => {
        setParticles(prev => {
           let newParticles = [...prev];
           // spawn new
           for(let i=0; i<3; i++) {
              newParticles.push({
                 id: idCounter++,
                 x: (Math.random() - 0.5) * 20,
                 y: 0,
                 z: (Math.random() - 0.5) * 20,
                 life: 0,
                 maxLife: 100 + Math.random() * 50,
                 size: 2 + Math.random() * 8,
                 color: `hsl(${20 + Math.random() * 40}, 100%, 50%)` // Fire colors
              });
           }

           // update existing
           return newParticles.map(p => {
              // Curl noise simulation
              const curlX = Math.sin(p.y * 0.1) * 2;
              const curlZ = Math.cos(p.y * 0.1) * 2;
              return {
                 ...p,
                 x: p.x + curlX + (Math.random() - 0.5),
                 y: p.y + 1.5 + (Math.random() * 0.5),
                 z: p.z + curlZ + (Math.random() - 0.5),
                 life: p.life + 1,
                 size: Math.max(0, p.size * 0.98)
              };
           }).filter(p => p.life < p.maxLife);
        });
        frameId = requestAnimationFrame(updateParticles);
     };

     frameId = requestAnimationFrame(updateParticles);
     return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#111111] text-[#cccccc] font-sans text-xs overflow-hidden select-none">
      {/* Top Menu Bar */}
      <div className="flex items-center justify-between border-b border-[#222] bg-[#1a1a1a] px-3 py-2 shrink-0 shadow-md">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded text-[10px] font-black shadow-lg uppercase tracking-widest border border-orange-400/50">
               <Flame size={14} fill="currentColor"/> HyperVFX Graph
            </div>
            <div className="flex bg-[#222] rounded border border-[#333] overflow-hidden shadow-inner">
               <button onClick={() => setActiveTab('Graph')} className={`px-4 py-1.5 font-bold transition-colors ${activeTab === 'Graph' ? 'bg-[#333] text-white' : 'hover:bg-[#2a2a2a] text-[#888]'}`}>Particle Logic Graph</button>
               <button onClick={() => setActiveTab('System')} className={`px-4 py-1.5 font-bold transition-colors ${activeTab === 'System' ? 'bg-[#333] text-white' : 'hover:bg-[#2a2a2a] text-[#888]'}`}>System Settings</button>
            </div>
         </div>
         <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 bg-[#0070d2] text-white px-3 py-1 rounded border border-[#005ea6] hover:bg-[#005ea6] shadow-sm font-bold">Compile System</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Left Nodes Panel */}
         <div className="w-64 bg-[#1a1a1a] border-r border-[#222] flex flex-col shrink-0">
            <div className="px-3 py-2 bg-[#222] border-b border-[#333] font-bold text-white uppercase tracking-wider text-[10px] flex justify-between items-center shadow-sm">
               Effect Modules
               <Settings2 size={12} className="cursor-pointer hover:text-white"/>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
               {/* Categories */}
               <div>
                  <h3 className="text-[#888] font-bold text-[9px] uppercase tracking-widest mb-2 flex items-center gap-2"><Zap size={10}/> Emitters</h3>
                  <div className="grid grid-cols-2 gap-2">
                     <button className="bg-[#222] border border-[#333] hover:border-[#fb8500] rounded p-1.5 text-left text-[10px] hover:text-white transition-colors">Burst Spawn</button>
                     <button className="bg-[#222] border border-[#333] hover:border-[#fb8500] rounded p-1.5 text-left text-[10px] hover:text-white transition-colors">Continuous</button>
                     <button className="bg-[#222] border border-[#333] hover:border-[#fb8500] rounded p-1.5 text-left text-[10px] hover:text-white transition-colors col-span-2">GPU Spawn Target</button>
                  </div>
               </div>

               <div>
                  <h3 className="text-[#888] font-bold text-[9px] uppercase tracking-widest mb-2 flex items-center gap-2"><Activity size={10}/> Initializers</h3>
                  <div className="space-y-1.5">
                     <button className="w-full bg-[#222] border border-[#333] hover:border-[#0070d2] rounded p-1.5 text-left text-[10px] hover:text-white transition-colors flex justify-between">Set Velocity (Cone) <PlusIcon size={10}/></button>
                     <button className="w-full bg-[#222] border border-[#333] hover:border-[#0070d2] rounded p-1.5 text-left text-[10px] hover:text-white transition-colors flex justify-between">Set Color Random <PlusIcon size={10}/></button>
                     <button className="w-full bg-[#222] border border-[#333] hover:border-[#0070d2] rounded p-1.5 text-left text-[10px] hover:text-white transition-colors flex justify-between">Set Lifetime <PlusIcon size={10}/></button>
                  </div>
               </div>

               <div>
                  <h3 className="text-[#888] font-bold text-[9px] uppercase tracking-widest mb-2 flex items-center gap-2"><Wind size={10}/> Update Forces</h3>
                  <div className="space-y-1.5">
                     <button className="w-full bg-[#222] border border-[#333] hover:border-[#3fb950] rounded p-1.5 text-left text-[10px] hover:text-white transition-colors flex justify-between">Gravity / Drag <PlusIcon size={10}/></button>
                     <button className="w-full bg-[#222] border border-[#333] hover:border-[#3fb950] rounded p-1.5 text-left text-[10px] hover:text-white transition-colors flex justify-between">Curl Noise Force <PlusIcon size={10}/></button>
                     <button className="w-full bg-[#222] border border-[#333] hover:border-[#3fb950] rounded p-1.5 text-left text-[10px] hover:text-white transition-colors flex justify-between">Color Over Life <PlusIcon size={10}/></button>
                     <button className="w-full bg-[#222] border border-[#333] hover:border-[#3fb950] rounded p-1.5 text-left text-[10px] hover:text-white transition-colors flex justify-between">Size Over Life <PlusIcon size={10}/></button>
                  </div>
               </div>

               <div>
                  <h3 className="text-[#888] font-bold text-[9px] uppercase tracking-widest mb-2 flex items-center gap-2"><Layers size={10}/> Renderers</h3>
                  <div className="space-y-1.5">
                     <button className="w-full bg-[#222] border border-[#333] hover:border-[#e3b341] rounded p-1.5 text-left text-[10px] hover:text-white transition-colors flex justify-between">Sprite Renderer <PlusIcon size={10}/></button>
                     <button className="w-full bg-[#222] border border-[#333] hover:border-[#e3b341] rounded p-1.5 text-left text-[10px] hover:text-white transition-colors flex justify-between">Mesh Instancing <PlusIcon size={10}/></button>
                  </div>
               </div>
            </div>
         </div>

         {/* Center Graph / Viewport Data */}
         {activeTab === 'Graph' && (
            <div className="flex-1 bg-[#111] relative overflow-hidden flex flex-col bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9IiMxNTE1MTUiIGZpbGwtb3BhY2l0eT0iMSIgLz4KPHBhdGggZD0iTTAgNDBoNDBNNDAgMHY0TTEwIDEwaDEwTTMwIDMwaDEwIiBzdHJva2U9IiMyMjIiIHN0cm9rZS13aWR0aD0iMSIvPgo8cGF0aCBkPSJNMCAyMGg0ME0yMCAwdjQwIiBzdHJva2U9IiMyMjIiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=')]">
               {/* Fake Nodes */}
               <div className="absolute inset-0 flex items-center justify-center -translate-y-20 -translate-x-32 scale-90">
                  
                  {/* System Node */}
                  <div className="w-64 bg-[#1a1a1a] border-2 border-[#333] rounded outline outline-4 outline-black/50 shadow-2xl overflow-hidden flex flex-col">
                     <div className="bg-gradient-to-r from-[#fb8500]/80 to-[#fb8500]/40 px-3 py-1.5 font-bold text-white flex items-center gap-2 border-b border-[#fb8500]">
                        <Activity size={14}/> Emitter Update
                     </div>
                     <div className="p-2 space-y-1 bg-[#151515]">
                        <div className="flex items-center justify-between text-[#ccc]">Spawn Rate <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_5px_yellow]"></div></div>
                        <div className="w-full bg-[#222] border border-[#333] px-2 py-1 rounded font-mono text-white text-right">300.0 pt/s</div>
                     </div>
                  </div>

                  <svg className="w-32 h-20 absolute left-[calc(50%+128px)] top-1/2 -translate-y-1/2 overflow-visible pointer-events-none">
                     <path d="M0,40 C 50,40 50,0 120,0" fill="none" stroke="#fb8500" strokeWidth="3" />
                  </svg>

                  {/* Particle Init Node */}
                  <div className="absolute left-[calc(50%+200px)] top-[calc(50%-100px)] w-64 bg-[#1a1a1a] border-2 border-[#0070d2] rounded shadow-[0_0_20px_rgba(0,112,210,0.2)] overflow-hidden flex flex-col">
                     <div className="bg-gradient-to-r from-[#0070d2]/80 to-[#0070d2]/40 px-3 py-1.5 font-bold text-white flex justify-between items-center border-b border-[#0070d2]">
                        Particle Initialize <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                     </div>
                     <div className="p-2 space-y-2 bg-[#151515]">
                        <div className="flex justify-between items-center border-b border-[#222] pb-1">
                           <span className="text-[#888]">Lifetime</span>
                           <span className="font-mono text-white">Min 1.0, Max 2.5</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[#222] pb-1">
                           <span className="text-[#888]">Color</span>
                           <div className="w-16 h-4 bg-gradient-to-r from-yellow-400 to-red-600 rounded"></div>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[#888]">Shape</span>
                           <span className="font-mono text-white">Sphere (r: 10)</span>
                        </div>
                     </div>
                  </div>

                  {/* Particle Update Node */}
                  <div className="absolute left-[calc(50%+200px)] top-[calc(50%+100px)] w-64 bg-[#1a1a1a] border-2 border-[#3fb950] rounded shadow-[0_0_20px_rgba(63,185,80,0.2)] overflow-hidden flex flex-col">
                     <div className="bg-gradient-to-r from-[#3fb950]/80 to-[#3fb950]/40 px-3 py-1.5 font-bold text-white flex justify-between items-center border-b border-[#3fb950]">
                        Particle Update <div className="w-3 h-3 rounded-full bg-green-400"></div>
                     </div>
                     <div className="p-2 space-y-2 bg-[#151515]">
                        <div className="flex justify-between items-center border-b border-[#222] pb-1">
                           <span className="text-white flex items-center gap-1"><Wind size={10}/> Curl Noise</span>
                           <span className="font-mono text-white bg-[#222] px-1 rounded">Freq: 0.5</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[#222] pb-1">
                           <span className="text-white">Gravity Force</span>
                           <span className="font-mono text-white">-9.8 Z</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-white">Size by Speed</span>
                           <div className="w-16 h-4 bg-[#222] rounded relative">
                              <svg className="absolute inset-0 w-full h-full text-[#3fb950]" preserveAspectRatio="none"><path d="M0,16 Q8,0 16,0" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
               
               <div className="absolute bottom-4 left-4 text-[10px] bg-black/80 px-3 py-2 rounded font-mono text-[#888] shadow-lg border border-[#333]">
                  Instructions compiled correctly.<br/>
                  GPU Sim: Active<br/>
                  Instructions: 42<br/>
                  Bytecode: 1,024 bytes
               </div>
            </div>
         )}
         
         {activeTab === 'System' && (
             <div className="flex-1 bg-[#1a1a1a] p-8 overflow-y-auto">
                 <h2 className="text-2xl font-bold text-white mb-6">System Properties</h2>
                 {/* Lots of fake form inputs */}
                 <div className="grid grid-cols-2 gap-8 max-w-4xl">
                     <div className="space-y-4">
                         <h3 className="text-lg text-[#fb8500] font-bold border-b border-[#333] pb-2">Simulation</h3>
                         <div>
                            <label className="text-[#888] block mb-1">Sim Target</label>
                            <select className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white"><option>GPU Compute</option><option>CPU</option></select>
                         </div>
                         <div>
                            <label className="text-[#888] block mb-1">Fixed Bounds</label>
                            <div className="flex gap-2">
                                <input type="text" defaultValue="-100" className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white font-mono"/>
                                <input type="text" defaultValue="-100" className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white font-mono"/>
                                <input type="text" defaultValue="-100" className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white font-mono"/>
                            </div>
                         </div>
                     </div>
                     <div className="space-y-4">
                         <h3 className="text-lg text-[#fb8500] font-bold border-b border-[#333] pb-2">Renderer</h3>
                         <div>
                            <label className="text-[#888] block mb-1">Material</label>
                            <div className="flex gap-2 items-center w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white">
                               <div className="w-6 h-6 rounded-sm bg-gradient-to-tr from-yellow-500 to-red-600"></div> M_FireEffect_Additive
                            </div>
                         </div>
                         <div>
                            <label className="text-[#888] block mb-1">Blend Mode</label>
                            <select className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-white"><option>Additive</option><option>Translucent</option><option>Opaque</option><option>Masked</option></select>
                         </div>
                     </div>
                 </div>
             </div>
         )}

         {/* Right Viewport (The simulated particles) */}
         <div className="w-[400px] border-l border-[#222] bg-[#050505] flex flex-col shrink-0 relative overflow-hidden">
            <div className="absolute top-2 left-2 z-10 flex gap-2">
               <button onClick={() => setIsPlaying(!isPlaying)} className={`p-1.5 rounded text-white shadow-lg transition-transform ${isPlaying ? 'bg-[#fb8500]' : 'bg-[#333]'}`}>
                  {isPlaying ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor" className="ml-0.5"/>}
               </button>
               <button className="p-1.5 bg-[#222] border border-[#333] rounded text-white hover:bg-[#333] transition-colors"><RotateCcwIcon size={14}/></button>
            </div>
            <div className="absolute top-2 right-2 text-[9px] font-mono text-[#fb8500] font-bold z-10 bg-black/50 px-2.5 py-1 rounded border border-[#fb8500]/50 backdrop-blur">
               PT: {particles.length}
            </div>

            {/* 3D Perspective Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 transform perspective-[500px] rotateX-[70deg] scale-150 translate-y-1/3 origin-center border-t border-[#fb8500]/30 shadow-[0_-10px_20px_rgba(251,133,0,0.1)] pointer-events-none"></div>

            {/* Simulated Particle Canvas */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
               {particles.map(p => (
                  <div 
                     key={p.id}
                     className="absolute rounded-full pointer-events-none shadow-xl"
                     style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        left: `calc(50% + ${p.x}px)`,
                        bottom: `calc(10% + ${p.y}px)`,
                        transform: `translate(-50%, 50%) scale(${1 + (p.z / 50)})`,
                        opacity: 1 - (p.life / p.maxLife),
                        filter: 'blur(1px)',
                        boxShadow: `0 0 ${p.size * 2}px ${p.color}`
                     }}
                  />
               ))}
               
               {/* Core Emitter visualizer */}
               <div className="absolute bottom-[10%] left-1/2 w-4 h-4 border-2 border-dashed border-[#fb8500] rounded-full transform -translate-x-1/2 translate-y-1/2 shadow-[0_0_15px_#fb8500]"></div>
            </div>
         </div>
      </div>
    </div>
  );
}

function PlusIcon({size, className}: {size: number, className?: string}) {
   return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}
function RotateCcwIcon({size}: {size: number}) {
   return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
}
