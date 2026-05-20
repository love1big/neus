import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Paperclip, Send, Image as ImageIcon, FileVideo, FileCode, CheckCircle, Loader2, X, Mic, Link as LinkIcon, Box, UploadCloud, Cpu, AlertTriangle, MonitorPlay, ActivitySquare, ListTodo, Clock, Server } from 'lucide-react';

interface AICommandCenterProps {
  activeTool: string;
  onNavigateToMapEdit?: () => void;
  onNavigateToMonsterEdit?: () => void;
}

interface AITask {
  id: string;
  prompt: string;
  model: string;
  status: 'queued' | 'processing' | 'done';
  progress: number;
  currentStep: string;
  totalSteps: number;
  timeElapsed: number;
  timeEstimated: number; // in seconds
  logs: string[];
  fileCount: number;
}

export default function AICommandCenter({ activeTool, onNavigateToMapEdit, onNavigateToMonsterEdit }: AICommandCenterProps) {
  const [prompt, setPrompt] = useState('');
  const [attachments, setAttachments] = useState<Array<{ type: 'image' | 'video' | 'link' | 'file'; name: string, size: string }>>([]);
  const [dragActive, setDragActive] = useState(false);
  const [aiModel, setAiModel] = useState('Nexus Prime (Swarm Overlord)');
  const [modelOptions, setModelOptions] = useState<{name: string, isDownloaded: boolean}[]>([]);
  const [taskQueue, setTaskQueue] = useState<AITask[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutsRef = useRef<{ [taskId: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
     try {
       const saved = localStorage.getItem('nexus_ai_models');
       if (saved) {
         const parsed = JSON.parse(saved);
         setModelOptions(parsed.map((p: any) => ({
            name: p.name,
            isDownloaded: p.status === 'downloaded'
         })));
       }
     } catch(e) {}
  }, []);

  useEffect(() => {
    const processingIdx = taskQueue.findIndex(t => t.status === 'processing');
    const waitingIdx = taskQueue.findIndex(t => t.status === 'queued');

    if (processingIdx === -1 && waitingIdx !== -1) {
      const task = taskQueue[waitingIdx];
      
      let processSteps = [
        "Analyzing inputs & routing to specialized NPUs...",
        "Extracting spatial data from images using Vision-Transformer...",
        "Generating Orthographic Projections (Front, Back, Side, Top)...",
        "Triangulating 3D mesh via Gaussian Splatting...",
        "Retopologizing mesh for game-engine readiness (Target: 12k polys)...",
        "Baking PBR material maps (Albedo, Normal, Roughness, Metalness)...",
        "Rigging using standard UE5 Mannequin skeleton...",
        "Synthesizing idle and run animations from reference video...",
        "Finalizing asset compilation and importing to Content Browser..."
      ];
      
      if (task.fileCount > 5) {
         processSteps = [
           `Analyzing batch configuration for ${task.fileCount} input models...`,
           "Distributing 3D generation pipeline across 8 GPU nodes...",
           "Generating Orthographic Projections (Front, Back, Left, Right, Top, Bottom) in parallel...",
           "Executing Gaussian Splatting to Mesh triangulations...",
           "Auto-retopologizing batch to low-poly LODs...",
           "Baking Albedo, Normal, Metadata maps en-masse...",
           "Synthesizing NPC spawn profiles & World Data bindings...",
           "Transferring finalized assets to Map Editor -> NPCs & Monsters."
         ];
      } else if (task.model.includes('NexusCode') || task.model.includes('Command')) {
         processSteps = [
           "Parsing prompt logic and evaluating target frameworks...",
           "Building Abstract Syntax Tree in memory...",
           "Injecting 10-shot logic samples from documentation offline vector store...",
           "Generating algorithms via Speculative Decoding across 4 NPUs...",
           "Running dry compile and syntax verification (Tree-sitter)...",
           "Refactoring optimal pathing and complexity (O(N) targeting)...",
           "Applying code to target file and compiling diffs..."
         ];
      } else if (task.model.includes('LoreMaster') || task.model.includes('NPC')) {
         processSteps = [
           "Cross-referencing global WorldBible graph database...",
           "Generating faction alliances and conflicting motivations...",
           "Synthesizing 200 branching dialogue choices...",
           "Validating state machine transitions for Quest Objectives...",
           "Baking narrative weights and tagging audio lines for synthesis..."
         ];
      } else if (task.model.includes('Swarm') || task.model.includes('Prime')) {
         processSteps = [
           "Deconstructing monolithic prompt into 12 distinct sub-tasks...",
           "Assigning Task 1->3 to NexusCode Core...",
           "Assigning Task 4->7 to DesignNet-Pro...",
           "Assigning Task 8->12 to CraftsMan 3D...",
           "[Swarm Communication] Synchronizing data context between agents...",
           "Assembling multi-domain output from 3 autonomous models...",
           "Master Overlord reviewing final merged logic gate..."
         ];
      }

      setTaskQueue(prev => {
        const newQ = [...prev];
        newQ[waitingIdx] = {
           ...newQ[waitingIdx],
           status: 'processing',
           totalSteps: processSteps.length,
           timeEstimated: processSteps.length * 2, // abstract 2s per step
           logs: [`Engaging offline model grid [${task.model}]...`]
        };
        return newQ;
      });

      let step = 0;
      
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);

      intervalRef.current = setInterval(() => {
        setTaskQueue(prev => {
           const newQ = [...prev];
           const idx = newQ.findIndex(t => t.id === task.id);
           if (idx === -1) return newQ;

           // Deep copy the item to avoid mutation
           const updatedTask = { ...newQ[idx], logs: [...newQ[idx].logs] };

           if (step < processSteps.length) {
              updatedTask.progress = Math.floor(((step + 1) / processSteps.length) * 100);
              updatedTask.currentStep = processSteps[step];
              updatedTask.logs.push(processSteps[step]);
              updatedTask.timeEstimated = Math.max(0, updatedTask.timeEstimated - 2); // Time reduced as step completes
              step++;
           } else {
              updatedTask.status = 'done';
              updatedTask.progress = 100;
              updatedTask.currentStep = "COMPLETE: Engine task verified and applied.";
              updatedTask.logs.push("COMPLETE: Engine task verified and applied.");
              updatedTask.timeEstimated = 0;
              clearInterval(intervalRef.current!);
              clearInterval(timeIntervalRef.current!);
              
              // Auto remove done task after 120s so they can click the action buttons
              const t = setTimeout(() => {
                 setTaskQueue(q => q.filter(t => t.id !== task.id));
                 delete timeoutsRef.current[task.id];
              }, 120000);
              timeoutsRef.current[task.id] = t;
           }
           newQ[idx] = updatedTask;
           return newQ;
        });
      }, 2000);

      timeIntervalRef.current = setInterval(() => {
        setTaskQueue(prev => {
           const newQ = [...prev];
           const idx = newQ.findIndex(t => t.id === task.id);
           if (idx !== -1 && newQ[idx].status === 'processing') {
              const updatedTask = { ...newQ[idx] };
              updatedTask.timeElapsed += 1;
              if (updatedTask.timeEstimated > 0) {
                 updatedTask.timeEstimated = Math.max(0, updatedTask.timeEstimated - 1);
              }
              newQ[idx] = updatedTask;
           }
           return newQ;
        });
      }, 1000);
    }
  }, [taskQueue]);

  useEffect(() => {
     return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
     };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => {
         let type: 'image' | 'video' | 'file' = 'file';
         if (file.type.startsWith('image/')) type = 'image';
         if (file.type.startsWith('video/')) type = 'video';
         return { type, name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB' };
      });
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleAttach = (type: 'image' | 'video' | 'link' | 'file') => {
    const mockNames = {
      image: ['concept_art_sketch_v4.png', 'monster_batch_001.png', 'monster_batch_002.png', 'monster_batch_003.png'],
      video: ['reference_parkour_movement.mp4'],
      link: ['github.com/engine/repo'],
      file: ['game_systems_doc_final.pdf']
    };
    const mockSizes = {
      image: ['4.2 MB', '1.1 MB', '1.4 MB', '1.2 MB'],
      video: ['124 MB'],
      link: ['URL'],
      file: ['1.2 MB']
    };
    
    const names = mockNames[type];
    const sizes = mockSizes[type];
    const toAdd = names.map((name, i) => ({ type, name, size: sizes[i] }));
    
    setAttachments([...attachments, ...toAdd]);
  };

  const removeAttachment = (index: number) => {
    const newAtt = [...attachments];
    newAtt.splice(index, 1);
    setAttachments(newAtt);
  };

  const handleSubmit = () => {
    if (!prompt && attachments.length === 0) return;
    
    const newTask: AITask = {
      id: Math.random().toString(36).substring(7),
      prompt: prompt || 'Generate asset from attachments',
      model: aiModel,
      status: 'queued',
      progress: 0,
      currentStep: 'Awaiting NPU scheduler...',
      totalSteps: 1,
      timeElapsed: 0,
      timeEstimated: 0,
      logs: [],
      fileCount: attachments.length
    };
    
    setTaskQueue(prev => [...prev, newTask]);
    setPrompt('');
    setAttachments([]);
  };

  const removeTask = (id: string) => {
    setTaskQueue(prev => prev.filter(t => t.id !== id));
  };

  const isProcessing = taskQueue.some(t => t.status === 'processing');

  if (['Material', 'Pipeline', 'Blueprint', 'ServerSim'].includes(activeTool)) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] z-[60] pointer-events-auto flex flex-col gap-2">
      
      {/* Offline AI Task Queue / Manager Popup */}
      {taskQueue.length > 0 && (
        <div className="absolute right-0 bottom-[110%] mb-2 w-[420px] bg-[#161b22]/95 backdrop-blur-xl border border-[#bc8cff]/40 rounded-xl shadow-[0_20px_60px_-15px_rgba(188,140,255,0.2)] flex flex-col overflow-hidden pointer-events-auto animate-in fade-in slide-in-from-bottom-2">
           <div className="bg-[#0d1117] p-3 border-b border-[#30363d] flex items-center justify-between shadow-inner shrink-0">
               <span className="text-[12px] font-bold text-white flex items-center gap-2">
                  <ActivitySquare size={14} className="text-[#bc8cff]"/>
                  OFFLINE AI TASK CLUSTER
               </span>
               <div className="flex items-center gap-3">
                  {isProcessing && (
                     <span className="flex items-center gap-1 text-[#f85149] text-[10px] font-mono animate-pulse">
                        <Cpu size={12}/> TPU Load: {Math.floor(Math.random() * 20 + 80)}%
                     </span>
                  )}
                  <span className="text-[10px] bg-[#bc8cff]/20 text-[#bc8cff] px-2 py-0.5 rounded font-mono font-bold">
                     {taskQueue.length} JOB{taskQueue.length !== 1 && 'S'}
                  </span>
               </div>
           </div>

           <div className="p-3 flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
             {taskQueue.map(task => (
               <div key={task.id} className={`border rounded-lg p-3 relative overflow-hidden transition-all ${task.status === 'processing' ? 'border-[#58a6ff]/50 bg-[#1f242d] shadow-[0_0_15px_rgba(88,166,255,0.1)]' : task.status === 'done' ? 'border-[#3fb950]/50 bg-[#0d1117]/80' : 'border-[#30363d] bg-[#0d1117]/80'}`}>
                  {/* Progress Bar Background */}
                  {task.status === 'processing' && (
                     <div className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#bc8cff]/10 to-[#58a6ff]/10 transition-all duration-1000 ease-linear" style={{ width: `${task.progress}%` }}></div>
                  )}
                  {task.status === 'done' && (
                     <div className="absolute top-0 left-0 bottom-0 right-0 bg-[#3fb950]/5 transition-all duration-1000"></div>
                  )}
                  
                  <div className="relative z-10 flex flex-col gap-2">
                     <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-white pr-2 line-clamp-2 leading-tight flex-1" title={task.prompt}>{task.prompt}</span>
                        <div className="flex items-center gap-2 shrink-0">
                           <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 ${task.status === 'processing' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : task.status === 'done' ? 'bg-[#3fb950]/20 text-[#3fb950]' : 'bg-[#30363d] text-[#8b949e]'}`}>
                              {task.status === 'processing' && <Loader2 size={10} className="animate-spin" />}
                              {task.status === 'done' && <CheckCircle size={10} />}
                              {task.status === 'queued' && <Clock size={10} />}
                              {task.status}
                           </span>
                           <button onClick={() => removeTask(task.id)} className="text-[#8b949e] hover:text-white p-0.5 rounded transition-colors"><X size={12}/></button>
                        </div>
                     </div>
                     
                     <div className="text-[10px] text-[#8b949e] font-mono border-l-2 border-[#30363d] pl-2 -ml-1 py-0.5 flex flex-col gap-1">
                        <span className="text-[#bc8cff] opacity-80 flex items-center gap-1"><Cpu size={10}/> {task.model}</span>
                        {task.status !== 'queued' && (
                           <span className={task.status === 'done' ? 'text-[#3fb950]' : 'text-[#c9d1d9]'}>{task.currentStep}</span>
                        )}
                     </div>

                     {task.status === 'processing' && (
                     <>
                       <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden shadow-inner mt-1">
                          <div className="h-full bg-gradient-to-r from-[#bc8cff] to-[#58a6ff] transition-all duration-1000 ease-linear relative" style={{ width: `${task.progress}%` }}>
                             <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-r from-transparent to-white/50 blur-[2px]"></div>
                          </div>
                       </div>

                       <div className="flex justify-between text-[10px] font-mono font-semibold pt-1">
                          <span className="text-[#8b949e]">Time: <span className="text-white">{Math.floor(task.timeElapsed / 60)}:{(task.timeElapsed % 60).toString().padStart(2, '0')}</span></span>
                          <span className="text-[#58a6ff]">{task.progress}%</span>
                          <span className="text-[#8b949e]">Est: <span className="text-white">{Math.floor(task.timeEstimated / 60)}:{(task.timeEstimated % 60).toString().padStart(2, '0')}</span></span>
                       </div>
                     </>
                     )}
                     
                     {task.status === 'done' && (
                       <>
                         <div className="flex justify-between text-[10px] font-mono text-[#3fb950] font-semibold pt-1">
                            <span>Total Time: {Math.floor(task.timeElapsed / 60)}:{(task.timeElapsed % 60).toString().padStart(2, '0')}s</span>
                            <span>100% COMPLETE</span>
                         </div>
                         {task.fileCount > 0 && typeof onNavigateToMapEdit === 'function' && typeof onNavigateToMonsterEdit === 'function' && (
                            <div className="flex gap-2 mt-2">
                               <button onClick={onNavigateToMonsterEdit} className="flex-1 bg-[#161b22] hover:bg-[#1f242d] border border-[#30363d] hover:border-[#e3b341] text-[#e3b341] rounded py-1 px-2 text-[10px] transition-colors relative z-20">
                                  Configure Monsters
                               </button>
                               <button onClick={onNavigateToMapEdit} className="flex-1 bg-[#161b22] hover:bg-[#1f242d] border border-[#30363d] hover:border-[#58a6ff] text-[#58a6ff] rounded py-1 px-2 text-[10px] transition-colors relative z-20">
                                  Place in Map
                               </button>
                            </div>
                         )}
                       </>
                     )}
                  </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Main command bar */}
      <div 
         onDragEnter={handleDrag}
         onDragLeave={handleDrag}
         onDragOver={handleDrag}
         onDrop={handleDrop}
         className={`bg-[#161b22]/95 backdrop-blur-xl border ${dragActive ? 'border-[#58a6ff]' : 'border-[#30363d] hover:border-[#bc8cff]/50'} rounded-2xl shadow-xl p-3 flex flex-col gap-3 transition-colors relative`}>
        
        {dragActive && (
           <div className="absolute inset-0 bg-[#58a6ff]/10 rounded-2xl z-20 flex items-center justify-center border-2 border-dashed border-[#58a6ff]">
              <div className="bg-[#0d1117] px-4 py-2 rounded-full text-[#58a6ff] font-bold flex items-center gap-2"><UploadCloud size={16}/> Drop files to context window</div>
           </div>
        )}

        {/* Model Selector & Status */}
        <div className="flex items-center justify-between px-2 pb-2 border-b border-[#30363d]">
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 text-[#bc8cff]">
                 <Sparkles size={16} className={isProcessing ? "animate-pulse" : ""} />
                 <span className="text-[12px] font-bold tracking-widest hidden sm:inline">AUTONOMOUS ENGINE AI</span>
               </div>
               <div className="h-4 w-px bg-[#30363d]"></div>
               <select 
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="bg-transparent text-[11px] text-[#8b949e] outline-none border-none cursor-pointer hover:text-white max-w-[200px]"
               >
                 {modelOptions.length > 0 ? (
                    modelOptions.map((opt, i) => (
                       <option key={i} value={opt.name} disabled={!opt.isDownloaded}>
                          {opt.name} {!opt.isDownloaded ? '(Not Downloaded)' : ''}
                       </option>
                    ))
                 ) : (
                    <>
                      <option value="NexusCode Core (Copilot)">NexusCode Core (Copilot)</option>
                      <option value="DesignNet-Pro (UI/UX)">DesignNet-Pro (UI/UX)</option>
                      <option value="LoreMaster (Narrative/NPCs)">LoreMaster (Narrative/NPCs)</option>
                      <option value="Nexus Prime (Swarm Overlord)">Nexus Prime (Swarm Overlord)</option>
                    </>
                 )}
               </select>
            </div>
            <div className="flex items-center gap-2">
               <span className="flex items-center gap-1 text-[10px] text-[#3fb950] font-mono"><Server size={10}/> OFFLINE CLUSTER ACTIVE</span>
            </div>
        </div>

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2">
            {attachments.map((att, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] pl-2 pr-1 py-1 rounded-lg text-[11px] text-[#c9d1d9] group">
                {att.type === 'image' && <ImageIcon size={14} className="text-[#58a6ff]"/>}
                {att.type === 'video' && <FileVideo size={14} className="text-[#f85149]"/>}
                {att.type === 'link' && <LinkIcon size={14} className="text-[#3fb950]"/>}
                {att.type === 'file' && <Box size={14} className="text-[#e3b341]"/>}
                <div className="flex flex-col line-clamp-1 max-w-[120px]">
                   <span className="truncate">{att.name}</span>
                   <span className="text-[9px] text-[#8b949e]">{att.size}</span>
                </div>
                <button onClick={() => removeAttachment(i)} className="text-[#8b949e] hover:text-[#f85149] ml-1 p-1 hover:bg-[#30363d] rounded"><X size={12}/></button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 px-1">
            <div className="flex flex-col gap-1 pb-1">
               <button onClick={() => handleAttach('image')} className="p-1.5 text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#30363d] rounded transition-colors" title="Upload Image (e.g. Concept Art)"><ImageIcon size={16}/></button>
               <button onClick={() => handleAttach('video')} className="p-1.5 text-[#8b949e] hover:text-[#f85149] hover:bg-[#30363d] rounded transition-colors" title="Upload Video (e.g. Reference Motion)"><FileVideo size={16}/></button>
               <button onClick={() => handleAttach('link')} className="p-1.5 text-[#8b949e] hover:text-[#3fb950] hover:bg-[#30363d] rounded transition-colors" title="Paste Link"><LinkIcon size={16}/></button>
            </div>
            
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                 }
              }}
              placeholder={`Tell me what to make in [${activeTool}]... e.g. "Take this sketch, generate orthographic views, and build a 3D rig with run animation."`}
              className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl text-[13px] text-white px-4 py-3 outline-none focus:border-[#bc8cff] transition-colors shadow-inner resize-none min-h-[52px]"
              rows={Math.min(4, prompt.split('\n').length || 1)}
            />
            
            <button 
               onClick={handleSubmit}
               disabled={!prompt && attachments.length === 0}
               className={`h-[52px] rounded-xl font-bold px-6 shadow-lg gap-2 flex items-center justify-center transition-all ${!prompt && attachments.length === 0 ? 'bg-[#21262d] text-[#8b949e] cursor-not-allowed' : 'bg-gradient-to-r from-[#bc8cff] to-[#58a6ff] hover:opacity-90 text-white'}`}>
              <Send size={18} fill="currentColor" className={!prompt && attachments.length === 0 ? 'opacity-50' : ''} /> {taskQueue.length > 0 ? 'ADD TO QUEUE' : 'EXECUTE'}
            </button>
        </div>
      </div>
    </div>
  );
}
