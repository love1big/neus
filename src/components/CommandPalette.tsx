/**
 * @file CommandPalette.tsx
 * @description
 * ============================================================================
 * [THAI]
 * คอมมานด์พาเล็ตต์รวมศูนย์ระดับสตูดิโอ (Studio Command Palette & Spotlight Search)
 * ค้นหาได้ทั้ง 335+ เครื่องมือย่อยในระบบ และไฟล์แอสเซท (Materials, Meshes, Textures, Shaders)
 * รองรับการเลื่อนลูกศรขึ้น/ลง, สลับแท็บด้วย Tab, และกด Enter เพื่อเปิดทันที
 * 
 * [ENGLISH]
 * Studio Command Palette & Spotlight Quick Switcher.
 * Search across all 335+ system toolchains, sub-modules, and game assets.
 * Supports keyboard navigation (Up/Down, Tab to toggle mode, Enter to execute).
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Command, ArrowRight, File as FileIcon, Box, Image as ImageIcon, 
  Music, Palette, Layers, Cpu, Sparkles, Wrench, X, CornerDownLeft
} from 'lucide-react';

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
  const [mode, setMode] = useState<'tools' | 'assets'>('tools');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+K or Cmd+Shift+K or Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k' || (e.shiftKey && e.key.toLowerCase() === 'k'))) {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setQuery('');
        setSelectedIndex(0);
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
    
  const activeListLength = mode === 'tools' ? filteredTools.length : filteredAssets.length;

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };
  
  const handleAssetSelect = (id: string) => {
    onSelect("ContentBrowser"); 
    window.dispatchEvent(new CustomEvent('open-asset', { detail: id }));
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeListLength === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % activeListLength);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + activeListLength) % activeListLength);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (mode === 'tools' && filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex].id);
      } else if (mode === 'assets' && filteredAssets[selectedIndex]) {
        handleAssetSelect(filteredAssets[selectedIndex].id);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setMode(m => m === 'tools' ? 'assets' : 'tools');
      setSelectedIndex(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Palette Container */}
      <div 
        className="relative w-full max-w-2xl bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col z-10"
      >
        {/* Input Area */}
        <div className="flex items-center px-4.5 border-b border-[#21262d] bg-[#161b22]/90">
          <Search size={18} className="text-[#38bdf8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none outline-none text-white px-3.5 py-4 placeholder-[#8b949e] font-sans text-sm"
            placeholder={mode === 'tools' ? "Search 335+ tools, neural models, editors... (Type to filter)" : "Search assets, meshes, materials, stems... (Press Tab to switch)"}
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
              className="p-1 text-[#8b949e] hover:text-white rounded-md hover:bg-[#21262d]"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-[#21262d] bg-[#0d1117] px-2 pt-1 gap-1">
          <button 
            onClick={() => { setMode('tools'); setSelectedIndex(0); }}
            className={`flex-1 py-2 text-xs font-bold tracking-wide rounded-t-lg transition-all flex items-center justify-center gap-2 ${
              mode === 'tools' 
                ? 'text-[#38bdf8] border-b-2 border-[#38bdf8] bg-[#38bdf8]/10' 
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <Wrench size={13} />
            <span>ENGINE TOOLS & STUDIOS ({filteredTools.length})</span>
          </button>
          <button 
            onClick={() => { setMode('assets'); setSelectedIndex(0); }}
            className={`flex-1 py-2 text-xs font-bold tracking-wide rounded-t-lg transition-all flex items-center justify-center gap-2 ${
              mode === 'assets' 
                ? 'text-[#10b981] border-b-2 border-[#10b981] bg-[#10b981]/10' 
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <Box size={13} />
            <span>ASSETS & PREFABS ({filteredAssets.length})</span>
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-2 space-y-1">
          {mode === 'tools' ? (
            filteredTools.length === 0 ? (
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
            )
          ) : (
            filteredAssets.length === 0 ? (
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
            )
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#21262d] bg-[#07090e] text-[11px] text-[#8b949e]">
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-1">
               <span className="border border-[#30363d] rounded px-1 py-0.2 bg-[#161b22] font-mono text-[9px]">↑↓</span> navigate
             </span>
             <span className="flex items-center gap-1">
               <span className="border border-[#30363d] rounded px-1 py-0.2 bg-[#161b22] font-mono text-[9px]">↵</span> execute
             </span>
             <span className="flex items-center gap-1">
               <span className="border border-[#30363d] rounded px-1 py-0.2 bg-[#161b22] font-mono text-[9px]">Tab</span> switch mode
             </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px]">
             <Command size={11} className="text-[#38bdf8]" /> Omni Spotlight v5
          </div>
        </div>
      </div>
    </div>
  );
}
