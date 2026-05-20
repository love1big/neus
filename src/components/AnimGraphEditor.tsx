import React, { useState, useCallback } from 'react';
import { PersonStanding, Bone, Play, Pause, FastForward, CheckSquare, Maximize2, Settings, Minimize2, Move, RefreshCw, GitMerge, Combine, Sparkles, BrainCircuit, Activity, Orbit } from 'lucide-react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodeStyle = {
  background: '#161b22',
  border: '1px solid #30363d',
  borderRadius: '8px',
  color: '#c9d1d9',
  fontSize: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

const Header = ({ title, color, icon: Icon }: { title: string; color: string, icon: any }) => (
  <div style={{ backgroundColor: `${color}20`, borderBottom: `1px solid ${color}50` }} className="p-2 rounded-t-[7px] flex items-center gap-2 font-bold text-[10px]">
    <Icon size={12} color={color} />
    <span style={{ color }}>{title}</span>
  </div>
);

const OutputNode = ({ data }: { data: any }) => (
  <div style={nodeStyle} className="min-w-[150px]">
    <Header title="Output Pose" color="#3fb950" icon={PersonStanding} />
    <div className="p-3 relative flex items-center justify-between">
      <Handle type="target" position={Position.Left} id="pose" style={{ top: '50%', background: '#8b949e' }} />
      <span className="text-[#8b949e] ml-2 font-bold">Result</span>
    </div>
  </div>
);

const AnimSequenceNode = ({ data }: { data: any }) => (
  <div style={nodeStyle} className="min-w-[160px]">
    <Header title="Animation Sequence" color="#58a6ff" icon={Activity} />
    <div className="p-3 relative flex flex-col gap-2">
      <select className="w-full bg-[#0d1117] border border-[#30363d] text-[11px] text-[#c9d1d9] rounded px-1 py-1 outline-none">
         <option>Idle_Rifle</option>
         <option>Run_Forward</option>
         <option>Jump_Start</option>
         <option>Death_01</option>
      </select>
      <label className="flex items-center gap-2 text-[#8b949e] text-[10px]">
        <input type="checkbox" defaultChecked className="accent-[#58a6ff]" /> Loop
      </label>
      <div className="flex justify-end mt-2">
        <span className="text-[#8b949e] mr-2 text-[10px]">Pose</span>
        <Handle type="source" position={Position.Right} id="pose" style={{ top: '80%', background: '#c9d1d9' }} />
      </div>
    </div>
  </div>
);

const BlendTreeNode = ({ data }: { data: any }) => (
  <div style={nodeStyle} className="min-w-[180px]">
    <Header title="Blend Tree (1D)" color="#e3b341" icon={Combine} />
    <div className="p-3 relative flex flex-col gap-2">
      <div className="flex justify-between items-center text-[10px]">
        <Handle type="target" position={Position.Left} id="speed" style={{ top: 35, background: '#e3b341' }} />
        <span className="text-[#8b949e] ml-2">Speed (float)</span>
      </div>
      <div className="flex justify-between items-center text-[10px] mt-2">
        <Handle type="target" position={Position.Left} id="anim1" style={{ top: 60, background: '#c9d1d9' }} />
        <span className="text-[#8b949e] ml-2">Pose 0</span>
      </div>
      <div className="flex justify-between items-center text-[10px]">
        <Handle type="target" position={Position.Left} id="anim2" style={{ top: 80, background: '#c9d1d9' }} />
        <span className="text-[#8b949e] ml-2">Pose 1</span>
      </div>
      <div className="flex justify-end mt-2">
        <span className="text-[#8b949e] mr-2 text-[10px]">Blended</span>
        <Handle type="source" position={Position.Right} id="pose" style={{ top: 110, background: '#c9d1d9' }} />
      </div>
    </div>
  </div>
);

const StateMachineNode = ({ data }: { data: any }) => (
  <div style={nodeStyle} className="min-w-[150px]">
    <Header title="State Machine" color="#bc8cff" icon={GitMerge} />
    <div className="p-3 relative flex flex-col gap-2">
      <div className="text-center text-[#c9d1d9] text-[10px] font-bold py-1 bg-[#0d1117] rounded border border-[#30363d]">Locomotion</div>
      <div className="flex justify-end mt-2">
        <span className="text-[#8b949e] mr-2 text-[10px]">Pose</span>
        <Handle type="source" position={Position.Right} id="pose" style={{ top: '80%', background: '#c9d1d9' }} />
      </div>
    </div>
  </div>
);

