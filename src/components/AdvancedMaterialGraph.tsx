import React, { useState } from 'react';
import { Play, Pause, Save, Box, Search, MousePointer2, Maximize2, Minimize2, Eye, Cpu, Settings, Copy, Trash2, Code, Zap, Layers, Beaker, Fingerprint } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Sphere, MeshDistortMaterial } from '@react-three/drei';

interface MaterialNode {
  id: string;
  type: string;
  name: string;
  category: 'Input' | 'Math' | 'Texture' | 'PBR' | 'Utility';
  x: number;
  y: number;
  inputs: { name: string; type: string; value?: any }[];
  outputs: { name: string; type: string }[];
}

const DEFAULT_NODES: MaterialNode[] = [
  {
    id: 'n1', type: 'Texture2D', name: 'Albedo Map', category: 'Texture', x: 50, y: 100,
    inputs: [{ name: 'UV', type: 'vec2' }],
    outputs: [{ name: 'RGB', type: 'vec3' }, { name: 'R', type: 'float' }, { name: 'A', type: 'float' }]
  },
  {
    id: 'n2', type: 'Color', name: 'Tint Color', category: 'Input', x: 50, y: 300,
    inputs: [],
    outputs: [{ name: 'RGB', type: 'vec3' }]
  },
  {
    id: 'n3', type: 'Multiply', name: 'Multiply', category: 'Math', x: 300, y: 200,
    inputs: [{ name: 'A', type: 'vec3' }, { name: 'B', type: 'vec3' }],
    outputs: [{ name: 'Out', type: 'vec3' }]
  },
  {
    id: 'n4', type: 'Time', name: 'Time', category: 'Input', x: 50, y: 450,
    inputs: [],
    outputs: [{ name: 'Time', type: 'float' }]
  },
  {
    id: 'n5', type: 'Sine', name: 'Sine', category: 'Math', x: 250, y: 450,
    inputs: [{ name: 'In', type: 'float' }],
    outputs: [{ name: 'Out', type: 'float' }]
  },
  {
    id: 'n6', type: 'PBRMaster', name: 'PBR Material', category: 'PBR', x: 600, y: 150,
    inputs: [
      { name: 'Base Color', type: 'vec3' },
      { name: 'Normal', type: 'vec3' },
      { name: 'Metallic', type: 'float' },
      { name: 'Roughness', type: 'float' },
      { name: 'Emission', type: 'vec3' },
      { name: 'Ambient Occlusion', type: 'float' }
    ],
    outputs: []
  }
];

const CONNECTIONS = [
  { fromNode: 'n1', fromPin: 'RGB', toNode: 'n3', toPin: 'A' },
  { fromNode: 'n2', fromPin: 'RGB', toNode: 'n3', toPin: 'B' },
  { fromNode: 'n3', fromPin: 'Out', toNode: 'n6', toPin: 'Base Color' },
  { fromNode: 'n4', fromPin: 'Time', toNode: 'n5', toPin: 'In' },
  { fromNode: 'n5', fromPin: 'Out', toNode: 'n6', toPin: 'Emission' }
];

