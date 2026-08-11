import React from 'react';
import { MessageSquare, Plus, Search, Settings, Save, Play, GitMerge, User, LayoutTemplate} from 'lucide-react';

export default function AdvancedDialogueSystem() {
  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      {/* Sidebar: Dialog Trees */}
      <div className="w-64 border-r border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#2a2b3d] flex flex-col gap-3">
          <h2 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
            <MessageSquare size={16} className="text-purple-400" />
            Dialogues
          </h2>
          <div className="flex items-center gap-2">
             <button className="flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs py-1.5 flex justify-center items-center gap-1"><Plus size={12}/> New Tree</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {['Intro_Merchant', 'Quest_Giver_01', 'King_Speech', 'Random_NPC_Chat'].map((name, i) => (
             <div key={i} className={`px-3 py-2 rounded text-xs flex items-center gap-2 cursor-pointer ${i === 0 ? 'bg-[#2a2b3d] text-white' : 'text-gray-400 hover:bg-[#1a1b26]'}`}>
                <GitMerge size={14} className={i===0 ? "text-purple-400" : ""} />
                {name}
             </div>
          ))}
        </div>
      </div>

      {/* Main Graph Editor */}
      <div className="flex-1 flex flex-col bg-[#0d1117] relative">
        <div className="h-12 border-b border-[#2a2b3d] bg-[#1a1b26] flex items-center justify-between px-4 shrink-0">
           <div className="flex items-center gap-3">
              <span className="font-semibold text-sm text-white">Intro_Merchant.dlg</span>
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] uppercase font-bold">Valid</span>
           </div>
           <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white" title="Test Dialogue"><Play size={16}/></button>
              <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white" title="Auto Layout"><LayoutTemplate size={16}/></button>
              <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white" title="Settings"><Settings size={16}/></button>
           </div>
        </div>

        {/* Node Graph Background */}
        <div className="flex-1 relative overflow-hidden" style={{
            backgroundImage: 'radial-gradient(#2a2b3d 1px, transparent 1px)',
            backgroundSize: '20px 20px'
        }}>
           {/* Connection Lines (SVG) */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 250 150 C 300 150, 300 100, 350 100" fill="none" stroke="#58a6ff" strokeWidth="2" />
              <path d="M 250 150 C 300 150, 300 250, 350 250" fill="none" stroke="#58a6ff" strokeWidth="2" />
           </svg>

           {/* Nodes */}
           {/* Entry Node */}
           <div className="absolute top-[120px] left-[50px] w-48 bg-[#141525] border border-[#2a2b3d] rounded shadow-xl flex flex-col">
              <div className="px-3 py-1.5 bg-green-900/40 border-b border-[#2a2b3d] rounded-t text-xs font-bold text-green-400 flex justify-between items-center">
                 START <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div className="p-2 text-xs text-gray-400">Trigger: OnInteract</div>
           </div>

           {/* Dialogue Node 1 */}
           <div className="absolute top-[100px] left-[350px] w-64 bg-[#141525] border border-blue-500/50 rounded shadow-xl flex flex-col ring-1 ring-blue-500/20">
              <div className="px-3 py-1.5 bg-[#1a1b26] border-b border-[#2a2b3d] rounded-t text-xs font-bold text-white flex justify-between items-center">
                 NPC Line <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <div className="p-3 flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center"><User size={16} className="text-gray-500"/></div>
                    <span className="text-xs font-medium text-blue-300">Merchant</span>
                 </div>
                 <textarea className="w-full h-16 bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-gray-200 resize-none outline-none focus:border-blue-500" defaultValue="Ah, a traveler! Care to see my wares?"></textarea>
                 
                 <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#2a2b3d] p-1.5 rounded text-[10px] text-gray-400 hover:border-blue-500 cursor-pointer">
                       <span>Show me what you got. (Trade)</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="flex items-center justify-between bg-[#0a0a0f] border border-[#2a2b3d] p-1.5 rounded text-[10px] text-gray-400 hover:border-blue-500 cursor-pointer">
                       <span>Not right now. (Leave)</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
      
      {/* Node Inspector */}
      <div className="w-80 border-l border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
         <div className="h-12 border-b border-[#2a2b3d] bg-[#1a1b26] flex items-center px-4 font-semibold text-sm text-gray-200">
            Node Properties
         </div>
         <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-gray-400 uppercase">Actor</label>
               <select className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-xs text-white">
                  <option>Merchant</option>
                  <option>Player</option>
               </select>
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-gray-400 uppercase">Voice Audio</label>
               <div className="flex gap-2">
                  <input type="text" className="flex-1 bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-xs text-white" placeholder="No audio clip selected..." readOnly />
                  <button className="bg-[#2a2b3d] px-2 rounded hover:bg-[#30363d]"><Search size={14} className="text-gray-400"/></button>
               </div>
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-gray-400 uppercase flex items-center justify-between">
                  Conditions
                  <button className="text-blue-400 hover:text-blue-300"><Plus size={12}/></button>
               </label>
               <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-gray-500 italic text-center">
                  No conditions set. Node will always execute.
               </div>
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-gray-400 uppercase flex items-center justify-between">
                  Events / Actions
                  <button className="text-blue-400 hover:text-blue-300"><Plus size={12}/></button>
               </label>
               <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-gray-500 italic text-center">
                  No events triggered.
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
