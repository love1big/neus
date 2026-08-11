import React, { useState } from 'react';
import { 
  Mic2, Music, Sliders, Volume2, Play, Pause, Square, SkipBack, SkipForward, Settings2, Activity, Save, Disc, Radio, Keyboard, AlignLeft, Download, Upload, Scissors, Copy, Layers, AudioWaveform, Globe, Sparkles} from 'lucide-react';

export default function OmniAudioDSPStudio() {
  const [activeTab, setActiveTab] = useState('Daw');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0E0E10] text-[#ccc] font-sans text-xs overflow-hidden select-none">
      
      {/* 💥 ELITE TOP NAVBAR 💥 */}
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1.5 rounded border border-[#333] shadow-inner items-center gap-2">
                   <AudioWaveform size={18} className="text-[#e3b341] animate-pulse"/>
                   <span className="text-white font-black tracking-widest text-[12px] uppercase" style={{textShadow: '0 0 10px rgba(227,179,65,0.5)'}}>Omni Audio DSP Studio</span>
                   <span className="text-[#666] font-mono text-[9px] ml-2">Mastering Edition</span>
                </div>
                <div className="h-6 w-px bg-[#333]"></div>
                <div className="flex text-[10px] font-mono gap-5 text-[#8b949e]">
                   <span className="flex items-center gap-1"><Activity size={12} className="text-[#3fb950]"/> CPU: 12%</span>
                   <span className="flex items-center gap-1"><Disc size={12} className="text-[#bc8cff]"/> Memory: 2.1GB</span>
                   <span className="flex items-center gap-1"><Globe size={12} className="text-[#58a6ff]"/> Sample Rate: 96kHz / 32-bit Float</span>
                </div>
            </div>
            
            {/* Global Transport Controls */}
            <div className="flex bg-[#000] border border-[#333] rounded overflow-hidden shadow-inner font-bold text-[10px]">
               <button className="px-3 py-1 bg-[#1a1a1a] hover:bg-[#222] transition"><SkipBack size={14}/></button>
               <button onClick={() => setIsPlaying(!isPlaying)} className={`px-4 py-1 transition flex items-center justify-center min-w-[50px] ${isPlaying ? 'bg-[#3fb950] text-[#000] hover:bg-[#2ea043]' : 'bg-[#1a1a1a] text-[#3fb950] hover:bg-[#222]'}`}>
                  {isPlaying ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>}
               </button>
               <button onClick={() => setIsPlaying(false)} className="px-3 py-1 bg-[#1a1a1a] hover:bg-[#222] transition text-[#f85149]"><Square size={14} fill="currentColor"/></button>
               <button className="px-3 py-1 bg-[#1a1a1a] hover:bg-[#222] transition"><SkipForward size={14}/></button>
               <button className="px-3 py-1 bg-[#1a1a1a] border-l border-[#333] hover:bg-[#222] text-[#f85149] transition flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f85149]"></div> REC</button>
            </div>

            <div className="flex items-center gap-2">
                 <div className="font-mono text-[#3fb950] bg-[#000] border border-[#333] px-3 py-1.5 rounded text-[14px]">
                    00:04:22<span className="text-[#666]">.850</span>
                 </div>
                 <button className="px-5 py-1.5 bg-[#e3b341]/10 text-[#e3b341] font-black rounded shadow-[0_0_15px_rgba(227,179,65,0.2)] hover:bg-[#e3b341]/20 transition flex items-center gap-2 text-[11px] uppercase tracking-widest border border-[#e3b341]/50"><Download size={12}/> Render Track</button>
            </div>
         </div>

         <div className="flex px-2 bg-[#0a0a0a] border-t border-[#222]">
            <ModuleTab active={activeTab === 'Daw'} onClick={() => setActiveTab('Daw')} icon={<AlignLeft size={12}/>} label="1. Multitrack DAW" color="text-[#3fb950]"/>
            <ModuleTab active={activeTab === 'PianoRoll'} onClick={() => setActiveTab('PianoRoll')} icon={<Keyboard size={12}/>} label="2. MIDI Piano Roll" color="text-[#bc8cff]"/>
            <ModuleTab active={activeTab === 'Mixer'} onClick={() => setActiveTab('Mixer')} label="3. VST Mixer Rack" icon={<Sliders size={12}/>} color="text-[#e3b341]"/>
            <ModuleTab active={activeTab === 'Dubbing'} onClick={() => setActiveTab('Dubbing')} label="4. Voice & LipSync" icon={<Mic2 size={12}/>}  color="text-[#58a6ff]"/>
            <ModuleTab active={activeTab === 'OST'} onClick={() => setActiveTab('OST')} label="5. Procedural OST" icon={<Music size={12}/>}  color="text-[#f85149]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-full h-full p-2 flex gap-2 w-full h-full">

           {/* DAW VIEW */}
           {activeTab === 'Daw' && (
              <>
                 {/* Track Headers */}
                 <div className="w-[240px] flex flex-col gap-1 bg-[#111] border border-[#222] rounded p-1 shrink-0 overflow-y-auto custom-scrollbar">
                    <TrackHeader name="Vocals Main" color="bg-[#58a6ff]"/>
                    <TrackHeader name="Rhythm Guit" color="bg-[#e3b341]"/>
                    <TrackHeader name="Bass DI" color="bg-[#f85149]"/>
                    <TrackHeader name="Drum Bus" color="bg-[#3fb950]"/>
                    <TrackHeader name="Synth Pad" color="bg-[#bc8cff]"/>
                    <TrackHeader name="FX Sweeps" color="bg-[#888]"/>
                 </div>
                 {/* Timeline View */}
                 <div className="flex-1 bg-[#111] border border-[#222] rounded relative overflow-hidden flex flex-col">
                     <div className="h-6 w-full bg-[#1a1a1a] border-b border-[#333] flex items-end">
                        <div className="w-full flex justify-between px-2 text-[9px] text-[#666] font-mono">
                           <span>0:00</span><span>0:15</span><span>0:30</span><span>0:45</span><span>1:00</span>
                        </div>
                     </div>
                     <div className="flex-1 relative overflow-hidden flex flex-col gap-1 p-1">
                        {/* Playhead */}
                        <div className={`absolute left-[35%] top-0 bottom-0 w-[1px] bg-[#e3b341] z-30 pointer-events-none ${isPlaying ? 'animate-[pulse_1s_infinite]' : ''}`}>
                            <div className="absolute top-0 -translate-x-[45%] w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#e3b341]"></div>
                        </div>
                        
                        {/* Timeline Regions */}
                        <TimelineRegion color="bg-[#58a6ff]" />
                        <TimelineRegion color="bg-[#e3b341]" />
                        <TimelineRegion color="bg-[#f85149]" />
                        <TimelineRegion color="bg-[#3fb950]" />
                        <TimelineRegion color="bg-[#bc8cff]" />
                        <TimelineRegion color="bg-[#888]" />
                     </div>
                 </div>
              </>
           )}

           {/* MIXER RACK */}
           {activeTab === 'Mixer' && (
              <div className="w-full h-full bg-[#111] border border-[#222] rounded p-4 flex gap-4 overflow-x-auto custom-scrollbar">
                 <MixerStrip name="Vocals" val="-4.2" meter={70} color="bg-[#58a6ff]"/>
                 <MixerStrip name="Guitar" val="-12.1" meter={40} color="bg-[#e3b341]"/>
                 <MixerStrip name="Bass" val="-6.5" meter={60} color="bg-[#f85149]"/>
                 <MixerStrip name="Drums" val="-2.0" meter={85} color="bg-[#3fb950]"/>
                 <MixerStrip name="Synth" val="-18.4" meter={25} color="bg-[#bc8cff]"/>
                 
                 <div className="w-2 h-full bg-[#000] rounded-full mx-2 border border-[#333]"></div>
                 
                 <MixerStrip name="MASTER" val="-0.1" meter={95} color="bg-gradient-to-t from-[#3fb950] via-[#e3b341] to-[#f85149]" isMaster/>
              </div>
           )}

           {/* PIANO ROLL */}
           {activeTab === 'PianoRoll' && (
              <div className="w-full h-full bg-[#111] border border-[#222] rounded flex flex-col overflow-hidden relative">
                 <div className="p-2 border-b border-[#222] flex justify-between bg-[#0a0a0a]">
                     <div className="flex gap-2">
                        <select className="bg-[#1a1a1a] border border-[#333] text-[#ccc] rounded px-2 py-1 outline-none text-[10px]"><option>1/16 Quantize</option></select>
                        <select className="bg-[#1a1a1a] border border-[#333] text-[#ccc] rounded px-2 py-1 outline-none text-[10px]"><option>Legato Curve</option></select>
                        <select className="bg-[#1a1a1a] border border-[#333] text-[#ccc] rounded px-2 py-1 outline-none text-[10px]"><option>Channel 1 (Lead)</option></select>
                     </div>
                     <button className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 text-[#bc8cff] px-3 py-1 rounded hover:bg-[#bc8cff]/20 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <Sparkles size={10}/> AI Generate Melody
                     </button>
                 </div>
                 <div className="flex flex-1">
                     <div className="w-[60px] flex flex-col border-r border-[#333] bg-[#fff] justify-around py-2">
                         <div className="h-[20px] bg-white border-b border-[#ccc] flex items-center pl-1 text-[8px] text-black w-full relative"><span className="z-10">C5</span><div className="absolute right-0 top-0 bottom-0 w-[60%] bg-black"></div></div>
                         <div className="h-[20px] bg-white border-b border-[#ccc] flex items-center pl-1 text-[8px] text-black w-full relative"><span className="z-10">B4</span><div className="absolute right-0 top-0 bottom-0 w-[60%] bg-black"></div></div>
                         <div className="h-[20px] bg-white border-b border-[#ccc] flex items-center pl-1 text-[8px] text-black w-full relative"><span className="z-10">A4</span><div className="absolute right-0 top-0 bottom-0 w-[60%] bg-black"></div></div>
                         <div className="h-[20px] bg-white border-b border-[#ccc] flex items-center pl-1 text-[8px] text-black w-full relative"><span className="z-10">G4</span><div className="absolute right-0 top-0 bottom-0 w-[60%] bg-black"></div></div>
                         <div className="h-[20px] bg-white border-b border-[#ccc] flex items-center pl-1 text-[8px] text-black w-full relative"><span className="z-10">F4</span><div className="absolute right-0 top-0 bottom-0 w-[60%] bg-black"></div></div>
                         <div className="h-[20px] bg-white border-b border-[#ccc] flex items-center pl-1 text-[8px] text-black w-full relative"><span className="z-10">E4</span><div className="absolute right-0 top-0 bottom-0 w-[60%] bg-black"></div></div>
                         <div className="h-[20px] bg-white border-b border-[#ccc] flex items-center pl-1 text-[8px] text-black w-full relative"><span className="z-10">D4</span><div className="absolute right-0 top-0 bottom-0 w-[60%] bg-black"></div></div>
                         <div className="h-[20px] bg-[#e3e3e3] border-b border-[#aaa] flex items-center pl-1 text-[8px] text-black font-bold w-full relative"><span className="z-10">C4</span></div>
                     </div>
                     <div className="flex-1 bg-[#1a1a1a] relative" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 20px' }}>
                         <div className="absolute top-[80px] left-[40px] w-[80px] h-[18px] bg-[#bc8cff] border border-white rounded-[2px] opacity-80 shadow-[0_0_10px_#bc8cff]"></div>
                         <div className="absolute top-[120px] left-[120px] w-[40px] h-[18px] bg-[#58a6ff] border border-white rounded-[2px] opacity-80 shadow-[0_0_10px_#58a6ff]"></div>
                         <div className="absolute top-[60px] left-[160px] w-[120px] h-[18px] bg-[#bc8cff] border border-white rounded-[2px] opacity-80 shadow-[0_0_10px_#bc8cff]"></div>
                         <div className="absolute top-[140px] left-[280px] w-[80px] h-[18px] bg-[#58a6ff] border border-white rounded-[2px] opacity-80 shadow-[0_0_10px_#58a6ff]"></div>
                     </div>
                 </div>
              </div>
           )}

           {/* DUBBING & LIP SYNC */}
           {activeTab === 'Dubbing' && (
              <div className="w-full h-full flex gap-2">
                 <div className="w-[300px] bg-[#111] border border-[#222] rounded flex flex-col p-4 shrink-0">
                    <h3 className="text-[#58a6ff] font-bold uppercase tracking-wider mb-4 border-b border-[#333] pb-2">AI Voice Synthesis</h3>
                    <textarea className="w-full h-32 bg-[#0a0a0a] border border-[#333] rounded p-2 text-[#ccc] outline-none resize-none mb-3" placeholder="Enter dialogue here..."></textarea>
                    
                    <label className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-1">Voice Actor Model</label>
                    <select className="w-full bg-[#1a1a1a] border border-[#333] text-white p-2 rounded mb-3">
                       <option>Geralt (Gruff Male)</option>
                       <option>Cortana (AI Female)</option>
                       <option>Commander (Strict Male)</option>
                       <option>Narrator (Deep Epic)</option>
                    </select>

                    <button className="w-full bg-[#58a6ff] text-black font-bold py-2 rounded mt-auto flex items-center justify-center gap-2 uppercase tracking-wide"><Mic2 size={14}/> Generate Audio & LipSync</button>
                 </div>
                 <div className="flex-1 bg-[#111] border border-[#222] rounded flex flex-col items-center justify-center relative">
                     <div className="text-[14px] font-bold text-[#888] mb-4">Lip-Sync Phoneme Extraction Graph</div>
                     <div className="w-[80%] h-32 bg-[#0a0a0a] border border-[#333] rounded relative overflow-hidden flex items-center p-2">
                         <div className="flex w-full justify-between items-center h-full px-4">
                            <span className="text-[#58a6ff] font-bold text-[24px]">O</span>
                            <span className="text-[#3fb950] font-bold text-[24px]">AA</span>
                            <span className="text-[#e3b341] font-bold text-[24px]">EH</span>
                            <span className="text-[#bc8cff] font-bold text-[24px]">FV</span>
                            <span className="text-[#f85149] font-bold text-[24px]">MBP</span>
                         </div>
                         {/* Waveform line */}
                         <svg className="absolute w-full h-full inset-0 pointer-events-none opacity-50"><path d="M0 64 Q 50 10, 100 64 T 200 64 T 300 64 T 400 64 T 500 64 T 600 64 T 700 64" stroke="#58a6ff" fill="none" strokeWidth="2"/></svg>
                     </div>
                 </div>
              </div>
           )}

           {/* PROCEDURAL OST */}
           {activeTab === 'OST' && (
              <div className="w-full h-full bg-[#111] border border-[#222] rounded flex flex-col p-6 items-center justify-center relative">
                  <div className="absolute inset-0 bg-[#f85149] opacity-[0.02] mix-blend-color-dodge"></div>
                  <Music size={48} className="text-[#f85149] mb-6 animate-bounce" />
                  <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Adaptive Dynamic OST Engine</h2>
                  <p className="text-[#888] max-w-md text-center mb-8">AI-driven multi-stem procedural orchestration system. Automatically composes layered tracks that transition dynamically based on gameplay tension.</p>
                  
                  <div className="flex gap-4">
                     <div className="bg-[#1a1a1a] border border-[#f85149]/50 p-4 rounded text-center w-40 cursor-pointer hover:bg-[#f85149]/10 transition">
                         <div className="text-white font-bold mb-1 uppercase tracking-wide">Combat Tension</div>
                         <div className="text-[#f85149] text-[24px] font-mono">140 BPM</div>
                     </div>
                     <div className="bg-[#1a1a1a] border border-[#58a6ff]/50 p-4 rounded text-center w-40 cursor-pointer hover:bg-[#58a6ff]/10 transition">
                         <div className="text-white font-bold mb-1 uppercase tracking-wide">Exploration</div>
                         <div className="text-[#58a6ff] text-[24px] font-mono">75 BPM</div>
                     </div>
                  </div>
              </div>
           )}

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

function TrackHeader({ name, color }) {
   return (
      <div className="h-[48px] bg-[#1a1a1a] rounded flex items-center p-2 relative overflow-hidden group">
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${color}`}></div>
          <div className="flex flex-col ml-2 w-full">
             <span className="font-bold text-white tracking-wider flex justify-between uppercase w-full">
               {name} 
               <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-[#333] px-1 rounded text-[#888] hover:text-white cursor-pointer text-[8px]">M</span>
                  <span className="bg-[#333] px-1 rounded text-[#888] hover:text-white cursor-pointer text-[8px]">S</span>
               </div>
             </span>
             <div className="w-full flex items-center gap-2 mt-1">
                <Sliders size={10} className="text-[#666]"/>
                <div className="flex-1 h-3 bg-[#0a0a0a] border border-[#333] rounded-full overflow-hidden">
                   <div className="w-[70%] h-full bg-[#444] rounded-full"></div>
                </div>
             </div>
          </div>
      </div>
   );
}

function TimelineRegion({ color }) {
   return (
      <div className="h-[48px] bg-[#1a1a1a] rounded flex items-center relative overflow-hidden group border-y border-[#1a1a1a]">
         <div className="absolute left-[5%] right-[25%] top-1 bottom-1 rounded border border-white/20 overflow-hidden flex" style={{backgroundColor: color.replace('bg-', '') + '33'}}>
            {/* Fake Waveform */}
            <svg className="w-full h-full" preserveAspectRatio="none"><path d="M0 20 Q 10 0, 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 T 140 20 T 160 20 T 180 20 T 200 20" stroke={color.replace('bg-', '')} fill="none" strokeWidth="2"/></svg>
            <div className={`absolute left-0 top-0 text-[8px] bg-black/50 text-white px-1 py-0.5 font-bold`}>Audio Region</div>
         </div>
      </div>
   );
}

function MixerStrip({ name, val, meter, color, isMaster = false }) {
   return (
      <div className={`w-[80px] h-full ${isMaster ? 'bg-[#1a1a1a] border-[#333]' : 'bg-[#0a0a0a] border-[#222]'} border rounded flex flex-col items-center p-2 shrink-0 relative`}>
         <div className="text-[9px] font-bold uppercase tracking-wider text-[#aaa] mb-2">{name}</div>
         
         {/* Pan */}
         <div className="w-6 h-6 rounded-full border-2 border-[#333] relative mb-4 flex items-center justify-center">
            <div className="w-1 h-3 bg-white absolute top-0 origin-bottom transform rotate-0"></div>
         </div>
         
         {/* Fader Track */}
         <div className="flex-1 w-full flex justify-center gap-2 relative">
             <div className="w-1.5 bg-[#000] rounded-full h-full border border-[#222] relative overflow-hidden flex flex-col justify-end">
                <div className={`w-full ${color}`} style={{ height: `${meter}%` }}></div>
             </div>
             
             {/* Fader Handle */}
             <div className="absolute bg-[#333] border border-[#555] w-6 h-4 rounded-[2px] shadow-lg cursor-pointer" style={{ bottom: `${meter - 5}%`}}>
                <div className="w-full h-px bg-white/20 mt-1.5"></div>
             </div>
         </div>
         
         <div className="mt-3 text-[10px] font-mono font-bold bg-[#000] border border-[#333] px-1 py-0.5 rounded text-center w-full shadow-inner text-[#ccc]">{val}</div>
      </div>
   );
}
