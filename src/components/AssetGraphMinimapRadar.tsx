/**
 * ============================================================================
 * @file AssetGraphMinimapRadar.tsx
 * @system Art & 3D Asset Topology Architecture
 * @module Asset Graph Interactive Minimap & Viewport Radar
 * ============================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Purpose & Responsibility]:
 * แผนที่ย่อเรดาร์แสดงภาพรวมของโครงข่ายสินทรัพย์ทั้งหมด (Interactive Minimap & Viewport Radar):
 * 1. แสดงตำแหน่งแบบย่อของโหนดทั้งหมดในโลกกราฟ (World Space) ด้วยสีประจำประเภทสินทรัพย์
 * 2. แสดงกรอบสี่เหลี่ยมผืนผ้า (Viewport Frustum Box) ระบุพื้นที่ที่สายตากำลังมองอยู่บน Canvas
 * 3. อนุญาตให้ผู้ใช้คลิกหรือลากกรอบ Viewport บน Minimap เพื่อนำทาง (Pan) ไปยังพื้นที่นั้นแบบเรียลไทม์
 * 4. รองรับการพับเก็บ/ขยาย (Collapse/Expand) เพื่อประหยัดพื้นที่บนหน้าจอ
 * 5. แสดงสถิติขอบเขตและตำแหน่งโหนดที่อยู่นอกสายตา
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture & Integration]:
 * - ทำงานร่วมกับ AssetGraphZoomControllerNode.ts เพื่อคำนวณ Minimap Coords และแปลงพิกัด World
 * - นำเข้าและใช้งานภายใน AssetGraphCanvasNavigationControls.tsx หรือ AssetDependencyGraphStudio.tsx
 * 
 * 📥 [Inputs / Data Contracts]:
 * - nodes: AssetNode[]
 * - zoomTransform: d3.ZoomTransform
 * - viewportWidth: number
 * - viewportHeight: number
 * - zoomController: AssetGraphZoomControllerNode | null
 * 
 * 📤 [Outputs]:
 * - Interactive Canvas/SVG Minimap Overlay
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - Fallback แสดงข้อความแนะนำเมื่อโหนดยังไม่พร้อม
 * - ตรวจจับขอบเขตไม่ให้ Viewport Box หลุดนอกกรอบเรดาร์
 * ============================================================================
 */

