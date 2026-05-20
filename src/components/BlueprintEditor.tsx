import React, { useState, useCallback, useRef } from 'react';
import dagre from 'dagre';
import { useUndoRedoFlow } from '../hooks/useUndoRedoFlow';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  Handle,
  Position,
  Connection,
  Edge,
  Node,
  Panel,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, StepForward, StopCircle, TerminalSquare, AlertCircle, Variable, Search, UserSquare, Waypoints, Plus, FileCode2, Clock, GitCommit, Settings2, BoxSelect, Cpu, Layers, Bot, Sparkles, Keyboard, Grid3X3, Activity, Copy, Image, Network, Wand2, Zap, Gauge, Code2, Maximize2, Minimize2, Globe, Database, BookOpen, Undo, Redo } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// --- Custom Nodes for Blueprint ---

const nodeStyle = {
  background: '#1a1a1a',
  border: '1px solid #333',
  borderRadius: '8px',
  color: '#ccc',
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

const DataHandle = ({ id, type, position, top, label, color, inputType, value, onChange }: any) => (
  <div className="flex items-center text-[10px] justify-between relative w-full px-1" style={{ height: '24px' }}>
    {type === 'target' && (
       <div className="flex items-center w-full">
         <Handle type="target" position={position} id={id} style={{ top, left: '-12px', background: color, width: '12px', height: '12px', border: '2px solid #161b22' }} />
         <span className="text-[#8b949e] ml-2 font-semibold">{label}</span>
         {inputType && <input type={inputType} value={value || ''} onChange={onChange} className="ml-auto w-12 bg-[#0d1117] border border-[#30363d] px-1 text-white rounded text-[9px] outline-none h-4 text-right" />}
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

// 1.5 Custom Event
const CustomEventNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#f85149'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#f85149]/30 to-[#f85149]/5 border-b border-[#f85149]/40 rounded-t-lg text-[13px] font-bold text-[#f85149] uppercase tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Zap size={14}/> Custom Event</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2">
      <input 
        type="text" 
        value={data.eventName || 'MyCustomEvent'} 
        onChange={(e) => updateNodeData(id, { eventName: e.target.value })} 
        className="bg-[#0d1117] border border-[#30363d] rounded text-[10px] w-full px-1 outline-none h-6 text-white mb-2"
        placeholder="Event Name"
      />
      <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
    </div>
  </div>
);
};

// 1.6 Call Custom Event
const CallCustomEventNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#58a6ff'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/20 to-[#58a6ff]/5 border-b border-[#58a6ff]/30 rounded-t-lg text-[13px] font-bold text-white flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Zap size={14} className="text-[#58a6ff]"/> Call Custom Event</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full mb-2">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <input 
        type="text" 
        value={data.eventName || 'MyCustomEvent'} 
        onChange={(e) => updateNodeData(id, { eventName: e.target.value })} 
        className="bg-[#0d1117] border border-[#30363d] rounded text-[10px] w-full px-1 outline-none h-6 text-white"
        placeholder="Event Name"
      />
    </div>
  </div>
);
};

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
const PrintStringNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#58a6ff'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/30 to-[#58a6ff]/5 border-b border-[#58a6ff]/40 rounded-t-lg text-[13px] font-bold text-white tracking-wider flex items-center gap-2">
      <TerminalSquare size={14} className="text-[#58a6ff]"/> Print String
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="str" type="target" position={Position.Left} top="50%" label="In String" color="#bc8cff" inputType="text" value={data.str} onChange={(e: any) => updateNodeData(id, { str: e.target.value })} />
      <DataHandle id="dur" type="target" position={Position.Left} top="50%" label="Duration" color="#3fb950" inputType="number" value={data.dur} onChange={(e: any) => updateNodeData(id, { dur: e.target.value })} />
    </div>
  </div>
);
};

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
const GetPlayerNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '200px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#3fb950]/20 to-[#3fb950]/0 border-b border-[#3fb950]/30 rounded-t-lg text-[12px] font-bold text-[#3fb950] flex items-center gap-2">
      <UserSquare size={14}/> Get Player Character
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="idx" type="target" position={Position.Left} top="50%" label="Player Index" color="#3fb950" inputType="number" value={data.idx} onChange={(e: any) => updateNodeData(id, { idx: e.target.value })} />
      <DataHandle id="char" type="source" position={Position.Right} top="50%" label="Return Value" color="#58a6ff" />
    </div>
  </div>
);
};

// 5.5 Get Actor Location
const GetActorLocationNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '200px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#3fb950]/20 to-[#3fb950]/0 border-b border-[#3fb950]/30 rounded-t-lg text-[12px] font-bold text-[#3fb950] flex items-center gap-2">
      <Waypoints size={14}/> Get Actor Location
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="target" type="target" position={Position.Left} top="50%" label="Target Actor" color="#58a6ff" />
      <DataHandle id="location" type="source" position={Position.Right} top="50%" label="Return Value" color="#e3b341" />
    </div>
  </div>
);
};

// 5.6 Get Actor Rotation
const GetActorRotationNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#8b949e', minWidth: '200px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#8b949e]/20 to-[#8b949e]/0 border-b border-[#8b949e]/30 rounded-t-lg text-[12px] font-bold text-[#8b949e] flex items-center gap-2">
      <Waypoints size={14}/> Get Actor Rotation
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="target" type="target" position={Position.Left} top="50%" label="Target Actor" color="#58a6ff" />
      <DataHandle id="rotation" type="source" position={Position.Right} top="50%" label="Return Value" color="#8b949e" />
    </div>
  </div>
);
};

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
const DelayNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#c9d1d9'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#c9d1d9]/20 to-[#c9d1d9]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-white flex items-center gap-2">
      <Clock size={14} className="text-[#e3b341]"/> Delay
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Completed" />
      </div>
      <DataHandle id="dur" type="target" position={Position.Left} top="50%" label="Duration" color="#3fb950" inputType="number" value={data.dur} onChange={(e: any) => updateNodeData(id, { dur: e.target.value })} />
    </div>
  </div>
);
};

// 9. Math Multiply (Float)
const MathMultiplyNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#3fb950] font-bold">×</span> Multiply
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="A" color="#3fb950" inputType="number" value={data.a} onChange={(e: any) => updateNodeData(id, { a: e.target.value })} />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="B" color="#3fb950" inputType="number" value={data.b} onChange={(e: any) => updateNodeData(id, { b: e.target.value })} />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="" color="#3fb950" />
      </div>
    </div>
  </div>
);
};

const MathAddNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#3fb950] font-bold">+</span> Add
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="A" color="#3fb950" inputType="number" value={data.a} onChange={(e: any) => updateNodeData(id, { a: e.target.value })} />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="B" color="#3fb950" inputType="number" value={data.b} onChange={(e: any) => updateNodeData(id, { b: e.target.value })} />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="" color="#3fb950" />
      </div>
    </div>
  </div>
);
};

const MathSubNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#3fb950] font-bold">-</span> Subtract
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="A" color="#3fb950" inputType="number" value={data.a} onChange={(e: any) => updateNodeData(id, { a: e.target.value })} />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="B" color="#3fb950" inputType="number" value={data.b} onChange={(e: any) => updateNodeData(id, { b: e.target.value })} />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="" color="#3fb950" />
      </div>
    </div>
  </div>
);
};

const MathDivideNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#3fb950] font-bold">/</span> Divide
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="A" color="#3fb950" inputType="number" value={data.a} onChange={(e: any) => updateNodeData(id, { a: e.target.value })} />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="B" color="#3fb950" inputType="number" value={data.b} onChange={(e: any) => updateNodeData(id, { b: e.target.value })} />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="" color="#3fb950" />
      </div>
    </div>
  </div>
);
};

// 10. Math Add (Vector)
const MathAddVectorNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#e3b341] font-bold">+</span> Add (Vector)
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="Vector A" color="#e3b341" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="Vector B" color="#e3b341" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Return Value" color="#e3b341" />
      </div>
    </div>
  </div>
);

// 10.1 Math Sub (Vector)
const MathSubVectorNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#e3b341] font-bold">-</span> Subtract (Vector)
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="Vector A" color="#e3b341" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="Vector B" color="#e3b341" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Return Value" color="#e3b341" />
      </div>
    </div>
  </div>
);

// 10.2 Math Dot Product (Vector)
const MathDotProductNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '200px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#e3b341] font-bold">·</span> Dot Product
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="Vector A" color="#e3b341" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="Vector B" color="#e3b341" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Float Value" color="#3fb950" />
      </div>
    </div>
  </div>
);

// 10.3 Math Cross Product (Vector)
const MathCrossProductNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '200px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#e3b341] font-bold">×</span> Cross Product
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="Vector A" color="#e3b341" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="Vector B" color="#e3b341" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Return Value" color="#e3b341" />
      </div>
    </div>
  </div>
);

// 10.4 Math Normalize (Vector)
const MathNormalizeNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#e3b341] font-bold">||</span> Normalize (Vector)
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center w-full">
        <DataHandle id="in" type="target" position={Position.Left} top="50%" label="Vector" color="#e3b341" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Normalized Dir" color="#e3b341" />
      </div>
    </div>
  </div>
);

// 10.5 Math Vector Length
const MathVectorLengthNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#e3b341] font-bold">|v|</span> Vector Length
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center w-full">
        <DataHandle id="in" type="target" position={Position.Left} top="50%" label="Vector" color="#e3b341" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Float Value" color="#3fb950" />
      </div>
    </div>
  </div>
);

// 10.7 Math Distance
const MathDistanceNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#e3b341] font-bold">d</span> Distance (Vector)
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="V1" color="#e3b341" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="V2" color="#e3b341" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Float" color="#3fb950" />
      </div>
    </div>
  </div>
);

// 10.8 Math Lerp (Vector)
const MathLerpVectorNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#e3b341] font-bold">L</span> Lerp (Vector)
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="A" color="#e3b341" />
      <DataHandle id="b" type="target" position={Position.Left} top="50%" label="B" color="#e3b341" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="alpha" type="target" position={Position.Left} top="50%" label="Alpha" color="#3fb950" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Vector" color="#e3b341" />
      </div>
    </div>
  </div>
);

// 10.9 Boolean AND
const BoolAndNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#8b0000', minWidth: '160px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#8b0000] font-bold">&&</span> AND Boolean
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="" color="#8b0000" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="" color="#8b0000" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="" color="#8b0000" />
      </div>
    </div>
  </div>
);

// 10.10 Boolean NOT
const BoolNotNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#8b0000', minWidth: '140px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#8b0000] font-bold">!</span> NOT Boolean
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center w-full">
        <DataHandle id="in" type="target" position={Position.Left} top="50%" label="" color="#8b0000" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="" color="#8b0000" />
      </div>
    </div>
  </div>
);

// 10.11 Math Clamp (Float)
const MathClampNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      Clamp (Float)
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="val" type="target" position={Position.Left} top="50%" label="Value" color="#3fb950" />
      <DataHandle id="min" type="target" position={Position.Left} top="50%" label="Min" color="#3fb950" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="max" type="target" position={Position.Left} top="50%" label="Max" color="#3fb950" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Float" color="#3fb950" />
      </div>
    </div>
  </div>
);

// 10.12 Map Range Clamped
const MathMapRangeNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '220px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      Map Range Clamped
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="val" type="target" position={Position.Left} top="50%" label="Value" color="#3fb950" />
      <DataHandle id="inA" type="target" position={Position.Left} top="50%" label="In Range A" color="#3fb950" />
      <DataHandle id="inB" type="target" position={Position.Left} top="50%" label="In Range B" color="#3fb950" />
      <DataHandle id="outA" type="target" position={Position.Left} top="50%" label="Out Range A" color="#3fb950" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="outB" type="target" position={Position.Left} top="50%" label="Out Range B" color="#3fb950" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Return" color="#3fb950" />
      </div>
    </div>
  </div>
);

// 10.13 Make Rotator
const MakeRotatorNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#8b949e', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      Make Rotator
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="roll" type="target" position={Position.Left} top="50%" label="X (Roll)" color="#3fb950" />
      <DataHandle id="pitch" type="target" position={Position.Left} top="50%" label="Y (Pitch)" color="#3fb950" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="yaw" type="target" position={Position.Left} top="50%" label="Z (Yaw)" color="#3fb950" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Rotator" color="#8b949e" />
      </div>
    </div>
  </div>
);

// 10.14 Flip Flop
const FlipFlopNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#c9d1d9', minWidth: '160px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#c9d1d9]/20 to-[#c9d1d9]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-white flex items-center gap-2">
      <GitCommit size={14} className="text-[#c9d1d9]"/> Flip Flop
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execA" type="source" position={Position.Right} top="50%" label="A" />
      </div>
      <div className="flex justify-between w-full">
        <div className="w-[10px]"></div>
        <ExecHandle id="execB" type="source" position={Position.Right} top="50%" label="B" />
      </div>
      <div className="flex justify-end w-full">
        <DataHandle id="isA" type="source" position={Position.Right} top="50%" label="Is A" color="#8b0000" />
      </div>
    </div>
  </div>
);

// 10.15 Gate
const GateNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#c9d1d9', minWidth: '180px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#c9d1d9]/20 to-[#c9d1d9]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-white flex items-center gap-2">
      <GitCommit size={14} className="text-[#c9d1d9]"/> Gate
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Enter" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Exit" />
      </div>
      <ExecHandle id="open" type="target" position={Position.Left} top="50%" label="Open" />
      <ExecHandle id="close" type="target" position={Position.Left} top="50%" label="Close" />
      <ExecHandle id="toggle" type="target" position={Position.Left} top="50%" label="Toggle" />
      <DataHandle id="startClosed" type="target" position={Position.Left} top="50%" label="Start Closed" color="#8b0000" />
    </div>
  </div>
);

// 10.16 Make Array
const MakeArrayNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <Layers size={14} className="text-[#58a6ff]"/> Make Array
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="item0" type="target" position={Position.Left} top="50%" label="[0]" color="#58a6ff" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="item1" type="target" position={Position.Left} top="50%" label="[1]" color="#58a6ff" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Array" color="#58a6ff" />
      </div>
      <button className="text-[10px] text-white bg-[#222] rounded px-2 mx-2 mt-2 font-bold py-1">Add pin +</button>
    </div>
  </div>
);

// 10.6. Construct Vector
const ConstructVectorNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <span className="text-[#e3b341] font-bold">V</span> Construct Vector
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="x" type="target" position={Position.Left} top="50%" label="X" color="#3fb950" inputType="number" value={data.x} onChange={(e: any) => updateNodeData(id, { x: e.target.value })} />
      <DataHandle id="y" type="target" position={Position.Left} top="50%" label="Y" color="#3fb950" inputType="number" value={data.y} onChange={(e: any) => updateNodeData(id, { y: e.target.value })} />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="z" type="target" position={Position.Left} top="50%" label="Z" color="#3fb950" inputType="number" value={data.z} onChange={(e: any) => updateNodeData(id, { z: e.target.value })} />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Vector3" color="#e3b341" />
      </div>
    </div>
  </div>
);
};

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

const SpawnPrefabNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#bc8cff'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#bc8cff]/30 rounded-t-lg text-[13px] font-bold text-white flex items-center gap-2">
      <BoxSelect size={14} className="text-[#bc8cff]"/> SpawnActor from Prefab
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="prefab" type="target" position={Position.Left} top="50%" label="Prefab Asset" color="#bc8cff" />
      <DataHandle id="transform" type="target" position={Position.Left} top="50%" label="Spawn Transform" color="#e3b341" />
      <DataHandle id="collision" type="target" position={Position.Left} top="50%" label="Collision Handling" color="#8b949e" />
      <DataHandle id="return" type="source" position={Position.Right} top="50%" label="Return Value" color="#58a6ff" />
    </div>
  </div>
);

// 13.5 Input Axis Event
const InputAxisNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#f85149'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#f85149]/30 to-[#f85149]/5 border-b border-[#f85149]/40 rounded-t-lg text-[13px] font-bold text-[#f85149] uppercase tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Keyboard size={14}/> Input Axis</div>
      <input 
        type="text" 
        value={data.axisName || 'MoveForward'} 
        onChange={(e) => updateNodeData(id, { axisName: e.target.value })} 
        className="bg-[#0d1117] border border-[#30363d] rounded text-[10px] w-28 px-1 outline-none h-5 text-white"
        placeholder="Axis Name"
      />
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Exec" />
      <DataHandle id="axisValue" type="source" position={Position.Right} top="50%" label="Axis Value" color="#3fb950" />
    </div>
  </div>
);
};

// 13. Input Key Event
const InputKeyNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#f85149'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#f85149]/30 to-[#f85149]/5 border-b border-[#f85149]/40 rounded-t-lg text-[13px] font-bold text-[#f85149] uppercase tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Keyboard size={14}/> Input Action</div>
      <input 
        type="text" 
        value={data.key || 'Spacebar'} 
        onChange={(e) => updateNodeData(id, { key: e.target.value })} 
        className="bg-[#0d1117] border border-[#30363d] rounded text-[10px] w-20 px-1 outline-none h-5 text-white"
        placeholder="Key/Action"
      />
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <ExecHandle id="execPressed" type="source" position={Position.Right} top="50%" label="Pressed" />
      <ExecHandle id="execReleased" type="source" position={Position.Right} top="50%" label="Released" />
      <DataHandle id="keyData" type="source" position={Position.Right} top="50%" label="Key" color="#8b949e" />
    </div>
  </div>
);
};

// 14. 2D Array
const Array2DNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
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
         <DataHandle id="x" type="target" position={Position.Left} top="50%" label="X" color="#3fb950" inputType="number" value={data.x} onChange={(e: any) => updateNodeData(id, { x: e.target.value })} />
         <DataHandle id="y" type="target" position={Position.Left} top="50%" label="Y" color="#3fb950" inputType="number" value={data.y} onChange={(e: any) => updateNodeData(id, { y: e.target.value })} />
      </div>
      <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] flex flex-col gap-2 mt-1">
         <DataHandle id="setVal" type="target" position={Position.Left} top="50%" label="Set Value" color="#bc8cff" inputType="text" value={data.setVal} onChange={(e: any) => updateNodeData(id, { setVal: e.target.value })} />
         <DataHandle id="getVal" type="source" position={Position.Right} top="50%" label="Get Value" color="#bc8cff" />
      </div>
    </div>
  </div>
);
};

// 15. AI Gen Movement Component
const AIGenMovementNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/30 to-[#bc8cff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#bc8cff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Sparkles size={14}/> Offline AI Gen: Movement</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Movement Logic" />
      </div>
      <DataHandle id="target" type="target" position={Position.Left} top="50%" label="Target Pawn" color="#58a6ff" />
      <DataHandle id="playerProximity" type="target" position={Position.Left} top="50%" label="Player Proximity" color="#e3b341" />
      <DataHandle id="prompt" type="target" position={Position.Left} top="50%" label="Behavior Prompt" color="#1f6feb" inputType="text" value={data.prompt} onChange={(e: any) => updateNodeData(id, { prompt: e.target.value })} />
      <DataHandle id="moveSpeed" type="target" position={Position.Left} top="50%" label="Speed Config" color="#e3b341" inputType="number" value={data.moveSpeed} onChange={(e: any) => updateNodeData(id, { moveSpeed: e.target.value })} />
      
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider">AI Pathfinding</span>
         <label className="relative inline-flex items-center cursor-pointer">
           <input type="checkbox" className="sr-only peer" checked={data.useAIPathfinding || false} onChange={(e: any) => updateNodeData(id, { useAIPathfinding: e.target.checked })} />
           <div className="w-7 h-4 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[11px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#bc8cff]"></div>
         </label>
      </div>
    </div>
  </div>
  );
};

// 16. AI Gen Combat Behavior Tree
const AIGenCombatNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/30 to-[#bc8cff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#bc8cff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Bot size={14}/> Offline AI Gen: Combat BT</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="targetAI" type="target" position={Position.Left} top="50%" label="AI Controller" color="#58a6ff" />
      <DataHandle id="baseBT" type="target" position={Position.Left} top="50%" label="Base BT Asset" color="#e3b341" />
      <DataHandle id="btAsset" type="source" position={Position.Right} top="50%" label="Generated BT" color="#bc8cff" />
    </div>
  </div>
);

