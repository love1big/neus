import React, { useState, useEffect } from 'react';
import { Play, Pause, FastForward, Activity, Network, Dna, Cpu, GitMerge, Layers, Leaf, Skull, Award, Crosshair} from 'lucide-react';

export default function AdvancedEvolutionSystem() {
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(1);
  const [populationSize, setPopulationSize] = useState(500);
  const [mutationRate, setMutationRate] = useState(0.05);
  const [crossoverRate, setCrossoverRate] = useState(0.7);
  
  const [bestFitness, setBestFitness] = useState(0.12);
  const [avgFitness, setAvgFitness] = useState(0.04);
  const [diversity, setDiversity] = useState(85.4);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setGeneration(prev => prev + 1);
        setBestFitness(prev => Math.min(1.0, prev + Math.random() * 0.05));
        setAvgFitness(prev => Math.min(1.0, prev + Math.random() * 0.02));
        setDiversity(prev => Math.max(10, prev - Math.random() * 2));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center space-x-2">
          <Dna className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold">Evolutionary algorithm & Neuroevolution</h2>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setIsRunning(!isRunning)} className={`p-2 rounded ${isRunning ? 'bg-red-500' : 'bg-purple-600'} text-white`}>
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded">
            <FastForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings Panel */}
        <div className="w-72 border-r border-slate-700 p-4 space-y-6 overflow-y-auto bg-slate-800/50">
          <div>
            <h3 className="text-sm font-semibold text-purple-400 mb-4 flex items-center"><Activity className="w-4 h-4 mr-2" /> Hyperparameters</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="flex justify-between mb-1"><span>Population Size</span> <span>{populationSize}</span></label>
                <input type="range" min="10" max="10000" step="10" value={populationSize} onChange={(e)=>setPopulationSize(parseInt(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div>
                <label className="flex justify-between mb-1"><span>Mutation Rate</span> <span>{(mutationRate*100).toFixed(1)}%</span></label>
                <input type="range" min="0.001" max="1.0" step="0.001" value={mutationRate} onChange={(e)=>setMutationRate(parseFloat(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div>
                <label className="flex justify-between mb-1"><span>Crossover Rate</span> <span>{(crossoverRate*100).toFixed(1)}%</span></label>
                <input type="range" min="0.0" max="1.0" step="0.01" value={crossoverRate} onChange={(e)=>setCrossoverRate(parseFloat(e.target.value))} className="w-full accent-purple-500" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-purple-400 mb-4 flex items-center"><Network className="w-4 h-4 mr-2" /> Topology (NEAT)</h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-600 text-purple-500" />
                <span>Dynamic Topology (NEAT)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-600 text-purple-500" />
                <span>Speciation (Protect Innovation)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded bg-slate-900 border-slate-600 text-purple-500" />
                <span>Lamarckian Inheritance</span>
              </label>
            </div>
          </div>

          <div>
             <h3 className="text-sm font-semibold text-purple-400 mb-4 flex items-center"><Crosshair className="w-4 h-4 mr-2" /> Fitness Function</h3>
             <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs">
                <option>Locomotion (Distance traveled)</option>
                <option>Survival (Time alive)</option>
                <option>Resource Gathering</option>
                <option>Combat (Damage dealt)</option>
                <option>Custom Script...</option>
             </select>
          </div>
        </div>

        {/* Main View */}
        <div className="flex-1 p-6 flex flex-col space-y-6 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className={"rounded-lg border " + "bg-slate-800 border-slate-700"}>
              <div className={"pt-0 " + "p-4 flex flex-col items-center justify-center"}>
                <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Generation</span>
                <span className="text-3xl font-bold text-white font-mono">{generation}</span>
              </div>
            </div>
            <div className={"rounded-lg border " + "bg-slate-800 border-slate-700"}>
              <div className={"pt-0 " + "p-4 flex flex-col items-center justify-center"}>
                <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Best Fitness</span>
                <span className="text-3xl font-bold text-emerald-400 font-mono">{(bestFitness * 100).toFixed(1)}</span>
              </div>
            </div>
            <div className={"rounded-lg border " + "bg-slate-800 border-slate-700"}>
              <div className={"pt-0 " + "p-4 flex flex-col items-center justify-center"}>
                <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Avg Fitness</span>
                <span className="text-3xl font-bold text-amber-400 font-mono">{(avgFitness * 100).toFixed(1)}</span>
              </div>
            </div>
            <div className={"rounded-lg border " + "bg-slate-800 border-slate-700"}>
              <div className={"pt-0 " + "p-4 flex flex-col items-center justify-center"}>
                <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Genetic Diversity</span>
                <span className="text-3xl font-bold text-blue-400 font-mono">{diversity.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            <div className={"rounded-lg border " + "bg-slate-800 border-slate-700 flex flex-col"}>
              <div className={"flex flex-col space-y-1.5 " + "py-3 px-4 border-b border-slate-700 flex flex-row items-center justify-between"}>
                <h3 className={"font-semibold leading-none tracking-tight " + "text-sm flex items-center"}><Activity className="w-4 h-4 mr-2"/> Fitness History</h3>
              </div>
              <div className={"pt-0 " + "flex-1 p-4 relative min-h-[200px]"}>
                {/* Mock Chart */}
                <div className="absolute inset-0 m-4 border-l border-b border-slate-600 flex items-end">
                   <div className="w-full h-full relative">
                      {/* Best fitness line (mock) */}
                      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                         <path d="M0,200 Q50,180 100,100 T200,80 T300,40 T400,20" fill="none" stroke="#34d399" strokeWidth="2" />
                         <path d="M0,200 Q50,190 100,150 T200,130 T300,100 T400,90" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" />
                      </svg>
                   </div>
                </div>
              </div>
            </div>

            <div className={"rounded-lg border " + "bg-slate-800 border-slate-700 flex flex-col"}>
              <div className={"flex flex-col space-y-1.5 " + "py-3 px-4 border-b border-slate-700"}>
                <h3 className={"font-semibold leading-none tracking-tight " + "text-sm flex items-center"}><Network className="w-4 h-4 mr-2"/> Top Agent Neural Network</h3>
              </div>
              <div className={"pt-0 " + "flex-1 p-4 flex items-center justify-center relative bg-slate-900/50"}>
                 {/* Mock Neural Net visualization */}
                 <div className="flex justify-between w-full max-w-sm px-4">
                    {/* Inputs */}
                    <div className="flex flex-col space-y-4">
                       {[1,2,3,4].map(i => <div key={i} className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>)}
                    </div>
                    {/* Hidden 1 */}
                    <div className="flex flex-col space-y-2 justify-center">
                       {[1,2,3,4,5,6].map(i => <div key={i} className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>)}
                    </div>
                    {/* Hidden 2 */}
                    <div className="flex flex-col space-y-3 justify-center">
                       {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>)}
                    </div>
                    {/* Outputs */}
                    <div className="flex flex-col space-y-8 justify-center">
                       {[1,2].map(i => <div key={i} className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>)}
                    </div>
                 </div>
                 {/* SVG lines would go here connecting them */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
                    <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="white" />
                    <line x1="20%" y1="70%" x2="50%" y2="50%" stroke="white" />
                    <line x1="50%" y1="50%" x2="80%" y2="40%" stroke="white" />
                    <line x1="50%" y1="50%" x2="80%" y2="60%" stroke="white" />
                 </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
