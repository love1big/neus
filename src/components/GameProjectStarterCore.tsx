import React, { useState } from 'react';
import { 
  Database, 
  Save, 
  Upload, 
  Gamepad2, 
  Volume2, 
  Package, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Download, 
  Sliders, 
  Key, 
  Play, 
  FolderPlus,
  RefreshCw,
  FileJson,
  Lock,
  Layers
} from 'lucide-react';

interface GameSubsystem {
  id: string;
  name: string;
  category: 'SaveSystem' | 'InputManager' | 'AudioSubsystem' | 'InventoryDB' | 'QuestStateMachine' | 'LiveConsole';
  enabled: boolean;
  version: string;
  description: string;
  config: Record<string, any>;
}

export default function GameProjectStarterCore() {
  const [activeTab, setActiveTab] = useState<'overview' | 'save' | 'input' | 'inventory' | 'export'>('overview');
  const [encryptionKey, setEncryptionKey] = useState<string>('OMNI_AES256_GAME_SALT_9942');
  const [autoSaveIntervalSec, setAutoSaveIntervalSec] = useState<number>(120);

  const [subsystems, setSubsystems] = useState<GameSubsystem[]>([
    {
      id: 'sub_save',
      name: 'Encrypted Binary Save & Checkpoint Core',
      category: 'SaveSystem',
      enabled: true,
      version: '2.4.0',
      description: 'LZ4 compressed & AES-256 encrypted game state serialization with cloud sync hooks.',
      config: { slotCount: 10, autoSave: true, intervalSec: 120, checksumValidation: true }
    },
    {
      id: 'sub_input',
      name: 'Unified Multi-Device Input Remapper',
      category: 'InputManager',
      enabled: true,
      version: '3.1.2',
      description: 'Abstract action bindings supporting Keyboard/Mouse, XInput, DualSense, and Touch gestures.',
      config: { deadzone: 0.15, vibrationEnabled: true, gyroSensitivity: 1.0 }
    },
    {
      id: 'sub_audio',
      name: 'Spatial Audio DSP & Stems Bus Matrix',
      category: 'AudioSubsystem',
      enabled: true,
      version: '1.9.0',
      description: 'Dynamic stem crossfader, 3D binaural convolution reverb, and master limiter.',
      config: { masterVolume: 1.0, sfxVolume: 0.85, musicVolume: 0.7, voiceVolume: 1.0 }
    },
    {
      id: 'sub_inventory',
      name: 'Item Database, Crafting & Grid Inventory',
      category: 'InventoryDB',
      enabled: true,
      version: '2.0.1',
      description: 'Deterministic item registry with weight limit, socketing, durability, and recipe graph.',
      config: { maxSlots: 32, maxWeightKg: 100, allowStacking: true }
    },
    {
      id: 'sub_quest',
      name: 'Quest Mission & Dialogue State Graph',
      category: 'QuestStateMachine',
      enabled: true,
      version: '1.5.0',
      description: 'Node-based quest progression, branch resolution, and objective tracker hooks.',
      config: { autoTrackActive: true, failStatePermitted: true }
    },
    {
      id: 'sub_console',
      name: 'In-Game Developer Command Console & Profiler',
      category: 'LiveConsole',
      enabled: true,
      version: '4.0.0',
      description: 'Over-the-air hot reload commands, cheat toggles, and runtime stat dumps.',
      config: { activationKey: '`', historyLimit: 100 }
    }
  ]);

  // Mock Save Slots
  const [saveSlots, setSaveSlots] = useState([
    { id: 'slot_1', title: 'AutoSave - Castle Dungeon Level 4', timestamp: '2026-08-17 12:40', playTime: '14h 22m', level: 42, sizeKb: 34.2, status: 'Encrypted (AES-256)' },
    { id: 'slot_2', title: 'Manual - Before Boss Fight (Dragon)', timestamp: '2026-08-17 11:15', playTime: '13h 50m', level: 40, sizeKb: 32.8, status: 'Encrypted (AES-256)' },
    { id: 'slot_3', title: 'Checkpoint - Village Hub', timestamp: '2026-08-16 22:00', playTime: '10h 10m', level: 35, sizeKb: 28.5, status: 'Encrypted (AES-256)' }
  ]);

  // Mock Item Registry
  const [items, setItems] = useState([
    { id: 'item_excalibur', name: 'Excalibur Holy Sword', type: 'Weapon', rarity: 'Legendary', value: 5000, weight: 4.5 },
    { id: 'item_health_pot', name: 'Elixir of Rejuvenation', type: 'Consumable', rarity: 'Rare', value: 150, weight: 0.2 },
    { id: 'item_dragon_scale', name: 'Elder Dragon Scale', type: 'Material', rarity: 'Epic', value: 1200, weight: 1.0 },
  ]);

  const toggleSubsystem = (id: string) => {
    setSubsystems(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const exportProjectTemplate = () => {
    const templateManifest = {
      project: "OmniEngine Game Project Starter Pack",
      generatedAt: new Date().toISOString(),
      activeSubsystems: subsystems.filter(s => s.enabled),
      saveConfiguration: {
        encryption: "AES-256-GCM",
        compression: "LZ4",
        autoSaveIntervalSec
      },
      itemDatabaseCount: items.length,
      sampleSaveSlots: saveSlots
    };

    const blob = new Blob([JSON.stringify(templateManifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniGame_Starter_Core_Config.json`;
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <Database className="text-[#3fb950]" size={20} />
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Game Project Starter Presets & Core Subsystems
              <span className="text-[10px] bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 px-2 py-0.5 rounded font-mono font-bold">
                PRODUCTION READY TEMPLATE
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === 'overview' ? 'bg-[#3fb950] text-white shadow' : 'text-[#8b949e]'}`}
            >
              Core Subsystems
            </button>
            <button
              onClick={() => setActiveTab('save')}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === 'save' ? 'bg-[#58a6ff] text-white shadow' : 'text-[#8b949e]'}`}
            >
              Encrypted Save Manager
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === 'inventory' ? 'bg-[#e3b341] text-black shadow' : 'text-[#8b949e]'}`}
            >
              Item Registry & Inventory
            </button>
          </div>

          <button
            onClick={exportProjectTemplate}
            className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded flex items-center gap-1.5 shadow transition"
          >
            <Download size={13} /> Export Project Bundle
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Standard Game Engine Subsystems</h2>
              <p className="text-xs text-[#8b949e]">
                Pre-configured foundational architecture automatically initialized for every new game project.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subsystems.map(sub => (
                <div 
                  key={sub.id} 
                  className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                    sub.enabled 
                      ? 'bg-[#161b22] border-[#30363d]' 
                      : 'bg-[#0d1117] border-[#21262d] opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-[#21262d] px-2 py-0.5 rounded text-[#58a6ff]">
                        v{sub.version}
                      </span>
                      <button
                        onClick={() => toggleSubsystem(sub.id)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                          sub.enabled ? 'bg-[#238636]' : 'bg-[#30363d]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          sub.enabled ? 'transform translate-x-4' : ''
                        }`} />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-white">{sub.name}</h3>
                    <p className="text-xs text-[#8b949e] leading-relaxed">{sub.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#30363d] flex items-center justify-between text-[11px] font-mono text-[#8b949e]">
                    <span>Category: {sub.category}</span>
                    <span className={sub.enabled ? 'text-[#3fb950] font-bold' : 'text-[#8b949e]'}>
                      {sub.enabled ? 'INITIALIZED' : 'DISABLED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'save' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Encrypted Binary Save State System</h2>
                <p className="text-xs text-[#8b949e]">
                  Manage player checkpoints, state serialization slots, and encryption keys.
                </p>
              </div>

              <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] text-white text-xs font-bold rounded flex items-center gap-1.5 hover:bg-[#30363d]">
                <Plus size={13} /> Add Checkpoint Slot
              </button>
            </div>

            {/* Config Box */}
            <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#8b949e] block mb-1">Master AES-256 Cipher Salt</label>
                <input 
                  type="text" 
                  value={encryptionKey} 
                  onChange={e => setEncryptionKey(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 font-mono text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#8b949e] block mb-1">Auto-Save Timer Interval (Seconds)</label>
                <input 
                  type="number" 
                  value={autoSaveIntervalSec} 
                  onChange={e => setAutoSaveIntervalSec(parseInt(e.target.value))}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 font-mono text-xs text-white"
                />
              </div>
            </div>

            {/* Slot Table */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d1117] text-[#8b949e] uppercase font-bold border-b border-[#30363d]">
                  <tr>
                    <th className="p-3">Slot & Description</th>
                    <th className="p-3">Playtime / Level</th>
                    <th className="p-3">Size & Encryption</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]">
                  {saveSlots.map(slot => (
                    <tr key={slot.id} className="hover:bg-[#1f2937]">
                      <td className="p-3">
                        <div className="font-bold text-white">{slot.title}</div>
                        <div className="text-[10px] text-[#8b949e]">{slot.timestamp}</div>
                      </td>
                      <td className="p-3 font-mono">
                        <div>Level {slot.level}</div>
                        <div className="text-[10px] text-[#8b949e]">{slot.playTime}</div>
                      </td>
                      <td className="p-3 font-mono">
                        <span className="text-[#3fb950] font-bold">{slot.status}</span>
                        <div className="text-[10px] text-[#8b949e]">{slot.sizeKb} KB (LZ4)</div>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button className="px-2 py-1 bg-[#238636] hover:bg-[#2ea043] text-white text-[11px] font-bold rounded">
                          Load
                        </button>
                        <button className="px-2 py-1 bg-[#da3633] hover:bg-[#b62324] text-white text-[11px] font-bold rounded">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Central Item Registry & Loot Table</h2>
                <p className="text-xs text-[#8b949e]">
                  Define equipment, weapons, and stackable consumables with deterministic weight/stat schemas.
                </p>
              </div>

              <button className="px-3 py-1.5 bg-[#e3b341] hover:bg-[#d29922] text-black text-xs font-bold rounded flex items-center gap-1.5">
                <Plus size={13} /> Add Item Definition
              </button>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d1117] text-[#8b949e] uppercase font-bold border-b border-[#30363d]">
                  <tr>
                    <th className="p-3">Item Name & ID</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Rarity</th>
                    <th className="p-3">Weight (KG)</th>
                    <th className="p-3">Value (Gold)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-[#1f2937]">
                      <td className="p-3">
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-[10px] font-mono text-[#8b949e]">{item.id}</div>
                      </td>
                      <td className="p-3 font-mono text-[#58a6ff]">{item.type}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.rarity === 'Legendary' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                          item.rarity === 'Epic' ? 'bg-[#a855f7]/20 text-[#a855f7]' :
                          'bg-[#3b82f6]/20 text-[#3b82f6]'
                        }`}>
                          {item.rarity}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{item.weight} kg</td>
                      <td className="p-3 font-mono text-amber-400 font-bold">{item.value} G</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
