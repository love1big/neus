/**
 * ============================================================================
 * MODULE: EngineStaticAnalysisPanel.tsx
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * แผงควบคุมระบบวิเคราะห์ Static Analysis สำหรับเกมเอนจิน (Engine Static Analysis Panel)
 * ถูกติดตั้งใน Bottom Drawer ของ `CodeEditor.tsx` เพื่อตรวจสอบและเสนอทางเลือก
 * ทางสถาปัตยกรรมที่มีประสิทธิภาพสูงกว่า:
 * 1. Telemetry Dashboard:
 *    - แสดง Code Health Grade (A+ ถึง F) และ Cleanliness Score (0-100)
 *    - แสดงเวลาเฟรมเรตที่ประหยัดได้รวม (Total Frame Time Saved in ms/frame)
 *    - แสดงขยะ GC ที่ลดลงได้ (GC Memory Churn Avoided in KB/sec)
 *    - แสดงประมาณการเพิ่มขึ้นของ Frame Rate (Projected FPS Improvement)
 * 2. Smart Filters & Search:
 *    - ค้นหาด้วยคำสำคัญ (Rule Name, Code, Error Message)
 *    - กรองตามหมวดหมู่ (GC Allocation, Hot Path Query, Physics/Math, GPU Shader, I/O, Cache)
 *    - กรองตามระดับความรุนแรง (Critical, High, Medium, Hint)
 * 3. One-Click Quick-Fix & Batch Resolution:
 *    - ปุ่ม 'Quick Fix' ทันทีในแต่ละการ์ดปัญหา
 *    - ปุ่ม 'Batch Fix All' เพื่อแก้ปัญหาทั้งหมดในไฟล์พร้อมกัน
 *    - ปุ่ม 'Inspect Diff' เพื่อเปิดหน้าต่าง Side-by-Side Before/After Diff
 * 4. Engine Rules Catalog:
 *    - หน้าต่างตรวจสอบกฎทั้งหมด 20+ ข้อ พร้อมตัวอย่างโค้ดและสวิตช์เปิด/ปิดกฎ
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - นำเข้า:
 *   - `EngineAstLinterEngine`: ตัววิเคราะห์และกรองปัญหา
 *   - `PerformanceImpactEstimatorNode`: คำนวณ Telemetry
 *   - `QuickFixRefactoringNode`: ทำการ Refactor โค้ด
 *   - `EngineAntiPatternDiffModal`: แสดงหน้าต่างเปรียบเทียบโค้ด
 * - สื่อสารกับ: `CodeEditor.tsx` ผ่าน Props:
 *   - `code`: โค้ดปัจจุบัน
 *   - `onUpdateCode`: ฟังก์ชันอัปเดตโค้ดในเอดิเตอร์
 *   - `onJumpToLine`: ฟังก์ชันเลื่อนเคอร์เซอร์ไปยังบรรทัดที่มีปัญหา
 * 
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { 
  Zap, AlertCircle, AlertTriangle, Info, CheckCircle2, 
  Search, SlidersHorizontal, Sparkles, Wrench, ArrowRight,
  TrendingUp, HardDrive, Clock, Cpu, ShieldCheck, ChevronRight,
  RefreshCw, Check, BookOpen, Layers, Filter, Eye
} from 'lucide-react';
import { 
  EngineAntiPatternIssue, 
  EngineAntiPatternCategory, 
  AntiPatternSeverity,
  EngineAntiPatternRule
} from '../utils/staticAnalysis/EngineAntiPatternTypes';
import { EngineAstLinterEngine } from '../utils/staticAnalysis/EngineAstLinterEngine';
import { PerformanceImpactEstimatorNode } from '../utils/staticAnalysis/PerformanceImpactEstimatorNode';
import { QuickFixRefactoringNode } from '../utils/staticAnalysis/QuickFixRefactoringNode';
import { getAllEngineRules } from '../utils/staticAnalysis/EngineStaticAnalysisRules';
import EngineAntiPatternDiffModal from './EngineAntiPatternDiffModal';
import { EngineCommandHistoryTracker } from '../utils/EngineCommandHistoryTracker';

export interface EngineStaticAnalysisPanelProps {
  code: string;
  languageId: string;
  issues: EngineAntiPatternIssue[];
  onUpdateCode: (newCode: string, feedbackMsg?: string) => void;
  onJumpToLine?: (line: number, col: number) => void;
  onClose?: () => void;
}

export const EngineStaticAnalysisPanel: React.FC<EngineStaticAnalysisPanelProps> = ({
  code,
  languageId,
  issues,
  onUpdateCode,
  onJumpToLine,
  onClose
}) => {
  // Navigation & Filtering State
  const [activeTab, setActiveTab] = useState<'issues' | 'catalog'>('issues');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<EngineAntiPatternCategory | 'ALL'>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<AntiPatternSeverity | 'ALL'>('ALL');

  // Modal State for Diff Inspection
  const [inspectingIssue, setInspectingIssue] = useState<EngineAntiPatternIssue | null>(null);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState<boolean>(false);
  const [isApplyingFix, setIsApplyingFix] = useState<boolean>(false);
  const [isBatchFixing, setIsBatchFixing] = useState<boolean>(false);

  // Rules Catalog State (for enabling/disabling rules)
  const [activeRules, setActiveRules] = useState<EngineAntiPatternRule[]>(() => getAllEngineRules());

  // 1. Calculate Real-Time Performance Telemetry
  const telemetry = useMemo(() => {
    return PerformanceImpactEstimatorNode.calculateTelemetry(issues);
  }, [issues]);

  // 2. Filter Issues based on search and selected filters
  const filteredIssues = useMemo(() => {
    return EngineAstLinterEngine.filterIssues(
      issues, 
      selectedCategory, 
      selectedSeverity, 
      searchQuery
    );
  }, [issues, selectedCategory, selectedSeverity, searchQuery]);

  // Handle Single Quick Fix
  const handleApplySingleFix = (issue: EngineAntiPatternIssue) => {
    setIsApplyingFix(true);
    try {
      const result = QuickFixRefactoringNode.applySingleQuickFix(code, issue);
      if (result.success) {
        EngineCommandHistoryTracker.recordAction({
          title: `Optimize: ${issue.optimizedAlternative.title}`,
          description: `Refactored anti-pattern '${issue.ruleName}' with zero-allocation alternative.`,
          category: 'CODE_MODIFICATION',
          targetSubsystem: 'CodeEditor',
          status: 'OPTIMIZED',
          author: 'AUTO_REFACTOR',
          toolId: 'CodeEditor',
          reExecutable: true,
          details: {
            affectedFile: 'ActiveBuffer',
            affectedLines: `Line ${issue.lineNumber}`,
            diffSummary: `- ${issue.matchedCode}\n+ ${issue.optimizedAlternative.recommendedCode}`,
            telemetryImpact: `+${issue.optimizedAlternative.theoreticalFpsGainMs}ms/frame • -${issue.optimizedAlternative.estimatedGcSavedKb}KB GC`
          }
        });
        onUpdateCode(result.newCode, `⚡ Applied optimization: ${issue.optimizedAlternative.title}`);
        setIsDiffModalOpen(false);
        setInspectingIssue(null);
      }
    } catch (err) {
      console.error('Error applying quick fix:', err);
    } finally {
      setIsApplyingFix(false);
    }
  };

  // Handle Batch Quick Fix
  const handleBatchFixAll = () => {
    const fixableCount = issues.filter(i => i.canAutoFix).length;
    if (fixableCount === 0) return;

    setIsBatchFixing(true);
    setTimeout(() => {
      try {
        const result = QuickFixRefactoringNode.applyAllQuickFixes(code, issues);
        EngineCommandHistoryTracker.recordAction({
          title: `Batch Optimized ${result.fixedCount} Anti-Patterns`,
          description: `Applied reverse-order AST replacements across active buffer.`,
          category: 'CODE_MODIFICATION',
          targetSubsystem: 'CodeEditor',
          status: 'OPTIMIZED',
          author: 'AUTO_REFACTOR',
          toolId: 'CodeEditor',
          reExecutable: true,
          details: {
            affectedFile: 'ActiveBuffer',
            diffSummary: `Batch resolved ${result.fixedCount} performance issues without index shift.`,
            telemetryImpact: `+${telemetry.totalFrameTimeSavedMs}ms frame time, -${telemetry.totalGcPressureReducedKb}KB/s GC churn`
          }
        });
        onUpdateCode(
          result.newCode, 
          `⚡ Batch-optimized ${result.fixedCount} engine anti-patterns! (${telemetry.totalFrameTimeSavedMs}ms saved)`
        );
      } catch (err) {
        console.error('Error executing batch optimization:', err);
      } finally {
        setIsBatchFixing(false);
      }
    }, 250);
  };

  // Open Diff Modal for an issue
  const handleOpenDiff = (issue: EngineAntiPatternIssue) => {
    setInspectingIssue(issue);
    setIsDiffModalOpen(true);
  };

  // Toggle Rule in Catalog
  const handleToggleRule = (ruleId: string) => {
    setActiveRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: issues.length };
    issues.forEach(i => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  }, [issues]);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden">
      {/* 1. Top Telemetry Gauge Banner */}
      <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Overall Health Grade & Score */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black shadow-md border ${
              telemetry.codeHealthGrade === 'A+' || telemetry.codeHealthGrade === 'A' 
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                : telemetry.codeHealthGrade === 'B'
                ? 'bg-blue-950/60 border-blue-500/50 text-blue-400'
                : telemetry.codeHealthGrade === 'C'
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-400'
                : 'bg-red-950/60 border-red-500/50 text-red-400'
            }`}>
              <span className="text-lg leading-none">{telemetry.codeHealthGrade}</span>
              <span className="text-[9px] font-mono opacity-80">{telemetry.codeHealthScore}/100</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Engine Static Analysis</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#21262d] text-[#8b949e] font-mono">
                  {languageId.toUpperCase()} TARGET
                </span>
              </div>
              <p className="text-xs text-[#8b949e]">
                {issues.length === 0 
                  ? 'All engine performance checks passed! Zero detected anti-patterns.' 
                  : `${issues.length} performance bottlenecks detected across hot paths.`}
              </p>
            </div>
          </div>

          {/* Center: Live Telemetry Numbers */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] px-3 py-1.5 rounded-lg">
              <Clock size={15} className="text-emerald-400" />
              <div>
                <div className="text-[9px] uppercase font-bold text-[#8b949e]">Frame Time Saved</div>
                <div className="font-mono font-bold text-white text-xs text-emerald-400">
                  +{telemetry.totalFrameTimeSavedMs} ms <span className="text-[10px] text-[#8b949e] font-normal">/frame</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] px-3 py-1.5 rounded-lg">
              <HardDrive size={15} className="text-cyan-400" />
              <div>
                <div className="text-[9px] uppercase font-bold text-[#8b949e]">GC Churn Reduced</div>
                <div className="font-mono font-bold text-white text-xs text-cyan-400">
                  -{telemetry.totalGcPressureReducedKb} KB <span className="text-[10px] text-[#8b949e] font-normal">/sec</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-[#0d1117] border border-[#30363d] px-3 py-1.5 rounded-lg">
              <TrendingUp size={15} className="text-purple-400" />
              <div>
                <div className="text-[9px] uppercase font-bold text-[#8b949e]">Projected FPS Gain</div>
                <div className="font-mono font-bold text-white text-xs text-purple-400">
                  +{telemetry.projectedFpsImprovement} FPS
                </div>
              </div>
            </div>
          </div>

          {/* Right: Batch Quick-Fix Button & Tab Switch */}
          <div className="flex items-center gap-2">
            {issues.length > 0 && (
              <button
                onClick={handleBatchFixAll}
                disabled={isBatchFixing || issues.filter(i => i.canAutoFix).length === 0}
                className="px-3 py-1.5 bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3fb950] text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                title="Automatically apply all safe performance optimizations across the file"
              >
                {isBatchFixing ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles size={13} className="text-yellow-300" />
                    Batch Fix All ({issues.filter(i => i.canAutoFix).length})
                  </>
                )}
              </button>
            )}

            <div className="flex items-center bg-[#0d1117] p-0.5 rounded-lg border border-[#30363d]">
              <button
                onClick={() => setActiveTab('issues')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'issues' ? 'bg-[#21262d] text-white shadow-sm' : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <Zap size={12} className={activeTab === 'issues' ? 'text-amber-400' : ''} />
                Issues ({issues.length})
              </button>
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'catalog' ? 'bg-[#21262d] text-white shadow-sm' : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <BookOpen size={12} />
                Rules ({activeRules.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Control Toolbar (Search, Categories, Severities) */}
      <div className="bg-[#11151c] border-b border-[#21262d] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Search input */}
        <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded-md px-2 py-1 focus-within:border-[#58a6ff] w-full sm:w-64">
          <Search size={13} className="text-[#8b949e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter anti-patterns, rules, symbols..."
            className="bg-transparent text-white text-xs outline-none w-full placeholder-[#6e7681]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#8b949e] hover:text-white">
              &times;
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
          {(['ALL', 'GC_ALLOCATION', 'HOT_PATH_QUERY', 'PHYSICS_MATH', 'GPU_SHADER', 'CONCURRENCY_IO', 'MEMORY_CACHE'] as const).map(cat => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            const labels: Record<string, string> = {
              ALL: 'All Categories',
              GC_ALLOCATION: 'GC & Heap',
              HOT_PATH_QUERY: 'Queries',
              PHYSICS_MATH: 'Physics/Math',
              GPU_SHADER: 'GPU Shaders',
              CONCURRENCY_IO: 'Async I/O',
              MEMORY_CACHE: 'Cache & Memory'
            };

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected 
                    ? 'bg-[#1f6feb] text-white font-bold shadow-sm' 
                    : 'bg-[#161b22] text-[#8b949e] hover:text-white border border-[#30363d]'
                }`}
              >
                {labels[cat]} {count > 0 && <span className="opacity-75">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Severity Filter Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter size={12} className="text-[#8b949e]" />
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as any)}
            className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] rounded px-2 py-0.5 text-xs outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">🔴 Critical Only ({telemetry.criticalCount})</option>
            <option value="HIGH">🟠 High Only ({telemetry.highCount})</option>
            <option value="MEDIUM">🔵 Medium ({telemetry.mediumCount})</option>
            <option value="HINT">⚪ Hints ({telemetry.hintCount})</option>
          </select>
        </div>
      </div>

      {/* 3. Main Content: Issues List or Rules Catalog */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'issues' && (
          <>
            {filteredIssues.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-white font-bold text-base mb-1">
                  {issues.length === 0 ? 'Zero Anti-Patterns Detected!' : 'No Matching Issues Found'}
                </h3>
                <p className="text-xs text-[#8b949e] max-w-md">
                  {issues.length === 0
                    ? 'Your code conforms to modern high-performance game engine standards with zero garbage collection spikes or hot-path query bottlenecks.'
                    : 'Try clearing your search query or selecting a different category filter.'}
                </p>
              </div>
            ) : (
              filteredIssues.map((issue) => {
                const isCrit = issue.severity === 'CRITICAL';
                const isHigh = issue.severity === 'HIGH';

                return (
                  <div
                    key={issue.id}
                    className="bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff]/50 rounded-lg p-3.5 transition-all flex flex-col gap-2.5 shadow-sm"
                  >
                    {/* Issue Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className={`p-1.5 rounded shrink-0 mt-0.5 ${
                          isCrit ? 'bg-red-500/20 text-red-400' :
                          isHigh ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {isCrit ? <AlertCircle size={15} /> :
                           isHigh ? <AlertTriangle size={15} /> :
                           <Info size={15} />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-bold text-xs tracking-wide">{issue.ruleName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                              {issue.ruleId}
                            </span>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                              isCrit ? 'bg-red-900/40 text-red-300' :
                              isHigh ? 'bg-amber-900/40 text-amber-300' :
                              'bg-blue-900/40 text-blue-300'
                            }`}>
                              {issue.severity}
                            </span>
                            <span className="text-[10px] text-[#58a6ff] font-mono">
                              [{issue.category}]
                            </span>
                          </div>

                          <p className="text-[#8b949e] text-xs mt-1 leading-snug">
                            {issue.explanation}
                          </p>
                        </div>
                      </div>

                      {/* Right: Telemetry pill */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-[#0d1117] px-2.5 py-1 rounded border border-[#21262d] text-[11px] font-mono">
                        <span className="text-emerald-400 font-bold">+{issue.performanceImpact.frameTimePenaltyMs}ms</span>
                        <span className="text-[#8b949e]">|</span>
                        <span className="text-cyan-400 font-bold">-{issue.optimizedAlternative.estimatedGcSavedKb}KB GC</span>
                      </div>
                    </div>

                    {/* Problematic Code Excerpt */}
                    <div className="bg-[#0d1117] border border-[#21262d] rounded p-2 text-xs font-mono flex items-center justify-between text-[#e6edf3]">
                      <div className="flex items-center gap-2 overflow-x-auto">
                        <span className="text-[#6e7681] text-[11px] select-none">Line {issue.lineNumber}:</span>
                        <span className="text-red-300 whitespace-pre">{issue.matchedCode}</span>
                      </div>

                      {onJumpToLine && (
                        <button
                          onClick={() => onJumpToLine(issue.lineNumber, issue.columnNumber)}
                          className="text-[10px] text-[#58a6ff] hover:underline flex items-center gap-0.5 shrink-0 ml-2"
                        >
                          Jump <ArrowRight size={10} />
                        </button>
                      )}
                    </div>

                    {/* Recommendation Snippet Preview */}
                    <div className="bg-[#1f242c]/70 border border-[#30363d] rounded p-2 text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-emerald-300 text-[11px] overflow-hidden">
                        <Sparkles size={13} className="shrink-0 text-[#bc8cff]" />
                        <span className="font-semibold text-white shrink-0">Optimized Alternative:</span>
                        <span className="truncate text-emerald-400/90">{issue.optimizedAlternative.title}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenDiff(issue)}
                          className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          title="Inspect Side-by-Side Diff and Explanation"
                        >
                          <Eye size={12} className="text-[#58a6ff]" />
                          Inspect Diff
                        </button>

                        {issue.canAutoFix && (
                          <button
                            onClick={() => handleApplySingleFix(issue)}
                            className="px-3 py-1 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow cursor-pointer"
                            title="Apply performance optimization directly to code"
                          >
                            <Wrench size={11} />
                            Quick-Fix
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* Rules Catalog View */}
        {activeTab === 'catalog' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
              <div>
                <h4 className="text-white font-bold text-sm">Engine Performance Ruleset</h4>
                <p className="text-xs text-[#8b949e]">
                  Configured rules for detecting memory churn, GPU stall, and algorithmic anti-patterns.
                </p>
              </div>
              <span className="text-xs font-mono text-[#58a6ff]">
                {activeRules.filter(r => r.enabled).length} of {activeRules.length} Rules Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeRules.map(rule => (
                <div
                  key={rule.id}
                  className={`bg-[#161b22] border rounded-lg p-3 flex flex-col justify-between transition-all ${
                    rule.enabled ? 'border-[#30363d]' : 'border-[#21262d] opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-xs">{rule.name}</span>
                        <span className="text-[10px] font-mono px-1 bg-[#21262d] text-[#8b949e] rounded">
                          {rule.id}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => handleToggleRule(rule.id)}
                        className="cursor-pointer accent-[#238636]"
                        title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                      />
                    </div>
                    <p className="text-xs text-[#8b949e] mb-2 leading-snug">{rule.shortDescription}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#58a6ff] font-mono">
                      <span>Category: {rule.category}</span>
                      <span>&bull;</span>
                      <span>Target: {rule.targetPlatforms.join(', ')}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#21262d] flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-mono font-semibold">
                      +{rule.alternative.theoreticalFpsGainMs}ms gain
                    </span>
                    <span className="text-xs text-[#c9d1d9] truncate max-w-[200px]" title={rule.alternative.title}>
                      {rule.alternative.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Side-by-Side Diff Modal */}
      <EngineAntiPatternDiffModal
        issue={inspectingIssue}
        isOpen={isDiffModalOpen}
        onClose={() => {
          setIsDiffModalOpen(false);
          setInspectingIssue(null);
        }}
        onApplyFix={handleApplySingleFix}
        isApplying={isApplyingFix}
      />
    </div>
  );
};

export default EngineStaticAnalysisPanel;
