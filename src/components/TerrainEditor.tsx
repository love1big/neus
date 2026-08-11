import React, { useState, useRef, useEffect, useMemo, ChangeEvent } from 'react';
import { Mountain, Plus, Search, Settings, Layers, Upload, Sliders, Image as ImageIcon, Box, Maximize, RotateCcw} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Component to render the terrain
const TerrainMesh = ({ 
  textureUrl, 
  displacementScale, 
  wireframe, 
  color, 
  segments 
}: { 
  textureUrl: string | null, 
  displacementScale: number, 
  wireframe: boolean, 
  color: string, 
  segments: number 
}) => {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const loader = new THREE.TextureLoader();
    return loader.load(textureUrl);
  }, [textureUrl]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} castShadow receiveShadow>
      <planeGeometry args={[10, 10, segments, segments]} />
      <meshStandardMaterial 
        ref={materialRef}
        color={color} 
        wireframe={wireframe}
        displacementMap={texture}
        displacementScale={texture ? displacementScale : 0}
        roughness={0.8}
        metalness={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default function TerrainEditor() {
  const [textureUrl, setTextureUrl] = useState<string | null>(null);
  const [displacementScale, setDisplacementScale] = useState<number>(2);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [segments, setSegments] = useState<number>(128);
  const [color, setColor] = useState<string>('#4caf50');
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    if (file.name.toLowerCase().endsWith('.raw')) {
        // Simple RAW reader assuming square 16-bit uint
        const reader = new FileReader();
        reader.onload = (event) => {
            const buffer = event.target?.result as ArrayBuffer;
            if (!buffer) return;
            const view = new Uint16Array(buffer);
            const size = Math.sqrt(view.length);
            
            // Create a canvas to convert RAW to an image for displacement
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            const imageData = ctx.createImageData(size, size);
            for (let i = 0; i < view.length; i++) {
                // Normalize 16-bit to 8-bit
                const val = Math.floor((view[i] / 65535) * 255);
                const idx = i * 4;
                imageData.data[idx] = val;     // R
                imageData.data[idx + 1] = val; // G
                imageData.data[idx + 2] = val; // B
                imageData.data[idx + 3] = 255; // A
            }
            ctx.putImageData(imageData, 0, 0);
            setTextureUrl(canvas.toDataURL());
        };
        reader.readAsArrayBuffer(file);
    } else {
        // Handle standard images (PNG, JPG)
        const url = URL.createObjectURL(file);
        setTextureUrl(url);
    }
  };

  return (
    <div className="flex w-full h-full bg-[#0a0a0f] text-gray-200 font-sans">
      {/* Sidebar Controls */}
      <div className="w-[320px] border-r border-[#2a2b3d] flex flex-col bg-[#141525]">
        <div className="p-4 border-b border-[#2a2b3d] flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <Mountain size={16} className="text-[#58a6ff]" />
              Terrain Editor
            </h2>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 hide-scrollbar">
          
          {/* Import Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
               <Upload size={14} /> Import Heightmap
            </h3>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#2a2b3d] border-dashed rounded-lg cursor-pointer bg-[#0d1117] hover:bg-[#1a1b26] hover:border-[#58a6ff] transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-8 h-8 mb-3 text-gray-500" />
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, or RAW (16-bit square)</p>
              </div>
              <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.raw" onChange={handleFileUpload} />
            </label>
            
            {fileName && (
              <div className="flex items-center gap-2 text-xs text-[#58a6ff] bg-[#58a6ff]/10 p-2 rounded border border-[#58a6ff]/20">
                <Layers size={14} />
                <span className="truncate">Loaded: {fileName}</span>
              </div>
            )}
          </div>

          <div className="h-px bg-[#2a2b3d] w-full"></div>

          {/* Terrain Properties */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
               <Sliders size={14} /> Terrain Properties
            </h3>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Height Scale</span>
                <span>{displacementScale.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="0.1"
                value={displacementScale} 
                onChange={(e) => setDisplacementScale(parseFloat(e.target.value))}
                className="w-full accent-[#58a6ff]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Mesh Resolution (Segments)</span>
                <span>{segments}x{segments}</span>
              </div>
              <input 
                type="range" 
                min="16" 
                max="512" 
                step="16"
                value={segments} 
                onChange={(e) => setSegments(parseInt(e.target.value))}
                className="w-full accent-[#58a6ff]"
              />
            </div>

            <div className="flex items-center justify-between">
               <span className="text-xs text-gray-300">Base Color</span>
               <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
               />
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer mt-2">
               <input 
                  type="checkbox" 
                  checked={wireframe}
                  onChange={(e) => setWireframe(e.target.checked)}
                  className="rounded bg-[#0d1117] border-[#2a2b3d] text-[#58a6ff] focus:ring-[#58a6ff]"
               />
               <span className="text-xs text-gray-300">Show Wireframe</span>
            </label>
          </div>
          
          <div className="h-px bg-[#2a2b3d] w-full"></div>

          <div className="flex flex-col gap-3">
             <button 
                onClick={() => {
                   setTextureUrl(null);
                   setFileName('');
                   setDisplacementScale(2);
                   setSegments(128);
                }}
                className="w-full py-2 bg-[#2a2b3d] hover:bg-[#30363d] text-white text-xs font-medium rounded flex items-center justify-center gap-2 transition-colors"
             >
                <RotateCcw size={14} /> Reset Terrain
             </button>
             
             <button className="w-full py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium rounded flex items-center justify-center gap-2 transition-colors">
                <Box size={14} /> Export Mesh (OBJ)
             </button>
          </div>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="flex-1 flex flex-col relative bg-[#050505]">
        
        {/* Viewport Toolbar */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
           <div className="bg-[#0d1117]/80 backdrop-blur border border-[#2a2b3d] rounded flex text-gray-400 p-1">
              <button className="p-1.5 hover:text-white hover:bg-[#2a2b3d] rounded" title="Maximize Viewport">
                 <Maximize size={14} />
              </button>
           </div>
        </div>

        <div className="absolute top-4 left-4 z-10">
           <div className="bg-[#0d1117]/80 backdrop-blur border border-[#2a2b3d] rounded px-3 py-1.5 flex flex-col gap-0.5 pointer-events-none">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Terrain Preview</span>
              <span className="text-xs text-gray-300 font-mono">
                 {textureUrl ? 'Heightmap Loaded' : 'Flat Plane'} | {segments * segments * 2} Tris
              </span>
           </div>
        </div>

        {/* 3D Canvas */}
        <div className="w-full h-full cursor-move">
           <Canvas camera={{ position: [0, 5, 10], fov: 45 }} shadows>
              <color attach="background" args={['#050505']} />
              
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[10, 20, 10]} 
                intensity={1} 
                castShadow 
                shadow-mapSize-width={2048} 
                shadow-mapSize-height={2048} 
              />
              <pointLight position={[-10, -10, -10]} intensity={0.2} />

              <TerrainMesh 
                 textureUrl={textureUrl}
                 displacementScale={displacementScale}
                 wireframe={wireframe}
                 color={color}
                 segments={segments}
              />

              <Grid infiniteGrid fadeDistance={40} sectionColor="#2a2b3d" cellColor="#141525" />
              <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.05} />
           </Canvas>
        </div>
      </div>
    </div>
  );
}
