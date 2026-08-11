import React, { useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Clock, Settings2, 
  Video, Music, Scissors, Camera, ListPlus, ChevronDown, ChevronRight,
  Eye, EyeOff, Lock, Unlock, Move, Maximize2, Type, Users, Save, Download
} from 'lucide-react';

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'camera' | 'event' | 'actor' | 'subtitle';
  color: string;
  clips: Clip[];
  muted: boolean;
  locked: boolean;
  collapsed: boolean;
}

interface Clip {
  id: string;
  name: string;
  start: number; // in frames
  duration: number; // in frames
}

const DEFAULT_TRACKS: Track[] = [
  {
    id: 't1', name: 'Master Camera Cuts', type: 'camera', color: '#58a6ff', muted: false, locked: false, collapsed: false,
    clips: [
      { id: 'c1', name: 'Cam01_Wide', start: 0, duration: 120 },
      { id: 'c2', name: 'Cam03_CU_Hero', start: 120, duration: 60 },
      { id: 'c3', name: 'Cam02_OverShoulder', start: 180, duration: 90 },
    ]
  },
  {
    id: 't2', name: 'Actor: Hero_M', type: 'actor', color: '#d2a8ff', muted: false, locked: false, collapsed: false,
    clips: [
      { id: 'c4', name: 'Anim_Idle_Sword', start: 0, duration: 120 },
      { id: 'c5', name: 'Anim_Attack_Swing', start: 120, duration: 60 },
      { id: 'c6', name: 'Anim_Block_Impact', start: 180, duration: 90 },
    ]
  },
  {
    id: 't3', name: 'VFX / Environment', type: 'event', color: '#3fb950', muted: false, locked: false, collapsed: false,
    clips: [
      { id: 'c7', name: 'Particle_Dust_Loop', start: 0, duration: 270 },
      { id: 'c8', name: 'Sparks_Burst', start: 150, duration: 15 },
    ]
  },
  {
    id: 't4', name: 'SFX / Foley', type: 'audio', color: '#f85149', muted: false, locked: false, collapsed: false,
    clips: [
      { id: 'c9', name: 'Footsteps_Gravel', start: 0, duration: 120 },
      { id: 'c10', name: 'Sword_Whoosh_01', start: 130, duration: 20 },
      { id: 'c11', name: 'Metal_Clang_Heavy', start: 180, duration: 10 },
    ]
  },
  {
    id: 't5', name: 'Music Score', type: 'audio', color: '#e3b341', muted: false, locked: false, collapsed: false,
    clips: [
      { id: 'c12', name: 'BGM_BossEncounter_Intro', start: 0, duration: 270 },
    ]
  },
  {
    id: 't6', name: 'Subtitles', type: 'subtitle', color: '#8b949e', muted: false, locked: false, collapsed: false,
    clips: [
      { id: 'c13', name: '"You cannot defeat me!"', start: 120, duration: 50 },
    ]
  }
];

