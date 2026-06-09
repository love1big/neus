import React, { useState, useRef, useEffect } from 'react';
import { Target, Search, Plus, Save, Play, Settings, Move, Mic, Flame, Zap, MousePointer2, GitCommit, GitBranch } from 'lucide-react';

interface NodeData {
  id: string;
  type: 'event' | 'animation' | 'sound' | 'vfx' | 'delay';
  title: string;
  x: number;
  y: number;
  inputs: string[];
  outputs: string[];
  color: string;
  icon: React.ReactNode;
  params: Record<string, string>;
}

interface Connection {
  id: string;
  fromNode: string;
  fromPort: string;
  toNode: string;
  toPort: string;
}

export default function ActionGraphEditor() {
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: 'n_start', type: 'event', title: 'Event Start', x: 50, y: 150, inputs: [], outputs: ['Out'], color: '#e3b341', icon: <Zap size={14} />, params: { 'Event Name': 'Trigger_JumpFX' } },
    { id: 'n_anim', type: 'animation', title: 'Play Animation', x: 300, y: 100, inputs: ['In'], outputs: ['Out', 'On Finished'], color: '#3fb950', icon: <Move size={14} />, params: { 'Anim Clip': 'JUMP_START' } },
    { id: 'n_sound', type: 'sound', title: 'Play Audio 3D', x: 600, y: 50, inputs: ['In'], outputs: ['Out'], color: '#bc8cff', icon: <Mic size={14} />, params: { 'Cue Asset': 'sfx_jump_01', 'Volume': '1.0' } },
    { id: 'n_vfx', type: 'vfx', title: 'Spawn Niagara', x: 600, y: 220, inputs: ['In'], outputs: ['Out'], color: '#ff7b72', icon: <Flame size={14} />, params: { 'System': 'VFX_DustTrail', 'Attach Point': 'Root' } },
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { id: 'c1', fromNode: 'n_start', fromPort: 'Out', toNode: 'n_anim', toPort: 'In' },
    { id: 'c2', fromNode: 'n_anim', fromPort: 'Out', toNode: 'n_sound', toPort: 'In' },
    { id: 'c3', fromNode: 'n_anim', fromPort: 'On Finished', toNode: 'n_vfx', toPort: 'In' },
  ]);

  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingNode(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode) {
      setNodes(nodes.map(n => {
        if (n.id === draggingNode) {
          return { ...n, x: n.x + e.movementX, y: n.y + e.movementY };
        }
        return n;
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMenuPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const closeMenu = () => setMenuPos(null);

  const addNode = (type: NodeData['type']) => {
    if (!menuPos) return;
    let title = 'Node';
    let color = '#fff';
    let icon = <MousePointer2 size={14} />;
    let inputs = ['In'];
    let outputs = ['Out'];
    let params: Record<string, string> = {};

    if (type === 'event') { title = 'Event Receiver'; color = '#e3b341'; icon = <Zap size={14} />; inputs = []; params = { 'Event ID': 'MyEvent' }; }
    else if (type === 'animation') { title = 'Play Sequence'; color = '#3fb950'; icon = <Move size={14} />; outputs.push('On Finished'); params = { 'Clip': 'None' }; }
    else if (type === 'sound') { title = 'Play Audio 2D'; color = '#bc8cff'; icon = <Mic size={14} />; params = { 'Asset': 'None' }; }
    else if (type === 'vfx') { title = 'Spawn Particle'; color = '#ff7b72'; icon = <Flame size={14} />; params = { 'System': 'None' }; }
    else if (type === 'delay') { title = 'Delay'; color = '#58a6ff'; icon = <Settings size={14} />; params = { 'Seconds': '1.0' }; }

    const newNode: NodeData = {
      id: `n_${Date.now()}`,
      type,
      title,
      x: menuPos.x,
      y: menuPos.y,
      inputs,
      outputs,
      color,
      icon,
      params
    };

    setNodes([...nodes, newNode]);
    closeMenu();
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Header */}
      <div className="h-14 border-b border-[#30363d] flex items-center justify-between px-6 bg-[#161b22] shrink-0">
        <div className="flex items-center gap-3">
          <GitBranch className="text-[#bc8cff]" size={20} />
          <div>
            <h1 className="text-sm font-bold text-white">Action Graph Editor</h1>
            <p className="text-[10px] text-[#8b949e]">Visual logic chain builder supplementing the Manual Sequence Recorder</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded textxs font-bold transition-colors border border-[#30363d] flex items-center gap-2">
             <Play size={14} /> Simulate Action Chain
           </button>
           <button className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded textxs font-bold transition-colors shadow-sm flex items-center gap-2">
             <Save size={14} /> Compile Graph
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Properties Panel */}
        <div className="w-64 border-r border-[#30363d] bg-[#0d1117] flex flex-col shrink-0">
           <div className="p-3 border-b border-[#30363d]">
              <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">Node Arsenal</span>
           </div>
           
           <div className="p-2 flex flex-col gap-1 overflow-y-auto">
              <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-1 mt-2 px-2">Triggers</div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded cursor-grab">
                 <Zap size={14} className="text-[#e3b341]"/> <span className="text-xs">Event Target</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded cursor-grab">
                 <MousePointer2 size={14} className="text-[#e3b341]"/> <span className="text-xs">Timeline Trigger</span>
              </div>
              
              <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-1 mt-4 px-2">Actions</div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded cursor-grab">
                 <Move size={14} className="text-[#3fb950]"/> <span className="text-xs">Play Character Animation</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded cursor-grab">
                 <Mic size={14} className="text-[#bc8cff]"/> <span className="text-xs">Trigger Audio Asset</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded cursor-grab">
                 <Flame size={14} className="text-[#ff7b72]"/> <span className="text-xs">Spawn VFX System</span>
              </div>
              
              <div className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider mb-1 mt-4 px-2">Flow Control</div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded cursor-grab">
                 <Settings size={14} className="text-[#58a6ff]"/> <span className="text-xs">Delay / Wait</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded cursor-grab">
                 <GitBranch size={14} className="text-[#58a6ff]"/> <span className="text-xs">Branch (Condition)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded cursor-grab">
                 <GitCommit size={14} className="text-[#58a6ff]"/> <span className="text-xs">Sequence</span>
              </div>
           </div>
        </div>

        {/* Canvas */}
        <div 
           className="flex-1 relative bg-[#040506] overflow-hidden"
           ref={containerRef}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}
           onMouseLeave={handleMouseUp}
           onContextMenu={handleContextMenu}
           onClick={closeMenu}
        >
           {/* Grid */}
           <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#161b22 1px, transparent 1px), linear-gradient(90deg, #161b22 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }} />

           {/* SPLINES */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
             {connections.map(conn => {
                 const fromNode = nodes.find(n => n.id === conn.fromNode);
                 const toNode = nodes.find(n => n.id === conn.toNode);
                 if(!fromNode || !toNode) return null;
                 
                 const outIndex = fromNode.outputs.indexOf(conn.fromPort);
                 const inIndex = toNode.inputs.indexOf(conn.toPort);
                 
                 const startX = fromNode.x + 220; // assumed node width approx 220
                 const startY = fromNode.y + 40 + (outIndex * 24);
                 
                 const endX = toNode.x;
                 const endY = toNode.y + 40 + (inIndex * 24);

                 // Cubic bezier curve logic
                 const cp1x = startX + 50;
                 const cp1y = startY;
                 const cp2x = endX - 50;
                 const cp2y = endY;

                 return (
                    <path 
                      key={conn.id}
                      d={`M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`}
                      fill="none"
                      stroke="#c9d1d9"
                      strokeWidth="2"
                      className="opacity-60"
                    />
                 )
             })}
           </svg>

           {/* Nodes */}
           {nodes.map(node => (
             <div 
               key={node.id}
               className="absolute z-10 w-56 bg-[#0d1117] border border-[#30363d] rounded-lg shadow-xl overflow-hidden"
               style={{ left: node.x, top: node.y }}
               onMouseDown={(e) => handleMouseDown(node.id, e)}
             >
               {/* Node Header */}
               <div className="px-3 py-2 flex items-center gap-2 cursor-move" style={{ backgroundColor: `${node.color}20`, borderBottom: `1px solid ${node.color}50` }}>
                  <div style={{ color: node.color }}>{node.icon}</div>
                  <span className="text-xs font-bold truncate" style={{ color: node.color }}>{node.title}</span>
               </div>
               
               {/* Node Body */}
               <div className="p-2 flex flex-col gap-2">
                 {(node.inputs.length > 0 || node.outputs.length > 0) && (
                    <div className="flex justify-between w-full text-[10px] text-[#c9d1d9] mb-1">
                       {/* Inputs */}
                       <div className="flex flex-col gap-1 items-start">
                         {node.inputs.map(inp => (
                            <div key={inp} className="flex items-center gap-1.5 h-5">
                               <div className="w-2 h-2 rounded-full border border-white bg-[#0d1117]" />
                               <span>{inp}</span>
                            </div>
                         ))}
                       </div>
                       
                       {/* Outputs */}
                       <div className="flex flex-col gap-1 items-end">
                         {node.outputs.map(out => (
                            <div key={out} className="flex items-center gap-1.5 h-5">
                               <span>{out}</span>
                               <div className="w-2 h-2 rounded-full border border-white bg-white" />
                            </div>
                         ))}
                       </div>
                    </div>
                 )}

                 {/* Params */}
                 {Object.keys(node.params).length > 0 && (
                    <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col gap-2 mt-1">
                       {Object.entries(node.params).map(([key, val]) => (
                          <div key={key} className="flex flex-col gap-1">
                             <label className="text-[9px] text-[#8b949e] uppercase font-bold">{key}</label>
                             <input type="text" defaultValue={val} className="bg-[#0d1117] border border-[#30363d] text-[10px] px-1.5 py-1 rounded outline-none text-[#c9d1d9] font-mono" onMouseDown={e => e.stopPropagation()}/>
                          </div>
                       ))}
                    </div>
                 )}
               </div>
             </div>
           ))}

           {/* Context Menu */}
           {menuPos && (
             <div 
               className="absolute z-50 bg-[#161b22] border border-[#30363d] rounded-md shadow-2xl py-1 w-48 text-xs text-[#c9d1d9]"
               style={{ left: menuPos.x, top: menuPos.y }}
             >
                <div className="px-3 py-1 text-[10px] font-bold uppercase text-[#8b949e] border-b border-[#30363d] mb-1">Add Action Node</div>
                <button className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors" onClick={() => addNode('animation')}>Play Animation</button>
                <button className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors" onClick={() => addNode('sound')}>Trigger Sound</button>
                <button className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors" onClick={() => addNode('vfx')}>Apply VFX</button>
                <button className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors" onClick={() => addNode('delay')}>Delay / Wait</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
