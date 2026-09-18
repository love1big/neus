/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Lumen Dynamic GI & Surface Cache Architecture Node (UE5 Lumen parity).
 *          Simulates Surface Cache card layout generation on meshes, traces rays through
 *          Mesh Signed Distance Fields (Mesh SDF), gathers multi-bounce indirect radiance,
 *          and monitors GPU render cost telemetry.
 *    - TH: เอนจินประมวลผลการคำนวณแสงทางอ้อมไดนามิก Lumen Surface Cache (UE5 Lumen Parity)
 *          สร้างการ์ดแคชพื้นผิว (Surface Cache Cards), คำนวณระยะการยิงรังสีผ่าน SDF,
 *          รวบรวมแสงสะท้อนทางอ้อม (Indirect Diffuse Radiance Probes),
 *          และติดตามเวลาประมวลผลบน GPU แบบเรียลไทม์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `lumenGITypes.ts`
 *    - Consumed by `LumenSurfaceCacheGlobalIlluminationStudio.tsx`
 * ============================================================================
 */

import {
  LumenGIProfile,
  LumenSurfaceCard,
  LumenRadianceProbe,
  LumenRayTracingMode,
  LumenDebugViewMode
} from '../types/lumenGITypes';

export class LumenGIArchitectureNode {
  private static instance: LumenGIArchitectureNode;

  private profile: LumenGIProfile;
  private surfaceCards: LumenSurfaceCard[] = [];
  private probes: LumenRadianceProbe[] = [];
  private subscribers: Array<() => void> = [];

  private constructor() {
    this.profile = {
      id: 'lumen_cathedral_scene',
      name: 'GothicCathedral_Interior_LumenGI',
      rtMode: 'SOFTWARE_SDF',
      debugView: 'SURFACE_CACHE',
      maxBounces: 4,
      surfaceCacheResolutionScale: 1.0,
      rayStepDistanceMeters: 40.0,
      radianceGatherQuality: 3,
      totalSurfaceCardsAllocated: 24,
      totalSDFMeshesResident: 8,
      gpuFrameTimeMs: 2.85
    };

    this.generateSurfaceCardsAndProbes();
  }

  public static getInstance(): LumenGIArchitectureNode {
    if (!LumenGIArchitectureNode.instance) {
      LumenGIArchitectureNode.instance = new LumenGIArchitectureNode();
    }
    return LumenGIArchitectureNode.instance;
  }

  private generateSurfaceCardsAndProbes(): void {
    const cards: LumenSurfaceCard[] = [];
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#06b6d4'];

    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const x = Math.cos(angle) * 3.5;
      const z = Math.sin(angle) * 3.5;
      const y = ((i % 4) - 1.5) * 1.2;

      cards.push({
        id: `card_${i}`,
        meshName: `SM_PillarArch_${i % 5}`,
        cardIndex: i,
        worldPosition: [x, y, z],
        orientationNormal: [-Math.cos(angle), 0, -Math.sin(angle)],
        sizeMeters: [1.2, 2.4],
        atlasResolutionPx: 128,
        albedoColor: colors[i % colors.length]
      });
    }
    this.surfaceCards = cards;

    const prbs: LumenRadianceProbe[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      prbs.push({
        id: `probe_${i}`,
        position: [Math.cos(angle) * 2.0, (i % 3 - 1) * 0.8, Math.sin(angle) * 2.0],
        radianceIntensity: 450 + (i % 4) * 120,
        indirectColorHex: colors[(i + 2) % colors.length]
      });
    }
    this.probes = prbs;
  }

  public getProfile(): LumenGIProfile {
    return this.profile;
  }

  public getSurfaceCards(): LumenSurfaceCard[] {
    return this.surfaceCards;
  }

  public getProbes(): LumenRadianceProbe[] {
    return this.probes;
  }

  public setRayTracingMode(mode: LumenRayTracingMode): void {
    this.profile.rtMode = mode;
    this.profile.gpuFrameTimeMs = mode === 'HARDWARE_RAYTRACING' ? 4.10 : mode === 'SOFTWARE_SDF' ? 2.85 : 2.15;
    this.notify();
  }

  public setDebugView(view: LumenDebugViewMode): void {
    this.profile.debugView = view;
    this.notify();
  }

  public setMaxBounces(bounces: number): void {
    this.profile.maxBounces = bounces;
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

export const lumenGIArchitectureNode = LumenGIArchitectureNode.getInstance();
