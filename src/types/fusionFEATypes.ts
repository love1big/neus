/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript types and contracts for Autodesk Fusion 360 Non-Linear
 *          Finite Element Analysis (FEA) Stress & Thermal Simulation Studio (Fusion 360 FEA parity).
 *          Defines Structural Constraints (Fixed, Pinned, Frictionless), Load Conditions
 *          (Force Newtons, Pressure MPa, Moment, Gravity), Von Mises Stress Tensors,
 *          Displacement (mm), Safety Factors (Yield / Ultimate tensile strength), Mesh Tet Elements,
 *          and On-Device Offline AI Topology Optimization and stress concentration prediction.
 *    - TH: สัญญา Interface และ Type สำหรับระบบจำลองความเค้นและถ่ายเทความร้อน Autodesk Fusion 360
 *          Finite Element Analysis (FEA) Stress & Thermal Simulation (เทียบเท่า Fusion 360 Simulation)
 *          ครอบคลุมการกำหนดจุดยึด (Fixed Constraints), แรงกดภายนอก (Force & Pressure),
 *          การวิเคราะห์ค่าความเค้น Von Mises Stress, ระยะการเสียรูปโก่งงอ (Displacement),
 *          ค่าสัมประสิทธิ์ความปลอดภัย (Safety Factor), และ AI ออฟไลน์ช่วยปรับปรุงโครงสร้างเพื่อลดน้ำหนัก
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `Fusion360FEASimulationEngineNode.ts` and `Fusion360FEASimulationStudio.tsx`
 * ============================================================================
 */

export interface FEAConstraint {
  id: string;
  type: 'FIXED' | 'PINNED' | 'FRICTIONLESS';
  targetFace: string;
}

export interface FEALoad {
  id: string;
  type: 'FORCE' | 'PRESSURE' | 'MOMENT' | 'GRAVITY';
  magnitudeNewtons: number;
  directionVector: [number, number, number];
  targetFace: string;
}

export interface FusionFEAProfile {
  studyName: string;
  materialName: string;
  yieldStrengthMPa: number;
  meshElementCount: number;
  maxVonMisesStressMPa: number;
  minSafetyFactor: number;
  maxDisplacementMm: number;
  constraints: FEAConstraint[];
  loads: FEALoad[];
  simulationSolved: boolean;
  offlineAITopologyRecommendation: string;
}
