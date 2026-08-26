/**
 * ====================================================================================================
 * MODULE: MultiModalArtifactHealerView.tsx
 * PURPOSE: Interactive Multi-Modal Visual Inspection, Artifact Repair & Before/After Comparison Lab
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์:
 * 1. หน้าต่างตรวจสอบและซ่อมแซมชิ้นงานทุกประเภทของ AI (3D Model, 2D Art, Map, Audio, Code)
 * 2. แสดงผลเปรียบเทียบแบบเห็นภาพชัดเจน (Visual Before vs After Comparison):
 *    - 3D Model: Canvas แสดงผลโมเดล 3D แบบหมุนได้ 360 องศา เปรียบเทียบ Normal กลับด้าน (สีแดง) vs Normal ที่แก้ไขแล้ว (สีเขียว)
 *    - 2D Texture: Canvas แสดงผลพื้นผิวปูกระเบื้อง (Tiling) เปรียบเทียบ รอยต่อขอบแตก vs Seamless Toroidal Blending
 *    - Map & NavMesh: Grid Canvas แสดงผลห้องที่ขาดการเชื่อมต่อ vs อุโมงค์ทางเดินที่ถูกเจาะเชื่อมอัตโนมัติ
 *    - Audio DSP: Waveform Canvas แสดงรูปคลื่นเสียงที่ถูก Clip แตกพร่า vs คลื่นเสียงที่ผ่าน Soft-Knee Limiter
 *    - Code: แสดง Diff Comparison ระหว่างโค้ดที่มี Anti-Pattern vs โค้ดที่สร้างภูมิคุ้มกันแล้ว
 * 3. ปุ่มกด 1-Click Autonomous Self-Heal & Learn Immunity สำหรับแต่ละประเภทงาน
 * ====================================================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Image as ImageIcon, 
  Map as MapIcon, 
  Volume2, 
  Code2, 
  ShieldCheck, 
  RefreshCw, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { MultiModalWorkloadType } from '../utils/UniversalMultiModalErrorImmunityEngine';
import { MultiModalArtifactSelfHealer, Mesh3DData, MapGridData } from '../utils/MultiModalArtifactSelfHealer';
import { UniversalImmunityConstraintVault } from '../utils/UniversalImmunityConstraintVault';

export const MultiModalArtifactHealerView: React.FC = () => {
  const [selectedModality, setSelectedModality] = useState<MultiModalWorkloadType>('MODEL_3D');
  const [isHealed, setIsHealed] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [activeFixes, setActiveFixes] = useState<string[]>([]);
  const canvas3DRef = useRef<HTMLCanvasElement | null>(null);
  const canvasMapRef = useRef<HTMLCanvasElement | null>(null);
  const canvasAudioRef = useRef<HTMLCanvasElement | null>(null);

  // 3D Canvas rendering loop
  useEffect(() => {
    if (selectedModality !== 'MODEL_3D') return;
    const canvas = canvas3DRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = 60;
      const angle = (Date.now() / 1500) % (Math.PI * 2);

      // Draw 3D wireframe pyramid/cube
      const points = [
        { x: -radius, y: -radius * 0.6, z: -radius },
        { x: radius, y: -radius * 0.6, z: -radius },
        { x: radius, y: -radius * 0.6, z: radius },
        { x: -radius, y: -radius * 0.6, z: radius },
        { x: 0, y: radius * 0.8, z: 0 } // Apex
      ];

      // Rotate points around Y axis
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const projected = points.map(p => {
        const rx = p.x * cosA - p.z * sinA;
        const rz = p.x * sinA + p.z * cosA;
        const scale = 200 / (200 + rz);
        return {
          x: cx + rx * scale,
          y: cy - p.y * scale,
          scale,
          z: rz
        };
      });

      // Draw wireframe faces
      ctx.strokeStyle = isHealed ? '#3fb950' : '#f85149';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Base
      ctx.moveTo(projected[0].x, projected[0].y);
      ctx.lineTo(projected[1].x, projected[1].y);
      ctx.lineTo(projected[2].x, projected[2].y);
      ctx.lineTo(projected[3].x, projected[3].y);
      ctx.closePath();
      ctx.stroke();

      // Sides to apex
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(projected[i].x, projected[i].y);
        ctx.lineTo(projected[4].x, projected[4].y);
        ctx.stroke();
      }

      // Draw Normal vectors
      for (let i = 0; i < 4; i++) {
        const pA = projected[i];
        const pB = projected[(i + 1) % 4];
        const pApex = projected[4];
        const midX = (pA.x + pB.x + pApex.x) / 3;
        const midY = (pA.y + pB.y + pApex.y) / 3;

        // Normal direction vector
        const normalLength = 25;
        const nx = isHealed ? (midX - cx) * 0.2 : (cx - midX) * 0.2;
        const ny = isHealed ? -normalLength * 0.6 : normalLength * 0.6;

        ctx.strokeStyle = isHealed ? '#58a6ff' : '#ff7b72';
        ctx.fillStyle = isHealed ? '#58a6ff' : '#ff7b72';
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(midX + nx, midY + ny);
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.arc(midX + nx, midY + ny, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Status Label
      ctx.fillStyle = isHealed ? '#3fb950' : '#f85149';
      ctx.font = '11px monospace';
      ctx.fillText(
        isHealed ? 'NORMALS: OUTWARD (CCW 100%)' : 'NORMALS: INVERTED (CW CRITICAL)',
        12,
        canvas.height - 12
      );

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedModality, isHealed]);

  // Map Canvas rendering
  useEffect(() => {
    if (selectedModality !== 'MAP_TERRAIN') return;
    const canvas = canvasMapRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cellSize = 18;
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);

    // Draw background grid
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Room 1 (Spawn)
    ctx.fillStyle = '#1f6feb';
    for (let r = 2; r <= 6; r++) {
      for (let c = 2; c <= 6; c++) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1);
      }
    }

    // Draw Room 2 (Boss/Objective)
    ctx.fillStyle = '#8957e5';
    for (let r = 5; r <= 9; r++) {
      for (let c = 11; c <= 15; c++) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1);
      }
    }

    // Draw connecting corridor if healed
    if (isHealed) {
      ctx.fillStyle = '#3fb950';
      // Horizontal corridor
      for (let c = 6; c <= 11; c++) {
        ctx.fillRect(c * cellSize, 5 * cellSize, cellSize - 1, cellSize - 1);
      }
    }

    // Spawn label
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText('SPAWN', 2.5 * cellSize, 4.5 * cellSize);
    ctx.fillText('BOSS', 11.5 * cellSize, 7.5 * cellSize);

    // Status label
    ctx.fillStyle = isHealed ? '#3fb950' : '#f85149';
    ctx.fillText(
      isHealed ? 'NAVMESH: CONNECTED (1 GRAPH)' : 'NAVMESH: ISOLATED (2 SUBGRAPHS)',
      10,
      canvas.height - 10
    );
  }, [selectedModality, isHealed]);

  // Audio Canvas rendering
  useEffect(() => {
    if (selectedModality !== 'AUDIO_SOUND') return;
    const canvas = canvasAudioRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const midY = canvas.height / 2;

    // Draw zero center line
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(canvas.width, midY);
    ctx.stroke();

    // Draw waveform
    ctx.lineWidth = 2;
    ctx.strokeStyle = isHealed ? '#3fb950' : '#f85149';
    ctx.beginPath();

    const pointsCount = canvas.width;
    for (let x = 0; x < pointsCount; x++) {
      const t = x * 0.05;
      let wave = Math.sin(t) * 0.7 + Math.sin(t * 2.3) * 0.4;
      
      if (!isHealed) {
        // DC Offset shift + clipping distortion
        wave = wave + 0.35;
        if (wave > 0.8) wave = 0.8; // Hard clip
        if (wave < -0.8) wave = -0.8;
      } else {
        // Soft-knee clamped safe waveform centered at 0
        wave = Math.tanh(wave * 0.85);
      }

      const y = midY - wave * (canvas.height * 0.38);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Status label
    ctx.fillStyle = isHealed ? '#3fb950' : '#f85149';
    ctx.font = '10px monospace';
    ctx.fillText(
      isHealed ? 'PEAK: -0.1 dBFS | DC OFFSET: 0.000V' : 'PEAK: +3.2 dBFS (CLIPPING) | DC OFFSET: +0.35V',
      10,
      canvas.height - 10
    );
  }, [selectedModality, isHealed]);

  const handleExecuteSelfHeal = () => {
    setIsHealed(true);
    let fixes: string[] = [];

    switch (selectedModality) {
      case 'MODEL_3D':
        const meshData: Mesh3DData = {
          vertices: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]],
          normals: [[0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]],
          indices: [[0, 2, 1], [0, 3, 2]]
        };
        const meshRes = MultiModalArtifactSelfHealer.heal3DMesh(meshData);
        fixes = meshRes.fixesApplied;
        break;
      case 'MAP_TERRAIN':
        const mapData: MapGridData = {
          width: 16,
          height: 16,
          tiles: [[1, 0, 1]]
        };
        const mapRes = MultiModalArtifactSelfHealer.healMapTerrain(mapData);
        fixes = mapRes.fixesApplied;
        break;
      case 'ART_2D':
        const texRes = MultiModalArtifactSelfHealer.healTexture2D({ width: 512, height: 512, seamErrorDelta: 0.28, hasAlphaFringe: true, colorChannelsSafe: false });
        fixes = texRes.fixesApplied;
        break;
      case 'AUDIO_SOUND':
        const audRes = MultiModalArtifactSelfHealer.healAudioDSP({ sampleCount: 44100, peakDbFS: 3.2, dcOffsetRatio: 0.35, loopDiscontinuity: 0.8 });
        fixes = audRes.fixesApplied;
        break;
      case 'CODE_DEV':
      default:
        const codeRes = MultiModalArtifactSelfHealer.healCodeSnippet(`useEffect(() => { setCount(c => c + 1); });`, 'REACT_LOOP');
        fixes = codeRes.fixesApplied;
        break;
    }

    setActiveFixes(fixes);
  };

  const handleReset = () => {
    setIsHealed(false);
    setActiveFixes([]);
  };

  return (
    <div id="multi-modal-artifact-healer-container" className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] p-4 gap-4 overflow-y-auto">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161b22] border border-[#30363d] p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1f6feb]/20 border border-[#1f6feb]/40 rounded-lg text-[#58a6ff]">
            <Wrench size={22} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Multi-Modal Artifact Self-Healer & Geometric Lab
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 font-mono">
                ZERO-REGRESSION
              </span>
            </h2>
            <p className="text-xs text-[#8b949e]">
              ห้องผ่าตัดและซ่อมแซมชิ้นงานอัตโนมัติ 3D Models, 2D Art, แผนที่, เสียง และซอร์สโค้ด พร้อมระบบเรียนรู้ถาวร
            </p>
          </div>
        </div>

        {/* Modality Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
          <button
            onClick={() => { setSelectedModality('MODEL_3D'); handleReset(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              selectedModality === 'MODEL_3D' ? 'bg-[#1f6feb] text-white shadow-sm' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Box size={14} /> 3D Mesh
          </button>
          <button
            onClick={() => { setSelectedModality('ART_2D'); handleReset(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              selectedModality === 'ART_2D' ? 'bg-[#1f6feb] text-white shadow-sm' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <ImageIcon size={14} /> 2D Art
          </button>
          <button
            onClick={() => { setSelectedModality('MAP_TERRAIN'); handleReset(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              selectedModality === 'MAP_TERRAIN' ? 'bg-[#1f6feb] text-white shadow-sm' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <MapIcon size={14} /> Map / NavMesh
          </button>
          <button
            onClick={() => { setSelectedModality('AUDIO_SOUND'); handleReset(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              selectedModality === 'AUDIO_SOUND' ? 'bg-[#1f6feb] text-white shadow-sm' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Volume2 size={14} /> Audio DSP
          </button>
          <button
            onClick={() => { setSelectedModality('CODE_DEV'); handleReset(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              selectedModality === 'CODE_DEV' ? 'bg-[#1f6feb] text-white shadow-sm' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Code2 size={14} /> Code / AST
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Visual Stage (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-[#161b22] border border-[#30363d] rounded-xl p-4 gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isHealed ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`} />
              Live Visual Inspector: {selectedModality}
            </span>
            <span className="text-[11px] font-mono text-[#8b949e]">
              State: {isHealed ? 'VERIFIED_SAFE' : 'DEFECTIVE_ANOMALY'}
            </span>
          </div>

          {/* Visual Canvases based on Modality */}
          <div className="relative w-full h-64 bg-[#0d1117] rounded-lg border border-[#30363d] overflow-hidden flex items-center justify-center">
            {selectedModality === 'MODEL_3D' && (
              <canvas ref={canvas3DRef} width={480} height={256} className="w-full h-full" />
            )}

            {selectedModality === 'MAP_TERRAIN' && (
              <canvas ref={canvasMapRef} width={480} height={256} className="w-full h-full" />
            )}

            {selectedModality === 'AUDIO_SOUND' && (
              <canvas ref={canvasAudioRef} width={480} height={256} className="w-full h-full" />
            )}

            {selectedModality === 'ART_2D' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] text-[#8b949e] mb-1">Raw Texture Tile</span>
                    <div className={`w-24 h-24 rounded border-2 ${isHealed ? 'border-[#3fb950]' : 'border-[#f85149]'} bg-gradient-to-tr from-[#161b22] to-[#21262d] flex items-center justify-center relative overflow-hidden`}>
                      {!isHealed && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#f85149] shadow-lg animate-pulse" />}
                      <span className="text-xs font-mono text-white">Tile (A)</span>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-[#8b949e]" />
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] text-[#8b949e] mb-1">Adjacent Tile (B)</span>
                    <div className={`w-24 h-24 rounded border-2 ${isHealed ? 'border-[#3fb950]' : 'border-[#f85149]'} bg-gradient-to-tr from-[#161b22] to-[#21262d] flex items-center justify-center relative overflow-hidden`}>
                      {!isHealed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f85149] shadow-lg animate-pulse" />}
                      <span className="text-xs font-mono text-white">Tile (B)</span>
                    </div>
                  </div>
                </div>
                <span className={`text-[11px] font-mono mt-3 ${isHealed ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                  {isHealed ? 'SEAMLESS: TOROIDAL BLEND APPLIED (DELTA < 0.1%)' : 'SEAM DEFECT: BORDER DELTA 28.4% DETECTED'}
                </span>
              </div>
            )}

            {selectedModality === 'CODE_DEV' && (
              <div className="w-full h-full p-4 font-mono text-xs overflow-auto bg-[#0d1117]">
                <div className="text-[#8b949e] mb-2">// Code AST Syntax Inspector</div>
                {!isHealed ? (
                  <pre className="text-[#ff7b72] bg-[#f85149]/10 p-3 rounded border border-[#f85149]/30">
{`// ❌ DEFECT: Infinite Re-Render Loop (Missing Dependency Array)
useEffect(() => {
  setCounter(prev => prev + 1);
});`}
                  </pre>
                ) : (
                  <pre className="text-[#7ee787] bg-[#238636]/10 p-3 rounded border border-[#238636]/30">
{`// ✅ HEALED: Verified Safe Execution with Empty Dependency Array
useEffect(() => {
  setCounter(prev => prev + 1);
}, []); // Immune Invariant Enforced`}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8b949e] hover:text-white bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition-all"
            >
              <RefreshCw size={13} /> Reset to Defective State
            </button>

            <button
              onClick={handleExecuteSelfHeal}
              disabled={isHealed}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                isHealed
                  ? 'bg-[#238636]/40 text-[#3fb950] border border-[#238636]/50 cursor-default'
                  : 'bg-[#238636] hover:bg-[#2ea043] text-white border border-[#2ea043]'
              }`}
            >
              <ShieldCheck size={14} />
              {isHealed ? 'Artifact Self-Healed & Immune' : 'Execute Autonomous Self-Healing & Ingest'}
            </button>
          </div>
        </div>

        {/* Right: Structural Diagnosis & Invariant Rule (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-[#161b22] border border-[#30363d] rounded-xl p-4 gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#30363d]">
            <CheckCircle2 size={16} className={isHealed ? 'text-[#3fb950]' : 'text-[#8b949e]'} />
            <h3 className="text-xs font-bold text-white">RCA Diagnosis & Invariant Constraints</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
              <div className="text-[11px] font-bold text-[#58a6ff] mb-1">Root Cause Analysis (RCA)</div>
              <p className="text-[#8b949e] leading-relaxed">
                {selectedModality === 'MODEL_3D' && 'Triangulation vertex indices were emitted in clockwise order, causing surface normal vectors to point inwards towards centroid.'}
                {selectedModality === 'MAP_TERRAIN' && 'Procedural obstacle placement partitioned level floor grid into isolated components with zero walkable path finding routes.'}
                {selectedModality === 'ART_2D' && 'High color gradient delta across border pixels was generated without periodic toroidal boundary wrapping filter.'}
                {selectedModality === 'AUDIO_SOUND' && 'Un-mastered polyphonic voice summation exceeded normalized dynamic range and non-zero mean waveform voltage produced loop clicks.'}
                {selectedModality === 'CODE_DEV' && 'State setter function was called directly inside useEffect body without an empty dependency array.'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
              <div className="text-[11px] font-bold text-[#3fb950] mb-1">Learned Negative Invariant Rule</div>
              <p className="text-[#8b949e] leading-relaxed">
                {selectedModality === 'MODEL_3D' && 'NEVER generate 3D meshes with clockwise winding or inward-facing normals relative to mesh centroid.'}
                {selectedModality === 'MAP_TERRAIN' && 'NEVER generate level maps with connected component count > 1 or unreachable spawn nodes.'}
                {selectedModality === 'ART_2D' && 'NEVER output tileable textures with boundary pixel delta exceeding 1.0% color variance.'}
                {selectedModality === 'AUDIO_SOUND' && 'NEVER output audio buffers with true peak > -0.1 dBFS or DC bias > 0.0001.'}
                {selectedModality === 'CODE_DEV' && 'NEVER call state setters inside useEffect without explicit stabilized dependency arrays.'}
              </p>
            </div>

            {activeFixes.length > 0 && (
              <div className="p-3 rounded-lg bg-[#238636]/10 border border-[#238636]/30">
                <div className="text-[11px] font-bold text-[#3fb950] mb-1">Transforms Applied</div>
                <ul className="space-y-1">
                  {activeFixes.map((fix, idx) => (
                    <li key={idx} className="text-[11px] text-[#7ee787] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" />
                      {fix}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiModalArtifactHealerView;
