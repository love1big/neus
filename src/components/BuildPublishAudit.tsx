import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Wrench,
  Package,
  Layers,
  Cpu,
  HardDrive,
  Gauge,
  Terminal,
  Play,
  RotateCcw,
  Settings2,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Zap,
  Sliders,
  FileCode2,
  Box,
  Flame,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  Upload,
  Globe,
  Monitor,
  Server,
  Smartphone,
  Eye,
  Info,
  Sparkles,
  Database,
  Lock,
  Workflow,
  Clock,
  Radio,
  BarChart3,
  FileText
} from 'lucide-react';
import { AuditPdfExportModal } from './AuditPdfExportModal';
import { generateAuditPdfReport } from '../utils/auditPdfGenerator';

export interface AuditIssue {
  id: string;
  category: 'dependency' | 'memory' | 'performance' | 'compiler' | 'security';
  severity: 'critical' | 'warning' | 'info' | 'passed';
  title: string;
  subsystem: string;
  description: string;
  impact: string;
  recommendation: string;
  autoFixable: boolean;
  fixed?: boolean;
  codeSnippet?: string;
  fileLocation?: string;
  sourceTool: 'BuildMonitor' | 'CompilerTool' | 'AssetRegistry' | 'ProfilerEngine';
}

export interface PlatformProfile {
  id: string;
  name: string;
  icon: string;
  vramBudgetMB: number;
  ramBudgetMB: number;
  packageTargetMB: number;
  maxDrawCalls: number;
  maxShaderALU: number;
  targetFPS: number;
  compilerBackend: string;
  recommendedFlags: string[];
}

export interface AuditStep {
  id: string;
  name: string;
  shortName: string;
  category: 'compiler' | 'dependency' | 'memory' | 'performance';
  sourceTool: string;
  durationMs: number;
  status: 'idle' | 'running' | 'completed' | 'warning' | 'critical';
  details: string;
  itemCount: string;
  icon: React.ReactNode;
}

const PLATFORM_PROFILES: Record<string, PlatformProfile> = {
  'web_gpu': {
    id: 'web_gpu',
    name: 'Web (WASM / WebGPU)',
    icon: 'Globe',
    vramBudgetMB: 1536,
    ramBudgetMB: 2048,
    packageTargetMB: 150,
    maxDrawCalls: 1200,
    maxShaderALU: 320,
    targetFPS: 60,
    compilerBackend: 'Emscripten / clang 18 (wasm32-unknown-emscripten)',
    recommendedFlags: ['-O3', '-flto', '-sALLOW_MEMORY_GROWTH=1', '-sUSE_WEBGPU=1', '--closure 1']
  },
  'win_dx12': {
    id: 'win_dx12',
    name: 'Windows PC (DirectX 12 / Vulkan)',
    icon: 'Monitor',
    vramBudgetMB: 8192,
    ramBudgetMB: 16384,
    packageTargetMB: 35000,
    maxDrawCalls: 8500,
    maxShaderALU: 2400,
    targetFPS: 144,
    compilerBackend: 'MSVC 19.40 / Clang-cl (x86_64-pc-windows-msvc)',
    recommendedFlags: ['/O2', '/GL', '/arch:AVX2', '/Zi', '/Gy', '/DYNAMICBASE']
  },
  'linux_vulkan': {
    id: 'linux_vulkan',
    name: 'Linux / SteamOS (Vulkan)',
    icon: 'Server',
    vramBudgetMB: 6144,
    ramBudgetMB: 16384,
    packageTargetMB: 32000,
    maxDrawCalls: 7500,
    maxShaderALU: 2000,
    targetFPS: 90,
    compilerBackend: 'GCC 14.1 / Clang 18 (x86_64-unknown-linux-gnu)',
    recommendedFlags: ['-O3', '-flto=auto', '-mavx2', '-fno-rtti', '-Wl,--gc-sections']
  },
  'mobile_vulkan': {
    id: 'mobile_vulkan',
    name: 'Mobile (Android Vulkan / iOS Metal)',
    icon: 'Smartphone',
    vramBudgetMB: 2048,
    ramBudgetMB: 4096,
    packageTargetMB: 800,
    maxDrawCalls: 1800,
    maxShaderALU: 450,
    targetFPS: 60,
    compilerBackend: 'LLVM 18 / Android NDK r26b / Xcode Clang',
    recommendedFlags: ['-Oz', '-flto', '-fvisibility=hidden', '-mfloat-abi=hard']
  }
};

