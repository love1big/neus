import React, { useRef, useEffect, useState, useMemo } from 'react';
import { PerlinNoise } from './PerlinNoise';

export default function TerrainGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [scale, setScale] = useState(0.02);
  const [octaves, setOctaves] = useState(4);
  const [persistence, setPersistence] = useState(0.5);

  const perlin = useMemo(() => new PerlinNoise(42), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Output from FBM is between -1 and 1
        let noiseValue = perlin.fbm(x, y, octaves, persistence, scale);
        // Normalize to 0-255
        let v = Math.floor(((noiseValue + 1) / 2) * 255);
        if (v < 0) v = 0;
        if (v > 255) v = 255;
        
        // Let's colorize based on height to make it "terrain-like"
        const index = (y * width + x) * 4;
        
        // Deep Water
        if (v < 80) {
            data[index] = 40;
            data[index + 1] = 60;
            data[index + 2] = 200;
        } 
        // Shallow water
        else if (v < 100) {
            data[index] = 60;
            data[index + 1] = 120;
            data[index + 2] = 220;
        }
        // Sand
        else if (v < 110) {
            data[index] = 210;
            data[index + 1] = 200;
            data[index + 2] = 130;
        }
        // Grass
        else if (v < 160) {
            data[index] = 60;
            data[index + 1] = 160;
            data[index + 2] = 60;
        }
        // Forest
        else if (v < 190) {
            data[index] = 30;
            data[index + 1] = 100;
            data[index + 2] = 30;
        }
        // Rock
        else if (v < 220) {
            data[index] = 130;
            data[index + 1] = 130;
            data[index + 2] = 130;
        }
        // Snow
        else {
            data[index] = 240;
            data[index + 1] = 240;
            data[index + 2] = 240;
        }

        data[index + 3] = 255; // Alpha
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [scale, octaves, persistence, perlin]);

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0d1117] overflow-hidden">
      {/* 2D Canvas Viewport */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        <div className="absolute top-4 left-4 flex gap-2 z-10">
            <button className="bg-[#21262d] border border-[#58a6ff] text-[#58a6ff] text-[11px] px-2 py-1 rounded">2D Map Heightmap Preview</button>
        </div>
        <div className="relative shadow-2xl rounded overflow-hidden">
           <canvas 
             ref={canvasRef} 
             width={400} 
             height={400} 
             className="w-full max-w-[500px] aspect-square object-cover bg-black"
             style={{ imageRendering: 'pixelated' }}
           />
        </div>
      </div>
      
      {/* Terrain Controls overlay at bottom */}
      <div className="h-48 border-t border-[#30363d] bg-[#161b22] px-6 py-4 flex flex-col gap-4">
         <div className="text-[#c9d1d9] font-bold uppercase text-[12px] tracking-wider border-b border-[#30363d] pb-2">Perlin Noise Terrain Parameters</div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#8b949e] font-bold">Scale</span>
                  <span className="text-[#3fb950] font-mono">{scale.toFixed(3)}</span>
               </div>
               <input 
                 type="range" min="0.005" max="0.1" step="0.001" 
                 value={scale} 
                 onChange={e => setScale(parseFloat(e.target.value))} 
                 className="w-full accent-[#3fb950]"
               />
            </div>

            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#8b949e] font-bold">Octaves</span>
                  <span className="text-[#58a6ff] font-mono">{octaves}</span>
               </div>
               <input 
                 type="range" min="1" max="8" step="1" 
                 value={octaves} 
                 onChange={e => setOctaves(parseInt(e.target.value))} 
                 className="w-full accent-[#58a6ff]"
               />
            </div>

            <div className="flex flex-col gap-2">
               <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#8b949e] font-bold">Persistence</span>
                  <span className="text-[#e3b341] font-mono">{persistence.toFixed(2)}</span>
               </div>
               <input 
                 type="range" min="0.1" max="0.9" step="0.05" 
                 value={persistence} 
                 onChange={e => setPersistence(parseFloat(e.target.value))} 
                 className="w-full accent-[#e3b341]"
               />
            </div>
         </div>
         
      </div>
    </div>
  );
}
