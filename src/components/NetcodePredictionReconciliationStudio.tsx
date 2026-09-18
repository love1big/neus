/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: AAA Netcode Client-Side Prediction & Server Reconciliation Studio
 *          (Unreal Network Prediction & Unity Netcode for Entities parity).
 *          Visualizes client predicted position vs server authoritative truth,
 *          input ring buffer ticks, RTT latency jitter injection, and real-time
 *          rollback reconciliation when mispredictions occur.
 *    - TH: สตูดิโอระบบทำนายการเคลื่อนที่ฝั่ง Client และการปรับค่าคืนจาก Server (Reconciliation)
 *          ระดับ AAA (เทียบเท่า Unreal Network Prediction และ Unity Netcode for Entities)
 *          เปรียบเทียบตำแหน่งที่ Client ทำนายล่วงหน้ากับตำแหน่งจริงบน Server แบบเรียลไทม์,
 *          แสดงประวัติคำสั่งใน Ring Buffer, ทดสอบการดีเลย์ (Ping/RTT),
 *          และทดสอบการยิง Desync เพื่อสังเกตการ Rollback ปรับตำแหน่งกลับอย่างราบรื่น
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `netcodePredictionTypes.ts` and `NetcodePredictionEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  Radio,
  Sliders,
  Sparkles,
  Activity,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { netcodePredictionEngine } from '../utils/NetcodePredictionEngineNode';
import { PlayerInputFrame, ServerAuthoritativeState, NetcodeTelemetryProfile } from '../types/netcodePredictionTypes';

interface NetcodeStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function NetcodePredictionReconciliationStudio({ onSelectTool }: NetcodeStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [clientPos, setClientPos] = useState<number>(() => netcodePredictionEngine.getClientPosition());
  const [serverState, setServerState] = useState<ServerAuthoritativeState>(() => netcodePredictionEngine.getServerState());
  const [inputBuffer, setInputBuffer] = useState<PlayerInputFrame[]>(() => netcodePredictionEngine.getInputBuffer());
  const [telemetry, setTelemetry] = useState<NetcodeTelemetryProfile>(() => netcodePredictionEngine.getTelemetry());

  useEffect(() => {
    return netcodePredictionEngine.subscribe(() => {
      setClientPos(netcodePredictionEngine.getClientPosition());
      setServerState(netcodePredictionEngine.getServerState());
      setInputBuffer(netcodePredictionEngine.getInputBuffer());
      setTelemetry(netcodePredictionEngine.getTelemetry());
    });
  }, []);

  // Render Dual-Timeline Viewport Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, width, height);

    // Draw tracks for Client and Server
    const scale = 26; // pixels per unit
    const startX = 60;

    // Track 1: Client Predicted Track
    const clientY = 130;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, clientY);
    ctx.lineTo(width - 40, clientY);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('Client Predicted Timeline (Local Player)', startX, clientY - 35);

    // Client Ghost
    const clientPixelX = startX + clientPos * scale;
    ctx.beginPath();
    ctx.arc(clientPixelX, clientY, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText(`X: ${clientPos.toFixed(2)}m`, clientPixelX - 18, clientY + 30);

    // Track 2: Server Authoritative Track
    const serverY = 280;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, serverY);
    ctx.lineTo(width - 40, serverY);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('Server Authoritative Timeline (Ground Truth)', startX, serverY - 35);

    // Server Ghost
    const serverPixelX = startX + serverState.authoritativePositionX * scale;
    ctx.beginPath();
    ctx.arc(serverPixelX, serverY, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText(`X: ${serverState.authoritativePositionX.toFixed(2)}m (Tick #${serverState.serverTick})`, serverPixelX - 35, serverY + 30);

    // Reconciliation Vector Line if delta exists
    if (Math.abs(clientPixelX - serverPixelX) > 4) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(clientPixelX, clientY);
      ctx.lineTo(serverPixelX, serverY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`Desync Delta: ${Math.abs(clientPos - serverState.authoritativePositionX).toFixed(2)}m`, (clientPixelX + serverPixelX) / 2 - 40, (clientY + serverY) / 2);
    }

  }, [clientPos, serverState]);

  return (
    <div className="flex flex-col h-full bg-[#060a12] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0c1322] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600/30 to-cyan-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
            <Radio size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Netcode Client-Side Prediction & Server Reconciliation Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 font-mono">
                Unreal Network Prediction Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              60Hz tick simulation, ring buffer input history, RTT latency delay, and instantaneous rollback reconciliation.
            </p>
          </div>
        </div>

        {/* Reconciling Badge */}
        <div className="flex items-center gap-2">
          {telemetry.isReconciling ? (
            <span className="px-3 py-1 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
              <RotateCcw size={13} className="text-rose-400" />
              RECONCILING ROLLBACK
            </span>
          ) : (
            <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              SYNCHRONIZED
            </span>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT DUAL TIMELINE (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1c2438] bg-[#060a12] relative">
          
          <div className="p-3 border-b border-[#1c2438] bg-[#0c1322] flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold">Client vs Server Prediction Tracks</span>
            <span className="text-emerald-400">RTT: {telemetry.rttLatencyMs} ms</span>
          </div>

          {/* Interactive Canvas */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={440}
              className="max-w-full max-h-full"
            />
          </div>

          {/* Action Footer */}
          <div className="p-3 border-t border-[#1c2438] bg-[#0c1322] flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#94a3b8] font-mono">Simulate Ping (RTT):</span>
              <input
                type="range"
                min="20"
                max="300"
                step="10"
                value={telemetry.rttLatencyMs}
                onChange={(e) => netcodePredictionEngine.setLatency(parseInt(e.target.value))}
                className="w-48 accent-emerald-500 h-1.5 bg-[#1a2336] rounded-lg cursor-pointer"
              />
              <span className="font-mono text-emerald-400">{telemetry.rttLatencyMs} ms</span>
            </div>

            <button
              onClick={() => netcodePredictionEngine.triggerServerDesync()}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-950/40"
            >
              <Zap size={13} />
              Inject Server Desync (Test Rollback)
            </button>
          </div>

        </div>

        {/* INPUT BUFFER & TELEMETRY (4 cols) */}
        <div className="lg:col-span-4 bg-[#090e18] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1728] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-emerald-400" /> Input Ring Buffer ({inputBuffer.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Unacknowledged</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Input Ring Buffer Frames */}
            <div className="p-3.5 rounded-xl bg-[#0f1728] border border-[#1e2a40] space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Buffered Client Inputs
              </span>

              <div className="space-y-1.5 text-xs font-mono">
                {inputBuffer.map(f => (
                  <div key={f.tickNumber} className="flex justify-between p-2 rounded bg-[#131e33] border border-[#1e2a40]">
                    <span className="text-cyan-400">Tick #{f.tickNumber}</span>
                    <span className="text-white">Dir: +{f.moveDirectionX} (Sprint)</span>
                    <span className="text-[#94a3b8]">X: {f.predictedPositionX.toFixed(2)}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Telemetry Metrics */}
            <div className="p-3.5 rounded-xl bg-[#0f1728] border border-[#1e2a40] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Network Transport Stats
              </span>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-[#131e33] border border-[#1e2a40]">
                  <span className="text-[#94a3b8]">Simulated RTT Ping:</span>
                  <span className="text-white font-bold">{telemetry.rttLatencyMs} ms</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#131e33] border border-[#1e2a40]">
                  <span className="text-[#94a3b8]">Packet Loss Rate:</span>
                  <span className="text-emerald-400 font-bold">{telemetry.packetLossPercent}%</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#131e33] border border-[#1e2a40]">
                  <span className="text-[#94a3b8]">Jitter Variation:</span>
                  <span className="text-cyan-400 font-bold">±{telemetry.jitterMs} ms</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
