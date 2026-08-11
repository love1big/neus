import React, { useState, useEffect, useRef } from 'react';
import { Search, File as FileIcon, X, CornerDownLeft, History} from 'lucide-react';
import { IDEFile } from '../lib/project';
import { Message as ChatMessage } from './AIChat';

interface GlobalSearchPanelProps {
  files: IDEFile[];
  messages?: ChatMessage[];
  graphNodes?: { id: string, label: string, category: string, file: string }[];
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (fileId: string) => void;
  onSelectNode?: (nodeId: string) => void;
  onSelectMessage?: (messageIndex: number) => void;
}

export default function GlobalSearchPanel({ files, messages = [], graphNodes = [], isOpen, onClose, onSelectFile, onSelectNode, onSelectMessage }: GlobalSearchPanelProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ide_recent_queries');
    if (stored) {
      try {
        setRecentQueries(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const saveQuery = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const newQueries = [trimmed, ...recentQueries.filter(x => x !== trimmed)].slice(0, 5);
    setRecentQueries(newQueries);
    localStorage.setItem('ide_recent_queries', JSON.stringify(newQueries));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  type ResultItem = { type: 'file', line: number, text: string, fileId: string, fileName: string } | { type: 'message', index: number, role: string, text: string } | { type: 'node', id: string, label: string, category: string, file: string, text: string };

  const results: ResultItem[] = [];
  
  if (query.length > 0) {
    // Search Files
    files.forEach(file => {
      if (file.name.toLowerCase().includes(query.toLowerCase())) {
         results.push({ type: 'file', line: 0, text: `File: ${file.name}`, fileId: file.id, fileName: file.name });
      }
      if (query.length > 1) {
        const lines = file.content.split('\n');
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            results.push({ type: 'file', line: index + 1, text: line.trim(), fileId: file.id, fileName: file.name });
          }
        });
      }
    });

    // Search Graph Nodes
    graphNodes.forEach(node => {
      if (node.label.toLowerCase().includes(query.toLowerCase()) || node.category.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'node', ...node, text: `Location: ${node.file}` });
      }
    });

    // Search AI Chat Messages
    messages.forEach((msg, index) => {
      if (msg.content.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'message', index, role: msg.role, text: msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '') });
      }
    });
  }

  const handleKeyDownLocal = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 < 0 ? results.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      if (query.length > 0) {
        saveQuery(query);
      }
      if (results.length > 0 && results[selectedIndex]) {
        const item = results[selectedIndex];
        if (item.type === 'file') {
          onSelectFile(item.fileId);
        } else if (item.type === 'node' && onSelectNode) {
          onSelectNode(item.id);
        } else if (item.type === 'message' && onSelectMessage) {
          onSelectMessage(item.index);
        }
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex justify-center items-start pt-32">
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl w-[600px] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center p-3 border-b border-[#30363d] bg-[#0d1117]">
          <Search size={18} className="text-[#8b949e] mr-3" />
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDownLocal}
            placeholder="Search files, AI chat, graph nodes (Ctrl+F) ..." 
            className="bg-transparent border-none outline-none text-[#c9d1d9] text-[13px] w-full"
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-[#21262d] text-[#8b949e]"><X size={16} /></button>
        </div>
        
        {query.length === 0 && recentQueries.length > 0 && (
          <div className="p-3 bg-[#0d1117] border-b border-[#30363d]">
             <div className="flex items-center justify-between mb-2 px-1">
               <h4 className="text-[10px] uppercase font-bold text-[#8b949e] flex items-center gap-1"><History size={12} /> Recent Queries</h4>
               <button 
                 onClick={() => { setRecentQueries([]); localStorage.removeItem('ide_recent_queries'); }} 
                 className="text-[9px] text-[#8b949e] hover:text-[#f85149] uppercase font-bold"
               >
                  Clear
               </button>
             </div>
             <div className="flex flex-wrap gap-2">
                {recentQueries.map((q, i) => (
                  <button 
                     key={i}
                     onClick={() => { setQuery(q); setTimeout(() => inputRef.current?.focus(), 10); }}
                     className="text-[11px] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-2.5 py-1 rounded-full border border-[#30363d] transition-colors shadow-sm"
                  >
                     {q}
                  </button>
                ))}
             </div>
          </div>
        )}

        {query.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
            {results.length === 0 ? (
              <div className="text-center py-8 text-[#8b949e] text-[11px]">No results found.</div>
            ) : (
              <div className="flex flex-col gap-1">
                {results.map((res, i) => (
                  <div 
                    key={res.type === 'file' ? `${res.fileId}-${res.line}-${i}` : (res.type === 'node' ? `node-${res.id}-${i}` : `msg-${res.index}-${i}`)}
                    className={`flex items-start gap-3 p-2 rounded cursor-pointer ${i === selectedIndex ? 'bg-[#21262d] border-l-2 border-[#58a6ff]' : 'hover:bg-[#21262d] border-l-2 border-transparent'}`}
                    onClick={() => {
                       if (query.length > 0) {
                         saveQuery(query);
                       }
                       if (res.type === 'file') {
                         onSelectFile(res.fileId);
                       } else if (res.type === 'node' && onSelectNode) {
                         onSelectNode(res.id);
                       } else if (res.type === 'message' && onSelectMessage) {
                         onSelectMessage(res.index);
                       }
                       onClose();
                    }}
                  >
                    {res.type === 'file' && <FileIcon size={14} className="text-[#8b949e] mt-0.5 shrink-0" />}
                    {res.type === 'node' && <div className="text-[#bc8cff] mt-0.5 shrink-0 px-1 text-[10px] bg-[#bc8cff]/10 rounded border border-[#bc8cff]/20">Node</div>}
                    {res.type === 'message' && <div className={`mt-0.5 shrink-0 px-1 text-[10px] rounded border ${res.role === 'model' ? 'text-[#3fb950] bg-[#3fb950]/10 border-[#3fb950]/20' : 'text-[#8b949e] bg-[#21262d] border-[#30363d]'}`}>{res.role === 'model' ? 'AI' : 'You'}</div>}
                    <div className="flex flex-col overflow-hidden w-full">
                       <span className="text-[11px] font-bold text-[#c9d1d9] flex justify-between">
                         {res.type === 'file' && <>{res.fileName} <span className="text-[#8b949e] font-normal">{res.line > 0 ? `Line ${res.line}` : ''}</span></>}
                         {res.type === 'node' && <>{res.label} <span className="text-[#8b949e] font-normal">{res.category}</span></>}
                         {res.type === 'message' && <>Chat History <span className="text-[#8b949e] font-normal">Message #{res.index + 1}</span></>}
                       </span>
                       <span className="text-[11px] text-[#8b949e] truncate mt-0.5">{res.text}</span>
                    </div>
                    {i === selectedIndex && <CornerDownLeft size={12} className="text-[#8b949e] shrink-0 self-center" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Click outside detection */}
      <div className="absolute inset-0 z-[-1]" onClick={onClose}></div>
    </div>
  );
}