// AI Gen Behavior Logic
const AIGenBehaviorLogicNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#ff7b72', minWidth: '260px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#ff7b72]/30 to-[#ff7b72]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#ff7b72] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Sparkles size={14}/> Offline AI Gen: Behavior Logic</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="On Generated" />
      </div>
      <DataHandle id="prompt" type="target" position={Position.Left} top="50%" label="Text Prompt" color="#bc8cff" inputType="text" value={data.prompt} onChange={(e: any) => updateNodeData(id, { prompt: e.target.value })} />
    </div>
  </div>
  );
};


// 17. AI Gen Actor
const AIGenActorNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/30 to-[#bc8cff]/5 border-b border-[#333] rounded-t-lg text-[13px] font-bold text-[#bc8cff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Sparkles size={14}/> Offline AI Gen: Actor</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="prompt" type="target" position={Position.Left} top="50%" label="Prompt" color="#bc8cff" inputType="text" value={data.prompt} onChange={(e: any) => updateNodeData(id, { prompt: e.target.value })} />
      <DataHandle id="transform" type="target" position={Position.Left} top="50%" label="Spawn Transform" color="#e3b341" />
      <DataHandle id="generatedActor" type="source" position={Position.Right} top="50%" label="Generated Actor" color="#58a6ff" />
    </div>
  </div>
);
};

