import React, { useState } from 'react';
import { Play, Pause, Save, Maximize2, Minimize2, Bone, Activity, Settings, SkipBack, SkipForward, Clock, Crosshair, Move, RotateCcw, Box } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';

export default function AnimationRiggingStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedBone, setSelectedBone] = useState<string | null>('root');
  
  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-fuchsia-500 to-purple-700 p-1.5 rounded-lg shadow-lg">
            <Bone size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Animation <span className="text-fuchsia-400">Rigging</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Skeletal & Mocap Studio</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-[#333] hover:bg-[#444] transition-colors">
            <Activity size={14} /> BAKE MOCAP
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-fuchsia-600 text-white hover:bg-fuchsia-500 transition-colors shadow-[0_0_10px_rgba(192,38,211,0.3)]">
            <Save size={14} /> EXPORT FBX
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Bone Hierarchy */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[5px_0_20px_rgba(0,0,0,0.3)]">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Skeleton Tree</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar text-[11px]">
             
             {/* Mock Tree */}
             <div onClick={() => setSelectedBone('root')} className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${selectedBone === 'root' ? 'bg-fuchsia-900/40 border border-fuchsia-500/50 text-fuchsia-300' : 'hover:bg-[#333] text-gray-400'}`}>
               <Bone size={12} className={selectedBone === 'root' ? 'text-fuchsia-400' : ''}/> Root
             </div>
             
             <div className="pl-4 border-l border-[#444] ml-2 space-y-1">
               <div onClick={() => setSelectedBone('spine')} className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${selectedBone === 'spine' ? 'bg-fuchsia-900/40 border border-fuchsia-500/50 text-fuchsia-300' : 'hover:bg-[#333] text-gray-400'}`}>
                 <Bone size={12} className={selectedBone === 'spine' ? 'text-fuchsia-400' : ''}/> Spine
               </div>
               
               <div className="pl-4 border-l border-[#444] ml-2 space-y-1">
                 <div onClick={() => setSelectedBone('neck')} className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${selectedBone === 'neck' ? 'bg-fuchsia-900/40 border border-fuchsia-500/50 text-fuchsia-300' : 'hover:bg-[#333] text-gray-400'}`}>
                   <Bone size={12} className={selectedBone === 'neck' ? 'text-fuchsia-400' : ''}/> Neck
                 </div>
                 <div onClick={() => setSelectedBone('head')} className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${selectedBone === 'head' ? 'bg-fuchsia-900/40 border border-fuchsia-500/50 text-fuchsia-300' : 'hover:bg-[#333] text-gray-400'}`}>
                   <Bone size={12} className={selectedBone === 'head' ? 'text-fuchsia-400' : ''}/> Head
                 </div>
               </div>

               <div className="pl-4 border-l border-[#444] ml-2 space-y-1">
                 <div onClick={() => setSelectedBone('arm_l')} className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${selectedBone === 'arm_l' ? 'bg-fuchsia-900/40 border border-fuchsia-500/50 text-fuchsia-300' : 'hover:bg-[#333] text-gray-400'}`}>
                   <Bone size={12} className={selectedBone === 'arm_l' ? 'text-fuchsia-400' : ''}/> Left Arm
                 </div>
                 <div onClick={() => setSelectedBone('arm_r')} className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${selectedBone === 'arm_r' ? 'bg-fuchsia-900/40 border border-fuchsia-500/50 text-fuchsia-300' : 'hover:bg-[#333] text-gray-400'}`}>
                   <Bone size={12} className={selectedBone === 'arm_r' ? 'text-fuchsia-400' : ''}/> Right Arm
                 </div>
               </div>
             </div>

           </div>
        </div>

        {/* Center Canvas & Timeline */}
        <div className="flex-1 relative bg-black flex flex-col min-w-0">
          
          <div className="flex-1 relative">
            
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button className="p-2 bg-black/50 hover:bg-[#333] rounded border border-[#3e3e42] text-gray-400"><Move size={14}/></button>
              <button className="p-2 bg-black/50 hover:bg-[#333] rounded border border-[#3e3e42] text-gray-400"><RotateCcw size={14}/></button>
            </div>

            <Canvas camera={{ position: [0, 1.5, 3], fov: 45 }}>
               <color attach="background" args={['#1a1a1c']} />
               <ambientLight intensity={0.5} />
               <directionalLight position={[10, 10, 5]} intensity={1.5} />
               <OrbitControls makeDefault target={[0, 1, 0]} />
               <Grid infiniteGrid fadeDistance={10} sectionColor="#3e3e42" cellColor="#1e1e1e" />
               
               {/* Dummy Skeleton Visualizer */}
               <group position={[0, 1, 0]}>
                  {/* Spine */}
                  <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.5]} />
                    <meshStandardMaterial color={selectedBone === 'spine' ? '#e879f9' : '#a1a1aa'} />
                  </mesh>
                  {/* Neck */}
                  <mesh position={[0, 0.35, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, 0.2]} />
                    <meshStandardMaterial color={selectedBone === 'neck' ? '#e879f9' : '#a1a1aa'} />
                  </mesh>
                  {/* Head */}
                  <mesh position={[0, 0.55, 0]}>
                    <sphereGeometry args={[0.15]} />
                    <meshStandardMaterial color={selectedBone === 'head' ? '#e879f9' : '#a1a1aa'} wireframe />
                  </mesh>
                  
                  {/* Arms */}
                  <mesh position={[-0.2, 0.2, 0]} rotation={[0, 0, Math.PI/4]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.4]} />
                    <meshStandardMaterial color={selectedBone === 'arm_l' ? '#e879f9' : '#a1a1aa'} />
                  </mesh>
                  <mesh position={[0.2, 0.2, 0]} rotation={[0, 0, -Math.PI/4]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.4]} />
                    <meshStandardMaterial color={selectedBone === 'arm_r' ? '#e879f9' : '#a1a1aa'} />
                  </mesh>
               </group>
            </Canvas>
          </div>

          {/* Dope Sheet / Timeline */}
          <div className="h-48 bg-[#1e1e1e] border-t border-[#3e3e42] flex flex-col shrink-0">
             {/* Timeline Toolbar */}
             <div className="h-10 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 gap-4">
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded"><SkipBack size={14}/></button>
                  <button onClick={() => setIsPlaying(!isPlaying)} className={`p-1.5 rounded ${isPlaying ? 'text-fuchsia-400 bg-fuchsia-900/30' : 'text-gray-400 hover:text-white hover:bg-[#333]'}`}>
                    {isPlaying ? <Pause size={14}/> : <Play size={14}/>}
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded"><SkipForward size={14}/></button>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                  <Clock size={12}/>
                  <span className="bg-black px-2 py-0.5 rounded border border-[#3e3e42]">00:01:23</span>
                  <span>/ 00:05:00</span>
                </div>
                
                <div className="flex items-center gap-2 ml-auto text-[10px]">
                  <span className="text-gray-500 uppercase">FPS:</span>
                  <select className="bg-black border border-[#3e3e42] text-white rounded px-2 py-0.5 outline-none">
                    <option>24</option>
                    <option>30</option>
                    <option selected>60</option>
                  </select>
                </div>
             </div>

             {/* Keyframe Grid */}
             <div className="flex-1 flex overflow-x-auto overflow-y-hidden custom-scrollbar bg-[#1a1a1c] relative">
               
               {/* Left labels */}
               <div className="w-32 bg-[#252526] border-r border-[#3e3e42] shrink-0 flex flex-col text-[9px] font-bold text-gray-400 uppercase">
                  <div className="h-6 flex items-center px-2 border-b border-[#3e3e42]">Position</div>
                  <div className="h-6 flex items-center px-2 border-b border-[#3e3e42]">Rotation</div>
                  <div className="h-6 flex items-center px-2 border-b border-[#3e3e42]">Scale</div>
               </div>
               
               {/* Tracks */}
               <div className="flex-1 relative" style={{ minWidth: '800px', backgroundImage: 'linear-gradient(90deg, #2a2a2b 1px, transparent 1px)', backgroundSize: '20px 100%' }}>
                  
                  {/* Playhead */}
                  <div className="absolute top-0 bottom-0 left-[200px] w-[1px] bg-red-500 z-10">
                    <div className="absolute top-0 -left-[4px] w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-red-500"></div>
                  </div>

                  {/* Dummy Keyframes */}
                  <div className="absolute top-2 left-[40px] w-2 h-2 rotate-45 bg-fuchsia-500"></div>
                  <div className="absolute top-2 left-[120px] w-2 h-2 rotate-45 bg-fuchsia-500"></div>
                  <div className="absolute top-2 left-[280px] w-2 h-2 rotate-45 bg-fuchsia-500"></div>

                  <div className="absolute top-[32px] left-[40px] w-2 h-2 rotate-45 bg-cyan-500"></div>
                  <div className="absolute top-[32px] left-[180px] w-2 h-2 rotate-45 bg-cyan-500"></div>
               </div>
             </div>
          </div>

        </div>

        {/* Right Panel: Transform & IK */}
        <div className="w-72 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.5)]">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Crosshair size={14}/> Properties</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
             
             {selectedBone && (
               <>
                 <div className="bg-[#1a1a1c] p-3 rounded border border-[#3e3e42]">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                     <Bone size={16} className="text-fuchsia-400"/>
                     {selectedBone}
                   </h3>
                 </div>

                 <div className="space-y-3">
                   <h4 className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Transform</h4>
                   
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] text-gray-500 w-12">Pos</span>
                     <input type="text" defaultValue="0.00" className="flex-1 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-center focus:border-fuchsia-500"/>
                     <input type="text" defaultValue="0.00" className="flex-1 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-center focus:border-fuchsia-500"/>
                     <input type="text" defaultValue="0.00" className="flex-1 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-center focus:border-fuchsia-500"/>
                   </div>
                   
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] text-gray-500 w-12">Rot</span>
                     <input type="text" defaultValue="0.00" className="flex-1 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-center focus:border-fuchsia-500"/>
                     <input type="text" defaultValue="0.00" className="flex-1 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-center focus:border-fuchsia-500"/>
                     <input type="text" defaultValue="0.00" className="flex-1 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-center focus:border-fuchsia-500"/>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <h4 className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Inverse Kinematics (IK)</h4>
                   
                   <div className="flex items-center justify-between text-[10px] text-gray-400">
                     <span>Enable IK Target</span>
                     <input type="checkbox" className="accent-fuchsia-500"/>
                   </div>
                   
                   <div className="flex flex-col gap-1.5">
                     <span className="text-[10px] text-gray-500">Pole Vector</span>
                     <select className="w-full bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1.5 outline-none focus:border-fuchsia-500">
                       <option>None</option>
                       <option>Knee_L</option>
                       <option>Elbow_L</option>
                     </select>
                   </div>
                 </div>
               </>
             )}
             
           </div>
        </div>
      </div>
      
    </div>
  );
}
