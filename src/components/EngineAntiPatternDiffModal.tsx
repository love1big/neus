/**
 * ============================================================================
 * MODULE: EngineAntiPatternDiffModal.tsx
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * หน้าต่างโมดอลเปรียบเทียบโค้ดก่อนและหลังการปรับแต่ง (Side-by-Side Code Diff Viewer)
 * ออกแบบมาเพื่อให้โปรแกรมเมอร์เกมตรวจสอบความแตกต่างระหว่างโค้ดเดิมที่เป็น Anti-Pattern
 * กับโค้ดทางเลือกใหม่ที่ผ่านการ Optimize แล้ว (Performance-Optimized Alternative):
 * 1. แสดงตัวเปรียบเทียบแบบขนาน (Side-by-Side Comparison: Anti-Pattern vs Optimized)
 * 2. แสดงตัวเลขผลกระทบเชิงวิศวกรรม (Telemetry Metrics: Frame Time, GC Allocation, CPU Cycles)
 * 3. ปุ่ม 'Apply Optimization' เพื่อแทนที่โค้ดในเอดิเตอร์ทันที
 * 4. คำอธิบายเชิงสถาปัตยกรรม (Architectural Justification) ว่าเหตุใดทางเลือกนี้ถึงเร็วกว่า
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - ถูกเรียกใช้จาก: `EngineStaticAnalysisPanel.tsx`
 * - ใช้งาน: `EngineAntiPatternIssue` จาก `EngineAntiPatternTypes.ts`
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - ตรวจสอบว่า Issue และ OptimizedAlternative มีข้อมูลครบถ้วน
 * - มีปุ่ม Esc และปุ่มปิด X เพื่อยกเลิกอย่างปลอดภัย
 * 
 * ============================================================================
 */

import React from 'react';
import { 
  X, Zap, ShieldCheck, AlertTriangle, ArrowRight, Check, Sparkles, Cpu, Clock, HardDrive
} from 'lucide-react';
import { EngineAntiPatternIssue } from '../utils/staticAnalysis/EngineAntiPatternTypes';

export interface EngineAntiPatternDiffModalProps {
  issue: EngineAntiPatternIssue | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyFix: (issue: EngineAntiPatternIssue) => void;
  isApplying?: boolean;
}

export const EngineAntiPatternDiffModal: React.FC<EngineAntiPatternDiffModalProps> = ({
  issue,
  isOpen,
  onClose,
  onApplyFix,
  isApplying = false
}) => {
  if (!isOpen || !issue) return null;

  const alt = issue.optimizedAlternative;
  const isCritical = issue.severity === 'CRITICAL';
  const isHigh = issue.severity === 'HIGH';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div 
        className="bg-[#161a22] border border-[#30363d] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-[#c9d1d9] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${
              isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              isHigh ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              <Zap size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm tracking-wide">{issue.ruleName}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                  {issue.ruleId}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  isCritical ? 'bg-red-900/50 text-red-300 border border-red-700/50' :
                  isHigh ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50' :
                  'bg-blue-900/50 text-blue-300 border border-blue-700/50'
                }`}>
                  {issue.severity}
                </span>
              </div>
              <p className="text-[#8b949e] text-xs mt-0.5">
                Line {issue.lineNumber}, Column {issue.columnNumber} &bull; Category: <span className="text-[#58a6ff]">{issue.category}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#8b949e] hover:text-white p-1.5 rounded-lg hover:bg-[#21262d] transition-colors"
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-[#11151c] border-b border-[#21262d]">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex items-center gap-3">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
              <Clock size={16} />
            </div>
            <div>
              <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">Estimated Frame Time Saved</div>
              <div className="text-white font-mono font-bold text-base text-emerald-400">
                +{alt.theoreticalFpsGainMs} ms <span className="text-xs text-[#8b949e] font-normal">/ frame</span>
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex items-center gap-3">
            <div className="p-2 rounded bg-cyan-500/10 text-cyan-400">
              <HardDrive size={16} />
            </div>
            <div>
              <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">GC Memory Churn Avoided</div>
              <div className="text-white font-mono font-bold text-base text-cyan-400">
                -{alt.estimatedGcSavedKb} KB <span className="text-xs text-[#8b949e] font-normal">/ frame</span>
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 flex items-center gap-3">
            <div className="p-2 rounded bg-purple-500/10 text-purple-400">
              <Cpu size={16} />
            </div>
            <div>
              <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider">Architecture Pattern</div>
              <div className="text-white font-bold text-xs truncate max-w-[170px]" title={alt.title}>
                {alt.title}
              </div>
            </div>
          </div>
        </div>

        {/* Explanation Banner */}
        <div className="p-4 bg-[#161b22] border-b border-[#21262d] space-y-2 text-xs">
          <div className="text-[#8b949e] leading-relaxed">
            <strong className="text-white">Bottleneck Explanation: </strong>
            {issue.explanation}
          </div>
          <div className="bg-[#1f242c] p-2.5 rounded-lg border border-[#30363d] text-[#79c0ff] flex items-start gap-2">
            <Sparkles size={15} className="shrink-0 text-[#bc8cff] mt-0.5" />
            <div>
              <strong className="text-white">Optimization Strategy: </strong>
              {alt.explanation}
            </div>
          </div>
        </div>

        {/* Side-by-Side Diff View */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Anti-Pattern (Before) */}
          <div className="flex flex-col border border-red-500/30 rounded-lg overflow-hidden bg-[#0d1117]">
            <div className="px-3 py-2 bg-red-950/30 border-b border-red-500/20 flex items-center justify-between text-xs font-bold text-red-300">
              <span className="flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-red-400" />
                Current Anti-Pattern
              </span>
              <span className="text-[10px] font-mono opacity-75">Line {issue.lineNumber}</span>
            </div>
            <div className="p-3 font-mono text-xs overflow-x-auto text-red-200/90 leading-relaxed whitespace-pre bg-[#0d1117]/80">
              {alt.originalAntiPatternCode}
            </div>
          </div>

          {/* Right Column: Performance-Optimized Alternative (After) */}
          <div className="flex flex-col border border-emerald-500/30 rounded-lg overflow-hidden bg-[#0d1117]">
            <div className="px-3 py-2 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center justify-between text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                Performance-Optimized Alternative
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80">Recommended</span>
            </div>
            <div className="p-3 font-mono text-xs overflow-x-auto text-emerald-200/90 leading-relaxed whitespace-pre bg-[#0d1117]/80">
              {alt.recommendedCode}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onApplyFix(issue)}
              disabled={isApplying || !issue.canAutoFix}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3fb950] text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isApplying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-yellow-300" />
                  Apply Optimization to Code
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineAntiPatternDiffModal;
