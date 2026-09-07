/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Defines strict TypeScript type contracts, interfaces, data structures,
 *          and telemetry metrics for the Plugin Sandbox Test Run subsystem. It
 *          enables safe, zero-side-effect profiling of plugin memory allocation,
 *          compute load, and state mutation isolation without touching the primary
 *          game simulation engine.
 *    - TH: กำหนด Type และ Interface ทั้งหมดสำหรับระบบ "Sandbox Test Run" ของปลั๊กอิน
 *          ช่วยให้สามารถรันและวิเคราะห์การใช้ Memory และ Compute ของปลั๊กอินในสภาพแวดล้อม
 *          เสมือนที่ถูกแยกส่วน (Isolated Sandbox) โดยไม่ส่งผลกระทบต่อ State ของระบบ
 *          Simulation หลัก (Primary Engine State) แม้แต่จุดเดียว
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Works alongside `PluginSandboxIsolationEngine.ts` (Core Logic)
 *    - Visualized by `PluginSandboxTestRunPanel.tsx` (UI Dashboard)
 *    - Directly integrated into `NexusPluginArchitect.tsx` (Main Plugin IDE)
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Inputs: Plugin execution configuration, quota parameters, stress test options.
 *    - Outputs: Memory profiles (heap, peak, leak score), Compute profiles (CPU %, tick latency, FPS impact),
 *      and Isolation telemetry (intercepted mutations, zero-leak verification).
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Handles out-of-memory threshold violations gracefully.
 *    - Caps execution ticks if compute budget exceeds safety limits.
 *    - Preserves default fallback metrics if plugin execution is interrupted.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```ts
 *    import { SandboxTestRunSession, PluginMemoryProfile } from '../types/pluginSandboxTestRun';
 *    const session: SandboxTestRunSession = {
 *      pluginId: 'plg_001',
 *      isActive: true,
 *      startedAt: Date.now(),
 *      isolationIntegrity: 100
 *    };
 *    ```
 * ============================================================================
 */

/**
 * Execution state of the Sandbox Test Run session
 */
export type SandboxRunStatus = 'idle' | 'initializing' | 'running' | 'paused' | 'stress_testing' | 'error';

/**
 * Stress test scenario presets for compute and memory torture testing
 */
export type StressTestType = 
  | 'compute_surge_1000'     // 1,000 dense algorithmic ticks
  | 'memory_allocation_spike' // Rapid allocation of buffer blocks
  | 'state_mutation_barrage' // Intercepting rapid shadow entity mutations
  | 'gc_pressure_cycle';     // Rapid alloc/dealloc triggering virtual GC

/**
 * Detailed real-time memory usage profile of the sandboxed plugin
 */
export interface PluginMemoryProfile {
  /** Current allocated virtual heap memory in Megabytes (MB) */
  allocatedHeapMB: number;
  /** Peak memory reached during the test run in Megabytes (MB) */
  peakHeapMB: number;
  /** Memory quota boundary set by security sandbox (MB) */
  quotaMB: number;
  /** Allocated temporary scratch buffer memory (MB) */
  scratchBufferMB: number;
  /** Memory occupied by isolated shadow simulation state (MB) */
  shadowStateMB: number;
  /** Percentage of memory quota utilized (0 - 100%) */
  quotaUtilizationPercent: number;
  /** Total count of virtual garbage collection cycles completed */
  gcCyclesCount: number;
  /** Potential memory leak risk index (0 = zero risk, 100 = critical leak detected) */
  leakRiskIndex: number;
  /** Sparkline data array for memory over time (last N samples) */
  historySamples: number[];
}

/**
 * Detailed compute usage profile measuring CPU load, tick latency, and frame budget
 */
export interface PluginComputeProfile {
  /** Microseconds taken for the last isolated tick execution (μs) */
  lastTickDurationUs: number;
  /** Average tick execution latency in milliseconds (ms) */
  avgTickDurationMs: number;
  /** Peak tick execution latency in milliseconds (ms) */
  peakTickDurationMs: number;
  /** Normalized CPU load percentage consumed by plugin (0 - 100%) */
  cpuLoadPercent: number;
  /** Theoretical instructions or operations executed per second */
  opsPerSecond: number;
  /** Estimated impact on 60 FPS frame budget (16.6ms standard) */
  estimatedFpsImpact: number;
  /** Simulated frame rate headroom when plugin is active */
  projectedSimulationFps: number;
  /** Sparkline data array for compute latency over time */
  latencyHistorySamples: number[];
}

/**
 * Primary Simulation Engine Isolation Metrics
 * Proves mathematically that the primary game engine state remains 100% untouched.
 */
export interface SimulationIsolationMetrics {
  /** Count of state mutations intercepted and safely diverted to shadow sandbox */
  interceptedMutationsCount: number;
  /** Number of mutations leaked to the primary simulation engine (MUST REMAIN 0 AT ALL TIMES) */
  primaryEnginePollutionCount: number;
  /** Total virtual simulation ticks processed in isolation */
  virtualTicksProcessed: number;
  /** Virtual entities mocked in the sandbox scene graph */
  mockEntitiesCount: number;
  /** Integrity verification score (100% = perfectly quarantined) */
  isolationIntegrityPercent: number;
  /** Intercepted host APIs diverted (e.g. window, fetch, fs, root physics tick) */
  divertedHostApiCallsCount: number;
}

/**
 * Sandbox Test Run Log Entry
 */
export interface SandboxTestLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'leak' | 'intercept' | 'stress';
  source: string;
  message: string;
  metricSnapshot?: {
    heapMB: number;
    cpuPercent: number;
    tickUs: number;
  };
}

/**
 * Complete active Sandbox Test Run session data container
 */
export interface SandboxTestRunSession {
  pluginId: string;
  pluginName: string;
  status: SandboxRunStatus;
  isActive: boolean;
  startedAt: number;
  uptimeSeconds: number;
  memoryProfile: PluginMemoryProfile;
  computeProfile: PluginComputeProfile;
  isolationMetrics: SimulationIsolationMetrics;
  activeStressTest: StressTestType | null;
  stressProgress: number; // 0 - 100%
  logs: SandboxTestLogEntry[];
}
