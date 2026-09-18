/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type definitions for the AAA Procedural Content
 *          Generation (PCG) Framework & Spline Mesh Deformer System (Unreal Engine 5.2+
 *          PCG Graph & Unity Spline Mesh Toolkit parity).
 *          Defines Spatial Point Clouds, Poisson Disk Sampling, Surface Projection,
 *          Density Noise Filters, Mesh Spawner Palettes, and Spline Lofting Curves.
 *    - TH: กำหนด Type และ Interface หลักสำหรับระบบ Procedural Content Generation (PCG)
 *          และ Spline Mesh Deformer ระดับ AAA (เทียบเท่า Unreal 5.2+ PCG Framework
 *          และ Unity Spline Toolkit)
 *          ครอบคลุมกลุ่มจุดพิกัด Spatial Point Cloud, การสุ่มแบบ Poisson Disk,
 *          ฟิลเตอร์ความหนาแน่น Density Noise, การคัดกรองความชัน (Slope Filter),
 *          และเส้น Spline ดัดรูปทรงถนน แม่น้ำ รั้ว
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `ProceduralPCGExecutionNode.ts` and `ProceduralContentGenerationPCGStudio.tsx`
 *    - Spawns world instances, foliage, rocks, and spline mesh deformations
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Interfaces: `PCGPoint`, `PCGGraphSchema`, `PCGMeshAsset`, `SplineWaypoint`
 * ============================================================================
 */

export type PCGSamplingMethod = 'POISSON_DISK' | 'JITTERED_GRID' | 'UNIFORM_RANDOM';

export interface PCGPoint {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { pitch: number; yaw: number; roll: number };
  scale: { x: number; y: number; z: number };
  density: number; // 0.0 to 1.0
  meshAssetId: string;
  color: string;
}

export interface PCGMeshAsset {
  id: string;
  name: string;
  category: 'TREE' | 'ROCK' | 'FOLIAGE' | 'STRUCTURE';
  color: string;
  weight: number;
  minScale: number;
  maxScale: number;
  slopeLimitDegrees: number;
}

export interface SplineWaypoint {
  id: string;
  position: { x: number; y: number; z: number };
  tangentIn: { x: number; y: number; z: number };
  tangentOut: { x: number; y: number; z: number };
  width: number;
  rollDegrees: number;
}

export interface PCGGraphSettings {
  id: string;
  name: string;
  seed: number;
  samplingMethod: PCGSamplingMethod;
  boundsRadiusMeters: number;
  minDistanceBetweenPoints: number; // For Poisson Disk
  densityNoiseScale: number;
  minElevation: number;
  maxElevation: number;
  maxSlopeDegrees: number;
  meshPalette: PCGMeshAsset[];
  splineWaypoints: SplineWaypoint[];
}
