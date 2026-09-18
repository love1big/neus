/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: AAA Procedural Content Generation (PCG) Framework & Spline Deformer Studio
 *          (Unreal Engine 5.2+ PCG Graph & Unity Spline Mesh Toolkit parity).
 *          Features real-time spatial point-cloud generation via Poisson Disk sampling,
 *          elevation and slope filtering, weighted mesh asset instancing palettes,
 *          and curved spline road/river deformers with a live interactive canvas.
 *    - TH: สตูดิโอระบบ Procedural Content Generation (PCG) และ Spline Mesh Deformer ระดับ AAA
 *          (เทียบเท่า Unreal Engine 5.2+ PCG Framework และ Unity Spline Toolkit)
 *          กระจายจุดพิกัดวัตถุในโลกเปิดด้วย Poisson Disk Sampling, คัดกรองความชันและความสูงของภูมิประเทศ,
 *          จัดการพาเลทโมเดลสามมิติ (ต้นไม้, ก้อนหิน, พืชคลุมดิน, ซากปรักหักพัง),
 *          พร้อมเส้น Spline จำลองแนวถนนและแม่น้ำบนหน้าจอพรีวิวแบบโต้ตอบได้
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Backed by `ProceduralPCGExecutionNode.ts` and `pcgFrameworkTypes.ts`
 *    - Integrates with Open-World streaming and foliage instance managers
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Safe seed randomness and bounded density loops.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```tsx
 *    <ProceduralContentGenerationPCGStudio onSelectTool={handleSelect} />
 *    ```
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Trees,
  Layers,
  Sliders,
  Sparkles,
  RefreshCw,
  Eye,
  Activity,
  Compass,
  Zap,
  Tag,
  Mountain,
  MapPin,
  Route,
  Grid,
  CheckCircle2
} from 'lucide-react';
import { pcgEngine } from '../utils/ProceduralPCGExecutionNode';
import { PCGGraphSettings, PCGPoint } from '../types/pcgFrameworkTypes';

