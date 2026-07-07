import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, ArrowRight } from 'lucide-react';

interface Tool {
  id: string;
  title: string;
  icon: React.ReactElement<any>;
  activeColor: string;
  category: string;
}

interface CommandPaletteProps {
  tools: Tool[];
  onSelect: (id: string) => void;
}

export default function CommandPalette({ tools, onSelect }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+K or Cmd+Shift+K
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setQuery('');
        setSelectedIndex(0);
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

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredTools.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % filteredTools.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex].id);
      }
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
            placeholder="Search tools, editors, environments... (Ctrl+Shift+K)"
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

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {filteredTools.length === 0 ? (
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
