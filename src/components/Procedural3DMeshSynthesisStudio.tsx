/**
 * ============================================================================
 * @file Procedural3DMeshSynthesisStudio.tsx
 * @module Components/3DModeling
 * @description
 * [TH] สตูดิโอสร้างโมเดล 3 มิติเชิงขั้นตอนระดับ AAA (Procedural 3D Mesh Synthesis Studio)
 * รองรับการสร้างโมเดล 3D แบบครบวงจร:
 * 1. Architecture & Modular House (ระบบสร้างบ้าน สถาปัตยกรรม หลายชั้น หลังคา ประตู หน้าต่าง)
 * 2. Character & Monster Rigging (ตัวละคร อัศวิน ก็อบลิน ออร์ค มังกร สัตว์ประหลาด)
 * 3. Weapon Forge Engine (ดาบ คทา ธนู ค้อนศึก ขวาน ใบมีด โกร่งดาบ ด้ามจับ อัญมณี)
 * 4. Armor & Equipment Synthesizer (หมวกเกราะ เกราะอก สนับไหล่ สนับแข้ง)
 * 5. Interactive 3D Perspective Viewport (หมุน 360 องศา, Wireframe Mode, Submesh Slot, OBJ Exporter)
 *
 * [EN] Studio-grade Procedural 3D Mesh Generator with 3D interactive viewport,
 * parametric architectural grammar, creature anatomy, weapon forge & Wavefront OBJ export.
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Home,
  User,
  Shield,
  Sword,
  Download,
  RotateCcw,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import {
  Procedural3DMeshGenerator,
  ProceduralMeshData,
  HouseGenParams,
  CharacterGenParams,
  WeaponGenParams,
  ArmorGenParams
} from '../utils/Procedural3DMeshGenerator';

export default function Procedural3DMeshSynthesisStudio() {
  const [activeCategory, setActiveCategory] = useState<'Architecture' | 'Character' | 'Weapon' | 'Armor'>('Architecture');
  
  // Model Parameters
  const [houseParams, setHouseParams] = useState<HouseGenParams>({
    stories: 2,
    width: 6.0,
    length: 8.0,
    storyHeight: 2.8,
    roofType: 'Gable',
    roofHeight: 2.5,
    doorWidth: 1.2,
    doorHeight: 2.2,
    windowCountPerFloor: 4,
    balconyEnabled: true,
    chimneyEnabled: true
  });

  const [charParams, setCharParams] = useState<CharacterGenParams>({
    archetype: 'HumanoidHero',
    height: 1.85,
    torsoWidth: 0.5,
    muscleMass: 1.2,
    headScale: 1.0,
    armLength: 0.75,
    legLength: 0.9,
    hornCount: 0,
    tailLength: 0,
    wingSpan: 0
  });

  const [weaponParams, setWeaponParams] = useState<WeaponGenParams>({
    type: 'Broadsword',
    bladeLength: 1.2,
    bladeWidth: 0.14,
    bladeCurvature: 0.0,
    guardWidth: 0.35,
    hiltLength: 0.28,
    pommelSize: 0.08,
    gemSockets: 1,
    runicEngravings: true
  });

  const [armorParams, setArmorParams] = useState<ArmorGenParams>({
    slot: 'Cuirass',
    style: 'PlateKnight',
    thickness: 0.04,
    spikeLength: 0.1,
    trimWidth: 0.02
  });

  const [currentMesh, setCurrentMesh] = useState<ProceduralMeshData | null>(null);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [rotationY, setRotationY] = useState<number>(45);
  const [rotationX, setRotationX] = useState<number>(20);
  const [zoom, setZoom] = useState<number>(35);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Generate Current Mesh
  const regenerateMesh = () => {
    let mesh: ProceduralMeshData;
    if (activeCategory === 'Architecture') {
      mesh = Procedural3DMeshGenerator.generateHouse(houseParams);
    } else if (activeCategory === 'Character') {
      mesh = Procedural3DMeshGenerator.generateCharacter(charParams);
    } else if (activeCategory === 'Weapon') {
      mesh = Procedural3DMeshGenerator.generateWeapon(weaponParams);
    } else {
      mesh = Procedural3DMeshGenerator.generateArmor(armorParams);
    }
    setCurrentMesh(mesh);
  };

  useEffect(() => {
    regenerateMesh();
  }, [activeCategory, houseParams, charParams, weaponParams, armorParams]);

  // Render 3D Wireframe / Shaded Canvas Viewport
  useEffect(() => {
    if (!currentMesh || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = 640;
    const height = canvas.height = 540;

    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Floor
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const gridSpan = 10;
    const gridStep = 1;

    const project = (x: number, y: number, z: number): [number, number, number] => {
      // Rotation Y
      const radY = (rotationY * Math.PI) / 180;
      const x1 = x * Math.cos(radY) + z * Math.sin(radY);
      const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

      // Rotation X
      const radX = (rotationX * Math.PI) / 180;
      const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

      // Perspective Projection
      const dist = 12.0;
      const fov = zoom * 10;
      const pz = z2 + dist;
      if (pz <= 0.1) return [-9999, -9999, -1];

      const px = width * 0.5 + (x1 / pz) * fov;
      const py = height * 0.65 - (y2 / pz) * fov;
      return [px, py, pz];
    };

    // Draw Floor Grid
    for (let gx = -gridSpan; gx <= gridSpan; gx += gridStep) {
      const p1 = project(gx, 0, -gridSpan);
      const p2 = project(gx, 0, gridSpan);
      if (p1[2] > 0 && p2[2] > 0) {
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      }
    }
    for (let gz = -gridSpan; gz <= gridSpan; gz += gridStep) {
      const p1 = project(-gridSpan, 0, gz);
      const p2 = project(gridSpan, 0, gz);
      if (p1[2] > 0 && p2[2] > 0) {
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      }
    }

    // Render Triangles
    const v = currentMesh.vertices;
    const ind = currentMesh.indices;

    ctx.strokeStyle = isWireframe ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 0.8;

    for (let i = 0; i < ind.length; i += 3) {
      const i1 = ind[i] * 3;
      const i2 = ind[i + 1] * 3;
      const i3 = ind[i + 2] * 3;

      const p1 = project(v[i1], v[i1 + 1], v[i1 + 2]);
      const p2 = project(v[i2], v[i2 + 1], v[i2 + 2]);
      const p3 = project(v[i3], v[i3 + 1], v[i3 + 2]);

      if (p1[2] > 0 && p2[2] > 0 && p3[2] > 0) {
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.lineTo(p3[0], p3[1]);
        ctx.closePath();

        if (!isWireframe) {
          // Fake Simple Lambertian Shade
          const nx = currentMesh.normals[i1];
          const ny = currentMesh.normals[i1 + 1];
          const nz = currentMesh.normals[i1 + 2];
          const light = Math.max(0.15, ny * 0.6 + nx * 0.4 + 0.3);
          const colorVal = Math.floor(light * 180);
          ctx.fillStyle = `rgb(${Math.floor(colorVal * 0.7)}, ${colorVal}, ${Math.floor(colorVal * 1.1)})`;
          ctx.fill();
        }
        ctx.stroke();
      }
    }
  }, [currentMesh, isWireframe, rotationX, rotationY, zoom]);

  // Export to OBJ
  const handleExportOBJ = () => {
    if (!currentMesh) return;
    const objData = Procedural3DMeshGenerator.exportToOBJ(currentMesh);
    const blob = new Blob([objData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentMesh.name}.obj`;
    a.click();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    setRotationY(r => r + dx * 0.6);
    setRotationX(r => Math.max(-80, Math.min(80, r - dy * 0.6)));
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0f19] text-gray-200 overflow-hidden font-sans select-none">
      {/* Header */}
      <div className="h-14 bg-[#111827] border-b border-gray-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/40 rounded-xl text-blue-400">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide text-base">Procedural 3D Mesh Synthesis Studio</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                Parametric Mesh Engine
              </span>
            </div>
            <p className="text-xs text-gray-400">Modular Houses • Rigged Characters • Monster Titans • Weapons & Armor Forge</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setRotationX(20); setRotationY(45); setZoom(35); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs font-medium border border-gray-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Camera
          </button>
          <button
            onClick={handleExportOBJ}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-900/30 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Export Wavefront (.OBJ)
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Category Tabs & Parameters */}
        <div className="w-80 bg-[#0f172a] border-r border-gray-800 flex flex-col p-4 gap-4 overflow-y-auto shrink-0">
          {/* Category Selector */}
          <div className="grid grid-cols-2 gap-1.5 bg-gray-900/80 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setActiveCategory('Architecture')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeCategory === 'Architecture' ? 'bg-blue-600 text-white font-semibold shadow' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              House / Building
            </button>
            <button
              onClick={() => setActiveCategory('Character')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeCategory === 'Character' ? 'bg-blue-600 text-white font-semibold shadow' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Creature / Rig
            </button>
            <button
              onClick={() => setActiveCategory('Weapon')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeCategory === 'Weapon' ? 'bg-blue-600 text-white font-semibold shadow' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Sword className="w-3.5 h-3.5" />
              Weapon Forge
            </button>
            <button
              onClick={() => setActiveCategory('Armor')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeCategory === 'Armor' ? 'bg-blue-600 text-white font-semibold shadow' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Armor Suite
            </button>
          </div>

          {/* Architecture Parameters */}
          {activeCategory === 'Architecture' && (
            <div className="space-y-3 text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider block">Modular Building Controls</span>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Floors / Stories (จำนวนชั้น)</span>
                  <span className="text-blue-400 font-mono">{houseParams.stories}</span>
                </div>
                <input
                  type="range" min="1" max="5" value={houseParams.stories}
                  onChange={e => setHouseParams(p => ({ ...p, stories: parseInt(e.target.value) }))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Width (ความกว้าง)</span>
                  <span className="text-blue-400 font-mono">{houseParams.width}m</span>
                </div>
                <input
                  type="range" min="4" max="14" step="0.5" value={houseParams.width}
                  onChange={e => setHouseParams(p => ({ ...p, width: parseFloat(e.target.value) }))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Roof Height (ความสูงหลังคา)</span>
                  <span className="text-blue-400 font-mono">{houseParams.roofHeight}m</span>
                </div>
                <input
                  type="range" min="1.0" max="5.0" step="0.2" value={houseParams.roofHeight}
                  onChange={e => setHouseParams(p => ({ ...p, roofHeight: parseFloat(e.target.value) }))}
                  className="w-full accent-blue-500"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox" checked={houseParams.chimneyEnabled}
                  onChange={e => setHouseParams(p => ({ ...p, chimneyEnabled: e.target.checked }))}
                  className="rounded bg-gray-900 border-gray-700 text-blue-600"
                />
                <span className="text-gray-300">Enable Brick Chimney (ปล่องไฟ)</span>
              </label>
            </div>
          )}

          {/* Character Parameters */}
          {activeCategory === 'Character' && (
            <div className="space-y-3 text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider block">Anatomy Archetype</span>
              <select
                value={charParams.archetype}
                onChange={e => setCharParams(p => ({ ...p, archetype: e.target.value as any }))}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value="HumanoidHero">Humanoid Hero (อัศวินมนุษย์)</option>
                <option value="GoblinMonster">Goblin Monster (ก็อบลินร่างเล็ก)</option>
                <option value="OrcBrute">Orc Brute (ออร์คยักษ์กล้ามโต)</option>
                <option value="DragonBeast">Dragon Beast (มังกรบรรพกาล)</option>
              </select>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Muscle Mass / Bulk</span>
                  <span className="text-blue-400 font-mono">{charParams.muscleMass.toFixed(1)}x</span>
                </div>
                <input
                  type="range" min="0.8" max="2.5" step="0.1" value={charParams.muscleMass}
                  onChange={e => setCharParams(p => ({ ...p, muscleMass: parseFloat(e.target.value) }))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          )}

          {/* Weapon Parameters */}
          {activeCategory === 'Weapon' && (
            <div className="space-y-3 text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider block">Forge Arsenal Type</span>
              <select
                value={weaponParams.type}
                onChange={e => setWeaponParams(p => ({ ...p, type: e.target.value as any }))}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value="Broadsword">Broadsword (ดาบเหล็กกล้า)</option>
                <option value="BattleAxe">Battle Axe (ขวานศึกจอมพลัง)</option>
                <option value="Warhammer">Warhammer (ค้อนศึกทำลายล้าง)</option>
                <option value="MagicStaff">Magic Staff (คทาเวทมนตร์โบราณ)</option>
              </select>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Blade/Head Length</span>
                  <span className="text-blue-400 font-mono">{weaponParams.bladeLength.toFixed(2)}m</span>
                </div>
                <input
                  type="range" min="0.6" max="2.0" step="0.05" value={weaponParams.bladeLength}
                  onChange={e => setWeaponParams(p => ({ ...p, bladeLength: parseFloat(e.target.value) }))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          )}

          {/* Armor Parameters */}
          {activeCategory === 'Armor' && (
            <div className="space-y-3 text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider block">Armor Slot & Style</span>
              <select
                value={armorParams.slot}
                onChange={e => setArmorParams(p => ({ ...p, slot: e.target.value as any }))}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value="Cuirass">Cuirass (เกราะอก Breastplate)</option>
                <option value="Helmet">Helmet (หมวกเกราะ Greathelm)</option>
                <option value="Pauldron">Pauldron (สนับไหล่ Pauldrons)</option>
                <option value="Gauntlets">Gauntlets (ปลอกแขนเหล็ก)</option>
              </select>
            </div>
          )}

          {/* Mesh Telemetry Info */}
          {currentMesh && (
            <div className="mt-auto p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-[11px] space-y-1.5">
              <div className="font-semibold text-gray-300 flex items-center justify-between">
                <span>Mesh Topology</span>
                <span className="text-blue-400 font-mono">{currentMesh.polyCount.toLocaleString()} Polys</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Vertices:</span>
                <span className="text-gray-200">{currentMesh.vertexCount.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Submesh Slots:</span>
                <span className="text-blue-300">{currentMesh.subMeshes.length} slots</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: 3D Perspective Viewport */}
        <div className="flex-1 flex flex-col bg-[#050811] relative overflow-hidden">
          {/* Top Control Bar */}
          <div className="h-10 bg-[#0d1322] border-b border-gray-800 px-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWireframe(!isWireframe)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                  isWireframe ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {isWireframe ? 'Wireframe Mode' : 'Shaded Solid'}
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
              <span>Zoom: {zoom}%</span>
              <span>Rot: [{rotationX.toFixed(0)}°, {rotationY.toFixed(0)}°]</span>
            </div>
          </div>

          {/* 3D Canvas */}
          <div
            className="flex-1 flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={e => setZoom(z => Math.max(15, Math.min(80, z - e.deltaY * 0.05)))}
          >
            <canvas ref={canvasRef} className="rounded-xl border border-gray-800 shadow-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
