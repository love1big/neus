import React, { useState, useEffect } from 'react';
import { Settings, Gamepad2, Globe, MonitorPlay, Save, Languages, Orbit, Activity, ChevronRight, HardDrive, Plus, Trash2, Cpu, Database, Eye, ShieldCheck, Zap, Layers, Wind, Droplets, BrainCircuit, Server, Workflow, Network, Activity as ActivityIcon} from 'lucide-react';

export default function ProjectSettingsEditor() {
  const [activeTab, setActiveTab] = useState('input');
  
  // Instance Edit State
  const [isInstanceEditMode, setIsInstanceEditMode] = useState(false);
  const [instanceName, setInstanceName] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('editInstanceContext') === 'true') {
      setIsInstanceEditMode(true);
      setInstanceName(sessionStorage.getItem('editInstanceName') || 'Instance');
      setActiveTab('physics'); // Default to physics if editing instance
    }
  }, []);

  const handleReturnToMap = () => {
    sessionStorage.removeItem('editInstanceContext');
    sessionStorage.removeItem('editInstanceName');
    setIsInstanceEditMode(false);
    alert(`Physics properties for [${instanceName}] saved to map override.`);
  };

  const [physicsMaterials, setPhysicsMaterials] = useState([
    { id: 'mat_default', name: 'DefaultMaterial', bounce: 0.3, friction: 0.5 },
    { id: 'mat_bouncy', name: 'BouncyMaterial', bounce: 0.8, friction: 0.2 },
    { id: 'mat_ice', name: 'IceMaterial', bounce: 0.1, friction: 0.0 }
  ]);

  const handleAddMaterial = () => {
    setPhysicsMaterials([
      ...physicsMaterials,
      { id: `mat_${Date.now()}`, name: 'NewMaterial', bounce: 0.5, friction: 0.5 }
    ]);
  };

  const updateMaterial = (id: string, field: string, value: string | number) => {
    setPhysicsMaterials(physicsMaterials.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const deleteMaterial = (id: string) => {
    setPhysicsMaterials(physicsMaterials.filter(m => m.id !== id));
  };

  return (
    <div className="flex h-full bg-[#0d1117] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#161b22] border-r border-[#30363d] p-3 flex flex-col gap-2 overflow-y-auto">
        <h2 className="text-[12px] font-bold text-[#8b949e] uppercase tracking-wider mb-2">Project Settings</h2>
        
        <button onClick={() => setActiveTab('input')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'input' ? 'bg-[#21262d] text-[#58a6ff]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
          <Gamepad2 size={16}/> Input & Binding
        </button>
        <button onClick={() => setActiveTab('physics')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'physics' ? 'bg-[#21262d] text-[#e3b341]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
          <Orbit size={16}/> Physics & Collision
        </button>
        <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'ai' ? 'bg-[#21262d] text-[#bc8cff]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
          <BrainCircuit size={16}/> Offline AI Engine
        </button>
        <button onClick={() => setActiveTab('graphics')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'graphics' ? 'bg-[#21262d] text-[#bc8cff]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
          <MonitorPlay size={16}/> Graphics & Rendering
        </button>
        <button onClick={() => setActiveTab('network')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'network' ? 'bg-[#21262d] text-[#3fb950]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
          <Globe size={16}/> Network & Multiplayer
        </button>
        <button onClick={() => setActiveTab('localization')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'localization' ? 'bg-[#21262d] text-[#ff7b72]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
          <Languages size={16}/> Localization
        </button>
        <button onClick={() => setActiveTab('savegame')} className={`flex items-center gap-2 px-3 py-2 rounded text-[11px] font-semibold transition-colors ${activeTab === 'savegame' ? 'bg-[#21262d] text-[#8b949e]' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}>
          <Save size={16}/> Save Config
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Instance Edit Override Banner */}
          {isInstanceEditMode && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-[#58a6ff]/10 border border-[#58a6ff]/30 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-3 shadow-[0_0_15px_rgba(88,166,255,0.1)] group cursor-default">
                <div className="relative">
                  <span className="text-[11px] text-white font-bold tracking-wider flex items-center gap-2">
                    <span className="text-[#58a6ff]"><Orbit size={14} className="inline-block" /> PHYSICS OVERRIDE:</span> {instanceName}
                  </span>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-[#161b22] border border-[#30363d] rounded-lg p-3 hidden group-hover:block shadow-2xl">
                     <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-2 border-b border-[#30363d] pb-1">Unlinked Properties</div>
                     <ul className="text-[11px] space-y-1 text-white mb-3">
                        <li className="flex justify-between"><span>Physical Material</span> <span className="text-[#3fb950]">Modified (Bouncy)</span></li>
                        <li className="flex justify-between"><span>Mass (kg)</span> <span className="text-[#3fb950]">Override (15.5)</span></li>
                     </ul>
                     <button onClick={() => alert('Reverted physics overrides to Base Blueprint defaults.')} className="w-full text-left px-2 py-1 text-[11px] hover:bg-[#21262d] rounded text-[#ff7b72] flex items-center gap-2 transition-colors mb-1"><Trash2 size={14}/> Revert to Base Blueprint</button>
                     <button onClick={() => alert('Physics changes applied to the Base Blueprint. All other instances will inherit these changes.')} className="w-full text-left px-2 py-1 text-[11px] hover:bg-[#21262d] rounded text-[#58a6ff] flex items-center gap-2 transition-colors"><Save size={14}/> Apply to Base Blueprint</button>
                  </div>
                </div>
                <div className="w-[1px] h-3 bg-[#58a6ff]/20"></div>
                <button 
                  onClick={handleReturnToMap}
                  className="text-[10px] text-[#0d1117] bg-[#58a6ff] hover:bg-[#79b8ff] px-2 py-0.5 rounded font-bold transition-colors"
                >
                  Commit to Level
                </button>
             </div>
          )}

          <div className="absolute top-4 right-4 text-[10px] bg-[#21262d] text-[#8b949e] px-2 py-1 rounded">Advanced Offline System Config</div>

          {activeTab === 'input' && (
             <div className="max-w-4xl max-h-full">
                <h1 className="text-xl font-bold mb-6 flex items-center gap-2"><Gamepad2 className="text-[#58a6ff]"/> Input Mappings</h1>
                
                <div className="mb-8">
                   <h2 className="text-sm font-bold text-[#e3b341] border-b border-[#30363d] pb-2 mb-4">Action Mappings (Discrete)</h2>
                   <div className="space-y-3">
                      <div className="bg-[#161b22] border border-[#30363d] p-3 rounded">
                         <div className="flex items-center justify-between mb-2">
                           <span className="font-bold text-[12px]">Jump</span>
                           <button className="text-[10px] bg-[#21262d] px-2 py-1 rounded hover:bg-[#30363d]">+ Add Key</button>
                         </div>
                         <div className="pl-4 flex flex-col gap-2">
                            <div className="flex items-center gap-4 text-[11px]">
                               <span className="bg-[#30363d] px-2 py-1 rounded shadow-inner font-mono text-white">Space Bar</span>
                               <span className="text-[#8b949e]">Keyboard</span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px]">
                               <span className="bg-[#30363d] px-2 py-1 rounded shadow-inner font-mono text-white">Gamepad Face Button Bottom</span>
                               <span className="text-[#8b949e]">Gamepad</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div>
                   <h2 className="text-sm font-bold text-[#e3b341] border-b border-[#30363d] pb-2 mb-4">Axis Mappings (Continuous)</h2>
                   <div className="space-y-3">
                      <div className="bg-[#161b22] border border-[#30363d] p-3 rounded">
                         <div className="flex items-center justify-between mb-2">
                           <span className="font-bold text-[12px]">MoveForward</span>
                           <button className="text-[10px] bg-[#21262d] px-2 py-1 rounded hover:bg-[#30363d]">+ Add Key</button>
                         </div>
                         <div className="pl-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[11px] bg-[#0d1117] p-2 rounded">
                               <div className="flex items-center gap-4">
                                 <span className="bg-[#30363d] px-2 py-1 rounded shadow-inner font-mono text-white">W</span>
                                 <span className="text-[#8b949e]">Keyboard</span>
                               </div>
                               <span className="font-mono text-[#3fb950]">Scale: 1.0</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'graphics' && (
             <div className="max-w-5xl">
                 <h1 className="text-xl font-bold mb-6 flex items-center gap-2"><MonitorPlay className="text-[#bc8cff]"/> Rendering Pipeline & Advanced Post-Processing</h1>
                 
                 <div className="bg-[#161b22] p-4 rounded border border-[#30363d] mb-6 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#bc8cff]/10 blur-3xl rounded-full pointer-events-none"></div>
                    <div>
                       <h3 className="text-[#c9d1d9] font-bold text-sm">Renderer Backbone</h3>
                       <p className="text-[11px] text-[#8b949e]">Select the core drawing API and execution model.</p>
                    </div>
                    <select className="bg-[#0d1117] border border-[#bc8cff]/50 text-[#bc8cff] font-bold text-sm rounded px-4 py-2 outline-none">
                       <option>Deferred Deferred (DX12 Ultimate)</option>
                       <option>Forward+ (Vulkan 1.3)</option>
                       <option>Path Tracer (Neural Accelerated)</option>
                       <option>Legacy WebGL Fallback</option>
                    </select>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* GI */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Settings size={14} className="text-[#58a6ff]"/> Global Illumination</h3>
                        <div className="space-y-4 text-[11px]">
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Method</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none">
                                   <option>Lumen (Software Raytracing)</option>
                                   <option>Hardware Raytraced (RTX)</option>
                                   <option>Screen Space (SSGI)</option>
                                   <option>Baked Radiosity (Lightmaps)</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Final Gather Quality</span>
                                <input type="range" min="1" max="100" defaultValue="75" className="w-24 accent-[#58a6ff]" />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#8b949e]">Max Bounces</span>
                                <input type="number" defaultValue="4" className="w-16 bg-[#0d1117] border border-[#30363d] rounded px-1 py-0.5 text-center text-white" />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Skylight Leaking Fix</span>
                                <input type="checkbox" className="accent-[#58a6ff]" defaultChecked />
                            </label>
                        </div>
                    </div>

                    {/* Anti-Aliasing & Upscaling */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Eye size={14} className="text-[#e3b341]"/> AA & Super Resolution</h3>
                        <div className="space-y-4 text-[11px]">
                            <label className="flex flex-col gap-1">
                                <span className="text-[#c9d1d9]">Anti-Aliasing Method</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1.5 rounded outline-none w-full">
                                   <option>TSR (Temporal Super Resolution)</option>
                                   <option>TAA (Temporal Anti-Aliasing gen 5)</option>
                                   <option>NVIDIA DLSS 3.5 (Frame Gen)</option>
                                   <option>AMD FSR 3.0</option>
                                   <option>Intel XeSS</option>
                                   <option>FXAA / SMAA</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer mt-2">
                                <span className="text-[#c9d1d9]">Base Render Scale</span>
                                <span className="text-[#e3b341] font-mono">66.7% (Quality)</span>
                            </label>
                            <input type="range" min="25" max="200" defaultValue="66" className="w-full accent-[#e3b341]" />
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">AI Frame Generation</span>
                                <input type="checkbox" className="accent-[#e3b341]" defaultChecked />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Sharpness Filter</span>
                                <input type="range" min="0" max="10" defaultValue="3" className="w-20 accent-[#e3b341]" />
                            </label>
                        </div>
                    </div>

                    {/* Shadows & Ambient Occlusion */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Layers size={14} className="text-[#8b949e]"/> Shadows & AO</h3>
                        <div className="space-y-4 text-[11px]">
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Shadow Map Resolution</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none">
                                   <option>8192x8192 (Cinematic)</option>
                                   <option>4096x4096 (Epic)</option>
                                   <option>2048x2048 (High)</option>
                                   <option>1024x1024 (Medium)</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Cascade Count</span>
                                <input type="range" min="1" max="8" defaultValue="4" className="w-24 accent-[#8b949e]" />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Contact Shadows</span>
                                <input type="checkbox" className="accent-[#8b949e]" defaultChecked />
                            </label>
                            <div className="h-[1px] bg-[#30363d] w-full my-2"></div>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer pt-2">
                                <span className="text-[#c9d1d9]">Ambient Occlusion</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none">
                                   <option>GTAO (Ground Truth)</option>
                                   <option>SSAO</option>
                                   <option>Raytraced AO</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">AO Radius</span>
                                <input type="range" min="0" max="100" defaultValue="45" className="w-24 accent-[#8b949e]" />
                            </label>
                        </div>
                    </div>

                    {/* Volumetrics & Fluids */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Wind size={14} className="text-[#3fb950]"/> Volumetrics & Atmosphere</h3>
                        <div className="space-y-4 text-[11px]">
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Volumetric Fog Grid</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none">
                                   <option>High (256x256x128)</option>
                                   <option>Medium (128x128x64)</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Raymarch Steps</span>
                                <input type="number" defaultValue="64" className="w-16 bg-[#0d1117] border border-[#30363d] rounded px-1 py-0.5 text-center text-white" />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Light Scattering (Mie)</span>
                                <input type="checkbox" className="accent-[#3fb950]" defaultChecked />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Local Volumetric Shadows</span>
                                <input type="checkbox" className="accent-[#3fb950]" defaultChecked />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Fluid Simulation Bake</span>
                                <button className="bg-[#3fb950]/10 text-[#3fb950] border border-[#3fb950]/30 px-2 py-0.5 rounded text-[10px]">Open Bake Tool</button>
                            </label>
                        </div>
                    </div>

                    {/* Post-Processing */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4 col-span-1 md:col-span-2">
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><MonitorPlay size={14} className="text-[#bc8cff]"/> Optical Post-Processing</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[11px]">
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Bloom Threshold</span>
                                <input type="range" min="0" max="100" defaultValue="15" className="w-32 accent-[#bc8cff]" />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Chromatic Aberration</span>
                                <input type="range" min="0" max="100" defaultValue="5" className="w-32 accent-[#bc8cff]" />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Motion Blur (Target FPS = 60)</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none">
                                   <option>Per-Object (High)</option>
                                   <option>Camera Only</option>
                                   <option>Disabled</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Vignette Intensity</span>
                                <input type="range" min="0" max="100" defaultValue="30" className="w-32 accent-[#bc8cff]" />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Tone Mapper</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none">
                                   <option>ACES Filmic</option>
                                   <option>AgX</option>
                                   <option>Reinhard</option>
                                   <option>Linear (Log)</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Lens Flare (Anamorphic)</span>
                                <input type="checkbox" className="accent-[#bc8cff]" defaultChecked />
                            </label>
                        </div>
                    </div>

                 </div>
             </div>
          )}

          {activeTab === 'physics' && (
             <div className="max-w-5xl">
                 <h1 className="text-xl font-bold mb-6 flex items-center gap-2"><Orbit className="text-[#e3b341]"/> Physics Settings & Chaos Engine</h1>
                 
                 <div className="bg-[#161b22] p-4 rounded border border-[#30363d] mb-6 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#e3b341]/10 blur-3xl rounded-full pointer-events-none"></div>
                    <div>
                       <h3 className="text-[#c9d1d9] font-bold text-sm">Physics Tick & Sub-stepping</h3>
                       <p className="text-[11px] text-[#8b949e]">Configure collision accuracy and deterministic execution.</p>
                    </div>
                    <div className="flex gap-4">
                       <label className="flex flex-col gap-1 items-end">
                           <span className="text-[10px] text-[#8b949e]">Max Substeps</span>
                           <input type="number" defaultValue={8} className="w-16 bg-[#0d1117] border border-[#e3b341]/50 text-[#e3b341] font-bold text-sm rounded px-2 py-1 outline-none text-center" />
                       </label>
                       <label className="flex flex-col gap-1 items-end">
                           <span className="text-[10px] text-[#8b949e]">Max Delta Time (ms)</span>
                           <input type="number" defaultValue={16.66} className="w-20 bg-[#0d1117] border border-[#e3b341]/50 text-[#e3b341] font-bold text-sm rounded px-2 py-1 outline-none text-center" />
                       </label>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0">
                    <div className="bg-[#161b22] p-4 rounded border border-[#30363d] flex flex-col h-full">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Globe size={14} className="text-[#58a6ff]"/> World Constraints</h3>
                        <div className="flex gap-4 mb-4 bg-[#0d1117] border border-[#30363d] p-3 rounded">
                           <div className="flex flex-col gap-1 w-1/3">
                              <span className="text-[10px] text-[#8b949e]">Gravity X</span>
                              <input type="number" defaultValue={0.0} className="bg-[#161b22] border border-[#30363d] p-1.5 text-[11px] rounded text-white w-full"/>
                           </div>
                           <div className="flex flex-col gap-1 w-1/3">
                              <span className="text-[10px] text-[#8b949e]">Gravity Y</span>
                              <input type="number" defaultValue={0.0} className="bg-[#161b22] border border-[#30363d] p-1.5 text-[11px] rounded text-white w-full"/>
                           </div>
                           <div className="flex flex-col gap-1 w-1/3">
                              <span className="text-[10px] text-[#8b949e]">Gravity Z</span>
                              <input type="number" defaultValue={-980.0} className="bg-[#161b22] border border-[#30363d] p-1.5 text-[11px] rounded text-[#e3b341] font-mono w-full"/>
                           </div>
                        </div>
                        <div className="space-y-3 text-[11px] flex-1">
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Enable 2D Physics (XY Plane)</span>
                                <input type="checkbox" className="accent-[#e3b341]" />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Broadphase Algorithm</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none">
                                   <option>Dynamic Bounding Volume Tree</option>
                                   <option>Grid (Spatial Hash)</option>
                                   <option>Sweep and Prune (SAP)</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Sleep Threshold</span>
                                <input type="range" min="0" max="100" defaultValue="10" className="w-24 accent-[#e3b341]" />
                            </label>
                        </div>
                    </div>
                    
                    <div className="bg-[#161b22] p-4 rounded border border-[#30363d] flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold flex items-center gap-2"><Layers size={14} className="text-[#bc8cff]"/> Physical Materials</h3>
                            <button onClick={handleAddMaterial} className="text-[10px] bg-[#21262d] px-2 py-1 flex items-center gap-1 rounded hover:bg-[#3fb950] hover:text-white transition-colors text-[#c9d1d9]"><Plus size={12}/> Add Material</button>
                        </div>
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                           {physicsMaterials.map(mat => (
                              <div key={mat.id} className="bg-[#0d1117] border border-[#30363d] p-3 rounded flex flex-col gap-2 group">
                                 <div className="flex justify-between items-center">
                                    <input type="text" value={mat.name} onChange={(e) => updateMaterial(mat.id, 'name', e.target.value)} className="font-bold text-[12px] text-white bg-transparent outline-none hover:bg-[#161b22] focus:bg-[#161b22] px-1 py-0.5 rounded w-32" />
                                    <button onClick={() => deleteMaterial(mat.id)} className="opacity-0 group-hover:opacity-100 text-[#8b949e] hover:text-[#f85149] transition-all"><Trash2 size={14}/></button>
                                 </div>
                                 <div className="flex gap-4 items-center">
                                    <div className="flex flex-col gap-1 w-1/2">
                                        <span className="text-[10px] text-[#8b949e]">Bounce (Restitution)</span>
                                        <input type="number" value={mat.bounce} onChange={(e) => updateMaterial(mat.id, 'bounce', parseFloat(e.target.value))} step={0.1} min={0} max={1} className="bg-[#161b22] border border-[#30363d] p-1.5 text-[11px] rounded text-white w-full" />
                                    </div>
                                    <div className="flex flex-col gap-1 w-1/2">
                                        <span className="text-[10px] text-[#8b949e]">Static Friction</span>
                                        <input type="number" value={mat.friction} onChange={(e) => updateMaterial(mat.id, 'friction', parseFloat(e.target.value))} step={0.1} min={0} className="bg-[#161b22] border border-[#30363d] p-1.5 text-[11px] rounded text-white w-full" />
                                    </div>
                                 </div>
                              </div>
                           ))}
                           {physicsMaterials.length === 0 && (
                             <div className="text-[11px] text-[#8b949e] italic text-center p-4">No physical materials defined.</div>
                           )}
                        </div>
                    </div>
                 </div>
             </div>
          )}
          
          {activeTab === 'network' && (
             <div className="max-w-5xl">
                 <h1 className="text-xl font-bold mb-6 flex items-center gap-2"><Globe className="text-[#3fb950]"/> Network & Multiplayer Architecture</h1>
                 
                 <div className="bg-[#161b22] p-4 rounded border border-[#3fb950]/30 shadow-[0_0_15px_rgba(63,185,80,0.1)] mb-6 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#3fb950]/10 blur-3xl rounded-full pointer-events-none"></div>
                    <div>
                       <h3 className="text-[#c9d1d9] font-bold text-sm">Server-Authoritative Topology</h3>
                       <p className="text-[11px] text-[#8b949e]">Configure dedicated server logic, tick rates, and P2P fallback systems.</p>
                    </div>
                    <div className="flex gap-4 items-center relative z-10">
                       <span className="text-[10px] bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50 px-2 py-1 rounded shadow-sm">TCP/UDP HYBRID</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Activity size={14} className="text-[#3fb950]"/> Netcode Metrics</h3>
                        <div className="space-y-4 text-[11px]">
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Server Tick Rate</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-[#3fb950] font-mono p-1 rounded outline-none">
                                   <option>120 Hz (Esports)</option>
                                   <option>60 Hz (Standard)</option>
                                   <option>30 Hz (MMO/Large Scale)</option>
                                   <option>Variable (AI Managed)</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Client Network Update Rate</span>
                                <input type="number" defaultValue="60" className="w-16 bg-[#0d1117] border border-[#30363d] rounded px-1 py-0.5 text-center text-white" />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Max Player Count Target</span>
                                <input type="range" min="2" max="1024" defaultValue="128" className="w-24 accent-[#3fb950]" />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">TCP Fallback on UDP Fail</span>
                                <input type="checkbox" className="accent-[#3fb950]" defaultChecked />
                            </label>
                        </div>
                    </div>

                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><ShieldCheck size={14} className="text-[#58a6ff]"/> Security & Protection</h3>
                        <div className="space-y-4 text-[11px]">
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Client Prediction & Rollback</span>
                                <input type="checkbox" className="accent-[#58a6ff]" defaultChecked />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">DDoS Mitigation Layer</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none">
                                   <option>Cloudflare Spectrum</option>
                                   <option>AWS Shield Advanced</option>
                                   <option>Custom BP-Filters</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Max Packet Size</span>
                                <span className="text-[#8b949e] font-mono">1400 MTU</span>
                            </label>
                            <div className="h-[1px] bg-[#30363d] w-full my-2"></div>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#ff7b72]">Strict Anti-Cheat Enclave</span>
                                <input type="checkbox" className="accent-[#ff7b72]" />
                            </label>
                        </div>
                    </div>
                 </div>
             </div>
          )}

          {activeTab === 'localization' && (
             <div className="max-w-5xl">
                 <h1 className="text-xl font-bold mb-6 flex items-center gap-2"><Languages className="text-[#ff7b72]"/> Global Localization Engine</h1>
                 
                 <div className="bg-[#161b22] p-4 rounded border border-[#30363d] mb-6 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff7b72]/10 blur-3xl rounded-full pointer-events-none"></div>
                    <div>
                       <h3 className="text-[#c9d1d9] font-bold text-sm">Automated Real-Time Translation Setup</h3>
                       <p className="text-[11px] text-[#8b949e]">Configure how the engine handles multiregional text, voiceovers, and right-to-left layout swapping.</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4">
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Globe size={14} className="text-[#ff7b72]"/> Regional Formats & Content</h3>
                        <div className="space-y-4 text-[11px]">
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Primary Language Key</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none">
                                   <option>en-US (Default English)</option>
                                   <option>ja-JP (Japanese)</option>
                                   <option>es-ES (Spanish)</option>
                                   <option>th-TH (Thai)</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Auto-Scale UI for Logographic Strings</span>
                                <input type="checkbox" className="accent-[#ff7b72]" defaultChecked />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Right-to-Left (RTL) Layout Native Support</span>
                                <input type="checkbox" className="accent-[#ff7b72]" defaultChecked />
                            </label>
                            <div className="h-[1px] bg-[#30363d] w-full my-2"></div>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">AI Semantic Fallback (Missing Keys)</span>
                                <input type="checkbox" className="accent-[#ff7b72]" defaultChecked />
                            </label>
                        </div>
                    </div>
                 </div>
             </div>
          )}

          {activeTab === 'savegame' && (
             <div className="max-w-5xl">
                 <h1 className="text-xl font-bold mb-6 flex items-center gap-2"><Save className="text-[#8b949e]"/> Save Systems & Encryption</h1>
                 
                 <div className="bg-[#161b22] border border-[#30363d] rounded p-4 mb-6">
                     <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4">Serialization & Deserialization</h3>
                     <div className="grid grid-cols-2 gap-6 text-[11px]">
                         <div>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer mb-2">
                                <span className="text-[#c9d1d9]">Save Data Format</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none">
                                   <option>Binary Object (Optimal)</option>
                                   <option>JSON (Debug Friendly)</option>
                                   <option>BSON</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer mb-2">
                                <span className="text-[#c9d1d9]">AES-256 State Encryption</span>
                                <input type="checkbox" className="accent-[#8b949e]" defaultChecked />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Zlib Compression Level</span>
                                <input type="range" min="0" max="9" defaultValue="6" className="w-24 accent-[#8b949e]" />
                            </label>
                         </div>
                         <div>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer mb-2">
                                <span className="text-[#c9d1d9]">Asynchronous Save Threading</span>
                                <input type="checkbox" className="accent-[#8b949e]" defaultChecked />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer mb-2">
                                <span className="text-[#c9d1d9]">Cloud Sync Provider (Steam API / Epic)</span>
                                <input type="checkbox" className="accent-[#8b949e]" defaultChecked />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Max Checkpoint Snapshots</span>
                                <input type="number" defaultValue="20" className="w-16 bg-[#0d1117] border border-[#30363d] rounded px-1 py-0.5 text-center text-white" />
                            </label>
                         </div>
                     </div>
                 </div>
             </div>
          )}

          {activeTab === 'ai' && (
             <div className="max-w-6xl pb-16">
                 <h1 className="text-xl font-bold mb-6 flex items-center gap-2"><BrainCircuit className="text-[#bc8cff]"/> Project-Level Offline AI Simulation Matrix</h1>
                 <p className="text-[12px] text-[#8b949e] mb-6">Massive scale AI logic settings for the current project. Define how local and offline AI agents operate in the world, make decisions, generate paths, build relationships, and synthesize assets dynamically.</p>
                 
                 <div className="bg-[#161b22] p-4 rounded border border-[#bc8cff]/30 shadow-[0_0_20px_rgba(188,140,255,0.05)] mb-6 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#bc8cff]/10 blur-3xl rounded-full pointer-events-none"></div>
                    <div>
                       <h3 className="text-[#c9d1d9] font-bold text-[14px]">Multi-Agent Spatial Awareness</h3>
                       <p className="text-[11px] text-[#8b949e] max-w-2xl mt-1">Controls the tick rates and memory limits of AI entities running locally, managing how deeply they simulate interactions globally when the player is not near.</p>
                    </div>
                    <div className="flex gap-4 items-center relative z-10">
                       <span className="text-[10px] bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/50 px-2 py-1 rounded shadow-sm font-bold tracking-widest">NPU ACCELERATED</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4 hover:border-[#bc8cff]/40 transition-colors">
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Zap size={14} className="text-[#e3b341]"/> Background Simulation Ticks</h3>
                        <div className="space-y-4 text-[11px]">
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Global Entity Simulation Horizon (Distance)</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none font-mono text-[10px]">
                                   <option>10,000 meters (Uncapped)</option>
                                   <option>5,000 meters</option>
                                   <option>1,000 meters (Optimized)</option>
                                   <option>Viewport Camera Only</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Background AI Tick Rate (Out of bounds)</span>
                                <input type="number" defaultValue="2" className="w-16 bg-[#0d1117] border border-[#30363d] rounded px-1 py-0.5 text-center text-white" />
                                <span className="text-[#8b949e] ml-2 text-[9px]">Ticks/Sec</span>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">AI Thread Allocation (Hardware Threads)</span>
                                <input type="range" min="1" max="64" defaultValue="12" className="w-32 accent-[#e3b341]" />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">GPU/NPU Vectorized Pathfinding</span>
                                <input type="checkbox" className="accent-[#e3b341]" defaultChecked />
                            </label>
                        </div>
                    </div>

                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4 hover:border-[#58a6ff]/40 transition-colors">
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Network size={14} className="text-[#58a6ff]"/> Deep Reinforcement Framework</h3>
                        <div className="space-y-4 text-[11px]">
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Neural Navigation Mesh Resolution</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] font-bold p-1 rounded outline-none text-[10px]">
                                   <option>Sub-millimeter (Extreme)</option>
                                   <option>10cm Voxel Target</option>
                                   <option>50cm Standard Grid</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Enable Markov-Chain Decision Making</span>
                                <input type="checkbox" className="accent-[#58a6ff]" defaultChecked />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Enable Evolving Neural Weights</span>
                                <input type="checkbox" className="accent-[#58a6ff]" defaultChecked />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <div className="flex flex-col">
                                  <span className="text-[#c9d1d9]">Evolution Checkpoint Interval</span>
                                  <span className="text-[9px] text-[#8b949e]">Bakes AI learning to disk every X seconds.</span>
                                </div>
                                <input type="number" defaultValue="1800" className="w-20 bg-[#0d1117] border border-[#30363d] rounded px-1 text-center text-white font-mono" />
                            </label>
                        </div>
                    </div>
                    
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4 hover:border-[#3fb950]/40 transition-colors">
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Globe size={14} className="text-[#3fb950]"/> LLM & NPC Dialogue Capabilities</h3>
                        <div className="space-y-4 text-[11px]">
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">LLM Engine Backend</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none text-[10px]">
                                   <option>Local WebLLM (No Internet Required)</option>
                                   <option>Ollama Local Node (API)</option>
                                   <option>Cloud RPC Fallback</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-2 hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <div className="flex justify-between items-center text-[#c9d1d9]">
                                   <span>NPC Context Memory Limit (Tokens)</span>
                                   <span className="text-[10px] bg-[#0d1117] border border-[#30363d] px-1.5 py-0.5 rounded text-[#3fb950] font-mono">16,384</span>
                                </div>
                                <input type="range" min="2048" max="128000" defaultValue="16384" step="1024" className="w-full accent-[#3fb950]" />
                            </label>
                            <label className="flex flex-col gap-2 hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <div className="flex justify-between items-center text-[#c9d1d9]">
                                   <span>LLM Temperature (Creativity)</span>
                                   <span className="text-[10px] bg-[#0d1117] border border-[#30363d] px-1.5 py-0.5 rounded text-[#3fb950] font-mono">0.65</span>
                                </div>
                                <input type="range" min="0" max="200" defaultValue="65" className="w-full accent-[#3fb950]" />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Voice Cloning (Local TTS Streaming)</span>
                                <input type="checkbox" className="accent-[#3fb950]" defaultChecked />
                            </label>
                        </div>
                    </div>
                    
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-4 hover:border-[#ff7b72]/40 transition-colors">
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><Server size={14} className="text-[#ff7b72]"/> Generative Environment & World Building</h3>
                        <div className="space-y-4 text-[11px]">
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <div className="flex flex-col">
                                   <span className="text-[#c9d1d9]">Procedural Runtime Asset Streaming</span>
                                   <span className="text-[9px] text-[#8b949e]">Auto-generate missing sub-meshes offline on demand.</span>
                                </div>
                                <input type="checkbox" className="accent-[#ff7b72]" defaultChecked />
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Real-Time Stable Diffusion Decal Baker</span>
                                <select className="bg-[#0d1117] border border-[#30363d] text-white p-1 rounded outline-none text-[10px]">
                                   <option>Disabled</option>
                                   <option>SDXL Turbo (Fast)</option>
                                   <option>FLUX Dev (High VRAM)</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                                <span className="text-[#c9d1d9]">Dynamic Swarm LOD Management</span>
                                <input type="checkbox" className="accent-[#ff7b72]" defaultChecked />
                            </label>
                            <div className="h-[1px] bg-[#30363d] w-full my-2"></div>
                            <button className="w-full py-2 bg-[#ff7b72]/10 hover:bg-[#ff7b72]/20 border border-[#ff7b72]/30 text-[#ff7b72] rounded font-bold transition-colors">
                                Purge Generative Cache (12.4 GB)
                            </button>
                        </div>
                    </div>
                 </div>
                 
                 <div className="bg-[#161b22] border border-[#30363d] rounded p-4 w-full">
                    <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2"><ActivityIcon size={14} className="text-[#a371f7]"/> Active Project AI Workload Monitors</h3>
                    <div className="flex gap-4">
                       <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded p-3 text-center">
                          <div className="text-[10px] text-[#8b949e] font-bold uppercase mb-1">NPC Cognitive Thread</div>
                          <div className="text-[24px] font-mono font-bold text-[#a371f7]">45%</div>
                          <div className="text-[9px] text-[#c9d1d9]">8.2 ms execution</div>
                       </div>
                       <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded p-3 text-center">
                          <div className="text-[10px] text-[#8b949e] font-bold uppercase mb-1">NavMesh Baker Thread</div>
                          <div className="text-[24px] font-mono font-bold text-[#e3b341]">12%</div>
                          <div className="text-[9px] text-[#c9d1d9]">0.8 ms execution</div>
                       </div>
                       <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded p-3 text-center">
                          <div className="text-[10px] text-[#8b949e] font-bold uppercase mb-1">LLM Queue Backlog</div>
                          <div className="text-[24px] font-mono font-bold text-[#ff7b72]">0 Tasks</div>
                          <div className="text-[9px] text-[#3fb950]">System Idle - Ready</div>
                       </div>
                    </div>
                 </div>
             </div>
          )}

      </div>
    </div>
  );
}
