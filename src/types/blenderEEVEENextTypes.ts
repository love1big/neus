/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript types and contracts for Blender EEVEE-Next Real-Time Raytracing
 *          & Screen-Space Global Illumination System (Blender 4.2+ EEVEE-Next parity).
 *          Defines Fast GI (Horizon Scan / Ray Marching), Screen Space Reflections (SSR),
 *          Subsurface Scattering (Burley random-walk), Volumetric Shadow Cascades,
 *          Light Probes (Irradiance Cache & Reflection Cubemaps), and On-Device Offline AI
 *          temporal denoising (Spatial Wavelet & Temporal Accumulation).
 *    - TH: สัญญา Interface และ Type สำหรับระบบเรนเดอร์ Blender EEVEE-Next Real-Time Raytracing
 *          (เทียบเท่า EEVEE-Next ใน Blender 4.2 LTS+)
 *          ครอบคลุมการคำนวณแสงตกกระทบทางอ้อมแบบเรียลไทม์ (Fast GI Horizon Scan),
 *          เงาสะท้อนในหน้าจอ (Screen Space Reflections), แสงทะลุเนื้อวัตถุ (Subsurface Scattering),
 *          หมอกควันปริมาตร (Volumetrics), และระบบ AI ดีนอยส์เซอร์ออฟไลน์แบบลดเม็ดทราย
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `BlenderEEVEENextEngineNode.ts` and `BlenderEEVEENextStudio.tsx`
 * ============================================================================
 */

export interface EEVEEQualityPreset {
  raySteps: number;
  reflectionResolution: 'HALF' | 'FULL';
  fastGIResolution: 'HALF' | 'FULL';
  volumetricTileSize: 2 | 4 | 8;
  denoiserEnabled: boolean;
}

export interface BlenderEEVEENextProfile {
  sceneName: string;
  viewportRenderSamples: number;
  fastGIEnabled: boolean;
  screenSpaceRaytracing: boolean;
  subsurfaceScattering: boolean;
  volumetricShadows: boolean;
  currentPreset: 'BALANCED' | 'ULTRA_CINEMATIC' | 'PERFORMANCE';
  settings: EEVEEQualityPreset;
  offlineAIDenoisingSummary: string;
}
