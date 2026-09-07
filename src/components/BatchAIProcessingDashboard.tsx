/**
 * @file BatchAIProcessingDashboard.tsx
 * @description หน้าจอแดชบอร์ดประมวลผล Asset แบบกลุ่ม (Batch AI Processing Dashboard) พร้อม Multi-Agent Pipeline และ PBR Map Generation
 * Full-Featured Batch AI Processing Dashboard with Autonomous Multi-Agent Orchestration & Interactive PBR Maps Synthesizer.
 *
 * @system AI Asset Auto-Tagging & Batch Processing Subsystem
 * @module BatchAIProcessingDashboard
 *
 * ------------------------------------------------------------------------------------------------
 * วัตถุประสงค์ (Module Purpose & Responsibility):
 * - ให้ผู้ใช้เลือกกลุ่ม Asset (Untagged Assets หรือ Custom Selection) ใน Content Browser
 * - รัน Multi-Agent Workflow: Taxonomy Inferrer -> Metadata Synthesizer -> PBR Generator -> Quality Validator
 * - สังเคราะห์แผนที่ PBR ที่ขาดหายไป (Normal, Roughness, Metallic, AO, RMA Packed) แบบ Real-time
 * - แสดงสถานะการทำงาน, Agent Thoughts, Interactive Map Previewer, และนำ Asset ที่สร้างเสร็จเข้าสู่ Content Browser
 *
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - ใช้งานร่วมกับ BatchAIMultiAgentOrchestrator.ts, BatchAIPBRGenerator.ts, AIAssetBackgroundWorker.ts
 * - เชื่อมต่อกับ ContentBrowser.tsx (ผ่าน Modal หรือ Embedded Mode) และรองรับการเปิดใช้งานเป็นเครื่องมือหลักใน App.tsx
 *
 * ข้อมูล Input / Output (Data Contracts):
 * - Input Props: initialSelectedAssets, allAssets, onApplyGeneratedAssets, onClose, embeddedMode
 * - Output: เพิ่ม Asset รูปแบบ Texture และ Metadata ใหม่เข้าสู่ Engine Asset Pool
 *
 * การจัดการข้อผิดพลาด (Error Handling & Fallbacks):
 * - ตรวจสอบความถูกต้องของ Canvas Rendering Context, มี fallback สำหรับเบราว์เซอร์ และปุ่ม Cancel/Retry
 * ------------------------------------------------------------------------------------------------
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, Layers, Cpu, CheckCircle2, AlertTriangle, ArrowRight, 
  X, Play, Pause, RotateCcw, Download, Eye, Tag, Palette, Box, 
  Image as ImageIcon, Sliders, Settings2, ShieldCheck, Terminal, 
  Check, Filter, RefreshCw, FolderPlus, Zap, FilePlus, ChevronRight,
  Maximize2, Database, HelpCircle
} from 'lucide-react';
import { 
  BatchAIMultiAgentOrchestrator, 
  BatchItemExecutionResult, 
  AgentLogEntry, 
  AgentRole 
} from '../utils/BatchAIMultiAgentOrchestrator';
import { PBRGenerationConfig, GeneratedPBRMapSet } from '../utils/BatchAIPBRGenerator';
import { AIAssetBackgroundWorker } from '../utils/AIAssetBackgroundWorker';
import { AnalyzedProjectAsset } from '../utils/AssetClassificationTypes';

export interface BatchAIProcessingDashboardProps {
  initialSelectedAssetIds?: string[];
  allAssets?: Array<{ id: string; name: string; type: any; folderId: string }>;
  onApplyGeneratedAssets?: (newAssets: Array<{ id: string; name: string; type: any; folderId: string }>) => void;
  onClose?: () => void;
  embeddedMode?: boolean;
}

export default function BatchAIProcessingDashboard({
  initialSelectedAssetIds = [],
  allAssets = [],
  onApplyGeneratedAssets,
  onClose,
  embeddedMode = false
}: BatchAIProcessingDashboardProps) {
  // Default Demo Assets หากไม่ได้ส่งเข้ามา
  const fallbackAssets = useMemo(() => [
    { id: 'a1', name: 'M_Ruby_PBR', type: 'mat', folderId: '4' },
    { id: 'a2', name: 'M_ChromeBase', type: 'mat', folderId: '4' },
    { id: 'a3', name: 'M_PlasticWhite', type: 'mat', folderId: '4' },
    { id: 'a4', name: 'BP_PlayerCharacter', type: 'bp', folderId: '3' },
    { id: 'bp_agent', name: 'BP_AI_Agent', type: 'bp', folderId: '3' },
    { id: 'a5', name: 'T_Noise_01', type: 'tex', folderId: '6' },
    { id: 'a6', name: 'SKM_HeroMesh', type: 'skm', folderId: '3' },
    { id: 'a7', name: 'S_Jump_01', type: 'wav', folderId: '1' },
    { id: 'a8', name: 'SM_Barrel', type: 'obj', folderId: '5' },
    { id: 'a9', name: 'SK_Dragon', type: 'fbx', folderId: '3' },
  ], []);

  const assetPool = allAssets.length > 0 ? allAssets : fallbackAssets;

  // Background Worker for retrieving already analyzed metadata
  const worker = useMemo(() => AIAssetBackgroundWorker.getInstance(), []);
  const analyzedAssets = worker.getAnalyzedAssets();
  const analyzedMap = useMemo(() => {
    const map = new Map<string, AnalyzedProjectAsset>();
    analyzedAssets.forEach(a => map.set(a.id, a));
    return map;
  }, [analyzedAssets]);

  // Selected Assets for Batch Processing
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    if (initialSelectedAssetIds.length > 0) {
      return new Set(initialSelectedAssetIds);
    }
    // Default: select all untagged assets or assets lacking PBR normal/roughness
    const untaggedIds = assetPool
      .filter(a => {
        const analyzed = analyzedMap.get(a.id);
        return !analyzed || analyzed.tags.length === 0 || a.type === 'mat' || a.type === 'obj' || a.type === 'fbx';
      })
      .map(a => a.id);
    return new Set(untaggedIds.length > 0 ? untaggedIds : assetPool.slice(0, 4).map(a => a.id));
  });

  // Filter tab for asset selection
  const [assetFilterTab, setAssetFilterTab] = useState<'all' | 'untagged' | 'materials_meshes' | 'textures'>('untagged');
  const [searchQuery, setSearchQuery] = useState('');

  // Active View Tab: 'configure' | 'pipeline_execution' | 'results_inspector'
  const [activeTab, setActiveTab] = useState<'configure' | 'pipeline_execution' | 'results_inspector'>('configure');

  // Multi-Agent Workflow configuration
  const [enabledAgents, setEnabledAgents] = useState({
    taxonomyInfer: true,
    metadataSynthesizer: true,
    pbrTextureGen: true,
    consistencyValidator: true
  });

  // PBR Generation Settings
  const [pbrConfig, setPbrConfig] = useState<PBRGenerationConfig>({
    resolution: 512,
    normalIntensity: 1.2,
    normalFormat: 'DirectX',
    roughnessBase: 0.5,
    roughnessContrast: 1.1,
    metallicBase: 0.0,
    metallicOxideVariation: true,
    generateAO: true,
    packRMA: true
  });

  // Pipeline Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentProcessingAsset, setCurrentProcessingAsset] = useState<string>('');
  const [agentLogs, setAgentLogs] = useState<AgentLogEntry[]>([]);
  const [itemResults, setItemResults] = useState<BatchItemExecutionResult[]>([]);
  const [selectedResultItem, setSelectedResultItem] = useState<BatchItemExecutionResult | null>(null);
  const [activePreviewMapType, setActivePreviewMapType] = useState<'normal' | 'roughness' | 'metallic' | 'ao' | 'rma'>('normal');

  // Preview Modal for single map enlargement
  const [zoomedMapUrl, setZoomedMapUrl] = useState<{ name: string; url: string } | null>(null);

  // Terminal scroll ref
  const terminalLogsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal logs
  useEffect(() => {
    if (activeTab === 'pipeline_execution') {
      terminalLogsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [agentLogs, activeTab]);

  // Filtered list of assets in the selection table
  const displayedAssets = useMemo(() => {
    return assetPool.filter(a => {
      if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      const analyzed = analyzedMap.get(a.id);
      const isUntagged = !analyzed || analyzed.tags.length === 0;

      if (assetFilterTab === 'untagged') return isUntagged;
      if (assetFilterTab === 'materials_meshes') return ['mat', 'obj', 'fbx', 'skm'].includes(a.type);
      if (assetFilterTab === 'textures') return a.type === 'tex';
      return true;
    });
  }, [assetPool, assetFilterTab, searchQuery, analyzedMap]);

  // Handle Toggle Asset Selection
  const toggleSelectAsset = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAllFiltered = () => {
    const next = new Set(selectedIds);
    displayedAssets.forEach(a => next.add(a.id));
    setSelectedIds(next);
  };

  const deselectAllFiltered = () => {
    const next = new Set(selectedIds);
    displayedAssets.forEach(a => next.delete(a.id));
    setSelectedIds(next);
  };

  // Run the Multi-Agent Batch Pipeline
  const handleStartBatchPipeline = async () => {
    const targetAssets = assetPool.filter(a => selectedIds.has(a.id));
    if (targetAssets.length === 0) {
      alert('Please select at least 1 asset to process.');
      return;
    }

    setIsProcessing(true);
    setActiveTab('pipeline_execution');
    setProgressPercent(0);
    setAgentLogs([]);
    setItemResults([]);

    const result = await BatchAIMultiAgentOrchestrator.executeBatchWorkflow({
      assets: targetAssets,
      pbrConfig,
      enabledAgents,
      onProgress: (percent, currentIdx, currentName, logs) => {
        setProgressPercent(percent);
        setCurrentProcessingAsset(currentName);
        setAgentLogs([...logs]);
      },
      onItemCompleted: (itemRes) => {
        setItemResults(prev => [...prev, itemRes]);
      }
    });

    setIsProcessing(false);
    setItemResults(result.itemResults);
    setAgentLogs(result.logs);
    if (result.itemResults.length > 0) {
      setSelectedResultItem(result.itemResults[0]);
    }
    setActiveTab('results_inspector');
  };

  // Apply Generated PBR Textures to Content Browser
  const handleApplyToContentBrowser = () => {
    if (itemResults.length === 0) return;

    const newAssetsToInject: Array<{ id: string; name: string; type: any; folderId: string }> = [];

    itemResults.forEach(item => {
      if (item.pbrMapSet) {
        const maps = item.pbrMapSet.maps;
        // Add Normal Map Asset
        newAssetsToInject.push({
          id: `pbr_n_${item.assetId}_${Date.now()}`,
          name: maps.normalMapName,
          type: 'tex',
          folderId: '6' // Textures folder
        });
        // Add Roughness Map Asset
        newAssetsToInject.push({
          id: `pbr_r_${item.assetId}_${Date.now()}`,
          name: maps.roughnessMapName,
          type: 'tex',
          folderId: '6'
        });
        // Add Metallic Map Asset
        newAssetsToInject.push({
          id: `pbr_m_${item.assetId}_${Date.now()}`,
          name: maps.metallicMapName,
          type: 'tex',
          folderId: '6'
        });
        // Add AO Map Asset
        newAssetsToInject.push({
          id: `pbr_ao_${item.assetId}_${Date.now()}`,
          name: maps.aoMapName,
          type: 'tex',
          folderId: '6'
        });
      }
    });

    if (onApplyGeneratedAssets) {
      onApplyGeneratedAssets(newAssetsToInject);
    } else {
      // Enqueue to Background Worker
      worker.enqueueAssets(newAssetsToInject);
    }

    alert(`Successfully injected ${newAssetsToInject.length} synthesized PBR texture maps into Content Browser (Textures folder)!`);
    if (onClose) onClose();
  };

  return (
    <div className={`w-full h-full bg-[#0d1117] text-[#c9d1d9] flex flex-col font-sans select-none overflow-hidden ${embeddedMode ? '' : 'rounded-none'}`}>
      {/* Top Header Bar */}
      <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-2 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Sparkles size={18} className="text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                Batch AI Processing <span className="text-[#58a6ff]">Dashboard</span>
              </h1>
              <span className="text-[10px] bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40 px-2 py-0.5 rounded-full font-mono font-semibold">
                Multi-Agent PBR Pipeline
              </span>
            </div>
            <p className="text-[10px] text-[#8b949e]">
              Infer Metadata & Procedurally Synthesize Normal, Roughness, Metallic & AO Texture Sets
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
          <button
            onClick={() => setActiveTab('configure')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'configure'
                ? 'bg-[#1f6feb] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'
            }`}
          >
            <Sliders size={13} /> 1. Select & Configure
          </button>
          <button
            onClick={() => setActiveTab('pipeline_execution')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'pipeline_execution'
                ? 'bg-[#1f6feb] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'
            }`}
          >
            <Cpu size={13} className={isProcessing ? 'animate-spin text-amber-400' : ''} /> 
            2. Multi-Agent Run {isProcessing && `(${progressPercent}%)`}
          </button>
          <button
            onClick={() => setActiveTab('results_inspector')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'results_inspector'
                ? 'bg-[#1f6feb] text-white shadow-sm'
                : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'
            }`}
          >
            <Palette size={13} /> 3. PBR Maps & Inspector ({itemResults.length})
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {activeTab === 'configure' ? (
            <button
              onClick={handleStartBatchPipeline}
              disabled={selectedIds.size === 0 || isProcessing}
              className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                selectedIds.size === 0 || isProcessing
                  ? 'bg-[#21262d] text-[#6e7681] border border-[#30363d] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3fb950] text-white shadow-[0_0_15px_rgba(46,160,67,0.3)]'
              }`}
            >
              <Play size={13} fill="currentColor" /> Run Batch AI Pipeline ({selectedIds.size})
            </button>
          ) : activeTab === 'results_inspector' ? (
            <button
              onClick={handleApplyToContentBrowser}
              disabled={itemResults.length === 0}
              className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
            >
              <CheckCircle2 size={14} /> Apply to Content Browser
            </button>
          ) : null}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-md transition-colors cursor-pointer"
              title="Close Dashboard"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ========================================================================= */}
        {/* TAB 1: SELECT ASSETS & CONFIGURE PIPELINE                                 */}
        {/* ========================================================================= */}
        {activeTab === 'configure' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Asset Selection Table */}
            <div className="flex-1 flex flex-col border-r border-[#30363d] bg-[#0d1117]">
              {/* Filter Sub-bar */}
              <div className="p-3 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAssetFilterTab('untagged')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      assetFilterTab === 'untagged' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:bg-[#21262d]'
                    }`}
                  >
                    Untagged Only
                  </button>
                  <button
                    onClick={() => setAssetFilterTab('materials_meshes')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      assetFilterTab === 'materials_meshes' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:bg-[#21262d]'
                    }`}
                  >
                    Materials & Meshes
                  </button>
                  <button
                    onClick={() => setAssetFilterTab('textures')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      assetFilterTab === 'textures' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:bg-[#21262d]'
                    }`}
                  >
                    Textures
                  </button>
                  <button
                    onClick={() => setAssetFilterTab('all')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      assetFilterTab === 'all' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:bg-[#21262d]'
                    }`}
                  >
                    All Assets ({assetPool.length})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search asset names..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-[#0d1117] border border-[#30363d] rounded px-2.5 py-1 text-xs text-white placeholder-[#6e7681] outline-none focus:border-[#58a6ff] w-48"
                  />
                  <button
                    onClick={selectAllFiltered}
                    className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAllFiltered}
                    className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#c9d1d9] rounded text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Asset List Grid/Table */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
                {displayedAssets.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-[#6e7681] text-xs">
                    <Filter size={24} className="mb-2 opacity-50" />
                    <span>No assets found matching this filter.</span>
                  </div>
                ) : (
                  displayedAssets.map(asset => {
                    const isSelected = selectedIds.has(asset.id);
                    const analyzed = analyzedMap.get(asset.id);
                    const isUntagged = !analyzed || analyzed.tags.length === 0;

                    return (
                      <div
                        key={asset.id}
                        onClick={() => toggleSelectAsset(asset.id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1f6feb]/15 border-[#1f6feb]/60 text-white shadow-sm'
                            : 'bg-[#161b22] border-[#30363d] hover:border-[#8b949e]/50 text-[#c9d1d9]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // Handled by parent div
                            className="accent-[#1f6feb] w-4 h-4 rounded cursor-pointer shrink-0"
                          />
                          
                          {/* Asset Type Icon */}
                          <div className="w-8 h-8 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-center shrink-0">
                            {asset.type === 'mat' ? <Palette size={14} className="text-[#f85149]" /> :
                             asset.type === 'tex' ? <ImageIcon size={14} className="text-[#3fb950]" /> :
                             asset.type === 'obj' || asset.type === 'fbx' || asset.type === 'skm' ? <Box size={14} className="text-[#58a6ff]" /> :
                             <Zap size={14} className="text-[#e3b341]" />}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold truncate" title={asset.name}>
                              {asset.name}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-[#8b949e]">
                              <span className="uppercase font-mono">{asset.type}</span>
                              <span>•</span>
                              <span>Folder: {asset.folderId}</span>
                              {analyzed && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-[#e3b341]">
                                    H={analyzed.entropyProfile.entropyScore}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Semantic Tag / Untagged Badge */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {isUntagged ? (
                            <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded font-mono font-medium">
                              Untagged
                            </span>
                          ) : (
                            <div className="flex gap-1">
                              {analyzed.tags.slice(0, 2).map(tag => (
                                <span
                                  key={tag.id}
                                  className="text-[9px] px-1.5 py-0.5 rounded font-medium border"
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
                          )}

                          <span className="text-[10px] bg-[#0d1117] text-[#58a6ff] px-2 py-0.5 rounded font-mono border border-[#30363d]">
                            +4 PBR Maps
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Selection Summary Footer */}
              <div className="p-3 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between text-xs text-[#8b949e]">
                <div>
                  Selected: <span className="text-white font-bold">{selectedIds.size}</span> of {assetPool.length} assets
                </div>
                <div className="font-mono text-[11px] text-[#3fb950]">
                  Target Outputs: {selectedIds.size * 4} Texture Maps + RMA Packs
                </div>
              </div>
            </div>

            {/* Right: Multi-Agent & PBR Synthesis Parameters */}
            <div className="w-[360px] bg-[#161b22] flex flex-col overflow-y-auto custom-scrollbar shrink-0 p-4 space-y-5">
              
              {/* Multi-Agent Architecture Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu size={14} className="text-[#58a6ff]" /> Multi-Agent Workflow
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono">4 Agents Ready</span>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2 rounded bg-[#0d1117] border border-[#30363d] text-xs cursor-pointer hover:border-[#1f6feb]/50">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">1. Taxonomy & Tag Infer Agent</span>
                      <span className="text-[10px] text-[#8b949e]">Classifies semantics & Shannon Entropy</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enabledAgents.taxonomyInfer}
                      onChange={e => setEnabledAgents({ ...enabledAgents, taxonomyInfer: e.target.checked })}
                      className="accent-[#1f6feb] w-3.5 h-3.5"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-[#0d1117] border border-[#30363d] text-xs cursor-pointer hover:border-[#1f6feb]/50">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">2. Physical Metadata Agent</span>
                      <span className="text-[10px] text-[#8b949e]">Synthesizes density, friction & shader model</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enabledAgents.metadataSynthesizer}
                      onChange={e => setEnabledAgents({ ...enabledAgents, metadataSynthesizer: e.target.checked })}
                      className="accent-[#1f6feb] w-3.5 h-3.5"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-[#0d1117] border border-[#30363d] text-xs cursor-pointer hover:border-[#1f6feb]/50">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">3. PBR Texture Generator Agent</span>
                      <span className="text-[10px] text-[#8b949e]">Sobel Normal, Roughness, Metallic & AO</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enabledAgents.pbrTextureGen}
                      onChange={e => setEnabledAgents({ ...enabledAgents, pbrTextureGen: e.target.checked })}
                      className="accent-[#1f6feb] w-3.5 h-3.5"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-[#0d1117] border border-[#30363d] text-xs cursor-pointer hover:border-[#1f6feb]/50">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">4. Quality & Compliance Agent</span>
                      <span className="text-[10px] text-[#8b949e]">Verifies POT resolution & Linear colorspace</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enabledAgents.consistencyValidator}
                      onChange={e => setEnabledAgents({ ...enabledAgents, consistencyValidator: e.target.checked })}
                      className="accent-[#1f6feb] w-3.5 h-3.5"
                    />
                  </label>
                </div>
              </div>

              {/* PBR Generation Parameters */}
              <div className="space-y-3 pt-3 border-t border-[#30363d]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={14} className="text-[#e3b341]" /> PBR Synthesizer Settings
                </h3>

                {/* Resolution */}
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8b949e] font-semibold flex justify-between">
                    <span>Texture Resolution</span>
                    <span className="text-white font-mono">{pbrConfig.resolution}x{pbrConfig.resolution}</span>
                  </label>
                  <select
                    value={pbrConfig.resolution}
                    onChange={e => setPbrConfig({ ...pbrConfig, resolution: Number(e.target.value) })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#58a6ff]"
                  >
                    <option value={256}>256 x 256 (Mobile / LOD)</option>
                    <option value={512}>512 x 512 (Standard Balanced)</option>
                    <option value={1024}>1024 x 1024 (Hero Prop)</option>
                    <option value={2048}>2048 x 2048 (4K Master Cinematic)</option>
                  </select>
                </div>

                {/* Normal Format */}
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8b949e] font-semibold flex justify-between">
                    <span>Normal Tangent Format</span>
                    <span className="text-[#58a6ff] font-mono">{pbrConfig.normalFormat}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPbrConfig({ ...pbrConfig, normalFormat: 'DirectX' })}
                      className={`py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                        pbrConfig.normalFormat === 'DirectX'
                          ? 'bg-[#1f6feb]/20 border-[#1f6feb] text-white'
                          : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'
                      }`}
                    >
                      DirectX (-Y / Unreal)
                    </button>
                    <button
                      onClick={() => setPbrConfig({ ...pbrConfig, normalFormat: 'OpenGL' })}
                      className={`py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                        pbrConfig.normalFormat === 'OpenGL'
                          ? 'bg-[#1f6feb]/20 border-[#1f6feb] text-white'
                          : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'
                      }`}
                    >
                      OpenGL (+Y / Unity)
                    </button>
                  </div>
                </div>

                {/* Normal Intensity Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8b949e] font-semibold">Normal Bevel Intensity</span>
                    <span className="text-white font-mono">{pbrConfig.normalIntensity.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.1"
                    value={pbrConfig.normalIntensity}
                    onChange={e => setPbrConfig({ ...pbrConfig, normalIntensity: parseFloat(e.target.value) })}
                    className="w-full accent-[#58a6ff] cursor-pointer"
                  />
                </div>

                {/* Roughness Contrast Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8b949e] font-semibold">Micro-surface Roughness Contrast</span>
                    <span className="text-white font-mono">{pbrConfig.roughnessContrast.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={pbrConfig.roughnessContrast}
                    onChange={e => setPbrConfig({ ...pbrConfig, roughnessContrast: parseFloat(e.target.value) })}
                    className="w-full accent-[#58a6ff] cursor-pointer"
                  />
                </div>

                {/* Channel Packing Toggle */}
                <div className="pt-2 space-y-2">
                  <label className="flex items-center justify-between p-2 rounded bg-[#0d1117] border border-[#30363d] text-xs cursor-pointer hover:border-[#1f6feb]/50">
                    <div>
                      <span className="font-semibold text-white">RMA Texture Packing</span>
                      <p className="text-[10px] text-[#8b949e]">R: Roughness, G: Metallic, B: AO</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pbrConfig.packRMA}
                      onChange={e => setPbrConfig({ ...pbrConfig, packRMA: e.target.checked })}
                      className="accent-[#1f6feb] w-3.5 h-3.5"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-[#0d1117] border border-[#30363d] text-xs cursor-pointer hover:border-[#1f6feb]/50">
                    <div>
                      <span className="font-semibold text-white">Oxide / Crevice Rust Variation</span>
                      <p className="text-[10px] text-[#8b949e]">Generates dielectric weathering in deep crevices</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pbrConfig.metallicOxideVariation}
                      onChange={e => setPbrConfig({ ...pbrConfig, metallicOxideVariation: e.target.checked })}
                      className="accent-[#1f6feb] w-3.5 h-3.5"
                    />
                  </label>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PIPELINE EXECUTION & AGENT THOUGHT LOGS                             */}
        {/* ========================================================================= */}
        {activeTab === 'pipeline_execution' && (
          <div className="flex-1 flex flex-col bg-[#0d1117]">
            {/* Top Multi-Agent Workflow State Diagram */}
            <div className="p-4 bg-[#161b22] border-b border-[#30363d] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap size={14} className="text-amber-400" /> Active Autonomous Agents Pipeline
                  </h2>
                  <p className="text-[11px] text-[#8b949e]">
                    Processing: <span className="text-[#58a6ff] font-mono font-bold">{currentProcessingAsset || 'Initializing...'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-mono text-white font-bold">{progressPercent}%</div>
                    <div className="text-[10px] text-[#8b949e]">{itemResults.length} / {selectedIds.size} Assets</div>
                  </div>
                  {isProcessing && (
                    <button
                      onClick={() => BatchAIMultiAgentOrchestrator.cancelExecution()}
                      className="px-3 py-1 bg-[#da3633] hover:bg-[#f85149] text-white rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel Run
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
                <div
                  className="h-full bg-gradient-to-r from-[#1f6feb] via-[#58a6ff] to-[#3fb950] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* 4 Agent Nodes Visual Graph */}
              <div className="grid grid-cols-4 gap-3 pt-1">
                {[
                  { name: 'Taxonomy Inferrer', role: 'TaxonomyInferAgent' as AgentRole, desc: 'Heuristics & Tags', icon: Tag },
                  { name: 'Metadata Synthesizer', role: 'MetadataSynthesizerAgent' as AgentRole, desc: 'Physics & LODs', icon: Database },
                  { name: 'PBR Generator', role: 'PBRTextureGeneratorAgent' as AgentRole, desc: 'Sobel Normal & RMA', icon: Palette },
                  { name: 'Quality Validator', role: 'ConsistencyValidatorAgent' as AgentRole, desc: 'Color & POT Audit', icon: ShieldCheck },
                ].map((agent, idx) => (
                  <div
                    key={agent.role}
                    className={`p-2.5 rounded-lg border flex items-center gap-2.5 transition-all ${
                      isProcessing
                        ? 'bg-[#0d1117] border-[#1f6feb] shadow-[0_0_10px_rgba(31,111,235,0.2)]'
                        : 'bg-[#0d1117] border-[#30363d]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#58a6ff] shrink-0">
                      <agent.icon size={13} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-white truncate">{agent.name}</div>
                      <div className="text-[9px] text-[#8b949e] truncate">{agent.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Log Stream */}
            <div className="flex-1 p-4 bg-[#0a0c10] font-mono text-xs overflow-y-auto custom-scrollbar flex flex-col">
              <div className="text-[#8b949e] border-b border-[#21262d] pb-2 mb-3 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Terminal size={13} className="text-[#58a6ff]" /> Live Multi-Agent Thought & Execution Stream
                </span>
                <span>{agentLogs.length} events logged</span>
              </div>

              <div className="space-y-1.5 flex-1">
                {agentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#6e7681] text-[10px] shrink-0 select-none">[{log.timestamp}]</span>
                    
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase shrink-0 ${
                        log.agentRole === 'TaxonomyInferAgent' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                        log.agentRole === 'MetadataSynthesizerAgent' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' :
                        log.agentRole === 'PBRTextureGeneratorAgent' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {log.agentRole.replace('Agent', '')}
                    </span>

                    <span className="text-[#8b949e] shrink-0">[{log.assetName}]:</span>

                    <span
                      className={`${
                        log.level === 'error' ? 'text-red-400 font-bold' :
                        log.level === 'warn' ? 'text-amber-400' :
                        log.level === 'success' ? 'text-emerald-300 font-semibold' :
                        log.level === 'reasoning' ? 'text-[#8b949e] italic' :
                        'text-[#c9d1d9]'
                      }`}
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={terminalLogsEndRef} />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RESULTS & INTERACTIVE PBR MAP INSPECTOR                             */}
        {/* ========================================================================= */}
        {activeTab === 'results_inspector' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Processed Asset List */}
            <div className="w-80 bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
              <div className="p-3 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Processed Assets ({itemResults.length})
                </span>
                <span className="text-[10px] text-[#3fb950] font-mono">
                  {itemResults.filter(r => r.status === 'completed').length} Ready
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {itemResults.map(item => {
                  const isSelected = selectedResultItem?.assetId === item.assetId;
                  return (
                    <div
                      key={item.assetId}
                      onClick={() => setSelectedResultItem(item)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1f6feb]/20 border-[#1f6feb] text-white shadow-sm'
                          : 'bg-[#0d1117] border-[#30363d] hover:border-[#8b949e]/50 text-[#c9d1d9]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate" title={item.assetName}>
                          {item.assetName}
                        </span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                          {item.executionTimeMs}ms
                        </span>
                      </div>

                      <div className="text-[10px] text-[#8b949e] mt-1 flex items-center gap-1.5">
                        <span className="text-[#58a6ff] truncate">{item.inferredMaterialType}</span>
                        <span>•</span>
                        <span>{item.generatedTags.length} Tags</span>
                      </div>

                      {/* Mini Map Badges */}
                      <div className="flex gap-1 mt-2">
                        {['Normal', 'Rough', 'Metal', 'AO'].map(m => (
                          <span key={m} className="text-[8px] bg-[#161b22] text-[#8b949e] px-1 rounded font-mono border border-[#30363d]">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Asset PBR Maps Inspector */}
            {selectedResultItem && selectedResultItem.pbrMapSet ? (
              <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto custom-scrollbar p-5 space-y-6">
                
                {/* Asset Header & Inferred Metadata */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-white">{selectedResultItem.assetName}</h2>
                      <span className="text-[10px] bg-[#1f6feb]/20 text-[#58a6ff] px-2 py-0.5 rounded font-mono border border-[#1f6feb]/30">
                        {selectedResultItem.inferredMaterialType}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8b949e] mt-1">
                      Suggested Taxonomy: <span className="text-[#58a6ff] font-mono">{selectedResultItem.suggestedFolderPath}</span>
                    </p>
                  </div>

                  {/* Semantic Tags */}
                  <div className="flex flex-wrap gap-1 max-w-xs justify-end">
                    {selectedResultItem.generatedTags.map(tag => (
                      <span
                        key={tag.id}
                        className="text-[9px] px-2 py-0.5 rounded font-medium border"
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
                </div>

                {/* Generated PBR Map Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Palette size={14} className="text-[#58a6ff]" /> Synthesized PBR Maps ({selectedResultItem.pbrMapSet.resolution}x{selectedResultItem.pbrMapSet.resolution})
                    </h3>
                    <span className="text-[10px] text-[#8b949e]">Click any map to enlarge</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Normal Map */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex flex-col gap-2 group hover:border-[#58a6ff] transition-all">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#58a6ff]">
                        <span>Tangent Normal (RGB)</span>
                        <button
                          onClick={() => setZoomedMapUrl({ name: selectedResultItem.pbrMapSet!.maps.normalMapName, url: selectedResultItem.pbrMapSet!.maps.normalMapUrl })}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-white transition-opacity"
                        >
                          <Maximize2 size={12} />
                        </button>
                      </div>
                      <div className="aspect-square bg-black rounded border border-[#30363d] overflow-hidden relative">
                        <img
                          src={selectedResultItem.pbrMapSet.maps.normalMapUrl}
                          alt="Normal Map"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-[#8b949e] truncate" title={selectedResultItem.pbrMapSet.maps.normalMapName}>
                        {selectedResultItem.pbrMapSet.maps.normalMapName}
                      </span>
                    </div>

                    {/* Roughness Map */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex flex-col gap-2 group hover:border-[#58a6ff] transition-all">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                        <span>Roughness (Greyscale)</span>
                        <button
                          onClick={() => setZoomedMapUrl({ name: selectedResultItem.pbrMapSet!.maps.roughnessMapName, url: selectedResultItem.pbrMapSet!.maps.roughnessMapUrl })}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-white transition-opacity"
                        >
                          <Maximize2 size={12} />
                        </button>
                      </div>
                      <div className="aspect-square bg-black rounded border border-[#30363d] overflow-hidden relative">
                        <img
                          src={selectedResultItem.pbrMapSet.maps.roughnessMapUrl}
                          alt="Roughness Map"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-[#8b949e] truncate" title={selectedResultItem.pbrMapSet.maps.roughnessMapName}>
                        {selectedResultItem.pbrMapSet.maps.roughnessMapName}
                      </span>
                    </div>

                    {/* Metallic Map */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex flex-col gap-2 group hover:border-[#58a6ff] transition-all">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                        <span>Metallic Mask</span>
                        <button
                          onClick={() => setZoomedMapUrl({ name: selectedResultItem.pbrMapSet!.maps.metallicMapName, url: selectedResultItem.pbrMapSet!.maps.metallicMapUrl })}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-white transition-opacity"
                        >
                          <Maximize2 size={12} />
                        </button>
                      </div>
                      <div className="aspect-square bg-black rounded border border-[#30363d] overflow-hidden relative">
                        <img
                          src={selectedResultItem.pbrMapSet.maps.metallicMapUrl}
                          alt="Metallic Map"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-[#8b949e] truncate" title={selectedResultItem.pbrMapSet.maps.metallicMapName}>
                        {selectedResultItem.pbrMapSet.maps.metallicMapName}
                      </span>
                    </div>

                    {/* Ambient Occlusion (AO) */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex flex-col gap-2 group hover:border-[#58a6ff] transition-all">
                      <div className="flex items-center justify-between text-[11px] font-bold text-indigo-400">
                        <span>Ambient Occlusion</span>
                        <button
                          onClick={() => setZoomedMapUrl({ name: selectedResultItem.pbrMapSet!.maps.aoMapName, url: selectedResultItem.pbrMapSet!.maps.aoMapName })}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-white transition-opacity"
                        >
                          <Maximize2 size={12} />
                        </button>
                      </div>
                      <div className="aspect-square bg-black rounded border border-[#30363d] overflow-hidden relative">
                        <img
                          src={selectedResultItem.pbrMapSet.maps.aoMapUrl}
                          alt="AO Map"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-[#8b949e] truncate" title={selectedResultItem.pbrMapSet.maps.aoMapName}>
                        {selectedResultItem.pbrMapSet.maps.aoMapName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inferred Physical & Shader Metadata Card */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Database size={13} className="text-[#3fb950]" /> Inferred Physical & Rendering Dynamics
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
                      <div className="text-[10px] text-[#8b949e]">Shader Model</div>
                      <div className="font-bold text-white truncate">{selectedResultItem.pbrMapSet.metadata.shaderModelSuggestion}</div>
                    </div>
                    <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
                      <div className="text-[10px] text-[#8b949e]">Physical Density</div>
                      <div className="font-bold text-white font-mono">{selectedResultItem.pbrMapSet.metadata.physicalDensityKgM3} kg/m³</div>
                    </div>
                    <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
                      <div className="text-[10px] text-[#8b949e]">Friction Coeff</div>
                      <div className="font-bold text-white font-mono">{selectedResultItem.pbrMapSet.metadata.frictionCoefficient}</div>
                    </div>
                    <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
                      <div className="text-[10px] text-[#8b949e]">Restitution (Bounce)</div>
                      <div className="font-bold text-white font-mono">{selectedResultItem.pbrMapSet.metadata.restitutionBounciness}</div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#8b949e] text-xs">
                Select a processed asset from the left to inspect its synthesized PBR maps.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Enlarged Map Preview Lightbox */}
      {zoomedMapUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6"
          onClick={() => setZoomedMapUrl(null)}
        >
          <div 
            className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 max-w-xl w-full flex flex-col gap-3 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono truncate">{zoomedMapUrl.name}</span>
              <div className="flex items-center gap-2">
                <a
                  href={zoomedMapUrl.url}
                  download={`${zoomedMapUrl.name}.png`}
                  className="bg-[#1f6feb] hover:bg-[#388bfd] text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={12} /> Save PNG
                </a>
                <button
                  onClick={() => setZoomedMapUrl(null)}
                  className="text-[#8b949e] hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="w-full aspect-square bg-black rounded-lg border border-[#30363d] overflow-hidden flex items-center justify-center">
              <img src={zoomedMapUrl.url} alt={zoomedMapUrl.name} className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