const INITIAL_AUDIT_ISSUES: AuditIssue[] = [
  {
    id: 'iss_001',
    category: 'compiler',
    severity: 'critical',
    title: 'Link-Time Optimization (LTO) & Whole Program Optimization Disabled',
    subsystem: 'Compiler Pipeline / GCC-LLVM Engine',
    description: 'The shipping configuration is missing `-flto=auto` and whole-program cross-module inlining. This inflates binary footprint by ~22% and causes 14% higher frame time latency on critical loops.',
    impact: 'Binary bloat (+42 MB), slower CPU physics solvers, missed vectorization opportunities.',
    recommendation: 'Enable `-flto=auto` in GCC/LLVM flags and turn on whole-program optimization.',
    autoFixable: true,
    codeSnippet: 'TARGET_FLAGS += -flto=auto -fuse-linker-plugin -Wl,--gc-sections',
    fileLocation: '/build/flags/shipping_rules.mk:48',
    sourceTool: 'CompilerTool'
  },
  {
    id: 'iss_002',
    category: 'memory',
    severity: 'critical',
    title: 'Uncompressed 4K Normal Maps Exceeding Target VRAM Budget',
    subsystem: 'Asset Registry & Texture Streamer',
    description: 'Detected 18 uncompressed RGBA8 4096x4096 normal textures consuming 1.15 GB of raw unstreamed VRAM, violating the current target platform budget.',
    impact: 'Severe out-of-memory hazard on devices with ≤4GB VRAM. High texture streaming stalls.',
    recommendation: 'Transcode to BC7 (Desktop) or ASTC 6x6 (Web/Mobile) with mipmap pyramid generation.',
    autoFixable: true,
    fileLocation: '/assets/textures/characters/boss_golem/T_Golem_Normals_4k.png',
    sourceTool: 'AssetRegistry'
  },
  {
    id: 'iss_003',
    category: 'dependency',
    severity: 'warning',
    title: 'Cyclic Module Dependency in Gameplay Ability & UI State Graph',
    subsystem: 'Dependency Graph / Plugin Architecture',
    description: 'Cyclic reference detected between `GameSystemsEditor` -> `UIUXDataBindingEditor` -> `GameplayAbilitySystem`. Static linking may cause undefined symbol initialization order.',
    impact: 'Potential race conditions during game boot or null pointer exception on static init.',
    recommendation: 'Decouple state notifications using the decoupled OmniMessageBus event dispatcher.',
    autoFixable: false,
    fileLocation: '/src/systems/ability_ui_bridge.cpp:112',
    sourceTool: 'BuildMonitor'
  },
  {
    id: 'iss_004',
    category: 'performance',
    severity: 'warning',
    title: 'Volumetric Cloud Raymarching Shader Exceeds ALU Instruction Ceiling',
    subsystem: 'Shader Compiler / VisualShaderGraph',
    description: 'Post-process raymarching loop in `VolumetricAtmosphere_Ultra.hlsl` contains 680 dynamic iterations with 1,840 ALU instructions per fragment.',
    impact: 'GPU frametime cost ~11.8ms at 1440p resolution. Will cause severe framerate drop below 60 FPS.',
    recommendation: 'Introduce temporal reprojection, dynamic step size scaling, and half-res raymarch buffer.',
    autoFixable: true,
    codeSnippet: '#define RAYMARCH_STEPS 64 // Clamped down from 256 for target tier',
    fileLocation: '/shaders/atmosphere/VolumetricAtmosphere_Ultra.hlsl:89',
    sourceTool: 'CompilerTool'
  },
  {
    id: 'iss_005',
    category: 'memory',
    severity: 'warning',
    title: 'Orphaned LOD0 Meshes without Simplified LOD Chains',
    subsystem: 'Geometry Pipeline / Nanite Optimizer',
    description: '34 high-poly background environmental props have >450,000 triangles without generated LOD1/LOD2/LOD3 stages.',
    impact: 'Overdraw geometry bottleneck and heavy vertex shader cache thrashing in open areas.',
    recommendation: 'Run automatic Quadric Mesh Decimation in Nanite Optimizer to generate 3 LOD levels.',
    autoFixable: true,
    fileLocation: '/assets/models/ruins/SM_Castle_Gate_Arch.fbx',
    sourceTool: 'AssetRegistry'
  },
  {
    id: 'iss_006',
    category: 'dependency',
    severity: 'info',
    title: 'Marketplace Plugin Version Drift with Host Core ABI',
    subsystem: 'NexusPluginArchitect Integration',
    description: 'Plugin `Amplify Shader Editor` has a minor ABI version diff (v1.9.5 vs host v2.0.1). ABI compatibility audit passed with 0 breaking symbols.',
    impact: 'Safe to build, but recommended to batch update prior to final release seal.',
    recommendation: 'Apply 1-click batch update from Nexus Plugin Architect.',
    autoFixable: true,
    fileLocation: '/plugins/amplify_shader/manifest.json',
    sourceTool: 'BuildMonitor'
  },
  {
    id: 'iss_007',
    category: 'compiler',
    severity: 'passed',
    title: 'Dead-Code Stripping and Symbol Visibility Hidden',
    subsystem: 'Linker & Binary Shrinker',
    description: '`-Wl,--gc-sections` and `-fvisibility=hidden` properly configured. Unreferenced functions are safely stripped.',
    impact: 'Optimal binary footprint hygiene.',
    recommendation: 'No action required.',
    autoFixable: false,
    fileLocation: '/build/config/toolchain.ninja',
    sourceTool: 'CompilerTool'
  },
  {
    id: 'iss_008',
    category: 'performance',
    severity: 'passed',
    title: 'Deterministic Physics Collision Matrix Broadphase Budget',
    subsystem: 'ChaosPhysics Lab',
    description: 'Broadphase BVH collision matrix verified. Dynamic collision pairs capped at <2,500 pairs/frame.',
    impact: 'Physics tick duration verified at <1.8ms.',
    recommendation: 'No action required.',
    autoFixable: false,
    fileLocation: '/src/physics/collision_matrix.cfg',
    sourceTool: 'ProfilerEngine'
  }
];

