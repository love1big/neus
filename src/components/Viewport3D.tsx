import React, { useState, useRef, useEffect } from 'react';
import { MousePointer2, Move, RotateCcw, Maximize, SlidersHorizontal, Eye, X, Image as ImageIcon, ChevronDown } from 'lucide-react';

interface Viewport3DProps {
  activeTool: string;
  activeFile: { name: string; content: string } | undefined;
}

export default function Viewport3D({ activeTool, activeFile }: Viewport3DProps) {
  
  // Sky Environment
  const [skybox, setSkybox] = useState(() => localStorage.getItem('skybox') || 'Default (Dark)');
  const [skyboxRotation, setSkyboxRotation] = useState(() => parseInt(localStorage.getItem('skyboxRotation') || '0'));
  const [skyboxIntensity, setSkyboxIntensity] = useState(() => parseFloat(localStorage.getItem('skyboxIntensity') || '1'));
  const [showSkyboxMenu, setShowSkyboxMenu] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('skybox', skybox);
    localStorage.setItem('skyboxRotation', skyboxRotation.toString());
    localStorage.setItem('skyboxIntensity', skyboxIntensity.toString());
  }, [skybox, skyboxRotation, skyboxIntensity]);

  // Target Tool states
  const [aiTestingMode, setAiTestingMode] = useState(false);
  const [aiTestLogs, setAiTestLogs] = useState<{action: string, result: string, type: 'info'|'warn'|'error'}[]>([]);
  const [aiTestingPhase, setAiTestingPhase] = useState('Idle');

  // Object and Transform State
  const [isObjectSelected, setIsObjectSelected] = useState(true);
  const [activeTransformTool, setActiveTransformTool] = useState<'select' | 'translate' | 'rotate' | 'scale' | 'physics'>('translate');
  const [objTransform, setObjTransform] = useState({ posX: 0, posY: 0, rotX: 65, rotY: 0, rotZ: 45, scale: 1 });
  
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startObj: objTransform, axis: '' });

  const handlePointerDown = (e: React.PointerEvent, axis: string) => {
    e.stopPropagation();
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startObj: { ...objTransform },
      axis
    };
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragRef.current.isDragging) return;
    const { startX, startY, startObj, axis } = dragRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    setObjTransform(prev => {
      let next = { ...prev };
      if (activeTransformTool === 'translate') {
        if (axis === 'x') next.posX = startObj.posX + dx;
        if (axis === 'y') next.posY = startObj.posY + dy;
        if (axis === 'z') { next.posX = startObj.posX + dx; next.posY = startObj.posY - dy; }
      } else if (activeTransformTool === 'rotate') {
        if (axis === 'x') next.rotX = startObj.rotX - dy;
        if (axis === 'y') next.rotY = startObj.rotY + dx;
        if (axis === 'z') next.rotZ = startObj.rotZ + dx;
      } else if (activeTransformTool === 'scale') {
        const dScale = (dx - dy) * 0.01;
        const newScale = Math.max(0.1, startObj.scale + dScale);
        if (axis === 'all') next.scale = newScale;
        // Simplified for UI representation
      }
      return next;
    });
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };

  // Clean up listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (aiTestingMode) {
      setAiTestingPhase('Initializing Advanced Threat Simulation...');
      setAiTestLogs([{ action: 'Boot Agent', result: 'AI Hacking & QA Module Attached to Viewport', type: 'info' }]);
      
      let step = 0;
      interval = setInterval(() => {
        step++;
        setObjTransform(prev => ({
          ...prev,
          posX: prev.posX + (Math.random() * 40 - 20),
          posY: prev.posY + (Math.random() * 40 - 20),
          rotZ: prev.rotZ + (Math.random() * 10 - 5)
        }));

        if (step === 2) {
           setAiTestingPhase('Fuzzing Physics Boundaries & OOB');
           setAiTestLogs(prev => [...prev, { action: 'Bounds Check', result: 'Left wall collision nominal. Velocity within safe limits.', type: 'info' }]);
        } else if (step === 4) {
           setAiTestLogs(prev => [...prev, { action: 'NavMesh Exploit', result: 'VULNERABILITY: Map clipping exploit detected at [X: 120, Y: -45].', type: 'error' }]);
        } else if (step === 6) {
           setAiTestingPhase('Packet & Memory Injection Simulation');
           setAiTestLogs(prev => [...prev, { action: 'Memory Inj.', result: 'Attempting to inject rogue packets into replicated state...', type: 'warn' }]);
        } else if (step === 8) {
           setAiTestLogs(prev => [...prev, { action: 'Net Exploit', result: 'CRITICAL VULNERABILITY: Server accepts negative values for health state! (Invincibility Exploit)', type: 'error' }]);
        } else if (step === 10) {
           setAiTestingPhase('Autonomous Patching Process');
           setAiTestLogs(prev => [...prev, { action: 'Synthesizing Patch', result: 'Drafting logic to seal network gaps and solidify geometry...', type: 'info' }]);
        } else if (step === 12) {
           setAiTestLogs(prev => [...prev, { action: 'Patch Applied', result: 'Physics Update: Continuous Collision Detection (CCD) enabled.', type: 'info' }]);
        } else if (step === 14) {
           setAiTestLogs(prev => [...prev, { action: 'Patch Applied', result: 'Netcode Update: Strict schema bound added to `ApplyDamage()` RPC.', type: 'info' }]);
        } else if (step === 16) {
           setAiTestingPhase('Verifying Fixes (Regression Test)');
           setAiTestLogs(prev => [...prev, { action: 'Regression', result: 'Re-running exploitation vectors to confirm closure...', type: 'info' }]);
        } else if (step === 18) {
           setAiTestLogs(prev => [...prev, { action: 'Status', result: 'All vulnerabilities mitigated successfully. Network is sealed.', type: 'info' }]);
           setAiTestingPhase('Audit Complete \u2714\uFE0F');
        } else if (step > 21) {
           setAiTestingPhase('Idle');
           setAiTestingMode(false);
        }
      }, 1000);
    } else {
       if (aiTestingPhase !== 'Idle') {
         setAiTestingPhase('Idle');
       }
    }
    return () => clearInterval(interval);
  }, [aiTestingMode]);

  const getSkyboxStyle = () => {
    switch(skybox) {
      case 'Clear Day': return 'linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%)';
      case 'Sunset': return 'linear-gradient(to bottom, #fa709a 0%, #fee140 100%)';
      case 'Sci-Fi Nebula': return 'radial-gradient(ellipse at top, #2b1055 0%, #0b0410 80%, #000000 100%)';
      case 'Studio Light': return 'radial-gradient(circle at center, #666666 0%, #222222 100%)';
      case 'Default (Dark)':
      default: return 'linear-gradient(to bottom, #21262d 0%, #0d1117 100%)';
    }
  };

  // Post Processing States
  const [showPP, setShowPP] = useState(false);
  
  const [ppBloom, setPpBloom] = useState(() => JSON.parse(localStorage.getItem('ppBloom') || 'true'));
  const [bloomIntensity, setBloomIntensity] = useState(() => parseFloat(localStorage.getItem('bloomIntensity') || '1.5'));
  
  const [ppColor, setPpColor] = useState(() => JSON.parse(localStorage.getItem('ppColor') || 'true'));
  const [colorContrast, setColorContrast] = useState(() => parseInt(localStorage.getItem('colorContrast') || '110'));
  const [colorSaturation, setColorSaturation] = useState(() => parseInt(localStorage.getItem('colorSaturation') || '120'));
  const [colorHue, setColorHue] = useState(() => parseInt(localStorage.getItem('colorHue') || '0'));

  const [ppDof, setPpDof] = useState(() => JSON.parse(localStorage.getItem('ppDof') || 'false'));
  const [dofBlur, setDofBlur] = useState(() => parseFloat(localStorage.getItem('dofBlur') || '4'));

  useEffect(() => {
    localStorage.setItem('ppBloom', JSON.stringify(ppBloom));
    localStorage.setItem('bloomIntensity', bloomIntensity.toString());
    localStorage.setItem('ppColor', JSON.stringify(ppColor));
    localStorage.setItem('colorContrast', colorContrast.toString());
    localStorage.setItem('colorSaturation', colorSaturation.toString());
    localStorage.setItem('colorHue', colorHue.toString());
    localStorage.setItem('ppDof', JSON.stringify(ppDof));
    localStorage.setItem('dofBlur', dofBlur.toString());
  }, [ppBloom, bloomIntensity, ppColor, colorContrast, colorSaturation, colorHue, ppDof, dofBlur]);

  // Physics Simulation
  const velocityRef = useRef({ vx: 0, vy: 0, vz: 0 });

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const updatePhysics = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (activeTransformTool === 'physics' && !dragRef.current.isDragging && !aiTestingMode) {
        setObjTransform(prev => {
          let { posX, posY, rotX, rotY, rotZ, scale } = prev;
          let { vx, vy, vz } = velocityRef.current;

          // Apply Gravity (downward in our pseudo-3D is positive Y)
          vy += 980 * dt; // Gravity

          posX += vx * dt;
          posY += vy * dt;

          // Floor collision (floor is roughly at Y=150)
          const floorY = 150;
          if (posY > floorY) {
            posY = floorY;
            vy = -vy * 0.6; // Bounce and dampen
            vx = vx * 0.8;  // Friction
            
            // Random spin on bounce
            if (Math.abs(vy) > 10) {
                rotX += vx * dt * 10;
                rotY += vy * dt * 5;
            }
          }

          // Ceiling bounds
          if (posY < -300) {
              posY = -300;
              vy = -vy * 0.5;
          }

          // Horizontal bounds
          if (posX > 400) { posX = 400; vx = -vx * 0.7; }
          if (posX < -400) { posX = -400; vx = -vx * 0.7; }

          velocityRef.current = { vx, vy, vz };
          return { posX, posY, rotX, rotY, rotZ, scale };
        });
      }
      animationFrameId = requestAnimationFrame(updatePhysics);
    };
    
    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeTransformTool, aiTestingMode]);

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

  // Generate CSS filters for the post processing stack
  const getSimulatedPostProcessing = () => {
    let filters = [];
    
    if (ppColor) {
      filters.push(`contrast(${colorContrast}%)`);
      filters.push(`saturate(${colorSaturation}%)`);
      if (colorHue !== 0) filters.push(`hue-rotate(${colorHue}deg)`);
    }
    
    if (ppBloom) {
      // Very basic bloom simulation via brightening
      filters.push(`drop-shadow(0 0 ${bloomIntensity * 10}px rgba(88,166,255,${minMax(bloomIntensity/5, 0, 1)}))`);
      filters.push(`brightness(${100 + (bloomIntensity * 15)}%)`);
    }

    if (ppDof) {
      filters.push(`blur(${dofBlur}px)`);
    }

    return filters.join(' ');
  };

  const minMax = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  return (
    <div className="w-full h-full bg-[#1e1e1e] relative overflow-hidden flex flex-col font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Viewport Top Bar */}
      <div className="h-8 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between text-[11px] text-[#8b949e] shrink-0 font-medium tracking-wide">
         <div className="flex items-center gap-4">
           <span className="hover:text-white cursor-pointer select-none transition-colors">Perspective</span>
           <span className="hover:text-[#e3b341] cursor-pointer select-none transition-colors">Lit</span>
           <span className="hover:text-white cursor-pointer select-none transition-colors">Show</span>
           
           <div className="w-[1px] h-4 bg-[#30363d]"></div>
           
           {/* Skybox Selector */}
           <div className="relative">
             <button onClick={() => setShowSkyboxMenu(!showSkyboxMenu)} className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${showSkyboxMenu ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9]'}`} title="Environment settings">
               <ImageIcon size={12} /> {skybox} <ChevronDown size={10} />
             </button>
             {showSkyboxMenu && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl z-50 flex flex-col py-1 overflow-hidden">
                   <div className="px-3 py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-bold border-b border-[#30363d] mb-1">Environment Material</div>
                   {['Default (Dark)', 'Clear Day', 'Sunset', 'Sci-Fi Nebula', 'Studio Light'].map(s => (
                     <button key={s} onClick={() => setSkybox(s)} className={`text-left px-3 py-1.5 text-[12px] hover:bg-[#21262d] transition-colors ${skybox === s ? 'text-[#58a6ff] bg-[#21262d]/50' : 'text-[#c9d1d9]'}`}>
                       {s}
                     </button>
                   ))}
                   
                   <div className="border-t border-[#30363d] mt-1 pt-2 px-3 pb-3 flex flex-col gap-3">
                     <div className="flex flex-col gap-1.5">
                       <div className="flex justify-between text-[10px] text-[#8b949e]">
                          <span>Intensity</span>
                          <span>{skyboxIntensity.toFixed(1)}</span>
                       </div>
                       <input type="range" min="0" max="2" step="0.1" value={skyboxIntensity} onChange={(e) => setSkyboxIntensity(parseFloat(e.target.value))} className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-[#58a6ff]" />
                     </div>
                     <div className="flex flex-col gap-1.5">
                       <div className="flex justify-between text-[10px] text-[#8b949e]">
                          <span>Rotation</span>
                          <span>{skyboxRotation}°</span>
                       </div>
                       <input type="range" min="0" max="360" step="1" value={skyboxRotation} onChange={(e) => setSkyboxRotation(parseInt(e.target.value))} className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-[#58a6ff]" />
                     </div>
                   </div>
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

           <div className="w-[1px] h-4 bg-[#30363d]"></div>
           
           <button 
             onClick={() => setAiTestingMode(!aiTestingMode)} 
             className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors font-bold ${aiTestingMode ? 'bg-[#f85149]/20 text-[#f85149]' : 'hover:bg-[#f85149]/10 text-[#c9d1d9] hover:text-[#f85149]'}`}
             title="Run AI Offline Tests on this Viewport"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             AI Playtest
           </button>
         </div>
         <div className="flex gap-4">
           <span className="text-[#3fb950] font-mono select-none">120 FPS</span>
           <span className="text-[#58a6ff] font-mono select-none hidden sm:inline">GPU: 42%</span>
         </div>
      </div>
      
      {/* 3D Render Area */}
      <div 
        className="flex-1 relative overflow-hidden transition-all duration-300 bg-black"
        style={{ filter: getSimulatedPostProcessing() }}
        onPointerDown={() => setIsObjectSelected(false)}
      >
         {/* Skybox Background Layer */}
         <div 
           className="absolute pointer-events-none transition-all duration-300"
           style={{ 
             top: '-50%', left: '-50%', width: '200%', height: '200%',
             background: getSkyboxStyle(),
             transform: `rotate(${skyboxRotation}deg)`,
             filter: `brightness(${skyboxIntensity})`,
             zIndex: 0
           }}
         />

         {/* Transform Tools Gizmo */}
         <div className="absolute top-4 right-4 bg-[#161b22] border border-[#30363d] rounded p-1 flex flex-col gap-1 shadow-2xl z-50">
            <button onClick={(e) => { e.stopPropagation(); setActiveTransformTool('select'); }} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'select' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Select"><MousePointer2 size={16}/></button>
            <button onClick={(e) => { e.stopPropagation(); setActiveTransformTool('translate'); }} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'translate' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Translate"><Move size={16}/></button>
            <button onClick={(e) => { e.stopPropagation(); setActiveTransformTool('rotate'); }} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'rotate' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Rotate"><RotateCcw size={16}/></button>
            <button onClick={(e) => { e.stopPropagation(); setActiveTransformTool('scale'); }} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'scale' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Scale"><Maximize size={16}/></button>
            <div className="w-full h-[1px] bg-[#30363d] my-1"></div>
            <button onClick={(e) => { e.stopPropagation(); setActiveTransformTool('physics'); }} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'physics' ? 'text-[#3fb950] bg-[#3fb950]/10 shadow-inner' : 'text-[#8b949e] hover:text-[#3fb950]'}`} title="Simulate Physics">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </button>
         </div>

         {/* 3D Grid Floor Mock via CSS Perspective */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.12] z-0 transition-all duration-300" 
              style={{
                backgroundImage: 'linear-gradient(#58a6ff 2px, transparent 2px), linear-gradient(90deg, #58a6ff 2px, transparent 2px)',
                backgroundSize: '50px 50px',
                transform: 'perspective(600px) rotateX(65deg) translateY(-50px) scale(3)',
                transformOrigin: 'top center'
              }}>
         </div>

         {/* World Axis Mock (Bottom Left) */}
         <div className="absolute bottom-6 left-6 flex flex-col gap-0 items-center z-20 opacity-80 scale-75 transform origin-bottom-left pointer-events-none">
           <div className="w-[3px] h-10 bg-[#3fb950] relative">
             <div className="absolute -top-3 -left-1 text-[10px] font-bold text-[#3fb950]">Z</div>
           </div>
           <div className="flex items-center -ml-2 -mt-1 relative">
             <div className="w-[3px] h-10 bg-[#f85149] rotate-90 origin-bottom relative">
               <div className="absolute -bottom-4 -left-1 text-[10px] font-bold text-[#f85149] -rotate-90">Y</div>
             </div>
             <div className="w-[3px] h-10 bg-[#58a6ff] rotate-[225deg] origin-bottom absolute bottom-0 left-0">
                <div className="absolute -bottom-4 -left-2 text-[10px] font-bold text-[#58a6ff] -rotate-[225deg]">X</div>
             </div>
             <div className="w-3 h-3 rounded-full bg-white absolute -bottom-1.5 -left-1.5 z-10 shadow-lg"></div>
           </div>
         </div>
         
         {/* Center Subject Content / Interactive Object */}
         <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none perspective-[1200px]">
           <div 
             className={`w-48 h-48 relative flex items-center justify-center cursor-pointer pointer-events-auto group ${isObjectSelected ? 'ring-0' : ''}`}
             style={{
               transformStyle: 'preserve-3d',
               transform: `translate3d(${objTransform.posX}px, ${objTransform.posY}px, 0) rotateX(${objTransform.rotX}deg) rotateY(${objTransform.rotY}deg) rotateZ(${objTransform.rotZ}deg) scale(${objTransform.scale})`,
             }}
             onPointerDown={(e) => { e.stopPropagation(); setIsObjectSelected(true); }}
           >
             {/* Quantum/Neural Mesh representation */}
             <div className="absolute inset-0 border border-[#58a6ff]/30 rounded-full animate-[spin_10s_linear_infinite]" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(75deg)' }}></div>
             <div className="absolute inset-0 border border-[#bc8cff]/30 rounded-full animate-[spin_8s_linear_infinite_reverse]" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(75deg)' }}></div>
             <div className="absolute inset-0 border border-[#3fb950]/30 rounded-full animate-[spin_12s_linear_infinite]" style={{ transformStyle: 'preserve-3d', transform: 'rotateZ(75deg)' }}></div>
             
             {/* Inner Core */}
             <div className="w-16 h-16 bg-[radial-gradient(circle_at_center,#ffffff_0%,#a476ed_40%,#161b22_100%)] rounded-full absolute shadow-[0_0_40px_rgba(164,118,237,0.8)] animate-pulse" style={{ transformStyle: 'preserve-3d', transform: `rotateX(${-objTransform.rotX}deg) rotateY(${-objTransform.rotY}deg) rotateZ(${-objTransform.rotZ}deg)` }}></div>
             
             {/* Holographic shell */}
             <div className="w-48 h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iIzU4YTZmZiIvPjwvc3ZnPg==')] opacity-30 animate-pulse absolute mix-blend-screen" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', transform: 'translateZ(20px)' }}></div>
             <div className="w-48 h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iI2JjOGNmZiIvPjwvc3ZnPg==')] opacity-30 animate-[pulse_3s_ease-in-out_infinite] absolute mix-blend-screen" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', transform: 'translateZ(-20px) rotate(30deg)' }}></div>

             <div className="absolute inset-x-0 bottom-[-4rem] text-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: `rotateX(${-objTransform.rotX}deg) rotateY(${-objTransform.rotY}deg) rotateZ(${-objTransform.rotZ}deg)` }}>
                <span className="bg-[#0a0a0a]/80 backdrop-blur border border-[#30363d] px-3 py-1 rounded text-[#c9d1d9] text-[10px] font-mono tracking-widest shadow-lg">NX_QUANTUM_ACTOR_01</span>
             </div>

             {/* Gizmos */}
             {isObjectSelected && activeTransformTool === 'translate' && (
               <div className="absolute inset-0 m-auto w-0 h-0 flex items-center justify-center z-50">
                 <div className="absolute w-24 h-1.5 bg-[#f85149] right-[-6rem] cursor-pointer hover:bg-[#ff7b72] flex justify-end items-center shadow-lg" style={{ transform: 'translateX(3rem)', zIndex: 100 }} onPointerDown={(e) => handlePointerDown(e, 'x')}>
                   <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-[#f85149] border-b-[8px] border-b-transparent absolute -right-3 pointer-events-none"></div>
                 </div>
                 <div className="absolute w-1.5 h-24 bg-[#3fb950] top-[-6rem] cursor-pointer hover:bg-[#2ea043] flex items-start justify-center shadow-lg" style={{ transform: 'translateY(-3rem)', zIndex: 100 }} onPointerDown={(e) => handlePointerDown(e, 'y')}>
                   <div className="w-0 h-0 border-l-[8px] border-l-transparent border-b-[12px] border-b-[#3fb950] border-r-[8px] border-r-transparent absolute -top-3 pointer-events-none"></div>
                 </div>
                 <div className="absolute w-1.5 h-24 bg-[#58a6ff] cursor-pointer hover:bg-[#79c0ff] origin-bottom scale-75 shadow-lg" style={{ transform: 'translateZ(-2rem) translateY(3rem) rotateX(45deg) rotateZ(45deg)', zIndex: 90 }} onPointerDown={(e) => handlePointerDown(e, 'z')}>
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-t-[12px] border-t-[#58a6ff] border-r-[8px] border-r-transparent absolute -bottom-3 -left-1.5 pointer-events-none"></div>
                 </div>
                 <div className="w-4 h-4 bg-white rounded-sm absolute shadow-md"></div>
               </div>
             )}

             {isObjectSelected && activeTransformTool === 'rotate' && (
               <div className="absolute inset-0 m-auto w-0 h-0 flex items-center justify-center z-50">
                 <div className="absolute w-40 h-40 border-[4px] border-[#f85149] rounded-full cursor-pointer hover:border-[#ff7b72] opacity-80" style={{ transform: 'rotateY(90deg)' }} onPointerDown={(e) => handlePointerDown(e, 'x')}></div>
                 <div className="absolute w-40 h-40 border-[4px] border-[#3fb950] rounded-full cursor-pointer hover:border-[#2ea043] opacity-80" style={{ transform: 'rotateX(90deg)' }} onPointerDown={(e) => handlePointerDown(e, 'y')}></div>
                 <div className="absolute w-40 h-40 border-[4px] border-[#58a6ff] rounded-full cursor-pointer hover:border-[#79c0ff] opacity-80" style={{ transform: 'rotateZ(0deg)' }} onPointerDown={(e) => handlePointerDown(e, 'z')}></div>
               </div>
             )}

             {isObjectSelected && activeTransformTool === 'scale' && (
               <div className="absolute inset-0 m-auto w-0 h-0 flex items-center justify-center z-50">
                 <div className="absolute w-24 h-1.5 bg-[#e3b341] right-[-6rem] cursor-pointer hover:bg-[#f2cc60] shadow-lg" style={{ transform: 'translateX(3rem)', zIndex: 100 }} onPointerDown={(e) => handlePointerDown(e, 'all')}>
                    <div className="w-4 h-4 bg-[#e3b341] absolute -right-2 -top-1 pointer-events-none shadow-sm"></div>
                 </div>
                 <div className="absolute w-1.5 h-24 bg-[#e3b341] top-[-6rem] cursor-pointer hover:bg-[#f2cc60] shadow-lg" style={{ transform: 'translateY(-3rem)', zIndex: 100 }} onPointerDown={(e) => handlePointerDown(e, 'all')}>
                    <div className="w-4 h-4 bg-[#e3b341] absolute -top-2 -left-1 pointer-events-none shadow-sm"></div>
                 </div>
                 <div className="w-5 h-5 bg-white rounded-sm absolute shadow-md cursor-pointer hover:bg-[#f2cc60]" style={{ zIndex: 110 }} onPointerDown={(e) => handlePointerDown(e, 'all')}></div>
               </div>
             )}
           </div>
         </div>

         {/* Center Subject Content */}
         <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10 pointer-events-none px-4 text-center">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest drop-shadow-[0_0_15px_rgba(0,0,0,1)] uppercase">
              {getToolDisplayName()}
            </h1>
            <p className="text-[#c9d1d9] mt-3 font-mono text-[11px] md:text-sm max-w-md bg-[#0d1117]/80 p-3 rounded-lg backdrop-blur-md border border-[#30363d] shadow-2xl">
              <span className="text-[#8b949e]">Target Edit:</span> {activeFile?.name || 'Unsaved_Map.map'}
              <br/><br/>
              <span className="text-[#3fb950] flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#3fb950] rounded-full animate-pulse"></span>
                Real-Time Rasterizer Active
              </span>
            </p>
         </div>

         {/* Target Content: AI Offline Playtesting Overlay */}
         {aiTestingMode && (
           <div className="absolute inset-x-4 bottom-4 top-auto md:top-4 md:bottom-auto md:right-4 md:left-auto md:w-80 pointer-events-none z-50">
             <div className="bg-[#111]/90 backdrop-blur-xl border border-[#f85149]/30 rounded shadow-[0_0_20px_rgba(248,81,73,0.15)] flex flex-col pointer-events-auto">
                <div className="bg-[#f85149]/20 px-3 py-2 border-b border-[#f85149]/30 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <span className="relative flex h-2.5 w-2.5">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f85149] opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f85149]"></span>
                     </span>
                     <span className="text-[#f85149] font-bold text-[10px] tracking-widest uppercase">AI Playtesting Active</span>
                   </div>
                   <button onClick={() => setAiTestingMode(false)} className="text-[#888] hover:text-[#fff]"><X size={14}/></button>
                </div>
                <div className="p-3">
                   <div className="mb-3 border-b border-[#333] pb-2">
                      <span className="text-[#888] text-[9px] uppercase tracking-wide">Current Phase</span>
                      <div className="text-[#fff] font-mono text-xs mt-0.5">{aiTestingPhase}</div>
                   </div>
                   <div className="flex flex-col gap-1.5 h-48 overflow-y-auto pr-1 font-mono text-[10px] mt-1">
                      {aiTestLogs.map((log, i) => (
                         <div key={i} className={`flex flex-col p-1.5 rounded border ${log.type === 'error' ? 'bg-[#f85149]/10 border-[#f85149]/30 text-[#ff7b72]' : log.type === 'warn' ? 'bg-[#e3b341]/10 border-[#e3b341]/30 text-[#f2cc60]' : 'bg-[#0a0a0a] border-[#333] text-[#ccc]'}`}>
                            <div className="font-bold border-b border-[#333]/50 pb-0.5 mb-0.5">[{log.action}]</div>
                            <div className="break-words">{log.result}</div>
                         </div>
                      ))}
                      {/* Anchor element to force scroll could go here if we had a ref */}
                   </div>
                </div>
             </div>
           </div>
         )}
      </div>

      {/* Post Processing Panel Overlay */}
      {showPP && (
        <div className="absolute left-6 top-14 w-72 bg-[#161b22]/95 border border-[#30363d] rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.8)] z-30 backdrop-blur-xl flex flex-col max-h-[calc(100%-80px)] overflow-hidden">
           
           <div className="flex items-center justify-between p-3 border-b border-[#30363d] bg-[#0d1117] shrink-0">
              <div className="flex items-center gap-2 text-[#c9d1d9] font-semibold text-[13px]">
                 <Eye size={16} className="text-[#ff7b72]"/> Post Process Volume
              </div>
              <button onClick={() => setShowPP(false)} className="text-[#8b949e] hover:text-[#c9d1d9]"><X size={16}/></button>
           </div>
           
           <div className="p-4 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              {/* BLOOM */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[12px] font-bold text-[#c9d1d9] tracking-wider uppercase">Bloom</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={ppBloom} onChange={() => setPpBloom(!ppBloom)} />
                    <div className="w-7 h-4 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#3fb950]"></div>
                  </label>
                </div>
                <div className={`flex flex-col gap-2 transition-opacity ${!ppBloom ? 'opacity-30 pointer-events-none' : ''}`}>
                   <div className="flex justify-between text-[11px] text-[#8b949e]">
                      <span>Intensity</span>
                      <span>{bloomIntensity.toFixed(1)}</span>
                   </div>
                   <input type="range" min="0" max="5" step="0.1" value={bloomIntensity} onChange={(e) => setBloomIntensity(parseFloat(e.target.value))} className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>

              <div className="h-[1px] w-full bg-[#30363d]"></div>

              {/* COLOR GRADING */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[12px] font-bold text-[#c9d1d9] tracking-wider uppercase">Color Grading</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={ppColor} onChange={() => setPpColor(!ppColor)} />
                    <div className="w-7 h-4 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#3fb950]"></div>
                  </label>
                </div>
                <div className={`flex flex-col gap-4 transition-opacity ${!ppColor ? 'opacity-30 pointer-events-none' : ''}`}>
                   <div className="flex flex-col gap-2">
                     <div className="flex justify-between text-[11px] text-[#8b949e]">
                        <span>Contrast</span><span>{colorContrast}%</span>
                     </div>
                     <input type="range" min="50" max="200" step="5" value={colorContrast} onChange={(e) => setColorContrast(parseInt(e.target.value))} className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <div className="flex justify-between text-[11px] text-[#8b949e]">
                        <span>Saturation</span><span>{colorSaturation}%</span>
                     </div>
                     <input type="range" min="0" max="300" step="10" value={colorSaturation} onChange={(e) => setColorSaturation(parseInt(e.target.value))} className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <div className="flex justify-between text-[11px] text-[#8b949e]">
                        <span>Color Temperature (Hue)</span><span>{colorHue}°</span>
                     </div>
                     <input type="range" min="-180" max="180" step="5" value={colorHue} onChange={(e) => setColorHue(parseInt(e.target.value))} className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" />
                   </div>
                </div>
              </div>

              <div className="h-[1px] w-full bg-[#30363d]"></div>

              {/* DEPTH OF FIELD */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[12px] font-bold text-[#c9d1d9] tracking-wider uppercase">Depth of Field</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={ppDof} onChange={() => setPpDof(!ppDof)} />
                    <div className="w-7 h-4 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#3fb950]"></div>
                  </label>
                </div>
                <div className={`flex flex-col gap-2 transition-opacity ${!ppDof ? 'opacity-30 pointer-events-none' : ''}`}>
                   <div className="flex justify-between text-[11px] text-[#8b949e]">
                      <span>Focal Blur</span>
                      <span>{dofBlur.toFixed(1)}px</span>
                   </div>
                   <input type="range" min="0" max="20" step="1" value={dofBlur} onChange={(e) => setDofBlur(parseFloat(e.target.value))} className="w-full h-1 bg-[#30363d] rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>

           </div>
        </div>
      )}
    </div>
  );
}
