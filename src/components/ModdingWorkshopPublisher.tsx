import React, { useState } from 'react';
import { DownloadCloud, UploadCloud, Link as LinkIcon, Share2, Star, ThumbsUp, MessageSquare, Heart, ShieldCheck, Box, User, Image as ImageIcon, Flame, TrendingUp, Settings2 } from 'lucide-react';

export default function ModdingWorkshopPublisher() {
  const [activeTab, setActiveTab] = useState('browser');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-[#c9d1d9] font-sans">
      
      {/* Top Protocol Bar: Publisher / Mod Portal */}
      <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between shadow-md shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-gradient-to-r from-[#bc8cff] to-[#58a6ff] text-white">
            <Share2 size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
              Modding Workshop & Asset Publisher Server
            </h2>
            <p className="text-[#8b949e] text-[9px] font-mono">UGC PLATFORM • VERSION CONTROL • PACKAGING ENGINE</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#0d1117] border border-[#30363d] rounded p-1 px-2 shadow-inner font-bold text-xs">
           <button onClick={() => setActiveTab('browser')} className={`px-4 py-1.5 rounded transition ${activeTab === 'browser' ? 'bg-[#21262d] text-white shadow' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}>Discover Mods</button>
           <button onClick={() => setActiveTab('publish')} className={`px-4 py-1.5 rounded transition ${activeTab === 'publish' ? 'bg-[#58a6ff] text-black shadow' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}>My Published Items</button>
           <button onClick={() => setActiveTab('package')} className={`px-4 py-1.5 rounded transition flex items-center gap-2 ${activeTab === 'package' ? 'bg-[#f85149] text-white shadow' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><UploadCloud size={14}/> Package New Mod</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Left Side Filter / Categories */}
         <div className="w-[240px] bg-[#0d1117] border-r border-[#30363d] flex flex-col shrink-0">
             <div className="p-4 border-b border-[#30363d]">
                <input type="text" placeholder="Search Workshop..." className="w-full bg-[#161b22] border border-[#30363d] rounded p-2 text-white text-[12px] outline-none focus:border-[#58a6ff] transition" />
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-[11px] font-bold">
                <div className="space-y-2">
                   <h3 className="text-[#8b949e] uppercase tracking-widest">Sort By</h3>
                   <ul className="space-y-1 text-[#c9d1d9]">
                      <li className="p-2 bg-[#21262d] text-white rounded cursor-pointer border border-[#30363d]">Most Popular (Week)</li>
                      <li className="p-2 hover:bg-[#161b22] rounded cursor-pointer">Top Rated All Time</li>
                      <li className="p-2 hover:bg-[#161b22] rounded cursor-pointer text-[#58a6ff]">Most Recent</li>
                   </ul>
                </div>
                
                <div className="space-y-2">
                   <h3 className="text-[#8b949e] uppercase tracking-widest">Categories</h3>
                   <ul className="space-y-1 text-[#c9d1d9]">
                      <li className="p-1.5 hover:bg-[#161b22] rounded cursor-pointer flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Armor & Weapons</li>
                      <li className="p-1.5 hover:bg-[#161b22] rounded cursor-pointer flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Custom Maps/Levels</li>
                      <li className="p-1.5 hover:bg-[#161b22] rounded cursor-pointer flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-sm"></div> Gameplay & Logic Overhauls</li>
                      <li className="p-1.5 hover:bg-[#161b22] rounded cursor-pointer flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> New Characters / NPCs</li>
                      <li className="p-1.5 hover:bg-[#161b22] rounded cursor-pointer flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-sm"></div> UI Improvements</li>
                   </ul>
                </div>
             </div>
         </div>

         {/* Grid Content Area */}
         <div className="flex-1 overflow-y-auto bg-[#0a0a0c] p-6 custom-scrollbar relative">
            
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-2"><Flame className="text-[#f85149]"/> Trending UGC</h2>
               <div className="text-[11px] font-mono text-[#8b949e]">Server Status: OK (34,092 Active Mods)</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {/* Workshop Item Card 1 */}
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden group hover:border-[#58a6ff] transition cursor-pointer flex flex-col shadow-lg">
                  <div className="h-[140px] bg-[#222] relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>
                     <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition duration-500">
                        <ImageIcon size={48} />
                     </div>
                     <span className="absolute bottom-2 left-2 z-20 text-[9px] font-bold bg-[#f85149] text-white px-1.5 py-0.5 rounded uppercase tracking-widest">Overhaul</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                     <h3 className="text-[13px] font-bold text-white group-hover:text-[#58a6ff] transition line-clamp-1">Brutal Combat Rebalance V3.1</h3>
                     <p className="text-[10px] text-[#8b949e] font-mono mt-1 mb-3">By: ShadowMaker_99</p>
                     
                     <div className="flex items-center gap-4 text-[10px] font-bold text-[#c9d1d9] mb-4 mt-auto">
                        <span className="flex items-center gap-1"><ThumbsUp size={12} className="text-[#3fb950]"/> 14.2k</span>
                        <span className="flex items-center gap-1"><DownloadCloud size={12} className="text-[#bc8cff]"/> 89k</span>
                        <span className="flex items-center gap-1"><Star size={12} className="text-[#e3b341]"/> 4.9</span>
                     </div>
                     <button className="w-full bg-[#21262d] border border-[#30363d] hover:bg-[#3fb950] hover:text-black py-1.5 rounded text-[11px] font-bold transition flex items-center justify-center gap-1">
                        + Subscribe / Install
                     </button>
                  </div>
               </div>

               {/* Workshop Item Card 2 */}
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden group hover:border-[#58a6ff] transition cursor-pointer flex flex-col shadow-lg">
                  <div className="h-[140px] bg-[#2a1b1b] relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>
                     <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 group-hover:scale-110 transition duration-500">
                        <Box size={40}/>
                     </div>
                     <span className="absolute bottom-2 left-2 z-20 text-[9px] font-bold bg-[#bc8cff] text-black px-1.5 py-0.5 rounded uppercase tracking-widest">New Content</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                     <h3 className="text-[13px] font-bold text-white group-hover:text-[#58a6ff] transition line-clamp-1">Forgotten Ruins Expansion Pack</h3>
                     <p className="text-[10px] text-[#8b949e] font-mono mt-1 mb-3">By: LevelArch</p>
                     
                     <div className="flex items-center gap-4 text-[10px] font-bold text-[#c9d1d9] mb-4 mt-auto">
                        <span className="flex items-center gap-1"><ThumbsUp size={12} className="text-[#3fb950]"/> 9.4k</span>
                        <span className="flex items-center gap-1"><DownloadCloud size={12} className="text-[#bc8cff]"/> 34k</span>
                     </div>
                     <button className="w-full bg-[#3fb950] text-black py-1.5 rounded text-[11px] font-bold shadow-lg shadow-[#3fb950]/20 flex items-center justify-center gap-1">
                        Installed
                     </button>
                  </div>
               </div>

               {/* Workshop Item Card 3 */}
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden group hover:border-[#58a6ff] transition cursor-pointer flex flex-col shadow-lg">
                  <div className="h-[140px] bg-[#1a2b3a] relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>
                     <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition duration-500">
                        <Settings2 size={48} />
                     </div>
                     <span className="absolute bottom-2 left-2 z-20 text-[9px] font-bold bg-[#e3b341] text-black px-1.5 py-0.5 rounded uppercase tracking-widest">UI / Quality of Life</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                     <h3 className="text-[13px] font-bold text-white group-hover:text-[#58a6ff] transition line-clamp-1">Better Inventory Sorting UI</h3>
                     <p className="text-[10px] text-[#8b949e] font-mono mt-1 mb-3">By: Pixelsmith</p>
                     
                     <div className="flex items-center gap-4 text-[10px] font-bold text-[#c9d1d9] mb-4 mt-auto">
                        <span className="flex items-center gap-1"><ThumbsUp size={12} className="text-[#3fb950]"/> 45.2k</span>
                        <span className="flex items-center gap-1"><DownloadCloud size={12} className="text-[#bc8cff]"/> 210k</span>
                     </div>
                     <button className="w-full bg-[#21262d] border border-[#30363d] hover:bg-[#3fb950] hover:text-black py-1.5 rounded text-[11px] font-bold transition flex items-center justify-center gap-1">
                        + Subscribe / Install
                     </button>
                  </div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
}
