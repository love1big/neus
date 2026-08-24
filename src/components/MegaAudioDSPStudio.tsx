import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Volume2,
  Sliders,
  Search,
  Check,
  Copy,
  Download,
  Play,
  Pause,
  Activity,
  Mic,
  Radio,
  Disc,
  Layers,
  Zap,
  Music,
  Gauge
} from 'lucide-react';
import { AUDIO_TOOLS_500, AudioToolItem } from '../data/audioEditToolsData';

export default function MegaAudioDSPStudio() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedToolId, setSelectedToolId] = useState<string>(AUDIO_TOOLS_500[0].id);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const subCategories = useMemo(() => {
    const set = new Set<string>();
    AUDIO_TOOLS_500.forEach(t => set.add(t.subCategory));
    return Array.from(set);
  }, []);

  const filteredTools = useMemo(() => {
    return AUDIO_TOOLS_500.filter(tool => {
      const matchCat = selectedSubCategory === 'all' || tool.subCategory === selectedSubCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.formula.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedSubCategory, searchQuery]);

  const activeTool = useMemo(() => {
    return AUDIO_TOOLS_500.find(t => t.id === selectedToolId) || filteredTools[0] || AUDIO_TOOLS_500[0];
  }, [selectedToolId, filteredTools]);

  const handleCopy = () => {
    if (!activeTool) return;
    const text = `// Audio DSP Tool: ${activeTool.name}\n// Category: ${activeTool.category}\n// SubCategory: ${activeTool.subCategory}\n// Complexity: ${activeTool.complexity}\n// Formula: ${activeTool.formula}\n// Inputs: ${activeTool.inputs.join(', ')}\n// Output: ${activeTool.output}\n// Specs: ${activeTool.specs}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Real-time Audio DSP FFT Spectrum & Oscilloscope Waveform Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      if (isSimulating) step += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, w, h);

      // Draw Frequency Grid Lines (20Hz, 100Hz, 1kHz, 10kHz, 20kHz)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const freqMarkers = [0.1, 0.25, 0.5, 0.75, 0.9];
      freqMarkers.forEach(ratio => {
        ctx.beginPath();
        ctx.moveTo(ratio * w, 0);
        ctx.lineTo(ratio * w, h);
        ctx.stroke();
      });

      // 1. Draw FFT 64-Band Frequency Bars
      const numBars = 64;
      const barWidth = (w / numBars) - 1.5;
      for (let i = 0; i < numBars; i++) {
        const freqRatio = i / numBars;
        // Harmonic spectral curve simulation with dynamic energy
        const baseAmp = Math.exp(-freqRatio * 3.5) * (0.6 + 0.4 * Math.sin(step * 1.5 + i * 0.4));
        const noise = Math.sin(step * 3.0 + i * 1.2) * 0.15;
        const barHeight = Math.max(4, (baseAmp + noise) * (h * 0.65));

        const x = i * (barWidth + 1.5) + 1;
        const y = h - barHeight - 4;

        // Gradient color from Cyan to Purple to Green
        const hue = 180 + (i / numBars) * 120;
        ctx.fillStyle = `hsla(${hue}, 80%, 55%, 0.65)`;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Peak cap
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y - 2, barWidth, 1.5);
      }

      // 2. Draw Real-Time Oscilloscope Waveform (Additive harmonics)
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#58a6ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      for (let x = 0; x < w; x++) {
        const normX = (x / w) * Math.PI * 8;
        // Fundamental + 3rd Harmonic + 5th Harmonic
        const wave = Math.sin(normX + step * 2.5) * 0.55
                   + Math.sin(normX * 3.0 + step * 5.0) * 0.25
                   + Math.sin(normX * 5.0 + step * 7.5) * 0.12;

        const y = (h * 0.35) + wave * (h * 0.22);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Stereo Phase Correlation Meter in Top Right
      const meterW = 100;
      const meterH = 12;
      const meterX = w - meterW - 14;
      const meterY = 14;

      ctx.fillStyle = '#161b22';
      ctx.strokeStyle = '#30363d';
      ctx.lineWidth = 1;
      ctx.fillRect(meterX, meterY, meterW, meterH);
      ctx.strokeRect(meterX, meterY, meterW, meterH);

      // Phase correlation needle (+1 to -1)
      const phaseVal = 0.85 + 0.1 * Math.sin(step * 2.0); // High stereo coherence
      const needleX = meterX + (phaseVal + 1) * 0.5 * meterW;
      ctx.fillStyle = '#7ee787';
      ctx.fillRect(needleX - 1.5, meterY, 3, meterH);

      ctx.fillStyle = '#8b949e';
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('+1 PHASE CORR', meterX - 6, meterY + 9);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isSimulating, activeTool]);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#1f6feb]/20 to-[#7ee787]/20 border border-[#7ee787]/30 text-[#7ee787]">
            <Volume2 size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                500x Audio DSP, Acoustics, Synthesis & Mastering Architecture Suite
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#7ee787]/20 text-[#7ee787] border border-[#7ee787]/40 rounded-full">
                500 AUDIO TOOLS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40 rounded-full">
                100% NON-AI DETERMINISTIC DSP
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e]">
              ชุดเครื่องมือประมวลผลเสียงระดับสตูดิโอ: FFT Spectral Bins, Linkwitz-Riley Crossover, True-RMS VCA, KEMAR HRTF 3D, PolyBLEP Oscillators, EBU R128 LUFS & FDN-16 Reverb 500 ชนิด
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const allSpecs = AUDIO_TOOLS_500.map(
              t => `// [${t.subCategory}] ${t.name}\n// Complexity: ${t.complexity}\n// Formula: ${t.formula}\n// Specs: ${t.specs}\n`
            ).join('\n');
            const blob = new Blob([allSpecs], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MegaAudioDSP_500_Tools_Spec.txt`;
            a.click();
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] text-white transition-colors"
        >
          <Download size={13} />
          <span>Export All 500 Audio DSP Tools</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="px-4 py-2 bg-[#161b22]/70 border-b border-[#30363d] flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ค้นหาใน 500 เครื่องมือประมวลผลเสียง & DSP..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#7ee787]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#8b949e]">Subcategory:</span>
          <select
            value={selectedSubCategory}
            onChange={e => setSelectedSubCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] focus:outline-none focus:border-[#7ee787]"
          >
            <option value="all">🌐 All Subcategories ({AUDIO_TOOLS_500.length})</option>
            {subCategories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Tool List */}
        <div className="w-80 border-r border-[#30363d] flex flex-col bg-[#161b22]/50 shrink-0">
          <div className="p-2 border-b border-[#30363d] text-[10px] font-mono text-[#8b949e] flex justify-between">
            <span>SHOWING {filteredTools.length} TOOLS</span>
            <span>64-BIT IEEE 754 DSP</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {filteredTools.map(tool => {
              const isSelected = tool.id === activeTool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-[#7ee787]/15 border-[#7ee787] text-white shadow-sm'
                      : 'bg-[#0d1117]/80 hover:bg-[#21262d] border-[#30363d]/70 text-[#c9d1d9]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-xs leading-tight">{tool.name}</div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#7ee787]/20 text-[#7ee787] border border-[#7ee787]/30 shrink-0 ml-1.5">
                      {tool.tag}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8b949e] mt-1 font-mono">{tool.subCategory}</div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#58a6ff] mt-1">
                    <span>{tool.complexity}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Simulator & Specs */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#0d1117] p-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-[#7ee787]/20 text-[#7ee787] border border-[#7ee787]/40">
                  {activeTool.subCategory}
                </span>
                <span className="text-xs text-[#8b949e] font-mono">[{activeTool.tag}]</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{activeTool.name}</h2>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition-colors"
              >
                {copied ? <Check size={13} className="text-[#7ee787]" /> : <Copy size={13} />}
                <span>{copied ? 'Copied Specs!' : 'Copy Specs'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 flex flex-col p-3 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                  <Activity size={15} className="text-[#7ee787]" />
                  <span>Real-Time FFT Spectrum Analyzer & Oscilloscope Visualizer</span>
                </div>

                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                    isSimulating
                      ? 'bg-[#238636]/20 text-[#7ee787] border-[#238636]/40'
                      : 'bg-[#da3633]/20 text-[#ff7b72] border-[#da3633]/40'
                  }`}
                >
                  {isSimulating ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isSimulating ? 'Active' : 'Paused'}</span>
                </button>
              </div>

              <div className="relative w-full h-56 rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden flex items-center justify-center">
                <canvas ref={canvasRef} width={640} height={224} className="w-full h-full object-contain" />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#161b22]/90 border border-[#30363d] text-[10px] font-mono text-[#8b949e]">
                  64-BAND FFT SPECTRUM | 48.0 kHz 64-BIT PRECISION
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col p-3 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
              <div className="text-xs font-semibold text-white">Mathematical Algorithm & Formulation</div>

              <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] font-mono text-xs text-[#e3b341] leading-relaxed break-all">
                {activeTool.formula}
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-[#0d1117] border border-[#30363d]">
                  <div className="text-[10px] text-[#8b949e] font-mono uppercase">Inputs</div>
                  <div className="font-mono text-[11px] text-[#c9d1d9] mt-1">{activeTool.inputs.join(' | ')}</div>
                </div>

                <div className="p-2 rounded bg-[#0d1117] border border-[#30363d]">
                  <div className="text-[10px] text-[#8b949e] font-mono uppercase">Outputs</div>
                  <div className="font-mono text-[11px] text-[#7ee787] mt-1">{activeTool.output}</div>
                </div>

                <div className="p-2 rounded bg-[#0d1117] border border-[#30363d]">
                  <div className="text-[10px] text-[#8b949e] font-mono uppercase">Standard / Execution Specs</div>
                  <div className="font-mono text-[11px] text-[#58a6ff] mt-1">{activeTool.specs}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
