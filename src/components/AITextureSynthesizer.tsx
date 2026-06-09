import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Sparkles, SlidersHorizontal, Download, Layers, Pipette, RefreshCw } from 'lucide-react';

export default function AITextureSynthesizer() {
  const [prompt, setPrompt] = useState('Ancient alien temple stone with glowing runes, mossy, seamless');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resolution, setResolution] = useState('2K');
  
  const maps = [
    { name: 'Albedo (Base Color)', color: 'border-blue-500/50', gradient: 'from-blue-500/10' },
    { name: 'Normal Map', color: 'border-purple-500/50', gradient: 'from-purple-500/10' },
    { name: 'Roughness', color: 'border-orange-500/50', gradient: 'from-orange-500/10' },
    { name: 'Ambient Occlusion', color: 'border-gray-500/50', gradient: 'from-gray-500/10' },
    { name: 'Height/Displacement', color: 'border-green-500/50', gradient: 'from-green-500/10' },
    { name: 'Emissive/Glow', color: 'border-red-500/50', gradient: 'from-red-500/10' },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="w-full h-full bg-[#0a0a0c] text-white flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-[#111] flex items-center justify-between shadow-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <ImageIcon size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">AI PBR Texture Synthesizer</h2>
            <p className="text-[#888] text-xs font-mono">Seamless Material Generation Pipeline</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-black/50 border border-white/10 rounded-lg p-1">
            {['1K', '2K', '4K', '8K'].map(res => (
              <button
                key={res}
                onClick={() => setResolution(res)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${resolution === res ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-[#666] hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                {res}
              </button>
            ))}
          </div>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2">
            <Download size={14}/> Export Material Instance
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Generation Controls */}
        <div className="w-[320px] bg-[#121214] border-r border-white/10 flex flex-col shrink-0">
           <div className="p-5 flex-1 overflow-y-auto">
              {/* Prompt Input */}
              <div className="mb-6">
                <label className="text-xs font-bold text-[#888] uppercase tracking-wider mb-2 block flex items-center gap-2">
                  <Sparkles size={12} className="text-purple-400"/> Synthesis Prompt
                </label>
                <textarea 
                  className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors resize-none placeholder:text-[#444]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the material..."
                />
              </div>

              {/* Reference Image */}
              <div className="mb-6">
                 <label className="text-xs font-bold text-[#888] uppercase tracking-wider mb-2 block flex items-center gap-2">
                   <Upload size={12} className="text-[#58a6ff]" /> Reference Style (Optional)
                 </label>
                 <div className="h-24 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-[#555] hover:border-white/20 hover:text-[#888] transition-colors cursor-pointer bg-black/20 hover:bg-white/5">
                    <Pipette size={20} className="mb-2 opacity-50" />
                    <span className="text-xs font-medium">Drop base image here</span>
                 </div>
              </div>

              {/* Parameters */}
              <div className="mb-6">
                 <label className="text-xs font-bold text-[#888] uppercase tracking-wider mb-4 block flex items-center gap-2">
                   <SlidersHorizontal size={12} className="text-[#e3b341]"/> PBR Parameters
                 </label>
                 
                 <div className="space-y-4">
                    <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-[#aaa]">Seamless Tiling (Tile-ability)</span><span className="text-purple-400">High</span></div>
                       <input type="range" className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-full appearance-none" defaultValue={85} />
                    </div>
                    <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-[#aaa]">Micro-Detail Frequency</span><span className="text-purple-400">Medium</span></div>
                       <input type="range" className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-full appearance-none" defaultValue={50} />
                    </div>
                    <div>
                       <div className="flex justify-between text-xs mb-1"><span className="text-[#aaa]">Displacement Map Depth</span><span className="text-purple-400">0.8</span></div>
                       <input type="range" className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-full appearance-none" defaultValue={80} />
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Generate Button Wrapper */}
           <div className="p-4 border-t border-white/10 bg-black/20">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 rounded-lg flex items-center justify-center font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {isGenerating ? (
                   <span className="flex items-center gap-2"><RefreshCw size={16} className="animate-spin" /> Synthesizing Maps...</span>
                 ) : (
                   <span className="flex items-center gap-2"><Sparkles size={16} /> Generate Material</span>
                 )}
              </button>
           </div>
        </div>

        {/* Right Panel: Map Previews & 3D Sphere */}
        <div className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col p-6">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none"></div>
           
           <div className="flex items-center gap-3 mb-6">
              <Layers className="text-[#888]" size={18}/>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#aaa]">Generated Texture Maps</h3>
           </div>

           <div className="grid grid-cols-3 gap-6 flex-1">
              {maps.map((map, i) => (
                <div key={map.name} className={`bg-[#0f0f11] border ${map.color} rounded-xl overflow-hidden flex flex-col shadow-lg relative group`}>
                   {/* Background Gradient */}
                   <div className={`absolute inset-0 bg-gradient-to-br ${map.gradient} to-transparent opacity-20 pointer-events-none`}></div>
                   
                   <div className="p-3 border-b border-white/5 flex justify-between items-center bg-black/40 relative z-10">
                      <span className="text-xs font-bold tracking-wide text-white/90">{map.name}</span>
                      <button className="text-[#666] hover:text-white transition-colors" title="Download Map">
                        <Download size={12}/>
                      </button>
                   </div>
                   
                   <div className="flex-1 relative flex items-center justify-center p-4">
                      {isGenerating ? (
                         <div className="w-16 h-16 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin"></div>
                      ) : (
                         <div className="absolute inset-4 rounded border border-white/5 bg-[#1a1a1c] overflow-hidden flex items-center justify-center group-hover:border-white/20 transition-colors">
                            {/* Placeholder for generated map visual */}
                            <div className="text-[#333] font-mono text-[10px] break-words text-center opacity-50 p-2">
                               {map.name.toUpperCase().replace(/\s/g, '_')}_MAP_{resolution}.PNG
                            </div>
                         </div>
                      )}
                   </div>
                </div>
              ))}
           </div>
           
           {/* Preview Container Overlay Info */}
           {!isGenerating && (
             <div className="absolute top-6 right-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                <span className="text-xs font-mono text-green-400">PBR SYNTHESIS COMPLETE</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
