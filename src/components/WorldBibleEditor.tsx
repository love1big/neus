import React, { useState } from 'react';
import { Book, Users, Map, Clock, Shield, Sparkles, Feather, FileText, ChevronRight, Plus, Folder, Search } from 'lucide-react';

export default function WorldBibleEditor() {
  const [activeTab, setActiveTab] = useState('characters');

  const tabs = [
    { id: 'characters', name: 'Characters & Cast', icon: <Users size={16} />, color: 'text-[#58a6ff]' },
    { id: 'locations', name: 'World Maps & Locations', icon: <Map size={16} />, color: 'text-[#3fb950]' },
    { id: 'timeline', name: 'Historical Timeline', icon: <Clock size={16} />, color: 'text-[#e3b341]' },
    { id: 'factions', name: 'Factions & Politics', icon: <Shield size={16} />, color: 'text-[#f85149]' },
    { id: 'magic', name: 'Magic System / Technology', icon: <Sparkles size={16} />, color: 'text-[#bc8cff]' },
    { id: 'languages', name: 'Languages & Phonetics', icon: <Feather size={16} />, color: 'text-[#d2a8ff]' },
    { id: 'scripts', name: 'Cutscene Scripts', icon: <FileText size={16} />, color: 'text-[#8b949e]' },
  ];

  return (
    <div className="flex-1 flex h-full bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Sidebar for World Bible */}
      <div className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#30363d] bg-[#0d1117]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Book size={16} className="text-[#e3b341]" />
            World Bible (Lore)
          </h2>
          <div className="mt-2 relative">
            <Search size={14} className="absolute left-2 top-1.5 text-[#888]" />
            <input 
              type="text" 
              placeholder="Search world database..." 
              className="w-full bg-[#0d1117] border border-[#30363d] rounded px-7 py-1 text-xs focus:outline-none focus:border-[#58a6ff]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${activeTab === tab.id ? 'bg-[#21262d] border-l-2 border-[#58a6ff] text-white' : 'border-l-2 border-transparent text-[#8b949e] hover:bg-[#1f2428] hover:text-white'}`}
            >
              <div className={tab.color}>{tab.icon}</div>
              <span className="font-semibold">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
        {/* Header */}
        <div className="h-12 border-b border-[#30363d] flex items-center px-4 justify-between shrink-0 bg-[#161b22]">
           <div className="flex items-center gap-2 text-sm">
             <span className="text-[#8b949e]">World Bible</span>
             <ChevronRight size={14} className="text-[#58a6ff]" />
             <span className="font-bold text-white uppercase tracking-wide">{tabs.find(t => t.id === activeTab)?.name}</span>
           </div>
           <button className="bg-[#2ea043] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 hover:bg-[#2c974b] transition-colors">
              <Plus size={14} /> New Entry
           </button>
        </div>

        {/* Content Body based on tab */}
        <div className="flex-1 overflow-y-auto p-6">
           {activeTab === 'characters' && (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden flex flex-col hover:border-[#888] transition-colors cursor-pointer group">
                     <div className="h-32 bg-[#21262d] relative flex items-center justify-center">
                        <Users size={48} className="text-[#30363d] group-hover:text-[#58a6ff] transition-colors" />
                     </div>
                     <div className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-white text-base">Character Name {i}</h3>
                          <span className="bg-[#f85149]/20 text-[#f85149] text-[10px] px-2 py-0.5 rounded font-bold">Main Cast</span>
                        </div>
                        <p className="text-xs text-[#8b949e] line-clamp-3">
                          A detailed physical and psychological profile of this character. Includes motivations, flaws, relationships, and hidden secrets.
                        </p>
                     </div>
                  </div>
                ))}
             </div>
           )}

           {activeTab === 'timeline' && (
              <div className="max-w-4xl mx-auto flex flex-col gap-0 relative">
                 <div className="absolute top-0 bottom-0 left-[24px] w-[2px] bg-[#30363d]"></div>
                 {[1,2,3,4,5].map((item, idx) => (
                    <div key={idx} className="flex gap-6 relative py-6">
                       <div className="w-[50px] shrink-0 flex justify-center relative mt-1">
                          <div className="w-[14px] h-[14px] rounded-full bg-[#161b22] border-4 border-[#e3b341] z-10"></div>
                       </div>
                       <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg p-5">
                          <div className="text-[#e3b341] font-mono text-sm mb-1 font-bold">Age of Awakening - Year {item * 400}</div>
                          <h3 className="text-white font-bold text-lg mb-2">Great Historical Event {item}</h3>
                          <p className="text-sm text-[#8b949e] leading-relaxed">
                             Detailed documentation of what occurred during this era. Battles won, empires fallen, new magic discovered. Highly granular data for writers to maintain perfect consistency without using AI.
                          </p>
                       </div>
                    </div>
                 ))}
              </div>
           )}

           {activeTab === 'scripts' && (
             <div className="flex flex-col gap-4">
                <div className="bg-[#161b22] p-6 border border-[#30363d] rounded-lg">
                   <h3 className="text-white font-bold mb-4 font-mono">SCENE 1: THE THRONE ROOM</h3>
                   <div className="font-serif text-[#c9d1d9] space-y-4 text-center max-w-2xl mx-auto">
                      <p className="uppercase text-[#8b949e] tracking-widest text-sm">[INT. GRAND HALL - NIGHT]</p>
                      
                      <div className="mt-6">
                         <h4 className="uppercase mb-1 font-bold">KING ALARIC</h4>
                         <p className="text-lg">The shadows grow longer. Have the eastern scouts returned?</p>
                      </div>

                      <div className="mt-4">
                         <h4 className="uppercase mb-1 font-bold">COMMANDER JARO</h4>
                         <p className="text-[#8b949e] italic text-sm">(kneeling)</p>
                         <p className="text-lg">No, my liege. Only silence... and ash.</p>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* Empty states for others to save token space */}
           {['locations', 'factions', 'magic', 'languages'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-full text-center text-[#8b949e]">
                 <Folder size={64} className="mb-4 text-[#30363d]" />
                 <h2 className="text-white font-bold text-xl mb-2">Database Empty</h2>
                 <p className="max-w-md">Create detailed nodes, relationship matrices, and documentation here. Manage everything manually for precise directorial control.</p>
                 <button className="mt-6 bg-[#58a6ff] hover:bg-[#4090e0] text-white px-4 py-2 rounded text-sm font-semibold transition-colors">
                    Create First Entry
                 </button>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
