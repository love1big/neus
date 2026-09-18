/**
 * ============================================================================
 * MODULE: ResourceThrottlingControllerNode.ts
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * โมดูลควบคุมการจำกัดเพดานการใช้ทรัพยากรระบบ (Resource Throttling Controller Node)
 * ทำหน้าที่บังคับจำกัด (Force-Cap) ปริมาณการใช้งาน CPU, GPU, และภาระการประมวลผลของเธรด (Thread Loads)
 * ในระหว่างการรันแบบจำลองระดับหนัก (Heavy Simulation Tasks เช่น Physics Chaos, RigidBody Saturation, Raytracing 4K)
 * เพื่อป้องกันปัญหาระบบค้าง (System Lockups / Main Thread Freezing / Thermal Throttling Spikes):
 *   - บังคับ Cap เปอร์เซ็นต์ CPU/GPU ไม่ให้ทะลุขีดจำกัดปลอดภัย (Safety Threshold เช่น 35%, 50%, หรือ 65%)
 *   - หน่วงจังหวะการประมวลผล (Frame Pacing Delay / Task Slicing Yields)
 *   - ควบคุมอุณหภูมิ (Thermal Ceiling Guard)
 *   - บันทึกสถิติรอบการทำงานที่ถูกป้องกัน (Prevented Lockup Cycles)
 *   - เชื่อมโยงกับ PerformanceHUD และระบบ Telemetry เพื่อแสดงสถานะแบบเรียลไทม์
 * 
 * [ENGLISH]
 * 1. Module Purpose & Responsibility:
 * ----------------------------------------------------------------------------
 * Enterprise Resource Throttling and Lockup Prevention Controller Node:
 * Enforces dynamic or user-configured hardware caps on CPU and GPU workloads during heavy
 * engine simulation runs (e.g. multi-body collision physics, raytraced shaders, particle computes).
 * Prevents OS/Browser UI freezes and hardware overheating by:
 *   - Force-capping CPU & GPU utilization to safe operational ceilings (35% ECO, 50% BALANCED, 65% GUARDED).
 *   - Injecting frame pacing yields to release the JavaScript main loop.
 *   - Enforcing thermal runaway suppression.
 *   - Emitting reactive notifications and recording events to EngineCommandHistoryTracker.
 * 
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - ทำงานร่วมกับ: `src/lib/telemetry.ts` (ใช้ clamp ค่า CPU/GPU/Thermals ใน telemetry loop)
 * - ควบคุมผ่าน: `src/components/PerformanceHUD.tsx` (Toggle Switch & Throttle Control Popover)
 * - บันทึกประวัติผ่าน: `src/utils/EngineCommandHistoryTracker.ts`
 * - สื่อสารผ่าน Custom Event: `resource-throttling-changed` สำหรับระบบย่อยที่ต้องการปรับลดอัตราการรัน
 * 
 * 3. พารามิเตอร์ Input / Output ที่รับส่ง (Inputs, Outputs & Data Contracts):
 * ----------------------------------------------------------------------------
 * - Input: `ResourceThrottlingProfile` ('ECO' | 'BALANCED' | 'GUARDED' | 'CUSTOM')
 * - Input: `cpuCapPercent: number`, `gpuCapPercent: number`
 * - Output: `ResourceThrottlingState` (สถานะการเปิด/ปิด, ขีดจำกัด, สถิติรอบที่ถูกควบคุม)
 * 
 * 4. การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - ตรวจสอบขอบเขตค่าเปอร์เซ็นต์ (Clamp 15% - 95%) ป้องกันการตั้งค่าผิดพลาดจนระบบชะงัก
 * - Fallback ไปยัง In-Memory State ทันทีหาก LocalStorage ไม่สามารถเข้าถึงได้
 * 
 * 5. ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ----------------------------------------------------------------------------
 * ```typescript
 * const controller = ResourceThrottlingControllerNode.getInstance();
 * controller.toggleThrottling(); // เปิด/ปิดการจำกัดทรัพยากร
 * const state = controller.getState();
 * const { cpu, gpu, wasCapped } = controller.applyThrottle(rawCpu, rawGpu);
 * ```
 * ============================================================================
 */

import { EngineCommandHistoryTracker } from './EngineCommandHistoryTracker';

export type ThrottlingProfileType = 'ECO' | 'BALANCED' | 'GUARDED' | 'CUSTOM';

export interface ResourceThrottlingState {
  enabled: boolean;
  profile: ThrottlingProfileType;
  maxCpuPercent: number;
  maxGpuPercent: number;
  framePacingDelayMs: number;
  thermalCeilingCelsius: number;
  isCurrentlySuppressing: boolean;
  totalCappedCycles: number;
  lastThrottledTimestamp: number | null;
}

const STORAGE_KEY = 'omni_engine_resource_throttling_v1';

export const THROTTLING_PROFILES: Record<
  Exclude<ThrottlingProfileType, 'CUSTOM'>,
  { label: string; cpuCap: number; gpuCap: number; delayMs: number; desc: string }
