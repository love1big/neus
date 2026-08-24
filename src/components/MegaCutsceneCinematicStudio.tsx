import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Film,
  Camera,
  Clapperboard,
  Search,
  Check,
  Copy,
  Download,
  Play,
  Pause,
  Activity,
  Sliders,
  Eye,
  Layers,
  Zap,
  Sparkles,
  Maximize2,
  Video
} from 'lucide-react';
import { CUTSCENE_TOOLS_300, CutsceneToolItem } from '../data/cutsceneEditToolsData';

export default function MegaCutsceneCinematicStudio() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedToolId, setSelectedToolId] = useState<string>(CUTSCENE_TOOLS_300[0].id);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const subCategories = useMemo(() => {
    const set = new Set<string>();
    CUTSCENE_TOOLS_300.forEach(t => set.add(t.subCategory));
    return Array.from(set);
  }, []);

  const filteredTools = useMemo(() => {
    return CUTSCENE_TOOLS_300.filter(tool => {
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
    return CUTSCENE_TOOLS_300.find(t => t.id === selectedToolId) || filteredTools[0] || CUTSCENE_TOOLS_300[0];
  }, [selectedToolId, filteredTools]);

  const handleCopy = () => {
    if (!activeTool) return;
    const text = `// Cinematic Tool: ${activeTool.name}\n// Category: ${activeTool.category}\n// SubCategory: ${activeTool.subCategory}\n// Complexity: ${activeTool.complexity}\n// Formula: ${activeTool.formula}\n// Inputs: ${activeTool.inputs.join(', ')}\n// Output: ${activeTool.output}\n// Specs: ${activeTool.specs}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Real-time Virtual Camera Frustum & SMPTE Multi-Track Keyframe Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      if (isSimulating) step += 0.025;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, w, h);

      // Split canvas: Left 45% = 2.39:1 CinemaScope Frame, Right 55% = Multi-Track Timeline
      const scopeW = Math.floor(w * 0.45);
      const timelineX = scopeW + 10;
      const timelineW = w - timelineX;

      // 1. Render Left Scope Viewport (Letterbox Cinema View)
      ctx.fillStyle = '#05070a';
      ctx.fillRect(10, 10, scopeW - 10, h - 20);

      // CinemaScope aspect ratio boundary
      const letterboxH = Math.floor((scopeW - 20) / 2.39);
      const letterboxY = Math.floor((h - letterboxH) / 2);
      ctx.fillStyle = '#161b22';
      ctx.fillRect(15, letterboxY, scopeW - 20, letterboxH);

      // Draw Golden Spiral / Rule-of-Thirds Grid in Scope
      ctx.strokeStyle = 'rgba(88, 166, 255, 0.25)';
      ctx.lineWidth = 1;
      const thirdsX1 = 15 + (scopeW - 20) / 3;
      const thirdsX2 = 15 + (2 * (scopeW - 20)) / 3;
      const thirdsY1 = letterboxY + letterboxH / 3;
      const thirdsY2 = letterboxY + (2 * letterboxH) / 3;

      ctx.beginPath();
      ctx.moveTo(thirdsX1, letterboxY); ctx.lineTo(thirdsX1, letterboxY + letterboxH);
      ctx.moveTo(thirdsX2, letterboxY); ctx.lineTo(thirdsX2, letterboxY + letterboxH);
      ctx.moveTo(15, thirdsY1); ctx.lineTo(15 + scopeW - 20, thirdsY1);
      ctx.moveTo(15, thirdsY2); ctx.lineTo(15 + scopeW - 20, thirdsY2);
      ctx.stroke();

      // Draw Dynamic Actor Head Target & Anamorphic Oval Bokeh Flare
      const targetCenterX = thirdsX2 + Math.sin(step) * 12;
      const targetCenterY = thirdsY1 + Math.cos(step * 0.8) * 8;

      // Anamorphic horizontal streak
      const grad = ctx.createLinearGradient(targetCenterX - 60, targetCenterY, targetCenterX + 60, targetCenterY);
      grad.addColorStop(0, 'rgba(88, 166, 255, 0)');
      grad.addColorStop(0.5, 'rgba(88, 166, 255, 0.8)');
      grad.addColorStop(1, 'rgba(88, 166, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(targetCenterX - 60, targetCenterY - 1.5, 120, 3);

      // Elliptical 2.0x Bokeh
      ctx.strokeStyle = '#bc8cff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(targetCenterX, targetCenterY, 8, 16, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#7ee787';
      ctx.beginPath();
      ctx.arc(targetCenterX, targetCenterY, 3, 0, Math.PI * 2);
      ctx.fill();

      // 2. Render Right Multi-Track NLE Timeline
      const tracks = [
        { name: 'CAM 1 (50mm Prime)', color: '#58a6ff' },
        { name: 'ACTOR 1 (Mocap/FACS)', color: '#bc8cff' },
        { name: 'LIGHT (Key/Fill Rim)', color: '#e3b341' },
        { name: 'DIALOGUE (WAV 48k)', color: '#7ee787' },
        { name: 'POST VFX / LUT', color: '#ff7b72' }
      ];

      const trackH = Math.floor((h - 36) / tracks.length);
      const timecodeCur = (step * 1.2) % (timelineW - 20);

      tracks.forEach((tr, idx) => {
        const ty = 14 + idx * trackH;
        // Track background
        ctx.fillStyle = '#161b22';
        ctx.fillRect(timelineX, ty, timelineW - 10, trackH - 3);

        // Track Label
        ctx.fillStyle = '#8b949e';
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(tr.name, timelineX + 6, ty + 12);

        // Keyframe Diamond Points
        const numKeys = 5;
        for (let k = 0; k < numKeys; k++) {
          const kx = timelineX + 90 + k * 45 + (idx * 8);
          if (kx < timelineX + timelineW - 20) {
            ctx.fillStyle = tr.color;
            ctx.beginPath();
            ctx.moveTo(kx, ty + (trackH - 3) / 2 - 4);
            ctx.lineTo(kx + 4, ty + (trackH - 3) / 2);
            ctx.lineTo(kx, ty + (trackH - 3) / 2 + 4);
            ctx.lineTo(kx - 4, ty + (trackH - 3) / 2);
            ctx.closePath();
            ctx.fill();
          }
        }
      });

      // Playhead Time Needle (Red Line)
      const needleX = timelineX + 80 + timecodeCur;
      ctx.strokeStyle = '#ff7b72';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(needleX, 10);
      ctx.lineTo(needleX, h - 10);
      ctx.stroke();

      // Playhead head
      ctx.fillStyle = '#ff7b72';
      ctx.beginPath();
      ctx.moveTo(needleX - 4, 10);
      ctx.lineTo(needleX + 4, 10);
      ctx.lineTo(needleX, 16);
      ctx.closePath();
      ctx.fill();

      // SMPTE Timecode Text
      const frameNum = Math.floor((step * 24) % 240);
      const secNum = Math.floor(frameNum / 24);
      const ff = frameNum % 24;
      const tcString = `00:00:0${secNum}:${ff < 10 ? '0' + ff : ff} [24.000 FPS]`;
      ctx.fillStyle = '#c9d1d9';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(tcString, w - 16, h - 6);

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
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#ff7b72]/20 to-[#a371f7]/20 border border-[#ff7b72]/30 text-[#ff7b72]">
            <Film size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                300x Cinematic, Cutscene, Virtual Camera & Timeline Director Suite
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/40 rounded-full">
                300 CINEMATIC TOOLS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40 rounded-full">
                100% NON-AI CINEMATOGRAPHY
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e]">
              ชุดเครื่องมือสร้างและกำกับคัตซีนระดับมืออาชีพ: Anamorphic Lens Optics, Steadicam RK4 Rig, SMPTE Multi-Track NLE, ACEScct CDL Grading, FACS Viseme Sync & God-Ray Lighting 300 ชนิด
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const allSpecs = CUTSCENE_TOOLS_300.map(
              t => `// [${t.subCategory}] ${t.name}\n// Complexity: ${t.complexity}\n// Formula: ${t.formula}\n// Specs: ${t.specs}\n`
            ).join('\n');
            const blob = new Blob([allSpecs], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MegaCutsceneCinematic_300_Tools_Spec.txt`;
            a.click();
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#1f6feb] hover:bg-[#388bfd] text-white transition-colors"
        >
          <Download size={13} />
          <span>Export All 300 Cinematic Tools</span>
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
            placeholder="ค้นหาใน 300 เครื่องมือคัตซีน & ภาพยนตร์..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#ff7b72]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#8b949e]">Subcategory:</span>
          <select
            value={selectedSubCategory}
            onChange={e => setSelectedSubCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] focus:outline-none focus:border-[#ff7b72]"
          >
            <option value="all">🌐 All Subcategories ({CUTSCENE_TOOLS_300.length})</option>
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
            <span>2.39:1 CINEMASCOPE / SMPTE</span>
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
                      ? 'bg-[#ff7b72]/15 border-[#ff7b72] text-white shadow-sm'
                      : 'bg-[#0d1117]/80 hover:bg-[#21262d] border-[#30363d]/70 text-[#c9d1d9]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-xs leading-tight">{tool.name}</div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/30 shrink-0 ml-1.5">
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
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/40">
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
                  <Activity size={15} className="text-[#ff7b72]" />
                  <span>Real-Time Anamorphic Scope & SMPTE Multi-Track Sequencer Visualizer</span>
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
                  VIRTUAL CAMERA 2.39:1 SCOPE | SMPTE NLE TIMELINE
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
