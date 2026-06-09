import React, { useState } from 'react';
import { Grid, Box, Image, Map as MapIcon, Layers, Target, Eye, Maximize, FileJson, CheckSquare, Zap, Plus, Settings2, Shield, Activity, MousePointer2, Settings, Download, Trash2, Brush, Eraser, Play, Square, Minus } from 'lucide-react';

export default function AdvancedMapBuilder() {
  const [activeLayer, setActiveLayer] = useState('Collision');
  const [activeTool, setActiveTool] = useState('Draw');
  const [gridSize, setGridSize] = useState(32);

  const tools = [
    { id: 'Select', icon: <MousePointer2 size={16}/> },
    { id: 'Draw', icon: <Brush size={16}/> },
    { id: 'Erase', icon: <Eraser size={16}/> },
    { id: 'Fill', icon: <Box size={16}/> },
    { id: 'Rect', icon: <Square size={16}/> },
    { id: 'Event', icon: <Zap size={16}/> },
    { id: 'Spawn', icon: <Target size={16}/> }
  ];

  const mapLayers = [
    { id: 'Events', icon: <Zap size={12}/>, color: 'text-yellow-400' },
    { id: 'Collision', icon: <Shield size={12}/>, color: 'text-red-400' },
    { id: 'Foreground', icon: <Layers size={12}/>, color: 'text-white' },
    { id: 'Middleground', icon: <Layers size={12}/>, color: 'text-gray-300' },
    { id: 'Background', icon: <Layers size={12}/>, color: 'text-gray-500' },
    { id: 'Parallax Space', icon: <Image size={12}/>, color: 'text-purple-400' }
  ];

  const tilesetInfo = [
    { id: 1, name: 'Grass_01', type: 'Solid', color: '#3fb950' },
    { id: 2, name: 'Dirt_Path_04', type: 'Passable', color: '#8b5a2b' },
    { id: 3, name: 'Water_Deep', type: 'Solid', color: '#1f6feb' },
    { id: 4, name: 'Stone_Wall', type: 'Solid', color: '#8b949e' },
    { id: 5, name: 'Wood_Floor', type: 'Passable', color: '#d4a373' },
    { id: 6, name: 'Lava_Active', type: 'Damage_Zone', color: '#ff7b72' },
  ];

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#1e1e1e] text-[#cccccc] font-sans text-xs overflow-hidden select-none">
      {/* Top Menu Bar */}
      <div className="flex items-center justify-between border-b border-[#333333] bg-[#2d2d2d] px-3 py-1.5 shrink-0 shadow-md z-10">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#8b5a2b] text-white rounded text-[10px] font-bold shadow-inner border border-[#6b4221] uppercase tracking-wider">
               <MapIcon size={14} /> Tiled World Engineer
            </div>
            <div className="flex items-center text-[11px] gap-3 font-medium">
               <span className="hover:text-white cursor-pointer transition-colors px-1 border-b border-transparent hover:border-white pb-0.5">Map Config</span>
               <span className="hover:text-white cursor-pointer transition-colors px-1 border-b border-transparent hover:border-white pb-0.5">Tilesets</span>
               <span className="hover:text-white cursor-pointer transition-colors px-1 border-b border-white text-white pb-0.5">Tile Editor</span>
               <span className="hover:text-white cursor-pointer transition-colors px-1 border-b border-transparent hover:border-white pb-0.5">Event Nodes</span>
               <span className="hover:text-white cursor-pointer transition-colors px-1 border-b border-transparent hover:border-white pb-0.5">Export JSON</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-[#444] hover:bg-[#555] border border-[#222] px-3 py-1 rounded transition-colors text-white">
               <Play size={12} fill="currentColor" className="text-[#3fb950]"/> Test Map
            </button>
            <button className="flex items-center gap-1.5 bg-[#0070d2] hover:bg-[#005ea6] px-3 py-1 rounded transition-colors text-white font-bold">
               Save As Preset
            </button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Left Toolbox */}
         <div className="w-14 bg-[#2d2d2d] border-r border-[#333333] flex flex-col items-center py-2 gap-2 z-10 shrink-0">
            {tools.map(t => (
               <button 
                 key={t.id}
                 onClick={() => setActiveTool(t.id)}
                 className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${activeTool === t.id ? 'bg-[#1a1a1a] text-white shadow-inner border-2 border-[#0070d2]' : 'text-[#aaa] hover:bg-[#444] hover:text-white'}`}
                 title={t.id}
               >
                  {t.icon}
               </button>
            ))}
            <div className="w-8 h-px bg-[#444] my-2"></div>
            <button className="w-9 h-9 rounded flex items-center justify-center text-[#aaa] hover:bg-[#444] hover:text-white" title="Toggle Grid Snap"><Grid size={16}/></button>
            <button className="w-9 h-9 rounded flex items-center justify-center text-[#aaa] hover:bg-[#444] hover:text-white" title="Toggle Collision View"><Shield size={16}/></button>
            <button className="w-9 h-9 rounded flex items-center justify-center text-[#aaa] hover:bg-[#444] hover:text-white" title="Wireframe Mode"><Maximize size={16}/></button>
         </div>

         {/* Middle Layer Manager & Tileset Picker */}
         <div className="w-64 bg-[#252525] border-r border-[#333333] flex flex-col shrink-0">
            {/* Layers Panel */}
            <div className="h-1/2 border-b border-[#333] flex flex-col">
               <div className="px-3 py-2 bg-[#1e1e1e] border-b border-[#333] font-bold text-white uppercase tracking-wider text-[10px] flex justify-between items-center">
                  <span className="flex items-center gap-2"><Layers size={14} className="text-[#0070d2]"/> Map Hub Layers</span>
                  <PlusIcon size={12} className="cursor-pointer hover:text-[#0070d2]"/>
               </div>
               <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {mapLayers.map(layer => (
                     <div 
                        key={layer.id}
                        onClick={() => setActiveLayer(layer.id)}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer border ${activeLayer === layer.id ? 'bg-[#333] border-[#555] shadow-inner' : 'bg-[#1e1e1e] border-transparent hover:bg-[#2a2a2a]'}`}
                     >
                        <div className="flex items-center gap-2">
                           <span className={layer.color}>{layer.icon}</span>
                           <span className={`font-bold text-[11px] ${activeLayer === layer.id ? 'text-white' : 'text-[#aaa]'}`}>{layer.id}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-50 hover:opacity-100">
                           <Eye size={12}/>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="p-2 bg-[#1e1e1e] text-[10px] text-[#888] border-t border-[#333] flex items-center justify-between">
                  <span>Opacity</span>
                  <input type="range" min="0" max="100" defaultValue="100" className="w-24 accent-[#0070d2]"/>
               </div>
            </div>

            {/* Tileset Picker */}
            <div className="h-1/2 flex flex-col">
               <div className="px-3 py-2 bg-[#1e1e1e] border-b border-[#333] font-bold text-white uppercase tracking-wider text-[10px] flex justify-between items-center">
                  <span className="flex items-center gap-2"><MapIcon size={14} className="text-[#3fb950]"/> Active Tileset (A)</span>
                  <Settings2 size={12} className="cursor-pointer hover:text-[#0070d2]"/>
               </div>
               <div className="p-2 border-b border-[#333] bg-[#222]">
                  <select className="w-full bg-[#111] border border-[#444] rounded px-2 py-1 text-white outline-none">
                     <option>JRPG_Fantasy_Exterior_01.png</option>
                     <option>SciFi_Interior_Base.png</option>
                     <option>Dark_Dungeon_Wall.png</option>
                  </select>
               </div>
               {/* Tile Palette Simulator */}
               <div className="flex-1 bg-[#1a1a1a] p-2 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-4 gap-1">
                     {/* Generate fake tiles */}
                     {Array.from({length: 48}).map((_, i) => (
                        <div key={i} className={`aspect-square rounded-sm border cursor-pointer hover:border-white transition-colors relative group ${i === 12 ? 'border-yellow-400 ring-2 ring-yellow-400/50' : 'border-[#444]'} bg-[#2d2d2d]`}>
                           {/* Add some fake variety */}
                           <div className="absolute inset-0 opacity-80" style={{backgroundColor: i % 5 === 0 ? '#3fb950' : i % 3 === 0 ? '#1f6feb' : i % 7 === 0 ? '#ff7b72' : '#8b5a2b'}}></div>
                           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjIpIi8+PC9zdmc+')] pointer-events-none mix-blend-multiply"></div>
                           {/* Highlight active */}
                           {i === 12 && <div className="absolute inset-0 bg-yellow-400/20"></div>}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Center Canvas Area (The Map) */}
         <div className="flex-1 bg-[#111] relative overflow-auto custom-scrollbar p-10 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTMyIDBMMCAwIDAgMzIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIyMiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')]">
             <div className="absolute top-4 left-4 bg-black/80 px-3 py-1.5 rounded border border-[#444] text-[10px] font-mono text-[#aaa] z-20 backdrop-blur shadow-lg flex flex-col gap-1">
                <span className="text-white font-bold">Map: Overworld_Sector_7</span>
                <span>Size: 64x64 tiles (2048x2048 px)</span>
                <span>Grid: {gridSize}x{gridSize}</span>
                <span className="text-yellow-400 mt-1 flex items-center gap-1"><Target size={10}/> Pos X: 14 | Y: 22</span>
             </div>

             {/* The Map Canvas Simulated */}
             <div className="w-[800px] h-[600px] bg-[#1e1e1e] border-2 border-[#444] relative shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden cursor-crosshair">
                {/* Simulated Base Layer */}
                <div className="absolute inset-0 opacity-50 bg-[#8b5a2b] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTMyIDBMMCAwIDAgMzIiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjMpIi8+PC9zdmc+')]"></div>
                
                {/* Simulated Placed Tiles */}
                {/* Grass Patch */}
                <div className="absolute top-[128px] left-[256px] w-[256px] h-[192px] bg-[#3fb950] opacity-80 border-2 border-black/20 shadow-inner rounded-sm mix-blend-overlay"></div>
                
                {/* Water Body */}
                <div className="absolute bottom-[64px] right-[128px] w-[192px] h-[256px] bg-[#1f6feb] opacity-90 border-t-4 border-l-4 border-blue-400/50 shadow-inner rounded-tl-[64px]"></div>

                {/* Collision Overlay (red grid) */}
                {activeLayer === 'Collision' && (
                   <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTMyIDBMMCAwIDAgMzIiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDAsIDAsIDAuMikiLz48L3N2Zz4=')] z-20 pointer-events-none">
                      {/* Collision Blocks */}
                      <div className="absolute top-[64px] left-[64px] w-[96px] h-[32px] bg-red-500/50 border border-red-500 flex items-center justify-center"><XIcon size={16} className="text-red-900"/></div>
                      <div className="absolute top-[96px] left-[64px] w-[32px] h-[128px] bg-red-500/50 border border-red-500 flex items-center justify-center"><XIcon size={16} className="text-red-900"/></div>
                      <div className="absolute bottom-[64px] right-[128px] w-[192px] h-[256px] bg-blue-500/30 border border-blue-500 flex items-center justify-center backdrop-blur-sm"><span className="text-blue-900 font-bold rotate-45 text-2xl uppercase tracking-widest opacity-50">WATER COLLISION</span></div>
                   </div>
                )}

                {/* Events Overlay */}
                {activeLayer === 'Events' && (
                   <div className="absolute inset-0 z-20 pointer-events-none">
                      <div className="absolute top-[200px] left-[300px] w-[32px] h-[32px] bg-yellow-400/60 border-2 border-yellow-400 rounded-sm flex items-center justify-center animate-pulse"><Zap size={16} className="text-yellow-900"/></div>
                      <div className="absolute top-[200px] left-[300px] bg-yellow-400 text-black font-bold px-1.5 rounded -translate-y-full -translate-x-1/2 ml-[16px] text-[8px] whitespace-nowrap shadow-lg">EV_NPC_Blacksmith</div>

                      <div className="absolute top-[400px] left-[150px] w-[64px] h-[32px] bg-purple-500/60 border-2 border-purple-500 rounded-sm flex items-center justify-center"><ActionIcon size={16} className="text-purple-900"/></div>
                      <div className="absolute top-[400px] left-[150px] bg-purple-500 text-white font-bold px-1.5 rounded -translate-y-full ml-[16px] text-[8px] whitespace-nowrap shadow-lg">TP_To_Dungeon</div>
                   </div>
                )}

                {/* Mouse Hover Indicator */}
                <div className="absolute top-[256px] left-[384px] w-[32px] h-[32px] border-2 border-white shadow-[0_0_10px_white] z-30 bg-yellow-400/20 pointer-events-none"></div>
             </div>
         </div>

         {/* Property Inspector (Right) */}
         <div className="w-72 bg-[#252525] border-l border-[#333] flex flex-col shrink-0 overflow-hidden">
            <div className="px-3 py-2 bg-[#1e1e1e] border-b border-[#333] font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-2 shadow-sm">
               <Settings2 size={14} className="text-[#e3b341]"/> Detail Inspector
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar text-[10px]">
               {/* Mode dependent properties */}
               {activeLayer === 'Collision' && (
                  <>
                     <div className="bg-[#1e1e1e] border border-[#444] rounded overflow-hidden">
                        <div className="bg-[#333] px-2 py-1.5 font-bold text-white flex justify-between">Selected Block <span className="font-mono text-[#888]">#COL_422</span></div>
                        <div className="p-2 space-y-2">
                           <div className="flex justify-between items-center"><span className="text-[#aaa]">Type</span>
                              <select className="bg-[#111] border border-[#444] rounded px-2 py-0.5 text-white outline-none">
                                 <option>Solid (Wall)</option>
                                 <option>Passable</option>
                                 <option>Water (Swim)</option>
                                 <option>Lava (Damage)</option>
                                 <option>Ice (Slide)</option>
                              </select>
                           </div>
                           <div className="flex justify-between items-center"><span className="text-[#aaa]">Z-Index Override</span><input type="number" defaultValue="0" className="w-16 bg-[#111] border border-[#444] rounded px-1 py-0.5 text-white text-right"/></div>
                           <div className="flex gap-2 items-center mt-2 border-t border-[#333] pt-2">
                              <input type="checkbox" className="accent-[#0070d2]" defaultChecked/><span className="text-white">Blocks Line of Sight</span>
                           </div>
                           <div className="flex gap-2 items-center mt-1">
                              <input type="checkbox" className="accent-[#0070d2]"/><span className="text-white">Blocks Projectiles</span>
                           </div>
                        </div>
                     </div>
                     <button className="w-full py-1.5 bg-[#444] hover:bg-[#555] text-white rounded font-bold transition-colors">Generate Convex Hull</button>
                  </>
               )}

               {activeLayer === 'Events' && (
                  <>
                     <div className="bg-[#1e1e1e] border border-[#444] rounded overflow-hidden">
                        <div className="bg-[#333] px-2 py-1.5 font-bold text-yellow-400 flex justify-between">Event Node <span className="font-mono text-[#888]">EV_NPC_Blacksmith</span></div>
                        <div className="p-2 space-y-3">
                           <div className="flex flex-col gap-1">
                              <span className="text-[#aaa]">Trigger Condition</span>
                              <select className="bg-[#111] border border-[#444] rounded px-2 py-1 text-white outline-none w-full">
                                 <option>Action Button</option>
                                 <option>Player Touch</option>
                                 <option>Event Touch</option>
                                 <option>Autorun</option>
                                 <option>Parallel Process</option>
                              </select>
                           </div>

                           <div className="flex flex-col gap-1">
                              <span className="text-[#aaa]">Graphic</span>
                              <div className="flex gap-2">
                                 <div className="w-8 h-8 bg-black border border-[#444] rounded relative overflow-hidden flex items-center justify-center">
                                    <div className="text-[20px] mb-1">🧔</div>
                                 </div>
                                 <button className="flex-1 bg-[#444] hover:bg-[#555] rounded text-white font-bold transition-colors">Select Sprite...</button>
                              </div>
                           </div>
                           
                           <div className="flex flex-col gap-1">
                              <span className="text-[#aaa]">Movement Route</span>
                              <select className="bg-[#111] border border-[#444] rounded px-2 py-1 text-white outline-none w-full">
                                 <option>Fixed</option>
                                 <option>Random Patrol</option>
                                 <option>Approach Player</option>
                                 <option>Custom Route...</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     <div className="bg-[#1e1e1e] border border-[#444] rounded overflow-hidden flex flex-col h-48">
                        <div className="bg-[#333] px-2 py-1.5 font-bold text-white flex justify-between">
                           Execution Script List
                           <button className="text-yellow-400 hover:text-white"><PlusIcon size={12}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-1 text-[9px] font-mono bg-[#111]">
                           <div className="flex gap-2 text-[#aaa] hover:bg-[#222] p-0.5 rounded cursor-pointer">
                              <span className="text-blue-400">◆</span> Show Text: "Welcome to my forge! Need a blade?"
                           </div>
                           <div className="flex gap-2 text-[#aaa] hover:bg-[#222] p-0.5 rounded cursor-pointer">
                              <span className="text-blue-400">◆</span> Play SE: "Anvil_Strike_01" (Vol: 80, Pitch: 100)
                           </div>
                           <div className="flex gap-2 text-[#aaa] hover:bg-[#222] p-0.5 rounded cursor-pointer">
                              <span className="text-blue-400">◆</span> Shop Processing: [Iron Sword, Steel Shield, Potion]
                           </div>
                           <div className="flex gap-2 text-[#aaa] hover:bg-[#222] p-0.5 rounded cursor-pointer pl-4 opacity-50">
                              <span className="text-gray-500">◇</span> Wait for input...
                           </div>
                        </div>
                     </div>
                  </>
               )}

               {(activeLayer !== 'Collision' && activeLayer !== 'Events') && (
                  <div className="bg-[#1e1e1e] border border-[#444] rounded overflow-hidden">
                     <div className="bg-[#333] px-2 py-1.5 font-bold text-white flex items-center gap-2">
                        <Brush size={12}/> Brush Properties
                     </div>
                     <div className="p-2 space-y-3">
                        <div className="flex justify-between items-center"><span className="text-[#aaa]">Brush Shape</span>
                           <div className="flex bg-[#111] rounded border border-[#444] overflow-hidden">
                              <button className="px-2 py-1 bg-[#444] text-white border-r border-[#444]"><Square size={12}/></button>
                              <button className="px-2 py-1 text-[#aaa] hover:bg-[#333]"><Circle size={12}/></button>
                           </div>
                        </div>
                        <div className="flex flex-col gap-1">
                           <div className="flex justify-between"><span className="text-[#aaa]">Brush Size</span><span className="text-white">1x1</span></div>
                           <input type="range" min="1" max="10" defaultValue="1" className="w-full accent-[#0070d2]"/>
                        </div>
                        <div className="flex gap-2 items-center mt-2 border-t border-[#333] pt-2">
                           <input type="checkbox" className="accent-[#0070d2]" defaultChecked/><span className="text-white">Auto-Tiling Connected</span>
                        </div>
                        <div className="flex gap-2 items-center mt-1">
                           <input type="checkbox" className="accent-[#0070d2]"/><span className="text-white">Randomize Variations</span>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}

function PlusIcon({size, className}: {size: number, className?: string}) {
   return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}

function XIcon({size, className}: {size: number, className?: string}) {
   return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
}

function ActionIcon({size, className}: {size: number, className?: string}) {
    return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
}
