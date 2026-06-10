import React, { useState } from 'react';
import { GitBranch, Plus, Move, MousePointer2, ZoomIn, ZoomOut, Play, Copy, Trash2, Hexagon, Maximize, Target, Link2, MessageSquare, Save, FolderTree, Type } from 'lucide-react';

export default function BranchingDialogueWeaver() {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex flex-col h-full bg-[#111] text-white font-sans overflow-hidden">
      
      {/* Top Protocol Bar: Narrative Engine */}
      <div className="px-4 py-2 border-b border-[#222] bg-[#1a1a20] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#bc8cff] to-[#58a6ff] border border-[#bc8cff]/50 rounded flex items-center justify-center">
            <FolderTree size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
              Branching Dialogue Weaver & State Trees
            </h2>
            <p className="text-[#888] text-[9px] font-mono">NODE-BASED DIALOGUE • VARIABLE CHECKS • CINEMATIC CUES</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
           <button className="bg-[#2a2a35] hover:bg-[#3a3a45] border border-[#444] px-3 py-1 flex items-center gap-2 text-xs font-bold rounded text-white transition"><Play size={14}/> Test Play Sequence</button>
           <button className="bg-[#bc8cff] hover:bg-[#a671ef] text-black px-4 py-1 flex items-center gap-2 text-xs font-bold rounded shadow-lg shadow-[#bc8cff]/20 transition"><Save size={14}/> Compile Dialogue Bank</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Left Side: Story Explorer */}
         <div className="w-[240px] bg-[#15151a] border-r border-[#222] flex flex-col shrink-0">
            <div className="p-3 border-b border-[#222] flex justify-between items-center">
               <span className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Story Files</span>
               <button className="text-[#888] hover:text-white"><Plus size={14}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar text-[11px]">
               <div className="p-2 border border-[#333] bg-[#222] rounded flex items-center gap-2 cursor-pointer font-bold text-[#bc8cff]">
                  <MessageSquare size={12}/> Act1_Village_Elder
               </div>
               <div className="p-2 border border-transparent hover:bg-[#222] rounded flex items-center gap-2 cursor-pointer text-[#aaa] hover:text-white transition">
                  <MessageSquare size={12}/> Act1_Blacksmith_Shop
               </div>
               <div className="p-2 border border-transparent hover:bg-[#222] rounded flex items-center gap-2 cursor-pointer text-[#aaa] hover:text-white transition">
                  <MessageSquare size={12}/> Act2_King_Audience
               </div>
               
               <div className="pt-4 pb-2 text-[10px] uppercase font-bold text-[#666] tracking-widest flex items-center gap-1 border-b border-[#222] mb-2">Global Variables (State)</div>
               
               <div className="flex justify-between items-center p-1 px-2 hover:bg-[#222] rounded cursor-pointer group">
                  <span className="text-[#e3b341] font-mono text-[10px]">Has_Iron_Sword</span>
                  <span className="text-white font-mono text-[10px]">False</span>
               </div>
               <div className="flex justify-between items-center p-1 px-2 hover:bg-[#222] rounded cursor-pointer group">
                  <span className="text-[#e3b341] font-mono text-[10px]">Elder_Trust_Level</span>
                  <span className="text-white font-mono text-[10px]">45</span>
               </div>
               <div className="flex justify-between items-center p-1 px-2 hover:bg-[#222] rounded cursor-pointer group">
                  <span className="text-[#e3b341] font-mono text-[10px]">Visited_Cave</span>
                  <span className="text-white font-mono text-[10px]">True</span>
               </div>

            </div>
         </div>

         {/* Center Canvas */}
         <div className="flex-1 bg-[#1a1a1e] relative overflow-hidden flex flex-col">
            {/* Control Strip */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center bg-[#2a2a35] border border-[#444] rounded-full px-2 py-1 z-10 shadow-lg">
               <button className="w-8 h-8 flex items-center justify-center text-[#aaa] hover:text-white transition"><MousePointer2 size={16}/></button>
               <button className="w-8 h-8 flex items-center justify-center text-[#58a6ff] transition"><Move size={16}/></button>
               <div className="w-[1px] h-4 bg-[#444] mx-1"></div>
               <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="w-8 h-8 flex items-center justify-center text-[#aaa] hover:text-white transition"><ZoomOut size={16}/></button>
               <span className="text-[10px] font-mono text-white w-10 text-center">{Math.round(zoom * 100)}%</span>
               <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="w-8 h-8 flex items-center justify-center text-[#aaa] hover:text-white transition"><ZoomIn size={16}/></button>
               <button className="w-8 h-8 flex items-center justify-center text-[#aaa] hover:text-white transition"><Maximize size={16}/></button>
            </div>

            <div className="absolute top-2 right-2 flex bg-[#2a2a35] border border-[#444] rounded-md overflow-hidden z-10 text-[11px] font-bold">
               <button className="px-3 py-1.5 border-r border-[#444] text-black bg-[#bc8cff] flex items-center gap-1"><Plus size={12}/> Dialogue</button>
               <button className="px-3 py-1.5 border-r border-[#444] text-[#aaa] hover:text-white hover:bg-[#3fac50] hover:text-black flex items-center gap-1"><Plus size={12}/> Condition Check</button>
               <button className="px-3 py-1.5 text-[#aaa] hover:text-white hover:bg-[#58a6ff] hover:text-black flex items-center gap-1"><Plus size={12}/> Trigger Event</button>
            </div>

            {/* Infinite Node Canvas */}
            <div className="flex-1 w-full h-full relative" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #333 1px, transparent 0)`, backgroundSize: '40px 40px', backgroundPosition: 'center' }}>
               
               {/* Viewport Transform Wrapper */}
               <div className="absolute inset-0 origin-center" style={{ transform: `scale(${zoom})` }}>
                  
                  {/* SVG Wires Layer */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                     <path d="M 300 200 C 400 200, 400 150, 500 150" fill="none" stroke="#666" strokeWidth="2" />
                     <path d="M 300 200 C 400 200, 400 300, 500 300" fill="none" stroke="#666" strokeWidth="2" />
                     <path d="M 750 150 C 800 150, 800 150, 900 150" fill="none" stroke="#bc8cff" strokeWidth="2" />
                  </svg>

                  {/* Root Node */}
                  <div className="absolute top-[170px] left-[50px] w-[250px] bg-[#111] border border-[#3fb950] rounded-lg shadow-[0_0_15px_rgba(63,185,80,0.1)] overflow-hidden">
                      <div className="bg-[#3fb950]/20 px-3 py-1 flex justify-between items-center border-b border-[#3fb950]/50">
                         <span className="text-[10px] font-bold text-[#3fb950] uppercase">ENTRY POINT</span>
                      </div>
                      <div className="p-3 text-[12px] bg-[#1a1a20]">
                         <p className="text-white leading-tight">"Greetings traveler. Have you dealt with the wolves near the old mine?"</p>
                      </div>
                      <div className="bg-[#111] p-2 space-y-1">
                         <div className="flex justify-between items-center text-[10px] bg-[#222] p-1.5 rounded relative cursor-pointer hover:bg-[#333] border border-[#444]">
                            <span className="text-[#aaa]">I have the pelts right here.</span>
                            <div className="w-3 h-3 bg-[#111] border border-[#666] rounded-full absolute -right-4 hover:border-white"></div>
                         </div>
                         <div className="flex justify-between items-center text-[10px] bg-[#222] p-1.5 rounded relative cursor-pointer hover:bg-[#333] border border-[#444]">
                            <span className="text-[#aaa]">Not yet.</span>
                            <div className="w-3 h-3 bg-[#111] border border-[#666] rounded-full absolute -right-4 hover:border-white"></div>
                         </div>
                      </div>
                  </div>

                  {/* Branch 1 Check */}
                  <div className="absolute top-[100px] left-[500px] w-[250px] bg-[#111] border border-[#e3b341] rounded-lg shadow-lg overflow-hidden">
                      <div className="bg-[#e3b341]/20 px-3 py-1 flex justify-between items-center border-b border-[#e3b341]/50">
                         <span className="text-[10px] font-bold text-[#e3b341] flex items-center gap-1"><Hexagon size={12}/> CONDITION</span>
                         <div className="w-3 h-3 bg-[#111] border border-[#e3b341] rounded-full absolute -left-1.5"></div>
                      </div>
                      <div className="p-3 text-[11px] font-mono text-[#e3b341] bg-[#1a1a20] border-b border-[#333] text-center">
                         Player_ItemCount("Wolf_Pelt") &gt;= 5
                      </div>
                      <div className="bg-[#111] p-2 space-y-1">
                         <div className="flex justify-between items-center text-[10px] bg-[#222] p-1.5 rounded relative border border-[#444]">
                            <span className="text-[#3fb950] font-bold">TRUE</span>
                            <div className="w-3 h-3 bg-[#111] border border-[#bc8cff] rounded-full absolute -right-4"></div>
                         </div>
                         <div className="flex justify-between items-center text-[10px] bg-[#222] p-1.5 rounded relative border border-[#444]">
                            <span className="text-[#f85149] font-bold">FALSE</span>
                            <div className="w-3 h-3 bg-[#111] border border-[#666] rounded-full absolute -right-4"></div>
                         </div>
                      </div>
                  </div>

                  {/* Branch 2 Dialogue */}
                  <div className="absolute top-[280px] left-[500px] w-[250px] bg-[#111] border border-[#bc8cff] rounded-lg shadow-[0_0_10px_rgba(188,140,255,0.1)] overflow-hidden">
                      <div className="bg-[#bc8cff]/20 px-3 py-1 flex justify-between items-center border-b border-[#bc8cff]/50">
                         <span className="text-[10px] font-bold text-[#bc8cff] uppercase">Elder NPC</span>
                         <div className="w-3 h-3 bg-[#111] border border-[#bc8cff] rounded-full absolute -left-1.5"></div>
                      </div>
                      <div className="p-3 text-[12px] bg-[#1a1a20]">
                         <p className="text-white leading-tight">"Come back when you have them. It's too dangerous out there."</p>
                      </div>
                  </div>

                  {/* Success Result Node */}
                  <div className="absolute top-[100px] left-[900px] w-[250px] bg-[#111] border border-[#58a6ff] rounded-lg shadow-[0_0_15px_rgba(88,166,255,0.2)] overflow-hidden ring-2 ring-[#white]/20">
                      <div className="bg-[#58a6ff]/20 px-3 py-1 flex justify-between items-center border-b border-[#58a6ff]/50">
                         <span className="text-[10px] font-bold text-[#58a6ff] uppercase flex items-center gap-1"><Target size={12}/> SCRIPT EVENT</span>
                         <div className="w-3 h-3 bg-[#111] border border-[#58a6ff] rounded-full absolute -left-1.5"></div>
                      </div>
                      <div className="p-3 text-[12px] bg-[#1a1a20]">
                         <p className="text-white leading-tight mb-2">"Excellent work. Here is your reward."</p>
                         <div className="space-y-1">
                            <div className="text-[9px] font-mono bg-[#222] text-[#e3b341] p-1 rounded border border-[#444]">+ Call RemoveItem("Wolf_Pelt", 5)</div>
                            <div className="text-[9px] font-mono bg-[#222] text-[#3fb950] p-1 rounded border border-[#444]">+ Call AddCurrency(150)</div>
                            <div className="text-[9px] font-mono bg-[#222] text-[#bc8cff] p-1 rounded border border-[#444]">+ Cinematic_Play("Act1_Reward_Cam")</div>
                         </div>
                      </div>
                  </div>

               </div>
            </div>
         </div>

         {/* Right Inspector */}
         <div className="w-[300px] border-l border-[#222] bg-[#15151a] flex flex-col shrink-0">
             <div className="p-4 border-b border-[#222]">
                <h3 className="text-[12px] font-black uppercase text-white flex items-center gap-2"><Target size={14} className="text-[#58a6ff]"/> Node Inspector</h3>
             </div>
             
             <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                
                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-[#888]">Node Type</label>
                   <select className="w-full bg-[#111] border border-[#333] text-white rounded p-1.5 text-[11px] outline-none">
                      <option>Script Event / Reward</option>
                      <option>NPC Dialogue text</option>
                      <option>Player Choice</option>
                      <option>Condition Branch</option>
                   </select>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-[#888]">Speaker Actor</label>
                   <select className="w-full bg-[#111] border border-[#333] text-white rounded p-1.5 text-[11px] outline-none">
                      <option>NPC_Village_Elder</option>
                      <option>Player</option>
                      <option>SystemNarrator</option>
                   </select>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-[#888] flex items-center gap-1"><Type size={12}/> Dialogue Text</label>
                   <textarea className="w-full h-24 bg-[#111] border border-[#444] rounded p-2 text-[12px] text-white outline-none focus:border-[#58a6ff] resize-none" defaultValue={"\"Excellent work. Here is your reward.\""} />
                </div>

                <div className="space-y-2 pt-2 border-t border-[#333]">
                   <label className="text-[10px] font-bold uppercase text-[#e3b341] flex items-center gap-1"><Play size={12}/> On_Enter() Execution Array</label>
                   
                   <div className="bg-[#111] border border-[#444] rounded p-2 space-y-2">
                       <div className="flex items-center gap-2 bg-[#222] border border-[#333] p-1.5 rounded">
                          <span className="text-[9px] font-mono text-[#f85149]">Call</span>
                          <input type="text" className="bg-transparent text-[10px] text-white flex-1 outline-none font-mono" defaultValue="RemoveItem" />
                          <span className="text-[9px] font-mono text-[#888]">(</span>
                          <input type="text" className="w-16 bg-black border border-[#444] text-[9px] text-[#e3b341] px-1 font-mono rounded" defaultValue='"Wolf_Pelt"' />
                          <span className="text-[9px] font-mono text-[#888]">,</span>
                          <input type="text" className="w-8 bg-black border border-[#444] text-[9px] text-[#58a6ff] px-1 font-mono rounded" defaultValue="5" />
                          <span className="text-[9px] font-mono text-[#888]">)</span>
                          <button className="text-[#f85149] hover:bg-[#333] rounded ml-1"><Trash2 size={12}/></button>
                       </div>
                       
                       <div className="flex items-center gap-2 bg-[#222] border border-[#333] p-1.5 rounded">
                          <span className="text-[9px] font-mono text-[#f85149]">Call</span>
                          <input type="text" className="bg-transparent text-[10px] text-white flex-1 outline-none font-mono" defaultValue="AddCurrency" />
                          <span className="text-[9px] font-mono text-[#888]">(</span>
                          <input type="text" className="w-8 bg-black border border-[#444] text-[9px] text-[#58a6ff] px-1 font-mono rounded" defaultValue="150" />
                          <span className="text-[9px] font-mono text-[#888]">)</span>
                          <button className="text-[#f85149] hover:bg-[#333] rounded ml-1"><Trash2 size={12}/></button>
                       </div>
                       
                       <div className="flex items-center gap-2 bg-[#222] border border-[#333] p-1.5 rounded">
                          <span className="text-[9px] font-mono text-[#f85149]">Call</span>
                          <input type="text" className="bg-transparent text-[10px] text-white flex-1 outline-none font-mono" defaultValue="Cinematic_Play" />
                          <span className="text-[9px] font-mono text-[#888]">(</span>
                          <input type="text" className="w-20 bg-black border border-[#444] text-[9px] text-[#e3b341] px-1 font-mono rounded" defaultValue='"Act1_Reward_Cam"' />
                          <span className="text-[9px] font-mono text-[#888]">)</span>
                          <button className="text-[#f85149] hover:bg-[#333] rounded ml-1"><Trash2 size={12}/></button>
                       </div>

                       <button className="w-full py-1 border border-dashed border-[#555] text-[10px] text-[#aaa] hover:text-white rounded uppercase tracking-widest hover:border-[#aaa] transition">
                          + Add Action Hook
                       </button>
                   </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#333]">
                    <label className="text-[10px] font-bold uppercase text-[#bc8cff] flex items-center gap-1"><Link2 size={12}/> Localization ID</label>
                    <input type="text" className="w-full bg-[#111] border border-[#444] text-[#888] rounded p-1.5 text-[10px] font-mono outline-none" defaultValue="str_act1_elder_reward_01" readOnly />
                </div>
             </div>
         </div>

      </div>
    </div>
  );
}
