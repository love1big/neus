import React from 'react';
import { Globe, Plus, Search, Check, AlertCircle, Download, Upload, Languages } from 'lucide-react';

export default function AdvancedLocalizationSystem() {
  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      {/* Top Header */}
      <div className="h-16 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-6 shrink-0">
         <div className="flex items-center gap-4">
            <Globe size={20} className="text-blue-400" />
            <div>
               <h1 className="font-bold text-white text-sm">Localization & i18n Manager</h1>
               <p className="text-[10px] text-gray-400">Project: Fantasy RPG Core</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="relative">
               <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
               <input type="text" placeholder="Search keys or translations..." className="bg-[#0a0a0f] border border-[#2a2b3d] rounded pl-8 pr-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none w-64"/>
            </div>
            <button className="p-1.5 bg-[#2a2b3d] hover:bg-[#30363d] rounded text-gray-300 border border-[#30363d]" title="Import CSV/PO"><Upload size={14}/></button>
            <button className="p-1.5 bg-[#2a2b3d] hover:bg-[#30363d] rounded text-gray-300 border border-[#30363d]" title="Export"><Download size={14}/></button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Sidebar: Languages */}
         <div className="w-56 border-r border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
            <div className="p-3 border-b border-[#2a2b3d] flex justify-between items-center">
               <span className="text-xs font-bold text-gray-400 uppercase">Target Languages</span>
               <button className="text-blue-400 hover:text-blue-300"><Plus size={14}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
               <div className="px-3 py-2 bg-[#2a2b3d] rounded border-l-2 border-blue-500 flex justify-between items-center cursor-pointer">
                  <span className="text-xs text-white font-medium">English (en-US)</span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 rounded">Base</span>
               </div>
               <div className="px-3 py-2 hover:bg-[#1a1b26] rounded flex justify-between items-center cursor-pointer text-gray-400">
                  <span className="text-xs">Japanese (ja-JP)</span>
                  <span className="text-[9px] text-green-400 flex items-center gap-1"><Check size={10}/> 100%</span>
               </div>
               <div className="px-3 py-2 hover:bg-[#1a1b26] rounded flex justify-between items-center cursor-pointer text-gray-400">
                  <span className="text-xs">French (fr-FR)</span>
                  <span className="text-[9px] text-amber-500 flex items-center gap-1"><AlertCircle size={10}/> 92%</span>
               </div>
               <div className="px-3 py-2 hover:bg-[#1a1b26] rounded flex justify-between items-center cursor-pointer text-gray-400">
                  <span className="text-xs">Thai (th-TH)</span>
                  <span className="text-[9px] text-red-400 flex items-center gap-1">45%</span>
               </div>
            </div>
         </div>

         {/* Main Translation Grid */}
         <div className="flex-1 flex flex-col bg-[#0d1117] relative">
            {/* Table Header */}
            <div className="h-10 border-b border-[#2a2b3d] bg-[#1a1b26] flex items-center shrink-0 sticky top-0 z-10 text-xs font-bold text-gray-400">
               <div className="w-1/3 px-4 border-r border-[#2a2b3d] h-full flex items-center">Translation Key ID</div>
               <div className="w-1/3 px-4 border-r border-[#2a2b3d] h-full flex items-center">English (Base)</div>
               <div className="w-1/3 px-4 h-full flex items-center justify-between">
                  Japanese (ja-JP)
                  <Languages size={14} className="text-gray-500"/>
               </div>
            </div>
            
            {/* Table Body */}
            <div className="flex-1 overflow-y-auto pb-10">
               {[
                  { key: 'ui.menu.start_game', en: 'Start Game', target: 'ゲームスタート', status: 'done' },
                  { key: 'ui.menu.options', en: 'Options', target: 'オプション', status: 'done' },
                  { key: 'ui.inventory.full', en: 'Inventory is full!', target: 'インベントリがいっぱいです！', status: 'done' },
                  { key: 'dialogue.npc_01.greet', en: 'Hello, traveler! What brings you here?', target: 'こんにちは、旅人さん！今日はどうしましたか？', status: 'done' },
                  { key: 'item.sword_of_light.desc', en: 'A legendary sword that glows with radiant energy.', target: '', status: 'missing' },
               ].map((row, i) => (
                  <div key={i} className="min-h-[48px] border-b border-[#2a2b3d] flex text-xs hover:bg-[#141525] group transition-colors">
                     <div className="w-1/3 px-4 py-3 border-r border-[#2a2b3d] flex items-center font-mono text-blue-300 break-all">
                        {row.key}
                     </div>
                     <div className="w-1/3 px-4 py-3 border-r border-[#2a2b3d] flex items-center text-gray-300">
                        {row.en}
                     </div>
                     <div className="w-1/3 p-2 flex items-center relative">
                        <textarea 
                           className={`w-full h-full min-h-[32px] bg-transparent border ${row.status === 'missing' ? 'border-amber-500/50 bg-amber-500/5 focus:border-amber-500' : 'border-transparent hover:border-[#2a2b3d] focus:border-blue-500 focus:bg-[#0a0a0f]'} rounded p-2 text-white resize-none outline-none overflow-hidden`}
                           defaultValue={row.target}
                           placeholder={row.status === 'missing' ? 'Missing translation...' : ''}
                        />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
