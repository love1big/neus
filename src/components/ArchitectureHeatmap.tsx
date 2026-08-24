/**
 * =========================================================================================
 * @file ArchitectureHeatmap.tsx
 * @system System Architecture & Codebase Telemetry Engine
 * @module Architecture Heatmap & Code Churn Hotspot Studio
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * เครื่องมือแสดงผลแผนที่ความร้อนของสถาปัตยกรรมระบบ (Architecture Heatmap & Code Churn Visualizer)
 * 1. แสดงผลแผนที่ความร้อน (Interactive Thermal Matrix & Treemap) ตามความถี่ในการแก้ไขไฟล์ (Churn Rate)
 * 2. ระบุจุดความร้อนวิกฤต (Hotspots & Technical Debt) ที่เสี่ยงต่อการเกิด Bug สูง เพื่อจัดลำดับความสำคัญในการ Refactor
 * 3. วิเคราะห์เชิง 2 มิติ (2D Refactoring Priority Quadrant: Churn vs Cyclomatic Complexity)
 * 4. นำเสนอแผนการแยกไฟล์อัจฉริยะ (1 Node = 1 File Decomposition Prescription) ตามกฎเหล็ก AGENTS.md
 * 5. จำลองความถี่การ Commit และแก้ไขไฟล์ของทีมแบบ Real-time (Live Team Commit Simulation)
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น / Architecture & System Integration]:
 * - ดึงข้อมูลสถิติจาก `src/utils/architectureHeatmapData.ts`
 * - เชื่อมต่อกับระบบ Router และ Command Palette ของ `App.tsx` ผ่าน `onSelectTool`
 * - ทำงานสอดประสานกับ `ModuleDependencyVisualizerStudio.tsx` และ `MegaCodeIDEMaster.tsx`
 * 
 * 📥 [Inputs / Data Contracts]:
 * - `onSelectTool?: (toolId: string) => void`: ฟังก์ชันนำทางไปยัง Tool อื่นๆ ในเอนจิน
 * 
 * 📤 [Outputs / Interactive Actions]:
 * - การเลือกและวิเคราะห์ไฟล์แต่ละตัว (Node Telemetry Inspection)
 * - การจำลอง commit สด (Live Commit Generator)
 * - ส่งออกรายงานหนี้ทางเทคนิค (Export Technical Debt Audit Report)
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - มี Fallback Node ในกรณีที่ค้นหา Node ID ไม่พบ
 * - ระบบคำนวณสเกลสีแบบไดนามิก ป้องกันค่า Infinity หรือ NaN
 * 
 * =========================================================================================
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Flame,
  Activity,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Download,
  Code2,
  FileCode,
  CheckCircle2,
  TrendingUp,
  Zap,
  Clock,
  User,
  GitCommit,
  GitPullRequest,
  BarChart3,
  Sliders,
  ExternalLink,
  ChevronRight,
  Info,
  Play,
  Pause,
  Copy,
  Check,
  Sparkles,
  ArrowUpRight,
  Network
} from 'lucide-react';
import {
  ModuleHeatmapNode,
  HeatmapSystemDataset,
  CommitHistoryRecord,
  PRESET_HEATMAP_DATASETS,
  ALL_HEATMAP_PRESETS,
  calculateHotspotScore,
  getHotspotSeverity,
  determineQuadrant,
  TimeRangeFilter,
  RefactorQuadrant
} from '../utils/architectureHeatmapData';

interface Props {
  onSelectTool?: (toolId: string) => void;
}

type HeatmapViewMode = 'matrix' | 'quadrant' | 'timeline' | 'prescription';
type MetricSizingMode = 'loc' | 'churn' | 'modifications' | 'complexity';

export default function ArchitectureHeatmap({ onSelectTool }: Props) {
  // Active Dataset
  const [activeDatasetId, setActiveDatasetId] = useState<string>('action_rpg_engine');
  const currentDataset = PRESET_HEATMAP_DATASETS[activeDatasetId] || ALL_HEATMAP_PRESETS[0];

  // Dynamic Nodes & Commits state (allows live simulation)
  const [nodes, setNodes] = useState<ModuleHeatmapNode[]>([]);
  const [commits, setCommits] = useState<CommitHistoryRecord[]>([]);

  // Selection & Filter State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterQuadrant, setFilterQuadrant] = useState<string>('ALL');
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('30d');
  const [viewMode, setViewMode] = useState<HeatmapViewMode>('matrix');
  const [sizingMode, setSizingMode] = useState<MetricSizingMode>('churn');
  const [isSimulatingLiveCommits, setIsSimulatingLiveCommits] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Initialize dataset
  useEffect(() => {
    setNodes(currentDataset.nodes);
    setCommits(currentDataset.recentCommits);
    setSelectedNodeId(currentDataset.nodes[0]?.id || null);
  }, [activeDatasetId]);

  // Live Commit Simulation Interval
  useEffect(() => {
    if (!isSimulatingLiveCommits) return;

    const interval = setInterval(() => {
      // Pick random node to simulate modification
      setNodes(prevNodes => {
        if (prevNodes.length === 0) return prevNodes;
        const randomIndex = Math.floor(Math.random() * prevNodes.length);
        const targetNode = prevNodes[randomIndex];
        const isBug = Math.random() > 0.6;
        const newMods = targetNode.modificationCount + 1;
        const newChurn = targetNode.linesChangedCount + Math.floor(Math.random() * 80) + 10;
        const newBugs = targetNode.bugFixCount + (isBug ? 1 : 0);

        const updatedNode: ModuleHeatmapNode = {
          ...targetNode,
          modificationCount: newMods,
          linesChangedCount: newChurn,
          bugFixCount: newBugs,
          lastModifiedTimestamp: "Just now",
          quadrant: determineQuadrant(newMods, targetNode.cyclomaticComplexity)
        };
        updatedNode.refactoringPriority = calculateHotspotScore(updatedNode);

        const newNodes = [...prevNodes];
        newNodes[randomIndex] = updatedNode;
        return newNodes;
      });

      // Add to commit stream
      const authors = ["Senior Combat Dev", "Gameplay Engineer", "AI Specialist", "Audio Programmer", "Rendering Lead"];
      const messages = [
        "fix(telemetry): patch edge-case timing threshold in main loop",
        "refactor(nodes): optimize internal memory cache footprint",
        "fix(state): resolve intermittent race condition in event bus",
        "perf(pipeline): vectorize matrix multiplications with SIMD",
        "feat(gameplay): fine-tune damage scaling and mitigation curve"
      ];
      
      const newCommit: CommitHistoryRecord = {
        id: Math.random().toString(36).substring(2, 8),
        timestamp: "Just now",
        author: authors[Math.floor(Math.random() * authors.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        filesChanged: [nodes[Math.floor(Math.random() * nodes.length)]?.fileName || "Module.ts"],
        insertions: Math.floor(Math.random() * 45) + 5,
        deletions: Math.floor(Math.random() * 20) + 2,
        isBugFix: Math.random() > 0.5
      };

      setCommits(prev => [newCommit, ...prev.slice(0, 19)]);
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulatingLiveCommits, nodes]);

  // Selected Node
  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || nodes[0];
  }, [nodes, selectedNodeId]);

  // Filtered Nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = searchQuery === '' ||
        node.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.filePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.system.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === 'ALL' || node.category === filterCategory;
      const matchesQuadrant = filterQuadrant === 'ALL' || node.quadrant === filterQuadrant;

      return matchesSearch && matchesCategory && matchesQuadrant;
    });
  }, [nodes, searchQuery, filterCategory, filterQuadrant]);

  // Max Churn / Metrics for Relative Calculations
  const maxMetrics = useMemo(() => {
    let maxMods = 1;
    let maxComplexity = 1;
    let maxLoc = 1;
    let maxChurn = 1;

    nodes.forEach(n => {
      if (n.modificationCount > maxMods) maxMods = n.modificationCount;
      if (n.cyclomaticComplexity > maxComplexity) maxComplexity = n.cyclomaticComplexity;
      if (n.linesOfCode > maxLoc) maxLoc = n.linesOfCode;
      if (n.linesChangedCount > maxChurn) maxChurn = n.linesChangedCount;
    });

    return { maxMods, maxComplexity, maxLoc, maxChurn };
  }, [nodes]);

  // Statistical Overview Summary
  const statsSummary = useMemo(() => {
    const totalFiles = nodes.length;
    const criticalHotspots = nodes.filter(n => n.quadrant === 'CRITICAL_HOTSPOT').length;
    const totalLinesChurn = nodes.reduce((acc, n) => acc + n.linesChangedCount, 0);
    const avgHotspotScore = Math.round(
      nodes.reduce((acc, n) => acc + calculateHotspotScore(n), 0) / Math.max(1, totalFiles)
    );

    return { totalFiles, criticalHotspots, totalLinesChurn, avgHotspotScore };
  }, [nodes]);

  // Export Technical Debt Report as Markdown
  const exportDebtReport = () => {
    let md = `# 🏛️ Architecture Heatmap & Technical Debt Audit Report\n`;
    md += `**Project:** ${currentDataset.title}\n`;
    md += `**Generated:** ${new Date().toLocaleString()}\n`;
    md += `**Critical Hotspots Identified:** ${statsSummary.criticalHotspots} / ${statsSummary.totalFiles} files\n\n`;

    md += `## 🚨 Priority Refactoring Hotspots (High Churn + High Complexity)\n`;
    const hotspots = nodes.filter(n => n.quadrant === 'CRITICAL_HOTSPOT');
    hotspots.forEach((h, idx) => {
      md += `### ${idx + 1}. ${h.fileName} (${h.system})\n`;
      md += `- **Path:** \`${h.filePath}\`\n`;
      md += `- **Lines of Code:** ${h.linesOfCode} | **Complexity:** ${h.cyclomaticComplexity}\n`;
      md += `- **Modification Frequency:** ${h.modificationCount} edits (${h.linesChangedCount} lines churned)\n`;
      md += `- **Bug Fixes:** ${h.bugFixCount} | **Authors:** ${h.distinctAuthorsCount}\n`;
      md += `- **Primary Churn Reason:** ${h.primaryReason}\n`;
      md += `- **Prescription (1 Node = 1 File Refactoring):**\n`;
      h.recommendationsEng.forEach(rec => {
        md += `  - [ ] ${rec}\n`;
      });
      md += `\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDataset.id}_technical_debt_report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full bg-[#0d1117] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Main Navigation Bar */}
      <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0 shadow-lg z-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-600 to-red-600 p-2 rounded-xl shadow-lg border border-amber-400/30">
            <Flame size={18} className="text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-wide text-gray-100">
                Architecture <span className="text-amber-400 font-mono">Heatmap</span> & Churn Hotspots
              </h1>
              <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1">
                <AlertTriangle size={11} /> {statsSummary.criticalHotspots} Critical Hotspots
              </span>
            </div>
            <p className="text-[10px] text-gray-400 tracking-wide">
              Visual telemetry identifying high-churn modules, code fatigue & refactoring priorities
            </p>
          </div>
        </div>

        {/* Preset Selector & Live Simulator */}
        <div className="flex items-center gap-2">
          {/* Dataset Selector */}
          <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-lg p-0.5 text-xs">
            {ALL_HEATMAP_PRESETS.map(preset => {
              const isActive = activeDatasetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActiveDatasetId(preset.id)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    isActive 
                      ? 'bg-amber-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]'
                  }`}
                >
                  {preset.title.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Live Commit Simulation Toggle */}
          <button
            onClick={() => setIsSimulatingLiveCommits(!isSimulatingLiveCommits)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSimulatingLiveCommits 
                ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                : 'bg-[#21262d] border-[#30363d] text-gray-300 hover:bg-[#30363d]'
            }`}
          >
            {isSimulatingLiveCommits ? <Pause size={13} className="text-emerald-400" /> : <Play size={13} />}
            {isSimulatingLiveCommits ? 'Simulating Live Commits...' : 'Simulate Team Commits'}
          </button>

          {/* Export Report */}
          <button
            onClick={exportDebtReport}
            className="bg-[#21262d] hover:bg-[#30363d] text-gray-300 border border-[#30363d] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Export Technical Debt Report"
          >
            <Download size={13} /> Export Debt Audit
          </button>
        </div>
      </div>

      {/* Sub-Header Toolbar & Mode Switcher */}
      <div className="h-11 bg-[#161b22]/90 border-b border-[#30363d] px-4 flex items-center justify-between shrink-0 text-xs z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {/* View Modes */}
          <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'matrix' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Flame size={13} /> Thermal Heatmap Matrix
            </button>
            <button
              onClick={() => setViewMode('quadrant')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'quadrant' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <BarChart3 size={13} /> 2D Refactoring Quadrant
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'timeline' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Clock size={13} /> Commit Churn Stream
            </button>
            <button
              onClick={() => setViewMode('prescription')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 font-medium transition-all ${
                viewMode === 'prescription' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <ShieldCheck size={13} /> 1-Node Refactor Prescription
            </button>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-lg p-0.5 text-[11px]">
            {(['24h', '7d', '30d', '90d', 'all'] as TimeRangeFilter[]).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2 py-0.5 rounded font-mono uppercase transition-all ${
                  timeRange === t ? 'bg-[#30363d] text-white font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Treemap Sizing Mode */}
          {viewMode === 'matrix' && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#30363d]">
              <span className="text-[11px] text-gray-400">Tile Size:</span>
              <select
                value={sizingMode}
                onChange={(e) => setSizingMode(e.target.value as MetricSizingMode)}
                className="bg-[#0d1117] border border-[#30363d] rounded-md px-2 py-0.5 text-[11px] text-gray-300 focus:outline-none"
              >
                <option value="churn">Churn (Lines Changed)</option>
                <option value="modifications">Edit Frequency (Commits)</option>
                <option value="loc">Lines of Code (LOC)</option>
                <option value="complexity">Cyclomatic Complexity</option>
              </select>
            </div>
          )}
        </div>

        {/* Search & Quadrant Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search file, system, path..."
              className="bg-[#0d1117] border border-[#30363d] rounded-lg pl-8 pr-3 py-1 text-xs text-gray-200 focus:outline-none focus:border-amber-500 w-48 placeholder-gray-500"
            />
          </div>

          <select
            value={filterQuadrant}
            onChange={(e) => setFilterQuadrant(e.target.value)}
            className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs text-gray-300 focus:outline-none"
          >
            <option value="ALL">All Quadrants</option>
            <option value="CRITICAL_HOTSPOT">Critical Hotspots</option>
            <option value="COMPLEX_STABLE">Complex Stable</option>
            <option value="ACTIVE_UTILITY">Active Utilities</option>
            <option value="STABLE_LEAF">Stable Leaves</option>
          </select>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: Main Heatmap Views */}
        <div className="flex-1 flex flex-col relative bg-[#090d13] overflow-hidden">
          
          {/* VIEW 1: Thermal Treemap / Matrix */}
          {viewMode === 'matrix' && (
            <div className="w-full h-full overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0d1117]">
              
              {/* Thermal Legend & KPI Header */}
              <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] flex flex-wrap items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase">Monitored Files</div>
                    <div className="text-xl font-bold font-mono text-white mt-0.5">{statsSummary.totalFiles} Modules</div>
                  </div>
                  <div className="h-8 w-px bg-[#30363d]" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase">Lines Churned ({timeRange})</div>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{statsSummary.totalLinesChurn.toLocaleString()} LOC</div>
                  </div>
                  <div className="h-8 w-px bg-[#30363d]" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase">Avg Hotspot Score</div>
                    <div className="text-xl font-bold font-mono text-orange-400 mt-0.5">{statsSummary.avgHotspotScore} / 100</div>
                  </div>
                </div>

                {/* Thermal Gradient Legend */}
                <div className="flex items-center gap-2 text-xs bg-[#0d1117] p-2 rounded-lg border border-[#30363d]">
                  <span className="text-gray-400 text-[10px] uppercase font-mono">Heat Scale:</span>
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">Cool</span>
                    <span className="px-2 py-0.5 rounded bg-yellow-950/60 text-yellow-400 border border-yellow-500/40">Warm</span>
                    <span className="px-2 py-0.5 rounded bg-orange-950/60 text-orange-400 border border-orange-500/40">Elevated</span>
                    <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/60 font-bold animate-pulse">Hotspot</span>
                  </div>
                </div>
              </div>

              {/* Heatmap Blocks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredNodes.map(node => {
                  const isSelected = selectedNodeId === node.id;
                  const isHovered = hoveredNodeId === node.id;
                  const hotspotScore = calculateHotspotScore(node);
                  const severity = getHotspotSeverity(hotspotScore);

                  // Relative scale size for visual treemap feel
                  let weightFactor = 1;
                  if (sizingMode === 'churn') weightFactor = node.linesChangedCount / maxMetrics.maxChurn;
                  else if (sizingMode === 'modifications') weightFactor = node.modificationCount / maxMetrics.maxMods;
                  else if (sizingMode === 'loc') weightFactor = node.linesOfCode / maxMetrics.maxLoc;
                  else weightFactor = node.cyclomaticComplexity / maxMetrics.maxComplexity;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 relative overflow-hidden shadow-lg ${
                        severity.bgColor
                      } ${
                        isSelected 
                          ? 'ring-2 ring-amber-400 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.35)] scale-[1.02]' 
                          : `${severity.borderColor} hover:border-gray-300 hover:scale-[1.01]`
                      }`}
                    >
                      {/* Thermal Corner Flare for Critical Hotspots */}
                      {severity.severity === 'CRITICAL_HOTSPOT' && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/20 rounded-bl-full pointer-events-none blur-sm" />
                      )}

                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${severity.borderColor} ${severity.textColor} bg-black/40`}>
                          {severity.label}
                        </span>
                        <div className="flex items-center gap-1 font-mono text-[10px] text-gray-300">
                          <Flame size={12} className={severity.textColor} />
                          <span className="font-bold">{hotspotScore}</span>/100
                        </div>
                      </div>

                      {/* File Name & Path */}
                      <div className="space-y-0.5 mb-3">
                        <div className="flex items-center gap-1.5">
                          <FileCode size={14} className={severity.textColor} />
                          <span className="text-xs font-bold text-white truncate font-mono">{node.fileName}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono truncate">{node.system}</div>
                      </div>

                      {/* Metrics 2x2 Mini Matrix */}
                      <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono mb-3">
                        <div>
                          <span className="text-gray-500 block">Modifications:</span>
                          <span className="text-white font-bold">{node.modificationCount} commits</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Lines Churned:</span>
                          <span className="text-amber-400 font-bold">{node.linesChangedCount} LOC</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Complexity:</span>
                          <span className="text-purple-400 font-bold">{node.cyclomaticComplexity}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Bug Fixes:</span>
                          <span className={node.bugFixCount > 5 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {node.bugFixCount} fixes
                          </span>
                        </div>
                      </div>

                      {/* Footer Badge */}
                      <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 pt-1 border-t border-white/10">
                        <span>{node.distinctAuthorsCount} Authors</span>
                        <span className="text-gray-400">{node.lastModifiedTimestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* VIEW 2: 2D Refactoring Priority Quadrant Scatter Plot */}
          {viewMode === 'quadrant' && (
            <div className="w-full h-full overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0d1117]">
              
              {/* Header Info */}
              <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart3 size={16} className="text-blue-400" /> 2D Refactoring Matrix (Churn vs Cyclomatic Complexity)
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Isolates high-risk code requiring decomposition according to strict 1 Node / 1 Module = 1 File rules.
                  </p>
                </div>
                <div className="text-xs font-mono bg-red-950/40 text-red-400 border border-red-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Top Left Quadrant = Immediate Refactor
                </div>
              </div>

              {/* 4 Quadrants Visual Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[480px]">
                
                {/* Quadrant 1: CRITICAL HOTSPOTS (High Churn + High Complexity) */}
                <div className="bg-red-950/20 border-2 border-red-500/50 rounded-2xl p-5 space-y-4 shadow-xl relative">
                  <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
                    <div className="flex items-center gap-2">
                      <Flame className="text-red-400" size={18} />
                      <div>
                        <h4 className="text-xs font-bold text-red-400 uppercase tracking-wide">
                          Quadrant I: Critical Hotspots
                        </h4>
                        <p className="text-[10px] text-gray-400">High Churn + High Complexity (Dangerous Technical Debt)</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-red-900/60 text-red-300 px-2 py-0.5 rounded border border-red-500/40">
                      {nodes.filter(n => n.quadrant === 'CRITICAL_HOTSPOT').length} Files
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    {nodes.filter(n => n.quadrant === 'CRITICAL_HOTSPOT').map(node => (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className="p-3 bg-[#161b22] hover:bg-[#21262d] border border-red-500/40 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                            <FileCode size={13} className="text-red-400" />
                            {node.fileName}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{node.primaryReason}</div>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <div className="text-red-400 font-bold">{node.modificationCount} edits</div>
                          <div className="text-[10px] text-purple-400">CC: {node.cyclomaticComplexity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quadrant 2: COMPLEX & STABLE (Low Churn + High Complexity) */}
                <div className="bg-purple-950/20 border-2 border-purple-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="text-purple-400" size={18} />
                      <div>
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                          Quadrant II: Complex Domain Core
                        </h4>
                        <p className="text-[10px] text-gray-400">Low Churn + High Complexity (Specialized Algorithms, Physics Solvers)</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40">
                      {nodes.filter(n => n.quadrant === 'COMPLEX_STABLE').length} Files
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    {nodes.filter(n => n.quadrant === 'COMPLEX_STABLE').map(node => (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className="p-3 bg-[#161b22] hover:bg-[#21262d] border border-purple-500/30 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                            <FileCode size={13} className="text-purple-400" />
                            {node.fileName}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{node.system}</div>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <div className="text-gray-300 font-bold">{node.modificationCount} edits</div>
                          <div className="text-[10px] text-purple-400">CC: {node.cyclomaticComplexity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quadrant 3: ACTIVE UTILITIES (High Churn + Low Complexity) */}
                <div className="bg-amber-950/20 border-2 border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="text-amber-400" size={18} />
                      <div>
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                          Quadrant III: Active Utilities & Configs
                        </h4>
                        <p className="text-[10px] text-gray-400">High Churn + Low Complexity (Frequently tuned gameplay parameters)</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                      {nodes.filter(n => n.quadrant === 'ACTIVE_UTILITY').length} Files
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    {nodes.filter(n => n.quadrant === 'ACTIVE_UTILITY').map(node => (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className="p-3 bg-[#161b22] hover:bg-[#21262d] border border-amber-500/30 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                            <FileCode size={13} className="text-amber-400" />
                            {node.fileName}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{node.primaryReason}</div>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <div className="text-amber-400 font-bold">{node.modificationCount} edits</div>
                          <div className="text-[10px] text-emerald-400">CC: {node.cyclomaticComplexity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quadrant 4: STABLE LEAF NODES (Low Churn + Low Complexity) */}
                <div className="bg-emerald-950/20 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-emerald-400" size={18} />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                          Quadrant IV: Stable Decoupled Leaves
                        </h4>
                        <p className="text-[10px] text-gray-400">Low Churn + Low Complexity (Target Clean State for 1 Node = 1 File)</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                      {nodes.filter(n => n.quadrant === 'STABLE_LEAF').length} Files
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    {nodes.filter(n => n.quadrant === 'STABLE_LEAF').map(node => (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className="p-3 bg-[#161b22] hover:bg-[#21262d] border border-emerald-500/30 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                            <FileCode size={13} className="text-emerald-400" />
                            {node.fileName}
                          </div>
                          <div className="text-[10px] text-emerald-400 mt-0.5">Golden Decoupled Standard</div>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <div className="text-emerald-400 font-bold">{node.modificationCount} edits</div>
                          <div className="text-[10px] text-emerald-400">CC: {node.cyclomaticComplexity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW 3: Commit Churn Stream */}
          {viewMode === 'timeline' && (
            <div className="w-full h-full overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0d1117]">
              
              <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] flex items-center justify-between shadow-md">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock size={16} className="text-purple-400" /> Live Churn Stream & Commit Velocity
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Chronological modification logs showing real-time file churn and bug fix density.
                  </p>
                </div>
                <span className="text-xs font-mono bg-purple-950/50 text-purple-300 border border-purple-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <GitCommit size={14} /> {commits.length} Recent Commits
                </span>
              </div>

              {/* Commit Stream List */}
              <div className="space-y-3">
                {commits.map(c => (
                  <div key={c.id} className="p-4 bg-[#161b22] rounded-xl border border-[#30363d] space-y-2 hover:border-gray-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d] text-blue-400 font-bold">
                          {c.id}
                        </span>
                        <span className="text-xs font-bold text-white">{c.message}</span>
                        {c.isBugFix && (
                          <span className="text-[9px] font-mono bg-red-950/60 text-red-400 border border-red-500/40 px-1.5 py-0.2 rounded font-bold">
                            BUG FIX
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{c.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-[#30363d]">
                      <div className="flex items-center gap-2">
                        <User size={13} className="text-gray-400" />
                        <span>{c.author}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-300 font-mono">
                          Files: {c.filesChanged.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-emerald-400 font-bold">+{c.insertions}</span>
                        <span className="text-red-400 font-bold">-{c.deletions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: Automated 1-Node Refactor Prescription */}
          {viewMode === 'prescription' && selectedNode && (
            <div className="w-full h-full overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0d1117]">
              
              {/* Hotspot Target Banner */}
              <div className="bg-[#161b22] p-5 rounded-2xl border border-red-500/40 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-amber-400" size={18} />
                    <h3 className="text-sm font-bold text-white">
                      Automated 1-Node Refactoring Prescription for <span className="text-amber-400 font-mono">{selectedNode.fileName}</span>
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-red-950/60 text-red-300 border border-red-500/50 px-3 py-1 rounded-lg">
                    Priority Score: {selectedNode.refactoringPriority}/100
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {selectedNode.primaryReason}
                </p>
              </div>

              {/* Step-by-Step Action Roadmap */}
              <div className="bg-[#161b22] p-5 rounded-2xl border border-[#30363d] space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={16} /> Recommended 1 Node = 1 File Decomposition Strategy
                </h4>

                <div className="space-y-3">
                  {selectedNode.recommendationsThai.map((recThai, idx) => (
                    <div key={idx} className="p-3.5 bg-[#0d1117] rounded-xl border border-[#30363d] flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-200">{recThai}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{selectedNode.recommendationsEng[idx]}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions to IDE or Dependency Graph */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => onSelectTool?.('MegaCodeIDEMaster')}
                  className="p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-blue-400 font-bold text-xs">
                    <span className="flex items-center gap-1.5"><Code2 size={14} /> Open in Mega Code IDE Master</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Execute AST refactoring and generate 1-Node/1-File modular templates.
                  </p>
                </button>

                <button
                  onClick={() => onSelectTool?.('ModuleDependencyVisualizerStudio')}
                  className="p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-purple-400 font-bold text-xs">
                    <span className="flex items-center gap-1.5"><Network size={14} /> Inspect in Dependency Graph</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Verify call topology, blast radius, and ensure clean DAG acyclic flow.
                  </p>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Side: Deep-Dive Hotspot Telemetry Inspector */}
        {selectedNode && (
          <div className="w-80 bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 z-20 shadow-2xl">
            {/* Header */}
            <div className="p-3.5 border-b border-[#30363d] bg-[#1a1f29] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Hotspot Telemetry</h3>
              </div>
              <span className="text-[10px] font-mono bg-black/40 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                Score: {calculateHotspotScore(selectedNode)}
              </span>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar">
              {/* File Info */}
              <div>
                <div className="text-[10px] font-mono text-gray-400 uppercase">Module File</div>
                <div className="text-xs font-bold text-white font-mono mt-0.5 break-all">{selectedNode.fileName}</div>
                <div className="text-[10px] text-gray-400 font-mono break-all mt-0.5">{selectedNode.filePath}</div>
              </div>

              {/* Quadrant Badge */}
              <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d]">
                <div className="text-[10px] text-gray-400 font-mono uppercase">Refactor Quadrant</div>
                <div className="text-xs font-bold text-amber-400 mt-0.5">
                  {selectedNode.quadrant.replace('_', ' ')}
                </div>
              </div>

              {/* Telemetry Gauge Stats */}
              <div className="space-y-2.5">
                <div className="text-[10px] font-mono text-gray-400 uppercase">Telemetry Metrics</div>

                {/* Edit Frequency Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Modification Count:</span>
                    <span className="font-bold text-white font-mono">{selectedNode.modificationCount} edits</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${Math.min(100, (selectedNode.modificationCount / maxMetrics.maxMods) * 100)}%` }} 
                    />
                  </div>
                </div>

                {/* Churn Lines Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Lines Churned:</span>
                    <span className="font-bold text-amber-400 font-mono">{selectedNode.linesChangedCount} LOC</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full" 
                      style={{ width: `${Math.min(100, (selectedNode.linesChangedCount / maxMetrics.maxChurn) * 100)}%` }} 
                    />
                  </div>
                </div>

                {/* Cyclomatic Complexity Gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Cyclomatic Complexity:</span>
                    <span className="font-bold text-purple-400 font-mono">{selectedNode.cyclomaticComplexity}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full" 
                      style={{ width: `${Math.min(100, (selectedNode.cyclomaticComplexity / maxMetrics.maxComplexity) * 100)}%` }} 
                    />
                  </div>
                </div>

                {/* Bug Fix Density */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Bug Fix Commits:</span>
                    <span className="font-bold text-red-400 font-mono">{selectedNode.bugFixCount} bug fixes</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{ width: `${Math.min(100, (selectedNode.bugFixCount / 10) * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Primary Fatigue Reason */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-gray-400 uppercase">Primary Churn Cause</div>
                <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-[11px] text-gray-300 leading-relaxed">
                  {selectedNode.primaryReason}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-3 border-t border-[#30363d] bg-[#1a1f29] space-y-2">
              <button
                onClick={() => setViewMode('prescription')}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles size={13} /> View Refactor Prescription
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
