import React, { useState } from 'react';
import { Box, Cpu, HardDrive, Play, Download, ScanLine } from 'lucide-react';

export default function AIOfflineModelGenerator() {
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
        return p + 5;
      });
    }, 200);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white">
      <div className="flex items-center gap-2 p-4 border-b border-[#30363d] bg-[#161b22]">
        <Box className="text-[#d29922]" size={24} />
        <div>
          <h2 className="font-bold text-lg leading-tight">AI Offline 3D Model Generator</h2>
          <p className="text-xs text-[#8b949e]">Local Text-to-3D Model Generation (No internet required)</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 border-r border-[#30363d] p-4 flex flex-col gap-4 overflow-y-auto bg-[#0d1117]">
          <div>
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Local Model Checkpoint</label>
            <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-sm text-white">
              <option>Shap-E-Local-F16.gguf (3.2GB)</option>
              <option>Point-E-v2.safetensors (2.8GB)</option>
              <option>TripoSR-Local-Optimized (4.1GB)</option>
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
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Output Format</label>
            <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-sm text-white">
              <option>.OBJ (Mesh + MTL)</option>
              <option>.GLTF / .GLB</option>
              <option>.FBX</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Poly Count Target</label>
            <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-sm text-white">
              <option>Low Poly (~2k Tris)</option>
              <option>Medium Poly (~10k Tris)</option>
              <option>High Poly (~50k Tris)</option>
            </select>
          </div>

          <div className="mt-auto">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-3 rounded font-bold flex items-center justify-center gap-2 ${isGenerating ? 'bg-[#2ea043]/50 text-white/50' : 'bg-[#2ea043] hover:bg-[#2c974b] text-white'}`}
            >
              <Play size={16} /> {isGenerating ? 'Generating...' : 'Generate 3D Model'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[#30363d] bg-[#0d1117]">
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Prompt (Describe the 3D Object)</label>
            <textarea 
              className="w-full h-24 bg-[#161b22] border border-[#30363d] rounded p-3 text-sm text-white focus:outline-none focus:border-[#d29922] resize-none"
              placeholder="e.g. A futuristic sci-fi crate with glowing neon orange trims, detailed metal textures, low poly style..."
            ></textarea>
          </div>

          <div className="flex-1 relative bg-[#010409] flex items-center justify-center p-4">
            {isGenerating ? (
              <div className="w-full max-w-md flex flex-col items-center gap-4">
                <ScanLine className="text-[#d29922] animate-spin" size={48} />
                <div className="text-sm font-mono text-[#8b949e]">Voxelizing Output... {progress}%</div>
                <div className="w-full h-2 bg-[#161b22] rounded-full overflow-hidden">
                  <div className="h-full bg-[#d29922] transition-all duration-200" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            ) : progress === 100 ? (
              <div className="w-full h-full border-2 border-dashed border-[#30363d] rounded-lg flex flex-col items-center justify-center text-[#8b949e] relative bg-[#161b22]">
                 <div className="flex flex-col items-center gap-4">
                    <Box size={48} className="text-[#d29922]" />
                    <p>3D Model Generation Complete!</p>
                    <div className="flex gap-4">
                        <button className="bg-[#2ea043] border border-[#3fb950] hover:bg-[#2c974b] text-white px-4 py-2 rounded text-sm flex items-center gap-2">
                            <Download size={16} /> Export .FBX
                        </button>
                        <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-white px-4 py-2 rounded text-sm flex items-center gap-2">
                            Send to Scene
                        </button>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="text-[#8b949e] flex flex-col items-center gap-4">
                <Box size={48} className="opacity-20" />
                <p>3D Model Viewer will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