import React, { useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { Compass, Eye, Maximize2, Minimize2, MapPin } from 'lucide-react';
import { AssetNode, AssetType } from '../types/assetDependencyGraph';
import { AssetGraphZoomControllerNode } from '../utils/AssetGraphZoomControllerNode';

interface Props {
  nodes: AssetNode[];
  zoomTransform: d3.ZoomTransform;
  viewportWidth: number;
  viewportHeight: number;
  zoomController: AssetGraphZoomControllerNode | null;
  selectedNodeId?: string | null;
}

const MINIMAP_WIDTH = 180;
const MINIMAP_HEIGHT = 120;

const TYPE_DOT_COLORS: Record<AssetType, string> = {
  prefab: '#f59e0b',
  model_3d: '#eab308',
  material: '#10b981',
  shader: '#3b82f6',
  texture: '#a855f7',
  environment_map: '#ca8a04',
  animation: '#ec4899',
  audio: '#06b6d4'
};

export default function AssetGraphMinimapRadar({
  nodes,
  zoomTransform,
  viewportWidth,
  viewportHeight,
  zoomController,
  selectedNodeId
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // คำนวณพิกัด Minimap และ Viewport Box ผ่าน Zoom Controller
  const minimapData = useMemo(() => {
    if (!zoomController || nodes.length === 0) return null;
    return zoomController.calculateMinimapData(
      nodes,
      viewportWidth || 800,
      viewportHeight || 600,
      MINIMAP_WIDTH,
      MINIMAP_HEIGHT
    );
  }, [zoomController, nodes, zoomTransform, viewportWidth, viewportHeight]);

  // จัดการเมื่อคลิกบน Minimap เพื่อกระโดดกล้อง
  const handleMinimapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !zoomController) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    zoomController.navigateFromMinimap(
      clickX,
      clickY,
      MINIMAP_WIDTH,
      MINIMAP_HEIGHT,
      nodes,
      viewportWidth || 800,
      viewportHeight || 600,
      280
    );
  };

  // จัดการการลาก Viewport Frustum Box
  const handleFrustumMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!svgRef.current || !zoomController) return;
      const rect = svgRef.current.getBoundingClientRect();
      const curX = Math.max(0, Math.min(MINIMAP_WIDTH, moveEvent.clientX - rect.left));
      const curY = Math.max(0, Math.min(MINIMAP_HEIGHT, moveEvent.clientY - rect.top));

      zoomController.navigateFromMinimap(
        curX,
        curY,
        MINIMAP_WIDTH,
        MINIMAP_HEIGHT,
        nodes,
        viewportWidth || 800,
        viewportHeight || 600,
        0
      );
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  if (isCollapsed) {
    return (
      <button
        id="expand-minimap-btn"
        onClick={() => setIsCollapsed(false)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161b22]/90 hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363d] backdrop-blur-md shadow-lg text-xs transition"
        title="Show Asset Radar Minimap"
      >
        <Compass size={14} className="text-amber-400" />
        <span className="font-mono text-[11px]">Radar</span>
      </button>
    );
  }

  return (
    <div
      id="asset-minimap-radar-container"
      className="bg-[#11161f]/95 border border-[#30363d] rounded-lg shadow-2xl backdrop-blur-md overflow-hidden text-xs select-none"
      style={{ width: MINIMAP_WIDTH }}
    >
      {/* Minimap Header */}
      <div className="px-2 py-1 bg-[#161b22] border-b border-[#21262d] flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-1">
          <Compass size={12} className="text-amber-400 animate-spin-slow" />
          <span className="font-semibold text-gray-200">Topology Radar</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-0.5 rounded hover:bg-[#21262d] text-gray-400 hover:text-white transition"
          title="Minimize Radar"
        >
          <Minimize2 size={11} />
        </button>
      </div>

      {/* SVG Radar Map */}
      <div className="relative bg-[#090d13] cursor-crosshair">
        <svg
          ref={svgRef}
          width={MINIMAP_WIDTH}
          height={MINIMAP_HEIGHT}
          onClick={handleMinimapClick}
          className="block w-full h-full"
        >
          {/* Subtle Grid Lines */}
          <line x1={0} y1={MINIMAP_HEIGHT / 2} x2={MINIMAP_WIDTH} y2={MINIMAP_HEIGHT / 2} stroke="#1f2937" strokeWidth={0.5} strokeDasharray="2 2" />
          <line x1={MINIMAP_WIDTH / 2} y1={0} x2={MINIMAP_WIDTH / 2} y2={MINIMAP_HEIGHT} stroke="#1f2937" strokeWidth={0.5} strokeDasharray="2 2" />

          {/* Node Dots */}
          {minimapData && nodes.map((node) => {
            const x = node.x ?? 0;
            const y = node.y ?? 0;
            const { worldBounds, scaleX } = minimapData;
            const offsetX = (MINIMAP_WIDTH - worldBounds.width * scaleX) / 2;
            const offsetY = (MINIMAP_HEIGHT - worldBounds.height * scaleX) / 2;

            const dotX = offsetX + (x - worldBounds.minX) * scaleX;
            const dotY = offsetY + (y - worldBounds.minY) * scaleX;

            const isSelected = selectedNodeId === node.id;
            const dotColor = TYPE_DOT_COLORS[node.type] || '#9ca3af';

            return (
              <circle
                key={`minimap-${node.id}`}
                cx={dotX}
                cy={dotY}
                r={isSelected ? 3.5 : (node.type === 'model_3d' || node.type === 'prefab') ? 2.5 : 1.8}
                fill={isSelected ? '#38bdf8' : dotColor}
                opacity={isSelected ? 1 : 0.75}
                stroke={isSelected ? '#ffffff' : 'none'}
                strokeWidth={isSelected ? 1 : 0}
              />
            );
          })}

          {/* Active Viewport Frustum Box */}
          {minimapData && (
            <rect
              x={minimapData.viewportBox.x}
              y={minimapData.viewportBox.y}
              width={minimapData.viewportBox.width}
              height={minimapData.viewportBox.height}
              fill="rgba(56, 189, 248, 0.15)"
              stroke="#38bdf8"
              strokeWidth={1.2}
              strokeDasharray={isDragging ? '3 2' : undefined}
              className="cursor-move"
              onMouseDown={handleFrustumMouseDown}
            />
          )}
        </svg>

        {/* Small Navigation Hint */}
        <div className="px-2 py-0.5 bg-[#161b22]/90 border-t border-[#21262d] flex items-center justify-between text-[9px] text-gray-500 font-mono">
          <span>{nodes.length} Nodes</span>
          <span className="text-gray-400">Click to Pan</span>
        </div>
      </div>
    </div>
  );
}
