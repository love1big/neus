/**
 * ============================================================================
 * @file HighPerformanceNetcodeStudio.tsx
 * @module Components/Netcode
 * @description
 * [TH] สตูดิโอวิเคราะห์การเชื่อมต่อและเน็ตโค้ดเกมออนไลน์ระดับ AAA
 * (High-Performance Multiplayer Netcode Analyzer & Diagnostics Studio)
 * ครอบคลุม:
 * 1. Client-Side Prediction & Server Reconciliation (การทำนายตำแหน่งและการชดเชยค่าผิดพลาด)
 * 2. Lag Compensation & Hitbox History Rewind (ย้อนตำแหน่งเพื่อตรวจสอบการยิง/การโจมตีตาม Ping)
 * 3. Synthetic Network Chaos Stress Tester (จำลอง Ping [0..300ms], Jitter, Packet Loss [0..20%])
 * 4. Delta Snapshot Compression & Realtime Bandwidth Profiler
 *
 * [EN] AAA Multiplayer Netcode Studio with client prediction, server reconciliation,
 * historical hitbox rewind, latency/jitter simulator & live network diagnostics.
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  Activity,
  Server,
  Radio,
  Sliders,
  RotateCcw,
  Play,
  Crosshair,
  ShieldAlert,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  HighPerformanceNetcodeEngine,
  NetworkDiagnosticMetrics,
  ServerSnapshot
} from '../utils/HighPerformanceNetcodeEngine';

export default function HighPerformanceNetcodeStudio() {
  const [engine] = useState(() => new HighPerformanceNetcodeEngine());
  const [metrics, setMetrics] = useState<NetworkDiagnosticMetrics | null>(null);

  // Simulation Controls
  const [pingSlider, setPingSlider] = useState<number>(65);
  const [jitterSlider, setJitterSlider] = useState<number>(6);
  const [packetLossSlider, setPacketLossSlider] = useState<number>(2);

  // Client & Server Entity Coordinates
  const [clientPos, setClientPos] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [serverPos, setServerPos] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [inputAxis, setInputAxis] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hitbox Test
  const [lastShotResult, setLastShotResult] = useState<{ hit: boolean; bone?: string; tick: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync engine configs
  useEffect(() => {
    engine.simulatedPingMs = pingSlider;
    engine.simulatedJitterMs = jitterSlider;
    engine.simulatedPacketLossRate = packetLossSlider / 100;
  }, [pingSlider, jitterSlider, packetLossSlider, engine]);

  // Simulation Tick Loop
  useEffect(() => {
    let animId: number;
    let tickCount = 0;

    const loop = () => {
      tickCount++;

      // 1. Client predicts input
      const { nextPos, packet } = engine.predictClientInput(clientPos, inputAxis, { jump: false, sprint: false, attack: false });
      setClientPos(nextPos);

      // 2. Server processes delayed state
      if (tickCount % 2 === 0) {
        // Record authoritative server state
        const serverAuthoritativePos = {
          x: nextPos.x + (Math.random() - 0.5) * 0.04, // slight server discrepancy
          y: 0,
          z: nextPos.z
        };
        setServerPos(serverAuthoritativePos);

        const dummySnapshot: ServerSnapshot = {
          serverTick: tickCount,
          timestamp: performance.now(),
          acknowledgedSequence: packet.sequenceNumber,
          entities: [{
            entityId: 'player-local',
            serverTick: tickCount,
            timestamp: performance.now(),
            position: serverAuthoritativePos,
            velocity: { x: 0, y: 0, z: 0 },
            yaw: 0,
            health: 100,
            animationState: 'Run'
          }],
          isDelta: true
        };

        engine.recordServerHitboxState(tickCount, dummySnapshot.entities);
        engine.reconcileWithServerSnapshot(nextPos, dummySnapshot, 'player-local');
      }

      setMetrics(engine.getMetrics());
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [clientPos, inputAxis, engine]);

  // Handle Hit Check (Fire Gun / Attack)
  const handleFireRaycast = () => {
    const origin = { x: 0, y: 1.5, z: -10 };
    const dir = { x: (clientPos.x) / 10, y: 0, z: 1.0 };
    const result = engine.executeLagCompensatedHitCheck(pingSlider, origin, dir, performance.now());
    setLastShotResult({
      hit: result.hit,
      bone: result.hitBone,
      tick: result.rewoundTick
    });
  };

  // Render 2D Top-Down Spatial & Hitbox Viewport
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = 540;
    const height = canvas.height = 420;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Coordinate Center
    const cx = width * 0.5;
    const cy = height * 0.5;
    const scale = 25;

    // Draw Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // 1. Draw Server Authoritative Ghost (Red Outline)
    const sx = cx + serverPos.x * scale;
    const sy = cy + serverPos.z * scale;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(sx - 14, sy - 14, 28, 28);
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Server Pos', sx - 24, sy - 20);

    // 2. Draw Client Predicted Entity (Cyan Solid)
    const px = cx + clientPos.x * scale;
    const py = cy + clientPos.z * scale;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillText('Client Predicted', px - 35, py + 26);

    // Draw Error Vector line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(sx, sy);
    ctx.stroke();

  }, [clientPos, serverPos]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 overflow-hidden font-sans select-none">
      {/* Header */}
      <div className="h-14 bg-[#111827] border-b border-gray-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/40 rounded-xl text-indigo-400">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide text-base">High-Performance Netcode Studio</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Multiplayer Diagnostic Suite
              </span>
            </div>
            <p className="text-xs text-gray-400">Client-Side Prediction • Server Reconciliation • Hitbox Rewind • Jitter Profiler</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFireRaycast}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-red-900/30 transition active:scale-95"
          >
            <Crosshair className="w-3.5 h-3.5" />
            Fire Lag-Compensated Raycast
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Synthetic Network Conditions */}
        <div className="w-80 bg-[#0f172a] border-r border-gray-800 flex flex-col p-4 gap-4 overflow-y-auto shrink-0">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
              Synthetic Network Conditions (จำลองสภาวะเครือข่าย)
            </span>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Simulated Latency (Ping)</span>
                  <span className="text-indigo-400 font-mono">{pingSlider} ms</span>
                </div>
                <input
                  type="range" min="5" max="300" step="5" value={pingSlider}
                  onChange={e => setPingSlider(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Network Jitter (ความแกว่ง)</span>
                  <span className="text-violet-400 font-mono">±{jitterSlider} ms</span>
                </div>
                <input
                  type="range" min="0" max="30" value={jitterSlider}
                  onChange={e => setJitterSlider(parseInt(e.target.value))}
                  className="w-full accent-violet-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Packet Loss Rate (แพ็กเก็ตสูญหาย)</span>
                  <span className="text-red-400 font-mono">{packetLossSlider}%</span>
                </div>
                <input
                  type="range" min="0" max="20" value={packetLossSlider}
                  onChange={e => setPacketLossSlider(parseInt(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>
            </div>
          </div>

          {/* Manual Movement D-Pad */}
          <div className="pt-3 border-t border-gray-800">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Move Client Entity (D-Pad)
            </span>
            <div className="grid grid-cols-3 gap-1.5 w-36 mx-auto">
              <div />
              <button
                onMouseDown={() => setInputAxis({ x: 0, y: -1 })}
                onMouseUp={() => setInputAxis({ x: 0, y: 0 })}
                className="py-2 bg-gray-800 hover:bg-gray-700 rounded text-center font-bold text-xs"
              >
                ▲
              </button>
              <div />
              <button
                onMouseDown={() => setInputAxis({ x: -1, y: 0 })}
                onMouseUp={() => setInputAxis({ x: 0, y: 0 })}
                className="py-2 bg-gray-800 hover:bg-gray-700 rounded text-center font-bold text-xs"
              >
                ◀
              </button>
              <button
                onClick={() => { setClientPos({ x: 0, y: 0, z: 0 }); setServerPos({ x: 0, y: 0, z: 0 }); }}
                className="py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-center font-bold text-[10px]"
              >
                CLR
              </button>
              <button
                onMouseDown={() => setInputAxis({ x: 1, y: 0 })}
                onMouseUp={() => setInputAxis({ x: 0, y: 0 })}
                className="py-2 bg-gray-800 hover:bg-gray-700 rounded text-center font-bold text-xs"
              >
                ▶
              </button>
              <div />
              <button
                onMouseDown={() => setInputAxis({ x: 0, y: 1 })}
                onMouseUp={() => setInputAxis({ x: 0, y: 0 })}
                className="py-2 bg-gray-800 hover:bg-gray-700 rounded text-center font-bold text-xs"
              >
                ▼
              </button>
              <div />
            </div>
          </div>

          {/* Last Shot Feedback */}
          {lastShotResult && (
            <div className={`p-3 rounded-xl border text-xs ${
              lastShotResult.hit
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/40 border-red-500/40 text-red-300'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                {lastShotResult.hit ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {lastShotResult.hit ? `HIT REGISTERED: ${lastShotResult.bone}` : 'SHOT MISSED'}
              </div>
              <p className="text-[11px] opacity-80 mt-1">Rewound server tick to: #{lastShotResult.tick}</p>
            </div>
          )}

          {/* Real-time Diagnostics Metrics */}
          {metrics && (
            <div className="mt-auto p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-[11px] space-y-1.5">
              <div className="font-semibold text-gray-300 flex items-center justify-between">
                <span>Netcode Diagnostics</span>
                <span className="text-indigo-400 font-mono">{metrics.snapshotRateHz} Hz Tick</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Round Trip Time (RTT):</span>
                <span className="text-indigo-300 font-mono">{metrics.rttMs.toFixed(1)} ms</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Upload / Download:</span>
                <span className="text-gray-300 font-mono">{(metrics.bytesSentPerSec / 1024).toFixed(1)} KB/s</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Prediction Error:</span>
                <span className="text-amber-400 font-mono">{(metrics.predictionErrorDistance * 100).toFixed(2)} cm</span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Realtime Spatial Reconciliation Viewport */}
        <div className="flex-1 flex flex-col bg-[#050811] relative overflow-hidden">
          <div className="h-10 bg-[#0d1322] border-b border-gray-800 px-4 flex items-center justify-between z-10">
            <span className="text-xs font-semibold text-gray-300">Spatial Prediction vs Server Reconciliation Buffer</span>
            <span className="text-xs font-mono text-indigo-400">Lag Compensation Window: 1000ms</span>
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
            <div className="border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <canvas ref={canvasRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
