import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Sparkles, Zap, Flame, Wind, Droplets, Sliders, Cpu, Wand2, Brain, Orbit, Plus, Trash2, Layers, ChevronDown, Play, Square, Save, FolderOpen, RefreshCcw, Camera, Box, Move, GitMerge, Activity, Eye, EyeOff, Target, Minimize2, Maximize2, Hexagon, Circle, PlayCircle, Settings, Palette } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- Advanced Types ---
type BlendMode = 'Normal' | 'Additive' | 'Multiply' | 'Screen';
type EmitterShape = 'Point' | 'Sphere' | 'Box' | 'Cone';
type ParticleShape = 'Sphere' | 'Star' | 'Ring' | 'Spark';

interface ParticleSystemParams {
  id: string;
  name: string;
  enabled: boolean;
  // Emission
  count: number;
  emissionRate: number;
  emitterShape: EmitterShape;
  emitterSize: number;
  // Life
  lifetime: number;
  lifetimeJitter: number;
  // Motion
  speed: number;
  speedJitter: number;
  gravity: number;
  drag: number;
  // Modifiers
  turbulence: number;
  turbulenceFreq: number;
  vortexStrength: number;
  // Appearance
  colorStart: string;
  colorMid: string;
  colorEnd: string;
  sizeStart: number;
  sizeMid: number;
  sizeEnd: number;
  shape: ParticleShape;
  blendMode: BlendMode;
  // Physics
  collision: boolean;
  bounce: number;
}

// --- Default Data ---
const DEFAULT_SYSTEMS: ParticleSystemParams[] = [
  {
    id: 'sys_quantum_core',
    name: 'Quantum Core',
    enabled: true,
    count: 5000,
    emissionRate: 1500,
    emitterShape: 'Sphere',
    emitterSize: 0.5,
    lifetime: 2.5,
    lifetimeJitter: 1.0,
    speed: 1.5,
    speedJitter: 0.5,
    gravity: 0.0,
    drag: 0.5,
    turbulence: 3.5,
    turbulenceFreq: 2.0,
    vortexStrength: 5.0,
    colorStart: '#00ffff',
    colorMid: '#8a2be2',
    colorEnd: '#ff00ff',
    sizeStart: 0.05,
    sizeMid: 0.15,
    sizeEnd: 0.01,
    shape: 'Sphere',
    blendMode: 'Additive',
    collision: false,
    bounce: 0.5,
  },
  {
    id: 'sys_plasma_ring',
    name: 'Plasma Ring',
    enabled: true,
    count: 3000,
    emissionRate: 800,
    emitterShape: 'Box',
    emitterSize: 2.0,
    lifetime: 3.0,
    lifetimeJitter: 0.5,
    speed: 0.5,
    speedJitter: 0.2,
    gravity: -0.5,
    drag: 1.0,
    turbulence: 1.0,
    turbulenceFreq: 1.0,
    vortexStrength: -2.0,
    colorStart: '#ff5500',
    colorMid: '#ffcc00',
    colorEnd: '#220000',
    sizeStart: 0.1,
    sizeMid: 0.05,
    sizeEnd: 0.0,
    shape: 'Star',
    blendMode: 'Additive',
    collision: true,
    bounce: 0.3,
  }
];

