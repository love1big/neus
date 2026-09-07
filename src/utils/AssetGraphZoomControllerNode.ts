/**
 * ============================================================================
 * @file AssetGraphZoomControllerNode.ts
 * @system Art & 3D Asset Topology Architecture
 * @module Asset Graph Smooth Zoom & Pan Controller Engine
 * ============================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Purpose & Responsibility]:
 * โมดูลควบคุมการซูมและแพนภาพโครงข่ายความสัมพันธ์สินทรัพย์แบบ Smooth & Animated:
 * 1. ขับเคลื่อนการแพนและซูมผ่าน D3 Zoom Behavior ด้วย Curve ความนุ่มนวล (Cubic-Out Easing)
 * 2. ฟังก์ชัน Zoom In (+), Zoom Out (-) ด้วยสัดส่วนปรับแต่งได้และ Animation Duration
 * 3. ฟังก์ชัน Zoom to Fit (จัดวางโหนดทั้งหมดให้อยู่กึ่งกลางหน้าจออัตโนมัติ พร้อมระยะเว้นขอบ Padding)
 * 4. ฟังก์ชัน Center on Node (เลื่อนกล้องโฟกัสไปยังโหนดที่เลือกพร้อมแอนิเมชันนุ่มนวล)
 * 5. ฟังก์ชัน Smooth Directional Pan (เลื่อนกล้อง 4 ทิศทาง Up, Down, Left, Right)
 * 6. ฟังก์ชันคำนวณพิกัดสำหรับ Minimap / Viewport Radar ให้สอดคล้องกับขนาดหน้าจอ
 * 7. ป้องกันการกระตุก (Smooth Wheel Damping & Double-click Handling)
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture & Integration]:
 * - ทำงานร่วมกับ SVGSVGElement ใน AssetDependencyGraphStudio.tsx
 * - ใช้งานคู่กับ AssetGraphCanvasNavigationControls.tsx
 * - ขับเคลื่อนโดยโมดูล `d3-zoom` และ `d3-ease`
 * 
 * 📥 [Inputs / Data Contracts]:
 * - svgElement: SVGSVGElement
 * - nodes: AssetNode[]
 * - viewportWidth / viewportHeight: number
 * 
 * 📤 [Outputs]:
 * - D3 Zoom Transform (x, y, k)
 * - แอนิเมชัน Smooth Viewport Movement
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - ตรวจสอบว่าโหนดมีพิกัด x, y ถูกต้อง หากไม่มีจะใช้ค่า Fallback (0, 0)
 * - จัดการ Bounding Box กรณีมีโหนดเดียว หรือไม่มีโหนดเลย
 * - ป้องกัน Scale หลุดช่วง [0.15, 5.0]
 * ============================================================================
 */

import * as d3 from 'd3';
import { AssetNode } from '../types/assetDependencyGraph';

export interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface MinimapCoords {
  viewportBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  worldBounds: BoundingBox;
  scaleX: number;
  scaleY: number;
}

export class AssetGraphZoomControllerNode {
  private svgElement: SVGSVGElement | null = null;
  private zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown> | null = null;
  private currentTransform: d3.ZoomTransform = d3.zoomIdentity;
  private onTransformCallback?: (transform: d3.ZoomTransform) => void;
  private minScale: number = 0.15;
  private maxScale: number = 5.0;

  constructor(minScale = 0.15, maxScale = 5.0) {
    this.minScale = minScale;
    this.maxScale = maxScale;
  }

  /**
   * ผูกและติดตั้ง D3 Zoom Behavior เข้ากับ SVG Canvas Element
   */
  public attach(
    svgElement: SVGSVGElement,
    onTransform: (transform: d3.ZoomTransform) => void
  ): void {
    this.svgElement = svgElement;
    this.onTransformCallback = onTransform;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([this.minScale, this.maxScale])
      // กรองไม่ให้ double click ซูมแบบหยาบๆ ให้ใช้ smooth handlers แทน
      .filter((event) => {
        // อนุญาตให้ใช้ปุ่มซ้ายลาก หรือ mouse wheel
        if (event.type === 'dblclick') return false;
        return !event.button; // Main button only
      })
      .wheelDelta((event) => {
        // ปรับ Damping สำหรับ mouse wheel ให้เลื่อนได้อย่างนุ่มนวล
        return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002);
      })
      .on('zoom', (event) => {
        this.currentTransform = event.transform;
        if (this.onTransformCallback) {
          this.onTransformCallback(event.transform);
        }
      });

