import React, { useState } from 'react';
import { 
  Map, Grid, Layers, Search, Plus, Save, Play, Mountain, Trees, Box, Hexagon, Move3D, Eye, Camera, Settings, 
  Compass, Undo, Redo, Sun, Wind, PersonStanding, RefreshCw, Maximize2, Route, SquareDashed, Milestone, 
  Clapperboard, ScrollText, Lightbulb, Paintbrush, Flag, Video, Focus, Volume2, Stamp, Cpu, Wand2, CloudRain, 
  Zap, Workflow, ImageUp, Activity, GripHorizontal, Minimize2, Database, Brain, MonitorPlay, Hammer, Bomb, 
  Folder, ChevronUp, ChevronDown, Package, BoxSelect, Trash2, Orbit, Flame, Snowflake, Skull, Waves, Moon, 
  Network, Globe, RotateCcw, Sparkles, Info, X, MapPin, AlignCenter, AlignLeft, Target, Key, Droplet, 
  Palette, MousePointer2, Scissors, Copy, ClipboardPaste, Box as BoxIcon, Link, Mic, Blend, Combine
} from 'lucide-react';

const PHYSICAL_MATERIALS = [
  { id: 'ice', name: 'Glacial Ice', category: 'Frozen', friction: 0.1, restitution: 0.2, color: 'bg-cyan-200', hex: '#a5f3fc' },
  { id: 'mud', name: 'Thick Mud', category: 'Terrain', friction: 0.9, restitution: 0.05, color: 'bg-amber-900', hex: '#78350f' },
  { id: 'sand', name: 'Dune Sand', category: 'Terrain', friction: 0.7, restitution: 0.1, color: 'bg-yellow-600', hex: '#ca8a04' },
  { id: 'gravel', name: 'Loose Gravel', category: 'Terrain', friction: 0.8, restitution: 0.3, color: 'bg-stone-500', hex: '#78716c' },
  { id: 'rock', name: 'Bedrock', category: 'Hard', friction: 0.6, restitution: 0.8, color: 'bg-gray-700', hex: '#374151' },
  { id: 'grass', name: 'Wet Grass', category: 'Foliage', friction: 0.4, restitution: 0.2, color: 'bg-green-600', hex: '#16a34a' },
  { id: 'snow', name: 'Powder Snow', category: 'Frozen', friction: 0.5, restitution: 0.1, color: 'bg-slate-200', hex: '#e2e8f0' },
  { id: 'asphalt', name: 'Asphalt', category: 'Urban', friction: 0.85, restitution: 0.4, color: 'bg-gray-800', hex: '#1f2937' },
  { id: 'wood', name: 'Sturdy Wood', category: 'Hard', friction: 0.5, restitution: 0.5, color: 'bg-amber-800', hex: '#92400e' },
  { id: 'metal', name: 'Rusted Metal', category: 'Hard', friction: 0.4, restitution: 0.6, color: 'bg-slate-600', hex: '#475569' }
];

// Mock Data
const outlinerData = [
  { id: '1', name: 'DirectionalLight_Sun', type: 'Light', icon: <Sun size={14} className="text-yellow-400" /> },
  { id: '2', name: 'SkyAtmosphere', type: 'Environment', icon: <Wind size={14} className="text-blue-300" /> },
  { id: '3', name: 'VolumetricCloud', type: 'Environment', icon: <CloudRain size={14} className="text-gray-300" /> },
  { id: '4', name: 'Landscape_Main', type: 'Landscape', icon: <Mountain size={14} className="text-green-500" /> },
  { id: '5', name: 'PlayerStart', type: 'Gameplay', icon: <Flag size={14} className="text-red-500" /> },
  { id: '6', name: 'SM_AbandonedBuilding', type: 'StaticMesh', icon: <Box size={14} className="text-gray-400" /> },
  { id: '7', name: 'WaterBody_Lake', type: 'Water', icon: <Droplet size={14} className="text-blue-500" /> },
  { id: '8', name: 'BP_Enemy_Patrol', type: 'Blueprint', icon: <Cpu size={14} className="text-purple-400" /> },
  { id: '9', name: 'PCG_Forest_Biome', type: 'Procedural', icon: <Workflow size={14} className="text-indigo-400" /> },
  { id: '10', name: 'PostProcessVolume', type: 'Volume', icon: <BoxSelect size={14} className="text-pink-400" /> }
];

