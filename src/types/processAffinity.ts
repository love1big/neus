/**
 * ============================================================================
 * MODULE: Game Engine Process Affinity & Compute Dispatcher Contracts
 * FILE: src/types/processAffinity.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * ไฟล์นี้กำหนด Data Contracts สำหรับการผูกมัด (Pinning) กระบวนการย่อยของเอนจินเกม
 * (Game Engine Subsystems/Processes) เช่น Physics, Rendering, AI Inference, Audio DSP
 * เข้ากับระดับฮาร์ดแวร์เฉพาะ (Dedicated Hardware Tiers) หรืออุปกรณ์ของผู้ผลิตที่เจาะจง
 * (Specific Vendor Devices: NVIDIA, AMD, Apple, Intel, Qualcomm, Groq)
 * 
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * 1. ProcessAffinityManagerNode: จัดการ State และ Dispatch คิวงานตามการปักหมุด
 * 2. ComputeTaskDispatcherPanel: UI Control Panel ภายใน SystemResourceMonitor
 * 3. HeterogeneousDeviceRegistryNode: ให้ข้อมูลรายชื่อฮาร์ดแวร์และสถานะ Telemetry
 * 4. MultiVendorWorkloadDispatcherNode: สั่งรัน Task บนฮาร์ดแวร์เป้าหมาย
 * 
 * ============================================================================
 */

import { WorkloadType, ComputeVendor, ComputeDeviceClass } from './heterogeneousCompute';

export type EngineProcessKey = 
  | 'PHYSICS'
  | 'RENDERING'
  | 'RAYTRACING'
  | 'AI_INFERENCE'
  | 'AUDIO_DSP'
  | 'TERRAIN_PCG'
  | 'VIDEO_FRAME_GEN';

export type HardwareTier = 
  | 'TIER_1_DISCRETE_GPU'     // Extreme Discrete GPU (NVIDIA RTX / AMD Radeon)
  | 'TIER_2_DEDICATED_NPU'     // Dedicated NPU / AI Silicon (Apple ANE, Qualcomm Hexagon, Groq LPU)
  | 'TIER_3_HOST_CPU'          // Multi-Core Host CPU (Intel Core Ultra, AMD Ryzen AVX-512)
  | 'TIER_4_INTEGRATED_APU'    // Integrated Low-Power GPU / Efficient Cores
  | 'TIER_AUTO_BALANCED';      // Auto-balancing dynamic scheduler

export interface ProcessBinding {
  processKey: EngineProcessKey;
  name: string;
  category: string;
  description: string;
  workloadType: WorkloadType;
  targetTier: HardwareTier;
  pinnedDeviceId: string; // Device ID or 'AUTO'
  pinnedVendor?: ComputeVendor;
  isPinned: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'BACKGROUND';
  currentLoadPercent: number;
  latencyMs: number;
  throughputMetric: string;
  throughputValue: number;
  lastDispatchedAt: number;
}

export interface AffinityPreset {
  id: string;
  name: string;
  description: string;
  bindings: Record<EngineProcessKey, { targetTier: HardwareTier; deviceId?: string }>;
}
