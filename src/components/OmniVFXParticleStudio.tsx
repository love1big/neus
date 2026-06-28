import React, { useRef, useEffect, useState } from 'react';
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
        ctx.fillStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
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
           <button onClick={() => setIsPlaying(!isPlaying)} className={`px-4 py-2 ${isPlaying ? 'bg-[#f85149]' : 'bg-[#238636]'} text-white rounded font-bold text-sm transition`}>
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
