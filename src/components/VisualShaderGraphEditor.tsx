import React, { useState, useRef, useEffect } from 'react';
import { Layers, Play, Square, Settings, Save, MousePointer2, Plus, Trash2, Box, Cpu, Eye, Code, Zap, Hash, Droplet } from 'lucide-react';

// === Node Types ===
type ShaderNodeType = 'Input' | 'Math' | 'Texture' | 'Output' | 'Color';

interface NodePin {
  id: string;
  name: string;
  type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'sampler2D';
}

interface ShaderNode {
  id: string;
  type: ShaderNodeType;
  title: string;
  x: number;
  y: number;
  inputs: NodePin[];
  outputs: NodePin[];
  data: any;
}

interface Connection {
  id: string;
  fromNode: string;
  fromPin: string;
  toNode: string;
  toPin: string;
}

const DEFAULT_NODES: ShaderNode[] = [
  { id: 'node_uv', type: 'Input', title: 'UV Coordinates', x: 50, y: 150, inputs: [], outputs: [{ id: 'out_uv', name: 'UV', type: 'vec2' }], data: {} },
  { id: 'node_time', type: 'Input', title: 'Time', x: 50, y: 250, inputs: [], outputs: [{ id: 'out_time', name: 'Time', type: 'float' }], data: {} },
  { id: 'node_color', type: 'Color', title: 'Base Color', x: 50, y: 350, inputs: [], outputs: [{ id: 'out_col', name: 'RGB', type: 'vec3' }], data: { value: '#00ffff' } },
  { id: 'node_sin', type: 'Math', title: 'Sine', x: 250, y: 200, inputs: [{ id: 'in_x', name: 'X', type: 'float' }], outputs: [{ id: 'out_res', name: 'Result', type: 'float' }], data: { op: 'sin' } },
  { id: 'node_mult', type: 'Math', title: 'Multiply', x: 450, y: 250, inputs: [{ id: 'in_a', name: 'A', type: 'vec3' }, { id: 'in_b', name: 'B', type: 'float' }], outputs: [{ id: 'out_res', name: 'Result', type: 'vec3' }], data: { op: 'multiply' } },
  { id: 'node_out', type: 'Output', title: 'Master Material', x: 700, y: 200, inputs: [{ id: 'in_base', name: 'Base Color', type: 'vec3' }, { id: 'in_alpha', name: 'Alpha', type: 'float' }, { id: 'in_emission', name: 'Emission', type: 'vec3' }], outputs: [], data: {} }
];

const DEFAULT_CONNS: Connection[] = [
  { id: 'c1', fromNode: 'node_time', fromPin: 'out_time', toNode: 'node_sin', toPin: 'in_x' },
  { id: 'c2', fromNode: 'node_color', fromPin: 'out_col', toNode: 'node_mult', toPin: 'in_a' },
  { id: 'c3', fromNode: 'node_sin', fromPin: 'out_res', toNode: 'node_mult', toPin: 'in_b' },
  { id: 'c4', fromNode: 'node_mult', fromPin: 'out_res', toNode: 'node_out', toPin: 'in_emission' }
];

