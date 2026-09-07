/**
 * ============================================================================
 * @file AdvancedWorldGenStudio.tsx
 * @module Components/WorldGen
 * @description
 * [TH] สตูดิโอสร้างแผนที่โลกและภูมิประเทศเกมระดับมืออาชีพ AAA (Advanced World Gen Studio)
 * มาพร้อมระบบอัลกอริทึมเฉพาะทาง:
 * - Multilayer Fractal Brownian Motion (FBM) & Octave Noise
 * - Droplet-based Hydraulic Erosion & Thermal Mass Movement
 * - Whittaker Climate Matrix (12 Biome Types)
 * - Steepest Descent River Flow Physics
 * - Kruskal's MST + Delaunay + A* Road Infrastructure
 * - Poisson Disk Sampling For Tree/Prop Foliage
 * - Heightmap 16-bit PNG / Raw Buffer Export
 *
 * [EN] Professional AAA World Map & Procedural Terrain Studio with real-time canvas
 * rendering, biome visualization, erosion simulations, and topology exports.
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Globe,
  Mountain,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  Download,
  Settings,
  TreePine,
  Compass,
  Sliders,
  Maximize2,
  Droplets,
  Route,
  Activity,
  CheckCircle2,
  Info
} from 'lucide-react';
import {
  ProceduralWorldMapGenEngine,
  TerrainGenerationConfig,
  WorldMapSimulationResult,
  BiomeType
} from '../utils/ProceduralWorldMapGenEngine';

export default function AdvancedWorldGenStudio() {
  const [config, setConfig] = useState<TerrainGenerationConfig>({
    seed: 84920,
    width: 128,
    height: 128,
    scale: 32.0,
    octaves: 5,
    persistence: 0.52,
    lacunarity: 2.1,
    heightMultiplier: 1.0,
    seaLevel: 0.28,
    mountainThreshold: 0.72,
    erosionIterations: 2500,
    erosionDropletVolume: 1.0,
    thermalErosionAngle: 35.0,
    biomeCount: 12,
    enableRivers: true,
    enableRoads: true,
    poissonRadius: 3.5
  });

  const [activeViewMode, setActiveViewMode] = useState<'Biome' | 'Elevation' | 'Moisture' | 'Temperature' | 'ErosionDelta' | '3DIsometric'>('Biome');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<WorldMapSimulationResult | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; elevation: number; biome: string; temp: number; moist: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ProceduralWorldMapGenEngine>(new ProceduralWorldMapGenEngine(config));

  // รันการคำนวณแผนที่
  const runGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      engineRef.current.updateConfig(config);
      const result = engineRef.current.generate();
      setSimulationResult(result);
      setIsGenerating(false);
    }, 50);
  };

  useEffect(() => {
    runGeneration();
  }, [config.seed]);

  // วาดแผนที่ลงบน Canvas 2D
  useEffect(() => {
    if (!simulationResult || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = config;
    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);
    const { grid, heightMap, temperatureMap, moistureMap, erosionDelta, rivers, roads, foliageInstances } = simulationResult;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const pIdx = idx * 4;
        const pt = grid[y][x];

        let r = 0, g = 0, b = 0;

        if (activeViewMode === 'Biome') {
          // แปลงสี Hex เป็น RGB
          const hex = pt.biomeColor.replace('#', '');
          r = parseInt(hex.substring(0, 2), 16);
          g = parseInt(hex.substring(2, 4), 16);
          b = parseInt(hex.substring(4, 6), 16);

          // Shadowing ตามความชัน (Shaded Relief)
          if (x < width - 1 && y < height - 1) {
            const slope = (heightMap[idx + 1] - heightMap[idx]) * 1.5;
            const shade = 1.0 + slope;
            r = Math.max(0, Math.min(255, r * shade));
            g = Math.max(0, Math.min(255, g * shade));
            b = Math.max(0, Math.min(255, b * shade));
          }
        } else if (activeViewMode === 'Elevation') {
          const val = Math.floor(heightMap[idx] * 255);
          r = val; g = val; b = val;
        } else if (activeViewMode === 'Temperature') {
          const t = temperatureMap[idx];
          r = Math.floor(t * 255);
          g = 40;
          b = Math.floor((1 - t) * 255);
        } else if (activeViewMode === 'Moisture') {
          const m = moistureMap[idx];
          r = 30;
          g = Math.floor(m * 180 + 40);
          b = Math.floor(m * 255);
        } else if (activeViewMode === 'ErosionDelta') {
          const d = erosionDelta[idx];
          if (d > 0) { // Deposit (Green)
            r = 0; g = Math.min(255, Math.floor(d * 5000)); b = 0;
          } else { // Erode (Red)
            r = Math.min(255, Math.floor(-d * 5000)); g = 0; b = 0;
          }
        }

        imgData.data[pIdx] = r;
        imgData.data[pIdx + 1] = g;
        imgData.data[pIdx + 2] = b;
        imgData.data[pIdx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // วาด Rivers
    if (config.enableRivers && (activeViewMode === 'Biome' || activeViewMode === 'Elevation')) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      for (const river of rivers) {
        ctx.beginPath();
        for (let i = 0; i < river.length; i++) {
          if (i === 0) ctx.moveTo(river[i].x, river[i].y);
          else ctx.lineTo(river[i].x, river[i].y);
        }
        ctx.stroke();
      }
    }

    // วาด Roads
    if (config.enableRoads && activeViewMode === 'Biome') {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      for (const road of roads) {
        ctx.beginPath();
        for (let i = 0; i < road.path.length; i++) {
          const [rx, ry] = road.path[i];
          if (i === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.stroke();
      }
    }

    // วาด Foliage Dots
    if (activeViewMode === 'Biome') {
      ctx.fillStyle = '#10b981';
      for (const f of foliageInstances.slice(0, 150)) {
        ctx.fillRect(f.x, f.y, 1.2, 1.2);
      }
    }

  }, [simulationResult, activeViewMode, config]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!simulationResult || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * config.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * config.height);

    if (x >= 0 && x < config.width && y >= 0 && y < config.height) {
      const pt = simulationResult.grid[y][x];
      setHoveredPoint({
        x,
        y,
        elevation: pt.elevation,
        biome: pt.biome,
        temp: pt.temperature,
        moist: pt.moisture
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 overflow-hidden font-sans select-none">
      {/* Top Header Bar */}
      <div className="h-14 bg-[#111827] border-b border-gray-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide text-base">Procedural World & Map Gen Studio</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                AAA Algorithmic Suite
              </span>
            </div>
            <p className="text-xs text-gray-400">Hydraulic Erosion • Voronoi Biomes • Kruskal MST Roads • Poisson Foliage</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfig(prev => ({ ...prev, seed: Math.floor(Math.random() * 999999) }))}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-medium border border-gray-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Random Seed
          </button>
          <button
            onClick={runGeneration}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-900/30 transition active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isGenerating ? 'Computing...' : 'Generate Terrain'}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Controls Panel */}
        <div className="w-80 bg-[#0f172a] border-r border-gray-800 flex flex-col overflow-y-auto p-4 gap-5 shrink-0">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              Terrain Parameters (พารามิเตอร์ภูมิประเทศ)
            </span>
            
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Seed (เมล็ดสุ่ม)</span>
                  <span className="text-emerald-400 font-mono">{config.seed}</span>
                </div>
                <input
                  type="number"
                  value={config.seed}
                  onChange={e => setConfig(p => ({ ...p, seed: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 font-mono text-white text-xs"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Scale (มาตราส่วน Noise)</span>
                  <span className="text-emerald-400 font-mono">{config.scale.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={config.scale}
                  onChange={e => setConfig(p => ({ ...p, scale: parseFloat(e.target.value) }))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Octaves (จำนวนชั้นความถี่)</span>
                  <span className="text-emerald-400 font-mono">{config.octaves}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={config.octaves}
                  onChange={e => setConfig(p => ({ ...p, octaves: parseInt(e.target.value) }))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Sea Level (ระดับน้ำทะเล)</span>
                  <span className="text-cyan-400 font-mono">{config.seaLevel.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.6"
                  step="0.02"
                  value={config.seaLevel}
                  onChange={e => setConfig(p => ({ ...p, seaLevel: parseFloat(e.target.value) }))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Mountain Threshold (ยอดเขา)</span>
                  <span className="text-amber-400 font-mono">{config.mountainThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.9"
                  step="0.02"
                  value={config.mountainThreshold}
                  onChange={e => setConfig(p => ({ ...p, mountainThreshold: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              Hydraulic Erosion (การกัดเซาะของน้ำ)
            </span>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Droplet Iterations</span>
                  <span className="text-cyan-400 font-mono">{config.erosionIterations}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="250"
                  value={config.erosionIterations}
                  onChange={e => setConfig(p => ({ ...p, erosionIterations: parseInt(e.target.value) }))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Route className="w-3.5 h-3.5 text-amber-400" />
              Features & Overlays
            </span>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableRivers}
                  onChange={e => setConfig(p => ({ ...p, enableRivers: e.target.checked }))}
                  className="rounded bg-gray-900 border-gray-700 text-emerald-600 focus:ring-0"
                />
                <span className="text-gray-300">Simulate River Flow Paths</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableRoads}
                  onChange={e => setConfig(p => ({ ...p, enableRoads: e.target.checked }))}
                  className="rounded bg-gray-900 border-gray-700 text-emerald-600 focus:ring-0"
                />
                <span className="text-gray-300">Generate Kruskal MST Road Network</span>
              </label>
            </div>
          </div>

          {/* Real-time Diagnostics */}
          {simulationResult && (
            <div className="mt-auto p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-[11px] space-y-1.5">
              <div className="font-semibold text-gray-300 flex items-center justify-between">
                <span>Simulation Stats</span>
                <span className="text-emerald-400 font-mono">{simulationResult.stats.generationTimeMs.toFixed(1)}ms</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Rivers Active:</span>
                <span className="text-cyan-300">{simulationResult.stats.riverCount} channels</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Road Length:</span>
                <span className="text-amber-300">{simulationResult.stats.roadLength} nodes</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Foliage Sampled:</span>
                <span className="text-emerald-300">{simulationResult.stats.foliageCount} trees</span>
              </div>
            </div>
          )}
        </div>

        {/* Center Canvas Viewport */}
        <div className="flex-1 flex flex-col bg-[#050811] relative overflow-hidden">
          {/* View Mode Bar */}
          <div className="h-10 bg-[#0d1322] border-b border-gray-800 px-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              {(['Biome', 'Elevation', 'Moisture', 'Temperature', 'ErosionDelta'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setActiveViewMode(mode)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                    activeViewMode === mode
                      ? 'bg-emerald-500 text-black font-semibold'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {hoveredPoint && (
              <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                <span>X: {hoveredPoint.x}, Y: {hoveredPoint.y}</span>
                <span className="text-emerald-400">Biome: {hoveredPoint.biome}</span>
                <span className="text-cyan-400">Elev: {hoveredPoint.elevation.toFixed(2)}m</span>
              </div>
            )}
          </div>

          {/* Interactive Canvas */}
          <div className="flex-1 flex items-center justify-center p-6 relative">
            <div className="relative border-2 border-emerald-500/30 rounded-2xl p-2 bg-[#090d16] shadow-2xl shadow-emerald-950/30">
              <canvas
                ref={canvasRef}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={() => setHoveredPoint(null)}
                className="w-[512px] h-[512px] [image-rendering:pixelated] cursor-crosshair rounded-xl border border-gray-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
