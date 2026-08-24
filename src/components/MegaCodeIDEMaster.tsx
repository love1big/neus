import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Code2,
  Terminal,
  Search,
  Check,
  Copy,
  Download,
  Play,
  Pause,
  Activity,
  Cpu,
  Layers,
  FileCode,
  Zap,
  HardDrive
} from 'lucide-react';
import { IDE_CODE_TOOLS_100, IdeToolItem } from '../data/ideCodeToolsData';

export default function MegaCodeIDEMaster() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedToolId, setSelectedToolId] = useState<string>(IDE_CODE_TOOLS_100[0].id);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const subCategories = useMemo(() => {
    const set = new Set<string>();
    IDE_CODE_TOOLS_100.forEach(t => set.add(t.subCategory));
    return Array.from(set);
  }, []);

  const filteredTools = useMemo(() => {
    return IDE_CODE_TOOLS_100.filter(tool => {
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
    return IDE_CODE_TOOLS_100.find(t => t.id === selectedToolId) || filteredTools[0] || IDE_CODE_TOOLS_100[0];
  }, [selectedToolId, filteredTools]);

  const handleCopy = () => {
    if (!activeTool) return;
    const text = `// IDE Tool: ${activeTool.name}\n// SubCategory: ${activeTool.subCategory}\n// Complexity: ${activeTool.complexity}\n// Formula: ${activeTool.formula}\n// Inputs: ${activeTool.inputs.join(', ')}\n// Output: ${activeTool.output}\n// Specs: ${activeTool.specs}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Real-time AST Tree and Instruction Flow Graph canvas
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

      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, w, h);

      // Draw Tree Hierarchy (Root -> Children -> Leaves)
      const nodes = [
        { id: 'root', label: 'TranslationUnit', x: w / 2, y: 30, color: '#bc8cff' },
        { id: 'func1', label: 'FunctionDecl: render()', x: w / 4, y: 80, color: '#58a6ff' },
        { id: 'func2', label: 'FunctionDecl: compute()', x: (3 * w) / 4, y: 80, color: '#58a6ff' },
        { id: 'body1', label: 'CompoundStmt', x: w / 6, y: 140, color: '#7ee787' },
        { id: 'call1', label: 'CallExpr: AVX2_MatMul', x: (2 * w) / 6, y: 140, color: '#e3b341' },
        { id: 'loop1', label: 'ForStmt (Vectorized)', x: (4 * w) / 6, y: 140, color: '#7ee787' },
        { id: 'ret1', label: 'ReturnStmt', x: (5 * w) / 6, y: 140, color: '#ff7b72' }
      ];

      const edges = [
        [0, 1], [0, 2],
        [1, 3], [1, 4],
        [2, 5], [2, 6]
      ];

      // Draw Edges with animated data pulse
      edges.forEach(([pIdx, cIdx], eIdx) => {
        const parent = nodes[pIdx];
        const child = nodes[cIdx];

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(parent.x, parent.y);
        ctx.lineTo(child.x, child.y);
        ctx.stroke();

        // Pulsing token travelling
        const t = (step * 0.8 + eIdx * 0.3) % 1;
        const tx = parent.x + (child.x - parent.x) * t;
        const ty = parent.y + (child.y - parent.y) * t;
        ctx.fillStyle = '#58a6ff';
        ctx.beginPath();
        ctx.arc(tx, ty, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Nodes
      nodes.forEach(n => {
        ctx.fillStyle = '#161b22';
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 1.5;
        const nodeW = 120;
        const nodeH = 24;
        ctx.fillRect(n.x - nodeW / 2, n.y - nodeH / 2, nodeW, nodeH);
        ctx.strokeRect(n.x - nodeW / 2, n.y - nodeH / 2, nodeW, nodeH);

        ctx.fillStyle = '#c9d1d9';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, n.y);
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
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#1f6feb]/20 to-[#e3b341]/20 border border-[#e3b341]/30 text-[#e3b341]">
            <Code2 size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                100x Code Management, AST, LLVM & Static Analysis Studio
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/40 rounded-full">
                100 IDE TOOLS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40 rounded-full">
                100% NON-AI DETERMINISTIC
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e]">
              ชุดเครื่องมือจัดการโค้ด: AST Rewriter, LLVM SSA Passes, Thread Race Sanitizer, SIMD Auto-vectorizer และ Disassembler 100 ชนิด
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const allSpecs = IDE_CODE_TOOLS_100.map(
              t => `// [${t.subCategory}] ${t.name}\n// Formula: ${t.formula}\n// Specs: ${t.specs}\n`
            ).join('\n');
            const blob = new Blob([allSpecs], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MegaIDECode_100_Tools_Spec.txt`;
            a.click();
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] text-white transition-colors"
        >
          <Download size={13} />
          <span>Export All 100 IDE Tools</span>
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
            placeholder="ค้นหาใน 100 เครื่องมือจัดการโค้ด..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#e3b341]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#8b949e]">Subcategory:</span>
          <select
            value={selectedSubCategory}
            onChange={e => setSelectedSubCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] focus:outline-none focus:border-[#e3b341]"
          >
            <option value="all">🌐 All Subcategories ({IDE_CODE_TOOLS_100.length})</option>
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
            <span>LLVM / CLANG AST SPEC</span>
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
                      ? 'bg-[#e3b341]/15 border-[#e3b341] text-white shadow-sm'
                      : 'bg-[#0d1117]/80 hover:bg-[#21262d] border-[#30363d]/70 text-[#c9d1d9]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-xs leading-tight">{tool.name}</div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/30 shrink-0 ml-1.5">
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
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/40">
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
                  <Activity size={15} className="text-[#e3b341]" />
                  <span>Real-Time AST Dependency & Control Flow Visualizer</span>
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
                  ABSTRACT SYNTAX TREE (AST) GRAPH | CFG DATA TRACE
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col p-3 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
              <div className="text-xs font-semibold text-white">Grammar / Algorithm Formulation</div>

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
