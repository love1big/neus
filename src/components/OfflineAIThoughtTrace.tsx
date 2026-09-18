/**
 * ============================================================================
 * MODULE: OfflineAIThoughtTrace.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของคอมโพเนนต์ (Component Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * คอมโพเนนต์แสดงลำดับความคิดเชิงลึกของ AI Offline (Chain-of-Thought / Deep Reasoning):
 *   - ถอดแบบฟีเจอร์โมเดลคิดเชิงลึกของ AI Online ยุคใหม่ (เช่น Gemini 2.0 Flash Thinking,
 *     Claude 3.7 Sonnet Thinking, OpenAI o1/o3)
 *   - แสดงแต่ละขั้นตอนการวิเคราะห์ (Analysis Steps) พร้อมไอคอนสถานะ (Completed, In Progress)
 *   - ยุบ/ขยายได้ (Collapsible) เพื่อไม่ให้บดบังเนื้อหาคำตอบหลัก พร้อมบอกระยะเวลาการคิด (Thinking Time)
 * 
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - นำเข้าใน: `src/components/AIChat.tsx`
 * - ข้อมูลขับเคลื่อนโดย: `ThoughtStep[]` จาก `src/utils/OfflineCommandPromptEngine.ts`
 * 
 * 3. พารามิเตอร์ Input / Output ที่รับส่ง (Inputs & Outputs):
 * ----------------------------------------------------------------------------
 * - Props:
 *     - `thoughts`: อาเรย์ของ ThoughtStep (title, detail, status)
 *     - `thinkingTimeMs?: number`
 *     - `defaultOpen?: boolean`
 * ============================================================================
 */

import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronRight, CheckCircle2, CircleDashed, Brain } from 'lucide-react';
import { ThoughtStep } from '../utils/OfflineCommandPromptEngine';

interface OfflineAIThoughtTraceProps {
  thoughts: ThoughtStep[];
  thinkingTimeMs?: number;
  defaultOpen?: boolean;
}

export default function OfflineAIThoughtTrace({
  thoughts,
  thinkingTimeMs = 320,
  defaultOpen = false
}: OfflineAIThoughtTraceProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!thoughts || thoughts.length === 0) return null;

  return (
    <div className="my-2 rounded-xl border border-[#30363d]/70 bg-[#07090e] overflow-hidden text-xs">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-[#10141d] hover:bg-[#161b26] cursor-pointer flex items-center justify-between transition-colors select-none text-[#8b949e]"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/25">
            <Brain size={13} className="animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-white/90">Reasoning Process</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#21262d] text-[#8b949e]">
              {thoughts.length} steps • {(thinkingTimeMs / 1000).toFixed(2)}s
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#8b949e]">
          <span>{isOpen ? 'Hide reasoning' : 'Show reasoning'}</span>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </div>

      {/* Expanded Reasoning Body */}
      {isOpen && (
        <div className="p-3 space-y-2 border-t border-[#21262d] bg-[#090c12]">
          {thoughts.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">
                {step.status === 'completed' ? (
                  <CheckCircle2 size={12} className="text-emerald-400" />
                ) : step.status === 'in_progress' ? (
                  <CircleDashed size={12} className="text-cyan-400 animate-spin" />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-gray-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[11px] font-semibold text-cyan-300">
                  {idx + 1}. {step.title}
                </div>
                <div className="text-[10.5px] text-[#8b949e] mt-0.5 leading-relaxed">
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
