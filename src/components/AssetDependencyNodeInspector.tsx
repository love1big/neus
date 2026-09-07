/**
 * ============================================================================
 * @file AssetDependencyNodeInspector.tsx
 * @system Art & 3D Asset Topology Architecture
 * @module Asset Node Deep Inspector & Dependency Tree Explorer
 * ============================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Purpose & Responsibility]:
 * แผงตรวจสอบรายละเอียดเชิงลึกของสินทรัพย์ (Asset Deep Inspector Panel):
 * 1. แสดงคุณสมบัติทางเทคนิคเฉพาะทางของ 3D Model (Triangles, Vertices, LOD, Submeshes)
 * 2. แสดงคุณสมบัติของ Texture (ความละเอียด Width x Height, PBR Map Type, Mipmaps, Format)
 * 3. แสดงคุณสมบัติของ Material & Shader (Shader Model, Blend Mode, Transparency)
 * 4. แจกแจงผลกระทบ Blast Radius: ปริมาณ VRAM และพื้นที่ดิสก์รวมที่ต้องโหลดพร้อมกันทั้งหมด
 * 5. แสดง Upstream Referencers: สินทรัพย์ชั้นบนที่เรียกใช้งานโหนดนี้ (เช่น โมเดลใดบ้างที่ใช้เท็กเจอร์นี้)
 * 6. แสดง Downstream Dependencies: สินทรัพย์ชั้นล่างที่โหนดนี้เรียกใช้ (เช่น โมเดลนี้ผูกกับเท็กเจอร์อะไรบ้าง)
 * 7. ให้ผู้ใช้คลิกกระโดด (Jump / Focus) ไปยังโหนดที่เกี่ยวข้องในโครงข่ายได้ทันที
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture & Integration]:
 * - รับ AssetNode ที่ถูกเลือกจาก AssetDependencyGraphStudio.tsx
 * - เรียกใช้ AssetDependencyCycleDetectorNode.ts เพื่อคำนวณ Upstream, Downstream, และ Blast Radius
 * 
 * 📥 [Data Contracts]:
 * - node: AssetNode | null
 * - allNodes: AssetNode[]
 * - allLinks: AssetLink[]
 * - onClose: () => void
 * - onSelectNode: (nodeId: string) => void
 * - onTogglePin: (node: AssetNode) => void
 * - onDeleteNode: (nodeId: string) => void
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - มีหน้าต่าง Empty State เมื่อไม่มีโหนดใดถูกเลือก
 * - ป้องกันข้อผิดพลาดจากการค้นหา Node ID ที่ไม่ตรงกัน
 * ============================================================================
 */

import React, { useMemo } from 'react';
import {
  Box,
  Image as ImageIcon,
  Layers,
  HardDrive,
  Cpu,
  Pin,
  PinOff,
  Trash2,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Music,
  Film,
  Compass,
  Zap,
  Tag,
  Clock,
  Crosshair
} from 'lucide-react';
import { AssetNode, AssetLink, AssetType } from '../types/assetDependencyGraph';
import { formatBytes } from '../utils/AssetDependencyGraphRepository';
import {
  getDownstreamDependencies,
  getUpstreamReferencers,
  calculateAssetBlastRadius,
  getNodeId
} from '../utils/AssetDependencyCycleDetectorNode';

interface Props {
  node: AssetNode | null;
  allNodes: AssetNode[];
  allLinks: AssetLink[];
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
  onTogglePin: (node: AssetNode) => void;
  onDeleteNode?: (nodeId: string) => void;
  onFocusNode?: (nodeId: string) => void;
}

const TYPE_ICONS: Record<AssetType, React.ReactNode> = {
  model_3d: <Box size={16} className="text-amber-400" />,
  texture: <ImageIcon size={16} className="text-purple-400" />,
  material: <Zap size={16} className="text-emerald-400" />,
  shader: <FileCode size={16} className="text-blue-400" />,
  animation: <Film size={16} className="text-pink-400" />,
  audio: <Music size={16} className="text-cyan-400" />,
  prefab: <Layers size={16} className="text-orange-400" />,
  environment_map: <Compass size={16} className="text-yellow-400" />
};

