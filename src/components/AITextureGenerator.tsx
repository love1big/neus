import React, { useState } from 'react';
import { Palette, Wand2, Download, Image as ImageIcon, Layers, Zap } from 'lucide-react';

export default function AITextureGenerator() {
  const [prompt, setPrompt] = useState("Sci-fi metal hull plating, rusted, glowing blue circuitry, 4k resolution, PBR");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-1.5 rounded-lg shadow-lg">
            <Palette size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">AI Texture <span className="text-pink-400">Generator</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Generative PBR Material Workflow</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-gray-300 px-3 py-1.5 rounded text-xs font-bold transition-colors">
             <Download size={14} /> EXPORT MAPS
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Input */}
        <div className="w-80 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#3e3e42] bg-[#1a1a1c] space-y-4">
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-pink-400 uppercase tracking-widest flex items-center gap-2"><Wand2 size={12}/> Text Prompt</label>
               <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-[#3e3e42] rounded p-2 text-xs text-gray-200 focus:outline-none focus:border-pink-500 resize-none h-24"
               />
             </div>
             <button 
               onClick={handleGenerate}
               disabled={isGenerating}
               className={`w-full flex items-center justify-center gap-2 ${isGenerating ? 'bg-pink-800' : 'bg-pink-600 hover:bg-pink-500'} text-white px-3 py-2 rounded text-xs font-bold transition-colors shadow-[0_0_15px_rgba(219,39,119,0.4)]`}
             >
               {isGenerating ? <><Zap size={14} className="animate-pulse" /> GENERATING...</> : <><Wand2 size={14} /> GENERATE PBR MATERIAL</>}
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">AI Parameters</h4>
               <div className="space-y-2 text-[10px]">
                 <div className="flex justify-between items-center text-gray-400">
                   <span>Model</span>
                   <select className="bg-[#1a1a1c] border border-[#3e3e42] rounded px-2 py-1 text-gray-200 outline-none">
                     <option>Stable Diffusion XL (Base)</option>
                     <option>TextureGen v2.4</option>
                   </select>
                 </div>
                 <div className="space-y-1 mt-2">
                   <div className="flex justify-between text-gray-400"><span>Seamless Tiling</span><span>Enabled</span></div>
                   <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-pink-500 focus:ring-0" />
                 </div>
               </div>
             </div>
             
             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Generated Maps (Outputs)</h4>
               <div className="space-y-2 text-[10px] text-gray-300">
                  {['Albedo / Base Color', 'Normal Map', 'Roughness', 'Metallic', 'Ambient Occlusion', 'Height / Displacement'].map((map, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded bg-[#1a1a1c] border-[#3e3e42] text-pink-500 focus:ring-0" /> {map}
                    </label>
                  ))}
               </div>
             </div>
          </div>
        </div>

        {/* Center: Live Material Preview */}
        <div className="flex-1 bg-[#121212] relative flex flex-col">
           <div className="h-10 bg-[#1a1a1c] border-b border-[#3e3e42] flex items-center px-4 gap-4 text-[10px] text-gray-400">
              <span className="flex items-center gap-1 hover:text-white cursor-pointer"><ImageIcon size={12}/> View 2D Maps</span>
              <span className="flex items-center gap-1 text-pink-400 font-bold border-b-2 border-pink-500 py-2"><Layers size={12}/> View 3D Sphere</span>
           </div>
           
           <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
              
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4">
                   <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
                   <span className="text-xs text-pink-400 font-bold animate-pulse">Synthesizing Textures...</span>
                </div>
              ) : (
                <div className="relative">
                   {/* Fake 3D Sphere Preview */}
                   <div className="w-80 h-80 rounded-full bg-[#2a2a2c] shadow-[inset_0_-20px_40px_rgba(0,0,0,0.8),_0_20px_50px_rgba(0,0,0,0.5)] border border-gray-600 flex items-center justify-center overflow-hidden">
                      {/* Fake Albedo + Normal detail */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-800 opacity-50 mix-blend-multiply"></div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-80 mix-blend-overlay scale-150"></div>
                      {/* Fake Specular Highlight */}
                      <div className="absolute top-10 left-10 w-24 h-24 bg-white/40 blur-xl rounded-full"></div>
                      {/* Fake emission */}
                      <div className="absolute bottom-20 right-20 w-16 h-4 bg-cyan-400/80 blur-md rounded-full rotate-45 shadow-[0_0_20px_rgba(34,211,238,1)]"></div>
                      <div className="absolute bottom-20 right-20 w-16 h-1 bg-white blur-[1px] rounded-full rotate-45"></div>
                   </div>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