export default function BuildPublishAudit() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('win_dx12');
  const [activeTab, setActiveTab] = useState<'audit' | 'dependencies' | 'memory' | 'compiler' | 'terminal'>('audit');
  const [issues, setIssues] = useState<AuditIssue[]>(INITIAL_AUDIT_ISSUES);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditProgress, setAuditProgress] = useState<number>(100);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>('iss_001');
  const [buildState, setBuildState] = useState<'idle' | 'pre_checking' | 'building' | 'succeeded' | 'failed'>('idle');
  const [justCompletedStep, setJustCompletedStep] = useState<string | null>(null);
  const [recentlyFixedId, setRecentlyFixedId] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Discrete Audit Steps definition
  const [auditSteps, setAuditSteps] = useState<AuditStep[]>([
    {
      id: 'step_compiler',
      name: 'Compiler & Toolchain ABI Sweep',
      shortName: 'Compiler & ABI',
      category: 'compiler',
      sourceTool: 'CompilerTool (LLVM/MSVC)',
      durationMs: 380,
      status: 'completed',
      details: 'Evaluates LTO, SIMD flags, dead-code elimination, and toolchain ABI compatibility.',
      itemCount: '48 flags / 0 syntax errors',
      icon: <Wrench size={16} />
    },
    {
      id: 'step_dependencies',
      name: 'Dependency Graph & Topology Sweep',
      shortName: 'Dependency Graph',
      category: 'dependency',
      sourceTool: 'BuildMonitor (CI Topology)',
      durationMs: 460,
      status: 'completed',
      details: 'Detects circular references between modules, static linkage locks, and plugin drift.',
      itemCount: '56 modules / 1 cycle flagged',
      icon: <Workflow size={16} />
    },
    {
      id: 'step_memory',
      name: 'Memory & VRAM Allocation Sweep',
      shortName: 'Memory & VRAM',
      category: 'memory',
      sourceTool: 'AssetRegistry & Streamer',
      durationMs: 520,
      status: 'completed',
      details: 'Compares cooked texture mipmaps, soundbanks, and vertex buffers against platform budgets.',
      itemCount: '14,235 assets / 2.4GB VRAM',
      icon: <HardDrive size={16} />
    },
    {
      id: 'step_performance',
      name: 'Performance & Shader ALU Profiler',
      shortName: 'Performance & Shader',
      category: 'performance',
      sourceTool: 'ProfilerEngine & Shaders',
      durationMs: 410,
      status: 'completed',
      details: 'Profiles draw-call ceilings, raymarching loop counts, and physics tick determinism.',
      itemCount: '340 shaders / 8.5k draw calls',
      icon: <Cpu size={16} />
    }
  ]);

  const [buildLogs, setBuildLogs] = useState<string[]>([
    '[00:00:00] [AUDIT RUNNER] Pre-flight audit daemon initialized.',
    '[00:00:01] [LINKAGE] Integrated BuildMonitor CI node and CompilerTool LLVM flag analyzer.',
    '[00:00:02] [STANDBY] Ready to execute dependency, memory, and performance sweep.'
  ]);

  const activeProfile = PLATFORM_PROFILES[selectedPlatform] || PLATFORM_PROFILES.win_dx12;

  // Filtered issues calculation
  const filteredIssues = useMemo(() => {
    return issues.filter(iss => {
      if (filterSeverity !== 'all' && iss.severity !== filterSeverity) return false;
      if (filterCategory !== 'all' && iss.category !== filterCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          iss.title.toLowerCase().includes(q) ||
          iss.description.toLowerCase().includes(q) ||
          iss.subsystem.toLowerCase().includes(q) ||
          iss.recommendation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [issues, filterSeverity, filterCategory, searchQuery]);

  // Overall Health Metrics
  const criticalCount = issues.filter(i => i.severity === 'critical' && !i.fixed).length;
  const warningCount = issues.filter(i => i.severity === 'warning' && !i.fixed).length;
  const passedCount = issues.filter(i => i.severity === 'passed' || i.fixed).length;

  const healthScore = Math.max(
    0,
    Math.min(100, Math.round(100 - criticalCount * 28 - warningCount * 8))
  );

  // Fluid multi-stage sweep execution with realistic sequential animations
  const runFullSweep = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditProgress(0);
    setActiveStepIndex(0);

    // Reset all steps to idle/running
    setAuditSteps(prev =>
      prev.map((step, idx) => ({
        ...step,
        status: idx === 0 ? 'running' : 'idle'
      }))
    );

    const now = new Date().toLocaleTimeString();
    setBuildLogs(prev => [
      `[${now}] [SWEEP START] Commencing pre-flight full audit across [${activeProfile.name}].`,
      `[${now}] [STEP 1/4] Querying CompilerTool LLVM/MSVC symbol tables and optimization flags...`,
      ...prev
    ]);

    // Step 1: Compiler
    setTimeout(() => {
      setAuditProgress(25);
      setJustCompletedStep('step_compiler');
      setActiveStepIndex(1);
      setAuditSteps(prev =>
        prev.map((step, idx) => {
          if (idx === 0) return { ...step, status: 'completed' };
          if (idx === 1) return { ...step, status: 'running' };
          return step;
        })
      );
      setBuildLogs(prev => [
        `[${new Date().toLocaleTimeString()}] [STEP 1 COMPLETE] Compiler Toolchain verified (Duration: 380ms).`,
        `[${new Date().toLocaleTimeString()}] [STEP 2/4] Querying BuildMonitor CI telemetry and cyclic dependency graph...`,
        ...prev
      ]);

      // Step 2: Dependencies
      setTimeout(() => {
        setAuditProgress(50);
        setJustCompletedStep('step_dependencies');
        setActiveStepIndex(2);
        setAuditSteps(prev =>
          prev.map((step, idx) => {
            if (idx === 1) return { ...step, status: 'warning' };
            if (idx === 2) return { ...step, status: 'running' };
            return step;
          })
        );
        setBuildLogs(prev => [
          `[${new Date().toLocaleTimeString()}] [STEP 2 COMPLETE] Dependency Topology mapped (1 cyclic graph flagged).`,
          `[${new Date().toLocaleTimeString()}] [STEP 3/4] Performing VRAM/RAM texture allocation & streaming buffer sweep...`,
          ...prev
        ]);

        // Step 3: Memory
        setTimeout(() => {
          setAuditProgress(75);
          setJustCompletedStep('step_memory');
          setActiveStepIndex(3);
          setAuditSteps(prev =>
            prev.map((step, idx) => {
              if (idx === 2) return { ...step, status: 'critical' };
              if (idx === 3) return { ...step, status: 'running' };
              return step;
            })
          );
          setBuildLogs(prev => [
            `[${new Date().toLocaleTimeString()}] [STEP 3 COMPLETE] VRAM/RAM analysis finished (18 uncompressed textures flagged).`,
            `[${new Date().toLocaleTimeString()}] [STEP 4/4] Profiling shader ALU ceilings and physics tick determinism...`,
            ...prev
          ]);

          // Step 4: Performance & Completion
          setTimeout(() => {
            setAuditProgress(100);
            setJustCompletedStep('step_performance');
            setActiveStepIndex(-1);
            setIsAuditing(false);
            setAuditSteps(prev =>
              prev.map((step, idx) => {
                if (idx === 3) return { ...step, status: 'warning' };
                return step;
              })
            );
            setBuildLogs(prev => [
              `[${new Date().toLocaleTimeString()}] [ALL STEPS COMPLETE] Pre-flight sweep finished. Readiness Score: ${healthScore}/100.`,
              ...prev
            ]);

            setTimeout(() => setJustCompletedStep(null), 3000);
          }, 650);
        }, 700);
      }, 700);
    }, 700);
  };

  // Re-run single step
  const runSingleStep = (stepId: string) => {
    const stepIdx = auditSteps.findIndex(s => s.id === stepId);
    if (stepIdx === -1) return;

    setAuditSteps(prev =>
      prev.map((s, idx) => (idx === stepIdx ? { ...s, status: 'running' } : s))
    );

    const now = new Date().toLocaleTimeString();
    setBuildLogs(prev => [
      `[${now}] [STEP RE-SCAN] Re-evaluating ${auditSteps[stepIdx].name}...`,
      ...prev
    ]);

    setTimeout(() => {
      setJustCompletedStep(stepId);
      setAuditSteps(prev =>
        prev.map((s, idx) => (idx === stepIdx ? { ...s, status: 'completed' } : s))
      );
      setBuildLogs(prev => [
        `[${new Date().toLocaleTimeString()}] [STEP RE-SCAN COMPLETE] ${auditSteps[stepIdx].name} updated.`,
        ...prev
      ]);
      setTimeout(() => setJustCompletedStep(null), 3000);
    }, 800);
  };

  // Auto-Fix Action with animated flash
  const handleAutoFix = (issueId: string) => {
    setRecentlyFixedId(issueId);
    setIssues(prev =>
      prev.map(iss => {
        if (iss.id === issueId) {
          const now = new Date().toLocaleTimeString();
          setBuildLogs(l => [
            `[${now}] [AUTO-REMEDIATE] Successfully applied automated fix for: "${iss.title}".`,
            ...l
          ]);
          return { ...iss, fixed: true, severity: 'passed' };
        }
        return iss;
      })
    );

    setTimeout(() => {
      setRecentlyFixedId(null);
    }, 1500);
  };

  // Auto-Fix All Safe Issues
  const handleAutoFixAll = () => {
    const fixable = issues.filter(i => i.autoFixable && !i.fixed);
    if (fixable.length === 0) return;

    setIssues(prev =>
      prev.map(iss => {
        if (iss.autoFixable) {
          return { ...iss, fixed: true, severity: 'passed' };
        }
        return iss;
      })
    );

    // Update steps statuses to completed
    setAuditSteps(prev =>
      prev.map(step => (step.category === 'compiler' || step.category === 'memory' ? { ...step, status: 'completed' } : step))
    );

    const now = new Date().toLocaleTimeString();
    setBuildLogs(prev => [
      `[${now}] [BATCH REMEDIATION] Fixed ${fixable.length} auto-fixable failure points across compiler flags and asset pipelines.`,
      ...prev
    ]);
  };

  // Execute Build Pipeline
  const executeBuildPipeline = () => {
    if (criticalCount > 0) {
      setBuildLogs(prev => [
        `[${new Date().toLocaleTimeString()}] [BUILD BLOCKED] Cannot execute build pipeline. ${criticalCount} critical blocker(s) must be remediated or approved.`,
        ...prev
      ]);
      return;
    }

    setBuildState('building');
    setBuildLogs(prev => [
      `[${new Date().toLocaleTimeString()}] [BUILD INITIATED] Packaging and compiling for ${activeProfile.name}...`,
      `[${new Date().toLocaleTimeString()}] [COMPILER HOOK] Applying verified flags: ${activeProfile.recommendedFlags.join(' ')}`,
      ...prev
    ]);

    setTimeout(() => {
      setBuildLogs(prev => [
        `[${new Date().toLocaleTimeString()}] [COOKER] 14,235 assets cooked into zero-copy pak stream.`,
        `[${new Date().toLocaleTimeString()}] [LINKER] Final binary generated with zero unresolved symbols.`,
        ...prev
      ]);
      setBuildState('succeeded');
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans overflow-hidden">
      {/* Top Header & Platform Selector */}
      <div className="bg-[#161b22] border-b border-[#30363d] p-4 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <motion.div
            animate={{ rotate: isAuditing ? 360 : 0 }}
            transition={{ duration: 4, repeat: isAuditing ? Infinity : 0, ease: 'linear' }}
            className="p-2.5 rounded-xl bg-[#1f242c] border border-[#30363d] text-[#58a6ff]"
          >
            <ShieldCheck size={24} className="text-[#58a6ff]" />
          </motion.div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-base font-bold text-white tracking-wide">Build & Publish Pre-Flight Audit</h1>
              <motion.span
                layout
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold flex items-center gap-1 border ${
                  criticalCount > 0
                    ? 'bg-[#da3633]/20 text-[#f85149] border-[#da3633]/40'
                    : warningCount > 0
                    ? 'bg-[#d29922]/20 text-[#e3b341] border-[#d29922]/40'
                    : 'bg-[#238636]/20 text-[#7ee787] border-[#238636]/40'
                }`}
              >
                {criticalCount > 0 ? (
                  <>
                    <XCircle size={12} /> {criticalCount} Blockers
                  </>
                ) : warningCount > 0 ? (
                  <>
                    <AlertTriangle size={12} /> {warningCount} Warnings
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={12} /> Ready to Build
                  </>
                )}
              </motion.span>
            </div>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Integrated with <span className="text-[#58a6ff] font-semibold">BuildMonitor (CI)</span> and <span className="text-[#58a6ff] font-semibold">CompilerTool (LLVM/GCC)</span> to detect dependency, memory, and performance failure points.
            </p>
          </div>
        </div>

        {/* Platform Selector & Header Action Buttons */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg p-1">
            <span className="text-[11px] font-bold text-[#8b949e] px-2 flex items-center gap-1">
              <Layers size={13} /> Platform:
            </span>
            <select
              value={selectedPlatform}
              onChange={e => setSelectedPlatform(e.target.value)}
              className="bg-[#161b22] border border-[#30363d] text-white text-xs font-semibold rounded px-2.5 py-1 outline-none focus:border-[#58a6ff]"
            >
              <option value="win_dx12">Windows PC (DX12 / Vulkan)</option>
              <option value="web_gpu">Web (WASM / WebGPU)</option>
              <option value="linux_vulkan">Linux / SteamOS (Vulkan)</option>
              <option value="mobile_vulkan">Mobile (Android / iOS)</option>
            </select>
          </div>

          <button
            onClick={runFullSweep}
            disabled={isAuditing}
            className="px-3.5 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-bold rounded-lg border border-[#30363d] flex items-center space-x-1.5 transition-all disabled:opacity-50 relative overflow-hidden group shadow-sm"
          >
            {isAuditing && (
              <motion.div
                className="absolute inset-0 bg-[#58a6ff]/10"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <RefreshCw size={13} className={isAuditing ? 'animate-spin text-[#58a6ff]' : 'text-[#58a6ff] group-hover:rotate-180 transition-transform duration-500'} />
            <span className="relative z-10">{isAuditing ? `Sweeping (${auditProgress}%)...` : 'Run Audit Sweep'}</span>
          </button>

          <button
            onClick={handleAutoFixAll}
            className="px-3.5 py-1.5 bg-[#1f6feb]/20 hover:bg-[#1f6feb]/30 text-[#58a6ff] text-xs font-bold rounded-lg border border-[#58a6ff]/40 flex items-center space-x-1.5 transition-all"
          >
            <Sparkles size={13} />
            <span>Auto-Remediate Safe</span>
          </button>

          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#8957e5]/20 hover:bg-[#8957e5]/30 text-[#d2a8ff] text-xs font-bold rounded-lg border border-[#8957e5]/40 flex items-center space-x-1.5 transition-all shadow-sm group"
            title="Download formatted summary PDF report of audit findings"
          >
            <FileText size={13} className="text-[#d2a8ff] group-hover:scale-110 transition-transform" />
            <span>Export PDF Report</span>
          </button>

          <button
            onClick={executeBuildPipeline}
            disabled={criticalCount > 0 || buildState === 'building'}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg border flex items-center space-x-1.5 shadow-lg transition-all ${
              criticalCount === 0 && buildState !== 'building'
                ? 'bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3fb950] text-white border-[#3fb950]/50 shadow-[#238636]/20'
                : 'bg-[#21262d] text-[#8b949e] border-[#30363d] cursor-not-allowed opacity-60'
            }`}
          >
            <Play size={13} />
            <span>{buildState === 'building' ? 'Building Artifacts...' : 'Execute Verified Build'}</span>
          </button>
        </div>
      </div>

      {/* FLUID STEP PROGRESSION BAR & ANIMATED STEPPER */}
      <div className="bg-[#11161d] border-b border-[#30363d] p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Activity size={13} className="text-[#58a6ff]" /> Pre-Flight Audit System Pipeline
            </span>
            <span className="text-[10px] text-[#8b949e] font-mono">
              ({auditSteps.filter(s => s.status === 'completed').length}/{auditSteps.length} Checks Passed)
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-1.5 text-[11px] text-[#8b949e]">
              <span>Overall Progress:</span>
              <span className="text-[#58a6ff] font-bold">{auditProgress}%</span>
            </div>
          </div>
        </div>

        {/* Global Progress Track */}
        <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d] mb-3.5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#1f6feb] via-[#58a6ff] to-[#3fb950]"
            initial={{ width: 0 }}
            animate={{ width: `${auditProgress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Discrete System Check Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {auditSteps.map((step, index) => {
            const isCurrent = activeStepIndex === index;
            const isJustFinished = justCompletedStep === step.id;

            return (
              <motion.div
                key={step.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative rounded-xl border p-3 flex flex-col justify-between transition-all overflow-hidden ${
                  step.status === 'running'
                    ? 'bg-[#161b22] border-[#58a6ff] shadow-md shadow-[#58a6ff]/10 ring-1 ring-[#58a6ff]/40'
                    : isJustFinished
                    ? 'bg-[#161b22] border-[#7ee787] shadow-md shadow-[#7ee787]/15 ring-1 ring-[#7ee787]/40'
                    : step.status === 'critical'
                    ? 'bg-[#161b22] border-[#da3633]/60'
                    : step.status === 'warning'
                    ? 'bg-[#161b22] border-[#d29922]/50'
                    : step.status === 'completed'
                    ? 'bg-[#161b22]/70 border-[#30363d]'
                    : 'bg-[#161b22]/40 border-[#30363d]/60 opacity-60'
                }`}
              >
                {/* Scanning Radar Wave Effect */}
                {step.status === 'running' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#58a6ff]/15 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Step Header */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg border text-xs ${
                      step.status === 'running'
                        ? 'bg-[#1f6feb]/20 text-[#58a6ff] border-[#58a6ff]/40'
                        : step.status === 'critical'
                        ? 'bg-[#da3633]/20 text-[#f85149] border-[#da3633]/40'
                        : step.status === 'warning'
                        ? 'bg-[#d29922]/20 text-[#e3b341] border-[#d29922]/40'
                        : step.status === 'completed'
                        ? 'bg-[#238636]/20 text-[#7ee787] border-[#238636]/40'
                        : 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
                    }`}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-none">{step.shortName}</div>
                      <div className="text-[10px] text-[#8b949e] font-mono mt-0.5">{step.sourceTool.split(' ')[0]}</div>
                    </div>
                  </div>

                  {/* Status Indicator Icon */}
                  <div>
                    {step.status === 'running' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="text-[#58a6ff]"
                      >
                        <RefreshCw size={14} />
                      </motion.div>
                    ) : step.status === 'critical' ? (
                      <XCircle size={15} className="text-[#f85149]" />
                    ) : step.status === 'warning' ? (
                      <AlertTriangle size={15} className="text-[#e3b341]" />
                    ) : step.status === 'completed' ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: isJustFinished ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <CheckCircle2 size={15} className="text-[#3fb950]" />
                      </motion.div>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#30363d]" />
                    )}
                  </div>
                </div>

                {/* Step Subtext & Action */}
                <div className="mt-2.5 pt-2 border-t border-[#30363d]/50 flex items-center justify-between text-[10px] font-mono relative z-10">
                  <span className="text-[#8b949e] truncate max-w-[120px]">{step.itemCount}</span>
                  <div className="flex items-center space-x-1.5">
                    {step.status !== 'running' && (
                      <button
                        onClick={() => runSingleStep(step.id)}
                        className="text-[#58a6ff] hover:text-white px-1.5 py-0.5 rounded hover:bg-[#21262d] transition-colors"
                        title="Re-run single audit check"
                      >
                        Re-scan
                      </button>
                    )}
                    <span className="text-[#8b949e]">{step.durationMs}ms</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 p-3 bg-[#0d1117] border-b border-[#30363d]">
        {/* Scorecard */}
        <motion.div
          layout
          className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-between"
        >
          <div>
            <div className="text-[10px] uppercase font-mono text-[#8b949e] tracking-wider">Readiness Score</div>
            <div className="text-xl font-extrabold text-white mt-0.5 flex items-baseline gap-1">
              <motion.span
                key={healthScore}
                initial={{ scale: 1.1, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className={healthScore > 85 ? 'text-[#7ee787]' : healthScore > 65 ? 'text-[#e3b341]' : 'text-[#f85149]'}
              >
                {healthScore}
              </motion.span>
              <span className="text-xs text-[#8b949e] font-normal">/ 100</span>
            </div>
          </div>
          <div className={`p-2 rounded-lg border ${
            healthScore > 85
              ? 'bg-[#238636]/15 border-[#238636]/30 text-[#7ee787]'
              : healthScore > 65
              ? 'bg-[#d29922]/15 border-[#d29922]/30 text-[#e3b341]'
              : 'bg-[#da3633]/15 border-[#da3633]/30 text-[#f85149]'
          }`}>
            <Gauge size={20} />
          </div>
        </motion.div>

        {/* Dependency Sweep */}
        <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-[#8b949e] tracking-wider">Dependency Graph</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {issues.filter(i => i.category === 'dependency' && !i.fixed).length === 0 ? (
                <span className="text-[#7ee787]">Verified Clean</span>
              ) : (
                <span className="text-[#e3b341]">{issues.filter(i => i.category === 'dependency' && !i.fixed).length} Risks Detected</span>
              )}
            </div>
          </div>
          <Workflow size={20} className="text-[#58a6ff]" />
        </div>

        {/* Memory & VRAM Budget */}
        <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-[#8b949e] tracking-wider">Target VRAM Cap</div>
            <div className="text-sm font-bold text-white mt-0.5">
              <span className="text-[#e3b341]">{activeProfile.vramBudgetMB} MB</span>
              <span className="text-[10px] text-[#8b949e] ml-1.5 font-normal">(RAM {activeProfile.ramBudgetMB} MB)</span>
            </div>
          </div>
          <HardDrive size={20} className="text-[#e3b341]" />
        </div>

        {/* Performance ALU & Draw Calls */}
        <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-[#8b949e] tracking-wider">Draw Calls Budget</div>
            <div className="text-sm font-bold text-white mt-0.5">
              <span className="text-[#7ee787]">Max {activeProfile.maxDrawCalls}</span>
              <span className="text-[10px] text-[#8b949e] ml-1.5 font-normal">(@ {activeProfile.targetFPS} FPS)</span>
            </div>
          </div>
          <Cpu size={20} className="text-[#7ee787]" />
        </div>

        {/* Compiler Optimization */}
        <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono text-[#8b949e] tracking-wider">Compiler Engine</div>
            <div className="text-xs font-bold text-[#bc8cff] mt-0.5 truncate max-w-[140px]" title={activeProfile.compilerBackend}>
              {activeProfile.compilerBackend.split(' ')[0]}
            </div>
          </div>
          <Wrench size={20} className="text-[#bc8cff]" />
        </div>
      </div>

      {/* Audit Navigation Tabs */}
      <div className="h-9 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between px-3 shrink-0">
        <div className="flex h-full">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-1 text-xs font-bold border-r border-[#30363d] transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-[#161b22] text-[#58a6ff] border-t-2 border-t-[#58a6ff]'
                : 'text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#161b22] border-t-2 border-t-transparent'
            }`}
          >
            <ShieldAlert size={13} />
            <span>Audit Findings ({filteredIssues.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dependencies')}
            className={`px-4 py-1 text-xs font-bold border-r border-[#30363d] transition-colors flex items-center gap-1.5 ${
              activeTab === 'dependencies'
                ? 'bg-[#161b22] text-[#58a6ff] border-t-2 border-t-[#58a6ff]'
                : 'text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#161b22] border-t-2 border-t-transparent'
            }`}
          >
            <Workflow size={13} />
            <span>Dependency Sweep (BuildMonitor)</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`px-4 py-1 text-xs font-bold border-r border-[#30363d] transition-colors flex items-center gap-1.5 ${
              activeTab === 'memory'
                ? 'bg-[#161b22] text-[#58a6ff] border-t-2 border-t-[#58a6ff]'
                : 'text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#161b22] border-t-2 border-t-transparent'
            }`}
          >
            <HardDrive size={13} />
            <span>Memory & VRAM Profiler</span>
          </button>

          <button
            onClick={() => setActiveTab('compiler')}
            className={`px-4 py-1 text-xs font-bold border-r border-[#30363d] transition-colors flex items-center gap-1.5 ${
              activeTab === 'compiler'
                ? 'bg-[#161b22] text-[#58a6ff] border-t-2 border-t-[#58a6ff]'
                : 'text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#161b22] border-t-2 border-t-transparent'
            }`}
          >
            <Wrench size={13} />
            <span>Compiler Flags & ABI (CompilerTool)</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-4 py-1 text-xs font-bold border-r border-[#30363d] transition-colors flex items-center gap-1.5 ${
              activeTab === 'terminal'
                ? 'bg-[#161b22] text-[#58a6ff] border-t-2 border-t-[#58a6ff]'
                : 'text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#161b22] border-t-2 border-t-transparent'
            }`}
          >
            <Terminal size={13} />
            <span>Audit & CI Stream Log</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#8b949e] font-mono">
          <span>Target Architecture:</span>
          <span className="text-[#58a6ff] font-bold">{activeProfile.name}</span>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#0a0c10]">
        {activeTab === 'audit' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filter Toolbar */}
            <div className="p-3 bg-[#161b22] border-b border-[#30363d] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#8b949e] flex items-center gap-1">
                  <Filter size={12} /> Severity:
                </span>
                {['all', 'critical', 'warning', 'passed'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                      filterSeverity === sev
                        ? 'bg-[#58a6ff]/20 text-[#58a6ff] border-[#58a6ff]/40'
                        : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:text-white'
                    }`}
                  >
                    {sev.toUpperCase()}
                  </button>
                ))}

                <span className="text-[11px] font-bold text-[#8b949e] ml-2 flex items-center gap-1">
                  Category:
                </span>
                {['all', 'compiler', 'memory', 'dependency', 'performance'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                      filterCategory === cat
                        ? 'bg-[#58a6ff]/20 text-[#58a6ff] border-[#58a6ff]/40'
                        : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:text-white'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Search Bar & PDF Quick Export */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-xs font-semibold rounded-md border border-[#30363d] flex items-center gap-1.5 transition-colors"
                  title="Generate downloadable PDF summary"
                >
                  <Download size={12} className="text-[#58a6ff]" />
                  <span>PDF Summary</span>
                </button>

                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-2 text-[#8b949e]" />
                  <input
                    type="text"
                    placeholder="Filter findings..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-7 pr-3 py-1 bg-[#0d1117] border border-[#30363d] rounded-md text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] w-44 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Findings List with Animated Stagger */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {filteredIssues.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-64 flex flex-col items-center justify-center text-[#8b949e] bg-[#161b22]/40 rounded-xl border border-[#30363d]"
                >
                  <CheckCircle2 size={36} className="text-[#3fb950] mb-2" />
                  <p className="text-sm font-bold text-white">No Issues Found for Selected Filter</p>
                  <p className="text-xs text-[#8b949e] mt-1">All pipeline invariants and budget thresholds are satisfied.</p>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredIssues.map((issue, idx) => {
                    const isExpanded = expandedIssueId === issue.id;
                    const isRecentlyFixed = recentlyFixedId === issue.id;

                    return (
                      <motion.div
                        key={issue.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: isRecentlyFixed ? [1, 1.02, 1] : 1
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                        className={`rounded-xl border transition-all overflow-hidden ${
                          issue.fixed
                            ? 'bg-[#161b22]/40 border-[#238636]/40'
                            : issue.severity === 'critical'
                            ? 'bg-[#161b22] border-[#da3633]/60 shadow-lg shadow-[#da3633]/5'
                            : issue.severity === 'warning'
                            ? 'bg-[#161b22] border-[#d29922]/50'
                            : 'bg-[#161b22]/60 border-[#30363d]'
                        }`}
                      >
                        {/* Issue Card Header */}
                        <div
                          onClick={() => setExpandedIssueId(isExpanded ? null : issue.id)}
                          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#1f242c]/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {issue.fixed ? (
                              <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                              >
                                <CheckCircle2 size={18} className="text-[#3fb950] shrink-0" />
                              </motion.div>
                            ) : issue.severity === 'critical' ? (
                              <XCircle size={18} className="text-[#f85149] shrink-0" />
                            ) : issue.severity === 'warning' ? (
                              <AlertTriangle size={18} className="text-[#e3b341] shrink-0" />
                            ) : (
                              <CheckCircle2 size={18} className="text-[#7ee787] shrink-0" />
                            )}

                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-xs font-bold text-white">{issue.title}</h3>
                                <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                                  issue.category === 'compiler'
                                    ? 'bg-[#bc8cff]/20 text-[#d2a8ff] border border-[#bc8cff]/40'
                                    : issue.category === 'memory'
                                    ? 'bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/40'
                                    : issue.category === 'dependency'
                                    ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/40'
                                    : 'bg-[#7ee787]/20 text-[#7ee787] border border-[#7ee787]/40'
                                }`}>
                                  {issue.category}
                                </span>

                                <span className="text-[10px] font-mono text-[#8b949e]">
                                  Source: <span className="text-white font-semibold">{issue.sourceTool}</span>
                                </span>
                              </div>
                              <div className="text-[11px] text-[#8b949e] mt-0.5 font-mono">
                                {issue.subsystem} {issue.fileLocation && `• ${issue.fileLocation}`}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {issue.autoFixable && !issue.fixed && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={e => {
                                  e.stopPropagation();
                                  handleAutoFix(issue.id);
                                }}
                                className="px-2.5 py-1 rounded bg-[#1f6feb]/20 hover:bg-[#1f6feb]/30 text-[#58a6ff] text-[11px] font-bold border border-[#58a6ff]/40 flex items-center gap-1 transition-all"
                              >
                                <Sparkles size={11} /> Auto-Remediate
                              </motion.button>
                            )}
                            {isExpanded ? <ChevronDown size={16} className="text-[#8b949e]" /> : <ChevronRight size={16} className="text-[#8b949e]" />}
                          </div>
                        </div>

                        {/* Expandable Details Pane */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="p-4 bg-[#0d1117] border-t border-[#30363d] space-y-3 text-xs overflow-hidden"
                            >
                              <div>
                                <div className="text-[10px] font-bold uppercase font-mono text-[#8b949e]">Detailed Diagnosis:</div>
                                <p className="text-xs text-[#c9d1d9] mt-1 leading-relaxed">{issue.description}</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-2.5 rounded-lg bg-[#161b22] border border-[#30363d]">
                                  <div className="text-[10px] font-bold uppercase font-mono text-[#f85149]">Pipeline Failure Impact:</div>
                                  <p className="text-[11px] text-[#c9d1d9] mt-0.5">{issue.impact}</p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-[#161b22] border border-[#30363d]">
                                  <div className="text-[10px] font-bold uppercase font-mono text-[#7ee787]">Recommended Remediation:</div>
                                  <p className="text-[11px] text-[#c9d1d9] mt-0.5">{issue.recommendation}</p>
                                </div>
                              </div>

                              {issue.codeSnippet && (
                                <div className="p-2.5 rounded-lg bg-[#0a0c10] border border-[#30363d] font-mono text-[11px]">
                                  <div className="text-[10px] text-[#8b949e] mb-1">// Proposed compiler flag / code change:</div>
                                  <code className="text-[#7ee787]">{issue.codeSnippet}</code>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]"
            >
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Workflow size={16} className="text-[#58a6ff]" /> BuildMonitor Dependency Topology Matrix
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">
                Monitors static linking, dynamic shared libraries, and marketplace extensions for circular locks and ABI drift.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                  <div className="text-xs font-bold text-white">Engine Core Subsystems</div>
                  <div className="text-2xl font-extrabold text-[#58a6ff] mt-1">48 Modules</div>
                  <div className="text-[11px] text-[#3fb950] mt-1">0 Circular Cycles</div>
                </div>
                <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                  <div className="text-xs font-bold text-white">Nexus Plugins & Extensions</div>
                  <div className="text-2xl font-extrabold text-[#bc8cff] mt-1">8 Active</div>
                  <div className="text-[11px] text-[#7ee787] mt-1">ABI VFS Sandboxed</div>
                </div>
                <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                  <div className="text-xs font-bold text-white">Asset Registry Packages</div>
                  <div className="text-2xl font-extrabold text-[#e3b341] mt-1">14,235 Assets</div>
                  <div className="text-[11px] text-[#8b949e] mt-1">99.8% Cook Efficiency</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3"
            >
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Module Dependency Graph Resolution:
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                  <span className="text-[#58a6ff]">AdvancedPhysicsEngine.lib</span>
                  <span className="text-[#8b949e]">--&gt; Depends on: [EngineCore, MathSIMD, MemoryAllocator]</span>
                  <span className="text-[#3fb950] font-bold">STABLE</span>
                </div>
                <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                  <span className="text-[#58a6ff]">VisualShaderGraphEditor.so</span>
                  <span className="text-[#8b949e]">--&gt; Depends on: [SPIRV_Cross, VulkanRHI, MaterialInstance]</span>
                  <span className="text-[#3fb950] font-bold">STABLE</span>
                </div>
                <div className="p-2.5 rounded bg-[#0d1117] border border-[#da3633]/40 flex items-center justify-between">
                  <span className="text-[#f85149]">GameplayAbilitySystem.dll</span>
                  <span className="text-[#8b949e]">--&gt; Cyclic reference detected with UIUXDataBinding</span>
                  <span className="text-[#f85149] font-bold">CYCLE DETECTED</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]"
            >
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <HardDrive size={16} className="text-[#e3b341]" /> Memory & VRAM Allocation Sweep
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">
                Compares cooked asset memory footings against target platform limits.
              </p>

              {/* Animated Progress Gauges */}
              <div className="space-y-4 mt-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-[#c9d1d9]">Texture & Normal Map Pool (Cooked)</span>
                    <span className="text-[#e3b341] font-bold">2,420 MB / {activeProfile.vramBudgetMB} MB (Warning)</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#238636] via-[#d29922] to-[#da3633]"
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-[#c9d1d9]">Geometry & Vertex Buffer Allocation</span>
                    <span className="text-[#7ee787] font-bold">480 MB / 1,500 MB (Safe)</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
                    <motion.div
                      className="h-full bg-[#238636]"
                      initial={{ width: 0 }}
                      animate={{ width: '32%' }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-[#c9d1d9]">Audio DSP & Soundbank Streaming Buffer</span>
                    <span className="text-[#7ee787] font-bold">94 MB / 512 MB (Safe)</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
                    <motion.div
                      className="h-full bg-[#238636]"
                      initial={{ width: 0 }}
                      animate={{ width: '18%' }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'compiler' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]"
            >
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench size={16} className="text-[#bc8cff]" /> CompilerTool ABI & LLVM Flag Sweep
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">
                Audits GCC, Clang, and MSVC flags for zero-cost abstraction, dead code elimination, and SIMD alignment.
              </p>

              <div className="mt-4 p-3 bg-[#0d1117] rounded-lg border border-[#30363d] font-mono text-xs space-y-2">
                <div className="text-[#8b949e]">// Verified Target Toolchain:</div>
                <div className="text-[#58a6ff]">{activeProfile.compilerBackend}</div>
                <div className="text-[#8b949e] mt-2">// Active Flags:</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeProfile.recommendedFlags.map(f => (
                    <span key={f} className="px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-[#7ee787]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="flex-1 p-4 bg-[#0d1117] font-mono text-xs overflow-y-auto space-y-1.5 scrollbar-thin">
            {buildLogs.map((log, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="text-[#58a6ff] select-none">&gt;</span>
                <span className={
                  log.includes('BLOCKED') || log.includes('Critical')
                    ? 'text-[#f85149]'
                    : log.includes('COMPLETE') || log.includes('SUCCESS') || log.includes('Clean')
                    ? 'text-[#7ee787]'
                    : log.includes('Warning')
                    ? 'text-[#e3b341]'
                    : 'text-[#c9d1d9]'
                }>
                  {log}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Export & Reporting Modal */}
      <AuditPdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        profile={activeProfile}
        issues={issues}
        steps={auditSteps}
        healthScore={healthScore}
        logs={buildLogs}
      />
    </div>
  );
}
