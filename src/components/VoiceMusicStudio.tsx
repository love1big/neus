import React, { useState } from 'react';
import { Mic2, Play, Square, Settings, Volume2, Mic, Languages, FastForward, Sliders, Waves, PlayCircle, Layers, Fingerprint, AudioLines, Music } from 'lucide-react';

export default function VoiceMusicStudio() {
  const [activeTab, setActiveTab] = useState<'dubbing' | 'music'>('dubbing');
  
  return (
    <div className="w-full h-full bg-[#0a0a0c] text-white flex flex-col font-sans">
      {/* Top Protocol Bar */}
      <div className="px-6 py-4 border-b border-white/10 bg-[#111] flex items-center justify-between shrink-0 shadow-lg z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#bc8cff] to-[#58a6ff] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(188,140,255,0.3)]">
            {activeTab === 'dubbing' ? <Mic2 size={24} className="text-white" /> : <Music size={24} className="text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight uppercase">AI Audio Master Control</h2>
            <p className="text-[#888] text-xs font-mono">100% Comprehensive Synthesizer & Soundtrack Generation</p>
          </div>
        </div>
        <div className="flex bg-black/40 border border-white/10 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab('dubbing')}
             className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'dubbing' ? 'bg-[#bc8cff]/20 text-[#bc8cff] shadow-inner border border-[#bc8cff]/30' : 'text-[#666] hover:text-white'}`}
           >
             <Mic2 size={14}/> Voice Dubbing & Lip-Sync
           </button>
           <button 
             onClick={() => setActiveTab('music')}
             className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'music' ? 'bg-[#58a6ff]/20 text-[#58a6ff] shadow-inner border border-[#58a6ff]/30' : 'text-[#666] hover:text-white'}`}
           >
             <Music size={14}/> Dynamic OST Composer
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {activeTab === 'dubbing' ? <DubbingStudio /> : <MusicStudio />}
      </div>
    </div>
  );
}

