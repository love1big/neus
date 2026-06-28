const fs = require('fs');

const visualScripting = `import React, { useState, useRef, useEffect } from 'react';
import { Waypoints, GitBranch, Share2, Network, GitMerge, Activity, CheckCircle2, AlertTriangle, Settings2, Play, Cpu, Bot, Zap, PlusSquare, Trash2, BoxSelect, Maximize, Sliders, ArrowUpRight, Copy, TerminalSquare, Eye, ChevronDown, Flag, Database, RotateCw, Layers } from 'lucide-react';

export default function OmniVisualScriptingEngine() {
  const [activeTab, setActiveTab] = useState('AppLogic');
  
  // Real Drag & Drop Node State
  const [nodes, setNodes] = useState([
    { id: 1, title: 'Event BeginPlay', x: 50, y: 100, color: 'border-[#f85149]', type: 'event' },
    { id: 2, title: 'Spawn Actor', x: 300, y: 150, color: 'border-[#3fb950]', type: 'logic' },
    { id: 3, title: 'Delay 2.0s', x: 550, y: 200, color: 'border-[#58a6ff]', type: 'logic' }
  ]);
  
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handlePointerDown = (id: number, e: React.PointerEvent) => {
    const node = nodes.find(n => n.id === id);
    if(node) {
      setDraggingId(id);
      setOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingId !== null) {
      setNodes(prev => prev.map(n => 
        n.id === draggingId ? { ...n, x: e.clientX - offset.x, y: e.clientY - offset.y } : n
      ));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDraggingId(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0a0a] text-[#cccccc] font-sans text-xs overflow-hidden select-none">
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1.5 rounded border border-[#333] shadow-inner items-center gap-2">
                   <Network size={18} className="text-[#bc8cff] animate-pulse"/>
                   <span className="text-white font-black tracking-widest text-[12px] uppercase">Node Engine Core (Interactive)</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                 <button className="px-5 py-1.5 bg-[#1a1a1a] text-white font-black rounded shadow-[0_0_15px_rgba(255,255,255,0.1)] transition flex items-center gap-2 text-[11px] uppercase tracking-widest border border-white/20 hover:bg-[#222]">
                    <Play size={12} className="text-[#3fb950]"/> Simulate Local
                 </button>
            </div>
         </div>

         <div className="flex px-2 bg-[#0a0a0a] border-t border-[#222]">
            <ModuleTab active={true} onClick={() => {}} icon={<Waypoints size={12}/>} label="Node Graph (Draggable)" color="text-[#3fb950]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-full h-full flex bg-[#050505]">
           <div className="w-[200px] border-r border-[#222] bg-[#111] flex flex-col z-20 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
              <div className="p-2 border-b border-[#333]">
                 <button className="w-full bg-[#238636] hover:bg-[#2ea043] font-bold text-white py-1 rounded" onClick={() => setNodes(p => [...p, { id: Date.now(), title: 'New Node', x: 200, y: 300, color: 'border-[#bc8cff]', type: 'logic' }])}>+ ADD NODE</button>
              </div>
           </div>

           <div className="flex-1 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at center, #222 1px, transparent 1px)', backgroundSize: '30px 30px' }} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
               
               {nodes.map(node => (
                 <div 
                   key={node.id}
                   onPointerDown={(e) => handlePointerDown(node.id, e)}
                   className={\`absolute w-[180px] bg-[#111] border-t-4 \${node.color} border-l border-r border-b border-[#333] rounded shadow-xl z-20 cursor-grab active:cursor-grabbing opacity-90\`} 
                   style={{ left: node.x, top: node.y }}
                 >
                     <div className="px-2 py-1 text-[10px] font-bold text-white border-b border-[#333] flex justify-between items-center tracking-wide" style={{ backgroundColor: node.color.replace('border-', 'bg-').replace(']', ']/20') }}>
                         {node.title}
                     </div>
                     <div className="p-2 flex flex-col font-mono text-[9px] bg-[#0a0a0a]">
                         <div className="flex justify-between items-center bg-[#1a1a1a] rounded px-1 py-0.5 mt-1 border border-[#333]"><div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div><span className="text-[#888]">In</span></div>
                         <div className="flex justify-between items-center bg-[#1a1a1a] rounded px-1 py-0.5 mt-2 border border-[#333]"><span className="text-[#888]">Out</span><div className="w-2 h-2 rounded-full bg-[#58a6ff] ml-2"></div></div>
                     </div>
                 </div>
               ))}
               
               <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
                   {nodes.length >= 2 && <path d={\`M\${nodes[0].x+180} \${nodes[0].y+40} Q \${nodes[0].x+240} \${nodes[0].y+40}, \${nodes[1].x} \${nodes[1].y+30}\`} stroke="#58a6ff" fill="none" strokeWidth="2" />}
                   {nodes.length >= 3 && <path d={\`M\${nodes[1].x+180} \${nodes[1].y+40} Q \${nodes[1].x+240} \${nodes[1].y+40}, \${nodes[2].x} \${nodes[2].y+30}\`} stroke="#58a6ff" fill="none" strokeWidth="2" />}
               </svg>
           </div>
        </div>
      </div>
    </div>
  );
}

function ModuleTab({ active, onClick, icon, label, color }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; color: string }) {
   return (
      <div 
         onClick={onClick}
         className={\`px-4 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer border-t-[2px] transition-colors
         \${active ? \`bg-[#111] text-white \${color.replace('text-', 'border-')}\` : 'border-transparent text-[#888] hover:bg-[#1a1a1a]'}\`}
      >
         <span className={active ? color : 'opacity-70'}>{icon}</span> {label}
      </div>
   );
}
`;
fs.writeFileSync('src/components/OmniVisualScriptingEngine.tsx', visualScripting);


