/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Unity DOTS ECS Archetype Chunk Memory & Job Scheduling Visualizer Studio.
 *          Visualizes 16KB unmanaged native chunk layouts, Structure of Arrays (SoA),
 *          L1/L2 cache hit metrics, SIMD vector widths, chunk defragmentation,
 *          and On-Device Offline AI Cache Alignment Optimization (Zero-Token Guarantee).
 *    - TH: สตูดิโอวิเคราะห์หน่วยความจำ Unity DOTS ECS Archetype Chunk และการรัน Job แบบคู่ขนาน
 *          แสดงผลการจัดเรียงก้อนหน่วยความจำ 16KB แบบ Native, โครงสร้าง Structure of Arrays (SoA),
 *          อัตรา L1 Cache Hit Rate, ระบบ Defragment ก้อน Chunk, และ AI ช่วยวิเคราะห์ SIMD Optimization
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `unityDOTSTypes.ts` and `UnityDOTSEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  Database
} from 'lucide-react';
import { unityDOTSEngine } from '../utils/UnityDOTSEngineNode';
import { UnityDOTSProfile } from '../types/unityDOTSTypes';

interface UnityDOTSStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function UnityDOTSArchetypeChunkStudio({ onSelectTool }: UnityDOTSStudioProps) {
  const [profile, setProfile] = useState<UnityDOTSProfile>(() =>
    unityDOTSEngine.getProfile()
  );

  useEffect(() => {
    return unityDOTSEngine.subscribe(() => {
      setProfile({ ...unityDOTSEngine.getProfile() });
    });
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#080d1a] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1b263e] bg-[#0c1326] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
            <Boxes size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Unity DOTS ECS Archetype Chunk Memory & Burst SIMD Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 font-mono">
                Unity Entities 1.0+ Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              16KB Unmanaged NativeArray Chunks, Structure of Arrays (SoA), L1 Cache Line Vectorization & Defragmentation.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => unityDOTSEngine.defragmentChunks()}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
        >
          <RefreshCw size={13} />
          Defragment Archetype Chunks
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="px-4 py-2 border-b border-[#1b263e] bg-[#090e1c] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-[#94a3b8]">World: <strong className="text-white">{profile.worldName}</strong></span>
          <span className="text-[#94a3b8]">Total Entities: <strong className="text-emerald-400">{profile.totalEntities.toLocaleString()}</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-bold">L1 Cache Hit: {profile.l1CacheHitRate}%</span>
          <span className="text-cyan-400 font-bold">SIMD: {profile.simdVectorWidth}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* 16KB CHUNK MEMORY MAP (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-r border-[#1b263e] bg-[#060a14] overflow-hidden">
          <div className="p-3 border-b border-[#1b263e] bg-[#0c1220] flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-1.5">
              <HardDrive size={13} className="text-emerald-400" />
              16 Kilobyte Archetype Chunk Memory Slices
            </span>
            <span className="text-[10px] text-[#64748b]">16,384 Bytes / Chunk</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {profile.chunks.map(chunk => (
              <div key={chunk.chunkIndex} className="p-3.5 rounded-xl bg-[#0d1424] border border-[#1c2944] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-sans flex items-center gap-2">
                    <Database size={13} className="text-emerald-400" />
                    Chunk #{chunk.chunkIndex} ({chunk.entityCount} / {chunk.maxEntityCapacity} Entities)
                  </span>
                  <span className="text-emerald-400 font-bold">{chunk.utilizationPercentage}% Full</span>
                </div>

                {/* Progress bar visualizing 16KB chunk occupancy */}
                <div className="w-full h-3 rounded-full bg-[#080c16] overflow-hidden p-0.5 border border-[#1e2a44]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${chunk.utilizationPercentage}%` }}
                  />
                </div>

                {/* Structure of Arrays (SoA) layout tags */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {chunk.components.map((comp, idx) => (
                    <div key={idx} className="p-2 rounded bg-[#070b14] border border-[#172238] flex items-center justify-between">
                      <span className="text-cyan-300">{comp.name}[]</span>
                      <span className="text-[#94a3b8]">{comp.sizeBytes} B/entity</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ARCHETYPE COMPONENT REGISTRY & ON-DEVICE AI (5 cols) */}
        <div className="lg:col-span-5 bg-[#090d18] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1b263e] bg-[#0c1220] flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={13} className="text-emerald-400" />
              SoA Component Signature
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Zero GC Pressure</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#0e1628] border border-[#1d2b48] space-y-2 font-sans">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Archetype Type Signature
              </span>
              <div className="p-2.5 rounded bg-[#070b14] border border-[#1a253a] font-mono text-emerald-300 text-xs break-all">
                {profile.archetypeSignature}
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                Native unmanaged blittable structs packed consecutively in memory. Compatible with Burst Vectorized Jobs.
              </p>
            </div>

            {/* On-Device Offline AI SIMD Optimization Card */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> On-Device Offline AI DOTS Profiler
              </span>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                {profile.offlineAISIMDInsight}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
