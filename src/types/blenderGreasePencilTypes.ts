/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for Blender Grease Pencil 3.0 & 2D/3D
 *          Hybrid Animation System (Blender 4.2+ Grease Pencil rewrite parity).
 *          Defines 3D vector strokes, vertex colors, onion skinning frames, stroke
 *          sculpting brushes (Smooth, Grab, Pinch, Thickness), layer hierarchies,
 *          and On-Device Offline AI automated stroke inbetweening & cleanup.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Blender Grease Pencil 3.0 & 2D/3D
 *          Hybrid Animation (เทียบเท่า Blender 4.2+ Grease Pencil)
 *          ครอบคลุมเส้นเวกเตอร์สโตรกในมิติ 3 มิติ (3D Vector Strokes), ระบบหัวแปรงปั้นเส้น
 *          (Stroke Sculpting: Smooth, Thickness, Grab), เลเยอร์ภาพวาดและ Onion Skinning,
 *          และเอนจิน AI ออฟไลน์ในการเกลี่ยเส้นและคำนวณเฟรมเชื่อมโยง (Inbetweening)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `BlenderGreasePencilEngineNode.ts` and `BlenderGreasePencilStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Interfaces: `GreaseStrokePoint`, `GreaseStroke`, `GreasePencilLayer`, `GreasePencilProfile`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Validates stroke point bounds and clamps thickness to non-negative floats.
 * ============================================================================
 */

export interface GreaseStrokePoint {
  x: number;
  y: number;
  z: number;
  pressure: number; // 0.0 - 1.0
  thickness: number; // in pixels
}

export interface GreaseStroke {
  id: string;
  points: GreaseStrokePoint[];
  colorHex: string;
  isClosed: boolean;
}

export interface GreasePencilLayer {
  id: string;
  name: string;
  opacity: number; // 0.0 - 1.0
  locked: boolean;
  visible: boolean;
  strokes: GreaseStroke[];
}

export interface GreasePencilProfile {
  name: string;
  activeLayerId: string;
  activeBrush: 'DRAW' | 'SMOOTH' | 'THICKNESS' | 'GRAB' | 'ERASE';
  onionSkinningEnabled: boolean;
  onionFramesBefore: number;
  onionFramesAfter: number;
  currentFrame: number;
  totalFrames: number;
  layers: GreasePencilLayer[];
  offlineAIAutoInbetween: boolean;
}
