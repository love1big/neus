import React, { useRef, useEffect, useState } from 'react';
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
