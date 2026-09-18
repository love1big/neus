/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: AAA Motion Matching & Pose Search Database Studio (Unreal Engine 5.4
 *          Motion Matching & Unity Next-Gen Locomotion parity). Provides a high-fidelity
 *          visual suite for authoring pose search schemas, tuning trajectory cost
 *          weights, continuing-pose bias, and inspecting live kinematic feature vectors
 *          (feet contact phases, root velocity, future trajectory projection).
 *    - TH: สตูดิโอ Motion Matching และ Pose Search Database ระดับ AAA (เทียบเท่า Unreal 5.4)
 *          มอบเครื่องมือตรวจวิเคราะห์ระบบ Locomotion ขั้นสูง ปรับจูนน้ำหนัก Trajectory Cost,
 *          Continuing Pose Bias เพื่อป้องกันการสลับแอนิเมชันกระตุก,
 *          พร้อมหน้าจอแสดงวิถีการเคลื่อนที่ (Trajectory Canvas) และจอยควบคุมทดสอบแบบเรียลไทม์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Connects to `MotionMatchingDatabaseNode.ts` and `motionMatchingTypes.ts`
 *    - Feeds pose data to character skeletal controllers and animation blend nodes
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Safely clamps trajectory search parameters.
 *    - Live canvas gracefully scales across container resizes.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```tsx
 *    <MotionMatchingPoseSearchStudio onSelectTool={handleSelect} />
 *    ```
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Search,
  Compass,
  Zap,
  Footprints,
  Clock,
  BarChart3,
  Flame,
  CheckCircle2,
  FileCode2,
  Cpu
} from 'lucide-react';
import { motionMatchingDB } from '../utils/MotionMatchingDatabaseNode';
import {
  PoseSearchDatabase,
  PoseSearchQueryResult,
  PoseSearchCostWeights
} from '../types/motionMatchingTypes';

interface MotionMatchingStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function MotionMatchingPoseSearchStudio({ onSelectTool }: MotionMatchingStudioProps) {
  const [db, setDb] = useState<PoseSearchDatabase>(() => motionMatchingDB.getDatabase());
  const [weights, setWeights] = useState<PoseSearchCostWeights>(() => db.costWeights);

  // Intent stick coordinates [-1 to +1]
  const [stickX, setStickX] = useState<number>(0);
  const [stickY, setStickY] = useState<number>(-0.8); // Default forward jog intent
  const [isDraggingStick, setIsDraggingStick] = useState<boolean>(false);

