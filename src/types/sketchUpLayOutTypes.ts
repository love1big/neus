/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for Trimble SketchUp LayOut Construction
 *          Documentation & Dimensioning System (SketchUp LayOut 2024 parity).
 *          Defines Orthographic Viewports (Top Plan, Front Elevation, Cross Section),
 *          Architectural Drawing Scales (1:50, 1:100), Associative Dimension Strings,
 *          Hatch Pattern fills, Title Blocks, and On-Device Offline AI automated
 *          architectural annotations.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ SketchUp LayOut เขียนแบบก่อสร้าง
 *          (Construction Documentation & Dimensioning)
 *          ครอบคลุมมุมมองฉายออร์โธกราฟิก (ผังพื้นแปลน, รูปด้าน, รูปตัด), มาตราส่วนแบบ (1:50, 1:100),
 *          เส้นบอกขนาดสถาปัตยกรรม (Dimension Strings), ลวดลายแรเงาวัสดุ (Hatch Patterns),
 *          ตารางข้อมูลกรอบแบบ (Title Block) และ AI ออฟไลน์ช่วยใส่ตัวเลขบอกขนาดอัตโนมัติ
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `SketchUpLayOutEngineNode.ts` and `SketchUpLayOutDocStudio.tsx`
 * ============================================================================
 */

export type DrawingScale = 'SCALE_1_20' | 'SCALE_1_50' | 'SCALE_1_100';

export interface DimensionString {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  measurementMeters: number;
  label: string;
}

export interface LayOutViewport {
  id: string;
  name: string;
  viewType: 'FLOOR_PLAN' | 'ELEVATION_SOUTH' | 'SECTION_A_A';
  scale: DrawingScale;
  renderMode: 'VECTOR' | 'RASTER' | 'HYBRID';
  dimensions: DimensionString[];
}

export interface SketchUpLayOutSheet {
  sheetNumber: string; // e.g. "A-101"
  sheetTitle: string; // e.g. "Ground Floor Architectural Plan"
  clientName: string;
  paperSize: 'ISO_A1' | 'ISO_A3';
  viewports: LayOutViewport[];
  offlineAIAutoDimension: boolean;
}
