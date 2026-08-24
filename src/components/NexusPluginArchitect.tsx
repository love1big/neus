import React, { useState, useEffect } from 'react';
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
  Cpu,
  Radio,
  Share2,
  Zap,
  Layers,
  ArrowRight,
  Sparkles,
  Sliders,
  CheckSquare,
  Square,
  DownloadCloud,
  CheckCheck,
  Filter,
  Search,
  Flame,
  Clock,
  ArrowUpRight,
  RotateCcw,
  Check,
  Package,
  Server,
  FolderSync
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

export interface MarketplaceUpdateEvent {
  id: string;
  pluginId: string;
  pluginName: string;
  version: string;
  previousVersion?: string;
  changeType: 'major_update' | 'hotfix' | 'security_patch' | 'asset_package';
  affectedModules: string[];
  timestamp: string;
  status: 'received' | 'resolving' | 'refreshed';
}

export interface DetectedPluginUpdate {
  id: string;
  pluginId: string;
  name: string;
  type: 'cpp' | 'javascript' | 'wasm' | 'csharp';
  currentVersion: string;
  targetVersion: string;
  category: 'Physics' | 'Rendering' | 'Tools' | 'Gameplay' | 'VFX' | 'Audio' | 'Scripts';
  sizeMB: number;
  changeType: 'major_update' | 'hotfix' | 'security_patch';
  affectedModules: string[];
  changelog: string[];
  securityStatus: 'verified' | 'sandboxed' | 'audit_passed';
  installState: 'pending' | 'downloading' | 'compiling' | 'hot_swapping' | 'installed' | 'error';
  progress: number;
}

interface DependentModuleState {
  id: string;
  name: string;
  status: 'idle' | 'refreshing' | 'synced';
  lastRefreshedAt?: string;
  latencyMs?: number;
}

const DEFAULT_DEPENDENT_MODULES: Record<string, DependentModuleState> = {
  'ModelingEditor': { id: 'ModelingEditor', name: '3D Modeling Studio', status: 'idle' },
  'MapEdit': { id: 'MapEdit', name: 'Map & Level Editor', status: 'idle' },
  'VisualShaderGraphEditor': { id: 'VisualShaderGraphEditor', name: 'Visual Shader Graph', status: 'idle' },
  'AdvancedPhysicsEngine': { id: 'AdvancedPhysicsEngine', name: 'Physics & Chaos Engine', status: 'idle' },
  'GameSystemsEditor': { id: 'GameSystemsEditor', name: 'Gameplay Systems Core', status: 'idle' },
  'OmniVFXStudio': { id: 'OmniVFXStudio', name: 'VFX Particle Studio', status: 'idle' },
  'AudioEditor': { id: 'AudioEditor', name: 'Audio DSP Studio', status: 'idle' },
  'UIUXDataBindingEditor': { id: 'UIUXDataBindingEditor', name: 'UI/UX Binding Engine', status: 'idle' }
};

const MODULE_DEPENDENCY_MAP: Record<string, string[]> = {
  'Nexus C++ Physics Hooks': ['AdvancedPhysicsEngine', 'ModelingEditor'],
  'JS Editor Tool Overlay': ['UIUXDataBindingEditor', 'GameSystemsEditor'],
  'Cloud Asset Telemetry Sync': ['MapEdit', 'ModelingEditor'],
  'Amplify Shader Editor': ['VisualShaderGraphEditor', 'ModelingEditor'],
  'Odin Inspector & Serializer': ['GameSystemsEditor', 'UIUXDataBindingEditor'],
  'GAS Companion': ['GameSystemsEditor'],
  'Niagara Magic & Spells': ['OmniVFXStudio'],
  'Weather System Pro': ['MapEdit', 'OmniVFXStudio'],
  'AAA Gun SFX Pack': ['AudioEditor'],
  'Nanite Mesh Optimizer': ['ModelingEditor', 'MapEdit']
};

