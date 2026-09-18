/**
 * ============================================================================
 * MODULE: EngineCommandHistoryTracker.ts
 * ============================================================================
 * 
 * [THAI]
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * โมดูลติดตามและบันทึกประวัติการสั่งการและการแก้ไขล่าสุดทั่วทั้งเกมเอนจิน (Engine Command History Tracker)
 * จัดเก็บรายการ 10 คำสั่งล่าสุด (Last 10 Executed Actions) ที่เกิดขึ้นในระบบ:
 * 1. บันทึกคำสั่งจาก CommandPalette, CodeEditor, Static Analysis, Asset Manager, และ Engine Subsystems
 * 2. จัดเก็บรายละเอียดการแก้ไข (Target Subsystem, Modification Details, Line Numbers, Telemetry Impact)
 * 3. จัดเก็บลงใน localStorage (`omni_engine_command_history_v1`) และแคชในหน่วยความจำแบบเรียลไทม์
 * 4. ให้บริการ Reactive Event Dispatcher (`engine-command-executed`) และระบบ Subscriber
 * 5. รองรับการรันซ้ำ (Re-execute) และการย้อนรอยการแก้ไข (Traceability & Rollback Guidance)
 * 
 * [ENGLISH]
 * Enterprise Engine Command & Modification History Tracker:
 * ----------------------------------------------------------------------------
 * Captures, tracks, and persists the last 10 executed actions across the engine
 * to enable developers to trace recent modifications with high fidelity:
 * 1. Real-time capture of command executions, AST refactors, tool transitions, and pipeline events.
 * 2. Full metadata preservation: timestamps, target files/modules, change descriptions, diff traces.
 * 3. Reactive subscription architecture broadcasting 'engine-command-executed' custom events.
 * 4. Persistent fallback in localStorage with graceful deserialization and default seeding.
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - ถูกเรียกใช้โดย: `CommandPalette.tsx`, `FloatingCommandHistoryLog.tsx`, `CodeEditor.tsx`, `App.tsx`
 * - สื่อสารผ่าน Custom Events: `engine-command-executed`, `switch-tool`
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - ตรวจสอบความถูกต้องของข้อมูลก่อนจัดเก็บและจำกัดขนาดประวัติที่ 10-20 รายการ
 * - กรณี localStorage ถูกปิดกั้นหรือข้อมูลเสียหาย จะใช้ In-Memory Cache สำรองทันที
 * - มีระบบ Seed รายการเริ่มต้นที่สมจริง (Realistic AAA Game Engine Modifications)
 * 
 * ============================================================================
 */

export type CommandActionCategory =
  | 'CODE_MODIFICATION'
  | 'ENGINE_SUBSYSTEM'
  | 'ASSET_PIPELINE'
  | 'COMPUTE_KERNEL'
  | 'PHYSICS_SIM'
  | 'PROJECT_STATE';

export type CommandActionStatus =
  | 'SUCCESS'
  | 'MODIFIED'
  | 'OPTIMIZED'
  | 'DISPATCHED'
  | 'REFACTORED';

export interface CommandModificationTrace {
  affectedFile?: string;
  affectedLines?: string;
  diffSummary?: string;
  telemetryImpact?: string;
  previousValue?: string;
  newValue?: string;
}

export interface EngineCommandAction {
  id: string;
  title: string;
  description: string;
  category: CommandActionCategory;
  targetSubsystem: string;
  status: CommandActionStatus;
  timestamp: number;
  author: 'USER' | 'COMMAND_PALETTE' | 'AUTO_REFACTOR' | 'KERNEL';
  executionDurationMs?: number;
  details?: CommandModificationTrace;
  reExecutable?: boolean;
  toolId?: string;
}

export type EngineCommandActionInput = Omit<EngineCommandAction, 'id' | 'timestamp'> & {
  id?: string;
  timestamp?: number;
};

const STORAGE_KEY = 'omni_engine_command_history_v1';
const MAX_HISTORY_LIMIT = 10;

/**
 * Default realistic engine actions for initial project state
 */