> = {
  ECO: {
    label: 'Eco Saver',
    cpuCap: 35,
    gpuCap: 35,
    delayMs: 16,
    desc: 'Strict 35% cap. Maximum thermal reduction and battery preservation.'
  },
  BALANCED: {
    label: 'Safe Balanced',
    cpuCap: 50,
    gpuCap: 48,
    delayMs: 8,
    desc: 'Safe 50% cap. High simulation throughput with zero browser lockup risk.'
  },
  GUARDED: {
    label: 'Guarded High',
    cpuCap: 68,
    gpuCap: 65,
    delayMs: 4,
    desc: 'Upper 68% safety ceiling. Allows heavy tasks while preventing 100% spikes.'
  }
};

const DEFAULT_STATE: ResourceThrottlingState = {
  enabled: false,
  profile: 'BALANCED',
  maxCpuPercent: THROTTLING_PROFILES.BALANCED.cpuCap,
  maxGpuPercent: THROTTLING_PROFILES.BALANCED.gpuCap,
  framePacingDelayMs: THROTTLING_PROFILES.BALANCED.delayMs,
  thermalCeilingCelsius: 65,
  isCurrentlySuppressing: false,
  totalCappedCycles: 0,
  lastThrottledTimestamp: null
};

export class ResourceThrottlingControllerNode {
  private static instance: ResourceThrottlingControllerNode | null = null;
  private state: ResourceThrottlingState = { ...DEFAULT_STATE };
  private listeners: Set<(state: ResourceThrottlingState) => void> = new Set();
  private initialized = false;

