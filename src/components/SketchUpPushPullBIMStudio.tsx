/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Trimble SketchUp Push/Pull & BIM Architectural Studio (SketchUp parity).
 *          Features 3D viewport with RGB axis inferences, interactive Push/Pull
 *          wall extrusions, Section Plane clipping, IFC BIM entity tree, and
 *          On-Device Offline AI architectural floorplan synthesizers.
 *    - TH: สตูดิโอจำลองเครื่องมือ SketchUp Push/Pull & BIM Architecture
 *          (เทียบเท่า Trimble SketchUp Pro)
 *          ระนาบ 3 มิติพร้อมเส้นแกนสีแดง/เขียว/น้ำเงิน (Axes Inferences), เครื่องมือยืดหดระนาบ
 *          Push/Pull, การตัดผ่าอาคารแบบเรียลไทม์ (Section Slicing Plane), รายการโครงสร้างอาคาร BIM
 *          และ AI ออฟไลน์ในการจัดแปลนบ้านสไตล์ Modern, Thai Tropical, และ Nordic
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `sketchUpBIMTypes.ts` and `SketchUpBIMEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Maximize2,
  Minimize2,
  Layers,
  Scissors,
  Eye,
  Sliders,
  Sparkles,
  Wand2,
  CheckCircle2,
  Building,
  Ruler
} from 'lucide-react';
import { sketchUpBIMEngine } from '../utils/SketchUpBIMEngineNode';
import { SketchUpBIMProfile } from '../types/sketchUpBIMTypes';

interface SketchUpStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function SketchUpPushPullBIMStudio({ onSelectTool }: SketchUpStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [profile, setProfile] = useState<SketchUpBIMProfile>(() => sketchUpBIMEngine.getProfile());
  const [selectedEntityId, setSelectedEntityId] = useState<string>('wall_ext_north');
  const [cameraRot, setCameraRot] = useState<number>(0.75);

  useEffect(() => {
    return sketchUpBIMEngine.subscribe(() => {
      setProfile({ ...sketchUpBIMEngine.getProfile() });
    });
  }, []);

  // 3D Isometric Viewport Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#f8fafc'; // SketchUp crisp architectural viewport style
    ctx.fillRect(0, 0, width, height);

    const originX = width / 2;
    const originY = height / 2 + 60;

    // Draw SketchUp Axes (Red = X, Green = Y (Depth), Blue = Z (Up))
    const drawAxis = (angleRad: number, color: string, label: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + Math.cos(angleRad) * 280, originY + Math.sin(angleRad) * 280);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(label, originX + Math.cos(angleRad) * 290, originY + Math.sin(angleRad) * 290);
    };

    drawAxis(0.5, '#ef4444', 'Red Axis (X)');
    drawAxis(2.6, '#22c55e', 'Green Axis (Y)');
    drawAxis(-Math.PI / 2, '#3b82f6', 'Blue Axis (Z)');

    // Render BIM Entities (Walls, Doors, Windows, Slabs)
    profile.entities.forEach(ent => {
      const isSelected = ent.id === selectedEntityId;
      const isoX = originX + ent.xMeters * 28 - ent.zMeters * 18;
      const isoY = originY + ent.xMeters * 14 + ent.zMeters * 10 - ent.yMeters * 20;
      const hPx = ent.heightMeters * 24;

      // Section Cut check
      if (profile.sectionPlaneActive && ent.heightMeters > profile.sectionCutHeightMeters) {
        ctx.fillStyle = '#fca5a5'; // Section cut hatch
      } else {
        ctx.fillStyle = isSelected ? '#38bdf8' : ent.materialColor;
      }

      ctx.strokeStyle = isSelected ? '#0284c7' : '#1e293b';
      ctx.lineWidth = isSelected ? 2.5 : 1.2;

      // Draw 3D Extruded Block
      ctx.beginPath();
      ctx.rect(isoX, isoY - hPx, ent.widthMeters * 20, hPx);
      ctx.fill();
      ctx.stroke();

      // Top face
      ctx.beginPath();
      ctx.moveTo(isoX, isoY - hPx);
      ctx.lineTo(isoX + 15, isoY - hPx - 10);
      ctx.lineTo(isoX + ent.widthMeters * 20 + 15, isoY - hPx - 10);
      ctx.lineTo(isoX + ent.widthMeters * 20, isoY - hPx);
      ctx.closePath();
      ctx.fillStyle = isSelected ? '#7dd3fc' : '#cbd5e1';
      ctx.fill();
      ctx.stroke();
    });

    // Draw Section Plane Line if active
    if (profile.sectionPlaneActive) {
      const cutY = originY - profile.sectionCutHeightMeters * 24;
      ctx.strokeStyle = '#ef4444';
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX - 250, cutY);
      ctx.lineTo(originX + 250, cutY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`Section Plane Cut @ ${profile.sectionCutHeightMeters.toFixed(1)}m`, originX - 240, cutY - 6);
    }

  }, [profile, selectedEntityId, cameraRot]);

  const selectedEntity = profile.entities.find(e => e.id === selectedEntityId);

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1b253b] bg-[#0f172a] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-red-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
            <Home size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                SketchUp Push/Pull & BIM Architectural Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 text-[10px] font-bold border border-amber-500/40 font-mono">
                Trimble SketchUp & BIM Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Face Push/Pull extrusions, Axis Inferences, Real-time Section Plane Slicing, and On-Device Offline AI Floorplan synthesis.
            </p>
          </div>
        </div>

        {/* Section Cut Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => sketchUpBIMEngine.setSectionPlane(!profile.sectionPlaneActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              profile.sectionPlaneActive
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#334155]'
            }`}
          >
            <Scissors size={13} />
            {profile.sectionPlaneActive ? 'Section Plane [ON]' : 'Section Plane [OFF]'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1b253b] bg-[#0b0f19] relative">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0f172a]/80 backdrop-blur flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <Building size={13} className="text-amber-400" />
              Project: {profile.projectName}
            </span>

            <span className="text-amber-400 font-bold">
              Total Floor Area: {profile.totalSquareMeters} m²
            </span>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={440}
              className="max-w-full max-h-full rounded-lg shadow-inner"
            />
          </div>

          {/* Push/Pull Control Bar */}
          <div className="p-3 border-t border-[#1b253b] bg-[#0f172a] flex items-center justify-between text-xs font-mono">
            {selectedEntity ? (
              <div className="flex items-center gap-4">
                <span className="text-white font-bold">
                  Extruding: <span className="text-cyan-400">{selectedEntity.name}</span> ({selectedEntity.heightMeters.toFixed(2)}m)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => sketchUpBIMEngine.pushPullEntity(selectedEntity.id, 0.2)}
                    className="px-2.5 py-1 rounded bg-[#1e293b] hover:bg-[#334155] text-white font-bold cursor-pointer border border-[#334155]"
                  >
                    + Push Up (0.2m)
                  </button>
                  <button
                    onClick={() => sketchUpBIMEngine.pushPullEntity(selectedEntity.id, -0.2)}
                    className="px-2.5 py-1 rounded bg-[#1e293b] hover:bg-[#334155] text-white font-bold cursor-pointer border border-[#334155]"
                  >
                    - Pull Down (0.2m)
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-[#94a3b8]">Click an element in the BIM Tree to Push/Pull.</span>
            )}

            {profile.sectionPlaneActive && (
              <div className="flex items-center gap-2">
                <span className="text-rose-400">Cut Plane Height:</span>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={profile.sectionCutHeightMeters}
                  onChange={(e) => sketchUpBIMEngine.setSectionPlane(true, parseFloat(e.target.value))}
                  className="w-28 accent-rose-500 h-1.5 bg-[#1e293b] rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

        </div>

        {/* BIM HIERARCHY & OFFLINE AI (4 cols) */}
        <div className="lg:col-span-4 bg-[#0a0e1a] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0f172a] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-amber-400" /> IFC BIM Element Tree
            </span>
            <span className="text-[10px] font-mono text-amber-400">IFC4 Standard</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Entity List */}
            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#1e293b] space-y-1.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                BIM Entities
              </span>

              {profile.entities.map(ent => (
                <div
                  key={ent.id}
                  onClick={() => setSelectedEntityId(ent.id)}
                  className={`p-2 rounded-lg text-xs font-mono flex items-center justify-between cursor-pointer border transition-all ${
                    selectedEntityId === ent.id
                      ? 'bg-amber-950/40 border-amber-500/50 text-white'
                      : 'bg-[#131d31] border-[#1e293b] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <span className="truncate">{ent.name}</span>
                  <span className="text-[10px] font-bold text-cyan-400">{ent.type}</span>
                </div>
              ))}
            </div>

            {/* Offline AI Architecture Synthesizer */}
            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#1e293b] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Offline AI Architectural Synthesis
              </span>

              <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
                {[
                  { key: 'MODERN_MINIMALIST', label: 'Modern Minimalist Villa (185 m²)' },
                  { key: 'THAI_TROPICAL_CONTEMPORARY', label: 'Thai Tropical High-Ceiling (240 m²)' },
                  { key: 'NORDIC_SCANDINAVIAN', label: 'Nordic Scandinavian Cabin (165 m²)' }
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => sketchUpBIMEngine.generateOfflineAIBuilding(s.key as any)}
                    className={`text-left p-2 rounded-lg border text-xs font-mono cursor-pointer transition-all ${
                      profile.offlineAIBuildingStyle === s.key
                        ? 'bg-amber-600 text-white border-amber-400 font-bold'
                        : 'bg-[#131d31] border-[#1e293b] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    ✦ {s.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
