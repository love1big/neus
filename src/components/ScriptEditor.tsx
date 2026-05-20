import React, { useState, useEffect } from 'react';
import {
  Code2, Terminal, Play, Save, ChevronRight, Hash, 
  GitBranch, Box, FileJson, BrainCircuit, Network, 
  ActivitySquare, Bot, Variable, Braces, Binary, Repeat, ArrowRight, CheckCircle2, Download, RefreshCw,
  Settings2, Activity, AlignLeft, ShieldCheck, Zap
} from 'lucide-react';

export default function ScriptEditor() {
  const [activeTab, setActiveTab] = useState<'Code' | 'AST' | 'Thread' | 'Algorithm' | 'Translator'>('Code');
  
  // Instance Edit State
  const [isInstanceEditMode, setIsInstanceEditMode] = useState(false);
  const [instanceName, setInstanceName] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('editInstanceContext') === 'true') {
      setIsInstanceEditMode(true);
      setInstanceName(sessionStorage.getItem('editInstanceName') || 'Instance');
    }
  }, []);

  const handleReturnToMap = () => {
    sessionStorage.removeItem('editInstanceContext');
    sessionStorage.removeItem('editInstanceName');
    setIsInstanceEditMode(false);
    alert(`Script/Logic for [${instanceName}] saved to map override. Please select MapEdit from the side panel to return.`);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#8b949e] font-sans relative">
       {/* Instance Edit Override Banner */}
       {isInstanceEditMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-[#ff7b72]/10 border border-[#ff7b72]/30 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-3 shadow-[0_0_15px_rgba(255,123,114,0.1)] group cursor-default">
             <div className="relative">
               <span className="text-[11px] text-white font-bold tracking-wider flex items-center gap-2">
                 <span className="text-[#ff7b72]"><Terminal size={14} className="inline-block" /> SCRIPT OVERRIDE:</span> {instanceName}
               </span>
               <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-[#161b22] border border-[#30363d] rounded-lg p-3 hidden group-hover:block shadow-2xl">
                  <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-2 border-b border-[#30363d] pb-1">Unlinked Properties</div>
                  <ul className="text-[11px] space-y-1 text-white mb-3">
                     <li className="flex justify-between"><span>Base.cs</span> <span className="text-[#3fb950]">Lines 45-80 Overridden</span></li>
                     <li className="flex justify-between"><span>Local Variables</span> <span className="text-[#3fb950]">Unique Values</span></li>
                  </ul>
                  <button onClick={() => alert('Reverted script overrides to Base Blueprint defaults.')} className="w-full text-left px-2 py-1 text-[11px] hover:bg-[#21262d] rounded text-[#ff7b72] flex items-center gap-2 transition-colors mb-1"><Hash size={14}/> Revert to Base Blueprint</button>
                  <button onClick={() => alert('Script changes applied to the Base Blueprint. All other instances will inherit these changes.')} className="w-full text-left px-2 py-1 text-[11px] hover:bg-[#21262d] rounded text-[#58a6ff] flex items-center gap-2 transition-colors"><Save size={14}/> Apply to Base Blueprint</button>
               </div>
             </div>
             <div className="w-[1px] h-3 bg-[#ff7b72]/20"></div>
             <button 
               onClick={handleReturnToMap}
               className="text-[10px] text-[#0d1117] bg-[#ff7b72] hover:bg-[#f85149] px-2 py-0.5 rounded font-bold transition-colors"
             >
               Commit to Level
             </button>
          </div>
       )}

       <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#bc8cff]/10 to-transparent pointer-events-none"></div>
        <Code2 size={28} className="text-[#bc8cff] mr-4 shadow-[0_0_15px_rgba(188,140,255,0.4)]" />
        <div className="flex flex-col z-10">
          <h2 className="text-[#c9d1d9] text-[16px] font-bold tracking-tight">Code & Logic Engine (Quantum V-8)</h2>
          <p className="text-[11px]">Local LLM Copilot, 4D AST, CPU Multi-threading Profiler, Universal Code Translator.</p>
        </div>
      </div>

      <div className="flex bg-[#161b22] border-b border-[#30363d] h-10 px-4 shrink-0 overflow-x-auto">
        <button onClick={() => setActiveTab('Code')} className={`px-4 shrink-0 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Code' ? 'text-[#58a6ff] border-b-2 border-[#58a6ff] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Terminal size={14}/> IDE Copilot</button>
        <button onClick={() => setActiveTab('AST')} className={`px-4 shrink-0 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'AST' ? 'text-[#3fb950] border-b-2 border-[#3fb950] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Network size={14}/> 4D AST Manager</button>
        <button onClick={() => setActiveTab('Thread')} className={`px-4 shrink-0 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Thread' ? 'text-[#f85149] border-b-2 border-[#f85149] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><GitBranch size={14}/> Thread Viewer</button>
        <button onClick={() => setActiveTab('Algorithm')} className={`px-4 shrink-0 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Algorithm' ? 'text-[#e3b341] border-b-2 border-[#e3b341] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><ActivitySquare size={14}/> Algo Visualizer</button>
        <button onClick={() => setActiveTab('Translator')} className={`px-4 shrink-0 h-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 ${activeTab === 'Translator' ? 'text-[#ff7b72] border-b-2 border-[#ff7b72] bg-[#0a0a0a]' : 'hover:text-[#c9d1d9]'}`}><Repeat size={14}/> Universal Translator</button>
      </div>

      <div className="flex-1 overflow-hidden relative">
         {activeTab === 'Code' && <LocalLLMEditor />}
         {activeTab === 'AST' && <ASTManager />}
         {activeTab === 'Thread' && <ThreadViewer />}
         {activeTab === 'Algorithm' && <AlgoVisualizer />}
         {activeTab === 'Translator' && <CodeTranslator />}
      </div>
    </div>
  );
}

function LocalLLMEditor() {
  return (
    <div className="flex h-full">
       <div className="flex-1 flex flex-col bg-[#050505]">
          <div className="flex border-b border-[#30363d] bg-[#0d1117]">
             <div className="px-4 py-2 border-r border-[#30363d] text-[11px] font-mono text-[#58a6ff] bg-[#161b22]">AI_Agent.cpp</div>
             <div className="px-4 py-2 border-r border-[#30363d] text-[11px] font-mono text-[#8b949e]">AI_Agent.h</div>
             <div className="px-4 py-2 border-r border-[#30363d] text-[11px] font-mono text-[#8b949e]">SystemManager.cpp</div>
          </div>
          
          <div className="flex-1 p-4 font-mono text-[13px] relative overflow-hidden">
             {/* Lines */}
             <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0d1117] border-r border-[#30363d] flex flex-col items-end px-2 py-4 text-[#8b949e] select-none">
                {[...Array(20)].map((_, i) => <div key={i}>{i+1}</div>)}
             </div>
             
             {/* Code Mockup */}
             <pre className="pl-16 pr-4 py-4 text-[#c9d1d9] leading-6">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">"AI_Agent.h"</span><br/><br/>
                <span className="text-[#d2a8ff]">AAI_Agent</span>::<span className="text-[#d2a8ff]">AAI_Agent</span>()<br/>
                <span className="text-[#c9d1d9]">&#123;</span><br/>
                <span className="text-[#8b949e]">    // Automatically configure Pawn tick generation</span><br/>
                <span className="text-[#c9d1d9]">    PrimaryActorTick.bCanEverTick = true;</span><br/><br/>
                <span className="bg-[#bc8cff]/20 outline outline-1 outline-[#bc8cff]">    AutoPossessAI = EAutoPossessAI::PlacedInWorldOrSpawned; <span className="text-[#bc8cff] italic border border-[#bc8cff]/50 px-2 py-0.5 rounded text-[10px] ml-2">🤖 Copilot: AutoPossessAI is recommended for AI Pawns to initialize their controllers immediately. (Tab to Accept)</span></span><br/>
                <span className="text-[#c9d1d9]">    AIControllerClass = AAIController::StaticClass();</span><br/>
                <span className="text-[#c9d1d9]">&#125;</span><br/>
             </pre>
          </div>
       </div>

       <div className="w-[350px] bg-[#161b22] border-l border-[#30363d] flex flex-col pt-4">
          <div className="px-4 pb-2 border-b border-[#30363d] flex justify-between items-center text-[12px] uppercase font-bold tracking-wider text-[#bc8cff]">
             <span className="flex items-center gap-2"><BrainCircuit size={14}/> Local LLM Copilot</span>
          </div>

          <div className="flex flex-col p-4 gap-4 flex-1">
             <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-[#8b949e] uppercase">Active Weights / Model</label>
                <select className="bg-[#0a0a0a] border border-[#30363d] text-white p-2 text-[11px] outline-none rounded font-mono">
                   <option>Llama-3-Code-Instruct-8B</option>
                   <option>DeepSeek-Coder-33B</option>
                   <option>Custom_Refactor_Weights.safetensors</option>
                </select>
             </div>
             
             <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-3 flex flex-col gap-2">
                 <button className="bg-[#161b22] border border-[#bc8cff]/50 text-[#bc8cff] py-1.5 rounded text-[10px] font-bold uppercase hover:bg-[#bc8cff] hover:text-black transition-colors">
                    Security Vulnerability Scan
                 </button>
                 <button className="bg-[#161b22] border border-[#f85149]/50 text-[#f85149] py-1.5 rounded text-[10px] font-bold uppercase hover:bg-[#f85149] hover:text-black transition-colors">
                    Convert C++ to Rust (1s)
                 </button>
                 <button className="bg-[#161b22] border border-[#58a6ff]/50 text-[#58a6ff] py-1.5 rounded text-[10px] font-bold uppercase hover:bg-[#58a6ff] hover:text-black transition-colors">
                    Structural Refactor
                 </button>
             </div>
          </div>
       </div>
    </div>
  )
}

function ASTManager() {
   return (
      <div className="flex flex-col h-full bg-[#050505] relative p-6">
         <div className="absolute top-6 left-6 z-10 flex flex-col">
            <h1 className="text-white text-[24px] font-bold tracking-tight mb-1 flex items-center gap-2"><Network className="text-[#3fb950]"/> 4D Abstract Syntax Tree (AST)</h1>
            <p className="text-[#8b949e] text-[12px]">Transforms raw code blocks into spatial nodes to view Data Flow and Memory Bottlenecks.</p>
         </div>

         <div className="flex-1 border border-[#30363d] bg-[#161b22] rounded-lg mt-16 p-4 relative overflow-hidden flex items-center justify-center">
             
             {/* Node Mockups */}
             <div className="absolute top-[20%] left-[20%] bg-[#0a0a0a] border-2 border-[#58a6ff] w-48 rounded p-3 shadow-lg">
                <div className="text-[10px] font-bold text-[#58a6ff] uppercase border-b border-[#30363d] pb-1 mb-2">Class Initialization</div>
                <div className="text-[11px] font-mono text-white">USystemManager</div>
             </div>

             <div className="absolute top-[50%] left-[50%] bg-[#0a0a0a] border-2 border-[#e3b341] w-48 rounded p-3 shadow-lg -translate-x-1/2 -translate-y-1/2">
                <div className="text-[10px] font-bold text-[#e3b341] uppercase border-b border-[#30363d] pb-1 mb-2">For Loop (Array)</div>
                <div className="text-[11px] font-mono text-white">Workers.Num()</div>
                <div className="absolute -right-2 top-1/2 w-4 h-4 rounded-full bg-[#f85149] animate-ping"></div>
                <div className="absolute -right-24 top-1/2 transform -translate-y-1/2 text-[#f85149] text-[9px] font-bold uppercase bg-[#f85149]/20 p-1 border border-[#f85149] rounded">Memory Bottleneck</div>
             </div>

             <div className="absolute top-[80%] left-[80%] bg-[#0a0a0a] border-2 border-[#3fb950] w-48 rounded p-3 shadow-lg -translate-x-1/2 -translate-y-1/2">
                <div className="text-[10px] font-bold text-[#3fb950] uppercase border-b border-[#30363d] pb-1 mb-2">Method Call</div>
                <div className="text-[11px] font-mono text-white">Worker.Awake()</div>
             </div>

             {/* Connection Lines */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#58a6ff]" strokeWidth="2" fill="none">
                <path d="M 150 150 Q 300 150 450 250" strokeDasharray="5,5" />
                <path d="M 550 250 C 650 250 650 400 750 400" />
             </svg>
         </div>
      </div>
   )
}

function ThreadViewer() {
   return (
      <div className="flex flex-col h-full bg-[#050505] p-6">
         <div className="flex justify-between items-start mb-6">
            <div>
               <h1 className="text-white text-[24px] font-bold tracking-tight mb-1 flex items-center gap-2"><GitBranch className="text-[#f85149]"/> Realtime Multi-threading Profiler</h1>
               <p className="text-[#8b949e] text-[12px]">Track CPU cores and highlight Race Conditions or Deadlocks perfectly synced to your code frame.</p>
            </div>
            <div className="flex gap-2">
               <button className="bg-[#161b22] border border-[#f85149] text-[#f85149] px-4 py-2 rounded text-[11px] font-bold uppercase tracking-widest"><Binary size={14} className="inline mr-2"/> Force Deadlock Dump</button>
            </div>
         </div>

         <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg p-6 flex flex-col gap-4 overflow-y-auto">
            {/* Timeline header */}
            <div className="flex border-b border-[#30363d] pb-2 text-[10px] text-[#8b949e] font-mono pl-32 relative">
               <span className="absolute left-4 uppercase font-bold text-white">Threads</span>
               <div className="flex-1 flex justify-between">
                  <span>0.0ms</span>
                  <span>1.0ms</span>
                  <span>2.0ms</span>
                  <span>3.0ms</span>
               </div>
               {/* Scrubber Line */}
               <div className="absolute w-[2px] bg-white h-full bottom-0 left-[60%] z-20"></div>
            </div>

            {/* Threads */}
            <ThreadTrack name="MainThread" color="#58a6ff" blocks={[{start: 0, width: 40, label: 'Tick()'}, {start: 45, width: 20, label: 'Physics'}]} />
            <ThreadTrack name="Worker_1" color="#3fb950" blocks={[{start: 10, width: 30, label: 'Pathfinding'}]} />
            <ThreadTrack name="Worker_2" color="#e3b341" blocks={[{start: 10, width: 15, label: 'Pathfinding'}, {start: 25, width: 40, label: 'AI_Update'}]} />
            
            {/* Collision! */}
            <div className="flex items-center gap-4 relative">
               <div className="w-28 text-[11px] font-mono font-bold text-white uppercase text-right">Worker_3 (Race)</div>
               <div className="flex-1 bg-[#0a0a0a] h-8 rounded relative border border-[#30363d]">
                  <div className="absolute top-1 bottom-1 bg-[#bc8cff] rounded px-2 text-[10px] text-black font-bold flex items-center overflow-hidden whitespace-nowrap" style={{ left: '50%', width: '30%' }}>Write_MemoryBlock</div>
                  
                  {/* Race condition bang! */}
                  <div className="absolute top-1/2 left-[55%] w-8 h-8 rounded-full bg-[#f85149] text-black flex items-center justify-center -translate-y-1/2 -translate-x-1/2 shadow-[0_0_20px_rgba(248,81,73,0.8)] font-bold text-[14px] z-30 pointer-events-none animate-ping">
                  </div>
                  <div className="absolute top-10 left-[55%] bg-[#f85149] text-black px-2 py-1 text-[10px] font-bold rounded shadow-lg z-40 transform -translate-x-1/2 whitespace-nowrap uppercase">
                     Race Condition: Pointer Access
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

function ThreadTrack({ name, color, blocks }: { name: string, color: string, blocks: any[] }) {
   return (
      <div className="flex items-center gap-4 relative">
         <div className="w-28 text-[11px] font-mono font-bold text-white uppercase text-right" style={{color}}>{name}</div>
         <div className="flex-1 bg-[#0a0a0a] h-8 rounded relative border border-[#30363d]">
            {blocks.map((b, i) => (
               <div key={i} className="absolute top-1 bottom-1 rounded px-2 text-[10px] text-black font-bold flex items-center overflow-hidden whitespace-nowrap" style={{ left: `${b.start}%`, width: `${b.width}%`, backgroundColor: color }}>
                  {b.label}
               </div>
            ))}
         </div>
      </div>
   )
}

function AlgoVisualizer() {
   return (
      <div className="flex flex-col h-full bg-[#050505] p-6">
         <div className="flex justify-between items-start mb-6">
            <div>
               <h1 className="text-white text-[24px] font-bold tracking-tight mb-1 flex items-center gap-2"><ActivitySquare className="text-[#e3b341]"/> Algorithmic Concept Visualizer</h1>
               <p className="text-[#8b949e] text-[12px]">Instantly renders complex mathematical arrays or graphing code into understandable shapes (e.g. A* Pathfinding visual).</p>
            </div>
         </div>

         <div className="flex-1 flex gap-6">
            <div className="w-1/3 bg-[#161b22] border border-[#30363d] rounded-lg p-4 font-mono text-[11px] text-white">
               <span className="text-[#8b949e] mb-2 block">// Current Function Scope Analysed</span>
               <span className="text-[#ff7b72]">function</span> <span className="text-[#d2a8ff]">AStarFindPath</span>(start, goal) &#123;<br/>
               &nbsp;&nbsp;let openSet = [start];<br/>
               &nbsp;&nbsp;let closedSet = [];<br/>
               <br/>
               &nbsp;&nbsp;<span className="text-[#ff7b72]">while</span> (openSet.length &gt; 0) &#123;<br/>
               &nbsp;&nbsp;&nbsp;&nbsp;let current = GetLowestF(openSet);<br/>
               &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#8b949e]">// ... expansion logic</span><br/>
               &nbsp;&nbsp;&#125;<br/>
               &#125;
            </div>

            <div className="flex-1 bg-[#0a0a0a] border border-[#30363d] rounded-lg relative flex items-center justify-center shadow-inner">
               <span className="absolute top-4 left-4 text-[#8b949e] uppercase font-bold text-[10px]">Real-time Visualization</span>
               
               {/* 2D Grid Mockup */}
               <div className="grid grid-cols-10 grid-rows-10 gap-1 opacity-50 select-none">
                  {[...Array(100)].map((_, i) => {
                     let bg = '#161b22';
                     // Mocking a path
                     if (i === 11) bg = '#3fb950'; // start
                     if (i === 88) bg = '#f85149'; // goal
                     if ([22,33,44,45,46,57,67,78].includes(i)) bg = '#e3b341'; // path
                     if ([3,13,23,34,55,65,75,85].includes(i)) bg = '#30363d'; // walls/closed
                     return <div key={i} className="w-6 h-6 border border-[#30363d] rounded-sm" style={{ backgroundColor: bg }}></div>
                  })}
               </div>
            </div>
         </div>
      </div>
   )
}

function CodeTranslator() {
  const [sourceLang, setSourceLang] = useState('c');
  const [targetLang, setTargetLang] = useState('php');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationStep, setTranslationStep] = useState(0);
  const [sourceCode, setSourceCode] = useState('#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}');
  const [translatedCode, setTranslatedCode] = useState('<?php\n\n// Translation will appear here.\n\n?>');
  const [aiModel, setAiModel] = useState('deepseek');
  const [settings, setSettings] = useState({
    idiomatic: true,
    preserveComments: true,
    generateExplanations: false,
    strictTyping: true,
    frameworkMapping: false
  });

  const languages = [
    { id: 'c', name: 'C' },
    { id: 'cpp', name: 'C++' },
    { id: 'csharp', name: 'C#' },
    { id: 'html', name: 'HTML' },
    { id: 'php', name: 'PHP' },
    { id: 'js', name: 'JavaScript' },
    { id: 'ts', name: 'TypeScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'go', name: 'Go' },
    { id: 'rust', name: 'Rust' },
  ];

  const models = [
    { id: 'deepseek', name: 'DeepSeek Coder V2 236B' },
    { id: 'llama3', name: 'Llama 3 70B Instruct' },
    { id: 'codellama', name: 'CodeLlama 34B' },
    { id: 'tensorrt', name: 'TensorRT-LLM Fast' },
  ];

  const steps = [
    "Parsing Source AST (Abstract Syntax Tree)...",
    "Performing Semantic Analysis & Dependency Graphing...",
    "Cross-Language Type Inference (AI Interpolation)...",
    "Syntactic Transformation to Target Language...",
    "Applying Target Language Idioms & Optimization...",
    "Validating Translated Code Structural Integrity..."
  ];

  const handleTranslate = () => {
    setIsTranslating(true);
    setTranslationStep(0);
    setTranslatedCode('');
    
    // Simulate steps
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setTranslationStep(currentStep);
      } else {
        clearInterval(interval);
        
        let mockContent = `/*\n * Universal Code Translator - Translation Report\n`;
        mockContent += ` * Model          : ${models.find(m => m.id === aiModel)?.name}\n`;
        mockContent += ` * Source         : ${languages.find(l => l.id === sourceLang)?.name}\n`;
        mockContent += ` * Target         : ${languages.find(l => l.id === targetLang)?.name}\n`;
        mockContent += ` * Params         : Idiomatic=${settings.idiomatic}, Explanations=${settings.generateExplanations}\n`;
        mockContent += ` * AST Confidence : ${(Math.random() * 10 + 90).toFixed(2)}%\n`;
        mockContent += ` * Time taken     : ${((Math.random() * 2) + 1.5).toFixed(2)}s\n`;
        mockContent += ` */\n\n`;

        // Naive translation logic mockup for presentation
        if (sourceLang === 'html' && targetLang === 'c') {
           mockContent += `void renderNode() {\n    printf("Rendering HTML Node:\\n");\n${sourceCode.split('\n').map(l => '    printf("' + l.replace(/"/g, '\\\\"') + '\\\\n");').join('\n')}\n}`;
        } else if (sourceLang === 'html' && targetLang === 'csharp') {
           mockContent += `public void RenderNode() {\n    Console.WriteLine("Rendering HTML Node:");\n${sourceCode.split('\n').map(l => '    Console.WriteLine("' + l.replace(/"/g, '\\\\"') + '");').join('\n')}\n}`;
        } else if (sourceLang === 'c' && targetLang === 'html') {
           mockContent += `<!-- Generated from C -->\n<pre><code class="language-c">\n${sourceCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}\n</code></pre>`;
        } else if (sourceLang === 'c' && targetLang === 'php') {
           mockContent += `<?php\n\n// PHP version of C code\necho "Execution begins\\n";\n${sourceCode.split('\n').map(l => '// ' + l).join('\n')}\n\n?>`;
        } else {
           if(settings.generateExplanations) mockContent += `// Note: Ensure that environment standard lib supports this logic.\n`;
           
           if(settings.idiomatic) {
              mockContent += `// Auto-refactored to idiomatic ${languages.find(l => l.id === targetLang)?.name}\n`;
           }
           mockContent += `${sourceCode.split('\n').map(l => '// ' + l).join('\n')}\n\n// ... translation complete.`;
        }
        
        setTranslatedCode(mockContent);
        setIsTranslating(false);
      }
    }, 600); // Step every 600ms
  };

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      <div className="flex border-b border-[#30363d] bg-[#161b22] px-4 py-3 items-center justify-between">
        <div className="flex items-center gap-3">
          <Repeat className="text-[#ff7b72]" size={18} />
          <h2 className="text-[#c9d1d9] font-bold text-[14px]">Universal Code Translator</h2>
          <span className="bg-[#ff7b72]/10 text-[#ff7b72] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-[#ff7b72]/20 shadow-[0_0_10px_rgba(255,123,114,0.15)]">Powered by Offline Local AI</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Settings Sidebar */}
        <div className="w-[280px] bg-[#0d1117] border-r border-[#30363d] p-4 flex flex-col gap-5 overflow-y-auto shrink-0">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#8b949e] uppercase flex items-center gap-1.5"><BrainCircuit size={12}/> AI Engine Model</label>
            <select 
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="bg-[#0a0a0a] border border-[#30363d] text-white p-2 text-[11px] outline-none rounded font-mono"
            >
              {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-[#8b949e] uppercase flex items-center gap-1.5 border-b border-[#30363d] pb-1"><Settings2 size={12}/> Translation Parameters</label>
            
            {[
              { id: 'idiomatic', label: 'Idiomatic Refactoring', desc: 'Rewrite natively rather than 1:1 map', icon: <Zap size={10}/> },
              { id: 'preserveComments', label: 'Preserve Comments', desc: 'Keep original code comments', icon: <AlignLeft size={10}/> },
              { id: 'generateExplanations', label: 'Generate Explanations', desc: 'Add AI comments explaining choices', icon: <Bot size={10}/> },
              { id: 'strictTyping', label: 'Strict Static Typing', desc: 'Enforce strong types (TS/Rust/C++)', icon: <ShieldCheck size={10}/> },
              { id: 'frameworkMapping', label: 'Framework Mapping', desc: 'Map standard libraries (e.g., STD -> Node)', icon: <Network size={10}/> },
            ].map(setting => (
              <label key={setting.id} className="flex items-start gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={(settings as any)[setting.id]} 
                  onChange={(e) => setSettings({...settings, [setting.id]: e.target.checked})}
                  className="mt-1 accent-[#bc8cff]"
                />
                <div className="flex flex-col">
                  <span className={`text-[12px] group-hover:text-white transition-colors flex items-center gap-1.5 ${(settings as any)[setting.id] ? 'text-white font-semibold' : 'text-[#c9d1d9]'}`}>
                    {setting.label}
                  </span>
                  <span className="text-[10px] text-[#8b949e]">{setting.desc}</span>
                </div>
              </label>
            ))}
          </div>

           <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-[#30363d]">
              <div className="text-[10px] font-bold text-[#8b949e] uppercase mb-1">Live Engine Metrics</div>
              <div className="flex justify-between items-center text-[10px] bg-[#161b22] px-2 py-1.5 rounded border border-[#30363d]">
                 <span className="text-[#8b949e]">Max Context</span>
                 <span className="text-[#58a6ff] font-mono">128k Tokens</span>
              </div>
              <div className="flex justify-between items-center text-[10px] bg-[#161b22] px-2 py-1.5 rounded border border-[#30363d]">
                 <span className="text-[#8b949e]">Execution</span>
                 <span className="text-[#3fb950] font-mono">Local NPU</span>
              </div>
           </div>
        </div>

        <div className="flex-1 flex gap-4 p-4 overflow-hidden relative">
          {/* Source Panel */}
          <div className="flex-1 flex flex-col bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
            <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#8b949e] uppercase">Source Code</span>
              </div>
              <select 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] text-[11px] px-2 py-1 rounded outline-none focus:border-[#58a6ff]"
              >
                {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="flex-1 p-0 relative">
              <textarea 
                className="w-full h-full bg-transparent text-[#c9d1d9] font-mono text-[13px] p-4 outline-none resize-none"
                placeholder={'Paste your code here...'}
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                spellCheck="false"
              />
            </div>
          </div>

          {/* Action Column */}
          <div className="flex flex-col justify-center items-center gap-4 px-2">
            <button 
              onClick={handleTranslate}
              disabled={isTranslating}
              className="w-12 h-12 bg-[#ff7b72]/10 hover:bg-[#ff7b72]/20 border border-[#ff7b72]/30 rounded-full flex items-center justify-center text-[#ff7b72] transition-colors relative group disabled:opacity-50"
              title="Translate Code"
            >
              {isTranslating ? <div className="animate-spin"><RefreshCw size={20} /></div> : <ArrowRight size={24} />}
            </button>
            <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-[#30363d] to-transparent"></div>
          </div>

          {/* Target Panel */}
          <div className="flex-1 flex flex-col bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden relative">
            <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#8b949e] uppercase">Translated Code</span>
              </div>
              <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-[#0a0a0a] border border-[#30363d] text-[#c9d1d9] text-[11px] px-2 py-1 rounded outline-none focus:border-[#ff7b72]"
              >
                {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="flex-1 relative">
              {isTranslating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-[#0a0a0a] z-10 p-8 text-center">
                  <div className="relative">
                     <BrainCircuit size={56} className="text-[#ff7b72] animate-[pulse_1.5s_ease-in-out_infinite]" />
                     <div className="absolute inset-0 border-4 border-[#ff7b72]/30 rounded-full animate-ping"></div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                     <div className="text-[14px] font-bold text-white uppercase tracking-widest">{steps[translationStep]}</div>
                     <div className="text-[11px] font-mono text-[#8b949e]">Analyzing AST & Transpiling to {languages.find(l => l.id === targetLang)?.name} using {models.find(m => m.id === aiModel)?.name}...</div>
                  </div>
                  
                  <div className="w-64 h-1.5 bg-[#21262d] rounded-full overflow-hidden mt-4 relative">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#bc8cff] to-[#ff7b72] transition-all duration-500 ease-out"
                      style={{ width: `${((translationStep + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="h-full relative group">
                  <textarea 
                    className="w-full h-full bg-transparent text-[#c9d1d9] font-mono text-[13px] p-4 outline-none resize-none"
                    readOnly
                    value={translatedCode}
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="bg-[#21262d] border border-[#30363d] px-3 py-1.5 rounded text-[#c9d1d9] text-[11px] font-bold hover:bg-[#30363d] flex items-center gap-1.5">
                        <ActivitySquare size={12} /> View AST
                     </button>
                     <button className="bg-[#21262d] border border-[#30363d] px-3 py-1.5 rounded text-[#c9d1d9] text-[11px] font-bold hover:bg-[#30363d] flex items-center gap-1.5">
                        <Download size={12} /> Export
                     </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