const IKNode = ({ data }: { data: any }) => (
  <div style={nodeStyle} className="min-w-[180px]">
    <Header title="Full Body IK" color="#f85149" icon={Bone} />
    <div className="p-3 relative flex flex-col gap-2">
      <div className="flex justify-between items-center text-[10px]">
        <Handle type="target" position={Position.Left} id="in_pose" style={{ top: 35, background: '#c9d1d9' }} />
        <span className="text-[#8b949e] ml-2">Input Pose</span>
      </div>
      <div className="flex justify-between items-center text-[10px] mt-2">
        <Handle type="target" position={Position.Left} id="effector" style={{ top: 65, background: '#8b949e' }} />
        <span className="text-[#8b949e] ml-2">Effector Transform</span>
      </div>
      <div className="text-[9px] text-[#8b949e] mt-1 bg-[#0d1117] p-1 rounded font-mono">Bone: hand_r</div>
      <div className="flex justify-end mt-2">
        <span className="text-[#8b949e] mr-2 text-[10px]">Output Pose</span>
        <Handle type="source" position={Position.Right} id="pose" style={{ top: 120, background: '#c9d1d9' }} />
      </div>
    </div>
  </div>
);

const FloatParameterNode = ({ data }: { data: any }) => (
  <div style={nodeStyle} className="min-w-[120px]">
    <Header title="Float Parameter" color="#58a6ff" icon={Settings} />
    <div className="p-3 relative flex flex-col gap-2">
      <input type="text" defaultValue="Speed" className="w-full bg-[#0d1117] border border-[#30363d] text-[11px] text-[#c9d1d9] rounded px-1 py-1 outline-none text-center font-mono" />
      <div className="flex justify-end mt-1">
        <Handle type="source" position={Position.Right} id="val" style={{ top: '70%', background: '#e3b341' }} />
      </div>
    </div>
  </div>
);

const AiAnimNode = ({ data }: { data: any }) => (
  <div style={nodeStyle} className="min-w-[160px] border-[#bc8cff]/50">
    <Header title="AI Generation" color="#bc8cff" icon={Sparkles} />
    <div className="p-3 relative flex flex-col gap-2">
      <div className="text-[9px] text-[#8b949e] font-mono italic">"Heavy March"</div>
      <div className="flex justify-end mt-2">
        <span className="text-[#8b949e] mr-2 text-[10px]">Pose</span>
        <Handle type="source" position={Position.Right} id="pose" style={{ top: '80%', background: '#c9d1d9' }} />
      </div>
    </div>
  </div>
);

const nodeTypes = {
  output: OutputNode,
  animSequence: AnimSequenceNode,
  blendTree: BlendTreeNode,
  stateMachine: StateMachineNode,
  ik: IKNode,
  floatParam: FloatParameterNode,
  aiAnim: AiAnimNode,
};

const initialNodes: Node[] = [
  { id: 'output', type: 'output', position: { x: 800, y: 250 }, data: {} },
  { id: 'ik', type: 'ik', position: { x: 550, y: 250 }, data: {} },
  { id: 'blend', type: 'blendTree', position: { x: 300, y: 200 }, data: {} },
  { id: 'state', type: 'stateMachine', position: { x: 50, y: 150 }, data: {} },
  { id: 'ai', type: 'aiAnim', position: { x: 50, y: 300 }, data: {} },
  { id: 'speed', type: 'floatParam', position: { x: 50, y: 50 }, data: {} },
];

const initialEdges: Edge[] = [
  { id: 'e-blend-ik', source: 'blend', target: 'ik', sourceHandle: 'pose', targetHandle: 'in_pose', animated: true, style: { stroke: '#e3b341', strokeWidth: 2 } },
  { id: 'e-ik-out', source: 'ik', target: 'output', sourceHandle: 'pose', targetHandle: 'pose', animated: true, style: { stroke: '#f85149', strokeWidth: 2 } },
  { id: 'e-state-blend', source: 'state', target: 'blend', sourceHandle: 'pose', targetHandle: 'anim1', animated: true, style: { stroke: '#bc8cff', strokeWidth: 2 } },
  { id: 'e-ai-blend', source: 'ai', target: 'blend', sourceHandle: 'pose', targetHandle: 'anim2', animated: true, style: { stroke: '#bc8cff', strokeWidth: 2 } },
  { id: 'e-speed-blend', source: 'speed', target: 'blend', sourceHandle: 'val', targetHandle: 'speed', animated: true, style: { stroke: '#58a6ff', strokeWidth: 2 } },
];

function AnimGraphFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#8b949e', strokeWidth: 2 } } as any, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      className="bg-[#0a0a0a]"
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#30363d" gap={30} size={1} />
      <Controls className="bg-[#161b22] border-[#30363d] fill-[#c9d1d9]" />
    </ReactFlow>
  );
}

export default function AnimGraphEditor() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#e3b341]/10 rounded text-[#e3b341]"><PersonStanding size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">AnimGraph & IK Setup (Hero_Character_BP)</h2>
              <p className="text-[10px] text-[#8b949e]">State Machines, Blend Trees, and Full Body IK for BP_Hero</p>
            </div>
         </div>
         
         <div className="flex gap-2 text-[11px] font-bold">
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors text-[#58a6ff]"><RefreshCw size={12}/> Compile Anim Blueprint</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Graph Area */}
        <div className="flex-1 border-r border-[#30363d] bg-[#0a0a0a] flex flex-col overflow-hidden relative">
           <ReactFlowProvider>
             <AnimGraphFlow />
           </ReactFlowProvider>
        </div>

        {/* Right Side: Viewport & Details */}
        <div className="w-80 flex flex-col shrink-0">
           
           {/* Viewport 3D Mock */}
           <div className="h-1/2 border-b border-[#30363d] bg-gradient-to-tr from-[#111] to-[#222] relative flex items-center justify-center overflow-hidden group">
              <div className="absolute top-2 right-2 flex gap-1">
                 <button className="bg-[#21262d] p-1.5 rounded hover:text-white text-[#8b949e]"><Maximize2 size={12}/></button>
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-[#0d1117]/80 rounded p-1 flex items-center justify-between px-3 border border-[#30363d] backdrop-blur">
                 <button onClick={() => setIsPlaying(!isPlaying)} className="text-[#3fb950] hover:text-white transition-colors">
                    {isPlaying ? <Pause size={14}/> : <Play size={14}/>}
                 </button>
                 <div className="flex-1 mx-3 h-1.5 bg-[#21262d] rounded-full overflow-hidden">
                    <div className={`h-full bg-[#58a6ff] ${isPlaying ? 'w-full animate-[progress_2s_linear_infinite]' : 'w-[45%]'}`}></div>
                 </div>
                 <span className="text-[9px] font-mono text-[#8b949e]">0.45s / 1.20s</span>
              </div>

              {/* Character Skeleton Mock */}
              <div className={`relative ${isPlaying ? 'animate-bounce' : ''}`}>
                 <div className="w-2 h-20 bg-white/20 rounded-full mx-auto shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                 <div className="w-16 h-2 bg-white/20 rounded-full absolute top-4 left-1/2 -translate-x-1/2"></div>
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 border-2 border-[#58a6ff] rounded-full drop-shadow-[0_0_10px_#58a6ff]"></div>
                 {/* IK Targets */}
                 <div className="absolute bottom-[-20px] left-[-15px] w-3 h-3 bg-[#e3b341] rounded-sm transform rotate-45"></div>
                 <div className="absolute bottom-[-20px] right-[-15px] w-3 h-3 bg-[#e3b341] rounded-sm transform rotate-45"></div>
              </div>
           </div>

           {/* Details Panel */}
           <div className="flex-1 bg-[#161b22] flex flex-col overflow-hidden text-[11px]">
              <div className="p-2 border-b border-[#30363d] font-bold text-[#c9d1d9] uppercase tracking-wide bg-[#0d1117]">Graph Node Details</div>
              <div className="p-3 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                 
                 {/* AI Animator Node block */}
                 <div>
                    <label className="text-[10px] font-bold text-[#bc8cff] mb-1 flex items-center gap-1"><Sparkles size={12}/> AI Animation Generator (Text-to-Anim)</label>
                    <div className="bg-[#0d1117] border border-[#bc8cff]/30 p-2 rounded flex flex-col gap-2">
                       <textarea className="w-full bg-[#161b22] border border-[#30363d] rounded p-2 text-white outline-none font-mono text-[10px] resize-none h-16 focus:border-[#bc8cff]" placeholder="e.g. A heavy soldier marching through thick mud, limping slightly on the right leg..." defaultValue="A heavy soldier marching through thick mud, limping slightly on the right leg..."></textarea>
                       <button className="w-full bg-[#bc8cff]/20 hover:bg-[#bc8cff]/30 text-[#bc8cff] border border-[#bc8cff]/50 rounded py-1.5 text-[10px] font-bold flex justify-center items-center gap-2 transition-colors">
                          <BrainCircuit size={12}/> Generate Cycle
                       </button>
                    </div>
                 </div>

                 {/* Procedural Blend block */}
                 <div>
                    <label className="text-[10px] font-bold text-[#e3b341] mb-1 flex items-center gap-1"><Combine size={12}/> Procedural Blending</label>
                    <div className="bg-[#0d1117] border border-[#e3b341]/30 p-2 rounded grid grid-cols-1 gap-2">
                       <div>
                          <label className="text-[9px] text-[#8b949e]">Blend Strategy</label>
                          <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-1.5 py-1 text-white outline-none font-mono text-[10px]">
                             <option>Layered Blend per Bone</option>
                             <option>Inertialization</option>
                             <option>Blend by Boolean</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-[9px] text-[#8b949e]">Layer Setup (Spine_01)</label>
                          <div className="mt-1 flex items-center justify-between text-[#c9d1d9] bg-[#161b22] px-2 py-1 rounded border border-[#30363d]">
                             <span>Base: Locomotion</span>
                             <span className="text-[#8b949e]">Weight: 0.15</span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[#c9d1d9] bg-[#161b22] px-2 py-1 rounded border border-[#30363d]">
                             <span>Layer 1: AI Result</span>
                             <span className="text-[#8b949e]">Weight: 0.85</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* IK Solvers block */}
                 <div>
                    <label className="text-[10px] font-bold text-[#f85149] mb-1 flex items-center gap-1"><Bone size={12}/> Full Body IK Solver</label>
                    <div className="bg-[#0d1117] border border-[#f85149]/30 p-2 rounded gap-2 flex flex-col">
                       <div>
                          <label className="text-[9px] text-[#8b949e]">IK Algorithm</label>
                          <select className="w-full bg-[#161b22] border border-[#30363d] rounded px-1.5 py-1 text-white outline-none font-mono text-[10px]">
                             <option>FABRIK (Forward And Backward Reaching)</option>
                             <option>Two-Bone IK (Legs/Arms only)</option>
                             <option>CCDIK (Cyclic Coordinate Descent)</option>
                          </select>
                       </div>
                       <div className="grid grid-cols-2 gap-2 mt-1">
                          <label className="flex items-center gap-2 cursor-pointer">
                             <input type="checkbox" className="accent-[#f85149] w-3 h-3" defaultChecked />
                             <span className="text-[#c9d1d9] text-[9px]">Foot Placement</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                             <input type="checkbox" className="accent-[#f85149] w-3 h-3" defaultChecked />
                             <span className="text-[#c9d1d9] text-[9px]">Pelvis Adjustment</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                             <input type="checkbox" className="accent-[#f85149] w-3 h-3" defaultChecked />
                             <span className="text-[#c9d1d9] text-[9px]">Look-At Aim Offset</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                             <input type="checkbox" className="accent-[#f85149] w-3 h-3" defaultChecked />
                             <span className="text-[#c9d1d9] text-[9px]">Hand IK (Weapon)</span>
                          </label>
                       </div>
                    </div>
                 </div>

                 {/* Component Sync block */}
                 <div>
                    <label className="text-[10px] font-bold text-[#8b949e] mb-1 block">Hero Component Sync</label>
                    <div className="bg-[#0d1117] border border-[#30363d] p-2 rounded space-y-2">
                       <button className="w-full bg-[#3fb950]/20 hover:bg-[#3fb950]/30 text-[#3fb950] border border-[#3fb950]/50 rounded py-1.5 text-[9px] font-bold transition-colors">
                          Apply Graph to Hero Component
                       </button>
                    </div>
                 </div>

              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
