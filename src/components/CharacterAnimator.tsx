import React, { useState } from 'react';
import { PersonStanding, Activity, Crosshair, Move, Play, RotateCcw, Box, Zap, ShieldAlert, Cpu } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import BasicSkeletonModel from './BasicSkeletonModel';

export default function CharacterAnimator() {
  const [animState, setAnimState] = useState<'Idle' | 'Walk' | 'Run' | 'Jump' | 'Attack' | 'HitReaction' | 'Death' | 'ElfWalk' | 'ElfAttack'>('Idle');
  const [blendWeight, setBlendWeight] = useState(1.0);
  const [showBones, setShowBones] = useState(true);

  const animations = [
    { id: 'Idle', icon: <PersonStanding size={14}/>, color: '#8b949e' },
    { id: 'Walk', icon: <Move size={14}/>, color: '#3fb950' },
    { id: 'Run', icon: <Activity size={14}/>, color: '#58a6ff' },
    { id: 'Jump', icon: <Play size={14} className="-rotate-90"/>, color: '#e3b341' },
    { id: 'Attack', icon: <Crosshair size={14}/>, color: '#f85149' },
    { id: 'HitReaction', icon: <ShieldAlert size={14}/>, color: '#bc8cff' },
    { id: 'ElfWalk', icon: <Move size={14}/>, color: '#10b981' },
    { id: 'ElfAttack', icon: <Crosshair size={14}/>, color: '#ef4444' },
  ] as const;

  return (
    <div className="h-full w-full flex bg-[#0a0a0a] text-white overflow-hidden">
      {/* Left Sidebar - Controls */}
      <div className="w-80 border-r border-[#30363d] bg-[#0d1117] flex flex-col">
        <div className="p-4 border-b border-[#30363d]">
          <h2 className="text-[14px] font-bold text-[#c9d1d9] flex items-center gap-2">
            <Cpu className="text-[#bc8cff]" size={16} />
            AI Animation Blender
          </h2>
          <p className="text-[10px] text-[#8b949e] mt-1 line-clamp-2">
            Procedurally blending generated animation states for the skeletal mesh using AI constraints.
          </p>
        </div>

        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Animation States */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider mb-2">States</div>
            <div className="grid grid-cols-2 gap-2">
              {animations.map((anim) => (
                <button
                  key={anim.id}
                  onClick={() => setAnimState(anim.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded border transition-all ${
                    animState === anim.id 
                      ? 'bg-[#1f6feb]/20 border-[#58a6ff] text-white shadow-[0_0_10px_rgba(88,166,255,0.2)]' 
                      : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:border-[#8b949e] hover:text-[#c9d1d9]'
                  }`}
                >
                  <div style={{ color: animState === anim.id ? anim.color : 'inherit' }}>{anim.icon}</div>
                  <span className="text-[10px] font-bold">{anim.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Blend Settings */}
          <div className="space-y-4">
            <div className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider mb-2 border-b border-[#30363d] pb-1">AI Blend Params</div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#c9d1d9]">IK Blend Weight</span>
                <span className="font-mono text-[#58a6ff]">{blendWeight.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0.1" max="2.0" step="0.1" 
                value={blendWeight} 
                onChange={(e) => setBlendWeight(parseFloat(e.target.value))}
                className="w-full accent-[#58a6ff]"
              />
              <p className="text-[9px] text-[#8b949e] italic leading-tight">High values make the transition snappier, low values slower and smoother.</p>
            </div>

            <div className="space-y-2 pt-4">
              <label className="flex items-center gap-2 text-[11px] text-[#c9d1d9] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showBones}
                  onChange={(e) => setShowBones(e.target.checked)}
                  className="accent-[#bc8cff]"
                /> 
                Show Debug Bones
              </label>
            </div>
            
          </div>
          
          {/* Timeline preview */}
          <div className="mt-auto space-y-2 bg-[#161b22] p-3 rounded border border-[#30363d]">
             <div className="text-[10px] font-bold text-[#c9d1d9] flex justify-between">
                <span>Current State:</span>
                <span className="text-[#3fb950] font-mono">{animState}</span>
             </div>
             <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden">
                <div className="h-full bg-[#3fb950] w-full animate-[progress_1s_linear_infinite]"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Right - Viewport */}
      <div className="flex-1 relative bg-[#0d1117]">
        <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>
          <color attach="background" args={['#0d1117']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          
          <BasicSkeletonModel isSimulating={true} animState={animState} blendWeight={blendWeight} />
          
          <Grid infiniteGrid fadeDistance={20} sectionColor="#30363d" cellColor="#161b22" />
          <OrbitControls makeDefault target={[0, 1, 0]} />
        </Canvas>
        
        {/* Helper overlay */}
        <div className="absolute top-4 right-4 bg-[#161b22]/80 backdrop-blur border border-[#30363d] p-3 rounded shadow-lg pointer-events-none">
           <h3 className="text-[11px] font-bold text-[#c9d1d9] mb-1">AI Action Feedback</h3>
           <div className="text-[10px] text-[#8b949e] flex flex-col gap-1 font-mono">
              <div><span className="text-[#58a6ff]">Input:</span> State change requested.</div>
              <div><span className="text-[#bc8cff]">Solver:</span> Calculating IK paths...</div>
              <div><span className="text-[#3fb950]">Status:</span> {animState} Playing</div>
           </div>
        </div>
      </div>
    </div>
  );
}
