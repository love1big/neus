/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type definitions for the AAA Cinemachine Virtual Camera
 *          & Cine Camera Brain System (Unity Cinemachine & Unreal Cine Camera parity).
 *          Defines Virtual Cameras (vcam), Framing Transposers (Dead Zone, Soft Zone),
 *          Physical Lens Optics (Aperture f-stops, Focal Lengths, Sensor Formats),
 *          Camera Brain Blends, and 6-DOF Impulse Trauma Shakes.
 *    - TH: กำหนด Type และ Interface หลักสำหรับระบบ Cinemachine Virtual Camera และ Cine Camera
 *          ระดับ AAA (เทียบเท่า Unity Cinemachine และ Unreal Cine Camera Rig)
 *          ครอบคลุมกล้องเสมือน (VCam), กรอบ Framing Transposer (Dead Zone, Soft Zone),
 *          คุณสมบัติเลนส์จริง (Aperture f-stop, ทางยาวโฟกัส, ขนาดเซนเซอร์ Super 35 / Full Frame),
 *          การตัดต่อสลับกล้องแบบ Smooth Blend และระบบสั่นสะเทือนกล้อง 6-DOF Impulse
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `CinemachineRigBrainNode.ts` and `CinemachineVirtualCameraRigStudio.tsx`
 *    - Directly controls viewport render matrices and cinematic cutscene playback
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Interfaces: `VirtualCamera`, `CinemachineBrainSettings`, `PhysicalLensOptics`, `ImpulseShakePattern`
 * ============================================================================
 */

export type CameraBlendStyle = 'CUT' | 'EASE_IN_OUT' | 'SPHERICAL_BLEND' | 'SMOOTH_STEP' | 'LINEAR';

export type SensorFormatPreset = 'SUPER_35' | 'FULL_FRAME_35MM' | 'IMAX_70MM' | 'MICRO_4_3';

export interface PhysicalLensOptics {
  sensorFormat: SensorFormatPreset;
  focalLengthMm: number; // e.g. 24, 35, 50, 85mm
  apertureFStop: number; // e.g. 1.4, 2.8, 5.6
  focusDistanceMeters: number;
  depthOfFieldEnabled: boolean;
  chromaticAberration: number;
}

export interface FramingTransposerSettings {
  deadZoneWidth: number; // 0.0 - 1.0 (no camera movement)
  deadZoneHeight: number; // 0.0 - 1.0
  softZoneWidth: number; // 0.0 - 1.0 (smooth catch-up damping)
  softZoneHeight: number; // 0.0 - 1.0
  dampingX: number; // 0.1 - 2.0s
  dampingY: number;
  dampingZ: number;
  targetOffset: { x: number; y: number; z: number };
}

export interface VirtualCamera {
  id: string;
  name: string;
  priority: number; // Highest priority is selected by Cinemachine Brain
  isActive: boolean;
  fieldOfView: number; // 15 - 120 deg
  position: { x: number; y: number; z: number };
  rotation: { pitch: number; yaw: number; roll: number };
  targetDistance: number;
  framing: FramingTransposerSettings;
  optics: PhysicalLensOptics;
}

export interface ImpulseShakePattern {
  trauma: number; // 0.0 to 1.0 (decays quadratically)
  frequencyHz: number;
  decayRate: number; // trauma loss per second
  maxPitch: number; // degrees
  maxYaw: number;
  maxRoll: number;
  maxX: number; // translation meters
  maxY: number;
  maxZ: number;
}

export interface CinemachineBrainSettings {
  defaultBlend: CameraBlendStyle;
  defaultBlendDurationSec: number;
  updateMethod: 'LATE_UPDATE' | 'FIXED_UPDATE' | 'SMART_UPDATE';
}
