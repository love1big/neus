import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Globe, RefreshCw, Sliders, Layers, Star, Zap, Cpu, Orbit, Settings, Play, Square, Eye, Compass, Rocket, List } from 'lucide-react';

// === Procedural Data ===
interface PlanetData {
  id: string;
  name: string;
  radius: number;
  distance: number;
  speed: number;
  color: string;
  type: 'Terrestrial' | 'Gas Giant' | 'Ice Giant' | 'Lava' | 'Toxic';
  moons: number;
  rings: boolean;
  angle: number;
}

const generateSolarSystem = (): PlanetData[] => {
  const types: ('Terrestrial' | 'Gas Giant' | 'Ice Giant' | 'Lava' | 'Toxic')[] = ['Terrestrial', 'Gas Giant', 'Ice Giant', 'Lava', 'Toxic'];
  const colors = {
    'Terrestrial': ['#2ecc71', '#3498db', '#e67e22', '#8B4513'],
    'Gas Giant': ['#f1c40f', '#e74c3c', '#d35400', '#f39c12'],
    'Ice Giant': ['#00ffff', '#1abc9c', '#9b59b6', '#3498db'],
    'Lava': ['#c0392b', '#e74c3c', '#d35400'],
    'Toxic': ['#27ae60', '#16a085', '#8e44ad']
  };

  const count = Math.floor(Math.random() * 6) + 3; // 3 to 8 planets
  const planets: PlanetData[] = [];
  
  let currentDistance = 2;

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const typeColors = colors[type];
    const p: PlanetData = {
      id: `planet_${i}`,
      name: `Exo-${Math.floor(Math.random() * 9999).toString(16).toUpperCase()}`,
      radius: (type.includes('Giant') ? 0.6 : 0.2) + Math.random() * 0.4,
      distance: currentDistance,
      speed: (0.1 + Math.random() * 0.5) * (Math.random() > 0.5 ? 1 : -1) / Math.sqrt(currentDistance),
      color: typeColors[Math.floor(Math.random() * typeColors.length)],
      type: type,
      moons: Math.floor(Math.random() * (type.includes('Giant') ? 8 : 3)),
      rings: type.includes('Giant') && Math.random() > 0.5,
      angle: Math.random() * Math.PI * 2
    };
    planets.push(p);
    currentDistance += (type.includes('Giant') ? 3 : 1.5) + Math.random() * 2;
  }
  return planets;
};

// === 3D Components ===
function Planet({ data, isPlaying }: { data: PlanetData, isPlaying: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (isPlaying && meshRef.current) {
      meshRef.current.rotation.y += data.speed * delta;
    }
    if (isPlaying && planetMeshRef.current) {
      planetMeshRef.current.rotation.y += 0.5 * delta;
    }
  });

  return (
    <group ref={meshRef} rotation={[0, data.angle, 0]}>
      {/* Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.01, data.distance + 0.01, 64]} />
        <meshBasicMaterial color="#333344" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Planet Body */}
      <group position={[data.distance, 0, 0]}>
        <mesh ref={planetMeshRef}>
          <sphereGeometry args={[data.radius, 32, 32]} />
          <meshStandardMaterial color={data.color} roughness={0.7} metalness={0.2} />
        </mesh>
        
        {/* Atmosphere for Terrestrial/Toxic/Ice */}
        {(data.type === 'Terrestrial' || data.type === 'Toxic' || data.type === 'Ice Giant') && (
           <mesh scale={1.05}>
             <sphereGeometry args={[data.radius, 32, 32]} />
             <meshStandardMaterial color={data.type === 'Toxic' ? '#2ecc71' : '#ffffff'} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
           </mesh>
        )}

        {/* Rings */}
        {data.rings && (
          <mesh rotation={[Math.PI / 2 + 0.2, 0, 0]}>
            <ringGeometry args={[data.radius * 1.5, data.radius * 2.2, 64]} />
            <meshStandardMaterial color={data.color} transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>
        )}
        
        {/* Label */}
        <Text
          position={[0, data.radius + 0.4, 0]}
          fontSize={0.2}
          color="#a8b2d1"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {data.name}
        </Text>
      </group>
    </group>
  );
}

