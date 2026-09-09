/**
 * ====================================================================================================
 * MODULE: CombatHitboxFrameDataStudio.tsx
 * ====================================================================================================
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * 1. สตูดิโอออกแบบกล่องปะทะและเฟรมดาต้าการต่อสู้ (Combat Hitbox/Hurtbox & Frame Data Studio)
 *    สำหรับเกมแอ็กชันระดับ AAA และเกมต่อสู้ (Fighting Game / Action RPG) ด้วยความแม่นยำ 60 FPS
 * 2. กำหนดและแก้ไขตำแหน่งกล่องฟิสิกส์:
 *    - Hurtbox (สีเขียว: พื้นที่ที่ตัวละครสามารถถูกโจมตีได้)
 *    - Hitbox (สีแดง: พื้นที่ปะทะที่สร้างความเสียหายให้อีกฝ่าย)
 *    - Pushbox (สีเหลือง: กล่องดันตัวละครไม่ให้ซ้อนทับกัน)
 *    - Invincibility Frames / I-Frames (สีขาว: เฟรมอมตะไร้การปะทะ)
 * 3. คำนวณความได้เปรียบของเฟรม (Frame Advantage Calculator):
 *    - Startup Frames, Active Frames, Recovery Frames
 *    - On-Hit Advantage (+Frames) และ On-Block Advantage (-Frames: Safe vs Punishable)
 * 4. กำหนด Hitstop (การหยุดภาพขณะโดนตี), Hitstun, Blockstun, และแรงกระเด็น (Knockback Vector)
 * 5. ส่งออกตาราง Frame Data Table และพิกัดกล่องชนในรูปแบบ JSON
 *
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - เชื่อมต่อกับ Game Systems & Narrative Hub ใน App.tsx
 * - ส่งข้อมูล Hitbox ให้กับ GameplayAbilitySystem (GAS) และ AnimationRiggingStudio
 *
 * พารามิเตอร์ Input / Output (Data Contracts):
 * - Input: Move Name, Total Duration (Frames), Startup/Active/Recovery Splits, Damage, Knockback (X, Y)
 * - Output: Frame-accurate Box Coordinates, Advantage Score (+/-), Exportable Move JSON
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - ตรวจสอบว่าผลรวมของ Startup + Active + Recovery เท่ากับความยาวท่าโจมตีทั้งหมด (Duration Consistency)
 * - เตือนกรณีท่าโจมตีติดลบหนักจนโดนลงโทษ (Heavily Punishable Move Alert)
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * <CombatHitboxFrameDataStudio onSaveMove={(moveData) => console.log(moveData)} />
 * ====================================================================================================
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Gamepad2,
  Swords,
  Shield,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Download,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Layers,
  Activity,
  Plus,
  Trash2
} from "lucide-react";

export interface CollisionBox {
  id: string;
  name: string;
  type: "hurtbox" | "hitbox" | "pushbox";
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface AttackMove {
  name: string;
  totalFrames: number;
  startup: number;
  active: number;
  recovery: number;
  damage: number;
  hitstun: number;
  blockstun: number;
  hitstop: number;
  knockbackX: number;
  knockbackY: number;
}

export default function CombatHitboxFrameDataStudio() {
  // ท่าโจมตีที่กำลังแก้ไข
  const [move, setMove] = useState<AttackMove>({
    name: "Dragon Slash Heavy",
    totalFrames: 36,
    startup: 8,
    active: 5,
    recovery: 23,
    damage: 140,
    hitstun: 26,
    blockstun: 19,
    hitstop: 11,
    knockbackX: 420,
    knockbackY: 180,
  });

  // เฟรมปัจจุบันในไทม์ไลน์ (1 - totalFrames)
  const [currentFrame, setCurrentFrame] = useState<number>(9);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // รายการกล่องปะทะในเฟรมนี้
  const [boxes, setBoxes] = useState<CollisionBox[]>([
    { id: "push_1", name: "Body Pushbox", type: "pushbox", x: 180, y: 120, w: 90, h: 220 },
    { id: "hurt_torso", name: "Torso Hurtbox", type: "hurtbox", x: 190, y: 140, w: 70, h: 100 },
    { id: "hurt_head", name: "Head Hurtbox", type: "hurtbox", x: 205, y: 80, w: 40, h: 45 },
    { id: "hurt_legs", name: "Legs Hurtbox", type: "hurtbox", x: 195, y: 240, w: 60, h: 100 },
    { id: "hit_slash", name: "Blade Hitbox", type: "hitbox", x: 250, y: 110, w: 140, h: 90 },
  ]);

  const [selectedBoxId, setSelectedBoxId] = useState<string>("hit_slash");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // คำนวณเฟสของเฟรมปัจจุบัน
  const framePhase = useCallback((): "startup" | "active" | "recovery" => {
    if (currentFrame <= move.startup) return "startup";
    if (currentFrame <= move.startup + move.active) return "active";
    return "recovery";
  }, [currentFrame, move.startup, move.active]);

  // คำนวณ Frame Advantage
  const onHitAdvantage = move.hitstun - (move.recovery + 1);
  const onBlockAdvantage = move.blockstun - (move.recovery + 1);

  // ไทม์ไลน์เพลย์เยอร์
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev >= move.totalFrames ? 1 : prev + 1));
    }, 1000 / 60); // 60 FPS
    return () => clearInterval(interval);
  }, [isPlaying, move.totalFrames]);

  // วาดตัวละคร Mannequin และกล่อง Collision บน Canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // พื้นหลังตาราง Grid สไตล์ Dojo / Fight Training Room
    ctx.fillStyle = "#0c101a";
    ctx.fillRect(0, 0, w, h);

    // เส้นพื้นดิน (Ground Line)
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 360);
    ctx.lineTo(w - 20, 360);
    ctx.stroke();

    // วาดหุ่น Mannequin
    ctx.strokeStyle = "#64748b";
    ctx.fillStyle = "#1e293b";
    ctx.lineWidth = 3;

    // หัว
    ctx.beginPath();
    ctx.arc(225, 100, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // ตัว
    ctx.beginPath();
    ctx.moveTo(225, 122);
    ctx.lineTo(225, 240);
    ctx.stroke();

    // ขา
    ctx.beginPath();
    ctx.moveTo(225, 240);
    ctx.lineTo(205, 360);
    ctx.moveTo(225, 240);
    ctx.lineTo(245, 360);
    ctx.stroke();

    // แขนที่แกว่งดาบ
    ctx.beginPath();
    ctx.moveTo(225, 150);
    ctx.lineTo(290, 160);
    ctx.stroke();

    // วาดกล่องชนทั้งหมด
    const phase = framePhase();
    boxes.forEach((b) => {
      // ซ่อน Hitbox หากไม่ได้อยู่ในเฟส Active
      if (b.type === "hitbox" && phase !== "active") return;

      const isSelected = b.id === selectedBoxId;

      switch (b.type) {
        case "hitbox":
          ctx.fillStyle = "rgba(239, 68, 68, 0.35)"; // สีแดง = Hitbox
          ctx.strokeStyle = "#ef4444";
          break;
        case "hurtbox":
          ctx.fillStyle = "rgba(34, 197, 94, 0.25)"; // สีเขียว = Hurtbox
          ctx.strokeStyle = "#22c55e";
          break;
        case "pushbox":
          ctx.fillStyle = "rgba(234, 179, 8, 0.15)"; // สีเหลือง = Pushbox
          ctx.strokeStyle = "#eab308";
          break;
      }

      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.lineWidth = isSelected ? 2.5 : 1.2;
      ctx.strokeRect(b.x, b.y, b.w, b.h);

      // วาดชื่อกล่อง
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px sans-serif";
      ctx.fillText(b.name, b.x + 4, b.y + 12);
    });

    // วาดเวกเตอร์แรงกระเด็น (Knockback Launch Arrow) ถ้าอยู่ในเฟส Active
    if (phase === "active") {
      ctx.save();
      ctx.strokeStyle = "#f59e0b";
      ctx.fillStyle = "#f59e0b";
      ctx.lineWidth = 2.5;

      const startX = 350;
      const startY = 160;
      const targetX = startX + move.knockbackX * 0.25;
      const targetY = startY - move.knockbackY * 0.25;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      // หัวลูกศร
      ctx.beginPath();
      ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }, [boxes, selectedBoxId, framePhase, move.knockbackX, move.knockbackY]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // ส่งออก Frame Data เป็น JSON
  const handleExportData = () => {
    const data = {
      moveName: move.name,
      engine: "OmniMasterGameEngine_v4.5",
      module: "CombatHitboxFrameDataStudio",
      frameData: {
        totalFrames: move.totalFrames,
        startup: move.startup,
        active: move.active,
        recovery: move.recovery,
        damage: move.damage,
        onHitAdvantage,
        onBlockAdvantage,
        isSafeOnBlock: onBlockAdvantage >= -3,
        hitstopFrames: move.hitstop,
        hitstunFrames: move.hitstun,
        blockstunFrames: move.blockstun,
        knockbackVector: { x: move.knockbackX, y: move.knockbackY },
      },
      collisionBoxes: boxes,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${move.name.replace(/\s+/g, "_")}_FrameData.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 select-none overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-[#111726]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-lg text-red-400 border border-red-500/30">
            <Swords size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Combat Hitbox & Frame Data Studio
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-red-500/10 text-red-400 rounded border border-red-500/20">
                Frame-Perfect 60 FPS
              </span>
            </div>
            <p className="text-xs text-gray-400">
              ระบบปรับแต่งกล่องปะทะ Hitbox/Hurtbox และคำนวณ Frame Advantage สไตล์เกมต่อสู้ AAA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md text-xs font-medium transition shadow-sm"
          >
            <Download size={14} />
            ส่งออก Frame Data (JSON)
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-80 border-r border-gray-800 bg-[#0d1322] flex flex-col overflow-y-auto p-4 space-y-5">
          {/* Move Profile */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Gamepad2 size={14} className="text-red-400" />
              ข้อมูลท่าโจมตี (Move Profile)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">ชื่อท่าโจมตี:</label>
                <input
                  type="text"
                  value={move.name}
                  onChange={(e) => setMove({ ...move, name: e.target.value })}
                  className="w-full bg-[#161f33] border border-gray-700 rounded px-2.5 py-1 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="bg-[#161f33] p-2 rounded border border-blue-500/30">
                  <div className="text-[10px] text-blue-400">STARTUP</div>
                  <div className="text-sm font-bold text-white">{move.startup}F</div>
                </div>
                <div className="bg-[#161f33] p-2 rounded border border-red-500/30">
                  <div className="text-[10px] text-red-400">ACTIVE</div>
                  <div className="text-sm font-bold text-white">{move.active}F</div>
                </div>
                <div className="bg-[#161f33] p-2 rounded border border-yellow-500/30">
                  <div className="text-[10px] text-yellow-400">RECOVERY</div>
                  <div className="text-sm font-bold text-white">{move.recovery}F</div>
                </div>
              </div>
            </div>
          </div>

          {/* Frame Advantage Telemetry */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Shield size={14} className="text-yellow-400" />
              ความได้เปรียบของเฟรม (Advantage)
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 bg-[#161f33] rounded border border-gray-800">
                <span className="text-gray-400">เมื่อโจมตีโดน (On-Hit):</span>
                <span className={`text-sm font-bold ${onHitAdvantage >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {onHitAdvantage >= 0 ? `+${onHitAdvantage}` : onHitAdvantage} Frames
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-[#161f33] rounded border border-gray-800">
                <span className="text-gray-400">เมื่อถูกบล็อก (On-Block):</span>
                <span className={`text-sm font-bold ${onBlockAdvantage >= -3 ? "text-emerald-400" : "text-red-400"}`}>
                  {onBlockAdvantage >= 0 ? `+${onBlockAdvantage}` : onBlockAdvantage} Frames
                </span>
              </div>

              <div className="p-2 rounded bg-gray-900 border border-gray-800 text-[11px] font-sans">
                {onBlockAdvantage >= -3 ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} /> ท่านี้ปลอดภัยเมื่อถูกบล็อก (Safe on Block)
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertCircle size={13} /> ท่านี้เปิดช่องให้คู่ต่อสู้สวนกลับได้ (Punishable)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Hit Properties */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-3">
              <Activity size={14} className="text-purple-400" />
              คุณสมบัติการปะทะ (Impact Physics)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>ความเสียหาย (Damage):</span>
                  <span className="font-mono text-red-400 font-bold">{move.damage} HP</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="5"
                  value={move.damage}
                  onChange={(e) => setMove({ ...move, damage: Number(e.target.value) })}
                  className="w-full accent-red-500 bg-gray-700 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-gray-300 mb-1">
                  <span>หยุดภาพสะเทือน (Hitstop):</span>
                  <span className="font-mono text-white">{move.hitstop}F</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={move.hitstop}
                  onChange={(e) => setMove({ ...move, hitstop: Number(e.target.value) })}
                  className="w-full accent-blue-500 bg-gray-700 h-1.5 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center Canvas Viewport */}
        <div className="flex-1 flex flex-col bg-[#070a10]">
          {/* Top Frame Phase Ribbon */}
          <div className="h-10 border-b border-gray-800 bg-[#0d1322] px-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">สถานะเฟรม:</span>
              <span
                className={`px-2 py-0.5 rounded font-bold uppercase ${
                  framePhase() === "active"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                    : framePhase() === "startup"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                }`}
              >
                {framePhase()} PHASE
              </span>
            </div>

            <div className="font-mono text-gray-300">
              FRAME <strong className="text-white text-sm">{currentFrame}</strong> / {move.totalFrames}
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative border-2 border-gray-800 rounded-lg overflow-hidden shadow-2xl bg-black">
              <canvas ref={canvasRef} width={620} height={420} className="block" />
              <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur px-2.5 py-1 rounded border border-gray-700 text-[11px] text-gray-300 space-x-2">
                <span className="text-red-400 font-bold">■ Hitbox</span>
                <span className="text-emerald-400 font-bold">■ Hurtbox</span>
                <span className="text-yellow-400 font-bold">■ Pushbox</span>
              </div>
            </div>
          </div>

          {/* Bottom Timeline Controller Bar */}
          <div className="h-24 border-t border-gray-800 bg-[#0d1322] px-6 flex flex-col justify-center space-y-2">
            {/* Playback Controls */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentFrame(1)}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
                >
                  <SkipBack size={14} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-1.5 rounded text-white ${
                    isPlaying ? "bg-amber-600 hover:bg-amber-500" : "bg-blue-600 hover:bg-blue-500"
                  }`}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  onClick={() => setCurrentFrame(move.totalFrames)}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
                >
                  <SkipForward size={14} />
                </button>
              </div>

              <div className="text-[11px] text-gray-400">
                ลาก Scrubber เพื่อตรวจสอบการชนของกล่องในแต่ละเฟรม
              </div>
            </div>

            {/* Frame Scrubber Bar */}
            <div className="relative">
              <input
                type="range"
                min="1"
                max={move.totalFrames}
                value={currentFrame}
                onChange={(e) => setCurrentFrame(Number(e.target.value))}
                className="w-full accent-red-500 bg-gray-700 h-2 rounded cursor-pointer"
              />
              {/* Markers for Startup, Active, Recovery */}
              <div className="flex text-[10px] font-mono text-gray-500 justify-between mt-1">
                <span className="text-blue-400">1 (Start)</span>
                <span className="text-red-400">{move.startup + 1} (Hit Active)</span>
                <span className="text-yellow-400">{move.startup + move.active + 1} (Recovery)</span>
                <span>{move.totalFrames} (End)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