const particleSystem = `import React, { useRef, useEffect, useState } from 'react';
import { Activity, Play, Star, Settings2, Wind, Droplets, Zap } from 'lucide-react';

export default function OmniVFXParticleStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [particleCount, setParticleCount] = useState(200);
  const [speed, setSpeed] = useState(2);
  const [color, setColor] = useState('#58a6ff');
  
  const particles = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;

    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * speed * 2,
          vy: (Math.random() - 0.5) * speed * 2,
          life: Math.random() * 100 + 50,
          maxLife: 150
        });
      }
    };
    
    initParticles();

    const loop = () => {
      if(!isPlaying) {
         animationId = requestAnimationFrame(loop);
         return;
      }
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.current.length; i++) {
        let p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        
        if (p.life <= 0) {
          p.x = canvas.width / 2;
          p.y = canvas.height / 2;
          p.vx = (Math.random() - 0.5) * speed * 2;
          p.vy = (Math.random() - 0.5) * speed * 2;
          p.life = p.maxLife;
        }

        const opacity = Math.max(0, p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = \`\${color}\${Math.floor(opacity * 255).toString(16).padStart(2, '0')}\`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(loop);
    };
    
    loop();
    
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, particleCount, speed, color]);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-6">
      <div className="mb-6 flex justify-between items-center border-b border-[#30363d] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#e6edf3] mb-1 flex items-center gap-2">
            <Star className="text-[#e3b341]"/> VFX Particle Simulation (Active Renderer)
          </h1>
          <p className="text-[#8b949e] text-sm">Real-time HTML5 Canvas Particle Logic.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setIsPlaying(!isPlaying)} className={\`px-4 py-2 \${isPlaying ? 'bg-[#f85149]' : 'bg-[#238636]'} text-white rounded font-bold text-sm transition\`}>
              {isPlaying ? 'PAUSE EMITTER' : 'RESUME EMITTER'}
           </button>
        </div>
      </div>
      
      <div className="flex-1 flex gap-6">
         <div className="w-80 bg-[#161b22] border border-[#30363d] rounded p-4 flex flex-col gap-6">
            <h2 className="font-bold text-[#e6edf3] border-b border-[#30363d] pb-2 uppercase text-sm">Emitter Settings</h2>
            
            <div>
               <label className="text-xs text-[#8b949e] font-bold block mb-2">Max Particles: {particleCount}</label>
               <input type="range" min="10" max="2000" value={particleCount} onChange={(e) => setParticleCount(parseInt(e.target.value))} className="w-full accent-[#e3b341]"/>
            </div>
            
            <div>
               <label className="text-xs text-[#8b949e] font-bold block mb-2">Emission Speed: {speed.toFixed(1)}x</label>
               <input type="range" min="0.5" max="10" step="0.1" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full accent-[#e3b341]"/>
            </div>

            <div>
               <label className="text-xs text-[#8b949e] font-bold block mb-2">Particle Color</label>
               <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent border-0 outline-none"/>
            </div>
            
            <div className="mt-4 border-t border-[#30363d] pt-4">
               <button onClick={() => setColor('#f85149')} className="w-full bg-[#111] hover:bg-[#222] border border-[#30363d] p-2 rounded text-xs font-bold text-[#f85149] mb-2 flex items-center justify-center gap-2"><Zap size={14}/> Fire Preset</button>
               <button onClick={() => setColor('#58a6ff')} className="w-full bg-[#111] hover:bg-[#222] border border-[#30363d] p-2 rounded text-xs font-bold text-[#58a6ff] mb-2 flex items-center justify-center gap-2"><Droplets size={14}/> Water Preset</button>
               <button onClick={() => setColor('#3fb950')} className="w-full bg-[#111] hover:bg-[#222] border border-[#30363d] p-2 rounded text-xs font-bold text-[#3fb950] mb-2 flex items-center justify-center gap-2"><Wind size={14}/> Bio Preset</button>
            </div>
         </div>
         
         <div className="flex-1 bg-black border border-[#30363d] rounded flex items-center justify-center relative overflow-hidden">
             <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-cover"></canvas>
             
             <div className="absolute top-4 left-4 bg-black/60 border border-[#30363d] p-2 rounded text-[10px] font-mono text-[#58a6ff]">
                <div>FPS: 60 (Simulated)</div>
                <div>Entity Count: {particleCount}</div>
                <div>Render Delta: {(1000/60).toFixed(1)}ms</div>
             </div>
         </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/OmniVFXParticleStudio.tsx', particleSystem);

const proceduralTerrain = `import React, { useRef, useEffect, useState } from 'react';
import { Map, RefreshCw, ZoomIn, Target } from 'lucide-react';

