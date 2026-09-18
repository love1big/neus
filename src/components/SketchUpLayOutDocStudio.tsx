/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Trimble SketchUp LayOut Construction Documents & Dimensioning Studio (LayOut parity).
 *          Generates 2D scaled architectural drawing sheets (ISO A1/A3), associative
 *          dimension extension lines, title blocks, drawing scales, and On-Device Offline AI
 *          smart dimension arrangement.
 *    - TH: สตูดิโอจัดหน้าแบบก่อสร้าง Trimble SketchUp LayOut (SketchUp LayOut Parity)
 *          จำลองกระดาษเขียนแบบสถาปัตยกรรม ISO A1/A3, เส้นบอกระยะและสเกล 1:50 / 1:100,
 *          กรอบข้อมูลแบบ (Title Block), และระบบ AI ออฟไลน์ช่วยจัดระเบียบเส้นบอกระยะอัตโนมัติ
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `sketchUpLayOutTypes.ts` and `SketchUpLayOutEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Ruler,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  Wand2,
  CheckCircle2,
  Building,
  Printer,
  Compass
} from 'lucide-react';
import { sketchUpLayOutEngine } from '../utils/SketchUpLayOutEngineNode';
import { SketchUpLayOutSheet } from '../types/sketchUpLayOutTypes';

interface LayOutStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function SketchUpLayOutDocStudio({ onSelectTool }: LayOutStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sheet, setSheet] = useState<SketchUpLayOutSheet>(() =>
    sketchUpLayOutEngine.getSheet()
  );

  useEffect(() => {
    return sketchUpLayOutEngine.subscribe(() => {
      setSheet({ ...sketchUpLayOutEngine.getSheet() });
    });
  }, []);

  // Architectural Sheet Drawing Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // 1. Drawing Sheet Canvas (Crisp White ISO A1 Paper)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 2. Sheet Outer Border & Margin
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // 3. Title Block (Bottom Right)
    const tbWidth = 260;
    const tbHeight = 70;
    const tbX = width - 20 - tbWidth;
    const tbY = height - 20 - tbHeight;

    ctx.strokeRect(tbX, tbY, tbWidth, tbHeight);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`SHEET: ${sheet.sheetNumber}`, tbX + 12, tbY + 22);
    ctx.font = '9px sans-serif';
    ctx.fillText(`PROJECT: ${sheet.clientName}`, tbX + 12, tbY + 40);
    ctx.fillText(`SCALE: 1:100 (METRIC) | PAPER: ${sheet.paperSize}`, tbX + 12, tbY + 56);

    // 4. Draw Architectural Floorplan Walls (Vector Cut Lines)
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0f172a';
    // External perimeter
    ctx.strokeRect(120, 120, 400, 200);

    // Internal partition
    ctx.beginPath();
    ctx.moveTo(320, 120);
    ctx.lineTo(320, 320);
    ctx.stroke();

    // Wall Hatching (diagonal lines)
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = '#94a3b8';
    for (let x = 125; x < 515; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 120);
      ctx.lineTo(x + 10, 130);
      ctx.stroke();
    }

    // Room Text
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('LIVING ROOM', 180, 220);
    ctx.font = '9px sans-serif';
    ctx.fillText('+0.00 FL.', 180, 236);

    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('DINING / KITCHEN', 360, 220);
    ctx.font = '9px sans-serif';
    ctx.fillText('+0.00 FL.', 360, 236);

    // 5. Draw Dimension Strings (Architectural Slash 45° Ticks)
    const vp = sheet.viewports[0];
    if (vp) {
      vp.dimensions.forEach(dim => {
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.2;

        // Dimension line
        ctx.beginPath();
        ctx.moveTo(dim.startX, dim.startY);
        ctx.lineTo(dim.endX, dim.endY);
        ctx.stroke();

        // 45° Architectural ticks
        const drawTick = (tx: number, ty: number) => {
          ctx.beginPath();
          ctx.moveTo(tx - 4, ty + 4);
          ctx.lineTo(tx + 4, ty - 4);
          ctx.stroke();
        };
        drawTick(dim.startX, dim.startY);
        drawTick(dim.endX, dim.endY);

        // Extension witness lines
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(dim.startX, dim.startY - 6);
        ctx.lineTo(dim.startX, dim.startY + 6);
        ctx.moveTo(dim.endX, dim.endY - 6);
        ctx.lineTo(dim.endX, dim.endY + 6);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 10px monospace';
        const midX = (dim.startX + dim.endX) / 2;
        ctx.fillText(dim.label, midX - 18, dim.startY - 6);
      });
    }

  }, [sheet]);

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1b253b] bg-[#0f172a] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-lg">
            <FileText size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                SketchUp LayOut Construction Documents & Dimensioning Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-400 text-[10px] font-bold border border-blue-500/40 font-mono">
                Trimble LayOut 2024 Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Architectural 2D Scaled Sheets, Associative Dimension Strings, Title Blocks, and On-Device Offline AI Dimension Alignment.
            </p>
          </div>
        </div>

        {/* AI Action */}
        <button
          onClick={() => sketchUpLayOutEngine.autoLayoutDimensionsWithAI()}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Wand2 size={13} />
          AI Auto-Align Dimensions
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* VIEWPORT (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1b253b] bg-[#0b0f19] relative">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0f172a]/80 backdrop-blur flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <Ruler size={13} className="text-blue-400" />
              Active Sheet: <strong className="text-cyan-400">{sheet.sheetNumber} - {sheet.sheetTitle}</strong>
            </span>

            <span className="text-blue-400 font-bold">Paper: {sheet.paperSize}</span>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
            <canvas
              ref={canvasRef}
              width={720}
              height={420}
              className="max-w-full max-h-full rounded shadow-2xl border border-slate-700"
            />
          </div>

          {/* Scale Control Footer */}
          <div className="p-3 border-t border-[#1b253b] bg-[#0f172a] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#94a3b8]">Drawing Scale:</span>
              {(['SCALE_1_20', 'SCALE_1_50', 'SCALE_1_100'] as const).map(scale => (
                <button
                  key={scale}
                  onClick={() => sketchUpLayOutEngine.setDrawingScale(scale)}
                  className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer transition-all ${
                    sheet.viewports[0]?.scale === scale
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-[#1e293b] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {scale.replace('SCALE_', '1:').replace('_', ':')}
                </button>
              ))}
            </div>

            <span className="text-[#94a3b8]">Associated Viewport: <strong>Ground Floor Plan</strong></span>
          </div>

        </div>

        {/* DIMENSION INSPECTOR & DETAILS (4 cols) */}
        <div className="lg:col-span-4 bg-[#0a0e1a] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0f172a] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-blue-400" /> Dimension Strings Table
            </span>
            <span className="text-[10px] font-mono text-blue-400">{sheet.viewports[0]?.dimensions.length} Dimensions</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {sheet.viewports[0]?.dimensions.map(dim => (
              <div key={dim.id} className="p-2.5 rounded-lg bg-[#131d31] border border-[#1e293b] space-y-1">
                <div className="flex justify-between text-white font-bold">
                  <span>{dim.id}</span>
                  <span className="text-cyan-400">{dim.label}</span>
                </div>
                <div className="text-[10px] text-[#94a3b8]">
                  Span: ({dim.startX}, {dim.startY}) → ({dim.endX}, {dim.endY})
                </div>
              </div>
            ))}

            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-blue-400 block uppercase tracking-wider">
                Offline AI Automated Dimensioning
              </span>
              <p className="text-xs text-blue-200/90 leading-relaxed">
                Prevents dimension text collisions against walls, window sills, and door swings completely on-device.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
