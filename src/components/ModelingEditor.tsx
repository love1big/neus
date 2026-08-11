import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid, Environment, ContactShadows, PivotControls, useGLTF, Edges, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Box, Cylinder, Layers, Move, Rotate3d, Scale3d, 
  MousePointer2, Scissors, Wand2, Hammer, Paintbrush, 
  Image as ImageIcon, Eye, EyeOff, Plus, Trash2, 
  Download, Upload, Settings2, Save, Undo2, Redo2,
  Brush, Sun, Lightbulb, Palette, Camera, AlignCenter, Grid3x3, Maximize
} from 'lucide-react';

// Main Editor State
type EditorMode = 'select' | 'translate' | 'rotate' | 'scale' | 'sculpt' | 'paint' | 'uv';
type ObjectType = 'mesh' | 'light' | 'camera' | 'group';

interface SceneObject {
  id: string;
  name: string;
  type: ObjectType;
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  geometry?: 'box' | 'sphere' | 'cylinder' | 'plane' | 'torus';
  metalness?: number;
  roughness?: number;
}

const DEFAULT_SCENE: SceneObject[] = [
  { id: 'obj_1', name: 'Hero_Character_Base', type: 'mesh', visible: true, position: [0, 1, 0], rotation: [0, 0, 0], scale: [1, 2, 1], geometry: 'cylinder', color: '#8892b0', metalness: 0.2, roughness: 0.8 },
  { id: 'obj_2', name: 'Weapon_Sword', type: 'mesh', visible: true, position: [1.5, 1, 0], rotation: [0, 0, 0.5], scale: [0.2, 1.5, 0.1], geometry: 'box', color: '#c9d1d9', metalness: 0.9, roughness: 0.1 },
  { id: 'obj_3', name: 'Floor_Plane', type: 'mesh', visible: true, position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0], scale: [10, 10, 1], geometry: 'plane', color: '#161b22', metalness: 0.1, roughness: 0.9 },
  { id: 'light_1', name: 'Main_DirectionalLight', type: 'light', visible: true, position: [5, 10, 5], rotation: [0, 0, 0], scale: [1, 1, 1] },
];

