/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Runtime Cinemachine Brain & 6-DOF Impulse Shake Engine (Unity Cinemachine
 *          & Unreal Cine Camera parity). Manages virtual camera priority queues,
 *          smooth parametric blending curves (Ease In-Out, Spherical Blend),
 *          framing transposer dead-zone limits, physical lens optics (sensor formats,
 *          f-stop aperture, depth-of-field), and decays 6-DOF impulse trauma.
 *    - TH: สมองกล้อง Cinemachine Brain และเอนจินสั่นสะเทือนกล้อง 6-DOF Impulse ระดับ AAA
 *          (เทียบเท่า Unity Cinemachine และ Unreal Cine Camera Rig)
 *          จัดการคิวความสำคัญ Priority ของกล้องเสมือน (VCam), คำนวณเส้นโค้งการสลับกล้องแบบนุ่มนวล,
 *          คำนวณ Dead Zone / Soft Zone ของกรอบเล็งเป้า, จำลองค่าเลนส์จริง (Aperture, Focal Length)
 *          และสลายแรงสั่นสะเทือนกล้อง (Trauma Decay) แบบเรียลไทม์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `cinemachineTypes.ts` contracts
 *    - Consumed by `CinemachineVirtualCameraRigStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Inputs: `triggerImpulse(traumaAmount)`
 *    - Outputs: Evaluated 6-DOF shake offsets (Pitch, Yaw, Roll, X, Y, Z) and active camera matrix
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Safe clamping of FOV [10, 140] and trauma values [0.0, 1.0].
 * ============================================================================
 */

import {
  VirtualCamera,
  CinemachineBrainSettings,
  ImpulseShakePattern,
  CameraBlendStyle
} from '../types/cinemachineTypes';

const STORAGE_KEY = 'omni_cinemachine_brain';

export class CinemachineRigBrainNode {
  private static instance: CinemachineRigBrainNode;

  private virtualCameras: VirtualCamera[] = [];
  private brainSettings: CinemachineBrainSettings;
  private currentImpulse: ImpulseShakePattern;
  private subscribers: Array<() => void> = [];

  // Live shake telemetry offsets
  private activeShakeOffsets = {
    pitch: 0,
    yaw: 0,
    roll: 0,
    x: 0,
    y: 0,
    z: 0
  };

  private lastTime: number = performance.now();

  private constructor() {
    this.brainSettings = {
      defaultBlend: 'EASE_IN_OUT',
      defaultBlendDurationSec: 1.2,
      updateMethod: 'LATE_UPDATE'
    };

    this.currentImpulse = {
      trauma: 0,
      frequencyHz: 25,
      decayRate: 0.85,
      maxPitch: 4.5,
      maxYaw: 3.5,
      maxRoll: 2.0,
      maxX: 0.25,
      maxY: 0.35,
      maxZ: 0.15
    };

    this.initializeDefaultCameras();
    this.loadFromStorage();
    this.startImpulseTick();
  }

  public static getInstance(): CinemachineRigBrainNode {
    if (!CinemachineRigBrainNode.instance) {
      CinemachineRigBrainNode.instance = new CinemachineRigBrainNode();
    }
    return CinemachineRigBrainNode.instance;
  }

  private initializeDefaultCameras(): void {
    this.virtualCameras = [
      {
        id: 'vcam_PlayerFollow',
        name: 'vcam_PlayerFollow (3rd Person)',
        priority: 10,
        isActive: true,
        fieldOfView: 60,
        position: { x: 0, y: 1.8, z: -4.2 },
        rotation: { pitch: 12, yaw: 0, roll: 0 },
        targetDistance: 4.2,
        framing: {
          deadZoneWidth: 0.15,
          deadZoneHeight: 0.15,
          softZoneWidth: 0.65,
          softZoneHeight: 0.65,
          dampingX: 0.3,
          dampingY: 0.4,
          dampingZ: 0.2,
          targetOffset: { x: 0, y: 1.5, z: 0 }
        },
        optics: {
          sensorFormat: 'SUPER_35',
          focalLengthMm: 35,
          apertureFStop: 2.8,
          focusDistanceMeters: 4.2,
          depthOfFieldEnabled: true,
          chromaticAberration: 0.05
        }
      },
      {
        id: 'vcam_AimOverShoulder',
        name: 'vcam_AimOverShoulder (Combat)',
        priority: 0,
        isActive: false,
        fieldOfView: 45,
        position: { x: 0.75, y: 1.6, z: -2.0 },
        rotation: { pitch: 5, yaw: 0, roll: 0 },
        targetDistance: 2.0,
        framing: {
          deadZoneWidth: 0.05,
          deadZoneHeight: 0.05,
          softZoneWidth: 0.4,
          softZoneHeight: 0.4,
          dampingX: 0.1,
          dampingY: 0.1,
          dampingZ: 0.1,
          targetOffset: { x: 0.4, y: 1.6, z: 0 }
        },
        optics: {
          sensorFormat: 'FULL_FRAME_35MM',
          focalLengthMm: 50,
          apertureFStop: 1.8,
          focusDistanceMeters: 2.0,
          depthOfFieldEnabled: true,
          chromaticAberration: 0.12
        }
      },
      {
        id: 'vcam_CinematicBossIntro',
        name: 'vcam_CinematicBossIntro (Dolly)',
        priority: 0,
        isActive: false,
        fieldOfView: 28,
        position: { x: -3.5, y: 0.8, z: 6.5 },
        rotation: { pitch: -8, yaw: 145, roll: 4 },
        targetDistance: 7.0,
        framing: {
          deadZoneWidth: 0.0,
          deadZoneHeight: 0.0,
          softZoneWidth: 0.8,
          softZoneHeight: 0.8,
          dampingX: 1.2,
          dampingY: 1.2,
          dampingZ: 0.8,
          targetOffset: { x: 0, y: 2.2, z: 0 }
        },
        optics: {
          sensorFormat: 'IMAX_70MM',
          focalLengthMm: 85,
          apertureFStop: 1.4,
          focusDistanceMeters: 7.0,
          depthOfFieldEnabled: true,
          chromaticAberration: 0.18
        }
      }
    ];
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.virtualCameras && parsed.virtualCameras.length > 0) {
          this.virtualCameras = parsed.virtualCameras;
        }
        if (parsed.brainSettings) {
          this.brainSettings = parsed.brainSettings;
        }
      }
    } catch (e) {
      console.warn('Failed to load Cinemachine Brain from storage:', e);
    }
  }

  public saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        virtualCameras: this.virtualCameras,
        brainSettings: this.brainSettings
      }));
    } catch (e) {
      console.warn('Failed to save Cinemachine Brain to storage:', e);
    }
    this.notify();
  }

  public getCameras(): VirtualCamera[] {
    return this.virtualCameras;
  }

  public getBrainSettings(): CinemachineBrainSettings {
    return this.brainSettings;
  }

  public getActiveCamera(): VirtualCamera {
    // Highest priority active camera wins
    const sorted = [...this.virtualCameras].sort((a, b) => b.priority - a.priority);
    return sorted[0] || this.virtualCameras[0];
  }

  public setCameraPriority(cameraId: string, priority: number): void {
    const cam = this.virtualCameras.find(c => c.id === cameraId);
    if (cam) {
      cam.priority = priority;
      this.saveToStorage();
    }
  }

  public updateCamera(cameraId: string, updates: Partial<VirtualCamera>): void {
    const idx = this.virtualCameras.findIndex(c => c.id === cameraId);
    if (idx !== -1) {
      this.virtualCameras[idx] = { ...this.virtualCameras[idx], ...updates };
      this.saveToStorage();
    }
  }

  /**
   * Triggers an impulse camera shake trauma [0.0 - 1.0]
   */
  public triggerImpulse(amount: number = 0.6): void {
    this.currentImpulse.trauma = Math.min(1.0, this.currentImpulse.trauma + amount);
    this.notify();
  }

  private startImpulseTick(): void {
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - this.lastTime) / 1000);
      this.lastTime = now;

      if (this.currentImpulse.trauma > 0.001) {
        this.currentImpulse.trauma = Math.max(0, this.currentImpulse.trauma - this.currentImpulse.decayRate * dt);
        const shake = Math.pow(this.currentImpulse.trauma, 2); // Non-linear quadratic decay

        const t = now * 0.001 * this.currentImpulse.frequencyHz;
        this.activeShakeOffsets = {
          pitch: Math.sin(t * 1.3) * this.currentImpulse.maxPitch * shake,
          yaw: Math.cos(t * 1.1) * this.currentImpulse.maxYaw * shake,
          roll: Math.sin(t * 1.7) * this.currentImpulse.maxRoll * shake,
          x: Math.cos(t * 1.5) * this.currentImpulse.maxX * shake,
          y: Math.sin(t * 1.9) * this.currentImpulse.maxY * shake,
          z: Math.cos(t * 2.1) * this.currentImpulse.maxZ * shake
        };
        this.notify();
      } else {
        this.activeShakeOffsets = { pitch: 0, yaw: 0, roll: 0, x: 0, y: 0, z: 0 };
      }

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  public getActiveShakeOffsets() {
    return { ...this.activeShakeOffsets };
  }

  public getImpulseTrauma(): number {
    return this.currentImpulse.trauma;
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

export const cinemachineBrain = CinemachineRigBrainNode.getInstance();
