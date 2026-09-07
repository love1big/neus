/**
 * ============================================================================
 * MODULE: Heterogeneous Multi-Compute Contracts & Architecture Types
 * FILE: src/types/heterogeneousCompute.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * ไฟล์นี้กำหนดสัญญาข้อมูล (Data Contracts), อินเตอร์เฟส (Interfaces), และ
 * เออนัม (Enums) สำหรับระบบประสานการประมวลผลร่วมหลายสถาปัตยกรรม (Heterogeneous
 * Multi-Vendor Multi-Device Orchestrator) รองรับการประมวลผลคู่ขนานระหว่าง
 * CPU, Discrete GPU, Integrated GPU, Dedicated NPU และ LPU/TPU Accelerators
 * จากผู้ผลิตหลากหลายยี่ห้อ (NVIDIA, AMD, Intel, Apple, Qualcomm, Google, Tenstorrent ฯลฯ)
 * 
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * 1. HeterogeneousDeviceRegistryNode: อ้างอิง Device Definition และสถานะ
 * 2. MultiVendorWorkloadDispatcherNode: จัดสรร Task ตาม Hardware Affinity
 * 3. HeterogeneousMemoryFabricNode: จัดการ Unified Virtual Memory ข้ามบัส
 * 4. CrossVendorFaultToleranceWatchdogNode: มอนิเตอร์ความร้อนและกู้คืน Driver Crash
 * 5. HeterogeneousMultiComputeStudio: แสดงผล UI Dashboard และควบคุม Cluster
 * 
 * ============================================================================
 */

export type ComputeVendor = 
  | 'NVIDIA'
  | 'AMD'
  | 'Intel'
  | 'Apple'
  | 'Qualcomm'
  | 'Google'
  | 'Tenstorrent'
  | 'Groq'
  | 'Hailo'
  | 'ARM'
  | 'Generic_x86';

export type ComputeDeviceClass = 
  | 'CPU' 
  | 'GPU_DISCRETE' 
  | 'GPU_INTEGRATED' 
  | 'NPU_DEDICATED' 
  | 'TPU_LPU_ACCELERATOR';

export type ComputeInterconnect = 
  | 'PCIE_GEN5_X16' 
  | 'PCIE_GEN4_X16' 
  | 'CXL_3_0' 
  | 'NVLINK_4' 
  | 'INFINITY_FABRIC' 
  | 'APPLE_UNIFIED_FABRIC' 
  | 'QNN_DIRECT_DMA' 
  | 'DIRECT_DIE_SRAM'
  | 'SYSTEM_DDR5_BUS'
  | 'VIRTUAL_SHARED_HOST';

export type ComputeBackendAPI = 
  | 'WebGPU' 
  | 'WebNN' 
  | 'Vulkan' 
  | 'DirectX12' 
  | 'Metal' 
  | 'CUDA' 
  | 'ROCm_HIP' 
  | 'oneAPI_SYCL' 
  | 'OpenVINO' 
  | 'TensorRT' 
  | 'CoreML' 
  | 'Qualcomm_QNN' 
  | 'WASM_SIMD128';

export type WorkloadType = 
  | 'GRAPHICS_RASTER' 
  | 'RAYTRACING_BVH' 
  | 'NEURAL_INFERENCE_LLM' 
  | 'NEURAL_VISION_CV' 
  | 'PHYSICS_COLLISION_ECS' 
  | 'AUDIO_DSP_SYNTHESIS' 
  | 'VIDEO_ENCODE_AV1' 
  | 'OCTREE_TERRAIN_PCG';

export type DeviceHealthStatus = 
  | 'HEALTHY' 
  | 'THERMAL_THROTTLED' 
  | 'POWER_CAPPED' 
  | 'DRIVER_RECOVERING' 
  | 'OFFLINE' 
  | 'STANDBY';

/**
 * โครงสร้างโหนดประมวลผลในระบบ Heterogeneous Computing
 */
export interface HeterogeneousComputeNode {
  id: string;
  name: string;
  vendor: ComputeVendor;
  deviceClass: ComputeDeviceClass;
  architecture: string;
  interconnect: ComputeInterconnect;
  supportedBackends: ComputeBackendAPI[];
  preferredBackend: ComputeBackendAPI;
  
  // Spec & Capabilities
  coreCount: number;
  baseClockGhz: number;
  boostClockGhz: number;
  memoryPool: {
    totalMb: number;
    allocatedMb: number;
    type: 'GDDR6X' | 'GDDR6' | 'HBM3e' | 'LPDDR5X' | 'DDR5' | 'Direct_SRAM' | 'Unified_Fabric';
    bandwidthGbps: number;
    isUnifiedWithHost: boolean;
  };

  // Compute Throughput Ratings
  fp32Tflops: number;
  fp16Tflops: number;
  int8Tops: number;
  tdpWatts: number;
  
  // Real-time Runtime Telemetry
  telemetry: {
    utilizationPercent: number;
    temperatureCelsius: number;
    currentPowerWatts: number;
    fanSpeedPercent: number;
    clockSpeedGhz: number;
    vramUsedMb: number;
    health: DeviceHealthStatus;
    totalTasksCompleted: number;
    errorCount: number;
  };

  // Hardware Status Controls
  enabled: boolean;
  isRealHardwareDetected?: boolean;
  deviceAffinityWeights: Record<WorkloadType, number>; // 0.0 to 1.0 affinity multiplier
  notes: string;
}

/**
 * งานประมวลผลที่กระจายลงใน Heterogeneous Pipeline
 */
export interface HeterogeneousComputeTask {
  id: string;
  name: string;
  type: WorkloadType;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'BACKGROUND';
  dataPayloadSizeMb: number;
  assignedDeviceId: string | 'AUTO_BALANCED';
  targetPrecision: 'FP32' | 'FP16' | 'BF16' | 'INT8' | 'INT4';
  backendUsed: ComputeBackendAPI;
  status: 'PENDING' | 'DISPATCHING' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'FAILOVER_MIGRATED';
  executionTimeMs: number;
  throughputScore: number; // e.g. Tokens/sec, Frames/sec, or MegaRays/sec
  failoverHistory?: string[];
  createdAt: number;
}

/**
 * นโยบายการกระจายงานและการจัดสรรทรัพยากร
 */
export interface WorkloadDistributionPolicy {
  mode: 'BALANCED_THROUGHPUT' | 'POWER_EFFICIENCY' | 'LATENCY_CRITICAL' | 'VENDOR_AFFINITY_STRICT' | 'MANUAL_PINNING';
  enableCrossVendorSharding: boolean;
  enableDynamicWorkStealing: boolean;
  enableThermalWatchdog: boolean;
  maxTemperatureThresholdCelsius: number;
  enableAutoFailoverOnDriverHang: boolean;
  allowedVendors: ComputeVendor[];
}

/**
 * ภาพรวมสถานะของ Heterogeneous Cluster
 */
export interface HeterogeneousClusterTelemetry {
  totalNodes: number;
  activeNodes: number;
  totalFp32Tflops: number;
  totalInt8Tops: number;
  totalVramGb: number;
  usedVramGb: number;
  aggregatePowerWatts: number;
  aggregateUtilizationPercent: number;
  activeTasksCount: number;
  completedTasksCount: number;
  failoverSuccessCount: number;
  interconnectTopologyStatus: 'OPTIMAL' | 'DEGRADED_BUS' | 'EMULATED_BRIDGES';
}
