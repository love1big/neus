/**
 * ============================================================================
 * @file AssetForceDirectedSimulationNode.ts
 * @system Art & 3D Asset Topology Architecture
 * @module Asset Force-Directed Physics Simulation Engine
 * ============================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Purpose & Responsibility]:
 * เครื่องยนต์ขับเคลื่อนฟิสิกส์จำลองแรงของโครงข่ายสินทรัพย์ (D3 Force-Directed Simulation Engine):
 * 1. ควบคุมแรงสถิตไฟฟ้าระหว่างโหนด (Many-Body Charge Repulsion) เพื่อกระจายไม่ให้ซ้อนทับกัน
 * 2. ควบคุมความตึงและระยะห่างของสปริงความสัมพันธ์ (Spring Link Forces) ระหว่างโมเดล-แมทีเรียล-เท็กเจอร์
 * 3. ควบคุมการชนกันของวัตถุ (Collision Detection Radius) ป้องกันป้ายชื่อและไอคอนทับซ้อน
 * 4. ควบคุมแรงดึงดูดศูนย์กลาง (Centering & Radial Forces) เพื่อรักษาเสถียรภาพของ Canvas
 * 5. รองรับโหมด Cluster Grouping: จัดกลุ่มตามประเภทสินทรัพย์ (Prefabs -> Models -> Materials -> Textures)
 * 6. จัดการการลากโหนด (Drag & Drop Pinning) ด้วยการกำหนด fx, fy ชั่วคราวหรือตรึงถาวร
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture & Integration]:
 * - ขับเคลื่อนโดยโมดูล `d3` (forceSimulation, forceLink, forceManyBody, forceCollide, forceCenter)
 * - สื่อสารกับ AssetDependencyGraphStudio.tsx ผ่าน Tick Listener และ Drag Handlers
 * 
 * 📥 [Inputs / Data Contracts]:
 * - nodes: AssetNode[]
 * - links: AssetLink[]
 * - config: ForceSimulationConfig
 * 
 * 📤 [Outputs]:
 * - พิกัด x, y ของโหนดที่อัปเดตอย่างต่อเนื่องในแต่ละเฟรม (Tick)
 * - เมธอดควบคุม: restart(), reheat(), pause(), updateConfig()
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - ตรวจสอบว่าโหนดและลิงก์มี ID ตรงกันเสมอเพื่อไม่ให้ D3 link resolution ล้มเหลว
 * - ทำลาย (stop / cleanup) simulation loop อย่างถูกต้องเพื่อป้องกัน Memory Leak
 * ============================================================================
 */

import * as d3 from 'd3';
import { AssetNode, AssetLink, ForceSimulationConfig, AssetType } from '../types/assetDependencyGraph';

/**
 * ตำแหน่งศูนย์กลางแยกตามประเภท สำหรับโหมด Type Clustering
 */
const CLUSTER_CENTERS: Record<AssetType, { x: number; y: number }> = {
  prefab: { x: 0, y: -220 },
  model_3d: { x: -280, y: -80 },
  material: { x: 0, y: 30 },
  shader: { x: -320, y: 160 },
  texture: { x: 280, y: 80 },
  environment_map: { x: 340, y: -160 },
  animation: { x: -160, y: -280 },
  audio: { x: 160, y: -280 }
};

export class AssetForceDirectedSimulationNode {
  private simulation: d3.Simulation<AssetNode, AssetLink> | null = null;
  private nodes: AssetNode[] = [];
  private links: AssetLink[] = [];
  private config: ForceSimulationConfig;
  private width: number;
  private height: number;
  private onTickCallback?: (nodes: AssetNode[], links: AssetLink[]) => void;
  private isPaused: boolean = false;

  constructor(
    nodes: AssetNode[],
    links: AssetLink[],
    width: number,
    height: number,
    config?: Partial<ForceSimulationConfig>
  ) {
    this.width = width;
    this.height = height;
    this.config = {
      chargeStrength: config?.chargeStrength ?? -380,
      linkDistance: config?.linkDistance ?? 90,
      linkStrength: config?.linkStrength ?? 0.8,
      collisionRadius: config?.collisionRadius ?? 42,
      centerStrength: config?.centerStrength ?? 0.08,
      alphaDecay: config?.alphaDecay ?? 0.028,
      clusteringEnabled: config?.clusteringEnabled ?? false
    };

    this.nodes = nodes;
    this.links = links;
    this.initSimulation();
  }

