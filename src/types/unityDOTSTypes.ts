/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript types and contracts for Unity DOTS ECS Archetype Chunk Memory
 *          & Job Dependency Schedule Visualizer Studio (Unity Entities 1.0+ parity).
 *          Defines ECS Archetypes, 16 Kilobyte Chunk Memory Layouts, Structure of Arrays (SoA),
 *          Component Data Arrays, Entity Capacity, Cache Miss Ratios, and On-Device Offline AI
 *          SIMD Alignment & Memory Fragmentation Optimizers.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Unity DOTS ECS Archetype Chunk Memory & Job Scheduler
 *          (เทียบเท่า Unity Data-Oriented Technology Stack Entities 1.0+)
 *          ครอบคลุมโครงสร้างความจำก้อน 16KB Chunks, รูปแบบการจัดเก็บข้อมูล Structure of Arrays (SoA),
 *          การตรวจวัดอัตราการชนแคชของซีพียู (L1/L2 Cache Hit Rate), ระบบ Job Dependencies,
 *          และ AI ออฟไลน์ช่วยวิเคราะห์การจัดตำแหน่งหน่วยความจำเพื่อการคำนวณแบบ SIMD สูงสุด
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `UnityDOTSEngineNode.ts` and `UnityDOTSArchetypeChunkStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Memory Size: Standard 16,384 Bytes per Chunk
 * ============================================================================
 */

export interface ComponentFieldDef {
  name: string;
  type: string;
  sizeBytes: number;
}

export interface ArchetypeChunkDef {
  chunkIndex: number;
  entityCount: number;
  maxEntityCapacity: number;
  allocatedBytes: number;
  capacityBytes: number; // 16384 bytes
  components: ComponentFieldDef[];
  utilizationPercentage: number;
}

export interface UnityDOTSProfile {
  worldName: string;
  totalEntities: number;
  archetypeSignature: string;
  chunkCount: number;
  totalMemoryAllocatedKb: number;
  l1CacheHitRate: number;
  simdVectorWidth: string; // 128-bit / 256-bit AVX2
  chunks: ArchetypeChunkDef[];
  offlineAISIMDInsight: string;
}
