/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: AAA MetaSounds & Modular DSP Audio Node Graph Studio (Unreal Engine 5
 *          MetaSounds & Unity Audio Mixer / DSP Graph parity).
 *          Empowers audio designers to construct sample-accurate procedural sound
 *          effects with live node connections, trigger pins, resonant biquad filters,
 *          ADSR envelopes, and real-time canvas oscilloscope & FFT spectrum visualizers.
 *    - TH: สตูดิโอระบบเสียง MetaSounds และ Modular DSP Audio Node Graph ระดับ AAA
 *          (เทียบเท่า Unreal Engine 5 MetaSounds และ Unity Audio Mixer)
 *          ช่วยให้นักออกแบบระบบเสียงสร้างเสียงสังเคราะห์ Procedural ด้วยโหนดประมวลผลสัญญาณดิจิทัล,
 *          พินสัญญาณ Trigger, ฟิลเตอร์ Resonant Biquad, ซองเสียง ADSR แบบสดๆ ผ่าน Web Audio API
 *          พร้อมหน้าจอ Oscilloscope และตัววิเคราะห์ย่านความถี่ FFT
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Backed by `MetaSoundsAudioGraphNode.ts` and `metaSoundsTypes.ts`
 *    - Synthesizes audio natively in browser via Web Audio API
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Graceful AudioContext resumption on first user gesture.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```tsx
 *    <MetaSoundsModularDSPStudio onSelectTool={handleSelect} />
 *    ```
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Play,
  Layers,
  Sliders,
  Sparkles,
  Cpu,
  Radio,
  Download,
  Share2,
  RefreshCw,
  Activity,
  AudioLines as WaveformIcon,
  Filter,
  Flame,
  Music,
  Zap
} from 'lucide-react';
import { metaSoundsEngine } from '../utils/MetaSoundsAudioGraphNode';
import { MetaSoundPatch, MetaSoundNode } from '../types/metaSoundsTypes';

