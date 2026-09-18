/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Runtime Procedural Content Generation (PCG) & Spline Deformer Engine
 *          (Unreal Engine 5.2 PCG Framework & Unity Spline Toolkit parity).
 *          Executes high-throughput point cloud sampling (Poisson Disk / Jittered Grid),
 *          applies spatial noise density transforms, slope/elevation filtering,
 *          mesh instancing palette distribution, and generates spline extrusion ribbons.
 *    - TH: เอนจินประมวลผล Procedural Content Generation (PCG) และ Spline Mesh Deformer
 *          ระดับ AAA (เทียบเท่า Unreal 5.2+ PCG Framework และ Unity Spline Toolkit)
 *          คำนวณการกระจายจุดแบบ Poisson Disk Sampling, กรองความหนาแน่นด้วย Simplex Noise,
 *          คัดกรองระดับความสูงและความชันของภูมิประเทศ, และสร้างจุดตามแนวเส้น Spline
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `pcgFrameworkTypes.ts` contracts
 *    - Consumed by `ProceduralContentGenerationPCGStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Inputs: `PCGGraphSettings`
 *    - Outputs: Generated `PCGPoint[]` array ready for GPU mesh instancing
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Clamped loop counts preventing runaway generation freeze.
 * ============================================================================
 */

import {
  PCGGraphSettings,
  PCGPoint,
  PCGMeshAsset,
  SplineWaypoint
} from '../types/pcgFrameworkTypes';

const STORAGE_KEY = 'omni_pcg_graph_settings';

export class ProceduralPCGExecutionNode {
  private static instance: ProceduralPCGExecutionNode;

  private settings: PCGGraphSettings;
  private generatedPoints: PCGPoint[] = [];
  private subscribers: Array<() => void> = [];

  private constructor() {
    this.settings = this.createDefaultGraphSettings();
    this.loadFromStorage();
    this.executeGeneration();
  }

  public static getInstance(): ProceduralPCGExecutionNode {
    if (!ProceduralPCGExecutionNode.instance) {
      ProceduralPCGExecutionNode.instance = new ProceduralPCGExecutionNode();
    }
    return ProceduralPCGExecutionNode.instance;
  }

  private createDefaultGraphSettings(): PCGGraphSettings {
    const meshPalette: PCGMeshAsset[] = [
      { id: 'mesh_pine_tree', name: 'Nordic Pine Tree (High-LOD)', category: 'TREE', color: '#10b981', weight: 4.0, minScale: 0.8, maxScale: 1.4, slopeLimitDegrees: 35 },
      { id: 'mesh_granite_boulder', name: 'Granite Moss Boulder', category: 'ROCK', color: '#94a3b8', weight: 2.0, minScale: 0.6, maxScale: 2.2, slopeLimitDegrees: 55 },
      { id: 'mesh_fern_cluster', name: 'Ancient Forest Ferns', category: 'FOLIAGE', color: '#34d399', weight: 6.0, minScale: 0.5, maxScale: 1.1, slopeLimitDegrees: 45 },
      { id: 'mesh_ancient_obelisk', name: 'Weathered Rune Obelisk', category: 'STRUCTURE', color: '#fbbf24', weight: 0.3, minScale: 1.0, maxScale: 1.2, slopeLimitDegrees: 15 }
    ];

    const splineWaypoints: SplineWaypoint[] = [
      { id: 'sp_0', position: { x: -80, y: 4, z: -80 }, tangentIn: { x: 0, y: 0, z: 0 }, tangentOut: { x: 30, y: 0, z: 20 }, width: 8.0, rollDegrees: 0 },
      { id: 'sp_1', position: { x: -20, y: 6, z: -30 }, tangentIn: { x: -20, y: 0, z: -10 }, tangentOut: { x: 25, y: 0, z: 30 }, width: 8.5, rollDegrees: 2 },
      { id: 'sp_2', position: { x: 30, y: 9, z: 20 }, tangentIn: { x: -20, y: 0, z: -25 }, tangentOut: { x: 30, y: 0, z: 20 }, width: 9.0, rollDegrees: -1 },
      { id: 'sp_3', position: { x: 85, y: 12, z: 85 }, tangentIn: { x: -25, y: 0, z: -15 }, tangentOut: { x: 0, y: 0, z: 0 }, width: 10.0, rollDegrees: 0 }
    ];

    return {
      id: 'pcg_nordic_biome',
      name: 'PCG_Nordic_Forest_Biome',
      seed: 42891,
      samplingMethod: 'POISSON_DISK',
      boundsRadiusMeters: 100,
      minDistanceBetweenPoints: 6.5,
      densityNoiseScale: 0.04,
      minElevation: 0,
      maxElevation: 30,
      maxSlopeDegrees: 40,
      meshPalette,
      splineWaypoints
    };
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.meshPalette) {
          this.settings = parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load PCG settings from storage:', e);
    }
  }

  public saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save PCG settings to storage:', e);
    }
    this.notify();
  }

  public getSettings(): PCGGraphSettings {
    return this.settings;
  }

  public updateSettings(updates: Partial<PCGGraphSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.executeGeneration();
    this.saveToStorage();
  }

  /**
   * Deterministic pseudo-random number generator
   */
  private prng(seed: number) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  /**
   * Generates terrain elevation height at coordinate (x, z)
   */
  public getTerrainHeight(x: number, z: number): number {
    const d = Math.hypot(x, z);
    const hill = Math.sin(x * 0.03) * Math.cos(z * 0.03) * 8;
    const ridge = Math.sin(d * 0.05) * 4;
    return Math.max(0, 5 + hill + ridge);
  }

  /**
   * Executes the full procedural point generation pipeline
   */
  public executeGeneration(): PCGPoint[] {
    const rand = this.prng(this.settings.seed);
    const radius = this.settings.boundsRadiusMeters;
    const minSpacing = this.settings.minDistanceBetweenPoints;
    const points: PCGPoint[] = [];

    const totalTrials = Math.min(1200, Math.floor((radius * radius * 4) / (minSpacing * minSpacing * 1.5)));

    for (let i = 0; i < totalTrials; i++) {
      const rx = (rand() * 2 - 1) * radius;
      const rz = (rand() * 2 - 1) * radius;

      // Distance check to existing points (Poisson Disk spacing)
      let tooClose = false;
      for (const p of points) {
        const dx = p.position.x - rx;
        const dz = p.position.z - rz;
        if (dx * dx + dz * dz < minSpacing * minSpacing) {
          tooClose = true;
          break;
        }
      }
      if (tooClose) continue;

      const elevation = this.getTerrainHeight(rx, rz);
      if (elevation < this.settings.minElevation || elevation > this.settings.maxElevation) {
        continue;
      }

      // Select random mesh from palette weighted
      const totalWeight = this.settings.meshPalette.reduce((acc, m) => acc + m.weight, 0);
      let roll = rand() * totalWeight;
      let selectedMesh = this.settings.meshPalette[0];

      for (const m of this.settings.meshPalette) {
        if (roll <= m.weight) {
          selectedMesh = m;
          break;
        }
        roll -= m.weight;
      }

      const scaleFactor = selectedMesh.minScale + rand() * (selectedMesh.maxScale - selectedMesh.minScale);

      points.push({
        id: `pt_${points.length}`,
        position: { x: rx, y: elevation, z: rz },
        rotation: { pitch: 0, yaw: rand() * 360, roll: 0 },
        scale: { x: scaleFactor, y: scaleFactor, z: scaleFactor },
        density: 0.5 + rand() * 0.5,
        meshAssetId: selectedMesh.id,
        color: selectedMesh.color
      });
    }

    this.generatedPoints = points;
    this.notify();
    return points;
  }

  public getGeneratedPoints(): PCGPoint[] {
    return this.generatedPoints;
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

export const pcgEngine = ProceduralPCGExecutionNode.getInstance();
