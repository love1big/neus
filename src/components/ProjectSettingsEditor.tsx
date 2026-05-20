import React, { useState, useEffect } from 'react';
import { Settings, Gamepad2, Globe, MonitorPlay, Save, Languages, Orbit, Activity, ChevronRight, HardDrive, Plus, Trash2 } from 'lucide-react';

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
             <div className="max-w-4xl">
                 <h1 className="text-xl font-bold mb-6 flex items-center gap-2"><MonitorPlay className="text-[#bc8cff]"/> Rendering Pipeline</h1>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-bold border-b border-[#30363d] pb-2 mb-4">Global Illumination</h3>
                        <div className="space-y-4 text-[11px]">
                            <label className="flex items-center justify-between p-2 hover:bg-[#161b22] rounded cursor-pointer">
                                <span>Method</span>
                                <select className="bg-[#21262d] border border-[#30363d] text-white p-1 rounded outline-none">
                                   <option>None</option>
                                   <option>Screen Space (SSGI)</option>
                                   <option>Lumen / Raytraced</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between p-2 hover:bg-[#161b22] rounded cursor-pointer">
                                <span>Hardware Raytracing Required</span>
                                <input type="checkbox" className="accent-[#58a6ff]" defaultChecked />
                            </label>
                        </div>
                    </div>
                 </div>
             </div>
          )}

          {activeTab === 'physics' && (
             <div className="max-w-4xl">
                 <h1 className="text-xl font-bold mb-6 flex items-center gap-2"><Orbit className="text-[#e3b341]"/> Physics Settings</h1>
                 <div className="space-y-6">
                    <div className="bg-[#161b22] p-4 rounded border border-[#30363d]">
                        <h3 className="text-sm font-bold mb-4">World Gravity</h3>
                        <div className="flex gap-4">
                           <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-[#8b949e]">Z</span>
                              <input type="number" defaultValue={-980.0} className="bg-[#0d1117] border border-[#30363d] p-1.5 text-[11px] rounded text-white"/>
                           </div>
                        </div>
                    </div>
                    
                    <div className="bg-[#161b22] p-4 rounded border border-[#30363d]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold">Physical Materials</h3>
                            <button onClick={handleAddMaterial} className="text-[10px] bg-[#21262d] px-2 py-1 flex items-center gap-1 rounded hover:bg-[#3fb950] hover:text-white transition-colors text-[#c9d1d9]"><Plus size={12}/> Add Material</button>
                        </div>
                        <div className="space-y-3">
                           {physicsMaterials.map(mat => (
                              <div key={mat.id} className="bg-[#0d1117] border border-[#30363d] p-3 rounded flex items-center justify-between group">
                                 <input type="text" value={mat.name} onChange={(e) => updateMaterial(mat.id, 'name', e.target.value)} className="font-bold text-[12px] text-white bg-transparent outline-none hover:bg-[#161b22] focus:bg-[#161b22] px-1 py-0.5 rounded w-32" />
                                 <div className="flex gap-4 items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-[#8b949e]">Bounce (Restitution)</span>
                                        <input type="number" value={mat.bounce} onChange={(e) => updateMaterial(mat.id, 'bounce', parseFloat(e.target.value))} step={0.1} min={0} max={1} className="bg-[#161b22] border border-[#30363d] p-1 text-[11px] rounded text-white w-16" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-[#8b949e]">Friction</span>
                                        <input type="number" value={mat.friction} onChange={(e) => updateMaterial(mat.id, 'friction', parseFloat(e.target.value))} step={0.1} min={0} className="bg-[#161b22] border border-[#30363d] p-1 text-[11px] rounded text-white w-16" />
                                    </div>
                                    <button onClick={() => deleteMaterial(mat.id)} className="opacity-0 group-hover:opacity-100 text-[#8b949e] hover:text-[#f85149] transition-all"><Trash2 size={14}/></button>
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
          
          {(activeTab === 'network' || activeTab === 'localization' || activeTab === 'savegame') && (
            <div className="flex items-center justify-center h-full text-[#8b949e] flex-col gap-4">
               <HardDrive size={48} className="text-[#30363d]"/>
               <p className="text-[12px] uppercase tracking-wide">Advance engine configs</p>
            </div>
          )}
      </div>
    </div>
  );
}
