import React, { useState } from 'react';
import { Play, Pause, Save, Box, Search, MousePointer2, Maximize2, Minimize2, Eye, Cpu, Settings, Copy, Trash2, Code, Zap, Layers, MessageSquare, Flag, Share2, Target, Volume2, Smile } from 'lucide-react';

interface DialogueNode {
  id: string;
  type: 'Dialogue' | 'Condition' | 'QuestObjective' | 'Event';
  title: string;
  x: number;
  y: number;
  data: any;
  inputs: number;
  outputs: number;
}

const DEFAULT_NODES: DialogueNode[] = [
  { id: 'n1', type: 'Event', title: 'On Quest Start', x: 50, y: 150, data: { eventName: 'Start_Find_Amulet' }, inputs: 0, outputs: 1 },
  { id: 'n2', type: 'Dialogue', title: 'NPC: Greeting', x: 250, y: 100, data: { speaker: 'Elder', text: "Ah, traveler. The amulet has been stolen.", emotion: 'Sad' }, inputs: 1, outputs: 2 },
  { id: 'n3', type: 'Dialogue', title: 'Player: Accept', x: 550, y: 50, data: { speaker: 'Player', text: "I will find it.", emotion: 'Determined' }, inputs: 1, outputs: 1 },
  { id: 'n4', type: 'Dialogue', title: 'Player: Decline', x: 550, y: 180, data: { speaker: 'Player', text: "Not my problem.", emotion: 'Neutral' }, inputs: 1, outputs: 1 },
  { id: 'n5', type: 'QuestObjective', title: 'Set Objective', x: 850, y: 50, data: { objective: 'Find the hidden cave', reward: '500g' }, inputs: 1, outputs: 1 }
];

const CONNECTIONS = [
  { from: 'n1', to: 'n2' },
  { from: 'n2', to: 'n3' },
  { from: 'n2', to: 'n4' },
  { from: 'n3', to: 'n5' }
];

