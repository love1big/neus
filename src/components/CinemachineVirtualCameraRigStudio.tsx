/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: AAA Cinemachine Virtual Camera & Cine Camera Studio (Unity Cinemachine
 *          & Unreal Cine Camera Rig parity). Provides a comprehensive virtual
 *          production suite featuring a live 3D viewport framing canvas with
 *          Dead Zone & Soft Zone overlays, optical physical lens controls (aperture,
 *          sensor crop, focal length), and a 6-DOF impulse trauma shake generator.
 *    - TH: สตูดิโอระบบกล้อง Cinemachine Virtual Camera และ Cine Camera ระดับ AAA
 *          (เทียบเท่า Unity Cinemachine และ Unreal Cine Camera Rig)
 *          จำลองการมองเห็นของกล้องผ่าน Viewport 3D, แสดงกรอบจับภาพ Dead Zone และ Soft Zone,
 *          ปรับตั้งค่าเลนส์เสมือนจริง (ขนาดเซนเซอร์กล้องภาพยนตร์, ค่ารูรับแสง f-stop, ทางยาวโฟกัส)
 *          พร้อมห้องทดสอบแรงสั่นสะเทือนกล้อง 6-DOF Impulse และกราฟแผ่นดินไหว Seismograph
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Backed by `CinemachineRigBrainNode.ts` and `cinemachineTypes.ts`
 *    - Controls primary cinematic game camera and cutscene rigs
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Smooth decay prevents NaN trauma spikes.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```tsx
 *    <CinemachineVirtualCameraRigStudio onSelectTool={handleSelect} />
 *    ```
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Video,
  Layers,
  Sliders,
  Sparkles,
  Zap,
  Crosshair,
  Maximize2,
  Activity,
  Flame,
  Volume2,
  Settings2,
  Film,
  Target,
  RefreshCw,
  Eye
} from 'lucide-react';
import { cinemachineBrain } from '../utils/CinemachineRigBrainNode';
import { VirtualCamera, SensorFormatPreset } from '../types/cinemachineTypes';

interface CinemachineStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function CinemachineVirtualCameraRigStudio({ onSelectTool }: CinemachineStudioProps) {
  const [cameras, setCameras] = useState<VirtualCamera[]>(() => cinemachineBrain.getCameras());
  const [activeCamera, setActiveCamera] = useState<VirtualCamera>(() => cinemachineBrain.getActiveCamera());
  const [selectedCamId, setSelectedCamId] = useState<string>(() => cinemachineBrain.getActiveCamera().id);

  // Live shake telemetry
  const [shakeOffsets, setShakeOffsets] = useState(() => cinemachineBrain.getActiveShakeOffsets());
  const [trauma, setTrauma] = useState<number>(() => cinemachineBrain.getImpulseTrauma());