// Hardware Optimizer
const HardwareOptimizerNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '320px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#3fb950]/30 to-[#3fb950]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#3fb950] tracking-wider flex items-center gap-2">
      <Cpu size={14}/> Hardware Optimizer (Legacy Supported)
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Activate" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1"><Cpu size={10} className="text-[#3fb950]"/> Architecture</span>
         <select value={data.archType || 'Modern'} onChange={(e) => updateNodeData(id, { archType: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-[#e3b341] uppercase ml-2"><option>Modern</option><option>Legacy (15+ Years Old)</option><option>Any / Universal</option></select>
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1"><Cpu size={10} className="text-[#3fb950]"/> CPU Queue</span>
         <select value={data.cpuLimit || 'Low'} onChange={(e) => updateNodeData(id, { cpuLimit: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white uppercase ml-2"><option>Low</option><option>Medium</option><option>High</option><option>Max</option></select>
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1"><Grid3X3 size={10} className="text-[#3fb950]"/> VRAM Target</span>
         <select value={data.gpuLimit || 'Low'} onChange={(e) => updateNodeData(id, { gpuLimit: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-[#bc8cff] uppercase ml-2"><option>1-2 GB (Ultra Low)</option><option>4 GB</option><option>8 GB+</option></select>
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1"><Layers size={10} className="text-[#3fb950]"/> RAM Limit</span>
         <select value={data.ramLimit || 'Aggressive'} onChange={(e) => updateNodeData(id, { ramLimit: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-[#ff7b72] uppercase ml-2"><option>4 GB (Strict Constraint)</option><option>8 GB</option><option>16 GB+</option></select>
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1"><Zap size={10} className="text-[#3fb950]"/> Pipeline Strategy</span>
         <select value={data.pipelineMode || 'Auto-Detect (Adaptive)'} onChange={(e) => updateNodeData(id, { pipelineMode: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-[#3fb950] uppercase ml-2">
            <option>Auto-Detect (Adaptive)</option>
            <option>Parallel (Modern)</option>
            <option>CPU {'>'} RAM {'>'} NPU {'>'} GPU (Staged)</option>
         </select>
      </div>
    </div>
  </div>
);
};

// Offline AI Accelerator
const OfflineAIAcceleratorNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '260px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#e3b341]/30 to-[#e3b341]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#e3b341] tracking-wider flex items-center gap-2">
      <Gauge size={14}/> Offline AI Accelerator
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Initialize" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Ready" />
      </div>
      <DataHandle id="modelPath" type="target" position={Position.Left} top="50%" label="Local Model Target" color="#58a6ff" />
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1"><Activity size={10} className="text-[#e3b341]"/> Turbo Mode</label>
        <input type="checkbox" checked={data.turbo || true} onChange={(e) => updateNodeData(id, { turbo: e.target.checked })} className="accent-[#e3b341]" />
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1"><Settings2 size={10} className="text-[#e3b341]"/> Max Pre-compiling Threads</label>
        <input type="number" min="1" max="64" value={data.threads || 8} onChange={(e: any) => updateNodeData(id, { threads: e.target.value })} className="w-12 bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white text-right px-1 ml-2" />
      </div>
      <DataHandle id="isStable" type="source" position={Position.Right} top="50%" label="Is Stable" color="#f85149" />
    </div>
  </div>
);
};

// Extreme Detail Scene/Level Script Node
const LevelScriptNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '280px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/30 to-[#bc8cff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#bc8cff] tracking-wider flex items-center gap-2">
      <FileCode2 size={14}/> Level Descriptor Script
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Run Script" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <div className="mt-1 flex flex-col gap-1 bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1">Max Shadow Casters</span>
         <input type="number" value={data.shadowCasters || 12} onChange={(e) => updateNodeData(id, { shadowCasters: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[10px] outline-none h-5 text-[#c9d1d9] px-2 w-full" />
      </div>
      <div className="mt-1 flex flex-col gap-1 bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1">Global Alarm / Entity Limit</span>
         <input type="number" value={data.entityLimit || 50} onChange={(e) => updateNodeData(id, { entityLimit: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[10px] outline-none h-5 text-[#c9d1d9] px-2 w-full" />
      </div>
      <div className="mt-1 flex flex-col gap-1 bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1">Light Bounce Quality</span>
         <select value={data.lightQual || 'Low (0 Bounces)'} onChange={(e) => updateNodeData(id, { lightQual: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-5 text-[#e3b341] w-full"><option>Low (0 Bounces)</option><option>Medium (1 Bounce)</option><option>High (3+ Bounces)</option></select>
      </div>
    </div>
  </div>
);
};

// Import External Assets (Batch)
const ImportExternalAssetsNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '260px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/30 to-[#58a6ff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#58a6ff] tracking-wider flex items-center gap-2">
      <Copy size={14}/> Batch Import Assets
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="On Imported" />
      </div>
      <DataHandle id="paths" type="target" position={Position.Left} top="50%" label="Directory Paths (Array)" color="#bc8cff" />
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1"><Image size={10} className="text-[#58a6ff]"/> Import Textures (.png, .jpg, .tga)</label>
        <input type="checkbox" checked={data.importTextures || true} onChange={(e) => updateNodeData(id, { importTextures: e.target.checked })} className="accent-[#58a6ff]" />
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1"><Layers size={10} className="text-[#58a6ff]"/> Import Models (.fbx, .obj, .glb)</label>
        <input type="checkbox" checked={data.importModels || true} onChange={(e) => updateNodeData(id, { importModels: e.target.checked })} className="accent-[#58a6ff]" />
      </div>
      <DataHandle id="importedAssets" type="source" position={Position.Right} top="50%" label="Loaded Assets" color="#58a6ff" />
    </div>
  </div>
);
};

// Offline AI 3D Model Gen
const OfflineAI3DModelGenNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '300px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#e3b341]/30 to-[#e3b341]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#e3b341] tracking-wider flex items-center gap-2">
      <Layers size={14}/> Offline AI: 3D Model Master
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Generate" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Ready" />
      </div>
      <DataHandle id="prompt" type="target" position={Position.Left} top="50%" label="Prompt" color="#1f6feb" inputType="text" value={data.prompt} onChange={(e: any) => updateNodeData(id, { prompt: e.target.value })} />
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1"><Cpu size={10} className="text-[#e3b341]"/> Detail Level</span>
         <select value={data.detailLevel || 'Ultra'} onChange={(e) => updateNodeData(id, { detailLevel: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white uppercase ml-2"><option>Low Poly</option><option>Standard</option><option>High</option><option>Ultra (Nanite)</option></select>
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1"><Grid3X3 size={10} className="text-[#e3b341]"/> Topology Optimization</span>
         <select value={data.topology || 'Quad'} onChange={(e) => updateNodeData(id, { topology: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white uppercase ml-2"><option>Tris (Fast)</option><option>Quad</option><option>AI Retopo</option></select>
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1"><Activity size={10} className="text-[#e3b341]"/> Generate PBR Textures</label>
        <input type="checkbox" checked={data.pbr || true} onChange={(e) => updateNodeData(id, { pbr: e.target.checked })} className="accent-[#e3b341]" />
      </div>
      <DataHandle id="modelAsset" type="source" position={Position.Right} top="50%" label="Static Mesh Asset" color="#58a6ff" />
    </div>
  </div>
);
};

// Offline AI 3D Map Gen
const OfflineAI3DMapGenNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '300px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#e3b341]/30 to-[#e3b341]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#e3b341] tracking-wider flex items-center gap-2">
      <Grid3X3 size={14}/> Offline AI: 3D Map & Terrain
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Generate Map" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Ready" />
      </div>
      <DataHandle id="prompt" type="target" position={Position.Left} top="50%" label="Biome/Map Prompt" color="#1f6feb" inputType="text" value={data.prompt} onChange={(e: any) => updateNodeData(id, { prompt: e.target.value })} />
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1"><Waypoints size={10} className="text-[#e3b341]"/> Map Size (KM sq)</span>
         <input type="number" min="1" max="1000" value={data.mapSize || 64} onChange={(e: any) => updateNodeData(id, { mapSize: e.target.value })} className="w-16 bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white text-right px-1 ml-2" />
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1"><Layers size={10} className="text-[#e3b341]"/> Procedural Foliage</span>
         <select value={data.foliage || 'Dense'} onChange={(e) => updateNodeData(id, { foliage: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white uppercase ml-2"><option>None</option><option>Sparse</option><option>Dense</option><option>Overgrown</option></select>
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1"><Activity size={10} className="text-[#e3b341]"/> Semantic NavMesh</label>
        <input type="checkbox" checked={data.navMesh || true} onChange={(e) => updateNodeData(id, { navMesh: e.target.checked })} className="accent-[#e3b341]" />
      </div>
      <DataHandle id="levelAsset" type="source" position={Position.Right} top="50%" label="Level Instance" color="#bc8cff" />
    </div>
  </div>
);
};

// Offline AI Web Learning
const OfflineAIWebLearnNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '320px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#e3b341]/30 to-[#e3b341]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#e3b341] tracking-wider flex items-center gap-2">
      <Network size={14}/> Offline AI: Deep Web Learning
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Start Learning" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="On Completed" />
      </div>
      <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] flex flex-col gap-2 relative mt-1">
         <span className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1"><Search size={10} className="text-[#e3b341]"/> Target Subject (e.g. Fortnite)</span>
         <DataHandle id="subject" type="target" position={Position.Left} top="50%" label="" color="#bc8cff" style={{ left: '-12px' }} />
         <textarea rows={2} value={data.subject || ''} onChange={(e: any) => updateNodeData(id, { subject: e.target.value })} placeholder="Enter subject name, URL or description (e.g. study Fortnite game mechanics, 3D models and player interaction)" className="w-full bg-[#161b22] border border-[#30363d] rounded text-[10px] outline-none text-white p-1 resize-none custom-scrollbar" />
      </div>
      <div className="grid grid-cols-2 gap-1 mt-1 mb-2">
        <label className="flex items-center gap-1.5 bg-[#161b22] border border-[#30363d] p-1.5 rounded text-[9px] text-[#8b949e] font-bold"><input type="checkbox" checked={data.scanWeb !== false} onChange={(e) => updateNodeData(id, { scanWeb: e.target.checked })} className="accent-[#e3b341]" /> Web Docs</label>
        <label className="flex items-center gap-1.5 bg-[#161b22] border border-[#30363d] p-1.5 rounded text-[9px] text-[#8b949e] font-bold"><input type="checkbox" checked={data.scanVideo !== false} onChange={(e) => updateNodeData(id, { scanVideo: e.target.checked })} className="accent-[#e3b341]" /> Video Analysis</label>
        <label className="flex items-center gap-1.5 bg-[#161b22] border border-[#30363d] p-1.5 rounded text-[9px] text-[#8b949e] font-bold"><input type="checkbox" checked={data.scanModels !== false} onChange={(e) => updateNodeData(id, { scanModels: e.target.checked })} className="accent-[#e3b341]" /> 3D Models</label>
        <label className="flex items-center gap-1.5 bg-[#161b22] border border-[#30363d] p-1.5 rounded text-[9px] text-[#8b949e] font-bold"><input type="checkbox" checked={data.scanInteractions !== false} onChange={(e) => updateNodeData(id, { scanInteractions: e.target.checked })} className="accent-[#e3b341]" /> Mechanics & Inv.</label>
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1"><Layers size={10} className="text-[#e3b341]"/> Deep Mode</span>
         <select value={data.iteration || 'Standard'} onChange={(e) => updateNodeData(id, { iteration: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white uppercase ml-2"><option>Fast (1 Pass)</option><option>Standard (3 Passes)</option><option>Deep (Recursive)</option></select>
      </div>
      <DataHandle id="knowledgeBase" type="source" position={Position.Right} top="50%" label="Learned Knowledge Base" color="#58a6ff" />
    </div>
  </div>
);
};

// 18. AI Gen Transform
const AIGenTransformNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/30 to-[#bc8cff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#bc8cff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Sparkles size={14}/> Offline AI Gen: Transform</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="prompt" type="target" position={Position.Left} top="50%" label="Transform Prompt" color="#bc8cff" inputType="text" value={data.prompt} onChange={(e: any) => updateNodeData(id, { prompt: e.target.value })} />
      <DataHandle id="initial" type="target" position={Position.Left} top="50%" label="Initial State" color="#e3b341" />
      <DataHandle id="outTransform" type="source" position={Position.Right} top="50%" label="Generated Transform" color="#e3b341" />
    </div>
  </div>
);
};

// 19. Smart Door Controller
const SmartDoorNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#e3b341]/30 to-[#e3b341]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#e3b341] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><BoxSelect size={14}/> Smart Door System</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Interact" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="On State Changed" />
      </div>
      <div className="flex justify-between w-full items-center">
         <span className="text-[#8b949e] ml-2 text-[10px] font-semibold">Door Type</span>
         <select value={data.doorType || 'Swing'} onChange={(e) => updateNodeData(id, { doorType: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white uppercase"><option>Swing</option><option>Sliding</option><option>Double</option><option>Vault</option><option>Physics</option></select>
      </div>
      <DataHandle id="targetDoor" type="target" position={Position.Left} top="50%" label="Door Asset" color="#58a6ff" />
      <DataHandle id="autoClose" type="target" position={Position.Left} top="50%" label="Auto Close Delay" color="#3fb950" inputType="number" value={data.autoClose} onChange={(e: any) => updateNodeData(id, { autoClose: e.target.value })} />
      <DataHandle id="isOpen" type="source" position={Position.Right} top="50%" label="Is Open" color="#f85149" />
    </div>
  </div>
);
};

// 20. Realtime Reflection Setup
const ReflectionProbeNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/30 to-[#58a6ff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#58a6ff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Layers size={14}/> Realtime Mirror / Probe</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Update Capture" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <div className="flex justify-between w-full items-center">
         <span className="text-[#8b949e] ml-2 text-[10px] font-semibold">Quality</span>
         <select value={data.quality || 'Raytraced'} onChange={(e) => updateNodeData(id, { quality: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white uppercase"><option>Raytraced</option><option>Planar</option><option>Cubemap</option></select>
      </div>
      <DataHandle id="targetSurface" type="target" position={Position.Left} top="50%" label="Target Surface" color="#58a6ff" />
      <DataHandle id="renderTarget" type="source" position={Position.Right} top="50%" label="Render Target" color="#bc8cff" />
    </div>
  </div>
);
};

// Culling Optimization
const EnableCullingNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#3fb950]/30 to-[#3fb950]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#3fb950] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Settings2 size={14}/> GPU Culling (Frustum/Occ)</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <div className="mt-1 flex flex-col gap-2 bg-[#161b22] border border-[#30363d] p-1.5 rounded">
         <div className="flex items-center justify-between">
           <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider">Frustum Culling</span>
           <label className="relative inline-flex items-center cursor-pointer">
             <input type="checkbox" className="sr-only peer" checked={data.frustum || true} onChange={(e: any) => updateNodeData(id, { frustum: e.target.checked })} />
             <div className="w-7 h-4 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[11px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#3fb950]"></div>
           </label>
         </div>
         <div className="flex items-center justify-between">
           <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider">Occlusion Culling</span>
           <label className="relative inline-flex items-center cursor-pointer">
             <input type="checkbox" className="sr-only peer" checked={data.occlusion || true} onChange={(e: any) => updateNodeData(id, { occlusion: e.target.checked })} />
             <div className="w-7 h-4 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[11px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#3fb950]"></div>
           </label>
         </div>
      </div>
      <DataHandle id="targetRender" type="target" position={Position.Left} top="50%" label="Target Camera" color="#58a6ff" />
    </div>
  </div>
);
};

// Stream Level Node
const StreamLevelNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '250px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/30 to-[#58a6ff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#58a6ff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Layers size={14}/> Load Level Instance (Async)</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <div className="flex justify-between w-full">
        <div className="w-10"></div>
        <ExecHandle id="execLoaded" type="source" position={Position.Right} top="50%" label="On Loaded" />
      </div>
      <DataHandle id="levelName" type="target" position={Position.Left} top="50%" label="Level Name" color="#bc8cff" inputType="text" value={data.levelName || 'Level_Chunks_01'} onChange={(e: any) => updateNodeData(id, { levelName: e.target.value })} />
      <DataHandle id="location" type="target" position={Position.Left} top="50%" label="Location" color="#e3b341" />
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider">Make Visible</span>
         <label className="relative inline-flex items-center cursor-pointer">
           <input type="checkbox" className="sr-only peer" checked={data.makeVisible || true} onChange={(e: any) => updateNodeData(id, { makeVisible: e.target.checked })} />
           <div className="w-7 h-4 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[11px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#58a6ff]"></div>
         </label>
      </div>
    </div>
  </div>
);
};

// Async Load Asset Node
const AsyncLoadAssetNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#e3b341]/30 to-[#e3b341]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#e3b341] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Clock size={14}/> Async Load Asset</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Completed" />
      </div>
      <DataHandle id="assetPath" type="target" position={Position.Left} top="50%" label="Asset Path" color="#bc8cff" inputType="text" value={data.assetPath || 'Mesh_Heavy'} onChange={(e: any) => updateNodeData(id, { assetPath: e.target.value })} />
      <DataHandle id="loadedObject" type="source" position={Position.Right} top="50%" label="Loaded Object" color="#58a6ff" />
    </div>
  </div>
);
};

// AI Gen Proximity Behavior
const AIGenProximityNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#ff7b72', minWidth: '260px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#ff7b72]/30 to-[#ff7b72]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#ff7b72] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Bot size={14}/> Offline AI Proximity Behavior</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Evaluate" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="On Triggered" />
      </div>
      <div className="flex justify-between w-full">
         <div className="w-10"></div>
         <ExecHandle id="execIdle" type="source" position={Position.Right} top="50%" label="On Idle" />
      </div>
      
      <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 mb-1">
        <label className="text-[10px] text-[#8b949e] font-semibold mb-1 block">Behavior Prompt</label>
        <textarea value={data.prompt} onChange={(e) => updateNodeData(id, { prompt: e.target.value })} className="w-full bg-[#161b22] text-white text-[11px] p-1 border border-[#30363d] rounded outline-none resize-none" rows={2} placeholder="E.g. The monster should growl and sprint towards the player if within range, else wander."></textarea>
      </div>

      <DataHandle id="playerRef" type="target" position={Position.Left} top="50%" label="Player Reference" color="#58a6ff" />
      <DataHandle id="proximityRadius" type="target" position={Position.Left} top="50%" label="Proximity Radius" color="#3fb950" inputType="number" value={data.radius || 500} onChange={(e: any) => updateNodeData(id, { radius: e.target.value })} />
      <DataHandle id="outState" type="source" position={Position.Right} top="50%" label="Generated State" color="#e3b341" />
    </div>
  </div>
);
};

// AI Gen Texture
const AIGenTextureNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/30 to-[#bc8cff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#bc8cff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Image size={14}/> Offline AI Gen: Texture</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Generate" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Completed" />
      </div>
      <DataHandle id="prompt" type="target" position={Position.Left} top="50%" label="Prompt" color="#bc8cff" inputType="text" value={data.prompt} onChange={(e: any) => updateNodeData(id, { prompt: e.target.value })} />
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider">Resolution</span>
         <DataHandle id="resolutionInput" type="target" position={Position.Left} top="50%" label="" color="#bc8cff" style={{ left: '-12px' }} />
         <select value={data.resolution || '512x512'} onChange={(e) => updateNodeData(id, { resolution: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white uppercase ml-2"><option>512x512</option><option>1024x1024</option><option>2048x2048</option></select>
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider">Steps</span>
         <DataHandle id="stepsInput" type="target" position={Position.Left} top="50%" label="" color="#3fb950" style={{ left: '-12px' }} />
         <input type="number" min="1" max="100" value={data.steps || 20} onChange={(e: any) => updateNodeData(id, { steps: e.target.value })} className="w-12 bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white text-right px-1 ml-2" />
      </div>
      <DataHandle id="texture" type="source" position={Position.Right} top="50%" label="Generated Texture" color="#58a6ff" />
    </div>
  </div>
);
};

// 21. AI Gen Mechanic
const AIGenMechanicNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#ff7b72', minWidth: '260px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#ff7b72]/30 to-[#ff7b72]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#ff7b72] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Sparkles size={14}/> Offline AI Gen: Mechanic</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="On Success" />
      </div>
      <div className="flex justify-between w-full">
         <div className="w-10"></div>
         <ExecHandle id="execFail" type="source" position={Position.Right} top="50%" label="On Failed" />
      </div>
      
      <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 mb-1">
        <label className="text-[10px] text-[#8b949e] font-semibold mb-1 block">Mechanic Prompt</label>
        <textarea value={data.prompt} onChange={(e) => updateNodeData(id, { prompt: e.target.value })} className="w-full bg-[#161b22] text-white text-[11px] p-1 border border-[#30363d] rounded outline-none resize-none" rows={2} placeholder="Describe mechanic here..."></textarea>
      </div>

      <DataHandle id="targetActor" type="target" position={Position.Left} top="50%" label="Target Actor" color="#58a6ff" />
      <DataHandle id="contextData" type="target" position={Position.Left} top="50%" label="Context Data" color="#bc8cff" />
      <DataHandle id="outMechanic" type="source" position={Position.Right} top="50%" label="Generated Logic" color="#e3b341" />
    </div>
  </div>
);
};

// 22. For Loop
const ForLoopNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#c9d1d9', minWidth: '220px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#c9d1d9]/20 to-[#c9d1d9]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-white tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><GitCommit size={14}/> For Loop</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execLoop" type="source" position={Position.Right} top="50%" label="Loop Body" />
      </div>
      <div className="flex justify-between w-full">
        <div />
        <ExecHandle id="execCompleted" type="source" position={Position.Right} top="50%" label="Completed" />
      </div>
      <DataHandle id="firstIndex" type="target" position={Position.Left} top="50%" label="First Index" color="#3fb950" inputType="number" value={data.firstIndex || 0} onChange={(e: any) => updateNodeData(id, { firstIndex: e.target.value })} />
      <DataHandle id="lastIndex" type="target" position={Position.Left} top="50%" label="Last Index" color="#3fb950" inputType="number" value={data.lastIndex || 10} onChange={(e: any) => updateNodeData(id, { lastIndex: e.target.value })} />
      <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-[#30363d]">
        <div />
        <DataHandle id="indexOut" type="source" position={Position.Right} top="50%" label="Index" color="#3fb950" />
      </div>
    </div>
  </div>
);
};

// 23. While Loop
const WhileLoopNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#c9d1d9'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#c9d1d9]/20 to-[#c9d1d9]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-white tracking-wider flex items-center gap-2">
      <GitCommit size={14}/> While Loop
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execLoop" type="source" position={Position.Right} top="50%" label="Loop Body" />
      </div>
      <div className="flex justify-between w-full">
        <DataHandle id="condition" type="target" position={Position.Left} top="50%" label="Condition" color="#f85149" />
        <ExecHandle id="execCompleted" type="source" position={Position.Right} top="50%" label="Completed" />
      </div>
    </div>
  </div>
);

// 24. Do Once
const DoOnceNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#c9d1d9'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#c9d1d9]/20 to-[#c9d1d9]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-white tracking-wider flex items-center gap-2">
      <GitCommit size={14}/> Do Once
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Completed" />
      </div>
      <ExecHandle id="execReset" type="target" position={Position.Left} top="50%" label="Reset" />
      <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-[#30363d]">
        <DataHandle id="startClosed" type="target" position={Position.Left} top="50%" label="Start Closed" color="#f85149" />
      </div>
    </div>
  </div>
);

// 25. Line Trace By Channel
const LineTraceNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '260px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/20 to-[#58a6ff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#58a6ff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Waypoints size={14}/> Line Trace By Channel</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="start" type="target" position={Position.Left} top="50%" label="Start" color="#e3b341" />
      <DataHandle id="end" type="target" position={Position.Left} top="50%" label="End" color="#e3b341" />
      <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-[#30363d]">
        <DataHandle id="returnVal" type="source" position={Position.Right} top="50%" label="Return Value" color="#f85149" />
        <DataHandle id="outHit" type="source" position={Position.Right} top="50%" label="Out Hit" color="#58a6ff" />
      </div>
    </div>
  </div>
);

// Apply Force
const ApplyForceNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#3fb950]/20 to-[#3fb950]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#3fb950] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Activity size={14}/> Add Physics Force</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="target" type="target" position={Position.Left} top="50%" label="Target Actor" color="#58a6ff" />
      <DataHandle id="force" type="target" position={Position.Left} top="50%" label="Force" color="#3fb950" inputType="number" value={data.force} onChange={(e: any) => updateNodeData(id, { force: e.target.value })} />
      <DataHandle id="direction" type="target" position={Position.Left} top="50%" label="Direction Unit Vector" color="#e3b341" />

      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider">As Impulse</span>
         <label className="relative inline-flex items-center cursor-pointer">
           <input type="checkbox" className="sr-only peer" checked={data.isImpulse || false} onChange={(e: any) => updateNodeData(id, { isImpulse: e.target.checked })} />
           <div className="w-7 h-4 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[11px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#3fb950]"></div>
         </label>
      </div>
    </div>
  </div>
  );
};

// Set Physics Properties
const SetPhysicsPropertiesNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#3fb950]/20 to-[#3fb950]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#3fb950] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Settings2 size={14}/> Set Physics Props</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="targetActor" type="target" position={Position.Left} top="50%" label="Target Actor" color="#58a6ff" />
      <DataHandle id="mass" type="target" position={Position.Left} top="50%" label="Mass (kg)" color="#3fb950" inputType="number" value={data.mass || 100} onChange={(e: any) => updateNodeData(id, { mass: e.target.value })} />
      <DataHandle id="damping" type="target" position={Position.Left} top="50%" label="Linear Damping" color="#3fb950" inputType="number" value={data.damping || 0.1} onChange={(e: any) => updateNodeData(id, { damping: e.target.value })} />
      
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider">Collision</span>
         <select value={data.collision || 'BlockAllDynamic'} onChange={(e) => updateNodeData(id, { collision: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white uppercase"><option>BlockAllDynamic</option><option>PhysicsActor</option><option>OverlapAll</option><option>Custom</option></select>
      </div>

      <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-[#30363d]">
        <div/>
        <DataHandle id="outPhysComponent" type="source" position={Position.Right} top="50%" label="Physics Comp" color="#58a6ff" />
      </div>
    </div>
  </div>
  );
};

// 33. Append String
const AppendStringNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '180px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/30 to-[#58a6ff]/5 border-b border-[#58a6ff]/40 rounded-t-lg text-[13px] font-bold text-white tracking-wider flex items-center gap-2">
      <TerminalSquare size={14} className="text-[#58a6ff]"/> Append String
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="a" type="target" position={Position.Left} top="50%" label="A" color="#bc8cff" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="b" type="target" position={Position.Left} top="50%" label="B" color="#bc8cff" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="" color="#bc8cff" />
      </div>
    </div>
  </div>
);
};

// 34. Array Add
const ArrayAddNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      <Layers size={14} className="text-[#58a6ff]"/> Array Add
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Exec" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="array" type="target" position={Position.Left} top="50%" label="Target Array" color="#58a6ff" />
      <DataHandle id="item" type="target" position={Position.Left} top="50%" label="New Item" color="#58a6ff" />
      <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-[#30363d]">
        <div/>
        <DataHandle id="index" type="source" position={Position.Right} top="50%" label="Index Added" color="#3fb950" />
      </div>
    </div>
  </div>
);
};

// 35. Overlap Begin
const OnOverlapBeginNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#f85149', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#f85149]/30 to-[#f85149]/5 border-b border-[#f85149]/40 rounded-t-lg text-[13px] font-bold text-[#f85149] uppercase tracking-wider flex items-center gap-2">
      <AlertCircle size={14}/> Event Actor BeginOverlap
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      <DataHandle id="otherActor" type="source" position={Position.Right} top="50%" label="Other Actor" color="#58a6ff" />
      <DataHandle id="otherComp" type="source" position={Position.Right} top="50%" label="Other Comp" color="#bc8cff" />
    </div>
  </div>
);

// Overlap End
const OnOverlapEndNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#f85149', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#f85149]/30 to-[#f85149]/5 border-b border-[#f85149]/40 rounded-t-lg text-[13px] font-bold text-[#f85149] uppercase tracking-wider flex items-center gap-2">
      <AlertCircle size={14}/> Event Actor EndOverlap
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      <DataHandle id="otherActor" type="source" position={Position.Right} top="50%" label="Other Actor" color="#58a6ff" />
      <DataHandle id="otherComp" type="source" position={Position.Right} top="50%" label="Other Comp" color="#bc8cff" />
    </div>
  </div>
);

// 36. Sphere Trace
const SphereTraceNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '260px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/20 to-[#58a6ff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#58a6ff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Waypoints size={14}/> Sphere Trace By Channel</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="start" type="target" position={Position.Left} top="50%" label="Start" color="#e3b341" />
      <DataHandle id="end" type="target" position={Position.Left} top="50%" label="End" color="#e3b341" />
      <DataHandle id="radius" type="target" position={Position.Left} top="50%" label="Radius" color="#3fb950" />
      <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-[#30363d]">
        <DataHandle id="returnVal" type="source" position={Position.Right} top="50%" label="Return Value" color="#f85149" />
        <DataHandle id="outHit" type="source" position={Position.Right} top="50%" label="Out Hit" color="#58a6ff" />
      </div>
    </div>
  </div>
);

// 37. Get Mouse Position
const GetMousePositionNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '200px'}}>
    <div className="px-3 py-1.5 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex justify-between items-center gap-2">
      <UserSquare size={12}/> Get Mouse Position
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="target" type="target" position={Position.Left} top="50%" label="Player Controller" color="#58a6ff" />
      <DataHandle id="locX" type="source" position={Position.Right} top="50%" label="Location X" color="#3fb950" />
      <DataHandle id="locY" type="source" position={Position.Right} top="50%" label="Location Y" color="#3fb950" />
    </div>
  </div>
);

// 38. Random Float
const MathRandomFloatNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '180px'}}>
    <div className="px-3 py-1 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex items-center gap-2">
      Random Float In Range
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <DataHandle id="min" type="target" position={Position.Left} top="50%" label="Min" color="#3fb950" />
      <div className="flex justify-between items-center w-full">
        <DataHandle id="max" type="target" position={Position.Left} top="50%" label="Max" color="#3fb950" />
        <DataHandle id="out" type="source" position={Position.Right} top="50%" label="Return" color="#3fb950" />
      </div>
    </div>
  </div>
);

// 39. Draw Debug Line
const DrawDebugLineNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '220px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/20 to-[#58a6ff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-white flex items-center gap-2">
      <Waypoints size={14} className="text-[#58a6ff]"/> Draw Debug Line
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="start" type="target" position={Position.Left} top="50%" label="Line Start" color="#e3b341" />
      <DataHandle id="end" type="target" position={Position.Left} top="50%" label="Line End" color="#e3b341" />
      <DataHandle id="color" type="target" position={Position.Left} top="50%" label="Line Color" color="#bc8cff" />
      <DataHandle id="duration" type="target" position={Position.Left} top="50%" label="Duration" color="#3fb950" />
    </div>
  </div>
);

// Add Instanced Mesh Node
const AddInstancedMeshNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '250px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/20 to-[#58a6ff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#58a6ff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Copy size={14}/> Add Instance (HISM)</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="target" type="target" position={Position.Left} top="50%" label="HISM Component" color="#58a6ff" />
      <DataHandle id="transform" type="target" position={Position.Left} top="50%" label="Instance Transform" color="#e3b341" />
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider">World Space</span>
         <label className="relative inline-flex items-center cursor-pointer">
           <input type="checkbox" className="sr-only peer" checked={data.isWorldSpace || false} onChange={(e: any) => updateNodeData(id, { isWorldSpace: e.target.checked })} />
           <div className="w-7 h-4 bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[11px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#58a6ff]"></div>
         </label>
      </div>
      <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-[#30363d]">
        <DataHandle id="instanceIndex" type="source" position={Position.Right} top="50%" label="Instance Index" color="#3fb950" />
      </div>
    </div>
  </div>
  );
};

// 26. Apply Damage
const ApplyDamageNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#f85149'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#f85149]/20 to-[#f85149]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#f85149] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><AlertCircle size={14}/> Apply Damage</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="damagedActor" type="target" position={Position.Left} top="50%" label="Damaged Actor" color="#58a6ff" />
      <DataHandle id="baseDamage" type="target" position={Position.Left} top="50%" label="Base Damage" color="#3fb950" inputType="number" value={data.baseDamage || 0} onChange={(e: any) => updateNodeData(id, { baseDamage: e.target.value })} />
      <DataHandle id="damageCauser" type="target" position={Position.Left} top="50%" label="Damage Causer" color="#58a6ff" />
    </div>
  </div>
);
};

// 27. Create Widget
const CreateWidgetNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#58a6ff'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/20 to-[#58a6ff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#58a6ff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Layers size={14}/> Create Widget</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="class" type="target" position={Position.Left} top="50%" label="Class" color="#bc8cff" />
      <DataHandle id="owningPlayer" type="target" position={Position.Left} top="50%" label="Owning Player" color="#58a6ff" />
      <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-[#30363d]">
        <div />
        <DataHandle id="returnValue" type="source" position={Position.Right} top="50%" label="Return Value" color="#58a6ff" />
      </div>
    </div>
  </div>
);

// 28. Add to Viewport
const AddToViewportNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#58a6ff'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/20 to-[#58a6ff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#58a6ff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Layers size={14}/> Add to Viewport</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="target" type="target" position={Position.Left} top="50%" label="Target" color="#58a6ff" />
      <DataHandle id="zOrder" type="target" position={Position.Left} top="50%" label="ZOrder" color="#3fb950" />
    </div>
  </div>
);

// 29. Play Sound at Location
const PlaySoundNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#bc8cff'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#bc8cff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Play size={14}/> Play Sound at Location</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="sound" type="target" position={Position.Left} top="50%" label="Sound" color="#bc8cff" />
      <DataHandle id="location" type="target" position={Position.Left} top="50%" label="Location" color="#e3b341" />
      <DataHandle id="volumeMultiplier" type="target" position={Position.Left} top="50%" label="Volume" color="#3fb950" />
    </div>
  </div>
);

// 30. Get Variable
const GetVariableNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();

  const typeColors: Record<string, string> = {
    Boolean: '#f85149',
    Float: '#3fb950',
    String: '#bc8cff',
    Vector: '#e3b341',
    Object: '#58a6ff'
  };

  const selectedType = data.varType || 'Float';
  const nodeColor = typeColors[selectedType] || '#3fb950';

  return (
  <div style={{...nodeStyle, borderColor: nodeColor, minWidth: '160px'}}>
    <div className="px-3 py-1.5 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex justify-between items-center gap-2">
      <div className="flex items-center gap-2"><Variable size={12}/> Get Variable</div>
      <div className="w-2 h-2 rounded-full" style={{backgroundColor: nodeColor}}></div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <input type="text" value={data.varName || 'MyVar'} onChange={(e: any) => updateNodeData(id, { varName: e.target.value })} className="w-full bg-[#161b22] border border-[#30363d] px-1 text-white rounded text-[10px] outline-none h-5" placeholder="Variable Name" />
      <select value={selectedType} onChange={(e: any) => updateNodeData(id, { varType: e.target.value })} className="w-full bg-[#161b22] border border-[#30363d] px-1 text-white rounded text-[10px] outline-none h-5">
        <option value="Boolean">Boolean</option>
        <option value="Float">Float</option>
        <option value="String">String</option>
        <option value="Vector">Vector</option>
        <option value="Object">Object</option>
      </select>
      <div className="flex justify-between items-center w-full">
        <div/>
        <DataHandle id="val" type="source" position={Position.Right} top="50%" label={data.varName || 'MyVar'} color={nodeColor} />
      </div>
    </div>
  </div>
);
};

// 31. Set Variable
const SetVariableNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();

  const typeColors: Record<string, string> = {
    Boolean: '#f85149',
    Float: '#3fb950',
    String: '#bc8cff',
    Vector: '#e3b341',
    Object: '#58a6ff'
  };

  const selectedType = data.varType || 'Float';
  const nodeColor = typeColors[selectedType] || '#3fb950';

  return (
  <div style={{...nodeStyle, borderColor: nodeColor, minWidth: '180px'}}>
    <div className="px-3 py-1.5 bg-[#0d1117] border-b border-[#30363d] rounded-t-lg text-[12px] font-bold text-[#c9d1d9] flex justify-between items-center gap-2">
      <div className="flex items-center gap-2"><Variable size={12}/> Set Variable</div>
      <div className="w-2 h-2 rounded-full" style={{backgroundColor: nodeColor}}></div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <input type="text" value={data.varName || 'MyVar'} onChange={(e: any) => updateNodeData(id, { varName: e.target.value })} className="w-full bg-[#161b22] border border-[#30363d] px-1 text-white rounded text-[10px] outline-none h-5" placeholder="Variable Name" />
      <select value={selectedType} onChange={(e: any) => updateNodeData(id, { varType: e.target.value })} className="w-full bg-[#161b22] border border-[#30363d] px-1 text-white rounded text-[10px] outline-none h-5">
        <option value="Boolean">Boolean</option>
        <option value="Float">Float</option>
        <option value="String">String</option>
        <option value="Vector">Vector</option>
        <option value="Object">Object</option>
      </select>
      <div className="flex justify-between items-center w-full mt-1">
        <DataHandle id="inVal" type="target" position={Position.Left} top="50%" label={data.varName || 'MyVar'} color={nodeColor} />
        <DataHandle id="outVal" type="source" position={Position.Right} top="50%" label="" color={nodeColor} />
      </div>
    </div>
  </div>
);
};

const EventOnActorHitNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#f85149', minWidth: '220px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#f85149]/30 to-[#f85149]/5 border-b border-[#f85149]/40 rounded-t-lg text-[13px] font-bold text-[#f85149] uppercase tracking-wider flex items-center gap-2">
      <AlertCircle size={14}/> Event On Actor Hit
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      <DataHandle id="selfActor" type="source" position={Position.Right} top="50%" label="Self Actor" color="#58a6ff" />
      <DataHandle id="otherActor" type="source" position={Position.Right} top="50%" label="Other Actor" color="#58a6ff" />
      <DataHandle id="normalImpulse" type="source" position={Position.Right} top="50%" label="Normal Impulse" color="#e3b341" />
      <DataHandle id="hitData" type="source" position={Position.Right} top="50%" label="Hit" color="#58a6ff" />
    </div>
  </div>
);

// 32. On Component Hit
const OnComponentHitNode = ({ data }: { data: any }) => (
  <div style={{...nodeStyle, borderColor: '#f85149', minWidth: '220px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#f85149]/30 to-[#f85149]/5 border-b border-[#f85149]/40 rounded-t-lg text-[13px] font-bold text-[#f85149] uppercase tracking-wider flex items-center gap-2">
      <AlertCircle size={14}/> On Component Hit
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      <DataHandle id="hitComponent" type="source" position={Position.Right} top="50%" label="Hit Component" color="#58a6ff" />
      <DataHandle id="otherActor" type="source" position={Position.Right} top="50%" label="Other Actor" color="#58a6ff" />
      <DataHandle id="otherComp" type="source" position={Position.Right} top="50%" label="Other Comp" color="#58a6ff" />
      <DataHandle id="normalImpulse" type="source" position={Position.Right} top="50%" label="Normal Impulse" color="#e3b341" />
      <DataHandle id="hitResult" type="source" position={Position.Right} top="50%" label="Hit Result" color="#58a6ff" />
    </div>
  </div>
);

const ConditionEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEdges((edges) => edges.map((edge) => {
      if (edge.id === id) {
        return { ...edge, data: { ...edge.data, condition: value } };
      }
      return edge;
    }));
  };

  const label = (data as any)?.condition || '';

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div className="bg-[#161b22] border border-[#30363d] rounded flex items-center px-1 shadow-lg shadow-black/50 overflow-hidden min-w-[60px]">
             <input 
                type="text"
                className="bg-transparent text-[10px] text-[#58a6ff] outline-none text-center font-mono w-full px-1 py-0.5"
                placeholder="Condition..."
                value={label}
                onChange={onConditionChange}
             />
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

// AI Scene Generator
const AISceneGenNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '300px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/30 to-[#bc8cff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#bc8cff] tracking-wider flex items-center gap-2">
      <Sparkles size={14}/> AI Gen Scene Elements
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Generate" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Ready" />
      </div>
      <DataHandle id="prompt" type="target" position={Position.Left} top="50%" label="Prompt" color="#1f6feb" inputType="text" value={data.prompt} onChange={(e: any) => updateNodeData(id, { prompt: e.target.value })} />
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1">Include Base Meshes</label>
        <input type="checkbox" checked={data.baseMeshes !== false} onChange={(e) => updateNodeData(id, { baseMeshes: e.target.checked })} className="accent-[#bc8cff]" />
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1">Include Lighting</label>
        <input type="checkbox" checked={data.lighting !== false} onChange={(e) => updateNodeData(id, { lighting: e.target.checked })} className="accent-[#bc8cff]" />
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1">Include Skybox</label>
        <input type="checkbox" checked={data.skybox !== false} onChange={(e) => updateNodeData(id, { skybox: e.target.checked })} className="accent-[#bc8cff]" />
      </div>
      <DataHandle id="sceneGroup" type="source" position={Position.Right} top="50%" label="Scene Group" color="#58a6ff" />
    </div>
  </div>
);
};

// AI Auto-Rigger
const AIAutoRiggerNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#ff7b72', minWidth: '300px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#ff7b72]/30 to-[#ff7b72]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#ff7b72] tracking-wider flex items-center gap-2">
      <UserSquare size={14}/> Offline AI Auto-Rigger & IK Setup
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Rig Model" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Ready" />
      </div>
      <DataHandle id="mesh" type="target" position={Position.Left} top="50%" label="Static Mesh" color="#58a6ff" />
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1">Morphology</span>
         <select value={data.morphology || 'Biped'} onChange={(e) => updateNodeData(id, { morphology: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white uppercase ml-2"><option>Biped</option><option>Quadruped</option><option>Arachnid</option><option>Avian</option></select>
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1">Generate FK/IK Controls</label>
        <input type="checkbox" checked={data.fkik !== false} onChange={(e) => updateNodeData(id, { fkik: e.target.checked })} className="accent-[#ff7b72]" />
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1">Enable Map Retargeting</label>
        <input type="checkbox" checked={data.retarget !== false} onChange={(e) => updateNodeData(id, { retarget: e.target.checked })} className="accent-[#ff7b72]" />
      </div>
      <DataHandle id="skeletalMesh" type="source" position={Position.Right} top="50%" label="Skeletal Mesh" color="#58a6ff" />
    </div>
  </div>
);
};

// AI Material Gen
const AIMaterialGenNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#e3b341', minWidth: '300px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#e3b341]/30 to-[#e3b341]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#e3b341] tracking-wider flex items-center gap-2">
      <Image size={14}/> Offline AI PBR Material Gen
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Generate" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Ready" />
      </div>
      <DataHandle id="prompt" type="target" position={Position.Left} top="50%" label="Prompt" color="#1f6feb" inputType="text" value={data.prompt} onChange={(e: any) => updateNodeData(id, { prompt: e.target.value })} />
      <DataHandle id="refImage" type="target" position={Position.Left} top="50%" label="Ref Texture (Opt)" color="#58a6ff" />
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1">Diffuse Map</label>
        <input type="checkbox" checked={data.diffuse !== false} onChange={(e) => updateNodeData(id, { diffuse: e.target.checked })} className="accent-[#e3b341]" />
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1">Normal Map</label>
        <input type="checkbox" checked={data.normal !== false} onChange={(e) => updateNodeData(id, { normal: e.target.checked })} className="accent-[#e3b341]" />
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1">Roughness Map</label>
        <input type="checkbox" checked={data.roughness !== false} onChange={(e) => updateNodeData(id, { roughness: e.target.checked })} className="accent-[#e3b341]" />
      </div>
      <DataHandle id="material" type="source" position={Position.Right} top="50%" label="PBR Material" color="#e3b341" />
    </div>
  </div>
);
};

// AI Mesh Optimizer
const AIMeshOptNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '300px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/30 to-[#58a6ff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#58a6ff] tracking-wider flex items-center gap-2">
      <Grid3X3 size={14}/> Offline AI Mesh Optimizer & Retopo
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Process" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Done" />
      </div>
      <DataHandle id="mesh" type="target" position={Position.Left} top="50%" label="Input Mesh(es)" color="#58a6ff" />
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1">Quad-Retopology</label>
        <input type="checkbox" checked={data.retopo !== false} onChange={(e) => updateNodeData(id, { retopo: e.target.checked })} className="accent-[#58a6ff]" />
      </div>
      <div className="flex justify-between w-full">
        <span className="text-[#8b949e] text-[9px]">Target Polycount</span>
        <input type="number" value={data.polycount || 5000} onChange={(e: any) => updateNodeData(id, { polycount: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded px-1 text-[9px] w-16 text-white outline-none" />
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1">Smart UV Unwrap</label>
        <input type="checkbox" checked={data.uvunwrap !== false} onChange={(e) => updateNodeData(id, { uvunwrap: e.target.checked })} className="accent-[#58a6ff]" />
      </div>
      <DataHandle id="optMesh" type="source" position={Position.Right} top="50%" label="Optimized Mesh" color="#58a6ff" />
    </div>
  </div>
);
};

// AI VFX Generator
const AIVFXGenNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '300px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/30 to-[#bc8cff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#bc8cff] tracking-wider flex items-center gap-2">
      <Zap size={14}/> Offline AI Niagara VFX Gen
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Generate" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Ready" />
      </div>
      <DataHandle id="prompt" type="target" position={Position.Left} top="50%" label="Prompt" color="#1f6feb" inputType="text" value={data.prompt} onChange={(e: any) => updateNodeData(id, { prompt: e.target.value })} />
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative">
         <span className="text-[10px] uppercase text-[#8b949e] font-bold tracking-wider flex items-center gap-1">VFX Type Hint</span>
         <select value={data.vfxType || 'Fire'} onChange={(e) => updateNodeData(id, { vfxType: e.target.value })} className="bg-[#0d1117] border border-[#30363d] rounded text-[9px] outline-none h-4 text-white uppercase ml-2"><option>Fire / Smoke</option><option>Lightning</option><option>Magic Aura</option><option>Fluid System</option></select>
      </div>
      <DataHandle id="vfxAsset" type="source" position={Position.Right} top="50%" label="Niagara System" color="#bc8cff" />
    </div>
  </div>
);
};

// Adult Content Restriction (Unrestricted Mode)
const UnrestrictedContentNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#f85149', minWidth: '300px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#f85149]/30 to-[#f85149]/5 border-b border-[#f85149]/40 rounded-t-lg text-[13px] font-bold text-[#f85149] tracking-wider flex items-center gap-2">
      <AlertCircle size={14}/> AI Content Filter (18+/20+)
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Set Filter" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#1f0d0d] border border-[#f85149]/50 p-1.5 rounded relative mb-2">
         <span className="text-[10px] uppercase text-[#f85149] font-bold tracking-wider flex items-center gap-1">Rating Target</span>
         <select value={data.rating || 'Unrestricted (20+)'} onChange={(e) => updateNodeData(id, { rating: e.target.value })} className="bg-[#0d1117] border border-[#f85149] rounded text-[9px] outline-none h-4 text-[#f85149] uppercase ml-2"><option>E (Everyone)</option><option>M (Mature 17+)</option><option>AO (Adults Only 18+)</option><option>Unrestricted (20+)</option></select>
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1">Allow Gore/Violence</label>
        <input type="checkbox" checked={data.gore !== false} onChange={(e) => updateNodeData(id, { gore: e.target.checked })} className="accent-[#f85149]" />
      </div>
      <div className="mt-1 flex items-center justify-between bg-[#161b22] border border-[#30363d] p-1.5 rounded relative mb-2">
        <label className="text-[10px] text-[#8b949e] font-semibold flex items-center gap-1">Allow NSFW/Nudity (18+)</label>
        <input type="checkbox" checked={data.nsfw !== false} onChange={(e) => updateNodeData(id, { nsfw: e.target.checked })} className="accent-[#f85149]" />
      </div>
      <div className="text-[9px] text-[#8b949e] italic leading-tight pl-1 border-l-2 border-[#f85149]">
        Warning: Bypassing safety filters allows AI to produce extreme violence, adult themes, and unfiltered text/meshes.
      </div>
    </div>
  </div>
);
};

const edgeTypes = {
  condition: ConditionEdge,
};


// AI Node: Create Movement Component
const AICreateMovementNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#bc8cff]/30 rounded-t-lg text-[13px] font-bold text-[#bc8cff] flex items-center gap-2">
      <Bot size={14}/> AI Generate Movement
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <div className="text-[10px] text-[#8b949e]">Prompt:</div>
      <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[10px] text-white w-full h-12 outline-none resize-none" defaultValue={data.prompt} placeholder="e.g. Make the player character move like a tank" onChange={(e) => updateNodeData(id, { prompt: e.target.value })}/>
      <DataHandle id="movementComp" type="source" position={Position.Right} top="50%" label="Movement Comp" color="#58a6ff" />
      <button className="mt-1 w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 rounded py-1 text-[10px]"> Generate Node Logic</button>
    </div>
  </div>
);
};

// AI Node: Spawn Actor
const AISpawnActorNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#bc8cff]/30 rounded-t-lg text-[13px] font-bold text-[#bc8cff] flex items-center gap-2">
      <Bot size={14}/> AI Spawn Actor
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <div className="text-[10px] text-[#8b949e]">Prompt:</div>
      <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[10px] text-white w-full h-12 outline-none resize-none" defaultValue={data.prompt} placeholder="e.g. Spawn a rusty barrel at the player's location" onChange={(e) => updateNodeData(id, { prompt: e.target.value })}/>
      <DataHandle id="actorOut" type="source" position={Position.Right} top="50%" label="Spawned Actor" color="#58a6ff" />
      <button className="mt-1 w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 rounded py-1 text-[10px]"> Generate Actor Template</button>
    </div>
  </div>
);
};

// AI Node: Configure Physics
const AIConfigurePhysicsNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#bc8cff]/30 rounded-t-lg text-[13px] font-bold text-[#bc8cff] flex items-center gap-2">
      <Bot size={14}/> AI Configure Physics
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="actorTarget" type="target" position={Position.Left} top="50%" label="Target Actor" color="#58a6ff" />
      <div className="text-[10px] text-[#8b949e]">Prompt:</div>
      <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[10px] text-white w-full h-12 outline-none resize-none" defaultValue={data.prompt} placeholder="e.g. Set properties for slippery ice movement" onChange={(e) => updateNodeData(id, { prompt: e.target.value })}/>
      <button className="mt-1 w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 rounded py-1 text-[10px]"> Apply Physics Profile</button>
    </div>
  </div>
);
};

// AI Node: Generate NPC Behaviors / Behavior Logic
const AIGenerateNPCBehaviorNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#bc8cff]/30 rounded-t-lg text-[13px] font-bold text-[#bc8cff] flex items-center gap-2">
      <Bot size={14}/> AI Gen NPC Behavior Logic
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="contextData" type="target" position={Position.Left} top="50%" label="Context Data Array" color="#3fb950" />
      <div className="text-[10px] text-[#8b949e]">Prompt:</div>
      <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[10px] text-white w-full h-16 outline-none resize-none" defaultValue={data.prompt} placeholder="e.g. Create an AI behavior for a stealthy assassin that attacks when player detected" onChange={(e) => updateNodeData(id, { prompt: e.target.value })}/>
      <DataHandle id="logicOut" type="source" position={Position.Right} top="50%" label="Generated Logic Tree" color="#e3b341" />
      <button className="mt-1 w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 rounded py-1 text-[10px]"> Compile AI Brain</button>
    </div>
  </div>
);
};

// AI Node: Generate Actor Full Setup
const AIGenerateActorNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#bc8cff]/30 rounded-t-lg text-[13px] font-bold text-[#bc8cff] flex items-center gap-2">
      <Bot size={14}/> AI Generate Full Actor
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <div className="text-[10px] text-[#8b949e]">Prompt (Stats, Type, Behavior):</div>
      <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[10px] text-white w-full h-16 outline-none resize-none" defaultValue={data.prompt} placeholder="e.g. Generate a fast scout enemy with low HP, high evasion, and erratic movement" onChange={(e) => updateNodeData(id, { prompt: e.target.value })}/>
      <DataHandle id="actorOut" type="source" position={Position.Right} top="50%" label="Actor Class Definition" color="#58a6ff" />
      <button className="mt-1 w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 rounded py-1 text-[10px]"> Generate Actor Class</button>
    </div>
  </div>
);
};

// AI Node: Generate Scene/Environment
const AIGenerateEnvironmentNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '260px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#bc8cff]/30 rounded-t-lg text-[13px] font-bold text-[#bc8cff] flex items-center gap-2">
      <Bot size={14}/> AI Gen Environment/Scene
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <div className="text-[10px] text-[#8b949e]">Environment Prompt:</div>
      <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[10px] text-white w-full h-16 outline-none resize-none" defaultValue={data.prompt} placeholder="e.g. Create a dense fantasy forest with ancient ruins and a mystical river" onChange={(e) => updateNodeData(id, { prompt: e.target.value })}/>
      <DataHandle id="sceneOut" type="source" position={Position.Right} top="50%" label="Scene Setup Data" color="#f8a" />
      <button className="mt-1 w-full bg-[#bc8cff]/10 hover:bg-[#bc8cff]/20 text-[#bc8cff] border border-[#bc8cff]/30 rounded py-1 text-[10px]"> Generate Meshes & Lighting</button>
    </div>
  </div>
);
};

