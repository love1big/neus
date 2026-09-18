/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for the Netcode Client-Side Prediction &
 *          Server Reconciliation System (Unreal Engine Network Prediction & Unity
 *          Netcode for Entities parity). Defines Input Ring Buffers, Server Authoritative
 *          Snapshots, RTT Latency Simulation, Packet Loss Drops, Rollback Reconciliation,
 *          and Lag Compensation Hitbox Rewinds.
 *    - TH: สัญญา Interface และ Type สำหรับระบบการทำนายตำแหน่งฝั่งลูกข่ายและการแก้ไขคืนค่า
 *          จากเซิร์ฟเวอร์ (Client-Side Prediction & Server Reconciliation)
 *          (เทียบเท่า Unreal Network Prediction และ Unity Netcode for Entities)
 *          ครอบคลุมบัฟเฟอร์ประวัติการกดปุ่ม (Input History Ring Buffer), การสแนปช็อตค่าจริง
 *          จากเซิร์ฟเวอร์ (Authoritative Server Snapshot), การจำลองค่าปิง (RTT Latency)
 *          และอัตราข้อมูลสูญหาย (Packet Loss)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `NetcodePredictionEngineNode.ts` and `NetcodePredictionReconciliationStudio.tsx`
 * ============================================================================
 */

export interface PlayerInputFrame {
  tickNumber: number;
  moveDirectionX: number; // -1.0 to 1.0
  isSprinting: boolean;
  predictedPositionX: number;
}

export interface ServerAuthoritativeState {
  serverTick: number;
  authoritativePositionX: number;
  lastProcessedClientTick: number;
}

export interface NetcodeTelemetryProfile {
  rttLatencyMs: number; // e.g. 120ms
  packetLossPercent: number; // e.g. 2%
  jitterMs: number;
  reconciliationCorrectionDelta: number; // distance between predicted and server
  isReconciling: boolean;
  unacknowledgedInputsCount: number;
}
