import React, { useState } from 'react';
import { 
  Map, Layers, MousePointer2, Brush, Eraser, Route, Link2,
  Play, Save, Download, Settings2, Box, Zap, Volume2, Sun,
  Sword, Shield, Activity, Package, MessageSquare, Plus, ChevronDown,
  Eye, Database, Globe, Hexagon, TreePine, House, User, Lightbulb, Music, Target, Settings, Video, Search, AlignJustify, ListOrdered, GripVertical, CheckCircle2, UserCog, Skull, Coins, Home, Navigation, EyeOff, LayoutGrid, AlertTriangle, Network, Cpu, Clock, Camera, FileCode2, MapPin, Grid, Maximize, Minus, MoreVertical, Pipette, Lock, Unlock, Wind, Droplets, CloudRain, CloudLightning, Flame, Workflow, ScrollText, Users, Terminal, FolderTree, BrainCircuit, Crosshair, ArrowRightIcon, Brain, History, BookOpen,
  Mic, Speaker, SignalHigh, AudioLines, Radio, Ear, Sliders, Waves, Share2, VolumeX, Mic2
} from 'lucide-react';

export default function UltimateMapGameBuilder() {
  const [activeLeftTab, setActiveLeftTab] = useState('Hierarchy'); // Library, Hierarchy, Factions, Economy
  const [activeRightTab, setActiveRightTab] = useState('General'); // General, Stats, AI, Logic, Loot, Faction, Memories, Acoustics, DSP, Routing
  const [activeBottomTab, setActiveBottomTab] = useState('Console'); // Console, Timeline, NavMesh, Regions, GlobalVars
  const [activeMode, setActiveMode] = useState('Actors'); // Terrain, Props, Actors, Logic, Environment, Audio, Physics, Magic
  const [activeTool, setActiveTool] = useState('Select');
  
  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#111111] text-[#cccccc] font-sans text-xs overflow-hidden select-none">
      
      {/* --- ELITE TOP NAVBAR --- */}
      <div className="h-14 border-b border-[#2d2d2d] bg-[#1a1a1a] px-2 flex flex-col justify-between shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.6)] z-20">
         <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 w-1/3">
                <div className="flex bg-[#000] px-3 py-1 rounded border border-[#333] shadow-inner items-center gap-2">
                   <Globe size={16} className="text-[#3fb950] animate-pulse"/>
                   <span className="text-white font-black tracking-widest text-[11px] uppercase">Omni-Creator Suite</span>
                   <span className="text-[#888] font-mono text-[9px] ml-2 border-l border-[#333] pl-2">Map: Valoria_South_v9</span>
                </div>
            </div>
            
            <div className="flex justify-center flex-1">
                {/* Mode Switcher - Massive Array */}
                <div className="flex bg-[#0a0a0a] rounded border border-[#333] p-0.5 overflow-hidden">
                    <ModeButton active={activeMode === 'Terrain'} onClick={() => setActiveMode('Terrain')} icon={<Layers size={12}/>} label="Geo & Flora" color="text-[#c9d1d9]"/>
                    <ModeButton active={activeMode === 'Actors'} onClick={() => setActiveMode('Actors')} icon={<User size={12}/>} label="Actors/NPCs" color="text-[#58a6ff]"/>
                    <ModeButton active={activeMode === 'Combat'} onClick={() => setActiveMode('Combat')} icon={<Target size={12}/>} label="Spawns/Combat" color="text-[#f85149]" />
                    <ModeButton active={activeMode === 'Logic'} onClick={() => setActiveMode('Logic')} icon={<Zap size={12}/>} label="Logic / Rules" color="text-[#bc8cff]" />
                    <ModeButton active={activeMode === 'Magic'} onClick={() => setActiveMode('Magic')} icon={<Sparkles size={12}/>} label="Spell Volumes" color="text-[#e3b341]" />
                    <ModeButton active={activeMode === 'Environment'} onClick={() => setActiveMode('Environment')} icon={<CloudRain size={12}/>} label="Climate / VFX" color="text-[#58a6ff]"/>
                    <ModeButton active={activeMode === 'Audio'} onClick={() => setActiveMode('Audio')} icon={<Music size={12}/>} label="Acoustic Nodes" color="text-[#ff7b72]"/>
                </div>
            </div>

            <div className="flex items-center gap-2 w-1/3 justify-end">
                 <div className="flex items-center gap-2 px-2 py-1 bg-[#111] border border-[#333] rounded mr-2">
                     <Clock size={12} className="text-[#e3b341]"/>
                     <span className="text-white font-mono text-[10px]">14:30 In-Game</span>
                 </div>
                 <button className="flex items-center gap-2 px-3 py-1 bg-[#222] hover:bg-[#333] text-white rounded transition-colors border border-[#444] font-bold text-[10px]">
                    <Settings2 size={12}/> Project Config
                 </button>
                 <button className="flex items-center gap-2 px-5 py-1 bg-[#3fb950] hover:bg-[#4ddb65] text-black font-black rounded shadow-[0_0_15px_rgba(63,185,80,0.5)] transition-all border border-[#2ea043] tracking-widest text-[11px] uppercase">
                    <Play size={12} fill="currentColor"/> Live Sim
                 </button>
            </div>
         </div>
         <div className="flex text-[9px] font-mono gap-5 text-[#666] px-2 pb-1 justify-center">
             <span className="flex items-center gap-1"><Database size={10} className="text-[#bc8cff]"/> Memory: 1.2 GB / 64 GB</span>
             <span className="flex items-center gap-1"><Box size={10} className="text-[#e3b341]"/> Actors Active: 4,092</span>
             <span className="flex items-center gap-1"><Network size={10} className="text-[#3fb950]"/> Pathing Graph: Real-time</span>
             <span className="flex items-center gap-1"><Cpu size={10} className="text-red-400"/> Logical Ticks: 64Hz</span>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* --- LEFT TOOLBAR --- */}
        <div className="w-[45px] bg-[#161616] border-r border-[#2d2d2d] flex flex-col items-center py-2 space-y-2 shrink-0 z-10 shadow-[4px_0_15px_rgba(0,0,0,0.4)]">
           <ToolButton active={activeTool === 'Select'} onClick={() => setActiveTool('Select')} icon={<MousePointer2 size={14}/>} tooltip="Select / Inspect" />
           <ToolButton active={activeTool === 'Move'} onClick={() => setActiveTool('Move')} icon={<Move size={14}/>} tooltip="Transform Widget" />
           <div className="w-6 h-px bg-[#333] my-1"></div>
           <ToolButton active={activeTool === 'Brush'} onClick={() => setActiveTool('Brush')} icon={<Brush size={14}/>} tooltip="Procedural Paint" />
           <ToolButton active={activeTool === 'Fill'} onClick={() => setActiveTool('Fill')} icon={<MapPin size={14}/>} tooltip="Zone/Area Tagging" />
           <ToolButton active={activeTool === 'Eraser'} onClick={() => setActiveTool('Eraser')} icon={<Eraser size={14}/>} tooltip="Eraser" />
           <ToolButton active={activeTool === 'Pipette'} onClick={() => setActiveTool('Pipette')} icon={<Pipette size={14}/>} tooltip="Sample Entity" />
           <div className="w-6 h-px bg-[#333] my-1"></div>
           <ToolButton active={activeTool === 'Path'} onClick={() => setActiveTool('Path')} icon={<Route size={14}/>} tooltip="AI Spline Patrol" color="text-[#58a6ff]" />
           <ToolButton active={activeTool === 'Link'} onClick={() => setActiveTool('Link')} icon={<Link2 size={14}/>} tooltip="Logic/Trigger Link" color="text-[#bc8cff]" />
           <ToolButton active={activeTool === 'Region'} onClick={() => setActiveTool('Region')} icon={<Grid size={14}/>} tooltip="Volume Spawner" color="text-[#e3b341]" />
           {activeMode === 'Audio' && (
             <>
               <div className="w-6 h-px bg-[#333] my-1"></div>
               <ToolButton active={activeTool === 'AudioEmitter'} onClick={() => setActiveTool('AudioEmitter')} icon={<Speaker size={14}/>} tooltip="Place Audio Emitter" color="text-[#ff7b72]" />
               <ToolButton active={activeTool === 'OcclusionBox'} onClick={() => setActiveTool('OcclusionBox')} icon={<Box size={14}/>} tooltip="Occlusion Volume" color="text-[#ff7b72]" />
               <ToolButton active={activeTool === 'ReverbZone'} onClick={() => setActiveTool('ReverbZone')} icon={<Waves size={14}/>} tooltip="Reverb Zone" color="text-[#ff7b72]" />
             </>
           )}
        </div>

        {/* --- LEFT PANEL: HIERARCHY & VAST SYSTEMS --- */}
        <div className="w-[280px] bg-[#1a1a1a] border-r border-[#2d2d2d] flex flex-col shrink-0 flex-1">
           <div className="flex flex-wrap bg-[#111] border-b border-[#2d2d2d] shrink-0">
              <TabBtn active={activeLeftTab === 'Hierarchy'} onClick={() => setActiveLeftTab('Hierarchy')} label="World Tree" />
              <TabBtn active={activeLeftTab === 'Library'} onClick={() => setActiveLeftTab('Library')} label="Assets" />
              <TabBtn active={activeLeftTab === 'Factions'} onClick={() => setActiveLeftTab('Factions')} label="Factions" />
              <TabBtn active={activeLeftTab === 'Economy'} onClick={() => setActiveLeftTab('Economy')} label="Economy" />
           </div>

           {/* Scene Outliner */}
           {activeLeftTab === 'Hierarchy' && (
             <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-2 bg-[#1a1a1a] border-b border-[#2d2d2d]">
                   <div className="bg-[#0a0a0a] border border-[#333] rounded flex items-center px-2 py-1">
                      <Search size={12} className="text-[#666]"/>
                      <input type="text" placeholder="Filter Hierarchy..." className="bg-transparent border-none outline-none text-white px-2 w-full text-[10px] placeholder:text-[#555]" />
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-1 custom-scrollbar space-y-px text-[10px]">
                   <HierarchyFolder icon={<Globe size={12} className="text-[#3fb950]"/>} name="Level: Valoria_South" expanded>
                      <HierarchyFolder icon={<Layers size={12} className="text-[#888]"/>} name="Architecture & Static">
                         <HierarchyItem icon={<House size={12} className="text-[#d29922]"/>} name="Blacksmith_Hut_01" />
                         <HierarchyItem icon={<House size={12} className="text-[#d29922]"/>} name="Tavern_TheBoar" />
                         <HierarchyItem icon={<House size={12} className="text-[#d29922]"/>} name="CityWall_Segment_North" />
                      </HierarchyFolder>
                      <HierarchyFolder icon={<Zap size={12} className="text-[#bc8cff]"/>} name="Volumes & Triggers" expanded>
                         <HierarchyItem icon={<Box size={12} className="text-[#bc8cff]"/>} name="Trig_EnterVillage" locked />
                         <HierarchyItem icon={<Volume2 size={12} className="text-[#e3b341]"/>} name="AudioVol_MarketChatter" />
                         <HierarchyItem icon={<CloudRain size={12} className="text-[#58a6ff]"/>} name="WeatherOverride_Storm" hidden />
                      </HierarchyFolder>
                      <HierarchyFolder icon={<Users size={12} className="text-[#58a6ff]"/>} name="Dynamic Actors" expanded>
                         <HierarchyItem icon={<User size={12} className="text-[#3fb950]"/>} name="PlayerStart_Camp" />
                         <HierarchyItem icon={<User size={12} className="text-[#58a6ff]"/>} name="NPC_Garrick_Smith" active />
                         <HierarchyItem icon={<User size={12} className="text-[#58a6ff]"/>} name="NPC_Elara_Innkeeper" />
                         <HierarchyItem icon={<Target size={12} className="text-[#f85149]"/>} name="Spawner_GoblinCamp_West" />
                         <HierarchyItem icon={<Skull size={12} className="text-[#f85149]"/>} name="Goblin_Grunt_0A" />
                         <HierarchyItem icon={<Skull size={12} className="text-[#f85149]"/>} name="Goblin_Shaman_0B" />
                      </HierarchyFolder>
                      <HierarchyFolder icon={<MapPin size={12} className="text-[#bc8cff]"/>} name="Waypoints & Networks">
                         <HierarchyItem icon={<Route size={12} className="text-[#bc8cff]"/>} name="PatrolPath_Guards" />
                         <HierarchyItem icon={<Network size={12} className="text-[#bc8cff]"/>} name="NavMesh_MainRoad" />
                      </HierarchyFolder>
                   </HierarchyFolder>
                </div>
             </div>
           )}

           {/* Assets */}
           {activeLeftTab === 'Library' && (
              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                 <div className="grid grid-cols-2 gap-2">
                    <AssetCard icon={<User color="#58a6ff"/>} name="Merchant (M Base)" type="Prefab" />
                    <AssetCard icon={<Skull color="#f85149"/>} name="Dire Wolf" type="Prefab" />
                    <AssetCard icon={<Shield color="#e3b341"/>} name="Steel Kite Shield" type="Item" />
                    <AssetCard icon={<Sword color="#e3b341"/>} name="Rusted Dagger" type="Item" />
                    <AssetCard icon={<Package color="#bc8cff"/>} name="Lootable Corpse" type="Interactable" />
                    <AssetCard icon={<Sparkles color="#bc8cff"/>} name="Healing Potion" type="Consumable" />
                 </div>
              </div>
           )}

           {/* Factions */}
           {activeLeftTab === 'Factions' && (
              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-3">
                 <div className="text-[9px] uppercase font-bold text-[#888] tracking-widest flex items-center justify-between mb-1">
                    Faction Matrix <button className="text-[#bc8cff] hover:text-white"><Plus size={12}/></button>
                 </div>
                 
                 <FactionCard name="Valorian Guard" alignment="Lawful Good" rank="Primary" members="1.2k" color="bg-[#58a6ff]"/>
                 <FactionCard name="Blackfang Bandits" alignment="Chaotic Evil" rank="Hostile" members="450" color="bg-[#f85149]"/>
                 <FactionCard name="Merchants Guild" alignment="True Neutral" rank="Neutral" members="200" color="bg-[#e3b341]"/>
                 
                 <div className="bg-[#111] border border-[#333] p-2 rounded mt-2">
                    <div className="text-[9px] font-bold text-white mb-2 uppercase text-center border-b border-[#333] pb-1">Relations Map</div>
                    <div className="space-y-1 text-[9px]">
                       <div className="flex justify-between"><span>Valorian ⇄ Blackfang</span><span className="text-[#f85149]">-100 (War)</span></div>
                       <div className="flex justify-between"><span>Valorian ⇄ Merchants</span><span className="text-[#3fb950]">+50 (Allies)</span></div>
                    </div>
                 </div>
              </div>
           )}

           {/* Economy */}
           {activeLeftTab === 'Economy' && (
              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                 <div className="bg-[#111] border border-[#333] p-2 rounded mb-3">
                    <div className="text-[10px] font-bold text-white mb-2 pb-1 border-b border-[#333]">Global Market Modifiers</div>
                    <div className="space-y-2">
                       <PropRow label="Base Sell Value" value="40%" select />
                       <PropRow label="Base Buy Value" value="120%" select />
                       <PropRow label="Local Inflation" value="1.15x" />
                    </div>
                 </div>
                 <div className="text-[9px] uppercase font-bold text-[#888] mb-2 tracking-widest flex items-center justify-between">
                    Predefined Loot Tables <button className="text-[#e3b341] hover:text-white"><Plus size={12}/></button>
                 </div>
                 <div className="space-y-1">
                    <div className="bg-[#1a1a1a] border border-[#333] p-1.5 rounded text-[10px] text-[#ccc] flex justify-between cursor-pointer hover:border-[#555]"><span>LT_Bandit_Base</span> <span className="text-[#888]">4 items</span></div>
                    <div className="bg-[#1a1a1a] border border-[#333] p-1.5 rounded text-[10px] text-[#ccc] flex justify-between cursor-pointer hover:border-[#555]"><span>LT_Chest_Dungeon</span> <span className="text-[#888]">12 items</span></div>
                    <div className="bg-[#1a1a1a] border border-[#333] p-1.5 rounded text-[10px] text-[#ccc] flex justify-between cursor-pointer hover:border-[#555]"><span>LT_Boss_Necromancer</span> <span className="text-[#888]">2 items</span></div>
                 </div>
              </div>
           )}

        </div>

        {/* --- CENTER VIEWPORT --- */}
        <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden ring-1 ring-inset ring-[#333]">
            {/* Viewport Overlays */}
            <div className="absolute top-2 left-2 z-20 flex gap-2">
              <div className="bg-[#000000aa] backdrop-blur-sm border border-[#333] rounded text-[9px] font-mono text-[#888] px-2 py-1 shadow-lg pointer-events-none flex items-center gap-2">
                 <span>Grid: 50cm</span> <span className="w-px h-3 bg-[#444]"></span>
                 <span className="text-[#3fb950] font-bold">Snap: ON</span> <span className="w-px h-3 bg-[#444]"></span>
                 <span className="text-white">Perspective: Top-Down (ISO)</span>
              </div>
            </div>

            <div className="absolute top-2 right-2 z-20 flex bg-[#000000aa] border border-[#333] rounded overflow-hidden shadow-lg">
               <ViewToggle icon={<LayoutGrid size={12}/>} active={true} tooltip="Grid Layer" />
               <ViewToggle icon={<Network size={12}/>} active={true} tooltip="NavMesh Connectivity" color="text-[#bc8cff]" />
               <ViewToggle icon={<Eye size={12}/>} active={false} tooltip="NPC Vision Cones" />
               <ViewToggle icon={<Target size={12}/>} active={activeMode !== 'Audio'} tooltip="Spawners & Volumes" color="text-[#f85149]" />
               <ViewToggle icon={<Sun size={12}/>} active={false} tooltip="Dynamic Global Illumination" color="text-[#e3b341]" />
               {activeMode === 'Audio' && (
                  <ViewToggle icon={<Ear size={12}/>} active={true} tooltip="Acoustic Raycasting" color="text-[#ff7b72]" />
               )}
            </div>

            {/* Simulated Complex Map Canvas */}
            <div className="flex-1 relative cursor-crosshair overflow-hidden">
               {/* Transformed Stage */}
               <div className="absolute top-1/2 left-1/2 w-[1600px] h-[1200px] bg-[#111a11] relative shadow-[0_0_80px_rgba(0,0,0,1)] border border-[#222]" style={{transform: 'translate(-50%, -50%) rotateX(45deg) rotateZ(0deg) scale(0.9)', transformStyle: 'preserve-3d'}}>
                  
                  {/* Dense Grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

                  {/* Environment details */}
                  <div className="absolute top-0 left-0 w-[600px] h-[800px] bg-[#1e2e1e] border-r border-b border-[#0a0a0a]"></div>
                  {/* Mountainous block */}
                  <div className="absolute top-[200px] left-[800px] w-[500px] h-[400px] bg-[#2a231b] border-2 border-[#111] shadow-2xl skew-x-12 translate-z-10">
                     <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#00000022_1px,transparent_1px)] bg-[size:100%_20px]"></div>
                  </div>
                  
                  {/* Detailed River / Lake */}
                  <div className="absolute bottom-[100px] right-0 w-[800px] h-[350px] bg-[#0c2a38] border-t-2 border-l-2 border-[#111] overflow-hidden rounded-tl-[200px]">
                     {/* Water waves */}
                     <svg className="absolute inset-0 opacity-20" width="100%" height="100%">
                        <path d="M 0 50 Q 50 100 100 50 T 200 50" fill="none" stroke="#58a6ff" strokeWidth="4"/>
                        <path d="M 50 150 Q 100 200 150 150 T 250 150" fill="none" stroke="#58a6ff" strokeWidth="4"/>
                        <path d="M 100 250 Q 150 300 200 250 T 300 250" fill="none" stroke="#58a6ff" strokeWidth="4"/>
                     </svg>
                  </div>

                  {/* Complex Building structure: Blacksmith */}
                  <div className="absolute top-[250px] left-[300px] w-[200px] h-[150px] bg-[#3a2012] border-4 border-[#111] group shadow-2xl">
                     <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#00000044_1px,transparent_1px)] bg-[size:100%_15px] pointer-events-none"></div>
                     <div className="absolute -bottom-[50px] left-[70px] w-[60px] h-[50px] bg-[#221208] border-2 border-t-0 border-[#111]"></div>
                     {/* Anvil prop */}
                     <div className="absolute top-[50px] -right-[40px] w-[30px] h-[20px] bg-[#333] border border-[#111] rounded shadow-lg flex items-center justify-center">
                        <Flame size={12} className="text-orange-500 animate-pulse"/>
                     </div>
                     <div className="absolute -top-8 left-0 bg-black/90 px-2 py-0.5 rounded text-[12px] font-bold text-white border border-[#444] whitespace-nowrap shadow-xl">Garrick's Forge (Safe Zone)</div>
                  </div>

                  {/* Intricate NavMesh Overlay (Purple Nodes) */}
                  <svg className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen z-10" width="100%" height="100%">
                     {/* Safe Zone Nav */}
                     <polygon points="200,200 600,200 600,500 200,500" fill="#bc8cff" stroke="#bc8cff" strokeWidth="2" />
                     {/* Road to wilderness */}
                     <polygon points="600,300 1100,300 1100,450 600,450" fill="#bc8cff" stroke="#bc8cff" strokeWidth="2" />
                     <line x1="500" y1="350" x2="700" y2="350" stroke="#bc8cff" strokeWidth="5" strokeDasharray="10 10" />
                     <circle cx="700" cy="350" r="10" fill="#bc8cff" />
                  </svg>

                  {/* Entities & Volumes */}
                  {/* Logic Trigger Volume */}
                  <div className="absolute top-[200px] left-[10px] w-[150px] h-[400px] border-2 border-dashed border-[#bc8cff] bg-[#bc8cff]/10 flex flex-col items-center justify-center pointer-events-none z-10 shadow-[inset_0_0_20px_rgba(188,140,255,0.2)] rounded-lg">
                     <Zap size={24} className="text-[#bc8cff] opacity-50 mb-2"/>
                     <span className="bg-[#bc8cff] text-black text-[10px] font-bold px-2 rounded uppercase shadow-lg">Event: Trig_EnterVillage</span>
                  </div>

                  {/* Spawner Volume & Danger Zone */}
                  <div className="absolute top-[500px] left-[850px] w-[350px] h-[350px] border-2 border-dashed border-[#f85149] bg-[#f85149]/10 pointer-events-none z-10 rounded-full flex flex-col items-center justify-center shadow-[inset_0_0_30px_rgba(248,81,73,0.3)]">
                     <Target size={40} className="text-[#f85149] opacity-40 mb-2" />
                     <span className="bg-[#f85149]/80 text-white font-bold px-2 rounded text-[11px] shadow-lg border border-[#f85149] backdrop-blur">Bandit_Spawn_Volume [Tier 2]</span>
                     <span className="text-white bg-black/50 px-1 mt-1 text-[9px] rounded font-mono">Count: 4/5 | CDR: 300s</span>
                  </div>

                  {/* Enemies */}
                  <div className="absolute top-[600px] left-[950px] bg-[#4a1111] border-2 border-[#f85149] rounded-full p-2 shadow-[0_0_20px_rgba(248,81,73,0.8)] z-20 overflow-visible">
                     <Skull size={18} color="white" />
                     {/* Threat Radius */}
                     <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] border border-[#f85149]/20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                  </div>
                  <div className="absolute top-[700px] left-[920px] bg-[#4a1111] border-2 border-[#f85149] rounded-full p-2 shadow-[0_0_20px_rgba(248,81,73,0.8)] z-20">
                     <Skull size={18} color="white" />
                  </div>

                  {/* Selected Highlighted NPC (Garrick the Blacksmith) */}
                  <div className="absolute top-[380px] left-[420px] z-30">
                     <div className="absolute inset-0 border-4 border-white rounded-full scale-[2] animate-pulse pointer-events-none"></div>
                     <div className="absolute inset-0 border-2 border-[#58a6ff] rounded-full scale-[3] pointer-events-none opacity-40"></div>
                     <div className="bg-[#0070d2] border-2 border-white rounded-full p-2 shadow-[0_0_30px_rgba(88,166,255,1)] relative cursor-pointer">
                        <User size={18} color="white" />
                     </div>
                     
                     {/* Pro Transform Gizmo */}
                     <div className="absolute -top-[60px] left-[10px] w-[3px] h-[60px] bg-green-500 pointer-events-auto cursor-ns-resize shadow-2xl z-50"><div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-green-500 absolute -top-2 -left-[4.5px]"></div></div>
                     <div className="absolute top-[10px] left-[28px] w-[60px] h-[3px] bg-red-500 pointer-events-auto cursor-ew-resize shadow-2xl z-50"><div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-red-500 absolute -right-2 -top-[4.5px]"></div></div>
                     
                     {/* Floating Context Action Menu */}
                     <div className="absolute -top-[80px] -left-[20px] bg-[#111]/90 backdrop-blur border border-[#444] rounded shadow-2xl flex p-1.5 gap-1.5 z-50">
                        <GizmoBtn icon={<Settings2 size={14}/>} tooltip="Properties" />
                        <GizmoBtn icon={<MessageSquare size={14}/>} tooltip="Dialogue Tree" color="text-[#3fb950]"/>
                        <GizmoBtn icon={<Zap size={14}/>} tooltip="Logic Sandbox" color="text-[#bc8cff]" />
                        <GizmoBtn icon={<Package size={14}/>} tooltip="Inventory/Loot" color="text-[#e3b341]" />
                     </div>
                  </div>

                  {/* AI Advanced Path Spline for Garrick */}
                  <svg className="absolute inset-0 pointer-events-none z-20" width="100%" height="100%">
                     <path d="M 430 390 C 500 350, 600 500, 650 550" fill="none" stroke="#58a6ff" strokeWidth="3" strokeDasharray="10 10" className="opacity-80 drop-shadow-[0_0_5px_rgba(88,166,255,0.8)]" />
                     <circle cx="650" cy="550" r="6" fill="#111" stroke="#58a6ff" strokeWidth="2" />
                     <circle cx="650" cy="550" r="2" fill="#58a6ff" />
                     <text x="660" y="555" fill="#fff" fontSize="12" className="font-mono bg-black drop-shadow-md">Idle_Node_Forge</text>
                  </svg>

                  {/* ULTRA-DETAILED ACOUSTIC LAYER */}
                  {activeMode === 'Audio' && (
                     <div className="absolute inset-0 pointer-events-none z-30">
                        {/* 3D Audio Propagation Waves */}
                        <div className="absolute top-[380px] left-[420px] w-0 h-0 flex items-center justify-center">
                           <div className="absolute w-[300px] h-[300px] border border-[#ff7b72] rounded-full opacity-60 animate-[ping_4s_linear_infinite]" style={{animationDelay: '0s'}}></div>
                           <div className="absolute w-[450px] h-[450px] border border-[#ff7b72] rounded-full opacity-40 animate-[ping_4s_linear_infinite]" style={{animationDelay: '1s'}}></div>
                           <div className="absolute w-[600px] h-[600px] border border-[#ff7b72] rounded-full opacity-20 animate-[ping_4s_linear_infinite]" style={{animationDelay: '2s'}}></div>
                           <Speaker size={20} className="text-[#ff7b72] animate-pulse drop-shadow-[0_0_10px_#ff7b72]"/>
                           <span className="absolute top-4 bg-black/80 px-2 py-0.5 border border-[#ff7b72] text-[#ff7b72] font-mono text-[10px] whitespace-nowrap rounded">SFX_Forge_Hammer</span>
                        </div>

                        {/* Occlusion Raycasts showing sound hitting the Blacksmith Wall */}
                        <svg className="absolute inset-0 w-full h-full mix-blend-screen">
                           {/* Primary Ray */}
                           <line x1="420" y1="380" x2="350" y2="250" stroke="#ff7b72" strokeWidth="2" strokeDasharray="4 4" className="opacity-80"/>
                           <circle cx="350" cy="250" r="4" fill="#fff" />
                           {/* Diffracted wave bouncing off wall */}
                           <line x1="350" y1="250" x2="280" y2="200" stroke="#ff7b72" strokeWidth="2" className="opacity-40" />
                           {/* Secondary Ray (Absorbed) */}
                           <line x1="420" y1="380" x2="300" y2="350" stroke="#ff7b72" strokeWidth="2" strokeDasharray="4 4" className="opacity-80"/>
                           <circle cx="300" cy="350" r="4" fill="#e3b341" className="animate-ping" />
                           <text x="270" y="340" fill="#e3b341" fontSize="9" className="font-mono">Absorbed (Wood)</text>
                        </svg>

                        {/* Subtractive Reverb Zone */}
                        <div className="absolute top-[180px] left-[280px] w-[240px] h-[190px] bg-[#ff7b72]/10 border-2 border-dashed border-[#ff7b72]/50 flex flex-col items-center justify-center pointer-events-none rounded">
                            <Waves size={32} className="text-[#ff7b72] opacity-30"/>
                            <div className="bg-black/60 text-[#ff7b72] px-2 py-1 mt-2 text-[9px] font-bold rounded shadow-lg border border-[#ff7b72]/50 backdrop-blur">
                               Bake Zone: Reverb_Interior_Wood
                               <div className="text-white text-[8px] font-mono mt-0.5">RT60: 0.8s | LPF: 8000Hz</div>
                            </div>
                        </div>

                        {/* Ambient Node */}
                        <div className="absolute top-[600px] left-[200px] w-0 h-0 flex items-center justify-center">
                           <div className="absolute w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(88,166,255,0.15)_0%,transparent_60%)] rounded-full mix-blend-screen pointer-events-none"></div>
                           <CloudRain size={20} className="text-[#58a6ff] drop-shadow-[0_0_15px_#58a6ff]"/>
                           <span className="absolute top-4 bg-[#0a1a3a]/80 px-2 py-0.5 border border-[#58a6ff] text-[#58a6ff] font-mono text-[10px] whitespace-nowrap rounded">AMB_River_Stream_3D</span>
                        </div>
                     </div>
                  )}
               </div>
            </div>
        </div>

        {/* --- MASSIVE RIGHT PANEL (DEEP INSPECTOR) --- */}
        <div className="w-[420px] bg-[#141414] border-l border-[#2d2d2d] flex flex-col shrink-0 shadow-[-5px_0_20px_rgba(0,0,0,0.5)] z-20 overflow-hidden">
            {/* Header Identity Box */}
            <div className="bg-[#1a1a1a] p-3 border-b border-[#2d2d2d] shrink-0">
               {activeMode !== 'Audio' ? (
                  <>
                     <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-3 items-center w-full">
                           <div className="w-10 h-10 bg-[#000] rounded-md border border-[#444] flex items-center justify-center shadow-inner relative overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1544214695-81fa6d0deca4?auto=format&fit=crop&q=80&w=64&h=64" alt="Portrait" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:opacity-100 transition-opacity" />
                           </div>
                           <div className="flex-1">
                              <input type="text" defaultValue="NPC_Garrick_Smith" className="bg-transparent text-white font-black text-[14px] w-full outline-none border-b border-transparent focus:border-[#58a6ff] transition-colors" />
                              <div className="text-[#888] font-mono text-[9px] flex justify-between mt-0.5">
                                 <span>ID: GUID_8f9a2b1_X</span>
                                 <span className="text-[#3fb950]">Entity Enabled</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1">
                        <span className="bg-[#2d1f11] border border-[#523b20] text-[#e3b341] text-[9px] px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap"><Settings2 size={10} className="inline mr-1"/> Vendor [Blacksmith]</span>
                        <span className="bg-[#112a1f] border border-[#204a33] text-[#3fb950] text-[9px] px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap"><Shield size={10} className="inline mr-1"/> Essential (Immortal)</span>
                        <span className="bg-[#2d1f3d] border border-[#523b6b] text-[#bc8cff] text-[9px] px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap"><BookOpen size={10} className="inline mr-1"/> Quest Giver</span>
                        <span className="bg-[#222] border border-[#444] text-[#ccc] text-[9px] px-2 py-0.5 rounded font-bold whitespace-nowrap flex items-center gap-1 cursor-pointer hover:bg-[#333]"><Plus size={10}/></span>
                     </div>
                  </>
               ) : (
                  <>
                     <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-3 items-center w-full">
                           <div className="w-10 h-10 bg-[#111] rounded-md border border-[#ff7b72] flex items-center justify-center shadow-[inset_0_0_10px_rgba(255,123,114,0.3)] shadow-[#ff7b72]/20 relative overflow-hidden">
                              <AudioLines size={24} className="text-[#ff7b72] opacity-80" />
                           </div>
                           <div className="flex-1">
                              <input type="text" defaultValue="SFX_Forge_Hammer" className="bg-transparent text-[#ff7b72] font-black text-[14px] w-full outline-none border-b border-transparent focus:border-[#ff7b72] transition-colors" />
                              <div className="text-[#888] font-mono text-[9px] flex justify-between mt-0.5">
                                 <span>ID: AUDIO_f92x1_Z</span>
                                 <span className="text-[#3fb950]">3D Spatialized</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1">
                        <span className="bg-[#2d1f11] border border-[#523b20] text-[#e3b341] text-[9px] px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap"><Speaker size={10} className="inline mr-1"/> Point Source</span>
                        <span className="bg-[#2d1f25] border border-[#523b45] text-[#ff7b72] text-[9px] px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap"><Waves size={10} className="inline mr-1"/> Raycast Occlusion</span>
                        <span className="bg-[#112a1f] border border-[#204a33] text-[#3fb950] text-[9px] px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap"><Ear size={10} className="inline mr-1"/> Alt-Routing</span>
                        <span className="bg-[#222] border border-[#444] text-[#ccc] text-[9px] px-2 py-0.5 rounded font-bold whitespace-nowrap flex items-center gap-1 cursor-pointer hover:bg-[#333]"><Plus size={10}/></span>
                     </div>
                  </>
               )}
            </div>

            {/* Inspector Detailed Tabs - Massive Array */}
            {activeMode !== 'Audio' ? (
               <div className="flex bg-[#111] border-b border-[#2d2d2d] shrink-0 overflow-x-auto text-[10px] custom-scrollbar selection-tabs p-1 gap-1">
                  <InspectorTab active={activeRightTab === 'General'} onClick={() => setActiveRightTab('General')} label="Core Settings" icon={<Settings size={12}/>}/>
                  <InspectorTab active={activeRightTab === 'Stats'} onClick={() => setActiveRightTab('Stats')} label="RPG Stats" icon={<Activity size={12}/>}/>
                  <InspectorTab active={activeRightTab === 'AI'} onClick={() => setActiveRightTab('AI')} label="Brain / Nav" icon={<BrainCircuit size={12}/>} color="text-[#58a6ff]"/>
                  <InspectorTab active={activeRightTab === 'Logic'} onClick={() => setActiveRightTab('Logic')} label="Trigger Events" icon={<Zap size={12}/>} color="text-[#bc8cff]"/>
                  <InspectorTab active={activeRightTab === 'Memories'} onClick={() => setActiveRightTab('Memories')} label="Memory Matrix" icon={<History size={12}/>} color="text-[#e3b341]"/>
                  <InspectorTab active={activeRightTab === 'Loot'} onClick={() => setActiveRightTab('Loot')} label="Inventory / Shop" icon={<Package size={12}/>} />
                  <InspectorTab active={activeRightTab === 'Faction'} onClick={() => setActiveRightTab('Faction')} label="Relations" icon={<Users size={12}/>} color="text-[#f85149]"/>
               </div>
            ) : (
               <div className="flex bg-[#111] border-b border-[#2d2d2d] shrink-0 overflow-x-auto text-[10px] custom-scrollbar selection-tabs p-1 gap-1">
                  <InspectorTab active={activeRightTab === 'Acoustics' || activeRightTab === 'General'} onClick={() => setActiveRightTab('Acoustics')} label="3D Spatial Setup" icon={<Globe size={12}/>} color="text-[#58a6ff]"/>
                  <InspectorTab active={activeRightTab === 'DSP'} onClick={() => setActiveRightTab('DSP')} label="DSP Processing" icon={<Sliders size={12}/>} color="text-[#e3b341]"/>
                  <InspectorTab active={activeRightTab === 'Routing'} onClick={() => setActiveRightTab('Routing')} label="Mixer Routing" icon={<Share2 size={12}/>} color="text-[#bc8cff]"/>
               </div>
            )}

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-4 bg-[#0a0a0a]">
               
               {/* GENERAL SETTINGS */}
               {activeRightTab === 'General' && (
                  <>
                     <DataSection title="Transform (World Space Coordinates)" icon={<Move size={12}/>}>
                        <div className="grid grid-cols-3 gap-2">
                           <TransformBox label="Px" val="420.0" />
                           <TransformBox label="Py" val="380.0" />
                           <TransformBox label="Pz" val="0.0" />
                           <TransformBox label="Rx" val="0.0" />
                           <TransformBox label="Ry" val="0.0" />
                           <TransformBox label="Rz" val="45.0" />
                           <TransformBox label="Sx" val="1.0" />
                           <TransformBox label="Sy" val="1.0" />
                           <TransformBox label="Sz" val="1.0" />
                        </div>
                     </DataSection>
                     <DataSection title="Visual Model & Skeleton" icon={<Camera size={12}/>}>
                        <PropRow label="Base Mesh Asset" value="SK_Human_Male_Heavy" select />
                        <PropRow label="Animation Blueprint" value="AnimBP_Villager_Work" select />
                        <PropRow label="Material Override" value="Mat_Blacksmith_Soot" select />
                     </DataSection>
                     <DataSection title="Physics & Collsion" icon={<Layers size={12}/>}>
                        <PropRow label="Collider Shape" value="Capsule" select />
                        <PropRow label="Radius / Height" value="34.0 / 88.0" />
                        <PropRow label="Mass (kg)" value="95.0" />
                        <PropRow label="Physics Material" value="PM_Flesh_Armored" select />
                     </DataSection>
                  </>
               )}

               {/* RPG STATS */}
               {activeRightTab === 'Stats' && (
                  <>
                     <DataSection title="Core Attributes" icon={<Activity size={12}/>}>
                        <div className="grid grid-cols-2 gap-3 mb-2">
                           <StatBox name="Strength" value="18" mod="+4" />
                           <StatBox name="Dexterity" value="12" mod="+1" />
                           <StatBox name="Constitution" value="16" mod="+3" />
                           <StatBox name="Intelligence" value="10" mod="0" />
                           <StatBox name="Wisdom" value="14" mod="+2" />
                           <StatBox name="Charisma" value="8" mod="-1" />
                        </div>
                        <PropRow label="Level Target" value="12" />
                        <PropRow label="Experience Bounty" value="450 XP" />
                     </DataSection>
                     <DataSection title="Derived Vitals" icon={<Shield size={12}/>}>
                        <div className="mb-2 bg-[#111] border border-[#333] p-2 rounded">
                           <div className="flex justify-between text-[10px] text-white font-bold mb-1"><span>Health (HP)</span> <span className="text-[#3fb950]">850 / 850</span></div>
                           <div className="w-full bg-[#222] h-1.5 rounded-full"><div className="w-full h-full bg-[#3fb950] rounded-full"></div></div>
                        </div>
                        <div className="mb-2 bg-[#111] border border-[#333] p-2 rounded">
                           <div className="flex justify-between text-[10px] text-white font-bold mb-1"><span>Stamina (SP)</span> <span className="text-[#e3b341]">200 / 200</span></div>
                           <div className="w-full bg-[#222] h-1.5 rounded-full"><div className="w-full h-full bg-[#e3b341] rounded-full"></div></div>
                        </div>
                        <PropRow label="Armor Class (Base)" value="14 (Medium)" />
                     </DataSection>
                  </>
               )}

               {/* AI TAB - EXTREME DEPTH */}
               {activeRightTab === 'AI' && (
                  <>
                     <DataSection title="Cognitive State Engine" icon={<Brain size={12}/>} headerRight={<button className="text-[9px] bg-[#58a6ff]/20 text-[#58a6ff] px-2 py-0.5 rounded border border-[#58a6ff]/50 font-bold hover:bg-[#58a6ff] hover:text-white transition">Open Graph</button>}>
                        <PropRow label="State Machine / BT" value="BT_Blacksmith_Routine" select />
                        <PropRow label="Day/Night Cycle Aware" value="ON" toggle />
                        <PropRow label="Update Frequency" value="Max (60Hz)" select />
                        <div className="mt-3 border-t border-[#333] pt-2">
                           <div className="text-[9px] font-bold text-[#888] mb-1">Current Emotive State</div>
                           <div className="flex gap-2">
                              <span className="bg-[#111] border border-[#333] px-2 py-1 rounded text-white text-[10px] font-bold border-l-2 border-l-[#3fb950]">Content</span>
                              <span className="bg-[#111] border border-[#333] px-2 py-1 rounded text-white text-[10px] font-bold border-l-2 border-l-[#e3b341]">Focused (Working)</span>
                           </div>
                        </div>
                     </DataSection>
                     
                     <DataSection title="Navigation & Traversal" icon={<MapPin size={12}/>}>
                        <PropRow label="Pathfinding Mesh" value="NavMesh_MainRoad" select />
                        <PropRow label="Wander Radius" value="800 Max / 200 Min" />
                        <PropRow label="Max Slop Angle" value="45.0°" />
                        <PropRow label="Obstacle Avoidance" value="Reciprocal Velocity (RVO)" select />
                     </DataSection>

                     <DataSection title="Sensory Perception Grid" icon={<Eye size={12}/>}>
                        <div className="bg-[#111] p-2 rounded border border-[#333] space-y-2 mb-2">
                           <div className="flex justify-between items-center border-b border-[#333] pb-1">
                              <span className="text-white font-bold flex items-center gap-1"><Eye size={12} className="text-[#58a6ff]"/> Visual Cortex</span>
                              <input type="checkbox" defaultChecked className="accent-[#58a6ff]" />
                           </div>
                           <PropRow label="Focal Sight Range" value="2500 units" />
                           <PropRow label="Peripheral Vision Angle" value="120° Field" />
                        </div>
                        <div className="bg-[#111] p-2 rounded border border-[#333] space-y-2">
                           <div className="flex justify-between items-center border-b border-[#333] pb-1">
                              <span className="text-white font-bold flex items-center gap-1"><Volume2 size={12} className="text-[#e3b341]"/> Auditory Processing</span>
                              <input type="checkbox" defaultChecked className="accent-[#e3b341]" />
                           </div>
                           <PropRow label="Hearing Threshold" value="3500 units" />
                           <PropRow label="Footstep Sensitivity" value="High" select />
                        </div>
                     </DataSection>
                  </>
               )}

               {/* LOGIC/EVENTS TAB */}
               {activeRightTab === 'Logic' && (
                  <>
                     <div className="flex justify-between items-center mb-2 bg-[#1bc8cff]/10 p-2 rounded border border-[#bc8cff]/20">
                        <span className="text-[10px] font-bold text-[#bc8cff] uppercase tracking-widest flex items-center gap-2"><Zap size={14}/> Event Broker</span>
                        <button className="bg-[#bc8cff] text-black px-2 py-1 rounded text-[10px] font-bold transition-colors shadow-[0_0_10px_rgba(188,140,255,0.4)] flex items-center gap-1"><Plus size={10}/> Bind Event</button>
                     </div>

                     <div className="space-y-3">
                        {/* Event 1 - Complex Interaction */}
                        <div className="bg-[#111] border border-[#333] rounded overflow-hidden shadow-lg border-l-2 border-l-[#bc8cff]">
                           <div className="bg-[#1a1122] border-b border-[#333] p-1.5 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-white font-bold text-[11px]">
                                 <MousePointer2 size={12} className="text-[#bc8cff]"/> On Interact [E/A]
                              </div>
                              <div className="flex gap-2 text-[#888]">
                                 <Settings size={12} className="cursor-pointer hover:text-white"/>
                                 <ChevronDown size={12} className="cursor-pointer text-white"/>
                              </div>
                           </div>
                           <div className="p-2 space-y-1 bg-[#0a0a0a]">
                              <LogicLine icon={<AlertTriangle size={10} color="#e3b341"/>} text="Branch: IF [Var:Quest_SWORD == 'Active']" />
                              <div className="pl-3 border-l-2 border-[#e3b341] space-y-1 mt-1 ml-1">
                                 <LogicLine icon={<MessageSquare size={10} color="#3fb950"/>} text="Trigger Dialogue Tree: DLG_Blacksmith_Quest"  prefix="True"/>
                              </div>
                              <div className="pl-3 border-l-2 border-[#e3b341] space-y-1 mt-1 ml-1">
                                 <LogicLine icon={<MessageSquare size={10} color="#58a6ff"/>} text="Trigger Dialogue Tree: DLG_Blacksmith_Standard" prefix="False" />
                                 <LogicLine icon={<Package size={10} color="#e3b341"/>} text="Open Vendor UI (ID: Vendor_Blacksmith_1)" prefix="False" />
                              </div>
                           </div>
                        </div>

                        {/* Event 2 - Combat Rule */}
                        <div className="bg-[#111] border border-[#333] rounded overflow-hidden shadow-lg border-l-2 border-l-[#f85149]">
                           <div className="bg-[#2a1111] border-b border-[#333] p-1.5 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-white font-bold text-[11px]">
                                 <Sword size={12} className="text-[#f85149]"/> On Health &lt; 20%
                              </div>
                              <ChevronDown size={12} className="cursor-pointer text-[#888] -rotate-90"/>
                           </div>
                        </div>
                     </div>
                  </>
               )}

               {/* MEMORIES TAB (Advanced RPG Feature) */}
               {activeRightTab === 'Memories' && (
                  <>
                     <div className="bg-[#111] border border-[#e3b341]/30 p-2 rounded mb-3">
                        <div className="text-[10px] font-bold text-[#e3b341] mb-2 border-b border-[#333] pb-1 flex items-center justify-between">Actor Sentiment History <button className="text-[#888] hover:text-white"><Settings2 size={12}/></button></div>
                        <div className="text-[9px] text-[#ccc] leading-relaxed mb-2">This actor remembers interactions globally. Variables dictate future dialogue states and trading discounts.</div>
                        <PropRow label="Player Affinity" value="+25 (Friendly)" />
                        <PropRow label="Crime Memory Fade" value="7 in-game Days" select />
                     </div>
                     <div className="text-[9px] font-bold text-[#888] mb-2 uppercase">Memory Ledgers</div>
                     <div className="space-y-1">
                        <div className="bg-[#1a1a1a] p-2 border border-[#333] rounded">
                           <div className="text-white font-bold text-[10px] mb-1">Purchased &gt; 1000g</div>
                           <div className="text-[9px] text-[#3fb950] font-mono">Effect: -10% Prices</div>
                           <div className="text-[#666] text-[8px] mt-1 line-clamp-1">Triggered during trade session.</div>
                        </div>
                        <div className="bg-[#1a1111] p-2 border border-[#f85149]/30 rounded">
                           <div className="text-white font-bold text-[10px] mb-1">Witnessed Theft (Iron Ingot)</div>
                           <div className="text-[9px] text-[#f85149] font-mono">Effect: Suspicious Dialogue Line 3</div>
                           <div className="text-[#666] text-[8px] mt-1 line-clamp-1">Status: Forgiven via Bribery</div>
                        </div>
                     </div>
                  </>
               )}

               {/* ULTRA AUDIO INSPECTOR MODE */}
               {activeMode === 'Audio' && (activeRightTab === 'Acoustics' || activeRightTab === 'General') && (
                  <>
                     <DataSection title="3D Attenuation & Falloff" icon={<SignalHigh size={12}/>}>
                        <PropRow label="Attenuation Shape" value="Sphere" select />
                        <PropRow label="Falloff Model" value="Logarithmic" select />
                        <div className="flex gap-2">
                           <div className="flex-1">
                              <PropRow label="Min Radius" value="400" />
                              <div className="text-[8px] text-[#666] text-right mt-[-4px]">No attenuation inside</div>
                           </div>
                           <div className="flex-1">
                              <PropRow label="Max Radius" value="2800" />
                              <div className="text-[8px] text-[#666] text-right mt-[-4px]">Silence beyond</div>
                           </div>
                        </div>
                        {/* Visualization Graph of Falloff */}
                        <div className="bg-[#1a1a1a] border border-[#333] h-20 rounded mt-2 px-2 pb-1 relative flex items-end">
                           <svg width="100%" height="100%" className="absolute inset-0 pt-2 px-1">
                              {/* Logarithmic Curve */}
                              <path d="M 0 10 Q 50 60 100 70 T 350 78" fill="none" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_2px_5px_rgba(88,166,255,0.6)]" />
                           </svg>
                           <div className="absolute top-1 left-2 text-[#fff] text-[9px] font-mono font-bold">100% Vol</div>
                           <div className="absolute bottom-1 right-2 text-[#888] text-[9px] font-mono">0% (Max Dist)</div>
                        </div>
                     </DataSection>

                     <DataSection title="Dynamic Sound Propagation" icon={<Ear size={12}/>}>
                        <PropRow label="Real-time Occlusion" value="ON" toggle />
                        <PropRow label="Raycast Iterations" value="16 Rays" select />
                        <PropRow label="Diffraction (Bending)" value="ON" toggle />
                        <PropRow label="Low-Pass Filter (LPF) max" value="-24dB per wall" />
                        <div className="mt-3 bg-[#f85149]/10 border border-[#f85149]/30 rounded p-2">
                           <div className="text-[10px] font-bold text-[#f85149] mb-1 flex items-center gap-1"><AlertTriangle size={10}/> Raycast Cost Warning</div>
                           <div className="text-[9px] text-[#aaa]">High raycast counts per audio node may degrade CPU logical ticks. Consider 'Bake-to-Texture' for static geometry occlusion.</div>
                           <button className="w-full mt-2 bg-[#f85149]/20 hover:bg-[#f85149]/40 text-[#f85149] border border-[#f85149]/50 transition-colors rounded py-1 text-[9px] font-bold uppercase tracking-widest shadow-inner">Profile Cost</button>
                        </div>
                     </DataSection>
                     
                     <DataSection title="Doppler & Pitch" icon={<AudioLines size={12}/>}>
                        <PropRow label="Doppler Scaling" value="1.0x (Realism)" />
                        <PropRow label="Pitch Variance" value="± 0.05 (Random)" />
                     </DataSection>
                  </>
               )}

               {activeMode === 'Audio' && activeRightTab === 'DSP' && (
                  <>
                     <div className="flex justify-between items-center mb-2 bg-[#e3b341]/10 p-2 rounded border border-[#e3b341]/20">
                        <span className="text-[10px] font-bold text-[#e3b341] uppercase tracking-widest flex items-center gap-2"><Sliders size={14}/> Effect Chain</span>
                        <div className="flex gap-2">
                           <button className="text-[#888] hover:text-white"><Zap size={12}/></button>
                           <button className="text-[#888] hover:text-white"><Plus size={12}/></button>
                        </div>
                     </div>

                     <div className="space-y-2">
                        {/* EQ Node */}
                        <div className="bg-[#111] border border-[#333] rounded overflow-hidden shadow-lg border-l-2 border-l-[#58a6ff]">
                           <div className="bg-[#111a2a] border-b border-[#333] p-1.5 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-white font-bold text-[11px]">
                                 <Radio size={12} className="text-[#58a6ff]"/> Parametric EQ (4-Band)
                              </div>
                              <div className="w-8 h-4 bg-[#58a6ff]/20 rounded-full border border-[#58a6ff] relative"><div className="w-3 h-3 bg-[#58a6ff] rounded-full absolute right-px top-px"></div></div>
                           </div>
                           <div className="p-2 bg-[#0a0a0a]">
                              <div className="flex justify-between">
                                 <div className="flex flex-col items-center">
                                    <input type="range" className="accent-[#58a6ff] appearance-none bg-[#222] h-1 w-12 rounded outline-none origin-center -rotate-90 my-5 cursor-ns-resize" defaultValue={40} />
                                    <span className="text-[8px] text-[#888]">LOW</span>
                                 </div>
                                 <div className="flex flex-col items-center">
                                    <input type="range" className="accent-[#58a6ff] appearance-none bg-[#222] h-1 w-12 rounded outline-none origin-center -rotate-90 my-5 cursor-ns-resize" defaultValue={60} />
                                    <span className="text-[8px] text-[#888]">L-MID</span>
                                 </div>
                                 <div className="flex flex-col items-center">
                                    <input type="range" className="accent-[#58a6ff] appearance-none bg-[#222] h-1 w-12 rounded outline-none origin-center -rotate-90 my-5 cursor-ns-resize" defaultValue={30} />
                                    <span className="text-[8px] text-[#888]">H-MID</span>
                                 </div>
                                 <div className="flex flex-col items-center">
                                    <input type="range" className="accent-[#58a6ff] appearance-none bg-[#222] h-1 w-12 rounded outline-none origin-center -rotate-90 my-5 cursor-ns-resize" defaultValue={80} />
                                    <span className="text-[8px] text-[#888]">HIGH</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Cave Reverb */}
                        <div className="bg-[#111] border border-[#333] rounded overflow-hidden shadow-lg border-l-2 border-l-[#bc8cff]">
                           <div className="bg-[#1a1122] border-b border-[#333] p-1.5 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-white font-bold text-[11px]">
                                 <Waves size={12} className="text-[#bc8cff]"/> Convolution Reverb
                              </div>
                              <div className="w-8 h-4 bg-[#bc8cff]/20 rounded-full border border-[#bc8cff] relative"><div className="w-3 h-3 bg-[#bc8cff] rounded-full absolute right-px top-px"></div></div>
                           </div>
                           <div className="p-2 space-y-1 bg-[#0a0a0a]">
                              <PropRow label="Impulse Response" value="IR_Stone_Forge.wav" select />
                              <PropRow label="Wet/Dry Mix" value="35%" />
                              <PropRow label="Decay Time" value="1.8s" />
                           </div>
                        </div>
                     </div>
                  </>
               )}
            </div>
        </div>
      </div>

      {/* --- BOTTOM CONSOLE / TIMELINE PANEL --- */}
      <div className="h-[200px] border-t border-[#2d2d2d] bg-[#0a0a0a] flex flex-col shrink-0 relative z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
         <div className="flex bg-[#141414] border-b border-[#2d2d2d] text-[10px] uppercase font-bold tracking-wider pt-1 px-1">
            <BottomTab active={activeBottomTab === 'Console'} onClick={() => setActiveBottomTab('Console')} label="System Logs" icon={<Terminal size={12}/>}/>
            <BottomTab active={activeBottomTab === 'Timeline'} onClick={() => setActiveBottomTab('Timeline')} label="Cinematics" icon={<Video size={12}/>}/>
         </div>
         
         <div className="flex-1 overflow-auto custom-scrollbar p-2 font-mono text-[10px] bg-[#000] leading-loose">
            {activeBottomTab === 'Console' && (
               <div className="text-[#8b949e]">
                  <div><span className="text-[#3fb950] font-bold">[ENGINE_INIT]</span> World Level Streamed: Valoria_South_v9 (1.04s)</div>
                  <div><span className="text-[#bc8cff] font-bold">[AI_SYSTEM]</span> Built 14 NavMesh Polygons. Rebuilding local cell... Done.</div>
                  <div className="text-[#e3b341] bg-[#e3b341]/10 px-1 border-l-2 border-[#e3b341] font-bold"><span className="text-[#e3b341]">[WARNING]</span> Actor 'NPC_Garrick_Smith' has no assigned 'Sleep' behavior for Night Cycle.</div>
                  <div><span className="text-[#58a6ff] font-bold">[AUDIO_ENGINE]</span> Pre-caching spatial impulses... 12/12 banks loaded.</div>
                  <div><span className="text-white font-bold">[LOGIC_CORE]</span> Compiling Event Graph for 1,402 entities... Success.</div>
                  <div><span className="text-[#f85149] font-bold">[COMBAT_SIM]</span> Validating spawn points. Tier 2 Bandit Camp Active.</div>
                  <div><span className="text-white animate-pulse">_</span></div>
               </div>
            )}
         </div>
      </div>

    </div>
  );
}

