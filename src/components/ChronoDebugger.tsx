import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, FastForward, Rewind, Activity} from 'lucide-react';

interface ChronoDebuggerProps {
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
}

export default function ChronoDebugger({ isSimulating, setIsSimulating }: ChronoDebuggerProps) {
  const [timeline, setTimeline] = useState(100);
  const [isPlaying, setIsPlaying] = useState(isSimulating);
  const [showData, setShowData] = useState(false);

  // Mock data of recorded variables over time
  const recordedVars = [
    { name: 'player.velocity.y', value: (Math.sin(timeline * 0.1) * 10).toFixed(2) },
    { name: 'player.position.x', value: (timeline * 0.5).toFixed(2) },
    { name: 'enemy_count', value: Math.max(0, 10 - Math.floor(timeline / 20)) },
    { name: 'isGrounded', value: timeline % 20 < 10 ? 'true' : 'false' },
    { name: 'memory_buffer', value: '14.2 MB' }
  ];

  return (
    <div className="h-full w-full flex flex-col bg-[#0d1117] border-t border-[#30363d] select-none text-xs text-[#c9d1d9] overflow-hidden">
      
      {/* Tool Header */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center space-x-2">
          <Activity size={14} className="text-[#a371f7]" />
          <span className="font-semibold text-[#e6edf3]">Chrono-State Debugger</span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#a371f7]/20 text-[#a371f7] text-[10px] uppercase font-bold ml-2 tracking-wider">
            Time-Weaver Engine
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setShowData(!showData)} className={`hover:text-white transition-colors py-1 ${showData ? 'text-[#58a6ff]' : ''}`}>
            State Inspector
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        
        {/* Timeline Control section */}
        <div className="flex-1 flex flex-col p-2 min-w-0">
          
          <div className="flex-1 flex flex-col justify-center space-y-4 px-4">
            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button title="Step Back (Frame -1)" onClick={() => setTimeline(t => Math.max(0, t - 1))} className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-colors">
                <SkipBack size={16} />
              </button>
              <button title="Rewind Time" onClick={() => setTimeline(t => Math.max(0, t - 10))} className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-colors">
                <Rewind size={16} />
              </button>
              
              <button 
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  setIsSimulating(!isPlaying);
                }} 
                className={`p-2 rounded-full transition-colors flex items-center justify-center ${isPlaying ? 'bg-[#3fb950] text-[#0d1117]' : 'bg-[#e3b341] text-[#0d1117]'}`}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
              </button>

              <button title="Fast Forward Time" onClick={() => setTimeline(t => Math.min(100, t + 10))} className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-colors">
                <FastForward size={16} />
              </button>
              <button title="Step Forward (Frame +1)" onClick={() => setTimeline(t => Math.min(100, t + 1))} className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-colors">
                <SkipForward size={16} />
              </button>
            </div>

            {/* Slider */}
            <div className="relative pt-2 pb-4">
              <div className="absolute top-0 left-0 w-full flex justify-between text-[10px] text-[#8b949e] px-1 pointer-events-none">
                <span>T-Minus 5s</span>
                <span>T-Minus 2.5s</span>
                <span>Present [Frame 4,028]</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={timeline}
                onChange={(e) => setTimeline(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-[#a371f7]"
                style={{
                  background: `linear-gradient(to right, #a371f7 ${timeline}%, #30363d ${timeline}%)`
                }}
              />
              {/* Tick marks */}
              <div className="absolute top-2 w-full flex justify-between px-1 pointer-events-none h-1.5">
                {[...Array(11)].map((_, i) => (
                   <div key={i} className="w-[1px] h-2 bg-[#8b949e] opacity-50 relative -top-0.5"></div>
                ))}
              </div>
            </div>
            
          </div>
          
        </div>

        {/* State Inspector Sidebar */}
        {showData && (
          <div className="w-64 border-l border-[#30363d] bg-[#0d1117] flex flex-col">
             <div className="px-3 py-1.5 border-b border-[#30363d] text-[#8b949e] font-semibold text-[10px] uppercase tracking-wider bg-[#161b22]">
                Snapshot at Frame {4028 - (100 - timeline) * 5}
             </div>
             <div className="p-2 space-y-1.5 overflow-y-auto">
               <div className="text-[10px] text-[#a371f7] mb-1">LOCAL VARIABLES</div>
               {recordedVars.map((v, i) => (
                 <div key={i} className="flex justify-between items-center bg-[#21262d] px-2 py-1 rounded border border-[#30363d]/50">
                    <span className="text-[#79c0ff] font-mono trunc">{v.name}</span>
                    <span className="text-[#a5d6ff] font-mono">{v.value}</span>
                 </div>
               ))}
               
               <div className="text-[10px] text-[#f85149] mt-3 mb-1 pt-2 border-t border-[#30363d]/50">CALL STACK (REVERTED)</div>
               <div className="space-y-1">
                 <div className="text-[#8b949e] font-mono text-[10px] bg-[#161b22] px-2 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis">
                   at PlayerController.Update (line 42)
                 </div>
                 <div className="text-[#8b949e] font-mono text-[10px] bg-[#161b22] px-2 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis">
                   at PhysicsEngine.Step (line 128)
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>

    </div>
  );
}
