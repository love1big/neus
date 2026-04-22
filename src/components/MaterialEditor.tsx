import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  Connection,
  Edge,
  Node,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Save, Download, Upload, Image as ImageIcon, Plus, Trash2, Settings, Bot, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// --- Custom Nodes ---

const nodeStyle = {
  background: '#161b22',
  border: '1px solid #30363d',
  borderRadius: '8px',
  color: '#c9d1d9',
  minWidth: '200px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
};

const Header = ({ title, color }: { title: string, color: string }) => (
  <div className={`px-3 py-2 border-b border-[#30363d] rounded-t-lg text-[12px] font-bold`} style={{ backgroundColor: color }}>
    {title}
  </div>
);

// 1. Output Node (PBR Master)
const PBRMasterNode = ({ data }: { data: any }) => {
  return (
    <div style={{...nodeStyle, minWidth: '240px'}}>
      <Header title="Material Output" color="#238636" />
      <div className="p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[11px] relative">
          <Handle type="target" position={Position.Left} id="baseColor" style={{ top: '50%', left: '-16px', background: '#58a6ff' }} />
          <span className="text-[#8b949e] font-semibold">Base Color</span>
          <input type="color" defaultValue="#ffffff" className="w-16 h-6 p-0 bg-[#0d1117] border border-[#30363d] rounded cursor-pointer" />
        </div>
        <div className="flex items-center justify-between text-[11px] relative">
          <Handle type="target" position={Position.Left} id="metallic" style={{ top: '50%', left: '-16px', background: '#a5d6ff' }} />
          <span className="text-[#8b949e] font-semibold">Metallic</span>
          <input type="number" defaultValue="0" step="0.1" min="0" max="1" className="w-16 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded px-1 py-1 text-right outline-none focus:border-[#58a6ff]" />
        </div>
        <div className="flex items-center justify-between text-[11px] relative">
          <Handle type="target" position={Position.Left} id="specular" style={{ top: '50%', left: '-16px', background: '#a5d6ff' }} />
          <span className="text-[#8b949e] font-semibold">Specular</span>
          <input type="number" defaultValue="0.5" step="0.1" min="0" max="1" className="w-16 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded px-1 py-1 text-right outline-none focus:border-[#58a6ff]" />
        </div>
        <div className="flex items-center justify-between text-[11px] relative">
          <Handle type="target" position={Position.Left} id="roughness" style={{ top: '50%', left: '-16px', background: '#a5d6ff' }} />
          <span className="text-[#8b949e] font-semibold">Roughness</span>
          <input type="number" defaultValue="0.5" step="0.1" min="0" max="1" className="w-16 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded px-1 py-1 text-right outline-none focus:border-[#58a6ff]" />
        </div>
        <div className="flex items-center justify-between text-[11px] relative">
          <Handle type="target" position={Position.Left} id="normal" style={{ top: '50%', left: '-16px', background: '#bc8cff' }} />
          <span className="text-[#8b949e] font-semibold">Normal</span>
          <input type="color" defaultValue="#8080ff" title="Default Normal Vector (128, 128, 255)" className="w-16 h-6 p-0 bg-[#0d1117] border border-[#30363d] rounded cursor-pointer" />
        </div>
        <div className="flex items-center justify-between text-[11px] relative">
          <Handle type="target" position={Position.Left} id="emission" style={{ top: '50%', left: '-16px', background: '#ff7b72' }} />
          <span className="text-[#8b949e] font-semibold">Emissive Color</span>
          <input type="color" defaultValue="#000000" className="w-16 h-6 p-0 bg-[#0d1117] border border-[#30363d] rounded cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

// 2. Texture Sample Node
const TextureNode = ({ data, id }: { data: any, id: string }) => {
  return (
    <div style={nodeStyle}>
      <Header title="Texture Sample" color="#1f6feb" />
      <div className="p-3">
        <div className="flex flex-col gap-2 relative">
          <div className="w-full h-24 bg-[#0d1117] rounded flex items-center justify-center border border-[#30363d] overflow-hidden">
            {data.imageUrl ? (
               <img src={data.imageUrl} alt="Texture" className="w-full h-full object-cover" />
            ) : (
               <ImageIcon size={24} className="text-[#8b949e]" />
            )}
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#8b949e]">{data.fileName || 'No Texture.png'}</span>
            <span className="text-[#58a6ff]">RGB</span>
            <Handle type="source" position={Position.Right} id="rgb" style={{ top: 40, background: '#58a6ff' }} />
          </div>
          <Handle type="source" position={Position.Right} id="r" style={{ top: 60, background: '#ff7b72' }} />
          <Handle type="source" position={Position.Right} id="g" style={{ top: 80, background: '#3fb950' }} />
          <Handle type="source" position={Position.Right} id="b" style={{ top: 100, background: '#58a6ff' }} />
          <Handle type="source" position={Position.Right} id="a" style={{ top: 120, background: '#c9d1d9' }} />
        </div>
      </div>
    </div>
  );
};

// 3. Constant Node
const ConstantNode = ({ data }: { data: any }) => {
  return (
    <div style={nodeStyle} className="min-w-[150px]">
      <Header title="Constant" color="#e3b341" />
      <div className="p-3 flex justify-between items-center">
        <input 
          type="number" 
          defaultValue={data.value} 
          className="w-16 bg-[#0d1117] border border-[#30363d] text-[11px] text-[#c9d1d9] rounded px-1"
          onChange={data.onChange}
        />
        <Handle type="source" position={Position.Right} id="out" style={{ top: 25, background: '#c9d1d9' }} />
      </div>
    </div>
  );
};

// 4. Math Multiply Node
const MultiplyNode = ({ data }: { data: any }) => {
  return (
    <div style={nodeStyle} className="min-w-[150px]">
      <Header title="Multiply" color="#8b949e" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[11px]">
          <Handle type="target" position={Position.Left} id="a" style={{ top: 40 }} />
          <span className="text-[#8b949e]">A</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <Handle type="target" position={Position.Left} id="b" style={{ top: 70 }} />
          <span className="text-[#8b949e]">B</span>
        </div>
        <Handle type="source" position={Position.Right} id="out" style={{ top: 55 }} />
      </div>
    </div>
  );
};

// 5. Math Add Node
const MathAddNode = ({ data }: { data: any }) => {
  return (
    <div style={nodeStyle} className="min-w-[150px]">
      <Header title="Add" color="#8b949e" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[11px]">
          <Handle type="target" position={Position.Left} id="a" style={{ top: 40 }} />
          <span className="text-[#8b949e]">A</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <Handle type="target" position={Position.Left} id="b" style={{ top: 70 }} />
          <span className="text-[#8b949e]">B</span>
        </div>
        <Handle type="source" position={Position.Right} id="out" style={{ top: 55 }} />
      </div>
    </div>
  );
};

// 6. Math Subtract Node
const MathSubtractNode = ({ data }: { data: any }) => {
  return (
    <div style={nodeStyle} className="min-w-[150px]">
      <Header title="Subtract" color="#8b949e" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[11px]">
          <Handle type="target" position={Position.Left} id="a" style={{ top: 40 }} />
          <span className="text-[#8b949e]">A</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <Handle type="target" position={Position.Left} id="b" style={{ top: 70 }} />
          <span className="text-[#8b949e]">B</span>
        </div>
        <Handle type="source" position={Position.Right} id="out" style={{ top: 55 }} />
      </div>
    </div>
  );
};

// 7. Time Node
const TimeNode = ({ data }: { data: any }) => {
  return (
    <div style={nodeStyle} className="min-w-[120px]">
      <Header title="Time" color="#a5d6ff" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-[#8b949e]">Time (t)</span>
          <Handle type="source" position={Position.Right} id="out" style={{ top: 35 }} />
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-[#8b949e]">Sine Time</span>
          <Handle type="source" position={Position.Right} id="sin" style={{ top: 60 }} />
        </div>
      </div>
    </div>
  );
};

// 8. Lerp Node (Linear Interpolate)
const LerpNode = ({ data }: { data: any }) => {
  return (
    <div style={nodeStyle} className="min-w-[150px]">
      <Header title="Linear Interpolate" color="#bc8cff" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[11px]">
          <Handle type="target" position={Position.Left} id="a" style={{ top: 40 }} />
          <span className="text-[#8b949e]">A</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <Handle type="target" position={Position.Left} id="b" style={{ top: 70 }} />
          <span className="text-[#8b949e]">B</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <Handle type="target" position={Position.Left} id="alpha" style={{ top: 100 }} />
          <span className="text-[#8b949e]">Alpha</span>
        </div>
        <Handle type="source" position={Position.Right} id="out" style={{ top: 70 }} />
      </div>
    </div>
  );
};

// 9. Fresnel Node
const FresnelNode = ({ data }: { data: any }) => {
  return (
    <div style={nodeStyle} className="min-w-[150px]">
      <Header title="Fresnel" color="#ff7b72" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[11px]">
          <Handle type="target" position={Position.Left} id="exponent" style={{ top: 40 }} />
          <span className="text-[#8b949e]">Exponent In</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <Handle type="target" position={Position.Left} id="baseReflectFraction" style={{ top: 70 }} />
          <span className="text-[#8b949e]">Base Reflect</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-[#8b949e] opacity-0">.</span>
          <Handle type="source" position={Position.Right} id="out" style={{ top: 55 }} />
        </div>
      </div>
    </div>
  );
};

// 10. Sphere Geometry Node
const SphereNode = ({ data }: { data: any }) => {
  return (
    <div style={nodeStyle} className="min-w-[160px]">
      <Header title="Sphere Geometry" color="#3fb950" />
      <div className="p-3 flex flex-col gap-2 relative">
        <label className="text-[10px] text-[#8b949e]">Radius</label>
        <input type="number" defaultValue="100" className="w-full bg-[#0d1117] border border-[#30363d] text-[11px] text-[#c9d1d9] rounded px-1" />
        <label className="text-[10px] text-[#8b949e]">Segments</label>
        <input type="number" defaultValue="32" className="w-full bg-[#0d1117] border border-[#30363d] text-[11px] text-[#c9d1d9] rounded px-1" />
        <div className="flex justify-between items-center text-[11px] mt-2">
          <span className="text-[#8b949e]">Vertex Position</span>
          <Handle type="source" position={Position.Right} id="out" style={{ top: '80%', background: '#ff7b72' }} />
        </div>
      </div>
    </div>
  );
};

// 11. Vertex Color Node
const VertexColorNode = ({ data }: { data: any }) => {
  return (
    <div style={nodeStyle} className="min-w-[140px]">
      <Header title="Vertex Color" color="#1f6feb" />
      <div className="p-3 flex flex-col gap-2 relative">
        <select className="w-full bg-[#0d1117] border border-[#30363d] text-[11px] text-[#c9d1d9] rounded px-1 py-1 outline-none">
          <option value="R">Channel: R</option>
          <option value="G">Channel: G</option>
          <option value="B">Channel: B</option>
          <option value="A">Channel: A</option>
        </select>
        <div className="flex justify-between items-center text-[11px] mt-2">
          <Handle type="target" position={Position.Left} id="rgb" style={{ top: '80%', background: '#8b949e' }} />
          <span className="text-[#8b949e]">Value (0-1)</span>
          <Handle type="source" position={Position.Right} id="out" style={{ top: '80%', background: '#c9d1d9' }} />
        </div>
      </div>
    </div>
  );
};

// 12. Constant Color Picker
const ColorPickNode = ({ data }: { data: any }) => {
  return (
    <div style={nodeStyle} className="min-w-[120px]">
      <Header title="Color Constant" color="#d2a8ff" />
      <div className="p-3 py-4 flex justify-between items-center relative">
        <input type="color" defaultValue="#ff0000" className="w-[80px] h-8 p-0 bg-[#0d1117] border-2 border-[#30363d] rounded cursor-pointer" />
        <Handle type="source" position={Position.Right} id="rgb" style={{ top: '50%', background: '#58a6ff' }} />
      </div>
    </div>
  );
};

// 13. Math Vector3 Node
const Vector3Node = ({ data }: { data: any }) => {
  return (
    <div style={nodeStyle} className="min-w-[150px]">
      <Header title="Vector3" color="#ff7b72" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-[#8b949e]">X</span>
          <input type="number" defaultValue="0" className="w-16 bg-[#0d1117] border border-[#30363d] text-[11px] text-[#c9d1d9] rounded px-1" />
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-[#8b949e]">Y</span>
          <input type="number" defaultValue="0" className="w-16 bg-[#0d1117] border border-[#30363d] text-[11px] text-[#c9d1d9] rounded px-1" />
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-[#8b949e]">Z</span>
          <input type="number" defaultValue="0" className="w-16 bg-[#0d1117] border border-[#30363d] text-[11px] text-[#c9d1d9] rounded px-1" />
        </div>
        <div className="flex justify-between items-center text-[11px] mt-2 relative">
          <span className="text-[#8b949e] opacity-0">.</span>
          <Handle type="source" position={Position.Right} id="out" style={{ top: '50%', background: '#58a6ff' }} />
        </div>
      </div>
    </div>
  );
};

// 14. Math Vector2 Node
const Vector2Node = ({ data }: { data: any }) => {
  return (
    <div style={nodeStyle} className="min-w-[150px]">
      <Header title="Vector2" color="#3fb950" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-[#8b949e]">X</span>
          <input type="number" defaultValue="0" className="w-16 bg-[#0d1117] border border-[#30363d] text-[11px] text-[#c9d1d9] rounded px-1" />
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-[#8b949e]">Y</span>
          <input type="number" defaultValue="0" className="w-16 bg-[#0d1117] border border-[#30363d] text-[11px] text-[#c9d1d9] rounded px-1" />
        </div>
        <div className="flex justify-between items-center text-[11px] mt-2 relative">
          <span className="text-[#8b949e] opacity-0">.</span>
          <Handle type="source" position={Position.Right} id="out" style={{ top: '50%', background: '#3fb950' }} />
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  pbrMaster: PBRMasterNode,
  texture: TextureNode,
  constant: ConstantNode,
  multiply: MultiplyNode,
  add: MathAddNode,
  subtract: MathSubtractNode,
  time: TimeNode,
  lerp: LerpNode,
  fresnel: FresnelNode,
  sphere: SphereNode,
  vertexColor: VertexColorNode,
  colorPick: ColorPickNode,
  vector3: Vector3Node,
  vector2: Vector2Node
};

const initialNodes: Node[] = [
  { id: 'master', type: 'pbrMaster', position: { x: 900, y: 100 }, data: {} },
  { id: 'texBase', type: 'texture', position: { x: 50, y: 50 }, data: { fileName: 'T_Rock_BaseColor.png', imageUrl: 'https://images.unsplash.com/photo-1522409746182-3df28d6ace21?w=200&h=200&fit=crop' } },
  { id: 'texNormal', type: 'texture', position: { x: 50, y: 300 }, data: { fileName: 'T_Rock_Normal.png', imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=200&h=200&fit=crop' } },
  { id: 'colorInput', type: 'colorPick', position: { x: 250, y: 150 }, data: {} },
  { id: 'sphere1', type: 'sphere', position: { x: 50, y: 550 }, data: {} },
  { id: 'vc1', type: 'vertexColor', position: { x: 250, y: 550 }, data: {} },
  { id: 'timeNode', type: 'time', position: { x: 250, y: 300 }, data: {} },
  { id: 'addNode', type: 'add', position: { x: 450, y: 50 }, data: {} },
  { id: 'lerpNode', type: 'lerp', position: { x: 650, y: 100 }, data: {} },
  { id: 'vec3Node', type: 'vector3', position: { x: 650, y: 300 }, data: {} },
  { id: 'vec2Node', type: 'vector2', position: { x: 650, y: 450 }, data: {} }
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'texBase', target: 'addNode', sourceHandle: 'rgb', targetHandle: 'a', animated: true },
  { id: 'e2', source: 'addNode', target: 'lerpNode', sourceHandle: 'out', targetHandle: 'a', animated: true },
  { id: 'e3', source: 'colorInput', target: 'lerpNode', sourceHandle: 'rgb', targetHandle: 'b', animated: true },
  { id: 'e4', source: 'timeNode', target: 'lerpNode', sourceHandle: 'sin', targetHandle: 'alpha', animated: true },
  { id: 'e5', source: 'vec3Node', target: 'master', sourceHandle: 'out', targetHandle: 'baseColor', animated: true },
  { id: 'e6', source: 'texNormal', target: 'master', sourceHandle: 'rgb', targetHandle: 'normal' },
  { id: 'e7', source: 'sphere1', target: 'vc1', sourceHandle: 'out', targetHandle: 'rgb' }
];

export default function MaterialEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), [setEdges]);

  // Context Menu state
  const [menu, setMenu] = useState<{ x: number, y: number } | null>(null);

  const addNode = (type: string, position: { x: number, y: number }) => {
    const newNode: Node = {
      id: uuidv4(),
      type,
      position,
      data: type === 'constant' ? { value: 1.0 } : {}
    };
    setNodes((nds) => [...nds, newNode]);
    setMenu(null);
  };

  const importTexture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const newNode: Node = {
      id: uuidv4(),
      type: 'texture',
      position: { x: 100, y: 100 },
      data: { fileName: file.name, imageUrl }
    };
    setNodes((nds) => [...nds, newNode]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePaneContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const bounds = e.currentTarget.getBoundingClientRect();
    setMenu({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top
    });
  };

  const [presets, setPresets] = useState<{name: string, nodes: Node[], edges: Edge[]}[]>(() => {
    const saved = localStorage.getItem('material_presets_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');

  const savePreset = () => {
    if (!presetName.trim()) {
      alert('Please enter a preset name.');
      return;
    }
    const newPresets = [...presets, { name: presetName, nodes, edges }];
    setPresets(newPresets);
    localStorage.setItem('material_presets_v2', JSON.stringify(newPresets));
    setPresetName('');
    setShowSavePreset(false);
    alert('Material saved to presets!');
  };

  const loadPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPreset = presets.find(p => p.name === e.target.value);
    if (selectedPreset) {
      setNodes(selectedPreset.nodes || []);
      setEdges(selectedPreset.edges || []);
    }
    // Also reset dropdown back to default
    e.target.value = "";
  };

  return (
    <div className="w-full h-full relative bg-[#0d1117] material-editor-wrapper" onContextMenu={handlePaneContextMenu}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#0d1117]"
      >
        <Background color="#30363d" gap={24} size={2} />
        <Controls className="bg-[#161b22] border-[#30363d] fill-[#c9d1d9]" />
        
        <Panel position="top-left" className="bg-[#161b22] p-2 rounded-lg border border-[#30363d] flex gap-2 shadow-lg items-center relative z-50 overflow-visible">
           <div className="relative">
             <button onClick={() => setShowSavePreset(!showSavePreset)} title="Save Preset" className="p-1.5 hover:bg-[#21262d] rounded text-[#8b949e] hover:text-[#58a6ff] transition-colors"><Save size={16} /></button>
             {showSavePreset && (
               <div className="absolute top-full left-0 mt-2 bg-[#161b22] border border-[#30363d] p-2 rounded shadow-xl flex gap-2 w-64 z-50">
                 <input 
                   type="text" 
                   value={presetName}
                   onChange={e => setPresetName(e.target.value)}
                   className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded px-2 py-1 flex-1"
                   placeholder="Preset name..."
                 />
                 <button onClick={savePreset} className="bg-[#238636] hover:bg-[#2ea043] px-2 py-1 rounded text-white text-[11px] font-medium transition-colors">Save</button>
               </div>
             )}
           </div>
           
           <div className="relative flex items-center">
             <Download size={16} className="text-[#8b949e] absolute left-2 pointer-events-none" />
             <select 
               onChange={loadPreset}
               defaultValue=""
               className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[11px] rounded pl-7 py-1 pr-2 w-32 appearance-none cursor-pointer hover:border-[#58a6ff] transition-colors"
               title="Load Preset"
             >
               <option value="" disabled>Load Preset...</option>
               {presets.map(p => (
                 <option key={p.name} value={p.name}>{p.name}</option>
               ))}
             </select>
           </div>
           
           <div className="w-[1px] h-[24px] bg-[#30363d] mx-1 self-center"></div>
           <button onClick={() => fileInputRef.current?.click()} title="Import Texture" className="p-1.5 hover:bg-[#21262d] rounded text-[#8b949e] hover:text-[#3fb950] transition-colors flex items-center gap-1">
             <Upload size={16} /> <span className="text-[11px] font-medium hidden sm:inline">Import Texture</span>
           </button>
           <button title="Compile Shader" className="ml-2 px-3 py-1 bg-[#238636] hover:bg-[#2ea043] rounded text-[11px] text-white font-medium transition-colors shadow">Apply</button>
        </Panel>

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={importTexture} />

        {/* Selected Node Properties Panel */}
        <Panel position="top-right" className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg w-64 flex flex-col pointer-events-auto">
           <div className="px-3 py-2 border-b border-[#30363d] flex items-center justify-between bg-[#0d1117] rounded-t-lg">
             <span className="text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2"><Settings size={14} className="text-[#8b949e]" /> 3D Scene Inspector</span>
           </div>
           <div className="p-3 text-[11px] text-[#8b949e] flex flex-col gap-2 min-h-[100px] max-h-[300px] overflow-y-auto custom-scrollbar">
             {nodes.filter(n => n.selected).length === 0 ? (
               <div className="text-center italic mt-4 opacity-50">Select a node to inspect...</div>
             ) : (
               nodes.filter(n => n.selected).map(node => (
                 <div key={node.id} className="flex flex-col gap-2">
                   <div className="flex justify-between items-center bg-[#0d1117] p-2 rounded border border-[#30363d]">
                     <span className="font-bold text-[#c9d1d9] capitalize">{node.type} Node</span>
                     <span className="text-[#3fb950] font-mono">{node.id}</span>
                   </div>
                   <div className="grid grid-cols-2 gap-1 px-1 mt-1">
                      <span>Position X:</span><span className="text-[#c9d1d9] text-right">{Math.round(node.position.x)}</span>
                      <span>Position Y:</span><span className="text-[#c9d1d9] text-right">{Math.round(node.position.y)}</span>
                      {Object.keys(node.data).map(key => (
                         <React.Fragment key={key}>
                            <span className="capitalize">{key}:</span>
                            <span className="text-[#c9d1d9] text-right truncate" title={String(node.data[key])}>{String(node.data[key])}</span>
                         </React.Fragment>
                      ))}
                   </div>
                 </div>
               ))
             )}
           </div>
        </Panel>

        {/* Offline AI Command Bar */}
        <Panel position="bottom-center" className="w-[500px] mb-4 pointer-events-auto">
          <div className="bg-[#161b22]/90 backdrop-blur-md border border-[#30363d] rounded-xl shadow-2xl p-2 flex flex-col gap-2">
            <div className="flex items-center justify-between px-2">
               <span className="text-[10px] text-[#3fb950] font-mono font-bold flex items-center gap-1"><Bot size={12} /> AI OFFLINE 100%</span>
               <span className="text-[10px] text-[#8b949e]">Material Graph Generator</span>
            </div>
            <div className="flex gap-2">
               <input 
                 type="text" 
                 placeholder="e.g., 'Add a glowing red emission to the base color...'"
                 className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#c9d1d9] px-4 py-2 outline-none focus:border-[#58a6ff] transition-colors"
                 onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       e.currentTarget.value = '';
                       alert('Offline AI is generating node logic...');
                    }
                 }}
               />
               <button className="bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] rounded-lg p-2 transition-colors flex items-center justify-center">
                  <Sparkles size={18} />
               </button>
            </div>
          </div>
        </Panel>
      </ReactFlow>

      {/* Context Menu for adding nodes */}
      {menu && (
        <div 
          className="absolute z-50 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl w-48 py-1 text-[12px] text-[#c9d1d9] flex flex-col items-start overflow-y-auto max-h-[300px] custom-scrollbar"
          style={{ left: menu.x, top: menu.y }}
        >
          <div className="px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-b border-[#30363d] mb-1 w-full relative shrink-0">Add Node</div>
          <button onClick={() => addNode('texture', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Texture Sample</button>
          <button onClick={() => addNode('constant', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Constant Scalar</button>
          
          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-b border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Math</div>
          <button onClick={() => addNode('add', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Add</button>
          <button onClick={() => addNode('subtract', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Subtract</button>
          <button onClick={() => addNode('multiply', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Multiply</button>
          <button onClick={() => addNode('lerp', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Linear Interpolate (Lerp)</button>
          <button onClick={() => addNode('vector2', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Vector2</button>
          <button onClick={() => addNode('vector3', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Vector3</button>

          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-b border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Effects</div>
          <button onClick={() => addNode('fresnel', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Fresnel</button>
          <button onClick={() => addNode('time', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Time</button>

          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-b border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Geometry & Constants</div>
          <button onClick={() => addNode('sphere', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Sphere Geometry</button>
          <button onClick={() => addNode('vertexColor', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Vertex Color</button>
          <button onClick={() => addNode('colorPick', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors border-l-2 border-transparent hover:border-white">Color Constant (UI Pick)</button>
        </div>
      )}

      {/* Click outside context menu to close */}
      {menu && <div className="absolute inset-0 z-40" onClick={() => setMenu(null)}></div>}
    </div>
  );
}
