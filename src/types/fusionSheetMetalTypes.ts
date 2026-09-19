/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript types and contracts for Autodesk Fusion 360 Sheet Metal Flange Bending,
 *          K-Factor, Bend Allowance, Relief Cuts & 2D Flat Pattern Unfolding Studio (Fusion 360 Sheet Metal parity).
 *          Defines Material Gauge Rules (Thickness, K-Factor, Bend Radius), Flange Bends,
 *          Unfolded Flat Pattern Dimensions, Bend Lines, Press Brake Tonnage,
 *          and On-Device Offline AI Springback & Bend Deduction Tuning.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Autodesk Fusion 360 Sheet Metal Studio
 *          (เทียบเท่าระบบแผ่นโลหะขึ้นรูป Sheet Metal ใน Fusion 360)
 *          ครอบคลุมการคำนวณค่า K-Factor (ตำแหน่งแกนสะเทิน Neutral Axis), ค่า Bend Allowance,
 *          การพับปีกขอบ (Flanges), การคลี่แผ่นเรียบ 2D Flat Pattern สำหรับเลเซอร์คัตติ้ง,
 *          แรงกดของเครื่องพับ Press Brake, และระบบ AI ออฟไลน์คำนวณการดีดกลับของโลหะ (Springback)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `Fusion360SheetMetalEngineNode.ts` and `Fusion360SheetMetalStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Relief Types: `ROUND`, `RECTANGLE`, `TEAR`
 * ============================================================================
 */

export type BendReliefType = 'ROUND' | 'RECTANGLE' | 'TEAR';

export interface SheetMetalBend {
  bendId: string;
  angleDegrees: number; // e.g. 90
  innerRadiusMm: number; // e.g. 2.0 mm
  bendAllowanceMm: number;
  bendDeductionMm: number;
  direction: 'UP' | 'DOWN';
}

export interface FusionSheetMetalProfile {
  partName: string;
  materialName: string; // e.g. Stainless Steel 304, Aluminum 5052-H32
  thicknessMm: number;
  kFactor: number; // e.g. 0.44
  reliefType: BendReliefType;
  isUnfoldedFlatPattern: boolean;
  flatPatternWidthMm: number;
  flatPatternLengthMm: number;
  bends: SheetMetalBend[];
  pressBrakeTonnageRequired: number; // Tons
  offlineAISpringbackRecommendation: string;
}
