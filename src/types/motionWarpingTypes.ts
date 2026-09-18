/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for the Motion Warping & Dynamic Parkour Vaulting
 *          System (Unreal Engine 5 Motion Warping & AAA dynamic traversal parity).
 *          Defines Sync Points (Hands on ledge, crest, landing), Warp Targets,
 *          Root Motion Scale Curves (Translation & Rotation Warping), and Obstacle
 *          Collision Bounds.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Motion Warping และการกระโดดข้ามสิ่งกีดขวาง
 *          (Parkour Vaulting) ระดับ AAA (เทียบเท่า Unreal Engine 5 Motion Warping)
 *          ครอบคลุมการกำหนดจุดเชื่อมโยง (Sync Points: จุดวางมือ, จุดจุดข้ามสิ่งกีดขวาง, จุดลงสู่พื้น),
 *          การบิดดัดสเกลการเคลื่อนที่ Root Motion (Translation & Rotation Warping),
 *          และการตรวจวัดขนาดความสูง/ความลึกของสิ่งกีดขวางด้วย Raycast
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `MotionWarpingExecutionNode.ts` and `MotionWarpingParkourVaultStudio.tsx`
 * ============================================================================
 */

export type WarpStyle = 'VAULT_OVER' | 'MANTLE_HIGH' | 'STEP_UP' | 'SLIDE_UNDER';

export interface WarpSyncPoint {
  id: string;
  name: string;
  timeNormalized: number; // 0.0 to 1.0 along animation
  targetPosition: [number, number, number]; // x, y, z in world coordinates
  warpTranslation: boolean;
  warpRotation: boolean;
}

export interface ObstacleProfile {
  id: string;
  name: string;
  heightMeters: number;
  depthMeters: number;
  distanceMeters: number;
}

export interface MotionWarpingState {
  style: WarpStyle;
  obstacle: ObstacleProfile;
  syncPoints: WarpSyncPoint[];
  playbackProgress: number; // 0.0 to 1.0
  characterPosition: [number, number, number];
  isWarpingActive: boolean;
  translationWarpMultiplier: number;
}
