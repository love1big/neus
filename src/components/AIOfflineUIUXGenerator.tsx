import React, { useState } from 'react';
import { LayoutDashboard, Cpu, HardDrive, Play, Code2, Copy, Smartphone } from 'lucide-react';

export default function AIOfflineUIUXGenerator() {
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
        <LayoutDashboard className="text-[#03a9f4]" size={24} />
        <div>
          <h2 className="font-bold text-lg leading-tight">AI Offline UI/UX Designer</h2>
          <p className="text-xs text-[#8b949e]">Local Frontend Code Generation Model</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 border-r border-[#30363d] p-4 flex flex-col gap-4 overflow-y-auto bg-[#0d1117]">
          <div>
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Local Model Checkpoint</label>
            <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-sm text-white">
              <option>CodeLlama-UI-Instruct-7B.gguf</option>
              <option>DeepSeek-Coder-UI-33B.gguf</option>
              <option>Mistral-Nemo-Frontend.gguf</option>
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
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Framework</label>
            <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-sm text-white">
              <option>React + Tailwind CSS</option>
              <option>Vue 3 + Tailwind CSS</option>
              <option>Svelte + standard CSS</option>
              <option>HTML + CSS + JS (Vanilla)</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Design System</label>
            <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-sm text-white">
              <option>Shadcn UI</option>
              <option>Material UI</option>
              <option>Chakra UI</option>
              <option>Custom (Raw Tailwind)</option>
            </select>
          </div>

          <div className="mt-auto">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-3 rounded font-bold flex items-center justify-center gap-2 ${isGenerating ? 'bg-[#03a9f4]/50 text-white/50' : 'bg-[#03a9f4] hover:bg-[#0288d1] text-white'}`}
            >
              <Play size={16} /> {isGenerating ? 'Generating Code...' : 'Generate UI/UX'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[#30363d] bg-[#0d1117]">
            <label className="text-xs font-semibold text-[#8b949e] mb-2 block">Prompt (Describe the User Interface)</label>
            <textarea 
              className="w-full h-24 bg-[#161b22] border border-[#30363d] rounded p-3 text-sm text-white focus:outline-none focus:border-[#03a9f4] resize-none"
              placeholder="e.g. A sleek dark mode dashboard for a game server showing player count graphs, active matches, and server health bars..."
            ></textarea>
          </div>

          <div className="flex-1 relative bg-[#010409] flex flex-col p-4">
            {isGenerating ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <Code2 className="text-[#03a9f4] animate-bounce" size={48} />
                <div className="text-sm font-mono text-[#8b949e]">Synthesizing UI Components... {progress}%</div>
                <div className="w-64 h-2 bg-[#161b22] rounded-full overflow-hidden">
                  <div className="h-full bg-[#03a9f4] transition-all duration-200" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            ) : progress === 100 ? (
              <div className="w-full h-full flex gap-4">
                <div className="flex-1 border border-[#30363d] rounded-lg bg-[#161b22] flex flex-col overflow-hidden">
                  <div className="p-2 border-b border-[#30363d] bg-[#0d1117] flex justify-between items-center">
                    <span className="text-xs text-[#8b949e]">Preview (Live Render)</span>
                    <Smartphone size={16} className="text-[#8b949e]" />
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-center text-[#8b949e]">
                    [UI Preview Rendered Here]
                  </div>
                </div>
                <div className="flex-1 border border-[#30363d] rounded-lg bg-[#0d1117] flex flex-col overflow-hidden">
                  <div className="p-2 border-b border-[#30363d] flex justify-between items-center">
                    <span className="text-xs font-mono text-[#8b949e]">Dashboard.tsx</span>
                    <button className="text-[#8b949e] hover:text-white"><Copy size={16} /></button>
                  </div>
                  <div className="flex-1 p-4 font-mono text-sm text-[#3fb950] overflow-y-auto">
                    {'import React from "react";\n\nexport default function Dashboard() {\n  return (\n    <div className="p-4 bg-gray-900 text-white">\n      <h1 className="text-xl font-bold">Server Stats</h1>\n      {/* Generated Code */}\n    </div>\n  );\n}'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#8b949e] gap-4">
                <LayoutDashboard size={48} className="opacity-20" />
                <p>UI Preview & Source Code will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
