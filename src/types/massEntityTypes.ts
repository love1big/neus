/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for the Mass Entity ECS & Crowd Processor
 *          System (Unreal Engine 5 Mass Framework & Unity DOTS ECS parity).
 *          Defines Mass Entities, Archetypes, Fragments (Transform, Velocity, Avoidance),
 *          Tags (IsZombie, IsFleeing, IsWandering), Mass Processors, and Spatial Hash
 *          Grid cell configurations.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Mass Entity ECS & Crowd Processor
 *          (เทียบเท่า Unreal Engine 5 Mass Framework และ Unity DOTS ECS)
 *          ครอบคลุมเอนทิตีมวลรวมนับพันตัว (Mass Entities), การจัดหมวด Archetype,
 *          ฟรากเมนต์ข้อมูลต่อเนื่อง (Data Fragments: พิกัด, ความเร็ว, แรงหลบหลีก),
 *          แท็กกำกับพฤติกรรม (Tags), และระบบตารางแฮชเชิงพื้นที่ (Spatial Hash Grid)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `MassEntityEngineNode.ts` and `MassEntityCrowdSimulationStudio.tsx`
 * ============================================================================
 */

export type MassEntityBehaviorTag = 'WANDERING' | 'FLEEING' | 'ZOMBIE_CHASE' | 'IDLE';

export interface MassAgentEntity {
  id: number;
  posX: number;
  posY: number;
  velX: number;
  velY: number;
  tag: MassEntityBehaviorTag;
  colorHex: string;
}

export interface MassProcessorConfig {
  id: string;
  name: string;
  isEnabled: boolean;
  parallelJobBatches: number;
  executionTimeMs: number;
}

export interface MassSimulationStats {
  totalEntities: number;
  activeProcessorsCount: number;
  spatialHashBucketsUsed: number;
  crowdDensityAverage: number;
  simulationFrameTimeMs: number;
}
