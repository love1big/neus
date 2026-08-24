/**
 * ====================================================================================================
 * COMPONENT: OfflineErrorPatchSynthesizerView.tsx
 * PURPOSE: Live Bug Ingestion, Root Cause Analysis & Immune Patch Synthesizer
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์:
 * 1. ระบบรับเข้าข้อผิดพลาดสด (Live Bug Ingestion) จาก Error Log, Stack Trace, หรือ Crash Report
 * 2. ทำการวิเคราะห์สาเหตุแท้จริง (Root Cause Analysis - RCA) แบบออฟไลน์ 100%
 * 3. สกัดกฎข้อห้าม Anti-Pattern และสังเคราะห์โค้ดแก้ไข (Immune Patch Synthesis)
 * 4. บันทึกเข้าสู่คลังความจำถาวรทันที (Save into Permanent Memory) พร้อมกระจายความจำไปยัง AI ทุกตัว
 * ====================================================================================================
 */

import React, { useState } from 'react';
import { 
  Sparkles, Bug, CheckCircle2, ShieldCheck, AlertTriangle, 
  Code2, Save, ArrowRight, RefreshCw, Cpu, Layers 
} from 'lucide-react';
import { 
  OfflineAIErrorImmunityCore, 
  BugKnowledgeRecord, 
  BugDomain 
} from '../utils/OfflineAIErrorImmunityCore';
import { OfflineErrorMemoryStore } from '../utils/OfflineErrorMemoryStore';

const SAMPLE_CRASH_LOGS = [
  {
    title: 'WebGL RenderTarget Leak',
    log: 'THREE.WebGLRenderer: Context Lost. VRAM out of memory. 128 RenderTarget instances unreleased.',
    failing: `function createPostProcessBuffers(renderer, width, height) {\n  const target = new THREE.WebGLRenderTarget(width, height);\n  return target;\n  // Never disposed!\n}`
  },
  {
    title: 'Physics Raycast NaN Coordinate',
    log: 'Uncaught Error: Raycast origin direction vector has NaN components. Physics query failed.',
    failing: `function fireRaycast(origin, target) {\n  const dir = target.clone().sub(origin).normalize();\n  physicsWorld.raycast(origin, dir);\n}`
  },
  {
    title: 'JSON Parse Corrupted Save State',
    log: 'SyntaxError: Unexpected token < in JSON at position 0. Corrupt game_save.dat.',
    failing: `function loadGameSave(rawData) {\n  const parsed = JSON.parse(rawData);\n  return parsed.playerState;\n}`
  }
];