// === Main UI ===
export default function ProceduralGalaxyBuilder() {
  const [systemData, setSystemData] = useState<PlanetData[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [starColor, setStarColor] = useState('#f39c12');
  const [starSize, setStarSize] = useState(1.0);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

  useEffect(() => {
    setSystemData(generateSolarSystem());
  }, []);

  const regenerate = () => {
    setSystemData(generateSolarSystem());
    setSelectedPlanet(null);
    const colors = ['#f39c12', '#3498db', '#e74c3c', '#ffffff', '#9b59b6'];
    setStarColor(colors[Math.floor(Math.random() * colors.length)]);
    setStarSize(0.5 + Math.random() * 1.5);
  };

  return (
    <div className="w-full h-full bg-[#050508] text-gray-200 flex flex-col font-sans overflow-hidden">
      
      {/* Header */}
      <div className="h-12 bg-[#0a0a0f] border-b border-gray-800 flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg shadow-lg">
            <Orbit size={16} className="text-white" />
          </div>
          <h1 className="text-sm font-bold tracking-widest text-gray-100 uppercase">Cosmic <span className="text-purple-400">Galaxy</span> Builder</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${isPlaying ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            {isPlaying ? <Square size={12} /> : <Play size={12} />}
            {isPlaying ? 'PAUSE ORBITS' : 'PLAY ORBITS'}
          </button>
          <button 
            onClick={regenerate}
            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition-all shadow-[0_0_10px_rgba(147,51,234,0.3)]"
          >
            <RefreshCw size={12} /> REGENERATE SYSTEM
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: System Hierarchy */}
        <div className="w-64 bg-[#0a0a0f] border-r border-gray-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-800 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-[#050508]">
            <List size={14}/> Celestial Bodies
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {/* Star Item */}
            <div 
              onClick={() => setSelectedPlanet(null)}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ${!selectedPlanet ? 'bg-purple-600/20 border border-purple-500/50 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
            >
              <Star size={14} style={{ color: starColor }} className="drop-shadow-lg" />
              <div className="flex flex-col">
                <span className="text-xs font-bold">Central Star</span>
                <span className="text-[9px] text-gray-500 uppercase">Class M Sequence</span>
              </div>
            </div>
            
            {/* Planets */}
            <div className="h-2"></div>
            {systemData.map((p, idx) => (
              <div 
                key={p.id}
                onClick={() => setSelectedPlanet(p)}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ${selectedPlanet?.id === p.id ? 'bg-indigo-600/20 border border-indigo-500/50 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
              >
                <div className="w-4 h-4 rounded-full border border-gray-600 shadow-inner" style={{ backgroundColor: p.color }}></div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold truncate">{p.name}</span>
                  <span className="text-[9px] text-gray-500 uppercase">Orbit: {idx + 1} | {p.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: 3D Viewport */}
        <div className="flex-1 relative bg-[#020204]">
          <Canvas camera={{ position: [0, 10, 15], fov: 45 }}>
            <color attach="background" args={['#020204']} />
            <fog attach="fog" args={['#020204', 10, 50]} />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={3} color={starColor} distance={50} decay={2} />
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            <OrbitControls makeDefault maxDistance={40} minDistance={2} />
            
            {/* The Sun */}
            <mesh>
              <sphereGeometry args={[starSize, 32, 32]} />
              <meshBasicMaterial color={starColor} />
            </mesh>
            
            {/* Sun Glow */}
            <mesh>
              <sphereGeometry args={[starSize * 1.5, 32, 32]} />
              <meshBasicMaterial color={starColor} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>

            {/* Planets */}
            <group>
              {systemData.map(p => (
                <Planet key={p.id} data={p} isPlaying={isPlaying} />
              ))}
            </group>
          </Canvas>
          
          {/* Viewport UI Overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
             <div className="bg-black/60 backdrop-blur border border-gray-800 px-3 py-1.5 rounded text-[10px] font-mono text-gray-400 flex items-center gap-2">
               <Eye size={12} className="text-indigo-400"/> ORBIT CAM
             </div>
             <div className="bg-black/60 backdrop-blur border border-gray-800 px-3 py-1.5 rounded text-[10px] font-mono text-gray-400 flex items-center gap-2">
               <Compass size={12} className="text-purple-400"/> DRAG TO ROTATE, SCROLL TO ZOOM
             </div>
          </div>
        </div>

        {/* Right Panel: Inspector */}
        <div className="w-80 bg-[#0a0a0f] border-l border-gray-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-800 bg-[#050508] flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Settings size={14}/> Inspector
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {!selectedPlanet ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-6 bg-black/30 border border-gray-800/50 rounded-lg shadow-inner">
                  <Star size={48} style={{ color: starColor }} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-3" />
                  <h2 className="text-lg font-bold text-white mb-1">Stellar Core</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-widest text-center">Spectral Class Synthesis</p>
                </div>
                
                <div className="space-y-3 bg-[#11111a] p-3 rounded border border-gray-800">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase border-b border-gray-800 pb-2 mb-3">Star Properties</h3>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>Mass (Solar Masses)</span>
                      <span className="font-mono text-white">{starSize.toFixed(2)} M☉</span>
                    </div>
                    <input type="range" min={0.5} max={3.0} step={0.1} value={starSize} onChange={(e) => setStarSize(parseFloat(e.target.value))} className="w-full accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  
                  <div className="flex flex-col gap-1 mt-4">
                    <span className="text-[11px] text-gray-400">Emission Spectra (Color)</span>
                    <div className="flex items-center gap-2">
                      <input type="color" value={starColor} onChange={(e) => setStarColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                      <input type="text" value={starColor} onChange={(e) => setStarColor(e.target.value)} className="bg-black border border-gray-700 text-xs text-gray-200 rounded px-2 py-1.5 flex-1 outline-none font-mono uppercase" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#11111a] p-3 rounded border border-gray-800 flex flex-col gap-2">
                   <div className="flex justify-between text-[11px] text-gray-400"><span>System Gravity Well</span><span className="text-green-400">STABLE</span></div>
                   <div className="flex justify-between text-[11px] text-gray-400"><span>Planetary Bodies</span><span className="text-white font-mono">{systemData.length}</span></div>
                   <div className="flex justify-between text-[11px] text-gray-400"><span>Habitable Zone</span><span className="text-blue-400">0.8 - 1.5 AU</span></div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-6 bg-black/30 border border-gray-800/50 rounded-lg shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${selectedPlanet.color} 0%, transparent 70%)` }}></div>
                  <Globe size={48} color={selectedPlanet.color} className="drop-shadow-lg mb-3 relative z-10" />
                  <h2 className="text-lg font-bold text-white mb-1 relative z-10">{selectedPlanet.name}</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-widest text-center relative z-10">{selectedPlanet.type} World</p>
                </div>
                
                <div className="space-y-4 bg-[#11111a] p-3 rounded border border-gray-800">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase border-b border-gray-800 pb-2">Physical Data</h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="flex flex-col gap-1 bg-black/50 p-2 rounded border border-gray-800/50">
                      <span className="text-gray-500">Radius</span>
                      <span className="font-mono text-white text-sm">{(selectedPlanet.radius * 3958).toFixed(0)} mi</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-black/50 p-2 rounded border border-gray-800/50">
                      <span className="text-gray-500">Moons</span>
                      <span className="font-mono text-white text-sm">{selectedPlanet.moons}</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-black/50 p-2 rounded border border-gray-800/50">
                      <span className="text-gray-500">Ring System</span>
                      <span className={`font-mono text-sm ${selectedPlanet.rings ? 'text-green-400' : 'text-gray-600'}`}>{selectedPlanet.rings ? 'YES' : 'NO'}</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-black/50 p-2 rounded border border-gray-800/50">
                      <span className="text-gray-500">Atmosphere</span>
                      <span className="font-mono text-white text-sm truncate" title={selectedPlanet.type === 'Gas Giant' ? 'H2, He' : selectedPlanet.type === 'Toxic' ? 'CO2, SO2' : selectedPlanet.type === 'Ice Giant' ? 'CH4, NH3' : 'N2, O2'}>
                        {selectedPlanet.type === 'Gas Giant' ? 'H2, He' : selectedPlanet.type === 'Toxic' ? 'CO2, SO2' : selectedPlanet.type === 'Ice Giant' ? 'CH4, NH3' : 'N2, O2'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 bg-[#11111a] p-3 rounded border border-gray-800">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase border-b border-gray-800 pb-2">Orbital Mechanics</h3>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>Semi-Major Axis (Distance)</span>
                      <span className="font-mono text-white">{selectedPlanet.distance.toFixed(2)} AU</span>
                    </div>
                    <input 
                      type="range" min={1} max={20} step={0.1} value={selectedPlanet.distance} 
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setSystemData(systemData.map(p => p.id === selectedPlanet.id ? { ...p, distance: v } : p));
                        setSelectedPlanet({ ...selectedPlanet, distance: v });
                      }} 
                      className="w-full accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer mt-1 mb-2" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>Orbital Velocity</span>
                      <span className="font-mono text-white">{Math.abs(selectedPlanet.speed * 10).toFixed(2)} km/s</span>
                    </div>
                    <input 
                      type="range" min={-1} max={1} step={0.01} value={selectedPlanet.speed} 
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setSystemData(systemData.map(p => p.id === selectedPlanet.id ? { ...p, speed: v } : p));
                        setSelectedPlanet({ ...selectedPlanet, speed: v });
                      }} 
                      className="w-full accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer mt-1" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer bar */}
      <div className="h-6 bg-[#050508] border-t border-gray-900 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4 text-[9px] font-mono text-gray-600">
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> PROCEDURAL GENERATOR: ONLINE</div>
        </div>
        <div className="text-[9px] font-mono text-gray-600">
          GALAXY BUILDER v1.0.0
        </div>
      </div>
    </div>
  );
}
