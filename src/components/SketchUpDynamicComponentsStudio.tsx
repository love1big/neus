/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: SketchUp Pro Dynamic Components & Parametric Formula Studio.
 *          Visualizes interactive 3D cabinet opening/closing via SketchUp's Interact Tool,
 *          inspects spreadsheet-like dynamic attribute formulas (=ANIMATE, =Parent!LenX),
 *          calculates Bill of Materials (BOM) cost, and provides On-Device Offline AI
 *          Parametric Clearance & Formula Optimization (Zero-Token Guarantee).
 *    - TH: สตูดิโอออกแบบคอมโพเนนต์แบบพารามิเตอร์ SketchUp Pro Dynamic Components Studio
 *          จำลองการคลิกโต้ตอบด้วยเครื่องมือ Interact Hand (บานเปิดตู้หมุน 0° ถึง 90°),
 *          ตรวจสอบตารางสูตรคำนวณแอททริบิวต์มิติและตำแหน่ง, คำนวณราคาวัสดุถอดแบบ BOM,
 *          และมีระบบ AI ออฟไลน์ช่วยวิเคราะห์สูตรและระยะเผื่อการติดตั้ง
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `sketchupDynamicTypes.ts` and `SketchUpDynamicEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Hand,
  Sparkles,
  Layers,
  DollarSign,
  Box,
  RotateCcw,
  Maximize2,
  Table,
  CheckCircle2
} from 'lucide-react';
import { sketchUpDynamicEngine } from '../utils/SketchUpDynamicEngineNode';
import { SketchUpDynamicProfile } from '../types/sketchupDynamicTypes';

interface SketchUpDynamicStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function SketchUpDynamicComponentsStudio({ onSelectTool }: SketchUpDynamicStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [profile, setProfile] = useState<SketchUpDynamicProfile>(() =>
    sketchUpDynamicEngine.getProfile()
  );

  useEffect(() => {
    return sketchUpDynamicEngine.subscribe(() => {
      setProfile({ ...sketchUpDynamicEngine.getProfile() });
    });
  }, []);

  // 3D Cabinet Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Light architectural background (SketchUp Default Blueprint)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    const centerX = width / 2;
    const centerY = height / 2 + 20;

    ctx.save();
    ctx.translate(centerX, centerY);

    // Isometric Cabinet Carcase (Wood Texture Hue)
    // Cabinet Back & Sides
    ctx.fillStyle = '#d97706'; // Warm Oak
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;

    // Cabinet Main Box Outline
    ctx.beginPath();
    ctx.moveTo(-100, 80);
    ctx.lineTo(80, 130);
    ctx.lineTo(160, 80);
    ctx.lineTo(160, -80);
    ctx.lineTo(-20, -130);
    ctx.lineTo(-100, -80);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Internal Shelf Cavity
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(-90, 70);
    ctx.lineTo(70, 115);
    ctx.lineTo(70, -70);
    ctx.lineTo(-90, -75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Interior Shelf Board
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath();
    ctx.moveTo(-90, 0);
    ctx.lineTo(70, 45);
    ctx.lineTo(70, 35);
    ctx.lineTo(-90, -10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Interactive Door Panel (Swings on RotZ)
    if (profile.isInteractedDoorOpen) {
      // Swung open 90 degrees outward
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(-100, 80);
      ctx.lineTo(-170, 30);
      ctx.lineTo(-170, -130);
      ctx.lineTo(-100, -80);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Swing radius arc
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(-100, 80, 90, Math.PI * 0.75, Math.PI * 1.15);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('RotZ = 90° (OPEN)', -180, -140);
    } else {
      // Closed flush on front face
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(-100, 80);
      ctx.lineTo(80, 130);
      ctx.lineTo(80, -30);
      ctx.lineTo(-100, -80);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Door Handle (Chrome)
      ctx.fillStyle = '#64748b';
      ctx.fillRect(60, 40, 6, 25);

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('RotZ = 0° (CLOSED)', 10, -40);
    }

    ctx.restore();

    // Technical Dimension text
    ctx.fillStyle = '#334155';
    ctx.font = '11px monospace';
    ctx.fillText(`WIDTH: ${profile.attributes.find(a => a.name === 'LenX')?.value || 36}" | HEIGHT: 34.5" | DEPTH: 24"`, 30, 40);

  }, [profile]);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-[#0f172a] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#e2e8f0] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
            <Hand size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-[#0f172a] tracking-tight">
                SketchUp Pro Dynamic Components & Parametric Formula Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 font-mono">
                SketchUp DC Parity
              </span>
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">
              Interactive OnClick Triggers, Parametric Math Formulas (=ANIMATE), and On-Device Offline AI Tolerance Checks.
            </p>
          </div>
        </div>

        {/* Interact Hand Button */}
        <button
          onClick={() => sketchUpDynamicEngine.triggerInteract()}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
        >
          <Hand size={14} />
          {profile.isInteractedDoorOpen ? 'Click to Close Door' : 'Click to Open Door (Interact)'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT CANVAS (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-r border-[#e2e8f0] bg-[#f8fafc] relative">
          <div className="p-3 border-b border-[#e2e8f0] bg-white/90 backdrop-blur flex items-center justify-between text-xs font-mono">
            <span className="text-[#0f172a] font-bold">
              Component: <strong className="text-amber-700">{profile.componentName}</strong>
            </span>
            <span className="text-emerald-600 font-bold">
              Unit Cost: ${profile.unitCostUSD.toFixed(2)} USD
            </span>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-3">
            <canvas
              ref={canvasRef}
              width={750}
              height={430}
              className="max-w-full max-h-full cursor-pointer"
              onClick={() => sketchUpDynamicEngine.triggerInteract()}
            />
          </div>

          <div className="p-3 border-t border-[#e2e8f0] bg-white flex items-center justify-between text-xs font-mono">
            <span className="text-[#64748b]">Click model anytime to trigger <code>OnClick = ANIMATE()</code></span>
            <span className="text-amber-700 font-bold">Status: {profile.isInteractedDoorOpen ? 'Door Open (90°)' : 'Door Closed (0°)'}</span>
          </div>
        </div>

        {/* COMPONENT ATTRIBUTES TABLE & ON-DEVICE AI (5 cols) */}
        <div className="lg:col-span-5 bg-white flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#e2e8f0] bg-slate-50 flex items-center justify-between text-xs">
            <span className="font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
              <Table size={13} className="text-amber-600" />
              Dynamic Attributes & Math Formulas
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">Evaluated</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {profile.attributes.map(attr => (
              <div key={attr.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0f172a] font-sans">{attr.label}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                    {attr.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Current Value:</span>
                  <strong className="text-amber-700">{attr.value}</strong>
                </div>
                {attr.formula && (
                  <div className="text-[11px] bg-slate-100 p-1.5 rounded text-indigo-700 font-mono">
                    Formula: {attr.formula}
                  </div>
                )}
              </div>
            ))}

            {/* On-Device Offline AI Formula Card */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-amber-800 block uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> On-Device Offline AI Component Inspector
              </span>
              <p className="text-xs text-amber-950/90 leading-relaxed">
                {profile.offlineAIFormulaInsight}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
