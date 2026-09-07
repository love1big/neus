/**
 * ============================================================================
 * @file AssetDependencyGraphStudio.tsx
 * @system Art & 3D Asset Topology Architecture
 * @module Asset Dependency Graph Studio & Interactive Force Topology Visualizer
 * ============================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Purpose & Responsibility]:
 * เครื่องมือแสดงผลแผนผังโครงข่ายความสัมพันธ์ระหว่างสินทรัพย์ด้วย D3 Force-Directed Graph:
 * 1. แสดงภาพความเชื่อมโยงระดับ AAA: โมเดล 3D (.gltf, .fbx) ผูกกับ Material และ Material เรียกใช้ Textures (Albedo, Normal, ORM)
 * 2. คำนวณฟิสิกส์แรงดึงดูด/แรงผลักแบบ Interactive Drag & Drop พร้อมการตรึงพิกัด (Pinning)
 * 3. มีระบบเรืองแสงและไฮไลต์กลุ่มความสัมพันธ์ (Subgraph Highlighting) เมื่อคลิกเลือกโหนด
 * 4. มีลำแสงอนุภาคเคลื่อนที่ตามทิศทางการพึ่งพา (Animated Dependency Stream Particles)
 * 5. แจ้งเตือนและระบุตำแหน่งสินทรัพย์ที่ลิงก์เสีย (Broken References) และสินทรัพย์ที่ไม่มีใครใช้ (Orphan Assets)
 * 6. วิเคราะห์ผลกระทบขนาดหน่วยความจำ VRAM รวม และขนาดไฟล์ดิสก์แบบเรียลไทม์
 * 7. ส่งออกแผนผังเป็น JSON Data และบันทึกภาพ SVG Snapshot ได้ทันที
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture & Integration]:
 * - ดึงและจัดการข้อมูลผ่าน AssetDependencyGraphRepository.ts
 * - ขับเคลื่อนฟิสิกส์โดย AssetForceDirectedSimulationNode.ts
 * - ตรวจจับความผิดปกติผ่าน AssetDependencyCycleDetectorNode.ts
 * - เชื่อมโยงเข้ากับ ArtStudioHub ใน App.tsx ผ่าน onSelectTool
 * 
 * 📥 [Inputs / Data Contracts]:
 * - onSelectTool?: (toolId: string) => void
 * 
 * 📤 [Outputs]:
 * - เรนเดอร์ Force-Directed SVG Canvas ขนาดเต็มจอ
 * - แผง Inspector เชิงลึก และแถบมาตรวัดคุณภาพโครงการ
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - ป้องกัน Memory Leak ด้วยการหยุด Simulation เมื่อ Unmount
 * - ResizeObserver อัปเดตขนาดหน้าจออย่างแม่นยำ
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import {
  Box,
  Image as ImageIcon,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Network,
  Info,
  CheckCircle2,
  Share2,
  Download
} from 'lucide-react';
import {
  AssetNode,
  AssetLink,
  AssetType,
  AssetGraphFilterState,
  AssetDependencyMetrics
} from '../types/assetDependencyGraph';
import {
  AssetDependencyGraphRepository,
  formatBytes
} from '../utils/AssetDependencyGraphRepository';
import { AssetForceDirectedSimulationNode } from '../utils/AssetForceDirectedSimulationNode';
import {
  calculateOverallMetrics,
  getDownstreamDependencies,
  getUpstreamReferencers,
  detectOrphanAssets,
  getNodeId
} from '../utils/AssetDependencyCycleDetectorNode';
import AssetDependencyMetricsBar from './AssetDependencyMetricsBar';
import AssetDependencyFilterToolbar from './AssetDependencyFilterToolbar';
import AssetDependencyNodeInspector from './AssetDependencyNodeInspector';
import AssetGraphCanvasNavigationControls from './AssetGraphCanvasNavigationControls';
import AssetGraphMinimapRadar from './AssetGraphMinimapRadar';
import { AssetGraphZoomControllerNode } from '../utils/AssetGraphZoomControllerNode';

interface Props {
  onSelectTool?: (toolId: string) => void;
}

// สีประจำประเภทของ Asset
const TYPE_CONFIG: Record<AssetType, { fill: string; stroke: string; label: string; ring: string }> = {
  prefab: { fill: '#b45309', stroke: '#f59e0b', label: 'Prefab', ring: 'rgba(245, 158, 11, 0.4)' },
  model_3d: { fill: '#854d0e', stroke: '#eab308', label: '3D Model', ring: 'rgba(234, 179, 8, 0.4)' },
  material: { fill: '#065f46', stroke: '#10b981', label: 'Material', ring: 'rgba(16, 185, 129, 0.4)' },
  shader: { fill: '#1e40af', stroke: '#3b82f6', label: 'Shader', ring: 'rgba(59, 130, 246, 0.4)' },
  texture: { fill: '#6b21a8', stroke: '#a855f7', label: 'Texture', ring: 'rgba(168, 85, 247, 0.4)' },
  environment_map: { fill: '#713f12', stroke: '#ca8a04', label: 'Env HDRI', ring: 'rgba(202, 138, 4, 0.4)' },
  animation: { fill: '#831843', stroke: '#ec4899', label: 'Animation', ring: 'rgba(236, 72, 153, 0.4)' },
  audio: { fill: '#155e75', stroke: '#06b6d4', label: 'Audio SFX', ring: 'rgba(6, 182, 212, 0.4)' }
};

export default function AssetDependencyGraphStudio({ onSelectTool }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<AssetForceDirectedSimulationNode | null>(null);
  const zoomControllerRef = useRef<AssetGraphZoomControllerNode | null>(null);

  const repository = useMemo(() => AssetDependencyGraphRepository.getInstance(), []);

  // State
  const [nodes, setNodes] = useState<AssetNode[]>([]);
  const [links, setLinks] = useState<AssetLink[]>([]);
  const [currentPresetId, setCurrentPresetId] = useState<string>('mech_titan');
  const [clusteringEnabled, setClusteringEnabled] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [pulseTick, setPulseTick] = useState<number>(0);
  const [showMinimap, setShowMinimap] = useState<boolean>(true);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 900,
    height: 650
  });

  // Filter State
  const [filterState, setFilterState] = useState<AssetGraphFilterState>({
    searchQuery: '',
    selectedTypes: [],
    statusFilter: 'all',
    highlightNodeId: null,
    selectedNodeId: null,
    focusHops: 0,
    showLabels: true,
    showParticlePulses: true,
    showOrphanCluster: false
  });

  // โหลดข้อมูลเริ่มต้นและติดตามการเปลี่ยนแปลงใน Repository
  useEffect(() => {
    const updateLocalState = () => {
      setNodes([...repository.getNodes()]);
      setLinks([...repository.getLinks()]);
    };

    updateLocalState();
    const unsubscribe = repository.subscribe(updateLocalState);
    return () => unsubscribe();
  }, [repository]);

  // คำนวณ Metrics รวม
  const metrics = useMemo<AssetDependencyMetrics>(() => {
    return calculateOverallMetrics(nodes, links);
  }, [nodes, links]);

  // Orphan Set
  const orphanIds = useMemo(() => {
    return detectOrphanAssets(nodes, links);
  }, [nodes, links]);

  // โหนดที่ผ่านตัวกรอง (Filtered Nodes)
  const filteredNodes = useMemo(() => {
    const q = filterState.searchQuery.toLowerCase().trim();
    return nodes.filter(node => {
      // ค้นหาตามข้อความ
      if (q) {
        const matchName = node.name.toLowerCase().includes(q);
        const matchPath = node.path.toLowerCase().includes(q);
        const matchFormat = node.format.toLowerCase().includes(q);
        const matchTags = node.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchPath && !matchFormat && !matchTags) {
          return false;
        }
      }

      // กรองตามประเภท
      if (filterState.selectedTypes.length > 0) {
        if (!filterState.selectedTypes.includes(node.type)) {
          return false;
        }
      }

      // กรองตามสถานะ
      if (filterState.statusFilter === 'orphans_only') {
        if (!orphanIds.has(node.id) && node.status !== 'orphaned') return false;
      } else if (filterState.statusFilter === 'broken_only') {
        if (node.status !== 'missing') return false;
      } else if (filterState.statusFilter === 'high_vram_only') {
        if (node.vramEstimateBytes < 30000000) return false;
      }

      return true;
    });
  }, [nodes, filterState.searchQuery, filterState.selectedTypes, filterState.statusFilter, orphanIds]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // ลิงก์ที่ผ่านตัวกรอง
  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const srcId = getNodeId(link.source);
      const tgtId = getNodeId(link.target);
      return filteredNodeIds.has(srcId) && filteredNodeIds.has(tgtId);
    });
  }, [links, filteredNodeIds]);

  // คำนวณ Connected Nodes สำหรับ Highlight เมื่อเลือกหรือ Hover โหนด
  const activeFocusId = filterState.selectedNodeId || hoveredNodeId;

  const connectedNodeIds = useMemo(() => {
    if (!activeFocusId) return null;

    const downstream = getDownstreamDependencies(activeFocusId, nodes, links);
    const upstream = getUpstreamReferencers(activeFocusId, nodes, links);

    const set = new Set<string>([activeFocusId, ...downstream, ...upstream]);
    return set;
  }, [activeFocusId, nodes, links]);

  // โหนดที่กำลังเปิดดูใน Inspector
  const selectedNode = useMemo(() => {
    if (!filterState.selectedNodeId) return null;
    return nodes.find(n => n.id === filterState.selectedNodeId) || null;
  }, [filterState.selectedNodeId, nodes]);

  // เริ่มต้น D3 Force Simulation
  useEffect(() => {
    if (!containerRef.current || filteredNodes.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 600;

    const sim = new AssetForceDirectedSimulationNode(
      filteredNodes,
      filteredLinks,
      width,
      height,
      {
        clusteringEnabled,
        chargeStrength: -450,
        linkDistance: 110,
        collisionRadius: 46
      }
    );

    sim.onTick((updatedNodes, updatedLinks) => {
      setNodes([...updatedNodes]);
      setLinks([...updatedLinks]);
    });

    simulationRef.current = sim;

    return () => {
      sim.destroy();
      simulationRef.current = null;
    };
  }, [currentPresetId, clusteringEnabled]);

  // Dynamic Canvas Dimension Observer
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setCanvasDimensions({
            width: rect.width,
            height: rect.height
          });
        }
      }
    };

    updateDimensions();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect && entry.contentRect.width > 0) {
          setCanvasDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // D3 Zoom & Pan Controller Setup with Smooth Navigation Engine
  useEffect(() => {
    if (!svgRef.current) return;

    const zoomCtrl = new AssetGraphZoomControllerNode(0.15, 4.5);
    zoomCtrl.attach(svgRef.current, (newTransform) => {
      setZoomTransform(newTransform);
    });

    zoomControllerRef.current = zoomCtrl;

    // Initial Smooth Frame on Nodes after simulation settles
    const timer = setTimeout(() => {
      if (filteredNodes.length > 0 && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        zoomCtrl.zoomToFit(filteredNodes, rect.width || 800, rect.height || 600, 80, 500);
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      zoomCtrl.destroy();
      zoomControllerRef.current = null;
    };
  }, [currentPresetId]);

  // Animation pulse loop
  useEffect(() => {
    if (!filterState.showParticlePulses) return;

    const interval = setInterval(() => {
      setPulseTick(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, [filterState.showParticlePulses]);

  // Actions
  const handleSelectPreset = (presetId: string) => {
    setCurrentPresetId(presetId);
    repository.loadPreset(presetId);
    setFilterState(prev => ({ ...prev, selectedNodeId: null, searchQuery: '' }));
  };

  const handleTogglePause = () => {
    if (!simulationRef.current) return;
    if (isPaused) {
      simulationRef.current.resume();
      setIsPaused(false);
    } else {
      simulationRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleReheat = () => {
    if (simulationRef.current) {
      simulationRef.current.reheat(0.8);
      setIsPaused(false);
    }
  };

  const handleUnpinAll = () => {
    if (simulationRef.current) {
      simulationRef.current.unpinAllNodes();
    }
  };

  const handleTogglePinNode = (node: AssetNode) => {
    if (node.fx !== null && node.fx !== undefined) {
      node.fx = null;
      node.fy = null;
    } else {
      node.fx = node.x;
      node.fy = node.y;
    }
    setNodes([...nodes]);
  };

  const handleCleanOrphans = () => {
    const cleaned = repository.removeOrphanAssets(orphanIds);
    setFilterState(prev => ({ ...prev, statusFilter: 'all' }));
  };

  // Drag interaction
  const handleNodeMouseDown = (e: React.MouseEvent, node: AssetNode) => {
    e.stopPropagation();
    if (!simulationRef.current) return;

    const sim = simulationRef.current;
    sim.handleDragStart(node);

    const startX = e.clientX;
    const startY = e.clientY;
    const origNodeX = node.x || 0;
    const origNodeY = node.y || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startX) / zoomTransform.k;
      const dy = (moveEvent.clientY - startY) / zoomTransform.k;
      sim.handleDrag(node, origNodeX + dx, origNodeY + dy);
      setNodes([...nodes]);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      sim.handleDragEnd(node, false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Zoom helpers delegating to smooth zoom controller
  const handleZoomIn = () => {
    if (zoomControllerRef.current) {
      zoomControllerRef.current.smoothZoomIn(1.3, 300);
    }
  };

  const handleZoomOut = () => {
    if (zoomControllerRef.current) {
      zoomControllerRef.current.smoothZoomOut(0.77, 300);
    }
  };

  const handleResetZoom = () => {
    if (zoomControllerRef.current) {
      zoomControllerRef.current.zoomToFit(
        filteredNodes,
        canvasDimensions.width || 800,
        canvasDimensions.height || 600,
        85,
        500
      );
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const data = {
      projectPreset: currentPresetId,
      exportedAt: new Date().toISOString(),
      metrics,
      nodes,
      links
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Asset_Dependency_Topology_${currentPresetId}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export SVG Snapshot
  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Asset_Topology_Snapshot_${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      id="asset-dependency-studio"
      className="w-full h-full flex flex-col bg-[#0d1117] text-gray-200 overflow-hidden select-none font-sans"
    >
      {/* Top Filter & Actions Toolbar */}
      <AssetDependencyFilterToolbar
        filterState={filterState}
        currentPresetId={currentPresetId}
        isPaused={isPaused}
        onUpdateFilter={(updates) => setFilterState(prev => ({ ...prev, ...updates }))}
        onSelectPreset={handleSelectPreset}
        onTogglePause={handleTogglePause}
        onReheat={handleReheat}
        onUnpinAll={handleUnpinAll}
        onExportJSON={handleExportJSON}
        onExportSVG={handleExportSVG}
        clusteringEnabled={clusteringEnabled}
        onToggleClustering={() => setClusteringEnabled(!clusteringEnabled)}
      />

      {/* Real-Time Metrics Summary & Health Bar */}
      <AssetDependencyMetricsBar
        metrics={metrics}
        onCleanOrphans={handleCleanOrphans}
        onFilterStatus={(status) => setFilterState(prev => ({ ...prev, statusFilter: status }))}
        currentStatusFilter={filterState.statusFilter}
      />

      {/* Main Workspace Area (SVG Graph Canvas + Right Inspector) */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* SVG Canvas Container */}
        <div 
          ref={containerRef}
          className="flex-1 h-full relative overflow-hidden cursor-grab active:cursor-grabbing bg-[radial-gradient(#1e2632_1px,transparent_1px)] [background-size:24px_24px]"
        >
          <svg
            ref={svgRef}
            id="asset-topology-svg"
            className="w-full h-full block"
          >
            <defs>
              {/* Arrowhead Markers for Dependency Links */}
              <marker
                id="arrow-default"
                viewBox="0 -5 10 10"
                refX={28}
                refY={0}
                markerWidth={6}
                markerHeight={6}
                orient="auto"
              >
                <path d="M0,-5L10,0L0,5" fill="#484f58" />
              </marker>

              <marker
                id="arrow-highlight"
                viewBox="0 -5 10 10"
                refX={28}
                refY={0}
                markerWidth={7}
                markerHeight={7}
                orient="auto"
              >
                <path d="M0,-5L10,0L0,5" fill="#58a6ff" />
              </marker>

              <marker
                id="arrow-broken"
                viewBox="0 -5 10 10"
                refX={28}
                refY={0}
                markerWidth={6}
                markerHeight={6}
                orient="auto"
              >
                <path d="M0,-5L10,0L0,5" fill="#f85149" />
              </marker>

              {/* Glowing Filters */}
              <filter id="glow-selected" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Transform Container Group */}
            <g transform={`translate(${zoomTransform.x}, ${zoomTransform.y}) scale(${zoomTransform.k})`}>
              {/* 1. Dependency Links */}
              <g className="links-layer">
                {filteredLinks.map((link) => {
                  const source = link.source as AssetNode;
                  const target = link.target as AssetNode;
                  if (!source.x || !source.y || !target.x || !target.y) return null;

                  const srcId = source.id;
                  const tgtId = target.id;
                  const isBroken = target.status === 'missing';
                  const isConnectedToActive = connectedNodeIds
                    ? (connectedNodeIds.has(srcId) && connectedNodeIds.has(tgtId))
                    : false;

                  const isDimmed = connectedNodeIds !== null && !isConnectedToActive;

                  let strokeColor = '#30363d';
                  let markerEnd = 'url(#arrow-default)';

                  if (isBroken) {
                    strokeColor = '#f85149';
                    markerEnd = 'url(#arrow-broken)';
                  } else if (isConnectedToActive) {
                    strokeColor = '#58a6ff';
                    markerEnd = 'url(#arrow-highlight)';
                  }

                  // Calculate mid-point for animated particle pulse
                  const tPulse = (pulseTick % 100) / 100;
                  const pulseX = source.x + (target.x - source.x) * tPulse;
                  const pulseY = source.y + (target.y - source.y) * tPulse;

                  return (
                    <g key={link.id} className="transition-opacity duration-200">
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={strokeColor}
                        strokeWidth={isConnectedToActive ? 2.5 : isBroken ? 2 : 1.5}
                        strokeDasharray={isBroken ? '4 3' : undefined}
                        opacity={isDimmed ? 0.15 : 0.85}
                        markerEnd={markerEnd}
                      />

                      {/* Animated Particle Stream Pulse along active link */}
                      {filterState.showParticlePulses && !isDimmed && !isBroken && (
                        <circle
                          cx={pulseX}
                          cy={pulseY}
                          r={isConnectedToActive ? 3.5 : 2}
                          fill={isConnectedToActive ? '#79c0ff' : '#a855f7'}
                          opacity={0.8}
                        />
                      )}

                      {/* Optional Link Slot Label on hover/selected */}
                      {isConnectedToActive && link.slotName && (
                        <text
                          x={(source.x + target.x) / 2}
                          y={(source.y + target.y) / 2 - 4}
                          fill="#8b949e"
                          fontSize="9"
                          textAnchor="middle"
                          className="font-mono select-none pointer-events-none"
                        >
                          {link.slotName}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* 2. Asset Nodes */}
              <g className="nodes-layer">
                {filteredNodes.map((node) => {
                  if (node.x === undefined || node.y === undefined) return null;

                  const isSelected = filterState.selectedNodeId === node.id;
                  const isHovered = hoveredNodeId === node.id;
                  const isConnected = connectedNodeIds ? connectedNodeIds.has(node.id) : false;
                  const isDimmed = connectedNodeIds !== null && !isConnected;
                  const isOrphan = orphanIds.has(node.id) || node.status === 'orphaned';
                  const isMissing = node.status === 'missing';
                  const isPinned = node.fx !== null && node.fx !== undefined;

                  const typeCfg = TYPE_CONFIG[node.type] || TYPE_CONFIG.model_3d;

                  // Node Radius (Larger for Models and Prefabs)
                  const radius = (node.type === 'model_3d' || node.type === 'prefab') ? 22 : 18;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onMouseDown={(e) => handleNodeMouseDown(e, node)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterState(prev => ({
                          ...prev,
                          selectedNodeId: prev.selectedNodeId === node.id ? null : node.id
                        }));
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (zoomControllerRef.current) {
                          zoomControllerRef.current.centerOnNode(
                            node,
                            canvasDimensions.width,
                            canvasDimensions.height,
                            1.35,
                            450
                          );
                        }
                      }}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className="cursor-pointer transition-opacity duration-200"
                      opacity={isDimmed ? 0.2 : 1}
                    >
                      {/* Selection Glowing Halo */}
                      {(isSelected || isHovered) && (
                        <circle
                          r={radius + 8}
                          fill="none"
                          stroke={isSelected ? '#58a6ff' : typeCfg.stroke}
                          strokeWidth="2.5"
                          opacity="0.8"
                          filter="url(#glow-selected)"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        r={radius}
                        fill={isMissing ? '#450a0a' : isOrphan ? '#451a03' : typeCfg.fill}
                        stroke={isMissing ? '#ef4444' : isOrphan ? '#f59e0b' : typeCfg.stroke}
                        strokeWidth={isSelected ? 3 : 2}
                        strokeDasharray={isOrphan ? '3 2' : undefined}
                      />

                      {/* Node Icon / Glyphs */}
                      {node.type === 'model_3d' && (
                        <text
                          y={4}
                          textAnchor="middle"
                          fill="#fef08a"
                          fontSize="12"
                          fontWeight="bold"
                          className="select-none pointer-events-none font-mono"
                        >
                          3D
                        </text>
                      )}
                      {node.type === 'texture' && (
                        <text
                          y={4}
                          textAnchor="middle"
                          fill="#e9d5ff"
                          fontSize="11"
                          fontWeight="bold"
                          className="select-none pointer-events-none font-mono"
                        >
                          TEX
                        </text>
                      )}
                      {node.type === 'material' && (
                        <text
                          y={4}
                          textAnchor="middle"
                          fill="#a7f3d0"
                          fontSize="11"
                          fontWeight="bold"
                          className="select-none pointer-events-none font-mono"
                        >
                          MAT
                        </text>
                      )}
                      {node.type === 'prefab' && (
                        <text
                          y={4}
                          textAnchor="middle"
                          fill="#fed7aa"
                          fontSize="11"
                          fontWeight="bold"
                          className="select-none pointer-events-none font-mono"
                        >
                          BP
                        </text>
                      )}
                      {node.type === 'shader' && (
                        <text
                          y={4}
                          textAnchor="middle"
                          fill="#bfdbfe"
                          fontSize="11"
                          fontWeight="bold"
                          className="select-none pointer-events-none font-mono"
                        >
                          SHD
                        </text>
                      )}

                      {/* Pinned Pin Icon Indicator */}
                      {isPinned && (
                        <circle
                          cx={radius - 4}
                          cy={-radius + 4}
                          r={4}
                          fill="#f59e0b"
                        />
                      )}

                      {/* Missing Reference Alert Indicator */}
                      {isMissing && (
                        <g transform={`translate(${radius - 4}, ${-radius + 4})`}>
                          <circle r={5} fill="#ef4444" />
                          <text y={3} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">!</text>
                        </g>
                      )}

                      {/* Node Label Text */}
                      {filterState.showLabels && (
                        <g transform={`translate(0, ${radius + 12})`}>
                          {/* Label Background pill for contrast */}
                          <rect
                            x={-Math.min(node.name.length * 3.4 + 6, 60)}
                            y={-10}
                            width={Math.min(node.name.length * 6.8 + 12, 120)}
                            height={16}
                            rx={4}
                            fill="#161b22"
                            fillOpacity="0.85"
                            stroke="#30363d"
                            strokeWidth="0.8"
                          />
                          <text
                            textAnchor="middle"
                            fill={isSelected ? '#58a6ff' : '#e6edf3'}
                            fontSize="10"
                            fontWeight={isSelected ? 'bold' : 'normal'}
                            className="select-none pointer-events-none"
                          >
                            {node.name.length > 18 ? `${node.name.slice(0, 16)}…` : node.name}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>

          {/* Interactive Topology Minimap Radar */}
          {showMinimap && (
            <div className="absolute top-3 right-4 z-20">
              <AssetGraphMinimapRadar
                nodes={filteredNodes}
                zoomTransform={zoomTransform}
                viewportWidth={canvasDimensions.width}
                viewportHeight={canvasDimensions.height}
                zoomController={zoomControllerRef.current}
                selectedNodeId={filterState.selectedNodeId}
              />
            </div>
          )}

          {/* Smooth Canvas Navigation Controls Island */}
          <div className="absolute bottom-4 left-4 z-20">
            <AssetGraphCanvasNavigationControls
              zoomTransform={zoomTransform}
              zoomController={zoomControllerRef.current}
              nodes={filteredNodes}
              selectedNode={selectedNode}
              viewportWidth={canvasDimensions.width}
              viewportHeight={canvasDimensions.height}
              showMinimap={showMinimap}
              onToggleMinimap={() => setShowMinimap(prev => !prev)}
            />
          </div>

          {/* Topology Legend Bar */}
          <div className="absolute top-3 left-4 hidden md:flex items-center gap-2 bg-[#161b22]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#30363d] text-[11px] shadow-lg z-10">
            <span className="text-gray-400 font-medium mr-1">Legend:</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-gray-300">Model 3D</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-gray-300">PBR Texture</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-gray-300">Material</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-gray-300">Prefab</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-gray-300">Missing Link</span>
            </div>
          </div>
        </div>

        {/* Right Asset Node Inspector Panel */}
        <AssetDependencyNodeInspector
          node={selectedNode}
          allNodes={nodes}
          allLinks={links}
          onClose={() => setFilterState(prev => ({ ...prev, selectedNodeId: null }))}
          onSelectNode={(id) => setFilterState(prev => ({ ...prev, selectedNodeId: id }))}
          onTogglePin={handleTogglePinNode}
          onDeleteNode={(id) => {
            repository.deleteNode(id);
            setFilterState(prev => ({ ...prev, selectedNodeId: null }));
          }}
        />
      </div>
    </div>
  );
}
