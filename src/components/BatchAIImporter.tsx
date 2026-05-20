import React, { useState } from 'react';
import { UploadCloud, FileImage, Settings, Cpu, Database, Eye, Play, Plus, Box, Mountain, Ghost, Cloud } from 'lucide-react';

interface BatchAIImporterProps {
  onNavigateToMapEdit?: () => void;
  onNavigateToMonsterEdit?: () => void;
}

export default function BatchAIImporter({ onNavigateToMapEdit, onNavigateToMonsterEdit }: BatchAIImporterProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startPipeline = () => {
    setIsProcessing(true);
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsProcessing(false);
          return 100;
        }
        return p + 5;
      });
    }, 200);
  };

  return (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#333]">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Cloud className="text-[#58a6ff]" /> Batch AI Asset Pipeline
          </h1>
          <p className="text-[#888] text-sm mt-1">
            Upload images (e.g., 500+ character concepts) and run them through offline AI generation to automatically texturize, rig, and populate prefabs.
          </p>
        </div>
        <button className="bg-[#3fb950] hover:bg-[#2ea043] font-bold px-4 py-2 rounded text-white flex items-center gap-2 transition" onClick={startPipeline} disabled={isProcessing}>
          <Play size={16} /> {isProcessing ? 'Processing...' : 'Run Pipeline'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><UploadCloud size={18} /> Source Files</h2>
            <button className="text-[#58a6ff] text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add Folder</button>
          </div>
          <div className="bg-[#0d1117] border-2 border-dashed border-[#30363d] rounded p-8 flex flex-col items-center justify-center text-[#888] mb-4">
            <FileImage size={48} className="mb-2 opacity-50" />
            <p>Drag and drop image folders here</p>
            <p className="text-xs mt-1">Supports PNG, JPG (e.g., concept_monsters.zip)</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm p-2 bg-[#0d1117] border border-[#30363d] rounded">
              <span className="flex items-center gap-2 font-mono text-[#c9d1d9]"><FileImage size={14} /> /assets/concept/goblins_batch.zip</span>
              <span className="text-[#e3b341]">241 files</span>
            </div>
            <div className="flex justify-between items-center text-sm p-2 bg-[#0d1117] border border-[#30363d] rounded">
              <span className="flex items-center gap-2 font-mono text-[#c9d1d9]"><FileImage size={14} /> /assets/concept/orcs_batch.zip</span>
              <span className="text-[#e3b341]">189 files</span>
            </div>
            <div className="flex justify-between items-center text-sm p-2 bg-[#0d1117] border border-[#30363d] rounded">
              <span className="flex items-center gap-2 font-mono text-[#c9d1d9]"><FileImage size={14} /> /assets/concept/dragons.zip</span>
              <span className="text-[#e3b341]">70 files</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#30363d] flex justify-between items-center text-sm">
             <span className="text-[#888]">Total Queued:</span>
             <span className="text-white font-bold">500 files</span>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4"><Settings size={18} /> Model Synthesis Config</h2>
          
          <div className="space-y-4 text-sm text-[#c9d1d9]">
             <div>
                <label className="block text-[#888] font-bold mb-1 uppercase text-[10px] tracking-wider">Target Entity Type</label>
                <select className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 outline-none">
                  <option>Character / Monster NPC</option>
                  <option>Static Prop / Foliage</option>
                  <option>Weapon Asset</option>
                </select>
             </div>
             
             <div>
                <label className="block text-[#888] font-bold mb-1 uppercase text-[10px] tracking-wider">AI Pipeline Stages</label>
                <div className="space-y-2 bg-[#0d1117] border border-[#30363d] rounded p-3">
                   <label className="flex items-center gap-2">
                     <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                     <span>1. Orthographic generation (Front, Back, Left, Right, Top, Bottom)</span>
                   </label>
                   <label className="flex items-center gap-2">
                     <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                     <span>2. 3D Model reconstruction (NeRF/Gaussian Splat to Mesh)</span>
                   </label>
                   <label className="flex items-center gap-2">
                     <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                     <span>3. Automatic UV Mapping & Texturing</span>
                   </label>
                   <label className="flex items-center gap-2">
                     <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                     <span>4. Auto-Rigger & Skeletal Mesh Setup</span>
                   </label>
                   <label className="flex items-center gap-2">
                     <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                     <span>5. Inject into Engine Asset Browser as Prefabs</span>
                   </label>
                </div>
             </div>

             <div>
                <label className="block text-[#888] font-bold mb-1 uppercase text-[10px] tracking-wider">Post-Processing Actions</label>
                <div className="space-y-2">
                  <button onClick={onNavigateToMapEdit} className="w-full text-left bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] px-3 py-2 rounded flex items-center justify-between transition">
                    <span>Open Map Editor immediately</span>
                    <Mountain size={14} className="text-[#888]"/>
                  </button>
                  <button onClick={onNavigateToMonsterEdit} className="w-full text-left bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] px-3 py-2 rounded flex items-center justify-between transition">
                    <span>Open Monster Setting panel to configure spawn rules</span>
                    <Ghost size={14} className="text-[#888]"/>
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {(isProcessing || progress > 0) && (
        <div className="mt-8 bg-[#161b22] border border-[#30363d] rounded p-6">
           <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Cpu size={18} className="text-[#bc8cff]" /> AI Processing Cluster Status</h3>
           <div className="w-full h-4 bg-[#0d1117] rounded-full overflow-hidden mb-2 border border-[#30363d]">
              <div 
                 className="h-full bg-gradient-to-r from-[#bc8cff] to-[#58a6ff] transition-all duration-300"
                 style={{ width: `${progress}%` }}
              ></div>
           </div>
           <div className="flex justify-between text-xs text-[#888] font-mono">
              <span>{Math.floor(progress * 5)} / 500 files processed</span>
              <span>{progress}%</span>
           </div>

           {progress === 100 && (
             <div className="mt-6 p-4 bg-[#3fb950]/10 border border-[#3fb950]/30 rounded text-[#3fb950] flex flex-col items-center justify-center gap-3">
                <span className="font-bold">Pipeline Complete! 500 assets generated successfully.</span>
                <div className="flex gap-4">
                  <button onClick={onNavigateToMapEdit} className="bg-[#3fb950] text-[#0d1117] px-4 py-2 rounded font-bold hover:opacity-90 flex items-center gap-2 transition"><Mountain size={14} /> Go to Map Editor</button>
                  <button onClick={onNavigateToMonsterEdit} className="bg-transparent text-[#3fb950] border border-[#3fb950] px-4 py-2 rounded font-bold hover:bg-[#3fb950]/20 flex items-center gap-2 transition"><Ghost size={14} /> Monster Settings</button>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