export default function CinematicSequencerEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(45); // in frames
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  
  const FPS = 30;
  const TOTAL_FRAMES = 300;
  
  const formatTimecode = (frames: number) => {
    const s = Math.floor(frames / FPS);
    const f = frames % FPS;
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
  };

  const getTrackIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={14} />;
      case 'audio': return <Music size={14} />;
      case 'camera': return <Camera size={14} />;
      case 'actor': return <Users size={14} />;
      case 'event': return <Settings2 size={14} />;
      case 'subtitle': return <Type size={14} />;
      default: return <Video size={14} />;
    }
  };

  const toggleTrackProp = (trackId: string, prop: 'muted' | 'locked' | 'collapsed') => {
    setTracks(tracks.map(t => t.id === trackId ? { ...t, [prop]: !t[prop] } : t));
  };

  return (
    <div className="w-full h-screen bg-[#0d1117] flex flex-col font-sans text-[#c9d1d9] overflow-hidden">
      
      {/* Top Menu Bar */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#d2a8ff] font-bold">
            <Camera size={18} />
            <span>Omni Cinematic Sequencer</span>
          </div>
          
          <div className="flex items-center gap-1 border-l border-[#30363d] pl-6">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-[#c9d1d9] hover:text-white hover:bg-[#30363d] rounded transition-colors">
              <Save size={14} /> Save Cutscene
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-[#c9d1d9] hover:text-white hover:bg-[#30363d] rounded transition-colors">
              <Download size={14} /> Render to Video
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#8b949e]">30 FPS • 1920x1080 • Scene: Boss_Fight_01</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Viewport & Properties */}
        <div className="flex-1 flex flex-col border-r border-[#30363d]">
          {/* Main Viewport */}
          <div className="flex-1 bg-black relative flex items-center justify-center">
            {/* Mock 3D Viewport Content */}
            <div className="w-full h-full opacity-60 bg-[url('https://images.unsplash.com/photo-1542361345-89ce1f116631?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-black/80 text-white font-mono text-[12px] px-2 py-1 rounded shadow-lg border border-[#30363d]">
                Cam01_Wide
              </span>
              <span className="bg-black/80 text-[#f85149] font-mono text-[12px] px-2 py-1 rounded shadow-lg border border-[#f85149] animate-pulse">
                REC
              </span>
            </div>
            
            <div className="absolute bottom-10 w-full text-center">
               <span className="text-white text-[16px] font-bold text-shadow" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>
                 [Subtitles mock text will appear here]
               </span>
            </div>
            
            {/* Viewport Overlay Controls */}
            <div className="absolute top-4 right-4 flex bg-black/60 backdrop-blur-md rounded border border-[#30363d] p-1 shadow-lg">
              <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded" title="Cinematic View"><Maximize2 size={14}/></button>
              <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded" title="Safe Areas"><Settings2 size={14}/></button>
            </div>
          </div>
          
          {/* Properties Panel (Bottom Left) */}
          <div className="h-48 bg-[#0d1117] border-t border-[#30363d] flex flex-col shrink-0">
            <div className="h-8 bg-[#161b22] border-b border-[#30363d] flex items-center px-4">
              <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Clip Inspector</span>
            </div>
            <div className="flex-1 p-4 grid grid-cols-2 gap-8 custom-scrollbar overflow-y-auto">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-[#8b949e] font-bold">Clip Name</label>
                  <input type="text" defaultValue="Cam01_Wide" className="bg-[#161b22] border border-[#30363d] text-[12px] text-white px-2 py-1 rounded outline-none focus:border-[#58a6ff]" />
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[10px] text-[#8b949e] font-bold">Start Frame</label>
                    <input type="number" defaultValue="0" className="bg-[#161b22] border border-[#30363d] text-[12px] text-white px-2 py-1 rounded outline-none focus:border-[#58a6ff]" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[10px] text-[#8b949e] font-bold">Duration</label>
                    <input type="number" defaultValue="120" className="bg-[#161b22] border border-[#30363d] text-[12px] text-white px-2 py-1 rounded outline-none focus:border-[#58a6ff]" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-[#8b949e] font-bold">Camera Asset</label>
                  <select className="bg-[#161b22] border border-[#30363d] text-[12px] text-white px-2 py-1 rounded outline-none focus:border-[#58a6ff]">
                    <option>CineCameraActor_1</option>
                    <option>CineCameraActor_2</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[10px] text-[#8b949e] font-bold">Focal Length</label>
                    <input type="text" defaultValue="35mm" className="bg-[#161b22] border border-[#30363d] text-[12px] text-white px-2 py-1 rounded outline-none focus:border-[#58a6ff]" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[10px] text-[#8b949e] font-bold">Aperture</label>
                    <input type="text" defaultValue="f/2.8" className="bg-[#161b22] border border-[#30363d] text-[12px] text-white px-2 py-1 rounded outline-none focus:border-[#58a6ff]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline Sequencer */}
        <div className="w-[800px] flex flex-col shrink-0 bg-[#0d1117]">
          {/* Transport Controls */}
          <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-[#8b949e] hover:text-white rounded transition-colors"><SkipBack size={16} /></button>
              <button 
                className="p-1.5 text-white bg-[#238636] hover:bg-[#2ea043] rounded-full transition-colors mx-1"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
              </button>
              <button className="p-1.5 text-[#8b949e] hover:text-white rounded transition-colors"><SkipForward size={16} /></button>
            </div>
            
            <div className="font-mono text-[#58a6ff] text-[16px] font-bold flex items-center gap-2 bg-[#0d1117] border border-[#30363d] px-3 py-1 rounded shadow-inner">
              <Clock size={14} className="text-[#8b949e]" />
              {formatTimecode(currentTime)}
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded" title="Split Clip (S)"><Scissors size={14}/></button>
              <button className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#30363d] rounded" title="Move Tool (V)"><Move size={14}/></button>
              <div className="w-px h-4 bg-[#30363d] mx-1" />
              <button className="flex items-center gap-1.5 px-3 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] text-[#c9d1d9]">
                <ListPlus size={14} /> Add Track
              </button>
            </div>
          </div>

          {/* Timeline Tracks Header */}
          <div className="flex flex-1 overflow-hidden">
            {/* Track Headers */}
            <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar hide-scrollbar">
              <div className="h-8 border-b border-[#30363d] bg-[#0d1117] flex items-center px-4 shrink-0">
                <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Tracks</span>
              </div>
              
              {tracks.map(track => (
                <div key={track.id} className="h-16 border-b border-[#30363d] flex flex-col justify-center px-2 relative group hover:bg-[#21262d] transition-colors shrink-0">
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: track.color }} />
                  <div className="flex items-center justify-between ml-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <button onClick={() => toggleTrackProp(track.id, 'collapsed')} className="text-[#8b949e] hover:text-white shrink-0">
                        {track.collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <span className="text-[13px] text-[#8b949e]" style={{ color: track.color }}>{getTrackIcon(track.type)}</span>
                      <span className="text-[12px] font-bold text-[#c9d1d9] truncate select-none">{track.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 ml-6 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleTrackProp(track.id, 'muted')} className={`p-1 rounded ${track.muted ? 'text-[#f85149]' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}>
                      {track.muted ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                    <button onClick={() => toggleTrackProp(track.id, 'locked')} className={`p-1 rounded ${track.locked ? 'text-[#f85149]' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}>
                      {track.locked ? <Lock size={12} /> : <Unlock size={12} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Timeline Ruler & Clips */}
            <div className="flex-1 flex flex-col relative overflow-x-auto overflow-y-auto custom-scrollbar bg-[#0d1117]">
              {/* Ruler */}
              <div className="h-8 border-b border-[#30363d] bg-[#0d1117] shrink-0 sticky top-0 z-10 flex text-[#8b949e] text-[10px] font-mono">
                {/* Mock Ruler Marks */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="flex-1 border-l border-[#30363d] pl-1 pt-1 h-full min-w-[80px]">
                    {formatTimecode(i * 30)}
                  </div>
                ))}
              </div>
              
              {/* Playhead */}
              <div 
                className="absolute top-0 bottom-0 w-px bg-[#f85149] z-20 pointer-events-none transition-all duration-75"
                style={{ left: `${(currentTime / TOTAL_FRAMES) * 100}%` }}
              >
                <div className="absolute top-0 -translate-x-1/2 w-3 h-3 bg-[#f85149]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
              </div>

              {/* Tracks Content */}
              <div className="flex flex-col w-full relative" style={{ width: '200%' }}> 
                {tracks.map(track => (
                  <div key={track.id} className="h-16 border-b border-[#30363d] relative shrink-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMjEyNjJkIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wLDBMMDQsMCIvPjwvZz48L3N2Zz4=')]">
                    {track.clips.map(clip => (
                      <div 
                        key={clip.id}
                        className="absolute top-2 bottom-2 rounded border border-black/50 shadow-md flex items-center px-2 overflow-hidden select-none cursor-pointer hover:brightness-110 active:brightness-90 transition-all"
                        style={{ 
                          left: `${(clip.start / TOTAL_FRAMES) * 100}%`, 
                          width: `${(clip.duration / TOTAL_FRAMES) * 100}%`,
                          backgroundColor: track.color,
                          opacity: track.muted ? 0.4 : 1
                        }}
                      >
                        <span className="text-[11px] font-bold text-black/80 truncate">
                          {clip.name}
                        </span>
                        
                        {/* Trim Handles */}
                        <div className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-white/30 transition-colors" />
                        <div className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-white/30 transition-colors" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