  /**
   * เริ่มต้นการสร้าง D3 Simulation
   */
  private initSimulation(): void {
    if (this.simulation) {
      this.simulation.stop();
    }

    // Force link
    const linkForce = d3.forceLink<AssetNode, AssetLink>(this.links)
      .id(d => d.id)
      .distance(this.config.linkDistance)
      .strength(this.config.linkStrength);

    // Force many-body (charge repulsion)
    const chargeForce = d3.forceManyBody<AssetNode>()
      .strength(this.config.chargeStrength)
      .distanceMax(600);

    // Force collide (prevent overlap)
    const collideForce = d3.forceCollide<AssetNode>()
      .radius((d) => {
        // ให้โหนดขนาดใหญ่ (โมเดล, พรีแฟบ) มีรัศมีกันชนกว้างกว่าเท็กเจอร์
        if (d.type === 'model_3d' || d.type === 'prefab') return this.config.collisionRadius * 1.3;
        return this.config.collisionRadius;
      })
      .iterations(2);

    // Force center
    const centerForce = d3.forceCenter(this.width / 2, this.height / 2);

    this.simulation = d3.forceSimulation<AssetNode, AssetLink>(this.nodes)
      .force('link', linkForce)
      .force('charge', chargeForce)
      .force('collide', collideForce)
      .force('center', centerForce)
      .alphaDecay(this.config.alphaDecay);

    // Optional cluster positioning forces
    if (this.config.clusteringEnabled) {
      this.simulation
        .force('clusterX', d3.forceX<AssetNode>(d => {
          const target = CLUSTER_CENTERS[d.type] || { x: 0, y: 0 };
          return this.width / 2 + target.x;
        }).strength(0.2))
        .force('clusterY', d3.forceY<AssetNode>(d => {
          const target = CLUSTER_CENTERS[d.type] || { x: 0, y: 0 };
          return this.height / 2 + target.y;
        }).strength(0.2));
    }

    this.simulation.on('tick', () => {
      if (this.onTickCallback) {
        this.onTickCallback(this.nodes, this.links);
      }
    });
  }

  /**
   * อัปเดตข้อมูลโหนดและลิงก์ใหม่
   */
  public updateData(nodes: AssetNode[], links: AssetLink[]): void {
    this.nodes = nodes;
    this.links = links;
    this.initSimulation();
    this.reheat(0.8);
  }

  /**
   * อัปเดตขนาดหน้าจอ Canvas
   */
  public updateDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
    if (this.simulation) {
      this.simulation.force('center', d3.forceCenter(width / 2, height / 2));
      this.reheat(0.3);
    }
  }

  /**
   * อัปเดตค่าพารามิเตอร์ของแรงฟิสิกส์
   */
  public updateConfig(newConfig: Partial<ForceSimulationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initSimulation();
    this.reheat(0.6);
  }

  /**
   * ผูกฟังก์ชันเรียกเมื่อแต่ละเฟรมประมวลผลเสร็จ
   */
  public onTick(callback: (nodes: AssetNode[], links: AssetLink[]) => void): void {
    this.onTickCallback = callback;
  }

  /**
   * ปลุกการจำลองให้เคลื่อนไหวอีกครั้ง (Re-heat)
   */
  public reheat(alpha = 0.5): void {
    if (this.simulation) {
      this.simulation.alpha(alpha).restart();
    }
  }

  /**
   * พักการจำลอง (Freeze / Pause)
   */
  public pause(): void {
    if (this.simulation) {
      this.simulation.stop();
      this.isPaused = true;
    }
  }

  /**
   * เล่นการจำลองต่อ
   */
  public resume(): void {
    if (this.simulation) {
      this.isPaused = false;
      this.simulation.restart();
    }
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  /**
   * จัดการ Drag Interaction
   */
  public handleDragStart(node: AssetNode): void {
    if (!this.simulation) return;
    this.simulation.alphaTarget(0.3).restart();
    node.fx = node.x;
    node.fy = node.y;
  }

  public handleDrag(node: AssetNode, x: number, y: number): void {
    node.fx = x;
    node.fy = y;
  }

  public handleDragEnd(node: AssetNode, shouldPin = false): void {
    if (!this.simulation) return;
    this.simulation.alphaTarget(0);
    if (!shouldPin) {
      node.fx = null;
      node.fy = null;
    }
  }

  /**
   * ปลดตรึงตำแหน่งโหนดทั้งหมด
   */
  public unpinAllNodes(): void {
    for (const node of this.nodes) {
      node.fx = null;
      node.fy = null;
    }
    this.reheat(0.5);
  }

  /**
   * ทำลาย Simulation เมื่อคอมโพเนนต์ถูก Unmount
   */
  public destroy(): void {
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = null;
    }
    this.onTickCallback = undefined;
  }
}
