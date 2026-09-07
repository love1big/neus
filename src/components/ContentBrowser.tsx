import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { 
  FolderTree, Mountain, PersonStanding, Palette, Image, Music, Box, File as FileIcon, 
  Search, UploadCloud, Trash2, ShieldCheck, FolderPlus, FilePlus, Network, Sparkles, 
  Loader2, Database, Cog, X, Save, Settings2, Sliders, Activity, Tag, BarChart3, 
  ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, Zap, FolderCheck, CheckSquare,
  Square, Layers, Cpu, Play
} from 'lucide-react';
import { RecentFilesTracker } from '../utils/RecentFilesTracker';
import { AIAssetBackgroundWorker } from '../utils/AIAssetBackgroundWorker';
import { AnalyzedProjectAsset, BackgroundWorkerMetrics } from '../utils/AssetClassificationTypes';
import AssetAutoTagWorkerInspector from './AssetAutoTagWorkerInspector';
import BatchAIProcessingDashboard from './BatchAIProcessingDashboard';

interface Asset {
  id: string;
  name: string;
  type: 'mat' | 'tex' | 'skm' | 'wav' | 'bp' | 'fbx' | 'obj' | 'any' | 'meta';
  folderId: string;
}

interface AssetFolder {
  id: string;
  name: string;
  parentId: string | null;
  icon?: any;
}

