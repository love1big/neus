import React from 'react';
import { GitMerge, Code2, Play, GitPullRequest, ArrowRightLeft } from 'lucide-react';

interface NodeGraphMockupProps {
  onClose?: () => void;
}

export default function NodeGraphMockup({ onClose }: NodeGraphMockupProps) {
  return (
    <div className="absolute inset-0 bg-[#0d1117] z-20 flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center space-x-3">
          <GitMerge size={16} className="text-[#ff7b72]" />
          <span className="text-sm font-semibold text-[#e6edf3]">AST Logic Weaver / Node View</span>
          <span className="px-2 py-0.5 rounded bg-[#ff7b72]/10 text-[#ff7b72] text-[10px] border border-[#ff7b72]/20">BIDIRECTIONAL SYNC</span>
          <ArrowRightLeft size={14} className="text-[#8b949e]" />
          <Code2 size={16} className="text-[#8b949e]" />
          <span className="text-xs text-[#8b949e]">player_controller.ts</span>
        </div>
        <button onClick={onClose} className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[#c9d1d9] text-xs transition-colors">
          Switch to Code Mode
        </button>
      </div>

      {/* Node Canvas Area (Mockup Grid) */}
      <div className="flex-1 relative overflow-hidden bg-[#0a0c10]" style={{
        backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}>
        
        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path d="M 220 150 C 280 150, 300 250, 350 250" fill="none" stroke="#58a6ff" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
          <path d="M 550 265 C 600 265, 620 180, 680 180" fill="none" stroke="#3fb950" strokeWidth="2" />
        </svg>

        {/* Node 1: Event Tick */}
        <div className="absolute top-[100px] left-[50px] w-48 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl shadow-black/50 backdrop-blur-sm">
          <div className="h-8 bg-[#f85149] rounded-t-lg flex items-center px-3">
            <span className="text-white text-xs font-bold font-mono">Event Update()</span>
          </div>
          <div className="p-3 text-xs text-[#8b949e] flex flex-col space-y-2">
             <div className="flex justify-between items-center">
               <span>DeltaTime</span>
               <div className="w-3 h-3 rounded-full border-2 border-[#8b949e] bg-[#0d1117]"></div>
             </div>
             <div className="flex justify-end items-center mt-2 group relative">
               <span className="mr-2 text-[#58a6ff] cursor-pointer">Exec</span>
               <div className="w-3 h-3 rounded-full bg-[#58a6ff] shadow-[0_0_8px_#58a6ff]"></div>
             </div>
          </div>
        </div>

        {/* Node 2: Apply Movement */}
        <div className="absolute top-[180px] left-[350px] w-56 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl shadow-black/50">
          <div className="h-8 bg-[#58a6ff] rounded-t-lg flex items-center px-3 justify-between">
            <span className="text-white text-xs font-bold font-mono text-shadow">Apply Velocity</span>
            <span className="text-white/50 text-[10px]">f(x)</span>
          </div>
          <div className="p-3 text-xs text-[#8b949e] flex flex-col space-y-2">
             <div className="flex justify-between items-center group relative pt-1">
               <div className="flex items-center">
                 <div className="w-3 h-3 rounded-full bg-[#58a6ff] mr-2"></div>
                 <span className="text-white">Exec</span>
               </div>
               <div className="flex items-center">
                 <span className="mr-2 text-[#58a6ff]">Exec</span>
                 <div className="w-3 h-3 rounded-full border-2 border-[#58a6ff] bg-[#0d1117]"></div>
               </div>
             </div>
             <div className="flex justify-between items-center mt-3">
               <div className="flex items-center">
                 <div className="w-3 h-3 rounded-full border-2 border-[#3fb950] bg-[#0d1117] mr-2"></div>
                 <span>Target Object</span>
               </div>
             </div>
             <div className="flex justify-between items-center">
               <div className="flex items-center">
                 <div className="w-3 h-3 rounded-full border-2 border-[#e3b341] bg-[#0d1117] mr-2"></div>
                 <span>Vector3 Init</span>
                 <input type="text" defaultValue="0, -9.8, 0" className="ml-2 w-20 bg-[#0d1117] border border-[#30363d] rounded px-1 text-[10px] text-[#e3b341]" />
               </div>
             </div>
          </div>
        </div>

        {/* Node 3: Update Physics Ghost (The Trajectory Projection feature) */}
        <div className="absolute top-[130px] left-[680px] w-60 bg-[#161b22] border border-[#3fb950] rounded-lg shadow-[0_0_15px_rgba(63,185,80,0.15)]">
          <div className="h-8 bg-[#3fb950] rounded-t-lg flex items-center px-3 justify-between">
            <span className="text-[#0d1117] text-xs font-bold font-mono">Project Trajectory Ghost</span>
            <Play size={12} className="text-[#0d1117]" />
          </div>
          <div className="p-3 text-xs text-[#8b949e] flex flex-col space-y-2 bg-[#0d1117]/50 rounded-b-lg">
             <div className="flex justify-between items-center">
               <div className="flex items-center">
                 <div className="w-3 h-3 rounded-full bg-[#58a6ff] mr-2"></div>
               </div>
             </div>
             <p className="text-[10px] text-center text-[#3fb950] py-2 border border-[#3fb950]/30 rounded bg-[#3fb950]/5 mt-2">
               Physics simulated ahead 100 frames.<br/>Ghost mesh visible in 3D Viewport.
             </p>
          </div>
        </div>

      </div>

      {/* Floating Info Box */}
      <div className="absolute bottom-4 right-4 bg-[#161b22]/90 backdrop-blur border border-[#30363d] p-3 rounded-lg shadow-xl max-w-sm">
        <h3 className="text-[#e6edf3] font-semibold text-xs mb-1 flex items-center">
          <GitPullRequest size={14} className="mr-2 text-[#a371f7]" />
          AST Engine Active
        </h3>
        <p className="text-[#8b949e] text-[10px] leading-relaxed">
          Changes made to the nodes above instantly rewrite your <span className="text-[#58a6ff] font-mono">player_controller.ts</span> file. 
          If you open the code editor and type text, these nodes will morph live without breaking geometry. 
        </p>
      </div>

    </div>
  );
}
