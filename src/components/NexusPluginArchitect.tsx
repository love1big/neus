import React, { useState } from 'react';
import { 
  Puzzle, 
  Box, 
  Play, 
  Trash2, 
  Plus, 
  Terminal, 
  Activity, 
  FileCode2, 
  Loader2, 
  XCircle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  HardDrive,
  Globe,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Cpu
} from 'lucide-react';

interface SandboxConfig {
  blockFileSystem: boolean;
  blockNetworking: boolean;
  blockNativeFFI: boolean;
  memoryQuotaMB: number;
}

interface PluginNode {
  id: string;
  name: string;
  type: 'javascript' | 'wasm' | 'cpp' | 'csharp';
  status: 'stopped' | 'running' | 'compiling' | 'error';
  version: string;
  memoryUsage: number;
  cpuUsage: number;
  sandboxed: boolean;
  sandboxConfig: SandboxConfig;
  logs: string[];
  code: string;
  manifest: string;
}

export default function NexusPluginArchitect() {
  const [plugins, setPlugins] = useState<PluginNode[]>([
    {
      id: 'plg_001', 
      name: 'Nexus C++ Physics Hooks', 
      type: 'cpp', 
      status: 'running', 
      version: '1.0.4',
      memoryUsage: 24.5, 
      cpuUsage: 12.2, 
      sandboxed: true,
      sandboxConfig: {
        blockFileSystem: true,
        blockNetworking: true,
        blockNativeFFI: false,
        memoryQuotaMB: 64
      },
      logs: [
        '[Sandbox] Runtime initialized inside WASM Secure Linear Memory Boundary.',
        '[Sandbox Policy] Filesystem: Virtual VFS (Read-Only) | Network: Blocked (Null Socket).',
        '[C++] Initialized native bindings.', 
        '[C++] Physics tick override engaged.'
      ],
      code: '#include <nexus_engine.h>\n#include <iostream>\n\n// Safe development sandbox active:\n// Direct OS filesystem and network sockets are intercepted and rejected.\nvoid on_physics_update(float delta_time) {\n  // Custom soft-body solver running in Wasm sandbox\n  Nexus::ApplySoftBodyDamping(0.95f);\n}\n\n// Attempting forbidden API in sandbox mode triggers security interception:\nvoid test_restricted_io() {\n  // std::cout << "Writing to /etc/system..." << std::endl; // Blocked by Sandbox\n}',
      manifest: '{\n  "name": "Nexus C++ Physics Hooks",\n  "version": "1.0.4",\n  "author": "Nexus Team",\n  "description": "Overrides core physics tick with custom damping solver",\n  "icon": "Box",\n  "sandbox": true,\n  "permissions": {\n    "filesystem": false,\n    "networking": false,\n    "nativeFFI": true\n  },\n  "dependencies": ["nexus_physics_core@^2.0.0"],\n  "commandPaletteHooks": [{\n    "command": "physics:reload",\n    "title": "Reload Physics Solver"\n  }]\n}'
    },
    {
      id: 'plg_002', 
      name: 'JS Editor Tool Overlay', 
      type: 'javascript', 
      status: 'stopped', 
      version: '0.9.1',
      memoryUsage: 0, 
      cpuUsage: 0, 
      sandboxed: true,
      sandboxConfig: {
        blockFileSystem: true,
        blockNetworking: true,
        blockNativeFFI: true,
        memoryQuotaMB: 32
      },
      logs: [
        '[Sandbox] Isolated V8 Context prepared with hardened global proxy.',
        '[Sandbox Policy] window.fetch, XMLHttpRequest, WebSocket, and Node fs are neutralized.'
      ],
      code: 'registerOmniTool({\n  id: "custom_ui_tool",\n  name: "Custom UI Overlay",\n  render: () => {\n    // Sandboxed execution: UI events and state bindings are safe\n    return (\n      <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-lg text-white">\n        <h3 className="font-bold text-[#58a6ff]">Native Custom Tool Overlay</h3>\n        <p className="text-xs text-[#8b949e] mt-1">Operating in isolated Development Sandbox</p>\n      </div>\n    );\n  }\n});',
      manifest: '{\n  "name": "JS Editor Tool Overlay",\n  "version": "0.9.1",\n  "author": "Community",\n  "description": "An overlay tool running in safe sandbox mode",\n  "icon": "Layout",\n  "sandbox": true,\n  "permissions": {\n    "filesystem": false,\n    "networking": false\n  },\n  "dependencies": ["react", "lucide-react"],\n  "commandPaletteHooks": [{\n    "command": "ui:toggle-overlay",\n    "title": "Toggle Custom React Overlay"\n  }]\n}'
    },
    {
      id: 'plg_003', 
      name: 'Cloud Asset Telemetry Sync', 
      type: 'javascript', 
      status: 'stopped', 
      version: '1.2.0',
      memoryUsage: 0, 
      cpuUsage: 0, 
      sandboxed: false,
      sandboxConfig: {
        blockFileSystem: false,
        blockNetworking: false,
        blockNativeFFI: false,
        memoryQuotaMB: 128
      },
      logs: [
        '[Security Warning] Plugin running in UNRESTRICTED mode.',
        '[Security] Full OS disk I/O and network socket access permitted.'
      ],
      code: '// Caution: Unrestricted mode allows raw HTTP requests and local disk I/O\nasync function syncRemoteAssets() {\n  const res = await fetch("https://assets.nexusengine.internal/manifest.json");\n  const data = await res.json();\n  console.log("Assets fetched:", data.length);\n}',
      manifest: '{\n  "name": "Cloud Asset Telemetry Sync",\n  "version": "1.2.0",\n  "author": "Pipeline Ops",\n  "description": "Synchronizes remote asset registries via network sockets",\n  "icon": "Cloud",\n  "sandbox": false,\n  "permissions": {\n    "filesystem": true,\n    "networking": true\n  },\n  "dependencies": [],\n  "commandPaletteHooks": []\n}'
    }
  ]);

  const [activePluginId, setActivePluginId] = useState<string | null>('plg_001');
  const [activeTab, setActiveTab] = useState<'code' | 'manifest'>('code');
  const [showSandboxDetails, setShowSandboxDetails] = useState<boolean>(false);

  const activePlugin = plugins.find(p => p.id === activePluginId);

  const toggleSandbox = (id: string) => {
    setPlugins(prev => prev.map(p => {
      if (p.id === id) {
        const nextSandboxed = !p.sandboxed;
        const updatedLogs = [...p.logs];
        const timestamp = new Date().toLocaleTimeString();

        if (nextSandboxed) {
          updatedLogs.push(
            `[${timestamp}] [SECURITY] Sandbox Mode ENABLED for "${p.name}".`,
            `[${timestamp}] [Sandbox Policy] Filesystem APIs and Network Sockets are now strictly restricted.`
          );
        } else {
          updatedLogs.push(
            `[${timestamp}] [SECURITY WARNING] Sandbox Mode DISABLED for "${p.name}".`,
            `[${timestamp}] [Security Alert] Plugin now possesses UNRESTRICTED OS filesystem and network socket access.`
          );
        }

        // Keep manifest JSON in sync
        let updatedManifest = p.manifest;
        try {
          const parsed = JSON.parse(p.manifest);
          parsed.sandbox = nextSandboxed;
          parsed.permissions = {
            filesystem: !nextSandboxed,
            networking: !nextSandboxed,
            ...(parsed.permissions || {})
          };
          parsed.permissions.filesystem = !nextSandboxed;
          parsed.permissions.networking = !nextSandboxed;
          updatedManifest = JSON.stringify(parsed, null, 2);
        } catch {
          // If manifest is invalid JSON during editing, keep as is
        }

        return {
          ...p,
          sandboxed: nextSandboxed,
          manifest: updatedManifest,
          sandboxConfig: {
            ...p.sandboxConfig,
            blockFileSystem: nextSandboxed,
            blockNetworking: nextSandboxed
          },
          logs: updatedLogs
        };
      }
      return p;
    }));
  };

  const simulateStatusChange = (id: string, newStatus: string) => {
    setPlugins(prev => prev.map(p => {
      if (p.id === id) {
        const l = [...p.logs];
        const timestamp = new Date().toLocaleTimeString();
        l.push(`[${timestamp}] [System] State transition -> ${newStatus.toUpperCase()}`);
        return { ...p, status: newStatus as any, logs: l };
      }
      return p;
    }));
  };

  const handleCreate = (type: 'javascript' | 'wasm' | 'cpp' | 'csharp') => {
    const newId = `plg_${Date.now()}`;
    const newName = `New ${type.toUpperCase()} Plugin`;
    setPlugins(prev => [...prev, {
      id: newId,
      name: newName,
      type,
      status: 'stopped',
      version: '1.0.0',
      memoryUsage: 0, 
      cpuUsage: 0, 
      sandboxed: true,
      sandboxConfig: {
        blockFileSystem: true,
        blockNetworking: true,
        blockNativeFFI: type !== 'cpp',
        memoryQuotaMB: 32
      },
      logs: [
        '[Sandbox] Initialized with default Strict Sandbox policy (FS: Blocked, Net: Blocked).'
      ],
      code: `// ${newName} implementation\n// Safe development sandbox active\n`,
      manifest: JSON.stringify({
        name: newName,
        version: "1.0.0",
        author: "",
        description: "Development plugin bundle",
        icon: "Puzzle",
        sandbox: true,
        permissions: {
          filesystem: false,
          networking: false
        },
        dependencies: [],
        commandPaletteHooks: []
      }, null, 2)
    }]);
    setActivePluginId(newId);
  };

  const runSecurityAudit = (plugin: PluginNode) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLogs = [...plugin.logs];
    newLogs.push(`[${timestamp}] [AUDIT] Running Sandbox Security API scan on ${plugin.name}...`);

    const code = plugin.code.toLowerCase();
    const networkKeywords = ['fetch(', 'http:', 'https:', 'websocket', 'socket', 'xhr', 'xmlhttprequest', 'net.socket', 'webrtc', 'curl'];
    const fsKeywords = ['fs.', 'require("fs")', 'require(\'fs\')', 'readfilesync', 'writefilesync', 'fopen', 'std::filesystem', 'system.io.file', 'unlink', 'rmdir'];

    const hasNetwork = networkKeywords.some(kw => code.includes(kw));
    const hasFs = fsKeywords.some(kw => code.includes(kw));

    if (plugin.sandboxed) {
      if (hasNetwork) {
        newLogs.push(`[${timestamp}] [SANDBOX TRAP] Network API call detected: Blocked by Sandbox Policy.`);
      }
      if (hasFs) {
        newLogs.push(`[${timestamp}] [SANDBOX TRAP] Filesystem I/O detected: Blocked by Sandbox VFS Jail.`);
      }
      if (!hasNetwork && !hasFs) {
        newLogs.push(`[${timestamp}] [AUDIT PASSED] No restricted I/O calls found. Sandbox integrity verified.`);
      } else {
        newLogs.push(`[${timestamp}] [AUDIT INFO] Sandbox successfully isolated all potential security breaches.`);
      }
    } else {
      if (hasNetwork || hasFs) {
        newLogs.push(`[${timestamp}] [AUDIT WARN] Plugin performs direct I/O (${hasNetwork ? 'Network ' : ''}${hasFs ? 'Filesystem' : ''}) with Sandbox DISABLED.`);
      } else {
        newLogs.push(`[${timestamp}] [AUDIT INFO] Plugin has unrestricted access, but no raw I/O calls were detected in source.`);
      }
    }

    setPlugins(prev => prev.map(p => p.id === plugin.id ? { ...p, logs: newLogs } : p));
  };

  const hotReload = (id: string) => {
    simulateStatusChange(id, 'compiling');
    setTimeout(() => {
      setPlugins(prev => prev.map(p => {
        if(p.id === id) {
          const timestamp = new Date().toLocaleTimeString();
          const m = p.type === 'cpp' || p.type === 'csharp' ? Math.random() * 40 + 15 : Math.random() * 8 + 3;
          const nextLogs = [...p.logs];
          
          if (p.sandboxed) {
            nextLogs.push(
              `[${timestamp}] [Sandbox Runtime] Initialized isolated isolate (V8/WASM Memory Sandbox).`,
              `[${timestamp}] [Sandbox Policy Enforced] FS: Jailed (ReadOnly Virtual VFS) | NET: Denied | Quota: ${p.sandboxConfig.memoryQuotaMB}MB`,
              `[${timestamp}] [JIT/WASM] Hot-reload complete. Hooks re-attached safely inside Sandbox.`
            );
          } else {
            nextLogs.push(
              `[${timestamp}] [Native Runtime] Injected bundle with DIRECT host permissions (Sandbox: Disabled).`,
              `[${timestamp}] [JIT/WASM] Hot-reload complete. Native hooks re-attached.`
            );
          }

          return {
            ...p, 
            memoryUsage: m, 
            cpuUsage: Math.random() * 8 + 2,
            status: 'running', 
            logs: nextLogs
          };
        }
        return p;
      }));
    }, 1200);
  };

  const clearLogs = (id: string) => {
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, logs: [] } : p));
  };

  return (
    <div id="nexus-plugin-architect" className="flex-1 flex flex-col w-full h-full bg-[#0a0a0f] text-[#c9d1d9] font-sans overflow-hidden">
      {/* Top Header */}
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-3">
            <Puzzle size={20} className="text-[#e3b341]" />
            <h1 className="text-sm font-black text-white uppercase tracking-wider">NexusEngine Native Plugin Architect</h1>
            <span className="text-[10px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded font-mono border border-[#3fb950]/30 shadow-[0_0_10px_rgba(63,185,80,0.2)]">
              V8 / WASM RUNTIME ACTIVE
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              id="btn-create-js"
              onClick={() => handleCreate('javascript')} 
              className="px-3 py-1.5 bg-[#21262d] text-white rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d] flex items-center gap-1 transition-colors"
            >
              <Plus size={12}/> JS/TS
            </button>
            <button 
              id="btn-create-cpp"
              onClick={() => handleCreate('cpp')} 
              className="px-3 py-1.5 bg-[#21262d] text-white rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d] flex items-center gap-1 transition-colors"
            >
              <Plus size={12}/> C++ (WASM)
            </button>
            <button 
              id="btn-create-csharp"
              onClick={() => handleCreate('csharp')} 
              className="px-3 py-1.5 bg-[#21262d] text-white rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d] flex items-center gap-1 transition-colors"
            >
              <Plus size={12}/> C# (Mono)
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-[#2d2d2d] bg-[#0d1117] flex flex-col overflow-y-auto shrink-0 shadow-[5px_0_15px_rgba(0,0,0,0.5)] z-20">
          <div className="p-3 text-[11px] font-bold text-[#8b949e] uppercase tracking-wider border-b border-[#2d2d2d] bg-[#161b22] flex items-center justify-between">
            <span>Loaded Extensions ({plugins.length})</span>
            <span className="text-[10px] text-[#58a6ff] font-mono">
              {plugins.filter(p => p.sandboxed).length} Sandboxed
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {plugins.map(p => (
              <div 
                key={p.id}
                id={`plugin-card-${p.id}`}
                onClick={() => setActivePluginId(p.id)}
                className={`p-3 rounded border cursor-pointer transition-all ${
                  activePluginId === p.id 
                    ? 'bg-[#1f2937] border-[#58a6ff] shadow-sm' 
                    : 'bg-[#161b22] border-[#30363d] hover:border-[#8b949e]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-[13px] truncate">{p.name}</span>
                  <span 
                    title={`Status: ${p.status}`} 
                    className={`w-2 h-2 rounded-full ${
                      p.status === 'running' 
                        ? 'bg-[#3fb950] shadow-[0_0_8px_#3fb950]' 
                        : p.status === 'stopped' 
                        ? 'bg-[#888]' 
                        : p.status === 'compiling' 
                        ? 'bg-[#e3b341] animate-pulse' 
                        : 'bg-[#f85149]'
                    }`}
                  />
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-[#8b949e] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#21262d] px-1.5 py-0.5 rounded uppercase font-semibold text-white">
                      {p.type}
                    </span>
                    <span>v{p.version}</span>
                  </div>

                  {/* Sandbox Status Badge */}
                  <span 
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold border ${
                      p.sandboxed 
                        ? 'bg-[#238636]/15 text-[#3fb950] border-[#3fb950]/30' 
                        : 'bg-[#d29922]/15 text-[#d29922] border-[#d29922]/40'
                    }`}
                    title={p.sandboxed ? "Restricted Sandbox (FS & Net Blocked)" : "Unrestricted (Direct System Access)"}
                  >
                    {p.sandboxed ? <Lock size={9} /> : <Unlock size={9} />}
                    {p.sandboxed ? 'SANDBOXED' : 'UNRESTRICTED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        {activePlugin ? (
          <div className="flex-1 flex flex-col min-w-0 bg-[#0a0c10]">
            {/* Action Bar */}
            <div className="h-14 border-b border-[#30363d] bg-[#161b22] px-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-bold text-white flex items-center gap-2">
                  <Box size={16} className="text-[#bc8cff]"/> {activePlugin.name}
                </span>

                {/* Per-Plugin Sandbox Toggle */}
                <div className="flex items-center gap-2 pl-3 border-l border-[#30363d]">
                  <button
                    id={`toggle-sandbox-${activePlugin.id}`}
                    onClick={() => toggleSandbox(activePlugin.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold border transition-all ${
                      activePlugin.sandboxed
                        ? 'bg-[#238636]/20 border-[#3fb950]/60 text-[#3fb950] hover:bg-[#238636]/30 shadow-[0_0_10px_rgba(63,185,80,0.15)]'
                        : 'bg-[#d29922]/15 border-[#d29922]/60 text-[#e3b341] hover:bg-[#d29922]/25'
                    }`}
                    title="Click to toggle safe development sandbox restrictions on filesystem and networking APIs"
                  >
                    {activePlugin.sandboxed ? <ShieldCheck size={14} className="text-[#3fb950]" /> : <ShieldAlert size={14} className="text-[#e3b341]" />}
                    <span>Sandbox: {activePlugin.sandboxed ? 'ENABLED' : 'DISABLED'}</span>
                    <span className={`w-2 h-2 rounded-full ${activePlugin.sandboxed ? 'bg-[#3fb950]' : 'bg-[#e3b341]'}`} />
                  </button>

                  <button
                    id="btn-toggle-sandbox-details"
                    onClick={() => setShowSandboxDetails(!showSandboxDetails)}
                    className={`px-2 py-1 rounded text-[10px] font-mono border transition-colors ${
                      showSandboxDetails 
                        ? 'bg-[#1f2937] text-white border-[#58a6ff]' 
                        : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-white'
                    }`}
                    title="View & configure sandbox policy parameters"
                  >
                    Policies
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {activePlugin.status === 'running' && (
                  <span className="font-mono text-[10px] text-[#3fb950] flex gap-2.5 bg-[#0d1117] px-2.5 py-1 rounded border border-[#30363d]">
                    <span className="flex items-center gap-1"><HardDrive size={11}/> MEM: {activePlugin.memoryUsage.toFixed(1)}MB</span>
                    <span className="flex items-center gap-1"><Cpu size={11}/> CPU: {activePlugin.cpuUsage.toFixed(1)}%</span>
                  </span>
                )}

                <button 
                  id="btn-run-audit"
                  onClick={() => runSecurityAudit(activePlugin)}
                  className="px-2.5 py-1 text-[11px] font-bold bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] rounded flex items-center gap-1 transition-colors"
                  title="Test sandbox security boundary against plugin source code"
                >
                  <Shield size={12} className="text-[#58a6ff]"/> Audit APIs
                </button>

                {activePlugin.status === 'stopped' || activePlugin.status === 'error' ? (
                  <button 
                    id="btn-inject-bundle"
                    onClick={() => hotReload(activePlugin.id)} 
                    className="px-3 py-1 text-[11px] font-bold bg-[#238636] hover:bg-[#2ea043] text-white rounded flex items-center gap-1 shadow-md transition-all"
                  >
                    <Play size={12}/> INJECT BUNDLE
                  </button>
                ) : activePlugin.status === 'running' ? (
                  <>
                    <button 
                      id="btn-hot-reload"
                      onClick={() => hotReload(activePlugin.id)} 
                      className="px-3 py-1 text-[11px] font-bold bg-[#1f2937] border border-[#58a6ff] hover:bg-[#58a6ff]/20 text-[#58a6ff] rounded flex items-center gap-1 transition-all"
                    >
                      <Activity size={12}/> HOT RELOAD
                    </button>
                    <button 
                      id="btn-eject-plugin"
                      onClick={() => simulateStatusChange(activePlugin.id, 'stopped')} 
                      className="px-3 py-1 text-[11px] font-bold bg-[#f85149]/20 hover:bg-[#f85149]/40 text-[#f85149] rounded border border-[#f85149]/50 transition-all"
                    >
                      <XCircle size={12}/> EJECT
                    </button>
                  </>
                ) : (
                  <button disabled className="px-3 py-1 text-[11px] font-bold bg-[#1f2937] text-[#8b949e] border border-[#30363d] rounded flex items-center gap-1">
                    <Loader2 size={12} className="animate-spin"/> COMPILING...
                  </button>
                )}

                <button 
                  id="btn-delete-plugin"
                  onClick={() => {
                    setPlugins(prev => prev.filter(p => p.id !== activePlugin.id));
                    setActivePluginId(null);
                  }} 
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                  title="Remove extension"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>

            {/* Sandbox Policy Banner / Details */}
            {showSandboxDetails && (
              <div id="sandbox-policy-panel" className="bg-[#161b22] border-b border-[#30363d] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
                <div className="flex items-center gap-4">
                  <span className="text-[#8b949e] uppercase font-bold flex items-center gap-1">
                    <Lock size={12} className={activePlugin.sandboxed ? "text-[#3fb950]" : "text-[#e3b341]"}/>
                    Sandbox Restriction Policy:
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <HardDrive size={13} className={activePlugin.sandboxed ? "text-[#f85149]" : "text-[#3fb950]"}/>
                    <span className="text-[#c9d1d9]">Filesystem:</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold ${activePlugin.sandboxed ? 'bg-[#da3633]/20 text-[#f85149]' : 'bg-[#238636]/20 text-[#3fb950]'}`}>
                      {activePlugin.sandboxed ? 'BLOCKED (VFS Jail)' : 'ALLOWED (Host POSIX)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Globe size={13} className={activePlugin.sandboxed ? "text-[#f85149]" : "text-[#3fb950]"}/>
                    <span className="text-[#c9d1d9]">Networking:</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold ${activePlugin.sandboxed ? 'bg-[#da3633]/20 text-[#f85149]' : 'bg-[#238636]/20 text-[#3fb950]'}`}>
                      {activePlugin.sandboxed ? 'BLOCKED (Null Sockets)' : 'ALLOWED (Raw HTTP/WS)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Box size={13} className="text-[#58a6ff]"/>
                    <span className="text-[#c9d1d9]">Memory Cap:</span>
                    <span className="text-[#58a6ff] font-bold">{activePlugin.sandboxConfig.memoryQuotaMB}MB</span>
                  </div>
                </div>

                <div className="text-[10px] text-[#8b949e]">
                  {activePlugin.sandboxed 
                    ? '🛡️ Safe Dev Testing: Dangerous disk and network calls are trapped and quarantined.'
                    : '⚠️ Warning: Plugin executes with host system process privileges.'}
                </div>
              </div>
            )}

            {/* Code / Manifest Tab Bar */}
            <div className="h-8 bg-[#0d1117] border-b border-[#30363d] flex shrink-0 justify-between items-center pr-3">
              <div className="flex h-full">
                <button 
                  id="tab-code"
                  onClick={() => setActiveTab('code')}
                  className={`px-4 py-1 text-[11px] font-bold border-r border-[#30363d] transition-colors ${
                    activeTab === 'code' 
                      ? 'bg-[#161b22] text-white border-t-2 border-t-[#58a6ff]' 
                      : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22] border-t-2 border-t-transparent'
                  }`}
                >
                  {activePlugin.type === 'cpp' ? 'main.cpp' : activePlugin.type === 'csharp' ? 'Extension.cs' : 'index.js'}
                </button>
                <button 
                  id="tab-manifest"
                  onClick={() => setActiveTab('manifest')}
                  className={`px-4 py-1 text-[11px] font-bold border-r border-[#30363d] transition-colors flex items-center gap-1 ${
                    activeTab === 'manifest' 
                      ? 'bg-[#161b22] text-[#e3b341] border-t-2 border-t-[#e3b341]' 
                      : 'text-[#8b949e] hover:text-[#e3b341] hover:bg-[#161b22] border-t-2 border-t-transparent'
                  }`}
                >
                  <FileCode2 size={12}/> manifest.json
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                {activePlugin.sandboxed ? (
                  <span className="text-[#3fb950] flex items-center gap-1 bg-[#238636]/10 px-2 py-0.5 rounded border border-[#3fb950]/20">
                    <CheckCircle2 size={10} /> FS & Net Trapped in Sandbox
                  </span>
                ) : (
                  <span className="text-[#e3b341] flex items-center gap-1 bg-[#d29922]/10 px-2 py-0.5 rounded border border-[#d29922]/20">
                    <AlertTriangle size={10} /> Unrestricted Host Privileges
                  </span>
                )}
              </div>
            </div>

            {/* Split Editor and Logs */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 border-r border-[#30363d] bg-[#0d1117] flex flex-col relative">
                <div className="absolute top-0 right-0 bg-[#21262d] text-[#c9d1d9] text-[10px] px-2 py-0.5 rounded-bl font-mono border-b border-l border-[#30363d] z-10">
                  {activeTab === 'code' 
                    ? (activePlugin.type === 'cpp' ? 'C++17 (WASM)' : activePlugin.type === 'csharp' ? 'C# 10.0 (Mono)' : 'ES2022') 
                    : 'JSON'}
                </div>
                <textarea
                  id="plugin-code-editor"
                  className="flex-1 w-full p-4 pt-8 bg-transparent text-[#e6edf3] font-mono text-[13px] resize-none outline-none focus:ring-0 whitespace-pre leading-relaxed relative z-0"
                  value={activeTab === 'code' ? activePlugin.code : activePlugin.manifest}
                  onChange={(e) => setPlugins(prev => prev.map(p => p.id === activePlugin.id ? (activeTab === 'code' ? {...p, code: e.target.value} : {...p, manifest: e.target.value}) : p))}
                  spellCheck={false}
                />
              </div>

              {/* Logs / Output Terminal */}
              <div className="w-96 bg-[#161b22] flex flex-col">
                <div className="p-2 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-[#8b949e]" />
                    <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">
                      Sandbox & Plugin Output
                    </span>
                  </div>
                  <button 
                    id="btn-clear-logs"
                    onClick={() => clearLogs(activePlugin.id)}
                    className="text-[10px] text-[#8b949e] hover:text-white px-1.5 py-0.5 rounded hover:bg-[#21262d] font-mono transition-colors"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="flex-1 p-3 overflow-y-auto space-y-1.5 font-mono text-[11px]">
                  {activePlugin.logs.length === 0 ? (
                    <div className="text-[#484f58] italic text-center mt-10">No output logs yet.</div>
                  ) : (
                    activePlugin.logs.map((log, i) => {
                      const isWarn = log.includes('WARN') || log.includes('WARNING') || log.includes('TRAP');
                      const isSecurity = log.includes('SECURITY') || log.includes('Sandbox') || log.includes('AUDIT');
                      const isError = log.includes('Error') || log.includes('BLOCKED');
                      
                      let textColor = 'text-[#3fb950]';
                      if (isError) textColor = 'text-[#f85149] font-bold';
                      else if (isWarn) textColor = 'text-[#e3b341] font-bold';
                      else if (isSecurity) textColor = 'text-[#58a6ff]';

                      return (
                        <div 
                          key={i} 
                          className={`leading-tight break-words pb-1 border-b border-[#30363d]/50 mix-blend-screen ${textColor}`}
                        >
                          {log}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Sandbox Quick Status Footer */}
                <div className="p-2 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#8b949e]">Sandbox Guard:</span>
                  <span className={activePlugin.sandboxed ? "text-[#3fb950] font-bold" : "text-[#e3b341] font-bold"}>
                    {activePlugin.sandboxed ? "ACTIVE (FS & NET RESTRICTED)" : "INACTIVE (UNRESTRICTED)"}
                  </span>
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
