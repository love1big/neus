import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  Cpu,
  Sliders,
  Layers,
  Search,
  Filter,
  Check,
  Copy,
  Download,
  Play,
  Pause,
  Grid,
  Zap,
  Maximize2,
  HardDrive,
  Eye,
  Settings,
  RefreshCw,
  FolderGit2,
  Share2,
  FileCode,
  Activity,
  CircuitBoard
} from 'lucide-react';
import { IMAGE_PBR_TOOLS_300, PCB_CIRCUIT_TOOLS_300, TextureToolItem } from '../data/texturePcbToolsData';

export default function TexturePCBMasterStudio() {
  const [activeTab, setActiveTab] = useState<'texture' | 'pcb'>('texture');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedToolId, setSelectedToolId] = useState<string>(
    activeTab === 'texture' ? IMAGE_PBR_TOOLS_300[0].id : PCB_CIRCUIT_TOOLS_300[0].id
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentDataset = useMemo(() => {
    return activeTab === 'texture' ? IMAGE_PBR_TOOLS_300 : PCB_CIRCUIT_TOOLS_300;
  }, [activeTab]);

  const subCategories = useMemo(() => {
    const set = new Set<string>();
    currentDataset.forEach(t => set.add(t.subCategory));
    return Array.from(set);
  }, [currentDataset]);

  const filteredTools = useMemo(() => {
    return currentDataset.filter(tool => {
      const matchCat = selectedSubCategory === 'all' || tool.subCategory === selectedSubCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.formula.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [currentDataset, selectedSubCategory, searchQuery]);

  const activeTool = useMemo(() => {
    return currentDataset.find(t => t.id === selectedToolId) || filteredTools[0] || currentDataset[0];
  }, [selectedToolId, currentDataset, filteredTools]);

  // Handle Copy
  const handleCopy = () => {
    if (!activeTool) return;
    const text = `// Tool: ${activeTool.name}\n// Formula: ${activeTool.formula}\n// Inputs: ${activeTool.inputs.join(', ')}\n// Output: ${activeTool.output}\n// Specs: ${activeTool.specs}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Canvas visualizer (PBR Texture normals or PCB routing grid)
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

      if (activeTab === 'texture') {
        // Render PBR Height / Normal map ripple simulation
        const imgData = ctx.createImageData(w, h);
        const data = imgData.data;
        for (let y = 0; y < h; y += 2) {
          for (let x = 0; x < w; x += 2) {
            const nx = (x / w) * 8;
            const ny = (y / h) * 8;
            const height = (Math.sin(nx + step) + Math.cos(ny - step * 0.7) + Math.sin((nx + ny) * 2)) * 0.33 + 0.5;

            // Generate Normal vector components (R=X, G=Y, B=Z)
            const r = Math.floor(128 + Math.sin(nx + step) * 100);
            const g = Math.floor(128 + Math.cos(ny - step) * 100);
            const b = Math.floor(200 + height * 55);

            for (let dy = 0; dy < 2; dy++) {
              for (let dx = 0; dx < 2; dx++) {
                const idx = ((y + dy) * w + (x + dx)) * 4;
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = 255;
              }
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);

        // Overlay Normals Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.strokeRect(10, 10, w - 20, h - 20);
      } else {
        // Render PCB Traces & Vias & Ground Plane
        ctx.fillStyle = '#062817'; // PCB Dark Green Soldermask
        ctx.fillRect(0, 0, w, h);

        // Ground Plane Hatching Grid
        ctx.strokeStyle = 'rgba(10, 60, 30, 0.6)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 15) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 15) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Gold / Copper Traces
        ctx.strokeStyle = '#e3b341';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Trace 1: Differential Pair
        for (let i = 0; i < 4; i++) {
          const offsetY = 40 + i * 35;
          ctx.beginPath();
          ctx.moveTo(30, offsetY);
          ctx.lineTo(120, offsetY);
          ctx.lineTo(160, offsetY + 25);
          ctx.lineTo(340, offsetY + 25);
          ctx.lineTo(380, offsetY);
          ctx.lineTo(w - 40, offsetY);
          ctx.stroke();

          // Second pair line
          ctx.beginPath();
          ctx.moveTo(30, offsetY + 8);
          ctx.lineTo(116, offsetY + 8);
          ctx.lineTo(156, offsetY + 33);
          ctx.lineTo(344, offsetY + 33);
          ctx.lineTo(384, offsetY + 8);
          ctx.lineTo(w - 40, offsetY + 8);
          ctx.stroke();
        }

        // Vias with circular pads
        ctx.fillStyle = '#ffdf7a';
        ctx.strokeStyle = '#856404';
        ctx.lineWidth = 2;
        const viaPositions = [
          [30, 40], [30, 48], [120, 40], [380, 40], [w - 40, 40],
          [30, 110], [160, 135], [340, 135], [w - 40, 110],
          [200, 80], [240, 80], [280, 80], [320, 80]
        ];

        viaPositions.forEach(([vx, vy]) => {
          ctx.beginPath();
          ctx.arc(vx, vy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#062817';
          ctx.beginPath();
          ctx.arc(vx, vy, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffdf7a';
        });

        // Pulsing Signal Indicator
        const pulseX = 30 + ((step * 80) % (w - 70));
        ctx.fillStyle = '#7ee787';
        ctx.shadowColor = '#7ee787';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(pulseX, 40, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeTab, isSimulating, activeTool]);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden">
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#1f6feb]/20 to-[#238636]/20 border border-[#388bfd]/30 text-[#58a6ff]">
            {activeTab === 'texture' ? <ImageIcon size={20} /> : <CircuitBoard size={20} />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                {activeTab === 'texture'
                  ? '300x PBR Image, Texture & Normal Processing Suite'
                  : '300x PCB Circuit, Gerber & EDA Engineering Suite'}
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40 rounded-full">
                {activeTab === 'texture' ? '300 PBR TOOLS' : '300 PCB TOOLS'}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40 rounded-full">
                100% NON-AI DETERMINISTIC
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e]">
              {activeTab === 'texture'
                ? 'ชุดเครื่องมือคำนวณและประมวลผล Texture, Normal Maps, Heightmap, Cavity, Convolutions และ PBR Materials 300 ชนิด'
                : 'ชุดเครื่องมือออกแบบวงจร PCB, Gerber RS-274X, DRC Clearance, Differential Impedance และ High-Speed EDA 300 ชนิด'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
          <button
            onClick={() => {
              setActiveTab('texture');
              setSelectedSubCategory('all');
              setSelectedToolId(IMAGE_PBR_TOOLS_300[0].id);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'texture'
                ? 'bg-[#1f6feb] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <ImageIcon size={14} />
            <span>Image & PBR Texture (300)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('pcb');
              setSelectedSubCategory('all');
              setSelectedToolId(PCB_CIRCUIT_TOOLS_300[0].id);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'pcb'
                ? 'bg-[#238636] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <CircuitBoard size={14} />
            <span>PCB & EDA Circuit (300)</span>
          </button>
        </div>
      </div>

      {/* Ribbon: Search & Subcategory Filter */}
      <div className="px-4 py-2 bg-[#161b22]/70 border-b border-[#30363d] flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`ค้นหาใน ${currentDataset.length} เครื่องมือ...`}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#8b949e]">Subcategory:</span>
          <select
            value={selectedSubCategory}
            onChange={e => setSelectedSubCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
          >
            <option value="all">🌐 All Subcategories ({currentDataset.length})</option>
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
            <span>100% DETERMINISTIC</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {filteredTools.map(tool => {
              const isSelected = tool.id === activeTool?.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? activeTab === 'texture'
                        ? 'bg-[#1f6feb]/15 border-[#58a6ff] text-white'
                        : 'bg-[#238636]/15 border-[#7ee787] text-white'
                      : 'bg-[#0d1117]/80 hover:bg-[#21262d] border-[#30363d]/70 text-[#c9d1d9]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-xs leading-tight">{tool.name}</div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ml-1.5 ${
                        activeTab === 'texture'
                          ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30'
                          : 'bg-[#7ee787]/20 text-[#7ee787] border border-[#7ee787]/30'
                      }`}
                    >
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

        {/* Right Column: Simulator, Math Formula & Specs */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#0d1117] p-4 space-y-4">
          {activeTool && (
            <>
              {/* Header Box */}
              <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-mono font-bold rounded-md ${
                        activeTab === 'texture'
                          ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/40'
                          : 'bg-[#7ee787]/20 text-[#7ee787] border border-[#7ee787]/40'
                      }`}
                    >
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

                  <button
                    onClick={() => {
                      const text = `// Tool: ${activeTool.name}\n// Category: ${activeTool.subCategory}\n// Complexity: ${activeTool.complexity}\n// Formula:\n${activeTool.formula}\n\n// Inputs:\n${activeTool.inputs.join('\n')}\n\n// Output:\n${activeTool.output}\n\n// Specs:\n${activeTool.specs}`;
                      const blob = new Blob([text], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${activeTool.id}_specification.txt`;
                      a.click();
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1f6feb] hover:bg-[#388bfd] text-white transition-colors"
                  >
                    <Download size={13} />
                    <span>Export Spec</span>
                  </button>
                </div>
              </div>

              {/* Visual Simulation Canvas & Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-7 flex flex-col p-3 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                      <Activity size={15} className="text-[#58a6ff]" />
                      <span>
                        {activeTab === 'texture'
                          ? 'Real-Time PBR Normal / Texture Map Shader'
                          : 'Real-Time PCB Differential Trace & Via Matrix'}
                      </span>
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
                      {activeTab === 'texture' ? 'PBR RASTER KERNEL: 4096x4096' : 'EDA PLANE SWEEP: 0.127mm PITCH'}
                    </div>
                  </div>
                </div>

                {/* Mathematical Equation & Specification */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
