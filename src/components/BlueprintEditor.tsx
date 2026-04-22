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
import { Play, StepForward, StopCircle, TerminalSquare, AlertCircle, Variable, Search, UserSquare, Waypoints, Plus, FileCode2, Clock, GitCommit, Settings2, BoxSelect, Cpu, Layers, Bot, Sparkles, Keyboard, Grid3X3 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// --- Custom Nodes for Blueprint ---

const nodeStyle = {
  background: '#161b22',
  border: '1px solid #30363d',
  borderRadius: '8px',
  color: '#c9d1d9',
  minWidth: '220px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)'
};

const ExecHandle = ({ id, type, position, top, label }: any) => (
  <div className="flex items-center text-[10px] relative" style={{ height: '24px' }}>
    {type === 'target' && (
      <>
        <Handle type="target" position={position} id={id} style={{ top, left: '-12px', background: 'white', borderRadius: '0', width: '10px', height: '14px', clipPath: 'polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%)' }} />
        <span className="text-white ml-2 font-bold tracking-wide">{label}</span>
      </>
    )}
    {type === 'source' && (
      <>
        <span className="text-white pr-2 text-right w-full font-bold tracking-wide">{label}</span>
        <Handle type="source" position={position} id={id} style={{ top, right: '-12px', background: 'white', borderRadius: '0', width: '10px', height: '14px', clipPath: 'polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%)' }} />
      </>
    )}
  </div>
);

const DataHandle = ({ id, type, position, top, label, color, inputType }: any) => (
  <div className="flex items-center text-[10px] justify-between relative w-full px-1" style={{ height: '24px' }}>
    {type === 'target' && (
       <div className="flex items-center w-full">
         <Handle type="target" position={position} id={id} style={{ top, left: '-12px', background: color, width: '12px', height: '12px', border: '2px solid #161b22' }} />
         <span className="text-[#8b949e] ml-2 font-semibold">{label}</span>
         {inputType && <input type={inputType} className="ml-auto w-12 bg-[#0d1117] border border-[#30363d] px-1 text-white rounded text-[9px] outline-none h-4 text-right" />}
       </div>
    )}
    {type === 'source' && (
       <div className="flex items-center w-full justify-end">
         <span className="text-[#8b949e] mr-2 font-semibold">{label}</span>
         <Handle type="source" position={position} id={id} style={{ top, right: '-12px', background: color, width: '12px', height: '12px', border: '2px solid #161b22' }} />
       </div>
    )}
  </div>
);

// 1. Event BeginPlay
const EventBeginPlayNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#f85149'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#f85149]/30 to-[#f85149]/5 border-b border-[#f85149]/40 rounded-t-lg text-[13px] font-bold text-[#f85149] uppercase tracking-wider flex items-center gap-2">
      <Play size={14}/> Event BeginPlay
    </div>
    <div className="p-2 py-3 flex flex-col">
      <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
    </div>
  </div>
);

// 2. Event Tick
const EventTickNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#f85149'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#f85149]/30 to-[#f85149]/5 border-b border-[#f85149]/40 rounded-t-lg text-[13px] font-bold text-[#f85149] uppercase tracking-wider flex items-center gap-2">
      <StepForward size={14}/> Event Tick
    </div>
    <div className="p-2 py-3 flex flex-col gap-2">
      <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      <DataHandle id="delta" type="source" position={Position.Right} top="50%" label="Delta Seconds" color="#3fb950" />
    </div>
  </div>
);

// 3. Print String
const PrintStringNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#58a6ff'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/30 to-[#58a6ff]/5 border-b border-[#58a6ff]/40 rounded-t-lg text-[13px] font-bold text-white tracking-wider flex items-center gap-2">
      <TerminalSquare size={14} className="text-[#58a6ff]"/> Print String
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="str" type="target" position={Position.Left} top="50%" label="In String" color="#bc8cff" inputType="text" />
      <DataHandle id="dur" type="target" position={Position.Left} top="50%" label="Duration" color="#3fb950" inputType="number" />
    </div>
  </div>
);

