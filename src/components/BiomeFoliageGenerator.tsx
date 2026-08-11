import React, { useState, useRef, useMemo } from 'react';
import { Leaf, MousePointer2, Paintbrush, Eraser, Settings, Save, Maximize2, Minimize2, Layers, TreePine, Mountain, Shuffle, Crosshair, Droplets, Snowflake } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';

interface BrushSettings {
  radius: number;
  density: number;
  minScale: number;
  maxScale: number;
  randomRotation: boolean;
  alignToNormal: boolean;
  slopeLimit: number;
}

const BIOMES = [
  { id: 'b1', name: 'Temperate Forest', color: '#16a34a', icon: <TreePine size={14}/> },
  { id: 'b2', name: 'Arid Desert', color: '#d97706', icon: <Mountain size={14}/> },
  { id: 'b3', name: 'Tundra', color: '#93c5fd', icon: <Snowflake size={14}/> },
  { id: 'b4', name: 'Swamp', color: '#047857', icon: <Droplets size={14}/> },
];

const ASSETS = [
  { id: 'a1', name: 'Oak Tree', type: 'Tree', color: '#15803d' },
  { id: 'a2', name: 'Pine Tree', type: 'Tree', color: '#065f46' },
  { id: 'a3', name: 'Bush', type: 'Foliage', color: '#4ade80' },
  { id: 'a4', name: 'Tall Grass', type: 'Grass', color: '#86efac' },
  { id: 'a5', name: 'Limestone Rock', type: 'Rock', color: '#9ca3af' },
  { id: 'a6', name: 'Mossy Boulder', type: 'Rock', color: '#4b5563' },
];