export default function ModelingEditor() {
  const [mode, setMode] = useState<EditorMode>('select');
  const [objects, setObjects] = useState<SceneObject[]>(DEFAULT_SCENE);
  const [selectedId, setSelectedId] = useState<string | null>('obj_1');
  const [subMode, setSubMode] = useState<'vertex'|'edge'|'face'|'object'>('object');
  
  // Right Panel Tabs
  const [activeTab, setActiveTab] = useState<'properties'|'materials'|'uv'|'modifiers'>('properties');

  const selectedObj = objects.find(o => o.id === selectedId);

  const handleTransform = (id: string, prop: 'position'|'rotation'|'scale', value: [number, number, number]) => {
    setObjects(objs => objs.map(o => o.id === id ? { ...o, [prop]: value } : o));
  };

  const handleUpdate = (id: string, updates: Partial<SceneObject>) => {
    setObjects(objs => objs.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  return (
    <div className="w-full h-screen bg-[#0d1117] flex flex-col font-sans text-[#c9d1d9] overflow-hidden">
      
      {/* Top Menu Bar */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#58a6ff] font-bold">
            <Box size={18} />
            <span>ProMesh 3D Studio</span>
          </div>
          
          <div className="flex items-center gap-1 border-l border-[#30363d] pl-6">
            <MenuButton icon={<Save size={14} />} label="Save" />
            <MenuButton icon={<Undo2 size={14} />} label="Undo" />
            <MenuButton icon={<Redo2 size={14} />} label="Redo" />
            <div className="w-px h-4 bg-[#30363d] mx-2" />
            <MenuButton icon={<Upload size={14} />} label="Import" />
            <MenuButton icon={<Download size={14} />} label="Export" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#8b949e]">Verts: 24,592 | Faces: 48,110 | Tris: 48,110</span>
          <div className="h-6 w-px bg-[#30363d] mx-2" />
          <button className="bg-[#238636] hover:bg-[#2ea043] text-white text-[12px] font-bold px-4 py-1.5 rounded transition-colors">
            Render Preview
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Toolbar (Tools) */}
        <div className="w-14 border-r border-[#30363d] bg-[#161b22] flex flex-col items-center py-4 gap-2 shrink-0 z-20">
          <ToolButton active={mode === 'select'} onClick={() => setMode('select')} icon={<MousePointer2 size={18} />} tooltip="Select (Q)" />
          <ToolButton active={mode === 'translate'} onClick={() => setMode('translate')} icon={<Move size={18} />} tooltip="Translate (W)" />
          <ToolButton active={mode === 'rotate'} onClick={() => setMode('rotate')} icon={<Rotate3d size={18} />} tooltip="Rotate (E)" />
          <ToolButton active={mode === 'scale'} onClick={() => setMode('scale')} icon={<Scale3d size={18} />} tooltip="Scale (R)" />
          <div className="w-8 h-px bg-[#30363d] my-2" />
          <ToolButton active={mode === 'sculpt'} onClick={() => setMode('sculpt')} icon={<Hammer size={18} />} tooltip="Sculpt Mode" />
          <ToolButton active={mode === 'paint'} onClick={() => setMode('paint')} icon={<Paintbrush size={18} />} tooltip="Texture Paint" />
          <ToolButton active={mode === 'uv'} onClick={() => setMode('uv')} icon={<Grid3x3 size={18} />} tooltip="UV Editor" />
        </div>

        {/* Scene Hierarchy (Outliner) */}
        <div className="w-60 border-r border-[#30363d] bg-[#0d1117] flex flex-col shrink-0 z-20">
          <div className="h-10 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-3">
            <span className="text-[12px] font-bold">Scene Outliner</span>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-white"><Plus size={14} /></button>
              <button className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-white"><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {objects.map(obj => (
              <div 
                key={obj.id} 
                onClick={() => setSelectedId(obj.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-[12px] ${selectedId === obj.id ? 'bg-[#1f6feb]/20 text-[#58a6ff]' : 'hover:bg-[#161b22]'}`}
              >
                <button onClick={(e) => { e.stopPropagation(); handleUpdate(obj.id, { visible: !obj.visible }) }} className="text-[#8b949e] hover:text-white">
                  {obj.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                {obj.type === 'mesh' ? <Box size={12} className={selectedId === obj.id ? 'text-[#58a6ff]' : 'text-[#8b949e]'} /> : 
                 obj.type === 'light' ? <Sun size={12} className="text-[#d2a8ff]" /> : <Camera size={12} className="text-[#3fb950]" />}
                <span className="truncate">{obj.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main 3D Viewport */}
        <div className="flex-1 relative bg-[#000000]">
          {/* Viewport Overlay Controls */}
          <div className="absolute top-4 left-4 z-10 flex bg-[#161b22] rounded-md border border-[#30363d] p-1 shadow-lg">
            <button onClick={() => setSubMode('object')} className={`px-3 py-1 rounded text-[11px] font-bold ${subMode === 'object' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-white'}`}>Object</button>
            <button onClick={() => setSubMode('vertex')} className={`px-3 py-1 rounded text-[11px] font-bold ${subMode === 'vertex' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-white'}`}>Vertex</button>
            <button onClick={() => setSubMode('edge')} className={`px-3 py-1 rounded text-[11px] font-bold ${subMode === 'edge' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-white'}`}>Edge</button>
            <button onClick={() => setSubMode('face')} className={`px-3 py-1 rounded text-[11px] font-bold ${subMode === 'face' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-white'}`}>Face</button>
          </div>

          <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
            <color attach="background" args={['#0d1117']} />
            <fog attach="fog" args={['#0d1117', 10, 50]} />
            
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
            
            <Grid infiniteGrid fadeDistance={40} sectionColor="#30363d" cellColor="#161b22" />
            
            <Suspense fallback={null}>
              <Environment preset="city" />
              {objects.map(obj => {
                if (!obj.visible) return null;
                if (obj.type === 'mesh') {
                  return (
                    <MeshObject 
                      key={obj.id} 
                      obj={obj} 
                      isSelected={selectedId === obj.id} 
                       
                      onSelect={() => setSelectedId(obj.id)}
                      onTransform={(prop, val) => handleTransform(obj.id, prop, val)}
                    />
                  )
                }
                return null;
              })}
            </Suspense>
            
            <OrbitControls makeDefault />
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport axisColors={['#f85149', '#3fb950', '#58a6ff']} labelColor="white" />
            </GizmoHelper>
          </Canvas>
          
          {/* Overlay Panels based on Mode */}
          {mode === 'sculpt' && (
            <div className="absolute bottom-4 left-4 z-10 bg-[#161b22] border border-[#30363d] rounded p-4 shadow-xl w-64">
              <h3 className="text-[12px] font-bold mb-3 flex items-center gap-2"><Hammer size={14}/> Sculpt Brushes</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                <button className="bg-[#1f6feb]/20 border border-[#1f6feb] p-2 rounded text-white flex justify-center" title="Standard"><Brush size={16}/></button>
                <button className="bg-[#21262d] hover:bg-[#30363d] p-2 rounded text-[#8b949e] hover:text-white flex justify-center" title="Smooth"><Wand2 size={16}/></button>
                <button className="bg-[#21262d] hover:bg-[#30363d] p-2 rounded text-[#8b949e] hover:text-white flex justify-center" title="Flatten"><AlignCenter size={16}/></button>
                <button className="bg-[#21262d] hover:bg-[#30363d] p-2 rounded text-[#8b949e] hover:text-white flex justify-center" title="Inflate"><Maximize size={16}/></button>
              </div>
              <div className="flex flex-col gap-2 text-[11px]">
                <div className="flex justify-between items-center">
                  <span>Radius</span>
                  <input type="range" className="w-32 accent-[#58a6ff]" defaultValue="50" />
                </div>
                <div className="flex justify-between items-center">
                  <span>Strength</span>
                  <input type="range" className="w-32 accent-[#58a6ff]" defaultValue="20" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input type="checkbox" id="sym" className="accent-[#58a6ff]" defaultChecked />
                  <label htmlFor="sym">X-Symmetry</label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Inspector Panel */}
        <div className="w-80 border-l border-[#30363d] bg-[#0d1117] flex flex-col shrink-0 z-20">
          <div className="flex border-b border-[#30363d] bg-[#161b22]">
            <TabButton active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} icon={<Settings2 size={14}/>} label="Object" />
            <TabButton active={activeTab === 'materials'} onClick={() => setActiveTab('materials')} icon={<Palette size={14}/>} label="Material" />
            <TabButton active={activeTab === 'uv'} onClick={() => setActiveTab('uv')} icon={<Grid3x3 size={14}/>} label="UV/Tex" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {selectedObj ? (
              <div className="flex flex-col gap-6">
                
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Object Name</label>
                  <input 
                    type="text" 
                    value={selectedObj.name}
                    onChange={(e) => handleUpdate(selectedObj.id, { name: e.target.value })}
                    className="bg-[#161b22] border border-[#30363d] text-white text-[12px] rounded px-3 py-1.5 outline-none focus:border-[#58a6ff]"
                  />
                </div>

                {activeTab === 'properties' && (
                  <>
                    <TransformGroup label="Location" values={selectedObj.position} onChange={(v) => handleUpdate(selectedObj.id, { position: v })} />
                    <TransformGroup label="Rotation" values={selectedObj.rotation} onChange={(v) => handleUpdate(selectedObj.id, { rotation: v })} />
                    <TransformGroup label="Scale" values={selectedObj.scale} onChange={(v) => handleUpdate(selectedObj.id, { scale: v })} />
                  </>
                )}

                {activeTab === 'materials' && selectedObj.type === 'mesh' && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-3 flex flex-col gap-3">
                      <div className="flex justify-between items-center pb-2 border-b border-[#30363d]">
                        <span className="text-[12px] font-bold text-white">Base Material</span>
                        <div className="w-4 h-4 rounded-full border border-[#30363d]" style={{ backgroundColor: selectedObj.color }} />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-[#8b949e]">Base Color (Albedo)</label>
                        <input 
                          type="color" 
                          value={selectedObj.color || '#ffffff'}
                          onChange={(e) => handleUpdate(selectedObj.id, { color: e.target.value })}
                          className="w-full h-8 rounded cursor-pointer bg-transparent border border-[#30363d]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <label className="text-[10px] text-[#8b949e]">Metallic</label>
                          <span className="text-[10px] font-mono">{selectedObj.metalness?.toFixed(2)}</span>
                        </div>
                        <input 
                          type="range" min="0" max="1" step="0.01" 
                          value={selectedObj.metalness || 0}
                          onChange={(e) => handleUpdate(selectedObj.id, { metalness: parseFloat(e.target.value) })}
                          className="accent-[#58a6ff]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <label className="text-[10px] text-[#8b949e]">Roughness</label>
                          <span className="text-[10px] font-mono">{selectedObj.roughness?.toFixed(2)}</span>
                        </div>
                        <input 
                          type="range" min="0" max="1" step="0.01" 
                          value={selectedObj.roughness || 0}
                          onChange={(e) => handleUpdate(selectedObj.id, { roughness: parseFloat(e.target.value) })}
                          className="accent-[#58a6ff]"
                        />
                      </div>
                      
                      <button className="mt-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[11px] py-1.5 rounded flex items-center justify-center gap-2">
                        <ImageIcon size={12}/> Assign Texture Maps
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'uv' && (
                  <div className="flex flex-col gap-3">
                    <div className="aspect-square bg-[#000] border border-[#30363d] rounded relative overflow-hidden flex items-center justify-center group">
                      <Grid3x3 size={64} className="text-[#30363d] absolute opacity-50" />
                      <span className="text-[#8b949e] text-[11px] z-10 group-hover:text-white transition-colors cursor-pointer">Open Full UV Editor</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] py-1.5 rounded">Smart UV Project</button>
                      <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] py-1.5 rounded">Unwrap</button>
                      <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] py-1.5 rounded">Mark Seam</button>
                      <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] py-1.5 rounded">Clear Seam</button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center text-[#8b949e] text-[12px] mt-10">
                Select an object to inspect.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponents

function MeshObject({ obj, isSelected, mode, onSelect, onTransform }: any) {
  return (
    <group position={obj.position} rotation={obj.rotation} scale={obj.scale} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {isSelected && (mode === 'translate' || mode === 'rotate' || mode === 'scale') ? (
        <PivotControls 
          activeAxes={[true, true, true]}
          scale={100}
          anchor={[0,0,0]}
          
          onDrag={(l, deltaL, w, deltaW) => {
            const position = new THREE.Vector3();
            const rotation = new THREE.Quaternion();
            const scale = new THREE.Vector3();
            w.decompose(position, rotation, scale);
            const euler = new THREE.Euler().setFromQuaternion(rotation);
            if (mode === 'translate') onTransform('position', [position.x, position.y, position.z]);
            if (mode === 'rotate') onTransform('rotation', [euler.x, euler.y, euler.z]);
            if (mode === 'scale') onTransform('scale', [scale.x, scale.y, scale.z]);
          }}
        >
          <MeshGeometry obj={obj} isSelected={isSelected} mode={mode} />
        </PivotControls>
      ) : (
        <MeshGeometry obj={obj} isSelected={isSelected} mode={mode} />
      )}
    </group>
  );
}

function MeshGeometry({ obj, isSelected, mode }: { obj: SceneObject, isSelected: boolean, mode: string }) {
  const getGeometry = () => {
    switch (obj.geometry) {
      case 'box': return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere': return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'cylinder': return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case 'plane': return <planeGeometry args={[1, 1, 32, 32]} />;
      case 'torus': return <torusGeometry args={[0.5, 0.2, 16, 100]} />;
      default: return <boxGeometry />;
    }
  };

  return (
    <mesh castShadow receiveShadow>
      {getGeometry()}
      <meshStandardMaterial 
        color={obj.color || '#ffffff'} 
        metalness={obj.metalness || 0}
        roughness={obj.roughness || 0.5}
        wireframe={mode === 'sculpt'}
      />
      {isSelected && mode !== 'sculpt' && (
        <Edges scale={1.001} color="#58a6ff" />
      )}
    </mesh>
  );
}

// UI Helpers

function MenuButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-[#c9d1d9] hover:text-white hover:bg-[#30363d] rounded transition-colors">
      {icon} <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ToolButton({ active, onClick, icon, tooltip }: any) {
  return (
    <button 
      onClick={onClick}
      title={tooltip}
      className={`p-2.5 rounded-xl transition-all duration-200 ${active ? 'bg-[#1f6feb] text-white shadow-lg' : 'text-[#8b949e] hover:bg-[#30363d] hover:text-white'}`}
    >
      {icon}
    </button>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold transition-colors border-b-2 ${
        active ? 'border-[#58a6ff] text-[#58a6ff] bg-[#1f6feb]/10' : 'border-transparent text-[#8b949e] hover:bg-[#21262d] hover:text-white'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function TransformGroup({ label, values, onChange }: { label: string, values: [number, number, number], onChange: (v: [number, number, number]) => void }) {
  const update = (index: number, val: string) => {
    const newValues = [...values] as [number, number, number];
    newValues[index] = parseFloat(val) || 0;
    onChange(newValues);
  };
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-[#8b949e] uppercase font-bold">{label}</label>
      <div className="flex gap-1 text-[11px] font-mono">
        <div className="flex-1 flex items-center bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
          <span className="bg-[#f85149]/20 text-[#f85149] px-1.5 py-1">X</span>
          <input type="number" step="0.1" value={values[0].toFixed(2)} onChange={e => update(0, e.target.value)} className="w-full bg-transparent px-1 outline-none text-center" />
        </div>
        <div className="flex-1 flex items-center bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
          <span className="bg-[#3fb950]/20 text-[#3fb950] px-1.5 py-1">Y</span>
          <input type="number" step="0.1" value={values[1].toFixed(2)} onChange={e => update(1, e.target.value)} className="w-full bg-transparent px-1 outline-none text-center" />
        </div>
        <div className="flex-1 flex items-center bg-[#161b22] border border-[#30363d] rounded overflow-hidden">
          <span className="bg-[#58a6ff]/20 text-[#58a6ff] px-1.5 py-1">Z</span>
          <input type="number" step="0.1" value={values[2].toFixed(2)} onChange={e => update(2, e.target.value)} className="w-full bg-transparent px-1 outline-none text-center" />
        </div>
      </div>
    </div>
  );
}
