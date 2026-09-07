/**
 * ============================================================================
 * MODULE: Engine Process Affinity Manager & Hardware Tier Dispatcher
 * FILE: src/utils/ProcessAffinityManagerNode.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * [THAI]
 * โมดูลนี้ทำหน้าที่จัดการการผูกมัด (Pinning) กระบวนการหลักของเอนจินเกม
 * (Physics, Rendering, Raytracing, AI Inference, Audio DSP, Terrain PCG)
 * เข้ากับระดับฮาร์ดแวร์ (Hardware Tiers) หรืออุปกรณ์ฮาร์ดแวร์เฉพาะรุ่นและค่าย
 * (NVIDIA, AMD, Intel, Apple, Qualcomm, Groq) บันทึกการตั้งค่าลง localStorage
 * อย่างถาวร และคำนวณผลกระทบต่อ Throughput และความหน่วง (Latency) แบบเรียลไทม์
 * 
 * [ENGLISH]
 * Enterprise singleton orchestrator that manages explicit affinity pinning of
 * core game engine subsystems (Physics, 3D Rendering, Hardware Ray Tracing,
 * Neural AI Inference, Spatial Audio DSP, and Procedural PCG) to dedicated
 * hardware tiers or vendor devices. Persists states, dispatches heterogeneous
 * compute frames, and computes live performance offload dividends.
 * 
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * 1. HeterogeneousDeviceRegistryNode: ดึงรายชื่ออุปกรณ์และสเปกฮาร์ดแวร์ทั้งหมด
 * 2. MultiVendorWorkloadDispatcherNode: ส่งคำสั่งประมวลผลงานตามการ Pinning
 * 3. SystemResourceMonitor & ComputeTaskDispatcherPanel: ติดตามผลและปรับแต่ง UI
 * 
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ----------------------------------------------------------------------------
 * ```ts
 * const manager = ProcessAffinityManagerNode.getInstance();
 * manager.pinProcessToDevice('PHYSICS', 'node-nv-rtx4090');
 * manager.setProcessTier('AI_INFERENCE', 'TIER_2_DEDICATED_NPU');
 * const report = await manager.dispatchFrameWorkloads();
 * ```
 * ============================================================================
 */

import { 
  EngineProcessKey, 
  HardwareTier, 
  ProcessBinding, 
  AffinityPreset 
} from '../types/processAffinity';
import { HeterogeneousComputeNode, WorkloadType } from '../types/heterogeneousCompute';
import { HeterogeneousDeviceRegistryNode } from './HeterogeneousDeviceRegistryNode';
import { MultiVendorWorkloadDispatcherNode } from './MultiVendorWorkloadDispatcherNode';

const STORAGE_KEY = 'nexus_engine_process_affinity_v2';
const EVENT_NAME = 'nexus-process-affinity-updated';

export class ProcessAffinityManagerNode {
  private static instance: ProcessAffinityManagerNode;
  private bindings: Record<EngineProcessKey, ProcessBinding>;
  private registry = HeterogeneousDeviceRegistryNode.getInstance();
  private dispatcher = MultiVendorWorkloadDispatcherNode.getInstance();
  private listeners: Set<(bindings: ProcessBinding[]) => void> = new Set();

  private constructor() {
    this.bindings = this.loadInitialBindings();
  }

  public static getInstance(): ProcessAffinityManagerNode {
    if (!ProcessAffinityManagerNode.instance) {
      ProcessAffinityManagerNode.instance = new ProcessAffinityManagerNode();
    }
    return ProcessAffinityManagerNode.instance;
  }

