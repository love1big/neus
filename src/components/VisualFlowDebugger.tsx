import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, StepForward, RotateCcw, Database, Code2, Cpu, Activity, Zap, CheckCircle2, AlertCircle, Clock, SearchCode, BugPlay, BoxSelect} from "lucide-react";

type NodeStatus = 'waiting' | 'active' | 'success' | 'error' | 'paused';

interface FlowNode {
  id: string;
  type: 'trigger' | 'llm' | 'script' | 'action' | 'condition';
  label: string;
  x: number;
  y: number;
  status: NodeStatus;
  data: Record<string, any>;
  logs: string[];
}

interface FlowEdge {
  source: string;
  target: string;
  active: boolean;
}

const INITIAL_NODES: FlowNode[] = [
  { id: 'n1', type: 'trigger', label: 'On User Request', x: 50, y: 150, status: 'success', data: { prompt: "Build a calculator app", intent: "feature_request" }, logs: ["[INFO] Received request payload", "[INFO] Intent mapped to: feature_request"] },
  { id: 'n2', type: 'llm', label: 'Gemini Context Agent', x: 300, y: 150, status: 'success', data: { model: "gemini-pro", tokens_in: 1240, tokens_out: 450, temperature: 0.2 }, logs: ["[LLM] Initializing context builder", "[LLM] Fetching workspace files", "[LLM] Generation complete. Latency: 1.2s"] },
  { id: 'n3', type: 'script', label: 'AST Transformer', x: 550, y: 50, status: 'paused', data: { target_file: "src/App.tsx", nodes_modified: 14, ast_valid: true, variables: { activeTab: "state", imports: ["react", "lucide-react"] } }, logs: ["[AST] Parsing src/App.tsx", "[AST] Applying Babel transforms", "[WARN] Paused at Breakpoint 1: Inspecting variables"] },
  { id: 'n4', type: 'action', label: 'VFS Write', x: 550, y: 250, status: 'waiting', data: { file_path: "/src/components/Calculator.tsx", bytes: 4096 }, logs: [] },
  { id: 'n5', type: 'script', label: 'Linter Validation', x: 800, y: 50, status: 'waiting', data: { strict_mode: true }, logs: [] },
  { id: 'n6', type: 'action', label: 'Live Server HMR', x: 1050, y: 150, status: 'waiting', data: { port: 3000, clients_connected: 1 }, logs: [] }
];

const INITIAL_EDGES: FlowEdge[] = [
  { source: 'n1', target: 'n2', active: false },
  { source: 'n2', target: 'n3', active: true },
  { source: 'n2', target: 'n4', active: false },
  { source: 'n3', target: 'n5', active: false },
  { source: 'n4', target: 'n6', active: false },
  { source: 'n5', target: 'n6', active: false },
];

