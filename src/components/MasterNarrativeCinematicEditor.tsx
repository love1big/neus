import React, { useState } from 'react';
import { Film, Clapperboard, Play, Pause, SkipBack, SkipForward, FastForward, Video, Mic, Volume2, GitBranch, Layers, MonitorPlay, Settings, AlignLeft, Flag, CheckSquare, Clock, Plus, Scissors, Maximize, Target, Key } from 'lucide-react';

export default function MasterNarrativeCinematicEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState('00:01:24:15');
  const [activeTab, setActiveTab] = useState<'timeline' | 'dope_sheet' | 'story_flags'>('timeline');

  // Hardcoded traditional sequences
  const tracks = [
    { id: 'cam1', type: 'camera', name: 'Main Shot - 35mm Lens', color: 'bg-blue-500', icon: <Video size={14} /> },
    { id: 'char1', type: 'animation', name: 'Hero_Idle_To_Combat', color: 'bg-orange-500', icon: <WalkingIcon /> },
    { id: 'char2', type: 'animation', name: 'Villain_Monologue_Anim', color: 'bg-red-500', icon: <WalkingIcon /> },
    { id: 'audio1', type: 'audio', name: 'V/O: "You cannot stop the..."', color: 'bg-purple-500', icon: <Mic size={14} /> },
    { id: 'audio2', type: 'audio', name: 'SFX: Sword Draw', color: 'bg-pink-500', icon: <Volume2 size={14} /> },
    { id: 'logic', type: 'logic', name: 'Condition: Set Checkpoint', color: 'bg-green-500', icon: <Flag size={14} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0d0d11] text-white font-sans overflow-hidden">
      {/* Top Protocol Bar: Professional Non-AI Cutscene Editor */}
      <div className="px-4 py-3 border-b border-[#222] bg-[#15151a] flex items-center justify-between shrink-0 shadow-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-b from-[#333] to-[#111] border border-[#444] rounded flex items-center justify-center shadow-inner">
            <Film size={20} className="text-[#aaa]" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-[#eee] flex items-center gap-2">
              Master Narrative & Cinematic Director <span className="px-1.5 py-0.5 bg-[#f85149] text-white text-[9px] rounded">NON-AI MANUAL PRO SUITE</span>
            </h2>
            <p className="text-[#888] text-[10px] font-mono">FRAME-PER-FRAME DOPE SHEET • STORY GRAPH STATE CONTINUITY • VST MIXER</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-4">
           <div className="flex bg-[#0a0a0a] border border-[#333] rounded overflow-hidden">
             <button className="px-3 py-1.5 text-xs font-bold font-mono text-[#888] hover:text-white hover:bg-[#222] border-r border-[#333]">FPS: 60</button>
             <button className="px-3 py-1.5 text-xs font-bold font-mono text-[#888] hover:text-white hover:bg-[#222] border-r border-[#333]">SMPTE Drop</button>
             <button className="px-3 py-1.5 text-xs font-bold text-[#888] hover:text-white hover:bg-[#222] flex items-center gap-1"><Settings size={12}/> Settings</button>
           </div>
           <button className="bg-[#58a6ff]/10 border border-[#58a6ff]/30 text-[#58a6ff] hover:bg-[#58a6ff]/20 px-4 py-1.5 rounded text-xs font-bold uppercase transition flex items-center gap-2">
             <MonitorPlay size={14} /> Build Sequence
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigator (Scenes & Shots) */}
        <div className="w-[240px] bg-[#111] border-r border-[#222] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#222] flex justify-between items-center bg-[#151515]">
            <span className="text-xs font-bold text-[#888] uppercase tracking-widest">Sequence Outliner</span>
            <button className="text-[#aaa] hover:text-white"><Plus size={14}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="text-[11px] font-bold text-white bg-[#58a6ff]/20 border border-[#58a6ff]/30 p-2 rounded cursor-pointer flex items-center gap-2">
               <Clapperboard size={12} className="text-[#58a6ff]"/> Act_1_Betrayal_Mst
            </div>
            <div className="text-[11px] font-medium text-[#888] hover:bg-[#222] p-2 rounded cursor-pointer flex items-center gap-2 pl-6">
               <Video size={10}/> Shot_01_Wide_Intro
            </div>
            <div className="text-[11px] font-medium text-[#888] hover:bg-[#222] p-2 rounded cursor-pointer flex items-center gap-2 pl-6">
               <Video size={10}/> Shot_02_CU_Villain
            </div>
            <div className="text-[11px] font-medium text-[#888] hover:bg-[#222] p-2 rounded cursor-pointer flex items-center gap-2 pl-6">
               <Video size={10}/> Shot_03_OTS_Hero
            </div>
          </div>
        </div>

        {/* Center Canvas & Timeline */}
        <div className="flex-1 flex flex-col bg-[#050505] overflow-hidden relative">
           
           {/* Viewport Area */}
           <div className="flex-1 relative flex items-center justify-center p-4 border-b border-[#222]">
              {/* Camera Frame Preview */}
              <div className="aspect-video h-full max-h-[100%] bg-black border-2 border-[#333] relative overflow-hidden shadow-2xl group">
                 {/* Rule of Thirds Grid */}
                 <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none border border-white/20">
                    <div className="border-r border-b border-white/50"></div>
                    <div className="border-r border-b border-white/50"></div>
                    <div className="border-b border-white/50"></div>
                    <div className="border-r border-b border-white/50"></div>
                    <div className="border-r border-b border-white/50"></div>
                    <div className="border-b border-white/50"></div>
                    <div className="border-r border-white/50"></div>
                    <div className="border-r border-white/50"></div>
                    <div></div>
                 </div>

                 {/* Center Crosshair & Safe Areas */}
                 <div className="absolute inset-8 border border-red-500/30 opacity-50 pointer-events-none hidden group-hover:block"></div> {/* Title Safe */}
                 <div className="absolute inset-12 border border-yellow-500/30 opacity-50 pointer-events-none hidden group-hover:block"></div> {/* Action Safe */}
                 
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 opacity-50">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
                    <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white"></div>
                 </div>

                 {/* 3D Scene Mock Placeholder */}
                 <div className="absolute inset-0 flex items-center justify-center select-none">
                    <div className="text-center">
                       <MonitorPlay size={48} className="mx-auto text-[#333] mb-2"/>
                       <p className="text-[#555] font-mono text-[10px]">RENDER VIEWPORT [REAL-TIME DX12]</p>
                       <p className="text-[#444] font-mono text-[9px] mt-1">Camera: CineCam_35mm | F-Stop: 1.8 | Focal Dist: 2.4m</p>
                    </div>
                 </div>

                 {/* Overlays */}
                 <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-[9px] font-mono text-red-500 border border-red-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> REC
                 </div>
                 <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-mono text-white border border-white/20">
                    TC: {time}
                 </div>
              </div>
           </div>

           {/* Timeline Controls & Dope Sheet/Timeline Toggle */}
           <div className="h-10 bg-[#111] border-b border-[#222] flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2">
                 <button className="text-[#888] hover:text-white"><SkipBack size={16}/></button>
                 <button className="text-[#888] hover:text-white"><SkipForward size={16} className="rotate-180"/></button>
                 <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded bg-[#eee] text-black flex items-center justify-center hover:bg-white transition-colors shadow-[0_0_10px_rgba(255,255,255,0.2)] ml-2 mr-2"
                 >
                    {isPlaying ? <Pause size={16} className="fill-black"/> : <Play size={16} className="fill-black ml-1"/>}
                 </button>
                 <button className="text-[#888] hover:text-white"><SkipForward size={16}/></button>
                 <button className="text-[#888] hover:text-white"><FastForward size={16}/></button>
                 
                 <div className="h-4 w-[1px] bg-[#333] mx-3"></div>
                 
                 <input type="text" value={time} readOnly className="bg-black border border-[#333] rounded px-2 py-1 text-xs font-mono text-[#58a6ff] w-24 text-center cursor-ns-resize selection:bg-transparent" />
              </div>

              <div className="flex bg-black border border-[#333] rounded p-0.5">
                 <button 
                   onClick={() => setActiveTab('timeline')}
                   className={`px-3 py-1 text-[10px] uppercase font-bold rounded ${activeTab === 'timeline' ? 'bg-[#333] text-white' : 'text-[#888] hover:text-[#ccc]'}`}
                 >NLE Timeline</button>
                 <button 
                   onClick={() => setActiveTab('dope_sheet')}
                   className={`px-3 py-1 text-[10px] uppercase font-bold rounded ${activeTab === 'dope_sheet' ? 'bg-[#333] text-white' : 'text-[#888] hover:text-[#ccc]'}`}
                 >Dope Sheet & Curves</button>
              </div>
           </div>

           {/* Timeline Tracks Area */}
           <div className="h-[300px] bg-[#111] flex shrink-0">
             
             {/* Tracks Header (Left) */}
             <div className="w-[240px] border-r border-[#222] bg-[#151515] flex flex-col pt-6 overflow-y-hidden shrink-0">
                {tracks.map(t => (
                  <div key={t.id} className="h-10 border-b border-[#222] flex items-center px-3 gap-2 group hover:bg-[#1a1a1a]">
                     <div className={`w-1 h-full absolute left-0 ${t.color}`}></div>
                     <span className="text-[#777] opacity-60 ml-2">{t.icon}</span>
                     <span className="text-[11px] font-bold text-[#ccc] truncate flex-1">{t.name}</span>
                     <div className="hidden group-hover:flex items-center gap-1">
                        <button className="w-4 h-4 bg-black rounded text-[8px] border border-[#333] hover:border-white">M</button>
                        <button className="w-4 h-4 bg-black rounded text-[8px] border border-[#333] hover:border-white">S</button>
                     </div>
                  </div>
                ))}
             </div>

             {/* Tracks Timeline (Right) */}
             <div className="flex-1 bg-[#0a0a0a] relative overflow-hidden flex flex-col">
                {/* Time Ruler */}
                <div className="h-6 border-b border-[#333] bg-[#111] flex items-end px-2 text-[9px] font-mono text-[#666] relative select-none">
                   {Array.from({length: 20}).map((_, i) => (
                      <div key={i} className="flex-1 border-l border-[#333] h-2 relative">
                         <span className="absolute -top-4 left-1">00:{i * 5}</span>
                         {/* Sub-ticks */}
                         <div className="absolute bottom-0 left-[25%] w-[1px] h-1 bg-[#222]"></div>
                         <div className="absolute bottom-0 left-[50%] w-[1px] h-1.5 bg-[#333]"></div>
                         <div className="absolute bottom-0 left-[75%] w-[1px] h-1 bg-[#222]"></div>
                      </div>
                   ))}
                </div>

                {/* Scrubber Playhead */}
                <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-red-600 shadow-[0_0_5px_red] z-30 pointer-events-none">
                   <div className="absolute -top-1 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-600"></div>
                </div>

                {activeTab === 'timeline' ? (
                  <div className="flex-1 relative">
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px)]" style={{ backgroundSize: '5% 100%' }}></div>
                     {tracks.map((t, i) => (
                        <div key={t.id} className="h-10 border-b border-[#222] relative group">
                           {/* Simulated Clips */}
                           <div className={`absolute top-1.5 bottom-1.5 left-[10%] w-[60%] rounded border border-black/50 overflow-hidden flex items-center px-2 cursor-grab active:cursor-grabbing hover:brightness-110 shadow-sm ${t.color.replace('bg-', 'bg-opacity-20 bg-')}`}>
                              <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.color}`}></div>
                              <span className="text-[10px] text-white/80 font-bold ml-1 mix-blend-difference">{t.name} [Clip]</span>
                              {t.type === 'logic' && <div className="absolute right-2 px-1 py-0.5 bg-black/50 rounded text-[8px] text-green-300">TRIGGER: BOSS_SPAWN</div>}
                           </div>
                        </div>
                     ))}
                  </div>
                ) : (
                  <div className="flex-1 relative group bg-[#080808]">
                     {/* Keyframe Dope Sheet View with Curve Splines */}
                     {tracks.map((t, i) => (
                        <div key={t.id} className="h-10 border-b border-[#222] relative">
                           {/* Active Spline Visualization (Simulation) */}
                           {activeTab === 'dope_sheet' && (
                              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                                <path 
                                  d={`M 0,${20 + i} C 50,${10 + i} 100,${30 + i} 150,20 S 250,5 300,20`} 
                                  fill="transparent" 
                                  stroke={t.color.replace('bg-', '')} 
                                  strokeWidth="1.5" 
                                  className="vector-spline"
                                />
                              </svg>
                           )}
                           
                           {/* Keyframe Diamonds */}
                           <div className="absolute top-1/2 left-[15%] -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-white border border-[#555] cursor-pointer hover:bg-[#58a6ff] hover:scale-150 transition-transform shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10"></div>
                           {/* Spline Handles */}
                           <div className="absolute top-1/2 left-[17%] -translate-y-1/2 w-8 h-[1px] bg-[#58a6ff] pointer-events-none opacity-0 group-hover:opacity-100 hidden md:block">
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#58a6ff]"></div>
                           </div>

                           <div className="absolute top-1/2 left-[35%] -translate-y-1/2 w-2 h-2 rotate-45 bg-[#888] border border-[#555] cursor-pointer hover:bg-[#58a6ff] hover:scale-150 transition-transform z-10"></div>
                           <div className="absolute top-1/2 left-[70%] -translate-y-1/2 w-2 h-2 rotate-45 bg-[#f85149] border border-[#555] cursor-pointer hover:bg-[#f85149] hover:scale-150 transition-transform z-10"></div>
                           {/* In-between line */}
                           <div className="absolute top-1/2 left-[15%] right-[30%] h-[1px] bg-white/20 -translate-y-1/2 pointer-events-none"></div>
                        </div>
                     ))}
                  </div>
                )}
             </div>
           </div>
        </div>

        {/* Right Panel (Narrative Continuity & Logic Integration) */}
        <div className="w-[300px] bg-[#111] border-l border-[#222] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#222] bg-[#151515]">
             <h3 className="text-xs font-black tracking-widest uppercase text-[#58a6ff] flex items-center gap-2">
               <GitBranch size={14}/> Story State & Continuity
             </h3>
             <p className="text-[#777] text-[9px] mt-1 leading-tight">Link cinematic events to global game architecture, variables, and save states.</p>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              
              {/* Selected Track Property: Deep Camera Lens Controls */}
              <div>
                 <div className="text-[10px] uppercase font-black text-[#58a6ff] mb-2 flex items-center gap-2 border-b border-[#333] pb-1">
                   <Video size={12}/> Physical Camera Lens Settings
                 </div>
                 <div className="bg-[#0a0a0c] border border-[#222] rounded p-3 space-y-4">
                    {/* Lens Meta */}
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-[#aaa]">Focal Length (mm)</span>
                       <input type="number" defaultValue={35} className="bg-black border border-[#444] text-[#fff] w-14 text-center rounded text-[10px] font-mono p-1" />
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-[#aaa]">Aperture (f-stop)</span>
                       <div className="flex items-center gap-1">
                         <span className="text-[#555] font-mono text-[9px]">f/</span>
                         <input type="number" defaultValue={1.8} className="bg-black border border-[#444] text-[#fff] w-12 text-center rounded text-[10px] font-mono p-1" />
                       </div>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-[#aaa]">Sensor Width (Film Back)</span>
                       <select className="bg-black border border-[#444] text-[#fff] rounded text-[9px] font-mono p-1 outline-none">
                         <option>Super 35mm (24.89mm)</option>
                         <option>Full Frame (36mm)</option>
                         <option>IMAX 70mm (70.41mm)</option>
                       </select>
                    </div>

                    {/* Depth of Field Visualization */}
                    <div className="pt-2 border-t border-[#222]">
                       <div className="flex justify-between text-[9px] text-[#888] mb-1">
                         <span>Focus Distance</span>
                         <span className="text-[#58a6ff] font-mono">2.4m</span>
                       </div>
                       <input type="range" className="w-full accent-[#58a6ff] h-1 bg-[#222] appearance-none rounded" defaultValue={30} />
                       <div className="h-4 w-full bg-gradient-to-r from-transparent via-[#58a6ff]/20 to-transparent mt-1 border border-[#333] rounded flex items-center justify-center text-[7px] text-[#58a6ff]">DOF PLANE VISUALIZER</div>
                    </div>
                 </div>
              </div>

              {/* Selected Track Property: Logic Event */}
              <div>
                 <div className="text-[10px] uppercase font-bold text-[#888] mb-2 flex items-center gap-2">
                   <Key size={12}/> Current Sequence Prerequisites
                 </div>
                 <div className="bg-black/50 border border-[#333] rounded p-2 text-xs space-y-2">
                    <div className="flex items-center gap-2">
                       <input type="checkbox" defaultChecked className="accent-[#58a6ff]"/>
                       <span className="font-mono text-[#ccc]">PlayerHasItem(Sword_01) == <span className="text-blue-400">TRUE</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                       <input type="checkbox" defaultChecked className="accent-[#58a6ff]"/>
                       <span className="font-mono text-[#ccc]">QuestState(Defeat_Lord) &gt;= <span className="text-green-400">2</span></span>
                    </div>
                    <button className="w-full mt-2 bg-[#222] hover:bg-[#333] border border-[#444] rounded py-1 text-[#888] hover:text-white flex items-center justify-center gap-1 transition-colors text-[10px]">
                      <Plus size={10}/> Add Requirement Condition
                    </button>
                 </div>
              </div>

              {/* Event Triggers During Cutscene */}
              <div>
                 <div className="text-[10px] uppercase font-bold text-[#888] mb-2 flex items-center gap-2">
                   <Target size={12}/> Timeline Logic Triggers
                 </div>
                 <div className="space-y-2">
                    <div className="bg-[#1a1a24] border border-[#58a6ff]/30 rounded p-2">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[10px] font-bold text-white uppercase bg-[#58a6ff]/20 px-1 rounded">Frame 420</span>
                         <span className="text-[9px] text-[#888] hover:text-white cursor-pointer"><Settings size={10}/></span>
                       </div>
                       <p className="text-xs font-mono text-[#58a6ff]">SetGlobalFlag("Boss_Revealed", 1)</p>
                    </div>
                    <div className="bg-[#1a241a] border border-[#3fb950]/30 rounded p-2">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[10px] font-bold text-white uppercase bg-[#3fb950]/20 px-1 rounded">Frame 890</span>
                         <span className="text-[9px] text-[#888] hover:text-white cursor-pointer"><Settings size={10}/></span>
                       </div>
                       <p className="text-xs font-mono text-[#3fb950]">UnlockAchievement("ACH_004")</p>
                    </div>
                    <div className="bg-[#241a1a] border border-[#f85149]/30 rounded p-2">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[10px] font-bold text-white uppercase bg-[#f85149]/20 px-1 rounded">Frame 1200</span>
                         <span className="text-[9px] text-[#888] hover:text-white cursor-pointer"><Settings size={10}/></span>
                       </div>
                       <p className="text-xs font-mono text-[#f85149]">StartCombatPhase(Phase_2)</p>
                    </div>
                 </div>
              </div>

              {/* Branching Dialogue */}
              <div>
                 <div className="text-[10px] uppercase font-bold text-[#888] mb-2 flex items-center gap-2">
                   <AlignLeft size={12}/> Dialogue / Subtitles DB Node
                 </div>
                 <div className="bg-[#151515] border border-[#333] rounded p-2">
                    <p className="text-[11px] text-[#aaa] mb-2 font-serif italic">"You cannot stop the inevitable, mortal. The prophecy was written in blood."</p>
                    <div className="flex gap-2">
                       <button className="flex-1 bg-[#222] hover:bg-[#333] border border-[#444] rounded py-1 text-[9px] text-white transition-colors">Edit in LocDB</button>
                       <button className="flex-1 bg-[#222] hover:bg-[#333] border border-[#444] rounded py-1 text-[9px] text-white transition-colors">Edit Facial Mocap</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

// Custom Icon for animation track
function WalkingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m13 14 1 7"></path>
      <path d="M13.5 2.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"></path>
      <path d="m4 10 5.5.5L13 14l-2 7"></path>
      <path d="M4 14l-.5-3.5"></path>
      <path d="M16 10l-4-3-1 2"></path>
    </svg>
  );
}
