/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript types and contracts for Blender Mantaflow Navier-Stokes Fluid,
 *          Smoke, Fire & FLIP Particle Simulation Studio (Blender Mantaflow parity).
 *          Defines Domain Resolution Divisions, Particle Advection Solvers (FLIP vs APIC),
 *          Vorticity / Buoyancy parameters, Surface Tension, OpenVDB Voxel Cache,
 *          and On-Device Offline AI Physics Parameter Tuner.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Blender Mantaflow Fluid & Smoke Physics Simulation
 *          (เทียบเท่าระบบจำลองของไหลและควัน Mantaflow Navier-Stokes ใน Blender)
 *          ครอบคลุมความละเอียด Domain Resolution (Voxels), วิธีการคำนวณอนุภาค FLIP และ APIC,
 *          แรงตึงผิว (Surface Tension), การหมุนวนของควัน (Vorticity), การแคชไฟล์ OpenVDB,
 *          และ AI ออฟไลน์ช่วยปรับจูนพารามิเตอร์ของไหลให้สมจริง
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `BlenderMantaflowEngineNode.ts` and `BlenderMantaflowFluidStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Solver Types: `FLIP`, `APIC`
 * ============================================================================
 */

export type FluidSolverType = 'FLIP' | 'APIC';

export interface BlenderMantaflowProfile {
  domainName: string;
  domainResolutionDivisions: number; // e.g. 128
  totalVoxelCount: number;
  solverType: FluidSolverType;
  viscosityBase: number;
  surfaceTension: number;
  buoyancyDensity: number;
  buoyancyHeat: number;
  vorticity: number;
  flipRatio: number; // 0.97 for FLIP, 0.0 for pure PIC
  isBaked: boolean;
  bakedFramesCount: number;
  offlineAIInsight: string;
}
