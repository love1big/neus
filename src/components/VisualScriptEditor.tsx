import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Square, Box, MousePointer2, Move, Hand, ZoomIn, ZoomOut,
  Maximize, Settings2, Save, Undo, Redo, Copy, Scissors, ClipboardPaste,
  Trash2, Plus, Search, ChevronRight, ChevronDown, Activity, AlignLeft,
  Cpu, Zap, Database, Globe, BoxSelect, MonitorPlay, MessageSquare, ShieldAlert
} from 'lucide-react';

interface NodePin {
  id: string;
  name: string;
  type: 'exec' | 'bool' | 'int' | 'float' | 'string' | 'vector' | 'object' | 'any';
  isOutput?: boolean;
  value?: any;
}

interface ScriptNode {
  id: string;
  type: string;
  title: string;
  category: string;
  color: string;
  x: number;
  y: number;
  inputs: NodePin[];
  outputs: NodePin[];
  selected?: boolean;
}

interface NodeConnection {
  id: string;
  fromNode: string;
  fromPin: string;
  toNode: string;
  toPin: string;
}

const PIN_COLORS = {
  exec: '#ffffff',
  bool: '#8b0000',
  int: '#3fb950',
  float: '#3fb950',
  string: '#d2a8ff',
  vector: '#e3b341',
  object: '#58a6ff',
  any: '#8b949e'
};

const INITIAL_NODES: ScriptNode[] = [
  {
    id: 'n_start',
    type: 'event_beginplay',
    title: 'Event BeginPlay',
    category: 'Events',
    color: '#f85149',
    x: 100,
    y: 200,
    inputs: [],
    outputs: [{ id: 'out_exec', name: '', type: 'exec', isOutput: true }]
  },
  {
    id: 'n_print',
    type: 'action_print',
    title: 'Print String',
    category: 'Debug',
    color: '#58a6ff',
    x: 400,
    y: 200,
    inputs: [
      { id: 'in_exec', name: '', type: 'exec' },
      { id: 'in_str', name: 'In String', type: 'string', value: 'Hello World' },
      { id: 'in_dur', name: 'Duration', type: 'float', value: 2.0 },
      { id: 'in_color', name: 'Text Color', type: 'vector' }
    ],
    outputs: [{ id: 'out_exec', name: '', type: 'exec', isOutput: true }]
  },
  {
    id: 'n_var1',
    type: 'var_get',
    title: 'Get PlayerName',
    category: 'Variables',
    color: '#2ea043',
    x: 100,
    y: 350,
    inputs: [],
    outputs: [{ id: 'out_val', name: 'PlayerName', type: 'string', isOutput: true }]
  }
];

const INITIAL_CONNECTIONS: NodeConnection[] = [
  { id: 'c1', fromNode: 'n_start', fromPin: 'out_exec', toNode: 'n_print', toPin: 'in_exec' },
  { id: 'c2', fromNode: 'n_var1', fromPin: 'out_val', toNode: 'n_print', toPin: 'in_str' },
];

