import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Info, AlertOctagon} from 'lucide-react';

export type LogLevel = 'info' | 'warning' | 'error' | 'success';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  category?: string;
}

interface LogViewerProps {
  logs: LogEntry[];
  title?: string;
  showInputCommand?: boolean;
}

export default function LogViewer({ logs, title, showInputCommand }: LogViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | LogLevel>('all');

  const filteredLogs = logs.filter((log) => {
    // Level filtering
    if (levelFilter !== 'all' && log.level !== levelFilter) return false;

    // Keyword & Timestamp filtering via Search Input
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchMessage = log.message.toLowerCase().includes(q);
      const matchTimestamp = log.timestamp.toLowerCase().includes(q);
      const matchCategory = log.category?.toLowerCase().includes(q);
      if (!matchMessage && !matchTimestamp && !matchCategory) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col h-full w-full bg-[#151515]">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-3 py-1.5 border-b border-[#30363d] bg-[#0d1117] shrink-0">
        <div className="flex bg-[#050505] border border-[#30363d] rounded px-2 py-1 items-center gap-2 flex-3 max-w-[400px]">
          <Search size={12} className="text-[#8b949e]" />
          <input
            type="text"
            placeholder="Filter logs by keywords, level, or timestamp..."
            className="bg-transparent border-none outline-none text-[#fff] text-[10px] w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 border border-[#30363d] rounded bg-[#050505] p-0.5">
           <button 
             onClick={() => setLevelFilter('all')}
             className={`px-2 py-0.5 text-[10px] rounded ${levelFilter === 'all' ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-[#ccc]'}`}
           >
             All
           </button>
           <button 
             onClick={() => setLevelFilter('info')}
             className={`px-2 py-0.5 text-[10px] rounded flex items-center gap-1 ${levelFilter === 'info' ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-[#ccc]'}`}
           >
             <Info size={10} className="text-[#58a6ff]" /> Info
           </button>
           <button 
             onClick={() => setLevelFilter('warning')}
             className={`px-2 py-0.5 text-[10px] rounded flex items-center gap-1 ${levelFilter === 'warning' ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-[#ccc]'}`}
           >
             <AlertTriangle size={10} className="text-[#e3b341]" /> Warn
           </button>
           <button 
             onClick={() => setLevelFilter('error')}
             className={`px-2 py-0.5 text-[10px] rounded flex items-center gap-1 ${levelFilter === 'error' ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-[#ccc]'}`}
           >
             <AlertOctagon size={10} className="text-[#f85149]" /> Error
           </button>
        </div>
      </div>

      {/* Log Output */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] custom-scrollbar flex flex-col gap-1">
        {filteredLogs.length === 0 ? (
          <div className="text-[#8b949e] italic">No logs match the current filters.</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex gap-2 isolate hover:bg-[#21262d] px-1 -mx-1 rounded">
               <span className="text-[#8b949e] shrink-0">[{log.timestamp}]</span>
               {log.category && (
                 <span className={`${log.level === 'warning' ? 'text-[#e3b341]' : 'text-[#58a6ff]'} shrink-0`}>
                   [{log.category}]
                 </span>
               )}
               <span className={`break-words ${
                 log.level === 'error' ? 'text-[#f85149]' : 
                 log.level === 'warning' ? 'text-[#e3b341]' : 
                 log.level === 'success' ? 'text-[#3fb950]' : 
                 'text-[#ccc]'
               }`}>
                 {log.message}
               </span>
            </div>
          ))
        )}
        
        {showInputCommand && (
           <div className="mt-2 text-[#58a6ff] flex gap-2 items-center">
             &gt; <input type="text" className="bg-transparent border-none outline-none flex-1 font-mono text-[#fff]" placeholder="Execute command..." />
           </div>
        )}
      </div>
    </div>
  );
}
