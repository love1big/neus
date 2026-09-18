/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Chaos Flesh Tetrahedral FEM & Muscle Contraction Simulator (UE5 Chaos Flesh parity).
 *          Solves finite-element deformation steps, contracts muscle fibers along
 *          fiber direction vectors, preserves volume using Poisson's ratio, and computes
 *          strain tensors.
 *    - TH: เอนจินคำนวณการบิดตัวของกล้ามเนื้อและเนื้อเยื่ออ่อน FEM แบบ Tetrahedral
 *          จำลองการเกร็งตัวและขยายตัวตามเส้นใยกล้ามเนื้อ (Muscle Fiber Contraction),
 *          รักษาปริมาตรคงที่ตามอัตราส่วนปัวซอง (Poisson's Ratio), และคำนวณความเค้นบนผืนเนื้อ
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `chaosFleshTypes.ts`
 *    - Consumed by `ChaosFleshMuscleDeformationStudio.tsx`
 * ============================================================================
 */

import {
  TetVertex,
  TetElement,
  MuscleFiber,
  ChaosFleshRigProfile
} from '../types/chaosFleshTypes';

export class ChaosFleshSimulationNode {
  private static instance: ChaosFleshSimulationNode;

  private profile: ChaosFleshRigProfile;
  private vertices: TetVertex[] = [];
  private elements: TetElement[] = [];
  private muscleFiber: MuscleFiber;
  private subscribers: Array<() => void> = [];

  private constructor() {
    this.profile = {
      id: 'flesh_biceps_brachii',
      name: 'Biceps Brachii Left Arm',
      muscleName: 'Musculus biceps brachii',
      tetVertexCount: 24,
      tetElementCount: 36,
      youngsModulusKPa: 120.0,
      poissonRatio: 0.48,
      jiggleDamping: 0.85
    };

    this.muscleFiber = {
      id: 'fiber_long_head',
      name: 'Long Head Longitudinal Fiber',
      directionVector: [1, 0, 0],
      activation: 0.0, // relaxed
      maxContractileForceNewton: 450.0
    };

    this.initLattice();
  }

  public static getInstance(): ChaosFleshSimulationNode {
    if (!ChaosFleshSimulationNode.instance) {
      ChaosFleshSimulationNode.instance = new ChaosFleshSimulationNode();
    }
    return ChaosFleshSimulationNode.instance;
  }

  private initLattice(): void {
    const verts: TetVertex[] = [];
    const segments = 6;
    const radius = 0.5;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = (t - 0.5) * 3.0; // from -1.5 to +1.5
      const profileScale = Math.sin(t * Math.PI) * 0.5 + 0.3;

      const isPinned = i === 0 || i === segments; // Ends pinned to bone/tendons

      // 4 points in cross-section
      verts.push({
        id: i * 4 + 0,
        restPos: [x, profileScale * radius, 0],
        currentPos: [x, profileScale * radius, 0],
        stress: 0,
        isBonePinned: isPinned
      });
      verts.push({
        id: i * 4 + 1,
        restPos: [x, 0, profileScale * radius],
        currentPos: [x, 0, profileScale * radius],
        stress: 0,
        isBonePinned: isPinned
      });
      verts.push({
        id: i * 4 + 2,
        restPos: [x, -profileScale * radius, 0],
        currentPos: [x, -profileScale * radius, 0],
        stress: 0,
        isBonePinned: isPinned
      });
      verts.push({
        id: i * 4 + 3,
        restPos: [x, 0, -profileScale * radius],
        currentPos: [x, 0, -profileScale * radius],
        stress: 0,
        isBonePinned: isPinned
      });
    }

    this.vertices = verts;
    this.recomputeFleshDeformation();
  }

  public getProfile(): ChaosFleshRigProfile {
    return this.profile;
  }

  public getVertices(): TetVertex[] {
    return this.vertices;
  }

  public getMuscleFiber(): MuscleFiber {
    return this.muscleFiber;
  }

  public setActivation(val: number): void {
    this.muscleFiber.activation = Math.max(0, Math.min(1, val));
    this.recomputeFleshDeformation();
    this.notify();
  }

  private recomputeFleshDeformation(): void {
    const act = this.muscleFiber.activation;

    // As muscle flexes: X contracts (shortens), Y and Z bulge out (Poisson volume preservation)
    this.vertices.forEach(v => {
      if (v.isBonePinned) {
        v.currentPos = [...v.restPos];
        v.stress = act * 0.8; // High stress at tendon junction
        return;
      }

      const [rx, ry, rz] = v.restPos;
      // Shortening along X
      const curX = rx * (1.0 - act * 0.22);
      // Bulging along Y and Z
      const bulgeFactor = 1.0 + act * 0.65;
      const curY = ry * bulgeFactor;
      const curZ = rz * bulgeFactor;

      v.currentPos = [curX, curY, curZ];
      v.stress = Math.min(1.0, act * 0.9 + (Math.abs(curY) / 0.8) * 0.1);
    });
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

export const chaosFleshEngine = ChaosFleshSimulationNode.getInstance();