const DEFAULT_INITIAL_COMMANDS: EngineCommandAction[] = [
  {
    id: 'cmd_init_01',
    title: 'Optimize Vector3 Hot-Path Allocation',
    description: 'Replaced dynamic heap allocation with static scratch buffer inside 60fps update loop.',
    category: 'CODE_MODIFICATION',
    targetSubsystem: 'PlayerCombatController.ts',
    status: 'OPTIMIZED',
    timestamp: Date.now() - 1000 * 60 * 2, // 2 minutes ago
    author: 'AUTO_REFACTOR',
    executionDurationMs: 14,
    toolId: 'CodeEditor',
    reExecutable: true,
    details: {
      affectedFile: 'PlayerCombatController.ts',
      affectedLines: 'Line 77-80',
      diffSummary: '- new Vector3(dx, 0, dz)\n+ Vector3.setTemp(dx, 0, dz)',
      telemetryImpact: '+1.8ms frame time, -128KB/s GC churn'
    }
  },
  {
    id: 'cmd_init_02',
    title: 'Cache Scene Rigidbody Query',
    description: 'Replaced GetComponent<Rigidbody>() inside tick loop with cached member reference.',
    category: 'CODE_MODIFICATION',
    targetSubsystem: 'PlayerCombatController.ts',
    status: 'REFACTORED',
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    author: 'COMMAND_PALETTE',
    executionDurationMs: 8,
    toolId: 'CodeEditor',
    reExecutable: true,
    details: {
      affectedFile: 'PlayerCombatController.ts',
      affectedLines: 'Line 82',
      diffSummary: '- this.GetComponent<Rigidbody>()\n+ this.cachedRigidbody',
      telemetryImpact: '+0.9ms frame time'
    }
  },
  {
    id: 'cmd_init_03',
    title: 'Dispatch Vulkan Compute Workload',
    description: 'Dispatched 64 parallel workgroups for active particle physics collision simulation.',
    category: 'COMPUTE_KERNEL',
    targetSubsystem: 'HeterogeneousCompute',
    status: 'DISPATCHED',
    timestamp: Date.now() - 1000 * 60 * 9, // 9 minutes ago
    author: 'KERNEL',
    executionDurationMs: 4,
    toolId: 'HeterogeneousCompute',
    reExecutable: true,
    details: {
      affectedFile: 'VulkanParticleKernel.spv',
      diffSummary: 'Binding Buffer 0 -> Dynamic UBO, Workgroup Size: 256',
      telemetryImpact: 'Throughput 14,200 particles/frame @ 0.4ms'
    }
  },
  {
    id: 'cmd_init_04',
    title: 'Switch Subsystem to 3D Viewport',
    description: 'Switched active workspace perspective to real-time 3D Scene Viewport.',
    category: 'ENGINE_SUBSYSTEM',
    targetSubsystem: 'Viewport3D',
    status: 'SUCCESS',
    timestamp: Date.now() - 1000 * 60 * 14, // 14 minutes ago
    author: 'COMMAND_PALETTE',
    toolId: 'Viewport3D',
    reExecutable: true
  },
  {
    id: 'cmd_init_05',
    title: 'Hot-Reload Shader Pipeline',
    description: 'Recompiled PBR Metallic-Roughness fragment shader with dynamic branching removal.',
    category: 'ASSET_PIPELINE',
    targetSubsystem: 'ShaderGraphEditor',
    status: 'MODIFIED',
    timestamp: Date.now() - 1000 * 60 * 22, // 22 minutes ago
    author: 'USER',
    executionDurationMs: 38,
    toolId: 'ShaderGraph',
    reExecutable: true,
    details: {
      affectedFile: 'M_Ruby_PBR_Master.shader',
      diffSummary: 'Unrolled loop iterations; bound constant buffer slot 3',
      telemetryImpact: '-4 GPU register spills'
    }
  },
  {
    id: 'cmd_init_06',
    title: 'Square Distance Optimization',
    description: 'Substituted Vector3.Distance with distanceSquared to avoid square root CPU instructions.',
    category: 'CODE_MODIFICATION',
    targetSubsystem: 'PlayerCombatController.ts',
    status: 'OPTIMIZED',
    timestamp: Date.now() - 1000 * 60 * 35, // 35 minutes ago
    author: 'AUTO_REFACTOR',
    executionDurationMs: 6,
    toolId: 'CodeEditor',
    reExecutable: true,
    details: {
      affectedFile: 'PlayerCombatController.ts',
      affectedLines: 'Line 85',
      diffSummary: '- Vector3.Distance(a, b) < 5.0\n+ distanceSquared < 25.0',
      telemetryImpact: '+0.5ms frame time'
    }
  },
  {
    id: 'cmd_init_07',
    title: 'Synchronize Project Checkpoint',
    description: 'Persisted workspace session manifest and autosaved dirty buffers to local storage.',
    category: 'PROJECT_STATE',
    targetSubsystem: 'GlobalStudioAutoSaveManager',
    status: 'SUCCESS',
    timestamp: Date.now() - 1000 * 60 * 48, // 48 minutes ago
    author: 'USER',
    toolId: 'ProjectHub',
    reExecutable: true
  },
  {
    id: 'cmd_init_08',
    title: 'Execute Spatial Octree Broadphase',
    description: 'Rebuilt dynamic BVH bounding tree for 1,024 interactive scene entities.',
    category: 'PHYSICS_SIM',
    targetSubsystem: 'PhysicsEngine',
    status: 'SUCCESS',
    timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
    author: 'KERNEL',
    executionDurationMs: 12,
    toolId: 'PhysicsEngine',
    reExecutable: true
  },
  {
    id: 'cmd_init_09',
    title: 'Open Asset: M_Ruby_PBR_Master',
    description: 'Loaded high-resolution PBR material asset into content inspection inspector.',
    category: 'ASSET_PIPELINE',
    targetSubsystem: 'ContentBrowser',
    status: 'SUCCESS',
    timestamp: Date.now() - 1000 * 60 * 80, // 1.3 hours ago
    author: 'COMMAND_PALETTE',
    toolId: 'ContentBrowser',
    reExecutable: true
  },
  {
    id: 'cmd_init_10',
    title: 'Initialize Engine Diagnostic Engine',
    description: 'Started background static analysis and memory telemetry monitors across hot paths.',
    category: 'ENGINE_SUBSYSTEM',
    targetSubsystem: 'EngineStaticAnalysisPanel',
    status: 'SUCCESS',
    timestamp: Date.now() - 1000 * 60 * 110, // ~2 hours ago
    author: 'USER',
    toolId: 'CodeEditor',
    reExecutable: true
  }
];

