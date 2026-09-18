/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Unity Shader Graph & Sub-Graph Node Architecture Studio (Unity 6 parity).
 *          Visual node canvas for shader authoring, Custom Function HLSL embeddings,
 *          Master Stack (URP Lit), Half vs Float precision controls, live sphere preview,
 *          and On-Device Offline AI HLSL shader cross-compiler.
 *    - TH: สตูดิโอเขียนเชดเดอร์ Unity Shader Graph & Sub-Graph (Unity 6 Parity)
 *          กราฟโหนดสร้างเชดเดอร์แบบภาพ, โหนด Custom Function แทรกโค้ด HLSL,
 *          Universal Fragment Master Stack, พรีวิวลูกทรงกลม 3D แสดงผล PBR,
 *          และระบบ AI ออฟไลน์ช่วยคอมไพล์และลดชุดคำสั่ง ALU
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `unityShaderGraphTypes.ts` and `UnityShaderGraphEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  Network,
  Cpu,
  Sparkles,
  Layers,
  FileCode2,
  Activity,
  Zap,
  Sliders,
  CheckCircle2,
  Play
} from 'lucide-react';
import { unityShaderGraphEngine } from '../utils/UnityShaderGraphEngineNode';
import { UnityShaderGraphProfile } from '../types/unityShaderGraphTypes';

interface ShaderStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function UnityShaderGraphSubGraphStudio({ onSelectTool }: ShaderStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [profile, setProfile] = useState<UnityShaderGraphProfile>(() =>
    unityShaderGraphEngine.getProfile()
  );

  useEffect(() => {
    return unityShaderGraphEngine.subscribe(() => {
      setProfile({ ...unityShaderGraphEngine.getProfile() });
    });
  }, []);

  // Node Graph Canvas Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background Grid
    ctx.fillStyle = '#080c16';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#121a2d';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 25) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 25) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Draw Bézier Cables connecting nodes
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    // Fresnel to Custom Function
    ctx.moveTo(220, 150);
    ctx.bezierCurveTo(270, 150, 270, 220, 320, 220);
    ctx.stroke();

    // Custom Function to Master Stack
    ctx.moveTo(480, 230);
    ctx.bezierCurveTo(520, 230, 520, 170, 560, 170);
    ctx.stroke();

    // Draw Nodes
    profile.nodes.forEach(node => {
      const nodeWidth = 160;
      const nodeHeight = 90;

      // Node Body
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = node.type === 'MASTER_STACK' ? '#f59e0b' : '#374151';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(node.x, node.y, nodeWidth, nodeHeight, 8);
      ctx.fill();
      ctx.stroke();

      // Node Header
      ctx.fillStyle = node.type === 'MASTER_STACK' ? '#b45309' : '#1f2937';
      ctx.beginPath();
      ctx.roundRect(node.x, node.y, nodeWidth, 24, [8, 8, 0, 0]);
      ctx.fill();

      // Header Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(node.title, node.x + 8, node.y + 16);

      // Input Ports (Left)
      node.inputs.forEach((inp, idx) => {
        const portY = node.y + 42 + idx * 20;
        ctx.beginPath();
        ctx.arc(node.x, portY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px sans-serif';
        ctx.fillText(inp.name, node.x + 8, portY + 3);
      });

      // Output Ports (Right)
      node.outputs.forEach((out, idx) => {
        const portY = node.y + 42 + idx * 20;
        ctx.beginPath();
        ctx.arc(node.x + nodeWidth, portY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px sans-serif';
        ctx.fillText(out.name, node.x + nodeWidth - 30, portY + 3);
      });
    });

  }, [profile]);

  return (
    <div className="flex flex-col h-full bg-[#080c16] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1b253b] bg-[#0c1220] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg">
            <Palette size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Unity Shader Graph & Sub-Graph Node Architecture Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 text-[10px] font-bold border border-cyan-500/40 font-mono">
                Unity 6 / URP Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Visual Shader Nodes, Custom Function HLSL Embeddings, Precision Toggles, and On-Device Offline AI HLSL Optimization.
            </p>
          </div>
        </div>

        {/* AI HLSL Optimization */}
        <button
          onClick={() => unityShaderGraphEngine.optimizeHLSLWithAI()}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Zap size={13} />
          AI Optimize HLSL (Half-Precision & MAD)
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* NODE GRAPH CANVAS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1b253b] bg-[#080c16] relative">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1220]/80 backdrop-blur flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <Network size={13} className="text-cyan-400" />
              Active Pipeline: <strong className="text-cyan-400">{profile.targetPipeline}</strong>
            </span>

            <span className="text-emerald-400 font-bold">
              Precision: {profile.precision} (Optimized for Mobile/GPU)
            </span>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={440}
              className="max-w-full max-h-full"
            />
          </div>

          <div className="p-3 border-t border-[#1b253b] bg-[#0c1220] flex items-center justify-between text-xs font-mono">
            <span className="text-[#94a3b8]">Active Graph: <strong>{profile.graphName}.shadergraph</strong></span>
            <span className="text-cyan-400 font-bold">{profile.nodes.length} Nodes in Evaluation Pipeline</span>
          </div>

        </div>

        {/* COMPILED HLSL CODE (4 cols) */}
        <div className="lg:col-span-4 bg-[#090d18] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1220] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileCode2 size={13} className="text-cyan-400" /> Live Compiled HLSL
            </span>
            <span className="text-[10px] font-mono text-emerald-400">DirectX 12 / Vulkan</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#060910] border border-[#1b253b] text-emerald-400/90 leading-relaxed text-[11px] overflow-x-auto whitespace-pre">
              {profile.generatedHLSLCode}
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wider">
                On-Device Offline AI Shader Optimization
              </span>
              <p className="text-xs text-cyan-200/90 leading-relaxed">
                Automatically detects redundant vector calculations and converts 32-bit floats to 16-bit half precision with zero network requests.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
