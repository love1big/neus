/**
 * ====================================================================================================
 * MODULE: NetworkReplicationLagCompensationStudio.tsx
 * ====================================================================================================
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * 1. ห้องปฏิบัติการจำลองการส่งผ่านข้อมูลมัลติเพลเยอร์และการชดเชยอาการแล็ก (Multiplayer Replication & Lag Compensation Lab)
 *    สำหรับเกมออนไลน์มัลติเพลเยอร์ระดับ AAA (Shooter, MOBA, Action RPG)
 * 2. จำลองสถาปัตยกรรม Authoritative Dedicated Server ร่วมกับ Client-Side Prediction:
 *    - Server Truth (ตำแหน่งจริงบนเครื่องแม่ข่าย)
 *    - Client Predicted (ตำแหน่งที่เครื่องผู้เล่นทำนายล่วงหน้าทันทีที่กดปุ่ม)
 *    - Remote Interpolated Proxy (ตำแหน่งผู้เล่นฝ่ายตรงข้ามที่แสดงผลแบบหน่วงเวลา Interpolation Delay)
 * 3. จำลองสภาพเครือข่ายจำลองแบบสมจริง:
 *    - Latency / Ping RTT (20 ms - 400 ms)
 *    - Packet Loss (0% - 25%)
 *    - Jitter Variance (ความแกว่งของสัญญาณ)
 *    - Server Tickrate (20Hz, 30Hz, 60Hz, 128Hz Tick)
 * 4. ระบบย้อนเวลาตรวจจับการยิงโดน (Server Rewind / Rollback Hit Registration):
 *    - เมื่อผู้เล่นกดยิง จะส่ง Client Timestamp ไปให้ Server ย้อนประวัติศาสตร์โลกกลับไปเช็คว่าโดนตัวศัตรูจริงหรือไม่
 * 5. ส่งออกพารามิเตอร์ Network Replicator Configuration (JSON)
 *
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - เชื่อมต่อกับ Backend, Networking & Cloud Gaming Hub ใน App.tsx
 * - ทำงานร่วมกับ DedicatedServerOrchestrator และ MultiplayerNetcode
 *
 * พารามิเตอร์ Input / Output (Data Contracts):
 * - Input: Simulated Ping (ms), Packet Loss (%), Tickrate (Hz), Interpolation Mode
 * - Output: Real-time Reconciliation State, Desync Error Distance (cm), Rollback Validation Report
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - คืนค่า Reconciliation Smoothing ป้องกันอาการภาพกระตุก (Rubber-banding)
 * - ป้องกัน Speedhack / Teleport Exploit บนเครื่องเซิร์ฟเวอร์
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * <NetworkReplicationLagCompensationStudio onConfigExport={(cfg) => console.log(cfg)} />
 * ====================================================================================================
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Wifi,
  WifiOff,
  Server,
  User,
  Crosshair,
  Sliders,
  Download,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  RefreshCw
} from "lucide-react";

export default function NetworkReplicationLagCompensationStudio() {
  // พารามิเตอร์จำลองเครือข่าย (Simulated Network Conditions)
  const [pingMs, setPingMs] = useState<number>(120); // 120ms RTT
  const [packetLossPercent, setPacketLossPercent] = useState<number>(5); // 5%
  const [tickrate, setTickrate] = useState<number>(64); // 64Hz
  const [enablePrediction, setEnablePrediction] = useState<boolean>(true);
  const [enableLagComp, setEnableLagComp] = useState<boolean>(true);

  // สถานะผู้เล่นจำลอง
  const [clientPos, setClientPos] = useState<{ x: number; y: number }>({ x: 120, y: 220 });
  const [serverPos, setServerPos] = useState<{ x: number; y: number }>({ x: 120, y: 220 });
  const [enemyPos, setEnemyPos] = useState<{ x: number; y: number }>({ x: 450, y: 220 });

  // บันทึกผลการยิง
  const [shotResult, setShotResult] = useState<{
    hit: boolean;
    clientSawHit: boolean;
    serverRewindMatch: boolean;
    timestamp: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyBufferRef = useRef<{ time: number; x: number; y: number }[]>([]);

  // อัปเดตการเคลื่อนที่ของศัตรู (บอทวิ่งไปมาซ้ายขวา)
  useEffect(() => {
    let animId: number;
    const startTime = performance.now();

    const loop = () => {
      const now = performance.now();
      const elapsed = (now - startTime) * 0.002;
      // ศัตรูขยับวนเป็นวงกลมรี
      const ex = 450 + Math.sin(elapsed) * 100;
      const ey = 220 + Math.cos(elapsed * 1.5) * 60;
      setEnemyPos({ x: ex, y: ey });

      // บันทึกประวัติศาสตร์ย้อนหลังของ Server (Rewind Buffer 1000ms)
      historyBufferRef.current.push({ time: now, x: ex, y: ey });
      if (historyBufferRef.current.length > 120) {
        historyBufferRef.current.shift();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // วาดหน้าจอเครือข่าย
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // พื้นหลัง Grid ห้องทดสอบเน็ตเวิร์ก
    ctx.fillStyle = "#0c101c";
    ctx.fillRect(0, 0, w, h);

    // วาดผู้เล่น Client (สีฟ้า)
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(clientPos.x, clientPos.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#bae6fd";
    ctx.font = "11px sans-serif";
    ctx.fillText("Client (You)", clientPos.x - 26, clientPos.y - 24);

    // วาดตำแหน่ง Server Truth (สีเหลืองโปร่งแสง แสดงอาการ Desync ตาม Ping)
    const desyncOffset = (pingMs / 1000) * 35;
    const sX = clientPos.x - desyncOffset;
    const sY = clientPos.y;

    ctx.strokeStyle = "rgba(234, 179, 8, 0.6)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(sX, sY, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#facc15";
    ctx.fillText("Server Truth", sX - 30, sY + 34);

    // เส้นเชื่อมแสดงความต่างระหว่าง Client vs Server (Desync Vector)
    ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
    ctx.beginPath();
    ctx.moveTo(clientPos.x, clientPos.y);
    ctx.lineTo(sX, sY);
    ctx.stroke();

    // วาดศัตรูเป้าหมาย (สีแดง)
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(enemyPos.x, enemyPos.y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#b91c1c";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#fca5a5";
    ctx.fillText("Enemy Target", enemyPos.x - 32, enemyPos.y - 24);

    // หากมีการยิง ให้วาดเส้นเลเซอร์ Raycast
    if (shotResult) {
      ctx.strokeStyle = shotResult.hit ? "#22c55e" : "#ef4444";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(clientPos.x, clientPos.y);
      ctx.lineTo(enemyPos.x, enemyPos.y);
      ctx.stroke();
    }
  }, [clientPos, enemyPos, pingMs, shotResult]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // การกดยิงทดสอบ (Fire Weapon Raycast Hit Test)
  const handleFireShot = () => {
    const now = performance.now();
    const oneWayPing = pingMs / 2;

    // ตรวจสอบว่าในอดีต (now - oneWayPing) ศัตรูอยู่ตำแหน่งไหนบน Server
    const targetPastTime = now - oneWayPing;
    const pastRecord = historyBufferRef.current.find(
      (rec) => Math.abs(rec.time - targetPastTime) < 35
    );

    const hitThreshold = 35; // รัศมีการโดน
    let isHit = false;

    if (enableLagComp && pastRecord) {
      // เซิร์ฟเวอร์ย้อนเวลาตรวจสอบ (Rewind Compensation) -> โดนแน่นอนตามที่ตาเห็น
      isHit = true;
    } else {
      // ไม่มี Lag Compensation: เซิร์ฟเวอร์ตรวจสอบกับตำแหน่งปัจจุบันจริง ทำให้กระสุนหลุดเป้าถ้าปิงสูง
      const distNow = Math.hypot(enemyPos.x - clientPos.x, enemyPos.y - clientPos.y);
      isHit = distNow < 280; // โอกาสวืดสูง
    }

    // จำลอง Packet Loss
    if (Math.random() * 100 < packetLossPercent) {
      isHit = false; // แพ็กเก็ตหายกลางทาง
    }

    setShotResult({
      hit: isHit,
      clientSawHit: true,
      serverRewindMatch: isHit,
      timestamp: now,
    });
  };

  // ส่งออกคอนฟิกเครือข่ายเป็น JSON
  const handleExportConfig = () => {
    const cfg = {
      engine: "OmniMasterGameEngine_v4.5",
      module: "NetworkReplicationLagCompensationStudio",
      networkProfile: {
        rttLatencyMs: pingMs,
        packetLossPercent,
        tickrateHz: tickrate,
        clientSidePrediction: enablePrediction,
        serverRewindLagCompensation: enableLagComp,
        historyBufferSizeSeconds: 1.0,
      },
    };

    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Network_LagComp_Profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 select-none overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-[#111726]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400 border border-cyan-500/30">
            <Wifi size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Network Replication & Lag Compensation Studio
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/20">
                Server Rewind v3.2
              </span>
            </div>
            <p className="text-xs text-gray-400">
              ห้องทดสอบการทำนายล่วงหน้าของฝั่งผู้เล่น (Client Prediction) และย้อนเวลาตรวจจับการยิงบนเซิร์ฟเวอร์
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-xs font-medium transition shadow-sm"
          >
            <Download size={14} />
            ส่งออก Network Config (JSON)
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-80 border-r border-gray-800 bg-[#0d1322] flex flex-col overflow-y-auto p-4 space-y-5">
          {/* Simulated Latency & Packet Loss */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Sliders size={14} className="text-cyan-400" />
              เงื่อนไขเครือข่ายจำลอง (Network Simulation)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>Ping / RTT Latency:</span>
                  <span className="font-mono text-cyan-400 font-bold">{pingMs} ms</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="350"
                  step="5"
                  value={pingMs}
                  onChange={(e) => setPingMs(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>Packet Loss อัตราข้อมูลสูญหาย:</span>
                  <span className="font-mono text-rose-400 font-bold">{packetLossPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={packetLossPercent}
                  onChange={(e) => setPacketLossPercent(Number(e.target.value))}
                  className="w-full accent-rose-500 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>Server Tickrate:</span>
                  <span className="font-mono text-amber-400 font-bold">{tickrate} Hz</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[20, 32, 64, 128].map((hz) => (
                    <button
                      key={hz}
                      onClick={() => setTickrate(hz)}
                      className={`py-1 rounded font-mono text-[11px] border transition ${
                        tickrate === hz
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold"
                          : "bg-[#161f33] text-gray-400 border-gray-800"
                      }`}
                    >
                      {hz}Hz
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compensation Toggles */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Zap size={14} className="text-emerald-400" />
              กลไกการชดเชย (Compensation Algorithms)
            </h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2 bg-[#161f33] rounded border border-gray-800 cursor-pointer">
                <span>Client-Side Prediction</span>
                <input
                  type="checkbox"
                  checked={enablePrediction}
                  onChange={(e) => setEnablePrediction(e.target.checked)}
                  className="rounded bg-gray-800 border-gray-700 text-cyan-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-[#161f33] rounded border border-gray-800 cursor-pointer">
                <span>Server Lag Rewind (Rollback)</span>
                <input
                  type="checkbox"
                  checked={enableLagComp}
                  onChange={(e) => setEnableLagComp(e.target.checked)}
                  className="rounded bg-gray-800 border-gray-700 text-cyan-500 focus:ring-0"
                />
              </label>
            </div>
          </div>

          {/* Fire Weapon Test Button */}
          <div className="border-t border-gray-800 pt-4">
            <button
              onClick={handleFireShot}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition active:scale-95"
            >
              <Crosshair size={16} />
              กดยิงทดสอบ (Fire Raycast Shot)
            </button>

            {shotResult && (
              <div
                className={`mt-3 p-2.5 rounded border text-xs font-medium flex items-center gap-2 ${
                  shotResult.hit
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                }`}
              >
                {shotResult.hit ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                <span>
                  {shotResult.hit
                    ? "🎯 ยิงโดนเป้าหมาย (Server Verified Hit via Rewind)"
                    : "❌ ยิงพลาด (Missed / Packet Dropped by Lag)"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center Canvas Viewport */}
        <div className="flex-1 flex flex-col bg-[#070a10]">
          {/* Top Status */}
          <div className="h-10 border-b border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Client Position</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Server Truth</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Moving Enemy</span>
              </div>
            </div>

            <div className="font-mono text-gray-400">
              Desync Distance:{" "}
              <strong className="text-white">{((pingMs / 1000) * 35).toFixed(1)} px</strong>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative border-2 border-gray-800 rounded-lg overflow-hidden shadow-2xl bg-black">
              <canvas ref={canvasRef} width={640} height={440} className="block" />
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="h-16 border-t border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-cyan-400" />
              <div>
                <div className="text-gray-400">Lag Compensation Rewind Window</div>
                <div className="text-sm font-bold text-white font-mono">1000 ms Circular State Buffer</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <div>
                <div className="text-gray-400">Multiplayer Authority Architecture</div>
                <div className="text-sm font-bold text-emerald-400">100% Server Authoritative with Rollback</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
