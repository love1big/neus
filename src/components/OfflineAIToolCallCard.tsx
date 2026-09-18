/**
 * ============================================================================
 * MODULE: OfflineAIToolCallCard.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของคอมโพเนนต์ (Component Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * คอมโพเนนต์แสดงผลการเรียกใช้เครื่องมือจริงของ AI Offline (Online AI Tool-Calling UI Card):
 *   - ถอดแบบฟีเจอร์การเรียกใช้ฟังก์ชัน (Tool/Function Calling) ของ AI Online ชั้นนำ
 *     เช่น Gemini 2.0 Function Calling / Claude Computer Use / Cursor Tool Cards
 *   - แสดงชื่อเครื่องมือ, ไอคอนระบบ, พารามิเตอร์ที่ส่งไปประมวลผล
 *   - สถานะการรันจริง (Running / Success / Error) พร้อมเวลาที่ใช้ในการประมวลผล (ms)
 *   - กล่องตรวจสอบ Output / Result พร้อมปุ่มคัดลอก (Copy) และรันซ้ำ (Re-run)
 * 
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - นำเข้าใน:
 *     - `src/components/AIChat.tsx`
 *     - `src/components/OfflineCommandPromptTerminal.tsx`
 * - ข้อมูลขับเคลื่อนโดย: `AIToolCallPayload` จาก `src/utils/OfflineCommandPromptEngine.ts`
 * 
 * 3. พารามิเตอร์ Input / Output ที่รับส่ง (Inputs & Outputs):
 * ----------------------------------------------------------------------------
 * - Props:
 *     - `toolCall`: ข้อมูลการเรียกใช้เครื่องมือ (toolName, description, parameters, status, result, executionTimeMs)
 *     - `onRerun?: () => void`
 *     - `defaultExpanded?: boolean`
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  Cpu,
  Volume2,
  Compass,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AIToolCallPayload } from '../utils/OfflineCommandPromptEngine';

interface OfflineAIToolCallCardProps {
  toolCall: AIToolCallPayload;
  onRerun?: () => void;
  defaultExpanded?: boolean;
}

export default function OfflineAIToolCallCard({
  toolCall,
  onRerun,
  defaultExpanded = false
}: OfflineAIToolCallCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  // Icon mapping based on tool name
  const getToolIcon = (name: string) => {
    if (name.includes('diagnostics') || name.includes('system')) return <Cpu size={14} className="text-cyan-400" />;
    if (name.includes('throttle') || name.includes('hardware')) return <Zap size={14} className="text-amber-400" />;
    if (name.includes('audio') || name.includes('sound')) return <Volume2 size={14} className="text-emerald-400" />;
    if (name.includes('navigation') || name.includes('workspace')) return <Compass size={14} className="text-purple-400" />;
    if (name.includes('security') || name.includes('audit')) return <ShieldCheck size={14} className="text-blue-400" />;
    return <Wrench size={14} className="text-cyan-400" />;
  };

  const handleCopy = () => {
    if (toolCall.result) {
      navigator.clipboard.writeText(toolCall.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-2 rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden shadow-lg transition-all text-xs font-sans">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3 py-2 bg-[#161b22] hover:bg-[#1f242c] cursor-pointer flex items-center justify-between transition-colors select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded bg-[#21262d] border border-[#30363d] shrink-0">
            {getToolIcon(toolCall.toolName)}
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#8b949e]">
              TOOL INVOKED
            </span>
            <span className="font-mono font-bold text-white truncate">
              {toolCall.toolName}
            </span>
            {toolCall.executionTimeMs !== undefined && (
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#21262d] text-[#8b949e]">
                {toolCall.executionTimeMs}ms
              </span>
            )}
          </div>
        </div>

        {/* Status Badge & Chevron */}
        <div className="flex items-center gap-2 shrink-0">
          {toolCall.status === 'running' && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
              <Loader2 size={10} className="animate-spin" /> RUNNING
            </span>
          )}
          {toolCall.status === 'success' && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <CheckCircle2 size={10} /> EXECUTED
            </span>
          )}
          {toolCall.status === 'error' && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
              <AlertCircle size={10} /> FAILED
            </span>
          )}

          <div className="text-[#8b949e]">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        </div>
      </div>

      {/* Description line */}
      <div className="px-3 py-1.5 bg-[#090d13] text-[#8b949e] text-[10.5px] border-b border-[#21262d] flex items-center justify-between">
        <span className="truncate">{toolCall.description}</span>
        {onRerun && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRerun();
            }}
            className="flex items-center gap-1 text-[10px] text-[#58a6ff] hover:underline cursor-pointer ml-2 shrink-0"
          >
            <RefreshCw size={10} /> Re-run
          </button>
        )}
      </div>

      {/* Expandable Inspector Body */}
      {isExpanded && (
        <div className="p-3 space-y-2 bg-[#0d1117] text-[11px] font-mono">
          {/* Parameters */}
          {toolCall.parameters && Object.keys(toolCall.parameters).length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider mb-1">
                Input Arguments:
              </div>
              <div className="p-2 rounded bg-[#161b22] border border-[#21262d] text-cyan-300 overflow-x-auto max-h-32 text-[10px]">
                <pre>{JSON.stringify(toolCall.parameters, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Result Output */}
          {toolCall.result && (
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-[#8b949e] uppercase tracking-wider mb-1">
                <span>Output Result:</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[#58a6ff] hover:text-white cursor-pointer"
                >
                  {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2 rounded bg-[#070a0e] border border-[#21262d] text-emerald-300 font-mono whitespace-pre-wrap break-all text-[10px] max-h-40 overflow-y-auto">
                {toolCall.result}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
