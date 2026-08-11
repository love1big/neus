import React, { useState, useRef, useEffect } from 'react';
import { Map, Grid3X3, Layers, Settings, ZoomIn, ZoomOut, Save, Plus, Target, Compass, Cloud, MapPin, Search, Edit3, Type, X, BrainCircuit, Scan, Trees, Droplets, Thermometer, Mountain, Brush, Eye, EyeOff, BarChart2, Lock, Unlock, Trash2, History, Undo2, User, Clock, BedDouble, Hammer, Coffee, GripVertical, CalendarDays, Sun, Wind, Camera, Box, Move, Route, Activity, Video, Aperture, Play, Pause, Rewind, FastForward, GitBranch, MessageSquare, Network, Zap, Database, Terminal, Webhook, BoxSelect, Cpu, CheckSquare, Braces, GitCommit, Circle, Square, Edit2, Snowflake, Flame, CloudRain, Star, Pointer, Pickaxe, Sprout, Building, Building2, TreePine, Fence, Paintbrush, Pipette, PaintBucket, Maximize, Minimize, Crosshair, Grab, Shield, ShieldAlert, Skull, Radio, Anchor, Moon, Scissors, Copy, ClipboardPaste, ArrowUpFromLine, ArrowDownToLine, MousePointer2, Wand2, ArrowUp, ArrowDown, Leaf, Sparkles, Hexagon, Ruler, Magnet, Volume2, Eraser, Dices, Shuffle, AlignCenter, LayoutGrid, TramFront, Droplet, Layers3, ActivitySquare, Waves, CloudFog, DownloadCloud} from 'lucide-react';
import TaskStatusBoard from './TaskStatusBoard';
import Viewport3D from './Viewport3D';
import MapAssetBrowser from './MapAssetBrowser';
import MapEntityEditor from './MapEntityEditor';
import MapCinematicEditor from './MapCinematicEditor';
import MapPCGEditor from "./MapPCGEditor";
import MapRoadEditor from "./MapRoadEditor";
import MapWaterEditor from "./MapWaterEditor";
import MapArchitectureEditor from "./MapArchitectureEditor";
import MapBiomeEditor from "./MapBiomeEditor";
import MapModelEditor from "./MapModelEditor";
import MapPhysicsEditor from "./MapPhysicsEditor";
import MapTerrainEditor from "./MapTerrainEditor";
import MapEnvironmentEditor from "./MapEnvironmentEditor";

import MapAudioTools from './MapAudioTools';

function MiniMapCanvas({ styleType, biomeStrokes, width, height, mapLayers, markers }: { styleType: string, biomeStrokes: any[], width: number, height: number, mapLayers: any[], markers?: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseVisible = mapLayers.find(l => l.name === 'Base Terrain')?.visible;
    const foliageVisible = mapLayers.find(l => l.name === 'Foliage & Environment')?.visible;
    const pathAnalysisVisible = mapLayers.find(l => l.name === 'Dynamic Path Analysis')?.visible;

    // Clear and draw background noise based on style
    ctx.clearRect(0, 0, width, height);
    
    if (baseVisible || pathAnalysisVisible) {
      const gridSize = 10;
      const cols = width / gridSize;
      const rows = height / gridSize;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = x / cols - 0.5;
          const ny = y / rows - 0.5;
          const dist = Math.sqrt(nx * nx + ny * ny);
          const elevation = (Math.sin(nx * 10) + Math.cos(ny * 10) + 2) / 4;
          const moisture = (Math.sin(nx * 20 + ny * 5) + 1) / 2;

          if (baseVisible) {
            let r = 0, g = 0, b = 0;
            if (styleType === 'fantasy') {
               r=200; g=170; b=120;
               if (elevation > 0.7) { r=160; g=140; b=110; }
               else if (dist > 0.4) { r=130; g=160; b=180; }
               else if (moisture > 0.6) { r=150; g=180; b=130; }
            } else if (styleType === 'sci-fi') {
               r=0; g=20; b=40;
               if (elevation > 0.7) { r=0; g=60; b=80; }
               else if (dist > 0.4) { r=0; g=10; b=20; }
               else if (moisture > 0.6) { r=0; g=100; b=150; }
            } else {
               r=30; g=35; b=40;
               if (elevation > 0.7) { r=50; g=55; b=60; }
               else if (dist > 0.4) { r=20; g=40; b=80; }
               else if (moisture > 0.6) { r=40; g=80; b=50; }
            }
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
          }

          if (pathAnalysisVisible) {
             // Bottleneck / impassable visualization
             // High elevation or outer bounds might be impassable -> red crosshatch
             if (elevation > 0.75 || dist > 0.45) {
                ctx.fillStyle = 'rgba(248, 81, 73, 0.4)';
                ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
             } else if (elevation > 0.6 && elevation <= 0.75) {
                // Bottleneck
                ctx.fillStyle = 'rgba(227, 179, 65, 0.3)';
                ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
             }
          }
        }
      }
    }

    // Draw user-painted biomes
    if (foliageVisible) {
      biomeStrokes.forEach(stroke => {
         ctx.fillStyle = stroke.type === 'TUNDRA' ? 'rgba(56, 189, 248, 0.6)' :
                         stroke.type === 'DESERT' ? 'rgba(234, 179, 8, 0.6)' :
                         stroke.type === 'FOREST' ? 'rgba(34, 197, 94, 0.6)' :
                         stroke.type === 'JUNGLE' ? 'rgba(5, 150, 105, 0.6)' :
                         stroke.type === 'OCEAN' ? 'rgba(37, 99, 235, 0.6)' :
                         'rgba(249, 115, 22, 0.6)';
         stroke.points.forEach((pt: any) => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
            ctx.fill();
         });
      });
    }

    // Draw hypothetical paths between points of interest
    if (pathAnalysisVisible && markers) {
       ctx.strokeStyle = 'rgba(188, 140, 255, 0.8)'; // Purple AI paths
       ctx.lineWidth = 2;
       ctx.setLineDash([4, 4]);

       const npcs = markers.filter(m => m.type === 'npc');
       const dests = markers.filter(m => m.type === 'town' || m.type === 'dungeon' || m.type === 'shop');
       
       npcs.forEach(npc => {
           dests.forEach(dest => {
              // Simulate navigation paths curving around high elevation
              ctx.beginPath();
              ctx.moveTo(npc.x, npc.y);
              
              const dx = dest.x - npc.x;
              const dy = dest.y - npc.y;
              
              // control point
              const cx = npc.x + dx / 2 + (Math.random() * 60 - 30);
              const cy = npc.y + dy / 2 + (Math.random() * 60 - 30);
              
              ctx.quadraticCurveTo(cx, cy, dest.x, dest.y);
              ctx.stroke();
           });
       });
       
       ctx.setLineDash([]);
    }
  }, [styleType, biomeStrokes, width, height, mapLayers, markers]);

  return <canvas ref={canvasRef} width={width} height={height} className="absolute inset-0 transition-opacity opacity-80 mix-blend-screen" />;
}

