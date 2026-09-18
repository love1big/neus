/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for Visual Studio Hot Reload & Memory Snapshot
 *          Leak Profiler (Visual Studio Enterprise Diagnostic Tools parity).
 *          Defines Edit-and-Continue (EnC) delta IL compilation, GC generation heaps
 *          (Gen 0, Gen 1, Gen 2, Large Object Heap LOH), dominator tree heap snapshots,
 *          retainment paths, and On-Device Offline AI memory leak root cause analyzers.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Visual Studio Hot Reload & Memory Profiler
 *          (เทียบเท่า Visual Studio Enterprise Diagnostics Tools)
 *          ครอบคลุมการคอมไพล์โค้ดแบบไม่ต้องรีสตาร์ต EnC (Edit and Continue), กราฟการจัดสรร
 *          หน่วยความจำแยกตาม Generation ของ Garbage Collector (Gen 0, Gen 1, Gen 2, LOH),
 *          การสแนปช็อตเปรียบเทียบ Heap เพื่อหาจุดเกิด Memory Leak
 *          และเอนจิน AI ออฟไลน์ในการระบุฟังก์ชันที่ลืม Dispose หรือ Unsubscribe Event
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `VSHotReloadMemoryProfilerNode.ts` and `VSHotReloadMemoryLeakProfilerStudio.tsx`
 * ============================================================================
 */

export interface GCObjectAllocation {
  id: string;
  className: string;
  count: number;
  sizeBytes: number;
  generation: 'GEN_0' | 'GEN_1' | 'GEN_2' | 'LOH';
  isLeakingSuspect: boolean;
  retainingPath: string;
}

export interface HotReloadPatch {
  patchId: string;
  timestamp: string;
  modifiedMethod: string;
  deltaIlBytes: number;
  status: 'APPLIED_SUCCESS' | 'RUDE_EDIT_REJECTED';
}

export interface VSMemoryDiagnosticsProfile {
  totalHeapAllocatedBytes: number;
  gen0Collections: number;
  gen1Collections: number;
  gen2Collections: number;
  liveObjects: GCObjectAllocation[];
  recentHotReloadPatches: HotReloadPatch[];
  offlineAILeakAnalysis: string;
}
