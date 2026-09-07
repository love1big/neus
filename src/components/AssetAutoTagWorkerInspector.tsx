/**
 * @file AssetAutoTagWorkerInspector.tsx
 * @description หน้าจอควบคุมและตรวจสอบ AI Background Worker, Shannon Entropy Inspector, และ Smart Auto-Organizer
 * AAA-Grade Live Telemetry Dashboard, Shannon Entropy Inspector & Content Browser Auto-Organizer.
 *
 * @system AI Asset Auto-Tagging & Background Worker Subsystem
 * @module AssetAutoTagWorkerInspector
 *
 * ------------------------------------------------------------------------------------------------
 * วัตถุประสงค์ (Module Purpose & Responsibility):
 * - แสดงสถานะการทำงานสดของ AI Background Worker (CPU Throttle, Scan Queue, Calcs/sec, Telemetry)
 * - แสดงตัววิเคราะห์ Shannon File Entropy (0.0 - 8.0), Byte Histogram 256 Bins, และ Magic Signatures
 * - แสดงรายการ Asset พร้อม Auto-Generated Semantic Tags, Confidence Gauges, และ PBR Roles
 * - ให้ปุ่มสั่งการ "1-Click Auto-Organize Content Browser" และ "Revert/Undo Organization"
 * - รองรับการค้นหา, กรองตามประเภท (Meshes, Textures, Audio, Materials), และแท็กแบบเรียลไทม์
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - เชื่อมต่อกับ AIAssetBackgroundWorker.ts, AssetEntropyAnalyzer.ts, ContentHeuristicClassifier.ts
 * - ทำงานผสานรวมกับ ContentBrowser.tsx ผ่าน Custom Event Bus
 * ------------------------------------------------------------------------------------------------
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Zap,
  Activity,
  Cpu,
  Play,
  Pause,
  RefreshCw,
  FolderTree,
  FolderPlus,
  Box,
  Image as ImageIcon,
  Music,
  Palette,
  FileCode,
  Tag,
  Sliders,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Search,
  Filter,
  X,
  ChevronRight,
  Database,
  BarChart3,
  Terminal,
  ArrowUpRight,
  RotateCcw,
  Sparkle
} from 'lucide-react';
import {
  AnalyzedProjectAsset,
  BackgroundWorkerMetrics,
  EngineAssetCategory,
  AssetSemanticTag
} from '../utils/AssetClassificationTypes';
import { AIAssetBackgroundWorker } from '../utils/AIAssetBackgroundWorker';

interface AssetAutoTagWorkerInspectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectAsset?: (assetId: string) => void;
  embeddedMode?: boolean;
}

export default function AssetAutoTagWorkerInspector({
  isOpen = true,
  onClose,
  onSelectAsset,
  embeddedMode = false
}: AssetAutoTagWorkerInspectorProps) {
  const worker = useMemo(() => AIAssetBackgroundWorker.getInstance(), []);

  const [metrics, setMetrics] = useState<BackgroundWorkerMetrics>(() => worker.getMetrics());
  const [analyzedAssets, setAnalyzedAssets] = useState<AnalyzedProjectAsset[]>(() => worker.getAnalyzedAssets());
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'needs_relocation' | 'organized'>('all');
  const [activeTab, setActiveTab] = useState<'assets' | 'entropy' | 'logs' | 'taxonomy'>('assets');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Subscribe to Background Worker Metrics & Asset Tagged Events
  useEffect(() => {
    const handleMetrics = (e: any) => {
      if (e.detail) {
        setMetrics(e.detail);
        setAnalyzedAssets(worker.getAnalyzedAssets());
      }
    };

    const handleTagged = (e: any) => {
      setAnalyzedAssets(worker.getAnalyzedAssets());
    };

    const handleReorganized = (e: any) => {
      setAnalyzedAssets(worker.getAnalyzedAssets());
      setFeedbackMessage(`✨ Successfully reorganized ${e.detail?.movedCount || 0} assets in Content Browser!`);
      setTimeout(() => setFeedbackMessage(null), 4000);
    };

    window.addEventListener('asset-worker-metrics', handleMetrics);
    window.addEventListener('asset-tagged', handleTagged);
    window.addEventListener('content-browser-reorganized', handleReorganized);

    return () => {
      window.removeEventListener('asset-worker-metrics', handleMetrics);
      window.removeEventListener('asset-tagged', handleTagged);
      window.removeEventListener('content-browser-reorganized', handleReorganized);
    };
  }, [worker]);

  // Selected Asset details
  const selectedAsset = useMemo(() => {
    return analyzedAssets.find(a => a.id === selectedAssetId) || analyzedAssets[0] || null;
  }, [analyzedAssets, selectedAssetId]);

  // Filtered Assets list
  const filteredAssets = useMemo(() => {
    return analyzedAssets.filter(asset => {
      const matchSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tags.some(t => t.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
        asset.primaryCategory.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === 'all' || asset.primaryCategory === categoryFilter;

      let matchStatus = true;
      if (statusFilter === 'needs_relocation') {
        matchStatus = !asset.isOrganized;
      } else if (statusFilter === 'organized') {
        matchStatus = asset.isOrganized;
      }

      return matchSearch && matchCategory && matchStatus;
    });
  }, [analyzedAssets, searchQuery, categoryFilter, statusFilter]);

  // Action: Trigger Auto-Organization
  const handleTriggerAutoOrganize = useCallback(() => {
    // Dispatch a request event for Content Browser to supply its current asset state
    window.dispatchEvent(new CustomEvent('request-content-browser-auto-organize'));
    setFeedbackMessage('⚡ Organizing Content Browser into smart taxonomy folders...');
    setTimeout(() => setFeedbackMessage(null), 3000);
  }, []);

  // Action: Revert Organization
  const handleRevertOrganization = useCallback(() => {
    window.dispatchEvent(new CustomEvent('request-content-browser-revert-organize'));
  }, []);

  // Action: Rescan
  const handleRescan = useCallback(() => {
    window.dispatchEvent(new CustomEvent('request-content-browser-rescan'));
    setFeedbackMessage('🔄 Triggered complete project asset rescan stream');
    setTimeout(() => setFeedbackMessage(null), 3000);
  }, []);

  const getCategoryIcon = (category: EngineAssetCategory) => {
    switch (category) {
      case 'mesh': return <Box size={14} className="text-[#58a6ff]" />;
      case 'texture': return <ImageIcon size={14} className="text-[#bc8cff]" />;
      case 'audio': return <Music size={14} className="text-[#3fb950]" />;
      case 'material': return <Palette size={14} className="text-[#f85149]" />;
      case 'blueprint': return <FileCode size={14} className="text-[#3fb950]" />;
      default: return <Database size={14} className="text-[#8b949e]" />;
    }
  };

  const getEntropyColor = (score: number) => {
    if (score < 4.0) return 'text-[#3fb950] border-[#3fb950]/40 bg-[#3fb950]/10'; // Low entropy (Text/ASCII)
    if (score < 6.5) return 'text-[#58a6ff] border-[#58a6ff]/40 bg-[#58a6ff]/10'; // Moderate entropy (Structured binary/PCM)
    if (score < 7.6) return 'text-[#e3b341] border-[#e3b341]/40 bg-[#e3b341]/10'; // High entropy (Compressed texture/OGG)
    return 'text-[#f85149] border-[#f85149]/40 bg-[#f85149]/10'; // Very high entropy (Dense/Encrypted)
  };

  if (!isOpen && !embeddedMode) return null;

  return (
    <div className={`flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans ${embeddedMode ? 'w-full' : 'w-full max-w-7xl mx-auto rounded-xl border border-[#30363d] shadow-2xl overflow-hidden'}`}>
      {/* Header Bar */}
      <div className="h-12 bg-[#161b22] border-b border-[#30363d] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#1f6feb]/20 border border-[#1f6feb]/40 flex items-center justify-center text-[#58a6ff]">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-white tracking-wide uppercase">AI Asset Auto-Tagger & Entropy Organizer</h2>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold flex items-center gap-1 ${
                metrics.state === 'scanning'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  : metrics.state === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${metrics.state === 'scanning' ? 'bg-amber-400' : metrics.state === 'completed' ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                {metrics.state.toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] text-[#8b949e]">Autonomous background thread analyzing file entropy & content heuristics</p>
          </div>
        </div>

        {/* Worker Controls & Actions */}
        <div className="flex items-center gap-2">
          {/* Throttle Mode Selector */}
          <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded p-0.5 text-[10px]">
            <span className="text-[#8b949e] px-1.5 flex items-center gap-1 font-mono">
              <Cpu size={11} /> Throttle:
            </span>
            <button
              onClick={() => worker.setThrottleLevel('low_power')}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${metrics.throttleLevel === 'low_power' ? 'bg-[#238636] text-white font-bold' : 'text-[#8b949e] hover:text-white'}`}
              title="Low CPU power mode (400ms interval)"
            >
              Eco
            </button>
            <button
              onClick={() => worker.setThrottleLevel('balanced')}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${metrics.throttleLevel === 'balanced' ? 'bg-[#1f6feb] text-white font-bold' : 'text-[#8b949e] hover:text-white'}`}
              title="Balanced mode (120ms interval)"
            >
              Balanced
            </button>
            <button
              onClick={() => worker.setThrottleLevel('turbo')}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${metrics.throttleLevel === 'turbo' ? 'bg-[#8957e5] text-white font-bold' : 'text-[#8b949e] hover:text-white'}`}
              title="Turbo scan mode (30ms interval)"
            >
              Turbo
            </button>
          </div>

          {/* Worker Play / Pause / Rescan */}
          {metrics.state === 'scanning' ? (
            <button
              onClick={() => worker.pauseScan()}
              className="px-2.5 py-1 bg-[#d29922]/20 hover:bg-[#d29922]/30 border border-[#d29922]/40 text-[#d29922] rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Pause Background Worker"
            >
              <Pause size={12} /> Pause
            </button>
          ) : (
            <button
              onClick={() => worker.startScan()}
              className="px-2.5 py-1 bg-[#238636]/20 hover:bg-[#238636]/30 border border-[#238636]/40 text-[#3fb950] rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Resume Background Scanning"
            >
              <Play size={12} /> Scan
            </button>
          )}

          <button
            onClick={handleRescan}
            className="px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            title="Force complete rescan of all project assets"
          >
            <RefreshCw size={12} /> Rescan All
          </button>

          {/* 1-Click Auto-Organize Action */}
          <button
            onClick={handleTriggerAutoOrganize}
            className="px-3 py-1 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded text-[11px] font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            title="Automatically move all project assets into smart taxonomy folders in Content Browser"
          >
            <FolderTree size={12} /> Auto-Organize Content Browser
          </button>

          {onClose && (
            <button onClick={onClose} className="p-1 text-[#8b949e] hover:text-white transition-colors cursor-pointer ml-1">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Telemetry Bar */}
      <div className="bg-[#0b0f14] border-b border-[#21262d] px-4 py-2 flex items-center justify-between text-[11px] shrink-0 gap-4 overflow-x-auto">
        {/* Progress gauge */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="flex justify-between text-[10px] text-[#8b949e]">
              <span>Scan Progress ({metrics.scannedAssetsCount}/{metrics.totalAssetsInProject} assets)</span>
              <span className="font-mono text-white font-bold">{metrics.scanProgressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#21262d] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1f6feb] to-[#3fb950] transition-all duration-300 rounded-full"
                style={{ width: `${metrics.scanProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Metrics Stats */}
        <div className="flex items-center gap-4 text-[#8b949e] shrink-0 font-mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <Activity size={12} className="text-[#3fb950]" />
            <span>Entropy Rate:</span>
            <span className="text-white font-semibold">{metrics.entropyCalculationsPerSec} calcs/sec</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag size={12} className="text-[#bc8cff]" />
            <span>Auto-Tagged:</span>
            <span className="text-white font-semibold">{metrics.autoTaggedCount} files</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FolderPlus size={12} className="text-[#58a6ff]" />
            <span>Reorganized:</span>
            <span className="text-white font-semibold">{metrics.reorganizedCount} moved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-[#e3b341]" />
            <span>Avg Latency:</span>
            <span className="text-white font-semibold">{metrics.averageScanDurationMs}ms</span>
          </div>
        </div>

        {/* Undo Reorganization button */}
        <button
          onClick={handleRevertOrganization}
          className="px-2 py-0.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#8b949e] hover:text-white rounded text-[10px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          title="Revert the last Content Browser auto-organization"
        >
          <RotateCcw size={11} /> Undo Last Move
        </button>
      </div>

      {/* Feedback Alert Banner */}
      {feedbackMessage && (
        <div className="bg-[#1f6feb]/20 border-b border-[#1f6feb]/40 px-4 py-1.5 text-xs text-[#58a6ff] flex items-center gap-2 animate-fadeIn shrink-0">
          <Info size={14} />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Side: Asset Explorer & Taxonomy */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-[#30363d]">
          {/* Filters & Search Toolbar */}
          <div className="p-3 bg-[#11161d] border-b border-[#30363d] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded px-2.5 py-1 flex-1">
                <Search size={12} className="text-[#8b949e]" />
                <input
                  type="text"
                  placeholder="Search assets, PBR roles, tags (e.g. Normal, 4K, LOD0)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-[#c9d1d9] px-2 w-full placeholder:text-[#6e7681]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-[#8b949e] hover:text-white">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
              {[
                { id: 'all', label: 'All Types' },
                { id: 'mesh', label: 'Meshes (3D)' },
                { id: 'texture', label: 'Textures' },
                { id: 'audio', label: 'Audio' },
                { id: 'material', label: 'Materials' },
                { id: 'blueprint', label: 'Blueprints' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
                    categoryFilter === cat.id
                      ? 'bg-[#1f6feb] text-white'
                      : 'bg-[#161b22] text-[#8b949e] hover:text-white border border-[#30363d]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Organization Status Filter */}
            <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded p-0.5 text-[10px]">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-0.5 rounded cursor-pointer ${statusFilter === 'all' ? 'bg-[#21262d] text-white font-bold' : 'text-[#8b949e]'}`}
              >
                All Status
              </button>
              <button
                onClick={() => setStatusFilter('needs_relocation')}
                className={`px-2 py-0.5 rounded cursor-pointer ${statusFilter === 'needs_relocation' ? 'bg-[#d29922]/20 text-[#d29922] font-bold' : 'text-[#8b949e]'}`}
              >
                Needs Move
              </button>
              <button
                onClick={() => setStatusFilter('organized')}
                className={`px-2 py-0.5 rounded cursor-pointer ${statusFilter === 'organized' ? 'bg-[#238636]/20 text-[#3fb950] font-bold' : 'text-[#8b949e]'}`}
              >
                Organized
              </button>
            </div>
          </div>

          {/* Assets Grid / Table */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-2">
            {filteredAssets.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-[#8b949e] text-xs gap-2">
                <Filter size={24} className="text-[#30363d]" />
                <span>No assets matched your active filters</span>
              </div>
            ) : (
              filteredAssets.map(asset => {
                const isSelected = selectedAsset?.id === asset.id;
                const entropyColor = getEntropyColor(asset.entropyProfile.entropyScore);

                return (
                  <div
                    key={asset.id}
                    onClick={() => {
                      setSelectedAssetId(asset.id);
                      if (onSelectAsset) onSelectAsset(asset.id);
                    }}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-[#161b22] border-[#58a6ff] shadow-md'
                        : 'bg-[#0f141c] border-[#21262d] hover:border-[#388bfd]/50 hover:bg-[#131924]'
                    }`}
                  >
                    {/* Top Row: Icon, Name, Category Badge, Entropy Meter, Organized Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="p-1.5 rounded bg-[#161b22] border border-[#30363d] shrink-0">
                          {getCategoryIcon(asset.primaryCategory)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white truncate" title={asset.name}>
                              {asset.name}
                            </span>
                            <span className="text-[9px] px-1 py-0.2 rounded uppercase font-mono bg-[#21262d] text-[#8b949e]">
                              {asset.extension}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#8b949e]">
                            {asset.fileSizeFormatted} • ID: {asset.id}
                          </span>
                        </div>
                      </div>

                      {/* Right metadata pill group */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Shannon Entropy Pill */}
                        <div className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold flex items-center gap-1 ${entropyColor}`} title={`Shannon Entropy Score: ${asset.entropyProfile.entropyScore}/8.0`}>
                          <BarChart3 size={11} />
                          <span>H = {asset.entropyProfile.entropyScore}</span>
                        </div>

                        {/* Confidence score */}
                        <div className="text-[10px] font-mono text-[#8b949e]" title="AI Heuristic Classification Confidence">
                          {Math.round(asset.confidenceScore * 100)}%
                        </div>

                        {/* Location / Organized Badge */}
                        {asset.isOrganized ? (
                          <span className="px-1.5 py-0.5 rounded bg-[#238636]/20 border border-[#238636]/40 text-[#3fb950] text-[9px] font-bold flex items-center gap-1">
                            <CheckCircle2 size={10} /> Organized
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-[#d29922]/20 border border-[#d29922]/40 text-[#d29922] text-[9px] font-bold flex items-center gap-1" title={`Needs relocation to ${asset.suggestedFolder.suggestedFolderPath}`}>
                            <AlertTriangle size={10} /> Relocate
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle Row: Semantic Tags */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {asset.tags.map(tag => (
                        <span
                          key={tag.id}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium border"
                          style={{
                            backgroundColor: `${tag.colorHex}15`,
                            borderColor: `${tag.colorHex}40`,
                            color: tag.colorHex
                          }}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Row: Path Routing Suggestion */}
                    <div className="flex items-center justify-between text-[10px] bg-[#090d13] p-1.5 rounded border border-[#21262d] font-mono text-[#8b949e]">
                      <div className="flex items-center gap-1.5 truncate">
                        <span>Current: {asset.currentPath}</span>
                        <ArrowRight size={10} className="text-[#58a6ff] shrink-0" />
                        <span className="text-[#58a6ff] font-semibold">Suggested: {asset.suggestedFolder.suggestedFolderPath}</span>
                      </div>
                      <span className="text-[9px] text-[#6e7681] italic shrink-0 hidden sm:inline">
                        {asset.suggestedFolder.reason}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Deep Diagnostic Inspector for Selected Asset */}
        {selectedAsset ? (
          <div className="w-[360px] bg-[#11161d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar border-l border-[#30363d]">
            {/* Inspector Header */}
            <div className="p-3 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders size={13} className="text-[#58a6ff]" /> Asset Entropy & Heuristic Inspector
              </span>
              <span className="text-[10px] text-[#8b949e] font-mono">{selectedAsset.id}</span>
            </div>

            <div className="p-4 space-y-4 text-xs">
              {/* Asset Identity Card */}
              <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(selectedAsset.primaryCategory)}
                  <span className="font-bold text-white text-xs truncate">{selectedAsset.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#8b949e] pt-1 border-t border-[#21262d]">
                  <div>Type: <span className="text-[#c9d1d9]">{selectedAsset.primaryCategory.toUpperCase()}</span></div>
                  <div>Sub-Type: <span className="text-[#c9d1d9]">{selectedAsset.subType}</span></div>
                  <div>Size: <span className="text-[#c9d1d9]">{selectedAsset.fileSizeFormatted}</span></div>
                  <div>Confidence: <span className="text-emerald-400 font-bold">{Math.round(selectedAsset.confidenceScore * 100)}%</span></div>
                </div>
              </div>

              {/* Shannon Entropy & Byte Distribution Histogram */}
              <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#58a6ff] uppercase tracking-wider flex items-center gap-1">
                    <BarChart3 size={12} /> Shannon Entropy Analysis
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {selectedAsset.entropyProfile.entropyScore} / 8.0
                  </span>
                </div>

                <p className="text-[10px] text-[#8b949e]">
                  {selectedAsset.entropyProfile.entropySummary}
                </p>

                {/* 256-Bin Byte Histogram Visualizer */}
                <div className="pt-2">
                  <div className="flex justify-between text-[9px] text-[#6e7681] font-mono mb-1">
                    <span>Byte 0x00</span>
                    <span>Byte Frequency Distribution (256 Bins)</span>
                    <span>Byte 0xFF</span>
                  </div>
                  <div className="h-16 w-full bg-[#05080c] border border-[#21262d] rounded flex items-end px-0.5 py-0.5 gap-[1px] overflow-hidden">
                    {selectedAsset.entropyProfile.byteHistogram.map((val, idx) => {
                      const heightPercent = Math.max(4, Math.round(val * 100));
                      const isHighBit = idx > 127;
                      return (
                        <div
                          key={idx}
                          className={`flex-1 rounded-t-xs transition-all ${
                            isHighBit ? 'bg-[#bc8cff]/70 hover:bg-[#bc8cff]' : 'bg-[#58a6ff]/70 hover:bg-[#58a6ff]'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                          title={`Byte 0x${idx.toString(16).padStart(2, '0').toUpperCase()} (${idx}): Frequency ${(val * 100).toFixed(1)}%`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Statistical Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#8b949e] pt-2 border-t border-[#21262d]">
                  <div>ASCII Ratio: <span className="text-white">{(selectedAsset.entropyProfile.asciiPrintableRatio * 100).toFixed(1)}%</span></div>
                  <div>Null Bytes: <span className="text-white">{(selectedAsset.entropyProfile.nullByteRatio * 100).toFixed(1)}%</span></div>
                  <div>High-Bit Ratio: <span className="text-white">{(selectedAsset.entropyProfile.highBitByteRatio * 100).toFixed(1)}%</span></div>
                  <div>Compression: <span className="text-amber-400 capitalize">{selectedAsset.entropyProfile.compressionEstimation.replace('_', ' ')}</span></div>
                </div>

                {/* Magic Hex Signature */}
                {selectedAsset.entropyProfile.headerMagicBytes && (
                  <div className="text-[10px] font-mono bg-[#090d13] p-1.5 rounded border border-[#21262d] text-[#8b949e]">
                    <span className="text-[#6e7681]">Header Hex: </span>
                    <span className="text-[#3fb950]">{selectedAsset.entropyProfile.headerMagicBytes}</span>
                  </div>
                )}
              </div>

              {/* Heuristic Rules Matched */}
              <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-2">
                <span className="text-[11px] font-bold text-[#e3b341] uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={12} /> Heuristic Inference Rules
                </span>
                <div className="space-y-1">
                  {selectedAsset.heuristicFeatures.matchedRules.map((rule, idx) => (
                    <div key={idx} className="text-[10px] text-[#c9d1d9] flex items-start gap-1.5">
                      <span className="text-[#3fb950] font-bold">✓</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optimization Advice */}
              {selectedAsset.optimizationAdvice.length > 0 && (
                <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-1.5">
                  <span className="text-[11px] font-bold text-[#bc8cff] uppercase tracking-wider flex items-center gap-1">
                    <Sparkle size={12} /> Engine Optimization Advice
                  </span>
                  {selectedAsset.optimizationAdvice.map((adv, idx) => (
                    <p key={idx} className="text-[10px] text-[#8b949e] italic leading-relaxed">
                      • {adv}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-[360px] bg-[#11161d] flex flex-col items-center justify-center text-[#8b949e] text-xs p-6 text-center border-l border-[#30363d]">
            <Sliders size={32} className="text-[#30363d] mb-2" />
            <p>Select an asset on the left to inspect its Shannon Entropy curve, byte frequencies, and heuristic rules.</p>
          </div>
        )}
      </div>
    </div>
  );
}
