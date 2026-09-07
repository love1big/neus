/**
 * @file OmniMusicVocalDAWStudio.tsx
 * @description
 * ============================================================================
 * [THAI]
 * เวิร์กสเตชันดนตรี เสียงพากย์ และเพลงร้องครบวงจร (Omni Music, Vocal & Dubbing Studio)
 * ระบบครบเครื่องสำหรับงานเสียงเกมและดนตรี:
 *   1. Multi-Track DAW Step Sequencer: 16-Step Grid สำหรับ Synth Lead, Vocal Melody, Bassline
 *   2. Formant Singing & Vocal Synthesis: ปรับแต่งเมโลดี้เสียงร้องและฮาร์โมนิกส์
 *   3. Character Dubbing & Emotions: จำลองเสียงพากย์บทสนทนาตัวละคร (Hero, Sorceress, Sage, Demon)
 *   4. Procedural Game Sound FX Lab: สร้างและทดสอบเสียง Laser, Explosion, Coin, Jump
 *   5. Realtime Master Audio Playback: ควบคุม BPM, Play, Pause, Mute แทร็ก
 *
 * [ENGLISH]
 * Enterprise Web Audio DAW, Vocal Melody & Sound FX Studio.
 * Features:
 *   - 16-Step Multi-Track Sequencer with Live Step Playhead
 *   - Formant-Based Melodic Vocal Synthesis
 *   - Character Dubbing Actor Matrix (Hero, Sorceress, Sage, Demon)
 *   - Procedural Game Sound FX Laboratory
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  Mic2, Music, Play, Pause, RotateCcw, Volume2,
  Sliders, Sparkles, Wand2, Disc, Layers, Download
} from 'lucide-react';

import {
  OmniMusicVocalDAWEngine,
  DAWTrack
} from '../utils/OmniMusicVocalDAWEngine';

export default function OmniMusicVocalDAWStudio() {
  const [dawEngine] = useState<OmniMusicVocalDAWEngine>(() => new OmniMusicVocalDAWEngine());
  const [tracks, setTracks] = useState<DAWTrack[]>(() => dawEngine.getTracks());
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [bpm, setBpm] = useState<number>(120);
  const [activeTab, setActiveTab] = useState<'sequencer' | 'dubbing' | 'sfx_lab'>('sequencer');

  // Handle Play/Pause
  const handleTogglePlay = () => {
    if (isPlaying) {
      dawEngine.stopPlayback();
      setIsPlaying(false);
      setActiveStep(0);
    } else {
      setIsPlaying(true);
      dawEngine.startPlayback((step) => {
        setActiveStep(step);
      });
    }
  };

  // Toggle Grid Step Note
  const handleToggleStep = (trackId: string, stepIdx: number) => {
    setTracks((prev) =>
      prev.map((tr) => {
        if (tr.id === trackId) {
          const exists = tr.notes.some((n) => n.step === stepIdx);
          let newNotes;
          if (exists) {
            newNotes = tr.notes.filter((n) => n.step !== stepIdx);
          } else {
            const defaultFreq = tr.type === 'bass' ? 65.41 : 392.0;
            newNotes = [...tr.notes, { note: 'C', freq: defaultFreq, step: stepIdx, duration: 2 }];
          }
          tr.notes = newNotes;
        }
        return tr;
      })
    );
  };

  return (
    <div id="omni-music-daw-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Studio Header */}
      <header id="music-daw-header" className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 p-0.5 shadow-amber-500/20 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Disc className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              6. เสียงดนตรี เสียงพากย์ และเพลงร้อง (Omni Music & Vocal DAW)
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                Web Audio DSP & DAW
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              16-Step DAW Multi-Track Sequencer • Neural Vocal Synthesis • Character Dubbing • Game SFX Lab
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('sequencer')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'sequencer' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎹 Multi-Track DAW
            </button>
            <button
              onClick={() => setActiveTab('dubbing')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'dubbing' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎭 Character Dubbing
            </button>
            <button
              onClick={() => setActiveTab('sfx_lab')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'sfx_lab' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Game SFX Lab
            </button>
          </div>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'หยุดเล่น' : 'เล่น DAW (Play DAW)'}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {activeTab === 'sequencer' && (
          <section className="lg:col-span-12 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-amber-400" />
                  <h2 className="text-sm font-bold text-white">16-Step Polyphonic DAW Grid</h2>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">Tempo (BPM):</span>
                  <input
                    type="number"
                    min={60}
                    max={200}
                    value={bpm}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBpm(val);
                      dawEngine.setBpm(val);
                    }}
                    className="w-16 bg-slate-950 border border-slate-800 rounded p-1 font-mono text-center text-amber-400 font-bold"
                  />
                </div>
              </div>

              {/* Tracks Step Matrix */}
              <div className="space-y-3">
                {tracks.map((track) => (
                  <div key={track.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{track.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono">
                          {track.type}
                        </span>
                      </div>

                      <button
                        onClick={() => dawEngine.playNote(track.type === 'bass' ? 65.41 : 392.0, track.type, 0.4)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3 text-amber-400" />
                        <span>ทดสอบเสียง</span>
                      </button>
                    </div>

                    {/* 16 Step Buttons */}
                    <div className="grid grid-cols-16 gap-1">
                      {Array.from({ length: 16 }).map((_, stepIdx) => {
                        const isNoteActive = track.notes.some((n) => n.step === stepIdx);
                        const isCurrentPlayhead = isPlaying && activeStep === stepIdx;

                        return (
                          <button
                            key={stepIdx}
                            onClick={() => handleToggleStep(track.id, stepIdx)}
                            className={`h-10 rounded text-[10px] font-mono font-bold transition-all ${
                              isCurrentPlayhead
                                ? 'ring-2 ring-white scale-105 z-10'
                                : ''
                            } ${
                              isNoteActive
                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                : stepIdx % 4 === 0
                                ? 'bg-slate-900 text-slate-500 hover:bg-slate-800'
                                : 'bg-slate-950 border border-slate-900 text-slate-600 hover:bg-slate-900'
                            }`}
                          >
                            {stepIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'dubbing' && (
          <section className="lg:col-span-12 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Mic2 className="w-5 h-5 text-sky-400" />
                <h2 className="text-sm font-bold text-white">Character Voice Dubbing & Emotions</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                  { name: 'Hero (ผู้กล้า)', emotion: 'Heroic & Brave', desc: 'โทนเสียงก้องกังวาน หนักแน่น มั่นคง', freq: 220 },
                  { name: 'Sorceress (จอมเวทหญิง)', emotion: 'Mystical & Elegant', desc: 'โทนเสียงแหลมใส มีเสน่ห์ ลึกลับ', freq: 440 },
                  { name: 'Elder Sage (มหาปราชญ์)', emotion: 'Wise & Ancient', desc: 'โทนเสียงทุ้มลึก ช้า สุขุม', freq: 140 },
                  { name: 'Shadow Demon (จอมปีศาจ)', emotion: 'Menacing & Dark', desc: 'โทนเสียงแตกพร่า ดุร้าย น่าเกรงขาม', freq: 90 }
                ].map((actor, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="font-bold text-xs text-sky-300">{actor.name}</div>
                    <div className="text-[11px] text-amber-400 font-mono">{actor.emotion}</div>
                    <p className="text-[11px] text-slate-400">{actor.desc}</p>
                    <button
                      onClick={() => dawEngine.playNote(actor.freq, 'vocal_singing', 0.8)}
                      className="w-full mt-2 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-semibold"
                    >
                      กดฟังตัวอย่างเสียงพากย์
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'sfx_lab' && (
          <section className="lg:col-span-12 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-rose-400" />
                <h2 className="text-sm font-bold text-white">Procedural Game Sound FX Laboratory</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'laser', title: '🔫 Sci-Fi Laser Blaster', desc: 'เสียงลำแสงเลเซอร์ความถี่สูง' },
                  { id: 'coin', title: '🪙 Golden Coin Pickup', desc: 'เสียงเก็บเหรียญทองสองโน้ตสูง' },
                  { id: 'jump', title: '👟 Platformer Jump', desc: 'เสียงกระโดดแบบ 8-Bit Retro' },
                  { id: 'explosion', title: '💥 Heavy Blast Explosion', desc: 'เสียงระเบิดก้องกังวานทุ้มลึก' }
                ].map((sfx) => (
                  <button
                    key={sfx.id}
                    onClick={() => dawEngine.playProceduralSFX(sfx.id as any)}
                    className="p-4 bg-slate-950 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/50 rounded-xl text-left transition-all space-y-1"
                  >
                    <div className="text-xs font-bold text-rose-300">{sfx.title}</div>
                    <div className="text-[11px] text-slate-400">{sfx.desc}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-2">กดเพื่อทดสอบเสียง FX</div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