export default function MapEditor({ setActiveTool }: { setActiveTool?: (tool: string) => void }) {
  // Global States
  const [activeTab, setActiveTab] = useState<'Select' | 'Landscape' | 'Foliage' | 'Paint' | 'Water' | 'Splines' | 'PCG' | 'Swarm' | 'Smart AI' | 'Lighting' | 'Geometry' | 'Cinematics' | 'Seasons' | 'Audio' | 'Physics' | 'PostProcess' | 'Navigation'>('Select');
  const [transformMode, setTransformMode] = useState<'Translate' | 'Rotate' | 'Scale'>('Translate');
  const [coordSpace, setCoordSpace] = useState<'World' | 'Local'>('World');
  const [viewportMode, setViewportMode] = useState<'Lit' | 'Unlit' | 'Wireframe' | 'Collisions' | 'ShaderComplexity'>('Lit');
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>('6');
  
  // Viewport Stats
  const [cameraSpeed, setCameraSpeed] = useState(4);
  const [gridSnap, setGridSnap] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [angleSnap, setAngleSnap] = useState(true);
  const [angleSize, setAngleSize] = useState(5);
  
  // Environment Controls
  const [timeOfDay, setTimeOfDay] = useState(14.5); // 14:30
  
  // Tool Specific States
  const [brushSize, setBrushSize] = useState(500);
  const [brushStrength, setBrushStrength] = useState(0.5);
  const [landscapeTool, setLandscapeTool] = useState<'Sculpt' | 'Smooth' | 'Flatten' | 'Erosion'>('Sculpt');
  const [erosionMode, setErosionMode] = useState<'Hydraulic' | 'Thermal'>('Hydraulic');
  const [erosionRealtime, setErosionRealtime] = useState(true);
  const [foliageDensity, setFoliageDensity] = useState(300);
  const [waterDepth, setWaterDepth] = useState(50);

  const [paintMaterial, setPaintMaterial] = useState<'Dirt' | 'Mud' | 'Sand' | 'Snow' | 'Ice' | 'Grass' | 'Rock'>('Dirt');
  const [paintTool, setPaintTool] = useState<'Paint' | 'Erase' | 'Blend' | 'Fill'>('Paint');
  const [waterTool, setWaterTool] = useState<'Ocean' | 'Lake' | 'River' | 'Lava' | 'Swamp' | 'Acid'>('Ocean');

  // Swarm Protocol States
  const [swarmEnabled, setSwarmEnabled] = useState(false);
  const [swarmTarget, setSwarmTarget] = useState<'All Devices' | 'LAN Only' | 'Cloud Burst'>('All Devices');
  const [swarmIntensity, setSwarmIntensity] = useState(80);

  // Terrain Material Drop
  const [terrainMaterial, setTerrainMaterial] = useState<string | null>(null);
  const [isDragOverViewport, setIsDragOverViewport] = useState(false);
  const currentTerrainMaterial = PHYSICAL_MATERIALS.find(m => m.id === terrainMaterial) || null;

  // Pro Tools States
  const [lightBounces, setLightBounces] = useState(4);
  const [volumetricFog, setVolumetricFog] = useState(true);
  const [geoOp, setGeoOp] = useState<'Extrude' | 'Bevel' | 'Boolean' | 'Cut'>('Extrude');
  const [frameRate, setFrameRate] = useState(60);
  const [cinematicFocal, setCinematicFocal] = useState(35);

  // New Systems States
  const [season, setSeason] = useState<'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Rainy'>('Spring');
  const [weatherIntensity, setWeatherIntensity] = useState(50);
  const [windDirection, setWindDirection] = useState(45);
  const [windStrength, setWindStrength] = useState(10);
  const [bloomEnabled, setBloomEnabled] = useState(true);
  const [exposure, setExposure] = useState(1.0);
  const [physicsSimulating, setPhysicsSimulating] = useState(false);
  const [audioCategory, setAudioCategory] = useState<'Ambient' | 'SFX' | 'Music' | 'Voice/TTS'>('Ambient');
  const [ttsMode, setTtsMode] = useState<'Speech' | 'Singing'>('Speech');
  
  // AI Smart Tool States
  const [aiLocalModel, setAiLocalModel] = useState<'SDXL-Turbo' | 'LLaMA-3-8B' | 'Stable-Mesh'>('SDXL-Turbo');
  const [isMarqueeSelecting, setIsMarqueeSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [activePromptMode, setActivePromptMode] = useState<'create' | 'edit'>('create');
  const [aiHistory, setAiHistory] = useState<string[]>([]);
  const [aiResultBox, setAiResultBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

  const viewportRef = React.useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Content Drawer
  const [isContentDrawerOpen, setIsContentDrawerOpen] = useState(false);

  // Material Library
  const [isMaterialLibraryOpen, setIsMaterialLibraryOpen] = useState(false);
  const [materialSearch, setMaterialSearch] = useState("");
  const [draggedMaterial, setDraggedMaterial] = useState<string | null>(null);

  // Asset Studio
  const [isAssetStudioOpen, setIsAssetStudioOpen] = useState(false);
  const [assetStudioTheme, setAssetStudioTheme] = useState("Fantasy Ruins");
  const [isGeneratingAssets, setIsGeneratingAssets] = useState(false);
  const [generatedProps, setGeneratedProps] = useState<any[]>([]);

  // Network Simulator
  const [isNetSimOpen, setIsNetSimOpen] = useState(false);
  const [isSimulatingLatency, setIsSimulatingLatency] = useState(false);
  const [packetLossData, setPacketLossData] = useState<number[]>([]);

  const startNetworkSimulation = () => {
    setIsSimulatingLatency(true);
    setPacketLossData([]);
    let steps = 0;
    const interval = setInterval(() => {
        setPacketLossData(prev => [...prev, Math.random() > 0.85 ? Math.random() * 40 + 60 : Math.random() * 10]);
        steps++;
        if(steps > 40) {
            clearInterval(interval);
            setIsSimulatingLatency(false);
        }
    }, 50);
  };

  const generateProceduralAssets = () => {
    setIsGeneratingAssets(true);
    setGeneratedProps([]);
    setTimeout(() => {
      setGeneratedProps([
        { id: 1, name: 'Ancient Pillar (Broken)', polyCount: '1.2k', type: 'StaticMesh', color: 'bg-stone-500' },
        { id: 2, name: 'Rubble Pile Large', polyCount: '3.4k', type: 'StaticMesh', color: 'bg-stone-600' },
        { id: 3, name: 'Overgrown Archway', polyCount: '4.1k', type: 'StaticMesh', color: 'bg-green-700' },
        { id: 4, name: 'Mystic Shrine Base', polyCount: '2.5k', type: 'StaticMesh', color: 'bg-indigo-900' },
      ]);
      setIsGeneratingAssets(false);
    }, 2000);
  };

  // Render Time string
  const formatTime = (time: number) => {
    const hrs = Math.floor(time);
    const mins = Math.floor((time - hrs) * 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden select-none">
      
      {/* Top Main Toolbar */}
      <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.5)] z-20">
        <div className="flex items-center gap-4">
          <div className="flex bg-[#21262d] p-1 rounded-md border border-[#30363d] shadow-inner">
            <button className="px-3 py-1.5 hover:bg-[#30363d] rounded text-white flex flex-col items-center gap-1 group transition-colors">
              <Save size={16} className="text-[#8b949e] group-hover:text-white" />
            </button>
            <div className="w-px bg-[#30363d] mx-1"></div>
            <button className="px-3 py-1.5 hover:bg-[#30363d] rounded text-white flex flex-col items-center gap-1 group transition-colors">
              <Undo size={16} className="text-[#8b949e] group-hover:text-white" />
            </button>
            <button className="px-3 py-1.5 hover:bg-[#30363d] rounded text-white flex flex-col items-center gap-1 group transition-colors">
              <Redo size={16} className="text-[#8b949e] group-hover:text-white" />
            </button>
          </div>

          <div className="flex bg-[#0d1117] p-1 rounded-md border border-[#30363d] shadow-inner overflow-hidden">
            <TabButton icon={<MousePointer2 size={16}/>} label="Select" active={activeTab==='Select'} onClick={()=>setActiveTab('Select')} color="text-blue-400" bgColor="bg-blue-900/20 text-blue-100" />
            <TabButton icon={<Mountain size={16}/>} label="Landscape" active={activeTab==='Landscape'} onClick={()=>setActiveTab('Landscape')} color="text-green-500" bgColor="bg-green-900/20 text-green-100" />
            <TabButton icon={<Trees size={16}/>} label="Foliage" active={activeTab==='Foliage'} onClick={()=>setActiveTab('Foliage')} color="text-emerald-400" bgColor="bg-emerald-900/20 text-emerald-100" />
            <TabButton icon={<Palette size={16}/>} label="Paint" active={activeTab==='Paint'} onClick={()=>setActiveTab('Paint')} color="text-pink-400" bgColor="bg-pink-900/20 text-pink-100" />
            <TabButton icon={<Droplet size={16}/>} label="Water" active={activeTab==='Water'} onClick={()=>setActiveTab('Water')} color="text-cyan-400" bgColor="bg-cyan-900/20 text-cyan-100" />
            <TabButton icon={<Route size={16}/>} label="Splines" active={activeTab==='Splines'} onClick={()=>setActiveTab('Splines')} color="text-yellow-400" bgColor="bg-yellow-900/20 text-yellow-100" />
            <TabButton icon={<Workflow size={16}/>} label="PCG" active={activeTab==='PCG'} onClick={()=>setActiveTab('PCG')} color="text-indigo-400" bgColor="bg-indigo-900/20 text-indigo-100" />
            <TabButton icon={<BoxIcon size={16}/>} label="Geometry" active={activeTab==='Geometry'} onClick={()=>setActiveTab('Geometry')} color="text-amber-400" bgColor="bg-amber-900/20 text-amber-100" />
            <TabButton icon={<CloudRain size={16}/>} label="Seasons" active={activeTab==='Seasons'} onClick={()=>setActiveTab('Seasons')} color="text-sky-400" bgColor="bg-sky-900/20 text-sky-100" />
            <TabButton icon={<Volume2 size={16}/>} label="Audio" active={activeTab==='Audio'} onClick={()=>setActiveTab('Audio')} color="text-teal-400" bgColor="bg-teal-900/20 text-teal-100" />
            <TabButton icon={<Orbit size={16}/>} label="Physics" active={activeTab==='Physics'} onClick={()=>setActiveTab('Physics')} color="text-red-400" bgColor="bg-red-900/20 text-red-100" />
            <TabButton icon={<Compass size={16}/>} label="NavMesh" active={activeTab==='Navigation'} onClick={()=>setActiveTab('Navigation')} color="text-indigo-200" bgColor="bg-indigo-900/20 text-indigo-100" />
            <TabButton icon={<Sun size={16}/>} label="Lighting" active={activeTab==='Lighting'} onClick={()=>setActiveTab('Lighting')} color="text-yellow-200" bgColor="bg-yellow-900/20 text-yellow-100" />
            <TabButton icon={<Camera size={16}/>} label="PostProc" active={activeTab==='PostProcess'} onClick={()=>setActiveTab('PostProcess')} color="text-fuchsia-400" bgColor="bg-fuchsia-900/20 text-fuchsia-100" />
            <TabButton icon={<Clapperboard size={16}/>} label="Cinematics" active={activeTab==='Cinematics'} onClick={()=>setActiveTab('Cinematics')} color="text-rose-400" bgColor="bg-rose-900/20 text-rose-100" />
            <TabButton icon={<Network size={16}/>} label="Swarm" active={activeTab==='Swarm'} onClick={()=>setActiveTab('Swarm')} color="text-orange-400" bgColor="bg-orange-900/20 text-orange-100" />
            <TabButton icon={<Brain size={16}/>} label="Smart AI" active={activeTab==='Smart AI'} onClick={()=>setActiveTab('Smart AI')} color="text-purple-400" bgColor="bg-purple-900/20 text-purple-100" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#21262d] px-3 py-1.5 rounded-md border border-[#30363d] shadow-inner">
            <span className="text-[11px] font-bold text-[#8b949e] uppercase">Env Time</span>
            <input 
              type="range" min="0" max="24" step="0.1" value={timeOfDay} 
              onChange={(e)=>setTimeOfDay(parseFloat(e.target.value))}
              className="w-24 accent-[#e3b341] h-1.5 bg-[#0d1117] rounded-full appearance-none outline-none overflow-hidden"
              style={{ background: `linear-gradient(to right, #e3b341 ${(timeOfDay/24)*100}%, #0d1117 ${(timeOfDay/24)*100}%)` }}
            />
            <span className="text-[12px] font-mono text-[#e3b341] w-10">{formatTime(timeOfDay)}</span>
          </div>

          <div className="flex gap-1 bg-[#21262d] p-1 rounded-md border border-[#30363d] shadow-inner">
             <button 
                onClick={() => { setIsPlaying(true); setIsSimulating(false); }}
                className={`px-4 py-1.5 rounded font-bold text-[12px] flex items-center gap-2 transition-all ${isPlaying ? 'bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950] shadow-[0_0_15px_rgba(63,185,80,0.3)]' : 'hover:bg-[#30363d] text-white border border-transparent'}`}
             >
                <Play size={14} className={isPlaying ? "fill-current" : ""} /> Play Level
             </button>
             <button 
                onClick={() => { setIsSimulating(true); setIsPlaying(false); }}
                className={`px-4 py-1.5 rounded font-bold text-[12px] flex items-center gap-2 transition-all ${isSimulating ? 'bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff] shadow-[0_0_15px_rgba(188,140,255,0.3)]' : 'hover:bg-[#30363d] text-white border border-transparent'}`}
             >
                <MonitorPlay size={14} /> Simulate Core
             </button>
             {(isPlaying || isSimulating) && (
               <button 
                 onClick={() => {setIsPlaying(false); setIsSimulating(false);}}
                 className="px-3 py-1.5 rounded bg-[#f85149]/20 border border-[#f85149]/50 hover:bg-[#f85149]/40 text-[#f85149] flex items-center transition-colors shadow-[0_0_10px_rgba(248,81,73,0.2)] ml-1"
               >
                 <X size={16} strokeWidth={3} />
               </button>
             )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Material Library Slide-out Panel */}
        {isMaterialLibraryOpen && (
          <div className="w-[300px] border-r border-[#30363d] bg-[#0d1117] flex flex-col z-20 shrink-0 shadow-[5px_0_20px_rgba(0,0,0,0.6)] animate-in slide-in-from-left-4">
             <div className="h-10 border-b border-[#30363d] flex items-center justify-between px-4 bg-[#161b22]">
                <span className="text-[12px] font-bold uppercase flex items-center gap-2"><Package size={14} className="text-pink-400"/> Material Library</span>
                <button onClick={() => setIsMaterialLibraryOpen(false)} className="text-[#8b949e] hover:text-white"><X size={14} /></button>
             </div>
             <div className="p-3 border-b border-[#30363d] bg-[#0d1117]">
                <div className="relative">
                   <Search size={14} className="absolute left-2.5 top-2 text-[#8b949e]" />
                   <input 
                      type="text" 
                      placeholder="Search physical materials..." 
                      className="w-full bg-[#161b22] border border-[#30363d] rounded py-1.5 pl-8 pr-3 text-[11px] text-white focus:outline-none focus:border-pink-500/50"
                      value={materialSearch}
                      onChange={e => setMaterialSearch(e.target.value)}
                   />
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 custom-scrollbar bg-[#050505]">
                {PHYSICAL_MATERIALS.filter(m => m.category.toLowerCase().includes(materialSearch.toLowerCase()) || m.name.toLowerCase().includes(materialSearch.toLowerCase())).map(material => (
                   <div 
                      key={material.id}
                      draggable
                      onDragStart={(e) => {
                         setDraggedMaterial(material.id);
                         e.dataTransfer.setData('text/plain', material.id);
                      }}
                      onDragEnd={() => setDraggedMaterial(null)}
                      className={`flex flex-col gap-2 p-3 bg-[#161b22] border border-[#30363d] rounded-lg hover:border-pink-500/50 hover:bg-[#21262d] cursor-grab active:cursor-grabbing transition-colors ${draggedMaterial === material.id ? 'opacity-50 scale-95 border-pink-500' : ''}`}
                   >
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded shrink-0 shadow-inner ${material.color} border border-white/10 relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-white">{material.name}</span>
                            <span className="text-[10px] text-[#8b949e] uppercase">{material.category}</span>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#30363d]">
                         <div className="flex items-center justify-between">
                            <span className="text-[9px] text-[#8b949e]">Friction</span>
                            <span className="text-[10px] font-mono font-bold text-pink-400">{material.friction.toFixed(2)}</span>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="text-[9px] text-[#8b949e]">Restitution</span>
                            <span className="text-[10px] font-mono font-bold text-cyan-400">{material.restitution.toFixed(2)}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}
        
        {/* Left Toolbar (Massive Mode Specific Tools) */}
        <div className="w-[340px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 z-10 shadow-[5px_0_20px_rgba(0,0,0,0.6)]">
           <div className="h-10 border-b border-[#30363d] flex items-center justify-between px-4 bg-[#0d1117]">
             <span className="text-[13px] font-bold uppercase tracking-widest text-white flex items-center gap-2 shadow-text">
               {activeTab === 'PCG' ? <Workflow size={14} className="text-[#a371f7]"/> : 
                activeTab === 'Foliage' ? <Trees size={14} className="text-[#3fb950]"/> : 
                activeTab === 'Swarm' ? <Network size={14} className="text-orange-400"/> : 
                activeTab === 'Smart AI' as any ? <Brain size={14} className="text-purple-400"/> : 
                <Settings size={14} className="text-[#58a6ff]"/>}
               {activeTab} Mode Settings
             </span>
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-5">
              
              {/* SELECT MODE */}
              {activeTab === 'Select' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl shadow-inner">
                       <h3 className="text-[11px] text-[#8b949e] font-bold uppercase mb-3 flex items-center gap-2"><Lightbulb size={12}/> Quick Add Entities</h3>
                       <div className="grid grid-cols-2 gap-2">
                         <QuickAddBtn icon={<Lightbulb/>} label="Point Light" />
                         <QuickAddBtn icon={<BoxIcon/>} label="Static Cube" />
                         <QuickAddBtn icon={<PersonStanding/>} label="Player Start" />
                         <QuickAddBtn icon={<Wand2/>} label="AI NavMesh Vol" />
                         <QuickAddBtn icon={<CloudRain/>} label="Post Process" />
                         <QuickAddBtn icon={<Wind/>} label="Sky Atmosphere" />
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                       <h3 className="text-[11px] text-[#8b949e] font-bold uppercase mb-1">Advanced Selection</h3>
                       <button className="flex items-center gap-3 p-3 bg-[#21262d] border border-[#30363d] rounded-xl hover:border-[#58a6ff] hover:bg-[#58a6ff]/10 transition-all text-left shadow-sm">
                          <BoxSelect size={20} className="text-[#58a6ff]"/>
                          <div className="flex flex-col">
                            <span className="text-[12px] text-white font-bold">Marquee Box Select</span>
                            <span className="text-[10px] text-[#8b949e]">Select multiple actors in 3D box</span>
                          </div>
                       </button>
                       <button className="flex items-center gap-3 p-3 bg-[#21262d] border border-[#30363d] rounded-xl hover:border-[#bc8cff] hover:bg-[#bc8cff]/10 transition-all text-left shadow-sm">
                          <Target size={20} className="text-[#bc8cff]"/>
                          <div className="flex flex-col">
                            <span className="text-[12px] text-white font-bold">Select by Material Group</span>
                            <span className="text-[10px] text-[#8b949e]">Find all actors using shared material</span>
                          </div>
                       </button>
                    </div>
                 </div>
              )}

              {/* LANDSCAPE MODE */}
              {activeTab === 'Landscape' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="grid grid-cols-2 gap-2">
                       <ToolBtn icon={<Mountain/>} label="Sculpt" active={landscapeTool === 'Sculpt'} onClick={() => setLandscapeTool('Sculpt')} />
                       <ToolBtn icon={<Waves/>} label="Smooth" active={landscapeTool === 'Smooth'} onClick={() => setLandscapeTool('Smooth')} />
                       <ToolBtn icon={<AlignCenter/>} label="Flatten" active={landscapeTool === 'Flatten'} onClick={() => setLandscapeTool('Flatten')} />
                       <ToolBtn icon={<CloudRain/>} label="Erosion" active={landscapeTool === 'Erosion'} onClick={() => setLandscapeTool('Erosion')} />
                    </div>

                    <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col gap-4 shadow-inner">
                       <h3 className="text-[11px] text-[#8b949e] font-bold uppercase border-b border-[#30363d] pb-2 flex items-center gap-2"><Settings size={12}/> Brush Settings</h3>
                       
                       <SliderControl label="Brush Size" value={brushSize} max={5000} color="#58a6ff" onChange={setBrushSize} />
                       <SliderControl label="Tool Strength" value={brushStrength} max={1} step={0.01} color="#3fb950" onChange={setBrushStrength} />
                       
                       {landscapeTool === 'Erosion' && (
                          <div className="flex flex-col gap-3 mt-2 border-t border-[#30363d] pt-3 animate-in fade-in">
                             <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] p-1 rounded-md">
                                <button className={`flex-1 text-[11px] py-1 font-bold rounded ${erosionMode === 'Hydraulic' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'text-[#8b949e] hover:text-white'}`} onClick={() => setErosionMode('Hydraulic')}>Hydraulic</button>
                                <button className={`flex-1 text-[11px] py-1 font-bold rounded ${erosionMode === 'Thermal' ? 'bg-[#ff7b72]/20 text-[#ff7b72]' : 'text-[#8b949e] hover:text-white'}`} onClick={() => setErosionMode('Thermal')}>Thermal</button>
                             </div>
                             <ToggleSwitch label="Real-Time Simulation" active={erosionRealtime} color={erosionMode === 'Hydraulic' ? '#58a6ff' : '#ff7b72'} onChange={setErosionRealtime} />
                             {erosionMode === 'Hydraulic' && (
                                <>
                                   <SliderControl label="Rain Amount" value={0.8} max={1} step={0.01} color="#58a6ff" />
                                   <SliderControl label="Sediment Capacity" value={0.4} max={1} step={0.01} color="#58a6ff" />
                                   <SliderControl label="Evaporation Rate" value={0.2} max={1} step={0.01} color="#58a6ff" />
                                </>
                             )}
                             {erosionMode === 'Thermal' && (
                                <>
                                   <SliderControl label="Talus Angle" value={0.6} max={1} step={0.01} color="#ff7b72" />
                                   <SliderControl label="Weathering Rate" value={0.7} max={1} step={0.01} color="#ff7b72" />
                                </>
                             )}
                          </div>
                       )}

                       {landscapeTool !== 'Erosion' && (
                          <div className="flex flex-col gap-1.5 mt-2">
                             <span className="text-[11px] font-bold text-[#8b949e] uppercase">Falloff Curve</span>
                             <div className="flex gap-2 h-10">
                                <div className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMCAxMDBDMDAgNTAgMTAwIDUwIDEwMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNSIvPjwvc3ZnPg==')] bg-contain bg-no-repeat bg-center rounded border border-[#30363d] cursor-pointer hover:border-[#58a6ff] hover:bg-[#21262d]"></div>
                                <div className="flex-1 bg-[linear-gradient(to_bottom,transparent,rgba(88,166,255,0.2))] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMCAxMDBDMTAwIDEwMCAxMDAgMCAxMDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNThhNmZmIiBzdHJva2Utd2lkdGg9IjUiLz48L3N2Zz4=')] bg-contain bg-no-repeat bg-center rounded border-2 border-[#58a6ff] cursor-pointer shadow-[0_0_10px_rgba(88,166,255,0.2)]"></div>
                                <div className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMCAxMDBMMTAwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI1Ii8+PC9zdmc+')] bg-contain bg-no-repeat bg-center rounded border border-[#30363d] cursor-pointer hover:border-[#58a6ff] hover:bg-[#21262d]"></div>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              )}

              {/* FOLIAGE MODE */}
              {activeTab === 'Foliage' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col gap-3 shadow-inner max-h-[250px] overflow-y-auto custom-scrollbar">
                       <div className="flex justify-between items-center border-b border-[#30363d] pb-2">
                         <h3 className="text-[11px] text-[#8b949e] font-bold uppercase flex items-center gap-2"><Trees size={12}/> Foliage Types</h3>
                         <button className="text-[#3fb950] hover:text-white"><Plus size={14}/></button>
                       </div>
                       <div className="grid grid-cols-3 gap-2">
                         <FoliageItem name="OakTree_01" active color="border-[#3fb950] bg-[#3fb950]/10" />
                         <FoliageItem name="PineTree_Tall" active color="border-[#3fb950] bg-[#3fb950]/10" />
                         <FoliageItem name="Bush_Thick" />
                         <FoliageItem name="Fern_Clusters" active color="border-[#3fb950] bg-[#3fb950]/10" />
                         <FoliageItem name="Rock_Mossy" />
                         <FoliageItem name="DeadLog" />
                       </div>
                    </div>

                    <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col gap-4 shadow-[0_5px_10px_rgba(0,0,0,0.3)]">
                       <h3 className="text-[11px] text-[#8b949e] font-bold uppercase border-b border-[#30363d] pb-2">Painting & Scattering Rules</h3>
                       <SliderControl label="Paint Density (per 1k sq.m)" value={foliageDensity} max={1000} color="#3fb950" onChange={setFoliageDensity} />
                       
                       <div className="grid grid-cols-2 gap-4">
                          <RangeControl label="Scale X" min={0.5} max={1.5} color="#c9d1d9" />
                          <RangeControl label="Scale Z" min={0.8} max={1.2} color="#58a6ff" />
                       </div>

                       <div className="flex flex-col gap-2 border-t border-[#30363d] pt-3">
                          <ToggleSwitch label="Align to Normal" active={true} color="#3fb950" />
                          <ToggleSwitch label="Random Yaw (0-360°)" active={true} color="#3fb950" />
                          <ToggleSwitch label="Collision Enabled" active={false} color="#f85149" />
                       </div>
                    </div>
                 </div>
              )}

              {/* PAINT MODE */}
              {activeTab === 'Paint' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="grid grid-cols-4 gap-2">
                       <ToolBtn icon={<Palette/>} label="Paint" active={paintTool === 'Paint'} onClick={() => setPaintTool('Paint')} />
                       <ToolBtn icon={<Paintbrush/>} label="Erase" active={paintTool === 'Erase'} onClick={() => setPaintTool('Erase')} />
                       <ToolBtn icon={<Blend size={16} />} label="Blend" active={paintTool === 'Blend'} onClick={() => setPaintTool('Blend')} />
                       <ToolBtn icon={<Stamp/>} label="Fill" active={paintTool === 'Fill'} onClick={() => setPaintTool('Fill')} />
                    </div>

                    <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col gap-3 shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar">
                       <div className="flex justify-between items-center border-b border-[#30363d] pb-2">
                         <h3 className="text-[11px] text-[#8b949e] font-bold uppercase flex items-center gap-2"><Layers size={12}/> Surface Materials</h3>
                         <button className="text-[#58a6ff] hover:text-white"><Plus size={14}/></button>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2">
                          <PaintMaterialBtn label="Dirt" active={paintMaterial === 'Dirt'} onClick={() => setPaintMaterial('Dirt')} color="text-amber-700" />
                          <PaintMaterialBtn label="Mud" active={paintMaterial === 'Mud'} onClick={() => setPaintMaterial('Mud')} color="text-orange-900" />
                          <PaintMaterialBtn label="Sand" active={paintMaterial === 'Sand'} onClick={() => setPaintMaterial('Sand')} color="text-yellow-200" />
                          <PaintMaterialBtn label="Snow" active={paintMaterial === 'Snow'} onClick={() => setPaintMaterial('Snow')} color="text-white" />
                          <PaintMaterialBtn label="Ice" active={paintMaterial === 'Ice'} onClick={() => setPaintMaterial('Ice')} color="text-cyan-200" />
                          <PaintMaterialBtn label="Grass" active={paintMaterial === 'Grass'} onClick={() => setPaintMaterial('Grass')} color="text-green-500" />
                          <PaintMaterialBtn label="Rock" active={paintMaterial === 'Rock'} onClick={() => setPaintMaterial('Rock')} color="text-gray-500" />
                          <PaintMaterialBtn label="Gravel" active={false} color="text-gray-400" />
                       </div>
                    </div>

                    <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col gap-4 shadow-[0_5px_10px_rgba(0,0,0,0.3)]">
                       <h3 className="text-[11px] text-[#8b949e] font-bold uppercase border-b border-[#30363d] pb-2">Brush Settings</h3>
                       <SliderControl label="Brush Size" value={brushSize} max={5000} color="#ff7b72" onChange={setBrushSize} />
                       <SliderControl label="Tool Strength" value={brushStrength} max={1} step={0.01} color="#ff7b72" onChange={setBrushStrength} />
                       <div className="flex flex-col gap-2 border-t border-[#30363d] pt-3">
                          <ToggleSwitch label="Use Height Blend" active={true} color="#ff7b72" />
                          <ToggleSwitch label="Auto-Displacement" active={false} color="#ff7b72" />
                       </div>
                    </div>
                 </div>
              )}

              {/* WATER MODE */}
              {activeTab === 'Water' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="grid grid-cols-3 gap-2 bg-[#0d1117] p-2 rounded-xl border border-[#30363d]">
                       <ToolBtn icon={<Waves/>} label="Ocean" active={waterTool === 'Ocean'} onClick={() => setWaterTool('Ocean')} />
                       <ToolBtn icon={<Droplet/>} label="Lake" active={waterTool === 'Lake'} onClick={() => setWaterTool('Lake')} />
                       <ToolBtn icon={<Route/>} label="River" active={waterTool === 'River'} onClick={() => setWaterTool('River')} />
                       <ToolBtn icon={<Flame/>} label="Lava" active={waterTool === 'Lava'} onClick={() => setWaterTool('Lava')} />
                       <ToolBtn icon={<Skull/>} label="Acid" active={waterTool === 'Acid'} onClick={() => setWaterTool('Acid')} />
                       <ToolBtn icon={<Waves/>} label="Swamp" active={waterTool === 'Swamp'} onClick={() => setWaterTool('Swamp')} />
                    </div>

                    <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col gap-4 shadow-[0_5px_10px_rgba(0,0,0,0.3)]">
                       <h3 className="text-[11px] text-[#58a6ff] font-bold uppercase border-b border-[#58a6ff]/30 pb-2 flex items-center gap-2"><LockWater size={12}/> Fluid Dynamics</h3>
                       
                       <SliderControl label="Fluid Depth Falloff" value={waterDepth} max={100} color="#58a6ff" onChange={setWaterDepth} unit="m" />
                       <SliderControl label="Surface Turbulence" value={4.2} max={10} step={0.1} color="#58a6ff" unit="m" />
                       <SliderControl label="Flow Velocity" value={1.5} max={5} step={0.1} color="#bc8cff" unit="m/s" />

                       <div className="flex flex-col gap-2 border-t border-[#30363d] pt-3">
                          <ToggleSwitch label="Generate Foam / Crust" active={true} color="#58a6ff" />
                          <ToggleSwitch label="Underwater Caustics" active={true} color="#58a6ff" />
                          <ToggleSwitch label="Buoyancy Simulation" active={true} color="#f85149" />
                          <ToggleSwitch label="Fluid Interaction Physics" active={true} color="#3fb950" />
                       </div>
                    </div>
                 </div>
              )}

              {/* PCG MODE */}
              {activeTab === 'PCG' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="bg-[#161b22] border border-[#a371f7]/50 shadow-[0_0_20px_rgba(163,113,247,0.15)] rounded-xl p-4 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-[#a371f7] blur-[60px] opacity-20 pointer-events-none"></div>
                       <h3 className="text-[13px] font-bold text-white mb-1 flex items-center gap-2"><Workflow size={16} className="text-[#a371f7]"/> PCG Graph Editor</h3>
                       <p className="text-[10px] text-[#8b949e] mb-4">Procedural Content Generation Framework allows node-based logic to spawn entities procedurally at runtime or cook-time.</p>
                       <button className="w-full bg-[#a371f7] hover:bg-[#b084f8] text-white py-2 rounded-lg font-bold text-[11px] shadow-[0_0_15px_rgba(163,113,247,0.4)] transition-all flex items-center justify-center gap-2 mb-2">
                          <Link size={14}/> Open Node Graph Window
                       </button>
                       <button onClick={() => setIsAssetStudioOpen(true)} className="w-full bg-[#21262d] border border-[#a371f7]/40 hover:bg-[#a371f7]/20 text-[#d6bdfb] py-2 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-2">
                          <Hammer size={14}/> Procedural Asset Studio
                       </button>
                    </div>

                    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col p-4 gap-3 shadow-inner">
                       <h3 className="text-[11px] text-[#8b949e] font-bold uppercase border-b border-[#30363d] pb-2">Active Graph Components</h3>
                       
                       {/* Mock node stack */}
                       <div className="flex flex-col gap-2 text-[10px] font-mono">
                          <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex items-center justify-between">
                             <span className="flex items-center gap-2 font-bold text-white"><BoxSelect size={12} className="text-[#58a6ff]"/> Surface Sampler</span>
                             <span className="text-[#3fb950]">14.2ms</span>
                          </div>
                          <div className="flex justify-center"><ChevronDown size={12} className="text-[#8b949e]"/></div>
                          <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex items-center justify-between">
                             <span className="flex items-center gap-2 font-bold text-white"><Move3D size={12} className="text-[#e3b341]"/> Transform Points</span>
                             <span className="text-[#3fb950]">2.1ms</span>
                          </div>
                          <div className="flex justify-center"><ChevronDown size={12} className="text-[#8b949e]"/></div>
                          <div className="bg-[#21262d] border-2 border-[#a371f7] p-2 rounded flex items-center justify-between shadow-[0_0_10px_rgba(163,113,247,0.2)]">
                             <span className="flex items-center gap-2 font-bold text-white"><Box size={12} className="text-[#a371f7]"/> Static Mesh Spawner</span>
                             <span className="text-[#e3b341]">45.8ms</span>
                          </div>
                       </div>
                       
                       <button className="mt-2 py-2 bg-[#161b22] border border-[#30363d] hover:bg-[#30363d] rounded text-[#c9d1d9] font-bold text-[10px] transition-all flex items-center justify-center gap-2"><RefreshCw size={12}/> Generate (Cook Layer)</button>
                    </div>
                 </div>
              )}

              {/* SWARM MODE */}
              {activeTab === 'Swarm' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="bg-[#161b22] border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)] rounded-xl p-4 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500 blur-[60px] opacity-20 pointer-events-none"></div>
                       <h3 className="text-[13px] font-bold text-white mb-1 flex items-center gap-2"><Network size={16} className="text-orange-400"/> Swarm Protocol</h3>
                       <p className="text-[10px] text-[#8b949e] mb-4">Offload heavy mesh and lightmass processing to all connected local network devices.</p>
                       
                       <div className="flex items-center justify-between bg-[#0d1117] p-3 rounded-lg border border-[#30363d] mb-4">
                          <div className="flex flex-col">
                             <span className="text-[11px] font-bold text-white">Enable Protocol</span>
                             <span className="text-[9px] text-orange-400">Warning: High bandwidth usage</span>
                          </div>
                          <ToggleSwitch label="" active={swarmEnabled} onChange={setSwarmEnabled} color="#f97316" />
                       </div>

                       <div className={`flex flex-col gap-4 transition-all duration-300 ${swarmEnabled ? 'opacity-100 pointer-events-auto' : 'opacity-30 pointer-events-none'}`}>
                          <div className="flex flex-col gap-2">
                             <span className="text-[10px] font-bold text-[#8b949e] uppercase">Node Target Domain</span>
                             <div className="flex gap-1 bg-[#0d1117] p-1 rounded-md border border-[#30363d]">
                                <button onClick={() => setSwarmTarget('All Devices')} className={`flex-1 py-1 text-[10px] rounded font-bold transition-all ${swarmTarget === 'All Devices' ? 'bg-orange-500 text-white' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}>All Nodes</button>
                                <button onClick={() => setSwarmTarget('LAN Only')} className={`flex-1 py-1 text-[10px] rounded font-bold transition-all ${swarmTarget === 'LAN Only' ? 'bg-orange-500 text-white' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}>Local Only</button>
                                <button onClick={() => setSwarmTarget('Cloud Burst')} className={`flex-1 py-1 text-[10px] rounded font-bold transition-all ${swarmTarget === 'Cloud Burst' ? 'bg-orange-500 text-white' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}>Cloud Burst</button>
                             </div>
                          </div>

                          <SliderControl label="Offload Intensity" value={swarmIntensity} max={100} color="#f97316" onChange={setSwarmIntensity} unit="%" />
                       </div>
                    </div>

                    <div className={`bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col p-4 gap-3 shadow-inner transition-all duration-300 ${swarmEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                       <h3 className="text-[11px] text-[#8b949e] font-bold uppercase border-b border-[#30363d] pb-2 flex items-center gap-2"><Cpu size={12}/> Connected Nodes</h3>
                       
                       <div className="flex flex-col gap-2">
                          <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex items-center justify-between relative overflow-hidden group">
                             <div className="absolute inset-0 bg-orange-500/10 w-[80%] border-r border-orange-500/30"></div>
                             <div className="flex items-center gap-2 relative z-10">
                                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                                <span className="text-[10px] font-bold text-white">Ryzen_Threadripper</span>
                             </div>
                             <span className="text-[10px] text-orange-400 font-mono relative z-10">80% Load</span>
                          </div>
                          
                          <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex items-center justify-between relative overflow-hidden group">
                             <div className="absolute inset-0 bg-orange-500/10 w-[45%] border-r border-orange-500/30"></div>
                             <div className="flex items-center gap-2 relative z-10">
                                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                                <span className="text-[10px] font-bold text-white">RTX_4090_Compute</span>
                             </div>
                             <span className="text-[10px] text-orange-400 font-mono relative z-10">45% Load</span>
                          </div>

                          <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex items-center justify-between relative overflow-hidden group">
                             <div className="absolute inset-0 bg-orange-500/10 w-[12%] border-r border-orange-500/30"></div>
                             <div className="flex items-center gap-2 relative z-10">
                                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                                <span className="text-[10px] font-bold text-white">MacBook_Pro_M3</span>
                             </div>
                             <span className="text-[10px] text-orange-400 font-mono relative z-10">12% Load</span>
                          </div>
                          
                          <div className="bg-[#21262d] border border-[#30363d] p-2 rounded flex items-center justify-between text-opacity-50">
                             <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2"><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>
                                <span className="text-[10px] font-bold text-[#8b949e]">Studio_Server_Rack_1</span>
                             </div>
                             <span className="text-[10px] text-[#8b949e] font-mono">Offline</span>
                          </div>
                       </div>
                       
                       <button className="mt-2 py-2 bg-[#161b22] border border-[#30363d] hover:bg-[#30363d] hover:border-orange-500/50 rounded text-orange-400 font-bold text-[10px] transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(249,115,22,0.1)]"><RefreshCw size={12}/> Scan Local Subnet</button>
                       <button onClick={() => setIsNetSimOpen(true)} className="py-2 bg-[#21262d] border border-blue-500/50 hover:bg-blue-500/20 rounded text-blue-400 font-bold text-[10px] transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(59,130,246,0.1)]"><Activity size={12}/> Network Latency Debugger</button>
                    </div>
                 </div>
              )}

              {/* SMART AI MODE */}
              {activeTab === 'Smart AI' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="bg-[#161b22] border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] rounded-xl p-4 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 blur-[80px] opacity-20 pointer-events-none"></div>
                       <h3 className="text-[13px] font-bold text-white mb-1 flex items-center gap-2"><Brain size={16} className="text-purple-400"/> Offline AI Gen</h3>
                       <p className="text-[10px] text-[#8b949e] mb-4">Select an area in the viewport to generate terrains, objects, or apply transformations via AI. Zero cloud dependency.</p>
                       
                       <div className="flex items-center justify-between bg-[#0d1117] p-2 rounded-lg border border-[#30363d] mb-4">
                           <div className="flex flex-col">
                             <span className="text-[11px] font-bold text-white uppercase flex items-center gap-1.5"><Database size={10} className="text-purple-400"/> Model Engine</span>
                             <span className="text-[9px] text-[#8b949e]">Locally executing weights</span>
                           </div>
                           <select 
                             value={aiLocalModel} 
                             onChange={(e) => setAiLocalModel(e.target.value as any)}
                             className="bg-[#21262d] text-[10px] text-white border border-[#30363d] rounded px-2 py-1 outline-none"
                           >
                             <option value="SDXL-Turbo">SDXL-Turbo (Texture/Mat)</option>
                             <option value="Stable-Mesh">Stable-Mesh 3D</option>
                             <option value="LLaMA-3-8B">LLaMA-3-8B (Logic/Tags)</option>
                           </select>
                       </div>

                       <div className="flex flex-col gap-3">
                          <div className="flex gap-1 bg-[#0d1117] p-1 rounded-md border border-[#30363d]">
                             <button onClick={() => setActivePromptMode('create')} className={`flex-1 py-1.5 text-[10px] rounded font-bold transition-all flex justify-center items-center gap-1.5 ${activePromptMode === 'create' ? 'bg-purple-500 text-white' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}><Wand2 size={12}/> Create</button>
                             <button onClick={() => setActivePromptMode('edit')} className={`flex-1 py-1.5 text-[10px] rounded font-bold transition-all flex justify-center items-center gap-1.5 ${activePromptMode === 'edit' ? 'bg-purple-500 text-white' : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'}`}><Scissors size={12}/> Edit</button>
                          </div>
                          
                          <div className="bg-[#050505] border border-[#30363d] rounded-lg p-3 text-[10px] text-[#8b949e] italic text-center">
                             Right-click or drag-select an area in the viewport to open the context AI prompter.
                          </div>
                          
                          <button className="py-2 bg-purple-500/10 border border-purple-500/50 hover:bg-purple-500/30 rounded text-purple-400 font-bold text-[10px] transition-all flex items-center justify-center gap-2 mt-2">
                             <Database size={12}/> Offline AI Mode Active
                          </button>
                       </div>
                    </div>
                    
                    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col p-4 gap-3 shadow-inner">
                       <h3 className="text-[11px] text-[#8b949e] font-bold uppercase border-b border-[#30363d] pb-2 flex items-center justify-between">
                          <span className="flex items-center gap-2"><AlignLeft size={12}/> AI History</span>
                          <span className="text-[9px] bg-[#21262d] px-1.5 py-0.5 rounded text-white">Local</span>
                       </h3>
                       
                       <div className="flex flex-col gap-2">
                          {aiHistory.length === 0 ? (
                             <div className="text-[10px] text-[#8b949e] text-center italic py-4">No recent generations</div>
                          ) : (
                             aiHistory.map((hist, idx) => (
                                <div key={idx} className="bg-[#21262d] border border-[#30363d] p-2 rounded text-[10px] text-[#c9d1d9] flex flex-col gap-1 hover:border-purple-500/30 transition-colors cursor-pointer">
                                   <span className="font-bold text-white flex items-center gap-1.5"><Sparkles size={10} className="text-purple-400"/> "{hist}"</span>
                                   <span className="text-[9px] text-[#8b949e] opacity-70 flex items-center justify-between">Local Render <RotateCcw size={10} className="hover:text-white"/></span>
                                </div>
                             ))
                          )}
                       </div>
                    </div>
                 </div>
              )}

              {/* SEASONS & WEATHER MODE */}
              {activeTab === 'Seasons' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="grid grid-cols-5 gap-1.5 bg-[#0d1117] p-2 rounded-xl border border-[#30363d]">
                       <ToolBtn icon={<CloudRain size={14}/>} label="Spring" active={season === 'Spring'} onClick={() => setSeason('Spring')} />
                       <ToolBtn icon={<Sun size={14}/>} label="Summer" active={season === 'Summer'} onClick={() => setSeason('Summer')} />
                       <ToolBtn icon={<Mountain size={14}/>} label="Autumn" active={season === 'Autumn'} onClick={() => setSeason('Autumn')} />
                       <ToolBtn icon={<Snowflake size={14}/>} label="Winter" active={season === 'Winter'} onClick={() => setSeason('Winter')} />
                       <ToolBtn icon={<CloudRain size={14}/>} label="Rainy" active={season === 'Rainy'} onClick={() => setSeason('Rainy')} />
                    </div>

                    <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col gap-4 shadow-[0_5px_10px_rgba(0,0,0,0.3)]">
                       <h3 className="text-[11px] text-sky-100 font-bold uppercase border-b border-[#30363d] pb-2 flex items-center gap-2"><Wind size={14} className="text-sky-400"/> Weather Simulation</h3>
                       
                       <SliderControl label="Weather Intensity" value={weatherIntensity} max={100} color="#38bdf8" onChange={setWeatherIntensity} unit="%" />
                       <SliderControl label="Wind Direction" value={windDirection} max={360} color="#38bdf8" onChange={setWindDirection} unit="°" />
                       <SliderControl label="Wind Strength" value={windStrength} max={100} color="#e0f2fe" onChange={setWindStrength} />
                       
                       <div className="flex flex-col gap-2 border-t border-[#30363d] pt-3">
                          <ToggleSwitch label="Dynamic Clouds" active={true} color="#38bdf8" />
                          <ToggleSwitch label="Foliage Wind Sway" active={true} color="#38bdf8" />
                          <ToggleSwitch label="Weather Particles" active={true} color="#38bdf8" />
                       </div>
                    </div>
                 </div>
              )}

              {/* POST PROCESS MODE */}
              {activeTab === 'PostProcess' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl shadow-inner flex flex-col gap-4">
                       <h3 className="text-[11px] font-bold text-fuchsia-100 uppercase flex items-center gap-2 border-b border-[#30363d] pb-2"><Camera size={14} className="text-fuchsia-400"/> Post Processing Volume</h3>
                       
                       <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                          <span className="text-[11px] font-bold text-white">Enable Bloom</span>
                          <ToggleSwitch active={bloomEnabled} onChange={setBloomEnabled} color="#e879f9" />
                       </div>
                       
                       <SliderControl label="Exposure Bias" value={exposure} max={5} step={0.1} color="#e879f9" onChange={setExposure} />
                       <SliderControl label="Chromatic Aberration" value={1.5} max={5} step={0.1} color="#e879f9" />
                       <SliderControl label="Film Grain" value={0.5} max={2} step={0.1} color="#e879f9" />
                       <SliderControl label="Vignette Intensity" value={0.8} max={2} step={0.1} color="#e879f9" />
                    </div>
                 </div>
              )}

              {/* AUDIO MODE */}
              {activeTab === 'Audio' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="flex gap-2 bg-[#0d1117] p-2 rounded-xl border border-[#30363d] overflow-x-auto custom-scrollbar">
                       <ToolBtn icon={<Volume2 size={14}/>} label="Ambient" active={audioCategory === 'Ambient'} onClick={() => setAudioCategory('Ambient')} />
                       <ToolBtn icon={<Zap size={14}/>} label="SFX" active={audioCategory === 'SFX'} onClick={() => setAudioCategory('SFX')} />
                       <ToolBtn icon={<Play size={14}/>} label="Music" active={audioCategory === 'Music'} onClick={() => setAudioCategory('Music')} />
                       <ToolBtn icon={<Mic size={14}/>} label="Voice/TTS" active={audioCategory === 'Voice/TTS'} onClick={() => setAudioCategory('Voice/TTS')} />
                    </div>
                    
                    {audioCategory === 'Voice/TTS' ? (
                       <div className="p-4 bg-[#161b22] border border-purple-500/50 rounded-xl flex flex-col gap-3 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden">
                          <div className="absolute inset-0 bg-purple-500/5 pointer-events-none"></div>
                          <h3 className="text-[11px] font-bold text-purple-300 uppercase flex items-center gap-2"><Brain size={14} className="text-purple-400"/> Offline AI Thai Engine (Vocal & Singing)</h3>
                          <div className="border border-purple-500/30 rounded-lg p-2 bg-[#050505] text-[10px] text-[#c9d1d9] leading-relaxed max-h-[140px] overflow-y-auto custom-scrollbar">
                             <strong>Local NLP Model Active:</strong> Fine-tuned for precise <span className="text-purple-400">Thai Phonics & Singing</span>.
                             <div className="mt-2 text-[#8b949e]">
                                <ul className="pl-3 list-disc opacity-80 flex flex-col gap-1">
                                   <li><strong>พยัญชนะต้น:</strong> Correct articulation (e.g. ก = เสียงกักที่คอ, ป = ริมฝีปาก)</li>
                                   <li><strong>สระ:</strong> Precise duration map (กะ = สั้น, กา = ยาว)</li>
                                   <li><strong>ตัวสะกด (8 แม่):</strong> Final consonant mapping (กบ → ป, กด → ต)</li>
                                   <li><strong>วรรณยุกต์ (5 เสียง):</strong> Exact Hz shifting for สามัญ, เอก, โท, ตรี, จัตวา</li>
                                   <li><strong>คำเป็น–คำตาย:</strong> Dynamic vitality duration constraint logic.</li>
                                   <li className="text-pink-400 font-bold mt-1"><strong>โหมดร้องเพลง:</strong> รองรับการลากเสียงสระตามโน้ตดนตรีและควบคุม Vibrato ลูกคอ</li>
                                </ul>
                             </div>
                          </div>
                          
                          <div className="flex gap-2 border-b border-[#30363d] pb-3 z-10 relative">
                              <button onClick={() => setTtsMode('Speech')} className={`flex-1 py-1.5 text-[10px] font-bold rounded transition-colors ${ttsMode === 'Speech' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'bg-[#0d1117] text-[#8b949e] border border-[#30363d] hover:text-white'}`}>Speech (พูด)</button>
                              <button onClick={() => setTtsMode('Singing')} className={`flex-1 py-1.5 text-[10px] font-bold rounded transition-colors ${ttsMode === 'Singing' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' : 'bg-[#0d1117] text-[#8b949e] border border-[#30363d] hover:text-white'}`}>Singing (ร้องเพลง)</button>
                          </div>

                          <div className="flex flex-col gap-2 mt-1 relative z-10">
                             <div className="flex justify-between items-center">
                                 <label className="text-[10px] text-[#8b949e] font-bold uppercase">Prompt / Text</label>
                                 {ttsMode === 'Singing' && <span className="text-[9px] text-pink-400 bg-pink-500/10 px-1 border border-pink-500/20 rounded">รองรับโน้ต (e.g. C4)</span>}
                             </div>
                             <textarea 
                                className="w-full bg-[#0d1117] border border-[#30363d] focus:border-purple-500 rounded p-2 text-[11px] text-white resize-none outline-none h-[75px] shadow-inner"
                                value={ttsMode === 'Singing' ? "<note=C4, duration=2>ปะ</note> <note=E4, duration=4>กะ</note> <note=G4, duration=8>ติ</note>" : "ปกติ (ปะ-กะ-ติ)\nฉันรักภาษาไทย"}
                                onChange={() => {}}
                             ></textarea>
                          </div>
                          
                          <div className="flex gap-2 relative z-10">
                             <button className={`flex-1 ${ttsMode === 'Singing' ? 'bg-pink-600 hover:bg-pink-500' : 'bg-purple-600 hover:bg-purple-500'} text-white rounded py-2 text-[11px] font-bold shadow-lg transition-colors flex items-center justify-center gap-2`}>
                                <Mic size={12}/> Generate Offline {ttsMode === 'Singing' ? 'Vocal Track' : 'Audio'}
                             </button>
                             <button className="w-10 bg-[#30363d] hover:bg-[#58a6ff] hover:text-white rounded flex items-center justify-center transition-colors">
                                <Play size={12} fill="currentColor"/>
                             </button>
                          </div>
                          
                          <div className="border-t border-[#30363d] pt-3 mt-1 flex flex-col gap-3 relative z-10">
                             {ttsMode === 'Speech' ? (
                                <>
                                 <SliderControl label="Speech Rate (ความเร็ว)" value={1} max={2} step={0.1} color="#a855f7" />
                                 <SliderControl label="Tone Depth (ทุ้ม/แหลม)" value={0.5} max={1} step={0.01} color="#a855f7" />
                                </>
                             ) : (
                                <>
                                 <SliderControl label="Pitch Correction (จูนเสียง)" value={0.8} max={1} step={0.01} color="#f472b6" />
                                 <SliderControl label="Vibrato Depth (ลูกคอ)" value={0.6} max={1} step={0.01} color="#f472b6" />
                                 <SliderControl label="BPM (ความเร็วเพลง)" value={120} max={200} step={1} color="#f472b6" />
                                </>
                             )}
                          </div>
                       </div>
                    ) : (
                       <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col gap-3 shadow-inner">
                          <h3 className="text-[11px] font-bold text-teal-100 uppercase flex items-center gap-2"><Volume2 size={14} className="text-teal-400"/> Audio Emitter Placement</h3>
                          <div className="border border-[#30363d] rounded-lg p-2 bg-[#050505] text-[10px] text-[#8b949e]">
                             Click in viewport to place localized audio emitters.
                          </div>
                          <SliderControl label="Attenuation Radius" value={3000} max={10000} color="#2dd4bf" unit=" units" />
                          <SliderControl label="Master Volume" value={80} max={100} color="#99f6e4" unit="%" />
                       </div>
                    )}
                 </div>
              )}

              {/* PHYSICS MODE */}
              {activeTab === 'Physics' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl shadow-inner flex flex-col gap-4">
                       <h3 className="text-[11px] font-bold text-red-100 uppercase flex items-center justify-between border-b border-[#30363d] pb-2">
                          <span className="flex items-center gap-2"><Orbit size={14} className="text-red-400"/> Rigid Body Physics</span>
                          <button onClick={() => setPhysicsSimulating(!physicsSimulating)} className={`px-2 py-1 rounded text-[9px] font-bold ${physicsSimulating ? 'bg-red-500 text-white' : 'bg-[#21262d] text-[#8b949e] border border-[#30363d]'}`}>
                             {physicsSimulating ? 'SIMULATING' : 'START SIM'}
                          </button>
                       </h3>
                       
                       <div className="grid grid-cols-2 gap-2">
                          <button className="py-2 bg-[#21262d] border border-[#30363d] hover:border-red-500/50 rounded flex flex-col items-center gap-1 text-[10px] text-[#c9d1d9] transition-colors"><BoxIcon size={16} className="text-red-400"/> Add Ragdoll</button>
                          <button className="py-2 bg-[#21262d] border border-[#30363d] hover:border-red-500/50 rounded flex flex-col items-center gap-1 text-[10px] text-[#c9d1d9] transition-colors"><Flag size={16} className="text-red-400"/> Cloth Sim</button>
                          <button className="py-2 bg-[#21262d] border border-[#30363d] hover:border-red-500/50 rounded flex flex-col items-center gap-1 text-[10px] text-[#c9d1d9] transition-colors"><Bomb size={16} className="text-red-400"/> Destruction</button>
                          <button className="py-2 bg-[#21262d] border border-[#30363d] hover:border-red-500/50 rounded flex flex-col items-center gap-1 text-[10px] text-[#c9d1d9] transition-colors"><Waves size={16} className="text-red-400"/> Fluid Sim</button>
                       </div>
                       <SliderControl label="Global Gravity" value={9.81} max={20} step={0.1} color="#f87171" unit=" m/s²" />
                    </div>
                 </div>
              )}

              {/* NAVIGATION MODE */}
              {activeTab === 'Navigation' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl shadow-inner flex flex-col gap-4">
                       <h3 className="text-[11px] font-bold text-indigo-200 uppercase flex items-center justify-between border-b border-[#30363d] pb-2">
                          <span className="flex items-center gap-2"><Compass size={14} className="text-indigo-400"/> NavMesh Bounds Volume</span>
                       </h3>
                       <div className="grid grid-cols-2 gap-2">
                          <button className="py-2 bg-indigo-500/10 border border-indigo-500/50 hover:bg-indigo-500/30 rounded flex flex-col items-center gap-1 text-[10px] text-indigo-200 transition-colors"><Plus size={16}/> Build NavMesh</button>
                          <button className="py-2 bg-[#21262d] border border-[#30363d] hover:border-indigo-500/50 rounded flex flex-col items-center gap-1 text-[10px] text-[#c9d1d9] transition-colors"><RotateCcw size={16} className="text-indigo-400"/> Clear NavMesh</button>
                       </div>
                       
                       <SliderControl label="Agent Radius" value={40} max={100} color="#818cf8" unit="cm" />
                       <SliderControl label="Agent Height" value={180} max={300} color="#818cf8" unit="cm" />
                       <SliderControl label="Max Slope Angle" value={45} max={90} color="#818cf8" unit="°" />
                    </div>
                 </div>
              )}

              {/* LIGHTING MODE (PRO TOOL) */}
              {activeTab === 'Lighting' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl shadow-inner flex flex-col gap-4">
                       <h3 className="text-[11px] font-bold text-yellow-100 uppercase flex items-center gap-2 border-b border-[#30363d] pb-2"><Sun size={14} className="text-yellow-400"/> Global Illumination</h3>
                       
                       <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-[#8b949e]">Time of Day (Sun Angle)</span>
                          <div className="flex items-center gap-3">
                             <input type="range" min={0} max={24} step={0.1} value={timeOfDay} onChange={(e) => setTimeOfDay(parseFloat(e.target.value))} className="flex-1 accent-yellow-400 h-1 bg-[#30363d] rounded-full appearance-none outline-none" />
                             <div className="w-10 text-right text-[11px] font-mono text-yellow-400">{Math.floor(timeOfDay)}:{(timeOfDay % 1 * 60).toString().padStart(2, '0')}</div>
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between border-t border-[#30363d] pt-3">
                          <span className="text-[11px] font-bold text-white">Volumetric Fog</span>
                          <ToggleSwitch active={volumetricFog} onChange={setVolumetricFog} color="#facc15" />
                       </div>
                       
                       <SliderControl label="Light Bounces (Lumen)" value={lightBounces} max={12} color="#facc15" onChange={setLightBounces} unit=" bounces" />
                    </div>
                 </div>
              )}

              {/* GEOMETRY MODE (PRO TOOL) */}
              {activeTab === 'Geometry' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl shadow-inner flex flex-col gap-4">
                       <h3 className="text-[11px] font-bold text-amber-100 uppercase flex items-center gap-2 border-b border-[#30363d] pb-2"><BoxIcon size={14} className="text-amber-400"/> Pro Geometry</h3>
                       
                       <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => setGeoOp('Extrude')} className={`py-2 rounded text-[11px] font-bold transition-all flex justify-center items-center gap-2 border ${geoOp === 'Extrude' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-white'}`}><ChevronUp size={12}/> Extrude</button>
                          <button onClick={() => setGeoOp('Bevel')} className={`py-2 rounded text-[11px] font-bold transition-all flex justify-center items-center gap-2 border ${geoOp === 'Bevel' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-white'}`}><Link size={12}/> Bevel</button>
                          <button onClick={() => setGeoOp('Boolean')} className={`py-2 rounded text-[11px] font-bold transition-all flex justify-center items-center gap-2 border ${geoOp === 'Boolean' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-white'}`}><Combine size={12}/> Boolean</button>
                          <button onClick={() => setGeoOp('Cut')} className={`py-2 rounded text-[11px] font-bold transition-all flex justify-center items-center gap-2 border ${geoOp === 'Cut' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-white'}`}><Scissors size={12}/> Cut</button>
                       </div>
                       
                       <div className="bg-[#050505] p-3 rounded border border-[#30363d] text-[10px] text-[#8b949e]">
                          Select faces, edges, or vertices in the viewport to apply geometry operations. Destructive workflow enabled.
                       </div>
                    </div>
                 </div>
              )}

              {/* CINEMATICS MODE (PRO TOOL) */}
              {activeTab === 'Cinematics' && (
                 <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-left-4">
                    <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl shadow-inner flex flex-col gap-4">
                       <h3 className="text-[11px] font-bold text-rose-100 uppercase flex items-center gap-2 border-b border-[#30363d] pb-2"><Clapperboard size={14} className="text-rose-400"/> Sequencer & Camera</h3>
                       
                       <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-[#8b949e]">Master Framerate</span>
                          <div className="flex gap-1 bg-[#21262d] p-1 rounded-md border border-[#30363d]">
                             {[24, 30, 60, 120].map(fps => (
                                <button key={fps} onClick={() => setFrameRate(fps)} className={`flex-1 py-1 text-[10px] rounded font-bold transition-all ${frameRate ===fps ? 'bg-rose-500 text-white' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}>{fps}</button>
                             ))}
                          </div>
                       </div>
                       
                       <SliderControl label="Lens Focal Length (mm)" value={cinematicFocal} max={200} color="#fb7185" onChange={setCinematicFocal} />
                       
                       <button className="py-2 bg-rose-500/10 border border-rose-500/50 hover:bg-rose-500/30 rounded text-rose-400 font-bold text-[11px] transition-all flex items-center justify-center gap-2 mt-2">
                          <Plus size={14}/> Add Camera Track
                       </button>
                    </div>
                 </div>
              )}
           </div>
        </div>

        {/* Viewport Center */}
        <div className="flex-1 bg-[#000] relative flex flex-col overflow-hidden outline-none" tabIndex={0}>
           
           {/* Viewport Toolbar Overlay */}
           <div className="absolute top-2 left-2 right-2 flex justify-between pr-4 pl-0 pointer-events-none z-10 text-[11px]">
              
              {/* Left Side: View modes */}
              <div className="flex gap-2 pointer-events-auto items-start drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
                 <div className="flex bg-[#161b22]/95 backdrop-blur-md border border-[#30363d] rounded text-white shadow-xl">
                    <button className="px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white flex items-center gap-2 border-r border-[#30363d] font-bold tracking-wide"><Camera size={12}/> Perspective</button>
                    <div className="relative group/view">
                       <button className="px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white flex items-center gap-2 font-bold tracking-wide text-[#e3b341]">{viewportMode} <ChevronDown size={12}/></button>
                    </div>
                    <button className="px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white flex items-center gap-2 border-l border-[#30363d] font-bold tracking-wide"><Eye size={12}/> Show <ChevronDown size={12}/></button>
                 </div>
                 
                 {/* PCG specific viewport toggle if active */}
                 {activeTab === 'PCG' && (
                     <div className="flex bg-[#a371f7]/20 border border-[#a371f7]/50 rounded text-[#d6bdfb] shadow-[0_0_10px_rgba(163,113,247,0.3)] backdrop-blur">
                        <button className="px-3 py-1.5 font-bold flex items-center justify-center"><Workflow size={12} className="mr-2"/> View PCG Debug Data</button>
                     </div>
                 )}
              </div>

              {/* Center: Transform Tools */}
              <div className="flex gap-1 pointer-events-auto bg-[#161b22]/95 backdrop-blur-md border border-[#30363d] rounded p-1 shadow-xl drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] items-center">
                 <button onClick={()=>setTransformMode('Translate')} className={`p-1.5 rounded transition-colors ${transformMode==='Translate' ? 'bg-[#58a6ff] text-white shadow-[0_0_10px_rgba(88,166,255,0.5)]' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}><Move3D size={16}/></button>
                 <button onClick={()=>setTransformMode('Rotate')} className={`p-1.5 rounded transition-colors ${transformMode==='Rotate' ? 'bg-[#e3b341] text-black shadow-[0_0_10px_rgba(227,179,65,0.5)]' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}><RefreshCw size={16}/></button>
                 <button onClick={()=>setTransformMode('Scale')} className={`p-1.5 rounded transition-colors ${transformMode==='Scale' ? 'bg-[#3fb950] text-white shadow-[0_0_10px_rgba(63,185,80,0.5)]' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}><Maximize2 size={16}/></button>
                 
                 <div className="w-px h-5 bg-[#30363d] mx-1"></div>
                 
                 <button onClick={()=>setCoordSpace(coordSpace === 'World' ? 'Local' : 'World')} className="px-3 py-1 hover:bg-[#30363d] rounded text-[#c9d1d9] hover:text-white flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                    <Globe size={14} className="text-[#58a6ff]"/> {coordSpace}
                 </button>

                 <div className="w-px h-5 bg-[#30363d] mx-1"></div>

                 <div className="flex items-center">
                    <button onClick={()=>setGridSnap(!gridSnap)} className={`p-1.5 rounded-l transition-colors ${gridSnap ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}><Grid size={14}/></button>
                    <select value={gridSize} onChange={(e)=>setGridSize(Number(e.target.value))} className="bg-[#21262d] text-white font-mono text-[10px] outline-none hover:bg-[#30363d] py-1.5 px-1 mr-1 appearance-none w-10 text-center cursor-pointer font-bold">
                       <option value={1}>1</option>
                       <option value={5}>5</option>
                       <option value={10}>10</option>
                       <option value={50}>50</option>
                       <option value={100}>100</option>
                    </select>

                    <button onClick={()=>setAngleSnap(!angleSnap)} className={`p-1.5 rounded-l transition-colors ${angleSnap ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'}`}><RotateCcw size={14}/></button>
                     <select value={angleSize} onChange={(e)=>setAngleSize(Number(e.target.value))} className="bg-[#21262d] text-white font-mono text-[10px] outline-none hover:bg-[#30363d] rounded-r py-1.5 px-1 font-bold appearance-none w-10 text-center cursor-pointer">
                       <option value={5}>5°</option>
                       <option value={10}>10°</option>
                       <option value={15}>15°</option>
                       <option value={45}>45°</option>
                       <option value={90}>90°</option>
                    </select>
                 </div>
              </div>

              {/* Right: Camera Speed */}
              <div className="flex pointer-events-auto bg-[#161b22]/95 backdrop-blur-md border border-[#30363d] rounded items-center px-3 py-1.5 shadow-xl drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] gap-3 text-white">
                 <Camera size={14} className="text-[#8b949e]"/>
                 <input type="range" min="1" max="8" value={cameraSpeed} onChange={(e)=>setCameraSpeed(Number(e.target.value))} className="w-20 accent-white h-1.5 bg-[#050505] appearance-none rounded-full"/>
                 <span className="font-mono text-[11px] font-bold w-4">{cameraSpeed}</span>
              </div>
           </div>

           {/* 3D Environment Mockup Render Area */}
           <div ref={viewportRef} className={`absolute inset-0 z-0 flex items-center justify-center overflow-hidden transition-colors duration-1000 ${isDragOverViewport ? 'ring-4 ring-pink-500/50 inset-2 rounded-2xl bg-pink-500/5' : ''}`}
                onDragOver={(e) => {
                   e.preventDefault();
                   setIsDragOverViewport(true);
                }}
                onDragLeave={() => setIsDragOverViewport(false)}
                onDrop={(e) => {
                   e.preventDefault();
                   setIsDragOverViewport(false);
                   const id = e.dataTransfer.getData('text/plain');
                   if (id) setTerrainMaterial(id);
                }}
                onMouseDown={(e) => {
                  if (activeTab === 'Smart AI' || e.button === 2) {
                     e.preventDefault();
                     if (!viewportRef.current) return;
                     const rect = viewportRef.current.getBoundingClientRect();
                     const x = e.clientX - rect.left;
                     const y = e.clientY - rect.top;

                     if (e.button === 2) {
                        setContextMenu({ x, y });
                        setIsMarqueeSelecting(false);
                     } else if (e.button === 0) {
                        setContextMenu(null);
                        setIsMarqueeSelecting(true);
                        setSelectionBox({ x, y, w: 0, h: 0 });
                        setAiResultBox(null);
                     }
                  } else {
                     setContextMenu(null);
                     setAiResultBox(null);
                     setSelectionBox(null);
                  }
                }}
                onMouseMove={(e) => {
                  if (isMarqueeSelecting && selectionBox && viewportRef.current) {
                     const rect = viewportRef.current.getBoundingClientRect();
                     const x = e.clientX - rect.left;
                     const y = e.clientY - rect.top;
                     setSelectionBox({
                        ...selectionBox,
                        w: x - selectionBox.x,
                        h: y - selectionBox.y
                     });
                  }
                }}
                onMouseUp={() => {
                  if (isMarqueeSelecting) {
                     setIsMarqueeSelecting(false);
                     if (selectionBox && Math.abs(selectionBox.w) > 30 && Math.abs(selectionBox.h) > 30) {
                        setAiResultBox(selectionBox);
                     }
                  }
                }}
                onContextMenu={(e) => e.preventDefault()}
                style={{ 
                   background: timeOfDay < 6 || timeOfDay > 19 ? 'linear-gradient(to bottom, #050a1f, #1a2f4c, #112233)' : 'linear-gradient(to bottom, #1a4f8c, #467fac, #9cb2a3)',
                   // Ensure inner elements don't get the filter directly if it breaks layout tools
                }}>
              
              <div className="absolute inset-0 pointer-events-none" style={{ filter: `brightness(${0.4 + (timeOfDay/24) * 1.5}) hue-rotate(${(timeOfDay - 12) * 5}deg)` }}>
              {/* Sky Elements / Atmosphere */}
              {timeOfDay > 6 && timeOfDay < 19 && (
                 <div className="absolute top-[10%] left-[60%] w-[400px] h-[400px] bg-yellow-200 rounded-full blur-[120px] opacity-70 pointer-events-none mix-blend-screen" style={{transform: `translateX(${(timeOfDay-12)*100}px)`}}></div>
              )}
              {timeOfDay > 18 && timeOfDay < 20 && (
                 <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-orange-600/40 to-transparent pointer-events-none mix-blend-overlay"></div>
              )}
              {timeOfDay < 6 || timeOfDay > 19 && (
                 <div className="absolute top-[15%] left-[30%] w-48 h-48 bg-blue-100/30 rounded-full blur-[20px] pointer-events-none shadow-[0_0_100px_rgba(255,255,255,0.2)]"></div>
              )}
              {timeOfDay < 6 || timeOfDay > 19 ? (
                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjgiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjEuNSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iMzUwIiBjeT0iODAiIHI9IjEiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuOSIvPjwvc3ZnPg==')] opacity-60 pointer-events-none mix-blend-screen"></div>
              ): null}

              {/* Landscape Grid Matrix Projection */}
              <div className="absolute bottom-[-15%] w-[300%] h-[150%] bg-transparent perspective-[1200px] [transform-style:preserve-3d] pointer-events-none select-none">
                 
                 {/* Floor Grid */}
                 <div className="w-full h-full border-[2px] [transform:rotateX(78deg)_scale(1.5)] absolute inset-0 origin-bottom transition-colors duration-1000" 
                      style={{
                         borderColor: currentTerrainMaterial ? currentTerrainMaterial.hex : 'rgba(34, 197, 94, 0.2)',
                         backgroundColor: currentTerrainMaterial ? currentTerrainMaterial.hex + '1A' : 'transparent',
                         backgroundImage: `
                           linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 2px),
                           linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 2px)
                         `,
                         backgroundSize: '120px 120px'
                      }}>
                    
                    {/* Landscape Heightmap Visualizer using precise SVG overlay */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible opacity-[0.35] filter blur-[1px] transition-colors duration-1000" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                       {/* Layer 1 */}
                       <path d="M 0,800 Q 200,500 400,700 T 800,600 T 1000,800 L 1000,1000 L 0,1000 Z" fill={currentTerrainMaterial ? currentTerrainMaterial.hex + '66' : "rgba(63,185,80,0.4)"} stroke={currentTerrainMaterial ? currentTerrainMaterial.hex : "#3fb950"} strokeWidth="4"/>
                       {/* Layer 2 */}
                       <path d="M 0,600 Q 300,300 600,600 T 1000,500 L 1000,1000 L 0,1000 Z" fill={currentTerrainMaterial ? currentTerrainMaterial.hex + '26' : "rgba(63,185,80,0.15)"} stroke={currentTerrainMaterial ? currentTerrainMaterial.hex : "#3fb950"} strokeWidth="2"/>
                       {/* Volumetric Fog / Depth approximation inside grid frame */}
                       <rect width="1000" height="1000" fill="url(#fogGrad)" opacity="0.6"/>
                       <defs>
                          <linearGradient id="fogGrad" x1="0" y1="1" x2="0" y2="0">
                             <stop offset="0%" stopColor="#1a2f4c" stopOpacity="0.8"/>
                             <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
                          </linearGradient>
                       </defs>
                    </svg>

                    {/* PCG Point Cloud Render Mockup (Visible in PCG mode) */}
                    {activeTab === 'PCG' && (
                       <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #a371f7 2px, transparent 2px)', backgroundSize: '40px 40px', opacity: 0.6, filter: 'drop-shadow(0 0 5px #a371f7)'}}></div>
                    )}

                    {/* Swarm Mode Network Overlay Matrix */}
                    {activeTab === 'Swarm' && swarmEnabled && (
                       <div className="absolute inset-0">
              {/* Animated hexagon grid proxy */}
              <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"40\\" height=\\"40\\" viewBox=\\"0 0 40 40\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cpath d=\\"M20 0l20 10v20L20 40 0 30V10z\\" fill=\\"none\\" stroke=\\"%23f97316\\" stroke-width=\\"0.5\\" stroke-opacity=\\"0.3\\"/%3E%3C/svg%3E")', backgroundSize: '60px 60px', animation: 'slide 20s linear infinite' }}></div>
           </div>
        )}

        {/* 3D Scene Mockups (Trees / Foliage) */}
        <div className="absolute top-[30%] left-[20%] [transform:rotateX(-80deg)_translateZ(40px)] flex items-center justify-center pointer-events-none transition-colors duration-1000">
           <div className={`w-12 h-12 rounded-full absolute ${season === 'Autumn' ? 'bg-orange-500/50' : season === 'Winter' ? 'bg-white/50' : season === 'Spring' ? 'bg-pink-400/50' : 'bg-green-500/50'} blur-xl`}></div>
           <svg width="40" height="40" viewBox="0 0 24 24" fill={season === 'Autumn' ? '#f97316' : season === 'Winter' ? '#f8fafc' : season === 'Spring' ? '#f472b6' : '#22c55e'} className="relative drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] transition-colors duration-1000">
              <path d="M12 22v-6m-4-6c0-2.209 1.791-4 4-4s4 1.791 4 4c0 1.936-1.385 3.543-3.214 3.903C13.626 12.35 12.836 12 12 12c-.836 0-1.626.35-2.786 1.903C7.385 13.543 6 11.936 6 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 4c-3.314 0-6 2.686-6 6 0 2.828 1.95 5.2 4.57 5.86.38.1.78.18 1.18.23.08.79.18 1.55.25 2.25.07.72.16 1.4.25 2h.5c.09-.6.18-1.28.25-2 .07-.7.17-1.46.25-2.25.4-.05.8-.13 1.18-.23C18.05 15.2 20 12.828 20 10c0-3.314-2.686-6-6-6z" opacity="0.8"/>
           </svg>
        </div>

        <div className="absolute top-[40%] right-[30%] [transform:rotateX(-80deg)_translateZ(30px)] flex items-center justify-center pointer-events-none transition-colors duration-1000 scale-75">
           <div className={`w-12 h-12 rounded-full absolute ${season === 'Autumn' ? 'bg-orange-500/50' : season === 'Winter' ? 'bg-white/50' : season === 'Spring' ? 'bg-pink-400/50' : 'bg-green-500/50'} blur-xl`}></div>
           <svg width="40" height="40" viewBox="0 0 24 24" fill={season === 'Autumn' ? '#ea580c' : season === 'Winter' ? '#e2e8f0' : season === 'Spring' ? '#f472b6' : '#16a34a'} className="relative drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] transition-colors duration-1000">
              <path d="M12 22v-6m-4-6c0-2.209 1.791-4 4-4s4 1.791 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 4c-3.314 0-6 2.686-6 6 0 2.828 1.95 5.2 4.57 5.86C18.05 15.2 20 12.828 20 10c0-3.314-2.686-6-6-6z" opacity="0.9"/>
           </svg>
        </div>

        {/* Snowman (Appears only in winter) */}
        <div className={`absolute top-[45%] left-[35%] [transform:rotateX(-80deg)_translateZ(20px)] flex items-center justify-center pointer-events-none transition-all duration-1000 ${season === 'Winter' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10'}`}>
           <svg width="30" height="30" viewBox="0 0 24 24" fill="#f8fafc" className="drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
              {/* Body */}
              <circle cx="12" cy="16" r="6" />
              <circle cx="12" cy="9" r="4" />
              {/* Hat */}
              <rect x="9" y="4" width="6" height="2" fill="#1e293b"/>
              <rect x="10" y="0" width="4" height="4" fill="#1e293b"/>
              {/* Scarf */}
              <path d="M9 12 Q12 14 15 12 L14 15 L10 15 Z" fill="#ef4444"/>
              {/* Nose */}
              <polygon points="12,8 15,9 12,10" fill="#f97316"/>
              {/* Eyes */}
              <circle cx="10.5" cy="8" r="0.5" fill="#0f172a"/>
              <circle cx="13.5" cy="8" r="0.5" fill="#0f172a"/>
              {/* Buttons */}
              <circle cx="12" cy="14" r="0.5" fill="#0f172a"/>
              <circle cx="12" cy="17" r="0.5" fill="#0f172a"/>
           </svg>
        </div>

        {/* Advanced detailed season overlay takes over this part now */}

        {/* Water Plane Mesh Overlay */}
                    {activeTab === 'Water' && (
                       <svg className="absolute inset-0 w-full h-full opacity-60 transition-all duration-700" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                          <path d="M 300,500 Q 500,450 700,500 T 1000,550 L 1000,1000 L 300,1000 Z" 
                                fill={waterTool === 'Lava' ? '#ea580c' : waterTool === 'Acid' ? '#84cc16' : waterTool === 'Swamp' ? '#4d7c0f' : '#0ea5e9'} 
                                opacity="0.4" filter="blur(10px)"/>
                          <path d="M 300,500 Q 500,450 700,500 T 1000,550" fill="none" 
                                stroke={waterTool === 'Lava' ? '#f97316' : waterTool === 'Acid' ? '#bef264' : waterTool === 'Swamp' ? '#65a30d' : '#38bdf8'} 
                                strokeWidth="6" className="animate-pulse duration-1000"/>
                          <path d="M 350,600 Q 550,550 750,600 T 1000,650" fill="none" 
                                stroke={waterTool === 'Lava' ? '#fb923c' : waterTool === 'Acid' ? '#d9f99d' : waterTool === 'Swamp' ? '#a3e635' : '#7dd3fc'} 
                                strokeWidth="3" opacity="0.5"/>
                       </svg>
                    )}
                    {/* Season & Weather Environment Overlays */}
                    {season === 'Winter' && (
                       <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen shadow-[inset_0_0_150px_rgba(255,255,255,0.2)]">
                          {/* Deep Freeze Overlay */}
                          <div className="absolute inset-0 bg-blue-100/5 mix-blend-color-burn"></div>
                          {/* High intensity snow particles */}
                          <div className="absolute inset-0 opacity-80" style={{ 
                             backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48Y2lyY2xlIGN4PSI1IiBjeT0iMTAiIHI9IjEiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuOCIvPjxjaXJjbGUgY3g9IjEwNSIgY3k9IjExMCIgcj0iMS41IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjciLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjEiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==")',
                             backgroundSize: `${200 - weatherIntensity}px ${200 - weatherIntensity}px`,
                             animation: `slide ${100 / windStrength}s linear infinite`,
                             transform: `rotate(${windDirection}deg) scale(1.5)`
                          }}></div>
                          {/* Dense blizzard fog layer */}
                          {weatherIntensity > 60 && (
                             <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent blur-md"></div>
                          )}
                          {/* Frost Vignette */}
                          <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ background: 'radial-gradient(circle, transparent 40%, #ffffff 100%)' }}></div>
                       </div>
                    )}
                    
                    {season === 'Autumn' && (
                       <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen">
                          {/* Warm sunset tonemap */}
                          <div className="absolute inset-0 bg-orange-600/10 mix-blend-color-burn"></div>
                          <div className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay"></div>
                          {/* Falling Autumn Leaves */}
                          <div className="absolute inset-0 opacity-60" style={{
                             backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cGF0aCBkPSJNMTAgMTBDMTUgNSAyMCAxMCAyMCAxNUMxNSAyMCAxMCAxNSAxMCAxMFoiIGZpbGw9IiNlYTU4MGMiIG9wYWNpdHk9IjAuOCIvPjxwYXRoIGQ9Ik01MCA1MEM1NSA0NSA2MCA1MCA2MCA1NUM1NSA2MCA1MCA1NSA1MCA1MFoiIGZpbGw9IiNiNDUzMDkiIG9wYWNpdHk9IjAu الCIvPjwvc3ZnPg==")',
                             backgroundSize: `${150 - (weatherIntensity / 2)}px ${150 - (weatherIntensity / 2)}px`,
                             animation: `slide ${150 / windStrength}s linear infinite`,
                             transform: `rotate(${windDirection}deg) scale(2)`
                          }}></div>
                          {/* Wind Gusts */}
                          {windStrength > 40 && (
                             <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAiPjxyZWN0IHg9IjAiIHk9IjQiIHdpZHRoPSI1MCIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')] animate-pulse" style={{ transform: `rotate(${windDirection}deg)` }}></div>
                          )}
                       </div>
                    )}
                    
                    {season === 'Summer' && (
                       <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen">
                          {/* Heat Haze Warp & Warmth */}
                          <div className="absolute inset-0 bg-yellow-500/10 mix-blend-color-burn backdrop-blur-[1px]"></div>
                          {/* Overbright Sunlight rays */}
                          <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-100/30 rounded-full blur-3xl opacity-60 mix-blend-screen"></div>
                          {/* Lens flare artifact */}
                          <div className="absolute top-[20%] right-[30%] w-32 h-2 bg-yellow-300/20 blur-md [transform:rotate(-45deg)] mix-blend-screen"></div>
                          <div className="absolute top-[30%] right-[40%] w-8 h-8 rounded-full bg-orange-400/20 blur-sm mix-blend-screen"></div>
                          <div className="absolute top-[50%] right-[60%] w-4 h-4 rounded-full bg-green-500/10 blur-[1px] mix-blend-screen"></div>
                          {/* High temp distortion */}
                          {weatherIntensity > 70 && (
                             <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay animate-pulse [animation-duration:0.5s]"></div>
                          )}
                       </div>
                    )}
                    
                    {season === 'Rainy' && (
                       <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                          {/* Gloomy sky tonemap */}
                          <div className="absolute inset-0 bg-blue-900/30 mix-blend-multiply"></div>
                          {/* Heavy Rain Lines */}
                          <div className="absolute inset-0 opacity-60 mix-blend-screen" style={{
                             backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+PHJlY3QgeD0iMTUiIHk9IjAiIHdpZHRoPSIwLjUiIGhlaWdodD0iMjAiIGZpbGw9IiM3ZGRmZjYiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjUiIHk9IjEwIiB3aWR0aD0iMC41IiBoZWlnaHQ9IjE1IiBmaWxsPSIjN2RkZmY2IiBvcGFjaXR5PSIwLDUiLz48L3N2Zz4=")',
                             backgroundSize: `${30 - (weatherIntensity / 10)}px ${30 - (weatherIntensity / 10)}px`,
                             animation: `slide ${30 / windStrength}s linear infinite`,
                             transform: `rotate(${windDirection}deg) scale(1.5)`
                          }}></div>
                          {/* Lightning Flashes */}
                          {weatherIntensity > 50 && (
                             <div className="absolute inset-0 bg-white/20 mix-blend-screen animate-pulse [animation-duration:4s] [animation-iteration-count:infinite] [animation-timing-function:steps(2,end)] opacity-0 shadow-[inset_0_0_100px_rgba(255,255,255,0.3)]" style={{ animationDelay: '2s' }}></div>
                          )}
                          {/* Ground splash ripples (using svg radial gradients) */}
                          <div className="absolute bottom-0 w-full h-1/2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSIyNSI+PGVsbGlwc2UgY3g9IjI1IiBjeT0iMTIiIHJ4PSIxNCIgcnk9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-40 [transform:rotateX(60deg)] animate-pulse [animation-duration:1s]"></div>
                       </div>
                    )}
                    
                    {season === 'Spring' && (
                       <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen">
                          {/* Fresh spring tonemap */}
                          <div className="absolute inset-0 bg-emerald-500/10 mix-blend-color-burn"></div>
                          {/* Glowing pollen & petals */}
                          <div className="absolute inset-0 opacity-70" style={{
                             backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIiBmaWxsPSIjZjQ3MmI2IiBvcGFjaXR5PSIwLjgiIGZpbHRlcj0iYmx1cigxcHgpIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMSIgZmlsbD0iI2Q5Zjc5OSIgb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iODAiIGN5PSIyMCIgcj0iMS41IiBmaWxsPSIjZWFjNTRmIiBvcGFjaXR5PSIwLjciLz48L3N2Zz4=")',
                             backgroundSize: `${100 - (weatherIntensity / 2)}px ${100 - (weatherIntensity / 2)}px`,
                             animation: `slide ${200 / windStrength}s ease-in-out infinite alternate`,
                             transform: `rotate(${windDirection / 2}deg) scale(1.5)`
                          }}></div>
                          {/* Spring blooming lens flash */}
                          <div className="absolute bottom-10 left-10 w-32 h-32 bg-pink-500/10 blur-3xl mix-blend-screen rounded-full animate-pulse [animation-duration:3s]"></div>
                       </div>
                    )}

                    {/* Post Process Volume Overlay */}
                    {bloomEnabled && (
                       <div className="absolute inset-0 pointer-events-none z-10 mix-blend-screen shadow-[inset_0_0_150px_rgba(255,255,255,0.1)]"></div>
                    )}

                    {/* NavMesh Grid Overlay */}
                    {activeTab === 'Navigation' && (
                       <div className="absolute inset-0 pointer-events-none z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0yMCAyMGwyMC0yMG0wIDQwbC0yMC0yMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNDNmMzhjIiBzdHJva2Utb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] mix-blend-screen [transform:rotateX(70deg)_scale(2)] opacity-30"></div>
                    )}

                                       {/* Object Gizmo Render */}
                     <div className="absolute top-[55%] left-[45%] w-32 h-32 bg-[#21262d] border-4 border-gray-400 shadow-[0_50px_100px_rgba(0,0,0,0.9)] [transform:translate(-50%,-50%)_translateZ(80px)_rotateX(-80deg)_rotateZ(15deg)] flex items-center justify-center group cursor-pointer hover:border-[#e3b341] transition-colors rounded-sm">
                        
                       {/* Material proxy preview */}
                       <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>

                       {/* Transform Widget Axis Overlay */}
                       <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                          {transformMode === 'Translate' && (
                             <div className="relative w-full h-full flex items-center justify-center scale-[2]">
                                <div className="absolute w-16 h-[3px] bg-red-500 right-1/2 origin-right translate-x-full shadow-lg"></div>{/* X */}
                                <div className="absolute w-[3px] h-16 bg-blue-500 bottom-1/2 origin-bottom translate-y-full shadow-lg"></div>{/* Y */}
                                <div className="absolute w-[3px] h-20 bg-green-500 bottom-1/2 origin-bottom [transform:rotate(45deg)_translateY(-10px)] shadow-lg"></div>{/* Z mock projection */}
                                <div className="w-4 h-4 bg-white rounded-full border border-gray-400 z-10 shadow-lg"></div>
                             </div>
                          )}
                          {transformMode === 'Rotate' && (
                             <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-2 border-red-500/80 [transform:rotateX(60deg)] p-2 shadow-lg hover:border-red-400">
                                <div className="w-full h-full rounded-full border-2 border-green-500/80 [transform:rotateY(60deg)] absolute shadow-lg"></div>
                                <div className="w-full h-full rounded-full border-[3px] border-blue-500 absolute shadow-lg hover:border-blue-400"></div>
                             </div>
                          )}
                          {transformMode === 'Scale' && (
                             <div className="relative w-full h-full flex items-center justify-center scale-[2]">
                                <div className="absolute w-16 h-[3px] bg-red-500 right-1/2 origin-right translate-x-full border-r-[8px] border-red-500 shadow-lg"></div>
                                <div className="absolute w-[3px] h-16 bg-blue-500 bottom-1/2 origin-bottom translate-y-full border-b-[8px] border-blue-500 shadow-lg"></div>
                                <div className="absolute w-[3px] h-20 bg-green-500 bottom-1/2 origin-bottom [transform:rotate(45deg)_translateY(-10px)] border-t-[8px] border-green-500 shadow-lg"></div>
                                <div className="w-4 h-4 bg-white border border-gray-400 shadow-lg z-10"></div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
              </div>

              {/* Brush Overlay (Visible if in Landscape or Paint Mode) */}
              {(activeTab === 'Landscape' || activeTab === 'Paint') && (
                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-[0_0_50px_rgba(88,166,255,0.4)] pointer-events-none mix-blend-screen [transform:rotateX(75deg)] transition-all ease-out duration-75 flex items-center justify-center ${activeTab==='Paint' ? 'border-pink-500/80 bg-pink-500/10' : 'border-[#58a6ff]/80 bg-[#58a6ff]/10'}`} 
                      style={{width: brushSize*1.5, height: brushSize*1.5}}>
                    <div className={`w-[80%] h-[80%] rounded-full border-2 absolute border-dashed rotate-45 animate-spin-slow ${activeTab==='Paint' ? 'border-pink-500/40' : 'border-[#58a6ff]/40'}`}></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                 </div>
              )}

              {/* Advanced Viewport Info Watermarks */}
              <div className="absolute top-16 left-4 flex flex-col gap-1 text-[11px] font-bold text-white/50 pointer-events-none drop-shadow-md z-10 select-none uppercase tracking-widest">
                 <span>Preview Level: Sector_Alpha</span>
                 <span className="text-[#3fb950]/80">Lighting: Lumen Hardware Raytracing</span>
                 <span className="text-[#58a6ff]/80">Nanite: Active (42 Meshes)</span>
                 <span className="text-pink-400/80 transition-colors duration-1000" style={{ color: currentTerrainMaterial ? currentTerrainMaterial.hex : undefined }}>Physical Surface: {currentTerrainMaterial ? currentTerrainMaterial.name : 'Default Proxy'}</span>
              </div>

              {/* Status Text overlay bottom left of viewport */}
              <div className="absolute bottom-8 left-4 flex flex-col gap-1 text-[11px] font-mono text-[#c9d1d9] pointer-events-none drop-shadow-[0_2px_2px_rgba(0,0,0,1)] z-10 bg-black/40 p-2 rounded backdrop-blur">
                 <span><span className="text-white font-bold">FPS: </span><span className="text-[#3fb950] font-bold">119.9</span> (8.32ms)</span>
                 <span><span className="text-white font-bold">GPU: </span>14.2ms | <span className="text-white font-bold">Draw: </span> 1.2ms | <span className="text-white font-bold">Game: </span> 0.9ms</span>
                 <span><span className="text-white font-bold">Polys: </span> 3.2M | <span className="text-white font-bold">Draw Calls: </span> 420</span>
                 <div className="w-full h-px bg-white/20 my-1"></div>
                 <span><Target size={10} className="inline mr-1 text-[#58a6ff]"/> <span className="text-red-400">X: 1423.5</span> <span className="text-green-400">Y: -402.1</span> <span className="text-blue-400">Z: 204.0</span></span>
              </div>

              {/* Smart AI / Selection Overlays */}
              {activeTab === 'Smart AI' && selectionBox && isMarqueeSelecting && (
                 <div 
                    className="absolute border-2 border-purple-500/80 bg-purple-500/20 pointer-events-none z-30 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-75"
                    style={{
                       left: Math.min(selectionBox.x, selectionBox.x + selectionBox.w),
                       top: Math.min(selectionBox.y, selectionBox.y + selectionBox.h),
                       width: Math.abs(selectionBox.w),
                       height: Math.abs(selectionBox.h)
                    }}
                 >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0icmdiYSgxNjgsIDg1LCAyNDcsIDAuNCkiLz48L3N2Zz4=')] opacity-50"></div>
                 </div>
              )}

              {activeTab === 'Smart AI' && aiResultBox && (
                 <div 
                    className="absolute pointer-events-auto bg-[#0d1117]/95 backdrop-blur-xl border border-purple-500/50 rounded-xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-40 flex flex-col gap-3 min-w-[320px] isolate"
                    style={{
                       left: Math.min(aiResultBox.x, aiResultBox.x + aiResultBox.w) + Math.abs(aiResultBox.w) / 2,
                       top: Math.min(aiResultBox.y, aiResultBox.y + aiResultBox.h) + Math.abs(aiResultBox.h) + 10,
                       transform: 'translateX(-50%)'
                    }}
                 >
                    <div className="absolute inset-0 bg-purple-500/5 rounded-xl pointer-events-none -z-10"></div>
                    <div className="flex items-center justify-between">
                       <span className="text-[11px] font-bold text-purple-400 flex items-center gap-1.5 uppercase tracking-widest"><Sparkles size={12}/> AI Generation</span>
                       <button onClick={() => { setAiResultBox(null); setSelectionBox(null); }} className="text-[#8b949e] hover:text-white"><X size={14}/></button>
                    </div>
                    
                    {isAiGenerating ? (
                       <div className="flex flex-col items-center justify-center py-4 gap-3">
                          <Brain size={24} className="text-purple-400 animate-pulse" />
                          <span className="text-[11px] text-[#8b949e] font-mono animate-pulse">Generating Area Layout...</span>
                       </div>
                    ) : (
                       <>
                          <textarea 
                             autoFocus
                             value={aiPrompt}
                             onChange={(e) => setAiPrompt(e.target.value)}
                             placeholder="E.g. generate a dense pine forest with a small cabin..."
                             className="w-full bg-[#050505] border border-[#30363d] rounded-lg p-2 text-[12px] text-white resize-none h-16 outline-none focus:border-purple-500/50 focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all custom-scrollbar"
                          ></textarea>
                          <div className="flex justify-end gap-2">
                             <button onClick={() => { setAiResultBox(null); setSelectionBox(null); }} className="px-3 py-1.5 text-[11px] font-bold text-[#8b949e] hover:text-white transition-colors">Cancel</button>
                             <button 
                                onClick={() => {
                                   if (!aiPrompt.trim()) return;
                                   setIsAiGenerating(true);
                                   setAiHistory([aiPrompt, ...aiHistory].slice(0, 5));
                                   setTimeout(() => {
                                      setIsAiGenerating(false);
                                      setAiResultBox(null);
                                      setSelectionBox(null);
                                      setAiPrompt("");
                                   }, 2000);
                                }}
                                className="px-4 py-1.5 bg-purple-500 hover:bg-purple-400 text-white text-[11px] font-bold rounded flex items-center gap-2 shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all"
                             ><Wand2 size={12}/> Generate</button>
                          </div>
                       </>
                    )}
                 </div>
              )}

              {/* Context Menu Mockup */}
              {contextMenu && (
                 <div
                    className="absolute pointer-events-auto bg-[#161b22]/95 backdrop-blur-md border border-[#30363d] rounded-lg shadow-2xl z-50 py-1 min-w-[200px] flex flex-col"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                 >
                    <span className="text-[9px] font-bold text-[#8b949e] px-3 py-1 uppercase tracking-widest border-b border-[#30363d] mb-1">Local AI Assist</span>
                    <button 
                       onClick={() => {
                          setActiveTab('Smart AI');
                          setAiResultBox({ x: contextMenu.x, y: contextMenu.y, w: 200, h: 50 });
                          setContextMenu(null);
                       }} 
                       className="w-full text-left px-4 py-1.5 text-[11px] text-[#c9d1d9] hover:bg-purple-500/20 hover:text-purple-400 flex items-center gap-2 font-bold transition-all"
                    ><Brain size={12}/> AI: Smart Select Here</button>
                    <button onClick={() => setContextMenu(null)} className="w-full text-left px-4 py-1.5 text-[11px] text-[#c9d1d9] hover:bg-purple-500/20 hover:text-purple-400 flex items-center gap-2 font-bold transition-all"><Database size={12}/> AI: Texture Gen (SDXL)</button>
                    <button onClick={() => setContextMenu(null)} className="w-full text-left px-4 py-1.5 text-[11px] text-[#c9d1d9] hover:bg-purple-500/20 hover:text-purple-400 flex items-center gap-2 font-bold transition-all"><Hammer size={12}/> AI: Auto-NavMesh Block</button>

                    <div className="w-full h-px bg-[#30363d] my-1"></div>
                    <span className="text-[9px] font-bold text-[#8b949e] px-3 py-1 uppercase tracking-widest border-b border-[#30363d] mb-1">Pro Geometry</span>
                    <button onClick={() => { setActiveTab('Geometry'); setContextMenu(null); }} className="w-full text-left px-4 py-1.5 text-[11px] text-[#c9d1d9] hover:bg-amber-500/20 hover:text-amber-400 flex items-center gap-2 transition-all"><BoxIcon size={12}/> Insert Primitive</button>
                    <button onClick={() => { setActiveTab('Geometry'); setContextMenu(null); }} className="w-full text-left px-4 py-1.5 text-[11px] text-[#c9d1d9] hover:bg-amber-500/20 hover:text-amber-400 flex items-center gap-2 transition-all"><Scissors size={12}/> Slice Tool</button>

                    <div className="w-full h-px bg-[#30363d] my-1"></div>
                    <button onClick={() => setContextMenu(null)} className="w-full text-left px-4 py-1.5 text-[11px] text-[#c9d1d9] hover:bg-[#30363d] hover:text-white flex items-center gap-2 transition-all"><Plus size={12}/> Spawn Actor Here</button>
                    <button onClick={() => setContextMenu(null)} className="w-full text-left px-4 py-1.5 text-[11px] text-[#c9d1d9] hover:bg-[#30363d] hover:text-white flex items-center gap-2 transition-all"><Sun size={12}/> Place Light Probe</button>
                    <button onClick={() => setContextMenu(null)} className="w-full text-left px-4 py-1.5 text-[11px] text-[#c9d1d9] hover:bg-[#30363d] hover:text-white flex items-center gap-2 transition-all"><Copy size={12}/> Copy Location</button>
                 </div>
              )}

           </div>

           {/* Content Drawer Button at Bottom */}
           <button 
              onClick={() => setIsContentDrawerOpen(!isContentDrawerOpen)}
              className="absolute bottom-0 inset-x-0 h-6 bg-[#161b22]/90 backdrop-blur border-t border-[#30363d] flex items-center justify-center text-[10px] font-bold text-[#8b949e] hover:text-white hover:bg-[#58a6ff]/20 transition-all z-40 group cursor-pointer"
           >
              Content Drawer <span className="ml-2 px-1 bg-[#0d1117] rounded border border-[#30363d] text-[9px] group-hover:border-[#58a6ff] shadow-inner transition-colors">Ctrl+Space</span>
           </button>

           {/* Procedural Asset Studio Modal */}
           {isAssetStudioOpen && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
                 <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl w-[800px] h-[600px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8">
                    <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-6 shrink-0 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-32 h-full bg-[#a371f7]/20 blur-[30px] pointer-events-none"></div>
                       <h2 className="text-[14px] font-bold text-white flex items-center gap-3 relative z-10">
                          <Hammer size={18} className="text-[#a371f7]"/> Procedural Asset Studio (PCG Model Gen)
                       </h2>
                       <button onClick={() => setIsAssetStudioOpen(false)} className="text-[#8b949e] hover:text-white transition-colors"><X size={18}/></button>
                    </div>
                    
                    <div className="flex-1 flex overflow-hidden">
                       {/* Left Sidebar (Settings) */}
                       <div className="w-[280px] bg-[#161b22] border-r border-[#30363d] p-5 flex flex-col gap-6 overflow-y-auto custom-scrollbar shrink-0">
                          <div className="flex flex-col gap-2">
                             <label className="text-[11px] font-bold text-[#8b949e] uppercase">Theme / Style</label>
                             <input 
                               type="text" 
                               value={assetStudioTheme}
                               onChange={(e) => setAssetStudioTheme(e.target.value)}
                               className="bg-[#0d1117] border border-[#30363d] rounded-lg p-2 text-white text-[12px] focus:outline-none focus:border-[#a371f7] transition-colors"
                             />
                          </div>

                          <div className="flex flex-col gap-2">
                             <label className="text-[11px] font-bold text-[#8b949e] uppercase">Prop Categories</label>
                             <div className="flex flex-col gap-1.5">
                                <label className="flex items-center gap-2 text-[12px] text-white cursor-pointer"><input type="checkbox" defaultChecked className="accent-[#a371f7]"/> Structural Ruins</label>
                                <label className="flex items-center gap-2 text-[12px] text-white cursor-pointer"><input type="checkbox" defaultChecked className="accent-[#a371f7]"/> Debris & Rubble</label>
                                <label className="flex items-center gap-2 text-[12px] text-white cursor-pointer"><input type="checkbox" className="accent-[#a371f7]"/> Flora Overgrowth</label>
                             </div>
                          </div>

                          <div className="flex flex-col gap-2 mt-auto">
                             <button 
                                onClick={generateProceduralAssets} 
                                disabled={isGeneratingAssets}
                                className="w-full bg-[#a371f7] hover:bg-[#b084f8] disabled:bg-[#30363d] disabled:text-[#8b949e] text-white py-3 rounded-xl font-bold text-[12px] shadow-[0_0_20px_rgba(163,113,247,0.3)] transition-all flex items-center justify-center gap-2 group"
                             >
                                {isGeneratingAssets ? (
                                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                   <><Sparkles size={16} className="group-hover:animate-pulse"/> Generate Mesh Set</>
                                )}
                             </button>
                          </div>
                       </div>

                       {/* Right Area (Results) */}
                       <div className="flex-1 bg-[#050505] p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                             <h3 className="text-[12px] font-bold text-[#c9d1d9]">Generated Assets</h3>
                             {generatedProps.length > 0 && <span className="text-[11px] text-[#8b949e] bg-[#21262d] px-2 py-1 rounded-md">{generatedProps.length} Results</span>}
                          </div>
                          
                          {generatedProps.length === 0 ? (
                             <div className="flex-1 flex flex-col items-center justify-center text-[#8b949e] gap-3">
                                {isGeneratingAssets ? (
                                   <>
                                      <div className="w-10 h-10 border-4 border-[#30363d] border-t-[#a371f7] rounded-full animate-spin"></div>
                                      <span className="text-[12px] animate-pulse">Running PCG algorithms...</span>
                                   </>
                                ) : (
                                   <>
                                      <Box size={40} className="opacity-20" />
                                      <span className="text-[12px]">Ready to generate. Click Generate to start.</span>
                                   </>
                                )}
                             </div>
                          ) : (
                             <div className="grid grid-cols-2 gap-4">
                                {generatedProps.map((prop) => (
                                   <div key={prop.id} className="bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col overflow-hidden hover:border-[#a371f7] hover:shadow-[0_0_20px_rgba(163,113,247,0.2)] transition-all cursor-pointer group">
                                      <div className={`h-32 ${prop.color}/20 flex items-center justify-center relative overflow-hidden bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-blend-soft-light`}>
                                         <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent"></div>
                                         <div className={`w-16 h-16 rounded-lg ${prop.color} rotate-12 shadow-2xl relative z-10 group-hover:rotate-6 transition-transform flex items-center justify-center`}>
                                            <Box size={24} className="text-white/50" />
                                         </div>
                                      </div>
                                      <div className="p-3 flex flex-col gap-2">
                                         <span className="text-[12px] font-bold text-white truncate group-hover:text-[#a371f7] transition-colors">{prop.name}</span>
                                         <div className="flex items-center justify-between border-t border-[#30363d] pt-2">
                                            <span className="text-[10px] text-[#8b949e] bg-[#0d1117] px-2 py-0.5 rounded font-mono">{prop.type}</span>
                                            <span className="text-[10px] text-[#8b949e] font-mono">{prop.polyCount} Polys</span>
                                         </div>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {/* Network Simulator Modal */}
           {isNetSimOpen && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
                 <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl w-[900px] h-[600px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8">
                    <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-6 shrink-0 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-32 h-full bg-blue-500/20 blur-[30px] pointer-events-none"></div>
                       <h2 className="text-[14px] font-bold text-white flex items-center gap-3 relative z-10">
                          <Activity size={18} className="text-blue-400"/> Network Latency Debugger & Packet Loss Graph
                       </h2>
                       <button onClick={() => setIsNetSimOpen(false)} className="text-[#8b949e] hover:text-white transition-colors"><X size={18}/></button>
                    </div>
                    
                    <div className="flex-1 flex overflow-hidden">
                       {/* Left Sidebar (Settings) */}
                       <div className="w-[300px] bg-[#161b22] border-r border-[#30363d] p-5 flex flex-col gap-6 overflow-y-auto custom-scrollbar shrink-0">
                          <div className="flex flex-col gap-2">
                             <label className="text-[11px] font-bold text-[#8b949e] uppercase">Target Environment</label>
                             <div className="flex bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
                                 <button className="flex-1 py-1.5 text-[11px] bg-blue-500 text-white rounded font-bold shadow-md">WAN / Cloud</button>
                                 <button className="flex-1 py-1.5 text-[11px] text-[#8b949e] hover:text-white rounded font-bold">LAN (Swarm)</button>
                             </div>
                          </div>

                          <div className="flex flex-col gap-3 mt-2">
                             <label className="text-[11px] font-bold text-[#8b949e] uppercase border-b border-[#30363d] pb-2">Inject Network Faults</label>
                             <SliderControl label="Base Latency (ms)" value={80} max={1000} color="#3b82f6" />
                             <SliderControl label="Jitter Variance" value={45} max={200} color="#3b82f6" />
                             <SliderControl label="Packet Loss Rate" value={15} max={100} unit="%" color="#f43f5e" />
                          </div>

                          <div className="flex flex-col gap-2 mt-auto border-t border-[#30363d] pt-4">
                             <button 
                                onClick={startNetworkSimulation} 
                                disabled={isSimulatingLatency}
                                className={`w-full py-3 rounded-xl font-bold text-[12px] transition-all flex items-center justify-center gap-2 group ${isSimulatingLatency ? 'bg-[#30363d] text-[#8b949e]' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'}`}
                             >
                                {isSimulatingLatency ? (
                                   <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 border-2 border-[#8b949e]/30 border-t-[#8b949e] rounded-full animate-spin"></div>
                                      Monitoring Cluster...
                                   </div>
                                ) : (
                                   <><Activity size={16} className="group-hover:animate-pulse"/> Run Diagnostic</>
                                )}
                             </button>
                          </div>
                       </div>

                       {/* Right Area (Results) */}
                       <div className="flex-1 bg-[#050505] p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5">
                          <div className="flex gap-4">
                             <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col">
                                <span className="text-[10px] text-[#8b949e] font-bold uppercase mb-1">Avg Latency</span>
                                <span className="text-[24px] font-black text-white">{packetLossData.length > 0 ? '124' : '--'} <span className="text-[14px] text-[#8b949e] font-normal">ms</span></span>
                             </div>
                             <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col">
                                <span className="text-[10px] text-[#8b949e] font-bold uppercase mb-1">Desync Events</span>
                                <span className="text-[24px] font-black text-red-400">{packetLossData.length > 0 ? '12' : '--'}</span>
                             </div>
                             <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col">
                                <span className="text-[10px] text-[#8b949e] font-bold uppercase mb-1">Total Loss</span>
                                <span className="text-[24px] font-black text-orange-400">{packetLossData.length > 0 ? '4.2' : '--'} <span className="text-[14px] text-[#8b949e] font-normal">%</span></span>
                             </div>
                          </div>

                          <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl p-5 flex flex-col gap-4">
                             <h3 className="text-[12px] font-bold text-[#c9d1d9] flex items-center justify-between">
                                Live Packet Latency Graph
                                {isSimulatingLatency && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded flex items-center gap-1"><div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div> Live</span>}
                             </h3>
                             
                             <div className="flex-1 relative border-b border-l border-[#30363d] flex items-end pt-4 pr-2">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                   <div className="w-full h-px bg-[#8b949e]"></div>
                                   <div className="w-full h-px bg-[#8b949e]"></div>
                                   <div className="w-full h-px bg-[#8b949e]"></div>
                                </div>
                                
                                {packetLossData.length === 0 && !isSimulatingLatency ? (
                                   <div className="absolute inset-0 flex items-center justify-center text-[#8b949e] text-[12px]">
                                      No diagnostic run detected.
                                   </div>
                                ) : (
                                   <div className="w-full h-full flex items-end justify-between gap-1 pl-1">
                                      {packetLossData.map((val, i) => (
                                         <div key={i} className="relative flex-1 group" style={{ height: `${Math.min(100, (val / 150) * 100)}%` }}>
                                            <div className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-200 ${val > 80 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : val > 40 ? 'bg-orange-400' : 'bg-blue-500'}`} style={{ height: '100%' }}></div>
                                            <div className="absolute opacity-0 group-hover:opacity-100 -top-8 left-1/2 -translate-x-1/2 bg-[#0d1117] border border-[#30363d] text-white text-[10px] px-2 py-1 rounded pointer-events-none z-10 font-mono whitespace-nowrap shadow-xl">
                                               {val.toFixed(1)} ms
                                            </div>
                                         </div>
                                      ))}
                                   </div>
                                )}
                             </div>
                             <div className="flex justify-between text-[9px] font-mono text-[#8b949e]">
                                <span>T-0s</span>
                                <span>T-5s</span>
                                <span>T-10s</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {/* Collapsible Content Drawer Panel */}
           <div className={`absolute bottom-6 left-0 right-0 bg-[#0d1117] border-t border-[#30363d] shadow-[0_-20px_50px_rgba(0,0,0,0.9)] z-30 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col ${isContentDrawerOpen ? 'h-[380px] opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
              <div className="h-10 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 shrink-0 justify-between shadow-sm">
                 <div className="flex gap-6 text-[12px] font-bold pt-2 h-full">
                    <button className="text-white border-b-2 border-[#58a6ff] pb-2 flex items-center gap-2"><Folder size={14} className="text-[#58a6ff]"/> Project Content</button>
                    <button className="text-[#8b949e] hover:text-[#c9d1d9] pb-2 border-b-2 border-transparent hover:border-[#8b949e] transition-colors flex items-center gap-2"><MapPin size={14}/> Environment</button>
                    <button className="text-[#8b949e] hover:text-[#c9d1d9] pb-2 border-b-2 border-transparent hover:border-[#8b949e] transition-colors flex items-center gap-2"><Layers size={14}/> Megascans Surface</button>
                    <button className="text-[#e3b341] hover:text-white pb-2 border-b-2 border-transparent hover:border-[#e3b341] transition-colors flex items-center gap-2"><Sparkles size={14}/> AI Gen Assets</button>
                 </div>
                 <div className="flex gap-4 items-center text-[11px]">
                    <div className="flex gap-2">
                       <button className="text-[#8b949e] hover:text-white bg-[#050505] p-1.5 rounded border border-[#30363d]"><Filter size={14}/></button>
                       <button className="text-[#8b949e] hover:text-white bg-[#050505] p-1.5 rounded border border-[#30363d]"><LayoutGrid size={14}/></button>
                    </div>
                    <div className="relative">
                       <Search size={14} className="absolute left-3 top-1.5 text-[#8b949e]"/>
                       <input type="text" placeholder="Search Assets (e.g. 'Rock_Mossy')..." className="bg-[#050505] border border-[#30363d] rounded-full pl-8 pr-4 py-1.5 outline-none focus:border-[#58a6ff] text-white w-64 transition-all shadow-inner font-mono text-[11px]"/>
                    </div>
                 </div>
              </div>
              <div className="flex-1 flex overflow-hidden">
                 {/* Folder Tree */}
                 <div className="w-64 bg-[#050505] border-r border-[#30363d] p-3 overflow-y-auto custom-scrollbar flex flex-col gap-1 text-[12px] font-mono text-[#8b949e]">
                    <div className="flex items-center gap-2 hover:bg-[#21262d] p-1.5 rounded cursor-pointer text-white font-bold uppercase"><Folder size={14} className="fill-[#58a6ff]/30 text-[#58a6ff]"/> Content</div>
                    <div className="pl-5 flex flex-col gap-1 border-l border-[#30363d] ml-2 mt-1">
                       <div className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer text-white bg-[#21262d]">
                         <span className="flex items-center gap-2"><Folder size={14} className="fill-[#e3b341]/30 text-[#e3b341]"/> Architecture</span>
                         <span className="text-[#8b949e] text-[10px]">42</span>
                       </div>
                       <div className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                         <span className="flex items-center gap-2"><Folder size={14} className="fill-[#3fb950]/30 text-[#3fb950]"/> Foliage</span>
                         <span className="text-[#8b949e] text-[10px]">18</span>
                       </div>
                       <div className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                         <span className="flex items-center gap-2"><Folder size={14} className="fill-[#bc8cff]/30 text-[#bc8cff]"/> PCG_Rules</span>
                         <span className="text-[#8b949e] text-[10px]">5</span>
                       </div>
                       <div className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                         <span className="flex items-center gap-2"><Cpu size={14} className="text-[#f85149]"/> Blueprints</span>
                         <span className="text-[#8b949e] text-[10px]">21</span>
                       </div>
                       <div className="flex items-center justify-between hover:bg-[#21262d] p-1.5 rounded cursor-pointer">
                         <span className="flex items-center gap-2"><Palette size={14} className="text-pink-400"/> Materials</span>
                         <span className="text-[#8b949e] text-[10px]">99+</span>
                       </div>
                    </div>
                 </div>
                 {/* Grid View */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-6 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-6 content-start bg-[#0d1117]">
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((i) => (
                       <div key={i} className="flex flex-col gap-2 cursor-grab hover:scale-105 transition-transform group">
                          <div className="aspect-square bg-[radial-gradient(ellipse_at_top,#21262d_0%,#161b22_100%)] border border-[#30363d] rounded-xl shadow-lg flex items-center justify-center group-hover:border-[#58a6ff] relative overflow-hidden group-hover:shadow-[0_0_25px_rgba(88,166,255,0.3)]">
                             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                             <BoxIcon size={48} className="text-[#8b949e] group-hover:text-white drop-shadow-2xl transition-colors"/>
                             <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#58a6ff] blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             
                             <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-[#58a6ff] border border-[#58a6ff]/30 uppercase tracking-widest">Static Mesh</div>
                          </div>
                          <span className="text-[11px] font-bold text-center text-[#c9d1d9] group-hover:text-white truncate">SM_Wall_Modular_0{i}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Right Panel: Outline / Massively Detailed Details Console */}
        <div className="w-[360px] border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0 z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.6)]">
           
           {/* Section: World Outliner */}
           <div className="h-[40%] flex flex-col border-b border-[#30363d] bg-[#0d1117] shrink-0">
             <div className="h-10 border-b border-[#30363d] flex justify-between items-center px-4 bg-[#161b22] shrink-0 text-white font-bold text-[12px] uppercase tracking-widest shadow-sm">
                <div className="flex items-center gap-2"><Layers size={16} className="text-[#e3b341]"/> World Outliner</div>
                <button className="text-[#8b949e] hover:text-white"><Plus size={16}/></button>
             </div>
             
             <div className="p-2 border-b border-[#30363d] shrink-0 bg-[#0d1117]">
               <div className="relative">
                 <Search size={14} className="absolute left-3 top-1.5 text-[#8b949e]" />
                 <input type="text" placeholder="Search Actors..." className="w-full bg-[#050505] border border-[#30363d] rounded px-2 pl-8 py-1.5 text-[11px] font-mono outline-none focus:border-[#58a6ff] text-white transition-colors shadow-inner" />
               </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar p-1 text-[12px] font-mono select-none">
                {outlinerData.map(item => (
                   <div 
                     key={item.id} 
                     onClick={() => setSelectedObjectId(item.id)}
                     className={`flex justify-between items-center px-3 py-1.5 mx-1 rounded-md cursor-pointer mb-0.5 group transition-colors ${selectedObjectId === item.id ? 'bg-[#1f6feb] text-white shadow-md' : 'text-[#c9d1d9] hover:bg-[#21262d]'}`}
                   >
                     <div className="flex items-center gap-3 truncate">
                        {selectedObjectId === item.id ? React.cloneElement(item.icon as any, {className: 'text-white'}) : item.icon}
                        <span className="truncate font-bold">{item.name}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Eye size={12} className={`opacity-0 group-hover:opacity-100 ${selectedObjectId === item.id ? 'text-white/60 hover:text-white' : 'text-[#8b949e] hover:text-white'}`}/>
                        <span className={`text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 ${selectedObjectId === item.id ? 'text-white/80' : 'text-[#8b949e]'}`}>{item.type}</span>
                     </div>
                   </div>
                ))}
             </div>
           </div>

           {/* Section: Advanced Details Panel */}
           <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
             <div className="h-10 border-b border-[#30363d] flex justify-between items-center px-4 bg-[#161b22] shrink-0 text-white font-bold text-[12px] uppercase tracking-widest shadow-sm">
                <div className="flex items-center gap-2"><Settings size={16} className="text-[#58a6ff]"/> Properties</div>
                <button className="bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] px-2 py-0.5 rounded text-[10px] text-[#8b949e] hover:text-white transition-colors flex items-center gap-1">+ Add Cmpt</button>
             </div>

             {selectedObjectId ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">
                   
                   {/* Header info (Actor Type) */}
                   <div className="flex gap-4 items-center bg-[#161b22] border border-[#30363d] p-3 rounded-xl shadow-inner relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-16 h-16 bg-[#58a6ff] blur-[40px] opacity-10 pointer-events-none"></div>
                     <div className="w-14 h-14 bg-[#0a0a0a] rounded border border-[#30363d] flex items-center justify-center shadow-lg relative z-10">
                        {outlinerData.find(d=>d.id===selectedObjectId)?.icon || <Box size={28} className="text-[#8b949e]"/>}
                     </div>
                     <div className="flex flex-col relative z-10">
                        <span className="font-bold text-white text-[14px]">{outlinerData.find(d=>d.id===selectedObjectId)?.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="bg-[#21262d] text-[#8b949e] px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest border border-[#30363d]">{outlinerData.find(d=>d.id===selectedObjectId)?.type}</span>
                           <span className="text-[#8b949e] text-[9px] font-mono">ID: {selectedObjectId}</span>
                        </div>
                     </div>
                   </div>

                   {/* Transform */}
                   <DetailCategory title="Transform" open={true} icon={<Move3D size={14} className="text-white"/>}>
                      <div className="flex flex-col gap-3 mt-3">
                         <div className="flex items-center gap-3">
                           <span className="text-[11px] font-bold uppercase text-[#8b949e] tracking-widest w-16 text-right">Location</span>
                           <VectorInput label="X" val="1423.5" color="text-[#ff7b72] border-[#ff7b72]/30 bg-[#ff7b72]/5" />
                           <VectorInput label="Y" val="-402.1" color="text-[#3fb950] border-[#3fb950]/30 bg-[#3fb950]/5" />
                           <VectorInput label="Z" val="204.0" color="text-[#58a6ff] border-[#58a6ff]/30 bg-[#58a6ff]/5" />
                         </div>
                         <div className="flex items-center gap-3">
                           <span className="text-[11px] font-bold uppercase text-[#8b949e] tracking-widest w-16 text-right">Rotation</span>
                           <VectorInput label="R" val="0.0" color="text-[#ff7b72] border-[#ff7b72]/30 bg-[#ff7b72]/5" />
                           <VectorInput label="P" val="90.0" color="text-[#3fb950] border-[#3fb950]/30 bg-[#3fb950]/5" />
                           <VectorInput label="Y" val="0.0" color="text-[#58a6ff] border-[#58a6ff]/30 bg-[#58a6ff]/5" />
                         </div>
                         <div className="flex items-center gap-3">
                           <span className="text-[11px] font-bold uppercase text-[#8b949e] tracking-widest w-16 text-right flex items-center justify-end gap-1"><Link size={10} className="text-white"/> Scale</span>
                           <VectorInput label="X" val="1.0" color="text-[#ff7b72] border-[#ff7b72]/30 bg-[#ff7b72]/5" />
                           <VectorInput label="Y" val="1.0" color="text-[#3fb950] border-[#3fb950]/30 bg-[#3fb950]/5" />
                           <VectorInput label="Z" val="1.0" color="text-[#58a6ff] border-[#58a6ff]/30 bg-[#58a6ff]/5" />
                         </div>
                      </div>
                   </DetailCategory>

                   <DetailCategory title="Static Mesh Component" open={true} icon={<Box size={14} className="text-white"/>}>
                     <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#8b949e] mt-2 mb-1 tracking-widest">
                        Static Mesh
                     </div>
                     <div className="p-2.5 bg-[#161b22] border border-[#30363d] rounded-lg flex items-center gap-3 cursor-pointer hover:border-[#58a6ff] shadow-inner group transition-colors">
                        <div className="w-10 h-10 bg-black border border-[#30363d] rounded flex items-center justify-center relative overflow-hidden group-hover:border-[#58a6ff]/50">
                           <BoxIcon size={20} className="text-[#8b949e]"/>
                        </div>
                        <div className="flex flex-col flex-1 truncate">
                           <span className="text-[12px] font-bold text-white truncate">SM_AbandonedBuilding_Corner_01</span>
                           <span className="text-[10px] text-[#3fb950] font-mono mt-0.5 flex items-center gap-1"><Cpu size={10}/> Nanite Enabled</span>
                        </div>
                        <Search size={14} className="text-[#8b949e] group-hover:text-white"/>
                     </div>

                     <div className="mt-4 flex items-center justify-between text-[11px] font-bold uppercase text-[#8b949e] mb-1 tracking-widest">
                        <span>Materials</span>
                        <div className="w-5 h-5 rounded bg-[#21262d] border border-[#30363d] flex items-center justify-center cursor-pointer hover:border-white transition-colors"><Plus size={12} className="text-white"/></div>
                     </div>
                     
                     <div className="flex flex-col gap-2">
                        {/* Material 1 */}
                        <div className="p-2 bg-[#161b22] border border-[#30363d] rounded-lg flex items-center gap-3 cursor-pointer hover:border-[#bc8cff] shadow-inner group transition-colors">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-800 border border-[#30363d] group-hover:border-[#bc8cff]/50 shadow-md"></div>
                           <div className="flex flex-col flex-1 truncate">
                              <span className="text-[10px] font-mono text-[#8b949e] uppercase tracking-widest">Element 0</span>
                              <span className="text-[12px] font-bold text-white truncate">M_Concrete_Dirty_Inst</span>
                           </div>
                           <Search size={14} className="text-[#8b949e] group-hover:text-white"/>
                        </div>
                        {/* Material 2 */}
                        <div className="p-2 bg-[#161b22] border border-[#30363d] rounded-lg flex items-center gap-3 cursor-pointer hover:border-[#bc8cff] shadow-inner group transition-colors">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8a3324] to-[#5c2218] border border-[#30363d] group-hover:border-[#bc8cff]/50 shadow-md"></div>
                           <div className="flex flex-col flex-1 truncate">
                              <span className="text-[10px] font-mono text-[#8b949e] uppercase tracking-widest">Element 1</span>
                              <span className="text-[12px] font-bold text-white truncate">M_RustedMetal_Inst</span>
                           </div>
                           <Search size={14} className="text-[#8b949e] group-hover:text-white"/>
                        </div>
                     </div>
                   </DetailCategory>

                   <DetailCategory title="Physics & Collision" open={false} icon={<Target size={14} className="text-white"/>}>
                     <div className="flex flex-col gap-3 mt-3">
                        <div className="flex items-center justify-between p-2 bg-[#161b22] border border-[#30363d] rounded-lg">
                           <span className="text-[11px] font-bold text-white">Simulate Physics</span>
                           <ToggleSwitch label="" active={false} color="#58a6ff" />
                        </div>
                        <div className="flex flex-col gap-1.5 p-3 bg-[#161b22] border border-[#30363d] rounded-lg">
                           <span className="text-[10px] uppercase font-bold text-[#8b949e]">Collision Presets</span>
                           <select className="bg-[#050505] border border-[#30363d] text-white text-[11px] font-bold rounded px-2 py-1.5 outline-none hover:border-[#58a6ff] cursor-pointer">
                              <option>BlockAllDynamic</option>
                              <option>BlockAll</option>
                              <option>OverlapAll</option>
                              <option>NoCollision</option>
                              <option>Custom</option>
                           </select>
                        </div>
                     </div>
                   </DetailCategory>
                   
                   <DetailCategory title="Lighting & Shadows" open={false} icon={<Sun size={14} className="text-white"/>}>
                      <div className="flex flex-col gap-3 mt-3">
                        <div className="flex justify-between items-center text-[11px] font-bold text-[#c9d1d9]">
                           <span>Cast Shadow</span>
                           <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-3 h-3" />
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold text-[#c9d1d9]">
                           <span>Affect Distance Field Lighting</span>
                           <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-3 h-3" />
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold text-[#c9d1d9]">
                           <span>Lumen Raytracing (Hardware)</span>
                           <input type="checkbox" defaultChecked className="accent-[#58a6ff] w-3 h-3" />
                        </div>
                      </div>
                   </DetailCategory>

                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[12px] text-[#8b949e] p-8 text-center bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-80">
                   <MonitorPlay size={32} className="mb-4 text-[#30363d]" />
                   <p className="font-bold text-white mb-2">No Actor Selected</p>
                   <p>Select an object in the viewport or outliner to view and modify its properties.</p>
                </div>
             )}
           </div>

        </div>

      </div>
    </div>
  );
}

// Subcomponents

function TabButton({ icon, label, active, onClick, color, bgColor }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 flex items-center gap-2 text-[11px] font-bold rounded-sm transition-all uppercase tracking-wider
        ${active ? `${bgColor} shadow-[0_0_10px_rgba(0,0,0,0.3)] border border-white/10` : 'text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-transparent'}
      `}
    >
      <span className={active ? color : ''}>{icon}</span> {label}
    </button>
  )
}

function QuickAddBtn({ icon, label }: any) {
  return (
    <button className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg flex flex-col items-center justify-center gap-2 text-[#8b949e] hover:text-white hover:border-[#58a6ff] hover:bg-[#58a6ff]/10 hover:shadow-[0_0_15px_rgba(88,166,255,0.2)] transition-all font-bold text-[10px] uppercase tracking-wider group shadow-sm">
      <span className="text-[#c9d1d9] group-hover:text-[#58a6ff] group-hover:scale-110 transition-transform">{icon}</span>
      {label}
    </button>
  )
}

function ToolBtn({ icon, label, active, onClick }: any) {
  return (
    <button 
       onClick={onClick}
       className={`bg-[#161b22] border p-3 rounded-xl flex flex-col items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm
         ${active ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-white shadow-[0_0_20px_rgba(88,166,255,0.3)]' : 'border-[#30363d] text-[#8b949e] hover:border-[#8b949e] hover:text-white'}
       `}
    >
      <span className={`${active ? 'text-[#58a6ff] scale-110' : ''} transition-transform`}>{icon}</span>
      {label}
    </button>
  )
}

function DetailCategory({ title, open, icon, children }: any) {
   const [isOpen, setIsOpen] = useState(open);
   return (
      <div className="flex flex-col bg-[#050505] rounded-xl border border-[#30363d] overflow-hidden drop-shadow-md">
         <div 
            onClick={()=>setIsOpen(!isOpen)} 
            className={`flex justify-between items-center p-2.5 bg-gradient-to-r ${isOpen ? 'from-[#21262d] to-[#161b22]' : 'from-[#161b22] to-[#0d1117]'} cursor-pointer hover:from-[#30363d] hover:to-[#21262d] transition-all`}
         >
            <div className="flex items-center gap-2">
               {icon}
               <span className="text-[12px] font-bold text-white uppercase tracking-widest drop-shadow-sm">{title}</span>
            </div>
            {isOpen ? <ChevronUp size={14} className="text-white"/> : <ChevronDown size={14} className="text-[#8b949e]"/>}
         </div>
         {isOpen && (
            <div className="p-3 bg-[#0a0a0a] border-t border-[#30363d]">
               {children}
            </div>
         )}
      </div>
   )
}

function VectorInput({ label, val, color, locked=false }: any) {
  return (
    <div className={`flex-1 flex border rounded-lg overflow-hidden h-7 relative focus-within:ring-1 focus-within:ring-white transition-all shadow-inner ${color}`}>
      <div className={`w-6 h-full flex items-center justify-center text-[10px] font-bold border-r ${color}`}>{label}</div>
      <input type="text" defaultValue={val} disabled={locked} className="w-full bg-transparent text-[11px] font-mono text-white px-2 outline-none disabled:opacity-50" />
    </div>
  )
}

function SliderControl({ label, value, max=100, step=1, color, unit="", onChange }: any) {
  return (
    <div className="flex flex-col gap-1.5">
       <div className="flex justify-between items-center text-[11px] font-bold">
          <span className="text-[#8b949e] uppercase tracking-wider">{label}</span>
          <span style={{color}} className="font-mono bg-[#050505] px-1.5 py-0.5 rounded border border-[#30363d]">{value.toFixed(step<1?2:0)}{unit}</span>
       </div>
       <input type="range" className="w-full h-1.5 bg-[#050505] appearance-none outline-none rounded-full drop-shadow-sm cursor-pointer" style={{accentColor: color}} min="0" max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  )
}

function RangeControl({ label, min, max, color }: any) {
  return (
    <div className="flex flex-col gap-1.5 p-2 bg-[#161b22] border border-[#30363d] rounded-lg">
       <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">{label} (Min/Max)</span>
       <div className="flex gap-2">
         <div className="flex-1 flex bg-[#050505] border border-[#30363d] rounded items-center overflow-hidden h-5">
           <input type="text" defaultValue={min} className="w-full bg-transparent text-[10px] font-mono text-white px-1 outline-none text-center" />
         </div>
         <span className="text-[#8b949e]">-</span>
         <div className="flex-1 flex bg-[#050505] border border-[#30363d] rounded items-center overflow-hidden h-5">
           <input type="text" defaultValue={max} className="w-full bg-transparent text-[10px] font-mono text-white px-1 outline-none text-center" />
         </div>
       </div>
    </div>
  )
}

function ToggleSwitch({ label, active, color, onChange }: any) {
  const [isOn, setIsOn] = useState(active);
  const toggle = () => {
     setIsOn(!isOn);
     if (onChange) onChange(!isOn);
  };
  return (
     <div className="flex items-center justify-between py-1.5 cursor-pointer group" onClick={toggle}>
        <span className="text-[11px] font-bold text-[#c9d1d9] group-hover:text-white transition-colors uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-4.5 rounded-full flex items-center p-0.5 border transition-all drop-shadow-sm ${isOn ? 'bg-opacity-20' : 'bg-[#050505] border-[#30363d]'}`} style={{ borderColor: isOn ? color : undefined, backgroundColor: isOn ? `${color}33` : undefined }}>
           <div className={`w-3.5 h-3.5 rounded-full transition-all shadow-md ${isOn ? 'translate-x-[14px]' : 'translate-x-0 bg-[#8b949e]'}`} style={{ backgroundColor: isOn ? color : undefined }}></div>
        </div>
     </div>
  )
}

function FoliageItem({ name, active=false, color }: any) {
   const [isOn, setIsOn] = useState(active);
   return (
      <div 
        onClick={() => setIsOn(!isOn)}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-all p-1.5 rounded-lg border ${isOn ? color + ' shadow-[0_0_10px_rgba(63,185,80,0.2)]' : 'border-transparent hover:bg-[#21262d]'}`}
      >
         <div className="w-full aspect-square bg-[#0a0a0a] border border-[#30363d] rounded flex items-center justify-center relative overflow-hidden group">
            <Trees size={24} className={isOn ? "text-[#3fb950]" : "text-[#8b949e] group-hover:text-white"}/>
            {isOn && <div className="absolute top-1 right-1 w-2 h-2 bg-[#3fb950] rounded-full shadow-[0_0_5px_#3fb950]"></div>}
         </div>
         <span className={`text-[9px] font-bold max-w-[80px] truncate text-center ${isOn ? 'text-white' : 'text-[#8b949e]'}`}>{name}</span>
      </div>
   )
}

function PaintMaterialBtn({ label, active=false, color, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-2 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all group hover:bg-[#30363d] ${active ? 'border-pink-500/50 bg-[#161b22] shadow-[0_0_15px_rgba(2ec4b6,0.1)]' : 'border-[#30363d] bg-[#21262d] text-[#8b949e]'}`}>
       <div className={`w-full h-12 rounded-lg border border-white/10 relative overflow-hidden bg-[#0d1117]`}>
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
          <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8))]`}></div>
          <div className={`absolute bottom-1 right-2 text-[10px] font-bold ${color}`}>● {label}</div>
       </div>
    </div>
  )
}

// Helpers
function SearchIcon(props: any) { return <Search {...props} /> }
function Filter(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> }
function LayoutGrid(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> }
function LockWater(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
