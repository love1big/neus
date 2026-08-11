import React, { useState } from 'react';
import { Play, Pause, Save, Box, Search, MousePointer2, Settings, Minimize2, Maximize2, Zap, LayoutGrid, Layers, RefreshCw, Crosshair, Database, Move, RotateCcw, Activity } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Sphere, Box as DreiBox } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';

export default function AdvancedPhysicsLab() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gravity, setGravity] = useState(-9.81);
  const [selectedBody, setSelectedBody] = useState<string | null>('b1');

  const handleReset = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100); // Hacky reset
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-500 to-rose-700 p-1.5 rounded-lg shadow-lg">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Physics <span className="text-red-400">Laboratory</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Rigid/Soft Body Dynamics Setup</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setIsPlaying(!isPlaying)} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-colors ${isPlaying ? 'bg-orange-600/20 text-orange-400 border border-orange-600/50' : 'bg-green-600 text-white hover:bg-green-500 shadow-[0_0_10px_rgba(22,163,74,0.3)]'}`}>
            {isPlaying ? <Pause size={14} /> : <Play size={14} />} 
            {isPlaying ? 'PAUSE SIMULATION' : 'START SIMULATION'}
          </button>
          <button onClick={handleReset} className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-[#333] hover:bg-[#444] transition-colors">
            <RefreshCw size={14} /> RESET STATE
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Hierarchy */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[5px_0_20px_rgba(0,0,0,0.3)]">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> Physics Actors</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
             <div onClick={() => setSelectedBody('b1')} className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedBody === 'b1' ? 'bg-red-900/40 border border-red-500/50 text-red-300' : 'hover:bg-[#333] text-gray-400'}`}>
               <Box size={14} /> <span className="text-[10px] font-bold">Heavy Crate</span>
             </div>
             <div onClick={() => setSelectedBody('b2')} className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedBody === 'b2' ? 'bg-red-900/40 border border-red-500/50 text-red-300' : 'hover:bg-[#333] text-gray-400'}`}>
               <Database size={14} /> <span className="text-[10px] font-bold">Bouncy Sphere</span>
             </div>
             <div onClick={() => setSelectedBody('b3')} className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedBody === 'b3' ? 'bg-red-900/40 border border-red-500/50 text-red-300' : 'hover:bg-[#333] text-gray-400'}`}>
               <LayoutGrid size={14} /> <span className="text-[10px] font-bold">Ragdoll Skeleton</span>
             </div>
           </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 relative bg-black overflow-hidden flex flex-col">
          <Canvas camera={{ position: [5, 5, 10], fov: 45 }}>
             <color attach="background" args={['#1a1a1c']} />
             <ambientLight intensity={0.5} />
             <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
             <OrbitControls makeDefault />
             <Grid infiniteGrid fadeDistance={50} sectionColor="#3e3e42" cellColor="#1e1e1e" position={[0, -0.5, 0]}/>
             
             {isPlaying && (
               <Physics gravity={[0, gravity, 0]}>
                 {/* Floor */}
                 <RigidBody type="fixed" position={[0, -0.5, 0]}>
                   <CuboidCollider args={[10, 0.5, 10]} />
                   <mesh receiveShadow>
                     <boxGeometry args={[20, 1, 20]} />
                     <meshStandardMaterial color="#252526" />
                   </mesh>
                 </RigidBody>

                 {/* Crate */}
                 <RigidBody position={[0, 5, 0]} colliders="cuboid" mass={10}>
                   <DreiBox args={[2, 2, 2]} castShadow>
                     <meshStandardMaterial color="#ef4444" />
                   </DreiBox>
                 </RigidBody>
                 
                 {/* Bouncy Sphere */}
                 <RigidBody position={[2, 8, 2]} colliders="ball" restitution={0.8} mass={2}>
                   <Sphere args={[1, 32, 32]} castShadow>
                     <meshStandardMaterial color="#3b82f6" />
                   </Sphere>
                 </RigidBody>
               </Physics>
             )}
          </Canvas>

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/50 backdrop-blur-sm">
               <div className="flex flex-col items-center gap-3 bg-[#252526] p-6 rounded-xl border border-[#3e3e42] shadow-2xl">
                 <Pause size={48} className="text-gray-500" />
                 <span className="text-sm font-bold text-gray-300 tracking-widest uppercase">Simulation Paused</span>
               </div>
            </div>
          )}
        </div>

        {/* Right Panel: Inspector */}
        <div className="w-80 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.5)]">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Inspector</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
             
             {/* World Settings */}
             <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest border-b border-[#3e3e42] pb-1 flex items-center gap-2">World Parameters</h4>
               <div className="flex flex-col gap-1">
                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                   <span>Gravity Y</span>
                   <span className="font-mono bg-black px-1 rounded border border-[#3e3e42]">{gravity}</span>
                 </div>
                 <input type="range" min="-20" max="0" step="0.1" value={gravity} onChange={(e)=>setGravity(Number(e.target.value))} className="accent-red-500"/>
               </div>
             </div>

             {/* Body Settings */}
             {selectedBody && (
               <div className="space-y-4">
                 <div className="bg-[#1a1a1c] p-3 rounded border border-[#3e3e42]">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2">
                     <Box size={16} className="text-red-400"/>
                     {selectedBody === 'b1' ? 'Heavy Crate' : selectedBody === 'b2' ? 'Bouncy Sphere' : 'Ragdoll Skeleton'}
                   </h3>
                   <div className="text-[10px] text-gray-500 uppercase mt-1">RigidBody Dynamic</div>
                 </div>

                 <div className="space-y-3">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Mass & Material</h4>
                   
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] text-gray-400">Mass (kg)</span>
                     <input type="number" defaultValue={selectedBody === 'b1' ? 10 : 2} className="w-16 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-right focus:border-red-500"/>
                   </div>
                   
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] text-gray-400">Friction</span>
                     <input type="number" defaultValue={0.5} step="0.1" className="w-16 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-right focus:border-red-500"/>
                   </div>
                   
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] text-gray-400">Restitution (Bounciness)</span>
                     <input type="number" defaultValue={selectedBody === 'b2' ? 0.8 : 0.1} step="0.1" className="w-16 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-right focus:border-red-500"/>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Constraints</h4>
                   
                   <div className="flex items-center justify-between text-[10px] text-gray-400">
                     <span>Lock Position</span>
                     <div className="flex gap-1">
                       <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-red-500"/> X</label>
                       <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-red-500"/> Y</label>
                       <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-red-500"/> Z</label>
                     </div>
                   </div>
                   <div className="flex items-center justify-between text-[10px] text-gray-400">
                     <span>Lock Rotation</span>
                     <div className="flex gap-1">
                       <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-red-500"/> X</label>
                       <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-red-500"/> Y</label>
                       <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-red-500"/> Z</label>
                     </div>
                   </div>
                 </div>
               </div>
             )}

           </div>
        </div>
      </div>
      
    </div>
  );
}
