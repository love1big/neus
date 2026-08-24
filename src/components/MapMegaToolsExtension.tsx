import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Map,
  Mountain,
  Compass,
  Layers,
  Search,
  Check,
  Copy,
  Download,
  Play,
  Pause,
  Activity,
  Trees,
  Droplets,
  Route,
  Grid
} from 'lucide-react';
import { MAP_ENGINEERING_TOOLS_300, MapToolItem } from '../data/mapEditToolsData';

export default function MapMegaToolsExtension() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedToolId, setSelectedToolId] = useState<string>(MAP_ENGINEERING_TOOLS_300[0].id);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const subCategories = useMemo(() => {
    const set = new Set<string>();
    MAP_ENGINEERING_TOOLS_300.forEach(t => set.add(t.subCategory));
    return Array.from(set);
  }, []);

  const filteredTools = useMemo(() => {
    return MAP_ENGINEERING_TOOLS_300.filter(tool => {
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
    return MAP_ENGINEERING_TOOLS_300.find(t => t.id === selectedToolId) || filteredTools[0] || MAP_ENGINEERING_TOOLS_300[0];
  }, [selectedToolId, filteredTools]);

  const handleCopy = () => {
    if (!activeTool) return;
    const text = `// Map Tool: ${activeTool.name}\n// SubCategory: ${activeTool.subCategory}\n// Formula: ${activeTool.formula}\n// Inputs: ${activeTool.inputs.join(', ')}\n// Output: ${activeTool.output}\n// Specs: ${activeTool.specs}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Real-time canvas for terrain heightmap & spline road visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      if (isSimulating) step += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw Topographic Contours / Heightfield
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, w, h);

      // Draw Isometric / Contour Lines
      const numLines = 14;
      for (let i = 0; i < numLines; i++) {
        const baseY = 30 + (h - 60) * (i / (numLines - 1));
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${140 + i * 8}, 60%, ${30 + i * 3}%)`;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < w; x += 4) {
          const nx = x / w;
          const elevation =
            Math.sin(nx * 6 + step + i * 0.4) * 20 +
            Math.cos(nx * 12 - step * 0.6) * 8 +
            Math.sin((nx + i) * 4) * 12;
          const y = baseY + elevation;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw Spline Road Overlay
      ctx.beginPath();
      ctx.strokeStyle = '#f0883e';
      ctx.lineWidth = 3;
      for (let x = 0; x < w; x += 4) {
        const nx = x / w;
        const roadY = h / 2 + Math.sin(nx * 4 + step * 0.5) * 35;
        if (x === 0) ctx.moveTo(x, roadY);
        else ctx.lineTo(x, roadY);
      }
      ctx.stroke();

      // Road Dash Marks
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 4) {
        const nx = x / w;
        const roadY = h / 2 + Math.sin(nx * 4 + step * 0.5) * 35;
        if (x === 0) ctx.moveTo(x, roadY);
        else ctx.lineTo(x, roadY);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Foliage Poisson Points
      ctx.fillStyle = '#7ee787';
      for (let j = 0; j < 12; j++) {
        const px = (w / 13) * (j + 1);
        const py = h / 2 + Math.sin((px / w) * 4 + step * 0.5) * 35 - 18;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

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
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#238636]/20 to-[#1f6feb]/20 border border-[#238636]/30 text-[#7ee787]">
            <Mountain size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                300x Map Creation, Terrain & Level Design Architecture Suite
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40 rounded-full">
                300 MAP TOOLS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40 rounded-full">
                100% NON-AI DETERMINISTIC
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e]">
              ชุดเครื่องมือสร้างแผนที่, การกัดเซาะตะกอนน้ำ (Hydraulic Erosion), NavMesh 3D, ถนน Spline, Biomes, Voxel Marching และ Octree LOD 300 ชนิด
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const allSpecs = MAP_ENGINEERING_TOOLS_300.map(
              t => `// [${t.subCategory}] ${t.name}\n// Formula: ${t.formula}\n// Specs: ${t.specs}\n`
            ).join('\n');
            const blob = new Blob([allSpecs], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MapEngine_300_Tools_Spec.txt`;
            a.click();
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] text-white transition-colors"
        >
          <Download size={13} />
          <span>Export All 300 Map Tools</span>
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
            placeholder="ค้นหาใน 300 เครื่องมือสร้างแผนที่..."
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
            <option value="all">🌐 All Subcategories ({MAP_ENGINEERING_TOOLS_300.length})</option>
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
            <span>100% PURE MATH & VOXEL</span>
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
                      ? 'bg-[#238636]/15 border-[#7ee787] text-white shadow-sm'
                      : 'bg-[#0d1117]/80 hover:bg-[#21262d] border-[#30363d]/70 text-[#c9d1d9]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-xs leading-tight">{tool.name}</div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#238636]/20 text-[#7ee787] border border-[#238636]/30 shrink-0 ml-1.5">
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
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40">
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
                  <span>Real-Time Hydraulic Topography & Spline Simulator</span>
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
                  <span>{isSimulating ? 'Simulating' : 'Paused'}</span>
                </button>
              </div>

              <div className="relative w-full h-56 rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden flex items-center justify-center">
                <canvas ref={canvasRef} width={640} height={224} className="w-full h-full object-contain" />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#161b22]/90 border border-[#30363d] text-[10px] font-mono text-[#8b949e]">
                  ISOMETRIC CONTOUR TRACE | DETERMINISTIC SEED
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