  // Search results
  const [searchResult, setSearchResult] = useState<PoseSearchQueryResult>(() => {
    const query = motionMatchingDB.generateTrajectoryQuery(0, -0.8);
    return motionMatchingDB.searchBestPose(query);
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subscribe to DB updates
  useEffect(() => {
    return motionMatchingDB.subscribe(() => {
      setDb(motionMatchingDB.getDatabase());
      setWeights(motionMatchingDB.getDatabase().costWeights);
    });
  }, []);

  // Update query when stick moves
  useEffect(() => {
    const query = motionMatchingDB.generateTrajectoryQuery(stickX, stickY);
    const res = motionMatchingDB.searchBestPose(query);
    setSearchResult(res);
  }, [stickX, stickY, weights]);

  // Handle Weight changes
  const handleWeightChange = (key: keyof PoseSearchCostWeights, val: number) => {
    const next = { ...weights, [key]: val };
    setWeights(next);
    motionMatchingDB.updateCostWeights({ [key]: val });
  };

  // Draw 2D Kinematic Trajectory Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height * 0.55;
    const scale = 55; // Pixels per meter

    // 1. Draw Grid Lines
    ctx.strokeStyle = '#1a2336';
    ctx.lineWidth = 1;
    for (let r = 1; r <= 5; r++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r * scale, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Crosshair
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // 2. Draw Sample Trajectory (Yellow/Amber Points)
    if (searchResult && searchResult.bestPose) {
      const traj = searchResult.bestPose.trajectory;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      traj.forEach((pt, idx) => {
        const px = centerX + pt.position.x * scale;
        const py = centerY - pt.position.z * scale;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Trajectory Points
      traj.forEach(pt => {
        const px = centerX + pt.position.x * scale;
        const py = centerY - pt.position.z * scale;
        ctx.fillStyle = pt.timeOffsetSec < 0 ? '#94a3b8' : pt.timeOffsetSec === 0 ? '#38bdf8' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // 3. Draw Character Root & Feet Positions
    const bestPose = searchResult?.bestPose;
    if (bestPose) {
      // Left Foot (Cyan if Grounded, faded if flight)
      const lpx = centerX + (bestPose.leftFoot.position.x) * scale;
      const lpz = centerY - (bestPose.leftFoot.position.z) * scale;
      ctx.fillStyle = bestPose.leftFoot.phase === 'GROUNDED' ? '#10b981' : '#065f46';
      ctx.beginPath();
      ctx.arc(lpx, lpz, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '9px monospace';
      ctx.fillText('L', lpx - 2.5, lpz + 3);

      // Right Foot (Green if Grounded, faded if flight)
      const rpx = centerX + (bestPose.rightFoot.position.x) * scale;
      const rpz = centerY - (bestPose.rightFoot.position.z) * scale;
      ctx.fillStyle = bestPose.rightFoot.phase === 'GROUNDED' ? '#10b981' : '#065f46';
      ctx.beginPath();
      ctx.arc(rpx, rpz, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText('R', rpx - 2.5, rpz + 3);

      // Character Root Center (Indigo / White)
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

  }, [searchResult]);

  return (
    <div className="flex flex-col h-full bg-[#090d14] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0d1320] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-lg">
            <Activity size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Motion Matching & Pose Search Database Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-400 text-[10px] font-bold border border-purple-500/40 font-mono">
                UE5.4 & AAA Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Next-gen data-driven locomotion: high-dimensional trajectory matching, inertialization, and pose cost weighting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#94a3b8]">
          <span className="px-2.5 py-1 rounded bg-[#161f30] border border-[#23314d] flex items-center gap-1.5 text-emerald-400">
            <Cpu size={12} /> Search: <strong>{searchResult.searchTimeMs}ms</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-[#161f30] border border-[#23314d]">
            Evaluated: <strong>{searchResult.candidatesEvaluated}</strong> poses
          </span>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* COLUMN 1: Database Clips & Pose Samples Inspector (3 cols) */}
        <div className="lg:col-span-3 border-r border-[#1c2438] bg-[#0c111c] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-purple-400" /> Pose Database ({db.totalPoses})
            </span>
            <span className="text-[10px] font-mono text-purple-400">30 FPS Samples</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {db.samples.slice(0, 35).map(sample => {
              const isSelected = sample.id === searchResult.bestPose?.id;
              return (
                <div
                  key={sample.id}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isSelected 
                      ? 'bg-purple-950/40 border-purple-500/70 shadow-md shadow-purple-950/30 ring-1 ring-purple-500/50' 
                      : 'bg-[#121826] border-[#1f293d]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{sample.clipName}</span>
                    <span className="text-[10px] text-purple-300">F#{sample.frameIndex}</span>
                  </div>

                  <div className="flex items-center justify-between mt-1.5 text-[10px] text-[#64748b]">
                    <span>Spd: {sample.rootVelocity.z.toFixed(1)} m/s</span>
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${sample.leftFoot.phase === 'GROUNDED' ? 'bg-emerald-400' : 'bg-zinc-600'}`}></span>
                      <span className={`w-2 h-2 rounded-full ${sample.rightFoot.phase === 'GROUNDED' ? 'bg-emerald-400' : 'bg-zinc-600'}`}></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: Kinematic Trajectory Canvas & Pose Radar (5 cols) */}
        <div className="lg:col-span-5 border-r border-[#1c2438] bg-[#090d14] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Compass size={13} className="text-blue-400" /> Trajectory & Bone Phase Canvas
            </span>
            <span className="text-[10px] font-mono text-[#94a3b8]">
              Yellow: Future Path • Green: Foot Contact
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 bg-[#070a12] relative overflow-hidden">
            <canvas
              ref={canvasRef}
              width={480}
              height={380}
              className="rounded-xl border border-[#1e293d] shadow-2xl bg-[#0a0f1d]"
            />

            {/* Overlay Telemetry Badge */}
            <div className="absolute top-6 left-6 p-2.5 rounded-lg bg-black/60 backdrop-blur-md border border-[#23314d] text-[11px] font-mono space-y-1">
              <div className="text-white font-bold flex items-center gap-1">
                <Sparkles size={11} className="text-amber-400" /> {searchResult.bestPose.clipName}
              </div>
              <div className="text-[#94a3b8]">Total Cost: <strong className="text-emerald-400">{searchResult.calculatedCost.toFixed(2)}</strong></div>
              <div className="text-[#94a3b8]">Trajectory Cost: <strong>{searchResult.trajectoryCost.toFixed(2)}</strong></div>
            </div>
          </div>

          {/* Current Frame Foot Phase & Pelvis Bar */}
          <div className="p-3 border-t border-[#1c2438] bg-[#0d1322] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-[#64748b] font-bold">FEET CONTACT:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                searchResult.bestPose.leftFoot.phase === 'GROUNDED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-500'
              }`}>
                L-FOOT: {searchResult.bestPose.leftFoot.phase}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                searchResult.bestPose.rightFoot.phase === 'GROUNDED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-500'
              }`}>
                R-FOOT: {searchResult.bestPose.rightFoot.phase}
              </span>
            </div>

            <div className="text-[#94a3b8]">
              Pelvis Height: <strong className="text-white">{searchResult.bestPose.pelvisHeight.toFixed(2)}m</strong>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Cost Function Weights & Live Intent Joystick (4 cols) */}
        <div className="lg:col-span-4 bg-[#0c111c] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={13} className="text-purple-400" /> Pose Search Weights
            </span>
            <span className="text-[10px] font-mono text-[#64748b]">Real-Time Tuner</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Interactive Intent Stick */}
            <div className="p-4 rounded-xl bg-[#0f1626] border border-[#1e293d] flex flex-col items-center">
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">
                Player Movement Intent (Drag Stick)
              </span>

              {/* Joystick Base */}
              <div 
                className="relative w-36 h-36 rounded-full border-2 border-[#243452] bg-[#070a12] flex items-center justify-center cursor-crosshair shadow-inner"
                onMouseDown={() => setIsDraggingStick(true)}
                onMouseUp={() => setIsDraggingStick(false)}
                onMouseLeave={() => setIsDraggingStick(false)}
                onMouseMove={(e) => {
                  if (!isDraggingStick) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                  const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
                  setStickX(Math.max(-1, Math.min(1, x)));
                  setStickY(Math.max(-1, Math.min(1, y)));
                }}
              >
                {/* Stick Cross */}
                <div className="absolute w-full h-[1px] bg-[#1a2336]"></div>
                <div className="absolute h-full w-[1px] bg-[#1a2336]"></div>

                {/* Stick Thumb */}
                <div 
                  className="w-7 h-7 rounded-full bg-purple-600 border-2 border-white shadow-lg shadow-purple-600/50 absolute transition-transform duration-75"
                  style={{
                    transform: `translate(${stickX * 50}px, ${stickY * 50}px)`
                  }}
                ></div>
              </div>

              {/* Quick Direction Presets */}
              <div className="grid grid-cols-4 gap-1.5 w-full mt-3 text-[10px] font-mono font-bold">
                <button
                  onClick={() => { setStickX(0); setStickY(-0.8); }}
                  className="py-1 rounded bg-[#162035] hover:bg-purple-600 text-white transition-colors"
                >
                  Jog Fwd
                </button>
                <button
                  onClick={() => { setStickX(0); setStickY(-1.0); }}
                  className="py-1 rounded bg-[#162035] hover:bg-purple-600 text-white transition-colors"
                >
                  Sprint
                </button>
                <button
                  onClick={() => { setStickX(0.9); setStickY(-0.4); }}
                  className="py-1 rounded bg-[#162035] hover:bg-purple-600 text-white transition-colors"
                >
                  Cut Right
                </button>
                <button
                  onClick={() => { setStickX(0); setStickY(0); }}
                  className="py-1 rounded bg-[#162035] hover:bg-purple-600 text-white transition-colors"
                >
                  Stop
                </button>
              </div>
            </div>

            {/* Weights Sliders */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Trajectory Weight</span>
                  <span className="font-mono text-purple-400">{weights.trajectoryWeight.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={weights.trajectoryWeight}
                  onChange={(e) => handleWeightChange('trajectoryWeight', parseFloat(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-[#1a2336] rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Facing Angle Weight</span>
                  <span className="font-mono text-purple-400">{weights.facingAngleWeight.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={weights.facingAngleWeight}
                  onChange={(e) => handleWeightChange('facingAngleWeight', parseFloat(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-[#1a2336] rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Continuing Pose Bias (Hysteresis)</span>
                  <span className="font-mono text-emerald-400">{weights.continuingPoseBias.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-1.0"
                  max="0.0"
                  step="0.05"
                  value={weights.continuingPoseBias}
                  onChange={(e) => handleWeightChange('continuingPoseBias', parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-[#1a2336] rounded-lg"
                />
              </div>
            </div>

            {/* Inertialization Profile */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-2 text-xs">
              <span className="font-bold text-white block uppercase tracking-wider text-[10px]">
                Inertialization Blending
              </span>
              <div className="flex justify-between text-[#94a3b8]">
                <span>Blend Duration:</span>
                <strong className="text-white font-mono">{db.inertialization.blendDurationSec}s</strong>
              </div>
              <div className="flex justify-between text-[#94a3b8]">
                <span>Decay Half-Life:</span>
                <strong className="text-white font-mono">{db.inertialization.halfLifeSec}s</strong>
              </div>
              <div className="flex justify-between text-[#94a3b8]">
                <span>Profile:</span>
                <strong className="text-purple-400 font-mono">{db.inertialization.smoothingProfile}</strong>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
