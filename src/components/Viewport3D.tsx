import React, { useState, useRef, useEffect, Suspense } from 'react';
import { MousePointer2, Move, RotateCcw, Maximize, SlidersHorizontal, Eye, X, Image as ImageIcon, ChevronDown, Bug, Hand, ZoomIn, Orbit, PersonStanding, Sliders, Box, Layers, Save } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TransformControls, OrbitControls, MapControls, OrthographicCamera, PerspectiveCamera, Environment, ContactShadows, Stars, Sparkles } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider, BallCollider, interactionGroups } from '@react-three/rapier';
import { EffectComposer, Bloom, BrightnessContrast, HueSaturation, Vignette, SSAO } from '@react-three/postprocessing';
import * as THREE from 'three';

import BasicSkeletonModel from './BasicSkeletonModel';

interface Viewport3DProps {
  activeTool: string;
  activeFile: { name: string; content: string } | undefined;
}

type ToolMode = 'translate' | 'rotate' | 'scale' | 'select' | 'physics' | 'orbit' | 'pan' | 'zoom';

interface TransformProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

interface MaterialProps {
  color: string;
  roughness: number;
  metalness: number;
  emissive: string;
  emissiveIntensity: number;
}

interface PhysicsProps {
  mass: number;
  restitution: number;
  friction: number;
  colliderShape: 'cuboid' | 'ball' | 'hull';
  type: 'dynamic' | 'fixed' | 'kinematicPosition';
}