interface PCGStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function ProceduralContentGenerationPCGStudio({ onSelectTool }: PCGStudioProps) {
  const [settings, setSettings] = useState<PCGGraphSettings>(() => pcgEngine.getSettings());
  const [points, setPoints] = useState<PCGPoint[]>(() => pcgEngine.getGeneratedPoints());
  const [selectedAssetId, setSelectedAssetId] = useState<string>('mesh_pine_tree');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return pcgEngine.subscribe(() => {
      setSettings(pcgEngine.getSettings());
      setPoints(pcgEngine.getGeneratedPoints());
    });
  }, []);

  const handleRegenerate = (newSeed?: number) => {
    const seed = newSeed ?? Math.floor(Math.random() * 999999);
    pcgEngine.updateSettings({ seed });
  };

  const handleUpdate = (updates: Partial<PCGGraphSettings>) => {
    pcgEngine.updateSettings(updates);
  };

  // Render 2D Top-Down Spatial Point Cloud Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const scale = (w / 2) / (settings.boundsRadiusMeters * 1.15);

    // 1. Background Grid & Bounds
    ctx.fillStyle = '#060911';
    ctx.fillRect(0, 0, w, h);

    // Bounds circle
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, settings.boundsRadiusMeters * scale, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Draw Spline Ribbon (Road / River)
    if (settings.splineWaypoints.length >= 2) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 14 * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();

      settings.splineWaypoints.forEach((wp, idx) => {
        const sx = centerX + wp.position.x * scale;
        const sy = centerY + wp.position.z * scale;
        if (idx === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.stroke();

      // Spline Centerline
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Waypoint Handles
      settings.splineWaypoints.forEach(wp => {
        const sx = centerX + wp.position.x * scale;
        const sy = centerY + wp.position.z * scale;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // 3. Draw Points
    points.forEach(pt => {
      const px = centerX + pt.position.x * scale;
      const py = centerY + pt.position.z * scale;
      const radius = Math.max(2, pt.scale.x * 2.8);

      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [points, settings]);

  return (
    <div className="flex flex-col h-full bg-[#090d14] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0d1320] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
            <Trees size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Procedural Content Generation (PCG) & Spline Deformer Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 font-mono">
                Unreal PCG & Unity Spline Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              High-throughput spatial point cloud sampling, Poisson disk spacing, terrain slope filtering, and spline extrusion.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRegenerate()}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
          >
            <RefreshCw size={13} /> Re-seed & Generate
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* COLUMN 1: Mesh Asset Palette & Biome Rules (3 cols) */}
        <div className="lg:col-span-3 border-r border-[#1c2438] bg-[#0c111c] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-emerald-400" /> Mesh Palette ({settings.meshPalette.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Biome Instances</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {settings.meshPalette.map(mesh => {
              const isSelected = mesh.id === selectedAssetId;
              const countForThisMesh = points.filter(p => p.meshAssetId === mesh.id).length;
              return (
                <div
                  key={mesh.id}
                  onClick={() => setSelectedAssetId(mesh.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-950/30' 
                      : 'bg-[#121826] border-[#1f293d] hover:border-[#334155]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mesh.color }}></span>
                      <span className="font-bold text-white text-xs">{mesh.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-[#162035]">
                      {countForThisMesh} pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[10px] text-[#64748b]">
                    <span>Weight: <strong className="text-white font-mono">{mesh.weight}</strong></span>
                    <span>Slope Limit: {mesh.slopeLimitDegrees}°</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Spline Waypoints Summary */}
          <div className="p-3 border-t border-[#1c2438] bg-[#0f1624]">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Route size={13} className="text-amber-400" /> Spline Path ({settings.splineWaypoints.length} nodes)
            </span>
            <p className="text-[11px] text-[#94a3b8]">
              Continuous cubic Hermite spline with width extrusion ribbon.
            </p>
          </div>
        </div>

        {/* COLUMN 2: Spatial Point Cloud Preview Canvas (5 cols) */}
        <div className="lg:col-span-5 border-r border-[#1c2438] bg-[#080b12] flex flex-col overflow-hidden relative">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Compass size={13} className="text-emerald-400" /> Top-Down Spatial Point Distribution
            </span>
            <span className="text-[10px] font-mono text-[#94a3b8]">Radius {settings.boundsRadiusMeters}m</span>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 bg-[#05070d] relative overflow-hidden">
            <canvas
              ref={canvasRef}
              width={460}
              height={420}
              className="rounded-xl border border-[#1e293d] shadow-2xl bg-[#0a0f1d]"
            />

            {/* Canvas Legend Overlay */}
            <div className="absolute top-6 left-6 p-2 rounded-lg bg-black/70 backdrop-blur-md border border-[#23314d] text-[10px] font-mono space-y-1">
              <div className="text-emerald-400 font-bold">Total Instances: {points.length}</div>
              <div className="text-[#94a3b8]">Method: {settings.samplingMethod}</div>
              <div className="text-amber-400">Spline Ribbon: Enabled</div>
            </div>
          </div>

          <div className="p-3 border-t border-[#1c2438] bg-[#0d1322] flex items-center justify-between text-xs font-mono">
            <span className="text-[#64748b]">Seed: {settings.seed}</span>
            <span className="text-emerald-400 font-bold">Min Distance: {settings.minDistanceBetweenPoints}m</span>
          </div>
        </div>

        {/* COLUMN 3: Sampling & Filtering Parameters Tuner (4 cols) */}
        <div className="lg:col-span-4 bg-[#0c111c] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={13} className="text-emerald-400" /> PCG Graph Parameters
            </span>
            <span className="text-[10px] font-mono text-[#64748b]">Poisson Disk</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Poisson Spacing (Min Distance)</span>
                  <span className="font-mono text-emerald-400">{settings.minDistanceBetweenPoints}m</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="15.0"
                  step="0.5"
                  value={settings.minDistanceBetweenPoints}
                  onChange={(e) => handleUpdate({ minDistanceBetweenPoints: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-[#1a2336] rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Bounds Radius</span>
                  <span className="font-mono text-emerald-400">{settings.boundsRadiusMeters}m</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="250"
                  step="10"
                  value={settings.boundsRadiusMeters}
                  onChange={(e) => handleUpdate({ boundsRadiusMeters: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-[#1a2336] rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Max Slope Limit</span>
                  <span className="font-mono text-emerald-400">{settings.maxSlopeDegrees}°</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={settings.maxSlopeDegrees}
                  onChange={(e) => handleUpdate({ maxSlopeDegrees: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-[#1a2336] rounded-lg"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                Biome Generation Presets
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => handleUpdate({ minDistanceBetweenPoints: 4.5, boundsRadiusMeters: 120 })}
                  className="p-2.5 rounded-lg bg-[#162035] hover:bg-emerald-600 text-white transition-colors"
                >
                  Dense Forest
                </button>
                <button
                  onClick={() => handleUpdate({ minDistanceBetweenPoints: 10.0, boundsRadiusMeters: 160 })}
                  className="p-2.5 rounded-lg bg-[#162035] hover:bg-emerald-600 text-white transition-colors"
                >
                  Sparse Meadow
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
