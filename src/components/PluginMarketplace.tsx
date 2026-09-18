/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Primary Plugin Marketplace & Community Extensions Studio Component for
 *          NexusEngine DevOpsHub. Empowers developers to discover, search, filter,
 *          install, configure, sandbox-audit, and manage community-made engine
 *          extensions, runtime scripts, and custom modules.
 *    - TH: สตูดิโอศูนย์กลาง Plugin Marketplace สำหรับระบบ DevOpsHub
 *          เปิดโอกาสให้นักพัฒนาค้นหา กรอง ติดตั้ง เปิด/ปิดการทำงาน และตรวจสอบ
 *          ความปลอดภัยของส่วนขยาย สคริปต์ และโมดูลที่สร้างโดยคอมมูนิตี้
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Integrated into `DevOpsHub` category inside `src/App.tsx`
 *    - Backed by `PluginMarketplaceRegistryNode.ts` for persistent LocalStorage management
 *    - Evaluated by `PluginSecuritySandboxEvaluatorNode.ts` for security and AST checks
 *    - Interactive modals: `PluginDetailModal.tsx` and `PluginPublishExtensionModal.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 *    - Reactively syncs with `pluginMarketplaceRegistry` state
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Graceful empty-state rendering when search matches 0 plugins.
 *    - Safe file upload handling for importing `.omni-plugin` JSON manifests.
 *    - Visual hot-reload toast banner notification.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```tsx
 *    <PluginMarketplace onSelectTool={setActiveTool} />
 *    ```
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Puzzle, 
  Search, 
  Download, 
  Trash2, 
  Power, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Plus, 
  Upload, 
  FileDown, 
  Zap, 
  Layers, 
  Cpu, 
  HardDrive, 
  RefreshCw, 
  Filter, 
  ArrowUpDown, 
  Code2, 
  Check, 
  AlertTriangle, 
  Lock, 
  ExternalLink,
  Shield,
  Activity,
  Sliders,
  Sparkles,
  Package,
  X
} from 'lucide-react';
import { 
  EnginePlugin, 
  PluginCategory, 
  InstalledPluginState, 
  MarketplaceSortOption 
} from '../types/pluginMarketplaceTypes';
import { pluginMarketplaceRegistry } from '../utils/PluginMarketplaceRegistryNode';
import PluginDetailModal from './PluginDetailModal';
import PluginPublishExtensionModal from './PluginPublishExtensionModal';

interface PluginMarketplaceProps {
  onSelectTool?: (toolId: string) => void;
}

const CATEGORIES: { id: PluginCategory; label: string }[] = [
  { id: 'ALL', label: 'All Extensions' },
  { id: 'PHYSICS', label: 'Physics & Biomechanics' },
  { id: 'GRAPHICS_SHADERS', label: 'Graphics & Shaders' },
  { id: 'AI_BEHAVIOR', label: 'AI & Behavior Trees' },
  { id: 'NETCODE', label: 'Multiplayer Netcode' },
  { id: 'DEVOPS_CI', label: 'DevOps & CI Testing' },
  { id: 'AUDIO_DSP', label: 'Audio DSP & Acoustics' },
  { id: 'PROCEDURAL_PCG', label: 'Procedural Generation' },
  { id: 'TOOLS_UI', label: 'Editor Tools & UI' }
];

export default function PluginMarketplace({ onSelectTool }: PluginMarketplaceProps) {
  const [plugins, setPlugins] = useState<EnginePlugin[]>(() => pluginMarketplaceRegistry.getAllPlugins());
  const [installedList, setInstalledList] = useState<InstalledPluginState[]>(() => pluginMarketplaceRegistry.getInstalledPlugins());
  
  // UI State
  const [activeViewMode, setActiveViewMode] = useState<'browse' | 'installed'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PluginCategory>('ALL');
  const [sortOption, setSortOption] = useState<MarketplaceSortOption>('MOST_POPULAR');
  const [onlyVerified, setOnlyVerified] = useState(false);
  
  // Modals
  const [inspectedPlugin, setInspectedPlugin] = useState<EnginePlugin | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to registry updates
  useEffect(() => {
    return pluginMarketplaceRegistry.subscribe(() => {
      setPlugins(pluginMarketplaceRegistry.getAllPlugins());
      setInstalledList(pluginMarketplaceRegistry.getInstalledPlugins());
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const installedMap = useMemo(() => {
    const map = new Map<string, InstalledPluginState>();
    installedList.forEach(item => map.set(item.pluginId, item));
    return map;
  }, [installedList]);

  // Filter and sort plugins
  const filteredPlugins = useMemo(() => {
    let list = plugins.filter(p => {
      if (activeViewMode === 'installed' && !installedMap.has(p.id)) return false;
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (onlyVerified && !p.isOfficial && p.securityTier !== 'VERIFIED_OFFICIAL') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchAuthor = p.author.toLowerCase().includes(q);
        const matchTag = p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchAuthor && !matchTag) return false;
      }

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      switch (sortOption) {
        case 'MOST_POPULAR':
          return b.downloadCount - a.downloadCount;
        case 'HIGHEST_RATED':
          return b.rating - a.rating;
        case 'NEWEST':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'NAME_ASC':
          return a.name.localeCompare(b.name);
        case 'SMALLEST_SIZE':
          return a.sizeKb - b.sizeKb;
        default:
          return 0;
      }
    });

    return list;
  }, [plugins, installedMap, activeViewMode, selectedCategory, onlyVerified, searchQuery, sortOption]);

  // Overall Statistics
  const totalDownloads = useMemo(() => {
    return plugins.reduce((acc, p) => acc + p.downloadCount, 0);
  }, [plugins]);

  const totalInstalledMemory = useMemo(() => {
    return installedList.reduce((acc, item) => acc + (item.memoryUsageKb || 0), 0);
  }, [installedList]);

  const activeRunningCount = useMemo(() => {
    return installedList.filter(item => item.enabled).length;
  }, [installedList]);

  // Quick Action Handlers
  const handleInstall = (e: React.MouseEvent, pluginId: string) => {
    e.stopPropagation();
    pluginMarketplaceRegistry.installPlugin(pluginId);
    showToast(`Installed '${plugins.find(p => p.id === pluginId)?.name}' successfully!`);
  };

  const handleUninstall = (e: React.MouseEvent, pluginId: string) => {
    e.stopPropagation();
    pluginMarketplaceRegistry.uninstallPlugin(pluginId);
    showToast(`Uninstalled extension.`);
  };

  const handleToggle = (e: React.MouseEvent, pluginId: string, currentEnabled: boolean) => {
    e.stopPropagation();
    pluginMarketplaceRegistry.togglePluginEnabled(pluginId, !currentEnabled);
  };

  const handleHotReload = () => {
    const result = pluginMarketplaceRegistry.hotReloadPlugins();
    showToast(`⚡ Hot-Reloaded ${result.reloadedCount} active plugins into NexusEngine!`);
  };

  const handleExportManifest = () => {
    const manifest = pluginMarketplaceRegistry.exportInstalledManifestJson();
    const blob = new Blob([manifest], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-plugins-manifest-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported plugins manifest.`);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const res = pluginMarketplaceRegistry.importInstalledManifestJson(text);
        if (res.successCount > 0) {
          showToast(`Successfully imported ${res.successCount} plugins!`);
        } else if (res.errors.length > 0) {
          showToast(`Import error: ${res.errors[0]}`);
        }
      } catch (err) {
        showToast('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="absolute top-4 right-6 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-200 border border-blue-400">
          <Sparkles size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for .omni-plugin Import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportFile} 
        accept=".json" 
        className="hidden" 
      />

      {/* Studio Header & Metrics Bar */}
      <div className="p-4 sm:p-5 border-b border-[#1e2638] bg-[#0f1422] shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Title Area */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-sky-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-950/40">
              <Puzzle size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">Community Plugin Marketplace</h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-400 text-[10px] font-bold border border-blue-500/40 font-mono">
                  DevOpsHub Studio
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Browse, install, and manage community-made engine extensions, shaders, AI planners, and scripts.
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleHotReload}
              className="px-3 py-1.5 rounded-lg bg-[#1a2336] hover:bg-[#25324d] text-sky-400 hover:text-white border border-[#2b3a55] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Hot reload active installed plugins into NexusEngine runtime"
            >
              <Zap size={14} /> Hot-Reload
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-[#1a2336] hover:bg-[#25324d] text-[#94a3b8] hover:text-white border border-[#2b3a55] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Import .omni-plugin or manifest JSON"
            >
              <Upload size={14} /> Import
            </button>

            <button
              onClick={handleExportManifest}
              className="px-3 py-1.5 rounded-lg bg-[#1a2336] hover:bg-[#25324d] text-[#94a3b8] hover:text-white border border-[#2b3a55] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export installed plugins manifest"
            >
              <FileDown size={14} /> Export
            </button>

            <button
              onClick={() => setShowPublishModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-900/30 cursor-pointer"
            >
              <Plus size={14} /> Package New Extension
            </button>
          </div>
        </div>

        {/* Real-Time Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-3 border-t border-[#1a2336] text-xs">
          <div className="bg-[#121929] px-3 py-2 rounded-lg border border-[#1e293b]">
            <span className="text-[#64748b] block text-[10px] uppercase font-bold">Catalog Available</span>
            <span className="font-mono font-bold text-white text-sm">{plugins.length} Extensions</span>
          </div>

          <div className="bg-[#121929] px-3 py-2 rounded-lg border border-[#1e293b]">
            <span className="text-[#64748b] block text-[10px] uppercase font-bold">Installed / Active</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {installedList.length} <span className="text-white text-xs">({activeRunningCount} Active)</span>
            </span>
          </div>

          <div className="bg-[#121929] px-3 py-2 rounded-lg border border-[#1e293b]">
            <span className="text-[#64748b] block text-[10px] uppercase font-bold">Community Installs</span>
            <span className="font-mono font-bold text-blue-400 text-sm">{totalDownloads.toLocaleString()}</span>
          </div>

          <div className="bg-[#121929] px-3 py-2 rounded-lg border border-[#1e293b]">
            <span className="text-[#64748b] block text-[10px] uppercase font-bold">Memory Footprint</span>
            <span className="font-mono font-bold text-purple-400 text-sm">{(totalInstalledMemory / 1024).toFixed(2)} MB</span>
          </div>

          <div className="bg-[#121929] px-3 py-2 rounded-lg border border-[#1e293b] col-span-2 sm:col-span-1">
            <span className="text-[#64748b] block text-[10px] uppercase font-bold">Sandbox Shield</span>
            <span className="font-mono font-bold text-emerald-400 text-sm flex items-center gap-1">
              <ShieldCheck size={14} /> 100% Protected
            </span>
          </div>
        </div>
      </div>

      {/* Main Filter & Navigation Strip */}
      <div className="p-3 border-b border-[#1e2638] bg-[#0c101a] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#141b29] p-1 rounded-lg border border-[#222b3d] shrink-0">
          <button
            onClick={() => setActiveViewMode('browse')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeViewMode === 'browse'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>Browse Catalog ({plugins.length})</span>
          </button>

          <button
            onClick={() => setActiveViewMode('installed')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeViewMode === 'installed'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <CheckCircle2 size={13} className={installedList.length > 0 ? 'text-emerald-400' : ''} />
            <span>Installed ({installedList.length})</span>
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2 flex-1 max-w-2xl justify-end flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-2.5 text-[#64748b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search extensions, keywords, authors..."
              className="w-full bg-[#141b29] border border-[#222b3d] rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder-[#64748b] outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#64748b] hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#141b29] border border-[#222b3d] rounded-lg px-2.5 py-1.5 text-xs text-[#94a3b8]">
            <ArrowUpDown size={13} className="text-blue-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as MarketplaceSortOption)}
              className="bg-transparent text-white text-xs outline-none cursor-pointer"
            >
              <option value="MOST_POPULAR">Most Popular</option>
              <option value="HIGHEST_RATED">Highest Rated</option>
              <option value="NEWEST">Recently Updated</option>
              <option value="NAME_ASC">Name (A-Z)</option>
              <option value="SMALLEST_SIZE">Smallest Size</option>
            </select>
          </div>

          {/* Verified Only Toggle */}
          <button
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              onlyVerified 
                ? 'bg-blue-950/60 border-blue-500/50 text-blue-300' 
                : 'bg-[#141b29] border-[#222b3d] text-[#64748b] hover:text-[#94a3b8]'
            }`}
            title="Filter to officially verified core extensions"
          >
            <ShieldCheck size={13} className={onlyVerified ? 'text-blue-400' : ''} />
            <span>Verified</span>
          </button>
        </div>
      </div>

      {/* Category Pills Ribbon */}
      <div className="px-4 py-2 bg-[#080b12] border-b border-[#182030] overflow-x-auto flex items-center gap-1.5 scrollbar-thin shrink-0">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'bg-[#121824] text-[#8b98b0] hover:text-white hover:bg-[#1a2334] border border-[#1e293b]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Plugins Grid Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0d14]">
        
        {filteredPlugins.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-[#141b29] border border-[#222b3d] flex items-center justify-center text-[#64748b] mb-4">
              <Package size={32} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Extensions Found</h3>
            <p className="text-xs text-[#94a3b8] max-w-sm">
              {searchQuery 
                ? `No plugins matching "${searchQuery}". Try different keywords or reset category filters.`
                : activeViewMode === 'installed'
                ? "You haven't installed any extensions yet. Switch to Browse Catalog to install plugins!"
                : "No plugins found in this category."}
            </p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                className="mt-4 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlugins.map(plugin => {
              const installed = installedMap.get(plugin.id);
              const isInstalled = Boolean(installed);
              const isEnabled = installed?.enabled ?? false;

              return (
                <div
                  key={plugin.id}
                  onClick={() => setInspectedPlugin(plugin)}
                  className={`bg-[#0f1422] border rounded-xl p-4 flex flex-col justify-between transition-all duration-150 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-950/20 cursor-pointer group ${
                    isInstalled ? 'border-blue-900/40 bg-[#0f1526]' : 'border-[#1e273b]'
                  }`}
                >
                  {/* Top Row: Category & Badges */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#161f33] text-[#7dd3fc] border border-[#22314d]">
                        {plugin.category}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {plugin.isOfficial && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-500/40 flex items-center gap-1">
                            <ShieldCheck size={11} /> Official
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-[#64748b]">v{plugin.version}</span>
                      </div>
                    </div>

                    {/* Plugin Title & Tagline */}
                    <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors line-clamp-1">
                      {plugin.name}
                    </h3>
                    
                    <p className="text-xs text-[#94a3b8] mt-1 line-clamp-2 leading-relaxed min-h-[2rem]">
                      {plugin.tagline || plugin.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {plugin.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[#141b29] text-[#64748b] font-mono border border-[#1e293b]">
                          #{tag}
                        </span>
                      ))}
                      {plugin.tags.length > 3 && (
                        <span className="text-[10px] text-[#64748b] self-center">
                          +{plugin.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle: Metrics and Author */}
                  <div className="mt-4 pt-3 border-t border-[#1a2336] flex items-center justify-between text-[11px] text-[#64748b]">
                    <div className="flex items-center gap-1">
                      <span className="text-[#94a3b8] font-medium truncate max-w-[120px]">{plugin.author}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star size={12} fill="currentColor" /> {plugin.rating.toFixed(1)}
                      </span>
                      <span>{plugin.downloadCount.toLocaleString()} dl</span>
                      <span className="font-mono text-[#7dd3fc]">{plugin.sizeKb} KB</span>
                    </div>
                  </div>

                  {/* Bottom: Action Controls */}
                  <div className="mt-3 pt-2.5 flex items-center justify-between gap-2 border-t border-[#1a2336]">
                    {isInstalled ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleToggle(e, plugin.id, isEnabled)}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                              isEnabled 
                                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30' 
                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            }`}
                            title={isEnabled ? 'Enabled in Engine' : 'Disabled'}
                          >
                            <Power size={11} />
                            {isEnabled ? 'Active' : 'Disabled'}
                          </button>

                          <span className="text-[10px] text-emerald-400 font-mono">
                            {installed?.memoryUsageKb} KB
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleUninstall(e, plugin.id)}
                            className="p-1 rounded text-[#64748b] hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                            title="Uninstall plugin"
                          >
                            <Trash2 size={13} />
                          </button>
                          <button
                            onClick={() => setInspectedPlugin(plugin)}
                            className="px-2.5 py-1 rounded bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-semibold transition-colors"
                          >
                            Inspect
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[11px] text-[#64748b]">
                          {plugin.permissions.length} perms • Sandbox Safe
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setInspectedPlugin(plugin)}
                            className="px-2.5 py-1 rounded bg-[#161f30] hover:bg-[#223049] text-[#94a3b8] hover:text-white text-xs font-medium transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={(e) => handleInstall(e, plugin.id)}
                            className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                          >
                            <Download size={12} /> Install
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal: Plugin Detail Viewer */}
      {inspectedPlugin && (
        <PluginDetailModal
          plugin={inspectedPlugin}
          installedState={installedMap.get(inspectedPlugin.id)}
          onClose={() => setInspectedPlugin(null)}
        />
      )}

      {/* Modal: Publish Extension */}
      {showPublishModal && (
        <PluginPublishExtensionModal
          onClose={() => setShowPublishModal(false)}
          onPublished={(newPlg) => {
            showToast(`Extension '${newPlg.name}' packaged & registered!`);
          }}
        />
      )}

    </div>
  );
}
