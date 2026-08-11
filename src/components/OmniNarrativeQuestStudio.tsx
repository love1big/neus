import React, { useState } from 'react';
import { 
  BookOpen, GitBranch, MessageSquare, Film, Settings, Map, Globe, Languages, Users, Save, Play, Sword, Split, Shield, Text} from 'lucide-react';

export default function OmniNarrativeQuestStudio() {
  const [activeTab, setActiveTab] = useState('Graph'); // Graph, Screenplay, Quests, Lore, I18n

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0E0E10] text-[#ccc] font-sans text-xs overflow-hidden select-none">
      
      {/* ELITE TOP NAVBAR */}
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1.5 rounded border border-[#333] shadow-inner items-center gap-2">
                   <BookOpen size={18} className="text-[#bc8cff]"/>
                   <span className="text-white font-black tracking-widest text-[12px] uppercase" style={{textShadow: '0 0 10px rgba(188,140,255,0.5)'}}>Omni Narrative & Quest Studio</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                 <button className="px-5 py-1.5 bg-[#bc8cff]/10 text-[#bc8cff] font-black rounded shadow-[0_0_15px_rgba(188,140,255,0.2)] hover:bg-[#bc8cff]/20 transition flex items-center gap-2 text-[11px] uppercase tracking-widest border border-[#bc8cff]/50"><Play size={12}/> Playtest Flow</button>
            </div>
         </div>

         <div className="flex px-2 bg-[#0a0a0a] border-t border-[#222]">
            <ModuleTab active={activeTab === 'Graph'} onClick={() => setActiveTab('Graph')} icon={<GitBranch size={12}/>} label="1. Story Branching Graph" color="text-[#ff7b72]"/>
            <ModuleTab active={activeTab === 'Screenplay'} onClick={() => setActiveTab('Screenplay')} icon={<Film size={12}/>} label="2. Cinematic Screenplay" color="text-[#58a6ff]"/>
            <ModuleTab active={activeTab === 'Quests'} onClick={() => setActiveTab('Quests')} icon={<Shield size={12}/>} label="3. Quest Director" color="text-[#3fb950]"/>
            <ModuleTab active={activeTab === 'Lore'} onClick={() => setActiveTab('Lore')} icon={<Globe size={12}/>} label="4. World Bible (Lore)" color="text-[#e3b341]"/>
            <ModuleTab active={activeTab === 'I18n'} onClick={() => setActiveTab('I18n')} icon={<Languages size={12}/>} label="5. I18n & LocDB" color="text-[#bc8cff]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
         
         {/* SIDEBAR PROPERTIES */}
         <div className="w-[300px] bg-[#111] border-r border-[#222] flex flex-col z-20 shrink-0">
             <div className="p-3 border-b border-[#222] bg-[#1a1a1a]">
                   <h3 className="text-[#888] font-bold text-[10px] tracking-widest uppercase mb-2">Editor Context</h3>
                   <input type="text" placeholder="Search narrative nodes..." className="w-full bg-[#0a0a0a] border border-[#333] p-1.5 rounded text-[10px] outline-none" />
             </div>
             <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-4">
                 
                 {activeTab === 'Graph' && (
                    <>
                       <PropertyGroup title="Node Properties: QST_01_Intro">
                          <SliderRow label="Required Faction Rep" value="> 50" color="bg-[#bc8cff]"/>
                          <div className="text-[10px] text-[#888] font-mono mt-3 bg-[#050505] p-2 rounded border border-[#333]">
                              <span className="text-[#58a6ff]">OnEnter()</span> {'{'}<br/>
                              &nbsp;&nbsp;UnlockCodex('Elven History');<br/>
                              {'}'}
                          </div>
                       </PropertyGroup>
                       <PropertyGroup title="Branch Conditions">
                           <div className="flex items-center gap-2 mb-2 p-2 bg-[#1a1a1a] rounded border border-[#333] border-l-[3px] border-l-[#3fb950]">
                              <span className="text-[#ccc] text-[10px] font-bold">Choice 1: Accept</span>
                           </div>
                           <div className="flex items-center gap-2 p-2 bg-[#1a1a1a] rounded border border-[#333] border-l-[3px] border-l-[#f85149]">
                              <span className="text-[#ccc] text-[10px] font-bold">Choice 2: Refuse (Combat)</span>
                           </div>
                       </PropertyGroup>
                    </>
                 )}

                 {activeTab === 'Quests' && (
                    <>
                      <PropertyGroup title="Quest Objectives">
                         <div className="bg-[#1a1a1a] p-2 rounded border border-[#333] mb-2 border-l-[3px] border-l-[#3fb950]">
                            <span className="text-[#ccc] text-[10px] font-bold block">1. Collect Iron Ore (0/10)</span>
                            <span className="text-[#888] text-[9px] font-mono">Triggers: ItemAdded('IronOre')</span>
                         </div>
                         <div className="bg-[#1a1a1a] p-2 rounded border border-[#333] border-l-[3px] border-l-[#f85149]">
                            <span className="text-[#ccc] text-[10px] font-bold block">2. Slay the Goblin King (0/1)</span>
                            <span className="text-[#888] text-[9px] font-mono">Triggers: EntityDeath('GoblinKing')</span>
                         </div>
                      </PropertyGroup>
                      <PropertyGroup title="Rewards">
                         <div className="flex items-center justify-between text-[10px] font-bold text-[#e3b341] p-1">
                            <span>Gold</span> <span>+ 5,000</span>
                         </div>
                         <div className="flex items-center justify-between text-[10px] font-bold text-[#58a6ff] p-1">
                            <span>EXP</span> <span>+ 14,500</span>
                         </div>
                         <div className="flex items-center justify-between text-[10px] font-bold text-[#bc8cff] p-1">
                            <span>Item</span> <span>Sword of Light</span>
                         </div>
                      </PropertyGroup>
                    </>
                 )}

             </div>
         </div>

         {/* MAIN VIEWPORT */}
         <div className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col">
             
             {activeTab === 'Graph' && (
                <div className="absolute inset-0 bg-[#0a0a0c]" style={{ backgroundImage: 'radial-gradient(circle, #222 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                   {/* Fake Narrative Node Graph */}
                   <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#444] stroke-[2px] fill-none">
                       <path d="M 150 150 C 250 150, 250 100, 350 100" markerEnd="url(#arrow)" />
                       <path d="M 150 150 C 250 150, 250 250, 350 250" markerEnd="url(#arrow)" />
                       <path d="M 500 100 C 600 100, 600 150, 700 150" markerEnd="url(#arrow)" />
                       <defs>
                           <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                             <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                           </marker>
                       </defs>
                   </svg>
                   
                   <GraphNode x="20" y="120" title="Start Dialog" color="#58a6ff" />
                   <GraphNode x="350" y="70" title="Ask about Sword" color="#3fb950" />
                   <GraphNode x="350" y="220" title="Attack NPC" color="#f85149" />
                   <GraphNode x="700" y="120" title="Give Quest" color="#e3b341" />
                </div>
             )}

             {activeTab === 'Screenplay' && (
                <div className="p-10 flex-1 overflow-y-auto bg-[#fff] m-10 rounded shadow-2xl mx-auto w-full max-w-3xl text-black font-serif text-[14px] leading-relaxed">
                   {/* Screenplay Formatting mock */}
                   <div className="text-center mb-8 uppercase font-bold tracking-widest">Act 1: The Awakening</div>
                   
                   <div className="uppercase font-bold mb-2">INT. TAVERN - NIGHT</div>
                   <div className="mb-4">The air is thick with smoke. Kaelen sits at the corner, nursing a lukewarm mead.</div>
                   
                   <div className="text-center font-bold uppercase w-64 mx-auto mb-1">Kaelen</div>
                   <div className="text-center w-96 mx-auto mb-4 italic">(grumbling)</div>
                   <div className="text-center w-96 mx-auto mb-6">I told them not to dig too deep. But they never listen.</div>
                   
                   <div className="uppercase font-bold mb-2">EXT. VILLAGE SQUARE - CONTINUOUS</div>
                   <div className="mb-4">A loud explosion shatters the window. Screams echo from outside. Kaelen grips the hilt of his sword.</div>
                </div>
             )}

             {activeTab === 'Quests' && (
                <div className="p-8 flex flex-col gap-4">
                   <div className="text-[#888] font-bold text-[12px] tracking-widest uppercase mb-4">Quest Database</div>
                   
                   <div className="bg-[#111] border border-[#333] p-4 rounded flex justify-between items-center hover:border-[#bc8cff] cursor-pointer transition">
                      <div>
                         <span className="text-white font-bold text-lg block">QST_Main_01: The Hero's Call</span>
                         <span className="text-[#888] text-[10px]">Zone: Elwynn Fields | Level: 1-5 | Type: Main Story</span>
                      </div>
                      <span className="bg-[#3fb950] text-[#000] px-3 py-1 font-bold text-[10px] rounded uppercase">Validated</span>
                   </div>

                   <div className="bg-[#111] border border-[#333] p-4 rounded flex justify-between items-center hover:border-[#bc8cff] cursor-pointer transition">
                      <div>
                         <span className="text-white font-bold text-lg block">QST_Side_GoblinCamp</span>
                         <span className="text-[#888] text-[10px]">Zone: Darkwood | Level: 5-8 | Type: Side Quest</span>
                      </div>
                      <span className="bg-[#e3b341] text-[#000] px-3 py-1 font-bold text-[10px] rounded uppercase">Draft</span>
                   </div>
                </div>
             )}

             {activeTab === 'Lore' && (
                <div className="flex h-full">
                   <div className="w-[250px] border-r border-[#222] bg-[#111] flex flex-col">
                      <div className="p-3 text-[#ccc] font-bold border-b border-[#222]">Categories</div>
                      <div className="p-2 text-[#fff] bg-[#1a1a1a] cursor-pointer">Regions</div>
                      <div className="p-2 text-[#888] hover:text-[#fff] cursor-pointer">Factions</div>
                      <div className="p-2 text-[#888] hover:text-[#fff] cursor-pointer">Bestiary</div>
                      <div className="p-2 text-[#888] hover:text-[#fff] cursor-pointer">Timeline</div>
                   </div>
                   <div className="flex-1 p-8 overflow-y-auto">
                      <h1 className="text-3xl font-black text-white mb-2">Eldoria</h1>
                      <div className="text-[#bc8cff] text-[12px] uppercase tracking-widest font-bold mb-6">Capital Region • Controlled by the Lightbringers</div>
                      <p className="text-[#ccc] text-[14px] leading-relaxed max-w-2xl">
                         Eldoria is the sprawling capital of the human empire, known for its towering white spires and the Great Academy of Arcane Arts. Founded in the First Age after the Dragon Wars, it stands as a testament to humanity's resilience.
                      </p>
                      <div className="mt-6 w-full max-w-2xl h-48 bg-[#1a1a1a] border border-[#333] rounded flex items-center justify-center text-[#555] uppercase font-bold tracking-widest">
                         [ Map / Illustration Placeholder ]
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'I18n' && (
                <div className="p-4">
                   <div className="flex justify-between items-center mb-4">
                      <div className="text-[#888] font-bold text-[12px] tracking-widest uppercase mb-4">Localization Master Database</div>
                      <div className="flex gap-2">
                         <span className="bg-[#111] px-3 py-1 border border-[#333] rounded text-white font-bold">English (Base)</span>
                         <span className="bg-[#2a4365] px-3 py-1 border border-[#3182ce] rounded text-white font-bold">French (50%)</span>
                         <span className="bg-[#276749] px-3 py-1 border border-[#38a169] rounded text-white font-bold">Japanese (98%)</span>
                      </div>
                   </div>

                   <table className="w-full text-left border-collapse bg-[#111] rounded overflow-hidden">
                      <thead className="bg-[#1a1a1a]">
                         <tr className="border-b border-[#333] text-[#888]">
                            <th className="p-3 text-[10px] uppercase">String ID</th>
                            <th className="p-3 text-[10px] uppercase">Context</th>
                            <th className="p-3 text-[10px] uppercase">English (Source)</th>
                            <th className="p-3 text-[10px] uppercase text-[#3182ce]">French</th>
                         </tr>
                      </thead>
                      <tbody>
                         <tr className="border-b border-[#222] hover:bg-[#1a1a1a]">
                            <td className="p-3 text-[#58a6ff] font-mono">UI_BTN_START</td>
                            <td className="p-3 text-[#888]">Main Menu</td>
                            <td className="p-3 text-white">Start Game</td>
                            <td className="p-3 text-[#ccc] border-l border-[#222]">Commencer</td>
                         </tr>
                         <tr className="border-b border-[#222] hover:bg-[#1a1a1a]">
                            <td className="p-3 text-[#58a6ff] font-mono">QST_01_OBJ_1</td>
                            <td className="p-3 text-[#888]">Quest Tracker</td>
                            <td className="p-3 text-white">Defeat the invasion!</td>
                            <td className="p-3 text-[#f85149] border-l border-[#222] italic">Missing Translation</td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             )}

         </div>

      </div>
    </div>
  );
}

// ------ STYLED COMPONENT HELPERS ------ //

function ModuleTab({ active, onClick, icon, label, color }) {
   return (
      <div 
         onClick={onClick}
         className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer border-t-[2px] transition-colors
         ${active ? `bg-[#111] text-white ${color.replace('text-', 'border-')}` : 'border-transparent text-[#888] hover:bg-[#1a1a1a] hover:text-[#ccc]'}`}
      >
         <span className={active ? color : 'opacity-70'}>{icon}</span> {label}
      </div>
   );
}

function PropertyGroup({ title, children }) {
   return (
      <div className="mb-4">
         <div className="text-[#888] font-bold text-[9px] uppercase tracking-wider mb-2 border-b border-[#2d2d2d] pb-1">{title}</div>
         <div className="flex flex-col gap-2">
            {children}
         </div>
      </div>
   );
}

function SliderRow({ label, value, color }) {
   return (
      <div className="flex flex-col gap-1">
         <div className="flex justify-between items-end">
            <span className="text-[#888] text-[9px] uppercase">{label}</span>
            <span className="text-white text-[10px] font-mono">{value}</span>
         </div>
         <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden border border-[#333]">
            <div className={`h-full ${color} w-[60%]`}></div>
         </div>
      </div>
   );
}

function GraphNode({ x, y, title, color }) {
   return (
      <div className="absolute bg-[#111] border-[2px] rounded-lg shadow-lg flex flex-col justify-center w-[160px] p-2 cursor-pointer transition-colors z-10" style={{ left: `${x}px`, top: `${y}px`, borderColor: color }}>
         <div className="font-bold text-[10px] uppercase tracking-wider text-white truncate">{title}</div>
         <div className="text-[#888] text-[8px] mt-1 font-mono">ID: N_{Math.floor(Math.random()*1000)}</div>
      </div>
   );
}