export default function AssetDependencyNodeInspector({
  node,
  allNodes,
  allLinks,
  onClose,
  onSelectNode,
  onTogglePin,
  onDeleteNode,
  onFocusNode
}: Props) {
  // หากไม่มีโหนดเลือก ให้แสดงคำแนะนำ
  if (!node) {
    return (
      <div 
        id="asset-inspector-empty"
        className="w-80 h-full bg-[#11161f] border-l border-[#21262d] p-5 flex flex-col items-center justify-center text-center text-gray-500 text-xs"
      >
        <div className="w-12 h-12 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-gray-400 mb-3">
          <Crosshair size={22} className="opacity-70 animate-pulse" />
        </div>
        <p className="font-semibold text-gray-300 text-sm mb-1">No Asset Selected</p>
        <p className="text-gray-400 leading-relaxed max-w-[220px]">
          Click any node in the topology graph to inspect its PBR textures, polygon statistics, and dependency tree.
        </p>
      </div>
    );
  }

  // Node Map สำหรับค้นหาไว
  const nodeMap = useMemo(() => new Map(allNodes.map(n => [n.id, n])), [allNodes]);

  // คำนวณ Blast Radius
  const blastRadius = useMemo(() => {
    return calculateAssetBlastRadius(node.id, allNodes, allLinks);
  }, [node.id, allNodes, allLinks]);

  // Upstream Referencers (สินทรัพย์ที่เรียกใช้โหนดนี้)
  const upstreamNodes = useMemo(() => {
    const parentIds = getUpstreamReferencers(node.id, allNodes, allLinks);
    return Array.from(parentIds).map(id => nodeMap.get(id)).filter(Boolean) as AssetNode[];
  }, [node.id, allNodes, allLinks, nodeMap]);

  // Downstream Dependencies (สินทรัพย์ที่โหนดนี้เรียกใช้)
  const downstreamNodes = useMemo(() => {
    const childIds = getDownstreamDependencies(node.id, allNodes, allLinks);
    return Array.from(childIds).map(id => nodeMap.get(id)).filter(Boolean) as AssetNode[];
  }, [node.id, allNodes, allLinks, nodeMap]);

  const isPinned = node.fx !== null && node.fx !== undefined;

  return (
    <div 
      id="asset-inspector-panel"
      className="w-84 h-full bg-[#11161f] border-l border-[#21262d] flex flex-col text-gray-200 text-xs shadow-2xl overflow-hidden z-20"
    >
      {/* Header */}
      <div className="p-3.5 bg-[#161b22] border-b border-[#21262d] flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="p-1.5 rounded bg-[#21262d] border border-[#30363d] shrink-0">
            {TYPE_ICONS[node.type] || <Box size={16} />}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-semibold text-white truncate" title={node.name}>
              {node.name}
            </h3>
            <p className="text-[10px] text-gray-400 capitalize flex items-center gap-1.5">
              <span>{node.type.replace('_', ' ')}</span>
              <span>•</span>
              <span className="font-mono text-gray-300">.{node.format}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Pin/Unpin button */}
          <button
            onClick={() => onTogglePin(node)}
            className={`p-1.5 rounded transition border ${
              isPinned 
                ? 'bg-amber-600/30 border-amber-500/50 text-amber-300' 
                : 'bg-[#21262d] border-[#30363d] text-gray-400 hover:text-white'
            }`}
            title={isPinned ? 'Unpin Physics Position' : 'Pin Physics Position'}
          >
            {isPinned ? <Pin size={13} className="fill-amber-400" /> : <PinOff size={13} />}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded bg-[#21262d] hover:bg-[#2d333b] border border-[#30363d] text-gray-400 hover:text-white transition"
            title="Close Inspector"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status Warning Banner (Missing or Orphaned) */}
        {node.status === 'missing' && (
          <div className="p-2.5 rounded-md bg-rose-950/40 border border-rose-500/50 text-rose-300 flex items-start gap-2">
            <AlertTriangle size={15} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Missing File Reference</p>
              <p className="text-[11px] text-rose-300/80 leading-snug">
                This asset is declared in materials or models but the binary file is missing from disk.
              </p>
            </div>
          </div>
        )}

        {node.status === 'orphaned' && (
          <div className="p-2.5 rounded-md bg-amber-950/40 border border-amber-500/50 text-amber-300 flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">Unreferenced Orphan Asset</p>
              <p className="text-[11px] text-amber-300/80 leading-snug">
                No active 3D model, material, or actor references this asset. Can safely be cleaned.
              </p>
            </div>
          </div>
        )}

        {/* Technical Specs Card */}
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3 space-y-2">
          <p className="font-semibold text-gray-300 text-[11px] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Asset Specifications</span>
            <span className="font-mono text-gray-400 normal-case">{formatBytes(node.fileSizeBytes)}</span>
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* 3D Model specific attributes */}
            {node.type === 'model_3d' && (
              <>
                <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                  <p className="text-gray-400">Triangles</p>
                  <p className="font-mono font-semibold text-amber-300 text-xs">
                    {node.triangles?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                  <p className="text-gray-400">Vertices</p>
                  <p className="font-mono font-semibold text-amber-300 text-xs">
                    {node.vertices?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                  <p className="text-gray-400">LOD Level</p>
                  <p className="font-mono font-semibold text-gray-200">
                    LOD {node.lodLevel ?? 0}
                  </p>
                </div>
                <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                  <p className="text-gray-400">Submeshes</p>
                  <p className="font-mono font-semibold text-gray-200">
                    {node.submeshCount ?? 1} Slots
                  </p>
                </div>
              </>
            )}

            {/* Texture specific attributes */}
            {node.type === 'texture' && (
              <>
                <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                  <p className="text-gray-400">Dimensions</p>
                  <p className="font-mono font-semibold text-purple-300 text-xs">
                    {node.width && node.height ? `${node.width} × ${node.height}` : 'N/A'}
                  </p>
                </div>
                <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                  <p className="text-gray-400">PBR Slot</p>
                  <p className="font-semibold text-gray-200 capitalize truncate" title={node.textureMapType}>
                    {node.textureMapType?.replace('_', ' ') || 'Albedo'}
                  </p>
                </div>
                <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                  <p className="text-gray-400">Compression</p>
                  <p className="font-mono font-semibold text-gray-200">
                    {node.compressionFormat || 'BC7'}
                  </p>
                </div>
                <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                  <p className="text-gray-400">Mipmaps</p>
                  <p className="font-semibold text-gray-200">
                    {node.hasMipmaps ? 'Enabled (Full)' : 'None'}
                  </p>
                </div>
              </>
            )}

            {/* Material specific attributes */}
            {node.type === 'material' && (
              <>
                <div className="bg-[#0d1117] p-2 rounded border border-[#21262d] col-span-2">
                  <p className="text-gray-400">Shader Model</p>
                  <p className="font-semibold text-emerald-300">
                    {node.shaderModel || 'Standard PBR Metallic/Roughness'}
                  </p>
                </div>
                <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                  <p className="text-gray-400">Blend Mode</p>
                  <p className="font-semibold text-gray-200">
                    {node.blendMode || 'Opaque'}
                  </p>
                </div>
                <div className="bg-[#0d1117] p-2 rounded border border-[#21262d]">
                  <p className="text-gray-400">Translucent</p>
                  <p className="font-semibold text-gray-200">
                    {node.isTransparent ? 'Yes' : 'No'}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Path */}
          <div className="pt-2 border-t border-[#21262d]">
            <p className="text-gray-400 text-[10px]">Virtual Path:</p>
            <p className="font-mono text-[10px] text-gray-300 truncate select-all" title={node.path}>
              {node.path}
            </p>
          </div>
        </div>

        {/* Blast Radius & Combined Memory Impact */}
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3 space-y-2">
          <p className="font-semibold text-gray-300 text-[11px] uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Cpu size={13} className="text-rose-400" />
              <span>Streaming Blast Radius</span>
            </span>
            <span className="text-rose-400 font-mono font-semibold">
              {formatBytes(blastRadius.totalVRAMEstimateBytes)} VRAM
            </span>
          </p>

          <p className="text-[11px] text-gray-400">
            Total memory consumed when loading this asset and all {blastRadius.downstreamCount} required dependent textures/materials.
          </p>

          <div className="flex items-center justify-between text-[11px] bg-[#0d1117] p-2 rounded border border-[#21262d]">
            <span className="text-gray-400">Combined Disk:</span>
            <span className="font-mono text-gray-200">{formatBytes(blastRadius.totalDiskSizeBytes)}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center pt-1">
            <div className="bg-[#0d1117] p-1.5 rounded border border-[#21262d]">
              <span className="text-amber-400 font-semibold">{blastRadius.dependentModelsCount}</span>
              <p className="text-gray-400">Models</p>
            </div>
            <div className="bg-[#0d1117] p-1.5 rounded border border-[#21262d]">
              <span className="text-purple-400 font-semibold">{blastRadius.dependentTexturesCount}</span>
              <p className="text-gray-400">Textures</p>
            </div>
            <div className="bg-[#0d1117] p-1.5 rounded border border-[#21262d]">
              <span className="text-emerald-400 font-semibold">{blastRadius.dependentMaterialsCount}</span>
              <p className="text-gray-400">Materials</p>
            </div>
          </div>
        </div>

        {/* Upstream Referencers: Who uses this? */}
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-300 text-[11px] uppercase tracking-wider">
              Referenced By ({upstreamNodes.length})
            </p>
            <span className="text-[10px] text-gray-400">Upstream</span>
          </div>

          {upstreamNodes.length === 0 ? (
            <p className="text-gray-500 text-[11px] italic py-1">
              No parent assets refer to this node (Orphan or Root).
            </p>
          ) : (
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {upstreamNodes.map(up => (
                <button
                  key={up.id}
                  onClick={() => onSelectNode(up.id)}
                  className="w-full text-left p-1.5 rounded bg-[#0d1117] hover:bg-[#21262d] border border-[#21262d] flex items-center justify-between group transition"
                >
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {TYPE_ICONS[up.type]}
                    <span className="truncate text-gray-300 group-hover:text-white text-[11px]">
                      {up.name}
                    </span>
                  </div>
                  <ChevronRight size={12} className="text-gray-500 group-hover:text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Downstream Dependencies: What does this need? */}
        <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-300 text-[11px] uppercase tracking-wider">
              Dependencies ({downstreamNodes.length})
            </p>
            <span className="text-[10px] text-gray-400">Downstream</span>
          </div>

          {downstreamNodes.length === 0 ? (
            <p className="text-gray-500 text-[11px] italic py-1">
              Leaf asset (has no child dependencies).
            </p>
          ) : (
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {downstreamNodes.map(down => (
                <button
                  key={down.id}
                  onClick={() => onSelectNode(down.id)}
                  className="w-full text-left p-1.5 rounded bg-[#0d1117] hover:bg-[#21262d] border border-[#21262d] flex items-center justify-between group transition"
                >
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {TYPE_ICONS[down.type]}
                    <span className="truncate text-gray-300 group-hover:text-white text-[11px]">
                      {down.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px] text-gray-500">{formatBytes(down.fileSizeBytes)}</span>
                    <ChevronRight size={12} className="text-gray-500 group-hover:text-gray-300" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        {node.tags && node.tags.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Tag size={11} />
              <span>Metadata Tags</span>
            </p>
            <div className="flex flex-wrap gap-1">
              {node.tags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 rounded bg-[#21262d] text-gray-300 text-[10px] border border-[#30363d]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {onDeleteNode && (
          <div className="pt-2 border-t border-[#21262d]">
            <button
              onClick={() => onDeleteNode(node.id)}
              className="w-full py-1.5 px-3 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Trash2 size={13} />
              <span>Remove Asset from Project</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
