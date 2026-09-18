/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for the Nanite Micro-Polygon Virtualized
 *          Geometry & Streaming System (Unreal Engine 5 Nanite architecture parity).
 *          Defines cluster hierarchy (128 triangles/cluster), Cluster DAG nodes,
 *          Screen-Size Error bounds, Software vs Hardware Rasterizer splits,
 *          Streaming VRAM pools, and Overdraw Heatmap visualization modes.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Nanite Micro-Polygon Virtual Geometry
 *          และการสตรีมเรขาคณิตสามมิติเสมือนจริงระดับ AAA (เทียบเท่าสถาปัตยกรรม UE5 Nanite)
 *          ครอบคลุมการแบ่งคลัสเตอร์รูปสามเหลี่ยมระดับไมโครโพลิกอน (128 Triangles/Cluster),
 *          โครงสร้าง Cluster DAG, การคำนวณข้อผิดพลาดบนหน้าจอ (Screen-Size Error),
 *          การตัดสินใจเลือกระหว่าง Software และ Hardware Rasterizer, และโควตา VRAM สตรีมมิ่ง
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `NaniteGeometryEngineNode.ts` and `NaniteMicroPolygonVirtualGeometryStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Interfaces: `NaniteCluster`, `NaniteMeshInstance`, `NaniteStreamingStats`, `NaniteViewMode`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Fallback to coarsest Root Cluster when VRAM streaming bandwidth is saturated.
 * ============================================================================
 */

export type NaniteViewMode = 'OVERVIEW' | 'CLUSTERS' | 'TRIANGLES' | 'RASTER_MODE' | 'OVERDRAW';

export interface NaniteCluster {
  id: string;
  clusterIndex: number;
  lodLevel: number;
  triangleCount: number; // typically 128
  screenError: number; // Pixels
  boundsRadius: number;
  colorHex: string;
  rasterizerType: 'HARDWARE' | 'SOFTWARE';
  center: [number, number, number];
}

export interface NaniteMeshInstance {
  id: string;
  name: string;
  triangleBudgetRaw: number;
  clustersTotal: number;
  clustersRendered: number;
  diskSizeBytes: number;
  vramResidentBytes: number;
  activeLOD: number;
}

export interface NaniteStreamingStats {
  residentClusters: number;
  visibleClusters: number;
  softwareRasterizedTriangles: number;
  hardwareRasterizedTriangles: number;
  streamingPoolUsedMB: number;
  streamingPoolMaxMB: number;
  diskIoBandwidthMBs: number;
  averageScreenErrorPx: number;
}
