/**
 * ============================================================================
 * MODULE: DetachableWindowPortal.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * คอมโพเนนต์หลักที่สร้าง React Portal เพื่อเรนเดอร์โมดูลสตูดิโอ (Any Studio Module)
 * ออกไปทำงานบนหน้าต่างเบราว์เซอร์ลอยตัวใหม่ (Floating Browser Window) สำหรับระบบหลายจอ (Multi-Monitor)
 * จุดเด่นด้านวิศวกรรม:
 *   - ใช้ React Portal (`createPortal`) ทำให้ State, Event Handlers และ Context ยังเชื่อมต่อกับแอปหลัก
 *   - ระบบ Deep Stylesheet Synchronization: คัดลอกและซิงก์ CSS ทั้งหมด (Tailwind v4, Google Fonts, Style Tags)
 *     พร้อม MutationObserver คอยดักจับสไตล์ใหม่ที่อาจถูกฉีดเข้ามาขณะทำงาน
 *   - แถบควบคุมบนหัวหน้าต่างแยก (Detached Titlebar): มีปุ่ม "นำกลับเข้าจอหลัก (Dock back to Main Window)"
 *     และไฟสถานะ Multi-Monitor Sync
 *   - ระบบ Fallback ป้องกัน Pop-up Blocker: หากเบราว์เซอร์หรือ iFrame ไม่อนุญาตให้เปิด window.open
 *     ระบบจะสลับเป็น In-App Floating Panel อัตโนมัติทันที เพื่อให้ทำงานต่อได้ 100%
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Connected with: `OmniDetachablePanelManager.ts`, `OmniEngineIDE.tsx`, `App.tsx`
 * - Uses: `ReactDOM.createPortal`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  ExternalLink, 
  ArrowDownLeft, 
  Maximize2, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Cpu,
  Monitor,
  AlertTriangle,
  X
} from 'lucide-react';
import { omniDetachablePanelManager } from '../utils/OmniDetachablePanelManager';
import { LOCKED_OMNI_ENGINE_NAME } from '../utils/OmniDigitalForensicWatermarkEngine';

export interface DetachableWindowPortalProps {
  children: React.ReactNode;
  moduleId: string;
  title: string;
  onClose: () => void;
  initialWidth?: number;
  initialHeight?: number;
}

export const DetachableWindowPortal: React.FC<DetachableWindowPortalProps> = ({
  children,
  moduleId,
  title,
  onClose,
  initialWidth = 1200,
  initialHeight = 820
}) => {
  const [externalWindow, setExternalWindow] = useState<Window | null>(null);
  const [isPopupBlocked, setIsPopupBlocked] = useState<boolean>(false);
  const [containerMounted, setContainerMounted] = useState<boolean>(false);
  
  const containerEl = useRef<HTMLDivElement | null>(null);
  const fallbackContainerRef = useRef<HTMLDivElement | null>(null);

  // In-App Floating Fallback State (when window.open is blocked by iframe or browser)
  const [floatingPos, setFloatingPos] = useState({ x: 80, y: 60 });
  const [floatingSize, setFloatingSize] = useState({ width: 980, height: 680 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  useEffect(() => {
    // Calculate initial coordinates (centered or offset)
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;

    const left = dualScreenLeft + (screenWidth - initialWidth) / 2;
    const top = dualScreenTop + (screenHeight - initialHeight) / 2;

    const windowFeatures = `width=${initialWidth},height=${initialHeight},left=${Math.max(20, left)},top=${Math.max(20, top)},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`;

    let win: Window | null = null;
    try {
      win = window.open('', `omni_detached_${moduleId}_${Date.now()}`, windowFeatures);
    } catch (err) {
      console.warn('DetachableWindowPortal: window.open threw error (likely sandboxed iframe):', err);
      win = null;
    }

    if (!win || win.closed || typeof win.closed === 'undefined') {
      // Pop-up blocker triggered or restricted by sandbox
      setIsPopupBlocked(true);
      omniDetachablePanelManager.setPopupBlockerDetected(true);
      omniDetachablePanelManager.registerDetached({ moduleId, title }, null, 'in_app_floating');
      return;
    }

    // Window opened successfully!
    win.document.title = `${title} — ${LOCKED_OMNI_ENGINE_NAME} (Detached Monitor)`;

    // Apply dark theme and typography to the popup document
    win.document.documentElement.style.backgroundColor = '#0a0a0f';
    win.document.documentElement.style.color = '#e6edf3';
    win.document.documentElement.style.height = '100%';
    win.document.documentElement.style.width = '100%';
    win.document.body.style.margin = '0';
    win.document.body.style.padding = '0';
    win.document.body.style.backgroundColor = '#0a0a0f';
    win.document.body.style.color = '#e6edf3';
    win.document.body.style.height = '100%';
    win.document.body.style.width = '100%';
    win.document.body.style.overflow = 'hidden';
    win.document.body.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    // Deep Stylesheet Copy
    const copyStyles = () => {
      if (!win) return;
      
      // Clear previous injected styles
      const existingInjected = win.document.head.querySelectorAll('[data-omni-injected]');
      existingInjected.forEach(node => node.remove());

      // 1. Copy all style and link tags from main document head
      document.querySelectorAll('style, link[rel="stylesheet"]').forEach(styleNode => {
        try {
          const clone = styleNode.cloneNode(true) as HTMLElement;
          clone.setAttribute('data-omni-injected', 'true');
          win?.document.head.appendChild(clone);
        } catch (err) {
          console.warn('Could not clone style node:', err);
        }
      });

      // 2. Inject explicit custom scrollbars and base container styles
      const baseStyleTag = win.document.createElement('style');
      baseStyleTag.setAttribute('data-omni-injected', 'true');
      baseStyleTag.textContent = `
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #58a6ff; }
        html, body, #omni-detached-root { width: 100%; height: 100%; overflow: hidden; }
      `;
      win.document.head.appendChild(baseStyleTag);
    };

    copyStyles();

    // Observe document head for dynamically added styles/fonts
    const observer = new MutationObserver(() => {
      copyStyles();
    });
    observer.observe(document.head, { childList: true, subtree: true });

    // Create container inside the external window
    const container = win.document.createElement('div');
    container.id = 'omni-detached-root';
    container.style.height = '100%';
    container.style.width = '100%';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    win.document.body.appendChild(container);
    containerEl.current = container;

    // Register to manager
    omniDetachablePanelManager.registerDetached(
      { moduleId, title, initialWidth, initialHeight }, 
      win, 
      'native_window'
    );

    const handleBeforeUnload = () => {
      observer.disconnect();
      omniDetachablePanelManager.handleExternalWindowClosed(moduleId);
      onClose();
    };

    win.addEventListener('beforeunload', handleBeforeUnload);
    setExternalWindow(win);
    setContainerMounted(true);

    return () => {
      observer.disconnect();
      if (win && !win.closed) {
        win.removeEventListener('beforeunload', handleBeforeUnload);
        win.close();
      }
      omniDetachablePanelManager.handleExternalWindowClosed(moduleId);
    };
  }, [moduleId, title, initialWidth, initialHeight, onClose]);

  // Handle Dragging for In-App Floating Fallback
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: floatingPos.x,
      startY: floatingPos.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setFloatingPos({
      x: Math.max(10, dragStartRef.current.startX + dx),
      y: Math.max(10, dragStartRef.current.startY + dy),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe
    }
  };

  // Case 1: Pop-up was blocked or sandboxed - Render In-App Floating Panel Fallback
  if (isPopupBlocked) {
    return (
      <div
        ref={fallbackContainerRef}
        style={{
          left: `${floatingPos.x}px`,
          top: `${floatingPos.y}px`,
          width: `${floatingSize.width}px`,
          height: `${floatingSize.height}px`,
        }}
        className="fixed z-[9999] bg-[#0d1117] border-2 border-amber-500/50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden resize animate-fadeIn"
      >
        {/* Floating Topbar */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="h-10 bg-[#161b22] border-b border-[#30363d] px-4 flex items-center justify-between cursor-move select-none shrink-0"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers size={14} className="text-amber-400" />
              {title}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
              In-App Floating Mode
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-colors font-semibold"
              title="ดึงโมดูลกลับเข้าสู่พื้นที่ทำงานหลัก"
            >
              <ArrowDownLeft size={12} />
              นำกลับเข้าจอหลัก
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#30363d] transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Browser Sandbox Advisory Alert */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-300 shrink-0">
          <span className="flex items-center gap-1.5">
            <AlertTriangle size={13} className="shrink-0" />
            เบราว์เซอร์หรือสภาพแวดล้อม iFrame ป้องกันการเปิดหน้าต่างภายนอกอัตโนมัติ ระบบจึงสลับมาใช้โหมด In-App Floating ให้คุณใช้งานอย่างลื่นไหล
          </span>
          <button
            onClick={() => {
              window.open(window.location.href, '_blank');
            }}
            className="underline hover:text-white shrink-0 ml-2"
          >
            เปิดโปรแกรมในแท็บเต็มเพื่อใช้ Multi-Monitor จริง ›
          </button>
        </div>

        {/* Studio Content */}
        <div className="flex-1 w-full h-full overflow-auto bg-[#0a0a0f]">
          {children}
        </div>
      </div>
    );
  }

  // Case 2: External window is open! Render into external window via React Portal
  if (!externalWindow || !containerMounted || !containerEl.current) {
    return null;
  }

  const portalContent = (
    <div className="w-full h-full flex flex-col bg-[#0a0a0f] text-gray-200 overflow-hidden select-none">
      {/* Detached Window Navigation & Sync Header */}
      <header className="h-10 bg-[#161b22] border-b border-[#30363d] px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Cpu size={14} />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">
              {LOCKED_OMNI_ENGINE_NAME}
            </span>
          </div>

          <span className="text-gray-600">|</span>

          <span className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
            <Monitor size={14} className="text-[#58a6ff]" />
            {title}
          </span>

          <span className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            MULTI-MONITOR SYNC: ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              externalWindow.close();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition-all shadow-sm"
            title="ดึงโมดูลนี้กลับเข้าสู่หน้าต่างหลักของโปรแกรม"
          >
            <ArrowDownLeft size={13} />
            นำกลับเข้าจอหลัก (Dock to Main)
          </button>
        </div>
      </header>

      {/* Actual Studio Module Component Rendered inside External Window */}
      <main className="flex-1 w-full h-full overflow-auto bg-[#0a0a0f]">
        {children}
      </main>
    </div>
  );

  return createPortal(portalContent, containerEl.current);
};

export default DetachableWindowPortal;
