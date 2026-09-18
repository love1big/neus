/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for Visual Studio IntelliTrace & Time-Travel
 *          Historical Debugger System (VS Enterprise IntelliTrace & TTD parity).
 *          Defines Historic Execution Frames, Reverse Stepping (Step Back, Reverse Continue),
 *          Exception Events, Thread Interleaving Timelines, Memory State Snapshots,
 *          and On-Device Offline AI Root Cause Bug Pinpointing.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Visual Studio IntelliTrace & Time-Travel
 *          Historical Debugger (เทียบเท่า VS Enterprise IntelliTrace & TTD)
 *          ครอบคลุมการบันทึกประวัติการรันโค้ด (Process Trace), การก้าวถอยหลังย้อนเวลา (Step Back),
 *          การบันทึก Exception และ Thread Timeline, ภาพจำลองสถานะตัวแปรในอดีต,
 *          และเอนจิน AI ออฟไลน์ในการระบุจุดต้นตอของบักที่เกิดขึ้นในอดีต
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `VSIntelliTraceEngineNode.ts` and `VSIntelliTraceTimeTravelDebuggerStudio.tsx`
 * ============================================================================
 */

export interface IntelliTraceEvent {
  sequenceId: number;
  timestamp: string;
  eventType: 'CALL' | 'EXCEPTION' | 'MUTEX_ACQUIRE' | 'PROPERTY_SET';
  methodName: string;
  threadId: number;
  variableSnapshot: Record<string, any>;
  isCulpritEvent: boolean;
}

export interface VSIntelliTraceProfile {
  recordingActive: boolean;
  totalRecordedEvents: number;
  currentPlaybackIndex: number;
  events: IntelliTraceEvent[];
  offlineAIRootCauseSummary: string;
}