// Custom TypeScript Logic Node
const CustomTypeScriptNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  // We'll use a local state to toggle full IDE view
  const [isEditing, setIsEditing] = React.useState(false);
  const code = data.code || '// Add custom conditions and logic here\nexport function execute(context) {\n  return true;\n}';

  return (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '320px', zIndex: isEditing ? 1000 : 1}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#3fb950]/30 to-[#3fb950]/5 border-b border-[#3fb950]/40 rounded-t-lg text-[13px] font-bold text-[#3fb950] tracking-wider flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2"><Code2 size={14}/> Custom Logic & Conditions</div>
      <button onClick={() => setIsEditing(!isEditing)} className="text-[#8b949e] hover:text-white"><Maximize2 size={12}/></button>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="In" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Out" />
      </div>
      <div className="flex justify-between w-full mt-2">
         <DataHandle id="dataIn" type="target" position={Position.Left} top="50%" label="Data In" color="#58a6ff" />
         <DataHandle id="dataOut" type="source" position={Position.Right} top="50%" label="Data Out" color="#58a6ff" />
      </div>
      
      {isEditing ? (
         <div className="mt-2 flex flex-col gap-1 relative">
            <div className="text-[10px] text-[#8b949e] flex justify-between"><span>Edit Code (IDE Mode)</span><button onClick={() => setIsEditing(false)}><Minimize2 size={10}/></button></div>
            <textarea 
               className="bg-[#0a0a0a] border border-[#30363d] rounded p-2 text-[11px] font-mono text-[#c9d1d9] w-[400px] h-[300px] outline-none custom-scrollbar" 
               value={code} 
               onChange={(e) => updateNodeData(id, { code: e.target.value })}
               onKeyDown={(e) => e.stopPropagation()}
            />
         </div>
      ) : (
         <div className="mt-2 flex flex-col gap-1 cursor-text" onClick={() => setIsEditing(true)}>
            <div className="text-[10px] text-[#8b949e]">Logic Summary:</div>
            <div className="bg-[#0a0a0a] border border-[#30363d] rounded p-2 text-[9px] font-mono text-[#8b949e] opacity-70 line-clamp-3">
               {code}
            </div>
         </div>
      )}
      <div className="text-[9px] text-[#8b949e] italic mt-1">Allows unlimited capabilities via direct code execution.</div>
    </div>
  </div>
);
};

// Offline AI: Novel Character Generator
const AINovelCharacterGenNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '320px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#bc8cff]/30 rounded-t-lg text-[13px] font-bold text-[#bc8cff] flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Bot size={14}/> Offline AI Novel Character Details</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="In" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Out" />
      </div>
      <div className="text-[10px] text-[#8b949e] leading-tight">Micro-Level Description (mm/cm bounds):<br/><span className="text-[9px] opacity-70">Physical dimensions, facial marks, clothing tears, proportions</span></div>
      <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[10px] text-[#58a6ff] w-full h-32 outline-none resize-none custom-scrollbar" value={data.prompt || ''} placeholder="e.g. Height: 180cm, Width: 45cm. Face: Pimple at X:12mm Y:5mm size 2mm. Clothes: Ripped shirt 5mm tear at chest..." onChange={(e) => updateNodeData(id, { prompt: e.target.value })}/>
      
      <div className="flex justify-between items-center w-full mt-1">
        <DataHandle id="dataOut" type="source" position={Position.Right} top="50%" label="Detailed Model Data" color="#bc8cff" />
      </div>
    </div>
  </div>
);
};

// Offline AI: Novel Environment Generator
const AINovelEnvironmentGenNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '320px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#bc8cff]/30 rounded-t-lg text-[13px] font-bold text-[#bc8cff] flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Layers size={14}/> Offline AI Novel Environment</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="In" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Out" />
      </div>
      <div className="text-[10px] text-[#8b949e]">Scene Micro-Mapping (mm bounds):</div>
      <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[10px] text-[#58a6ff] w-full h-24 outline-none resize-none custom-scrollbar" value={data.prompt || ''} placeholder="e.g. Interior castle hall. Door height 250cm. Wall cracks exact mm position..." onChange={(e) => updateNodeData(id, { prompt: e.target.value })}/>
      <div className="flex justify-between items-center w-full mt-1">
        <DataHandle id="dataOut" type="source" position={Position.Right} top="50%" label="Environment Metrics" color="#bc8cff" />
      </div>
    </div>
  </div>
);
};