export default function BiomeFoliageGenerator() {
  const [activeTool, setActiveTool] = useState<'Select' | 'Paint' | 'Erase'>('Paint');
  const [brush, setBrush] = useState<BrushSettings>({
    radius: 5, density: 50, minScale: 0.8, maxScale: 1.5, randomRotation: true, alignToNormal: true, slopeLimit: 45
  });
  const [activeBiome, setActiveBiome] = useState('b1');
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['a1', 'a3', 'a4']);
  
  // Instance data (mock)
  const [instanceCount, setInstanceCount] = useState(14520);
  
  const toggleAsset = (id: string) => {
    if (selectedAssets.includes(id)) {
      setSelectedAssets(selectedAssets.filter(a => a !== id));
    } else {
      setSelectedAssets([...selectedAssets, id]);
    }
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-1.5 rounded-lg shadow-lg">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Biome & <span className="text-green-500">Foliage</span> Spawner</h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Procedural World Generation</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-[#333] hover:bg-[#444] transition-colors">
            <Shuffle size={14} /> GENERATE ALL
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-green-600 text-white hover:bg-green-500 transition-colors shadow-[0_0_10px_rgba(22,163,74,0.3)]">
            <Save size={14} /> BAKE INSTANCES
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Brush Tools */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[5px_0_20px_rgba(0,0,0,0.3)]">
           <div className="p-2 border-b border-[#3e3e42] flex items-center justify-center gap-1 bg-[#1a1a1c]">
             <button onClick={() => setActiveTool('Select')} className={`flex-1 flex flex-col items-center justify-center py-2 rounded gap-1 transition-colors ${activeTool === 'Select' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-[#333] hover:text-white'}`}>
               <MousePointer2 size={16}/> <span className="text-[9px] font-bold uppercase">Select</span>
             </button>
             <button onClick={() => setActiveTool('Paint')} className={`flex-1 flex flex-col items-center justify-center py-2 rounded gap-1 transition-colors ${activeTool === 'Paint' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-[#333] hover:text-white'}`}>
               <Paintbrush size={16}/> <span className="text-[9px] font-bold uppercase">Paint</span>
             </button>
             <button onClick={() => setActiveTool('Erase')} className={`flex-1 flex flex-col items-center justify-center py-2 rounded gap-1 transition-colors ${activeTool === 'Erase' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-[#333] hover:text-white'}`}>
               <Eraser size={16}/> <span className="text-[9px] font-bold uppercase">Erase</span>
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
              
              {/* Brush Settings */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-green-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1 flex items-center gap-2"><Crosshair size={12}/> Brush Params</h3>
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Radius</span>
                    <span className="bg-black px-1 rounded text-white font-mono border border-[#3e3e42]">{brush.radius}m</span>
                  </div>
                  <input type="range" min="1" max="50" value={brush.radius} onChange={e => setBrush({...brush, radius: Number(e.target.value)})} className="w-full accent-green-500 h-1 bg-gray-800 rounded appearance-none" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Density</span>
                    <span className="bg-black px-1 rounded text-white font-mono border border-[#3e3e42]">{brush.density}%</span>
                  </div>
                  <input type="range" min="1" max="100" value={brush.density} onChange={e => setBrush({...brush, density: Number(e.target.value)})} className="w-full accent-green-500 h-1 bg-gray-800 rounded appearance-none" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Max Slope Angle</span>
                    <span className="bg-black px-1 rounded text-white font-mono border border-[#3e3e42]">{brush.slopeLimit}°</span>
                  </div>
                  <input type="range" min="0" max="90" value={brush.slopeLimit} onChange={e => setBrush({...brush, slopeLimit: Number(e.target.value)})} className="w-full accent-green-500 h-1 bg-gray-800 rounded appearance-none" />
                </div>
              </div>

              {/* Jitter Settings */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-green-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1 flex items-center gap-2"><Shuffle size={12}/> Randomization</h3>
                
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-gray-400">Scale Range (Min/Max)</span>
                  <div className="flex gap-2">
                    <input type="number" value={brush.minScale} onChange={e => setBrush({...brush, minScale: Number(e.target.value)})} className="w-1/2 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-center" step="0.1"/>
                    <input type="number" value={brush.maxScale} onChange={e => setBrush({...brush, maxScale: Number(e.target.value)})} className="w-1/2 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-center" step="0.1"/>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400">
                   <span>Random Yaw Rotation</span>
                   <input type="checkbox" checked={brush.randomRotation} onChange={e => setBrush({...brush, randomRotation: e.target.checked})} className="accent-green-500"/>
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                   <span>Align to Terrain Normal</span>
                   <input type="checkbox" checked={brush.alignToNormal} onChange={e => setBrush({...brush, alignToNormal: e.target.checked})} className="accent-green-500"/>
                </div>
              </div>

           </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 relative bg-black overflow-hidden flex flex-col">
             
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
             <div className="bg-black/60 backdrop-blur border border-[#3e3e42] px-3 py-1.5 rounded text-[10px] font-mono text-gray-300 shadow-lg inline-block w-max">
                TOTAL INSTANCES: <span className="text-green-400 font-bold">{instanceCount.toLocaleString()}</span>
             </div>
             {activeTool === 'Paint' && (
               <div className="bg-green-900/60 backdrop-blur border border-green-500/50 px-3 py-1.5 rounded text-[10px] font-mono text-green-300 shadow-lg inline-block w-max">
                  PAINTING ACTIVE - CLICK & DRAG
               </div>
             )}
          </div>
          
          <div className="flex-1 cursor-crosshair">
            <Canvas camera={{ position: [0, 20, 20], fov: 45 }}>
               <color attach="background" args={['#111115']} />
               <fog attach="fog" args={['#111115', 20, 100]} />
               <ambientLight intensity={0.4} />
               <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow />
               
               <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.1} />
               
               {/* Dummy Terrain */}
               <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
                 <planeGeometry args={[100, 100, 64, 64]} />
                 <meshStandardMaterial color="#2d3748" wireframe={true} transparent opacity={0.3} />
               </mesh>
               
               <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow position={[0,-0.1,0]}>
                 <planeGeometry args={[100, 100]} />
                 <meshStandardMaterial color="#1a202c" />
               </mesh>

               {/* Simulated Brush Cursor */}
               {activeTool !== 'Select' && (
                 <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.1, 0]}>
                   <ringGeometry args={[brush.radius - 0.2, brush.radius, 32]} />
                   <meshBasicMaterial color={activeTool === 'Paint' ? '#4ade80' : '#f87171'} side={THREE.DoubleSide} transparent opacity={0.5} />
                 </mesh>
               )}
               
               <Grid infiniteGrid fadeDistance={50} sectionColor="#3e3e42" cellColor="#1e1e1e" />
               
               {/* A few dummy trees for visualization */}
               <group>
                  <mesh position={[-5, 2, -5]}>
                    <coneGeometry args={[1.5, 4, 8]} />
                    <meshStandardMaterial color="#065f46" />
                  </mesh>
                  <mesh position={[-5, 0.5, -5]}>
                    <cylinderGeometry args={[0.3, 0.3, 1]} />
                    <meshStandardMaterial color="#451a03" />
                  </mesh>
                  
                  <mesh position={[8, 1, 3]}>
                    <sphereGeometry args={[1.2, 16, 16]} />
                    <meshStandardMaterial color="#4ade80" />
                  </mesh>
               </group>
            </Canvas>
          </div>
        </div>

        {/* Right Panel: Biomes & Assets */}
        <div className="w-72 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.3)]">
           
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> Biome Palette</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              
              {/* Biomes List */}
              <div className="p-2 grid grid-cols-2 gap-2 border-b border-[#3e3e42]">
                 {BIOMES.map(biome => (
                   <div 
                     key={biome.id}
                     onClick={() => setActiveBiome(biome.id)}
                     className={`p-2 rounded border flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-center ${activeBiome === biome.id ? 'bg-[#333] border-gray-400' : 'bg-black/30 border-transparent hover:bg-[#333]'}`}
                   >
                     <div style={{ color: biome.color }}>{biome.icon}</div>
                     <span className="text-[9px] font-bold text-gray-300 leading-tight">{biome.name}</span>
                   </div>
                 ))}
              </div>

              {/* Assets in Biome */}
              <div className="p-3 flex-1 flex flex-col">
                 <div className="flex items-center justify-between mb-3">
                   <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Assets</h3>
                   <span className="text-[9px] bg-[#333] px-1.5 py-0.5 rounded text-gray-400">{selectedAssets.length} Selected</span>
                 </div>
                 
                 <div className="space-y-2">
                   {ASSETS.map(asset => (
                     <div 
                       key={asset.id}
                       onClick={() => toggleAsset(asset.id)}
                       className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors border ${selectedAssets.includes(asset.id) ? 'bg-[#333] border-green-500/50' : 'bg-black/30 border-transparent hover:bg-[#2d2d30]'}`}
                     >
                        <div className="flex items-center justify-center w-4 h-4 rounded border border-gray-600 bg-black shrink-0">
                          {selectedAssets.includes(asset.id) && <div className="w-2 h-2 rounded-sm bg-green-500"></div>}
                        </div>
                        
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                        
                        <div className="flex flex-col flex-1 truncate">
                          <span className="text-xs font-bold text-gray-200 truncate">{asset.name}</span>
                          <span className="text-[9px] text-gray-500 uppercase">{asset.type}</span>
                        </div>
                        
                        {/* Fake weight slider */}
                        <div className="w-12 h-1 bg-gray-800 rounded overflow-hidden" onClick={e => e.stopPropagation()}>
                           <div className="h-full bg-green-500" style={{ width: `${Math.random() * 50 + 20}%` }}></div>
                        </div>
                     </div>
                   ))}
                 </div>
                 
                 <button className="mt-4 py-2 w-full border border-dashed border-[#3e3e42] text-gray-500 rounded text-[10px] font-bold hover:bg-[#333] hover:text-gray-300 transition-colors uppercase">
                   + Import Mesh
                 </button>
              </div>

           </div>
        </div>
      </div>
      
    </div>
  );
}
