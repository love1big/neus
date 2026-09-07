/**
 * @file OmniWorldMapStudio.tsx
 * @description
 * ============================================================================
 * [THAI]
 * สตูดิโอสร้างแผนที่ 3D 2D VR สำหรับเกมและโลกจำลอง (Omni 3D/2D/VR World Map Studio)
 * ระบบออกแบบและสร้างแผนที่แบบครบวงจร:
 *   1. Procedural Terrain Generator: คำนวณความสูง (Heightmap) ด้วยสัญญาณรบกวน Multi-Octave
 *   2. Biome Ecosystems: มหาสมุทร (Ocean), ชายหาด (Sand), ทุ่งหญ้า (Grass), ป่าดงดิบ (Forest), ภูเขาหิน (Rock), ยอดเขาหิมะ (Snow)
 *   3. 2D & 3D Isometric Viewport Switcher: สลับดูแผนที่ทั้งแบบแผนภูมิ 2 มิติ และแบบยกมิติ 3D Isometric
 *   4. VR Waypoint & Teleport Gate Manager: มาร์กจุดเกิด (Spawn), ประตูวาป (Portal), และ รังบอส (Boss Lair)
 *   5. Seed & Parameter Randomizer: สุ่มเลข Seed เพื่อสร้างโลกใหม่ได้ไม่จำกัด
 *   6. Map Export Suite: ส่งออกเป็นไฟล์ JSON Map Descriptor และ Heightmap
 *
 * [ENGLISH]
 * Enterprise 3D/2D/VR World Map & Biome Generator Studio.
 * Features:
 *   - 2D Topographic & 3D Isometric Map Viewports
 *   - Multi-Biome Ecosystem Synthesizer (Ocean, Shore, Plains, Forest, Mountains, Snow)
 *   - VR Waypoint & NavMesh Marker System
 *   - Real-time Terrain Moisture & Water Level Sliders
 *   - Procedural Seed Randomizer & JSON/Raw Exporters
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Globe, Map, Mountain, Layers, Download, Sparkles,
  Sliders, Compass, MapPin, RefreshCw, Eye, Flag
} from 'lucide-react';

import {
  OmniWorldMapEngine,
  WorldMapData,
  BiomeType,
  MapWaypoint
} from '../utils/OmniWorldMapEngine';

export default function OmniWorldMapStudio() {
  const [mapEngine] = useState<OmniWorldMapEngine>(() => new OmniWorldMapEngine(32, 32, 4242));
  const [mapData, setMapData] = useState<WorldMapData>(() => mapEngine.getMap());
  const [viewMode, setViewMode] = useState<'2d_grid' | '3d_isometric' | 'biomes' | 'waypoints'>('2d_grid');
  const [seed, setSeed] = useState<number>(4242);
  const [waterLevel, setWaterLevel] = useState<number>(0.35);
  const [octaves, setOctaves] = useState<number>(4);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render Map Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellW = canvas.width / mapData.width;
    const cellH = canvas.height / mapData.height;

    if (viewMode === '2d_grid' || viewMode === 'biomes' || viewMode === 'waypoints') {
      // 2D Topographic Grid Render
      for (let y = 0; y < mapData.height; y++) {
        for (let x = 0; x < mapData.width; x++) {
          const cell = mapData.cells[y][x];
          ctx.fillStyle = cell.color;
          ctx.fillRect(x * cellW, y * cellH, cellW, cellH);

          // Subtle grid outline
          ctx.strokeStyle = 'rgba(0,0,0,0.15)';
          ctx.strokeRect(x * cellW, y * cellH, cellW, cellH);
        }
      }

      // Draw Waypoints on 2D map
      for (const wp of mapData.waypoints) {
        const px = wp.x * cellW + cellW / 2;
        const py = wp.y * cellH + cellH / 2;

        ctx.fillStyle = wp.type === 'player_spawn' ? '#10b981' : wp.type === 'boss_lair' ? '#ef4444' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(wp.name.split(' ')[0], px + 8, py + 3);
      }
    } else if (viewMode === '3d_isometric') {
      // 3D Isometric Projection
      const originX = canvas.width / 2;
      const originY = 80;
      const tileWidth = 14;
      const tileHeight = 7;

      for (let y = 0; y < mapData.height; y++) {
        for (let x = 0; x < mapData.width; x++) {
          const cell = mapData.cells[y][x];
          const isoX = originX + (x - y) * (tileWidth / 2);
          const elevation = cell.height * 40;
          const isoY = originY + (x + y) * (tileHeight / 2) - elevation;

          // Draw Diamond Tile
          ctx.beginPath();
          ctx.moveTo(isoX, isoY);
          ctx.lineTo(isoX + tileWidth / 2, isoY + tileHeight / 2);
          ctx.lineTo(isoX, isoY + tileHeight);
          ctx.lineTo(isoX - tileWidth / 2, isoY + tileHeight / 2);
          ctx.closePath();

          ctx.fillStyle = cell.color;
          ctx.fill();
          ctx.strokeStyle = 'rgba(0,0,0,0.2)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }, [mapData, viewMode]);

  // Regenerate Map
  const handleRegenerate = (newSeed: number, newWater: number, newOct: number) => {
    const updated = mapEngine.generateProceduralMap(32, 32, newSeed, newOct, newWater);
    setMapData({ ...updated });
  };

  // Randomize Seed
  const handleRandomSeed = () => {
    const r = Math.floor(Math.random() * 999999);
    setSeed(r);
    handleRegenerate(r, waterLevel, octaves);
  };

  // Export JSON Map
  const handleExportMap = () => {
    const jsonStr = JSON.stringify(mapData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mapData.title.toLowerCase().replace(/\s+/g, '-')}-map.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="omni-world-map-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Studio Header */}
      <header id="world-map-header" className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 p-0.5 shadow-emerald-500/20 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              4. โปรแกรมสร้างแผนที่ 3D 2D VR (Omni World Map Studio)
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Procedural Biome & Terrain Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Multi-Octave Heightmap • Dynamic Biomes • 2D/3D Isometric Viewports • VR NavMesh Waypoints
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setViewMode('2d_grid')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === '2d_grid' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ 2D Topographic
            </button>
            <button
              onClick={() => setViewMode('3d_isometric')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === '3d_isometric' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏔️ 3D Isometric
            </button>
            <button
              onClick={() => setViewMode('biomes')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'biomes' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌿 Biome Matrix
            </button>
            <button
              onClick={() => setViewMode('waypoints')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'waypoints' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              📍 VR Waypoints
            </button>
          </div>

          <button
            onClick={handleExportMap}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออกแผนที่ (Export Map)</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: TERRAIN & BIOME PARAMETERS (4 cols) */}
        {/* ========================================================================= */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Terrain Parameters
              </h2>
              <button
                onClick={handleRandomSeed}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>สุ่ม Seed</span>
              </button>
            </div>

            {/* Seed Controller */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-400">Map Generation Seed:</label>
              <input
                type="number"
                value={seed}
                onChange={(e) => {
                  const s = Number(e.target.value);
                  setSeed(s);
                  handleRegenerate(s, waterLevel, octaves);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
              />
            </div>

            {/* Water Level Slider */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>ระดับผิวน้ำ (Sea Level):</span>
                <span className="font-mono text-sky-400">{Math.round(waterLevel * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.8}
                step={0.05}
                value={waterLevel}
                onChange={(e) => {
                  const w = Number(e.target.value);
                  setWaterLevel(w);
                  handleRegenerate(seed, w, octaves);
                }}
                className="w-full accent-sky-500"
              />
            </div>

            {/* Octaves Slider */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>ความซับซ้อนของภูมิประเทศ (Octaves):</span>
                <span className="font-mono text-emerald-400">{octaves} Steps</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                step={1}
                value={octaves}
                onChange={(e) => {
                  const o = Number(e.target.value);
                  setOctaves(o);
                  handleRegenerate(seed, waterLevel, o);
                }}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Biome Legend */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-300">สารบัญภูมิประเทศ (Biome Legend):</div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#0284c7]" />
                  <span>Deep Ocean (ทะเลลึก)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#38bdf8]" />
                  <span>Water (ผิวน้ำตื้น)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#fde047]" />
                  <span>Sand Beach (หาดทราย)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#22c55e]" />
                  <span>Plains (ทุ่งหญ้า)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#15803d]" />
                  <span>Deep Forest (ป่าดงดิบ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#f8fafc]" />
                  <span>Snow Peaks (ยอดเขาหิมะ)</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: MAP VIEWPORT CANVAS (8 cols) */}
        {/* ========================================================================= */}
        <section className="lg:col-span-8 space-y-4 flex flex-col">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-white flex items-center gap-2">
                <Mountain className="w-4 h-4 text-emerald-400" />
                {mapData.title} ({mapData.width}x{mapData.height} Grid)
              </span>
              <span className="font-mono text-emerald-400">Seed: {mapData.seed}</span>
            </div>

            {/* Map Canvas Viewport */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={640}
                height={460}
                className="w-full h-auto max-h-[460px] block"
              />
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>สามารถสลับมุมมองแผนที่ระหว่าง 2D Topographic และ 3D Isometric ได้ที่แถบเมนูด้านบน</span>
              <span className="font-mono text-sky-400">Waypoints: {mapData.waypoints.length} Marked</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
