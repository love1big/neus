import React, { useState } from 'react';
import { Globe2, Languages, Save, RefreshCw, FileText, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

export default function ContextualLocalization() {
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#58a6ff]/20 border border-[#58a6ff]/50 rounded">
            <Globe2 className="text-[#58a6ff]" size={16} />
          </div>
          <div>
            <h1 className="font-bold text-sm">Lore-Aware Contextual Localization</h1>
            <p className="text-[10px] text-[#8b949e]">AI-Driven Translation with Narrative Consistency</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b] font-medium text-white">
             <RefreshCw size={14} /> Batch Translate Empty
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: String List */}
        <div className="w-1/3 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 z-10">
           <div className="p-2 border-b border-[#30363d] flex gap-2">
              <input type="text" placeholder="Search string key..." className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 text-xs text-white outline-none" />
           </div>
           <div className="flex-1 overflow-y-auto">
              <StringItem id="UI_MainMenu_Start" status="done" text="Start Game" active />
              <StringItem id="UI_MainMenu_Quit" status="done" text="Quit to Desktop" />
              <StringItem id="DIA_NPC01_001" status="warning" text="Hello there, traveler." />
              <StringItem id="DIA_NPC01_002" status="empty" text="Beware the woods at night." />
              <StringItem id="ITEM_Sword_01_Desc" status="empty" text="A rusty old sword found in a cave." />
           </div>
        </div>

        {/* Right: Translation Editor */}
        <div className="flex-1 bg-[#010409] flex flex-col relative overflow-hidden">
           
           <div className="p-4 border-b border-[#30363d] bg-[#161b22]">
              <div className="text-xs font-bold text-[#8b949e] mb-2 flex items-center gap-2"><FileText size={14} /> STRING DETAILS</div>
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <div className="text-lg font-bold text-white mb-1">UI_MainMenu_Start</div>
                    <div className="text-[10px] bg-[#30363d] px-2 py-0.5 rounded text-[#8b949e] inline-block">Context: Main Menu Button</div>
                 </div>
                 <div className="flex items-center gap-2 text-xs bg-[#0d1117] border border-[#30363d] px-2 py-1 rounded">
                    <span className="text-[#8b949e]">Target:</span> 
                    <span className="font-bold text-white">Thai (th-TH)</span>
                 </div>
              </div>
           </div>

           <div className="p-4 flex-1 flex flex-col gap-4">
              
              {/* Source Text */}
              <div className="flex flex-col">
                 <label className="text-xs font-bold text-[#8b949e] mb-1">Source Text (English)</label>
                 <div className="bg-[#161b22] border border-[#30363d] rounded p-3 text-sm text-[#c9d1d9] min-h-[80px]">
                    Start Game
                 </div>
              </div>

              {/* Translation Text */}
              <div className="flex flex-col flex-1">
                 <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-[#8b949e]">Target Translation (Thai)</label>
                    <button className="text-[10px] text-[#58a6ff] hover:underline flex items-center gap-1"><Languages size={10}/> Suggest with AI</button>
                 </div>
                 <textarea className="bg-[#0d1117] border border-[#58a6ff]/50 rounded p-3 text-sm text-white flex-1 resize-none outline-none focus:border-[#58a6ff]" defaultValue="เริ่มเกม"></textarea>
              </div>

              {/* Lore Context Panel */}
              <div className="h-32 bg-[#161b22] border border-[#30363d] rounded p-3 flex flex-col">
                 <div className="text-xs font-bold text-[#8b949e] mb-2 flex items-center gap-2"><MessageSquare size={14} /> LORE & CONTEXT AWARENESS (AI)</div>
                 <p className="text-[11px] text-[#8b949e] leading-relaxed">
                    AI Context Check: This is a standard UI button. Direct translation is appropriate. No special character lore or tone required.
                 </p>
              </div>

           </div>
           
           <div className="p-3 border-t border-[#30363d] bg-[#161b22] flex justify-end gap-2">
              <button className="px-4 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs hover:bg-[#30363d]">Revert</button>
              <button className="px-4 py-1.5 bg-[#3fb950] border border-[#2ea043] rounded text-xs font-bold text-white hover:bg-[#2c974b] flex items-center gap-2">
                 <Save size={14}/> Save Translation
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

function StringItem({ id, status, text, active }: { id: string, status: 'done'|'empty'|'warning', text: string, active?: boolean }) {
  return (
    <div className={`p-2 border-b border-[#30363d] cursor-pointer hover:bg-[#21262d] ${active ? 'bg-[#30363d]/50 border-l-2 border-l-[#58a6ff]' : ''}`}>
       <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-mono font-bold text-[#c9d1d9] truncate max-w-[150px]">{id}</div>
          {status === 'done' && <CheckCircle size={12} className="text-[#3fb950]" />}
          {status === 'empty' && <div className="w-3 h-3 rounded-full border border-[#8b949e]"></div>}
          {status === 'warning' && <AlertCircle size={12} className="text-[#d29922]" />}
       </div>
       <div className="text-[10px] text-[#8b949e] truncate">{text}</div>
    </div>
  )
}
