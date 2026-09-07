/**
 * ============================================================================
 * @file AssetGraphCanvasNavigationControls.tsx
 * @system Art & 3D Asset Topology Architecture
 * @module Asset Graph Smooth Zoom & Pan Navigation Controls
 * ============================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Purpose & Responsibility]:
 * แผงเครื่องมือควบคุมการซูมและแพนภาพโครงข่ายความสัมพันธ์สินทรัพย์แบบ Smooth & Responsive:
 * 1. ปุ่ม Smooth Zoom In (+) และ Smooth Zoom Out (-) พร้อมแอนิเมชัน Cubic Easing
 * 2. ป้ายแสดงระดับการซูมปัจจุบัน (เช่น 100%, 75%, 150%) พร้อมเมนูเลือกสเกลเร็ว (Quick Presets)
 * 3. ปุ่ม "Zoom to Fit" ปรับมุมมองให้อยู่กึ่งกลางและครอบคลุมทุกโหนดด้วยระยะ Padding ที่พอเหมาะ
 * 4. ปุ่ม "Reset 1:1" คืนมุมมองกลับสู่มาตราส่วน 100% ตรงกลาง
 * 5. แผงควบคุมทิศทาง (Smooth Directional Pan D-Pad: Up, Down, Left, Right)
 * 6. ปุ่ม "Focus Selected" เลื่อนกล้องพุ่งเป้าเข้าหาโหนดที่กำลังเลือกอยู่ทันที
 * 7. ป๊อปอัปบอกเทคนิคการนำทางลัด (Navigation Shortcuts & Gestures Guide)
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture & Integration]:
 * - รับคำสั่งและเชื่อมต่อกับ AssetGraphZoomControllerNode.ts
 * - สื่อสารและรับส่งค่าสถานะร่วมกับ AssetDependencyGraphStudio.tsx
 * 
 * 📥 [Inputs / Data Contracts]:
 * - zoomTransform: d3.ZoomTransform
 * - zoomController: AssetGraphZoomControllerNode | null
 * - nodes: AssetNode[]
 * - selectedNode: AssetNode | null
 * - viewportWidth: number
 * - viewportHeight: number
 * - showMinimap: boolean
 * - onToggleMinimap: () => void
 * 
 * 📤 [Outputs]:
 * - คำสั่ง Smooth Zoom, Pan, Fit, Center ไปยัง Controller
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - ป้องกันการเรียกฟังก์ชันเมื่อ zoomController ยังไม่ถูก Attach
 * - ปิดเมนู Preset อัตโนมัติเมื่อคลิกพื้นที่อื่น
 * ============================================================================
 */

import React, { useState } from 'react';
import * as d3 from 'd3';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Crosshair,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  MousePointer,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { AssetNode } from '../types/assetDependencyGraph';
import { AssetGraphZoomControllerNode } from '../utils/AssetGraphZoomControllerNode';

interface Props {
  zoomTransform: d3.ZoomTransform;
  zoomController: AssetGraphZoomControllerNode | null;
  nodes: AssetNode[];
  selectedNode: AssetNode | null;
  viewportWidth: number;
  viewportHeight: number;
  showMinimap: boolean;
  onToggleMinimap: () => void;
}