  const viewportCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return cinemachineBrain.subscribe(() => {
      setCameras(cinemachineBrain.getCameras());
      setActiveCamera(cinemachineBrain.getActiveCamera());
      setShakeOffsets(cinemachineBrain.getActiveShakeOffsets());
      setTrauma(cinemachineBrain.getImpulseTrauma());
    });
  }, []);

  const selectedCam = cameras.find(c => c.id === selectedCamId) || activeCamera;

  const handleMakeActive = (camId: string) => {
    cinemachineBrain.setCameraPriority(camId, 20);
    // Lower other cameras
    cameras.forEach(c => {
      if (c.id !== camId) {
        cinemachineBrain.setCameraPriority(c.id, 0);
      }
    });
    setSelectedCamId(camId);
  };

  const handleUpdateCam = (updates: Partial<VirtualCamera>) => {
    cinemachineBrain.updateCamera(selectedCam.id, updates);
  };

  const handleTriggerShake = (amount: number) => {
    cinemachineBrain.triggerImpulse(amount);
  };

  // Render 3D Framing & Dead Zone Canvas
  useEffect(() => {
    const canvas = viewportCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Apply shake translation & rotation
    ctx.save();
    ctx.translate(shakeOffsets.x * 40, shakeOffsets.y * 40);
    ctx.rotate((shakeOffsets.roll * Math.PI) / 180);

    // Background Cyberpunk Cinematic Viewport
    const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w / 1.5);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Rule of Thirds Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 3, 0);
    ctx.lineTo(w / 3, h);
    ctx.moveTo((w * 2) / 3, 0);
    ctx.lineTo((w * 2) / 3, h);
    ctx.moveTo(0, h / 3);
    ctx.lineTo(w, h / 3);
    ctx.moveTo(0, (h * 2) / 3);
    ctx.lineTo(w, (h * 2) / 3);
    ctx.stroke();

    // Simulated Character Silhouette
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.45, 24, 0, Math.PI * 2); // Head
    ctx.fill();
    ctx.fillRect(w / 2 - 28, h * 0.45 + 28, 56, 75); // Torso

    // Dead Zone Box (Yellow border)
    const deadW = w * selectedCam.framing.deadZoneWidth;
    const deadH = h * selectedCam.framing.deadZoneHeight;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect((w - deadW) / 2, (h - deadH) / 2, deadW, deadH);

    // Soft Zone Box (Cyan border dashed)
    const softW = w * selectedCam.framing.softZoneWidth;
    const softH = h * selectedCam.framing.softZoneHeight;
    ctx.strokeStyle = '#06b6d4';
    ctx.setLineDash([6, 6]);
    ctx.strokeRect((w - softW) / 2, (h - softH) / 2, softW, softH);
    ctx.setLineDash([]);

    // Crosshairs
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 12, h / 2);
    ctx.lineTo(w / 2 + 12, h / 2);
    ctx.moveTo(w / 2, h / 2 - 12);
    ctx.lineTo(w / 2, h / 2 + 12);
    ctx.stroke();

    ctx.restore();
  }, [selectedCam, shakeOffsets]);

  return (
    <div className="flex flex-col h-full bg-[#090d14] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0d1320] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
            <Video size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Cinemachine Virtual Camera & Cine Camera Brain Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 text-[10px] font-bold border border-amber-500/40 font-mono">
                Unity Cinemachine & Unreal Cine Camera Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Multi-VCam arbitration brain, Framing Transposer (Dead/Soft Zones), Physical Lens Optics, and 6-DOF Impulse Shakes.
            </p>
          </div>
        </div>

        {/* Active Camera Live Pill */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5">
            <Eye size={13} /> Active Brain: {activeCamera.name}
          </span>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* COLUMN 1: Virtual Camera Rigs List (3 cols) */}
        <div className="lg:col-span-3 border-r border-[#1c2438] bg-[#0c111c] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-amber-400" /> Virtual Cameras ({cameras.length})
            </span>
            <span className="text-[10px] font-mono text-[#64748b]">Brain Priority</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cameras.map(cam => {
              const isActive = cam.id === activeCamera.id;
              const isSelected = cam.id === selectedCamId;
              return (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCamId(cam.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-amber-950/40 border-amber-500/60 shadow-md shadow-amber-950/30' 
                      : 'bg-[#121826] border-[#1f293d] hover:border-[#334155]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs font-mono">{cam.name}</span>
                    {isActive && (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono font-bold border border-emerald-500/40">
                        LIVE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[10px] text-[#64748b]">
                    <span>Priority: <strong className="text-amber-400 font-mono">{cam.priority}</strong></span>
                    <span>FOV: {cam.fieldOfView}°</span>
                  </div>

                  {!isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMakeActive(cam.id);
                      }}
                      className="w-full mt-2 py-1 rounded bg-[#162035] hover:bg-amber-600 text-white text-[10px] font-bold font-mono transition-colors"
                    >
                      Cut / Blend to this VCam
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: 3D Viewport Framing & Dead Zone Canvas (5 cols) */}
        <div className="lg:col-span-5 border-r border-[#1c2438] bg-[#080b12] flex flex-col overflow-hidden relative">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Crosshair size={13} className="text-cyan-400" /> Framing Transposer Viewport
            </span>
            <span className="text-[10px] font-mono text-[#94a3b8]">
              Yellow: Dead Zone • Cyan: Soft Zone
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 bg-[#05070d] relative overflow-hidden">
            <canvas
              ref={viewportCanvasRef}
              width={480}
              height={360}
              className="rounded-xl border border-[#1e293d] shadow-2xl bg-[#0a0f1d]"
            />

            {/* Over-canvas lens HUD */}
            <div className="absolute top-6 left-6 p-2 rounded-lg bg-black/70 backdrop-blur-md border border-[#23314d] text-[10px] font-mono space-y-0.5">
              <div className="text-amber-400 font-bold">{selectedCam.optics.sensorFormat}</div>
              <div className="text-white">{selectedCam.optics.focalLengthMm}mm • f/{selectedCam.optics.apertureFStop}</div>
              <div className="text-[#94a3b8]">Focus: {selectedCam.optics.focusDistanceMeters}m</div>
            </div>
          </div>

          {/* Framing Transposer Tuner Strip */}
          <div className="p-3 border-t border-[#1c2438] bg-[#0d1322] flex items-center justify-between text-xs font-mono">
            <span className="text-[#64748b]">Dead Zone: {(selectedCam.framing.deadZoneWidth * 100).toFixed(0)}%</span>
            <span className="text-[#64748b]">Soft Zone: {(selectedCam.framing.softZoneWidth * 100).toFixed(0)}%</span>
            <span className="text-cyan-400">Damping: {selectedCam.framing.dampingX}s</span>
          </div>
        </div>

        {/* COLUMN 3: Physical Optics & 6-DOF Impulse Shake Generator (4 cols) */}
        <div className="lg:col-span-4 bg-[#0c111c] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={13} className="text-orange-400" /> 6-DOF Cinemachine Impulse
            </span>
            <span className="text-[10px] font-mono text-orange-400">Trauma Engine</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Shake Trauma Meter & Triggers */}
            <div className="p-4 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Current Camera Trauma</span>
                <span className="font-mono text-orange-400">{(trauma * 100).toFixed(0)}%</span>
              </div>

              {/* Trauma Bar */}
              <div className="w-full h-2 rounded-full bg-[#1a2336] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-75"
                  style={{ width: `${trauma * 100}%` }}
                ></div>
              </div>

              {/* Trigger Shake Action Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] font-mono font-bold">
                <button
                  onClick={() => handleTriggerShake(0.85)}
                  className="py-2 rounded-lg bg-rose-900/60 hover:bg-rose-600 border border-rose-500/40 text-white transition-colors cursor-pointer"
                >
                  💥 Explosion
                </button>
                <button
                  onClick={() => handleTriggerShake(0.45)}
                  className="py-2 rounded-lg bg-amber-900/60 hover:bg-amber-600 border border-amber-500/40 text-white transition-colors cursor-pointer"
                >
                  🔫 Recoil
                </button>
                <button
                  onClick={() => handleTriggerShake(0.25)}
                  className="py-2 rounded-lg bg-blue-900/60 hover:bg-blue-600 border border-blue-500/40 text-white transition-colors cursor-pointer"
                >
                  👞 Footstep
                </button>
              </div>

              {/* Live 6-DOF Seismograph Offsets */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1a2336] text-[10px] font-mono text-[#94a3b8]">
                <div>Pitch: <strong className="text-white">{shakeOffsets.pitch.toFixed(2)}°</strong></div>
                <div>Yaw: <strong className="text-white">{shakeOffsets.yaw.toFixed(2)}°</strong></div>
                <div>Roll: <strong className="text-white">{shakeOffsets.roll.toFixed(2)}°</strong></div>
              </div>
            </div>

            {/* Physical Lens Optics (Unreal Cine Camera) */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Physical Lens Optics
              </span>

              <div>
                <label className="text-xs font-semibold block mb-1">Sensor Format</label>
                <select
                  value={selectedCam.optics.sensorFormat}
                  onChange={(e) => handleUpdateCam({
                    optics: { ...selectedCam.optics, sensorFormat: e.target.value as SensorFormatPreset }
                  })}
                  className="w-full p-2 rounded-lg bg-[#141b2c] border border-[#23314d] text-xs font-mono text-white"
                >
                  <option value="SUPER_35">Super 35mm (Cinema Standard)</option>
                  <option value="FULL_FRAME_35MM">Full Frame 35mm (Large Format)</option>
                  <option value="IMAX_70MM">IMAX 70mm (Extreme Resolution)</option>
                  <option value="MICRO_4_3">Micro 4/3</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Focal Length</span>
                  <span className="font-mono text-amber-400">{selectedCam.optics.focalLengthMm}mm</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="135"
                  step="1"
                  value={selectedCam.optics.focalLengthMm}
                  onChange={(e) => handleUpdateCam({
                    optics: { ...selectedCam.optics, focalLengthMm: parseInt(e.target.value) }
                  })}
                  className="w-full accent-amber-500 h-1.5 bg-[#1a2336] rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Aperture</span>
                  <span className="font-mono text-amber-400">f/{selectedCam.optics.apertureFStop}</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="22.0"
                  step="0.2"
                  value={selectedCam.optics.apertureFStop}
                  onChange={(e) => handleUpdateCam({
                    optics: { ...selectedCam.optics, apertureFStop: parseFloat(e.target.value) }
                  })}
                  className="w-full accent-amber-500 h-1.5 bg-[#1a2336] rounded-lg"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