export class EngineCommandHistoryTracker {
  private static inMemoryHistory: EngineCommandAction[] = [];
  private static subscribers: Set<(actions: EngineCommandAction[]) => void> = new Set();
  private static isInitialized = false;

  /**
   * Initialize history from storage or defaults
   */
  private static ensureInitialized(): void {
    if (this.isInitialized) return;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.inMemoryHistory = parsed.slice(0, MAX_HISTORY_LIMIT);
            this.isInitialized = true;
            return;
          }
        }
      }
    } catch (e) {
      console.warn('[EngineCommandHistoryTracker] Failed reading storage, fallback to defaults', e);
    }

    // Default initialization
    this.inMemoryHistory = [...DEFAULT_INITIAL_COMMANDS];
    this.saveToStorage();
    this.isInitialized = true;
  }

  /**
   * Record a new executed action across the engine
   */
  public static recordAction(input: EngineCommandActionInput): EngineCommandAction {
    this.ensureInitialized();

    const newAction: EngineCommandAction = {
      ...input,
      id: input.id || `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: input.timestamp || Date.now()
    };

    // Prepend new action and cap strictly to MAX_HISTORY_LIMIT (10 actions)
    this.inMemoryHistory = [newAction, ...this.inMemoryHistory.filter(a => a.id !== newAction.id)].slice(0, MAX_HISTORY_LIMIT);

    this.saveToStorage();
    this.notifySubscribers();

    // Broadcast global event for external reactive listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('engine-command-executed', { detail: newAction }));
    }

    return newAction;
  }

  /**
   * Get the last 10 executed actions
   */
  public static getRecentActions(limit: number = MAX_HISTORY_LIMIT): EngineCommandAction[] {
    this.ensureInitialized();
    return [...this.inMemoryHistory].slice(0, limit);
  }

  /**
   * Clear the action history and reset to clean state
   */
  public static clearHistory(): void {
    this.inMemoryHistory = [];
    this.saveToStorage();
    this.notifySubscribers();
  }

  /**
   * Reset to rich sample project history
   */
  public static resetToDefaults(): void {
    this.inMemoryHistory = [...DEFAULT_INITIAL_COMMANDS];
    this.saveToStorage();
    this.notifySubscribers();
  }

  /**
   * Subscribe to history changes
   */
  public static subscribe(listener: (actions: EngineCommandAction[]) => void): () => void {
    this.ensureInitialized();
    this.subscribers.add(listener);
    // Trigger immediately with current items
    listener(this.getRecentActions());

    return () => {
      this.subscribers.delete(listener);
    };
  }

  /**
   * Re-execute an action by dispatching appropriate events or navigation
   */
  public static reExecuteAction(action: EngineCommandAction, onSelectTool?: (toolId: string) => void): boolean {
    if (action.toolId) {
      if (onSelectTool) {
        onSelectTool(action.toolId);
      } else if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('switch-tool', { detail: action.toolId }));
      }
    }

    // Log the re-execution as a fresh command
    this.recordAction({
      title: `Re-run: ${action.title}`,
      description: `User re-executed modification targeting ${action.targetSubsystem}`,
      category: action.category,
      targetSubsystem: action.targetSubsystem,
      status: 'SUCCESS',
      author: 'USER',
      toolId: action.toolId,
      details: action.details
    });

    return true;
  }

  private static notifySubscribers(): void {
    const current = this.getRecentActions();
    this.subscribers.forEach(sub => {
      try {
        sub(current);
      } catch (err) {
        console.error('[EngineCommandHistoryTracker] Subscriber error:', err);
      }
    });
  }

  private static saveToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryHistory));
      }
    } catch (e) {
      console.warn('[EngineCommandHistoryTracker] Could not save to localStorage:', e);
    }
  }
}

export default EngineCommandHistoryTracker;