// Offline AI: Novel World Generator
const AINovelWorldGenNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '340px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#bc8cff]/30 rounded-t-lg text-[13px] font-bold text-[#bc8cff] flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Globe size={14}/> Offline AI World Builder</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="In" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Out" />
      </div>
      <div className="text-[10px] text-[#8b949e] leading-tight">Master World Lore & Topography (Extreme Detail):<br/><span className="text-[9px] opacity-70">Continents, Kingdoms, Biomes, Politics, History, Maps</span></div>
      <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[10px] text-[#58a6ff] w-full h-32 outline-none resize-none custom-scrollbar" value={data.prompt || ''} placeholder="e.g. A fully realized planet 'Eos' with 7 continents. Kingdom of Aethelgard has 4 provinces, specific exact mm map scales, history of 4000 years, ecosystem details..." onChange={(e) => updateNodeData(id, { prompt: e.target.value })}/>
      
      <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col gap-1 mt-1">
         <div className="text-[10px] font-bold text-[#c9d1d9]">Generation Targets:</div>
         <label className="flex items-center gap-2 text-[10px] text-[#8b949e]">
            <input type="checkbox" checked={data.genMaps !== false} onChange={(e) => updateNodeData(id, { genMaps: e.target.checked })} className="accent-[#bc8cff]" />
            Generate Geological Maps (Scale, Topography)
         </label>
         <label className="flex items-center gap-2 text-[10px] text-[#8b949e]">
            <input type="checkbox" checked={data.genNations !== false} onChange={(e) => updateNodeData(id, { genNations: e.target.checked })} className="accent-[#bc8cff]" />
            Generate Nations (Politics, Economy, Culture)
         </label>
         <label className="flex items-center gap-2 text-[10px] text-[#8b949e]">
            <input type="checkbox" checked={data.genMonsters !== false} onChange={(e) => updateNodeData(id, { genMonsters: e.target.checked })} className="accent-[#bc8cff]" />
            Generate Deep Monster Ecology & Behaviors
         </label>
      </div>

      <div className="flex justify-between items-center w-full mt-1">
        <DataHandle id="worldData" type="source" position={Position.Right} top="50%" label="World Database Master" color="#bc8cff" />
      </div>
    </div>
  </div>
);
};

// Offline AI: Lore System (Permanent Consistency DB)
const AINovelLoreSystemNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '360px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#bc8cff]/30 rounded-t-lg text-[13px] font-bold text-[#bc8cff] flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Database size={14}/> Offline AI Lore System DB</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Sync Lore" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Synced" />
      </div>
      
      <div className="flex justify-between items-center w-full mt-1">
        <DataHandle id="worldIn" type="target" position={Position.Left} top="50%" label="World Database Master" color="#bc8cff" />
        <DataHandle id="charIn" type="target" position={Position.Left} top="50%" label="Character Prototypes" color="#bc8cff" />
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col gap-1 mt-2">
         <div className="text-[10px] font-bold text-[#c9d1d9] flex justify-between"><span>Permanent Lore Constraints:</span><BookOpen size={12} className="text-[#8b949e]" /></div>
         <label className="flex items-center gap-2 text-[10px] text-[#8b949e]">
            <input type="checkbox" checked={data.keepManual !== false} onChange={(e) => updateNodeData(id, { keepManual: e.target.checked })} className="accent-[#bc8cff]" />
            Strict World Manual Conformance (Laws of Physics & Magic)
         </label>
         <label className="flex items-center gap-2 text-[10px] text-[#8b949e]">
            <input type="checkbox" checked={data.keepProfiles !== false} onChange={(e) => updateNodeData(id, { keepProfiles: e.target.checked })} className="accent-[#bc8cff]" />
            Strict Character Profile Match (Growth, Personality, Stats)
         </label>
         <label className="flex items-center gap-2 text-[10px] text-[#8b949e]">
            <input type="checkbox" checked={data.keepPlots !== false} onChange={(e) => updateNodeData(id, { keepPlots: e.target.checked })} className="accent-[#bc8cff]" />
            Plot Structure & Timeline Continuity Preservation
         </label>
         <label className="flex items-center gap-2 text-[10px] text-[#8b949e]">
            <input type="checkbox" checked={data.keepDetails !== false} onChange={(e) => updateNodeData(id, { keepDetails: e.target.checked })} className="accent-[#bc8cff]" />
            Micro-Detail Memory (mm/cm scales, Scars, Items)
         </label>
      </div>

      <div className="text-[10px] text-[#8b949e] leading-tight mt-1">Master DB Context String:<br/><span className="text-[9px] opacity-70">Define any unwritten overarching laws of the universe.</span></div>
      <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-2 text-[10px] text-[#58a6ff] w-full h-16 outline-none resize-none custom-scrollbar" value={data.prompt || ''} placeholder="e.g. 'Mana flow cannot exceed 4000 units/second in any entity. Magic requires line of sight...'" onChange={(e) => updateNodeData(id, { prompt: e.target.value })}/>
      
      <div className="flex justify-between items-center w-full mt-2">
        <DataHandle id="loreContextOut" type="source" position={Position.Right} top="50%" label="Lore Constraint Context (For Chapter Gen)" color="#bc8cff" />
      </div>
    </div>
  </div>
);
};

// Offline AI: Verifier Node
const AIModelVerifierNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#ff7b72', minWidth: '320px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#ff7b72]/20 to-[#ff7b72]/5 border-b border-[#ff7b72]/30 rounded-t-lg text-[13px] font-bold text-[#ff7b72] flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><BoxSelect size={14}/> Offline AI Verifier System</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Verify Start" />
        <ExecHandle id="execTrue" type="source" position={Position.Right} top="50%" label="Verified (Pass)" color="#3fb950"/>
      </div>
       <div className="flex justify-end w-full">
        <ExecHandle id="execFalse" type="source" position={Position.Right} top="50%" label="Failed (Reject)" color="#f85149" />
      </div>
      
      <div className="flex justify-between items-center w-full mt-1">
        <DataHandle id="modelIn" type="target" position={Position.Left} top="50%" label="Input Mesh" color="#58a6ff" />
        <DataHandle id="descIn" type="target" position={Position.Left} top="50%" label="Text Prompt rules" color="#bc8cff" />
      </div>
      
      <div className="bg-[#161b22] border border-[#30363d] rounded p-2 flex flex-col gap-1 mt-2">
         <div className="text-[10px] font-bold text-[#c9d1d9]">Strict Verification Thresholds:</div>
         <label className="flex items-center gap-2 text-[10px] text-[#8b949e]">
            <input type="checkbox" checked={data.checkChar !== false} onChange={(e) => updateNodeData(id, { checkChar: e.target.checked })} className="accent-[#ff7b72]" />
            Require Character Match &gt;= 97%
         </label>
         <label className="flex items-center gap-2 text-[10px] text-[#8b949e]">
            <input type="checkbox" checked={data.checkEnv !== false} onChange={(e) => updateNodeData(id, { checkEnv: e.target.checked })} className="accent-[#ff7b72]" />
            Require Environment Match &gt;= 95%
         </label>
         <label className="flex items-center gap-2 text-[10px] text-[#8b949e]">
            <input type="checkbox" checked={data.checkProp !== false} onChange={(e) => updateNodeData(id, { checkProp: e.target.checked })} className="accent-[#ff7b72]" />
            Proportion Logic (Door vs Model Height)
         </label>
      </div>
    </div>
  </div>
);
};

// XX. PCG World Generation
const PCGWorldGenNode = ({ id, data }: { id: string, data: any }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#3fb950', minWidth: '260px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#3fb950]/30 to-[#3fb950]/5 border-b border-[#333] rounded-t-lg text-[13px] font-bold text-[#3fb950] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Globe size={14}/> PCG: World Gen</div>
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Complete" />
      </div>
      <DataHandle id="seed" type="target" position={Position.Left} top="50%" label="Seed" color="#3fb950" inputType="number" value={data.seed || 12345} onChange={(e: any) => updateNodeData(id, { seed: e.target.value })} />
      <DataHandle id="biome" type="target" position={Position.Left} top="50%" label="Biome Config" color="#e3b341" />
      <DataHandle id="bounds" type="target" position={Position.Left} top="50%" label="Bounds Box" color="#e3b341" />
      <DataHandle id="output" type="source" position={Position.Right} top="50%" label="Generated World" color="#bc8cff" />
    </div>
  </div>
);
};

const AddSkeletalMeshComponentNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '220px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/20 to-[#58a6ff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#58a6ff] tracking-wider flex items-center gap-2">
      <UserSquare size={14}/> Add Skeletal Mesh Component
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="" />
      </div>
      <DataHandle id="target" type="target" position={Position.Left} top="50%" label="Target" color="#58a6ff" />
      <DataHandle id="mesh" type="target" position={Position.Left} top="50%" label="Skeletal Mesh" color="#bc8cff" />
      <DataHandle id="animClass" type="target" position={Position.Left} top="50%" label="Anim Class" color="#bc8cff" />
      <DataHandle id="returnVal" type="source" position={Position.Right} top="50%" label="Return Value" color="#58a6ff" />
    </div>
  </div>
);
};

const IKSolverNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#58a6ff', minWidth: '240px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#58a6ff]/20 to-[#58a6ff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#58a6ff] tracking-wider flex items-center gap-2">
      <Network size={14}/> Two-Bone IK Solver
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Component Pose" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="Output Pose" />
      </div>
      <div className="font-mono text-[10px] text-[#8b949e] px-1 py-1">IK Bone: {data.ikBone || 'hand_r'}</div>
      <DataHandle id="effectorLoc" type="target" position={Position.Left} top="50%" label="Effector Location" color="#e3b341" />
      <DataHandle id="jointTarget" type="target" position={Position.Left} top="50%" label="Joint Target" color="#e3b341" />
      <DataHandle id="alpha" type="target" position={Position.Left} top="50%" label="Alpha" color="#3fb950" inputType="number" value={data.alpha !== undefined ? data.alpha : 1.0} onChange={(e: any) => updateNodeData(id, { alpha: e.target.value })} />
    </div>
  </div>
);
};

const AIAnimationGenNode = ({ data, id }: { data: any, id: string }) => {
  const { updateNodeData } = useReactFlow();
  return (
  <div style={{...nodeStyle, borderColor: '#bc8cff', minWidth: '280px'}}>
    <div className="px-3 py-1.5 bg-gradient-to-r from-[#bc8cff]/20 to-[#bc8cff]/5 border-b border-[#30363d] rounded-t-lg text-[13px] font-bold text-[#bc8cff] tracking-wider flex items-center justify-between gap-2">
      <div className="flex items-center gap-2"><Bot size={14}/> AI Anim Generation</div>
      <Sparkles size={12} className="text-[#bc8cff]" />
    </div>
    <div className="p-2 py-3 flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <ExecHandle id="execIn" type="target" position={Position.Left} top="50%" label="Execute" />
        <ExecHandle id="execOut" type="source" position={Position.Right} top="50%" label="On Generated" />
      </div>
      <DataHandle id="skeleton" type="target" position={Position.Left} top="50%" label="Target Skeleton" color="#58a6ff" />
      <textarea className="bg-[#0d1117] border border-[#30363d] rounded p-1 text-[10px] text-white w-full h-12 outline-none resize-none" defaultValue={data.prompt} placeholder="e.g. A heavy limping walk cycle with a greatsword" onChange={(e) => updateNodeData(id, { prompt: e.target.value })}/>
      <DataHandle id="animSeq" type="source" position={Position.Right} top="50%" label="AnimSequence (Asset)" color="#bc8cff" />
    </div>
  </div>
);
};

const nodeTypes = {
  customEvent: CustomEventNode,
  callCustomEvent: CallCustomEventNode,
  customLogic: CustomTypeScriptNode,
  pcgWorldGen: PCGWorldGenNode,
  beginPlay: EventBeginPlayNode,
  tick: EventTickNode,
  print: PrintStringNode,
  branch: BranchNode,
  getPlayer: GetPlayerNode,
  getLoc: GetActorLocationNode,
  getRot: GetActorRotationNode,
  setLoc: SetActorLocationNode,
  sequence: SequenceNode,
  delay: DelayNode,
  mathMul: MathMultiplyNode,
  mathAdd: MathAddNode,
  mathSub: MathSubNode,
  mathDivide: MathDivideNode,
  mathAddV: MathAddVectorNode,
  mathSubV: MathSubVectorNode,
  mathDotProduct: MathDotProductNode,
  mathCrossProduct: MathCrossProductNode,
  mathNormalize: MathNormalizeNode,
  mathVectorLength: MathVectorLengthNode,
  mathDistance: MathDistanceNode,
  mathLerp: MathLerpVectorNode,
  mathClamp: MathClampNode,
  mathMapRange: MathMapRangeNode,
  makeRotator: MakeRotatorNode,
  flipFlop: FlipFlopNode,
  gate: GateNode,
  boolAnd: BoolAndNode,
  boolNot: BoolNotNode,
  makeArray: MakeArrayNode,
  constructVector: ConstructVectorNode,
  cast: CastNode,
  spawn: SpawnActorNode,
  spawnPrefab: SpawnPrefabNode,
  inputKey: InputKeyNode,
  inputAxis: InputAxisNode,
  array2D: Array2DNode,
  forLoop: ForLoopNode,
  whileLoop: WhileLoopNode,
  doOnce: DoOnceNode,
  lineTrace: LineTraceNode,
  applyDamage: ApplyDamageNode,
  applyForce: ApplyForceNode,
  setPhysicsProps: SetPhysicsPropertiesNode,
  addInstancedMesh: AddInstancedMeshNode,
  createWidget: CreateWidgetNode,
  addToViewport: AddToViewportNode,
  playSound: PlaySoundNode,
  getVar: GetVariableNode,
  setVar: SetVariableNode,
  onHit: OnComponentHitNode,
  onActorHit: EventOnActorHitNode,
  aiMovement: AIGenMovementNode,
  aiCombat: AIGenCombatNode,
  aiActor: AIGenActorNode,
  hardwareOptimizer: HardwareOptimizerNode,
  offlineAIAccelerator: OfflineAIAcceleratorNode,
  levelScript: LevelScriptNode,
  importExternalAssets: ImportExternalAssetsNode,
  offlineAI3DModelGen: OfflineAI3DModelGenNode,
  offlineAI3DMapGen: OfflineAI3DMapGenNode,
  offlineAIWebLearn: OfflineAIWebLearnNode,
  aiTransform: AIGenTransformNode,
  aiTexture: AIGenTextureNode,
  aiProximity: AIGenProximityNode,
  aiBehaviorLogic: AIGenBehaviorLogicNode,
  smartDoor: SmartDoorNode,
  reflectionProbe: ReflectionProbeNode,
  enableCulling: EnableCullingNode,
  streamLevel: StreamLevelNode,
  asyncLoadAsset: AsyncLoadAssetNode,
  aiMechanic: AIGenMechanicNode,
  appendString: AppendStringNode,
  arrayAdd: ArrayAddNode,
  overlapBegin: OnOverlapBeginNode,
  overlapEnd: OnOverlapEndNode,
  sphereTrace: SphereTraceNode,
  getMousePos: GetMousePositionNode,
  mathRandomFloat: MathRandomFloatNode,
  drawDebugLine: DrawDebugLineNode,
  aiSceneGen: AISceneGenNode,
  aiAutoRigger: AIAutoRiggerNode,
  aiMaterialGen: AIMaterialGenNode,
  aiMeshOpt: AIMeshOptNode,
  aiVfxGen: AIVFXGenNode,
  adultContent: UnrestrictedContentNode,
  aiCreateMovement: AICreateMovementNode,
  aiSpawnActor: AISpawnActorNode,
  aiConfigPhysics: AIConfigurePhysicsNode,
  aiGenNPCBehavior: AIGenerateNPCBehaviorNode,
  aiGenActor: AIGenerateActorNode,
  aiGenEnvironment: AIGenerateEnvironmentNode,
  aiNovelChar: AINovelCharacterGenNode,
  aiNovelEnv: AINovelEnvironmentGenNode,
  aiNovelWorld: AINovelWorldGenNode,
  aiLoreSystem: AINovelLoreSystemNode,
  aiVerifier: AIModelVerifierNode,
  addSkeletalMesh: AddSkeletalMeshComponentNode,
  ikSolver: IKSolverNode,
  aiAnimationGen: AIAnimationGenNode,
};

const initialNodes: Node[] = [
  { id: 'bp_input', type: 'inputKey', position: { x: -200, y: 500 }, data: {} },
  { id: 'bp_smart_door', type: 'smartDoor', position: { x: 100, y: 500 }, data: {} },
  { id: 'bp_reflection', type: 'reflectionProbe', position: { x: 500, y: 500 }, data: {} },
  { id: 'bp_input_space', type: 'inputKey', position: { x: -250, y: -200 }, data: { key: 'Spacebar' } },
  { id: 'bp_call_custom', type: 'callCustomEvent', position: { x: 50, y: -200 }, data: { eventName: 'MyCustomEvent' } },
  { id: 'bp_custom_evt', type: 'customEvent', position: { x: -250, y: 50 }, data: { eventName: 'MyCustomEvent' } },
  { id: 'bp1', type: 'beginPlay', position: { x: -200, y: 220 }, data: {} },
  { id: 'bp_ai_actor', type: 'aiActor', position: { x: 50, y: 150 }, data: { prompt: "Cyberpunk Mercenary" } },
  { id: 'bp_ai_anim', type: 'aiAnimationGen', position: { x: 50, y: 350 }, data: { prompt: "Aggressive strafing animation while aiming rifle" } },
  { id: 'bp_skel_mesh', type: 'addSkeletalMesh', position: { x: 450, y: 150 }, data: {} },
  { id: 'bp_ik_solver', type: 'ikSolver', position: { x: 800, y: 150 }, data: { ikBone: 'hand_l' } },
  { id: 'bp_ai_move', type: 'aiMovement', position: { x: 450, y: 350 }, data: { useAIPathfinding: true, moveSpeed: 600 } },
  { id: 'bp_ai_com', type: 'aiCombat', position: { x: 1100, y: 220 }, data: {} },
  { id: 'bp_ai_trans', type: 'aiTransform', position: { x: 50, y: 350 }, data: {} },
  { id: 'bp_ai_mech', type: 'aiMechanic', position: { x: 1100, y: 380 }, data: {} },
  { id: 'bp_seq', type: 'sequence', position: { x: 150, y: 50 }, data: {} },
  { id: 'bp2', type: 'print', position: { x: 400, y: -100 }, data: {} },
  { id: 'bp_delay', type: 'delay', position: { x: 400, y: 50 }, data: {} },
  { id: 'bp_spawn', type: 'spawn', position: { x: 800, y: 220 }, data: {} }
,
    { id: '11', type: 'aiSpawnActor', position: { x: 80, y: 350 }, data: { prompt: '' } },
    { id: '12', type: 'aiConfigPhysics', position: { x: 400, y: 350 }, data: { prompt: '' } },
    { id: '13', type: 'aiGenNPCBehavior', position: { x: 80, y: 560 }, data: { prompt: '' } },
    { id: '14', type: 'aiGenEnvironment', position: { x: 400, y: 560 }, data: { prompt: '' } }
    ];

