import React, { useState } from 'react';
import { Save, HardDrive, FileJson, Database, RefreshCcw, Lock, Box, Cpu, Download, Upload, Trash2, Eye, Server, Activity, ShieldCheck, FileKey, Network } from 'lucide-react';

export default function StateSerializationManager() {
  const [activeTab, setActiveTab] = useState('inspector');
  const [selectedEntity, setSelectedEntity] = useState('Player_1');
  const [isCompressing, setIsCompressing] = useState(true);
  const [isEncrypted, setIsEncrypted] = useState(false);

  const entities = [
    { id: 'Player_1', type: 'Character', components: ['Transform', 'Health', 'Inventory'] },
    { id: 'NPC_Merchant', type: 'NPC', components: ['Transform', 'Dialogue', 'Shop'] },
    { id: 'Weapon_Sword', type: 'Item', components: ['Transform', 'Physics', 'Damage'] },
    { id: 'Environment_Tree', type: 'StaticMesh', components: ['Transform', 'Collision'] },
    { id: 'Game_Manager', type: 'System', components: ['GameState', 'TimeManager'] },
  ];

  const saveSlots = [
    { id: 1, name: 'AutoSave_01', date: '2026-08-12 10:15', size: '2.4 MB', type: 'Auto' },
    { id: 2, name: 'Quicksave', date: '2026-08-12 09:40', size: '2.1 MB', type: 'Quick' },
    { id: 3, name: 'Before_Boss', date: '2026-08-11 22:10', size: '3.0 MB', type: 'Manual' },
  ];

  const renderEntityJSON = () => {
    let baseJSON = {
      entityId: selectedEntity,
      timestamp: Date.now(),
      components: {
        Transform: { position: { x: 120.5, y: 15.0, z: -45.2 }, rotation: { yaw: 90, pitch: 0, roll: 0 } }
      }
    };

    if (selectedEntity === 'Player_1') {
      baseJSON.components['Health'] = { current: 85, max: 100, status: 'Normal' };
      baseJSON.components['Inventory'] = { items: ['Health_Potion', 'Iron_Sword'], gold: 1250 };
    } else if (selectedEntity === 'NPC_Merchant') {
      baseJSON.components['Shop'] = { vendorId: 'merchant_01', restockTime: 3600, active: true };
    }

    const rawString = JSON.stringify(baseJSON, null, 2);
    
    if (isEncrypted) {
      return `// AES-256-GCM ENCRYPTED PAYLOAD
U2FsdGVkX19+Z5... (Binary Blob)
[Decoding requires Master Key]`;
    }
    
    if (isCompressing) {
      return `// GZIP COMPRESSED STATE (Previewing decompressed)
${rawString}`;
    }

    return rawString;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#3fb950]/20 border border-[#3fb950]/50 rounded">
            <Save className="text-[#3fb950]" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">ECS State Serializer & Save Manager</h1>
            <p className="text-[10px] text-[#8b949e]">JSON Object Graph Serialization & Data Persistence</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs flex items-center gap-2 hover:bg-[#30363d]">
            <Upload size={14} /> Load State
          </button>
          <button className="px-3 py-1.5 bg-[#238636] border border-[#2ea043] rounded text-xs flex items-center gap-2 hover:bg-[#2c974b]">
            <Download size={14} /> Commit Save
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-64 flex flex-col bg-[#161b22] border-r border-[#30363d]">
          <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] flex items-center gap-2">
            <Database size={14} /> SERIALIZATION MODULES
          </div>
          <div className="flex-1 overflow-y-auto">
            <button 
              onClick={() => setActiveTab('inspector')}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 border-l-2 ${activeTab === 'inspector' ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-[#58a6ff]' : 'border-transparent text-[#c9d1d9] hover:bg-[#21262d]'}`}
            >
              <FileJson size={16} /> <span className="text-sm">Entity State Inspector</span>
            </button>
            <button 
              onClick={() => setActiveTab('slots')}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 border-l-2 ${activeTab === 'slots' ? 'border-[#3fb950] bg-[#3fb950]/10 text-[#3fb950]' : 'border-transparent text-[#c9d1d9] hover:bg-[#21262d]'}`}
            >
              <HardDrive size={16} /> <span className="text-sm">Save Slots & Memory</span>
            </button>
            <button 
              onClick={() => setActiveTab('config')}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 border-l-2 ${activeTab === 'config' ? 'border-[#d29922] bg-[#d29922]/10 text-[#d29922]' : 'border-transparent text-[#c9d1d9] hover:bg-[#21262d]'}`}
            >
              <Lock size={16} /> <span className="text-sm">Compression & Crypto</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-[#0a0a0f] relative">
          
          {activeTab === 'inspector' && (
            <div className="flex flex-1 overflow-hidden">
              {/* Entity List */}
              <div className="w-1/3 border-r border-[#30363d] flex flex-col bg-[#161b22]">
                <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e]">
                  ACTIVE ECS HIERARCHY
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {entities.map(ent => (
                    <div 
                      key={ent.id}
                      onClick={() => setSelectedEntity(ent.id)}
                      className={`p-2 rounded cursor-pointer mb-1 border ${selectedEntity === ent.id ? 'bg-[#58a6ff]/20 border-[#58a6ff]/50' : 'bg-[#0d1117] border-[#30363d] hover:border-[#8b949e]'}`}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium text-[#c9d1d9]">
                        <Box size={14} className="text-[#58a6ff]" /> {ent.id}
                      </div>
                      <div className="text-[10px] text-[#8b949e] mt-1 flex gap-1 flex-wrap">
                        {ent.components.map(c => (
                          <span key={c} className="px-1.5 py-0.5 bg-[#21262d] rounded">{c}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* JSON Preview */}
              <div className="flex-1 flex flex-col">
                <div className="p-3 border-b border-[#30363d] text-xs font-bold text-[#8b949e] flex justify-between items-center bg-[#161b22]">
                  <span>SERIALIZED STATE: {selectedEntity}</span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${isCompressing ? 'bg-[#3fb950]/20 text-[#3fb950]' : 'bg-[#30363d] text-[#8b949e]'}`}>GZIP</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${isEncrypted ? 'bg-[#d29922]/20 text-[#d29922]' : 'bg-[#30363d] text-[#8b949e]'}`}>AES-256</span>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto bg-[#010409]">
                  <pre className="text-xs font-mono text-[#58a6ff]">
                    {renderEntityJSON()}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'slots' && (
            <div className="p-6 max-w-4xl mx-auto w-full">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><HardDrive className="text-[#3fb950]" /> Save Slot Manager</h2>
              
              <div className="space-y-3">
                {saveSlots.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between p-4 bg-[#161b22] border border-[#30363d] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${slot.type === 'Auto' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : slot.type === 'Quick' ? 'bg-[#d29922]/20 text-[#d29922]' : 'bg-[#3fb950]/20 text-[#3fb950]'}`}>
                        <Save size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{slot.name}</div>
                        <div className="text-xs text-[#8b949e]">{slot.date} • {slot.size} • {slot.type} Save</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs hover:bg-[#58a6ff]/20 hover:text-[#58a6ff]">Load</button>
                      <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded text-xs text-[#f85149] hover:bg-[#f85149]/20">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 w-full py-3 border-2 border-dashed border-[#30363d] text-[#8b949e] rounded-lg hover:border-[#58a6ff] hover:text-[#58a6ff] transition-colors flex items-center justify-center gap-2 text-sm">
                <RefreshCcw size={16} /> Create Manual Save
              </button>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="p-6 max-w-2xl mx-auto w-full">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><ShieldCheck className="text-[#d29922]" /> Data Security & Footprint</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-sm flex items-center gap-2"><Box size={16} className="text-[#58a6ff]" /> GZIP Compression</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={isCompressing} onChange={() => setIsCompressing(!isCompressing)} />
                      <div className="w-9 h-5 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3fb950]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-[#8b949e] mb-4">Reduces save file size by approx 60-80% at the cost of slight CPU overhead during save/load operations.</p>
                  
                  <div className="bg-[#0d1117] p-3 rounded border border-[#30363d]">
                    <div className="flex justify-between text-xs text-[#8b949e] mb-1">
                      <span>Raw Size Estimator</span>
                      <span>Compressed Size</span>
                    </div>
                    <div className="w-full bg-[#30363d] h-2 rounded-full overflow-hidden flex">
                      <div className="bg-[#f85149] w-[100%] h-full" style={{ width: isCompressing ? '30%' : '100%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-sm flex items-center gap-2"><FileKey size={16} className="text-[#d29922]" /> AES-256 Encryption</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={isEncrypted} onChange={() => setIsEncrypted(!isEncrypted)} />
                      <div className="w-9 h-5 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d29922]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-[#8b949e]">Prevents players from manually editing save files (Save Scumming/Cheating). Generates unique device-bound salt.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
