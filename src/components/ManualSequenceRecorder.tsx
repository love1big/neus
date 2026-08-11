import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Plus, Settings, ChevronRight, ChevronDown, Move, Zap, Mic, KeySquare, Camera, Flag} from 'lucide-react';

type TrackType = 'transform' | 'animation' | 'audio' | 'event' | 'camera';

interface Keyframe {
  id: string;
  time: number; // in seconds
  value: any;
}

interface Track {
  id: string;
  name: string;
  type: TrackType;
  color: string;
  isOpen: boolean;
  keyframes: Keyframe[];
}

export default function ManualSequenceRecorder() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10); // 10 seconds total
  const [selectedKeyframe, setSelectedKeyframe] = useState<string | null>(null);
  
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: 'trk_1',
      name: 'Player Transform (Manual)',
      type: 'transform',
      color: '#58a6ff',
      isOpen: true,
      keyframes: [
        { id: 'kf_1', time: 0, value: { position: [0, 0, 0], rotation: [0, 0, 0] } },
        { id: 'kf_2', time: 2.5, value: { position: [100, 0, 0], rotation: [0, 90, 0] } },
        { id: 'kf_3', time: 5.0, value: { position: [100, 50, 0], rotation: [0, 90, 0] } },
      ]
    },
    {
      id: 'trk_2',
      name: 'Player Animation State',
      type: 'animation',
      color: '#3fb950',
      isOpen: false,
      keyframes: [
        { id: 'kf_4', time: 0, value: { animName: 'IDLE_LOOP', loop: true } },
        { id: 'kf_5', time: 2.5, value: { animName: 'JUMP_START', loop: false } },
        { id: 'kf_6', time: 3.0, value: { animName: 'FALL_LOOP', loop: true } },
      ]
    },
    {
      id: 'trk_3',
      name: 'Logic Trigger Events',
      type: 'event',
      color: '#e3b341',
      isOpen: true,
      keyframes: [
        { id: 'kf_7', time: 2.5, value: { eventID: 'Trigger_JumpFX' } },
        { id: 'kf_8', time: 5.0, value: { eventID: 'Spawn_Enemy_Wave_1' } },
      ]
    }
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(t => {
          if (t >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return t + 0.05; // 20fps update
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const toggleTrack = (id: string) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, isOpen: !t.isOpen } : t));
  };

  const currentKeyframeObj = tracks.flatMap(t => t.keyframes).find(k => k.id === selectedKeyframe);
  const currentTrackOfKeyframe = tracks.find(t => t.keyframes.some(k => k.id === selectedKeyframe));

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    const ms = Math.floor((t % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  const getTrackIcon = (type: TrackType) => {
    switch (type) {
      case 'transform': return <Move size={14} />;
      case 'animation': return <KeySquare size={14} />;
      case 'audio': return <Mic size={14} />;
      case 'event': return <Zap size={14} />;
      case 'camera': return <Camera size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Header */}
      <div className="h-14 border-b border-[#30363d] flex items-center justify-between px-6 bg-[#161b22] shrink-0">
        <div className="flex items-center gap-3">
          <Flag className="text-[#3fb950]" size={20} />
          <div>
            <h1 className="text-sm font-bold text-white">Manual Action & Sequence Recorder</h1>
            <p className="text-[10px] text-[#8b949e]">Record precise non-AI sequences, keyframes, and trigger tracks</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#21262d] rounded-md border border-[#30363d] overflow-hidden">
             <button onClick={() => { setIsPlaying(false); setCurrentTime(0); }} className="px-3 py-1.5 hover:bg-[#30363d] transition-colors"><Square size={14} className="text-[#8b949e]" /></button>
             <div className="w-[1px] h-4 bg-[#30363d]"></div>
             <button onClick={() => setIsPlaying(!isPlaying)} className={`px-4 py-1.5 transition-colors ${isPlaying ? 'bg-[#238636] text-white' : 'hover:bg-[#30363d]'}`}>
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
             </button>
          </div>
          <div className="bg-[#000] text-[#3fb950] font-mono text-sm px-4 py-1.5 rounded border border-[#30363d]">
             {formatTime(currentTime)}
          </div>
          <button className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded textxs font-bold flex items-center gap-2 transition-colors">
            <Plus size={14} /> Add Track
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Track List */}
        <div className="w-80 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
          <div className="h-8 border-b border-[#30363d] bg-[#0d1117] flex items-center px-4 justify-between">
            <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Sequence Tracks</span>
            <Settings size={12} className="text-[#8b949e] cursor-pointer hover:text-white" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {tracks.map(track => (
              <div key={track.id} className="flex flex-col border-b border-[#30363d]">
                <div 
                  className="flex items-center gap-2 px-2 py-2 hover:bg-[#21262d] cursor-pointer"
                  onClick={() => toggleTrack(track.id)}
                >
                  {track.isOpen ? <ChevronDown size={14} className="text-[#8b949e]"/> : <ChevronRight size={14} className="text-[#8b949e]"/>}
                  <div style={{ color: track.color }}>{getTrackIcon(track.type)}</div>
                  <span className="text-xs font-bold truncate flex-1">{track.name}</span>
                </div>
                {track.isOpen && (
                  <div className="pl-8 pr-2 py-2 bg-[#0d1117] flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] text-[#8b949e]">
                      <span>{track.type.toUpperCase()} DATA</span>
                      <button className="hover:text-white"><Plus size={12}/></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline View */}
        <div className="flex-1 flex flex-col relative bg-[#040506] overflow-x-auto overflow-y-hidden">
           {/* Timeline Header (Ruler) */}
           <div className="h-8 border-b border-[#30363d] bg-[#0d1117] sticky top-0 z-20 flex items-center min-w-max">
             {Array.from({ length: duration * 2 + 1 }).map((_, i) => (
                <div key={i} className="flex flex-col items-start" style={{ width: '100px' }}>
                  <span className="text-[10px] text-[#8b949e] pl-1">{i * 0.5}s</span>
                  <div className="h-2 w-[1px] bg-[#30363d]"></div>
                </div>
             ))}
           </div>
           
           {/* Playhead */}
           <div 
             className="absolute top-0 bottom-0 w-[1px] bg-[#f85149] z-30 pointer-events-none"
             style={{ left: `${(currentTime / duration) * (duration * 200)}px` }}
           >
             <div className="absolute top-0 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#f85149]"></div>
           </div>

           {/* Track Rows */}
           <div className="relative min-w-max" style={{ width: `${duration * 200}px` }}>
              {tracks.map(track => (
                <div key={track.id} className="relative border-b border-[#30363d]/30" style={{ height: track.isOpen ? '69px' : '33px' }}>
                    {/* Horizontal subdivisions */}
                    <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, #30363d 1px, transparent 1px)', backgroundSize: '100px 100px', opacity: 0.2 }}></div>
                    
                    {/* Keyframes */}
                    {track.keyframes.map(kf => (
                       <div 
                         key={kf.id}
                         onClick={() => setSelectedKeyframe(kf.id)}
                         className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 z-10 cursor-pointer transition-transform ${selectedKeyframe === kf.id ? 'scale-150 ring-2 ring-white ring-offset-1 ring-offset-[#0d1117]' : 'hover:scale-125'}`}
                         style={{ 
                           left: `${(kf.time / duration) * (duration * 200)}px`,
                           backgroundColor: track.color
                         }}
                         title={`Time: ${kf.time}s`}
                       />
                    ))}
                    
                    {/* Track connection line */}
                    {track.keyframes.length > 1 && (
                      <div className="absolute top-1/2 -translate-y-1/2 h-[2px] z-0 opacity-40 pointer-events-none" style={{ left: `${(track.keyframes[0].time / duration) * (duration * 200)}px`, right: `${100 - (track.keyframes[track.keyframes.length-1].time / duration)*100}%`, backgroundColor: track.color }} />
                    )}
                </div>
              ))}
           </div>
        </div>

        {/* Right Param Panel */}
        <div className="w-72 border-l border-[#30363d] bg-[#0d1117] flex flex-col shrink-0">
          <div className="h-8 border-b border-[#30363d] flex items-center px-4">
             <span className="text-[10px] font-bold text-[#c9d1d9] uppercase tracking-wider">Keyframe Properties</span>
          </div>
          <div className="p-4 flex flex-col gap-4">
             {selectedKeyframe && currentKeyframeObj && currentTrackOfKeyframe ? (
                <>
                  <div className="flex flex-col gap-1">
                     <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Target Track</label>
                     <div className="text-xs font-bold" style={{ color: currentTrackOfKeyframe.color }}>{currentTrackOfKeyframe.name}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                     <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Time (Seconds)</label>
                     <input type="number" step="0.1" value={currentKeyframeObj.time} readOnly className="bg-[#161b22] border border-[#30363d] p-1.5 rounded text-xs outline-none text-[#c9d1d9] font-mono" />
                  </div>
                  
                  <div className="h-[1px] bg-[#30363d] my-2"></div>
                  
                  <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Value Parameters</label>
                  
                  {currentTrackOfKeyframe.type === 'transform' && (
                     <div className="flex flex-col gap-3">
                       <div className="flex items-center gap-2">
                         <span className="text-[10px] text-[#8b949e] w-4">X</span>
                         <input type="text" defaultValue={currentKeyframeObj.value.position[0]} className="flex-1 bg-[#161b22] border border-[#30363d] p-1 rounded text-xs text-[#c9d1d9]" />
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="text-[10px] text-[#8b949e] w-4">Y</span>
                         <input type="text" defaultValue={currentKeyframeObj.value.position[1]} className="flex-1 bg-[#161b22] border border-[#30363d] p-1 rounded text-xs text-[#c9d1d9]" />
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="text-[10px] text-[#8b949e] w-4">Z</span>
                         <input type="text" defaultValue={currentKeyframeObj.value.position[2]} className="flex-1 bg-[#161b22] border border-[#30363d] p-1 rounded text-xs text-[#c9d1d9]" />
                       </div>
                     </div>
                  )}

                  {currentTrackOfKeyframe.type === 'animation' && (
                     <div className="flex flex-col gap-3">
                       <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-[#8b949e]">Animation Clip</label>
                          <input type="text" defaultValue={currentKeyframeObj.value.animName} className="bg-[#161b22] border border-[#30363d] p-1.5 rounded text-xs text-[#c9d1d9]" />
                       </div>
                       <div className="flex items-center gap-2 mt-2">
                         <input type="checkbox" defaultChecked={currentKeyframeObj.value.loop} className="accent-[#58a6ff]" />
                         <span className="text-[10px] text-[#c9d1d9]">Loop Animation</span>
                       </div>
                     </div>
                  )}

                  {currentTrackOfKeyframe.type === 'event' && (
                     <div className="flex flex-col gap-3">
                       <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-[#8b949e]">Trigger Call / Event ID</label>
                          <input type="text" defaultValue={currentKeyframeObj.value.eventID} className="bg-[#161b22] border border-[#30363d] p-1.5 rounded text-xs text-[#c9d1d9]" />
                       </div>
                       <div className="bg-[#21262d] border border-[#30363d] p-2 rounded relative group cursor-pointer hover:bg-[#30363d]">
                          <span className="text-[10px] text-[#8b949e] absolute top-1 right-2">Ref</span>
                          <div className="text-[11px] text-[#58a6ff] mb-1">Pass execution to LogicNode</div>
                          <div className="text-[10px] opacity-70">Will execute instantly when playhead arrives at {currentKeyframeObj.time}s.</div>
                       </div>
                     </div>
                  )}
                  
                </>
             ) : (
                <div className="flex flex-col items-center justify-center h-40 text-[#8b949e]">
                   <Settings size={24} className="mb-2 opacity-50" />
                   <span className="text-xs text-center">Select a keyframe on the timeline to edit manual sequence values.</span>
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
