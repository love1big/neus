import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Loader2, Server, FileText, Image as ImageIcon, Box, ShieldCheck, GitCommit, ArrowRight } from 'lucide-react';

export default function PipelineEditor() {
  const [pipelineState, setPipelineState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [masterPrompt, setMasterPrompt] = useState('Create 10 NPCs for a cyberpunk world. Include rich lore, 6-angle orthographic concept art, 3D models with rigging, and QA check them to 95% accuracy against the lore.');
  
  // Steps state
  const [activeStep, setActiveStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const steps = [
    { id: 0, title: 'Overlord AI (Commander)', desc: 'Parsing prompt, allocating Swarm agents.', icon: <Server size={18} /> },
    { id: 1, title: 'LoreMaster AI (Story / Writer)', desc: 'Generating infinite lore, balancing stats, naming 10 NPCs.', icon: <FileText size={18} /> },
    { id: 2, title: 'TextureDiff AI (Concept Art)', desc: 'Rendering Front/Back/Left/Right/Top/Bottom sheets.', icon: <ImageIcon size={18} /> },
    { id: 3, title: 'MeshGenius AI (3D Modeler)', desc: 'Baking OBJ/GLTF meshes & Auto-Rigging.', icon: <Box size={18} /> },
    { id: 4, title: 'Overlord QA Validator', desc: 'Verifying 3D model vs Lore (Threshold: 95% Match).', icon: <ShieldCheck size={18} /> }
  ];

  const handleStartPipeline = () => {
    if (!masterPrompt.trim()) return;
    setPipelineState('running');
    setActiveStep(0);
    setProgress(0);
    setLogs(['[Swarm Commander] Initializing multi-agent pipeline...', 'Allocating local VRAM for 5 concurrent agents.']);
  };

  useEffect(() => {
    if (pipelineState === 'running') {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress >= 100) {
          currentProgress = 100;
        }
        setProgress(currentProgress);

        if (currentProgress === 100) {
          clearInterval(interval);
          setLogs(prev => [...prev, `[Step ${activeStep + 1} Completed] Data serialized to next agent.`]);
          
          if (activeStep < steps.length - 1) {
            setTimeout(() => {
              setActiveStep(prev => prev + 1);
              setProgress(0);
              if (activeStep + 1 === 4) {
                 setLogs(prev => [...prev, '[QA Check] Validating vertex counts against lore physical descriptions...', '[QA Check] Confidence Score: 98.4%. Validation Passed.']);
              }
            }, 1000);
          } else {
            setPipelineState('completed');
            setLogs(prev => [...prev, '[Swarm Commander] Pipeline executed successfully. All assets imported to Content Browser.']);
          }
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [pipelineState, activeStep]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] font-['Helvetica_Neue',Arial,sans-serif] p-6 overflow-hidden">
      
      <div className="flex items-center gap-2 mb-6 border-b border-[#30363d] pb-4 shrink-0">
        <GitCommit className="text-[#58a6ff]" size={24} />
        <div>
          <h1 className="text-lg font-bold text-[#c9d1d9] leading-tight">Swarm AI Pipeline (Orchestrator)</h1>
          <p className="text-[12px] text-[#8b949e]">Command the offline Swarm. Chain agents together for automated pipelines (Story ➔ 2D Concept ➔ 3D Mesh ➔ QA Check).</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Side: Prompt & Logs */}
        <div className="w-full lg:w-[40%] flex flex-col gap-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col">
            <label className="text-[12px] font-bold text-[#8b949e] uppercase tracking-wider mb-2">Commander Prompt</label>
            <textarea 
              className="bg-[#0d1117] border border-[#30363d] rounded p-3 text-[13px] text-[#c9d1d9] resize-none h-[120px] focus:border-[#58a6ff] outline-none custom-scrollbar transition-colors"
              value={masterPrompt}
              onChange={(e) => setMasterPrompt(e.target.value)}
              disabled={pipelineState === 'running'}
              placeholder="E.g. Create 10 NPCs, write lore, generate 6 orthographic views, build 3D models, and verify with QA..."
            />
            <button 
              onClick={handleStartPipeline}
              disabled={pipelineState === 'running'}
              className="mt-4 flex items-center justify-center gap-2 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#21262d] disabled:text-[#8b949e] text-white py-2 rounded font-semibold text-[13px] transition-colors"
            >
              <Play size={16} /> {pipelineState === 'running' ? 'Pipeline Executing...' : 'Execute Swarm Pipeline'}
            </button>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex-1 flex flex-col min-h-0">
            <label className="text-[12px] font-bold text-[#8b949e] uppercase tracking-wider mb-2 shrink-0">Swarm Terminal Logs</label>
            <div className="bg-[#0d1117] border border-[#30363d] rounded p-3 text-[11px] font-mono text-[#c9d1d9] flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
              {logs.map((log, i) => (
                <div key={i} className={`${log.includes('[QA Check]') ? 'text-[#3fb950]' : log.includes('Completed') ? 'text-[#58a6ff]' : ''}`}>
                  &gt; {log}
                </div>
              ))}
              {pipelineState === 'running' && (
                <div className="animate-pulse text-[#8b949e]">&gt; Processing...</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Graph / Pipeline View */}
        <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg p-6 overflow-y-auto custom-scrollbar">
          <label className="text-[12px] font-bold text-[#8b949e] uppercase tracking-wider mb-6 block">Agent Work Flow</label>
          
          <div className="flex flex-col gap-4 relative">
             {/* Connecting Line */}
             <div className="absolute left-[23px] top-[24px] bottom-[24px] w-[2px] bg-[#30363d] z-0"></div>

             {steps.map((step, index) => {
               const isActive = activeStep === index;
               const isDone = activeStep > index || pipelineState === 'completed';
               
               return (
                 <div key={step.id} className={`relative z-10 flex gap-4 p-3 rounded-lg border transition-all duration-300 ${isActive ? 'bg-[#0d1117] border-[#58a6ff] shadow-[0_0_15px_rgba(88,166,255,0.15)] transform scale-[1.02]' : isDone ? 'bg-[#0d1117] border-[#3fb950]/30 opacity-70' : 'bg-[#0d1117] border-[#30363d] opacity-50'}`}>
                   
                   {/* Icon Circular Badge */}
                   <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 border ${isActive ? 'bg-[#58a6ff] border-[#58a6ff] text-black animate-pulse' : isDone ? 'bg-[#3fb950] border-[#3fb950] text-black' : 'bg-[#21262d] border-[#30363d] text-[#8b949e]'}`}>
                     {isDone ? <CheckCircle size={14} /> : isActive ? <Loader2 size={14} className="animate-spin" /> : <div className="w-2 h-2 rounded-full bg-[#8b949e]" />}
                   </div>

                   {/* Step details */}
                   <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2">
                        {step.icon}
                        <h3 className={`font-semibold text-[14px] ${isActive ? 'text-[#58a6ff]' : isDone ? 'text-[#3fb950]' : 'text-[#c9d1d9]'}`}>{step.title}</h3>
                      </div>
                      <p className="text-[12px] text-[#8b949e] mt-1">{step.desc}</p>
                      
                      {isActive && (
                         <div className="w-full bg-[#161b22] h-1.5 rounded-full mt-3 overflow-hidden border border-[#30363d]">
                            <div className="bg-[#58a6ff] h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                         </div>
                      )}
                   </div>
                 </div>
               )
             })}
          </div>

        </div>

      </div>
    </div>
  )
}