// ----- EXTENSIVE HELPER COMPONENTS -----

function ModeButton({active, icon, label, onClick, color}: {active: boolean, icon: React.ReactNode, label: string, onClick: () => void, color?: string}) {
   return (
       <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-bold text-[9px] uppercase tracking-wider ${active ? `bg-[#222] shadow-[inset_0_0_10px_rgba(255,255,255,0.05)] border border-[#444] ${color || 'text-white'}` : 'text-[#888] hover:bg-[#111] hover:text-[#ccc] border border-transparent'}`}>
          {icon} <span>{label}</span>
       </button>
   );
}

function ToolButton({active, icon, tooltip, onClick, color}: {active: boolean, icon: React.ReactNode, tooltip: string, onClick: () => void, color?: string}) {
   return (
      <button onClick={onClick} className={`p-2 rounded transition-all relative group ${active ? `bg-[#2d2d2d] border border-[#555] ${color || 'text-white'} shadow-inner` : 'text-[#888] hover:bg-[#252526] hover:text-white border border-transparent'} `}>
         {icon}
         <div className="absolute left-[50px] top-1/2 -translate-y-1/2 bg-black border border-[#333] text-white text-[10px] whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl flex items-center shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
            {tooltip}
         </div>
      </button>
   );
}

function TabBtn({active, label, onClick}: {active: boolean, label: string, onClick: () => void}) {
   return <button onClick={onClick} className={`flex-1 py-1.5 font-bold text-[9px] uppercase tracking-widest text-center border-b-2 transition-colors duration-200 ${active ? 'border-[#58a6ff] text-white bg-[#1a1a1a]' : 'border-[#2d2d2d] text-[#666] hover:text-[#aaa] hover:bg-[#151515]'}`}>{label}</button>
}

function BottomTab({active, label, icon, onClick}: {active: boolean, label: string, icon: React.ReactNode, onClick: () => void}) {
   return <button onClick={onClick} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-t-lg transition-colors border max-w-max ${active ? 'bg-[#000] border-[#2d2d2d] border-b-transparent text-white' : 'bg-[#141414] border-transparent text-[#666] hover:bg-[#1a1a1a] hover:text-white'}`}>{icon} {label}</button>
}

