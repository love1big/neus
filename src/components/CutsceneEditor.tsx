import React, { useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Layers, Camera, Video, Music, Activity, Sparkles, Wand2, Scissors, SplitSquareHorizontal, Eye, BrainCircuit, Bot, Settings2, Plus, ArrowRight, MousePointer2, Move, Clock, Box, Image, Link} from 'lucide-react';

export default function CutsceneEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'properties' | 'ai'>('ai');
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [mocapMode, setMocapMode] = useState<'prompt' | 'video'>('prompt');
  const [tracks, setTracks] = useState([
    { id: 1, name: 'Main Camera', type: 'camera', color: 'bg-blue-500' },
    { id: 2, name: 'Hero Anim', type: 'anim', color: 'bg-green-500' },
    { id: 3, name: 'Villain Anim', type: 'anim', color: 'bg-green-500' },
    { id: 4, name: 'Dialogue', type: 'audio', color: 'bg-yellow-500' },
    { id: 5, name: 'VFX Context', type: 'vfx', color: 'bg-purple-500' },
  ]);

  return (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col font-['Helvetica_Neue',Arial,sans-serif] text-[#c9d1d9] overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-12 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="font-bold text-[#fff] text-sm flex items-center gap-2">
            <Video size={16} className="text-[#bc8cff]" /> 
            Cinematic Sequencer Pro
          </div>
          <div className="h-4 w-[1px] bg-[#30363d] mx-2"></div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-[#21262d] rounded text-[#8b949e] hover:text-[#c9d1d9] transition-colors"><MousePointer2 size={14}/></button>
            <button className="p-1.5 hover:bg-[#21262d] rounded text-[#8b949e] hover:text-[#c9d1d9] transition-colors"><Move size={14}/></button>
            <button className="p-1.5 hover:bg-[#21262d] rounded text-[#8b949e] hover:text-[#c9d1d9] transition-colors"><Scissors size={14}/></button>
            <button className="p-1.5 hover:bg-[#21262d] rounded text-[#8b949e] hover:text-[#c9d1d9] transition-colors"><SplitSquareHorizontal size={14}/></button>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <button className="p-2 hover:bg-[#21262d] rounded-full text-[#8b949e] hover:text-[#c9d1d9]"><SkipBack size={16}/></button>
          <button 
            className="p-2 bg-[#bc8cff] hover:bg-[#d2a8ff] text-black rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}
          </button>
          <button className="p-2 hover:bg-[#21262d] rounded-full text-[#8b949e] hover:text-[#c9d1d9]"><SkipForward size={16}/></button>
          <div className="bg-[#0d1117] border border-[#30363d] px-3 py-1 rounded text-xs font-mono ml-2 text-[#58a6ff]">
            00:00:{(time / 10).toFixed(2).padStart(5, '0')}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-[#0d1117] border border-[#30363d] rounded overflow-hidden mr-2">
            <button 
              onClick={() => setViewMode('3D')}
              className={`px-2 py-1 text-xs font-bold transition-colors flex items-center gap-1.5 ${viewMode === '3D' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'}`}
            >
              <Box size={14}/> 3D
            </button>
            <button 
              onClick={() => setViewMode('2D')}
              className={`px-2 py-1 text-xs font-bold transition-colors flex items-center gap-1.5 ${viewMode === '2D' ? 'bg-[#3fb950]/20 text-[#3fb950]' : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'}`}
            >
              <Image size={14}/> 2D
            </button>
          </div>
          <span className="text-xs text-[#8b949e]">FPS:</span>
          <select className="bg-[#0d1117] border border-[#30363d] text-xs px-2 py-1 rounded outline-none w-16">
            <option>24</option>
            <option>30</option>
            <option>60</option>
          </select>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        
        {/* Left Side: Sequence Viewport & Tracks */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-[#30363d]">
          {/* Main Viewport Mockup */}
          <div className="flex-[0.6] bg-[#000] relative border-b border-[#30363d] overflow-hidden flex flex-col">
             <div className="absolute top-2 left-2 flex gap-2 z-10 text-[10px] font-bold">
               {viewMode === '3D' ? (
                 <>
                   <span className="bg-black/50 px-2 py-1 rounded text-white border border-white/20">Camera_Director_01</span>
                   <span className="bg-black/50 px-2 py-1 rounded text-[#58a6ff] border border-[#58a6ff]/30">85mm Lens (f/1.8)</span>
                 </>
               ) : (
                 <>
                   <span className="bg-black/50 px-2 py-1 rounded text-white border border-white/20">Scene_Canvas_Main</span>
                   <span className="bg-black/50 px-2 py-1 rounded text-[#3fb950] border border-[#3fb950]/30">Orthographic / 1920x1080</span>
                 </>
               )}
             </div>
             
             {/* Viewport Content Pattern */}
             <div className={`flex-1 w-full h-full bg-[#111] ${viewMode === '3D' ? 'bg-[url(\'https://transparenttextures.com/patterns/cubes.png\')]' : 'bg-[url(\'https://transparenttextures.com/patterns/graphy.png\')]'} flex items-center justify-center relative`}>
               <div className="absolute inset-0 border-[4px] border-[#000] pointer-events-none"></div> {/* Letterbox */}
               <div className="text-[#333] text-4xl font-bold tracking-widest uppercase rotate-[-10deg] opacity-20">Scene Viewport Active</div>
               <div className="absolute bottom-2 right-2 flex gap-2">
                  <button className="p-1.5 bg-black/50 border border-white/20 rounded text-white hover:bg-black/80"><Eye size={12}/></button>
                  <button className="p-1.5 bg-black/50 border border-white/20 rounded text-white hover:bg-black/80"><Settings2 size={12}/></button>
               </div>
             </div>
          </div>

          {/* Timeline / Tracks Editor */}
          <div className="flex-[0.4] bg-[#161b22] flex flex-col">
             {/* Timeline Ruler */}
             <div className="h-6 bg-[#0d1117] border-b border-[#30363d] flex shrink-0">
                <div className="w-64 border-r border-[#30363d] shrink-0 bg-[#161b22] px-2 flex items-center text-[10px] font-bold text-[#8b949e]">
                  Tracks
                </div>
                <div className="flex-1 bg-[#0d1117] relative overflow-hidden">
                   <div className="absolute top-0 bottom-0 border-l border-red-500 z-20 pointer-events-none" style={{ left: '20%' }}>
                     <div className="w-3 h-3 bg-red-500 absolute -top-0 -left-[5.5px] rotate-45 transform origin-center"></div>
                     <div className="w-[1px] h-full bg-red-500/50"></div>
                   </div>
                   {/* Ruler marks - generated pure decorative */}
                   <div className="w-full h-full flex" style={{ background: 'repeating-linear-gradient(to right, transparent, transparent 49px, #30363d 50px)' }}></div>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 bg-[#0d1117]">
               {tracks.map((track) => (
                 <div key={track.id} className="h-8 border-b border-[#30363d] flex group">
                    <div className="w-64 bg-[#161b22] border-r border-[#30363d] shrink-0 flex items-center px-2 py-1 justify-between group-hover:bg-[#21262d] transition-colors">
                      <div className="flex items-center gap-2 overflow-hidden">
                        {track.type === 'camera' && <Camera size={12} className="text-blue-400 shrink-0"/>}
                        {track.type === 'anim' && <Activity size={12} className="text-green-400 shrink-0"/>}
                        {track.type === 'audio' && <Music size={12} className="text-yellow-400 shrink-0"/>}
                        {track.type === 'vfx' && <Layers size={12} className="text-purple-400 shrink-0"/>}
                        <span className="text-[11px] truncate text-[#c9d1d9]">{track.name}</span>
                      </div>
                      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="text-[#8b949e] hover:text-white"><Settings2 size={12}/></button>
                      </div>
                    </div>
                    {/* Track data dummy visual */}
                    <div className="flex-1 relative bg-[#0d1117] overflow-hidden group/track">
                       <div className="absolute top-0 bottom-0 left-0 right-0" style={{ background: 'repeating-linear-gradient(to right, transparent, transparent 9px, #161b22 10px)' }}></div>
                       
                       {/* Playhead Guide Line */}
                       <div className="absolute top-0 bottom-0 border-l border-white/10 z-10 pointer-events-none" style={{ left: '20%' }}></div>

                       {track.id === 1 && (
                         <div className="absolute top-1 bottom-1 left-[5%] right-[20%] bg-blue-500/20 border border-blue-500/50 rounded-sm flex items-center px-2 text-[9px] font-bold overflow-hidden cursor-pointer hover:bg-blue-500/30 transition-colors group/clip">
                           <div className="absolute left-0 w-1 h-full bg-blue-400 cursor-ew-resize hover:bg-white opacity-0 group-hover/clip:opacity-100"></div>
                           <div className="absolute right-0 w-1 h-full bg-blue-400 cursor-ew-resize hover:bg-white opacity-0 group-hover/clip:opacity-100"></div>
                           <div className="w-2 h-2 rounded-full bg-blue-400 mr-2 shrink-0"/>
                           <span className="truncate">{viewMode === '3D' ? 'Cam_Path_Spline_01' : 'Canvas_Pan_01'}</span>
                         </div>
                       )}
                       {track.id === 2 && (
                         <div className="absolute top-1 bottom-1 left-[10%] right-[30%] bg-green-500/20 border border-green-500/50 rounded-sm flex items-center px-2 text-[9px] font-bold overflow-hidden cursor-pointer hover:bg-green-500/30 transition-colors group/clip">
                           <div className="absolute left-0 w-1 h-full bg-green-400 cursor-ew-resize hover:bg-white opacity-0 group-hover/clip:opacity-100"></div>
                           <div className="absolute right-0 w-1 h-full bg-green-400 cursor-ew-resize hover:bg-white opacity-0 group-hover/clip:opacity-100"></div>
                           <div className="w-2 h-2 rounded-full bg-green-400 mr-2 shrink-0"/>
                           <span className="truncate">{viewMode === '3D' ? 'Idle_To_Combat_Blend' : 'Sprite_Run_Cycle'}</span>
                         </div>
                       )}
                       {track.id === 4 && (
                         <div className="absolute top-1 bottom-1 left-[15%] right-[40%] bg-yellow-500/20 border border-yellow-500/50 rounded-sm flex items-center px-2 text-[9px] font-bold overflow-hidden cursor-pointer hover:bg-yellow-500/30 transition-colors group/clip">
                           <div className="absolute left-0 w-1 h-full bg-yellow-400 cursor-ew-resize hover:bg-white opacity-0 group-hover/clip:opacity-100"></div>
                           <div className="absolute right-0 w-1 h-full bg-yellow-400 cursor-ew-resize hover:bg-white opacity-0 group-hover/clip:opacity-100"></div>
                           <AudioWaveform/>
                         </div>
                       )}
                    </div>
                 </div>
               ))}
               <div className="h-8 flex">
                 <button className="w-64 bg-[#161b22] border-r border-b border-[#30363d] shrink-0 flex items-center px-2 py-1 gap-2 hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors cursor-pointer">
                   <Plus size={12}/> <span className="text-[11px]">Add Track</span>
                 </button>
                 <div className="flex-1 bg-[#0d1117] border-b border-[#30363d]"></div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Side: Properties & AI Suite */}
        <div className="w-80 bg-[#161b22] flex flex-col shrink-0 flex-col">
           <div className="flex bg-[#0d1117] pt-1 px-1 border-b border-[#30363d] shrink-0 gap-1">
             <button 
               onClick={() => setActiveTab('properties')}
               className={`px-3 py-1.5 text-xs font-bold rounded-t-lg border border-b-0 ${activeTab === 'properties' ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-[#0d1117] border-transparent text-[#8b949e] hover:text-white'}`}
             >
               Properties
             </button>
             <button 
               onClick={() => setActiveTab('ai')}
               className={`px-3 py-1.5 text-xs font-bold rounded-t-lg border border-b-0 flex items-center gap-1.5 ${activeTab === 'ai' ? 'bg-[#161b22] border-[#30363d] text-[#bc8cff]' : 'bg-[#0d1117] border-transparent text-[#8b949e] hover:text-[#bc8cff]'}`}
             >
               <Sparkles size={12}/> AI Cinematic Suite
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 custom-scrollbar text-[11px]">
             {activeTab === 'properties' ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-[#0d1117] border border-[#30363d] rounded p-3">
                    <h3 className="font-bold text-white mb-2 uppercase text-[10px] tracking-wider border-b border-[#30363d] pb-1">World Integration</h3>
                    <div className="flex flex-col gap-2 mt-2">
                       <div className="flex justify-between items-center"><span className="text-[#8b949e]">Map Trigger</span><input className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded" defaultValue="TriggerBox_01"/></div>
                       <div className="flex justify-between items-center"><span className="text-[#8b949e]">World Origin</span><input className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded" defaultValue="Player_Current_Pos"/></div>
                       <div className="flex justify-between items-center"><span className="text-[#8b949e]">Actor Bindings</span><button className="bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-center px-1 w-24 text-[#58a6ff] text-[9px] rounded font-bold transition-colors">Select In-Game...</button></div>
                    </div>
                  </div>

                  <div className="bg-[#0d1117] border border-[#30363d] rounded p-3">
                    <h3 className="font-bold text-white mb-2 uppercase text-[10px] tracking-wider border-b border-[#30363d] pb-1">Selection Transform</h3>
                    <div className="flex flex-col gap-2 mt-2">
                       {viewMode === '3D' ? (
                         <>
                           <div className="flex justify-between items-center"><span className="text-[#8b949e]">Position</span><input className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded" defaultValue="0, 0, 0"/></div>
                           <div className="flex justify-between items-center"><span className="text-[#8b949e]">Rotation</span><input className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded" defaultValue="0, 0, 0"/></div>
                           <div className="flex justify-between items-center"><span className="text-[#8b949e]">Scale</span><input className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded" defaultValue="1, 1, 1"/></div>
                         </>
                       ) : (
                         <>
                           <div className="flex justify-between items-center"><span className="text-[#8b949e]">Position</span><input className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded" defaultValue="0, 0"/></div>
                           <div className="flex justify-between items-center"><span className="text-[#8b949e]">Rotation (Z)</span><input className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded" defaultValue="0"/></div>
                           <div className="flex justify-between items-center"><span className="text-[#8b949e]">Scale</span><input className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded" defaultValue="1, 1"/></div>
                         </>
                       )}
                    </div>
                  </div>
                  
                  {viewMode === '3D' ? (
                    <div className="bg-[#0d1117] border border-[#30363d] rounded p-3">
                      <h3 className="font-bold text-white mb-2 uppercase text-[10px] tracking-wider border-b border-[#30363d] pb-1">Camera Settings</h3>
                      <div className="flex flex-col gap-2 mt-2">
                         <div className="flex justify-between items-center"><span className="text-[#8b949e]">Focal Length</span><select className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded"><option>35mm</option><option>50mm</option><option>85mm</option></select></div>
                         <div className="flex justify-between items-center"><span className="text-[#8b949e]">Aperture (f-stop)</span><input className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded" defaultValue="1.8"/></div>
                         <div className="flex justify-between items-center"><span className="text-[#8b949e]">Focus Dist</span><input className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded" defaultValue="150cm"/></div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#0d1117] border border-[#30363d] rounded p-3">
                      <h3 className="font-bold text-white mb-2 uppercase text-[10px] tracking-wider border-b border-[#30363d] pb-1">Canvas Settings</h3>
                      <div className="flex flex-col gap-2 mt-2">
                         <div className="flex justify-between items-center"><span className="text-[#8b949e]">Resolution</span><select className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded"><option>1920x1080</option><option>1280x720</option><option>2560x1440</option></select></div>
                         <div className="flex justify-between items-center"><span className="text-[#8b949e]">Zoom Level</span><input className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded" defaultValue="100%"/></div>
                         <div className="flex justify-between items-center"><span className="text-[#8b949e]">Background</span><input className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded" defaultValue="#000000"/></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-[#0d1117] border border-[#30363d] rounded p-3">
                    <h3 className="font-bold text-white mb-2 uppercase text-[10px] tracking-wider border-b border-[#30363d] pb-1">Keyframe Interpolation</h3>
                    <div className="flex flex-col gap-2 mt-2">
                       <div className="flex justify-between items-center"><span className="text-[#8b949e]">Curve</span><select className="bg-[#161b22] border border-[#30363d] text-right px-1 w-24 text-white rounded"><option>Auto Vector</option><option>Linear</option><option>Cubic</option><option>Stepped</option></select></div>
                    </div>
                  </div>
                </div>
             ) : (
                <div className="flex flex-col gap-4">
                  
                  {/* AI Camera Auto-Director */}
                  <div className="bg-[#0d1117] border border-[#bc8cff]/30 rounded p-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <h3 className="font-bold text-[#58a6ff] mb-1 flex items-center gap-1.5">{viewMode === '3D' ? <Video size={12}/> : <Image size={12}/>} AI {viewMode === '3D' ? 'Camera' : 'Canvas'} Director</h3>
                    <p className="text-[#8b949e] text-[9px] mb-2 leading-tight">Generates cinematic {viewMode === '3D' ? 'camera cuts and spline paths' : 'pan/zoom sweeps and layer transitions'} based on emotion/action.</p>
                    <textarea 
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white outline-none resize-none h-16 text-[10px] custom-scrollbar focus:border-blue-500" 
                      placeholder={viewMode === '3D' ? "e.g. Action-packed combat sequence, fast cuts, shaky cam on impacts." : "e.g. Dynamic manga-style action panning, quick zooms on character eyes."}
                    />
                    <button className="w-full mt-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded py-1 font-bold transition-colors">Generate Auto-Path</button>
                  </div>

                  {/* AI MoCap / Animation Gen */}
                  <div className="bg-[#0d1117] border border-[#bc8cff]/30 rounded p-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-[#3fb950] flex items-center gap-1.5"><Activity size={12}/> AI {viewMode === '3D' ? 'MoCap' : 'Sprite'} Animation</h3>
                      <div className="flex bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
                        <button 
                          onClick={() => setMocapMode('prompt')}
                          className={`px-1.5 py-0.5 text-[9px] ${mocapMode === 'prompt' ? 'bg-green-500/20 text-green-400' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
                        >Prompt</button>
                        <button 
                          onClick={() => setMocapMode('video')}
                          className={`px-1.5 py-0.5 text-[9px] ${mocapMode === 'video' ? 'bg-green-500/20 text-green-400' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}
                        >Video Ref</button>
                      </div>
                    </div>
                    
                    {mocapMode === 'prompt' ? (
                      <>
                        <p className="text-[#8b949e] text-[9px] mb-2 leading-tight">Synthesize natural {viewMode === '3D' ? 'skeletal' : 'sprite-sheet'} animations from text prompts or reference.</p>
                        <textarea 
                          className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white outline-none resize-none h-12 text-[10px] custom-scrollbar focus:border-green-500" 
                          placeholder="e.g. Hero ducks to the left, rolls, and draws sword elegantly."
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-[#8b949e] text-[9px] mb-2 leading-tight">Extract {viewMode === '3D' ? '3D poses' : '2D sequences'} directly from external video links using AI pose estimation.</p>
                        <div className="flex items-center gap-2 mb-2">
                           <Link size={12} className="text-[#8b949e]" />
                           <input 
                              type="text" 
                              className="w-full bg-[#161b22] border border-[#30363d] rounded px-1.5 py-1 text-white outline-none text-[10px] focus:border-green-500" 
                              placeholder="https://youtube.com/watch?v=... or MP4 link"
                           />
                        </div>
                      </>
                    )}
                    
                    <label className="flex items-center gap-2 mt-2 text-[9px] text-[#8b949e] cursor-pointer">
                      <input type="checkbox" className="accent-green-500"/> Retarget to current character
                    </label>
                    <button className="w-full mt-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded py-1 font-bold transition-colors">Bake Animation Track</button>
                  </div>

                  {/* AI Lip Sync & Voiceover */}
                  <div className="bg-[#0d1117] border border-[#bc8cff]/30 rounded p-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                    <h3 className="font-bold text-[#e3b341] mb-1 flex items-center gap-1.5"><Bot size={12}/> AI Voice & Face Lip-Sync</h3>
                    <p className="text-[#8b949e] text-[9px] mb-2 leading-tight">Generate TTS and auto-animate facial blendshapes (Audio2Face).</p>
                    <textarea 
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white outline-none resize-none h-12 text-[10px] custom-scrollbar focus:border-yellow-500" 
                      placeholder="Text to speak..."
                      defaultValue="I told you not to come here. Now, you leave me no choice."
                    />
                    <div className="flex justify-between items-center mt-2 text-[9px]">
                      <span className="text-[#8b949e]">Emotion</span>
                      <select className="bg-[#161b22] border border-[#30363d] rounded px-1 py-0.5 outline-none text-[#e3b341]"><option>Angry</option><option>Sad</option><option>Happy</option></select>
                    </div>
                    <button className="w-full mt-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-[#e3b341] border border-yellow-500/30 rounded py-1 font-bold transition-colors">Generate Audio & Morph Targets</button>
                  </div>
                  
                  {/* AI Lighting / Mood */}
                  <div className="bg-[#0d1117] border border-[#bc8cff]/30 rounded p-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                    <h3 className="font-bold text-[#d2a8ff] mb-1 flex items-center gap-1.5"><Sparkles size={12}/> AI Mood Lighting</h3>
                    <p className="text-[#8b949e] text-[9px] mb-2 leading-tight">Adjust global illumination, fog, and grading based on mood.</p>
                    <textarea 
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white outline-none resize-none h-8 text-[10px] custom-scrollbar focus:border-purple-500" 
                      placeholder="e.g. Cyberpunk neon rain, moody blue and pink fill lights."
                    />
                    <button className="w-full mt-2 bg-purple-500/10 hover:bg-purple-500/20 text-[#d2a8ff] border border-purple-500/30 rounded py-1 font-bold transition-colors">Apply Cinematic Post-Process</button>
                  </div>

                </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}

const AudioWaveform = () => (
   <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-yellow-500/50 fill-current opacity-70">
      <path d="M0,10 L2,5 L4,15 L6,8 L8,18 L10,2 L12,14 L14,6 L16,19 L18,3 L20,11 L22,7 L24,16 L26,9 L28,12 L30,4 L32,15 L34,8 L36,18 L38,5 L40,14 L42,6 L44,19 L46,2 L48,15 L50,9 L52,12 L54,3 L56,16 L58,8 L60,18 L62,5 L64,14 L66,7 L68,19 L70,2 L72,15 L74,9 L76,12 L78,4 L80,16 L82,8 L84,18 L86,5 L88,14 L90,6 L92,19 L94,2 L96,15 L98,10 L100,10 L100,20 L0,20 Z" />
   </svg>
);
