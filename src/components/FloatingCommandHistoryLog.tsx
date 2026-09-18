/**
 * ============================================================================
 * MODULE: FloatingCommandHistoryLog.tsx
 * ============================================================================
 * 
 * [THAI]
 * วัตถุประสงค์และหน้าที่ของคอมโพเนนต์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * คอมโพเนนต์แสดงผลประวัติคำสั่งลอยตัวใต้ CommandPalette (Floating Command History Log)
 * แสดงผลรายการการกระทำและการแก้ไข 10 รายการล่าสุดทั่วทั้งเอนจิน (Last 10 Executed Actions)
 * เพื่อช่วยให้นักพัฒนาสามารถติดตาม (Trace), ตรวจสอบผลกระทบ (Telemetry Impact),
 * ดูบันทึกการแก้ไขโค้ด (Diff/Line numbers), และสั่งรันซ้ำ (Re-run / Jump) ได้ทันที
 * 
 * [ENGLISH]
 * Floating Command History Log Component for OmniEngine Studio:
 * ----------------------------------------------------------------------------
 * Renders an enterprise floating diagnostics panel directly beneath the CommandPalette.
 * Exposes the last 10 executed actions across the engine with deep modification tracing:
 * 1. Live categorical telemetry, timestamps, and status pills (OPTIMIZED, MODIFIED, DISPATCHED).
 * 2. Interactive expandable modification traces displaying diff previews, affected lines, and FPS/GC impact.
 * 3. Immediate 1-click "Re-run / Jump" and clipboard trace export.
 * 4. Flexible display modes (Expandable, Collapsible, and Category Filter).
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - นำเข้าและแสดงผลใต้: `CommandPalette.tsx`
 * - ดึงข้อมูลและติดตามการเปลี่ยนแปลงผ่าน: `EngineCommandHistoryTracker.ts`
 * - สื่อสารการเปลี่ยนเครื่องมือและซับซิสเต็มผ่าน callback `onSelectTool`
 * 
 * พารามิเตอร์ Input / Output ที่รับส่ง (Inputs & Outputs):
 * ----------------------------------------------------------------------------
 * - Inputs:
 *     - `onSelectTool?: (toolId: string) => void` : ฟังก์ชันสำหรับสลับเครื่องมือเมื่อกด Re-run
 *     - `onClosePalette?: () => void` : ฟังก์ชันสำหรับปิด CommandPalette เมื่อกระโดดไปยังเครื่องมือ
 *     - `compactDefault?: boolean` : ตั้งค่าสถานะเริ่มต้นแบบย่อหรือขยาย
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - เมื่อไม่มีประวัติคำสั่ง จะแสดง Placeholder พร้อมปุ่ม Reset Sample History
 * - รองรับ Clipboard Copy พร้อม Fallback และการแสดง Feedback ข้อความ
 * 
 * ============================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  History,
  Clock,
  Sparkles,
  Zap,
  RotateCcw,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
  ExternalLink,
  Code2,
  Wrench,
  Boxes,
  Cpu,
  Flame,
  Save,
  Filter,
  ArrowRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import {
  EngineCommandHistoryTracker,
  EngineCommandAction,
  CommandActionCategory,
  CommandActionStatus
} from '../utils/EngineCommandHistoryTracker';

interface FloatingCommandHistoryLogProps {
  onSelectTool?: (toolId: string) => void;
  onClosePalette?: () => void;
  compactDefault?: boolean;
}

/**
 * Returns formatted relative time string (e.g. "Just now", "2m ago", "1h ago")
 */
function getRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 45) return 'Just now';
  if (diffSec < 90) return '1m ago';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Visual badge styling and icon mapping per category
 */