function ViewToggle({active, icon, tooltip, color}: {active: boolean, icon: React.ReactNode, tooltip: string, color?: string}) {
   return <button className={`p-1.5 border-r border-[#333] last:border-0 transition-colors ${active ? `bg-[#222] ${color || 'text-white'} shadow-inner` : 'text-[#666] hover:text-[#aaa] hover:bg-[#111]'}`} title={tooltip}>{icon}</button>
}

function AssetCard({icon, name, type}: {icon: React.ReactNode, name: string, type: string}) {
   return (
      <div className="bg-[#111] border border-[#333] rounded p-2 flex flex-col items-center justify-center gap-1.5 hover:border-[#58a6ff] hover:shadow-[0_0_15px_rgba(88,166,255,0.2)] cursor-grab transition-all relative group">
         <span className="absolute top-1 right-1 text-[8px] bg-[#222] px-1 rounded text-[#888] font-bold uppercase border border-[#444]">{type}</span>
         <div className="p-2 bg-[#0a0a0a] rounded-lg border border-[#222] shadow-inner mt-2">{icon}</div>
         <span className="text-[10px] text-center font-bold text-[#ccc] leading-tight w-full truncate px-1">{name}</span>
      </div>
   );
}

function FactionCard({name, alignment, rank, members, color}: {name: string, alignment: string, rank: string, members: string, color: string}) {
   return (
      <div className="bg-[#111] border border-[#333] rounded overflow-hidden">
         <div className={`h-1.5 w-full ${color}`}></div>
         <div className="p-2">
            <div className="text-white font-bold text-[11px] mb-1">{name}</div>
            <div className="grid grid-cols-2 gap-y-1 text-[9px] text-[#888]">
               <div>Align: <span className="text-[#ccc]">{alignment}</span></div>
               <div>Rank: <span className="text-[#ccc]">{rank}</span></div>
               <div>Units: <span className="text-[#ccc] font-mono">{members}</span></div>
            </div>
         </div>
      </div>
   );
}

function InspectorTab({active, label, icon, onClick, color}: {active: boolean, label: string, icon: React.ReactNode, onClick: () => void, color?: string}) {
   return (
      <button onClick={onClick} className={`px-2 py-1.5 rounded flex items-center gap-1.5 font-bold whitespace-nowrap transition-colors ${active ? `bg-[#252526] border border-[#444] ${color || 'text-white'} shadow-md` : 'border border-[#222] bg-[#111] text-[#777] hover:bg-[#1a1a1a] hover:text-[#ccc] hover:border-[#444]'}`}>
         {icon} {label}
      </button>
   );
}

function DataSection({title, icon, children, headerRight}: {title: string, icon: React.ReactNode, children: React.ReactNode, headerRight?: React.ReactNode}) {
   return (
      <div className="bg-[#111] border border-[#333] rounded overflow-hidden shadow-lg">
         <div className="bg-[#1a1a1a] border-b border-[#333] px-2 py-1.5 flex justify-between items-center">
            <div className="font-bold text-white text-[10px] uppercase tracking-wider flex items-center gap-2">
               {icon} {title}
            </div>
            {headerRight}
         </div>
         <div className="p-2 space-y-1.5">
            {children}
         </div>
      </div>
   );
}

function PropRow({label, value, toggle, select}: {label: string, value: string, toggle?: boolean, select?: boolean}) {
   return (
      <div className="flex justify-between items-center text-[10px] py-0.5">
         <span className="text-[#888] font-medium">{label}</span>
         {toggle ? (
            <div className={`w-7 h-4 rounded-full relative cursor-pointer border ${value === 'ON' ? 'bg-[#58a6ff]/20 border-[#58a6ff]' : 'bg-[#222] border-[#444]'}`}>
               <div className={`w-3 h-3 rounded-full absolute top-[1px] transition-transform ${value === 'ON' ? 'bg-[#58a6ff] translate-x-[11px]' : 'bg-[#888] translate-x-[1px]'}`}></div>
            </div>
         ) : select ? (
            <select className="bg-[#0a0a0a] border border-[#444] text-white rounded px-2 py-0.5 min-w-[120px] text-right font-medium outline-none focus:border-[#58a6ff] hover:bg-[#1a1a1a] cursor-pointer">
               <option>{value}</option>
            </select>
         ) : (
            <input type="text" defaultValue={value} className="bg-[#0a0a0a] border border-[#444] text-white rounded px-2 py-1 w-24 text-right font-mono outline-none focus:border-[#58a6ff] hover:border-[#555]" />
         )}
      </div>
   );
}

function TransformBox({label, val}: {label: string, val: string}) {
   return (
      <div className="bg-[#0a0a0a] border border-[#444] rounded px-1.5 py-1 flex justify-between items-center text-[9px] font-mono focus-within:border-[#58a6ff]">
         <span className="text-[#666] font-sans font-bold">{label}</span>
         <span className="text-white selection:bg-[#58a6ff]">{val}</span>
      </div>
   );
}

function StatBox({name, value, mod}: {name: string, value: string, mod: string}) {
   return (
      <div className="bg-[#1a1a1a] border border-[#333] p-1.5 rounded flex items-center justify-between text-[10px]">
         <span className="text-[#888] font-bold uppercase">{name}</span>
         <div className="flex items-center gap-2">
            <span className="text-white font-mono">{value}</span>
            <span className="bg-[#58a6ff]/20 text-[#58a6ff] px-1 rounded font-mono">{mod}</span>
         </div>
      </div>
   );
}

function LogicLine({icon, text, prefix}: {icon: React.ReactNode, text: string, prefix?: string}) {
   return (
      <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] px-2 py-1.5 rounded shadow-sm hover:border-[#555] transition-colors cursor-pointer">
         {prefix && <span className={`text-[8px] font-black uppercase tracking-wider ${prefix === 'True' ? 'text-[#3fb950]' : 'text-red-400'}`}>{prefix}</span>}
         <div className="bg-[#111] p-0.5 rounded border border-[#444]">{icon}</div>
         <span className="text-[#ccc] text-[9.5px] truncate flex-1 font-medium">{text}</span>
      </div>
   );
}

function GizmoBtn({icon, danger, tooltip, color}: {icon: React.ReactNode, danger?: boolean, tooltip: string, color?: string}) {
   return (
      <button className={`p-1.5 rounded transition-all border border-transparent hover:border-[#444] group relative ${danger ? 'text-red-400 hover:bg-red-500/20 hover:border-red-500/50' : `text-[#aaa] hover:bg-[#222] ${color}`}`}>
         {icon}
         <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black border border-[#444] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-xl">
            {tooltip}
         </div>
      </button>
   );
}

// Hierarchy Helpers
function HierarchyFolder({name, icon, expanded, children}: {name: string, icon: React.ReactNode, expanded?: boolean, children: React.ReactNode}) {
   return (
      <div className="select-none">
         <div className="flex items-center gap-1.5 py-1.5 px-1.5 text-[#ccc] hover:bg-[#222] rounded cursor-pointer font-bold text-[10px] transition-colors">
            <ChevronDown size={12} className={`text-[#666] transition-transform ${expanded ? '' : '-rotate-90'}`} />
            {icon} {name}
         </div>
         <div className={`pl-4 border-l border-[#333] ml-2 mt-px ${expanded ? 'block' : 'hidden'} space-y-px`}>
            {children}
         </div>
      </div>
   );
}

function HierarchyItem({name, icon, active, locked, hidden}: {name: string, icon: React.ReactNode, active?: boolean, locked?: boolean, hidden?: boolean}) {
   return (
      <div className={`flex justify-between items-center py-1.5 px-1.5 rounded cursor-pointer text-[9.5px] font-medium transition-colors border border-transparent ${active ? 'bg-[#004a77] text-white border-[#006099] shadow-inner' : 'text-[#8b949e] hover:bg-[#222] hover:text-[#ccc]'}`}>
         <div className="flex items-center gap-2 truncate">
            {icon}
            <span className={`${hidden ? 'opacity-50' : ''}`}>{name}</span>
         </div>
         <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {locked && <Lock size={10} className="text-[#888]"/>}
            {hidden ? <EyeOff size={10} className="text-[#888]"/> : <Eye size={10} className="text-[#555] hover:text-white"/>}
         </div>
      </div>
   );
}
