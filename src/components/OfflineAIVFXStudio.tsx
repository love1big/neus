import React, { useState } from 'react';
import { 
  Sparkles, Bot, Zap, Play, Square, Settings2, Save, Download, Cpu, 
  Layers, Layers3, Activity, Command, Boxes, Flame, Wand2, Orbit, Camera, 
  Map as MapIcon, Maximize, Clock, Scissors, Target, Bone, Move3d
} from 'lucide-react';

export default function OfflineAIVFXStudio() {
  const [prompt, setPrompt] = useState('Create a massive 3D dragon breath effect with trailing embers and blue core ignition, optimized for mobile.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('nodes'); // nodes, map_placement, model_socket, timeline
  const [activePropertyNode, setActivePropertyNode] = useState('Spawn');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans">
      
      {/* Top Bar */}
      <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <Sparkles className="text-[#e3b341]" size={20} />
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Advanced Offline VFX Forge & Placement</h2>
            <div className="text-[10px] text-[#8b949e]">No-AI Mode: 100% Modifiable, Map & Model Integrated Shader AST</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-[#0d1117] border border-[#30363d] rounded mr-4">
             <button onClick={() => setActiveTab('nodes')} className={`px-3 py-1.5 text-xs font-bold transition-colors ${activeTab === 'nodes' ? 'bg-[#58a6ff] text-white' : 'hover:bg-[#21262d] text-[#8b949e]'}`}>Node Graph</button>
             <div className="w-[1px] bg-[#30363d]"></div>
             <button onClick={() => setActiveTab('map_placement')} className={`px-3 py-1.5 text-xs font-bold transition-colors ${activeTab === 'map_placement' ? 'bg-[#3fb950] text-white' : 'hover:bg-[#21262d] text-[#8b949e]'}`}>Map Spawner</button>
             <div className="w-[1px] bg-[#30363d]"></div>
             <button onClick={() => setActiveTab('model_socket')} className={`px-3 py-1.5 text-xs font-bold transition-colors ${activeTab === 'model_socket' ? 'bg-[#bc8cff] text-white' : 'hover:bg-[#21262d] text-[#8b949e]'}`}>Model Sockets</button>
             <div className="w-[1px] bg-[#30363d]"></div>
             <button onClick={() => setActiveTab('timeline')} className={`px-3 py-1.5 text-xs font-bold transition-colors ${activeTab === 'timeline' ? 'bg-[#f85149] text-white' : 'hover:bg-[#21262d] text-[#8b949e]'}`}>Timeline</button>
          </div>
          <button className="flex items-center gap-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-3 py-1.5 rounded text-xs transition-colors">
            <Save size={14} className="text-[#3fb950]"/> Save
          </button>
          <button className="flex items-center gap-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-3 py-1.5 rounded text-xs transition-colors">
            <Download size={14} className="text-[#58a6ff]"/> Export GLSL
          </button>
          <button className="flex items-center gap-1.5 bg-[#2ea043] hover:bg-[#2c974b] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
            <Play size={14} fill="currentColor"/> Sim
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left Panel: Properties / Generator */}
        <div className="w-[340px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 custom-scrollbar justify-between">
           
           <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
              {/* Contextual Properties Based on Tab */}
              
              {activeTab === 'nodes' && (
                <>
                   <div className="bg-[#0d1117] border border-[#e3b341]/30 rounded-lg p-3">
                     <div className="flex items-center justify-between mb-2">
                       <h3 className="text-xs font-bold text-[#e3b341] uppercase tracking-wider flex items-center gap-2">
                         <Bot size={14} /> Offline AI Generator
                       </h3>
                       <span className="text-[9px] bg-[#e3b341]/20 text-[#e3b341] px-1.5 py-0.5 rounded border border-[#e3b341]/40">Active</span>
                     </div>
                     <textarea 
                        className="w-full h-20 bg-[#161b22] border border-[#30363d] rounded p-2 text-[11px] text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] resize-none mb-2"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                     />
                     <button 
                       onClick={handleGenerate}
                       disabled={isGenerating}
                       className={`w-full py-2 rounded text-[11px] font-bold transition-all flex justify-center items-center gap-2 ${
                         isGenerating ? 'bg-[#e3b341]/20 text-[#e3b341]' : 'bg-[#e3b341] text-[#0d1117] hover:bg-[#d09e30]'
                       }`}
                     >
                       {isGenerating ? <><Activity size={12} className="animate-pulse" /> Generating...</> : <><Wand2 size={12} /> Auto-Generate Graph</>}
                     </button>
                   </div>

                   <div className="flex flex-col gap-2 border-t border-[#30363d] pt-4">
                      <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2"><Settings2 size={14} className="text-[#8b949e]"/> Node Inspector</h3>
                      
                      <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded">
                         <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#30363d]">
                            <span className="text-xs font-bold text-[#58a6ff]">GPU Emitter</span>
                            <span className="text-[10px] text-[#8b949e]">ID: EM_01</span>
                         </div>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-[11px]">
                               <span className="text-[#8b949e]">Spawn Rate (Hz)</span>
                               <input type="number" defaultValue="45000" className="w-20 bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-right text-white font-mono focus:border-[#58a6ff] outline-none" />
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                               <span className="text-[#8b949e]">Lifetime Max</span>
                               <input type="number" defaultValue="1.5" className="w-20 bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-right text-white font-mono focus:border-[#58a6ff] outline-none" />
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                               <span className="text-[#8b949e]">Shape</span>
                               <select className="w-28 bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-white text-right focus:border-[#58a6ff] outline-none">
                                  <option>Sphere</option>
                                  <option>Cone</option>
                                  <option>Torus</option>
                               </select>
                            </div>
                            <div className="border border-[#30363d] rounded overflow-hidden">
                               <div className="bg-[#161b22] text-[10px] p-1 text-center font-bold text-[#8b949e] uppercase border-b border-[#30363d]">Color Over Life Gradient</div>
                               <div className="h-6 w-full bg-gradient-to-r from-[#58a6ff] via-[#bc8cff] to-[#f85149]"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                </>
              )}

              {activeTab === 'map_placement' && (
                <div className="space-y-4">
                   <div className="bg-[#0d1117] border border-[#30363d] rounded p-3 text-xs">
                     <p className="text-[#c9d1d9] mb-2 font-bold flex items-center gap-2"><MapIcon size={14} className="text-[#3fb950]" /> Target Map Scene</p>
                     <select className="w-full bg-[#161b22] border border-[#30363d] p-1.5 rounded text-white outline-none">
                       <option>Level_01_Forest</option>
                       <option>BossArena_Volcano</option>
                       <option>MainMenu_Backdrop</option>
                     </select>
                   </div>

                   <div className="bg-[#0d1117] border border-[#30363d] rounded p-3 text-xs">
                     <p className="text-[#c9d1d9] mb-3 font-bold flex items-center gap-2"><Move3d size={14} className="text-[#f85149]" /> Transform & Bounding</p>
                     
                     <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="flex flex-col gap-1">
                           <span className="text-[9px] text-[#8b949e] uppercase">Loc X</span>
                           <input type="text" defaultValue="1450.0" className="bg-[#161b22] border border-[#30363d] rounded p-1 text-center text-white font-mono text-[10px]" />
                        </div>
                        <div className="flex flex-col gap-1">
                           <span className="text-[9px] text-[#8b949e] uppercase">Loc Y</span>
                           <input type="text" defaultValue="-300.5" className="bg-[#161b22] border border-[#30363d] rounded p-1 text-center text-white font-mono text-[10px]" />
                        </div>
                        <div className="flex flex-col gap-1">
                           <span className="text-[9px] text-[#8b949e] uppercase">Loc Z</span>
                           <input type="text" defaultValue="10.0" className="bg-[#161b22] border border-[#30363d] rounded p-1 text-center text-white font-mono text-[10px]" />
                        </div>
                     </div>
                     <p className="text-[10px] text-[#8b949e] mt-2 italic">Culling distance dynamically adjusted based on active camera frustum.</p>
                   </div>
                </div>
              )}

              {activeTab === 'model_socket' && (
                <div className="space-y-4">
                   <div className="bg-[#0d1117] border border-[#bc8cff] rounded p-3 text-xs">
                     <p className="text-[#bc8cff] mb-2 font-bold flex items-center gap-2"><Bone size={14} /> Skeletal Mesh Target</p>
                     <select className="w-full bg-[#161b22] border border-[#30363d] p-1.5 rounded text-white outline-none mb-3 focus:border-[#bc8cff]">
                       <option>SK_Hero_Paladin</option>
                       <option>SK_Dragon_boss</option>
                       <option>SK_Weapon_Sword</option>
                     </select>
                     
                     <p className="text-[#c9d1d9] mb-2 font-bold text-[11px] uppercase tracking-wider">Socket Selection</p>
                     <div className="bg-[#161b22] border border-[#30363d] rounded p-2 max-h-40 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                        <div className="text-[10px] hover:bg-[#30363d] cursor-pointer py-1 px-2 rounded text-white">Left_Hand_Socket</div>
                        <div className="text-[10px] hover:bg-[#30363d] cursor-pointer py-1 px-2 rounded bg-[#bc8cff]/20 text-[#bc8cff] font-bold">Right_Weapon_Socket</div>
                        <div className="text-[10px] hover:bg-[#30363d] cursor-pointer py-1 px-2 rounded text-[#8b949e]">Head_Center</div>
                        <div className="text-[10px] hover:bg-[#30363d] cursor-pointer py-1 px-2 rounded text-[#8b949e]">Chest_Core_Glow</div>
                        <div className="text-[10px] hover:bg-[#30363d] cursor-pointer py-1 px-2 rounded text-[#8b949e]">Tail_Tip</div>
                     </div>
                   </div>

                   <div className="bg-[#0d1117] border border-[#30363d] rounded p-3">
                     <div className="flex justify-between items-center text-[11px] mb-2">
                        <span className="text-white font-bold">Attach Rules</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] mb-1">
                        <span className="text-[#8b949e]">Location Rule</span>
                        <select className="bg-[#161b22] border border-[#30363d] rounded text-white"><option>Snap to Target</option></select>
                     </div>
                     <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[#8b949e]">Rotation Rule</span>
                        <select className="bg-[#161b22] border border-[#30363d] rounded text-white"><option>Keep Relative</option></select>
                     </div>
                   </div>
                </div>
              )}

           </div>

           {/* Hardware Info Box */}
           <div className="p-4 border-t border-[#30363d] bg-[#0d1117] shrink-0">
             <div className="flex items-center justify-between text-[10px] text-[#8b949e] font-mono">
               <span className="flex items-center gap-1.5"><Cpu size={12}/> Compute Shader</span>
               <span className="text-[#3fb950]">Optimized</span>
             </div>
             <div className="w-full bg-[#161b22] h-1.5 rounded mt-2 overflow-hidden">
               <div className="bg-[#3fb950] h-full w-[15%]"></div>
             </div>
             <div className="flex justify-between mt-1 text-[9px] text-[#888]">
                <span>Cost: ~0.4ms</span>
                <span>Limits: 100k Max</span>
             </div>
           </div>

        </div>

        {/* Center Canvas Area relative to active tab */}
        <div className="flex-1 flex flex-col relative bg-[#090b0f] overflow-hidden">
           
           {/* Primary Render Preview Overlay Container */}
           <div className="absolute top-4 right-4 w-[400px] h-[300px] bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl z-40 flex flex-col overflow-hidden">
             <div className="h-7 bg-[#0d1117] flex justify-between items-center px-3 border-b border-[#30363d]">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-2"><Camera size={12} className="text-[#8b949e]"/> Live 3D Viewport</span>
             </div>
             <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1c22] to-[#040404]">
                {/* Simulated Particle Render Container Centered */}
                <div className="absolute inset-0 flex items-center justify-center">
                   
                   {/* Contextual Model Mockup (if socket tab) */}
                   {activeTab === 'model_socket' && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                        {/* Mock wireframe humanoid */ }
                        <svg width="200" height="250" viewBox="0 0 100 120" stroke="#58a6ff" strokeWidth="0.5" fill="none">
                           <circle cx="50" cy="20" r="10" />
                           <line x1="50" y1="30" x2="50" y2="70" />
                           <line x1="50" y1="40" x2="20" y2="50" />
                           <line x1="50" y1="40" x2="80" y2="50" />
                           <line x1="50" y1="70" x2="30" y2="110" />
                           <line x1="50" y1="70" x2="70" y2="110" />
                           <circle cx="80" cy="50" r="3" fill="#bc8cff" stroke="none" className="animate-pulse" />
                        </svg>
                     </div>
                   )}

                   {/* Map Placement Mockup (Grid) */}
                   {activeTab === 'map_placement' && (
                     <div className="absolute bottom-10 w-[300px] h-[100px] -rotate-12 skew-x-12 opacity-30 pointer-events-none" style={{
                         backgroundImage: 'linear-gradient(#3fb950 1px, transparent 1px), linear-gradient(90deg, #3fb950 1px, transparent 1px)',
                         backgroundSize: '20px 20px'
                     }}></div>
                   )}

                   {/* The actual particle visual FX Mock */}
                   <div className="relative pl-16">
                     <div className="absolute w-[180px] h-3 bg-gradient-to-r from-transparent via-[#58a6ff] to-[#bc8cff] blur-[4px] transform -rotate-[20deg] animate-pulse"></div>
                     <div className="absolute w-[200px] h-8 bg-gradient-to-r from-transparent via-[#f85149] to-transparent blur-[12px] transform -rotate-[20deg] opacity-70"></div>
                     <div className="absolute top-[-20px] left-[50px] w-20 h-20 rounded-full bg-[#f85149] blur-[30px] mix-blend-screen opacity-50"></div>
                     
                     {/* Floating Embers */}
                     <div className="absolute top-[-40px] left-[10px] w-1 h-1 bg-white rounded-full animate-bounce shadow-[0_0_10px_2px_#e3b341]"></div>
                     <div className="absolute top-[20px] left-[100px] w-1 h-1 bg-white rounded-full animate-ping shadow-[0_0_10px_2px_#58a6ff]"></div>
                     <div className="absolute top-[-30px] left-[150px] w-1.5 h-1.5 bg-[#e3b341] rounded-full shadow-[0_0_10px_2px_#f85149]"></div>
                   </div>
                </div>
             </div>
             <div className="h-6 bg-[#0d1117] flex items-center px-3 text-[9px] font-mono text-[#8b949e] justify-between border-t border-[#30363d]">
                <span>120 FPS</span>
                <span>Ast: VectorFlow</span>
                <span>Particles: ~45,000</span>
             </div>
           </div>

           {/* Context-Specific Main Area */}
           {activeTab === 'nodes' && (
             <div className="flex-1 w-full relative">
                {/* Dot Grid Background */}
                <div className="absolute inset-0 opacity-10" style={{
                   backgroundImage: 'radial-gradient(#8b949e 1px, transparent 1px)',
                   backgroundSize: '20px 20px'
                }}></div>

                <div className="absolute inset-0 z-10 overflow-hidden text-xs">
                   {/* Node 1: Event Spawner */}
                   <div className="absolute left-[100px] top-[150px] w-60 bg-[#161b22]/90 backdrop-blur border border-[#f85149] rounded shadow-lg flex flex-col">
                      <div className="h-7 bg-[#f85149]/20 border-b border-[#f85149]/30 flex items-center justify-between px-2 text-[11px] font-bold text-white uppercase tracking-wider">
                         Burst Spawner <Zap size={10} className="text-[#f85149]"/>
                      </div>
                      <div className="p-2 space-y-2">
                         <div className="flex justify-between text-[10px] text-[#8b949e]">
                            <span>Count</span>
                            <span className="text-white font-mono">15000</span>
                         </div>
                         <div className="flex justify-end mt-1 relative">
                            <span className="text-[10px] text-[#f85149] mr-3">Trigger Out</span>
                            <div className="w-3 h-3 absolute -right-3.5 top-0 rounded-full border-2 border-[#f85149] bg-[#0d1117]"></div>
                         </div>
                      </div>
                   </div>

                   {/* Connection Line */}
                   <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                      <path d="M 340 195 C 400 195, 450 250, 500 250" fill="none" stroke="#f85149" strokeWidth="2" strokeDasharray="4 2" />
                      <path d="M 740 290 C 780 290, 800 350, 850 350" fill="none" stroke="#bc8cff" strokeWidth="2" />
                   </svg>

                   {/* Node 2: GPU Particle Update */}
                   <div className="absolute left-[500px] top-[200px] w-60 bg-[#161b22]/90 backdrop-blur border border-[#bc8cff] rounded shadow-lg flex flex-col">
                      <div className="h-7 bg-[#bc8cff]/20 border-b border-[#bc8cff]/30 flex items-center px-2 text-[11px] font-bold text-white uppercase tracking-wider">
                         GPU Vector Update
                      </div>
                      <div className="absolute -left-1.5 top-[45px] w-3 h-3 rounded-full border-2 border-[#f85149] bg-[#161b22]"></div>
                      <div className="p-2 space-y-2">
                         <div className="bg-[#0d1117] p-1.5 rounded border border-[#30363d] cursor-pointer hover:border-[#58a6ff]">
                            <div className="text-[10px] text-[#58a6ff] font-bold mb-1">Velocity Turbulence</div>
                            <div className="text-[9px] text-[#8b949e]">Curl Noise scale 4.5</div>
                         </div>
                         <div className="flex justify-end mt-2 relative">
                            <span className="text-[10px] text-[#bc8cff] mr-3">Shader AST</span>
                            <div className="w-3 h-3 absolute -right-3.5 top-0.5 rounded-full border-2 border-[#bc8cff] bg-[#0d1117]"></div>
                         </div>
                      </div>
                   </div>

                    {/* Node 3: Additive Material */}
                    <div className="absolute left-[850px] top-[300px] w-60 bg-[#161b22]/90 backdrop-blur border border-[#3fb950] rounded shadow-lg flex flex-col">
                      <div className="h-7 bg-[#3fb950]/20 border-b border-[#3fb950]/30 flex items-center px-2 text-[11px] font-bold text-white uppercase tracking-wider">
                         Custom Material Blend
                      </div>
                      <div className="absolute -left-1.5 top-[45px] w-3 h-3 rounded-full border-2 border-[#bc8cff] bg-[#161b22]"></div>
                      <div className="p-2 text-[10px] text-[#8b949e]">
                        Additive blending, ignores depth buffer write.
                      </div>
                   </div>

                </div>
             </div>
           )}

           {activeTab === 'timeline' && (
              <div className="flex-1 w-full bg-[#0d1117] flex flex-col pb-10">
                 <div className="p-4 flex flex-col h-full overflow-y-auto">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Clock size={16} className="text-[#f85149]"/> Effect Sequencer</h3>
                    
                    <div className="flex gap-2">
                       {/* Labels */}
                       <div className="w-48 shrink-0 flex flex-col gap-2">
                          <div className="h-8 bg-[#161b22] border border-[#30363d] rounded flex items-center px-3 text-xs font-bold text-[#f85149]">1. Core Spark</div>
                          <div className="h-8 bg-[#161b22] border border-[#30363d] rounded flex items-center px-3 text-xs font-bold text-[#e3b341]">2. Ember Swarm</div>
                          <div className="h-8 bg-[#161b22] border border-[#30363d] rounded flex items-center px-3 text-xs font-bold text-[#58a6ff]">3. Shockwave</div>
                       </div>
                       
                       {/* Timeline Track */}
                       <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded relative overflow-hidden">
                          {/* Grid */}
                          <div className="absolute inset-0 w-full" style={{ backgroundImage: 'linear-gradient(90deg, #30363d 1px, transparent 1px)', backgroundSize: '50px 100%' }}></div>
                          
                          {/* Playhead */}
                          <div className="absolute top-0 bottom-0 left-[120px] w-[2px] bg-[#f85149] z-20">
                             <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-[#f85149] -ml-[3px] absolute top-0"></div>
                          </div>

                          {/* Track Blocks */}
                          <div className="absolute top-0 w-[80px] h-8 bg-[#f85149]/40 border border-[#f85149] rounded mt-[2px] left-[50px] z-10 flex items-center justify-center text-[10px] text-white">0.5s</div>
                          <div className="absolute top-10 w-[200px] h-8 bg-[#e3b341]/40 border border-[#e3b341] rounded mt-[4px] left-[80px] z-10 flex items-center justify-center text-[10px] text-white">2.0s loop</div>
                          <div className="absolute top-20 w-[40px] h-8 bg-[#58a6ff]/40 border border-[#58a6ff] rounded mt-[6px] left-[120px] z-10 flex items-center justify-center text-[10px] text-white">0.2s</div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {(activeTab === 'map_placement' || activeTab === 'model_socket') && (
              <div className="flex-1 w-full bg-[#0d1117] flex justify-center items-center">
                 <div className="text-center text-[#8b949e]">
                    <Target size={48} className="mx-auto mb-4 opacity-20" />
                    <h2 className="text-lg font-bold text-white mb-2">Configure Position Data</h2>
                    <p className="max-w-md text-xs">VFX coordinate parameters have been attached to the selected object bounding/sockets. Play the Simulation top-right to view localized rendering.</p>
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
}

const MaxIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);

