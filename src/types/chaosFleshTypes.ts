/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for the Chaos Flesh Soft-Body & Muscle
 *          Deformation System (Unreal Engine 5 Chaos Flesh & FEM soft-body parity).
 *          Defines Tetrahedral Mesh Nodes (Tet Nodes), Muscle Fibers, Fiber Contraction
 *          Values, Tendon Bone Constraints, Damping Coefficients, and Stress-Strain
 *          Tensor Heatmap thresholds.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Chaos Flesh Soft-Body & Muscle Deformation
 *          การจำลองการบิดตัวของกล้ามเนื้อและเนื้อเยื่ออ่อนระดับ AAA (เทียบเท่า UE5 Chaos Flesh)
 *          ครอบคลุมโครงข่ายเตตระฮีดรอล (Tetrahedral Mesh), เส้นใยกล้ามเนื้อ (Muscle Fibers),
 *          ค่าความตึงและการหดตัว (Contraction Value), จุดยึดกระดูกเอ็น (Tendon Bone Attachments),
 *          และระดับความเค้น-ความเครียด (Stress-Strain Tensors)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `ChaosFleshSimulationNode.ts` and `ChaosFleshMuscleDeformationStudio.tsx`
 * ============================================================================
 */

export interface TetVertex {
  id: number;
  restPos: [number, number, number];
  currentPos: [number, number, number];
  stress: number; // 0.0 (no stress) to 1.0 (max strain)
  isBonePinned: boolean;
}

export interface TetElement {
  id: number;
  vertexIndices: [number, number, number, number]; // 4 vertices forming tetrahedron
}

export interface MuscleFiber {
  id: string;
  name: string;
  directionVector: [number, number, number];
  activation: number; // 0.0 (relaxed) to 1.0 (fully flexed)
  maxContractileForceNewton: number;
}

export interface ChaosFleshRigProfile {
  id: string;
  name: string;
  muscleName: string;
  tetVertexCount: number;
  tetElementCount: number;
  youngsModulusKPa: number; // Stiffness
  poissonRatio: number; // Volume preservation (approx 0.48 for biological tissue)
  jiggleDamping: number;
}
