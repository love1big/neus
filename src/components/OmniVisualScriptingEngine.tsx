import React, { useState, useRef, useEffect } from 'react';
import { Waypoints, GitBranch, Share2, Network, GitMerge, Activity, CheckCircle2, AlertTriangle, Settings2, Play, Cpu, Bot, Zap, PlusSquare, Trash2, BoxSelect, Maximize, Sliders, ArrowUpRight, Copy, TerminalSquare, Eye, ChevronDown, Flag, Database, RotateCw, Layers} from 'lucide-react';

interface NodePin {
  id: string;
  name: string;
  type: 'exec' | 'float' | 'string' | 'boolean' | 'object';
  isInput: boolean;
  value?: any;
}

interface GraphNode {
  id: string;
  title: string;
  x: number;
  y: number;
  color: string;
  category: 'event' | 'logic' | 'math' | 'variable';
  inputs: NodePin[];
  outputs: NodePin[];
}

interface NodeConnection {
  id: string;
  fromNode: string;
  fromPin: string;
  toNode: string;
  toPin: string;
  type: string;
}

export default function OmniVisualScriptingEngine() {
  const [activeTab, setActiveTab] = useState('AppLogic');
  
  const [nodes, setNodes] = useState<GraphNode[]>([
    { 
      id: 'n1', title: 'Event BeginPlay', x: 100, y: 150, color: 'border-[#f85149]', category: 'event',
      inputs: [], outputs: [{ id: 'o1', name: 'Exec', type: 'exec', isInput: false }]
    },
    { 
      id: 'n2', title: 'Spawn Actor', x: 400, y: 120, color: 'border-[#3fb950]', category: 'logic',
      inputs: [
        { id: 'i1', name: 'Exec', type: 'exec', isInput: true },
        { id: 'i2', name: 'Class', type: 'string', isInput: true, value: 'NPC_Guard' },
        { id: 'i3', name: 'Location', type: 'object', isInput: true }
      ], 
      outputs: [
        { id: 'o1', name: 'Exec', type: 'exec', isInput: false },
        { id: 'o2', name: 'Actor', type: 'object', isInput: false }
      ]
    },
    { 
      id: 'n3', title: 'Delay', x: 750, y: 150, color: 'border-[#58a6ff]', category: 'logic',
      inputs: [
        { id: 'i1', name: 'Exec', type: 'exec', isInput: true },
        { id: 'i2', name: 'Duration', type: 'float', isInput: true, value: 2.5 }
      ], 
      outputs: [{ id: 'o1', name: 'Completed', type: 'exec', isInput: false }]
    }
  ]);
  
  const [connections, setConnections] = useState<NodeConnection[]>([
    { id: 'c1', fromNode: 'n1', fromPin: 'o1', toNode: 'n2', toPin: 'i1', type: 'exec' },
    { id: 'c2', fromNode: 'n2', fromPin: 'o1', toNode: 'n3', toPin: 'i1', type: 'exec' }
  ]);

  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Connection dragging state
  const [drawingConnection, setDrawingConnection] = useState<{nodeId: string, pinId: string, isInput: boolean, startX: number, startY: number, currentX: number, currentY: number, type: string} | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDownNode = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === id);
    if(node) {
      setDraggingNodeId(id);
      setOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerDownPin = (nodeId: string, pin: NodePin, e: React.PointerEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const targetRect = (e.target as HTMLElement).getBoundingClientRect();
    
    setDrawingConnection({
      nodeId,
      pinId: pin.id,
      isInput: pin.isInput,
      startX: targetRect.left + targetRect.width / 2 - rect.left,
      startY: targetRect.top + targetRect.height / 2 - rect.top,
      currentX: e.clientX - rect.left,
      currentY: e.clientY - rect.top,
      type: pin.type
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    if (draggingNodeId !== null) {
      setNodes(prev => prev.map(n => 
        n.id === draggingNodeId ? { ...n, x: e.clientX - offset.x, y: e.clientY - offset.y } : n
      ));
    } else if (drawingConnection !== null) {
      setDrawingConnection(prev => prev ? {
        ...prev,
        currentX: e.clientX - rect.left,
        currentY: e.clientY - rect.top
      } : null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingNodeId !== null) {
      setDraggingNodeId(null);
      try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch(e) {}
    }
    
    if (drawingConnection !== null) {
      setDrawingConnection(null);
    }
  };

  const handlePinMouseUp = (nodeId: string, pin: NodePin, e: React.MouseEvent) => {
    e.stopPropagation();
    if (drawingConnection && drawingConnection.nodeId !== nodeId && drawingConnection.isInput !== pin.isInput) {
      // Create connection
      if (drawingConnection.type === pin.type || drawingConnection.type === 'exec' || pin.type === 'exec') { // Simplified type matching
        const fromNode = drawingConnection.isInput ? nodeId : drawingConnection.nodeId;
        const fromPin = drawingConnection.isInput ? pin.id : drawingConnection.pinId;
        const toNode = drawingConnection.isInput ? drawingConnection.nodeId : nodeId;
        const toPin = drawingConnection.isInput ? drawingConnection.pinId : pin.id;
        
        // Remove existing connection to the same input pin
        const newConns = connections.filter(c => !(c.toNode === toNode && c.toPin === toPin));
        
        setConnections([...newConns, {
          id: `c_${Date.now()}`,
          fromNode, fromPin, toNode, toPin,
          type: drawingConnection.type
        }]);
      }
    }
    setDrawingConnection(null);
  };

  const addNode = (type: string) => {
    const id = `n_${Date.now()}`;
    if (type === 'logic') {
      setNodes([...nodes, { id, title: 'Custom Logic', x: 200, y: 200, color: 'border-[#3fb950]', category: 'logic', inputs: [{id: 'i1', name: 'Exec', type: 'exec', isInput: true}], outputs: [{id: 'o1', name: 'Exec', type: 'exec', isInput: false}] }]);
    } else if (type === 'math') {
      setNodes([...nodes, { id, title: 'Add (Float)', x: 200, y: 200, color: 'border-[#e3b341]', category: 'math', inputs: [{id: 'i1', name: 'A', type: 'float', isInput: true, value: 0}, {id: 'i2', name: 'B', type: 'float', isInput: true, value: 0}], outputs: [{id: 'o1', name: 'Result', type: 'float', isInput: false}] }]);
    } else if (type === 'event') {
      setNodes([...nodes, { id, title: 'Custom Event', x: 200, y: 200, color: 'border-[#f85149]', category: 'event', inputs: [], outputs: [{id: 'o1', name: 'Exec', type: 'exec', isInput: false}] }]);
    }
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setConnections(connections.filter(c => c.fromNode !== id && c.toNode !== id));
  };

  const getPinColor = (type: string) => {
    switch(type) {
      case 'exec': return 'bg-[#ffffff]';
      case 'float': return 'bg-[#3fb950]';
      case 'string': return 'bg-[#bc8cff]';
      case 'boolean': return 'bg-[#f85149]';
      case 'object': return 'bg-[#58a6ff]';
      default: return 'bg-[#888888]';
    }
  };

  const getPinStrokeColor = (type: string) => {
    switch(type) {
      case 'exec': return '#ffffff';
      case 'float': return '#3fb950';
      case 'string': return '#bc8cff';
      case 'boolean': return '#f85149';
      case 'object': return '#58a6ff';
      default: return '#888888';
    }
  };

  const updateNodeInputValue = (nodeId: string, pinId: string, value: any) => {
    setNodes(nodes.map(n => n.id === nodeId ? {
      ...n,
      inputs: n.inputs.map(p => p.id === pinId ? { ...p, value } : p)
    } : n));
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0a0a] text-[#cccccc] font-sans text-xs overflow-hidden select-none">
      <div className="h-16 border-b border-[#2d2d2d] bg-[#141414] flex flex-col justify-between shrink-0 shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-30">
         <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
                <div className="flex bg-[#000] px-3 py-1.5 rounded border border-[#333] shadow-inner items-center gap-2">
                   <Network size={18} className="text-[#bc8cff] animate-pulse"/>
                   <span className="text-white font-black tracking-widest text-[12px] uppercase">Node Engine Core (Interactive)</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                 <button onClick={() => setConnections([])} className="px-3 py-1.5 bg-[#1a1a1a] text-[#f85149] rounded border border-[#333] hover:bg-[#222] transition flex items-center gap-2 text-[11px]">
                    <Trash2 size={12}/> Clear Links
                 </button>
                 <button className="px-5 py-1.5 bg-[#238636] text-white font-black rounded shadow-[0_0_15px_rgba(63,185,80,0.4)] transition flex items-center gap-2 text-[11px] uppercase tracking-widest border border-[#3fb950]/50 hover:bg-[#2ea043]">
                    <Play size={12}/> Compile & Play
                 </button>
            </div>
         </div>

         <div className="flex px-2 bg-[#0a0a0a] border-t border-[#222]">
            <ModuleTab active={true} onClick={() => {}} icon={<Waypoints size={12}/>} label="Node Graph (Draggable)" color="text-[#3fb950]"/>
            <ModuleTab active={false} onClick={() => {}} icon={<TerminalSquare size={12}/>} label="Generated Code" color="text-[#8b949e]"/>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-full h-full flex bg-[#050505]">
           <div className="w-[200px] border-r border-[#222] bg-[#111] flex flex-col z-20 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
              <div className="p-3 border-b border-[#333] flex flex-col gap-2">
                 <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider mb-1">Add Nodes</span>
                 <button className="w-full bg-[#1a1a1a] border border-[#333] hover:border-[#f85149] text-left px-2 py-1.5 rounded flex items-center gap-2" onClick={() => addNode('event')}>
                    <div className="w-2 h-2 bg-[#f85149] rounded-full"></div> Custom Event
                 </button>
                 <button className="w-full bg-[#1a1a1a] border border-[#333] hover:border-[#3fb950] text-left px-2 py-1.5 rounded flex items-center gap-2" onClick={() => addNode('logic')}>
                    <div className="w-2 h-2 bg-[#3fb950] rounded-full"></div> Logic Node
                 </button>
                 <button className="w-full bg-[#1a1a1a] border border-[#333] hover:border-[#e3b341] text-left px-2 py-1.5 rounded flex items-center gap-2" onClick={() => addNode('math')}>
                    <div className="w-2 h-2 bg-[#e3b341] rounded-full"></div> Math Operation
                 </button>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto">
                <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider mb-2 block">Properties</span>
                <div className="text-[10px] text-[#666] italic">Select a node to edit properties...</div>
              </div>
           </div>

           <div 
             ref={containerRef}
             className="flex-1 relative overflow-hidden" 
             style={{ backgroundImage: 'radial-gradient(circle at center, #222 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
             onPointerMove={handlePointerMove} 
             onPointerUp={handlePointerUp}
           >
               {/* Connections SVG Layer */}
               <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
                   {/* Draw completed connections */}
                   {connections.map(conn => {
                     const fNode = nodes.find(n => n.id === conn.fromNode);
                     const tNode = nodes.find(n => n.id === conn.toNode);
                     if (!fNode || !tNode) return null;
                     
                     // Approximate pin positions (requires DOM refs for exact, but this works for demo)
                     const fPinIndex = fNode.outputs.findIndex(p => p.id === conn.fromPin);
                     const tPinIndex = tNode.inputs.findIndex(p => p.id === conn.toPin);
                     
                     const startX = fNode.x + 200; // Node width
                     const startY = fNode.y + 40 + (fPinIndex * 24); // Title height + offset
                     
                     const endX = tNode.x;
                     const endY = tNode.y + 40 + (tPinIndex * 24);
                     
                     const strokeColor = getPinStrokeColor(conn.type);
                     
                     return (
                       <path 
                         key={conn.id}
                         d={`M${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`} 
                         stroke={strokeColor} 
                         fill="none" 
                         strokeWidth="2.5" 
                         strokeOpacity="0.8"
                       />
                     );
                   })}
                   
                   {/* Draw active connection being dragged */}
                   {drawingConnection && (
                     <path 
                       d={`M${drawingConnection.startX} ${drawingConnection.startY} C ${drawingConnection.startX + (drawingConnection.isInput ? -50 : 50)} ${drawingConnection.startY}, ${drawingConnection.currentX + (drawingConnection.isInput ? 50 : -50)} ${drawingConnection.currentY}, ${drawingConnection.currentX} ${drawingConnection.currentY}`} 
                       stroke={getPinStrokeColor(drawingConnection.type)} 
                       fill="none" 
                       strokeWidth="2.5" 
                       strokeDasharray="5,5"
                       className="animate-[dash_1s_linear_infinite]"
                     />
                   )}
               </svg>
               
               {/* Nodes Layer */}
               {nodes.map(node => (
                 <div 
                   key={node.id}
                   onPointerDown={(e) => handlePointerDownNode(node.id, e)}
                   className={`absolute w-[200px] bg-[#111] border-t-4 ${node.color} border-l border-r border-b border-[#333] rounded shadow-xl z-20 cursor-grab active:cursor-grabbing opacity-95`} 
                   style={{ left: node.x, top: node.y }}
                 >
                     <div className="px-2 py-1.5 text-[11px] font-bold text-white border-b border-[#333] flex justify-between items-center tracking-wide group" style={{ backgroundColor: node.color.replace('border-', 'bg-').replace(']', ']/20') }}>
                         <span className="truncate pr-2 pointer-events-none">{node.title}</span>
                         <button onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} className="text-[#888] hover:text-[#f85149] opacity-0 group-hover:opacity-100 transition-opacity">
                           <Trash2 size={12}/>
                         </button>
                     </div>
                     <div className="p-0 flex flex-col font-mono text-[10px] bg-[#0a0a0a]">
                        <div className="flex w-full">
                           {/* Inputs */}
                           <div className="flex-1 flex flex-col gap-1 p-1">
                             {node.inputs.map(pin => (
                               <div key={pin.id} className="flex items-center gap-1.5 relative h-5">
                                 <div 
                                   className={`w-3 h-3 rounded-full border-2 border-[#111] cursor-crosshair z-30 ${getPinColor(pin.type)}`}
                                   style={{ marginLeft: '-8px' }}
                                   onPointerDown={(e) => handlePointerDownPin(node.id, pin, e)}
                                   onMouseUp={(e) => handlePinMouseUp(node.id, pin, e)}
                                 ></div>
                                 <span className="text-[#c9d1d9]">{pin.name}</span>
                                 {pin.type !== 'exec' && pin.type !== 'object' && !connections.some(c => c.toNode === node.id && c.toPin === pin.id) && (
                                   <input 
                                     type={pin.type === 'float' ? 'number' : 'text'} 
                                     value={pin.value || ''} 
                                     onChange={(e) => updateNodeInputValue(node.id, pin.id, e.target.value)}
                                     onPointerDown={(e) => e.stopPropagation()}
                                     className="w-10 bg-[#161616] border border-[#333] text-white text-[9px] px-1 rounded outline-none focus:border-[#58a6ff]"
                                   />
                                 )}
                               </div>
                             ))}
                           </div>
                           
                           {/* Outputs */}
                           <div className="flex-1 flex flex-col gap-1 p-1 items-end">
                             {node.outputs.map(pin => (
                               <div key={pin.id} className="flex items-center justify-end gap-1.5 relative h-5">
                                 <span className="text-[#c9d1d9]">{pin.name}</span>
                                 <div 
                                   className={`w-3 h-3 rounded-full border-2 border-[#111] cursor-crosshair z-30 ${getPinColor(pin.type)}`}
                                   style={{ marginRight: '-8px' }}
                                   onPointerDown={(e) => handlePointerDownPin(node.id, pin, e)}
                                   onMouseUp={(e) => handlePinMouseUp(node.id, pin, e)}
                                 ></div>
                               </div>
                             ))}
                           </div>
                        </div>
                     </div>
                 </div>
               ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function ModuleTab({ active, onClick, icon, label, color }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; color: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 border-r border-[#222] flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition ${active ? 'bg-[#0a0a0a] border-t-2 border-t-[#3fb950] text-white' : 'bg-[#111] text-[#888] hover:bg-[#1a1a1a]'}`}
    >
      <span className={active ? color : ''}>{icon}</span> {label}
    </button>
  );
}