/**
 * ============================================================================
 * @file AssetDependencyCycleDetectorNode.ts
 * @system Art & 3D Asset Topology Architecture
 * @module Asset Dependency Cycle & Orphan Detector Node
 * ============================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Purpose & Responsibility]:
 * โหนดวิเคราะห์ความสมบูรณ์ของความสัมพันธ์ระหว่างสินทรัพย์ (Asset Graph Topology Auditor):
 * 1. ตรวจจับการอ้างอิงวนลูป (Circular Dependency Detection) โดยใช้อัลกอริทึม Depth-First Search (DFS)
 * 2. ตรวจหาสินทรัพย์ที่ถูกทอดทิ้ง (Orphan Asset Identification) เช่น เท็กเจอร์ 4K ที่ไม่มีโมเดลใดเรียกใช้
 * 3. ตรวจสอบลิงก์ที่เสียหาย (Broken References / Missing Assets) ในโครงการ
 * 4. คำนวณขอบเขตการพึ่งพาทั้งขาเข้า (Upstream Ingress) และขาออก (Downstream Egress) แบบ Transitive Closure
 * 5. คำนวณผลกระทบหน่วยความจำ (VRAM & Disk Blast Radius) เมื่อมีการโหลด 3D Model หนึ่งตัว
 * 6. ประเมินคะแนนความสมบูรณ์ของโครงการ (Project Asset Health Score 0-100)
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture & Integration]:
 * - รับข้อมูล AssetNode[], AssetLink[] จาก AssetDependencyGraphRepository.ts
 * - ส่งผลลัพธ์การวิเคราะห์ไปยัง AssetDependencyMetricsBar.tsx และ AssetDependencyNodeInspector.tsx
 * 
 * 📥 [Inputs / Data Contracts]:
 * - nodes: AssetNode[]
 * - links: AssetLink[]
 * 
 * 📤 [Outputs]:
 * - circularPaths: string[][] รายการเส้นทางที่เกิดการวนลูป
 * - orphanNodeIds: Set<string> รหัสโหนดที่ไม่มีการอ้างอิง
 * - brokenLinks: AssetLink[] รายการลิงก์ที่ชี้ไปยังโหนดที่ไม่มีอยู่จริง
 * - transitiveDependencies: Set<string>
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - ป้องกัน Stack Overflow ในกราฟขนาดใหญ่ด้วยการจำกัด Max Recursion Depth
 * - รองรับทั้ง Object Reference และ String ID ใน `source` / `target` ของลิงก์
 * ============================================================================
 */

import { AssetNode, AssetLink, AssetDependencyMetrics } from '../types/assetDependencyGraph';

/**
 * ฟังก์ชันช่วยดึง Node ID จาก source หรือ target ของลิงก์
 */
export function getNodeId(nodeRef: string | AssetNode): string {
  if (typeof nodeRef === 'string') {
    return nodeRef;
  }
  return nodeRef.id;
}

/**
 * ตรวจสอบและค้นหา Circular Dependencies ในโครงสร้าง Asset
 * @param nodes รายการโหนดทั้งหมด
 * @param links รายการลิงก์ทั้งหมด
 * @returns รายการเส้นทางการวนลูป (เช่น ['Mat_A', 'Shader_B', 'Mat_A'])
 */
export function detectCircularDependencies(
  nodes: AssetNode[],
  links: AssetLink[]
): string[][] {
  const nodeIds = new Set(nodes.map(n => n.id));
  const adj = new Map<string, string[]>();

  for (const n of nodes) {
    adj.set(n.id, []);
  }

  for (const l of links) {
    const src = getNodeId(l.source);
    const tgt = getNodeId(l.target);
    if (nodeIds.has(src) && nodeIds.has(tgt)) {
      adj.get(src)?.push(tgt);
    }
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();
  const cycles: string[][] = [];
  const currentPath: string[] = [];

  function dfs(u: string, depth: number) {
    if (depth > 200) return; // ป้องกัน Recursion ลึกเกินไป

    visited.add(u);
    recStack.add(u);
    currentPath.push(u);

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      if (!visited.has(v)) {
        dfs(v, depth + 1);
      } else if (recStack.has(v)) {
        // พบวงวน (Cycle)
        const cycleStartIndex = currentPath.indexOf(v);
        if (cycleStartIndex !== -1) {
          const cycle = currentPath.slice(cycleStartIndex);
          cycle.push(v);
          cycles.push(cycle);
        }
      }
    }

    recStack.delete(u);
    currentPath.pop();
  }

  for (const n of nodes) {
    if (!visited.has(n.id)) {
      dfs(n.id, 0);
    }
  }

  return cycles;
}

