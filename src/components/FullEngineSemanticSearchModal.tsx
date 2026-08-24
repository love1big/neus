import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, X, ArrowRight, CornerDownLeft, Sparkles, Box, FileText, Code2, Volume2,
  Zap, Clock, Trash2, ExternalLink, Copy, Check, Filter, Layers, LayoutDashboard,
  Shield, Brain, Cpu, Database, Map, Play, Flame, RefreshCw, Sun, ChevronRight
} from 'lucide-react';
import {
  searchFullEngine,
  SearchCategory,
  SemanticSearchResult,
  executeSearchResultAction,
  getRecentSearches,
  clearRecentSearches,
  getFullEngineIndex
} from '../utils/engineSemanticIndex';

interface FullEngineSemanticSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool?: (toolId: string) => void;
  initialQuery?: string;
}

export default function FullEngineSemanticSearchModal({
  isOpen,
  onClose,
  onSelectTool,
  initialQuery = ''
}: FullEngineSemanticSearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentList, setRecentList] = useState<SemanticSearchResult[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Sync initial query when opened
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      setRecentList(getRecentSearches());
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen, initialQuery]);

  // Compute Search Results
  const results = useMemo(() => {
    return searchFullEngine(query, category, 40);
  }, [query, category]);

  // Ensure selectedIndex is within bounds
  useEffect(() => {
    if (selectedIndex >= results.length) {
      setSelectedIndex(Math.max(0, results.length - 1));
    }
  }, [results.length, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (listContainerRef.current) {
      const activeEl = listContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Category counts for badges
  const categoryCounts = useMemo(() => {
    const all = getFullEngineIndex();
    return {
      all: all.length,
      tool: all.filter(i => i.category === 'tool').length,
      asset: all.filter(i => i.category === 'asset').length,
      file: all.filter(i => i.category === 'file').length,
      code: all.filter(i => i.category === 'code').length,
      audio: all.filter(i => i.category === 'audio').length,
      action: all.filter(i => i.category === 'action').length,
    };
  }, []);

  const handleSelect = (item: SemanticSearchResult) => {
    executeSearchResultAction(item, onSelectTool);
    setRecentList(getRecentSearches());
    onClose();
  };

  const handleCopyPath = (item: SemanticSearchResult, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = item.pathOrShortcut || item.id;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopiedId(item.id);
          setTimeout(() => setCopiedId(null), 2000);
        })
        .catch(() => {
          // Fallback if clipboard permission denied
          setCopiedId(item.id);
          setTimeout(() => setCopiedId(null), 2000);
        });
    } else {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const categories: { id: SearchCategory; label: string; icon: any; count: number }[] = [
    { id: 'all', label: 'All Indices', icon: <Sparkles size={13} />, count: categoryCounts.all },
    { id: 'tool', label: 'Tools & Studios', icon: <Box size={13} />, count: categoryCounts.tool },
    { id: 'asset', label: 'Assets & PBR', icon: <Layers size={13} />, count: categoryCounts.asset },
    { id: 'file', label: 'Project Files', icon: <FileText size={13} />, count: categoryCounts.file },
    { id: 'code', label: 'Shaders & Scripts', icon: <Code2 size={13} />, count: categoryCounts.code },
    { id: 'audio', label: 'Audio & DSP', icon: <Volume2 size={13} />, count: categoryCounts.audio },
    { id: 'action', label: 'Actions', icon: <Zap size={13} />, count: categoryCounts.action },
  ];

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentIndex = categories.findIndex(c => c.id === category);
      const nextIndex = e.shiftKey
        ? (currentIndex > 0 ? currentIndex - 1 : categories.length - 1)
        : (currentIndex < categories.length - 1 ? currentIndex + 1 : 0);
      setCategory(categories[nextIndex].id);
      setSelectedIndex(0);
    }
  };

  if (!isOpen) return null;

  const selectedItem = results[selectedIndex] || results[0];

  const renderIcon = (item: SemanticSearchResult) => {
    switch (item.category) {
      case 'tool':
        return <Box size={16} className="text-[#58a6ff]" />;
      case 'asset':
        return <Layers size={16} className="text-[#39d353]" />;
      case 'file':
        return <FileText size={16} className="text-[#e3b341]" />;
      case 'code':
        return <Code2 size={16} className="text-[#bc8cff]" />;
      case 'audio':
        return <Volume2 size={16} className="text-[#38bdf8]" />;
      case 'action':
        return <Zap size={16} className="text-[#ff7b72]" />;
      default:
        return <Sparkles size={16} className="text-[#58a6ff]" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[85vh] bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl flex flex-col overflow-hidden text-gray-200 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input Bar */}
        <div className="p-4 border-b border-[#21262d] bg-[#161b22] flex items-center gap-3 relative">
          <Search size={20} className="text-[#58a6ff] shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="ค้นหาเครื่องมือ, แอสเซ็ต 3D, เชดเดอร์, สคริปต์, เสียงเอฟเฟกต์, หรือซีน... (เช่น map, blade, pbr, audio, player, f5)"
            className="flex-1 bg-transparent text-white text-base font-medium outline-none placeholder:text-gray-500 border-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#30363d] transition-colors"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 bg-[#0d1117] px-2 py-1 rounded border border-[#30363d]">
            <kbd className="font-mono text-gray-300">ESC</kbd>
            <span>เพื่อปิด</span>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 py-2 border-b border-[#21262d] bg-[#0d1117] flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter size={11} /> ตัวกรอง:
          </span>
          {categories.map((cat) => {
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setSelectedIndex(0);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#1f6feb]/20 text-[#58a6ff] border-[#1f6feb]/60 shadow-[0_0_8px_rgba(31,111,235,0.2)]'
                    : 'bg-[#161b22] text-gray-400 border-[#30363d] hover:bg-[#21262d] hover:text-gray-200'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#1f6feb]/40 text-blue-200' : 'bg-[#21262d] text-gray-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area (Split View) */}
        <div className="flex-1 flex overflow-hidden min-h-[380px]">
          {/* Left Pane: Search Results List */}
          <div
            ref={listContainerRef}
            className="w-3/5 border-r border-[#21262d] overflow-y-auto divide-y divide-[#21262d]/50 bg-[#0d1117] p-2"
          >
            {/* Recent Searches Section when Query is Empty */}
            {!query && recentList.length > 0 && category === 'all' && (
              <div className="mb-3">
                <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <Clock size={12} /> ประวัติการค้นหาล่าสุด (Recent)
                  </span>
                  <button
                    onClick={() => {
                      clearRecentSearches();
                      setRecentList([]);
                    }}
                    className="text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors text-[10px]"
                  >
                    <Trash2 size={10} /> ล้างประวัติ
                  </button>
                </div>
                <div className="space-y-1">
                  {recentList.map((item, idx) => (
                    <div
                      key={`recent-${item.id}`}
                      onClick={() => handleSelect(item)}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#161b22]/70 hover:bg-[#21262d] border border-[#30363d]/50 cursor-pointer text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Clock size={13} className="text-purple-400 shrink-0" />
                        <span className="font-semibold text-gray-200 group-hover:text-white truncate">
                          {item.title}
                        </span>
                        {item.thaiTitle && (
                          <span className="text-[11px] text-gray-400 truncate">({item.thaiTitle})</span>
                        )}
                      </div>
                      <span className="text-[10px] text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10 shrink-0">
                        {item.badge || 'RECENT'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 px-3 py-1 text-[11px] font-bold text-gray-500 tracking-wider uppercase border-t border-[#21262d] pt-2">
                  ⚡ ดัชนีทั้งหมดในระบบ (All Engine Index)
                </div>
              </div>
            )}

            {results.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                <Search size={40} className="text-gray-600 mb-3 animate-bounce" />
                <p className="text-sm font-semibold text-gray-300">ไม่พบข้อมูลที่ตรงกับคำค้นหา "{query}"</p>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  ลองค้นหาด้วยคำอื่น เช่น: <code className="text-blue-400">map</code>, <code className="text-amber-400">audio</code>, <code className="text-green-400">model</code>, <code className="text-purple-400">shader</code>, <code className="text-red-400">physics</code>
                </p>
              </div>
            ) : (
              results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    data-index={idx}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 rounded-lg flex items-start gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1f6feb]/15 border border-[#1f6feb]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'hover:bg-[#161b22] border border-transparent'
                    }`}
                  >
                    <div
                      className="p-2 rounded-md shrink-0 mt-0.5 border"
                      style={{
                        backgroundColor: `${item.color}15`,
                        borderColor: `${item.color}35`,
                        color: item.color
                      }}
                    >
                      {renderIcon(item)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-100 truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span
                            className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold uppercase shrink-0 border"
                            style={{
                              backgroundColor: `${item.color}15`,
                              borderColor: `${item.color}40`,
                              color: item.color
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {item.thaiTitle && (
                        <div className="text-xs text-gray-400 font-medium truncate mt-0.5">
                          {item.thaiTitle}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 line-clamp-1 mt-1">
                        {item.thaiDescription || item.description}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-gray-400 bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d]">
                          {item.categoryLabel}
                        </span>
                        {item.pathOrShortcut && (
                          <span className="text-[10px] text-gray-500 font-mono truncate max-w-[200px]">
                            {item.pathOrShortcut}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center self-center text-gray-500">
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-[#58a6ff] text-xs font-semibold bg-[#1f6feb]/20 px-2 py-1 rounded border border-[#1f6feb]/40">
                          <span>Enter</span>
                          <CornerDownLeft size={12} />
                        </div>
                      ) : (
                        <ChevronRight size={16} className="text-gray-600" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Pane: Live Inspector & Preview Panel */}
          <div className="w-2/5 p-5 bg-[#161b22]/70 flex flex-col justify-between overflow-y-auto">
            {selectedItem ? (
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase"
                      style={{
                        backgroundColor: `${selectedItem.color}15`,
                        borderColor: `${selectedItem.color}40`,
                        color: selectedItem.color
                      }}
                    >
                      {selectedItem.badge || selectedItem.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{selectedItem.categoryLabel}</span>
                  </div>

                  <h3 className="text-base font-black text-white mt-1.5 leading-snug">
                    {selectedItem.title}
                  </h3>
                  {selectedItem.thaiTitle && (
                    <p className="text-xs text-gray-300 font-medium mt-0.5">
                      {selectedItem.thaiTitle}
                    </p>
                  )}
                </div>

                {/* Description Card */}
                <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2 text-xs">
                  <div className="text-gray-300 leading-relaxed">
                    {selectedItem.thaiDescription || selectedItem.description}
                  </div>
                  {selectedItem.thaiDescription && selectedItem.description && (
                    <div className="text-gray-500 text-[11px] border-t border-[#21262d] pt-2 italic">
                      "{selectedItem.description}"
                    </div>
                  )}
                </div>

                {/* Metadata & Specs */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-gray-400 text-[11px] uppercase tracking-wider">
                    ข้อมูลพารามิเตอร์ (Metadata)
                  </span>
                  <div className="bg-[#0d1117] rounded-lg border border-[#30363d] p-3 space-y-1.5 text-[11px] font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">ID / Target:</span>
                      <span className="text-blue-400 truncate max-w-[180px]">{selectedItem.targetToolId || selectedItem.id}</span>
                    </div>
                    {selectedItem.metadata?.fileSize && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">ขนาดไฟล์ (Size):</span>
                        <span className="text-emerald-400">{selectedItem.metadata.fileSize}</span>
                      </div>
                    )}
                    {selectedItem.metadata?.fileExtension && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">นามสกุล (Format):</span>
                        <span className="text-amber-400">{selectedItem.metadata.fileExtension}</span>
                      </div>
                    )}
                    {selectedItem.pathOrShortcut && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">เส้นทาง (Path):</span>
                        <span className="text-gray-300 truncate max-w-[160px]">{selectedItem.pathOrShortcut}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags & Keywords */}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div>
                    <span className="font-bold text-gray-400 text-[11px] uppercase tracking-wider block mb-1.5">
                      คีย์เวิร์ด & แท็ก
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.tags.slice(0, 10).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#0d1117] text-[10px] text-gray-400 border border-[#30363d]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-xs">
                เลือกรายการเพื่อดูรายละเอียด
              </div>
            )}

            {/* Bottom Actions */}
            {selectedItem && (
              <div className="pt-4 border-t border-[#21262d] space-y-2">
                <button
                  onClick={() => handleSelect(selectedItem)}
                  className="w-full py-2 px-3 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
                >
                  {selectedItem.actionType === 'play_sound' ? (
                    <>
                      <Volume2 size={14} />
                      <span>กดฟังเสียงเอฟเฟกต์ (Play Sound)</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink size={14} />
                      <span>วาร์ปไปยังโมดูลนี้ (Jump to Tool)</span>
                    </>
                  )}
                  <CornerDownLeft size={12} className="opacity-80" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleCopyPath(selectedItem, e)}
                    className="flex-1 py-1.5 px-3 rounded bg-[#21262d] hover:bg-[#30363d] text-gray-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#30363d] transition-colors"
                  >
                    {copiedId === selectedItem.id ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span className="text-emerald-400">คัดลอกแล้ว!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>คัดลอก Path / ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-4 py-2 bg-[#0d1117] border-t border-[#21262d] flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-gray-300 font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-gray-300 font-mono">↓</kbd>
              <span>เลื่อนดู</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-gray-300 font-mono">Enter</kbd>
              <span>เปิดใช้งาน</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-gray-300 font-mono">Tab</kbd>
              <span>เปลี่ยนหมวดหมู่</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[10px]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Semantic Indexing Active ({results.length} ผลลัพธ์)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
