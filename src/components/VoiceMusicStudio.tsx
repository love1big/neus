import React, { useState, useEffect, useRef } from 'react';
import { Mic2, Play, Square, Settings2, Activity, Volume2, Save } from 'lucide-react';

export default function VoiceMusicStudio() {
  const [text, setText] = useState('Welcome to the Omni Engine Voice Studio. This is a functional Text-to-Speech dubbing system.');
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [synthFrequency, setSynthFrequency] = useState(440);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) setSelectedVoice(availableVoices[0].name);
    };
    
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const handleSpeak = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleSynth = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current.disconnect();
      oscRef.current = null;
    } else {
      const osc = audioCtxRef.current.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(synthFrequency, audioCtxRef.current.currentTime);
      osc.connect(audioCtxRef.current.destination);
      osc.start();
      oscRef.current = osc;
    }
  };

  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(synthFrequency, audioCtxRef.current.currentTime);
    }
  }, [synthFrequency]);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-6 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#e6edf3] mb-1 flex items-center gap-2">
          <Mic2 className="text-[#58a6ff]"/> Functional Voice & Music Studio
        </h1>
        <p className="text-[#8b949e] text-sm">Real Web Speech API for dubbing, Web Audio API for synthesis.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
          <h2 className="text-[#e6edf3] font-bold mb-4 border-b border-[#30363d] pb-2">Character Dubbing (TTS)</h2>
          <textarea 
            className="w-full h-24 bg-[#0d1117] border border-[#30363d] p-2 text-sm text-[#e6edf3] rounded outline-none mb-4 resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="space-y-4">
            <div>
               <label className="text-xs text-[#8b949e] block mb-1">Voice Selection</label>
               <select 
                 className="w-full bg-[#0d1117] border border-[#30363d] p-2 text-sm text-[#e6edf3] rounded outline-none"
                 value={selectedVoice}
                 onChange={(e) => setSelectedVoice(e.target.value)}
               >
                 {voices.map((v, i) => <option key={`${v.name}-${i}`} value={v.name}>{v.name} ({v.lang})</option>)}
               </select>
            </div>
            <div className="flex gap-4">
               <div className="flex-1">
                 <label className="text-xs text-[#8b949e] block mb-1">Pitch: {pitch.toFixed(1)}</label>
                 <input type="range" min="0.1" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full accent-[#58a6ff]"/>
               </div>
               <div className="flex-1">
                 <label className="text-xs text-[#8b949e] block mb-1">Rate: {rate.toFixed(1)}</label>
                 <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full accent-[#58a6ff]"/>
               </div>
            </div>
            <button 
              onClick={handleSpeak}
              className="w-full py-2 bg-[#238636] hover:bg-[#2ea043] font-bold text-white rounded flex items-center justify-center gap-2 transition"
            >
              {isPlaying ? <Activity className="animate-pulse" size={16}/> : <Play size={16}/>} Generate Voice
            </button>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
          <h2 className="text-[#e6edf3] font-bold mb-4 border-b border-[#30363d] pb-2">Music Synthesizer (Web Audio)</h2>
          <div className="flex flex-col items-center justify-center h-48 bg-[#0d1117] border border-[#30363d] rounded mb-4 relative overflow-hidden">
             
             {oscRef.current ? (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-1">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="w-1.5 bg-[#bc8cff] animate-[pulse_0.2s_ease-in-out_infinite]" style={{ height: `${Math.random() * 60 + 20}%`, animationDelay: `${i * 0.05}s`}}></div>
                    ))}
                  </div>
               </div>
             ) : (
               <Activity size={48} className="text-[#30363d]" />
             )}
          </div>
          <div className="space-y-4">
            <div>
               <label className="text-xs text-[#8b949e] block mb-1">Frequency: {synthFrequency} Hz</label>
               <input type="range" min="100" max="2000" step="10" value={synthFrequency} onChange={(e) => setSynthFrequency(parseFloat(e.target.value))} className="w-full accent-[#bc8cff]"/>
            </div>
            <button 
              onClick={toggleSynth}
              className="w-full py-2 bg-[#bc8cff]/20 text-[#bc8cff] hover:bg-[#bc8cff]/40 font-bold rounded flex items-center justify-center gap-2 border border-[#bc8cff]/50 transition"
            >
              {oscRef.current ? <Square size={16}/> : <Play size={16}/>} {oscRef.current ? 'Stop Sine Wave' : 'Start Sine Wave'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}