/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for Autodesk Fusion 360 CAM & Multi-Axis
 *          CNC Machining System (Fusion 360 CAM & HSMWorks parity).
 *          Defines Milling Operations (3D Adaptive Clearing, 5-Axis Swarf, Chamfer),
 *          Tool Libraries (Endmill, Ballnose), Spindle RPM, Feed Rates, G-Code outputs
 *          (Fanuc/Haas ISO G-Code), and On-Device Offline AI feed rate optimization.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Fusion 360 CAM และเครื่องกัดซีเอ็นซีหลายแกน
 *          (CNC Multi-Axis Toolpath Machining)
 *          ครอบคลุมการกัดหยาบลดเวลา (3D Adaptive Clearing), การเก็บละเอียด 5 แกน, คลังหัวกัด
 *          (Tool Library: Flat Endmill, Ballnose), ค่ารอบสปินเดิล (RPM), ความเร็วป้อน (Feed Rate),
 *          รหัสคำสั่ง G-Code (Haas / Fanuc) และ AI ออฟไลน์ในการป้องกันดอกกัดหัก
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `FusionCAMToolpathEngineNode.ts` and `Fusion360CAMToolpathStudio.tsx`
 * ============================================================================
 */

export type CNCMachinePost = 'HAAS_NGC_5AXIS' | 'FANUC_31I' | 'HEIDENHAIN_TNC640';

export interface CNCTool {
  id: string;
  name: string;
  type: 'FLAT_ENDMILL' | 'BALLNOSE' | 'BULLNOSE' | 'CHAMFER';
  diameterMm: number;
  flutes: number;
  maxRpm: number;
}

export interface CNCOperation {
  id: string;
  name: string;
  strategy: '3D_ADAPTIVE_CLEARING' | 'PARALLEL_FINISHING' | '5_AXIS_SWARF' | 'CONTOUR';
  toolId: string;
  spindleRpm: number;
  cuttingFeedRateMmMin: number;
  leadInFeedRateMmMin: number;
  estimatedTimeSeconds: number;
  collisionDetected: boolean;
}

export interface FusionCAMProfile {
  partName: string;
  postProcessor: CNCMachinePost;
  stockDimensionsXYZ: [number, number, number]; // mm
  tools: CNCTool[];
  operations: CNCOperation[];
  generatedGCodeSnippet: string[];
  offlineAIOptimizeFeed: boolean;
}
