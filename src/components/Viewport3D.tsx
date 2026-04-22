import React, { useState, useRef, useEffect } from 'react';
import { MousePointer2, Move, RotateCcw, Maximize, SlidersHorizontal, Eye, X, Image as ImageIcon, ChevronDown } from 'lucide-react';

interface Viewport3DProps {
  activeTool: string;
  activeFile: { name: string; content: string } | undefined;
}

export default function Viewport3D({ activeTool, activeFile }: Viewport3DProps) {
  
  // Sky Environment
  const [skybox, setSkybox] = useState('Default (Dark)');
  const [showSkyboxMenu, setShowSkyboxMenu] = useState(false);

  // Object and Transform State
  const [isObjectSelected, setIsObjectSelected] = useState(true);
  const [activeTransformTool, setActiveTransformTool] = useState<'select' | 'translate' | 'rotate' | 'scale'>('translate');
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
  
  const [ppBloom, setPpBloom] = useState(true);
  const [bloomIntensity, setBloomIntensity] = useState(1.5);
  
  const [ppColor, setPpColor] = useState(true);
  const [colorContrast, setColorContrast] = useState(110);
  const [colorSaturation, setColorSaturation] = useState(120);
  const [colorHue, setColorHue] = useState(0);

  const [ppDof, setPpDof] = useState(false);
  const [dofBlur, setDofBlur] = useState(4);

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
                <div className="absolute top-full mt-2 left-0 w-44 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl z-50 flex flex-col py-1 overflow-hidden">
                   <div className="px-3 py-2 text-[10px] text-[#8b949e] uppercase tracking-wider font-bold border-b border-[#30363d] mb-1">Environment Material</div>
                   {['Default (Dark)', 'Clear Day', 'Sunset', 'Sci-Fi Nebula', 'Studio Light'].map(s => (
                     <button key={s} onClick={() => { setSkybox(s); setShowSkyboxMenu(false); }} className={`text-left px-3 py-2 text-[12px] hover:bg-[#21262d] transition-colors ${skybox === s ? 'text-[#58a6ff] bg-[#21262d]/50' : 'text-[#c9d1d9]'}`}>
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
         </div>
         <div className="flex gap-4">
           <span className="text-[#3fb950] font-mono select-none">120 FPS</span>
           <span className="text-[#58a6ff] font-mono select-none hidden sm:inline">GPU: 42%</span>
         </div>
      </div>
      
      {/* 3D Render Area */}
      <div 
        className="flex-1 relative overflow-hidden transition-all duration-300"
        style={{ background: getSkyboxStyle(), filter: getSimulatedPostProcessing() }}
        onPointerDown={() => setIsObjectSelected(false)}
      >
         {/* Transform Tools Gizmo */}
         <div className="absolute top-4 right-4 bg-[#161b22] border border-[#30363d] rounded p-1 flex flex-col gap-1 shadow-2xl z-50">
            <button onClick={(e) => { e.stopPropagation(); setActiveTransformTool('select'); }} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'select' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Select"><MousePointer2 size={16}/></button>
            <button onClick={(e) => { e.stopPropagation(); setActiveTransformTool('translate'); }} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'translate' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Translate"><Move size={16}/></button>
            <button onClick={(e) => { e.stopPropagation(); setActiveTransformTool('rotate'); }} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'rotate' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Rotate"><RotateCcw size={16}/></button>
            <button onClick={(e) => { e.stopPropagation(); setActiveTransformTool('scale'); }} className={`p-1.5 rounded transition-colors ${activeTransformTool === 'scale' ? 'text-white bg-[#0d1117] shadow-inner' : 'text-[#8b949e] hover:text-white'}`} title="Scale"><Maximize size={16}/></button>
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
         <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none perspective-[800px]">
           <div 
             className={`w-32 h-32 bg-[#21262d] border border-[#30363d] relative flex items-center justify-center shadow-2xl cursor-pointer pointer-events-auto ${isObjectSelected ? 'ring-2 ring-[#e3b341]' : ''}`}
             style={{
               transformStyle: 'preserve-3d',
               transform: `translate3d(${objTransform.posX}px, ${objTransform.posY}px, 0) rotateX(${objTransform.rotX}deg) rotateY(${objTransform.rotY}deg) rotateZ(${objTransform.rotZ}deg) scale(${objTransform.scale})`,
             }}
             onPointerDown={(e) => { e.stopPropagation(); setIsObjectSelected(true); }}
           >
             <span className="text-[#c9d1d9] text-[10px] uppercase font-mono tracking-wider drop-shadow-md z-10 select-none">MOCK_OBJ</span>
             <div className="absolute inset-0 bg-[#58a6ff] opacity-10 rounded border border-[#58a6ff]/30 pointer-events-none"></div>
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

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