// 4. Branch
const BranchNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#c9d1d9'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#c9d1d9]/20 to-[#c9d1d9]/0 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-white flex items-center gap-2">
      <AlertCircle size={14} className="text-[#c9d1d9]"/> Branch
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execTrue" type="source" position={Position.Right} top="50%" label="True" />
      </div>
      <div className="flex justify-between w-full">
        <DataHandle id="cond" type="target" position={Position.Left} top="50%" label="Condition" color="#f85149" />
        <ExecHandle id="execFalse" type="source" position={Position.Right} top="50%" label="False" />
      </div>
    </div>
  </div>
);

// 5. Get Player Character
const GetPlayerNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '200px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#3fb950]/20 to-[#3fb950]/0 border-b border-[#3fb950]/30 rounded-t-lg text-[12px] font-bold text-[#3fb950] flex items-center gap-2">
      <UserSquare size={14}/> Get Player Character
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="idx" type="target" position={Position.Left} top="50%" label="Player Index" color="#3fb950" inputType="number" />
      <DataHandle id="char" type="source" position={Position.Right} top="50%" label="Return Value" color="#58a6ff" />
    </div>
  </div>
);

// 6. Set Actor Location
const SetActorLocationNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#58a6ff'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/20 to-[#58a6ff]/5 border-b border-[#58a6ff]/30 rounded-t-lg text-[13px] font-bold text-white flex items-center gap-2">
      <Waypoints size={14} className="text-[#58a6ff]"/> Set Actor Location
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="target" type="target" position={Position.Left} top="50%" label="Target" color="#58a6ff" />
      <DataHandle id="loc" type="target" position={Position.Left} top="50%" label="New Location" color="#e3b341" />
    </div>
  </div>
);

// 7. Sequence
const SequenceNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#c9d1d9', minWidth: '160px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#c9d1d9]/20 to-[#c9d1d9]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-white flex items-center gap-2">
      <GitCommit size={14} className="text-[#c9d1d9]"/> Sequence
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="then0" type="source" position={Position.Right} top="50%" label="Then 0" />
      </div>
      <div className="flex justify-between w-full">
        <div className="w-[10px]"></div>
        <ExecHandle id="then1" type="source" position={Position.Right} top="50%" label="Then 1" />
      </div>
    </div>
  </div>
);

// 8. Delay
const DelayNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#c9d1d9'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#c9d1d9]/20 to-[#c9d1d9]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-white flex items-center gap-2">
      <Clock size={14} className="text-[#e3b341]"/> Delay
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Completed" />
      </div>
      <DataHandle id="dur" type="target" position={Position.Left} top="50%" label="Duration" color="#3fb950" inputType="number" />
    </div>
  </div>
);

// 9. Math Multiply (Float)
const MathMultiplyNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#3fb950] font-bold">×</span> Multiply
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="A" color="#3fb950" inputType="number" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="B" color="#3fb950" inputType="number" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="" color="#3fb950" />
      </div>
    </div>
  </div>
);

// 10. Math Add (Vector)
const MathAddVectorNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#e3b341] font-bold">+</span> Add (Vector)
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="A" color="#e3b341" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="B" color="#e3b341" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="" color="#e3b341" />
      </div>
    </div>
  </div>
);

// 11. Cast to Character
const CastNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#58a6ff'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/20 to-[#58a6ff]/5 border-b border-[#58a6ff]/30 rounded-t-lg text-[13px] font-bold text-white flex items-center gap-2">
      <Cpu size={14} className="text-[#58a6ff]"/> Cast To PlayerCharacter
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <div className="flex justify-between w-full">
        <DataHandle id="obj" type="target" position={Position.Left} top="50%" label="Object" color="#58a6ff" />
        <ExecHandle id="execFail" type="source" position={Position.Right} top="50%" label="Cast Failed" />
      </div>
      <DataHandle id="asChar" type="source" position={Position.Right} top="50%" label="As PlayerCharacter" color="#58a6ff" />
    </div>
  </div>
);

// 12. Spawn Actor
const SpawnActorNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#bc8cff'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#bc8cff]/30 rounded-t-lg text-[13px] font-bold text-white flex items-center gap-2">
      <BoxSelect size={14} className="text-[#bc8cff]"/> SpawnActor from Class
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="class" type="target" position={Position.Left} top="50%" label="Class" color="#bc8cff" />
      <DataHandle id="transform" type="target" position={Position.Left} top="50%" label="Spawn Transform" color="#e3b341" />
      <DataHandle id="return" type="source" position={Position.Right} top="50%" label="Return Value" color="#58a6ff" />
    </div>
  </div>
);