  /**
   * ค่าเริ่มต้นของกระบวนการทั้งหมดในเอนจิน
   */
  private getDefaultBindings(): Record<EngineProcessKey, ProcessBinding> {
    return {
      PHYSICS: {
        processKey: 'PHYSICS',
        name: 'Chaos Physics & RigidBody Sim',
        category: 'Physics & Collision',
        description: 'Multi-body collision detection, spatial broadphase, cloth dynamics, and substepping.',
        workloadType: 'PHYSICS_COLLISION_ECS',
        targetTier: 'TIER_AUTO_BALANCED',
        pinnedDeviceId: 'AUTO',
        isPinned: false,
        priority: 'HIGH',
        currentLoadPercent: 34,
        latencyMs: 1.8,
        throughputMetric: 'MegaParticles/s',
        throughputValue: 145.2,
        lastDispatchedAt: Date.now()
      },
      RENDERING: {
        processKey: 'RENDERING',
        name: 'Deferred 3D Raster & G-Buffer',
        category: 'Visual Pipeline',
        description: 'Primary scene geometry pass, shadow cascade mapping, post-processing, and tonemapping.',
        workloadType: 'GRAPHICS_RASTER',
        targetTier: 'TIER_1_DISCRETE_GPU',
        pinnedDeviceId: 'node-nv-rtx4090',
        pinnedVendor: 'NVIDIA',
        isPinned: true,
        priority: 'CRITICAL',
        currentLoadPercent: 48,
        latencyMs: 4.2,
        throughputMetric: 'DrawCalls/frame',
        throughputValue: 2450,
        lastDispatchedAt: Date.now()
      },
      RAYTRACING: {
        processKey: 'RAYTRACING',
        name: 'Hardware BVH & Lumen GI',
        category: 'Visual Pipeline',
        description: 'Ray-traced reflections, ambient occlusion, hardware traversal, and denoising passes.',
        workloadType: 'RAYTRACING_BVH',
        targetTier: 'TIER_1_DISCRETE_GPU',
        pinnedDeviceId: 'node-nv-rtx4090',
        pinnedVendor: 'NVIDIA',
        isPinned: true,
        priority: 'CRITICAL',
        currentLoadPercent: 58,
        latencyMs: 5.6,
        throughputMetric: 'MegaRays/s',
        throughputValue: 320.0,
        lastDispatchedAt: Date.now()
      },
      AI_INFERENCE: {
        processKey: 'AI_INFERENCE',
        name: 'Neural Agent & Dialogue LLM',
        category: 'AI & Machine Learning',
        description: 'Sub-second NPC decision trees, vision perception matrices, and streaming dialogue LLM.',
        workloadType: 'NEURAL_INFERENCE_LLM',
        targetTier: 'TIER_2_DEDICATED_NPU',
        pinnedDeviceId: 'node-groq-lpu',
        pinnedVendor: 'Groq',
        isPinned: true,
        priority: 'HIGH',
        currentLoadPercent: 22,
        latencyMs: 2.1,
        throughputMetric: 'Tokens/s',
        throughputValue: 680.0,
        lastDispatchedAt: Date.now()
      },
      AUDIO_DSP: {
        processKey: 'AUDIO_DSP',
        name: '3D Spatial Audio & Voice Vocoder',
        category: 'Audio Engine',
        description: 'HRTF 3D spatial convolution, procedural acoustic reflections, and multi-language neural TTS.',
        workloadType: 'AUDIO_DSP_SYNTHESIS',
        targetTier: 'TIER_AUTO_BALANCED',
        pinnedDeviceId: 'AUTO',
        isPinned: false,
        priority: 'NORMAL',
        currentLoadPercent: 12,
        latencyMs: 0.9,
        throughputMetric: 'Voice Channels',
        throughputValue: 128,
        lastDispatchedAt: Date.now()
      },
      TERRAIN_PCG: {
        processKey: 'TERRAIN_PCG',
        name: 'Infinite Octree Voxel PCG Baker',
        category: 'World Generation',
        description: 'Dual contouring meshing, procedural vegetation scatter, and chunk level-of-detail.',
        workloadType: 'OCTREE_TERRAIN_PCG',
        targetTier: 'TIER_3_HOST_CPU',
        pinnedDeviceId: 'node-intel-cpu-285k',
        pinnedVendor: 'Intel',
        isPinned: true,
        priority: 'NORMAL',
        currentLoadPercent: 42,
        latencyMs: 6.8,
        throughputMetric: 'Chunks/s',
        throughputValue: 420.0,
        lastDispatchedAt: Date.now()
      },
      VIDEO_FRAME_GEN: {
        processKey: 'VIDEO_FRAME_GEN',
        name: 'Dual AV1 Encoder & Optical Flow',
        category: 'Encoding & Media',
        description: 'Real-time hardware AV1 stream encoding and neural motion interpolation.',
        workloadType: 'VIDEO_ENCODE_AV1',
        targetTier: 'TIER_AUTO_BALANCED',
        pinnedDeviceId: 'AUTO',
        isPinned: false,
        priority: 'NORMAL',
        currentLoadPercent: 18,
        latencyMs: 3.4,
        throughputMetric: 'Enc FPS',
        throughputValue: 144.0,
        lastDispatchedAt: Date.now()
      }
    };
  }