export default function TerrainGenerator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [seed, setSeed] = useState(Math.random() * 10000);
  const [scale, setScale] = useState(40);
  const [waterLevel, setWaterLevel] = useState(0.4);
  const [mountainLevel, setMountainLevel] = useState(0.7);

  // Very simple fast pseudo-random noise replace for demo
  const noise = (x: number, y: number, s: number) => {
    return (Math.sin(x * s + s) + Math.cos(y * s + s) + Math.sin((x+y)*s*1.5)) / 3 + 0.5;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const w = canvas.width;
    const h = canvas.height;
    
    // Create image data
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        // Normalize coordinates and apply scale
        const nx = x / scale;
        const ny = y / scale;
        
        let val = noise(nx, ny, seed);
        val = Math.max(0, Math.min(1, val));
        
        let r, g, b;
        
        if (val < waterLevel) {
          // Deep to shallow water
          r = 30; g = 80 + (val * 100); b = 150 + (val * 100);
        } else if (val < waterLevel + 0.05) {
          // Sand
          r = 210; g = 190; b = 130;
        } else if (val < mountainLevel) {
          // Grass to forest
          r = 50; g = 140 - (val * 50); b = 50;
        } else if (val < mountainLevel + 0.1) {
          // Rock
          r = 100; g = 100; b = 100;
        } else {
          // Snow
          r = 250; g = 250; b = 250;
        }
        
        const idx = (y * w + x) * 4;
        data[idx] = r;
        data[idx+1] = g;
        data[idx+2] = b;
        data[idx+3] = 255; // Alpha
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
  }, [seed, scale, waterLevel, mountainLevel]);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-6 overflow-hidden">
      <div className="mb-6 flex justify-between items-center border-b border-[#30363d] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#e6edf3] mb-1 flex items-center gap-2">
            <Map className="text-[#3fb950]"/> Procedural Terrain Generation
          </h1>
          <p className="text-[#8b949e] text-sm">Real-time HTML5 Canvas noise generation logic.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setSeed(Math.random() * 10000)} className="px-4 py-2 bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-white rounded font-bold text-sm flex items-center gap-2 transition"><RefreshCw size={16}/> Reseed Biomes</button>
        </div>
      </div>
      
      <div className="flex-1 flex gap-6">
         <div className="w-80 bg-[#161b22] border border-[#30363d] rounded p-4 flex flex-col gap-6 filter drop-shadow-xl h-fit">
            <h2 className="font-bold text-[#e6edf3] border-b border-[#30363d] pb-2 uppercase text-sm">Noise Algorithm</h2>
            
            <div>
               <label className="text-xs text-[#8b949e] font-bold block mb-2 text-justify">Noise Frequency (Detail): {scale}</label>
               <input type="range" min="10" max="200" value={scale} onChange={(e) => setScale(parseInt(e.target.value))} className="w-full accent-[#3fb950]"/>
            </div>
            
            <div>
               <label className="text-xs text-[#8b949e] font-bold block mb-2 text-justify">Water Level: {(waterLevel*100).toFixed(0)}%</label>
               <input type="range" min="0" max="1" step="0.01" value={waterLevel} onChange={(e) => setWaterLevel(parseFloat(e.target.value))} className="w-full accent-[#58a6ff]"/>
            </div>
            
            <div>
               <label className="text-xs text-[#8b949e] font-bold block mb-2 text-justify">Mountain Edge Level: {(mountainLevel*100).toFixed(0)}%</label>
               <input type="range" min="0.5" max="1" step="0.01" value={mountainLevel} onChange={(e) => setMountainLevel(parseFloat(e.target.value))} className="w-full accent-[#e3b341]"/>
            </div>
         </div>
         
         <div className="flex-1 bg-black border border-[#30363d] rounded flex items-center justify-center overflow-hidden p-6 relative">
            <div className="absolute inset-0 opacity-20 pointer-events-none"></div>
            <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-contain filter drop-shadow-2xl rounded-lg border border-[#30363d] z-10"></canvas>
         </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/TerrainGenerator.tsx', proceduralTerrain);


const pixelArtEditor = `import React, { useRef, useState, useEffect } from 'react';
import { Image as ImageIcon, Scissors, Edit2, Eraser, Square, Save, Trash2, Download } from 'lucide-react';

export default function ImageEditor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState('draw'); // draw, erase
  const [color, setColor] = useState('#ff7b72');
  const [isDrawing, setIsDrawing] = useState(false);
  const [size, setSize] = useState(24); // Size in pixels for 24x24 grid

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
       ctx.fillRect(x, y, 1, 1);
    } else if (tool === 'erase') {
       ctx.clearRect(x, y, 1, 1);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    canvas.getContext('2d')?.clearRect(0,0,size,size);
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans p-6 overflow-hidden">
      <div className="mb-6 flex justify-between items-center border-b border-[#30363d] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#e6edf3] mb-1 flex items-center gap-2">
            <ImageIcon className="text-[#bc8cff]"/> Functional Pixel Art / Texture Studio
          </h1>
          <p className="text-[#8b949e] text-sm">HTML5 Canvas base for sprite rendering and asset design.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={clearCanvas} className="px-4 py-2 bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-[#f85149] rounded font-bold text-sm flex items-center gap-2 transition"><Trash2 size={16}/> Clear Layer</button>
           <button className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded font-bold text-sm flex items-center gap-2 transition"><Download size={16}/> Export PNG</button>
        </div>
      </div>
      
      <div className="flex-1 flex gap-6 items-start">
         <div className="w-64 bg-[#161b22] border border-[#30363d] rounded p-4 flex flex-col gap-6">
            <div className="flex gap-2">
               <button onClick={() => setTool('draw')} className={\`flex-1 p-2 rounded flex items-center justify-center gap-2 font-bold \${tool==='draw' ? 'bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]' : 'bg-[#21262d] text-[#8b949e] border border-[#30363d]'}\`}><Edit2 size={16}/> Draw</button>
               <button onClick={() => setTool('erase')} className={\`flex-1 p-2 rounded flex items-center justify-center gap-2 font-bold \${tool==='erase' ? 'bg-[#f85149]/20 text-[#f85149] border border-[#f85149]' : 'bg-[#21262d] text-[#8b949e] border border-[#30363d]'}\`}><Eraser size={16}/> Erase</button>
            </div>
            
            <div>
               <label className="text-xs text-[#8b949e] font-bold block mb-2">Palette Color</label>
               <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer bg-transparent border-0 outline-none"/>
               <div className="grid grid-cols-4 gap-2 mt-2">
                 {['#ff7b72', '#ffc212', '#3fb950', '#58a6ff', '#bc8cff', '#ffffff', '#888888', '#000000'].map(c => (
                    <button key={c} onClick={() => setColor(c)} className={\`h-6 rounded \${color===c ? 'ring-2 ring-white' : 'ring-1 ring-[#30363d]'}\`} style={{backgroundColor: c}}></button>
                 ))}
               </div>
            </div>
            
            <div>
               <label className="text-xs text-[#8b949e] font-bold block mb-2">Resolution: {size}x{size}</label>
               <p className="text-[9px] text-[#666]">Note: Changing size clears canvas in demo mode.</p>
               <input type="range" min="8" max="64" step="8" value={size} onChange={(e) => { setSize(parseInt(e.target.value)); setTimeout(clearCanvas, 50); }} className="w-full accent-[#bc8cff] mt-2"/>
            </div>
         </div>
         
         <div className="flex-1 bg-[#111] border border-[#30363d] rounded p-8 flex items-center justify-center relative shadow-inner overflow-hidden">
             {/* Transparency Grid Pattern */}
             <div className="w-[500px] h-[500px] absolute pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222), linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
             
             <canvas 
                ref={canvasRef} 
                width={size} 
                height={size} 
                style={{ imageRendering: 'pixelated', width: 500, height: 500 }}
                className="bg-transparent border border-[#555] shadow-2xl cursor-crosshair z-10"
                onMouseDown={(e) => { setIsDrawing(true); drawPixel(e); }}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                onMouseMove={(e) => { if(isDrawing) drawPixel(e) }}
             ></canvas>
         </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/ImageEditor.tsx', pixelArtEditor);

console.log("All massive functionality components written.");
