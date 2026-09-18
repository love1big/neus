/**
 * ============================================================================
 * MODULE: detachablePanelTypes.ts
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * ประกาศโครงสร้าง Type และ Interface สำหรับระบบ Detachable Panel (แผงควบคุมแยกจอ)
 * รองรับการย้ายโมดูลสตูดิโอใดๆ ออกไปแสดงผลบนหน้าต่างเบราว์เซอร์แยก (Floating Window)
 * ผ่าน React Portal เพื่อรองรับการทำงานแบบ Multi-Monitor Setup ของนักพัฒนามืออาชีพ
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Consumed by: `OmniDetachablePanelManager.ts`, `DetachableWindowPortal.tsx`,
 *   `OmniEngineIDE.tsx`, `DetachablePanelsManagerModal.tsx`
 * ============================================================================
 */

import React from 'react';

export interface DetachedModuleMetadata {
  /** รหัสประจำโมดูล (e.g. 'OmniSoftwareIDEStudio', 'Viewport3D', 'OmniAudioStudio') */
  id: string;
  /** ชื่อภาษาไทย/อังกฤษของโมดูล */
  title: string;
  /** ไอคอนของโมดูลสำหรับแสดงผล */
  iconName?: string;
  /** เวลาที่ทำการแยกหน้าจอออกไป */
  detachedAt: number;
  /** พิกัดและขนาดของหน้าต่าง (Window Geometry) */
  geometry?: {
    width: number;
    height: number;
    left: number;
    top: number;
  };
  /** หน้าต่างเบราว์เซอร์ภายนอก (External Window Reference) */
  windowRef?: Window | null;
  /** โหมดการแสดงผล (native_window: จอแยกจริง, in_app_floating: โหมดลอยในโปรแกรมกรณีติดบล็อกเกอร์) */
  displayMode: 'native_window' | 'in_app_floating';
  /** สถานะการเชื่อมต่อ */
  status: 'active' | 'minimized' | 'focus_requested' | 'closed';
}

export interface DetachablePanelConfig {
  /** รหัสโมดูล */
  moduleId: string;
  /** ชื่อไตเติลของหน้าต่าง */
  title: string;
  /** ขนาดเริ่มต้นกว้าง */
  initialWidth?: number;
  /** ขนาดเริ่มต้นสูง */
  initialHeight?: number;
  /** พิกัดจอซ้ายเริ่มต้น */
  left?: number;
  /** พิกัดจอบนเริ่มต้น */
  top?: number;
  /** ฟังก์ชัน callback เมื่อผู้ใช้ปิดหน้าต่างแยก */
  onClose?: () => void;
  /** ฟังก์ชัน callback เมื่อหน้าต่างแยกถูกโฟกัส */
  onFocus?: () => void;
}

export interface MultiMonitorPreset {
  id: string;
  name: string;
  description: string;
  targetModules: string[];
}
