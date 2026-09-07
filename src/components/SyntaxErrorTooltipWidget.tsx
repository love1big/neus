/**
 * ============================================================================
 * SyntaxErrorTooltipWidget.tsx
 * ============================================================================
 * 
 * [TH] วัตถุประสงค์และหน้าที่:
 * คอมโพเนนต์แสดง Tooltip อัจฉริยะแบบลอย (Floating Error Diagnostics Tooltip)
 * สำหรับข้อผิดพลาดไวยากรณ์ (Syntax / Semantic Errors) ใน CodeEditor:
 * 1. แสดงรายละเอียดข้อผิดพลาด (Message, Code, Severity, Line/Col)
 * 2. แสดงคำแนะนำแก้ไข (AI / Heuristic Suggestion)
 * 3. ปุ่ม 'Fix with AI' (One-Click AI Quick-Fix) เพื่อแก้โค้ดที่ผิดพลาดทันที
 * 4. ปุ่ม 'Explain with AI' และปุ่มกระโดดไปยังบรรทัดที่มีปัญหา
 * 
 * [EN] Purpose & Responsibilities:
 * Interactive floating diagnostic tooltip and quick-action bar for real-time
 * code syntax errors with instant "Fix with AI" and "Explain with AI" actions.
 * ============================================================================
 */

import React from 'react';
import { 
  AlertCircle, AlertTriangle, Info, Sparkles, Wrench, ArrowRight, Check, X, Code2, Bot 
} from 'lucide-react';
import { DiagnosticError } from '../utils/LanguageErrorChecker';

export interface SyntaxErrorTooltipWidgetProps {
  diagnostic: DiagnosticError;
  position: { top: number; left: number };
  languageName: string;
  onFixWithAI: (diag: DiagnosticError) => void;
  onExplainWithAI?: (diag: DiagnosticError) => void;
  onDismiss: () => void;
  onJumpToLine?: (line: number, col: number) => void;
  isFixing?: boolean;
}

export const SyntaxErrorTooltipWidget: React.FC<SyntaxErrorTooltipWidgetProps> = ({
  diagnostic,
  position,
  languageName,
  onFixWithAI,
  onExplainWithAI,
  onDismiss,
  onJumpToLine,
  isFixing = false,
}) => {
  const isError = diagnostic.severity === 'error';
  const isWarning = diagnostic.severity === 'warning';

  return (
    <div
      id="syntax-error-floating-tooltip"
      className="absolute z-50 pointer-events-auto font-sans shadow-2xl rounded-md border border-[#30363d] bg-[#161b22]/95 backdrop-blur-md text-xs text-[#c9d1d9] flex flex-col min-w-[320px] max-w-[420px] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      style={{
        top: `${Math.max(10, position.top)}px`,
        left: `${Math.max(10, Math.min(position.left, window.innerWidth - 440))}px`,
      }}
    >
      {/* Tooltip Header */}
      <div className={`px-3 py-1.5 flex items-center justify-between border-b ${
        isError ? 'bg-[#f85149]/15 border-[#f85149]/30 text-[#ff7b72]' :
        isWarning ? 'bg-[#d29922]/15 border-[#d29922]/30 text-[#e3b341]' :
        'bg-[#58a6ff]/15 border-[#58a6ff]/30 text-[#79c0ff]'
      }`}>
        <div className="flex items-center gap-2 font-semibold">
          {isError ? <AlertCircle size={14} className="text-[#f85149]" /> :
           isWarning ? <AlertTriangle size={14} className="text-[#d29922]" /> :
           <Info size={14} className="text-[#58a6ff]" />}
          <span className="capitalize">{diagnostic.severity} in {languageName}</span>
          <span className="font-mono text-[10px] px-1 bg-[#21262d] text-[#8b949e] rounded font-normal">
            Ln {diagnostic.line}, Col {diagnostic.column}
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="text-[#8b949e] hover:text-white p-0.5 rounded hover:bg-[#30363d]/50 transition-colors"
          title="Close tooltip"
        >
          <X size={12} />
        </button>
      </div>

      {/* Message Body */}
      <div className="p-3 flex flex-col gap-2">
        <div className="text-white font-medium text-[12px] leading-snug">
          {diagnostic.message}
        </div>

        {diagnostic.code && (
          <div className="flex items-center gap-1.5 text-[10px] text-[#8b949e] font-mono">
            <span className="text-[#7d8590]">Rule:</span>
            <span className="px-1.5 py-0.5 bg-[#21262d] border border-[#30363d] rounded text-[#d2a8ff]">
              {diagnostic.code}
            </span>
          </div>
        )}

        {diagnostic.suggestion && (
          <div className="bg-[#21262d]/80 border border-[#30363d] rounded p-2 text-[11px] text-[#58a6ff] flex items-start gap-1.5">
            <Sparkles size={13} className="shrink-0 mt-0.5 text-[#bc8cff]" />
            <div className="leading-snug">
              <strong className="text-[#e6edf3]">AI Insight: </strong>
              {diagnostic.suggestion}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-3 py-2 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {onJumpToLine && (
            <button
              onClick={() => onJumpToLine(diagnostic.line, diagnostic.column)}
              className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white rounded text-[10px] font-mono flex items-center gap-1 transition-colors"
              title="Jump to code position"
            >
              Go to Line <ArrowRight size={10} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onExplainWithAI && (
            <button
              onClick={() => onExplainWithAI(diagnostic)}
              className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] hover:text-[#58a6ff] text-[#c9d1d9] rounded text-[10px] font-medium flex items-center gap-1 transition-colors"
              title="Explain error details with AI"
            >
              <Bot size={11} className="text-[#58a6ff]" />
              Explain
            </button>
          )}

          {/* Fix with AI Button */}
          <button
            id="fix-with-ai-tooltip-btn"
            onClick={() => onFixWithAI(diagnostic)}
            disabled={isFixing}
            className="px-3 py-1 bg-gradient-to-r from-[#8957e5] to-[#6f42c1] hover:from-[#9867f6] hover:to-[#7e4ecb] text-white rounded text-[11px] font-bold shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            title="Automatically fix this error using AI heuristics and language grammar"
          >
            {isFixing ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Fixing...
              </>
            ) : (
              <>
                <Sparkles size={12} className="text-[#f1e05a]" />
                Fix with AI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyntaxErrorTooltipWidget;
