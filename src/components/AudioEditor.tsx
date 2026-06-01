import React, { useState } from 'react';
import { 
  AudioWaveform, Settings2, Play, Pause, Rewind, FastForward, FolderTree, SkipBack, SkipForward, Circle,
  Volume2, Plus, Sliders, ChevronDown, Layers, Scissors, Mic, Cpu, HardDrive, Database, Zap, Activity, Waves, Gauge, Music, BrainCircuit, Maximize, Orbit, Grid, Radio, Speaker, ListMusic, ListVideo, Film, Settings, Wrench, DownloadCloud, MonitorSpeaker, Trash2, BoxSelect, Brush, Square as SquareIcon, Type, Repeat, MousePointer2, Copy, Globe
} from 'lucide-react';
import ThaiPhoneticsEngine from './ThaiPhoneticsEngine';

export default function AudioEditor() {
  const [activeBottomTab, setActiveBottomTab] = useState<'Mixer' | 'PianoRoll' | 'Spectral' | 'OfflineAI' | 'ThaiTTS'>('Mixer');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#8b949e] font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex flex-col justify-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3fb950]/5 to-transparent pointer-events-none"></div>
        <div className="flex items-center">
           <AudioWaveform size={28} className="text-[#3fb950] mr-4 shadow-[0_0_15px_rgba(63,185,80,0.4)]" />
           <div className="flex flex-col z-10">
             <h2 className="text-[#c9d1d9] text-[16px] font-bold tracking-tight">Apex Fairlight & Audio Engineer</h2>
             <p className="text-[#8b949e] text-[11px]">Precision sample-level tools: Pitch correct, Spectral Healing, Local AI Gen, and fully-automated console routing.</p>
           </div>
           <div className="ml-auto flex gap-4 h-full items-center z-10">
              <div className="flex flex-col items-end">
                 <div className="text-[10px] text-[#8b949e] uppercase font-bold flex gap-2">H/W Buffer <span className="text-[#3fb950] font-mono">128 smp (1.2ms)</span></div>
                 <div className="flex items-center gap-1 text-[11px] font-mono"><HardDrive size={10} className="text-[#58a6ff]"/> 48kHz / 32-bit float internal</div>
              </div>
              <div className="w-px h-8 bg-[#30363d]"></div>
              <div className="bg-[#161b22] border border-[#30363d] px-4 py-1.5 rounded-lg flex flex-col items-center shadow-inner relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-2 h-2 rounded-full border border-white/20 bg-[#3fb950] animate-pulse m-1 shadow-[0_0_5px_#3fb950]"></div>
                 <span className="text-[9px] uppercase font-bold text-[#8b949e]">Project Tempo (BPM)</span>
                 <span className="text-white font-mono text-[16px] font-bold">128.000</span>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] px-4 py-1.5 rounded-lg flex flex-col items-center shadow-inner relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-2 h-2 rounded-full border border-white/20 bg-[#e3b341] m-1 shadow-[0_0_5px_#e3b341]"></div>
                 <span className="text-[9px] uppercase font-bold text-[#8b949e]">Master Pitch Shift</span>
                 <span className="text-[#e3b341] font-mono text-[16px] font-bold">± 0 st</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex h-12 border-b border-[#30363d] bg-[#161b22] px-3 items-center gap-3 z-10 shadow-sm overflow-x-auto custom-scrollbar">
        <button onClick={() => setActiveBottomTab('Mixer')} className={`whitespace-nowrap px-4 py-2 rounded-md text-[11px] font-bold transition-all flex items-center gap-2 ${activeBottomTab === 'Mixer' ? 'bg-gradient-to-b from-[#58a6ff]/20 to-[#58a6ff]/5 text-[#58a6ff] border border-[#58a6ff]/30 shadow-md transform scale-105' : 'hover:bg-[#21262d] text-[#8b949e] border border-transparent'}`}><Sliders size={14}/> Mixer Console</button>
        <button onClick={() => setActiveBottomTab('PianoRoll')} className={`whitespace-nowrap px-4 py-2 rounded-md text-[11px] font-bold transition-all flex items-center gap-2 ${activeBottomTab === 'PianoRoll' ? 'bg-gradient-to-b from-[#f85149]/20 to-[#f85149]/5 text-[#f85149] border border-[#f85149]/30 shadow-md transform scale-105' : 'hover:bg-[#21262d] text-[#8b949e] border border-transparent'}`}><Grid size={14}/> Sequencing & MIDI</button>
        <button onClick={() => setActiveBottomTab('Spectral')} className={`whitespace-nowrap px-4 py-2 rounded-md text-[11px] font-bold transition-all flex items-center gap-2 ${activeBottomTab === 'Spectral' ? 'bg-gradient-to-b from-[#e3b341]/20 to-[#e3b341]/5 text-[#e3b341] border border-[#e3b341]/30 shadow-md transform scale-105' : 'hover:bg-[#21262d] text-[#8b949e] border border-transparent'}`}><Waves size={14}/> Spectral Repair</button>
        <button onClick={() => setActiveBottomTab('OfflineAI')} className={`whitespace-nowrap px-4 py-2 rounded-md text-[11px] font-bold transition-all flex items-center gap-2 ${activeBottomTab === 'OfflineAI' ? 'bg-gradient-to-b from-[#bc8cff]/20 to-[#bc8cff]/5 text-[#bc8cff] border border-[#bc8cff]/30 shadow-[0_0_15px_rgba(188,140,255,0.2)] transform scale-105' : 'hover:bg-[#21262d] text-[#bc8cff]/60 border border-transparent'}`}><BrainCircuit size={14}/> Synths & AI Generation</button>
        <button onClick={() => setActiveBottomTab('ThaiTTS')} className={`whitespace-nowrap px-4 py-2 rounded-md text-[11px] font-bold transition-all flex items-center gap-2 ${activeBottomTab === 'ThaiTTS' ? 'bg-gradient-to-b from-[#58a6ff]/20 to-[#58a6ff]/5 text-[#58a6ff] border border-[#58a6ff]/30 shadow-[0_0_15px_rgba(88,166,255,0.2)] transform scale-105' : 'hover:bg-[#21262d] text-[#58a6ff]/60 border border-transparent'}`}><Globe size={14}/> Thai Phonetics TTS</button>
        <div className="flex-1"></div>
        <button className="text-[10px] bg-[#3fb950]/10 text-[#3fb950] border border-[#3fb950]/30 px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold hover:bg-[#3fb950]/20 transition-all font-mono">
           <DownloadCloud size={12}/> Render Project
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a]">
        
        {/* TOP HALF: Timeline and Arrangement */}
        <div className="flex-1 flex min-h-[300px] relative border-b border-[#30363d]">
          {/* Left Panel: Tracks Control */}
          <div className="w-[320px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 z-10 overflow-y-hidden shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
             
             {/* Tracks Header Panel */}
             <div className="h-8 border-b border-[#30363d] flex items-center justify-between px-3 text-[10px] text-[#8b949e] font-bold uppercase tracking-widest bg-[#0d1117]">
                <span>Arrangement</span>
                <Settings2 size={12}/>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-10">
                <TrackHeader id="01" name="Grand Piano" color="#58a6ff" icon={<Music size={12}/>} vst="Kontakt Factory" tempo="Auto" pitch="0 st" vol={78} pan={-15} volPercent={70}/>
                <TrackHeader id="02" name="Sub Bass" color="#f85149" icon={<Activity size={12}/>} vst="Serum" tempo="Auto" pitch="0 st" vol={85} pan={0} volPercent={80} isMuted/>
                <TrackHeader id="03" name="Taiko Ensemble" color="#e3b341" icon={<Waves size={12}/>} vst="Spitfire Perc" tempo="Auto" pitch="0 st" vol={90} pan={10} volPercent={85}/>
                <TrackHeader id="04" name="Vocal Lead (AI)" color="#bc8cff" icon={<BrainCircuit size={12}/>} vst="Bark V2" tempo="Elastique" pitch="+2 st" vol={65} pan={0} volPercent={60}/>
                <TrackHeader id="05" name="Strings Section" color="#3fb950" icon={<Music size={12}/>} vst="Albion One" tempo="Auto" pitch="0 st" vol={70} pan={0} volPercent={55}/>
                
                {/* Add Track */}
                <div className="p-3 border-b border-[#30363d] flex justify-center sticky bottom-0 bg-gradient-to-t from-[#161b22] to-[#161b22]/90 backdrop-blur">
                   <button className="flex items-center justify-center gap-2 text-[11px] uppercase font-bold text-[#c9d1d9] border-2 border-dashed border-[#30363d] rounded-lg w-full py-3 hover:bg-[#21262d] hover:border-[#8b949e] transition-colors shadow-sm">
                      <Plus size={14} /> Add Instrument Track
                   </button>
                </div>
             </div>
          </div>

          {/* Right Panel: Arrangement Canvas */}
          <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
             
             {/* Toolbar above canvas */}
             <div className="h-8 bg-[#0d1117] border-b border-[#30363d] flex items-center px-4 gap-4 z-20 shrink-0">
                <div className="flex items-center gap-1 text-[#8b949e]">
                   <button className="p-1.5 hover:text-white rounded bg-[#21262d] text-white"><MousePointer2 size={12}/></button>
                   <button className="p-1.5 hover:text-white rounded hover:bg-[#21262d]"><Scissors size={12}/></button>
                   <button className="p-1.5 hover:text-white rounded hover:bg-[#21262d]"><Copy size={12}/></button>
                   <button className="p-1.5 hover:text-[#f85149] rounded hover:bg-[#21262d]"><Trash2 size={12}/></button>
                </div>
                <div className="w-px h-4 bg-[#30363d]"></div>
                <div className="text-[10px] font-mono text-[#8b949e] flex items-center gap-3">
                   <span>Snap: <span className="text-white bg-[#161b22] px-1 rounded border border-[#30363d]">1/16</span></span>
                   <Grid size={12}/>
                </div>
             </div>

             {/* Ruler/Timecode */}
             <div className="h-6 bg-[#161b22] border-b border-[#30363d] flex items-end overflow-hidden sticky top-0 z-10 shrink-0 shadow-sm relative">
                <div className="absolute left-[18%] top-0 bottom-0 w-px bg-[#f85149] z-20 shadow-[0_0_10px_#f85149]">
                   <div className="absolute top-0 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-[#f85149]"></div>
                </div>
                {[...Array(60)].map((_, i) => (
                   <div key={i} className={`flex-1 min-w-[70px] border-r border-[#30363d] h-3 flex flex-col justify-end px-1 select-none ${i % 4 === 0 ? 'border-r-[#8b949e]' : ''}`}>
                      {i % 4 === 0 && <span className="text-[9px] text-[#c9d1d9] leading-none mb-0.5 font-bold">{`Bar ${Math.floor(i/4) + 1}`}</span>}
                   </div>
                ))}
             </div>
             
             {/* Timeline Tracks Area */}
             <div className="flex-1 overflow-auto custom-scrollbar relative z-0">
                {/* Background Grid Rules */}
                <div className="absolute inset-0 z-0 opacity-[0.1]" style={{backgroundImage: 'linear-gradient(90deg, #8b949e 1px, transparent 1px)', backgroundSize: '70px 100%'}}></div>

                <TrackCanvasArea height="100px" color="#58a6ff">
                   <MidiRegion left={10} width={250} name="Piano_Chord_Prog" color="#58a6ff"/>
                   <MidiRegion left={270} width={300} name="Piano_Arp" color="#58a6ff"/>
                </TrackCanvasArea>

                <TrackCanvasArea height="100px" color="#f85149" isMuted>
                   <MidiRegion left={10} width={560} name="Sub_Bass_Line" color="#f85149"/>
                </TrackCanvasArea>

                <TrackCanvasArea height="100px" color="#e3b341">
                   <AudioRegion left={0} width={610} name="Taiko_Master_Bounce.wav" color="#e3b341" waveHeight={100}/>
                </TrackCanvasArea>

                <TrackCanvasArea height="100px" color="#bc8cff">
                   <AudioRegion left={150} width={300} name="AI_Generated_Vocal_Take1.wav" color="#bc8cff" waveHeight={60} isTuned/>
                </TrackCanvasArea>

                <TrackCanvasArea height="100px" color="#3fb950">
                   <MidiRegion left={150} width={420} name="String_Swells" color="#3fb950"/>
                </TrackCanvasArea>
             </div>
          </div>
        </div>

        {/* BOTTOM HALF: Dock Tools */}
        <div className="h-[400px] bg-[#0d1117] flex shrink-0 relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
            {/* Dock Control Bar */}
            <div className="absolute top-0 left-0 right-0 h-14 bg-[#161b22] border-b border-[#30363d] flex items-center px-6 justify-between select-none z-20">
               <div className="flex items-center gap-6 text-[#c9d1d9] text-[13px] font-bold">
                  {/* Transport Controls */}
                  <div className="flex gap-2 items-center bg-[#0a0a0a] p-1.5 rounded-lg border border-[#30363d] shadow-inner">
                     <button className="w-8 h-8 rounded hover:bg-[#21262d] flex items-center justify-center text-[#8b949e] hover:text-white transition-colors"><SkipBack size={14}/></button>
                     <button className="w-8 h-8 rounded hover:bg-[#21262d] flex items-center justify-center text-[#8b949e] hover:text-white transition-colors"><Rewind size={14}/></button>
                     <button className="w-10 h-10 rounded-md bg-gradient-to-t from-[#21262d] to-[#30363d] flex items-center justify-center text-white hover:from-[#3fb950]/20 hover:to-[#3fb950]/40 transition-all border border-[#8b949e]/30 shadow-lg hover:text-[#3fb950]"><Play size={20} className="ml-1 fill-current"/></button>
                     <button className="w-8 h-8 rounded hover:bg-[#21262d] flex items-center justify-center text-[#8b949e] hover:text-white transition-colors"><Pause size={14}/></button>
                     <button className="w-8 h-8 rounded hover:bg-[#21262d] flex items-center justify-center text-[#8b949e] hover:text-white transition-colors"><FastForward size={14}/></button>
                     <button className="w-8 h-8 rounded hover:bg-[#21262d] flex items-center justify-center text-[#8b949e] hover:text-[#f85149] transition-colors"><Circle size={14} className="fill-current"/></button>
                     <div className="w-px h-6 bg-[#30363d] mx-1"></div>
                     <button className="w-8 h-8 rounded bg-[#bc8cff]/20 flex items-center justify-center text-[#bc8cff] border border-[#bc8cff]/40 shadow-[0_0_10px_rgba(188,140,255,0.2)]"><Repeat size={14}/></button>
                  </div>
                  
                  <div className="w-[1px] h-8 bg-[#30363d]"></div>

                  {/* Active Tool Label */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] rounded-lg border border-[#30363d] text-[12px] uppercase tracking-widest shadow-inner">
                     {activeBottomTab === 'Mixer' && <><Sliders size={14} className="text-[#58a6ff]"/> Mixing Console</>}
                     {activeBottomTab === 'PianoRoll' && <><Grid size={14} className="text-[#f85149]"/> MIDI / Piano Roll Editor</>}
                     {activeBottomTab === 'Spectral' && <><Waves size={14} className="text-[#e3b341]"/> Spectral Advanced Editor</>}
                     {activeBottomTab === 'OfflineAI' && <><BrainCircuit size={14} className="text-[#bc8cff]"/> Local AI Deep Generators</>}
                  </div>
               </div>

               {/* Global Master readout */}
               <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest">Master Out</span>
                  <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#30363d] p-1.5 rounded-lg shadow-inner">
                     <MonitorSpeaker size={14} className="text-[#58a6ff]"/>
                     <span className="text-[#c9d1d9] font-mono font-bold text-[14px]">-1.2 <span className="text-[#8b949e] text-[10px]">dB</span></span>
                     <div className="w-24 h-4 bg-[#161b22] rounded flex overflow-hidden border border-[#30363d] relative">
                        <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#3fb950] via-[#e3b341] to-[#f85149] w-[85%]"></div>
                        <div className="absolute right-[10%] top-0 bottom-0 w-px bg-white/50"></div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Dock Workspace Canvas */}
            <div className="flex-1 mt-14 flex overflow-hidden w-full relative">
               {activeBottomTab === 'Mixer' && <MixerConsole />}
               {activeBottomTab === 'OfflineAI' && <OfflineAIToolkit />}
               {activeBottomTab === 'Spectral' && <SpectralEditor />}
               {activeBottomTab === 'PianoRoll' && <PianoRollEditor />}
               {activeBottomTab === 'ThaiTTS' && <ThaiPhoneticsEngine />}
            </div>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// ARRANGEMENT TRACK COMPONENTS
// ----------------------------------------------------

function TrackHeader({ id, name, color, icon, vst, tempo, pitch, vol, volPercent, pan, isMuted }: any) {
   return (
      <div className={`h-[100px] border-b border-[#30363d] ${isMuted ? 'bg-[#0a0a0a] opacity-60' : 'bg-[#161b22]'} flex flex-col p-2.5 shrink-0 relative group transition-colors`} style={{borderLeft: `4px solid ${color}`}}>
         <div className="absolute right-2 top-2 hidden group-hover:block"><Settings size={12} className="text-[#8b949e] cursor-pointer hover:text-white"/></div>
         <div className="flex justify-between items-center text-[11px] text-white font-bold mb-2">
            <span className="flex items-center gap-2 truncate pr-4 text-[13px] tracking-wide"><span style={{color: color}}>{icon}</span> {id} - {name}</span>
         </div>
         <div className="flex gap-2 text-[9px] shrink-0 mb-2 font-bold uppercase w-full">
            <button className="flex-1 h-6 bg-[#21262d] border border-[#30363d] rounded flex items-center justify-center text-[#8b949e] hover:text-white transition-colors hover:shadow-sm">R</button>
            <button className="flex-1 h-6 bg-[#21262d] border border-[#30363d] rounded flex items-center justify-center text-[#8b949e] hover:text-[#e3b341] hover:border-[#e3b341]/50 transition-colors">S</button>
            <button className={`flex-1 h-6 rounded flex items-center justify-center transition-colors border ${isMuted ? 'bg-[#f85149] text-white border-[#f85149]' : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:border-[#f85149]/50 hover:text-[#f85149]'}`}>M</button>
         </div>
         <div className="flex gap-2 items-center mb-1">
            <Volume2 size={12} className="text-[#8b949e]"/>
            <input type="range" className="w-[80px] h-1.5 bg-[#0a0a0a] rounded appearance-none outline-none cursor-ew-resize" style={{accentColor: color}} defaultValue={vol} />
            <div className="flex-1 h-2.5 bg-[#050505] rounded overflow-hidden border border-[#30363d] relative">
               <div className="absolute inset-y-0 left-0 opacity-80" style={{width: `${volPercent}%`, background: `linear-gradient(90deg, #3fb950, ${color})`}}></div>
               <div className="absolute right-[15%] top-0 bottom-0 w-px bg-[#f85149] opacity-50"></div>
            </div>
         </div>
      </div>
   )
}

function TrackCanvasArea({ children, height, color, isMuted }: any) {
   return (
      <div className={`border-b border-[#30363d] relative group`} style={{ height }}>
         {/* Row horizontal guide */}
         <div className="absolute inset-x-0 bottom-0 h-px bg-[#30363d]"></div>
         <div className={`absolute inset-0 ${isMuted ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            {children}
         </div>
         <div className="absolute inset-0 bg-[#ffffff] opacity-0 group-hover:opacity-[0.02] pointer-events-none mix-blend-overlay"></div>
      </div>
   );
}

function MidiRegion({ left, width, name, color }: any) {
   return (
      <div className="absolute top-1 bottom-1 bg-[#161b22] border-[1px] border-opacity-50 rounded-md overflow-hidden cursor-move hover:brightness-110 shadow-sm" style={{ left: `${left}px`, width: `${width}px`, borderColor: color }}>
         <div className="h-4 border-b border-opacity-30 text-[9px] font-bold px-1.5 select-none flex items-center tracking-wider" style={{backgroundColor: `${color}30`, borderColor: color, color: color }}>{name}</div>
         <div className="relative w-full h-[calc(100%-16px)] opacity-80 pointer-events-none p-1">
            <div className="absolute top-[20%] left-[5%] w-[10%] h-[3px]" style={{backgroundColor: color}}></div>
            <div className="absolute top-[35%] left-[20%] w-[5%] h-[3px]" style={{backgroundColor: color}}></div>
            <div className="absolute top-[50%] left-[30%] w-[15%] h-[3px]" style={{backgroundColor: color}}></div>
            <div className="absolute top-[25%] left-[50%] w-[20%] h-[3px]" style={{backgroundColor: color}}></div>
            <div className="absolute top-[65%] left-[75%] w-[10%] h-[3px]" style={{backgroundColor: color}}></div>
            <div className="absolute top-[50%] left-[90%] w-[5%] h-[3px]" style={{backgroundColor: color}}></div>
         </div>
         {/* selection overlay handles */}
         <div className="absolute top-0 bottom-0 left-0 w-1 hover:bg-white/50 cursor-ew-resize"></div>
         <div className="absolute top-0 bottom-0 right-0 w-1 hover:bg-white/50 cursor-ew-resize"></div>
      </div>
   )
}

function AudioRegion({ left, width, name, color, waveHeight, isTuned }: any) {
   return (
      <div className="absolute top-1 bottom-1 bg-[#161b22] border-[1px] border-opacity-50 rounded-md overflow-hidden cursor-move hover:brightness-110 shadow-sm z-10" style={{ left: `${left}px`, width: `${width}px`, borderColor: color }}>
         <div className="h-4 border-b border-opacity-30 text-[9px] font-bold px-1.5 select-none flex items-center justify-between tracking-wider" style={{backgroundColor: `${color}30`, borderColor: color, color: color }}>
            <span>{name}</span>
            {isTuned && <div className="bg-black/50 px-1 rounded text-[7px]" title="Pitch Curve Interpolated">PITCH FIX</div>}
         </div>
         {/* Audio Waveform mock */}
         <div className="w-full h-[calc(100%-16px)] flex items-center relative opacity-80 pointer-events-none p-0.5">
            {[...Array(Math.floor(width / 3))].map((_, i) => (
              <div key={i} className="flex-1 rounded-[1px] mx-[0.5px]" style={{ backgroundColor: color, height: Math.max(5, Math.random() * waveHeight) + '%' }}></div>
            ))}
            {isTuned && (
               <svg className="absolute inset-0 w-full h-full text-[#bc8cff] drop-shadow-md z-20 mix-blend-screen" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0 50 Q 20 50 30 30 T 60 30 T 70 50 T 100 50" fill="none" stroke="white" strokeWidth="1.5"/>
               </svg>
            )}
         </div>
         <div className="absolute top-0 bottom-0 left-0 w-1 hover:bg-white/50 cursor-ew-resize"></div>
         <div className="absolute top-0 bottom-0 right-0 w-1 hover:bg-white/50 cursor-ew-resize"></div>
      </div>
   )
}

// ----------------------------------------------------
// DOCK: MIXER CONSOLE
// ----------------------------------------------------

function MixerConsole() {
   return (
      <div className="flex-1 flex bg-[#050505] gap-[2px] px-4 pt-4 overflow-x-auto custom-scrollbar overflow-y-hidden shadow-inner relative">
         <div className="absolute inset-0 bg-gradient-to-b from-[#161b22]/50 to-transparent pointer-events-none"></div>

         <MixerChannel name="01 Grand Piano" color="#58a6ff" val={-3.2} pan={-15} isMaster={false} effects={['Pro-Q 3', 'Valhalla Room V']} sends={['Bus 1 (Rev)', 'Bus 2 (Dly)']} />
         <MixerChannel name="02 Sub Bass" color="#f85149" val={0.0} pan={0} isMaster={false} effects={['Saturn 2', 'Pro-C 2', 'Decapitator']} sends={[]} isMuted/>
         <MixerChannel name="03 Taiko Ens" color="#e3b341" val={-1.0} pan={10} isMaster={false} effects={['Spiff', 'Pro-MB']} sends={['Bus 1 (Rev)']} />
         <MixerChannel name="04 Vocal AI" color="#bc8cff" val={-4.5} pan={0} isMaster={false} effects={['Auto-Tune Pro', 'Soothe2', 'LA-2A', 'Pro-DS']} sends={['Bus 3 (Vox)']} />
         <MixerChannel name="05 Strings" color="#3fb950" val={-12.0} pan={0} isMaster={false} effects={['Pro-Q 3', 'Pro-R', 'Gullfoss']} sends={['Bus 1 (Rev)']} />
         
         <div className="w-[2px] bg-[#30363d] mx-4 shadow-lg shrink-0 rounded"></div>
         
         {/* Metering Scale Context */}
         <div className="w-8 h-[250px] mt-[90px] flex flex-col justify-between shrink-0 text-[9px] text-[#8b949e] font-mono text-right pr-2 select-none z-10 font-bold">
            <span className="text-[#f85149]">+6</span><span className="text-[#f85149]">0</span><span className="text-[#e3b341]">-6</span><span>-12</span><span>-24</span><span>-36</span><span>-60</span><span>-inf</span>
         </div>
         
         <MixerChannel name="MASTER BUS" color="#58a6ff" val={-1.2} pan={0} isMaster={true} effects={['Ozone 11 Adv', 'Pro-L 2', 'Gullfoss Master']} sends={[]} />
      </div>
   )
}

function MixerChannel({ name, color, val, pan, isMaster, effects, sends, isMuted }: any) {
   return (
      <div className={`w-[130px] h-[340px] ${isMaster ? 'bg-gradient-to-b from-[#161b22] to-[#0a0a0a] border-[#58a6ff]/30 shadow-[0_0_20px_rgba(88,166,255,0.1)]' : 'bg-[#0d1117] border-[#30363d]'} border border-b-0 rounded-t-xl shrink-0 flex flex-col z-10 overflow-hidden relative group`}>
         
         {/* Name header */}
         <div className="h-8 border-b border-[#30363d] bg-[#21262d] flex items-center justify-center text-[11px] font-bold px-2 truncate text-center uppercase tracking-wider relative" style={{color: isMaster ? '#58a6ff' : color}}>
            {isMuted && <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-[1px]"></div>}
            {name}
         </div>
         
         {/* Inserts & Sends Area */}
         <div className="h-[90px] border-b border-[#30363d] p-1.5 flex flex-col gap-1 bg-[#050505] shadow-inner relative">
            {isMuted && <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-[1px]"></div>}
            {effects.map((e:string, i:number) => (
               <div key={i} className="text-[9px] px-1.5 py-0.5 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] truncate rounded hover:border-[#58a6ff] cursor-pointer flex items-center justify-between font-bold">
                  <span className="truncate">{e}</span><div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full shrink-0 shadow-[0_0_5px_#3fb950]"></div>
               </div>
            ))}
            {sends?.map((e:string, i:number) => (
               <div key={`s${i}`} className="text-[9px] px-1.5 py-0.5 bg-[#161b22] border border-[#30363d] text-[#e3b341] truncate rounded hover:border-[#e3b341] cursor-pointer flex items-center justify-between font-bold opacity-80">
                  <span className="truncate">{e}</span><div className="w-1.5 h-1.5 bg-[#e3b341]/50 rounded-full shrink-0"></div>
               </div>
            ))}
            <div className="text-[12px] font-bold p-0.5 border border-dashed border-[#30363d] text-[#8b949e] text-center rounded hover:bg-[#21262d] cursor-pointer mt-auto hover:text-white transition-colors">+ Add</div>
         </div>
         
         {/* Pan Knob Mock */}
         <div className="h-[40px] border-b border-[#30363d] flex items-center justify-center relative bg-gradient-to-b from-[#161b22] to-[#0d1117] shadow-inner">
            {isMuted && <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-[1px]"></div>}
            <div className="w-8 h-8 rounded-full border-[2px] border-black bg-[#21262d] relative flex justify-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.1)] group-hover:border-[#58a6ff]/50 transition-colors">
               <div className="w-1 h-3 bg-white absolute top-0.5 rounded-full shadow-[0_0_5px_white]"></div>
            </div>
            <div className="absolute text-[9px] text-[#8b949e] font-mono bottom-1 right-2">{pan === 0 ? 'C' : pan < 0 ? `L${Math.abs(pan)}` : `R${pan}`}</div>
         </div>
         
         {/* Mute/Solo/Value */}
         <div className="p-1.5 flex justify-between items-center bg-[#0a0a0a] border-b border-[#30363d]">
            <div className="flex gap-1.5 w-1/2">
               <button className={`flex-1 h-6 rounded text-[10px] font-bold uppercase transition-colors shadow-sm ${isMuted ? 'bg-[#f85149] text-white' : 'bg-[#161b22] border border-[#30363d] text-[#8b949e] hover:bg-[#21262d]'}`}>M</button>
               <button className="flex-1 h-6 bg-[#161b22] border border-[#30363d] rounded text-[10px] font-bold text-[#8b949e] hover:bg-[#21262d] hover:text-[#e3b341] hover:border-[#e3b341]/50 uppercase transition-colors shadow-sm">S</button>
            </div>
            <div className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${isMuted ? 'text-[#8b949e]' : val > 0 ? 'text-[#f85149] bg-[#f85149]/10' : 'text-[#c9d1d9] bg-[#161b22]'}`}>{val > 0 ? '+' : ''}{val.toFixed(1)}</div>
         </div>

         {/* Fader & Meter Track */}
         <div className="flex-1 flex pt-3 pb-8 justify-center gap-4 relative z-0 bg-[#050505] shadow-inner px-2">
            
            {/* Meter Bar */}
            <div className={`w-3.5 h-full bg-[#0a0a0a] rounded-sm border border-[#30363d] relative overflow-hidden flex items-end shadow-inner ${isMuted ? 'opacity-20 grayscale' : ''}`}>
               {/* Meter levels */}
               <div className="w-full absolute bottom-0 flex flex-col justify-end" style={{ height: `${80 + val * 2}%` }}>
                  <div className="w-full h-1 bg-[#f85149] mb-[1px] shadow-[0_0_10px_#f85149]"></div>
                  <div className="w-full h-[15%] bg-[#e3b341] mb-[1px]"></div>
                  <div className="w-full h-[85%] bg-[#3fb950]"></div>
               </div>
               <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#30363d_1px,transparent_1px)] bg-[size:100%_4px] opacity-40"></div>
            </div>
            
            {/* Fader Groove */}
            <div className="w-2.5 h-full bg-black border border-[#30363d] rounded-full relative z-10 flex items-center justify-center shadow-inner">
               <div className="w-full h-full absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none rounded-full"></div>
               {/* Fader Cap */}
               <div className={`w-9 h-12 bg-gradient-to-b ${isMaster ? 'from-[#3182ce] to-[#1e3a8a] border-[#58a6ff]' : 'from-[#21262d] to-[#161b22] border-black'} border-[2px] rounded shadow-[0_10px_20px_rgba(0,0,0,1),inset_0_2px_4px_rgba(255,255,255,0.2)] absolute left-1/2 -translate-x-1/2 cursor-ns-resize z-20 group-hover:scale-105 transition-transform`} style={{bottom: '40%'}}>
                  {/* Fader grip line */}
                  <div className="w-full h-[3px] bg-white absolute top-1/2 -translate-y-1/2 shadow-[0_0_5px_white]"></div>
               </div>
            </div>

         </div>
      </div>
   )
}

// ----------------------------------------------------
// DOCK: PIANO ROLL
// ----------------------------------------------------

function PianoRollEditor() {
   return (
      <div className="flex-1 flex bg-[#050505] relative overflow-hidden">
         {/* Keys Panel */}
         <div className="w-[80px] bg-[#0d1117] border-r border-[#30363d] shrink-0 z-10 flex flex-col text-[10px] select-none shadow-[5px_0_15px_rgba(0,0,0,0.8)]">
            {[...Array(24)].map((_, i) => {
               const noteIndex = i % 12;
               const isBlack = [1, 3, 6, 8, 10].includes(noteIndex);
               const octave = 4 - Math.floor(i / 12);
               const noteNames = ['C', 'B', 'A#', 'A', 'G#', 'G', 'F#', 'F', 'E', 'D#', 'D', 'C#'];
               return (
                  <div key={i} className={`h-4 border-b border-black flex items-center justify-end pr-1 font-bold ${isBlack ? 'bg-[#161b22] text-[#8b949e] border-y-black shadow-inner z-[2] -ml-2 rounded-r' : 'bg-[#e5e5e5] text-black z-[1]'}`}>
                     {!isBlack && noteIndex === 0 && <span className="mr-1">C{octave}</span>}
                  </div>
               )
            })}
         </div>

         {/* Sequence Grid */}
         <div className="flex-1 overflow-auto relative custom-scrollbar bg-[#0a0a0a]">
            {/* Horizontal note guides */}
            <div className="absolute inset-0 pointer-events-none">
               {[...Array(24)].map((_, i) => {
                  const isBlack = [1, 3, 6, 8, 10].includes(i % 12);
                  return <div key={i} className={`h-4 border-b border-[#30363d]/50 ${isBlack ? 'bg-[#161b22]/30' : 'bg-transparent'}`}></div>
               })}
            </div>
            
            {/* Vertical beat guides */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{backgroundImage: 'linear-gradient(90deg, #8b949e 1px, transparent 1px)', backgroundSize: '60px 100%'}}></div>

            {/* Note events */}
            <div className="absolute inset-0 p-1">
               <div className="absolute h-3 bg-gradient-to-r from-[#f85149] to-[#ff7b72] rounded-sm border border-white/40 shadow-[0_0_10px_rgba(248,81,73,0.4)] cursor-ew-resize hover:brightness-110" style={{top: '49px', left: '60px', width: '120px'}}></div>
               <div className="absolute h-3 bg-gradient-to-r from-[#f85149] to-[#ff7b72] rounded-sm border border-white/40 shadow-[0_0_10px_rgba(248,81,73,0.4)] cursor-ew-resize hover:brightness-110" style={{top: '113px', left: '60px', width: '120px'}}></div>
               <div className="absolute h-3 bg-gradient-to-r from-[#f85149] to-[#ff7b72] rounded-sm border border-white/40 shadow-[0_0_10px_rgba(248,81,73,0.4)] cursor-ew-resize hover:brightness-110" style={{top: '177px', left: '60px', width: '120px'}}></div>
               
               <div className="absolute h-3 bg-gradient-to-r from-[#58a6ff] to-[#79c0ff] rounded-sm border border-white/40 shadow-[0_0_10px_rgba(88,166,255,0.4)] cursor-ew-resize hover:brightness-110" style={{top: '65px', left: '240px', width: '60px'}}></div>
               <div className="absolute h-3 bg-gradient-to-r from-[#58a6ff] to-[#79c0ff] rounded-sm border border-white/40 shadow-[0_0_10px_rgba(88,166,255,0.4)] cursor-ew-resize hover:brightness-110" style={{top: '129px', left: '240px', width: '60px'}}></div>
               <div className="absolute h-3 bg-gradient-to-r from-[#58a6ff] to-[#79c0ff] rounded-sm border border-white/40 shadow-[0_0_10px_rgba(88,166,255,0.4)] cursor-ew-resize hover:brightness-110" style={{top: '193px', left: '240px', width: '60px'}}></div>
               
               {/* Selected note */}
               <div className="absolute h-3 bg-white text-black rounded-sm border-2 border-[#bc8cff] shadow-[0_0_20px_white] cursor-ew-resize z-10 flex items-center justify-between px-1" style={{top: '81px', left: '360px', width: '120px'}}>
                  <div className="w-1 h-2 bg-black opacity-30"></div><div className="w-1 h-2 bg-black opacity-30"></div>
               </div>
               
               <div className="absolute h-3 bg-gradient-to-r from-[#58a6ff] to-[#79c0ff] rounded-sm border border-white/40 shadow-sm cursor-ew-resize hover:brightness-110" style={{top: '145px', left: '360px', width: '120px'}}></div>
            </div>

            {/* Velocity Lane */}
            <div className="sticky bottom-0 h-16 border-t border-[#30363d] bg-[#0d1117]/90 backdrop-blur pointer-events-auto flex items-end px-1 shadow-[0_-5px_15px_rgba(0,0,0,0.8)]">
               <div className="absolute top-1 left-2 text-[9px] font-bold text-[#8b949e] uppercase tracking-widest">Velocity</div>
               <div className="w-2 bg-[#f85149] rounded-t-sm mx-1 cursor-ns-resize hover:bg-white" style={{height: '80%', marginLeft: '60px'}}></div>
               <div className="w-2 bg-[#58a6ff] rounded-t-sm mx-1 cursor-ns-resize hover:bg-white" style={{height: '60%', marginLeft: '172px'}}></div>
               <div className="w-2 bg-white rounded-t-sm mx-1 cursor-ns-resize shadow-[0_0_10px_white]" style={{height: '100%', marginLeft: '112px'}}></div>
            </div>
         </div>
      </div>
   )
}

// ----------------------------------------------------
// DOCK: SPECTRAL
// ----------------------------------------------------

function SpectralEditor() {
   return (
      <div className="flex-1 flex flex-col bg-[#050505] p-3">
         {/* Toolbar */}
         <div className="flex gap-4 items-center text-[#c9d1d9] bg-[#161b22] border border-[#30363d] p-1.5 rounded-xl mb-3 inline-flex w-fit mx-auto shadow-md">
            <div className="flex gap-1">
               <button className="p-2 hover:text-white hover:bg-[#30363d] rounded" title="Time Selection"><BoxSelect size={16}/></button>
               <button className="p-2 text-[#e3b341] bg-[#e3b341]/10 rounded border border-[#e3b341]/30" title="Frequency Selection"><SquareIcon size={16}/></button>
               <button className="p-2 hover:text-white hover:bg-[#30363d] rounded" title="Lasso Selection"><Activity size={16}/></button>
            </div>
            <div className="w-px h-6 bg-[#30363d]"></div>
            <div className="flex gap-1">
               <button className="p-2 hover:text-[#58a6ff] hover:bg-[#58a6ff]/10 rounded transition-colors" title="De-Bleed"><Waves size={16}/></button>
               <button className="p-2 hover:text-[#3fb950] hover:bg-[#3fb950]/10 rounded transition-colors text-[#3fb950] font-bold" title="Harmonic Healing"><Layers size={16}/></button>
               <button className="p-2 hover:text-[#f85149] hover:bg-[#f85149]/10 rounded transition-colors" title="De-Click / Interpolate"><Brush size={16}/></button>
            </div>
            <div className="w-px h-6 bg-[#30363d]"></div>
            <div className="flex items-center gap-2 pr-4 pl-2">
               <span className="text-[11px] font-bold uppercase tracking-widest text-[#e3b341] flex items-center gap-2"><Cpu size={14}/> Apex Spectral Rx</span>
            </div>
         </div>

         {/* Workspace */}
         <div className="flex-1 border-[4px] border-[#161b22] rounded-xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10 mx-6 mb-4 mt-2">
            
            {/* Frequency Axis Right */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-[#0a0a0a]/80 backdrop-blur-md border-l border-[#30363d] flex flex-col justify-between text-[9px] text-white font-bold p-2 select-none z-20 text-right uppercase shadow-[-5px_0_15px_rgba(0,0,0,0.8)]">
               <span>20k</span><span>10k</span><span>5k</span><span className="text-[#e3b341]">2k</span><span>1k</span><span>500</span><span>50</span>
            </div>
            
            {/* The giant spectral heat map mockup */}
            <div className="w-[120%] h-full relative -left-[10%] cursor-crosshair" style={{background: 'linear-gradient(to top, #000000 0%, #1a0b2e 20%, #4a192c 40%, #a82e2e 60%, #e36a24 80%, #f4d03f 100%)'}}>
               {/* Complex noise texture overlay to look real */}
               <div className="absolute inset-0 opacity-60 mix-blend-color-burn" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'}}></div>
               
               {/* Distinct harmonic lines representing instrument/voice */}
               <svg className="w-full h-full absolute inset-0 opacity-80 mix-blend-screen overflow-visible drop-shadow-[0_0_15px_#e3b341]" preserveAspectRatio="none">
                  <path d="M0,80 Q200,90 400,70 T800,80" fill="none" stroke="#e3b341" strokeWidth="8" filter="blur(2px)"/>
                  <path d="M0,65 Q200,75 400,55 T800,65" fill="none" stroke="#ff7b72" strokeWidth="4" filter="blur(1px)"/>
                  <path d="M0,50 Q200,60 400,40 T800,50" fill="none" stroke="#bc8cff" strokeWidth="2" filter="blur(1px)"/>
                  
                  {/* Stray noise blob */}
                  <ellipse cx="400" cy="30" rx="30" ry="15" fill="#58a6ff" opacity="0.6" filter="blur(4px)" className="animate-pulse"/>
               </svg>

               {/* Selected area bounds showing editing capability (healing harmonic selection) */}
               <div className="absolute top-[20%] left-[32%] w-[12%] h-[25%] border-2 border-dashed border-[#e3b341] bg-[#e3b341]/20 flex items-center justify-center pointer-events-none shadow-[0_0_30px_rgba(227,179,65,0.4)] z-10 backdrop-blur-[1px]">
                  <div className="text-[10px] text-black font-extrabold bg-[#e3b341] px-2 py-0.5 rounded shadow-lg uppercase tracking-widest absolute top-full mt-2">Harmonic Isolated</div>
                  {/* Selection resize handles */}
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#e3b341] shadow-sm"></div>
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#e3b341] shadow-sm"></div>
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#e3b341] shadow-sm"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#e3b341] shadow-sm"></div>
               </div>
            </div>
         </div>
      </div>
   )
}

// ----------------------------------------------------
// DOCK: OFFLINE AI GENERATORS
// ----------------------------------------------------

function OfflineAIToolkit() {
   return (
      <div className="flex-1 flex bg-[#050505] p-6 gap-6 relative shadow-inner overflow-x-auto custom-scrollbar">
         
         <div className="w-[380px] bg-[#0d1117] border border-[#bc8cff]/40 rounded-2xl p-5 flex flex-col shadow-[0_20px_50px_rgba(188,140,255,0.1)] relative overflow-hidden shrink-0 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#bc8cff]/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center gap-3 mb-4 relative flex-col items-start border-b border-[#30363d] pb-4">
               <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#bc8cff]/20 rounded-xl flex items-center justify-center border border-[#bc8cff]/40 shadow-inner">
                     <BrainCircuit size={20} className="text-[#bc8cff]" />
                  </div>
                  <span className="text-white font-bold text-[14px] uppercase tracking-widest">Bark Neural Voice</span>
               </div>
               <p className="text-[11px] text-[#8b949e] font-sans leading-relaxed mt-2">Offline zero-shot text-to-speech with organic pacing, breathing, and pitch shaping. Outputs raw 48kHz float.</p>
            </div>
            
            <textarea className="w-full h-24 bg-[#050505] border border-[#30363d] rounded-xl text-white text-[13px] p-3 resize-none outline-none focus:border-[#bc8cff] focus:ring-1 focus:ring-[#bc8cff] custom-scrollbar shadow-inner relative z-10" placeholder="Type dialogue or lyrics. [Uses tags like [clears throat], ♪ singing notes ♪, or (laughs)]"></textarea>
            
            <div className="flex flex-col gap-3 mt-4 relative z-10">
               <div className="flex justify-between items-center bg-[#161b22] px-3 py-2 rounded-lg border border-[#30363d]">
                  <span className="text-[10px] uppercase font-bold text-[#8b949e]">Voice Model</span>
                  <select className="bg-transparent text-[11px] text-white font-bold outline-none cursor-pointer">
                     <option>EN_Female_Studio_Singer_v2</option>
                     <option>EN_Male_Podcast_Crisp</option>
                  </select>
               </div>
               <div className="flex justify-between items-center bg-[#161b22] px-3 py-2 rounded-lg border border-[#30363d]">
                  <span className="text-[10px] uppercase font-bold text-[#8b949e]">Emotion Cloner</span>
                  <button className="bg-[#050505] px-2 py-1 rounded text-[#58a6ff] text-[10px] font-bold border border-[#58a6ff]/30 text-[10px]">Provide Ref.WAV</button>
               </div>
            </div>

            <button className="mt-auto w-full py-3 bg-gradient-to-r from-[#bc8cff] to-[#8a2be2] hover:scale-[1.02] text-white font-bold text-[13px] uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_20px_rgba(188,140,255,0.3)] relative z-10">Generate Vocal Stem</button>
         </div>
         
         <div className="w-[380px] bg-[#0d1117] border border-[#3fb950]/40 rounded-2xl p-5 flex flex-col shadow-[0_20px_50px_rgba(63,185,80,0.1)] relative overflow-hidden shrink-0 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3fb950]/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center gap-3 mb-4 relative flex-col items-start border-b border-[#30363d] pb-4">
               <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#3fb950]/20 rounded-xl flex items-center justify-center border border-[#3fb950]/40 shadow-inner">
                     <Music size={20} className="text-[#3fb950]" />
                  </div>
                  <span className="text-white font-bold text-[14px] uppercase tracking-widest">AudioCraft Studio</span>
               </div>
               <p className="text-[11px] text-[#8b949e] font-sans leading-relaxed mt-2">Generates royalty-free instrumental stems based on text. Snaps automatically to Project Tempo & Key.</p>
            </div>
            
            <textarea className="w-full h-24 bg-[#050505] border border-[#30363d] rounded-xl text-white text-[13px] p-3 resize-none outline-none focus:border-[#3fb950] focus:ring-1 focus:ring-[#3fb950] custom-scrollbar shadow-inner relative z-10" placeholder="e.g., 128bpm dark techno bassline with aggressive distorted synth stabs in C# minor..."></textarea>
            
            <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
               <div className="flex flex-col gap-1 bg-[#161b22] p-2 rounded-lg border border-[#30363d]">
                  <span className="text-[9px] uppercase font-bold text-[#8b949e]">Length / Bars</span>
                  <input type="number" defaultValue="16" className="bg-transparent text-white font-mono text-[12px] w-full outline-none"/>
               </div>
               <div className="flex flex-col gap-1 bg-[#161b22] p-2 rounded-lg border border-[#30363d]">
                  <span className="text-[9px] uppercase font-bold text-[#8b949e]">Auto-Tune to Master</span>
                  <select className="bg-transparent text-[#3fb950] font-bold text-[11px] w-full outline-none uppercase">
                     <option>Enabled</option>
                     <option>Raw Output</option>
                  </select>
               </div>
            </div>

            <button className="mt-auto w-full py-3 bg-gradient-to-r from-[#3fb950] to-[#2ea043] hover:scale-[1.02] text-white font-bold text-[13px] uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_20px_rgba(63,185,80,0.3)] relative z-10 flex items-center justify-center gap-2"><Cpu size={16}/> Tensor Render</button>
         </div>

         <div className="flex-1 min-w-[300px] bg-[#0d1117] border border-[#e3b341]/40 rounded-2xl p-5 flex flex-col shadow-[0_20px_50px_rgba(227,179,65,0.05)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e3b341]/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center gap-2 border-b border-[#30363d] pb-4 mb-4 relative z-10">
               <div className="w-10 h-10 bg-[#e3b341]/20 rounded-xl flex items-center justify-center border border-[#e3b341]/40 shadow-inner">
                  <Layers size={20} className="text-[#e3b341]" />
               </div>
               <div>
                  <span className="text-white font-bold text-[14px] uppercase tracking-widest block">AI Stem Separation</span>
                  <span className="text-[10px] text-[#8b949e] font-sans">HTDemucs v4 (Vocals, Drums, Bass, Other)</span>
               </div>
            </div>

            <div className="flex-1 bg-[#050505] border-2 border-dashed border-[#e3b341]/40 rounded-xl flex items-center justify-center flex-col gap-3 cursor-pointer hover:border-[#e3b341] hover:bg-[#e3b341]/5 transition-all relative z-10 group/drop">
               <div className="w-16 h-16 rounded-full bg-[#161b22] border border-[#e3b341]/30 flex items-center justify-center group-hover/drop:scale-110 group-hover/drop:bg-[#e3b341]/20 transition-all shadow-lg">
                  <DownloadCloud size={28} className="text-[#e3b341]"/>
               </div>
               <span className="text-[12px] text-white font-bold uppercase tracking-wider relative z-10 text-center">Drag Master Audio Here<br/><span className="text-[#8b949e] text-[10px] capitalize font-normal">Extract isolated uncompressed stems</span></span>
            </div>
         </div>
      </div>
   )
}