function getCategoryMeta(category: CommandActionCategory) {
  switch (category) {
    case 'CODE_MODIFICATION':
      return {
        label: 'Code Mod',
        icon: <Code2 size={13} className="text-[#38bdf8]" />,
        badgeBg: 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30',
        dotColor: '#38bdf8'
      };
    case 'ENGINE_SUBSYSTEM':
      return {
        label: 'Subsystem',
        icon: <Wrench size={13} className="text-[#34d399]" />,
        badgeBg: 'bg-[#34d399]/15 text-[#34d399] border-[#34d399]/30',
        dotColor: '#34d399'
      };
    case 'ASSET_PIPELINE':
      return {
        label: 'Asset',
        icon: <Boxes size={13} className="text-[#fbbf24]" />,
        badgeBg: 'bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30',
        dotColor: '#fbbf24'
      };
    case 'COMPUTE_KERNEL':
      return {
        label: 'Compute',
        icon: <Cpu size={13} className="text-[#a78bfa]" />,
        badgeBg: 'bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/30',
        dotColor: '#a78bfa'
      };
    case 'PHYSICS_SIM':
      return {
        label: 'Physics',
        icon: <Flame size={13} className="text-[#f87171]" />,
        badgeBg: 'bg-[#f87171]/15 text-[#f87171] border-[#f87171]/30',
        dotColor: '#f87171'
      };
    case 'PROJECT_STATE':
      return {
        label: 'State',
        icon: <Save size={13} className="text-[#818cf8]" />,
        badgeBg: 'bg-[#818cf8]/15 text-[#818cf8] border-[#818cf8]/30',
        dotColor: '#818cf8'
      };
    default:
      return {
        label: 'General',
        icon: <Activity size={13} className="text-[#94a3b8]" />,
        badgeBg: 'bg-[#94a3b8]/15 text-[#94a3b8] border-[#94a3b8]/30',
        dotColor: '#94a3b8'
      };
  }
}

/**
 * Status tag styling
 */
function getStatusBadge(status: CommandActionStatus) {
  switch (status) {
    case 'OPTIMIZED':
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 flex items-center gap-1">
          <Zap size={9} /> OPTIMIZED
        </span>
      );
    case 'MODIFIED':
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40 flex items-center gap-1">
          <Sparkles size={9} /> MODIFIED
        </span>
      );
    case 'REFACTORED':
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#d97706]/20 text-[#fbbf24] border border-[#d97706]/40 flex items-center gap-1">
          <RotateCcw size={9} /> REFACTORED
        </span>
      );
    case 'DISPATCHED':
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#7c3aed]/20 text-[#c084fc] border border-[#7c3aed]/40 flex items-center gap-1">
          <Cpu size={9} /> DISPATCHED
        </span>
      );
    case 'SUCCESS':
    default:
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#16a34a]/20 text-[#4ade80] border border-[#16a34a]/40 flex items-center gap-1">
          <ShieldCheck size={9} /> SUCCESS
        </span>
      );
  }
}

