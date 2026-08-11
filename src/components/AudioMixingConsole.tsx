import React, { useState } from 'react';
import { 
  Sliders, Mic2, Music, Volume2, VolumeX, Play, Pause, 
  SkipBack, SkipForward, Power, Waves, ListPlus, AudioWaveform,
  Settings2, Activity, Save, Disc
} from 'lucide-react';

interface AudioTrack {
  id: string;
  name: string;
  type: 'synth' | 'audio' | 'midi' | 'bus';
  color: string;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  plugins: string[];
  sends: { busId: string, level: number }[];
}

const DEFAULT_TRACKS: AudioTrack[] = [
  { id: 't1', name: 'KICK_PUNCH', type: 'audio', color: '#f85149', volume: -3, pan: 0, muted: false, solo: false, plugins: ['EQ8', 'Compressor'], sends: [{busId: 'bus1', level: -12}] },
  { id: 't2', name: 'SNARE_CRACK', type: 'audio', color: '#f85149', volume: -5, pan: 0, muted: false, solo: false, plugins: ['EQ8', 'Reverb_Room'], sends: [{busId: 'bus1', level: -6}] },
  { id: 't3', name: 'BASS_SYNTH_SUB', type: 'synth', color: '#58a6ff', volume: -2, pan: 0, muted: false, solo: false, plugins: ['OmniSynth', 'Saturn'], sends: [] },
  { id: 't4', name: 'LEAD_ARPEGGIATOR', type: 'midi', color: '#d2a8ff', volume: -8, pan: 25, muted: false, solo: false, plugins: ['OmniSampler', 'Delay_PingPong'], sends: [{busId: 'bus2', level: -3}] },
  { id: 't5', name: 'PAD_ATMOSPHERE', type: 'midi', color: '#d2a8ff', volume: -12, pan: -25, muted: false, solo: false, plugins: ['OmniPad', 'EQ8', 'Valhalla_Verb'], sends: [] },
  { id: 't6', name: 'AMBIENT_WIND', type: 'audio', color: '#3fb950', volume: -18, pan: 0, muted: false, solo: false, plugins: ['EQ8'], sends: [{busId: 'bus2', level: 0}] },
];

const DEFAULT_BUSES: AudioTrack[] = [
  { id: 'bus1', name: 'DRUM_BUS', type: 'bus', color: '#8b949e', volume: 0, pan: 0, muted: false, solo: false, plugins: ['Glue_Compressor', 'EQ8'], sends: [] },
  { id: 'bus2', name: 'VERB_DELAY_BUS', type: 'bus', color: '#8b949e', volume: -4, pan: 0, muted: false, solo: false, plugins: ['Pro-R', 'Pro-Q3'], sends: [] },
  { id: 'master', name: 'MASTER_OUT', type: 'bus', color: '#c9d1d9', volume: -1, pan: 0, muted: false, solo: false, plugins: ['Ozone_Maximizer', 'Multiband_Comp', 'Limiter'], sends: [] },
];