export default function ContentBrowser({ onOpenBlueprint }: { onOpenBlueprint?: () => void }) {
  const [folders, setFolders] = useState<AssetFolder[]>([
    { id: '1', name: 'CoreAssets', parentId: null, icon: FolderTree },
    { id: '2', name: 'Environments', parentId: '1', icon: Mountain },
    { id: '3', name: 'Characters', parentId: '1', icon: PersonStanding },
    { id: '4', name: 'Materials', parentId: '1', icon: Palette },
    { id: '5', name: 'Meshes', parentId: '1', icon: Box },
    { id: '6', name: 'Textures', parentId: '1', icon: Image },
  ]);

  const [assets, setAssets] = useState<Asset[]>([
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
  ]);

  const [activeFolderId, setActiveFolderId] = useState<string>('1');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [aiProcessingLogs, setAiProcessingLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInspectorModalOpen, setIsInspectorModalOpen] = useState(false);
  const [isBatchDashboardOpen, setIsBatchDashboardOpen] = useState(false);
  const [batchPresetSelectedIds, setBatchPresetSelectedIds] = useState<string[]>([]);
  const [multiSelectedIds, setMultiSelectedIds] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Background Worker Instance & Live Metrics
  const worker = useMemo(() => AIAssetBackgroundWorker.getInstance(), []);
  const [workerMetrics, setWorkerMetrics] = useState<BackgroundWorkerMetrics>(() => worker.getMetrics());
  const [analyzedAssetsMap, setAnalyzedAssetsMap] = useState<Map<string, AnalyzedProjectAsset>>(new Map());

  // Enqueue initial assets into Background Worker on mount
  useEffect(() => {
    worker.enqueueAssets(assets);

    const updateFromWorker = () => {
      setWorkerMetrics(worker.getMetrics());
      const map = new Map<string, AnalyzedProjectAsset>();
      worker.getAnalyzedAssets().forEach(a => map.set(a.id, a));
      setAnalyzedAssetsMap(map);
    };

    updateFromWorker();

    const handleMetricsEvent = (e: any) => {
      if (e.detail) {
        setWorkerMetrics(e.detail);
        const map = new Map<string, AnalyzedProjectAsset>();
        worker.getAnalyzedAssets().forEach(a => map.set(a.id, a));
        setAnalyzedAssetsMap(map);
      }
    };

    const handleTaggedEvent = (e: any) => {
      updateFromWorker();
    };

    const handleReqAutoOrganize = () => {
      worker.autoOrganizeContentBrowser(assets, setAssets);
    };

    const handleReqRevertOrganize = () => {
      worker.revertLastOrganization(assets, setAssets);
    };

    const handleReqRescan = () => {
      worker.rescanAll(assets);
    };

    window.addEventListener('asset-worker-metrics', handleMetricsEvent);
    window.addEventListener('asset-tagged', handleTaggedEvent);
    window.addEventListener('request-content-browser-auto-organize', handleReqAutoOrganize);
    window.addEventListener('request-content-browser-revert-organize', handleReqRevertOrganize);
    window.addEventListener('request-content-browser-rescan', handleReqRescan);

    return () => {
      window.removeEventListener('asset-worker-metrics', handleMetricsEvent);
      window.removeEventListener('asset-tagged', handleTaggedEvent);
      window.removeEventListener('request-content-browser-auto-organize', handleReqAutoOrganize);
      window.removeEventListener('request-content-browser-revert-organize', handleReqRevertOrganize);
      window.removeEventListener('request-content-browser-rescan', handleReqRescan);
    };
  }, [assets, worker]);

  
  const handleSelectAsset = (asset: Asset) => {
    setSelectedAssetId(asset.id);
    const folder = folders.find(f => f.id === asset.folderId);
    let itemType: any = 'asset';
    if (asset.type === 'tex') itemType = 'texture';
    else if (asset.type === 'bp') itemType = 'blueprint';
    else if (asset.type === 'skm' || asset.type === 'obj' || asset.type === 'fbx') itemType = 'mesh';
    else if (asset.type === 'wav') itemType = 'audio';

    RecentFilesTracker.trackOpenedItem({
      id: asset.id,
      name: asset.name,
      type: itemType,
      category: folder?.name || 'Assets',
      path: `${folder?.name || 'CoreAssets'}/${asset.name}`,
      description: `${asset.type.toUpperCase()} asset in ${folder?.name || 'Content Browser'}`
    });
  };

  React.useEffect(() => {
    const handleOpenAsset = (e: any) => {
      const assetId = e.detail;
      const asset = assets.find(a => a.id === assetId);
      if (asset) {
        setActiveFolderId(asset.folderId);
        handleSelectAsset(asset);
      }
    };
    window.addEventListener('open-asset', handleOpenAsset);
    return () => window.removeEventListener('open-asset', handleOpenAsset);
  }, [assets, folders]);

  const processImportedFiles = async (files: File[]) => {
    setIsProcessing(true);
    setAiProcessingLogs([]);
    const newAssets: Asset[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const baseName = file.name.split('.')[0] || file.name;
      
      let type: Asset['type'] = 'any';
      let aiAction = '';
      
      setAiProcessingLogs(prev => [...prev, `[AI-Ingest] Analyzing "${file.name}"...`]);
      await new Promise(r => setTimeout(r, 400));
      
      if (ext === 'obj' || ext === 'fbx') {
        type = ext as 'obj'|'fbx';
        aiAction = 'Optimizing topology, generating LoDs...';
      } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'tga') {
        type = 'tex';
        aiAction = 'Generating PBR maps (Normal, Roughness), compressing to BC7...';
      } else if (ext === 'mat') {
        type = 'mat';
        aiAction = 'Compiling shader bindings...';
      } else if (ext === 'wav' || ext === 'mp3') {
        type = 'wav';
        aiAction = 'Normalizing audio, encoding to OGG...';
      } else {
        aiAction = 'Categorizing generic asset...';
      }
      
      setAiProcessingLogs(prev => [...prev, `[AI-Process] ${aiAction}`]);
      await new Promise(r => setTimeout(r, 600));
      
      const fileId = Math.random().toString(36).substring(2, 9);
      
      newAssets.push({
        id: fileId,
        name: baseName,
        type,
        folderId: activeFolderId
      });
      
      setAiProcessingLogs(prev => [...prev, `[AI-Meta] Generating associated .meta data for ${baseName}...`]);
      await new Promise(r => setTimeout(r, 300));
      
      newAssets.push({
        id: fileId + '_meta',
        name: `${baseName}.meta`,
        type: 'meta',
        folderId: activeFolderId
      });
    }
    
    setAiProcessingLogs(prev => [...prev, `✔ AI Import complete. ${files.length * 2} assets added.`]);
    await new Promise(r => setTimeout(r, 1000));
    
    setAssets(prev => [...prev, ...newAssets]);
    setIsProcessing(false);

    // Enqueue all newly imported assets into AI Background Worker for immediate entropy and heuristic tagging
    worker.enqueueAssets(newAssets);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImportedFiles(Array.from(e.target.files));
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImportedFiles(Array.from(e.dataTransfer.files));
    }
  }, [activeFolderId]);

  const createFolder = () => {
    const name = prompt('New Folder Name:');
    if (name) {
      setFolders([...folders, { id: Math.random().toString(36).substring(2, 9), name, parentId: activeFolderId, icon: FolderTree }]);
    }
  };

  const deleteAsset = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm('Delete this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const handleRunAutoOrganize = () => {
    worker.autoOrganizeContentBrowser(assets, setAssets);
  };

  const renderIconForType = (type: string) => {
    switch (type) {
      case 'mat': return <Palette size={24} className="text-[#f85149]" />;
      case 'tex': return <Image size={24} className="text-[#bc8cff]" />;
      case 'skm': 
      case 'fbx': 
      case 'obj': return <Box size={28} className="text-[#58a6ff]" />;
      case 'wav': return <Music size={24} className="text-[#3fb950]" />;
      case 'bp': return <Network size={28} className="text-[#3fb950]" />;
      case 'meta': return <Database size={24} className="text-[#888]" />;
      default: return <FileIcon size={24} className="text-[#888]" />;
    }
  };

  const renderTypeBadge = (type: string) => {
    const map: Record<string, { bg: string, text: string }> = {
      mat: { bg: '#f85149', text: 'MAT' },
      tex: { bg: '#bc8cff', text: 'TEX' },
      skm: { bg: '#58a6ff', text: 'SKM' },
      fbx: { bg: '#58a6ff', text: 'FBX' },
      obj: { bg: '#58a6ff', text: 'OBJ' },
      wav: { bg: '#3fb950', text: 'WAV' },
      bp: { bg: '#3fb950', text: 'BP' },
      meta: { bg: '#333', text: 'META' },
    };
    const style = map[type] || { bg: '#888', text: type.toUpperCase() };
    return (
      <div className="absolute top-0 right-0 text-[#0a0a0a] text-[8px] font-bold px-1 rounded-bl" style={{ backgroundColor: style.bg }}>
        {style.text}
      </div>
    );
  };

  const renderAssetPreview = (asset: Asset) => {
    if (asset.type === 'mat') {
      const g1 = ['#f85149', '#333', '#888'][Math.floor(Math.random()*3)];
      const g2 = ['#ff7b72', '#888', '#fff'][Math.floor(Math.random()*3)];
      return (
        <div className="w-full h-full rounded-full shadow-inner border border-white/10" style={{ background: `linear-gradient(to top right, ${g1}, ${g2})` }}></div>
      );
    }
    return renderIconForType(asset.type);
  };

  const filteredAssets = assets.filter(a => a.folderId === activeFolderId && a.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedAsset = selectedAssetId ? assets.find(a => a.id === selectedAssetId) : null;
  const selectedAnalyzed = selectedAssetId ? analyzedAssetsMap.get(selectedAssetId) : null;

  // Count untagged assets across project
  const untaggedCount = useMemo(() => {
    return assets.filter(a => {
      const analyzed = analyzedAssetsMap.get(a.id);
      return !analyzed || analyzed.tags.length === 0;
    }).length;
  }, [assets, analyzedAssetsMap]);

  // Multi-Selection Utilities
  const toggleMultiSelect = (assetId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMultiSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(assetId)) next.delete(assetId);
      else next.add(assetId);
      return next;
    });
  };

  const selectAllUntagged = () => {
    const untagged = assets.filter(a => {
      const analyzed = analyzedAssetsMap.get(a.id);
      return !analyzed || analyzed.tags.length === 0;
    }).map(a => a.id);
    setMultiSelectedIds(new Set(untagged));
    setIsMultiSelectMode(true);
  };

  const selectAllInCurrentFolder = () => {
    const current = filteredAssets.map(a => a.id);
    setMultiSelectedIds(new Set(current));
    setIsMultiSelectMode(true);
  };

  const clearMultiSelection = () => {
    setMultiSelectedIds(new Set());
    setIsMultiSelectMode(false);
  };

  const openBatchProcessing = (specificIds?: string[]) => {
    if (specificIds && specificIds.length > 0) {
      setBatchPresetSelectedIds(specificIds);
    } else if (multiSelectedIds.size > 0) {
      setBatchPresetSelectedIds(Array.from(multiSelectedIds));
    } else {
      const untagged = assets.filter(a => {
        const analyzed = analyzedAssetsMap.get(a.id);
        return !analyzed || analyzed.tags.length === 0;
      }).map(a => a.id);
      setBatchPresetSelectedIds(untagged.length > 0 ? untagged : assets.slice(0, 5).map(a => a.id));
    }
    setIsBatchDashboardOpen(true);
  };

  const handleApplyBatchGeneratedAssets = (newAssets: any[]) => {
    setAssets(prev => [...prev, ...newAssets]);
    worker.enqueueAssets(newAssets);
    clearMultiSelection();
  };

  // A very simple recursive folder tree
  const renderFolderHierarchy = (parentId: string | null, depth = 0) => {
    const children = folders.filter(f => f.parentId === parentId);
    return children.map(folder => {
      const Icon = folder.icon || FolderTree;
      const isActive = activeFolderId === folder.id;
      const count = assets.filter(a => a.folderId === folder.id).length;

      return (
         <div key={folder.id}>
           <div 
             className={`px-2 py-1 cursor-pointer rounded-sm flex items-center justify-between group ${isActive ? 'bg-[#222] text-[#fff]' : 'hover:bg-[#222]'}`}
             style={{ paddingLeft: `${depth * 12 + 8}px` }}
             onClick={() => setActiveFolderId(folder.id)}
           >
             <div className="flex items-center gap-2 truncate">
               <Icon size={14} className={isActive ? 'text-[#e3b341]' : 'text-[#888]'}/> 
               <span className="truncate">{folder.name}</span>
             </div>
             <span className="text-[9px] text-[#666] font-mono group-hover:text-[#aaa]">{count}</span>
           </div>
           {renderFolderHierarchy(folder.id, depth + 1)}
         </div>
      );
    });
  };

  return (
    <div className="flex flex-1 text-sans font-sans h-full overflow-hidden bg-[#0a0a0a] relative">
      {/* Sidebar - Folders */}
      <div className="w-[200px] border-r border-[#222] p-2 flex flex-col gap-1 text-[#888] overflow-y-auto custom-scrollbar shrink-0">
         <div className="flex justify-between items-center px-1 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Asset Folders</span>
            <button onClick={createFolder} className="hover:text-[#fff]"><FolderPlus size={14} /></button>
         </div>
         {renderFolderHierarchy(null)}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        {/* Toolbar */}
        <div className="h-[42px] bg-[#111] border-b border-[#222] flex items-center justify-between px-3 shrink-0 gap-2 overflow-x-auto">
           <div className="flex items-center gap-2 shrink-0">
             <button onClick={() => fileInputRef.current?.click()} className="bg-[#58a6ff] hover:bg-[#3b8eed] text-white px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
                <Sparkles size={13} /> AI Import
             </button>

             {/* Batch AI Processing Launch Button */}
             <button
                onClick={() => openBatchProcessing()}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.35)] cursor-pointer"
                title="Open Batch AI Processing Dashboard to infer metadata & synthesize missing PBR maps with multi-agents"
             >
                <Cpu size={13} className="text-pink-200" /> Batch AI Processing
                {untaggedCount > 0 && (
                  <span className="bg-white/20 text-white px-1.5 py-0.2 rounded-full text-[9px] font-mono font-extrabold">
                    {untaggedCount}
                  </span>
                )}
             </button>

             <button onClick={() => {
                const name = prompt('Blueprint Name:');
                if (name) {
                  const newAsset = { id: Math.random().toString(36).substring(2, 9), name, type: 'bp' as const, folderId: activeFolderId };
                  setAssets([...assets, newAsset]);
                  worker.enqueueAssets([newAsset]);
                }
             }} className="bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-[#ccc] px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
                <FilePlus size={13} /> Blueprint
             </button>

             {/* Auto-Organize Action */}
             <button
                onClick={handleRunAutoOrganize}
                className="bg-[#238636]/20 hover:bg-[#238636]/30 border border-[#238636]/50 text-[#3fb950] px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Automatically sort and organize all assets into their ideal folders based on Shannon Entropy & Heuristics"
             >
                <FolderCheck size={13} /> Auto-Organize
             </button>

             {/* Multi-Select Toggle */}
             <button
                onClick={() => {
                  setIsMultiSelectMode(!isMultiSelectMode);
                  if (isMultiSelectMode) setMultiSelectedIds(new Set());
                }}
                className={`border px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isMultiSelectMode 
                    ? 'bg-[#1f6feb] border-[#58a6ff] text-white' 
                    : 'bg-[#1a1a1a] hover:bg-[#222] border-[#333] text-[#8b949e]'
                }`}
                title="Toggle Batch Multi-Select Mode"
             >
                <CheckSquare size={13} /> Multi-Select {multiSelectedIds.size > 0 && `(${multiSelectedIds.size})`}
             </button>
           </div>

           {/* Center Background Worker Status Badge */}
           <div 
              onClick={() => setIsInspectorModalOpen(true)}
              className="flex items-center gap-2 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] px-2.5 py-1 rounded cursor-pointer transition-colors shrink-0"
              title="Click to open AI Asset Auto-Tag & Entropy Inspector"
           >
              <div className="flex items-center gap-1.5 text-[10px]">
                <Activity size={11} className={workerMetrics.state === 'scanning' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'} />
                <span className="font-mono text-[#8b949e]">AI Worker:</span>
                <span className={`font-mono font-bold ${workerMetrics.state === 'scanning' ? 'text-amber-300' : 'text-emerald-400'}`}>
                  {workerMetrics.state.toUpperCase()} ({workerMetrics.scanProgressPercent}%)
                </span>
              </div>
              <span className="text-[9px] bg-[#0d1117] text-[#58a6ff] px-1 py-0.2 rounded font-mono border border-[#30363d]">
                {workerMetrics.autoTaggedCount} Tagged
              </span>
           </div>
           
           <div className="flex items-center bg-[#1a1a1a] border border-[#333] rounded px-2 w-[180px] shrink-0">
             <Search size={12} className="text-[#888]" />
             <input type="text" placeholder="Search assets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-[#ccc] text-[11px] px-2 py-1.5 w-full" />
           </div>
           
           <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleImport} />
        </div>

        {/* Drag Overlay */}
        {isDragOver && !isProcessing && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#58a6ff]/10 backdrop-blur-sm border-2 border-dashed border-[#58a6ff] m-4 rounded-xl pointer-events-none">
             <div className="bg-[#0a0a0a] border border-[#333] p-6 rounded-lg text-center shadow-2xl flex flex-col items-center">
               <UploadCloud size={48} className="text-[#58a6ff] mb-4 animate-bounce" />
               <h3 className="text-xl font-bold text-white mb-2">Drop files for AI-driven Import</h3>
               <p className="text-[#888] text-sm">Will auto-categorize, optimize logic, and generate .meta automatically.</p>
             </div>
          </div>
        )}

        {/* AI Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm">
             <div className="bg-[#161b22] border border-[#30363d] w-[400px] rounded-lg shadow-2xl flex flex-col overflow-hidden">
               <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
                 <h3 className="text-[#58a6ff] font-bold flex items-center gap-2"><Sparkles size={16} /> AI Asset Processing</h3>
                 <Loader2 size={16} className="text-[#58a6ff] animate-spin" />
               </div>
               <div className="p-4 flex flex-col gap-2 max-h-[200px] overflow-y-auto bg-[#0d1117] font-mono text-[10px]">
                 {aiProcessingLogs.map((log, i) => (
                   <div key={i} className="text-[#c9d1d9] flex justify-start items-center gap-2">
                     <span className="text-[#3fb950]">›</span> {log}
                   </div>
                 ))}
               </div>
               <div className="p-3 bg-[#111] border-t border-[#30363d] text-[10px] text-[#888] flex items-center gap-2">
                 <Cog size={12} className="animate-spin" /> Analyzing geometry and calculating LODs...
               </div>
             </div>
          </div>
        )}

        {/* Assets Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
           <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 content-start pb-16">
             {filteredAssets.length === 0 && (
                <div className="col-span-full h-[150px] flex items-center justify-center text-[#888] text-[12px]">
                   No assets found in this folder.
                </div>
             )}
             {filteredAssets.map(asset => {
                const analyzed = analyzedAssetsMap.get(asset.id);
                const isMultiSelected = multiSelectedIds.has(asset.id);
                const isCurrentSelected = selectedAssetId === asset.id;

                return (
                  <div key={asset.id} 
                       className={`flex flex-col items-center gap-1.5 cursor-pointer group p-2 rounded transition-all relative ${
                         isMultiSelected 
                           ? 'bg-purple-950/40 ring-2 ring-purple-500' 
                           : isCurrentSelected 
                             ? 'bg-[#222] ring-1 ring-[#58a6ff]' 
                             : 'hover:bg-[#1a1a1a]'
                       }`} 
                       onClick={(e) => {
                         if (isMultiSelectMode || e.shiftKey || e.ctrlKey || e.metaKey) {
                           toggleMultiSelect(asset.id, e);
                         } else {
                           handleSelectAsset(asset);
                         }
                       }} 
                       onDoubleClick={() => asset.type === 'bp' && onOpenBlueprint && onOpenBlueprint()}>
                     
                     {/* Multi-Select Checkbox Badge */}
                     {(isMultiSelectMode || isMultiSelected) && (
                       <button
                         onClick={(e) => toggleMultiSelect(asset.id, e)}
                         className={`absolute -top-1 -left-1 z-20 w-5 h-5 rounded flex items-center justify-center border transition-all ${
                           isMultiSelected 
                             ? 'bg-purple-600 border-purple-300 text-white shadow-md' 
                             : 'bg-[#161b22]/90 border-[#444c56] text-transparent hover:text-purple-300'
                         }`}
                       >
                         <CheckSquare size={12} className={isMultiSelected ? 'opacity-100' : 'opacity-40'} />
                       </button>
                     )}

                     <div className={`w-16 h-16 bg-[#161616] border ${
                       isMultiSelected ? 'border-purple-500' : isCurrentSelected ? 'border-[#58a6ff]' : 'border-[#333] group-hover:border-[#888]'
                     } rounded flex items-center justify-center p-1 relative overflow-hidden drop-shadow-md`}>
                        {renderAssetPreview(asset)}
                        {renderTypeBadge(asset.type)}

                        {/* Entropy Score overlay */}
                        {analyzed && (
                          <div 
                            className="absolute bottom-0 left-0 text-[7px] font-mono px-1 py-0.2 rounded-tr bg-black/80 font-semibold"
                            style={{
                              color: analyzed.entropyProfile.entropyScore > 7.0 ? '#e3b341' : analyzed.entropyProfile.entropyScore < 4.0 ? '#3fb950' : '#58a6ff'
                            }}
                            title={`Shannon Entropy: ${analyzed.entropyProfile.entropyScore}/8.0`}
                          >
                            H={analyzed.entropyProfile.entropyScore}
                          </div>
                        )}

                        <button onClick={(e) => deleteAsset(e, asset.id)} className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 bg-[#f85149] text-white p-0.5 rounded transition-opacity z-10">
                          <Trash2 size={10} />
                        </button>
                     </div>
                     
                     <span className={`text-[10px] transition-colors text-center w-full truncate px-1 ${
                       isMultiSelected ? 'text-purple-300 font-bold' : isCurrentSelected ? 'text-[#58a6ff] font-bold' : 'text-[#ccc] group-hover:text-[#fff]'
                     }`} title={asset.name}>
                       {asset.name}
                     </span>

                     {/* AI Semantic Tag Pills */}
                     {analyzed && analyzed.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-0.5 justify-center max-w-full overflow-hidden">
                          {analyzed.tags.slice(0, 1).map(tag => (
                            <span
                              key={tag.id}
                              className="text-[8px] px-1 py-0.2 rounded truncate max-w-[80px]"
                              style={{
                                backgroundColor: `${tag.colorHex}20`,
                                color: tag.colorHex
                              }}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                     ) : (
                        <span className="text-[7.5px] text-amber-400/80 bg-amber-950/40 px-1 py-0.2 rounded border border-amber-800/40 font-mono">
                          UNTAGGED
                        </span>
                     )}
                  </div>
                );
             })}
           </div>

           {/* Floating Batch Selection Dock */}
           {(multiSelectedIds.size > 0 || isMultiSelectMode) && (
             <div className="sticky bottom-3 left-0 right-0 max-w-2xl mx-auto z-30 bg-[#161b22]/95 backdrop-blur-md border border-purple-500/50 rounded-xl p-2.5 shadow-2xl flex items-center justify-between gap-3 text-xs animate-fadeIn">
               <div className="flex items-center gap-2">
                 <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
                 <span className="font-bold text-white font-mono text-xs">
                   {multiSelectedIds.size} <span className="text-[#8b949e] font-normal">assets selected</span>
                 </span>
                 <button
                   onClick={selectAllUntagged}
                   className="text-[10px] text-purple-300 hover:text-purple-100 hover:underline cursor-pointer ml-1"
                 >
                   Select Untagged ({untaggedCount})
                 </button>
                 <span className="text-[#30363d]">•</span>
                 <button
                   onClick={selectAllInCurrentFolder}
                   className="text-[10px] text-[#58a6ff] hover:text-white hover:underline cursor-pointer"
                 >
                   Select Folder
                 </button>
               </div>

               <div className="flex items-center gap-2">
                 <button
                   onClick={clearMultiSelection}
                   className="px-2 py-1 text-[10px] text-[#8b949e] hover:text-white transition-colors cursor-pointer"
                 >
                   Clear
                 </button>
                 <button
                   onClick={() => openBatchProcessing(Array.from(multiSelectedIds))}
                   disabled={multiSelectedIds.size === 0}
                   className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                 >
                   <Cpu size={13} /> Run Multi-Agent Batch
                 </button>
               </div>
             </div>
           )}
        </div>
      </div>

      {/* Asset Inspector Panel */}
      {selectedAsset && (
        <div className="w-[310px] border-l border-[#222] bg-[#0d1117] flex flex-col shrink-0 overflow-hidden shadow-xl z-10 transition-transform">
           <div className="h-[40px] border-b border-[#222] bg-[#111] flex items-center justify-between px-3 shrink-0">
              <span className="text-[12px] font-bold text-[#e3b341] flex items-center gap-2">
                 <Settings2 size={14} /> Asset Inspector
              </span>
              <div className="flex items-center gap-1">
                <button
                   onClick={() => setIsInspectorModalOpen(true)}
                   className="text-[#58a6ff] hover:text-white p-1 text-[10px] flex items-center gap-1"
                   title="Open AI Auto-Tag & Entropy Telemetry Hub"
                >
                   <BarChart3 size={13} />
                </button>
                <button onClick={() => setSelectedAssetId(null)} className="text-[#888] hover:text-[#fff] p-1"><X size={14} /></button>
              </div>
           </div>
           
           <div className="p-3.5 flex flex-col gap-3.5 overflow-y-auto custom-scrollbar flex-1 text-xs">
              {/* Header Info */}
              <div className="flex gap-2.5 items-start border-b border-[#30363d] pb-3">
                 <div className="w-14 h-14 bg-[#161616] border border-[#30363d] rounded flex shadow-inner relative items-center justify-center shrink-0 p-1 overflow-hidden">
                    {renderAssetPreview(selectedAsset)}
                    {renderTypeBadge(selectedAsset.type)}
                 </div>
                 <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="text-[#c9d1d9] text-[12px] font-bold truncate" title={selectedAsset.name}>{selectedAsset.name}</span>
                    <span className="text-[#8b949e] text-[9px] font-mono">ID: {selectedAsset.id}</span>
                    <span className="text-[#8b949e] text-[9px] uppercase">{selectedAsset.type.toUpperCase()} File</span>
                 </div>
              </div>

              {/* AI Auto-Generated Semantic Tags Section */}
              {selectedAnalyzed && (
                <div className="p-2.5 bg-[#161b22] rounded border border-[#30363d] flex flex-col gap-2">
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-[#58a6ff] uppercase tracking-wider flex items-center gap-1">
                       <Tag size={11} /> AI Semantic Tags
                     </span>
                     <span className="text-[9px] font-mono text-emerald-400">
                       {Math.round(selectedAnalyzed.confidenceScore * 100)}% Conf
                     </span>
                   </div>
                   <div className="flex flex-wrap gap-1">
                     {selectedAnalyzed.tags.map(tag => (
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
                </div>
              )}

              {/* Shannon Entropy & Heuristics Section */}
              {selectedAnalyzed && (
                <div className="p-2.5 bg-[#161b22] rounded border border-[#30363d] flex flex-col gap-2">
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-[#e3b341] uppercase tracking-wider flex items-center gap-1">
                       <BarChart3 size={11} /> File Entropy (Shannon)
                     </span>
                     <span className="font-mono text-[10px] text-white font-bold">
                       {selectedAnalyzed.entropyProfile.entropyScore} / 8.0
                     </span>
                   </div>
                   <p className="text-[9px] text-[#8b949e] leading-relaxed">
                     {selectedAnalyzed.entropyProfile.entropySummary}
                   </p>
                   <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-[#8b949e] pt-1 border-t border-[#30363d]">
                     <div>ASCII: <span className="text-white">{(selectedAnalyzed.entropyProfile.asciiPrintableRatio * 100).toFixed(0)}%</span></div>
                     <div>Nulls: <span className="text-white">{(selectedAnalyzed.entropyProfile.nullByteRatio * 100).toFixed(0)}%</span></div>
                   </div>

                   {/* Folder Routing suggestion */}
                   <div className="pt-1.5 border-t border-[#30363d] flex flex-col gap-1">
                      <div className="text-[9px] text-[#8b949e]">Suggested Location:</div>
                      <div className="flex items-center justify-between bg-[#0d1117] p-1.5 rounded border border-[#30363d] text-[9px] font-mono">
                        <span className="text-[#58a6ff] truncate">{selectedAnalyzed.suggestedFolder.suggestedFolderPath}</span>
                        {selectedAsset.folderId !== selectedAnalyzed.suggestedFolder.suggestedFolderId && (
                          <button
                            onClick={() => {
                              const targetFolderId = selectedAnalyzed.suggestedFolder.suggestedFolderId;
                              setAssets(assets.map(a => a.id === selectedAsset.id ? { ...a, folderId: targetFolderId } : a));
                              selectedAnalyzed.folderId = targetFolderId;
                              selectedAnalyzed.isOrganized = true;
                            }}
                            className="bg-[#1f6feb] hover:bg-[#388bfd] text-white px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 ml-1 cursor-pointer"
                          >
                            Relocate
                          </button>
                        )}
                      </div>
                   </div>
                </div>
              )}

              {/* Editable Meta Parameters */}
              <div className="flex flex-col gap-2.5">
                 <div className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders size={11} /> Optimization Settings
                 </div>
                 
                 {(selectedAsset.name.toLowerCase().includes('tex') || selectedAsset.type === 'tex' || selectedAsset.name.includes('T_')) ? (
                   <>
                     <div className="flex flex-col gap-1">
                       <label className="text-[9px] text-[#8b949e] font-bold">Compression Format</label>
                       <select className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[10px] rounded px-2 py-1 outline-none focus:border-[#58a6ff]">
                         <option>BC7 (High Quality, PC/Console)</option>
                         <option>ASTC (Mobile PBR)</option>
                         <option>DXT5 (Legacy)</option>
                         <option>Uncompressed (Raw UI)</option>
                       </select>
                     </div>
                     <div className="flex flex-col gap-1">
                       <label className="text-[9px] text-[#8b949e] font-bold">Max Resolution</label>
                       <select className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[10px] rounded px-2 py-1 outline-none focus:border-[#58a6ff]">
                         <option>4096 (Cinematic)</option>
                         <option>2048 (Default Hero)</option>
                         <option>1024 (Prop)</option>
                         <option>512 (Background)</option>
                       </select>
                     </div>
                     <div className="flex items-center justify-between border border-[#30363d] p-1.5 bg-[#161b22] rounded hover:border-[#58a6ff] transition-colors">
                        <span className="text-[9px] text-[#c9d1d9]">Generate MipMaps</span>
                        <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-3 h-3 cursor-pointer" />
                     </div>
                   </>
                 ) : (selectedAsset.type === 'obj' || selectedAsset.type === 'fbx' || selectedAsset.type === 'skm' || selectedAsset.name.toLowerCase().includes('skm') || selectedAsset.name.toLowerCase().includes('sm_') || selectedAsset.name.toLowerCase().includes('bp_') || selectedAsset.type === 'bp') ? (
                   <>
                     <div className="flex flex-col gap-1">
                       <label className="text-[9px] text-[#8b949e] font-bold">LOD Generation</label>
                       <select className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-[10px] rounded px-2 py-1 outline-none focus:border-[#58a6ff]">
                         <option>Auto (4 Levels)</option>
                         <option>Aggressive (6 Levels)</option>
                         <option>Hero Only (Base + LOD1)</option>
                         <option>Disabled</option>
                       </select>
                     </div>
                     <div className="flex items-center justify-between border border-[#30363d] p-1.5 bg-[#161b22] rounded hover:border-[#58a6ff] transition-colors">
                        <span className="text-[9px] text-[#c9d1d9]">Generate Lightmap UVs</span>
                        <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-3 h-3 cursor-pointer" />
                     </div>
                   </>
                 ) : (
                   <div className="text-[9px] text-[#8b949e] bg-[#161b22] p-2 rounded border border-[#30363d] text-center italic">
                     Standard engine defaults configured.
                   </div>
                 )}
                 
              </div>
           </div>

           <div className="p-3 border-t border-[#30363d] bg-[#0d1117] mt-auto flex flex-col gap-2">
              {/* Quick Launch AI Multi-Agent PBR for this asset */}
              <button
                onClick={() => openBatchProcessing([selectedAsset.id])}
                className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-1.5 rounded text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Cpu size={13} /> Synthesize PBR Maps (AI Multi-Agent)
              </button>

              <button 
                 className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-1.5 rounded text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                 onClick={() => {
                    alert('Meta attributes saved successfully!');
                 }}
              >
                 <Save size={13} /> Save Metadata Fixes
              </button>
           </div>
        </div>
      )}

      {/* AI Asset Auto-Tag & Entropy Inspector Modal */}
      {isInspectorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-6xl h-[88vh] bg-[#0d1117] rounded-xl border border-[#30363d] shadow-2xl overflow-hidden flex flex-col">
            <AssetAutoTagWorkerInspector
              isOpen={true}
              onClose={() => setIsInspectorModalOpen(false)}
              onSelectAsset={(assetId) => {
                const found = assets.find(a => a.id === assetId);
                if (found) {
                  setActiveFolderId(found.folderId);
                  setSelectedAssetId(found.id);
                }
              }}
              embeddedMode={true}
            />
          </div>
        </div>
      )}

      {/* Batch AI Processing Dashboard Modal */}
      {isBatchDashboardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-7xl h-[92vh] bg-[#0d1117] rounded-2xl border border-purple-500/40 shadow-2xl overflow-hidden flex flex-col">
            <BatchAIProcessingDashboard
              allAssets={assets}
              onClose={() => setIsBatchDashboardOpen(false)}
              initialSelectedAssetIds={batchPresetSelectedIds}
              onApplyGeneratedAssets={(newAssets) => {
                handleApplyBatchGeneratedAssets(newAssets);
                setIsBatchDashboardOpen(false);
              }}
              embeddedMode={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

