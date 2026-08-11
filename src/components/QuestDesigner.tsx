import React from 'react';
import { Scroll, Plus, Search, Flag, CheckCircle, Target, Gift, GitBranch, Map} from 'lucide-react';

export default function QuestDesigner() {
  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      <div className="w-72 border-r border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#2a2b3d] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <Scroll size={16} className="text-amber-500" />
              Quest Database
            </h2>
            <button className="p-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs flex items-center gap-1">
              <Plus size={12} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search quests..." 
              className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded pl-8 pr-3 py-1.5 text-xs text-white focus:border-amber-500 outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
           <div className="text-[10px] font-bold text-gray-500 uppercase px-2 mb-2">Main Storyline</div>
           <div className="flex flex-col gap-1 mb-4">
              <div className="px-3 py-2 bg-[#2a2b3d] rounded text-xs flex justify-between items-center border-l-2 border-amber-500 cursor-pointer">
                 <span className="text-white font-medium">The Awakening</span>
                 <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 rounded">Active</span>
              </div>
              <div className="px-3 py-2 hover:bg-[#1a1b26] rounded text-xs flex justify-between items-center cursor-pointer text-gray-400">
                 <span>Journey to Capital</span>
              </div>
           </div>

           <div className="text-[10px] font-bold text-gray-500 uppercase px-2 mb-2">Side Quests</div>
           <div className="flex flex-col gap-1">
              <div className="px-3 py-2 hover:bg-[#1a1b26] rounded text-xs flex justify-between items-center cursor-pointer text-gray-400">
                 <span>Rat Infestation</span>
              </div>
              <div className="px-3 py-2 hover:bg-[#1a1b26] rounded text-xs flex justify-between items-center cursor-pointer text-gray-400">
                 <span>Lost Heirloom</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto">
         <div className="h-14 border-b border-[#2a2b3d] bg-[#1a1b26] flex items-center px-6 shrink-0 justify-between">
            <div className="flex items-center gap-3">
               <h1 className="text-xl font-bold text-white">The Awakening</h1>
               <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">MAIN QUEST</span>
            </div>
            <button className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] rounded text-white text-xs font-medium">Save Quest</button>
         </div>

         <div className="p-6 flex flex-col gap-8 max-w-4xl">
            {/* Basic Info */}
            <div className="flex flex-col gap-4">
               <h3 className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2 border-b border-[#2a2b3d] pb-2">
                  <Scroll size={16} className="text-gray-500"/> Quest Details
               </h3>
               <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                     <label className="text-xs font-medium text-gray-400">Internal ID</label>
                     <input type="text" className="bg-[#141525] border border-[#2a2b3d] rounded p-2 text-xs text-gray-400 font-mono" value="QST_MAIN_001" readOnly/>
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="text-xs font-medium text-gray-400">Display Name</label>
                     <input type="text" className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-white" defaultValue="The Awakening"/>
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                     <label className="text-xs font-medium text-gray-400">Description / Log Text</label>
                     <textarea className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-white h-24 resize-none" defaultValue="You have awoken in a strange place with no memory. Find someone who can help you understand where you are."></textarea>
                  </div>
               </div>
            </div>

            {/* Objectives */}
            <div className="flex flex-col gap-4">
               <div className="flex justify-between items-center border-b border-[#2a2b3d] pb-2">
                  <h3 className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                     <Target size={16} className="text-red-400"/> Objectives
                  </h3>
                  <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><Plus size={12}/> Add Objective</button>
               </div>
               
               <div className="bg-[#141525] border border-[#2a2b3d] rounded-lg overflow-hidden">
                  <div className="flex items-center gap-3 p-3 bg-[#1a1b26] border-b border-[#2a2b3d]">
                     <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">1</div>
                     <span className="flex-1 text-sm font-medium">Talk to Elder Eamon</span>
                     <span className="text-[10px] bg-[#2a2b3d] text-gray-400 px-2 py-1 rounded font-mono">TYPE: INTERACT</span>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                     <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 w-24">Target Entity:</span>
                        <span className="bg-[#0a0a0f] border border-[#2a2b3d] px-2 py-1 rounded text-amber-400 font-mono">NPC_ElderEamon</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 w-24">Location:</span>
                        <span className="bg-[#0a0a0f] border border-[#2a2b3d] px-2 py-1 rounded text-gray-300 flex items-center gap-1"><Map size={12}/> Starting Village</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Rewards */}
            <div className="flex flex-col gap-4">
               <div className="flex justify-between items-center border-b border-[#2a2b3d] pb-2">
                  <h3 className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                     <Gift size={16} className="text-green-400"/> Rewards
                  </h3>
                  <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><Plus size={12}/> Add Reward</button>
               </div>
               <div className="flex gap-4">
                  <div className="bg-[#141525] border border-[#2a2b3d] p-3 rounded flex items-center gap-3 w-48">
                     <div className="w-8 h-8 rounded bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold">G</div>
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-200">Gold</span>
                        <span className="text-sm font-bold text-yellow-500">50</span>
                     </div>
                  </div>
                  <div className="bg-[#141525] border border-[#2a2b3d] p-3 rounded flex items-center gap-3 w-48">
                     <div className="w-8 h-8 rounded bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold">XP</div>
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-200">Experience</span>
                        <span className="text-sm font-bold text-purple-400">150</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
