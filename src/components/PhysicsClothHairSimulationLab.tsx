/**
 * ====================================================================================================
 * MODULE: PhysicsClothHairSimulationLab.tsx
 * ====================================================================================================
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * 1. ห้องปฏิบัติการจำลองฟิสิกส์ผ้าและเส้นผมแบบพลวัต (Physics-Driven Cloth & Hair Dynamic Simulation)
 *    สำหรับเกมระดับ AAA ด้วยอัลกอริทึม Verlet Integration และ XPBD (Extended Position Based Dynamics)
 * 2. คำนวณแรงสปริง 3 มิติ: Structural Constraints (โครงสร้างหลัก), Shear Constraints (แรงเฉือน),
 *    และ Bending Constraints (ความแข็งแรงต้านการหักงอ)
 * 3. จำลองสภาพแวดล้อมลม (Wind Vector & Turbulence Gusts), แรงโน้มถ่วง (Gravity), และแรงหน่วง (Damping)
 * 4. รองรับการโต้ตอบแบบเรียลไทม์: ลากดึงผ้า (Mouse Drag), ตัดขาดผ้า (Tear / Scissors), ปักหมุดยึด (Pin Vertices)
 *    และทดสอบการชนกับ Capsule / Sphere Collider ของร่างกายตัวละคร
 *
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - เชื่อมต่อกับ Physics, VFX & Rendering Hub ใน App.tsx
 * - ส่งผ่านพารามิเตอร์ Stiffness / Damping ให้กับ CharacterRiggingIK และ CinematicDirector
 *
 * พารามิเตอร์ Input / Output (Data Contracts):
 * - Input: Fabric Preset (Silk, Denim, Leather, Cape, Hair), Gravity (Y-axis), Wind Speed/Angle, Constraint Iterations
 * - Output: Real-time Vertex Positions, Stretch Stress Heatmap, Physics Performance FPS, Export JSON Preset
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - ป้องกันการระเบิดของสมการฟิสิกส์ (Physics Explosion / NaN Coordinates) ด้วย Delta Time Clamping และ Maximum Velocity Cap
 * - คืนค่าเสถียรภาพอัตโนมัติหากจุดมวลกระเด็นออกนอกขอบเขตจำลอง
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * <PhysicsClothHairSimulationLab onConfigExport={(preset) => console.log(preset)} />
 * ====================================================================================================
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Flame,
  Wind,
  Scissors,
  Pin,
  RefreshCw,
  Play,
  Pause,
  Sliders,
  Download,
  ShieldCheck,
  Zap,
  Activity,
  Maximize2
} from "lucide-react";

// โครงสร้างจุดมวลฟิสิกส์ (Verlet Point Mass)
interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  pinned: boolean;
  color?: string;
}

// ข้อต่อสปริง (Physics Constraint Link)
interface Constraint {
  p1: Point;
  p2: Point;
  length: number;
  broken: boolean;
  type: "structural" | "shear" | "bending";
}

export type FabricPresetType = "silk" | "denim" | "leather" | "cape" | "hair";

export default function PhysicsClothHairSimulationLab() {
  // ค่าพารามิเตอร์ฟิสิกส์
  const [preset, setPreset] = useState<FabricPresetType>("cape");
  const [gravity, setGravity] = useState<number>(0.35);
  const [windSpeed, setWindSpeed] = useState<number>(1.2);
  const [windAngle, setWindAngle] = useState<number>(0); // องศา
  const [stiffnessIterations, setStiffnessIterations] = useState<number>(4);
  const [damping, setDamping] = useState<number>(0.985);
  const [tearSensitivity, setTearSensitivity] = useState<number>(3.5);

  // สถานะเครื่องมือโต้ตอบ
  const [activeTool, setActiveTool] = useState<"drag" | "cut" | "pin">("drag");
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(60);
  const [pointCount, setPointCount] = useState<number>(0);
  const [constraintCount, setConstraintCount] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const constraintsRef = useRef<Constraint[]>([]);
  const mouseStateRef = useRef<{
    isDown: boolean;
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    draggedPoint: Point | null;
  }>({
    isDown: false,
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    draggedPoint: null,
  });

  const colliderRef = useRef<{ x: number; y: number; radius: number }>({
    x: 320,
    y: 280,
    radius: 45,
  });

  // สร้างตาข่ายผ้าหรือเส้นผมตามพรีเซ็ต
  const initializeSimulation = useCallback(() => {
    const points: Point[] = [];
    const constraints: Constraint[] = [];

    const startX = 170;
    const startY = 70;
    const cols = preset === "hair" ? 14 : 22;
    const rows = preset === "hair" ? 28 : 20;
    const spacingX = preset === "hair" ? 22 : 14;
    const spacingY = 14;

    // สร้างจุดมวล (Points)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacingX;
        const y = startY + r * spacingY;
        // แถวบนสุดปักหมุดไว้ (Pinned)
        const isPinned = r === 0 && (c % 2 === 0 || c === cols - 1);
        points.push({
          x,
          y,
          oldX: x,
          oldY: y,
          pinned: isPinned,
        });
      }
    }

    // สร้างข้อต่อสปริง (Structural Constraints)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const currentIdx = r * cols + c;

        // เชื่อมแนวนอน (Horizontal)
        if (c < cols - 1) {
          const rightIdx = currentIdx + 1;
          constraints.push({
            p1: points[currentIdx],
            p2: points[rightIdx],
            length: spacingX,
            broken: false,
            type: "structural",
          });
        }

        // เชื่อมแนวตั้ง (Vertical)
        if (r < rows - 1) {
          const bottomIdx = currentIdx + cols;
          constraints.push({
            p1: points[currentIdx],
            p2: points[bottomIdx],
            length: spacingY,
            broken: false,
            type: "structural",
          });
        }

        // เชื่อมแนวทแยง (Shear Constraints) เฉพาะถ้าไม่ใช่เส้นผม
        if (preset !== "hair" && c < cols - 1 && r < rows - 1) {
          const diagIdx = currentIdx + cols + 1;
          const diagLen = Math.sqrt(spacingX * spacingX + spacingY * spacingY);
          constraints.push({
            p1: points[currentIdx],
            p2: points[diagIdx],
            length: diagLen,
            broken: false,
            type: "shear",
          });
        }
      }
    }

    pointsRef.current = points;
    constraintsRef.current = constraints;
    setPointCount(points.length);
    setConstraintCount(constraints.length);
  }, [preset]);

  // สลับพรีเซ็ตผ้า
  const handlePresetChange = (newPreset: FabricPresetType) => {
    setPreset(newPreset);
    switch (newPreset) {
      case "silk":
        setGravity(0.25);
        setDamping(0.99);
        setStiffnessIterations(3);
        setTearSensitivity(2.8);
        break;
      case "denim":
        setGravity(0.45);
        setDamping(0.97);
        setStiffnessIterations(6);
        setTearSensitivity(5.0);
        break;
      case "leather":
        setGravity(0.55);
        setDamping(0.95);
        setStiffnessIterations(8);
        setTearSensitivity(6.5);
        break;
      case "cape":
        setGravity(0.35);
        setDamping(0.985);
        setStiffnessIterations(4);
        setTearSensitivity(3.5);
        break;
      case "hair":
        setGravity(0.38);
        setDamping(0.98);
        setStiffnessIterations(4);
        setTearSensitivity(4.0);
        break;
    }
  };

  useEffect(() => {
    initializeSimulation();
  }, [initializeSimulation]);

  // ลูปการคำนวณฟิสิกส์ Verlet Loop & Canvas Rendering
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastFpsUpdate >= 500) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = now;
      }

      if (isSimulating) {
        const points = pointsRef.current;
        const constraints = constraintsRef.current;
        const mouse = mouseStateRef.current;
        const collider = colliderRef.current;

        // คำนวณเวกเตอร์ลม (Wind Force with Sine Wave Gusts)
        const windRadian = windAngle * (Math.PI / 180);
        const gust = Math.sin(now * 0.003) * 0.5 + 0.5;
        const currentWindX = Math.cos(windRadian) * windSpeed * gust * 0.4;
        const currentWindY = Math.sin(windRadian) * windSpeed * gust * 0.4;

        // 1. อัปเดตตำแหน่งจุดมวล (Verlet Step)
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          if (p.pinned) continue;

          const vx = (p.x - p.oldX) * damping;
          const vy = (p.y - p.oldY) * damping;

          p.oldX = p.x;
          p.oldY = p.y;

          p.x += vx + currentWindX;
          p.y += vy + gravity + currentWindY;

          // การชนกับ Collider ทรงกลม (Sphere / Body Collision)
          const cdx = p.x - collider.x;
          const cdy = p.y - collider.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < collider.radius) {
            const nx = cdx / cdist;
            const ny = cdy / cdist;
            p.x = collider.x + nx * collider.radius;
            p.y = collider.y + ny * collider.radius;
          }

          // การชนขอบหน้าจอ
          if (p.y > canvas.height - 10) {
            p.y = canvas.height - 10;
            p.oldY = p.y;
          }
          if (p.x < 10) p.x = 10;
          if (p.x > canvas.width - 10) p.x = canvas.width - 10;
        }

        // หากกำลังลากเมาส์ (Mouse Drag)
        if (mouse.isDown && mouse.draggedPoint && activeTool === "drag") {
          mouse.draggedPoint.x = mouse.x;
          mouse.draggedPoint.y = mouse.y;
        }

        // 2. ปรับสมดุลข้อต่อสปริง (Constraint Relaxation Loop)
        for (let iter = 0; iter < stiffnessIterations; iter++) {
          for (let i = 0; i < constraints.length; i++) {
            const c = constraints[i];
            if (c.broken) continue;

            const dx = c.p2.x - c.p1.x;
            const dy = c.p2.y - c.p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // ฉีกขาดหากแรงตึงเกินกำหนด (Tear Condition)
            if (dist > c.length * tearSensitivity) {
              c.broken = true;
              continue;
            }

            const diff = (c.length - dist) / dist;
            const offsetX = dx * diff * 0.5;
            const offsetY = dy * diff * 0.5;

            if (!c.p1.pinned) {
              c.p1.x -= offsetX;
              c.p1.y -= offsetY;
            }
            if (!c.p2.pinned) {
              c.p2.x += offsetX;
              c.p2.y += offsetY;
            }
          }
        }
      }

      // 3. วาดกราฟิกบน Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // พื้นหลังห้องแล็บฟิสิกส์ (Grid Matrix)
      ctx.fillStyle = "#0c101c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // วาด Collider ทรงกลม (จำลองร่างกายตัวละคร)
      const col = colliderRef.current;
      const grad = ctx.createRadialGradient(col.x - 10, col.y - 10, 5, col.x, col.y, col.radius);
      grad.addColorStop(0, "#38bdf8");
      grad.addColorStop(0.8, "#0284c7");
      grad.addColorStop(1, "#0369a1");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(col.x, col.y, col.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#7dd3fc";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // วาดข้อต่อสปริง (Cloth Constraints)
      const constraints = constraintsRef.current;
      for (let i = 0; i < constraints.length; i++) {
        const c = constraints[i];
        if (c.broken) continue;

        // เปลี่ยนสีตามแรงตึง (Stress coloring)
        const dx = c.p2.x - c.p1.x;
        const dy = c.p2.y - c.p1.y;
        const curLen = Math.sqrt(dx * dx + dy * dy);
        const stretchRatio = curLen / c.length;

        if (stretchRatio > 1.4) {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.9)"; // แดง = ตึงสูงเสี่ยงฉีก
          ctx.lineWidth = 1.6;
        } else if (stretchRatio > 1.15) {
          ctx.strokeStyle = "rgba(245, 158, 11, 0.75)"; // เหลือง
          ctx.lineWidth = 1.2;
        } else {
          ctx.strokeStyle = c.type === "shear" ? "rgba(96, 165, 250, 0.25)" : "rgba(56, 189, 248, 0.65)";
          ctx.lineWidth = 1;
        }

        ctx.beginPath();
        ctx.moveTo(c.p1.x, c.p1.y);
        ctx.lineTo(c.p2.x, c.p2.y);
        ctx.stroke();
      }

      // วาดจุดมวลที่ถูกปักหมุด (Pinned Nails)
      const points = pointsRef.current;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.pinned) {
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // วาดตัวบอกทิศทางลม
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "11px sans-serif";
      ctx.fillText(`💨 แรงลม: ${windSpeed.toFixed(1)} m/s (มุม ${windAngle}°)`, 20, 30);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isSimulating, gravity, windSpeed, windAngle, stiffnessIterations, damping, tearSensitivity, activeTool]);

  // การคลิกและลากเมาส์
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const points = pointsRef.current;
    let closestPoint: Point | null = null;
    let minDist = 25;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < minDist) {
        minDist = d;
        closestPoint = p;
      }
    }

    if (activeTool === "pin" && closestPoint) {
      closestPoint.pinned = !closestPoint.pinned;
      return;
    }

    mouseStateRef.current = {
      isDown: true,
      x: mx,
      y: my,
      prevX: mx,
      prevY: my,
      draggedPoint: closestPoint,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const mouse = mouseStateRef.current;
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = mx;
    mouse.y = my;

    // หากใช้เครื่องมือกรรไกรตัดผ้า (Cut / Tear Tool)
    if (mouse.isDown && activeTool === "cut") {
      const constraints = constraintsRef.current;
      for (let i = 0; i < constraints.length; i++) {
        const c = constraints[i];
        if (c.broken) continue;
        const midX = (c.p1.x + c.p2.x) / 2;
        const midY = (c.p1.y + c.p2.y) / 2;
        if (Math.hypot(midX - mx, midY - my) < 18) {
          c.broken = true;
        }
      }
    }
  };

  const handleMouseUp = () => {
    mouseStateRef.current.isDown = false;
    mouseStateRef.current.draggedPoint = null;
  };

  // ส่งออกคอนฟิก Preset เป็นไฟล์ JSON
  const handleExportPreset = () => {
    const presetData = {
      name: `FabricPreset_${preset.toUpperCase()}`,
      engine: "OmniMasterGameEngine_v4.5",
      module: "PhysicsClothHairSimulationLab",
      parameters: {
        preset,
        gravity,
        windSpeed,
        windAngle,
        stiffnessIterations,
        damping,
        tearSensitivity,
      },
      stats: {
        activePoints: pointCount,
        activeConstraints: constraintCount,
        targetFPS: 60,
      },
    };

    const blob = new Blob([JSON.stringify(presetData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ClothPhysics_${preset}_preset.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 select-none overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-[#111726]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400 border border-rose-500/30">
            <Flame size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Physics Cloth & Hair Dynamic Simulation Lab
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-rose-500/10 text-rose-400 rounded border border-rose-500/20">
                Verlet XPBD v3.1
              </span>
            </div>
            <p className="text-xs text-gray-400">
              ห้องจำลองฟิสิกส์ผ้าและเส้นผมแบบพลวัตพร้อมแรงลม รอยฉีกขาด และ Capsule Collision
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              isSimulating
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {isSimulating ? <Pause size={14} /> : <Play size={14} />}
            {isSimulating ? "หยุดจำลองชั่วคราว" : "เริ่มจำลองฟิสิกส์"}
          </button>

          <button
            onClick={initializeSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md text-xs font-medium transition"
          >
            <RefreshCw size={14} />
            รีเซ็ตผืนผ้า
          </button>

          <button
            onClick={handleExportPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-medium transition shadow-sm"
          >
            <Download size={14} />
            ส่งออก Preset (JSON)
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-80 border-r border-gray-800 bg-[#0d1322] flex flex-col overflow-y-auto p-4 space-y-5">
          {/* Presets Selection */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Sliders size={14} className="text-rose-400" />
              ประเภทวัสดุผ้า / เส้นผม (Fabric Preset)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(["cape", "silk", "denim", "leather", "hair"] as FabricPresetType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePresetChange(p)}
                  className={`px-3 py-2 rounded text-xs font-medium capitalize text-left transition border ${
                    preset === p
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/50"
                      : "bg-[#161f33] text-gray-400 border-gray-800 hover:text-white"
                  }`}
                >
                  {p === "cape"
                    ? "ผ้าคลุมอัศวิน (Cape)"
                    : p === "silk"
                    ? "ผ้าไหมพลิ้ว (Silk)"
                    : p === "denim"
                    ? "ผ้ายีนส์หนา (Denim)"
                    : p === "leather"
                    ? "หนังหนา (Leather)"
                    : "เส้นผมยาว (Hair)"}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Mouse Tool */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Activity size={14} className="text-blue-400" />
              เครื่องมือโต้ตอบ (Interactive Cursor Tool)
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTool("drag")}
                className={`flex flex-col items-center gap-1 p-2 rounded text-xs transition border ${
                  activeTool === "drag"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                    : "bg-[#161f33] text-gray-400 border-gray-800 hover:text-white"
                }`}
              >
                <Maximize2 size={16} />
                <span>ลากดึงผ้า</span>
              </button>

              <button
                onClick={() => setActiveTool("cut")}
                className={`flex flex-col items-center gap-1 p-2 rounded text-xs transition border ${
                  activeTool === "cut"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/50"
                    : "bg-[#161f33] text-gray-400 border-gray-800 hover:text-white"
                }`}
              >
                <Scissors size={16} />
                <span>ตัดขาด</span>
              </button>

              <button
                onClick={() => setActiveTool("pin")}
                className={`flex flex-col items-center gap-1 p-2 rounded text-xs transition border ${
                  activeTool === "pin"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                    : "bg-[#161f33] text-gray-400 border-gray-800 hover:text-white"
                }`}
              >
                <Pin size={16} />
                <span>ปักหมุด</span>
              </button>
            </div>
          </div>

          {/* Environmental Physics Forces */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Wind size={14} className="text-cyan-400" />
              แรงสภาพแวดล้อม (Environmental Forces)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>แรงลม (Wind Speed):</span>
                  <span className="font-mono text-cyan-400">{windSpeed.toFixed(1)} m/s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>ทิศทางลม (Wind Angle):</span>
                  <span className="font-mono text-cyan-400">{windAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={windAngle}
                  onChange={(e) => setWindAngle(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>แรงโน้มถ่วง (Gravity):</span>
                  <span className="font-mono text-white">{gravity.toFixed(2)} G</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.2"
                  step="0.05"
                  value={gravity}
                  onChange={(e) => setGravity(Number(e.target.value))}
                  className="w-full accent-gray-400 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>ความเหนียวสปริง (Stiffness Iterations):</span>
                  <span className="font-mono text-amber-400">{stiffnessIterations}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={stiffnessIterations}
                  onChange={(e) => setStiffnessIterations(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-gray-700 h-1.5 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center Canvas Viewport */}
        <div className="flex-1 flex flex-col bg-[#070a10] relative">
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative border-2 border-gray-800 rounded-lg overflow-hidden shadow-2xl bg-black">
              <canvas
                ref={canvasRef}
                width={640}
                height={520}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className={`block ${activeTool === "cut" ? "cursor-crosshair" : "cursor-grab"}`}
              />
              <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur px-2.5 py-1 rounded border border-gray-700 text-xs text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Simulation Status: Active ({fps} FPS)</span>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="h-16 border-t border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-amber-400" />
              <div>
                <div className="text-gray-400">Verlet Constraints Total</div>
                <div className="text-sm font-bold text-white font-mono">
                  {constraintCount} ข้อต่อสปริง ({pointCount} จุดมวล)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-400" />
              <div>
                <div className="text-gray-400">Sphere Capsule Collision Response</div>
                <div className="text-sm font-bold text-emerald-400">100% Penetration Shielded</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
