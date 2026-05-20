import React, { useState } from 'react';
import { 
  ImageIcon, MousePointer2, BoxSelect, Wand2, Scissors, PenTool, Pen, Copy, Wrench, Droplets, Sun, Palette, Ruler,
  Layers, Settings2, Sliders, Brush, Type, Image as ImageLucide, Cpu, DownloadCloud, RotateCw, Trash2, Plus, Move, 
  Grid, ZoomIn, Eye, Hexagon, Component, AlignLeft, PaintBucket, Pipette, Zap, FileCode2, BookOpen, Orbit, Maximize, BrainCircuit, Bot, Sparkles, Lock, SlidersHorizontal, Network, Link2
} from 'lucide-react';

export default function ImageEditor({ setActiveTool }: { setActiveTool?: (tool: string) => void }) {
  const [activeWorkspace, setActiveWorkspace] = useState<'PhotoCompositing' | 'VectorDesign' | 'Painting' | 'PBRTexturing' | 'PixelArt' | 'Lightroom' | 'AIGen'>('PhotoCompositing');
  const [leftTab, setLeftTab] = useState<'Tools' | 'Assets'>('Tools');

  // Renders the workspace navigation
  const renderWorkspaceTabs = () => (
    <div className="flex bg-[#161b22] border-b border-[#30363d] shrink-0 overflow-x-auto custom-scrollbar items-center px-2 py-1 gap-2">
      <WorkspaceBtn active={activeWorkspace === 'PhotoCompositing'} onClick={() => setActiveWorkspace('PhotoCompositing')} label="Photo/Comp (PS)" />
      <WorkspaceBtn active={activeWorkspace === 'VectorDesign'} onClick={() => setActiveWorkspace('VectorDesign')} label="Vector/Layout (AI/ID)" />
      <WorkspaceBtn active={activeWorkspace === 'Painting'} onClick={() => setActiveWorkspace('Painting')} label="Paint (Krita/CSP)" />
      <WorkspaceBtn active={activeWorkspace === 'PBRTexturing'} onClick={() => setActiveWorkspace('PBRTexturing')} label="PBR/Node (Substance/Quixel)" />
      <WorkspaceBtn active={activeWorkspace === 'PixelArt'} onClick={() => setActiveWorkspace('PixelArt')} label="Pixel Art (Aseprite)" />
      <WorkspaceBtn active={activeWorkspace === 'Lightroom'} onClick={() => setActiveWorkspace('Lightroom')} label="RAW/Grade (Lightroom)" />
      <WorkspaceBtn active={activeWorkspace === 'AIGen'} onClick={() => setActiveWorkspace('AIGen')} label="AI Gen (Firefly Local)" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#8b949e]">
      {/* Header */}
      <div className="h-16 bg-[#0a0a0a] border-b border-[#30363d] flex items-center px-6 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#bc8cff]/5 to-transparent pointer-events-none"></div>
        <ImageIcon size={28} className="text-[#bc8cff] mr-4" />
        <div className="flex flex-col z-10">
          <h2 className="text-[#c9d1d9] text-xl font-bold tracking-tight">Apex Omni-Image Studio Professional</h2>
          <p className="text-[#8b949e] text-xs">Unifies complete 2D pipelines: Compositing, Vectors, Painting, PBR Nodes, RAW Grading, & Offline AI.</p>
        </div>
      </div>

      {renderWorkspaceTabs()}

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Vertical Tool Palette */}
        {activeWorkspace !== 'AIGen' && (
           <div className="w-[50px] bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0 items-center py-2 gap-2 text-[#8b949e] overflow-y-auto custom-scrollbar z-10">
              {activeWorkspace === 'PhotoCompositing' && (
                <>
                   <ToolBtn icon={<MousePointer2 size={16}/>} active color="text-[#58a6ff]" />
                   <ToolBtn icon={<BoxSelect size={16}/>} />
                   <ToolBtn icon={<Wand2 size={16}/>} />
                   <ToolBtn icon={<Scissors size={16}/>} />
                   <div className="w-6 h-[1px] bg-[#30363d] my-1"></div>
                   <ToolBtn icon={<Brush size={16}/>} />
                   <ToolBtn icon={<Copy size={16}/>} />
                   <ToolBtn icon={<Wrench size={16}/>} />
                   <ToolBtn icon={<Droplets size={16}/>} />
                   <ToolBtn icon={<Sun size={16}/>} />
                   <div className="w-6 h-[1px] bg-[#30363d] my-1"></div>
                   <ToolBtn icon={<Type size={16}/>} />
                   <ToolBtn icon={<PenTool size={16}/>} />
                   <div className="flex-1"></div>
                   <ColorSwatches />
                </>
              )}
              {activeWorkspace === 'VectorDesign' && (
                 <>
                   <ToolBtn icon={<MousePointer2 size={16}/>} active color="text-[#e3b341]" />
                   <ToolBtn icon={<PenTool size={16}/>} />
                   <ToolBtn icon={<Component size={16}/>} />
                   <ToolBtn icon={<AlignLeft size={16}/>} />
                   <ToolBtn icon={<Type size={16}/>} />
                   <div className="flex-1"></div>
                   <ColorSwatches />
                 </>
              )}
              {activeWorkspace === 'Painting' && (
                 <>
                   <ToolBtn icon={<Brush size={16}/>} active color="text-[#f85149]" />
                   <ToolBtn icon={<Pen size={16}/>} />
                   <ToolBtn icon={<Pipette size={16}/>} />
                   <ToolBtn icon={<PaintBucket size={16}/>} />
                   <div className="flex-1"></div>
                   <ColorSwatches />
                 </>
              )}
              {activeWorkspace === 'PBRTexturing' && (
                 <>
                   <ToolBtn icon={<Brush size={16}/>} active color="text-[#3fb950]" />
                   <ToolBtn icon={<BoxSelect size={16}/>} />
                   <ToolBtn icon={<Hexagon size={16}/>} />
                   <div className="flex-1"></div>
                 </>
              )}
              {activeWorkspace === 'PixelArt' && (
                 <>
                   <ToolBtn icon={<Pen size={16}/>} active color="text-[#58a6ff]" />
                   <ToolBtn icon={<PaintBucket size={16}/>} />
                   <ToolBtn icon={<BoxSelect size={16}/>} />
                   <div className="flex-1"></div>
                   <ColorSwatches />
                 </>
              )}
              {activeWorkspace === 'Lightroom' && (
                 <>
                   <ToolBtn icon={<Sun size={16}/>} active color="text-[#bc8cff]" />
                   <ToolBtn icon={<Droplets size={16}/>} />
                   <ToolBtn icon={<BoxSelect size={16}/>} />
                 </>
              )}
           </div>
        )}

        {/* Center Canvas Area */}
        <div className="flex-1 bg-[#050505] relative flex flex-col overflow-hidden">
           {/* Top Canvas Bar */}
           <div className="h-8 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 text-[10px] text-[#c9d1d9] shrink-0">
              <div className="flex items-center gap-4">
                 <span>Zoom: 100%</span>
                 <span>Angle: 0°</span>
                 {activeWorkspace === 'PixelArt' && <span className="text-[#e3b341]">Grid: 16x16</span>}
                 {activeWorkspace === 'PBRTexturing' && <span className="text-[#3fb950]">Env: Studio HDRI</span>}
              </div>
              <div className="flex items-center gap-2">
                 <button className="flex items-center gap-1 hover:text-white"><Grid size={12}/> Grid</button>
                 <button className="flex items-center gap-1 hover:text-white"><Maximize size={12}/> Fit</button>
              </div>
           </div>

           {/* The Canvas itself */}
           <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 z-0">
               {/* Checkerboard Background */}
               <div className="absolute inset-0 z-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4xNSIvPgo8cmVjdCB4PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIwLjE1Ii8+CjxyZWN0IHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMTUiLz4KPC9zdmc+')]"></div>
               
               {activeWorkspace === 'PhotoCompositing' && (
                 <div className="w-[800px] h-[500px] bg-[#161b22] shadow-[0_10px_50px_rgba(0,0,0,0.8)] border border-[#30363d] relative z-10 flex items-center justify-center overflow-hidden">
                    <ImageLucide size={100} className="text-[#30363d]" />
                 </div>
               )}
               {activeWorkspace === 'VectorDesign' && (
                 <div className="w-[600px] h-[800px] bg-white shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative z-10 flex items-center justify-center overflow-hidden border border-[#58a6ff]">
                    <button onClick={() => setActiveTool?.('UIUXEdit')} className="absolute top-4 right-4 bg-[#58a6ff] hover:bg-[#79c0ff] text-black font-bold text-xs px-3 py-1.5 rounded flex items-center gap-2 shadow-lg transition-colors z-20">
                       <Link2 size={12}/> Edit Layout in UI/UX Builder
                    </button>
                    {/* Vector Outlines */}
                    <svg width="100%" height="100%" className="absolute inset-0 text-[#e3b341]" strokeWidth="2" stroke="currentColor" fill="none">
                       <path d="M 100 100 Q 300 500 500 100 T 500 700" />
                       <circle cx="300" cy="400" r="100" />
                    </svg>
                 </div>
               )}
               {activeWorkspace === 'Painting' && (
                 <div className="w-[800px] h-[600px] bg-[#f0f0f0] shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative z-10 flex items-center justify-center cursor-crosshair">
                    <span className="text-gray-300 font-bold text-4xl transform -rotate-12">Canvas</span>
                 </div>
               )}
               {activeWorkspace === 'PBRTexturing' && (
                 <div className="w-full h-full relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#050505] z-0"></div>
                    <div className="w-[400px] h-[400px] rounded-full border border-[#3fb950] shadow-[0_0_100px_rgba(63,185,80,0.1)] relative z-10 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3fb950]/20 to-transparent">
                       <Orbit size={80} className="text-[#3fb950] animate-spin-slow opacity-50" />
                    </div>
                    {/* Floating Node Editor below */}
                    <div className="absolute bottom-0 left-0 right-0 h-[250px] bg-[#0d1117]/95 backdrop-blur border-t border-[#30363d] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20 flex">
                       <NodeEditorMockup setActiveTool={setActiveTool} />
                    </div>
                 </div>
               )}
               {activeWorkspace === 'PixelArt' && (
                 <div className="w-[400px] h-[400px] bg-transparent border border-[#30363d] relative z-10 grid grid-cols-[repeat(16,1fr)] grid-rows-[repeat(16,1fr)] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMTYxYjIyIi8+CiAgPHBhdGggZD0iTTAgMTBoMjB2MUgweiIgZmlsbD0iIzMwMzZkMiIvPgogIDxwYXRoIGQ9Ik0xMCAwdjIwSDFweiIgZmlsbD0iIzMwMzZkMiIvPjwvc3ZnPg==')] shadow-[0_10px_50px_rgba(0,0,0,0.8)]" style={{ backgroundSize: '100% 100%' }}>
                    <div className="col-start-5 col-end-12 row-start-5 row-end-12 bg-[#58a6ff]"></div>
                 </div>
               )}
               {activeWorkspace === 'Lightroom' && (
                 <div className="w-[90%] h-[90%] bg-transparent relative z-10 flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1506744626753-140a33118538?w=1200&h=800&fit=crop" className="w-full h-full object-contain border border-[#30363d] shadow-[0_0_50px_rgba(0,0,0,1)]" alt="RAW Edit" />
                    {/* Before/After Divider */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white shadow-[0_0_5px_currentColor]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full flex items-center justify-center cursor-ew-resize">
                       <Move size={10} className="text-black" />
                    </div>
                 </div>
               )}
               {activeWorkspace === 'AIGen' && (
                 <div className="w-full h-full relative z-10 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#161b22] to-[#0a0a0a]">
                    <div className="w-full max-w-4xl bg-[#0d1117] border border-[#bc8cff]/40 rounded-xl shadow-[0_10px_50px_rgba(188,140,255,0.1)] p-6 z-20 relative overflow-hidden">
                       <div className="absolute inset-0 bg-[#bc8cff]/5"></div>
                       <div className="relative z-10">
                          <h3 className="text-[#bc8cff] font-bold text-lg mb-2 flex items-center gap-2"><BrainCircuit size={20}/> Offline AI Advanced Generation (Tensor Optimized)</h3>
                          <p className="text-[#8b949e] text-xs mb-4">Uses massive local models (Flux/SDXL level) utilizing all available offline VRAM.</p>
                          <textarea className="w-full h-24 bg-[#050505] border border-[#30363d] rounded-lg p-3 text-sm text-white resize-none outline-none focus:border-[#bc8cff] custom-scrollbar mb-4" placeholder="Prompt... ex: Ultra realistic cinematic photography of an ethereal neon-lit futuristic city..."></textarea>
                          <textarea className="w-full h-12 bg-[#050505]/50 border border-[#f85149]/30 rounded-lg p-3 text-xs text-[#f85149] resize-none outline-none focus:border-[#f85149] custom-scrollbar mb-4" placeholder="Negative Prompt... ex: lowres, text, error, cropped, worst quality, low quality..."></textarea>
                          <div className="grid grid-cols-4 gap-4 mb-4 text-xs">
                             <div className="flex flex-col gap-1">
                                <span className="text-[#8b949e] font-bold">Steps</span>
                                <input type="number" defaultValue="40" className="bg-[#161b22] border border-[#30363d] rounded p-1 text-white" />
                             </div>
                             <div className="flex flex-col gap-1">
                                <span className="text-[#8b949e] font-bold">CFG Scale</span>
                                <input type="number" defaultValue="7.0" step="0.1" className="bg-[#161b22] border border-[#30363d] rounded p-1 text-white" />
                             </div>
                             <div className="flex flex-col gap-1">
                                <span className="text-[#8b949e] font-bold">Seed</span>
                                <input type="number" defaultValue="-1" className="bg-[#161b22] border border-[#30363d] rounded p-1 text-white" />
                             </div>
                             <div className="flex flex-col gap-1">
                                <span className="text-[#8b949e] font-bold">Aspect Ratio</span>
                                <select className="bg-[#161b22] border border-[#30363d] rounded p-1 text-white">
                                   <option>1:1</option><option>16:9</option><option>9:16</option><option>21:9</option>
                                </select>
                             </div>
                          </div>
                          <button className="w-full py-3 bg-[#bc8cff] hover:bg-[#a371f7] text-[#0a0a0a] font-bold uppercase tracking-wider rounded flex justify-center items-center gap-2 transition-all shadow-[0_0_15px_rgba(188,140,255,0.4)]">
                             <Zap size={16} /> Generate Masterpiece Offline
                          </button>
                       </div>
                    </div>

                    <div className="mt-8 grid grid-cols-4 gap-4 w-full max-w-4xl">
                       {[...Array(4)].map((_, i) => (
                          <div key={i} className="aspect-square bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg flex items-center justify-center group overflow-hidden relative">
                             <ImageLucide size={32} className="text-[#30363d]" />
                             <div className="absolute inset-0 bg-[#bc8cff]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                       ))}
                    </div>
                 </div>
               )}
           </div>
        </div>

        {/* Right Dock: Details, Layers, Adjustments */}
        {activeWorkspace !== 'AIGen' && (
           <div className="w-[320px] bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.5)]">
               
               {/* Contextual Properties */}
               <div className="h-10 bg-[#21262d] border-b border-[#30363d] px-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#c9d1d9] uppercase tracking-wider">Properties & Adjust</span>
                  <Settings2 size={14} className="text-[#8b949e]" />
               </div>
               
               {activeWorkspace === 'Lightroom' ? (
                 <LightroomProperties />
               ) : activeWorkspace === 'PBRTexturing' ? (
                 <PBRProperties />
               ) : (
                 <div className="p-3 border-b border-[#30363d] max-h-[40%] overflow-y-auto custom-scrollbar space-y-3">
                    <div className="flex flex-col gap-1">
                       <div className="flex justify-between text-[11px] font-bold"><span className="text-[#8b949e]">Opacity</span><span className="text-white">100%</span></div>
                       <input type="range" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#58a6ff]" defaultValue="100"/>
                    </div>
                    <div className="flex flex-col gap-1">
                       <div className="flex justify-between text-[11px] font-bold"><span className="text-[#8b949e]">Blend Mode</span></div>
                       <select className="bg-[#0a0a0a] border border-[#30363d] rounded px-2 py-1 text-[11px] text-[#c9d1d9] outline-none">
                          <option>Normal</option><option>Multiply</option><option>Screen</option><option>Overlay</option><option>Color Dodge</option>
                       </select>
                    </div>
                    {/* Brush Settings if Painting */}
                    {(activeWorkspace === 'Painting' || activeWorkspace === 'PixelArt') && (
                        <div className="pt-2 border-t border-[#30363d]">
                            <div className="text-[#f85149] text-[10px] uppercase font-bold tracking-wider mb-2">Brush Engine</div>
                            <div className="flex justify-between text-[10px] mb-1"><span className="text-[#8b949e]">Size</span><span className="text-white">14px</span></div>
                            <input type="range" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#f85149]" defaultValue="14"/>
                            <div className="flex justify-between text-[10px] mb-1"><span className="text-[#8b949e]">Flow</span><span className="text-white">50%</span></div>
                            <input type="range" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#f85149]" defaultValue="50"/>
                        </div>
                    )}
                 </div>
               )}

               {/* Layers Panel */}
               <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
                  <div className="h-10 bg-[#21262d] border-b border-[#30363d] px-4 flex items-center justify-between shrink-0">
                     <span className="text-xs font-bold text-[#c9d1d9] uppercase tracking-wider flex items-center gap-2"><Layers size={14}/> Layers</span>
                     <div className="flex gap-2">
                        <button title="New Layer" className="hover:opacity-80"><Plus size={14} className="text-[#3fb950] cursor-pointer" /></button>
                        <button title="Duplicate Layer" className="hover:opacity-80"><Copy size={14} className="text-[#58a6ff] cursor-pointer" /></button>
                        <button title="Delete Layer" className="hover:opacity-80"><Trash2 size={14} className="text-[#f85149] cursor-pointer" /></button>
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                     <LayerItem name="Highlights Details" type="image" blend="Screen" eye iconColor="text-[#e3b341]" active/>
                     <LayerItem name="Shadow Correction" type="fx" blend="Multiply" eye iconColor="text-[#2ea043]"/>
                     <LayerItem name="Main Subject" type="image" blend="Normal" eye iconColor="text-[#58a6ff]"/>
                     <LayerItem name="Color Grade LUT" type="adjust" blend="Normal" eye iconColor="text-[#bc8cff]"/>
                     <LayerItem name="Background Base" type="image" blend="Normal" eye locked iconColor="text-[#8b949e]"/>
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
      className={`px-3 py-1.5 rounded-md text-[11px] font-bold whitespace-nowrap transition-colors border ${active ? 'bg-[#58a6ff]/20 text-[#58a6ff] border-[#58a6ff]/50' : 'bg-transparent text-[#8b949e] border-transparent hover:bg-[#21262d] hover:text-[#c9d1d9]'}`}
    >
      {label}
    </button>
  );
}

function ToolBtn({ icon, active, color }: { icon: React.ReactNode, active?: boolean, color?: string }) {
  return (
    <button className={`p-2 rounded transition-colors ${active ? `bg-[#21262d] ${color || 'text-white'} shadow-[inset_0_0_5px_currentColor]` : 'hover:bg-[#21262d] hover:text-white text-[#8b949e]'}`}>
      {icon}
    </button>
  );
}

function ColorSwatches() {
  return (
    <div className="flex flex-col items-center gap-1 mb-2">
       <div className="relative w-8 h-8 group">
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-white border border-[#30363d] rounded-sm shrink-0 shadow-sm cursor-pointer hover:border-white"></div>
          <div className="absolute top-0 left-0 w-5 h-5 bg-[#f85149] border-2 border-[#161b22] rounded-sm shrink-0 shadow-sm z-10 cursor-pointer hover:border-white"></div>
          <RotateCw size={10} className="absolute -top-1 -right-1 text-[#8b949e] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-[#161b22] rounded-full" />
       </div>
    </div>
  );
}

function NodeEditorMockup({ setActiveTool }: { setActiveTool?: (tool: string) => void }) {
   return (
      <div className="w-full h-full relative p-4 flex flex-col bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzAzNjNkIiBzdHJva2Utb3BhY2l0eT0iMC41IiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] shadow-[inset_0_5px_10px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="flex justify-between items-center w-full mb-4 z-50 pointer-events-auto">
          <span className="text-[11px] font-bold text-[#c9d1d9] uppercase bg-[#161b22] px-2 py-1 rounded border border-[#30363d]">Node Graph Preview</span>
          <button onClick={() => setActiveTool?.('Material')} className="flex items-center gap-1 text-[10px] bg-[#30363d] hover:bg-[#8b949e] hover:text-black px-2 py-1 rounded transition-colors text-white font-bold cursor-pointer">
            <Link2 size={12}/> Open Node Material Editor
          </button>
        </div>
        <div className="flex gap-8 items-center w-full flex-1">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl w-32 shrink-0">
             <div className="bg-[#21262d] text-[#e3b341] font-bold text-[10px] p-1 px-2 border-b border-[#30363d] rounded-t-lg">Albedo Map</div>
             <div className="p-2 space-y-1 text-[9px] text-[#8b949e]">
                <div className="flex justify-between items-center"><span>RGB</span><div className="w-2 h-2 rounded-full border border-[#e3b341]"></div></div>
             </div>
          </div>
          <svg className="w-16 h-4 absolute left-[144px] text-[#30363d]" preserveAspectRatio="none"><path d="M0,2 Q32,2 64,2" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl w-40 shrink-0 border-[#3fb950] z-10 shadow-[0_0_15px_rgba(63,185,80,0.2)]">
             <div className="bg-[#3fb950]/20 text-[#3fb950] font-bold text-[10px] p-1 px-2 border-b border-[#30363d] rounded-t-lg">Principled BSDF</div>
             <div className="p-2 space-y-2 text-[9px] text-[#8b949e]">
                <div className="flex justify-between items-center"><div className="w-2 h-2 rounded-full bg-[#e3b341]"></div><span>Base Color</span></div>
                <div className="flex justify-between items-center"><div className="w-2 h-2 rounded-full border border-[#8b949e]"></div><span>Metallic</span></div>
                <div className="flex justify-between items-center"><div className="w-2 h-2 rounded-full border border-[#8b949e]"></div><span>Roughness</span></div>
                <div className="flex justify-between items-center"><div className="w-2 h-2 rounded-full bg-[#bc8cff]"></div><span>Normal</span></div>
                <div className="flex justify-between items-center"><span>Output PBR</span><div className="w-2 h-2 rounded-full border border-[#3fb950]"></div></div>
             </div>
          </div>
          <svg className="w-16 h-4 absolute left-[352px] text-[#30363d]" preserveAspectRatio="none"><path d="M0,2 Q32,2 64,2" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl w-32 shrink-0">
             <div className="bg-[#21262d] text-[#f85149] font-bold text-[10px] p-1 px-2 border-b border-[#30363d] rounded-t-lg">Material Output</div>
             <div className="p-2 space-y-1 text-[9px] text-[#8b949e]">
                <div className="flex justify-between items-center"><div className="w-2 h-2 rounded-full bg-[#3fb950]"></div><span>Surface</span></div>
             </div>
          </div>
        </div>
      </div>
   );
}

function LightroomProperties() {
   return (
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
         <div className="space-y-2">
            <div className="text-[10px] font-bold text-[#c9d1d9] uppercase border-b border-[#30363d] pb-1">Light</div>
            <SliderRow label="Exposure" value="0.00" accent="accent-white" min="-5" max="5" />
            <SliderRow label="Contrast" value="+15" accent="accent-white" min="-100" max="100" />
            <SliderRow label="Highlights" value="-50" accent="accent-white" min="-100" max="100" />
            <SliderRow label="Shadows" value="+30" accent="accent-white" min="-100" max="100" />
            <SliderRow label="Whites" value="+10" accent="accent-white" min="-100" max="100" />
            <SliderRow label="Blacks" value="-20" accent="accent-white" min="-100" max="100" />
         </div>
         <div className="space-y-2 mt-4">
            <div className="text-[10px] font-bold text-[#c9d1d9] uppercase border-b border-[#30363d] pb-1">Color (Grading)</div>
            <SliderRow label="Temp" value="5500K" accent="accent-[#e3b341]" min="2000" max="10000" />
            <SliderRow label="Tint" value="+5" accent="accent-[#bc8cff]" min="-100" max="100" />
            <SliderRow label="Vibrance" value="+25" accent="accent-[#58a6ff]" min="-100" max="100" />
            <SliderRow label="Saturation" value="+5" accent="accent-[#f85149]" min="-100" max="100" />
         </div>
         <div className="space-y-2 mt-4">
            <div className="text-[10px] font-bold text-[#c9d1d9] uppercase border-b border-[#30363d] pb-1 flex justify-between items-center">Color Mixer <Pipette size={10} className="text-[#8b949e]"/></div>
            <div className="flex gap-1 mb-2">
               {['#f85149', '#ff7b72', '#e3b341', '#3fb950', '#a2d2ff', '#58a6ff', '#bc8cff', '#d2a8ff'].map(bg => (
                  <div key={bg} className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform" style={{backgroundColor: bg}}></div>
               ))}
            </div>
         </div>
         <div className="space-y-2 mt-4">
            <div className="text-[10px] font-bold text-[#c9d1d9] uppercase border-b border-[#30363d] pb-1">Effects</div>
            <SliderRow label="Texture" value="+10" accent="accent-white" min="-100" max="100" />
            <SliderRow label="Clarity" value="+15" accent="accent-white" min="-100" max="100" />
            <SliderRow label="Dehaze" value="+5" accent="accent-white" min="-100" max="100" />
            <SliderRow label="Vignette" value="-12" accent="accent-white" min="-100" max="100" />
         </div>
      </div>
   );
}

function PBRProperties() {
   return (
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
         <div className="space-y-2">
            <div className="text-[10px] font-bold text-[#3fb950] uppercase border-b border-[#3fb950]/30 pb-1">Material Settings</div>
            <div className="flex justify-between text-[11px]">
               <span className="text-[#8b949e]">Resolution</span>
               <select className="bg-[#0a0a0a] border border-[#30363d] text-white rounded"><option>4096 x 4096</option><option>2048 x 2048</option></select>
            </div>
            <div className="flex justify-between text-[11px]">
               <span className="text-[#8b949e]">Workflow</span>
               <select className="bg-[#0a0a0a] border border-[#30363d] text-white rounded"><option>Metallic/Roughness</option><option>Specular/Gloss</option></select>
            </div>
            <div className="flex justify-between text-[11px]">
               <span className="text-[#8b949e]">Anti-Aliasing</span>
               <select className="bg-[#0a0a0a] border border-[#30363d] text-white rounded"><option>Temporal 8x</option></select>
            </div>
         </div>
         
         <div className="space-y-2 mt-4">
            <div className="text-[10px] font-bold text-[#c9d1d9] uppercase border-b border-[#30363d] pb-1">Textures & Baking</div>
            <button className="w-full py-1.5 bg-[#3fb950]/20 text-[#3fb950] font-bold text-xs rounded border border-[#3fb950]/30">Bake Mesh Maps</button>
            <div className="grid grid-cols-2 gap-2 mt-2">
               <BakeMap name="Normal Map" status="baked" />
               <BakeMap name="World Space Norm" status="baked" />
               <BakeMap name="Ambient Occlusion" status="baked" />
               <BakeMap name="Curvature" status="baked" />
               <BakeMap name="Position" status="baked" />
               <BakeMap name="Thickness" status="missing" />
            </div>
         </div>
         <div className="space-y-2 mt-4">
            <div className="text-[10px] font-bold text-[#c9d1d9] uppercase border-b border-[#30363d] pb-1">Export Settings</div>
            <div className="text-[11px] text-[#8b949e] flex items-center justify-between">
               <span>Format</span><span className="text-white bg-[#0a0a0a] px-2 py-0.5 rounded border border-[#30363d]">.EXR / .PNG 16b</span>
            </div>
         </div>
      </div>
   );
}

function BakeMap({ name, status }: { name: string, status: 'baked' | 'missing' }) {
   return (
      <div className="flex flex-col bg-[#0a0a0a] border border-[#30363d] p-1.5 rounded relative text-center">
         <div className={`w-2 h-2 rounded-full absolute top-1 right-1 ${status === 'baked' ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`}></div>
         <span className="text-[9px] text-[#8b949e] font-bold">{name}</span>
      </div>
   );
}

function SliderRow({ label, value, accent, min, max }: { label: string, value: string, accent: string, min: string, max: string }) {
   return (
      <div className="flex flex-col gap-1 w-full">
         <div className="flex justify-between text-[11px] font-bold"><span className="text-[#8b949e]">{label}</span><span className="text-white">{value}</span></div>
         <input type="range" className={`w-full h-1 bg-[#30363d] rounded appearance-none ${accent}`} min={min} max={max} defaultValue={value.replace(/[^0-9-]/g, '')}/>
      </div>
   );
}

function LayerItem({ name, type, blend, eye, locked, iconColor, active }: { name: string, type: 'image' | 'fx' | 'adjust', blend: string, eye?: boolean, locked?: boolean, iconColor?: string, active?: boolean }) {
   return (
      <div className={`flex items-center gap-2 p-1.5 rounded cursor-pointer border ${active ? 'bg-[#58a6ff]/20 border-[#58a6ff]/30 text-white' : 'bg-[#161b22] border-[#30363d] hover:bg-[#21262d] text-[#c9d1d9]'}`}>
         <Eye size={14} className={eye ? 'text-[#c9d1d9]' : 'text-transparent'} />
         <div className={`w-5 h-5 rounded flex items-center justify-center bg-[#0a0a0a] shadow-inner shrink-0 ${iconColor}`}>
            {type === 'image' && <ImageLucide size={12} />}
            {type === 'fx' && <Zap size={12} />}
            {type === 'adjust' && <Sliders size={12} />}
         </div>
         <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[11px] font-bold truncate leading-tight">{name}</span>
            <span className="text-[9px] text-[#8b949e]">{blend}</span>
         </div>
         {locked && <BoxSelect size={12} className="text-[#8b949e] shrink-0" />}
      </div>
   );
}
