import React, { useState, useEffect } from 'react';
import { X, Server, Download, CheckCircle, Database, Cpu, ShieldCheck, Zap, Globe} from 'lucide-react';
import { useLanguage, languages } from '../contexts/LanguageContext';
import AICodeBrandingSettingsTab from './AICodeBrandingSettingsTab';
import { offlineAICodeCommentBrander } from '../utils/OfflineAICodeCommentBrander';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  size: string;
  status: 'not_downloaded' | 'downloading' | 'downloaded' | 'update_available' | 'updating';
  progress?: number;
  downloadSpeed?: string;
  timeRemaining?: string;
  currentStep?: string;
}

const initialModels: AIModel[] = [
  // CODER & ARCHITECTURE
  { id: 'core', name: '1. NexusCode Core (Copilot)', description: 'Core LLM for 50+ languages, logic solving, and bug fixing.', size: '4.2 GB', status: 'downloaded' },
  { id: 'commander', name: '2. Nexus Prime (Swarm Overlord)', description: 'Master AI Orchestrator. Evaluates outputs, runs QA checks (95%+ match), assigns tasks to other nodes.', size: '18.1 GB', status: 'not_downloaded' },
  { id: 'ai_coder_pro', name: '3. Enterprise Coder (StarCoder2)', description: 'Supports multi-million line projects, API linking, and Microservices design.', size: '8.2 GB', status: 'not_downloaded' },
  { id: 'ai_coder_lite', name: '4. Apex Lite (DeepSeek-Coder)', description: 'Low VRAM model for high-speed autocomplete and line predictions.', size: '1.2 GB', status: 'not_downloaded' },
  { id: 'ai_devops', name: '5. DevOps & Cloud Architect', description: 'Handles Docker, Kubernetes, CI/CD, and Server Auto-scaling manifests.', size: '4.2 GB', status: 'not_downloaded' },
  { id: 'ai_semgrep', name: '6. Security & Reverse Eng (CodeQL)', description: 'Runs Static Analysis and Vulnerability scanning on source code.', size: '2.1 GB', status: 'not_downloaded' },
  { id: 'ai_ghidra', name: '7. Ghidra Decompiler AI', description: 'Reverse-engineering suite AI for deep decompilation and binary reading.', size: '1.4 GB', status: 'not_downloaded' },
  { id: 'commandr', name: '8. Command R+ 104B', description: 'Massive enterprise-tier LLM for complex logic, scripting, and extreme tasks.', size: '45.1 GB', status: 'not_downloaded' },
  
  // UI/UX & DESIGN
  { id: 'uiux', name: '9. DesignNet-Pro (UI/UX Architect)', description: 'Specialized in frontend, layout rhythms, Figma auto-gen, and accessibility.', size: '2.8 GB', status: 'downloaded' },
  { id: 'ai_uiux_heat', name: '10. UX Cognitive Load Sim', description: 'Simulates human attention and heatmaps to judge UI elements.', size: '3.1 GB', status: 'not_downloaded' },

  // WORLD, LORE & NARRATIVE
  { id: 'story', name: '11. LoreMaster Infinite (Story AI)', description: 'Generates 100,000+ hours of lore, narratives, and endless scalable quests.', size: '32.4 GB', status: 'not_downloaded' },
  { id: 'npcbrain', name: '12. NPC-Brain LLM (Personality)', description: 'Specialized LLM for deep immersive NPC dialogue and persistent personalities.', size: '8.2 GB', status: 'not_downloaded' },
  { id: 'world', name: '13. TerraGen (Massive Maps)', description: 'Algorithmically generates giant 3D & 2D maps, landscapes, and dungeon layouts.', size: '12.4 GB', status: 'not_downloaded' },
  { id: 'ai_map_builder_pro', name: '14. Dungeon & Specific Maps', description: 'Focuses on interior environments, puzzle placements, and mazes.', size: '5.6 GB', status: 'not_downloaded' },
  { id: 'terrain', name: '15. TerrainDiffusion XL', description: 'Advanced terrain and landscape generation, deep biome integration.', size: '6.4 GB', status: 'not_downloaded' },
  
  // GAME DESIGN & LOGIC
  { id: 'game', name: '16. GameDir Engine (Game Design)', description: 'Orchestrates game logic, systems, rules, state machines, and level flow.', size: '6.1 GB', status: 'not_downloaded' },
  { id: 'ai_economy', name: '17. Economy & Progression Balancer', description: 'Calculates inflation, loot tables, XP curves, and Gacha economies.', size: '1.8 GB', status: 'not_downloaded' },
  { id: 'ai_physics_tuner', name: '18. Physics & Fluid Dynamics', description: 'Simulates complex collisions, fluid meshes, and soft-body logic.', size: '2.9 GB', status: 'not_downloaded' },
  { id: 'combatai', name: '19. CombatAI Trainer', description: 'Trains combat behaviors and strategic adaptation for NPC agents.', size: '5.1 GB', status: 'not_downloaded' },
  
  // 3D, ART, ANIMATION
  { id: 'mesh', name: '20. MeshGenius (3D & 2D Models)', description: 'Generates OBJ/GLTF and 2D sprite sheets. Auto-rigs and maps UVs.', size: '8.7 GB', status: 'not_downloaded' },
  { id: 'craftsman3d', name: '21. CraftsMan 3D (Hard-Surface)', description: 'High-fidelity 3D modeling and sculpting AI for precise geometry.', size: '5.2 GB', status: 'not_downloaded' },
  { id: 'ai_organic_3d', name: '22. Organic 3D Character Gen', description: 'Focuses on muscles, mythical beasts, and deep anatomy modeling.', size: '3.1 GB', status: 'not_downloaded' },
  { id: 'ai_animator', name: '23. Auto-Rigger & Blend Space AI', description: 'Builds skeletons, paints vertex weights, and generates animations.', size: '5.1 GB', status: 'not_downloaded' },
  { id: 'poseformer', name: '24. PoseFormer Pro', description: 'AI-driven rapid animation rigging and complex pose generation.', size: '3.6 GB', status: 'not_downloaded' },
  { id: 'ai_comfyui_flux', name: '25. ComfyUI + FLUX (Image/Texture)', description: 'Ultimate AI asset pipeline. Seamless 8K textures, sprites, PBR maps.', size: '11.5 GB', status: 'not_downloaded' },
  { id: 'vision', name: '26. TextureDiff (Legacy Textures)', description: 'Optimized for seamless PBR materials and 2D pixel art.', size: '8.6 GB', status: 'not_downloaded' },
  
  // VFX, VIDEO, CINEMATICS
  { id: 'ai_video_vfx', name: '27. PostFX & Video Generators', description: 'Handles Text-to-Video, Particle sims, and Volumetric Light algorithms.', size: '6.5 GB', status: 'not_downloaded' },
  { id: 'ai_cinematic_director', name: '28. Cinematic Sequencer AI', description: 'Manages camera pans, timelines, depths of field, and cutscenes.', size: '4.6 GB', status: 'not_downloaded' },
  { id: 'ai_shader_dev', name: '29. Shader & Ray-Tracing Architect', description: 'Converts ideas into HLSL/GLSL shaders, custom ray-marching routines.', size: '3.7 GB', status: 'not_downloaded' },

  // AUDIO & VOICE
  { id: 'rvc', name: '30. RVC v2 Voice Clone', description: 'Real-time voice cloning and conversion for characters.', size: '2.1 GB', status: 'not_downloaded' },
  { id: 'voicecraft', name: '31. VoiceCraft Pro (Emotive TTS)', description: 'Professional voice generation, screaming, whispering, 100+ languages.', size: '4.8 GB', status: 'not_downloaded' },
  { id: 'stableaudio', name: '32. Stable Audio 2.0', description: 'Generates high-quality audio tracks, music, and dynamic sound effects.', size: '7.3 GB', status: 'not_downloaded' },
  { id: 'audio', name: '33. SoundNet-7.0 (Procedural Music)', description: 'Procedural audio generation, game music composition, and DSP node networks.', size: '3.9 GB', status: 'not_downloaded' },
  { id: 'ai_sfx_foley', name: '34. Dynamic SFX Foley Engine', description: 'Action-bound SFX: footstep materials, physics collision sounds.', size: '2.3 GB', status: 'not_downloaded' },

  // QA, TESTING & ANALYTICS
  { id: 'agenttester', name: '35. Automated QA Simulator AI', description: 'QA testing via multi-persona AI agents crawling through your app mechanics.', size: '2.4 GB', status: 'not_downloaded' },
  { id: 'ai_vision_playtester', name: '36. Vision Playtester', description: 'Actually observes the screen visually, detecting z-fighting, UI overlaps.', size: '4.1 GB', status: 'not_downloaded' },
  { id: 'vuln', name: '37. VulnScan-Zero (Deep Sec)', description: 'Aggressive vulnerability scanner and auto-patcher for exploits and 0-days.', size: '5.5 GB', status: 'not_downloaded' },
  { id: 'ai_game_analytics', name: '38. Player Telemetry Predictor', description: 'Predicts choke points, player drop-off, and heatmaps without real players.', size: '2.5 GB', status: 'not_downloaded' },
  { id: 'ai_marketing', name: '39. ASO/SEO Marketing Gen', description: 'Generates ad-campaigns, metadata, description bodies, and store pages.', size: '2.1 GB', status: 'not_downloaded' },
  
  // NETWORKING & INFRA
  { id: 'ai_netcode', name: '40. Rollback Netcode Synchronizer', description: 'Builds secure multiplayer environments, anti-cheat barriers, matched packets.', size: '3.5 GB', status: 'not_downloaded' },
  { id: 'swarm', name: '41. Multi-Agent Swarm Pipeline Engine', description: 'Allows offline AIs to communicate seamlessly to co-develop projects independently.', size: '1.2 GB', status: 'not_downloaded' },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('models');
  const [models, setModels] = useState<AIModel[]>(initialModels);
  const [simulatedNode, setSimulatedNode] = useState<{name: string, ip: string, role: string, os: string, initialTask: string} | null>(null);
  const [nodeLogs, setNodeLogs] = useState<string[]>([]);
  const intervalsRef = React.useRef<{ [id: string]: NodeJS.Timeout }>({});
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (simulatedNode) {
      setNodeLogs([
        `[SYSTEM] Booting Nexus Swarm Custom Standalone Binary v1.0.5`,
        `[SYSTEM] Headless/Minimal UI Mode Auto-Enabled. Preserving 99.9% VRAM/RAM for tasks.`,
        `[NETWORK] Auto-Discovery... Found Master Engine Controller automatically.`,
        `[SECURITY] Initiating AES-256-GCM Handshake over Local LAN... [OK]`,
        `[FAULT-TOLERANCE] 10ms aggressive state-checkpointing initialized.`,
        `[SWARM] Joined Mesh Topology. Node IP: ${simulatedNode.ip}`,
        `[HARDWARE] Direct hardware mapping active. Heterogeneous compute pooling online.`,
        `[READY] Setup complete. Awaiting nano-tasks.`
      ]);

      const logInterval = setInterval(() => {
        setNodeLogs(prev => {
          const newLogs = [...prev];
          if (newLogs.length > 50) newLogs.shift();
          const tasks = [
             `[${new Date().toISOString().split('T')[1].split('.')[0]}] [COMPUTE] Processing Micro-batch: ${simulatedNode.initialTask}`,
             `[${new Date().toISOString().split('T')[1].split('.')[0]}] [MEMORY] WASM/DMA KV-Cache sync complete. VRAM allocation stable.`,
             `[${new Date().toISOString().split('T')[1].split('.')[0]}] [NETWORK] Encrypted tensor packet dispatched (Micro-sec latency).`,
             `[${new Date().toISOString().split('T')[1].split('.')[0]}] [HEARTBEAT] Ping: ${Math.floor(Math.random() * 5 + 1)}ms (Extreme Mode)`,
             `[${new Date().toISOString().split('T')[1].split('.')[0]}] [STATE] State Checkpoint saved. Fault-tolerant threshold OK.`
          ];
          newLogs.push(tasks[Math.floor(Math.random() * tasks.length)]);
          return newLogs;
        });
      }, 1500);

      return () => clearInterval(logInterval);
    }
  }, [simulatedNode]);

  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    const savedModels = localStorage.getItem('nexus_ai_models');
    if (savedModels) {
      try {
        const parsed = JSON.parse(savedModels);
        const mergedModels = initialModels.map(im => {
          const found = parsed.find((p: any) => p.id === im.id);
          if (found) return { ...im, status: found.status, progress: found.progress };
          return im;
        });
        setModels(mergedModels);
      } catch(e) {
        setModels(initialModels);
      }
    } else {
       setModels(initialModels);
    }
  }, []);

  const saveModels = (updated: AIModel[]) => {
    setModels(updated);
    localStorage.setItem('nexus_ai_models', JSON.stringify(updated));
  };

  const handleDownload = (id: string, isUpdate = false) => {
    const targetModel = models.find(m => m.id === id);
    if (!targetModel) return;

    // Simulate sizes. E.g. "4.2 GB" -> 4200 MB
    const totalSizeStr = targetModel.size;
    const isGB = totalSizeStr.includes('GB');
    const numericSize = parseFloat(totalSizeStr.replace(/[^0-9.]/g, ''));
    const totalMB = isGB ? numericSize * 1024 : numericSize;

    let updated = models.map(m => m.id === id ? { 
      ...m, 
      status: isUpdate ? 'updating' : 'downloading', 
      progress: 0,
      currentStep: 'Requesting P2P Node...',
      downloadSpeed: '0 MB/s',
      timeRemaining: 'Calculating...'
    } : m);
    saveModels(updated as AIModel[]);

    let downloadedMB = 0;
    
    // Download phase
    if (intervalsRef.current[id]) clearInterval(intervalsRef.current[id]);
    intervalsRef.current[id] = setInterval(() => {
      // Simulate network speed between 40 MB/s and 180 MB/s
      const speedMBps = Math.floor(Math.random() * 140) + 40;
      downloadedMB += speedMBps;
      
      let progress = (downloadedMB / totalMB) * 100;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(intervalsRef.current[id]);
        delete intervalsRef.current[id];
        
        // Extraction and compilation phase
        setModels(current => current.map(m => m.id === id ? {
          ...m,
          progress: 100,
          currentStep: 'Extracting weights and compiling TensorRT graph...',
          downloadSpeed: 'Processing...',
          timeRemaining: '00:00'
        } : m) as AIModel[]);

        setTimeout(() => {
           setModels(current => {
             const finished = current.map(m => m.id === id ? { ...m, status: 'downloaded', progress: 100, currentStep: 'Ready' } : m);
             localStorage.setItem('nexus_ai_models', JSON.stringify(finished));
             return finished as AIModel[];
           });
        }, 5000); // 5 sec compile simulation

      } else {
        const remainingMB = totalMB - downloadedMB;
        const secondsLeft = Math.ceil(remainingMB / speedMBps);
        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        
        setModels(current => current.map(m => m.id === id ? { 
          ...m, 
          progress: Math.floor(progress),
          currentStep: `Downloading objects: ${(downloadedMB >= 1024 ? (downloadedMB/1024).toFixed(1) + ' GB' : Math.floor(downloadedMB) + ' MB')} / ${totalSizeStr}`,
          downloadSpeed: `${speedMBps} MB/s`,
          timeRemaining: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        } : m) as AIModel[]);
      }
    }, 1000);
  };

  const handleEnableAll = () => {
     const downloadingModels = models.map(m => {
       if (m.status === 'not_downloaded') {
         // Queue for download
         handleDownload(m.id);
         return { ...m, status: 'downloading', progress: 0 };
       }
       return m;
     });
     // State is managed by individual download intervals as well, but this primes the UI
  }

  const handleCheckUpdates = () => {
    // Randomly select some downloaded models to have an update
    const updated = models.map(m => {
      if (m.status === 'downloaded' && Math.random() > 0.5) {
         return { ...m, status: 'update_available' };
      }
      return m;
    });
    saveModels(updated as AIModel[]);
  };

  const handleUpdateAll = () => {
     models.forEach(m => {
       if (m.status === 'update_available') {
         handleDownload(m.id, true);
       }
     });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden font-['Helvetica_Neue',Arial,sans-serif]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#30363d] bg-[#161b22]">
          <h2 className="text-[#c9d1d9] font-semibold text-[15px] flex items-center gap-2">
            <Server size={18} className="text-[#58a6ff]" /> Engine Preferences & Local AI Cluster
          </h2>
          <button onClick={onClose} className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors p-1 rounded hover:bg-[#21262d]">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-[220px] bg-[#0d1117] border-r border-[#30363d] flex flex-col py-2 shrink-0">
             <button 
               onClick={() => setActiveTab('general')}
               className={`text-left px-4 py-2 text-[12px] transition-colors border-l-2 ${activeTab === 'general' ? 'text-[#c9d1d9] border-[#58a6ff] bg-[#21262d]/50' : 'text-[#8b949e] border-transparent hover:text-[#c9d1d9]'}`}
             >General Settings</button>
             <button 
               onClick={() => setActiveTab('models')}
               className={`text-left px-4 py-2 text-[12px] transition-colors border-l-2 flex items-center justify-between ${activeTab === 'models' ? 'text-[#c9d1d9] border-[#58a6ff] bg-[#21262d]/50' : 'text-[#8b949e] border-transparent hover:text-[#c9d1d9]'}`}
             >
               Local AI Models <span className="bg-[#58a6ff] text-black px-1.5 py-0.5 rounded-full text-[9px] font-bold">100% Offline</span>
             </button>
             <button 
               onClick={() => setActiveTab('acceleration')}
               className={`text-left px-4 py-2 text-[12px] transition-colors border-l-2 flex items-center justify-between ${activeTab === 'acceleration' ? 'text-[#e3b341] border-[#e3b341] bg-[#21262d]/50' : 'text-[#8b949e] border-transparent hover:text-[#e3b341]'}`}
             >
               <div className="flex items-center gap-2"><Zap size={14} /> Acceleration</div>
               <span className="bg-[#e3b341] text-black px-1.5 py-0.5 rounded-full text-[9px] font-bold">NEW</span>
             </button>
             <button 
               onClick={() => setActiveTab('swarm')}
               className={`text-left px-4 py-2 text-[12px] transition-colors border-l-2 ${activeTab === 'swarm' ? 'text-[#c9d1d9] border-[#58a6ff] bg-[#21262d]/50' : 'text-[#8b949e] border-transparent hover:text-[#c9d1d9]'}`}
             >{t('settings.swarm')}</button>
             <button 
               onClick={() => setActiveTab('keys')}
               className={`text-left px-4 py-2 text-[12px] transition-colors border-l-2 ${activeTab === 'keys' ? 'text-[#c9d1d9] border-[#58a6ff] bg-[#21262d]/50' : 'text-[#8b949e] border-transparent hover:text-[#c9d1d9]'}`}
             >API Keys & Credentials</button>
             <button 
               onClick={() => setActiveTab('attribution')}
               className={`text-left px-4 py-2 text-[12px] transition-colors border-l-2 flex items-center justify-between ${activeTab === 'attribution' ? 'text-amber-400 border-amber-400 bg-[#21262d]/50' : 'text-[#8b949e] border-transparent hover:text-amber-400'}`}
             >
               <span>Code Attribution</span>
               <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full text-[9px] font-bold font-mono">
                 {offlineAICodeCommentBrander.getAuthorName()}
               </span>
             </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-[#0d1117] overflow-y-auto custom-scrollbar p-6">
            
            {activeTab === 'general' && (
              <div className="flex flex-col gap-8 max-w-3xl">
                <div>
                  <h3 className="text-[#c9d1d9] text-[18px] font-semibold mb-1">Hardware Optimization & Memory Management</h3>
                  <p className="text-[#8b949e] text-[13px] mb-4">Deep tuning to prevent memory bloat, optimize AI latency, and reduce overall system overhead.</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                       <div className="flex justify-between items-start mb-2">
                         <div>
                           <div className="text-[#c9d1d9] text-[13px] font-semibold">Active Garbage Collection Strategy</div>
                           <div className="text-[#8b949e] text-[11px]">Controls how aggressively unused VRAM/RAM is cleared to prevent data bloat.</div>
                         </div>
                         <select className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-2 py-1 outline-none">
                           <option>Aggressive (Max Resource Saver)</option>
                           <option>Balanced (Default)</option>
                           <option>Lazy (Keep contexts in memory for speed)</option>
                         </select>
                       </div>
                     </div>

                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                       <div className="flex justify-between items-center mb-2">
                         <div className="text-[#c9d1d9] text-[13px] font-semibold">Offline AI Dynamic Max Memory Limits</div>
                         <span className="text-[#8b949e] text-[11px] bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">VRAM: 16GB / RAM: 32GB</span>
                       </div>
                       <div className="flex flex-col gap-2 mt-2">
                          <label className="text-[10px] text-[#8b949e]">Max GPU VRAM Assignment (GB)</label>
                          <input type="range" min="4" max="24" defaultValue="16" step="2" className="w-full accent-[#bc8cff] cursor-pointer" />
                          <label className="text-[10px] text-[#8b949e] mt-2">Max System RAM Paging (GB)</label>
                          <input type="range" min="8" max="128" defaultValue="32" step="8" className="w-full accent-[#58a6ff] cursor-pointer" />
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                       <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                         <div className="text-[#c9d1d9] text-[12px] font-semibold mb-1">Model Quantization</div>
                         <div className="text-[#8b949e] text-[10px] mb-2 mb-2">Reduces AI model bloat without logic loss</div>
                         <select className="w-full bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-2 py-1 outline-none">
                           <option>INT4 (Max Speed, Low RAM)</option>
                           <option>INT8 (Balanced)</option>
                           <option>FP16 (Studio Quality)</option>
                           <option>Mixed Precision (Auto-swap)</option>
                         </select>
                       </div>
                       <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                         <div className="text-[#c9d1d9] text-[12px] font-semibold mb-1">NPU Offload Compute</div>
                         <div className="text-[#8b949e] text-[10px] mb-2 mb-2">Forces Neural Processing Unit utilization</div>
                         <select className="w-full bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-2 py-1 outline-none">
                           <option>Strict (NPU Only)</option>
                           <option>Hybrid (GPU + NPU - Highest TFLOPS)</option>
                           <option>CPU Fallback (Safe Mode)</option>
                         </select>
                       </div>
                     </div>
                  </div>
                </div>

                <div className="h-[1px] bg-[#30363d] w-full"></div>

                <div>
                  <h3 className="text-[#c9d1d9] text-[18px] font-semibold mb-1">Editor Core & Rendering Preferences</h3>
                  <p className="text-[#8b949e] text-[13px] mb-4">Deep engine configuration for viewport rendering and offline AI logic execution.</p>
                  
                  <div className="grid grid-cols-1 gap-3">
                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                       <div className="flex justify-between items-center mb-2">
                         <div className="text-[#c9d1d9] text-[13px] font-semibold">Maximum Voxel Render Distance</div>
                         <span className="text-[#8b949e] text-[11px] bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">128 Chunks</span>
                       </div>
                       <input type="range" min="16" max="256" defaultValue="128" step="16" className="w-full accent-[#bc8cff] cursor-pointer" />
                     </div>

                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                       <div className="flex justify-between items-center mb-2">
                         <div className="text-[#c9d1d9] text-[13px] font-semibold">Offline AI Generative Memory Pool</div>
                         <span className="text-[#8b949e] text-[11px] bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">24 GB</span>
                       </div>
                       <input type="range" min="4" max="64" defaultValue="24" step="4" className="w-full accent-[#58a6ff] cursor-pointer" />
                       <div className="text-[10px] text-[#8b949e] mt-2">Max RAM/VRAM allocated to background LLMs and diffusers before paging to disk. Set lower if editor stutters during generation.</div>
                     </div>
                  </div>
                </div>

                <div className="h-[1px] bg-[#30363d] w-full"></div>

                <div>
                  <h3 className="text-[#c9d1d9] text-[18px] font-semibold mb-1">AI Turbo Engine Parameters</h3>
                  <p className="text-[#8b949e] text-[13px] mb-4">Core optimizations utilizing full GPU CUDA/Metal capability for massive AI agent performance gains.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-[#161b22] border border-[#3fb950]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(63,185,80,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#3fb950] text-[#0d1117] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">ENABLED</div>
                        <div className="text-[#c9d1d9] font-semibold text-[13px] mb-1">Flash Attention 2</div>
                        <div className="text-[#8b949e] text-[11px]">New optimized attention kernel. Speeds up LLM generation significantly and drastically reduces VRAM usage.</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#3fb950]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(63,185,80,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#3fb950] text-[#0d1117] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">ENABLED</div>
                        <div className="text-[#c9d1d9] font-semibold text-[13px] mb-1">Speculative Decoding</div>
                        <div className="text-[#8b949e] text-[11px]">Draft model predicts next tokens, larger models verify them. Accelerates inference speed by up to 3x.</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#3fb950]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(63,185,80,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#3fb950] text-[#0d1117] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">ENABLED</div>
                        <div className="text-[#c9d1d9] font-semibold text-[13px] mb-1">RoPE Scaling (Extrapolate)</div>
                        <div className="text-[#8b949e] text-[11px]">Rotary Position Embedding scaling to extend context length limits up to 128K+ dynamically.</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#3fb950]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(63,185,80,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#3fb950] text-[#0d1117] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">ENABLED</div>
                        <div className="text-[#c9d1d9] font-semibold text-[13px] mb-1">LoRA Adapters Auto-Swap</div>
                        <div className="text-[#8b949e] text-[11px]">Dynamically hot-loads Low-Rank Adaptation matrices instantly per agent task without VRAM overhead.</div>
                     </div>
                  </div>
                </div>

                <div className="h-[1px] bg-[#30363d] w-full"></div>

                <div>
                  <h3 className="text-[#c9d1d9] text-[18px] font-semibold mb-1">Environment & Keybindings</h3>
                  <p className="text-[#8b949e] text-[13px] mb-4">Customize hotkeys, viewport behavior, and workspace configurations.</p>
                  
                  <div className="flex flex-col gap-3">
                     <div className="flex items-center justify-between bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                        <div>
                           <div className="text-[#c9d1d9] text-[13px] font-semibold">Enable Advanced Voxel Selection</div>
                           <div className="text-[#8b949e] text-[11px]">Use deep-z buffering for accurate block/voxel selection.</div>
                        </div>
                        <input type="checkbox" className="w-4 h-4 accent-[#bc8cff]" defaultChecked />
                     </div>
                     <div className="flex items-center justify-between bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                        <div>
                           <div className="text-[#c9d1d9] text-[13px] font-semibold">Auto-Compile Blueprints</div>
                           <div className="text-[#8b949e] text-[11px]">Compile visual logic graphs immediately on link change.</div>
                        </div>
                        <input type="checkbox" className="w-4 h-4 accent-[#bc8cff]" defaultChecked />
                     </div>
                     <div className="flex items-center justify-between bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                        <div>
                           <div className="text-[#c9d1d9] text-[13px] font-semibold">Camera Pan Sensitivity</div>
                           <div className="text-[#8b949e] text-[11px]">Multiplier for middle-mouse or alt-pan in 3D views.</div>
                        </div>
                        <input type="range" min="1" max="100" defaultValue="50" className="w-32 accent-[#58a6ff]" />
                     </div>
                  </div>
                </div>

                <div className="h-[1px] bg-[#30363d] w-full"></div>

                <div>
                  <h3 className="text-[#c9d1d9] text-[18px] font-semibold mb-1">Global Translation & Localization</h3>
                  <p className="text-[#8b949e] text-[13px] mb-4">35-Language Engine powered by ultra-fast SQLite WAL (Write-Ahead Logging).</p>
                  
                  <div className="flex flex-col gap-4 bg-[#161b22] border border-[#30363d] rounded-lg p-4 w-full">
                     <div className="flex items-center justify-between">
                       <span className="text-[#c9d1d9] text-[13px] font-semibold">{t('settings.language')}</span>
                       <select 
                          className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] text-[12px] rounded px-3 py-1 outline-none"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as any)}
                       >
                          {languages.map(lang => (
                             <option key={lang.code} value={lang.code}>
                                {lang.name}
                             </option>
                          ))}
                       </select>
                     </div>
                     <div className="text-[#8b949e] text-[11px] bg-[#0d1117] p-2 rounded border border-[#30363d]">
                        <strong>SQLite WAL Memory Cache Active:</strong> Queries execute in ~5ms. Pre-translated dictionary size: 35 languages loaded into RAM. Translation engine switches instantly (0ms). Unknown terms are automatically parsed by Nexus Prime (AI).
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'models' && (
              <div className="flex flex-col gap-6 max-w-3xl">
                <div>
                  <h3 className="text-[#c9d1d9] text-[18px] font-semibold mb-1">Local AI Model Manager (100% Offline)</h3>
                  <p className="text-[#8b949e] text-[13px] mb-4">Download specialized AI models to your local cluster. Once downloaded, these agents operate globally and offline, capable of inter-agent communication to develop complex systems independently.</p>
                  <div className="flex items-center gap-3 mb-6 p-3 bg-[#161b22] border border-[#30363d] rounded-lg relative overflow-hidden">
                    <Database size={24} className="text-[#3fb950] shrink-0" />
                    <div className="flex-1">
                      <div className="text-[#c9d1d9] text-[13px] font-medium">Multi-Agent Swarm Protocol</div>
                      <div className="text-[#8b949e] text-[11px]">When multiple agents are active, they will converse and assign tasks to each other automatically.</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={handleCheckUpdates} className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] rounded text-[12px] text-[#c9d1d9] transition-colors border border-[#30363d]">
                         Check Updates
                      </button>
                      <button onClick={handleEnableAll} className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] rounded text-[12px] text-white font-medium transition-colors border border-[rgba(240,246,252,0.1)]">
                         Download All
                      </button>
                      {models.some(m => m.status === 'update_available') && (
                        <button onClick={handleUpdateAll} className="px-3 py-1.5 bg-[#bc8cff] hover:bg-[#d2a8ff] text-black rounded text-[12px] font-medium transition-colors">
                           Update All
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {models.map(model => (
                    <div key={model.id} className="flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-[#c9d1d9] text-[14px] font-semibold flex items-center gap-2">
                            {model.name}
                            {model.status === 'downloaded' && <CheckCircle size={14} className="text-[#3fb950]" />}
                          </div>
                          <div className="text-[#8b949e] text-[12px] mt-1 pr-4">{model.description}</div>
                        </div>
                        <div className="flex flex-col items-end shrink-0 gap-2">
                           <div className="text-[#8b949e] text-[11px] bg-[#0d1117] px-2 py-1 rounded border border-[#30363d]">{model.size}</div>
                           {model.status === 'not_downloaded' && (
                             <button onClick={() => handleDownload(model.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] rounded border border-[#30363d] text-[11px] text-[#c9d1d9] transition-colors">
                               <Download size={14} /> Download
                             </button>
                           )}
                           {model.status === 'update_available' && (
                             <button onClick={() => handleDownload(model.id, true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 rounded text-[11px] transition-colors">
                               <Download size={14} /> Update Available
                             </button>
                           )}
                           {model.status === 'downloaded' && (
                             <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2ea043]/10 border border-[#3fb950]/30 rounded text-[11px] text-[#3fb950] cursor-default">
                               Installed & Active
                             </button>
                           )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      {(model.status === 'downloading' || model.status === 'updating') && (
                        <div className="w-full mt-3 bg-[#0d1117] border border-[#30363d] rounded p-2">
                          <div className="flex justify-between items-end text-[10px] text-[#8b949e] mb-2 font-mono">
                            <span className="text-[#c9d1d9]">{model.currentStep || 'Initializing...'}</span>
                            <span className="text-[#58a6ff] font-bold text-[12px]">{model.progress}%</span>
                          </div>
                          <div className="w-full bg-[#161b22] h-2 rounded-full overflow-hidden shadow-inner">
                            <div className={`h-full transition-all duration-300 ease-out relative ${model.status === 'updating' ? 'bg-gradient-to-r from-[#bc8cff]/50 to-[#bc8cff]' : 'bg-gradient-to-r from-[#58a6ff]/50 to-[#58a6ff]'}`} style={{ width: `${model.progress}%` }}>
                               <div className="absolute top-0 bottom-0 right-0 w-10 bg-gradient-to-r from-transparent to-white/30 blur-[2px]"></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-[#8b949e] mt-2">
                             <span>Speed: <span className="text-[#c9d1d9]">{model.downloadSpeed}</span></span>
                             <span>Time Left: <span className="text-white">{model.timeRemaining}</span></span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'swarm' && (
              <div className="flex flex-col gap-8 max-w-[800px] pb-10">
                <div>
                  <h3 className="text-[#c9d1d9] text-[18px] font-semibold mb-1">Decentralized AI Swarm Compute (Grid Network)</h3>
                  <p className="text-[#8b949e] text-[13px] mb-4">Leverage unused processing power across all your devices on the local network or internet to accelerate AI generation, rendering, and code compilation. The engine dynamically balances workloads across heterogeneous hardware (CPU, GPU, RAM, NPU, TPU) considering thermal limits and battery state.</p>
                  
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 mb-6 relative overflow-hidden">
                     <div className="absolute top-0 right-0 bg-[#58a6ff]/20 text-[#58a6ff] text-[10px] font-bold px-3 py-1 rounded-bl-lg border-b border-l border-[#58a6ff]/30">SWARM ACTIVE (MESH TOPOLOGY)</div>
                     
                     <div className="flex justify-between items-start mb-6 border-b border-[#30363d] pb-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full border-2 border-[#58a6ff] flex items-center justify-center bg-[#0d1117] relative shadow-[0_0_15px_rgba(88,166,255,0.3)]">
                              <div className="w-3 h-3 bg-[#3fb950] rounded-full animate-ping absolute top-0 right-0"></div>
                              <Server size={20} className="text-[#58a6ff]" />
                           </div>
                           <div>
                              <div className="text-[#c9d1d9] text-[15px] font-bold">Local Cluster Node (Master Control)</div>
                              <div className="text-[#3fb950] text-[11px] font-mono">Routing Compute Loads • Load Balancing Active</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-[11px] text-[#8b949e]">Total Swarm TFLOPS</div>
                           <div className="text-[28px] font-mono font-bold text-[#d2a8ff]">32.6</div>
                           <div className="text-[10px] text-[#3fb950]">+12.4 TFLOPS (Network Peak)</div>
                        </div>
                     </div>
                     
                     <div className="space-y-3">
                        <div className="text-[12px] font-semibold text-[#8b949e] mb-1 uppercase tracking-wider">Connected Compute Nodes</div>
                        
                        {/* Node 1 */}
                        <div 
                          className="flex flex-col bg-[#0d1117] p-3 rounded border border-[#30363d] gap-2 cursor-pointer hover:border-[#58a6ff] transition-colors"
                          onClick={() => setSimulatedNode({ name: 'iPhone 15 Pro Max', os: 'iOS 17.2', ip: '192.168.1.109', role: 'Compute Node', initialTask: 'LLM Token generation (Layer 12-24)' })}
                        >
                           <div className="flex items-center justify-between">
                              <span className="text-[#c9d1d9] flex items-center gap-2 text-[12px] font-bold">
                                 📱 iPhone 15 Pro Max 
                                 <span className="px-1.5 py-0.5 bg-[#8b949e]/20 rounded text-[9px] font-normal border border-[#8b949e]/30">iOS • A17 Pro NPU</span>
                              </span>
                              <span className="text-[#58a6ff] font-mono text-[11px]">Lat: 3ms • 1.2 TFLOPS</span>
                           </div>
                           <div className="flex items-center gap-4 text-[10px] text-[#8b949e]">
                              <span className="flex items-center gap-1"><Cpu size={10}/> NPU: 84%</span>
                              <span className="flex items-center gap-1"><Database size={10}/> RAM: 2.1GB/8GB</span>
                              <span className="flex items-center gap-1 text-[#e3b341]">🌡️ 38°C (Thermal Limit: 45°C)</span>
                              <span className="flex items-center gap-1">🔋 82% (Discharging)</span>
                           </div>
                           <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden mt-1">
                              <div className="bg-[#58a6ff] h-full w-[84%] animate-pulse"></div>
                           </div>
                           <div className="text-[10px] text-[#c9d1d9] mt-1 italic opacity-80 flex justify-between items-center">
                              <span>Task: LLM Token generation (Layer 12-24)</span>
                              <span className="text-[#58a6ff] text-[9px] font-bold uppercase tracking-wider bg-[#58a6ff]/10 px-1.5 py-0.5 rounded">View Live Logs</span>
                           </div>
                        </div>

                        {/* Node 2 */}
                        <div 
                          className="flex flex-col bg-[#0d1117] p-3 rounded border border-[#30363d] gap-2 cursor-pointer hover:border-[#d2a8ff] transition-colors"
                          onClick={() => setSimulatedNode({ name: 'MacBook Pro M3 Max', os: 'macOS Sonoma', ip: '192.168.1.105', role: 'Compute Node', initialTask: 'Path-Tracing Render (Frames 1-120)' })}
                        >
                           <div className="flex items-center justify-between">
                              <span className="text-[#c9d1d9] flex items-center gap-2 text-[12px] font-bold">
                                 💻 MacBook Pro M3 Max 
                                 <span className="px-1.5 py-0.5 bg-[#8b949e]/20 rounded text-[9px] font-normal border border-[#8b949e]/30">macOS • Metal GPU</span>
                              </span>
                              <span className="text-[#58a6ff] font-mono text-[11px]">Lat: 1ms • 28.5 TFLOPS</span>
                           </div>
                           <div className="flex items-center gap-4 text-[10px] text-[#8b949e]">
                              <span className="flex items-center gap-1"><Cpu size={10}/> GPU: 96%</span>
                              <span className="flex items-center gap-1"><Database size={10}/> RAM: 48GB/128GB</span>
                              <span className="flex items-center gap-1 text-[#3fb950]">🌡️ 62°C (Thermal Limit: 95°C)</span>
                              <span className="flex items-center gap-1">🔌 AC Power</span>
                           </div>
                           <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden mt-1">
                              <div className="bg-[#d2a8ff] h-full w-[96%] animate-pulse"></div>
                           </div>
                           <div className="text-[10px] text-[#c9d1d9] mt-1 italic opacity-80 flex justify-between items-center">
                              <span>Task: Path-Tracing Render (Frames 1-120) & Physics Simulation</span>
                              <span className="text-[#d2a8ff] text-[9px] font-bold uppercase tracking-wider bg-[#d2a8ff]/10 px-1.5 py-0.5 rounded">View Live Logs</span>
                           </div>
                        </div>

                        {/* Node 3 */}
                        <div 
                          className="flex flex-col bg-[#0d1117] p-3 rounded border border-[#30363d] gap-2 cursor-pointer hover:border-[#3fb950] transition-colors"
                          onClick={() => setSimulatedNode({ name: 'Samsung Galaxy S24 Ultra', os: 'Android 14', ip: '192.168.1.112', role: 'Compute Node', initialTask: 'Audio Processing Pipeline' })}
                        >
                           <div className="flex items-center justify-between">
                              <span className="text-[#c9d1d9] flex items-center gap-2 text-[12px] font-bold">
                                 📱 Samsung Galaxy S24 Ultra 
                                 <span className="px-1.5 py-0.5 bg-[#8b949e]/20 rounded text-[9px] font-normal border border-[#8b949e]/30">Android • Snapdragon NPU</span>
                              </span>
                              <span className="text-[#58a6ff] font-mono text-[11px]">Lat: 12ms • 2.8 TFLOPS</span>
                           </div>
                           <div className="flex items-center gap-4 text-[10px] text-[#8b949e]">
                              <span className="flex items-center gap-1"><Cpu size={10}/> CPU+NPU: 45%</span>
                              <span className="flex items-center gap-1"><Database size={10}/> RAM: 4GB/12GB</span>
                              <span className="flex items-center gap-1 text-[#3fb950]">🌡️ 34°C (Thermal Limit: 42°C)</span>
                              <span className="flex items-center gap-1 text-[#3fb950]">🔌 100% (Charging)</span>
                           </div>
                           <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden mt-1">
                              <div className="bg-[#3fb950] h-full w-[45%]"></div>
                           </div>
                           <div className="text-[10px] text-[#c9d1d9] mt-1 italic opacity-80 flex justify-between items-center">
                              <span>Task: Audio Processing / Voice Recognition Pipeline</span>
                              <span className="text-[#3fb950] text-[9px] font-bold uppercase tracking-wider bg-[#3fb950]/10 px-1.5 py-0.5 rounded">View Live Logs</span>
                           </div>
                        </div>

                        {/* Node 4 (Idle/Legacy) */}
                        <div className="flex flex-col bg-[#0d1117] p-3 rounded border border-[#30363d] gap-2 opacity-60">
                           <div className="flex items-center justify-between">
                              <span className="text-[#8b949e] flex items-center gap-2 text-[12px] font-bold">
                                 🖥️ Legacy Web Node (Chrome) 
                                 <span className="px-1.5 py-0.5 bg-[#8b949e]/20 rounded text-[9px] font-normal border border-[#8b949e]/30">WASM • WebGL</span>
                              </span>
                              <span className="text-[#8b949e] font-mono text-[11px]">Lat: 45ms • ~90 GFLOPS</span>
                           </div>
                           <div className="flex items-center gap-4 text-[10px] text-[#8b949e]">
                              <span className="flex items-center gap-1 text-[#e3b341]">Idle - Waiting for nano-tasks</span>
                           </div>
                        </div>
                     </div>

                     <div className="mt-5 pt-4 border-t border-[#30363d] flex justify-between items-center bg-[#0d1117] -mx-5 -mb-5 px-5 py-3">
                        <div className="text-[11px] font-mono text-[#8b949e]">Network Mode: <span className="text-[#3fb950]">P2P WebRTC Multi-cast</span></div>
                        <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] text-[11px] px-4 py-1.5 rounded shadow-sm transition-all hover:border-[#8b949e]">
                           + Pair New Device (QR Code / IP Subnet Scan)
                        </button>
                     </div>
                  </div>

                  <h3 className="text-[#c9d1d9] text-[15px] font-semibold mb-3 border-b border-[#30363d] pb-2">Swarm Architecture Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#8b949e] transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <div className="text-[#c9d1d9] text-[13px] font-semibold">WebRTC / WebSocket Mashup</div>
                           <input type="checkbox" className="w-3.5 h-3.5 accent-[#58a6ff]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[11px] leading-relaxed">Prioritizes zero-latency P2P via WebRTC with ICE Server fallbacks. Uses WebSocket to tunnel when strict NAT prevents direct connections.</div>
                     </div>

                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#8b949e] transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <div className="text-[#c9d1d9] text-[13px] font-semibold">Decentralized Storage (IPFS/KV Cache)</div>
                           <input type="checkbox" className="w-3.5 h-3.5 accent-[#58a6ff]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[11px] leading-relaxed">Splits large AI weights and assets across the RAM/Disk of the swarm. Avoids downloading 40GB models on one machine.</div>
                     </div>

                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#8b949e] transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <div className="text-[#c9d1d9] text-[13px] font-semibold">Thermal & Battery Governance</div>
                           <input type="checkbox" className="w-3.5 h-3.5 accent-[#58a6ff]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[11px] leading-relaxed">Automatically throttles workloads if a Mobile/Laptop node exceeds 45°C thermal bounds or drops below 20% battery.</div>
                     </div>

                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#8b949e] transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <div className="text-[#c9d1d9] text-[13px] font-semibold">Tensor Splitting (Pipeline Parallelism)</div>
                           <input type="checkbox" className="w-3.5 h-3.5 accent-[#58a6ff]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[11px] leading-relaxed">Slices transformer layers dynamically. Mobile computes layer 1-4, Server computes 5-24. High-bandwidth KV cache syncing.</div>
                     </div>
                     
                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#8b949e] transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <div className="text-[#c9d1d9] text-[13px] font-semibold">Fault Tolerance & Re-routing</div>
                           <input type="checkbox" className="w-3.5 h-3.5 accent-[#58a6ff]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[11px] leading-relaxed">If a node disconnects unexpectedly, its current work-state is instantly re-assigned to healthy nodes without freezing the application.</div>
                     </div>

                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#8b949e] transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <div className="text-[#c9d1d9] text-[13px] font-semibold flex items-center gap-1"><ShieldCheck size={14} className="text-[#3fb950]"/> E2E Compute Encryption</div>
                           <input type="checkbox" className="w-3.5 h-3.5 accent-[#58a6ff]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[11px] leading-relaxed">Protects tensor data and assets in transit using Quantum-Resistant AES-256-GCM. Ensures privacy over public Wi-Fi or untrusted LANs.</div>
                     </div>

                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#8b949e] transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <div className="text-[#c9d1d9] text-[13px] font-semibold flex items-center gap-1"><Zap size={14} className="text-[#e3b341]"/> Zero-Config Discovery</div>
                           <input type="checkbox" className="w-3.5 h-3.5 accent-[#58a6ff]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[11px] leading-relaxed">No IP config or port-forwarding needed. Uses mDNS/Bonjour to magically pair nodes as soon as the app is opened on the network.</div>
                     </div>

                     <div className="bg-[#161b22] border-[#30363d] rounded-lg p-4 relative">
                        <div className="text-[#c9d1d9] text-[13px] font-semibold mb-2">Mobile Wake-Lock</div>
                        <select className="w-full bg-[#0d1117] border border-[#30363d] text-[#8b949e] text-[11px] p-2 rounded outline-none focus:border-[#58a6ff]">
                           <option>Aggressive (Keep Screen On / Max Draw)</option>
                           <option>Balanced (Allow Sleep / Background compute)</option>
                           <option>Eco (Pause compute when locked)</option>
                        </select>
                     </div>
                  </div>
                  
                  <h3 className="text-[#c9d1d9] text-[15px] font-semibold mb-3 mt-6 border-b border-[#30363d] pb-2">Instant Node Onboarding (1-Click Setup)</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                     <div className="flex gap-4 items-center bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex-1">
                        <div className="w-20 h-20 bg-white p-1 rounded flex items-center justify-center shrink-0">
                           {/* Placeholder for QR Code */}
                           <div className="grid grid-cols-5 grid-rows-5 gap-0.5 w-full h-full p-1 opacity-80">
                              {[...Array(25)].map((_, i) => (
                                 <div key={i} className={`bg-black ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-0'}`}></div>
                              ))}
                           </div>
                        </div>
                        <div className="flex flex-col">
                           <div className="text-[#c9d1d9] text-[13px] font-bold mb-1">Scan to Add Phone/Tablet</div>
                           <div className="text-[#8b949e] text-[11px] mb-2 leading-relaxed">Point your iOS/Android native camera here. Instantly installs the lightweight PWA Node—no App Store required. Connects automatically.</div>
                           <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] text-[10px] px-3 py-1.5 rounded transition-colors w-fit flex items-center gap-1.5 font-semibold">
                              <Globe size={11} className="text-[#58a6ff]"/> Copy Universal Browser Link
                           </button>
                        </div>
                     </div>
                     <div className="flex gap-4 items-start bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex-1">
                        <div className="flex flex-col w-full h-full justify-between">
                           <div>
                              <div className="text-[#c9d1d9] text-[13px] font-bold mb-1">Desktop & Background Service</div>
                              <div className="text-[#8b949e] text-[11px] mb-3 leading-relaxed">Download the standalone binary for Windows, macOS, or Linux. Runs silently in the system tray and boots on startup.</div>
                           </div>
                           <div className="flex gap-2">
                              <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] text-[10px] px-3 py-1.5 rounded transition-colors flex-1 flex justify-center items-center gap-1.5 font-semibold">
                                 <Download size={11} className="text-[#3fb950]"/> Win
                              </button>
                              <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] text-[10px] px-3 py-1.5 rounded transition-colors flex-1 flex justify-center items-center gap-1.5 font-semibold">
                                 <Download size={11} className="text-[#c9d1d9]"/> Mac
                              </button>
                              <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] text-[10px] px-3 py-1.5 rounded transition-colors flex-1 flex justify-center items-center gap-1.5 font-semibold">
                                 <Download size={11} className="text-[#e3b341]"/> Linux
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'acceleration' && (
              <div className="flex flex-col gap-8 max-w-3xl pb-10">
                <div>
                  <h3 className="text-[#c9d1d9] text-[18px] font-semibold mb-1 flex items-center gap-2"><Cpu size={20} className="text-[#e3b341]"/> Ultimate Offline AI Acceleration</h3>
                  <p className="text-[#8b949e] text-[13px] mb-4">Bleeding-edge techniques to massively accelerate local AI models (LLMs, Diffusion) bypassing traditional bottlenecks, providing 10x-50x speedups without internet.</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                     <div className="bg-[#161b22] border border-[#e3b341]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(227,179,65,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                           <div className="text-[#c9d1d9] text-[14px] font-bold tracking-wide">BitNet b1.58 (Ternary Weights / 1.58-bit LLMs)</div>
                           <input type="checkbox" className="w-4 h-4 accent-[#e3b341]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[12px] leading-relaxed mb-2">Replaces FP16 matrix multiplications with addition/subtraction. Reduces VRAM usage by 85% and multiplies inference speed by up to 25x while maintaining full FP16 intelligence.</div>
                        <div className="text-[#e3b341] text-[10px] font-mono bg-[#e3b341]/10 px-2 py-1 rounded inline-block">Active: 70B Model running on 6GB VRAM</div>
                     </div>

                     <div className="bg-[#161b22] border border-[#e3b341]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(227,179,65,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                           <div className="text-[#c9d1d9] text-[14px] font-bold tracking-wide">DirectStorage / DMA Tensor Streaming</div>
                           <input type="checkbox" className="w-4 h-4 accent-[#e3b341]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[12px] leading-relaxed mb-2">Streams AI weights directly from NVMe SSD to GPU VRAM bypassing the CPU and System RAM entirely. Eliminates model loading times (0ms cold boot for massive models).</div>
                        <div className="text-[#e3b341] text-[10px] font-mono bg-[#e3b341]/10 px-2 py-1 rounded inline-block">Bypass Pipeline: NVMe PCIe Gen4/5 {'->'} GPU Memory</div>
                     </div>

                     <div className="bg-[#161b22] border border-[#e3b341]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(227,179,65,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                           <div className="text-[#c9d1d9] text-[14px] font-bold tracking-wide">Medusa Heads (Multi-Token Speculative Decoding)</div>
                           <input type="checkbox" className="w-4 h-4 accent-[#e3b341]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[12px] leading-relaxed mb-2">Adds multiple decoding heads to the base LLM, predicting 5-10 tokens simultaneously per forward pass instead of just 1. Exponentially increases text generation output.</div>
                     </div>

                     <div className="bg-[#161b22] border border-[#e3b341]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(227,179,65,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                           <div className="text-[#c9d1d9] text-[14px] font-bold tracking-wide">PagedAttention & Continuous Batching</div>
                           <input type="checkbox" className="w-4 h-4 accent-[#e3b341]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[12px] leading-relaxed mb-2">Treats KV-Cache like an OS virtual memory table, eliminating memory fragmentation entirely allowing massive multi-agent parallel generation without VRAM crashes.</div>
                     </div>
                  </div>
                </div>

                <div className="h-[1px] bg-[#30363d] w-full"></div>

                <div>
                  <h3 className="text-[#c9d1d9] text-[18px] font-semibold mb-1 flex items-center gap-2"><Zap size={20} className="text-[#58a6ff]"/> Deep Program & App Processing Acceleration</h3>
                  <p className="text-[#8b949e] text-[13px] mb-4">Low-level, bare-metal optimizations ensuring the software UI and backend logic execute at maximum theoretical hardware speeds.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-[#161b22] border border-[#58a6ff]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(88,166,255,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                           <div className="text-[#c9d1d9] text-[13px] font-bold">WASM SIMD Vectorization</div>
                           <input type="checkbox" className="w-3.5 h-3.5 accent-[#58a6ff]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[11px] leading-relaxed">Transforms loops and array iterations into Single Instruction Multiple Data operations mapping directly to CPU AVX-512 flags.</div>
                     </div>

                     <div className="bg-[#161b22] border border-[#58a6ff]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(88,166,255,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                           <div className="text-[#c9d1d9] text-[13px] font-bold">AOT Engine Graph Compilation</div>
                           <input type="checkbox" className="w-3.5 h-3.5 accent-[#58a6ff]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[11px] leading-relaxed">Ahead-of-Time compiler turns visual Blueprints and generic scripts into native machine code (C++ equivalent) before execution.</div>
                     </div>

                     <div className="bg-[#161b22] border border-[#58a6ff]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(88,166,255,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                           <div className="text-[#c9d1d9] text-[13px] font-bold">Lock-Free ECS Matrix (Data-Oriented)</div>
                           <input type="checkbox" className="w-3.5 h-3.5 accent-[#58a6ff]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[11px] leading-relaxed">Swraps traditional OOP objects into flat memory arrays (Entity-Component-System). L1/L2 Cache hit rates soar past 99%.</div>
                     </div>

                     <div className="bg-[#161b22] border border-[#58a6ff]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(88,166,255,0.05)]">
                        <div className="flex justify-between items-start mb-2">
                           <div className="text-[#c9d1d9] text-[13px] font-bold">Zero-Copy Memory IPC</div>
                           <input type="checkbox" className="w-3.5 h-3.5 accent-[#58a6ff]" defaultChecked />
                        </div>
                        <div className="text-[#8b949e] text-[11px] leading-relaxed">Multi-threaded processes now share memory pointers rather than cloning Data Arrays. Nullifies overhead between rendering & logic.</div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'keys' && (
              <div className="flex flex-col gap-8 max-w-4xl pb-10">
                <div>
                  <h3 className="text-[#c9d1d9] text-[18px] font-semibold mb-1 flex items-center gap-2"><ShieldCheck size={20} className="text-[#e3b341]"/> Enterprise API Credentials & Cloud Bindings</h3>
                  <p className="text-[#8b949e] text-[13px] mb-4">Secure isolated vault for external API credentials. Keys are encrypted at rest using AES-GCM-256 and never sent to our servers. Local swarm nodes receive limited-time bearer tokens.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Google / GCP */}
                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 hover:border-[#58a6ff] transition-colors">
                        <div className="flex justify-between items-center mb-3">
                           <div className="font-bold text-[#c9d1d9] text-[14px]">Google Cloud / Gemini API</div>
                           <span className="text-[9px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded border border-[#3fb950]/30 font-bold tracking-wider">CONNECTED</span>
                        </div>
                        <input type="password" value="****************************************" disabled className="w-full bg-[#0d1117] border border-[#30363d] text-[#8b949e] text-[11px] font-mono rounded px-3 py-2 mb-2" />
                        <div className="flex gap-2">
                           <button className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-[11px] py-1.5 rounded text-[#c9d1d9] font-semibold transition-colors">Rotate Key</button>
                           <button className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-[11px] py-1.5 rounded text-[#c9d1d9] font-semibold transition-colors">Revoke</button>
                        </div>
                     </div>
                     
                     {/* Anthropic */}
                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 hover:border-[#bc8cff] transition-colors">
                        <div className="flex justify-between items-center mb-3">
                           <div className="font-bold text-[#c9d1d9] text-[14px]">Anthropic / Claude API</div>
                           <span className="text-[9px] bg-[#8b949e]/20 text-[#8b949e] px-2 py-0.5 rounded border border-[#8b949e]/30 font-bold tracking-wider">UNCONFIGURED</span>
                        </div>
                        <input type="password" placeholder="sk-ant-..." className="w-full bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[11px] font-mono rounded px-3 py-2 mb-2 focus:border-[#bc8cff] outline-none transition-colors" />
                        <button className="w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 text-[11px] py-1.5 rounded font-semibold transition-colors">Save & Authenticate</button>
                     </div>

                     {/* OpenAI */}
                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 hover:border-[#3fb950] transition-colors">
                        <div className="flex justify-between items-center mb-3">
                           <div className="font-bold text-[#c9d1d9] text-[14px]">OpenAI API</div>
                           <span className="text-[9px] bg-[#8b949e]/20 text-[#8b949e] px-2 py-0.5 rounded border border-[#8b949e]/30 font-bold tracking-wider">UNCONFIGURED</span>
                        </div>
                        <input type="password" placeholder="sk-..." className="w-full bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[11px] font-mono rounded px-3 py-2 mb-2 focus:border-[#3fb950] outline-none transition-colors" />
                        <button className="w-full bg-[#3fb950]/10 hover:bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/30 text-[11px] py-1.5 rounded font-semibold transition-colors">Save & Authenticate</button>
                     </div>
                     
                     {/* AWS / S3 */}
                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 hover:border-[#e3b341] transition-colors">
                        <div className="flex justify-between items-center mb-3">
                           <div className="font-bold text-[#c9d1d9] text-[14px]">AWS IAM / S3 Bucket</div>
                           <span className="text-[9px] bg-[#8b949e]/20 text-[#8b949e] px-2 py-0.5 rounded border border-[#8b949e]/30 font-bold tracking-wider">UNCONFIGURED</span>
                        </div>
                        <div className="flex gap-2 mb-2">
                           <input type="text" placeholder="Access Key" className="w-1/2 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[11px] font-mono rounded px-3 py-2 focus:border-[#e3b341] outline-none transition-colors" />
                           <input type="password" placeholder="Secret Key" className="w-1/2 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[11px] font-mono rounded px-3 py-2 focus:border-[#e3b341] outline-none transition-colors" />
                        </div>
                        <button className="w-full bg-[#e3b341]/10 hover:bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/30 text-[11px] py-1.5 rounded font-semibold transition-colors">Bind AWS Services</button>
                     </div>
                  </div>
                </div>

                <div className="bg-[#161b22] border border-[#e3b341]/50 rounded-lg p-4 shadow-[0_0_15px_rgba(227,179,65,0.05)] relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e3b341]"></div>
                    <div className="pl-3">
                       <h3 className="text-[#c9d1d9] text-[14px] font-bold mb-1">Key Delegation for Offline Agents</h3>
                       <p className="text-[#8b949e] text-[12px] mb-3">When the Multi-Agent Swarm is disconnected from the internet, offline models need access to mock services or relay tunnels. Enable proxy-relaying to grant them secure sandboxed API access via the host.</p>
                       <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 accent-[#e3b341]" />
                          <span className="text-[13px] text-[#c9d1d9] font-medium">Enable LAN-Proxy Key Inheritance</span>
                       </label>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'attribution' && (
              <AICodeBrandingSettingsTab />
            )}

            {activeTab !== 'models' && activeTab !== 'general' && activeTab !== 'swarm' && activeTab !== 'acceleration' && activeTab !== 'keys' && activeTab !== 'attribution' && (
              <div className="flex items-center justify-center h-full text-[#8b949e] text-[13px]">
                Settings under development for {activeTab}. Check Local AI Models.
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Simulated Node View Modal (Headless / Minimal UI) */}
      {simulatedNode && (
        <div className="fixed inset-0 bg-[#000000] z-[200] flex flex-col font-mono text-[13px] animate-in fade-in duration-200 p-2">
           {/* Ultimate Minimal Header */}
           <div className="h-8 flex items-center justify-between bg-black text-[#8b949e] shrink-0 border-b border-[#333] mb-2 px-1">
              <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest font-bold">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full animate-ping"></div>
                   <span>Minimal Compute Mode Active</span>
                 </div>
                 <span className="opacity-50">|</span>
                 <span className="text-[#58a6ff]">Engine: Standalone</span>
                 <span className="opacity-50">|</span>
                 <span className="text-[#bc8cff]">GUI: Disabled</span>
              </div>
              <button 
                onClick={() => setSimulatedNode(null)} 
                className="text-[#8b949e] hover:text-white bg-black transition-colors px-2 rounded opacity-50 hover:opacity-100 uppercase text-[10px] tracking-wider border border-transparent hover:border-[#8b949e]"
              >
                [ Close Window ]
              </button>
           </div>
           
           {/* Direct Console Output */}
           <div className="flex-1 overflow-y-auto p-1 custom-scrollbar flex flex-col font-mono text-[11px] md:text-[12px] bg-black">
              {nodeLogs.map((log, index) => {
                 let color = "text-[#666]";
                 if (log.includes("[COMPUTE]")) color = "text-[#bc8cff]";
                 if (log.includes("[NETWORK]")) color = "text-[#58a6ff]";
                 if (log.includes("[HEARTBEAT]")) color = "text-[#e3b341]";
                 if (log.includes("[SECURITY]")) color = "text-[#3fb950]";
                 if (log.includes("[READY]")) color = "text-[#3fb950] font-bold";
                 if (log.includes("[SYSTEM]") || log.includes("[FAULT-TOLERANCE]") || log.includes("[HARDWARE]")) color = "text-white font-bold";
                 
                 return (
                   <div key={index} className={`mb-0.5 ${color} flex`}>
                      <span className="opacity-40 select-none mr-2 w-4 text-center">{'>'}</span>
                      <span>{log}</span>
                   </div>
                 );
              })}
              {/* Auto-scroll target */}
              <div ref={(el) => { el?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }} />
           </div>
        </div>
      )}
    </div>
  );
}