export default function OfflineErrorPatchSynthesizerView({ onRecordLearned }: { onRecordLearned?: (record: BugKnowledgeRecord) => void }) {
  const [errorInput, setErrorInput] = useState<string>(SAMPLE_CRASH_LOGS[0].log);
  const [failingCode, setFailingCode] = useState<string>(SAMPLE_CRASH_LOGS[0].failing);
  const [contextTitle, setContextTitle] = useState<string>(SAMPLE_CRASH_LOGS[0].title);
  const [synthesizedRecord, setSynthesizedRecord] = useState<BugKnowledgeRecord | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSynthesize = () => {
    if (!errorInput.trim()) return;

    setIsSynthesizing(true);
    setSavedSuccess(false);

    setTimeout(() => {
      const record = OfflineAIErrorImmunityCore.ingestAndLearnBug(
        errorInput,
        failingCode,
        '',
        contextTitle
      );
      setSynthesizedRecord(record);
      setIsSynthesizing(false);
    }, 400);
  };

  const handleSaveToMemory = () => {
    if (!synthesizedRecord) return;
    OfflineErrorMemoryStore.saveRecord(synthesizedRecord);
    setSavedSuccess(true);
    if (onRecordLearned) onRecordLearned(synthesizedRecord);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#30363d] shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#388bfd]" size={20} />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Live Bug Ingestion, RCA & Immunity Synthesizer
              <span className="px-2 py-0.5 bg-[#388bfd]/20 border border-[#388bfd]/40 text-[#58a6ff] text-[10px] rounded font-mono">
                AUTONOMOUS LEARNING LAB
              </span>
            </h2>
            <p className="text-xs text-[#8b949e]">
              ป้อน Error Log หรือ Stack Trace เพื่อให้ AI ออฟไลน์วิเคราะห์ สกัด Anti-Pattern และสร้างภูมิคุ้มกันถาวร
            </p>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8b949e]">โหลดตัวอย่าง Crash:</span>
          {SAMPLE_CRASH_LOGS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setErrorInput(sample.log);
                setFailingCode(sample.failing);
                setContextTitle(sample.title);
                setSynthesizedRecord(null);
              }}
              className="px-2 py-1 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-xs text-[#58a6ff] rounded transition-colors"
            >
              {sample.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3 overflow-hidden">
        {/* Left Column: Error Input Form */}
        <div className="lg:col-span-6 flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden p-3 space-y-3">
          <div>
            <label className="text-xs font-bold text-white mb-1 block">ชื่อหรือหัวข้อข้อผิดพลาด (Title):</label>
            <input
              type="text"
              value={contextTitle}
              onChange={(e) => setContextTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded text-xs text-white outline-none focus:border-[#58a6ff]"
              placeholder="ระบุชื่อบัค เช่น WebGL Texture Leak..."
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-xs font-bold text-white mb-1 flex items-center justify-between">
              <span>ข้อความ Error / Stack Trace / Crash Log:</span>
              <span className="text-[10px] text-[#8b949e] font-mono">Raw Text</span>
            </label>
            <textarea
              value={errorInput}
              onChange={(e) => setErrorInput(e.target.value)}
              className="flex-1 w-full p-2.5 bg-[#0d1117] text-[#ff7b72] font-mono text-xs outline-none resize-none rounded border border-[#30363d] focus:border-[#58a6ff] leading-relaxed"
              placeholder="วาง Error Stack Trace ที่นี่..."
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-xs font-bold text-white mb-1 flex items-center justify-between">
              <span>โค้ดที่ก่อให้เกิดข้อผิดพลาด (Failing Code Snippet):</span>
              <span className="text-[10px] text-[#8b949e] font-mono">Optional</span>
            </label>
            <textarea
              value={failingCode}
              onChange={(e) => setFailingCode(e.target.value)}
              className="flex-1 w-full p-2.5 bg-[#0d1117] text-[#c9d1d9] font-mono text-xs outline-none resize-none rounded border border-[#30363d] focus:border-[#58a6ff] leading-relaxed"
              placeholder="วางโค้ดที่ทำให้เกิดบัคที่นี่..."
            />
          </div>

          <button
            onClick={handleSynthesize}
            disabled={isSynthesizing || !errorInput.trim()}
            className="w-full py-2 bg-[#1f6feb] hover:bg-[#388bfd] disabled:opacity-50 text-white rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Cpu size={14} />
            <span>{isSynthesizing ? 'กำลังวิเคราะห์ RCA และสร้างภูมิคุ้มกัน...' : 'วิเคราะห์สาเหตุและสร้างภูมิคุ้มกัน (Analyze & Synthesize)'}</span>
          </button>
        </div>

        {/* Right Column: Synthesized Knowledge & Patch Record */}
        <div className="lg:col-span-6 flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
          <div className="bg-[#0e1014] px-3 py-2 border-b border-[#30363d] flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#3fb950]" />
              ผลการสกัดภูมิคุ้มกัน (Immunity Knowledge Synthesis)
            </span>
            {synthesizedRecord && (
              <span className="px-2 py-0.5 bg-[#238636]/20 border border-[#238636]/40 text-[#3fb950] text-[10px] rounded font-mono">
                {synthesizedRecord.domain}
              </span>
            )}
          </div>

          {synthesizedRecord ? (
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#30363d] text-[#8b949e]">
                    {synthesizedRecord.fingerprint}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">{synthesizedRecord.titleThai}</h3>
                </div>
                <span className="text-[10px] text-[#3fb950] font-bold font-mono">
                  Confidence: {synthesizedRecord.immunityScore}%
                </span>
              </div>

              {/* RCA Details */}
              <div className="p-2.5 bg-[#0d1117] border border-[#21262d] rounded">
                <span className="text-[10px] font-bold text-[#e3b341] uppercase tracking-wider">
                  สาเหตุแท้จริง (Root Cause Analysis):
                </span>
                <p className="text-[11px] text-[#c9d1d9] mt-1 leading-relaxed">
                  {synthesizedRecord.rootCauseThai}
                </p>
              </div>

              {/* Anti-Pattern Rule */}
              <div className="p-2.5 bg-[#0d1117] border border-[#21262d] rounded">
                <span className="text-[10px] font-bold text-[#f85149] uppercase tracking-wider">
                  กฎข้อห้าม (Anti-Pattern Negative Constraint):
                </span>
                <p className="text-[11px] text-[#ff7b72] mt-1 leading-relaxed">
                  {synthesizedRecord.antiPattern.patternDescriptionThai}
                </p>
                <div className="mt-1.5 p-1.5 bg-[#0a0c10] rounded font-mono text-[9px] text-[#8b949e]">
                  Regex: {synthesizedRecord.antiPattern.forbiddenCodeRegex.join(' | ')}
                </div>
              </div>

              {/* Immune Code */}
              <div>
                <span className="text-[10px] font-bold text-[#3fb950] uppercase tracking-wider">
                  โค้ดแก้ไขและภูมิคุ้มกัน (Immune Code Solution):
                </span>
                <pre className="mt-1 p-2 bg-[#0a0c10] border border-[#21262d] rounded font-mono text-[10px] text-[#7ee787] overflow-x-auto leading-relaxed">
                  {synthesizedRecord.immuneCodeSample}
                </pre>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveToMemory}
                className="w-full py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save size={14} />
                <span>
                  {savedSuccess ? 'บันทึกเข้าสู่ความจำถาวรสำเร็จแล้ว! (Saved Permanently)' : 'บันทึกเข้าสู่คลังความจำถาวร (Commit to Permanent Memory)'}
                </span>
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#8b949e] text-xs">
              <Bug size={40} className="text-[#30363d] mb-2" />
              <p>ป้อนข้อความข้อผิดพลาดฝั่งซ้าย แล้วกดปุ่มวิเคราะห์เพื่อสร้างภูมิคุ้มกัน</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
