import React, { useState } from 'react';
import { Music, Mic, Play, Pause, Square, Settings, Volume2, Save, Download, FileAudio, Sliders, Radio, Sparkles, AudioWaveform, Activity } from 'lucide-react';

export default function VoiceMusicStudio() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-fuchsia-500 to-purple-700 p-1.5 rounded-lg shadow-lg">
            <Music size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">AI <span className="text-fuchsia-400">Audio Studio</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Generative Music & Vocal Synthesis</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="bg-[#333] hover:bg-[#444] px-3 py-1.5 rounded text-[10px] font-bold text-gray-300 transition-colors flex items-center gap-2">
             <Download size={14}/> EXPORT STEMS
           </button>
           <button className="flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-3 py-1.5 rounded text-[10px] font-bold transition-colors shadow-[0_0_10px_rgba(217,70,239,0.4)]">
             <Sparkles size={14}/> GENERATE TRACK
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Prompt & Settings */}
        <div className="w-80 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Sparkles size={14}/> AI Director</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
             
             {/* Prompt Input */}
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Musical Prompt</label>
                <textarea 
                  className="w-full h-24 bg-[#1a1a1c] border border-[#3e3e42] rounded p-2 text-sm text-gray-200 resize-none focus:border-fuchsia-500 outline-none"
                  defaultValue="Epic orchestral battle theme, heavy brass, driving taiko drums, sudden string staccatos, dramatic choir buildup at 1:20. Final Fantasy style boss fight."
                />
             </div>

             <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">AI Model</h4>
                 <select className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1.5 text-xs text-gray-200 outline-none">
                    <option>MusicGen (Meta) - High Fidelity</option>
                    <option>Suno AI v3 - Vocal Bias</option>
                    <option>AudioLDM 2 - SFX & Ambient</option>
                 </select>
             </div>

             <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Parameters</h4>
                 <div className="space-y-4 text-[10px]">
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>BPM (Tempo)</span>
                        <span className="text-white">128</span>
                      </div>
                      <input type="range" defaultValue="128" min="60" max="200" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-fuchsia-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Creativity (Temperature)</span>
                        <span className="text-white">0.75</span>
                      </div>
                      <input type="range" defaultValue="75" max="100" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-fuchsia-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1">
                        <span>Duration (Seconds)</span>
                        <span className="text-white">120s</span>
                      </div>
                      <input type="range" defaultValue="120" max="300" className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none accent-fuchsia-500" />
                    </div>
                 </div>
             </div>

             <div className="space-y-3">
                 <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Vocal Synthesis</h4>
                 <div className="space-y-2">
                    <select className="w-full bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1.5 text-xs text-gray-200 outline-none">
                       <option>No Vocals (Instrumental)</option>
                       <option>Female Opera Choir</option>
                       <option>Male Gregorian Chant</option>
                       <option>Custom Voice Clone (Selected)</option>
                    </select>
                    <textarea 
                      className="w-full h-16 bg-[#1a1a1c] border border-[#3e3e42] rounded p-2 text-xs text-gray-400 resize-none focus:border-fuchsia-500 outline-none"
                      placeholder="Enter lyrics here..."
                      defaultValue="Gloria, in excelsis deo, victor est in proelio..."
                    />
                 </div>
             </div>

          </div>
        </div>

        {/* Center Workspace */}
        <div className="flex-1 bg-[#121212] flex flex-col overflow-hidden relative">
           
           {/* Timeline Header */}
           <div className="h-12 bg-[#1a1a1c] border-b border-[#3e3e42] flex items-center px-4 gap-4 shrink-0">
              <div className="flex items-center gap-1">
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 rounded bg-fuchsia-600 hover:bg-fuchsia-500 text-white flex items-center justify-center shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                  {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
                </button>
                <button className="w-8 h-8 rounded hover:bg-[#333] text-gray-400 flex items-center justify-center"><Square size={16}/></button>
              </div>
              <div className="h-6 w-px bg-[#3e3e42]"></div>
              <div className="text-xs font-mono text-fuchsia-400 font-bold w-20">01:24.300</div>
              <div className="flex-1"></div>
              <div className="flex items-center gap-2">
                <Volume2 size={14} className="text-gray-400"/>
                <input type="range" defaultValue="80" className="w-24 h-1 bg-[#3e3e42] rounded-lg appearance-none accent-gray-400" />
              </div>
           </div>
           
           {/* Tracks Area */}
           <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#1a1a1c] p-2 space-y-1">
              
              {/* Playhead */}
              <div className={`absolute top-0 bottom-0 w-px bg-fuchsia-500 z-50 transition-all duration-100 ${isPlaying ? 'left-1/2 shadow-[0_0_5px_rgba(217,70,239,1)]' : 'left-32'}`}>
                <div className="w-3 h-3 bg-fuchsia-500 rounded-sm -translate-x-[5px] flex items-center justify-center">
                  <div className="w-0.5 h-1.5 bg-white"></div>
                </div>
              </div>

              {/* Master Mix */}
              <div className="flex h-20 bg-[#252526] rounded border border-[#3e3e42] overflow-hidden group">
                 <div className="w-48 bg-[#1a1a1c] border-r border-[#3e3e42] p-2 flex flex-col justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <FileAudio size={12} className="text-fuchsia-400"/>
                      <span className="text-[10px] font-bold text-gray-200">Master Mix</span>
                    </div>
                    <div className="flex gap-1 text-[9px]">
                      <button className="bg-[#333] px-1.5 rounded hover:bg-[#444]">M</button>
                      <button className="bg-[#333] px-1.5 rounded hover:bg-[#444]">S</button>
                    </div>
                 </div>
                 <div className="flex-1 relative bg-[#111] overflow-hidden flex items-center px-1">
                    {/* Fake Waveform */}
                    <div className="w-[80%] h-12 bg-fuchsia-900/30 rounded border border-fuchsia-500/30 relative flex items-center justify-center overflow-hidden">
                       <svg className="w-full h-full opacity-70" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <path d="M0,50 L2,40 L4,60 L6,30 L8,70 L10,20 L12,80 L14,40 L16,60 L18,50 L20,40 L22,60 L24,20 L26,80 L28,45 L30,55 L32,10 L34,90 L36,40 L38,60 L40,50 L42,30 L44,70 L46,20 L48,80 L50,50 L52,40 L54,60 L56,10 L58,90 L60,30 L62,70 L64,40 L66,60 L68,50 L70,30 L72,70 L74,20 L76,80 L78,40 L80,60 L82,50 L84,40 L86,60 L88,30 L90,70 L92,50 L94,40 L96,60 L98,50 L100,50" fill="none" stroke="#d946ef" strokeWidth="0.5"/>
                       </svg>
                    </div>
                 </div>
              </div>

              {/* Stem: Strings */}
              <div className="flex h-16 bg-[#252526] rounded border border-[#3e3e42] overflow-hidden opacity-80 hover:opacity-100">
                 <div className="w-48 bg-[#1a1a1c] border-r border-[#3e3e42] p-2 flex flex-col justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <Music size={12} className="text-blue-400"/>
                      <span className="text-[10px] font-bold text-gray-200">Strings / Orchestral</span>
                    </div>
                 </div>
                 <div className="flex-1 relative bg-[#111] overflow-hidden flex items-center px-1">
                    <div className="w-[60%] ml-[10%] h-10 bg-blue-900/30 rounded border border-blue-500/30 relative flex items-center">
                      <svg className="w-full h-full opacity-70" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="#3b82f6" strokeWidth="1"/>
                       </svg>
                    </div>
                 </div>
              </div>

              {/* Stem: Percussion */}
              <div className="flex h-16 bg-[#252526] rounded border border-[#3e3e42] overflow-hidden opacity-80 hover:opacity-100">
                 <div className="w-48 bg-[#1a1a1c] border-r border-[#3e3e42] p-2 flex flex-col justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <Activity size={12} className="text-orange-400"/>
                      <span className="text-[10px] font-bold text-gray-200">Taiko Drums</span>
                    </div>
                 </div>
                 <div className="flex-1 relative bg-[#111] overflow-hidden flex items-center px-1">
                    <div className="w-[70%] ml-[5%] h-10 bg-orange-900/30 rounded border border-orange-500/30 relative flex items-center">
                       <svg className="w-full h-full opacity-70" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <path d="M0,50 L5,10 L10,50 L15,10 L20,50 L50,50 L55,10 L60,50 L100,50" fill="none" stroke="#f97316" strokeWidth="1"/>
                       </svg>
                    </div>
                 </div>
              </div>

              {/* Stem: Vocals */}
              <div className="flex h-16 bg-[#252526] rounded border border-[#3e3e42] overflow-hidden opacity-80 hover:opacity-100">
                 <div className="w-48 bg-[#1a1a1c] border-r border-[#3e3e42] p-2 flex flex-col justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <Mic size={12} className="text-emerald-400"/>
                      <span className="text-[10px] font-bold text-gray-200">Choir Vocals</span>
                    </div>
                 </div>
                 <div className="flex-1 relative bg-[#111] overflow-hidden flex items-center px-1">
                    <div className="w-[40%] ml-[30%] h-10 bg-emerald-900/30 rounded border border-emerald-500/30 relative flex items-center">
                       <svg className="w-full h-full opacity-70" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <path d="M0,50 Q20,30 40,60 T80,40 T100,50" fill="none" stroke="#10b981" strokeWidth="1"/>
                       </svg>
                    </div>
                 </div>
              </div>

           </div>
           
        </div>
      </div>
    </div>
  );
}
