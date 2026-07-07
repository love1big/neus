import React from 'react';
import { Brain, Settings, Database, Activity, Play, Download, Network, Code } from 'lucide-react';

export default function MachineLearningIntegration() {
  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      <div className="w-64 border-r border-[#2a2b3d] bg-[#141525] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#2a2b3d]">
          <h2 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
            <Brain size={16} className="text-emerald-400" />
            ML Hub
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
           <div className="px-3 py-2 bg-[#2a2b3d] rounded text-xs flex items-center gap-2 font-medium text-emerald-400 border-l-2 border-emerald-400"><Network size={14}/> NPC Behavior Net</div>
           <div className="px-3 py-2 hover:bg-[#1a1b26] rounded text-xs flex items-center gap-2 text-gray-400 cursor-pointer"><Database size={14}/> Procedural Gen Model</div>
           <div className="px-3 py-2 hover:bg-[#1a1b26] rounded text-xs flex items-center gap-2 text-gray-400 cursor-pointer"><Activity size={14}/> Player Churn Predictor</div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto">
         <div className="p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-white mb-1">NPC Combat Behavior Network</h1>
                  <p className="text-sm text-gray-400">Reinforcement learning model for advanced enemy tactics.</p>
               </div>
               <div className="flex gap-2">
                  <button className="px-4 py-2 bg-[#2a2b3d] hover:bg-[#30363d] rounded text-xs font-medium border border-[#30363d] flex items-center gap-2"><Download size={14}/> Export Weights</button>
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-medium text-white flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"><Play size={14}/> Resume Training</button>
               </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-lg flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold mb-2">Current Epoch</span>
                  <span className="text-3xl font-mono text-emerald-400">1,240</span>
                  <div className="w-full bg-[#0a0a0f] h-1.5 rounded mt-3 overflow-hidden"><div className="w-[60%] h-full bg-emerald-500"></div></div>
               </div>
               <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-lg flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold mb-2">Reward Function Mean</span>
                  <span className="text-3xl font-mono text-white">+42.8</span>
                  <span className="text-xs text-green-400 mt-2 flex items-center gap-1">↑ 12% from last checkpoint</span>
               </div>
               <div className="bg-[#141525] border border-[#2a2b3d] p-4 rounded-lg flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold mb-2">Loss (Huber)</span>
                  <span className="text-3xl font-mono text-red-400">0.014</span>
                  <span className="text-xs text-gray-500 mt-2">Converging nicely</span>
               </div>
            </div>

            {/* Chart Area Mock */}
            <div className="bg-[#141525] border border-[#2a2b3d] rounded-lg p-4 h-64 flex flex-col">
               <h3 className="text-sm font-bold text-gray-300 mb-4">Training Progress</h3>
               <div className="flex-1 border-l border-b border-[#2a2b3d] relative mx-4 mb-4">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                     {/* Reward Line */}
                     <path d="M0,80 Q20,60 40,50 T70,30 T100,10" fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                     {/* Loss Line */}
                     <path d="M0,20 Q20,30 40,70 T70,85 T100,90" fill="none" stroke="#f87171" strokeWidth="2" strokeDasharray="4,4" vectorEffect="non-scaling-stroke"/>
                  </svg>
                  <span className="absolute -left-8 bottom-0 text-[10px] text-gray-500">0</span>
                  <span className="absolute -left-10 top-0 text-[10px] text-gray-500">100</span>
               </div>
            </div>
            
            {/* Hyperparameters */}
            <div className="bg-[#141525] border border-[#2a2b3d] rounded-lg p-4">
               <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2"><Settings size={16}/> Hyperparameters</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1 bg-[#0a0a0f] p-2 rounded border border-[#2a2b3d]"><span className="text-[10px] text-gray-500 uppercase">Learning Rate</span><span className="text-xs font-mono">0.0003</span></div>
                  <div className="flex flex-col gap-1 bg-[#0a0a0f] p-2 rounded border border-[#2a2b3d]"><span className="text-[10px] text-gray-500 uppercase">Batch Size</span><span className="text-xs font-mono">256</span></div>
                  <div className="flex flex-col gap-1 bg-[#0a0a0f] p-2 rounded border border-[#2a2b3d]"><span className="text-[10px] text-gray-500 uppercase">Discount Factor (γ)</span><span className="text-xs font-mono">0.99</span></div>
                  <div className="flex flex-col gap-1 bg-[#0a0a0f] p-2 rounded border border-[#2a2b3d]"><span className="text-[10px] text-gray-500 uppercase">Algorithm</span><span className="text-xs font-mono text-emerald-400">PPO</span></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
