import React, { useState } from 'react';
import { Image, Cpu, HardDrive, Play, Download, Settings2, Sparkles } from 'lucide-react';

export default function AIOfflineImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return p + 4;
      });
    }, 150);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white">
      <div className="flex items-center gap-2 p-4 border-b border-[#30363d] bg-[#161b22]">
        <Image className="text-[#bc8cff]" size={24} />
        <div>
          <h2 className="font-bold text-lg leading-tight">AI Offline Image & Concept Art</h2>
          <p className="text-xs text-[#8b949e]">Local Stable Diffusion / Flux / SDXL Models</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 border-r border-[#30363d] p-4 flex flex-col gap-4 overflow-y-auto bg-[#0d1117]">
          <div>
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Local Checkpoint (Safetensors)</label>
            <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-sm text-white">
              <option>SDXL-1.0-Base.safetensors</option>
              <option>Juggernaut-XL-v9.safetensors</option>
              <option>Flux.1-schnell-fp8.safetensors</option>
              <option>AnimeArt-Diffusion-v3.safetensors</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Compute Device</label>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#238636] border border-[#2ea043] rounded py-1.5 text-sm flex items-center justify-center gap-2">
                <Cpu size={14} /> GPU (CUDA)
              </button>
              <button className="flex-1 bg-[#21262d] border border-[#30363d] rounded py-1.5 text-sm flex items-center justify-center gap-2">
                <HardDrive size={14} /> CPU Only
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Aspect Ratio</label>
            <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-sm text-white">
              <option>1024x1024 (1:1 Square)</option>
              <option>1920x1080 (16:9 Landscape)</option>
              <option>1080x1920 (9:16 Portrait)</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                <span>Sampling Steps</span>
                <span>20</span>
              </div>
              <input type="range" min="1" max="50" defaultValue="20" className="w-full accent-[#bc8cff]" />
            </div>
            <div>
              <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                <span>CFG Scale</span>
                <span>7.5</span>
              </div>
              <input type="range" min="1" max="20" defaultValue="7.5" step="0.5" className="w-full accent-[#bc8cff]" />
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-3 rounded font-bold flex items-center justify-center gap-2 ${isGenerating ? 'bg-[#bc8cff]/50 text-white/50' : 'bg-[#bc8cff] hover:bg-[#a371f7] text-white'}`}
            >
              <Play size={16} /> {isGenerating ? 'Rendering...' : 'Generate Image'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[#30363d] bg-[#0d1117] space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Prompt</label>
              <textarea 
                className="w-full h-20 bg-[#161b22] border border-[#30363d] rounded p-3 text-sm text-white focus:outline-none focus:border-[#bc8cff] resize-none"
                placeholder="e.g. Masterpiece, high quality, concept art of a futuristic cyberpunk city raining..."
              ></textarea>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Negative Prompt</label>
              <input 
                type="text"
                className="w-full bg-[#161b22] border border-[#30363d] rounded p-2 text-sm text-white focus:outline-none focus:border-[#bc8cff]"
                placeholder="ugly, blurry, low res, bad anatomy, text, watermarks..."
              />
            </div>
          </div>

          <div className="flex-1 relative bg-[#010409] flex items-center justify-center p-4">
            {isGenerating ? (
              <div className="w-full max-w-md flex flex-col items-center gap-4">
                <Sparkles className="text-[#bc8cff] animate-spin" size={48} />
                <div className="text-sm font-mono text-[#8b949e]">Denoising latents... {progress}%</div>
                <div className="w-full h-2 bg-[#161b22] rounded-full overflow-hidden">
                  <div className="h-full bg-[#bc8cff] transition-all duration-200" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            ) : progress === 100 ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                 <img 
                    src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000" 
                    alt="Generated Concept Art" 
                    className="max-w-full max-h-[80%] object-contain rounded-lg shadow-2xl border border-[#30363d]" 
                  />
                 <div className="mt-6 flex gap-4">
                    <button className="bg-[#bc8cff] hover:bg-[#a371f7] text-white px-6 py-2 rounded text-sm flex items-center gap-2">
                        <Download size={16} /> Save Image
                    </button>
                    <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-white px-4 py-2 rounded text-sm flex items-center gap-2">
                        <Settings2 size={16} /> Send to Img2Img
                    </button>
                 </div>
              </div>
            ) : (
              <div className="text-[#8b949e] flex flex-col items-center gap-4">
                <Image size={48} className="opacity-20" />
                <p>Generated Image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
