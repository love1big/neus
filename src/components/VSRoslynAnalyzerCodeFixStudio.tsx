/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Visual Studio MSBuild Roslyn Diagnostic Analyzer & CodeFix Studio (VS parity).
 *          AST code viewer with color-coded syntax squiggles (red/green/yellow),
 *          Lightbulb quick action popup, Diagnostic table with category filtering,
 *          and On-Device Offline AI AST-based refactoring batch executor.
 *    - TH: สตูดิโอวิเคราะห์และซ่อมแซมโค้ด Visual Studio Roslyn Analyzer & CodeFix (VS Parity)
 *          ตัวแสดงโค้ดพร้อมเส้นหยักแจ้งเตือนตามไวยากรณ์ (Squiggles), ป๊อปอัปหลอดไฟ Quick Action,
 *          ตารางสรุปข้อผิดพลาดแยกตามหมวดหมู่ (Performance, Reliability, Style),
 *          และระบบ AI ออฟไลน์ช่วยรีแฟกเตอร์โค้ดอัตโนมัติทั้งไฟล์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `vsRoslynTypes.ts` and `VSRoslynAnalyzerEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  Code2,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Zap,
  Wrench,
  Sparkles,
  FileCode,
  Layers,
  Terminal
} from 'lucide-react';
import { vsRoslynAnalyzerEngine } from '../utils/VSRoslynAnalyzerEngineNode';
import { VSRoslynProfile } from '../types/vsRoslynTypes';

interface RoslynStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function VSRoslynAnalyzerCodeFixStudio({ onSelectTool }: RoslynStudioProps) {
  const [profile, setProfile] = useState<VSRoslynProfile>(() =>
    vsRoslynAnalyzerEngine.getProfile()
  );

  useEffect(() => {
    return vsRoslynAnalyzerEngine.subscribe(() => {
      setProfile({ ...vsRoslynAnalyzerEngine.getProfile() });
    });
  }, []);

  const unfixedCount = profile.diagnostics.filter(d => !d.isFixed).length;

  return (
    <div className="flex flex-col h-full bg-[#080d1a] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1c273e] bg-[#0c1427] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shrink-0 shadow-lg">
            <Code2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Visual Studio MSBuild Roslyn Diagnostic Analyzer & CodeFix Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-violet-950/80 text-violet-400 text-[10px] font-bold border border-violet-500/40 font-mono">
                VS Roslyn AST Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              C# / .NET Roslyn Compiler Platform Syntax Trees, Diagnostic Providers, and On-Device Offline AI AST Refactoring.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => vsRoslynAnalyzerEngine.applyAllFixesWithAI()}
          disabled={unfixedCount === 0}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
        >
          <Sparkles size={13} />
          AI Batch Apply All CodeFixes ({unfixedCount})
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* SOURCE CODE VIEWER (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-r border-[#1c273e] bg-[#060a14] overflow-hidden">
          
          <div className="p-3 border-b border-[#1c273e] bg-[#0c1427] flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <FileCode size={13} className="text-violet-400" />
              Active File: <strong className="text-violet-300">CharacterCombatController.cs</strong>
            </span>

            <span className="text-[#94a3b8]">Target: {profile.targetFramework}</span>
          </div>

          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-emerald-400/90 leading-relaxed bg-[#050811] whitespace-pre">
            {profile.codeContent}
          </div>

          <div className="p-3 border-t border-[#1c273e] bg-[#0c1427] flex items-center justify-between text-xs font-mono">
            <span className="text-[#94a3b8]">Solution: <strong>{profile.targetSolution}</strong></span>
            <span className="text-violet-400 font-bold">{profile.totalAnalyzersActive} Analyzers Registered</span>
          </div>

        </div>

        {/* DIAGNOSTICS & CODEFIX PANEL (5 cols) */}
        <div className="lg:col-span-5 bg-[#090f20] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1c273e] bg-[#0c1427] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb size={13} className="text-amber-400" /> Roslyn Diagnostic Warnings & Quick Fixes
            </span>
            <span className="text-[10px] font-mono text-amber-400">{unfixedCount} Active</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {profile.diagnostics.map(diag => (
              <div
                key={diag.id}
                className={`p-3 rounded-xl border transition-all ${
                  diag.isFixed
                    ? 'bg-emerald-950/20 border-emerald-500/40 opacity-75'
                    : 'bg-[#0f172a] border-[#1e293b]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      diag.severity === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                      diag.severity === 'INFO' ? 'bg-blue-950 text-blue-400 border border-blue-500/40' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {diag.id}
                    </span>
                    <span className="text-white font-bold">{diag.title}</span>
                  </div>

                  <span className="text-[10px] text-[#64748b]">Line {diag.lineNumber}:{diag.column}</span>
                </div>

                <p className="mt-2 text-xs text-[#94a3b8] font-sans leading-relaxed">
                  {diag.message}
                </p>

                <div className="mt-2.5 pt-2 border-t border-[#1e293b] flex items-center justify-between">
                  <span className="text-[10px] text-amber-300/90 font-sans flex items-center gap-1">
                    <Lightbulb size={11} className="text-amber-400 shrink-0" />
                    {diag.fixDescription}
                  </span>

                  {diag.isFixed ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Fixed
                    </span>
                  ) : (
                    <button
                      onClick={() => vsRoslynAnalyzerEngine.applyCodeFix(diag.id)}
                      className="px-2.5 py-1 rounded bg-violet-600 hover:bg-violet-500 text-white font-bold text-[10px] cursor-pointer shadow transition-all flex items-center gap-1"
                    >
                      <Wrench size={10} /> Apply Fix
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/30 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-violet-400 block uppercase tracking-wider">
                On-Device Offline AI AST Synthesizer
              </span>
              <p className="text-xs text-violet-200/90 leading-relaxed">
                {profile.offlineAIRefactoringSummary}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