export default function AIQuestDialogueGraph() {
  const [nodes, setNodes] = useState<DialogueNode[]>(DEFAULT_NODES);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>('n2');
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Dialogue': return 'border-blue-500 bg-blue-900/40 text-blue-400';
      case 'Condition': return 'border-orange-500 bg-orange-900/40 text-orange-400';
      case 'QuestObjective': return 'border-purple-500 bg-purple-900/40 text-purple-400';
      case 'Event': return 'border-green-500 bg-green-900/40 text-green-400';
      default: return 'border-gray-500 bg-gray-900/40 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Dialogue': return <MessageSquare size={12}/>;
      case 'Condition': return <Share2 size={12}/>;
      case 'QuestObjective': return <Target size={12}/>;
      case 'Event': return <Flag size={12}/>;
      default: return <Box size={12}/>;
    }
  };

  const drawConnections = () => {
    return CONNECTIONS.map((c, i) => {
      const fromNode = nodes.find(n => n.id === c.from);
      const toNode = nodes.find(n => n.id === c.to);
      if (!fromNode || !toNode) return null;
      
      const startX = fromNode.x + 200; 
      const startY = fromNode.y + 40; 
      
      const endX = toNode.x;
      const endY = toNode.y + 40;

      const cp1X = startX + 50;
      const cp1Y = startY;
      const cp2X = endX - 50;
      const cp2Y = endY;

      return (
        <path 
          key={i}
          d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
          fill="none"
          stroke="#555"
          strokeWidth="3"
          className="opacity-80 hover:opacity-100 hover:stroke-blue-400 transition-colors cursor-pointer"
        />
      );
    });
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-sans overflow-hidden select-none"
         onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      
      {/* Top Header */}
      <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow-lg">
            <MessageSquare size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-gray-100 uppercase">Dialogue & <span className="text-blue-400">Quest Logic</span></h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Story Graph Editor</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-[#333] hover:bg-[#444] transition-colors">
            <Play size={14} /> SIMULATE FLOW
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-[0_0_10px_rgba(37,99,235,0.3)]">
            <Save size={14} /> COMPILE SCRIPT
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Toolbar */}
        <div className="w-56 bg-[#252526] border-r border-[#3e3e42] flex flex-col shrink-0 z-10">
           <div className="p-3 border-b border-[#3e3e42] bg-[#1a1a1c]">
             <div className="relative">
               <Search size={14} className="absolute left-2 top-1.5 text-gray-500" />
               <input type="text" placeholder="Search Nodes..." className="w-full bg-black border border-[#3e3e42] text-xs text-white rounded pl-8 pr-2 py-1.5 outline-none focus:border-blue-500" />
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
              
              <div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Nodes</h3>
                <div className="flex flex-col gap-1">
                  <button className="bg-[#333] hover:bg-[#444] rounded p-2 text-xs text-left text-gray-300 border border-[#444] flex items-center gap-2">
                    <MessageSquare size={14} className="text-blue-400"/> Dialogue Line
                  </button>
                  <button className="bg-[#333] hover:bg-[#444] rounded p-2 text-xs text-left text-gray-300 border border-[#444] flex items-center gap-2">
                    <Share2 size={14} className="text-orange-400"/> Branch / Condition
                  </button>
                  <button className="bg-[#333] hover:bg-[#444] rounded p-2 text-xs text-left text-gray-300 border border-[#444] flex items-center gap-2">
                    <Target size={14} className="text-purple-400"/> Quest Objective
                  </button>
                  <button className="bg-[#333] hover:bg-[#444] rounded p-2 text-xs text-left text-gray-300 border border-[#444] flex items-center gap-2">
                    <Flag size={14} className="text-green-400"/> Event Trigger
                  </button>
                  <button className="bg-[#333] hover:bg-[#444] rounded p-2 text-xs text-left text-gray-300 border border-[#444] flex items-center gap-2">
                    <Zap size={14} className="text-yellow-400"/> Set Variable
                  </button>
                </div>
              </div>

           </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 relative bg-[#1a1a1c] overflow-hidden" 
             style={{ backgroundImage: 'linear-gradient(#252526 1px, transparent 1px), linear-gradient(90deg, #252526 1px, transparent 1px)', backgroundSize: '40px 40px' }}
             onMouseDown={() => setSelectedNode(null)}>
             
          <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 0 }}>
            {drawConnections()}
          </svg>

          {nodes.map(node => (
            <div 
              key={node.id}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              className={`absolute flex flex-col w-48 rounded-lg border-2 shadow-xl cursor-move bg-[#252526]/95 backdrop-blur ${getTypeColor(node.type)} ${selectedNode === node.id ? 'ring-2 ring-white scale-105' : ''}`}
              style={{ left: node.x, top: node.y, zIndex: selectedNode === node.id ? 10 : 1 }}
            >
              <div className="px-3 py-2 bg-black/40 border-b border-black/20 flex items-center gap-2">
                {getTypeIcon(node.type)}
                <span className="text-xs font-bold text-white truncate flex-1">{node.title}</span>
              </div>
              
              <div className="p-3 text-xs text-gray-300 min-h-[40px]">
                 {node.type === 'Dialogue' && (
                    <div className="italic break-words border-l-2 border-blue-500 pl-2">"{node.data.text}"</div>
                 )}
                 {node.type === 'Event' && (
                    <div className="font-mono text-[10px] text-green-300">{node.data.eventName}</div>
                 )}
                 {node.type === 'QuestObjective' && (
                    <div className="font-bold text-purple-300">{node.data.objective}</div>
                 )}
              </div>

              {/* Pins */}
              {node.inputs > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-gray-400 rounded-full border-2 border-[#252526] z-20 cursor-crosshair"></div>
              )}
              {node.outputs > 0 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-gray-400 rounded-full border-2 border-[#252526] z-20 cursor-crosshair"></div>
              )}
            </div>
          ))}
          
        </div>

        {/* Right Inspector */}
        <div className="w-80 bg-[#252526] border-l border-[#3e3e42] flex flex-col shrink-0 z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar">
           
           <div className="p-4 space-y-5">
             {selectedNode ? (
               <div className="space-y-4">
                 <div className="bg-[#1a1a1c] p-3 rounded border border-[#3e3e42]">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2">
                     <Settings size={16} className="text-blue-400"/>
                     {nodes.find(n => n.id === selectedNode)?.title}
                   </h3>
                   <div className="text-[10px] text-gray-500 uppercase mt-1">{nodes.find(n => n.id === selectedNode)?.type} Node</div>
                 </div>
                 
                 <div className="space-y-4">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#3e3e42] pb-1">Properties</h4>
                   
                   {nodes.find(n => n.id === selectedNode)?.type === 'Dialogue' && (
                     <>
                       <div className="flex flex-col gap-1.5">
                         <span className="text-[10px] text-gray-400">Speaker Name</span>
                         <input type="text" defaultValue={nodes.find(n => n.id === selectedNode)?.data.speaker} className="w-full bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1.5 outline-none focus:border-blue-500" />
                       </div>
                       
                       <div className="flex flex-col gap-1.5">
                         <span className="text-[10px] text-gray-400">Dialogue Text</span>
                         <textarea rows={4} defaultValue={nodes.find(n => n.id === selectedNode)?.data.text} className="w-full bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1.5 outline-none focus:border-blue-500 resize-none" />
                       </div>

                       <div className="flex flex-col gap-1.5">
                         <span className="text-[10px] text-gray-400 flex items-center gap-1"><Smile size={10}/> Emotion Tag</span>
                         <select className="w-full bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1.5 outline-none focus:border-blue-500">
                           <option>Neutral</option>
                           <option>Happy</option>
                           <option>Sad</option>
                           <option>Angry</option>
                           <option>Determined</option>
                         </select>
                       </div>

                       <div className="flex flex-col gap-1.5">
                         <span className="text-[10px] text-gray-400 flex items-center gap-1"><Volume2 size={10}/> Voiceover Audio</span>
                         <div className="flex items-center gap-2">
                           <button className="bg-[#333] hover:bg-[#444] px-2 py-1 rounded border border-[#444] text-[10px]">Browse</button>
                           <span className="text-[9px] text-gray-500 font-mono truncate">vo_elder_001.wav</span>
                         </div>
                       </div>
                     </>
                   )}
                   
                   {nodes.find(n => n.id === selectedNode)?.type === 'QuestObjective' && (
                     <>
                       <div className="flex flex-col gap-1.5">
                         <span className="text-[10px] text-gray-400">Objective Description</span>
                         <input type="text" defaultValue={nodes.find(n => n.id === selectedNode)?.data.objective} className="w-full bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1.5 outline-none focus:border-purple-500" />
                       </div>
                       <div className="flex flex-col gap-1.5">
                         <span className="text-[10px] text-gray-400">Reward Setup</span>
                         <input type="text" defaultValue={nodes.find(n => n.id === selectedNode)?.data.reward} className="w-full bg-black border border-[#3e3e42] text-xs text-white rounded px-2 py-1.5 outline-none focus:border-purple-500" />
                       </div>
                     </>
                   )}
                 </div>
                 
                 <div className="pt-4 border-t border-[#3e3e42] flex gap-2">
                   <button className="flex-1 py-1.5 bg-[#333] hover:bg-[#444] rounded text-[10px] font-bold text-gray-300 flex justify-center items-center gap-1 transition-colors">
                     <Copy size={12} /> DUPLICATE
                   </button>
                   <button className="flex-1 py-1.5 bg-red-900/30 border border-red-900/50 hover:bg-red-900/50 rounded text-[10px] font-bold text-red-400 flex justify-center items-center gap-1 transition-colors">
                     <Trash2 size={12} /> DELETE
                   </button>
                 </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2 opacity-50 pt-20">
                 <MousePointer2 size={24} />
                 <span className="text-xs text-center">Select a node to inspect properties</span>
               </div>
             )}
           </div>
        </div>
      </div>
      
    </div>
  );
}
