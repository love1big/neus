import React, { useState, useEffect, useRef } from 'react';
import { Puzzle, Box, Play, Trash2, Plus, Terminal, Activity, FileCode2, Loader2, ArrowUpRight, Copy, CheckCircle2, ChevronRight, XCircle} from 'lucide-react';

interface PluginNode {
  id: string;
  name: string;
  type: 'javascript' | 'wasm' | 'cpp' | 'csharp';
  status: 'stopped' | 'running' | 'compiling' | 'error';
  version: string;
  memoryUsage: number;
  cpuUsage: number;
  logs: string[];
  code: string;
  manifest: string;
}

export default function NexusPluginArchitect() {
  const [plugins, setPlugins] = useState<PluginNode[]>([
    {
       id: 'plg_001', name: 'Nexus C++ Physics Hooks', type: 'cpp', status: 'running', version: '1.0.4',
       memoryUsage: 24.5, cpuUsage: 12.2, logs: ['[C++] Initialized native bindings.', '[C++] Physics tick override engaged.'],
       code: '#include <nexus_engine.h>\n\nvoid on_physics_update(float delta_time) {\n  // Custom soft-body solver running in Wasm\n  Nexus::ApplySoftBodyDamping(0.95f);\n}',
       manifest: '{\n  "name": "Nexus C++ Physics Hooks",\n  "version": "1.0.4",\n  "author": "Nexus Team",\n  "description": "Overrides core physics tick with custom damping solver",\n  "icon": "Box",\n  "dependencies": ["nexus_physics_core@^2.0.0"],\n  "commandPaletteHooks": [{\n    "command": "physics:reload",\n    "title": "Reload Physics Solver"\n  }]\n}'
    },
    {
       id: 'plg_002', name: 'JS Editor Tool Overlay', type: 'javascript', status: 'stopped', version: '0.9.1',
       memoryUsage: 0, cpuUsage: 0, logs: [],
       code: 'registerOmniTool({\n  id: "custom_ui_tool",\n  name: "Custom UI Overlay",\n  render: () => <div className="p-4 bg-red-500">Hello Native React</div>\n});',
       manifest: '{\n  "name": "JS Editor Tool Overlay",\n  "version": "0.9.1",\n  "author": "Community",\n  "description": "An overlay tool",\n  "icon": "Layout",\n  "dependencies": ["react", "lucide-react"],\n  "commandPaletteHooks": [{\n    "command": "ui:toggle-overlay",\n    "title": "Toggle Custom React Overlay"\n  }]\n}'
    }
  ]);

  const [activePluginId, setActivePluginId] = useState<string | null>('plg_001');
  const [activeTab, setActiveTab] = useState<'code' | 'manifest'>('code');

  const activePlugin = plugins.find(p => p.id === activePluginId);

  const simulateStatusChange = (id: string, newStatus: string) => {
    setPlugins(prev => prev.map(p => {
       if (p.id === id) {
          const l = [...p.logs];
          l.push(`[System] State transition -> ${newStatus}`);
          return { ...p, status: newStatus as any, logs: l };
       }
       return p;
    }));
  };

  const handleCreate = (type: 'javascript' | 'wasm' | 'cpp' | 'csharp') => {
     const newId = `plg_${Date.now()}`;
     setPlugins(prev => [...prev, {
       id: newId,
       name: `New ${type.toUpperCase()} Plugin`,
       type,
       status: 'stopped',
       version: '1.0.0',
       memoryUsage: 0, cpuUsage: 0, logs: [],
       code: '// Write your implementation here\n',
       manifest: '{\n  "name": "' + `New ${type.toUpperCase()} Plugin` + '",\n  "version": "1.0.0",\n  "author": "",\n  "description": "",\n  "icon": "Puzzle",\n  "dependencies": [],\n  "commandPaletteHooks": []\n}'
     }]);
     setActivePluginId(newId);
  };

  const hotReload = (id: string) => {
     simulateStatusChange(id, 'compiling');
     setTimeout(() => {
        setPlugins(prev => prev.map(p => {
           if(p.id === id) {
             const m = p.type === 'cpp' || p.type === 'csharp' ? Math.random() * 50 + 10 : Math.random() * 10 + 2;
             return {...p, memoryUsage: m, status: 'running', logs: [...p.logs, '[JIT/WASM] Hot-reload complete. Hooks re-attached.']};
           }
           return p;
        }));
     }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0a0f] text-[#c9d1d9] font-sans overflow-hidden">
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center gap-3">
                <Puzzle size={20} className="text-[#e3b341]" />
                <h1 className="text-sm font-black text-white uppercase tracking-wider">NexusEngine Native Plugin Architect</h1>
                <span className="text-[10px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded font-mono border border-[#3fb950]/30 shadow-[0_0_10px_rgba(63,185,80,0.2)]">V8 / WASM RUNTIME ACTIVE</span>
            </div>
            
            <div className="flex items-center gap-2">
                <button onClick={() => handleCreate('javascript')} className="px-3 py-1.5 bg-[#21262d] text-white rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d] flex items-center gap-1"><Plus size={12}/> JS/TS</button>
                <button onClick={() => handleCreate('cpp')} className="px-3 py-1.5 bg-[#21262d] text-white rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d] flex items-center gap-1"><Plus size={12}/> C++ (WASM)</button>
                <button onClick={() => handleCreate('csharp')} className="px-3 py-1.5 bg-[#21262d] text-white rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d] flex items-center gap-1"><Plus size={12}/> C# (Mono)</button>
            </div>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Sidebar */}
         <div className="w-64 border-r border-[#2d2d2d] bg-[#0d1117] flex flex-col overflow-y-auto shrink-0 shadow-[5px_0_15px_rgba(0,0,0,0.5)] z-20">
            <div className="p-3 text-[11px] font-bold text-[#8b949e] uppercase tracking-wider border-b border-[#2d2d2d] bg-[#161b22]">Loaded Extensions</div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
               {plugins.map(p => (
                 <div 
                   key={p.id}
                   onClick={() => setActivePluginId(p.id)}
                   className={`p-3 rounded border cursor-pointer transition-colors ${activePluginId === p.id ? 'bg-[#1f2937] border-[#58a6ff]' : 'bg-[#161b22] border-[#30363d] hover:border-[#8b949e]'}`}
                 >
                    <div className="flex items-center justify-between mb-2">
                       <span className="font-bold text-white text-[13px] truncate">{p.name}</span>
                       <span className={`w-2 h-2 rounded-full ${p.status === 'running' ? 'bg-[#3fb950] shadow-[0_0_8px_#3fb950]' : p.status === 'stopped' ? 'bg-[#888]' : p.status === 'compiling' ? 'bg-[#e3b341] animate-pulse' : 'bg-[#f85149]'}`}></span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#8b949e] font-mono">
                        <span className="bg-[#21262d] px-1 py-0.5 rounded uppercase">{p.type}</span>
                        <span>v{p.version}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Editor Area */}
         {activePlugin ? (
           <div className="flex-1 flex flex-col min-w-0 bg-[#0a0c10]">
              <div className="h-12 border-b border-[#30363d] bg-[#161b22] px-4 flex justify-between items-center shrink-0">
                  <div className="flex flex-col">
                     <span className="text-[13px] font-bold text-white flex items-center gap-2"><Box size={14} className="text-[#bc8cff]"/> {activePlugin.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     {activePlugin.status === 'running' && <span className="font-mono text-[10px] text-[#3fb950] flex gap-2"><span>MEM: {activePlugin.memoryUsage.toFixed(1)}MB</span><span>CPU: {activePlugin.cpuUsage.toFixed(1)}%</span></span>}
                     {activePlugin.status === 'stopped' || activePlugin.status === 'error' ? (
                         <button onClick={() => hotReload(activePlugin.id)} className="px-3 py-1 text-[11px] font-bold bg-[#238636] hover:bg-[#2ea043] text-white rounded flex items-center gap-1 shadow-md transition-all"><Play size={12}/> INJECT BUNDLE</button>
                     ) : activePlugin.status === 'running' ? (
                        <>
                         <button onClick={() => hotReload(activePlugin.id)} className="px-3 py-1 text-[11px] font-bold bg-[#1f2937] border border-[#58a6ff] hover:bg-[#58a6ff]/20 text-[#58a6ff] rounded flex items-center gap-1 transition-all"><Activity size={12}/> HOT RELOAD</button>
                         <button onClick={() => simulateStatusChange(activePlugin.id, 'stopped')} className="px-3 py-1 text-[11px] font-bold bg-[#f85149]/20 hover:bg-[#f85149]/40 text-[#f85149] rounded border border-[#f85149]/50 transition-all"><XCircle size={12}/> EJECT</button>
                        </>
                     ) : (
                         <button disabled className="px-3 py-1 text-[11px] font-bold bg-[#1f2937] text-[#8b949e] border border-[#30363d] rounded flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> COMPILING...</button>
                     )}
                     <button onClick={() => {
                        setPlugins(prev => prev.filter(p => p.id !== activePlugin.id));
                        setActivePluginId(null);
                     }} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 size={14}/></button>
                  </div>
              </div>

              <div className="h-8 bg-[#0d1117] border-b border-[#30363d] flex shrink-0">
                 <button 
                    onClick={() => setActiveTab('code')}
                    className={`px-4 py-1 text-[11px] font-bold border-r border-[#30363d] transition-colors ${activeTab === 'code' ? 'bg-[#161b22] text-white border-t-2 border-t-[#58a6ff]' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22] border-t-2 border-t-transparent'}`}
                 >
                    {activePlugin.type === 'cpp' ? 'main.cpp' : activePlugin.type === 'csharp' ? 'Extension.cs' : 'index.js'}
                 </button>
                 <button 
                    onClick={() => setActiveTab('manifest')}
                    className={`px-4 py-1 text-[11px] font-bold border-r border-[#30363d] transition-colors flex items-center gap-1 ${activeTab === 'manifest' ? 'bg-[#161b22] text-[#e3b341] border-t-2 border-t-[#e3b341]' : 'text-[#8b949e] hover:text-[#e3b341] hover:bg-[#161b22] border-t-2 border-t-transparent'}`}
                 >
                    <FileCode2 size={12}/> manifest.json
                 </button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                  <div className="flex-1 border-r border-[#30363d] bg-[#0d1117] flex flex-col relative">
                     <div className="absolute top-0 right-0 bg-[#21262d] text-[#c9d1d9] text-[10px] px-2 py-0.5 rounded-bl font-mono border-b border-l border-[#30363d] z-10">
                        {activeTab === 'code' ? (activePlugin.type === 'cpp' ? 'C++17 (WASM)' : activePlugin.type === 'csharp' ? 'C# 10.0 (Mono)' : 'ES2022') : 'JSON'}
                     </div>
                     <textarea
                        className="flex-1 w-full p-4 pt-8 bg-transparent text-[#e6edf3] font-mono text-[13px] resize-none outline-none focus:ring-0 whitespace-pre leading-relaxed relative z-0"
                        value={activeTab === 'code' ? activePlugin.code : activePlugin.manifest}
                        onChange={(e) => setPlugins(prev => prev.map(p => p.id === activePlugin.id ? (activeTab === 'code' ? {...p, code: e.target.value} : {...p, manifest: e.target.value}) : p))}
                        spellCheck={false}
                     />
                  </div>

                  <div className="w-80 bg-[#161b22] flex flex-col">
                     <div className="p-2 border-b border-[#30363d] bg-[#0d1117] flex items-center gap-2">
                        <Terminal size={14} className="text-[#8b949e]" />
                        <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Plugin Output / Logs</span>
                     </div>
                     <div className="flex-1 p-3 overflow-y-auto space-y-1.5">
                        {activePlugin.logs.length === 0 ? (
                           <div className="text-[11px] text-[#484f58] italic text-center mt-10">No output logs yet.</div>
                        ) : activePlugin.logs.map((log, i) => (
                           <div key={i} className="text-[11px] font-mono leading-tight break-words text-[#3fb950] pb-1 border-b border-[#30363d]/50 mix-blend-screen">
                              {log}
                           </div>
                        ))}
                     </div>
                  </div>
              </div>
           </div>
         ) : (
           <div className="flex-1 flex items-center justify-center bg-[#0a0c10]">
              <div className="text-center">
                 <Puzzle size={48} className="text-[#30363d] mx-auto mb-4" />
                 <h2 className="text-[#8b949e] font-bold text-lg mb-2">Omni Extensibility System</h2>
                 <p className="text-[#484f58] text-[13px]">Select an existing plugin or create a new bundle.</p>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}
