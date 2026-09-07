/**
 * ============================================================================
 * MODULE: Heterogeneous Device Registry & Hardware Probe Node
 * FILE: src/utils/HeterogeneousDeviceRegistryNode.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * โมดูลนี้ทำหน้าที่เป็นสารบบหลัก (Master Registry) และระบบสำรวจตรวจสอบอุปกรณ์ฮาร์ดแวร์
 * (Hardware Discovery Engine) ค้นหาและบันทึกข้อมูลสเปกของ CPU, GPU, NPU และ TPU
 * จากหลากหลายผู้ผลิต (Multi-Vendor: NVIDIA, AMD, Intel, Apple, Qualcomm, Google,
 * Tenstorrent, Groq) พร้อมตรวจจับฮาร์ดแวร์จริงของเครื่องผู้ใช้ผ่าน WebGPU / WebGL / WebNN
 * 
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - ให้บริการรายชื่อโหนดฮาร์ดแวร์ที่พร้อมใช้งานแก่ MultiVendorWorkloadDispatcherNode
 * - ซิงค์ข้อมูลกับ HeterogeneousMemoryFabricNode เพื่อวางแผนจัดสรร Memory Pool
 * - รายงานค่า Telemetry และตรวจจับ Thermal Throttling ร่วมกับ CrossVendorFaultToleranceWatchdogNode
 * 
 * ============================================================================
 */

import { 
  HeterogeneousComputeNode, 
  ComputeVendor, 
  ComputeDeviceClass,
  WorkloadType
} from '../types/heterogeneousCompute';

export class HeterogeneousDeviceRegistryNode {
  private static instance: HeterogeneousDeviceRegistryNode;
  private nodes: Map<string, HeterogeneousComputeNode> = new Map();
  private isBrowserHardwareProbed = false;

  private constructor() {
    this.initializeDefaultMultiVendorCatalog();
  }

  public static getInstance(): HeterogeneousDeviceRegistryNode {
    if (!HeterogeneousDeviceRegistryNode.instance) {
      HeterogeneousDeviceRegistryNode.instance = new HeterogeneousDeviceRegistryNode();
    }
    return HeterogeneousDeviceRegistryNode.instance;
  }

