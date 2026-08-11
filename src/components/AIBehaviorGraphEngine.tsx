import React, { useState, useRef } from 'react';
import { Play, Square, Settings, Save, MousePointer2, Plus, Brain, BrainCircuit, Activity, Hexagon, Zap, Layers, FolderTree, ArrowRight, PlayCircle, Eye, Trash2 } from 'lucide-react';

type AIState = 'Idle' | 'Patrol' | 'Chase' | 'Attack' | 'Flee';
interface StateNode {
  id: string;
  type: AIState;
  x: number;
  y: number;
  params: any;
}
interface Transition {
  id: string;
  from: string;
  to: string;
  condition: string;
}

const DEFAULT_NODES: StateNode[] = [
  { id: 's1', type: 'Idle', x: 100, y: 150, params: { waitTime: 2.0 } },
  { id: 's2', type: 'Patrol', x: 300, y: 150, params: { radius: 10.0, speed: 2.5 } },
  { id: 's3', type: 'Chase', x: 500, y: 150, params: { target: 'Player', speed: 5.5, maxDistance: 20 } },
  { id: 's4', type: 'Attack', x: 700, y: 150, params: { damage: 15, cooldown: 1.5, range: 2.0 } },
];
const DEFAULT_TRANSITIONS: Transition[] = [
  { id: 't1', from: 's1', to: 's2', condition: 'Timer > waitTime' },
  { id: 't2', from: 's2', to: 's3', condition: 'Distance(Player) < sightRange' },
  { id: 't3', from: 's3', to: 's4', condition: 'Distance(Player) <= attackRange' },
  { id: 't4', from: 's4', to: 's3', condition: 'Distance(Player) > attackRange' },
  { id: 't5', from: 's3', to: 's2', condition: 'Distance(Player) > maxDistance' }
];

