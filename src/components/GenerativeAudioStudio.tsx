import React, { useState } from 'react';
import { Music, Play, Pause, FastForward, Settings, Volume2, Wand2, Download, Layers, Mic2, Shuffle, Check } from 'lucide-react';

export default function GenerativeAudioStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [prompt, setPrompt] = useState('Epic orchestral battle music with heavy brass, driving taiko drums, and a soaring choir climax, 120 BPM');
  
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Header */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-pink-500 to-rose-700 p-1.5 rounded-lg shadow-lg">
            <Music size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">AI Audio <span className="text-pink-400">Studio</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Generative Music & SFX</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Prompt & Gen */}
        <div className="w-[400px] bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[5px_0_20px_rgba(0,0,0,0.3)]">
           <div className="p-4 border-b border-[#3e3e42]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-3 flex items-center gap-2"><Wand2 size={14}/> Text to Audio</h3>
             <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               className="w-full h-32 bg-[#1a1a1c] border border-[#3e3e42] rounded-lg p-3 text-sm text-gray-300 resize-none focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all custom-scrollbar"
               placeholder="Describe the music or sound effect..."
             />
             <div className="mt-3 flex gap-2">
               <button className="flex-1 bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 rounded flex justify-center items-center gap-2 text-xs transition-colors shadow-[0_0_10px_rgba(236,72,153,0.3)]">
                 <Wand2 size={14} /> GENERATE AUDIO
               </button>
             </div>
           </div>

           <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-pink-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Generation Settings</h4>
                
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Duration</span>
                    <select className="bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-gray-200 outline-none">
                      <option>30 seconds</option>
                      <option>1 minute</option>
                      <option>3 minutes</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Model</span>
                    <select className="bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-gray-200 outline-none">
                      <option>MusicGen v2 (Stereo)</option>
                      <option>AudioLDM (SFX)</option>
                      <option>Bark (Vocals)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-pink-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Stem Separation</h4>
                 <label className="flex items-center gap-2 text-[10px] text-gray-300">
                    <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-pink-500 focus:ring-0" /> Split into Vocals, Drums, Bass, Other
                 </label>
              </div>
           </div>
        </div>

        {/* Center: Timeline & Tracks */}
        <div className="flex-1 bg-[#121212] flex flex-col">
          
          {/* Top transport bar */}
          <div className="h-12 bg-[#1a1a1c] border-b border-[#3e3e42] flex items-center px-4 justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white hover:bg-pink-500">
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-1" />}
              </button>
              <div className="text-xs font-mono text-gray-400 bg-[#000] px-3 py-1 rounded border border-[#3e3e42]">
                00:14.520
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Volume2 size={16} />
              <input type="range" className="w-24 h-1 bg-[#3e3e42] rounded-lg appearance-none accent-pink-500" />
            </div>
          </div>

          {/* Tracks Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar relative">
             
             {/* Playhead line */}
             <div className="absolute top-0 bottom-0 left-[30%] w-px bg-pink-500 z-20 shadow-[0_0_5px_rgba(236,72,153,1)]"></div>

             {['Master', 'Vocals', 'Drums', 'Bass', 'Melody'].map((track, i) => (
               <div key={i} className="flex h-24 bg-[#1a1a1c] border border-[#3e3e42] rounded overflow-hidden">
                 {/* Track Header */}
                 <div className="w-48 bg-[#252526] border-r border-[#3e3e42] p-2 flex flex-col justify-between z-10 shrink-0">
                   <div className="flex justify-between items-center">
                     <span className={`text-xs font-bold ${i===0 ? 'text-pink-400' : 'text-gray-300'}`}>{track}</span>
                     <div className="flex gap-1">
                       <button className="w-5 h-5 rounded bg-[#333] text-[9px] font-bold text-gray-400 hover:text-white flex justify-center items-center">M</button>
                       <button className="w-5 h-5 rounded bg-[#333] text-[9px] font-bold text-gray-400 hover:text-white flex justify-center items-center">S</button>
                     </div>
                   </div>
                   <input type="range" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-gray-400" />
                 </div>
                 
                 {/* Track Content (Waveform mockup) */}
                 <div className="flex-1 relative bg-[#0a0a0c] overflow-hidden flex items-center px-2">
                   {/* Fake waveform bars */}
                   <div className="w-full h-16 flex items-center gap-[2px] opacity-80">
                     {Array.from({length: 150}).map((_, j) => {
                       const height = Math.random() * (i === 0 ? 100 : i === 1 ? 40 : i === 2 ? 80 : 60);
                       return (
                         <div key={j} className={`w-1 rounded-full ${i === 0 ? 'bg-pink-500' : 'bg-indigo-400'}`} style={{ height: `${Math.max(10, height)}%` }}></div>
                       )
                     })}
                   </div>
                 </div>
               </div>
             ))}

          </div>

        </div>

      </div>
    </div>
  );
}
