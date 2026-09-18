/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for Unreal Engine 5 LiveLink Virtual
 *          Production & Motion Capture Studio (UE5 Virtual Production & nDisplay parity).
 *          Defines LiveLink UDP packet streams (FreeD / VRPN protocols), nDisplay
 *          in-camera VFX (ICVFX) frustum calculations, SMPTE Genlock timecodes,
 *          Brown-Conrady lens distortion calibration, and On-Device Offline AI
 *          markerless camera pose smoothing.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Unreal Engine 5 LiveLink Virtual
 *          Production & Motion Capture (เทียบเท่า UE5 nDisplay & LiveLink)
 *          ครอบคลุมการรับส่งข้อมูลโปรโตคอลกล้อง LiveLink UDP (FreeD / VRPN),
 *          การคำนวณ Frustum มุมกล้องฉายขึ้นจอ LED Wall (nDisplay In-Camera VFX),
 *          การซิงค์สัญญาณเวลา Genlock SMPTE, และ AI ออฟไลน์ในการปรับความนิ่งของโมแคป
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `UE5LiveLinkVPEngineNode.ts` and `UE5LiveLinkVirtualProductionStudio.tsx`
 * ============================================================================
 */

export interface LiveLinkCameraPacket {
  timecode: string; // e.g. "01:14:22:18"
  focalLengthMm: number; // e.g. 35.0mm
  focusDistanceMeters: number;
  apertureFStop: number;
  positionXYZ: [number, number, number];
  rotationRollPitchYaw: [number, number, number];
  trackingConfidence: number; // 0.0 - 1.0
}

export interface NDisplayLEDWallConfig {
  wallWidthMeters: number;
  wallHeightMeters: number;
  curveRadiusMeters: number;
  pixelPitchMm: number; // e.g. 1.9mm
  refreshRateHz: number; // e.g. 144Hz
}

export interface UE5LiveLinkVPProfile {
  sessionName: string;
  protocol: 'FREED_UDP' | 'VRPN' | 'OPTITRACK_NATNET';
  isLiveStreaming: boolean;
  genlockLocked: boolean;
  activePacket: LiveLinkCameraPacket;
  ledWall: NDisplayLEDWallConfig;
  offlineAICameraSmoothing: boolean;
}
