import React, { useState, useRef, useEffect } from 'react';
import { Map, Grid3X3, Layers, Settings, ZoomIn, ZoomOut, Save, Plus, Target, Compass, Cloud, MapPin, Search, Edit3, Type, X, BrainCircuit, Scan, Trees, Droplets, Thermometer, Mountain, Brush, Eye, EyeOff, BarChart2, Lock, Unlock, Trash2, History, Undo2, User, Clock, BedDouble, Hammer, Coffee, GripVertical, CalendarDays } from 'lucide-react';

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

export default function MapEdit() {
  const [activeTab, setActiveTab] = useState('grid');
  const [showGridOverlay, setShowGridOverlay] = useState(true);
  const [mapSizeInMc, setMapSizeInMc] = useState(16000); // 16x16 km = 16000x16000 mc
  const [miniMapStyle, setMiniMapStyle] = useState('fantasy');
  
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
        <div className="w-[60px] border-r border-[#2a2b3d] bg-[#161621] flex flex-col items-center py-2 shrink-0 gap-2">
          <button onClick={() => setActiveTab('grid')} className={`w-10 h-10 rounded flex items-center justify-center ${activeTab === 'grid' ? 'bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Grid / Coordinates">
            <Grid3X3 size={20} />
          </button>
          <button onClick={() => setActiveTab('layers')} className={`w-10 h-10 rounded flex items-center justify-center ${activeTab === 'layers' ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Map Layers">
            <Layers size={20} />
          </button>
          <button onClick={() => setActiveTab('biome')} className={`w-10 h-10 rounded flex items-center justify-center ${activeTab === 'biome' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Auto Biome Generator Brush">
            <Trees size={20} />
          </button>
          <button onClick={() => setActiveTab('minimap')} className={`w-10 h-10 rounded flex items-center justify-center ${activeTab === 'minimap' ? 'bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Mini Map Editor">
            <Compass size={20} />
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`w-10 h-10 rounded flex items-center justify-center ${activeTab === 'analytics' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Biome Analytics">
            <BarChart2 size={20} />
          </button>
          <button onClick={() => setActiveTab('history')} className={`w-10 h-10 rounded flex items-center justify-center ${activeTab === 'history' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="Biome History Log">
            <History size={20} />
          </button>
          <div className="w-8 h-[1px] bg-[#2a2b3d] my-1"></div>
          <button onClick={() => setActiveTab('ai')} className={`w-10 h-10 rounded flex items-center justify-center ${activeTab === 'ai' ? 'bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/50' : 'text-[#8b949e] hover:text-white hover:bg-[#2a2b3d]'}`} title="AI Generator Engine">
            <BrainCircuit size={20} />
          </button>
        </div>

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
                <History size={16} /> Biome History Log
              </h2>
              <p className="text-[11px] text-[#8b949e]">Track procedural edits and biome brush strokes. Revert to previous states.</p>
              
              <div className="flex flex-col gap-2 flex-1 mt-2">
                {biomeStrokes.length === 0 ? (
                   <div className="text-xs text-gray-500 text-center py-8">No biome history yet. Paint some biomes!</div>
                ) : (
                   [...biomeStrokes].reverse().map((stroke, index) => (
                     <div key={stroke.id} className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded flex flex-col gap-2 relative group hover:border-[#58a6ff]/50 transition-colors">
                        <div className="flex justify-between items-center">
                           <span className="text-xs font-bold text-gray-200">
                             {stroke.type} Brush
                           </span>
                           <span className="text-[10px] text-gray-500">
                             {new Date(stroke.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' })}
                           </span>
                        </div>
                        <div className="text-[10px] text-gray-400">
                           {stroke.points.length} points generated
                        </div>
                        <button 
                          onClick={() => setBiomeStrokes(prev => prev.filter(s => s.id !== stroke.id))}
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 bg-[#f85149] hover:bg-red-600 text-white rounded p-1 transition-opacity cursor-pointer shadow"
                          title="Undo / Revert this stroke"
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
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1">
              <h2 className="text-sm font-bold text-pink-400 border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2">
                <BarChart2 size={16} /> Biome Analytics
              </h2>
              
              <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-3 text-xs text-white">
                <h3 className="font-bold text-[#c9d1d9] mb-3">Terrain Coverage</h3>
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
                        <div className="flex justify-between mb-1"><span className="text-green-500">Forest</span> <span>{points.length === 0 ? 100 : forest}%</span></div>
                        <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${points.length === 0 ? 100 : forest}%` }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1"><span className="text-blue-500">Ocean</span> <span>{ocean}%</span></div>
                        <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${ocean}%` }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1"><span className="text-emerald-500">Jungle</span> <span>{jungle}%</span></div>
                        <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${jungle}%` }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1"><span className="text-yellow-500">Desert</span> <span>{desert}%</span></div>
                        <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full"><div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${desert}%` }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1"><span className="text-sky-400">Tundra</span> <span>{tundra}%</span></div>
                        <div className="w-full bg-[#0a0a0f] h-1.5 rounded-full"><div className="bg-sky-400 h-1.5 rounded-full" style={{ width: `${tundra}%` }}></div></div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-3 text-xs text-white">
                <h3 className="font-bold text-[#c9d1d9] mb-3">Entity Density Counts</h3>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                   <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 flex flex-col items-center">
                     <MapPin size={16} className="text-[#3fb950] mb-1" />
                     <span className="text-gray-400">Towns</span>
                     <span className="font-bold text-lg">{markers.filter(m => m.type === 'town').length}</span>
                   </div>
                   <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 flex flex-col items-center">
                     <Target size={16} className="text-[#f85149] mb-1" />
                     <span className="text-gray-400">Dungeons</span>
                     <span className="font-bold text-lg">{markers.filter(m => m.type === 'dungeon').length}</span>
                   </div>
                   <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 flex flex-col items-center">
                     <Map size={16} className="text-[#e3b341] mb-1" />
                     <span className="text-gray-400">Shops</span>
                     <span className="font-bold text-lg">{markers.filter(m => m.type === 'shop').length}</span>
                   </div>
                   <div className="bg-[#0a0a0f] border border-[#2a2b3d] rounded p-2 flex flex-col items-center">
                     <Search size={16} className="text-[#58a6ff] mb-1" />
                     <span className="text-gray-400">Quests</span>
                     <span className="font-bold text-lg">{markers.filter(m => m.type === 'quest').length}</span>
                   </div>
                </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-3 text-xs text-white">
                 <h3 className="font-bold text-[#c9d1d9] mb-2">Simulated Data</h3>
                 <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Average Elevation</span>
                    <span className="text-[#3fb950]">842m (Avg)</span>
                 </div>
                 <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Global Temperature</span>
                    <span className="text-[#58a6ff]">16°C (Avg)</span>
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

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] rounded p-3">
                 <h3 className="text-[10px] font-bold text-white mb-3 uppercase">Grid Visual Properties</h3>
                 
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

          {activeTab === 'biome' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <h2 className="text-sm font-bold text-orange-400 border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2"><Brush size={16}/> AI Biome Brush</h2>
              <p className="text-[11px] text-[#8b949e]">Paint directly into 1mc cells. The AI predicts and populates flora, fauna, and soil variation based on systemic rules.</p>
              
              <div>
                <label className="text-xs text-[#c9d1d9] mb-1 block">Elevation Override (Altitude)</label>
                <div className="flex items-center gap-2 mb-1">
                   <Mountain size={14} className="text-gray-400"/>
                   <input type="range" min="0" max="100" value={biomeElevation} onChange={e => setBiomeElevation(Number(e.target.value))} className="w-full accent-orange-500" />
                   <span className="text-xs text-white font-mono w-6">{biomeElevation}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#c9d1d9] mb-1 block">Atmospheric Moisture</label>
                <div className="flex items-center gap-2 mb-1">
                   <Droplets size={14} className="text-blue-400"/>
                   <input type="range" min="0" max="100" value={biomeMoisture} onChange={e => setBiomeMoisture(Number(e.target.value))} className="w-full accent-blue-500" />
                   <span className="text-xs text-white font-mono w-6">{biomeMoisture}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#c9d1d9] mb-1 block">Ambient Temperature</label>
                <div className="flex items-center gap-2 mb-1">
                   <Thermometer size={14} className="text-red-400"/>
                   <input type="range" min="0" max="100" value={biomeTemperature} onChange={e => setBiomeTemperature(Number(e.target.value))} className="w-full accent-red-500" />
                   <span className="text-xs text-white font-mono w-6">{biomeTemperature}</span>
                </div>
              </div>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-3 rounded mt-2">
                 <h3 className="text-xs font-bold text-white mb-2 flex justify-between">
                    Predicted Biome Result
                    {activeBiomeType === 'AI_AUTO' && (
                       <span className="text-[9px] text-[#3fb950] border border-[#3fb950]/50 bg-[#3fb950]/10 px-1 rounded">
                          {biomeElevation < 30 && biomeMoisture > 70 ? 'OCEAN (Predicted)' : 
                           biomeTemperature < 30 ? 'TUNDRA (Predicted)' :
                           biomeTemperature > 70 && biomeMoisture < 30 ? 'DESERT (Predicted)' :
                           biomeTemperature > 70 && biomeMoisture > 70 ? 'JUNGLE (Predicted)' : 
                           'FOREST (Predicted)'}
                       </span>
                    )}
                 </h3>
                 <select 
                   value={activeBiomeType} 
                   onChange={(e) => setActiveBiomeType(e.target.value)}
                   className="w-full bg-[#0a0a0f] border border-[#2a2b3d] rounded px-2 py-1.5 text-xs text-white font-bold mb-2"
                 >
                   <option value="AI_AUTO">🤖 AI Auto-Detect via Params</option>
                   <option value="TUNDRA">❄️ Tundra (Cold / Dry)</option>
                   <option value="DESERT">🏜️ Desert (Hot / Dry)</option>
                   <option value="FOREST">🌲 Forest (Balanced)</option>
                   <option value="JUNGLE">🌴 Jungle (Hot / Wet)</option>
                   <option value="OCEAN">🌊 Deep Ocean (Low Elev / Wet)</option>
                 </select>
                 
                 <div className="flex flex-col gap-1 border-t border-[#2a2b3d] pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="accent-orange-500 w-3 h-3" />
                       <span className="text-[10px] text-[#8b949e] group-hover:text-white transition">Procedural Flora Seed (1vc density)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="accent-orange-500 w-3 h-3" />
                       <span className="text-[10px] text-[#8b949e] group-hover:text-white transition">Hydrological Erosion Parsing</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" className="accent-orange-500 w-3 h-3" />
                       <span className="text-[10px] text-[#8b949e] group-hover:text-white transition">Tectonic Plate Collision Sub-Mesh</span>
                    </label>
                 </div>
                 
                 <div className="text-[10px] text-[#8b949e] mt-2 border-t border-[#2a2b3d] pt-2">
                   Painting with <strong className="text-orange-400">AI Auto-Detect</strong> interpolates micro-biomes seamlessly within the 1mc cells, propagating down to 1vc.
                 </div>
              </div>

               <button className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-[#0a0a0f] font-bold text-xs py-2 rounded flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                  <Brush size={14} /> Enable AI Biome Painting
               </button>
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

          {activeTab === 'ai' && (
            <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <h2 className="text-sm font-bold text-[#bc8cff] border-b border-[#2a2b3d] pb-2 mb-2 flex items-center gap-2"><BrainCircuit size={16}/> GenAI Offline Topology Engine</h2>
              <p className="text-[11px] text-[#8b949e]">Instruct the Offline AI Swarm Copilot to calculate physics-accurate geography utilizing the sub-nanometer <span className="text-[#bc8cff] font-bold">1 vc</span> collision mesh pipeline.</p>

              <div className="bg-[#1e1e2d] border border-[#2a2b3d] p-2 rounded flex flex-col gap-2">
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Erosion Calculation</span>
                    <span className="text-[#3fb950]">Aggressive (10M Years)</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Water Table Simulation</span>
                    <span className="text-[#58a6ff]">Hydraulic Raytrace (ON)</span>
                 </div>
              </div>

              <div className="bg-[#bc8cff]/10 border border-[#bc8cff]/30 p-3 rounded mt-1">
                 <h3 className="text-xs font-bold text-[#bc8cff] mb-2 flex items-center gap-2">Neural Generation Prompt</h3>
                 <textarea className="w-full h-32 bg-[#0a0a0f] border border-[#2a2b3d] rounded text-[11px] p-2 text-white resize-none leading-relaxed custom-scrollbar" defaultValue="Generate a massive 16,000 mc ancient forest basin. Calculate microscopic root structures and soil density down to the vc unit for real-time physics destructibility. Seed hidden dungeon POIs into the lower 500 mc bedrock." />
                 <button onClick={() => {
                    const btn = document.getElementById('gen-btn');
                    if (btn) {
                      btn.innerHTML = '<svg class="animate-spin h-4 w-4 text-[#0a0a0f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Initializing Mesh Data...';
                      setTimeout(() => btn.innerHTML = '✔ Generation Simulated (Offline)', 2000);
                    }
                 }} id="gen-btn" className="w-full mt-3 bg-[#bc8cff] hover:bg-[#a371f7] text-[#0a0a0f] font-bold text-xs py-2 rounded flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]">
                    <Cloud size={14} className="animate-pulse" /> Initialize 1M Agent Swarm Build
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Viewport Canvas area */}
        <div className="flex-1 bg-[#161621] relative overflow-hidden flex flex-col">
          {/* Zoom & Snapping Controls HUD */}
          <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
             <div className="bg-[#11111b]/90 backdrop-blur border border-[#2a2b3d] rounded-lg p-1.5 flex flex-col items-center gap-1 shadow-lg">
                <button onClick={() => setZoomLevel(Math.min(15, zoomLevel + 1))} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2b3d] rounded transition" title="Zoom In"><ZoomIn size={16}/></button>
                <div className="text-[10px] font-mono font-bold text-[#58a6ff] w-8 text-center">{zoomLevel}x</div>
                <button onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2b3d] rounded transition" title="Zoom Out"><ZoomOut size={16}/></button>
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

          {/* Main 3D / Context Background Placeholder */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0c0d14] to-[#121420] flex items-center justify-center">
             <div className="w-[800px] h-[600px] bg-[#1a1b26] border border-[#2a2b3d] shadow-2xl rounded-lg relative overflow-hidden rounded-t-xl perspective-1000">
                <div className="absolute inset-0 transform rotateX-12 scale-110 opacity-40">
                  <div className="w-full h-full bg-[#2a2b3d] opacity-50 absolute" style={{ backgroundImage: 'radial-gradient(circle at center, #1a1b26 0%, #0d0df 100%)' }}></div>
                  {/* Fake terrain topology */}
                  <svg className="w-full h-full stroke-current text-[#58a6ff]/20 fill-transparent pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" />
                     <path d="M0,60 Q30,80 60,60 T100,60 L100,100 L0,100 Z" />
                  </svg>
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
             </div>
          </div>

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

        </div>
      </div>
    </div>
  )
}
