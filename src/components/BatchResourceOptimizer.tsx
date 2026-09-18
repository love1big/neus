/**
 * ============================================================================
 * MODULE: BatchResourceOptimizer.tsx
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * หน้าจอส่วนต่อประสานผู้ใช้ระดับสตูดิโอ (Studio-Grade UI Component) สำหรับระบบ
 * "Batch Resource Optimizer" ช่วยให้นักพัฒนาเกมสามารถเลือกสินทรัพย์หลายรายการ
 * จาก ContentBrowser (ทั้ง 3D Meshes, PBR Textures, Audio Clips, และ Materials)
 * เพื่อนำมาคำนวณและประมวลผลการลดทอนโพลีกอน (Mesh LOD Decimation), การบีบอัดภาพ
 * ระดับฮาร์ดแวร์ GPU (GPU Block Compression & Mipmaps), และการแปลงสัญญาณเสียง
 * (Audio Bitrate Transcoding) ภายใต้กระบวนการรันแบบรวมศูนย์ (Unified Pass)
 * พร้อมแสดงผลการเปรียบเทียบ A/B Split View, Interactive 3D Wireframe, และบันทึก
 * กลับเข้าสู่โปรเจกต์ได้ทันที.
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - เชื่อมต่อกับ: ContentBrowser.tsx ผ่าน Props `allAssets` และ `initialSelectedAssetIds`
 * - สั่งการรันผ่าน: BatchOptimizationPassRunner.ts
 * - ดึงคอนฟิกสำเร็จรูปจาก: OptimizationPresetRepository.ts
 * - สอดคล้องกับกฎระเบียบ: 1 Node = 1 File และ Zero-Slop Professional Design
 * 
 * ข้อมูลการรับส่ง (Inputs, Outputs & Data Contracts):
 * ----------------------------------------------------------------------------
 * - Props:
 *   - `allAssets`: รายการ Asset ทั้งหมดจาก ContentBrowser
 *   - `initialSelectedAssetIds`: รหัส Asset ที่ถูกเลือกไว้ล่วงหน้า
 *   - `onClose`: Callback เมื่อปิดหน้าต่าง
 *   - `onApplyOptimizedAssets`: Callback ส่งข้อมูลที่ Optimize สำเร็จกลับไปอัปเดต ContentBrowser
 *   - `embeddedMode`: ธงระบุว่ากำลังแสดงแบบ Modal หรือ Standalone Tool ใน App.tsx
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - มีระบบ Fallback Mock Assets กรณีไม่มีการส่ง `allAssets` เข้ามา
 * - ป้องกันการรันซ้ำซ้อนขณะกำลังประมวลผลด้วย state `isProcessing`
 * - รองรับปุ่ม Cancel Signal เพื่อหยุดงานกลางคันอย่างปลอดภัย
 * 
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ----------------------------------------------------------------------------
 * <BatchResourceOptimizer
 *   allAssets={assets}
 *   initialSelectedAssetIds={['a8', 'a5', 'a7']}
 *   onApplyOptimizedAssets={(updatedAssets, manifest) => { ... }}
 *   onClose={() => setIsModalOpen(false)}
 * />
 * ============================================================================
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Zap,
  Box,
  Image,
  Volume2,
  Settings2,
  Play,
  Square,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  RefreshCw,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Monitor,
  Gamepad2,
  Smartphone,
  Glasses,
  Globe,
  Sliders,
  Maximize2,
  Sparkles,
  Eye,
  CheckSquare,
  Trash2,
  ArrowRight,
  Save,
  Clock,
  HardDrive,
  Activity,
  X
} from 'lucide-react';

import {
  OptimizableAsset,
  OptimizationPresetDefinition,
  PlatformOptimizationPresetType,
  OptimizedAssetResult,
  BatchOptimizationManifest,
  AssetCategoryType,
  GPUBlockCompressionFormat,
  AudioCodecTarget
} from '../utils/batchOptimizer/BatchOptimizerTypes';
import { OptimizationPresetRepository } from '../utils/batchOptimizer/OptimizationPresetRepository';
import { BatchOptimizationPassRunner } from '../utils/batchOptimizer/BatchOptimizationPassRunner';
import VramBudgetAuditTab from './VramBudgetAuditTab';

interface BatchResourceOptimizerProps {
  allAssets?: any[];
  initialSelectedAssetIds?: string[];
  onClose?: () => void;
  onApplyOptimizedAssets?: (updatedAssets: any[], manifest: BatchOptimizationManifest) => void;
  embeddedMode?: boolean;
}

export default function BatchResourceOptimizer({
  allAssets = [],
  initialSelectedAssetIds = [],
  onClose,
  onApplyOptimizedAssets,
  embeddedMode = false
}: BatchResourceOptimizerProps) {
  // --------------------------------------------------------------------------
  // 1. STATE INITIALIZATION & ASSET NORMALIZATION
  // --------------------------------------------------------------------------
  const [selectedPresetId, setSelectedPresetId] = useState<PlatformOptimizationPresetType>('AAA_PC_ULTRA');
  const [currentPreset, setCurrentPreset] = useState<OptimizationPresetDefinition>(() => 
    OptimizationPresetRepository.getPreset('AAA_PC_ULTRA')
  );

  // แปลงรายการ asset ดั้งเดิมให้อยู่ในโครงสร้าง OptimizableAsset
  const normalizedAssets = useMemo<OptimizableAsset[]>(() => {
    const rawList = (allAssets && allAssets.length > 0) ? allAssets : [
      { id: 'sm_barrel', name: 'SM_Explosive_Barrel', type: 'obj', folderId: '5', rawSizeKb: 8400, polyCount: 24500, vertexCount: 13200 },
      { id: 'sk_hero', name: 'SKM_Cyber_Samurai', type: 'fbx', folderId: '3', rawSizeKb: 34200, polyCount: 88400, vertexCount: 46100 },
      { id: 'tex_albedo', name: 'T_Samurai_Armor_Albedo_4K', type: 'tex', folderId: '6', rawSizeKb: 21500, dimensions: { width: 4096, height: 4096 } },
      { id: 'tex_normal', name: 'T_Samurai_Armor_Normal_4K', type: 'tex', folderId: '6', rawSizeKb: 21500, dimensions: { width: 4096, height: 4096 } },
      { id: 'tex_rough', name: 'T_Metal_Roughness_2K', type: 'tex', folderId: '6', rawSizeKb: 5400, dimensions: { width: 2048, height: 2048 } },
      { id: 'sfx_explosion', name: 'SFX_Barrel_Explosion_Stereo', type: 'wav', folderId: '1', rawSizeKb: 9200, audioSampleRate: 48000, audioChannels: 2, audioDurationSec: 4.8 },
      { id: 'bgm_theme', name: 'BGM_NeonCity_Ambient', type: 'wav', folderId: '1', rawSizeKb: 42000, audioSampleRate: 48000, audioChannels: 2, audioDurationSec: 62.0 },
      { id: 'mat_armor', name: 'M_CyberSamurai_Master', type: 'mat', folderId: '4', rawSizeKb: 120 },
      { id: 'bp_agent', name: 'BP_CombatAgent_Controller', type: 'bp', folderId: '3', rawSizeKb: 380 },
    ];

    return rawList.map(a => {
      let cat: AssetCategoryType = 'generic';
      const t = (a.type || '').toLowerCase();
      if (['obj', 'fbx', 'skm', 'gltf'].includes(t)) cat = 'mesh';
      else if (['tex', 'png', 'jpg', 'jpeg', 'tga', 'hdr'].includes(t)) cat = 'texture';
      else if (['wav', 'mp3', 'ogg', 'flac'].includes(t)) cat = 'audio';
      else if (t === 'mat') cat = 'material';
      else if (t === 'bp') cat = 'blueprint';

      return {
        id: a.id,
        name: a.name,
        type: a.type || 'generic',
        folderId: a.folderId || '1',
        rawSizeKb: a.rawSizeKb || Math.round((a.name.length * 420) + 1200),
        category: cat,
        polyCount: a.polyCount || (cat === 'mesh' ? 15400 : undefined),
        vertexCount: a.vertexCount || (cat === 'mesh' ? 8200 : undefined),
        dimensions: a.dimensions || (cat === 'texture' ? { width: 2048, height: 2048 } : undefined),
        audioSampleRate: a.audioSampleRate || (cat === 'audio' ? 48000 : undefined),
        audioChannels: a.audioChannels || (cat === 'audio' ? 2 : undefined),
        audioDurationSec: a.audioDurationSec || (cat === 'audio' ? 5.2 : undefined),
        tags: a.tags || []
      };
    });
  }, [allAssets]);

  // จัดการ Selection
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(() => {
    if (initialSelectedAssetIds && initialSelectedAssetIds.length > 0) {
      return new Set(initialSelectedAssetIds);
    }
    // Default: เลือกสินทรัพย์ที่เป็น Mesh, Texture, Audio ทั้งหมด
    return new Set(normalizedAssets.filter(a => ['mesh', 'texture', 'audio'].includes(a.category)).map(a => a.id));
  });

  // สินทรัพย์ที่กำลังตรวจสอบใน Inspection Tabs
  const [activeAssetId, setActiveAssetId] = useState<string>(() => {
    return initialSelectedAssetIds[0] || normalizedAssets[0]?.id || '';
  });

  // Filter & Search
  const [categoryFilter, setCategoryFilter] = useState<'all' | AssetCategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Tab ใน Main Stage
  const [activeTab, setActiveTab] = useState<'lod' | 'texture' | 'audio' | 'vram_audit' | 'tuning' | 'logs'>('lod');

  // Interactive Visualizer Sub-States
  const [activeLODLevel, setActiveLODLevel] = useState<number>(0);
  const [isWireframeMode, setIsWireframeMode] = useState<boolean>(true);
  const [textureSplitPosition, setTextureSplitPosition] = useState<number>(50); // % for A/B slider
  const [selectedMipLevel, setSelectedMipLevel] = useState<number>(0);
  const [isRotatingMesh, setIsRotatingMesh] = useState<boolean>(true);

  // Execution & Pipeline States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [overallProgressPercent, setOverallProgressPercent] = useState<number>(0);
  const [currentStepText, setCurrentStepText] = useState<string>('Ready to optimize');
  const [passLogs, setPassLogs] = useState<string[]>([
    '[INIT] Batch Resource Optimizer initialized.',
    '[SYSTEM] Hardware concurrency detected: ' + (navigator?.hardwareConcurrency || 8) + ' cores.',
    '[READY] Select assets and press "Run Unified Optimization Pass" to begin.'
  ]);
  const [optimizationResults, setOptimizationResults] = useState<Map<string, OptimizedAssetResult>>(new Map());
  const [latestManifest, setLatestManifest] = useState<BatchOptimizationManifest | null>(null);

  const runnerRef = useRef<BatchOptimizationPassRunner>(new BatchOptimizationPassRunner());
  const logContainerRef = useRef<HTMLDivElement>(null);

  // สลับ Preset
  const handlePresetChange = (presetId: PlatformOptimizationPresetType) => {
    setSelectedPresetId(presetId);
    setCurrentPreset(OptimizationPresetRepository.getPreset(presetId));
    setPassLogs(prev => [...prev, `[PRESET] Applied target profile: ${presetId}`]);
  };

  // กรองรายการสินทรัพย์
  const displayedAssets = useMemo(() => {
    return normalizedAssets.filter(a => {
      const matchCat = categoryFilter === 'all' || a.category === categoryFilter;
      const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [normalizedAssets, categoryFilter, searchQuery]);

  const activeAsset = useMemo(() => {
    return normalizedAssets.find(a => a.id === activeAssetId) || normalizedAssets[0] || null;
  }, [normalizedAssets, activeAssetId]);

  const activeResult = useMemo(() => {
    return activeAsset ? optimizationResults.get(activeAsset.id) : null;
  }, [activeAsset, optimizationResults]);

  // สลับแท็บอัตโนมัติตามประเภทสินทรัพย์ที่คลิกเลือก
  useEffect(() => {
    if (activeAsset) {
      if (activeAsset.category === 'mesh' && activeTab !== 'tuning' && activeTab !== 'logs' && activeTab !== 'vram_audit') {
        setActiveTab('lod');
      } else if (activeAsset.category === 'texture' && activeTab !== 'tuning' && activeTab !== 'logs' && activeTab !== 'vram_audit') {
        setActiveTab('texture');
      } else if (activeAsset.category === 'audio' && activeTab !== 'tuning' && activeTab !== 'logs' && activeTab !== 'vram_audit') {
        setActiveTab('audio');
      }
    }
  }, [activeAssetId]);

  // Auto scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [passLogs]);

  // Multi-Selection Toggles
  const toggleSelectAsset = (id: string) => {
    setSelectedAssetIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedAssetIds(new Set(normalizedAssets.map(a => a.id)));
  };

  const clearSelection = () => {
    setSelectedAssetIds(new Set());
  };

  const selectHeavyAssets = () => {
    const heavy = normalizedAssets.filter(a => a.rawSizeKb > 5000).map(a => a.id);
    setSelectedAssetIds(new Set(heavy));
  };

  // Projected Summary Calculations
  const selectedTotalSizeKb = useMemo(() => {
    return Array.from(selectedAssetIds).reduce((acc, id) => {
      const asset = normalizedAssets.find(a => a.id === id);
      return acc + (asset?.rawSizeKb || 0);
    }, 0);
  }, [selectedAssetIds, normalizedAssets]);

  const projectedSavingsMb = useMemo(() => {
    const targetFactor = (currentPreset.globalTargetSavingsPct / 100);
    const savedKb = selectedTotalSizeKb * targetFactor;
    return +(savedKb / 1024).toFixed(2);
  }, [selectedTotalSizeKb, currentPreset]);

  // --------------------------------------------------------------------------
  // 2. RUN BATCH OPTIMIZATION PASS
  // --------------------------------------------------------------------------
  const handleRunPass = async () => {
    const targetAssets = normalizedAssets.filter(a => selectedAssetIds.has(a.id));
    if (targetAssets.length === 0) {
      alert('กรุณาเลือกสินทรัพย์อย่างน้อย 1 รายการก่อนเริ่มการบีบอัด');
      return;
    }

    setIsProcessing(true);
    setOverallProgressPercent(0);
    setCurrentStepText(`Optimizing 0/${targetAssets.length}...`);
    setPassLogs(prev => [
      ...prev,
      `------------------------------------------------------------------`,
      `[PIPELINE_DISPATCH] Starting unified pass with ${targetAssets.length} assets...`
    ]);

    try {
      const manifest = await runnerRef.current.runBatchPass(targetAssets, currentPreset, {
        onProgress: (pct, idx, asset, step) => {
          setOverallProgressPercent(pct);
          setCurrentStepText(`[${idx + 1}/${targetAssets.length}] ${asset.name} - ${step}`);
        },
        onAssetCompleted: (res) => {
          setOptimizationResults(prev => {
            const next = new Map(prev);
            next.set(res.assetId, res);
            return next;
          });
        },
        onLog: (log) => {
          setPassLogs(prev => [...prev, log]);
        }
      });

      setLatestManifest(manifest);
      setOverallProgressPercent(100);
      setCurrentStepText(`Completed ${manifest.totalAssetsOptimized} assets (${manifest.estimatedDiskFootprintSavedMb} MB saved)`);
    } catch (err: any) {
      setPassLogs(prev => [...prev, `[FATAL_PASS_ERROR] ${err?.message || 'Pipeline aborted'}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelPass = () => {
    runnerRef.current.cancelPass();
    setIsProcessing(false);
    setCurrentStepText('Processing cancelled by user.');
    setPassLogs(prev => [...prev, `[USER_INTERRUPT] Cancellation requested.`]);
  };

  // --------------------------------------------------------------------------
  // 3. APPLY TO CONTENT BROWSER & EXPORT MANIFEST
  // --------------------------------------------------------------------------
  const handleApplyToProject = () => {
    if (!latestManifest && optimizationResults.size === 0) {
      alert('ยังไม่มีผลลัพธ์การ Optimize ในรอบนี้ กรุณากด Run Unified Optimization Pass ก่อน');
      return;
    }

    // สร้าง Asset List ที่ปรับปรุง Metadata แล้ว
    const updatedAssets = normalizedAssets.map(original => {
      const opt = optimizationResults.get(original.id);
      if (opt && opt.status === 'completed') {
        const addedTags = [...(original.tags || [])];
        if (opt.category === 'mesh' && !addedTags.includes('LOD-Ready')) addedTags.push('LOD-Ready');
        if (opt.category === 'texture' && !addedTags.includes('GPU-Compressed')) addedTags.push('GPU-Compressed');
        if (opt.category === 'audio' && !addedTags.includes('Opus-128k')) addedTags.push('Transcoded');

        return {
          ...original,
          rawSizeKb: opt.optimizedSizeKb,
          tags: addedTags,
          optimizationMeta: {
            preset: currentPreset.id,
            originalSizeKb: opt.originalSizeKb,
            savingsPct: opt.savingsPercentage,
            timestamp: new Date().toISOString()
          }
        };
      }
      return original;
    });

    if (onApplyOptimizedAssets && latestManifest) {
      onApplyOptimizedAssets(updatedAssets, latestManifest);
    } else {
      // Dispatch browser event ให้ระบบอื่นอัปเดต
      window.dispatchEvent(new CustomEvent('assets-optimized-applied', { detail: { count: optimizationResults.size } }));
      alert(`บันทึกข้อมูลการ Optimize สินทรัพย์ ${optimizationResults.size} ชิ้น เข้าสู่โครงการเรียบร้อย!`);
    }
  };

  const handleExportManifestJSON = () => {
    const dataToExport = latestManifest || {
      manifestId: 'draft_' + Date.now(),
      presetUsed: currentPreset.id,
      timestamp: new Date().toISOString(),
      results: Array.from(optimizationResults.values())
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Batch_Optimization_Manifest_${currentPreset.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------------------------------
  // 4. RENDER HELPERS
  // --------------------------------------------------------------------------
  const getCategoryIcon = (cat: AssetCategoryType) => {
    switch (cat) {
      case 'mesh': return <Box size={14} className="text-cyan-400" />;
      case 'texture': return <Image size={14} className="text-purple-400" />;
      case 'audio': return <Volume2 size={14} className="text-amber-400" />;
      case 'material': return <Layers size={14} className="text-emerald-400" />;
      default: return <Zap size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className={`flex flex-col h-full bg-[#0a0d12] text-gray-200 select-none overflow-hidden font-sans border border-[#30363d] ${embeddedMode ? 'rounded-2xl' : ''}`}>
      {/* TOP MASTER TOOLBAR */}
      <header className="h-[54px] bg-[#111620] border-b border-[#21262d] flex items-center justify-between px-4 shrink-0 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide">Batch Resource Optimizer</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                LOD + GPU Compression + Audio Bitrate
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Unified multi-asset decimation and memory footprint minimizer</p>
          </div>
        </div>

        {/* TARGET PRESET PICKER */}
        <div className="flex items-center gap-2 bg-[#161b26] border border-[#30363d] px-3 py-1 rounded-xl">
          <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
            <TargetPlatformIcon id={selectedPresetId} />
            Preset:
          </span>
          <select
            value={selectedPresetId}
            onChange={(e) => handlePresetChange(e.target.value as PlatformOptimizationPresetType)}
            disabled={isProcessing}
            aria-label="Optimization Target Platform Preset"
            className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer border-none py-0.5"
          >
            {OptimizationPresetRepository.getAllPresets().map(p => (
              <option key={p.id} value={p.id} className="bg-[#161b26] text-white">
                {p.nameThai}
              </option>
            ))}
          </select>
        </div>

        {/* PROJECTED SAVINGS SUMMARY BADGES */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-gray-400 uppercase font-mono">Projected Disk Saved</span>
            <span className="text-xs font-bold font-mono text-emerald-400">~{projectedSavingsMb} MB ({currentPreset.globalTargetSavingsPct}%)</span>
          </div>
          <div className="h-6 w-px bg-gray-800" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-gray-400 uppercase font-mono">Selected Assets</span>
            <span className="text-xs font-bold font-mono text-cyan-300">{selectedAssetIds.size} / {normalizedAssets.length}</span>
          </div>
        </div>

        {/* MASTER ACTIONS */}
        <div className="flex items-center gap-2">
          {!isProcessing ? (
            <button
              onClick={handleRunPass}
              disabled={selectedAssetIds.size === 0}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 disabled:opacity-40 text-black font-extrabold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
            >
              <Play size={13} fill="currentColor" /> Run Unified Pass ({selectedAssetIds.size})
            </button>
          ) : (
            <button
              onClick={handleCancelPass}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-red-500/30 transition-all cursor-pointer animate-pulse"
            >
              <Square size={13} fill="currentColor" /> Stop Pass
            </button>
          )}

          <button
            onClick={handleApplyToProject}
            disabled={optimizationResults.size === 0 || isProcessing}
            className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Apply all optimized sizes and LOD settings back into ContentBrowser"
          >
            <Save size={13} /> Apply to Project
          </button>

          <button
            onClick={handleExportManifestJSON}
            className="bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export Manifest as JSON"
          >
            <FileDown size={13} />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      {/* MAIN BODY WORKSPACE (3-COLUMN LAYOUT) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* LEFT COLUMN: ASSET SELECTION DRAWER */}
        <aside className="w-[300px] border-r border-[#21262d] bg-[#0e121a] flex flex-col shrink-0 overflow-hidden">
          {/* Search and Category Filter Chips */}
          <div className="p-3 border-b border-[#21262d] flex flex-col gap-2">
            <div className="flex items-center bg-[#161b26] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs">
              <Search size={13} className="text-gray-400 mr-1.5" />
              <input
                type="text"
                placeholder="Search assets to optimize..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-200 text-xs w-full"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 custom-scrollbar">
              {(['all', 'mesh', 'texture', 'audio'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    categoryFilter === cat 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'bg-[#161b26] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Bulk Selection Quick Toggles */}
            <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
              <div className="flex items-center gap-2">
                <button onClick={selectAll} className="hover:text-amber-300 cursor-pointer">All</button>
                <span>•</span>
                <button onClick={clearSelection} className="hover:text-amber-300 cursor-pointer">None</button>
                <span>•</span>
                <button onClick={selectHeavyAssets} className="hover:text-amber-300 cursor-pointer">&gt;5MB</button>
              </div>
              <span className="font-mono text-amber-400 font-bold">
                {selectedAssetIds.size} selected
              </span>
            </div>
          </div>

          {/* Asset List View */}
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
            {displayedAssets.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">No assets matching current filter</div>
            ) : (
              displayedAssets.map(asset => {
                const isSelected = selectedAssetIds.has(asset.id);
                const isActive = activeAssetId === asset.id;
                const res = optimizationResults.get(asset.id);

                return (
                  <div
                    key={asset.id}
                    onClick={() => setActiveAssetId(asset.id)}
                    className={`p-2 rounded-xl flex items-center justify-between gap-2 border transition-all cursor-pointer group ${
                      isActive 
                        ? 'bg-[#1c2333] border-amber-500/50 shadow-md' 
                        : 'bg-[#121620] hover:bg-[#161c28] border-[#21262d]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Multi-Select Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectAsset(asset.id);
                        }}
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          isSelected 
                            ? 'bg-amber-500 border-amber-400 text-black font-bold' 
                            : 'bg-[#1b202c] border-gray-600 text-transparent hover:border-gray-400'
                        }`}
                      >
                        <CheckSquare size={11} className={isSelected ? 'opacity-100' : 'opacity-0'} />
                      </button>

                      <div className="w-8 h-8 rounded-lg bg-[#181e2b] border border-[#30363d] flex items-center justify-center shrink-0">
                        {getCategoryIcon(asset.category)}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-gray-200 truncate group-hover:text-white" title={asset.name}>
                          {asset.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-400">
                          <span className="uppercase text-amber-400/80">{asset.type}</span>
                          <span>•</span>
                          <span>{(asset.rawSizeKb / 1024).toFixed(1)} MB</span>
                        </div>
                      </div>
                    </div>

                    {/* Result or Status Tag */}
                    <div className="flex flex-col items-end shrink-0">
                      {res ? (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold font-mono text-emerald-400">
                            -{res.savingsPercentage}%
                          </span>
                          <span className="text-[8px] font-mono text-gray-400">
                            {(res.optimizedSizeKb / 1024).toFixed(1)}MB
                          </span>
                        </div>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-gray-800 text-gray-400">
                          RAW
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer Status */}
          <div className="p-2.5 bg-[#0a0d12] border-t border-[#21262d] text-[10px] text-gray-400 flex items-center justify-between font-mono">
            <span>Queue: {selectedAssetIds.size} assets</span>
            <span>Total: {(selectedTotalSizeKb / 1024).toFixed(1)} MB</span>
          </div>
        </aside>

        {/* CENTER STAGE: VISUALIZER & INSPECTION TABS */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0c1017] overflow-hidden">
          {/* Main Inspection Tab Bar */}
          <div className="h-[42px] bg-[#111622] border-b border-[#21262d] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('lod')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'lod' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Box size={13} /> 3D Mesh LOD Studio
              </button>

              <button
                onClick={() => setActiveTab('texture')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'texture' 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Image size={13} /> Texture Mipmap & GPU Block
              </button>

              <button
                onClick={() => setActiveTab('audio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'audio' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Volume2 size={13} /> Audio Bitrate & 3D Spatial
              </button>

              <button
                onClick={() => setActiveTab('tuning')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'tuning' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sliders size={13} /> Preset Tuning
              </button>

              <button
                onClick={() => setActiveTab('vram_audit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'vram_audit' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <HardDrive size={13} /> VRAM Budget Audit
              </button>

              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'logs' 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Activity size={13} /> Pass Logs
              </button>
            </div>

            {activeAsset && (
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <span className="text-gray-300 font-bold">{activeAsset.name}</span>
                <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-amber-400 uppercase">
                  {activeAsset.type}
                </span>
              </div>
            )}
          </div>

          {/* TAB CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'lod' && (
              <MeshLODStudioTab
                asset={activeAsset}
                result={activeResult}
                config={currentPreset.meshConfig}
                activeLODLevel={activeLODLevel}
                setActiveLODLevel={setActiveLODLevel}
                isWireframeMode={isWireframeMode}
                setIsWireframeMode={setIsWireframeMode}
                isRotatingMesh={isRotatingMesh}
                setIsRotatingMesh={setIsRotatingMesh}
              />
            )}

            {activeTab === 'texture' && (
              <TextureCompressionStudioTab
                asset={activeAsset}
                result={activeResult}
                config={currentPreset.textureConfig}
                splitPosition={textureSplitPosition}
                setSplitPosition={setTextureSplitPosition}
                selectedMipLevel={selectedMipLevel}
                setSelectedMipLevel={setSelectedMipLevel}
              />
            )}

            {activeTab === 'audio' && (
              <AudioTranscoderStudioTab
                asset={activeAsset}
                result={activeResult}
                config={currentPreset.audioConfig}
              />
            )}

            {activeTab === 'tuning' && (
              <PresetTuningTab
                preset={currentPreset}
                onChangeConfig={(newPreset) => {
                  setCurrentPreset(newPreset);
                  setSelectedPresetId('CUSTOM_USER_DEFINED');
                }}
              />
            )}

            {activeTab === 'vram_audit' && (
              <VramBudgetAuditTab
                manifest={latestManifest}
                results={Array.from(optimizationResults.values())}
                presetId={selectedPresetId}
                totalAssetCount={normalizedAssets.length}
              />
            )}

            {activeTab === 'logs' && (
              <div className="h-full flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-bold flex items-center gap-1.5 text-rose-400">
                    <Activity size={14} /> Unified Optimization Pipeline Console
                  </span>
                  <button
                    onClick={() => setPassLogs([])}
                    className="text-[10px] hover:text-white px-2 py-0.5 rounded bg-gray-800"
                  >
                    Clear Logs
                  </button>
                </div>
                <div
                  ref={logContainerRef}
                  className="flex-1 bg-[#06080d] border border-[#21262d] rounded-xl p-3 font-mono text-[11px] overflow-y-auto flex flex-col gap-1"
                >
                  {passLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-gray-600 select-none">{String(idx + 1).padStart(3, '0')}</span>
                      <span className={
                        log.includes('[ERROR]') || log.includes('[FATAL') ? 'text-red-400 font-bold' :
                        log.includes('[PIPELINE') || log.includes('[BATCH_START') ? 'text-amber-300 font-bold' :
                        log.includes('[LOD_GEN') ? 'text-cyan-300' :
                        log.includes('[PERCEPTUAL') || log.includes('[TEX_COMPLETE') ? 'text-purple-300' :
                        log.includes('[AUDIO') ? 'text-emerald-300' : 'text-gray-300'
                      }>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* BOTTOM PIPELINE STATUS & LIVE TELEMETRY DOCK */}
      <footer className="h-[48px] bg-[#0c1017] border-t border-[#21262d] px-4 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className={`w-2.5 h-2.5 rounded-full ${isProcessing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-gray-300 font-bold truncate max-w-[320px]">
              {currentStepText}
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="flex-1 max-w-md h-2 bg-gray-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 transition-all duration-200 rounded-full"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
            {overallProgressPercent}%
          </span>
        </div>

        {/* Global Summary Metric Pills */}
        <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-1.5 text-gray-400">
            <HardDrive size={13} className="text-emerald-400" />
            <span>Saved:</span>
            <span className="text-emerald-400 font-bold">
              {latestManifest ? `${latestManifest.estimatedDiskFootprintSavedMb} MB` : '0 MB'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock size={13} className="text-cyan-400" />
            <span>Time:</span>
            <span className="text-cyan-300 font-bold">
              {latestManifest ? `${(latestManifest.totalPassDurationMs / 1000).toFixed(1)}s` : '0s'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// SUB-TAB 1: 3D MESH & LOD PYRAMID VISUALIZER TAB
// ============================================================================
function MeshLODStudioTab({
  asset,
  result,
  config,
  activeLODLevel,
  setActiveLODLevel,
  isWireframeMode,
  setIsWireframeMode,
  isRotatingMesh,
  setIsRotatingMesh
}: {
  asset: OptimizableAsset | null;
  result: OptimizedAssetResult | null | undefined;
  config: any;
  activeLODLevel: number;
  setActiveLODLevel: (lvl: number) => void;
  isWireframeMode: boolean;
  setIsWireframeMode: (v: boolean) => void;
  isRotatingMesh: boolean;
  setIsRotatingMesh: (v: boolean) => void;
}) {
  const lodData = result?.meshDiagnostics?.lodsGenerated || [
    { lodLevel: 0, triangles: asset?.polyCount || 24500, vertices: asset?.vertexCount || 13200, reductionPct: 0, vramSizeKb: 1240, switchDistanceMeters: 0 },
    { lodLevel: 1, triangles: Math.round((asset?.polyCount || 24500) * 0.55), vertices: Math.round((asset?.vertexCount || 13200) * 0.55), reductionPct: 45, vramSizeKb: 680, switchDistanceMeters: 15 },
    { lodLevel: 2, triangles: Math.round((asset?.polyCount || 24500) * 0.25), vertices: Math.round((asset?.vertexCount || 13200) * 0.25), reductionPct: 75, vramSizeKb: 310, switchDistanceMeters: 35 },
    { lodLevel: 3, triangles: Math.round((asset?.polyCount || 24500) * 0.10), vertices: Math.round((asset?.vertexCount || 13200) * 0.10), reductionPct: 90, vramSizeKb: 124, switchDistanceMeters: 75 },
  ];

  const currentLOD = lodData[activeLODLevel] || lodData[0];

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* 3D Visualizer Canvas Sandbox */}
      <div className="flex-1 bg-[#070a0f] rounded-2xl border border-[#21262d] flex flex-col relative overflow-hidden min-h-[380px]">
        {/* Canvas Toolbar Controls */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#121622]/90 backdrop-blur border border-[#30363d] px-3 py-1.5 rounded-xl text-xs">
          <span className="font-bold text-cyan-300">LOD {activeLODLevel} Preview</span>
          <span className="text-gray-500">|</span>
          <button
            onClick={() => setIsWireframeMode(!isWireframeMode)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
              isWireframeMode ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400'
            }`}
          >
            Wireframe
          </button>
          <button
            onClick={() => setIsRotatingMesh(!isRotatingMesh)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
              isRotatingMesh ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-400'
            }`}
          >
            Rotate Orbit
          </button>
        </div>

        {/* Distance Indicator badge */}
        <div className="absolute top-3 right-3 z-10 bg-[#121622]/90 border border-[#30363d] px-3 py-1.5 rounded-xl text-xs font-mono text-gray-300">
          Switch Distance: <span className="text-amber-400 font-bold">{currentLOD.switchDistanceMeters}m</span>
        </div>

        {/* 3D Simulated Interactive Canvas Render */}
        <div className="flex-1 flex items-center justify-center relative p-8">
          {/* Isometric Simulated Mesh Geometry Visualizer */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Geometric Poly Rings representing decimation density */}
            <div 
              className={`w-52 h-52 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center shadow-2xl relative ${
                isWireframeMode ? 'border-cyan-400/80 bg-cyan-950/10' : 'border-cyan-500/30 bg-gradient-to-tr from-cyan-900/40 to-blue-900/30'
              } ${isRotatingMesh ? 'animate-[spin_12s_linear_infinite]' : ''}`}
            >
              {/* Internal Mesh Lattice Lines */}
              <div className="absolute inset-4 border border-dashed border-cyan-400/50 rounded-xl" />
              <div className="absolute inset-10 border border-dotted border-cyan-300/40 rounded-lg" />
              <div className="w-16 h-16 rounded-full bg-cyan-400/20 border border-cyan-300 flex items-center justify-center">
                <Box size={28} className="text-cyan-300" />
              </div>

              {/* Wireframe Vertices Dots (scaled by LOD level) */}
              {isWireframeMode && (
                <>
                  <span className="w-2 h-2 rounded-full bg-cyan-300 absolute -top-1 -left-1" />
                  <span className="w-2 h-2 rounded-full bg-cyan-300 absolute -top-1 -right-1" />
                  <span className="w-2 h-2 rounded-full bg-cyan-300 absolute -bottom-1 -left-1" />
                  <span className="w-2 h-2 rounded-full bg-cyan-300 absolute -bottom-1 -right-1" />
                  {activeLODLevel === 0 && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 absolute top-1/2 left-0" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 absolute top-1/2 right-0" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 absolute top-0 left-1/2" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 absolute bottom-0 left-1/2" />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom LOD Level Slider Buttons */}
        <div className="p-3 bg-[#111622] border-t border-[#21262d] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {lodData.map((lod) => (
              <button
                key={lod.lodLevel}
                onClick={() => setActiveLODLevel(lod.lodLevel)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center ${
                  activeLODLevel === lod.lodLevel
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 scale-105'
                    : 'bg-[#181f2e] text-gray-400 hover:text-white hover:bg-[#20293d]'
                }`}
              >
                <span>LOD {lod.lodLevel}</span>
                <span className="text-[9px] font-mono opacity-80">
                  {lod.triangles.toLocaleString()} tris
                </span>
              </button>
            ))}
          </div>

          <div className="text-right text-xs font-mono">
            <span className="text-gray-400">LOD Reduction: </span>
            <span className="text-emerald-400 font-bold">-{currentLOD.reductionPct}%</span>
          </div>
        </div>
      </div>

      {/* Right Metrics & Decimation Rules Panel */}
      <div className="w-full lg:w-[320px] flex flex-col gap-3 shrink-0">
        <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-4 flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Layers size={14} /> Mesh Topology Metrics
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[#090d14] border border-[#21262d]">
              <span className="text-[9px] text-gray-500 block uppercase">Triangles</span>
              <span className="text-sm font-bold text-white">{currentLOD.triangles.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#090d14] border border-[#21262d]">
              <span className="text-[9px] text-gray-500 block uppercase">Vertices</span>
              <span className="text-sm font-bold text-white">{currentLOD.vertices.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#090d14] border border-[#21262d]">
              <span className="text-[9px] text-gray-500 block uppercase">VRAM Buffer</span>
              <span className="text-sm font-bold text-cyan-400">{currentLOD.vramSizeKb} KB</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#090d14] border border-[#21262d]">
              <span className="text-[9px] text-gray-500 block uppercase">Switch Distance</span>
              <span className="text-sm font-bold text-amber-400">{currentLOD.switchDistanceMeters}m</span>
            </div>
          </div>
        </div>

        {/* QEM Algorithm Details */}
        <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-4 flex flex-col gap-2.5 text-xs">
          <h4 className="font-bold text-gray-300">Decimation Rules Applied</h4>
          <div className="flex items-center justify-between text-gray-400">
            <span>Algorithm:</span>
            <span className="font-mono text-cyan-300">{config.decimationAlgorithm}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>UV Seams Protection:</span>
            <span className="text-emerald-400 font-semibold">{config.preserveUVSeams ? 'Strict (Locked)' : 'Permissive'}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Normal Angle Threshold:</span>
            <span className="font-mono text-gray-200">{config.normalAngleThresholdDeg}°</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Billboard Imposter:</span>
            <span className="font-mono text-gray-200">{config.generateBillboardImposter ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-TAB 2: TEXTURE MIPMAP & GPU BLOCK COMPRESSION TAB
// ============================================================================
function TextureCompressionStudioTab({
  asset,
  result,
  config,
  splitPosition,
  setSplitPosition,
  selectedMipLevel,
  setSelectedMipLevel
}: {
  asset: OptimizableAsset | null;
  result: OptimizedAssetResult | null | undefined;
  config: any;
  splitPosition: number;
  setSplitPosition: (pos: number) => void;
  selectedMipLevel: number;
  setSelectedMipLevel: (lvl: number) => void;
}) {
  const diag = result?.textureDiagnostics || {
    originalDimension: `${asset?.dimensions?.width || 2048}x${asset?.dimensions?.height || 2048}`,
    targetDimension: `${Math.min(config.maxResolution, asset?.dimensions?.width || 2048)}x${Math.min(config.maxResolution, asset?.dimensions?.height || 2048)}`,
    compressionFormat: config.targetFormat,
    mipLevelsCount: 11,
    estimatedVramKb: 2730,
    psnrScoreDb: 46.2,
    ssimScore: 0.988,
    compressionSpeedMpixPerSec: 4.8
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Interactive A/B Comparison Split Slider */}
      <div className="flex-1 bg-[#070a0f] rounded-2xl border border-[#21262d] flex flex-col relative overflow-hidden min-h-[380px]">
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-[#121622]/90 backdrop-blur border border-[#30363d] px-3 py-1.5 rounded-xl text-xs">
          <span className="font-bold text-purple-400">A/B Split View</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400 font-mono">Left: RAW (RGBA32) | Right: {diag.compressionFormat}</span>
        </div>

        {/* Quality Score Badges */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <div className="bg-[#121622]/90 border border-[#30363d] px-2.5 py-1 rounded-xl text-xs font-mono text-emerald-400">
            PSNR: <span className="font-bold">{diag.psnrScoreDb} dB</span>
          </div>
          <div className="bg-[#121622]/90 border border-[#30363d] px-2.5 py-1 rounded-xl text-xs font-mono text-purple-300">
            SSIM: <span className="font-bold">{diag.ssimScore}</span>
          </div>
        </div>

        {/* Split Screen Texture Container */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden p-6">
          <div className="relative w-72 h-72 rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl">
            {/* Left Image (RAW) */}
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-purple-900/60 via-indigo-800/40 to-pink-900/50 flex items-center justify-center"
              style={{ clipPath: `polygon(0 0, ${splitPosition}% 0, ${splitPosition}% 100%, 0 100%)` }}
            >
              <div className="text-center">
                <span className="text-3xl font-extrabold text-white/30 tracking-widest uppercase">RAW</span>
                <p className="text-[10px] text-white/60 font-mono">Uncompressed RGBA32</p>
              </div>
            </div>

            {/* Right Image (GPU Compressed) */}
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-indigo-950 to-pink-950/80 flex items-center justify-center"
              style={{ clipPath: `polygon(${splitPosition}% 0, 100% 0, 100% 100%, ${splitPosition}% 100%)` }}
            >
              <div className="text-center">
                <span className="text-3xl font-extrabold text-purple-400/40 tracking-widest uppercase">BLOCK</span>
                <p className="text-[10px] text-purple-300/80 font-mono">{diag.compressionFormat}</p>
              </div>
            </div>

            {/* Divider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_white] cursor-ew-resize z-10"
              style={{ left: `${splitPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-white text-black text-[10px] flex items-center justify-center font-bold shadow-lg">
                ↔
              </div>
            </div>
          </div>
        </div>

        {/* Slider Position Input */}
        <div className="p-3 bg-[#111622] border-t border-[#21262d] flex items-center gap-4">
          <span className="text-xs text-gray-400">A/B Slider:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={splitPosition}
            onChange={(e) => setSplitPosition(Number(e.target.value))}
            className="flex-1 accent-purple-500 cursor-pointer"
          />
          <span className="text-xs font-mono text-purple-300 w-10 text-right">{splitPosition}%</span>
        </div>
      </div>

      {/* Right Mipmap Pyramid & Footprint Panel */}
      <div className="w-full lg:w-[320px] flex flex-col gap-3 shrink-0">
        <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-4 flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Image size={14} /> Mipmap Chain Pyramid
          </h3>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400">Select Mip Level to Inspect:</span>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: Math.min(8, diag.mipLevelsCount) }).map((_, i) => {
                const res = Math.round(2048 / Math.pow(2, i));
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedMipLevel(i)}
                    className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                      selectedMipLevel === i 
                        ? 'bg-purple-600/30 border-purple-500 text-purple-200' 
                        : 'bg-[#0b0f17] border-[#21262d] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] font-bold block">MIP {i}</span>
                    <span className="text-[8px] font-mono text-gray-500">{res}px</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compression Footprint Diagnostics */}
        <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-4 flex flex-col gap-2.5 text-xs font-mono">
          <h4 className="font-bold text-gray-300 uppercase tracking-wide">VRAM & Texture Stats</h4>
          <div className="flex items-center justify-between text-gray-400">
            <span>Dimensions:</span>
            <span className="text-white font-bold">{diag.targetDimension}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Block Format:</span>
            <span className="text-purple-400 font-bold">{diag.compressionFormat}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>VRAM + Mips:</span>
            <span className="text-emerald-400 font-bold">{(diag.estimatedVramKb / 1024).toFixed(2)} MB</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Mip Levels:</span>
            <span className="text-gray-200">{diag.mipLevelsCount} levels</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-TAB 3: AUDIO TRANSCODER & 3D SPATIAL STUDIO TAB
// ============================================================================
function AudioTranscoderStudioTab({
  asset,
  result,
  config
}: {
  asset: OptimizableAsset | null;
  result: OptimizedAssetResult | null | undefined;
  config: any;
}) {
  const diag = result?.audioDiagnostics || {
    originalBitrateKbps: 1536,
    targetBitrateKbps: config.targetBitrateKbps,
    codec: config.codec,
    originalChannels: 2,
    finalChannels: config.downmixToMonoFor3DSpatial ? 1 : 2,
    sampleRateHz: config.targetSampleRate,
    isStreamingLoaded: (asset?.rawSizeKb || 0) > 1024,
    loudnessNormalizedLUFS: config.normalizeLoudnessLUFS
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Audio Waveform & Spectrum Visualizer */}
      <div className="flex-1 bg-[#070a0f] rounded-2xl border border-[#21262d] flex flex-col relative overflow-hidden min-h-[380px] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-amber-400" />
            <span className="text-sm font-bold text-white">Audio Waveform & Frequency Density</span>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
            {diag.codec} • {diag.targetBitrateKbps} kbps • {diag.sampleRateHz} Hz
          </span>
        </div>

        {/* Simulated Waveform Bars */}
        <div className="flex-1 flex items-center justify-center gap-1 px-4">
          {Array.from({ length: 48 }).map((_, i) => {
            const h = Math.sin(i * 0.25) * 45 + Math.cos(i * 0.6) * 35 + 30;
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-amber-600 via-orange-500 to-yellow-300 rounded-full transition-all duration-300"
                style={{ height: `${Math.max(8, h)}%` }}
              />
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-[#111622] rounded-xl border border-[#21262d] flex items-center justify-between text-xs font-mono text-gray-400">
          <span>Channel Mode: <strong className="text-white">{diag.finalChannels === 1 ? 'Mono (3D Spatial HRTF)' : 'Stereo (2.0)'}</strong></span>
          <span>Target Loudness: <strong className="text-amber-300">{diag.loudnessNormalizedLUFS} LUFS</strong></span>
          <span>Memory Mode: <strong className="text-cyan-300">{diag.isStreamingLoaded ? 'Async Disk Stream' : 'In-Memory Resident'}</strong></span>
        </div>
      </div>

      {/* Bitrate & Memory Comparison */}
      <div className="w-full lg:w-[320px] flex flex-col gap-3 shrink-0">
        <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-4 flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Zap size={14} /> Bitrate Comparison
          </h3>

          <div className="flex flex-col gap-3">
            <div>
              <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                <span>Original PCM WAV</span>
                <span className="text-white font-bold">{diag.originalBitrateKbps} kbps</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                <span>Transcoded {diag.codec}</span>
                <span className="text-emerald-400 font-bold">{diag.targetBitrateKbps} kbps</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400"
                  style={{ width: `${Math.round((diag.targetBitrateKbps / diag.originalBitrateKbps) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-4 flex flex-col gap-2 text-xs">
          <h4 className="font-bold text-gray-200">Audio Optimization Rules</h4>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Converting uncompressed 16-bit PCM sound effects to Vorbis/Opus reduces asset size by over 80% without perceptible loss in game soundscapes.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-TAB 4: PRESET TUNING TAB
// ============================================================================
function PresetTuningTab({
  preset,
  onChangeConfig
}: {
  preset: OptimizationPresetDefinition;
  onChangeConfig: (newPreset: OptimizationPresetDefinition) => void;
}) {
  const updateMeshConfig = (key: string, value: any) => {
    onChangeConfig({
      ...preset,
      meshConfig: {
        ...preset.meshConfig,
        [key]: value
      }
    });
  };

  const updateTexConfig = (key: string, value: any) => {
    onChangeConfig({
      ...preset,
      textureConfig: {
        ...preset.textureConfig,
        [key]: value
      }
    });
  };

  const updateAudioConfig = (key: string, value: any) => {
    onChangeConfig({
      ...preset,
      audioConfig: {
        ...preset.audioConfig,
        [key]: value
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Mesh Decimation Settings */}
      <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Box size={14} /> 3D Mesh LOD Rules
        </h3>

        <label className="flex items-center justify-between text-xs text-gray-300">
          <span>Target LOD Count:</span>
          <select
            value={preset.meshConfig.lodCount}
            onChange={(e) => updateMeshConfig('lodCount', Number(e.target.value))}
            className="bg-[#161b26] border border-[#30363d] rounded px-2 py-1 text-xs"
          >
            <option value={2}>2 Levels (LOD0-1)</option>
            <option value={3}>3 Levels (LOD0-2)</option>
            <option value={4}>4 Levels (LOD0-3)</option>
            <option value={5}>5 Levels (LOD0-4)</option>
          </select>
        </label>

        <label className="flex items-center justify-between text-xs text-gray-300">
          <span>Preserve UV Seams:</span>
          <input
            type="checkbox"
            checked={preset.meshConfig.preserveUVSeams}
            onChange={(e) => updateMeshConfig('preserveUVSeams', e.target.checked)}
            className="accent-cyan-400"
          />
        </label>

        <label className="flex items-center justify-between text-xs text-gray-300">
          <span>Billboard Imposter:</span>
          <input
            type="checkbox"
            checked={preset.meshConfig.generateBillboardImposter}
            onChange={(e) => updateMeshConfig('generateBillboardImposter', e.target.checked)}
            className="accent-cyan-400"
          />
        </label>
      </div>

      {/* 2. Texture Block Compression Settings */}
      <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
          <Image size={14} /> GPU Block Formats
        </h3>

        <label className="flex items-center justify-between text-xs text-gray-300">
          <span>Target Codec:</span>
          <select
            value={preset.textureConfig.targetFormat}
            onChange={(e) => updateTexConfig('targetFormat', e.target.value as GPUBlockCompressionFormat)}
            className="bg-[#161b26] border border-[#30363d] rounded px-2 py-1 text-xs"
          >
            <option value="BC7_HighQuality">BC7 (Desktop PBR High)</option>
            <option value="BC1_DXT1_Opaque">BC1 / DXT1 (Opaque)</option>
            <option value="ASTC_4x4_MobileHDR">ASTC 4x4 (Mobile HDR)</option>
            <option value="ASTC_6x6_Balanced">ASTC 6x6 (Mobile Balanced)</option>
            <option value="KTX2_BasisUniversal">KTX2 (Basis Universal)</option>
            <option value="WebP_NearLossless">WebP (WebGL Fast)</option>
          </select>
        </label>

        <label className="flex items-center justify-between text-xs text-gray-300">
          <span>Max Resolution Clamping:</span>
          <select
            value={preset.textureConfig.maxResolution}
            onChange={(e) => updateTexConfig('maxResolution', Number(e.target.value))}
            className="bg-[#161b26] border border-[#30363d] rounded px-2 py-1 text-xs"
          >
            <option value={4096}>4096 px (4K)</option>
            <option value={2048}>2048 px (2K)</option>
            <option value={1024}>1024 px (1K)</option>
            <option value={512}>512 px (Low)</option>
          </select>
        </label>

        <label className="flex items-center justify-between text-xs text-gray-300">
          <span>Generate Mipmaps:</span>
          <input
            type="checkbox"
            checked={preset.textureConfig.generateMipmaps}
            onChange={(e) => updateTexConfig('generateMipmaps', e.target.checked)}
            className="accent-purple-400"
          />
        </label>
      </div>

      {/* 3. Audio Transcoding Settings */}
      <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Volume2 size={14} /> Audio Codec & Channels
        </h3>

        <label className="flex items-center justify-between text-xs text-gray-300">
          <span>Target Codec:</span>
          <select
            value={preset.audioConfig.codec}
            onChange={(e) => updateAudioConfig('codec', e.target.value as AudioCodecTarget)}
            className="bg-[#161b26] border border-[#30363d] rounded px-2 py-1 text-xs"
          >
            <option value="Ogg_Vorbis">Ogg Vorbis (Standard)</option>
            <option value="Opus_VBR">Opus VBR (Ultra Low-Latency)</option>
            <option value="AAC_HE">AAC-HE (Mobile Standard)</option>
          </select>
        </label>

        <label className="flex items-center justify-between text-xs text-gray-300">
          <span>Target Bitrate:</span>
          <select
            value={preset.audioConfig.targetBitrateKbps}
            onChange={(e) => updateAudioConfig('targetBitrateKbps', Number(e.target.value))}
            className="bg-[#161b26] border border-[#30363d] rounded px-2 py-1 text-xs"
          >
            <option value={192}>192 kbps (High)</option>
            <option value={128}>128 kbps (Balanced)</option>
            <option value={96}>96 kbps (Mobile)</option>
            <option value={64}>64 kbps (Micro)</option>
          </select>
        </label>

        <label className="flex items-center justify-between text-xs text-gray-300">
          <span>Mono Downmix (3D HRTF):</span>
          <input
            type="checkbox"
            checked={preset.audioConfig.downmixToMonoFor3DSpatial}
            onChange={(e) => updateAudioConfig('downmixToMonoFor3DSpatial', e.target.checked)}
            className="accent-amber-400"
          />
        </label>
      </div>
    </div>
  );
}

function TargetPlatformIcon({ id }: { id: PlatformOptimizationPresetType }) {
  switch (id) {
    case 'AAA_PC_ULTRA': return <Monitor size={14} className="text-cyan-400" />;
    case 'STEAM_DECK_BALANCED': return <Gamepad2 size={14} className="text-purple-400" />;
    case 'MOBILE_VULKAN_PERF': return <Smartphone size={14} className="text-emerald-400" />;
    case 'VR_90FPS_LOW_LATENCY': return <Glasses size={14} className="text-orange-400" />;
    case 'WEBGL_LIGHTWEIGHT': return <Globe size={14} className="text-amber-400" />;
    default: return <Sliders size={14} className="text-pink-400" />;
  }
}
