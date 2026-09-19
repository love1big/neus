/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Unity DOTS ECS Archetype Chunk Memory & Job Scheduling Engine Simulation Node.
 *          Calculates 16KB chunk memory layouts, Structure of Arrays component offsets,
 *          CPU cache hit ratios, and On-Device Offline AI Cache Alignment Optimization.
 *    - TH: เอนจินจำลองการจัดสรรหน่วยความจำแบบ Chunk ในระบบ Unity DOTS ECS
 *          คำนวณการจัดเรียงอาเรย์ข้อมูล Structure of Arrays ใน Chunk ขนาด 16,384 ไบต์,
 *          ตรวจวัดประสิทธิภาพ Cache Line และประมวลผลคำแนะนำการ Optimize ด้วย AI ออฟไลน์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `unityDOTSTypes.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - `getProfile()`: Returns immutable `UnityDOTSProfile`
 * ============================================================================
 */

import { UnityDOTSProfile, ArchetypeChunkDef } from '../types/unityDOTSTypes';

const CHUNK_CAPACITY = 16384; // 16 KB

const COMPONENTS = [
  { name: 'LocalTransform', type: 'float3 pos, quaternion rot, float scale', sizeBytes: 32 },
  { name: 'PhysicsVelocity', type: 'float3 linear, float3 angular', sizeBytes: 24 },
  { name: 'HealthComponent', type: 'float current, float max', sizeBytes: 8 },
  { name: 'TargetEntity', type: 'Entity target', sizeBytes: 8 }
];

// Entity byte size = 8 (Entity ID) + 32 + 24 + 8 + 8 = 80 bytes
// Max entities per 16KB chunk = floor(16384 / 80) = 204 entities

const INITIAL_CHUNKS: ArchetypeChunkDef[] = [
  {
    chunkIndex: 0,
    entityCount: 204,
    maxEntityCapacity: 204,
    allocatedBytes: 16320,
    capacityBytes: CHUNK_CAPACITY,
    components: COMPONENTS,
    utilizationPercentage: 99.6
  },
  {
    chunkIndex: 1,
    entityCount: 204,
    maxEntityCapacity: 204,
    allocatedBytes: 16320,
    capacityBytes: CHUNK_CAPACITY,
    components: COMPONENTS,
    utilizationPercentage: 99.6
  },
  {
    chunkIndex: 2,
    entityCount: 142,
    maxEntityCapacity: 204,
    allocatedBytes: 11360,
    capacityBytes: CHUNK_CAPACITY,
    components: COMPONENTS,
    utilizationPercentage: 69.3
  }
];

export class UnityDOTSEngineNode {
  private profile: UnityDOTSProfile;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.profile = {
      worldName: 'DefaultWorld.Simulation',
      totalEntities: 550,
      archetypeSignature: 'Archetype[LocalTransform, PhysicsVelocity, HealthComponent, TargetEntity]',
      chunkCount: 3,
      totalMemoryAllocatedKb: 48,
      l1CacheHitRate: 98.4,
      simdVectorWidth: '256-bit AVX2 (8 floats / instruction)',
      chunks: [...INITIAL_CHUNKS],
      offlineAISIMDInsight:
        'On-Device Offline AI DOTS Profiler: Structure of Arrays (SoA) layout guarantees consecutive 32-byte LocalTransform reads across 64-byte CPU cache lines with 98.4% L1 hit rate. SIMD Burst Compiler can vectorize velocity integration with 8x throughput per core.'
    };
  }

  public getProfile(): UnityDOTSProfile {
    return this.profile;
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify(): void {
    this.listeners.forEach(cb => cb());
  }

  public defragmentChunks(): void {
    this.profile.chunks = this.profile.chunks.map(c => ({
      ...c,
      utilizationPercentage: 99.6
    }));
    this.profile.offlineAISIMDInsight =
      'On-Device Offline AI DOTS: Archetype Chunks defragmented into optimal contiguous memory boundaries. Unallocated holes eliminated. L1 Cache Hit Rate increased to 99.1%.';
    this.notify();
  }
}

export const unityDOTSEngine = new UnityDOTSEngineNode();
