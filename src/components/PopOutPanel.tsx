/**
 * ============================================================================
 * MODULE: PopOutPanel.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * คอมโพเนนต์ PopOutPanel เวอร์ชันอัปเกรดความเข้ากันได้แบบ Backward-Compatible
 * เชื่อมต่อไปยัง `DetachableWindowPortal.tsx` เพื่อให้คอมโพเนนต์เดิม เช่น Viewport3D
 * และ CodeEditor ได้รับอานิสงส์จากระบบ Deep Style Mirroring, ไฟสถานะ Multi-Monitor
 * และระบบตรวจจับ Pop-up Blocker อัตโนมัติทันที
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Wraps: `DetachableWindowPortal.tsx`
 * - Backward compatible with existing props: `children`, `title`, `onClose`
 * ============================================================================
 */

import React from 'react';
import { DetachableWindowPortal } from './DetachableWindowPortal';

export interface PopOutPanelProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  initialWidth?: number;
  initialHeight?: number;
}

export default function PopOutPanel({ 
  children, 
  title, 
  onClose,
  initialWidth = 1100,
  initialHeight = 780
}: PopOutPanelProps) {
  const safeModuleId = `popout_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  return (
    <DetachableWindowPortal
      moduleId={safeModuleId}
      title={title}
      onClose={onClose}
      initialWidth={initialWidth}
      initialHeight={initialHeight}
    >
      {children}
    </DetachableWindowPortal>
  );
}
