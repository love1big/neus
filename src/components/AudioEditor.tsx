import React, { useState } from 'react';
import { 
  AudioWaveform, Settings2, Play, Pause, Rewind, FastForward, FolderTree, SkipBack, SkipForward, Circle,
  Volume2, Plus, Sliders, ChevronDown, Layers, Scissors, Mic, Cpu, HardDrive, Database, Zap, Activity, Waves, Gauge, Music, BrainCircuit, Maximize, Orbit, Grid, Radio, Speaker, ListMusic, ListVideo, Film, Settings, Wrench, DownloadCloud, MonitorSpeaker, Trash2, BoxSelect, Brush
} from 'lucide-react';

export default function AudioEditor() {
  const [activeBottomTab, setActiveBottomTab] = useState<'Mixer' | 'PianoRoll' | 'Spectral' | 'OfflineAI'>('Mixer');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#8b949e] font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex flex-col justify-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3fb950]/5 to-transparent pointer-events-none"></div>
        <div className="flex items-center">
           <AudioWaveform size={28} className="text-[#3fb950] mr-4 shadow-[0_0_15px_rgba(63,185,80,0.4)]" />
           <div className="flex flex-col z-10">
             <h2 className="text-[#c9d1d9] text-[16px] font-bold tracking-tight">Apex Fairlight & Audio Engineer (Logic/ProTools)</h2>
             <p className="text-[#8b949e] text-[11px]">Offline AI audio gen, 100% tempo/pitch shift, World Instruments (Koto, Sitar), Spectral & Subtractive Editing.</p>
           </div>
           <div className="ml-auto flex gap-4 h-full items-center z-10">
              <div className="flex flex-col items-end">
                 <div className="text-[10px] text-[#8b949e] uppercase font-bold flex gap-2">Buffer <span className="text-[#3fb950]">128 smp (1.2ms)</span></div>
                 <div className="flex items-center gap-1 text-[11px]"><HardDrive size={10} className="text-[#58a6ff]"/> 48kHz / 32-bit float</div>
              </div>
              <div className="w-[1px] h-8 bg-[#30363d]"></div>
              <div className="bg-[#161b22] border border-[#30363d] px-4 py-1.5 rounded-lg flex flex-col items-center">
                 <span className="text-[9px] uppercase font-bold text-[#8b949e]">Global Tempo (BPM)</span>
                 <span className="text-white font-mono text-[16px] font-bold">128.000</span>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] px-4 py-1.5 rounded-lg flex flex-col items-center">
                 <span className="text-[9px] uppercase font-bold text-[#8b949e]">Master Pitch Shift</span>
                 <span className="text-[#e3b341] font-mono text-[16px] font-bold">± 0 st</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex h-10 border-b border-[#30363d] bg-[#161b22] px-2 items-center gap-2">
        <button onClick={() => setActiveBottomTab('Mixer')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-colors flex items-center gap-1.5 ${activeBottomTab === 'Mixer' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'hover:bg-[#21262d] text-[#c9d1d9]'}`}><Sliders size={12}/> Mixer Console</button>
        <button onClick={() => setActiveBottomTab('PianoRoll')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-colors flex items-center gap-1.5 ${activeBottomTab === 'PianoRoll' ? 'bg-[#f85149]/20 text-[#f85149]' : 'hover:bg-[#21262d] text-[#c9d1d9]'}`}><Grid size={12}/> Piano Roll / MIDI</button>
        <button onClick={() => setActiveBottomTab('Spectral')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-colors flex items-center gap-1.5 ${activeBottomTab === 'Spectral' ? 'bg-[#e3b341]/20 text-[#e3b341]' : 'hover:bg-[#21262d] text-[#c9d1d9]'}`}><Waves size={12}/> Spectral Edit</button>
        <button onClick={() => setActiveBottomTab('OfflineAI')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-colors flex items-center gap-1.5 border border-dashed border-transparent hover:border-[#bc8cff]/50 ${activeBottomTab === 'OfflineAI' ? 'bg-[#bc8cff]/20 text-[#bc8cff] border-[#bc8cff]' : 'hover:bg-[#21262d] text-[#bc8cff]/70'}`}><BrainCircuit size={12}/> Local AI Generators</button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a]">
        
        {/* TOP HALF: Timeline and Arrangement */}
        <div className="flex-1 flex min-h-0 relative border-b border-[#30363d]">
          {/* Left Panel: Tracks Control */}
          <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 z-10 overflow-y-hidden">
             
             <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                {/* Track Headers */}
                <TrackHeader 
                   id="01" name="Koto (Japanese)" color="#e3b341" icon={<Music size={12}/>} vst="EastWest Koto Play" 
                   tempo="+0.0% (Elastique3)" pitch="Preserved" vol={80} pan={0} volPercent={65}
                />
                <TrackHeader 
                   id="02" name="Sitar (Indian)" color="#ff7b72" icon={<Music size={12}/>} vst="Sitar Master" 
                   tempo="+15.2% (Complex)" pitch="+3 st" vol={40} pan={-20} volPercent={30}
                />
                <TrackHeader 
                   id="03" name="Taiko Drums" color="#f85149" icon={<Activity size={12}/>} vst="Kontakt Factory" 
                   tempo="+0.0% (Percussive)" pitch="0 st" vol={90} pan={10} volPercent={80}
                />
                <TrackHeader 
                   id="04" name="AI Vocal Lead" color="#bc8cff" icon={<BrainCircuit size={12}/>} vst="Local Tensor / Bark" 
                   tempo="Melodyne (Tuned)" pitch="-3.0 dB" vol={65} pan={0} volPercent={45} 
                />
                <TrackHeader 
                   id="05" name="Cinematic Strings" color="#58a6ff" icon={<Waves size={12}/>} vst="Spitfire Albion" 
                   tempo="+0.0% (Smooth)" pitch="0 st" vol={70} pan={0} volPercent={50}
                />
                
                {/* Add Track */}
                <div className="p-2 border-b border-[#30363d] flex justify-center">
                   <button className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#8b949e] border border-dashed border-[#30363d] rounded w-full py-2 justify-center hover:bg-[#21262d] hover:text-white transition-colors">
                      <Plus size={12} /> Add Audio / Instrument Track
                   </button>
                </div>
             </div>
          </div>

          {/* Right Panel: Arrangement Canvas */}
          <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
             {/* Ruler/Timecode */}
             <div className="h-8 bg-[#161b22] border-b border-[#30363d] flex items-end overflow-hidden sticky top-0 z-10 shrink-0">
                <div className="absolute left-[20%] top-0 bottom-0 w-[1px] bg-[#f85149] z-20 shadow-[0_0_10px_#f85149]">
                   <div className="absolute top-0 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-transparent border-t-[#f85149]"></div>
                </div>
                {[...Array(40)].map((_, i) => (
                   <div key={i} className="flex-1 min-w-[60px] border-r border-[#30363d] h-4 flex flex-col justify-end px-1 select-none">
                      <span className="text-[9px] text-[#8b949e] leading-none mb-1">{`01:${String(i * 15).padStart(2, '0')}`}</span>
                   </div>
                ))}
             </div>
             
             {/* Timeline Tracks Area */}
             <div className="flex-1 overflow-auto custom-scrollbar relative">
                {/* Track 1 Canvas */}
                <div className="h-[90px] border-b border-[#30363d] relative group">
                   <div className="absolute top-1 left-[10px] w-[200px] h-full bg-[#161b22] rounded overflow-hidden">
                      <div className="h-4 bg-[#e3b341]/20 border-b border-[#e3b341]/30 text-[9px] text-[#e3b341] font-bold px-1 select-none flex justify-between items-center">Koto_Intro_Take02.wav <Scissors size={8}/></div>
                      <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="w-full h-[calc(100%-16px)] text-[#e3b341] opacity-70">
                         <path d="M0,50 Q5,30 10,50 T20,50 T30,50 T40,20 T50,50 T60,50 T70,50 T80,30 T90,50 T100,50" fill="none" stroke="currentColor" strokeWidth="1" />
                      </svg>
                   </div>
                   <div className="absolute top-1 left-[210px] w-[400px] h-full bg-[#161b22] rounded overflow-hidden">
                      <div className="h-4 bg-[#e3b341]/20 border-b border-[#e3b341]/30 text-[9px] text-[#e3b341] font-bold px-1 select-none">Koto_Main_Pattern.mid</div>
                      {/* MIDI Mock */}
                      <div className="relative w-full h-[calc(100%-16px)]">
                         <div className="absolute top-[20%] left-[10px] w-8 h-[3px] bg-[#e3b341]"></div>
                         <div className="absolute top-[30%] left-[50px] w-4 h-[3px] bg-[#e3b341]"></div>
                         <div className="absolute top-[40%] left-[70px] w-8 h-[3px] bg-[#e3b341]"></div>
                         <div className="absolute top-[20%] left-[110px] w-12 h-[3px] bg-[#e3b341]"></div>
                         <div className="absolute top-[60%] left-[150px] w-4 h-[3px] bg-[#e3b341]"></div>
                         <div className="absolute top-[50%] left-[170px] w-8 h-[3px] bg-[#e3b341]"></div>
                         <div className="absolute top-[40%] left-[210px] w-12 h-[3px] bg-[#e3b341]"></div>
                      </div>
                   </div>
                </div>

                {/* Track 2 Canvas */}
                <div className="h-[90px] border-b border-[#30363d] relative">
                   <div className="absolute top-1 left-[210px] w-[400px] h-full bg-[#161b22] rounded overflow-hidden">
                      <div className="h-4 bg-[#ff7b72]/20 border-b border-[#ff7b72]/30 text-[9px] text-[#ff7b72] font-bold px-1 select-none flex justify-between items-center"><BrainCircuit size={8}/> Generator_Sitar.wav</div>
                      <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="w-full h-[calc(100%-16px)] text-[#ff7b72] opacity-70">
                         <path d="M0,50 C10,90 20,10 30,50 S40,70 50,50 S60,20 70,50 S80,90 100,50" fill="none" stroke="currentColor" strokeWidth="1" />
                      </svg>
                   </div>
                </div>

                {/* Track 3 Canvas */}
                <div className="h-[90px] border-b border-[#30363d] relative">
                   <div className="absolute top-1 left-[0px] w-[610px] h-full bg-[#161b22] rounded overflow-hidden">
                      <div className="h-4 bg-[#f85149]/20 border-b border-[#f85149]/30 text-[9px] text-[#f85149] font-bold px-1 select-none">Taiko_Hits_Master.wav</div>
                      <div className="w-full h-[calc(100%-16px)] flex items-center px-2">
                         {[...Array(30)].map((_, i) => (
                           <div key={i} className="flex-1 bg-[#f85149] rounded-sm mx-[1px]" style={{ height: Math.max(10, Math.random() * 60) + '%' }}></div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Track 4 Canvas (Vocal AI) */}
                <div className="h-[90px] border-b border-[#30363d] relative">
                   <div className="absolute top-1 left-[150px] w-[300px] h-full bg-[#161b22] rounded overflow-hidden">
                      <div className="h-4 bg-[#bc8cff]/20 border-b border-[#bc8cff]/30 text-[9px] text-[#bc8cff] font-bold px-1 select-none flex items-center justify-between">Local AI Vocals (Bark) <div className="bg-[#bc8cff]/20 px-1 rounded text-[7px]" title="Pitch Curve Interpolated">PITCH CORRECTED</div></div>
                      {/* Melodyne Mockup inside timeline */}
                      <div className="relative w-full h-[calc(100%-16px)] overflow-hidden">
                         <svg className="absolute inset-0 w-full h-full text-[#bc8cff] opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M 0 60 Q 20 60 30 40 T 60 40 T 70 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                         </svg>
                         <div className="absolute top-[50%] left-[20px] h-4 w-12 bg-[#bc8cff]/40 rounded-full border border-[#bc8cff]"></div>
                         <div className="absolute top-[35%] left-[90px] h-4 w-20 bg-[#bc8cff]/40 rounded-full border border-[#bc8cff]"></div>
                         <div className="absolute top-[45%] left-[200px] h-4 w-16 bg-[#bc8cff]/40 rounded-full border border-[#bc8cff]"></div>
                      </div>
                   </div>
                </div>
             </div>

          </div>
        </div>

        {/* BOTTOM HALF: Dock Tools */}
        <div className="h-[320px] bg-[#0d1117] flex shrink-0 relative z-20">
            {/* Dock Control Bar */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between select-none">
               <div className="flex items-center gap-4 text-[#c9d1d9] text-[12px] font-bold">
                  {/* Transport Controls */}
                  <div className="flex gap-1 items-center mr-8">
                     <button className="w-8 h-8 rounded hover:bg-[#21262d] flex items-center justify-center text-[#8b949e] hover:text-white transition-colors"><SkipBack size={14}/></button>
                     <button className="w-8 h-8 rounded hover:bg-[#21262d] flex items-center justify-center text-[#8b949e] hover:text-white transition-colors"><Rewind size={14}/></button>
                     <button className="w-10 h-10 rounded bg-[#21262d] flex items-center justify-center text-white hover:bg-[#30363d] transition-colors border border-[#30363d] shadow-lg hover:text-[#3fb950]"><Play size={20}/></button>
                     <button className="w-8 h-8 rounded hover:bg-[#21262d] flex items-center justify-center text-[#8b949e] hover:text-white transition-colors"><Pause size={14}/></button>
                     <button className="w-8 h-8 rounded hover:bg-[#21262d] flex items-center justify-center text-[#8b949e] hover:text-white transition-colors"><FastForward size={14}/></button>
                     <button className="w-8 h-8 rounded hover:bg-[#21262d] flex items-center justify-center text-[#8b949e] hover:text-[#f85149] transition-colors ml-2"><Circle size={14} className="fill-current"/></button>
                  </div>
                  
                  <div className="w-[1px] h-6 bg-[#30363d]"></div>

                  {/* Active Tool Label */}
                  {activeBottomTab === 'Mixer' && <><Sliders size={16} className="text-[#58a6ff]"/> Mixing Console</>}
                  {activeBottomTab === 'PianoRoll' && <><Grid size={16} className="text-[#f85149]"/> MIDI / Piano Roll Editor</>}
                  {activeBottomTab === 'Spectral' && <><Waves size={16} className="text-[#e3b341]"/> Spectral Advanced Editor</>}
                  {activeBottomTab === 'OfflineAI' && <><BrainCircuit size={16} className="text-[#bc8cff]"/> Local AI Deep Generators</>}
               </div>

               <div className="flex gap-2">
                  <button className="px-3 py-1 bg-[#21262d] border border-[#30363d] rounded text-[10px] text-[#c9d1d9] hover:bg-[#30363d]">Master Track: <span className="text-[#58a6ff]">-1.2 dB</span></button>
               </div>
            </div>

            {/* Dock Workspace Canvas */}
            <div className="flex-1 mt-10 flex overflow-hidden">
               {activeBottomTab === 'Mixer' && <MixerConsole />}
               {activeBottomTab === 'OfflineAI' && <OfflineAIToolkit />}
               {activeBottomTab === 'Spectral' && <SpectralEditor />}
               {activeBottomTab === 'PianoRoll' && <div className="flex-1 flex items-center justify-center text-[#8b949e] bg-[#050505]">MIDI Piano Roll rendering optimized...</div>}
            </div>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// COMPONENTS
// ----------------------------------------------------

function TrackHeader({ id, name, color, icon, vst, tempo, pitch, vol, volPercent, pan }: any) {
   return (
      <div className="h-[90px] border-b border-[#30363d] bg-[#161b22] flex flex-col p-2 shrink-0 relative" style={{borderLeft: `4px solid ${color}`}}>
         <div className="flex justify-between items-center text-[11px] text-white font-bold mb-1.5">
            <span className="flex items-center gap-1.5 truncate max-w-[130px]"><span style={{color: color}}>{icon}</span> {id} - {name}</span>
            <div className="flex gap-1 text-[8px] shrink-0">
               <button className="w-[18px] h-[18px] bg-[#21262d] border border-[#30363d] rounded flex items-center justify-center text-[#8b949e] font-bold hover:text-white transition-colors">R</button>
               <button className="w-[18px] h-[18px] bg-[#21262d] border border-[#30363d] rounded flex items-center justify-center text-[#8b949e] font-bold hover:text-white transition-colors">S</button>
               <button className="w-[18px] h-[18px] bg-[#21262d] border border-[#30363d] rounded flex items-center justify-center text-[#8b949e] font-bold hover:text-white transition-colors focus:bg-[#f85149] focus:text-white">M</button>
            </div>
         </div>
         <div className="flex gap-2 items-center mb-1">
            <Volume2 size={12} className="text-[#8b949e]"/>
            <input type="range" className="w-[70px] h-1 bg-[#0a0a0a] rounded appearance-none outline-none" style={{accentColor: color}} defaultValue={vol} />
            <div className="flex-1 h-3 bg-[#050505] rounded overflow-hidden border border-[#30363d] relative">
               <div className="absolute inset-y-0 left-0" style={{width: `${volPercent}%`, background: `linear-gradient(90deg, #3fb950, ${color})`}}></div>
               {/* Peak lines over meter */}
               <div className="absolute right-[10%] top-0 bottom-0 w-[1px] bg-[#f85149] opacity-50"></div>
            </div>
         </div>
         <div className="flex justify-between text-[9px] mb-1 opacity-70">
            <span className="text-white">Pan: {pan > 0 ? `R${pan}` : pan < 0 ? `L${Math.abs(pan)}` : 'C'}</span>
            <span className="text-[#8b949e]">Out: Master</span>
         </div>
         <div className="grid grid-cols-2 gap-1 text-[9px] mt-auto">
            <div className="flex items-center justify-between bg-[#0a0a0a] px-1.5 py-0.5 border border-[#30363d] rounded text-[#8b949e] truncate leading-none">
               T: <span className="text-white truncate max-w-[60px]" style={{color: color}}>{tempo}</span>
            </div>
            <div className="flex items-center justify-between bg-[#0a0a0a] px-1.5 py-0.5 border border-[#30363d] rounded text-[#8b949e] truncate leading-none">
               P: <span className="text-white truncate max-w-[60px]" style={{color: color}}>{pitch}</span>
            </div>
         </div>
      </div>
   )
}


function MixerConsole() {
   return (
      <div className="flex-1 flex bg-[#0d1117] gap-[1px] px-2 pt-2 overflow-x-auto custom-scrollbar">
         {/* Mixer Channels */}
         <MixerChannel name="Koto" color="#e3b341" val={-3.2} isMaster={false} effects={['FabFilter EQ', 'Valhalla Room']} />
         <MixerChannel name="Sitar" color="#ff7b72" val={-6.4} isMaster={false} effects={['Saturation', 'Delay']} />
         <MixerChannel name="Taiko" color="#f85149" val={-1.0} isMaster={false} effects={['Compressor', 'Transient', 'EQ']} />
         <MixerChannel name="AI Vox" color="#bc8cff" val={-4.5} isMaster={false} effects={['AutoTune', 'DeEsser', 'LA-2A']} />
         <MixerChannel name="Strings" color="#58a6ff" val={-12.0} isMaster={false} effects={['Soothe2', 'Reverb']} />
         
         <div className="w-[1px] bg-[#30363d] mx-2"></div>
         <div className="w-16 h-full flex flex-col justify-end pb-[70px] shrink-0 text-[8px] text-[#8b949e] font-mono text-right pr-2 select-none">
            <div className="flex flex-col justify-between h-[150px]">
               <span>0</span><span>-6</span><span>-12</span><span>-24</span><span>-48</span><span>-inf</span>
            </div>
         </div>
         
         {/* Master Channel */}
         <MixerChannel name="MASTER" color="#58a6ff" val={-1.2} isMaster={true} effects={['Ozone 10', 'Pro-L 2']} />
      </div>
   )
}

function MixerChannel({ name, color, val, isMaster, effects }: any) {
   return (
      <div className={`w-[80px] h-full ${isMaster ? 'bg-[#161b22]' : 'bg-[#0a0a0a]'} border border-[#30363d] border-b-0 rounded-t-lg shrink-0 flex flex-col`}>
         <div className="h-6 border-b border-[#30363d] bg-[#21262d] flex items-center justify-center text-[10px] font-bold" style={{color: isMaster ? '#58a6ff' : color}}>{name}</div>
         
         {/* Inserts Area */}
         <div className="h-[70px] border-b border-[#30363d] p-1 flex flex-col gap-0.5">
            {effects.map((e:string, i:number) => (
               <div key={i} className="text-[8px] px-1 py-0.5 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] truncate rounded-sm hover:border-[#58a6ff] cursor-pointer">
                  <div className="w-1 h-1 bg-[#3fb950] inline-block rounded-full mr-1"></div>{e}
               </div>
            ))}
            <div className="text-[8px] px-1 py-0.5 border border-dashed border-[#30363d] text-[#8b949e] text-center rounded-sm hover:bg-[#21262d] cursor-pointer cursor-pointer mt-auto">+</div>
         </div>
         
         {/* Pan control dummy */}
         <div className="h-[30px] border-b border-[#30363d] flex items-center justify-center relative">
            <div className="w-6 h-6 rounded-full border border-[#30363d] bg-[#161b22] relative flex justify-center cursor-pointer">
               <div className="w-[2px] h-2 bg-[#8b949e] absolute top-[2px]"></div>
            </div>
            <div className="absolute text-[8px] text-[#8b949e] font-mono bottom-0 translate-y-[8px]">C</div>
         </div>
         
         {/* Fader & Meter Area */}
         <div className="flex-1 flex mt-4 mb-2 justify-center gap-2 relative z-0">
            {/* Meter */}
            <div className="w-3 h-full bg-[#050505] rounded border border-[#30363d] relative overflow-hidden flex items-end">
               <div className="w-full absolute bottom-0 bg-gradient-to-t from-[#3fb950] via-[#e3b341] to-[#f85149]" style={{ height: `${80 + val * 2}%` }}></div>
            </div>
            {/* Fader Track */}
            <div className="w-1 h-full bg-[#050505] border-x border-[#30363d] relative z-10 flex items-center">
               {/* Fader Cap */}
               <div className="w-5 h-8 bg-[#21262d] border border-[#8b949e] rounded shadow-lg absolute left-1/2 -translate-x-1/2 cursor-ns-resize shadow-[0_5px_10px_rgba(0,0,0,0.8)]" style={{bottom: '40%'}}>
                  <div className="w-full h-[2px] bg-white absolute top-1/2 -translate-y-1/2"></div>
               </div>
            </div>
         </div>
         
         {/* Value & Mute/Solo */}
         <div className="p-1 flex flex-col gap-1 items-center mb-1">
            <div className="text-[10px] font-mono font-bold bg-[#050505] w-full text-center border border-[#30363d] rounded" style={{color: val > 0 ? '#f85149' : '#c9d1d9'}}>{val > 0 ? '+' : ''}{val.toFixed(1)}</div>
            <div className="flex gap-1">
               <button className="w-[22px] h-[22px] bg-[#161b22] border border-[#30363d] rounded text-[10px] font-bold text-[#8b949e] hover:bg-[#30363d]">M</button>
               <button className="w-[22px] h-[22px] bg-[#161b22] border border-[#30363d] rounded text-[10px] font-bold text-[#8b949e] hover:bg-[#30363d]">S</button>
            </div>
         </div>
      </div>
   )
}


function OfflineAIToolkit() {
   return (
      <div className="flex-1 flex bg-[#0a0a0a] p-4 gap-4">
         <div className="w-[300px] border border-[#bc8cff]/30 bg-[#bc8cff]/5 rounded-lg p-3 flex flex-col shadow-[0_0_20px_rgba(188,140,255,0.05)]">
            <div className="flex items-center gap-2 mb-2">
               <BrainCircuit size={16} className="text-[#bc8cff]" />
               <span className="text-[#c9d1d9] font-bold text-[12px] uppercase">Bark Text-to-Speech / Vocals</span>
            </div>
            <p className="text-[10px] text-[#8b949e] mb-3">Offline 100% realistic vocal synthesis and singing. Supports pitch shaping.</p>
            <textarea className="w-full h-20 bg-[#000] border border-[#bc8cff]/30 rounded text-[#c9d1d9] text-[11px] p-2 resize-none outline-none focus:border-[#bc8cff]/70" placeholder="[Lyrics / Dialogue here...]"></textarea>
            <div className="flex justify-between items-center mt-2">
               <select className="bg-[#161b22] text-[10px] text-white border border-[#30363d] rounded px-1 py-1 outline-none">
                  <option>Voice: EN_Female_Singer</option>
                  <option>Voice: JP_Female_Anime</option>
                  <option>Voice: DE_Male_Gruff</option>
               </select>
               <button className="bg-[#bc8cff] hover:bg-[#d2a8ff] text-black text-[10px] font-bold px-3 py-1.5 rounded transition-colors">Generate</button>
            </div>
         </div>
         
         <div className="w-[300px] border border-[#3fb950]/30 bg-[#3fb950]/5 rounded-lg p-3 flex flex-col shadow-[0_0_20px_rgba(63,185,80,0.05)]">
            <div className="flex items-center gap-2 mb-2">
               <Music size={16} className="text-[#3fb950]" />
               <span className="text-[#c9d1d9] font-bold text-[12px] uppercase">Music Gen (AudioCraft)</span>
            </div>
            <p className="text-[10px] text-[#8b949e] mb-3">Full stereo tracks from text prompt. Will snap to Master Project Tempo.</p>
            <textarea className="w-full h-20 bg-[#000] border border-[#3fb950]/30 rounded text-[#c9d1d9] text-[11px] p-2 resize-none outline-none focus:border-[#3fb950]/70" placeholder="e.g., 90bpm lo-fi hip hop beat with calm rhodes piano..."></textarea>
            <div className="flex justify-between items-center mt-2">
               <span className="text-[9px] text-[#8b949e] border border-[#3fb950]/20 px-1 py-0.5 rounded flex items-center"><Cpu size={10} className="text-[#3fb950] mr-1"/> CUDA Detected</span>
               <button className="bg-[#3fb950] hover:bg-[#5cdb6d] text-black text-[10px] font-bold px-3 py-1.5 rounded transition-colors">Generate</button>
            </div>
         </div>

         <div className="flex-1 border border-[#e3b341]/30 bg-[#e3b341]/5 rounded-lg p-3 flex flex-col shadow-[0_0_20px_rgba(227,179,65,0.05)]">
            <div className="flex items-center gap-2 mb-2">
               <Zap size={16} className="text-[#e3b341]" />
               <span className="text-[#c9d1d9] font-bold text-[12px] uppercase">Stem Separation</span>
            </div>
            <p className="text-[10px] text-[#8b949e] mb-3">Extract Vocals, Drums, Bass, and Other using local HTDemucs standard model.</p>
            <div className="flex-1 border-2 border-dashed border-[#e3b341]/30 rounded flex items-center justify-center flex-col gap-2 cursor-pointer hover:border-[#e3b341]/60 hover:bg-[#e3b341]/10 transition-colors">
               <DownloadCloud size={24} className="text-[#e3b341]/50"/>
               <span className="text-[11px] text-[#e3b341]/80 font-bold">Drag audio region here</span>
            </div>
         </div>
      </div>
   )
}


function SpectralEditor() {
   return (
      <div className="flex-1 flex flex-col bg-[#050505] p-2">
         {/* Toolbar */}
         <div className="flex gap-2 items-center text-[#8b949e] bg-[#161b22] border border-[#30363d] p-1.5 rounded-lg mb-2 inline-flex w-fit mx-auto">
            <button className="p-1 hover:text-white hover:bg-[#21262d] rounded" title="Time Selection"><BoxSelect size={16}/></button>
            <button className="p-1 hover:text-white hover:bg-[#21262d] rounded" title="Frequency Selection"><Square size={16}/></button>
            <button className="p-1 hover:text-[#f85149] hover:bg-[#f85149]/10 rounded text-[#e3b341]" title="Healing Brush / Erase Noise"><Brush size={16}/></button>
            <div className="w-[1px] h-4 bg-[#30363d] mx-1"></div>
            <button className="p-1 hover:text-white hover:bg-[#21262d] rounded relative" title="Harmonic Selection">
               <Layers size={16}/>
            </button>
            <span className="text-[10px] font-bold uppercase ml-2 text-[#e3b341]">RX Spectral Healing Tool</span>
         </div>
         {/* Workspace */}
         <div className="flex-1 border border-[#30363d] rounded-lg overflow-hidden relative">
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#161b22] border-l border-[#30363d] flex flex-col justify-between text-[8px] text-[#8b949e] px-1 py-2 select-none z-10 font-mono text-right">
               <span>20k</span><span>10k</span><span>5k</span><span>1k</span><span>500</span><span>50</span>
            </div>
            
            {/* The giant spectral heat map mockup */}
            <div className="w-full h-full relative" style={{background: 'linear-gradient(to top, #020024 0%, #090979 25%, #8a2be2 50%, #f85149 80%, #e3b341 100%)', filter: 'contrast(1.5) brightness(0.8)'}}>
               {/* Noise / Heatmap detail */}
               <div className="w-full h-full mix-blend-color-burn opacity-70 bg-[url('https://transparenttextures.com/patterns/stardust.png')]"></div>
               
               {/* Selected area bounds showing editing capability */}
               <div className="absolute top-[30%] left-[40%] w-[15%] h-[20%] border border-[#e3b341] bg-[#e3b341]/10 flex items-center justify-center pointer-events-none shadow-[0_0_20px_#e3b341]">
                  <div className="text-[10px] text-white font-bold bg-[#161b22]/80 px-1 rounded">Erase Sibilance</div>
               </div>
            </div>
         </div>
      </div>
   )
}

function Square({ size, className }: { size?: number, className?: string }) { 
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>; 
}
