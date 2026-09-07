/**
 * ============================================================================
 * @file AdvancedLocomotionMotionStudio.tsx
 * @module Components/Locomotion
 * @description
 * [TH] สตูดิโอควบคุมระบบการเคลื่อนไหว สรีระจลนศาสตร์ และ State Machine ขั้นสูงระดับ AAA
 * (Advanced Locomotion, Kinematics & Animation State Studio)
 * ครอบคลุม:
 * 1. Two-Bone IK & FABRIK Visual Joint Solver (การดึงแขน/ขาหาเป้าหมาย Target)
 * 2. 2D Blend Space Vector Joystick (Direction [-180..180], Speed [0..650 cm/s])
 * 3. Foot-Ground Terrain Raycast Alignment (การปรับระดับข้อเท้าและเข่าตามความชัน)
 * 4. Hierarchical Locomotion State Machine Transition Graph
 * 5. Active Ragdoll Blend Matrix & Inertialization Crossfade
 *
 * [EN] AAA Character Locomotion & Kinematics Studio with real-time IK solvers,
 * 2D Blend Space velocity mapping, terrain foot alignment & ragdoll blending.
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Footprints,
  Compass,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
  Layers,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import {
  AdvancedLocomotionKinematicsEngine,
  LocomotionTelemetry,
  LocomotionState,
  Vector3D
} from '../utils/AdvancedLocomotionKinematicsEngine';

export default function AdvancedLocomotionMotionStudio() {
  const [engine] = useState(() => new AdvancedLocomotionKinematicsEngine());
  const [telemetry, setTelemetry] = useState<LocomotionTelemetry | null>(null);

  // Input states
  const [inputX, setInputX] = useState<number>(0);
  const [inputY, setInputY] = useState<number>(0);
  const [isSprint, setIsSprint] = useState<boolean>(false);
  const [isCrouch, setIsCrouch] = useState<boolean>(false);
  const [ragdollWeight, setRagdollWeight] = useState<number>(0);

  // Foot Ground Offset simulation (Slope test)
  const [terrainSlope, setTerrainSlope] = useState<number>(0);

  // IK Demo Target Position
  const [ikTargetPos, setIkTargetPos] = useState<Vector3D>({ x: 0.35, y: -0.45, z: 0.1 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation Loop Tick
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update foot ground slope
      const leftFootGround = Math.sin(currentTime * 0.003) * terrainSlope * 0.15;
      const rightFootGround = -Math.sin(currentTime * 0.003) * terrainSlope * 0.15;
      engine.updateFootPlacementRaycast(leftFootGround, rightFootGround);
      engine.setRagdollWeight(ragdollWeight);

      const tel = engine.tick(dt, { x: inputX, y: inputY }, isSprint, isCrouch, false);
      setTelemetry(tel);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [inputX, inputY, isSprint, isCrouch, ragdollWeight, terrainSlope, engine]);

  // Render Skeleton & IK on Canvas
  useEffect(() => {
    if (!canvasRef.current || !telemetry) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = 480;
    const height = canvas.height = 420;

    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, width, height);

    // Center Coordinate Origin
    const cx = width * 0.5;
    const cy = height * 0.65 - telemetry.pelvisOffset * 50;

    // Draw Ground Slope Line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy + 90 - terrainSlope * 20);
    ctx.lineTo(width, cy + 90 + terrainSlope * 20);
    ctx.stroke();

    // 1. Solve Two-Bone IK for Leg
    const hipPos: Vector3D = { x: 0, y: 0, z: 0 };
    const defaultKnee: Vector3D = { x: 0, y: -0.4, z: 0.1 };
    const defaultFoot: Vector3D = { x: 0, y: -0.8, z: 0 };

    const ikResult = AdvancedLocomotionKinematicsEngine.solveTwoBoneIK(
      hipPos,
      defaultKnee,
      defaultFoot,
      ikTargetPos,
      { x: 0, y: 0, z: 1 }
    );

    // Draw Skeleton Joint Hierarchy
    const scale = 120;

    // Draw Pelvis
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw Spine & Head
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - 75);
    ctx.stroke();

    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.arc(cx, cy - 90, 14, 0, Math.PI * 2);
    ctx.fill();

    // Draw IK Leg Bones (Hip -> Knee -> Foot)
    const kx = cx + ikResult.newMidPos.x * scale;
    const ky = cy - ikResult.newMidPos.y * scale;

    const fx = cx + ikResult.newEndPos.x * scale;
    const fy = cy - ikResult.newEndPos.y * scale;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(kx, ky);
    ctx.lineTo(fx, fy);
    ctx.stroke();

    // Draw Joints
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(kx, ky, 6, 0, Math.PI * 2);
    ctx.arc(fx, fy, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw Target Effector Box
    const tx = cx + ikTargetPos.x * scale;
    const ty = cy - ikTargetPos.y * scale;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(tx - 6, ty - 6, 12, 12);

  }, [telemetry, ikTargetPos, terrainSlope]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 overflow-hidden font-sans select-none">
      {/* Header */}
      <div className="h-14 bg-[#111827] border-b border-gray-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide text-base">Advanced Locomotion & Motion Studio</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                Kinematics & State Machine
              </span>
            </div>
            <p className="text-xs text-gray-400">Two-Bone IK • 2D Blend Spaces • Foot Placement • Active Ragdoll</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setInputX(0); setInputY(0); setIsSprint(false); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-medium border border-gray-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Inputs
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: 2D Blend Space Vector Joystick & Locomotion Controls */}
        <div className="w-80 bg-[#0f172a] border-r border-gray-800 flex flex-col p-4 gap-4 overflow-y-auto shrink-0">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              2D Blend Space Directional Joystick
            </span>
            <div className="flex items-center justify-center p-3 bg-gray-900/80 rounded-xl border border-gray-800">
              <div
                className="w-40 h-40 bg-gray-950 border border-gray-700 rounded-full relative cursor-crosshair flex items-center justify-center"
                onMouseDown={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                  const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
                  setInputX(Math.max(-1, Math.min(1, x)));
                  setInputY(Math.max(-1, Math.min(1, y)));
                }}
              >
                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-gray-800" />
                <div className="absolute h-full w-[1px] bg-gray-800" />
                {/* Thumb */}
                <div
                  className="w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50 absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all"
                  style={{
                    left: `${(inputX + 1) * 50}%`,
                    top: `${(-inputY + 1) * 50}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stances & Modifiers */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-gray-400 uppercase tracking-wider block">Stances & Modifiers</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsSprint(!isSprint)}
                className={`py-2 rounded-lg font-semibold transition ${
                  isSprint ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-300'
                }`}
              >
                {isSprint ? 'Sprint Mode ON' : 'Sprint (Shift)'}
              </button>
              <button
                onClick={() => setIsCrouch(!isCrouch)}
                className={`py-2 rounded-lg font-semibold transition ${
                  isCrouch ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-300'
                }`}
              >
                {isCrouch ? 'Crouched' : 'Stand / Crouch'}
              </button>
            </div>
          </div>

          {/* Terrain Slope & Foot IK */}
          <div className="space-y-3 text-xs pt-2 border-t border-gray-800">
            <span className="font-bold text-gray-400 uppercase tracking-wider block">Terrain Slope & IK Alignment</span>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">Slope Pitch Angle</span>
                <span className="text-cyan-400 font-mono">{terrainSlope}°</span>
              </div>
              <input
                type="range" min="-30" max="30" value={terrainSlope}
                onChange={e => setTerrainSlope(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">Active Ragdoll Blend</span>
                <span className="text-red-400 font-mono">{(ragdollWeight * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05" value={ragdollWeight}
                onChange={e => setRagdollWeight(parseFloat(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>
          </div>

          {/* Real-time State Telemetry */}
          {telemetry && (
            <div className="mt-auto p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-[11px] space-y-1.5">
              <div className="font-semibold text-gray-300 flex items-center justify-between">
                <span>Current State:</span>
                <span className="text-cyan-400 font-mono">{telemetry.currentState}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Speed / Velocity:</span>
                <span className="text-gray-200">{telemetry.speed.toFixed(1)} cm/s</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Direction Yaw:</span>
                <span className="text-gray-200">{telemetry.direction.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Transition Progress:</span>
                <span className="text-amber-300 font-mono">{(telemetry.transitionProgress * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Center Canvas: Inverse Kinematics Rig Solver */}
        <div className="flex-1 flex flex-col bg-[#050811] relative overflow-hidden">
          <div className="h-10 bg-[#0d1322] border-b border-gray-800 px-4 flex items-center justify-between z-10">
            <span className="text-xs font-semibold text-gray-300">Two-Bone Analytical IK & Limb Skeleton Solver</span>
            <span className="text-xs font-mono text-cyan-400">Target Pos: [{ikTargetPos.x.toFixed(2)}, {ikTargetPos.y.toFixed(2)}]</span>
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <canvas
                ref={canvasRef}
                onMouseMove={e => {
                  if (e.buttons === 1) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
                    setIkTargetPos({ x: x * 0.8, y: y * 0.8, z: 0.1 });
                  }
                }}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
