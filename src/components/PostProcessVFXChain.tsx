import React, { useState } from 'react';
import { Camera, Save, Layers, Settings, Eye, EyeOff, Plus, GripVertical, Trash2, Sliders, Sparkles, Activity } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sphere, Box } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

interface VFXEffect {
  id: string;
  type: 'Bloom' | 'DepthOfField' | 'ChromaticAberration' | 'Noise' | 'Vignette';
  enabled: boolean;
  params: any;
}

const DEFAULT_EFFECTS: VFXEffect[] = [
  { id: 'e1', type: 'Bloom', enabled: true, params: { intensity: 1.5, luminanceThreshold: 0.1, luminanceSmoothing: 0.9 } },
  { id: 'e2', type: 'ChromaticAberration', enabled: true, params: { offset: [0.002, 0.002] } },
  { id: 'e3', type: 'Vignette', enabled: true, params: { eskil: false, offset: 0.1, darkness: 1.1 } },
];

export default function PostProcessVFXChain() {
  const [effects, setEffects] = useState<VFXEffect[]>(DEFAULT_EFFECTS);
  const [selectedEffect, setSelectedEffect] = useState<string | null>('e1');

  const toggleEffect = (id: string) => {
    setEffects(effects.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e));
  };

  const updateEffectParam = (id: string, param: string, value: any) => {
    setEffects(effects.map(e => {
      if (e.id === id) {
        return { ...e, params: { ...e.params, [param]: value } };
      }
      return e;
    }));
  };

  const getEffectIcon = (type: string) => {
    switch (type) {
      case 'Bloom': return <Sparkles size={14} className="text-yellow-400"/>;
      case 'DepthOfField': return <Camera size={14} className="text-blue-400"/>;
      case 'ChromaticAberration': return <Layers size={14} className="text-fuchsia-400"/>;
      case 'Noise': return <Activity size={14} className="text-green-400"/>;
      case 'Vignette': return <Circle size={14} className="text-purple-400"/>;
      default: return <Sliders size={14} className="text-gray-400"/>;
    }
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-700 p-1.5 rounded-lg shadow-lg">
            <Camera size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Post-Processing <span className="text-blue-400">VFX Chain</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Global Camera Effects Stack</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-[#333] hover:bg-[#444] transition-colors">
            <Settings size={14} /> PRESETS
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-[0_0_10px_rgba(37,99,235,0.3)]">
            <Save size={14} /> SAVE POST-PROCESS PROFILE
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Effect Stack */}
        <div className="w-72 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[5px_0_20px_rgba(0,0,0,0.3)]">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c] flex justify-between items-center">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> Effect Stack</h3>
             <button className="p-1 bg-[#333] hover:bg-[#444] rounded text-gray-300"><Plus size={14}/></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
             
             {effects.map((effect, idx) => (
               <div 
                 key={effect.id}
                 onClick={() => setSelectedEffect(effect.id)}
                 className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${selectedEffect === effect.id ? 'bg-blue-900/30 border-blue-500/50' : 'bg-black/30 border-[#3e3e42] hover:bg-[#333]'}`}
               >
                 <div className="cursor-grab text-gray-500 hover:text-gray-300">
                   <GripVertical size={14} />
                 </div>
                 
                 <div onClick={(e) => { e.stopPropagation(); toggleEffect(effect.id); }} className="cursor-pointer text-gray-400 hover:text-white">
                   {effect.enabled ? <Eye size={14} className="text-blue-400"/> : <EyeOff size={14} />}
                 </div>
                 
                 <div className="flex-1 flex items-center gap-2 truncate opacity-90">
                   {getEffectIcon(effect.type)}
                   <span className={`text-xs font-bold ${effect.enabled ? 'text-gray-200' : 'text-gray-500'}`}>{effect.type}</span>
                 </div>
                 
                 <button className="p-1 text-gray-500 hover:text-red-400 transition-colors">
                   <Trash2 size={12} />
                 </button>
               </div>
             ))}

           </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 relative bg-black overflow-hidden flex flex-col">
          <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
             <color attach="background" args={['#050505']} />
             
             <ambientLight intensity={0.2} />
             <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
             <pointLight position={[-10, -10, -10]} intensity={1} color="#4338ca" />
             
             <OrbitControls makeDefault autoRotate autoRotateSpeed={1} />
             
             {/* Scene to apply VFX on */}
             <group>
               <mesh position={[0, -1, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
                 <planeGeometry args={[50, 50]} />
                 <meshStandardMaterial color="#111" roughness={0.1} metalness={0.8} />
               </mesh>
               
               {/* Glowing Objects to test Bloom */}
               <mesh position={[0, 0.5, 0]}>
                 <torusKnotGeometry args={[0.8, 0.2, 128, 32]} />
                 <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} roughness={0.2} metalness={1} />
               </mesh>
               
               <mesh position={[-2, 0.5, -2]}>
                 <sphereGeometry args={[0.5, 32, 32]} />
                 <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
               </mesh>

               <mesh position={[2, 0.5, 2]}>
                 <boxGeometry args={[1, 1, 1]} />
                 <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
               </mesh>
             </group>
             
             {/* VFX Stack */}
             <EffectComposer multisampling={4}>
               {effects.find(e => e.type === 'Bloom' && e.enabled) && (
                 <Bloom 
                   intensity={effects.find(e => e.type === 'Bloom')?.params.intensity || 1}
                   luminanceThreshold={effects.find(e => e.type === 'Bloom')?.params.luminanceThreshold || 0.1}
                   luminanceSmoothing={effects.find(e => e.type === 'Bloom')?.params.luminanceSmoothing || 0.9}
                   mipmapBlur
                 />
               )}
               {effects.find(e => e.type === 'ChromaticAberration' && e.enabled) && (
                 <ChromaticAberration 
                   offset={new THREE.Vector2(
                     effects.find(e => e.type === 'ChromaticAberration')?.params.offset[0] || 0.002, 
                     effects.find(e => e.type === 'ChromaticAberration')?.params.offset[1] || 0.002
                   )}
                 />
               )}
               {effects.find(e => e.type === 'Vignette' && e.enabled) && (
                 <Vignette 
                   eskil={false} 
                   offset={effects.find(e => e.type === 'Vignette')?.params.offset || 0.1} 
                   darkness={effects.find(e => e.type === 'Vignette')?.params.darkness || 1.1} 
                 />
               )}
               {effects.find(e => e.type === 'DepthOfField' && e.enabled) && (
                 <DepthOfField 
                   focusDistance={0} 
                   focalLength={0.02} 
                   bokehScale={2} 
                   height={480} 
                 />
               )}
               {effects.find(e => e.type === 'Noise' && e.enabled) && (
                 <Noise opacity={0.2} />
               )}
             </EffectComposer>

          </Canvas>
        </div>

        {/* Right Panel: Inspector */}
        <div className="w-80 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.5)]">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-2"><Settings size={14}/> Properties</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
             
             {selectedEffect ? (
               <div className="space-y-4">
                 
                 <div className="bg-[#1a1a1c] p-3 rounded border border-[#3e3e42] flex items-center justify-between">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2">
                     {getEffectIcon(effects.find(e => e.id === selectedEffect)?.type || '')}
                     {effects.find(e => e.id === selectedEffect)?.type}
                   </h3>
                   <div className="flex items-center gap-2 text-[10px] text-gray-400">
                     Enable <input type="checkbox" checked={effects.find(e => e.id === selectedEffect)?.enabled} onChange={() => toggleEffect(selectedEffect)} className="accent-blue-500" />
                   </div>
                 </div>

                 {/* Dynamic Properties based on type */}
                 <div className="space-y-4">
                   <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Parameters</h4>
                   
                   {effects.find(e => e.id === selectedEffect)?.type === 'Bloom' && (
                     <>
                       <div className="flex flex-col gap-1">
                         <div className="flex justify-between items-center text-[10px] text-gray-400">
                           <span>Intensity</span>
                           <span className="font-mono bg-black px-1 rounded">{effects.find(e => e.id === selectedEffect)?.params.intensity}</span>
                         </div>
                         <input type="range" min="0" max="5" step="0.1" value={effects.find(e => e.id === selectedEffect)?.params.intensity} onChange={(e) => updateEffectParam(selectedEffect, 'intensity', Number(e.target.value))} className="accent-blue-500" />
                       </div>
                       <div className="flex flex-col gap-1">
                         <div className="flex justify-between items-center text-[10px] text-gray-400">
                           <span>Luminance Threshold</span>
                           <span className="font-mono bg-black px-1 rounded">{effects.find(e => e.id === selectedEffect)?.params.luminanceThreshold}</span>
                         </div>
                         <input type="range" min="0" max="1" step="0.05" value={effects.find(e => e.id === selectedEffect)?.params.luminanceThreshold} onChange={(e) => updateEffectParam(selectedEffect, 'luminanceThreshold', Number(e.target.value))} className="accent-blue-500" />
                       </div>
                     </>
                   )}

                   {effects.find(e => e.id === selectedEffect)?.type === 'ChromaticAberration' && (
                     <>
                       <div className="flex flex-col gap-2">
                         <span className="text-[10px] text-gray-400">Offset (X, Y)</span>
                         <div className="flex gap-2">
                           <input type="number" step="0.001" value={effects.find(e => e.id === selectedEffect)?.params.offset[0]} onChange={(e) => updateEffectParam(selectedEffect, 'offset', [Number(e.target.value), effects.find(e => e.id === selectedEffect)?.params.offset[1]])} className="w-1/2 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-center focus:border-blue-500"/>
                           <input type="number" step="0.001" value={effects.find(e => e.id === selectedEffect)?.params.offset[1]} onChange={(e) => updateEffectParam(selectedEffect, 'offset', [effects.find(e => e.id === selectedEffect)?.params.offset[0], Number(e.target.value)])} className="w-1/2 bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1 outline-none text-center focus:border-blue-500"/>
                         </div>
                       </div>
                     </>
                   )}

                   {effects.find(e => e.id === selectedEffect)?.type === 'Vignette' && (
                     <>
                       <div className="flex flex-col gap-1">
                         <div className="flex justify-between items-center text-[10px] text-gray-400">
                           <span>Offset</span>
                           <span className="font-mono bg-black px-1 rounded">{effects.find(e => e.id === selectedEffect)?.params.offset}</span>
                         </div>
                         <input type="range" min="0" max="1" step="0.05" value={effects.find(e => e.id === selectedEffect)?.params.offset} onChange={(e) => updateEffectParam(selectedEffect, 'offset', Number(e.target.value))} className="accent-blue-500" />
                       </div>
                       <div className="flex flex-col gap-1">
                         <div className="flex justify-between items-center text-[10px] text-gray-400">
                           <span>Darkness</span>
                           <span className="font-mono bg-black px-1 rounded">{effects.find(e => e.id === selectedEffect)?.params.darkness}</span>
                         </div>
                         <input type="range" min="0" max="3" step="0.1" value={effects.find(e => e.id === selectedEffect)?.params.darkness} onChange={(e) => updateEffectParam(selectedEffect, 'darkness', Number(e.target.value))} className="accent-blue-500" />
                       </div>
                     </>
                   )}
                 </div>

               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2 opacity-50 pt-20">
                 <Sliders size={24} />
                 <span className="text-xs text-center">Select an effect in the stack to edit</span>
               </div>
             )}

           </div>
        </div>
      </div>
      
    </div>
  );
}
// Note: We're mocking a Circle icon if it doesn't exist.
const Circle = ({size, className}:any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle></svg>;
