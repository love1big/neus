/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for the Live Concurrency & Thread Synchronization
 *          Visualizer System (Visual Studio Concurrency Visualizer parity).
 *          Defines thread lanes (Main Game Thread, Render Thread, Audio Thread,
 *          Worker Threads 0-7), Execution Blocks, Synchronization Lock/Mutex Contention,
 *          Context Switches, and CPU Core Affinity mappings.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Concurrency & Thread Synchronization
 *          Visualizer (เทียบเท่า Visual Studio Enterprise Concurrency Visualizer)
 *          ครอบคลุมแถบเลนเธรด (Main Thread, Render Thread, Worker Threads 0-7),
 *          ช่วงเวลาการประมวลผล (Execution Blocks), สภาวะแย่งชิงล็อก (Mutex Contention),
 *          การสลับบริบท (Context Switches), และการกระจายโหลดข้ามคอร์ CPU
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `ConcurrencyThreadTelemetryNode.ts` and `ConcurrencyThreadVisualizerStudio.tsx`
 * ============================================================================
 */

export type ThreadCategory = 'MAIN_GAME' | 'RENDER' | 'AUDIO_DSP' | 'PHYSICS_WORKER' | 'IO_ASYNC';

export type BlockState = 'EXECUTING' | 'SYNC_BLOCKED' | 'SLEEPING' | 'IO_WAIT' | 'PREEMPTED';

export interface ThreadExecutionBlock {
  id: string;
  name: string;
  startTimeMs: number;
  durationMs: number;
  state: BlockState;
  colorHex: string;
}

export interface ThreadLane {
  id: string;
  name: string;
  category: ThreadCategory;
  coreAffinity: number; // e.g. Core 0 - 15
  cpuUtilizationPercent: number;
  blocks: ThreadExecutionBlock[];
}

export interface ConcurrencyProfile {
  totalCores: number;
  frameTimeMs: number;
  targetFramerate: number;
  lockContentionTimeMs: number;
  contextSwitchesPerSec: number;
  lanes: ThreadLane[];
}
