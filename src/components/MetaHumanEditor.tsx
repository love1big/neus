import React, { useState } from 'react';
import { UserSquare, Settings, Play, Save, Box, Layers, Scissors, Move3D, Zap, Bone, Hand, Camera, Ruler, Smile} from 'lucide-react';

export default function MetaHumanEditor() {
  const [activeTab, setActiveTab] = useState('Face');
  const tabs = ['Face', 'Body', 'Hair', 'Clothing', 'Animation'];
  
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#58a6ff]/10 rounded text-[#58a6ff]"><UserSquare size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">MetaHuman Configurator</h2>
              <p className="text-[10px] text-[#8b949e]">Photorealistic Digital Humans, Shape Keys, & Rig Control</p>
            </div>
         </div>
         <div className="flex gap-2 text-[11px] font-bold">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors"><Camera size={12}/> Studio Cam</button>
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors text-[#e3b341]"><Play size={12}/> Run Retarget</button>
            <button className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded flex items-center gap-2 transition-colors"><Save size={12}/> Export Rig</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Categories */}
        <div className="w-16 border-r border-[#30363d] bg-[#161b22] flex flex-col items-center py-4 gap-4 shrink-0 z-10">
           <button onClick={() => setActiveTab('Face')} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activeTab==='Face'?'bg-[#58a6ff]/20 text-[#58a6ff]':'text-[#8b949e] hover:bg-[#0d1117] hover:text-[#c9d1d9]'}`} title="Face"><Smile size={20}/></button>
           <button onClick={() => setActiveTab('Body')} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activeTab==='Body'?'bg-[#58a6ff]/20 text-[#58a6ff]':'text-[#8b949e] hover:bg-[#0d1117] hover:text-[#c9d1d9]'}`} title="Body Proportions"><Ruler size={20}/></button>
           <button onClick={() => setActiveTab('Hair')} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activeTab==='Hair'?'bg-[#58a6ff]/20 text-[#58a6ff]':'text-[#8b949e] hover:bg-[#0d1117] hover:text-[#c9d1d9]'}`} title="Hair & Groom"><Scissors size={20}/></button>
           <button onClick={() => setActiveTab('Clothing')} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activeTab==='Clothing'?'bg-[#58a6ff]/20 text-[#58a6ff]':'text-[#8b949e] hover:bg-[#0d1117] hover:text-[#c9d1d9]'}`} title="Clothing / Apparel"><Layers size={20}/></button>
           <div className="w-8 h-px bg-[#30363d] my-2"></div>
           <button onClick={() => setActiveTab('Animation')} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${activeTab==='Animation'?'bg-[#e3b341]/20 text-[#e3b341]':'text-[#8b949e] hover:bg-[#0d1117] hover:text-[#e3b341]'}`} title="Rig & LiveLink"><Bone size={20}/></button>
        </div>

        {/* Viewport Area (Mock 3D Character) */}
        <div className="flex-1 bg-gradient-to-br from-[#161b22] to-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-center">
           <div className="absolute top-0 bottom-0 w-px bg-white/5 right-1/2 -z-10 pointer-events-none"></div>
           <div className="absolute left-0 right-0 h-px bg-white/5 bottom-1/2 -z-10 pointer-events-none"></div>
           
           <div className="text-[120px] font-bold text-black/20 tracking-tighter mix-blend-overlay absolute z-0 select-none">M-HUMAN</div>

           {/* Character Silhouette */}
           <div className="w-[300px] h-[550px] bg-gradient-to-t from-[#c9d1d9]/5 to-[#c9d1d9]/20 blur-[2px] rounded-[100px] mt-20 relative mix-blend-screen drop-shadow-[0_0_20px_rgba(88,166,255,0.1)]">
              {/* Head region */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-24 h-32 bg-white/20 rounded-full"></div>
              {/* Eye shape keys mock */}
              {activeTab === 'Face' && (
                 <>
                   <div className="absolute top-0 left-10 w-2 h-2 rounded-full border border-[#58a6ff] bg-[#58a6ff] shadow-[0_0_10px_#58a6ff] flex items-center justify-center"><div className="w-[1px] h-6 bg-[#58a6ff] absolute -top-8"></div></div>
                   <div className="absolute top-0 right-10 w-2 h-2 rounded-full border border-[#58a6ff] bg-[#58a6ff] shadow-[0_0_10px_#58a6ff] flex items-center justify-center"><div className="w-[1px] h-6 bg-[#58a6ff] absolute -top-8"></div></div>
                   <div className="absolute top-10 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full border border-[#3fb950] bg-[#3fb950] shadow-[0_0_10px_#3fb950] flex items-center justify-center"><div className="w-[1px] h-6 bg-[#3fb950] absolute top-2 right-10"></div></div>
                 </>
              )}
           </div>

           <div className="absolute bottom-4 left-4 bg-[#161b22]/80 backdrop-blur border border-[#30363d] rounded p-2 text-[10px] text-[#8b949e] font-mono leading-tight">
              LOD: 0 (Cinematic)<br/>
              Polycount: 142.5k<br/>
              Bones & IK: 642 <span className="text-[#3fb950]">Active</span>
           </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117] shrink-0">
              <span className="font-bold text-[11px] uppercase tracking-wider text-[#c9d1d9]">{activeTab} Properties</span>
           </div>
           
           <div className="p-4 flex flex-col gap-6 flex-1 overflow-y-auto custom-scrollbar text-[11px]">
              
              {activeTab === 'Face' && (
                 <>
                   <div>
                      <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-[#8b949e]">
                         <span>Eye Width (CTRL_eyes_scale_X)</span>
                         <span className="text-[#58a6ff] font-mono">0.65</span>
                      </div>
                      <input type="range" className="w-full accent-[#58a6ff]" defaultValue="65" />
                   </div>
                   <div>
                      <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-[#8b949e]">
                         <span>Jaw Line (CTRL_jaw_fwd)</span>
                         <span className="text-[#58a6ff] font-mono">-0.20</span>
                      </div>
                      <input type="range" className="w-full accent-[#58a6ff]" defaultValue="30" />
                   </div>
                   <div>
                      <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-[#8b949e]">
                         <span>Cheekbones (CTRL_cheek_raise)</span>
                         <span className="text-[#58a6ff] font-mono">0.80</span>
                      </div>
                      <input type="range" className="w-full accent-[#58a6ff]" defaultValue="80" />
                   </div>
                   
                   <div className="h-px bg-[#30363d] my-1"></div>
                   
                   <div>
                      <label className="font-bold text-[#c9d1d9] mb-2 block">Skin Textures & Decals</label>
                      <select className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 outline-none text-[#c9d1d9]">
                         <option>Caucasian_01_Mid30s</option>
                         <option>Melanin_03_Smooth</option>
                         <option>Alien_Holographic_01</option>
                      </select>
                   </div>
                   <div className="flex items-center justify-between bg-[#0d1117] border border-[#30363d] rounded p-2">
                       <span className="text-[#8b949e] font-bold">Enable Subsurface Scattering</span>
                       <input type="checkbox" className="accent-[#58a6ff] w-3 h-3" defaultChecked />
                   </div>
                 </>
              )}

              {activeTab === 'Body' && (
                 <div className="text-[#8b949e] text-center italic py-10">Body Morph Targets Active.</div>
              )}
              {activeTab === 'Animation' && (
                 <div className="text-[#8b949e] text-center italic py-10">LiveLink Facial Mocap Active. <span className="text-[#e3b341] font-bold not-italic cursor-pointer hover:underline block mt-2">Connect iOS FaceID</span></div>
              )}

              <div className="mt-auto pt-4 border-t border-[#30363d] flex flex-col gap-2">
                 <span className="font-bold text-[#58a6ff] uppercase tracking-wider text-[10px]">AI Prompt Generation</span>
                 <p className="text-[10px] text-[#8b949e]">Generate a fully rigged facial and body structure from image or text prompt.</p>
                 <textarea className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-[10px] outline-none text-white h-16 resize-none" placeholder="'A battle-hardened elf warrior with a scar over her right eye and sharp jawline...'" />
                 <button className="bg-[#58a6ff]/20 hover:bg-[#58a6ff]/30 text-[#58a6ff] py-1.5 rounded text-[10px] font-bold border border-[#58a6ff]/50 transition-colors">Start AI Sculpting</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
