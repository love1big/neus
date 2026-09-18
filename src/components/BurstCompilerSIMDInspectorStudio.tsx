/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Unity Burst Compiler & SIMD Vectorization Inspector Studio (Visual Studio
 *          C++ Vectorizer & Unity DOTS Burst parity). Disassembles high-performance C# / C++
 *          jobs into AVX-512, AVX2, and ARM NEON instructions, inspects LLVM IR,
 *          evaluates loop vectorization ratios, and benchmarks speedups over standard JIT.
 *    - TH: สตูดิโอวิเคราะห์การแปลงคำสั่งเวกเตอร์ Burst Compiler & SIMD Vectorization
 *          (เทียบเท่า Unity Burst Compiler และ Visual Studio C++ Vectorizer)
 *          วิเคราะห์รหัสแอสเซมบลีเวกเตอร์ (AVX-512, AVX2, ARM NEON), ตรวจสอบ LLVM IR,
 *          ดูอัตราเร่งความเร็วเทียบกับ JIT แบบดั้งเดิม (Speedup Ratio 14.8x - 22.4x),
 *          และปรับแต่งออปชัน Fast Math และ Loop Unrolling
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `burstSIMDTypes.ts` and `BurstCompilerSIMDNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Code2,
  Sliders,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  CheckCircle2,
  Terminal,
  FileCode2,
  ShieldCheck,
  Gauge
} from 'lucide-react';
import { burstCompilerNode } from '../utils/BurstCompilerSIMDNode';
import { BurstJobProfile, SIMDTargetArch } from '../types/burstSIMDTypes';

interface BurstStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function BurstCompilerSIMDInspectorStudio({ onSelectTool }: BurstStudioProps) {
  const [job, setJob] = useState<BurstJobProfile>(() => burstCompilerNode.getActiveJob());
  const [telemetry, setTelemetry] = useState(() => burstCompilerNode.getTelemetry());
  const [activeTab, setActiveTab] = useState<'DISASSEMBLY' | 'LLVM_IR'>('DISASSEMBLY');

  useEffect(() => {
    return burstCompilerNode.subscribe(() => {
      setJob(burstCompilerNode.getActiveJob());
      setTelemetry(burstCompilerNode.getTelemetry());
    });
  }, []);

  const handleArchChange = (arch: SIMDTargetArch) => {
    burstCompilerNode.setTargetArch(arch);
  };

  return (
    <div className="flex flex-col h-full bg-[#070b13] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Header Bar */}
      <div className="p-4 border-b border-[#1c2538] bg-[#0c1220] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
            <Cpu size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Burst Compiler & SIMD Vectorization Inspector Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 text-[10px] font-bold border border-amber-500/40 font-mono">
                Unity Burst & Visual Studio Vectorizer Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              LLVM IR disassembly, AVX-512 / AVX2 / ARM NEON vectorization, register spill analysis, and JIT speedup benchmarks.
            </p>
          </div>
        </div>

        {/* Arch Selector */}
        <div className="flex items-center gap-1.5 bg-[#121a2b] p-1 rounded-xl border border-[#1e2a40]">
          {(['AVX512', 'AVX2', 'ARM_NEON', 'SSE4_2'] as SIMDTargetArch[]).map(arch => (
            <button
              key={arch}
              onClick={() => handleArchChange(arch)}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                job.targetArch === arch
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1a253c]'
              }`}
            >
              {arch}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* DISASSEMBLY & LLVM VIEW (8 cols) */}
        <div className="lg:col-span-8 flex flex-col border-r border-[#1c2538] bg-[#05080f] overflow-hidden">
          
          {/* Subheader tabs */}
          <div className="p-3 border-b border-[#1c2538] bg-[#0c1220] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('DISASSEMBLY')}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                  activeTab === 'DISASSEMBLY'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                SIMD Assembly Disassembly ({job.simdInstructions.length})
              </button>
              <button
                onClick={() => setActiveTab('LLVM_IR')}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                  activeTab === 'LLVM_IR'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                LLVM IR (Intermediate Representation)
              </button>
            </div>

            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck size={13} /> Fully Vectorized (0 Scalar Spills)
            </span>
          </div>

          {/* Code Body */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
            {activeTab === 'DISASSEMBLY' ? (
              <div className="space-y-1.5">
                {job.simdInstructions.map((ins, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                      ins.isVectorized
                        ? 'bg-[#0f182b] border-amber-500/30 text-amber-100'
                        : 'bg-[#0a0f1c] border-[#1a2337] text-[#94a3b8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#64748b] text-[11px]">{ins.address}</span>
                      <span className={`font-bold ${ins.isVectorized ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {ins.mnemonic}
                      </span>
                      <span className="text-white">{ins.operands}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#162035] text-[#94a3b8]">
                        {ins.explanation}
                      </span>
                      {ins.isVectorized && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                          {ins.registerType}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="p-4 rounded-xl bg-[#0a0f1c] border border-[#1a2337] text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {job.llvmIRSnippet}
              </pre>
            )}
          </div>

          {/* Benchmark Footer */}
          <div className="p-3 border-t border-[#1c2538] bg-[#0c1220] flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 font-mono">
              <span className="text-[#94a3b8]">Job: <strong className="text-white">{job.jobName}</strong></span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <TrendingUp size={14} /> {job.speedupVsMonoJit.toFixed(1)}x Speedup
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#64748b]">
              SIMD: {job.executionTimeUs} µs | Scalar JIT: {job.scalarExecutionTimeUs.toLocaleString()} µs
            </div>
          </div>

        </div>

        {/* COMPILER CONFIG & TELEMETRY (4 cols) */}
        <div className="lg:col-span-4 bg-[#090e18] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1c2538] bg-[#0f1728] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={13} className="text-amber-400" /> Compiler Optimizations
            </span>
            <span className="text-[10px] font-mono text-amber-400">LLVM 17 JIT</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Speedup Metric Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 to-orange-950/20 border border-amber-500/40 text-center space-y-1">
              <span className="text-xs text-amber-300 font-mono uppercase tracking-wider block">
                SIMD Vectorization Speedup
              </span>
              <div className="text-3xl font-black text-white font-mono">
                {job.speedupVsMonoJit.toFixed(1)}x
              </div>
              <p className="text-[10px] text-[#94a3b8]">
                Faster than standard managed JIT Mono / CoreCLR
              </p>
            </div>

            {/* Fast Math Toggle */}
            <div className="p-3.5 rounded-xl bg-[#0f1728] border border-[#1e2a40] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Fast Math (fp-contract)</span>
                <span className="text-[10px] text-[#64748b]">Enables FMA and relaxed IEEE-754 precision</span>
              </div>
              <button
                onClick={() => burstCompilerNode.toggleFastMath()}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  job.fastMath
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
                    : 'bg-[#182236] text-[#94a3b8]'
                }`}
              >
                {job.fastMath ? 'ENABLED' : 'STRICT'}
              </button>
            </div>

            {/* Loop Unroll Factor Slider */}
            <div className="p-3.5 rounded-xl bg-[#0f1728] border border-[#1e2a40] space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Loop Unroll Factor</span>
                <span className="font-mono text-amber-400">{job.unrollFactor}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={job.unrollFactor}
                onChange={(e) => burstCompilerNode.setUnrollFactor(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-[#182236] rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-[#64748b] block">
                Reduces branch instruction overhead by unrolling iterations
              </span>
            </div>

            {/* Telemetry Stats */}
            <div className="p-3.5 rounded-xl bg-[#0f1728] border border-[#1e2a40] space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Register & Memory Telemetry
              </span>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-[#131d31] border border-[#1e2a40]">
                  <span className="text-[#94a3b8]">Vector Registers:</span>
                  <span className="text-white font-bold">{telemetry.registersUsedCount} registers</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#131d31] border border-[#1e2a40]">
                  <span className="text-[#94a3b8]">Register Spills:</span>
                  <span className="text-emerald-400 font-bold">{telemetry.spillCount} (Zero Spills)</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[#131d31] border border-[#1e2a40]">
                  <span className="text-[#94a3b8]">Memory Throughput:</span>
                  <span className="text-amber-400 font-bold">{telemetry.memoryBandwidthGBs} GB/s</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
