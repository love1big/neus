/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for the Lumen Surface Cache & Dynamic Global
 *          Illumination System (Unreal Engine 5 Lumen Architecture parity).
 *          Defines Surface Cache cards, Mesh Signed Distance Fields (SDF), Global SDF,
 *          Hardware vs Software Ray Tracing (HWRT vs SWRT), Radiance Cache probes,
 *          and indirect multi-bounce diffuse lighting telemetry.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Lumen Surface Cache & Dynamic Global
 *          Illumination (เทียบเท่าสถาปัตยกรรม Unreal Engine 5 Lumen)
 *          ครอบคลุมการแคชพื้นผิว (Surface Cache Cards), สนามระยะทางเครื่องหมาย (Mesh SDF),
 *          การสลับระหว่างการยิงรังสีแบบฮาร์ดแวร์และซอฟต์แวร์ (HWRT / SWRT),
 *          โพรบกระจายแสงสะท้อนทางอ้อมหลายรอบ (Multi-Bounce Indirect GI)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `LumenGIArchitectureNode.ts` and `LumenSurfaceCacheGlobalIlluminationStudio.tsx`
 * ============================================================================
 */

export type LumenRayTracingMode = 'SOFTWARE_SDF' | 'HARDWARE_RAYTRACING' | 'SCREEN_TRACES_HYBRID';

export type LumenDebugViewMode = 'LUMEN_SCENE' | 'SURFACE_CACHE' | 'MESH_SDF' | 'GLOBAL_SDF' | 'RADIANCE_PROBES';

export interface LumenSurfaceCard {
  id: string;
  meshName: string;
  cardIndex: number;
  worldPosition: [number, number, number];
  orientationNormal: [number, number, number];
  sizeMeters: [number, number];
  atlasResolutionPx: number; // e.g. 128
  albedoColor: string;
}

export interface LumenRadianceProbe {
  id: string;
  position: [number, number, number];
  radianceIntensity: number; // Lux
  indirectColorHex: string;
}

export interface LumenGIProfile {
  id: string;
  name: string;
  rtMode: LumenRayTracingMode;
  debugView: LumenDebugViewMode;
  maxBounces: number; // e.g. 4
  surfaceCacheResolutionScale: number; // 0.5 to 2.0
  rayStepDistanceMeters: number;
  radianceGatherQuality: number; // 1 to 4
  totalSurfaceCardsAllocated: number;
  totalSDFMeshesResident: number;
  gpuFrameTimeMs: number;
}
