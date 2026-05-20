import React, { useState } from 'react';
import { BookOpen, Map, Users, MessageSquare, PenTool, Image, ScrollText, Library, FileText, CornerDownRight, Workflow } from 'lucide-react';

export default function WorldLoreEditor() {
  const [activeTab, setActiveTab] = useState('encyclopedia');

  return (
    <div className="flex h-full bg-[#0d1117] text-white overflow-hidden font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#161b22] border-r border-[#30363d] p-3 flex flex-col gap-2 shrink-0">
         <h2 className="text-[12px] font-bold text-[#8b949e] uppercase tracking-wider mb-2 flex items-center gap-2"><BookOpen size={14}/> World Lore & Bible</h2>
         
         <button onClick={() => setActiveTab('encyclopedia')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'encyclopedia' ? 'bg-[#21262d] text-[#e3b341]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <Library size={16}/> Wiki & Encyclopedia
         </button>
         <button onClick={() => setActiveTab('timeline')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'timeline' ? 'bg-[#21262d] text-[#bc8cff]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <ScrollText size={16}/> Narrative Timeline
         </button>
         <button onClick={() => setActiveTab('dialogue')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'dialogue' ? 'bg-[#21262d] text-[#58a6ff]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <MessageSquare size={16}/> Dialogue Trees
         </button>
         <button onClick={() => setActiveTab('factions')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'factions' ? 'bg-[#21262d] text-[#ff7b72]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
            <Users size={16}/> Factions & Relations
         </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#0d1117] relative">
         {activeTab === 'encyclopedia' && (
            <div className="flex h-full">
               {/* Categories */}
               <div className="w-48 border-r border-[#30363d] bg-[#0a0a0a] p-2 flex flex-col gap-1 overflow-y-auto">
                   <div className="text-[10px] text-[#8b949e] uppercase font-bold mb-1 pl-2">Categories</div>
                   <div className="text-[11px] text-[#c9d1d9] p-2 hover:bg-[#161b22] rounded cursor-pointer bg-[#21262d] border-l-2 border-[#e3b341]">Locations</div>
                   <div className="text-[11px] text-[#8b949e] p-2 hover:bg-[#161b22] rounded cursor-pointer">Characters</div>
                   <div className="text-[11px] text-[#8b949e] p-2 hover:bg-[#161b22] rounded cursor-pointer">Items & Artifacts</div>
                   <div className="text-[11px] text-[#8b949e] p-2 hover:bg-[#161b22] rounded cursor-pointer">Bestiary</div>
               </div>
               
               {/* Entry Editor */}
               <div className="flex-1 p-6 overflow-y-auto">
                   <div className="flex justify-between items-start mb-6 border-b border-[#30363d] pb-4">
                      <div>
                         <h1 className="text-3xl font-bold text-white mb-2">The Crystal Spire</h1>
                         <div className="text-[11px] text-[#8b949e] flex gap-4">
                            <span>Author: Lead Narrative</span>
                            <span>Last Edited: 2 hours ago</span>
                            <span className="text-[#3fb950] font-bold">Status: Canon</span>
                         </div>
                      </div>
                      <button className="bg-[#21262d] border border-[#30363d] px-4 py-1.5 rounded text-[11px] text-[#c9d1d9] hover:bg-[#30363d]">Edit Entry</button>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-2 space-y-4 text-[13px] leading-relaxed text-[#c9d1d9]">
                         <p>The Crystal Spire is an ancient monolithic structure located at the heart of the Shattered Plains. It serves as the primary conduit for aetherial energy on the continent. Discovered during the First Age by the elves of Lunaris, it is now contested by all major factions.</p>
                         <h3 className="text-sm font-bold text-white mt-6 mb-2">Architectural Significance</h3>
                         <p>Composed of an unknown crystalline substance, the spire resists all known forms of physical and magical tampering. Its geometric properties suggest purposeful design rather than natural formation.</p>
                      </div>
                      <div className="space-y-4">
                         <div className="border border-[#30363d] rounded bg-[#161b22] p-2">
                             <div className="aspect-video bg-[#0a0a0a] rounded flex items-center justify-center border border-[#30363d] mb-2 relative overflow-hidden group">
                                <Image size={24} className="text-[#30363d]"/>
                                <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                   <span className="text-[10px] bg-black/80 px-2 py-1 rounded">Upload Image</span>
                                </div>
                             </div>
                             <div className="text-[11px] text-[#8b949e] space-y-1">
                                <div className="flex justify-between border-b border-[#30363d] py-1"><span>Region</span><span className="text-white">Shattered Plains</span></div>
                                <div className="flex justify-between border-b border-[#30363d] py-1"><span>Controlling Faction</span><span className="text-[#ff7b72]">Vanguard Legion</span></div>
                                <div className="flex justify-between py-1"><span>Danger Level</span><span className="text-[#e3b341]">High</span></div>
                             </div>
                         </div>
                      </div>
                   </div>
               </div>
            </div>
         )}

         {activeTab === 'dialogue' && (
            <div className="flex-1 flex flex-col items-center justify-center text-[#8b949e]">
                <Workflow size={48} className="mb-4 text-[#30363d]"/>
                <p className="text-[12px] uppercase tracking-wide">Select a dialogue graph to edit</p>
                <div className="mt-6 border border-[#30363d] bg-[#161b22] rounded p-4 w-96">
                   <div className="font-bold text-[13px] text-white mb-2">Recent Branches</div>
                   <div className="space-y-1">
                      <div className="text-[11px] hover:bg-[#21262d] p-1.5 rounded cursor-pointer flex items-center justify-between"><span>Merchant_Intro_01</span> <span className="text-[#3fb950]">8 nodes</span></div>
                      <div className="text-[11px] hover:bg-[#21262d] p-1.5 rounded cursor-pointer flex items-center justify-between"><span>King_Throne_Room</span> <span className="text-[#3fb950]">42 nodes</span></div>
                      <div className="text-[11px] hover:bg-[#21262d] p-1.5 rounded cursor-pointer flex items-center justify-between"><span>Guard_Arrest_Sequence</span> <span className="text-[#3fb950]">15 nodes</span></div>
                   </div>
                </div>
            </div>
         )}
         
         {(activeTab === 'timeline' || activeTab === 'factions') && (
            <div className="flex-1 flex flex-col items-center justify-center text-[#8b949e]">
                <PenTool size={48} className="mb-4 text-[#30363d]"/>
                <p className="text-[12px] uppercase tracking-wide">Tool currently in offline mode.</p>
            </div>
         )}
      </div>
    </div>
  );
}