// 13. Input Key Event
const InputKeyNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#f85149'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#f85149]/30 to-[#f85149]/5 border-b border-[#f85149]/40 rounded-t-lg text-[13px] font-bold text-[#f85149] uppercase tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Keyboard size={14}/> Input Action</div>
      <select className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white uppercase"><option>Spacebar</option><option>Enter</option><option>W</option><option>A</option><option>S</option><option>D</option></select>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <ExecHandle id="execPressed" type="source" position={Position.Right} top="50%" label="Pressed" />
      <ExecHandle id="execReleased" type="source" position={Position.Right} top="50%" label="Released" />
    </div>
  </div>
);

// 14. 2D Array
const Array2DNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#e3b341]/20 to-[#e3b341]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#e3b341] flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Grid3X3 size={14}/> 2D Data Array</div>
      <span className="text-[10px] text-[#8b949e]">Grid Map</span>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] flex gap-2">
         <DataHandle id="x" type="target" position={Position.Left} top="50%" label="X" color="#3fb950" inputType="number" />
         <DataHandle id="y" type="target" position={Position.Left} top="50%" label="Y" color="#3fb950" inputType="number" />
      </div>
      <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] flex flex-col gap-2 mt-1">
         <DataHandle id="setVal" type="target" position={Position.Left} top="50%" label="Set Value" color="#bc8cff" inputType="text" />
         <DataHandle id="getVal" type="source" position={Position.Right} top="50%" label="Get Value" color="#bc8cff" />
      </div>
    </div>
  </div>
);


const nodeTypes = {
  beginPlay: EventBeginPlayNode,
  tick: EventTickNode,
  print: PrintStringNode,
  branch: BranchNode,
  getPlayer: GetPlayerNode,
  setLoc: SetActorLocationNode,
  sequence: SequenceNode,
  delay: DelayNode,
  mathMul: MathMultiplyNode,
  mathAddV: MathAddVectorNode,
  cast: CastNode,
  spawn: SpawnActorNode,
  inputKey: InputKeyNode,
  array2D: Array2DNode
};

const initialNodes: Node[] = [
  { id: 'bp_input', type: 'inputKey', position: { x: 50, y: 500 }, data: {} },
  { id: 'bp_array', type: 'array2D', position: { x: 300, y: 500 }, data: {} },
  { id: 'bp1', type: 'beginPlay', position: { x: 50, y: 150 }, data: {} },
  { id: 'bp_seq', type: 'sequence', position: { x: 300, y: 150 }, data: {} },
  { id: 'bp2', type: 'print', position: { x: 550, y: 80 }, data: {} },
  { id: 'bp_delay', type: 'delay', position: { x: 550, y: 220 }, data: {} },
  { id: 'bp_spawn', type: 'spawn', position: { x: 800, y: 220 }, data: {} }
];

const initialEdges: Edge[] = [
  { id: 'e_input', source: 'bp_input', target: 'bp_array', sourceHandle: 'execPressed', targetHandle: 'execIn', type: 'smoothstep', style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e1', source: 'bp1', target: 'bp_seq', sourceHandle: 'execOut', targetHandle: 'execIn', type: 'smoothstep', style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e2', source: 'bp_seq', target: 'bp2', sourceHandle: 'then0', targetHandle: 'execIn', type: 'smoothstep', style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e3', source: 'bp_seq', target: 'bp_delay', sourceHandle: 'then1', targetHandle: 'execIn', type: 'smoothstep', style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e4', source: 'bp_delay', target: 'bp_spawn', sourceHandle: 'execOut', targetHandle: 'execIn', type: 'smoothstep', style: { stroke: 'white', strokeWidth: 2 } }
];

