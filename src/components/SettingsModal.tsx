import React, { useState, useEffect } from 'react';
import { X, Server, Download, CheckCircle, Database } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  size: string;
  status: 'not_downloaded' | 'downloading' | 'downloaded';
  progress?: number;
}

const initialModels: AIModel[] = [
  { id: 'core', name: 'NexusCode Core (Copilot)', description: 'Core LLM for 50+ languages, logic solving, and bug fixing.', size: '4.2 GB', status: 'downloaded' },
  { id: 'commander', name: 'Nexus Prime (Swarm Overlord)', description: 'Master AI Orchestrator. Evaluates outputs, runs QA checks (95%+ match), assigns tasks to other nodes.', size: '18.1 GB', status: 'not_downloaded' },
  { id: 'uiux', name: 'DesignNet-Pro (UI/UX)', description: 'Specialized in frontend, layout rhythms, and accessibility for Apps & Games.', size: '2.8 GB', status: 'downloaded' },
  { id: 'story', name: 'LoreMaster Infinite (Story AI)', description: 'Generates 100,000+ hours of lore, narratives, and endless scalable quests.', size: '32.4 GB', status: 'not_downloaded' },
  { id: 'game', name: 'GameDir Engine (Game Design)', description: 'Orchestrates game logic, systems, rules, state machines, and level flow.', size: '6.1 GB', status: 'not_downloaded' },
  { id: 'world', name: 'TerraGen (Massive Maps & Worlds)', description: 'Algorithmically generates giant 3D & 2D maps, landscapes, and dungeon layouts.', size: '12.4 GB', status: 'not_downloaded' },
  { id: 'vuln', name: 'VulnScan-Zero (Security & Bug Bounty)', description: 'Aggressive vulnerability scanner and auto-patcher for exploits and 0-days.', size: '5.5 GB', status: 'not_downloaded' },
  { id: 'audio', name: 'SoundNet-7.0 (Music & Sound)', description: 'Procedural audio generation, game music composition, and DSP node networks.', size: '3.9 GB', status: 'not_downloaded' },
  { id: 'vision', name: 'TextureDiff (Images & Base Textures)', description: 'Stable Diffusion variant optimized for seamless PBR materials and 2D sprites.', size: '15.6 GB', status: 'not_downloaded' },
  { id: 'mesh', name: 'MeshGenius (3D & 2D Models)', description: 'Generates OBJ/GLTF and 2D sprite sheets. Auto-rigs and maps UVs.', size: '8.7 GB', status: 'not_downloaded' },
  { id: 'swarm', name: 'Multi-Agent Swarm Logic', description: 'Allows offline AIs to communicate seamlessly to co-develop projects independently.', size: '1.2 GB', status: 'not_downloaded' },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('models');
  const [models, setModels] = useState<AIModel[]>(initialModels);

  useEffect(() => {
    const savedModels = localStorage.getItem('nexus_ai_models');
    if (savedModels) {
      setModels(JSON.parse(savedModels));
    }
  }, []);

  const saveModels = (updated: AIModel[]) => {
    setModels(updated);
    localStorage.setItem('nexus_ai_models', JSON.stringify(updated));
  };

  const handleDownload = (id: string) => {
    let updated = models.map(m => m.id === id ? { ...m, status: 'downloading', progress: 0 } : m);
    // Explicitly set as AIModel[] to fix type issues
    saveModels(updated as AIModel[]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setModels(current => {
          const finished = current.map(m => m.id === id ? { ...m, status: 'downloaded', progress: 100 } : m);
          localStorage.setItem('nexus_ai_models', JSON.stringify(finished));
          return finished as AIModel[];
        });
      } else {
        setModels(current => current.map(m => m.id === id ? { ...m, progress } : m) as AIModel[]);
      }
    }, 400);
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
               onClick={() => setActiveTab('swarm')}
               className={`text-left px-4 py-2 text-[12px] transition-colors border-l-2 ${activeTab === 'swarm' ? 'text-[#c9d1d9] border-[#58a6ff] bg-[#21262d]/50' : 'text-[#8b949e] border-transparent hover:text-[#c9d1d9]'}`}
             >Swarm / Render Farm</button>
             <button 
               onClick={() => setActiveTab('keys')}
               className={`text-left px-4 py-2 text-[12px] transition-colors border-l-2 ${activeTab === 'keys' ? 'text-[#c9d1d9] border-[#58a6ff] bg-[#21262d]/50' : 'text-[#8b949e] border-transparent hover:text-[#c9d1d9]'}`}
             >API Keys & Credentials</button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-[#0d1117] overflow-y-auto custom-scrollbar p-6">
            
            {activeTab === 'general' && (
              <div className="flex flex-col gap-8 max-w-3xl">
                <div>
                  <h3 className="text-[#c9d1d9] text-[18px] font-semibold mb-1">AI Turbo Engine Parameters</h3>
                  <p className="text-[#8b949e] text-[13px] mb-4">Core optimizations utilizing full GPU CUDA/Metal capability for massive performance gains.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-[#161b22] border border-[#3fb950]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(63,185,80,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#3fb950] text-[#0d1117] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">ENABLED</div>
                        <div className="text-[#c9d1d9] font-semibold text-[13px] mb-1">GPU Full Acceleration</div>
                        <div className="text-[#8b949e] text-[11px]">Bypasses CPU rendering. Native CUDA (Nvidia) and Metal (Apple Silicon) utilization on all layers.</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#3fb950]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(63,185,80,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#3fb950] text-[#0d1117] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">ENABLED</div>
                        <div className="text-[#c9d1d9] font-semibold text-[13px] mb-1">Flash Attention 3x</div>
                        <div className="text-[#8b949e] text-[11px]">New optimized attention kernel. Speeds up LLM generation by 300% and drastically reduces VRAM.</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#3fb950]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(63,185,80,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#3fb950] text-[#0d1117] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">ENABLED</div>
                        <div className="text-[#c9d1d9] font-semibold text-[13px] mb-1">FP16 KV Cache (Half-Memory)</div>
                        <div className="text-[#8b949e] text-[11px]">Half-precision state caching halves VRAM consumption allowing up to 16M token context dynamically.</div>
                     </div>
                     <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#8b949e] text-[#0d1117] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">ACTIVE</div>
                        <div className="text-[#c9d1d9] font-semibold text-[13px] mb-1">Speculative Decoding</div>
                        <div className="text-[#8b949e] text-[11px]">1B Param model predicts next tokens, 8B/13B models verify them. Speeds up completion by up to 13x (0.05s).</div>
                     </div>
                  </div>
                </div>

                <div className="h-[1px] bg-[#30363d] w-full"></div>

                <div>
                  <h3 className="text-[#c9d1d9] text-[18px] font-semibold mb-1">Global Translation & Localization</h3>
                  <p className="text-[#8b949e] text-[13px] mb-4">35-Language Engine powered by ultra-fast SQLite WAL (Write-Ahead Logging).</p>
                  
                  <div className="flex flex-col gap-4 bg-[#161b22] border border-[#30363d] rounded-lg p-4 w-full">
                     <div className="flex items-center justify-between">
                       <span className="text-[#c9d1d9] text-[13px] font-semibold">Active Editor Language</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] text-[12px] rounded px-3 py-1 outline-none">
                          <option value="th">🇹🇭 Thai (TH) - Active</option>
                          <option value="en">🇺🇸 English (EN)</option>
                          <option value="zh_CN">🇨🇳 Chinese Simplified</option>
                          <option value="ja">🇯🇵 Japanese</option>
                          <option value="auto">🌐 Auto-Detect via AI</option>
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
                  <div className="flex items-center gap-3 mb-6 p-3 bg-[#161b22] border border-[#30363d] rounded-lg">
                    <Database size={24} className="text-[#3fb950]" />
                    <div className="flex-1">
                      <div className="text-[#c9d1d9] text-[13px] font-medium">Multi-Agent Swarm Protocol</div>
                      <div className="text-[#8b949e] text-[11px]">When multiple agents are active, they will converse and assign tasks to each other automatically.</div>
                    </div>
                    <button onClick={handleEnableAll} className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] rounded text-[12px] text-white font-medium transition-colors border border-[rgba(240,246,252,0.1)]">
                       Download All Agents
                    </button>
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
                           {model.status === 'downloaded' && (
                             <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2ea043]/10 border border-[#3fb950]/30 rounded text-[11px] text-[#3fb950] cursor-default">
                               Installed & Active
                             </button>
                           )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      {model.status === 'downloading' && (
                        <div className="w-full mt-2">
                          <div className="flex justify-between text-[10px] text-[#8b949e] mb-1">
                            <span>Downloading network weights...</span>
                            <span>{model.progress}%</span>
                          </div>
                          <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#30363d]">
                            <div className="bg-[#58a6ff] h-full transition-all duration-300" style={{ width: `${model.progress}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab !== 'models' && (
              <div className="flex items-center justify-center h-full text-[#8b949e] text-[13px]">
                Settings under development for {activeTab}. Check Local AI Models.
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
