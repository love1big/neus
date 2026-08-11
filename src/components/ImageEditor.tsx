import React, { useRef, useState, useEffect } from 'react';
import { Image as ImageIcon, Scissors, Edit2, Eraser, Square, Save, Trash2, Download, Layers, Wand2, FlipHorizontal, Move, Palette, Sliders, Type, Undo, Search, ZoomIn, Sun, Sparkles, Filter, Settings2, Hash, Menu, Eye, GitBranch} from 'lucide-react';

export default function ImageEditor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState('draw'); // draw, erase, wand, brush, clone, smear, gradient, shapes
  const [color, setColor] = useState('#ff7b72');
  const [isDrawing, setIsDrawing] = useState(false);
  const [size, setSize] = useState(1024); // HI-RES texture mapping base 1024x1024
  
  // Advanced features state
  const [activeLayer, setActiveLayer] = useState(1);
  const [layers, setLayers] = useState([{id: 1, name: 'Albedo (Base Color)', visible: true, blend: 'Normal', opacity: 100}, {id: 2, name: 'Normal Map', visible: true, blend: 'Overlay', opacity: 80}, {id: 3, name: 'Roughness Map', visible: true, blend: 'Multiply', opacity: 50}]);
  
  const [brushSize, setBrushSize] = useState(12);
  const [brushHardness, setBrushHardness] = useState(50);
  const [brushOpacity, setBrushOpacity] = useState(100);

  const getPos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if(!canvas) return {x:0, y:0};
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / size));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / size));
    return { x, y };
  };

  const drawPixel = (e: React.MouseEvent) => {
    if(!isDrawing) return;
    const {x, y} = getPos(e);
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    
    if (tool === 'draw') {
       ctx.fillStyle = color;
       ctx.fillRect(x, y, brushSize, brushSize); // Using brush size instead of 1px
    } else if (tool === 'erase') {
       ctx.clearRect(x, y, brushSize, brushSize);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    canvas.getContext('2d')?.clearRect(0,0,size,size);
  }

  return (
    <div className="flex w-full h-[calc(100vh-36px)] bg-[#0a0a0f] text-[#c9d1d9] font-sans overflow-hidden">
      
      {/* Left Toolbar - Tools */}
      <div className="w-[60px] bg-[#11111b] border-r border-[#2a2b3d] flex flex-col items-center py-4 gap-3 shrink-0">
         <button onClick={() => setTool('move')} className={`p-2 rounded-lg transition-all ${tool === 'move' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'text-[#8b949e] hover:bg-[#2a2b3d] hover:text-white'}`} title="Move Canvas"><Move size={20}/></button>
         <button onClick={() => setTool('lasso')} className={`p-2 rounded-lg transition-all ${tool === 'lasso' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'text-[#8b949e] hover:bg-[#2a2b3d] hover:text-white'}`} title="Lasso Selection"><Scissors size={20}/></button>
         <button onClick={() => setTool('wand')} className={`p-2 rounded-lg transition-all ${tool === 'wand' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'text-[#8b949e] hover:bg-[#2a2b3d] hover:text-white'}`} title="Magic Wand (AI Selection)"><Wand2 size={20}/></button>
         
         <div className="w-8 h-[1px] bg-[#2a2b3d] my-1"></div>
         
         <button onClick={() => setTool('draw')} className={`p-2 rounded-lg transition-all ${tool === 'draw' ? 'bg-[#bc8cff]/20 text-[#bc8cff]' : 'text-[#8b949e] hover:bg-[#2a2b3d] hover:text-white'}`} title="Advanced Brush"><Edit2 size={20}/></button>
         <button onClick={() => setTool('erase')} className={`p-2 rounded-lg transition-all ${tool === 'erase' ? 'bg-[#bc8cff]/20 text-[#bc8cff]' : 'text-[#8b949e] hover:bg-[#2a2b3d] hover:text-white'}`} title="Precision Eraser"><Eraser size={20}/></button>
         <button onClick={() => setTool('paint')} className={`p-2 rounded-lg transition-all ${tool === 'paint' ? 'bg-[#bc8cff]/20 text-[#bc8cff]' : 'text-[#8b949e] hover:bg-[#2a2b3d] hover:text-white'}`} title="Paint Bucket (Tolerance Sensing)"><Filter size={20}/></button>
         
         <div className="w-8 h-[1px] bg-[#2a2b3d] my-1"></div>
         
         <button onClick={() => setTool('fx')} className={`p-2 rounded-lg transition-all ${tool === 'fx' ? 'bg-[#3fb950]/20 text-[#3fb950]' : 'text-[#8b949e] hover:bg-[#2a2b3d] hover:text-white'}`} title="Procedural Filters & FX"><Sparkles size={20}/></button>
         <button onClick={() => setTool('text')} className={`p-2 rounded-lg transition-all ${tool === 'text' ? 'bg-[#3fb950]/20 text-[#3fb950]' : 'text-[#8b949e] hover:bg-[#2a2b3d] hover:text-white'}`} title="Vector Text"><Type size={20}/></button>

         <div className="mt-auto flex flex-col gap-2 items-center">
            {/* Color Pickers */}
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer p-0 border-0 outline-none" title="Primary Color" />
            <input type="color" defaultValue="#000000" className="w-6 h-6 rounded cursor-pointer p-0 border-0 outline-none mt-[-10px] ml-[10px]" title="Secondary Color" />
         </div>
      </div>

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[#0a0a0f]">
         {/* Top Options Bar (Contextual) */}
         <div className="h-[40px] bg-[#161621] border-b border-[#2a2b3d] flex items-center px-4 shrink-0 gap-6 shadow-sm z-10 text-[11px]">
            <div className="flex items-center gap-2">
               <span className="text-[#8b949e] font-bold">Brush Size:</span>
               <input type="range" min="1" max="200" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-24 accent-[#bc8cff]" />
               <input type="number" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-10 bg-[#0d1117] border border-[#30363d] rounded text-center" /> px
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[#8b949e] font-bold">Hardness:</span>
               <input type="range" min="0" max="100" value={brushHardness} onChange={(e) => setBrushHardness(parseInt(e.target.value))} className="w-24 accent-[#bc8cff]" />
               <input type="number" value={brushHardness} onChange={(e) => setBrushHardness(parseInt(e.target.value))} className="w-10 bg-[#0d1117] border border-[#30363d] rounded text-center" /> %
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[#8b949e] font-bold">Opacity:</span>
               <input type="range" min="0" max="100" value={brushOpacity} onChange={(e) => setBrushOpacity(parseInt(e.target.value))} className="w-24 accent-[#bc8cff]" />
               <input type="number" value={brushOpacity} onChange={(e) => setBrushOpacity(parseInt(e.target.value))} className="w-10 bg-[#0d1117] border border-[#30363d] rounded text-center" /> %
            </div>
            <div className="flex items-center gap-2 border-l border-[#2a2b3d] pl-6">
               <select className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 outline-none">
                  <option>Normal Matrix</option>
                  <option>Airbrush</option>
                  <option>Foliage Scatter</option>
                  <option>Dirt Grunge</option>
                  <option>Spackle Noise</option>
               </select>
            </div>
         </div>

         {/* Canvas Workspace Wrapper */}
         <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[#0a0a0f] relative group checkerboard-bg">
            <style dangerouslySetInnerHTML={{__html: `
               .checkerboard-bg {
                  background-image: linear-gradient(45deg, #11111b 25%, transparent 25%), linear-gradient(-45deg, #11111b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #11111b 75%), linear-gradient(-45deg, transparent 75%, #11111b 75%);
                  background-size: 20px 20px;
                  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
               }
            `}} />
            
            {/* Resolution indicator background string */}
            <div className="absolute top-4 left-4 font-mono text-[200px] text-white/5 font-bold pointer-events-none select-none tracking-tighter">1024</div>
            
            <div className="relative shadow-[0_0_50px_rgba(0,0,0,0.8)] outline outline-1 outline-[#2a2b3d] bg-transparent">
              <canvas 
                ref={canvasRef} 
                width={size} 
                height={size} 
                onMouseDown={(e) => { setIsDrawing(true); drawPixel(e); }}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                onMouseMove={drawPixel}
                className="w-[600px] h-[600px] bg-white cursor-crosshair mix-blend-normal"
                style={{ imageRendering: 'pixelated' }}
              />
              {/* Optional UI Overlays for Grid/Guides */}
            </div>
         </div>
         
         {/* Bottom Status Bar */}
         <div className="h-[24px] bg-[#11111b] border-t border-[#2a2b3d] flex items-center justify-between px-4 text-[10px] text-[#8b949e] font-mono shrink-0">
            <div className="flex items-center gap-4">
               <span><ZoomIn size={10} className="inline mr-1 mb-[2px]" /> 86.5%</span>
               <span>Dimensions: {size} x {size} px</span>
               <span>Color Profile: sRGB IEC61966-2.1</span>
            </div>
            <div className="flex items-center gap-4">
               <span>RAM: 142 MB</span>
               <span>VRAM: 86 MB</span>
            </div>
         </div>
      </div>

      {/* Right Sidebar - Layers & Offline AI Generation */}
      <div className="w-[340px] bg-[#11111b] border-l border-[#2a2b3d] flex flex-col shrink-0 text-xs overflow-y-auto custom-scrollbar shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
         
         {/* Offline AI Generation Panel */}
         <div className="flex flex-col border-b border-[#2a2b3d] relative overflow-hidden bg-[#161621]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#bc8cff]/10 rounded-full blur-[40px] pointer-events-none"></div>
            
            <div className="p-3 border-b border-[#2a2b3d] flex items-center justify-between z-10">
               <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[10px]">
                 <Wand2 size={12} className="text-[#bc8cff]" /> Offline Neural Renderer
               </h3>
               <span className="text-[8px] bg-green-500/20 text-green-400 border border-green-500/30 px-1 rounded font-mono">GPU: IDLE</span>
            </div>
            
            <div className="p-3 flex flex-col gap-3 z-10 bg-[#0a0a0f]/50">
               <div>
                  <label className="text-[9px] text-[#8b949e] font-bold uppercase mb-1 block">Local Model Weights</label>
                  <select className="w-full bg-[#0d1117] border border-[#2a2b3d] rounded p-1.5 text-xs text-white outline-none focus:border-[#bc8cff]">
                     <option>SDXL-Turbo V1.4_fp16.safetensors</option>
                     <option>PBR-Material-Crafter-V2.ckpt</option>
                     <option>Anime-Lineart-ControlNet.pth</option>
                     <option>Depth-to-Image-v1.ckpt</option>
                  </select>
               </div>
               
               <div className="bg-[#000000] border border-[#2a2b3d] rounded p-2 focus-within:border-[#bc8cff] transition-colors">
                  <label className="text-[9px] text-[#bc8cff] font-bold uppercase mb-1 block">Positive Prompt</label>
                  <textarea className="w-full h-12 bg-transparent text-[10px] text-white outline-none resize-none placeholder-gray-600" placeholder="highly detailed stone wall texture, 4k, seamless..."></textarea>
               </div>
               
               <div className="flex gap-2">
                  <div className="flex-1">
                     <label className="text-[9px] text-[#8b949e] uppercase mb-1 block">CFG Scale: 7.0</label>
                     <input type="range" min="1" max="20" step="0.5" defaultValue="7" className="w-full accent-[#bc8cff] h-1" />
                  </div>
                  <div className="flex-1">
                     <label className="text-[9px] text-[#8b949e] uppercase mb-1 block">Steps: 20</label>
                     <input type="range" min="1" max="150" step="1" defaultValue="20" className="w-full accent-[#bc8cff] h-1" />
                  </div>
               </div>

               <div className="flex items-center gap-2 mt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer group w-1/2">
                     <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" />
                     <span className="text-[9px] text-gray-400 group-hover:text-white transition">Seamless Tiling</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group w-1/2">
                     <input type="checkbox" defaultChecked className="accent-[#bc8cff] w-3 h-3" />
                     <span className="text-[9px] text-gray-400 group-hover:text-white transition">Hi-Res Fix</span>
                  </label>
               </div>

               <button className="w-full mt-1 bg-gradient-to-r from-[#8c52ff] to-[#bc8cff] hover:from-[#7b3df2] hover:to-[#a96cfc] text-white font-bold py-2 rounded shadow-[0_0_15px_rgba(188,140,255,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 border border-[#bc8cff]/50">
                  <Sparkles size={14} /> GENERATE TEXTURE
               </button>
            </div>
         </div>
         
         {/* Material & Albedo Adjustments */}
         <div className="p-2 border-b border-[#2a2b3d] bg-[#1a1a24] flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-1.5 text-[10px] uppercase"><Settings2 size={12} className="text-[#e3b341]" /> Base Map Edits</h3>
            <span className="text-[9px] text-gray-500 font-mono">NON-DESTRUCTIVE</span>
         </div>
         <div className="p-3 border-b border-[#2a2b3d] flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-2">
               <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] p-1.5 rounded border border-[#2a2b3d] flex flex-col items-center justify-center text-gray-400 hover:text-white gap-1" title="Levels">
                  <Sun size={14}/><span className="text-[8px] uppercase">Levels</span>
               </button>
               <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] p-1.5 rounded border border-[#2a2b3d] flex flex-col items-center justify-center text-gray-400 hover:text-white gap-1" title="Hue/Saturation">
                  <Palette size={14}/><span className="text-[8px] uppercase">HSL</span>
               </button>
               <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] p-1.5 rounded border border-[#2a2b3d] flex flex-col items-center justify-center text-gray-400 hover:text-white gap-1" title="Color Balance">
                  <Hash size={14}/><span className="text-[8px] uppercase">Curves</span>
               </button>
               <button className="bg-[#1a1a24] hover:bg-[#2a2b3d] p-1.5 rounded border border-[#e3b341]/30 hover:border-[#e3b341] flex flex-col items-center justify-center text-[#e3b341] hover:text-[#ffeedd] gap-1 shadow-[0_0_10px_rgba(227,179,65,0.1)]" title="AI Upscale & Denoise">
                  <Sparkles size={14}/><span className="text-[8px] uppercase">ESRGAN</span>
               </button>
            </div>
         </div>

         {/* Layers Panel */}
         <div className="flex-1 flex flex-col shrink-0">
            <div className="p-3 border-b border-[#2a2b3d] flex justify-between items-center bg-[#161621]">
               <h3 className="font-bold text-white flex items-center gap-2"><Layers size={14} className="text-[#58a6ff]" /> Layers</h3>
               <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-white"><Search size={14}/></button>
                  <button className="text-gray-400 hover:text-white"><Menu size={14}/></button>
               </div>
            </div>
            
            <div className="p-2 border-b border-[#2a2b3d] flex gap-2">
               <select className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 outline-none text-[10px] flex-1">
                  <option>Normal</option>
                  <option>Multiply</option>
                  <option>Screen</option>
                  <option>Overlay</option>
                  <option>Color Dodge</option>
                  <option>Linear Burn</option>
               </select>
               <div className="flex items-center gap-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 w-20">
                  <span className="text-[#8b949e]">Op</span>
                  <input type="number" defaultValue={100} className="w-full bg-transparent text-right outline-none appearance-none" />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#0a0a0f] p-2 flex flex-col gap-1">
               {layers.map(layer => (
                  <div key={layer.id} onClick={() => setActiveLayer(layer.id)} className={`flex items-center gap-2 p-1.5 rounded cursor-pointer border ${activeLayer === layer.id ? 'bg-[#58a6ff]/10 border-[#58a6ff]/30' : 'bg-[#161621] border-transparent hover:border-[#2a2b3d]'}`}>
                     <button className="text-gray-400 hover:text-white"><Eye size={14}/></button>
                     <div className="w-8 h-8 bg-white rounded-sm border border-[#2a2b3d] shrink-0 checkerboard-bg">
                        {/* Thumbnail preview graphic */}
                        {layer.name === 'Albedo (Base Color)' && <div className="w-full h-full bg-[#8c7853]"></div>}
                        {layer.name === 'Normal Map' && <div className="w-full h-full bg-[#8080ff]"></div>}
                        {layer.name === 'Roughness Map' && <div className="w-full h-full bg-gray-400"></div>}
                     </div>
                     <div className="flex flex-col flex-1 overflow-hidden">
                        <span className={`text-[11px] truncate font-bold ${activeLayer === layer.id ? 'text-white' : 'text-[#c9d1d9]'}`}>{layer.name}</span>
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] text-[#8b949e]">{layer.blend}</span>
                        </div>
                     </div>
                     {layer.opacity < 100 && <span className="text-[9px] text-[#8b949e] font-mono">{layer.opacity}%</span>}
                  </div>
               ))}
            </div>

            <div className="p-2 border-t border-[#2a2b3d] flex justify-between bg-[#11111b] shrink-0">
               <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2b3d] rounded" title="Link Layers"><GitBranch size={14}/></button>
               <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2b3d] rounded" title="Layer FX"><Sparkles size={14}/></button>
               <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2b3d] rounded" title="Add Layer Mask"><Square size={14}/></button>
               <button className="p-1.5 text-[#3fb950] bg-[#3fb950]/10 hover:bg-[#3fb950]/20 rounded" title="New Layer"><Square size={14}/></button>
               <button className="p-1.5 text-[#f85149] bg-[#f85149]/10 hover:bg-[#f85149]/20 rounded" title="Delete Layer"><Trash2 size={14}/></button>
            </div>
         </div>
      </div>
    </div>
  );
}
