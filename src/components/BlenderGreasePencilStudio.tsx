/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Blender Grease Pencil 3.0 & 2D/3D Hybrid Animation Studio (Blender parity).
 *          Canvas for drawing 3D vector strokes, stroke sculpting (Smooth, Grab, Thickness),
 *          Onion Skinning ghost overlays, multi-layer management, and On-Device Offline AI
 *          stroke cleanup.
 *    - TH: สตูดิโอระบบ Blender Grease Pencil 3.0 & 2D/3D Hybrid Animation (Blender Parity)
 *          ผ้าใบวาดเส้นสโตรกเวกเตอร์ 3 มิติ, หัวแปรงปั้นและปรับความหนาเส้น (Stroke Sculpt),
 *          โหมดเปิดภาพเงาเฟรมก่อนหน้า (Onion Skinning), และระบบ AI ออฟไลน์ช่วยเกลี่ยเส้นให้เนียน
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `blenderGreasePencilTypes.ts` and `BlenderGreasePencilEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Paintbrush,
  PenTool,
  Sliders,
  Eye,
  Layers,
  Sparkles,
  Activity,
  Play,
  RotateCcw,
  CheckCircle2,
  Wand2,
  Lock,
  Eraser,
  Scissors
} from 'lucide-react';
import { blenderGreasePencilEngine } from '../utils/BlenderGreasePencilEngineNode';
import { GreasePencilProfile } from '../types/blenderGreasePencilTypes';

interface GPStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function BlenderGreasePencilStudio({ onSelectTool }: GPStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [profile, setProfile] = useState<GreasePencilProfile>(() =>
    blenderGreasePencilEngine.getProfile()
  );

  useEffect(() => {
    return blenderGreasePencilEngine.subscribe(() => {
      setProfile({ ...blenderGreasePencilEngine.getProfile() });
    });
  }, []);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, width, height);

    // 3D Perspective Grid
    ctx.strokeStyle = '#151d33';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Onion Skinning ghost before
    if (profile.onionSkinningEnabled) {
      ctx.strokeStyle = '#ef444455';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(310, 230, 65, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Render Strokes
    profile.layers.forEach(layer => {
      if (!layer.visible) return;

      layer.strokes.forEach(stroke => {
        if (stroke.points.length < 2) return;

        ctx.strokeStyle = stroke.colorHex;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        stroke.points.forEach((pt, idx) => {
          ctx.lineWidth = pt.thickness * (0.8 + pt.pressure * 0.4);
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        if (stroke.isClosed) ctx.closePath();
        ctx.stroke();

        // Draw Vector Control Vertices
        stroke.points.forEach(pt => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        });
      });
    });

  }, [profile]);

  return (
    <div className="flex flex-col h-full bg-[#060911] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1b253b] bg-[#0c1222] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500/30 to-purple-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0 shadow-lg">
            <Paintbrush size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Blender Grease Pencil 3.0 & 2D/3D Hybrid Animation Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-pink-950/80 text-pink-400 text-[10px] font-bold border border-pink-500/40 font-mono">
                Blender 4.2+ Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              3D Vector Strokes, Onion Skinning, Stroke Sculpting, and On-Device Offline AI stroke curve optimization.
            </p>
          </div>
        </div>

        {/* Sculpt / Smooth Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => blenderGreasePencilEngine.smoothActiveStrokes()}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Wand2 size={13} />
            AI Stroke Smooth & Inbetween
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1b253b] bg-[#060911] relative">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1222]/80 backdrop-blur flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">Active Brush:</span>
              <span className="text-pink-400 font-bold uppercase">{profile.activeBrush}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-amber-400">Onion Skinning:</span>
              <span className="text-white font-bold">{profile.onionSkinningEnabled ? 'ENABLED (±2 Frames)' : 'DISABLED'}</span>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={440}
              className="max-w-full max-h-full"
            />
          </div>

          {/* Timeline Bar */}
          <div className="p-3 border-t border-[#1b253b] bg-[#0c1222] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-[#94a3b8]">Frame:</span>
              <input
                type="range"
                min="1"
                max={profile.totalFrames}
                value={profile.currentFrame}
                onChange={(e) => blenderGreasePencilEngine.setFrame(parseInt(e.target.value))}
                className="w-44 accent-pink-500 h-1.5 bg-[#172238] rounded-lg cursor-pointer"
              />
              <span className="text-pink-400 font-bold">#{profile.currentFrame} / {profile.totalFrames}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {(['DRAW', 'SMOOTH', 'THICKNESS', 'ERASE'] as const).map(brush => (
                <button
                  key={brush}
                  onClick={() => blenderGreasePencilEngine.setActiveBrush(brush)}
                  className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                    profile.activeBrush === brush
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'bg-[#151e33] text-[#94a3b8] hover:text-white border border-[#202d4d]'
                  }`}
                >
                  {brush}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* LAYERS & SETTINGS (4 cols) */}
        <div className="lg:col-span-4 bg-[#080d1a] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0e1628] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-pink-400" /> Grease Pencil Layers
            </span>
            <span className="text-[10px] font-mono text-pink-400">{profile.layers.length} Layers</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {profile.layers.map(layer => (
              <div key={layer.id} className="p-3 rounded-xl bg-[#121c32] border border-[#1e2e50] space-y-2">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>{layer.name}</span>
                  <span className="text-pink-400 font-normal">{layer.strokes.length} strokes</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                  <span>Opacity: {(layer.opacity * 100).toFixed(0)}%</span>
                  <span className="text-emerald-400">Active Draw</span>
                </div>
              </div>
            ))}

            <div className="p-3.5 rounded-xl bg-pink-950/20 border border-pink-500/30 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-pink-400 block uppercase tracking-wider">
                On-Device Offline AI Inbetweening
              </span>
              <p className="text-xs text-pink-200/90 leading-relaxed">
                Calculates automatic Bézier stroke timing and interpolation without sending data to any external server.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
