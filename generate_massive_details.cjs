const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

const components = {
  'AdvancedTimelineEditor.tsx': `import React, { useState } from 'react';
import { Clock, Play, Pause, SkipBack, SkipForward, Plus, Settings, Video, Music, Type, Layers, Maximize2, MousePointer2, Scissors, Copy, Move } from 'lucide-react';

export default function AdvancedTimelineEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      {/* Top Header & Transport */}
      <div className="h-14 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#58a6ff]">
            <Clock size={18} />
            <span className="font-bold text-sm">Advanced Timeline</span>
          </div>
          <div className="h-6 w-px bg-[#2a2b3d]"></div>
          <div className="flex items-center gap-2 bg-[#0a0a0f] p-1 rounded border border-[#2a2b3d]">
            <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white"><MousePointer2 size={14} /></button>
            <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white"><Scissors size={14} /></button>
            <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white"><Copy size={14} /></button>
            <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400 hover:text-white"><Move size={14} /></button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-mono text-xl font-bold text-[#58a6ff] tracking-wider">
            00:00:{(currentTime / 10).toFixed(2).padStart(5, '0')}
          </span>
          <div className="flex items-center gap-2 bg-[#0a0a0f] p-1 rounded border border-[#2a2b3d]">
            <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400"><SkipBack size={16} /></button>
            <button className="p-1.5 bg-[#238636] hover:bg-[#2ea043] rounded text-white" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400"><SkipForward size={16} /></button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#2a2b3d] hover:bg-[#30363d] rounded text-xs font-medium border border-[#30363d]">Export</button>
          <button className="p-1.5 hover:bg-[#2a2b3d] rounded text-gray-400"><Settings size={16} /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Preview Area & Inspector */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-black relative flex items-center justify-center border-b border-[#2a2b3d]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
            <div className="z-10 text-center">
              <Maximize2 size={32} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Preview Canvas</p>
            </div>
            
            {/* Safe Zones */}
            <div className="absolute inset-8 border border-white/10 pointer-events-none"></div>
            <div className="absolute inset-16 border border-white/5 pointer-events-none"></div>
          </div>
        </div>

        {/* Inspector Sidebar */}
        <div className="w-80 border-l border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#2a2b3d] bg-[#1a1b26] font-medium text-sm text-gray-300">
            Inspector
          </div>
          <div className="p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-3 flex flex-col gap-3">
               <h3 className="text-xs font-bold text-gray-400 uppercase">Transform</h3>
               <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col gap-1"><span className="text-gray-500">Position X</span><input type="text" className="bg-[#141525] border border-[#2a2b3d] rounded p-1 text-white" value="0.0" readOnly/></div>
                  <div className="flex flex-col gap-1"><span className="text-gray-500">Position Y</span><input type="text" className="bg-[#141525] border border-[#2a2b3d] rounded p-1 text-white" value="10.5" readOnly/></div>
                  <div className="flex flex-col gap-1"><span className="text-gray-500">Scale X</span><input type="text" className="bg-[#141525] border border-[#2a2b3d] rounded p-1 text-white" value="1.0" readOnly/></div>
                  <div className="flex flex-col gap-1"><span className="text-gray-500">Scale Y</span><input type="text" className="bg-[#141525] border border-[#2a2b3d] rounded p-1 text-white" value="1.0" readOnly/></div>
               </div>
            </div>
            <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-3 flex flex-col gap-3">
               <h3 className="text-xs font-bold text-gray-400 uppercase">Effects</h3>
               <button className="w-full py-1.5 bg-[#2a2b3d] hover:bg-[#30363d] rounded text-xs border border-[#30363d] flex justify-center items-center gap-2"><Plus size={12}/> Add Effect</button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Panel */}
      <div className="h-72 flex flex-col bg-[#141525] shrink-0 border-t border-[#2a2b3d]">
        {/* Timeline Header (Time Ruler) */}
        <div className="h-8 border-b border-[#2a2b3d] flex bg-[#1a1b26]">
          <div className="w-64 border-r border-[#2a2b3d] p-2 flex items-center justify-between shrink-0">
             <span className="text-xs font-medium text-gray-400">Tracks</span>
             <div className="flex gap-1">
                <button className="text-gray-500 hover:text-white"><Plus size={14}/></button>
                <button className="text-gray-500 hover:text-white"><Layers size={14}/></button>
             </div>
          </div>
          <div className="flex-1 relative overflow-hidden">
             {/* Ruler Ticks */}
             <div className="absolute inset-0 flex items-end opacity-30 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 99px, #fff 99px, #fff 100px)'}}>
                {[...Array(20)].map((_, i) => (
                   <span key={i} className="absolute text-[9px] font-mono mb-1 ml-1" style={{left: \`\${i * 100}px\`}}>00:0{i}</span>
                ))}
             </div>
             {/* Playhead */}
             <div className="absolute top-0 bottom-0 w-px bg-red-500 z-20" style={{ left: '250px' }}>
                <div className="w-3 h-3 bg-red-500 -ml-1.5 transform rotate-45 -mt-1.5"></div>
             </div>
          </div>
        </div>

        {/* Tracks Area */}
        <div className="flex-1 flex overflow-y-auto">
          <div className="flex flex-col min-w-full">
            {/* Track 1 */}
            <div className="flex h-16 border-b border-[#2a2b3d]/50 bg-[#0a0a0f]/50">
               <div className="w-64 border-r border-[#2a2b3d] p-2 flex flex-col justify-center shrink-0 bg-[#141525]">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                     <Video size={14} className="text-blue-400"/> V1 - Main Camera
                  </div>
               </div>
               <div className="flex-1 relative">
                  <div className="absolute top-2 bottom-2 left-10 w-96 bg-blue-600/30 border border-blue-500/50 rounded flex items-center px-2 text-[10px] text-blue-200 overflow-hidden">
                     Hero_Shot_01.mp4
                  </div>
               </div>
            </div>
            {/* Track 2 */}
            <div className="flex h-16 border-b border-[#2a2b3d]/50 bg-[#0a0a0f]/50">
               <div className="w-64 border-r border-[#2a2b3d] p-2 flex flex-col justify-center shrink-0 bg-[#141525]">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                     <Type size={14} className="text-yellow-400"/> T1 - Subtitles
                  </div>
               </div>
               <div className="flex-1 relative">
                  <div className="absolute top-2 bottom-2 left-64 w-48 bg-yellow-600/30 border border-yellow-500/50 rounded flex items-center px-2 text-[10px] text-yellow-200 overflow-hidden">
                     Subtitle Block
                  </div>
               </div>
            </div>
            {/* Track 3 */}
            <div className="flex h-16 border-b border-[#2a2b3d]/50 bg-[#0a0a0f]/50">
               <div className="w-64 border-r border-[#2a2b3d] p-2 flex flex-col justify-center shrink-0 bg-[#141525]">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                     <Music size={14} className="text-green-400"/> A1 - BGM
                  </div>
               </div>
               <div className="flex-1 relative">
                  <div className="absolute top-2 bottom-2 left-0 w-[800px] bg-green-600/30 border border-green-500/50 rounded flex items-center px-2 text-[10px] text-green-200 overflow-hidden">
                     Ambient_Theme.wav
                     <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
                        <path d="M0,15 Q5,5 10,15 T20,15 T30,15 T40,15 T50,15" stroke="white" fill="none" vectorEffect="non-scaling-stroke"/>
                     </svg>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  'AdvancedDialogueSystem.tsx': `import React from 'react';
import { MessageSquare, Plus, Search, Settings, Save, Play, GitMerge, User, LayoutTemplate } from 'lucide-react';

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
             <div key={i} className={\`px-3 py-2 rounded text-xs flex items-center gap-2 cursor-pointer \${i === 0 ? 'bg-[#2a2b3d] text-white' : 'text-gray-400 hover:bg-[#1a1b26]'}\`}>
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
`,
  'QuestDesigner.tsx': `import React from 'react';
import { Scroll, Plus, Search, Flag, CheckCircle, Target, Gift, GitBranch, Map } from 'lucide-react';

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
`,
  'AdvancedAudioEditor.tsx': `import React from 'react';
import { Activity, Play, Pause, SkipBack, Volume2, Sliders, Mic, Square, Scissors } from 'lucide-react';

export default function AdvancedAudioEditor() {
  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-4 shrink-0">
         <div className="flex items-center gap-3">
            <Activity size={18} className="text-pink-500" />
            <span className="font-bold text-sm">Audio Engine DSP</span>
         </div>
         <div className="flex items-center gap-4 bg-[#0a0a0f] px-4 py-1.5 rounded-full border border-[#2a2b3d]">
            <button className="text-gray-400 hover:text-white"><SkipBack size={18}/></button>
            <button className="w-8 h-8 flex items-center justify-center bg-pink-600 hover:bg-pink-500 text-white rounded-full"><Play size={16} className="ml-1"/></button>
            <button className="text-gray-400 hover:text-red-500"><Square size={16}/></button>
            <button className="text-gray-400 hover:text-red-500 ml-4"><Mic size={18}/></button>
         </div>
         <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-pink-400 bg-pink-500/10 px-2 py-1 rounded">44.1 kHz</span>
            <span className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded">24-bit</span>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Main Waveform Area */}
         <div className="flex-1 flex flex-col bg-[#0a0a0f]">
            <div className="h-8 border-b border-[#2a2b3d] bg-[#1a1b26] flex items-end">
               <div className="w-full h-4 relative">
                  {[...Array(50)].map((_, i) => (
                     <div key={i} className="absolute bottom-0 w-px bg-gray-600" style={{ left: \`\${i * 2}%\`, height: i%5===0 ? '10px' : '5px' }}></div>
                  ))}
               </div>
            </div>
            <div className="flex-1 relative overflow-y-auto flex flex-col gap-1 p-2">
               {/* Track 1 */}
               <div className="h-32 bg-[#141525] border border-[#2a2b3d] rounded flex overflow-hidden">
                  <div className="w-48 bg-[#1a1b26] border-r border-[#2a2b3d] p-3 flex flex-col justify-between shrink-0">
                     <div className="font-bold text-xs text-pink-400">Main_Vocal.wav</div>
                     <div className="flex items-center gap-2">
                        <button className="w-6 h-6 rounded bg-[#2a2b3d] text-[10px] font-bold hover:bg-[#30363d]">M</button>
                        <button className="w-6 h-6 rounded bg-[#2a2b3d] text-[10px] font-bold hover:bg-[#30363d]">S</button>
                        <Volume2 size={14} className="text-gray-500 ml-auto"/>
                     </div>
                  </div>
                  <div className="flex-1 relative bg-[#0d1117] flex items-center p-2">
                     {/* Fake Waveform using SVG */}
                     <svg className="w-full h-full text-pink-500" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,50 Q2,10 4,50 T8,50 T12,50 T16,20 T20,50 T24,80 T28,50 T32,50 T36,10 T40,50 T44,50 T48,90 T52,50 T56,50 T60,20 T64,50 T68,50 T72,10 T76,50 T80,50 T84,80 T88,50 T92,50 T96,20 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
                        <path d="M0,50 Q2,20 4,50 T8,50 T12,50 T16,30 T20,50 T24,70 T28,50 T32,50 T36,20 T40,50 T44,50 T48,80 T52,50 T56,50 T60,30 T64,50 T68,50 T72,20 T76,50 T80,50 T84,70 T88,50 T92,50 T96,30 T100,50" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5" vectorEffect="non-scaling-stroke"/>
                     </svg>
                     <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50 shadow-[0_0_5px_white]"></div>
                  </div>
               </div>
               
               {/* Track 2 */}
               <div className="h-32 bg-[#141525] border border-[#2a2b3d] rounded flex overflow-hidden">
                  <div className="w-48 bg-[#1a1b26] border-r border-[#2a2b3d] p-3 flex flex-col justify-between shrink-0">
                     <div className="font-bold text-xs text-blue-400">Synth_Pad.wav</div>
                     <div className="flex items-center gap-2">
                        <button className="w-6 h-6 rounded bg-[#2a2b3d] text-[10px] font-bold hover:bg-[#30363d]">M</button>
                        <button className="w-6 h-6 rounded bg-[#2a2b3d] text-[10px] font-bold hover:bg-[#30363d]">S</button>
                        <Volume2 size={14} className="text-gray-500 ml-auto"/>
                     </div>
                  </div>
                  <div className="flex-1 relative bg-[#0d1117] flex items-center p-2">
                     <svg className="w-full h-full text-blue-500 opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,50 Q5,40 10,50 T20,50 T30,50 T40,50 T50,50 T60,50 T70,50 T80,50 T90,50 T100,50" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
                     </svg>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Mixer / FX Panel */}
         <div className="w-80 border-l border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
            <div className="h-10 border-b border-[#2a2b3d] bg-[#1a1b26] flex items-center px-4 font-semibold text-sm text-gray-200 gap-2">
               <Sliders size={16} /> FX Chain
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
               {/* EQ Node */}
               <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded-lg overflow-hidden">
                  <div className="bg-[#1a1b26] border-b border-[#2a2b3d] px-3 py-2 flex justify-between items-center text-xs font-bold">
                     <span>Parametric EQ</span>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="p-3">
                     <div className="h-20 bg-[#141525] rounded border border-[#2a2b3d] relative mb-3 overflow-hidden">
                        {/* Fake EQ Curve */}
                        <svg className="w-full h-full" preserveAspectRatio="none">
                           <path d="M0,40 Q20,40 30,20 T50,40 T70,60 T100,40" fill="none" stroke="#58a6ff" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                        </svg>
                        <div className="absolute top-1/2 w-full h-px bg-white/10"></div>
                     </div>
                     <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                        <span>Low Cut: 80Hz</span>
                        <span>High Shelf: +2dB</span>
                     </div>
                  </div>
               </div>

               {/* Reverb Node */}
               <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded-lg overflow-hidden">
                  <div className="bg-[#1a1b26] border-b border-[#2a2b3d] px-3 py-2 flex justify-between items-center text-xs font-bold">
                     <span>Convolution Reverb</span>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="p-3 flex flex-col gap-3">
                     <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-gray-400"><span>Mix</span> <span>35%</span></div>
                        <input type="range" className="w-full accent-pink-500" defaultValue="35"/>
                     </div>
                     <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-gray-400"><span>Decay</span> <span>2.4s</span></div>
                        <input type="range" className="w-full accent-pink-500" defaultValue="60"/>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
`,
  'AdvancedAnimationBlender.tsx': `import React from 'react';
import { Activity, Plus, Play, Anchor, Move, Minimize, GitCommit } from 'lucide-react';

export default function AdvancedAnimationBlender() {
  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      <div className="flex-1 flex flex-col relative">
        <div className="h-12 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
             <Activity size={16} className="text-orange-400"/>
             <span className="font-bold text-sm">AnimGraph: Player_Locomotion</span>
          </div>
          <div className="flex gap-2">
             <button className="px-3 py-1.5 bg-[#2a2b3d] hover:bg-[#30363d] text-xs font-medium rounded flex items-center gap-2 border border-[#30363d]"><Play size={12}/> Simulate</button>
          </div>
        </div>

        {/* Node Graph Area */}
        <div className="flex-1 bg-[#0d1117] relative overflow-hidden" style={{
            backgroundImage: 'radial-gradient(#2a2b3d 1px, transparent 1px)',
            backgroundSize: '24px 24px'
        }}>
           {/* SVG Connections */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 250 200 C 350 200, 350 300, 450 300" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 650 300 C 700 300, 700 300, 750 300" fill="none" stroke="white" strokeWidth="3" />
           </svg>

           {/* Input Variables Node */}
           <div className="absolute top-[100px] left-[50px] w-48 bg-[#141525] border border-[#2a2b3d] rounded-lg shadow-xl">
              <div className="bg-[#1a1b26] border-b border-[#2a2b3d] px-3 py-2 text-xs font-bold flex items-center justify-between rounded-t-lg">
                 Parameters
                 <Plus size={14} className="text-gray-400"/>
              </div>
              <div className="p-2 flex flex-col gap-2">
                 <div className="flex items-center justify-between text-xs bg-[#0a0a0f] p-1.5 rounded border border-[#2a2b3d]">
                    <span className="text-gray-400">Speed (Float)</span>
                    <div className="w-2 h-2 rounded-full bg-green-400 relative">
                       <div className="absolute top-1/2 left-full w-4 h-px bg-green-400"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between text-xs bg-[#0a0a0f] p-1.5 rounded border border-[#2a2b3d]">
                    <span className="text-gray-400">isGrounded (Bool)</span>
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                 </div>
              </div>
           </div>

           {/* Blend Space Node */}
           <div className="absolute top-[250px] left-[450px] w-56 bg-[#141525] border border-orange-500/50 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <div className="bg-gradient-to-r from-orange-900/40 to-transparent border-b border-[#2a2b3d] px-3 py-2 text-xs font-bold flex items-center gap-2 rounded-t-lg">
                 <Minimize size={14} className="text-orange-400"/> 1D Blend Space
              </div>
              <div className="p-3">
                 <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400"></div> Value</div>
                 </div>
                 {/* Mini Blend visualization */}
                 <div className="h-8 bg-[#0a0a0f] border border-[#2a2b3d] rounded relative mt-2 flex items-center px-2">
                    <div className="w-full h-px bg-gray-600 relative">
                       <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-gray-400 -translate-y-1/2 -ml-1"></div>
                       <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gray-400 -translate-y-1/2 -ml-1"></div>
                       <div className="absolute top-1/2 left-full w-2 h-2 rounded-full bg-gray-400 -translate-y-1/2 -ml-1"></div>
                       {/* Current value indicator */}
                       <div className="absolute top-1/2 left-1/4 w-3 h-3 rounded-full border-2 border-orange-500 bg-[#141525] -translate-y-1/2 -ml-1.5 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                    </div>
                 </div>
                 <div className="flex justify-between text-[9px] text-gray-500 mt-1 uppercase">
                    <span>Idle</span>
                    <span>Walk</span>
                    <span>Run</span>
                 </div>
                 
                 <div className="flex items-center justify-end mt-4">
                    <div className="flex items-center gap-2 text-xs text-white">Pose <div className="w-3 h-3 rounded-full border-2 border-white flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div></div>
                 </div>
              </div>
           </div>

           {/* Output Node */}
           <div className="absolute top-[260px] left-[750px] w-40 bg-[#141525] border border-white/20 rounded-lg shadow-xl ring-1 ring-white/10">
              <div className="bg-white/10 border-b border-[#2a2b3d] px-3 py-2 text-xs font-bold flex items-center gap-2 rounded-t-lg text-white">
                 <Anchor size={14} /> Final Pose
              </div>
              <div className="p-3 flex flex-col gap-2">
                 <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-3 h-3 rounded-full border-2 border-gray-500 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div></div> Input Pose
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="w-80 border-l border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
         <div className="h-48 border-b border-[#2a2b3d] bg-black relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#141525] to-transparent z-10 pointer-events-none"></div>
            {/* Mock 3D Character Preview */}
            <div className="w-20 h-40 border-2 border-gray-600 rounded-full opacity-30"></div>
            <div className="absolute bottom-2 left-2 z-20 text-[10px] font-mono text-gray-400 bg-black/50 p-1 rounded backdrop-blur border border-[#2a2b3d]">
               Playing: Idle_to_Walk_Blend<br/>Speed: 2.4m/s
            </div>
         </div>
         <div className="p-3 border-b border-[#2a2b3d] bg-[#1a1b26] font-semibold text-sm text-gray-200">
            Node Settings
         </div>
         <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-gray-400 uppercase">Interpolation Time</label>
               <input type="number" className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-white" defaultValue="0.2" />
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-xs font-bold text-gray-400 uppercase">Axis Scale</label>
               <select className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 text-xs text-white">
                  <option>Linear</option>
                  <option>Cubic</option>
               </select>
            </div>
         </div>
      </div>
    </div>
  );
}
`,
  'AdvancedShaderEditor.tsx': `import React from 'react';
import { Flame, Box, Maximize, Play, Sun, Layers, Droplet } from 'lucide-react';

export default function AdvancedShaderEditor() {
  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      {/* Node Graph */}
      <div className="flex-1 flex flex-col relative bg-[#0d1117] overflow-hidden">
         <div className="h-12 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-4 shrink-0 z-10 shadow-md">
            <div className="flex items-center gap-3">
               <Flame size={16} className="text-red-500" />
               <span className="font-bold text-sm">PBR Material Shader Graph</span>
            </div>
            <button className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded shadow">Compile Shader</button>
         </div>

         <div className="flex-1 relative" style={{
             backgroundImage: 'linear-gradient(#2a2b3d 1px, transparent 1px), linear-gradient(90deg, #2a2b3d 1px, transparent 1px)',
             backgroundSize: '30px 30px'
         }}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
               <path d="M 200 150 C 300 150, 400 200, 500 200" fill="none" stroke="#facc15" strokeWidth="2" />
               <path d="M 200 300 C 350 300, 350 250, 500 230" fill="none" stroke="#60a5fa" strokeWidth="2" />
            </svg>

            {/* Texture Sample Node */}
            <div className="absolute top-[100px] left-[50px] w-48 bg-[#141525] border border-[#2a2b3d] rounded shadow-xl">
               <div className="bg-[#1a1b26] border-b border-[#2a2b3d] px-3 py-1.5 text-xs font-bold flex items-center gap-2 rounded-t">
                  <Box size={12} className="text-green-400" /> Texture Sample
               </div>
               <div className="p-2 flex flex-col gap-2">
                  <div className="h-20 bg-gray-800 rounded border border-[#2a2b3d] flex items-center justify-center text-[10px] text-gray-500 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Texture"/>
                  </div>
                  <div className="flex justify-end text-xs text-yellow-400 gap-2 items-center">
                     RGB <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  </div>
               </div>
            </div>

            {/* Value Node */}
            <div className="absolute top-[280px] left-[50px] w-40 bg-[#141525] border border-[#2a2b3d] rounded shadow-xl">
               <div className="bg-[#1a1b26] border-b border-[#2a2b3d] px-3 py-1.5 text-xs font-bold rounded-t">
                  Float Constant
               </div>
               <div className="p-2 flex justify-between items-center">
                  <input type="number" className="w-16 bg-[#0a0a0f] border border-[#2a2b3d] text-xs p-1 text-white rounded" defaultValue="0.8" />
                  <div className="flex gap-2 items-center text-xs text-blue-400">
                     <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
               </div>
            </div>

            {/* Master Material Node */}
            <div className="absolute top-[150px] left-[500px] w-56 bg-[#141525] border border-red-500/50 rounded shadow-[0_0_20px_rgba(239,68,68,0.1)]">
               <div className="bg-gradient-to-r from-red-900/30 to-transparent border-b border-[#2a2b3d] px-3 py-2 text-xs font-bold rounded-t flex items-center gap-2">
                  <Layers size={14} className="text-red-400" /> Base Material
               </div>
               <div className="p-3 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                     <div className="w-3 h-3 rounded-full border-2 border-yellow-400 bg-[#0a0a0f] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div></div> Base Color
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                     <div className="w-3 h-3 rounded-full border-2 border-gray-500 bg-[#0a0a0f]"></div> Metallic
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                     <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-[#0a0a0f] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div></div> Roughness
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                     <div className="w-3 h-3 rounded-full border-2 border-purple-400 bg-[#0a0a0f]"></div> Normal Map
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Real-time Preview Panel */}
      <div className="w-80 border-l border-[#2a2b3d] flex flex-col shrink-0 bg-[#050505]">
         <div className="h-64 border-b border-[#2a2b3d] relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-2 right-2 flex gap-1 z-10">
               <button className="bg-[#141525]/80 p-1.5 rounded border border-[#2a2b3d] text-gray-400 hover:text-white"><Sun size={14}/></button>
               <button className="bg-[#141525]/80 p-1.5 rounded border border-[#2a2b3d] text-gray-400 hover:text-white"><Box size={14}/></button>
            </div>
            {/* Fake 3D Sphere Preview */}
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-300 via-gray-500 to-gray-900 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.5)]">
               <div className="w-full h-full rounded-full opacity-40 bg-[url('https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=200&auto=format&fit=crop')] mix-blend-overlay"></div>
               {/* Specular Highlight */}
               <div className="absolute top-16 left-24 w-8 h-8 bg-white rounded-full blur-md opacity-60"></div>
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-green-400 bg-black/60 px-2 py-1 rounded border border-[#2a2b3d]">
               Shader Compiled Successfully
            </div>
         </div>
         <div className="flex-1 bg-[#141525] p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
               <h3 className="text-xs font-bold text-gray-400 uppercase">Material Properties</h3>
               <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Blend Mode</span>
                  <select className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1 text-white"><option>Opaque</option><option>Translucent</option></select>
               </div>
               <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Two Sided</span>
                  <input type="checkbox" className="rounded bg-[#0a0a0f] border-[#2a2b3d]" />
               </div>
            </div>
            <div className="h-px bg-[#2a2b3d] w-full"></div>
            <div className="flex flex-col gap-2">
               <h3 className="text-xs font-bold text-gray-400 uppercase">Performance</h3>
               <div className="flex justify-between text-[10px] font-mono text-gray-300">
                  <span>Instruction Count</span><span className="text-blue-400">142</span>
               </div>
               <div className="flex justify-between text-[10px] font-mono text-gray-300">
                  <span>Texture Samplers</span><span className="text-yellow-400">3 / 16</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
`,
  'AdvancedDebuggingTools.tsx': `import React from 'react';
import { Bug, Activity, Cpu, Server, AlertTriangle, AlertCircle, Play, Pause, RefreshCw, BarChart2 } from 'lucide-react';

export default function AdvancedDebuggingTools() {
  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      <div className="h-14 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-4 shrink-0">
         <div className="flex items-center gap-3">
            <Bug size={18} className="text-red-500" />
            <span className="font-bold text-sm">Advanced Performance Profiler</span>
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 uppercase tracking-widest ml-2 animate-pulse">Live Recording</span>
         </div>
         <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-[#2a2b3d] hover:bg-[#30363d] rounded text-xs font-medium border border-[#30363d] flex items-center gap-2"><RefreshCw size={12}/> Clear Data</button>
            <button className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-xs font-medium flex items-center gap-2 text-white"><Pause size={12}/> Stop Capture</button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Main Profiler View */}
         <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-[#2a2b3d]">
               <div className="bg-[#141525] border border-[#2a2b3d] p-3 rounded-lg flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold"><Activity size={14} className="text-green-400"/> Frame Rate</div>
                  <div className="text-2xl font-mono text-white">59.8 <span className="text-sm text-gray-500">FPS</span></div>
                  <div className="text-[10px] text-green-400">16.7ms per frame</div>
               </div>
               <div className="bg-[#141525] border border-[#2a2b3d] p-3 rounded-lg flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold"><Cpu size={14} className="text-blue-400"/> CPU Time</div>
                  <div className="text-2xl font-mono text-white">8.4 <span className="text-sm text-gray-500">ms</span></div>
                  <div className="text-[10px] text-gray-500">Main Thread: 5.2ms</div>
               </div>
               <div className="bg-[#141525] border border-[#2a2b3d] p-3 rounded-lg flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold"><Server size={14} className="text-purple-400"/> Memory Heap</div>
                  <div className="text-2xl font-mono text-white">412 <span className="text-sm text-gray-500">MB</span></div>
                  <div className="w-full h-1 bg-[#0a0a0f] rounded mt-1 overflow-hidden"><div className="w-[40%] h-full bg-purple-500"></div></div>
               </div>
               <div className="bg-[#141525] border border-[#2a2b3d] p-3 rounded-lg flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold"><BarChart2 size={14} className="text-yellow-400"/> Draw Calls</div>
                  <div className="text-2xl font-mono text-white">1,240</div>
                  <div className="text-[10px] text-yellow-400 flex items-center gap-1"><AlertTriangle size={10}/> High vertex count</div>
               </div>
            </div>

            {/* Flame Graph Mock */}
            <div className="p-4 flex flex-col gap-2">
               <h3 className="text-sm font-bold text-gray-300">CPU Frame Breakdown (Flame Graph)</h3>
               <div className="h-48 bg-[#141525] border border-[#2a2b3d] rounded-lg p-2 overflow-hidden flex flex-col gap-1">
                  <div className="h-6 w-full bg-blue-500/80 rounded hover:bg-blue-400 flex items-center px-2 text-[10px] font-mono text-white truncate border border-blue-400/50">EngineLoop::Tick() [16.7ms]</div>
                  <div className="flex gap-1">
                     <div className="h-6 w-[30%] bg-purple-500/80 rounded hover:bg-purple-400 flex items-center px-2 text-[10px] font-mono text-white truncate border border-purple-400/50">Physics::Simulate [4.1ms]</div>
                     <div className="h-6 w-[45%] bg-green-500/80 rounded hover:bg-green-400 flex items-center px-2 text-[10px] font-mono text-white truncate border border-green-400/50">Render::DrawScene [8.2ms]</div>
                     <div className="h-6 w-[25%] bg-orange-500/80 rounded hover:bg-orange-400 flex items-center px-2 text-[10px] font-mono text-white truncate border border-orange-400/50">Scripts::Update [3.0ms]</div>
                  </div>
                  <div className="flex gap-1 ml-[30%]">
                     <div className="h-6 w-[20%] bg-green-600/80 rounded hover:bg-green-500 flex items-center px-2 text-[10px] font-mono text-white truncate border border-green-500/50">Shadows [3.1ms]</div>
                     <div className="h-6 w-[15%] bg-green-600/80 rounded hover:bg-green-500 flex items-center px-2 text-[10px] font-mono text-white truncate border border-green-500/50">Opaque [2.5ms]</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Sidebar Logs */}
         <div className="w-80 border-l border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
            <div className="h-10 border-b border-[#2a2b3d] bg-[#1a1b26] flex items-center px-4 font-semibold text-sm text-gray-200">
               Live Warnings
            </div>
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
               <div className="bg-yellow-900/20 border border-yellow-500/30 p-2 rounded flex items-start gap-2 text-xs">
                  <AlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5"/>
                  <div className="flex flex-col">
                     <span className="text-yellow-200 font-bold">Texture Memory High</span>
                     <span className="text-gray-400 mt-1">Pool size exceeding 80%. Consider lowering texture resolution for 'Environment_Atlas'.</span>
                  </div>
               </div>
               <div className="bg-red-900/20 border border-red-500/30 p-2 rounded flex items-start gap-2 text-xs">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5"/>
                  <div className="flex flex-col">
                     <span className="text-red-200 font-bold">Null Reference Exception</span>
                     <span className="text-gray-400 mt-1">PlayerController.ts:142 - Target object destroyed before script execution.</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
`,
  'MachineLearningIntegration.tsx': `import React from 'react';
import { Brain, Settings, Database, Activity, Play, Download, Network, Code } from 'lucide-react';

export default function MachineLearningIntegration() {
  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      <div className="w-64 border-r border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#2a2b3d]">
          <h2 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
            <Brain size={16} className="text-emerald-400" />
            ML Hub
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
           <div className="px-3 py-2 bg-[#2a2b3d] rounded text-xs flex items-center gap-2 font-medium text-emerald-400 border-l-2 border-emerald-400"><Network size={14}/> NPC Behavior Net</div>
           <div className="px-3 py-2 hover:bg-[#1a1b26] rounded text-xs flex items-center gap-2 text-gray-400 cursor-pointer"><Database size={14}/> Procedural Gen Model</div>
           <div className="px-3 py-2 hover:bg-[#1a1b26] rounded text-xs flex items-center gap-2 text-gray-400 cursor-pointer"><Activity size={14}/> Player Churn Predictor</div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto">
         <div className="p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-white mb-1">NPC Combat Behavior Network</h1>
                  <p className="text-sm text-gray-400">Reinforcement learning model for advanced enemy tactics.</p>
               </div>
               <div className="flex gap-2">
                  <button className="px-4 py-2 bg-[#2a2b3d] hover:bg-[#30363d] rounded text-xs font-medium border border-[#30363d] flex items-center gap-2"><Download size={14}/> Export Weights</button>
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-medium text-white flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"><Play size={14}/> Resume Training</button>
               </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-lg flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold mb-2">Current Epoch</span>
                  <span className="text-3xl font-mono text-emerald-400">1,240</span>
                  <div className="w-full bg-[#0a0a0f] h-1.5 rounded mt-3 overflow-hidden"><div className="w-[60%] h-full bg-emerald-500"></div></div>
               </div>
               <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-lg flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold mb-2">Reward Function Mean</span>
                  <span className="text-3xl font-mono text-white">+42.8</span>
                  <span className="text-xs text-green-400 mt-2 flex items-center gap-1">↑ 12% from last checkpoint</span>
               </div>
               <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-lg flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold mb-2">Loss (Huber)</span>
                  <span className="text-3xl font-mono text-red-400">0.014</span>
                  <span className="text-xs text-gray-500 mt-2">Converging nicely</span>
               </div>
            </div>

            {/* Chart Area Mock */}
            <div className="bg-[#141525] border border-[#2a2b3d] rounded-lg p-4 h-64 flex flex-col">
               <h3 className="text-sm font-bold text-gray-300 mb-4">Training Progress</h3>
               <div className="flex-1 border-l border-b border-[#2a2b3d] relative mx-4 mb-4">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                     {/* Reward Line */}
                     <path d="M0,80 Q20,60 40,50 T70,30 T100,10" fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                     {/* Loss Line */}
                     <path d="M0,20 Q20,30 40,70 T70,85 T100,90" fill="none" stroke="#f87171" strokeWidth="2" strokeDasharray="4,4" vectorEffect="non-scaling-stroke"/>
                  </svg>
                  <span className="absolute -left-8 bottom-0 text-[10px] text-gray-500">0</span>
                  <span className="absolute -left-10 top-0 text-[10px] text-gray-500">100</span>
               </div>
            </div>
            
            {/* Hyperparameters */}
            <div className="bg-[#141525] border border-[#2a2b3d] rounded-lg p-4">
               <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2"><Settings size={16}/> Hyperparameters</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1 bg-[#0a0a0f] p-2 rounded border border-[#2a2b3d]"><span className="text-[10px] text-gray-500 uppercase">Learning Rate</span><span className="text-xs font-mono">0.0003</span></div>
                  <div className="flex flex-col gap-1 bg-[#0a0a0f] p-2 rounded border border-[#2a2b3d]"><span className="text-[10px] text-gray-500 uppercase">Batch Size</span><span className="text-xs font-mono">256</span></div>
                  <div className="flex flex-col gap-1 bg-[#0a0a0f] p-2 rounded border border-[#2a2b3d]"><span className="text-[10px] text-gray-500 uppercase">Discount Factor (γ)</span><span className="text-xs font-mono">0.99</span></div>
                  <div className="flex flex-col gap-1 bg-[#0a0a0f] p-2 rounded border border-[#2a2b3d]"><span className="text-[10px] text-gray-500 uppercase">Algorithm</span><span className="text-xs font-mono text-emerald-400">PPO</span></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
`,
  'AdvancedSecuritySystem.tsx': `import React from 'react';
import { ShieldCheck, Lock, Key, AlertOctagon, Activity, Users, ShieldAlert, FileKey } from 'lucide-react';

export default function AdvancedSecuritySystem() {
  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      <div className="flex-1 flex flex-col">
         {/* Header */}
         <div className="h-16 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <ShieldCheck size={20} className="text-green-400" />
               </div>
               <div>
                  <h1 className="font-bold text-white text-sm">Security & Compliance Dashboard</h1>
                  <p className="text-[10px] text-gray-400 font-mono">System Status: SECURE | All encryption layers active</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right flex flex-col items-end">
                  <span className="text-xs text-gray-400">Active Sessions</span>
                  <span className="text-lg font-mono text-white font-bold">14,203</span>
               </div>
               <button className="px-4 py-2 bg-[#2a2b3d] hover:bg-[#30363d] rounded text-xs font-medium border border-[#30363d]">View Audit Logs</button>
            </div>
         </div>

         <div className="flex-1 p-6 grid grid-cols-3 gap-6 overflow-y-auto">
            {/* Core Protections */}
            <div className="col-span-2 flex flex-col gap-6">
               <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Lock size={16} className="text-blue-400"/> Core Infrastructure
               </h3>
               
               <div className="grid grid-cols-2 gap-4">
                  {/* Card 1 */}
                  <div className="bg-[#141525] border border-[#2a2b3d] rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                     <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-blue-500/10 rounded text-blue-400"><FileKey size={20}/></div>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] uppercase font-bold rounded">Active</span>
                     </div>
                     <h4 className="font-bold text-white text-sm mb-1">Data at Rest Encryption</h4>
                     <p className="text-xs text-gray-400 mb-3">AES-256-GCM encryption for all database volumes and asset storage.</p>
                     <div className="text-[10px] font-mono text-gray-500 flex justify-between border-t border-[#2a2b3d] pt-2">
                        <span>Key Rotation: 12 days left</span>
                        <span className="text-blue-400 cursor-pointer">Manage Keys &rarr;</span>
                     </div>
                  </div>
                  
                  {/* Card 2 */}
                  <div className="bg-[#141525] border border-[#2a2b3d] rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                     <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-purple-500/10 rounded text-purple-400"><Users size={20}/></div>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] uppercase font-bold rounded">Active</span>
                     </div>
                     <h4 className="font-bold text-white text-sm mb-1">Identity & Auth (IAM)</h4>
                     <p className="text-xs text-gray-400 mb-3">OAuth 2.0 / OIDC provider configuration with mandatory MFA for admins.</p>
                     <div className="text-[10px] font-mono text-gray-500 flex justify-between border-t border-[#2a2b3d] pt-2">
                        <span>Provider: Firebase Auth</span>
                        <span className="text-purple-400 cursor-pointer">Configure Policies &rarr;</span>
                     </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#141525] border border-[#2a2b3d] rounded-lg p-4 hover:border-red-500/50 transition-colors">
                     <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-red-500/10 rounded text-red-400"><ShieldAlert size={20}/></div>
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] uppercase font-bold rounded">Monitoring</span>
                     </div>
                     <h4 className="font-bold text-white text-sm mb-1">Anti-Cheat System</h4>
                     <p className="text-xs text-gray-400 mb-3">Client-side memory integrity checks and server-side heuristic analysis.</p>
                     <div className="text-[10px] font-mono text-gray-500 flex justify-between border-t border-[#2a2b3d] pt-2">
                        <span>Bans Today: 14</span>
                        <span className="text-red-400 cursor-pointer">View Reports &rarr;</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Live Alerts Panel */}
            <div className="col-span-1 bg-[#141525] border border-[#2a2b3d] rounded-lg flex flex-col h-[500px]">
               <div className="p-4 border-b border-[#2a2b3d] flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                     <Activity size={16} className="text-amber-500"/> Security Events
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Live</span>
               </div>
               <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
                  <div className="bg-[#0a0a0f] border border-amber-500/30 p-3 rounded flex gap-3 items-start">
                     <AlertOctagon size={16} className="text-amber-500 shrink-0 mt-0.5"/>
                     <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-amber-200">Failed Admin Login</span>
                        <span className="text-[10px] text-gray-400">Multiple failed attempts from IP 192.168.1.42. Account locked for 15 mins.</span>
                        <span className="text-[9px] text-gray-500 mt-1 font-mono">Just now</span>
                     </div>
                  </div>
                  <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-3 rounded flex gap-3 items-start">
                     <Key size={16} className="text-blue-400 shrink-0 mt-0.5"/>
                     <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-gray-300">API Key Rotated</span>
                        <span className="text-[10px] text-gray-400">Production environment key 'stripe_prod' automatically rotated.</span>
                        <span className="text-[9px] text-gray-500 mt-1 font-mono">2 hours ago</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
`,
  'AdvancedLocalizationSystem.tsx': `import React from 'react';
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
                           className={\`w-full h-full min-h-[32px] bg-transparent border \${row.status === 'missing' ? 'border-amber-500/50 bg-amber-500/5 focus:border-amber-500' : 'border-transparent hover:border-[#2a2b3d] focus:border-blue-500 focus:bg-[#0a0a0f]'} rounded p-2 text-white resize-none outline-none overflow-hidden\`}
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
`,
  'AdvancedAnalyticsTelemetry.tsx': `import React from 'react';
import { Activity, Users, MousePointerClick, TrendingUp, BarChart2, PieChart } from 'lucide-react';

export default function AdvancedAnalyticsTelemetry() {
  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0f] text-gray-200 font-sans overflow-y-auto">
      <div className="p-6 max-w-6xl mx-auto w-full flex flex-col gap-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2"><Activity className="text-blue-500"/> Live Game Telemetry</h1>
               <p className="text-sm text-gray-400">Real-time player behavior and performance metrics.</p>
            </div>
            <div className="flex gap-2 text-xs">
               <select className="bg-[#141525] border border-[#2a2b3d] rounded px-3 py-2 text-white outline-none">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
               </select>
            </div>
         </div>

         {/* KPIs */}
         <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-xl flex flex-col gap-2">
               <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase">Concurrent Players (CCU)</span>
                  <Users size={16}/>
               </div>
               <span className="text-3xl font-mono text-white">4,281</span>
               <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded w-max">+12% vs last hour</span>
            </div>
            <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-xl flex flex-col gap-2">
               <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase">Avg Session Length</span>
                  <Activity size={16}/>
               </div>
               <span className="text-3xl font-mono text-white">42m 15s</span>
               <span className="text-[10px] text-gray-500 font-bold bg-gray-500/10 px-2 py-0.5 rounded w-max">Stable</span>
            </div>
            <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-xl flex flex-col gap-2">
               <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase">Crash Free Sessions</span>
                  <TrendingUp size={16}/>
               </div>
               <span className="text-3xl font-mono text-emerald-400">99.4%</span>
               <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded w-max">Target: 99.0%</span>
            </div>
            <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-xl flex flex-col gap-2">
               <div className="flex justify-between items-center text-gray-400">
                  <span className="text-xs font-bold uppercase">Total Revenue (24h)</span>
                  <span className="font-bold text-yellow-500">$</span>
               </div>
               <span className="text-3xl font-mono text-white">$12,450</span>
               <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded w-max">+5.2% vs yesterday</span>
            </div>
         </div>

         {/* Charts Row */}
         <div className="grid grid-cols-2 gap-6">
            {/* Chart 1 */}
            <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-xl flex flex-col gap-4 h-80">
               <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2"><BarChart2 size={16}/> Daily Active Users (DAU)</h3>
               <div className="flex-1 relative border-l border-b border-[#2a2b3d] ml-4 mb-4">
                  <div className="absolute inset-0 flex items-end justify-between px-2 pt-4">
                     {/* Mock bars */}
                     {[40, 60, 45, 80, 95, 85, 100].map((h, i) => (
                        <div key={i} className="w-8 bg-blue-500/80 rounded-t hover:bg-blue-400 transition-colors" style={{height: \`\${h}%\`}}></div>
                     ))}
                  </div>
                  <div className="absolute -bottom-6 w-full flex justify-between text-[10px] text-gray-500 font-mono px-2">
                     <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
               </div>
            </div>

            {/* Funnel / Pie Chart */}
            <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-xl flex flex-col gap-4 h-80">
               <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2"><MousePointerClick size={16}/> Tutorial Completion Funnel</h3>
               <div className="flex-1 flex flex-col justify-center gap-2 px-8">
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-xs text-gray-400"><span>Started Tutorial</span> <span>100%</span></div>
                     <div className="w-full h-4 bg-[#2a2b3d] rounded-full overflow-hidden"><div className="w-full h-full bg-blue-500"></div></div>
                  </div>
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-xs text-gray-400"><span>Completed Combat Basics</span> <span>85%</span></div>
                     <div className="w-full h-4 bg-[#2a2b3d] rounded-full overflow-hidden"><div className="w-[85%] h-full bg-blue-400"></div></div>
                  </div>
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-xs text-gray-400"><span>Completed Inventory Mgmt</span> <span>72%</span></div>
                     <div className="w-full h-4 bg-[#2a2b3d] rounded-full overflow-hidden"><div className="w-[72%] h-full bg-blue-300"></div></div>
                  </div>
                  <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-xs text-gray-400"><span>Finished Tutorial</span> <span>68%</span></div>
                     <div className="w-full h-4 bg-[#2a2b3d] rounded-full overflow-hidden"><div className="w-[68%] h-full bg-green-500"></div></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
`,
  'AdvancedMarketplaceSystem.tsx': `import React from 'react';
import { ShoppingCart, PackageSearch, Tag, Star, Download, Search, Filter } from 'lucide-react';

export default function AdvancedMarketplaceSystem() {
  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      {/* Top Header */}
      <div className="h-16 border-b border-[#2a2b3d] bg-[#141525] flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
               <ShoppingCart size={20} />
            </div>
            <h1 className="font-bold text-white text-lg">Asset Store & Marketplace</h1>
         </div>
         <div className="flex items-center gap-4">
            <div className="relative w-72">
               <Search size={16} className="absolute left-3 top-2 text-gray-500" />
               <input type="text" placeholder="Search assets, plugins, materials..." className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:border-purple-500 outline-none transition-colors" />
            </div>
            <div className="flex items-center gap-2 bg-[#2a2b3d] px-3 py-1.5 rounded-full text-xs font-bold text-white cursor-pointer hover:bg-[#30363d]">
               <PackageSearch size={14}/> Library (42)
            </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Categories Sidebar */}
         <div className="w-56 border-r border-[#2a2b3d] bg-[#141525] p-4 flex flex-col gap-6 overflow-y-auto shrink-0">
            <div className="flex flex-col gap-2">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categories</h3>
               {['3D Models', 'Materials & FX', 'Audio', 'Scripts & Systems', 'UI Templates', 'Full Projects'].map((cat, i) => (
                  <div key={i} className={\`text-sm py-1.5 px-2 rounded cursor-pointer \${i === 0 ? 'bg-purple-600 text-white font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1b26]'}\`}>
                     {cat}
                  </div>
               ))}
            </div>
            <div className="h-px w-full bg-[#2a2b3d]"></div>
            <div className="flex flex-col gap-2">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Filter size={12}/> Filters</h3>
               <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input type="checkbox" className="rounded bg-[#0a0a0f] border-[#2a2b3d] text-purple-500 focus:ring-purple-500" /> Free Only
               </label>
               <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input type="checkbox" className="rounded bg-[#0a0a0f] border-[#2a2b3d] text-purple-500 focus:ring-purple-500" /> On Sale
               </label>
            </div>
         </div>

         {/* Main Storefront Grid */}
         <div className="flex-1 bg-[#0d1117] p-6 overflow-y-auto">
            <div className="flex justify-between items-end mb-6">
               <div>
                  <h2 className="text-xl font-bold text-white mb-1">Trending 3D Models</h2>
                  <p className="text-sm text-gray-400">High-quality assets to accelerate your development.</p>
               </div>
               <select className="bg-[#141525] border border-[#2a2b3d] rounded px-3 py-1.5 text-xs text-white outline-none">
                  <option>Sort: Popular</option>
                  <option>Sort: Newest</option>
                  <option>Sort: Price (Low to High)</option>
               </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {/* Asset Card 1 */}
               <div className="bg-[#141525] border border-[#2a2b3d] rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] group flex flex-col">
                  <div className="h-40 bg-gray-800 relative overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Asset" />
                     <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shadow">Featured</div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                     <h3 className="font-bold text-white text-sm mb-1 truncate">Sci-Fi Modular Environment Kit</h3>
                     <p className="text-xs text-gray-400 mb-3 line-clamp-2">Over 200 high-quality modular pieces to build stunning sci-fi interiors.</p>
                     
                     <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                           <Star size={12} fill="currentColor"/> 4.9 <span className="text-gray-500 font-normal">(128)</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-xs text-gray-500 line-through">$49.99</span>
                           <span className="font-bold text-white text-sm">$29.99</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Asset Card 2 */}
               <div className="bg-[#141525] border border-[#2a2b3d] rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] group flex flex-col">
                  <div className="h-40 bg-gray-800 relative overflow-hidden">
                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-900 to-black text-gray-500"><Tag size={40}/></div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                     <h3 className="font-bold text-white text-sm mb-1 truncate">Fantasy Stylized Trees Vol 1</h3>
                     <p className="text-xs text-gray-400 mb-3 line-clamp-2">Optimized foliage for mobile and PC stylized games.</p>
                     <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                           <Star size={12} fill="currentColor"/> 4.7 <span className="text-gray-500 font-normal">(42)</span>
                        </div>
                        <span className="font-bold text-green-400 text-sm uppercase">Free</span>
                     </div>
                  </div>
               </div>

               {/* Asset Card 3 (Purchased) */}
               <div className="bg-[#1a1b26] border border-blue-500/30 rounded-xl overflow-hidden group flex flex-col ring-1 ring-blue-500/10">
                  <div className="h-40 bg-gray-800 relative overflow-hidden opacity-80">
                     <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale mix-blend-luminosity" alt="Asset" />
                     <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"><Check size={14}/> Owned</div>
                     </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                     <h3 className="font-bold text-white text-sm mb-1 truncate">Low Poly Vehicles Pack</h3>
                     <p className="text-xs text-gray-400 mb-4 line-clamp-1">30+ rigged low poly cars.</p>
                     <button className="w-full mt-auto py-1.5 bg-[#2a2b3d] hover:bg-[#30363d] text-white text-xs font-medium rounded flex items-center justify-center gap-2"><Download size={14}/> Import to Project</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
`
};

for (const [filename, content] of Object.entries(components)) {
  fs.writeFileSync(path.join(componentsDir, filename), content);
  console.log(`Updated ${filename}`);
}
