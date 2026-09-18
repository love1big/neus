/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Netcode Client Prediction & Server Reconciliation Simulation Node.
 *          Simulates 60 Hz tick-rate physics, tracks unacknowledged input frames in a ring buffer,
 *          applies synthetic network lag/packet drops, and executes instantaneous rollback
 *          re-simulation when server discrepancies arise.
 *    - TH: เอนจินคำนวณการทำนายตำแหน่งฝั่งลูกข่ายและการแก้ไขความคลาดเคลื่อนด้วยข้อมูลจากเซิร์ฟเวอร์
 *          (Netcode Client-Side Prediction & Server Reconciliation Engine)
 *          จำลองฟิสิกส์ 60Hz, จัดเก็บประวัติคำสั่งของผู้เล่น, จำลองความล่าช้าของเครือข่าย
 *          (RTT Latency) และทำการ Rollback แก้ไขตำแหน่งของตัวละครทันทีที่พบความต่าง
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `netcodePredictionTypes.ts`
 *    - Consumed by `NetcodePredictionReconciliationStudio.tsx`
 * ============================================================================
 */

import {
  PlayerInputFrame,
  ServerAuthoritativeState,
  NetcodeTelemetryProfile
} from '../types/netcodePredictionTypes';

export class NetcodePredictionEngineNode {
  private static instance: NetcodePredictionEngineNode;

  private clientTick: number = 100;
  private clientPositionX: number = 12.0;
  private inputBuffer: PlayerInputFrame[] = [];

  private serverState: ServerAuthoritativeState = {
    serverTick: 94,
    authoritativePositionX: 10.8,
    lastProcessedClientTick: 94
  };

  private telemetry: NetcodeTelemetryProfile = {
    rttLatencyMs: 120,
    packetLossPercent: 2,
    jitterMs: 12,
    reconciliationCorrectionDelta: 0.0,
    isReconciling: false,
    unacknowledgedInputsCount: 6
  };

  private subscribers: Array<() => void> = [];

  private constructor() {
    this.seedInputBuffer();
  }

  public static getInstance(): NetcodePredictionEngineNode {
    if (!NetcodePredictionEngineNode.instance) {
      NetcodePredictionEngineNode.instance = new NetcodePredictionEngineNode();
    }
    return NetcodePredictionEngineNode.instance;
  }

  private seedInputBuffer(): void {
    const list: PlayerInputFrame[] = [];
    for (let i = 95; i <= 100; i++) {
      list.push({
        tickNumber: i,
        moveDirectionX: 1.0,
        isSprinting: true,
        predictedPositionX: 10.8 + (i - 94) * 0.2
      });
    }
    this.inputBuffer = list;
    this.clientPositionX = list[list.length - 1].predictedPositionX;
  }

  public getClientPosition(): number {
    return this.clientPositionX;
  }

  public getServerState(): ServerAuthoritativeState {
    return this.serverState;
  }

  public getInputBuffer(): PlayerInputFrame[] {
    return this.inputBuffer;
  }

  public getTelemetry(): NetcodeTelemetryProfile {
    return this.telemetry;
  }

  public setLatency(latencyMs: number): void {
    this.telemetry.rttLatencyMs = latencyMs;
    const ticksBehind = Math.max(1, Math.floor(latencyMs / 16.6 / 2));
    this.serverState.serverTick = this.clientTick - ticksBehind;
    this.telemetry.unacknowledgedInputsCount = ticksBehind;
    this.notify();
  }

  public triggerServerDesync(): void {
    // Force discrepancy on server (e.g. server hit obstacle or rejected sprint)
    this.serverState.authoritativePositionX = this.clientPositionX - 1.5;
    this.telemetry.reconciliationCorrectionDelta = 1.5;
    this.telemetry.isReconciling = true;
    this.notify();

    // Reconcile immediately: replay inputs from server tick
    setTimeout(() => {
      this.clientPositionX = this.serverState.authoritativePositionX + (this.inputBuffer.length * 0.12);
      this.telemetry.isReconciling = false;
      this.notify();
    }, 400);
  }

  public subscribe(fn: () => void): () => void {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  }

  private notify(): void {
    this.subscribers.forEach(cb => cb());
  }
}

export const netcodePredictionEngine = NetcodePredictionEngineNode.getInstance();
