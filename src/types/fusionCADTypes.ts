/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for Autodesk Fusion 360 Parametric CAD
 *          & Generative Design System (Fusion 360 & Inventor parity).
 *          Defines B-Rep solids, sketch constraints (tangent, coincident, perpendicular),
 *          FEA load cases, structural preserve geometries, obstacle bodies, and
 *          On-Device Offline AI Topology Optimization iterations.
 *    - TH: สัญญา Interface และ Type สำหรับระบบโมเดลพารามิเตอร์ CAD และการออกแบบเชิงกำเนิด
 *          (Generative Design) เทียบเท่า Autodesk Fusion 360
 *          ครอบคลุมรูปทรงตัน B-Rep, ข้อจำกัดทางเรขาคณิต (Constraints), การรับแรงกดทางวิศวกรรม
 *          (FEA Structural Load Cases), วัตถุที่ต้องสงวนไว้ (Preserve Geometry)
 *          และเอนจิน AI ออฟไลน์ในการปรับโครงสร้างโมเดลให้เบาและแข็งแรงที่สุด
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `FusionCADGenerativeNode.ts` and `Fusion360GenerativeDesignCADStudio.tsx`
 * ============================================================================
 */

export type FusionManufacturingMethod = 'ADDITIVE_3D_PRINT' | 'CNC_5_AXIS_MILLING' | 'DIE_CASTING';

export interface FusionLoadCase {
  id: string;
  name: string;
  forceNewtons: number;
  directionVector: [number, number, number];
  safetyFactorTarget: number; // e.g. 2.5
}

export interface FusionGenerativeIteration {
  iterationIndex: number;
  massReductionPercent: number; // e.g. 48%
  maxVonMisesStressMPa: number; // e.g. 142 MPa
  complianceScore: number;
}

export interface FusionCADProfile {
  id: string;
  partName: string;
  material: 'TITANIUM_6AL_4V' | 'ALUMINUM_7075' | 'STAINLESS_STEEL_316L';
  manufacturingMethod: FusionManufacturingMethod;
  preserveVolumeMm3: number;
  obstacleVolumeMm3: number;
  currentIteration: number;
  totalIterations: number;
  isGenerating: boolean;
  loadCases: FusionLoadCase[];
  iterationsHistory: FusionGenerativeIteration[];
}
