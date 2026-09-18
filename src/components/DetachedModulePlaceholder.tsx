/**
 * ============================================================================
 * MODULE: DetachedModulePlaceholder.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * หน้าจอแสดงผลแทนที่ (Placeholder Screen) ภายในหน้าจอหลัก เมื่อโมดูลใดๆ ถูกผู้ใช้
 * สั่งแยก (Detach) ออกไปทำงานบนหน้าต่างภายนอกสำหรับ Multi-Monitor Setup
 * มีคุณสมบัติ:
 *   - แจ้งสถานะอย่างชัดเจนว่าโมดูลกำลังทำงานอยู่ที่จอไหน
 *   - ปุ่ม "นำกลับเข้าจอหลัก (Re-attach / Dock to Main Screen)" ให้ดึงกลับมาได้ทันที
 *   - ปุ่ม "ดึงหน้าต่างขึ้นมาด้านหน้า (Focus Detached Window)" เพื่อค้นหาหน้าต่างที่ซ่อนอยู่
 *   - แสดงข้อมูล Telemetry: โหมดการทำงาน, เวลาที่แยกออกไป, และสถานะการเชื่อมต่อผ่าน React Portal
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Connected with: `OmniDetachablePanelManager.ts`, `OmniEngineIDE.tsx`
 * ============================================================================
 */

import React from 'react';
import { 
  Monitor, 
  ArrowDownLeft, 
  ExternalLink, 
  Eye, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Sparkles,
  Move
} from 'lucide-react';
import { omniDetachablePanelManager } from '../utils/OmniDetachablePanelManager';
import { LOCKED_OMNI_ENGINE_NAME } from '../utils/OmniDigitalForensicWatermarkEngine';

interface DetachedModulePlaceholderProps {
  moduleId: string;
  title: string;
  onReattach: () => void;
}

export const DetachedModulePlaceholder: React.FC<DetachedModulePlaceholderProps> = ({
  moduleId,
  title,
  onReattach
}) => {
  const meta = omniDetachablePanelManager.getDetachedMetadata(moduleId);

  const handleFocusWindow = () => {
    omniDetachablePanelManager.focusWindow(moduleId);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d1117] text-gray-200 p-8 select-none">
      <div className="max-w-xl w-full p-8 rounded-2xl bg-[#161b22] border-2 border-[#30363d] shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dual Monitor Visual Graphic */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
            <Monitor size={38} className="animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 border-2 border-[#161b22] flex items-center justify-center text-black shadow-lg">
            <ExternalLink size={15} />
          </div>
        </div>

        {/* Title & Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
              MULTI-MONITOR DETACHED MODE
            </span>
            <span className="flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE PORTAL ACTIVE
            </span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-wide">
            {title}
          </h2>

          <p className="text-xs text-gray-400 max-w-md leading-relaxed">
            โมดูลนี้ถูกแยกออกไปแสดงผลบนหน้าต่างภายนอก (Floating Browser Window) เรียบร้อยแล้ว
            คุณสามารถลากหน้าต่างนั้นไปยังจอภาพที่ 2 หรือ 3 เพื่อเพิ่มพื้นที่ทำงานได้อย่างอิสระ
          </p>
        </div>

        {/* Connection Details Box */}
        <div className="w-full p-4 rounded-xl bg-[#0d1117] border border-[#21262d] text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center gap-1.5">
              <Cpu size={13} className="text-amber-400" />
              โปรแกรมควบคุม:
            </span>
            <span className="text-white font-mono font-semibold">{LOCKED_OMNI_ENGINE_NAME}</span>
          </div>

          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center gap-1.5">
              <Layers size={13} className="text-blue-400" />
              รูปแบบการแยกหน้าจอ:
            </span>
            <span className="text-blue-300 font-mono">
              {meta?.displayMode === 'native_window' ? 'Native Floating Window (Multi-Monitor)' : 'In-App Floating Window'}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              สถานะข้อมูล:
            </span>
            <span className="text-emerald-300 font-mono">Shared React State & Zero Lag</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 w-full pt-1">
          <button
            type="button"
            onClick={handleFocusWindow}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-gray-200 hover:text-white border border-[#30363d] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Eye size={14} className="text-blue-400" />
            ดึงหน้าต่างขึ้นมาด้านหน้า (Focus)
          </button>

          <button
            type="button"
            onClick={onReattach}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          >
            <ArrowDownLeft size={14} />
            นำกลับเข้าจอหลัก (Re-attach)
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetachedModulePlaceholder;
