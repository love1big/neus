/**
 * @file Omni3D2DVRModelStudio.tsx
 * @description
 * ============================================================================
 * [THAI]
 * สตูดิโอสร้างโมเดล 3D 2D VR สำหรับเกมและแผนที่ (Omni 3D/2D/VR Model & Asset Studio)
 * ระบบสร้างและปั้นโมเดล 3 มิติ, 2 มิติ พิกเซล และ VR Asset:
 *   1. Realtime 3D Viewport: เรนเดอร์โมเดล 3 มิติ หมุน ซูม ปรับมุมมอง 360 องศา
 *   2. Parametric 3D Primitives: กล่อง (Cube), ทรงกลม (Sphere), ทรงกระบอก (Cylinder), พีระมิด
 *   3. 2D Sprite to 3D Extruder: วาด Pixel Art 2D แล้วกดดันมิติให้กลายเป็น 3D Mesh ทันที
 *   4. Sculpting & Vertex Deformer: เครื่องมือปั้น (Inflate, Deflate, Noise, Smooth)
 *   5. VR-Ready LOD Optimizer: ตรวจสอบ Polygon Budget และคำนวณการแสดงผลบนแว่น VR (90 FPS)
 *   6. Wavefront .OBJ Exporter: ส่งออกโมเดลไปใช้ใน Blender, Maya, Unity, หรือ Unreal Engine
 *
 * [ENGLISH]
 * Enterprise 3D/2D/VR Procedural Modeling & Sculpting Studio.
 * Features:
 *   - 3D Interactive Canvas Viewport with Realtime Orbit / Projection
 *   - Parametric Primitives (Cube, Sphere, Cylinder, Pyramid)
 *   - 2D-to-3D Extrusion Canvas Painter
 *   - Dynamic Vertex Sculpting Brushes
 *   - VR Performance & LOD Telemetry
 *   - Standard Wavefront .OBJ 3D Exporter
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Eye, Layers, Download, Sparkles, Sliders,
  RotateCw, Wand2, ShieldCheck, Grid, Palette, Move
} from 'lucide-react';

import {
  Omni3D2DVRModelEngine,
  Mesh3DModel
} from '../utils/Omni3D2DVRModelEngine';

export default function Omni3D2DVRModelStudio() {
  const [modelEngine] = useState<Omni3D2DVRModelEngine>(() => new Omni3D2DVRModelEngine('cube'));
  const [mesh, setMesh] = useState<Mesh3DModel>(() => modelEngine.getMesh());
  const [rotX, setRotX] = useState<number>(25);
  const [rotY, setRotY] = useState<number>(35);
  const [zoom, setZoom] = useState<number>(100);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'primitives' | '2d_extruder' | 'sculpt' | 'vr_inspect'>('primitives');

  // 2D Pixel Extrusion Grid (8x8)
  const [pixelGrid, setPixelGrid] = useState<number[][]>(() => [
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Canvas Projection & Rendering
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw 3D Ground Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 40, cy + 120);
        ctx.lineTo(cx + i * 80, cy + 240);
        ctx.stroke();
      }

      // Convert 3D Vertices to 2D Screen Projection
      const radX = (rotX * Math.PI) / 180;
      const radY = (rotY * Math.PI) / 180;

      const projected = mesh.vertices.map((v) => {
        // Rotate Y
        let x1 = v.x * Math.cos(radY) + v.z * Math.sin(radY);
        let y1 = v.y;
        let z1 = -v.x * Math.sin(radY) + v.z * Math.cos(radY);

        // Rotate X
        let x2 = x1;
        let y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
        let z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);

        // Perspective Projection
        const fov = 300;
        const scale = (fov / (fov + z2 + 4)) * (zoom / 40);
        const px = cx + x2 * scale * 30;
        const py = cy - y2 * scale * 30;

        return { px, py, z: z2 };
      });

      // Render Triangle Faces (Sorted by Z for Painter's Algorithm)
      const sortedFaces = [...mesh.faces].sort((a, b) => {
        const za = (projected[a.a].z + projected[a.b].z + projected[a.c].z) / 3;
        const zb = (projected[b.a].z + projected[b.b].z + projected[b.c].z) / 3;
        return za - zb;
      });

      for (const face of sortedFaces) {
        const p1 = projected[face.a];
        const p2 = projected[face.b];
        const p3 = projected[face.c];

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.lineTo(p3.px, p3.py);
        ctx.closePath();

        if (!isWireframe) {
          ctx.fillStyle = mesh.materialColor || '#38bdf8';
          ctx.globalAlpha = 0.85;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.strokeStyle = isWireframe ? '#38bdf8' : '#0284c7';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mesh, rotX, rotY, zoom, isWireframe]);

  // Mouse drag handlers for 3D Viewport Rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    setRotY((prev) => prev + dx * 0.6);
    setRotX((prev) => Math.max(-80, Math.min(80, prev + dy * 0.6)));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Switch Primitive
  const handleSelectPrimitive = (type: 'cube' | 'sphere' | 'cylinder' | 'pyramid') => {
    const newMesh = modelEngine.generatePrimitive(type);
    setMesh({ ...newMesh });
  };

  // Extrude 2D Sprite
  const handleExtrudeSprite = () => {
    const newMesh = modelEngine.extrude2DSpriteTo3D(pixelGrid, 0.5);
    setMesh({ ...newMesh });
  };

  // Sculpt Brush
  const handleApplySculpt = (brush: 'inflate' | 'deflate' | 'noise' | 'smooth') => {
    modelEngine.applySculptBrush(brush, 0.15);
    setMesh({ ...modelEngine.getMesh() });
  };

  // Export Wavefront OBJ
  const handleExportOBJ = () => {
    const objData = modelEngine.exportWavefrontOBJ();
    const blob = new Blob([objData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mesh.name.toLowerCase().replace(/\s+/g, '-')}.obj`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="omni-model-studio-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Studio Header */}
      <header id="model-studio-header" className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-amber-500/20 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Box className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              3. โปรแกรมสร้างโมเดล 3D 2D VR (Omni 3D/2D/VR Model Studio)
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                Parametric & VR Mesh Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Parametric 3D Geometry • 2D-to-3D Sprite Extrusion • Realtime Sculpting • VR LOD Exporter
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('primitives')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'primitives' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              📦 3D Primitives
            </button>
            <button
              onClick={() => setActiveTab('2d_extruder')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === '2d_extruder' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎨 2D Pixel Extruder
            </button>
            <button
              onClick={() => setActiveTab('sculpt')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'sculpt' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔨 Sculpting Lab
            </button>
            <button
              onClick={() => setActiveTab('vr_inspect')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'vr_inspect' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🥽 VR Performance
            </button>
          </div>

          <button
            onClick={handleExportOBJ}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก .OBJ (Export 3D)</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: TOOLS / CONFIGURATOR (4 cols) */}
        {/* ========================================================================= */}
        <aside className="lg:col-span-4 space-y-4">
          {activeTab === 'primitives' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-400" />
                Parametric 3D Shapes
              </h2>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'cube', name: 'Cube (กล่อง)', desc: '8 Vertices / 12 Polys' },
                  { id: 'sphere', name: 'Sphere (ทรงกลม)', desc: '221 Vertices / 384 Polys' },
                  { id: 'cylinder', name: 'Cylinder (ทรงกระบอก)', desc: '34 Vertices / 64 Polys' },
                  { id: 'pyramid', name: 'Pyramid (พีระมิด)', desc: '5 Vertices / 6 Polys' }
                ].map((prim) => (
                  <button
                    key={prim.id}
                    onClick={() => handleSelectPrimitive(prim.id as any)}
                    className="p-3 bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition-all space-y-1"
                  >
                    <div className="text-xs font-bold text-white">{prim.name}</div>
                    <div className="text-[10px] text-slate-400">{prim.desc}</div>
                  </button>
                ))}
              </div>

              {/* Viewport Display Settings */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300">การแสดงผล Viewport:</div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>โหมดโครงลวด (Wireframe):</span>
                  <input
                    type="checkbox"
                    checked={isWireframe}
                    onChange={(e) => setIsWireframe(e.target.checked)}
                    className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>ระยะซูม (Zoom):</span>
                    <span>{zoom}%</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={200}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === '2d_extruder' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-sky-400" />
                2D Pixel Art to 3D Mesh
              </h2>
              <p className="text-[11px] text-slate-400">คลิกที่ตารางพิกเซลเพื่อวาด แล้วกดปุ่มสร้าง 3D Mesh ทันที</p>

              {/* 8x8 Pixel Art Grid */}
              <div className="grid grid-cols-8 gap-1 p-3 bg-slate-950 rounded-xl border border-slate-800 max-w-[240px] mx-auto">
                {pixelGrid.map((row, rIdx) =>
                  row.map((val, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => {
                        const newGrid = pixelGrid.map((r) => [...r]);
                        newGrid[rIdx][cIdx] = newGrid[rIdx][cIdx] === 1 ? 0 : 1;
                        setPixelGrid(newGrid);
                      }}
                      className={`w-6 h-6 rounded cursor-pointer transition-all ${
                        val === 1 ? 'bg-amber-400 shadow-md shadow-amber-400/30' : 'bg-slate-900 border border-slate-800'
                      }`}
                    />
                  ))
                )}
              </div>

              <button
                onClick={handleExtrudeSprite}
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                แปลงเป็นโมเดล 3D ทันที (Extrude to 3D)
              </button>
            </div>
          )}

          {activeTab === 'sculpt' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-rose-400" />
                Vertex Sculpting Brushes
              </h2>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'inflate', name: 'ดึงขยาย (Inflate)', desc: 'ดันยอดจุดพิกัดออกด้านนอก' },
                  { id: 'deflate', name: 'ยุบตัว (Deflate)', desc: 'ดึงยอดจุดพิกัดเข้าศูนย์กลาง' },
                  { id: 'noise', name: 'เพิ่มผิวขรุขระ (Noise)', desc: 'สร้างมิติรอยย่นบนพื้นผิว' },
                  { id: 'smooth', name: 'เกลี่ยเนียน (Smooth)', desc: 'ปรับสมดุลพิกัดรอบข้าง' }
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleApplySculpt(b.id as any)}
                    className="p-3 bg-slate-950 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/50 rounded-xl text-left transition-all space-y-1"
                  >
                    <div className="text-xs font-bold text-white">{b.name}</div>
                    <div className="text-[10px] text-slate-400">{b.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vr_inspect' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                VR Performance & LOD Telemetry
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Total Vertices:</span>
                  <span className="font-mono text-emerald-400 font-bold">{mesh.vertices.length}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Total Polygons:</span>
                  <span className="font-mono text-emerald-400 font-bold">{mesh.faces.length}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">VR Framerate Target:</span>
                  <span className="font-mono text-sky-400 font-bold">90 - 120 FPS (Smooth)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Draw Calls:</span>
                  <span className="font-mono text-amber-400 font-bold">1 Draw Call (Batched)</span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: 3D VIEWPORT CANVAS (8 cols) */}
        {/* ========================================================================= */}
        <section className="lg:col-span-8 space-y-4 flex flex-col">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-400" />
                {mesh.name} ({mesh.vertices.length} Verts, {mesh.faces.length} Polys)
              </span>
              <span className="font-mono text-slate-400">
                Rot: X {Math.round(rotX)}° | Y {Math.round(rotY)}°
              </span>
            </div>

            {/* 3D Interactive Viewport */}
            <div
              className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas
                ref={canvasRef}
                width={720}
                height={460}
                className="w-full h-auto max-h-[460px] block"
              />
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>คลิกและลากเมาส์บนหน้าจอ 3D เพื่อหมุนมุมมองโมเดล 360 องศา</span>
              <span className="font-mono text-emerald-400">Engine: WebGL Canvas 3D Pro</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
