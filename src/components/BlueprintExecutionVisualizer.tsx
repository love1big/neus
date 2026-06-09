import React, { useState, useEffect, useRef } from 'react';
import { Activity, Play, Pause, FastForward, Square, RotateCcw, Cpu, Network, Database, Zap, ArrowRight, Settings2 } from 'lucide-react';

// Simulated node graph data
const NODES = [
  { id: 'start', type: 'event', label: 'Event BeginPlay', x: 50, y: 150, color: '#f85149' },
  { id: 'delay', type: 'logic', label: 'Delay (0.5s)', x: 250, y: 150, color: '#8b949e' },
  { id: 'branch', type: 'logic', label: 'Branch (If)', x: 450, y: 150, color: '#8b949e' },
  { id: 'getData', type: 'function', label: 'Get Player Data', x: 250, y: 300, color: '#3fb950' },
  { id: 'calc', type: 'function', label: 'Calculate Damage', x: 450, y: 300, color: '#3fb950' },
  { id: 'applyDmg', type: 'action', label: 'Apply Damage', x: 650, y: 100, color: '#58a6ff' },
  { id: 'playFX', type: 'action', label: 'Play Hit VFX', x: 650, y: 200, color: '#58a6ff' },
  { id: 'log', type: 'action', label: 'Print String', x: 850, y: 150, color: '#58a6ff' },
];

const CONNECTIONS = [
  { id: 'c1', from: 'start', to: 'delay', type: 'exec' },
  { id: 'c2', from: 'delay', to: 'branch', type: 'exec' },
  { id: 'c3', from: 'getData', to: 'branch', type: 'data_bool', fromPort: 'IsValid' },
  { id: 'c4', from: 'branch', to: 'applyDmg', type: 'exec', fromPort: 'True' },
  { id: 'c5', from: 'branch', to: 'playFX', type: 'exec', fromPort: 'False' },
  { id: 'c6', from: 'getData', to: 'calc', type: 'data_float', fromPort: 'BaseDmg' },
  { id: 'c7', from: 'calc', to: 'applyDmg', type: 'data_float', fromPort: 'Result' },
  { id: 'c8', from: 'applyDmg', to: 'log', type: 'exec' },
  { id: 'c9', from: 'playFX', to: 'log', type: 'exec' },
];