  /**
   * สร้างรายชื่ออุปกรณ์เริ่มต้นที่จำลองคลัสเตอร์ระดับมืออาชีพข้ามยี่ห้อ (Multi-Vendor Topology)
   */
  private initializeDefaultMultiVendorCatalog(): void {
    const defaultDevices: HeterogeneousComputeNode[] = [
      // 1. [NVIDIA] Ada Lovelace Flagship Discrete GPU
      {
        id: 'node-nv-rtx4090',
        name: 'NVIDIA GeForce RTX 4090 OC',
        vendor: 'NVIDIA',
        deviceClass: 'GPU_DISCRETE',
        architecture: 'Ada Lovelace AD102 (TSMC 4N)',
        interconnect: 'PCIE_GEN5_X16',
        supportedBackends: ['WebGPU', 'CUDA', 'TensorRT', 'Vulkan', 'DirectX12'],
        preferredBackend: 'CUDA',
        coreCount: 16384, // CUDA Cores + 512 Tensor Cores + 128 RT Cores
        baseClockGhz: 2.23,
        boostClockGhz: 2.52,
        memoryPool: {
          totalMb: 24576,
          allocatedMb: 9200,
          type: 'GDDR6X',
          bandwidthGbps: 1008,
          isUnifiedWithHost: false
        },
        fp32Tflops: 82.6,
        fp16Tflops: 165.2,
        int8Tops: 660.8,
        tdpWatts: 450,
        telemetry: {
          utilizationPercent: 78,
          temperatureCelsius: 64,
          currentPowerWatts: 340,
          fanSpeedPercent: 62,
          clockSpeedGhz: 2.55,
          vramUsedMb: 9200,
          health: 'HEALTHY',
          totalTasksCompleted: 1420,
          errorCount: 0
        },
        enabled: true,
        deviceAffinityWeights: {
          RAYTRACING_BVH: 1.0,
          GRAPHICS_RASTER: 0.95,
          NEURAL_INFERENCE_LLM: 0.90,
          NEURAL_VISION_CV: 0.92,
          PHYSICS_COLLISION_ECS: 0.70,
          AUDIO_DSP_SYNTHESIS: 0.40,
          VIDEO_ENCODE_AV1: 0.88,
          OCTREE_TERRAIN_PCG: 0.75
        },
        notes: 'Primary GPU assigned to Hardware Ray Tracing, BVH Tree Traversal & Matrix Math.'
      },

      // 2. [AMD] RDNA 3 Chiplet High-Throughput Discrete GPU
      {
        id: 'node-amd-rx7900xtx',
        name: 'AMD Radeon RX 7900 XTX',
        vendor: 'AMD',
        deviceClass: 'GPU_DISCRETE',
        architecture: 'RDNA 3 Navi 31 Chiplet (5nm GCD + 6nm MCD)',
        interconnect: 'PCIE_GEN5_X16',
        supportedBackends: ['WebGPU', 'ROCm_HIP', 'Vulkan', 'DirectX12'],
        preferredBackend: 'ROCm_HIP',
        coreCount: 12288, // 96 Compute Units / Stream Processors
        baseClockGhz: 2.30,
        boostClockGhz: 2.50,
        memoryPool: {
          totalMb: 24576,
          allocatedMb: 7800,
          type: 'GDDR6',
          bandwidthGbps: 960,
          isUnifiedWithHost: false
        },
        fp32Tflops: 61.4,
        fp16Tflops: 122.8,
        int8Tops: 245.6,
        tdpWatts: 355,
        telemetry: {
          utilizationPercent: 68,
          temperatureCelsius: 61,
          currentPowerWatts: 285,
          fanSpeedPercent: 55,
          clockSpeedGhz: 2.48,
          vramUsedMb: 7800,
          health: 'HEALTHY',
          totalTasksCompleted: 1180,
          errorCount: 0
        },
        enabled: true,
        deviceAffinityWeights: {
          RAYTRACING_BVH: 0.65,
          GRAPHICS_RASTER: 0.98,
          NEURAL_INFERENCE_LLM: 0.75,
          NEURAL_VISION_CV: 0.80,
          PHYSICS_COLLISION_ECS: 0.90,
          AUDIO_DSP_SYNTHESIS: 0.60,
          VIDEO_ENCODE_AV1: 0.85,
          OCTREE_TERRAIN_PCG: 0.92
        },
        notes: 'Dedicated to Asynchronous Compute, Chaos Physics Fluid Simulation & Raster Shading.'
      },

      // 3. [INTEL] Arc Xe2 Battlemage Discrete GPU & Video Encoder
      {
        id: 'node-intel-b580',
        name: 'Intel Arc Battlemage B580',
        vendor: 'Intel',
        deviceClass: 'GPU_DISCRETE',
        architecture: 'Xe2-HPG Battlemage (TSMC N4)',
        interconnect: 'PCIE_GEN5_X16',
        supportedBackends: ['WebGPU', 'oneAPI_SYCL', 'OpenVINO', 'Vulkan', 'DirectX12'],
        preferredBackend: 'oneAPI_SYCL',
        coreCount: 4096, // 20 Xe-cores + 160 XMX AI Engines
        baseClockGhz: 2.67,
        boostClockGhz: 2.85,
        memoryPool: {
          totalMb: 12288,
          allocatedMb: 3600,
          type: 'GDDR6',
          bandwidthGbps: 456,
          isUnifiedWithHost: false
        },
        fp32Tflops: 26.5,
        fp16Tflops: 53.0,
        int8Tops: 212.0,
        tdpWatts: 190,
        telemetry: {
          utilizationPercent: 54,
          temperatureCelsius: 56,
          currentPowerWatts: 145,
          fanSpeedPercent: 48,
          clockSpeedGhz: 2.70,
          vramUsedMb: 3600,
          health: 'HEALTHY',
          totalTasksCompleted: 890,
          errorCount: 0
        },
        enabled: true,
        deviceAffinityWeights: {
          RAYTRACING_BVH: 0.60,
          GRAPHICS_RASTER: 0.75,
          NEURAL_INFERENCE_LLM: 0.72,
          NEURAL_VISION_CV: 0.88,
          PHYSICS_COLLISION_ECS: 0.50,
          AUDIO_DSP_SYNTHESIS: 0.45,
          VIDEO_ENCODE_AV1: 1.0,
          OCTREE_TERRAIN_PCG: 0.55
        },
        notes: 'XMX AI Denoising, Super-Resolution XeSS & Dual Hardware AV1 Video Transcoding Engine.'
      },

      // 4. [APPLE] Apple Silicon M4 Pro Unified GPU & Compute Engine
      {
        id: 'node-apple-m4pro',
        name: 'Apple M4 Pro 20-Core Unified GPU',
        vendor: 'Apple',
        deviceClass: 'GPU_INTEGRATED',
        architecture: 'Apple Dynamic Caching Architecture (TSMC 3nm)',
        interconnect: 'APPLE_UNIFIED_FABRIC',
        supportedBackends: ['WebGPU', 'Metal', 'CoreML'],
        preferredBackend: 'Metal',
        coreCount: 2560,
        baseClockGhz: 1.40,
        boostClockGhz: 1.80,
        memoryPool: {
          totalMb: 49152, // 48GB Unified RAM
          allocatedMb: 16400,
          type: 'Unified_Fabric',
          bandwidthGbps: 273,
          isUnifiedWithHost: true
        },
        fp32Tflops: 18.4,
        fp16Tflops: 36.8,
        int8Tops: 147.2,
        tdpWatts: 45,
        telemetry: {
          utilizationPercent: 48,
          temperatureCelsius: 49,
          currentPowerWatts: 38,
          fanSpeedPercent: 35,
          clockSpeedGhz: 1.75,
          vramUsedMb: 16400,
          health: 'HEALTHY',
          totalTasksCompleted: 950,
          errorCount: 0
        },
        enabled: true,
        deviceAffinityWeights: {
          RAYTRACING_BVH: 0.70,
          GRAPHICS_RASTER: 0.80,
          NEURAL_INFERENCE_LLM: 0.95, // Zero-copy massive unified memory fits 32B+ LLMs without VRAM transfer!
          NEURAL_VISION_CV: 0.82,
          PHYSICS_COLLISION_ECS: 0.65,
          AUDIO_DSP_SYNTHESIS: 0.85,
          VIDEO_ENCODE_AV1: 0.78,
          OCTREE_TERRAIN_PCG: 0.80
        },
        notes: 'Ultra-low latency Unified Memory Pool. Ideal for zero-copy 32B parameter LLM context.'
      },

      // 5. [APPLE] Apple 16-Core Neural Engine (Dedicated NPU)
      {
        id: 'node-apple-ane',
        name: 'Apple 16-Core Neural Engine (ANE)',
        vendor: 'Apple',
        deviceClass: 'NPU_DEDICATED',
        architecture: 'Apple Spatial Matrix Neural Engine',
        interconnect: 'DIRECT_DIE_SRAM',
        supportedBackends: ['WebNN', 'CoreML'],
        preferredBackend: 'CoreML',
        coreCount: 16,
        baseClockGhz: 1.20,
        boostClockGhz: 1.50,
        memoryPool: {
          totalMb: 2048,
          allocatedMb: 1100,
          type: 'Direct_SRAM',
          bandwidthGbps: 350,
          isUnifiedWithHost: true
        },
        fp32Tflops: 0.0,
        fp16Tflops: 19.0,
        int8Tops: 38.0,
        tdpWatts: 8,
        telemetry: {
          utilizationPercent: 82,
          temperatureCelsius: 41,
          currentPowerWatts: 6.5,
          fanSpeedPercent: 0,
          clockSpeedGhz: 1.45,
          vramUsedMb: 1100,
          health: 'HEALTHY',
          totalTasksCompleted: 2150,
          errorCount: 0
        },
        enabled: true,
        deviceAffinityWeights: {
          RAYTRACING_BVH: 0.0,
          GRAPHICS_RASTER: 0.0,
          NEURAL_INFERENCE_LLM: 0.85,
          NEURAL_VISION_CV: 0.95,
          PHYSICS_COLLISION_ECS: 0.10,
          AUDIO_DSP_SYNTHESIS: 0.95, // Exceptional for Neural Vocoder & TTS Dubbing!
          VIDEO_ENCODE_AV1: 0.10,
          OCTREE_TERRAIN_PCG: 0.05
        },
        notes: 'Extreme energy efficiency NPU for live Thai/Global Phonetics, TTS Dubbing & Audio Vocoder.'
      },

      // 6. [AMD] Ryzen AI XDNA 2 Dedicated NPU
      {
        id: 'node-amd-xdna2',
        name: 'AMD Ryzen AI XDNA 2 NPU',
        vendor: 'AMD',
        deviceClass: 'NPU_DEDICATED',
        architecture: 'XDNA 2 Spatial Dataflow Array (Phoenix/Strix)',
        interconnect: 'INFINITY_FABRIC',
        supportedBackends: ['WebNN', 'OpenVINO', 'ROCm_HIP'],
        preferredBackend: 'WebNN',
        coreCount: 32, // 32 Spatial AIE Tiles
        baseClockGhz: 1.30,
        boostClockGhz: 1.60,
        memoryPool: {
          totalMb: 4096,
          allocatedMb: 1850,
          type: 'Direct_SRAM',
          bandwidthGbps: 420,
          isUnifiedWithHost: true
        },
        fp32Tflops: 0.0,
        fp16Tflops: 25.0,
        int8Tops: 50.0,
        tdpWatts: 15,
        telemetry: {
          utilizationPercent: 74,
          temperatureCelsius: 46,
          currentPowerWatts: 11.2,
          fanSpeedPercent: 20,
          clockSpeedGhz: 1.55,
          vramUsedMb: 1850,
          health: 'HEALTHY',
          totalTasksCompleted: 1740,
          errorCount: 0
        },
        enabled: true,
        deviceAffinityWeights: {
          RAYTRACING_BVH: 0.0,
          GRAPHICS_RASTER: 0.0,
          NEURAL_INFERENCE_LLM: 0.92,
          NEURAL_VISION_CV: 0.90,
          PHYSICS_COLLISION_ECS: 0.20,
          AUDIO_DSP_SYNTHESIS: 0.70,
          VIDEO_ENCODE_AV1: 0.10,
          OCTREE_TERRAIN_PCG: 0.15
        },
        notes: 'Copilot+ PC certified 50 TOPS NPU with Block FP16 precision for offline vector search.'
      },

      // 7. [QUALCOMM] Snapdragon X Elite Hexagon NPU & Oryon Core
      {
        id: 'node-qc-hexagon',
        name: 'Qualcomm Hexagon NPU (Snapdragon X)',
        vendor: 'Qualcomm',
        deviceClass: 'NPU_DEDICATED',
        architecture: 'Hexagon Vector eXtension (HVX) + Tensor Accelerator (HTA)',
        interconnect: 'QNN_DIRECT_DMA',
        supportedBackends: ['WebNN', 'Qualcomm_QNN'],
        preferredBackend: 'Qualcomm_QNN',
        coreCount: 8,
        baseClockGhz: 1.50,
        boostClockGhz: 1.70,
        memoryPool: {
          totalMb: 3072,
          allocatedMb: 1400,
          type: 'Direct_SRAM',
          bandwidthGbps: 384,
          isUnifiedWithHost: true
        },
        fp32Tflops: 0.0,
        fp16Tflops: 22.5,
        int8Tops: 45.0,
        tdpWatts: 12,
        telemetry: {
          utilizationPercent: 60,
          temperatureCelsius: 42,
          currentPowerWatts: 8.8,
          fanSpeedPercent: 0,
          clockSpeedGhz: 1.65,
          vramUsedMb: 1400,
          health: 'HEALTHY',
          totalTasksCompleted: 1320,
          errorCount: 0
        },
        enabled: true,
        deviceAffinityWeights: {
          RAYTRACING_BVH: 0.0,
          GRAPHICS_RASTER: 0.0,
          NEURAL_INFERENCE_LLM: 0.88,
          NEURAL_VISION_CV: 0.85,
          PHYSICS_COLLISION_ECS: 0.15,
          AUDIO_DSP_SYNTHESIS: 0.65,
          VIDEO_ENCODE_AV1: 0.20,
          OCTREE_TERRAIN_PCG: 0.10
        },
        notes: 'Micro-watt power profile NPU. Excellent for background telemetry & anomaly detection.'
      },

      // 8. [INTEL] Core Ultra 9 285K Multi-Thread CPU (Arrow Lake)
      {
        id: 'node-intel-cpu-285k',
        name: 'Intel Core Ultra 9 285K (24 Cores / AVX-512)',
        vendor: 'Intel',
        deviceClass: 'CPU',
        architecture: 'Arrow Lake (8 Lion Cove P-Cores + 16 Skymont E-Cores)',
        interconnect: 'SYSTEM_DDR5_BUS',
        supportedBackends: ['WASM_SIMD128', 'oneAPI_SYCL', 'OpenVINO'],
        preferredBackend: 'WASM_SIMD128',
        coreCount: 24,
        baseClockGhz: 3.20,
        boostClockGhz: 5.70,
        memoryPool: {
          totalMb: 65536, // 64GB DDR5 System RAM
          allocatedMb: 24800,
          type: 'DDR5',
          bandwidthGbps: 102,
          isUnifiedWithHost: true
        },
        fp32Tflops: 4.8,
        fp16Tflops: 9.6,
        int8Tops: 38.4,
        tdpWatts: 250,
        telemetry: {
          utilizationPercent: 44,
          temperatureCelsius: 58,
          currentPowerWatts: 110,
          fanSpeedPercent: 45,
          clockSpeedGhz: 4.80,
          vramUsedMb: 24800,
          health: 'HEALTHY',
          totalTasksCompleted: 3400,
          errorCount: 0
        },
        enabled: true,
        deviceAffinityWeights: {
          RAYTRACING_BVH: 0.35,
          GRAPHICS_RASTER: 0.20,
          NEURAL_INFERENCE_LLM: 0.60,
          NEURAL_VISION_CV: 0.50,
          PHYSICS_COLLISION_ECS: 1.0, // Best for deterministic CPU physics & branch prediction!
          AUDIO_DSP_SYNTHESIS: 0.90,
          VIDEO_ENCODE_AV1: 0.40,
          OCTREE_TERRAIN_PCG: 1.0  // Master node for Procedural Map & Octree voxelization!
        },
        notes: 'Deterministic ECS Tick, Navigation Mesh pathfinding & Voxel Terrain Generation.'
      },

      // 9. [TENSTORRENT] Wormhole Tensix RISC-V AI Accelerator
      {
        id: 'node-tt-wormhole',
        name: 'Tenstorrent Wormhole Tensix AI Processor',
        vendor: 'Tenstorrent',
        deviceClass: 'TPU_LPU_ACCELERATOR',
        architecture: '80 Tensix RISC-V Vector-Tensor Cores',
        interconnect: 'PCIE_GEN4_X16',
        supportedBackends: ['WebNN', 'Vulkan'],
        preferredBackend: 'WebNN',
        coreCount: 80,
        baseClockGhz: 1.00,
        boostClockGhz: 1.20,
        memoryPool: {
          totalMb: 12288,
          allocatedMb: 4200,
          type: 'GDDR6',
          bandwidthGbps: 288,
          isUnifiedWithHost: false
        },
        fp32Tflops: 0.0,
        fp16Tflops: 75.0,
        int8Tops: 300.0,
        tdpWatts: 160,
        telemetry: {
          utilizationPercent: 52,
          temperatureCelsius: 51,
          currentPowerWatts: 92,
          fanSpeedPercent: 40,
          clockSpeedGhz: 1.15,
          vramUsedMb: 4200,
          health: 'HEALTHY',
          totalTasksCompleted: 760,
          errorCount: 0
        },
        enabled: true,
        deviceAffinityWeights: {
          RAYTRACING_BVH: 0.0,
          GRAPHICS_RASTER: 0.0,
          NEURAL_INFERENCE_LLM: 0.98, // Native RISC-V Tenstorrent TT-Buda Matrix Engine!
          NEURAL_VISION_CV: 0.88,
          PHYSICS_COLLISION_ECS: 0.10,
          AUDIO_DSP_SYNTHESIS: 0.30,
          VIDEO_ENCODE_AV1: 0.0,
          OCTREE_TERRAIN_PCG: 0.20
        },
        notes: 'RISC-V Tensix Architecture. High-throughput non-Von Neumann token streaming.'
      },

      // 10. [GROQ] GroqCard LPU (Language Processing Unit)
      {
        id: 'node-groq-lpu',
        name: 'GroqCard LPU (Language Processing Unit)',
        vendor: 'Groq',
        deviceClass: 'TPU_LPU_ACCELERATOR',
        architecture: 'Deterministic Tensor Streaming Processor (230MB SRAM)',
        interconnect: 'CXL_3_0',
        supportedBackends: ['WebNN', 'Vulkan'],
        preferredBackend: 'WebNN',
        coreCount: 220,
        baseClockGhz: 0.90,
        boostClockGhz: 1.05,
        memoryPool: {
          totalMb: 230, // Pure on-chip ultra-fast SRAM!
          allocatedMb: 180,
          type: 'Direct_SRAM',
          bandwidthGbps: 80000, // 80 TB/s on-chip SRAM bandwidth!
          isUnifiedWithHost: false
        },
        fp32Tflops: 0.0,
        fp16Tflops: 188.0,
        int8Tops: 750.0,
        tdpWatts: 185,
        telemetry: {
          utilizationPercent: 91,
          temperatureCelsius: 59,
          currentPowerWatts: 165,
          fanSpeedPercent: 58,
          clockSpeedGhz: 1.05,
          vramUsedMb: 180,
          health: 'HEALTHY',
          totalTasksCompleted: 4500,
          errorCount: 0
        },
        enabled: true,
        deviceAffinityWeights: {
          RAYTRACING_BVH: 0.0,
          GRAPHICS_RASTER: 0.0,
          NEURAL_INFERENCE_LLM: 1.0, // Sub-second 500+ tokens/sec LLM streaming!
          NEURAL_VISION_CV: 0.60,
          PHYSICS_COLLISION_ECS: 0.05,
          AUDIO_DSP_SYNTHESIS: 0.20,
          VIDEO_ENCODE_AV1: 0.0,
          OCTREE_TERRAIN_PCG: 0.0
        },
        notes: 'Zero memory latency LPU. 500+ Tokens/sec instant offline dialogue inference.'
      }
    ];

    defaultDevices.forEach(device => {
      this.nodes.set(device.id, device);
    });
  }