export default function VisualFlowDebugger() {
  const [nodes, setNodes] = useState<FlowNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<FlowEdge[]>(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<string | null>('n3');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const activeNodeData = nodes.find(n => n.id === selectedNode);

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case 'success': return 'border-[#2ea043] bg-[#238636]/10 text-[#2ea043]';
      case 'error': return 'border-[#f85149] bg-[#f85149]/10 text-[#f85149]';
      case 'active': return 'border-[#58a6ff] bg-[#58a6ff]/10 text-[#58a6ff] shadow-[0_0_15px_rgba(88,166,255,0.4)]';
      case 'paused': return 'border-[#e3b341] bg-[#e3b341]/10 text-[#e3b341] shadow-[0_0_15px_rgba(227,179,65,0.4)]';
      default: return 'border-[#30363d] bg-[#161b22] text-[#8b949e]';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Zap size={16} />;
      case 'llm': return <Cpu size={16} />;
      case 'script': return <Code2 size={16} />;
      case 'action': return <Activity size={16} />;
      default: return <BoxSelect size={16} />;
    }
  };

  const getStatusIcon = (status: NodeStatus) => {
    switch (status) {
      case 'success': return <CheckCircle2 size={14} className="text-[#2ea043]" />;
      case 'error': return <AlertCircle size={14} className="text-[#f85149]" />;
      case 'active': return <div className="w-3 h-3 rounded-full bg-[#58a6ff] animate-pulse"></div>;
      case 'paused': return <Pause size={14} className="text-[#e3b341]" />;
      default: return <Clock size={14} className="text-[#8b949e]" />;
    }
  };

  const handleStep = () => {
    setIsPlaying(false);
    setIsPaused(true);
    // Mock stepping logic: transition n3 to success, n5 to active
    setNodes(prev => prev.map(n => {
      if (n.id === 'n3') return { ...n, status: 'success' };
      if (n.id === 'n5') return { ...n, status: 'active', logs: ['[LINT] Running ESLint on updated AST'] };
      return n;
    }));
    setEdges(prev => prev.map(e => {
      if (e.source === 'n2' && e.target === 'n3') return { ...e, active: false };
      if (e.source === 'n3' && e.target === 'n5') return { ...e, active: true };
      return e;
    }));
    setSelectedNode('n5');
  };

  const handleRestart = () => {
    setNodes(INITIAL_NODES.map(n => ({ 
      ...n, 
      status: n.id === 'n1' ? 'active' : 'waiting',
      logs: n.id === 'n1' ? n.logs : []
    })));
    setEdges(INITIAL_EDGES.map(e => ({ ...e, active: false })));
    setIsPlaying(false);
    setIsPaused(false);
    setSelectedNode('n1');
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#58a6ff]/20 text-[#58a6ff] rounded-lg border border-[#58a6ff]/30">
            <BugPlay size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Visual Flow Debugger</h1>
            <div className="text-[10px] text-[#8b949e]">Real-time AI script execution path and state inspector</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-[#010409] p-1 rounded-lg border border-[#30363d]">
          <button 
            onClick={handleRestart}
            className="p-2 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded transition-colors"
            title="Restart Debugging"
          >
            <RotateCcw size={16} />
          </button>
          <div className="w-px h-6 bg-[#30363d] mx-1"></div>
          <button 
            onClick={() => { setIsPlaying(!isPlaying); setIsPaused(false); }}
            className={`p-2 rounded transition-colors flex items-center gap-2 ${isPlaying ? 'bg-[#f85149]/20 text-[#f85149]' : 'text-[#2ea043] hover:bg-[#238636]/20'}`}
            title={isPlaying ? "Pause Execution" : "Continue Execution"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button 
            onClick={handleStep}
            className="p-2 text-[#e3b341] hover:bg-[#e3b341]/20 rounded transition-colors flex items-center gap-2"
            title="Step Over Node"
          >
            <StepForward size={16} /> <span className="text-xs font-bold mr-1">Step</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Graph Canvas */}
        <div className="flex-1 relative bg-[#010409] overflow-hidden">
          <div className="absolute inset-0 pattern-grid-lg text-[#30363d]/30 opacity-50 pointer-events-none"></div>
          
          {/* SVG for Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#30363d" />
              </marker>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#58a6ff" />
              </marker>
              <linearGradient id="active-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#58a6ff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#58a6ff" stopOpacity="1" />
              </linearGradient>
            </defs>
            {edges.map((edge, i) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;
              
              const startX = sourceNode.x + 200; // node width
              const startY = sourceNode.y + 40;  // half node height
              const endX = targetNode.x;
              const endY = targetNode.y + 40;
              
              // Curvy path
              const path = `M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`;
              
              return (
                <g key={i}>
                  <path 
                    d={path} 
                    fill="none" 
                    stroke={edge.active ? "url(#active-line)" : "#30363d"} 
                    strokeWidth={edge.active ? 3 : 2}
                    markerEnd={edge.active ? "url(#arrow-blue)" : "url(#arrow-gray)"}
                    className={edge.active ? "animate-pulse" : ""}
                  />
                  {edge.active && (
                    <circle r="4" fill="#58a6ff">
                      <animateMotion dur="1.5s" repeatCount="indefinite" path={path} />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* HTML Nodes */}
          {nodes.map(node => (
            <div 
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={`absolute w-[200px] rounded-xl border p-3 cursor-pointer transition-all backdrop-blur-sm ${getStatusColor(node.status)} ${selectedNode === node.id ? 'ring-2 ring-white/20' : ''}`}
              style={{ left: node.x, top: node.y }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getIcon(node.type)}
                  <span className="text-xs font-bold">{node.label}</span>
                </div>
                {getStatusIcon(node.status)}
              </div>
              <div className="flex items-center justify-between mt-3 text-[10px] font-mono">
                <span className="text-[#8b949e]">ID: {node.id}</span>
                <span className="uppercase opacity-80">{node.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Inspector Panel */}
        <div className="w-96 bg-[#161b22] border-l border-[#30363d] flex flex-col z-10">
          <div className="p-3 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117]">
            <span className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <SearchCode size={14} className="text-[#58a6ff]" /> Node Inspector
            </span>
            {activeNodeData && (
               <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(activeNodeData.status).split(' ')[0]} ${getStatusColor(activeNodeData.status).split(' ')[2]}`}>
                 {activeNodeData.status.toUpperCase()}
               </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {activeNodeData ? (
              <div className="p-4 space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-xs font-bold text-[#8b949e] uppercase mb-2">Properties</h3>
                  <div className="bg-[#0d1117] border border-[#30363d] rounded p-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8b949e]">Label</span>
                      <span className="text-white">{activeNodeData.label}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8b949e]">Type</span>
                      <span className="text-white capitalize">{activeNodeData.type}</span>
                    </div>
                  </div>
                </div>

                {/* State Variables */}
                <div>
                  <h3 className="text-xs font-bold text-[#8b949e] uppercase mb-2 flex justify-between">
                    <span>Local State (Variables)</span>
                    <span className="text-[#58a6ff] cursor-pointer hover:underline text-[10px]">Edit</span>
                  </h3>
                  <div className="bg-[#0d1117] border border-[#30363d] rounded p-1">
                    <pre className="text-[11px] font-mono text-[#c9d1d9] p-2 overflow-x-auto custom-scrollbar">
                      <code dangerouslySetInnerHTML={{
                        __html: JSON.stringify(activeNodeData.data, null, 2)
                          .replace(/"([^"]+)":/g, '<span class="text-[#79c0ff]">$1:</span>')
                          .replace(/: "([^"]+)"/g, ': <span class="text-[#a5d6ff]">"$1"</span>')
                          .replace(/: ([0-9.]+)/g, ': <span class="text-[#79c0ff]">$1</span>')
                          .replace(/: (true|false)/g, ': <span class="text-[#ff7b72]">$1</span>')
                      }} />
                    </pre>
                  </div>
                </div>

                {/* Logs */}
                <div>
                  <h3 className="text-xs font-bold text-[#8b949e] uppercase mb-2">Execution Logs</h3>
                  <div className="bg-[#010409] border border-[#30363d] rounded p-3 h-48 overflow-y-auto font-mono text-[10px] space-y-1">
                    {activeNodeData.logs.length > 0 ? (
                      activeNodeData.logs.map((log, idx) => (
                        <div key={idx} className={`${log.includes('[WARN]') ? 'text-[#e3b341]' : log.includes('[ERROR]') ? 'text-[#f85149]' : 'text-[#8b949e]'}`}>
                          <span className="text-[#30363d] mr-2">10:45:{12 + idx}</span>
                          {log}
                        </div>
                      ))
                    ) : (
                      <div className="text-[#30363d] italic text-center mt-8">No logs emitted yet.</div>
                    )}
                    {activeNodeData.status === 'active' && (
                      <div className="text-[#58a6ff] animate-pulse">_ Running...</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#8b949e] text-center mt-10">Select a node in the graph to inspect its runtime state.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
