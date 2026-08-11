import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, ArrowRight, File as FileIcon, Box, Image as ImageIcon, Music, Palette } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'mat' | 'tex' | 'skm' | 'wav' | 'bp' | 'fbx' | 'obj' | 'any' | 'meta';
  folderId: string;
}

const globalMockAssets: Asset[] = [
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
];

const getAssetIcon = (type: string) => {
  switch (type) {
    case 'mat': return <Palette size={16} />;
    case 'tex': return <ImageIcon size={16} />;
    case 'wav': return <Music size={16} />;
    case 'obj':
    case 'fbx':
    case 'skm': return <Box size={16} />;
    default: return <FileIcon size={16} />;
  }
};

interface Tool {
  id: string;
  title?: string; name?: string;
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
      // Ctrl+Shift+K or Cmd+Shift+K
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
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
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.id.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase())
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
    // Just open content browser for now
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
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Palette Container */}
      <div 
        className="relative w-full max-w-2xl bg-[#18181b] border border-[#30363d] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
      >
        {/* Input Area */}
        <div className="flex items-center px-4 border-b border-[#30363d] bg-[#0d1117]">
          <Search size={20} className="text-[#8b949e]" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none outline-none text-white px-4 py-4 placeholder-[#8b949e] font-sans text-[14px]"
            placeholder={mode === 'tools' ? "Search tools, editors, environments... (Ctrl+Shift+K)" : "Search assets, materials, meshes... (Press Tab to switch)"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-1 text-[10px] text-[#8b949e] font-mono border border-[#30363d] rounded px-2 py-1 bg-[#21262d]">
            ESC
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#30363d] bg-[#161b22]">
          <button 
            onClick={() => { setMode('tools'); setSelectedIndex(0); }}
            className={`flex-1 py-2 text-[12px] font-bold tracking-wide transition-colors ${mode === 'tools' ? 'text-[#58a6ff] border-b-2 border-[#58a6ff] bg-[#1f6feb]/10' : 'text-[#8b949e] hover:text-white border-b-2 border-transparent hover:bg-[#21262d]'}`}
          >
            SYSTEM TOOLS
          </button>
          <button 
            onClick={() => { setMode('assets'); setSelectedIndex(0); }}
            className={`flex-1 py-2 text-[12px] font-bold tracking-wide transition-colors ${mode === 'assets' ? 'text-[#3fb950] border-b-2 border-[#3fb950] bg-[#2ea043]/10' : 'text-[#8b949e] hover:text-white border-b-2 border-transparent hover:bg-[#21262d]'}`}
          >
            QUICK ASSET SEARCH
          </button>
        </div>
        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {mode === 'tools' ? (
          filteredTools.length === 0 ? (
            <div className="py-8 text-center text-[#8b949e] text-[13px]">
              No tools matching "{query}"
            </div>
          ) : (
            <div className="py-2">
              {filteredTools.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleSelect(tool.id)}
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("preload-tool", { detail: tool.id }))}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                      isSelected ? 'bg-[#1f6feb]/20' : 'hover:bg-[#21262d]/50'
                    }`}
                  >
                    <div className={`p-1.5 rounded items-center justify-center ${isSelected ? tool.activeColor : 'text-[#8b949e]'}`}>
                      {React.cloneElement(tool.icon, { size: 18 })}
                    </div>
                    <div className="flex-1 flex flex-col">
                       <span className={`text-[13px] ${isSelected ? 'text-white' : 'text-[#c9d1d9]'}`}>
                         {tool.title}
                       </span>
                       <span className="text-[10px] text-[#8b949e] font-mono">
                         {tool.category} • {tool.id}
                       </span>
                    </div>
                    {isSelected && (
                      <ArrowRight size={16} className="text-[#58a6ff] mr-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )
        ) : (
          filteredAssets.length === 0 ? (
            <div className="py-8 text-center text-[#8b949e] text-[13px]">
              No assets matching "{query}"
            </div>
          ) : (
            <div className="py-2">
              {filteredAssets.map((asset, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={asset.id}
                    onClick={() => handleAssetSelect(asset.id)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                      isSelected ? 'bg-[#2ea043]/20' : 'hover:bg-[#21262d]/50'
                    }`}
                  >
                    <div className={`p-1.5 rounded items-center justify-center ${isSelected ? 'text-[#3fb950]' : 'text-[#8b949e]'}`}>
                      {getAssetIcon(asset.type)}
                    </div>
                    <div className="flex-1 flex flex-col">
                       <span className={`text-[13px] ${isSelected ? 'text-white' : 'text-[#c9d1d9]'}`}>
                         {asset.name}
                       </span>
                       <span className="text-[10px] text-[#8b949e] font-mono">
                         Asset Type: {asset.type.toUpperCase()} • {asset.id}
                       </span>
                    </div>
                    {isSelected && (
                      <ArrowRight size={16} className="text-[#3fb950] mr-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )
        )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#30363d] bg-[#0d1117] text-[10px] text-[#8b949e]">
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-1">
               <span className="border border-[#30363d] rounded px-1.5 py-0.5 bg-[#21262d]">↑↓</span> to navigate
             </span>
             <span className="flex items-center gap-1">
               <span className="border border-[#30363d] rounded px-1.5 py-0.5 bg-[#21262d]">↵</span> to select
             </span>
          </div>
          <div className="flex items-center gap-1 font-mono">
             <Command size={10} /> Omni Command Palette
          </div>
        </div>
      </div>
    </div>
  );
}