function CompositionGuideOverlay({ activeGuide, visible }: { activeGuide: string, visible: boolean }) {
  if (!visible || activeGuide === 'None (Clean Plate)') return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden flex items-center justify-center">
      {activeGuide === 'Rule of Thirds (3x3)' && (
        <div className="w-full h-full border-2 border-[#e3b341]/30 flex flex-col relative">
           <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-[#e3b341]/50"></div>
           <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-[#e3b341]/50"></div>
           <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-[#e3b341]/50"></div>
           <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-[#e3b341]/50"></div>
           {/* Intersections */}
           <div className="absolute top-1/3 left-1/3 w-2 h-2 border border-[#e3b341] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#e3b341]/20"></div>
           <div className="absolute top-1/3 left-2/3 w-2 h-2 border border-[#e3b341] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#e3b341]/20"></div>
           <div className="absolute top-2/3 left-1/3 w-2 h-2 border border-[#e3b341] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#e3b341]/20"></div>
           <div className="absolute top-2/3 left-2/3 w-2 h-2 border border-[#e3b341] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#e3b341]/20"></div>
        </div>
      )}

      {activeGuide === 'Golden Ratio Grid (Phi Grid)' && (
         <div className="w-full h-full border-2 border-[#e3b341]/30 flex flex-col relative">
           <div className="absolute top-[38.2%] left-0 right-0 h-[1px] bg-[#e3b341]/50"></div>
           <div className="absolute top-[61.8%] left-0 right-0 h-[1px] bg-[#e3b341]/50"></div>
           <div className="absolute left-[38.2%] top-0 bottom-0 w-[1px] bg-[#e3b341]/50"></div>
           <div className="absolute left-[61.8%] top-0 bottom-0 w-[1px] bg-[#e3b341]/50"></div>
           
           <div className="absolute top-[38.2%] left-[38.2%] w-2 h-2 border border-[#e3b341] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#e3b341]/20"></div>
           <div className="absolute top-[38.2%] left-[61.8%] w-2 h-2 border border-[#e3b341] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#e3b341]/20"></div>
           <div className="absolute top-[61.8%] left-[38.2%] w-2 h-2 border border-[#e3b341] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#e3b341]/20"></div>
           <div className="absolute top-[61.8%] left-[61.8%] w-2 h-2 border border-[#e3b341] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#e3b341]/20"></div>
         </div>
      )}

      {activeGuide === 'Golden Spiral (Fibonacci)' && (
         <div className="w-full h-full border-2 border-[#e3b341]/30 flex relative justify-center items-center">
             <svg width="100%" height="100%" viewBox="0 0 1000 618" preserveAspectRatio="xMidYMid meet" className="stroke-[#e3b341]/60 fill-none" strokeWidth="2">
                 <rect x="0" y="0" width="1000" height="618" strokeDasharray="4,4" />
                 <path d="M618,0 L618,618" strokeDasharray="4,4" />
                 <path d="M618,236 L1000,236" strokeDasharray="4,4" />
                 <path d="M764,236 L764,618" strokeDasharray="4,4" />
                 <path d="M764,382 L618,382" strokeDasharray="4,4" />
                 <path d="M673,382 L673,236" strokeDasharray="4,4" />
                 <path d="M673,291 L764,291" strokeDasharray="4,4" />
                 <path d="M707,291 L707,382" strokeDasharray="4,4" />
                 
                 <path d="M1000,0 A618,618 0 0,1 382,618" className="opacity-0" />
                 <path d="M382,618 A382,382 0 0,1 764,1000" className="opacity-0" />
                 <path d="M764,1000 A236,236 0 0,1 1000,764" className="opacity-0" />
                 
                 <path d="M618,618 A382,382 0 0,0 1000,236" />
                 <path d="M1000,236 A236,236 0 0,0 764,0" />
                 <path d="M764,0 A146,146 0 0,0 618,146" />
                 <path d="M618,146 A91,91 0 0,0 709,237" />
                 <path d="M709,237 A55,55 0 0,0 764,182" />
             </svg>
         </div>
      )}
      
      {activeGuide === 'Golden Triangles' && (
         <div className="w-full h-full border-2 border-[#e3b341]/30 flex relative overflow-hidden">
             <svg width="100%" height="100%" preserveAspectRatio="none" className="stroke-[#e3b341]/50 fill-none" strokeWidth="2">
                 <line x1="0" y1="0" x2="100%" y2="100%" />
                 <line x1="0" y1="100%" x2="61.8%" y2="0" />
                 <line x1="100%" y1="0" x2="38.2%" y2="100%" />
             </svg>
             <div className="absolute top-[38.2%] left-[61.8%] w-2 h-2 border border-[#e3b341] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#e3b341]/20"></div>
             <div className="absolute top-[61.8%] left-[38.2%] w-2 h-2 border border-[#e3b341] rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#e3b341]/20"></div>
         </div>
      )}
      
      {activeGuide === 'Diagonal Method' && (
         <div className="w-full h-full border-2 border-[#e3b341]/30 flex relative overflow-hidden">
             <svg width="100%" height="100%" preserveAspectRatio="none" className="stroke-[#e3b341]/50 fill-none" strokeWidth="2">
                 <line x1="0" y1="0" x2="100%" y2="100%" />
                 <line x1="0" y1="100%" x2="100%" y2="0" />
                 {/* Diagonal intersections from corners to the opposite diagonals at 90 degrees */}
                 <path d="M0,100% L25%,25% M100%,100% L75%,25% M0,0 L25%,75% M100%,0 L75%,75%" className="stroke-[#e3b341]/30" strokeDasharray="4,4" />
             </svg>
         </div>
      )}

      {activeGuide === 'Center Crosshair' && (
         <div className="w-full h-full flex items-center justify-center relative">
            <div className="w-8 h-[1px] bg-[#e3b341]"></div>
            <div className="h-8 w-[1px] bg-[#e3b341] absolute"></div>
            <div className="w-3 h-3 border border-[#e3b341]/50 rounded-full absolute"></div>
         </div>
      )}
    </div>
  );
}

export default function MapEdit() {
  const [activeTab, setActiveTab] = useState('grid');
  const [showGridOverlay, setShowGridOverlay] = useState(true);
  const [mapSizeInMc, setMapSizeInMc] = useState(16000); // 16x16 km = 16000x16000 mc
  const [miniMapStyle, setMiniMapStyle] = useState('fantasy');
  const [activeCompositionGuide, setActiveCompositionGuide] = useState('Golden Ratio Grid (Phi Grid)');
  const [showCompositionGuide, setShowCompositionGuide] = useState(false);
  const [mainViewMode, setMainViewMode] = useState<'2D' | '3D'>('2D');
  const [hoveredCoord, setHoveredCoord] = useState<{x: number, y: number, elevation: number} | null>(null);
  const [selectedToolItem, setSelectedToolItem] = useState<string>('Castle');
  const [brushSize, setBrushSize] = useState<number>(2);
  
  // Detailed Grid Settings
  const [gridChunkSize, setGridChunkSize] = useState(16);
  const [gridOpacity, setGridOpacity] = useState(25);
  const [gridColor, setGridColor] = useState('#ffffff');
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [showNavMeshGrid, setShowNavMeshGrid] = useState(false);
  const [navMeshResolution, setNavMeshResolution] = useState(0.5);
  const [showChunkBorders, setShowChunkBorders] = useState(true);
  const [gridStyle, setGridStyle] = useState('solid'); // solid, dashed, dots
  const [zoomLevel, setZoomLevel] = useState(1);
  const [smartSnapping, setSmartSnapping] = useState(false);
  
  // Specific markers for the Mini Map Editor
  const [markers, setMarkers] = useState<{ id: number, type: string, x: number, y: number, label: string, config?: any }[]>([
    { id: 1, type: 'town', x: 250, y: 150, label: 'Eldoria Capital' },
    { id: 2, type: 'dungeon', x: 400, y: 350, label: 'Crystal Caverns' },
    { id: 3, type: 'shop', x: 260, y: 160, label: 'Merchant Guild' },
    { id: 4, type: 'quest', x: 300, y: 200, label: 'Lost Artifact' },
    { id: 5, type: 'npc', x: 320, y: 180, label: 'Wandering Merchant', config: { schedule: 'ai_auto', homeId: 1 } },
  ]);

  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const [draggingMarkerId, setDraggingMarkerId] = useState<number | null>(null);

  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    town: true,
    dungeon: true,
    shop: true,
    quest: true,
    npc: true,
    text: true
  });

  // Layer System
  const [mapLayers, setMapLayers] = useState([
    { id: 1, name: 'Base Terrain', visible: true, locked: false },
    { id: 2, name: 'Foliage & Environment', visible: true, locked: false },
    { id: 3, name: 'Entities & POIs', visible: true, locked: false },
    { id: 4, name: 'AI Generation Mesh', visible: true, locked: true },
    { id: 5, name: 'Dynamic Path Analysis', visible: false, locked: true },
  ]);
  const [activeLayer, setActiveLayer] = useState(1);

  const toggleLayerViz = (id: number) => {
    setMapLayers(mapLayers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const toggleLayerLock = (id: number) => {
    setMapLayers(mapLayers.map(l => l.id === id ? { ...l, locked: !l.locked } : l));
  };

  // Biome Brush settings
  const [biomeElevation, setBiomeElevation] = useState(50);
  const [biomeMoisture, setBiomeMoisture] = useState(50);
  const [biomeTemperature, setBiomeTemperature] = useState(50);
  const [activeBiomeType, setActiveBiomeType] = useState('AI_AUTO'); // Default to AI inference
  
  const [biomeStrokes, setBiomeStrokes] = useState<{ id: string, type: string, points: {x: number, y: number, size: number}[], timestamp: number }[]>([]);
  const currentStrokeId = useRef<string | null>(null);

  const startMiniMapPaint = (e: React.MouseEvent<HTMLDivElement>) => {
    currentStrokeId.current = Date.now().toString();
    handleMiniMapPaint(e, true);
  };

  const stopMiniMapPaint = () => {
    currentStrokeId.current = null;
  };

  const handleMiniMapPaint = (e: React.MouseEvent<HTMLDivElement>, isStart = false) => {
    if (e.buttons !== 1) return; // Only draw on left click/drag
    if (!currentStrokeId.current && !isStart) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let bType = activeBiomeType;
    if (bType === 'AI_AUTO') {
       if (biomeElevation < 30 && biomeMoisture > 70) bType = 'OCEAN';
       else if (biomeTemperature < 30) bType = 'TUNDRA';
       else if (biomeTemperature > 70 && biomeMoisture < 30) bType = 'DESERT';
       else if (biomeTemperature > 70 && biomeMoisture > 70) bType = 'JUNGLE';
       else bType = 'FOREST';
    }

    const strokeId = currentStrokeId.current;
    if (!strokeId) return;

    setBiomeStrokes(prev => {
       const existing = prev.find(s => s.id === strokeId);
       if (existing) {
          return prev.map(s => s.id === strokeId ? { ...s, points: [...s.points, { x, y, size: 30 }] } : s);
       } else {
          return [...prev, { id: strokeId, type: bType, points: [{ x, y, size: 30 }], timestamp: Date.now() }];
       }
    });
  };

  const addMarker = (type: string) => {
    const newMarker = { 
      id: Date.now(), 
      type, 
      x: 300, 
      y: 250, 
      label: `New ${type}`,
      config: type === 'npc' ? { schedule: 'ai_auto', homeId: 'none' } : undefined
    };
    setMarkers([...markers, newMarker]);
    if (type === 'npc') setSelectedMarkerId(newMarker.id);
  };

  const removeMarker = (id: number) => {
    setMarkers(markers.filter(m => m.id !== id));
  };

  const handleViewportMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingMarkerId !== null) {
      const rect = e.currentTarget.getBoundingClientRect();
      // Adjust coordinate taking 3D rotation into account roughly, or just use flat 2D mapping for MVP demo
      let newX = e.clientX - rect.left;
      let newY = e.clientY - rect.top;

      let snapUnit = 1;

      if (snapToGrid) {
        if (smartSnapping) {
           let baseSize = 40 * zoomLevel;
           if (zoomLevel >= 10) {
              baseSize = 40 * (zoomLevel / 10);
           } else if (zoomLevel >= 5) {
              baseSize = 40 * (zoomLevel / 5);
           }
           snapUnit = baseSize;
        } else {
           snapUnit = 40 * zoomLevel; // snap to standard grid size
        }
        
        newX = Math.round(newX / snapUnit) * snapUnit;
        newY = Math.round(newY / snapUnit) * snapUnit;
      }

      setMarkers(markers.map(m => m.id === draggingMarkerId ? { ...m, x: newX, y: newY } : m));
    }
  };

  const handleViewportMouseUp = () => {
    setDraggingMarkerId(null);
  };

  return (
    <div className="w-full h-full bg-[#0a0a0f] flex flex-col text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-[#2a2b3d] bg-[#11111b] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#3fb950]/20 flex items-center justify-center text-[#3fb950] border border-[#3fb950]/30">
            <Map size={18} />
          </div>
          <div>
            <h1 className="font-bold text-[14px]">Ultimate Grid Map Editor</h1>
            <div className="text-[10px] text-[#8b949e] flex items-center gap-2">
              <span className="flex items-center gap-1"><Grid3X3 size={10} /> 1 mc = 1m x 1m</span>
              <span>1 mc = 100 cc | 1 cc = 100 bc | 1 bc = 100 vc</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#1e1e2d] p-1 rounded flex items-center gap-1 border border-[#2a2b3d]">
            <button 
              onClick={() => setMainViewMode('2D')}
              className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${mainViewMode === '2D' ? 'bg-[#58a6ff] text-[#0a0a0f] shadow-md' : 'text-[#8b949e] hover:text-white'}`}
            >
              <Compass size={14} /> 2D Map Canvas
            </button>
            <button 
              onClick={() => setMainViewMode('3D')}
              className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${mainViewMode === '3D' ? 'bg-[#d2a8ff] text-[#0a0a0f] shadow-md' : 'text-[#8b949e] hover:text-white'}`}
            >
              <Mountain size={14} /> 3D Simulated View
            </button>
          </div>
          <button 
            onClick={() => setShowGridOverlay(!showGridOverlay)}
            className={`px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold transition-colors ${showGridOverlay ? 'bg-[#3fb950] text-[#0a0a0f]' : 'bg-[#1e1e2d] text-white hover:bg-[#2a2b3d]'}`}
          >
            <Grid3X3 size={14} /> Toggle Grid Overlay
          </button>
          <button className="p-2 border border-[#2a2b3d] rounded bg-[#161621] hover:bg-[#2a2b3d] text-[#c9d1d9]"><Save size={16} /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-[60px] border-r border-[#2a2b3d] bg-[#161621] flex flex-col items-center py-2 shrink-0 gap-2 overflow-y-auto custom-scrollbar">
          <button onClick={() => setActiveTab('grid')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'grid' ? 'bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Grid / Coordinates">
            <Grid3X3 size={20} />
          </button>
          <button onClick={() => setActiveTab('layers')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'layers' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Map Layers">
            <Layers size={20} />
          </button>

          <div className="w-8 h-[1px] bg-[#2a2b3d] my-1 shrink-0"></div>

          <button onClick={() => setActiveTab('assets')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'assets' ? 'bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Asset Store & Model Browser">
            <DownloadCloud size={20} />
          </button>
          <button onClick={() => setActiveTab('maptools')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'maptools' ? 'bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Map Edit Tools & Areas">
            <BoxSelect size={20} />
          </button>
          <button onClick={() => setActiveTab('terrain')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'terrain' ? 'bg-[#d2a8ff]/20 text-[#d2a8ff] border border-[#d2a8ff]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Terrain Sculpting">
            <Mountain size={20} />
          </button>
          <button onClick={() => setActiveTab('textures')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'textures' ? 'bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Texture & Landscape Materials">
            <Brush size={20} />
          </button>
          <button onClick={() => setActiveTab('water')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'water' ? 'bg-[#79c0ff]/20 text-[#79c0ff] border border-[#79c0ff]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Water Physics & Rivers">
            <Droplets size={20} />
          </button>
          <button onClick={() => setActiveTab('biome')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'biome' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Auto Biome Generator Brush">
            <Trees size={20} />
          </button>
          <button onClick={() => setActiveTab('roads')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'roads' ? 'bg-[#f0f6fc]/20 text-[#f0f6fc] border border-[#f0f6fc]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Path & Road Networks">
            <Route size={20} />
          </button>
          <button onClick={() => setActiveTab('structures')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'structures' ? 'bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Architecture & Structures">
            <Hammer size={20} />
          </button>
          <button onClick={() => setActiveTab('entities')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'entities' ? 'bg-[#ffa657]/20 text-[#ffa657] border border-[#ffa657]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Entities & Spawns">
            <User size={20} />
          </button>
          <button onClick={() => setActiveTab('models')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'models' ? 'bg-[#ff69b4]/20 text-[#ff69b4] border border-[#ff69b4]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="3D Model Editor">
            <Box size={20} />
          </button>

          <div className="w-8 h-[1px] bg-[#2a2b3d] my-1 shrink-0"></div>

          <button onClick={() => setActiveTab('lighting')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'lighting' ? 'bg-[#f2cc60]/20 text-[#f2cc60] border border-[#f2cc60]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Lighting & Day/Night Cycle">
            <Sun size={20} />
          </button>
          <button onClick={() => setActiveTab('weather')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'weather' ? 'bg-[#a5d6ff]/20 text-[#a5d6ff] border border-[#a5d6ff]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Weather System">
            <Wind size={20} />
          </button>
          <button onClick={() => setActiveTab('camera')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'camera' ? 'bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Cinematic Cameras">
            <Camera size={20} />
          </button>

          <div className="w-8 h-[1px] bg-[#2a2b3d] my-1 shrink-0"></div>

          <button onClick={() => setActiveTab('minimap')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'minimap' ? 'bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Mini Map Editor">
            <Compass size={20} />
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'analytics' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Biome Analytics">
            <BarChart2 size={20} />
          </button>
          <button onClick={() => setActiveTab('history')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'history' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Biome History Log">
            <History size={20} />
          </button>
          <div className="w-8 h-[1px] bg-[#2a2b3d] my-1 shrink-0"></div>
          <button onClick={() => setActiveTab('storygraph')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'storygraph' ? 'bg-[#ff6e9a]/20 text-[#ff6e9a] border border-[#ff6e9a]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="StoryGraph Narrative Editor">
            <GitBranch size={20} />
          </button>
          <button onClick={() => setActiveTab('workflow')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'workflow' ? 'bg-[#ff944d]/20 text-[#ff944d] border border-[#ff944d]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Local n8n Workflow Engine">
            <Network size={20} />
          </button>
          <button onClick={() => setActiveTab('tasks')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'tasks' ? 'bg-[#ffeb3b]/20 text-[#ffeb3b] border border-[#ffeb3b]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Task Status Board">
            <CheckSquare size={20} />
          </button>
          <button onClick={() => setActiveTab('ai')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'ai' ? 'bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="AI Generator Engine">
            <BrainCircuit size={20} />
          </button>
          <div className="w-8 h-[1px] bg-[#2a2b3d] my-1 shrink-0"></div>
          <button onClick={() => setActiveTab('pcg')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'pcg' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Advanced Procedural Content Generation (PCG)">
            <Dices size={20} />
          </button>
          <button onClick={() => setActiveTab('physics')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'physics' ? 'bg-[#ff7b72]/20 text-[#ff7b72] border border-[#ff7b72]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Physics, Fluid & Chaos Destruction">
            <Flame size={20} />
          </button>
          <button onClick={() => setActiveTab('audio')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'audio' ? 'bg-[#e3b341]/20 text-[#e3b341] border border-[#e3b341]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Spatial Audio & Adaptive Foley">
            <Volume2 size={20} />
          </button>
          <button onClick={() => setActiveTab('debugger')} className={`w-10 h-10 shrink-0 rounded flex items-center justify-center ${activeTab === 'debugger' ? 'bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Visual Flow Debugger">
            <Activity size={20} />
          </button>
        </div>

        {activeTab === "pcg" ? <MapPCGEditor /> : activeTab === "biome" ? <MapBiomeEditor /> : activeTab === "structures" ? <MapArchitectureEditor /> : activeTab === "water" ? <MapWaterEditor /> : activeTab === "roads" ? <MapRoadEditor /> : activeTab === "terrain" ? <MapTerrainEditor /> : (activeTab === "lighting" || activeTab === "weather") ? <MapEnvironmentEditor /> : (
          <>
        {/* Properties Panel */}
        <div className="w-[300px] border-r border-[#2a2b3d] bg-[#11111b] flex flex-col shrink-0">
          {activeTab === 'layers' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1">
              <h2 className="text-sm font-bold text-[#58a6ff] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2">
                <Layers size={16} /> Map Layers
              </h2>
              <div className="flex flex-col gap-2 flex-1">
                {mapLayers.map(layer => (
                  <div 
                    key={layer.id} 
                    className={`flex items-center justify-between p-2 rounded border ${activeLayer === layer.id ? 'bg-[#58a6ff]/10 border-[#58a6ff]/50' : 'bg-[#1e1e2d] border-[#2a2b3d] hover:border-[#8b949e]/50'} cursor-pointer`}
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleLayerViz(layer.id); }}
                        className={`text-gray-400 hover:text-white transition ${!layer.visible && 'opacity-50'}`}
                      >
                        {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <span className={`text-xs ${activeLayer === layer.id ? 'text-white font-bold' : 'text-gray-300'}`}>{layer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}
                        className={`text-gray-400 hover:text-white transition`}
                      >
                        {layer.locked ? <Lock size={12} className="text-[#f85149]" /> : <Unlock size={12} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-2 bg-[#2a2b3d] hover:bg-[#3b3d54] text-white font-bold text-xs py-2 rounded flex items-center justify-center gap-2 transition-transform active:scale-95">
                <Plus size={14} /> Add New Layer
              </button>
            </div>
        )}

          {activeTab === 'history' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1">
              <h2 className="text-sm font-bold text-cyan-400 border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2">
                <History size={16} /> Git-Style Version Control
              </h2>
              <p className="text-[11px] text-[#8b949e]">Every topological and entity change is journaled. You can checkout alternate timelines and branch off.</p>
              
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded">
                 <button className="w-full bg-[#1a1a24] hover:bg-[#2a2b3d] border border-[#58a6ff]/30 text-[#58a6ff] hover:text-white py-1.5 rounded text-[10px] uppercase font-bold transition flex justify-center items-center gap-2">
                    <Braces size={14} /> Commit Current Master State
                 </button>
              </div>

              <div className="flex flex-col gap-2 flex-1 mt-2 relative">
                {/* Timeline UI line */}
                <div className="absolute top-2 bottom-2 left-3 w-0.5 bg-[#2a2b3d] rounded-full z-0"></div>

                {biomeStrokes.length === 0 ? (
                   <div className="text-xs text-gray-500 text-center py-8 z-10">No local state commits detected.</div>
                ) : (
                   [...biomeStrokes].reverse().map((stroke, index) => (
                     <div key={stroke.id} className="ml-6 bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded flex flex-col gap-2 relative group hover:border-[#58a6ff]/50 transition-colors z-10 shadow-lg">
                        <div className="absolute top-3 -left-4.5 w-2.5 h-2.5 rounded-full bg-[#58a6ff] border-2 border-[#161621] -translate-x-full"></div>
                        <div className="flex justify-between items-center">
                           <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                             <GitCommit size={12} className="text-[#58a6ff]"/> {stroke.type} Topology Diff
                           </span>
                           <span className="text-[10px] text-gray-500 font-mono">
                             {new Date(stroke.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' })}
                           </span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono border-t border-[#2a2b3d] pt-1">
                           + {stroke.points.length} vertex updates executed
                        </div>
                        <button 
                          onClick={() => setBiomeStrokes(prev => prev.filter(s => s.id !== stroke.id))}
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 bg-[#f85149] hover:bg-red-600 text-white rounded p-1 transition-opacity cursor-pointer shadow"
                          title="Git Revert"
                        >
                           <Undo2 size={12} />
                        </button>
                     </div>
                   ))
        )}
              </div>
            </div>
        )}

          {activeTab === 'analytics' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1 pb-20">
              <h2 className="text-sm font-bold text-pink-400 border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2">
                <BarChart2 size={16} /> World State Telemetry
              </h2>
              <p className="text-[11px] text-[#8b949e]">Real-time offline database queries tracking ecological logic and structural density.</p>
              
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-3 text-xs text-white">
                <h3 className="font-bold text-[#c9d1d9] mb-3 uppercase border-b border-[#2a2b3d] pb-1">Ecological Dominance (Biome %)</h3>
                {(() => {
                  const points = biomeStrokes.flatMap(s => s.points);
                  const total = Math.max(1, points.length);
                  const getPts = (type: string) => biomeStrokes.filter(s => s.type === type).flatMap(s => s.points).length;
                  const getPct = (type: string) => Math.round((getPts(type) / total) * 100);
                  const forest = getPct('FOREST');
                  const ocean = getPct('OCEAN');
                  const tundra = getPct('TUNDRA');
                  const desert = getPct('DESERT');
                  const jungle = getPct('JUNGLE');
                  return (
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="flex justify-between mb-1"><span className="text-green-500">Forest</span> <span className="font-mono">{points.length === 0 ? 100 : forest}%</span></div>
                        <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${points.length === 0 ? 100 : forest}%` }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1"><span className="text-blue-500">Ocean</span> <span className="font-mono">{ocean}%</span></div>
                        <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${ocean}%` }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1"><span className="text-emerald-500">Jungle</span> <span className="font-mono">{jungle}%</span></div>
                        <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${jungle}%` }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1"><span className="text-yellow-500">Desert</span> <span className="font-mono">{desert}%</span></div>
                        <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full"><div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${desert}%` }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1"><span className="text-sky-400">Tundra</span> <span className="font-mono">{tundra}%</span></div>
                        <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full"><div className="bg-sky-400 h-1.5 rounded-full" style={{ width: `${tundra}%` }}></div></div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="bg-[#1e1e2d] border border-pink-500/20 rounded p-3 text-xs text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none"></div>
                 <h3 className="font-bold text-pink-400 mb-3 uppercase flex items-center gap-1.5 relative z-10"><BrainCircuit size={12}/> Offline AI Heuristics</h3>
                 <div className="flex flex-col gap-2 relative z-10 text-[10px]">
                    <div className="flex justify-between bg-[#0a0a0f] border border-[#2a2b3d] p-1.5 rounded">
                       <span className="text-gray-400">Aggregated Societal Threat Lvl:</span>
                       <span className="text-red-400 font-mono">14.2%</span>
                    </div>
                    <div className="flex justify-between bg-[#0a0a0f] border border-[#2a2b3d] p-1.5 rounded">
                       <span className="text-gray-400">Total Offline Economic Flow/Sec:</span>
                       <span className="text-green-400 font-mono">2,140 Gold</span>
                    </div>
                    <div className="flex justify-between bg-[#0a0a0f] border border-[#2a2b3d] p-1.5 rounded">
                       <span className="text-gray-400">AI Dialogue Node Count:</span>
                       <span className="text-purple-400 font-mono">82,410 Strings</span>
                    </div>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-3 text-xs text-white">
                <h3 className="font-bold text-[#c9d1d9] mb-3 uppercase border-b border-[#2a2b3d] pb-1">Entity Density Tracking</h3>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                   <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 flex flex-col items-center hover:bg-[#2a2b3d] transition">
                     <MapPin size={16} className="text-[#3fb950] mb-1" />
                     <span className="text-gray-400 uppercase tracking-widest font-bold">Towns</span>
                     <span className="font-mono text-lg mt-1">{markers.filter(m => m.type === 'town').length}</span>
                   </div>
                   <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 flex flex-col items-center hover:bg-[#2a2b3d] transition">
                     <Target size={16} className="text-[#f85149] mb-1" />
                     <span className="text-gray-400 uppercase tracking-widest font-bold">Dungeons</span>
                     <span className="font-mono text-lg mt-1">{markers.filter(m => m.type === 'dungeon').length}</span>
                   </div>
                   <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 flex flex-col items-center hover:bg-[#2a2b3d] transition">
                     <Map size={16} className="text-[#e3b341] mb-1" />
                     <span className="text-gray-400 uppercase tracking-widest font-bold">Shops</span>
                     <span className="font-mono text-lg mt-1">{markers.filter(m => m.type === 'shop').length}</span>
                   </div>
                   <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 flex flex-col items-center hover:bg-[#2a2b3d] transition">
                     <Search size={16} className="text-[#58a6ff] mb-1" />
                     <span className="text-gray-400 uppercase tracking-widest font-bold">Quests</span>
                     <span className="font-mono text-lg mt-1">{markers.filter(m => m.type === 'quest').length}</span>
                   </div>
                </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-3 text-xs text-white">
                 <h3 className="font-bold text-[#c9d1d9] mb-2 uppercase border-b border-[#2a2b3d] pb-1">Procedural Telemetry</h3>
                 <div className="flex justify-between items-center text-[10px] text-gray-400 mb-2">
                    <span>Average Map Elevation</span>
                    <span className="text-[#3fb950] font-mono px-1 rounded bg-[#3fb950]/10 border border-[#3fb950]/30">+842m</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Global Surface Temp</span>
                    <span className="text-[#58a6ff] font-mono px-1 rounded bg-[#58a6ff]/10 border border-[#58a6ff]/30">16°C</span>
                 </div>
              </div>
            </div>
        )}

          {activeTab === 'grid' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <h2 className="text-sm font-bold text-[#c9d1d9] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2">
                 <Grid3X3 size={16} className="text-[#3fb950]" /> Grid & Scale Info
              </h2>
              
              <div>
                <label className="text-[10px] font-bold text-[#8b949e] uppercase mb-1 block">Map Size (Width x Height)</label>
                <div className="flex items-center gap-2">
                   <input type="number" value={mapSizeInMc} onChange={(e) => setMapSizeInMc(Number(e.target.value))} className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded px-2 py-1.5 text-xs text-white" />
                   <span className="text-xs text-[#8b949e] whitespace-nowrap font-mono">mc</span>
                </div>
                <div className="text-[10px] text-[#58a6ff] mt-1 flex justify-between">
                   <span>Total area: {(mapSizeInMc / 1000).toFixed(1)} x {(mapSizeInMc / 1000).toFixed(1)} km</span>
                   <span>{((mapSizeInMc*mapSizeInMc)/1000000).toFixed(2)} km²</span>
                </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-3 mt-4">
                 <h3 className="text-[10px] font-bold text-white mb-3 uppercase flex items-center gap-2"><Grid3X3 size={12} className="text-[#3fb950]"/> Grid Visual Properties</h3>
                 
                 <div className="flex flex-col gap-3">
                    <div>
                       <div className="flex justify-between text-[10px] text-[#8b949e] mb-1">
                          <span>Base Cell Opacity</span>
                          <span>{gridOpacity}%</span>
                       </div>
                       <input type="range" min="0" max="100" value={gridOpacity} onChange={e => setGridOpacity(Number(e.target.value))} className="w-full accent-[#3fb950] h-1 bg-[#0a0a0f] rounded appearance-none cursor-pointer" />
                    </div>

                    <div className="flex items-center gap-2">
                       <input type="color" value={gridColor} onChange={e => setGridColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0" />
                       <label className="text-xs text-gray-300">Line Color</label>
                       
                       <select className="ml-auto bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1 text-xs text-white" value={gridStyle} onChange={e => setGridStyle(e.target.value)}>
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dots">Dotted</option>
                       </select>
                    </div>
                 </div>
              </div>

              <div className="bg-gradient-to-br from-[#1e1e2d] to-[#161621] border border-[#f2cc60]/30 rounded p-3 mt-1 shadow-[0_0_15px_rgba(242,204,96,0.05)] relative overflow-hidden">
                 <div className="absolute -top-6 -right-6 w-24 h-24 border border-[#f2cc60]/10 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 border border-[#f2cc60]/10 rounded-full"></div>
                 </div>
                 <h3 className="text-[10px] font-bold text-[#f2cc60] mb-3 uppercase flex items-center gap-2 relative z-10"><Settings size={12}/> Golden Ratio & Phi Snapping</h3>
                 
                 <div className="flex flex-col gap-3 relative z-10">
                    <div>
                       <label className="text-[10px] text-[#8b949e] mb-1 block">Master Grid System</label>
                       <select className="w-full bg-[#0a0a0f] border border-[#f2cc60]/30 rounded p-1.5 text-xs text-white outline-none focus:border-[#f2cc60]">
                          <option>Cartesian (1m / 10m Base)</option>
                          <option>Fibonacci Spiral (Golden Layout)</option>
                          <option>Golden Rectangles (1 : 1.618)</option>
                          <option>Polar (Angular)</option>
                       </select>
                    </div>

                    <div className="flex flex-col gap-2 bg-[#0a0a0f]/50 p-2 rounded border border-[#2a2b3d]">
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" defaultChecked className="accent-[#f2cc60] w-3.5 h-3.5" />
                           <div className="flex flex-col">
                              <span className="text-[10px] text-gray-200 font-bold group-hover:text-white transition tracking-wide">Enable Phi (1.618) Snapping Override</span>
                              <span className="text-[8.5px] text-[#8b949e] mt-0.5">Objects will magnetize to Golden Proportions when resizing</span>
                           </div>
                        </label>
                    </div>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-3">
                 <h3 className="text-[10px] font-bold text-[#c9d1d9] mb-3 uppercase flex items-center gap-1.5"><Scan size={12} className="text-orange-400" /> Structure & Snapping</h3>
                 
                 <div className="flex flex-col gap-3">
                    <div>
                       <label className="text-[10px] text-[#8b949e] mb-1 block">Chunk Border Size (Mc)</label>
                       <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-xs text-white" value={gridChunkSize} onChange={e => setGridChunkSize(Number(e.target.value))}>
                          <option value="8">8 x 8</option>
                          <option value="16">16 x 16 (Standard)</option>
                          <option value="32">32 x 32</option>
                          <option value="64">64 x 64</option>
                       </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" checked={showChunkBorders} onChange={e => setShowChunkBorders(e.target.checked)} className="accent-orange-500 w-3.5 h-3.5" />
                       <span className="text-[10px] text-gray-300 group-hover:text-white transition">Render Sub-Chunk Borders</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" checked={snapToGrid} onChange={e => setSnapToGrid(e.target.checked)} className="accent-orange-500 w-3.5 h-3.5" />
                       <span className="text-[10px] text-gray-300 group-hover:text-white transition">Snap Entities to {gridChunkSize/16}mc Grid Center</span>
                    </label>

                    <label className="flex flex-col gap-1 cursor-pointer group">
                       <div className="flex items-center gap-2">
                           <input type="checkbox" checked={smartSnapping} onChange={e => setSmartSnapping(e.target.checked)} className="accent-[#58a6ff] w-3.5 h-3.5" />
                           <span className="text-[10px] text-gray-300 group-hover:text-white transition">Enable Smart Zoom Snapping</span>
                       </div>
                       <span className="text-[9px] text-[#8b949e] ml-5 leading-tight">Dynamically adjusts precise grid levels (mc → cc → bc) based on your zoom depth for surgical placement tracking.</span>
                    </label>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-purple-500/30 rounded p-3 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                 <h3 className="text-[10px] font-bold text-[#bc8cff] mb-2 uppercase flex items-center gap-1.5"><BrainCircuit size={12} /> AI Navigation Mesh Grid</h3>
                 
                 <div className="flex flex-col gap-3 relative z-10">
                    <label className="flex items-center gap-2 cursor-pointer group mt-1">
                       <input type="checkbox" checked={showNavMeshGrid} onChange={e => setShowNavMeshGrid(e.target.checked)} className="accent-purple-500 w-3.5 h-3.5" />
                       <span className="text-[10px] text-gray-300 group-hover:text-white transition">Overlay Pathfinding Raster Map</span>
                    </label>

                    {showNavMeshGrid && (
                       <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                          <label className="text-[10px] text-[#8b949e] mb-1 block">Nav Mesh Resolution Scale</label>
                          <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-xs text-purple-300" value={navMeshResolution} onChange={e => setNavMeshResolution(Number(e.target.value))}>
                             <option value="0.25">0.25mc (High Acc / High Cost)</option>
                             <option value="0.5">0.5mc (Balance / Voxel Core)</option>
                             <option value="1">1mc (Standard / Entity Bounds)</option>
                             <option value="2">2mc (Low Acc / AI Outline)</option>
                          </select>
                       </div>
        )}
                 </div>
              </div>

               <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-3">
                <h3 className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Unit Conversion Lexicon</h3>
                <div className="flex flex-col gap-1.5">
                   <div className="flex items-center gap-2 bg-[#0a0a0f] p-1.5 rounded border border-[#2a2b3d]">
                      <span className="text-[#3fb950] font-mono text-[10px] font-bold w-10">1 mc</span>
                      <span className="text-[9px] text-gray-400">1 Meter Cell (Base UI Display Grid)</span>
                   </div>
                   <div className="flex items-center gap-2 bg-[#0a0a0f] p-1.5 rounded border border-[#2a2b3d]">
                      <span className="text-gray-300 font-mono text-[10px] font-bold w-10">1 cc</span>
                      <span className="text-[9px] text-gray-400">1 Centimeter Cell (100 in 1 mc)</span>
                   </div>
                   <div className="flex items-center gap-2 bg-[#0a0a0f] p-1.5 rounded border border-[#2a2b3d]">
                      <span className="text-gray-400 font-mono text-[10px] font-bold w-10">1 bc</span>
                      <span className="text-[9px] text-gray-400">1 Millimeter Cell (100 in 1 cc)</span>
                   </div>
                   <div className="flex items-center gap-2 bg-[#0a0a0f] p-1.5 rounded border border-[#2a2b3d]">
                      <span className="text-[#bc8cff] font-mono text-[10px] font-bold w-10">1 vc</span>
                      <span className="text-[9px] text-gray-400">1 μm Cell (AI Native Raytrace)</span>
                   </div>
                </div>
              </div>
            </div>
        )}

          {activeTab === 'maptools' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <h2 className="text-sm font-bold text-[#ff7b72] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2">
                <BoxSelect size={16} /> Advanced Map Tools
              </h2>
              
              {/* Measurement & Utilities */}
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1 flex justify-between items-center">
                   <span>Utilities</span>
                   <span className="text-[8px] text-[#8b949e] bg-[#8b949e]/20 px-1.5 py-0.5 rounded">Measure</span>
                 </h3>
                 <div className="grid grid-cols-4 gap-2">
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#ff7b72]/30 p-2 rounded flex flex-col items-center gap-1 transition-all" title="Measure Distance">
                       <Ruler size={14} />
                       <span className="text-[8px]">Distance</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#ff7b72]/30 p-2 rounded flex flex-col items-center gap-1 transition-all" title="Grid Snap">
                       <Magnet size={14} />
                       <span className="text-[8px]">Snap</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#ff7b72]/30 p-2 rounded flex flex-col items-center gap-1 transition-all" title="Align to Surface">
                       <AlignCenter size={14} />
                       <span className="text-[8px]">Align</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#ff7b72]/30 p-2 rounded flex flex-col items-center gap-1 transition-all" title="Toggle Grid">
                       <LayoutGrid size={14} />
                       <span className="text-[8px]">Grid</span>
                    </button>
                 </div>
              </div>

              {/* Selection Mode */}
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1 flex justify-between items-center">
                   <span>Selection Mode</span>
                   <span className="text-[8px] text-[#ff7b72] bg-[#ff7b72]/20 px-1.5 py-0.5 rounded">Core</span>
                 </h3>
                 <div className="grid grid-cols-4 gap-2">
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#ff7b72]/50 p-2 rounded flex flex-col items-center gap-1 transition-all" title="Circle Selection">
                       <Circle size={14} className="text-[#ff7b72]" />
                       <span className="text-[8px]">Circle</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#ff7b72]/30 p-2 rounded flex flex-col items-center gap-1 transition-all" title="Square Selection">
                       <Square size={14} />
                       <span className="text-[8px]">Square</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#ff7b72]/30 p-2 rounded flex flex-col items-center gap-1 transition-all" title="Freehand Lasso">
                       <Edit2 size={14} />
                       <span className="text-[8px]">Lasso</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#ff7b72]/30 p-2 rounded flex flex-col items-center gap-1 transition-all" title="Magic Wand">
                       <Wand2 size={14} />
                       <span className="text-[8px]">Magic</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#ff7b72]/30 p-2 rounded flex flex-col items-center gap-1 transition-all" title="Select by Height">
                       <ArrowUpFromLine size={14} />
                       <span className="text-[8px]">Height</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#ff7b72]/30 p-2 rounded flex flex-col items-center gap-1 transition-all" title="Select by Slope">
                       <ActivitySquare size={14} />
                       <span className="text-[8px]">Slope</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#ff7b72]/30 p-2 rounded flex flex-col items-center gap-1 transition-all" title="Select by Material">
                       <Pipette size={14} />
                       <span className="text-[8px]">Material</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#ff7b72]/30 p-2 rounded flex flex-col items-center gap-1 transition-all" title="Clear Selection">
                       <X size={14} />
                       <span className="text-[8px]">Clear</span>
                    </button>
                 </div>

                 <div className="grid grid-cols-4 gap-2 mt-1">
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] p-1.5 rounded flex flex-col items-center justify-center gap-1 transition-all" title="Grow Selection">
                       <Maximize size={12} /> <span className="text-[8px]">Expand</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] p-1.5 rounded flex flex-col items-center justify-center gap-1 transition-all" title="Shrink Selection">
                       <Minimize size={12} /> <span className="text-[8px]">Shrink</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] p-1.5 rounded flex flex-col items-center justify-center gap-1 transition-all" title="Invert Selection">
                       <Zap size={12} /> <span className="text-[8px]">Invert</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] p-1.5 rounded flex flex-col items-center justify-center gap-1 transition-all" title="Feather Selection">
                       <CloudRain size={12} /> <span className="text-[8px]">Feather</span>
                    </button>
                 </div>
              </div>

              {/* Brush Engine Settings */}
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1 flex justify-between items-center">
                   <span>Brush Settings</span>
                   <span className="text-[8px] text-[#ff7b72] bg-[#ff7b72]/20 px-1.5 py-0.5 rounded">Engine</span>
                 </h3>
                 <div>
                    <label className="text-[10px] text-[#8b949e] mb-1 flex justify-between"><span>Radius (Size)</span> <span className="text-white">25m</span></label>
                    <input type="range" min="1" max="100" defaultValue="25" className="w-full accent-[#ff7b72]" />
                 </div>
                 <div>
                    <label className="text-[10px] text-[#8b949e] mb-1 flex justify-between"><span>Falloff (Hardness)</span> <span className="text-white">50%</span></label>
                    <input type="range" min="0" max="100" defaultValue="50" className="w-full accent-[#ff7b72]" />
                 </div>
                 <div>
                    <label className="text-[10px] text-[#8b949e] mb-1 flex justify-between"><span>Flow / Opacity</span> <span className="text-white">100%</span></label>
                    <input type="range" min="0" max="100" defaultValue="100" className="w-full accent-[#ff7b72]" />
                 </div>
                 <div>
                    <label className="text-[10px] text-[#8b949e] mb-1 flex justify-between"><span>Jitter (Randomness)</span> <span className="text-white">0%</span></label>
                    <input type="range" min="0" max="100" defaultValue="0" className="w-full accent-[#ff7b72]" />
                 </div>
                 
                 <div>
                    <label className="text-[10px] text-[#8b949e] mb-1 block">Brush Alpha / Shape</label>
                    <select className="w-full bg-[#1a1a24] text-xs text-white border border-[#2a2b3d] rounded p-1">
                      <option>Solid Circle</option>
                      <option>Soft Circle</option>
                      <option>Square Noise</option>
                      <option>Fractal Cloud</option>
                      <option>Cracked Earth</option>
                    </select>
                 </div>
              </div>

              {/* Transform Tools */}
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1 flex justify-between items-center">
                   <span>Transform & Scale</span>
                   <span className="text-[8px] text-[#e3b341] bg-[#e3b341]/20 px-1.5 py-0.5 rounded">Gizmo</span>
                 </h3>
                 <div className="grid grid-cols-4 gap-2">
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#8b949e] p-2 rounded flex flex-col items-center gap-1 transition-all" title="Select Tool">
                       <MousePointer2 size={14} />
                       <span className="text-[8px]">Select</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#8b949e] p-2 rounded flex flex-col items-center gap-1 transition-all" title="Move Tool">
                       <Move size={14} />
                       <span className="text-[8px]">Move</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#8b949e] p-2 rounded flex flex-col items-center gap-1 transition-all" title="Rotate Tool">
                       <Clock size={14} />
                       <span className="text-[8px]">Rotate</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-[#e3b341] border border-[#e3b341]/50 p-2 rounded flex flex-col items-center gap-1 transition-all shadow-[0_0_8px_rgba(227,179,65,0.2)]" title="Scale Tool">
                       <Maximize size={14} />
                       <span className="text-[8px]">Scale</span>
                    </button>
                 </div>
                 
                 <div className="mt-1 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-[#8b949e]">
                       <span>Uniform Scale</span>
                       <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                    </div>
                    <div>
                       <label className="text-[9px] text-[#8b949e] mb-1 flex justify-between"><span>X (Width)</span> <span className="text-white">1.0x</span></label>
                       <input type="range" min="1" max="500" defaultValue="100" className="w-full accent-[#f85149] h-1" />
                    </div>
                    <div>
                       <label className="text-[9px] text-[#8b949e] mb-1 flex justify-between"><span>Y (Height)</span> <span className="text-white">1.0x</span></label>
                       <input type="range" min="1" max="500" defaultValue="100" className="w-full accent-[#3fb950] h-1" />
                    </div>
                    <div>
                       <label className="text-[9px] text-[#8b949e] mb-1 flex justify-between"><span>Z (Depth)</span> <span className="text-white">1.0x</span></label>
                       <input type="range" min="1" max="500" defaultValue="100" className="w-full accent-[#58a6ff] h-1" />
                    </div>
                    <button className="w-full bg-[#1a1a24] border border-[#2a2b3d] py-1 rounded text-[9px] text-white hover:bg-[#2a2b3d]">Reset Transform</button>
                 </div>
              </div>

              {/* Advanced Terrain Modification */}
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1 flex justify-between items-center">
                   <span>Terrain Modification</span>
                   <span className="text-[8px] text-[#d2a8ff] bg-[#d2a8ff]/20 px-1.5 py-0.5 rounded">Topology</span>
                 </h3>
                 <div className="grid grid-cols-4 gap-2">
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#d2a8ff]/50 p-2 rounded flex flex-col items-center justify-center gap-1 transition-all group">
                       <ArrowUp size={14} className="text-[#d2a8ff]" />
                       <span className="text-[8px]">Raise</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#d2a8ff]/50 p-2 rounded flex flex-col items-center justify-center gap-1 transition-all group">
                       <ArrowDown size={14} className="text-[#d2a8ff]" />
                       <span className="text-[8px]">Lower</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#d2a8ff]/50 p-2 rounded flex flex-col items-center justify-center gap-1 transition-all group">
                       <ArrowDownToLine size={14} className="text-[#d2a8ff]" />
                       <span className="text-[8px]">Flatten</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#d2a8ff]/50 p-2 rounded flex flex-col items-center justify-center gap-1 transition-all group">
                       <Waves size={14} className="text-[#d2a8ff]" />
                       <span className="text-[8px]">Smooth</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#d2a8ff]/50 p-2 rounded flex flex-col items-center justify-center gap-1 transition-all group">
                       <Activity size={14} className="text-[#d2a8ff]" />
                       <span className="text-[8px]">Roughen</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#d2a8ff]/50 p-2 rounded flex flex-col items-center justify-center gap-1 transition-all group">
                       <Mountain size={14} className="text-[#d2a8ff]" />
                       <span className="text-[8px]">Ramp</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#d2a8ff]/50 p-2 rounded flex flex-col items-center justify-center gap-1 transition-all group">
                       <Layers3 size={14} className="text-[#d2a8ff]" />
                       <span className="text-[8px]">Terrace</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#d2a8ff]/50 p-2 rounded flex flex-col items-center justify-center gap-1 transition-all group">
                       <Droplet size={14} className="text-[#d2a8ff]" />
                       <span className="text-[8px]">Erode</span>
                    </button>
                 </div>
                 
                 <div>
                    <label className="text-[10px] text-[#8b949e] mb-1 flex justify-between"><span>Power / Intensity</span> <span className="text-white">1.5x</span></label>
                    <input type="range" min="0" max="100" defaultValue="15" className="w-full accent-[#d2a8ff]" />
                 </div>
              </div>

              {/* Environment Materials */}
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1 flex justify-between items-center">
                   <span>Environment Materials</span>
                   <span className="text-[8px] text-[#79c0ff] bg-[#79c0ff]/20 px-1.5 py-0.5 rounded">Material</span>
                 </h3>
                 <div className="grid grid-cols-4 gap-2">
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#79c0ff]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Droplets size={14} className="text-[#79c0ff]" />
                       <span className="text-[8px]">Water</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#a5d6ff]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Snowflake size={14} className="text-[#a5d6ff]" />
                       <span className="text-[8px]">Snow</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff7b72]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Flame size={14} className="text-[#ff7b72]" />
                       <span className="text-[8px]">Lava</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#58a6ff]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <CloudRain size={14} className="text-[#58a6ff]" />
                       <span className="text-[8px]">Rain</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#3fb950]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Leaf size={14} className="text-[#3fb950]" />
                       <span className="text-[8px]">Grass</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#d2a8ff]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Sparkles size={14} className="text-[#d2a8ff]" />
                       <span className="text-[8px]">Magic</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#e3b341]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Wind size={14} className="text-[#e3b341]" />
                       <span className="text-[8px]">Sand</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#8b949e]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Hexagon size={14} className="text-[#8b949e]" />
                       <span className="text-[8px]">Rock</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#c9d1d9]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Building2 size={14} className="text-[#c9d1d9]" />
                       <span className="text-[8px]">Concrete</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#8b949e]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Droplet size={14} className="text-[#8b949e]" />
                       <span className="text-[8px]">Mud</span>
                    </button>
                 </div>
                 
                 <div className="flex flex-col gap-2 bg-[#1a1a24] p-2 rounded border border-[#2a2b3d]">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-medium text-white flex items-center gap-1"><Layers size={12} className="text-[#79c0ff]"/> Layer Blending</span>
                       <span className="text-[9px] text-[#8b949e] bg-[#1e1e2d] px-1.5 py-0.5 rounded border border-[#2a2b3d]">Paint over base</span>
                    </div>
                    <div>
                       <label className="text-[9px] text-[#8b949e] mb-1 flex justify-between"><span>Brush Opacity</span> <span className="text-white">65%</span></label>
                       <input type="range" min="0" max="100" defaultValue="65" className="w-full accent-[#79c0ff]" />
                    </div>
                 </div>

                 <div className="flex gap-2">
                    <button className="flex-1 bg-[#1a1a24] border border-[#2a2b3d] py-1 rounded flex justify-center items-center gap-1 text-[9px] text-[#8b949e] hover:text-white"><PaintBucket size={12}/> Fill Selection</button>
                    <button className="flex-1 bg-[#1a1a24] border border-[#2a2b3d] py-1 rounded flex justify-center items-center gap-1 text-[9px] text-[#8b949e] hover:text-white"><Eraser size={12}/> Erase</button>
                    <button className="flex-1 bg-[#1a1a24] border border-[#2a2b3d] py-1 rounded flex justify-center items-center gap-1 text-[9px] text-[#8b949e] hover:text-white"><Pipette size={12}/> Sample</button>
                 </div>
              </div>

              {/* Advanced Prop Scattering */}
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1 flex justify-between items-center">
                   <span>Prop & Foliage Scatter</span>
                   <span className="text-[8px] text-[#3fb950] bg-[#3fb950]/20 px-1.5 py-0.5 rounded">Foliage</span>
                 </h3>
                 <div className="grid grid-cols-4 gap-2">
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#3fb950]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Trees size={14} />
                       <span className="text-[8px]">Forest</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#3fb950]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <TreePine size={14} />
                       <span className="text-[8px]">Pine</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#3fb950]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Sprout size={14} />
                       <span className="text-[8px]">Bushes</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#3fb950]/50 p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Pickaxe size={14} />
                       <span className="text-[8px]">Rocks</span>
                    </button>
                 </div>
                 
                 <div className="flex flex-col gap-2 mt-1">
                   <div>
                      <label className="text-[10px] text-[#8b949e] mb-1 flex justify-between"><span>Scatter Density</span> <span className="text-white">High</span></label>
                      <input type="range" min="1" max="100" defaultValue="80" className="w-full accent-[#3fb950]" />
                   </div>
                   <div>
                      <label className="text-[10px] text-[#8b949e] mb-1 flex justify-between"><span>Scale Variation</span> <span className="text-white">±20%</span></label>
                      <input type="range" min="0" max="100" defaultValue="20" className="w-full accent-[#3fb950]" />
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] text-[#8b949e]">Align to Terrain Normal</span>
                     <input type="checkbox" defaultChecked className="accent-[#3fb950]" />
                   </div>
                   <div className="flex gap-2 mt-2">
                      <button className="flex-1 bg-[#1a1a24] border border-[#2a2b3d] py-1.5 rounded flex justify-center items-center gap-1 text-[9px] text-[#3fb950] hover:text-white"><Shuffle size={12}/> Re-seed</button>
                      <button className="flex-1 bg-[#1a1a24] border border-[#2a2b3d] py-1.5 rounded flex justify-center items-center gap-1 text-[9px] text-[#f85149] hover:text-white"><Eraser size={12}/> Erase Props</button>
                   </div>
                 </div>
              </div>

              {/* Advanced Splines & Networks */}
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1 flex justify-between items-center">
                   <span>Splines & Networks</span>
                   <span className="text-[8px] text-[#c9d1d9] bg-[#c9d1d9]/20 px-1.5 py-0.5 rounded">Vector</span>
                 </h3>
                 <div className="grid grid-cols-4 gap-2">
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#c9d1d9] p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Route size={14} />
                       <span className="text-[8px]">Roads</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#c9d1d9] p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Waves size={14} />
                       <span className="text-[8px]">Rivers</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#c9d1d9] p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Fence size={14} />
                       <span className="text-[8px]">Fences</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#c9d1d9] p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <TramFront size={14} />
                       <span className="text-[8px]">Rails</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#c9d1d9] p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Zap size={14} />
                       <span className="text-[8px]">Powerlines</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#c9d1d9] p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Square size={14} />
                       <span className="text-[8px]">Bridges</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#c9d1d9] p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Box size={14} />
                       <span className="text-[8px]">Walls</span>
                    </button>
                 </div>
              </div>

              {/* Atmosphere & Volumes */}
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1 flex justify-between items-center">
                   <span>Atmosphere & Effects</span>
                   <span className="text-[8px] text-[#a5d6ff] bg-[#a5d6ff]/20 px-1.5 py-0.5 rounded">Volumes</span>
                 </h3>
                 <div className="grid grid-cols-4 gap-2">
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#a5d6ff] p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <CloudFog size={14} />
                       <span className="text-[8px]">Fog Vol</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#a5d6ff] p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Camera size={14} />
                       <span className="text-[8px]">Post-Proc</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#a5d6ff] p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <Volume2 size={14} />
                       <span className="text-[8px]">Audio Zone</span>
                    </button>
                    <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-gray-400 border border-[#2a2b3d] hover:border-[#a5d6ff] p-2 rounded flex flex-col items-center gap-1 transition-all">
                       <BoxSelect size={14} />
                       <span className="text-[8px]">Light Block</span>
                    </button>
                 </div>
              </div>

              {/* Gameplay Logic Zones */}
              <div className="bg-gradient-to-br from-[#1e1e2d] to-[#161621] border border-[#e3b341]/30 p-3 rounded flex flex-col gap-3 shadow-[0_0_15px_rgba(227,179,65,0.05)] pb-6 mt-2">
                 <h3 className="text-[10px] font-bold text-[#e3b341] uppercase border-b border-[#e3b341]/20 pb-1 flex items-center gap-1.5">
                    <Star size={12} /> Gameplay & Core Zones
                 </h3>
                 
                 <div className="grid grid-cols-3 gap-2">
                   <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-[#e3b341] border border-[#e3b341]/30 hover:border-[#e3b341] p-2 rounded text-[10px] transition-colors flex flex-col items-center justify-center gap-1" title="General Gameplay Zone">
                      <MapPin size={14} /> <span className="text-[8px]">General Zone</span>
                   </button>
                   <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-[#f85149] border border-[#f85149]/30 hover:border-[#f85149] p-2 rounded text-[10px] transition-colors flex flex-col items-center justify-center gap-1" title="Procedural Dungeon Entry">
                      <Target size={14} /> <span className="text-[8px]">Dungeon Core</span>
                   </button>
                   <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-[#3fb950] border border-[#3fb950]/30 hover:border-[#3fb950] p-2 rounded text-[10px] transition-colors flex flex-col items-center justify-center gap-1" title="No Combat Zone">
                      <Shield size={14} /> <span className="text-[8px]">Safe Zone</span>
                   </button>
                   <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-[#ff7b72] border border-[#ff7b72]/30 hover:border-[#ff7b72] p-2 rounded text-[10px] transition-colors flex flex-col items-center justify-center gap-1" title="PvP Enabled Area">
                      <Skull size={14} /> <span className="text-[8px]">PvP Arena</span>
                   </button>
                   <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-[#d2a8ff] border border-[#d2a8ff]/30 hover:border-[#d2a8ff] p-2 rounded text-[10px] transition-colors flex flex-col items-center justify-center gap-1" title="Player/Entity Spawn">
                      <Radio size={14} /> <span className="text-[8px]">Spawn Point</span>
                   </button>
                   <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-[#a5d6ff] border border-[#a5d6ff]/30 hover:border-[#a5d6ff] p-2 rounded text-[10px] transition-colors flex flex-col items-center justify-center gap-1" title="Block Player Building">
                      <ShieldAlert size={14} /> <span className="text-[8px]">No-Build Zone</span>
                   </button>
                   <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-[#ff7b72] border border-[#ff7b72]/30 hover:border-[#ff7b72] p-2 rounded text-[10px] transition-colors flex flex-col items-center justify-center gap-1" title="Script Trigger Volume">
                      <Zap size={14} /> <span className="text-[8px]">Trigger Box</span>
                   </button>
                   <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-[#8b949e] border border-[#8b949e]/30 hover:border-[#8b949e] p-2 rounded text-[10px] transition-colors flex flex-col items-center justify-center gap-1" title="Modify AI Nav Cost">
                      <ActivitySquare size={14} /> <span className="text-[8px]">Nav Modifier</span>
                   </button>
                   <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-[#e3b341] border border-[#e3b341]/30 hover:border-[#e3b341] p-2 rounded text-[10px] transition-colors flex flex-col items-center justify-center gap-1" title="Spawn Random Loot">
                      <Box size={14} /> <span className="text-[8px]">Loot Spawn</span>
                   </button>
                 </div>
                 <p className="text-[9px] text-[#8b949e] text-center mt-1">Select an area using selection tools, then assign a special zone type.</p>
              </div>

            </div>
        )}

          {activeTab === 'textures' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <h2 className="text-sm font-bold text-[#ff7b72] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2"><Brush size={16}/> Texture & Layer Painter</h2>
              <p className="text-[11px] text-[#8b949e]">Paint terrain materials via triplanar projection and splat maps. Supports PBR, displacement, and masking.</p>
              
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <div>
                    <label className="text-[10px] uppercase font-bold text-[#ff7b72] mb-1 flex items-center gap-1 block border-b border-[#2a2b3d] pb-1"><Layers size={14} /> Material Layers (Splat Map)</label>
                    <div className="flex flex-col gap-1 mt-2">
                       <div className="flex items-center gap-2 cursor-pointer bg-[#2a2b3d]/50 p-1.5 rounded border border-[#ff7b72]/50">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-700 to-green-900 rounded"></div>
                          <span className="text-xs text-white flex-1 font-bold">Lush Grass</span>
                          <Eye size={14} className="text-gray-400 hover:text-white" />
                       </div>
                       <div className="flex items-center gap-2 cursor-pointer bg-[#1a1a24] hover:bg-[#2a2b3d] p-1.5 rounded border border-[#2a2b3d] transition-colors">
                          <div className="w-6 h-6 bg-gradient-to-br from-[#8c7853] to-[#594a31] rounded"></div>
                          <span className="text-xs text-gray-300 flex-1">Mud & Dirt</span>
                          <Eye size={14} className="text-gray-400 hover:text-white" />
                       </div>
                       <div className="flex items-center gap-2 cursor-pointer bg-[#1a1a24] hover:bg-[#2a2b3d] p-1.5 rounded border border-[#2a2b3d] transition-colors">
                          <div className="w-6 h-6 bg-gradient-to-br from-[#4a4a4a] to-[#2d2d2d] rounded"></div>
                          <span className="text-xs text-gray-300 flex-1">Bedrock / Cliff</span>
                          <Eye size={14} className="text-gray-400 hover:text-white" />
                       </div>
                    </div>
                 </div>
                 <button className="w-full bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] py-1.5 rounded text-xs transition flex items-center justify-center gap-2 mt-1"><Plus size={14}/> Add New Layer</button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff7b72]/50 p-2 rounded flex flex-col items-center justify-center gap-1 transition-all">
                    <Brush size={14} className="text-[#ff7b72]" />
                    <span className="text-[9px]">Paint Mask</span>
                 </button>
                 <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff7b72]/50 p-2 rounded flex flex-col items-center justify-center gap-1 transition-all">
                    <History size={14} className="text-gray-400" />
                    <span className="text-[9px]">Erase</span>
                 </button>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <div>
                    <label className="text-[10px] text-[#8b949e] mb-1 block">Brush Radius (mc)</label>
                    <input type="range" min="1" max="100" defaultValue="10" className="w-full accent-[#ff7b72]" />
                 </div>
                 <div>
                    <label className="text-[10px] text-[#8b949e] mb-1 block">Opacity / Flow</label>
                    <input type="range" min="0" max="100" defaultValue="100" className="w-full accent-[#ff7b72]" />
                 </div>
                 <div>
                    <label className="text-[10px] text-[#8b949e] mb-1 block">Noise Scatter</label>
                    <input type="range" min="0" max="100" defaultValue="35" className="w-full accent-[#ff7b72]" />
                 </div>
              </div>
              
              <div className="bg-[#ff7b72]/10 border border-[#ff7b72]/30 p-3 rounded flex flex-col gap-2 relative">
                 <h3 className="text-[10px] font-bold text-[#ff7b72] flex items-center gap-1"><BrainCircuit size={12}/> AI Material Synthesis</h3>
                 <p className="text-[9px] text-[#ff7b72]/80">Offline Swarm can generate seamless PBR materials (Albedo, Normal, Roughness) from text descriptions.</p>
                 <button className="bg-[#ff7b72]/20 hover:bg-[#ff7b72]/30 text-white text-[10px] px-2 py-1.5 rounded transition">Open Synthesis Engine</button>
              </div>
            </div>
        )}

          {activeTab === 'water' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <h2 className="text-sm font-bold text-[#79c0ff] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2"><Droplets size={16}/> Water & Fluids</h2>
              <p className="text-[11px] text-[#8b949e]">Place fluid sources. Flow, erosion, and ocean planes are calculated physically based on terrain geometry.</p>

              <div className="flex flex-col gap-2">
                 <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#79c0ff]/50 p-2 rounded flex items-center gap-3 transition-all text-left">
                    <div className="w-8 h-8 rounded bg-[#79c0ff]/10 flex items-center justify-center text-[#79c0ff]"><Droplets size={16} /></div>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold">Add Global Ocean Plane</span>
                       <span className="text-[9px] text-[#8b949e]">Defines absolute sea level over map</span>
                    </div>
                 </button>
                 <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#79c0ff]/50 p-2 rounded flex items-center gap-3 transition-all text-left">
                    <div className="w-8 h-8 rounded bg-[#79c0ff]/10 flex items-center justify-center text-[#79c0ff]"><Cloud size={16} /></div>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold">Place River Source</span>
                       <span className="text-[9px] text-[#8b949e]">Spring point, will pathfind down-hill</span>
                    </div>
                 </button>
                 <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#79c0ff]/50 p-2 rounded flex items-center gap-3 transition-all text-left">
                    <div className="w-8 h-8 rounded bg-[#79c0ff]/10 flex items-center justify-center text-[#79c0ff]"><Scan size={16} /></div>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold">Lake Volume Mask</span>
                       <span className="text-[9px] text-[#8b949e]">Paint an enclosed fluid volume</span>
                    </div>
                 </button>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1">Fluid Properties</h3>
                 <div>
                    <label className="text-[10px] text-[#8b949e] mb-1 block">Viscosity / Resistance</label>
                    <input type="range" min="1" max="100" defaultValue="5" className="w-full accent-[#79c0ff]" />
                 </div>
                 <div>
                    <label className="text-[10px] text-[#8b949e] mb-1 block">Current Speed Multiplier</label>
                    <div className="flex items-center gap-2">
                       <input type="range" min="1" max="100" defaultValue="40" className="flex-1 accent-[#79c0ff]" />
                       <span className="text-[10px] text-white font-mono w-6 text-right">1.2x</span>
                    </div>
                 </div>
                 <label className="flex items-center gap-2 cursor-pointer group mt-1">
                    <input type="checkbox" defaultChecked className="accent-[#79c0ff] w-3 h-3" />
                    <span className="text-[10px] text-gray-300 group-hover:text-white transition">Enable Dynamic Mesh Ripple</span>
                 </label>
              </div>
            </div>
        )}


          {activeTab === 'structures' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <h2 className="text-sm font-bold text-[#ff7b72] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2"><Hammer size={16}/> Architecture & Structures</h2>
              <p className="text-[11px] text-[#8b949e] leading-relaxed">Advanced construction toolset. Master precise modular generation driven by rigorous Golden Ratio (1:1.618) constraints or use Offline GenAI for infinite structure synthesis.</p>

              <div className="grid grid-cols-2 gap-2">
                 <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff7b72]/50 p-2.5 rounded flex flex-col items-center justify-center gap-1.5 transition-all group">
                    <div className="w-full h-4 border-2 border-[#ff7b72] border-b-0 group-hover:shadow-[0_0_8px_rgba(255,123,114,0.4)]"></div>
                    <span className="text-[10px] font-bold">Draw Wall</span>
                 </button>
                 <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff7b72]/50 p-2.5 rounded flex flex-col items-center justify-center gap-1.5 transition-all group">
                    <div className="w-full h-2 bg-[#ff7b72]/50 transform skew-x-[20deg] group-hover:bg-[#ff7b72]"></div>
                    <span className="text-[10px] font-bold">Place Floor</span>
                 </button>
                 <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff7b72]/50 p-2.5 rounded flex flex-col items-center justify-center gap-1.5 transition-all group">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-[6px] border-transparent border-b-[#ff7b72] group-hover:border-b-white"></div>
                    <span className="text-[10px] font-bold">Add Roof</span>
                 </button>
                 <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff7b72]/50 p-2.5 rounded flex flex-col items-center justify-center gap-1.5 transition-all group">
                    <Box size={16} className="text-[#ff7b72] group-hover:text-white" />
                    <span className="text-[10px] font-bold">Library / Props</span>
                 </button>
              </div>

              {/* Offline AI Architecture Generator */}
              <div className="bg-[#ff7b72]/10 border border-[#ff7b72]/30 p-3 rounded mt-2 shadow-[0_0_15px_rgba(255,123,114,0.1)] relative overflow-hidden">
                 <h3 className="text-[11px] font-bold text-[#ff7b72] mb-2 flex items-center gap-2"><BrainCircuit size={14}/> ProcGen Citadel / City Builder</h3>
                 <p className="text-[9px] text-[#ff7b72]/80 leading-relaxed mb-3">Offline AI calculates entire city footprints, resolving wall connections, door placements, and NPC nav-paths across thousands of nodes instantly.</p>
                 
                 <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-2 rounded mb-2">
                    <label className="text-[9px] text-[#8b949e] mb-1 block font-bold">Architectural Seed Prompt</label>
                    <textarea className="w-full h-16 bg-transparent text-[10px] text-white outline-none resize-none" defaultValue="Generate a dense medieval port city, favoring tight winding alleyways tapering towards a central grand Cathedral. All doors must be 2.1m high."></textarea>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-400 mb-2">
                    <div className="flex flex-col">
                       <span>Bounding Box (mc²)</span>
                       <input type="number" defaultValue="2500" className="w-full bg-[#1a1a24] border border-[#2a2b3d] rounded p-1 text-white" />
                    </div>
                    <div className="flex flex-col">
                       <span>Bldg Density</span>
                       <input type="range" min="1" max="100" defaultValue="85" className="w-full mt-1 accent-[#ff7b72]" />
                    </div>
                 </div>

                 <button className="w-full bg-[#ff7b72] hover:bg-[#ff8e86] text-black font-bold uppercase text-[10px] py-1.5 rounded transition">Render City Footprint (Local GPU)</button>
              </div>

              <div className="bg-[#161621] border border-[#f2cc60]/40 rounded relative overflow-hidden mt-1 p-1">
                 {/* Decorative background geometry */}
                 <div className="absolute top-0 right-0 w-32 h-32 border border-[#f2cc60]/5 rounded-sm rotate-12 translate-x-4 -translate-y-4 pointer-events-none"></div>
                 <div className="absolute top-6 right-6 w-20 h-20 border border-[#f2cc60]/10 rounded-sm rotate-12 translate-x-4 -translate-y-4 pointer-events-none"></div>

                 <div className="p-3">
                    <h3 className="text-[11px] font-bold text-[#f2cc60] uppercase mb-1 flex items-center gap-1.5"><Activity size={12}/> Proportional Design (Golden Ratio - φ)</h3>
                    <p className="text-[9px] text-[#8b949e] mb-3 leading-tight">Leverage the divine proportion (1.618) to ensure walls, windows, and entire structural masses remain naturally harmonious to human perception.</p>

                    <div className="flex flex-col gap-2">
                       <button className="w-full bg-[#f2cc60]/10 hover:bg-[#f2cc60]/20 text-[#f2cc60] border border-[#f2cc60]/30 hover:border-[#f2cc60] py-2 px-3 rounded flex items-center justify-between transition-all group">
                          <div className="flex flex-col text-left">
                             <span className="text-[10px] font-bold">Generate Golden Rectangle Room</span>
                             <span className="text-[8px] opacity-70">Auto-extrude floorplan matching 1:1.618 ratio</span>
                          </div>
                          <Plus size={14} className="group-hover:scale-125 transition-transform" />
                       </button>

                       <button className="w-full bg-[#1e1e2d] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] py-2 px-3 rounded flex items-center justify-between transition-all">
                          <div className="flex flex-col text-left">
                             <span className="text-[10px]">Lock Wall Ratios to Φ</span>
                             <span className="text-[8px] text-[#8b949e]">Height = Length ÷ 1.618</span>
                          </div>
                          <Lock size={12} className="text-gray-400" />
                       </button>

                       <div className="flex items-center gap-2 mt-2 bg-[#0a0a0f] p-2 rounded border border-[#2a2b3d]">
                           <span className="text-[10px] text-[#f2cc60] font-mono whitespace-nowrap">φ Multiplier:</span>
                           <input type="number" step="0.001" defaultValue="1.618" className="bg-transparent text-white text-xs w-full outline-none font-mono tracking-wider" readOnly />
                           <Scan size={14} className="text-gray-500 cursor-pointer hover:text-white" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-[#ff7b72]/5 border border-[#ff7b72]/20 p-3 rounded flex flex-col gap-2 mt-1">
                 <div className="flex items-start gap-2">
                    <Settings className="text-[#ff7b72] shrink-0 mt-0.5" size={14} />
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-[#ff7b72] uppercase tracking-wide">Architectural Standard Enforcement</span>
                       <span className="text-[9px] text-[#c9d1d9] leading-relaxed mt-1">If enabled, freehand walls will snap to physically realistic baselines.</span>
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-1.5 ml-5 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="accent-[#ff7b72] w-3 h-3" />
                       <span className="text-[9.5px] text-[#8b949e] group-hover:text-white transition">Minimum Ceiling Height: 2.5m</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="accent-[#ff7b72] w-3 h-3" />
                       <span className="text-[9.5px] text-[#8b949e] group-hover:text-white transition">Auto-Scale Doors to 2.1m Baseline</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="accent-[#ff7b72] w-3 h-3" />
                       <span className="text-[9.5px] text-[#8b949e] group-hover:text-white transition">Force 1:1 Scale to 180cm Humanoid Base</span>
                    </label>
                 </div>
              </div>
            </div>
        )}

          {activeTab === 'entities' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <h2 className="text-sm font-bold text-[#ffa657] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2"><User size={16}/> Entities & Spawns</h2>
              <p className="text-[11px] text-[#8b949e]">Place actors, NPCs, enemies, and interactive triggers into the world, deeply integrated with offline psychological profiles.</p>

              <div className="flex flex-col gap-2">
                 <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ffa657]/50 p-2 rounded flex items-center gap-3 transition-all text-left">
                    <div className="w-8 h-8 rounded bg-[#ffa657]/10 flex items-center justify-center text-[#ffa657]"><Target size={16} /></div>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold">Player Spawn Point</span>
                       <span className="text-[9px] text-[#8b949e]">Default instantiation coordinate</span>
                    </div>
                 </button>
                 <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ffa657]/50 p-2 rounded flex items-center gap-3 transition-all text-left">
                    <div className="w-8 h-8 rounded bg-[#ffa657]/10 flex items-center justify-center text-[#ffa657]"><User size={16} /></div>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold">Place NPC Actor</span>
                       <span className="text-[9px] text-[#8b949e]">Drops a character model</span>
                    </div>
                 </button>
                 <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ffa657]/50 p-2 rounded flex items-center gap-3 transition-all text-left">
                    <div className="w-8 h-8 rounded bg-[#f85149]/10 flex items-center justify-center text-[#f85149]"><Scan size={16} /></div>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold">Enemy Spawn Volume</span>
                       <span className="text-[9px] text-[#8b949e]">Area for continuous spawning</span>
                    </div>
                 </button>
              </div>

              {/* AI Group Behavior logic */}
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3 relative mt-2 overflow-hidden">
                 <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none scale-[2]">
                    <BrainCircuit size={64}/>
                 </div>
                 <h3 className="text-[10px] font-bold text-[#ffa657] uppercase border-b border-[#2a2b3d] pb-1 flex items-center gap-1.5"><Terminal size={12}/> AI Crowd Simulation</h3>
                 
                 <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex flex-col">
                       <span className="text-[9px] text-[#8b949e] mb-1">Flocking Priority</span>
                       <select className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1 text-white text-[10px]">
                          <option>A* Deterministic</option>
                          <option>Boids (Swarm)</option>
                          <option>LLM Action Driven</option>
                       </select>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[9px] text-[#8b949e] mb-1">Max Entity Limit (per node)</span>
                       <input type="number" defaultValue="2048" className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1 text-white text-[10px]" />
                    </div>
                 </div>
                 
                 <div className="border-t border-[#2a2b3d] pt-2 flex flex-col gap-1.5">
                    <label className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="accent-[#ffa657] w-3 h-3" />
                       <span className="text-[9px] text-[#8b949e] group-hover:text-white transition">Enable Collision Avoidance (Local GPU)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="accent-[#ffa657] w-3 h-3" />
                       <span className="text-[9px] text-[#8b949e] group-hover:text-white transition">Schedule LLM Need updates on async threads</span>
                    </label>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1">Placement Settings</h3>
                 <label className="flex items-center gap-2 cursor-pointer group mt-1">
                    <input type="checkbox" defaultChecked className="accent-[#ffa657] w-3 h-3" />
                    <span className="text-[10px] text-gray-300 group-hover:text-white transition">Snap to Nav-Mesh Ground</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer group mt-1">
                    <input type="checkbox" defaultChecked className="accent-[#ffa657] w-3 h-3" />
                    <span className="text-[10px] text-gray-300 group-hover:text-white transition">Align to Surface Normal</span>
                 </label>
              </div>
            </div>
        )}

          {activeTab === 'camera' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-20">
              <h2 className="text-sm font-bold text-[#e3b341] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2"><Camera size={16}/> Cinematic Cameras & Sequencer</h2>
              <p className="text-[11px] text-[#8b949e]">Pro-grade cinematography tools. Setup physical lens properties, sequencer timelines, rig dynamics, and 100% 3D cutscenes manually without AI tracking.</p>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-2">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5 flex items-center gap-1"><Video size={12}/> Rig & Placement Tools</h3>
                 <div className="grid grid-cols-2 gap-2 mt-1">
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#e3b341]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <Camera size={14} className="text-[#e3b341] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Static Cam</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#e3b341]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <Route size={14} className="text-[#e3b341] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Spline Path</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#e3b341]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <Aperture size={14} className="text-[#e3b341] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Dolly Track</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#e3b341]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <Compass size={14} className="text-[#e3b341] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Crane / Jib</span>
                     </button>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-[#e3b341] uppercase border-b border-[#2a2b3d] pb-1.5">Physical Lens & Sensor</h3>
                 
                 <div>
                    <div className="flex justify-between items-center mb-1">
                       <label className="text-[10px] text-[#8b949e] font-bold">Sensor Size / Film Gate</label>
                    </div>
                    <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-xs text-white outline-none">
                       <option>35mm Full Frame (36x24mm)</option>
                       <option>Super 35 (24.89x18.66mm)</option>
                       <option>IMAX 70mm (70.41x52.63mm)</option>
                       <option>Micro Four Thirds (17.3x13mm)</option>
                       <option>Custom Aspect Ratio...</option>
                    </select>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="text-[10px] text-[#8b949e] font-bold mb-1 block">Focal Length</label>
                        <div className="flex items-center gap-1 bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1">
                           <input type="number" defaultValue="50" className="w-full bg-transparent text-xs text-white outline-none text-right font-mono" />
                           <span className="text-[10px] text-gray-500 pr-1">mm</span>
                        </div>
                     </div>
                     <div>
                        <label className="text-[10px] text-[#8b949e] font-bold mb-1 block">Aperture (f-stop)</label>
                        <div className="flex items-center gap-1 bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1">
                           <span className="text-[10px] text-gray-500 pl-1">f/</span>
                           <input type="number" step="0.1" defaultValue="1.8" className="w-full bg-transparent text-xs text-white outline-none text-left font-mono" />
                        </div>
                     </div>
                 </div>

                 <div>
                    <div className="flex justify-between items-center mb-1">
                       <label className="text-[10px] text-[#8b949e] font-bold">Focus Distance</label>
                       <span className="text-[10px] font-mono text-white">4.2m</span>
                    </div>
                    <input type="range" min="0.1" max="100" step="0.1" defaultValue="4.2" className="w-full accent-[#e3b341] h-1.5 bg-[#0a0a0f] rounded appearance-none" />
                 </div>

                 <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3 h-3" />
                    <span className="text-[10px] text-gray-300">Enable Anamorphic Squeeze (Desqueeze in Viewport)</span>
                 </label>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5 flex items-center gap-1"><Play size={12} className="text-green-400"/> 3D Cutscene Sequencer</h3>
                 
                 <div className="flex items-center gap-1 bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1 overflow-hidden">
                     <button className="p-1.5 text-gray-400 hover:text-white bg-[#1a1a24] hover:bg-[#2a2b3d] rounded"><Rewind size={12}/></button>
                     <button className="p-1.5 text-green-400 hover:text-green-300 bg-[#1a1a24] hover:bg-[#2a2b3d] rounded"><Play size={12}/></button>
                     <button className="p-1.5 text-gray-400 hover:text-white bg-[#1a1a24] hover:bg-[#2a2b3d] rounded"><FastForward size={12}/></button>
                     <div className="w-[1px] h-4 bg-[#2a2b3d] mx-1"></div>
                     <span className="text-[10px] font-mono text-[#e3b341] px-2 flex-1">00:01:24:12</span>
                     <span className="text-[9px] font-mono text-gray-500 pr-2">24 FPS</span>
                 </div>

                 <div>
                    <label className="text-[10px] text-[#8b949e] font-bold mb-1 block">Keyframe Interpolation</label>
                    <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-xs text-white outline-none">
                       <option>Auto-Bezier (Smooth curve)</option>
                       <option>Linear (Constant speed)</option>
                       <option>Stepped (Instant jump)</option>
                       <option>Manual Bezier Paths</option>
                    </select>
                 </div>

                 <div className="border border-[#2a2b3d] rounded bg-[#0a0a0f] relative mt-1 flex flex-col overflow-hidden">
                     {/* Timeline Header */}
                     <div className="h-6 border-b border-[#2a2b3d] bg-[#1a1a24] flex items-center px-2 relative">
                         <div className="text-[8px] text-gray-500 font-mono absolute left-[10%]">0s</div>
                         <div className="text-[8px] text-gray-500 font-mono absolute left-[30%]">2s</div>
                         <div className="text-[8px] text-gray-500 font-mono absolute left-[50%]">4s</div>
                         <div className="text-[8px] text-gray-500 font-mono absolute left-[70%]">6s</div>
                         <div className="text-[8px] text-gray-500 font-mono absolute left-[90%]">8s</div>
                     </div>

                     {/* Playhead */}
                     <div className="absolute top-0 bottom-0 left-[30%] w-[1px] bg-red-500 z-10 shadow-[0_0_4px_red]">
                         <div className="absolute top-0 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-[6px] border-transparent border-t-red-500"></div>
                     </div>

                     {/* Keyframe Channels */}
                     <div className="flex flex-col py-1">
                         {/* Transform Channel */}
                         <div className="relative h-8 flex items-center px-2 border-b border-[#2a2b3d]/50 group hover:bg-[#1a1a24]">
                             <div className="w-24 shrink-0 text-[9px] text-[#e3b341] font-bold flex items-center justify-between pr-2">
                                 <span>Transform</span>
                                 <button className="text-gray-500 hover:text-white" title="Add Keyframe"><Plus size={10}/></button>
                             </div>
                             <div className="flex-1 relative h-full flex items-center">
                                 <div className="absolute left-[10%] w-2 h-2 rotate-45 bg-[#e3b341] cursor-pointer shadow-[0_0_5px_#e3b341]"></div>
                                 <div className="absolute left-[30%] w-2 h-2 rotate-45 bg-white cursor-pointer hover:bg-[#e3b341]"></div>
                                 <div className="absolute left-[70%] w-2 h-2 rotate-45 bg-[#e3b341] cursor-pointer shadow-[0_0_5px_#e3b341]"></div>
                                 <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
                                    <path d="M 10% 50% L 30% 50% L 70% 50%" stroke="#e3b341" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="2,2" />
                                 </svg>
                             </div>
                         </div>
                         
                         {/* Focal Length Channel */}
                         <div className="relative h-8 flex items-center px-2 border-b border-[#2a2b3d]/50 group hover:bg-[#1a1a24]">
                             <div className="w-24 shrink-0 text-[9px] text-[#58a6ff] font-bold flex items-center justify-between pr-2">
                                 <span>Focal Length</span>
                                 <button className="text-gray-500 hover:text-white" title="Add Keyframe"><Plus size={10}/></button>
                             </div>
                             <div className="flex-1 relative h-full flex items-center">
                                 <div className="absolute left-[10%] w-1.5 h-1.5 rounded-full bg-[#58a6ff] cursor-pointer shadow-[0_0_5px_#58a6ff]"></div>
                                 <div className="absolute left-[50%] w-1.5 h-1.5 rounded-full bg-[#58a6ff] cursor-pointer shadow-[0_0_5px_#58a6ff]"></div>
                                 <div className="absolute left-[90%] w-1.5 h-1.5 rounded-full bg-[#58a6ff] cursor-pointer shadow-[0_0_5px_#58a6ff]"></div>
                                 <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 bg-gradient-to-b from-transparent to-[#58a6ff]/5">
                                    <path d="M 10% 50% Q 30% 20% 50% 50% T 90% 50%" stroke="#58a6ff" strokeWidth="1" fill="none" opacity="0.5" />
                                 </svg>
                             </div>
                         </div>
                         
                         {/* Aperture Channel */}
                         <div className="relative h-8 flex items-center px-2 group hover:bg-[#1a1a24]">
                             <div className="w-24 shrink-0 text-[9px] text-[#3fb950] font-bold flex items-center justify-between pr-2">
                                 <span>Aperture</span>
                                 <button className="text-gray-500 hover:text-white" title="Add Keyframe"><Plus size={10}/></button>
                             </div>
                             <div className="flex-1 relative h-full flex items-center">
                                 <div className="absolute left-[5%] w-1.5 h-1.5 rounded-full bg-[#3fb950] cursor-pointer hover:shadow-[0_0_5px_#3fb950]"></div>
                                 <div className="absolute left-[30%] w-1.5 h-1.5 rounded-full bg-[#3fb950] cursor-pointer shadow-[0_0_4px_#3fb950]"></div>
                                 <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
                                    <path d="M 5% 50% L 30% 50% L 100% 50%" stroke="#3fb950" strokeWidth="1" fill="none" opacity="0.3" />
                                 </svg>
                             </div>
                         </div>
                     </div>
                 </div>
                 
                 <div className="flex gap-2">
                     <button className="flex-1 bg-[#2a2b3d] hover:bg-[#3b3d54] text-xs font-bold text-white py-1.5 rounded transition-colors text-center border border-[#2a2b3d] hover:border-gray-500">Edit Curves</button>
                     <button className="flex-1 bg-[#e3b341]/10 hover:bg-[#e3b341]/20 text-xs font-bold text-[#e3b341] py-1.5 rounded transition-colors text-center border border-[#e3b341]/30 hover:border-[#e3b341]/50">Export Sequence</button>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5">Rig Motion & Dynamics</h3>
                 
                 <div className="grid grid-cols-1 gap-2 mt-1">
                     <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[10px] text-gray-400 group-hover:text-white transition">Enable Camera Shake (Perlin Noise)</span>
                        <input type="checkbox" className="accent-[#e3b341] w-3.5 h-3.5" />
                     </label>
                     <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[10px] text-gray-400 group-hover:text-white transition">Look-At Target Tracking Clamp</span>
                        <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3.5 h-3.5" />
                     </label>
                 </div>
                 
                 <div className="flex flex-col gap-2 mt-1">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] text-[#8b949e]">Pan/Tilt Damping (Smoothing)</label>
                       <span className="text-[10px] font-mono text-white">0.08</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" defaultValue="0.08" className="w-full accent-[#e3b341] h-1.5 bg-[#0a0a0f] rounded appearance-none" />
                 </div>
              </div>

              <div className="bg-gradient-to-t from-[#1e1e2d] to-[#1a1a24] border border-[#f2cc60]/40 p-3 rounded flex flex-col gap-3 relative overflow-hidden">
                 <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                     <Grid3X3 size={64} className="text-[#f2cc60]" />
                 </div>
                 
                 <h3 className="text-[10px] font-bold text-[#f2cc60] uppercase border-b border-[#f2cc60]/20 pb-1.5 flex items-center gap-2"><Scan size={12}/> Composition Overlays</h3>
                 
                 <div>
                    <label className="text-[10px] text-gray-300 mb-1.5 block font-bold">Active Viewport Guide</label>
                    <select 
                       className="w-full bg-[#0a0a0f] border border-[#f2cc60]/30 rounded p-2 text-xs text-white outline-none focus:border-[#f2cc60]"
                       value={activeCompositionGuide}
                       onChange={(e) => {
                          setActiveCompositionGuide(e.target.value);
                          if (e.target.value !== 'None (Clean Plate)') setShowCompositionGuide(true);
                       }}
                    >
                       <option>None (Clean Plate)</option>
                       <option>Rule of Thirds (3x3)</option>
                       <option>Golden Spiral (Fibonacci)</option>
                       <option>Golden Triangles</option>
                       <option>Golden Ratio Grid (Phi Grid)</option>
                       <option>Diagonal Method</option>
                       <option>Center Crosshair</option>
                    </select>
                 </div>

                 <div className="flex items-center justify-between text-[10px] mt-1 bg-[#0a0a0f]/50 p-2 rounded border border-[#2a2b3d]">
                     <span className="text-[#8b949e]">Safe Action Area</span>
                     <span className="text-[#f2cc60] font-mono font-bold border border-[#f2cc60]/30 px-1 rounded">90%</span>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5">Post Processing Engine</h3>
                 
                 <div className="grid grid-cols-1 gap-2 mt-1">
                     <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[10px] text-gray-400 group-hover:text-white transition">Depth of Field (Bokeh)</span>
                        <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3.5 h-3.5" />
                     </label>
                     <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[10px] text-gray-400 group-hover:text-white transition">Motion Blur</span>
                        <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3.5 h-3.5" />
                     </label>
                     <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[10px] text-gray-400 group-hover:text-white transition">Screen Space Reflections (SSR)</span>
                        <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3.5 h-3.5" />
                     </label>
                     <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[10px] text-gray-400 group-hover:text-white transition">Ambient Occlusion (SSAO)</span>
                        <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3.5 h-3.5" />
                     </label>
                     <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[10px] text-gray-400 group-hover:text-white transition">Chromatic Aberration</span>
                        <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3.5 h-3.5" />
                     </label>
                 </div>

                 <div className="mt-2 space-y-3 border-t border-[#2a2b3d] pt-3">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                           <label className="text-[10px] text-[#8b949e] font-bold">Lens Bloom Intensity</label>
                           <span className="text-[10px] font-mono text-[#e3b341]">1.20</span>
                        </div>
                        <input type="range" min="0" max="100" defaultValue="15" className="w-full accent-[#e3b341] h-1.5 bg-[#0a0a0f] rounded appearance-none" />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                           <label className="text-[10px] text-[#8b949e] font-bold">Film Grain (Noise)</label>
                           <span className="text-[10px] font-mono text-[#e3b341]">30%</span>
                        </div>
                        <input type="range" min="0" max="100" defaultValue="30" className="w-full accent-[#e3b341] h-1.5 bg-[#0a0a0f] rounded appearance-none" />
                    </div>
                 </div>
              </div>
            </div>
        )}


          {activeTab === 'minimap' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1">
               <h2 className="text-sm font-bold text-[#c9d1d9] border-b border-[#2a2b3d] pb-2 mb-2">Mini Map Master Editor</h2>
               
               <div>
                 <label className="text-xs text-[#8b949e] mb-1 block">Mini Map Master Template</label>
                 <select 
                   value={miniMapStyle} 
                   onChange={(e) => setMiniMapStyle(e.target.value)}
                   className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded px-2 py-1.5 text-xs text-white"
                 >
                   <option value="fantasy">Classic Fantasy Parchment</option>
                   <option value="modern">Modern GPS HUD</option>
                   <option value="sci-fi">Sci-Fi Cyber Hologram</option>
                   <option value="minimal">Minimal Grid Outline</option>
                 </select>
                 <div className="text-[10px] text-[#58a6ff] mt-1 italic">Note: Future regions will clone this base template.</div>
               </div>

               <div className="border-t border-[#2a2b3d] pt-3 mt-1">
                 <h3 className="text-xs font-bold text-[#c9d1d9] mb-2 flex items-center justify-between">
                    Add POI Marker
                 </h3>
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => addMarker('town')} className="bg-[#1e1e2d] hover:bg-[#2a2b3d] border border-[#2a2b3d] p-1.5 rounded flex items-center justify-center gap-1 text-[11px] text-[#3fb950] transition"><MapPin size={12}/> City/Town</button>
                    <button onClick={() => addMarker('dungeon')} className="bg-[#1e1e2d] hover:bg-[#2a2b3d] border border-[#2a2b3d] p-1.5 rounded flex items-center justify-center gap-1 text-[11px] text-[#f85149] transition"><Target size={12}/> Dungeon</button>
                    <button onClick={() => addMarker('shop')} className="bg-[#1e1e2d] hover:bg-[#2a2b3d] border border-[#2a2b3d] p-1.5 rounded flex items-center justify-center gap-1 text-[11px] text-[#e3b341] transition"><Map size={12}/> Shop/NPC</button>
                    <button onClick={() => addMarker('quest')} className="bg-[#1e1e2d] hover:bg-[#2a2b3d] border border-[#2a2b3d] p-1.5 rounded flex items-center justify-center gap-1 text-[11px] text-[#58a6ff] transition"><Search size={12}/> Quest Hub</button>
                    <button onClick={() => addMarker('text')} className="bg-[#1e1e2d] hover:bg-[#2a2b3d] border border-[#2a2b3d] p-1.5 rounded flex items-center justify-center gap-1 text-[11px] text-white col-span-2 transition"><Type size={12}/> 3D Floating Text Map Note</button>
                 </div>
               </div>

               <div className="border-t border-[#2a2b3d] pt-3 mt-1 flex-1 flex flex-col">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-[#c9d1d9]">Live Map Hierarchy</h3>
                    <div className="flex bg-[#1e1e2d] rounded overflow-hidden border border-[#2a2b3d]">
                       <button onClick={() => setVisibleLayers(prev => ({...prev, town: !prev.town}))} className={`p-1 hover:bg-[#2a2b3d] transition ${visibleLayers.town ? 'text-[#3fb950]' : 'text-gray-600'}`} title="Toggle Towns"><MapPin size={12}/></button>
                       <button onClick={() => setVisibleLayers(prev => ({...prev, dungeon: !prev.dungeon}))} className={`p-1 hover:bg-[#2a2b3d] transition ${visibleLayers.dungeon ? 'text-[#f85149]' : 'text-gray-600'}`} title="Toggle Dungeons"><Target size={12}/></button>
                       <button onClick={() => setVisibleLayers(prev => ({...prev, shop: !prev.shop}))} className={`p-1 hover:bg-[#2a2b3d] transition ${visibleLayers.shop ? 'text-[#e3b341]' : 'text-gray-600'}`} title="Toggle Shops"><Map size={12}/></button>
                       <button onClick={() => setVisibleLayers(prev => ({...prev, quest: !prev.quest}))} className={`p-1 hover:bg-[#2a2b3d] transition ${visibleLayers.quest ? 'text-[#58a6ff]' : 'text-gray-600'}`} title="Toggle Quests"><Search size={12}/></button>
                       <button onClick={() => setVisibleLayers(prev => ({...prev, npc: !prev.npc}))} className={`p-1 hover:bg-[#2a2b3d] transition ${visibleLayers.npc ? 'text-purple-400' : 'text-gray-600'}`} title="Toggle NPCs"><User size={12}/></button>
                    </div>
                 </div>
                 <div className="flex flex-col gap-1 overflow-y-auto flex-1 custom-scrollbar">
                   {mapLayers.find(l => l.name === 'Entities & POIs')?.visible && markers.filter(m => visibleLayers[m.type]).map(m => (
                     <div key={m.id} className={`flex items-center justify-between text-xs bg-[#1e1e2d] px-2 py-1.5 rounded border ${selectedMarkerId === m.id ? 'border-purple-500 bg-purple-500/10' : 'border-[#2a2b3d]'}`}>
                        <input 
                          type="text" 
                          value={m.label} 
                          onClick={() => setSelectedMarkerId(m.id)}
                          onChange={(e) => setMarkers(markers.map(mx => mx.id === m.id ? {...mx, label: e.target.value} : mx))}
                          className="bg-transparent border-none outline-none w-2/3 text-white font-semibold cursor-pointer"
                        />
                        <button onClick={() => removeMarker(m.id)} className="text-gray-500 hover:text-[#f85149] transition"><X size={12}/></button>
                     </div>
                   ))}
                   {(!mapLayers.find(l => l.name === 'Entities & POIs')?.visible || markers.filter(m => visibleLayers[m.type]).length === 0) && (
                      <div className="text-[10px] text-gray-500 text-center py-4">No matching entities found.</div>
        )}
                 </div>
                 
                 <div className="mt-2 border-t border-[#2a2b3d] pt-2 flex gap-1 items-center">
                    <button onClick={() => addMarker('town')} className="p-1.5 bg-[#1e1e2d] hover:bg-[#2a2b3d] rounded border border-[#2a2b3d] text-[#3fb950] transition" title="Add Town"><MapPin size={14}/></button>
                    <button onClick={() => addMarker('dungeon')} className="p-1.5 bg-[#1e1e2d] hover:bg-[#2a2b3d] rounded border border-[#2a2b3d] text-[#f85149] transition" title="Add Dungeon"><Target size={14}/></button>
                    <button onClick={() => addMarker('npc')} className="p-1.5 bg-[#1e1e2d] hover:bg-purple-500/20 rounded border border-[#2a2b3d] text-purple-400 transition ml-auto flex items-center gap-1 font-bold text-[10px]" title="Add NPC"><Plus size={10} /> NPC</button>
                 </div>
               </div>
            </div>
        )}

          {activeTab === 'storygraph' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-20">
              <h2 className="text-sm font-bold text-[#ff6e9a] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2"><GitBranch size={16}/> StoryGraph Node Editor</h2>
              <p className="text-[11px] text-[#8b949e]">Manually define branching dialogue paths, conditional logic nodes, and narrative state transitions. (No AI assist)</p>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-2">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5 flex items-center gap-1"><Plus size={12}/> Create Node</h3>
                 <div className="grid grid-cols-2 gap-2 mt-1">
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff6e9a]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <MessageSquare size={14} className="text-[#ff6e9a] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Dialogue Box</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff6e9a]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <GitBranch size={14} className="text-[#ff6e9a] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Choice Branch</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#3fb950]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <Target size={14} className="text-[#3fb950] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">State Check</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#58a6ff]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <Settings size={14} className="text-[#58a6ff] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Set Variable</span>
                     </button>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5 flex items-center gap-1"><Settings size={12}/> Global Narrative State</h3>
                 
                 <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-[#0a0a0f] p-1.5 rounded border border-[#2a2b3d]">
                        <span className="text-[10px] text-gray-400 font-mono">PLAYER_KARMA</span>
                        <span className="text-[10px] text-[#ff6e9a] font-mono font-bold">Integer</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#0a0a0f] p-1.5 rounded border border-[#2a2b3d]">
                        <span className="text-[10px] text-gray-400 font-mono">faction_reputation</span>
                        <span className="text-[10px] text-[#ff6e9a] font-mono font-bold">Float</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#0a0a0f] p-1.5 rounded border border-[#2a2b3d]">
                        <span className="text-[10px] text-gray-400 font-mono">has_met_king</span>
                        <span className="text-[10px] text-[#ff6e9a] font-mono font-bold">Boolean</span>
                    </div>
                    
                    <button className="w-full bg-[#2a2b3d] hover:bg-[#3b3d54] text-xs font-bold text-white py-1.5 rounded transition-colors text-center border border-[#2a2b3d] hover:border-gray-500 mt-1">
                        + Define New Variable
                    </button>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5 flex items-center gap-1"><Search size={12}/> Graph Overview</h3>
                 
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Total Nodes</span>
                    <span className="text-white font-mono font-bold">142</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Active Branches</span>
                    <span className="text-white font-mono font-bold">34</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Unlinked Nodes</span>
                    <span className="text-[#f85149] font-mono font-bold">3</span>
                 </div>
                 
                 <button className="w-full bg-[#1a1a24] hover:bg-[#2a2b3d] text-[#ff6e9a] font-bold text-[9px] py-2 rounded transition-colors border border-[#ff6e9a]/30 mt-1">
                    Auto-Layout Nodes (Force Directed)
                 </button>
              </div>

              <div className="flex gap-2">
                 <button className="flex-1 bg-[#ff6e9a]/10 hover:bg-[#ff6e9a]/20 text-xs font-bold text-[#ff6e9a] py-2 rounded transition-colors border border-[#ff6e9a]/30 hover:border-[#ff6e9a]/50 flex items-center justify-center gap-1">
                    <Save size={12} /> Save Graph
                 </button>
              </div>
            </div>
        )}

          {activeTab === 'tasks' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-20">
              <h2 className="text-sm font-bold text-[#ffeb3b] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2"><CheckSquare size={16}/> Task Controls</h2>
              <p className="text-[11px] text-[#8b949e]">Manage your project tasks or view active workloads from the Express backend.</p>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-2">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5">Overview</h3>
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Total Backlog</span>
                    <span className="text-white font-mono font-bold">14</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>In-Progress</span>
                    <span className="text-[#58a6ff] font-mono font-bold">2</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Completed</span>
                    <span className="text-[#3fb950] font-mono font-bold">28</span>
                 </div>
              </div>
            </div>
        )}

          {activeTab === 'workflow' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-20">
              <h2 className="text-sm font-bold text-[#ff944d] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2"><Network size={16}/> Local Workflow Engine</h2>
              <p className="text-[11px] text-[#8b949e]">Offline node-based automation. Build complex pipelines for game state processing, autonomous agent behaviors, and world-tick data crunching without external API calls.</p>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-2">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5 flex items-center gap-1"><Plus size={12}/> Event Triggers</h3>
                 <div className="grid grid-cols-2 gap-2 mt-1">
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff944d]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <Clock size={14} className="text-[#ff944d] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Cron Schedule</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff944d]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <Zap size={14} className="text-[#ff944d] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Game Tick</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff944d]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group lg:col-span-2">
                        <Webhook size={14} className="text-[#ff944d] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Zone Enter / Exit webhook hook</span>
                     </button>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-2">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5 flex items-center gap-1"><Cpu size={12}/> Action & Compute Nodes</h3>
                 <div className="grid grid-cols-2 gap-2 mt-1">
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#3fb950]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <Scan size={14} className="text-[#3fb950] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold text-center">NavMesh Query</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#bc8cff]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <BrainCircuit size={14} className="text-[#bc8cff] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold text-center">Local LLM Infer</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#58a6ff]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <Terminal size={14} className="text-[#58a6ff] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Code (JS/Lua)</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#f2cc60]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <Database size={14} className="text-[#f2cc60] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Read/Write DB</span>
                     </button>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-2">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5 flex items-center gap-1"><Network size={12}/> Control Flow</h3>
                 <div className="grid grid-cols-2 gap-2 mt-1">
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff6e9a]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <GitBranch size={14} className="text-[#ff6e9a] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">IF Condition</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff6e9a]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group">
                        <Target size={14} className="text-[#ff6e9a] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Switch</span>
                     </button>
                     <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] text-white border border-[#2a2b3d] hover:border-[#ff6e9a]/50 p-2 rounded flex flex-col items-center gap-1.5 transition-all group lg:col-span-2">
                        <Activity size={14} className="text-[#ff6e9a] group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold">Loop (Map/Iterate)</span>
                     </button>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5">Node Properties: Script</h3>
                 <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-400">Node ID</span>
                    <span className="text-white font-mono bg-[#0a0a0f] border border-[#2a2b3d] px-1 rounded">node_5A2B</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-400">Engine</span>
                    <select className="bg-[#0a0a0f] text-[#58a6ff] border border-[#2a2b3d] rounded outline-none p-0.5 font-bold">
                        <option>V8 Engine (JS)</option>
                        <option>LuaJIT</option>
                        <option>Python Sandbox</option>
                    </select>
                 </div>
                 <div className="flex flex-col gap-1 text-[10px]">
                    <span className="text-gray-400">Input Payload Mapping</span>
                    <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 flex flex-col gap-1 font-mono text-[9px]">
                        <div className="flex justify-between items-center"><span className="text-gray-500">trigger.output ➔</span><span className="text-green-400">msg.payload</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-500">env.TICK_RATE ➔</span><span className="text-green-400">msg.tick_rate</span></div>
                    </div>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5 flex items-center gap-1"><Scan size={12}/> Inspection & Memory</h3>
                 
                 <div className="flex flex-col gap-1 text-[10px]">
                    <span className="text-gray-400">Node Output Payload (Live)</span>
                    <div className="bg-[#0a0a0f] border border-[#58a6ff]/30 rounded p-1.5 flex flex-col gap-1 font-mono text-[9px] text-gray-300 h-24 overflow-y-auto overflow-x-hidden">
                       <span className="text-[#ff944d]">{"{"}</span>
                       <span className="pl-2">"agent_id": <span className="text-[#3fb950]">"NPC_WOLF_8"</span>,</span>
                       <span className="pl-2">"state": <span className="text-[#3fb950]">"HUNGRY"</span>,</span>
                       <span className="pl-2">"stamina": <span className="text-[#bc8cff]">14.22</span>,</span>
                       <span className="pl-2">"target_coords": {"{"} <span className="text-[#bc8cff]">243.1</span>, <span className="text-[#bc8cff]">12.5</span> {"}"}</span>
                       <span className="text-[#ff944d]">{"}"}</span>
                    </div>
                 </div>
                 <div className="flex justify-between items-center text-[10px] mt-1">
                     <span className="text-gray-400">Execution Time</span>
                     <span className="text-white font-mono bg-[#0a0a0f] border border-[#2a2b3d] px-1 rounded">1.2ms</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] mt-1">
                     <span className="text-gray-400">Memory Usage</span>
                     <span className="text-white font-mono bg-[#0a0a0f] border border-[#2a2b3d] px-1 rounded">240 KB</span>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex flex-col gap-3">
                 <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#2a2b3d] pb-1.5">Execution Environment</h3>
                 <div className="flex flex-col gap-2 mt-1">
                    <label className="text-[9px] text-[#8b949e] font-bold block">Max Concurrent Executions</label>
                    <div className="flex items-center gap-2">
                        <input type="range" min="1" max="100" defaultValue="10" className="w-full accent-[#ff944d] h-1 bg-[#1a1a24] rounded" />
                        <span className="text-[10px] text-white font-mono shrink-0">10 Threads</span>
                    </div>
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-gray-400 mt-2">
                    <span>Background Daemon processing</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-7 h-4 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#ff944d]"></div>
                    </label>
                 </div>
              </div>

              <div className="bg-[#ff944d]/10 border border-[#ff944d]/30 p-3 rounded flex flex-col items-center justify-center gap-2 relative overflow-hidden group hover:border-[#ff944d]/50 cursor-pointer transition-colors">
                  <div className="absolute inset-0 bg-[#ff944d] opacity-5 pointer-events-none transition-opacity group-hover:opacity-10"></div>
                  <Play size={24} className="text-[#ff944d] opacity-80 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#ff944d]">Execute Workflow</span>
                  <span className="text-[8px] text-[#ff944d]/80 text-center uppercase tracking-widest mt-1">Simulate Execution Dry-Run</span>
              </div>

            </div>
        )}

          {activeTab === 'ai' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <h2 className="text-sm font-bold text-[#bc8cff] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2"><BrainCircuit size={16}/> GenAI Offline Topology Engine</h2>
              <p className="text-[11px] text-[#8b949e] leading-relaxed">Instruct the Offline AI Swarm Copilot to calculate physics-accurate geography, utilizing the sub-nanometer <span className="text-[#bc8cff] font-bold">1 vc</span> collision mesh pipeline and real-world architectural constraints.</p>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-3 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                 <h3 className="text-[10px] font-bold text-orange-400 mb-3 uppercase flex items-center gap-1.5"><Scan size={12} /> Architectural Scale Strictness</h3>
                 
                 <div className="flex flex-col gap-3 relative z-10">
                    <label className="flex items-center gap-2 cursor-pointer group mb-1">
                       <input type="checkbox" defaultChecked className="accent-orange-500 w-3.5 h-3.5" />
                       <span className="text-[10px] text-gray-300 group-hover:text-white transition font-bold text-shadow">Enforce 1:1 Real-World Metrics</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                       <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-1.5 rounded flex flex-col">
                          <span className="text-[9px] text-[#8b949e] mb-1">Humanoid Entity Height</span>
                          <div className="flex items-center gap-1"><input type="number" defaultValue={180} className="w-12 bg-transparent text-white font-mono outline-none border-b border-[#2a2b3d] focus:border-orange-500 text-right" /> <span className="text-[10px] text-gray-500 font-mono">cm</span></div>
                       </div>
                       <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-1.5 rounded flex flex-col">
                          <span className="text-[9px] text-[#8b949e] mb-1">Min Floor Height (Floor-to-Ceiling)</span>
                          <div className="flex items-center gap-1"><input type="number" defaultValue={2.5} step="0.1" className="w-12 bg-transparent text-white font-mono outline-none border-b border-[#2a2b3d] focus:border-orange-500 text-right" /> <span className="text-[10px] text-gray-500 font-mono">m</span></div>
                       </div>
                       <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-1.5 rounded flex flex-col mt-1">
                          <span className="text-[9px] text-[#8b949e] mb-1">Doorway Headroom Baseline</span>
                          <div className="flex items-center gap-1"><input type="number" defaultValue={2.1} step="0.1" className="w-12 bg-transparent text-white font-mono outline-none border-b border-[#2a2b3d] focus:border-orange-500 text-right" /> <span className="text-[10px] text-gray-500 font-mono">m</span></div>
                       </div>
                       <div className="bg-[#0a0a0f] border border-[#2a2b3d] p-1.5 rounded flex flex-col mt-1">
                          <span className="text-[9px] text-[#8b949e] mb-1">Volumetric Mesh Tolerance</span>
                          <div className="flex items-center gap-1"><input type="number" defaultValue={5} className="w-12 bg-transparent text-[#bc8cff] font-mono outline-none border-b border-[#2a2b3d] focus:border-[#bc8cff] text-right" /> <span className="text-[10px] text-[#bc8cff]/50 font-mono">vc</span></div>
                       </div>
                    </div>
                    
                    <p className="text-[9px] text-[#8b949e] leading-tight mt-1 border-l-2 border-orange-500/50 pl-2">Models generated off-scale will be automatically recalculated to fit the clearance requirements of the generated architecture before placing into the nav mesh.</p>
                 </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded flex flex-col gap-2 relative mt-1">
                 <div className="flex items-center justify-between text-[10px] font-bold text-gray-300 border-b border-[#2a2b3d] pb-2 mb-1">
                    <span>Physics Offline Solver</span>
                    <span className="text-[#3fb950] bg-[#3fb950]/10 px-1 rounded flex items-center gap-1"><Cloud size={10}/> GPU Node Active</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Erosion Calculation Algorithm</span>
                    <span className="text-[#3fb950]">Aggressive (10M Yrs)</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Water Table & Aquifer Simulation</span>
                    <span className="text-[#58a6ff]">Hydraulic Raytrace</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Structural Load Bearing Validation</span>
                    <span className="text-[#f85149]">Strict Gravity (9.8m/s²)</span>
                 </div>
              </div>

              <div className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 p-3 rounded mt-1 shadow-[0_0_15px_rgba(188,140,255,0.05)]">
                 <h3 className="text-xs font-bold text-[#bc8cff] mb-2 flex items-center gap-2">Neural Generation Prompt</h3>
                 <textarea className="w-full h-24 bg-[#0a0a0f] border border-[#2a2b3d] rounded text-[11px] p-2 text-white resize-none leading-relaxed custom-scrollbar focus:border-[#bc8cff] outline-none transition-colors" defaultValue="Generate a massive 16,000 mc ancient forest basin. Apply the 1:1 scale constraints strictly: populate structures with minimum 2.5m ceilings, doors scaled to 2.1m, and fit humanoid models mapping roughly 180cm tall. Calculate microscopic root structures and soil density down to the vc unit for real-time physics destructibility. Seed hidden dungeon POIs into the lower 500 mc bedrock." />
                 
                 <div className="mt-3 border-t border-[#bc8cff]/20 pt-3">
                    <h3 className="text-[10px] font-bold text-white uppercase mb-2">Automated Geometry & Rigging Rules</h3>
                    
                    <div className="flex flex-col gap-1.5 ml-2">
                       <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-3 h-3" />
                          <span className="text-[9px] text-[#8b949e] group-hover:text-white transition">Auto-Rig Spline Roots & IK Chains on Terrain Generation</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-3 h-3" />
                          <span className="text-[9px] text-gray-300 group-hover:text-white transition">Auto-Rig 180cm Humanoid Skeletons (IK/FK) to spawned entities</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-3 h-3" />
                          <span className="text-[9px] text-gray-300 group-hover:text-white transition">Procedural Door Frame Expansion (Auto-cut 2.1m holes in walls)</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-3 h-3" />
                          <span className="text-[9px] text-gray-300 group-hover:text-white transition">Verify Nav-Mesh constraints for 180cm capsule collider</span>
                       </label>
                    </div>
                 </div>
              </div>

              {/* NEW ADDTION: Detailed Story & Cutscene Engine */}
              <div className="bg-gradient-to-br from-[#1e1e2d] to-[#120f26] border border-[#bc8cff]/40 p-4 rounded mt-4 shadow-[0_0_20px_rgba(188,140,255,0.1)] relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#bc8cff]/10 rounded-full blur-3xl pointer-events-none"></div>
                 
                 <h2 className="text-sm font-bold text-white border-b border-[#bc8cff]/30 pb-2 mb-3 flex items-center gap-2">
                    <History size={16} className="text-[#bc8cff]"/> AI Offline Story & Cinematic Director Engine
                 </h2>
                 <p className="text-[10px] text-[#8b949e] leading-relaxed mb-4">
                    Advanced offline neural director for generating deeply branching narratives, complex NPC psychological profiles, and 100% automated 3D cutscene staging. Computes emotional arcs and physical actor blocking via structural constraints without manual animation requirements.
                 </p>

                 <div className="flex flex-col gap-4 relative z-10">
                     
                     {/* Narrative Engine */}
                     <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-3">
                        <h3 className="text-[11px] font-bold text-[#bc8cff] mb-2 uppercase flex items-center gap-1.5"><BrainCircuit size={12}/> World Lore & Narrative Synthesis</h3>
                        
                        <div className="grid grid-cols-1 gap-3">
                           <div>
                              <div className="flex justify-between items-center text-[9px] text-gray-400 mb-1">
                                 <span>Narrative Complexity Depth (Tokens)</span>
                                 <span className="text-[#bc8cff] font-mono">1.2M Tokens Max</span>
                              </div>
                              <input type="range" min="100" max="1000" defaultValue="750" className="w-full accent-[#bc8cff] h-1.5 bg-[#1a1a24] rounded appearance-none" />
                           </div>
                           
                           <div>
                              <label className="text-[9px] text-[#8b949e] font-bold block mb-1">Branching Dialogue Causality Model</label>
                              <select className="w-full bg-[#1a1a24] border border-[#2a2b3d] rounded p-1.5 text-xs text-white outline-none focus:border-[#bc8cff]">
                                 <option>Butterfly Effect (Strict Permanent Consequences)</option>
                                 <option>Illusion of Choice (Convergent Funnel)</option>
                                 <option>Hub & Spoke (Modular Quest Lines)</option>
                                 <option>Dynamic Markov Chain (Fully Emergent)</option>
                              </select>
                           </div>

                           <div className="flex flex-col gap-1.5 mt-1 border-t border-[#2a2b3d] pt-2">
                              <label className="flex items-start gap-2 cursor-pointer group">
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-3 h-3 mt-0.5 shrink-0" />
                                 <div className="flex flex-col">
                                    <span className="text-[9.5px] font-bold text-gray-300 group-hover:text-white transition">Auto-Generate Hidden Lore Fragments & World Metadata</span>
                                    <span className="text-[8px] text-[#8b949e]">Creates scattered diaries, environmental storytelling props, and ancient texts referencing dynamic historical events.</span>
                                 </div>
                              </label>
                              <label className="flex items-start gap-2 cursor-pointer group">
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-3 h-3 mt-0.5 shrink-0" />
                                 <div className="flex flex-col">
                                    <span className="text-[9.5px] font-bold text-gray-300 group-hover:text-white transition">Inject Unreliable Narrator Biases into NPC Dialogue</span>
                                    <span className="text-[8px] text-[#8b949e]">NPCs lie, misremember, or manipulate the player based on their localized political alignments and hidden motives.</span>
                                 </div>
                              </label>
                              <label className="flex items-start gap-2 cursor-pointer group">
                                 <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-3 h-3 mt-0.5 shrink-0" />
                                 <div className="flex flex-col">
                                    <span className="text-[9.5px] font-bold text-gray-300 group-hover:text-white transition">Simulate Multi-Generational Political Conflicts</span>
                                    <span className="text-[8px] text-[#8b949e]">Bakes 500+ years of simulated faction warfare, economic trading routes, and cultural shifts into the current world state.</span>
                                 </div>
                              </label>
                           </div>
                        </div>
                     </div>

                     {/* Psychological Profiling Engine */}
                     <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-3">
                        <h3 className="text-[11px] font-bold text-blue-400 mb-2 uppercase flex items-center gap-1.5"><BrainCircuit size={12}/> NPC Cognitive & Psychological Profiling</h3>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3">
                           <div>
                              <label className="text-[9px] text-[#8b949e] font-bold block mb-1">OCEAN Trait Variance Spread</label>
                              <select className="w-full bg-[#1a1a24] border border-[#2a2b3d] rounded p-1.5 text-xs text-white outline-none focus:border-blue-400">
                                 <option>Extreme Bimodal (Highly Eccentric Cast)</option>
                                 <option>Normal Distribution (Real-world Average)</option>
                                 <option>Neurotic Dominant (Horror/Suspense Theme)</option>
                                 <option>Uniform Conformity (Dystopian Theme)</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-[9px] text-[#8b949e] font-bold block mb-1">Memory Decay & Retention System</label>
                              <select className="w-full bg-[#1a1a24] border border-[#2a2b3d] rounded p-1.5 text-xs text-white outline-none focus:border-blue-400">
                                 <option>Hyperthymesia (Perfect Photographic Recall)</option>
                                 <option>Emotional Anchoring (Remember Traumas/Joys)</option>
                                 <option>Strict Recency Bias (Forget past 30 days)</option>
                              </select>
                           </div>
                        </div>

                        <div className="flex flex-col gap-1.5 border-t border-[#2a2b3d] pt-2">
                            <label className="flex items-start gap-2 cursor-pointer group">
                               <input type="checkbox" defaultChecked className="accent-blue-400 w-3 h-3 mt-0.5 shrink-0" />
                               <div className="flex flex-col">
                                  <span className="text-[9.5px] font-bold text-gray-300 group-hover:text-white transition">Dynamic Morality Alignment Drifts (Non-Static Good/Evil)</span>
                                  <span className="text-[8px] text-[#8b949e]">NPCs shift their moral compass based on player actions, economic hardship, and simulated trauma events over time.</span>
                               </div>
                            </label>
                            <label className="flex items-start gap-2 cursor-pointer group">
                               <input type="checkbox" defaultChecked className="accent-blue-400 w-3 h-3 mt-0.5 shrink-0" />
                               <div className="flex flex-col">
                                  <span className="text-[9.5px] font-bold text-gray-300 group-hover:text-white transition">NLG Dialogue Output: Dialects, Slang & Speech Impediments</span>
                                  <span className="text-[8px] text-[#8b949e]">Applies phonetic text-generation layers for regional accents, class-based vocabularies, and stress-induced stuttering.</span>
                               </div>
                            </label>
                        </div>
                     </div>

                     {/* Automated Cinematics Engine */}
                     <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-3 relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                            <Camera size={64} className="text-[#bc8cff]" />
                        </div>
                        <h3 className="text-[11px] font-bold text-[#e3b341] mb-2 uppercase flex items-center gap-1.5"><Video size={12}/> Auto-Cinematic Director Logic</h3>
                        
                        <div className="space-y-3">
                            <div>
                               <label className="text-[9px] text-[#8b949e] font-bold block mb-1">Camera Staging Heuristics (Rule of Thirds & Golden Ratio)</label>
                               <select className="w-full bg-[#1a1a24] border border-[#2a2b3d] rounded p-1.5 text-xs text-white outline-none focus:border-[#e3b341]">
                                  <option>Kurosawa (High Contrast, Deep Focus, Wind/Motion)</option>
                                  <option>Spielberg (Oner/Long-take, Tracking, Face Focus)</option>
                                  <option>Tarantino (Low Angle, Trunk Shots, Crash Zooms)</option>
                                  <option>Naturalistic Documentary (Shoulder-Rig, Handheld Shaky-cam)</option>
                                  <option>Algorithmic Pure Phi (Mathematically Centered)</option>
                               </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3 border-t border-[#2a2b3d] pt-2">
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center text-[9px] mb-1">
                                        <span className="text-gray-400">Pacing & Edit Speed</span>
                                        <span className="flex items-center gap-1 text-white"><Clock size={10} className="text-[#8b949e]"/> Dynamic</span>
                                    </div>
                                    <input type="range" min="0" max="100" defaultValue="40" className="w-full accent-[#e3b341] h-1.5 bg-[#1a1a24] rounded appearance-none mt-1" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center text-[9px] mb-1">
                                        <span className="text-gray-400">Shot Variation Index</span>
                                        <span className="text-white font-mono">85% Coverage</span>
                                    </div>
                                    <input type="range" min="10" max="100" defaultValue="85" className="w-full accent-[#e3b341] h-1.5 bg-[#1a1a24] rounded appearance-none mt-1" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 border-t border-[#2a2b3d] pt-2">
                                <div>
                                   <label className="text-[9px] text-[#8b949e] font-bold block mb-1">Sentiment to Lighting Curve</label>
                                   <select className="w-full bg-[#1a1a24] border border-[#2a2b3d] rounded p-1.5 text-xs text-white outline-none focus:border-[#e3b341]">
                                      <option>High Contrast Chiaroscuro (Tension)</option>
                                      <option>Soft Volumetric Diffuse (Romance/Calm)</option>
                                      <option>Harsh Overhead / Practical (Gritty Realism)</option>
                                      <option>Neon Split-Tone (Cyberpunk/Sci-Fi)</option>
                                   </select>
                                </div>
                                <div>
                                   <label className="text-[9px] text-[#8b949e] font-bold block mb-1">Lens Selection Algorithm</label>
                                   <select className="w-full bg-[#1a1a24] border border-[#2a2b3d] rounded p-1.5 text-xs text-white outline-none focus:border-[#e3b341]">
                                      <option>Context-Aware (Wide for Estab, Macro for Intimate)</option>
                                      <option>Fixed 35mm Prime (Auteur Continuity)</option>
                                      <option>Aggressive Telephoto (Claustrophobic Isolation)</option>
                                      <option>Ultra-Wide Distort (Surrealism/Madness)</option>
                                   </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 mt-1 border-t border-[#2a2b3d] pt-2">
                                <label className="flex items-start gap-2 cursor-pointer group">
                                   <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3 h-3 mt-0.5 shrink-0" />
                                   <div className="flex flex-col">
                                      <span className="text-[9.5px] font-bold text-gray-300 group-hover:text-white transition">Auto-Calculate Actor Blocking (NavMesh Pathing)</span>
                                      <span className="text-[8px] text-[#8b949e]">Characters will physically trace logical movement paths, pace around rooms, and interact with props during dialogue based on their emotional agitation level.</span>
                                   </div>
                                </label>
                                <label className="flex items-start gap-2 cursor-pointer group">
                                   <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3 h-3 mt-0.5 shrink-0" />
                                   <div className="flex flex-col">
                                      <span className="text-[9.5px] font-bold text-gray-300 group-hover:text-white transition">Procedural Micro-Expressions & Body Language Generation</span>
                                      <span className="text-[8px] text-[#8b949e]">Generate facial morph-targets and skeletal IK adjustments (fidgeting, eye darts, crossed arms) based on dialogue sentiment analysis and deception detection.</span>
                                   </div>
                                </label>
                                <label className="flex items-start gap-2 cursor-pointer group">
                                   <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3 h-3 mt-0.5 shrink-0" />
                                   <div className="flex flex-col">
                                      <span className="text-[9.5px] font-bold text-gray-300 group-hover:text-white transition">Dynamic Depth of Field Tracking (Auto-Focus Recalculation)</span>
                                      <span className="text-[8px] text-[#8b949e]">Rack focus shifts automatically between speaking actors based on VAD and narrative weight, simulating a physical focus-puller adjusting lens barrels.</span>
                                   </div>
                                </label>
                            </div>
                        </div>
                     </div>

                     {/* Pre-computation triggers */}
                     <div className="flex flex-col gap-2 mt-2">
                         <div className="flex justify-between items-center bg-[#bc8cff]/5 border border-[#bc8cff]/20 rounded p-2 text-[10px]">
                            <span className="text-gray-300">Estimated Total Offline Compute Time:</span>
                            <span className="text-[#bc8cff] font-mono font-bold">14h 22m (Local GPU)</span>
                         </div>
                         <button className="w-full bg-[#bc8cff] hover:bg-[#a371f7] text-[#0a0a0f] font-bold text-xs py-2.5 rounded shadow-[0_0_15px_rgba(188,140,255,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide">
                            <Activity size={14} className="animate-pulse" /> Bake Master Scenario & Cutscenes
                         </button>
                     </div>
                 </div>
              </div>

              {/* End of tab wrapper, now closing out */}
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded mt-1 shadow-lg mt-4">
                 <button id="gen-btn" onClick={() => {
                    const btn = document.getElementById('gen-btn');
                    if (btn) {
                      btn.innerHTML = '<svg class="animate-spin h-4 w-4 text-[#0a0a0f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Compiling Scale Constraints...';
                      setTimeout(() => {
                         btn.innerHTML = '<svg class="animate-spin h-4 w-4 text-[#0a0a0f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Initializing Mesh Data...';
                         setTimeout(() => btn.innerHTML = '✔ Generation Simulated (Offline)', 2000);
                      }, 1500)
                    }
                 }} className="w-full mt-3 bg-[#bc8cff] hover:bg-[#a371f7] text-[#0a0a0f] font-bold text-xs py-2 rounded flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_10px_rgba(188,140,255,0.3)]">
                    <Cloud size={14} className="animate-pulse" /> Initialize Distributed AI Swarm Build
                 </button>
              </div>
            </div>
        )}
        </div>

        {/* Viewport Canvas area */}
        <div className="flex-1 bg-[#161621] relative overflow-hidden flex flex-col">
          <CompositionGuideOverlay activeGuide={activeCompositionGuide} visible={showCompositionGuide} />
          
          {/* Zoom & Snapping Controls HUD */}
          <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
             <div className="bg-[#11111b]/90 backdrop-blur border border-[#2a2b3d] rounded-lg p-1.5 flex flex-col items-center gap-1 shadow-lg">
                <button onClick={() => setZoomLevel(Math.min(15, zoomLevel + 1))} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2b3d] rounded transition" title="Zoom In"><ZoomIn size={16}/></button>
                <div className="text-[10px] font-mono font-bold text-[#58a6ff] w-8 text-center">{zoomLevel}x</div>
                <button onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2b3d] rounded transition" title="Zoom Out"><ZoomOut size={16}/></button>
             </div>
             
             {/* Composition Guide Toggle */}
             <div className="bg-[#11111b]/90 backdrop-blur border border-[#2a2b3d] rounded-lg p-1.5 flex flex-col items-center shadow-lg group relative">
                <button onClick={() => setShowCompositionGuide(!showCompositionGuide)} className={`p-1.5 rounded transition ${showCompositionGuide ? 'text-[#e3b341] bg-[#e3b341]/10' : 'text-gray-400 hover:text-white hover:bg-[#2a2b3d]'}`} title="Toggle Composition Guide">
                  <Scan size={16} />
                </button>
             </div>
             
             {smartSnapping && (
                <div className="bg-[#3fb950]/10 border border-[#3fb950]/30 backdrop-blur rounded-lg px-2 py-1.5 flex flex-col items-center shadow-lg animate-in fade-in slide-in-from-right-4">
                   <span className="text-[8px] font-bold text-[#3fb950] uppercase tracking-wider mb-0.5">Smart Snap</span>
                   <span className="text-xs font-mono font-bold text-white">
                      {zoomLevel >= 10 ? '1 bc' : zoomLevel >= 5 ? '1 cc' : '1 mc'}
                   </span>
                </div>
        )}
          </div>

          {/* Main 2D / 3D Context Background Canvas */}
          <div className="absolute inset-0 z-0 bg-[#0d1117] flex items-center justify-center pointer-events-auto overflow-auto">
             {mainViewMode === '3D' ? (
               <Viewport3D activeTool="MapEdit" activeFile={undefined} />
             ) : (
               <div 
                 className="relative bg-[#161b22] border border-[#30363d] shadow-2xl transition-transform duration-200 cursor-crosshair select-none flex items-center justify-center"
                 style={{
                   width: `${Math.max(600, mapSizeInMc * 15 * zoomLevel)}px`,
                   height: `${Math.max(600, mapSizeInMc * 15 * zoomLevel)}px`,
                   backgroundImage: `
                     radial-gradient(circle at 50% 50%, rgba(88, 166, 255, 0.03) 0%, transparent 80%),
                     linear-gradient(rgba(48, 54, 61, 0.4) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(48, 54, 61, 0.4) 1px, transparent 1px)
                   `,
                   backgroundSize: `100% 100%, ${30 * zoomLevel}px ${30 * zoomLevel}px, ${30 * zoomLevel}px ${30 * zoomLevel}px`
                 }}
                 onMouseMove={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const x = Math.floor(((e.clientX - rect.left) / rect.width) * mapSizeInMc);
                   const y = Math.floor(((e.clientY - rect.top) / rect.height) * mapSizeInMc);
                   setHoveredCoord({ x: Math.max(0, Math.min(mapSizeInMc - 1, x)), y: Math.max(0, Math.min(mapSizeInMc - 1, y)), elevation: Math.floor(Math.sin(x * 0.2 + y * 0.3) * 15 + 10) });
                 }}
                 onMouseLeave={() => setHoveredCoord(null)}
                 onClick={(e) => {
                   if (!hoveredCoord) return;
                   if (activeTab === 'structures' || activeTab === 'entities') {
                     const newMarker = {
                       id: Date.now(),
                       name: selectedToolItem || (activeTab === 'structures' ? 'Citadel Fortress' : 'Hero Spawn'),
                       x: hoveredCoord.x,
                       y: hoveredCoord.y,
                       type: activeTab === 'structures' ? 'structure' : 'entity',
                       color: activeTab === 'structures' ? '#ff7b72' : '#ffa657'
                     };
                     if (typeof setMarkers === 'function') {
                       setMarkers((prev: any[]) => [...(prev || []), newMarker]);
                     }
                   } else if (activeTab === 'terrain' || activeTab === 'biome') {
                     const newStroke = {
                       id: Date.now(),
                       points: [{ x: hoveredCoord.x * 10, y: hoveredCoord.y * 10 }],
                       biome: selectedToolItem || 'emerald_plains',
                       radius: brushSize * 15
                     };
                     if (typeof setBiomeStrokes === 'function') {
                       setBiomeStrokes((prev: any[]) => [...(prev || []), newStroke]);
                     }
                   }
                 }}
               >
                 {/* Render Painted Biome Strokes */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                   {biomeStrokes?.map((stroke: any, idx: number) => (
                     <circle 
                       key={stroke.id || idx}
                       cx={`${(stroke.points?.[0]?.x / (mapSizeInMc * 10)) * 100}%`}
                       cy={`${(stroke.points?.[0]?.y / (mapSizeInMc * 10)) * 100}%`}
                       r={stroke.radius || 30}
                       fill={stroke.biome?.includes('volcano') ? '#ff5252' : stroke.biome?.includes('ice') ? '#80deea' : stroke.biome?.includes('desert') ? '#ffd54f' : '#69f0ae'}
                     />
                   ))}
                 </svg>

                 {/* Render Markers & Structures on Map */}
                 {markers?.map((m: any, idx: number) => (
                   <div 
                     key={m.id || idx}
                     className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-30 pointer-events-auto cursor-pointer"
                     style={{
                       left: `${(m.x / mapSizeInMc) * 100}%`,
                       top: `${(m.y / mapSizeInMc) * 100}%`
                     }}
                   >
                     <div className="w-4 h-4 rounded-full shadow-lg flex items-center justify-center text-[10px] text-white font-bold border border-white/40 transition-transform group-hover:scale-125" style={{ backgroundColor: m.color || '#58a6ff' }}>
                       {m.type === 'structure' ? '🏰' : '⚡'}
                     </div>
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-5 bg-[#0d1117] text-white text-[10px] px-2 py-0.5 rounded border border-gray-700 whitespace-nowrap shadow-xl pointer-events-none z-50 font-mono">
                       {m.name} [{m.x}, {m.y}]
                     </div>
                   </div>
                 ))}

                 {/* Center World Hub Indicator */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                   <div className="w-32 h-32 rounded-full border border-[#58a6ff] flex items-center justify-center">
                     <div className="w-1.5 h-1.5 bg-[#58a6ff] rounded-full"></div>
                   </div>
                 </div>

                 {/* Interactive Cursor Highlight */}
                 {hoveredCoord && (
                   <div 
                     className="absolute pointer-events-none border-2 border-[#58a6ff] bg-[#58a6ff]/20 z-40 transition-all duration-75 rounded-sm"
                     style={{
                       left: `${(hoveredCoord.x / mapSizeInMc) * 100}%`,
                       top: `${(hoveredCoord.y / mapSizeInMc) * 100}%`,
                       width: `${100 / mapSizeInMc}%`,
                       height: `${100 / mapSizeInMc}%`
                     }}
                   />
        )}
               </div>
        )}
          </div>
                
                {/* Visual Base Grid */}
                {showGridOverlay && (() => {
                  let baseSize = 40 * zoomLevel;
                  let activeUnit = '1 mc';
                  let activeUnitColor = '#3fb950';

                  if (smartSnapping) {
                     if (zoomLevel >= 10) {
                        baseSize = 40 * (zoomLevel / 10);
                        activeUnit = '1 bc';
                        activeUnitColor = '#8b949e';
                     } else if (zoomLevel >= 5) {
                        baseSize = 40 * (zoomLevel / 5);
                        activeUnit = '1 cc';
                        activeUnitColor = '#c9d1d9';
                     }
                  }

                  const gridLineExpr = gridStyle === 'dashed' ? `repeating-linear-gradient` : `linear-gradient`;
                  
                  return (
                    <div className="absolute inset-0 pointer-events-none z-10 transition-all duration-300" style={{ 
                       backgroundImage: showChunkBorders ? `
                         ${gridLineExpr}(${gridColor}${Math.floor(gridOpacity * 2.55).toString(16).padStart(2, '0')} 0px, ${gridColor}${Math.floor(gridOpacity * 2.55).toString(16).padStart(2, '0')} ${gridStyle === 'dashed' ? '2px' : '1px'}, transparent ${gridStyle === 'dashed' ? '2px' : '1px'}, transparent ${gridStyle === 'dashed' ? '4px' : '1px'}), 
                         ${gridLineExpr}(90deg, ${gridColor}${Math.floor(gridOpacity * 2.55).toString(16).padStart(2, '0')} 0px, ${gridColor}${Math.floor(gridOpacity * 2.55).toString(16).padStart(2, '0')} ${gridStyle === 'dashed' ? '2px' : '1px'}, transparent ${gridStyle === 'dashed' ? '2px' : '1px'}, transparent ${gridStyle === 'dashed' ? '4px' : '1px'}),
                         linear-gradient(rgba(255, 100, 50, ${gridOpacity/100}) 2px, transparent 2px), 
                         linear-gradient(90deg, rgba(255, 100, 50, ${gridOpacity/100}) 2px, transparent 2px)
                       ` : `
                         ${gridLineExpr}(${gridColor}${Math.floor(gridOpacity * 2.55).toString(16).padStart(2, '0')} 0px, ${gridColor}${Math.floor(gridOpacity * 2.55).toString(16).padStart(2, '0')} ${gridStyle === 'dashed' ? '2px' : '1px'}, transparent ${gridStyle === 'dashed' ? '2px' : '1px'}, transparent ${gridStyle === 'dashed' ? '4px' : '1px'}), 
                         ${gridLineExpr}(90deg, ${gridColor}${Math.floor(gridOpacity * 2.55).toString(16).padStart(2, '0')} 0px, ${gridColor}${Math.floor(gridOpacity * 2.55).toString(16).padStart(2, '0')} ${gridStyle === 'dashed' ? '2px' : '1px'}, transparent ${gridStyle === 'dashed' ? '2px' : '1px'}, transparent ${gridStyle === 'dashed' ? '4px' : '1px'})
                       `, 
                       backgroundSize: showChunkBorders ? `${baseSize}px ${baseSize}px, ${baseSize}px ${baseSize}px, ${baseSize * (gridChunkSize / 8)}px ${baseSize * (gridChunkSize / 8)}px, ${baseSize * (gridChunkSize / 8)}px ${baseSize * (gridChunkSize / 8)}px` : `${baseSize}px ${baseSize}px, ${baseSize}px ${baseSize}px`, 
                       backgroundPosition: '-1px -1px',
                       transform: 'perspective(500px) rotateX(45deg) scale(1.5) translateY(-50px)' 
                    }}>
                       {showNavMeshGrid && (
                          <div className="absolute inset-0 z-20 mix-blend-screen" style={{
                             backgroundImage: `linear-gradient(rgba(188, 140, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(188, 140, 255, 0.15) 1px, transparent 1px)`,
                             backgroundSize: `${baseSize * navMeshResolution}px ${baseSize * navMeshResolution}px`,
                             border: '1px solid rgba(188, 140, 255, 0.15)'
                          }}></div>
        )}
                       <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#1a1b26] z-30"></div>
                       {/* Scale Display */}
                       <div className="absolute bottom-1/4 right-1/4 bg-[#11111b]/80 border backdrop-blur text-[8px] font-bold px-1.5 py-0.5 rounded transform -rotateX-45 z-40 transition-colors" style={{ color: activeUnitColor, borderColor: activeUnitColor }}>{activeUnit}</div>
                    </div>
                  )
                })()}

          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <div className="bg-[#11111b]/80 backdrop-blur border border-[#2a2b3d] px-3 py-1.5 rounded flex items-center gap-2 text-xs font-mono text-gray-300">
               <Scan size={14} className="text-[#3fb950]" />
               Current Level: {mapSizeInMc}x{mapSizeInMc} mc
            </div>
            {activeTab === 'biome' && (
               <div className="bg-[#11111b]/80 backdrop-blur border border-orange-500/50 px-3 py-1.5 rounded flex items-center gap-2 text-xs font-mono text-orange-400">
                  <Brush size={14} />
                  Biome Brush Mode Active
               </div>
        )}
          </div>

          {/* Biome Brush Cursor Mockup (when active) */}
          {activeTab === 'biome' && (
            <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
               <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center
                  ${activeBiomeType === 'TUNDRA' ? 'border-sky-400 bg-sky-400/10' : 
                    activeBiomeType === 'DESERT' ? 'border-yellow-500 bg-yellow-500/10' : 
                    activeBiomeType === 'FOREST' ? 'border-green-500 bg-green-500/10' : 
                    activeBiomeType === 'JUNGLE' ? 'border-emerald-600 bg-emerald-600/10' : 
                    activeBiomeType === 'OCEAN' ? 'border-blue-600 bg-blue-600/10' : 
                    'border-orange-500 bg-orange-500/10'}`} 
                  style={{ transform: 'perspective(1000px) rotateX(60deg)' }}>
                  
                  <div className={`w-2 h-2 rounded-full animate-ping
                       ${activeBiomeType === 'TUNDRA' ? 'bg-sky-400' : 
                         activeBiomeType === 'DESERT' ? 'bg-yellow-500' : 
                         activeBiomeType === 'FOREST' ? 'bg-green-500' : 
                         activeBiomeType === 'JUNGLE' ? 'bg-emerald-600' : 
                         activeBiomeType === 'OCEAN' ? 'bg-blue-600' : 
                         'bg-orange-500'}`}></div>
                         
                  <div className={`absolute top-full mt-2 text-[10px] font-bold drop-shadow-md whitespace-nowrap
                        ${activeBiomeType === 'TUNDRA' ? 'text-sky-400' : 
                          activeBiomeType === 'DESERT' ? 'text-yellow-500' : 
                          activeBiomeType === 'FOREST' ? 'text-green-500' : 
                          activeBiomeType === 'JUNGLE' ? 'text-emerald-500' : 
                          activeBiomeType === 'OCEAN' ? 'text-blue-500' : 
                          'text-orange-400'}`} style={{ transform: 'rotateX(-60deg)' }}>
                     Brush Size: 100 mc (10,000 cc²)
                  </div>
               </div>
            </div>
        )}

          {/* Biome Legend Panel */}
          {(activeTab === 'biome' || activeTab === 'minimap') && (
            <div className="absolute bottom-4 right-4 z-40 bg-[#11111b]/90 backdrop-blur border border-[#2a2b3d] rounded p-3 shadow-lg pointer-events-none">
               <h3 className="text-[10px] font-bold text-[#c9d1d9] mb-2 uppercase tracking-wider flex items-center gap-1"><Layers size={10} /> Biome Legend</h3>
               <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10px] text-[#8b949e]">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-green-500/60 border border-green-500"></div> Forest</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-yellow-500/60 border border-yellow-500"></div> Desert</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-sky-400/60 border border-sky-400"></div> Tundra</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-600/60 border border-emerald-600"></div> Jungle</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-600/60 border border-blue-600"></div> Ocean</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-orange-500/60 border border-orange-500"></div> Default / AI</div>
               </div>
            </div>
        )}

          {/* Mini Map Editor Interface Overlay (when active) */}
          {activeTab === 'minimap' && (
            <div className="absolute inset-4 top-16 z-30 pointer-events-none flex items-center justify-center">
               <div className="w-[600px] h-[500px] bg-[#0a0a0f]/90 backdrop-blur-xl border-2 border-[#58a6ff]/50 rounded-xl shadow-[0_0_50px_rgba(88,166,255,0.1)] pointer-events-auto flex flex-col overflow-hidden relative">
                 <div className="h-8 border-b border-[#2a2b3d] flex items-center justify-between px-3 bg-[#11111b]">
                    <div className="text-xs font-bold text-[#c9d1d9] flex items-center gap-2"><Compass size={14} className="text-[#58a6ff]" /> Live Mini Map Editor</div>
                    <div className="text-[10px] bg-[#58a6ff]/20 text-[#58a6ff] px-2 py-0.5 rounded">Style: {miniMapStyle}</div>
                 </div>
                 
                 <div 
                   className={`flex-1 relative overflow-hidden ${miniMapStyle === 'fantasy' ? 'bg-[#2a2118]' : miniMapStyle === 'modern' ? 'bg-[#0f111a]' : miniMapStyle === 'sci-fi' ? 'bg-[#001122]' : 'bg-[#111]'}`}
                   onMouseMove={handleViewportMouseMove}
                   onMouseUp={handleViewportMouseUp}
                   onMouseLeave={handleViewportMouseUp}
                 >
                    {/* Dynamic Mini Map Canvas */}
                    <div 
                      className="absolute inset-0 z-0 cursor-crosshair" 
                      onMouseMove={handleMiniMapPaint} 
                      onMouseDown={startMiniMapPaint}
                      onMouseUp={stopMiniMapPaint}
                      onMouseLeave={stopMiniMapPaint}
                    >
                       <MiniMapCanvas styleType={miniMapStyle} biomeStrokes={biomeStrokes} width={600} height={500} mapLayers={mapLayers} markers={markers} />
                    </div>
                    
                    {/* Fog of War / Exploration Preview */}
                    <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none">
                       <div className="absolute top-[100px] left-[200px] w-[300px] h-[300px] bg-red-500 rounded-full blur-3xl opacity-50 mix-blend-destination"></div>
                       <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500 rounded-full blur-3xl opacity-20 mix-blend-destination"></div>
                    </div>

                    {/* Draggable Markers Container */}
                    {mapLayers.find(l => l.name === 'Entities & POIs')?.visible && markers.filter(m => visibleLayers[m.type]).map(m => (
                      <div 
                        key={m.id} 
                        onClick={(e) => { e.stopPropagation(); setSelectedMarkerId(m.id); }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setSelectedMarkerId(m.id);
                          setDraggingMarkerId(m.id);
                        }}
                        className={`absolute flex flex-col items-center cursor-move transition-transform ${selectedMarkerId === m.id ? 'scale-125 z-50' : 'hover:scale-110 z-10'} ${draggingMarkerId === m.id ? 'opacity-80 scale-110' : ''}`} 
                        style={{ left: m.x, top: m.y, transform: 'translate(-50%, -50%)' }}
                      >
                         <div className={`w-8 h-8 rounded-full border-2 border-[#0a0a0f] shadow-lg flex items-center justify-center text-white
                           ${m.type === 'town' ? 'bg-[#3fb950]' : m.type === 'dungeon' ? 'bg-[#f85149]' : m.type === 'shop' ? 'bg-[#e3b341]' : m.type === 'npc' ? 'bg-purple-500' : m.type === 'text' ? 'bg-transparent border-transparent' : 'bg-[#58a6ff]'}`}>
                           {m.type === 'town' ? <MapPin size={14}/> : m.type === 'dungeon' ? <Target size={14}/> : m.type === 'shop' ? <Map size={14}/> : m.type === 'quest' ? <Search size={14}/> : m.type === 'npc' ? <User size={14}/> : null}
                         </div>
                         <div className={`mt-1 bg-[#11111b]/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white border whitespace-nowrap ${selectedMarkerId === m.id ? 'border-purple-500 text-purple-200' : 'border-[#2a2b3d]'}`}>
                            {m.label}
                         </div>
                      </div>
                    ))}

                    <div className="absolute bottom-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
                      {mapLayers.find(l => l.name === 'Dynamic Path Analysis')?.visible && (
                         <div className="bg-[#11111b]/90 backdrop-blur border border-[#2a2b3d] rounded p-2 text-[10px] text-gray-300 flex flex-col gap-1.5 shadow-lg mb-1">
                            <div className="font-bold text-white mb-0.5 border-b border-[#2a2b3d] pb-1">Path Analysis Legend</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-0 border-t-2 border-purple-400 border-dashed"></div> AI Predicted Nav Route</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500/40 border border-red-500/50"></div> Invalid / Unpathable</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500/30 border border-yellow-500/50"></div> Narrow Bottleneck</div>
                         </div>
        )}
                      
                      <div className="text-[10px] text-[#8b949e] font-mono">
                        (Drag capability is conceptual in this mockup. Adjust coordinates via AI or Editor Properties.)
                      </div>
                    </div>
                 </div>

                 {/* NPC / Entity Configuration Panel Overlay */}
                 {selectedMarkerId && markers.find(m => m.id === selectedMarkerId)?.type === 'npc' && (
                    <div className="absolute right-0 top-8 bottom-0 w-80 bg-[#11111b]/95 backdrop-blur-xl border-l border-[#58a6ff]/30 z-50 flex flex-col pointer-events-auto transform transition-transform shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                       <div className="p-3 border-b border-[#2a2b3d] flex items-center justify-between">
                          <h3 className="text-xs font-bold text-white flex items-center gap-2"><Settings size={14} className="text-purple-400" /> NPC Config</h3>
                          <button onClick={() => setSelectedMarkerId(null)} className="text-gray-400 hover:text-white"><X size={14} /></button>
                       </div>
                       
                       <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1 pb-10">
                          {(() => {
                             const marker = markers.find(m => m.id === selectedMarkerId);
                             if (!marker) return null;
                             return (
                               <>
                                 <div>
                                   <label className="text-[10px] font-bold text-[#8b949e] uppercase mb-1 block">Entity Name</label>
                                   <input type="text" value={marker.label} onChange={e => setMarkers(markers.map(m => m.id === selectedMarkerId ? {...m, label: e.target.value} : m))} className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-xs text-white" />
                                 </div>
                                 
                                 <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[10px] font-bold text-[#8b949e] uppercase mb-1 block">Role</label>
                                      <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-[10px] text-white" value={marker.config?.role || 'civilian'} onChange={e => setMarkers(markers.map(m => m.id === selectedMarkerId ? {...m, config: {...m.config, role: e.target.value}} : m))}>
                                         <option value="civilian">Civilian</option>
                                         <option value="merchant">Merchant</option>
                                         <option value="guard">City Guard</option>
                                         <option value="hostile">Hostile Mob</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-[#8b949e] uppercase mb-1 block">Faction</label>
                                      <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-[10px] text-white" value={marker.config?.faction || 'neutral'} onChange={e => setMarkers(markers.map(m => m.id === selectedMarkerId ? {...m, config: {...m.config, faction: e.target.value}} : m))}>
                                         <option value="friendly">Friendly</option>
                                         <option value="neutral">Neutral</option>
                                         <option value="enemy">Enemy</option>
                                      </select>
                                    </div>
                                 </div>

                                 <div>
                                   <label className="text-[10px] font-bold text-[#8b949e] uppercase mb-1 block">Behavior Schedule</label>
                                   <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-xs text-white" value={marker.config?.schedule || 'ai_auto'} onChange={e => setMarkers(markers.map(m => m.id === selectedMarkerId ? {...m, config: {...m.config, schedule: e.target.value}} : m))}>
                                      <option value="ai_auto">🤖 AI Autonomous Routine</option>
                                      <option value="patrol">🛡️ Static Patrol Path</option>
                                      <option value="vendor">🪙 Fixed Vendor Location</option>
                                      <option value="wander">🚶 Random Wander (radius)</option>
                                      <option value="custom_timeline">🗓️ Custom Daily Timeline</option>
                                   </select>
                                 </div>

                                 {marker.config?.schedule === 'custom_timeline' && (
                                    <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded">
                                       <h4 className="text-[10px] font-bold text-gray-300 mb-2 flex items-center gap-1"><CalendarDays size={12}/> 24h Schedule Timeline</h4>
                                       <p className="text-[9px] text-[#8b949e] mb-3 leading-tight">Drag and drop routines into the daily cycle. NPCs will pathfind between activities.</p>
                                       
                                       <div className="flex flex-col gap-2 relative border-l-2 border-purple-500/50 pl-3 ml-2 mt-2">
                                           {[
                                              { time: '06:00', label: 'Morning' }, 
                                              { time: '10:00', label: 'Midday' }, 
                                              { time: '14:00', label: 'Afternoon' }, 
                                              { time: '18:00', label: 'Evening' }, 
                                              { time: '22:00', label: 'Night' }, 
                                              { time: '02:00', label: 'Late Night' }
                                           ].map((slot, idx) => {
                                              const currentRoutines: Record<number, string> = marker.config?.timeline || {
                                                 0: 'work', 1: 'work', 2: 'wander', 3: 'idle', 4: 'sleep', 5: 'sleep'
                                              };
                                              const currentRoutine = currentRoutines[idx] || 'idle';
                                              const RoutineIcon = currentRoutine === 'sleep' ? BedDouble : currentRoutine === 'work' ? Hammer : currentRoutine === 'idle' ? Coffee : currentRoutine === 'patrol' ? Target : Clock;
                                              
                                              return (
                                                <div key={idx} className="flex flex-col group relative">
                                                   <div className="absolute -left-[17px] top-[14px] w-2 h-2 rounded-full bg-purple-500 ring-2 ring-[#1e1e2d]"></div>
                                                   <span className="text-[9px] font-mono text-purple-400 leading-none mb-1 absolute -left-2 top-[3px] -translate-x-[100%]">{slot.time}</span>
                                                   <div className="flex items-center bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 cursor-grab active:cursor-grabbing hover:border-purple-500/50 transition-colors">
                                                      <GripVertical size={12} className="text-gray-600 mr-2 flex-shrink-0" />
                                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                                         <div className={`p-1 rounded ${currentRoutine === 'sleep' ? 'bg-blue-500/20 text-blue-400' : currentRoutine === 'work' ? 'bg-orange-500/20 text-orange-400' : currentRoutine === 'patrol' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-400'}`}>
                                                            <RoutineIcon size={12} />
                                                         </div>
                                                         <div className="flex flex-col flex-1">
                                                            <select 
                                                               className="bg-transparent border-none text-[10px] font-bold text-white w-full outline-none pr-4"
                                                               value={currentRoutine}
                                                               onChange={(e) => {
                                                                 const newTimeline = { ...(currentRoutines) };
                                                                 newTimeline[idx] = e.target.value;
                                                                 setMarkers(markers.map(m => m.id === selectedMarkerId ? {...m, config: {...m.config, timeline: newTimeline}} : m));
                                                               }}
                                                            >
                                                                <option value="sleep">Sleep at Bed</option>
                                                                <option value="work">Work at Station</option>
                                                                <option value="wander">Wander Town</option>
                                                                <option value="patrol">Guard / Patrol</option>
                                                                <option value="idle">Idle / Break</option>
                                                            </select>
                                                            <span className="text-[8px] text-gray-500 leading-none mt-0.5">{slot.label} Cycle</span>
                                                         </div>
                                                      </div>
                                                   </div>
                                                </div>
                                              )
                                           })}
                                       </div>
                                    </div>
        )}

                                 <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded">
                                   <h4 className="text-[10px] font-bold text-gray-300 mb-2 flex items-center gap-1"><Compass size={12}/> Navigation & AI Params</h4>
                                   <label className="flex items-center gap-2 mb-2 cursor-pointer group">
                                      <input type="checkbox" checked={marker.config?.returnAtNight ?? true} onChange={e => setMarkers(markers.map(m => m.id === selectedMarkerId ? {...m, config: {...m.config, returnAtNight: e.target.checked}} : m))} className="accent-purple-500 w-3 h-3" />
                                      <span className="text-[10px] text-gray-400 group-hover:text-white transition">Return to bed at night (20:00)</span>
                                   </label>
                                   <label className="flex items-center gap-2 mb-2 cursor-pointer group">
                                      <input type="checkbox" checked={marker.config?.fleeIfAttacked ?? true} onChange={e => setMarkers(markers.map(m => m.id === selectedMarkerId ? {...m, config: {...m.config, fleeIfAttacked: e.target.checked}} : m))} className="accent-purple-500 w-3 h-3" />
                                      <span className="text-[10px] text-gray-400 group-hover:text-white transition">Flee if attacked (HP &lt; 20%)</span>
                                   </label>
                                   <label className="flex items-center gap-2 cursor-pointer group">
                                      <input type="checkbox" checked={marker.config?.aiOfflineSim ?? true} onChange={e => setMarkers(markers.map(m => m.id === selectedMarkerId ? {...m, config: {...m.config, aiOfflineSim: e.target.checked}} : m))} className="accent-purple-500 w-3 h-3" />
                                      <span className="text-[10px] text-gray-400 group-hover:text-white transition">AI Offline Simulation (Auto-calc)</span>
                                   </label>
                                 </div>

                                 <div>
                                   <label className="text-[10px] font-bold text-[#8b949e] uppercase mb-1 block">Home / Linked Bed</label>
                                   <select className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-xs text-white" value={marker.config?.homeId || 'none'} onChange={e => setMarkers(markers.map(m => m.id === selectedMarkerId ? {...m, config: {...m.config, homeId: e.target.value}} : m))}>
                                      <option value="none">None (Homeless)</option>
                                      <option value="1">Eldoria Capital - House 4</option>
                                      <option value="2">Merchant Guild - Suite B</option>
                                   </select>
                                   <p className="text-[9px] text-gray-500 mt-1 leading-tight">The NPC will automatically pathfind via navmesh to this bed at their scheduled sleep time.</p>
                                 </div>
                                 
                                 <div className="border-t border-[#2a2b3d] pt-3 mt-1">
                                    <h4 className="text-[10px] font-bold text-[#8b949e] uppercase mb-2">Base Stats</h4>
                                    <div className="grid grid-cols-2 gap-3 mb-2">
                                       <div>
                                          <div className="flex justify-between text-[9px] text-gray-400 mb-1"><span>Max HP</span><span>{marker.config?.hp || 100}</span></div>
                                          <input type="range" min="10" max="1000" step="10" value={marker.config?.hp || 100} onChange={e => setMarkers(markers.map(m => m.id === selectedMarkerId ? {...m, config: {...m.config, hp: parseInt(e.target.value)}} : m))} className="w-full accent-green-500 h-1 bg-[#0a0a0f] rounded appearance-none cursor-pointer" />
                                       </div>
                                       <div>
                                          <div className="flex justify-between text-[9px] text-gray-400 mb-1"><span>Move Speed</span><span>{marker.config?.speed || 2.5}</span></div>
                                          <input type="range" min="0.5" max="8.0" step="0.1" value={marker.config?.speed || 2.5} onChange={e => setMarkers(markers.map(m => m.id === selectedMarkerId ? {...m, config: {...m.config, speed: parseFloat(e.target.value)}} : m))} className="w-full accent-blue-500 h-1 bg-[#0a0a0f] rounded appearance-none cursor-pointer" />
                                       </div>
                                    </div>
                                 </div>
                                 
                                 <div>
                                    <label className="text-[10px] font-bold text-[#8b949e] uppercase mb-1 block">Default Greeting (Dialog)</label>
                                    <textarea 
                                      className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded p-1.5 text-xs text-white max-h-20 min-h-[40px]" 
                                      placeholder="Hello there traveler..."
                                      value={marker.config?.greeting || ''}
                                      onChange={e => setMarkers(markers.map(m => m.id === selectedMarkerId ? {...m, config: {...m.config, greeting: e.target.value}} : m))}
                                    />
                                 </div>
                               </>
                             );
                          })()}
                       </div>
                    </div>
        )}
               </div>
            </div>
        )}

          {/* StoryGraph Node Editor Canvas Overlay */}
          {activeTab === 'storygraph' && (
            <div className="absolute inset-x-0 inset-y-0 z-30 pointer-events-auto bg-[#0f111a] flex">
                <div className="flex-1 relative overflow-hidden" 
                     style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, #2a2b3d 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                        backgroundPosition: '-20px -20px'
                     }}>
                    
                    {/* SVG Connections Canvas */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#8b949e" />
                            </marker>
                            <marker id="arrowhead-true" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#3fb950" />
                            </marker>
                            <marker id="arrowhead-false" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#f85149" />
                            </marker>
                        </defs>
                        <path d="M 180 180 C 250 180, 250 150, 320 150" stroke="#8b949e" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                        <path d="M 180 200 C 250 200, 250 270, 320 270" stroke="#8b949e" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                        
                        <path d="M 470 140 C 530 140, 530 100, 590 100" stroke="#3fb950" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-true)" />
                        <path d="M 470 160 C 530 160, 530 200, 590 200" stroke="#f85149" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-false)" />
                        
                        <path d="M 470 270 C 530 270, 600 270, 650 270" stroke="#8b949e" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                    </svg>

                    {/* Node 1: Entry / Root */}
                    <div className="absolute top-[140px] left-[40px] w-[140px] bg-[#1e1e2d] border border-[#ff6e9a]/50 rounded-md shadow-xl flex flex-col pointer-events-auto">
                        <div className="bg-[#ff6e9a]/10 border-b border-[#ff6e9a]/30 p-1.5 flex items-center justify-between rounded-t-md">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1"><MessageSquare size={10} className="text-[#ff6e9a]" /> Root_Greeting</span>
                        </div>
                        <div className="p-2 flex flex-col gap-1.5">
                            <textarea className="text-[9px] bg-[#0a0a0f] text-gray-300 w-full resize-none outline-none border border-[#2a2b3d] rounded p-1 leading-tight" defaultValue="Halt! Who goes there? State your business or face the consequences!"></textarea>
                            <label className="text-[8px] text-gray-500 uppercase font-bold mt-1">Speaker Entity ID</label>
                            <input className="text-[9px] bg-[#0a0a0f] text-white w-full outline-none border border-[#2a2b3d] rounded p-1" defaultValue="NPC_GUARD_01" />
                        </div>
                        <div className="border-t border-[#2a2b3d] bg-[#1a1a24] rounded-b-md p-1.5 flex flex-col gap-1">
                            <div className="flex justify-between items-center bg-[#2a2b3d]/50 rounded px-1 group cursor-pointer hover:bg-[#3b3d54]">
                                <span className="text-[8px] text-gray-300">Choice: "I am a friend."</span>
                                <div className="w-2 h-2 rounded-full bg-gray-500 border border-[#0a0a0f] group-hover:bg-[#ff6e9a]"></div>
                            </div>
                            <div className="flex justify-between items-center bg-[#2a2b3d]/50 rounded px-1 group cursor-pointer hover:bg-[#3b3d54]">
                                <span className="text-[8px] text-gray-300">Choice: [Attack]</span>
                                <div className="w-2 h-2 rounded-full bg-gray-500 border border-[#0a0a0f] group-hover:bg-[#ff6e9a]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Node 2: State Condition Check */}
                    <div className="absolute top-[110px] left-[320px] w-[150px] bg-[#1e1e2d] border border-[#3fb950]/50 rounded-md shadow-xl flex flex-col pointer-events-auto">
                        <div className="bg-[#3fb950]/10 border-b border-[#3fb950]/30 p-1.5 flex items-center justify-between rounded-t-md">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1"><Target size={10} className="text-[#3fb950]" /> State Check</span>
                        </div>
                        <div className="p-2 flex flex-col gap-1.5">
                            <label className="text-[8px] text-gray-500 uppercase font-bold">Condition Rule (JS/Lua)</label>
                            <input className="text-[9px] bg-[#0a0a0f] text-white w-full outline-none border border-[#2a2b3d] rounded p-1 font-mono text-[#58a6ff]" defaultValue="PLAYER_KARMA > 50" />
                        </div>
                        <div className="border-t border-[#2a2b3d] bg-[#1a1a24] rounded-b-md p-1.5 flex flex-col gap-1">
                            <div className="flex justify-between items-center bg-[#2a2b3d]/50 rounded px-1 group cursor-pointer hover:bg-[#3b3d54]">
                                <span className="text-[8px] text-[#3fb950] font-bold">On True</span>
                                <div className="w-2 h-2 rounded-full bg-[#3fb950] border border-[#0a0a0f]"></div>
                            </div>
                            <div className="flex justify-between items-center bg-[#2a2b3d]/50 rounded px-1 group cursor-pointer hover:bg-[#3b3d54]">
                                <span className="text-[8px] text-[#f85149] font-bold">On False</span>
                                <div className="w-2 h-2 rounded-full bg-[#f85149] border border-[#0a0a0f]"></div>
                            </div>
                        </div>
                        {/* Input Port */}
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-500 border-2 border-[#1e1e2d] shadow-sm"></div>
                    </div>

                    {/* Node 3: Generic Dialogue */}
                    <div className="absolute top-[230px] left-[320px] w-[150px] bg-[#1e1e2d] border border-gray-600 rounded-md shadow-xl flex flex-col pointer-events-auto scale-95 origin-top-left opacity-80">
                        <div className="bg-[#2a2b3d] p-1.5 flex items-center justify-between rounded-t-md">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1"><MessageSquare size={10} className="text-gray-400" /> Hostile_Initiate</span>
                        </div>
                        <div className="p-2">
                            <textarea className="text-[9px] bg-[#0a0a0f] text-gray-300 w-full resize-none outline-none border border-[#2a2b3d] rounded p-1 leading-tight h-10" defaultValue="Die, scum!"></textarea>
                        </div>
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-500 border-2 border-[#1e1e2d]"></div>
                        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-500 border-2 border-[#1e1e2d]"></div>
                    </div>

                    {/* Node 4: Dialogue True Branch */}
                    <div className="absolute top-[60px] left-[590px] w-[140px] bg-[#1e1e2d] border border-gray-600 rounded-md shadow-xl flex flex-col pointer-events-auto">
                        <div className="bg-[#2a2b3d] p-1.5 flex items-center justify-between rounded-t-md">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1"><MessageSquare size={10} className="text-gray-400" /> Friendly_Reply</span>
                        </div>
                        <div className="p-2">
                            <textarea className="text-[9px] bg-[#0a0a0f] text-gray-300 w-full resize-none outline-none border border-[#2a2b3d] rounded p-1 leading-tight h-14" defaultValue="Ah, a friend of the order. You may pass, but keep your weapons sheathed."></textarea>
                        </div>
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#3fb950] border-2 border-[#1e1e2d]"></div>
                    </div>

                    {/* Node 5: Dialogue False Branch */}
                    <div className="absolute top-[170px] left-[590px] w-[140px] bg-[#1e1e2d] border border-gray-600 rounded-md shadow-xl flex flex-col pointer-events-auto">
                        <div className="bg-[#2a2b3d] p-1.5 flex items-center justify-between rounded-t-md">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1"><MessageSquare size={10} className="text-gray-400" /> Decline_Suspicious</span>
                        </div>
                        <div className="p-2">
                            <textarea className="text-[9px] bg-[#0a0a0f] text-gray-300 w-full resize-none outline-none border border-[#2a2b3d] rounded p-1 leading-tight h-14" defaultValue="I don't recognize you. Turn back now or we will open fire."></textarea>
                        </div>
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#f85149] border-2 border-[#1e1e2d]"></div>
                    </div>

                    {/* Node 6: Set Variable Action */}
                    <div className="absolute top-[245px] left-[650px] w-[130px] bg-[#1e1e2d] border border-[#58a6ff]/50 rounded-md shadow-xl flex flex-col pointer-events-auto opacity-70">
                        <div className="bg-[#58a6ff]/10 border-b border-[#58a6ff]/30 p-1.5 flex items-center justify-between rounded-t-md">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1"><Settings size={10} className="text-[#58a6ff]" /> Set State</span>
                        </div>
                        <div className="p-2 flex flex-col gap-1.5">
                            <div className="flex items-center gap-1">
                               <input className="text-[8px] bg-[#0a0a0f] text-[#58a6ff] w-full outline-none border border-[#2a2b3d] rounded p-1 font-mono" defaultValue="faction_rep" />
                               <span className="text-white">=</span>
                               <input className="text-[8px] bg-[#0a0a0f] text-white w-8 outline-none border border-[#2a2b3d] rounded p-1 font-mono text-center" defaultValue="-5" />
                            </div>
                        </div>
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-500 border-2 border-[#1e1e2d]"></div>
                    </div>

                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-[#8b949e] hover:text-white p-2 rounded shadow-lg border border-[#2a2b3d] transition-colors"><Target size={16} /></button>
                        <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-[#8b949e] hover:text-white p-2 rounded shadow-lg border border-[#2a2b3d] transition-colors"><ZoomIn size={16} /></button>
                        <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-[#8b949e] hover:text-white p-2 rounded shadow-lg border border-[#2a2b3d] transition-colors"><ZoomOut size={16} /></button>
                    </div>

                </div>
            </div>
        )}

          {/* Workflow Editor Canvas Overlay */}
          {activeTab === 'workflow' && (
            <div className="absolute inset-x-0 inset-y-0 z-30 pointer-events-auto bg-[#0a0a0f] flex">
                <div className="flex-1 relative overflow-hidden" 
                     style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, #1a1a24 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                        backgroundPosition: '-20px -20px'
                     }}>
                    
                    {/* SVG Connections Canvas for Workflow */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <marker id="arrowhead-wf" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#8b949e" />
                            </marker>
                            <marker id="arrowhead-wf-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#ff944d" />
                            </marker>
                        </defs>
                        <path d="M 160 120 C 230 120, 230 180, 300 180" stroke="#8b949e" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowhead-wf)" />
                        
                        <path d="M 450 180 C 510 180, 510 140, 570 140" stroke="#ff944d" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-wf-active)" />
                        
                        {/* More complex path routing */}
                        <path d="M 450 200 C 510 200, 510 260, 570 260" stroke="#8b949e" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-wf)" />
                        <path d="M 720 140 C 780 140, 780 180, 840 180" stroke="#ff944d" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-wf-active)" />
                        <path d="M 1000 180 C 1050 180, 1050 200, 1100 200" stroke="#ff944d" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-wf-active)" />

                        {/* Executing Pulse Effect on Active Line */}
                        <circle cx="0" cy="0" r="4" fill="#ff944d" className="animate-[movePath_3s_linear_infinite]">
                           <animateMotion path="M 450 180 C 510 180, 510 140, 570 140" dur="1s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="0" cy="0" r="4" fill="#ff944d" className="animate-[movePath_3s_linear_infinite]">
                           <animateMotion path="M 720 140 C 780 140, 780 180, 840 180" dur="1s" repeatCount="indefinite" />
                        </circle>
                    </svg>

                    {/* Trigger Node 1: Game Tick */}
                    <div className="absolute top-[80px] left-[30px] w-[130px] bg-[#1e1e2d] border border-[#ff944d]/50 rounded-md shadow-xl flex flex-col pointer-events-auto">
                        <div className="bg-[#ff944d]/10 border-b border-[#ff944d]/30 p-1.5 flex items-center justify-between rounded-t-md">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1"><Zap size={10} className="text-[#ff944d]" /> Trigger Ticker</span>
                        </div>
                        <div className="p-2 flex flex-col gap-1.5">
                            <label className="text-[8px] text-gray-500 uppercase font-bold mt-1">Execute Every</label>
                            <input className="text-[9px] bg-[#0a0a0f] text-white w-full outline-none border border-[#2a2b3d] rounded p-1 text-center font-mono" defaultValue="60 ticks (1s)" />
                        </div>
                        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-500 border-2 border-[#1e1e2d]"></div>
                    </div>

                    {/* Compute Node 1: Run Script */}
                    <div className="absolute top-[140px] left-[300px] w-[150px] bg-[#1e1e2d] border border-[#ff944d] rounded-md shadow-[0_0_15px_rgba(255,148,77,0.2)] flex flex-col pointer-events-auto ring-1 ring-[#ff944d]">
                        <div className="bg-[#ff944d]/20 border-b border-[#ff944d] p-1.5 flex items-center justify-between rounded-t-md">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1"><Terminal size={10} className="text-[#ff944d]" /> Run JS Script</span>
                            <span className="text-[8px] bg-[#ff944d] text-[#0a0a0f] font-bold px-1 rounded animate-pulse">EXECUTING</span>
                        </div>
                        <div className="p-2 flex flex-col gap-1.5">
                            <textarea className="text-[8px] bg-[#0a0a0f] text-[#58a6ff] w-full resize-none outline-none border border-[#2a2b3d] rounded p-1 font-mono leading-tight h-20" defaultValue="const agents = global.getAgents();&#10;agents.forEach(a => {&#10;  a.hunger -= 0.1;&#10;  if(a.hunger < 20) {&#10;    emit('SEEK_FOOD', a.id);&#10;  }&#10;});&#10;return { success: true };"></textarea>
                        </div>
                        <div className="absolute top-[40px] -left-1.5 w-3 h-3 rounded-full bg-gray-500 border-2 border-[#1e1e2d]"></div>
                        <div className="absolute top-[40px] -right-1.5 w-3 h-3 rounded-full bg-[#ff944d] border-2 border-[#1e1e2d] shadow-[0_0_10px_#ff944d]"></div>
                        <div className="absolute top-[60px] -right-1.5 w-3 h-3 rounded-full bg-gray-500 border-2 border-[#1e1e2d]"></div>
                    </div>

                    {/* Action Node 1: Webhook / Emit */}
                    <div className="absolute top-[100px] left-[570px] w-[150px] bg-[#1e1e2d] border border-[#ff944d]/50 rounded-md shadow-[0_0_15px_rgba(255,148,77,0.2)] flex flex-col pointer-events-auto">
                        <div className="bg-[#ff944d]/10 border-b border-[#ff944d]/30 p-1.5 flex items-center justify-between rounded-t-md">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1"><Webhook size={10} className="text-[#ff944d]" /> Event Emit</span>
                            <span className="text-[8px] bg-[#ff944d] text-[#0a0a0f] font-bold px-1 rounded animate-pulse">EXECUTING</span>
                        </div>
                        <div className="p-2 flex flex-col gap-1.5">
                            <label className="text-[8px] text-gray-500 uppercase font-bold mt-1">Event Name</label>
                            <input className="text-[9px] bg-[#0a0a0f] text-white w-full outline-none border border-[#2a2b3d] rounded p-1 font-mono" defaultValue="EVT_SEEK_FOOD" />
                        </div>
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ff944d] border-2 border-[#1e1e2d]"></div>
                        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ff944d] border-2 border-[#1e1e2d]"></div>
                    </div>
                    
                    {/* Database Update Node */}
                    <div className="absolute top-[220px] left-[570px] w-[150px] bg-[#1e1e2d] border border-gray-600 rounded-md shadow-xl flex flex-col pointer-events-auto opacity-70">
                        <div className="bg-[#2a2b3d] border-b border-[#2a2b3d] p-1.5 flex items-center justify-between rounded-t-md">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1"><Database size={10} className="text-gray-400" /> Log Transaction</span>
                        </div>
                        <div className="p-2 flex flex-col gap-1">
                             <div className="flex justify-between items-center bg-[#0a0a0f] p-1 rounded border border-[#2a2b3d]">
                                 <span className="text-[8px] font-mono text-gray-500">DB.world_state.insert()</span>
                             </div>
                        </div>
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-500 border-2 border-[#1e1e2d]"></div>
                    </div>

                    {/* AI Node: LLM Processing */}
                    <div className="absolute top-[130px] left-[840px] w-[160px] bg-[#1e1e2d] border border-[#ff944d]/50 rounded-md shadow-[0_0_15px_rgba(255,148,77,0.2)] flex flex-col pointer-events-auto">
                        <div className="bg-[#ff944d]/10 border-b border-[#ff944d]/30 p-1.5 flex items-center justify-between rounded-t-md">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1"><BrainCircuit size={10} className="text-[#ff944d]" /> Agent Need Matrix</span>
                            <span className="text-[8px] bg-[#ff944d] text-[#0a0a0f] font-bold px-1 rounded animate-pulse">EXECUTING</span>
                        </div>
                        <div className="p-2 flex flex-col gap-1.5">
                             <label className="text-[8px] text-green-400 uppercase font-bold text-center border border-dashed border-[#ff944d] py-1 rounded bg-[#ff944d]/10 animate-pulse">INFERRING BEHAVIOR...</label>
                        </div>
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ff944d] border-2 border-[#1e1e2d]"></div>
                        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ff944d] border-2 border-[#1e1e2d]"></div>
                    </div>
                    
                    {/* Final Action Node */}
                    <div className="absolute top-[180px] left-[1100px] w-[140px] bg-[#1e1e2d] border border-[#f85149]/50 rounded-md shadow-xl flex flex-col pointer-events-auto">
                         <div className="bg-[#f85149]/10 border-b border-[#f85149]/30 p-1.5 flex items-center justify-between rounded-t-md">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1"><Activity size={10} className="text-[#f85149]" /> Move Action</span>
                        </div>
                        <div className="p-2 flex flex-col gap-1.5">
                            <label className="text-[8px] text-gray-500 uppercase font-bold mt-1">Vector Transformation</label>
                            <input className="text-[9px] bg-[#0a0a0f] text-white w-full outline-none border border-[#2a2b3d] rounded p-1 font-mono" defaultValue="WalkTo(target_x, target_y)" />
                        </div>
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ff944d] border-2 border-[#1e1e2d]"></div>
                    </div>

                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-[#8b949e] hover:text-white p-2 rounded shadow-lg border border-[#2a2b3d] transition-colors"><Target size={16} /></button>
                        <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-[#8b949e] hover:text-white p-2 rounded shadow-lg border border-[#2a2b3d] transition-colors"><ZoomIn size={16} /></button>
                        <button className="bg-[#1e1e2d] hover:bg-[#2a2b3d] text-[#8b949e] hover:text-white p-2 rounded shadow-lg border border-[#2a2b3d] transition-colors"><ZoomOut size={16} /></button>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-[#1e1e2d]/90 backdrop-blur border border-[#2a2b3d] rounded p-2">
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            DAEMON: TICK RATE 60Hz - ALIVE
                        </div>
                    </div>
                </div>
            </div>
        )}

          {/* Massive Feature Overlays */}
          {activeTab === 'assets' && <MapAssetBrowser />}
          {activeTab === 'entities' && <MapEntityEditor />}
          {activeTab === 'models' && <MapModelEditor />}
          {activeTab === 'camera' && <MapCinematicEditor />}
          {activeTab === 'audio' && <MapAudioTools />}

          {/* PCG Overlay */}
          {activeTab === 'physics' && <MapPhysicsEditor />}

          {/* Audio Overlay */}
          {activeTab === 'audio' && (
            <div className="absolute inset-x-0 inset-y-0 z-30 pointer-events-auto bg-[#0f111a] flex">
                <div className="w-[350px] border-r border-[#2a2b3d] bg-[#11111b] p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar shadow-xl z-10 relative">
                     <h2 className="text-sm font-bold text-[#e3b341] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2">
                        <Volume2 size={16} /> Spatial Audio & Foley
                     </h2>
                     <p className="text-[10px] text-gray-400 mb-2">Advanced acoustic propagation, reverb volumes, and adaptive soundscapes.</p>
                     
                     <div className="bg-[#1e1e2d] border border-[#e3b341]/30 p-3 rounded flex flex-col gap-3">
                        <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#e3b341]/30 pb-1 flex justify-between items-center">
                            <span>Acoustic Raytracing</span> <Radio size={12} className="text-[#e3b341]" />
                        </h3>
                        <div>
                            <label className="text-[10px] text-[#8b949e] mb-1 flex justify-between"><span>Bounce Limit</span> <span className="text-white">4 Bounces</span></label>
                            <input type="range" min="1" max="10" defaultValue="4" className="w-full accent-[#e3b341]" />
                        </div>
                        <div className="flex flex-col gap-2 mt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                               <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3 h-3" />
                               <span className="text-[10px] text-gray-400 group-hover:text-white transition">Calculate Material Absorption</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                               <input type="checkbox" defaultChecked className="accent-[#e3b341] w-3 h-3" />
                               <span className="text-[10px] text-gray-400 group-hover:text-white transition">Doppler Effect Simulation</span>
                            </label>
                        </div>
                     </div>

                     <div className="bg-[#1e1e2d] border border-[#a5d6ff]/30 p-3 rounded flex flex-col gap-3">
                        <h3 className="text-[10px] font-bold text-white uppercase border-b border-[#a5d6ff]/30 pb-1 flex justify-between items-center">
                            <span>Adaptive Foley</span> <ActivitySquare size={12} className="text-[#a5d6ff]" />
                        </h3>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-gray-400">Surface Material</label>
                            <select className="bg-[#0a0a0f] border border-[#2a2b3d] text-white text-xs p-1.5 rounded">
                                <option>Auto-Detect (Physics Mat)</option>
                                <option>Gravel / Dirt</option>
                                <option>Wet Concrete</option>
                                <option>Hollow Wood</option>
                            </select>
                        </div>
                        <button className="bg-[#a5d6ff]/10 hover:bg-[#a5d6ff]/20 text-[#a5d6ff] border border-[#a5d6ff]/30 p-2 rounded text-xs font-bold transition-colors mt-2 flex justify-center items-center gap-2">
                            <Play size={14} /> Preview Footsteps
                        </button>
                     </div>
                </div>
                
                {/* Visualizer Canvas Area for Audio */}
                <div className="flex-1 relative flex items-center justify-center p-8">
                     <div className="w-full h-full max-w-4xl max-h-[800px] border border-[#2a2b3d] bg-[#11111b] rounded-xl relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#e3b341 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                          
                          {/* Simulated Sound Waves */}
                          <div className="w-[400px] h-[400px] border border-[#e3b341]/10 rounded-full absolute flex items-center justify-center animate-[ping_4s_ease-out_infinite]"></div>
                          <div className="w-[200px] h-[200px] border border-[#e3b341]/20 rounded-full absolute flex items-center justify-center animate-[ping_4s_ease-out_infinite_delay-1s]"></div>
                          <div className="w-[100px] h-[100px] border border-[#e3b341]/40 rounded-full absolute flex items-center justify-center animate-[ping_4s_ease-out_infinite_delay-2s]"></div>

                          <Volume2 size={48} className="text-[#e3b341] z-10" />
                          <h3 className="text-[#e3b341] font-mono text-xl tracking-widest uppercase mt-6 z-10 bg-[#11111b] px-4 py-1 rounded">Audio Spatializer Viewport</h3>
                          <p className="text-gray-500 font-mono text-sm mt-2 z-10 bg-[#11111b] px-2 py-1 rounded">Mapping acoustic nodes</p>
                          
                          <div className="absolute top-4 left-4 flex gap-2 z-10">
                              <span className="bg-[#0a0a0f] text-[#e3b341] text-[10px] px-2 py-1 rounded border border-[#e3b341]/30 font-mono">HRTF: ENABLED</span>
                              <span className="bg-[#0a0a0f] text-gray-400 text-[10px] px-2 py-1 rounded border border-[#2a2b3d] font-mono">CHANNELS: 7.1.4 ATMOS</span>
                          </div>
                     </div>
                </div>
            </div>
        )}

          {/* Visual Flow Debugger Overlay */}
          {activeTab === 'debugger' && (
            <div className="absolute inset-x-0 inset-y-0 z-30 pointer-events-auto bg-[#0a0a0f] flex">
                <div className="w-[350px] border-r border-[#2a2b3d] bg-[#11111b] flex flex-col shadow-xl z-20 relative">
                     <div className="p-4 border-b border-[#2a2b3d]">
                         <h2 className="text-sm font-bold text-[#f85149] flex items-center gap-2 mb-1">
                            <Activity size={16} className="animate-pulse" /> Visual Flow Debugger
                         </h2>
                         <p className="text-[10px] text-gray-400 leading-tight">Real-time script execution tracing, node inspection, and state variables.</p>
                     </div>
                     
                     <div className="p-3 border-b border-[#2a2b3d] flex items-center gap-2 bg-[#1e1e2d]">
                         <button className="bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50 hover:bg-[#3fb950]/30 p-1.5 rounded flex-1 flex justify-center items-center transition-colors" title="Resume Execution">
                             <Play size={14} />
                         </button>
                         <button className="bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/50 hover:bg-[#f85149]/30 p-1.5 rounded flex-1 flex justify-center items-center transition-colors" title="Pause Execution">
                             <Pause size={14} />
                         </button>
                         <button className="bg-[#2a2b3d] text-white border border-[#3fb950]/50 hover:bg-[#3a3b4d] p-1.5 rounded flex-1 flex justify-center items-center transition-colors" title="Step Over">
                             <FastForward size={14} />
                         </button>
                     </div>
                     
                     <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
                         <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded">
                             <h3 className="text-[10px] font-bold text-[#8b949e] uppercase mb-2">Current Context</h3>
                             <div className="flex flex-col gap-1.5 text-xs font-mono">
                                 <div className="flex justify-between"><span className="text-[#8b949e]">Script ID:</span><span className="text-[#a5d6ff]">AI_PATROL_042</span></div>
                                 <div className="flex justify-between"><span className="text-[#8b949e]">Entity:</span><span className="text-[#d2a8ff]">NPC_Guard_01</span></div>
                                 <div className="flex justify-between"><span className="text-[#8b949e]">State:</span><span className="text-[#ff7b72] animate-pulse">PAUSED (BREAKPOINT)</span></div>
                                 <div className="flex justify-between"><span className="text-[#8b949e]">Tick:</span><span className="text-white">1,489,021</span></div>
                             </div>
                         </div>
                         
                         <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded flex-1">
                             <h3 className="text-[10px] font-bold text-[#8b949e] uppercase mb-2">Call Stack</h3>
                             <div className="flex flex-col gap-1">
                                 <div className="bg-[#f85149]/10 border border-[#f85149]/30 p-1.5 rounded text-[10px] font-mono text-[#f85149]">
                                     CheckLineOfSight() : line 42
                                 </div>
                                 <div className="bg-[#0a0a0f] p-1.5 rounded text-[10px] font-mono text-gray-400">
                                     UpdatePatrolNode() : line 18
                                 </div>
                                 <div className="bg-[#0a0a0f] p-1.5 rounded text-[10px] font-mono text-gray-400">
                                     MainAILoop() : line 105
                                 </div>
                             </div>
                             
                             <h3 className="text-[10px] font-bold text-[#8b949e] uppercase mb-2 mt-4">Local Variables</h3>
                             <div className="flex flex-col gap-1 text-[10px] font-mono">
                                 <div className="flex justify-between p-1 bg-[#0a0a0f] rounded">
                                     <span className="text-[#79c0ff]">player_dist</span>
                                     <span className="text-[#ff7b72]">4.52m</span>
                                 </div>
                                 <div className="flex justify-between p-1 bg-[#0a0a0f] rounded">
                                     <span className="text-[#79c0ff]">alert_level</span>
                                     <span className="text-[#e3b341]">0.85</span>
                                 </div>
                                 <div className="flex justify-between p-1 bg-[#0a0a0f] rounded">
                                     <span className="text-[#79c0ff]">has_weapon</span>
                                     <span className="text-[#3fb950]">true</span>
                                 </div>
                                 <div className="flex justify-between p-1 bg-[#0a0a0f] rounded">
                                     <span className="text-[#79c0ff]">target_vec</span>
                                     <span className="text-[#d2a8ff]">[12.4, 0, -5.2]</span>
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>

                <div className="flex-1 relative overflow-hidden bg-[#0a0a0f]">
                     <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#8b949e 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                     
                     <div className="absolute top-4 right-4 bg-[#1e1e2d]/90 backdrop-blur border border-[#f85149]/50 rounded p-2 z-10 shadow-lg shadow-[#f85149]/10">
                         <div className="flex items-center gap-2 text-[10px] text-[#f85149] font-mono">
                             <Activity size={12} className="animate-pulse" /> DEBUGGER ATTACHED
                         </div>
                     </div>

                     <svg className="absolute inset-0 w-full h-full pointer-events-none">
                         <defs>
                             <marker id="arrow-dbg" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                 <polygon points="0 0, 10 3.5, 0 7" fill="#8b949e" />
                             </marker>
                             <marker id="arrow-dbg-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                 <polygon points="0 0, 10 3.5, 0 7" fill="#f85149" />
                             </marker>
                         </defs>
                         <path d="M 150 200 C 250 200, 250 100, 350 100" stroke="#8b949e" strokeWidth="2" fill="none" markerEnd="url(#arrow-dbg)" />
                         <path d="M 150 200 C 250 200, 250 300, 350 300" stroke="#f85149" strokeWidth="3" fill="none" markerEnd="url(#arrow-dbg-active)" />
                         <path d="M 500 300 C 600 300, 600 200, 700 200" stroke="#8b949e" strokeWidth="2" strokeDasharray="4,4" fill="none" markerEnd="url(#arrow-dbg)" />
                     </svg>

                     {/* Start Node */}
                     <div className="absolute top-[170px] left-[50px] w-[100px] bg-[#1e1e2d] border border-[#2a2b3d] rounded-md shadow-lg flex flex-col pointer-events-auto">
                          <div className="bg-[#1a1a24] p-2 flex items-center justify-center rounded-t-md border-b border-[#2a2b3d]">
                              <span className="text-[10px] font-bold text-gray-400">Initialize</span>
                          </div>
                          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#8b949e] border-2 border-[#1e1e2d]"></div>
                     </div>

                     {/* Branch Node */}
                     <div className="absolute top-[260px] left-[350px] w-[150px] bg-[#1e1e2d] border-2 border-[#f85149] rounded-md shadow-xl shadow-[#f85149]/20 flex flex-col pointer-events-auto">
                          <div className="bg-[#f85149]/20 p-2 flex items-center justify-between rounded-t-md border-b border-[#f85149]/50">
                              <span className="text-[10px] font-bold text-white flex items-center gap-1"><Scan size={10} className="text-[#f85149]"/> Evaluate Sight</span>
                              <span className="w-2 h-2 bg-[#f85149] rounded-full animate-ping"></span>
                          </div>
                          <div className="p-2 bg-[#1e1e2d] text-[9px] font-mono text-gray-300 rounded-b-md">
                              <div>if (distance &lt; 5m)</div>
                              <div className="text-[#ff7b72] bg-[#f85149]/10 px-1 rounded inline-block mt-1">=&gt; TRUE</div>
                          </div>
                          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#f85149] border-2 border-[#1e1e2d]"></div>
                          <div className="absolute top-[20%] -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#8b949e] border-2 border-[#1e1e2d]"></div>
                          <div className="absolute top-[80%] -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ff7b72] border-2 border-[#1e1e2d] shadow-[0_0_8px_#ff7b72]"></div>
                     </div>

                     {/* Idle Node */}
                     <div className="absolute top-[60px] left-[350px] w-[120px] bg-[#1e1e2d] border border-[#2a2b3d] rounded-md shadow-lg flex flex-col pointer-events-auto opacity-50">
                          <div className="bg-[#1a1a24] p-2 flex items-center justify-center rounded-t-md border-b border-[#2a2b3d]">
                              <span className="text-[10px] font-bold text-gray-400">Idle Behavior</span>
                          </div>
                          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#8b949e] border-2 border-[#1e1e2d]"></div>
                     </div>
                     
                     {/* Attack Node */}
                     <div className="absolute top-[170px] left-[700px] w-[140px] bg-[#1e1e2d] border border-[#2a2b3d] rounded-md shadow-lg flex flex-col pointer-events-auto">
                          <div className="bg-[#1a1a24] p-2 flex items-center justify-center rounded-t-md border-b border-[#2a2b3d]">
                              <span className="text-[10px] font-bold text-gray-400">Trigger Combat</span>
                          </div>
                          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#8b949e] border-2 border-[#1e1e2d]"></div>
                     </div>

                     <div className="absolute bottom-4 left-4 bg-[#11111b] border border-[#2a2b3d] rounded-lg p-2 text-[10px] font-mono text-gray-400 shadow-xl max-w-lg">
                          <div className="text-[#f85149] mb-1 font-bold">Log Output:</div>
                          <div>[10:42:01] System: Spawned NPC_Guard_01 at [0, 10, 0]</div>
                          <div>[10:42:05] AI: Navigating to waypoint Alpha</div>
                          <div className="text-[#e3b341]">[10:42:12] Sensor: Player entered detection radius (4.52m)</div>
                          <div className="text-[#f85149]">[10:42:12] DEBUG: Breakpoint hit in CheckLineOfSight()</div>
                     </div>
                </div>
            </div>
        )}

          {/* Task Status Board Canvas Overlay */}
          {activeTab === 'tasks' && (
            <div className="absolute inset-x-0 inset-y-0 z-30 pointer-events-auto bg-[#0f111a] flex">
                <TaskStatusBoard />
            </div>
        )}
        </div>
          </>
        )}
      </div>
    </div>
  )
}
