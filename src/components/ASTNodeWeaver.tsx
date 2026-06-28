import React from 'react';
import { Network, Component, FileCode2, Layers, Cpu, Play } from 'lucide-react';

export default function ASTNodeWeaver() {
  return (
    <div className="flex-1 flex w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans">
      <div className="w-80 bg-[#161b22] border-r border-[#30363d] flex flex-col">
        <div className="p-4 border-b border-[#30363d]">
           <h2 className="text-[#ff7b72] font-bold flex items-center gap-2"><Network size={18}/> AST Logic Weaver</h2>
           <p className="text-xs text-[#8b949e] mt-1">Directly manipulate Abstract Syntax Trees to weave logic flows visually.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
           <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b949e] mb-3">Syntax Nodes</h3>
           <div className="space-y-2">
              <div className="p-2 border border-[#30363d] bg-[#0d1117] rounded shadow cursor-grab"><Component size={14} className="inline mr-2 text-[#58a6ff]"/> VariableDeclaration</div>
              <div className="p-2 border border-[#30363d] bg-[#0d1117] rounded shadow cursor-grab"><Layers size={14} className="inline mr-2 text-[#e3b341]"/> ArrowFunctionExpr</div>
              <div className="p-2 border border-[#30363d] bg-[#0d1117] rounded shadow cursor-grab"><FileCode2 size={14} className="inline mr-2 text-[#3fb950]"/> IfStatement</div>
              <div className="p-2 border border-[#30363d] bg-[#0d1117] rounded shadow cursor-grab"><Cpu size={14} className="inline mr-2 text-[#bc8cff]"/> TryCatchBlock</div>
           </div>
        </div>
        <div className="p-4 border-t border-[#30363d]">
           <button className="w-full bg-[#238636] text-white py-2 rounded text-sm font-bold flex justify-center items-center gap-2 hover:bg-[#2ea043]"><Play size={16}/> Compile AST to Script</button>
        </div>
      </div>
      
      <div className="flex-1 bg-[#050505] relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(#161b22 1px, transparent 1px), linear-gradient(90deg, #161b22 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
         {/* Canvas Mockup */}
         <div className="absolute top-20 left-20 w-48 bg-[#161b22] border-2 border-[#58a6ff] rounded shadow-2xl p-3">
             <div className="font-bold text-xs text-[#58a6ff] mb-2 border-b border-[#30363d] pb-1">VariableDeclaration</div>
             <div className="text-[10px] text-white font-mono break-all">name: "EngineCore"</div>
             <div className="text-[10px] text-white font-mono break-all mt-1">type: "const"</div>
             <div className="w-3 h-3 bg-[#58a6ff] rounded-full absolute -right-2 top-1/2 transform -translate-y-1/2"></div>
         </div>
         
         <svg className="absolute inset-0 pointer-events-none w-full h-full"><path d="M 212 110 C 250 110, 300 220, 350 220" fill="none" stroke="#e3b341" strokeWidth="2"/></svg>
         
         <div className="absolute top-48 left-[350px] w-56 bg-[#161b22] border-2 border-[#e3b341] rounded shadow-2xl p-3">
             <div className="h-3 w-3 bg-[#e3b341] rounded-full absolute -left-2 top-1/2 transform -translate-y-1/2"></div>
             <div className="font-bold text-xs text-[#e3b341] mb-2 border-b border-[#30363d] pb-1">ArrowFunctionExpr</div>
             <div className="text-[10px] text-white font-mono mt-1 text-[#8b949e]">async () =&gt; &#123; ... &#125;</div>
         </div>
      </div>
    </div>
  );
}
