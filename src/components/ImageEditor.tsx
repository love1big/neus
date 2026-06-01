import React, { useState } from 'react';
import { 
  ImageIcon, MousePointer2, BoxSelect, Wand2, Scissors, PenTool, Pen, Copy, Wrench, Droplets, Sun, Palette, Ruler,
  Layers, Settings2, Sliders, Brush, Type, Image as ImageLucide, Cpu, DownloadCloud, RotateCw, Trash2, Plus, Move, 
  Grid, ZoomIn, Eye, Hexagon, Component, AlignLeft, PaintBucket, Pipette, Zap, FileCode2, BookOpen, Orbit, Maximize, BrainCircuit, Bot, Sparkles, Lock, SlidersHorizontal, Network, Link2, Download, Focus, LayoutTemplate as LayoutTemplateIcon
} from 'lucide-react';

export default function ImageEditor({ setActiveTool }: { setActiveTool?: (tool: string) => void }) {
  const [activeWorkspace, setActiveWorkspace] = useState<'PhotoCompositing' | 'VectorDesign' | 'Painting' | 'PBRTexturing' | 'PixelArt' | 'Lightroom' | 'AIGen'>('PhotoCompositing');
  const [leftTab, setLeftTab] = useState<'Tools' | 'Assets'>('Tools');

  // Renders the workspace navigation
  const renderWorkspaceTabs = () => (
    <div className="flex bg-[#161b22] border-b border-[#30363d] shrink-0 overflow-x-auto custom-scrollbar items-center px-4 py-1.5 gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.5)] z-20">
      <WorkspaceBtn active={activeWorkspace === 'PhotoCompositing'} onClick={() => setActiveWorkspace('PhotoCompositing')} label="Raster Comp (PS)" />
      <WorkspaceBtn active={activeWorkspace === 'VectorDesign'} onClick={() => setActiveWorkspace('VectorDesign')} label="Vector/Curve (AI)" />
      <WorkspaceBtn active={activeWorkspace === 'Painting'} onClick={() => setActiveWorkspace('Painting')} label="Digital Paint" />
      <WorkspaceBtn active={activeWorkspace === 'PBRTexturing'} onClick={() => setActiveWorkspace('PBRTexturing')} label="Material Nodes" />
      <WorkspaceBtn active={activeWorkspace === 'PixelArt'} onClick={() => setActiveWorkspace('PixelArt')} label="Pixel Canvas" />
      <WorkspaceBtn active={activeWorkspace === 'Lightroom'} onClick={() => setActiveWorkspace('Lightroom')} label="RAW Develop" />
      <WorkspaceBtn active={activeWorkspace === 'AIGen'} onClick={() => setActiveWorkspace('AIGen')} label="AI Generative Tensor" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#8b949e] font-sans">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#bc8cff]/5 to-transparent pointer-events-none"></div>
        <ImageIcon size={28} className="text-[#bc8cff] mr-4 shadow-[0_0_15px_rgba(188,140,255,0.4)]" />
        <div className="flex flex-col z-10 w-full">
           <div className="flex justify-between items-center w-full">
              <div>
                 <h2 className="text-[#c9d1d9] text-[16px] font-bold tracking-tight">Apex Omni-Image Studio Professional</h2>
                 <p className="text-[#8b949e] text-[11px]">Unifies complete 2D pipelines: Node based compositing, Vector tools, PBR workflows, RAW Grading, & Local Offline AIGen.</p>
              </div>
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 bg-[#161b22] border border-[#30363d] hover:bg-[#21262d] rounded text-[11px] font-bold text-[#c9d1d9] flex items-center gap-1"><DownloadCloud size={12}/> Cloud Sync</button>
                 <button className="px-3 py-1.5 bg-[#bc8cff]/10 border border-[#bc8cff]/30 hover:bg-[#bc8cff]/20 rounded text-[11px] font-bold text-[#bc8cff] flex items-center gap-1 shadow-[0_0_10px_rgba(188,140,255,0.1)]"><Download size={12}/> Export Assets...</button>
              </div>
           </div>
        </div>
      </div>

      {renderWorkspaceTabs()}

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Vertical Tool Palette */}
        {activeWorkspace !== 'AIGen' && (
           <div className="w-[50px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 items-center py-2 gap-2 text-[#8b949e] overflow-y-auto custom-scrollbar z-10 shadow-[10px_0_20px_rgba(0,0,0,0.6)]">
              {activeWorkspace === 'PhotoCompositing' && (
                <>
                   <ToolBtn icon={<MousePointer2 size={16}/>} active color="text-[#58a6ff]" />
                   <ToolBtn icon={<BoxSelect size={16}/>} />
                   <ToolBtn icon={<Wand2 size={16}/>} />
                   <div className="w-6 h-px bg-[#30363d] my-1"></div>
                   <ToolBtn icon={<Scissors size={16}/>} />
                   <ToolBtn icon={<Brush size={16}/>} />
                   <ToolBtn icon={<Copy size={16}/>} />
                   <ToolBtn icon={<Wrench size={16}/>} />
                   <ToolBtn icon={<Droplets size={16}/>} />
                   <div className="w-6 h-px bg-[#30363d] my-1"></div>
                   <ToolBtn icon={<Type size={16}/>} />
                   <ToolBtn icon={<PenTool size={16}/>} />
                   <div className="flex-1"></div>
                   <ColorSwatches activeColor="#58a6ff" />
                </>
              )}
              {activeWorkspace === 'VectorDesign' && (
                 <>
                   <ToolBtn icon={<MousePointer2 size={16}/>} active color="text-[#e3b341]" />
                   <ToolBtn icon={<Focus size={16} />} />
                   <div className="w-6 h-px bg-[#30363d] my-1"></div>
                   <ToolBtn icon={<PenTool size={16}/>} />
                   <ToolBtn icon={<Pen size={16}/>} />
                   <ToolBtn icon={<Component size={16}/>} />
                   <div className="w-6 h-px bg-[#30363d] my-1"></div>
                   <ToolBtn icon={<AlignLeft size={16}/>} />
                   <ToolBtn icon={<Type size={16}/>} />
                   <div className="flex-1"></div>
                   <ColorSwatches activeColor="#e3b341" secondaryColor="#f85149"/>
                 </>
              )}
              {activeWorkspace === 'Painting' && (
                 <>
                   <ToolBtn icon={<Brush size={16}/>} active color="text-[#f85149]" />
                   <ToolBtn icon={<Pen size={16}/>} />
                   <ToolBtn icon={<Pipette size={16}/>} />
                   <div className="w-6 h-px bg-[#30363d] my-1"></div>
                   <ToolBtn icon={<PaintBucket size={16}/>} />
                   <ToolBtn icon={<Droplets size={16}/>} />
                   <div className="flex-1"></div>
                   <ColorSwatches activeColor="#f85149" secondaryColor="#e3b341"/>
                 </>
              )}
              {activeWorkspace === 'PBRTexturing' && (
                 <>
                   <ToolBtn icon={<MousePointer2 size={16}/>} active color="text-[#3fb950]" />
                   <ToolBtn icon={<Brush size={16}/>} />
                   <div className="w-6 h-px bg-[#30363d] my-1"></div>
                   <ToolBtn icon={<BoxSelect size={16}/>} />
                   <ToolBtn icon={<Hexagon size={16}/>} />
                   <div className="flex-1"></div>
                 </>
              )}
              {activeWorkspace === 'PixelArt' && (
                 <>
                   <ToolBtn icon={<Pen size={16}/>} active color="text-[#58a6ff]" />
                   <ToolBtn icon={<PaintBucket size={16}/>} />
                   <div className="w-6 h-px bg-[#30363d] my-1"></div>
                   <ToolBtn icon={<BoxSelect size={16}/>} />
                   <ToolBtn icon={<Scissors size={16}/>} />
                   <div className="flex-1"></div>
                   <ColorSwatches activeColor="#58a6ff" secondaryColor="#050505"/>
                 </>
              )}
              {activeWorkspace === 'Lightroom' && (
                 <>
                   <ToolBtn icon={<Sun size={16}/>} active color="text-[#bc8cff]" />
                   <ToolBtn icon={<Focus size={16}/>} />
                   <div className="w-6 h-px bg-[#30363d] my-1"></div>
                   <ToolBtn icon={<Droplets size={16}/>} />
                   <ToolBtn icon={<BoxSelect size={16}/>} />
                 </>
              )}
           </div>
        )}

        {/* Center Canvas Area */}
        <div className="flex-1 bg-[#050505] relative flex flex-col overflow-hidden">
           {/* Top Canvas Bar */}
           <div className="h-10 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between px-4 text-[11px] font-mono text-[#8b949e] shrink-0 z-10 shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-6">
                 <span>Zoom: 142.5%</span>
                 <span>Angle: 0.0°</span>
                 {activeWorkspace === 'PixelArt' && <span className="text-[#e3b341]">Grid: 16x16 px</span>}
                 {activeWorkspace === 'PBRTexturing' && <span className="text-[#3fb950]">Env: Studio HDRI / F-Stop: f/2.8</span>}
                 {activeWorkspace === 'Lightroom' && <span className="text-[#bc8cff]">ISO: 100 / 35mm / 1/200s</span>}
              </div>
              <div className="flex items-center gap-4">
                 <button className="flex items-center gap-1 hover:text-white transition-colors"><Grid size={14}/> Grid</button>
                 <button className="flex items-center gap-1 hover:text-white transition-colors"><Maximize size={14}/> Fit Screen</button>
              </div>
           </div>

           {/* The Canvas Contexts */}
           <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#050505] z-0">
               
               {/* Pattern Backgrounds */}
               <div className="absolute inset-0 z-0 opacity-[0.03]">
                   <div className="w-full h-full bg-[linear-gradient(to_right,#8b949e_1px,transparent_1px),linear-gradient(to_bottom,#8b949e_1px,transparent_1px)] bg-[size:24px_24px]"></div>
               </div>
               
               {activeWorkspace === 'PhotoCompositing' && (
                  <div className="relative w-full h-full p-12 flex items-center justify-center">
                     {/* Photoshop style document outline */}
                     <div className="w-[800px] h-[500px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.9)] border border-[#30363d] relative z-10 overflow-hidden ring-[1px] ring-white/10 group cursor-crosshair">
                        
                        <div className="absolute inset-0 bg-[#e5e5e5] flex items-center justify-center overflow-hidden">
                           {/* A mockup composition: */}
                           <div className="absolute bottom-0 w-full h-[60%] bg-gradient-to-t from-gray-900 to-transparent"></div>
                           <div className="w-[400px] h-[400px] bg-red-500 rounded-full blur-[80px] absolute -right-20 -bottom-20 opacity-50 mix-blend-multiply"></div>
                           <div className="w-[300px] h-[300px] bg-blue-500 rounded-full blur-[100px] absolute -left-20 top-20 opacity-50 mix-blend-multiply"></div>
                           
                           <h1 className="text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] rotate-[-4deg]">CYBER</h1>
                        </div>

                        {/* Smart Guides and selections */}
                        <div className="absolute inset-0 pointer-events-none">
                           <div className="absolute top-[20%] left-0 w-full h-px bg-cyan-400 opacity-60 mix-blend-difference"></div>
                           <div className="absolute top-[80%] left-0 w-full h-px bg-cyan-400 opacity-60 mix-blend-difference"></div>
                           <div className="absolute top-1/2 left-1/2 w-[340px] h-[120px] -translate-x-1/2 -translate-y-1/2 border border-black border-dashed flex rotate-[-4deg]">
                              <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-black"></div>
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-black"></div>
                              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-black"></div>
                              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-black"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeWorkspace === 'VectorDesign' && (
                  <div className="relative w-full h-full p-12 flex items-center justify-center">
                     <div className="w-[600px] h-[800px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.9)] relative z-10 flex items-center justify-center overflow-hidden border border-[#58a6ff]">
                        <button onClick={() => setActiveTool?.('UIUXEdit')} className="absolute top-4 right-4 bg-gradient-to-r from-[#58a6ff] to-[#3182ce] hover:from-[#79c0ff] hover:to-[#58a6ff] text-black font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-[0_10px_20px_rgba(88,166,255,0.3)] transition-all z-20 hover:scale-105">
                           <LayoutTemplateIcon size={14}/> Send to UI/UX Builder
                        </button>
                        
                        {/* Illustrator style vector paths */}
                        <svg width="100%" height="100%" className="absolute inset-0 cursor-crosshair">
                           {/* Base shape */}
                           <path d="M 150 150 C 250 50, 450 100, 450 300 C 450 500, 250 700, 150 550 C 50 400, 50 250, 150 150 Z" fill="#f0f4f8" stroke="#cbd5e1" strokeWidth="2" />
                           
                           {/* Selected path with anchors */}
                           <path d="M 200 400 Q 300 200 400 400 T 200 400" fill="none" stroke="#e3b341" strokeWidth="2.5" />
                           
                           {/* Anchor Points & Handles */}
                           <line x1="200" y1="400" x2="160" y2="440" stroke="#e3b341" strokeWidth="1" strokeDasharray="2,2"/>
                           <circle cx="160" cy="440" r="4" fill="white" stroke="#e3b341" strokeWidth="2" />
                           <rect x="197" y="397" width="6" height="6" fill="#000" />
                           
                           <line x1="300" y1="200" x2="250" y2="150" stroke="#e3b341" strokeWidth="1" strokeDasharray="2,2"/>
                           <circle cx="250" cy="150" r="4" fill="white" stroke="#e3b341" strokeWidth="2" />
                           <rect x="297" y="197" width="6" height="6" fill="#000" />
                           
                           <line x1="400" y1="400" x2="450" y2="350" stroke="#e3b341" strokeWidth="1" strokeDasharray="2,2"/>
                           <circle cx="450" cy="350" r="4" fill="white" stroke="#e3b341" strokeWidth="2" />
                           <rect x="397" y="397" width="6" height="6" fill="#white" stroke="#000" strokeWidth="1"/>

                           <text x="300" y="500" textAnchor="middle" fill="#000" fontFamily="sans-serif" fontSize="48" fontWeight="bold">Apex Vectors</text>
                           <text x="300" y="520" textAnchor="middle" fill="#58a6ff" fontFamily="monospace" fontSize="12">Selected: Bezier Curve</text>
                        </svg>
                     </div>
                  </div>
               )}

               {activeWorkspace === 'Painting' && (
                  <div className="relative w-full h-full p-12 flex items-center justify-center">
                     <div className="w-[800px] h-[600px] bg-[#e5e7eb] shadow-[0_20px_80px_rgba(0,0,0,0.9)] relative z-10 overflow-hidden cursor-crosshair">
                        {/* Painterly layout */}
                        <svg className="w-full h-full filter blur-[0.5px]">
                           {/* Strokes */}
                           <path d="M 100 100 Q 200 50, 300 200 T 500 100" fill="none" stroke="#f85149" strokeWidth="40" strokeLinecap="round" opacity="0.8" />
                           <path d="M 150 120 Q 250 80, 320 220 T 480 140" fill="none" stroke="#e3b341" strokeWidth="30" strokeLinecap="round" opacity="0.9" />
                           <path d="M 200 400 C 300 350, 400 450, 500 400" fill="none" stroke="#58a6ff" strokeWidth="60" strokeLinecap="round" opacity="0.7" style={{ filter: 'url(#brushTexture)' }}/>
                           <path d="M 250 420 C 350 370, 450 470, 550 420" fill="none" stroke="#bc8cff" strokeWidth="20" strokeLinecap="round" opacity="0.8" />
                           
                           {/* Active brush indicator */ }
                           <circle cx="400" cy="300" r="24" fill="none" stroke="black" strokeDasharray="4 4" strokeWidth="1" className="animate-[spin_4s_linear_infinite]" />
                           <circle cx="400" cy="300" r="2" fill="white" />
                        </svg>
                     </div>
                  </div>
               )}

               {activeWorkspace === 'PBRTexturing' && (
                  <div className="w-full h-full relative flex flex-col pt-10">
                     <div className="flex-1 w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#161b22] to-[#050505] relative z-10 flex items-center justify-center overflow-hidden">
                        
                        {/* Fake 3D Sphere for Material preview */}
                        <div className="w-[400px] h-[400px] rounded-full border border-black shadow-[inset_-40px_-40px_80px_rgba(0,0,0,0.8),inset_20px_20px_40px_rgba(255,255,255,0.2),0_40px_100px_rgba(0,0,0,1)] relative z-20 flex items-center justify-center bg-gradient-to-br from-[#808080] to-[#202020]">
                           {/* Surface imperfections */}
                           <div className="absolute inset-0 rounded-full opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj4KPGZpbHRlciBpZD0ibk4iPgo8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjE1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CjwvZmlsdGVyPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbk4pIiBvcGFjaXR5PSIwLjI1Ii8+Cjwvc3ZnPg==')] mix-blend-overlay"></div>
                           {/* Lighting reflection */}
                           <div className="absolute top-10 left-16 w-[120px] h-[80px] bg-white rounded-[100%] blur-[20px] opacity-30 transform -rotate-45"></div>
                           <Orbit size={100} className="text-white animate-spin-slow opacity-10 absolute mix-blend-overlay" />
                        </div>
                     </div>

                     {/* Complex Node Editor below */}
                     <div className="h-[350px] bg-[#0d1117]/95 backdrop-blur-2xl border-t-2 border-[#30363d] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-30 flex flex-col relative w-full">
                        <NodeEditorMockup setActiveTool={setActiveTool} />
                     </div>
                  </div>
               )}

               {activeWorkspace === 'PixelArt' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-12">
                     <div className="w-[512px] h-[512px] border-[4px] border-[#30363d] bg-white relative z-10 shadow-[0_20px_80px_rgba(0,0,0,0.9)] overflow-hidden">
                        {/* Pixel Grid 16x16 */}
                        <div className="absolute inset-0 grid grid-cols-16 grid-rows-16 pointer-events-none opacity-20" style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gridTemplateRows: 'repeat(16, 1fr)' }}>
                           {[...Array(256)].map((_, i) => (
                              <div key={i} className="border-r border-b border-black"></div>
                           ))}
                        </div>

                        {/* Pixel Art Mock */}
                        <div className="w-full h-full grid grid-cols-16 grid-rows-16" style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gridTemplateRows: 'repeat(16, 1fr)' }}>
                           <div className="col-start-8 col-span-2 row-start-4 row-span-2 bg-[#58a6ff]"></div>
                           <div className="col-start-7 col-span-4 row-start-6 row-span-4 bg-[#58a6ff]"></div>
                           <div className="col-start-9 col-span-1 row-start-7 row-span-1 bg-white"></div>
                           <div className="col-start-6 col-span-6 row-start-10 row-span-3 bg-[#e3b341]"></div>
                           <div className="col-start-7 col-span-2 row-start-13 row-span-2 bg-[#bc8cff]"></div>
                           <div className="col-start-10 col-span-2 row-start-13 row-span-2 bg-[#bc8cff]"></div>
                        </div>

                        {/* Selected Pixel Cursor */}
                        <div className="absolute border-2 border-white mix-blend-difference w-[32px] h-[32px]" style={{ top: '352px', left: '224px' }}></div>
                     </div>
                  </div>
               )}

               {activeWorkspace === 'Lightroom' && (
                  <div className="w-full h-full relative z-10 flex flex-col items-center justify-center p-8 bg-[#0a0a0a]">
                     <div className="w-[90%] max-w-[1200px] aspect-[3/2] bg-[#161b22] relative border-[8px] border-black shadow-[0_20px_100px_rgba(0,0,0,1)] ring-1 ring-white/10 overflow-hidden cursor-ew-resize group">
                        
                        {/* Base Image */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542051812-ba2363a61d15?w=1600&h=1000&fit=crop')] bg-cover bg-center filter saturate-50 contrast-75 brightness-110"></div>
                        
                        {/* Edited Image (Clipped) */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542051812-ba2363a61d15?w=1600&h=1000&fit=crop')] bg-cover bg-center filter saturate-150 contrast-125 brightness-90 sepia-[0.2]" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
                        
                        {/* Divider Line */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white shadow-[0_0_10px_white] z-20 group-hover:bg-[#bc8cff] transition-colors"></div>
                        
                        {/* Drag Handle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#161b22]/80 backdrop-blur border border-white rounded-full flex items-center justify-center z-30 shadow-lg text-white">
                           <Move size={14} />
                        </div>

                        {/* Watermarks */}
                        <span className="absolute bottom-4 left-4 text-white/50 text-[10px] font-bold uppercase tracking-widest drop-shadow-md">RAW Original (Sony a7R IV)</span>
                        <span className="absolute bottom-4 right-4 text-white/50 text-[10px] font-bold uppercase tracking-widest drop-shadow-md">Color Graded Post (Apex)</span>
                     </div>
                  </div>
               )}

               {activeWorkspace === 'AIGen' && (
                  <div className="w-full h-full relative z-10 flex flex-col">
                     {/* The AIGen Master layout */}
                     <div className="flex-1 flex w-full">
                        
                        {/* Output Canvas Zone */}
                        <div className="flex-1 relative flex flex-col bg-[#050505]">
                           <div className="h-10 bg-[#0d1117] border-b border-[#30363d] flex items-center px-4 justify-between z-10 shadow-md">
                              <span className="text-[#bc8cff] text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"><Sparkles size={14}/> Active Local Render Queue</span>
                              <div className="flex gap-2">
                                 <span className="text-[#3fb950] bg-[#3fb950]/10 px-2 py-0.5 rounded border border-[#3fb950]/20 text-[10px] font-mono">GPU: NVIDIA RTX 4090 / 22GB VRAM</span>
                                 <span className="text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d] text-[10px] font-mono">1.2 it/s</span>
                              </div>
                           </div>
                           <div className="flex-1 p-8 grid grid-cols-2 gap-8 items-center justify-center overflow-hidden">
                              
                              <div className="aspect-square bg-[#161b22] border-2 border-[#bc8cff]/50 rounded-2xl shadow-[0_20px_80px_rgba(188,140,255,0.15)] relative overflow-hidden group">
                                 {/* AI Image Mock */}
                                 <div className="absolute inset-0 bg-gradient-to-br from-[#2a1b38] to-[#161b22] flex items-center justify-center">
                                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#bc8cff] to-[#58a6ff]">NEON CITY</h1>
                                 </div>
                                 <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]"></div>
                                 
                                 {/* Loading Bar if generating */}
                                 <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[#0a0a0a]">
                                    <div className="h-full bg-gradient-to-r from-[#bc8cff] to-[#58a6ff] w-[100%] shadow-[0_0_10px_#bc8cff]"></div>
                                 </div>
                                 <div className="absolute top-2 left-2 bg-[#0a0a0a]/80 backdrop-blur text-white text-[9px] px-2 py-1 rounded font-mono border border-[#30363d]">Seed: 8492011</div>
                              </div>
                              
                              <div className="aspect-square bg-[#161b22] border-[4px] border-dashed border-[#30363d] rounded-2xl shadow-lg relative overflow-hidden flex flex-col items-center justify-center gap-4 text-[#8b949e]">
                                 <div className="w-16 h-16 rounded-full border-[4px] border-[#30363d] border-t-[#bc8cff] animate-spin"></div>
                                 <div className="text-[12px] font-bold uppercase tracking-widest text-[#c9d1d9]">Generating Variant 2/4...</div>
                                 <div className="text-[10px] font-mono">Step 24 / 40 (60%) <br/> ETA: 14.2s</div>
                              </div>

                           </div>
                        </div>

                        {/* Right Gen Settings Dock */}
                        <div className="w-[400px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.8)]">
                           <div className="h-10 bg-[#21262d] border-b border-[#30363d] px-4 flex items-center justify-between shadow-sm">
                              <span className="text-[12px] font-bold text-white uppercase tracking-wider flex items-center gap-2"><BrainCircuit size={16} className="text-[#bc8cff]"/> Generation Core</span>
                              <Settings2 size={14} className="text-[#8b949e]" />
                           </div>
                           
                           <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                              <div className="space-y-3">
                                 <div className="font-bold text-[11px] text-[#e3b341] uppercase tracking-widest border-b border-[#30363d] pb-1">Master Prompt</div>
                                 <div className="relative">
                                    <textarea className="w-full h-32 bg-[#0a0a0a] border border-[#bc8cff]/50 rounded-xl p-3 text-[13px] text-white resize-none outline-none focus:border-[#bc8cff] focus:ring-1 focus:ring-[#bc8cff] custom-scrollbar leading-relaxed shadow-inner" placeholder="Subject, environment, lighting, camera angle, aesthetic..."></textarea>
                                    <div className="absolute bottom-2 right-2 text-[9px] text-[#8b949e] font-mono bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d]">75/150 Tokens</div>
                                 </div>
                                 <textarea className="w-full h-16 bg-[#21262d]/50 border border-[#f85149]/30 rounded-xl p-3 text-[11px] text-[#f85149] resize-none outline-none focus:border-[#f85149] custom-scrollbar leading-relaxed shadow-inner" placeholder="Negative limits: low quality, distorted, extra limbs..."></textarea>
                              </div>

                              <div className="space-y-4">
                                 <div className="font-bold text-[11px] text-[#58a6ff] uppercase tracking-widest border-b border-[#30363d] pb-1">Tensor Sampling Parameters</div>
                                 <div className="grid grid-cols-2 gap-4 text-[11px]">
                                    <div className="flex flex-col gap-1.5">
                                       <span className="text-[#8b949e] font-bold">Base Model</span>
                                       <select className="bg-[#0a0a0a] border border-[#30363d] rounded-lg p-2 text-white font-mono shadow-inner outline-none">
                                          <option>Flux.1-Dev-FP8</option><option>SDXL-Base-1.0</option><option>SD1.5-EpicRealism</option>
                                       </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                       <span className="text-[#8b949e] font-bold">Sampler</span>
                                       <select className="bg-[#0a0a0a] border border-[#30363d] rounded-lg p-2 text-white font-mono shadow-inner outline-none">
                                          <option>Euler A (SGM)</option><option>DPM++ 2M Karras</option><option>DDIM</option>
                                       </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                       <span className="text-[#8b949e] font-bold">Aspect Ratio</span>
                                       <select className="bg-[#0a0a0a] border border-[#30363d] rounded-lg p-2 text-white font-mono shadow-inner outline-none">
                                          <option>Square (1024x1024)</option><option>16:9 (1344x768)</option><option>9:16 (768x1344)</option>
                                       </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                       <span className="text-[#8b949e] font-bold">Batch Size</span>
                                       <input type="number" defaultValue="4" className="bg-[#0a0a0a] border border-[#30363d] rounded-lg p-2 text-white font-mono shadow-inner outline-none"/>
                                    </div>
                                 </div>
                              </div>

                              <AIGenProperties />
                           </div>

                           <div className="p-5 border-t border-[#30363d] bg-[#0d1117] relative z-20">
                              <button className="w-full py-4 bg-gradient-to-r from-[#bc8cff] to-[#8a2be2] text-white font-bold text-[14px] uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(188,140,255,0.4)] hover:shadow-[0_0_30px_rgba(188,140,255,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                 <Zap size={18} className="fill-white"/> Initiate Image Synthesis
                              </button>
                           </div>
                        </div>

                     </div>
                     {/* Timeline output history */}
                     <div className="h-32 bg-[#161b22] border-t border-[#30363d] z-20 flex p-4 gap-4 overflow-x-auto custom-scrollbar shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#30363d] rounded-lg aspect-square h-full opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                           <ImageIcon size={24} className="text-[#8b949e] mb-1" />
                           <span className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest">History</span>
                        </div>
                        {[...Array(8)].map((_, i) => (
                           <div key={i} className="aspect-square h-full bg-[#0a0a0a] border border-[#30363d] rounded-lg relative overflow-hidden group cursor-pointer shadow-md">
                              <div className="absolute inset-0 bg-gradient-to-tr from-[#3182ce] to-[#1e3a8a] opacity-50"></div>
                              <div className="absolute inset-0 border-2 border-transparent hover:border-[#bc8cff] rounded-lg transition-colors"></div>
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur py-1 text-center text-[8px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">Seed: x293{i}2</div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
           </div>
        </div>

        {/* Right Dock: Details, Layers, Adjustments */}
        {activeWorkspace !== 'AIGen' && (
           <div className="w-[320px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.5)] relative">
               
               {/* Contextual Properties */}
               <div className="h-10 bg-[#21262d] border-b border-[#30363d] px-4 flex items-center justify-between shrink-0 shadow-sm">
                  <span className="text-[11px] font-bold text-white uppercase tracking-widest">Properties Inspector</span>
                  <Settings2 size={14} className="text-[#8b949e]" />
               </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {activeWorkspace === 'Lightroom' ? (
                     <LightroomProperties />
                  ) : activeWorkspace === 'PBRTexturing' ? (
                     <PBRProperties />
                  ) : activeWorkspace === 'VectorDesign' ? (
                     <VectorProperties />
                  ) : (
                     <div className="p-4 border-b border-[#30363d] space-y-4">
                        <div className="flex flex-col gap-1">
                           <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-[#8b949e]"><span >Opacity</span><span className="text-white bg-[#0a0a0a] px-1.5 py-0.5 rounded border border-[#30363d]">100%</span></div>
                           <input type="range" className="w-full h-1.5 bg-[#30363d] rounded appearance-none accent-[#58a6ff] my-2" defaultValue="100"/>
                        </div>
                        <div className="flex flex-col gap-1">
                           <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-[#8b949e] mb-1"><span>Blend Mode</span></div>
                           <select className="bg-[#0a0a0a] border border-[#30363d] rounded-md px-3 py-2 text-[12px] text-white outline-none focus:border-[#58a6ff]">
                              <option>Normal</option><option>Multiply</option><option>Screen</option><option>Overlay</option><option>Color Dodge</option><option>Difference</option>
                           </select>
                        </div>
                        {/* Brush Settings if Painting */}
                        {(activeWorkspace === 'Painting' || activeWorkspace === 'PixelArt') && (
                              <div className="pt-4 border-t border-[#30363d] mt-2">
                                 <div className="text-[#f85149] text-[11px] uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><Brush size={12}/> Brush Engine Config</div>
                                 <div className="flex justify-between text-[11px] mb-1 items-center"><span className="text-[#8b949e] uppercase font-bold">Size</span><span className="text-white bg-[#0a0a0a] px-1.5 py-0.5 rounded border border-[#30363d]">14px</span></div>
                                 <input type="range" className="w-full h-1.5 bg-[#30363d] rounded appearance-none accent-[#f85149] mb-4" defaultValue="14"/>
                                 
                                 <div className="flex justify-between text-[11px] mb-1 items-center"><span className="text-[#8b949e] uppercase font-bold">Density Flow</span><span className="text-white bg-[#0a0a0a] px-1.5 py-0.5 rounded border border-[#30363d]">50%</span></div>
                                 <input type="range" className="w-full h-1.5 bg-[#30363d] rounded appearance-none accent-[#f85149] mb-4" defaultValue="50"/>
                                 
                                 <div className="flex justify-between text-[11px] mb-1 items-center"><span className="text-[#8b949e] uppercase font-bold">Stylus Pressure</span><ToggleSwitch /></div>
                              </div>
                        )}
                        {/* Selected Layer Info */}
                        <div className="pt-4 border-t border-[#30363d] mt-2">
                           <div className="text-[#58a6ff] text-[11px] uppercase font-bold tracking-widest mb-2 flex items-center gap-2">Transform</div>
                           <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-white">
                              <div className="bg-[#0d1117] border border-[#30363d] p-1.5 rounded flex justify-between"><span className="text-[#8b949e]">X:</span> 140px</div>
                              <div className="bg-[#0d1117] border border-[#30363d] p-1.5 rounded flex justify-between"><span className="text-[#8b949e]">Y:</span> 42px</div>
                              <div className="bg-[#0d1117] border border-[#30363d] p-1.5 rounded flex justify-between"><span className="text-[#8b949e]">W:</span> 1920</div>
                              <div className="bg-[#0d1117] border border-[#30363d] p-1.5 rounded flex justify-between"><span className="text-[#8b949e]">H:</span> 1080</div>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Layers Panel */}
                  <div className="flex flex-col bg-[#0a0a0a] min-h-[50%] border-t border-[#30363d]">
                     <div className="h-10 bg-[#21262d] border-b border-[#30363d] px-4 flex items-center justify-between shrink-0 top-0 sticky z-10 shadow-sm">
                        <span className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2"><Layers size={14} className="text-[#58a6ff]"/> Composition Layers</span>
                     </div>
                     
                     <div className="flex justify-between items-center px-4 py-2 bg-[#0d1117] border-b border-[#30363d]">
                        <div className="text-[10px] bg-[#161b22] px-2 py-1 rounded border border-[#30363d] flex items-center gap-1 text-white cursor-pointer hover:bg-[#21262d]">Normal <span className="opacity-50">v</span></div>
                        <div className="flex gap-2">
                           <button className="bg-[#161b22] p-1 rounded border border-[#30363d] hover:text-[#3fb950] transition-colors"><Plus size={14}/></button>
                           <button className="bg-[#161b22] p-1 rounded border border-[#30363d] hover:text-[#58a6ff] transition-colors"><Copy size={14}/></button>
                           <button className="bg-[#161b22] p-1 rounded border border-[#30363d] hover:text-[#f85149] transition-colors"><Trash2 size={14}/></button>
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 pb-10">
                        {activeWorkspace === 'Painting' ? (
                           <>
                              <LayerItem name="Sketch Ink Details" type="image" blend="Multiply" eye iconColor="text-[#e3b341]" active hasMask/>
                              <LayerItem name="Flat Colors Base" type="image" blend="Normal" eye iconColor="text-[#58a6ff]" />
                              <LayerItem name="Paper Texture Base" type="image" blend="Multiply" eye locked iconColor="text-[#8b949e]"/>
                           </>
                        ) : activeWorkspace === 'VectorDesign' ? (
                           <>
                              <LayerItem name="Typography UI" type="image" blend="Normal" eye iconColor="text-[#e3b341]" active/>
                              <LayerItem name="Vector Shapes (Frame 1)" type="image" blend="Normal" eye iconColor="text-[#58a6ff]" />
                           </>
                        ) : (
                           <>
                              <LayerItem name="Sharpen Highlights Details" type="image" blend="Screen" eye iconColor="text-[#e3b341]" active hasMask/>
                              <LayerItem name="Shadow Correction Curve" type="fx" blend="Multiply" eye iconColor="text-[#2ea043]" hasMask/>
                              <LayerItem name="Main Core Subject Render" type="image" blend="Normal" eye iconColor="text-[#58a6ff]" hasMask/>
                              <LayerItem name="Cyberpunk Color Grade LUT" type="adjust" blend="Color Dodge" eye iconColor="text-[#bc8cff]" locked/>
                              <LayerItem name="Background Plate Base" type="image" blend="Normal" eye locked iconColor="text-[#8b949e]"/>
                           </>
                        )}
                     </div>
                  </div>
               </div>
           </div>
        )}
      </div>
    </div>
  );
}

// ---------------- Helper Components ----------------

function WorkspaceBtn({ active, onClick, label }: { active?: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-colors shrink-0 shadow-sm ${active ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50' : 'bg-[#21262d] text-[#8b949e] border border-[#30363d] hover:bg-[#30363d] hover:text-white'}`}
    >
      {label}
    </button>
  );
}

function ToolBtn({ icon, active, color }: { icon: React.ReactNode, active?: boolean, color?: string }) {
  return (
    <button className={`p-2.5 rounded-lg transition-all ${active ? `bg-[#21262d] ${color || 'text-white'} shadow-[inset_0_0_10px_rgba(0,0,0,0.5),0_0_10px_currentColor] border border-[currentColor]/30 ring-1 ring-[currentColor]/10` : 'hover:bg-[#21262d] bg-transparent text-[#8b949e] border border-transparent hover:border-[#30363d] hover:text-white'}`}>
      {icon}
    </button>
  );
}

function ColorSwatches({ activeColor, secondaryColor = "#ffffff" }: { activeColor: string, secondaryColor?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 mb-4 p-2 bg-[#0a0a0a] rounded-lg border border-[#30363d] shadow-inner">
       <div className="relative w-8 h-8 group pointer-events-auto">
          <div className="absolute bottom-0 right-0 w-5 h-5 border border-black shadow-sm cursor-pointer z-0 group-hover:border-white transition-colors" style={{ backgroundColor: secondaryColor }}></div>
          <div className="absolute top-0 left-0 w-5 h-5 border-[2px] border-black rounded-[2px] shadow-md z-10 cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: activeColor }}></div>
          <RotateCw size={10} className="absolute -top-1.5 -right-1.5 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md z-20 hover:text-[#58a6ff]" />
       </div>
    </div>
  );
}

function NodeEditorMockup({ setActiveTool }: { setActiveTool?: (tool: string) => void }) {
   return (
      <div className="w-full h-full p-4 flex flex-col bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzAzNjNkIiBzdHJva2Utb3BhY2l0eT0iMC41IiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] shadow-[inset_0_5px_20px_rgba(0,0,0,0.7)] overflow-hidden relative">
        <div className="flex justify-between items-center w-full mb-6 z-50 pointer-events-auto">
          <span className="text-[12px] font-bold text-white uppercase tracking-widest bg-[#21262d] px-4 py-1.5 rounded-lg border border-[#30363d] flex items-center gap-2 shadow-lg"><Network size={14} className="text-[#3fb950]"/> PBR Node Graph Shader</span>
          <div className="flex gap-4">
             <button className="flex items-center gap-2 text-[11px] bg-[#21262d] hover:bg-[#3fb950] hover:text-black px-4 py-1.5 rounded-lg border border-[#30363d] transition-colors text-white font-bold cursor-pointer uppercase tracking-wider shadow-lg">
               <Plus size={14}/> Add Node
             </button>
             <button onClick={() => setActiveTool?.('Material')} className="flex items-center gap-2 text-[11px] bg-gradient-to-r from-[#58a6ff] to-[#3182ce] hover:from-[#79c0ff] hover:to-[#58a6ff] text-black px-4 py-1.5 rounded-lg transition-all font-bold cursor-pointer shadow-[0_0_15px_rgba(88,166,255,0.4)] uppercase tracking-wider">
               <Link2 size={14}/> Open Full Material Builder
             </button>
          </div>
        </div>
        
        <div className="flex gap-12 items-center w-full flex-1 px-10 relative">
          
          {/* Noise Texture Node */}
          <div className="bg-[#161b22]/90 backdrop-blur border border-[#30363d] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] w-48 shrink-0 hover:border-[#8b949e] transition-colors z-20">
             <div className="bg-[#21262d] text-[#e3b341] font-bold text-[11px] p-2 border-b border-[#30363d] rounded-t-xl uppercase tracking-widest flex items-center gap-2">
                <BoxSelect size={12}/> Voro Noise
             </div>
             <div className="p-3 bg-[#0a0a0a] rounded-b-xl border-t border-black space-y-2 text-[10px] text-[#8b949e] font-mono">
                <div className="flex justify-between items-center"><span className="text-white">Scale</span> <input type="number" defaultValue="5.0" className="w-12 bg-[#161b22] border border-[#30363d] rounded text-center"/></div>
                <div className="flex justify-between items-center"><span className="text-white">Detail</span> <input type="number" defaultValue="2.0" className="w-12 bg-[#161b22] border border-[#30363d] rounded text-center"/></div>
                <div className="h-px bg-[#30363d] my-1"></div>
                <div className="flex justify-end items-center mt-2 group relative"><span className="mr-2">Fac</span><div className="w-3 h-3 rounded-full border-[2px] border-[#8b949e] bg-[#0a0a0a] cursor-crosshair hover:bg-[#8b949e]"></div></div>
                <div className="flex justify-end items-center mt-1 group relative"><span className="mr-2 text-[#e3b341]">Color</span><div className="w-3 h-3 rounded-full border-[2px] border-[#e3b341] bg-[#e3b341] cursor-crosshair hover:bg-white shadow-[0_0_5px_#e3b341]"></div></div>
             </div>
          </div>
          
          {/* Wire 1 */}
          <svg className="absolute left-[200px] w-24 h-12 text-[#e3b341] drop-shadow-[0_0_5px_rgba(227,179,65,0.8)] pointer-events-none" preserveAspectRatio="none"><path d="M0,0 C40,-20 60,30 96,16" fill="none" stroke="currentColor" strokeWidth="3"/></svg>
          {/* Wire 1b */}
          <svg className="absolute left-[200px] top-[146px] w-[540px] h-[50px] text-[#8b949e] opacity-40 pointer-events-none overflow-visible" preserveAspectRatio="none"><path d="M0,0 C100,60 400,60 540,-10" fill="none" stroke="currentColor" strokeWidth="3"/></svg>

          {/* ColorRamp Node */}
          <div className="bg-[#161b22]/90 backdrop-blur border border-[#30363d] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] w-48 shrink-0 hover:border-[#8b949e] transition-colors z-20">
             <div className="bg-[#21262d] text-[#e3b341] font-bold text-[11px] p-2 border-b border-[#30363d] rounded-t-xl uppercase tracking-widest flex items-center gap-2">
                <SlidersHorizontal size={12}/> Color Ramp
             </div>
             <div className="p-3 bg-[#0a0a0a] rounded-b-xl border-t border-black space-y-2 text-[10px] text-[#8b949e] font-mono">
                <div className="flex items-center -ml-5 group relative mb-2"><div className="w-3 h-3 rounded-full border-[2px] border-[#e3b341] bg-[#0a0a0a] cursor-crosshair hover:bg-[#e3b341] mr-2 z-10"></div><span className="text-white">Fac</span></div>
                
                <div className="h-6 w-full rounded border border-[#30363d] bg-gradient-to-r from-black to-[#58a6ff] relative my-2">
                   <div className="absolute top-full -mt-0.5 left-0 w-2 h-2 bg-white border border-black rotate-45 transform -translate-x-1/2 cursor-ew-resize"></div>
                   <div className="absolute top-full -mt-0.5 left-full w-2 h-2 bg-white border border-black rotate-45 transform -translate-x-1/2 cursor-ew-resize"></div>
                </div>

                <div className="h-px bg-[#30363d] my-1 pt-1"></div>
                <div className="flex justify-end items-center mt-1 group relative pb-1"><span className="mr-2 text-[#e3b341]">Color Out</span><div className="w-3 h-3 rounded-full border-[2px] border-[#e3b341] bg-[#e3b341] cursor-crosshair hover:bg-white shadow-[0_0_5px_#e3b341] relative right-[-17px]"></div></div>
             </div>
          </div>
          
          {/* Wire 2 */}
          <svg className="absolute left-[440px] w-24 h-4 text-[#e3b341] drop-shadow-[0_0_5px_rgba(227,179,65,0.8)] pointer-events-none" preserveAspectRatio="none"><path d="M0,2 Q48,2 96,2" fill="none" stroke="currentColor" strokeWidth="3"/></svg>

          {/* Core Shader Node */}
          <div className="bg-[#0a0a0a] border border-[#30363d] rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] w-56 shrink-0 border-l-[4px] border-l-[#3fb950] z-20 relative ring-1 ring-[#3fb950]/20">
             <div className="absolute inset-0 bg-[#3fb950]/5 rounded-xl pointer-events-none"></div>
             <div className="bg-[#21262d] text-white font-bold text-[12px] p-2.5 border-b border-[#30363d] rounded-t-xl uppercase tracking-widest flex items-center justify-between">
                Principled BSDF
                <Bot size={14} className="text-[#3fb950]"/>
             </div>
             <div className="p-3 space-y-3 text-[10px] font-mono">
                <div className="flex justify-between items-center group"><div className="flex items-center -ml-5"><div className="w-3 h-3 rounded-full border-[2px] border-[#e3b341] bg-[#0a0a0a] cursor-crosshair z-10 hover:bg-[#e3b341]"></div><span className="ml-2 text-white">Base Color</span></div> <div className="w-10 h-4 bg-[#58a6ff] rounded border border-[#30363d]"></div></div>
                <div className="flex justify-between items-center group"><div className="flex items-center -ml-5"><div className="w-3 h-3 rounded-full border-[2px] border-[#8b949e] bg-[#0a0a0a] cursor-crosshair z-10 hover:bg-[#8b949e]"></div><span className="ml-2 text-[#8b949e]">Metallic</span></div> <input type="number" defaultValue="0.0" className="w-12 bg-[#161b22] border border-[#30363d] rounded text-right px-1 text-white"/></div>
                <div className="flex justify-between items-center group"><div className="flex items-center -ml-5"><div className="w-3 h-3 rounded-full border-[2px] border-[#8b949e] bg-[#0a0a0a] cursor-crosshair z-10 hover:bg-[#8b949e] relative"><div className="absolute inset-0 bg-[#8b949e] rounded-full animate-ping opacity-20"></div></div><span className="ml-2 text-white font-bold text-[#8b949e]">Roughness</span></div> <input type="number" defaultValue="0.5" className="w-12 bg-[#161b22] border border-[#30363d] rounded text-right px-1 text-white"/></div>
                <div className="flex justify-between items-center group"><div className="flex items-center -ml-5"><div className="w-3 h-3 rounded-full border-[2px] border-[#bc8cff] bg-[#0a0a0a] cursor-crosshair z-10 hover:bg-[#bc8cff]"></div><span className="ml-2 text-[#bc8cff]">Normal</span></div></div>
                <div className="flex justify-between items-center group"><div className="flex items-center -ml-5"><div className="w-3 h-3 rounded-full border-[2px] border-[#bc8cff] bg-[#0a0a0a] cursor-crosshair z-10 hover:bg-[#bc8cff]"></div><span className="ml-2 text-[#8b949e]">Displacement</span></div></div>
                
                <div className="h-px bg-[#30363d] my-2 pt-1 border-t border-black"></div>
                
                <div className="flex justify-end items-center mt-1 group relative pb-1"><span className="mr-2 text-[#3fb950] font-bold">BSDF</span><div className="w-3 h-3 rounded-full border-[2px] border-[#3fb950] bg-[#3fb950] cursor-crosshair hover:bg-white shadow-[0_0_10px_#3fb950] relative right-[-17px]"></div></div>
             </div>
          </div>
          
          {/* Wire 3 */}
          <svg className="absolute left-[760px] w-16 h-8 text-[#3fb950] drop-shadow-[0_0_8px_rgba(63,185,80,0.8)] pointer-events-none" preserveAspectRatio="none"><path d="M0,8 Q32,0 64,0" fill="none" stroke="currentColor" strokeWidth="4"/></svg>

          {/* Material Output */}
          <div className="bg-[#161b22]/90 backdrop-blur border border-[#f85149] rounded-xl shadow-[0_20px_40px_rgba(248,81,73,0.2)] w-40 shrink-0 z-20 overflow-hidden ring-2 ring-[#f85149]/30">
             <div className="bg-gradient-to-r from-[#8a211e] to-[#f85149] text-white font-bold text-[11px] p-2 rounded-t-lg uppercase tracking-widest text-center shadow-md">
                Material Output
             </div>
             <div className="p-4 bg-[#0a0a0a] text-[11px] text-[#c9d1d9] font-mono space-y-4">
                <div className="flex items-center -ml-6 group bg-[#21262d] w-full p-2 border border-[#30363d] rounded shadow-inner"><div className="w-4 h-4 rounded-full border-[3px] border-[#3fb950] bg-[#0a0a0a] cursor-crosshair z-10 mr-3 shadow-[0_0_10px_#3fb950]"></div><span className="font-bold">Surface</span></div>
                <div className="flex items-center -ml-6 group bg-[#21262d]/50 w-full p-2 border border-[#30363d]/50 rounded"><div className="w-4 h-4 rounded-full border-[3px] border-[#8b949e] bg-[#0a0a0a] cursor-crosshair z-10 mr-3"></div><span className="text-[#8b949e]">Volume</span></div>
             </div>
          </div>
          
        </div>
      </div>
   );
}

function AIGenProperties() {
   return (
      <div className="pt-4 border-t border-[#30363d]">
         <div className="space-y-4">
            <div className="text-[11px] font-bold text-[#bc8cff] uppercase border-b border-[#bc8cff]/30 pb-1 flex justify-between items-center tracking-widest mt-2">
               Active LoRA Modifiers <button className="text-[#bc8cff] hover:text-white"><Plus size={14}/></button>
            </div>
            <div className="flex flex-col gap-2">
               <div className="bg-[#0a0a0a] border border-[#30363d] rounded-lg p-3 flex flex-col gap-2 shadow-inner">
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-white font-bold uppercase">Cinematic Lighting v2</span>
                     <span className="text-[#bc8cff] bg-[#bc8cff]/10 px-1.5 rounded font-mono border border-[#bc8cff]/30">0.85</span>
                  </div>
                  <input type="range" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#bc8cff]" defaultValue="85"/>
               </div>
               <div className="bg-[#0a0a0a] border border-[#30363d] rounded-lg p-3 flex flex-col gap-2 shadow-inner">
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-white font-bold uppercase">Cyberpunk Details</span>
                     <span className="text-[#bc8cff] bg-[#bc8cff]/10 px-1.5 rounded font-mono border border-[#bc8cff]/30">0.40</span>
                  </div>
                  <input type="range" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#bc8cff]" defaultValue="40"/>
               </div>
            </div>
         </div>
         <div className="space-y-3 mt-6">
            <div className="text-[11px] font-bold text-[#58a6ff] uppercase border-b border-[#30363d] pb-1 flex justify-between items-center tracking-widest">
               ControlNet Constraints <ToggleSwitch/>
            </div>
            <div className="text-[10px] font-mono text-[#8b949e]">Module: <span className="text-white">Canny Edge v1.1</span></div>
            <div className="aspect-video w-full border-2 border-[#30363d] border-dashed rounded-lg flex justify-center items-center text-[#8b949e] text-[11px] bg-[#0a0a0a] hover:bg-[#161b22] cursor-pointer transition-colors shadow-inner uppercase tracking-wider font-bold">
               <span className="flex flex-col items-center gap-2"><DownloadCloud size={16}/> Drop Reference Image</span>
            </div>
            <SliderRow label="Control Weight" value="1.0" accent="accent-[#58a6ff]" min="0" max="2" />
         </div>
      </div>
   );
}

function ToggleSwitch() {
   return (
      <div className="w-8 h-4 bg-[#3fb950]/20 rounded-full border border-[#3fb950] relative cursor-pointer hover:bg-[#3fb950]/30 transition-colors shadow-[0_0_10px_rgba(63,185,80,0.2)]">
         <div className="w-3 h-3 bg-[#3fb950] rounded-full absolute right-0 top-0 translate-y-[1px] -translate-x-[1px] shadow-sm"></div>
      </div>
   );
}

function LightroomProperties() {
   return (
      <div className="p-4 space-y-6 bg-[#161b22]">
         <div className="space-y-2">
            <div className="text-[11px] font-bold text-white uppercase border-b border-[#30363d] pb-1 tracking-widest">Histogram & Scope</div>
            <div className="h-24 bg-[#0a0a0a] border border-[#30363d] rounded-lg flex items-end relative overflow-hidden shadow-inner p-1">
               {/* Grid */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d_1px,transparent_1px),linear-gradient(to_bottom,#30363d_1px,transparent_1px)] bg-[size:25%_25%] opacity-30"></div>
               {/* RGB Histogram Mock */}
               <svg viewBox="0 0 100 100" className="absolute inset-x-1 bottom-1 w-[calc(100%-8px)] h-[calc(100%-8px)] opacity-80" preserveAspectRatio="none">
                  <path d="M0 100 Q10 80 20 90 T40 40 T60 70 T80 20 T100 100 Z" fill="#f85149" opacity="0.6" style={{ mixBlendMode: 'screen' }} />
                  <path d="M0 100 Q15 90 25 50 T45 60 T65 30 T85 40 T100 100 Z" fill="#3fb950" opacity="0.6" style={{ mixBlendMode: 'screen' }} />
                  <path d="M0 100 Q20 70 30 60 T50 30 T70 50 T90 10 T100 100 Z" fill="#58a6ff" opacity="0.6" style={{ mixBlendMode: 'screen' }} />
                  <path d="M0 100 Q15 60 30 70 T50 20 T70 40 T90 5 T100 100 Z" fill="white" opacity="0.4" style={{ mixBlendMode: 'screen' }} />
               </svg>
            </div>
            <div className="flex justify-between text-[8px] text-[#8b949e] font-mono uppercase px-1">
               <span>Shadows</span><span>Midtones</span><span>Highlights</span>
            </div>
         </div>
         <div className="space-y-3 pt-2">
            <div className="text-[11px] font-bold text-white uppercase border-b border-[#30363d] pb-1 tracking-widest">Global Curves</div>
            <div className="aspect-square w-full bg-[#0a0a0a] border border-[#30363d] rounded-lg p-3 relative shadow-inner cursor-crosshair">
               <div className="absolute inset-3 grid grid-cols-4 grid-rows-4 pointer-events-none border border-[#30363d]/50 bg-[#161b22]/30">
                  <div className="border-r border-b border-[#30363d]/50"></div><div className="border-r border-b border-[#30363d]/50"></div><div className="border-r border-b border-[#30363d]/50"></div><div className="border-b border-[#30363d]/50"></div>
                  <div className="border-r border-b border-[#30363d]/50"></div><div className="border-r border-b border-[#30363d]/50"></div><div className="border-r border-b border-[#30363d]/50"></div><div className="border-b border-[#30363d]/50"></div>
                  <div className="border-r border-b border-[#30363d]/50"></div><div className="border-r border-b border-[#30363d]/50"></div><div className="border-r border-b border-[#30363d]/50"></div><div className="border-b border-[#30363d]/50"></div>
                  <div className="border-r border-[#30363d]/50"></div><div className="border-r border-[#30363d]/50"></div><div className="border-r border-[#30363d]/50"></div><div></div>
               </div>
               <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 overflow-visible drop-shadow-md">
                  {/* Base linear line */}
                  <line x1="0" y1="100" x2="100" y2="0" stroke="#30363d" strokeWidth="1" strokeDasharray="2,2"/>
                  {/* The curve - S curve */}
                  <path d="M0 100 C 35 85, 65 15, 100 0" fill="none" stroke="white" strokeWidth="2" />
                  
                  {/* Anchors */}
                  <circle cx="0" cy="100" r="3" fill="white" className="hover:r-[5] cursor-pointer" />
                  <circle cx="35" cy="85" r="3" fill="white" className="hover:r-[5] cursor-pointer" />
                  <circle cx="65" cy="15" r="3" fill="white" className="hover:r-[5] cursor-pointer" />
                  <circle cx="100" cy="0" r="3" fill="white" className="hover:r-[5] cursor-pointer" />
               </svg>
            </div>
         </div>
         <div className="space-y-4 pt-2">
            <div className="text-[11px] font-bold text-white uppercase border-b border-[#30363d] pb-1 tracking-widest">Base Light</div>
            <SliderRow label="Exposure" value="+0.85" accent="accent-white" min="-5" max="5" />
            <SliderRow label="Contrast" value="+15" accent="accent-white" min="-100" max="100" />
            <SliderRow label="Highlights" value="-60" accent="accent-white" min="-100" max="100" />
            <SliderRow label="Shadows" value="+30" accent="accent-white" min="-100" max="100" />
            <SliderRow label="Whites" value="+10" accent="accent-white" min="-100" max="100" />
            <SliderRow label="Blacks" value="-25" accent="accent-white" min="-100" max="100" />
         </div>
         <div className="space-y-4 pt-2">
            <div className="text-[11px] font-bold text-white uppercase border-b border-[#30363d] pb-1 tracking-widest">Color & Presence</div>
            <SliderRow label="Temp (WB)" value="5800K" accent="accent-[#e3b341]" min="2000" max="10000" />
            <SliderRow label="Tint" value="+5" accent="accent-[#bc8cff]" min="-100" max="100" />
            <SliderRow label="Vibrance" value="+25" accent="accent-[#58a6ff]" min="-100" max="100" />
            <SliderRow label="Saturation" value="-5" accent="accent-[#f85149]" min="-100" max="100" />
            <SliderRow label="Texture" value="+12" accent="accent-white" min="-100" max="100" />
            <SliderRow label="Clarity" value="+20" accent="accent-white" min="-100" max="100" />
         </div>
      </div>
   );
}

function VectorProperties() {
   return (
      <div className="p-4 space-y-6">
         <div className="space-y-3">
            <div className="text-[11px] font-bold text-[#e3b341] uppercase border-b border-[#e3b341]/30 pb-1 tracking-widest">Appearance</div>
            <div className="flex flex-col gap-2">
               <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider"><span className="text-[#8b949e]">Fill Color</span></div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded border-[2px] border-black bg-white shadow-md cursor-pointer hover:scale-105 transition-transform"></div>
                  <input type="text" defaultValue="#FFFFFF" className="bg-[#0a0a0a] border border-[#30363d] rounded-md px-3 py-1.5 text-[12px] text-white outline-none flex-1 font-mono shadow-inner" />
                  <span className="text-[11px] font-bold text-[#8b949e]">100%</span>
               </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
               <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider"><span className="text-[#8b949e]">Stroke Style</span><Plus size={14} className="cursor-pointer text-[#e3b341] hover:bg-[#21262d] rounded" /></div>
               <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-3 flex-1">
                     <div className="w-8 h-8 rounded border-[2px] border-black bg-[#e3b341] shadow-[0_0_10px_rgba(227,179,65,0.4)] cursor-pointer hover:scale-105 transition-transform"></div>
                     <input type="text" defaultValue="#E3B341" className="bg-[#0a0a0a] border border-[#30363d] rounded-md px-3 py-1.5 text-[12px] text-white outline-none flex-1 font-mono shadow-inner uppercase" />
                  </div>
                  <div className="flex items-center gap-1 bg-[#0a0a0a] border border-[#30363d] rounded-md px-2 py-1 shadow-inner w-16">
                     <input type="number" defaultValue="2.5" className="bg-transparent text-[12px] text-white outline-none w-full text-center font-mono" />
                     <span className="text-[10px] text-[#8b949e]">pt</span>
                  </div>
               </div>
               <div className="flex justify-between text-[11px] mt-2 gap-2">
                  <select className="bg-[#0a0a0a] border border-[#30363d] rounded-md px-2 py-1.5 text-[11px] text-white outline-none flex-1 font-bold">
                     <option>Align Center</option><option>Align Inside</option><option>Align Outside</option>
                  </select>
                  <select className="bg-[#0a0a0a] border border-[#30363d] rounded-md px-2 py-1.5 text-[11px] text-white outline-none flex-1 font-bold">
                     <option>Solid Line</option><option>Dashed Line</option><option>Dotted Line</option>
                  </select>
               </div>
            </div>
         </div>
         <div className="space-y-3 mt-6">
            <div className="text-[11px] font-bold text-white uppercase border-b border-[#30363d] pb-1 tracking-widest">Pathfinder (Boolean OPs)</div>
            <div className="grid grid-cols-4 gap-2">
               <button className="bg-[#161b22] border border-[#30363d] hover:border-[#e3b341] hover:bg-[#21262d] rounded-lg p-3 flex justify-center text-[#8b949e] hover:text-[#e3b341] transition-all shadow-sm" title="Unite Shapes">
                  <div className="w-5 h-5 flex"><div className="w-3.5 h-3.5 outline outline-2 rounded-sm mt-1.5 ml-1.5 z-10 bg-current"></div><div className="w-3.5 h-3.5 outline outline-2 rounded-sm absolute bg-current"></div></div>
               </button>
               <button className="bg-[#161b22] border border-[#30363d] hover:border-[#e3b341] hover:bg-[#21262d] rounded-lg p-3 flex justify-center text-[#8b949e] hover:text-[#e3b341] transition-all shadow-sm" title="Minus Front">
                  <div className="w-5 h-5 flex"><div className="w-3.5 h-3.5 outline outline-2 rounded-sm mt-1.5 ml-1.5 z-10 bg-[#161b22]"></div><div className="w-3.5 h-3.5 outline outline-2 rounded-sm absolute bg-current"></div></div>
               </button>
               <button className="bg-[#161b22] border border-[#30363d] hover:border-[#e3b341] hover:bg-[#21262d] rounded-lg p-3 flex justify-center text-[#8b949e] hover:text-[#e3b341] transition-all shadow-sm" title="Intersect">
                  <div className="w-5 h-5 relative flex items-center justify-center"><div className="w-2.5 h-2.5 absolute bg-current ml-1 mt-1 z-20"></div><div className="w-4 h-4 absolute outline outline-2 -ml-1 -mt-1 rounded-sm z-10 border-[#161b22]"></div><div className="w-4 h-4 absolute outline outline-2 ml-1 mt-1 rounded-sm"></div></div>
               </button>
               <button className="bg-[#161b22] border border-[#30363d] hover:border-[#e3b341] hover:bg-[#21262d] rounded-lg p-3 flex justify-center text-[#8b949e] hover:text-[#e3b341] transition-all shadow-sm" title="Exclude">
                   <div className="w-5 h-5 relative flex items-center justify-center"><div className="w-4 h-4 absolute outline outline-2 border-current bg-[#161b22] -ml-1 -mt-1 rounded-sm z-10"></div><div className="w-4 h-4 absolute outline outline-2 border-current ml-1 mt-1 rounded-sm z-0"></div><div className="w-2 h-2 z-20 bg-[#161b22] absolute"></div></div>
               </button>
            </div>
         </div>
      </div>
   );
}

function PBRProperties() {
   return (
      <div className="p-4 space-y-6">
         <div className="space-y-4">
            <div className="text-[11px] font-bold text-[#3fb950] uppercase border-b border-[#3fb950]/30 pb-1 tracking-widest">Global PBR Settings</div>
            <div className="flex flex-col gap-1.5">
               <span className="text-[#8b949e] text-[10px] uppercase font-bold tracking-wider">Output Resolution</span>
               <select className="bg-[#0a0a0a] border border-[#30363d] text-white rounded-md p-2 font-mono text-[12px] outline-none focus:border-[#3fb950] shadow-inner"><option>4096 x 4096 (4K)</option><option>2048 x 2048 (2K)</option><option>8192 x 8192 (8K)</option></select>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
               <span className="text-[#8b949e] text-[10px] uppercase font-bold tracking-wider">Rendering Workflow</span>
               <select className="bg-[#0a0a0a] border border-[#30363d] text-white rounded-md p-2 font-mono text-[12px] outline-none focus:border-[#3fb950] shadow-inner"><option>Metallic / Roughness</option><option>Specular / Glossiness</option></select>
            </div>
         </div>
         
         <div className="space-y-4 mt-6">
            <div className="text-[11px] font-bold text-white uppercase border-b border-[#30363d] pb-1 tracking-widest">Texture Maps & Baking</div>
            <button className="w-full py-3 bg-[#3fb950]/20 hover:bg-[#3fb950]/30 text-[#3fb950] font-bold text-[13px] uppercase tracking-wider rounded-lg border border-[#3fb950]/50 shadow-[0_0_15px_rgba(63,185,80,0.2)] transition-colors flex justify-center items-center gap-2">
               <Cpu size={16}/> Bake Mesh Maps
            </button>
            <div className="grid grid-cols-2 gap-3 mt-4">
               <BakeMap name="Normal Map" status="baked" />
               <BakeMap name="World Normals" status="baked" />
               <BakeMap name="Ambient Occ" status="baked" />
               <BakeMap name="Curvature" status="missing" />
               <BakeMap name="Position Map" status="missing" />
               <BakeMap name="Thickness" status="missing" />
            </div>
         </div>
      </div>
   );
}

function BakeMap({ name, status }: { name: string, status: 'baked' | 'missing' }) {
   return (
      <div className={`flex flex-col bg-[#0a0a0a] border ${status === 'baked' ? 'border-[#3fb950]/30 shadow-[inset_0_0_10px_rgba(63,185,80,0.1)]' : 'border-[#30363d] opacity-50'} p-3 rounded-lg relative text-center`}>
         <div className={`w-2.5 h-2.5 rounded-full absolute top-2 right-2 ${status === 'baked' ? 'bg-[#3fb950] shadow-[0_0_5px_#3fb950]' : 'bg-[#f85149] shadow-[0_0_5px_#f85149]'}`}></div>
         <span className="text-[10px] text-white font-bold uppercase tracking-wider pt-2">{name}</span>
      </div>
   );
}

function SliderRow({ label, value, accent, min, max }: { label: string, value: string, accent: string, min: string, max: string }) {
   return (
      <div className="flex flex-col gap-2 w-full">
         <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider"><span className="text-[#8b949e]">{label}</span><span className="text-white bg-[#0a0a0a] px-2 py-0.5 rounded border border-[#30363d] font-mono">{value}</span></div>
         <input type="range" className={`w-full h-1.5 bg-[#30363d] rounded appearance-none ${accent} cursor-pointer`} min={min} max={max} defaultValue={value.replace(/[^0-9-]/g, '')}/>
      </div>
   );
}

function LayerItem({ name, type, blend, eye, locked, iconColor, active, hasMask }: { name: string, type: 'image' | 'fx' | 'adjust', blend: string, eye?: boolean, locked?: boolean, iconColor?: string, active?: boolean, hasMask?: boolean }) {
   return (
      <div className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border shadow-sm transition-colors ${active ? 'bg-[#58a6ff]/20 border-[#58a6ff]/40 text-white' : 'bg-[#161b22] border-[#30363d] hover:bg-[#21262d] text-[#c9d1d9]'}`}>
         <Eye size={16} className={`${eye ? 'text-white' : 'text-transparent'} hover:text-[#58a6ff] transition-colors`} />
         <div className={`w-7 h-7 rounded flex items-center justify-center bg-[#0a0a0a] shadow-inner shrink-0 border border-black ${iconColor}`}>
            {type === 'image' && <ImageLucide size={14} />}
            {type === 'fx' && <Zap size={14} />}
            {type === 'adjust' && <Sliders size={14} />}
         </div>
         {hasMask && (
            <>
               <div className="w-3 h-0.5 bg-black"></div>
               <div className="w-7 h-7 bg-[#0a0a0a] shadow-inner shrink-0 relative flex items-center justify-center overflow-hidden border border-black">
                  <div className="absolute inset-0 bg-white"></div>
                  <div className="w-5 h-5 bg-black rounded-full blur-[2px]"></div>
               </div>
            </>
         )}
         <div className="flex flex-col flex-1 min-w-0 ml-2">
            <span className="text-[12px] font-bold truncate tracking-wide text-white">{name}</span>
            <span className="text-[10px] text-[#8b949e] uppercase font-bold">{blend}</span>
         </div>
         {locked && <Lock size={14} className="text-[#8b949e] shrink-0" />}
      </div>
   );
}
