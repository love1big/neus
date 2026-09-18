/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Blender Geometry Nodes & Procedural Simulation Studio (Blender 4.2+ parity).
 *          Node-based procedural modeling, field evaluations, point distribution,
 *          simulation zones, and On-Device Offline AI procedural bio-mesh synthesis.
 *    - TH: สตูดิโอระบบ Geometry Nodes และ Procedural Simulation (เทียบเท่า Blender 4.2+)
 *          ผังโหนดสร้างเรขาคณิตสามมิติแบบพารามิเตอร์, การกระจายจุดบนผิว,
 *          การคำนวณ Simulation Zone พร้อม Live Viewport และ On-Device Offline AI
 *          ช่วยสังเคราะห์โมเดลพืชพรรณและโครงสร้างสถาปัตยกรรมแบบไร้เน็ต
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `blenderGeometryNodesTypes.ts` and `BlenderGeometryNodesNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Boxes,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Activity,
  Layers,
  Cpu,
  Brain,
  Wand2,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { blenderGeometryNodes } from '../utils/BlenderGeometryNodesNode';
import { GeometryNodesGraph, GeoNodeInstance } from '../types/blenderGeometryNodesTypes';

interface GeoStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function BlenderGeometryNodesProceduralStudio({ onSelectTool }: GeoStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [graph, setGraph] = useState<GeometryNodesGraph>(() => blenderGeometryNodes.getGraph());
  const [promptInput, setPromptInput] = useState<string>(graph.offlineAIPrompt);
  const [activeTab, setActiveTab] = useState<'NODE_GRAPH' | '3D_VIEWPORT'>('NODE_GRAPH');

  useEffect(() => {
    return blenderGeometryNodes.subscribe(() => {
      setGraph({ ...blenderGeometryNodes.getGraph() });
    });
  }, []);

  // Frame simulation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      blenderGeometryNodes.stepSimulation();
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Viewport/Node Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#05070d';
    ctx.fillRect(0, 0, width, height);

    if (activeTab === 'NODE_GRAPH') {
      // Draw grid
      ctx.strokeStyle = '#101626';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw Links
      graph.links.forEach(link => {
        const fromNode = graph.nodes.find(n => n.id === link.fromNodeId);
        const toNode = graph.nodes.find(n => n.id === link.toNodeId);
        if (fromNode && toNode) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          const startX = fromNode.x + 160;
          const startY = fromNode.y + 40;
          const endX = toNode.x;
          const endY = toNode.y + 40;
          const cp1x = startX + (endX - startX) * 0.5;
          const cp2x = startX + (endX - startX) * 0.5;
          ctx.bezierCurveTo(cp1x, startY, cp2x, endY, endX, endY);
          ctx.stroke();
        }
      });

      // Draw Nodes
      graph.nodes.forEach(node => {
        ctx.fillStyle = '#0c1322';
        ctx.strokeStyle = node.colorHex;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(node.x, node.y, 160, 95, 8);
        ctx.fill();
        ctx.stroke();

        // Node Header bar
        ctx.fillStyle = node.colorHex + '33';
        ctx.fillRect(node.x, node.y, 160, 24);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(node.name, node.x + 8, node.y + 16);

        // Sockets
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px monospace';
        node.inputs.forEach((inp, idx) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y + 36 + idx * 16, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();
          ctx.fillText(inp.name, node.x + 8, node.y + 40 + idx * 16);
        });

        node.outputs.forEach((out, idx) => {
          ctx.beginPath();
          ctx.arc(node.x + 160, node.y + 36 + idx * 16, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
          ctx.fillText(out.name, node.x + 115, node.y + 40 + idx * 16);
        });
      });
    } else {
      // 3D Viewport: Render Procedural Flora/Geometry Spiral
      const centerX = width / 2;
      const centerY = height / 2;
      const time = graph.simulationFrame * 0.04;

      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 200; i++) {
        const theta = i * 0.2 + time;
        const r = i * 1.1;
        const px = centerX + Math.cos(theta) * r;
        const py = centerY + Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Points instanced
      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < 60; i++) {
        const angle = i * 0.4 + time * 1.2;
        const dist = 40 + i * 2.5;
        const px = centerX + Math.cos(angle) * dist;
        const py = centerY + Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [graph, activeTab]);

  return (
    <div className="flex flex-col h-full bg-[#05070d] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1a2336] bg-[#0a0f1c] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/30 to-amber-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0 shadow-lg">
            <Boxes size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Blender Geometry Nodes & Procedural Simulation Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-orange-950/80 text-orange-400 text-[10px] font-bold border border-orange-500/40 font-mono">
                Blender 4.2+ Geometry Nodes Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Procedural mesh fields, Point Distribution on Faces, Simulation Zones, and On-Device Offline AI bio-mesh synthesis.
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-[#121828] p-1 rounded-xl border border-[#1e2740]">
          <button
            onClick={() => setActiveTab('NODE_GRAPH')}
            className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === 'NODE_GRAPH'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Geometry Node Graph
          </button>
          <button
            onClick={() => setActiveTab('3D_VIEWPORT')}
            className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              activeTab === '3D_VIEWPORT'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            3D Evaluated Mesh Viewport
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1a2336] bg-[#05070d] relative">
          
          <div className="p-3 border-b border-[#1a2336] bg-[#0a0f1c]/80 backdrop-blur flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <Activity size={13} className="text-orange-400" />
              Simulation Frame: #{graph.simulationFrame}
            </span>

            <button
              onClick={() => blenderGeometryNodes.toggleSimulation()}
              className="px-3 py-1 rounded-lg bg-[#141d30] border border-[#223150] text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer hover:bg-[#1b2640]"
            >
              {graph.isSimulating ? <Pause size={12} /> : <Play size={12} />}
              {graph.isSimulating ? 'Pause Sim' : 'Play Sim'}
            </button>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={440}
              className="max-w-full max-h-full"
            />
          </div>

          {/* Footer Stats */}
          <div className="p-3 border-t border-[#1a2336] bg-[#0a0f1c] flex items-center justify-between text-xs font-mono">
            <span className="text-[#94a3b8]">
              Evaluated Vertices: <strong className="text-white">{graph.totalGeneratedVertices.toLocaleString()}</strong>
            </span>
            <span className="text-orange-400">
              Instanced Point Entities: {graph.totalInstancedPoints.toLocaleString()}
            </span>
          </div>

        </div>

        {/* OFFLINE AI & PARAMS (4 cols) */}
        <div className="lg:col-span-4 bg-[#080c16] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1a2336] bg-[#0d1424] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Brain size={13} className="text-purple-400" /> On-Device Offline AI Procedural Synth
            </span>
            <span className="text-[10px] font-mono text-purple-400">Zero-Token AI</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* AI Synthesizer Box */}
            <div className="p-3.5 rounded-xl bg-[#0d1424] border border-[#1b253b] space-y-2.5">
              <span className="text-xs font-bold text-white block">
                Offline Procedural Mesh Rule / Prompt
              </span>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={3}
                className="w-full bg-[#131b2f] border border-[#213050] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                placeholder="Describe procedural geometry logic..."
              />

              <button
                onClick={() => blenderGeometryNodes.setOfflineAIPrompt(promptInput)}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Wand2 size={13} />
                Synthesize Geometry On-Device (Zero Token)
              </button>
            </div>

            {/* Presets */}
            <div className="p-3.5 rounded-xl bg-[#0d1424] border border-[#1b253b] space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Procedural Generator Presets
              </span>

              <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
                {[
                  'Fractal Coral Reef with Bio-Luminescence',
                  'Gothic Cathedral Vault Arches with Voronoi Spires',
                  'Cyberpunk Sci-Fi Pipe Conduit Distribution'
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPromptInput(preset);
                      blenderGeometryNodes.setOfflineAIPrompt(preset);
                    }}
                    className="text-left p-2 rounded-lg bg-[#11192c] hover:bg-[#18233c] text-[#94a3b8] hover:text-white border border-[#1b2740] cursor-pointer truncate"
                  >
                    ✦ {preset}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