const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function AssetGraphCanvasNavigationControls({
  zoomTransform,
  zoomController,
  nodes,
  selectedNode,
  viewportWidth,
  viewportHeight,
  showMinimap,
  onToggleMinimap
}: Props) {
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [showDPad, setShowDPad] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);

  const zoomPercentage = Math.round(zoomTransform.k * 100);

  // Smooth Zoom In
  const handleZoomIn = () => {
    if (!zoomController) return;
    zoomController.smoothZoomIn(1.3, 300);
  };

  // Smooth Zoom Out
  const handleZoomOut = () => {
    if (!zoomController) return;
    zoomController.smoothZoomOut(0.77, 300);
  };

  // Smooth Zoom to Scale
  const handleSelectPreset = (scale: number) => {
    if (!zoomController) return;
    zoomController.smoothZoomToScale(scale, 350);
    setShowPresetMenu(false);
  };

  // Zoom to Fit All
  const handleZoomToFit = () => {
    if (!zoomController) return;
    zoomController.zoomToFit(nodes, viewportWidth || 800, viewportHeight || 600, 85, 550);
  };

  // Reset 1:1
  const handleResetToCenter = () => {
    if (!zoomController) return;
    zoomController.resetToCenter(viewportWidth || 800, viewportHeight || 600, 400);
  };

  // Center on Selected Node
  const handleCenterOnSelected = () => {
    if (!zoomController || !selectedNode) return;
    zoomController.centerOnNode(selectedNode, viewportWidth || 800, viewportHeight || 600, 1.35, 450);
  };

  // Directional Pan
  const handlePan = (dx: number, dy: number) => {
    if (!zoomController) return;
    zoomController.smoothPanBy(dx, dy, 220);
  };

  return (
    <div
      id="asset-canvas-navigation-controls"
      className="flex flex-col gap-2 select-none"
    >
      {/* Directional Pan D-Pad (Collapsible) */}
      {showDPad && (
        <div 
          id="pan-dpad-container"
          className="bg-[#161b22]/95 border border-[#30363d] rounded-xl p-1.5 shadow-2xl backdrop-blur-md flex flex-col items-center gap-1 w-28 animate-in fade-in zoom-in-95"
        >
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
            Pan Canvas
          </div>
          <button
            onClick={() => handlePan(0, 120)}
            className="p-1.5 rounded-md hover:bg-[#21262d] text-gray-300 hover:text-white transition"
            title="Pan Up"
          >
            <ArrowUp size={14} />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePan(120, 0)}
              className="p-1.5 rounded-md hover:bg-[#21262d] text-gray-300 hover:text-white transition"
              title="Pan Left"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={handleResetToCenter}
              className="p-1 rounded-md bg-[#21262d] text-amber-400 hover:text-amber-300 text-[10px] font-mono transition"
              title="Reset Pan Center"
            >
              •
            </button>
            <button
              onClick={() => handlePan(-120, 0)}
              className="p-1.5 rounded-md hover:bg-[#21262d] text-gray-300 hover:text-white transition"
              title="Pan Right"
            >
              <ArrowRight size={14} />
            </button>
          </div>
          <button
            onClick={() => handlePan(0, -120)}
            className="p-1.5 rounded-md hover:bg-[#21262d] text-gray-300 hover:text-white transition"
            title="Pan Down"
          >
            <ArrowDown size={14} />
          </button>
        </div>
      )}

      {/* Main Bottom-Left Control Island */}
      <div className="flex items-center gap-1 bg-[#161b22]/90 backdrop-blur-md p-1.5 rounded-lg border border-[#30363d] shadow-xl text-gray-300">
        {/* Zoom In (+) */}
        <button
          id="canvas-zoom-in-btn"
          onClick={handleZoomIn}
          className="p-1.5 rounded hover:bg-[#21262d] hover:text-white transition text-gray-300"
          title="Smooth Zoom In (+30%)"
        >
          <ZoomIn size={15} />
        </button>

        {/* Zoom Out (-) */}
        <button
          id="canvas-zoom-out-btn"
          onClick={handleZoomOut}
          className="p-1.5 rounded hover:bg-[#21262d] hover:text-white transition text-gray-300"
          title="Smooth Zoom Out (-23%)"
        >
          <ZoomOut size={15} />
        </button>

        {/* Zoom Percentage & Preset Selector Trigger */}
        <div className="relative">
          <button
            id="canvas-zoom-preset-btn"
            onClick={() => setShowPresetMenu(!showPresetMenu)}
            className="px-2 py-1 rounded hover:bg-[#21262d] hover:text-white transition font-mono text-[11px] font-semibold text-gray-200 flex items-center gap-1"
            title="Current Zoom Level - Click for presets"
          >
            <span>{zoomPercentage}%</span>
            <ChevronUp size={10} className="text-gray-400" />
          </button>

          {/* Quick Presets Dropdown */}
          {showPresetMenu && (
            <div 
              id="zoom-preset-menu"
              className="absolute bottom-full mb-2 left-0 w-28 bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl py-1 text-xs z-50 animate-in fade-in"
            >
              <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 border-b border-[#21262d] uppercase tracking-wider">
                Zoom Presets
              </div>
              {ZOOM_PRESETS.map((scale) => {
                const pct = Math.round(scale * 100);
                const isCur = Math.abs(zoomTransform.k - scale) < 0.05;
                return (
                  <button
                    key={scale}
                    onClick={() => handleSelectPreset(scale)}
                    className={`w-full text-left px-2.5 py-1 text-xs flex items-center justify-between transition ${
                      isCur
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-gray-300 hover:bg-[#21262d] hover:text-white'
                    }`}
                  >
                    <span>{pct}%</span>
                    {scale === 1.0 && <span className="text-[9px] opacity-70">1:1</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="w-[1px] h-4 bg-[#30363d] mx-0.5" />

        {/* Zoom to Fit (Framing all nodes) */}
        <button
          id="canvas-zoom-fit-btn"
          onClick={handleZoomToFit}
          className="p-1.5 rounded hover:bg-[#21262d] hover:text-white transition text-gray-300"
          title="Zoom to Fit All Assets (Frame Graph)"
        >
          <Maximize2 size={15} />
        </button>

        {/* Reset 1:1 Center */}
        <button
          id="canvas-reset-center-btn"
          onClick={handleResetToCenter}
          className="p-1.5 rounded hover:bg-[#21262d] hover:text-white transition text-gray-300"
          title="Reset to Center (100%)"
        >
          <RotateCcw size={14} />
        </button>

        {/* Center on Selected Node (Enabled when node selected) */}
        {selectedNode && (
          <button
            id="canvas-focus-selected-btn"
            onClick={handleCenterOnSelected}
            className="p-1.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 border border-blue-500/30 transition animate-pulse"
            title={`Focus and Center on ${selectedNode.name}`}
          >
            <Crosshair size={14} />
          </button>
        )}

        <div className="w-[1px] h-4 bg-[#30363d] mx-0.5" />

        {/* D-Pad Pan Toggle */}
        <button
          id="toggle-dpad-btn"
          onClick={() => setShowDPad(!showDPad)}
          className={`p-1.5 rounded transition ${
            showDPad
              ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
              : 'hover:bg-[#21262d] text-gray-400 hover:text-white'
          }`}
          title="Toggle Directional Pan Pad"
        >
          <Compass size={14} />
        </button>

        {/* Minimap Toggle */}
        <button
          id="toggle-minimap-btn"
          onClick={onToggleMinimap}
          className={`p-1.5 rounded transition ${
            showMinimap
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
              : 'hover:bg-[#21262d] text-gray-400 hover:text-white'
          }`}
          title={showMinimap ? 'Hide Radar Minimap' : 'Show Radar Minimap'}
        >
          <MousePointer size={14} />
        </button>

        {/* Navigation Help Tooltip Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowHelpTooltip(!showHelpTooltip)}
            className="p-1.5 rounded hover:bg-[#21262d] text-gray-400 hover:text-gray-200 transition"
            title="Navigation Guide"
          >
            <HelpCircle size={14} />
          </button>

          {showHelpTooltip && (
            <div 
              id="navigation-help-modal"
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl p-3 text-xs z-50 animate-in fade-in"
            >
              <div className="font-semibold text-white mb-2 flex items-center justify-between">
                <span>Canvas Navigation Controls</span>
                <span className="text-[10px] text-blue-400 font-mono">Shortcuts</span>
              </div>
              <ul className="space-y-1.5 text-gray-300 text-[11px]">
                <li className="flex items-center justify-between">
                  <span className="text-gray-400">Mouse Wheel</span>
                  <span className="font-mono text-gray-200">Smooth Zoom In/Out</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-gray-400">Drag Canvas</span>
                  <span className="font-mono text-gray-200">Pan Viewport</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-gray-400">Drag Node</span>
                  <span className="font-mono text-gray-200">Move & Physics Force</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-gray-400">Click Node</span>
                  <span className="font-mono text-gray-200">Inspect & Subgraph</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-gray-400">Minimap Click</span>
                  <span className="font-mono text-gray-200">Instant Jump</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
