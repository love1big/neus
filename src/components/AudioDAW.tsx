import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, SkipBack, SkipForward, Mic, SlidersHorizontal, AudioWaveform, Settings2, Activity, Volume2, Save, Download, FolderOpen, Plus, Trash2, Layers, Repeat, MoveHorizontal, Music } from 'lucide-react';

export default function AudioDAW() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState(1);

  const tracks = [
    { id: 1, name: 'Ambient Pad 1', color: '#ff7b72', volume: 80, pan: 0, fx: ['Reverb'] },
    { id: 2, name: 'Deep Sub Bass', color: '#58a6ff', volume: 95, pan: 0, fx: ['EQ', 'Sat'] },
    { id: 3, name: '808 Drum Machine', color: '#3fb950', volume: 100, pan: 10, fx: ['Comp'] },
    { id: 4, name: 'Arp Pluck Synth', color: '#e3b341', volume: 60, pan: -20, fx: ['Delay', 'Chorus'] },
    { id: 5, name: 'FX Sweeps & Risers', color: '#bc8cff', volume: 70, pan: 0, fx: [] },
  ];

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0d1117] text-[#8b949e] font-sans text-xs overflow-hidden select-none">
      {/* Top Menubar / Transport Controls */}
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2 shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ff7b72] text-[#0d1117] rounded text-[10px] font-bold shadow-md uppercase tracking-wider">
               <AudioWaveform size={14} /> Full DAW Studio
            </div>
            <div className="flex items-center gap-3">
               <button className="text-[#8b949e] hover:text-white transition-colors" title="File Menu"><Settings2 size={16}/></button>
               <button className="text-[#8b949e] hover:text-[#ff7b72] transition-colors" title="Save Project"><Save size={16}/></button>
               <button className="text-[#8b949e] hover:text-white transition-colors" title="Export Audio (.WAV)"><Download size={16}/></button>
               <button className="text-[#8b949e] hover:text-white transition-colors" title="Load Project"><FolderOpen size={16}/></button>
            </div>
         </div>

         {/* Center Transport & Display */}
         <div className="flex items-center gap-6">
            <div className="flex items-center bg-[#090b0e] border border-[#30363d] rounded-full p-0.5 shadow-inner">
               <button className="p-2 text-[#8b949e] hover:text-white transition-colors rounded-full"><SkipBack size={16} fill="currentColor"/></button>
               <button onClick={() => setIsPlaying(!isPlaying)} className={`p-2 rounded-full transition-colors flex items-center justify-center shadow-lg ${isPlaying ? 'bg-[#ff7b72] text-white shadow-[0_0_10px_rgba(255,123,114,0.5)]' : 'bg-[#21262d] text-white hover:bg-[#30363d]'}`}>
                  {isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor" className="ml-0.5"/>}
               </button>
               <button className="p-2 text-[#8b949e] hover:text-white transition-colors rounded-full"><Square size={16} fill="currentColor"/></button>
               <button className="p-2 text-[#8b949e] hover:text-white transition-colors rounded-full"><SkipForward size={16} fill="currentColor"/></button>
               <button className="p-2 text-[#8b949e] hover:text-[#3fb950] transition-colors rounded-full mr-2"><Repeat size={14}/></button>
            </div>
            
            {/* LED Display Screen */}
            <div className="bg-[#0d1117] border-2 border-[#161b22] shadow-[inset_0_0_10px_rgba(0,0,0,1)] rounded-lg px-4 py-1 flex items-center gap-6 font-mono">
               <div className="flex flex-col items-center">
                  <span className="text-[9px] text-[#8b949e] uppercase font-bold tracking-widest">Tempo</span>
                  <span className="text-white text-lg font-bold">128.0</span>
               </div>
               <div className="w-px h-6 bg-[#30363d]"></div>
               <div className="flex flex-col items-center">
                  <span className="text-[9px] text-[#8b949e] uppercase font-bold tracking-widest">Time</span>
                  <span className="text-[#58a6ff] text-lg font-bold tracking-widest">02:14:45</span>
               </div>
               <div className="w-px h-6 bg-[#30363d]"></div>
               <div className="flex flex-col items-center">
                  <span className="text-[9px] text-[#8b949e] uppercase font-bold tracking-widest">Bars</span>
                  <span className="text-[#3fb950] text-lg font-bold tracking-widest">032 / 4 / 2</span>
               </div>
            </div>
         </div>

         {/* Toolbar Right */}
         <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 bg-red-900/30 text-red-500 border border-red-900/50 px-3 py-1 rounded font-bold hover:bg-red-900/50 transition-colors shadow-sm">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Record
            </button>
            <div className="w-px h-6 bg-[#30363d] mx-2"></div>
            <div className="flex items-center gap-2">
               <Volume2 size={16} className="text-[#8b949e]"/>
               <input type="range" min="0" max="100" defaultValue="80" className="w-24 accent-[#ff7b72]"/>
            </div>
         </div>
      </div>

      {/* Main DAW Interface */}
      <div className="flex flex-1 overflow-hidden">
         {/* Mixer & Track Controls (Left) */}
         <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 overflow-y-auto custom-scrollbar relative z-10">
            {tracks.map(t => (
               <div key={t.id} onClick={() => setActiveTrack(t.id)} className={`relative flex flex-col p-2 border-b border-[#30363d] cursor-pointer transition-colors ${activeTrack === t.id ? 'bg-[#21262d] shadow-inner' : 'hover:bg-[#1a1f26]'}`}>
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-md" style={{ backgroundColor: t.color }}></div>
                  <div className="flex justify-between items-center mb-2 pl-2">
                     <span className="text-white font-bold text-[11px] truncate">{t.name}</span>
                     <div className="flex gap-1">
                        <button className="w-5 h-5 flex items-center justify-center bg-[#0d1117] border border-[#30363d] rounded text-[9px] hover:bg-yellow-500 hover:text-black font-bold">M</button>
                        <button className="w-5 h-5 flex items-center justify-center bg-[#0d1117] border border-[#30363d] rounded text-[9px] hover:bg-blue-500 hover:text-white font-bold">S</button>
                        <button className="w-5 h-5 flex items-center justify-center bg-[#0d1117] border border-[#30363d] rounded text-[9px] hover:bg-red-500 hover:text-white font-bold"><Mic size={10}/></button>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 pl-2 text-[10px]">
                     <div className="flex items-center gap-1.5 flex-1">
                        <Volume2 size={12} className="text-[#8b949e]"/>
                        <input type="range" min="0" max="100" defaultValue={t.volume} className="w-full accent-white h-1 bg-[#30363d] rounded-full appearance-none"/>
                     </div>
                     <div className="flex items-center gap-1.5 w-16">
                        <MoveHorizontal size={12} className="text-[#8b949e]"/>
                        <input type="range" min="-50" max="50" defaultValue={t.pan} className="w-full accent-white h-1 bg-[#30363d] rounded-full appearance-none"/>
                     </div>
                  </div>
                  {t.fx.length > 0 && (
                     <div className="flex gap-1 mt-2 pl-2">
                        {t.fx.map(fx => <span key={fx} className="bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/30 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">{fx}</span>)}
                     </div>
                  )}
               </div>
            ))}
            <button className="m-3 py-2 border border-dashed border-[#30363d] rounded text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-[10px]">
               <Plus size={14}/> Add Instrument Track
            </button>
         </div>

         {/* Arrangement / Sequencer View (Right) */}
         <div className="flex-1 bg-[#090b0e] relative overflow-x-auto overflow-y-auto custom-scrollbar flex flex-col">
            {/* Timeline Ruler */}
            <div className="h-8 border-b border-[#30363d] bg-[#161b22]/90 sticky top-0 z-20 flex text-[9px] font-mono text-[#8b949e]">
               {Array.from({length: 64}).map((_, i) => (
                  <div key={i} className="min-w-[80px] h-full border-r border-[#30363d]/50 flex items-end pb-1 pl-1 shrink-0 relative">
                     <span>{i + 1}</span>
                     {/* Sub-beats */}
                     <div className="absolute bottom-0 left-1/4 w-px h-1.5 bg-[#30363d]"></div>
                     <div className="absolute bottom-0 left-2/4 w-px h-2 bg-[#30363d]"></div>
                     <div className="absolute bottom-0 left-3/4 w-px h-1.5 bg-[#30363d]"></div>
                  </div>
               ))}
               
               {/* Playhead Scrubber */}
               <div className="absolute top-0 bottom-0 left-[260px] w-[2px] bg-white z-30 shadow-[0_0_10px_white] pointer-events-none">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white absolute -top-0 -left-[5px]"></div>
               </div>
            </div>

            {/* Arrangement Grid */}
            <div className="flex flex-col relative w-max min-w-full bg-[linear-gradient(90deg,#161b22_1px,transparent_1px)] bg-[size:20px_100%]">
               {tracks.map((t, index) => (
                  <div key={t.id} className="h-24 border-b border-[#30363d]/50 flex items-center relative hover:bg-white/5 transition-colors group">
                     {/* Background Horizontal Rules per scale */}
                     <div className="absolute inset-0 bg-[linear-gradient(180deg,#30363d22_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>

                     {/* Audio / MIDI Clips Simulator */}
                     {index === 0 && (
                        <div className="absolute left-[80px] w-[320px] h-20 rounded bg-[#ff7b72]/20 border border-[#ff7b72] items-center overflow-hidden">
                           <div className="text-[9px] text-[#ff7b72] font-bold px-2 py-0.5 border-b border-[#ff7b72]/50 bg-[#ff7b72]/10 sticky left-0 uppercase">Intro Pad Loop.midi</div>
                           {/* Fake Midi Notes */}
                           <div className="absolute top-4 left-4 w-12 h-2 bg-[#ff7b72]"></div>
                           <div className="absolute top-8 left-16 w-24 h-2 bg-[#ff7b72]"></div>
                           <div className="absolute top-12 left-20 w-32 h-2 bg-[#ff7b72]"></div>
                        </div>
                     )}
                     {index === 1 && (
                        <div className="absolute left-[240px] w-[160px] h-20 rounded bg-[#58a6ff]/20 border border-[#58a6ff] flex items-center overflow-hidden">
                           <div className="absolute inset-0 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxwYXRoIGQ9Ik0wLDUwIFEzMCwyMCA1MCw1MCBUNTAsNTAiIHN0cm9rZT0iIzU4YTZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+')] bg-repeat-x"></div>
                           <div className="text-[9px] text-[#58a6ff] font-bold px-2 py-0.5 border-b border-[#58a6ff]/50 bg-[#58a6ff]/10 sticky left-0 top-0 w-full uppercase backdrop-blur-sm z-10">Sub_Drop_01.wav</div>
                        </div>
                     )}
                     {index === 2 && (
                        <>
                           <div className="absolute left-[80px] w-[80px] h-20 rounded bg-[#3fb950]/20 border border-[#3fb950] overflow-hidden">
                               <div className="text-[9px] text-[#3fb950] font-bold px-1 py-0.5 border-b border-[#3fb950]/50 bg-[#3fb950]/10 uppercase">808 Beat</div>
                               <div className="w-1 h-12 bg-[#3fb950] absolute left-2 top-4"></div>
                               <div className="w-1 h-6 bg-[#3fb950] absolute left-6 top-8"></div>
                               <div className="w-1 h-3 bg-[#3fb950] absolute left-10 top-11"></div>
                           </div>
                           <div className="absolute left-[160px] w-[80px] h-20 rounded bg-[#3fb950]/20 border border-[#3fb950] overflow-hidden">
                               <div className="text-[9px] text-[#3fb950] font-bold px-1 py-0.5 border-b border-[#3fb950]/50 bg-[#3fb950]/10 uppercase">808 Beat</div>
                               <div className="w-1 h-12 bg-[#3fb950] absolute left-2 top-4"></div>
                               <div className="w-1 h-6 bg-[#3fb950] absolute left-6 top-8"></div>
                               <div className="w-1 h-10 bg-[#3fb950] absolute left-14 top-6"></div>
                           </div>
                        </>
                     )}
                  </div>
               ))}
               
               {/* Empty Space filler */}
               <div className="h-full min-h-[400px]"></div>
            </div>
         </div>
      </div>

      {/* Bottom Device Rack / Plugins Editor */}
      <div className="h-[280px] border-t border-[#30363d] bg-[#161b22] flex shrink-0 overflow-hidden relative z-20">
         {/* Device Chain Selector */}
         <div className="w-48 border-r border-[#30363d] bg-[#0d1117] flex flex-col p-2 space-y-2 overflow-y-auto">
            <h3 className="text-white font-bold text-[10px] uppercase tracking-wider mb-2 border-b border-[#30363d] pb-2 flex items-center gap-2"><Layers size={14} className="text-[#e3b341]" /> Device Chain</h3>
            
            <div className="bg-[#1f6feb]/20 border border-[#1f6feb] rounded p-2 text-white font-bold flex items-center justify-between cursor-pointer shadow-inner">
               <div className="flex items-center gap-2"><Music size={14}/> Serum Synth</div>
               <div className="w-2 h-2 rounded-full bg-[#3fb950] shadow-[0_0_5px_#3fb950]"></div>
            </div>
            
            <div className="bg-[#161b22] border border-[#30363d] rounded p-2 text-[#8b949e] font-bold flex items-center justify-between cursor-pointer hover:bg-[#21262d] transition-colors">
               <div className="flex items-center gap-2"><SlidersHorizontal size={14}/> Pro-Q 3 (EQ)</div>
               <div className="w-2 h-2 rounded-full bg-[#3fb950] shadow-[0_0_5px_#3fb950]"></div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded p-2 text-[#8b949e] font-bold flex items-center justify-between cursor-pointer hover:bg-[#21262d] transition-colors">
               <div className="flex items-center gap-2"><Activity size={14}/> Valhalla DSP</div>
               <div className="w-2 h-2 rounded-full bg-[#3fb950] shadow-[0_0_5px_#3fb950]"></div>
            </div>

            <button className="flex items-center justify-center gap-1 w-full py-2 border border-dashed border-[#30363d] rounded text-[#8b949e] hover:text-white transition-colors mt-2">
               <Plus size={14}/> Add VST / Plugin
            </button>
         </div>

         {/* Plugin Interface View (Massive details fake UI for a VST synthesizer) */}
         <div className="flex-1 bg-[#090b0e] p-4 flex flex-col relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]">
            <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full bg-[#1c222b] border-2 border-[#30363d] rounded-xl shadow-2xl p-4 overflow-hidden">
               {/* Plugin Header */}
               <div className="flex justify-between items-center border-b-2 border-black/50 pb-2 mb-4">
                  <div className="flex items-center justify-center gap-3">
                     <div className="flex items-center gap-1 text-[24px] font-black text-white tracking-tighter italic drop-shadow-md">
                        SERUM <span className="text-[#1f6feb] text-[12px] font-normal not-italic tracking-normal ml-2 bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">v1.363</span>
                     </div>
                  </div>
                  <div className="bg-black/50 border border-white/10 rounded px-4 py-1 text-white font-mono text-[12px] text-center min-w-[200px] shadow-inner text-yellow-400">
                     INIT - Warm Future Bass
                  </div>
                  <div className="flex gap-2">
                     <button className="w-6 h-6 bg-[#30363d] text-white rounded font-bold hover:bg-gray-500 text-[10px] flex items-center justify-center">A</button>
                     <button className="w-6 h-6 bg-[#30363d] text-white rounded font-bold hover:bg-gray-500 text-[10px] flex items-center justify-center">B</button>
                  </div>
               </div>

               {/* Plugin Body: Oscillators & Filter */}
               <div className="flex gap-4 h-full">
                  {/* Oscillator A */}
                  <div className="flex-1 bg-black/40 border border-black/80 rounded-lg p-3 flex flex-col shadow-inner">
                     <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-white text-[14px]">OSC A</span>
                        <div className="w-3 h-3 rounded-full bg-[#1f6feb] shadow-[0_0_8px_#1f6feb]"></div>
                     </div>
                     <div className="h-24 bg-black/60 border border-white/10 rounded mb-3 relative overflow-hidden flex items-center justify-center cursor-pointer group">
                        {/* Fake 3D Wavetable */}
                        <svg className="w-full h-full text-[#1f6feb] group-hover:text-blue-300 transition-colors" viewBox="0 0 100 100" preserveAspectRatio="none">
                           <path d="M0,50 Q25,10 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="2"/>
                           <path d="M0,55 Q25,15 50,55 T100,55" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
                           <path d="M0,60 Q25,20 50,60 T100,60" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
                           <path d="M0,65 Q25,25 50,65 T100,65" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
                        </svg>
                        <div className="absolute top-1 left-2 text-[9px] font-bold text-white/50">Analog_BD_Sin</div>
                     </div>
                     {/* Knobs row */}
                     <div className="flex justify-between mt-auto">
                        <Knob label="UNISON" value="7" />
                        <Knob label="DETUNE" value="0.14" />
                        <Knob label="BLEND" value="75%" />
                        <Knob label="PHASE" value="180°" />
                        <Knob label="WT POS" value="34" />
                     </div>
                  </div>

                  {/* Filter */}
                  <div className="flex-[0.8] bg-black/40 border border-black/80 rounded-lg p-3 flex flex-col shadow-inner relative overflow-hidden">
                     <div className="flex justify-between items-center mb-3 bg-red-900/40 -mx-3 -mt-3 p-3 border-b border-red-900/50">
                        <span className="font-bold text-white text-[14px]">FILTER</span>
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_red]"></div>
                     </div>
                     <div className="h-24 bg-black/60 border border-white/10 rounded mb-3 mt-2 relative p-2 flex items-end overflow-hidden cursor-pointer">
                        <svg className="w-full h-full absolute inset-0 text-red-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                           <path d="M0,80 L30,80 C40,80 45,20 50,20 C55,20 60,100 100,100" fill="none" stroke="currentColor" strokeWidth="3"/>
                           <path d="M0,80 L30,80 C40,80 45,20 50,20 C55,20 60,100 100,100 L100,100 L0,100 Z" fill="currentColor" opacity="0.2"/>
                        </svg>
                     </div>
                     {/* Knobs row */}
                     <div className="flex justify-between mt-auto px-2">
                        <Knob label="CUTOFF" value="4.2k" />
                        <Knob label="RES" value="45%" />
                        <Knob label="FAT" value="12%" />
                        <Knob label="DRIVE" value="0%" />
                     </div>
                  </div>

                  {/* Envelopes */}
                  <div className="flex-1 bg-black/40 border border-black/80 rounded-lg p-3 flex flex-col shadow-inner">
                     <div className="flex gap-1 border-b border-white/10 pb-2 mb-3">
                        <button className="px-3 py-1 bg-[#1f6feb] text-white text-[10px] font-bold rounded">ENV 1</button>
                        <button className="px-3 py-1 text-[#8b949e] hover:text-white hover:bg-white/5 text-[10px] font-bold rounded">ENV 2</button>
                        <button className="px-3 py-1 text-[#8b949e] hover:text-white hover:bg-white/5 text-[10px] font-bold rounded">LFO 1</button>
                        <button className="px-3 py-1 text-[#8b949e] hover:text-white hover:bg-white/5 text-[10px] font-bold rounded">LFO 2</button>
                     </div>
                     <div className="flex-1 flex justify-between px-4 pb-2">
                        <SliderKnob label="ATTACK" value="12ms" height="h-2/5" />
                        <SliderKnob label="HOLD" value="0ms" height="h-full" />
                        <SliderKnob label="DECAY" value="1.2s" height="h-3/5" />
                        <SliderKnob label="SUSTAIN" value="-6dB" height="h-4/5" />
                        <SliderKnob label="RELEASE" value="300ms" height="h-1/5" />
                     </div>
                  </div>

                  {/* Real-time Web Audio API Spectrum */}
                  <AudioSpectrumVisualizer isPlaying={isPlaying} />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

// Subcomponents for the DAW Plugin UI
function getNoteFromFreq(freq: number) {
  if (freq < 20) return '---';
  const A4 = 440;
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const halfSteps = Math.round(12 * Math.log2(freq / A4));
  const octave = Math.floor((halfSteps + 57) / 12);
  const noteIndex = (halfSteps + 57) % 12;
  const noteName = notes[noteIndex < 0 ? noteIndex + 12 : noteIndex];
  return `${noteName}${octave}`;
}

function AudioSpectrumVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  const [hoverData, setHoverData] = useState<{x: number, y: number, freq: number, note: string} | null>(null);

  useEffect(() => {
    const initAudio = () => {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextCtor) return;

      const audioCtx = new AudioContextCtor();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, audioCtx.currentTime); 
      
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 1.5;
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 1500;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.connect(gain);
      gain.connect(analyser);
      
      const masterGain = audioCtx.createGain();
      masterGain.gain.value = 0; 
      analyser.connect(masterGain);
      masterGain.connect(audioCtx.destination);

      osc.start();
    };

    if (!audioCtxRef.current && isPlaying) {
        initAudio();
    }

    if (audioCtxRef.current) {
        if (isPlaying) {
            if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        } else {
            if (audioCtxRef.current.state === 'running') audioCtxRef.current.suspend();
        }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.clientHeight * window.devicePixelRatio;
      }

      const analyser = analyserRef.current;
      const bufferLength = analyser ? analyser.frequencyBinCount : 1024;
      const dataArray = new Uint8Array(bufferLength);

      if (analyser && isPlaying && audioCtxRef.current?.state === 'running') {
         analyser.getByteFrequencyData(dataArray);
      }

      ctx.fillStyle = 'rgba(9, 11, 14, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const displayBins = Math.floor(bufferLength / 2);
      const barWidth = canvas.width / displayBins;
      let x = 0;

      for (let i = 0; i < displayBins; i++) {
        const value = dataArray[i] || 0;
        const barHeight = (value / 255) * canvas.height;

        const hue = 220 - (i / displayBins) * 220; 
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
        
        ctx.fillRect(x, canvas.height - barHeight, Math.max(1, barWidth - 1), barHeight);

        x += barWidth;
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioCtxRef.current || !analyserRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const displayBins = Math.floor(bufferLength / 2);
    const barWidthClient = rect.width / displayBins;
    
    const binIndex = Math.floor(x / barWidthClient);
    
    if (binIndex >= displayBins || binIndex < 0) {
        setHoverData(null);
        return;
    }

    const sampleRate = audioCtxRef.current.sampleRate || 44100;
    const freq = binIndex * (sampleRate / analyserRef.current.fftSize);
    
    setHoverData({
        x,
        y,
        freq: Math.round(freq),
        note: getNoteFromFreq(freq)
    });
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

  return (
    <div className="flex-[1.2] bg-black/40 border border-black/80 rounded-lg p-3 flex flex-col shadow-inner relative overflow-hidden">
      <div className="flex justify-between items-center mb-3 bg-[#111] -mx-3 -mt-3 p-3 border-b border-white/10 shadow-lg">
         <span className="font-bold text-white text-[14px]">SPECTRUM API</span>
         <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-[#3fb950] shadow-[0_0_8px_#3fb950]' : 'bg-red-500 shadow-[0_0_8px_red]'}`}></div>
      </div>
      <div 
         className="flex-1 bg-[#090b0e] border border-white/10 rounded relative overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,1)] cursor-crosshair"
         onMouseMove={handleMouseMove}
         onMouseLeave={handleMouseLeave}
      >
        <div className="absolute bottom-1 w-full flex justify-between px-2 pointer-events-none z-10 opacity-50">
           <span className="text-[8px] text-[#8b949e] font-mono font-bold">20Hz</span>
           <span className="text-[8px] text-[#8b949e] font-mono font-bold">~11kHz</span>
           <span className="text-[8px] text-[#8b949e] font-mono font-bold"></span>
        </div>
        <canvas ref={canvasRef} className="w-full h-full absolute inset-0 mix-blend-screen pointer-events-none" />
        
        {hoverData && (
          <div 
            className="absolute pointer-events-none z-20 flex flex-col items-center"
            style={{ left: hoverData.x, top: Math.max(10, hoverData.y - 45), transform: 'translateX(-50%)' }}
          >
             <div className="bg-[#161b22]/90 border border-[#3fb950] text-[#3fb950] px-2 py-1 rounded shadow-lg backdrop-blur-sm whitespace-nowrap min-w-[60px]">
                <div className="text-[12px] font-bold text-center leading-none mb-1">{hoverData.note}</div>
                <div className="text-[9px] font-mono opacity-80 text-center">{hoverData.freq} Hz</div>
             </div>
             <div className="w-px h-[1000px] bg-[#3fb950]/50 absolute top-full left-1/2 -translate-x-1/2"></div>
          </div>
        )}
      </div>
    </div>
  );
}

function Knob({ label, value }: { label: string, value: string }) {
   return (
      <div className="flex flex-col items-center gap-1 group">
         <div className="w-8 h-8 rounded-full border-2 border-[#161b22] bg-[#21262d] shadow-[0_2px_5px_rgba(0,0,0,0.5)] relative cursor-pointer group-hover:bg-[#30363d] transition-colors">
            {/* Knob indicator line */}
            <div className="absolute top-1 left-1/2 w-0.5 h-2.5 bg-white -translate-x-1/2 origin-bottom rotate-45"></div>
         </div>
         <span className="text-white text-[8px] font-bold">{label}</span>
         <span className="bg-black/50 px-1.5 py-0.5 rounded text-[8px] font-mono text-[#58a6ff] border border-black">{value}</span>
      </div>
   );
}

function SliderKnob({ label, value, height }: { label: string, value: string, height: string }) {
   return (
      <div className="flex flex-col items-center h-full group">
         <div className="w-4 flex-1 bg-black/80 rounded-full border border-white/10 relative cursor-pointer overflow-hidden mb-2">
            <div className={`absolute bottom-0 w-full ${height} bg-gradient-to-t from-[#1f6feb]/50 to-[#58a6ff]`}></div>
            <div className={`absolute bottom-0 w-full ${height} bg-white h-1.5 shadow-[0_0_5px_white]`}></div>
         </div>
         <div className="text-center">
            <div className="text-white text-[8px] font-bold leading-tight">{label}</div>
            <div className="text-[#8b949e] text-[8px] font-mono leading-tight bg-black px-1 rounded mt-0.5">{value}</div>
         </div>
      </div>
   );
}
