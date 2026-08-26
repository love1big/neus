/**
 * @file RecentFilesSidebarPanel.tsx
 * @description
 * ============================================================================
 * [THAI]
 * คอมโพเนนต์แถบเมนูประวัติการเปิดไฟล์และแอสเซทล่าสุด (Recent Files & Assets Sidebar Panel)
 * แสดงรายการ 10 ไฟล์/แอสเซทล่าสุดที่บันทึกใน localStorage, รองรับการค้นหา (Search),
 * กรองตามประเภท (Filter Type: Components, Assets, Code, Blueprints), ปักหมุด (Pin),
 * คัดลอก Path, และเปิดเข้าสู่ระบบนั้นๆ ได้ทันทีด้วยคลิกเดียว
 * 
 * [ENGLISH]
 * High-fidelity Recent Files & Assets Sidebar Panel for UnifiedHubWorkspace.
 * Renders the persistent last 10 opened components, assets, textures, models, and scripts.
 * Supports interactive filtering, path copying, pinning, fast-search, quick-launch,
 * and history clearance controls.
 * ============================================================================
 * 
 * 1. MODULE RESPONSIBILITY & PURPOSE:
 *    - Visual representation of RecentFilesTracker state within the Workspace sidebar.
 *    - Provides fast context-switching between recently touched game systems.
 * 
 * 2. ARCHITECTURE & SYSTEM INTEGRATION:
 *    - Integrates directly with: RecentFilesTracker.ts, UnifiedHubWorkspace.tsx.
 *    - Dispatches navigation events via onSelectTool or RecentFilesTracker.openItem.
 * 
 * 3. DATA CONTRACTS:
 *    - Props:
 *        - onSelectTool?: (toolId: string) => void
 *        - currentActiveId?: string
 *        - compact?: boolean
 * 
 * 4. ERROR HANDLING & FALLBACKS:
 *    - Renders an informative empty state with a "Restore Defaults" action if history is cleared.
 * 
 * 5. USAGE EXAMPLE:
 *    ```tsx
 *    import RecentFilesSidebarPanel from './RecentFilesSidebarPanel';
 *    
 *    <RecentFilesSidebarPanel onSelectTool={(id) => setActiveTab(id)} />
 *    ```
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Pin,
  Trash2,
  Search,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Code2,
  Box,
  Image,
  Layers,
  FileCode,
  Music,
  Mountain,
  Zap,
  FolderTree,
  X,
  FileText,
  Bookmark
} from 'lucide-react';
import {
  RecentFilesTracker,
  RecentFileItem,
  RecentItemType
} from '../utils/RecentFilesTracker';

interface RecentFilesSidebarPanelProps {
  onSelectTool?: (toolId: string) => void;
  currentActiveId?: string;
  compact?: boolean;
}

export default function RecentFilesSidebarPanel({
  onSelectTool,
  currentActiveId,
  compact = false
}: RecentFilesSidebarPanelProps) {
  const [recentItems, setRecentItems] = useState<RecentFileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'component' | 'asset' | 'code' | 'pinned'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Subscribe to reactive tracker updates
  useEffect(() => {
    const unsubscribe = RecentFilesTracker.subscribe((items) => {
      setRecentItems(items);
    });
    return () => unsubscribe();
  }, []);

  // Filtered and searched items
  const filteredItems = useMemo(() => {
    return recentItems.filter((item) => {
      // Type filtering
      if (activeFilter === 'pinned' && !item.pinned) return false;
      if (activeFilter === 'component' && item.type !== 'component' && item.type !== 'subtool') return false;
      if (activeFilter === 'asset' && item.type !== 'asset' && item.type !== 'texture' && item.type !== 'mesh' && item.type !== 'audio' && item.type !== 'level') return false;
      if (activeFilter === 'code' && item.type !== 'code' && item.type !== 'blueprint' && item.type !== 'shader') return false;

      // Query filtering
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesPath = item.path?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        return matchesName || matchesPath || matchesCategory || matchesDesc;
      }

      return true;
    });
  }, [recentItems, activeFilter, searchQuery]);

  const handleOpenItem = (item: RecentFileItem) => {
    RecentFilesTracker.openItem(item);
    if (onSelectTool) {
      onSelectTool(item.id);
    }
  };

  const handleTogglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    RecentFilesTracker.togglePin(id);
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    RecentFilesTracker.removeRecentItem(id);
  };

  const handleCopyPath = (e: React.MouseEvent, path?: string, id?: string) => {
    e.stopPropagation();
    if (!path) return;
    navigator.clipboard.writeText(path);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all recent files history?')) {
      RecentFilesTracker.clearRecentItems();
    }
  };

  const handleResetDefaults = () => {
    RecentFilesTracker.resetToDefaults();
  };

  const getItemIcon = (type: RecentItemType) => {
    switch (type) {
      case 'code':
        return <Code2 size={13} className="text-[#58a6ff]" />;
      case 'blueprint':
        return <Zap size={13} className="text-[#e3b341]" />;
      case 'mesh':
        return <Box size={13} className="text-[#bc8cff]" />;
      case 'texture':
        return <Image size={13} className="text-[#ff9800]" />;
      case 'audio':
        return <Music size={13} className="text-[#4caf50]" />;
      case 'level':
        return <Mountain size={13} className="text-[#79c0ff]" />;
      case 'shader':
        return <Layers size={13} className="text-[#f778ba]" />;
      case 'component':
      case 'subtool':
      default:
        return <FolderTree size={13} className="text-[#a5d6ff]" />;
    }
  };

  const getItemTypeBadge = (type: RecentItemType) => {
    switch (type) {
      case 'code':
        return <span className="text-[9px] px-1.5 py-0.2 bg-[#58a6ff]/20 text-[#58a6ff] rounded font-mono font-bold">CODE</span>;
      case 'blueprint':
        return <span className="text-[9px] px-1.5 py-0.2 bg-[#e3b341]/20 text-[#e3b341] rounded font-mono font-bold">BP</span>;
      case 'mesh':
        return <span className="text-[9px] px-1.5 py-0.2 bg-[#bc8cff]/20 text-[#bc8cff] rounded font-mono font-bold">3D</span>;
      case 'texture':
        return <span className="text-[9px] px-1.5 py-0.2 bg-[#ff9800]/20 text-[#ff9800] rounded font-mono font-bold">TEX</span>;
      case 'audio':
        return <span className="text-[9px] px-1.5 py-0.2 bg-[#4caf50]/20 text-[#4caf50] rounded font-mono font-bold">AUDIO</span>;
      case 'level':
        return <span className="text-[9px] px-1.5 py-0.2 bg-[#79c0ff]/20 text-[#79c0ff] rounded font-mono font-bold">MAP</span>;
      default:
        return <span className="text-[9px] px-1.5 py-0.2 bg-[#30363d] text-[#8b949e] rounded font-mono font-bold">TOOL</span>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] font-sans border-r border-[#30363d] select-none overflow-hidden">
      {/* Top Header */}
      <div className="p-3 border-b border-[#30363d] shrink-0 bg-[#161b22]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1f6feb]/20 flex items-center justify-center text-[#58a6ff]">
              <Clock size={14} />
            </div>
            <div>
              <span className="font-bold text-xs text-white tracking-wide flex items-center gap-1.5">
                Recent Files & Assets
              </span>
              <span className="text-[10px] text-[#8b949e] block font-mono">
                {recentItems.length}/10 stored in localStorage
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleResetDefaults}
              className="p-1 text-[#8b949e] hover:text-[#58a6ff] rounded hover:bg-[#21262d] transition-colors"
              title="Reset to preset samples"
            >
              <RotateCcw size={12} />
            </button>
            <button
              onClick={handleClearAll}
              className="p-1 text-[#8b949e] hover:text-[#f85149] rounded hover:bg-[#21262d] transition-colors"
              title="Clear all recent history"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-2">
          <Search size={12} className="absolute left-2.5 top-2.5 text-[#8b949e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recent files or assets..."
            className="w-full bg-[#0d1117] border border-[#30363d] rounded text-xs pl-8 pr-7 py-1.5 text-white placeholder-[#8b949e] outline-none focus:border-[#58a6ff] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-[#8b949e] hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-0.5 custom-scrollbar text-[10px] font-bold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#1f6feb] text-white'
                : 'bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            All ({recentItems.length})
          </button>
          <button
            onClick={() => setActiveFilter('component')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              activeFilter === 'component'
                ? 'bg-[#1f6feb] text-white'
                : 'bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            Components
          </button>
          <button
            onClick={() => setActiveFilter('asset')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              activeFilter === 'asset'
                ? 'bg-[#1f6feb] text-white'
                : 'bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            Assets
          </button>
          <button
            onClick={() => setActiveFilter('code')}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              activeFilter === 'code'
                ? 'bg-[#1f6feb] text-white'
                : 'bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            Code/BP
          </button>
          <button
            onClick={() => setActiveFilter('pinned')}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 whitespace-nowrap ${
              activeFilter === 'pinned'
                ? 'bg-[#1f6feb] text-white'
                : 'bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <Bookmark size={10} /> Pinned ({recentItems.filter((i) => i.pinned).length})
          </button>
        </div>
      </div>

      {/* Recent Files List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8b949e]">
            <Clock size={32} className="text-[#30363d] mb-2" />
            <p className="font-bold text-xs text-white">No Recent Files Found</p>
            <p className="text-[11px] mt-1">
              {searchQuery ? 'No files match your query' : 'Open tools or assets to populate your history'}
            </p>
            <button
              onClick={handleResetDefaults}
              className="mt-3 px-3 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
            >
              <Sparkles size={12} /> Populate Preset History
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isActive = currentActiveId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item)}
                className={`group relative p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col gap-1 ${
                  isActive
                    ? 'bg-[#1f6feb]/15 border-[#58a6ff] shadow-sm'
                    : item.pinned
                    ? 'bg-[#161b22] border-[#30363d] hover:border-[#58a6ff]/60'
                    : 'bg-[#10141d] border-[#21262d] hover:border-[#30363d] hover:bg-[#161b22]'
                }`}
              >
                {/* Header Row: Type Icon, Name, Badge, Actions */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="shrink-0">{getItemIcon(item.type)}</div>
                    <span className="font-bold text-xs text-[#e6edf3] group-hover:text-[#58a6ff] truncate transition-colors">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {getItemTypeBadge(item.type)}
                    <button
                      onClick={(e) => handleTogglePin(e, item.id)}
                      className={`p-1 rounded transition-colors ${
                        item.pinned
                          ? 'text-[#e3b341] hover:text-[#f85149]'
                          : 'text-[#8b949e] opacity-0 group-hover:opacity-100 hover:text-[#e3b341]'
                      }`}
                      title={item.pinned ? 'Unpin item' : 'Pin to top'}
                    >
                      <Pin size={11} className={item.pinned ? 'fill-[#e3b341]' : ''} />
                    </button>
                    <button
                      onClick={(e) => handleRemove(e, item.id)}
                      className="p-1 text-[#8b949e] opacity-0 group-hover:opacity-100 hover:text-[#f85149] rounded transition-all"
                      title="Remove from recent list"
                    >
                      <X size={11} />
                    </button>
                  </div>
                </div>

                {/* Subtitle / Path / Description */}
                {item.description && (
                  <p className="text-[10px] text-[#8b949e] line-clamp-1">
                    {item.description}
                  </p>
                )}

                {/* Footer Row: Path & Timestamp */}
                <div className="flex items-center justify-between text-[9px] text-[#8b949e] mt-0.5 font-mono">
                  <div 
                    onClick={(e) => handleCopyPath(e, item.path, item.id)}
                    className="flex items-center gap-1 truncate max-w-[70%] hover:text-[#58a6ff] cursor-pointer"
                    title={`Click to copy path: ${item.path}`}
                  >
                    {copiedId === item.id ? (
                      <Check size={10} className="text-[#3fb950] shrink-0" />
                    ) : (
                      <Copy size={10} className="shrink-0" />
                    )}
                    <span className="truncate">{item.path || item.id}</span>
                  </div>
                  <span className="shrink-0 text-[#8b949e]">
                    {RecentFilesTracker.formatTimeAgo(item.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info bar */}
      <div className="p-2 border-t border-[#30363d] bg-[#161b22] text-[10px] text-[#8b949e] flex items-center justify-between font-mono shrink-0">
        <span className="flex items-center gap-1 text-[#58a6ff]">
          <Sparkles size={11} /> Auto-Sync Active
        </span>
        <span>Max: 10 items</span>
      </div>
    </div>
  );
}
