import React, { useState } from 'react';
import { BrainCircuit, Play, Square, Settings, Activity, Network, LineChart, Zap, Target } from 'lucide-react';

export default function MLAgentsEditor() {
  const [training, setTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);

  // simulate training
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (training) {
      interval = setInterval(() => {
        setEpoch(prev => prev + 10);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [training]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#c9d1d9]">
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3fb950]/10 to-transparent pointer-events-none"></div>
        <BrainCircuit className="text-[#3fb950] mr-4 shadow-[0_0_15px_rgba(63,185,80,0.4)]" size={32} />
        <div>
          <h2 className="text-white text-[16px] font-bold tracking-tight">Machine Learning Agents Training Room</h2>
          <p className="text-[#8b949e] text-[11px]">Train neural networks via reinforcement learning using PPO or SAC directly inside the engine.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-12 gap-6 h-full">
          
          {/* Left Config Panel */}
          <div className="col-span-4 bg-[#161b22] border border-[#30363d] rounded-lg p-5 flex flex-col">
             <h3 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2"><Settings size={16}/> Environment Config</h3>
             <div className="space-y-4 flex-1">
               <div>
                  <span className="text-[#8b949e] text-[11px] block mb-1">Algorithm</span>
                  <select className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white outline-none text-[12px]">
                    <option selected>PPO (Proximal Policy Optimization)</option>
                    <option>SAC (Soft Actor-Critic)</option>
                    <option>DQN (Deep Q-Network)</option>
                  </select>
               </div>
               <div>
                  <span className="text-[#8b949e] text-[11px] block mb-1">Observation Space (Sensors)</span>
                  <select className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white outline-none text-[12px]">
                    <option selected>Raycast 3D (Vision)</option>
                    <option>Camera Render Texture (Pixels)</option>
                    <option>Transform Vectors Only</option>
                  </select>
               </div>
               <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#8b949e]">Time Scale (Training Speed)</span>
                    <span className="text-[#3fb950] font-mono">100.0x</span>
                  </div>
                  <input type="range" className="w-full accent-[#3fb950]" defaultValue="100"/>
               </div>
             </div>

             <div className="mt-auto border-t border-[#30363d] pt-4">
               {training ? (
                 <button onClick={() => setTraining(false)} className="w-full bg-[#f85149] hover:bg-[#f85149]/80 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                   <Square size={16} fill="currentColor"/> Stop Training
                 </button>
               ) : (
                 <button onClick={() => setTraining(true)} className="w-full bg-[#3fb950] hover:bg-[#3fb950]/80 text-[#0a0a0a] font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(63,185,80,0.3)]">
                   <Play size={16} fill="currentColor"/> Start Training Session
                 </button>
               )}
             </div>
          </div>

          {/* Right Live Training Panel */}
          <div className="col-span-8 flex flex-col gap-6">
             <div className="h-64 bg-[#0d1117] border border-[#30363d] rounded-lg relative flex items-center justify-center overflow-hidden">
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-[#161b22] border border-[#30363d] text-[#8b949e] px-2 py-1 rounded text-[10px] font-mono">Concurrent Environments: 128</span>
                  <span className="bg-[#161b22] border border-[#30363d] text-[#8b949e] px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1"><Zap size={10} className="text-[#e3b341]"/> GPU Accelerated</span>
                </div>
                {training ? (
                  <div className="text-center">
                    <Network size={64} className="text-[#3fb950] mx-auto mb-4 animate-pulse opacity-50"/>
                    <div className="text-[24px] font-mono font-bold text-white tracking-widest">{epoch.toLocaleString()} <span className="text-[#8b949e] text-[12px]">STEPS</span></div>
                  </div>
                ) : (
                  <div className="text-[#8b949e] text-[12px] flex items-center gap-2"><Target size={16}/> Ready to initialize environments...</div>
                )}
             </div>

             <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg p-5">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2"><LineChart size={16} className="text-[#58a6ff]"/> Cumulative Reward Graph</h3>
               <div className="h-full relative pb-8">
                  {/* Fake Graph */}
                  <svg viewBox="0 0 100 100" className="w-full h-[200px] stroke-[#58a6ff] fill-none stroke-2" preserveAspectRatio="none">
                    {training ? (
                      <path d="M0 100 C 10 90, 40 50, 100 20" className="animate-[dash_5s_linear_forwards]" strokeDasharray="200" strokeDashoffset="0" />
                    ) : (
                       <path d="M0 100 L 100 100" className="stroke-[#30363d]"/>
                    )}
                  </svg>
                  <div className="absolute bottom-4 left-0 text-[#8b949e] text-[10px]">Episode Length</div>
                  <div className="absolute top-0 left-0 text-[#58a6ff] text-[10px]">Max Reward</div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
