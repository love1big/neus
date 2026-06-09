import React, { useState } from 'react';
import { Image, Layers, Sparkles, Type, PenTool, MousePointer2, Move, ZoomIn, ZoomOut, Crop, Copy, Scissors, Trash2, Eye, EyeOff, Lock, Unlock, Square, Circle, PaintBucket, Pipette, Brush, Eraser, Filter, SlidersHorizontal, Settings2, Download, Save, FolderOpen, RotateCcw, RotateCw, Monitor, X, Check, BoxSelect, Maximize, Blend, Wand2 } from 'lucide-react';

export default function AdvancedImageEditor() {
  const [activeTool, setActiveTool] = useState('Brush');
  const [activeLayer, setActiveLayer] = useState(2);
  const [zoom, setZoom] = useState(100);

  const tools = [
    { icon: <MousePointer2 size={16}/>, name: 'Move (V)' },
    { icon: <BoxSelect size={16}/>, name: 'Rectangular Marquee (M)' },
    { icon: <Wand2 size={16}/>, name: 'Magic Wand (W)' },
    { icon: <Crop size={16}/>, name: 'Crop (C)' },
    { icon: <Pipette size={16}/>, name: 'Eyedropper (I)' },
    { icon: <Brush size={16}/>, name: 'Brush (B)' },
    { icon: <PenTool size={16}/>, name: 'Pen (P)' },
    { icon: <Eraser size={16}/>, name: 'Eraser (E)' },
    { icon: <PaintBucket size={16}/>, name: 'Paint Bucket (G)' },
    { icon: <Blend size={16}/>, name: 'Gradient (G)' },
    { icon: <Type size={16}/>, name: 'Text (T)' },
    { icon: <Square size={16}/>, name: 'Rectangle (U)' },
    { icon: <Circle size={16}/>, name: 'Ellipse (U)' },
    { icon: <ZoomIn size={16}/>, name: 'Zoom (Z)' }
  ];

  const layers = [
    { id: 4, name: 'Highlights', visible: true, locked: false, blend: 'Screen', opacity: 80, type: 'raster' },
    { id: 3, name: 'Main Text', visible: true, locked: false, blend: 'Normal', opacity: 100, type: 'text' },
    { id: 2, name: 'Character Render', visible: true, locked: false, blend: 'Normal', opacity: 100, type: 'raster' },
    { id: 1, name: 'Background Base', visible: true, locked: true, blend: 'Normal', opacity: 100, type: 'vector' },
  ];

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#1e1e1e] text-[#cccccc] font-sans text-xs overflow-hidden select-none">
      {/* Top Menu Bar */}
      <div className="flex items-center justify-between border-b border-[#333333] bg-[#2d2d2d] px-2 py-1 shrink-0">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0070d2] text-white rounded text-[10px] font-bold shadow"><Image size={14} /> Raster Forge Pro</div>
            <div className="flex items-center text-[11px] gap-3 font-medium">
               <span className="hover:text-white cursor-pointer transition-colors px-1">File</span>
               <span className="hover:text-white cursor-pointer transition-colors px-1">Edit</span>
               <span className="hover:text-white cursor-pointer transition-colors px-1">Image</span>
               <span className="hover:text-white cursor-pointer transition-colors px-1">Layer</span>
               <span className="hover:text-white cursor-pointer transition-colors px-1">Select</span>
               <span className="hover:text-white cursor-pointer transition-colors px-1">Filter</span>
               <span className="hover:text-white cursor-pointer transition-colors px-1">View</span>
               <span className="hover:text-white cursor-pointer transition-colors px-1">Window</span>
            </div>
         </div>
      </div>

      {/* Options Bar */}
      <div className="flex items-center gap-4 border-b border-[#333333] bg-[#333333] px-3 py-1.5 shrink-0 text-[11px]">
         <div className="flex items-center gap-2 border-r border-[#444] pr-4">
            <Brush size={14}/>
            <button className="flex items-center gap-1 bg-[#444] hover:bg-[#555] px-2 py-0.5 rounded border border-[#222]">
               <div className="w-2 h-2 rounded-full bg-white"></div>
               <span>15 px</span>
               <ChevronDown size={10}/>
            </button>
            <button className="flex items-center gap-1 bg-[#444] hover:bg-[#555] px-2 py-0.5 rounded border border-[#222]">
               <span>Hardness: 0%</span>
               <ChevronDown size={10}/>
            </button>
         </div>
         <div className="flex items-center gap-2 border-r border-[#444] pr-4">
            <span>Blend Mode:</span>
            <select className="bg-[#444] border border-[#222] rounded px-1 py-0.5 text-[#ccc] outline-none">
               <option>Normal</option>
               <option>Multiply</option>
               <option>Screen</option>
               <option>Overlay</option>
               <option>Color Dodge</option>
            </select>
         </div>
         <div className="flex items-center gap-2">
            <span>Opacity:</span>
            <input type="range" min="0" max="100" defaultValue="100" className="w-24 accent-[#0070d2]"/>
            <span className="w-8 text-right">100%</span>
         </div>
         <div className="flex items-center gap-2 ml-4">
            <span>Flow:</span>
            <input type="range" min="0" max="100" defaultValue="100" className="w-24 accent-[#0070d2]"/>
            <span className="w-8 text-right">100%</span>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Left Toolbar */}
         <div className="w-10 bg-[#2d2d2d] border-r border-[#333333] flex flex-col items-center py-2 gap-1 z-10 shrink-0">
            {tools.map(t => (
               <button 
                 key={t.name}
                 onClick={() => setActiveTool(t.name.split(' ')[0])}
                 className={`w-7 h-7 rounded flex items-center justify-center transition-all ${activeTool === t.name.split(' ')[0] ? 'bg-[#1a1a1a] text-white shadow-inner border border-[#111]' : 'text-[#aaa] hover:bg-[#444] hover:text-white'}`}
                 title={t.name}
               >
                  {t.icon}
               </button>
            ))}
            
            <div className="mt-auto flex flex-col items-center gap-2 pb-2">
               {/* Color Picker */}
               <div className="relative w-7 h-7">
                  <div className="absolute top-0 w-4 h-4 rounded-sm border border-black bg-white z-10 right-0 cursor-pointer shadow-sm"></div>
                  <div className="absolute bottom-0 w-4 h-4 rounded-sm border border-black bg-black left-0 cursor-pointer shadow-sm"></div>
               </div>
               <button className="text-[#aaa] hover:text-white"><RotateCcw size={12} title="Switch Colors (X)"/></button>
            </div>
         </div>

         {/* Canvas Area */}
         <div className="flex-1 bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center custom-scrollbar">
            {/* Rulers */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#333] border-b border-[#222] font-mono text-[8px] flex overflow-hidden opacity-80">
               {Array.from({length: 40}).map((_, i) => (
                  <div key={'x'+i} className="min-w-[50px] border-l border-[#555] pl-1 relative">
                     {i * 50}
                     <div className="absolute bottom-0 left-1/4 w-[1px] h-1.5 bg-[#444]"></div>
                     <div className="absolute bottom-0 left-2/4 w-[1px] h-2 bg-[#444]"></div>
                     <div className="absolute bottom-0 left-3/4 w-[1px] h-1.5 bg-[#444]"></div>
                  </div>
               ))}
            </div>
            <div className="absolute top-0 left-0 bottom-0 w-4 bg-[#333] border-r border-[#222] font-mono text-[8px] flex flex-col overflow-hidden opacity-80 pt-4">
               {Array.from({length: 30}).map((_, i) => (
                  <div key={'y'+i} className="min-h-[50px] border-t border-[#555] pt-1 text-center relative rotate-[-90deg] leading-[4px]">
                     {i * 50}
                  </div>
               ))}
            </div>

            {/* The Image Canvas */}
            <div 
               className="relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+CjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNjY2MiLz4KPHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iI2NjYyIvPgo8cmVjdCB4PSI4IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHk9IjgiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiLz4KPC9zdmc+')] shadow-[0_0_20px_rgba(0,0,0,0.8)]"
               style={{ width: '800px', height: '600px', transform: `scale(${zoom / 100})` }}
            >
               {/* Layer 1 - BG */}
               <div className="absolute inset-0 bg-blue-900"></div>
               {/* Layer 2 - Gradient */}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-red-900 opacity-60"></div>
               {/* Layer 3 - Main Subject */}
               <div className="absolute top-[100px] left-[200px] w-[400px] h-[400px] bg-center bg-cover bg-no-repeat shadow-2xl rounded-lg border-2 border-dashed border-[#0070d2]" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=400)'}}>
                  {/* Transform Bounds */}
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-black cursor-nwse-resize"></div>
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border border-black cursor-ns-resize"></div>
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-black cursor-nesw-resize"></div>
                  <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border border-black cursor-ew-resize"></div>
                  <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border border-black cursor-ew-resize"></div>
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-black cursor-nesw-resize"></div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border border-black cursor-ns-resize"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-black cursor-nwse-resize"></div>
               </div>
               {/* Layer 4 - Text */}
               <div className="absolute top-[50px] left-[150px] text-white text-6xl font-black italic drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] mix-blend-screen">
                  CYBERPUNK
               </div>
               
               {/* Active Brush Preview */}
               {activeTool === 'Brush' && (
                  <div className="absolute top-[300px] left-[400px] w-[15px] h-[15px] rounded-full border border-white mix-blend-difference pointer-events-none z-50"></div>
               )}
            </div>
            
            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-4 bg-[#2d2d2d] border border-[#333] rounded px-3 py-1.5 flex items-center gap-3 text-white shadow-lg">
               <button onClick={() => setZoom(z => Math.max(10, z - 10))}><ZoomOut size={14}/></button>
               <span className="font-mono w-12 text-center">{zoom}%</span>
               <button onClick={() => setZoom(z => Math.min(500, z + 10))}><ZoomIn size={14}/></button>
            </div>
         </div>

         {/* Right Panels */}
         <div className="w-64 bg-[#2d2d2d] border-l border-[#333] flex flex-col shrink-0">
            {/* Color/Swatches Panel */}
            <div className="h-48 border-b border-[#333] flex flex-col">
               <div className="flex bg-[#333] border-b border-[#222]">
                  <button className="px-3 py-1 bg-[#444] text-white font-bold text-[10px]">Color</button>
                  <button className="px-3 py-1 text-[#aaa] hover:bg-[#3a3a3a] text-[10px]">Swatches</button>
                  <button className="px-3 py-1 text-[#aaa] hover:bg-[#3a3a3a] text-[10px]">Gradients</button>
               </div>
               <div className="p-3 flex-1 flex flex-col gap-2">
                  <div className="h-24 rounded w-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 relative cursor-crosshair">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-50"></div>
                     {/* Color picker handle */}
                     <div className="absolute top-[30%] left-[60%] w-3 h-3 rounded-full border-2 border-white bg-blue-400 shadow-[0_0_5px_black] transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                  <div className="flex gap-2 h-4">
                     {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffffff', '#000000'].map(c => (
                        <div key={c} className="flex-1 rounded-sm border border-[#555] cursor-pointer" style={{backgroundColor: c}}></div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Properties Panel */}
            <div className="h-48 border-b border-[#333] flex flex-col">
               <div className="flex bg-[#333] border-b border-[#222]">
                  <button className="px-3 py-1 bg-[#444] text-white font-bold text-[10px]">Properties</button>
                  <button className="px-3 py-1 text-[#aaa] hover:bg-[#3a3a3a] text-[10px]">Adjustments</button>
               </div>
               <div className="p-3 flex-1 overflow-y-auto custom-scrollbar space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                     <span className="font-bold">Transform</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                     <div className="flex items-center bg-[#1a1a1a] border border-[#444] rounded overflow-hidden">
                        <span className="bg-[#333] px-1.5 py-1 text-[#888] font-bold">W</span>
                        <input type="number" defaultValue="400" className="w-full bg-transparent px-1 outline-none text-white font-mono"/>
                        <span className="px-1 text-[#666]">px</span>
                     </div>
                     <div className="flex items-center bg-[#1a1a1a] border border-[#444] rounded overflow-hidden">
                        <span className="bg-[#333] px-1.5 py-1 text-[#888] font-bold">H</span>
                        <input type="number" defaultValue="400" className="w-full bg-transparent px-1 outline-none text-white font-mono"/>
                        <span className="px-1 text-[#666]">px</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                     <div className="flex items-center bg-[#1a1a1a] border border-[#444] rounded overflow-hidden">
                        <span className="bg-[#333] px-1.5 py-1 text-[#888] font-bold">X</span>
                        <input type="number" defaultValue="200" className="w-full bg-transparent px-1 outline-none text-white font-mono"/>
                        <span className="px-1 text-[#666]">px</span>
                     </div>
                     <div className="flex items-center bg-[#1a1a1a] border border-[#444] rounded overflow-hidden">
                        <span className="bg-[#333] px-1.5 py-1 text-[#888] font-bold">Y</span>
                        <input type="number" defaultValue="100" className="w-full bg-transparent px-1 outline-none text-white font-mono"/>
                        <span className="px-1 text-[#666]">px</span>
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] mt-4">
                     <span className="font-bold">Effects</span>
                     <PlusIcon size={12} className="cursor-pointer hover:text-white text-[#888]"/>
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center justify-between bg-[#222] p-1.5 rounded border border-[#333] text-[10px]">
                        <div className="flex items-center gap-2"><Eye size={12}/> Drop Shadow</div>
                        <Settings2 size={12} className="cursor-pointer hover:text-white text-[#888]"/>
                     </div>
                     <div className="flex items-center justify-between bg-[#222] p-1.5 rounded border border-[#333] text-[10px]">
                        <div className="flex items-center gap-2"><Eye size={12}/> Outer Glow</div>
                        <Settings2 size={12} className="cursor-pointer hover:text-white text-[#888]"/>
                     </div>
                  </div>
               </div>
            </div>

            {/* Layers Panel */}
            <div className="flex-1 flex flex-col bg-[#222]">
               <div className="flex bg-[#333] border-b border-[#222] shrink-0">
                  <button className="px-3 py-1 bg-[#444] text-white font-bold text-[10px]">Layers</button>
                  <button className="px-3 py-1 text-[#aaa] hover:bg-[#3a3a3a] text-[10px]">Channels</button>
                  <button className="px-3 py-1 text-[#aaa] hover:bg-[#3a3a3a] text-[10px]">Paths</button>
               </div>
               
               <div className="p-2 border-b border-[#333] flex flex-col gap-2 shrink-0">
                  <div className="flex items-center gap-2 text-[10px]">
                     <select className="bg-[#333] border border-[#444] rounded px-1 py-0.5 text-white outline-none flex-1">
                        <option>Normal</option>
                        <option>Screen</option>
                        <option>Multiply</option>
                        <option>Overlay</option>
                     </select>
                     <div className="flex items-center items-center gap-1 bg-[#333] border border-[#444] rounded px-1 min-w-[80px]">
                        <span className="text-[#888]">Opac:</span>
                        <input type="number" defaultValue="100" className="w-full bg-transparent px-1 outline-none text-white font-mono text-right"/>
                        <span className="text-[#888]">%</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 text-[#888]">
                     <span className="text-[10px]">Lock:</span>
                     <div className="flex items-center gap-1">
                        <Lock size={12} className="hover:text-white cursor-pointer"/>
                        <Brush size={12} className="hover:text-white cursor-pointer"/>
                        <Move size={12} className="hover:text-white cursor-pointer"/>
                     </div>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {layers.map(layer => (
                     <div 
                        key={layer.id} 
                        onClick={() => setActiveLayer(layer.id)}
                        className={`flex items-center gap-2 p-1.5 border-b border-[#2d2d2d] cursor-pointer transition-colors ${activeLayer === layer.id ? 'bg-[#0070d2] text-white' : 'hover:bg-[#333]'}`}
                     >
                        <button className={`${activeLayer === layer.id ? 'text-white' : 'text-[#888]'} hover:text-white`}><Eye size={14}/></button>
                        <div className="w-8 h-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjY2NjIi8+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNjY2MiLz4KPHJlY3QgeD0iNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZiIvPgo8cmVjdCB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==')] overflow-hidden rounded-sm border border-[#111] shrink-0">
                           {layer.type === 'raster' && <div className="w-full h-full bg-gradient-to-br from-red-500 to-blue-500 opacity-80"></div>}
                           {layer.type === 'vector' && <div className="w-full h-full bg-blue-900 border-2 border-white/20"></div>}
                           {layer.type === 'text' && <div className="w-full h-full bg-white flex items-center justify-center text-black font-serif font-bold text-[8px]">T</div>}
                        </div>
                        <span className="text-[11px] truncate flex-1">{layer.name}</span>
                        {layer.locked && <Lock size={10} className="opacity-50"/>}
                     </div>
                  ))}
               </div>
               
               <div className="flex items-center justify-between p-2 bg-[#2d2d2d] border-t border-[#333] shrink-0 text-[#888]">
                  <div className="flex gap-2">
                     <button className="hover:text-white"><Layers size={14}/></button>
                     <button className="hover:text-white"><Filter size={14}/></button>
                     <button className="hover:text-white"><Square size={14}/></button>
                  </div>
                  <div className="flex gap-2">
                     <button className="hover:text-white"><FolderOpen size={14}/></button>
                     <button className="hover:text-white"><PlusIcon size={14}/></button>
                     <button className="hover:text-white"><Trash2 size={14}/></button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function ChevronDown({size}: {size: number}) {
   return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
}

function PlusIcon({size, className}: {size: number, className: string}) {
   return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}