export default function VisualScriptEditor() {
  const [nodes, setNodes] = useState<ScriptNode[]>(INITIAL_NODES);
  const [connections, setConnections] = useState<NodeConnection[]>(INITIAL_CONNECTIONS);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);
  
  // Connection dragging
  const [drawingConnection, setDrawingConnection] = useState<{
    nodeId: string, pinId: string, isOutput: boolean, startX: number, startY: number, currentX: number, currentY: number
  } | null>(null);

  const workspaceRef = useRef<HTMLDivElement>(null);

  // Tools mapping for the left panel
  const categories = [
    { name: 'Events', icon: <Zap size={14}/>, color: '#f85149' },
    { name: 'Logic', icon: <Cpu size={14}/>, color: '#c9d1d9' },
    { name: 'Math', icon: <Plus size={14}/>, color: '#3fb950' },
    { name: 'Variables', icon: <Database size={14}/>, color: '#2ea043' },
    { name: 'Debug', icon: <ShieldAlert size={14}/>, color: '#58a6ff' },
  ];

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      setZoom(z => Math.min(Math.max(0.2, z - e.deltaY * zoomSensitivity), 3));
    } else {
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle click or Alt+Click
      setIsPanning(true);
      setStartPos({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    } else if (e.button === 0) {
      // Clear selection if clicking empty space
      if ((e.target as HTMLElement).id === 'node-workspace') {
        setNodes(ns => ns.map(n => ({ ...n, selected: false })));
        setContextMenu(null);
      }
    } else if (e.button === 2) { // Right click
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    } else if (dragNodeId) {
      setNodes(ns => ns.map(n => {
        if (n.id === dragNodeId || n.selected) {
          return { ...n, x: n.x + e.movementX / zoom, y: n.y + e.movementY / zoom };
        }
        return n;
      }));
    } else if (drawingConnection && workspaceRef.current) {
      const rect = workspaceRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;
      setDrawingConnection(prev => prev ? { ...prev, currentX: mouseX, currentY: mouseY } : null);
    }
  };

  const handlePointerUp = () => {
    setIsPanning(false);
    setDragNodeId(null);
    if (drawingConnection) {
      setDrawingConnection(null);
    }
  };

  const handleNodePointerDown = (e: React.PointerEvent, id: string) => {
    if (e.button === 0) {
      e.stopPropagation();
      setDragNodeId(id);
      setContextMenu(null);
      setNodes(ns => ns.map(n => {
        if (n.id === id) {
          return { ...n, selected: true };
        }
        return e.shiftKey ? n : { ...n, selected: false }; // Keep selection if shift held
      }));
    }
  };

  const handlePinPointerDown = (e: React.PointerEvent, nodeId: string, pinId: string, isOutput: boolean) => {
    e.stopPropagation();
    if (workspaceRef.current) {
      const rect = workspaceRef.current.getBoundingClientRect();
      const targetRect = (e.target as HTMLElement).getBoundingClientRect();
      
      const pinX = (targetRect.left + targetRect.width/2 - rect.left - pan.x) / zoom;
      const pinY = (targetRect.top + targetRect.height/2 - rect.top - pan.y) / zoom;

      setDrawingConnection({
        nodeId, pinId, isOutput, startX: pinX, startY: pinY, currentX: pinX, currentY: pinY
      });
    }
  };

  const handlePinPointerUp = (e: React.PointerEvent, targetNodeId: string, targetPinId: string, isOutput: boolean) => {
    e.stopPropagation();
    if (drawingConnection) {
      if (drawingConnection.isOutput !== isOutput && drawingConnection.nodeId !== targetNodeId) {
        // Valid connection
        const newConn: NodeConnection = {
          id: `c_${Date.now()}`,
          fromNode: drawingConnection.isOutput ? drawingConnection.nodeId : targetNodeId,
          fromPin: drawingConnection.isOutput ? drawingConnection.pinId : targetPinId,
          toNode: drawingConnection.isOutput ? targetNodeId : drawingConnection.nodeId,
          toPin: drawingConnection.isOutput ? targetPinId : drawingConnection.pinId,
        };
        
        // Remove existing connection to the same input pin
        const filteredConns = connections.filter(c => !(c.toNode === newConn.toNode && c.toPin === newConn.toPin));
        
        setConnections([...filteredConns, newConn]);
      }
      setDrawingConnection(null);
    }
  };

  // SVG Path generation for connections
  const renderConnection = (c: NodeConnection | typeof drawingConnection, isTemp = false) => {
    if (!c) return null;
    
    let startX = 0, startY = 0, endX = 0, endY = 0;
    
    if (isTemp && drawingConnection) {
      startX = drawingConnection.startX;
      startY = drawingConnection.startY;
      endX = drawingConnection.currentX;
      endY = drawingConnection.currentY;
      if (!drawingConnection.isOutput) {
        // Swap if starting from input
        [startX, endX] = [endX, startX];
        [startY, endY] = [endY, startY];
      }
    } else {
      const conn = c as NodeConnection;
      // We would normally look up the exact DOM rects here, but for this demo 
      // we'll calculate based on node positions and pin indices.
      const fromNode = nodes.find(n => n.id === conn.fromNode);
      const toNode = nodes.find(n => n.id === conn.toNode);
      
      if (!fromNode || !toNode) return null;

      const fromPinIdx = fromNode.outputs.findIndex(p => p.id === conn.fromPin);
      const toPinIdx = toNode.inputs.findIndex(p => p.id === conn.toPin);
      
      // Magic numbers based on node layout CSS
      startX = fromNode.x + 200; // Node width
      startY = fromNode.y + 40 + (fromPinIdx * 24) + 12; // Header + Pin offset
      
      endX = toNode.x;
      endY = toNode.y + 40 + (toPinIdx * 24) + 12;
    }

    const dist = Math.abs(endX - startX) * 0.5;
    const cp1x = startX + Math.max(dist, 40);
    const cp1y = startY;
    const cp2x = endX - Math.max(dist, 40);
    const cp2y = endY;

    return (
      <path
        key={isTemp ? 'temp' : (c as NodeConnection).id}
        d={`M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`}
        fill="none"
        stroke={isTemp ? '#8b949e' : '#c9d1d9'}
        strokeWidth={isTemp ? 2 : 3}
        strokeLinecap="round"
        className={isTemp ? 'opacity-50' : 'hover:stroke-[#58a6ff] transition-colors cursor-pointer'}
        onDoubleClick={(e) => {
          if (!isTemp) {
            e.stopPropagation();
            setConnections(cs => cs.filter(conn => conn.id !== (c as NodeConnection).id));
          }
        }}
      />
    );
  };

  return (
    <div className="w-full h-screen bg-[#0d1117] flex flex-col font-sans text-[#c9d1d9] overflow-hidden select-none">
      
      {/* Top Menu Bar */}
      <div className="h-12 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#58a6ff] font-bold">
            <BoxSelect size={18} />
            <span>Omni Visual Scripting</span>
          </div>
          
          <div className="flex items-center gap-1 border-l border-[#30363d] pl-6">
            <MenuButton icon={<Save size={14} />} label="Save" />
            <MenuButton icon={<Undo size={14} />} label="Undo" />
            <MenuButton icon={<Redo size={14} />} label="Redo" />
            <div className="w-px h-4 bg-[#30363d] mx-2" />
            <MenuButton icon={<Play size={14} className="text-[#3fb950]"/>} label="Simulate" />
            <MenuButton icon={<MonitorPlay size={14} />} label="Debug Flow" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#8b949e]">Graph: BP_PlayerController</span>
          <div className="h-6 w-px bg-[#30363d] mx-2" />
          <button className="bg-[#1f6feb] hover:bg-[#388bfd] text-white text-[12px] font-bold px-4 py-1.5 rounded transition-colors flex items-center gap-2">
            <Settings2 size={14}/> Compile
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Palette */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0 z-20">
          <div className="p-3 border-b border-[#30363d]">
            <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5">
              <Search size={14} className="text-[#8b949e]" />
              <input type="text" placeholder="Search nodes..." className="bg-transparent border-none outline-none text-[12px] text-white ml-2 w-full" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {categories.map(cat => (
              <div key={cat.name} className="mb-2">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#c9d1d9] px-2 py-1.5 hover:bg-[#30363d] rounded cursor-pointer transition-colors">
                  <ChevronDown size={14} className="text-[#8b949e]" />
                  <span style={{color: cat.color}}>{cat.icon}</span>
                  {cat.name}
                </div>
                {/* Mock node items for palette */}
                <div className="pl-6 pr-2 flex flex-col gap-1 mt-1">
                  <div className="text-[11px] text-[#8b949e] hover:text-white hover:bg-[#30363d] px-2 py-1 rounded cursor-pointer border border-transparent hover:border-[#30363d]">Action Node 1</div>
                  <div className="text-[11px] text-[#8b949e] hover:text-white hover:bg-[#30363d] px-2 py-1 rounded cursor-pointer border border-transparent hover:border-[#30363d]">Math Node</div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-48 border-t border-[#30363d] bg-[#0d1117] flex flex-col">
             <div className="h-8 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-3">
                <span className="text-[11px] font-bold text-[#8b949e]">Variables</span>
                <Plus size={14} className="text-[#8b949e] hover:text-white cursor-pointer"/>
             </div>
             <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[11px] hover:bg-[#21262d] px-2 py-1 rounded">
                  <div className="w-2 h-2 rounded-full bg-[#8b0000]" />
                  <span className="text-[#c9d1d9]">IsAlive</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] hover:bg-[#21262d] px-2 py-1 rounded">
                  <div className="w-2 h-2 rounded-full bg-[#3fb950]" />
                  <span className="text-[#c9d1d9]">Health</span>
                </div>
             </div>
          </div>
        </div>

        {/* Main Canvas Workspace */}
        <div 
          id="node-workspace"
          ref={workspaceRef}
          className="flex-1 relative overflow-hidden bg-[#0d1117] cursor-default"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Grid Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, #30363d 1px, transparent 1px), linear-gradient(to bottom, #30363d 1px, transparent 1px)`,
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              backgroundPosition: `${pan.x}px ${pan.y}px`
            }}
          />

          {/* SVG Connections Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
            {/* Draw active connections */}
            {connections.map(c => renderConnection(c))}
            {/* Draw temp connection */}
            {renderConnection(drawingConnection, true)}
          </svg>

          {/* Nodes Layer */}
          <div 
            className="absolute origin-top-left"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              width: 0, height: 0 // Anchor point
            }}
          >
            {nodes.map(node => (
              <div 
                key={node.id}
                className={`absolute w-[200px] bg-[#161b22]/90 backdrop-blur-sm rounded-lg border-2 shadow-xl flex flex-col overflow-hidden transition-shadow ${node.selected ? 'border-[#58a6ff] shadow-[0_0_15px_rgba(88,166,255,0.3)] z-20' : 'border-[#30363d] z-10'}`}
                style={{ left: node.x, top: node.y }}
                onPointerDown={(e) => handleNodePointerDown(e, node.id)}
              >
                {/* Node Header */}
                <div className="h-8 flex items-center px-3 relative" style={{ backgroundColor: `${node.color}30` }}>
                  <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: node.color }} />
                  <span className="text-[12px] font-bold text-white truncate ml-1 drop-shadow-md">{node.title}</span>
                </div>
                
                {/* Node Body */}
                <div className="flex p-2 gap-4">
                  {/* Inputs */}
                  <div className="flex-1 flex flex-col gap-2">
                    {node.inputs.map(pin => (
                      <div key={pin.id} className="flex items-center gap-1.5 min-h-[20px]">
                        <div 
                          className="w-3 h-3 rounded-full border border-black/50 cursor-crosshair hover:scale-125 transition-transform"
                          style={{ backgroundColor: PIN_COLORS[pin.type] || '#fff' }}
                          onPointerDown={(e) => handlePinPointerDown(e, node.id, pin.id, false)}
                          onPointerUp={(e) => handlePinPointerUp(e, node.id, pin.id, false)}
                        />
                        {pin.name && <span className="text-[10px] text-[#c9d1d9] font-medium truncate max-w-[70px]">{pin.name}</span>}
                        {/* Inline Input Field if no connection (mocking logic) */}
                        {!pin.name && pin.type !== 'exec' && (
                          <input type="text" className="w-12 bg-[#0d1117] border border-[#30363d] rounded text-[9px] px-1 outline-none text-white" defaultValue={pin.value} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Outputs */}
                  <div className="flex-1 flex flex-col gap-2 items-end">
                    {node.outputs.map(pin => (
                      <div key={pin.id} className="flex items-center gap-1.5 min-h-[20px]">
                        {pin.name && <span className="text-[10px] text-[#c9d1d9] font-medium truncate max-w-[70px] text-right">{pin.name}</span>}
                        <div 
                          className="w-3 h-3 rounded-full border border-black/50 cursor-crosshair hover:scale-125 transition-transform"
                          style={{ backgroundColor: PIN_COLORS[pin.type] || '#fff' }}
                          onPointerDown={(e) => handlePinPointerDown(e, node.id, pin.id, true)}
                          onPointerUp={(e) => handlePinPointerUp(e, node.id, pin.id, true)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Context Menu Mock */}
          {contextMenu && (
            <div 
              className="absolute bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl py-1 z-50 w-48"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1.5 border-b border-[#30363d] mb-1">
                <input type="text" placeholder="Search..." className="w-full bg-[#0d1117] border border-[#30363d] rounded text-[11px] px-2 py-1 text-white outline-none focus:border-[#58a6ff]"/>
              </div>
              <ContextMenuItem label="Add Event Node" />
              <ContextMenuItem label="Add Function Call" />
              <ContextMenuItem label="Add Variable Get" />
              <div className="h-px bg-[#30363d] my-1" />
              <ContextMenuItem label="Paste" disabled />
            </div>
          )}

          {/* Viewport Controls */}
          <div className="absolute bottom-4 right-4 flex bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg p-1 z-20">
            <button className="p-1.5 text-[#8b949e] hover:text-white rounded" onClick={() => setZoom(z => Math.min(3, z + 0.1))}><ZoomIn size={16}/></button>
            <span className="text-[10px] font-mono text-[#8b949e] flex items-center px-2">{Math.round(zoom * 100)}%</span>
            <button className="p-1.5 text-[#8b949e] hover:text-white rounded" onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}><ZoomOut size={16}/></button>
            <div className="w-px h-4 bg-[#30363d] mx-1 self-center" />
            <button className="p-1.5 text-[#8b949e] hover:text-white rounded" onClick={() => { setPan({x:0, y:0}); setZoom(1); }}><Maximize size={16}/></button>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="w-72 border-l border-[#30363d] bg-[#0d1117] flex flex-col shrink-0 z-20">
          <div className="h-10 border-b border-[#30363d] bg-[#161b22] flex items-center px-4">
            <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Details Panel</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {nodes.filter(n => n.selected).length === 1 ? (
              <div className="flex flex-col gap-4">
                {(() => {
                  const n = nodes.find(n => n.selected)!;
                  return (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-[#8b949e] font-bold">Node Name</label>
                        <input type="text" value={n.title} readOnly className="bg-[#161b22] border border-[#30363d] rounded px-2 py-1.5 text-[12px] text-white outline-none" />
                      </div>
                      
                      <div className="h-px bg-[#30363d] w-full" />
                      
                      <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-[#58a6ff]">Input Values</span>
                        {n.inputs.filter(i => i.type !== 'exec').map(i => (
                          <div key={i.id} className="flex flex-col gap-1">
                            <label className="text-[10px] text-[#8b949e]">{i.name || i.id}</label>
                            <input 
                              type="text" 
                              defaultValue={i.value} 
                              className="bg-[#161b22] border border-[#30363d] rounded px-2 py-1.5 text-[12px] text-white outline-none focus:border-[#58a6ff]" 
                            />
                          </div>
                        ))}
                        {n.inputs.filter(i => i.type !== 'exec').length === 0 && (
                          <span className="text-[10px] text-[#8b949e] italic">No editable inputs.</span>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : nodes.filter(n => n.selected).length > 1 ? (
              <div className="text-center text-[#8b949e] text-[12px] mt-10">
                Multiple nodes selected.
              </div>
            ) : (
              <div className="text-center text-[#8b949e] text-[12px] mt-10">
                Select a node to view its details.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function MenuButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-[#c9d1d9] hover:text-white hover:bg-[#30363d] rounded transition-colors">
      {icon} <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ContextMenuItem({ label, disabled }: { label: string, disabled?: boolean }) {
  return (
    <div className={`px-4 py-1.5 text-[11px] cursor-pointer ${disabled ? 'text-[#8b949e] opacity-50' : 'text-[#c9d1d9] hover:text-white hover:bg-[#1f6feb]'}`}>
      {label}
    </div>
  );
}
