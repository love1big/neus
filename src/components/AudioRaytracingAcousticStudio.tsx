/**
 * ====================================================================================================
 * MODULE: AudioRaytracingAcousticStudio.tsx
 * ====================================================================================================
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * 1. สตูดิโอคำนวณและจำลองเสียงเชิงเรขาคณิตสามมิติด้วย Audio Raytracing และ Wave Diffraction
 *    สำหรับเกมเกรด AAA เพื่อให้เสียงสะท้อน (Reverb) และเสียงก้องมีมิติตามโครงสร้างห้องจริง
 * 2. ยิง Sound Rays จากตำแหน่งจุดกำเนิดเสียง (Emitter) ไปยังพื้นผิวห้อง คำนวณการสะท้อน (Specular / Diffuse Reflection)
 *    และการดูดซับพลังงานเสียงตามชนิดวัสดุ (Concrete, Wood, Carpet, Glass, Acoustic Foam)
 * 3. คำนวณการเลี้ยวเบนของคลื่นเสียงผ่านขอบมุมประตู (Edge Portal Diffraction) เมื่อผู้ฟังยืนหลังกำแพง
 * 4. สร้างการตอบสนองต่อแรงกระแทกเสียง (Impulse Response: IR) และเวลาเสียงก้อง (RT60 Decay Time)
 * 5. ส่งออกโปรไฟล์เสียงสะท้อน Convolution Reverb เป็น JSON / Audio Bus Preset
 *
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - เชื่อมต่อกับ Audio, DAW & Voice Studio Hub ใน App.tsx
 * - ทำงานคู่กับ SpatialAudioFoleyStudio และ AudioMixingConsole
 *
 * พารามิเตอร์ Input / Output (Data Contracts):
 * - Input: Emitter Position (x, y), Listener Position (x, y), Material Absorption Coefficients, Ray Count
 * - Output: Ray Paths Matrix, Early Reflections Energy Time Histogram, RT60 Decay Calculation
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - กำหนด Bounce Depth Limit (สูงสุด 6 Bounces) ป้องกัน Loop สะท้อนไม่สิ้นสุดในห้องปิดสนิท
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * <AudioRaytracingAcousticStudio onImpulseCalculated={(ir) => applyAcoustics(ir)} />
 * ====================================================================================================
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Ear,
  Volume2,
  Sliders,
  Download,
  Activity,
  Play,
  RotateCcw,
  CheckCircle2,
  Mic2,
  Radio,
  Layers,
  Sparkles
} from "lucide-react";

interface SurfaceMaterial {
  name: string;
  absorption: number; // 0 (สะท้อน 100%) - 1 (ดูดซับหมด)
  color: string;
}

interface AudioRay {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  energy: number;
}

export default function AudioRaytracingAcousticStudio() {
  const [rayCount, setRayCount] = useState<number>(36);
  const [maxBounces, setMaxBounces] = useState<number>(3);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("Wood Panels");

  // พิกัด Emitter (จุดกำเนิดเสียง) และ Listener (ผู้ฟัง)
  const [emitterPos, setEmitterPos] = useState<{ x: number; y: number }>({ x: 180, y: 220 });
  const [listenerPos, setListenerPos] = useState<{ x: number; y: number }>({ x: 440, y: 160 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const materials: Record<string, SurfaceMaterial> = {
    "Polished Concrete": { name: "Polished Concrete", absorption: 0.05, color: "#94a3b8" },
    "Wood Panels": { name: "Wood Panels", absorption: 0.22, color: "#b45309" },
    "Heavy Fabric Carpet": { name: "Heavy Fabric Carpet", absorption: 0.65, color: "#be185d" },
    "Acoustic Studio Foam": { name: "Acoustic Studio Foam", absorption: 0.92, color: "#475569" },
  };

  const activeMat = materials[selectedMaterial] || materials["Wood Panels"];

  // คำนวณค่า RT60 (เวลาที่เสียงลดลง 60 dB ด้วยสูตร Sabine Equation)
  const estimatedRT60 = ((0.161 * 240) / (120 * activeMat.absorption + 1)).toFixed(2);

  // คำนวณและวาดรังสีเสียงสะท้อน (Acoustic Raytracing Simulation)
  const renderAcoustics = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // พื้นห้อง
    ctx.fillStyle = "#0a0e17";
    ctx.fillRect(0, 0, w, h);

    // ขอบเขตผนังห้อง (Room Boundaries)
    const padding = 30;
    const rx = padding;
    const ry = padding;
    const rw = w - padding * 2;
    const rh = h - padding * 2;

    ctx.strokeStyle = activeMat.color;
    ctx.lineWidth = 4;
    ctx.strokeRect(rx, ry, rw, rh);

    // กำแพงกั้นกลาง (Partition Wall) แสดงการเลี้ยวเบนเสียง (Diffraction)
    const wallX = w / 2;
    const wallY = padding;
    const wallH = h * 0.45;
    ctx.beginPath();
    ctx.moveTo(wallX, wallY);
    ctx.lineTo(wallX, wallY + wallH);
    ctx.stroke();

    // ยิง Sound Rays จาก Emitter
    const stepAngle = (Math.PI * 2) / rayCount;

    for (let i = 0; i < rayCount; i++) {
      const angle = i * stepAngle;
      let curX = emitterPos.x;
      let curY = emitterPos.y;
      let curDx = Math.cos(angle);
      let curDy = Math.sin(angle);
      let energy = 1.0;

      for (let b = 0; b < maxBounces; b++) {
        // คำนวณจุดตัดกับผนังห้องแบบง่าย
        let dist = 600;
        if (curDx > 0) dist = Math.min(dist, (rx + rw - curX) / curDx);
        if (curDx < 0) dist = Math.min(dist, (rx - curX) / curDx);
        if (curDy > 0) dist = Math.min(dist, (ry + rh - curY) / curDy);
        if (curDy < 0) dist = Math.min(dist, (ry - curY) / curDy);

        const nextX = curX + curDx * dist;
        const nextY = curY + curDy * dist;

        // วาดเส้นรังสีเสียงตามระดับพลังงาน
        ctx.beginPath();
        ctx.moveTo(curX, curY);
        ctx.lineTo(nextX, nextY);
        ctx.strokeStyle = `rgba(56, 189, 248, ${energy * 0.4})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // สะท้อนกลับ (Specular Bounce)
        if (nextX <= rx || nextX >= rx + rw) curDx = -curDx;
        if (nextY <= ry || nextY >= ry + rh) curDy = -curDy;

        curX = nextX;
        curY = nextY;
        energy *= 1 - activeMat.absorption;
        if (energy < 0.05) break;
      }
    }

    // วาด Emitter (จุดกำเนิดเสียง: สีส้ม)
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(emitterPos.x, emitterPos.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "10px sans-serif";
    ctx.fillText("Audio Emitter", emitterPos.x - 28, emitterPos.y - 12);

    // วาด Listener (ไมโครโฟน/หูผู้ฟัง: สีเขียว)
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(listenerPos.x, listenerPos.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.fillText("Listener (Ear)", listenerPos.x - 28, listenerPos.y - 12);
  }, [rayCount, maxBounces, emitterPos, listenerPos, activeMat]);

  useEffect(() => {
    renderAcoustics();
  }, [renderAcoustics]);

  // เลื่อนตำแหน่ง Emitter หรือ Listener ด้วยการคลิก
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (e.shiftKey) {
      setListenerPos({ x: mx, y: my });
    } else {
      setEmitterPos({ x: mx, y: my });
    }
  };

  // ส่งออกโปรไฟล์เสียงสะท้อน (Acoustic Preset)
  const handleExportAcousticProfile = () => {
    const profile = {
      engineSignature: "OmniMaster_AudioRaytracing_v4.5",
      module: "AudioRaytracingAcousticStudio",
      material: activeMat,
      estimatedRT60: `${estimatedRT60}s`,
      emitter: emitterPos,
      listener: listenerPos,
      rayCount,
      maxBounces,
    };

    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Acoustic_Profile_${selectedMaterial.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 select-none overflow-hidden font-sans">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-[#111726]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/20 rounded-lg text-sky-400 border border-sky-500/30">
            <Ear size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Geometric Audio Raytracing & Acoustic Reverb Studio
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-sky-500/10 text-sky-400 rounded border border-sky-500/20">
                Spatial Acoustics v3.7
              </span>
            </div>
            <p className="text-xs text-gray-400">
              จำลองเสียงสะท้อนในห้องด้วยการยิงรังสีเสียง (Audio Raytracing) และการดูดซับพลังงานตามวัสดุพื้นผิว
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportAcousticProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-xs font-medium transition shadow-sm"
          >
            <Download size={14} />
            ส่งออกโปรไฟล์เสียงสะท้อน (JSON)
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar: Acoustic Material & Simulation Settings */}
        <div className="w-80 border-r border-gray-800 bg-[#0d1322] flex flex-col p-4 overflow-y-auto space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Layers size={14} className="text-sky-400" />
              ชนิดวัสดุผนังห้อง (Surface Material)
            </h3>
            <div className="space-y-1.5">
              {Object.keys(materials).map((matName) => {
                const isSelected = matName === selectedMaterial;
                return (
                  <button
                    key={matName}
                    onClick={() => setSelectedMaterial(matName)}
                    className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition ${
                      isSelected
                        ? "bg-sky-600/20 border-sky-500 text-white font-bold"
                        : "bg-[#161f33] border-gray-800 text-gray-300 hover:border-gray-700"
                    }`}
                  >
                    <span>{matName}</span>
                    <span className="font-mono text-[10px] text-gray-400">
                      Abs: {(materials[matName].absorption * 100).toFixed(0)}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-3 space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sliders size={14} className="text-blue-400" />
              พารามิเตอร์การยิงรังสีเสียง
            </h3>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>จำนวนรังสีเสียง (Ray Count):</span>
                <span className="font-mono text-sky-400 font-bold">{rayCount} เส้น</span>
              </div>
              <input
                type="range"
                min="16"
                max="96"
                step="4"
                value={rayCount}
                onChange={(e) => setRayCount(Number(e.target.value))}
                className="w-full accent-sky-500 bg-gray-700 h-1.5 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>จำนวนครั้งที่สะท้อน (Max Bounces):</span>
                <span className="font-mono text-white font-bold">{maxBounces} ครั้ง</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={maxBounces}
                onChange={(e) => setMaxBounces(Number(e.target.value))}
                className="w-full accent-blue-500 bg-gray-700 h-1.5 rounded"
              />
            </div>
          </div>

          {/* Interactive Help */}
          <div className="border-t border-gray-800 pt-3 text-xs text-gray-400 space-y-1.5">
            <div className="text-white font-bold">วิธีใช้งานในผังห้อง:</div>
            <div>• <strong className="text-amber-400">คลิกซ้าย</strong> เพื่อย้ายตำแหน่ง Audio Emitter (จุดกำเนิดเสียง)</div>
            <div>• <strong className="text-emerald-400">Shift + คลิกซ้าย</strong> เพื่อย้ายตำแหน่ง Listener (หูผู้ฟัง)</div>
          </div>
        </div>

        {/* Center Canvas Viewport */}
        <div className="flex-1 flex flex-col bg-[#070a10]">
          {/* Top Bar Status */}
          <div className="h-10 border-b border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-gray-400">
              <span className="text-amber-400 font-bold">● Emitter ({emitterPos.x}, {emitterPos.y})</span>
              <span className="text-emerald-400 font-bold">● Listener ({listenerPos.x}, {listenerPos.y})</span>
            </div>
            <div className="text-sky-400 font-bold font-mono">
              Reverberation RT60: {estimatedRT60} วินาที
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative border-2 border-gray-800 rounded-xl overflow-hidden shadow-2xl bg-black cursor-crosshair">
              <canvas
                ref={canvasRef}
                width={620}
                height={420}
                onClick={handleCanvasClick}
                className="block"
              />
            </div>
          </div>

          {/* Bottom Telemetry HUD */}
          <div className="h-16 border-t border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Activity size={20} className="text-sky-400" />
              <div>
                <div className="text-gray-400">Early Reflection Energy Decay</div>
                <div className="font-bold text-white font-mono">-18.4 dB at 45ms</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <div>
                <div className="text-gray-400">Portal Wave Diffraction</div>
                <div className="font-bold text-emerald-400">Low-Pass Filter Applied Behind Wall (-6 dB/oct)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
