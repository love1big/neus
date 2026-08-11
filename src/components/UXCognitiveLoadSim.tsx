import React, { useState } from 'react';
import { Eye, BrainCircuit, Activity, ZoomIn, Play, Map, MousePointer2, AlertTriangle, LightbulbIcon, Settings2, BarChart2} from 'lucide-react';

export default function UXCognitiveLoadSim() {
  const [activeOverlay, setActiveOverlay] = useState<'heatmap' | 'saccades' | 'attention'>('attention');

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#ccc] font-sans">
      
      {/* Top Protocol Bar */}
      <div className="px-4 py-3 border-b border-[#333] bg-[#252525] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-purple-500/20 text-purple-400 border border-purple-500/50">
             <BrainCircuit size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-white flex items-center gap-2">
              UX Cognitive Load & Eye-Tracking Sim <span className="px-1.5 py-[1px] bg-purple-500 text-white text-[9px] rounded font-bold">AI HEURISTIC</span>
            </h2>
            <p className="text-[#888] text-[9px] font-mono">ATTENTION PREDICTION • SACCADE PATHS • CLUTTER ANALYSIS</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button className="bg-[#333] border border-[#555] hover:bg-[#444] text-white px-3 py-1.5 flex items-center gap-2 text-xs font-bold rounded transition"><Play size={14}/> Run Full Simulation</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         
         {/* Left Controls */}
         <div className="w-[300px] bg-[#222] border-r border-[#333] flex flex-col shrink-0">
             <div className="p-4 border-b border-[#333]">
                <h3 className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2"><Map size={14} className="text-purple-400"/> Overlays</h3>
             </div>
             
             <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                 
                 <button onClick={() => setActiveOverlay('attention')} className={`w-full py-2 px-3 border rounded text-left flex flex-col gap-1 transition ${activeOverlay === 'attention' ? 'bg-purple-900/30 border-purple-500 text-white' : 'bg-[#1a1a1a] border-[#444] hover:bg-[#333]'}`}>
                    <span className="text-[12px] font-bold flex items-center gap-2"><Eye size={14} className={activeOverlay === 'attention' ? 'text-purple-400' : ''}/> Attention Heatmap</span>
                    <span className="text-[10px] text-[#888]">Simulates where users look in the first 3 seconds.</span>
                 </button>

                 <button onClick={() => setActiveOverlay('saccades')} className={`w-full py-2 px-3 border rounded text-left flex flex-col gap-1 transition ${activeOverlay === 'saccades' ? 'bg-blue-900/30 border-blue-500 text-white' : 'bg-[#1a1a1a] border-[#444] hover:bg-[#333]'}`}>
                    <span className="text-[12px] font-bold flex items-center gap-2"><Activity size={14} className={activeOverlay === 'saccades' ? 'text-blue-400' : ''}/> Saccade Pathways</span>
                    <span className="text-[10px] text-[#888]">Predicts the sequence of eye movements across elements.</span>
                 </button>

                 <button onClick={() => setActiveOverlay('heatmap')} className={`w-full py-2 px-3 border rounded text-left flex flex-col gap-1 transition ${activeOverlay === 'heatmap' ? 'bg-orange-900/30 border-orange-500 text-white' : 'bg-[#1a1a1a] border-[#444] hover:bg-[#333]'}`}>
                    <span className="text-[12px] font-bold flex items-center gap-2"><Map size={14} className={activeOverlay === 'heatmap' ? 'text-orange-400' : ''}/> Cognitive Clarity</span>
                    <span className="text-[10px] text-[#888]">Highlights areas that are confusing or overly complex.</span>
                 </button>

                 <div className="h-[1px] bg-[#333] my-4"></div>

                 <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-[#aaa] tracking-widest pl-1">Metrics Box</h4>
                    <div className="bg-[#1a1a1a] border border-[#333] rounded p-3 space-y-3 font-mono text-[11px]">
                       <div className="flex justify-between">
                          <span className="text-[#888]">Visual Clutter Ratio:</span>
                          <span className="text-orange-400 font-bold">High (68%)</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-[#888]">Time To First Fixation:</span>
                          <span className="text-white">124 ms</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-[#888]">Contrast Score:</span>
                          <span className="text-green-400">AAA (Pass)</span>
                       </div>
                    </div>
                 </div>

             </div>
         </div>

         {/* Center Canvas */}
         <div className="flex-1 bg-black relative flex items-center justify-center p-8 overflow-hidden">
             
             {/* The UI Being Simulated */}
             <div className="max-w-[800px] w-full aspect-video bg-[#333] border border-[#444] relative shadow-2xl overflow-hidden rounded group">
                 {/* Fake UI Elements */}
                 <div className="absolute top-4 left-4 w-48 h-8 bg-red-600 rounded drop-shadow-md"></div>
                 <div className="absolute top-4 right-4 w-32 h-[150px] bg-[#222] rounded flex flex-col p-2 space-y-2">
                    <div className="w-full h-8 bg-[#444] rounded"></div>
                    <div className="w-full h-8 bg-[#444] rounded"></div>
                 </div>
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                    <div className="w-16 h-16 bg-[#222] rounded-full border-[3px] border-white shadow-lg"></div>
                    <div className="w-16 h-16 bg-[#222] rounded-full border-[3px] border-gray-500 shadow-lg"></div>
                 </div>
                 <div className="absolute top-[40%] left-[20%] w-[300px] h-[100px] bg-[linear-gradient(45deg,#111,#222)] border border-[#555] rounded flex items-center justify-center text-white font-black text-2xl drop-shadow-2xl">
                    LEVEL COMPLETE
                 </div>


                 {/* ATTENTION HEATMAP OVERLAY */}
                 {activeOverlay === 'attention' && (
                    <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-80" style={{
                       background: `radial-gradient(ellipse at 35% 45%, rgba(255,0,0,0.8) 0%, rgba(255,255,0,0.5) 15%, transparent 35%),
                                    radial-gradient(ellipse at 10% 8%, rgba(255,0,0,0.6) 0%, rgba(255,255,0,0.3) 10%, transparent 25%),
                                    radial-gradient(ellipse at 50% 85%, rgba(255,0,0,0.4) 0%, rgba(255,255,0,0.2) 8%, transparent 20%)`
                    }}></div>
                 )}

                 {/* SACCADE PATHWAYS OVERLAY */}
                 {activeOverlay === 'saccades' && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_2px_#fff]">
                       {/* Lines */}
                       <path d="M 35% 45% L 10% 8% L 90% 15% L 50% 85%" fill="none" stroke="rgba(88,166,255,0.8)" strokeWidth="2" strokeDasharray="5,5" />
                       
                       {/* Fixation Points (Circles) */}
                       <circle cx="35%" cy="45%" r="15" fill="rgba(88,166,255,0.2)" stroke="#58a6ff" strokeWidth="2" />
                       <text x="35%" y="45%" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">1</text>
                       
                       <circle cx="10%" cy="8%" r="10" fill="rgba(88,166,255,0.2)" stroke="#58a6ff" strokeWidth="2" />
                       <text x="10%" y="8%" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">2</text>

                       <circle cx="90%" cy="15%" r="8" fill="rgba(88,166,255,0.2)" stroke="#58a6ff" strokeWidth="2" />
                       <text x="90%" y="15%" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">3</text>

                       <circle cx="50%" cy="85%" r="12" fill="rgba(88,166,255,0.2)" stroke="#58a6ff" strokeWidth="2" />
                       <text x="50%" y="85%" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">4</text>
                    </svg>
                 )}

                 {/* COGNITIVE HEATMAP OVERLAY */}
                 {activeOverlay === 'heatmap' && (
                    <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60">
                       <div className="absolute top-4 right-4 w-32 h-[150px] bg-red-500 rounded blur-xl"></div>
                       <div className="absolute top-[40%] left-[20%] w-[300px] h-[100px] bg-green-500 rounded blur-xl"></div>
                    </div>
                 )}

             </div>

         </div>

         {/* Right Insight Panel */}
         <div className="w-[300px] bg-[#222] border-l border-[#333] flex flex-col shrink-0">
            <div className="p-4 border-b border-[#333]">
               <h3 className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2"><LightbulbIcon size={14} className="text-yellow-400"/> AI Recommendations</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               
               <div className="bg-[#1a1a1a] border border-red-500/30 rounded p-3">
                  <h4 className="text-[11px] font-bold text-red-400 flex items-center gap-1 mb-1"><AlertTriangle size={12}/> High Cognitive Load</h4>
                  <p className="text-[10px] text-[#aaa]">The top-right menu block contains too many visually similar items packed densely. Consider adding negative space or changing border colors.</p>
               </div>

               <div className="bg-[#1a1a1a] border border-green-500/30 rounded p-3">
                  <h4 className="text-[11px] font-bold text-green-400 flex items-center gap-1 mb-1"><Activity size={12}/> Excellent Primary Hook</h4>
                  <p className="text-[10px] text-[#aaa]">The "LEVEL COMPLETE" text successfully captures 85% of initial fixations within the first 200ms. Perfect visual hierarchy.</p>
               </div>
               
               <button className="w-full bg-[#333] border border-[#555] hover:bg-[#444] text-white py-2 rounded text-[11px] font-bold transition flex items-center justify-center gap-2 mt-4">
                  <BarChart2 size={14}/> Generate PDF Report
               </button>

            </div>
         </div>
      </div>

    </div>
  );
}