export default function BlueprintEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const [menu, setMenu] = useState<{ x: number, y: number, paneX: number, paneY: number } | null>(null);
  const flowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({
      ...params, 
      type: 'smoothstep',
      style: { stroke: params.sourceHandle === 'execOut' || params.sourceHandle === 'execTrue' || params.sourceHandle === 'execFalse' ? 'white' : '#58a6ff', strokeWidth: 2 }
  }, eds)), [setEdges]);

  // Handle right click
  const onPaneContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!flowWrapper.current) return;
    const bounds = flowWrapper.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    
    // Naive coordinate mapping for simplicity (not perfectly translating viewport scale but ok for demo)
    setMenu({ x, y, paneX: x, paneY: y });
  }, []);

  const addNode = (type: string, menuProps: any) => {
    const newNode: Node = {
      id: uuidv4(),
      type,
      position: { x: menuProps.paneX, y: menuProps.paneY },
      data: { label: type }
    };
    setNodes((nds) => nds.concat(newNode));
    setMenu(null);
  };

  return (
    <div className="w-full h-full bg-[#0d1117] flex flex-col font-['Helvetica_Neue',Arial,sans-serif] relative" ref={flowWrapper}>
      <div className="h-10 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 justify-between shrink-0">
         <div className="flex items-center gap-4 text-[#c9d1d9] text-[12px] font-bold">
            <span className="flex items-center gap-2"><Waypoints size={16} className="text-[#3fb950]"/> BP_PlayerCharacter</span>
         </div>
         <div className="flex gap-2">
            <button className="flex items-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1 rounded text-[11px] font-bold transition-colors">
              <Play size={12}/> Compile & Play
            </button>
         </div>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onPaneContextMenu={onPaneContextMenu}
        fitView
        className="bg-[#0d1117] relative bp-flow"
      >
        <Background gap={40} color="#30363d" />
        <Controls className="bg-[#161b22] border-[#30363d] fill-[#c9d1d9]" />
        
        <Panel position="top-left" className="bg-[#161b22]/90 backdrop-blur border border-[#30363d] rounded-lg shadow-lg w-64 flex flex-col pointer-events-auto h-[400px]">
           <div className="px-3 py-2 border-b border-[#30363d] font-bold text-[#c9d1d9] text-[12px] flex justify-between items-center bg-[#0d1117]">
             My Blueprint
           </div>
           <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-4 text-[11px] text-[#c9d1d9] custom-scrollbar">
             
             <div>
                <div className="font-bold text-[#8b949e] flex justify-between items-center uppercase mb-1">Variables <button><Plus size={12}/></button></div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#21262d] rounded cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[#f85149]"></div> <span className="flex-1">IsFalling</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#21262d] rounded cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div> <span className="flex-1">Health</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#21262d] rounded cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[#bc8cff]"></div> <span className="flex-1">PlayerName</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#21262d] rounded cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div> <span className="flex-1">SpawnTarget</span>
                </div>
             </div>

             <div>
                <div className="font-bold text-[#8b949e] flex justify-between items-center uppercase mb-1">Functions <button><Plus size={12}/></button></div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#21262d] rounded cursor-pointer">
                  <Variable size={12} className="text-[#58a6ff]"/> <span className="flex-1">TakeDamage</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#21262d] rounded cursor-pointer">
                  <Variable size={12} className="text-[#58a6ff]"/> <span className="flex-1">OnInteract</span>
                </div>
             </div>

             <div>
                <div className="font-bold text-[#8b949e] flex justify-between items-center uppercase mb-1">Macros <button><Plus size={12}/></button></div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#21262d] rounded cursor-pointer text-[#8b949e]">
                  <Layers size={12}/> <span className="flex-1">CheckInventory</span>
                </div>
             </div>

             <div>
                <div className="font-bold text-[#8b949e] flex justify-between items-center uppercase mb-1">Event Dispatchers <button><Plus size={12}/></button></div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#21262d] rounded cursor-pointer text-[#f85149]">
                  <TerminalSquare size={12}/> <span className="flex-1">OnDeath</span>
                </div>
             </div>

             <div>
                <div className="font-bold text-[#8b949e] flex justify-between items-center uppercase mb-1">FunctionLibrary <button><Plus size={12}/></button></div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#21262d] rounded cursor-pointer">
                  <FileCode2 size={12} className="text-[#e3b341]"/> <span className="flex-1 text-[#e3b341]">MyMathLibrary.js</span>
                </div>
             </div>

           </div>
        </Panel>
      </ReactFlow>

      {/* Offline AI Command Bar for Blueprints */}
      <Panel position="bottom-center" className="w-[500px] mb-4 pointer-events-auto z-50 absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="bg-[#161b22]/90 backdrop-blur-md border border-[#30363d] rounded-xl shadow-2xl p-2 flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
             <span className="text-[10px] text-[#3fb950] font-mono font-bold flex items-center gap-1"><Bot size={12} /> AI AUTO-NODE GENERATOR</span>
             <span className="text-[10px] text-[#8b949e]">Offline Logic Assistant</span>
          </div>
          <div className="flex gap-2">
             <input 
               type="text" 
               placeholder="e.g., 'Make player jump when Spacebar is pressed...'"
               className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#c9d1d9] px-4 py-2 outline-none focus:border-[#58a6ff] transition-colors font-semibold"
               onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                     e.currentTarget.value = '';
                     alert('AI Offline is analyzing natural language to generate Blueprint logic nodes...');
                  }
               }}
             />
             <button className="bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] rounded-lg p-2 transition-colors flex items-center justify-center font-bold px-4 gap-2">
                <Sparkles size={16} /> Auto Build
             </button>
          </div>
          <div className="flex gap-2 px-1 pb-1">
             <button className="text-[10px] bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] px-2 py-1 rounded transition-colors border border-[#30363d]">Generate Movement Logic</button>
             <button className="text-[10px] bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] px-2 py-1 rounded transition-colors border border-[#30363d]">Add Enemy Spawner</button>
             <button className="text-[10px] bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] px-2 py-1 rounded transition-colors border border-[#30363d]">Clean / Optimize Graph</button>
          </div>
        </div>
      </Panel>

      {/* Context Menu for adding nodes */}
      {menu && (
        <div 
          className="absolute z-50 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl w-56 py-1 text-[12px] text-[#c9d1d9] flex flex-col items-start overflow-y-auto max-h-[400px] custom-scrollbar"
          style={{ left: menu.x, top: menu.y }}
        >
          <div className="px-3 py-1.5 relative w-full border-b border-[#30363d]">
            <input type="text" placeholder="Search Actions..." className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 text-[11px] outline-none font-semibold text-white focus:border-[#58a6ff] transition-colors" autoFocus/>
          </div>
          
          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold mt-1 shrink-0 bg-[#0d1117]">Events</div>
          <button onClick={() => addNode('beginPlay', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Play size={10} className="text-[#f85149]"/> Event BeginPlay</button>
          <button onClick={() => addNode('tick', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><StepForward size={10} className="text-[#f85149]"/> Event Tick</button>
          <button onClick={() => addNode('inputKey', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Keyboard size={10} className="text-[#f85149]"/> Input Key Action</button>
          
          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Control Flow</div>
          <button onClick={() => addNode('branch', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><AlertCircle size={10} className="text-[#c9d1d9]"/> Branch (If)</button>
          <button onClick={() => addNode('sequence', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><GitCommit size={10} className="text-[#c9d1d9]"/> Sequence</button>
          <button onClick={() => addNode('delay', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Clock size={10} className="text-[#e3b341]"/> Delay</button>
          
          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Action & Casting</div>
          <button onClick={() => addNode('spawn', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><BoxSelect size={10} className="text-[#bc8cff]"/> SpawnActor from Class</button>
          <button onClick={() => addNode('cast', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Cpu size={10} className="text-[#58a6ff]"/> Cast To PlayerCharacter</button>
          <button onClick={() => addNode('setLoc', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Waypoints size={10} className="text-[#58a6ff]"/> Set Actor Location</button>
          
          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Functions & Math</div>
          <button onClick={() => addNode('getPlayer', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#3fb950]"><UserSquare size={10}/> Get Player Character</button>
          <button onClick={() => addNode('mathMul', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#3fb950] font-bold">× Multiply (Float)</button>
          <button onClick={() => addNode('mathAddV', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#e3b341] font-bold">+ Add (Vector)</button>
          
          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Utilities & Data</div>
          <button onClick={() => addNode('print', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><TerminalSquare size={10} className="text-[#58a6ff]"/> Print String</button>
          <button onClick={() => addNode('array2D', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Grid3X3 size={10} className="text-[#e3b341]"/> 2D Data Array</button>
        </div>
      )}

      {menu && <div className="absolute inset-0 z-40" onClick={() => setMenu(null)}></div>}
    </div>
  );
}
