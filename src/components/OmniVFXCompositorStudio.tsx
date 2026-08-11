import React, { useState } from 'react';
import { 
  Sparkles, Flame, Wand2, Combine, Eye, Settings2, Box, Layers, Play, Pause, Square, Zap, Camera, Activity, Maximize, AlertTriangle, Wind, Droplets, Target, Rocket} from 'lucide-react';

export default function OmniVFXCompositorStudio() {
  const [activeTab, setActiveTab] = useState('Graph'); // Graph, Compositor, Chaos, AIGen
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0E0E10] text-[#ccc] font-sans text-xs overflow-hidden select-none">
      
      {/* 💥 ELITE TOP NAVBAR 💥 */}
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1.5 rounded border border-[#333] shadow-inner items-center gap-2">
                   <Sparkles size={18} className="text-[#bc8cff] animate-pulse"/>
                   <span className="text-white font-black tracking-widest text-[12px] uppercase" style={{textShadow: '0 0 10px rgba(188,140,255,0.5)'}}>Omni VFX & Node Compositor</span>
                   <span className="text-[#666] font-mono text-[9px] ml-2">HyperReal Edition</span>
                </div>
                <div className="h-6 w-px bg-[#333]"></div>
                <div className="flex text-[10px] font-mono gap-5 text-[#8b949e]">
                   <span className="flex items-center gap-1"><Zap size={12} className="text-[#3fb950]"/> Emitters: 24Active</span>
                   <span className="flex items-center gap-1"><Layers size={12} className="text-[#58a6ff]"/> Particles: 4.2M</span>
                   <span className="flex items-center gap-1"><Activity size={12} className="text-[#e3b341]"/> SIM-FPS: 120</span>
                </div>
            </div>
            
            {/* Global Transport Controls */}
            <div className="flex bg-[#000] border border-[#333] rounded overflow-hidden shadow-inner font-bold text-[10px]">
               <button onClick={() => setIsPlaying(!isPlaying)} className={`px-5 py-1 transition flex items-center justify-center min-w-[60px] ${isPlaying ? 'bg-[#3fb950] text-[#000] hover:bg-[#2ea043]' : 'bg-[#1a1a1a] text-[#3fb950] hover:bg-[#222]'}`}>
                  {isPlaying ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>} <span className="ml-1 tracking-wider uppercase text-[9px]">Sim</span>
               </button>
               <button onClick={() => setIsPlaying(false)} className="px-4 py-1 bg-[#1a1a1a] hover:bg-[#222] transition text-[#f85149] flex items-center gap-1"><Square size={12} fill="currentColor"/> Stop</button>
            </div>

            <div className="flex items-center gap-2">
                 <button className="px-5 py-1.5 bg-[#bc8cff]/10 text-[#bc8cff] font-black rounded shadow-[0_0_15px_rgba(188,140,255,0.2)] hover:bg-[#bc8cff]/20 transition flex items-center gap-2 text-[11px] uppercase tracking-widest border border-[#bc8cff]/50"><Camera size={12}/> Render Cache</button>
            </div>
         </div>

         <div className="flex px-2 bg-[#0a0a0a] border-t border-[#222]">
            <ModuleTab active={activeTab === 'Graph'} onClick={() => setActiveTab('Graph')} icon={<Flame size={12}/>} label="1. Niagara/Particle Graph" color="text-[#fb8500]"/>
            <ModuleTab active={activeTab === 'Compositor'} onClick={() => setActiveTab('Compositor')} icon={<Combine size={12}/>} label="2. Nuke-Style Compositor" color="text-[#58a6ff]"/>
            <ModuleTab active={activeTab === 'Chaos'} onClick={() => setActiveTab('Chaos')} label="3. Chaos/Physics Destruction" icon={<AlertTriangle size={12}/>} color="text-[#e3b341]"/>
            <ModuleTab active={activeTab === 'AIGen'} onClick={() => setActiveTab('AIGen')} label="4. AI VFX Generator" icon={<Wand2 size={12}/>}  color="text-[#bc8cff]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
         
         {/* NODE GRAPH AREA (Used by Graph, Compositor, Chaos) */}
         {activeTab !== 'AIGen' && (
           <div className="w-[300px] bg-[#111] border-r border-[#222] flex flex-col z-20 shrink-0">
               <div className="p-3 border-b border-[#222] bg-[#1a1a1a]">
                   <h3 className="text-[#888] font-bold text-[10px] tracking-widest uppercase mb-2">Node Palette</h3>
                   <input type="text" placeholder="Search nodes..." className="w-full bg-[#0a0a0a] border border-[#333] p-1.5 rounded text-[10px] outline-none" />
               </div>
               <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-4">
                  {activeTab === 'Graph' && (
                     <>
                        <div>
                           <div className="text-[#58a6ff] font-bold text-[9px] uppercase tracking-wider mb-1 px-1">Emitters</div>
                           <NodeItem name="GPU Sprite Burst" color="border-l-[#58a6ff]" />
                           <NodeItem name="Mesh Ribbon" color="border-l-[#58a6ff]" />
                           <NodeItem name="Volumetric Fog" color="border-l-[#58a6ff]" />
                        </div>
                        <div>
                           <div className="text-[#e3b341] font-bold text-[9px] uppercase tracking-wider mb-1 px-1">Initializers</div>
                           <NodeItem name="Spawn Rate" color="border-l-[#e3b341]" />
                           <NodeItem name="Shape Location (Sphere)" color="border-l-[#e3b341]" />
                           <NodeItem name="Initial Velocity" color="border-l-[#e3b341]" />
                           <NodeItem name="Color Randomizer" color="border-l-[#e3b341]" />
                        </div>
                        <div>
                           <div className="text-[#fb8500] font-bold text-[9px] uppercase tracking-wider mb-1 px-1">Updaters</div>
                           <NodeItem name="Gravity Force" color="border-l-[#fb8500]" />
                           <NodeItem name="Curl Noise Field" color="border-l-[#fb8500]" />
                           <NodeItem name="Vortex Velocity" color="border-l-[#fb8500]" />
                           <NodeItem name="Collision (Depth Buffer)" color="border-l-[#fb8500]" />
                        </div>
                     </>
                  )}
                  {activeTab === 'Compositor' && (
                     <>
                        <div>
                           <div className="text-[#3fb950] font-bold text-[9px] uppercase tracking-wider mb-1 px-1">Input / Output</div>
                           <NodeItem name="Read (Beauty Pass)" color="border-l-[#3fb950]" />
                           <NodeItem name="Read (Depth Pass)" color="border-l-[#3fb950]" />
                           <NodeItem name="Write (EXR)" color="border-l-[#3fb950]" />
                        </div>
                        <div>
                           <div className="text-[#58a6ff] font-bold text-[9px] uppercase tracking-wider mb-1 px-1">Color / Filter</div>
                           <NodeItem name="Grade" color="border-l-[#58a6ff]" />
                           <NodeItem name="ColorCorrect" color="border-l-[#58a6ff]" />
                           <NodeItem name="ZDefocus" color="border-l-[#58a6ff]" />
                           <NodeItem name="Glow / Bloom" color="border-l-[#58a6ff]" />
                           <NodeItem name="LensDistortion" color="border-l-[#58a6ff]" />
                        </div>
                        <div>
                           <div className="text-[#bc8cff] font-bold text-[9px] uppercase tracking-wider mb-1 px-1">Merge / Key</div>
                           <NodeItem name="Merge (Over)" color="border-l-[#bc8cff]" />
                           <NodeItem name="Merge (Screen)" color="border-l-[#bc8cff]" />
                           <NodeItem name="Keylight (Chroma)" color="border-l-[#bc8cff]" />
                        </div>
                     </>
                  )}
                  {activeTab === 'Chaos' && (
                     <>
                        <div>
                           <div className="text-[#f85149] font-bold text-[9px] uppercase tracking-wider mb-1 px-1">Fracture</div>
                           <NodeItem name="Voronoi Fracture" color="border-l-[#f85149]" />
                           <NodeItem name="Boolean Slice" color="border-l-[#f85149]" />
                           <NodeItem name="Clustering" color="border-l-[#f85149]" />
                        </div>
                        <div>
                           <div className="text-[#e3b341] font-bold text-[9px] uppercase tracking-wider mb-1 px-1">Physics & Solvers</div>
                           <NodeItem name="Rigid Body Solver" color="border-l-[#e3b341]" />
                           <NodeItem name="Soft Body (Cloth/Flesh)" color="border-l-[#e3b341]" />
                           <NodeItem name="Anchor Field" color="border-l-[#e3b341]" />
                        </div>
                        <div>
                           <div className="text-[#3fb950] font-bold text-[9px] uppercase tracking-wider mb-1 px-1">Fields / Forces</div>
                           <NodeItem name="Explosive Force" color="border-l-[#3fb950]" />
                           <NodeItem name="Strain Engine" color="border-l-[#3fb950]" />
                        </div>
                     </>
                  )}
               </div>
           </div>
         )}

         {/* MAIN VIEWPORT & GRAPH CANVAS */}
         <div className="flex-1 bg-[#111] border-[#222] relative flex flex-col">
            
            {/* Split View (Viewport Top, Node Graph Bottom) */}
            {activeTab !== 'AIGen' && (
               <>
                  <div className="flex-[0.6] bg-[#050505] relative overflow-hidden flex items-center justify-center border-b border-[#333]">
                     <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px', transform: 'perspective(1000px) rotateX(60deg) scale(3) translateY(-100px)' }}></div>
                     
                     {/* Viewport content based on active tab */}
                     {activeTab === 'Graph' && (
                        <div className="relative">
                           <div className={`w-32 h-32 rounded-full absolute -ml-16 -mt-16 bg-gradient-to-r from-[#fb8500] to-[#f85149] blur-[40px] opacity-60 mix-blend-screen scale-150`}></div>
                           <Flame size={64} className="text-[#fb8500] relative z-10 animate-pulse drop-shadow-[0_0_20px_#fb8500]"/>
                           
                           {/* Floating Particles Simulation */}
                           <div className="absolute inset-0 pointer-events-none">
                              {[...Array(20)].map((_, i) => (
                                <div key={i} className="absolute w-2 h-2 bg-[#fb8500] rounded-full blur-[2px] opacity-80" style={{
                                   left: `${Math.random() * 200 - 100}px`,
                                   top: `${Math.random() * 200 - 100}px`,
                                   animation: `pulse 1s infinite alternate ${Math.random()}s`,
                                   boxShadow: '0 0 10px #fb8500'
                                }}></div>
                              ))}
                           </div>
                        </div>
                     )}
                     {activeTab === 'Compositor' && (
                        <div className="w-[80%] h-[80%] border border-[#333] shadow-2xl relative overflow-hidden bg-black flex items-center justify-center">
                           <div className="absolute inset-0 bg-gradient-to-tr from-[#111] to-[#222]"></div>
                           <div className="w-48 h-48 bg-[#bc8cff] blur-[60px] opacity-30 absolute mix-blend-screen"></div>
                           <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80" alt="comp_bg"/>
                           <div className="text-white text-opacity-50 text-[10px] font-mono absolute bottom-2 right-2">2048x1080 24fps sRGB Exr</div>
                        </div>
                     )}
                     {activeTab === 'Chaos' && (
                        <div className="relative perspective-1000 transform rotate-x-60 translate-y-10">
                           {/* Simulation of a fractured cube */}
                           <div className="w-40 h-40 border border-[#e3b341] bg-[#e3b341]/10 flex flex-wrap relative">
                              {[...Array(16)].map((_, i) => (
                                 <div key={i} className={`w-10 h-10 border border-[#e3b341]/30 bg-[#e3b341]/20 ${isPlaying ? 'transition-all duration-1000 transform' : ''}`} style={isPlaying ? {
                                    transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * -100 - 50}px) rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`,
                                    opacity: 0
                                 } : {}}></div>
                              ))}
                           </div>
                           {/* Ground Grid */}
                           <div className="w-80 h-80 border-t border-l border-[#333] absolute -left-20 -top-20 -z-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                        </div>
                     )}

                     {/* Viewport UI Overlay */}
                     <div className="absolute top-2 left-2 flex gap-2">
                        <span className="bg-[#000] text-[#888] px-2 py-1 text-[9px] font-bold border border-[#333] rounded uppercase">Lit (High-Quality)</span>
                        <span className="bg-[#000] text-[#888] px-2 py-1 text-[9px] font-bold border border-[#333] rounded uppercase flex items-center gap-1"><Maximize size={10}/> Full Screen</span>
                     </div>
                  </div>

                  {/* Node Graph Area */}
                  <div className="flex-[0.4] bg-[#1a1a1c] relative" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                      <div className="absolute top-2 left-2 text-[#888] font-mono text-[9px] uppercase tracking-wider bg-[#000] px-2 py-1 rounded border border-[#333]">Logic Graph Editor</div>
                      
                      {/* Fake Nodes in Graph based on Tab */}
                      {activeTab === 'Graph' && (
                         <>
                            <GraphNode x="50" y="40" title="Spawn Rate" color="bg-[#e3b341]" outputs={['Count']} />
                            <GraphNode x="250" y="40" title="GPU Sprite Burst" color="bg-[#58a6ff]" inputs={['Spawn_Rate', 'Location', 'Velocity']} outputs={['Render']} />
                            <GraphNode x="50" y="120" title="Curl Noise" color="bg-[#fb8500]" outputs={['Velocity']} />
                            {/* Connectors */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#888] stroke-2 fill-none">
                               <path d="M 150 60 C 200 60, 200 70, 250 70" />
                               <path d="M 150 140 C 200 140, 200 90, 250 90" />
                            </svg>
                         </>
                      )}
                      
                      {activeTab === 'Compositor' && (
                         <>
                            <GraphNode x="40" y="40" title="Read (CG_Beauty.exr)" color="bg-[#3fb950]" outputs={['rgba']} />
                            <GraphNode x="220" y="80" title="ColorCorrect" color="bg-[#58a6ff]" inputs={['Image']} outputs={['Result']} />
                            <GraphNode x="40" y="160" title="Glow / Bloom" color="bg-[#58a6ff]" inputs={['Image']} outputs={['Result']} />
                            <GraphNode x="420" y="120" title="Merge (Screen)" color="bg-[#bc8cff]" inputs={['A', 'B']} outputs={['rgba']} />
                            {/* Connectors */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#888] stroke-2 fill-none">
                               <path d="M 160 60 C 190 60, 190 100, 220 100" />
                               <path d="M 320 100 C 370 100, 370 130, 420 130" />
                               <path d="M 160 180 C 300 180, 300 150, 420 150" />
                            </svg>
                         </>
                      )}

                      {activeTab === 'Chaos' && (
                         <>
                            <GraphNode x="40" y="50" title="Static Mesh (Wall)" color="bg-[#888]" outputs={['Geo']} />
                            <GraphNode x="200" y="50" title="Voronoi Fracture" color="bg-[#f85149]" inputs={['Geometry']} outputs={['Chunks']} />
                            <GraphNode x="400" y="50" title="Rigid Body Solver" color="bg-[#e3b341]" inputs={['Objects', 'Forces']} outputs={['SimState']} />
                            <GraphNode x="200" y="150" title="Explosive Force" color="bg-[#3fb950]" outputs={['Field']} />
                             {/* Connectors */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#888] stroke-2 fill-none">
                               <path d="M 140 70 C 170 70, 170 70, 200 70" />
                               <path d="M 320 70 C 360 70, 360 70, 400 70" />
                               <path d="M 320 170 C 360 170, 360 90, 400 90" />
                            </svg>
                         </>
                      )}

                  </div>
               </>
            )}

            {/* AI VFX GENERATOR FULL SCREEN */}
            {activeTab === 'AIGen' && (
               <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0a] p-10 relative">
                   <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(188,140,255,0.1) 0%, rgba(0,0,0,0) 70%)'}}></div>
                   <Wand2 size={64} className="text-[#bc8cff] mb-6 animate-pulse" />
                   <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-2">Prompt-to-Particle AI</h2>
                   <p className="text-[#888] text-center max-w-lg mb-8 text-[14px]">Describe the desired visual effect. The AI will generate a complete Niagara-compatible node graph, textures, and fluid simulations automatically.</p>
                   
                   <div className="w-full max-w-2xl bg-[#111] p-4 rounded-xl border border-[#333] shadow-2xl relative z-10 flex flex-col gap-4">
                      <textarea className="w-full h-24 bg-[#050505] border border-[#222] rounded-lg p-4 text-white resize-none outline-none focus:border-[#bc8cff] transition-colors font-mono text-[14px]" placeholder="e.g., 'A swirling vortex of blue arcane fire that collapses inward and explodes into sparkling golden dust.'"></textarea>
                      <button className="bg-gradient-to-r from-[#bc8cff] to-[#8a4fff] text-white font-black text-[14px] uppercase tracking-widest py-3 rounded-lg hover:shadow-[0_0_20px_rgba(188,140,255,0.4)] transition-all">Generate Particle Graph</button>
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

function NodeItem({ name, color }) {
   return (
      <div className={`p-2 bg-[#1a1a1a] border border-[#333] border-l-4 ${color} rounded hover:bg-[#222] cursor-pointer mb-1 w-full text-left text-[11px] font-bold text-[#ccc]`}>
         {name}
      </div>
   );
}

function GraphNode({ x, y, title, color, inputs = [], outputs = [] }) {
   return (
      <div className={`absolute bg-[#111] border border-[#333] rounded shadow-lg flex flex-col w-[120px]`} style={{ left: `${x}px`, top: `${y}px` }}>
         <div className={`${color} px-2 py-1 text-black font-bold text-[9px] uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis rounded-t`}>{title}</div>
         <div className="flex justify-between w-full h-full min-h-[40px] px-1 py-1 bg-[#1a1a1a] rounded-b text-[8px] text-[#888] font-mono">
            <div className="flex flex-col gap-1 items-start justify-center w-1/2">
                {inputs.map((inp, i) => (
                   <div key={i} className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#555]"></div> {inp}</div>
                ))}
            </div>
            <div className="flex flex-col gap-1 items-end justify-center w-1/2">
               {outputs.map((out, i) => (
                   <div key={i} className="flex items-center gap-1 justify-end">{out} <div className="w-1.5 h-1.5 rounded-full bg-[#ccc]"></div></div>
                ))}
            </div>
         </div>
      </div>
   );
}
