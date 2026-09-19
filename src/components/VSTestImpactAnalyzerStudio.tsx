/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Visual Studio Enterprise Test Impact Analysis (TIA) & Dynamic Code Coverage Profiler Studio.
 *          Provides line-by-line coverage visualization (Green = Covered, Orange = Partial, Red = Uncovered),
 *          test case impact mapping based on source modifications, fast affected-test execution runner,
 *          and On-Device Offline AI Regression Risk Prediction (Zero-Token Guarantee).
 *    - TH: สตูดิโอวิเคราะห์ผลกระทบการทดสอบ Visual Studio Test Impact Analysis (TIA) และ Code Coverage
 *          แสดงผลความครอบคลุมของโค้ดแบบบรรทัดต่อบรรทัด (เขียว = ทดสอบแล้ว, ส้ม = บางส่วน, แดง = ยังไม่มีเทสต์),
 *          ระบบคัดกรองชุดการทดสอบขั้นต่ำที่ได้รับผลกระทบจากการแก้โค้ด (Impacted Tests),
 *          พร้อมระบบ AI ออฟไลน์ช่วยวิเคราะห์ความเสี่ยงบัคถดถอย
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `vsTestImpactTypes.ts` and `VSTestImpactEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  FileCode,
  ShieldCheck,
  Play,
  Sparkles,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Zap,
  Filter
} from 'lucide-react';
import { vsTestImpactEngine } from '../utils/VSTestImpactEngineNode';
import { VSTestImpactProfile } from '../types/vsTestImpactTypes';

interface VSTestImpactStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function VSTestImpactAnalyzerStudio({ onSelectTool }: VSTestImpactStudioProps) {
  const [profile, setProfile] = useState<VSTestImpactProfile>(() =>
    vsTestImpactEngine.getProfile()
  );
  const [selectedTestId, setSelectedTestId] = useState<string>('T02');

  useEffect(() => {
    return vsTestImpactEngine.subscribe(() => {
      setProfile({ ...vsTestImpactEngine.getProfile() });
    });
  }, []);

  const impactedCount = profile.testCases.filter(t => t.isImpactedByChanges).length;

  return (
    <div className="flex flex-col h-full bg-[#080d19] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Studio Bar */}
      <div className="p-4 border-b border-[#1b253b] bg-[#0c1222] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
            <FileCode size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Visual Studio Test Impact Analysis (TIA) & Dynamic Code Coverage
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-400 text-[10px] font-bold border border-indigo-500/40 font-mono">
                VS Enterprise TIA
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Dynamic Binary Instrumentation (DBI), Block-to-Test Mapping, and On-Device Offline AI Regression Risk Prediction.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => vsTestImpactEngine.runImpactedTests()}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
          >
            <Play size={13} fill="currentColor" />
            Run {impactedCount} Impacted Tests Only
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-4 py-2 border-b border-[#1b253b] bg-[#090e1a] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-[#94a3b8] flex items-center gap-1.5">
            <GitBranch size={13} className="text-indigo-400" />
            Branch: <strong className="text-white">{profile.targetBranch}</strong>
          </span>
          <span className="text-[#94a3b8]">
            Solution: <strong className="text-white">{profile.solutionName}</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">Line Coverage: {profile.lineCoveragePercentage}%</span>
          <span className="text-amber-400 font-bold">Branch Coverage: {profile.branchCoveragePercentage}%</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* SOURCE CODE COVERAGE VIEWER (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-r border-[#1b253b] bg-[#060a14] overflow-hidden">
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1220] flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-1.5">
              <FileCode size={13} className="text-indigo-400" />
              DamageCalculatorService.cs
            </span>
            <span className="text-[10px] text-[#64748b]">Click any line to toggle coverage state</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1">
            {profile.codeBlocks.map(block => {
              const isCovered = block.status === 'COVERED';
              const isPartial = block.status === 'PARTIALLY_COVERED';
              const isUncovered = block.status === 'UNCOVERED';

              const bgClass = isCovered
                ? 'bg-emerald-950/20 border-l-4 border-emerald-500'
                : isPartial
                ? 'bg-amber-950/20 border-l-4 border-amber-500'
                : 'bg-rose-950/20 border-l-4 border-rose-500';

              const indicatorBadge = isCovered
                ? 'bg-emerald-950 text-emerald-400'
                : isPartial
                ? 'bg-amber-950 text-amber-400'
                : 'bg-rose-950 text-rose-400';

              return (
                <div
                  key={block.lineNumber}
                  onClick={() => vsTestImpactEngine.toggleLineCoverage(block.lineNumber)}
                  className={`flex items-center px-2 py-1 rounded cursor-pointer transition hover:bg-white/5 ${bgClass}`}
                >
                  <span className="w-8 text-[#64748b] text-[10px] text-right pr-3 select-none">
                    {block.lineNumber}
                  </span>
                  <span className="flex-1 text-[#e2e8f0] overflow-x-auto whitespace-pre">
                    {block.code}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ml-2 ${indicatorBadge}`}>
                    {block.executionCount > 0 ? `${block.executionCount} hits` : '0 hits'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TEST IMPACT MAPPING & ON-DEVICE AI PREDICTOR (5 cols) */}
        <div className="lg:col-span-5 bg-[#090d18] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1220] flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Filter size={13} className="text-indigo-400" />
              Impacted Test Suite ({impactedCount} of {profile.testCases.length})
            </span>
            <span className="text-[10px] font-mono text-indigo-400">TIA Matrix</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {profile.testCases.map(tc => {
              const isSelected = selectedTestId === tc.testId;
              return (
                <div
                  key={tc.testId}
                  onClick={() => setSelectedTestId(tc.testId)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg'
                      : 'bg-[#0e1526] border-[#1d2943] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white font-sans flex items-center gap-2">
                      {tc.status === 'PASSED' ? (
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle size={13} className="text-amber-400 shrink-0" />
                      )}
                      {tc.testName}
                    </span>
                    {tc.isImpactedByChanges && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-400 text-[10px] font-bold border border-rose-500/40">
                        Impacted
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                    <span>Suite: {tc.suite}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {tc.durationMs} ms
                    </span>
                  </div>
                </div>
              );
            })}

            {/* On-Device Offline AI Regression Risk Card */}
            <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-indigo-400 block uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> On-Device Offline AI TIA Optimizer
              </span>
              <p className="text-xs text-indigo-200/90 leading-relaxed">
                {profile.offlineAIRegressionInsight}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