const initialEdges: Edge[] = [
  { id: 'e_space_custom', source: 'bp_input_space', target: 'bp_call_custom', sourceHandle: 'execPressed', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e_custom_seq', source: 'bp_custom_evt', target: 'bp_seq', sourceHandle: 'execOut', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e_input_door', source: 'bp_input', target: 'bp_smart_door', sourceHandle: 'execPressed', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e1', source: 'bp1', target: 'bp_ai_actor', sourceHandle: 'execOut', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e_ai_actor_to_skel', source: 'bp_ai_actor', target: 'bp_skel_mesh', sourceHandle: 'execOut', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e_skel_to_ik', source: 'bp_skel_mesh', target: 'bp_ik_solver', sourceHandle: 'execOut', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e_ik_to_anim', source: 'bp_ik_solver', target: 'bp_ai_anim', sourceHandle: 'execOut', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e_ai_move_exec', source: 'bp_ai_anim', target: 'bp_ai_move', sourceHandle: 'execOut', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e_ai_move_data', source: 'bp_ai_actor', target: 'bp_ai_move', sourceHandle: 'generatedActor', targetHandle: 'target', type: 'condition', data: { condition: '' }, style: { stroke: '#58a6ff', strokeWidth: 2 } },
  { id: 'e2', source: 'bp_seq', target: 'bp2', sourceHandle: 'then0', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e3', source: 'bp_seq', target: 'bp_delay', sourceHandle: 'then1', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e4', source: 'bp_delay', target: 'bp_spawn', sourceHandle: 'execOut', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e_ai_1', source: 'bp_spawn', target: 'bp_ai_com', sourceHandle: 'execOut', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } },
  { id: 'e_ai_data', source: 'bp_spawn', target: 'bp_ai_com', sourceHandle: 'return', targetHandle: 'targetAI', type: 'condition', data: { condition: '' }, style: { stroke: '#58a6ff', strokeWidth: 2 } },
  { id: 'e_ai_move_seq', source: 'bp_ai_move', target: 'bp_seq', sourceHandle: 'success', targetHandle: 'execIn', type: 'condition', data: { condition: '' }, style: { stroke: 'white', strokeWidth: 2 } }
];

const DraggableNode = ({ type, label, icon: Icon, colorClass, iconText, shortcut }: { type: string, label: string, icon?: any, colorClass?: string, iconText?: string, shortcut?: string }) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div 
      className="flex items-center gap-2 px-2 py-1 hover:bg-[#222] rounded cursor-pointer mt-1 group relative"
      onDragStart={onDragStart}
      draggable
    >
      {Icon && <Icon size={12} className={colorClass} />}
      {iconText && <span className={`${colorClass} font-bold text-[10px] w-3 text-center`}>{iconText}</span>}
      <span className="flex-1 text-[#fff] tracking-wide text-[10px] whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
      {shortcut && <span className="opacity-0 group-hover:opacity-100 absolute right-2 text-[#888] text-[9px] bg-[#111] px-1 rounded transition-opacity">{shortcut.toUpperCase()}</span>}
    </div>
  );
};

const ProfilerContext = React.createContext(false);
const ExecutionContext = React.createContext<{ breakpoints: string[], executingNodeId: string | null }>({ breakpoints: [], executingNodeId: null });

const NODE_CAPABILITIES: Record<string, string> = {
  customLogic: "Allows unlimited capabilities via direct Typescript code execution.",
  beginPlay: "Triggered once when the game or level starts. Good for initialization.",
  tick: "Triggered every frame. Provides DeltaSeconds. Use sparingly for performance.",
  print: "Prints a string to the development console or screen. Useful for debugging.",
  branch: "If/Else control flow. Evaluates a boolean condition and executes True or False.",
  getPlayer: "Gets a reference to the main player character (Player 0).",
  getLoc: "Gets the location of an actor in world space.",
  getRot: "Gets the rotation of an actor in world space.",
  setLoc: "Sets the location of an actor in world space.",
  sequence: "Executes a series of pins in order (0, then 1, then 2, etc.) synchronously.",
  delay: "Pauses execution for a specified duration (in seconds), then continues.",
  mathMul: "Multiplies two numbers (A * B).",
  mathAddV: "Adds two 3D vectors together (A + B).",
  mathSubV: "Subtracts Vector B from Vector A (A - B).",
  mathDotProduct: "Calculates the dot product of two vectors (returns a float).",
  mathCrossProduct: "Calculates the cross product of two vectors (returns a vector).",
  mathNormalize: "Normalizes a vector (length of 1.0) while keeping its direction.",
  mathVectorLength: "Gets the length (magnitude) of a vector.",
  mathDistance: "Calculates the distance between two vector points.",
  mathLerp: "Linear interpolation between Vector A and B based on Alpha (0.0 to 1.0).",
  mathClamp: "Clamps a value between a Minimum and Maximum limit.",
  mathMapRange: "Maps a value from an In Range to an Out Range.",
  makeRotator: "Constructs a rotator (Pitch, Yaw, Roll) from float values.",
  flipFlop: "Toggles execution between A and B each time it is called.",
  gate: "Allows execution to pass through when Open, blocks when Closed.",
  boolAnd: "Returns true if BOTH A and B are true.",
  boolNot: "Reverses the boolean value (True becomes False, False becomes True).",
  makeArray: "Creates an array from individual elements.",
  constructVector: "Creates a Vector (X,Y,Z) from individual float components.",
  cast: "Casts an object to a specific class type. Fails if the object is not of that type.",
  spawn: "Spawns a new instance of an actor class at the specified transform.",
  inputKey: "Triggers when a specific keyboard or controller key is pressed/released.",
  inputAxis: "Triggers based on controller or keyboard axis input (e.g. MoveForward).",
  array2D: "Generates or processes a 2D grid/array for maps or grids.",
  forLoop: "Executes the LoopBody for each index from First to Last.",
  whileLoop: "Executes the LoopBody as long as the Condition remains true.",
  doOnce: "Executes the output only once until the Reset pin is triggered.",
  lineTrace: "Casts a ray between Start and End points, checking for collisions.",
  applyDamage: "Deals damage to a target actor.",
  applyForce: "Applies physical force to a component.",
  setPhysicsProps: "Sets physics properties (mass, friction, gravity) on a component.",
  addInstancedMesh: "Efficiently adds a mesh instance for rendering large numbers of identical objects.",
  createWidget: "Creates a UI Widget to be displayed on screen.",
  addToViewport: "Adds a UI Widget to the screen layer.",
  playSound: "Plays a sound cue or audio file at a location or 2D.",
  getVar: "Gets the current value of a variable.",
  setVar: "Sets a new value for a variable.",
  onHit: "Event triggered when this component physically hits another component.",
  onActorHit: "Event triggered when this actor hits another actor.",
  aiMovement: "Generates optimal movement pathing and steering behaviors.",
  aiCombat: "Generates dynamic combat behaviors and decision making.",
  aiActor: "Generates an intelligent NPC behavior graph and personality.",
  hardwareOptimizer: "Automatically optimizes settings based on target hardware profile.",
  aiNovelChar: "Generates extremely detailed novel character data down to the millimeter scale for modeling.",
  aiNovelEnv: "Generates extremely detailed scene and environment metrics and proportions.",
  aiNovelWorld: "Generates a fully-realized realistic world with extremely detailed maps, countries, and monsters.",
  aiLoreSystem: "Permanently stores world manual, character profiles, and plots for extremely detailed AI consistency.",
  aiVerifier: "Strictly verifies generated 3D meshes against text prompt rules (97% character, 95% environment match)."
};

