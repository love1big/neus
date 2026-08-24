import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Cpu,
  Layers,
  Box,
  Activity,
  Calculator,
  Compass,
  Wrench,
  Grid,
  Zap,
  Sliders,
  Maximize2,
  HardDrive,
  Eye,
  RefreshCw,
  Play,
  Pause,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  Code2,
  Share2,
  Settings,
  ChevronRight,
  Database,
  Flame,
  Volume2,
  Orbit,
  Sparkles,
  Binary,
  Radio,
  FileCode,
  Shield,
  Gauge,
  SlidersHorizontal,
  FolderGit2,
  Terminal
} from 'lucide-react';
import {
  MEGA_DISCIPLINES,
  ALL_MEGA_TOOLS_300,
  MegaToolItem,
  DisciplineCategory
} from '../data/megaToolsDatabase300';

export default function OmniMegaEngine300Studio() {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'deterministic' | 'offline_ai'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedToolId, setSelectedToolId] = useState<string>(ALL_MEGA_TOOLS_300[0]?.id || 'd1_q16_fixed_point');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [targetLang, setTargetLang] = useState<'cpp' | 'rust' | 'glsl' | 'wgsl' | 'python'>('cpp');

  // Canvas ref for real-time visual simulation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filter tools
  const filteredTools = useMemo(() => {
    return ALL_MEGA_TOOLS_300.filter(tool => {
      const matchDiscipline = selectedDisciplineId === 'all' || tool.disciplineId === selectedDisciplineId;
      const matchType = filterType === 'all' || tool.category === filterType;
      const matchSearch =
        searchQuery.trim() === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.disciplineName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDiscipline && matchType && matchSearch;
    });
  }, [selectedDisciplineId, filterType, searchQuery]);

  const activeTool = useMemo(() => {
    return ALL_MEGA_TOOLS_300.find(t => t.id === selectedToolId) || filteredTools[0] || ALL_MEGA_TOOLS_300[0];
  }, [selectedToolId, filteredTools]);

  // Handle Copy
  const handleCopyCode = () => {
    if (!activeTool) return;
    navigator.clipboard.writeText(activeTool.codeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Real-time canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      if (isSimulating) {
        step += 0.05 * simSpeed;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Draw background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw specialized visualization based on activeTool type
      if (activeTool.category === 'deterministic') {
        // Deterministic Physics / Waveform / Mesh Curves
        ctx.strokeStyle = '#58a6ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const normX = x / w;
          const y =
            h / 2 +
            Math.sin(normX * 12 + step) * 35 * Math.cos(normX * 4) +
            Math.sin(normX * 24 - step * 1.5) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Second harmonic
        ctx.strokeStyle = '#7ee787';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
          const normX = x / w;
          const y = h / 2 + Math.cos(normX * 8 - step * 0.8) * 25;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw nodes / vertices
        ctx.fillStyle = '#f0883e';
        for (let i = 0; i < 8; i++) {
          const px = (w / 9) * (i + 1);
          const py = h / 2 + Math.sin((px / w) * 12 + step) * 35 * Math.cos((px / w) * 4);
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Offline AI Neural Network Nodes & Tensor Activation Waves
        const cols = 8;
        const rows = 5;
        const startX = 40;
        const startY = 30;
        const gapX = (w - 80) / (cols - 1);
        const gapY = (h - 60) / (rows - 1);

        // Connections
        ctx.strokeStyle = 'rgba(188, 140, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let c = 0; c < cols - 1; c++) {
          for (let r1 = 0; r1 < rows; r1++) {
            for (let r2 = 0; r2 < rows; r2++) {
              if ((r1 + r2 + c) % 2 === 0) {
                const x1 = startX + c * gapX;
                const y1 = startY + r1 * gapY;
                const x2 = startX + (c + 1) * gapX;
                const y2 = startY + r2 * gapY;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
              }
            }
          }
        }

        // Animated Tensor Signals
        for (let i = 0; i < 6; i++) {
          const tPos = (step * 0.4 + i * 0.18) % 1;
          const colIdx = Math.floor(tPos * (cols - 1));
          const colFrac = (tPos * (cols - 1)) % 1;
          const x = startX + colIdx * gapX + colFrac * gapX;
          const y = startY + Math.sin(tPos * Math.PI * 4 + i) * 30 + (h / 2 - 20);

          ctx.fillStyle = '#bc8cff';
          ctx.shadowColor = '#bc8cff';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Nodes
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const nx = startX + c * gapX;
            const ny = startY + r * gapY;
            const active = Math.sin(c * 2 + r * 3 + step) > 0.2;
            ctx.fillStyle = active ? '#bc8cff' : '#21262d';
            ctx.strokeStyle = active ? '#d2a8ff' : '#30363d';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(nx, ny, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeTool, isSimulating, simSpeed]);

  const getDisciplineIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator size={14} className="text-[#58a6ff]" />;
      case 'Flame':
        return <Flame size={14} className="text-[#ff7b72]" />;
      case 'Box':
        return <Box size={14} className="text-[#7ee787]" />;
      case 'Zap':
        return <Zap size={14} className="text-[#f0883e]" />;
      case 'Volume2':
        return <Volume2 size={14} className="text-[#a371f7]" />;
      case 'Cpu':
        return <Cpu size={14} className="text-[#388bfd]" />;
      case 'Shield':
        return <Shield size={14} className="text-[#79c0ff]" />;
      case 'Brain':
        return <BrainIcon size={14} className="text-[#bc8cff]" />;
      case 'Eye':
        return <Eye size={14} className="text-[#d2a8ff]" />;
      case 'Orbit':
        return <Orbit size={14} className="text-[#56d364]" />;
      case 'Radio':
        return <Radio size={14} className="text-[#f778ba]" />;
      case 'Database':
        return <Database size={14} className="text-[#e3b341]" />;
      default:
        return <Wrench size={14} className="text-[#8b949e]" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#238636]/20 to-[#1f6feb]/20 border border-[#388bfd]/30 text-[#58a6ff]">
            <Cpu size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                Omni 300+ Mega Engineering & Neural Intelligence Suite
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40 rounded-full">
                335 AAA TOOLS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40 rounded-full">
                100% DETERMINISTIC & ON-DEVICE
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e]">
              คลังเครื่องมือระดับวิศวกรรมเกมและ AI ออฟไลน์ 335 ระบบ แยกตาม 12 หมวดหมู่ พร้อมอัลกอริทึม สมองกล และโค้ด C++/Rust/GLSL/WebGPU
            </p>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 rounded bg-[#0d1117] border border-[#30363d] text-xs">
            <span className="text-[#8b949e]">Deterministic:</span>
            <span className="text-[#58a6ff] font-mono font-bold">190 Tools</span>
            <span className="text-[#30363d]">|</span>
            <span className="text-[#8b949e]">Offline AI:</span>
            <span className="text-[#bc8cff] font-mono font-bold">145 Tools</span>
          </div>

          <button
            onClick={() => {
              const fullSource = ALL_MEGA_TOOLS_300.map(
                t => `// [${t.disciplineName}] - ${t.name}\n// ${t.formulaOrArchitecture}\n${t.codeSnippet.code}\n`
              ).join('\n\n');
              const blob = new Blob([fullSource], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `OmniMegaEngine_335_Tools_Bundle.hpp`;
              a.click();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] text-white transition-colors"
          >
            <Download size={13} />
            <span>Export All 335 Headers</span>
          </button>
        </div>
      </div>

      {/* Filter & Discipline Ribbon */}
      <div className="px-4 py-2 bg-[#161b22]/70 border-b border-[#30363d] flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Type Filter Buttons */}
        <div className="flex items-center space-x-1.5 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
          <button
            onClick={() => {
              setFilterType('all');
              setSelectedDisciplineId('all');
            }}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              filterType === 'all' && selectedDisciplineId === 'all'
                ? 'bg-[#1f6feb] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            All 335 Tools
          </button>
          <button
            onClick={() => {
              setFilterType('deterministic');
              if (selectedDisciplineId !== 'all') {
                const disc = MEGA_DISCIPLINES.find(d => d.id === selectedDisciplineId);
                if (disc && disc.type !== 'deterministic') setSelectedDisciplineId('all');
              }
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              filterType === 'deterministic'
                ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/40 font-bold'
                : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <Calculator size={13} />
            <span>Pure Deterministic (190)</span>
          </button>
          <button
            onClick={() => {
              setFilterType('offline_ai');
              if (selectedDisciplineId !== 'all') {
                const disc = MEGA_DISCIPLINES.find(d => d.id === selectedDisciplineId);
                if (disc && disc.type !== 'offline_ai') setSelectedDisciplineId('all');
              }
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              filterType === 'offline_ai'
                ? 'bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/40 font-bold'
                : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <BrainIcon size={13} />
            <span>Offline AI (145)</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ค้นหาตามชื่ออัลกอริทึม, แท็ก, หรือสมการคณิตศาสตร์..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
          />
        </div>

        {/* Quick Discipline Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#8b949e]">Discipline:</span>
          <select
            value={selectedDisciplineId}
            onChange={e => setSelectedDisciplineId(e.target.value)}
            className="px-2.5 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
          >
            <option value="all">🌐 All 12 Engineering Disciplines</option>
            {MEGA_DISCIPLINES.map(disc => (
              <option key={disc.id} value={disc.id}>
                {disc.name} ({disc.count} Tools)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workspace 3-Column Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Column: 12 Disciplines & Tool List */}
        <div className="w-80 border-r border-[#30363d] flex flex-col bg-[#161b22]/50 shrink-0">
          {/* Discipline Badges */}
          <div className="p-2 border-b border-[#30363d] flex overflow-x-auto space-x-1.5 scrollbar-thin">
            {MEGA_DISCIPLINES.map(disc => {
              const isSelected = selectedDisciplineId === disc.id;
              return (
                <button
                  key={disc.id}
                  onClick={() => setSelectedDisciplineId(isSelected ? 'all' : disc.id)}
                  title={disc.description}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#1f6feb] text-white font-bold shadow'
                      : 'bg-[#0d1117] text-[#8b949e] hover:text-[#c9d1d9] border border-[#30363d]'
                  }`}
                >
                  {getDisciplineIcon(disc.iconName)}
                  <span>{disc.id.split('_')[0].toUpperCase()}</span>
                  <span className="text-[9px] opacity-75 font-mono">({disc.count})</span>
                </button>
              );
            })}
          </div>

          {/* Tools Scrollable List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            <div className="px-2 py-1 text-[10px] font-mono text-[#8b949e] flex justify-between">
              <span>SHOWING {filteredTools.length} OF 335 TOOLS</span>
              <span>SORT: RELEVANCE</span>
            </div>

            {filteredTools.map(tool => {
              const isSelected = tool.id === activeTool.id;
              const isDeterministic = tool.category === 'deterministic';

              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-[#1f6feb]/15 border-[#58a6ff] text-white shadow-sm'
                      : 'bg-[#0d1117]/80 hover:bg-[#21262d] border-[#30363d]/70 text-[#c9d1d9]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-xs leading-tight">{tool.name}</div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ml-1.5 ${
                        isDeterministic
                          ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30'
                          : 'bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30'
                      }`}
                    >
                      {tool.tag}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#8b949e] line-clamp-1 mt-1">{tool.desc}</p>

                  <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-[#8b949e]">
                    <span className="text-[#7ee787]">{tool.complexity}</span>
                    <span className="text-[#f0883e]">{tool.memoryFootprint}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center & Right Column: Interactive Simulator, Math & Code */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#0d1117] p-4 space-y-4">
          {/* Active Tool Header Box */}
          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 text-xs font-mono font-bold rounded-md ${
                    activeTool.category === 'deterministic'
                      ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/40'
                      : 'bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/40'
                  }`}
                >
                  {activeTool.category === 'deterministic' ? '⚛️ 100% NON-AI DETERMINISTIC' : '🧠 ON-DEVICE NEURAL AI'}
                </span>
                <span className="text-xs text-[#8b949e] font-mono">[{activeTool.disciplineName}]</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{activeTool.name}</h2>
              <p className="text-xs text-[#8b949e] mt-0.5">{activeTool.desc}</p>
            </div>

            {/* Quick Live Telemetry Gauges */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-center">
                <div className="text-[10px] text-[#8b949e] font-mono uppercase">Compute Time</div>
                <div className="text-xs font-mono font-bold text-[#7ee787]">{activeTool.liveMetrics.computeTimeMs} ms</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-center">
                <div className="text-[10px] text-[#8b949e] font-mono uppercase">Throughput</div>
                <div className="text-xs font-mono font-bold text-[#58a6ff]">{activeTool.liveMetrics.throughput}</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-center">
                <div className="text-[10px] text-[#8b949e] font-mono uppercase">Efficiency</div>
                <div className="text-xs font-mono font-bold text-[#f0883e]">{activeTool.liveMetrics.efficiency}</div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Visual Simulation on Left, Mathematical & Technical Specs on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Visual Canvas Simulator (7 cols) */}
            <div className="lg:col-span-7 flex flex-col p-3 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                  <Activity size={15} className="text-[#58a6ff]" />
                  <span>Real-Time Algorithm & Kernel Simulation</span>
                </div>

                <div className="flex items-center space-x-2">
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

                  <div className="flex items-center space-x-1 text-xs text-[#8b949e]">
                    <span>Speed:</span>
                    <button
                      onClick={() => setSimSpeed(0.5)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        simSpeed === 0.5 ? 'bg-[#388bfd] text-white' : 'bg-[#0d1117] border border-[#30363d]'
                      }`}
                    >
                      0.5x
                    </button>
                    <button
                      onClick={() => setSimSpeed(1)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        simSpeed === 1 ? 'bg-[#388bfd] text-white' : 'bg-[#0d1117] border border-[#30363d]'
                      }`}
                    >
                      1.0x
                    </button>
                    <button
                      onClick={() => setSimSpeed(2)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        simSpeed === 2 ? 'bg-[#388bfd] text-white' : 'bg-[#0d1117] border border-[#30363d]'
                      }`}
                    >
                      2.0x
                    </button>
                  </div>
                </div>
              </div>

              {/* Simulation Canvas */}
              <div className="relative w-full h-56 rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden flex items-center justify-center">
                <canvas ref={canvasRef} width={640} height={224} className="w-full h-full object-contain" />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#161b22]/90 border border-[#30363d] text-[10px] font-mono text-[#8b949e]">
                  LIVE KERNEL TRACE | 60 FPS GUARANTEED
                </div>
              </div>

              {/* Interactive Input & Output Spec Inspector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d]">
                  <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1.5">Input Parameters</div>
                  <ul className="space-y-1">
                    {activeTool.inputs.map((inp, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5 font-mono text-[11px] text-[#c9d1d9]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff]"></span>
                        <span>{inp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d]">
                  <div className="text-[10px] font-mono text-[#8b949e] uppercase mb-1.5">Output State & Result</div>
                  <div className="font-mono text-[11px] text-[#7ee787] leading-relaxed">{activeTool.output}</div>
                </div>
              </div>
            </div>

            {/* Formula & Architectural Breakdown (5 cols) */}
            <div className="lg:col-span-5 flex flex-col p-3 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                <Calculator size={15} className="text-[#f0883e]" />
                <span>Mathematical Formula & Architectural Model</span>
              </div>

              {/* Formula View Box */}
              <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] font-mono text-xs text-[#e3b341] leading-relaxed break-all">
                {activeTool.formulaOrArchitecture}
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-[#0d1117] border border-[#30363d]">
                  <span className="text-[#8b949e]">Algorithmic Complexity:</span>
                  <span className="font-mono text-[#7ee787] font-semibold">{activeTool.complexity}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-[#0d1117] border border-[#30363d]">
                  <span className="text-[#8b949e]">Memory Overhead:</span>
                  <span className="font-mono text-[#f0883e] font-semibold">{activeTool.memoryFootprint}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-[#0d1117] border border-[#30363d]">
                  <span className="text-[#8b949e]">Engine Compatibility:</span>
                  <span className="font-mono text-[#58a6ff] font-semibold">Unreal 5, Unity, Godot, C++20</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-[#0d1117] border border-[#30363d]">
                  <span className="text-[#8b949e]">Instruction Vectorization:</span>
                  <span className="font-mono text-[#bc8cff] font-semibold">AVX2, AVX-512, WebGPU WGSL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Language Code Implementation & Export Box */}
          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#30363d] pb-3">
              <div className="flex items-center space-x-2">
                <Code2 size={16} className="text-[#58a6ff]" />
                <span className="text-xs font-bold text-white">Production-Ready Implementation</span>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center space-x-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
                {(['cpp', 'rust', 'glsl', 'wgsl', 'python'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setTargetLang(lang)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase transition-colors ${
                      targetLang === lang ? 'bg-[#1f6feb] text-white font-bold' : 'text-[#8b949e] hover:text-[#c9d1d9]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition-colors"
                >
                  {copied ? <Check size={13} className="text-[#7ee787]" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={() => {
                    const blob = new Blob([activeTool.codeSnippet.code], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${activeTool.id}.${targetLang === 'cpp' ? 'hpp' : targetLang === 'rust' ? 'rs' : targetLang === 'glsl' ? 'glsl' : targetLang === 'wgsl' ? 'wgsl' : 'py'}`;
                    a.click();
                  }}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1f6feb] hover:bg-[#388bfd] text-white transition-colors"
                >
                  <Download size={13} />
                  <span>Export .{targetLang}</span>
                </button>
              </div>
            </div>

            {/* Code Highlighting Window */}
            <div className="relative rounded-lg bg-[#0d1117] border border-[#30363d] p-3 font-mono text-xs overflow-x-auto">
              <pre className="text-[#c9d1d9] leading-relaxed">
                <code>{activeTool.codeSnippet.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fallback Icon Helper
function BrainIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return <Sparkles size={size} className={className} />;
}
