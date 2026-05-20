import React, { useState } from 'react';
import {
  FlaskConical, Ear, ImageIcon, Droplets, Flame, Wind, 
  Settings2, Activity, Play, Download, Wand2, Image as ImageIcon2, Focus
} from 'lucide-react';

export default function ProceduralAssetStudio() {
  const [activeTab, setActiveTab] = useState<'Chemistry' | 'Foley' | 'Prompt2Asset'>('Chemistry');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#c9d1d9] font-sans">
       <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#bc8cff]/10 to-transparent pointer-events-none"></div>
        <FlaskConical size={28} className="text-[#bc8cff] mr-4 shadow-[0_0_15px_rgba(188,140,255,0.4)]" />
        <div className="flex flex-col z-10">
          <h2 className="text-white text-[16px] font-bold tracking-tight">Procedural Asset & Cinematic Studio</h2>
          <p className="text-[#8b949e] text-[11px]">Chemistry-based PBR, Psychoacoustic HRTF Foley, and Offline Prompt-to-Asset Diffusion.</p>
        </div>
      </div>

      <div className="flex bg-[#161b22] border-b border-[#30363d] h-10 px-4">
        <button onClick={() => setActiveTab('Chemistry')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Chemistry' ? 'text-[#3fb950] border-b-2 border-[#3fb950]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><FlaskConical size={14}/> Chemistry Lab (PBR)</button>
        <button onClick={() => setActiveTab('Foley')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Foley' ? 'text-[#e3b341] border-b-2 border-[#e3b341]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><Ear size={14}/> Psychoacoustic Foley</button>
        <button onClick={() => setActiveTab('Prompt2Asset')} className={`px-4 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Prompt2Asset' ? 'text-[#bc8cff] border-b-2 border-[#bc8cff]' : 'text-[#8b949e] hover:text-[#c9d1d9]'}`}><Wand2 size={14}/> Prompt-to-Asset</button>
      </div>

      <div className="flex-1 overflow-hidden relative">
         {activeTab === 'Chemistry' && <ChemistryLab />}
         {activeTab === 'Foley' && <FoleyEditor />}
         {activeTab === 'Prompt2Asset' && <PromptToAsset />}
      </div>
    </div>
  );
}

function ChemistryLab() {
   return (
      <div className="flex h-full p-6 bg-[#050505] gap-6">
         <div className="w-[300px] flex flex-col gap-4">
            <div className="text-[12px] font-bold text-[#3fb950] uppercase tracking-wider mb-2">Base Elements</div>
            
            <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
               <div className="flex justify-between text-[11px] font-bold text-[#c9d1d9] mb-2"><span>Iron (Fe)</span> <span className="text-white">80%</span></div>
               <input type="range" className="w-full accent-[#3fb950] outline-none" defaultValue={80} />
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
               <div className="flex justify-between text-[11px] font-bold text-[#c9d1d9] mb-2"><span>Oxygen (O2) - Oxidization</span> <span className="text-white">45%</span></div>
               <input type="range" className="w-full accent-[#e3b341] outline-none" defaultValue={45} />
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
               <div className="flex justify-between text-[11px] font-bold text-[#c9d1d9] mb-2"><span>Carbon (C)</span> <span className="text-white">5%</span></div>
               <input type="range" className="w-full accent-[#8b949e] outline-none" defaultValue={5} />
            </div>

            <button className="mt-4 bg-[#3fb950] text-black font-bold text-[12px] uppercase py-3 rounded shadow-[0_0_15px_rgba(63,185,80,0.4)]">
               Simulate Reaction (Bake PBR)
            </button>
         </div>

         <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg relative flex items-center justify-center p-8">
            <div className="absolute top-4 left-4 text-[#8b949e] text-[10px] uppercase font-bold">Node Graph Generated Texture</div>
            
            {/* Sphere Mockup */}
            <div className="w-[300px] h-[300px] rounded-full relative shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.8),_0_20px_50px_rgba(0,0,0,0.5)]" style={{
               background: 'radial-gradient(circle at 30% 30%, #a4a4a4, #333)',
               // Simulated rust spots
               backgroundImage: 'radial-gradient(circle at 30% 30%, #a4a4a4, #333), url("https://transparenttextures.com/patterns/rusty-metal.png")'
            }}>
               <div className="absolute inset-0 rounded-full mix-blend-multiply opacity-60 bg-[#8a3324]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-4">
               <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#6c757d] border border-[#30363d] rounded"></div> <span className="text-[10px] uppercase font-bold text-[#8b949e]">Albedo</span></div>
               <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#9c95cb] border border-[#30363d] rounded"></div> <span className="text-[10px] uppercase font-bold text-[#8b949e]">Normal/Bump</span></div>
               <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#ffffff] border border-[#30363d] rounded"></div> <span className="text-[10px] uppercase font-bold text-[#8b949e]">Metallic</span></div>
            </div>
         </div>
      </div>
   )
}

function FoleyEditor() {
   return (
      <div className="flex h-full p-6 bg-[#050505] gap-6">
         <div className="w-1/3 flex flex-col gap-4">
            <div className="text-[12px] font-bold text-[#e3b341] uppercase tracking-wider mb-2">Physical Acoustic Params</div>

            <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
               <span className="text-[#8b949e] text-[10px] uppercase font-bold">Impacting Object Mass</span>
               <div className="text-white font-mono text-[14px]">12.5 kg</div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
               <span className="text-[#8b949e] text-[10px] uppercase font-bold">Surface Material</span>
               <select className="w-full bg-[#0a0a0a] border border-[#30363d] text-white p-2 mt-2 rounded outline-none text-[12px]">
                  <option>Hollow Wood</option>
                  <option>Solid Concrete</option>
                  <option>Metal Grating</option>
               </select>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded p-3 text-[11px]">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[#8b949e] font-bold">Simulate HRTF Room Reverb</span>
                  <input type="checkbox" checked className="accent-[#e3b341]" />
               </div>
               <span className="text-[#8b949e] text-[9px] block">Calculates accurate spatial echoing based on room geometry.</span>
            </div>

            <button className="mt-4 bg-[#e3b341] text-black font-bold text-[12px] uppercase py-3 rounded shadow-[0_0_15px_rgba(227,179,65,0.4)] flex items-center justify-center gap-2">
               <Play size={14}/> Generate Sound
            </button>
         </div>

         <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg p-6 relative flex flex-col">
            <h3 className="text-[#c9d1d9] text-[12px] font-bold uppercase tracking-widest mb-4">Waveform Result</h3>
            
            <div className="flex-1 bg-[#0a0a0a] border border-[#30363d] rounded relative overflow-hidden flex items-center justify-center">
               {/* Waveform Mockup */}
               <svg className="w-full h-32 ml-4 mr-4 text-[#e3b341] opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,50 L2,50 L5,20 L10,80 L15,10 L20,90 L25,40 L30,60 L35,45 L40,55 L50,50 L100,50" fill="none" stroke="currentColor" strokeWidth="1" />
               </svg>
            </div>
         </div>
      </div>
   )
}

function PromptToAsset() {
   return (
      <div className="flex h-full flex-col bg-[#050505]">
         <div className="p-6 pb-0 border-b border-[#30363d] flex gap-4">
            <div className="flex-1 flex flex-col gap-2 mb-6">
               <label className="text-[10px] font-bold text-[#8b949e] uppercase">Offline Local Diffusion Model (e.g. SD-XL, Flux)</label>
               <div className="relative">
                  <input type="text" className="w-full bg-[#161b22] border border-[#30363d] p-4 rounded-lg outline-none text-white focus:border-[#bc8cff]" placeholder="A medieval rusted broadsword with an emerald embedded in the hilt..." />
                  <button className="absolute right-2 top-2 bg-[#bc8cff] text-black font-bold px-4 py-2 rounded uppercase text-[11px] shadow-[0_0_10px_rgba(188,140,255,0.4)] flex items-center gap-2">
                     <Focus size={14} /> Generate 3D Asset
                  </button>
               </div>
               <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 text-[10px] text-[#8b949e]"><input type="checkbox" checked className="accent-[#bc8cff]" /> Auto-separate Geometry (Hilt, Blade, Gem)</label>
                  <label className="flex items-center gap-2 text-[10px] text-[#8b949e]"><input type="checkbox" checked className="accent-[#bc8cff]" /> Generate 4K PBR Textures</label>
               </div>
            </div>
         </div>

         <div className="flex-1 p-6 grid grid-cols-3 gap-6">
             <div className="col-span-2 bg-[#161b22] border border-[#30363d] rounded-lg relative overflow-hidden flex items-center justify-center shadow-inner">
                <span className="text-[#8b949e] font-mono text-[12px]">3D Viewport Generator Canvas</span>
                <div className="absolute top-4 right-4 flex gap-2">
                   <button className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] p-2 rounded hover:text-white"><Download size={14} /></button>
                </div>
             </div>
             <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9d1d9] mb-4">Generation Layers</span>
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-3 p-2 bg-[#0a0a0a] border border-[#30363d] rounded text-[11px] text-[#8b949e] hover:text-white cursor-pointer">
                      <ImageIcon2 size={14} /> Base_Mesh_Output.obj
                   </div>
                   <div className="flex items-center gap-3 p-2 bg-[#0a0a0a] border border-[#30363d] rounded text-[11px] text-[#8b949e] hover:text-white cursor-pointer ml-4">
                      <ImageIcon2 size={14} className="text-[#8b949e]" /> Diffuse_4K.png
                   </div>
                   <div className="flex items-center gap-3 p-2 bg-[#0a0a0a] border border-[#30363d] rounded text-[11px] text-[#8b949e] hover:text-white cursor-pointer ml-4">
                      <ImageIcon2 size={14} className="text-[#8b949e]" /> Normal_Map_4K.png
                   </div>
                   <div className="flex items-center gap-3 p-2 bg-[#0a0a0a] border border-[#30363d] rounded text-[11px] text-[#8b949e] hover:text-white cursor-pointer ml-4">
                      <ImageIcon2 size={14} className="text-[#8b949e]" /> Roughness_Metal_4K.png
                   </div>
                </div>
             </div>
         </div>
      </div>
   )
}
