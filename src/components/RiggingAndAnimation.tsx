import React, { useState } from 'react';
import { Bone, UserSquare, Play, Square, SkipBack, SkipForward, Maximize, Activity, Scissors, Plus, Settings2, Compass, Circle, Download, Move, ZoomIn, Eye, SlidersHorizontal, Lock, CheckSquare, XSquare, GripHorizontal, ChevronDown, PenTool, Link, Link2Off } from 'lucide-react';

export default function RiggingAndAnimation() {
  const [activeTab, setActiveTab] = useState('Rigging');
  const [isPlaying, setIsPlaying] = useState(false);

  const bones = [
    { id: 'Root', depth: 0, children: 3 },
    { id: 'Pelvis', depth: 1, children: 3 },
    { id: 'Spine_01', depth: 2, children: 1 },
    { id: 'Spine_02', depth: 3, children: 3 },
    { id: 'Neck', depth: 4, children: 1 },
    { id: 'Head', depth: 5, children: 0 },
    { id: 'UpperArm_L', depth: 4, children: 1 },
    { id: 'LowerArm_L', depth: 5, children: 1 },
    { id: 'Hand_L', depth: 6, children: 0 },
    { id: 'Thigh_L', depth: 2, children: 1 },
    { id: 'Calf_L', depth: 3, children: 1 },
    { id: 'Foot_L', depth: 4, children: 0 },
  ];

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#111111] text-[#999999] font-sans text-xs overflow-hidden select-none">
      {/* Top Menu Bar */}
      <div className="flex items-center justify-between border-b border-[#222] bg-[#1a1a1a] px-3 py-1.5 shrink-0 shadow-md">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#fb8500] text-black rounded text-[10px] font-black shadow uppercase tracking-widest"><Bone size={14} /> Kinematics Pro</div>
            <div className="flex bg-[#222] rounded border border-[#333] overflow-hidden">
               <button onClick={() => setActiveTab('Rigging')} className={`px-4 py-1.5 font-bold transition-colors ${activeTab === 'Rigging' ? 'bg-[#333] text-white shadow-inner' : 'hover:bg-[#2a2a2a] text-[#888]'}`}>Rigging / Skinning</button>
               <button onClick={() => setActiveTab('Animation')} className={`px-4 py-1.5 font-bold transition-colors ${activeTab === 'Animation' ? 'bg-[#333] text-white shadow-inner' : 'hover:bg-[#2a2a2a] text-[#888]'}`}>Animation Timeline</button>
               <button onClick={() => setActiveTab('StateMachine')} className={`px-4 py-1.5 font-bold transition-colors ${activeTab === 'StateMachine' ? 'bg-[#333] text-white shadow-inner' : 'hover:bg-[#2a2a2a] text-[#888]'}`}>State Machine (AnimGraph)</button>
            </div>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Left Hierarchy / Outliner */}
         <div className="w-64 bg-[#1a1a1a] border-r border-[#222] flex flex-col shrink-0">
            <div className="px-3 py-2 bg-[#222] border-b border-[#333] font-bold text-white uppercase tracking-wider text-[10px] flex justify-between items-center shadow-sm">
               <span className="flex items-center gap-2"><UserSquare size={14} className="text-[#fb8500]"/> Skeleton Hierarchy</span>
               <div className="flex gap-2">
                  <PlusIcon size={12} className="cursor-pointer hover:text-white" title="Add Bone"/>
                  <Link size={12} className="cursor-pointer hover:text-white" title="Parent (P)"/>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
               {bones.map(b => (
                  <div key={b.id} className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer border ${b.id === 'Pelvis' || b.id === 'Spine_02' ? 'bg-[#fb8500]/20 border-[#fb8500]/50 text-[#fb8500]' : 'border-transparent hover:bg-[#222] text-[#ccc]'}`} style={{ paddingLeft: `${(b.depth * 12) + 8}px` }}>
                     {b.children > 0 ? <ChevronDown size={12}/> : <div className="w-3"></div>}
                     <Bone size={12} className={b.id === 'Pelvis' ? 'text-white' : 'opacity-70'}/>
                     <span className="font-bold text-[11px] truncate flex-1">{b.id}</span>
                     {b.id === 'Pelvis' && <span className="bg-red-500 text-white px-1 rounded text-[8px] font-mono leading-tight">IK Root</span>}
                     {b.id === 'Foot_L' && <span className="bg-[#0070d2] text-white px-1 rounded text-[8px] font-mono leading-tight">IK Target</span>}
                  </div>
               ))}
            </div>
            
            {/* Tool Selection for Rigging Tab */}
            {activeTab === 'Rigging' && (
               <div className="h-48 border-t border-[#333] bg-[#222] flex flex-col">
                  <div className="px-3 py-1.5 bg-[#1a1a1a] border-b border-[#333] font-bold text-[#888] uppercase tracking-wider text-[10px]">Weight Painting Tools</div>
                  <div className="p-2 grid grid-cols-2 gap-2">
                     <button className="flex items-center justify-center gap-2 bg-[#333] hover:bg-[#444] border border-[#555] rounded py-1.5 text-white shadow-inner"><Brush size={12}/> Paint</button>
                     <button className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#333] border border-[#333] rounded py-1.5 text-[#888]"><Activity size={12}/> Blur</button>
                     <button className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#333] border border-[#333] rounded py-1.5 text-[#888]"><EraserIcon size={12}/> Subtract</button>
                     <button className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#333] border border-[#333] rounded py-1.5 text-[#888]"><Maximize size={12}/> Smooth</button>
                  </div>
                  <div className="px-4 py-2 space-y-2 text-[10px]">
                     <div className="flex justify-between items-center"><span>Weight Value</span><span className="text-white font-mono bg-black px-1 rounded border border-[#333]">1.000</span></div>
                     <input type="range" min="0" max="100" defaultValue="100" className="w-full accent-[#fb8500]"/>
                     <div className="flex justify-between items-center pt-2"><span>Radius</span><span className="text-white font-mono bg-black px-1 rounded border border-[#333]">25px</span></div>
                     <input type="range" min="1" max="100" defaultValue="25" className="w-full accent-[#0070d2]"/>
                  </div>
               </div>
            )}
         </div>

         {/* Center Viewport */}
         <div className="flex-1 bg-[#151515] relative overflow-hidden flex flex-col justify-between shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-10 text-[9px] font-mono mix-blend-difference text-white">
               <span>FPS: 60.0</span>
               <span>Polys: 14,302</span>
               <span>Bones: 68</span>
               <span className="text-[#fb8500] mt-2 flex items-center gap-1 font-bold">Forward Kinematics (FK) Active</span>
            </div>

            <div className="absolute top-4 right-4 flex bg-[#222] border border-[#333] rounded text-[10px] shadow-lg z-10 overflow-hidden">
               <button className="px-3 py-1.5 hover:bg-[#333] border-r border-[#444] transition-colors"><Maximize size={12}/></button>
               <button className="px-3 py-1.5 hover:bg-[#333] border-r border-[#444] transition-colors">Show Bones</button>
               <button className="px-3 py-1.5 hover:bg-[#333] border-r border-[#444] transition-colors">X-Ray</button>
               <button className="px-3 py-1.5 bg-[#444] text-white font-bold transition-colors">Lit</button>
            </div>

            {/* Grid Simulation */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none transform perspective-1000 rotateX-60 scale-[3.0] origin-center translate-y-1/4"></div>

            {/* Simulated Humanoid Character Mesh & Bones */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="relative w-64 h-[400px] flex items-center justify-center transform perspective-1000 rotateY-12 scale-[1.2]">
                  {/* Fake Character Silhouette painted with weights */}
                  <svg className="absolute inset-0 w-full h-full drop-shadow-2xl" viewBox="0 0 100 200" preserveAspectRatio="xMidYMid meet">
                     {activeTab === 'Rigging' ? (
                        <path d="M40,20 C40,10 60,10 60,20 C60,30 40,30 40,20 M30,40 L70,40 L80,100 L70,100 L65,50 L55,50 L55,180 L45,180 L45,50 L35,50 L30,100 L20,100 Z" fill="url(#weightGradient)" stroke="#444" strokeWidth="1"/>
                     ) : (
                        <path d="M40,20 C40,10 60,10 60,20 C60,30 40,30 40,20 M30,40 L65,35 L85,90 L75,95 L60,50 L50,60 L60,180 L50,180 L40,80 L25,60 L15,110 L5,105 Z" fill="#2d2d2d" stroke="#555" strokeWidth="2"/>
                     )}
                     <defs>
                        {/* Heatmap gradient simulation for weight painting */}
                        <radialGradient id="weightGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                           <stop offset="0%" stopColor="red" />
                           <stop offset="50%" stopColor="yellow" />
                           <stop offset="80%" stopColor="green" />
                           <stop offset="100%" stopColor="blue" />
                        </radialGradient>
                     </defs>
                  </svg>
                  
                  {/* Fake Skeleton Overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-80" viewBox="0 0 100 200" preserveAspectRatio="xMidYMid meet">
                     <circle cx="50" cy="110" r="5" fill="#fb8500" /> {/* Pelvis */}
                     <line x1="50" y1="110" x2="50" y2="80" stroke="#fb8500" strokeWidth="2" /> {/* Spine 1 */}
                     <circle cx="50" cy="80" r="4" fill="#fb8500" /> 
                     <line x1="50" y1="80" x2="50" y2="40" stroke="white" strokeWidth="2" /> {/* Spine 2 */}
                     <circle cx="50" cy="40" r="4" fill="white" />
                     
                     <line x1="50" y1="40" x2="65" y2="50" stroke="white" strokeWidth="2" /> {/* Arm R */}
                     <line x1="65" y1="50" x2="75" y2="90" stroke="white" strokeWidth="2" />
                     <circle cx="75" cy="90" r="3" fill="#0070d2" />
                     
                     <line x1="50" y1="40" x2="35" y2="50" stroke="white" strokeWidth="2" /> {/* Arm L */}
                     <line x1="35" y1="50" x2="25" y2="95" stroke="white" strokeWidth="2" />
                     <circle cx="25" cy="95" r="3" fill="white" />
                     
                     <line x1="50" y1="110" x2="40" y2="150" stroke="white" strokeWidth="2" /> {/* Leg L */}
                     <line x1="40" y1="150" x2="40" y2="190" stroke="white" strokeWidth="2" />
                     <circle cx="40" cy="190" r="3" fill="#0070d2" />
                     
                     <line x1="50" y1="110" x2="60" y2="145" stroke="white" strokeWidth="2" /> {/* Leg R */}
                     <line x1="60" y1="145" x2="55" y2="185" stroke="white" strokeWidth="2" />
                     <circle cx="55" cy="185" r="3" fill="white" />
                  </svg>
                  
                  {/* Transform Gizmo on selected bone */}
                  <div className="absolute top-[48%] left-[45%] w-16 h-16 pointer-events-auto cursor-ns-resize">
                     <div className="w-full h-px bg-red-500 absolute top-1/2 left-0 transform -translate-y-1/2 rotate-12"></div>
                     <div className="w-px h-full bg-[#3fb950] absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                     <div className="w-full h-px bg-[#0070d2] absolute top-1/2 left-0 transform -translate-y-1/2 rotate-[-45deg]"></div>
                     <div className="w-2 h-2 rounded-full border-2 border-white bg-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_5px_black]"></div>
                  </div>
               </div>
            </div>

            {/* Viewport Toolbar Bottom */}
            {activeTab === 'Animation' && (
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center bg-[#222]/90 backdrop-blur border border-[#444] rounded-full p-1 shadow-2xl z-20">
                  <button className="p-2 text-[#ccc] hover:text-white rounded-full transition-colors"><SkipBack size={16} fill="currentColor"/></button>
                  <button onClick={() => setIsPlaying(!isPlaying)} className={`p-2.5 mx-1 rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${isPlaying ? 'bg-[#fb8500]' : 'bg-[#0070d2]'}`}>
                     {isPlaying ? <Square size={16} fill="currentColor"/> : <Play size={16} fill="currentColor" className="ml-0.5"/>}
                  </button>
                  <button className="p-2 text-[#ccc] hover:text-white rounded-full transition-colors"><SkipForward size={16} fill="currentColor"/></button>
                  <div className="w-px h-6 bg-[#444] mx-2"></div>
                  <button className="p-2 text-red-500 hover:text-red-400 rounded-full transition-colors flex items-center gap-1 font-bold text-[10px] mx-1">
                     <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_5px_red]"></div> Key
                  </button>
                  <button className="p-2 text-[#fb8500] hover:text-[#ffaa00] rounded-full transition-colors flex items-center gap-1 font-bold text-[10px] mx-1">
                     <Circle size={12}/> Auto IK
                  </button>
               </div>
            )}
         </div>

         {/* Right Properties Panel */}
         <div className="w-72 bg-[#1a1a1a] border-l border-[#222] flex flex-col shrink-0">
            <div className="px-3 py-2 bg-[#222] border-b border-[#333] font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-2 shadow-sm">
               <Settings2 size={14} className="text-[#0070d2]"/> Inspector
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar text-[10px]">
               <div className="bg-[#222] border border-[#333] rounded overflow-hidden">
                  <div className="bg-[#2a2a2a] px-2 py-1.5 font-bold text-white border-b border-[#333] flex justify-between">Selected Bone <span className="font-mono text-[#fb8500]">Spine_02</span></div>
                  <div className="p-2 grid grid-cols-[1fr,2fr] gap-x-2 gap-y-3 items-center">
                     <span className="text-[#888]">Location X</span>
                     <input type="number" defaultValue="0.000" className="w-full bg-[#111] border border-[#444] rounded px-2 py-0.5 text-white font-mono text-right outline-none hover:border-[#fb8500] focus:border-[#fb8500]"/>
                     <span className="text-[#888]">Location Y</span>
                     <input type="number" defaultValue="45.102" className="w-full bg-[#111] border border-[#444] rounded px-2 py-0.5 text-white font-mono text-right outline-none hover:border-[#fb8500] focus:border-[#fb8500]"/>
                     <span className="text-[#888]">Location Z</span>
                     <input type="number" defaultValue="-5.000" className="w-full bg-[#111] border border-[#444] rounded px-2 py-0.5 text-white font-mono text-right outline-none hover:border-[#fb8500] focus:border-[#fb8500]"/>
                     
                     <span className="text-[#888]">Rotation X</span>
                     <input type="number" defaultValue="15.00" className="w-full bg-[#111] border border-[#444] rounded px-2 py-0.5 text-[#fb8500] font-mono font-bold text-right outline-none border-[#fb8500]/50"/>
                     <span className="text-[#888]">Rotation Y</span>
                     <input type="number" defaultValue="0.00" className="w-full bg-[#111] border border-[#444] rounded px-2 py-0.5 text-white font-mono text-right outline-none hover:border-[#fb8500] focus:border-[#fb8500]"/>
                     <span className="text-[#888]">Rotation Z</span>
                     <input type="number" defaultValue="0.00" className="w-full bg-[#111] border border-[#444] rounded px-2 py-0.5 text-white font-mono text-right outline-none hover:border-[#fb8500] focus:border-[#fb8500]"/>
                  </div>
               </div>

               <div className="bg-[#222] border border-[#333] rounded overflow-hidden">
                  <div className="bg-[#2a2a2a] px-2 py-1.5 font-bold text-white border-b border-[#333]">IK Constraints</div>
                  <div className="p-2 space-y-2">
                     <button className="w-full py-1.5 bg-[#333] hover:bg-[#444] text-[#ccc] border border-[#444] rounded font-bold transition-colors flex items-center justify-center gap-2">
                        <PlusIcon size={12}/> Add Constraint
                     </button>
                     <div className="bg-[#111] border border-[#444] rounded p-2 text-[#ccc]">
                        <div className="flex justify-between font-bold text-white mb-1"><span className="flex items-center gap-1"><Link size={10} className="text-[#0070d2]"/> FABRIK Solver</span><XSquare size={12} className="cursor-pointer hover:text-red-500 opacity-50"/></div>
                        <div className="flex justify-between items-center mt-2"><span>Target</span><span className="font-mono bg-[#222] px-1 rounded text-white border border-[#444]">Hand_L_IK</span></div>
                        <div className="flex justify-between items-center mt-1"><span>Pole Vector</span><span className="font-mono bg-[#222] px-1 rounded text-white border border-[#444]">Elbow_L_Pole</span></div>
                        <div className="flex justify-between items-center mt-1"><span>Iterations</span><span className="font-mono text-white">10</span></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Bottom Timeline Dope Sheet or Curve Editor */}
      {activeTab === 'Animation' && (
         <div className="h-64 border-t border-[#333] bg-[#1a1a1a] flex flex-col shrink-0">
            <div className="flex bg-[#222] border-b border-[#333] shrink-0 font-bold text-[10px] text-[#ccc]">
               <button className="px-4 py-1.5 bg-[#333] text-white border-r border-[#444]">Dope Sheet</button>
               <button className="px-4 py-1.5 hover:bg-[#2a2a2a] border-r border-[#444]">Graph Editor (Curves)</button>
               <button className="px-4 py-1.5 hover:bg-[#2a2a2a]">Non-Linear Animation (NLA)</button>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
               {/* Channels */}
               <div className="w-64 border-r border-[#333] bg-[#222] overflow-y-auto custom-scrollbar">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#fb8500] border-b border-[#333] sticky top-0 bg-[#222] z-10 shadow-sm flex items-center gap-1"><UserSquare size={12}/> Run_Forward_Loop.anim</div>
                  
                  <div className="px-2 py-1 border-b border-[#333] flex justify-between items-center group cursor-pointer hover:bg-[#2a2a2a]">
                     <span className="text-[10px] text-white flex items-center gap-1 ml-2"><ChevronDown size={10}/> Pelvis</span>
                     <Eye size={10} className="opacity-0 group-hover:opacity-100 text-[#888] hover:text-white"/>
                  </div>
                  <div className="px-2 py-1 border-b border-[#333] flex justify-between items-center group cursor-pointer hover:bg-[#2a2a2a] bg-[#111]">
                     <span className="text-[10px] text-[#fb8500] ml-6">Location</span>
                  </div>
                  <div className="px-2 py-1 border-b border-[#333] flex justify-between items-center group cursor-pointer hover:bg-[#2a2a2a] bg-[#111]">
                     <span className="text-[10px] text-[#fb8500] ml-6 font-bold bg-[#fb8500]/20 rounded px-1 border border-[#fb8500]/50 shadow-[inset_0_0_5px_rgba(251,133,0,0.5)]">Rotation</span>
                  </div>
                  
                  <div className="px-2 py-1 border-b border-[#333] flex justify-between items-center group cursor-pointer hover:bg-[#2a2a2a]">
                     <span className="text-[10px] text-white flex items-center gap-1 ml-2"><ChevronDown size={10}/> Spine_01</span>
                     <Eye size={10} className="opacity-0 group-hover:opacity-100 text-[#888] hover:text-white"/>
                  </div>
                  <div className="px-2 py-1 border-b border-[#333] flex justify-between items-center group cursor-pointer hover:bg-[#2a2a2a] bg-[#111]">
                     <span className="text-[10px] text-[#888] ml-6">Rotation</span>
                  </div>
               </div>

               {/* Keyframe Grid */}
               <div className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[linear-gradient(90deg,#222_1px,transparent_1px)] bg-[size:15px_100%] custom-scrollbar">
                  {/* Timeline Ruler */}
                  <div className="h-6 border-b border-[#444] bg-[#1a1a1a] sticky top-0 z-20 flex text-[9px] font-mono text-[#888] items-end pointer-events-none">
                     {Array.from({length: 60}).map((_, i) => (
                        <div key={i} className="min-w-[15px] h-full border-l border-[#444]/50 flex flex-col justify-end pl-0.5 shrink-0 relative">
                           {i % 5 === 0 && <span className="absolute top-0 opacity-80">{i}</span>}
                           {i % 5 === 0 ? <div className="w-[1px] h-2 bg-[#888]"></div> : <div className="w-[1px] h-1 bg-[#555]"></div>}
                        </div>
                     ))}
                  </div>

                  {/* Scrubber */}
                  <div className="absolute top-0 bottom-0 left-[150px] w-px bg-white z-30 shadow-[0_0_5px_white] pointer-events-none">
                     <div className="w-2 h-3 bg-white absolute top-0 -left-1 opacity-80"></div>
                  </div>

                  {/* Keyframes rows */}
                  <div className="h-[21px] border-b border-[#333]/50 relative">
                     <div className="absolute top-1/2 -translate-y-1/2 left-[15px] w-2 h-2 rotate-45 bg-[#ccc] border border-[#222] shadow-[0_0_3px_black]"></div>
                     <div className="absolute top-1/2 -translate-y-1/2 left-[150px] w-2 h-2 rotate-45 bg-[#ccc] border border-[#222]"></div>
                     <div className="absolute top-1/2 -translate-y-1/2 left-[300px] w-2 h-2 rotate-45 bg-[#ccc] border border-[#222]"></div>
                  </div>
                  <div className="h-[21px] border-b border-[#333]/50 relative bg-[#111]"></div>
                  <div className="h-[21px] border-b border-[#333]/50 relative bg-[#111]">
                     {/* Orange active keyframes */}
                     <div className="absolute top-1/2 -translate-y-1/2 left-[15px] w-2 h-2 rotate-45 bg-[#fb8500] shadow-[0_0_5px_#fb8500]"></div>
                     <div className="absolute top-1/2 -translate-y-1/2 left-[150px] w-2 h-2 rotate-45 bg-[#fb8500] shadow-[0_0_5px_#fb8500]"></div>
                     <div className="absolute top-1/2 -translate-y-1/2 left-[300px] w-2 h-2 rotate-45 bg-yellow-400 border border-white shadow-[0_0_8px_yellow] z-10 scale-125"></div>
                     {/* Tween segment visualizer */}
                     <div className="absolute top-[9px] left-[20px] w-[128px] h-[3px] bg-[#fb8500]/20 pointer-events-none"></div>
                     <div className="absolute top-[9px] left-[155px] w-[128px] h-[3px] bg-[#fb8500]/20 pointer-events-none"></div>
                  </div>
                  <div className="h-[21px] border-b border-[#333]/50 relative"></div>
                  <div className="h-[21px] border-b border-[#333]/50 relative bg-[#111]">
                     <div className="absolute top-1/2 -translate-y-1/2 left-[75px] w-2 h-2 rotate-45 bg-[#ccc] border border-[#222]"></div>
                     <div className="absolute top-1/2 -translate-y-1/2 left-[225px] w-2 h-2 rotate-45 bg-[#ccc] border border-[#222]"></div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

function PlusIcon({size, className, title}: {size: number, className: string, title?: string}) {
   return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>{title}</title><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}

function EraserIcon({size, className}: {size: number, className?: string}) {
   return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m13.3 9 5.5 5.5"/></svg>
}
