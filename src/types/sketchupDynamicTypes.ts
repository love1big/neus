/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript types and contracts for SketchUp Pro Dynamic Components
 *          & Parametric Attribute Formula Studio (SketchUp Dynamic Components parity).
 *          Defines Component Attributes (LenX, LenY, LenZ, RotZ, Copies, OnClick behaviors),
 *          Math Formulas (=Parent!LenX, =ANIMATE("RotZ", 0, 90)), Interactive Triggers,
 *          Bill of Materials (BOM), and On-Device Offline AI Formula & Tolerance Optimizers.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ SketchUp Pro Dynamic Components & Formula Math
 *          (เทียบเท่าระบบคอมโพเนนต์แบบไดนามิกและพารามิเตอร์สูตรใน SketchUp Pro)
 *          ครอบคลุมแอททริบิวต์มิติและตำแหน่ง (LenX, LenY, LenZ, RotZ), การกำหนดสูตรคณิตศาสตร์แบบกระจายตัว,
 *          พฤติกรรมโต้ตอบเมื่อคลิก (OnClick Animations เช่น บานประตูเปิด-ปิด), ตารางถอดปริมาณวัสดุ (BOM),
 *          และ AI ออฟไลน์ช่วยตรวจสอบความถูกต้องของสูตรพารามิเตอร์ (Zero-Token Guarantee)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `SketchUpDynamicEngineNode.ts` and `SketchUpDynamicComponentsStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Attribute Units: `INCHES`, `CENTIMETERS`, `DEGREES`
 * ============================================================================
 */

export interface DynamicAttribute {
  name: string;
  label: string;
  value: string | number;
  formula: string | null;
  unit: 'INCHES' | 'CENTIMETERS' | 'DEGREES' | 'TEXT';
  isEditableByUser: boolean;
}

export interface SketchUpDynamicProfile {
  componentName: string;
  description: string;
  isInteractedDoorOpen: boolean;
  attributes: DynamicAttribute[];
  bomQuantity: number;
  unitCostUSD: number;
  offlineAIFormulaInsight: string;
}