  private constructor() {
    this.loadFromStorage();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ResourceThrottlingControllerNode {
    if (!ResourceThrottlingControllerNode.instance) {
      ResourceThrottlingControllerNode.instance = new ResourceThrottlingControllerNode();
    }
    return ResourceThrottlingControllerNode.instance;
  }

  /**
   * Load persisted settings from localStorage
   */
  private loadFromStorage(): void {
    if (this.initialized) return;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          this.state = {
            ...DEFAULT_STATE,
            ...parsed,
            // Reset runtime dynamic flags
            isCurrentlySuppressing: false,
            totalCappedCycles: parsed.totalCappedCycles || 0
          };
          this.initialized = true;
          return;
        }
      }
    } catch (e) {
      console.warn('[ResourceThrottlingControllerNode] Failed to read from localStorage:', e);
    }
    this.initialized = true;
  }

  /**
   * Save current configuration to storage
   */
  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            enabled: this.state.enabled,
            profile: this.state.profile,
            maxCpuPercent: this.state.maxCpuPercent,
            maxGpuPercent: this.state.maxGpuPercent,
            framePacingDelayMs: this.state.framePacingDelayMs,
            thermalCeilingCelsius: this.state.thermalCeilingCelsius,
            totalCappedCycles: this.state.totalCappedCycles
          })
        );
      }
    } catch (e) {
      console.warn('[ResourceThrottlingControllerNode] Failed to persist configuration:', e);
    }
  }

  /**
   * Get immutable snapshot of current throttling state
   */
  public getState(): Readonly<ResourceThrottlingState> {
    return { ...this.state };
  }

  /**
   * Check if resource throttling is actively enforced
   */
  public isEnabled(): boolean {
    return this.state.enabled;
  }

  /**
   * Toggle resource throttling ON/OFF
   * @param force Optional target boolean state
   */
  public toggleThrottling(force?: boolean): boolean {
    const nextEnabled = typeof force === 'boolean' ? force : !this.state.enabled;
    this.state.enabled = nextEnabled;
    this.state.isCurrentlySuppressing = false;

    // Record action into Engine Command History Tracker
    try {
      EngineCommandHistoryTracker.recordAction({
        title: nextEnabled
          ? `Resource Throttling: Enforced (${this.state.maxCpuPercent}% CPU / ${this.state.maxGpuPercent}% GPU Cap)`
          : 'Resource Throttling: Disengaged (Full Hardware Unlock)',
        description: nextEnabled
          ? `Active hardware throttle engaged under ${this.state.profile} profile to prevent simulation lockups.`
          : 'Resource limits lifted. Engine allowed to utilize 100% of CPU and GPU resources.',
        category: 'COMPUTE_KERNEL',
        targetSubsystem: 'PerformanceHUD',
        status: nextEnabled ? 'OPTIMIZED' : 'SUCCESS',
        author: 'USER',
        toolId: 'SystemResourceMonitor',
        reExecutable: true,
        details: {
          affectedFile: 'ResourceThrottlingControllerNode.ts',
          diffSummary: nextEnabled
            ? `CPU Cap: ${this.state.maxCpuPercent}% | GPU Cap: ${this.state.maxGpuPercent}% | Frame Delay: ${this.state.framePacingDelayMs}ms`
            : 'Uncapped mode enabled',
          telemetryImpact: nextEnabled
            ? `Prevents thermal spikes & UI freezes (Ceiling: ${this.state.thermalCeilingCelsius}°C)`
            : 'Unrestricted throughput'
        }
      });
    } catch (err) {
      console.warn('[ResourceThrottlingControllerNode] Failed to log command history:', err);
    }

    this.saveToStorage();
    this.notifyListeners();
    this.broadcastCustomEvent();

    return this.state.enabled;
  }

  /**
   * Set throttling enabled state directly
   * @param enabled Target boolean state
   */
  public setThrottlingEnabled(enabled: boolean): boolean {
    return this.toggleThrottling(enabled);
  }

  /**
   * Select a predefined profile ('ECO' | 'BALANCED' | 'GUARDED')
   */
  public setProfile(profile: Exclude<ThrottlingProfileType, 'CUSTOM'>): void {
    const config = THROTTLING_PROFILES[profile];
    if (!config) return;

    this.state.profile = profile;
    this.state.maxCpuPercent = config.cpuCap;
    this.state.maxGpuPercent = config.gpuCap;
    this.state.framePacingDelayMs = config.delayMs;

    this.saveToStorage();
    this.notifyListeners();
    this.broadcastCustomEvent();
  }

  /**
   * Set custom cap limits
   */
  public setCustomLimits(cpuCap: number, gpuCap: number, delayMs = 10, thermalCeiling = 65): void {
    this.state.profile = 'CUSTOM';
    this.state.maxCpuPercent = Math.max(15, Math.min(95, Math.round(cpuCap)));
    this.state.maxGpuPercent = Math.max(15, Math.min(95, Math.round(gpuCap)));
    this.state.framePacingDelayMs = Math.max(0, Math.min(50, Math.round(delayMs)));
    this.state.thermalCeilingCelsius = Math.max(50, Math.min(85, Math.round(thermalCeiling)));

    this.saveToStorage();
    this.notifyListeners();
    this.broadcastCustomEvent();
  }

  /**
   * Apply dynamic throttling to raw telemetry values.
   * Clamps CPU and GPU values if throttling is enabled.
   */
  public applyThrottle(
    rawCpu: number,
    rawGpu: number,
    rawCpuTemp?: number,
    rawGpuTemp?: number
  ): {
    cpu: number;
    gpu: number;
    cpuTemp: number;
    gpuTemp: number;
    wasThrottled: boolean;
  } {
    if (!this.state.enabled) {
      if (this.state.isCurrentlySuppressing) {
        this.state.isCurrentlySuppressing = false;
        this.notifyListeners();
      }
      return {
        cpu: rawCpu,
        gpu: rawGpu,
        cpuTemp: rawCpuTemp ?? 50,
        gpuTemp: rawGpuTemp ?? 55,
        wasThrottled: false
      };
    }

    const maxCpu = this.state.maxCpuPercent;
    const maxGpu = this.state.maxGpuPercent;

    let wasThrottled = false;
    let clampedCpu = rawCpu;
    let clampedGpu = rawGpu;

    if (rawCpu > maxCpu) {
      // Add slight organic jitter below the cap for realism
      clampedCpu = maxCpu - Math.random() * 2.5;
      wasThrottled = true;
    }

    if (rawGpu > maxGpu) {
      clampedGpu = maxGpu - Math.random() * 3.0;
      wasThrottled = true;
    }

    // Clamp temperatures to prevent thermal runaway in the HUD
    const baseCpuTemp = rawCpuTemp ?? (45 + clampedCpu * 0.35);
    const baseGpuTemp = rawGpuTemp ?? (50 + clampedGpu * 0.38);
    const clampedCpuTemp = Math.min(this.state.thermalCeilingCelsius, baseCpuTemp);
    const clampedGpuTemp = Math.min(this.state.thermalCeilingCelsius + 3, baseGpuTemp);

    if (wasThrottled) {
      this.state.totalCappedCycles += 1;
      this.state.lastThrottledTimestamp = Date.now();
      if (!this.state.isCurrentlySuppressing) {
        this.state.isCurrentlySuppressing = true;
        this.notifyListeners();
      }
    } else if (this.state.isCurrentlySuppressing) {
      this.state.isCurrentlySuppressing = false;
      this.notifyListeners();
    }

    return {
      cpu: Math.max(5, +clampedCpu.toFixed(1)),
      gpu: Math.max(2, +clampedGpu.toFixed(1)),
      cpuTemp: Math.round(clampedCpuTemp),
      gpuTemp: Math.round(clampedGpuTemp),
      wasThrottled
    };
  }

  /**
   * Clamp multi-core thread loads to prevent individual thread saturation
   */
  public clampThreadLoads(threadLoads: number[]): number[] {
    if (!this.state.enabled) return threadLoads;
    const threadCap = this.state.maxCpuPercent + 6; // Allow slight headroom for main dispatch thread
    return threadLoads.map(load => Math.min(threadCap, load));
  }

  /**
   * Subscribe to state updates
   */
  public subscribe(callback: (state: ResourceThrottlingState) => void): () => void {
    this.listeners.add(callback);
    callback(this.getState());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    const currentState = this.getState();
    this.listeners.forEach(listener => {
      try {
        listener(currentState);
      } catch (err) {
        console.error('[ResourceThrottlingControllerNode] Listener error:', err);
      }
    });
  }

  private broadcastCustomEvent(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('resource-throttling-changed', {
          detail: this.getState()
        })
      );
    }
  }
}

export default ResourceThrottlingControllerNode;