const applyNodeWrapper = (nodeTypesObj: any) => {
  const wrapped: Record<string, any> = {};
  for (const key in nodeTypesObj) {
    const OriginalNode = nodeTypesObj[key];
    wrapped[key] = (props: any) => {
       const isProfiling = React.useContext(ProfilerContext);
       const { breakpoints, executingNodeId } = React.useContext(ExecutionContext);
       const ms = React.useMemo(() => {
           const base = (Math.abs(Math.sin((props.id || '').length * 123.45)) * 2) + 0.1;
           return props.type.includes('ai') ? (base + 12.5 + Math.random() * 5).toFixed(1) : base.toFixed(2);
       }, [props.id, props.type]);
       const isSlow = props.type.includes('ai') || parseFloat(ms) > 1.5;

       const hasBreakpoint = breakpoints.includes(props.id);
       const isExecuting = executingNodeId === props.id;
       const tooltip = NODE_CAPABILITIES[props.type] || "Executes connected logic.";

       return (
          <div className="relative group">
             {/* Tooltip on hover */}
             <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[250px] bg-black border border-[#30363d] text-[#c9d1d9] text-[10px] p-2 rounded shadow-xl shadow-black/80 pointer-events-none z-[200] text-wrap text-center">
                <span className="text-[#58a6ff] font-bold block mb-1">Capabilities Details</span>
                {tooltip}
             </div>
             {hasBreakpoint && (
                <div className="absolute -top-[6px] -right-[6px] w-[14px] h-[14px] bg-[#f85149] rounded-full border-2 border-[#161b22] z-[120]" title="Breakpoint (Pause Execution)"></div>
             )}
             {isExecuting && (
                <div className="absolute inset-[-4px] border-[3px] border-[#e3b341] rounded-[10px] pointer-events-none z-[110] shadow-[0_0_15px_rgba(227,179,65,0.8)]"></div>
             )}
             {isProfiling && (
                <div className={`absolute -top-[10px] right-2 px-1 rounded text-[9px] font-bold z-[100] ${isSlow ? 'bg-[#f85149] text-white shadow-[#f85149]/50 shadow-sm' : 'bg-[#3fb950] text-[#000]'}`}>
                   {ms}ms {isSlow && '⚠️'}
                </div>
             )}
             <OriginalNode {...props} />
             {isProfiling && isSlow && (
                <div className="absolute inset-0 border-2 border-[#f85149] rounded-[8px] pointer-events-none animate-pulse"></div>
             )}
          </div>
       );
    };
  }
  return wrapped;
};

const wrappedNodeTypes = applyNodeWrapper(nodeTypes);


const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 250;
  const nodeHeight = 150;

  dagreGraph.setGraph({ rankdir: 'LR' }); // Left to right

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = { ...node };

    newNode.targetPosition = Position.Left;
    newNode.sourcePosition = Position.Right;

    newNode.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

export default function BlueprintEditor({ onCodeGenerated }: { onCodeGenerated?: (code: string) => void }) {
  const [breakpoints, setBreakpoints] = useState<string[]>([]);
  const [executionState, setExecutionState] = useState<'idle' | 'running' | 'paused'>('idle');
  const [executingNodeId, setExecutingNodeId] = useState<string | null>(null);

  const [isProfiling, setIsProfiling] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { takeSnapshot, undo, redo, canUndo, canRedo } = useUndoRedoFlow(nodes, edges, setNodes, setEdges);

  const handleNodesChange = useCallback((changes: any[]) => {
    const isSignificantChange = changes.some(c => c.type === 'remove' || c.type === 'add' || (c.type === 'position' && !c.dragging));
    if (isSignificantChange) takeSnapshot();
    onNodesChange(changes);
  }, [onNodesChange, takeSnapshot]);

  const handleEdgesChange = useCallback((changes: any[]) => {
    const isSignificantChange = changes.some(c => c.type === 'remove' || c.type === 'add');
    if (isSignificantChange) takeSnapshot();
    onEdgesChange(changes);
  }, [onEdgesChange, takeSnapshot]);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    setBreakpoints(prev => 
       prev.includes(node.id) ? prev.filter(id => id !== node.id) : [...prev, node.id]
    );
  }, []);

  const getNextNode = useCallback((currentId: string) => {
    const edge = edges.find(e => e.source === currentId && (e.style?.stroke === 'white' || e.sourceHandle?.startsWith('then') || e.sourceHandle?.startsWith('exec')));
    if (edge) return edge.target;
    return null;
  }, [edges]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (executionState === 'running' && executingNodeId) {
      timer = setTimeout(() => {
        const nextId = getNextNode(executingNodeId);
        if (nextId) {
          setExecutingNodeId(nextId);
          if (breakpoints.includes(nextId)) {
            setExecutionState('paused');
          }
        } else {
          setExecutionState('idle');
          setExecutingNodeId(null);
        }
      }, 800);
    }
    return () => clearTimeout(timer);
  }, [executionState, executingNodeId, getNextNode, breakpoints]);

  const startExecution = () => {
    setExecutionState('running');
    const startNode = nodes.find(n => n.type === 'beginPlay') || nodes[0];
    if (startNode) {
      setExecutingNodeId(startNode.id);
      if (breakpoints.includes(startNode.id)) {
        setExecutionState('paused');
      }
    }
  };

  const stopExecution = () => {
    setExecutionState('idle');
    setExecutingNodeId(null);
  };

  const stepForwardExecution = () => {
    if (!executingNodeId) return;
    const nextId = getNextNode(executingNodeId);
    if (nextId) {
      setExecutingNodeId(nextId);
      setExecutionState('paused');
    } else {
      stopExecution();
    }
  };

  const resumeExecution = () => {
    setExecutionState('running');
  };

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges]);

  
  const [menu, setMenu] = useState<{ x: number, y: number, paneX: number, paneY: number } | null>(null);
  const flowWrapper = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      if (!flowWrapper.current) return;

      const reactFlowBounds = flowWrapper.current.getBoundingClientRect();
      
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      const presetData: Record<string, any> = {};
      if (type === 'aiActor') presetData.prompt = "Cyberpunk Mercenary";
      if (type === 'aiMovement') { presetData.useAIPathfinding = true; presetData.moveSpeed = 600; }
      if (type === 'forLoop') { presetData.firstIndex = 0; presetData.lastIndex = 10; }

      const newNode = {
        id: `node_${uuidv4()}`,
        type,
        position,
        data: presetData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }
      
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      
      const mapKeyToNode = (key: string): string | null => {
         switch(key) {
           case 'b': return 'beginPlay';
           case 't': return 'tick';
           case 'k': return 'inputKey';
           case 'h': return 'onHit';
           case 'o': return 'overlapBegin';
           case 'e': return 'overlapEnd';
           case 'c': return 'comment';
           case 'p': return 'print';
           case 's': return 'sequence';
           case 'm': return 'mathMul';
           case 'f': return 'branch';
           case 'w': return 'streamLevel';
           case 'a': return 'aiActor';
           case 'x': return 'aiTexture';
           case '1': return 'hardwareOptimizer';
           case '2': return 'offlineAIAccelerator';
           case '3': return 'offlineAI3DModelGen';
           case '4': return 'offlineAI3DMapGen';
           case '5': return 'offlineAIWebLearn';
           case '6': return 'levelScript';
           case 'i': return 'importExternalAssets';
           case 'q': return 'aiProximity';
           case 'v': return 'aiBehaviorLogic';
           default: return null;
         }
      };

      const key = e.key.toLowerCase();
      
      if (key === 'l' && modifier) {
        e.preventDefault();
        onLayout();
        return;
      }

      if (key === 'g' && modifier) {
         e.preventDefault();
         setIsProfiling(p => !p);
         return;
      }

      const nodeType = mapKeyToNode(key);
      if (nodeType) {
         // Create the node roughly in the middle of standard view
         const randOffset = Math.floor(Math.random() * 50);
         const newNode: Node = {
            id: `node_${uuidv4().replace(/-/g, '').substring(0, 8)}`,
            type: nodeType,
            position: { x: 200 + randOffset, y: 300 + randOffset },
            data: {}
         };
         setNodes(nds => nds.concat(newNode));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setNodes, onLayout, setIsProfiling]);

  React.useEffect(() => {
    if (!onCodeGenerated) return;

    // Generate readable JS/C++ pseudo structure based on nodes
    let code = `// ==========================================\n// AUTO-GENERATED FROM BLUEPRINT GRAPH\n// Output reflects real-time graph state.\n// ==========================================\n\nclass ThirdPersonCharacter_BP {\n`;
    
    // Sort nodes to simulate flow
    const logicNodes = nodes.filter(n => !['print', 'spawn', 'delay', 'mathMul', 'mathAddV'].includes(n.type || ''));
    
    logicNodes.forEach(n => {
       if (n.type === 'beginPlay') {
         code += `  async onBeginPlay() {\n    console.log("Event BeginPlay");\n`;
         // check outbound edges
         const outEdges = edges.filter(e => e.source === n.id);
         if (outEdges.length > 0) {
           code += `    this.executeSequence(this.node_${outEdges[0].target});\n`;
         }
         code += `  }\n\n`;
       } else if (n.type === 'tick') {
         code += `  onTick(deltaSeconds) {\n    // Tick Event updates\n  }\n\n`;
       } else if (n.type === 'onActorHit') {
         code += `  onActorHit(selfActor, otherActor, normalImpulse, hitResult) {\n    // Actor hit event\n  }\n\n`;
       } else if (n.type === 'inputKey') {
         const key = n.data.key || 'Spacebar';
         code += `  onInput_${key}() {\n    // Input action executed\n  }\n\n`;
       } else if (n.type === 'inputAxis') {
         const axis = n.data.axisName || 'MoveForward';
         code += `  onAxis_${axis}(axisValue) {\n    // Input axis executed with value: axisValue\n  }\n\n`;
       } else if (n.type === 'aiMechanic') {
         const prompt = n.data.prompt || '...';
         code += `  // [AI GENERATED MECHANIC]\n  // Prompt: "${prompt}"\n  async executeAIMechanic() {\n    await NexusAI.invokeMechanic("${prompt}");\n  }\n\n`;
       } else if (n.type === 'aiActor') {
         const prompt = n.data.prompt || '';
         code += `  // [AI GENERATED ACTOR]\n  spawnAIActor() {\n    return NexusAI.spawnActorByPrompt("${prompt}");\n  }\n\n`;
       } else if (n.type === 'smartDoor') {
         const doorType = n.data.doorType || 'Swing';
         const delay = n.data.autoClose || '0';
         code += `  interactSmartDoor() {\n    DoorSystem.open("${doorType}", { autoCloseDelay: ${delay} });\n  }\n\n`;
       } else if (n.type === 'reflectionProbe') {
         const qty = n.data.quality || 'Raytraced';
         code += `  updateReflection() {\n    Graphics.captureProbe({ quality: "${qty}" });\n  }\n\n`;
       } else if (n.type === 'aiTexture') {
         const prompt = n.data.prompt || '';
         const resolution = n.data.resolution || '512x512';
         const steps = n.data.steps || 20;
         code += `  // [AI GENERATED TEXTURE]\n  async generateAITexture() {\n    return await NexusAI.generateTexture({ prompt: "${prompt}", resolution: "${resolution}", steps: ${steps} });\n  }\n\n`;
       } else if (n.type === 'aiProximity') {
         const prompt = n.data.prompt || '';
         const radius = n.data.radius || 500;
         code += `  // [AI PROXIMITY BEHAVIOR]\n  // Radius: ${radius}\n  async evaluateProximityBehavior(playerRef) {\n    return await NexusAI.evaluateBehavior("${prompt}", playerRef);\n  }\n\n`;
       } else if (n.type === 'aiBehaviorLogic') {
         const prompt = n.data.prompt || '';
         code += `  // [AI GENERATED BEHAVIOR LOGIC]\n  async generateBehaviorLogic() {\n    return await NexusAI.generateLogicNode("${prompt}");\n  }\n\n`;
       } else if (n.type === 'aiMovement') {
         const prompt = n.data.prompt || '';
         const usePathfinding = n.data.useAIPathfinding ? 'true' : 'false';
         code += `  // [AI GENERATED MOVEMENT]\n  async updateAIMovement(targetPawn, playerProximity) {\n    return await NexusAI.calculateMovement("${prompt}", targetPawn, playerProximity, { pathfinding: ${usePathfinding} });\n  }\n\n`;
       } else if (n.type === 'aiCombat') {
         code += `  // [AI GENERATED COMBAT BT]\n  async constructCombatBT(aiController, baseBT) {\n    return await NexusAI.buildBehaviorTree(aiController, baseBT);\n  }\n\n`;
       } else if (n.type === 'hardwareOptimizer') {
         const arch = n.data.archType || 'Modern';
         const cpu = n.data.cpuLimit || 'Low';
         const gpu = n.data.gpuLimit || '1-2 GB (Ultra Low)';
         const ram = n.data.ramLimit || '4 GB (Strict Constraint)';
         const pipeline = String(n.data.pipelineMode || 'Auto-Detect (Adaptive)');
         code += `  // [HARDWARE OPTIMIZER]\n  optimizeHardware() {\n    System.setLimits({ Architecture: "${arch}", CPU: "${cpu}", VRAM: "${gpu}", RAM: "${ram}", Pipeline: "${pipeline}" });\n`;
         if (pipeline.includes('Auto-Detect')) {
           code += `    if (System.isHardwareCapable('Parallel_Pipeline')) {\n`;
           code += `      System.setExecutionPipeline(['Parallel_All']); // Modern Fast Execution\n`;
           code += `    } else {\n`;
           code += `      System.setExecutionPipeline(['CPU', 'RAM', 'NPU', 'GPU']); // Strictly sequential processing for legacy hardware.\n`;
           code += `    }\n`;
         } else if (pipeline.includes('Staged')) {
           code += `    System.setExecutionPipeline(['CPU', 'RAM', 'NPU', 'GPU']); // Strictly sequential processing for legacy hardware.\n`;
         }
         code += `  }\n\n`;
       } else if (n.type === 'offlineAIAccelerator') {
         const threads = n.data.threads || 8;
         code += `  // [OFFLINE AI ACCELERATOR]\n  initOfflineAI() {\n    NexusAI.initLocalAccelerator({ turbo: ${n.data.turbo !== false}, threads: ${threads} });\n  }\n\n`;
       } else if (n.type === 'levelScript') {
         const shadowCasters = n.data.shadowCasters || 12;
         const entityLimit = n.data.entityLimit || 50;
         const lightQual = String(n.data.lightQual || 'Low (0 Bounces)');
         code += `  // [EXTREME DETAIL SCENE SCRIPT]\n  applyServerLevelDescriptors() {\n    SceneScriptEngine.enforceConstraints({ maxShadowCasters: ${shadowCasters}, entityLimit: ${entityLimit}, lightQual: "${lightQual}" });\n  }\n\n`;
       } else if (n.type === 'importExternalAssets') {
         code += `  // [IMPORT EXTERNAL ASSETS (BATCH)]\n  async importExternalAssets() {\n    return await AssetManager.batchImport({ importTextures: ${n.data.importTextures !== false}, importModels: ${n.data.importModels !== false} });\n  }\n\n`;
       } else if (n.type === 'offlineAI3DModelGen') {
         const prompt = n.data.prompt || '';
         const detailLevel = n.data.detailLevel || 'Ultra';
         const topology = n.data.topology || 'Quad';
         code += `  // [OFFLINE AI 3D MODEL GEN]\n  async generate3DModel() {\n    return await NexusAI.generateModelOffline("${prompt}", { detailLevel: "${detailLevel}", topology: "${topology}", pbr: ${n.data.pbr !== false} });\n  }\n\n`;
       } else if (n.type === 'offlineAI3DMapGen') {
         const prompt = n.data.prompt || '';
         const mapSize = n.data.mapSize || 64;
         const foliage = n.data.foliage || 'Dense';
         code += `  // [OFFLINE AI 3D MAP GEN]\n  async generate3DMap() {\n    return await NexusAI.generateMapOffline("${prompt}", { mapSize: ${mapSize}, foliage: "${foliage}", navMesh: ${n.data.navMesh !== false} });\n  }\n\n`;
       } else if (n.type === 'offlineAIWebLearn') {
         const subject = n.data.subject || '';
         const iteration = n.data.iteration || 'Standard';
         code += `  // [OFFLINE AI WEB LEARNING]\n  async learnFromWeb() {\n    return await NexusAI.learnFromWeb("${subject}", { scanWeb: ${n.data.scanWeb !== false}, scanVideo: ${n.data.scanVideo !== false}, scanModels: ${n.data.scanModels !== false}, scanInteractions: ${n.data.scanInteractions !== false}, iteration: "${iteration}" });\n  }\n\n`;
       } else if (n.type === 'mathClamp') {
         code += '  // Math: Clamp\n  clampValue(val, min, max) {\n    return Math.max(min, Math.min(max, val));\n  }\n\n';
       } else if (n.type === 'mathLerp') {
         code += '  // Math: Vector Lerp\n  lerpVector(v1, v2, alpha) {\n    return { x: v1.x + (v2.x - v1.x) * alpha, y: v1.y + (v2.y - v1.y) * alpha, z: v1.z + (v2.z - v1.z) * alpha };\n  }\n\n';
       } else if (n.type === 'mathVectorLength') {
         code += '  // Math: Vector Length\n  vectorLength(v) {\n    return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);\n  }\n\n';
       }
    });

    code += `}\n\nexport default ThirdPersonCharacter_BP;\n`;
    onCodeGenerated(code);
  }, [nodes, edges, onCodeGenerated]);

  const onConnect = useCallback((params: Connection) => {
    takeSnapshot();
    setEdges((eds) => addEdge({
      ...params, 
      type: 'condition',
      data: { condition: '' },
      style: { stroke: params.sourceHandle === 'execOut' || params.sourceHandle === 'execTrue' || params.sourceHandle === 'execFalse' ? 'white' : '#58a6ff', strokeWidth: 2 }
  }, eds));
  }, [setEdges, takeSnapshot]);


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
    takeSnapshot();
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
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col font-['Helvetica_Neue',Arial,sans-serif] relative" ref={flowWrapper}>
      <div className="h-[36px] bg-[#111] border-b border-[#222] flex items-center px-2 justify-between shrink-0">
         <div className="flex gap-1">
            <button className="px-3 py-1 bg-[#222] text-[#fff] text-[11px] font-bold rounded flex items-center gap-2 border-t-[2px] border-t-[#58a6ff]">
               <Waypoints size={12}/> ThirdPersonCharacter
            </button>
         </div>
         <div className="flex gap-2">
            <div className="flex gap-1 border-r border-[#333] pr-2 mr-1">
              <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" className={`p-1.5 rounded transition-colors ${canUndo ? 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#58a6ff]' : 'text-[#30363d] cursor-not-allowed'}`}><Undo size={14} /></button>
              <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" className={`p-1.5 rounded transition-colors ${canRedo ? 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#58a6ff]' : 'text-[#30363d] cursor-not-allowed'}`}><Redo size={14} /></button>
            </div>
            <button 
              onClick={onLayout}
              className="flex items-center gap-1.5 bg-gradient-to-b from-[#222] to-[#1a1a1a] border border-[#111] hover:from-[#333] hover:to-[#222] text-[#ccc] px-3 py-1 rounded-sm text-[11px] font-bold transition-colors group"
            >
              <Wand2 size={12} className="text-[#bc8cff]"/> Auto Layout <span className="opacity-0 group-hover:opacity-100 ml-1 text-[9px] text-[#888] bg-[#111] px-1 rounded transition-opacity hidden sm:inline">⌘/CTRL+L</span>
            </button>
            <button 
              onClick={() => setIsProfiling(!isProfiling)}
              className={`flex items-center gap-1.5 border border-[#111] px-3 py-1 rounded-sm text-[11px] font-bold transition-colors group ${
                isProfiling 
                  ? "bg-gradient-to-b from-[#e3b341] to-[#bf9531] text-white hover:from-[#f0c354] hover:to-[#d6a536]" 
                  : "bg-gradient-to-b from-[#222] to-[#1a1a1a] text-[#ccc] hover:from-[#333] hover:to-[#222]"
              }`}
            >
              <Activity size={12}/> {isProfiling ? 'Stop Profiling' : 'Profile Node Performance'} <span className="opacity-0 group-hover:opacity-100 ml-1 text-[9px] text-[#888] bg-[#111] px-1 rounded transition-opacity hidden sm:inline text-white/50">⌘/CTRL+G</span>
            </button>
            <button className="flex items-center gap-1.5 bg-gradient-to-b from-[#2ea043] to-[#238636] hover:from-[#3fb950] hover:to-[#2ea043] border border-[#111] text-white px-3 py-1 rounded-sm text-[11px] font-bold transition-colors">
              <Play size={12}/> Compile
            </button>
         </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Outliner */}
        <aside className="w-[240px] bg-[#1a1a1a] border-r border-[#000] flex flex-col shrink-0">
           <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-4 text-[11px] text-[#ccc] custom-scrollbar">
             <div>
                <div className="font-bold text-[#888] flex justify-between items-center uppercase mb-1 px-2">Game Systems & Events</div>
                <DraggableNode type="customLogic" label="Custom Code Logic" icon={Code2} colorClass="text-[#3fb950]" shortcut="c" />
                <DraggableNode type="beginPlay" label="Event BeginPlay" icon={Play} colorClass="text-[#f85149]" shortcut="b" />
                <DraggableNode type="tick" label="Event Tick" icon={StepForward} colorClass="text-[#f85149]" shortcut="t" />
                <DraggableNode type="customEvent" label="Custom Event" icon={Zap} colorClass="text-[#f85149]" shortcut="v" />
                <DraggableNode type="callCustomEvent" label="Call Custom Event" icon={Zap} colorClass="text-[#58a6ff]" />
                <DraggableNode type="inputKey" label="Input Key Event" icon={Keyboard} colorClass="text-[#f85149]" shortcut="k" />
                <DraggableNode type="inputAxis" label="Input Axis Event" icon={Keyboard} colorClass="text-[#f85149]" />
                <DraggableNode type="onHit" label="On Component Hit" icon={AlertCircle} colorClass="text-[#f85149]" shortcut="h" />
                <DraggableNode type="onActorHit" label="Event On Actor Hit" icon={AlertCircle} colorClass="text-[#f85149]" shortcut="a" />
                <DraggableNode type="overlapBegin" label="On Overlap Begin" icon={AlertCircle} colorClass="text-[#f85149]" shortcut="o" />
                <DraggableNode type="overlapEnd" label="On Overlap End" icon={AlertCircle} colorClass="text-[#f85149]" shortcut="e" />
                <div className="mt-2" />
                <DraggableNode type="spawn" label="Spawn Actor from Class" icon={BoxSelect} colorClass="text-[#bc8cff]" />
                <DraggableNode type="getPlayer" label="Get Player Character" icon={UserSquare} colorClass="text-[#3fb950]" />
                <DraggableNode type="getLoc" label="Get Actor Location" icon={Waypoints} colorClass="text-[#3fb950]" />
                <DraggableNode type="getRot" label="Get Actor Rotation" icon={Waypoints} colorClass="text-[#8b949e]" />
                <DraggableNode type="setLoc" label="Set Actor Location" icon={Waypoints} colorClass="text-[#58a6ff]" />
                <DraggableNode type="smartDoor" label="Smart Door System" icon={BoxSelect} colorClass="text-[#e3b341]" />
                <DraggableNode type="applyDamage" label="Apply Damage" icon={AlertCircle} colorClass="text-[#f85149]" />
                <DraggableNode type="applyForce" label="Add Physics Force" icon={Activity} colorClass="text-[#3fb950]" />
                <DraggableNode type="setPhysicsProps" label="Set Physics Props" icon={Settings2} colorClass="text-[#3fb950]" />
                <DraggableNode type="addToViewport" label="Add to Viewport" icon={Layers} colorClass="text-[#58a6ff]" />
             </div>

             <div>
                <div className="font-bold text-[#888] flex justify-between items-center uppercase mb-1 px-2 mt-4">Procedural Generation</div>
                <DraggableNode type="pcgWorldGen" label="PCG: World Gen" icon={Globe} colorClass="text-[#3fb950]" shortcut="g" />
             </div>

             <div>
                <div className="font-bold text-[#888] flex justify-between items-center uppercase mb-1 px-2 mt-4">AI, Models & Opt<span className="bg-[#bc8cff]/20 text-[#bc8cff] px-1 rounded text-[8px]">PRO</span></div>
                <DraggableNode type="addInstancedMesh" label="Add Instance (HISM)" icon={Copy} colorClass="text-[#58a6ff]" />
                <DraggableNode type="importExternalAssets" label="Batch Import Assets" icon={Copy} colorClass="text-[#58a6ff]" shortcut="i" />
                <DraggableNode type="hardwareOptimizer" label="Hardware Optimizer" icon={Cpu} colorClass="text-[#3fb950]" shortcut="1" />
                <DraggableNode type="levelScript" label="Level Script (Extreme Detail)" icon={FileCode2} colorClass="text-[#bc8cff]" shortcut="6" />
                <DraggableNode type="offlineAIAccelerator" label="Offline AI Accelerator" icon={Gauge} colorClass="text-[#e3b341]" shortcut="2" />
                <DraggableNode type="offlineAI3DModelGen" label="Offline AI: 3D Model Master" icon={Layers} colorClass="text-[#e3b341]" shortcut="3" />
                <DraggableNode type="offlineAI3DMapGen" label="Offline AI: 3D Map & Terrain" icon={Grid3X3} colorClass="text-[#e3b341]" shortcut="4" />
                <DraggableNode type="offlineAIWebLearn" label="Offline AI: Deep Web Learning" icon={Network} colorClass="text-[#e3b341]" shortcut="5" />
                <DraggableNode type="aiNovelChar" label="Offline AI: Novel Character Details" icon={Bot} colorClass="text-[#bc8cff]" />
                <DraggableNode type="aiNovelEnv" label="Offline AI: Novel Environment Details" icon={Layers} colorClass="text-[#bc8cff]" />
                <DraggableNode type="aiNovelWorld" label="Offline AI: World Builder" icon={Globe} colorClass="text-[#bc8cff]" />
                <DraggableNode type="aiLoreSystem" label="Offline AI: Lore System & DB" icon={Database} colorClass="text-[#bc8cff]" />
                <DraggableNode type="aiVerifier" label="Offline AI: Mesh Verifier System" icon={BoxSelect} colorClass="text-[#ff7b72]" />
                <DraggableNode type="enableCulling" label="GPU Culling (Frustum/Occ)" icon={Settings2} colorClass="text-[#3fb950]" />
                <DraggableNode type="streamLevel" label="Load Level (Async)" icon={Layers} colorClass="text-[#58a6ff]" shortcut="w" />
                <DraggableNode type="asyncLoadAsset" label="Async Load Asset" icon={Clock} colorClass="text-[#e3b341]" />
                <DraggableNode type="aiActor" label="Offline AI Gen Actor" icon={Sparkles} colorClass="text-[#bc8cff]" shortcut="a" />
                <DraggableNode type="aiSceneGen" label="Offline AI Gen Scene Elements" icon={Sparkles} colorClass="text-[#bc8cff]" />
                <DraggableNode type="aiAutoRigger" label="Offline AI Auto-Rigger & IK Setup" icon={UserSquare} colorClass="text-[#ff7b72]" />
                <DraggableNode type="aiMaterialGen" label="Offline AI PBR Material Gen" icon={Image} colorClass="text-[#e3b341]" />
                <DraggableNode type="aiMeshOpt" label="Offline AI Mesh Optimizer & Retopo" icon={Grid3X3} colorClass="text-[#58a6ff]" />
                <DraggableNode type="aiVfxGen" label="Offline AI Niagara VFX Gen" icon={Zap} colorClass="text-[#bc8cff]" />
                <DraggableNode type="adultContent" label="Unrestricted Content (18+/20+)" icon={AlertCircle} colorClass="text-[#f85149]" />
                <DraggableNode type="aiTexture" label="Offline AI Gen Texture" icon={Image} colorClass="text-[#bc8cff]" shortcut="x" />
                <DraggableNode type="aiProximity" label="Offline AI Player Proximity Behavior" icon={Bot} colorClass="text-[#ff7b72]" shortcut="q" />
                <DraggableNode type="aiMovement" label="Offline AI Gen Movement" icon={Sparkles} colorClass="text-[#bc8cff]" />
                <DraggableNode type="aiBehaviorLogic" label="Offline AI Gen Behavior Logic" icon={Sparkles} colorClass="text-[#ff7b72]" shortcut="v" />
                <DraggableNode type="aiMechanic" label="Offline AI Gen Mechanic" icon={Sparkles} colorClass="text-[#ff7b72]" />
                <DraggableNode type="reflectionProbe" label="Realtime Mirror" icon={Layers} colorClass="text-[#58a6ff]" />
             </div>

             <div>
                <div className="font-bold text-[#888] flex justify-between items-center uppercase mb-1 px-2 mt-4">Workflow & Control</div>
                <DraggableNode type="branch" label="Branch (If)" icon={AlertCircle} colorClass="text-[#c9d1d9]" shortcut="f" />
                <DraggableNode type="sequence" label="Sequence" icon={GitCommit} colorClass="text-[#c9d1d9]" shortcut="s" />
                <DraggableNode type="delay" label="Delay" icon={Clock} colorClass="text-[#e3b341]" />
                <DraggableNode type="forLoop" label="For Loop" icon={GitCommit} colorClass="text-[#c9d1d9]" />
                <DraggableNode type="whileLoop" label="While Loop" icon={GitCommit} colorClass="text-[#c9d1d9]" />
                <DraggableNode type="doOnce" label="Do Once" icon={GitCommit} colorClass="text-[#c9d1d9]" />
                <DraggableNode type="flipFlop" label="Flip Flop" icon={GitCommit} colorClass="text-[#c9d1d9]" />
                <DraggableNode type="gate" label="Gate" icon={GitCommit} colorClass="text-[#c9d1d9]" />
                <DraggableNode type="boolAnd" label="AND Boolean" iconText="&&" colorClass="text-[#8b0000]" />
                <DraggableNode type="boolNot" label="NOT Boolean" iconText="!" colorClass="text-[#8b0000]" />
             </div>

             <div>
                <div className="font-bold text-[#888] flex justify-between items-center uppercase mb-1 px-2 mt-4">Math Library</div>
                <DraggableNode type="mathAdd" label="Add (Float)" iconText="+" colorClass="text-[#3fb950]" />
                <DraggableNode type="mathSub" label="Subtract (Float)" iconText="-" colorClass="text-[#3fb950]" />
                <DraggableNode type="mathMul" label="Multiply (Float)" iconText="*" colorClass="text-[#3fb950]" />
                <DraggableNode type="mathDivide" label="Divide (Float)" iconText="/" colorClass="text-[#3fb950]" />
                <DraggableNode type="mathAddV" label="Add (Vector)" iconText="+" colorClass="text-[#e3b341]" />
                <DraggableNode type="mathSubV" label="Subtract (Vector)" iconText="-" colorClass="text-[#e3b341]" />
                <DraggableNode type="mathClamp" label="Clamp (Float)" iconText="[]" colorClass="text-[#3fb950]" />
                <DraggableNode type="mathMapRange" label="Map Range Clamped" iconText="()" colorClass="text-[#3fb950]" />
                <DraggableNode type="mathRandomFloat" label="Random Float In Range" iconText="?" colorClass="text-[#3fb950]" />
                <DraggableNode type="makeRotator" label="Make Rotator" iconText="R" colorClass="text-[#8b949e]" />
                <DraggableNode type="mathDotProduct" label="Dot Product" iconText="·" colorClass="text-[#e3b341]" />
                <DraggableNode type="mathCrossProduct" label="Cross Product" iconText="×" colorClass="text-[#e3b341]" />
                <DraggableNode type="mathNormalize" label="Normalize" iconText="N" colorClass="text-[#e3b341]" />
                <DraggableNode type="mathLerp" label="Lerp (Vector)" iconText="L" colorClass="text-[#e3b341]" />
                <DraggableNode type="mathVectorLength" label="Vector Length" iconText="|v|" colorClass="text-[#e3b341]" />
                <DraggableNode type="mathDistance" label="Vector Distance" iconText="D" colorClass="text-[#e3b341]" />
             </div>

             <div>
                <div className="font-bold text-[#888] flex justify-between items-center uppercase mb-1 px-2 mt-4">Utilities & Debug</div>
                <DraggableNode type="print" label="Print String" icon={TerminalSquare} colorClass="text-[#3fb950]" shortcut="p" />
                <DraggableNode type="comment" label="Comment Box" icon={TerminalSquare} colorClass="text-[#fff]" shortcut="c" />
                <DraggableNode type="appendString" label="Append String" icon={TerminalSquare} colorClass="text-[#58a6ff]" />
                <DraggableNode type="arrayAdd" label="Array Add" icon={Layers} colorClass="text-[#58a6ff]" />
                <DraggableNode type="getMousePos" label="Get Mouse Position" icon={UserSquare} colorClass="text-[#3fb950]" />
                <DraggableNode type="drawDebugLine" label="Draw Debug Line" icon={Waypoints} colorClass="text-[#58a6ff]" />
                <DraggableNode type="sphereTrace" label="Sphere Trace" icon={Waypoints} colorClass="text-[#58a6ff]" />
             </div>

             <div>
                <div className="font-bold text-[#888] flex justify-between items-center uppercase mb-1 px-2 mt-4">Variables</div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#222] rounded cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div> <span className="flex-1 text-[#fff]">Speed</span> <span className="text-[#888]">Float</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#222] rounded cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[#f85149]"></div> <span className="flex-1 text-[#fff]">Is In Air</span> <span className="text-[#888]">Boolean</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#222] rounded cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div> <span className="flex-1 text-[#fff]">Health</span> <span className="text-[#888]">Float</span>
                </div>
                <DraggableNode type="getVar" label="Get Variable" icon={Variable} colorClass="text-[#3fb950]" />
                <DraggableNode type="setVar" label="Set Variable" icon={Variable} colorClass="text-[#3fb950]" />
             </div>
           </div>
        </aside>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 relative bg-[#0d0f12]">
            
            {/* Debugger Toolbar Overlay */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-[#161b22] border border-[#30363d] p-1.5 rounded-lg shadow-lg shadow-black/50">
               <div className="text-[10px] uppercase font-bold text-[#8b949e] px-2 flex items-center gap-1 border-r border-[#30363d] mr-1">
                  <Waypoints size={10} /> Debugger
               </div>
               {executionState === 'idle' ? (
                  <button onClick={startExecution} className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-[#238636] hover:bg-[#2ea043] text-white rounded transition-colors">
                     <Play size={12}/> Start
                  </button>
               ) : (
                  <>
                     <button onClick={stepForwardExecution} disabled={executionState !== 'paused'} className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-[#222] hover:bg-[#333] border border-[#444] disabled:opacity-40 text-white rounded transition-colors group relative">
                        <StepForward size={12}/> Step
                        <div className="hidden group-hover:block absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black text-[#ccc] text-[9px] px-2 py-1 rounded whitespace-nowrap">Step Forward</div>
                     </button>
                     <button onClick={resumeExecution} disabled={executionState !== 'paused'} className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-[#2ea043] hover:bg-[#3fb950] border border-[#444] disabled:opacity-40 text-white rounded transition-colors">
                        <Play size={12}/> Resume
                     </button>
                     <button onClick={stopExecution} className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 bg-[#f85149] hover:bg-[#ff7b72] border border-[#444] text-white rounded transition-colors">
                        <StopCircle size={12}/> Stop
                     </button>
                     <span className={`text-[10px] ml-2 font-bold uppercase ${executionState === 'paused' ? 'text-[#f85149] animate-pulse' : 'text-[#3fb950]'} w-12`}>{executionState}</span>
                  </>
               )}
            </div>

            <ProfilerContext.Provider value={isProfiling}>
              <ExecutionContext.Provider value={{ breakpoints, executingNodeId }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
                onNodeDoubleClick={onNodeDoubleClick}
                nodeTypes={wrappedNodeTypes}
                edgeTypes={edgeTypes}
                onPaneContextMenu={onPaneContextMenu}
                onDrop={onDrop}
                onDragOver={onDragOver}
                fitView
                className="bg-[#0a0a0c] relative bp-flow"
              >
                <Background gap={40} color="#222" />
                <Controls className="bg-[#111] border-[#333] fill-[#ccc]" />
              </ReactFlow>
              </ExecutionContext.Provider>
            </ProfilerContext.Provider>

            {/* Offline AI Command Bar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[600px] z-[60] pointer-events-auto shadow-2xl">
              <div className="bg-[#111]/95 backdrop-blur border border-[#bc8cff]/30 rounded-xl p-2 flex flex-col gap-2">
                <div className="flex gap-2">
                   <div className="bg-[#bc8cff]/20 text-[#bc8cff] p-2 rounded-lg flex items-center justify-center shrink-0">
                      <Bot size={16} />
                   </div>
                   <input 
                     type="text" 
                     placeholder="AI Action: e.g. 'Make player jump when Spacebar is pressed...'"
                     className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm text-[#ccc] px-3 py-1 outline-none focus:border-[#bc8cff] transition-colors font-semibold"
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                           e.currentTarget.value = '';
                           alert('AI Generating Blueprint nodes...');
                        }
                     }}
                   />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Compiler Results */}
          <div className="h-[120px] bg-[#111] border-t border-[#000] flex flex-col shrink-0">
             <div className="px-3 py-1.5 flex gap-4 text-[11px] font-bold border-b border-[#222]">
                 <span className="text-[#fff] border-b-[2px] border-b-[#58a6ff] flex items-center gap-1"><TerminalSquare size={12}/> Compiler Results</span>
                 <span className="text-[#888] cursor-pointer flex items-center gap-1"><Search size={12}/> Find Results</span>
             </div>
             <div className="flex-1 p-2 text-[11px] text-[#ccc] overflow-y-auto font-mono flex flex-col gap-1">
                 <div className="flex items-center gap-2 text-[#ccc]">
                    <Clock size={12} className="text-[#888]"/> [12:04:56] Compile of ThirdPersonCharacter successful! (in 45 ms)
                 </div>
             </div>
          </div>
        </div>

        {/* Right Details */}
        <aside className="w-[280px] bg-[#1a1a1a] border-l border-[#000] flex flex-col shrink-0">
           <div className="px-3 py-2 text-[11px] uppercase tracking-[1px] text-[#fff] font-bold bg-[#111] border-b border-[#222] flex items-center gap-2">
              <BoxSelect size={12}/> DETAILS
           </div>
           <div className="p-2 border-b border-[#222]">
              <div className="flex items-center bg-[#111] border border-[#333] w-full rounded px-2">
                 <Search size={12} className="text-[#888]"/>
                 <input type="text" placeholder="Search Details" className="bg-transparent border-none outline-none text-[#ccc] text-[11px] px-2 py-1 w-full" />
              </div>
           </div>
           <div className="flex-1 overflow-y-auto p-2 text-[11px] flex flex-col gap-2">
              <div className="font-bold uppercase text-[#888] mb-1">Variable</div>
              <div className="flex items-center justify-between group">
                <span className="text-[#ccc] w-1/3">Variable Name</span>
                <input type="text" defaultValue="Speed" className="bg-[#111] border border-[#333] text-[#fff] px-2 py-0.5 rounded w-2/3 outline-none" />
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-[#ccc] w-1/3">Variable Type</span>
                <div className="bg-[#111] border border-[#333] text-[#3fb950] font-bold px-2 py-0.5 rounded w-2/3 cursor-pointer flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div> Float
                </div>
              </div>
              <div className="flex items-center justify-between group mt-2">
                <span className="text-[#ccc]">Instance Editable</span>
                <input type="checkbox" className="accent-[#58a6ff]" />
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-[#ccc]">Blueprint Read Only</span>
                <input type="checkbox" className="accent-[#58a6ff]" />
              </div>
              
              <div className="border-t border-[#333] mt-2 pt-2 font-bold uppercase text-[#888] mb-1">Default Value</div>
              <div className="flex items-center justify-between group">
                <span className="text-[#ccc] w-1/3">Speed</span>
                <input type="text" defaultValue="0.0" className="bg-[#111] border border-[#333] text-[#fff] px-2 py-0.5 rounded w-2/3 outline-none text-right font-mono" />
              </div>
           </div>
        </aside>
      </div>

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
          <button onClick={() => addNode('inputAxis', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Keyboard size={10} className="text-[#f85149]"/> Input Axis Event</button>
          <button onClick={() => addNode('onHit', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><AlertCircle size={10} className="text-[#f85149]"/> On Component Hit</button>
          <button onClick={() => addNode('onActorHit', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><AlertCircle size={10} className="text-[#f85149]"/> Event On Actor Hit</button>
          <button onClick={() => addNode('overlapBegin', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><AlertCircle size={10} className="text-[#f85149]"/> On Overlap Begin</button>
          <button onClick={() => addNode('overlapEnd', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><AlertCircle size={10} className="text-[#f85149]"/> On Overlap End</button>
          
          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Control Flow</div>
          <button onClick={() => addNode('branch', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><AlertCircle size={10} className="text-[#c9d1d9]"/> Branch (If)</button>
          <button onClick={() => addNode('sequence', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><GitCommit size={10} className="text-[#c9d1d9]"/> Sequence</button>
          <button onClick={() => addNode('delay', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Clock size={10} className="text-[#e3b341]"/> Delay</button>
          <button onClick={() => addNode('forLoop', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><GitCommit size={10} className="text-[#c9d1d9]"/> For Loop</button>
          <button onClick={() => addNode('whileLoop', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><GitCommit size={10} className="text-[#c9d1d9]"/> While Loop</button>
          <button onClick={() => addNode('doOnce', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><GitCommit size={10} className="text-[#c9d1d9]"/> Do Once</button>
          <button onClick={() => addNode('flipFlop', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><GitCommit size={10} className="text-[#c9d1d9]"/> Flip Flop</button>
          <button onClick={() => addNode('gate', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><GitCommit size={10} className="text-[#c9d1d9]"/> Gate</button>
          
          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Action & Casting</div>
          <button onClick={() => addNode('spawn', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><BoxSelect size={10} className="text-[#bc8cff]"/> SpawnActor from Class</button>
          <button onClick={() => addNode('spawnPrefab', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><BoxSelect size={10} className="text-[#bc8cff]"/> SpawnActor from Prefab</button>
          <button onClick={() => addNode('cast', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Cpu size={10} className="text-[#58a6ff]"/> Cast To PlayerCharacter</button>
          <button onClick={() => addNode('getLoc', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Waypoints size={10} className="text-[#3fb950]"/> Get Actor Location</button>
          <button onClick={() => addNode('getRot', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#8b949e] hover:text-white transition-colors flex items-center gap-2"><Waypoints size={10} className="text-[#8b949e]"/> Get Actor Rotation</button>
          <button onClick={() => addNode('setLoc', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Waypoints size={10} className="text-[#58a6ff]"/> Set Actor Location</button>
          <button onClick={() => addNode('smartDoor', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><BoxSelect size={10} className="text-[#e3b341]"/> Smart Door System</button>
          <button onClick={() => addNode('lineTrace', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Waypoints size={10} className="text-[#58a6ff]"/> Line Trace By Channel</button>
          <button onClick={() => addNode('applyDamage', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><AlertCircle size={10} className="text-[#f85149]"/> Apply Damage</button>
          <button onClick={() => addNode('applyForce', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Activity size={10} className="text-[#3fb950]"/> Add Physics Force</button>
          <button onClick={() => addNode('setPhysicsProps', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Settings2 size={10} className="text-[#3fb950]"/> Set Physics Props</button>
          <button onClick={() => addNode('addInstancedMesh', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Copy size={10} className="text-[#58a6ff]"/> Add Instance (HISM)</button>
          <button onClick={() => addNode('addSkeletalMesh', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><UserSquare size={10} className="text-[#58a6ff]"/> Add Skeletal Mesh Component</button>
          <button onClick={() => addNode('ikSolver', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Network size={10} className="text-[#58a6ff]"/> Two-Bone IK Solver</button>
          
          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Optimization & Streaming</div>
          <button onClick={() => addNode('importExternalAssets', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Copy size={10} className="text-[#58a6ff]"/> Batch Import Assets</button>
          <button onClick={() => addNode('hardwareOptimizer', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Cpu size={10} className="text-[#3fb950]"/> Hardware Optimizer</button>
          <button onClick={() => addNode('levelScript', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#bc8cff] hover:text-white transition-colors flex items-center gap-2"><FileCode2 size={10} className="text-[#bc8cff]"/> Level Script (Extreme Detail)</button>
          <button onClick={() => addNode('offlineAIAccelerator', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Gauge size={10} className="text-[#e3b341]"/> Offline AI Accelerator</button>
          <button onClick={() => addNode('enableCulling', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Settings2 size={10} className="text-[#3fb950]"/> GPU Culling (Frustum/Occ)</button>
          <button onClick={() => addNode('streamLevel', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Layers size={10} className="text-[#58a6ff]"/> Load Level (Async)</button>
          <button onClick={() => addNode('asyncLoadAsset', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Clock size={10} className="text-[#e3b341]"/> Async Load Asset</button>
          <button onClick={() => addNode('reflectionProbe', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Layers size={10} className="text-[#58a6ff]"/> Realtime Mirror / Probe</button>

          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">UI & Audio</div>
          <button onClick={() => addNode('createWidget', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Layers size={10} className="text-[#58a6ff]"/> Create Widget</button>
          <button onClick={() => addNode('addToViewport', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Layers size={10} className="text-[#58a6ff]"/> Add to Viewport</button>
          <button onClick={() => addNode('playSound', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Play size={10} className="text-[#bc8cff]"/> Play Sound at Location</button>

          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Functions & Logic</div>
          <button onClick={() => addNode('boolAnd', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#8b0000] font-bold">&& AND Boolean</button>
          <button onClick={() => addNode('boolNot', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#8b0000] font-bold">! NOT Boolean</button>

          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Math & Vectors</div>
          <button onClick={() => addNode('getPlayer', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#3fb950]"><UserSquare size={10}/> Get Player Character</button>
          <button onClick={() => addNode('mathMul', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#3fb950] font-bold">× Multiply (Float)</button>
          <button onClick={() => addNode('mathClamp', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#3fb950] font-bold">[] Clamp (Float)</button>
          <button onClick={() => addNode('mathMapRange', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#3fb950] font-bold">() Map Range</button>
          <button onClick={() => addNode('mathAddV', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#e3b341] font-bold">+ Add (Vector)</button>
          <button onClick={() => addNode('mathSubV', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#e3b341] font-bold">- Subtract (Vector)</button>
          <button onClick={() => addNode('mathDotProduct', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#e3b341] font-bold">· Dot Product</button>
          <button onClick={() => addNode('mathCrossProduct', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#e3b341] font-bold">× Cross Product</button>
          <button onClick={() => addNode('mathNormalize', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#e3b341] font-bold">|| Normalize (Vector)</button>
          <button onClick={() => addNode('mathVectorLength', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#e3b341] font-bold">|v| Vector Length</button>
          <button onClick={() => addNode('mathDistance', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#e3b341] font-bold">d Distance (Vector)</button>
          <button onClick={() => addNode('mathLerp', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#e3b341] font-bold">L Lerp (Vector)</button>
          <button onClick={() => addNode('constructVector', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#e3b341] font-bold">V Construct Vector</button>
          <button onClick={() => addNode('makeRotator', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#8b949e] font-bold">R Make Rotator</button>
          
          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Utilities & Data</div>
          <button onClick={() => addNode('getVar', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Variable size={10} className="text-[#3fb950]"/> Get Variable</button>
          <button onClick={() => addNode('setVar', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Variable size={10} className="text-[#3fb950]"/> Set Variable</button>
          <button onClick={() => addNode('makeArray', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2 text-[#58a6ff] font-bold">[] Make Array</button>
          <button onClick={() => addNode('print', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><TerminalSquare size={10} className="text-[#58a6ff]"/> Print String</button>
          <button onClick={() => addNode('array2D', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Grid3X3 size={10} className="text-[#e3b341]"/> 2D Data Array</button>

          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">Utilities & Debug</div>
          <button onClick={() => addNode('appendString', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><TerminalSquare size={10} className="text-[#58a6ff]"/> Append String</button>
          <button onClick={() => addNode('arrayAdd', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Layers size={10} className="text-[#58a6ff]"/> Array Add</button>
          <button onClick={() => addNode('getMousePos', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><UserSquare size={10} className="text-[#3fb950]"/> Get Mouse Position</button>
          <button onClick={() => addNode('drawDebugLine', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Waypoints size={10} className="text-[#58a6ff]"/> Draw Debug Line</button>
          <button onClick={() => addNode('sphereTrace', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Waypoints size={10} className="text-[#58a6ff]"/> Sphere Trace</button>
          <button onClick={() => addNode('mathRandomFloat', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><b className="text-[#3fb950] ml-1 mr-1">?</b> Random Float</button>

          <div className="w-full px-3 py-1.5 text-[#8b949e] text-[10px] uppercase tracking-wider font-bold border-t border-[#30363d] mt-1 shrink-0 bg-[#0d1117]">AI Assisted</div>
          <button onClick={() => addNode('aiMovement', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Sparkles size={10} className="text-[#bc8cff]"/> Offline AI Gen Movement Component</button>
          <button onClick={() => addNode('aiCombat', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Bot size={10} className="text-[#bc8cff]"/> Offline AI Gen Combat Behavior Tree</button>
          <button onClick={() => addNode('aiProximity', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Bot size={10} className="text-[#ff7b72]"/> Offline AI Player Proximity Behavior</button>
          <button onClick={() => addNode('aiBehaviorLogic', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Sparkles size={10} className="text-[#ff7b72]"/> Offline AI Gen Behavior Logic</button>
          <button onClick={() => addNode('offlineAI3DModelGen', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Layers size={10} className="text-[#e3b341]"/> Offline AI: 3D Model Master</button>
          <button onClick={() => addNode('offlineAI3DMapGen', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Grid3X3 size={10} className="text-[#e3b341]"/> Offline AI: 3D Map & Terrain</button>
          <button onClick={() => addNode('offlineAIWebLearn', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Network size={10} className="text-[#e3b341]"/> Offline AI: Deep Web Learning</button>
          <button onClick={() => addNode('aiNovelChar', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Bot size={10} className="text-[#bc8cff]"/> Offline AI: Novel Character Details</button>
          <button onClick={() => addNode('aiNovelEnv', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Layers size={10} className="text-[#bc8cff]"/> Offline AI: Novel Environment Details</button>
          <button onClick={() => addNode('aiNovelWorld', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Globe size={10} className="text-[#bc8cff]"/> Offline AI: World Builder</button>
          <button onClick={() => addNode('aiLoreSystem', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Database size={10} className="text-[#bc8cff]"/> Offline AI: Lore System & DB</button>
          <button onClick={() => addNode('aiVerifier', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><BoxSelect size={10} className="text-[#ff7b72]"/> Offline AI: Mesh Verifier System</button>
          <button onClick={() => addNode('aiActor', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Sparkles size={10} className="text-[#bc8cff]"/> Offline AI Gen Actor</button>
          <button onClick={() => addNode('aiSceneGen', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Sparkles size={10} className="text-[#bc8cff]"/> Offline AI Gen Scene Elements</button>
          <button onClick={() => addNode('aiAutoRigger', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><UserSquare size={10} className="text-[#ff7b72]"/> Offline AI Auto-Rigger & IK Setup</button>
          <button onClick={() => addNode('aiMaterialGen', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Image size={10} className="text-[#e3b341]"/> Offline AI PBR Material Gen</button>
          <button onClick={() => addNode('aiMeshOpt', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Grid3X3 size={10} className="text-[#58a6ff]"/> Offline AI Mesh Optimizer & Retopo</button>
          <button onClick={() => addNode('aiVfxGen', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Zap size={10} className="text-[#bc8cff]"/> Offline AI Niagara VFX Gen</button>
          <button onClick={() => addNode('adultContent', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><AlertCircle size={10} className="text-[#f85149]"/> Unrestricted Content (18+/20+)</button>
          <button onClick={() => addNode('aiTexture', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Image size={10} className="text-[#bc8cff]"/> Offline AI Gen Texture</button>
          <button onClick={() => addNode('aiAnimationGen', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Bot size={10} className="text-[#bc8cff]"/> Offline AI Gen Animation Cycle</button>
          <button onClick={() => addNode('aiTransform', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Sparkles size={10} className="text-[#bc8cff]"/> Offline AI Gen Transform</button>
          <button onClick={() => addNode('aiMechanic', menu)} className="w-full text-left px-3 py-1.5 hover:bg-[#58a6ff] hover:text-white transition-colors flex items-center gap-2"><Sparkles size={10} className="text-[#ff7b72]"/> Offline AI Gen Mechanic</button>
        </div>
      )}

      {menu && <div className="absolute inset-0 z-40" onClick={() => setMenu(null)}></div>}
    </div>
  );
}
