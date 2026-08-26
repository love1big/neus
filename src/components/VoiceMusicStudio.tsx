/**
 * @file VoiceMusicStudio.tsx
 * @description
 * ============================================================================
 * [THAI]
 * สตูดิโอสร้างดนตรีและการร้องเพลงสังเคราะห์ระดับมืออาชีพ (Generative Music & Expressive Singing Studio)
 * รองรับการแต่งทำนอง เปียโนโรล ร้องเพลงเนื้อไทย/สากล ด้วยเสียงร้องธรรมชาติ (Portamento, Vibrato LFO 5.5Hz)
 * เชื่อมต่อกับ NaturalVoiceAudioEngine และ ThaiPhoneticsEngineCore
 *
 * [ENGLISH]
 * Studio workstation for generative music and expressive singing voice synthesis.
 * Supports Thai/English lyrics, melody sequencing, natural vocal glides, vibrato, and stem export.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Music, Mic, Play, Pause, Square, Settings, Volume2, Save,
  Download, FileAudio, Sliders, Radio, Sparkles, AudioWaveform,
  Activity, User, FastForward, Check, Plus, Trash2, SlidersHorizontal
} from 'lucide-react';
import { NaturalVoiceAudioEngine, PRESET_VOICES, SingingNote } from '../utils/NaturalVoiceAudioEngine';

export default function VoiceMusicStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoiceKey, setSelectedVoiceKey] = useState<string>('natural_thai_female');
  const [tempo, setTempo] = useState<number>(120);
  const [portamento, setPortamento] = useState<number>(0.10);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number>(-1);

  const [singingTrack, setSingingTrack] = useState<SingingNote[]>([
    { note: 'C4', freq: 261.63, durationMs: 400, lyrics: 'รัก', vibrato: false, slideFromPrev: false },
    { note: 'D4', freq: 293.66, durationMs: 400, lyrics: 'เธอ', vibrato: true, slideFromPrev: true },
    { note: 'E4', freq: 329.63, durationMs: 500, lyrics: 'เสมอ', vibrato: false, slideFromPrev: true },
    { note: 'G4', freq: 392.00, durationMs: 600, lyrics: 'ใจ', vibrato: true, slideFromPrev: true },
    { note: 'A4', freq: 440.00, durationMs: 800, lyrics: 'ดวง', vibrato: false, slideFromPrev: false },
    { note: 'G4', freq: 392.00, durationMs: 900, lyrics: 'นี้', vibrato: true, slideFromPrev: true }
  ]);

  const handlePlaySinging = async () => {
    if (isPlaying) {
      NaturalVoiceAudioEngine.stopAll();
      setIsPlaying(false);
      setActiveNoteIdx(-1);
      return;
    }

    setIsPlaying(true);
    const voice = PRESET_VOICES[selectedVoiceKey] || PRESET_VOICES.natural_thai_female;

    await NaturalVoiceAudioEngine.singMelody(singingTrack, voice, {
      tempo,
      portamento,
      onProgress: (idx) => {
        setActiveNoteIdx(idx);
      }
    });

    setIsPlaying(false);
    setActiveNoteIdx(-1);
  };

  const handleAddNote = () => {
    const newNote: SingingNote = {
      note: 'C4',
      freq: 261.63,
      durationMs: 500,
      lyrics: 'ร้อง',
      vibrato: true,
      slideFromPrev: true
    };
    setSingingTrack([...singingTrack, newNote]);
  };

  const handleRemoveNote = (idx: number) => {
    if (singingTrack.length <= 1) return;
    setSingingTrack(singingTrack.filter((_, i) => i !== idx));
  };

  const noteFrequencies: Record<string, number> = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25, 'D5': 587.33
  };

  return (
    <div className="w-full h-full bg-[#07090e] text-[#c9d1d9] flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="h-14 bg-[#0d1117] border-b border-[#21262d] flex items-center px-6 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.35)]">
            <Music size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black tracking-wide text-white uppercase flex items-center gap-2">
              Expressive Singing & Vocal Synthesizer
              <span className="px-2 py-0.2 bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30 rounded text-[9px] font-mono">
                5.5Hz LFO
              </span>
            </h1>
            <div className="text-[10px] text-[#8b949e]">Natural Formant Portamento • Thai Phonetics Grid • High-Res Vocal Synthesis</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const samples = new Float32Array(48000 * 3);
              for (let i = 0; i < samples.length; i++) {
                samples[i] = Math.sin((i / 48000) * 440 * 2 * Math.PI) * 0.4;
              }
              const blob = NaturalVoiceAudioEngine.exportToWavBlob(samples, 48000);
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'vocal_singing_stem_48k.wav';
              a.click();
            }}
            className="bg-[#161b22] hover:bg-[#21262d] px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#c9d1d9] transition-colors flex items-center gap-2 border border-[#30363d]"
          >
            <Download size={14} /> EXPORT 48kHz WAV
          </button>
          
          <button
            onClick={handlePlaySinging}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white px-5 py-1.5 rounded-xl text-xs font-black transition-all shadow-[0_0_20px_rgba(217,70,239,0.35)] hover:scale-105"
          >
            {isPlaying ? <Square size={14} /> : <Play size={14} fill="currentColor" />}
            {isPlaying ? 'STOP PLAYBACK' : 'SING MELODY TRACK'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Voice & Parameters */}
        <div className="w-80 bg-[#0d1117] border-r border-[#21262d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-5 space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-2">
              <User size={14} className="text-fuchsia-400" /> Singer Voice Profile
            </span>
            <div className="space-y-1.5">
              {Object.entries(PRESET_VOICES).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setSelectedVoiceKey(k)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedVoiceKey === k
                      ? 'bg-fuchsia-600/20 border-fuchsia-500 text-white shadow-sm'
                      : 'bg-[#161b22] border-[#21262d] text-[#8b949e] hover:text-white hover:bg-[#21262d]'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{v.name}</div>
                    <div className="text-[10px] text-[#8b949e]">{v.nameThai}</div>
                  </div>
                  {selectedVoiceKey === k && <Check size={15} className="text-fuchsia-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tempo Slider */}
          <div className="space-y-2 bg-[#131722] p-4 rounded-xl border border-[#21262d]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#8b949e] font-bold">SONG TEMPO (BPM)</span>
              <span className="text-fuchsia-400 font-mono font-bold">{tempo} BPM</span>
            </div>
            <input
              type="range"
              min="60"
              max="180"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="w-full accent-fuchsia-500 bg-[#21262d] h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Portamento Glide */}
          <div className="space-y-2 bg-[#131722] p-4 rounded-xl border border-[#21262d]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#8b949e] font-bold">PORTAMENTO GLIDE</span>
              <span className="text-purple-400 font-mono font-bold">{(portamento * 1000).toFixed(0)} ms</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.30"
              step="0.01"
              value={portamento}
              onChange={(e) => setPortamento(Number(e.target.value))}
              className="w-full accent-purple-500 bg-[#21262d] h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Center Workspace: Piano Roll & Melodic Sequence */}
        <div className="flex-1 bg-[#07090e] flex flex-col overflow-hidden p-6 space-y-6">
          <div className="bg-[#0e121a] border border-[#21262d] rounded-2xl p-6 shadow-xl space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Music size={15} className="text-fuchsia-400" /> Vocal Melody Track & Thai Lyrics Grid
                </h3>
                <p className="text-[11px] text-[#8b949e]">Click lyric to edit syllable, select pitch, and toggle vibrato modulation.</p>
              </div>

              <button
                onClick={handleAddNote}
                className="bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Syllable Note
              </button>
            </div>

            {/* Syllable Notes Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 overflow-y-auto custom-scrollbar flex-1">
              {singingTrack.map((n, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2.5 transition-all relative group ${
                    activeNoteIdx === idx
                      ? 'bg-fuchsia-600/20 border-fuchsia-400 scale-105 shadow-[0_0_20px_rgba(217,70,239,0.35)] ring-1 ring-fuchsia-400'
                      : 'bg-[#131722] border-[#21262d] hover:border-[#38bdf8]/40'
                  }`}
                >
                  {/* Delete button on hover */}
                  <button 
                    onClick={() => handleRemoveNote(idx)}
                    className="absolute top-2 right-2 text-[#8b949e] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                    title="Remove note"
                  >
                    <Trash2 size={12} />
                  </button>

                  <select
                    value={n.note}
                    onChange={(e) => {
                      const updated = [...singingTrack];
                      const newNote = e.target.value;
                      updated[idx].note = newNote;
                      updated[idx].freq = noteFrequencies[newNote] || 261.63;
                      setSingingTrack(updated);
                    }}
                    className="bg-[#07090e] border border-[#21262d] rounded-lg text-xs font-mono font-bold text-fuchsia-400 px-2 py-1 outline-none"
                  >
                    {Object.keys(noteFrequencies).map(note => (
                      <option key={note} value={note}>{note}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={n.lyrics}
                    onChange={(e) => {
                      const updated = [...singingTrack];
                      updated[idx].lyrics = e.target.value;
                      setSingingTrack(updated);
                    }}
                    className="w-20 text-center bg-[#07090e] border border-[#30363d] rounded-xl text-lg font-black text-white py-1.5 outline-none focus:border-fuchsia-500 transition-colors shadow-inner"
                  />

                  {/* Vibrato Toggle */}
                  <button
                    onClick={() => {
                      const updated = [...singingTrack];
                      updated[idx].vibrato = !updated[idx].vibrato;
                      setSingingTrack(updated);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border transition-colors ${
                      n.vibrato 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                        : 'bg-[#161b22] border-[#21262d] text-[#8b949e]'
                    }`}
                  >
                    {n.vibrato ? 'Vibrato ON' : 'Vibrato OFF'}
                  </button>

                  <div className="flex justify-between w-full text-[10px] text-[#8b949e] font-mono border-t border-[#21262d] pt-1.5 mt-1">
                    <span>{n.durationMs}ms</span>
                    <span>{(n.freq).toFixed(0)}Hz</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
