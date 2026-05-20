import React, { useState, useEffect } from 'react';
import { Map, Grid, Layers, Search, Plus, Save, Play, Mountain, Trees, Box, Hexagon, Move3D, Eye, Camera, Settings, Compass, Undo, Redo, Sun, Wind, PersonStanding, RefreshCw, Maximize2, Route, SquareDashed, Milestone, Clapperboard, ScrollText, Lightbulb, Paintbrush, Flag, Video, Focus, Volume2, Stamp, Cpu, Wand2, CloudRain, Zap, Workflow, ImageUp, Activity, GripHorizontal, Minimize2, Database, Brain, MonitorPlay, Hammer, Bomb, Folder, ChevronUp, ChevronDown, Package, BoxSelect, Trash2, Orbit, Flame, Snowflake, Skull, Waves, Moon, Network, Globe, RotateCcw, Sparkles } from 'lucide-react';

export default function MapEditor({ setActiveTool }: { setActiveTool?: (tool: string) => void }) {
  const [mode, setMode] = useState('Select');
  const [perfPos, setPerfPos] = useState({ x: 16, y: 50 });
  const [splineType, setSplineType] = useState<'Path' | 'Road' | 'River'>('Path');
  const [splineNodes, setSplineNodes] = useState<{ x: number, y: number, id: number }[]>([
    { x: 40, y: 60, id: 0 },
    { x: 60, y: 50, id: 1 },
    { x: 80, y: 40, id: 2 }
  ]);

  const generateSplineCurve = (points: {x: number, y: number}[]) => {
    if (points.length < 2) return '';
    if (points.length === 2) return `M ${points[0].x}% ${points[0].y}% L ${points[1].x}% ${points[1].y}%`;
    
    // Catmull-Rom to Bezier for smooth splines passing exactly through nodes
    const tension = 1;
    let path = `M ${points[0].x}% ${points[0].y}%`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i === 0 ? points[0] : points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i + 2 < points.length ? points[i + 2] : p2;
      
      const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
      const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
      const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
      const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;
      
      path += ` C ${cp1x}% ${cp1y}%, ${cp2x}% ${cp2y}%, ${p2.x}% ${p2.y}%`;
    }
    return path;
  };
  const [activeSplineNode, setActiveSplineNode] = useState<number | null>(0);
  const [isNodeDragging, setIsNodeDragging] = useState<{id: number, startX: number, startY: number, initialX: number, initialY: number} | null>(null);
  const [isPerfDragging, setIsPerfDragging] = useState<{startX: number, startY: number, initialX: number, initialY: number} | null>(null);
  const [isPerfMinimized, setIsPerfMinimized] = useState(false);
  const [isContentBrowserOpen, setIsContentBrowserOpen] = useState(false);
  
  // AI Chat state
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiChatPos, setAiChatPos] = useState({ x: 300, y: 100 });
  const [isAiChatDragging, setIsAiChatDragging] = useState<{startX: number, startY: number, initialX: number, initialY: number} | null>(null);

  useEffect(() => {
    if (isPerfDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        setPerfPos({
          x: isPerfDragging.initialX + (e.clientX - isPerfDragging.startX),
          y: Math.max(0, isPerfDragging.initialY + (e.clientY - isPerfDragging.startY))
        });
      };
      const handleMouseUp = () => setIsPerfDragging(null);
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPerfDragging]);

  useEffect(() => {
    if (isNodeDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        // In this simple mock, we just move the percentage arbitrarily
        // To do it correctly relative to container, we'd need container ref. We assume 8px per percentage roughly here
        setSplineNodes(prev => prev.map(node => {
          if (node.id === isNodeDragging.id) {
            return {
              ...node,
              x: isNodeDragging.initialX + (e.clientX - isNodeDragging.startX) * 0.1,
              y: isNodeDragging.initialY + (e.clientY - isNodeDragging.startY) * 0.1
            }
          }
          return node;
        }));
      };
      const handleMouseUp = () => setIsNodeDragging(null);
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isNodeDragging]);

  useEffect(() => {
    if (isAiChatDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        setAiChatPos({
          x: isAiChatDragging.initialX + (e.clientX - isAiChatDragging.startX),
          y: Math.max(0, isAiChatDragging.initialY + (e.clientY - isAiChatDragging.startY))
        });
      };
      const handleMouseUp = () => setIsAiChatDragging(null);
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isAiChatDragging]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-[#30363d] p-3 items-center justify-between bg-[#161b22] shrink-0 gap-4 overflow-x-auto custom-scrollbar">
         <div className="flex items-center gap-3 shrink-0">
            <div className="p-2 bg-[#58a6ff]/10 rounded text-[#58a6ff]"><Map size={20}/></div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Apex Map Builder</h2>
              <p className="text-[10px] text-[#8b949e]">Level Assembly, Prefabs, Blockout & Navigation</p>
            </div>
         </div>
         
         <div className="flex gap-1 bg-[#0d1117] border border-[#30363d] rounded p-1 text-[11px] font-bold shrink-0">
            <button onClick={() => setMode('Select')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Select' ? 'bg-[#21262d] text-[#58a6ff]' : 'text-[#8b949e] hover:text-white'}`}><Move3D size={12}/> Editor</button>
            <button onClick={() => setMode('Instance_Override')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Instance_Override' ? 'bg-[#21262d] text-[#e3b341]' : 'text-[#8b949e] hover:text-white'}`}><Layers size={12}/> Instance Overrides</button>
            <button onClick={() => setMode('Landscape')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Landscape' ? 'bg-[#21262d] text-[#3fb950]' : 'text-[#8b949e] hover:text-white'}`}><Mountain size={12}/> Terrain</button>
            <button onClick={() => setMode('World_Partition')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'World_Partition' ? 'bg-[#21262d] text-[#e3b341]' : 'text-[#8b949e] hover:text-white'}`}><Grid size={12}/> World Partition</button>
            <button onClick={() => setMode('Foliage')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Foliage' ? 'bg-[#21262d] text-[#3fb950]' : 'text-[#8b949e] hover:text-white'}`}><Trees size={12}/> Foliage</button>
            <button onClick={() => setMode('Blockout')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Blockout' ? 'bg-[#21262d] text-[#e3b341]' : 'text-[#8b949e] hover:text-white'}`}><Box size={12}/> Blockout</button>
            <button onClick={() => setMode('NPC')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'NPC' ? 'bg-[#21262d] text-[#bc8cff]' : 'text-[#8b949e] hover:text-white'}`}><PersonStanding size={12}/> NPCs</button>
            <button onClick={() => setMode('MetaHuman')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'MetaHuman' ? 'bg-[#21262d] text-[#bc8cff]' : 'text-[#8b949e] hover:text-white'}`}><PersonStanding size={12}/> MetaHuman</button>
            <button onClick={() => setMode('Pathing')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Pathing' ? 'bg-[#21262d] text-[#3fb950]' : 'text-[#8b949e] hover:text-white'}`}><Route size={12}/> Pathing</button>
            <button onClick={() => setMode('Niagara')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Niagara' ? 'bg-[#21262d] text-[#bc8cff]' : 'text-[#8b949e] hover:text-white'}`}><Zap size={12}/> Niagara FX</button>
            <button onClick={() => setMode('Volumes')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Volumes' ? 'bg-[#21262d] text-[#f85149]' : 'text-[#8b949e] hover:text-white'}`}><SquareDashed size={12}/> Volumes</button>
            <button onClick={() => setMode('Quests')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Quests' ? 'bg-[#21262d] text-[#e3b341]' : 'text-[#8b949e] hover:text-white'}`}><ScrollText size={12}/> Quests</button>
            <button onClick={() => setMode('Cinematic')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Cinematic' ? 'bg-[#21262d] text-[#bc8cff]' : 'text-[#8b949e] hover:text-white'}`}><Clapperboard size={12}/> Cinematic</button>
            <button onClick={() => setMode('Lighting')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Lighting' ? 'bg-[#21262d] text-[#e3b341]' : 'text-[#8b949e] hover:text-white'}`}><Lightbulb size={12}/> Lighting</button>
            <button onClick={() => setMode('Audio')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Audio' ? 'bg-[#21262d] text-[#58a6ff]' : 'text-[#8b949e] hover:text-white'}`}><Volume2 size={12}/> Audio</button>
            <button onClick={() => setMode('Decals')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Decals' ? 'bg-[#21262d] text-[#bc8cff]' : 'text-[#8b949e] hover:text-white'}`}><Stamp size={12}/> Decals</button>
            <div className="w-px h-6 bg-[#30363d] mx-1 shrink-0 self-center"></div>
            <button onClick={() => setMode('Chaos_Physics')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Chaos_Physics' ? 'bg-[#f85149]/20 text-[#f85149]' : 'text-[#8b949e] hover:text-[#f85149]'}`}><Wind size={12}/> Chaos Physics</button>
            <button onClick={() => setMode('Destruction')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Destruction' ? 'bg-[#e3b341]/20 text-[#e3b341]' : 'text-[#8b949e] hover:text-[#e3b341]'}`}><Bomb size={12}/> Destruction</button>
            <button onClick={() => setMode('Chemistry')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Chemistry' ? 'bg-[#bc8cff]/20 text-[#bc8cff]' : 'text-[#8b949e] hover:text-[#bc8cff]'}`}><Hexagon size={12}/> Chemistry</button>
            <button onClick={() => setMode('Biology')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Biology' ? 'bg-[#3fb950]/20 text-[#3fb950]' : 'text-[#8b949e] hover:text-[#3fb950]'}`}><Trees size={12}/> Biology</button>
            <div className="w-px h-6 bg-[#30363d] mx-1 shrink-0 self-center"></div>
            <button onClick={() => setMode('PCG')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'PCG' ? 'bg-[#7ee787]/20 text-[#7ee787]' : 'text-[#8b949e] hover:text-[#7ee787]'}`}><Cpu size={12}/> PCG</button>
            <button onClick={() => setMode('Blueprint')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Blueprint' ? 'bg-[#1f6feb]/20 text-[#58a6ff]' : 'text-[#8b949e] hover:text-[#58a6ff]'}`}><Workflow size={12}/> Blueprint</button>
            <button onClick={() => setMode('Voxel')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'Voxel' ? 'bg-[#e3b341]/20 text-[#e3b341]' : 'text-[#8b949e] hover:text-[#e3b341]'}`}><Grid size={12}/> Voxel Build</button>
            <button onClick={() => setMode('AI_Assist')} className={`px-2 py-1.5 rounded transition-colors flex gap-1.5 items-center ${mode === 'AI_Assist' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'text-[#8b949e] hover:text-[#58a6ff]'}`}><Wand2 size={12}/> Local AI Tools</button>
         </div>

         <div className="flex gap-2 text-[11px] font-bold shrink-0">
            <button onClick={() => setIsAiChatOpen(!isAiChatOpen)} className={`px-3 py-1.5 border border-[#30363d] rounded flex items-center gap-2 transition-colors ${isAiChatOpen ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9]'}`}><Brain size={12}/> AI Offline Chat</button>
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors"><Undo size={12}/></button>
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded flex items-center gap-2 transition-colors"><Redo size={12}/></button>
            <div className="w-px h-6 bg-[#30363d] mx-1"></div>
            <button className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded flex items-center gap-2 transition-colors"><Play size={12}/> Play in Editor (PIE)</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* Floating AI Offline Chat */}
        {isAiChatOpen && (
           <div 
              style={{ left: aiChatPos.x, top: aiChatPos.y, borderBottomRightRadius: '0px' }}
              className={`absolute w-80 h-96 bg-[#0d1117]/95 backdrop-blur border border-[#30363d] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] z-[60] flex flex-col overflow-hidden transition-opacity resize ${isAiChatDragging ? 'opacity-80' : 'opacity-100'}`}
           >
              <div 
                 className="h-8 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-3 cursor-move select-none"
                 onMouseDown={(e) => setIsAiChatDragging({ startX: e.clientX, startY: e.clientY, initialX: aiChatPos.x, initialY: aiChatPos.y })}
              >
                 <div className="flex items-center gap-2 text-[#58a6ff]">
                    <Brain size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Offline AI Assistant</span>
                 </div>
                 <div className="flex gap-1">
                    <button 
                       onClick={(e) => { e.stopPropagation(); setIsAiChatOpen(false); }}
                       className="text-[#8b949e] hover:text-[#f85149] p-0.5 rounded transition-colors"
                    ><Minimize2 size={12}/></button>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-3">
                 <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#58a6ff]/20 flex items-center justify-center shrink-0 border border-[#58a6ff]/50">
                       <Brain size={12} className="text-[#58a6ff]" />
                    </div>
                    <div className="bg-[#21262d] rounded-lg rounded-tl-none p-2 border border-[#30363d] text-[11px] text-[#c9d1d9]">
                       Hello! I am your Offline Local AI. I can generate scripts, suggest level layouts, or analyze physics setups. What would you like to build?
                    </div>
                 </div>
                 <div className="flex gap-2 flex-row-reverse">
                    <div className="w-6 h-6 rounded-full bg-[#3fb950]/20 flex items-center justify-center shrink-0 border border-[#3fb950]/50">
                       <PersonStanding size={12} className="text-[#3fb950]" />
                    </div>
                    <div className="bg-[#1f6feb]/20 text-[#c9d1d9] rounded-lg rounded-tr-none p-2 border border-[#1f6feb]/50 text-[11px]">
                       Can you create a Blueprint for an automatic door with a proximity sensor?
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#58a6ff]/20 flex items-center justify-center shrink-0 border border-[#58a6ff]/50">
                       <Brain size={12} className="text-[#58a6ff]" />
                    </div>
                    <div className="bg-[#21262d] rounded-lg rounded-tl-none p-2 border border-[#30363d] text-[11px] text-[#c9d1d9] w-full">
                       Generating Blueprint... <br/>
                       <div className="mt-2 bg-[#0d1117] border border-[#30363d] rounded p-2 text-[10px] font-mono text-[#7ee787]">
                          <span className="text-[#ff7b72]">Event</span> BeginOverlap (TriggerVolume) {'\n'}
                          {'  '}-&gt; <span className="text-[#ff7b72]">Timeline</span> (OpenDoor) {'\n'}
                          {'  '}-&gt; <span className="text-[#79c0ff]">SetRelativeLocation</span> (LeftDoor, RightDoor)
                       </div>
                       <button className="mt-2 text-[10px] bg-[#1f6feb] text-white px-2 py-1 rounded w-full hover:bg-[#388bfd] transition-colors">Apply to Selected Actor</button>
                    </div>
                 </div>
              </div>
              <div className="h-10 border-t border-[#30363d] bg-[#161b22] flex items-center px-2 py-1 shrink-0">
                 <input type="text" placeholder="Type a command or request..." className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-[11px] text-white w-full outline-none focus:border-[#58a6ff]" />
                 <button className="ml-1 p-1.5 text-[#58a6ff] hover:bg-[#58a6ff]/10 rounded transition-colors">
                    <div className="w-3 h-3 bg-current rounded-sm" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)'}}></div>
                 </button>
              </div>
           </div>
        )}

        {/* Floating Performance Monitor (Draggable & Minimized state) */}
        {!isPerfMinimized && (
           <div 
              style={{ left: perfPos.x, top: perfPos.y }}
              className={`absolute w-64 bg-[#161b22]/95 backdrop-blur border border-[#30363d] rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden transition-opacity ${isPerfDragging ? 'opacity-80' : 'opacity-100'}`}
           >
              <div 
                 className="h-6 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between px-2 cursor-move select-none"
                 onMouseDown={(e) => setIsPerfDragging({ startX: e.clientX, startY: e.clientY, initialX: perfPos.x, initialY: perfPos.y })}
              >
                 <div className="flex items-center gap-1.5 text-[#8b949e]">
                    <GripHorizontal size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">System Metrics</span>
                 </div>
                 <button 
                    onClick={(e) => { e.stopPropagation(); setIsPerfMinimized(true); }}
                    className="text-[#8b949e] hover:text-white p-0.5 rounded transition-colors"
                 ><Minimize2 size={10}/></button>
              </div>
              <div className="p-3 grid grid-cols-2 gap-3 cursor-default">
                 <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="font-bold text-[#c9d1d9] flex gap-1 items-center"><Activity size={10} className="text-[#58a6ff]"/> CPU</span>
                       <span className="text-[#8b949e] font-mono">18%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                       <div className="h-full bg-[#58a6ff] w-[18%] shadow-[0_0_5px_#58a6ff]"></div>
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="font-bold text-[#c9d1d9] flex gap-1 items-center"><Database size={10} className="text-[#3fb950]"/> RAM</span>
                       <span className="text-[#8b949e] font-mono">42% (13.5)</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                       <div className="h-full bg-[#3fb950] w-[42%] shadow-[0_0_5px_#3fb950]"></div>
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="font-bold text-[#c9d1d9] flex gap-1 items-center"><MonitorPlay size={10} className="text-[#bc8cff]"/> GPU</span>
                       <span className="text-[#8b949e] font-mono">87% (7.8)</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                       <div className="h-full bg-[#bc8cff] w-[87%] shadow-[0_0_5px_#bc8cff]"></div>
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="font-bold text-[#c9d1d9] flex gap-1 items-center"><Brain size={10} className="text-[#e3b341]"/> TPU</span>
                       <span className="text-[#8b949e] font-mono">60%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                       <div className="h-full bg-[#e3b341] w-[60%] shadow-[0_0_5px_#e3b341]"></div>
                    </div>
                 </div>
              </div>
           </div>
        )}
        
        {/* Outliner & Asset Browser */}
        <div className="w-64 border-r border-[#30363d] bg-[#161b22] flex flex-col shrink-0">
            {/* World Outliner */}
            <div className="flex-1 flex flex-col overflow-hidden border-b border-[#30363d]">
               <div className="p-2 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117] shrink-0">
                  <span className="text-[11px] font-bold text-[#c9d1d9] uppercase tracking-wide flex flex-row items-center gap-2"><Layers size={14}/> Outliner</span>
                  <div className="flex gap-1">
                     <button className="text-[#8b949e] hover:text-white px-1"><Plus size={14}/></button>
                     <button className="text-[#8b949e] hover:text-white px-1"><Search size={14}/></button>
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar p-2 text-[11px] font-mono select-none">
                  <div className="flex items-center gap-2 hover:bg-[#21262d] p-1 rounded cursor-pointer text-white font-bold"><Map size={12} className="text-[#58a6ff]"/> Level_01_Main</div>
                  
                  <div className="pl-4 mt-1 border-l border-[#30363d] ml-1 flex flex-col gap-[2px]">
                     <div className="flex items-center gap-2 hover:bg-[#21262d] p-1 rounded cursor-pointer text-[#8b949e] group">
                        <div className="flex gap-2 items-center"><Mountain size={12}/> Landscape_01</div>
                        <button onClick={(e) => { e.stopPropagation(); setActiveTool?.('Landscape'); }} className="opacity-0 group-hover:opacity-100 p-0.5 ml-auto text-[#58a6ff]"><Move3D size={12} /></button>
                     </div>
                     <div className="flex items-center gap-2 hover:bg-[#21262d] p-1 rounded cursor-pointer text-[#e3b341] group">
                        <div className="flex gap-2 items-center"><Layers size={12}/> PCG_Forest_Generator</div>
                        <button onClick={(e) => { e.stopPropagation(); setActiveTool?.('PCG'); }} className="opacity-0 group-hover:opacity-100 p-0.5 ml-auto text-[#58a6ff]"><Settings size={12} /></button>
                     </div>
                     <div className="flex items-center gap-2 hover:bg-[#21262d] p-1 rounded cursor-pointer text-[#8b949e]"><Sun size={12}/> DirectionalLight_Main</div>
                     <div className="flex items-center gap-2 hover:bg-[#21262d] p-1 rounded cursor-pointer text-[#8b949e]"><Wind size={12}/> SkyAtmosphere</div>
                     
                     <div className="flex items-center justify-between hover:bg-[#21262d] p-1 rounded cursor-pointer mt-2 group">
                        <div className="flex items-center gap-2 text-white font-bold"><Box size={12} className="text-[#e3b341]"/> Architecture</div>
                        <Eye size={12} className="text-[#58a6ff] opacity-0 group-hover:opacity-100" />
                     </div>
                     <div className="pl-4 border-l border-[#30363d] ml-1 flex flex-col gap-[2px]">
                        <div className="flex items-center gap-2 hover:bg-[#21262d] p-1 rounded cursor-pointer text-[#c9d1d9]"><Box size={12}/> SM_Wall_01 <span className="text-[9px] text-[#8b949e] ml-auto">Static</span></div>
                        <div className="flex items-center gap-2 bg-[#1f6feb]/20 border border-[#1f6feb]/30 p-1 rounded cursor-pointer text-white font-bold"><Box size={12}/> SM_Wall_02 <span className="text-[9px] text-[#8b949e] ml-auto">Static</span></div>
                        <div className="flex items-center gap-2 hover:bg-[#21262d] p-1 rounded cursor-pointer text-[#c9d1d9]"><Box size={12}/> SM_Floor_Concrete_01 <span className="text-[9px] text-[#8b949e] ml-auto">Static</span></div>
                     </div>

                     <div className="flex items-center gap-2 hover:bg-[#21262d] p-1 rounded cursor-pointer mt-2 text-[#c9d1d9]"><PersonStanding size={12} className="text-[#3fb950]"/> PlayerStart</div>
                  </div>
               </div>
            </div>

            {/* Content Browser Mini */}
            <div className="h-64 flex flex-col overflow-hidden">
               <div className="p-2 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117] shrink-0">
                  <span className="text-[11px] font-bold text-[#c9d1d9] uppercase tracking-wide">
                     {mode === 'NPC' && 'NPCs & Monsters'}
                     {mode === 'Physics' && 'Physics & Rigid Bodies'}
                     {mode === 'Chemistry' && 'Material Reactions & Chemistry'}
                     {mode === 'Biology' && 'Ecosystem & Bio-Zones'}
                     {mode === 'Lighting' && 'Lights & Environment'}
                     {mode === 'Audio' && 'Sound Emitters & Reverb'}
                     {mode === 'Decals' && 'Decals & Graffiti'}
                     {mode === 'PCG' && 'Procedural Generation Rules'}
                     {mode === 'Blueprint' && 'Blueprint Scripts & Logic'}
                     {mode === 'AI_Assist' && 'Offline AI Generators'}
                     {mode === 'Pathing' && 'Path & Spline Tools'}
                     {mode === 'Volumes' && 'Invisible Walls & Volumes'}
                     {mode === 'Landscape' && 'Landscape Tools'}
                     {mode === 'Foliage' && 'Foliage Types'}
                     {mode === 'Quests' && 'Quest Objects & Markers'}
                     {mode === 'Cinematic' && 'Cameras & Sequences'}
                     {mode === 'Lighting' && 'Lights & Environment'}
                     {mode === 'Instance_Override' && 'Instanced Mesh Variations'}
                     {mode === 'World_Partition' && 'Streaming Grids & Cells'}
                     {mode === 'Niagara' && 'Particle Systems & Emitters'}
                     {mode === 'MetaHuman' && 'MetaHuman Roster'}
                     {mode === 'Chaos_Physics' && 'Physics & Rigid Bodies'}
                     {mode === 'Voxel' && 'Voxel Brushes'}
                     {(mode === 'Select' || mode === 'Blockout') && 'Prefabs / Assets'}
                  </span>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar p-2 grid grid-cols-2 gap-2 content-start">
                  {mode === 'Instance_Override' ? (
                     <>
                        <div className="bg-[#161b22] border border-[#e3b341]/20 rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(227,179,65,0.05)]">
                           <BoxSelect size={20} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center font-bold">SM_Pine_HISM (32K)</span>
                        </div>
                        <div className="bg-[#161b22] border border-[#e3b341]/20 rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer">
                           <Layers size={20} className="text-[#8b949e] mb-1"/>
                           <span className="text-[9px] text-[#8b949e] text-center font-bold">SM_Rock (12K)</span>
                        </div>
                     </>
                  ) : mode === 'Niagara' ? (
                     <>
                        <div className="bg-[#161b22] border border-[#bc8cff]/20 rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(188,140,255,0.05)]">
                           <Zap size={20} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center font-bold">NS_Explosion</span>
                        </div>
                     </>
                  ) : mode === 'World_Partition' ? (
                     <>
                        <div className="bg-[#161b22] border border-[#e3b341]/20 rounded p-2 flex flex-col gap-1 cursor-pointer shadow-[0_0_10px_rgba(227,179,65,0.05)] col-span-2">
                           <span className="text-[10px] text-[#e3b341] font-bold">WP_Main_Grid</span>
                           <span className="text-[9px] text-[#8b949e]">Cell Size: 256m</span>
                           <span className="text-[9px] text-[#8b949e]">Loading Range: 1km</span>
                        </div>
                     </>
                  ) : mode === 'MetaHuman' ? (
                     <>
                        <div className="bg-[#161b22] border border-[#bc8cff]/20 rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer">
                           <PersonStanding size={20} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center font-bold">MH_Ada_V2</span>
                        </div>
                     </>
                  ) : mode === 'Chaos_Physics' ? (
                     <>
                        <div className="bg-[#161b22] border border-[#f85149]/20 rounded p-2 flex flex-col gap-1 cursor-pointer shadow-[0_0_10px_rgba(248,81,73,0.05)] col-span-2">
                           <span className="text-[10px] text-[#f85149] font-bold flex items-center gap-1"><Wind size={10}/> VF_Tornado_01</span>
                        </div>
                     </>
                  ) : mode === 'Voxel' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#e3b341]/50 hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(227,179,65,0.1)] col-span-2">
                           <Box size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center font-bold tracking-wider uppercase">Extrude Block</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#f85149] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer">
                           <Bomb size={24} className="text-[#f85149] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center font-bold tracking-wider uppercase">Carve</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer">
                           <Paintbrush size={24} className="text-[#58a6ff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center font-bold tracking-wider uppercase">Paint Brick</span>
                        </div>
                        <div className="col-span-2 mt-2">
                           <span className="text-[10px] text-[#8b949e] font-bold block mb-1">Brick Material</span>
                           <div className="grid grid-cols-4 gap-1">
                              <div className="w-full bg-[#888] aspect-square rounded-[2px] border-2 border-[#fff] cursor-pointer" title="Stone"></div>
                              <div className="w-full bg-[#5c4033] aspect-square rounded-[2px] border border-[#30363d] cursor-pointer" title="Wood"></div>
                              <div className="w-full bg-[#3fb950] aspect-square rounded-[2px] border border-[#30363d] cursor-pointer" title="Grass"></div>
                              <div className="w-full bg-[#58a6ff] aspect-square rounded-[2px] border border-[#30363d] cursor-pointer" title="Glass"></div>
                              <div className="w-full bg-[#a35e3d] aspect-square rounded-[2px] border border-[#30363d] cursor-pointer" title="Dirt"></div>
                              <div className="w-full bg-[#9c9c9c] aspect-square rounded-[2px] border border-[#30363d] cursor-pointer" title="Concrete"></div>
                              <div className="w-full bg-[#ff7b72] aspect-square rounded-[2px] border border-[#30363d] cursor-pointer" title="Brick"></div>
                              <div className="w-full bg-[#000] aspect-square rounded-[2px] border border-[#30363d] cursor-pointer" title="Obsidian"></div>
                           </div>
                        </div>
                     </>
                  ) : mode === 'Landscape' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#3fb950]/50 hover:border-[#3fb950] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(63,185,80,0.1)] col-span-2">
                           <Mountain size={24} className="text-[#3fb950] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Sculpt Tool</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer">
                           <Paintbrush size={24} className="text-[#58a6ff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Paint Material</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer">
                           <Layers size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Erosion Gen</span>
                        </div>
                     </>
                  ) : mode === 'Foliage' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#3fb950]/50 hover:border-[#3fb950] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(63,185,80,0.1)] col-span-2">
                           <Trees size={24} className="text-[#3fb950] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Foliage Paint Brush</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#3fb950] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer">
                           <Trees size={24} className="text-[#3fb950] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Pine_Tree_01</span>
                           <div className="text-[8px] bg-[#3fb950] text-[#0d1117] px-1 rounded font-bold">ACTIVE</div>
                        </div>
                        <div className="bg-[#0d1117] border border-[#3fb950] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer">
                           <Wind size={24} className="text-[#3fb950] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Grass_Tuft_02</span>
                           <div className="text-[8px] bg-[#3fb950] text-[#0d1117] px-1 rounded font-bold">ACTIVE</div>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer">
                           <Grid size={24} className="text-[#8b949e] mb-1"/>
                           <span className="text-[9px] text-[#8b949e] text-center">Rock_Mossy_Small</span>
                        </div>
                     </>
                  ) : mode === 'Quests' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#e3b341]/50 hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(227,179,65,0.1)] col-span-2">
                           <ScrollText size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Basic Quest Giver</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Flag size={24} className="text-[#58a6ff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Objective Marker</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Box size={24} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Pickup Item (Quest)</span>
                        </div>
                     </>
                  ) : mode === 'Cinematic' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#bc8cff]/50 hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(188,140,255,0.1)] col-span-2">
                           <Video size={24} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Cine Camera Actor</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Camera size={24} className="text-[#8b949e] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Camera Rig Rail</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Camera size={24} className="text-[#8b949e] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Camera Rig Crane</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer col-span-2 mt-2">
                           <Clapperboard size={16} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Open Sequencer / Cutscene Editor</span>
                        </div>
                     </>
                  ) : mode === 'Lighting' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#e3b341]/50 hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(227,179,65,0.1)]">
                           <Sun size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Directional Light</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Lightbulb size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Point Light</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Focus size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Spot Light</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Wind size={24} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Sky Atmosphere</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab col-span-2">
                           <Map size={16} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Post Process Volume</span>
                        </div>
                     </>
                  ) : mode === 'Pathing' ? (
                     <>
                        <div 
                           onClick={() => setSplineType('Path')}
                           className={`bg-[#0d1117] border ${splineType === 'Path' ? 'border-[#3fb950] shadow-[0_0_10px_rgba(63,185,80,0.1)]' : 'border-[#30363d] hover:border-[#3fb950]'} rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer col-span-2`}
                        >
                           <Route size={24} className="text-[#3fb950] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Draw New Patrol Path</span>
                        </div>
                        <div 
                           onClick={() => setSplineType('Road')}
                           className={`bg-[#0d1117] border ${splineType === 'Road' ? 'border-[#e3b341] shadow-[0_0_10px_rgba(227,179,65,0.1)]' : 'border-[#30363d] hover:border-[#e3b341]'} rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer col-span-2`}
                        >
                           <Map size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Draw New Road Spline</span>
                        </div>
                        <div 
                           onClick={() => setSplineType('River')}
                           className={`bg-[#0d1117] border ${splineType === 'River' ? 'border-[#58a6ff] shadow-[0_0_10px_rgba(88,166,255,0.1)]' : 'border-[#30363d] hover:border-[#58a6ff]'} rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer col-span-2`}
                        >
                           <Waves size={24} className="text-[#58a6ff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Draw New River Spline</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Map size={24} className="text-[#58a6ff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Nav Node</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Milestone size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Waypoint Indicator</span>
                        </div>
                     </>
                  ) : mode === 'Volumes' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#f85149]/50 hover:border-[#f85149] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(248,81,73,0.1)] col-span-2">
                           <SquareDashed size={24} className="text-[#f85149] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Invisible Blocking Wall</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <SquareDashed size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Trigger/Spawn Volume</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <SquareDashed size={24} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Kill Z Volume</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(88,166,255,0.1)]">
                           <Wind size={24} className="text-[#58a6ff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Storm Wind (Physics IK)</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(63,185,80,0.1)]">
                           <CloudRain size={24} className="text-[#3fb950] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Water Drag/Submersion</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(227,179,65,0.1)]">
                           <Flame size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Extreme Heat (Bio-Res)</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#7ee787] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(126,231,135,0.1)]">
                           <Snowflake size={24} className="text-[#7ee787] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Ice Slipperiness</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(188,140,255,0.1)]">
                           <Skull size={24} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Toxic Gas (Vision Blur)</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#d29922] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(210,153,34,0.1)]">
                           <Waves size={24} className="text-[#d29922] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Quicksand (Sinking IK)</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(227,179,65,0.1)]">
                           <Activity size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Anti-Gravity Anomaly</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#f85149] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(248,81,73,0.1)]">
                           <Hammer size={24} className="text-[#f85149] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Fragile Surface (Weight Cap)</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(88,166,255,0.1)]">
                           <Zap size={24} className="text-[#58a6ff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Hyper-Magnetic</span>
                        </div>
                     </>
                  ) : mode === 'NPC' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#bc8cff]/50 hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(188,140,255,0.1)]">
                           <PersonStanding size={24} className="text-[#f85149] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Mob_Goblin_01</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#bc8cff]/50 hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(188,140,255,0.1)]">
                           <PersonStanding size={24} className="text-[#f85149] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Mob_Orc_Warrior</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#3fb950]/50 hover:border-[#3fb950] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(63,185,80,0.1)]">
                           <PersonStanding size={24} className="text-[#3fb950] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">NPC_Merchant</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#3fb950]/50 hover:border-[#3fb950] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(63,185,80,0.1)]">
                           <PersonStanding size={24} className="text-[#3fb950] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">NPC_Guard</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#e3b341]/50 hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(227,179,65,0.1)] col-span-2">
                           <Map size={16} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Spawn / Nav Path Node</span>
                        </div>
                     </>
                  ) : mode === 'Physics' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#f85149]/50 hover:border-[#f85149] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(248,81,73,0.1)] col-span-2">
                           <Wind size={24} className="text-[#f85149] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Wind/Force Field Volume</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#f85149] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Box size={24} className="text-[#f85149] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Rigid Body Tool</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#f85149] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Grid size={24} className="text-[#f85149] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Soft Body / Cloth</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#f85149] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab col-span-2">
                           <Layers size={16} className="text-[#f85149] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Fluid / Water Simulation</span>
                        </div>
                     </>
                  ) : mode === 'Destruction' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#e3b341]/50 hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 shadow-[0_0_10px_rgba(227,179,65,0.1)] col-span-2 cursor-pointer">
                           <Hammer size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Fracture Mesh</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Bomb size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Explosion Field</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer">
                           <Package size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Material Health</span>
                        </div>
                     </>
                  ) : mode === 'Chemistry' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#bc8cff]/50 hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(188,140,255,0.1)] col-span-2">
                           <Hexagon size={24} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Material Reactivity Grid</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Sun size={24} className="text-[#f85149] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Flammability Node</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <RefreshCw size={24} className="text-[#3fb950] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Toxicity / Acid Pool</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab col-span-2">
                           <Compass size={16} className="text-[#58a6ff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Conductivity / Electricity</span>
                        </div>
                     </>
                  ) : mode === 'Biology' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#3fb950]/50 hover:border-[#3fb950] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(63,185,80,0.1)] col-span-2">
                           <Trees size={24} className="text-[#3fb950] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Ecosystem Spawner</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Lightbulb size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Growth Cycle Node</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#3fb950] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <PersonStanding size={24} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Predator/Prey Link</span>
                        </div>
                     </>
                  ) : mode === 'Audio' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#58a6ff]/50 hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(88,166,255,0.1)] col-span-2">
                           <Volume2 size={24} className="text-[#58a6ff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center font-bold tracking-wider uppercase">Ambient River / Lava</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Box size={24} className="text-[#58a6ff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Volcano Event Sound</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Activity size={24} className="text-[#58a6ff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Dynamic Reverb</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab col-span-2">
                           <Settings size={16} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center tracking-wider uppercase">100% Audio Master Control</span>
                        </div>
                     </>
                  ) : mode === 'Decals' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#bc8cff]/50 hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(188,140,255,0.1)] col-span-2">
                           <Stamp size={24} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Place Decal (Projection)</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Paintbrush size={24} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Dirt_Splatter_01</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#bc8cff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Hexagon size={24} className="text-[#f85149] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Blood_Pool_03</span>
                        </div>
                     </>
                  ) : mode === 'PCG' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#7ee787]/50 hover:border-[#7ee787] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(126,231,135,0.1)] col-span-2">
                           <Cpu size={24} className="text-[#7ee787] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">PCG Graph / Volume</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#7ee787] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Trees size={24} className="text-[#7ee787] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Rule: Forest Scatter</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#7ee787] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Box size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Rule: City Blocks</span>
                        </div>
                     </>
                  ) : mode === 'Blueprint' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#1f6feb]/50 hover:border-[#1f6feb] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab shadow-[0_0_10px_rgba(31,111,235,0.1)] col-span-2">
                           <Workflow size={24} className="text-[#58a6ff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">New Blueprint Class</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#1f6feb] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Zap size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">BP_Door_Interact</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#1f6feb] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <PersonStanding size={24} className="text-[#3fb950] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">BP_PlayerTrigger</span>
                        </div>
                     </>
                  ) : mode === 'AI_Assist' ? (
                     <>
                        <div className="bg-[#0d1117] border border-[#e3b341]/50 hover:border-[#e3b341] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[0_0_20px_rgba(227,179,65,0.2)] col-span-2 group">
                           <Globe size={24} className="text-[#e3b341] mb-1 group-hover:animate-pulse"/>
                           <span className="text-[9px] text-white font-bold text-center uppercase tracking-wider">100% Real-world Generator</span>
                           <span className="text-[8px] text-[#e3b341] text-center">Auto-Material & Component Separation</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#58a6ff]/50 hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(88,166,255,0.2)] group">
                           <ImageUp size={24} className="text-[#58a6ff] mb-1 group-hover:animate-pulse"/>
                           <span className="text-[9px] text-white font-bold text-center">Image To Blockout</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#58a6ff]/50 hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-pointer group">
                           <Wand2 size={24} className="text-[#e3b341] mb-1 group-hover:animate-pulse"/>
                           <span className="text-[9px] text-white font-bold text-center">Text to Terrain</span>
                        </div>
                     </>
                  ) : (
                     <>
                        <div className="col-span-2 bg-[#21262d]/50 border border-[#30363d] rounded p-1.5 flex items-center justify-center gap-2 mb-1">
                           <Move3D size={12} className="text-[#8b949e]" />
                           <span className="text-[9px] text-[#8b949e]">Drag & Drop to map</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Flag size={24} className="text-[#e3b341] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Location: Camp</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Map size={24} className="text-[#bc8cff] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">POI: Ruined Temple</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Box size={24} className="text-[#8b949e] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Cube_1m</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Box size={24} className="text-[#8b949e] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">Ramp_2x2</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <Trees size={24} className="text-[#3fb950] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">OakTree_01</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e3b341] mb-1"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                           <span className="text-[9px] text-[#c9d1d9] text-center">House_Wood_01</span>
                        </div>
                        <div className="bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded p-2 flex flex-col items-center justify-center gap-1 cursor-grab">
                           <PersonStanding size={24} className="text-[#f85149] mb-1"/>
                           <span className="text-[9px] text-[#c9d1d9] text-center">BP_EnemyRespawn</span>
                        </div>
                     </>
                  )}
               </div>
            </div>
        </div>

        {/* Viewport 3D */}
        <div className="flex-1 bg-gradient-to-t from-[#111] to-[#222] relative flex flex-col overflow-hidden">
            
            <div className="absolute top-2 left-2 flex gap-1 z-10 flex-wrap">
               <button className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-bold text-[#c9d1d9] flex items-center gap-1 hover:bg-[#21262d] transition-colors"><Grid size={12}/> <span className="text-[#58a6ff]">10u</span></button>
               <button className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-bold text-[#c9d1d9] flex items-center gap-1 hover:bg-[#21262d] transition-colors"><RefreshCw size={12}/> <span className="text-[#3fb950]">15°</span></button>
               <button className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-bold text-[#c9d1d9] flex items-center gap-1 hover:bg-[#21262d] transition-colors"><Maximize2 size={12}/> <span className="text-[#e3b341]">0.25</span></button>
               <div className="w-px h-5 bg-[#30363d] mx-0.5 mt-0.5"></div>
               <button className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-bold text-[#c9d1d9] flex items-center gap-1 hover:bg-[#21262d] transition-colors"><Camera size={12}/> Perspective ▼</button>
               <button className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-bold text-[#c9d1d9] flex items-center gap-1 hover:bg-[#21262d] transition-colors"><Compass size={12}/> Lit ▼</button>
               <div className="w-px h-5 bg-[#30363d] mx-0.5 mt-0.5"></div>
               <button className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-bold text-[#8b949e] flex items-center gap-1 hover:text-[#c9d1d9] hover:bg-[#21262d] transition-colors"><Eye size={12}/> Show ▼</button>
               <button className="bg-[#161b22]/80 backdrop-blur border border-[#30363d] px-2 py-1 rounded text-[10px] font-bold text-[#8b949e] flex items-center gap-1 hover:text-[#c9d1d9] hover:bg-[#21262d] transition-colors"><Layers size={12}/> View Layers ▼</button>
            </div>

            <div className="absolute top-2 right-2 flex gap-1 z-10 bg-[#161b22]/80 backdrop-blur border border-[#30363d] rounded p-1">
               <div className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-[#21262d] rounded" title="Translate (W)"><Move3D size={14} className="text-[#8b949e]"/></div>
               <div className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-[#21262d] rounded bg-[#21262d]" title="Rotate (E)"><RefreshCw size={14} className="text-[#58a6ff]"/></div>
               <div className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-[#21262d] rounded" title="Scale (R)"><Maximize2 size={14} className="text-[#8b949e]"/></div>
               <div className="w-px h-4 bg-[#30363d] mx-0.5 self-center"></div>
               <div className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-[#21262d] rounded" title="Local / World Space"><Layers size={14} className="text-[#8b949e]"/></div>
            </div>

            {/* Performance Monitor */}
            {!isPerfMinimized && (
               <div 
                  className="absolute z-40 bg-[#161b22]/90 backdrop-blur-md border border-[#30363d] rounded-lg shadow-lg w-56 flex flex-col overflow-hidden transition-shadow hover:shadow-[0_0_15px_rgba(88,166,255,0.15)]"
                  style={{ top: perfPos.y, left: perfPos.x }}
               >
                  {/* Drag Handle & Header */}
                  <div 
                     className="bg-[#21262d] p-1.5 flex items-center justify-between cursor-move"
                     onMouseDown={(e) => setIsPerfDragging({ startX: e.clientX, startY: e.clientY, initialX: perfPos.x, initialY: perfPos.y })}
                  >
                     <div className="flex items-center gap-1.5 text-[#8b949e]">
                        <GripHorizontal size={12}/>
                        <span className="text-[10px] font-bold text-[#c9d1d9] uppercase tracking-wide">System Metrics</span>
                     </div>
                     <button 
                        onClick={() => setIsPerfMinimized(true)} 
                        className="text-[#8b949e] hover:text-white p-0.5 rounded hover:bg-[#30363d]"
                     >
                        <Minimize2 size={10} />
                     </button>
                  </div>
                  {/* Metrics Body */}
                  <div className="p-2 flex flex-col gap-2">
                     <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-end">
                           <span className="text-[9px] text-[#8b949e] flex items-center gap-1"><Cpu size={10}/> CPU</span>
                           <span className="text-[10px] font-mono font-bold text-[#7ee787]">18%</span>
                        </div>
                        <div className="h-1 bg-[#0d1117] rounded-full overflow-hidden">
                           <div className="h-full bg-[#7ee787] w-[18%]"></div>
                        </div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-end">
                           <span className="text-[9px] text-[#8b949e] flex items-center gap-1"><Database size={10}/> RAM</span>
                           <span className="text-[10px] font-mono font-bold text-[#e3b341]">4.2<span className="text-[8px] text-[#8b949e]">/16GB</span></span>
                        </div>
                        <div className="h-1 bg-[#0d1117] rounded-full overflow-hidden">
                           <div className="h-full bg-[#e3b341] w-[26%]"></div>
                        </div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-end">
                           <span className="text-[9px] text-[#8b949e] flex items-center gap-1"><MonitorPlay size={10}/> GPU</span>
                           <span className="text-[10px] font-mono font-bold text-[#58a6ff]">65%</span>
                        </div>
                        <div className="h-1 bg-[#0d1117] rounded-full overflow-hidden">
                           <div className="h-full bg-[#58a6ff] w-[65%]"></div>
                        </div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-end">
                           <span className="text-[9px] text-[#8b949e] flex items-center gap-1"><Brain size={10}/> TPU <span className="text-[7px] bg-[#3fb950]/20 text-[#3fb950] px-1 rounded">AI</span></span>
                           <span className="text-[10px] font-mono font-bold text-[#bc8cff]">89%</span>
                        </div>
                        <div className="h-1 bg-[#0d1117] rounded-full overflow-hidden">
                           <div className="h-full bg-[#bc8cff] w-[89%]"></div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Mock 3D Grid & Gizmo */}
            <div className="absolute inset-0 pointer-events-none perspective-[1000px] flex items-center justify-center">
               
               <div className="w-full h-full absolute" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px', transform: 'rotateX(75deg) scale(3) translateY(-100px)' }}></div>
               
               {mode === 'Select' ? (
                 <>
                   {/* Instance Override Active Visual */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ transform: 'rotateX(75deg) scale(3) translateY(-100px) translateX(0px)' }}>
                     <div className="relative w-16 h-16 border-2 border-[#bc8cff] bg-[#bc8cff]/10 group shadow-[0_0_20px_rgba(188,140,255,0.3)]">
                        <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#bc8cff] rounded-full flex items-center justify-center text-[#0d1117] animate-pulse">
                           <Wand2 size={10} />
                        </div>
                        <div className="text-[#bc8cff] font-bold text-[4px] transform -rotate-x-[75deg] whitespace-nowrap absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#0d1117]/80 px-1 border border-[#bc8cff]/50 rounded">OVERRIDDEN: SM_Wall_02</div>
                     </div>
                   </div>

                   {/* Gizmo Mock */}
                   <div className="absolute w-20 h-20 -translate-x-0 translate-y-10">
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f85149]"></div>
                      <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#58a6ff]"></div>
                      <div className="absolute bottom-0 left-0 w-[2px] h-10 bg-[#3fb950] origin-bottom -rotate-45"></div>
                   </div>
                 </>
               ) : mode === 'Pathing' ? (
               <div 
                 className="absolute inset-0 w-full h-full"
                 onDoubleClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    // Basic approx coordinate projection onto the 3D-angled plane
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setSplineNodes([...splineNodes, { id: Date.now(), x, y }]);
                 }}
               >
                 <svg className="absolute inset-0 w-full h-full overflow-visible" style={{ transform: 'rotateX(75deg) scale(3) translateY(-100px)' }}>
                   {splineNodes.length > 1 && (
                     <path 
                       d={generateSplineCurve(splineNodes)} 
                       fill="none" 
                       stroke={splineType === 'River' ? '#58a6ff' : splineType === 'Road' ? '#e3b341' : '#3fb950'} 
                       strokeWidth={splineType === 'River' ? '4' : splineType === 'Road' ? '3' : '2'}
                       strokeDasharray={splineType === 'Path' ? "5,5" : "none"} 
                       className={splineType === 'Path' ? "animate-[dash_2s_linear_infinite]" : ""} 
                     />
                   )}
                   {splineNodes.map((n, i) => (
                     <circle 
                       key={n.id}
                       cx={`${n.x}%`} 
                       cy={`${n.y}%`} 
                       r={splineType === 'Path' ? '2' : '3'}
                       fill={activeSplineNode === i ? "#fff" : (splineType === 'River' ? '#58a6ff' : splineType === 'Road' ? '#e3b341' : '#3fb950')} 
                       className={`cursor-pointer ${activeSplineNode === i ? 'animate-pulse' : ''}`}
                       onDoubleClick={(e) => e.stopPropagation()}
                       onMouseDown={(e) => {
                         e.stopPropagation();
                         setActiveSplineNode(i);
                         setIsNodeDragging({ id: n.id, startX: e.clientX, startY: e.clientY, initialX: n.x, initialY: n.y });
                       }}
                     />
                   ))}
                 </svg>
                 
                 {activeSplineNode !== null && splineNodes[activeSplineNode] && (
                     <div 
                       className="absolute w-8 h-8 rounded border border-[#e3b341] bg-[#e3b341]/20 flex items-center justify-center shadow-[0_0_15px_rgba(227,179,65,0.4)] pointer-events-none"
                       style={{
                         left: `calc(50% + ${(splineNodes[activeSplineNode].x - 50) * 3}%)`,
                         top: `calc(50% + ${(splineNodes[activeSplineNode].y - 50) * 0.5}% - 60px)`, // Rough projection
                       }}
                     >
                        <div className="text-[#e3b341] font-bold text-[8px] whitespace-nowrap -translate-y-6 bg-[#0d1117]/80 px-1 rounded absolute border border-[#e3b341]/50">Nav Node {activeSplineNode}</div>
                     </div>
                 )}
               </div>
               ) : mode === 'Instance_Override' ? (
               <>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className="relative w-64 h-64 border border-[#e3b341]/20 rounded-full flex items-center justify-center" style={{ transform: 'rotateX(60deg)' }}>
                       <div className="absolute top-4 left-4 w-4 h-4 bg-[#e3b341] rounded opacity-80 shadow-[0_0_10px_#e3b341]"></div>
                       <div className="absolute top-12 left-20 w-4 h-4 bg-[#f85149] rounded opacity-80 shadow-[0_0_10px_#f85149] scale-150 rotate-45"></div>
                       <div className="absolute bottom-10 left-10 w-4 h-4 bg-[#3fb950] rounded opacity-80 shadow-[0_0_10px_#3fb950] scale-50"></div>
                       <div className="absolute bottom-20 right-10 w-4 h-4 bg-[#e3b341] rounded opacity-80 shadow-[0_0_10px_#e3b341] rotate-12"></div>
                       <div className="absolute top-20 right-20 w-4 h-4 bg-[#e3b341] rounded opacity-80 shadow-[0_0_10px_#e3b341] scale-125"></div>
                       
                       {/* Override Selection Gizmo */}
                       <div className="absolute top-12 left-20 w-10 h-10 border-2 border-dashed border-[#58a6ff] rounded animate-[spin_4s_linear_infinite]"></div>
                    </div>
                 </div>
                 <div className="absolute left-6 bottom-6 text-[#8b949e] font-mono text-[10px]">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#e3b341] rounded-sm"></div> Default Instance</div>
                    <div className="flex items-center gap-2 mt-1"><div className="w-2 h-2 bg-[#f85149] rounded-sm"></div> Overridden Instance</div>
                 </div>
               </>
               ) : mode === 'World_Partition' ? (
               <>
                 <div className="absolute inset-0 bg-[#0d1117]/80 flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)', backgroundSize: '100px 100px' }}>
                    <div className="relative w-full h-full flex flex-wrap justify-center items-center gap-[2px]">
                       {Array.from({length: 48}).map((_, i) => (
                           <div key={i} className={`w-[98px] h-[98px] border border-[#58a6ff]/30 ${i % 7 === 0 ? 'bg-[#3fb950]/20 border-[#3fb950]' : i % 5 === 0 ? 'bg-[#58a6ff]/10' : 'bg-transparent'} flex items-center justify-center text-[10px] font-mono text-[#8b949e]`}>
                              LID_{i}
                           </div>
                       ))}
                    </div>
                 </div>
               </>
               ) : mode === 'Niagara' ? (
               <>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <div className="relative">
                       <Zap size={64} className="text-[#bc8cff] animate-pulse" />
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#bc8cff]/50 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    </div>
                 </div>
               </>
               ) : mode === 'Chaos_Physics' ? (
               <>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                    <div className="relative w-48 h-48 border border-[#f85149]/30 rounded-lg flex items-center justify-center overflow-hidden">
                       <div className="absolute w-12 h-12 bg-[#f85149] rounded rotate-12 top-4 left-4 blur-sm opacity-50"></div>
                       <div className="absolute w-8 h-8 bg-[#f85149] rounded-full bottom-12 right-12 blur-[2px] opacity-70"></div>
                       <div className="absolute w-full h-full border border-[#f85149]/50 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, #f8514920 100%)' }}></div>
                    </div>
                 </div>
               </>
               ) : mode === 'MetaHuman' ? (
               <>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <PersonStanding size={200} className="text-[#bc8cff]" />
                 </div>
               </>
               ) : mode === 'Voxel' ? (
               <>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none" style={{ transform: 'rotateX(60deg) rotateZ(45deg) scale(2) translateY(-50px)' }}>
                    {/* Fake Voxel Grid Structure */}
                    <div className="relative w-32 h-32">
                       {/* Layer 1 Example Boxes */}
                       <div className="absolute top-[0px] left-[0px] w-8 h-8 bg-[#888] border border-[#a0a0a0]"></div>
                       <div className="absolute top-[0px] left-[32px] w-8 h-8 bg-[#888] border border-[#a0a0a0]"></div>
                       <div className="absolute top-[32px] left-[0px] w-8 h-8 bg-[#888] border border-[#a0a0a0]"></div>
                       {/* Layer 2 Hovering Box */}
                       <div className="absolute top-[0px] left-[0px] w-8 h-8 bg-[#58a6ff]/80 border-2 border-[#58a6ff] -translate-x-2 -translate-y-2 shadow-[0_10px_20px_rgba(0,0,0,0.5)]"></div>
                    </div>
                 </div>
                 
                 <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[#0d1117]/80 backdrop-blur border border-[#30363d] px-4 py-2 rounded-lg text-center flex flex-col gap-1 items-center pointer-events-none drop-shadow-lg">
                    <span className="text-white text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"><Grid size={12} className="text-[#e3b341]"/>Voxel Building Mode Active</span>
                    <span className="text-[#8b949e] text-[10px]">LMB: Place Block · RMB: Delete Block · MouseWheel: Change Layer Height</span>
                 </div>
               </>
               ) : mode === 'Volumes' ? (
               <>
                 {/* Auto-Fit Demonstration: Outline of a model inside the volume */}
                 <div className="w-48 h-20 border border-[#58a6ff]/50 absolute rotate-x-[75deg] -translate-x-12 translate-y-6 bg-[#58a6ff]/10"></div>
                 <div className="text-[#58a6ff] font-bold text-[8px] transform -rotate-x-[75deg] whitespace-nowrap absolute translate-x-0 translate-y-5">Selected Mesh</div>

                 <div className="w-64 h-32 border-2 border-[#f85149] bg-[#f85149]/10 absolute rotate-x-[75deg] -translate-x-20 translate-y-0 shadow-[inset_0_0_30px_rgba(248,81,73,0.2)]">
                    <div className="text-[#f85149] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/80 px-2 py-0.5 rounded absolute -top-8 left-1/2 -translate-x-1/2 border border-[#f85149]/50">BlockingVolume_Wall</div>
                    
                    {/* Resize Handles */}
                    <div className="absolute top-[-4px] left-[-4px] w-2 h-2 bg-white border border-[#f85149] cursor-nwse-resize shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute top-[-4px] right-[-4px] w-2 h-2 bg-white border border-[#f85149] cursor-nesw-resize shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute bottom-[-4px] left-[-4px] w-2 h-2 bg-white border border-[#f85149] cursor-nesw-resize shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute bottom-[-4px] right-[-4px] w-2 h-2 bg-white border border-[#f85149] cursor-nwse-resize shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute top-1/2 left-[-4px] -translate-y-1/2 w-2 h-2 bg-white border border-[#f85149] cursor-ew-resize shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute top-1/2 right-[-4px] -translate-y-1/2 w-2 h-2 bg-white border border-[#f85149] cursor-ew-resize shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white border border-[#f85149] cursor-ns-resize shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white border border-[#f85149] cursor-ns-resize shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                 </div>
                 
                 <div className="w-40 h-40 border-2 border-dashed border-[#e3b341] bg-[#e3b341]/5 absolute rotate-x-[75deg] translate-x-32 translate-y-10 shadow-[inset_0_0_20px_rgba(227,179,65,0.1)]">
                    <div className="text-[#e3b341] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/80 px-2 py-0.5 rounded absolute -top-8 left-1/2 -translate-x-1/2 border border-[#e3b341]/50">Trigger_SpawnAmbush</div>
                 </div>
                 
                 <div className="w-48 h-32 border-2 border-[#58a6ff] bg-[#58a6ff]/10 absolute rotate-x-[75deg] -translate-x-32 -translate-y-40 shadow-[inset_0_0_30px_rgba(88,166,255,0.2)]">
                    <div className="text-[#58a6ff] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/80 px-2 py-0.5 rounded absolute -top-8 left-1/2 -translate-x-1/2 border border-[#58a6ff]/50 flex items-center gap-1"><Wind size={10}/> Env_HurricaneForce</div>
                    <svg className="w-full h-full opacity-50 relative z-10 overflow-visible"><path d="M 20 20 Q 50 10 80 20" stroke="#58a6ff" strokeWidth="2" fill="none" className="animate-[dash_1s_linear_infinite]" strokeDasharray="4,4"/><path d="M 20 60 Q 50 50 80 60" stroke="#58a6ff" strokeWidth="2" fill="none" className="animate-[dash_1s_linear_infinite]" strokeDasharray="4,4"/></svg>
                 </div>
                 
                 <div className="w-56 h-48 border-2 border-[#3fb950] bg-[#3fb950]/20 absolute rotate-x-[75deg] translate-x-10 -translate-y-20 shadow-[inset_0_0_40px_rgba(63,185,80,0.3)] backdrop-blur-[2px]">
                    <div className="text-[#3fb950] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/80 px-2 py-0.5 rounded absolute -top-8 left-1/2 -translate-x-1/2 border border-[#3fb950]/50 flex items-center gap-1"><CloudRain size={10}/> Env_DeepWaterLake</div>
                 </div>

                 <div className="w-40 h-40 border-2 border-dashed border-[#e3b341] bg-[#e3b341]/10 absolute rotate-x-[75deg] -translate-x-60 translate-y-10 shadow-[inset_0_0_50px_rgba(227,179,65,0.3)]">
                    <div className="text-[#e3b341] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/90 px-2 py-0.5 rounded absolute -top-8 left-1/2 -translate-x-1/2 border border-[#e3b341]/50 flex items-center gap-1"><Flame size={10} className="animate-pulse text-[#f85149]"/> Env_VolcanoHeat (AI Gen)</div>
                    <svg className="w-full h-full opacity-30 relative z-10 overflow-visible"><circle cx="80" cy="80" r="50" stroke="#e3b341" strokeWidth="1" fill="none" className="animate-ping"/></svg>
                 </div>

                 <div className="w-32 h-32 border-2 border-[#bc8cff] bg-[#bc8cff]/10 absolute rotate-x-[75deg] translate-x-60 -translate-y-30 shadow-[inset_0_0_50px_rgba(188,140,255,0.3)]">
                    <div className="text-[#bc8cff] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/90 px-2 py-0.5 rounded absolute -top-8 left-1/2 -translate-x-1/2 border border-[#bc8cff]/50 flex items-center gap-1"><Skull size={10} className="animate-bounce text-[#bc8cff]"/> Env_ToxicSwamp</div>
                    <div className="absolute w-full h-full inset-0 bg-[#bc8cff]/5 mix-blend-screen animate-pulse"></div>
                 </div>

                 <div className="w-24 h-24 border-2 border-dashed border-[#d29922] bg-[#d29922]/20 absolute rotate-x-[75deg] translate-x-40 translate-y-40 shadow-[inset_0_0_30px_rgba(210,153,34,0.4)]">
                    <div className="text-[#d29922] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/90 px-2 py-0.5 rounded absolute -top-8 left-1/2 -translate-x-1/2 border border-[#d29922]/50 flex items-center gap-1"><Waves size={10}/> Hazard_Quicksand</div>
                 </div>

                 <div className="w-48 h-48 border border-[#e3b341] bg-[#e3b341]/5 absolute rotate-x-[75deg] -translate-x-20 -translate-y-40 shadow-[inset_0_0_60px_rgba(227,179,65,0.15)] rounded-full">
                    <div className="text-[#e3b341] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/90 px-2 py-0.5 rounded absolute -top-10 left-1/2 -translate-x-1/2 border border-[#e3b341]/50 flex items-center gap-1"><Activity size={10} className="animate-pulse text-[#e3b341]"/> Anomaly_AntiGravity</div>
                    <div className="absolute inset-0 bg-[#e3b341]/20 mix-blend-screen animate-spin rounded-full blur-[2px]" style={{ animationDuration: '4s' }}></div>
                 </div>

                 <div className="w-32 h-64 border-2 border-dashed border-[#58a6ff] bg-[#58a6ff]/10 absolute rotate-x-[75deg] translate-x-64 -translate-y-10 shadow-[inner_0_0_20px_rgba(88,166,255,0.3)]">
                    <div className="text-[#58a6ff] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/90 px-2 py-0.5 rounded absolute -top-8 left-1/2 -translate-x-1/2 border border-[#58a6ff]/50 flex items-center gap-1"><Zap size={10} className="text-[#58a6ff]"/> Magnetic Field</div>
                 </div>

                 <div className="w-32 h-32 border-2 border-[#7ee787] bg-[#7ee787]/20 absolute rotate-x-[75deg] translate-x-20 translate-y-30 shadow-[inset_0_0_40px_rgba(126,231,135,0.4)]">
                    <div className="text-[#7ee787] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/90 px-2 py-0.5 rounded absolute -top-8 left-1/2 -translate-x-1/2 border border-[#7ee787]/50 flex items-center gap-1"><Activity size={10} className="animate-pulse text-[#7ee787]"/> Radiation_Gamma</div>
                 </div>

                 {/* Gizmo Mock on Blocking Volume */}
                 <div className="absolute w-20 h-20 -translate-x-20 translate-y-0">
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f85149]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#58a6ff]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-10 bg-[#3fb950] origin-bottom -rotate-45"></div>
                 </div>
               </>
               ) : mode === 'Landscape' ? (
               <>
                 <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#3fb950] overflow-visible" style={{ transform: 'rotateX(75deg) scale(3) translateY(-100px)' }}>
                   <circle cx="50%" cy="50%" r="40" fill="none" strokeWidth="1" strokeDasharray="2,2" className="animate-[spin_4s_linear_infinite] opacity-50" />
                   <circle cx="50%" cy="50%" r="20" fill="#3fb950" className="opacity-10" />
                 </svg>
                 <div className="absolute w-32 h-32 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3fb950]/30 to-transparent rotate-x-[75deg] -translate-x-10 translate-y-10 filter blur-xl"></div>
                 <div className="text-[#3fb950] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap -translate-y-20 bg-[#0d1117]/80 px-2 py-0.5 rounded border border-[#3fb950]/50 absolute top-1/2 left-1/2 flex items-center gap-2"><Mountain size={12}/> Brush: Raise <span className="opacity-50">Radius: 800</span></div>
               </>
               ) : mode === 'Foliage' ? (
               <>
                 <div className="absolute w-4 h-12 bg-none border-l-2 border-b-2 border-dashed border-[#3fb950] rotate-x-[75deg] -translate-x-10 translate-y-10"></div>
                 <div className="absolute w-4 h-10 bg-none border-l-2 border-b-2 border-dashed border-[#3fb950] rotate-x-[75deg] translate-x-20 translate-y-32"></div>
                 <div className="absolute w-4 h-8 bg-none border-l-2 border-b-2 border-dashed border-[#3fb950] rotate-x-[75deg] -translate-x-32 -translate-y-10"></div>
                 
                 <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#3fb950] overflow-visible opacity-30" style={{ transform: 'rotateX(75deg) scale(3) translateY(-100px)' }}>
                   <circle cx="50%" cy="50%" r="60" fill="none" strokeWidth="1" />
                 </svg>
               </>
               ) : mode === 'Quests' ? (
               <>
                 <div className="w-8 h-8 rounded-full border-2 border-[#e3b341] bg-[#e3b341]/20 absolute rotate-x-[75deg] -translate-x-10 translate-y-10 shadow-[0_0_20px_rgba(227,179,65,0.5)] shadow-inner flex items-center justify-center">
                    <div className="text-[#e3b341] font-bold text-[8px] transform -rotate-x-[75deg] whitespace-nowrap -translate-y-10 absolute bg-[#0d1117]/80 px-1 rounded border border-[#e3b341]/50 flex flex-col items-center">
                       <span className="text-[14px]">!</span>
                       <span className="font-mono mt-0.5">Quest_ReturnAmulet</span>
                    </div>
                    <div className="w-1 h-3 bg-[#e3b341] absolute bottom-1/2 left-1/2 -mb-1.5 -ml-0.5"></div>
                 </div>

                 {/* Gizmo Mock on Quest Object */}
                 <div className="absolute w-20 h-20 -translate-x-4 translate-y-12">
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f85149]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#58a6ff]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-10 bg-[#3fb950] origin-bottom -rotate-45"></div>
                 </div>
               </>
               ) : mode === 'Cinematic' ? (
               <>
                 <div className="w-12 h-8 border-2 border-[#bc8cff] bg-[#bc8cff]/20 absolute rotate-x-[75deg] -translate-x-20 translate-y-20 shadow-[0_0_20px_rgba(188,140,255,0.5)] shadow-inner flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-[#bc8cff] rounded-full absolute -top-4"></div>
                    <div className="text-[#bc8cff] font-bold text-[8px] transform -rotate-x-[75deg] whitespace-nowrap -translate-y-12 absolute bg-[#0d1117]/80 px-1 rounded border border-[#bc8cff]/50">Cam_IntroSweep</div>
                 </div>
                 
                 {/* Camera view frustum mock */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#bc8cff] overflow-visible opacity-50" style={{ transform: 'rotateX(75deg) scale(3) translateY(-100px)' }}>
                   <path d="M 45% 65% L 40% 75%" fill="none" strokeWidth="0.5" />
                   <path d="M 45% 65% L 55% 70%" fill="none" strokeWidth="0.5" />
                   <path d="M 40% 75% L 55% 70%" fill="none" strokeWidth="0.5" strokeDasharray="2,2"/>
                 </svg>

                 {/* Gizmo Mock on Camera */}
                 <div className="absolute w-20 h-20 -translate-x-12 translate-y-16">
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f85149]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#58a6ff]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-10 bg-[#3fb950] origin-bottom -rotate-45"></div>
                 </div>
               </>
               ) : mode === 'Lighting' ? (
               <>
                 <div className="w-8 h-8 rounded-full border-2 border-[#e3b341] bg-[#e3b341]/20 absolute rotate-x-[75deg] -translate-x-10 translate-y-10 shadow-[0_0_40px_rgba(227,179,65,0.8)] shadow-inner flex items-center justify-center">
                    <div className="text-[#e3b341] font-bold text-[8px] transform -rotate-x-[75deg] whitespace-nowrap -translate-y-8 absolute bg-[#0d1117]/80 px-1 rounded border border-[#e3b341]/50 flex items-center gap-1">
                        <Sun size={10} className="inline"/>DirectionalLight_Sun
                    </div>
                 </div>

                 {/* Light Rays */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#e3b341] overflow-visible opacity-20" style={{ transform: 'rotateX(75deg) scale(3) translateY(-100px)' }}>
                    <path d="M 45% 55% L 60% 80%" fill="none" strokeWidth="1" strokeDasharray="3,3" />
                    <path d="M 45% 55% L 30% 90%" fill="none" strokeWidth="1" strokeDasharray="3,3" />
                    <path d="M 45% 55% L 70% 30%" fill="none" strokeWidth="1" strokeDasharray="3,3" />
                 </svg>
                 
                 {/* Gizmo Mock on Light */}
                 <div className="absolute w-20 h-20 -translate-x-4 translate-y-12">
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f85149]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#58a6ff]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-10 bg-[#3fb950] origin-bottom -rotate-45"></div>
                 </div>
               </>
               ) : mode === 'Physics' ? (
               <>
                 {/* Physics Field Mock */}
                 <div className="w-48 h-48 border-2 border-[#f85149] bg-[#f85149]/5 absolute rotate-x-[75deg] translate-x-10 translate-y-20 shadow-[inset_0_0_40px_rgba(248,81,73,0.2)]"></div>
                 <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#f85149] overflow-visible opacity-50" style={{ transform: 'rotateX(75deg) scale(3) translateY(-100px)' }}>
                   <path d="M 45% 60% Q 50% 50% 65% 55%" fill="none" strokeWidth="1" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]" />
                   <path d="M 40% 70% Q 50% 60% 60% 65%" fill="none" strokeWidth="1" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]" />
                   <path d="M 50% 55% Q 60% 45% 70% 50%" fill="none" strokeWidth="1" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]" />
                 </svg>
                 <div className="text-[#f85149] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/80 px-2 py-0.5 rounded border border-[#f85149]/50 absolute translate-x-10 translate-y-10">ForceField_Tornado</div>
                 <div className="absolute w-10 h-10 -translate-x-10 translate-y-32 bg-[#e3b341]/80 rounded filter blur-sm shadow-[0_0_20px_#e3b341]"></div>
               </>
               ) : mode === 'Destruction' ? (
               <>
                 <div className="w-40 h-40 border border-[#e3b341]/50 absolute rotate-x-[75deg] translate-x-5 translate-y-5 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#e3b341]/10"></div>
                 </div>
                 {/* Voronoi / Fracture Pattern Mock inside a bounding box */}
                 <svg className="absolute w-40 h-40 overflow-visible pointer-events-none" style={{ transform: 'rotateX(75deg) scale(1) translateX(5px) translateY(5px)' }}>
                    <path d="M 10 10 L 50 20 L 40 60 Z" fill="none" stroke="#e3b341" strokeWidth="2" />
                    <path d="M 50 20 L 90 10 L 80 50 Z" fill="none" stroke="#e3b341" strokeWidth="2" />
                    <path d="M 40 60 L 80 50 L 70 90 L 30 80 Z" fill="rgba(227, 179, 65, 0.2)" stroke="#e3b341" strokeWidth="2" />
                    <path d="M 80 50 L 120 40 L 110 80 Z" fill="none" stroke="#e3b341" strokeWidth="2" />
                    <path d="M 10 10 L 30 80 L 0 70 Z" fill="none" stroke="#e3b341" strokeWidth="2" />
                    <circle cx="55" cy="70" r="4" fill="#e3b341" />
                 </svg>
                 <div className="text-[#e3b341] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/80 px-2 py-0.5 rounded border border-[#e3b341]/50 absolute translate-x-10 -translate-y-5 flex items-center gap-1">
                    <Hammer size={10} /> SM_Wall_01 (Voronoi: 12 Chunks)
                 </div>
               </>
               ) : mode === 'Chemistry' ? (
               <>
                 {/* Chemistry Reaction Mock */}
                 <div className="w-56 h-56 absolute rotate-x-[75deg] -translate-x-10 translate-y-20" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(188, 140, 255, 0.2) 0%, transparent 70%)' }}></div>
                 <div className="absolute w-20 h-20 rotate-x-[75deg] -translate-x-5 translate-y-25 border border-[#bc8cff] bg-[#bc8cff]/10 animate-pulse flex items-center justify-center">
                    <span className="text-[#bc8cff] font-bold text-[12px] transform -rotate-x-[75deg]">H2O + Na</span>
                 </div>
                 <div className="absolute w-8 h-8 -translate-x-10 translate-y-10 bg-[#f85149]/80 rounded-full filter blur shadow-[0_0_30px_#f85149] animate-bounce"></div>
                 <div className="absolute w-8 h-8 -translate-x-0 translate-y-20 bg-[#f85149]/80 rounded-full filter blur shadow-[0_0_30px_#f85149] animate-bounce delay-100"></div>
                 <div className="absolute w-8 h-8 -translate-x-20 translate-y-15 bg-[#f85149]/80 rounded-full filter blur shadow-[0_0_30px_#f85149] animate-bounce delay-200"></div>
               </>
               ) : mode === 'Biology' ? (
               <>
                 {/* Biology Ecosystem Mock */}
                 <div className="w-64 h-64 border border-[#3fb950] border-dashed rounded-full absolute rotate-x-[75deg] -translate-x-10 translate-y-10 shadow-[inset_0_0_40px_rgba(63,185,80,0.1)]"></div>
                 <div className="text-[#3fb950] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/80 px-2 py-0.5 rounded border border-[#3fb950]/50 absolute -translate-x-10 translate-y-0">EcoZone_Forest_01</div>
                 
                 <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#3fb950]" style={{ transform: 'rotateX(75deg) scale(3) translateY(-100px)' }}>
                   <circle cx="45%" cy="55%" r="2" fill="#3fb950" className="animate-ping" />
                   <circle cx="55%" cy="60%" r="2" fill="#3fb950" className="animate-ping delay-100" />
                   <circle cx="50%" cy="45%" r="2" fill="#3fb950" className="animate-ping delay-200" />
                   <circle cx="40%" cy="40%" r="2" fill="#f85149" className="animate-pulse" /> {/* Predator */}
                   <path d="M 40% 40% L 45% 55%" fill="none" strokeWidth="0.5" strokeDasharray="2,2" stroke="#f85149" className="opacity-50" />
                 </svg>
               </>
               ) : mode === 'Audio' ? (
               <>
                 {/* Audio Area Mock */}
                 <div className="w-8 h-8 rounded-full border-2 border-[#58a6ff] bg-[#58a6ff]/20 absolute rotate-x-[75deg] -translate-x-10 translate-y-10 shadow-[0_0_20px_rgba(88,166,255,0.5)] shadow-inner flex items-center justify-center">
                    <div className="text-[#58a6ff] font-bold text-[8px] transform -rotate-x-[75deg] whitespace-nowrap -translate-y-8 absolute bg-[#0d1117]/80 px-1 rounded border border-[#58a6ff]/50">Ambient_Wind_01</div>
                    <div className="w-1 h-2 bg-[#58a6ff] absolute bottom-1/2 left-1/2 -mb-1 -ml-0.5"></div>
                 </div>
                 {/* Sound Radius */}
                 <div className="w-48 h-48 rounded-full border border-[#58a6ff]/30 absolute rotate-x-[75deg] -translate-x-30 -translate-y-10 animate-ping" style={{ animationDuration: '3s' }}></div>
                 <div className="w-32 h-32 rounded-full border border-[#58a6ff]/50 absolute rotate-x-[75deg] -translate-x-22 -translate-y-2"></div>
               </>
               ) : mode === 'Decals' ? (
               <>
                 {/* Decal Projection Mock */}
                 <div className="w-24 h-24 border-2 border-[#bc8cff] absolute rotate-x-[75deg] -translate-x-10 translate-y-10 shadow-[inset_0_0_20px_rgba(188,140,255,0.3)] bg-gradient-to-br from-[#bc8cff]/20 to-transparent"></div>
                 <div className="text-[#bc8cff] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap -translate-y-20 absolute bg-[#0d1117]/80 px-2 py-0.5 rounded border border-[#bc8cff]/50 absolute top-1/2 left-1/2 flex items-center gap-2">Decal_BurnMark</div>
                 {/* Decal Gizmo */}
                 <div className="absolute w-20 h-20 -translate-x-20 translate-y-16">
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f85149]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#58a6ff]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-10 bg-[#3fb950] origin-bottom -rotate-45"></div>
                 </div>
               </>
               ) : mode === 'PCG' ? (
               <>
                 {/* Procedural Grid Mock */}
                 <div className="w-64 h-64 border-2 border-[#7ee787] border-dashed absolute rotate-x-[75deg] -translate-x-10 translate-y-10 bg-[#7ee787]/5" style={{ backgroundImage: 'radial-gradient(circle, #7ee787 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundPosition: 'center' }}></div>
                 <div className="text-[#7ee787] font-bold text-[10px] transform -rotate-x-[75deg] whitespace-nowrap bg-[#0d1117]/80 px-2 py-0.5 rounded border border-[#7ee787]/50 absolute -translate-x-10 translate-y-0">PCG_Volume_Forest</div>
                 <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'rotateX(75deg) scale(3) translateY(-100px)' }}>
                   <rect x="40%" y="45%" width="4" height="4" fill="#3fb950" className="opacity-80" />
                   <rect x="50%" y="55%" width="4" height="4" fill="#3fb950" className="opacity-80" />
                   <rect x="55%" y="40%" width="4" height="4" fill="#3fb950" className="opacity-80" />
                   <circle cx="45%" cy="60%" r="2" fill="#8b949e" /> {/* Rock */}
                 </svg>
               </>
               ) : mode === 'Blueprint' ? (
               <>
                 {/* Blueprint Logic Grid Mock */}
                 <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #30363d 1px, transparent 1px)', backgroundSize: '30px 30px', backgroundPosition: 'center', opacity: 0.5 }}></div>
                 
                 <div className="absolute top-1/2 left-1/2 -translate-x-32 -translate-y-20 bg-[#0d1117] border-2 border-[#1f6feb] rounded shadow-[0_0_15px_rgba(31,111,235,0.2)] flex flex-col w-40 z-20 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#1f6feb] to-[#0d1117] px-2 py-1 flex items-center justify-between">
                       <span className="text-white text-[10px] font-bold">Event BeginPlay</span>
                       <Play size={10} className="text-white opacity-80" />
                    </div>
                    <div className="p-2 flex flex-col gap-2">
                       <div className="flex justify-end pr-1">
                          <div className="w-2 h-2 rounded-full border border-white bg-transparent relative">
                             <div className="absolute top-1/2 left-2 w-16 h-px bg-white/50"></div>
                          </div>
                          <span className="text-[8px] ml-4 font-mono text-[#c9d1d9]">Exec</span>
                       </div>
                    </div>
                 </div>

                 <div className="absolute top-1/2 left-1/2 translate-x-10 translate-y-10 bg-[#0d1117] border-2 border-[#3fb950] rounded shadow-[0_0_15px_rgba(63,185,80,0.2)] flex flex-col w-48 z-20 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#3fb950] to-[#0d1117] px-2 py-1 flex items-center justify-between">
                       <span className="text-white text-[10px] font-bold">Spawn Actor from Class</span>
                       <Box size={10} className="text-white opacity-80" />
                    </div>
                    <div className="p-2 flex flex-col gap-2 relative">
                       <div className="flex justify-between px-1">
                          <div className="w-2 h-2 rounded-full border border-white bg-transparent -ml-2 relative">
                             <div className="absolute top-1/2 right-2 w-16 h-px bg-white/50 -translate-y-0.5" style={{ transform: 'rotate(-45deg)' }}></div>
                          </div>
                          <span className="text-[8px] font-mono text-[#c9d1d9]">Exec</span>
                          <span className="text-[8px] font-mono text-[#c9d1d9]">Exec</span>
                          <div className="w-2 h-2 rounded-full border border-white bg-transparent -mr-2"></div>
                       </div>
                       
                       <div className="flex justify-between px-1">
                          <span className="text-[8px] ml-2 font-mono text-[#bc8cff]">Class</span>
                          <span className="text-[8px] font-mono text-[#58a6ff]">Return Value</span>
                          <div className="w-2 h-2 rounded-full bg-[#58a6ff] -mr-2"></div>
                       </div>
                    </div>
                 </div>
               </>
               ) : mode === 'AI_Assist' ? (
               <>
                {/* AI Overlay Mock */}
                <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-[#e3b341]/5 to-[#58a6ff]/5"></div>
                <div className="absolute top-[10%] left-[10%] bottom-[10%] right-[10%] border-2 border-[#e3b341]/50 border-dashed rounded-xl bg-[#0d1117]/80 backdrop-blur-md shadow-[0_0_50px_rgba(227,179,65,0.15)] flex flex-col items-center justify-center gap-4 z-20 overflow-hidden">
                   <div className="absolute inset-0 bg-[#e3b341]/5 pointer-events-none animate-pulse"></div>
                   <div className="p-4 bg-gradient-to-b from-[#e3b341]/20 to-transparent rounded-full border border-[#e3b341]/30 relative z-10">
                      <Globe size={48} className="text-[#e3b341] drop-shadow-[0_0_15px_rgba(227,179,65,0.8)] animate-[spin_10s_linear_infinite]"/>
                   </div>
                   <div className="flex flex-col items-center gap-1 relative z-10">
                      <h3 className="text-white font-bold text-xl tracking-wider uppercase text-center flex items-center gap-2">
                         <Wand2 size={20} className="text-[#e3b341]" /> 100% Core Reality: Map Generator
                      </h3>
                      <p className="text-[12px] text-[#e3b341] font-mono text-center mb-1 bg-[#161b22] px-2 py-0.5 rounded border border-[#e3b341]/20">Auto-Material Assignment & Destructible Separation Enabled</p>
                   </div>
                   
                   <p className="text-[12px] text-[#8b949e] max-w-lg text-center relative z-10 leading-relaxed">
                      Enter a prompt or drag a concept image. The AI will not just place static meshes. It will **completely separate structures** into base components (beams, panels, hinges) and assigning **100% realistic materials** (wood, iron, glass) based on the environmental logic. You will retain <span className="text-[#e3b341] font-bold">100% manual override</span> capabilities in the editor afterwards via Smart Transmutation.
                   </p>
                   
                   <div className="flex w-full max-w-lg mt-2 relative z-10">
                      <input type="text" className="flex-1 bg-[#161b22] border border-[#30363d] focus:border-[#e3b341]/50 rounded-l p-3 text-white text-[12px] outline-none placeholder-[#8b949e]" placeholder="e.g. Abandoned swamp cabin with rusted metal roof and rotting wood walls..." />
                      <button className="bg-gradient-to-r from-[#e3b341]/80 to-[#bc8cff]/80 hover:from-[#e3b341] hover:to-[#bc8cff] text-[#0d1117] px-6 py-2 text-[13px] rounded-r font-bold transition-all shadow-[0_0_20px_rgba(227,179,65,0.3)] flex items-center gap-2 tracking-wider">
                         <Play size={14} className="fill-current"/> GENERATE WORLD
                      </button>
                   </div>

                   <div className="flex gap-4 mt-2 relative z-10">
                       <button className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-4 py-1.5 text-[11px] rounded border border-[#30363d] transition-colors flex items-center gap-1.5">
                          <ImageUp size={14}/> Include Reference Image
                       </button>
                       <button className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-4 py-1.5 text-[11px] rounded border border-[#30363d] transition-colors flex items-center gap-1.5">
                          <Brain size={14} className="text-[#bc8cff]"/> Use Local Multimodal (Qwen-VL)
                       </button>
                   </div>
                </div>
               </>
               ) : mode === 'NPC' ? (
               <>
                 <div className="w-8 h-8 rounded-full border-2 border-[#bc8cff] bg-[#bc8cff]/20 absolute rotate-x-[75deg] -translate-x-10 translate-y-10 shadow-[0_0_20px_rgba(188,140,255,0.5)] shadow-inner flex items-center justify-center">
                    <div className="text-[#bc8cff] font-bold text-[8px] transform -rotate-x-[75deg] whitespace-nowrap -translate-y-8 absolute bg-[#0d1117]/80 px-1 rounded border border-[#bc8cff]/50">Orc #1</div>
                    <div className="w-1 h-3 bg-[#bc8cff] absolute bottom-1/2 left-1/2 -mb-1.5 -ml-0.5"></div>
                 </div>
                 
                 <div className="w-8 h-8 rounded-full border-2 border-[#bc8cff]/50 bg-[#bc8cff]/10 absolute rotate-x-[75deg] translate-x-32 translate-y-2 flex items-center justify-center">
                    <div className="text-[#bc8cff]/80 font-bold text-[8px] transform -rotate-x-[75deg] whitespace-nowrap -translate-y-8 absolute bg-[#0d1117]/80 px-1 rounded border border-[#bc8cff]/30">Orc #2</div>
                    <div className="w-1 h-3 bg-[#bc8cff]/50 absolute bottom-1/2 left-1/2 -mb-1.5 -ml-0.5"></div>
                 </div>

                 <div className="w-8 h-8 rounded-full border-2 border-[#3fb950] bg-[#3fb950]/20 absolute rotate-x-[75deg] -translate-x-40 -translate-y-20 flex items-center justify-center">
                    <div className="text-[#3fb950] font-bold text-[8px] transform -rotate-x-[75deg] whitespace-nowrap -translate-y-8 absolute bg-[#0d1117]/80 px-1 rounded border border-[#3fb950]/50">Merchant</div>
                    <div className="w-1 h-3 bg-[#3fb950] absolute bottom-1/2 left-1/2 -mb-1.5 -ml-0.5"></div>
                 </div>

                 <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#e3b341]" style={{ transform: 'rotateX(75deg) scale(3) translateY(-100px)' }}>
                   <path d="M 45% 55% Q 50% 60% 60% 50% T 70% 55%" fill="none" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                 </svg>

                 {/* Gizmo Mock on active Item */}
                 <div className="absolute w-20 h-20 -translate-x-4 translate-y-12">
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f85149]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#58a6ff]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-10 bg-[#3fb950] origin-bottom -rotate-45"></div>
                 </div>
               </>
               ) : (
               <>
                 {/* Selected Object Mock */}
                 <div className="w-32 h-32 border-2 border-[#58a6ff] bg-[#58a6ff]/20 absolute rotate-x-[75deg] -translate-x-10 translate-y-10 shadow-[inset_0_0_20px_rgba(88,166,255,0.5)]"></div>
  
                 {/* Gizmo Mock */}
                 <div className="absolute w-20 h-20 -translate-x-4 translate-y-12">
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f85149]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#58a6ff]"></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-10 bg-[#3fb950] origin-bottom -rotate-45"></div>
                 </div>
               </>
               )}
            </div>
            
            <div className="text-[#333] text-5xl font-bold tracking-widest uppercase rotate-[-10deg] opacity-20 pointer-events-none absolute bottom-10 left-10 z-0">MAP EDITOR</div>
        </div>

        {/* Details Panel */}
        <div className="w-72 border-l border-[#30363d] bg-[#161b22] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
           <div className="p-2 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117] sticky top-0 z-10">
              <span className="font-bold text-[11px] uppercase tracking-wider text-[#c9d1d9] flex items-center gap-2"><Settings size={12}/> Details</span>
           </div>
           
           <div className="p-3 flex flex-col gap-4 text-[11px]">
               <div>
                  <input type="text" defaultValue={
                     mode === 'Pathing' ? 'Spline_OrcCamp' : 
                     mode === 'Volumes' ? 'BlockingVolume_Wall' : 
                     mode === 'NPC' ? 'Mob_Orc_Warrior_01' : 
                     mode === 'Landscape' ? 'Terrain_Main' :
                     mode === 'Foliage' ? 'FoliageInstancedMesh' :
                     mode === 'Quests' ? 'QuestGiver_01' :
                     mode === 'Cinematic' ? 'CineCameraActor_Primary' :
                     mode === 'Lighting' ? 'DirectionalLight_Sun' :
                     mode === 'Physics' ? 'ForceField_Tornado' :
                     mode === 'Destruction' ? 'SM_Wall_01_Fractured' :
                     mode === 'Chemistry' ? 'ReactionVolume_NaH2O' :
                     mode === 'Biology' ? 'EcoZone_Forest_01' :
                     mode === 'Audio' ? 'Ambient_Forest_Wind' :
                     mode === 'Decals' ? 'Decal_BloodSplatter' :
                     mode === 'PCG' ? 'PCG_PineForest_Rules' :
                     mode === 'Blueprint' ? 'BP_MainGameState' :
                     mode === 'AI_Assist' ? 'AI_Agent_01' :
                     'SM_Wall_02'} 
                     key={mode} 
                     className="w-full bg-[#0d1117] border border-[#30363d] rounded px-2 py-1.5 text-white outline-none font-bold text-[12px] mb-2" />
                   {['Select', 'NPC', 'Destruction', 'Biology', 'AI_Assist'].includes(mode) && (
                     <button 
                       onClick={() => {
                          sessionStorage.setItem('editInstanceContext', 'true');
                          sessionStorage.setItem('editInstanceName', 'Instance_Override_' + Math.floor(Math.random() * 1000));
                          if (setActiveTool) setActiveTool('Modeling');
                       }}
                       className="w-full py-1.5 bg-[#bc8cff]/10 border border-[#bc8cff]/30 hover:bg-[#bc8cff]/20 text-[#bc8cff] font-bold text-[10px] uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(188,140,255,0.05)] text-center"
                     >
                        <Wand2 size={12} className="inline-block" /> Edit Unique Instance
                     </button>
                   )}
               </div>

               <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Transform</div>
                 <div className="grid grid-cols-1 gap-2">
                    <div className="flex gap-2 items-center bg-[#0d1117] border border-[#30363d] p-1 rounded">
                       <span className="text-[10px] text-[#8b949e] w-12 text-center uppercase">Location</span>
                       <input type="number" defaultValue="420" className="flex-1 bg-transparent border-r border-[#30363d] text-center outline-none text-[#f85149] font-mono" />
                       <input type="number" defaultValue="-150" className="flex-1 bg-transparent border-r border-[#30363d] text-center outline-none text-[#3fb950] font-mono" />
                       <input type="number" defaultValue="0" className="flex-1 bg-transparent text-center outline-none text-[#58a6ff] font-mono" />
                    </div>
                    <div className="flex gap-2 items-center bg-[#0d1117] border border-[#30363d] p-1 rounded">
                       <span className="text-[10px] text-[#8b949e] w-12 text-center uppercase">Rotation</span>
                       <input type="number" defaultValue="0" className="flex-1 bg-transparent border-r border-[#30363d] text-center outline-none text-[#f85149] font-mono" />
                       <input type="number" defaultValue="90" className="flex-1 bg-transparent border-r border-[#30363d] text-center outline-none text-[#3fb950] font-mono" />
                       <input type="number" defaultValue="0" className="flex-1 bg-transparent text-center outline-none text-[#58a6ff] font-mono" />
                    </div>
                    <div className="flex gap-2 items-center bg-[#0d1117] border border-[#30363d] p-1 rounded">
                       <span className="text-[10px] text-[#8b949e] w-12 text-center uppercase">Scale</span>
                       <input type="number" defaultValue="1.0" className="flex-1 bg-transparent border-r border-[#30363d] text-center outline-none text-[#f85149] font-mono" />
                       <input type="number" defaultValue="1.0" className="flex-1 bg-transparent border-r border-[#30363d] text-center outline-none text-[#3fb950] font-mono" />
                       <input type="number" defaultValue="1.0" className="flex-1 bg-transparent text-center outline-none text-[#58a6ff] font-mono" />
                    </div>
                 </div>
              </div>

              <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4 flex items-center gap-1"><Wand2 size={10} className="inline inline-block"/> AI Smart Transmutation Hub</div>
                 <div className="space-y-2 relative">
                    {/* Glowing background effect for Transmutation */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#e3b341]/5 to-transparent rounded pointer-events-none"></div>

                    <div className="flex flex-col gap-2 bg-[#0d1117] border border-[#e3b341]/30 p-2 rounded relative z-10 shadow-[inset_0_0_20px_rgba(227,179,65,0.02)]">
                       
                       {/* Material Target Selection */}
                       <div className="flex flex-col gap-1">
                          <span className="text-[#8b949e] font-bold text-[9px] uppercase tracking-wider flex justify-between">
                             <span>Current: <span className="text-[#c9d1d9]">Plank_Wood_01</span></span>
                             <span>Mass: <span className="text-[#c9d1d9] font-mono">14.2 kg</span></span>
                          </span>
                          <div className="relative group">
                             <select className="appearance-none w-full bg-[#21262d] text-[#e3b341] border border-[#30363d] rounded p-1.5 outline-none text-[10px] font-bold font-mono uppercase cursor-pointer transition-colors hover:border-[#e3b341] pl-2 pr-6">
                                <option>➔ Transmute to: Corrugated Iron</option>
                                <option>➔ Transmute to: Reinforced Concrete</option>
                                <option>➔ Transmute to: Scratched Glass</option>
                                <option>➔ Transmute to: Raw Titanium</option>
                                <option>➔ Transmute to: Flesh / Biomass</option>
                                <option>➔ Transmute to: Superconductor</option>
                             </select>
                             <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown size={12} className="text-[#8b949e] group-hover:text-[#e3b341] transition-colors" />
                             </div>
                          </div>
                       </div>

                       <div className="h-px bg-gradient-to-r from-transparent via-[#30363d] to-transparent my-1"></div>

                       {/* Auto-Linked Physics Rules Matrix */}
                       <div className="flex flex-col gap-1.5 mt-1 relative">
                          <span className="text-[#e3b341] font-bold text-[9px] uppercase tracking-wider mb-1 flex items-center gap-1">
                             <Network size={10} /> Auto-Linked Physical Matrix:
                          </span>
                          
                          <div className="grid grid-cols-2 gap-1">
                             {/* Mechanics Box */}
                             <div className="flex flex-col gap-1 p-1.5 bg-[#161b22] border border-[#30363d] rounded transition-all hover:border-[#f85149]/50 group">
                                <div className="flex justify-between items-center border-b border-[#30363d] pb-1 mb-0.5">
                                   <span className="text-[#f85149] font-bold text-[8px] uppercase flex items-center gap-1"><Bomb size={8}/> Mechanics</span>
                                </div>
                                <div className="text-[8px] text-[#c9d1d9] flex justify-between">Fracture: <span className="text-[#8b949e] font-mono group-hover:text-white">Metallic Tear</span></div>
                                <div className="text-[8px] text-[#c9d1d9] flex justify-between">Hardness: <span className="text-[#8b949e] font-mono group-hover:text-white">8.5 Mohs</span></div>
                                <div className="text-[8px] text-[#c9d1d9] flex justify-between">Yield Str: <span className="text-[#8b949e] font-mono group-hover:text-white">250 MPa</span></div>
                             </div>

                             {/* Thermal Box */}
                             <div className="flex flex-col gap-1 p-1.5 bg-[#161b22] border border-[#30363d] rounded transition-all hover:border-[#ff7b72]/50 group">
                                <div className="flex justify-between items-center border-b border-[#30363d] pb-1 mb-0.5">
                                   <span className="text-[#ff7b72] font-bold text-[8px] uppercase flex items-center gap-1"><Flame size={8}/> Thermal</span>
                                </div>
                                <div className="text-[8px] text-[#c9d1d9] flex justify-between">Melting Pt: <span className="text-[#8b949e] font-mono group-hover:text-white">1,538 °C</span></div>
                                <div className="text-[8px] text-[#c9d1d9] flex justify-between">Conductivity: <span className="text-[#8b949e] font-mono group-hover:text-white">High</span></div>
                                <div className="text-[8px] text-[#c9d1d9] flex justify-between">Flammable: <span className="text-[#8b949e] font-mono group-hover:text-[#ff7b72]">0%</span></div>
                             </div>

                             {/* Chemistry Box */}
                             <div className="flex flex-col gap-1 p-1.5 bg-[#161b22] border border-[#30363d] rounded transition-all hover:border-[#bc8cff]/50 group">
                                <div className="flex justify-between items-center border-b border-[#30363d] pb-1 mb-0.5">
                                   <span className="text-[#bc8cff] font-bold text-[8px] uppercase flex items-center gap-1"><Hexagon size={8}/> Chemistry</span>
                                </div>
                                <div className="text-[8px] text-[#c9d1d9] flex justify-between">Water Rxn: <span className="text-[#8b949e] font-mono group-hover:text-[#bc8cff]">Oxidation</span></div>
                                <div className="text-[8px] text-[#c9d1d9] flex justify-between">Acid Rxn: <span className="text-[#8b949e] font-mono group-hover:text-[#bc8cff]">Dissolve</span></div>
                                <div className="text-[8px] text-[#c9d1d9] flex justify-between">Toxicity: <span className="text-[#8b949e] font-mono group-hover:text-white">None</span></div>
                             </div>

                             {/* Acoustic & Electronics Box */}
                             <div className="flex flex-col gap-1 p-1.5 bg-[#161b22] border border-[#30363d] rounded transition-all hover:border-[#58a6ff]/50 group">
                                <div className="flex justify-between items-center border-b border-[#30363d] pb-1 mb-0.5">
                                   <span className="text-[#58a6ff] font-bold text-[8px] uppercase flex items-center gap-1"><Volume2 size={8}/> Acoustics</span>
                                </div>
                                <div className="text-[8px] text-[#c9d1d9] flex justify-between">Impact Snd: <span className="text-[#8b949e] font-mono group-hover:text-white">Hollow Clang</span></div>
                                <div className="text-[8px] text-[#c9d1d9] flex justify-between">Absorption: <span className="text-[#8b949e] font-mono group-hover:text-white">0.05</span></div>
                                <div className="text-[8px] text-[#c9d1d9] flex justify-between">Magnetic: <span className="text-[#8b949e] font-mono group-hover:text-[#58a6ff]">True</span></div>
                             </div>
                          </div>
                          
                          {/* Visual Change preview line */}
                          <div className="mt-1 bg-[#161b22] py-1 px-2 rounded border border-[#30363d] flex items-center justify-between">
                             <div className="flex items-center gap-1">
                                <Eye size={10} className="text-[#8b949e]"/>
                                <span className="text-[8px] text-[#8b949e] font-bold">PBR Shader:</span>
                             </div>
                             <span className="text-[8px] font-mono text-[#7ee787]">M_RustPlates_Inst</span>
                          </div>

                          {/* 100% Core Reality: Target Physics Injection */}
                          <div className="mt-1 flex flex-col gap-1 p-1.5 bg-[#0d1117] border border-[#3fb950]/30 rounded relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3fb950]/5 to-transparent animate-[shimmer_2s_infinite]"></div>
                             <div className="flex justify-between items-center border-b border-[#30363d] pb-1 relative z-10">
                                <span className="text-[#3fb950] font-bold text-[8px] uppercase flex items-center gap-1 tracking-wider"><Activity size={8}/> AI Physics Suggestions</span>
                                <span className="text-[7px] text-[#3fb950] border border-[#3fb950]/30 px-1 rounded-sm">Target: Iron</span>
                             </div>
                             
                             <div className="grid grid-cols-3 gap-1 mt-0.5 relative z-10">
                                <div className="flex flex-col bg-[#161b22] px-1 py-0.5 rounded border border-[#30363d]">
                                   <span className="text-[7px] text-[#8b949e] uppercase">Friction</span>
                                   <input type="number" defaultValue="0.30" className="bg-transparent border-none outline-none text-[#c9d1d9] font-mono text-[9px] w-full" />
                                </div>
                                <div className="flex flex-col bg-[#161b22] px-1 py-0.5 rounded border border-[#30363d]">
                                   <span className="text-[7px] text-[#8b949e] uppercase">Restitution</span>
                                   <input type="number" defaultValue="0.10" className="bg-transparent border-none outline-none text-[#c9d1d9] font-mono text-[9px] w-full" />
                                </div>
                                <div className="flex flex-col bg-[#161b22] px-1 py-0.5 rounded border border-[#30363d]">
                                   <span className="text-[7px] text-[#8b949e] uppercase">Density (g/cm³)</span>
                                   <input type="number" defaultValue="7.80" className="bg-transparent border-none outline-none text-[#c9d1d9] font-mono text-[9px] w-full" />
                                </div>
                             </div>

                             <button className="mt-1 w-full flex items-center justify-center gap-1 bg-[#3fb950]/10 hover:bg-[#3fb950]/20 border border-[#3fb950]/50 text-[#3fb950] py-1 rounded text-[8px] uppercase tracking-wider font-bold transition-colors relative z-10 shadow-[0_0_10px_rgba(63,185,80,0.1)]">
                                <Workflow size={8} /> Apply Physics To Active Object
                             </button>
                          </div>

                       </div>

                       <button className="mt-2 w-full py-1.5 rounded bg-gradient-to-r from-[#e3b341]/20 to-[#e3b341]/10 hover:from-[#e3b341]/30 hover:to-[#e3b341]/20 border border-[#e3b341]/50 text-[#e3b341] font-bold text-[10px] uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(227,179,65,0.1)] hover:shadow-[0_0_15px_rgba(227,179,65,0.2)] flex items-center justify-center gap-1.5 relative overflow-hidden group">
                          <Brain size={12} className="relative z-10 group-hover:scale-110 transition-transform" /> 
                          <span className="relative z-10">Execute AI Transmutation</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e3b341]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                       </button>
                    </div>
                 </div>
              </div>

              <div>
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4 flex items-center gap-1"><Paintbrush size={10} className="inline"/> Material Overrides</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between bg-[#0d1117] border border-[#30363d] p-1.5 rounded">
                       <span className="text-[#8b949e] font-bold text-[10px]">Albedo (Color)</span>
                       <div className="flex items-center gap-2">
                          <input type="color" defaultValue="#4f5b66" className="w-8 h-5 p-0 border-0 bg-transparent rounded cursor-pointer" />
                       </div>
                    </div>
                    <div className="flex items-center justify-between bg-[#0d1117] border border-[#30363d] p-1.5 rounded">
                       <span className="text-[#8b949e] font-bold text-[10px]">Roughness</span>
                       <input type="range" min="0" max="1" step="0.01" defaultValue="0.6" className="w-20 accent-[#bc8cff]" />
                       <span className="text-[#c9d1d9] font-mono text-[10px] w-6 text-right">0.6</span>
                    </div>
                    <div className="flex flex-col gap-1.5 bg-[#0d1117] border border-[#30363d] p-1.5 rounded">
                       <div className="flex items-center justify-between">
                          <span className="text-[#e3b341] font-bold text-[10px] flex items-center gap-1"><Lightbulb size={10}/> Emissive</span>
                          <input type="checkbox" className="accent-[#e3b341]" defaultChecked />
                       </div>
                       <div className="flex items-center justify-between pl-4">
                          <span className="text-[#8b949e] text-[9px]">Intensity</span>
                          <input type="number" defaultValue="2.5" className="bg-[#21262d] border border-[#30363d] text-white px-1 py-0.5 outline-none text-[10px] rounded w-12 text-right font-mono" />
                       </div>
                       <div className="flex items-center justify-between pl-4">
                          <span className="text-[#8b949e] text-[9px]">Color</span>
                          <input type="color" defaultValue="#e3b341" className="w-6 h-4 p-0 border-0 bg-transparent rounded cursor-pointer" />
                       </div>
                    </div>
                 </div>
              </div>

              <div>
                 <div className="font-bold text-[#58a6ff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4">Linked Assets</div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <button onClick={() => setActiveTool && setActiveTool('Material')} className="flex-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] py-1.5 rounded flex justify-center items-center gap-1.5 transition-colors text-[10px] font-bold">
                         <Hexagon size={12} className="text-[#e3b341]" /> Material
                      </button>
                      <button onClick={() => {
                         sessionStorage.setItem('editInstanceContext', 'true');
                         sessionStorage.setItem('editInstanceName', 'Instance_Override_Script');
                         if (setActiveTool) setActiveTool('ScriptEditor');
                      }} className="flex-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] py-1.5 rounded flex justify-center items-center gap-1.5 transition-colors text-[10px] font-bold">
                         <ScrollText size={12} className="text-[#ff7b72]" /> Script
                      </button>
                   </div>
                   <div className="flex items-center gap-2">
                      <button onClick={() => {
                         sessionStorage.setItem('editInstanceContext', 'true');
                         sessionStorage.setItem('editInstanceName', 'Instance_Override_Physics');
                         if (setActiveTool) setActiveTool('PhysicsEngine');
                      }} className="w-full bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] py-1.5 rounded flex justify-center items-center gap-1.5 transition-colors text-[10px] font-bold">
                         <Wind size={12} className="text-[#58a6ff]" /> Edit Physics Object
                      </button>
                   </div>
                </div>
              </div>

              {/* Instance Overrides Management */}
              {['Select', 'NPC', 'Destruction', 'Biology', 'AI_Assist'].includes(mode) && (
                <div className="mt-4 border border-[#bc8cff]/30 rounded bg-[#bc8cff]/5 overflow-hidden">
                   <div className="p-1.5 bg-[#bc8cff]/10 text-[#bc8cff] font-bold text-[10px] uppercase tracking-wider flex items-center justify-between">
                     <div className="flex items-center gap-1"><Layers size={12}/> Instance Overrides Active</div>
                     <span className="bg-[#bc8cff]/20 px-1 rounded">2</span>
                   </div>
                   <div className="p-2 space-y-1.5">
                      <div className="flex justify-between items-center bg-[#0d1117] rounded p-1 border border-[#30363d]">
                         <span className="text-[10px] text-[#8b949e] font-bold flex items-center gap-1"><ScrollText size={10} className="text-[#ff7b72]"/> Custom_Logic.cs</span>
                         <button className="text-[10px] text-[#f85149] hover:bg-[#f85149]/20 p-0.5 rounded transition-colors" title="Revert to Base"><Trash2 size={10}/></button>
                      </div>
                      <div className="flex justify-between items-center bg-[#0d1117] rounded p-1 border border-[#30363d]">
                         <span className="text-[10px] text-[#8b949e] font-bold flex items-center gap-1"><Orbit size={10} className="text-[#58a6ff]"/> Physics: Bouncy</span>
                         <button className="text-[10px] text-[#f85149] hover:bg-[#f85149]/20 p-0.5 rounded transition-colors" title="Revert to Base"><Trash2 size={10}/></button>
                      </div>
                      <button className="w-full mt-2 py-1 bg-[#58a6ff]/10 hover:bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30 rounded text-[10px] font-bold transition-colors flex justify-center items-center gap-1">
                         <Save size={10}/> Apply All to Base Blueprint
                      </button>
                   </div>
                </div>
              )}

              {mode === 'Volumes' ? (
              <>
               <div>
                 <div className="font-bold text-[#58a6ff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Environment Physics</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Env Type</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] px-1 py-1 outline-none text-[10px] rounded w-24">
                          <option>Gale Wind</option>
                          <option>Submerged Water</option>
                          <option>Hurricane</option>
                          <option>Scorching Heat</option>
                          <option>Freezing Cold</option>
                          <option>Slippery Ice</option>
                          <option>Toxic Swamp</option>
                          <option>Quicksand</option>
                          <option>Anti-Gravity Anomaly</option>
                          <option>Hyper-Magnetic Field</option>
                          <option>Radioactive Zone</option>
                          <option>Spore Forest</option>
                          <option>Sticky Tar</option>
                       </select>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-[#8b949e] font-bold">AI Gen Bounds</span>
                       <button className="bg-[#e3b341]/20 text-[#e3b341] px-2 py-0.5 rounded text-[9px] border border-[#e3b341]/50 cursor-pointer hover:bg-[#e3b341]/40">Auto-Fit to Biome</button>
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                       <span className="text-[#8b949e] font-bold">Flow / Wind Vector</span>
                       <div className="flex gap-1">
                          <input type="number" defaultValue="1.0" className="bg-[#0d1117] border border-[#30363d] text-[#f85149] px-1 py-1 outline-none text-[10px] rounded w-1/3 text-center font-mono" />
                          <input type="number" defaultValue="0.0" className="bg-[#0d1117] border border-[#30363d] text-[#3fb950] px-1 py-1 outline-none text-[10px] rounded w-1/3 text-center font-mono" />
                          <input type="number" defaultValue="0.0" className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] px-1 py-1 outline-none text-[10px] rounded w-1/3 text-center font-mono" />
                       </div>
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#f85149] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Locomotion Override</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Fluid Drag</span>
                       <input type="number" defaultValue="0.85" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Temp Offset (°C)</span>
                       <input type="number" defaultValue="45.0" className="bg-[#0d1117] border border-[#30363d] text-[#e3b341] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Weight Cap (kg)</span>
                       <input type="number" defaultValue="80.0" className="bg-[#0d1117] border border-[#30363d] text-[#e3b341] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Combat Penalty</span>
                       <input type="number" defaultValue="0.4" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#58a6ff] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[10px]">Enable Wind IK Reaction</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <input type="checkbox" className="accent-[#58a6ff] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[10px]">Affect Projectile Aero</span>
                    </div>
                 </div>
              </div>
              </>
              ) : mode === 'NPC' ? (
              <>
               <div>
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">AI Adaptation Settings</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Base Mass (kg)</span>
                       <input type="number" defaultValue="85.0" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-[#8b949e] font-bold">Ecosystem Traits</span>
                       <button className="bg-[#bc8cff]/20 text-[#bc8cff] px-2 py-0.5 rounded text-[9px] border border-[#bc8cff]/50 cursor-pointer hover:bg-[#bc8cff]/40">Manage Roles</button>
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                       <span className="text-[#8b949e] font-bold">Biome Affinity</span>
                       <div className="bg-[#0d1117] border border-[#30363d] p-1.5 rounded text-[9px] text-[#c9d1d9] flex justify-between">
                          <span>Fire/Heat (Volcano)</span>
                          <span className="text-[#f85149]">Vulnerable</span>
                       </div>
                       <div className="bg-[#0d1117] border border-[#30363d] p-1.5 rounded text-[9px] text-[#c9d1d9] flex justify-between">
                          <span>Ice (Glacial)</span>
                          <span className="text-[#58a6ff]">Native/Immune</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Target & Pathfinding</div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[10px]">Avoid Hazardous Volumes</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[10px]">React to Slippery Ice (Ragdoll)</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[10px]">Can Ambush from Quicksand</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[10px]">Mutates in Spore/Radiation</span>
                    </div>
                 </div>
              </div>
              </>
              ) : mode === 'Landscape' ? (
              <>
               <div>
                 <div className="font-bold text-[#3fb950] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Sculpt Tools</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Brush Size</span>
                       <input type="number" defaultValue="800" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Brush Falloff</span>
                       <input type="number" defaultValue="0.5" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Tool Strength</span>
                       <input type="number" defaultValue="0.3" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#3fb950] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Terrain Resolution</div>
                 <div className="space-y-2">
                    <div className="bg-[#0d1117] border border-[#30363d] p-2 rounded flex items-center justify-between">
                       <span className="text-[#c9d1d9] font-mono text-[10px]">Heightmap 4033x4033</span>
                    </div>
                 </div>
              </div>
              </>
              ) : mode === 'Foliage' ? (
              <>
               <div>
                 <div className="font-bold text-[#3fb950] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Paint Settings</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Brush Size</span>
                       <input type="number" defaultValue="400" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Paint Density</span>
                       <input type="number" defaultValue="0.5" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#3fb950] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Type: Pine_Tree_01</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Align to Normal</span>
                       <input type="checkbox" className="accent-[#3fb950] w-3 h-3" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Scale Min / Max</span>
                       <div className="flex gap-1">
                           <input type="number" defaultValue="0.8" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-12 text-right font-mono" />
                           <input type="number" defaultValue="1.2" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-12 text-right font-mono" />
                       </div>
                    </div>
                 </div>
              </div>
              </>
              ) : mode === 'Quests' ? (
              <>
               <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Quest Settings</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Trigger Radius</span>
                       <input type="number" defaultValue="200" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Quest ID</span>
                       <input type="text" defaultValue="Q_ReturnAm" className="bg-[#0d1117] border border-[#30363d] text-[#e3b341] px-1 py-1 outline-none text-[10px] rounded w-20 text-right font-mono" />
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                       <span className="text-[#8b949e] font-bold">Objectives</span>
                       <div className="bg-[#0d1117] border border-[#30363d] p-1.5 rounded text-[9px] text-[#c9d1d9]">1. Go to Goblin Camp</div>
                       <div className="bg-[#0d1117] border border-[#30363d] p-1.5 rounded text-[9px] text-[#c9d1d9]">2. Retrieve Amulet</div>
                    </div>
                 </div>
              </div>
              </>
              ) : mode === 'Cinematic' ? (
              <>
               <div>
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Camera Properties</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Lens Settings</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-[#bc8cff] px-1 py-1 outline-none text-[10px] rounded w-20">
                          <option>50mm Prime</option>
                          <option>35mm Wide</option>
                          <option>85mm Port.</option>
                       </select>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Focus Method</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-20">
                          <option>Manual</option>
                          <option>Tracking</option>
                       </select>
                    </div>
                 </div>
              </div>
              </>
              ) : mode === 'Lighting' ? (
              <>
               <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Light Properties</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Intensity</span>
                       <input type="number" defaultValue="10.0" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Light Color</span>
                       <div className="flex items-center gap-2">
                          <input type="color" defaultValue="#fff3e0" className="w-6 h-6 p-0 border-0 bg-transparent rounded" />
                       </div>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Cast Shadows</span>
                       <input type="checkbox" className="accent-[#e3b341] w-3 h-3" defaultChecked />
                    </div>
                 </div>
              </div>
              <div className="mt-4">
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Moon size={10} className="inline"/> Celestial & Time Mechanics</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Tidal Simulation</span>
                       <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-[#8b949e] font-bold">Moon Phase</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-white px-1 outline-none text-[10px] rounded w-20">
                          <option>Full Moon</option>
                          <option>Waning</option>
                          <option>New Moon</option>
                          <option>Waxing</option>
                       </select>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[9px]">Apply Bio-Rhythm to NPCs</span>
                    </div>
                 </div>
              </div>
              </>
              ) : mode === 'Physics' ? (
              <>
               <div>
                 <div className="font-bold text-[#f85149] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Rigid Dynamics</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Mass (kg)</span>
                       <input type="number" defaultValue="150" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Friction</span>
                       <input type="number" defaultValue="0.7" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Bounciness</span>
                       <input type="number" defaultValue="0.2" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#f85149] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Force Field (Tornado)</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Vortex Strength</span>
                       <input type="number" defaultValue="5000" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Drag Force</span>
                       <input type="number" defaultValue="500" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                 </div>
              </div>
              </>
              ) : mode === 'Destruction' ? (
              <>
               <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Procedural Fracture & Chaos</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Health / Durability</span>
                       <input type="number" defaultValue="500.0" className="bg-[#0d1117] border border-[#30363d] text-[#e3b341] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Fracture Type</span>
                       <select className="bg-[#0d1117] border border-[#30363d] rounded px-1 py-1 text-white outline-none w-20 text-[10px]">
                          <option>Voronoi</option>
                          <option>Slicing</option>
                          <option>Radial</option>
                          <option>Clustered</option>
                       </select>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-[#8b949e] font-bold">Debris Lifespan</span>
                       <input type="number" defaultValue="15.0" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4">Bio-Interaction</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Weight Cap Factor</span>
                       <input type="number" defaultValue="120.0" className="bg-[#0d1117] border border-[#30363d] text-[#f85149] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#e3b341] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[10px]">Generate Procedural Cracks</span>
                    </div>
                 </div>
              </div>
              </>
              ) : mode === 'Chemistry' ? (
              <>
               <div>
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Chemical Reaction & Nano-Physics</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Chemical Tag</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-[#bc8cff] px-1 outline-none text-[10px] rounded w-20">
                          <option>Sodium_Na</option>
                          <option>Water_H2O</option>
                          <option>Acid_HCl</option>
                       </select>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Volatility</span>
                       <input type="number" defaultValue="0.95" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4">Granular Decay & Entropy</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Oxidation (Rust) Speed</span>
                       <input type="number" defaultValue="5.0" className="bg-[#0d1117] border border-[#30363d] text-[#f85149] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Putrefaction Rate</span>
                       <input type="number" defaultValue="1.5" className="bg-[#0d1117] border border-[#30363d] text-[#bc8cff] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[9px]">Spawn Miasma on Decay</span>
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4">Environment Rules</div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                       <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[10px]">Ignites on Contact (Water)</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[10px]">Produce Toxic Gas</span>
                    </div>
                 </div>
              </div>
              </>
              ) : mode === 'Biology' ? (
              <>
               <div>
                 <div className="font-bold text-[#3fb950] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Mountain size={10} className="inline"/> Biome & Advanced Locomotion</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Biome Type</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-[#3fb950] px-1 outline-none text-[10px] rounded font-bold">
                          <option>Volcanic Ash (Heat FX)</option>
                          <option>Deep River / Rapids</option>
                          <option>Deciduous Forest</option>
                          <option>Toxic Swamp / Mud</option>
                          <option>Desert</option>
                       </select>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#3fb950] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[9px]">Force Biome-Specific Locomotion IK</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Entity Spawn Cap</span>
                       <input type="number" defaultValue="250" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#3fb950] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4">Food Chain Map</div>
                 <div className="bg-[#0d1117] border border-[#30363d] rounded p-2 flex flex-col gap-1 mt-1">
                    <span className="text-[#f85149] font-mono text-[9px] flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#f85149]"></div> Predator: Dire_Wolf</span>
                    <span className="text-[#e3b341] font-mono text-[9px] ml-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#e3b341]"></div> Prey: Deer_Stag</span>
                    <span className="text-[#58a6ff] font-mono text-[9px] ml-8 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#58a6ff]"></div> Food: Grass_Tuft</span>
                 </div>
              </div>
                    ) : mode === 'Audio' ? (
              <>
               <div>
                 <div className="font-bold text-[#58a6ff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Volume2 size={10} className="inline"/> Acoustic Bio-Resonance</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Base DB Level</span>
                       <input type="number" defaultValue="75.0" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Dynamic Lowpass (Hz)</span>
                       <input type="number" defaultValue="22000" className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Sub-bass Frequency</span>
                       <input type="number" defaultValue="45.0" className="bg-[#0d1117] border border-[#30363d] text-[#e3b341] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Surface Footstep Type</span>
                       <select className="bg-[#0d1117] border border-[#30363d] rounded px-1 py-1 text-white outline-none w-24 text-[10px]">
                          <option>Mud / Squelch</option>
                          <option>Deep Snow (Crunch)</option>
                          <option>Toxic Acid Sizzle</option>
                          <option>Hollow Wood</option>
                          <option>Fragile Ice / Crack</option>
                          <option>Volcanic Ash</option>
                          <option>Flowing River</option>
                       </select>
                    </div>
                 </div>
              </div>
              
              <div>
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4 flex items-center gap-1"><Layers size={10} className="inline"/> Multi-Layer Ambient Emitters</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between bg-[#0d1117] p-1.5 rounded border border-[#30363d]">
                       <span className="text-[#c9d1d9] font-bold text-[9px]">Layer 1 (Foreground)</span>
                       <select className="bg-transparent text-[#bc8cff] outline-none text-[10px] w-20">
                           <option>Leaves Rustle</option>
                           <option>Water Trickle</option>
                           <option>Pebble Drops</option>
                       </select>
                    </div>
                    <div className="flex items-center justify-between bg-[#0d1117] p-1.5 rounded border border-[#30363d]">
                       <span className="text-[#c9d1d9] font-bold text-[9px]">Layer 2 (Mid-ground)</span>
                       <select className="bg-transparent text-[#58a6ff] outline-none text-[10px] w-20">
                           <option>Distant Birds</option>
                           <option>Wind Howl</option>
                           <option>Lava Gurgling</option>
                       </select>
                    </div>
                    <div className="flex items-center justify-between bg-[#0d1117] p-1.5 rounded border border-[#30363d]">
                       <span className="text-[#c9d1d9] font-bold text-[9px]">Layer 3 (Background)</span>
                       <select className="bg-transparent text-[#f85149] outline-none text-[10px] w-20">
                           <option>Deep Cave Rumble</option>
                           <option>Distant Thunder</option>
                           <option>Tectonic Shifts</option>
                       </select>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" defaultChecked />
                       <span className="text-[#8b949e] font-bold text-[9px]">Randomize Layer Pitch (±15%)</span>
                    </div>
                 </div>
              </div>

              <div>
                 <div className="font-bold text-[#f85149] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4 flex items-center gap-1"><Brain size={10} className="inline"/>Neuro-Sensory Paranoia</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Delirium Threshold</span>
                       <input type="number" defaultValue="0.15" className="bg-[#0d1117] border border-[#30363d] text-[#f85149] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#f85149] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[9px]">Spawn Ghost Footsteps (1s Delay)</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#f85149] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[9px]">Whisper-Wind Hallucination</span>
                    </div>
                 </div>
              </div>

              <div>
                 <div className="font-bold text-[#3fb950] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4 flex items-center gap-1"><Waves size={10} className="inline"/> Raytraced Sound & Occlusion</div>
                 <div className="space-y-2">
                    <div className="flex flex-col gap-1.5">
                       <div className="flex items-center justify-between">
                          <span className="text-[#8b949e] font-bold">Material Absorption</span>
                          <input type="number" defaultValue="0.85" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                       </div>
                       <div className="flex justify-between items-center bg-[#21262d] rounded p-1">
                          <span className="text-[#c9d1d9] text-[9px]">Ray Bounces</span>
                          <span className="text-[#3fb950] font-mono text-[9px]">8 Max</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#3fb950] w-3 h-3" defaultChecked />
                       <span className="text-[#8b949e] font-bold text-[9px]">Enable Diffraction (Corners)</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#3fb950] w-3 h-3" defaultChecked />
                       <span className="text-[#8b949e] font-bold text-[9px]">Enable Transmission (Thru walls)</span>
                    </div>
                 </div>
              </div>

              <div>
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4 flex items-center gap-1"><Volume2 size={10} className="inline"/> Environment Procedural Audio</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Audio Emitter Node</span>
                       <select className="bg-[#0d1117] border border-[#30363d] rounded px-1 py-1 text-[#bc8cff] outline-none w-24 text-[10px] font-bold">
                          <option>River Flow 3D</option>
                          <option>Magma Eruption</option>
                          <option>Lava Sizzle</option>
                          <option>Waterfall Splash</option>
                          <option>Creaking Glacier</option>
                       </select>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Occlusion Filter</span>
                       <input type="number" defaultValue="0.8" className="bg-[#0d1117] border border-[#30363d] text-[#bc8cff] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                       <span className="text-[#8b949e] font-bold text-[9px]">Event-Driven Audio Trigger Area</span>
                       <div className="flex items-center gap-2">
                          <input type="checkbox" className="accent-[#bc8cff] w-3 h-3" defaultChecked />
                          <span className="text-[#c9d1d9] font-bold text-[9px]">Play "Rockfall" on Avalanche Event</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4 flex items-center gap-1"><Activity size={10} className="inline"/> Convolution Reverb (Spatial)</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Decay Time (s)</span>
                       <input type="number" defaultValue="2.5" className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Multi-Bounce Echo</span>
                       <input type="number" defaultValue="4" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <input type="checkbox" className="accent-[#58a6ff] w-3 h-3" defaultChecked />
                       <span className="text-[#c9d1d9] font-bold text-[9px]">Sync Pain/Heavy Breathing Reverb</span>
                    </div>
                 </div>
              </div>
              </>         </>
              ) : mode === 'Decals' ? (
              <>
               <div>
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Decal Properties</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Alpha (Opacity)</span>
                       <input type="number" defaultValue="0.85" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Projection Size X</span>
                       <input type="number" defaultValue="128" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Depth Buffer Size</span>
                       <input type="number" defaultValue="256" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                 </div>
              </div>
              </>
              ) : mode === 'PCG' ? (
              <>
               <div>
                 <div className="font-bold text-[#7ee787] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Procedural Rules</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Density</span>
                       <input type="number" defaultValue="42" className="bg-[#0d1117] border border-[#30363d] text-[#7ee787] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Seed</span>
                       <input type="number" defaultValue="1337" className="bg-[#0d1117] border border-[#30363d] text-[#7ee787] px-1 py-1 outline-none text-[10px] rounded w-20 text-right font-mono" />
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#7ee787] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Generation Actions</div>
                 <button className="w-full py-2 bg-[#2ea043] hover:bg-[#3fb950] text-[#0d1117] font-bold text-[11px] rounded transition-colors flex items-center justify-center gap-2">
                    <Cpu size={14}/> Generate (Local)
                 </button>
                 <button className="w-full py-1.5 border border-[#30363d] hover:border-[#f85149] hover:text-[#f85149] text-[#c9d1d9] font-bold text-[11px] rounded transition-colors mt-2">
                    Clear Generated
                 </button>
              </div>
              </>
              ) : mode === 'Instance_Override' ? (
              <>
               <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 flex justify-between items-center">
                    Level Instance #42 (SM_Pine)
                    <button className="bg-[#e3b341]/20 text-[#e3b341] px-2 py-0.5 rounded">Revert All</button>
                 </div>
                 
                 <div className="font-bold text-[#c9d1d9] tracking-wider uppercase text-[9px] mb-2 mt-3 bg-[#21262d] px-1 py-0.5 rounded">Transform Override</div>
                 <div className="grid grid-cols-3 gap-1 mb-2">
                    <div className="flex items-center text-[10px] border border-[#30363d] rounded bg-[#0d1117]"><div className="bg-[#f85149] text-white font-bold w-6 text-center border-r border-[#30363d]">X</div><input type="text" className="w-full bg-transparent outline-none pl-1 text-white" defaultValue="145.2"/></div>
                    <div className="flex items-center text-[10px] border border-[#30363d] rounded bg-[#0d1117]"><div className="bg-[#3fb950] text-white font-bold w-6 text-center border-r border-[#30363d]">Y</div><input type="text" className="w-full bg-transparent outline-none pl-1 text-white" defaultValue="-22.0"/></div>
                    <div className="flex items-center text-[10px] border border-[#30363d] rounded bg-[#0d1117]"><div className="bg-[#58a6ff] text-white font-bold w-6 text-center border-r border-[#30363d]">Z</div><input type="text" className="w-full bg-transparent outline-none pl-1 text-white" defaultValue="0.0"/></div>
                 </div>

                 <div className="font-bold text-[#c9d1d9] tracking-wider uppercase text-[9px] mb-2 mt-3 bg-[#21262d] px-1 py-0.5 rounded flex items-center gap-1">Material Override (Dynamic Instance)</div>
                 <div className="space-y-2 relative">
                    <div className="absolute -left-2 top-0 bottom-0 border-l border-[#8b949e]"></div>
                    <div className="flex flex-col gap-1 pl-2 relative">
                       <div className="absolute -left-2 top-1.5 w-2 border-t border-[#8b949e]"></div>
                       <label className="text-[10px] text-[#8b949e] font-bold"><span className="text-[#3fb950] font-mono select-none">Vector Parameter:</span> ColorTint</label>
                       <div className="flex gap-2 w-full">
                          <input type="color" defaultValue="#ffaa00" className="w-8 h-5 border border-[#30363d] rounded bg-transparent p-0 flex-shrink-0" />
                          <div className="flex flex-col flex-1 gap-1">
                             <div className="flex gap-1 text-[9px] font-mono items-center"><span className="text-[#f85149]">R:</span><input type="range" className="flex-1 accent-[#f85149]" defaultValue="255"/></div>
                             <div className="flex gap-1 text-[9px] font-mono items-center"><span className="text-[#3fb950]">G:</span><input type="range" className="flex-1 accent-[#3fb950]" defaultValue="170"/></div>
                             <div className="flex gap-1 text-[9px] font-mono items-center"><span className="text-[#58a6ff]">B:</span><input type="range" className="flex-1 accent-[#58a6ff]" defaultValue="0"/></div>
                          </div>
                          <button title="Revert" className="text-[#8b949e] hover:text-[#e3b341] self-start ml-1"><RotateCcw size={10} /></button>
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 pl-2 relative mt-3">
                       <div className="absolute -left-2 top-1.5 w-2 border-t border-[#8b949e]"></div>
                       <label className="text-[10px] text-[#8b949e] font-bold"><span className="text-[#e3b341] font-mono select-none">Scalar Parameter:</span> EmissiveStrength</label>
                       <div className="flex gap-2 w-full items-center">
                          <input type="range" className="flex-1 accent-[#e3b341]" min="0" max="100" defaultValue="45" />
                          <input type="number" className="w-12 bg-[#0d1117] border border-[#30363d] text-white text-[10px] outline-none rounded p-0.5 text-right font-mono" defaultValue="4.5" />
                          <button title="Revert" className="text-[#8b949e] hover:text-[#e3b341] self-center ml-1"><RotateCcw size={10} /></button>
                       </div>
                    </div>

                    <div className="flex flex-col gap-1 pl-2 relative mt-3">
                       <div className="absolute -left-2 top-1.5 w-2 border-t border-[#8b949e]"></div>
                       <label className="text-[10px] text-[#8b949e] font-bold"><span className="text-[#bc8cff] font-mono select-none">Texture Override:</span> DiffuseMap</label>
                       <div className="flex gap-2 w-full items-center">
                          <img src="https://picsum.photos/32/32" className="w-8 h-8 rounded border border-[#30363d] cursor-pointer hover:border-[#bc8cff]"/>
                          <div className="text-[9px] text-[#8b949e] flex-1 truncate">T_Pine_Bark_VarC.uasset</div>
                          <button title="Revert" className="text-[#8b949e] hover:text-[#e3b341] self-center ml-1"><RotateCcw size={10} /></button>
                       </div>
                    </div>
                 </div>

                 <div className="font-bold text-[#c9d1d9] tracking-wider uppercase text-[9px] mb-2 mt-4 bg-[#21262d] px-1 py-0.5 rounded flex items-center justify-between">Per-Instance Custom Data <button className="text-[#58a6ff] hover:text-white"><Plus size={10}/></button></div>
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center text-[10px] bg-[#161b22] border border-[#30363d] rounded p-1">
                       <div className="text-[#8b949e] w-12 font-mono border-r border-[#30363d] flex justify-between pr-1">0 <RotateCcw size={10} className="hover:text-white cursor-pointer"/></div>
                       <input type="number" className="w-full bg-transparent outline-none pl-2 text-[#58a6ff] font-mono" defaultValue="1.530" step="0.001" title="Data Float 0 (e.g. Wind Bending Phase)"/>
                    </div>
                    <div className="flex items-center text-[10px] bg-[#161b22] border border-[#30363d] rounded p-1">
                       <div className="text-[#8b949e] w-12 font-mono border-r border-[#30363d] flex justify-between pr-1">1 <RotateCcw size={10} className="hover:text-white cursor-pointer"/></div>
                       <input type="number" className="w-full bg-transparent outline-none pl-2 text-[#58a6ff] font-mono" defaultValue="0.000" step="0.001" title="Data Float 1"/>
                    </div>
                 </div>

                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 mt-4 border-b border-[#30363d] pb-1 flex justify-between items-center gap-2"><Sparkles size={12}/> AI Variation Generator</div>
                 <p className="text-[10px] text-[#8b949e] mb-2 leading-tight">Procedurally generate N unique overrides for selected instances using Offline AI.</p>
                 <div className="w-full bg-[#161b22] border border-[#30363d] rounded flex flex-col p-2 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                       <span className="text-[#c9d1d9] font-bold">Count</span>
                       <input type="number" className="w-12 bg-[#0d1117] border border-[#30363d] rounded text-right px-1 text-[#e3b341] outline-none" defaultValue="10" />
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                       <span className="text-[#c9d1d9] font-bold">Variance Scope</span>
                       <select className="bg-[#0d1117] border border-[#30363d] rounded px-1 text-[#e3b341] outline-none w-20">
                          <option>Color Tint</option>
                          <option>Scale</option>
                          <option>Both</option>
                          <option>All Parameters</option>
                       </select>
                    </div>
                    <textarea className="w-full h-12 bg-[#0d1117] border border-[#30363d] rounded p-1 text-[9px] text-[#c9d1d9] outline-none resize-none" placeholder="Prompt: e.g. Make them slightly more decayed / autumnal..." defaultValue="Make them look autumn-like, subtle browns and red tint variations."/>
                    <button className="bg-[#e3b341] text-black w-full font-bold text-[10px] py-1 rounded shadow-[0_0_10px_rgba(227,179,65,0.4)]">Generate Variations</button>
                 </div>

               </div>
              </>
              ) : mode === 'World_Partition' ? (
              <>
               <div>
                  <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Streaming Source</div>
                  <button className="w-full py-1.5 border border-[#3fb950] text-[#3fb950] font-bold text-[11px] rounded transition-colors mb-2 bg-[#3fb950]/10">
                     Build Navigation (World)
                  </button>
                  <label className="flex items-center gap-2 text-[11px] text-[#8b949e] cursor-pointer mb-2"><input type="checkbox" className="accent-[#e3b341]" defaultChecked/> Enable Streaming</label>
                  <div className="font-bold text-[#c9d1d9] tracking-wider uppercase text-[9px] mb-2 mt-4 bg-[#21262d] px-1 py-0.5 rounded">HLOD (Hierarchical LOD)</div>
                  <button className="w-full py-1.5 bg-[#e3b341] text-black font-bold text-[11px] rounded mb-2 shadow-[0_0_10px_rgba(227,179,65,0.3)]">Build HLODs</button>
               </div>
              </>
              ) : mode === 'Niagara' ? (
              <>
               <div>
                  <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Niagara Emitter Settings</div>
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-[#8b949e] font-bold">Spawn Rate</span>
                        <input type="number" defaultValue="250" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[#8b949e] font-bold">Life Min/Max</span>
                        <div className="flex gap-1 w-20">
                           <input type="number" defaultValue="1.5" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-full text-right font-mono" />
                           <input type="number" defaultValue="3.0" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-full text-right font-mono" />
                        </div>
                     </div>
                  </div>
                  <div className="font-bold text-[#c9d1d9] tracking-wider uppercase text-[9px] mb-2 mt-4 bg-[#21262d] px-1 py-0.5 rounded">Renderer</div>
                  <select className="bg-[#0d1117] border border-[#30363d] rounded px-1 py-1 text-[#bc8cff] outline-none w-full text-[10px] mb-2">
                     <option>Sprite Renderer</option>
                     <option>Mesh Renderer</option>
                     <option>Ribbon Renderer</option>
                  </select>
               </div>
              </>
              ) : mode === 'Chaos_Physics' ? (
              <>
               <div>
                  <div className="font-bold text-[#f85149] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Rigid Body & Fluid Dynamics</div>
                  <div className="space-y-2">
                     <label className="flex items-center gap-2 text-[10px] text-[#8b949e] cursor-pointer"><input type="checkbox" className="accent-[#f85149]" defaultChecked/> Enable Gravity</label>
                     <label className="flex items-center gap-2 text-[10px] text-[#8b949e] cursor-pointer"><input type="checkbox" className="accent-[#f85149]" defaultChecked/> Enable Micro-Aerodynamics</label>
                     <div className="flex flex-col gap-1 mt-2">
                        <span className="text-[#8b949e] font-bold text-[9px]">Linear Damping</span>
                        <input type="range" min="0" max="100" defaultValue="10" className="accent-[#f85149]" />
                     </div>
                     <div className="flex flex-col gap-1 mt-2">
                        <span className="text-[#8b949e] font-bold text-[9px]">Wind Tunnel / Drafting Drag</span>
                        <input type="range" min="0" max="100" defaultValue="45" className="accent-[#f85149]" />
                     </div>
                  </div>
               </div>
               <div className="mt-4">
                  <div className="font-bold text-[#f85149] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Micro-Thermodynamics</div>
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-[#8b949e] font-bold">Capillary Rate (Wetness)</span>
                        <input type="number" defaultValue="2.5" className="bg-[#0d1117] border border-[#30363d] text-[#f85149] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[#8b949e] font-bold">Heat Mirage Distortion</span>
                        <input type="number" defaultValue="0.02" className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                     </div>
                  </div>
                  <div className="font-bold text-[#c9d1d9] tracking-wider uppercase text-[9px] mb-2 mt-4 bg-[#21262d] px-1 py-0.5 rounded">Fracture Tools</div>
                  <button className="w-full py-1.5 bg-[#f85149] text-white font-bold text-[11px] rounded mb-2 shadow-[0_0_10px_rgba(248,81,73,0.3)]">Voronoi Fracture</button>
               </div>
              </>
              ) : mode === 'MetaHuman' ? (
              <>
               <div>
                  <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">MetaHuman Importer</div>
                  <button className="w-full py-1.5 border border-[#bc8cff] text-[#bc8cff] font-bold text-[11px] rounded transition-colors mb-2 bg-[#bc8cff]/10">
                     Connect to Quixel Bridge
                  </button>
                  <div className="font-bold text-[#c9d1d9] tracking-wider uppercase text-[9px] mb-2 mt-4 bg-[#21262d] px-1 py-0.5 rounded">LOD Settings</div>
                  <div className="flex items-center justify-between">
                     <span className="text-[#8b949e] font-bold text-[10px]">Min LOD</span>
                     <select className="bg-[#0d1117] border border-[#30363d] rounded px-1 py-1 text-white outline-none w-16 text-[10px]">
                        <option>0</option><option>1</option><option>2</option>
                     </select>
                  </div>
               </div>
              </>
              ) : mode === 'Voxel' ? (
              <>
               <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Voxel Details</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Grid Scale (u)</span>
                       <input type="number" defaultValue="1" className="bg-[#0d1117] border border-[#30363d] text-[#e3b341] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Brush Size</span>
                       <div className="flex gap-1">
                          <button className="bg-[#21262d] w-6 h-6 flex items-center justify-center rounded text-[10px] hover:bg-[#30363d] text-white">1</button>
                          <button className="bg-[#21262d] w-6 h-6 flex items-center justify-center rounded text-[10px] hover:bg-[#30363d] text-white border border-[#e3b341]">2</button>
                          <button className="bg-[#21262d] w-6 h-6 flex items-center justify-center rounded text-[10px] hover:bg-[#30363d] text-white">4</button>
                       </div>
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-4">AI Voxel Generator</div>
                 <textarea className="w-full bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-[10px] text-[#c9d1d9] outline-none focus:border-[#e3b341] h-16 min-h-[64px] resize-none mb-1 custom-scrollbar" placeholder="e.g. Generate a small ruined tower..."></textarea>
                 <button className="w-full py-1.5 bg-[#e3b341]/20 border border-[#e3b341]/50 hover:bg-[#e3b341]/30 hover:border-[#e3b341] text-[#e3b341] font-bold text-[10px] rounded transition-colors flex items-center justify-center gap-2">
                    <Brain size={12}/> Generate Voxel Obj
                 </button>
              </div>
              </>
              ) : mode === 'Blueprint' ? (
              <>
               <div>
                 <div className="font-bold text-[#1f6feb] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Variables & Logic</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Health Points</span>
                       <input type="number" defaultValue="100" className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] px-1 py-1 outline-none text-[10px] rounded w-16 text-right font-mono" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Is Interactable</span>
                       <input type="checkbox" defaultChecked className="accent-[#1f6feb] w-3 h-3" />
                    </div>
                 </div>
               </div>
               <div>
                  <div className="font-bold text-[#1f6feb] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Functions</div>
                  <button className="w-full py-1.5 border border-[#30363d] hover:border-[#58a6ff] text-[#c9d1d9] font-bold text-[11px] rounded transition-colors flex items-center justify-center gap-2">
                     <Plus size={12}/> Override Function
                  </button>
               </div>
              </>
              ) : mode === 'AI_Assist' ? (
              <>
               <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 flex items-center gap-1"><Globe size={10}/> Generation Engine</div>
                 <div className="bg-[#0d1117] border border-[#e3b341]/30 rounded p-2 text-[10px] text-[#8b949e] flex flex-col gap-1">
                    <div>Model: <span className="text-[#58a6ff] font-mono">Qwen-VL-Chat (GGUF)</span></div>
                    <div>Mode: <span className="text-[#e3b341] font-bold">100% Core Reality</span></div>
                    <div>Separation: <span className="text-white">Active (Destructible Prefabs)</span></div>
                    <div>Auto-Material: <span className="text-[#3fb950] font-bold">Enabled</span></div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1 mt-3">Prompt / Instructions</div>
                 <textarea className="w-full h-24 bg-[#0d1117] border border-[#30363d] rounded p-2 text-[#c9d1d9] text-[10px] outline-none font-mono focus:border-[#e3b341]/50 transition-colors custom-scrollbar" placeholder="e.g., Generate a small swamp outpost. Ensure the cabins use rotting wood and the roofs use rusted corrugated iron. Separate all planks for physics..."></textarea>
                 <button className="w-full py-2 bg-gradient-to-r from-[#e3b341]/80 to-[#bc8cff]/80 hover:from-[#e3b341] hover:to-[#bc8cff] text-[#0d1117] font-bold text-[11px] rounded transition-colors flex items-center justify-center gap-2 mt-2 shadow-[0_0_15px_rgba(227,179,65,0.2)]">
                    <Wand2 size={14}/> Generate 100% Real
                 </button>
              </div>
              </>
              ) : mode === 'Pathing' ? (
              <>
               <div>
                 <div className="font-bold text-[#3fb950] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Path Configuration</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Path Name</span>
                       <input type="text" defaultValue="Spline_OrcCamp" className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] px-1 py-1 outline-none text-[10px] rounded w-24 font-mono w-32" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Spline Type</span>
                       <span className="text-[#c9d1d9] font-bold text-[10px]">{splineType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Node Count</span>
                       <span className="text-[#c9d1d9] font-bold text-[10px] font-mono">{splineNodes.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Closed Loop</span>
                       <input type="checkbox" className="accent-[#3fb950] w-3 h-3" defaultChecked />
                    </div>
                    <button 
                       onClick={() => setSplineNodes([])}
                       className="w-full text-center px-2 py-1.5 bg-[#f85149]/10 border border-[#f85149]/30 hover:bg-[#f85149]/20 text-[#f85149] rounded text-[10px] font-bold mt-2 transition-colors uppercase tracking-wider"
                    >
                       Clear Path
                    </button>
                 </div>
              </div>
              <div>
                 {activeSplineNode !== null && splineNodes[activeSplineNode] ? (
                   <>
                     <div className="font-bold text-[#3fb950] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Node Details (Index {activeSplineNode})</div>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <span className="text-[#8b949e] font-bold">X Position</span>
                           <input type="number" value={splineNodes[activeSplineNode].x.toFixed(2)} onChange={(e) => {
                               const v = parseFloat(e.target.value);
                               if(!isNaN(v)) {
                                   setSplineNodes(prev => prev.map((n, i) => i === activeSplineNode ? {...n, x: v} : n));
                               }
                           }} className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-20 text-right font-mono" />
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-[#8b949e] font-bold">Y Position</span>
                           <input type="number" value={splineNodes[activeSplineNode].y.toFixed(2)} onChange={(e) => {
                               const v = parseFloat(e.target.value);
                               if(!isNaN(v)) {
                                   setSplineNodes(prev => prev.map((n, i) => i === activeSplineNode ? {...n, y: v} : n));
                               }
                           }} className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-20 text-right font-mono" />
                        </div>
                        <button 
                           onClick={() => {
                               setSplineNodes(prev => prev.filter((_, i) => i !== activeSplineNode));
                               setActiveSplineNode(null);
                           }}
                           className="w-full text-center px-2 py-1.5 bg-[#f85149]/10 border border-[#f85149]/30 hover:bg-[#f85149]/20 text-[#f85149] rounded text-[10px] font-bold mt-2 transition-colors uppercase tracking-wider"
                        >
                           Delete Node
                        </button>
                     </div>
                   </>
                 ) : (
                    <div className="text-[10px] text-[#8b949e] italic text-center py-4">Select a node to edit details. Double-click on the map to add a node.</div>
                 )}
              </div>
              </>
              ) : mode === 'Volumes' ? (
              <>
               <div>
                 <div className="font-bold text-[#f85149] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Volume Settings</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Volume Type</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-[#f85149] px-1 overflow-hidden outline-none text-[10px] rounded w-32 pb-0.5">
                          <option>Blocking Volume</option>
                          <option>Trigger Volume</option>
                          <option>Kill Z Volume</option>
                          <option>Audio Volume</option>
                       </select>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold" title="Visible in game debug">Hidden In Game</span>
                       <input type="checkbox" className="accent-[#f85149] w-3 h-3" defaultChecked />
                    </div>
                 </div>
              </div>
              <div>
                 <div className="font-bold text-[#f85149] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Auto-Fit Tools</div>
                 <button className="w-full py-1.5 border border-[#30363d] hover:border-[#f85149] bg-[#0d1117] text-[#c9d1d9] font-bold text-[11px] rounded transition-colors mb-2 flex items-center justify-center gap-2"><Maximize2 size={12}/> Fit to Selected Mesh</button>
                 <button className="w-full py-1.5 border border-[#30363d] hover:border-[#58a6ff] bg-[#0d1117] text-[#c9d1d9] font-bold text-[11px] rounded transition-colors mb-2 flex items-center justify-center gap-2"><Grid size={12}/> Snap Bounds to Grid</button>
              </div>
              <div>
                 <div className="font-bold text-[#f85149] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Collision Rules</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold pt-1">Players</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-white px-1 outline-none text-[9px] rounded">
                          <option>Block</option>
                          <option>Overlap</option>
                          <option>Ignore</option>
                       </select>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold pt-1">NPCs / Monsters</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-white px-1 outline-none text-[9px] rounded">
                          <option>Block</option>
                          <option>Overlap</option>
                          <option>Ignore</option>
                       </select>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold pt-1">Projectiles</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-white px-1 outline-none text-[9px] rounded">
                          <option>Ignore</option>
                          <option>Block</option>
                          <option>Overlap</option>
                       </select>
                    </div>
                 </div>
              </div>
              </>
              ) : mode !== 'NPC' ? (
              <>
               <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Static Mesh</div>
                 <div className="bg-[#0d1117] border border-[#30363d] p-2 rounded flex items-center justify-between">
                    <span className="text-[#58a6ff] font-mono">SM_Wall_02</span>
                    <button className="text-[#8b949e] hover:text-white"><Search size={12}/></button>
                 </div>
              </div>

               <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Materials</div>
                 <div className="bg-[#0d1117] border border-[#30363d] p-2 rounded flex items-center justify-between">
                    <span className="text-[#c9d1d9] font-mono text-[10px] flex items-center gap-2"><div className="w-3 h-3 bg-gray-500 rounded-sm"></div> M_Concrete_Rough</span>
                    <button className="text-[#8b949e] hover:text-white"><Search size={12}/></button>
                 </div>
              </div>

              <div>
                 <div className="font-bold text-[#e3b341] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Physics</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Simulate Physics</span>
                       <input type="checkbox" className="accent-[#58a6ff] w-3 h-3" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Generate Overlap Events</span>
                       <input type="checkbox" className="accent-[#58a6ff] w-3 h-3" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Collision Preset</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-white px-1 outline-none text-[10px] rounded">
                          <option>BlockAll</option>
                          <option>OverlapAll</option>
                          <option>Custom</option>
                       </select>
                    </div>
                 </div>
              </div>
              </>
              ) : (
              <>
               <div>
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">AI Behavior & Pathing</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Behavior Tree</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-24">
                          <option>BT_Orc_Melee</option>
                          <option>BT_Coward</option>
                          <option>BT_Patrol</option>
                       </select>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Patrol Route</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] px-1 py-1 outline-none text-[10px] rounded w-24 font-mono">
                          <option>Spline_OrcCamp</option>
                          <option>Path_River</option>
                          <option>-- None --</option>
                       </select>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Spawn Trigger Area</span>
                       <button className="bg-[#238636] text-white px-2 py-0.5 rounded text-[9px] uppercase tracking-wide">Assign Box</button>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Snap to Ground</span>
                       <input type="checkbox" className="accent-[#58a6ff] w-3 h-3" defaultChecked title="Prevent clipping/burying inside landscape" />
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[#8b949e] font-bold">Spawn VFX</span>
                       <select className="bg-[#0d1117] border border-[#30363d] text-white px-1 py-1 outline-none text-[10px] rounded w-24 overflow-hidden text-ellipsis">
                          <option>None (Instant)</option>
                          <option>Emerge from Dirt (VFX_DirtBurst)</option>
                          <option>Emerge from Water (VFX_Splash)</option>
                          <option>Summon Portal (VFX_DarkPortal)</option>
                          <option>Drop from Sky</option>
                       </select>
                    </div>
                 </div>
              </div>

               <div>
                 <div className="font-bold text-[#bc8cff] tracking-wider uppercase text-[10px] mb-2 border-b border-[#30363d] pb-1">Stats & Faction</div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between bg-[#0d1117] border border-[#30363d] rounded p-1">
                       <span className="text-[#8b949e] font-bold px-1">Health</span>
                       <input type="number" defaultValue="250" className="w-16 bg-transparent text-right outline-none text-white font-mono pr-1" />
                    </div>
                    <div className="flex items-center justify-between bg-[#0d1117] border border-[#30363d] rounded p-1">
                       <span className="text-[#8b949e] font-bold px-1">Damage Base</span>
                       <input type="number" defaultValue="45" className="w-16 bg-transparent text-right outline-none text-[#f85149] font-mono pr-1" />
                    </div>
                    <div className="flex items-center justify-between bg-[#0d1117] border border-[#30363d] rounded p-1">
                       <span className="text-[#8b949e] font-bold px-1">Faction</span>
                       <select className="bg-transparent text-white outline-none text-[10px] flex-1 text-right">
                          <option>Greenskins</option>
                          <option>Undead</option>
                          <option>Player_Allies</option>
                       </select>
                    </div>
                 </div>
              </div>
              </>
              )}
           </div>
        </div>

      </div>

      {/* Content Drawer */}
      {isContentBrowserOpen && (
         <div className="h-64 border-t border-[#30363d] bg-[#161b22] shrink-0 flex flex-col z-40">
            <div className="flex items-center gap-2 p-2 border-b border-[#30363d] bg-[#0d1117]">
               <Folder size={14} className="text-[#8b949e]" />
               <span className="text-[11px] font-bold uppercase tracking-wide">Content Drawer</span>
               <div className="flex items-center gap-2 ml-4">
                  <span className="text-[10px] text-[#8b949e] hover:text-white cursor-pointer px-2 border-r border-[#30363d]">All Models</span>
                  <span className="text-[10px] text-[#58a6ff] hover:text-white cursor-pointer px-2 border-r border-[#30363d]">Architecture</span>
                  <span className="text-[10px] text-[#8b949e] hover:text-white cursor-pointer px-2 border-r border-[#30363d]">Props</span>
                  <span className="text-[10px] text-[#8b949e] hover:text-white cursor-pointer px-2">Materials</span>
               </div>
               <div className="ml-auto w-48 bg-[#0d1117] border border-[#30363d] rounded flex items-center px-2 py-0.5">
                  <Search size={12} className="text-[#8b949e]" />
                  <input type="text" placeholder="Search Content..." className="bg-transparent text-[10px] outline-none ml-2 flex-1 text-white" />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-wrap content-start gap-4">
               {/* Architecture Content */}
               {[
                  { name: 'SM_Wall_01', type: 'StaticMesh', icon: Box, color: '#8b949e' },
                  { name: 'SM_Wall_02', type: 'StaticMesh', icon: Box, color: '#8b949e' },
                  { name: 'SM_Floor_01', type: 'StaticMesh', icon: Box, color: '#8b949e' },
                  { name: 'BP_Door_Auto', type: 'Blueprint', icon: Workflow, color: '#1f6feb' },
                  { name: 'Location_Camp', type: 'Prefab', icon: Flag, color: '#e3b341' },
                  { name: 'POI_Temple', type: 'Prefab', icon: Map, color: '#bc8cff' },
                  { name: 'Decal_Dirt', type: 'Material', icon: Stamp, color: '#bc8cff' },
                  { name: 'Phys_Rubble', type: 'Chaos', icon: Bomb, color: '#e3b341' },
               ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group cursor-grab w-24">
                     <div className="w-full aspect-square bg-[#0d1117] border border-[#30363d] group-hover:border-[#58a6ff] rounded-lg flex items-center justify-center relative overflow-hidden transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <item.icon size={32} color={item.color} className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                        <span className="absolute bottom-1 left-1.5 text-[8px] font-bold px-1 rounded bg-[#21262d]/80 text-[#8b949e] uppercase border border-[#30363d]">{item.type}</span>
                     </div>
                     <span className="text-[10px] font-mono text-[#c9d1d9] text-center w-full truncate">{item.name}</span>
                  </div>
               ))}
               
               <div className="flex flex-col items-center gap-2 group cursor-pointer w-24">
                  <div className="w-full aspect-square bg-[#161b22] border border-dashed border-[#58a6ff]/50 hover:border-[#58a6ff] rounded-lg flex flex-col items-center justify-center text-[#58a6ff] transition-colors relative">
                     <Plus size={24} className="mb-1" />
                     <span className="text-[9px] font-bold">Import</span>
                  </div>
                  <span className="text-[10px] text-transparent truncate">New</span>
               </div>
            </div>
         </div>
      )}

      {/* Footer / Bottom Status Bar */}
      <div className="h-7 bg-[#0d1117] border-t border-[#30363d] flex items-center px-2 justify-between shrink-0 z-50">
        <div className="flex items-center gap-3">
           <button 
              onClick={() => setIsContentBrowserOpen(!isContentBrowserOpen)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${isContentBrowserOpen ? 'bg-[#21262d] text-[#58a6ff] border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'}`}
           >
              <Folder size={12} /> {isContentBrowserOpen ? 'Close Content Drawer' : 'Content Drawer'} {isContentBrowserOpen ? <ChevronDown size={12}/> : <ChevronUp size={12}/>}
           </button>
           <div className="w-px h-3 bg-[#30363d]"></div>
           <span className="text-[10px] text-[#8b949e] font-bold">MapEditor v1.2</span>
           <div className="w-px h-3 bg-[#30363d]"></div>
           <span className="text-[9px] text-[#c9d1d9] flex items-center gap-1"><Grid size={10}/> Grid: 10uu</span>
        </div>
        
        <div className="flex items-center gap-2">
           {isPerfMinimized && (
              <button 
                 onClick={() => setIsPerfMinimized(false)}
                 className="flex items-center gap-2 text-[9px] bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] px-2 py-0.5 rounded transition-colors"
              >
                 <Activity size={10} className="text-[#8b949e]" />
                 <span className="text-[#7ee787] font-mono">CPU:18%</span>
                 <span className="text-[#e3b341] font-mono">RAM:4.2G</span>
                 <span className="text-[#58a6ff] font-mono">GPU:65%</span>
                 <Maximize2 size={10} className="text-[#8b949e] ml-1" />
              </button>
           )}
        </div>
      </div>
    </div>
  );
}