export default function VisualShaderGraphEditor() {
  const [nodes, setNodes] = useState<ShaderNode[]>(DEFAULT_NODES);
  const [connections, setConnections] = useState<Connection[]>(DEFAULT_CONNS);
  
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNode(nodeId);
    setDraggingNode(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode) {
      setNodes(nodes.map(n => 
        n.id === draggingNode 
          ? { ...n, x: e.clientX - offset.x, y: e.clientY - offset.y }
          : n
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const drawConnections = () => {
    return connections.map(c => {
      const fromNode = nodes.find(n => n.id === c.fromNode);
      const toNode = nodes.find(n => n.id === c.toNode);
      if (!fromNode || !toNode) return null;

      // Approximate pin positions (magic numbers based on node UI structure)
      const outIndex = fromNode.outputs.findIndex(p => p.id === c.fromPin);
      const inIndex = toNode.inputs.findIndex(p => p.id === c.toPin);
      
      const startX = fromNode.x + 180; // node width
      const startY = fromNode.y + 40 + (outIndex * 24) + 12; // header height + item height/2
      
      const endX = toNode.x;
      const endY = toNode.y + 40 + (inIndex * 24) + 12;

      // Bezier curve
      const cp1X = startX + 50;
      const cp1Y = startY;
      const cp2X = endX - 50;
      const cp2Y = endY;

      return (
        <path 
          key={c.id}
          d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
          fill="none"
          stroke="#58a6ff"
          strokeWidth="3"
          className="opacity-70 hover:opacity-100 hover:stroke-white transition-all cursor-pointer"
        />
      );
    });
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'vec3': return 'bg-green-500';
      case 'vec2': return 'bg-yellow-500';
      case 'vec4': return 'bg-purple-500';
      case 'float': return 'bg-gray-400';
      default: return 'bg-blue-500';
    }
  };

  const getNodeColor = (type: ShaderNodeType) => {
    switch(type) {
      case 'Input': return 'bg-red-900/50 border-red-700';
      case 'Math': return 'bg-blue-900/50 border-blue-700';
      case 'Output': return 'bg-slate-800/80 border-slate-600';
      case 'Color': return 'bg-green-900/50 border-green-700';
      default: return 'bg-gray-800 border-gray-600';
    }
  };

  return (
    <div className="w-full h-full bg-[#0d1117] text-[#c9d1d9] flex flex-col font-sans overflow-hidden select-none"
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}>
      
      {/* Header */}
      <div className="h-12 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#238636] p-1.5 rounded-lg">
            <Layers size={16} className="text-white" />
          </div>
          <h1 className="text-sm font-bold tracking-widest text-[#c9d1d9]">VISUAL <span className="text-[#58a6ff]">SHADER</span> GRAPH</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition-all">
            <Play size={12} className="text-[#3fb950]" /> COMPILE SHADER
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-[#238636] text-white hover:bg-[#2ea043] transition-all">
            <Save size={12} /> SAVE ASSET
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Toolbar */}
        <div className="w-12 bg-[#161b22] border-r border-[#30363d] flex flex-col items-center py-4 gap-4 shrink-0 z-10">
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-[#21262d]" title="Select"><MousePointer2 size={18} /></button>
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-[#21262d]" title="Add Math Node"><Hash size={18} /></button>
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-[#21262d]" title="Add Color"><Droplet size={18} /></button>
          <div className="w-6 h-px bg-[#30363d] my-2"></div>
          <button className="p-2 text-[#58a6ff] hover:text-white rounded hover:bg-[#21262d]" title="Preview Result"><Eye size={18} /></button>
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-[#21262d]" title="View GLSL Code"><Code size={18} /></button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#0d1117] overflow-hidden" 
             style={{ backgroundImage: 'radial-gradient(#30363d 1px, transparent 1px)', backgroundSize: '20px 20px' }}
             onMouseDown={() => setSelectedNode(null)}>
             
          {/* Connections SVG */}
          <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 0 }}>
            {drawConnections()}
          </svg>

          {/* Nodes */}
          {nodes.map(node => (
            <div 
              key={node.id}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              className={`absolute flex flex-col rounded-md border ${getNodeColor(node.type)} shadow-xl ${selectedNode === node.id ? 'ring-2 ring-[#58a6ff]' : ''}`}
              style={{ left: node.x, top: node.y, width: 180, zIndex: selectedNode === node.id ? 10 : 1 }}
            >
              {/* Node Header */}
              <div className="px-3 py-1.5 bg-black/30 border-b border-black/20 rounded-t-md flex items-center justify-between cursor-move">
                <span className="text-xs font-bold text-gray-200 truncate">{node.title}</span>
                <span className="text-[9px] text-gray-500 uppercase">{node.type}</span>
              </div>
              
              {/* Node Body */}
              <div className="flex flex-col bg-black/60 p-2 rounded-b-md backdrop-blur-sm gap-1 min-h-[40px]">
                {/* Inputs */}
                <div className="flex flex-col gap-1 w-full">
                  {node.inputs.map(pin => (
                    <div key={pin.id} className="flex items-center gap-1.5 h-5">
                      <div className={`w-2.5 h-2.5 rounded-full border border-black cursor-crosshair ${getTypeColor(pin.type)}`} title={pin.type}></div>
                      <span className="text-[10px] text-gray-300">{pin.name}</span>
                    </div>
                  ))}
                </div>
                
                {/* Space between if both exist */}
                {node.inputs.length > 0 && node.outputs.length > 0 && <div className="h-2"></div>}
                
                {/* Outputs */}
                <div className="flex flex-col gap-1 w-full items-end">
                  {node.outputs.map(pin => (
                    <div key={pin.id} className="flex items-center gap-1.5 h-5 justify-end">
                      <span className="text-[10px] text-gray-300">{pin.name}</span>
                      <div className={`w-2.5 h-2.5 rounded-full border border-black cursor-crosshair ${getTypeColor(pin.type)}`} title={pin.type}></div>
                    </div>
                  ))}
                </div>
                
                {/* Node Custom Data / Controls */}
                {node.type === 'Color' && (
                  <div className="mt-2 w-full flex justify-center">
                    <input type="color" defaultValue={node.data.value} className="w-full h-6 rounded cursor-pointer bg-transparent border-0 p-0" />
                  </div>
                )}
                {node.type === 'Math' && (
                  <div className="mt-2 w-full bg-black/50 border border-gray-700 rounded px-1.5 py-0.5 text-[10px] text-gray-400 text-center uppercase font-mono">
                    {node.data.op}
                  </div>
                )}
              </div>
            </div>
          ))}
          
        </div>

        {/* Right Panel: Properties */}
        <div className="w-64 bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
          <div className="p-3 border-b border-[#30363d] flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-[#0d1117]">
            <Settings size={14}/> Properties
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="bg-[#0d1117] p-3 rounded border border-[#30363d]">
                  <h3 className="text-xs font-bold text-[#58a6ff] mb-2">{nodes.find(n => n.id === selectedNode)?.title}</h3>
                  <div className="flex flex-col gap-2 text-[11px] text-gray-400">
                     <div className="flex justify-between"><span>Type:</span> <span className="text-white">{nodes.find(n => n.id === selectedNode)?.type}</span></div>
                     <div className="flex justify-between"><span>ID:</span> <span className="text-gray-500 font-mono truncate max-w-[100px]">{selectedNode}</span></div>
                  </div>
                </div>
                
                {/* Dynamic Properties based on type */}
                {nodes.find(n => n.id === selectedNode)?.type === 'Math' && (
                  <div className="bg-[#0d1117] p-3 rounded border border-[#30363d] flex flex-col gap-2">
                    <span className="text-[11px] text-gray-400">Operation</span>
                    <select className="bg-[#161b22] border border-[#30363d] text-white text-xs rounded px-2 py-1 outline-none focus:border-[#58a6ff]">
                      <option>Add</option>
                      <option>Subtract</option>
                      <option>Multiply</option>
                      <option>Divide</option>
                      <option>Sine</option>
                      <option>Cosine</option>
                      <option>Power</option>
                    </select>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2">
                <MousePointer2 size={24} className="opacity-50" />
                <span className="text-xs">Select a node to edit</span>
              </div>
            )}
          </div>
          
          {/* Live Preview Minimap */}
          <div className="h-48 border-t border-[#30363d] bg-black p-2 flex flex-col relative group">
            <span className="absolute top-3 left-3 text-[9px] font-bold text-white bg-black/50 px-1 rounded z-10 backdrop-blur">PREVIEW</span>
            <div className="flex-1 rounded border border-[#30363d] overflow-hidden flex items-center justify-center relative">
               {/* Dummy preview sphere */}
               <div className="w-24 h-24 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.8)]" style={{ background: 'linear-gradient(135deg, #00ffff 0%, #000088 100%)' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer bar */}
      <div className="h-6 bg-[#0d1117] border-t border-[#30363d] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4 text-[9px] font-mono text-gray-500">
          <div className="flex items-center gap-1.5"><Zap size={10} className="text-[#3fb950]" /> GPU COMPILE SUCCESS</div>
          <div>INSTRUCTIONS: 24</div>
        </div>
        <div className="text-[9px] font-mono text-gray-500">
          NODE GRAPH EDITOR v2.1
        </div>
      </div>
    </div>
  );
}
