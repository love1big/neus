/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript types and contracts for Unity Addressables Asset Management
 *          & Bundle Memory Profiling System (Unity Addressables parity).
 *          Defines Asset Groups, Bundling Strategies (Pack Together by Label / Group),
 *          Remote vs Local Load Paths (Cloud Content Delivery - CCD), Memory Pinning/Unloading,
 *          Duplicate Dependency Audits, and On-Device Offline AI Asset Bundle Deduplication.
 *    - TH: สัญญา Interface และ Type สำหรับระบบจัดการแอสเซต Unity Addressables & Bundle Memory
 *          (เทียบเท่า Unity Addressable Asset System & Memory Profiler)
 *          ครอบคลุมกลุ่มแอสเซต (Asset Groups), การแบ่งแพ็กบันเดิล (Pack Separately/Together),
 *          เส้นทางดาวน์โหลด Local/Remote (CCD), การตรวจสอบหน่วยความจำรั่วไหลหรือแอสเซตซ้ำซ้อน,
 *          และระบบ AI ออฟไลน์ช่วยกำจัดไฟล์ขยะและลดขนาดแพ็กเกจเกม
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `UnityAddressablesEngineNode.ts` and `UnityAddressablesMemoryStudio.tsx`
 * ============================================================================
 */

export interface AddressableAssetEntry {
  guid: string;
  address: string; // e.g. "Assets/Characters/Knight_Armor.prefab"
  groupName: string;
  sizeBytes: number;
  labels: string[];
  isLoadedInMemory: boolean;
  duplicateRefCount: number;
}

export interface AddressablesGroupSettings {
  groupName: string;
  bundlingMode: 'PACK_TOGETHER' | 'PACK_SEPARATELY' | 'PACK_BY_LABEL';
  buildPath: 'LOCAL_BUILD_PATH' | 'REMOTE_BUILD_PATH';
  compression: 'LZ4' | 'LZMA' | 'UNCOMPRESSED';
}

export interface UnityAddressablesProfile {
  profileName: string;
  totalBundlesCount: number;
  totalMemoryAllocatedMB: number;
  groups: AddressablesGroupSettings[];
  assets: AddressableAssetEntry[];
  offlineAIDeduplicationSummary: string;
}
