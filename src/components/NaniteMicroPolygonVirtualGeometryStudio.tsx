/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: AAA Nanite Micro-Polygon Virtual Geometry & Streaming Studio (Unreal Engine 5
 *          Nanite Parity). Provides viewport cluster inspection, micro-polygon triangle
 *          visualization, Software vs Hardware rasterization breakdown, streaming VRAM
 *          bandwidth monitoring, and target screen-size error tuning.
 *    - TH: สตูดิโอระบบ Nanite Micro-Polygon Virtual Geometry และการสตรีมเรขาคณิตสามมิติ
 *          ระดับ AAA (เทียบเท่าสถาปัตยกรรม UE5 Nanite)
 *          วิเคราะห์การจัดกลุ่มคลัสเตอร์ไมโครโพลิกอน (Clusters View), ตรวจสอบการเลือกวาด
 *          ระหว่าง Software กับ Hardware Rasterizer, ดู Heatmap การวาดทับ (Overdraw),
 *          และปรับแต่งระดับความคลาดเคลื่อนบนหน้าจอ (Screen-Size Error Px)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `naniteGeometryTypes.ts` and `NaniteGeometryEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Layers,
  Cpu,
  HardDrive,
  Eye,
  Sliders,
  ZoomIn,
  Activity,
  Maximize2,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { naniteGeometryEngine } from '../utils/NaniteGeometryEngineNode';
import { NaniteViewMode, NaniteCluster } from '../types/naniteGeometryTypes';

interface NaniteStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function NaniteMicroPolygonVirtualGeometryStudio({ onSelectTool }: NaniteStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<NaniteViewMode>(() => naniteGeometryEngine.getViewMode());
  const [cameraDistance, setCameraDistance] = useState<number>(() => naniteGeometryEngine.getCameraDistance());
  const [screenError, setScreenError] = useState<number>(() => naniteGeometryEngine.getTargetScreenError());
  const [stats, setStats] = useState(() => naniteGeometryEngine.getStreamingStats());
  const [mesh] = useState(() => naniteGeometryEngine.getActiveMesh());
  const [selectedCluster, setSelectedCluster] = useState<NaniteCluster | null>(null);

  useEffect(() => {
    return naniteGeometryEngine.subscribe(() => {
      setViewMode(naniteGeometryEngine.getViewMode());
      setCameraDistance(naniteGeometryEngine.getCameraDistance());
      setScreenError(naniteGeometryEngine.getTargetScreenError());
      setStats(naniteGeometryEngine.getStreamingStats());
    });
  }, []);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Dark grid background
    ctx.fillStyle = '#060911';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#131c2e';
    ctx.lineWidth = 1;
    const step = 30;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const clusters = naniteGeometryEngine.getClusters();
    const centerX = width / 2;
    const centerY = height / 2;
    const zoomScale = Math.max(30, 240 / cameraDistance);

    // Draw clusters
    clusters.forEach((c) => {
      const [cx, cy, cz] = c.center;
      const px = centerX + cx * zoomScale;
      const py = centerY + cy * zoomScale;
      const radius = Math.max(12, c.boundsRadius * zoomScale);

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);

      if (viewMode === 'CLUSTERS') {
        ctx.fillStyle = c.colorHex + 'aa';
        ctx.strokeStyle = '#ffffff88';
      } else if (viewMode === 'RASTER_MODE') {
        ctx.fillStyle = c.rasterizerType === 'SOFTWARE' ? '#ef4444bb' : '#10b981bb';
        ctx.strokeStyle = c.rasterizerType === 'SOFTWARE' ? '#fca5a5' : '#86efac';
      } else if (viewMode === 'OVERDRAW') {
        ctx.fillStyle = '#f59e0b88';
        ctx.strokeStyle = '#fbbf24';
      } else {
        // OVERVIEW / TRIANGLES
        ctx.fillStyle = '#3b82f6aa';
        ctx.strokeStyle = '#93c5fd';
      }

      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Cluster wireframe triangle lines inside
      ctx.beginPath();
      ctx.moveTo(px - radius * 0.7, py + radius * 0.5);
      ctx.lineTo(px, py - radius * 0.8);
      ctx.lineTo(px + radius * 0.7, py + radius * 0.5);
      ctx.closePath();
      ctx.strokeStyle = '#ffffff66';
      ctx.stroke();

      // Draw cluster index
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px monospace';
      ctx.fillText(`C${c.clusterIndex}`, px - 8, py + 3);
    });
  }, [viewMode, cameraDistance, screenError]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const zoomScale = Math.max(30, 240 / cameraDistance);

    const clusters = naniteGeometryEngine.getClusters();
    for (const c of clusters) {
      const [cx, cy] = c.center;
      const px = centerX + cx * zoomScale;
      const py = centerY + cy * zoomScale;
      const dist = Math.hypot(x - px, y - py);
      if (dist < Math.max(12, c.boundsRadius * zoomScale)) {
        setSelectedCluster(c);
        return;
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080c14] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0c121e] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
            <Box size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Nanite Micro-Polygon Virtual Geometry Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 font-mono">
                Unreal Engine 5 Nanite Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Cluster DAG streaming (128 triangles/cluster), Software vs Hardware rasterizer split, and pixel error threshold tuning.
            </p>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-1.5 bg-[#121927] p-1 rounded-xl border border-[#1e2a3f]">
          {(['CLUSTERS', 'RASTER_MODE', 'OVERDRAW', 'OVERVIEW'] as NaniteViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setViewMode(mode);
                naniteGeometryEngine.setViewMode(mode);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1a2438]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1c2438] bg-[#060911] relative">
          
          {/* Viewport Top Bar */}
          <div className="p-3 border-b border-[#1c2438] bg-[#0c121e]/80 backdrop-blur flex items-center justify-between z-10">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-white font-bold">{mesh.name}</span>
              <span className="text-emerald-400">• {(mesh.triangleBudgetRaw / 1000000).toFixed(1)}M Raw Tris</span>
              <span className="text-[#64748b]">• {stats.residentClusters} Active Clusters</span>
            </div>

            {/* Rasterizer Legend */}
            {viewMode === 'RASTER_MODE' && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Software (Sub-pixel)
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Hardware Raster
                </span>
              </div>
            )}
          </div>

          {/* Interactive Canvas */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={480}
              onClick={handleCanvasClick}
              className="max-w-full max-h-full cursor-crosshair"
            />
          </div>

          {/* Viewport Bottom Controls */}
          <div className="p-3 border-t border-[#1c2438] bg-[#0c121e] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#94a3b8] font-mono">Camera Distance:</span>
              <input
                type="range"
                min="1.0"
                max="15.0"
                step="0.5"
                value={cameraDistance}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCameraDistance(val);
                  naniteGeometryEngine.setCameraDistance(val);
                }}
                className="w-36 accent-emerald-500 h-1.5 bg-[#1a2336] rounded-lg"
              />
              <span className="font-mono text-emerald-400">{cameraDistance.toFixed(1)}m</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#94a3b8] font-mono">Screen Size Error:</span>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={screenError}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setScreenError(val);
                  naniteGeometryEngine.setTargetScreenError(val);
                }}
                className="w-36 accent-emerald-500 h-1.5 bg-[#1a2336] rounded-lg"
              />
              <span className="font-mono text-emerald-400">{screenError.toFixed(1)} px</span>
            </div>
          </div>

        </div>

        {/* TELEMETRY & CLUSTER INSPECTOR (4 cols) */}
        <div className="lg:col-span-4 bg-[#0a0e17] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Gauge size={13} className="text-emerald-400" /> Nanite Streaming Telemetry
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Live GPU Pool</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Streaming Pool Card */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">VRAM Streaming Pool</span>
                <span className="font-mono text-emerald-400">{stats.streamingPoolUsedMB} MB / {stats.streamingPoolMaxMB} MB</span>
              </div>
              <div className="w-full bg-[#172033] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${(stats.streamingPoolUsedMB / stats.streamingPoolMaxMB) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                <span>Disk I/O: {stats.diskIoBandwidthMBs} MB/s</span>
                <span>Avg Error: {stats.averageScreenErrorPx} px</span>
              </div>
            </div>

            {/* Rasterizer Pipeline Ratio */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Triangles by Rasterizer Type
              </span>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-[#131b2c] border border-[#1f2d47]">
                  <span className="text-rose-400">Software Rasterizer (Compute)</span>
                  <span className="text-white font-bold">{stats.softwareRasterizedTriangles.toLocaleString()} tris</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#131b2c] border border-[#1f2d47]">
                  <span className="text-emerald-400">Hardware Rasterizer (Fixed)</span>
                  <span className="text-white font-bold">{stats.hardwareRasterizedTriangles.toLocaleString()} tris</span>
                </div>
              </div>
            </div>

            {/* Selected Cluster Details */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Selected Cluster Details
              </span>

              {selectedCluster ? (
                <div className="space-y-1.5 text-xs font-mono bg-[#131b2c] p-3 rounded-lg border border-[#1f2d47]">
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Cluster ID:</span>
                    <span className="text-white font-bold">{selectedCluster.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Triangles:</span>
                    <span className="text-emerald-400 font-bold">{selectedCluster.triangleCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">LOD Level:</span>
                    <span className="text-indigo-400 font-bold">LOD {selectedCluster.lodLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Rasterizer:</span>
                    <span className={selectedCluster.rasterizerType === 'SOFTWARE' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {selectedCluster.rasterizerType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Bounds Radius:</span>
                    <span className="text-white">{selectedCluster.boundsRadius} m</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#64748b] italic">Click on any cluster in the viewport to inspect its DAG node.</p>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