function DubbingStudio() {
  const scripts = [
    { id: 1, char: 'Commander Shepard', text: "Hold the line! If they break through here, the entire colony falls.", lang: 'EN', emotion: 'Shouting / Urgent' },
    { id: 2, char: 'Elora (Elf)', text: "The ancient trees whisper of a dark shadow approaching from the East.", lang: 'EN', emotion: 'Mysterious / Soft' },
    { id: 3, char: 'Cyber Merc', text: "System breach confirmed. I've got root access. Let's delta.", lang: 'EN', emotion: 'Confident / Smug' },
  ];

  return (
    <div className="flex-1 flex w-full">
      {/* Character / Voice Config */}
      <div className="w-[350px] border-r border-white/10 bg-[#121214] flex flex-col">
         <div className="p-4 border-b border-white/5">
            <h3 className="text-xs font-black text-[#888] tracking-widest uppercase mb-4 flex items-center gap-2"><Fingerprint size={14} className="text-[#bc8cff]" /> Neural Voice Models</h3>
            <div className="space-y-3">
               {['Model #X-94A "Gruff Veteran"', 'Model #E-22 "Ethereal Female"', 'Model #R-01 "Robotic AI"'].map((m, i) => (
                 <div key={i} className={`p-3 rounded-lg border ${i === 0 ? 'bg-[#bc8cff]/10 border-[#bc8cff]/50' : 'bg-black/40 border-white/5'} cursor-pointer transition-colors`}>
                    <div className="flex justify-between items-center mb-1">
                       <span className="font-bold text-sm text-white/90">{m}</span>
                       <span className="text-[10px] bg-white/10 px-1.5 rounded text-[#aaa]">48kHz</span>
                    </div>
                    <div className="text-xs text-[#666]">Timbre: Deep, Resonant, Textured</div>
                 </div>
               ))}
            </div>
         </div>
         <div className="p-4 flex-1">
            <h3 className="text-xs font-black text-[#888] tracking-widest uppercase mb-4 flex items-center gap-2"><Sliders size={14}/> Prosody Tuning</h3>
            <div className="space-y-4">
              <div>
                 <div className="flex justify-between text-xs text-[#aaa] mb-1"><span>Pacing / Speech Rate</span> <span className="text-[#bc8cff]">1.05x</span></div>
                 <input type="range" className="w-full accent-[#bc8cff]" defaultValue={50} />
              </div>
              <div>
                 <div className="flex justify-between text-xs text-[#aaa] mb-1"><span>Emotion Intensity</span> <span className="text-[#bc8cff]">High</span></div>
                 <input type="range" className="w-full accent-[#bc8cff]" defaultValue={80} />
              </div>
              <div>
                 <div className="flex justify-between text-xs text-[#aaa] mb-1"><span>Age Modulation</span> <span className="text-[#bc8cff]">45 Yrs</span></div>
                 <input type="range" className="w-full accent-[#bc8cff]" defaultValue={45} />
              </div>
            </div>
            
            <div className="mt-8">
               <h3 className="text-xs font-black text-[#888] tracking-widest uppercase mb-4 flex items-center gap-2"><Languages size={14}/> Mass Localization</h3>
               <button className="w-full bg-white/5 border border-white/10 text-[#aaa] py-2 rounded text-xs hover:bg-white/10 transition">
                  Auto-Translate & Dub 24 Languages
               </button>
            </div>
         </div>
      </div>

      {/* Script Editor & Lip Sync */}
      <div className="flex-1 bg-[#0a0a0c] flex flex-col">
         {/* Script List */}
         <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-sm font-bold text-white mb-4">Dialogue Script Pipeline</h3>
            <div className="space-y-4">
               {scripts.map(s => (
                 <div key={s.id} className="bg-[#16161a] border border-white/5 rounded-xl p-4 hover:border-white/20 transition-all cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-[#bc8cff] text-sm">{s.char}</span>
                       <div className="flex gap-2">
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase tracking-wider">{s.lang}</span>
                          <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded uppercase tracking-wider">{s.emotion}</span>
                       </div>
                    </div>
                    <p className="text-[#ccc] text-sm font-medium mb-3">"{s.text}"</p>
                    <div className="flex items-center justify-between mt-4">
                       <button className="flex items-center gap-2 text-xs font-bold text-[#888] hover:text-white transition-colors">
                          <PlayCircle size={16} className="text-green-500"/> Synthesize Audio & Phonemes
                       </button>
                       <div className="h-6 w-48 bg-black border border-white/5 rounded overflow-hidden relative">
                         {/* Fake Waveform */}
                         <div className="absolute inset-0 flex items-center gap-[1px] px-1 opacity-30">
                            {Array.from({length: 40}).map((_, i) => (
                              <div key={i} className="w-1 bg-[#bc8cff]" style={{ height: `${Math.max(10, Math.random() * 100)}%` }}></div>
                            ))}
                         </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         
         {/* Bottom Lip Sync Output */}
         <div className="h-[250px] border-t border-white/10 bg-[#0d0d11] p-4 flex flex-col">
            <h3 className="text-xs font-black text-[#555] uppercase tracking-widest mb-4">Real-time Viseme & Blendshape Extraction</h3>
            <div className="flex-1 flex gap-4">
               <div className="w-[200px] bg-black border border-white/5 rounded-lg flex items-center justify-center shrink-0">
                  <Smile className="text-[#333]" size={64}/>
                  {/* Fake 3D Face preview area */}
               </div>
               <div className="flex-1 bg-black border border-white/5 rounded-lg relative overflow-hidden flex flex-col justify-end p-2 pb-[40px]">
                  {/* Timeline */}
                  <div className="absolute top-0 left-0 w-full flex border-b border-white/10 text-[10px] text-[#555] font-mono px-2 py-1">
                     <span>0:00</span>
                     <span className="ml-[20%]">0:25</span>
                     <span className="ml-[20%]">0:50</span>
                     <span className="ml-[20%]">0:75</span>
                  </div>
                  
                  {/* Phonemes track */}
                  <div className="h-8 w-full border-b border-white/5 relative flex items-center">
                     <span className="absolute left-0 text-[9px] text-[#444] uppercase -translate-y-full top-0 font-bold">Phonemes</span>
                     <div className="absolute left-[10%] bg-purple-500/20 text-purple-400 text-[10px] px-1 rounded border border-purple-500/50">/H/</div>
                     <div className="absolute left-[15%] bg-purple-500/20 text-purple-400 text-[10px] px-1 rounded border border-purple-500/50">/O/</div>
                     <div className="absolute left-[20%] bg-purple-500/20 text-purple-400 text-[10px] px-1 rounded border border-purple-500/50">/L/</div>
                     <div className="absolute left-[25%] bg-purple-500/20 text-purple-400 text-[10px] px-1 rounded border border-purple-500/50">/D/</div>
                  </div>
                  {/* Active Scrubber */}
                  <div className="absolute left-[0%] top-0 bottom-0 w-[1px] bg-red-500 shadow-[0_0_10px_red] pointer-events-none"></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function MusicStudio() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505]">
       {/* Music Config Bar */}
       <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 shrink-0 bg-[#0c0c0f]">
          <div className="flex gap-6 items-center">
             <div className="flex gap-2">
                <button className="w-8 h-8 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                   <Play size={14} fill="currentColor"/>
                </button>
                <button className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center">
                   <Square size={12} fill="currentColor"/>
                </button>
             </div>
             <div className="font-mono text-xl tracking-wider text-[#58a6ff]">02:14.050</div>
             <div className="h-4 w-[1px] bg-white/20"></div>
             
             {/* Key, BPM */}
             <div className="flex gap-4 font-mono text-xs text-[#888]">
                <div className="flex items-center gap-2"><span className="text-[#555]">BPM</span> <span className="text-white">120</span></div>
                <div className="flex items-center gap-2"><span className="text-[#555]">KEY</span> <span className="text-white">D minor</span></div>
                <div className="flex items-center gap-2"><span className="text-[#555]">TIME</span> <span className="text-white">4/4</span></div>
             </div>
          </div>
          
          <button className="bg-gradient-to-r from-[#58a6ff] to-blue-600 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 shadow-[0_0_15px_rgba(88,166,255,0.4)]">
             <Layers size={14}/> Generate Orchestral Section
          </button>
       </div>

       {/* Horizontal Timeline Layout with Detailed VST and Piano Roll */}
       <div className="flex-1 flex overflow-hidden">
          
          {/* Detailed Inspector / VST Rack (Leftmost) */}
          <div className="w-[300px] border-r border-white/10 bg-[#0d0d10] flex flex-col pt-2 overflow-y-auto custom-scrollbar shrink-0">
             <div className="px-4 pb-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-[#888] tracking-widest flex items-center gap-1"><Sliders size={12}/> VST Channel Strip</span>
                <span className="text-[9px] font-mono bg-[#58a6ff]/20 text-[#58a6ff] px-1 rounded">CH: 1 (Strings)</span>
             </div>
             
             {/* EQ Graphic */}
             <div className="p-4 border-b border-white/5">
                <div className="text-[10px] text-[#ccc] font-bold mb-2">Parametric EQ - Pro-Q 3</div>
                <div className="h-24 bg-black border border-[#333] rounded p-1 relative overflow-hidden group cursor-crosshair">
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }}></div>
                   <svg className="w-full h-full absolute inset-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M 0,80 Q 20,80 30,50 T 60,30 T 90,80 L 100,80 L 100,100 L 0,100 Z" fill="rgba(188,140,255,0.2)" stroke="#bc8cff" strokeWidth="2"/>
                   </svg>
                   <div className="absolute top-[48%] left-[28%] w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white]"></div>
                   <div className="absolute top-[28%] left-[58%] w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white]"></div>
                </div>
             </div>

             {/* Compressor Controls */}
             <div className="p-4 border-b border-white/5 space-y-3">
                <div className="flex justify-between items-center text-[10px] text-[#ccc] font-bold">
                   <span>Multi-band Compressor</span>
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div>
                </div>
                <div>
                   <div className="flex justify-between text-[9px] text-[#888] mb-1"><span>Threshold</span> <span className="text-white">-18.4 dB</span></div>
                   <input type="range" className="w-full accent-green-500 h-1 bg-[#222]" defaultValue={30} />
                </div>
                <div>
                   <div className="flex justify-between text-[9px] text-[#888] mb-1"><span>Ratio</span> <span className="text-white">4:1</span></div>
                   <input type="range" className="w-full accent-green-500 h-1 bg-[#222]" defaultValue={40} />
                </div>
                <div className="flex gap-2">
                   <div className="flex-1 bg-black border border-[#333] p-1 flex flex-col items-center rounded">
                      <span className="text-[8px] text-[#666]">ATK</span>
                      <span className="text-[9px] text-white">12ms</span>
                   </div>
                   <div className="flex-1 bg-black border border-[#333] p-1 flex flex-col items-center rounded">
                      <span className="text-[8px] text-[#666]">REL</span>
                      <span className="text-[9px] text-white">150ms</span>
                   </div>
                </div>
             </div>

             {/* Reverb Integration */}
             <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-[10px] text-[#ccc] font-bold">
                   <span>Convolution Reverb</span>
                   <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]"></div>
                </div>
                <select className="w-full bg-black border border-[#333] text-[9px] text-white p-1 rounded outline-none">
                   <option>Impulse Space: Concert Hall 01</option>
                   <option>Impulse Space: Catacomb Long</option>
                   <option>Impulse Space: Studio Room A</option>
                </select>
                <div className="flex gap-4 items-end mt-2">
                   <div className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-[#333] rotate-45 relative">
                        <div className="absolute top-1/2 left-1/2 w-1 h-3 bg-blue-500 -translate-x-1/2 origin-bottom -translate-y-full rounded"></div>
                      </div>
                      <span className="text-[9px] text-[#888]">MIX</span>
                   </div>
                   <div className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full border-2 border-[#555] border-t-[#333] rotate-[-45deg] relative">
                         <div className="absolute top-1/2 left-1/2 w-1 h-3 bg-[#555] -translate-x-1/2 origin-bottom -translate-y-full rounded"></div>
                      </div>
                      <span className="text-[9px] text-[#888]">DECAY</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Tracks List */}
          <div className="w-[200px] border-r border-white/10 bg-[#111] overflow-y-auto shrink-0 flex flex-col">
             {[
               { name: '1  Epic Strings', color: 'bg-purple-500', icon: <AudioLines size={14}/> },
               { name: '2  Brass Section', color: 'bg-orange-500', icon: <AudioLines size={14}/> },
               { name: '3  Percussion Sub', color: 'bg-blue-500', icon: <Waves size={14}/> },
               { name: '4  Choir (Vocal)', color: 'bg-pink-500', icon: <Mic size={14}/> },
               { name: '5  Synth Arp', color: 'bg-emerald-500', icon: <Activity size={14}/> },
               { name: '6  Impact Hits', color: 'bg-red-500', icon: <Waves size={14}/> },
             ].map((track, i) => (
                <div key={i} className={`h-24 border-b border-white/5 flex flex-col justify-center p-3 relative group ${i===0?'bg-[#222] shadow-inner': 'hover:bg-white/5'}`}>
                   <div className={`absolute left-0 top-0 bottom-0 w-1 ${track.color}`}></div>
                   <div className="flex items-center gap-2 text-[11px] font-bold text-white mb-2 pl-2">
                     <span className="opacity-50 text-[10px]">{track.icon}</span> <span className="truncate">{track.name}</span>
                   </div>
                   <div className="flex items-center gap-2 pl-2 mt-1">
                      <button className="w-5 h-5 rounded bg-black/50 border border-white/10 text-[9px] font-bold text-[#888] hover:bg-white/20 hover:text-white transition">M</button>
                      <button className="w-5 h-5 rounded bg-black/50 border border-white/10 text-[9px] font-bold text-[#888] hover:bg-orange-500/30 hover:text-orange-400 transition">S</button>
                      <button className="w-5 h-5 rounded bg-black/50 border border-white/10 text-[9px] font-bold text-red-500 hover:bg-red-500/30 transition">R</button>
                   </div>
                   {/* Mini VU Meter */}
                   <div className="pl-2 mt-2 flex gap-[1px]">
                     <div className="h-1 flex-1 bg-green-500"></div>
                     <div className="h-1 flex-1 bg-green-500"></div>
                     <div className="h-1 flex-1 bg-green-400"></div>
                     <div className="h-1 flex-1 bg-yellow-400"></div>
                     <div className="h-1 flex-1 bg-[#222]"></div>
                     <div className="h-1 w-2 bg-[#222]"></div>
                   </div>
                </div>
             ))}
          </div>
          
          {/* Timeline Grid & Piano Roll Panel */}
          <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
             
             {/* Arranger Track timeline view */}
             <div className="h-[288px] relative border-b border-white/10 bg-[#0a0a0c] overflow-hidden">
                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)]" style={{ backgroundSize: '100px 100%' }}></div>
                
                {/* Playhead */}
                <div className="absolute top-0 bottom-0 left-[200px] w-[1px] bg-white shadow-[0_0_10px_white] z-20">
                   <div className="absolute -top-0 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border border-[#333]"></div>
                </div>

                {/* Blocks Layer */}
                <div className="absolute inset-0 pt-0 flex flex-col">
                  {/* Strings Track */}
                  <div className="h-24 border-b border-white/5 relative flex items-center bg-purple-500/5">
                     <div className="absolute left-[50px] w-[300px] h-16 bg-purple-500/20 border border-purple-500/50 rounded flex items-center px-2 group cursor-pointer hover:bg-purple-500/40 transition">
                        <span className="text-[10px] text-purple-100 truncate drop-shadow-md">Ostinato Strings Multi</span>
                        {/* Note dashes simulation */}
                        <div className="absolute inset-2 left-32 right-2 opacity-50 flex flex-col justify-end gap-1 pb-1">
                            <div className="flex gap-1">{Array.from({length: 12}).map((_, i) => <div key={i} className="h-1 w-3 bg-purple-300"></div>)}</div>
                            <div className="flex gap-1 ml-4">{Array.from({length: 8}).map((_, i) => <div key={i} className="h-1 w-3 bg-purple-300"></div>)}</div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Brass Track */}
                  <div className="h-24 border-b border-white/5 relative flex items-center">
                     <div className="absolute left-[360px] w-[150px] h-16 bg-orange-500/20 border border-orange-500/50 rounded flex items-center px-2">
                        <span className="text-[10px] text-orange-200 truncate">Horns Fortissimo Swell</span>
                     </div>
                  </div>
                  
                  {/* Percussion Track */}
                  <div className="h-24 border-b border-white/5 relative flex items-center">
                     <div className="absolute left-[50px] w-[800px] h-16 bg-blue-500/20 border border-blue-500/50 rounded flex items-center px-2">
                        <span className="text-[10px] text-blue-200 truncate">Cinematic Taiko Loop 120BPM</span>
                        <div className="absolute inset-2 left-48 right-2 opacity-60 flex items-end justify-between pb-1">
                            {Array.from({length: 32}).map((_, i) => <div key={i} className={`w-[2px] ${i%4===0? 'h-full bg-white':'h-[40%] bg-blue-300'} `}></div>)}
                        </div>
                     </div>
                  </div>
                </div>
             </div>

             {/* Piano Roll Editor (Bottom Split) */}
             <div className="flex-1 flex flex-col bg-[#111]">
                <div className="h-8 border-b border-[#222] bg-[#1a1a1a] flex items-center px-4 justify-between">
                   <div className="flex items-center gap-2">
                     <Music size={12} className="text-purple-400"/>
                     <span className="text-[10px] font-bold text-white uppercase tracking-widest">Piano Roll Editor: Ostinato Strings Multi</span>
                   </div>
                   <div className="flex gap-1">
                     <button className="px-2 py-0.5 bg-black border border-[#333] rounded text-[9px] text-[#888] hover:text-white">Grid: 1/16</button>
                     <button className="px-2 py-0.5 bg-black border border-[#333] rounded text-[9px] text-[#888] hover:text-white">Velocity Match</button>
                   </div>
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                   {/* Piano Keys */}
                   <div className="w-16 border-r border-[#222] flex flex-col">
                      {['C4', 'B3', 'A#3', 'A3', 'G#3', 'G3', 'F#3', 'F3', 'E3', 'D#3', 'D3', 'C#3', 'C3'].map((note, i) => (
                         <div key={i} className={`flex-1 border-b border-[#222] flex items-center justify-end px-1 text-[8px] font-mono select-none ${note.includes('#') ? 'bg-black text-[#555]' : 'bg-white text-black'}`}>
                            {note}
                         </div>
                      ))}
                   </div>
                   
                   {/* Note Grid */}
                   <div className="flex-1 bg-[#1a1c23] relative cursor-crosshair overflow-hidden">
                       <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2e38_1px,transparent_1px),linear-gradient(to_bottom,#2a2e38_1px,transparent_1px)]" style={{ backgroundSize: '40px 8.33%' }}></div>
                       
                       {/* MIDI Notes */}
                       <div className="absolute top-[33%] left-[40px] w-20 h-[8%] bg-purple-500 border border-purple-300 rounded shadow-sm opacity-90 hover:brightness-125"></div>
                       <div className="absolute top-[41%] left-[120px] w-20 h-[8%] bg-purple-500 border border-purple-300 rounded shadow-sm opacity-90 hover:brightness-125"></div>
                       <div className="absolute top-[50%] left-[200px] w-40 h-[8%] bg-purple-500 border border-purple-300 rounded shadow-sm opacity-90 hover:brightness-125"></div>
                       <div className="absolute top-[25%] left-[360px] w-10 h-[8%] bg-purple-500 border border-purple-300 rounded shadow-sm opacity-90 hover:brightness-125"></div>
                       
                       <div className="absolute inset-x-0 bottom-0 h-16 border-t border-[#333] bg-[#0a0a0c] flex items-end">
                           <span className="absolute left-2 top-1 text-[8px] text-[#555] font-bold">VELOCITY</span>
                           <div className="absolute left-[50px] bottom-0 w-2 h-[80%] bg-purple-400"></div>
                           <div className="absolute left-[130px] bottom-0 w-2 h-[60%] bg-purple-400"></div>
                           <div className="absolute left-[210px] bottom-0 w-2 h-[90%] bg-purple-400"></div>
                           <div className="absolute left-[370px] bottom-0 w-2 h-[100%] bg-purple-400"></div>
                       </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