const INITIAL_DETECTED_UPDATES: DetectedPluginUpdate[] = [
  {
    id: 'upd_001',
    pluginId: 'plg_001',
    name: 'Nexus C++ Physics Hooks',
    type: 'cpp',
    currentVersion: '1.0.4',
    targetVersion: '1.1.0',
    category: 'Physics',
    sizeMB: 18.4,
    changeType: 'hotfix',
    affectedModules: ['AdvancedPhysicsEngine', 'ModelingEditor'],
    changelog: [
      'SIMD AVX-512 acceleration for soft-body mesh vertex solver',
      'Fixed memory leak on continuous tick override deregistration',
      'Added zero-copy WASM linear memory bridge'
    ],
    securityStatus: 'sandboxed',
    installState: 'pending',
    progress: 0
  },
  {
    id: 'upd_002',
    pluginId: 'plg_002',
    name: 'JS Editor Tool Overlay',
    type: 'javascript',
    currentVersion: '0.9.1',
    targetVersion: '1.0.0',
    category: 'Tools',
    sizeMB: 4.2,
    changeType: 'major_update',
    affectedModules: ['UIUXDataBindingEditor', 'GameSystemsEditor'],
    changelog: [
      'React 19 fiber reconciler support for custom tool windows',
      'Two-way reactive state binding for scene graph hierarchy',
      'Hardened isolated V8 execution context'
    ],
    securityStatus: 'verified',
    installState: 'pending',
    progress: 0
  },
  {
    id: 'upd_003',
    pluginId: 'plg_ext_amp',
    name: 'Amplify Shader Editor',
    type: 'javascript',
    currentVersion: '1.9.5',
    targetVersion: '2.0.1',
    category: 'Rendering',
    sizeMB: 32.8,
    changeType: 'security_patch',
    affectedModules: ['VisualShaderGraphEditor', 'ModelingEditor'],
    changelog: [
      'Security patch for AST parsing recursion in custom HLSL nodes',
      'Native SPIR-V cross-compilation pipeline for Vulkan backends',
      'Real-time PBR material preview viewport cache'
    ],
    securityStatus: 'audit_passed',
    installState: 'pending',
    progress: 0
  },
  {
    id: 'upd_004',
    pluginId: 'plg_ext_odin',
    name: 'Odin Inspector & Serializer',
    type: 'csharp',
    currentVersion: '2.4.0',
    targetVersion: '2.4.2',
    category: 'Tools',
    sizeMB: 12.1,
    changeType: 'hotfix',
    affectedModules: ['GameSystemsEditor', 'UIUXDataBindingEditor'],
    changelog: [
      'Fixed cyclical reference loop during polymorphism serialization',
      '40% faster reflection caching on large Mono assembly loads',
      'Custom drawer attribute enhancements for game balance tables'
    ],
    securityStatus: 'sandboxed',
    installState: 'pending',
    progress: 0
  },
  {
    id: 'upd_005',
    pluginId: 'plg_ext_gas',
    name: 'GAS Companion',
    type: 'cpp',
    currentVersion: '5.4.1',
    targetVersion: '5.4.4',
    category: 'Gameplay',
    sizeMB: 26.5,
    changeType: 'hotfix',
    affectedModules: ['GameSystemsEditor'],
    changelog: [
      'Async ability task replication optimization',
      'Added Gameplay Tag container autocomplete in visual graph',
      'Fixed attribute set clamping calculation jitter under lag'
    ],
    securityStatus: 'sandboxed',
    installState: 'pending',
    progress: 0
  },
  {
    id: 'upd_006',
    pluginId: 'plg_ext_niagara',
    name: 'Niagara Magic & Spells',
    type: 'wasm',
    currentVersion: '1.2.0',
    targetVersion: '1.3.0',
    category: 'VFX',
    sizeMB: 48.0,
    changeType: 'major_update',
    affectedModules: ['OmniVFXStudio'],
    changelog: [
      'Over 200+ new procedural volumetric spell emitter templates',
      'GPU compute particle distance field collision',
      'Sub-surface scattering light injection on particle clouds'
    ],
    securityStatus: 'verified',
    installState: 'pending',
    progress: 0
  },
  {
    id: 'upd_007',
    pluginId: 'plg_ext_weather',
    name: 'Weather System Pro',
    type: 'javascript',
    currentVersion: '2.1.0',
    targetVersion: '2.2.0',
    category: 'Rendering',
    sizeMB: 15.6,
    changeType: 'hotfix',
    affectedModules: ['MapEdit', 'OmniVFXStudio'],
    changelog: [
      'Dynamic raymarched cloud layer altitude blending',
      'Precipitation occlusion mask generation for indoor spaces',
      'Direct integration with Map & Level Editor terrain layers'
    ],
    securityStatus: 'verified',
    installState: 'pending',
    progress: 0
  },
  {
    id: 'upd_008',
    pluginId: 'plg_ext_nanite',
    name: 'Nanite Mesh Optimizer',
    type: 'cpp',
    currentVersion: '1.4.0',
    targetVersion: '1.5.2',
    category: 'Rendering',
    sizeMB: 21.0,
    changeType: 'security_patch',
    affectedModules: ['ModelingEditor', 'MapEdit'],
    changelog: [
      'Fixed buffer overrun on malformed non-manifold OBJ meshes',
      'Enhanced quadric error metric mesh simplification',
      'Cluster culling streaming speedup by 3.2x'
    ],
    securityStatus: 'audit_passed',
    installState: 'pending',
    progress: 0
  }
];

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
  const [activeTab, setActiveTab] = useState<'code' | 'manifest' | 'events' | 'bulk_updates'>('code');
  const [showSandboxDetails, setShowSandboxDetails] = useState<boolean>(false);

  // Bulk-Action & Batch Installer States
  const [detectedUpdates, setDetectedUpdates] = useState<DetectedPluginUpdate[]>(INITIAL_DETECTED_UPDATES);
  const [selectedUpdateIds, setSelectedUpdateIds] = useState<string[]>(['upd_001', 'upd_002', 'upd_003', 'upd_004']);
  const [batchInstallState, setBatchInstallState] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [batchProgress, setBatchProgress] = useState<number>(0);
  const [batchPhase, setBatchPhase] = useState<string>('');
  const [batchLogs, setBatchLogs] = useState<string[]>([]);
  const [batchFilter, setBatchFilter] = useState<'all' | 'pending' | 'security' | 'hotfix' | 'major'>('all');
  const [batchCategoryFilter, setBatchCategoryFilter] = useState<string>('All');
  const [batchSearch, setBatchSearch] = useState<string>('');
  const [isCheckingUpdates, setIsCheckingUpdates] = useState<boolean>(false);
  const [autoSandboxOnBatch, setAutoSandboxOnBatch] = useState<boolean>(true);
  const [createRollbackSnapshot, setCreateRollbackSnapshot] = useState<boolean>(true);
  const [lastBatchSnapshot, setLastBatchSnapshot] = useState<{
    date: string;
    installedCount: number;
    previousPlugins: PluginNode[];
    previousDetected: DetectedPluginUpdate[];
  } | null>(null);

  // Real-Time Marketplace Event Listener States
  const [isListenerActive, setIsListenerActive] = useState<boolean>(true);
  const [autoRefreshModules, setAutoRefreshModules] = useState<boolean>(true);
  const [recentMarketplaceEvents, setRecentMarketplaceEvents] = useState<MarketplaceUpdateEvent[]>([
    {
      id: 'evt_init_01',
      pluginId: 'plg_001',
      pluginName: 'Nexus C++ Physics Hooks',
      version: '1.0.4',
      previousVersion: '1.0.3',
      changeType: 'hotfix',
      affectedModules: ['AdvancedPhysicsEngine', 'ModelingEditor'],
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      status: 'refreshed'
    }
  ]);
  const [dependentModules, setDependentModules] = useState<Record<string, DependentModuleState>>(DEFAULT_DEPENDENT_MODULES);
  const [lastEventToast, setLastEventToast] = useState<string | null>(null);

  // Central Real-Time Marketplace Event Listener Effect
  useEffect(() => {
    if (!isListenerActive) return;

    const handleMarketplaceUpdate = (event: CustomEvent | Event) => {
      const detail = (event as CustomEvent).detail || {};
      const pluginName = detail.name || detail.pluginName || 'Marketplace Extension';
      const version = detail.version || '2.0.0';
      const pluginId = detail.pluginId || `plg_${Date.now()}`;
      const changeType = detail.changeType || 'hotfix';

      const affected = MODULE_DEPENDENCY_MAP[pluginName] || [
        'GameSystemsEditor',
        'ModelingEditor',
        'MapEdit'
      ];

      const nowStr = new Date().toLocaleTimeString();
      const newEvent: MarketplaceUpdateEvent = {
        id: `evt_${Date.now()}`,
        pluginId,
        pluginName,
        version,
        previousVersion: detail.previousVersion || '1.0.0',
        changeType,
        affectedModules: affected,
        timestamp: nowStr,
        status: autoRefreshModules ? 'resolving' : 'received'
      };

      setRecentMarketplaceEvents(prev => [newEvent, ...prev.slice(0, 24)]);
      setLastEventToast(`⚡ Real-Time Update: ${pluginName} v${version} -> Triggering auto-refresh for ${affected.length} modules!`);
      setTimeout(() => setLastEventToast(null), 4500);

      // Append real-time logs to active plugin console
      setPlugins(prev => prev.map(p => {
        const timestamp = new Date().toLocaleTimeString();
        const logs = [...p.logs];
        logs.push(
          `[${timestamp}] [REALTIME EVENT] Detected Marketplace update for "${pluginName}" v${version}.`,
          `[${timestamp}] [DEPENDENCY GRAPH] Mapping ${affected.length} dependent editor modules: [${affected.join(', ')}].`
        );
        if (autoRefreshModules) {
          logs.push(
            `[${timestamp}] [AUTO-REFRESH] Dispatched 'editor-module-refresh' signal with zero full-reload downtime.`
          );
        }
        return { ...p, logs };
      }));

      // Trigger Auto-Refresh on Dependent Modules
      if (autoRefreshModules) {
        // Set modules to 'refreshing' state
        setDependentModules(prev => {
          const next = { ...prev };
          affected.forEach(modId => {
            if (next[modId]) {
              next[modId] = { ...next[modId], status: 'refreshing' };
            }
          });
          return next;
        });

        // Simulate instantaneous sub-millisecond hot-swapping
        setTimeout(() => {
          setDependentModules(prev => {
            const next = { ...prev };
            const refreshTime = new Date().toLocaleTimeString();
            affected.forEach(modId => {
              if (next[modId]) {
                next[modId] = {
                  ...next[modId],
                  status: 'synced',
                  lastRefreshedAt: refreshTime,
                  latencyMs: Math.floor(Math.random() * 18 + 4)
                };
              }
            });
            return next;
          });

          // Dispatch standard engine hot-reload broadcast
          window.dispatchEvent(new CustomEvent('editor-module-refresh', {
            detail: {
              sourcePlugin: pluginName,
              version,
              affectedModules: affected,
              timestamp: Date.now()
            }
          }));

          // Mark event as resolved
          setRecentMarketplaceEvents(prev => prev.map(e => e.id === newEvent.id ? { ...e, status: 'refreshed' } : e));
        }, 600);
      }
    };

    // Attach DOM Custom Event listeners
    window.addEventListener('marketplace-plugin-update' as any, handleMarketplaceUpdate);
    window.addEventListener('nexus-plugin-installed' as any, handleMarketplaceUpdate);
    window.addEventListener('nexus-marketplace-sync' as any, handleMarketplaceUpdate);

    // Cross-tab broadcast channel
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('nexus_marketplace_events');
      broadcastChannel.onmessage = (msgEvent) => {
        if (msgEvent.data) {
          handleMarketplaceUpdate({ detail: msgEvent.data } as any);
        }
      };
    } catch {
      // BroadcastChannel optional fallback
    }

    return () => {
      window.removeEventListener('marketplace-plugin-update' as any, handleMarketplaceUpdate);
      window.removeEventListener('nexus-plugin-installed' as any, handleMarketplaceUpdate);
      window.removeEventListener('nexus-marketplace-sync' as any, handleMarketplaceUpdate);
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, [isListenerActive, autoRefreshModules]);

  // Manually dispatch a simulated Marketplace update event to test the real-time listener
  const triggerTestMarketplaceEvent = (samplePluginName?: string) => {
    const sampleNames = [
      'Amplify Shader Editor',
      'Odin Inspector & Serializer',
      'GAS Companion',
      'Nexus C++ Physics Hooks',
      'Niagara Magic & Spells',
      'Weather System Pro'
    ];
    const chosen = samplePluginName || sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomVersion = `v${Math.floor(Math.random() * 3 + 2)}.${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 9)}`;

    window.dispatchEvent(new CustomEvent('marketplace-plugin-update', {
      detail: {
        pluginId: `plg_ext_${Date.now()}`,
        name: chosen,
        pluginName: chosen,
        version: randomVersion,
        previousVersion: 'v1.0.0',
        changeType: Math.random() > 0.5 ? 'major_update' : 'hotfix'
      }
    }));
  };

  // Bulk-Action Selection & Execution Engine
  const toggleSelectUpdate = (id: string) => {
    setSelectedUpdateIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAllUpdates = () => {
    const available = detectedUpdates.filter(u => u.installState !== 'installed').map(u => u.id);
    setSelectedUpdateIds(available);
  };

  const deselectAllUpdates = () => {
    setSelectedUpdateIds([]);
  };

  const selectByType = (type: 'security_patch' | 'hotfix' | 'major_update') => {
    const matching = detectedUpdates
      .filter(u => u.changeType === type && u.installState !== 'installed')
      .map(u => u.id);
    setSelectedUpdateIds(matching);
  };

  const checkForMarketplaceUpdates = () => {
    setIsCheckingUpdates(true);
    const timestamp = new Date().toLocaleTimeString();
    
    setTimeout(() => {
      setIsCheckingUpdates(false);
      setLastEventToast(`🔍 Marketplace Scan Complete: Found ${detectedUpdates.length} available updates.`);
      setTimeout(() => setLastEventToast(null), 3500);

      // Append scan log to batch logs
      setBatchLogs(prev => [
        `[${timestamp}] [MARKETPLACE SCAN] Polled remote repository CDN. ${detectedUpdates.filter(u => u.installState !== 'installed').length} updates ready for batch installation.`,
        ...prev
      ]);
    }, 900);
  };

  const startBatchInstallation = () => {
    const toInstall = detectedUpdates.filter(u => selectedUpdateIds.includes(u.id) && u.installState !== 'installed');
    if (toInstall.length === 0) {
      setLastEventToast('⚠️ Please select at least one pending update to install.');
      setTimeout(() => setLastEventToast(null), 3000);
      return;
    }

    setBatchInstallState('running');
    setBatchProgress(5);
    setBatchPhase('Pre-flight validation & ABI dependency resolution');

    // Create rollback snapshot if enabled
    if (createRollbackSnapshot) {
      setLastBatchSnapshot({
        date: new Date().toLocaleTimeString(),
        installedCount: toInstall.length,
        previousPlugins: JSON.parse(JSON.stringify(plugins)),
        previousDetected: JSON.parse(JSON.stringify(detectedUpdates))
      });
    }

    const timestamp = new Date().toLocaleTimeString();
    const initialLogs = [
      `[${timestamp}] [BATCH PIPELINE START] Commencing batch installation of ${toInstall.length} extensions.`,
      `[${timestamp}] [PRE-FLIGHT] Checking ABI compatibility across [${toInstall.map(t => t.name).join(', ')}].`,
      `[${timestamp}] [SECURITY POLICY] Auto-sandbox enforcement: ${autoSandboxOnBatch ? 'ACTIVE (V8/WASM memory isolate)' : 'DISABLED'}.`
    ];
    setBatchLogs(initialLogs);

    // Step 1: Downloading & Sandboxing Verification
    setTimeout(() => {
      setBatchProgress(25);
      setBatchPhase('Downloading packages & isolating runtime sandbox memory');
      setDetectedUpdates(prev => prev.map(u => 
        selectedUpdateIds.includes(u.id) ? { ...u, installState: 'downloading', progress: 45 } : u
      ));
      setBatchLogs(prev => [
        `[${new Date().toLocaleTimeString()}] [DOWNLOAD] Fetching verified tarballs from Nexus Edge CDN...`,
        ...prev
      ]);

      // Step 2: Compiling & Linking
      setTimeout(() => {
        setBatchProgress(55);
        setBatchPhase('JIT & WASM Compilation / Security API boundary scan');
        setDetectedUpdates(prev => prev.map(u => 
          selectedUpdateIds.includes(u.id) ? { ...u, installState: 'compiling', progress: 80 } : u
        ));
        setBatchLogs(prev => [
          `[${new Date().toLocaleTimeString()}] [COMPILATION] Performing native/WASM JIT compile with AST validation.`,
          ...prev
        ]);

        // Step 3: Hot-Swapping Dependent Modules
        setTimeout(() => {
          setBatchProgress(85);
          setBatchPhase('Hot-swapping dependent editor modules with zero downtime');
          setDetectedUpdates(prev => prev.map(u => 
            selectedUpdateIds.includes(u.id) ? { ...u, installState: 'hot_swapping', progress: 95 } : u
          ));

          // Trigger updates on existing plugin nodes if they match
          setPlugins(prevPlugins => prevPlugins.map(p => {
            const matchedUpdate = toInstall.find(t => t.pluginId === p.id || t.name === p.name);
            if (matchedUpdate) {
              const now = new Date().toLocaleTimeString();
              return {
                ...p,
                version: matchedUpdate.targetVersion,
                logs: [
                  `[${now}] [BATCH INSTALL] Successfully upgraded from v${p.version} to v${matchedUpdate.targetVersion}.`,
                  `[${now}] [HOT-SWAP] Injected updated binary with 0ms downtime.`,
                  ...p.logs
                ]
              };
            }
            return p;
          }));

          // Trigger CustomEvents for all affected plugins
          toInstall.forEach(item => {
            window.dispatchEvent(new CustomEvent('marketplace-plugin-update', {
              detail: {
                pluginId: item.pluginId,
                name: item.name,
                pluginName: item.name,
                version: item.targetVersion,
                previousVersion: item.currentVersion,
                changeType: item.changeType
              }
            }));
          });

          // Step 4: Finalize Batch
          setTimeout(() => {
            setBatchProgress(100);
            setBatchPhase('Batch installation complete. All subsystems synchronized!');
            setDetectedUpdates(prev => prev.map(u => 
              selectedUpdateIds.includes(u.id) ? { ...u, installState: 'installed', progress: 100, currentVersion: u.targetVersion } : u
            ));
            setBatchInstallState('completed');
            setBatchLogs(prev => [
              `[${new Date().toLocaleTimeString()}] [BATCH SUCCESS] All ${toInstall.length} extensions installed and hot-swapped successfully!`,
              ...prev
            ]);
            setLastEventToast(`🎉 Batch Installation Complete: ${toInstall.length} extensions applied without IDE restart!`);
            setTimeout(() => setLastEventToast(null), 5000);
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  const rollbackLastBatch = () => {
    if (!lastBatchSnapshot) return;
    setPlugins(lastBatchSnapshot.previousPlugins);
    setDetectedUpdates(lastBatchSnapshot.previousDetected);
    setLastEventToast(`🔄 Rolled back batch update to snapshot from ${lastBatchSnapshot.date}`);
    setBatchInstallState('idle');
    setBatchProgress(0);
    setTimeout(() => setLastEventToast(null), 4000);
  };

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
          // Keep as is
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
      <div className="border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 gap-2">
          <div className="flex items-center gap-3">
            <Puzzle size={20} className="text-[#e3b341]" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white uppercase tracking-wider">NexusEngine Plugin Architect</h1>
                <span className="text-[10px] bg-[#3fb950]/20 text-[#3fb950] px-2 py-0.5 rounded font-mono border border-[#3fb950]/30 shadow-[0_0_10px_rgba(63,185,80,0.2)]">
                  V8 / WASM RUNTIME ACTIVE
                </span>
              </div>
            </div>
          </div>
          
          {/* Real-time listener status indicator & Test triggers */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#161b22] border border-[#30363d] rounded-lg text-xs font-mono">
              <Radio size={12} className={isListenerActive ? "text-[#3fb950] animate-pulse" : "text-[#8b949e]"} />
              <span className="text-[#8b949e] text-[11px]">Marketplace Listener:</span>
              <span className={isListenerActive ? "text-[#3fb950] font-bold text-[11px]" : "text-[#8b949e] text-[11px]"}>
                {isListenerActive ? "CONNECTED (REALTIME)" : "PAUSED"}
              </span>
            </div>

            <button
              onClick={() => triggerTestMarketplaceEvent()}
              className="px-2.5 py-1 bg-gradient-to-r from-[#bc8cff]/20 to-[#58a6ff]/20 hover:from-[#bc8cff]/30 hover:to-[#58a6ff]/30 text-white rounded text-[11px] font-bold border border-[#bc8cff]/40 flex items-center gap-1.5 transition-all shadow-sm"
              title="Dispatches a simulated Marketplace update payload to test event listening and auto-refreshing"
            >
              <Zap size={12} className="text-[#e3b341]" />
              <span>Simulate Marketplace Event</span>
            </button>

            <div className="h-4 w-px bg-[#30363d] mx-1" />

            <button 
              id="btn-create-js"
              onClick={() => handleCreate('javascript')} 
              className="px-2.5 py-1 bg-[#21262d] text-white rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d] flex items-center gap-1 transition-colors"
            >
              <Plus size={11}/> JS/TS
            </button>
            <button 
              id="btn-create-cpp"
              onClick={() => handleCreate('cpp')} 
              className="px-2.5 py-1 bg-[#21262d] text-white rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d] flex items-center gap-1 transition-colors"
            >
              <Plus size={11}/> C++ (WASM)
            </button>
            <button 
              id="btn-create-csharp"
              onClick={() => handleCreate('csharp')} 
              className="px-2.5 py-1 bg-[#21262d] text-white rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d] flex items-center gap-1 transition-colors"
            >
              <Plus size={11}/> C# (Mono)
            </button>
          </div>
        </div>

        {/* Real-time Toast notification */}
        {lastEventToast && (
          <div className="px-4 py-1.5 bg-[#58a6ff]/15 border-t border-[#58a6ff]/30 text-[#79c0ff] text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity size={13} className="text-[#58a6ff] animate-spin" />
              <span>{lastEventToast}</span>
            </div>
            <span className="text-[10px] text-[#8b949e] font-mono">Zero-Downtime Hot Swap</span>
          </div>
        )}
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

          {/* Quick Real-Time Settings in Sidebar */}
          <div className="p-3 border-t border-[#30363d] bg-[#161b22]/70 space-y-2">
            <div className="text-[10px] uppercase font-bold text-[#8b949e] flex items-center justify-between">
              <span>Auto-Refresh Pipeline</span>
              <Activity size={12} className="text-[#3fb950]" />
            </div>
            <label className="flex items-center justify-between text-xs text-[#c9d1d9] cursor-pointer">
              <span className="text-[11px]">Auto-Refresh Modules</span>
              <input
                type="checkbox"
                checked={autoRefreshModules}
                onChange={e => setAutoRefreshModules(e.target.checked)}
                className="rounded bg-[#0d1117] border-[#30363d] text-[#58a6ff] focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between text-xs text-[#c9d1d9] cursor-pointer">
              <span className="text-[11px]">Event Listener Active</span>
              <input
                type="checkbox"
                checked={isListenerActive}
                onChange={e => setIsListenerActive(e.target.checked)}
                className="rounded bg-[#0d1117] border-[#30363d] text-[#3fb950] focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Editor & Live Event Stream Area */}
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

            {/* Code / Manifest / Real-time Events / Bulk Updates Tab Bar */}
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
                <button 
                  id="tab-events"
                  onClick={() => setActiveTab('events')}
                  className={`px-4 py-1 text-[11px] font-bold border-r border-[#30363d] transition-colors flex items-center gap-1.5 ${
                    activeTab === 'events' 
                      ? 'bg-[#161b22] text-[#7ee787] border-t-2 border-t-[#7ee787]' 
                      : 'text-[#8b949e] hover:text-[#7ee787] hover:bg-[#161b22] border-t-2 border-t-transparent'
                  }`}
                >
                  <Radio size={12} className="text-[#3fb950] animate-pulse" />
                  <span>Marketplace Event Hub ({recentMarketplaceEvents.length})</span>
                </button>
                <button 
                  id="tab-bulk-updates"
                  onClick={() => setActiveTab('bulk_updates')}
                  className={`px-4 py-1 text-[11px] font-bold border-r border-[#30363d] transition-colors flex items-center gap-1.5 ${
                    activeTab === 'bulk_updates' 
                      ? 'bg-[#161b22] text-[#58a6ff] border-t-2 border-t-[#58a6ff]' 
                      : 'text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#161b22] border-t-2 border-t-transparent'
                  }`}
                >
                  <DownloadCloud size={12} className={detectedUpdates.some(u => u.installState !== 'installed') ? "text-[#58a6ff] animate-pulse" : "text-[#8b949e]"} />
                  <span>Bulk Updates ({detectedUpdates.filter(u => u.installState !== 'installed').length})</span>
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                {selectedUpdateIds.length > 0 && (
                  <button
                    onClick={() => setActiveTab('bulk_updates')}
                    className="text-[#58a6ff] flex items-center gap-1 bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 px-2 py-0.5 rounded border border-[#58a6ff]/30 transition-colors"
                  >
                    <Zap size={10} className="text-[#58a6ff]" />
                    <span>{selectedUpdateIds.length} Selected for Batch</span>
                  </button>
                )}
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

            {/* Tab Views */}
            {activeTab === 'bulk_updates' ? (
              /* Dedicated Bulk Updates & Batch Installer Hub */
              <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
                {/* Header Metrics & Quick Action Strip */}
                <div className="p-4 bg-[#161b22] border-b border-[#30363d] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 rounded-xl bg-[#1f242c] border border-[#30363d] text-[#58a6ff]">
                      <DownloadCloud size={22} className="animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-sm font-bold text-white tracking-wide">Marketplace Bulk-Action & Batch Installer</h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40">
                          Zero-Downtime Hot-Swap
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8b949e] mt-0.5">
                        Select multiple detected marketplace updates, verify ABI dependencies, and apply batch hot-swaps seamlessly across all editor modules.
                      </p>
                    </div>
                  </div>

                  {/* Batch Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      id="btn-check-updates"
                      onClick={checkForMarketplaceUpdates}
                      disabled={isCheckingUpdates || batchInstallState === 'running'}
                      className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-semibold rounded-lg border border-[#30363d] flex items-center space-x-1.5 transition-all disabled:opacity-50"
                    >
                      <RefreshCw size={13} className={isCheckingUpdates ? 'animate-spin text-[#58a6ff]' : ''} />
                      <span>{isCheckingUpdates ? 'Scanning CDN...' : 'Check for Updates'}</span>
                    </button>

                    {lastBatchSnapshot && (
                      <button
                        id="btn-rollback-batch"
                        onClick={rollbackLastBatch}
                        disabled={batchInstallState === 'running'}
                        className="px-3 py-1.5 bg-[#21262d] hover:bg-[#da3633]/20 hover:border-[#da3633]/50 text-[#f85149] text-xs font-semibold rounded-lg border border-[#30363d] flex items-center space-x-1.5 transition-all"
                      >
                        <RotateCcw size={13} />
                        <span>Rollback Last Batch</span>
                      </button>
                    )}

                    <button
                      id="btn-batch-install"
                      onClick={startBatchInstallation}
                      disabled={selectedUpdateIds.length === 0 || batchInstallState === 'running'}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg border flex items-center space-x-2 shadow-lg transition-all ${
                        selectedUpdateIds.length > 0 && batchInstallState !== 'running'
                          ? 'bg-gradient-to-r from-[#1f6feb] to-[#238636] hover:from-[#388bfd] hover:to-[#2ea043] text-white border-[#58a6ff]/50 shadow-[#1f6feb]/20'
                          : 'bg-[#21262d] text-[#8b949e] border-[#30363d] cursor-not-allowed opacity-60'
                      }`}
                    >
                      {batchInstallState === 'running' ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-white" />
                          <span>Installing Batch ({batchProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Zap size={14} className="text-[#7ee787]" />
                          <span>Apply Batch Installation ({selectedUpdateIds.length})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Metrics Stats Banner */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-[#0d1117] border-b border-[#30363d]">
                  <div className="p-2.5 rounded-lg bg-[#161b22] border border-[#30363d]/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#8b949e]">Detected Updates</div>
                      <div className="text-sm font-bold text-white mt-0.5">{detectedUpdates.length} Extensions</div>
                    </div>
                    <Package size={16} className="text-[#58a6ff]" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#161b22] border border-[#30363d]/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#8b949e]">Selected for Batch</div>
                      <div className="text-sm font-bold text-[#58a6ff] mt-0.5">{selectedUpdateIds.length} Selected</div>
                    </div>
                    <CheckSquare size={16} className="text-[#58a6ff]" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#161b22] border border-[#30363d]/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#8b949e]">Batch Payload Size</div>
                      <div className="text-sm font-bold text-[#e3b341] mt-0.5">
                        {detectedUpdates
                          .filter(u => selectedUpdateIds.includes(u.id))
                          .reduce((acc, curr) => acc + curr.sizeMB, 0)
                          .toFixed(1)} MB
                      </div>
                    </div>
                    <HardDrive size={16} className="text-[#e3b341]" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#161b22] border border-[#30363d]/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#8b949e]">Impacted Subsystems</div>
                      <div className="text-sm font-bold text-[#7ee787] mt-0.5">
                        {Array.from(new Set(
                          detectedUpdates
                            .filter(u => selectedUpdateIds.includes(u.id))
                            .flatMap(u => u.affectedModules)
                        )).length} Core Modules
                      </div>
                    </div>
                    <Layers size={16} className="text-[#7ee787]" />
                  </div>
                </div>

                {/* Live Batch Execution Console (if running or completed) */}
                {batchInstallState !== 'idle' && (
                  <div className="p-4 bg-[#161b22]/90 border-b border-[#30363d] space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {batchInstallState === 'running' ? (
                          <Loader2 size={16} className="animate-spin text-[#58a6ff]" />
                        ) : batchInstallState === 'completed' ? (
                          <CheckCircle2 size={16} className="text-[#3fb950]" />
                        ) : (
                          <AlertTriangle size={16} className="text-[#da3633]" />
                        )}
                        <span className="text-xs font-bold text-white">
                          {batchPhase || 'Executing Batch Pipeline...'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs font-mono">
                        <span className="text-[#58a6ff] font-bold">{batchProgress}%</span>
                        {batchInstallState === 'completed' && (
                          <button
                            onClick={() => setBatchInstallState('idle')}
                            className="text-[#8b949e] hover:text-white text-[11px] underline"
                          >
                            Dismiss Console
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          batchInstallState === 'completed'
                            ? 'bg-[#238636]'
                            : 'bg-gradient-to-r from-[#1f6feb] via-[#58a6ff] to-[#7ee787]'
                        }`}
                        style={{ width: `${batchProgress}%` }}
                      />
                    </div>

                    {/* Log Terminal Stream */}
                    <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] font-mono text-[11px] max-h-28 overflow-y-auto space-y-1 scrollbar-thin text-[#8b949e]">
                      {batchLogs.map((log, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <span className="text-[#58a6ff] select-none">&gt;</span>
                          <span className={log.includes('SUCCESS') ? 'text-[#7ee787]' : log.includes('SECURITY') ? 'text-[#e3b341]' : 'text-[#c9d1d9]'}>
                            {log}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filter and Multi-Selection Toolbar */}
                <div className="p-3 bg-[#161b22] border-b border-[#30363d] flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Left: Quick Multi-Select Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#8b949e] mr-1 flex items-center gap-1">
                      <Filter size={12} /> Select:
                    </span>
                    <button
                      id="btn-select-all"
                      onClick={selectAllUpdates}
                      className="px-2.5 py-1 rounded-md bg-[#21262d] hover:bg-[#30363d] text-white text-[11px] font-medium border border-[#30363d] transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      id="btn-deselect-all"
                      onClick={deselectAllUpdates}
                      className="px-2.5 py-1 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white text-[11px] font-medium border border-[#30363d] transition-colors"
                    >
                      Deselect All
                    </button>
                    <button
                      id="btn-select-security"
                      onClick={() => selectByType('security_patch')}
                      className="px-2.5 py-1 rounded-md bg-[#da3633]/15 hover:bg-[#da3633]/25 text-[#f85149] text-[11px] font-medium border border-[#da3633]/30 transition-colors flex items-center gap-1"
                    >
                      <ShieldAlert size={11} /> Security Patches ({detectedUpdates.filter(u => u.changeType === 'security_patch').length})
                    </button>
                    <button
                      id="btn-select-hotfix"
                      onClick={() => selectByType('hotfix')}
                      className="px-2.5 py-1 rounded-md bg-[#d29922]/15 hover:bg-[#d29922]/25 text-[#e3b341] text-[11px] font-medium border border-[#d29922]/30 transition-colors flex items-center gap-1"
                    >
                      <Flame size={11} /> Hotfixes ({detectedUpdates.filter(u => u.changeType === 'hotfix').length})
                    </button>
                    <button
                      id="btn-select-major"
                      onClick={() => selectByType('major_update')}
                      className="px-2.5 py-1 rounded-md bg-[#bc8cff]/15 hover:bg-[#bc8cff]/25 text-[#d2a8ff] text-[11px] font-medium border border-[#bc8cff]/30 transition-colors flex items-center gap-1"
                    >
                      <Sparkles size={11} /> Major Releases ({detectedUpdates.filter(u => u.changeType === 'major_update').length})
                    </button>
                  </div>

                  {/* Right: Search & Category Filter */}
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search size={12} className="absolute left-2.5 top-2 text-[#8b949e]" />
                      <input
                        type="text"
                        placeholder="Filter updates..."
                        value={batchSearch}
                        onChange={e => setBatchSearch(e.target.value)}
                        className="pl-7 pr-3 py-1 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] w-40 sm:w-48 font-sans"
                      />
                    </div>

                    <select
                      value={batchCategoryFilter}
                      onChange={e => setBatchCategoryFilter(e.target.value)}
                      className="px-2.5 py-1 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
                    >
                      <option value="All">All Categories</option>
                      <option value="Physics">Physics</option>
                      <option value="Rendering">Rendering</option>
                      <option value="Tools">Tools</option>
                      <option value="Gameplay">Gameplay</option>
                      <option value="VFX">VFX</option>
                    </select>
                  </div>
                </div>

                {/* Configuration Strip */}
                <div className="px-4 py-2 bg-[#0d1117] border-b border-[#30363d] flex flex-wrap items-center justify-between text-[11px] text-[#8b949e]">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={autoSandboxOnBatch}
                        onChange={e => setAutoSandboxOnBatch(e.target.checked)}
                        className="rounded bg-[#161b22] border-[#30363d] text-[#58a6ff] focus:ring-0"
                      />
                      <span>Auto-enforce Sandbox Isolation during batch install</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={createRollbackSnapshot}
                        onChange={e => setCreateRollbackSnapshot(e.target.checked)}
                        className="rounded bg-[#161b22] border-[#30363d] text-[#58a6ff] focus:ring-0"
                      />
                      <span>Create Snapshot for 1-Click Rollback</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-1 text-[#3fb950]">
                    <ShieldCheck size={13} />
                    <span>Deterministic ABI Verification Active</span>
                  </div>
                </div>

                {/* Detected Updates Cards Grid */}
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 xl:grid-cols-2 gap-3.5 scrollbar-thin">
                  {detectedUpdates
                    .filter(u => {
                      if (batchCategoryFilter !== 'All' && u.category !== batchCategoryFilter) return false;
                      if (batchSearch) {
                        const q = batchSearch.toLowerCase();
                        return (
                          u.name.toLowerCase().includes(q) ||
                          u.category.toLowerCase().includes(q) ||
                          u.affectedModules.some(m => m.toLowerCase().includes(q)) ||
                          u.changelog.some(c => c.toLowerCase().includes(q))
                        );
                      }
                      return true;
                    })
                    .map(update => {
                      const isSelected = selectedUpdateIds.includes(update.id);
                      const isInstalled = update.installState === 'installed';
                      const isProcessing = ['downloading', 'compiling', 'hot_swapping'].includes(update.installState);

                      return (
                        <div
                          key={update.id}
                          className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                            isInstalled
                              ? 'bg-[#161b22]/40 border-[#238636]/40 opacity-90'
                              : isSelected
                              ? 'bg-[#161b22] border-[#58a6ff]/70 shadow-md shadow-[#1f6feb]/10 ring-1 ring-[#58a6ff]/30'
                              : 'bg-[#161b22]/70 border-[#30363d] hover:border-[#58a6ff]/40'
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Card Header with Checkbox & Badges */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <button
                                  type="button"
                                  onClick={() => !isInstalled && toggleSelectUpdate(update.id)}
                                  disabled={isInstalled || batchInstallState === 'running'}
                                  className={`mt-0.5 transition-colors ${
                                    isInstalled
                                      ? 'text-[#238636] cursor-default'
                                      : isSelected
                                      ? 'text-[#58a6ff]'
                                      : 'text-[#8b949e] hover:text-white'
                                  }`}
                                >
                                  {isInstalled ? (
                                    <CheckCheck size={18} />
                                  ) : isSelected ? (
                                    <CheckSquare size={18} />
                                  ) : (
                                    <Square size={18} />
                                  )}
                                </button>

                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="text-xs font-bold text-white tracking-wide">{update.name}</h3>
                                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                                      update.type === 'cpp'
                                        ? 'bg-[#f0883e]/20 text-[#f0883e] border border-[#f0883e]/40'
                                        : update.type === 'wasm'
                                        ? 'bg-[#bc8cff]/20 text-[#d2a8ff] border border-[#bc8cff]/40'
                                        : update.type === 'csharp'
                                        ? 'bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40'
                                        : 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/40'
                                    }`}>
                                      {update.type}
                                    </span>
                                    <span className="text-[10px] font-mono text-[#8b949e]">{update.sizeMB} MB</span>
                                  </div>

                                  {/* Version Upgrade Pill */}
                                  <div className="flex items-center space-x-1.5 text-[11px] font-mono mt-1">
                                    <span className="text-[#8b949e]">v{update.currentVersion}</span>
                                    <ArrowRight size={11} className="text-[#58a6ff]" />
                                    <span className="text-[#7ee787] font-bold">v{update.targetVersion}</span>
                                    
                                    <span className={`ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                                      update.changeType === 'security_patch'
                                        ? 'bg-[#da3633]/20 text-[#f85149] border border-[#da3633]/40'
                                        : update.changeType === 'hotfix'
                                        ? 'bg-[#d29922]/20 text-[#e3b341] border border-[#d29922]/40'
                                        : 'bg-[#bc8cff]/20 text-[#d2a8ff] border border-[#bc8cff]/40'
                                    }`}>
                                      {update.changeType.replace('_', ' ')}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Live Status Pill */}
                              <div>
                                {isInstalled ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40 flex items-center gap-1">
                                    <CheckCircle2 size={10} /> Installed & Synced
                                  </span>
                                ) : isProcessing ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40 flex items-center gap-1">
                                    <Loader2 size={10} className="animate-spin" /> {update.installState} ({update.progress}%)
                                  </span>
                                ) : isSelected ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/30">
                                    Queued in Batch
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#21262d] text-[#8b949e]">
                                    Available
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Changelog Highlights */}
                            <div className="bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d]/60 space-y-1">
                              <div className="text-[10px] font-bold text-[#8b949e] uppercase font-mono tracking-wider">
                                Patch Notes & Changelog:
                              </div>
                              <ul className="space-y-0.5 text-[11px] text-[#c9d1d9] pl-3 list-disc marker:text-[#58a6ff]">
                                {update.changelog.map((line, idx) => (
                                  <li key={idx} className="leading-tight">{line}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Affected Modules & Security Tag */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#30363d]/40 text-[10px] font-mono">
                              <div className="flex items-center space-x-1.5">
                                <span className="text-[#8b949e]">Auto-Refreshes:</span>
                                <div className="flex flex-wrap gap-1">
                                  {update.affectedModules.map(mod => (
                                    <span key={mod} className="px-1.5 py-0.2 rounded bg-[#238636]/15 text-[#7ee787] border border-[#238636]/30">
                                      {mod}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <span className="text-[#3fb950] flex items-center gap-1">
                                <ShieldCheck size={11} /> {update.securityStatus === 'audit_passed' ? 'ABI Audit Passed' : 'VFS Jailed'}
                              </span>
                            </div>
                          </div>

                          {/* Card Footer Single Action */}
                          {!isInstalled && (
                            <div className="mt-3 pt-2 border-t border-[#30363d]/50 flex items-center justify-between">
                              <span className="text-[10px] text-[#8b949e]">
                                {isSelected ? 'Included in Batch Selection' : 'Click checkbox to add to batch'}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedUpdateIds([update.id]);
                                  setTimeout(() => startBatchInstallation(), 50);
                                }}
                                disabled={batchInstallState === 'running'}
                                className="text-[11px] font-semibold text-[#58a6ff] hover:text-[#79c0ff] hover:underline flex items-center gap-1"
                              >
                                <span>Install Individually</span>
                                <ArrowUpRight size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : activeTab === 'events' ? (
              /* Dedicated Real-Time Marketplace Event & Dependency Hub View */
              <div className="flex-1 flex overflow-hidden bg-[#0d1117]">
                {/* Left: Live Event Stream Feed */}
                <div className="flex-1 border-r border-[#30363d] flex flex-col overflow-hidden">
                  <div className="p-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Radio size={14} className="text-[#3fb950] animate-pulse" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Live Marketplace Event Stream
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setActiveTab('bulk_updates')}
                        className="px-2.5 py-1 bg-[#1f6feb]/20 hover:bg-[#1f6feb]/30 text-[#58a6ff] border border-[#58a6ff]/40 rounded text-[10px] font-bold flex items-center space-x-1 transition-colors"
                      >
                        <Zap size={11} className="text-[#7ee787]" />
                        <span>Batch Action Center ({detectedUpdates.filter(u => u.installState !== 'installed').length})</span>
                      </button>
                      <span className="text-[10px] text-[#8b949e] font-mono">
                        {recentMarketplaceEvents.length} Events Logged
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                    {recentMarketplaceEvents.map(evt => (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff]/50 transition-all flex flex-col space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-white">{evt.pluginName}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/40">
                              {evt.version}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-[#21262d] text-[#8b949e]">
                              {evt.changeType}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#8b949e]">{evt.timestamp}</span>
                        </div>

                        <div className="text-[11px] text-[#c9d1d9] flex items-center space-x-2">
                          <span className="text-[#8b949e]">Affected Modules:</span>
                          <div className="flex flex-wrap gap-1">
                            {evt.affectedModules.map(mod => (
                              <span key={mod} className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40">
                                {mod}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#30363d]/60 text-[10px] font-mono text-[#8b949e]">
                          <span className="flex items-center gap-1 text-[#3fb950]">
                            <CheckCircle2 size={11} /> Auto-Refreshed without Editor Restart
                          </span>
                          <button
                            onClick={() => triggerTestMarketplaceEvent(evt.pluginName)}
                            className="text-[#58a6ff] hover:underline"
                          >
                            Re-dispatch Event
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Dependent Editor Modules Live Status */}
                <div className="w-96 flex flex-col bg-[#161b22]/50 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                  <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-[#30363d]">
                    <Layers size={14} className="text-[#bc8cff]" />
                    <span>Dependent Editor Modules</span>
                  </div>

                  <div className="space-y-2">
                    {Object.values(dependentModules).map(mod => {
                      const isRefreshing = mod.status === 'refreshing';
                      const isSynced = mod.status === 'synced';
                      return (
                        <div
                          key={mod.id}
                          className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-xs text-white">{mod.name}</div>
                            <div className="text-[10px] font-mono text-[#8b949e] mt-0.5">
                              ID: {mod.id}
                            </div>
                            {mod.lastRefreshedAt && (
                              <div className="text-[9px] font-mono text-[#7ee787] mt-1">
                                Last Synced: {mod.lastRefreshedAt} ({mod.latencyMs || 8}ms)
                              </div>
                            )}
                          </div>

                          <div>
                            {isRefreshing ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#d29922]/20 text-[#e3b341] border border-[#d29922]/40 flex items-center gap-1">
                                <Loader2 size={10} className="animate-spin" /> Hot-Reloading
                              </span>
                            ) : isSynced ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#238636]/20 text-[#7ee787] border border-[#238636]/40 flex items-center gap-1">
                                <CheckCircle2 size={10} /> Synced
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#21262d] text-[#8b949e]">
                                Ready
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Code / Manifest Split Editor and Logs */
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
                        const isRealtime = log.includes('REALTIME') || log.includes('DEPENDENCY') || log.includes('AUTO-REFRESH');
                        const isError = log.includes('Error') || log.includes('BLOCKED');
                        
                        let textColor = 'text-[#3fb950]';
                        if (isError) textColor = 'text-[#f85149] font-bold';
                        else if (isWarn) textColor = 'text-[#e3b341] font-bold';
                        else if (isRealtime) textColor = 'text-[#bc8cff] font-semibold';
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
            )}
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
