import React from 'react';
import { Type, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function RegexTesterPanel() {
  return (
    <div className="flex-1 flex flex-col bg-[#0a0c10] text-[#c9d1d9] font-sans p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4 text-[#e6edf3]"><Type size={24} className="text-[#3fb950]"/> RegEx Engine Tester</h1>
      <div className="bg-[#161b22] border border-[#30363d] rounded p-4 mb-4">
         <label className="text-xs text-[#8b949e] font-bold uppercase mb-2 block">Regular Expression</label>
         <div className="flex">
            <span className="bg-[#0d1117] border border-r-0 border-[#30363d] rounded-l px-3 py-2 text-[#8b949e] font-mono">/</span>
            <input type="text" defaultValue="^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$" className="flex-1 bg-[#0a0c10] border border-[#30363d] text-[#58a6ff] font-mono px-3 py-2 outline-none"/>
            <span className="bg-[#0d1117] border border-l-0 border-[#30363d] rounded-r px-3 py-2 text-[#8b949e] font-mono">/gm</span>
         </div>
      </div>
      
      <div className="bg-[#161b22] border border-[#30363d] rounded p-4 flex-1 flex flex-col">
         <label className="text-xs text-[#8b949e] font-bold uppercase mb-2 block">Test String</label>
         <textarea className="flex-1 bg-[#0a0c10] border border-[#30363d] rounded p-3 text-[#c9d1d9] font-mono outline-none resize-none" defaultValue="user@example.com
invalid-email@.com
test.user@domain.co.uk"></textarea>
         <div className="mt-4 pt-4 border-t border-[#30363d] flex items-center justify-between">
            <span className="flex items-center gap-2 text-[#3fb950] bg-[#3fb950]/10 px-3 py-1 rounded text-sm"><CheckCircle size={16}/> 2 Matches Found</span>
            <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] px-4 py-2 rounded font-bold text-xs flex items-center gap-2"><RefreshCw size={14}/> Re-Evaluate</button>
         </div>
      </div>
    </div>
  );
}
