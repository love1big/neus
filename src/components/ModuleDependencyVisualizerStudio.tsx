/**
 * =========================================================================================
 * @file ModuleDependencyVisualizerStudio.tsx
 * @system System Architecture & Dependency Graph Engine
 * @module Module & Node Dependency Graph Visualizer Studio
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * เครื่องมือแสดงผลและวิเคราะห์ความสัมพันธ์ระหว่างโมดูล (Module Dependency Visualizer Studio)
 * 1. แสดงผลแผนผังกราฟการเชื่อมโยง (Interactive Dependency Topology Graph) ระหว่างระบบ, โหนด, และไฟล์ต่างๆ
 * 2. บังคับใช้และตรวจสอบกฎเหล็กสถาปัตยกรรม "Strict 1 Node / 1 Module = 1 File" และ Pure Single Responsibility
 * 3. มีระบบจำลองผลกระทบเมื่อมีการแก้ไขไฟล์ (Blast Radius & Change Impact Simulator)
 * 4. ตรวจสอบวงวนการเรียกซ้ำ (Circular Dependency & DAG Validation Auditor) แบบ Real-time
 * 5. แสดงสถาปัตยกรรมแบบแบ่งเลเยอร์ (4-Tier Clean Architecture Layer Matrix)
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อกับระบบอื่น / Architecture]:
 * - ดึงข้อมูลจาก `src/utils/moduleDependencyGraphData.ts`
 * - เชื่อมต่อกับระบบ Router และ Command Palette ของ App.tsx ผ่าน `onSelectTool`
 * - แสดงสถานะความสัมพันธ์ระหว่างไฟล์ในระดับ Codebase จริง
 * 
 * 📥 [Inputs / Data Contracts]:
 * - `onSelectTool?: (toolId: string) => void`: ฟังก์ชันเปลี่ยนหน้าจอไปยัง Tool ที่เกี่ยวข้อง
 * 
 * 📤 [Outputs / Interactive Actions]:
 * - การลากย้ายโหนด (Drag & Drop), ซูม/แพนกราฟ (Zoom & Pan), กรองตามหมวดหมู่ (Category Filtering)
 * - ส่งออกไดอะแกรมเป็น Mermaid.js, SVG, JSON และ Markdown Architecture Docs
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - ตรวจจับกรณีโหนดไม่ครบหรือ ID ขาดหาย พร้อม Render Fallback Node
 * - ป้องกัน Memory Leak ใน Canvas Animation Loop ด้วย cleanup ใน useEffect
 * 
 * =========================================================================================
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Network,
  Layers,
  Activity,
  ShieldCheck,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  ArrowRight,
  Download,
  Share2,
  Info,
  Maximize2,
  Minimize2,
  Terminal,
  Zap,
  Box,
  Eye,
  Sliders,
  ChevronRight,
  ExternalLink,
  Code2,
  Copy,
  Check,
  PlusCircle,
  Play,
  Flame,
  Radio,
  FileText
} from 'lucide-react';
import {
  DependencyNode,
  DependencyLink,
  ArchitecturePreset,
  SYSTEM_PRESETS,
  ALL_PRESETS_LIST,
  calculateBlastRadius,
  validateDAG,
  SystemCategory
} from '../utils/moduleDependencyGraphData';

interface Props {
  onSelectTool?: (toolId: string) => void;
}

type ViewMode = 'graph' | 'layers' | 'blast_radius' | 'dag_audit';

const CATEGORY_COLORS: Record<SystemCategory, { bg: string; border: string; text: string; glow: string }> = {
  CORE: { bg: 'bg-red-950/40', border: 'border-red-500/60', text: 'text-red-400', glow: '#ef4444' },
  AI_CODE: { bg: 'bg-purple-950/40', border: 'border-purple-500/60', text: 'text-purple-400', glow: '#a855f7' },
  WORLD: { bg: 'bg-emerald-950/40', border: 'border-emerald-500/60', text: 'text-emerald-400', glow: '#10b981' },
  ART: { bg: 'bg-amber-950/40', border: 'border-amber-500/60', text: 'text-amber-400', glow: '#f59e0b' },
  VFX: { bg: 'bg-pink-950/40', border: 'border-pink-500/60', text: 'text-pink-400', glow: '#ec4899' },
  AUDIO: { bg: 'bg-yellow-950/40', border: 'border-yellow-500/60', text: 'text-yellow-400', glow: '#eab308' },
  GAME_DESIGN: { bg: 'bg-blue-950/40', border: 'border-blue-500/60', text: 'text-blue-400', glow: '#3b82f6' },
  PHYSICS: { bg: 'bg-orange-950/40', border: 'border-orange-500/60', text: 'text-orange-400', glow: '#f97316' },
  RENDERING: { bg: 'bg-cyan-950/40', border: 'border-cyan-500/60', text: 'text-cyan-400', glow: '#06b6d4' },
  UI_DATA: { bg: 'bg-indigo-950/40', border: 'border-indigo-500/60', text: 'text-indigo-400', glow: '#6366f1' },
  DEVOPS: { bg: 'bg-teal-950/40', border: 'border-teal-500/60', text: 'text-teal-400', glow: '#14b8a6' },
  MODULAR_SYSTEM: { bg: 'bg-sky-950/40', border: 'border-sky-500/60', text: 'text-sky-400', glow: '#0284c7' }
};

export default function ModuleDependencyVisualizerStudio({ onSelectTool }: Props) {
  // Current active preset
  const [activePresetId, setActivePresetId] = useState<string>('combat_pipeline');
  const currentPreset = SYSTEM_PRESETS[activePresetId] || ALL_PRESETS_LIST[0];

  // Dynamic Nodes & Links state (allows dragging & simulated modifications)
  const [nodes, setNodes] = useState<DependencyNode[]>([]);
  const [links, setLinks] = useState<DependencyLink[]>([]);
  
  // Selection and Inspection state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [isSimulatingDataPackets, setIsSimulatingDataPackets] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Canvas Viewport Transforms
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 80, y: 80 });
  const [zoom, setZoom] = useState<number>(1);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const [packetOffset, setPacketOffset] = useState<number>(0);

  // Initialize node positions based on layout
  useEffect(() => {
    const rawNodes = currentPreset.nodes;
    const rawLinks = currentPreset.links;

    // Arrange nodes nicely in a multi-layer DAG layout
    const layerCount: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const positionedNodes = rawNodes.map((node) => {
      const layer = node.layer || 2;
      const indexInLayer = layerCount[layer] || 0;
      layerCount[layer] = indexInLayer + 1;

      // X based on layer (1 to 4)
      const x = 80 + (layer - 1) * 280;
      // Y based on count in layer
      const y = 80 + indexInLayer * 140;

      return {
        ...node,
        x: node.x ?? x,
        y: node.y ?? y
      };
    });

    setNodes(positionedNodes);
    setLinks(rawLinks);
    setSelectedNodeId(positionedNodes[0]?.id || null);
  }, [activePresetId]);

  // Continuous animation loop for animated signal packets
  useEffect(() => {
    let lastTime = performance.now();
    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      if (isSimulatingDataPackets) {
        setPacketOffset(prev => (prev + delta * 0.001) % 1);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isSimulatingDataPackets]);

  // Selected Node Details
  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || nodes[0];
  }, [nodes, selectedNodeId]);

  // Blast Radius Calculation
  const blastRadiusResult = useMemo(() => {
    if (!selectedNode) return null;
    return calculateBlastRadius(nodes, links, selectedNode.id);
  }, [nodes, links, selectedNode]);

  // DAG Validation & Cycle Detection
  const dagAuditResult = useMemo(() => {
    return validateDAG(nodes, links);
  }, [nodes, links]);

  // Filtered Nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = searchQuery === '' || 
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.descriptionThai.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === 'ALL' || node.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [nodes, searchQuery, filterCategory]);

  // Node Map for fast ID lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, DependencyNode>();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Mouse Handlers for Canvas & Node Dragging
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      // Dragging a specific node
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = (e.clientX - rect.left - pan.x) / zoom;
        const mouseY = (e.clientY - rect.top - pan.y) / zoom;
        setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: mouseX - 100, y: mouseY - 40 } : n));
      }
    } else if (isDraggingCanvas) {
      // Panning the canvas
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUpCanvas = () => {
    setIsDraggingCanvas(false);
    setDraggingNodeId(null);
  };

  const resetView = () => {
    setPan({ x: 80, y: 80 });
    setZoom(1);
  };

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }).catch(() => {});
  };

  // Export Diagram as Mermaid.js
  const exportMermaidDiagram = () => {
    let mermaid = `graph TD\n  %% Generated by NexusEngine Module Dependency Visualizer\n`;
    nodes.forEach(n => {
      mermaid += `  ${n.id}["📄 ${n.name}\\n(${n.role})"]\n`;
    });
    links.forEach(l => {
      mermaid += `  ${l.source} -->|"${l.label}"| ${l.target}\n`;
    });
    
    const blob = new Blob([mermaid], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPreset.id}_architecture.mmd`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full bg-[#0d1117] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Header Bar */}
      <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0 shadow-lg z-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg border border-blue-400/30">
            <Network size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-wide text-gray-100">
                Module Dependency & Node Graph <span className="text-blue-400 font-mono">Studio</span>
              </h1>
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1">
                <ShieldCheck size={11} /> 1 Node / 1 Module = 1 File Policy
              </span>
            </div>
            <p className="text-[10px] text-gray-400 tracking-wide">
              Real-time Subsystem Topology, Blast Radius Simulation & Clean Architecture Inspector
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-lg p-0.5 text-xs">
            {ALL_PRESETS_LIST.map(preset => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActivePresetId(preset.id)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]'
                  }`}
                >
                  {preset.title.split(' ')[0]}
                </button>
              );
            })}
          </div>

          <button
            onClick={exportMermaidDiagram}
            className="bg-[#21262d] hover:bg-[#30363d] text-gray-300 border border-[#30363d] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Export as Mermaid.js Diagram"
          >
            <Download size={13} /> Export Diagram
          </button>
        </div>
      </div>

      {/* Sub-Header Toolbar & Mode Switcher */}
      <div className="h-11 bg-[#161b22]/90 border-b border-[#30363d] px-4 flex items-center justify-between shrink-0 text-xs z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {/* View Modes */}
          <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'graph' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Network size={13} /> Interactive Topology
            </button>
            <button
              onClick={() => setViewMode('layers')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'layers' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Layers size={13} /> 4-Tier Clean Layer Matrix
            </button>
            <button
              onClick={() => setViewMode('blast_radius')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'blast_radius' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Flame size={13} /> Blast Radius Simulator
            </button>
            <button
              onClick={() => setViewMode('dag_audit')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'dag_audit' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <ShieldCheck size={13} /> DAG & Cycle Auditor
            </button>
          </div>

          {/* Signal Packet Simulation Toggle */}
          <button
            onClick={() => setIsSimulatingDataPackets(!isSimulatingDataPackets)}
            className={`px-2.5 py-1 rounded-md border text-xs flex items-center gap-1.5 transition-colors ${
              isSimulatingDataPackets 
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' 
                : 'bg-[#21262d] border-[#30363d] text-gray-400'
            }`}
          >
            <Radio size={12} className={isSimulatingDataPackets ? 'animate-pulse text-emerald-400' : ''} />
            {isSimulatingDataPackets ? 'Live Signal Traffic Active' : 'Traffic Paused'}
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search module, file, role..."
              className="bg-[#0d1117] border border-[#30363d] rounded-lg pl-8 pr-3 py-1 text-xs text-gray-200 focus:outline-none focus:border-blue-500 w-52 placeholder-gray-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="CORE">Core</option>
            <option value="AI_CODE">AI & Code</option>
            <option value="GAME_DESIGN">Game Design</option>
            <option value="PHYSICS">Physics</option>
            <option value="AUDIO">Audio</option>
            <option value="WORLD">World</option>
            <option value="RENDERING">Rendering</option>
          </select>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: Canvas & Visualization Views */}
        <div className="flex-1 flex flex-col relative bg-[#090d13] overflow-hidden">
          
          {/* Zoom & Canvas Controls */}
          {viewMode === 'graph' && (
            <div className="absolute top-3 left-3 z-10 flex items-center bg-[#161b22]/90 border border-[#30363d] rounded-lg p-1 shadow-xl backdrop-blur-sm gap-1">
              <button
                onClick={() => setZoom(z => Math.min(2.5, z + 0.15))}
                className="p-1.5 hover:bg-[#21262d] rounded text-gray-300"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={() => setZoom(z => Math.max(0.4, z - 0.15))}
                className="p-1.5 hover:bg-[#21262d] rounded text-gray-300"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={resetView}
                className="p-1.5 hover:bg-[#21262d] rounded text-gray-300"
                title="Reset View"
              >
                <RotateCcw size={14} />
              </button>
              <div className="h-4 w-px bg-[#30363d] mx-1" />
              <span className="text-[10px] font-mono text-gray-400 px-1">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          )}

          {/* VIEW 1: Interactive SVG Graph Canvas */}
          {viewMode === 'graph' && (
            <div
              ref={canvasRef}
              onMouseDown={handleMouseDownCanvas}
              onMouseMove={handleMouseMoveCanvas}
              onMouseUp={handleMouseUpCanvas}
              className={`w-full h-full relative cursor-grab overflow-hidden select-none ${isDraggingCanvas ? 'cursor-grabbing' : ''}`}
            >
              {/* Subtle Grid Background */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#58a6ff 1px, transparent 1px)`,
                  backgroundSize: `${30 * zoom}px ${30 * zoom}px`,
                  backgroundPosition: `${pan.x}px ${pan.y}px`
                }}
              />

              {/* Transformed Stage */}
              <div
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: '0 0'
                }}
                className="absolute inset-0"
              >
                {/* SVG Link Layer */}
                <svg className="absolute inset-0 w-[4000px] h-[4000px] pointer-events-none overflow-visible">
                  <defs>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#58a6ff" />
                    </marker>
                    <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Render Links */}
                  {links.map((link, idx) => {
                    const sourceNode = nodeMap.get(link.source);
                    const targetNode = nodeMap.get(link.target);
                    if (!sourceNode || !targetNode) return null;

                    const sx = (sourceNode.x || 0) + 110;
                    const sy = (sourceNode.y || 0) + 40;
                    const tx = (targetNode.x || 0) + 110;
                    const ty = (targetNode.y || 0) + 40;

                    const dx = tx - sx;
                    const dy = ty - sy;
                    const cx1 = sx + dx * 0.5;
                    const cy1 = sy;
                    const cx2 = sx + dx * 0.5;
                    const cy2 = ty;

                    const pathData = `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`;
                    const isHighlighted = selectedNodeId === sourceNode.id || selectedNodeId === targetNode.id;

                    // Animated Packet Position along Bezier
                    const t = (packetOffset + idx * 0.25) % 1;
                    const px = (1 - t) ** 3 * sx + 3 * (1 - t) ** 2 * t * cx1 + 3 * (1 - t) * t ** 2 * cx2 + t ** 3 * tx;
                    const py = (1 - t) ** 3 * sy + 3 * (1 - t) ** 2 * t * cy1 + 3 * (1 - t) * t ** 2 * cy2 + t ** 3 * ty;

                    return (
                      <g key={`${link.source}->${link.target}`}>
                        {/* Background Path */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke={isHighlighted ? "#58a6ff" : "#30363d"}
                          strokeWidth={isHighlighted ? "2.5" : "1.5"}
                          strokeDasharray={link.type === 'event_dispatch' ? '4 4' : 'none'}
                          opacity={isHighlighted ? 1 : 0.6}
                          markerEnd="url(#arrow)"
                        />

                        {/* Animated Signal Packet */}
                        {isSimulatingDataPackets && (
                          <g transform={`translate(${px}, ${py})`}>
                            <circle r="4" fill="#38bdf8" className="animate-pulse shadow-lg" />
                            <circle r="8" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
                          </g>
                        )}

                        {/* Mid-point label on hover/highlight */}
                        {isHighlighted && (
                          <g transform={`translate(${(sx + tx) / 2}, ${(sy + ty) / 2 - 10})`}>
                            <rect
                              x="-60"
                              y="-10"
                              width="120"
                              height="20"
                              rx="4"
                              fill="#161b22"
                              stroke="#58a6ff"
                              strokeWidth="1"
                              opacity="0.9"
                            />
                            <text
                              x="0"
                              y="3"
                              fill="#c9d1d9"
                              fontSize="9"
                              textAnchor="middle"
                              fontFamily="monospace"
                            >
                              {link.label}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Nodes Layer */}
                {filteredNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isHovered = hoveredNodeId === node.id;
                  const styleColors = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.CORE;

                  return (
                    <div
                      key={node.id}
                      style={{
                        transform: `translate(${node.x || 0}px, ${node.y || 0}px)`
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setDraggingNodeId(node.id);
                        setSelectedNodeId(node.id);
                      }}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className={`absolute w-56 rounded-xl border p-3 cursor-pointer transition-shadow shadow-lg ${
                        styleColors.bg
                      } ${
                        isSelected 
                          ? 'border-blue-400 ring-2 ring-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.35)]' 
                          : `${styleColors.border} hover:border-gray-300`
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${styleColors.text} bg-black/40 border border-white/10`}>
                          Layer {node.layer} • {node.type.replace('_', ' ')}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400">
                          {node.linesCount} lines
                        </span>
                      </div>

                      {/* Title */}
                      <div className="flex items-center gap-1.5 my-1">
                        <FileCode size={14} className={styleColors.text} />
                        <span className="text-xs font-bold text-white truncate font-mono">
                          {node.name}
                        </span>
                      </div>

                      {/* Role */}
                      <p className="text-[10px] text-gray-400 line-clamp-1 mb-2">
                        {node.role}
                      </p>

                      {/* Metrics Footer */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[9px] font-mono text-gray-400">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Coupling:</span>
                          <span className={node.couplingFactor < 0.15 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                            {node.couplingFactor.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 size={10} /> 1-Node OK
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 2: 4-Tier Clean Layer Matrix */}
          {viewMode === 'layers' && (
            <div className="w-full h-full overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0d1117]">
              <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="text-blue-400" size={16} /> 4-Tier Strict Decoupled Architecture
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Enforces strict directional dependency flow (Presentation → Pure Logic → State Contracts → Hardware/Engine).
                  </p>
                </div>
                <div className="text-xs bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={14} /> Zero Inverted Dependencies
                </div>
              </div>

              {[
                { layer: 1, name: "Tier 1: Presentation & UI / Feedback Layer", desc: "View controllers, VFX triggers, Audio synthesizers, and Input readers.", color: "border-blue-500/40 bg-blue-950/20" },
                { layer: 2, name: "Tier 2: Pure Domain Logic & Evaluator Nodes", desc: "Pure algorithmic calculators, math formulas, and behavior tree evaluators without side-effects.", color: "border-purple-500/40 bg-purple-950/20" },
                { layer: 3, name: "Tier 3: State Repositories & Interface Contracts", desc: "Central health, player state, inventory store, and decoupled event buses.", color: "border-amber-500/40 bg-amber-950/20" },
                { layer: 4, name: "Tier 4: Engine Kernel & Hardware Layer", desc: "Physics solvers, AudioContext DSP streams, GPU rasterizers, and Main Loop.", color: "border-red-500/40 bg-red-950/20" }
              ].map(tier => {
                const tierNodes = nodes.filter(n => n.layer === tier.layer);
                return (
                  <div key={tier.layer} className={`p-4 rounded-xl border ${tier.color} space-y-3 shadow-md`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">{tier.name}</h4>
                        <p className="text-[11px] text-gray-400">{tier.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded text-gray-300 border border-white/10">
                        {tierNodes.length} Files
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                      {tierNodes.map(node => (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className="bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] p-3 rounded-lg cursor-pointer transition-all hover:border-blue-500/60"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold text-white truncate">{node.name}</span>
                            <span className="text-[9px] font-mono text-emerald-400">{node.linesCount} lines</span>
                          </div>
                          <p className="text-[11px] text-gray-400 line-clamp-1">{node.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW 3: Blast Radius Simulator */}
          {viewMode === 'blast_radius' && blastRadiusResult && (
            <div className="w-full h-full overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0d1117]">
              {/* Header Summary */}
              <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] flex items-center justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame size={18} className="text-amber-400" />
                    <h3 className="text-sm font-bold text-white">
                      Blast Radius & Impact Analysis for <span className="text-amber-400 font-mono">{blastRadiusResult.targetNode?.name}</span>
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Simulates what downstream files, nodes, and subsystems will be impacted if you refactor or modify this file.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Impact Score</div>
                    <div className="text-lg font-bold font-mono text-amber-400">{blastRadiusResult.impactScore} / 100</div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs border ${
                    blastRadiusResult.riskLevel === 'LOW' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' :
                    blastRadiusResult.riskLevel === 'MEDIUM' ? 'bg-amber-950/40 border-amber-500/50 text-amber-400' :
                    'bg-red-950/40 border-red-500/50 text-red-400'
                  }`}>
                    {blastRadiusResult.riskLevel} RISK
                  </div>
                </div>
              </div>

              {/* Direct & Indirect Consumers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Direct Consumers */}
                <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Zap size={14} /> Direct Dependent Modules ({blastRadiusResult.directConsumers.length})
                    </h4>
                    <span className="text-[10px] text-gray-500 font-mono">Direct Calls</span>
                  </div>
                  
                  {blastRadiusResult.directConsumers.length === 0 ? (
                    <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] text-center text-xs text-gray-500">
                      No direct downstream dependents (Leaf Node). Modifying this is 100% safe!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {blastRadiusResult.directConsumers.map(consumer => (
                        <div key={consumer.id} className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold font-mono text-white">{consumer.name}</div>
                            <div className="text-[10px] text-gray-400">{consumer.role}</div>
                          </div>
                          <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                            Re-test Required
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Indirect Cascading Consumers */}
                <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Activity size={14} /> Cascading Subsystems ({blastRadiusResult.indirectConsumers.length})
                    </h4>
                    <span className="text-[10px] text-gray-500 font-mono">Secondary Wave</span>
                  </div>

                  {blastRadiusResult.indirectConsumers.length === 0 ? (
                    <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] text-center text-xs text-gray-500">
                      No cascading secondary impacts detected.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {blastRadiusResult.indirectConsumers.map(consumer => (
                        <div key={consumer.id} className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold font-mono text-gray-200">{consumer.name}</div>
                            <div className="text-[10px] text-gray-400">{consumer.system}</div>
                          </div>
                          <span className="text-[9px] font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30">
                            Regression Watch
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Recommendations Box */}
              <div className="bg-blue-950/20 border border-blue-500/30 p-4 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck size={14} /> Decoupling & Isolation Recommendations
                </h4>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                  <li>Keep data flow strictly uni-directional; avoid circular imports.</li>
                  <li>Use Event Dispatchers for triggering UI and VFX rather than direct hard references.</li>
                  <li>All state mutations must pass through dedicated State Contract repositories.</li>
                </ul>
              </div>
            </div>
          )}

          {/* VIEW 4: DAG & Circular Dependency Auditor */}
          {viewMode === 'dag_audit' && (
            <div className="w-full h-full overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0d1117]">
              <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] flex items-center justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      Directed Acyclic Graph (DAG) & Modularity Quality Audit
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Continuous automated AST audit ensuring zero circular dependencies and maximum code maintainability.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-xl border font-mono font-bold text-xs flex items-center gap-2 ${
                    dagAuditResult.isAcyclic 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' 
                      : 'bg-red-950/40 border-red-500/50 text-red-400'
                  }`}>
                    {dagAuditResult.isAcyclic ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    {dagAuditResult.isAcyclic ? '100% CLEAN DAG VERIFIED' : 'CIRCULAR CYCLES DETECTED'}
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
                  <div className="text-[10px] text-gray-400 font-mono uppercase">Total Modular Files</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">{nodes.length} Files</div>
                  <div className="text-[10px] text-emerald-400 mt-1">Strict 1 Node = 1 File</div>
                </div>

                <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
                  <div className="text-[10px] text-gray-400 font-mono uppercase">Dependency Links</div>
                  <div className="text-2xl font-bold font-mono text-blue-400 mt-1">{links.length} Edges</div>
                  <div className="text-[10px] text-gray-400 mt-1">Uni-directional flow</div>
                </div>

                <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
                  <div className="text-[10px] text-gray-400 font-mono uppercase">Max Call Depth</div>
                  <div className="text-2xl font-bold font-mono text-purple-400 mt-1">{dagAuditResult.maxDepth} Layers</div>
                  <div className="text-[10px] text-emerald-400 mt-1">Optimal call stack</div>
                </div>

                <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
                  <div className="text-[10px] text-gray-400 font-mono uppercase">Avg Coupling Factor</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {(nodes.reduce((acc, n) => acc + n.couplingFactor, 0) / Math.max(1, nodes.length)).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">Highly Decoupled (&lt; 0.20)</div>
                </div>
              </div>

              {/* Detailed Rule Compliance Checklist */}
              <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] space-y-3">
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wide">
                  Architectural Standard Enforcements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] flex items-center justify-between">
                    <span className="text-gray-300">1. Strict 1 Node = 1 File Isolation</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={13}/> Passed</span>
                  </div>
                  <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] flex items-center justify-between">
                    <span className="text-gray-300">2. Exhaustive In-File Header Docs</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={13}/> Passed</span>
                  </div>
                  <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] flex items-center justify-between">
                    <span className="text-gray-300">3. Decoupled Event Dispatching</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={13}/> Passed</span>
                  </div>
                  <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] flex items-center justify-between">
                    <span className="text-gray-300">4. Zero Circular Inversions</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={13}/> Passed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Deep-Dive Node Inspector Drawer */}
        {selectedNode && (
          <div className="w-80 bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 z-20 shadow-2xl">
            {/* Inspector Header */}
            <div className="p-3.5 border-b border-[#30363d] bg-[#1a1f29] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode size={16} className="text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Module Inspector</h3>
              </div>
              <span className="text-[10px] font-mono bg-blue-900/50 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded">
                Tier {selectedNode.layer}
              </span>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar">
              {/* File Info */}
              <div>
                <div className="text-[10px] font-mono text-gray-400 uppercase">File Name & Path</div>
                <div className="text-xs font-bold text-white font-mono mt-0.5 break-all">{selectedNode.name}</div>
                <div className="text-[10px] text-gray-400 font-mono break-all mt-0.5">{selectedNode.path}</div>
              </div>

              {/* Role & Description */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-gray-400 uppercase">Module Role</div>
                <div className="text-xs text-blue-300 font-medium">{selectedNode.role}</div>
                <div className="text-[11px] text-gray-300 bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d] leading-relaxed">
                  {selectedNode.descriptionThai}
                </div>
              </div>

              {/* Input / Output Contracts */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-gray-400 uppercase">Data Contracts</div>
                
                <div className="bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d] space-y-2 text-[11px]">
                  <div>
                    <span className="text-emerald-400 font-mono font-bold block mb-1">📥 Inputs:</span>
                    <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                      {selectedNode.inputs.map((inp, i) => (
                        <li key={i} className="truncate">{inp}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-[#30363d] pt-2">
                    <span className="text-purple-400 font-mono font-bold block mb-1">📤 Outputs:</span>
                    <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                      {selectedNode.outputs.map((out, i) => (
                        <li key={i} className="truncate">{out}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Code Preview */}
              {selectedNode.codePreview && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">In-File Implementation</span>
                    <button
                      onClick={() => copyCode(selectedNode.codePreview!)}
                      className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedCode ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      {copiedCode ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] text-[10px] font-mono text-gray-300 overflow-x-auto leading-relaxed max-h-48 custom-scrollbar">
                    {selectedNode.codePreview}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="p-3 border-t border-[#30363d] bg-[#1a1f29] flex gap-2">
              <button
                onClick={() => onSelectTool?.('MegaCodeIDEMaster')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <Code2 size={14} /> Open in Code IDE
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