export default function BlueprintExecutionVisualizer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [activePackets, setActivePackets] = useState<Array<{id: string, connectionId: string, progress: number, color: string, isData: boolean}>>([]);
  
  const requestRef = useRef<number>();
  const idCounter = useRef(0);
  const spawnTimer = useRef(0);

  useEffect(() => {
    if (!isPlaying) return;

    const animate = (time: number) => {
      spawnTimer.current += 1 * speed;
      
      setActivePackets(prev => {
        let newPackets = [...prev];
        
        // Spawn new packets every few frames to simulate continuous execution flow
        if (spawnTimer.current > 60) {
           spawnTimer.current = 0;
           // Spawn an execution packet at the start
           newPackets.push({
              id: `p_${idCounter.current++}`,
              connectionId: 'c1',
              progress: 0,
              color: '#ffffff',
              isData: false
           });
           
           // Occasionally spawn data fetch queries
           if (Math.random() > 0.5) {
              newPackets.push({
                 id: `p_${idCounter.current++}`,
                 connectionId: 'c6',
                 progress: 0,
                 color: '#3fb950',
                 isData: true
              });
           }
        }

        // Update progress
        newPackets = newPackets.map(p => {
          let newProgress = p.progress + (p.isData ? 0.02 * speed : 0.015 * speed);
          return { ...p, progress: newProgress };
        });

        // Handle routing when a packet reaches the end of its connection
        const finishedPackets = newPackets.filter(p => p.progress >= 1);
        const ongoingPackets = newPackets.filter(p => p.progress < 1);
        
        let routedPackets: any[] = [];
        
        finishedPackets.forEach(p => {
           if (p.connectionId === 'c1') {
              routedPackets.push({...p, id: `p_${idCounter.current++}`, progress: 0, connectionId: 'c2'});
           } else if (p.connectionId === 'c2') {
              // Branch evaluation
              routedPackets.push({...p, id: `p_${idCounter.current++}`, progress: 0, connectionId: Math.random() > 0.5 ? 'c4' : 'c5'});
              // Trigger data fetch visually
              routedPackets.push({
                 id: `p_${idCounter.current++}`,
                 connectionId: 'c3',
                 progress: 0,
                 color: '#e3b341', // bool color
                 isData: true
              });
           } else if (p.connectionId === 'c6') {
              routedPackets.push({...p, id: `p_${idCounter.current++}`, progress: 0, connectionId: 'c7'});
           } else if (p.connectionId === 'c4' || p.connectionId === 'c5') {
              routedPackets.push({...p, id: `p_${idCounter.current++}`, progress: 0, connectionId: p.connectionId === 'c4' ? 'c8' : 'c9'});
           }
        });

        return [...ongoingPackets, ...routedPackets];
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isPlaying, speed]);


  // Helper to generate bezier curves
  const getPath = (conn: any) => {
     const fromNode = NODES.find(n => n.id === conn.from);
     const toNode = NODES.find(n => n.id === conn.to);
     if (!fromNode || !toNode) return '';

     const isData = conn.type.startsWith('data');
     
     // Basic offsets
     const startX = fromNode.x + 140; 
     const startY = fromNode.y + (isData ? 40 : 20); // Exec ports at top, data lower
     const endX = toNode.x;
     const endY = toNode.y + (isData ? 40 : 20);

     const cpX1 = startX + 50;
     const cpY1 = startY;
     const cpX2 = endX - 50;
     const cpY2 = endY;

     return `M ${startX} ${startY} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${endX} ${endY}`;
  };

  const getConnectionColor = (type: string) => {
     if (type === 'exec') return 'rgba(255,255,255,0.2)';
     if (type === 'data_bool') return 'rgba(227, 179, 65, 0.4)'; // yellow
     if (type === 'data_float') return 'rgba(63, 185, 80, 0.4)'; // green
     return 'rgba(255,255,255,0.2)';
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0d1117] text-[#c9d1d9] font-sans text-xs overflow-hidden select-none">
      
      {/* Header */}
      <div className="flexitems-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2 shrink-0 z-10 shadow-md flex">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#bc8cff]/20 to-transparent text-[#bc8cff] rounded border border-[#bc8cff]/50 font-black shadow-inner uppercase tracking-widest text-[10px]">
               <Activity size={14}/> Blueprint Execution Flow
            </div>
            <div className="text-[10px] text-[#8b949e] font-mono flex gap-3">
               <span>Nodes: {NODES.length}</span>
               <span>Links: {CONNECTIONS.length}</span>
               <span>Active Packets: <span className="text-white font-bold">{activePackets.length}</span></span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <div className="flex bg-[#21262d] rounded border border-[#30363d] overflow-hidden shadow-inner">
               <button onClick={() => setSpeed(0.5)} className={`px-2 py-1 transition-colors ${speed === 0.5 ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-white'}`}>0.5x</button>
               <button onClick={() => setSpeed(1)} className={`px-2 py-1 transition-colors ${speed === 1 ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-white'}`}>1x</button>
               <button onClick={() => setSpeed(2)} className={`px-2 py-1 transition-colors flex items-center gap-1 ${speed === 2 ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-white'}`}><FastForward size={12}/> 2x</button>
            </div>
            
            <div className="flex gap-1 ml-2">
               <button onClick={() => setIsPlaying(!isPlaying)} className={`p-1.5 border rounded transition-colors shadow ${isPlaying ? 'bg-[#bc8cff] border-[#bc8cff] text-black' : 'bg-[#21262d] border-[#30363d] text-white hover:bg-[#30363d]'}`}>
                  {isPlaying ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor" className="ml-0.5"/>}
               </button>
               <button className="p-1.5 bg-[#21262d] border border-[#30363d] text-white rounded hover:bg-[#30363d] transition-colors"><Square size={14} fill="currentColor"/></button>
            </div>
         </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="flex-1 relative overflow-hidden bg-[#0a0c10]">
         {/* Dot Grid Background */}
         <div className="absolute inset-0 bg-[radial-gradient(#30363d_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>

         <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Base connection lines */}
            {CONNECTIONS.map(conn => (
               <path 
                  key={conn.id} 
                  d={getPath(conn)} 
                  fill="none" 
                  stroke={getConnectionColor(conn.type)} 
                  strokeWidth="2"
                  className={conn.type === 'exec' ? 'drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]' : ''}
               />
            ))}

            {/* Glowing animated packets */}
            {activePackets.map(packet => {
               const conn = CONNECTIONS.find(c => c.id === packet.connectionId);
               if (!conn) return null;
               const pathData = getPath(conn);
               
               // We use SVG animateMotion or calculate pos. 
               // For simplicity in React without heavy DOM querying, 
               // we approximate position if we had a path parser, 
               // but SVG has <path d> so we can use <circle> with <animateMotion> or strokeDasharray trick.
               // Since we want dynamic control via React state (packet.progress):
               // We will use a highly simplified linear interpolation for the bezier purely for visual effect, 
               // OR use SVG stroke-dasharray to simulate the packet moving.
               // Stroke dasharray approach:
               const dashLength = packet.isData ? 8 : 16;
               const pathLength = 300; // estimated
               
               return (
                  <path 
                     key={packet.id}
                     d={pathData}
                     fill="none"
                     stroke={packet.color}
                     strokeWidth={packet.isData ? 3 : 4}
                     strokeLinecap="round"
                     strokeDasharray={`${dashLength} ${pathLength}`}
                     strokeDashoffset={pathLength - (packet.progress * pathLength)}
                     className="drop-shadow-[0_0_8px_currentColor]"
                  />
               );
            })}
         </svg>

         {/* Nodes */}
         {NODES.map(node => (
            <div 
               key={node.id} 
               className="absolute w-[140px] bg-[#161b22]/90 backdrop-blur border border-[#30363d] rounded-md shadow-2xl flex flex-col font-sans z-10"
               style={{ left: node.x, top: node.y }}
            >
               {/* Node Header */}
               <div className="px-2 py-1 w-full rounded-t-sm flex items-center gap-1.5 border-b border-[#30363d]" style={{backgroundColor: `${node.color}20`}}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: node.color}}></div>
                  <span className="font-bold text-white text-[10px] truncate" style={{textShadow: '0 1px 2px black'}}>{node.label}</span>
               </div>
               
               {/* Node Body (Ports) */}
               <div className="p-1.5 flex flex-col gap-1.5 relative bg-[#0d1117]/80 rounded-b-md">
                  {/* Exec Ports */}
                  <div className="flex justify-between items-center text-[9px] text-[#8b949e]">
                     <div className="flex items-center gap-1">
                        {node.type !== 'start' && <div className="w-2.5 h-3 bg-white/20 border border-white/50 rounded-sm symbol-exec"></div>}
                        {node.type !== 'start' && <span>In</span>}
                     </div>
                     <div className="flex items-center gap-1">
                        {node.type !== 'action' && node.type !== 'function' && <span>Out</span>}
                        {node.type !== 'action' && node.type !== 'function' && <div className="w-2.5 h-3 bg-white/80 border border-white rounded-sm shadow-[0_0_5px_white]"></div>}
                        {node.type === 'action' && <span>Out</span>}
                        {node.type === 'action' && <div className="w-2.5 h-3 bg-white/80 border border-white rounded-sm shadow-[0_0_5px_white]"></div>}
                     </div>
                  </div>

                  {/* Data Ports */}
                  {(node.type === 'function' || node.id === 'branch') && (
                     <div className="flex justify-between items-center text-[9px] text-[#8b949e] mt-1 border-t border-[#30363d] pt-1">
                        {node.id === 'branch' ? (
                           <div className="flex items-center gap-1">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#e3b341]/20 border border-[#e3b341]/60"></div>
                              <span>Condition</span>
                           </div>
                        ) : (
                           <div></div>
                        )}
                        
                        {(node.id === 'getData' || node.id === 'calc') && (
                           <div className="flex items-center gap-1 ml-auto">
                              <span>Data</span>
                              <div className="w-2.5 h-2.5 rounded-full bg-[#3fb950] shadow-[0_0_5px_#3fb950]"></div>
                           </div>
                        )}
                     </div>
                  )}

                  {node.id === 'branch' && (
                     <div className="flex justify-end items-center text-[9px] text-[#8b949e]">
                        <span className="mr-1">True</span>
                        <div className="w-2.5 h-3 bg-white/80 border border-white rounded-sm"></div>
                     </div>
                  )}
                  {node.id === 'branch' && (
                     <div className="flex justify-end items-center text-[9px] text-[#8b949e]">
                        <span className="mr-1">False</span>
                        <div className="w-2.5 h-3 bg-white/80 border border-white rounded-sm"></div>
                     </div>
                  )}
               </div>

               {/* Active execution highlight */}
               {activePackets.some(p => Math.abs(p.progress - 0.5) < 0.2 && CONNECTIONS.find(c => c.id === p.connectionId)?.to === node.id) && (
                  <div className="absolute inset-0 border-2 border-white/50 rounded-md animate-pulse pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
               )}
            </div>
         ))}
      </div>
      
      <div className="h-6 bg-[#0d1117] border-t border-[#30363d] flex items-center px-2 text-[9px] text-[#8b949e] shrink-0 font-mono">
         Visualization Active • Real-time Data Stream Simulated • Execution Threads: 1
      </div>
    </div>
  );
}