  /**
   * โหลดการตั้งค่าจาก localStorage หรือใช้ค่ามาตรฐาน
   */
  private loadInitialBindings(): Record<EngineProcessKey, ProcessBinding> {
    const defaultBindings = this.getDefaultBindings();
    if (typeof window === 'undefined') return defaultBindings;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge with defaults to ensure all keys exist
        return { ...defaultBindings, ...parsed };
      }
    } catch (e) {
      console.warn('ProcessAffinityManagerNode: Failed to load stored bindings', e);
    }
    return defaultBindings;
  }

  /**
   * บันทึกการตั้งค่าลง localStorage และกระจาย Event
   */
  private persistAndNotify(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bindings));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: this.getAllBindings() }));
      } catch (e) {
        console.warn('ProcessAffinityManagerNode: Failed to persist bindings', e);
      }
    }
    const list = this.getAllBindings();
    this.listeners.forEach(cb => cb(list));
  }

  /**
   * ดึงรายการ Binding ทั้งหมด
   */
  public getAllBindings(): ProcessBinding[] {
    return Object.values(this.bindings);
  }

  /**
   * ดึง Binding ของกระบวนการที่ระบุ
   */
  public getBinding(key: EngineProcessKey): ProcessBinding {
    return this.bindings[key] || this.getDefaultBindings()[key];
  }

  /**
   * ปักหมุดกระบวนการเข้ากับระดับ Hardware Tier
   */
  public setProcessTier(key: EngineProcessKey, tier: HardwareTier): void {
    const binding = this.bindings[key];
    if (!binding) return;

    binding.targetTier = tier;
    if (tier === 'TIER_AUTO_BALANCED') {
      binding.isPinned = false;
      binding.pinnedDeviceId = 'AUTO';
      binding.pinnedVendor = undefined;
    } else {
      binding.isPinned = true;
      // เลือกอุปกรณ์ตัวแรกที่สอดคล้องกับ Tier นั้นๆ โดยอัตโนมัติหากยังไม่มีการระบุ Device ชัดเจน
      const candidate = this.getBestDeviceForTier(tier, binding.workloadType);
      if (candidate) {
        binding.pinnedDeviceId = candidate.id;
        binding.pinnedVendor = candidate.vendor;
      }
    }

    this.recalculateProcessTelemetry(key);
    this.persistAndNotify();
  }

  /**
   * ปักหมุดกระบวนการเข้ากับอุปกรณ์ผู้ผลิตที่เจาะจง (Vendor Device Pinning)
   */
  public pinProcessToDevice(key: EngineProcessKey, deviceId: string): void {
    const binding = this.bindings[key];
    if (!binding) return;

    if (deviceId === 'AUTO') {
      this.unpinProcess(key);
      return;
    }

    const device = this.registry.getNodeById(deviceId);
    if (!device) return;

    binding.isPinned = true;
    binding.pinnedDeviceId = deviceId;
    binding.pinnedVendor = device.vendor;

    // อัปเดต Tier ให้สอดคล้องกับ Class ของอุปกรณ์นั้นๆ
    if (device.deviceClass === 'GPU_DISCRETE') {
      binding.targetTier = 'TIER_1_DISCRETE_GPU';
    } else if (device.deviceClass === 'NPU_DEDICATED' || device.deviceClass === 'TPU_LPU_ACCELERATOR') {
      binding.targetTier = 'TIER_2_DEDICATED_NPU';
    } else if (device.deviceClass === 'CPU') {
      binding.targetTier = 'TIER_3_HOST_CPU';
    } else {
      binding.targetTier = 'TIER_4_INTEGRATED_APU';
    }

    this.recalculateProcessTelemetry(key);
    this.persistAndNotify();
  }

  /**
   * ยกเลิกการปักหมุด คืนการจัดการให้เป็น Auto-Balanced Scheduler
   */
  public unpinProcess(key: EngineProcessKey): void {
    const binding = this.bindings[key];
    if (!binding) return;

    binding.isPinned = false;
    binding.targetTier = 'TIER_AUTO_BALANCED';
    binding.pinnedDeviceId = 'AUTO';
    binding.pinnedVendor = undefined;

    this.recalculateProcessTelemetry(key);
    this.persistAndNotify();
  }

  /**
   * หาอุปกรณ์ที่เหมาะสมที่สุดใน Tier นั้นๆ
   */
  private getBestDeviceForTier(tier: HardwareTier, workload: WorkloadType): HeterogeneousComputeNode | undefined {
    const nodes = this.registry.getAllNodes();
    switch (tier) {
      case 'TIER_1_DISCRETE_GPU':
        return nodes.find(n => n.deviceClass === 'GPU_DISCRETE' && n.vendor === 'NVIDIA') ||
               nodes.find(n => n.deviceClass === 'GPU_DISCRETE');
      case 'TIER_2_DEDICATED_NPU':
        return nodes.find(n => n.deviceClass === 'TPU_LPU_ACCELERATOR' || n.deviceClass === 'NPU_DEDICATED') ||
               nodes.find(n => n.vendor === 'Apple' || n.vendor === 'Qualcomm');
      case 'TIER_3_HOST_CPU':
        return nodes.find(n => n.deviceClass === 'CPU');
      case 'TIER_4_INTEGRATED_APU':
        return nodes.find(n => n.deviceClass === 'GPU_INTEGRATED') || nodes.find(n => n.deviceClass === 'CPU');
      default:
        return nodes[0];
    }
  }

  /**
   * คำนวณค่า Telemetry และ Latency ตามการเปลี่ยนแปลงการ Pinning
   */
  private recalculateProcessTelemetry(key: EngineProcessKey): void {
    const binding = this.bindings[key];
    if (!binding) return;

    const isDedicatedFast = binding.targetTier === 'TIER_1_DISCRETE_GPU' || binding.targetTier === 'TIER_2_DEDICATED_NPU';

    if (binding.processKey === 'PHYSICS') {
      binding.latencyMs = isDedicatedFast ? 0.9 : 2.4;
      binding.currentLoadPercent = isDedicatedFast ? 18 : 45;
    } else if (binding.processKey === 'AI_INFERENCE') {
      binding.latencyMs = binding.targetTier === 'TIER_2_DEDICATED_NPU' ? 1.4 : 5.8;
      binding.currentLoadPercent = binding.targetTier === 'TIER_2_DEDICATED_NPU' ? 15 : 65;
    } else if (binding.processKey === 'RENDERING' || binding.processKey === 'RAYTRACING') {
      binding.latencyMs = binding.targetTier === 'TIER_1_DISCRETE_GPU' ? 3.8 : 8.5;
    }
  }

  /**
   * คำนวณดัชนีประสิทธิภาพรวมและการแบ่งเบาภาระฮาร์ดแวร์ (Offload Headroom Dividends)
   */
  public computeEfficiencyScore(): {
    efficiency: number;
    unburdenedGpuPercent: number;
    unburdenedCpuPercent: number;
    fpsHeadroomBoost: number;
  } {
    const bindings = this.getAllBindings();
    let score = 70;
    let unburdenedGpu = 0;
    let unburdenedCpu = 0;
    let fpsBoost = 0;

    // หาก AI ปักหมุดไปที่ NPU -> ลดภาระ GPU ได้ 22% และเพิ่ม FPS
    if (bindings.find(b => b.processKey === 'AI_INFERENCE')?.targetTier === 'TIER_2_DEDICATED_NPU') {
      score += 10;
      unburdenedGpu += 22;
      fpsBoost += 14;
    }

    // หาก Physics ปักหมุดไปที่ GPU หรือ Dedicated Cores -> ลดภาระ CPU ได้ 30%
    if (bindings.find(b => b.processKey === 'PHYSICS')?.targetTier === 'TIER_1_DISCRETE_GPU') {
      score += 8;
      unburdenedCpu += 30;
      fpsBoost += 8;
    }

    // หาก Raytracing ปักหมุดที่ Dedicated GPU
    if (bindings.find(b => b.processKey === 'RAYTRACING')?.targetTier === 'TIER_1_DISCRETE_GPU') {
      score += 7;
    }

    // หาก Audio ปักหมุดแยกจาก Main Render
    if (bindings.find(b => b.processKey === 'AUDIO_DSP')?.isPinned) {
      unburdenedCpu += 10;
    }

    return {
      efficiency: Math.min(100, score),
      unburdenedGpuPercent: Math.min(100, unburdenedGpu),
      unburdenedCpuPercent: Math.min(100, unburdenedCpu),
      fpsHeadroomBoost: fpsBoost
    };
  }

  /**
   * ชุด Presets สำเร็จรูปตามกรณีการใช้งาน
   */
  public getPresets(): AffinityPreset[] {
    return [
      {
        id: 'preset-aaa-optimal',
        name: 'Optimal AAA Studio Rig',
        description: 'Maximum FPS: Offload AI to NPU, Raytracing & Graphics to RTX 4090, Physics to discrete accelerator.',
        bindings: {
          PHYSICS: { targetTier: 'TIER_1_DISCRETE_GPU', deviceId: 'node-amd-rx7900xtx' },
          RENDERING: { targetTier: 'TIER_1_DISCRETE_GPU', deviceId: 'node-nv-rtx4090' },
          RAYTRACING: { targetTier: 'TIER_1_DISCRETE_GPU', deviceId: 'node-nv-rtx4090' },
          AI_INFERENCE: { targetTier: 'TIER_2_DEDICATED_NPU', deviceId: 'node-groq-lpu' },
          AUDIO_DSP: { targetTier: 'TIER_2_DEDICATED_NPU', deviceId: 'node-apple-ane' },
          TERRAIN_PCG: { targetTier: 'TIER_3_HOST_CPU', deviceId: 'node-intel-cpu-285k' },
          VIDEO_FRAME_GEN: { targetTier: 'TIER_4_INTEGRATED_APU', deviceId: 'node-intel-b580' }
        }
      },
      {
        id: 'preset-ai-centric',
        name: 'AI & Neural NPCs Centric',
        description: 'Dedicated matrix compute on Apple ANE & Qualcomm NPU with Host CPU for Physics.',
        bindings: {
          PHYSICS: { targetTier: 'TIER_3_HOST_CPU', deviceId: 'node-intel-cpu-285k' },
          RENDERING: { targetTier: 'TIER_1_DISCRETE_GPU', deviceId: 'node-nv-rtx4090' },
          RAYTRACING: { targetTier: 'TIER_1_DISCRETE_GPU', deviceId: 'node-nv-rtx4090' },
          AI_INFERENCE: { targetTier: 'TIER_2_DEDICATED_NPU', deviceId: 'node-apple-ane' },
          AUDIO_DSP: { targetTier: 'TIER_2_DEDICATED_NPU', deviceId: 'node-qcom-xelite' },
          TERRAIN_PCG: { targetTier: 'TIER_3_HOST_CPU', deviceId: 'node-intel-cpu-285k' },
          VIDEO_FRAME_GEN: { targetTier: 'TIER_AUTO_BALANCED' }
        }
      },
      {
        id: 'preset-auto-balanced',
        name: 'Full Auto-Balanced Dynamic',
        description: 'Returns all processes to real-time dynamic work-stealing & thermal watchdog.',
        bindings: {
          PHYSICS: { targetTier: 'TIER_AUTO_BALANCED' },
          RENDERING: { targetTier: 'TIER_AUTO_BALANCED' },
          RAYTRACING: { targetTier: 'TIER_AUTO_BALANCED' },
          AI_INFERENCE: { targetTier: 'TIER_AUTO_BALANCED' },
          AUDIO_DSP: { targetTier: 'TIER_AUTO_BALANCED' },
          TERRAIN_PCG: { targetTier: 'TIER_AUTO_BALANCED' },
          VIDEO_FRAME_GEN: { targetTier: 'TIER_AUTO_BALANCED' }
        }
      }
    ];
  }

  /**
   * นำ Preset มาใช้งาน
   */
  public applyPreset(presetId: string): void {
    const preset = this.getPresets().find(p => p.id === presetId);
    if (!preset) return;

    for (const [keyStr, config] of Object.entries(preset.bindings)) {
      const key = keyStr as EngineProcessKey;
      if (this.bindings[key]) {
        this.bindings[key].targetTier = config.targetTier;
        if (config.deviceId && config.deviceId !== 'AUTO') {
          this.bindings[key].pinnedDeviceId = config.deviceId;
          this.bindings[key].isPinned = true;
          const dev = this.registry.getNodeById(config.deviceId);
          if (dev) this.bindings[key].pinnedVendor = dev.vendor;
        } else {
          this.bindings[key].pinnedDeviceId = 'AUTO';
          this.bindings[key].isPinned = config.targetTier !== 'TIER_AUTO_BALANCED';
          this.bindings[key].pinnedVendor = undefined;
        }
        this.recalculateProcessTelemetry(key);
      }
    }

    this.persistAndNotify();
  }

  /**
   * จำลองการส่งรอบการประมวลผลหนึ่งเฟรม (Dispatch Single Frame Workloads)
   */
  public async dispatchFrameWorkloads(): Promise<{
    dispatchedCount: number;
    avgLatencyMs: number;
    totalThroughputMflops: number;
    results: Array<{ processKey: EngineProcessKey; assignedDeviceId: string; latencyMs: number }>;
  }> {
    const bindings = this.getAllBindings();
    const results: Array<{ processKey: EngineProcessKey; assignedDeviceId: string; latencyMs: number }> = [];
    let totalLatency = 0;

    for (const b of bindings) {
      const targetDeviceId = b.isPinned && b.pinnedDeviceId !== 'AUTO' ? b.pinnedDeviceId : 'AUTO_BALANCED';
      
      // Dispatch task ผ่าน MultiVendorWorkloadDispatcherNode
      const task = this.dispatcher.dispatchTask({
        name: `[Engine Process] ${b.name}`,
        type: b.workloadType,
        priority: b.priority,
        dataPayloadSizeMb: b.processKey === 'RENDERING' ? 1200 : b.processKey === 'RAYTRACING' ? 950 : 250,
        assignedDeviceId: targetDeviceId,
        targetPrecision: 'FP32'
      });

      b.lastDispatchedAt = Date.now();
      totalLatency += b.latencyMs;
      results.push({
        processKey: b.processKey,
        assignedDeviceId: task.assignedDeviceId,
        latencyMs: b.latencyMs
      });
    }

    this.persistAndNotify();

    return {
      dispatchedCount: bindings.length,
      avgLatencyMs: +(totalLatency / bindings.length).toFixed(2),
      totalThroughputMflops: 4850,
      results
    };
  }

  /**
   * รีเซ็ตกลับสู่ค่าโรงงาน
   */
  public resetToDefaults(): void {
    this.bindings = this.getDefaultBindings();
    this.persistAndNotify();
  }

  /**
   * Subscribe ติดตามการเปลี่ยนแปลงการ Pinning
   */
  public subscribe(callback: (bindings: ProcessBinding[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getAllBindings());
    return () => {
      this.listeners.delete(callback);
    };
  }
}
