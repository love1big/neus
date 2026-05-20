import React, { useState } from 'react';
import { Sparkles, Play, Pause, Save, Settings, Layers, Flame, Wind, Droplets, Zap, Eye, Move3D, ArrowUpCircle, Plus, Copy, Trash2 } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { OrbitControls } from '@react-three/drei';

let idCounter = 0;

function ParticleSystem({ isPlaying, gravity, collisionType, initialVelocity }: any) {
  const [particles, setParticles] = useState<any[]>([]);

  useFrame(() => {
    if (isPlaying) {
      if (Math.random() < 0.2) {
        idCounter++;
        setParticles((prev) => {
          const velX = (Math.random() - 0.5) * initialVelocity;
          const velY = initialVelocity;
          const velZ = (Math.random() - 0.5) * initialVelocity;
          
          const newParticles = [...prev, {
            id: idCounter, 
            position: [0, 0, 0], 
            velocity: [velX, velY, velZ]
          }];
          return newParticles.length > 50 ? newParticles.slice(newParticles.length - 50) : newParticles;
        });
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Physics gravity={gravity} paused={!isPlaying}>
        {particles.map((p) => (
          <RigidBody 
             key={p.id} 
             position={p.position as any} 
             linearVelocity={p.velocity as any}
             restitution={collisionType === 'Bounce' ? 0.8 : 0}
             colliders="ball"
           >
            <mesh>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial color="#f85149" emissive="#f85149" emissiveIntensity={2} />
            </mesh>
          </RigidBody>
        ))}

        {collisionType !== 'None' && (
          <RigidBody type="fixed" position={[0, -2, 0]} restitution={collisionType === 'Bounce' ? 0.8 : 0}>
            <mesh>
              <boxGeometry args={[10, 0.5, 10]} />
              <meshStandardMaterial color="#30363d" transparent opacity={0.5} />
            </mesh>
          </RigidBody>
        )}
      </Physics>
      <OrbitControls />
    </>
  );
}

export default function NiagaraEditor() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [gravity, setGravity] = useState<[number, number, number]>([0, -9.8, 0]);
  const [collisionType, setCollisionType] = useState('Bounce');
  const [initialVelocity, setInitialVelocity] = useState(5.0);
  
  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#bc8cff]/10 rounded text-[#bc8cff]"><Sparkles size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Niagara VFX Editor</h2>
              <p className="text-[10px] text-[#8b949e]">Advanced Particle Systems, Ribbon Trails, and GPU Compute FX</p>
            </div>
         </div>
         <div className="flex gap-2 text-[11px] font-bold">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors"><Layers size={12}/> Parameters</button>
            <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors text-[#58a6ff]">
               {isPlaying ? <Pause size={12}/> : <Play size={12}/>} {isPlaying ? 'Pause Sim' : 'Play Sim'}
            </button>
            <button className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded flex items-center gap-2 transition-colors"><Save size={12}/> Apply FX</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Toolbar / Emitters */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117]">
              <span className="text-[11px] font-bold text-[#c9d1d9] uppercase tracking-wide">Emitters</span>
              <button className="text-[#3fb950] hover:text-white px-1"><Plus size={14}/></button>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
              {/* Emitter 1 */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 relative group hover:border-[#bc8cff] transition-colors cursor-pointer">
                 <div className="flex justify-between items-center border-b border-[#30363d] pb-1 mb-2">
                    <span className="text-[11px] font-bold text-[#c9d1d9] flex items-center gap-2"><Flame size={12} className="text-[#f85149]"/> FireCore_GPU</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Copy size={12} className="text-[#8b949e] hover:text-white" />
                       <Trash2 size={12} className="text-[#f85149] hover:text-white" />
                    </div>
                 </div>
                 <div className="space-y-1 text-[10px]">
                    <div className="flex items-center gap-2 text-[#58a6ff] hover:bg-[#161b22] p-1 rounded"><Play size={10}/> Spawn Burst Instant</div>
                    <div className="flex items-center gap-2 text-[#3fb950] hover:bg-[#161b22] p-1 rounded"><Settings size={10}/> Initialize Particle</div>
                    <div className="flex items-center gap-2 text-[#e3b341] hover:bg-[#161b22] p-1 rounded"><ArrowUpCircle size={10}/> Add Velocity</div>
                    <div className="flex items-center gap-2 text-[#bc8cff] hover:bg-[#161b22] p-1 rounded"><Move3D size={10}/> Scale Color</div>
                 </div>
              </div>

              {/* Emitter 2 */}
              <div className="bg-[#0d1117] border border-[#f85149]/30 rounded p-2 relative group hover:border-[#f85149] transition-colors cursor-pointer">
                 <div className="flex justify-between items-center border-b border-[#30363d] pb-1 mb-2">
                    <span className="text-[11px] font-bold text-[#c9d1d9] flex items-center gap-2"><Zap size={12} className="text-[#e3b341]"/> Sparks_CPU</span>
                 </div>
                 <div className="space-y-1 text-[10px]">
                    <div className="flex items-center gap-2 text-[#58a6ff] hover:bg-[#161b22] p-1 rounded"><Play size={10}/> Spawn Rate</div>
                    <div className="flex items-center gap-2 text-[#3fb950] hover:bg-[#161b22] p-1 rounded"><Settings size={10}/> Initialize Particle</div>
                    <div className="flex items-center gap-2 text-[#e3b341] hover:bg-[#161b22] p-1 rounded bg-[#f85149]/20 font-bold text-white"><Wind size={10} className="text-[#f85149]"/> Curl Noise Force</div>
                 </div>
              </div>
              
              {/* Emitter 3 */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 relative group hover:border-[#58a6ff] transition-colors cursor-pointer opacity-50">
                 <div className="flex justify-between items-center border-b border-[#30363d] pb-1 mb-2">
                    <span className="text-[11px] font-bold text-[#c9d1d9] flex items-center gap-2"><Droplets size={12} className="text-[#58a6ff]"/> Smoke_Sprite (Disabled)</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Viewport Area */}
        <div className="flex-1 bg-gradient-to-b from-[#0a0a0a] to-[#111111] relative overflow-hidden flex flex-col items-center justify-center">
           <div className="absolute inset-0 z-10 w-full h-full">
              <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
                 <ParticleSystem 
                    isPlaying={isPlaying} 
                    gravity={gravity} 
                    collisionType={collisionType} 
                    initialVelocity={initialVelocity} 
                 />
              </Canvas>
           </div>
           
           <div className="absolute bottom-4 right-4 flex gap-2 z-20">
              <div className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] rounded p-2 text-[10px] text-[#8b949e] font-mono">
                 Particles: 42,015 | FPS: 144 | GPU: 1.2ms
              </div>
           </div>
           <div className="text-[#333] text-5xl font-bold tracking-widest uppercase rotate-[-10deg] opacity-20 pointer-events-none absolute z-0 left-10">Simulation</div>
        </div>

        {/* Properties Panel */}
        <div className="w-72 border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
           <div className="p-2 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117]">
              <span className="font-bold text-[11px] uppercase tracking-wider text-[#c9d1d9] flex items-center gap-2"><Wind size={12} className="text-[#f85149]"/> Curl Noise Force</span>
              <Settings size={12} className="text-[#8b949e]"/>
           </div>
           
           <div className="p-3 flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar text-[11px]">
              <div className="flex flex-col gap-1">
                 <label className="font-bold text-[#8b949e]">Noise Strength</label>
                 <div className="flex items-center gap-2">
                    <input type="range" className="w-full accent-[#bc8cff]" defaultValue="85" />
                    <span className="text-[#e3b341] font-mono w-8 text-right">850</span>
                 </div>
              </div>
              <div className="flex flex-col gap-1">
                 <label className="font-bold text-[#8b949e]">Noise Frequency</label>
                 <div className="flex items-center gap-2">
                    <input type="range" className="w-full accent-[#bc8cff]" defaultValue="30" />
                    <span className="text-[#e3b341] font-mono w-8 text-right">30</span>
                 </div>
              </div>
              
              <div className="flex flex-col gap-1 mt-2">
                 <label className="font-bold text-[#8b949e]">Pan Noise Field</label>
                 <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="flex bg-[#0d1117] border border-[#30363d] rounded items-center px-2 py-1">
                       <span className="text-[#f85149] font-bold mr-2 text-[9px]">X</span>
                       <input type="number" defaultValue="15.0" className="bg-transparent w-full outline-none text-white font-mono text-right text-[10px]" />
                    </div>
                    <div className="flex bg-[#0d1117] border border-[#30363d] rounded items-center px-2 py-1">
                       <span className="text-[#3fb950] font-bold mr-2 text-[9px]">Y</span>
                       <input type="number" defaultValue="-5.0" className="bg-transparent w-full outline-none text-white font-mono text-right text-[10px]" />
                    </div>
                    <div className="flex bg-[#0d1117] border border-[#30363d] rounded items-center px-2 py-1">
                       <span className="text-[#58a6ff] font-bold mr-2 text-[9px]">Z</span>
                       <input type="number" defaultValue="45.0" className="bg-transparent w-full outline-none text-white font-mono text-right text-[10px]" />
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                 <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" defaultChecked />
                 <span className="text-[#c9d1d9] font-bold">GPU Compute Support</span>
              </div>

              <div className="h-px bg-[#30363d] my-2"></div>

              {/* Physics Properties */}
              <div className="flex flex-col gap-3">
                 <span className="font-bold text-[#f85149] uppercase tracking-wider text-[10px] flex items-center gap-1"><Zap size={10}/> Physics Properties</span>
                 
                 <div className="flex flex-col gap-1">
                    <label className="font-bold text-[#8b949e]">Gravity M/S²</label>
                    <div className="grid grid-cols-3 gap-1">
                       <div className="flex bg-[#0d1117] border border-[#30363d] rounded items-center px-1 py-1">
                          <span className="text-[#f85149] font-bold mr-1 text-[9px]">X</span>
                          <input type="number" value={gravity[0]} onChange={(e) => setGravity([parseFloat(e.target.value)||0, gravity[1], gravity[2]])} className="bg-transparent w-full outline-none text-white font-mono text-right text-[10px]" />
                       </div>
                       <div className="flex bg-[#0d1117] border border-[#30363d] rounded items-center px-1 py-1">
                          <span className="text-[#3fb950] font-bold mr-1 text-[9px]">Y</span>
                          <input type="number" value={gravity[1]} onChange={(e) => setGravity([gravity[0], parseFloat(e.target.value)||0, gravity[2]])} className="bg-transparent w-full outline-none text-white font-mono text-right text-[10px]" />
                       </div>
                       <div className="flex bg-[#0d1117] border border-[#30363d] rounded items-center px-1 py-1">
                          <span className="text-[#58a6ff] font-bold mr-1 text-[9px]">Z</span>
                          <input type="number" value={gravity[2]} onChange={(e) => setGravity([gravity[0], gravity[1], parseFloat(e.target.value)||0])} className="bg-transparent w-full outline-none text-white font-mono text-right text-[10px]" />
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between gap-2 mt-1 border-t border-[#30363d] pt-2">
                    <span className="text-[#8b949e] font-bold">Collision</span>
                    <select value={collisionType} onChange={(e) => setCollisionType(e.target.value)} className="bg-[#0d1117] border border-[#30363d] text-white rounded px-2 py-1 text-[10px] outline-none w-24">
                       <option>None</option>
                       <option>Bounce</option>
                       <option>Stop</option>
                    </select>
                 </div>
                 
                 <div className="flex flex-col gap-1 mt-1 border-t border-[#30363d] pt-2">
                    <label className="font-bold text-[#8b949e]">Initial Velocity</label>
                    <div className="flex items-center gap-2">
                       <input type="range" className="w-full accent-[#58a6ff]" value={initialVelocity} onChange={(e) => setInitialVelocity(parseFloat(e.target.value))} min="0" max="20" step="0.5" />
                       <span className="text-[#58a6ff] font-mono w-8 text-right">{initialVelocity.toFixed(1)}</span>
                    </div>
                 </div>
              </div>

              <div className="h-px bg-[#30363d] my-2"></div>

              <div className="flex flex-col gap-2">
                 <span className="font-bold text-[#bc8cff] uppercase tracking-wider text-[10px]">AI VFX Gen</span>
                 <p className="text-[10px] text-[#8b949e]">Describe an effect, and the AI will assemble emitters, materials, and modules instantly.</p>
                 <textarea className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-[10px] outline-none text-white h-16 resize-none" placeholder="'A swirling cosmic black hole that sucks in nearby debris with purple glow...'" />
                 <button className="bg-[#bc8cff]/20 hover:bg-[#bc8cff]/30 text-[#bc8cff] py-1.5 rounded text-[10px] font-bold border border-[#bc8cff]/50 transition-colors">Generate VFX</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