export default function AIBehaviorGraphEngine() {
  const [nodes, setNodes] = useState<StateNode[]>(DEFAULT_NODES);
  const [transitions, setTransitions] = useState<Transition[]>(DEFAULT_TRANSITIONS);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeState, setActiveState] = useState<string>('s1');

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

  const getStateColor = (type: AIState) => {
    switch (type) {
      case 'Idle': return 'bg-gray-700 border-gray-500';
      case 'Patrol': return 'bg-blue-900 border-blue-600';
      case 'Chase': return 'bg-yellow-900 border-yellow-600';
      case 'Attack': return 'bg-red-900 border-red-600';
      case 'Flee': return 'bg-purple-900 border-purple-600';
    }
  };

  const getIcon = (type: AIState) => {
    switch (type) {
      case 'Idle': return <Square size={14} />;
      case 'Patrol': return <ArrowRight size={14} />;
      case 'Chase': return <Zap size={14} />;
      case 'Attack': return <Activity size={14} />;
      case 'Flee': return <BrainCircuit size={14} />;
    }
  };

  const drawConnections = () => {
    return transitions.map(t => {
      const fromNode = nodes.find(n => n.id === t.from);
      const toNode = nodes.find(n => n.id === t.to);
      if (!fromNode || !toNode) return null;

      // Draw from center to center
      const startX = fromNode.x + 80;
      const startY = fromNode.y + 35;
      const endX = toNode.x + 80;
      const endY = toNode.y + 35;

      const dx = endX - startX;
      const dy = endY - startY;
      const angle = Math.atan2(dy, dx);
      
      // Calculate offset so lines don't perfectly overlap if bidirectional
      const isBidirectional = transitions.some(other => other.from === t.to && other.to === t.from);
      const perpX = -Math.sin(angle) * (isBidirectional ? 15 : 0);
      const perpY = Math.cos(angle) * (isBidirectional ? 15 : 0);

      const midX = startX + dx/2 + perpX;
      const midY = startY + dy/2 + perpY;

      return (
        <g key={t.id}>
          <path 
            d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
            fill="none" stroke={activeState === t.to && isPlaying ? "#4ade80" : "#4b5563"} strokeWidth="2"
            markerEnd="url(#arrowhead)"
            strokeDasharray={isPlaying && activeState === t.to ? "5,5" : "none"}
            className={isPlaying && activeState === t.to ? "animate-[dash_1s_linear_infinite]" : ""}
          />
          <rect x={midX-50} y={midY-10} width="100" height="20" fill="#1f2937" rx="4" ry="4" stroke="#374151" strokeWidth="1"/>
          <text x={midX} y={midY+3} fill="#9ca3af" fontSize="9" textAnchor="middle" fontFamily="monospace">{t.condition}</text>
        </g>
      );
    });
  };

  return (
    <div className="w-full h-full bg-[#0a0a0f] text-gray-200 flex flex-col font-sans overflow-hidden select-none"
         onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      
      {/* Header */}
      <div className="h-12 bg-black border-b border-gray-800 flex items-center px-4 justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-1.5 rounded-lg">
            <BrainCircuit size={16} className="text-white" />
          </div>
          <h1 className="text-sm font-bold tracking-widest text-gray-100 uppercase">AI <span className="text-green-400">Behavior</span> Engine</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setIsPlaying(!isPlaying);
              if (!isPlaying) setActiveState('s1');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${isPlaying ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}`}
          >
            {isPlaying ? <Square size={12} /> : <Play size={12} />} {isPlaying ? 'STOP SIMULATION' : 'SIMULATE STATE MACHINE'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Toolbar */}
        <div className="w-48 bg-black border-r border-gray-800 flex flex-col shrink-0 z-10">
          <div className="p-3 border-b border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <FolderTree size={14}/> States
          </div>
          <div className="p-2 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
            {['Idle', 'Patrol', 'Chase', 'Attack', 'Flee'].map(state => (
              <div key={state} className="flex items-center gap-2 p-2 rounded bg-gray-900 border border-gray-700 hover:border-gray-500 cursor-grab active:cursor-grabbing text-xs text-gray-300">
                {getIcon(state as AIState)} {state}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#0a0a0f] overflow-hidden" 
             style={{ backgroundImage: 'radial-gradient(#1f2937 1px, transparent 1px)', backgroundSize: '30px 30px' }}
             onMouseDown={() => setSelectedNode(null)}>
             
          <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 0 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
              </marker>
            </defs>
            {drawConnections()}
          </svg>

          {nodes.map(node => (
            <div 
              key={node.id}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              className={`absolute flex flex-col w-40 rounded-lg border-2 shadow-xl cursor-move transition-all ${getStateColor(node.type)} ${selectedNode === node.id ? 'ring-2 ring-white/50 scale-105' : ''} ${isPlaying && activeState === node.id ? 'ring-4 ring-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : ''}`}
              style={{ left: node.x, top: node.y, zIndex: selectedNode === node.id ? 10 : 1 }}
            >
              <div className="px-3 py-2 bg-black/40 rounded-t-lg flex items-center justify-between border-b border-black/30">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-100">
                  {getIcon(node.type)} {node.type}
                </div>
              </div>
              <div className="p-2 bg-black/60 rounded-b-lg backdrop-blur-sm min-h-[40px] flex flex-col gap-1">
                {Object.entries(node.params).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 capitalize">{key}</span>
                    <span className="text-gray-200 font-mono bg-black/50 px-1 rounded">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel: Inspector */}
        <div className="w-64 bg-black border-l border-gray-800 flex flex-col shrink-0 z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
          <div className="p-3 border-b border-gray-800 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Settings size={14}/> Node Params
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    {getIcon(nodes.find(n => n.id === selectedNode)?.type as AIState)} 
                    {nodes.find(n => n.id === selectedNode)?.type} Node
                  </h3>
                  <div className="text-[10px] text-gray-500 font-mono">ID: {selectedNode}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-400 uppercase border-b border-gray-800 pb-1 mb-2">Variables</div>
                  {Object.entries(nodes.find(n => n.id === selectedNode)?.params || {}).map(([key, val]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <label className="text-[10px] text-gray-400 capitalize">{key}</label>
                      <input 
                        type={typeof val === 'number' ? 'number' : 'text'}
                        defaultValue={val as any}
                        className="bg-gray-950 border border-gray-800 text-xs text-white rounded px-2 py-1.5 outline-none focus:border-green-500 font-mono"
                      />
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-900/50 transition-colors text-xs font-bold">
                  <Trash2 size={14} /> DELETE NODE
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2">
                <MousePointer2 size={24} className="opacity-50" />
                <span className="text-xs text-center">Select a state node to edit variables</span>
              </div>
            )}
          </div>
          
          {/* Debug Panel */}
          {isPlaying && (
            <div className="h-40 border-t border-gray-800 bg-black flex flex-col">
              <div className="px-3 py-1.5 bg-gray-900 border-b border-gray-800 text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center justify-between">
                <span>Simulation Log</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <div className="flex-1 p-2 font-mono text-[9px] text-gray-400 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                <div className="text-green-500">{`> Engine Started`}</div>
                <div>{`> Initialized at node [${activeState}]`}</div>
                <div className="opacity-70">{`> Evaluating transitions...`}</div>
                {/* Simulated transition log */}
                <div className="animate-pulse">{`_`}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer bar */}
      <div className="h-6 bg-black border-t border-gray-800 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4 text-[9px] font-mono text-gray-600">
          <div className="flex items-center gap-1.5"><Brain size={10} className="text-green-500" /> NAVIER-STOKES HEURISTICS: ACTIVE</div>
          <div>ACTIVE NODES: {nodes.length}</div>
        </div>
        <div className="text-[9px] font-mono text-gray-600">
          BEHAVIOR GRAPH v1.0
        </div>
      </div>
    </div>
  );
}