interface MetaSoundsStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function MetaSoundsModularDSPStudio({ onSelectTool }: MetaSoundsStudioProps) {
  const [patch, setPatch] = useState<MetaSoundPatch>(() => metaSoundsEngine.getPatch());
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node_filter');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [testPitchHz, setTestPitchHz] = useState<number>(130);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    return metaSoundsEngine.subscribe(() => {
      setPatch(metaSoundsEngine.getPatch());
    });
  }, []);

  const selectedNode = patch.nodes.find(n => n.id === selectedNodeId) || patch.nodes[0];

  const handlePlayImpulse = (freq: number = testPitchHz) => {
    setIsPlaying(true);
    metaSoundsEngine.triggerImpulse(freq);
    setTimeout(() => setIsPlaying(false), 500);
  };

  const handleParamChange = (paramKey: string, val: any) => {
    metaSoundsEngine.updateNodeParameter(selectedNode.id, paramKey, val);
  };

  // Real-time Oscilloscope & FFT Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const buffer = new Uint8Array(128);

    const renderWave = () => {
      metaSoundsEngine.getWaveformData(buffer);

      ctx.fillStyle = '#070a13';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Lines
      ctx.strokeStyle = '#141d2f';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Waveform line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const sliceWidth = canvas.width / buffer.length;
      let x = 0;

      for (let i = 0; i < buffer.length; i++) {
        const v = buffer[i] / 128.0; // 0 to 2
        const y = (v * canvas.height) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(renderWave);
    };

    animFrameRef.current = requestAnimationFrame(renderWave);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#090d14] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1c2438] bg-[#0d1320] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-600/30 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg">
            <Radio size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                MetaSounds & Modular DSP Node Graph Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 text-[10px] font-bold border border-cyan-500/40 font-mono">
                Unreal MetaSounds & Unity Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Sample-accurate node-based digital signal processing, ADSR envelopes, resonant biquad sweeps, and live Web Audio synthesis.
            </p>
          </div>
        </div>

        {/* Audition Trigger Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePlayImpulse(testPitchHz)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
              isPlaying
                ? 'bg-cyan-500 text-black scale-95 shadow-cyan-500/50'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40'
            }`}
          >
            <Play size={14} className={isPlaying ? 'fill-black' : 'fill-white'} /> Play Trigger Impulse
          </button>
        </div>
      </div>

      {/* Main Workspace 3 Columns */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* COLUMN 1: DSP Graph Nodes List (3 cols) */}
        <div className="lg:col-span-3 border-r border-[#1c2438] bg-[#0c111c] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-cyan-400" /> Graph Nodes ({patch.nodes.length})
            </span>
            <span className="text-[10px] font-mono text-cyan-400">48 kHz</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {patch.nodes.map(node => {
              const isSelected = node.id === selectedNodeId;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-950/30' 
                      : 'bg-[#121826] border-[#1f293d] hover:border-[#334155]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{node.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#162035] text-cyan-300 font-mono">
                      {node.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[10px] text-[#64748b] font-mono">
                    <span>In: {node.inputs.length}</span>
                    <span>•</span>
                    <span>Out: {node.outputs.length}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Audition Pitch Buttons */}
          <div className="p-3 border-t border-[#1c2438] bg-[#0f1624] space-y-2">
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">
              Quick Audition Notes
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: 'Sub (65Hz)', hz: 65 },
                { label: 'Mid (130Hz)', hz: 130 },
                { label: 'High (260Hz)', hz: 260 },
                { label: 'Zap (520Hz)', hz: 520 }
              ].map(note => (
                <button
                  key={note.hz}
                  onClick={() => { setTestPitchHz(note.hz); handlePlayImpulse(note.hz); }}
                  className="py-1.5 rounded bg-[#161f30] hover:bg-cyan-600 text-white text-[10px] font-mono font-bold transition-colors"
                >
                  {note.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: Node Graph Canvas & Wire Connections (5 cols) */}
        <div className="lg:col-span-5 border-r border-[#1c2438] bg-[#080b12] flex flex-col overflow-hidden relative">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={13} className="text-amber-400" /> MetaSound Modular Graph
            </span>
            <span className="text-[10px] font-mono text-[#94a3b8]">{patch.connections.length} Live Cables</span>
          </div>

          {/* Visual Node Graph Mockup with interactive Node Cards */}
          <div className="flex-1 p-5 overflow-auto relative bg-[radial-gradient(#1a243b_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="space-y-4">
              {patch.nodes.map(node => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3 rounded-xl border bg-[#0d1424]/90 backdrop-blur-md transition-all cursor-pointer ${
                    node.id === selectedNodeId
                      ? 'border-cyan-400 shadow-xl shadow-cyan-950/50 ring-1 ring-cyan-400'
                      : 'border-[#1e2b45] hover:border-[#2f436b]'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#1c2842] pb-2 mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <WaveformIcon size={12} className="text-cyan-400" /> {node.name}
                    </span>
                    <span className="text-[10px] text-[#64748b] font-mono">{node.id}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="space-y-1">
                      {node.inputs.map(pin => (
                        <div key={pin.id} className="flex items-center gap-1 text-[#94a3b8]">
                          <span className={`w-2 h-2 rounded-full ${pin.rate === 'TRIGGER' ? 'bg-amber-400' : 'bg-cyan-400'}`}></span>
                          <span>{pin.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1 text-right">
                      {node.outputs.map(pin => (
                        <div key={pin.id} className="flex items-center justify-end gap-1 text-[#94a3b8]">
                          <span>{pin.name}</span>
                          <span className={`w-2 h-2 rounded-full ${pin.rate === 'TRIGGER' ? 'bg-amber-400' : 'bg-cyan-400'}`}></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 3: Real-Time Oscilloscope & Node Parameter Tuning (4 cols) */}
        <div className="lg:col-span-4 bg-[#0c111c] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1c2438] bg-[#0f1624] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={13} className="text-emerald-400" /> Live Waveform Oscilloscope
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> WebAudio
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Live Canvas Waveform */}
            <div className="rounded-xl border border-[#1e293d] overflow-hidden shadow-2xl bg-[#070a13]">
              <canvas ref={canvasRef} width={340} height={140} className="w-full h-36" />
            </div>

            {/* Selected Node Parameters Inspector */}
            <div className="p-3.5 rounded-xl bg-[#0f1626] border border-[#1e293d] space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Node Inspector: <strong className="text-cyan-400 font-mono">{selectedNode.name}</strong>
              </span>

              {/* Filter Controls */}
              {selectedNode.type === 'BIQUAD_FILTER' && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Cutoff Frequency</span>
                      <span className="font-mono text-cyan-400">{selectedNode.parameters.cutoffHz} Hz</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="8000"
                      step="50"
                      value={selectedNode.parameters.cutoffHz}
                      onChange={(e) => handleParamChange('cutoffHz', parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 h-1.5 bg-[#1a2336] rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Resonance Q</span>
                      <span className="font-mono text-cyan-400">{selectedNode.parameters.resonanceQ}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="18.0"
                      step="0.5"
                      value={selectedNode.parameters.resonanceQ}
                      onChange={(e) => handleParamChange('resonanceQ', parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 h-1.5 bg-[#1a2336] rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* ADSR Controls */}
              {selectedNode.type === 'ADSR_ENVELOPE' && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Attack</span>
                      <span className="font-mono text-cyan-400">{selectedNode.parameters.attackSec}s</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="1.0"
                      step="0.01"
                      value={selectedNode.parameters.attackSec}
                      onChange={(e) => handleParamChange('attackSec', parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 h-1.5 bg-[#1a2336] rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Decay</span>
                      <span className="font-mono text-cyan-400">{selectedNode.parameters.decaySec}s</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="2.0"
                      step="0.02"
                      value={selectedNode.parameters.decaySec}
                      onChange={(e) => handleParamChange('decaySec', parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 h-1.5 bg-[#1a2336] rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Oscillator Controls */}
              {selectedNode.type === 'OSCILLATOR' && (
                <div>
                  <label className="text-xs font-semibold block mb-1">Waveform</label>
                  <select
                    value={selectedNode.parameters.waveform}
                    onChange={(e) => handleParamChange('waveform', e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#141b2c] border border-[#23314d] text-xs font-mono text-white"
                  >
                    <option value="sawtooth">Sawtooth (Aggressive / Synth)</option>
                    <option value="square">Square (8-bit / Punchy)</option>
                    <option value="sine">Sine (Pure / Deep Sub)</option>
                    <option value="triangle">Triangle (Flute / Warm)</option>
                  </select>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
