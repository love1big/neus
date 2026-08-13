import React, { useState } from 'react';
import { Mic2, Play, Square, Settings, Volume2, Download, Save, RefreshCw, AudioLines } from 'lucide-react';

export default function VoiceActorAI() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#f85149]/20 border border-[#f85149]/50 rounded">
            <Mic2 className="text-[#f85149]" size={16} />
          </div>
          <div>
            <h1 className="font-bold text-sm">Neural Voice & Lip-Sync Dubbing</h1>
            <p className="text-[10px] text-[#8b949e]">Emotion-Mapped Text-to-Speech Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b] font-medium text-white">
             <RefreshCw size={14} /> Generate Audio
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Input & Emotion */}
        <div className="w-1/2 border-r border-[#30363d] bg-[#010409] flex flex-col z-10 shrink-0">
           
           <div className="p-4 border-b border-[#30363d]">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold text-[#8b949e]">DIALOGUE SCRIPT</span>
                 <span className="text-[10px] text-[#8b949e]">Length: 28s est.</span>
              </div>
              <textarea 
                 className="w-full h-48 bg-[#0d1117] border border-[#30363d] rounded p-3 text-sm text-white resize-none outline-none focus:border-[#f85149]/50 font-mono"
                 defaultValue="I told you not to go near the restricted zone! Now they know we're here. We need to leave, immediately, before the security drones arrive."
              ></textarea>
           </div>

           <div className="p-4 flex-1 overflow-y-auto">
              <div className="text-xs font-bold text-[#8b949e] mb-4">EMOTION MAPPING (SSML TUNING)</div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                       <span>Anger / Intensity</span><span>80%</span>
                    </div>
                    <input type="range" className="w-full accent-[#f85149]" min="0" max="100" defaultValue="80" />
                 </div>
                 <div>
                    <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                       <span>Fear / Panic</span><span>45%</span>
                    </div>
                    <input type="range" className="w-full accent-[#58a6ff]" min="0" max="100" defaultValue="45" />
                 </div>
                 <div>
                    <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                       <span>Pacing (Speed)</span><span>1.2x</span>
                    </div>
                    <input type="range" className="w-full accent-[#3fb950]" min="0" max="200" defaultValue="120" />
                 </div>
                 <div>
                    <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                       <span>Pitch Variation</span><span>+15%</span>
                    </div>
                    <input type="range" className="w-full accent-[#d29922]" min="0" max="100" defaultValue="65" />
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Output & Setup */}
        <div className="flex-1 bg-[#161b22] flex flex-col relative overflow-hidden">
           
           <div className="p-4 border-b border-[#30363d] flex gap-4">
              <div className="flex-1">
                 <div className="text-xs text-[#8b949e] mb-1">Voice Actor Profile</div>
                 <select className="w-full bg-[#0d1117] border border-[#30363d] text-white text-xs p-1.5 rounded outline-none">
                    <option>Male - Gruff Soldier (ID: 042)</option>
                    <option>Female - AI Companion (ID: 091)</option>
                    <option>Monster - Deep Growl (ID: 666)</option>
                 </select>
              </div>
              <div className="flex-1">
                 <div className="text-xs text-[#8b949e] mb-1">Language / Accent</div>
                 <select className="w-full bg-[#0d1117] border border-[#30363d] text-white text-xs p-1.5 rounded outline-none">
                    <option>English (US - Cinematic)</option>
                    <option>English (UK - RP)</option>
                    <option>Japanese (Anime Hero)</option>
                 </select>
              </div>
           </div>

           <div className="flex-1 p-4 flex flex-col justify-center items-center">
              
              <div className="w-full max-w-md bg-[#0d1117] border border-[#30363d] rounded-lg p-6 shadow-xl text-center">
                 <AudioLines size={48} className="text-[#8b949e] mx-auto mb-4 opacity-50" />
                 
                 <div className="flex justify-center gap-4 mb-6">
                    <button className="w-12 h-12 bg-[#21262d] border border-[#30363d] rounded-full flex items-center justify-center text-white hover:bg-[#f85149] transition-colors" onClick={() => setIsPlaying(!isPlaying)}>
                       {isPlaying ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>
                 </div>

                 <div className="w-full h-2 bg-[#161b22] rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[#f85149]" style={{ width: isPlaying ? '60%' : '0%', transition: 'width 2s linear' }}></div>
                 </div>
                 <div className="flex justify-between text-[10px] text-[#8b949e] font-mono">
                    <span>00:00</span>
                    <span>00:28</span>
                 </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                 <button className="px-4 py-2 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
                    <Download size={14} /> Download .WAV
                 </button>
                 <button className="px-4 py-2 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
                    <Save size={14} /> Export Lip-Sync Data (.json)
                 </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