    this.zoomBehavior = zoom;
    d3.select(svgElement).call(zoom);
  }

  /**
   * ดึงสถานะ Transform ปัจจุบัน
   */
  public getTransform(): d3.ZoomTransform {
    return this.currentTransform;
  }

  /**
   * ซูมเข้าอย่างนุ่มนวล (Smooth Zoom In)
   * @param factor อัตราส่วนการขยาย เช่น 1.3 (+30%)
   * @param duration ระยะเวลา Transition (มิลลิวินาที)
   */
  public smoothZoomIn(factor: number = 1.3, duration: number = 320): void {
    if (!this.svgElement || !this.zoomBehavior) return;

    d3.select(this.svgElement)
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .call(this.zoomBehavior.scaleBy, factor);
  }

  /**
   * ซูมออกอย่างนุ่มนวล (Smooth Zoom Out)
   * @param factor อัตราส่วนการย่อ เช่น 0.77 (-23%)
   * @param duration ระยะเวลา Transition (มิลลิวินาที)
   */
  public smoothZoomOut(factor: number = 0.77, duration: number = 320): void {
    if (!this.svgElement || !this.zoomBehavior) return;

    d3.select(this.svgElement)
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .call(this.zoomBehavior.scaleBy, factor);
  }

  /**
   * ซูมไปยังระดับ Scale ที่กำหนดโดยตรง (เช่น 1.0 = 100%, 0.5 = 50%)
   */
  public smoothZoomToScale(targetScale: number, duration: number = 350): void {
    if (!this.svgElement || !this.zoomBehavior) return;

    const clamped = Math.max(this.minScale, Math.min(this.maxScale, targetScale));
    d3.select(this.svgElement)
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .call(this.zoomBehavior.scaleTo, clamped);
  }

  /**
   * เลื่อนกล้อง (Smooth Pan) ตามระยะแกน X และ Y
   * @param dx ระยะเลื่อนแกน X (พิกเซลหน้าจอ)
   * @param dy ระยะเลื่อนแกน Y (พิกเซลหน้าจอ)
   * @param duration ระยะเวลา Transition
   */
  public smoothPanBy(dx: number, dy: number, duration: number = 240): void {
    if (!this.svgElement || !this.zoomBehavior) return;

    const newX = this.currentTransform.x + dx;
    const newY = this.currentTransform.y + dy;
    const newTransform = d3.zoomIdentity
      .translate(newX, newY)
      .scale(this.currentTransform.k);

    d3.select(this.svgElement)
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .call(this.zoomBehavior.transform, newTransform);
  }

  /**
   * รีเซ็ตมุมมองกลับสู่จุดศูนย์กลางที่ Scale 100%
   */
  public resetToCenter(
    viewportWidth: number,
    viewportHeight: number,
    duration: number = 400
  ): void {
    if (!this.svgElement || !this.zoomBehavior) return;

    const defaultTransform = d3.zoomIdentity
      .translate(viewportWidth / 2, viewportHeight / 2)
      .scale(1.0);

    d3.select(this.svgElement)
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .call(this.zoomBehavior.transform, defaultTransform);
  }

  /**
   * คำนวณ Bounding Box ของกลุ่มโหนดทั้งหมด
   */
  public calculateNodesBounds(nodes: AssetNode[]): BoundingBox {
    if (nodes.length === 0) {
      return {
        minX: -200,
        maxX: 200,
        minY: -200,
        maxY: 200,
        width: 400,
        height: 400,
        centerX: 0,
        centerY: 0
      };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const node of nodes) {
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    // กรณีจุดเดียวหรือทับกันหมด
    if (maxX === minX) {
      minX -= 50;
      maxX += 50;
    }
    if (maxY === minY) {
      minY -= 50;
      maxY += 50;
    }

    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    return { minX, maxX, minY, maxY, width, height, centerX, centerY };
  }

  /**
   * ซูมและจัดกึ่งกลางให้อยู่ในกรอบอย่างสวยงาม (Zoom to Fit All Nodes)
   */
  public zoomToFit(
    nodes: AssetNode[],
    viewportWidth: number,
    viewportHeight: number,
    padding: number = 90,
    duration: number = 550
  ): void {
    if (!this.svgElement || !this.zoomBehavior || nodes.length === 0) return;

    const bounds = this.calculateNodesBounds(nodes);

    const availableWidth = Math.max(viewportWidth - padding * 2, 100);
    const availableHeight = Math.max(viewportHeight - padding * 2, 100);

    const scaleX = availableWidth / bounds.width;
    const scaleY = availableHeight / bounds.height;
    let targetScale = Math.min(scaleX, scaleY);

    // ควบคุมช่วงไม่ให้ซูมเข้ามากเกินไปหรือย่อเล็กเกินไป
    targetScale = Math.max(this.minScale, Math.min(1.8, targetScale));

    const targetX = viewportWidth / 2 - bounds.centerX * targetScale;
    const targetY = viewportHeight / 2 - bounds.centerY * targetScale;

    const targetTransform = d3.zoomIdentity
      .translate(targetX, targetY)
      .scale(targetScale);

    d3.select(this.svgElement)
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .call(this.zoomBehavior.transform, targetTransform);
  }

  /**
   * เลื่อนกล้องและซูมเข้าหาโหนดที่กำหนดอย่างนุ่มนวล (Center on Node)
   */
  public centerOnNode(
    node: AssetNode,
    viewportWidth: number,
    viewportHeight: number,
    targetScale: number = 1.4,
    duration: number = 450
  ): void {
    if (!this.svgElement || !this.zoomBehavior) return;

    const nodeX = node.x ?? 0;
    const nodeY = node.y ?? 0;

    // รักษาระดับ Scale ปัจจุบัน หากมีค่ามากกว่า 1.0 อยู่แล้ว ให้ใช้ค่าเดิม เพื่อไม่ให้กระตุก
    const scale = Math.max(this.currentTransform.k, targetScale);

    const targetX = viewportWidth / 2 - nodeX * scale;
    const targetY = viewportHeight / 2 - nodeY * scale;

    const targetTransform = d3.zoomIdentity
      .translate(targetX, targetY)
      .scale(scale);

    d3.select(this.svgElement)
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .call(this.zoomBehavior.transform, targetTransform);
  }

  /**
   * คำนวณพิกัดมุมมองและขอบเขตโลกสำหรับเรนเดอร์ลง Minimap Viewport
   */
  public calculateMinimapData(
    nodes: AssetNode[],
    viewportWidth: number,
    viewportHeight: number,
    minimapWidth: number,
    minimapHeight: number
  ): MinimapCoords {
    const bounds = this.calculateNodesBounds(nodes);

    // ขยายขอบเขตเล็กน้อยเพื่อให้มี margin
    const margin = 120;
    const worldMinX = bounds.minX - margin;
    const worldMaxX = bounds.maxX + margin;
    const worldMinY = bounds.minY - margin;
    const worldMaxY = bounds.maxY + margin;

    const worldWidth = Math.max(worldMaxX - worldMinX, 200);
    const worldHeight = Math.max(worldMaxY - worldMinY, 200);

    const scaleX = minimapWidth / worldWidth;
    const scaleY = minimapHeight / worldHeight;
    const fitScale = Math.min(scaleX, scaleY);

    // พิกัดกล้องปัจจุบันในพิกัด World Space
    const camWorldLeft = -this.currentTransform.x / this.currentTransform.k;
    const camWorldTop = -this.currentTransform.y / this.currentTransform.k;
    const camWorldWidth = viewportWidth / this.currentTransform.k;
    const camWorldHeight = viewportHeight / this.currentTransform.k;

    // แปลงพิกัดกล้องมาเป็นตำแหน่งบน Minimap
    const offsetX = (minimapWidth - worldWidth * fitScale) / 2;
    const offsetY = (minimapHeight - worldHeight * fitScale) / 2;

    const boxX = offsetX + (camWorldLeft - worldMinX) * fitScale;
    const boxY = offsetY + (camWorldTop - worldMinY) * fitScale;
    const boxW = camWorldWidth * fitScale;
    const boxH = camWorldHeight * fitScale;

    return {
      viewportBox: {
        x: Math.max(0, boxX),
        y: Math.max(0, boxY),
        width: Math.min(minimapWidth, Math.max(12, boxW)),
        height: Math.min(minimapHeight, Math.max(12, boxH))
      },
      worldBounds: {
        minX: worldMinX,
        maxX: worldMaxX,
        minY: worldMinY,
        maxY: worldMaxY,
        width: worldWidth,
        height: worldHeight,
        centerX: (worldMinX + worldMaxX) / 2,
        centerY: (worldMinY + worldMaxY) / 2
      },
      scaleX: fitScale,
      scaleY: fitScale
    };
  }

  /**
   * เมื่อผู้ใช้คลิกบน Minimap เพื่อนำทางกล้องไปยังจุดนั้นทันที
   */
  public navigateFromMinimap(
    clickMinimapX: number,
    clickMinimapY: number,
    minimapWidth: number,
    minimapHeight: number,
    nodes: AssetNode[],
    viewportWidth: number,
    viewportHeight: number,
    duration: number = 350
  ): void {
    if (!this.svgElement || !this.zoomBehavior) return;

    const minimapData = this.calculateMinimapData(
      nodes,
      viewportWidth,
      viewportHeight,
      minimapWidth,
      minimapHeight
    );

    const { worldBounds, scaleX } = minimapData;
    const offsetX = (minimapWidth - worldBounds.width * scaleX) / 2;
    const offsetY = (minimapHeight - worldBounds.height * scaleX) / 2;

    // แปลงพิกัด Minimap กลับเป็น World Coordinates
    const targetWorldX = worldBounds.minX + (clickMinimapX - offsetX) / scaleX;
    const targetWorldY = worldBounds.minY + (clickMinimapY - offsetY) / scaleX;

    // ย้ายตำแหน่งกล้องให้อยู่ตรงกลางของพิกัด World
    const k = this.currentTransform.k;
    const targetX = viewportWidth / 2 - targetWorldX * k;
    const targetY = viewportHeight / 2 - targetWorldY * k;

    const newTransform = d3.zoomIdentity.translate(targetX, targetY).scale(k);

    d3.select(this.svgElement)
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .call(this.zoomBehavior.transform, newTransform);
  }

  /**
   * ถอดการเชื่อมโยง D3 Zoom Behavior เมื่อ Component Unmount
   */
  public destroy(): void {
    if (this.svgElement) {
      d3.select(this.svgElement).on('.zoom', null);
    }
    this.svgElement = null;
    this.zoomBehavior = null;
    this.onTransformCallback = undefined;
  }
}
