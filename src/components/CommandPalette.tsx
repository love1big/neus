/**
 * @file CommandPalette.tsx
 * @description
 * ============================================================================
 * [THAI]
 * คอมมานด์พาเล็ตต์รวมศูนย์ระดับสตูดิโอ (Studio Command Palette & Spotlight Search)
 * ค้นหาได้ทั้ง 335+ เครื่องมือย่อยในระบบ และไฟล์แอสเซท (Materials, Meshes, Textures, Shaders)
 * พร้อมระบบ 'Quick Recent' Persistent History ที่ดึงข้อมูลจาก RecentFilesTracker
 * แสดงประวัติการทำงาน 5 เซสชันล่าสุด ช่วยให้ผู้ใช้สามารถกดคีย์ลัด [1] - [5] เพื่อกระโดดกลับไปยัง
 * เซสชันก่อนหน้าได้ทันที รองรับการสลับแท็บด้วย Tab และกด Enter เพื่อเข้าสู่ระบบ
 * 
 * [ENGLISH]
 * Studio Command Palette & Spotlight Quick Switcher with Persistent Quick Recent Sessions.
 * Search across all 335+ system toolchains, sub-modules, and game assets.
 * Integrates directly with RecentFilesTracker to display a persistent 'Quick Recent'
 * list of the user's last 5 sessions, complete with instant numerical hotkeys ([1] - [5]),
 * pinning, reactive storage sync, and keyboard navigation.
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, Command, ArrowRight, File as FileIcon, Box, Image as ImageIcon, 
  Music, Palette, Layers, Cpu, Sparkles, Wrench, X, CornerDownLeft, Zap,
  Clock, RotateCcw, Pin, Trash2, Bookmark, Check
} from 'lucide-react';
import { RecentFilesTracker, RecentFileItem } from '../utils/RecentFilesTracker';
import CommandPaletteRecentSection from './CommandPaletteRecentSection';
import FloatingCommandHistoryLog from './FloatingCommandHistoryLog';
import { EngineCommandHistoryTracker } from '../utils/EngineCommandHistoryTracker';

interface Asset {
  id: string;
  name: string;
  type: 'mat' | 'tex' | 'skm' | 'wav' | 'bp' | 'fbx' | 'obj' | 'any' | 'meta';
  folderId: string;
}

const globalMockAssets: Asset[] = [
  { id: 'a1', name: 'M_Ruby_PBR_Master', type: 'mat', folderId: '4' },
  { id: 'a2', name: 'M_ChromeBase_Reflective', type: 'mat', folderId: '4' },
  { id: 'a3', name: 'M_PlasticWhite_Rough', type: 'mat', folderId: '4' },
  { id: 'a4', name: 'BP_PlayerCharacter_Controller', type: 'bp', folderId: '3' },
  { id: 'bp_agent', name: 'BP_AI_SwarmAgent_Tree', type: 'bp', folderId: '3' },
  { id: 'a5', name: 'T_PerlinNoise_NormalMap_4K', type: 'tex', folderId: '6' },
  { id: 'a6', name: 'SKM_HeroMesh_LOD0', type: 'skm', folderId: '3' },
  { id: 'a7', name: 'S_VocalSinging_Stem_48k', type: 'wav', folderId: '1' },
  { id: 'a8', name: 'SM_CyberBarrel_Destructible', type: 'obj', folderId: '5' },
  { id: 'a9', name: 'SK_DragonBoss_RiggedIK', type: 'fbx', folderId: '3' },
];

const getAssetIcon = (type: string) => {
  switch (type) {
    case 'mat': return <Palette size={15} className="text-[#a855f7]" />;
    case 'tex': return <ImageIcon size={15} className="text-[#38bdf8]" />;
    case 'wav': return <Music size={15} className="text-[#ec4899]" />;
    case 'obj':
    case 'fbx':
    case 'skm': return <Box size={15} className="text-[#10b981]" />;
    default: return <FileIcon size={15} className="text-[#8b949e]" />;
  }
};

interface Tool {
  id: string;
  title?: string;
  name?: string;
  icon: React.ReactElement<any>;
  activeColor?: string;
  category?: string;
}

interface CommandPaletteProps {
  tools: Tool[];
  onSelect: (id: string) => void;
}

export default function CommandPalette({ tools, onSelect }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<'recent' | 'tools' | 'assets'>('tools');
  const [recentItems, setRecentItems] = useState<RecentFileItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to reactive tracker updates from RecentFilesTracker
  useEffect(() => {
    const unsubscribe = RecentFilesTracker.subscribe((items) => {
      setRecentItems(items);
    });
    return () => unsubscribe();
  }, []);

  // Compute the 5 most recent sessions
  const last5Sessions = useMemo(() => {
    return recentItems.slice(0, 5);
  }, [recentItems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+K or Cmd+Shift+K or Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k' || (e.shiftKey && e.key.toLowerCase() === 'k'))) {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setQuery('');
        setSelectedIndex(0);
        // Default to tools or recent if user has recent sessions
        setMode('tools');
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allTools = tools.reduce((acc: Tool[], t) => {
    acc.push(t);
    if ((t as any).subTools) {
      acc.push(...(t as any).subTools.map((sub: any) => ({
        ...sub,
        category: t.category,
        activeColor: t.activeColor
      })));
    }
    return acc;
  }, []);

  const filteredTools = query
    ? allTools.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(query.toLowerCase())) ||
          (t.name && t.name.toLowerCase().includes(query.toLowerCase())) ||
          (t.id && t.id.toLowerCase().includes(query.toLowerCase())) ||
          (t.category && t.category.toLowerCase().includes(query.toLowerCase()))
      )
    : allTools;
    
  const filteredAssets = query
    ? globalMockAssets.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.id.toLowerCase().includes(query.toLowerCase()) ||
          a.type.toLowerCase().includes(query.toLowerCase())
      )
    : globalMockAssets;

  const filteredRecent = query
    ? recentItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.id.toLowerCase().includes(query.toLowerCase()) ||
          (item.category && item.category.toLowerCase().includes(query.toLowerCase())) ||
          (item.path && item.path.toLowerCase().includes(query.toLowerCase())) ||
          item.type.toLowerCase().includes(query.toLowerCase())
      )
    : recentItems;

  const getActiveListLength = () => {
    if (mode === 'recent') return filteredRecent.length;
    if (mode === 'tools') return filteredTools.length;
    return filteredAssets.length;
  };

  const activeListLength = getActiveListLength();

  const handleSelect = (id: string) => {
    const selectedTool = tools.find(t => t.id === id);
    const toolName = selectedTool?.name || selectedTool?.title || id;
    EngineCommandHistoryTracker.recordAction({
      title: `Switch Subsystem: ${toolName}`,
      description: `Activated ${toolName} (${id}) workspace perspective`,
      category: 'ENGINE_SUBSYSTEM',
      targetSubsystem: id,
      status: 'SUCCESS',
      author: 'COMMAND_PALETTE',
      toolId: id,
      reExecutable: true
    });
    onSelect(id);
    setIsOpen(false);
  };
  
  const handleAssetSelect = (id: string) => {
    const asset = globalMockAssets.find(a => a.id === id);
    const assetName = asset?.name || id;
    EngineCommandHistoryTracker.recordAction({
      title: `Open Asset: ${assetName}`,
      description: `Dispatched open-asset for [${asset?.type?.toUpperCase() || 'ASSET'}] to Content Browser`,
      category: 'ASSET_PIPELINE',
      targetSubsystem: 'ContentBrowser',
      status: 'SUCCESS',
      author: 'COMMAND_PALETTE',
      toolId: 'ContentBrowser',
      reExecutable: true,
      details: {
        affectedFile: assetName,
        diffSummary: `Type: ${asset?.type || 'asset'} • Folder: #${asset?.folderId || '1'}`,
        telemetryImpact: 'Texture/Mesh pipeline streamed to memory'
      }
    });
    onSelect("ContentBrowser"); 
    window.dispatchEvent(new CustomEvent('open-asset', { detail: id }));
    setIsOpen(false);
  };

  const handleSelectRecent = (item: RecentFileItem) => {
    RecentFilesTracker.openItem(item);
    const targetToolId = (item.type === 'asset' || item.type === 'mesh' || item.type === 'texture' || item.type === 'audio')
      ? (item.hubId || 'ContentBrowser')
      : item.id;
    EngineCommandHistoryTracker.recordAction({
      title: `Resume Session: ${item.name}`,
      description: `Restored workspace session for ${item.path || item.id}`,
      category: item.type === 'subtool' || item.type === 'component' ? 'ENGINE_SUBSYSTEM' : 'PROJECT_STATE',
      targetSubsystem: targetToolId,
      status: 'SUCCESS',
      author: 'COMMAND_PALETTE',
      toolId: targetToolId,
      reExecutable: true
    });
    onSelect(targetToolId);
    setIsOpen(false);
  };

  const handleTogglePin = (id: string) => {
    RecentFilesTracker.togglePin(id);
  };

  const handleRemoveRecent = (id: string) => {
    RecentFilesTracker.removeRecentItem(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 1-5 Numerical Quick Jump Hotkeys:
    // If input query is empty and user presses 1..5, OR if user holds Alt+1..5
    const isNumberKey = ['1', '2', '3', '4', '5'].includes(e.key);
    if ((!query && isNumberKey) || (e.altKey && isNumberKey)) {
      const targetIndex = parseInt(e.key, 10) - 1;
      if (last5Sessions[targetIndex]) {
        e.preventDefault();
        handleSelectRecent(last5Sessions[targetIndex]);
        return;
      }
    }

    if (activeListLength === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % activeListLength);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + activeListLength) % activeListLength);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (mode === 'recent' && filteredRecent[selectedIndex]) {
        handleSelectRecent(filteredRecent[selectedIndex]);
      } else if (mode === 'tools' && filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex].id);
      } else if (mode === 'assets' && filteredAssets[selectedIndex]) {
        handleAssetSelect(filteredAssets[selectedIndex].id);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setMode((m) => {
        if (m === 'tools') return 'recent';
        if (m === 'recent') return 'assets';
        return 'tools';
      });
      setSelectedIndex(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[5vh] sm:pt-[7vh] px-4 animate-in fade-in duration-150 overflow-y-auto custom-scrollbar pb-10">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Centered Column: Palette + Floating Command History Log */}
      <div className="relative w-full max-w-2xl flex flex-col gap-3 z-10">
        {/* Palette Container */}
        <div 
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
        >
        {/* Input Area */}
        <div className="flex items-center px-4.5 border-b border-[#21262d] bg-[#161b22]/95">
          <Search size={18} className="text-[#38bdf8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none outline-none text-white px-3.5 py-4 placeholder-[#8b949e] font-sans text-sm"
            placeholder={
              mode === 'recent'
                ? "Search recent sessions & files... (or press 1-5 to jump)"
                : mode === 'tools'
                ? "Search 335+ tools, neural models, editors... (Type to filter)"
                : "Search assets, meshes, materials, stems... (Press Tab to switch)"
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-[#8b949e] font-mono border border-[#30363d] rounded px-1.5 py-0.5 bg-[#0d1117]">
              Tab
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#8b949e] hover:text-white rounded-md hover:bg-[#21262d] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-[#21262d] bg-[#0d1117] px-2 pt-1 gap-1">
          {/* Recent Sessions Tab */}
          <button 
            onClick={() => { setMode('recent'); setSelectedIndex(0); }}
            className={`flex-1 py-2 text-xs font-bold tracking-wide rounded-t-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'recent' 
                ? 'text-[#f59e0b] border-b-2 border-[#f59e0b] bg-[#f59e0b]/10 shadow-sm' 
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <Zap size={13} className="text-[#f59e0b]" />
            <span>QUICK RECENT ({last5Sessions.length})</span>
          </button>

          {/* Engine Tools Tab */}
          <button 
            onClick={() => { setMode('tools'); setSelectedIndex(0); }}
            className={`flex-1 py-2 text-xs font-bold tracking-wide rounded-t-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'tools' 
                ? 'text-[#38bdf8] border-b-2 border-[#38bdf8] bg-[#38bdf8]/10 shadow-sm' 
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <Wrench size={13} />
            <span>TOOLS ({filteredTools.length})</span>
          </button>

          {/* Assets Tab */}
          <button 
            onClick={() => { setMode('assets'); setSelectedIndex(0); }}
            className={`flex-1 py-2 text-xs font-bold tracking-wide rounded-t-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'assets' 
                ? 'text-[#10b981] border-b-2 border-[#10b981] bg-[#10b981]/10 shadow-sm' 
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <Box size={13} />
            <span>ASSETS ({filteredAssets.length})</span>
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[52vh] overflow-y-auto custom-scrollbar p-2.5 space-y-1">
          {/* Mode: Quick Recent Sessions */}
          {mode === 'recent' && (
            <div className="space-y-2">
              <CommandPaletteRecentSection
                recentSessions={filteredRecent}
                selectedIndex={selectedIndex}
                onSelectSession={handleSelectRecent}
                onTogglePin={handleTogglePin}
                onRemove={handleRemoveRecent}
                isFocusedSection={true}
              />

              {/* History Management & Reset Action */}
              <div className="flex items-center justify-between pt-2 px-2 border-t border-[#21262d]/60 text-[10px] text-[#8b949e] font-mono">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  <span>Tracking up to 10 persistent sessions in localStorage</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => RecentFilesTracker.resetToDefaults()}
                    className="hover:text-[#58a6ff] transition-colors flex items-center gap-1"
                    title="Load sample project sessions"
                  >
                    <RotateCcw size={10} /> Reset Defaults
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => RecentFilesTracker.clearRecentItems()}
                    className="hover:text-[#f85149] transition-colors flex items-center gap-1"
                    title="Clear recent items history"
                  >
                    <Trash2 size={10} /> Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mode: Tools & Studios */}
          {mode === 'tools' && (
            <div>
              {/* Persistent Quick Recent shelf on top of tools view when query is empty */}
              {!query && last5Sessions.length > 0 && (
                <div className="mb-3 pb-2 border-b border-[#21262d]">
                  <CommandPaletteRecentSection
                    recentSessions={last5Sessions}
                    selectedIndex={-1}
                    onSelectSession={handleSelectRecent}
                    onTogglePin={handleTogglePin}
                    onRemove={handleRemoveRecent}
                    isFocusedSection={false}
                  />
                  <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-mono text-[#8b949e] uppercase font-semibold">
                    <span>All Engine Tools & Studios</span>
                    <span className="text-[10px] text-[#6e7681]">{filteredTools.length} total</span>
                  </div>
                </div>
              )}

              {filteredTools.length === 0 ? (
                <div className="py-12 text-center text-[#8b949e] text-xs">
                  No engine tools matching <span className="text-white">"{query}"</span>
                </div>
              ) : (
                filteredTools.map((tool, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={tool.id + '-' + idx}
                      onClick={() => handleSelect(tool.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
                        isSelected 
                          ? 'bg-[#1f6feb]/20 border border-[#38bdf8]/50 shadow-sm' 
                          : 'hover:bg-[#161b22] border border-transparent'
                      }`}
                    >
                      <div className={`p-2 rounded-lg bg-[#0d1117] border border-[#21262d] shrink-0 ${isSelected ? 'text-[#38bdf8] border-[#38bdf8]/40' : 'text-[#8b949e]'}`}>
                        {React.cloneElement(tool.icon, { size: 16 })}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                           <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#c9d1d9]'}`}>
                             {tool.title || tool.name || tool.id}
                           </span>
                           {tool.category && (
                             <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#21262d] text-[#8b949e] shrink-0">
                               {tool.category}
                             </span>
                           )}
                         </div>
                         <span className="text-[10px] text-[#8b949e] font-mono truncate block mt-0.5">
                           ID: {tool.id}
                         </span>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] text-[#38bdf8] font-mono shrink-0">
                          <span>Launch</span>
                          <CornerDownLeft size={12} />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* Mode: Assets & Prefabs */}
          {mode === 'assets' && (
            <div>
              {filteredAssets.length === 0 ? (
                <div className="py-12 text-center text-[#8b949e] text-xs">
                  No assets matching <span className="text-white">"{query}"</span>
                </div>
              ) : (
                filteredAssets.map((asset, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={asset.id}
                      onClick={() => handleAssetSelect(asset.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
                        isSelected 
                          ? 'bg-[#10b981]/20 border border-[#10b981]/50 shadow-sm' 
                          : 'hover:bg-[#161b22] border border-transparent'
                      }`}
                    >
                      <div className={`p-2 rounded-lg bg-[#0d1117] border border-[#21262d] shrink-0 ${isSelected ? 'border-[#10b981]/40' : ''}`}>
                        {getAssetIcon(asset.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                         <span className={`text-xs font-bold truncate block ${isSelected ? 'text-white' : 'text-[#c9d1d9]'}`}>
                           {asset.name}
                         </span>
                         <span className="text-[10px] text-[#8b949e] font-mono">
                           Type: {asset.type.toUpperCase()} • Folder #{asset.folderId}
                         </span>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] text-[#10b981] font-mono shrink-0">
                          <span>Open</span>
                          <CornerDownLeft size={12} />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#21262d] bg-[#07090e] text-[11px] text-[#8b949e]">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
             <span className="flex items-center gap-1 text-[#58a6ff]">
               <span className="border border-[#38bdf8]/40 rounded px-1.5 py-0.2 bg-[#38bdf8]/10 font-mono text-[9px] text-[#38bdf8] font-bold">1-5</span> jump recent
             </span>
             <span className="flex items-center gap-1">
               <span className="border border-[#30363d] rounded px-1 py-0.2 bg-[#161b22] font-mono text-[9px]">↑↓</span> navigate
             </span>
             <span className="flex items-center gap-1">
               <span className="border border-[#30363d] rounded px-1 py-0.2 bg-[#161b22] font-mono text-[9px]">↵</span> execute
             </span>
             <span className="flex items-center gap-1">
               <span className="border border-[#30363d] rounded px-1 py-0.2 bg-[#161b22] font-mono text-[9px]">Tab</span> switch
             </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] shrink-0 text-[#8b949e]">
             <Zap size={11} className="text-[#f59e0b]" />
             <span>Quick Recent v2</span>
          </div>
        </div>
      </div>

      {/* Floating 'Command History' log beneath the CommandPalette */}
      <FloatingCommandHistoryLog
        onSelectTool={onSelect}
        onClosePalette={() => setIsOpen(false)}
      />
    </div>
  </div>
);
}