export default function AdvancedMaterialGraph() {
  const [nodes, setNodes] = useState<MaterialNode[]>(DEFAULT_NODES);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>('n6');
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [previewShape, setPreviewShape] = useState<'sphere' | 'cube' | 'torus'>('sphere');
  const [isRotating, setIsRotating] = useState(true);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedNode(id);
    setDraggingNode(id);
    const node = nodes.find(n => n.id === id);
    if (node) {
      setOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode) {
      setNodes(nodes.map(n => 
        n.id === draggingNode ? { ...n, x: e.clientX - offset.x, y: e.clientY - offset.y } : n
      ));
    }
  };

  const handleMouseUp = () => setDraggingNode(null);

  const getPinColor = (type: string) => {
    switch (type) {
      case 'vec3': return 'bg-yellow-400';
      case 'vec2': return 'bg-green-400';
      case 'float': return 'bg-blue-400';
      default: return 'bg-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'PBR': return 'border-orange-500 bg-orange-900/40 text-orange-400';
      case 'Texture': return 'border-green-500 bg-green-900/40 text-green-400';
      case 'Input': return 'border-red-500 bg-red-900/40 text-red-400';
      case 'Math': return 'border-blue-500 bg-blue-900/40 text-blue-400';
      default: return 'border-gray-500 bg-gray-900/40 text-gray-400';
    }
  };

  const drawConnections = () => {
    return CONNECTIONS.map((c, i) => {
      const fromNode = nodes.find(n => n.id === c.fromNode);
      const toNode = nodes.find(n => n.id === c.toNode);
      if (!fromNode || !toNode) return null;

      const outIndex = fromNode.outputs.findIndex(p => p.name === c.fromPin);
      const inIndex = toNode.inputs.findIndex(p => p.name === c.toPin);
      
      const startX = fromNode.x + 160; 
      const startY = fromNode.y + 45 + (outIndex * 24); 
      
      const endX = toNode.x;
      const endY = toNode.y + 45 + (inIndex * 24);

      const cp1X = startX + 50;
      const cp1Y = startY;
      const cp2X = endX - 50;
      const cp2Y = endY;

      return (
        <path 
          key={i}
          d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          className="opacity-50 hover:opacity-100 hover:stroke-orange-400 transition-colors cursor-pointer"
        />
      );
    });
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none"
         onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      
      {/* Top Header */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-1.5 rounded-lg shadow-lg">
            <Layers size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Material <span className="text-orange-400">Architect</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Node Graph VFX Editor</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-[#333] hover:bg-[#444] transition-colors">
            <Code size={14} /> GENERATE SHADER
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-orange-600 text-white hover:bg-orange-500 transition-colors shadow-[0_0_10px_rgba(234,88,12,0.3)]">
            <Save size={14} /> APPLY MATERIAL
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Toolbar & Library */}
        <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <div className="relative">
               <Search size={14} className="absolute left-2 top-1.5 text-gray-500" />
               <input type="text" placeholder="Search Nodes..." className="w-full bg-black border border-[#3e3e42] text-xs text-white rounded pl-8 pr-2 py-1.5 outline-none focus:border-orange-500" />
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
              
              <div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Inputs</h3>
                <div className="grid grid-cols-2 gap-1">
                  <button className="bg-[#333] hover:bg-[#444] rounded p-1.5 text-[10px] text-left text-gray-300 border border-[#444]">Color</button>
                  <button className="bg-[#333] hover:bg-[#444] rounded p-1.5 text-[10px] text-left text-gray-300 border border-[#444]">Value</button>
                  <button className="bg-[#333] hover:bg-[#444] rounded p-1.5 text-[10px] text-left text-gray-300 border border-[#444]">Time</button>
                  <button className="bg-[#333] hover:bg-[#444] rounded p-1.5 text-[10px] text-left text-gray-300 border border-[#444]">Position</button>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Math</h3>
                <div className="grid grid-cols-2 gap-1">
                  <button className="bg-[#333] hover:bg-[#444] rounded p-1.5 text-[10px] text-left text-gray-300 border border-[#444]">Add</button>
                  <button className="bg-[#333] hover:bg-[#444] rounded p-1.5 text-[10px] text-left text-gray-300 border border-[#444]">Multiply</button>
                  <button className="bg-[#333] hover:bg-[#444] rounded p-1.5 text-[10px] text-left text-gray-300 border border-[#444]">Sine</button>
                  <button className="bg-[#333] hover:bg-[#444] rounded p-1.5 text-[10px] text-left text-gray-300 border border-[#444]">Lerp</button>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Textures</h3>
                <div className="grid grid-cols-2 gap-1">
                  <button className="bg-[#333] hover:bg-[#444] rounded p-1.5 text-[10px] text-left text-gray-300 border border-[#444]">Texture2D</button>
                  <button className="bg-[#333] hover:bg-[#444] rounded p-1.5 text-[10px] text-left text-gray-300 border border-[#444]">Noise</button>
                  <button className="bg-[#333] hover:bg-[#444] rounded p-1.5 text-[10px] text-left text-gray-300 border border-[#444]">Voronoi</button>
                </div>
              </div>

           </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 relative bg-[#1a1a1c] overflow-hidden" 
             style={{ backgroundImage: 'radial-gradient(#3e3e42 1px, transparent 1px)', backgroundSize: '30px 30px' }}
             onMouseDown={() => setSelectedNode(null)}>
             
          <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 0 }}>
            {drawConnections()}
          </svg>

          {nodes.map(node => (
            <div 
              key={node.id}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              className={`absolute flex flex-col w-40 rounded-md border-2 shadow-xl cursor-move bg-[#252526]/90 backdrop-blur ${getCategoryColor(node.category)} ${selectedNode === node.id ? 'ring-2 ring-white scale-105' : ''}`}
              style={{ left: node.x, top: node.y, zIndex: selectedNode === node.id ? 10 : 1 }}
            >
              <div className="px-2 py-1.5 bg-black/40 border-b border-black/20 flex items-center justify-between">
                <span className="text-[10px] font-bold text-white truncate">{node.name}</span>
                <span className="text-[8px] uppercase opacity-70">{node.category}</span>
              </div>
              
              <div className="p-2 flex flex-col gap-1.5">
                 {/* Inputs */}
                 {node.inputs.map((pin, i) => (
                   <div key={`in-${i}`} className="flex items-center gap-1.5 relative z-20">
                     <div className={`w-2 h-2 rounded-full border border-black cursor-crosshair ${getPinColor(pin.type)} -ml-3`}></div>
                     <span className="text-[9px] text-gray-300 flex-1">{pin.name}</span>
                   </div>
                 ))}
                 
                 {/* Outputs */}
                 {node.outputs.map((pin, i) => (
                   <div key={`out-${i}`} className="flex items-center gap-1.5 relative z-20 justify-end">
                     <span className="text-[9px] text-gray-300">{pin.name}</span>
                     <div className={`w-2 h-2 rounded-full border border-black cursor-crosshair ${getPinColor(pin.type)} -mr-3`}></div>
                   </div>
                 ))}
              </div>
            </div>
          ))}
          
        </div>

        {/* Right Panel: Live Preview & Inspector */}
        <div className="w-80 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.5)]">
           
           {/* Realtime 3D Preview */}
           <div className="h-64 border-b border-[#3e3e42] relative bg-black flex flex-col">
              <div className="absolute top-2 left-2 z-10 flex gap-1">
                <button onClick={() => setPreviewShape('sphere')} className={`p-1.5 rounded bg-black/50 hover:bg-black text-gray-400 ${previewShape === 'sphere' ? 'text-white border border-gray-600' : ''}`} title="Sphere"><Circle size={14}/></button>
                <button onClick={() => setPreviewShape('cube')} className={`p-1.5 rounded bg-black/50 hover:bg-black text-gray-400 ${previewShape === 'cube' ? 'text-white border border-gray-600' : ''}`} title="Cube"><Box size={14}/></button>
              </div>
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                <button onClick={() => setIsRotating(!isRotating)} className={`p-1.5 rounded bg-black/50 hover:bg-black ${isRotating ? 'text-orange-400' : 'text-gray-400'}`} title="Toggle Rotation">
                  {isRotating ? <Pause size={14}/> : <Play size={14}/>}
                </button>
              </div>
              
              <div className="flex-1">
                <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                   <ambientLight intensity={0.5} />
                   <directionalLight position={[5, 5, 5]} intensity={1} />
                   <Environment preset="city" />
                   
                   <group>
                     {previewShape === 'sphere' && (
                       <mesh>
                         <sphereGeometry args={[1, 64, 64]} />
                         <MeshDistortMaterial color="#ff6b00" distort={0.2} speed={2} roughness={0.2} metalness={0.8} />
                       </mesh>
                     )}
                     {previewShape === 'cube' && (
                       <mesh>
                         <boxGeometry args={[1.5, 1.5, 1.5]} />
                         <MeshDistortMaterial color="#ff6b00" distort={0} speed={0} roughness={0.2} metalness={0.8} />
                       </mesh>
                     )}
                   </group>
                   
                   <OrbitControls autoRotate={isRotating} autoRotateSpeed={2} enableZoom={false} />
                </Canvas>
              </div>
              
              <div className="absolute bottom-2 left-2 right-2 flex justify-between px-2 py-1 bg-black/50 backdrop-blur rounded text-[9px] font-mono text-gray-400">
                <span className="flex items-center gap-1"><Zap size={10} className="text-yellow-400"/> COMPILING...</span>
                <span>120 FPS</span>
              </div>
           </div>

           {/* Inspector */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#1e1e1e]">
             {selectedNode ? (
               <div className="space-y-4">
                 <div className="bg-[#252526] p-3 rounded border border-[#3e3e42]">
                   <h3 className="text-xs font-bold text-white mb-1 flex items-center gap-2">
                     <Settings size={14} className="text-orange-400"/>
                     {nodes.find(n => n.id === selectedNode)?.name}
                   </h3>
                   <div className="text-[10px] text-gray-500 uppercase">{nodes.find(n => n.id === selectedNode)?.category} Node</div>
                 </div>
                 
                 <div className="space-y-3">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Properties</h4>
                   
                   {nodes.find(n => n.id === selectedNode)?.category === 'Texture' && (
                     <div className="flex flex-col gap-2">
                       <span className="text-[10px] text-gray-400">Texture Image</span>
                       <div className="h-20 bg-black border border-[#3e3e42] rounded flex items-center justify-center text-[10px] text-gray-500 cursor-pointer hover:bg-[#111]">
                         Click to browse...
                       </div>
                     </div>
                   )}
                   
                   {nodes.find(n => n.id === selectedNode)?.category === 'Input' && (
                     <div className="flex flex-col gap-2">
                       <span className="text-[10px] text-gray-400">Color Value</span>
                       <input type="color" defaultValue="#ff0000" className="w-full h-8 bg-transparent border-0 cursor-pointer rounded" />
                     </div>
                   )}
                   
                   {nodes.find(n => n.id === selectedNode)?.category === 'PBR' && (
                     <div className="space-y-2 text-[10px]">
                       <div className="flex justify-between items-center text-gray-400">
                         <span>Blend Mode</span>
                         <select className="bg-black border border-[#3e3e42] text-white rounded px-2 py-1 outline-none focus:border-orange-500">
                           <option>Opaque</option>
                           <option>Masked</option>
                           <option>Translucent</option>
                         </select>
                       </div>
                       <div className="flex justify-between items-center text-gray-400">
                         <span>Two Sided</span>
                         <input type="checkbox" className="accent-orange-500" />
                       </div>
                     </div>
                   )}
                 </div>
                 
                 <div className="pt-4 border-t border-[#3e3e42] flex gap-2">
                   <button className="flex-1 py-1.5 bg-[#333] hover:bg-[#444] rounded text-[10px] font-bold text-gray-300 flex justify-center items-center gap-1 transition-colors">
                     <Copy size={12} /> DUPLICATE
                   </button>
                   <button className="flex-1 py-1.5 bg-red-900/30 border border-red-900/50 hover:bg-red-900/50 rounded text-[10px] font-bold text-red-400 flex justify-center items-center gap-1 transition-colors">
                     <Trash2 size={12} /> DELETE
                   </button>
                 </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2 opacity-50">
                 <MousePointer2 size={24} />
                 <span className="text-xs text-center">Select a node to edit properties</span>
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
