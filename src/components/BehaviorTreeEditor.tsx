import React, { useState } from 'react';
import { Network, Play, Save, Settings, Search, Plus, Trash2, ArrowRight, CornerDownRight, PlayCircle, Clock, Zap, CircleDashed, Sparkles } from 'lucide-react';

export default function BehaviorTreeEditor() {
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#e3b341]/10 rounded text-[#e3b341]"><Network size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">AI Behavior Tree</h2>
              <p className="text-[10px] text-[#8b949e]">Visual AI Logic, Selectors, Sequences, and Decorators</p>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[11px] font-bold flex items-center gap-2 transition-colors text-[#3fb950]"><Play size={12}/> Simulate Agent</button>
            <button className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-[11px] font-bold flex items-center gap-2 transition-colors"><Save size={12}/> Compile Tree</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-48 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 text-[10px] font-bold text-[#8b949e] uppercase tracking-wider border-b border-[#30363d]">Composites</div>
           <div className="p-2 space-y-1">
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded text-[11px] flex gap-2 items-center"><ArrowRight size={12} className="text-[#58a6ff]"/> Sequence (AND)</button>
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded text-[11px] flex gap-2 items-center"><CornerDownRight size={12} className="text-[#e3b341]"/> Selector (OR)</button>
           </div>
           
           <div className="p-2 text-[10px] font-bold text-[#8b949e] uppercase tracking-wider border-b border-[#30363d] mt-2">Decorators</div>
           <div className="p-2 space-y-1">
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded text-[11px] flex gap-2 items-center"><CircleDashed size={12} className="text-[#bc8cff]"/> BlackBoard Check</button>
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded text-[11px] flex gap-2 items-center"><Clock size={12} className="text-[#bc8cff]"/> Cooldown</button>
           </div>

           <div className="p-2 text-[10px] font-bold text-[#8b949e] uppercase tracking-wider border-b border-[#30363d] mt-2">Tasks / Leafs</div>
           <div className="p-2 space-y-1 overflow-y-auto custom-scrollbar flex-1">
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] rounded text-[11px] flex gap-2 items-center"><PlayCircle size={12} className="text-[#3fb950]"/> Move To</button>
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] rounded text-[11px] flex gap-2 items-center"><PlayCircle size={12} className="text-[#3fb950]"/> Play Animation</button>
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] rounded text-[11px] flex gap-2 items-center"><PlayCircle size={12} className="text-[#3fb950]"/> Conditional Blend</button>
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] rounded text-[11px] flex gap-2 items-center"><PlayCircle size={12} className="text-[#3fb950]"/> Wait</button>
              <button className="w-full text-left px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-[#ff7b72] rounded text-[11px] flex gap-2 items-center"><Zap size={12} className="text-[#ff7b72]"/> Attack</button>
              
              <div className="mt-4 pt-2 border-t border-[#30363d]">
                <button className="w-full text-left px-2 py-1.5 bg-[#bc8cff]/10 border border-[#bc8cff]/30 hover:border-[#bc8cff] rounded text-[11px] flex gap-2 items-center text-[#bc8cff]"><Sparkles size={12}/> AI Generate</button>
                <button className="w-full text-left px-2 py-1.5 bg-[#d2a8ff]/10 border border-[#d2a8ff]/30 hover:border-[#d2a8ff] rounded text-[11px] flex gap-2 items-center text-[#d2a8ff] mt-2"><Network size={12}/> Ask AI Agent</button>
              </div>
           </div>
        </div>

        {/* Tree Graph Area (Mock) */}
        <div className="flex-1 bg-[#0d1117] relative overflow-hidden flex items-start justify-center pt-10" style={{ backgroundImage: 'linear-gradient(#161b22 1px, transparent 1px), linear-gradient(90deg, #161b22 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
           <div className="text-[#333] text-4xl font-bold tracking-widest uppercase rotate-[-10deg] opacity-20 pointer-events-none absolute top-1/2">Behavior Tree Active</div>
           
           {/* Mock Root Node */}
           <div className="flex flex-col items-center">
              <div className="bg-[#161b22] border-2 border-[#58a6ff] rounded-lg px-6 py-2 shadow-lg shadow-[#58a6ff]/20 z-10 font-bold text-white text-[12px] flex items-center gap-2">
                 <ArrowRight size={14} className="text-[#58a6ff]"/> Root (Sequence)
              </div>
              <div className="w-px h-8 bg-[#58a6ff]"></div>
              <div className="w-96 h-px bg-[#58a6ff]"></div>
              
              <div className="flex gap-16 pt-8 relative">
                 {/* Left Branch */}
                 <div className="flex flex-col items-center relative">
                    <div className="absolute -top-8 w-px h-8 bg-[#58a6ff]"></div>
                    <div className="bg-[#161b22] border border-[#bc8cff] rounded-lg px-4 py-2 shadow-lg z-10 font-bold text-white text-[11px] flex items-center gap-2 mb-2 relative">
                        <div className="absolute -top-2 -right-2 bg-[#bc8cff] text-black text-[8px] px-1 rounded-sm">Decorator</div>
                        <CircleDashed size={12} className="text-[#bc8cff]"/> Has Target?
                    </div>
                    <div className="w-px h-4 bg-[#e3b341]"></div>
                    <div className="bg-[#161b22] border-2 border-[#e3b341] rounded-lg px-4 py-2 shadow-lg z-10 font-bold text-white text-[11px] flex items-center gap-2">
                        <CornerDownRight size={14} className="text-[#e3b341]"/> Combat (Selector)
                    </div>
                 </div>

                 {/* Mid Branch (AI Generate Node) */}
                 <div className="flex flex-col items-center relative">
                    <div className="absolute -top-8 w-px h-8 bg-[#58a6ff]"></div>
                    <div className="bg-[#bc8cff]/10 border border-[#bc8cff]/50 rounded-lg shadow-lg z-10 w-48 relative overflow-hidden">
                       <div className="bg-[#bc8cff]/20 px-3 py-1 font-bold text-white text-[10px] flex items-center justify-between border-b border-[#bc8cff]/30">
                          <span className="flex items-center gap-1"><Sparkles size={10} className="text-[#bc8cff]"/> AI Generate</span>
                       </div>
                       <div className="p-2 flex flex-col gap-1">
                          <input type="text" placeholder="Prompt for sub-tree..." className="bg-[#0d1117] border border-[#bc8cff]/30 p-1 text-[9px] w-full text-white outline-none rounded focus:border-[#bc8cff] transition-colors" />
                          <button className="bg-[#bc8cff] hover:bg-[#d2a8ff] text-black text-[9px] font-bold py-1 rounded w-full mt-1 transition-colors">Generate Nodes</button>
                       </div>
                    </div>
                 </div>

                 {/* Right Branch */}
                 <div className="flex flex-col items-center relative">
                    <div className="absolute -top-8 w-px h-8 bg-[#58a6ff]"></div>
                    <div className="bg-[#1f6feb]/20 border border-[#58a6ff] rounded-lg px-4 py-2 shadow-lg z-10 font-bold text-[#c9d1d9] text-[11px] flex items-center gap-2">
                        <PlayCircle size={14} className="text-[#3fb950]"/> Patrol / Wander
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Properties Panel */}
        <div className="w-72 border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 border-b border-[#30363d] flex font-bold text-[11px] uppercase tracking-wider text-[#8b949e]">
              Node Settings: Has Target?
           </div>
           <div className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-[#8b949e]">Decorator Type</label>
                 <select className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px] outline-none text-white">
                    <option>Blackboard Condition</option>
                    <option>Cooldown</option>
                    <option>Force Success</option>
                 </select>
              </div>
              <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-bold text-[#8b949e]">Blackboard Key</label>
                 <select className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px] outline-none text-[#58a6ff] font-mono">
                    <option>TargetEnemy_Actor</option>
                    <option>LastKnownLocation_Vector</option>
                    <option>IsAlarmed_Bool</option>
                 </select>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                 <label className="text-[10px] font-bold text-[#8b949e]">Key Query</label>
                 <select className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px] outline-none text-white">
                    <option>Is Set</option>
                    <option>Is Not Set</option>
                 </select>
              </div>

              <div className="h-px bg-[#30363d] my-2"></div>
              
              <div className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 p-2 rounded">
                 <div className="text-[10px] font-bold text-[#bc8cff] mb-1 flex items-center gap-1"><Network size={10}/> LLM Agent Override</div>
                 <p className="text-[9px] text-[#c9d1d9] mb-2 leading-tight">Allow the internal ML/LLM agent to override this branch if dynamic decision making is enabled on the AI Actor.</p>
                 <label className="flex items-center gap-2 text-[10px] text-white">
                    <input type="checkbox" defaultChecked className="accent-[#bc8cff]" /> Enable LLM Hook
                 </label>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
