import React, { useState } from 'react';
import { 
  PersonStanding, Activity, Layers, Play, Pause, Square, 
  GitMerge, Video, Camera, Scissors, Maximize, AlertTriangle, 
  Smile, Share2, ZoomIn, ZoomOut, Zap, Save, RefreshCw
} from 'lucide-react';

export default function OmniAnimationStudio() {
  const [activeTab, setActiveTab] = useState('AnimGraph'); // AnimGraph, Retargeting, MoCap, Facial
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0E0E10] text-[#ccc] font-sans text-xs overflow-hidden select-none">
      
      {/* 💥 ELITE TOP NAVBAR 💥 */}
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1.5 rounded border border-[#333] shadow-inner items-center gap-2">
                   <PersonStanding size={18} className="text-[#3fb950] animate-pulse"/>
                   <span className="text-white font-black tracking-widest text-[12px] uppercase" style={{textShadow: '0 0 10px rgba(63,185,80,0.5)'}}>Omni Animation & MoCap Studio</span>
                   <span className="text-[#666] font-mono text-[9px] ml-2">Kinematic Edition</span>
                </div>
                <div className="h-6 w-px bg-[#333]"></div>
                <div className="flex text-[10px] font-mono gap-5 text-[#8b949e]">
                   <span className="flex items-center gap-1"><GitMerge size={12} className="text-[#e3b341]"/> IK Solvers: 4 Active</span>
                   <span className="flex items-center gap-1"><Layers size={12} className="text-[#58a6ff]"/> Bones: 124</span>
                   <span className="flex items-center gap-1"><Activity size={12} className="text-[#f85149]"/> FPS: 60/120</span>
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
                 <button className="px-5 py-1.5 bg-[#3fb950]/10 text-[#3fb950] font-black rounded shadow-[0_0_15px_rgba(63,185,80,0.2)] hover:bg-[#3fb950]/20 transition flex items-center gap-2 text-[11px] uppercase tracking-widest border border-[#3fb950]/50"><Save size={12}/> Bake Animation</button>
            </div>
         </div>

         <div className="flex px-2 bg-[#0a0a0a] border-t border-[#222]">
            <ModuleTab active={activeTab === 'AnimGraph'} onClick={() => setActiveTab('AnimGraph')} icon={<Layers size={12}/>} label="1. State Machine & AnimGraph" color="text-[#3fb950]"/>
            <ModuleTab active={activeTab === 'Retargeting'} onClick={() => setActiveTab('Retargeting')} icon={<GitMerge size={12}/>} label="2. IK Rig Retargeting" color="text-[#e3b341]"/>
            <ModuleTab active={activeTab === 'MoCap'} onClick={() => setActiveTab('MoCap')} label="3. LiveLink MoCap Stream" icon={<Activity size={12}/>} color="text-[#f85149]"/>
            <ModuleTab active={activeTab === 'Facial'} onClick={() => setActiveTab('Facial')} label="4. Facial & Lip-Sync AI" icon={<Smile size={12}/>}  color="text-[#58a6ff]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
         
         {/* SIDEBAR PARAMETERS */}
         <div className="w-[300px] bg-[#111] border-r border-[#222] flex flex-col z-20 shrink-0 shadow-lg">
             <div className="p-3 border-b border-[#222] bg-[#1a1a1a]">
                   <h3 className="text-[#888] font-bold text-[10px] tracking-widest uppercase mb-2">Properties Panel</h3>
                   {activeTab === 'AnimGraph' && <input type="text" placeholder="Search parameters..." className="w-full bg-[#0a0a0a] border border-[#333] p-1.5 rounded text-[10px] outline-none" />}
             </div>
             <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-4">
                 
                 {activeTab === 'AnimGraph' && (
                    <>
                       <PropertyGroup title="Blendspace 2D">
                          <SliderRow label="Speed" value="450.0" color="bg-[#3fb950]"/>
                          <SliderRow label="Direction" value="15.5°" color="bg-[#58a6ff]"/>
                       </PropertyGroup>
                       <PropertyGroup title="Transition Rule">
                          <div className="bg-[#050505] p-2 border border-[#333] rounded text-[10px] font-mono text-[#888]">
                             <span className="text-[#58a6ff]">if</span> (IsFalling == <span className="text-[#f85149]">true</span>)<br/>
                             &nbsp;&nbsp;<span className="text-[#e3b341]">EnterState</span>(FallLoop);
                          </div>
                       </PropertyGroup>
                       <button className="w-full bg-[#3fb950]/20 border border-[#3fb950] text-[#3fb950] py-2 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#3fb950]/30 transition">Compile AnimGraph</button>
                    </>
                 )}

                 {activeTab === 'Retargeting' && (
                    <>
                      <PropertyGroup title="Source & Target Rigs">
                         <div className="flex flex-col gap-2 mb-3">
                            <span className="text-[#888] text-[9px] uppercase font-bold">Source Skeleton</span>
                            <div className="bg-[#0a0a0a] border border-[#333] p-1.5 rounded text-[10px] text-white flex justify-between items-center">
                                Mixamo_Male_Base <button className="bg-[#222] px-2 py-0.5 rounded text-[#888] hover:text-white">Change</button>
                            </div>
                         </div>
                         <div className="flex flex-col gap-2">
                            <span className="text-[#888] text-[9px] uppercase font-bold">Target Skeleton</span>
                            <div className="bg-[#0a0a0a] border border-[#333] p-1.5 rounded text-[10px] text-white flex justify-between items-center">
                                UE5_Manny_Rig <button className="bg-[#222] px-2 py-0.5 rounded text-[#888] hover:text-white">Change</button>
                            </div>
                         </div>
                      </PropertyGroup>
                      <PropertyGroup title="IK Bone Chains">
                         <ChainMap target="Spine_L1" source="Spine" mapped={true}/>
                         <ChainMap target="Hand_L" source="LeftHand" mapped={true}/>
                         <ChainMap target="Index_01_L" source="LeftHandIndex1" mapped={false}/>
                         <ChainMap target="Foot_R" source="RightFoot" mapped={true}/>
                      </PropertyGroup>
                    </>
                 )}

                 {activeTab === 'MoCap' && (
                    <>
                      <PropertyGroup title="LiveLink Stream Status">
                         <div className="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded border border-[#333]">
                            <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse shadow-[0_0_8px_#3fb950]"></div>
                            <span className="text-white text-[11px] font-bold">Rokoko SmartSuit Pro II</span>
                         </div>
                         <div className="mt-2 text-[10px] text-[#888] font-mono grid grid-cols-2 gap-1">
                            <span>UDP Port:</span> <span className="text-white">14043</span>
                            <span>Latency:</span> <span className="text-[#3fb950]">4ms</span>
                            <span>Packets/s:</span> <span className="text-white">120</span>
                         </div>
                      </PropertyGroup>
                      <PropertyGroup title="Filters & Smoothing">
                         <SliderRow label="Jitter Reduction" value="High" color="bg-[#e3b341]"/>
                         <SliderRow label="Foot IK Fix" value="Enabled" color="bg-[#58a6ff]"/>
                      </PropertyGroup>
                      <button className="w-full bg-[#f85149] text-black py-2 rounded text-[10px] font-bold uppercase tracking-wider hover:brightness-110 transition flex justify-center items-center gap-2"><div className="w-2 h-2 bg-black rounded-full"></div> Start Global Recording</button>
                    </>
                 )}

                 {activeTab === 'Facial' && (
                    <>
                       <PropertyGroup title="ARKit / Metahuman Blendshapes">
                          <SliderRow label="JawOpen" value="0.85" color="bg-[#bc8cff]"/>
                          <SliderRow label="MouthSmile_L" value="0.60" color="bg-[#bc8cff]"/>
                          <SliderRow label="MouthSmile_R" value="0.62" color="bg-[#bc8cff]"/>
                          <SliderRow label="EyeBlink_L" value="0.0" color="bg-[#bc8cff]"/>
                          <SliderRow label="EyeBlink_R" value="0.0" color="bg-[#bc8cff]"/>
                       </PropertyGroup>
                       <PropertyGroup title="AI Audio-to-LipSync">
                          <p className="text-[10px] text-[#888] mb-3">Feed an audio file to extract phonemes and map them automatically to facial rig controllers.</p>
                          <div className="w-full h-16 border border-dashed border-[#555] rounded flex items-center justify-center text-[#888] hover:border-[#bc8cff] hover:text-[#bc8cff] cursor-pointer transition">
                              <span className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-2"><Video size={12}/> Drop Audio (.WAV)</span>
                          </div>
                       </PropertyGroup>
                    </>
                 )}

             </div>
         </div>

         {/* MAIN VIEWPORT */}
         <div className="flex-1 bg-[#111] relative flex flex-col">
             
             {/* 3D Viewport OR Node Graph View */}
             <div className="flex-[0.65] bg-[#050505] relative overflow-hidden flex items-center justify-center border-b border-[#333]">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px', transform: 'perspective(1000px) rotateX(60deg) scale(3) translateY(-100px)' }}></div>

                {/* State Machine Node Graph Overlay for AnimGraph */}
                {activeTab === 'AnimGraph' && (
                   <div className="absolute inset-0 bg-[#1a1a1c] z-10" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                      <GraphNode x="100" y="100" title="Locomotion (State)" active={true} />
                      <GraphNode x="350" y="100" title="Jump (State)" active={false} />
                      <GraphNode x="350" y="220" title="FallLoop (State)" active={false} />
                      <GraphNode x="100" y="220" title="Land (State)" active={false} />
                      
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                         {/* Transitions */}
                         <path d="M 220 120 L 350 120" stroke="#888" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                         <path d="M 410 140 L 410 220" stroke="#888" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                         <path d="M 350 240 L 220 240" stroke="#888" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                         <path d="M 160 220 L 160 140" stroke="#888" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                         <defs>
                           <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                             <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
                           </marker>
                         </defs>
                      </svg>
                   </div>
                )}

                {/* 3D Skeletal Visualization (Retargeting, MoCap, Facial) */}
                {activeTab !== 'AnimGraph' && (
                   <div className="relative z-10 flex flex-col items-center">
                       {activeTab === 'Facial' ? (
                          // Facial Close-up mock
                          <div className="w-64 h-64 border border-[#333] rounded-3xl bg-[#111] overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                             <div className="absolute top-1/3 left-1/4 w-4 h-2 bg-[#58a6ff] rounded-full shadow-[0_0_10px_#58a6ff]"></div>
                             <div className="absolute top-1/3 right-1/4 w-4 h-2 bg-[#58a6ff] rounded-full shadow-[0_0_10px_#58a6ff]"></div>
                             <div className={`absolute bottom-1/4 left-1/4 right-1/4 h-6 bg-[#222] border-2 border-[#111] rounded-full transition-all ${isPlaying ? 'h-10 rounded-3xl' : ''}`}></div>
                             <div className="absolute inset-0 border-[4px] border-[#58a6ff]/20 rounded-3xl pointer-events-none"></div>
                          </div>
                       ) : (
                          // Full Body Skeletal mock
                          <div className={`relative ${isPlaying ? 'animate-bounce' : ''}`}>
                             <div className="w-16 h-16 bg-[#e3b341] rounded-full blur-[2px] opacity-80 mb-2 shadow-[0_0_20px_#e3b341]"></div> {/* Head */}
                             <div className="w-2 h-32 bg-[#fff] mx-auto opacity-50 relative flex justify-center"> {/* Spine */}
                                <div className="absolute top-4 w-48 h-2 bg-[#fff] opacity-50"></div> {/* Arms */}
                                <div className="absolute bottom-0 w-32 h-32 border-t-2 border-l-2 border-r-2 border-[#fff] opacity-50 rotate-45 transform origin-top translate-y-2"></div> {/* Legs Fake */}
                             </div>
                          </div>
                       )}
                   </div>
                )}

                {/* Viewport UI Overlay */}
                <div className="absolute top-2 left-2 flex gap-2 z-20">
                    <span className="bg-[#000] text-[#888] px-2 py-1 text-[9px] font-bold border border-[#333] rounded uppercase">Lit</span>
                    <span className="bg-[#000] text-[#888] px-2 py-1 text-[9px] font-bold border border-[#333] rounded uppercase">Show Bones</span>
                </div>
             </div>

             {/* TIMELINE / SEQUENCER AREA */}
             <div className="flex-[0.35] bg-[#141414] border-t border-[#000] relative flex flex-col">
                <div className="h-6 w-full bg-[#111] border-b border-[#333] flex items-center px-4 justify-between">
                   <div className="flex gap-4 text-[#888] font-mono text-[9px] tracking-wider">
                      <span>FPS: 60</span> <span>FRAMES: 0 / 240</span>
                   </div>
                   <div className="flex gap-2">
                       <ZoomOut size={12} className="text-[#888] hover:text-white cursor-pointer"/>
                       <ZoomIn size={12} className="text-[#888] hover:text-white cursor-pointer"/>
                   </div>
                </div>
                
                <div className="flex flex-1 overflow-hidden">
                   {/* Track Headers */}
                   <div className="w-[200px] border-r border-[#222] bg-[#1a1a1a] flex flex-col overflow-y-auto">
                      <div className="px-2 py-1.5 border-b border-[#333] text-[10px] font-bold text-[#ccc]">Root Motion</div>
                      <div className="px-2 py-1.5 border-b border-[#333] text-[10px] font-bold text-[#ccc]">Pelvis</div>
                      <div className="px-2 py-1.5 border-b border-[#333] text-[10px] font-bold text-[#ccc]">Spine_01</div>
                      <div className="px-2 py-1.5 border-b border-[#333] text-[10px] font-bold text-[#ccc] pl-6 text-[#888]">Rotation (Pitch)</div>
                      <div className="px-2 py-1.5 border-b border-[#333] text-[10px] font-bold text-[#ccc] pl-6 text-[#888]">Location (Z)</div>
                   </div>
                   {/* Tracks Area */}
                   <div className="flex-1 bg-[#111] relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 100%' }}>
                       
                       {/* Playhead */}
                       <div className={`absolute top-0 bottom-0 w-[1px] bg-[#f85149] z-20 pointer-events-none left-[30%] ${isPlaying ? 'animate-[pulse_1s_infinite]' : ''}`}>
                          <div className="absolute top-0 -translate-x-[45%] w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#f85149]"></div>
                       </div>

                       {/* Fake Keyframes */}
                       <div className="absolute top-[8px] left-[10%] w-2 h-2 bg-[#e3b341] rounded-sm transform rotate-45"></div>
                       <div className="absolute top-[8px] left-[50%] w-2 h-2 bg-[#e3b341] rounded-sm transform rotate-45"></div>
                       
                       <div className="absolute top-[35px] left-[20%] w-2 h-2 bg-[#e3b341] rounded-sm transform rotate-45"></div>
                       <div className="absolute top-[35px] left-[80%] w-2 h-2 bg-[#e3b341] rounded-sm transform rotate-45"></div>

                       {/* Fake Spline Curve */}
                       <svg className="absolute top-[80px] w-full h-[80px] pointer-events-none stroke-[#58a6ff] stroke-1 fill-none">
                          <path d="M 0 40 Q 80 10, 150 40 T 300 40 T 450 40" />
                       </svg>
                   </div>
                </div>
             </div>

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

function PropertyGroup({ title, children }) {
   return (
      <div className="mb-4">
         <div className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 border-b border-[#2d2d2d] pb-1">{title}</div>
         <div className="flex flex-col gap-2">
            {children}
         </div>
      </div>
   );
}

function SliderRow({ label, value, color }) {
   return (
      <div className="flex flex-col gap-1">
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

function ChainMap({ source, target, mapped }) {
   return (
      <div className="flex items-center justify-between bg-[#1a1a1a] p-1.5 rounded border border-[#333] text-[10px] mb-1">
         <div className="text-[#ccc] w-1/3 truncate font-mono">{source}</div>
         <div className="text-[#555]"><Share2 size={10}/></div>
         <div className={`${mapped ? 'text-[#3fb950]' : 'text-[#f85149]'} w-1/3 truncate text-right font-mono font-bold`}>{mapped ? target : 'Unmapped'}</div>
      </div>
   );
}

function GraphNode({ x, y, title, active }) {
   return (
      <div className={`absolute bg-[#111] border-[2px] rounded-full shadow-lg flex items-center justify-center w-[120px] h-[40px] cursor-pointer transition-colors ${active ? 'border-[#3fb950] text-[#3fb950]' : 'border-[#333] text-[#888] hover:border-[#555] hover:text-[#ccc]'}`} style={{ left: `${x}px`, top: `${y}px` }}>
         <div className="font-bold text-[10px] uppercase tracking-wider">{title}</div>
      </div>
   );
}
