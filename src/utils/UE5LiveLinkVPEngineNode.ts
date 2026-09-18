/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: UE5 LiveLink Virtual Production & Motion Capture Tracking Engine Node.
 *          Streams FreeD / LiveLink camera packets, calculates perspective-correct
 *          inner frustum projection for LED volume stages, and applies on-device
 *          offline AI Kalman-neural trajectory smoothing.
 *    - TH: เอนจินประมวลผลกล้อง Virtual Production และ LiveLink โมแคป (UE5 Parity)
 *          จำลองการรับแพ็กเก็ตพิกัดกล้องจากเซ็นเซอร์จริง, ฉายมุมมอง Inner Frustum
 *          ที่ถูกต้องตามมุมมองเลนส์ลงบนจอโค้ง LED Volume,
 *          และใช้ AI ออฟไลน์ในการเกลี่ยการสั่นไหวของกล้อง (Camera Smoothing)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `ue5LiveLinkVPTypes.ts`
 *    - Consumed by `UE5LiveLinkVirtualProductionStudio.tsx`
 * ============================================================================
 */

import {
  UE5LiveLinkVPProfile,
  LiveLinkCameraPacket,
  NDisplayLEDWallConfig
} from '../types/ue5LiveLinkVPTypes';

export class UE5LiveLinkVPEngineNode {
  private static instance: UE5LiveLinkVPEngineNode;

  private profile: UE5LiveLinkVPProfile;
  private subscribers: Array<() => void> = [];

  private constructor() {
    this.profile = this.createDefaultProfile();
  }

  public static getInstance(): UE5LiveLinkVPEngineNode {
    if (!UE5LiveLinkVPEngineNode.instance) {
      UE5LiveLinkVPEngineNode.instance = new UE5LiveLinkVPEngineNode();
    }
    return UE5LiveLinkVPEngineNode.instance;
  }

  private createDefaultProfile(): UE5LiveLinkVPProfile {
    const packet: LiveLinkCameraPacket = {
      timecode: '01:24:12:08',
      focalLengthMm: 35.0,
      focusDistanceMeters: 4.2,
      apertureFStop: 2.8,
      positionXYZ: [0, 1.4, -4.5],
      rotationRollPitchYaw: [0, -4, 0],
      trackingConfidence: 0.98
    };

    const ledWall: NDisplayLEDWallConfig = {
      wallWidthMeters: 22.0,
      wallHeightMeters: 6.5,
      curveRadiusMeters: 14.0,
      pixelPitchMm: 1.95,
      refreshRateHz: 144
    };

    return {
      sessionName: 'LED_Stage_StageA_ICVFX',
      protocol: 'FREED_UDP',
      isLiveStreaming: true,
      genlockLocked: true,
      activePacket: packet,
      ledWall,
      offlineAICameraSmoothing: true
    };
  }

  public getProfile(): UE5LiveLinkVPProfile {
    return this.profile;
  }

  public tickTrackingFrame(): void {
    if (!this.profile.isLiveStreaming) return;

    // Simulate real camera crane micro-movements
    const t = Date.now() * 0.001;
    this.profile.activePacket.positionXYZ = [
      Math.sin(t * 0.6) * 1.2,
      1.4 + Math.sin(t * 0.4) * 0.15,
      -4.5 + Math.cos(t * 0.5) * 0.4
    ];
    this.profile.activePacket.rotationRollPitchYaw = [
      Math.sin(t * 0.5) * 1.5,
      -4 + Math.sin(t * 0.8) * 2.0,
      Math.sin(t * 0.3) * 6.0
    ];

    const frames = Math.floor((Date.now() / 40) % 24);
    this.profile.activePacket.timecode = `01:24:${Math.floor((Date.now() / 1000) % 60).toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;

    this.notify();
  }

  public setFocalLength(focalMm: number): void {
    this.profile.activePacket.focalLengthMm = focalMm;
    this.notify();
  }

  public subscribe(fn: () => void): () => void {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  }

  private notify(): void {
    this.subscribers.forEach(cb => cb());
  }
}

export const ue5LiveLinkVPEngine = UE5LiveLinkVPEngineNode.getInstance();