  /**
   * ดึงรายการโหนดประมวลผลทั้งหมดในสารบบ
   */
  public getAllNodes(): HeterogeneousComputeNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * ดึงโหนดที่เปิดใช้งาน (Enabled) เท่านั้น
   */
  public getActiveNodes(): HeterogeneousComputeNode[] {
    return this.getAllNodes().filter(n => n.enabled);
  }

  /**
   * ดึงโหนดตาม Device ID
   */
  public getNodeById(id: string): HeterogeneousComputeNode | undefined {
    return this.nodes.get(id);
  }

  /**
   * สลับเปิด/ปิดการใช้งานโหนด (Enable / Disable)
   */
  public toggleNodeEnabled(id: string): boolean {
    const node = this.nodes.get(id);
    if (node) {
      node.enabled = !node.enabled;
      return node.enabled;
    }
    return false;
  }

  /**
   * ตรวจจับฮาร์ดแวร์จริงของผู้ใช้ในบราวเซอร์ (WebGPU / WebGL / Navigator)
   */
  public async probeRealBrowserHardware(): Promise<{
    detectedGpuRenderer: string;
    detectedGpuVendor: string;
    logicalCores: number;
    estimatedMemoryGb: number;
    hasWebGpu: boolean;
    hasWebNn: boolean;
  }> {
    if (this.isBrowserHardwareProbed) {
      // คืนค่าที่ตรวจพบแล้ว
      const existingRealNode = this.getAllNodes().find(n => n.isRealHardwareDetected);
      return {
        detectedGpuRenderer: existingRealNode?.name || 'Probed GPU',
        detectedGpuVendor: existingRealNode?.vendor || 'Unknown',
        logicalCores: navigator.hardwareConcurrency || 8,
        estimatedMemoryGb: (navigator as any).deviceMemory || 16,
        hasWebGpu: !!((navigator as any).gpu),
        hasWebNn: !!((navigator as any).ml)
      };
    }

    let detectedGpuRenderer = 'Standard Graphics Adapter';
    let detectedGpuVendor: ComputeVendor = 'Generic_x86';
    const logicalCores = navigator.hardwareConcurrency || 8;
    const estimatedMemoryGb = (navigator as any).deviceMemory || 16;
    const hasWebGpu = !!((navigator as any).gpu);
    const hasWebNn = !!((navigator as any).ml);

    // 1. ตรวจผ่าน WebGL Unmasked Info
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const rendererStr = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          const vendorStr = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          if (rendererStr) detectedGpuRenderer = rendererStr;
          
          const lowerStr = (rendererStr + ' ' + vendorStr).toLowerCase();
          if (lowerStr.includes('nvidia') || lowerStr.includes('geforce') || lowerStr.includes('rtx')) {
            detectedGpuVendor = 'NVIDIA';
          } else if (lowerStr.includes('amd') || lowerStr.includes('radeon')) {
            detectedGpuVendor = 'AMD';
          } else if (lowerStr.includes('intel') || lowerStr.includes('iris') || lowerStr.includes('arc')) {
            detectedGpuVendor = 'Intel';
          } else if (lowerStr.includes('apple') || lowerStr.includes('metal')) {
            detectedGpuVendor = 'Apple';
          } else if (lowerStr.includes('qualcomm') || lowerStr.includes('adreno')) {
            detectedGpuVendor = 'Qualcomm';
          }
        }
      }
    } catch {
      // WebGL Probe fallback
    }

    // 2. ตรวจผ่าน WebGPU Adapter
    if (hasWebGpu) {
      try {
        const adapter = await (navigator as any).gpu.requestAdapter();
        if (adapter) {
          const info = await (adapter as any).requestAdapterInfo?.();
          if (info) {
            if (info.description) detectedGpuRenderer = info.description;
            if (info.vendor) {
              const v = info.vendor.toLowerCase();
              if (v.includes('nvidia')) detectedGpuVendor = 'NVIDIA';
              else if (v.includes('amd')) detectedGpuVendor = 'AMD';
              else if (v.includes('intel')) detectedGpuVendor = 'Intel';
              else if (v.includes('apple')) detectedGpuVendor = 'Apple';
            }
          }
        }
      } catch {
        // WebGPU probe fallback
      }
    }

    // สร้าง Node ฮาร์ดแวร์จริงของผู้ใช้แทรกเข้าไปใน Registry
    const realHardwareNode: HeterogeneousComputeNode = {
      id: 'node-real-host-device',
      name: `[Host Physical Device] ${detectedGpuRenderer}`,
      vendor: detectedGpuVendor,
      deviceClass: 'GPU_DISCRETE',
      architecture: 'Detected Host Architecture',
      interconnect: 'PCIE_GEN4_X16',
      supportedBackends: hasWebGpu ? ['WebGPU', 'Vulkan'] : ['WASM_SIMD128'],
      preferredBackend: hasWebGpu ? 'WebGPU' : 'WASM_SIMD128',
      coreCount: logicalCores * 128,
      baseClockGhz: 2.1,
      boostClockGhz: 2.8,
      memoryPool: {
        totalMb: Math.max(4096, estimatedMemoryGb * 1024 / 2),
        allocatedMb: 1200,
        type: 'GDDR6',
        bandwidthGbps: 448,
        isUnifiedWithHost: false
      },
      fp32Tflops: 14.5,
      fp16Tflops: 29.0,
      int8Tops: 58.0,
      tdpWatts: 150,
      telemetry: {
        utilizationPercent: 42,
        temperatureCelsius: 52,
        currentPowerWatts: 85,
        fanSpeedPercent: 40,
        clockSpeedGhz: 2.4,
        vramUsedMb: 1200,
        health: 'HEALTHY',
        totalTasksCompleted: 420,
        errorCount: 0
      },
      enabled: true,
      isRealHardwareDetected: true,
      deviceAffinityWeights: {
        GRAPHICS_RASTER: 1.0,
        RAYTRACING_BVH: 0.8,
        NEURAL_INFERENCE_LLM: 0.75,
        NEURAL_VISION_CV: 0.8,
        PHYSICS_COLLISION_ECS: 0.8,
        AUDIO_DSP_SYNTHESIS: 0.7,
        VIDEO_ENCODE_AV1: 0.85,
        OCTREE_TERRAIN_PCG: 0.75
      },
      notes: `Direct physical client device detected in browser session (${logicalCores} CPU threads, ${estimatedMemoryGb} GB Host RAM).`
    };

    this.nodes.set(realHardwareNode.id, realHardwareNode);
    this.isBrowserHardwareProbed = true;

    return {
      detectedGpuRenderer,
      detectedGpuVendor,
      logicalCores,
      estimatedMemoryGb,
      hasWebGpu,
      hasWebNn
    };
  }

  /**
   * อัปเดตค่า Telemetry ของโหนดตามกิจกรรมที่เกิดขึ้นแบบเรียลไทม์
   */
  public updateTelemetry(id: string, delta: Partial<HeterogeneousComputeNode['telemetry']>): void {
    const node = this.nodes.get(id);
    if (node) {
      node.telemetry = {
        ...node.telemetry,
        ...delta
      };
    }
  }

  /**
   * คำนวณสรุปผลรวมสถิติคลัสเตอร์ (Cluster Summary Telemetry)
   */
  public computeClusterAggregateSummary() {
    const activeNodes = this.getActiveNodes();
    const totalFp32Tflops = activeNodes.reduce((sum, n) => sum + n.fp32Tflops, 0);
    const totalInt8Tops = activeNodes.reduce((sum, n) => sum + n.int8Tops, 0);
    const totalVramMb = activeNodes.reduce((sum, n) => sum + n.memoryPool.totalMb, 0);
    const usedVramMb = activeNodes.reduce((sum, n) => sum + n.telemetry.vramUsedMb, 0);
    const aggregatePowerWatts = activeNodes.reduce((sum, n) => sum + n.telemetry.currentPowerWatts, 0);
    const aggregateUtilization = activeNodes.length > 0
      ? activeNodes.reduce((sum, n) => sum + n.telemetry.utilizationPercent, 0) / activeNodes.length
      : 0;

    return {
      totalNodes: this.nodes.size,
      activeNodes: activeNodes.length,
      totalFp32Tflops: Number(totalFp32Tflops.toFixed(1)),
      totalInt8Tops: Number(totalInt8Tops.toFixed(1)),
      totalVramGb: Number((totalVramMb / 1024).toFixed(1)),
      usedVramGb: Number((usedVramMb / 1024).toFixed(1)),
      aggregatePowerWatts: Math.round(aggregatePowerWatts),
      aggregateUtilizationPercent: Math.round(aggregateUtilization)
    };
  }
}