export default function AudioMixingConsole() {
  const [tracks, setTracks] = useState<AudioTrack[]>(DEFAULT_TRACKS);
  const [buses, setBuses] = useState<AudioTrack[]>(DEFAULT_BUSES);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'mixer'|'arrangement'|'synth'>('mixer');

  const toggleProp = (id: string, isBus: boolean, prop: 'muted'|'solo') => {
    const list = isBus ? buses : tracks;
    const setList = isBus ? setBuses : setTracks;
    
    setList(list.map(t => {
      if (t.id === id) {
        if (prop === 'solo' && !t.solo) {
          // If turning solo ON for this track, we don't automatically mute others in state,
          // usually DAW engine handles solo logic, but we toggle the UI state here.
          return { ...t, solo: true };
        }
        return { ...t, [prop]: !t[prop] };
      }
      return t;
    }));
  };

  const updateVolume = (id: string, isBus: boolean, val: number) => {
    const list = isBus ? buses : tracks;
    const setList = isBus ? setBuses : setTracks;
    setList(list.map(t => t.id === id ? { ...t, volume: val } : t));
  };

  const updatePan = (id: string, isBus: boolean, val: number) => {
    const list = isBus ? buses : tracks;
    const setList = isBus ? setBuses : setTracks;
    setList(list.map(t => t.id === id ? { ...t, pan: val } : t));
  };

  return (
    <div className="w-full h-screen bg-[#0d1117] flex flex-col font-sans text-[#c9d1d9] overflow-hidden">
      
      {/* Top Menu Bar */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#e3b341] font-bold">
            <Sliders size={20} />
            <span className="text-[14px]">Pro Audio & Mixing Console</span>
          </div>
          
          <div className="flex items-center gap-1 border-l border-[#30363d] pl-6">
            <button className={`px-4 py-1.5 rounded text-[11px] font-bold transition-colors ${activeTab === 'mixer' ? 'bg-[#2ea043] text-white' : 'hover:bg-[#30363d]'}`} onClick={() => setActiveTab('mixer')}>MIXER</button>
            <button className={`px-4 py-1.5 rounded text-[11px] font-bold transition-colors ${activeTab === 'arrangement' ? 'bg-[#2ea043] text-white' : 'hover:bg-[#30363d]'}`} onClick={() => setActiveTab('arrangement')}>ARRANGEMENT</button>
            <button className={`px-4 py-1.5 rounded text-[11px] font-bold transition-colors ${activeTab === 'synth' ? 'bg-[#2ea043] text-white' : 'hover:bg-[#30363d]'}`} onClick={() => setActiveTab('synth')}>SYNTHESIZERS</button>
          </div>
        </div>
        
        {/* Transport */}
        <div className="flex items-center gap-4 bg-[#0d1117] px-4 py-1.5 rounded-full border border-[#30363d]">
          <div className="flex items-center gap-2 mr-4 text-[#8b949e]">
            <span className="text-[10px] font-bold">BPM</span>
            <input type="number" defaultValue={120} className="w-12 bg-transparent text-white font-mono text-[14px] outline-none" />
            <span className="text-[10px] font-bold ml-2">SIG</span>
            <span className="text-white font-mono text-[14px]">4/4</span>
          </div>
          
          <button className="text-[#8b949e] hover:text-white transition-colors"><SkipBack size={18} fill="currentColor" /></button>
          <button 
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isPlaying ? 'bg-[#f85149] text-white shadow-[0_0_10px_rgba(248,81,73,0.5)]' : 'bg-[#2ea043] text-white'}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
          </button>
          <button className="text-[#8b949e] hover:text-white transition-colors"><SkipForward size={18} fill="currentColor" /></button>
          
          <div className="ml-4 font-mono text-[#58a6ff] text-[18px] font-bold tracking-wider">
            012:04:024
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-[#c9d1d9] hover:text-white hover:bg-[#30363d] rounded border border-[#30363d] transition-colors">
            <Disc size={14} /> Export Stems
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-white bg-[#1f6feb] hover:bg-[#388bfd] rounded transition-colors">
            <Save size={14} /> Save Project
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Active Channel Strip & EQ */}
        <div className="w-[320px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
          <div className="h-10 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between px-4">
            <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Channel Inspector</span>
            <span className="text-[10px] font-mono bg-[#1f6feb]/20 text-[#58a6ff] px-2 py-0.5 rounded">T3: BASS_SYNTH_SUB</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">
            {/* Parametric EQ Visualizer */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-white flex items-center gap-1"><Waves size={14} className="text-[#3fb950]"/> Pro-Q3 (Active)</span>
                <Power size={12} className="text-[#3fb950]" />
              </div>
              <div className="h-32 bg-[#0d1117] border border-[#30363d] rounded relative overflow-hidden group">
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMzAzNjNkIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wLDBMMjAsME0wLDBMMCwyMCIvPjwvZz48L3N2Zz4=')]" />
                {/* Mock EQ Curve */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <path d="M 0 100 Q 20 80, 50 100 T 150 100 T 250 50 T 320 120" fill="none" stroke="#58a6ff" strokeWidth="2" />
                  <path d="M 0 100 Q 20 80, 50 100 T 150 100 T 250 50 T 320 120 L 320 128 L 0 128 Z" fill="rgba(88,166,255,0.2)" />
                  <circle cx="50" cy="100" r="4" fill="#3fb950" className="cursor-pointer hover:r-5 transition-all" />
                  <circle cx="150" cy="100" r="4" fill="#e3b341" className="cursor-pointer hover:r-5 transition-all" />
                  <circle cx="250" cy="50" r="4" fill="#f85149" className="cursor-pointer hover:r-5 transition-all" />
                </svg>
              </div>
            </div>
            
            {/* Plugins Chain */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Insert Effects</span>
              <div className="flex flex-col gap-1">
                <div className="bg-[#0d1117] border border-[#30363d] p-2 rounded flex items-center justify-between group hover:border-[#58a6ff] cursor-pointer">
                  <span className="text-[12px] font-bold text-white">OmniSynth (VST3)</span>
                  <Power size={14} className="text-[#3fb950]" />
                </div>
                <div className="bg-[#0d1117] border border-[#30363d] p-2 rounded flex items-center justify-between group hover:border-[#58a6ff] cursor-pointer">
                  <span className="text-[12px] font-bold text-white">Saturn Saturation</span>
                  <Power size={14} className="text-[#3fb950]" />
                </div>
                <div className="bg-[#0d1117] border border-[#30363d] border-dashed p-2 rounded flex items-center justify-center cursor-pointer hover:bg-[#21262d] transition-colors text-[#8b949e]">
                  <ListPlus size={14} /> <span className="ml-2 text-[11px]">Add Plugin</span>
                </div>
              </div>
            </div>

            {/* Sends */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Sends / Aux</span>
              <div className="flex flex-col gap-1">
                <div className="bg-[#0d1117] border border-[#30363d] p-2 rounded flex items-center gap-3">
                  <div className="w-16 text-[10px] font-bold text-[#8b949e] truncate">VERB_BUS</div>
                  <input type="range" min="-60" max="6" defaultValue="-12" className="flex-1 accent-[#58a6ff] h-1" />
                  <div className="w-10 text-right text-[10px] font-mono">-12 dB</div>
                </div>
                <div className="bg-[#0d1117] border border-[#30363d] border-dashed p-2 rounded flex items-center justify-center cursor-pointer hover:bg-[#21262d] transition-colors text-[#8b949e]">
                  <ListPlus size={14} /> <span className="ml-2 text-[11px]">Add Send</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Mixer Console */}
        <div className="flex-1 bg-[#0d1117] flex flex-col overflow-hidden">
          {/* Waveform / Arrangement Mini-View */}
          <div className="h-32 bg-[#161b22] border-b border-[#30363d] flex shrink-0 p-2 gap-1 overflow-x-auto custom-scrollbar hide-scrollbar">
            {tracks.map(t => (
              <div key={`wave-${t.id}`} className="h-full bg-[#0d1117] border border-[#30363d] rounded flex-1 min-w-[80px] relative overflow-hidden flex flex-col justify-end group">
                <div className="absolute top-1 left-1 text-[9px] font-bold px-1 rounded truncate max-w-[80%]" style={{ color: t.color, backgroundColor: `${t.color}20` }}>{t.name}</div>
                {/* Mock Audio Waveform Pattern */}
                <div className="flex items-end justify-between h-1/2 px-1 pb-1 w-full opacity-50 group-hover:opacity-100 transition-opacity">
                  {Array.from({length: 15}).map((_, i) => (
                    <div key={i} className="w-[4%] rounded-t-sm" style={{ backgroundColor: t.color, height: `${Math.random() * 80 + 10}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mixing Faders */}
          <div className="flex-1 flex p-4 gap-2 overflow-x-auto custom-scrollbar">
            
            {/* Tracks */}
            <div className="flex gap-2">
              {tracks.map(track => (
                <MixerChannel key={track.id} track={track} isBus={false} onToggleProp={toggleProp} onUpdateVol={updateVolume} onUpdatePan={updatePan} />
              ))}
            </div>

            <div className="w-4 flex items-center justify-center">
              <div className="w-px h-full bg-[#30363d]" />
            </div>

            {/* Buses & Master */}
            <div className="flex gap-2 bg-[#161b22] p-2 rounded-xl border border-[#30363d] shadow-inner">
              {buses.map(bus => (
                <MixerChannel key={bus.id} track={bus} isBus={true} onToggleProp={toggleProp} onUpdateVol={updateVolume} onUpdatePan={updatePan} />
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponents

function MixerChannel({ track, isBus, onToggleProp, onUpdateVol, onUpdatePan }: any) {
  return (
    <div className={`w-28 flex flex-col bg-[#0d1117] border rounded-lg overflow-hidden ${track.id === 'master' ? 'border-[#e3b341]' : 'border-[#30363d]'}`}>
      {/* Header */}
      <div className="h-8 flex items-center justify-center border-b border-[#30363d]" style={{ backgroundColor: `${track.color}20` }}>
        <span className="text-[10px] font-bold truncate px-2" style={{ color: track.color }}>{track.name}</span>
      </div>
      
      {/* Inserts Preview */}
      <div className="h-24 p-1 flex flex-col gap-1 border-b border-[#30363d] bg-[#161b22]">
        {track.plugins.map((p: string, i: number) => (
          <div key={i} className="bg-[#0d1117] text-[#8b949e] text-[9px] px-1 py-0.5 rounded truncate border border-[#30363d]">
            {p}
          </div>
        ))}
        {track.plugins.length === 0 && <div className="text-[9px] text-[#8b949e] italic text-center mt-2">No Inserts</div>}
      </div>

      {/* Pan Control */}
      <div className="py-3 flex flex-col items-center border-b border-[#30363d]">
        <input 
          type="range" min="-50" max="50" value={track.pan} 
          onChange={(e) => onUpdatePan(track.id, isBus, parseInt(e.target.value))}
          className="w-16 accent-[#c9d1d9] h-1" 
        />
        <span className="text-[9px] font-mono text-[#8b949e] mt-1">
          {track.pan === 0 ? 'C' : track.pan < 0 ? `L${Math.abs(track.pan)}` : `R${track.pan}`}
        </span>
      </div>

      {/* Mute/Solo */}
      <div className="flex p-2 gap-1 border-b border-[#30363d] justify-center">
        <button 
          onClick={() => onToggleProp(track.id, isBus, 'muted')}
          className={`flex-1 py-1 rounded text-[11px] font-bold transition-colors ${track.muted ? 'bg-[#f85149] text-white shadow-inner' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'}`}
        >M</button>
        <button 
          onClick={() => onToggleProp(track.id, isBus, 'solo')}
          className={`flex-1 py-1 rounded text-[11px] font-bold transition-colors ${track.solo ? 'bg-[#e3b341] text-black shadow-inner' : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'}`}
        >S</button>
      </div>

      {/* Fader Area */}
      <div className="flex-1 flex p-2 gap-2 relative min-h-[200px]">
        {/* VU Meter Mock */}
        <div className="w-2 bg-black rounded-full overflow-hidden flex flex-col justify-end border border-[#30363d]">
          <div 
            className="w-full transition-all duration-75" 
            style={{ 
              height: track.muted ? '0%' : `${Math.max(0, 100 + track.volume + (Math.random()*10 - 5))}%`,
              background: 'linear-gradient(to top, #3fb950 60%, #e3b341 85%, #f85149 100%)'
            }} 
          />
        </div>
        {/* Fader */}
        <div className="flex-1 flex justify-center relative">
          <input 
            type="range" min="-60" max="6" step="0.1"
            value={track.volume}
            onChange={(e) => onUpdateVol(track.id, isBus, parseFloat(e.target.value))}
            className="fader-vertical absolute inset-0 w-full h-full"
            style={{ writingMode: 'vertical-lr', direction: 'rtl', WebkitAppearance: 'slider-vertical' } as any}
          />
        </div>
      </div>
      
      {/* Volume Readout */}
      <div className="h-8 flex items-center justify-center bg-[#161b22] border-t border-[#30363d]">
        <span className={`text-[11px] font-mono font-bold ${track.volume > 0 ? 'text-[#f85149]' : 'text-[#58a6ff]'}`}>
          {track.volume > 0 ? '+' : ''}{track.volume.toFixed(1)} dB
        </span>
      </div>
    </div>
  );
}
