import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Layout,
  LayoutDashboard,
  Palette,
  Eye,
  Sliders,
  Search,
  Check,
  Copy,
  Download,
  Play,
  Pause,
  Activity,
  Layers,
  Sparkles,
  Maximize2,
  Zap,
  BoxSelect,
  Grid
} from 'lucide-react';
import { UIUX_TOOLS_1000, UIUXToolItem } from '../data/uiuxToolsData';

export default function MegaUIUXMasterStudio() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedToolId, setSelectedToolId] = useState<string>(UIUX_TOOLS_1000[0].id);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const subCategories = useMemo(() => {
    const set = new Set<string>();
    UIUX_TOOLS_1000.forEach(t => set.add(t.subCategory));
    return Array.from(set);
  }, []);

  const filteredTools = useMemo(() => {
    return UIUX_TOOLS_1000.filter(tool => {
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
    return UIUX_TOOLS_1000.find(t => t.id === selectedToolId) || filteredTools[0] || UIUX_TOOLS_1000[0];
  }, [selectedToolId, filteredTools]);

  const handleCopy = () => {
    if (!activeTool) return;
    const text = `// UI/UX Tool: ${activeTool.name}\n// SubCategory: ${activeTool.subCategory}\n// Formula: ${activeTool.formula}\n// Inputs: ${activeTool.inputs.join(', ')}\n// Output: ${activeTool.output}\n// Specs: ${activeTool.specs}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Real-time Canvas for Spring Animation & WCAG Color Harmony Waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      if (isSimulating) step += 0.03;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, w, h);

      // Draw 8pt Grid Overlay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Spring Underdamped Physics Curve
      ctx.strokeStyle = '#bc8cff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const t = (x / w) * 4;
        const zeta = 0.45;
        const wn = 6.0;
        const wd = wn * Math.sqrt(1 - zeta * zeta);
        // Spring harmonic decay equation
        const val = 1 - Math.exp(-zeta * wn * t) * (Math.cos(wd * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t));
        const y = h - 30 - val * (h - 70);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Target Baseline 1.0
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#7ee787';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(w, 40);
      ctx.stroke();
      ctx.setLineDash([]);

      // Animated Spring Bob
      const curT = (step % 3);
      const curVal = 1 - Math.exp(-0.45 * 6.0 * curT) * (Math.cos(5.3 * curT) + 0.5 * Math.sin(5.3 * curT));
      const bobY = h - 30 - curVal * (h - 70);

      ctx.fillStyle = '#58a6ff';
      ctx.shadowColor = '#58a6ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(w - 60, bobY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Color Swatches Ribbon
      const swatches = ['#58a6ff', '#bc8cff', '#7ee787', '#f0883e', '#ff7b72', '#e3b341'];
      swatches.forEach((color, idx) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(20 + idx * 30, h - 25, 22, 12, 3);
        ctx.fill();
      });

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
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#bc8cff]/20 to-[#1f6feb]/20 border border-[#bc8cff]/30 text-[#bc8cff]">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                1,000x UI/UX Design System, Tokens, Layout & WCAG Architecture Suite
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/40 rounded-full">
                1,000 UI/UX TOOLS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40 rounded-full">
                100% NON-AI DETERMINISTIC
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e]">
              ชุดเครื่องมือออกแบบ UI/UX: Design Tokens W3C, WCAG 2.2 APCA Contrast, Spring Physics Curves, Modular Type Scales และ State Machines 1,000 ชนิด
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const allSpecs = UIUX_TOOLS_1000.map(
              t => `// [${t.subCategory}] ${t.name}\n// Formula: ${t.formula}\n// Specs: ${t.specs}\n`
            ).join('\n');
            const blob = new Blob([allSpecs], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MegaUIUX_1000_Tools_DesignSystem.tokens.txt`;
            a.click();
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] text-white transition-colors"
        >
          <Download size={13} />
          <span>Export All 1,000 UI/UX Tokens</span>
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
            placeholder="ค้นหาใน 1,000 เครื่องมือ UI/UX..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#bc8cff]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#8b949e]">Subcategory:</span>
          <select
            value={selectedSubCategory}
            onChange={e => setSelectedSubCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] focus:outline-none focus:border-[#bc8cff]"
          >
            <option value="all">🌐 All Subcategories ({UIUX_TOOLS_1000.length})</option>
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
            <span>SHOWING {filteredTools.length} OF 1,000 TOOLS</span>
            <span>W3C DESIGN TOKENS</span>
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
                      ? 'bg-[#bc8cff]/15 border-[#bc8cff] text-white shadow-sm'
                      : 'bg-[#0d1117]/80 hover:bg-[#21262d] border-[#30363d]/70 text-[#c9d1d9]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-xs leading-tight">{tool.name}</div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 shrink-0 ml-1.5">
                      {tool.tag}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8b949e] mt-1 font-mono">{tool.subCategory}</div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#7ee787] mt-1">
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
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/40">
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
                  <Activity size={15} className="text-[#bc8cff]" />
                  <span>Real-Time Spring Physics & WCAG Colorimetry Simulator</span>
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
                  SPRING HARMONIC WAVEFORM | W3C DESIGN TOKENS
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
