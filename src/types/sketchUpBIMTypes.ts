/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for SketchUp Push/Pull & BIM Architectural
 *          Modeling System (Trimble SketchUp & LayOut BIM parity).
 *          Defines Face Extrusions (Push/Pull), Axis Inferences (Red/Green/Blue),
 *          Section Slicing Planes, IFC BIM metadata classification, and On-Device
 *          Offline AI 2D Floorplan-to-3D Building Synthesizers.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ SketchUp Push/Pull & BIM Architectural
 *          Modeling (เทียบเท่า Trimble SketchUp Pro และ BIM IFC)
 *          ครอบคลุมเครื่องมือดึง/กดหน้าตัดระนาบ (Push/Pull Engine), เส้นช่วยอิงแกนสี (Inference),
 *          การตัดระนาบส่วนตัดขวาง (Section Plane Slicing), แท็กข้อมูลอาคาร BIM (IFC2x3/4)
 *          และเอนจิน AI ออฟไลน์แปลงภาพแปลนบ้าน 2D เป็นแบบจำลอง 3D ทันที
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `SketchUpBIMEngineNode.ts` and `SketchUpPushPullBIMStudio.tsx`
 * ============================================================================
 */

export type BIMElementType = 'IfcWall' | 'IfcDoor' | 'IfcWindow' | 'IfcSlab' | 'IfcRoof';

export interface BIMEntity {
  id: string;
  name: string;
  type: BIMElementType;
  xMeters: number;
  yMeters: number;
  zMeters: number;
  widthMeters: number;
  depthMeters: number;
  heightMeters: number;
  materialColor: string;
}

export interface SketchUpBIMProfile {
  projectName: string;
  activeTool: 'SELECT' | 'PUSHPULL' | 'SECTION_PLANE' | 'TAPE_MEASURE' | 'OFFLINE_AI_FLOORPLAN';
  sectionPlaneActive: boolean;
  sectionCutHeightMeters: number;
  totalSquareMeters: number;
  entities: BIMEntity[];
  offlineAIBuildingStyle: 'MODERN_MINIMALIST' | 'THAI_TROPICAL_CONTEMPORARY' | 'NORDIC_SCANDINAVIAN';
}