export default function FloatingCommandHistoryLog({
  onSelectTool,
  onClosePalette,
  compactDefault = false
}: FloatingCommandHistoryLogProps) {
  const [actions, setActions] = useState<EngineCommandAction[]>([]);
  const [isExpanded, setIsExpanded] = useState(!compactDefault);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Subscribe to real-time engine command updates
  useEffect(() => {
    const unsubscribe = EngineCommandHistoryTracker.subscribe((items) => {
      setActions(items);
    });
    return () => unsubscribe();
  }, []);

  const filteredActions = useMemo(() => {
    if (selectedCategory === 'ALL') return actions;
    return actions.filter((a) => a.category === selectedCategory);
  }, [actions, selectedCategory]);

  const handleCopyTrace = (action: EngineCommandAction, e: React.MouseEvent) => {
    e.stopPropagation();
    const traceText = `[NEXUS_ENGINE_ACTION_TRACE]
ID: ${action.id}
Command: ${action.title}
Subsystem: ${action.targetSubsystem}
Category: ${action.category}
Status: ${action.status}
Timestamp: ${new Date(action.timestamp).toISOString()}
Summary: ${action.description}
${action.details?.affectedFile ? `File: ${action.details.affectedFile}` : ''}
${action.details?.affectedLines ? `Lines: ${action.details.affectedLines}` : ''}
${action.details?.diffSummary ? `Diff: ${action.details.diffSummary}` : ''}
${action.details?.telemetryImpact ? `Impact: ${action.details.telemetryImpact}` : ''}`;

    navigator.clipboard.writeText(traceText);
    setCopiedId(action.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReRun = (action: EngineCommandAction, e: React.MouseEvent) => {
    e.stopPropagation();
    EngineCommandHistoryTracker.reExecuteAction(action, onSelectTool);
    if (onClosePalette) {
      onClosePalette();
    }
  };

  return (
    <div className="w-full bg-[#0d1117]/95 border border-[#30363d] backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-200">
      {/* Header Bar */}
      <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-[#38bdf8]">
            <History size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                Command History Log
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 font-semibold">
                Last {actions.length} Executed Actions
              </span>
            </div>
            <span className="text-[10px] text-[#8b949e] font-sans block">
              Real-time audit trace of engine modifications & AST executions
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Category Filter dropdown */}
          <div className="relative flex items-center">
            <Filter size={11} className="text-[#8b949e] mr-1 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-[10px] font-mono rounded px-2 py-0.5 outline-none hover:border-[#58a6ff] cursor-pointer"
            >
              <option value="ALL">All Categories ({actions.length})</option>
              <option value="CODE_MODIFICATION">Code Mod</option>
              <option value="ENGINE_SUBSYSTEM">Subsystems</option>
              <option value="ASSET_PIPELINE">Asset Pipeline</option>
              <option value="COMPUTE_KERNEL">Compute</option>
              <option value="PHYSICS_SIM">Physics</option>
              <option value="PROJECT_STATE">State & Saves</option>
            </select>
          </div>

          {/* Reset / Clear */}
          <button
            onClick={() => EngineCommandHistoryTracker.resetToDefaults()}
            className="p-1 text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#21262d] rounded transition-colors"
            title="Reset to sample engine history"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={() => EngineCommandHistoryTracker.clearHistory()}
            className="p-1 text-[#8b949e] hover:text-[#f85149] hover:bg-[#21262d] rounded transition-colors"
            title="Clear all history entries"
          >
            <Trash2 size={13} />
          </button>

          {/* Toggle Expand / Collapse */}
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-[#21262d] text-[#c9d1d9] hover:text-white hover:bg-[#30363d] transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={13} />
                <span className="hidden sm:inline">Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown size={13} />
                <span className="hidden sm:inline">Expand</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action List Section */}
      {isExpanded && (
        <div className="max-h-[36vh] overflow-y-auto custom-scrollbar p-2 space-y-1.5 divide-y divide-[#21262d]/40">
          {filteredActions.length === 0 ? (
            <div className="py-8 text-center text-[#8b949e] text-xs">
              <History size={24} className="mx-auto mb-2 opacity-30 text-[#8b949e]" />
              <p>No executed actions recorded in this category.</p>
              <button
                onClick={() => EngineCommandHistoryTracker.resetToDefaults()}
                className="mt-2 text-[11px] text-[#58a6ff] hover:underline"
              >
                Restore sample project activity
              </button>
            </div>
          ) : (
            filteredActions.map((action, idx) => {
              const meta = getCategoryMeta(action.category);
              const isTraceOpen = expandedTraceId === action.id;

              return (
                <div
                  key={action.id}
                  className={`pt-1.5 transition-colors ${
                    isTraceOpen ? 'bg-[#161b22]/70 rounded-xl p-2.5 border border-[#30363d]' : ''
                  }`}
                >
                  <div
                    onClick={() => setExpandedTraceId(isTraceOpen ? null : action.id)}
                    className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-[#161b22] cursor-pointer group transition-all"
                  >
                    {/* Left: Sequence index & Category Icon */}
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 pt-0.5 shrink-0">
                        <span className="text-[10px] font-mono font-bold text-[#8b949e] w-4 text-right">
                          {idx + 1}.
                        </span>
                        <div className="p-1.5 rounded-lg bg-[#0d1117] border border-[#30363d] shrink-0">
                          {meta.icon}
                        </div>
                      </div>

                      {/* Middle: Title, Subsystem, & Description */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors truncate">
                            {action.title}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${meta.badgeBg}`}
                          >
                            {action.targetSubsystem}
                          </span>
                          {getStatusBadge(action.status)}
                        </div>

                        <p className="text-[11px] text-[#8b949e] font-sans line-clamp-1 mt-0.5">
                          {action.description}
                        </p>

                        {/* Telemetry teaser tag if available */}
                        {action.details?.telemetryImpact && (
                          <div className="flex items-center gap-1 text-[10px] text-[#34d399] font-mono mt-0.5">
                            <Zap size={10} />
                            <span>{action.details.telemetryImpact}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Timestamp & Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                      <span
                        className="text-[10px] text-[#8b949e] font-mono flex items-center gap-1"
                        title={new Date(action.timestamp).toLocaleString()}
                      >
                        <Clock size={10} />
                        {getRelativeTime(action.timestamp)}
                      </span>

                      {/* Re-run / Jump Button */}
                      {action.reExecutable && (
                        <button
                          onClick={(e) => handleReRun(action, e)}
                          className="px-2 py-1 rounded-md text-[10px] font-mono font-semibold bg-[#21262d] text-[#c9d1d9] hover:bg-[#38bdf8]/20 hover:text-[#38bdf8] hover:border-[#38bdf8]/50 border border-[#30363d] flex items-center gap-1 transition-all"
                          title="Re-execute or jump to this target subsystem"
                        >
                          <span>Re-run</span>
                          <ArrowRight size={10} />
                        </button>
                      )}

                      {/* Copy Trace */}
                      <button
                        onClick={(e) => handleCopyTrace(action, e)}
                        className="p-1 rounded text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
                        title="Copy diagnostic modification trace to clipboard"
                      >
                        {copiedId === action.id ? (
                          <Check size={12} className="text-[#34d399]" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Trace Details Drawer */}
                  {isTraceOpen && (
                    <div className="mt-2 pt-2 border-t border-[#30363d]/60 px-3 pb-2 text-[11px] font-mono space-y-2 bg-[#0d1117] rounded-lg border border-[#21262d]">
                      <div className="flex items-center justify-between text-[#8b949e] text-[10px]">
                        <span className="font-bold uppercase tracking-wider text-[#38bdf8]">
                          Modification Trace Inspector
                        </span>
                        <span>Execution Duration: {action.executionDurationMs || 10}ms</span>
                      </div>

                      {action.details?.affectedFile && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#8b949e]">Target Resource:</span>
                          <span className="text-white bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d]">
                            {action.details.affectedFile}{' '}
                            {action.details.affectedLines && `(${action.details.affectedLines})`}
                          </span>
                        </div>
                      )}

                      {action.details?.diffSummary && (
                        <div>
                          <span className="text-[#8b949e] block mb-1">Diff Summary:</span>
                          <pre className="p-2 rounded bg-[#07090e] border border-[#21262d] text-[10px] text-[#c9d1d9] font-mono overflow-x-auto whitespace-pre">
                            {action.details.diffSummary}
                          </pre>
                        </div>
                      )}

                      {action.details?.telemetryImpact && (
                        <div className="flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/30 p-2 rounded text-[#34d399] text-[10px]">
                          <Zap size={13} className="shrink-0 text-[#10b981]" />
                          <div>
                            <strong className="font-bold text-white">Engine Performance Delta:</strong>{' '}
                            {action.details.telemetryImpact}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px] text-[#8b949e]">
                        <span>Author Origin: <strong className="text-white">{action.author}</strong></span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleCopyTrace(action, e)}
                            className="text-[#38bdf8] hover:underline flex items-center gap-1"
                          >
                            <Copy size={10} /> Copy Trace Payload
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Collapsed Compact Preview Bar */}
      {!isExpanded && (
        <div
          onClick={() => setIsExpanded(true)}
          className="px-4 py-2 bg-[#0d1117] hover:bg-[#161b22] cursor-pointer flex items-center justify-between text-[11px] text-[#8b949e] transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="font-mono text-[#38bdf8] font-bold">Latest:</span>
            {actions[0] ? (
              <span className="text-[#c9d1d9] truncate font-sans">
                {actions[0].title} — <span className="text-[#8b949e]">{actions[0].description}</span>
              </span>
            ) : (
              <span>No recent actions recorded</span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
            {actions[0] && <span>{getRelativeTime(actions[0].timestamp)}</span>}
            <span className="text-[#38bdf8] font-semibold flex items-center gap-0.5">
              <span>View 10 Actions</span>
              <ChevronDown size={12} />
            </span>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="px-4 py-1.5 bg-[#07090e] border-t border-[#21262d] flex items-center justify-between text-[10px] text-[#8b949e] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span>Active Command Trace Daemon • 100% Client-Side In-Memory & Storage Persisted</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Click any action to inspect modification diff & metrics</span>
        </div>
      </div>
    </div>
  );
}
