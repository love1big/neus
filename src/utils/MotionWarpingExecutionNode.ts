/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Motion Warping Trajectory & Root Motion Adaptation Engine (UE5 Motion Warping parity).
 *          Calculates dynamic sync points based on obstacle height/depth raycasts,
 *          scales character root motion transform in real-time, and provides live
 *          traversal interpolation.
 *    - TH: เอนจินคำนวณการปรับวิถีการเคลื่อนที่ของตัวละครตามจุด Sync Points
 *          (Motion Warping Engine Parity)
 *          คำนวณการดัดระยะการกระโดดข้ามสิ่งกีดขวาง (Obstacle Vaulting) ให้เข้ากับความสูง
 *          และความกว้างของวัตถุตรงหน้าแบบเรียลไทม์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `motionWarpingTypes.ts`
 *    - Consumed by `MotionWarpingParkourVaultStudio.tsx`
 * ============================================================================
 */

import {
  WarpStyle,
  WarpSyncPoint,
  ObstacleProfile,
  MotionWarpingState
} from '../types/motionWarpingTypes';

export class MotionWarpingExecutionNode {
  private static instance: MotionWarpingExecutionNode;

  private state: MotionWarpingState;
  private subscribers: Array<() => void> = [];

  private constructor() {
    const obstacle: ObstacleProfile = {
      id: 'obs_concrete_barrier',
      name: 'Modular Highway Barrier',
      heightMeters: 1.1,
      depthMeters: 0.8,
      distanceMeters: 2.2
    };

    this.state = {
      style: 'VAULT_OVER',
      obstacle,
      syncPoints: this.computeSyncPoints(obstacle),
      playbackProgress: 0.0,
      characterPosition: [0, 0, 0],
      isWarpingActive: false,
      translationWarpMultiplier: 1.15
    };
  }

  public static getInstance(): MotionWarpingExecutionNode {
    if (!MotionWarpingExecutionNode.instance) {
      MotionWarpingExecutionNode.instance = new MotionWarpingExecutionNode();
    }
    return MotionWarpingExecutionNode.instance;
  }

  private computeSyncPoints(obs: ObstacleProfile): WarpSyncPoint[] {
    return [
      {
        id: 'sync_hand_plant',
        name: 'Hand Plant on Crest',
        timeNormalized: 0.35,
        targetPosition: [obs.distanceMeters, obs.heightMeters, 0],
        warpTranslation: true,
        warpRotation: true
      },
      {
        id: 'sync_body_clearance',
        name: 'Body Apex Clearance',
        timeNormalized: 0.60,
        targetPosition: [obs.distanceMeters + obs.depthMeters * 0.5, obs.heightMeters + 0.35, 0],
        warpTranslation: true,
        warpRotation: false
      },
      {
        id: 'sync_feet_landing',
        name: 'Feet Landing on Ground',
        timeNormalized: 0.95,
        targetPosition: [obs.distanceMeters + obs.depthMeters + 1.2, 0, 0],
        warpTranslation: true,
        warpRotation: true
      }
    ];
  }

  public getState(): MotionWarpingState {
    return this.state;
  }

  public setObstacleDimensions(height: number, depth: number, distance: number): void {
    this.state.obstacle.heightMeters = height;
    this.state.obstacle.depthMeters = depth;
    this.state.obstacle.distanceMeters = distance;
    this.state.syncPoints = this.computeSyncPoints(this.state.obstacle);
    this.updateCharacterPosition();
    this.notify();
  }

  public setWarpStyle(style: WarpStyle): void {
    this.state.style = style;
    this.notify();
  }

  public setProgress(progress: number): void {
    this.state.playbackProgress = Math.max(0, Math.min(1, progress));
    this.updateCharacterPosition();
    this.notify();
  }

  private updateCharacterPosition(): void {
    const t = this.state.playbackProgress;
    const obs = this.state.obstacle;
    const totalDist = obs.distanceMeters + obs.depthMeters + 1.2;

    // Bezier-like curve for height
    const x = t * totalDist;
    let y = 0;

    if (t < 0.35) {
      // Ascending to obstacle
      y = (t / 0.35) * obs.heightMeters;
    } else if (t < 0.60) {
      // Over the obstacle
      const subT = (t - 0.35) / 0.25;
      y = obs.heightMeters + Math.sin(subT * Math.PI) * 0.35;
    } else {
      // Descending to landing
      const subT = (t - 0.60) / 0.40;
      y = Math.max(0, obs.heightMeters * (1 - subT));
    }

    this.state.characterPosition = [x, y, 0];
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

export const motionWarpingEngine = MotionWarpingExecutionNode.getInstance();
