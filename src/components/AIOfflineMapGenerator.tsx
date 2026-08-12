import React, { useState } from 'react';
import { Map, Cpu, HardDrive, Play, Settings, Download, Box, Layers } from 'lucide-react';

export default function AIOfflineMapGenerator() {
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
        <Map className="text-[#3fb950]" size={24} />
        <div>
          <h2 className="font-bold text-lg leading-tight">AI Offline Map & Level Generator</h2>
          <p className="text-xs text-[#8b949e]">Local Procedural Generation Model (No internet required)</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Settings */}
        <div className="w-80 border-r border-[#30363d] p-4 flex flex-col gap-4 overflow-y-auto bg-[#0d1117]">
          <div>
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Local Model Checkpoint</label>
            <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-sm text-white">
              <option>TerrainGen-V3-Q4_K_M.gguf (4.2GB)</option>
              <option>DungeonLayout-Llama3-8B.gguf (5.1GB)</option>
              <option>SciFi-Corridors-SDXL-Turbo.safetensors (6.5GB)</option>
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
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Map Size</label>
            <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-sm text-white">
              <option>1024x1024 (Standard)</option>
              <option>2048x2048 (Large)</option>
              <option>4096x4096 (Open World)</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Biome Base</label>
            <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-sm text-white">
              <option>Mixed Temperate</option>
              <option>Desert / Arid</option>
              <option>Tundra / Snow</option>
              <option>Alien / Sci-Fi</option>
            </select>
          </div>

          <div className="mt-auto">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-3 rounded font-bold flex items-center justify-center gap-2 ${isGenerating ? 'bg-[#2ea043]/50 text-white/50' : 'bg-[#2ea043] hover:bg-[#2c974b] text-white'}`}
            >
              <Play size={16} /> {isGenerating ? 'Generating...' : 'Generate Map'}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[#30363d] bg-[#0d1117]">
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Prompt (Describe the level/map)</label>
            <textarea 
              className="w-full h-24 bg-[#161b22] border border-[#30363d] rounded p-3 text-sm text-white focus:outline-none focus:border-[#58a6ff] resize-none"
              placeholder="e.g. A dense pine forest with a winding river in the center, a small abandoned wooden cabin on a hill in the north-east corner..."
            ></textarea>
          </div>

          <div className="flex-1 relative bg-[#010409] flex items-center justify-center p-4">
            {isGenerating ? (
              <div className="w-full max-w-md flex flex-col items-center gap-4">
                <Layers className="text-[#58a6ff] animate-pulse" size={48} />
                <div className="text-sm font-mono text-[#8b949e]">Generating Neural Terrain... {progress}%</div>
                <div className="w-full h-2 bg-[#161b22] rounded-full overflow-hidden">
                  <div className="h-full bg-[#58a6ff] transition-all duration-200" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            ) : progress === 100 ? (
              <div className="w-full h-full border-2 border-dashed border-[#30363d] rounded-lg flex flex-col items-center justify-center text-[#8b949e] relative bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center">
                 <div className="absolute inset-0 bg-black/60 rounded-lg"></div>
                 <div className="relative z-10 flex flex-col items-center gap-4">
                    <Box size={48} className="text-[#3fb950]" />
                    <p>Map Generation Complete!</p>
                    <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-white px-4 py-2 rounded text-sm flex items-center gap-2">
                      <Download size={16} /> Export as Heightmap / Mesh
                    </button>
                 </div>
              </div>
            ) : (
              <div className="text-[#8b949e] flex flex-col items-center gap-4">
                <Map size={48} className="opacity-20" />
                <p>Generated Map Preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