/**
 * ค้นหา Orphan Assets (สินทรัพย์ที่ไม่มีผู้เรียกใช้งาน)
 * หมายเหตุ: Prefab และ Environment Map ถือเป็น Root หรือ Entry Point จึงไม่นับเป็น Orphan
 */
export function detectOrphanAssets(
  nodes: AssetNode[],
  links: AssetLink[]
): Set<string> {
  const inDegree = new Map<string, number>();

  for (const n of nodes) {
    inDegree.set(n.id, 0);
  }

  for (const l of links) {
    const tgt = getNodeId(l.target);
    if (inDegree.has(tgt)) {
      inDegree.set(tgt, (inDegree.get(tgt) || 0) + 1);
    }
  }

  const orphans = new Set<string>();
  for (const n of nodes) {
    // โหนดประเภท Prefab หรือ Environment Map มักเป็น Top-Level ไม่จำเป็นต้องมี In-Degree
    if (n.type === 'prefab' || n.type === 'environment_map') {
      continue;
    }

    // หากไม่มีใครอ้างอิงมาหาโหนดนี้
    const degree = inDegree.get(n.id) || 0;
    if (degree === 0) {
      orphans.add(n.id);
    }
  }

  return orphans;
}

/**
 * ตรวจสอบลิงก์ที่ชี้ไปยังโหนดที่ไม่มีอยู่จริง (Broken Links)
 */
export function detectBrokenLinks(
  nodes: AssetNode[],
  links: AssetLink[]
): AssetLink[] {
  const nodeIds = new Set(nodes.map(n => n.id));
  const broken: AssetLink[] = [];

  for (const l of links) {
    const src = getNodeId(l.source);
    const tgt = getNodeId(l.target);

    if (!nodeIds.has(src) || !nodeIds.has(tgt)) {
      broken.push(l);
    }
  }

  return broken;
}

/**
 * คำนวณ Transitive Dependencies (Asset ทั้งหมดที่โหนดนี้ต้องใช้ ต่อเนื่องไปจนสุด)
 * เช่น Model -> Material -> 4x Textures
 */
export function getDownstreamDependencies(
  startNodeId: string,
  nodes: AssetNode[],
  links: AssetLink[]
): Set<string> {
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const l of links) {
    const s = getNodeId(l.source);
    const t = getNodeId(l.target);
    adj.get(s)?.push(t);
  }

  const result = new Set<string>();
  const queue = [startNodeId];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const neighbors = adj.get(curr) || [];
    for (const nxt of neighbors) {
      if (!result.has(nxt) && nxt !== startNodeId) {
        result.add(nxt);
        queue.push(nxt);
      }
    }
  }

  return result;
}

/**
 * คำนวณ Upstream Referencers (สินทรัพย์ทั้งหมดที่พึ่งพาโหนดนี้)
 * เช่น Texture นี้ ถูกเรียกใช้โดย Material ไหน และ Model ไหนบ้าง
 */
export function getUpstreamReferencers(
  targetNodeId: string,
  nodes: AssetNode[],
  links: AssetLink[]
): Set<string> {
  const reverseAdj = new Map<string, string[]>();
  for (const n of nodes) reverseAdj.set(n.id, []);
  for (const l of links) {
    const s = getNodeId(l.source);
    const t = getNodeId(l.target);
    reverseAdj.get(t)?.push(s);
  }

  const result = new Set<string>();
  const queue = [targetNodeId];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const parents = reverseAdj.get(curr) || [];
    for (const p of parents) {
      if (!result.has(p) && p !== targetNodeId) {
        result.add(p);
        queue.push(p);
      }
    }
  }

  return result;
}