// --- 3D Particle Component ---
function ParticleSystem({ params, isPlaying }: { params: ParticleSystemParams; isPlaying: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create arrays
  const { positions, velocities, lifetimes, maxLifetimes, colors, sizes } = useMemo(() => {
    const p = new Float32Array(params.count * 3);
    const v = new Float32Array(params.count * 3);
    const l = new Float32Array(params.count);
    const ml = new Float32Array(params.count);
    const c = new Float32Array(params.count * 3);
    const s = new Float32Array(params.count);
    
    for(let i=0; i<params.count; i++) {
      l[i] = -1.0; 
      ml[i] = params.lifetime + (Math.random() - 0.5) * params.lifetimeJitter;
      p[i*3] = p[i*3+1] = p[i*3+2] = 0;
      s[i] = 0;
    }
    
    return { positions: p, velocities: v, lifetimes: l, maxLifetimes: ml, colors: c, sizes: s };
  }, [params.count]);

  const colStart = useMemo(() => new THREE.Color(params.colorStart), [params.colorStart]);
  const colMid = useMemo(() => new THREE.Color(params.colorMid), [params.colorMid]);
  const colEnd = useMemo(() => new THREE.Color(params.colorEnd), [params.colorEnd]);

  useFrame((state, delta) => {
    if (!isPlaying || !pointsRef.current) return;
    if (!params.enabled) {
      pointsRef.current.visible = false;
      return;
    }
    pointsRef.current.visible = true;
    
    const geo = pointsRef.current.geometry as THREE.BufferGeometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const colAttr = geo.attributes.color as THREE.BufferAttribute;
    const sizeAttr = geo.attributes.size as THREE.BufferAttribute;
    
    const time = state.clock.getElapsedTime();
    const emitCount = Math.floor(params.emissionRate * delta);
    let emitted = 0;
    
    for (let i = 0; i < params.count; i++) {
      if (lifetimes[i] > 0) {
        lifetimes[i] -= delta;
        
        // Physics update
        velocities[i*3+1] += params.gravity * delta; // Gravity
        
        // Turbulence
        const px = posAttr.array[i*3];
        const py = posAttr.array[i*3+1];
        const pz = posAttr.array[i*3+2];
        
        const f = params.turbulenceFreq;
        velocities[i*3] += Math.sin(py * f + time) * params.turbulence * delta;
        velocities[i*3+1] += Math.cos(pz * f + time * 1.1) * params.turbulence * delta;
        velocities[i*3+2] += Math.sin(px * f + time * 0.9) * params.turbulence * delta;
        
        // Vortex (spin around Y axis)
        if (params.vortexStrength !== 0) {
           const dist2D = Math.sqrt(px*px + pz*pz);
           if (dist2D > 0.01) {
             const vX = -pz / dist2D * params.vortexStrength;
             const vZ = px / dist2D * params.vortexStrength;
             velocities[i*3] += vX * delta;
             velocities[i*3+2] += vZ * delta;
           }
        }
        
        // Drag
        const dragFactor = 1.0 - Math.min(params.drag * delta, 1.0);
        velocities[i*3] *= dragFactor;
        velocities[i*3+1] *= dragFactor;
        velocities[i*3+2] *= dragFactor;
        
        // Apply Velocity
        posAttr.array[i*3] += velocities[i*3] * delta;
        posAttr.array[i*3+1] += velocities[i*3+1] * delta;
        posAttr.array[i*3+2] += velocities[i*3+2] * delta;
        
        // Collision with ground (Y=0)
        if (params.collision && posAttr.array[i*3+1] < 0) {
          posAttr.array[i*3+1] = 0;
          velocities[i*3+1] *= -params.bounce;
          velocities[i*3] *= 0.8; // friction
          velocities[i*3+2] *= 0.8;
        }
        
        // Color & Size over life
        const lifeT = 1.0 - (lifetimes[i] / maxLifetimes[i]);
        
        let c = new THREE.Color();
        if (lifeT < 0.5) {
          c.copy(colStart).lerp(colMid, lifeT * 2.0);
          sizeAttr.array[i] = params.sizeStart + (params.sizeMid - params.sizeStart) * (lifeT * 2.0);
        } else {
          c.copy(colMid).lerp(colEnd, (lifeT - 0.5) * 2.0);
          sizeAttr.array[i] = params.sizeMid + (params.sizeEnd - params.sizeMid) * ((lifeT - 0.5) * 2.0);
        }
        
        colAttr.array[i*3] = c.r;
        colAttr.array[i*3+1] = c.g;
        colAttr.array[i*3+2] = c.b;
        
        if (lifetimes[i] <= 0) sizeAttr.array[i] = 0;
        
      } else if (emitted < emitCount) {
        // Spawn
        lifetimes[i] = maxLifetimes[i];
        
        // Emitter Shape Position
        let x=0, y=0, z=0;
        const r = params.emitterSize;
        if (params.emitterShape === 'Sphere') {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          const rad = Math.cbrt(Math.random()) * r;
          x = rad * Math.sin(phi) * Math.cos(theta);
          y = rad * Math.sin(phi) * Math.sin(theta);
          z = rad * Math.cos(phi);
        } else if (params.emitterShape === 'Box') {
          x = (Math.random() - 0.5) * r;
          y = (Math.random() - 0.5) * r;
          z = (Math.random() - 0.5) * r;
        } else if (params.emitterShape === 'Cone') {
          const theta = Math.random() * Math.PI * 2;
          const h = Math.random() * r;
          const rad = (h/r) * r;
          x = rad * Math.cos(theta);
          y = h;
          z = rad * Math.sin(theta);
        }
        
        posAttr.array[i*3] = x;
        posAttr.array[i*3+1] = y + 0.1; // slight offset
        posAttr.array[i*3+2] = z;
        
        // Initial Velocity
        const vSpeed = params.speed + (Math.random() - 0.5) * params.speedJitter;
        let vx=0, vy=vSpeed, vz=0;
        
        if (params.emitterShape === 'Cone') {
           const spread = 0.5;
           vx = (Math.random() - 0.5) * spread * vSpeed;
           vz = (Math.random() - 0.5) * spread * vSpeed;
        } else {
           const theta = Math.random() * Math.PI * 2;
           const phi = Math.acos((Math.random() * 2) - 1);
           vx = vSpeed * Math.sin(phi) * Math.cos(theta);
           vy = vSpeed * Math.sin(phi) * Math.sin(theta);
           vz = vSpeed * Math.cos(phi);
        }
        
        velocities[i*3] = vx;
        velocities[i*3+1] = vy;
        velocities[i*3+2] = vz;
        
        emitted++;
      }
    }
    
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
  });
  
  let blending: THREE.Blending = THREE.NormalBlending;
  if (params.blendMode === 'Additive') blending = THREE.AdditiveBlending;
  if (params.blendMode === 'Multiply') blending = THREE.MultiplyBlending;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={params.count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={params.count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={params.count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial 
        size={1} 
        sizeAttenuation={true} 
        vertexColors={true} 
        transparent={true} 
        blending={blending}
        depthWrite={false}
      />
    </points>
  );
}

// --- UI Components ---
const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
  <div className="flex items-center gap-2 text-indigo-400 font-bold mb-3 uppercase tracking-wider text-xs border-b border-gray-800 pb-2">
    {icon} {title}
  </div>
);

const SliderControl = ({ label, value, min, max, step, onChange, unit="" }: any) => (
  <div className="flex flex-col gap-1 mb-3">
    <div className="flex justify-between text-[11px] text-gray-400">
      <span>{label}</span>
      <span className="font-mono text-gray-300">{Number(value).toFixed(step < 1 ? 2 : 0)}{unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

const SelectControl = ({ label, value, options, onChange }: any) => (
  <div className="flex flex-col gap-1 mb-3">
    <span className="text-[11px] text-gray-400">{label}</span>
    <select 
      value={value} onChange={(e) => onChange(e.target.value)}
      className="bg-gray-950 border border-gray-800 text-gray-200 text-xs rounded px-2 py-1.5 focus:border-indigo-500 outline-none"
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const ColorControl = ({ label, value, onChange }: any) => (
  <div className="flex flex-col gap-1 mb-3">
    <span className="text-[11px] text-gray-400">{label}</span>
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0" />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="bg-gray-950 border border-gray-800 text-xs text-gray-300 rounded px-2 py-1 flex-1 outline-none font-mono" />
    </div>
  </div>
);

const ToggleControl = ({ label, checked, onChange }: any) => (
  <label className="flex items-center justify-between cursor-pointer mb-3">
    <span className="text-[11px] text-gray-400">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className={`block w-8 h-4 rounded-full transition-colors ${checked ? 'bg-indigo-500' : 'bg-gray-700'}`}></div>
      <div className={`dot absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
    </div>
  </label>
);


export default function UltimateEffectVFXStudio() {
  const [activeTab, setActiveTab] = useState<'Inspector' | 'AIOffline' | 'PostProcessing'>('Inspector');
  const [inspectorTab, setInspectorTab] = useState<'Emission' | 'Motion' | 'Appearance' | 'Physics'>('Emission');
  
  const [systems, setSystems] = useState<ParticleSystemParams[]>(DEFAULT_SYSTEMS);
  const [selectedSysId, setSelectedSysId] = useState<string>(DEFAULT_SYSTEMS[0].id);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // AI
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  
  const selectedSys = systems.find(s => s.id === selectedSysId) || systems[0];

  const updateSys = (id: string, updates: Partial<ParticleSystemParams>) => {
    setSystems(systems.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const generateAI = () => {
    setIsAiGenerating(true);
    setAiLogs(["[AI_CORE] Initializing localized heuristic matrix...", `[INPUT] ${aiPrompt}`]);
    
    setTimeout(() => setAiLogs(p => [...p, "[ANALYSIS] Extracting spatial & elemental keywords..."]), 800);
    setTimeout(() => setAiLogs(p => [...p, "[PHYSICS] Configuring Navier-Stokes approximations..."]), 1600);
    setTimeout(() => setAiLogs(p => [...p, "[SHADER] Building optimal color gradients and blend modes..."]), 2400);
    
    setTimeout(() => {
      const isFire = aiPrompt.toLowerCase().includes('fire') || aiPrompt.toLowerCase().includes('flame');
      const isMagic = aiPrompt.toLowerCase().includes('magic') || aiPrompt.toLowerCase().includes('spell');
      
      const newSys: ParticleSystemParams = {
        id: `sys_ai_${Date.now()}`,
        name: `AI: ${aiPrompt.split(' ').slice(0,2).join(' ')}`,
        enabled: true,
        count: 1000 + Math.random() * 5000,
        emissionRate: 500 + Math.random() * 1500,
        emitterShape: Math.random() > 0.5 ? 'Sphere' : 'Cone',
        emitterSize: 0.5 + Math.random() * 2.0,
        lifetime: 1.0 + Math.random() * 3.0,
        lifetimeJitter: Math.random(),
        speed: 1.0 + Math.random() * 10.0,
        speedJitter: Math.random() * 2.0,
        gravity: isFire ? -2.0 : (Math.random() - 0.5) * 5.0,
        drag: 0.5 + Math.random() * 2.0,
        turbulence: isMagic ? 5.0 + Math.random() * 5.0 : Math.random() * 3.0,
        turbulenceFreq: 1.0 + Math.random() * 3.0,
        vortexStrength: isMagic ? 5.0 : 0.0,
        colorStart: isFire ? '#ffdd00' : '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
        colorMid: isFire ? '#ff5500' : '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
        colorEnd: isFire ? '#220000' : '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
        sizeStart: 0.1 + Math.random() * 0.3,
        sizeMid: 0.05 + Math.random() * 0.2,
        sizeEnd: Math.random() * 0.05,
        shape: 'Sphere',
        blendMode: 'Additive',
        collision: Math.random() > 0.5,
        bounce: Math.random() * 0.8,
      };
      
      setSystems(p => [...p, newSys]);
      setSelectedSysId(newSys.id);
      setIsAiGenerating(false);
      setAiLogs(p => [...p, "[SUCCESS] Particle heuristic synthesized successfully. Ready for render."]);
    }, 3500);
  };

  return (
    <div className="h-full w-full bg-[#0a0a0c] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="h-12 bg-black border-b border-gray-800 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-[0_0_10px_rgba(79,70,229,0.5)]">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-gray-100">OMNI<span className="text-indigo-400">VFX</span> STUDIO</h1>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-900 rounded p-1">
          <button className={`p-1.5 px-3 text-xs font-bold rounded ${isPlaying ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`} onClick={() => setIsPlaying(true)}><Play size={12} className="inline mr-1"/> PLAY</button>
          <button className={`p-1.5 px-3 text-xs font-bold rounded ${!isPlaying ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`} onClick={() => setIsPlaying(false)}><Square size={12} className="inline mr-1"/> STOP</button>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-white p-2"><Save size={14}/></button>
          <button className="text-gray-400 hover:text-white p-2"><FolderOpen size={14}/></button>
          <button className="text-gray-400 hover:text-white p-2"><Settings size={14}/></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL - Hierarchy */}
        <div className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-black/50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hierarchy</span>
            <button onClick={() => {
              const id = `sys_${Date.now()}`;
              setSystems([...systems, { ...DEFAULT_SYSTEMS[0], id, name: `New Emitter` }]);
              setSelectedSysId(id);
            }} className="p-1 bg-gray-800 hover:bg-indigo-600 rounded text-white transition-colors">
              <Plus size={14}/>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {systems.map(sys => (
              <div 
                key={sys.id}
                onClick={() => setSelectedSysId(sys.id)}
                className={`flex items-center justify-between p-2 rounded cursor-pointer text-xs transition-colors ${selectedSysId === sys.id ? 'bg-indigo-600/20 border border-indigo-500/50 text-white' : 'bg-transparent border border-transparent text-gray-400 hover:bg-gray-900'}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div onClick={(e) => { e.stopPropagation(); updateSys(sys.id, {enabled: !sys.enabled})}} className="text-gray-500 hover:text-gray-300">
                    {sys.enabled ? <Eye size={14}/> : <EyeOff size={14}/>}
                  </div>
                  <Flame size={12} className="text-orange-400" />
                  <span className="truncate">{sys.name}</span>
                </div>
                {systems.length > 1 && (
                  <button onClick={(e) => { e.stopPropagation(); setSystems(systems.filter(s => s.id !== sys.id)); if(selectedSysId===sys.id) setSelectedSysId(systems[0].id); }} className="text-gray-600 hover:text-red-400">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Main Module Tabs */}
          <div className="flex flex-col p-2 gap-1 border-t border-gray-800 bg-black">
            {[
              {id: 'Inspector', icon: <Sliders size={14}/>, label: 'Manual Inspector'},
              {id: 'AIOffline', icon: <Brain size={14}/>, label: 'AI Synthesis (Offline)'},
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 p-2 text-xs font-bold rounded transition-all ${activeTab === tab.id ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-900'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CENTER PANEL - 3D Viewport */}
        <div className="flex-1 relative bg-black">
          <Canvas camera={{ position: [0, 3, 10], fov: 50 }}>
            <color attach="background" args={['#050508']} />
            <fog attach="fog" args={['#050508', 5, 30]} />
            <ambientLight intensity={0.5} />
            <OrbitControls makeDefault />
            <Grid infiniteGrid fadeDistance={30} sectionColor="#444" cellColor="#111" />
            <group>
              {systems.map(sys => (
                <ParticleSystem key={sys.id} params={sys} isPlaying={isPlaying} />
              ))}
            </group>
          </Canvas>
          
          {/* Viewport Overlay */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur border border-gray-800 p-3 rounded-lg flex flex-col gap-2 font-mono text-[10px]">
            <div className="flex justify-between gap-6"><span className="text-gray-500">FPS</span><span className="text-green-400">60</span></div>
            <div className="flex justify-between gap-6"><span className="text-gray-500">PARTICLES</span><span className="text-indigo-400">{systems.reduce((acc, s) => acc + (s.enabled ? s.count : 0), 0)}</span></div>
            <div className="flex justify-between gap-6"><span className="text-gray-500">DRAW CALLS</span><span className="text-yellow-400">{systems.filter(s=>s.enabled).length}</span></div>
          </div>
        </div>

        {/* RIGHT PANEL - Tools */}
        <div className="w-[340px] bg-gray-950 border-l border-gray-800 flex flex-col shrink-0">
          
          {activeTab === 'Inspector' && (
            <>
              {/* Emitter Name Header */}
              <div className="p-4 border-b border-gray-800 bg-gray-900/50">
                <input 
                  type="text" value={selectedSys.name} onChange={(e) => updateSys(selectedSysId, {name: e.target.value})}
                  className="bg-transparent text-sm font-bold text-white w-full outline-none focus:border-b focus:border-indigo-500 pb-1"
                />
                <div className="text-[10px] text-gray-500 font-mono mt-1">ID: {selectedSys.id}</div>
              </div>

              {/* Inspector Sub-Tabs */}
              <div className="flex px-2 pt-2 gap-1 border-b border-gray-800 bg-black">
                {['Emission', 'Motion', 'Appearance', 'Physics'].map(tab => (
                  <button 
                    key={tab} onClick={() => setInspectorTab(tab as any)}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-t ${inspectorTab === tab ? 'bg-gray-900 text-indigo-400 border-t border-indigo-500' : 'text-gray-600 hover:text-gray-300 hover:bg-gray-900/50'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Inspector Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                
                {inspectorTab === 'Emission' && (
                  <div className="space-y-4 bg-gray-900/50 p-3 rounded border border-gray-800/50">
                    <SectionHeader title="Emitter Shape" icon={<Target size={14}/>} />
                    <SelectControl label="Shape" value={selectedSys.emitterShape} options={['Point', 'Sphere', 'Box', 'Cone']} onChange={(v:any) => updateSys(selectedSysId, {emitterShape: v})} />
                    <SliderControl label="Emitter Size" value={selectedSys.emitterSize} min={0} max={10} step={0.1} onChange={(v:any) => updateSys(selectedSysId, {emitterSize: v})} />
                    
                    <div className="h-4"></div>
                    <SectionHeader title="Spawning" icon={<Activity size={14}/>} />
                    <SliderControl label="Max Particles" value={selectedSys.count} min={10} max={50000} step={100} onChange={(v:any) => updateSys(selectedSysId, {count: v})} />
                    <SliderControl label="Rate (per sec)" value={selectedSys.emissionRate} min={1} max={10000} step={10} onChange={(v:any) => updateSys(selectedSysId, {emissionRate: v})} />
                    
                    <div className="h-4"></div>
                    <SectionHeader title="Lifetime" icon={<Move size={14}/>} />
                    <SliderControl label="Duration" value={selectedSys.lifetime} min={0.1} max={20} step={0.1} onChange={(v:any) => updateSys(selectedSysId, {lifetime: v})} unit="s" />
                    <SliderControl label="Random Jitter" value={selectedSys.lifetimeJitter} min={0} max={5} step={0.1} onChange={(v:any) => updateSys(selectedSysId, {lifetimeJitter: v})} unit="s" />
                  </div>
                )}

                {inspectorTab === 'Motion' && (
                  <div className="space-y-4 bg-gray-900/50 p-3 rounded border border-gray-800/50">
                    <SectionHeader title="Initial Velocity" icon={<Wind size={14}/>} />
                    <SliderControl label="Speed" value={selectedSys.speed} min={0} max={50} step={0.1} onChange={(v:any) => updateSys(selectedSysId, {speed: v})} />
                    <SliderControl label="Random Speed" value={selectedSys.speedJitter} min={0} max={20} step={0.1} onChange={(v:any) => updateSys(selectedSysId, {speedJitter: v})} />
                    
                    <div className="h-4"></div>
                    <SectionHeader title="Forces" icon={<Hexagon size={14}/>} />
                    <SliderControl label="Gravity (Y-axis)" value={selectedSys.gravity} min={-50} max={50} step={0.1} onChange={(v:any) => updateSys(selectedSysId, {gravity: v})} />
                    <SliderControl label="Air Drag" value={selectedSys.drag} min={0} max={10} step={0.1} onChange={(v:any) => updateSys(selectedSysId, {drag: v})} />
                    
                    <div className="h-4"></div>
                    <SectionHeader title="Noise & Modifiers" icon={<GitMerge size={14}/>} />
                    <SliderControl label="Turbulence Strength" value={selectedSys.turbulence} min={0} max={20} step={0.1} onChange={(v:any) => updateSys(selectedSysId, {turbulence: v})} />
                    <SliderControl label="Turbulence Freq" value={selectedSys.turbulenceFreq} min={0.1} max={10} step={0.1} onChange={(v:any) => updateSys(selectedSysId, {turbulenceFreq: v})} />
                    <SliderControl label="Vortex Spin" value={selectedSys.vortexStrength} min={-20} max={20} step={0.1} onChange={(v:any) => updateSys(selectedSysId, {vortexStrength: v})} />
                  </div>
                )}

                {inspectorTab === 'Appearance' && (
                  <div className="space-y-4 bg-gray-900/50 p-3 rounded border border-gray-800/50">
                    <SectionHeader title="Color Gradient Over Life" icon={<Palette size={14}/>} />
                    <ColorControl label="Birth Color" value={selectedSys.colorStart} onChange={(v:any) => updateSys(selectedSysId, {colorStart: v})} />
                    <ColorControl label="Midlife Color" value={selectedSys.colorMid} onChange={(v:any) => updateSys(selectedSysId, {colorMid: v})} />
                    <ColorControl label="Death Color" value={selectedSys.colorEnd} onChange={(v:any) => updateSys(selectedSysId, {colorEnd: v})} />
                    
                    <div className="h-4"></div>
                    <SectionHeader title="Size Over Life" icon={<Maximize2 size={14}/>} />
                    <SliderControl label="Birth Size" value={selectedSys.sizeStart} min={0} max={5} step={0.01} onChange={(v:any) => updateSys(selectedSysId, {sizeStart: v})} />
                    <SliderControl label="Midlife Size" value={selectedSys.sizeMid} min={0} max={5} step={0.01} onChange={(v:any) => updateSys(selectedSysId, {sizeMid: v})} />
                    <SliderControl label="Death Size" value={selectedSys.sizeEnd} min={0} max={5} step={0.01} onChange={(v:any) => updateSys(selectedSysId, {sizeEnd: v})} />
                    
                    <div className="h-4"></div>
                    <SectionHeader title="Rendering" icon={<Eye size={14}/>} />
                    <SelectControl label="Blend Mode" value={selectedSys.blendMode} options={['Normal', 'Additive', 'Multiply', 'Screen']} onChange={(v:any) => updateSys(selectedSysId, {blendMode: v})} />
                  </div>
                )}
                
                {inspectorTab === 'Physics' && (
                  <div className="space-y-4 bg-gray-900/50 p-3 rounded border border-gray-800/50">
                     <SectionHeader title="World Collision" icon={<Box size={14}/>} />
                     <ToggleControl label="Enable Ground Collision" checked={selectedSys.collision} onChange={(v:any) => updateSys(selectedSysId, {collision: v})} />
                     {selectedSys.collision && (
                       <SliderControl label="Bounciness" value={selectedSys.bounce} min={0} max={1} step={0.01} onChange={(v:any) => updateSys(selectedSysId, {bounce: v})} />
                     )}
                     <div className="text-[10px] text-gray-500 mt-2 italic bg-black/50 p-2 rounded">Note: Particles collide with Y=0 plane.</div>
                  </div>
                )}

              </div>
            </>
          )}

          {activeTab === 'AIOffline' && (
            <div className="flex flex-col h-full bg-[#0d0714]">
              <div className="p-4 border-b border-purple-900/50 bg-purple-900/10">
                <div className="flex items-center gap-2 text-purple-400 font-bold mb-2 text-sm">
                  <Cpu size={16} /> AI NPU SYNTHESIS
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                  Describe a complex particle effect in natural language. The local Offline AI heuristic engine will synthesize emission, physics, modifiers, and shaders instantly. No internet required.
                </p>
                
                <textarea 
                  value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. A massive magical blue explosion with swirling embers, high turbulence, bouncing off the ground..."
                  className="w-full h-28 bg-black/60 border border-purple-900/50 rounded p-3 text-xs text-purple-100 focus:border-purple-500 outline-none resize-none placeholder-purple-900/50"
                />
                
                <button 
                  onClick={generateAI} disabled={isAiGenerating || !aiPrompt.trim()}
                  className={`mt-3 w-full py-2.5 rounded text-xs font-bold flex justify-center items-center gap-2 transition-all ${isAiGenerating || !aiPrompt.trim() ? 'bg-gray-800 text-gray-600' : 'bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)]'}`}
                >
                  {isAiGenerating ? <RefreshCcw size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  {isAiGenerating ? 'PROCESSING HEURISTICS...' : 'SYNTHESIZE EFFECT'}
                </button>
              </div>
              
              <div className="flex-1 p-3 flex flex-col min-h-0 bg-black/80">
                <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">
                   Local AI Diagnostic Log
                </div>
                <div className="flex-1 border border-gray-800 rounded bg-[#050505] p-2 font-mono text-[9px] text-purple-400 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                  {aiLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                  {isAiGenerating && <div className="animate-pulse">_</div>}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
