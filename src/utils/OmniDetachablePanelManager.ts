/**
 * ============================================================================
 * MODULE: OmniDetachablePanelManager.ts
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * คลาส Singleton ศูนย์กลางสำหรับบริหารจัดการระบบหน้าต่างแยก (Detachable Panel Manager)
 * ทำหน้าที่:
 *   - ติดตามสถานะของโมดูลที่ถูกแยกออกไปสู่หน้าต่างเบราว์เซอร์ใหม่ (Multi-Monitor Floating Windows)
 *   - จัดเก็บ Reference ของ `Window` แต่ละบาน เพื่อให้สามารถสั่ง Focus, Minimize, หรือ Close ได้
 *   - ตรวจจับ Popup Blocker และสลับไปยังโหมด In-App Floating Panel ได้อย่างราบรื่น
 *   - รองรับระบบ Event Subscriber ให้ UI ส่วนต่างๆ (เช่น App.tsx, OmniEngineIDE, Header Buttons)
 *     อัปเดตสถานะแบบ Real-time เมื่อหน้าต่างถูกเปิด ปิด หรือดึงกลับ (Re-dock)
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Connected with: `DetachableWindowPortal.tsx`, `OmniEngineIDE.tsx`, `PopOutPanel.tsx`
 * - Exported as: `omniDetachablePanelManager` singleton instance
 * ============================================================================
 */

import { DetachedModuleMetadata, DetachablePanelConfig } from '../types/detachablePanelTypes';

type PanelChangeListener = (detachedList: DetachedModuleMetadata[]) => void;

class OmniDetachablePanelManager {
  private detachedModules: Map<string, DetachedModuleMetadata> = new Map();
  private listeners: Set<PanelChangeListener> = new Set();
  private popupBlockerDetected: boolean = false;

  constructor() {
    // Sync when main window unloads: close all detached children
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.closeAllDetachedWindows();
      });
    }
  }

  /**
   * สมัครรับการแจ้งเตือนการเปลี่ยนแปลงรายการหน้าต่างแยก
   */
  public subscribe(listener: PanelChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.getAllDetached());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const list = this.getAllDetached();
    this.listeners.forEach(fn => fn(list));
  }

  /**
   * ดึงรายการโมดูลที่ถูกแยกออกไปทั้งหมด
   */
  public getAllDetached(): DetachedModuleMetadata[] {
    return Array.from(this.detachedModules.values());
  }

  /**
   * ตรวจสอบว่าโมดูลนี้ถูกแยกออกไปอยู่บนหน้าต่างอื่นหรือไม่
   */
  public isDetached(moduleId: string): boolean {
    return this.detachedModules.has(moduleId);
  }

  /**
   * ดึงข้อมูล Metadata ของโมดูลที่ถูกแยก
   */
  public getDetachedMetadata(moduleId: string): DetachedModuleMetadata | undefined {
    return this.detachedModules.get(moduleId);
  }

  /**
   * บันทึกการเปิดหน้าต่างแยก
   */
  public registerDetached(
    config: DetachablePanelConfig, 
    windowRef: Window | null,
    displayMode: 'native_window' | 'in_app_floating' = 'native_window'
  ): DetachedModuleMetadata {
    const meta: DetachedModuleMetadata = {
      id: config.moduleId,
      title: config.title,
      detachedAt: Date.now(),
      windowRef,
      displayMode,
      status: 'active',
      geometry: {
        width: config.initialWidth || 1100,
        height: config.initialHeight || 780,
        left: config.left || 150,
        top: config.top || 120
      }
    };

    this.detachedModules.set(config.moduleId, meta);
    this.notify();
    return meta;
  }

  /**
   * ดึงโมดูลกลับมายังหน้าต่างหลัก (Re-attach / Dock to Main Window)
   */
  public reattachModule(moduleId: string): boolean {
    const meta = this.detachedModules.get(moduleId);
    if (!meta) return false;

    if (meta.windowRef && !meta.windowRef.closed) {
      meta.windowRef.close();
    }

    this.detachedModules.delete(moduleId);
    this.notify();
    return true;
  }

  /**
   * ดึงทุกโมดูลกลับมายังหน้าต่างหลักทั้งหมดพร้อมกัน
   */
  public reattachAll(): void {
    this.closeAllDetachedWindows();
    this.detachedModules.clear();
    this.notify();
  }

  /**
   * นำหน้าต่างของโมดูลนั้นขึ้นมาด้านหน้า (Focus Window)
   */
  public focusWindow(moduleId: string): boolean {
    const meta = this.detachedModules.get(moduleId);
    if (meta?.windowRef && !meta.windowRef.closed) {
      meta.windowRef.focus();
      return true;
    }
    return false;
  }

  /**
   * อัปเดตเมื่อหน้าต่างแยกถูกปิดจากฝั่งเบราว์เซอร์ภายนอก (User clicked window 'X')
   */
  public handleExternalWindowClosed(moduleId: string): void {
    if (this.detachedModules.has(moduleId)) {
      this.detachedModules.delete(moduleId);
      this.notify();
    }
  }

  /**
   * ปิดหน้าต่างภายนอกทั้งหมด
   */
  public closeAllDetachedWindows(): void {
    this.detachedModules.forEach((meta) => {
      try {
        if (meta.windowRef && !meta.windowRef.closed) {
          meta.windowRef.close();
        }
      } catch (err) {
        console.warn('Error closing external window:', err);
      }
    });
  }

  /**
   * ตั้งค่าสถานะการตรวจพบ Popup Blocker
   */
  public setPopupBlockerDetected(detected: boolean) {
    this.popupBlockerDetected = detected;
  }

  public isPopupBlockerDetected(): boolean {
    return this.popupBlockerDetected;
  }
}

export const omniDetachablePanelManager = new OmniDetachablePanelManager();
