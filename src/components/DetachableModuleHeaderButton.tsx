/**
 * ============================================================================
 * MODULE: DetachableModuleHeaderButton.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * ปุ่มกดมาตรฐานสำหรับแทรกใน Header, Toolbar หรือ Workspace Bar เพื่อสั่ง
 * แยกโมดูลออกไปยังหน้าต่างเบราว์เซอร์ลอยตัวใหม่ (Detach to Floating Window)
 * หรือดึงกลับเข้าจอหลัก (Re-attach / Dock to Main Window) ด้วยคลิกเดียว
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Connected with: `OmniDetachablePanelManager.ts`, `OmniEngineIDE.tsx`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowDownLeft, Monitor, Layers } from 'lucide-react';
import { omniDetachablePanelManager } from '../utils/OmniDetachablePanelManager';

interface DetachableModuleHeaderButtonProps {
  moduleId: string;
  moduleTitle: string;
  onToggleDetach: () => void;
  className?: string;
  compact?: boolean;
}

export const DetachableModuleHeaderButton: React.FC<DetachableModuleHeaderButtonProps> = ({
  moduleId,
  moduleTitle,
  onToggleDetach,
  className = '',
  compact = false
}) => {
  const [isDetached, setIsDetached] = useState<boolean>(
    omniDetachablePanelManager.isDetached(moduleId)
  );

  useEffect(() => {
    return omniDetachablePanelManager.subscribe(() => {
      setIsDetached(omniDetachablePanelManager.isDetached(moduleId));
    });
  }, [moduleId]);

  if (isDetached) {
    return (
      <button
        type="button"
        onClick={onToggleDetach}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-all font-semibold shadow-sm ${className}`}
        title={`ดึง ${moduleTitle} กลับเข้ามาแสดงผลในหน้าจอหลัก`}
      >
        <ArrowDownLeft size={13} className="text-amber-400" />
        {!compact && <span>นำกลับเข้าจอหลัก</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggleDetach}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-[#21262d] hover:bg-[#30363d] text-gray-300 hover:text-white border border-[#30363d] transition-colors shadow-sm ${className}`}
      title={`แยก ${moduleTitle} ออกไปแสดงผลบนหน้าต่างลอยตัวใหม่สำหรับ Multi-Monitor Setup`}
    >
      <ExternalLink size={13} className="text-[#58a6ff]" />
      {!compact && <span>แยกหน้าต่าง (Multi-Monitor)</span>}
    </button>
  );
};

export default DetachableModuleHeaderButton;