function SceneObject({ mode, transform, material, setTransform, meshType = 'torus', skelAnimState = 'Idle' }: { mode: ToolMode, transform: TransformProps, material: MaterialProps, setTransform: (t: TransformProps) => void, meshType?: 'torus' | 'skeletal' | 'cube', skelAnimState?: any }) {
  const meshRef = useRef<THREE.Group>(null);
  const rigidBodyRef = useRef<any>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(true);
  const [meshReady, setMeshReady] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      setMeshReady(true);
      // Sync initial transform
      meshRef.current.position.set(...transform.position);
      meshRef.current.rotation.set(...transform.rotation);
      meshRef.current.scale.set(...transform.scale);
    }
  }, []);

  // Update object when transform props change externally
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...transform.position);
      meshRef.current.rotation.set(...transform.rotation);
      meshRef.current.scale.set(...transform.scale);
    }
  }, [transform]);

  // Reset physics position when entering physics mode
  useEffect(() => {
    if (mode === 'physics' && rigidBodyRef.current) {
       rigidBodyRef.current.setTranslation({ x: 0, y: 5, z: 0 }, true);
       rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
       rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, [mode]);

  const content = (
      <group ref={meshRef}>
        {meshType === 'torus' ? (
          <mesh
            onClick={(e) => { e.stopPropagation(); setActive(true); }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
          >
            <torusKnotGeometry args={[1, 0.3, 128, 16]} />
            <meshStandardMaterial 
              color={hovered ? '#bc8cff' : material.color} 
              wireframe={false} 
              roughness={material.roughness}
              metalness={material.metalness}
              emissive={hovered ? '#bc8cff' : material.emissive}
              emissiveIntensity={material.emissiveIntensity}
            />
          </mesh>
        ) : meshType === 'skeletal' ? (
          <group 
            onClick={(e) => { e.stopPropagation(); setActive(true); }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            scale={[1, 1, 1]}
          >
            <BasicSkeletonModel isSimulating={true} animState={skelAnimState} blendWeight={1.0} position={[0, -1, 0]} />
          </group>
        ) : (
          <mesh
            onClick={(e) => { e.stopPropagation(); setActive(true); }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
          >
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial 
              color={hovered ? '#bc8cff' : material.color} 
              wireframe={false} 
              roughness={material.roughness}
              metalness={material.metalness}
              emissive={hovered ? '#bc8cff' : material.emissive}
              emissiveIntensity={material.emissiveIntensity}
            />
          </mesh>
        )}
        
        {/* Core glow */}
        <pointLight color={material.emissive === '#000000' ? '#bc8cff' : material.emissive} intensity={5} distance={5} />
      </group>
  );

  return (
    <>
      {meshReady && meshRef.current && (mode === 'translate' || mode === 'rotate' || mode === 'scale') && (
        <TransformControls 
           object={meshRef} 
           mode={mode} 
           onMouseUp={() => {
             if (meshRef.current) {
               setTransform({
                 position: [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z],
                 rotation: [meshRef.current.rotation.x, meshRef.current.rotation.y, meshRef.current.rotation.z],
                 scale: [meshRef.current.scale.x, meshRef.current.scale.y, meshRef.current.scale.z]
               });
             }
           }}
        />
      )}
      {content}
    </>
  );
}

export default function Viewport3D({ activeTool, activeFile }: Viewport3DProps) {
  // Sky Environment
  const [skybox, setSkybox] = useState(() => localStorage.getItem('skybox') || 'Default (Dark)');
  const [skyboxIntensity, setSkyboxIntensity] = useState(() => parseFloat(localStorage.getItem('skyboxIntensity') || '1'));
  const [showSkyboxMenu, setShowSkyboxMenu] = useState(false);

  // Object and Transform State
  const [activeTransformTool, setActiveTransformTool] = useState<ToolMode>('orbit');
  const [showInspector, setShowInspector] = useState(true);

  const [objTransform, setObjTransform] = useState<TransformProps>({
    position: [0, 5, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1]
  });

  const [objMaterial, setObjMaterial] = useState<MaterialProps>({
    color: '#58a6ff',
    roughness: 0.1,
    metalness: 0.8,
    emissive: '#000000',
    emissiveIntensity: 0.2
  });

  const [objPhysics, setObjPhysics] = useState<PhysicsProps>({
    mass: 1.0,
    restitution: 0.8,
    friction: 0.5,
    colliderShape: 'cuboid',
    type: 'dynamic'
  });

  const [agentPhysics, setAgentPhysics] = useState<PhysicsProps>({
    mass: 1.0,
    restitution: 0.2,
    friction: 0.8,
    colliderShape: 'cuboid',
    type: 'dynamic'
  });

  const [meshType, setMeshType] = useState<'torus' | 'skeletal' | 'cube'>('cube');
  const [skelAnimState, setSkelAnimState] = useState<'Idle' | 'Walk' | 'Run' | 'Jump' | 'Attack' | 'HitReaction' | 'Death'>('Idle');

  const [collisionEvent, setCollisionEvent] = useState<string | null>(null);

  const [extraBodies, setExtraBodies] = useState<{ id: number, x: number, y: number, z: number, color: string }[]>([]);

  const handleTransformChange = (axis: number, type: keyof TransformProps, value: string) => {
    setObjTransform(prev => {
      const parsed = parseFloat(value) || 0;
      const arr = [...prev[type]] as [number, number, number];
      arr[axis] = parsed;
      return { ...prev, [type]: arr };
    });
  };

  const handleMaterialChange = (key: keyof MaterialProps, value: string | number) => {
    setObjMaterial(prev => ({ ...prev, [key]: value }));
  };

  // Post Processing States
  const [showPP, setShowPP] = useState(false);
  const [ppSettings, setPPSettings] = useState({
    bloomIntensity: 1.5,
    bloomThreshold: 0.1,
    brightness: 0.0,
    contrast: 0.1,
    hue: 0,
    saturation: 0.1,
    aoIntensity: 0.5,
    aoRadius: 0.4,
    vignetteOffset: 0.5,
    vignetteDarkness: 0.5
  });
  
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [showPhysicsDebug, setShowPhysicsDebug] = useState(false);
  const [simulatePhysics, setSimulatePhysics] = useState(true);
  
  // AI Animation State
  const [isGeneratingAnim, setIsGeneratingAnim] = useState(false);
  const [animProgress, setAnimProgress] = useState('');

  // Camera Mode State
  const [cameraMode, setCameraMode] = useState<'Perspective' | 'Orthographic Top'>('Perspective');

  // Instance Edit State
  const [isInstanceEditMode, setIsInstanceEditMode] = useState(false);
  const [instanceName, setInstanceName] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('editInstanceContext') === 'true') {
      setIsInstanceEditMode(true);
      setInstanceName(sessionStorage.getItem('editInstanceName') || 'Instance');
    }
  }, [activeTool]);

  const handleReturnToMap = () => {
    sessionStorage.removeItem('editInstanceContext');
    sessionStorage.removeItem('editInstanceName');
    setIsInstanceEditMode(false);
    // Ideally we would trigger a setActiveTool('MapEdit') here if we had it.
    // Instead we'll trigger a custom event that App.tsx can listen to if needed,
    // or just let the user know it's saved.
    alert(`Instance override saved to map. Please select MapEdit from the side panel to return.`);
  };

  const handleGenerateAnim = () => {
    setIsGeneratingAnim(true);
    setAnimProgress('Inferring Scene Context & Extracting Skeleton...');
    
    setTimeout(() => {
      setAnimProgress('Synthesizing blend spaces: Idle, Walk, Run...');
    }, 1200);
    
    setTimeout(() => {
      setAnimProgress('Applying Inverse Kinematics & Slerp Interpolation...');
    }, 2400);
    
    setTimeout(() => {
      setAnimProgress('Generating "CharacterAnimator.ts" Controller...');
    }, 3600);
    
    setTimeout(() => {
      setIsGeneratingAnim(false);
      // Let's pretend it forces physics ON or something
      setSimulatePhysics(true);
    }, 4800);
  };

  const getToolDisplayName = () => {
    switch (activeTool) {
      case 'Modeling': return '3D Modeling & UV Editor';
      case 'Landscape': return 'Landscape & Terrain Generation';
      case 'PCG': return 'Procedural Content Generation';
      case 'ControlRig': return 'Control Rig & Animation';
      case 'Sequencer': return 'Cinematic Sequencer';
      case 'MetaHuman': return 'MetaHuman Identity Editor';
      case 'Material': return 'Material Shader Graph';
      case 'Niagara': return 'Niagara VFX Toolkit';
      case 'MetaSound': return 'MetaSound Designer & DSP Graph';
      default: return '3D Viewport';
    }
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] relative overflow-hidden flex flex-col font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Viewport Top Bar */}
      <div className="h-8 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between text-[11px] text-[#8b949e] shrink-0 font-medium tracking-wide z-10">
         <div className="flex items-center gap-4">
           {/* Camera Mode Selector */}
           <div className="relative group">
             <span className="hover:text-white cursor-pointer select-none transition-colors flex items-center gap-1">
               {cameraMode} <ChevronDown size={10} />
             </span>
             <div className="absolute top-full mt-1 left-0 w-40 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl z-50 flex flex-col py-1 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button onClick={() => setCameraMode('Perspective')} className={`text-left px-3 py-1.5 text-[12px] hover:bg-[#21262d] transition-colors ${cameraMode === 'Perspective' ? 'text-[#58a6ff] bg-[#21262d]/50' : 'text-[#c9d1d9]'}`}>Perspective</button>
                <button onClick={() => setCameraMode('Orthographic Top')} className={`text-left px-3 py-1.5 text-[12px] hover:bg-[#21262d] transition-colors ${cameraMode === 'Orthographic Top' ? 'text-[#58a6ff] bg-[#21262d]/50' : 'text-[#c9d1d9]'}`}>Orthographic Top</button>
             </div>
           </div>

           <span className="hover:text-[#e3b341] cursor-pointer select-none transition-colors">Lit</span>
           <span className="hover:text-white cursor-pointer select-none transition-colors">Show</span>
           
           <div className="w-[1px] h-4 bg-[#30363d] ml-2"></div>
           
           <button 
             onClick={() => setShowInspector(!showInspector)} 
             className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ml-2 ${showInspector ? 'bg-[#21262d] text-white' : 'hover:bg-[#21262d] hover:text-[#c9d1d9]'}`}
             title="Toggle Details Inspector"
           >
             <Sliders size={12} /> Details
           </button>
           
           <div className="w-[1px] h-4 bg-[#30363d]"></div>
           
           {/* Skybox Selector */}
           <div className="relative">
             <button onClick={() => setShowSkyboxMenu(!showSkyboxMenu)} className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${showSkyboxMenu ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9]'}`} title="Environment settings">
               <ImageIcon size={12} /> {skybox} <ChevronDown size={10} />
             </button>
             {showSkyboxMenu && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl z-50 flex flex-col py-1 overflow-hidden">
                   <div className="px-3 py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-bold border-b border-[#30363d] mb-1">Environment Preset</div>
                   {['Default (Dark)', 'Clear Day', 'Studio Light', 'City', 'Forest'].map(s => (
                     <button key={s} onClick={() => setSkybox(s)} className={`text-left px-3 py-1.5 text-[12px] hover:bg-[#21262d] transition-colors ${skybox === s ? 'text-[#58a6ff] bg-[#21262d]/50' : 'text-[#c9d1d9]'}`}>
                       {s}
                     </button>
                   ))}
                </div>
             )}
           </div>

           <div className="w-[1px] h-4 bg-[#30363d]"></div>
           
           <button 
             onClick={() => setShowPP(!showPP)} 
             className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${showPP ? 'bg-[#21262d] text-[#ff7b72]' : 'hover:bg-[#21262d] hover:text-[#c9d1d9]'}`}
             title="Post Process Volume"
           >
             <SlidersHorizontal size={12} /> Post Processing
           </button>

           <div className="w-[1px] h-4 bg-[#30363d] mx-2"></div>
           
           <div className="relative">
             <button onClick={() => setShowDebugMenu(!showDebugMenu)} className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${showDebugMenu ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9]'}`} title="Debug Settings">
               <Bug size={12} /> Debug <ChevronDown size={10} />
             </button>
             {showDebugMenu && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl z-50 flex flex-col py-1 overflow-hidden">
                   <div className="px-3 py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-bold border-b border-[#30363d] mb-1">Debug Options</div>
                   <button onClick={() => setSimulatePhysics(!simulatePhysics)} className="text-left px-3 py-1.5 text-[12px] hover:bg-[#21262d] transition-colors text-[#c9d1d9] flex justify-between items-center">
                      <span>Simulate Physics</span>
                      {simulatePhysics && <span className="text-[#3fb950] font-bold text-[10px]">ON</span>}
                   </button>
                   <button onClick={() => setShowPhysicsDebug(!showPhysicsDebug)} className="text-left px-3 py-1.5 text-[12px] hover:bg-[#21262d] transition-colors text-[#c9d1d9] flex justify-between items-center">
                      <span>Physics Colliders</span>
                      {showPhysicsDebug && <span className="text-[#3fb950] font-bold text-[10px]">ON</span>}
                   </button>
                   <button className="text-left px-3 py-1.5 text-[12px] hover:bg-[#21262d] transition-colors text-[#8b949e] flex justify-between items-center cursor-not-allowed">
                      <span>Show Contact Points</span>
                   </button>
                   <button className="text-left px-3 py-1.5 text-[12px] hover:bg-[#21262d] transition-colors text-[#8b949e] flex justify-between items-center cursor-not-allowed">
                      <span>Show Hierarchy</span>
                   </button>
                </div>
             )}
           </div>
         </div>
         <div className="flex gap-4 items-center">
           <span className="text-[#bc8cff] font-mono text-[9px] bg-[#bc8cff]/10 border border-[#bc8cff]/30 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(188,140,255,0.4)]">FSR 3.0 ACTIVE</span>
           <span className="text-[#3fb950] font-mono text-[9px] bg-[#3fb950]/10 border border-[#3fb950]/30 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(63,185,80,0.4)]">NANITE ON</span>
           <span className="text-[#e3b341] font-mono text-[9px] bg-[#e3b341]/10 border border-[#e3b341]/30 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(227,179,65,0.4)]">SDF GI ON</span>
           <span className="text-[#ff7b72] font-mono select-none flex items-center gap-1 font-bold ml-2">144.2 FPS <span className="text-[9px] text-[#8b949e] font-normal">/ 1% 120</span></span>
           <span className="text-[#58a6ff] font-mono select-none hidden sm:inline text-[9px] ml-2">GPU: 4.2ms | CPU: 1.8ms</span>
         </div>
      </div>
      
      {/* 3D Render Area + Inspector */}
      <div className="flex-1 relative overflow-hidden flex flex-row">
        <div className="flex-1 relative bg-[#0d1117] overflow-hidden">

         {/* Instance Edit Override Banner */}
         {isInstanceEditMode && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-[#bc8cff]/10 border border-[#bc8cff]/30 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-3 shadow-[0_0_15px_rgba(188,140,255,0.1)] group cursor-default">
               <div className="relative">
                 <span className="text-[11px] text-white font-bold tracking-wider flex items-center gap-2">
                   <span className="text-[#bc8cff]"><Box size={14} className="inline-block" /> INSTANCE OVERRIDE:</span> {instanceName}
                 </span>
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-[#161b22] border border-[#30363d] rounded-lg p-3 hidden group-hover:block shadow-2xl">
                    <div className="text-[10px] uppercase font-bold text-[#8b949e] mb-2 border-b border-[#30363d] pb-1">Unlinked Properties</div>
                    <ul className="text-[11px] space-y-1 text-white mb-3">
                       <li className="flex justify-between"><span>Transform</span> <span className="text-[#3fb950]">Modified</span></li>
                       <li className="flex justify-between"><span>Material</span> <span className="text-[#3fb950]">Override (Red_Metal)</span></li>
                    </ul>
                    <button onClick={() => alert('Reverted transform and material overrides to Base Blueprint defaults.')} className="w-full text-left px-2 py-1 text-[11px] hover:bg-[#21262d] rounded text-[#ff7b72] flex items-center gap-2 transition-colors mb-1"><Layers size={14}/> Revert to Base Blueprint</button>
                    <button onClick={() => alert('Instance changes applied to the Base Blueprint. All other instances will inherit these changes.')} className="w-full text-left px-2 py-1 text-[11px] hover:bg-[#21262d] rounded text-[#58a6ff] flex items-center gap-2 transition-colors"><Save size={14}/> Apply to Base Blueprint</button>
                 </div>
               </div>
               <div className="w-[1px] h-3 bg-[#bc8cff]/20"></div>
               <button 
                 onClick={handleReturnToMap}
                 className="text-[10px] text-[#0d1117] bg-[#bc8cff] hover:bg-[#d2a8ff] px-2 py-0.5 rounded font-bold transition-colors"
               >
                 Commit to Level
               </button>
            </div>
         )}

         {/* Collision Indicator Overlay */}
         {collisionEvent && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 bg-[#f85149]/20 border border-[#f85149]/50 backdrop-blur-md rounded-full px-6 py-2 flex items-center gap-3 shadow-[0_0_20px_rgba(248,81,73,0.3)] pointer-events-none animate-pulse">
               <span className="text-[13px] text-white font-bold tracking-wider flex items-center gap-2">
                 <Box size={16} className="text-[#f85149]" /> {collisionEvent}
               </span>
            </div>
         )}

         {/* AI Animation Generation Overlay */}
         {isGeneratingAnim && (
            <div className="absolute inset-0 bg-[#0d1117]/80 z-50 flex flex-col items-center justify-center backdrop-blur-md">
               <div className="w-20 h-20 border-4 border-[#30363d] border-t-[#a476ed] rounded-full animate-spin mb-6"></div>
               <div className="text-white text-xl font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                 <PersonStanding className="text-[#a476ed]" />
                 AI Core: Neural Rigger
               </div>
               <div className="text-[#a476ed] text-[13px] font-mono mt-2 animate-pulse text-center">
                 {animProgress}
               </div>
               <div className="w-64 bg-[#21262d] h-2 rounded-full overflow-hidden mt-6 border border-[#30363d]">
                  <div className="bg-[#a476ed] h-full transition-all duration-[4800ms] ease-out w-full" style={{ animation: 'fillBar 4.8s linear' }}></div>
               </div>
               <style>{`
                 @keyframes fillBar {
                   0% { width: 0%; }
                   100% { width: 100%; }
                 }
               `}</style>
            </div>
         )}

         {/* Transform Tools Gizmo UI overlay */}
         <div className="absolute top-4 right-4 bg-[#161b22] border border-[#30363d] rounded p-1 flex flex-col gap-1 shadow-2xl z-20">
            <button onClick={() => setActiveTransformTool('orbit')} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'orbit' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Orbit Camera"><Orbit size={16}/></button>
            <button onClick={() => setActiveTransformTool('pan')} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'pan' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Pan Camera"><Hand size={16}/></button>
            <button onClick={() => setActiveTransformTool('zoom')} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'zoom' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Zoom Camera"><ZoomIn size={16}/></button>
            <div className="w-full h-[1px] bg-[#30363d] my-1"></div>
            <button onClick={() => setActiveTransformTool('select')} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'select' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Select"><MousePointer2 size={16}/></button>
            <button onClick={() => setActiveTransformTool('translate')} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'translate' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Translate"><Move size={16}/></button>
            <button onClick={() => setActiveTransformTool('rotate')} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'rotate' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Rotate"><RotateCcw size={16}/></button>
            <button onClick={() => setActiveTransformTool('scale')} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'scale' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Scale"><Maximize size={16}/></button>
            <div className="w-full h-[1px] bg-[#30363d] my-1"></div>
            <button onClick={() => setActiveTransformTool('physics')} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'physics' ? 'text-[#e3b341] bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-[#e3b341]'}`} title="Simulate Physics"><RotateCcw className="rotate-45" size={16}/></button>
            <div className="w-full h-[1px] bg-[#30363d] my-1"></div>
            <button onClick={handleGenerateAnim} className="p-1.5 rounded transition-colors text-[#bc8cff] hover:text-[#d2a8ff] hover:bg-[#0d1117]" title="AI Animate Skeleton"><PersonStanding size={16}/></button>
         </div>

         {/* Center Subject Content */}
         <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10 pointer-events-none px-4 text-center">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest drop-shadow-[0_0_15px_rgba(0,0,0,1)] uppercase">
              {getToolDisplayName()}
            </h1>
            <p className="text-[#c9d1d9] mt-3 font-mono text-[11px] md:text-sm max-w-md bg-[#0d1117]/80 p-3 rounded-lg backdrop-blur-md border border-[#30363d] shadow-2xl">
              <span className="text-[#8b949e]">Target Edit:</span> {activeFile?.name || 'Unsaved_Map.map'}
            </p>
         </div>

         <Canvas>
            {cameraMode === 'Perspective' ? (
              <>
                <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
                <OrbitControls 
                  makeDefault 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  mouseButtons={{
                    LEFT: activeTransformTool === 'orbit' ? THREE.MOUSE.ROTATE : 
                          activeTransformTool === 'pan' ? THREE.MOUSE.PAN : 
                          activeTransformTool === 'zoom' ? THREE.MOUSE.DOLLY : 
                          THREE.MOUSE.ROTATE,
                    MIDDLE: THREE.MOUSE.DOLLY,
                    RIGHT: THREE.MOUSE.PAN
                  }}
                />
              </>
            ) : (
              <>
                <OrthographicCamera makeDefault position={[0, 20, 0]} zoom={40} near={-100} far={100} top={10} bottom={-10} left={-10} right={10} rotation={[-Math.PI / 2, 0, 0]} />
                <MapControls 
                  makeDefault 
                  enableRotate={false}
                  enableZoom={true}
                  enablePan={true}
                />
              </>
            )}

            <color attach="background" args={['#0d1117']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
            
            <Suspense fallback={null}>
               <Physics paused={!simulatePhysics} debug={showPhysicsDebug} gravity={[0, -9.81, 0]}>
                  <RigidBody 
                     colliders={agentPhysics.colliderShape === 'hull' ? 'hull' : false} 
                     mass={agentPhysics.mass} 
                     restitution={agentPhysics.restitution} 
                     friction={agentPhysics.friction}
                     position={[-3, 5, 0]} 
                     type={simulatePhysics ? agentPhysics.type : 'kinematicPosition'} 
                     collisionGroups={interactionGroups(1, [0, 1, 2])}
                  >
                     {agentPhysics.colliderShape === 'cuboid' && <CuboidCollider args={[0.4, 1, 0.4]} position={[0, 1, 0]} />}
                     {agentPhysics.colliderShape === 'ball' && <BallCollider args={[1]} position={[0, 1, 0]} />}
                     <BasicSkeletonModel isSimulating={true} />
                  </RigidBody>
                  <RigidBody 
                     colliders={objPhysics.colliderShape === 'hull' ? 'hull' : false} 
                     mass={objPhysics.mass} 
                     restitution={objPhysics.restitution} 
                     friction={objPhysics.friction}
                     type={simulatePhysics ? objPhysics.type : 'kinematicPosition'}
                     collisionGroups={interactionGroups(2, [0, 1, 2])}
                     position={objTransform.position as [number, number, number]}
                     rotation={objTransform.rotation as [number, number, number]}
                     onCollisionEnter={(e) => {
                       setCollisionEvent(`Collided with ${e.other.rigidBodyObject?.name || 'World'}`);
                       setTimeout(() => setCollisionEvent(null), 1000);
                     }}
                  >
                     {objPhysics.colliderShape === 'cuboid' && <CuboidCollider args={[1.5, 1.5, 1.5]} />}
                     {objPhysics.colliderShape === 'ball' && <BallCollider args={[1.5]} />}
                     {/* The transform is managed by physics engine when simulating, otherwise controlled by state */}
                     <SceneObject 
                        mode={activeTransformTool} 
                        transform={{ position: [0, 0, 0], rotation: [0, 0, 0], scale: objTransform.scale }}
                        material={objMaterial}
                        setTransform={setObjTransform}
                        meshType={meshType}
                        skelAnimState={skelAnimState}
                     />
                  </RigidBody>
                  
                  {extraBodies.map((body) => (
                     <RigidBody key={body.id} colliders="cuboid" mass={1} position={[body.x, body.y, body.z]} restitution={0.8} collisionGroups={interactionGroups(2, [0, 1, 2])}>
                        <mesh receiveShadow castShadow>
                           <boxGeometry args={[1, 1, 1]} />
                           <meshStandardMaterial color={body.color} />
                        </mesh>
                     </RigidBody>
                  ))}

                  {/* Environment mapping based on selection */}
                  <Environment preset={
                    skybox === 'City' ? 'city' : 
                    skybox === 'Forest' ? 'forest' : 
                    skybox === 'Studio Light' ? 'studio' : 
                    skybox === 'Clear Day' ? 'park' : 
                    'night'
                  } background={false} blur={0.8} />

                  {/* Background elements */}
                  <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                  <Sparkles color="#bc8cff" size={4} count={100} scale={10} speed={0.4} opacity={0.1} />

                  <RigidBody type="fixed" restitution={0.5} friction={0.5} collisionGroups={interactionGroups(0, [0, 1, 2])}>
                     <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.6} far={10} color="#000000" />
                     <gridHelper args={[50, 50, '#30363d', '#161b22']} position={[0, -2, 0]} />
                     <CuboidCollider args={[25, 0.1, 25]} position={[0, -2.1, 0]} />
                  </RigidBody>
               </Physics>
               
               {showPP && (
                 <EffectComposer>
                   <Bloom 
                     luminanceThreshold={ppSettings.bloomThreshold} 
                     luminanceSmoothing={0.9} 
                     height={300} 
                     intensity={ppSettings.bloomIntensity} 
                   />
                   <BrightnessContrast 
                     brightness={ppSettings.brightness} 
                     contrast={ppSettings.contrast} 
                   />
                   <HueSaturation 
                     hue={ppSettings.hue} 
                     saturation={ppSettings.saturation} 
                   />
                   <Vignette 
                     eskil={false} 
                     offset={ppSettings.vignetteOffset} 
                     darkness={ppSettings.vignetteDarkness} 
                   />
                   <SSAO 
                     radius={ppSettings.aoRadius}
                     intensity={ppSettings.aoIntensity}
                     luminanceInfluence={0.5}
                   />
                 </EffectComposer>
               )}
            </Suspense>


         </Canvas>

        </div>

        {/* Properties Inspector Panel */}
        {showInspector && (
          <div className="w-80 bg-[#0d1117] border-l border-[#30363d] flex flex-col shrink-0 overflow-y-auto text-[#c9d1d9] z-20">
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d] sticky top-0 z-10">
              <h2 className="text-[13px] font-bold tracking-wide flex items-center gap-2 text-white">
                <Sliders size={14} className="text-[#58a6ff]" /> Details
              </h2>
              <button onClick={() => setShowInspector(false)} className="text-[#8b949e] hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-6">
              {/* Transform Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#30363d] pb-1">
                  <Move size={12} /> Transform
                </h3>
                
                {['position', 'rotation', 'scale'].map((propName) => (
                  <div key={propName} className="flex flex-col gap-1.5">
                    <div className="text-[11px] text-[#8b949e] capitalize font-medium">{propName}</div>
                    <div className="flex gap-2">
                       {['X', 'Y', 'Z'].map((axis, i) => (
                         <div key={axis} className="flex-1 flex items-center bg-[#161b22] border border-[#30363d] rounded overflow-hidden focus-within:border-[#58a6ff] transition-colors">
                           <div className={`px-1.5 py-1 text-[10px] font-bold ${axis === 'X' ? 'text-[#ff7b72]' : axis === 'Y' ? 'text-[#3fb950]' : 'text-[#58a6ff]'} bg-[#21262d] border-r border-[#30363d]`}>
                             {axis}
                           </div>
                           <input 
                             type="number" 
                             step={propName === 'scale' ? 0.1 : 1}
                             className="w-full bg-transparent text-[11px] text-white px-1.5 py-1 outline-none font-mono"
                             value={objTransform[propName as keyof TransformProps][i].toFixed(2)}
                             onChange={(e) => handleTransformChange(i, propName as keyof TransformProps, e.target.value)}
                           />
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mesh Details Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#30363d] pb-1">
                  <Box size={12} /> Mesh Details
                </h3>
                <div className="bg-[#161b22] rounded border border-[#30363d] p-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[11px]">
                     <span className="text-[#8b949e]">Geometry</span>
                     <select 
                       className="bg-[#21262d] text-white text-[11px] outline-none rounded p-1"
                       value={meshType}
                       onChange={(e) => setMeshType(e.target.value as any)}
                     >
                        <option value="torus">TorusKnot</option>
                        <option value="skeletal">Skeletal Mesh</option>
                        <option value="cube">Box / Cube</option>
                     </select>
                  </div>
                  {meshType === 'skeletal' && (
                    <div className="flex justify-between items-center text-[11px]">
                       <span className="text-[#8b949e]">Anim State</span>
                       <select 
                         className="bg-[#21262d] text-white text-[11px] outline-none rounded p-1"
                         value={skelAnimState}
                         onChange={(e) => setSkelAnimState(e.target.value as any)}
                       >
                          <option value="Idle">Idle</option>
                          <option value="Walk">Walk</option>
                          <option value="Run">Run</option>
                          <option value="Jump">Jump</option>
                          <option value="Attack">Attack</option>
                          <option value="HitReaction">Hit Reaction</option>
                       </select>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[11px]">
                     <span className="text-[#8b949e]">Vertices</span>
                     <span className="text-[#c9d1d9] font-mono">{meshType === 'torus' ? '16,384' : meshType === 'skeletal' ? '23,412' : '8'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                     <span className="text-[#8b949e]">Triangles</span>
                     <span className="text-[#c9d1d9] font-mono">{meshType === 'torus' ? '8,192' : meshType === 'skeletal' ? '15,842' : '12'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                     <span className="text-[#8b949e]">LODs</span>
                     <span className="text-[#3fb950] font-mono">Auto (Nanite)</span>
                  </div>
                </div>
              </div>

              {/* Physics Settings Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[11px] font-bold text-[#f85149] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#30363d] pb-1">
                  <Orbit size={12} /> Rigid Body Physics
                </h3>
                
                <div className="flex flex-col gap-2 relative">
                   <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <span className="text-[11px] text-[#8b949e]">Simulation Type</span>
                     <select 
                       className="bg-[#21262d] text-white text-[11px] outline-none rounded p-1"
                       value={objPhysics.type}
                       onChange={(e) => setObjPhysics(prev => ({ ...prev, type: e.target.value as any }))}
                     >
                        <option value="dynamic">Dynamic (Gravity)</option>
                        <option value="kinematicPosition">Kinematic (Animated)</option>
                        <option value="fixed">Fixed (Static)</option>
                     </select>
                   </div>
                   
                   <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <span className="text-[11px] text-[#8b949e]">Collider Shape</span>
                     <select 
                       className="bg-[#21262d] text-white text-[11px] outline-none rounded p-1"
                       value={objPhysics.colliderShape}
                       onChange={(e) => setObjPhysics(prev => ({ ...prev, colliderShape: e.target.value as any }))}
                     >
                        <option value="cuboid">Box Collider</option>
                        <option value="ball">Sphere Collider</option>
                        <option value="hull">Convex Hull</option>
                     </select>
                   </div>

                   <div className="flex flex-col gap-1 bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <div className="flex justify-between items-center">
                       <span className="text-[11px] text-[#8b949e]">Mass (kg)</span>
                       <input 
                         type="number" 
                         className="bg-transparent text-[11px] text-white w-16 outline-none font-mono text-right"
                         value={objPhysics.mass}
                         onChange={(e) => setObjPhysics(prev => ({ ...prev, mass: parseFloat(e.target.value) || 1 }))}
                       />
                     </div>
                   </div>

                   <div className="flex flex-col gap-1 bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <div className="flex justify-between items-center">
                       <span className="text-[11px] text-[#8b949e]">Restitution (Bounciness)</span>
                       <span className="text-[11px] font-mono">{Number(objPhysics.restitution).toFixed(2)}</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" max="1" step="0.01" 
                       value={objPhysics.restitution}
                       onChange={(e) => setObjPhysics(prev => ({ ...prev, restitution: parseFloat(e.target.value) }))}
                       className="w-full accent-[#f85149] cursor-pointer"
                     />
                   </div>

                   <div className="flex flex-col gap-1 bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <div className="flex justify-between items-center">
                       <span className="text-[11px] text-[#8b949e]">Friction</span>
                       <span className="text-[11px] font-mono">{Number(objPhysics.friction).toFixed(2)}</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" max="2" step="0.01" 
                       value={objPhysics.friction}
                       onChange={(e) => setObjPhysics(prev => ({ ...prev, friction: parseFloat(e.target.value) }))}
                       className="w-full accent-[#e3b341] cursor-pointer"
                     />
                   </div>
                   
                   <div className="flex items-center gap-2 mt-2">
                     <button onClick={() => setSimulatePhysics(!simulatePhysics)} className={`w-full py-1.5 font-bold text-[11px] rounded transition-colors ${simulatePhysics ? 'bg-[#f85149] text-white' : 'bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d]'}`}>
                       {simulatePhysics ? 'Simulating...' : 'Play Physics'}
                     </button>
                     <button 
                       onClick={() => setExtraBodies(prev => [...prev, { id: Date.now(), x: Math.random() * 4 - 2, y: 10 + Math.random() * 5, z: Math.random() * 4 - 2, color: '#' + Math.floor(Math.random()*16777215).toString(16) }])}
                       className="w-full py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#58a6ff] font-bold text-[11px] rounded transition-colors"
                     >
                       Spawn Box
                     </button>
                     {extraBodies.length > 0 && (
                       <button onClick={() => setExtraBodies([])} className="px-2 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#f85149] rounded transition-colors" title="Clear Spawned">
                         <X size={14} />
                       </button>
                     )}
                   </div>
                </div>
              </div>

              {/* Agent Physics Settings Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[11px] font-bold text-[#e3b341] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#30363d] pb-1">
                  <Orbit size={12} /> AI Agent Physics
                </h3>
                
                <div className="flex flex-col gap-2 relative">
                   <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <span className="text-[11px] text-[#8b949e]">Simulation Type</span>
                     <select 
                       className="bg-[#21262d] text-white text-[11px] outline-none rounded p-1"
                       value={agentPhysics.type}
                       onChange={(e) => setAgentPhysics(prev => ({ ...prev, type: e.target.value as any }))}
                     >
                        <option value="dynamic">Dynamic (Gravity)</option>
                        <option value="kinematicPosition">Kinematic (Animated)</option>
                        <option value="fixed">Fixed (Static)</option>
                     </select>
                   </div>
                   
                   <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <span className="text-[11px] text-[#8b949e]">Collider Shape</span>
                     <select 
                       className="bg-[#21262d] text-white text-[11px] outline-none rounded p-1"
                       value={agentPhysics.colliderShape}
                       onChange={(e) => setAgentPhysics(prev => ({ ...prev, colliderShape: e.target.value as any }))}
                     >
                        <option value="cuboid">Box Collider</option>
                        <option value="ball">Sphere Collider</option>
                        <option value="hull">Convex Hull</option>
                     </select>
                   </div>

                   <div className="flex flex-col gap-1 bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <div className="flex justify-between items-center">
                       <span className="text-[11px] text-[#8b949e]">Mass (kg)</span>
                       <input 
                         type="number" 
                         className="bg-transparent text-[11px] text-white w-16 outline-none font-mono text-right"
                         value={agentPhysics.mass}
                         onChange={(e) => setAgentPhysics(prev => ({ ...prev, mass: parseFloat(e.target.value) || 1 }))}
                       />
                     </div>
                   </div>

                   <div className="flex flex-col gap-1 bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <div className="flex justify-between items-center">
                       <span className="text-[11px] text-[#8b949e]">Restitution (Bounciness)</span>
                       <span className="text-[11px] font-mono">{Number(agentPhysics.restitution).toFixed(2)}</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" max="1" step="0.01" 
                       value={agentPhysics.restitution}
                       onChange={(e) => setAgentPhysics(prev => ({ ...prev, restitution: parseFloat(e.target.value) }))}
                       className="w-full accent-[#e3b341] cursor-pointer"
                     />
                   </div>

                   <div className="flex flex-col gap-1 bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <div className="flex justify-between items-center">
                       <span className="text-[11px] text-[#8b949e]">Friction</span>
                       <span className="text-[11px] font-mono">{Number(agentPhysics.friction).toFixed(2)}</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" max="2" step="0.01" 
                       value={agentPhysics.friction}
                       onChange={(e) => setAgentPhysics(prev => ({ ...prev, friction: parseFloat(e.target.value) }))}
                       className="w-full accent-[#e3b341] cursor-pointer"
                     />
                   </div>
                </div>
              </div>

              {/* Material Slots Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#30363d] pb-1">
                  <Layers size={12} /> Material Instance
                </h3>
                
                <div className="flex flex-col gap-2 relative">
                   <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <span className="text-[11px] text-[#8b949e]">Albedo Color</span>
                     <div className="flex items-center gap-2">
                       <input 
                         type="text" 
                         className="bg-transparent text-[11px] text-white w-16 outline-none font-mono text-right"
                         value={objMaterial.color}
                         onChange={(e) => handleMaterialChange('color', e.target.value)}
                       />
                       <input 
                         type="color" 
                         value={objMaterial.color}
                         onChange={(e) => handleMaterialChange('color', e.target.value)}
                         className="w-5 h-5 rounded cursor-pointer p-0 border-[#30363d] bg-transparent"
                       />
                     </div>
                   </div>

                   <div className="flex flex-col gap-1 bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <div className="flex justify-between items-center">
                       <span className="text-[11px] text-[#8b949e]">Roughness</span>
                       <span className="text-[11px] font-mono">{Number(objMaterial.roughness).toFixed(2)}</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" max="1" step="0.01" 
                       value={objMaterial.roughness}
                       onChange={(e) => handleMaterialChange('roughness', parseFloat(e.target.value))}
                       className="w-full accent-[#58a6ff] cursor-pointer"
                     />
                   </div>

                   <div className="flex flex-col gap-1 bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <div className="flex justify-between items-center">
                       <span className="text-[11px] text-[#8b949e]">Metalness</span>
                       <span className="text-[11px] font-mono">{Number(objMaterial.metalness).toFixed(2)}</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" max="1" step="0.01" 
                       value={objMaterial.metalness}
                       onChange={(e) => handleMaterialChange('metalness', parseFloat(e.target.value))}
                       className="w-full accent-[#58a6ff] cursor-pointer"
                     />
                   </div>

                   <div className="flex justify-between items-center bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <span className="text-[11px] text-[#8b949e]">Emissive</span>
                     <div className="flex items-center gap-2">
                       <input 
                         type="text" 
                         className="bg-transparent text-[11px] text-white w-16 outline-none font-mono text-right"
                         value={objMaterial.emissive}
                         onChange={(e) => handleMaterialChange('emissive', e.target.value)}
                       />
                       <input 
                         type="color" 
                         value={objMaterial.emissive}
                         onChange={(e) => handleMaterialChange('emissive', e.target.value)}
                         className="w-5 h-5 rounded cursor-pointer p-0 border-[#30363d] bg-transparent"
                       />
                     </div>
                   </div>

                   <div className="flex flex-col gap-1 bg-[#161b22] border border-[#30363d] p-2 rounded focus-within:border-[#58a6ff]">
                     <div className="flex justify-between items-center">
                       <span className="text-[11px] text-[#8b949e]">Emissive Intensity</span>
                       <span className="text-[11px] font-mono">{Number(objMaterial.emissiveIntensity).toFixed(2)}</span>
                     </div>
                     <input 
                       type="range" 
                       min="0" max="10" step="0.1" 
                       value={objMaterial.emissiveIntensity}
                       onChange={(e) => handleMaterialChange('emissiveIntensity', parseFloat(e.target.value))}
                       className="w-full accent-[#bc8cff] cursor-pointer"
                     />
                   </div>

                </div>
              </div>
              {/* Post Processing Section */}
              {showPP && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-[11px] font-bold text-[#e3b341] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#30363d] pb-1 mt-2">
                    <SlidersHorizontal size={12} /> Post-Processing Options
                  </h3>
                  
                  <div className="flex flex-col gap-2 bg-[#161b22] border border-[#30363d] p-2 rounded">
                     <span className="text-[11px] font-bold text-white border-b border-[#30363d] pb-1 mb-1">Bloom</span>
                     <div className="flex justify-between items-center text-[11px]">
                       <span className="text-[#8b949e]">Intensity</span>
                       <span className="font-mono">{Number(ppSettings.bloomIntensity).toFixed(2)}</span>
                     </div>
                     <input type="range" min="0" max="5" step="0.1" value={ppSettings.bloomIntensity} onChange={e => setPPSettings({...ppSettings, bloomIntensity: parseFloat(e.target.value)})} className="w-full accent-[#bc8cff]" />
                     
                     <div className="flex justify-between items-center text-[11px] mt-2">
                       <span className="text-[#8b949e]">Threshold</span>
                       <span className="font-mono">{Number(ppSettings.bloomThreshold).toFixed(2)}</span>
                     </div>
                     <input type="range" min="0" max="1" step="0.05" value={ppSettings.bloomThreshold} onChange={e => setPPSettings({...ppSettings, bloomThreshold: parseFloat(e.target.value)})} className="w-full accent-[#bc8cff]" />
                  </div>

                  <div className="flex flex-col gap-2 bg-[#161b22] border border-[#30363d] p-2 rounded">
                     <span className="text-[11px] font-bold text-white border-b border-[#30363d] pb-1 mb-1">Color Grading</span>
                     <div className="flex justify-between items-center text-[11px]">
                       <span className="text-[#8b949e]">Brightness</span>
                       <span className="font-mono">{Number(ppSettings.brightness).toFixed(2)}</span>
                     </div>
                     <input type="range" min="-1" max="1" step="0.05" value={ppSettings.brightness} onChange={e => setPPSettings({...ppSettings, brightness: parseFloat(e.target.value)})} className="w-full accent-[#58a6ff]" />
                     
                     <div className="flex justify-between items-center text-[11px] mt-2">
                       <span className="text-[#8b949e]">Contrast</span>
                       <span className="font-mono">{Number(ppSettings.contrast).toFixed(2)}</span>
                     </div>
                     <input type="range" min="-1" max="1" step="0.05" value={ppSettings.contrast} onChange={e => setPPSettings({...ppSettings, contrast: parseFloat(e.target.value)})} className="w-full accent-[#58a6ff]" />

                     <div className="flex justify-between items-center text-[11px] mt-2">
                       <span className="text-[#8b949e]">Saturation</span>
                       <span className="font-mono">{Number(ppSettings.saturation).toFixed(2)}</span>
                     </div>
                     <input type="range" min="-1" max="1" step="0.05" value={ppSettings.saturation} onChange={e => setPPSettings({...ppSettings, saturation: parseFloat(e.target.value)})} className="w-full accent-[#58a6ff]" />
                  </div>

                  <div className="flex flex-col gap-2 bg-[#161b22] border border-[#30363d] p-2 rounded">
                     <span className="text-[11px] font-bold text-white border-b border-[#30363d] pb-1 mb-1">Ambient Occlusion (SSAO)</span>
                     <div className="flex justify-between items-center text-[11px]">
                       <span className="text-[#8b949e]">Intensity</span>
                       <span className="font-mono">{Number(ppSettings.aoIntensity).toFixed(2)}</span>
                     </div>
                     <input type="range" min="0" max="5" step="0.1" value={ppSettings.aoIntensity} onChange={e => setPPSettings({...ppSettings, aoIntensity: parseFloat(e.target.value)})} className="w-full accent-[#3fb950]" />
                     
                     <div className="flex justify-between items-center text-[11px] mt-2">
                       <span className="text-[#8b949e]">Radius</span>
                       <span className="font-mono">{Number(ppSettings.aoRadius).toFixed(2)}</span>
                     </div>
                     <input type="range" min="0" max="1" step="0.05" value={ppSettings.aoRadius} onChange={e => setPPSettings({...ppSettings, aoRadius: parseFloat(e.target.value)})} className="w-full accent-[#3fb950]" />
                  </div>

                  <div className="flex flex-col gap-2 bg-[#161b22] border border-[#30363d] p-2 rounded">
                     <span className="text-[11px] font-bold text-white border-b border-[#30363d] pb-1 mb-1">Vignette</span>
                     <div className="flex justify-between items-center text-[11px]">
                       <span className="text-[#8b949e]">Darkness</span>
                       <span className="font-mono">{Number(ppSettings.vignetteDarkness).toFixed(2)}</span>
                     </div>
                     <input type="range" min="0" max="1" step="0.05" value={ppSettings.vignetteDarkness} onChange={e => setPPSettings({...ppSettings, vignetteDarkness: parseFloat(e.target.value)})} className="w-full accent-[#f85149]" />
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}