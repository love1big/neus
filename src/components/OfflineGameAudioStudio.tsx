import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Play, Zap, Shield, Sparkles, Wind, Flame, 
  Snowflake, Heart, Trees, CloudRain, Mountain, Mic, Radio, 
  Trophy, RotateCw, FastForward, Sliders, Layers, Activity,
  Music, Headphones, Eye, Send, CheckCircle2, ChevronRight
} from 'lucide-react';
import { gameAudioEngine, SOUND_PRESETS, SoundPreset, SoundCategory } from '../utils/offlineGameAudioEngine';

interface OfflineGameAudioStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function OfflineGameAudioStudio({ onSelectTool }: OfflineGameAudioStudioProps) {
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory | 'all'>('all');
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [masterVolume, setMasterVolume] = useState<number>(0.85);
  const [sfxVolume, setSfxVolume] = useState<number>(0.9);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.7);
  const [voiceVolume, setVoiceVolume] = useState<number>(0.95);
  const [spatialPan, setSpatialPan] = useState<number>(0.0);
  const [pitchShift, setPitchShift] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ttsInput, setTtsInput] = useState<string>('ดาบแห่งแสงสว่าง จงทำลายศัตรูให้สิ้นซาก! Take this!');
  const [ttsLang, setTtsLang] = useState<'th-TH' | 'en-US' | 'ja-JP'>('th-TH');

  // Waveform visualization ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isPlayingWaveform, setIsPlayingWaveform] = useState<boolean>(false);

  const categories: { id: SoundCategory | 'all'; name: string; thaiName: string; icon: any }[] = [
    { id: 'all', name: 'All FX', thaiName: 'ทั้งหมด', icon: Layers },
    { id: 'weapon_combat', name: 'Weapon & Combat', thaiName: '⚔️ ฟัน/อาวุธ', icon: Shield },
    { id: 'explosion_impact', name: 'Explosions', thaiName: '💥 ระเบิด', icon: Zap },
    { id: 'elemental_wind', name: 'Wind & Air', thaiName: '🌪️ ลม/พายุ', icon: Wind },
    { id: 'elemental_fire', name: 'Fire & Flame', thaiName: '🔥 ไฟ/เพลิง', icon: Flame },
    { id: 'elemental_lightning', name: 'Lightning', thaiName: '⚡ สายฟ้า', icon: Zap },
    { id: 'elemental_ice', name: 'Ice & Frost', thaiName: '❄️ น้ำแข็ง', icon: Snowflake },
    { id: 'magic_holy_dark', name: 'Holy & Dark', thaiName: '✨ เวทมนตร์/ฮีล', icon: Heart },
    { id: 'biome_ambient', name: 'Biome Ambient', thaiName: '🌲 ลมในป่า/ฉาก', icon: Trees },
    { id: 'voice_callout', name: 'Voice & Calls', thaiName: '🗣️ เสียงพากย์', icon: Mic },
  ];

  const filteredSounds = SOUND_PRESETS.filter((preset) => {
    const matchesCat = selectedCategory === 'all' || preset.category === selectedCategory;
    const matchesSearch = 
      searchQuery.trim() === '' ||
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.thaiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handlePlaySound = (preset: SoundPreset) => {
    setActiveSoundId(preset.id);
    gameAudioEngine.playSound(preset.id, {
      volume: sfxVolume,
      pan: spatialPan,
      pitchShift: pitchShift
    });
    triggerWaveformAnimation();
    setTimeout(() => {
      setActiveSoundId(null);
    }, (preset.duration * 1000) + 100);
  };

  const handleSpeakTTS = () => {
    if (!ttsInput.trim()) return;
    gameAudioEngine.speakText(ttsInput, ttsLang, pitchShift, 1.0);
    triggerWaveformAnimation();
  };

  const triggerWaveformAnimation = () => {
    setIsPlayingWaveform(true);
    let start = Date.now();
    const duration = 1200;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const elapsed = Date.now() - start;
      const progress = elapsed / duration;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid
      ctx.strokeStyle = 'rgba(42, 43, 61, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Draw active waveform
      const centerY = canvas.height / 2;
      const amplitude = (1 - progress) * 35;

      ctx.beginPath();
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2.5;

      for (let x = 0; x < canvas.width; x += 2) {
        const freq = 0.05 + (pitchShift * 0.02);
        const y = centerY + Math.sin(x * freq + elapsed * 0.02) * amplitude * Math.sin((x / canvas.width) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#58a6ff';

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(draw);
      } else {
        setIsPlayingWaveform(false);
        // Idle line
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = '#2a2b3d';
        ctx.lineWidth = 2;
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.stroke();
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    draw();
  };

  useEffect(() => {
    // Initial static canvas line
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = '#2a2b3d';
        ctx.lineWidth = 2;
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    }
  }, []);

  return (
    <div className="w-full h-full bg-[#0a0a0f] text-white flex flex-col overflow-hidden font-sans select-none">
      {/* Header */}
      <div className="bg-[#11111b] border-b border-[#2a2b3d] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400">
            <Volume2 size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              Offline Dynamic Game Audio Engine & Foley Studio
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                0ms Latency DSP
              </span>
            </h1>
            <p className="text-xs text-[#8b949e]">
              ระบบเสียงเอฟเฟกต์สกิลและบรรยากาศแผนที่จำลองเสียงจริง ทำงานแบบ Real-time ไร้ดีเลย์ 100% Client-Side
            </p>
          </div>
        </div>

        {/* Master Control */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const muted = gameAudioEngine.toggleMute();
              setIsMuted(muted);
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isMuted 
                ? 'bg-red-500/20 border-red-500/40 text-red-400' 
                : 'bg-[#1c2128] border-[#30363d] text-gray-300 hover:text-white'
            }`}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {isMuted ? 'Muted' : 'Sound Active'}
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Category Navigator & Real-Time Waveform */}
        <div className="w-80 border-r border-[#2a2b3d] bg-[#0d1117] flex flex-col p-4 gap-4 overflow-y-auto">
          {/* Real-time Oscilloscope */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-[#8b949e] mb-2 font-mono">
              <span className="flex items-center gap-1 text-blue-400">
                <Activity size={13} />
                REAL-TIME DSP SCOPE
              </span>
              <span className={isPlayingWaveform ? 'text-emerald-400 animate-pulse' : 'text-gray-500'}>
                {isPlayingWaveform ? 'ACTIVE' : 'IDLE'}
              </span>
            </div>
            <canvas
              ref={canvasRef}
              width={280}
              height={70}
              className="w-full bg-[#0a0a0f] rounded border border-[#21262d]"
            />
          </div>

          {/* Master Mixer & DSP Tuning */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex flex-col gap-3">
            <h2 className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Sliders size={13} className="text-blue-400" />
              DSP & MIXER CONTROLS
            </h2>

            <div>
              <div className="flex justify-between text-[11px] text-[#8b949e] mb-1">
                <span>SFX Volume</span>
                <span>{(sfxVolume * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSfxVolume(val);
                  gameAudioEngine.setSfxVolume(val);
                }}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#8b949e] mb-1">
                <span>Ambient / Biome Volume</span>
                <span>{(ambientVolume * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setAmbientVolume(val);
                  gameAudioEngine.setAmbientVolume(val);
                }}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#8b949e] mb-1">
                <span>3D Spatial Pan (L - R)</span>
                <span>{spatialPan < 0 ? `L ${Math.abs(spatialPan * 100).toFixed(0)}%` : spatialPan > 0 ? `R ${(spatialPan * 100).toFixed(0)}%` : 'Center'}</span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={spatialPan}
                onChange={(e) => setSpatialPan(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#8b949e] mb-1">
                <span>Pitch Shifter / Frequency</span>
                <span>{pitchShift.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={pitchShift}
                onChange={(e) => setPitchShift(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#8b949e] uppercase px-1 mb-1">หมวดหมู่เสียง</span>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                      : 'text-gray-400 hover:bg-[#161b22] hover:text-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={14} />
                    {cat.thaiName}
                  </span>
                  <ChevronRight size={12} className={isSelected ? 'text-blue-400' : 'text-gray-600'} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Sound Grid & Instant Play */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 bg-[#0a0a0f]">
          {/* Search Bar */}
          <div className="mb-4 flex items-center gap-3">
            <input
              type="text"
              placeholder="ค้นหาเสียงเอฟเฟกต์ เช่น ดาบ, ลม, ไฟ, ระเบิด, ฝน, ป่า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Sound Cards Grid */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pr-2">
            {filteredSounds.map((preset) => {
              const isActive = activeSoundId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handlePlaySound(preset)}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] scale-[1.02]'
                      : 'bg-[#11111b] border-[#2a2b3d] hover:border-blue-500/60 hover:bg-[#161b22]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${
                        preset.category === 'weapon_combat' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        preset.category === 'explosion_impact' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        preset.category === 'elemental_wind' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        preset.category === 'elemental_fire' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                        preset.category === 'elemental_lightning' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        preset.category === 'elemental_ice' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        preset.category === 'biome_ambient' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        <Volume2 size={16} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          {preset.thaiName}
                        </h3>
                        <p className="text-[10px] text-[#8b949e] font-mono">{preset.name}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySound(preset);
                      }}
                      className={`p-2 rounded-full border transition-all ${
                        isActive
                          ? 'bg-blue-500 text-white border-blue-400 animate-pulse'
                          : 'bg-[#1c2128] border-[#30363d] text-gray-300 hover:text-white hover:bg-blue-600'
                      }`}
                    >
                      <Play size={13} fill="currentColor" />
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 line-clamp-2 mb-3">
                    {preset.thaiDescription}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[#8b949e]">
                    <span className="px-2 py-0.5 rounded bg-[#1c2128] border border-[#30363d]">
                      {preset.duration}s DSP
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 size={11} /> 0ms Latency
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Offline Voice / Dialogue Synth */}
          <div className="mt-4 bg-[#11111b] border border-[#2a2b3d] rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white whitespace-nowrap">
              <Mic size={16} className="text-purple-400" />
              <span>Offline Voice / บทพูดพากย์:</span>
            </div>

            <input
              type="text"
              value={ttsInput}
              onChange={(e) => setTtsInput(e.target.value)}
              placeholder="พิมพ์ข้อความเสียงพากย์..."
              className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />

            <select
              value={ttsLang}
              onChange={(e) => setTtsLang(e.target.value as any)}
              className="bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none"
            >
              <option value="th-TH">ภาษาไทย (Thai)</option>
              <option value="en-US">English (US)</option>
              <option value="ja-JP">日本語 (Japanese)</option>
            </select>

            <button
              onClick={handleSpeakTTS}
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
            >
              <Play size={13} fill="currentColor" />
              พากย์เสียงสด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