/**
 * คำนวณผลกระทบ VRAM และ Disk รวมของ Asset หนึ่งตัวและของที่ต้องโหลดร่วมกันทั้งหมด (Blast Radius)
 */
export function calculateAssetBlastRadius(
  nodeId: string,
  nodes: AssetNode[],
  links: AssetLink[]
): {
  directNode: AssetNode | undefined;
  downstreamCount: number;
  totalDiskSizeBytes: number;
  totalVRAMEstimateBytes: number;
  dependentTexturesCount: number;
  dependentMaterialsCount: number;
  dependentModelsCount: number;
} {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const directNode = nodeMap.get(nodeId);
  const downstream = getDownstreamDependencies(nodeId, nodes, links);

  const allRelevantIds = new Set<string>([nodeId, ...downstream]);
  let totalDisk = 0;
  let totalVRAM = 0;
  let textures = 0;
  let materials = 0;
  let models = 0;

  for (const id of allRelevantIds) {
    const node = nodeMap.get(id);
    if (node) {
      totalDisk += node.fileSizeBytes || 0;
      totalVRAM += node.vramEstimateBytes || 0;
      if (node.type === 'texture') textures++;
      if (node.type === 'material') materials++;
      if (node.type === 'model_3d') models++;
    }
  }

  return {
    directNode,
    downstreamCount: downstream.size,
    totalDiskSizeBytes: totalDisk,
    totalVRAMEstimateBytes: totalVRAM,
    dependentTexturesCount: textures,
    dependentMaterialsCount: materials,
    dependentModelsCount: models
  };
}

/**
 * คำนวณสถิติภาพรวม Asset Dependency Metrics ของทั้งระบบ
 */
export function calculateOverallMetrics(
  nodes: AssetNode[],
  links: AssetLink[]
): AssetDependencyMetrics {
  const orphans = detectOrphanAssets(nodes, links);
  const broken = detectBrokenLinks(nodes, links);
  const cycles = detectCircularDependencies(nodes, links);

  let totalDisk = 0;
  let totalVRAM = 0;
  let models = 0;
  let textures = 0;
  let materials = 0;
  let shaders = 0;
  let prefabs = 0;
  let audio = 0;
  let animations = 0;

  for (const n of nodes) {
    totalDisk += n.fileSizeBytes || 0;
    totalVRAM += n.vramEstimateBytes || 0;
    switch (n.type) {
      case 'model_3d': models++; break;
      case 'texture': textures++; break;
      case 'material': materials++; break;
      case 'shader': shaders++; break;
      case 'prefab': prefabs++; break;
      case 'audio': audio++; break;
      case 'animation': animations++; break;
    }
  }

  // คะแนนสุขภาพ (Health Score):
  // หักคะแนนตามจำนวน Broken Links (-15 คะแนนต่อตัว), Circular (-20 คะแนนต่อวงวน), และ Orphans (-2 คะแนนต่อตัว)
  let healthScore = 100;
  healthScore -= broken.length * 15;
  healthScore -= cycles.length * 20;
  healthScore -= orphans.size * 2;
  healthScore = Math.max(0, Math.min(100, healthScore));

  return {
    totalAssets: nodes.length,
    totalModels: models,
    totalTextures: textures,
    totalMaterials: materials,
    totalShaders: shaders,
    totalPrefabs: prefabs,
    totalAudio: audio,
    totalAnimations: animations,
    totalDiskSizeBytes: totalDisk,
    totalVRAMEstimateBytes: totalVRAM,
    orphanCount: orphans.size,
    brokenLinkCount: broken.length,
    circularDependencyCount: cycles.length,
    healthScore
  };
}
