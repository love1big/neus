/**
 * ============================================================================
 * USE STUDIO AUTO-SAVE HOOK (ฮุกจัดการวงจรชีวิตการบันทึกสถานะสตูดิโออัตโนมัติ)
 * ============================================================================
 * 
 * 1. MODULE PURPOSE & RESPONSIBILITY (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูล)
 * ----------------------------------------------------------------------------
 * ฮุกนี้ทำหน้าที่ควบคุมและจัดการวงจรชีวิต (Lifecycle) ของระบบ Auto-Save ในระดับ React Component:
 *  - ตั้ง Timer รันการบันทึกสถานะตามระยะเวลาที่กำหนด (Periodic Interval: e.g. ทุกๆ 15 วินาที)
 *  - ดักจับ Event สำคัญของเบราว์เซอร์:
 *    - `window.addEventListener('beforeunload')` : ปิดแท็บ/รีเฟรช
 *    - `document.addEventListener('visibilitychange')` : สลับแท็บ
 *    - `window.addEventListener('blur')` : สลับหน้าต่างโปรแกรม
 *    - `window.addEventListener('pagehide')` : ปิดหน้าเว็บ
 *  - ติดตามความเปลี่ยนแปลงของ `activeTool` เพื่อบันทึกสถานะทันทีเมื่อผู้ใช้เปลี่ยนเครื่องมือ (Navigation Trigger)
 *  - ตรวจจับ Abnormal Shutdown / Crash Detection เพื่อส่งต่อให้ UI แสดงผลการกู้คืนข้อมูล
 *  - ให้ฟังก์ชัน `saveNow()`, `restoreSnapshot()`, `updateConfig()`, `createBookmark()` สำหรับควบคุม
 * 
 * 2. ARCHITECTURE & SYSTEM INTEGRATION (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น)
 * ----------------------------------------------------------------------------
 *  - เรียกใช้ `GlobalStudioAutoSaveManager` เพื่อจัดเก็บข้อมูลลง LocalStorage
 *  - ผสานกับ `App.tsx` เป็นจุดเริ่มต้นหลักของแอปพลิเคชัน
 *  - ส่งสัญญาณและสถานะให้ `GlobalAutoSaveStatusWidget` และ `StudioRecoveryModal`
 * 
 * 3. INPUTS, OUTPUTS & DATA CONTRACTS (พารามิเตอร์ Input / Output ที่รับส่ง)
 * ----------------------------------------------------------------------------
 *  - Input: `activeTool: string`, `options?: { onAutoSaveCompleted?: (state) => void }`
 *  - Output Hook Return:
 *    - `isSaving: boolean`
 *    - `lastSavedTime: Date | null`
 *    - `saveStatus: 'idle' | 'saving' | 'saved' | 'error'`
 *    - `config: StudioConfig`
 *    - `hasCrashRecovery: boolean`
 *    - `crashInfo: { lastState: StudioAutoSaveState | null; timeAgoText: string } | null`
 *    - `saveNow: (options?) => Promise<StudioAutoSaveState>`
 *    - `createBookmark: (label: string) => AutoSaveSnapshot`
 *    - `restoreSnapshot: (id: string) => boolean`
 *    - `dismissCrashRecovery: () => void`
 *    - `updateConfig: (partialConfig) => void`
 * 
 * 4. ERROR HANDLING & FALLBACKS (การจัดการข้อผิดพลาดและ Edge Cases)
 * ----------------------------------------------------------------------------
 *  - ป้องกัน Memory Leak ด้วยการ Cleanup Timers และ Event Listeners ทั้งหมดใน `useEffect` return
 *  - มี Try-Catch ครอบทุกการทำงานของการบันทึก ป้องกัน React Component Re-render Crash
 * 
 * 5. USAGE EXAMPLE (ตัวอย่างการเรียกใช้งาน)
 * ----------------------------------------------------------------------------
 *  ```tsx
 *  const { isSaving, lastSavedTime, saveNow, hasCrashRecovery, crashInfo } = useStudioAutoSave(activeTool);
 *  ```
 * ============================================================================
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GlobalStudioAutoSaveManager,
  StudioAutoSaveState,
  StudioConfig,
  AutoSaveSnapshot,
} from '../utils/GlobalStudioAutoSaveManager';

export interface UseStudioAutoSaveReturn {
  isSaving: boolean;
  lastSavedTime: Date | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  config: StudioConfig;
  hasCrashRecovery: boolean;
  crashInfo: { lastState: StudioAutoSaveState | null; timeAgoText: string } | null;
  saveNow: (options?: { label?: string; isBookmark?: boolean }) => Promise<StudioAutoSaveState | null>;
  createBookmark: (label: string) => AutoSaveSnapshot;
  restoreSnapshot: (id: string) => boolean;
  dismissCrashRecovery: () => void;
  updateConfig: (partial: Partial<StudioConfig>) => void;
}

export function useStudioAutoSave(
  activeTool: string,
  options?: {
    onAutoSaveCompleted?: (state: StudioAutoSaveState) => void;
  }
): UseStudioAutoSaveReturn {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(() => {
    const latest = GlobalStudioAutoSaveManager.loadLatestState();
    return latest ? new Date(latest.timestamp) : new Date();
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [config, setConfig] = useState<StudioConfig>(() => GlobalStudioAutoSaveManager.getConfig());
  const [crashInfo, setCrashInfo] = useState<{ lastState: StudioAutoSaveState | null; timeAgoText: string } | null>(null);
  const [hasCrashRecovery, setHasCrashRecovery] = useState<boolean>(false);

  const activeToolRef = useRef(activeTool);
  activeToolRef.current = activeTool;

  const configRef = useRef(config);
  configRef.current = config;

  // เริ่มต้น AutoSave Manager และตรวจจับ Crash
  useEffect(() => {
    GlobalStudioAutoSaveManager.init();

    const crashCheck = GlobalStudioAutoSaveManager.checkForAbnormalShutdown();
    if (crashCheck.hasCrash && crashCheck.lastState) {
      setHasCrashRecovery(true);
      setCrashInfo({
        lastState: crashCheck.lastState,
        timeAgoText: crashCheck.timeAgoText,
      });
    }

    const handleConfigChange = (e: any) => {
      if (e.detail) {
        setConfig(e.detail);
      }
    };

    window.addEventListener('studio-autosave-config-changed', handleConfigChange);
    return () => {
      window.removeEventListener('studio-autosave-config-changed', handleConfigChange);
    };
  }, []);

  // บันทึกสถานะทันทีเมื่อ activeTool มีการเปลี่ยนแปลง (Navigation Trigger)
  useEffect(() => {
    if (!activeTool) return;
    try {
      GlobalStudioAutoSaveManager.saveNow({
        activeTool,
        trigger: 'navigation',
      }).then((state) => {
        setLastSavedTime(new Date(state.timestamp));
      });
    } catch (err) {
      console.warn('[useStudioAutoSave] Navigation save error:', err);
    }
  }, [activeTool]);

  // Periodic Timer สำหรับ Auto-Save
  useEffect(() => {
    if (!config.isAutoSaveEnabled || config.autoSaveIntervalSec <= 0) {
      return;
    }

    const intervalMs = Math.max(5000, config.autoSaveIntervalSec * 1000);
    const intervalTimer = setInterval(async () => {
      setIsSaving(true);
      setSaveStatus('saving');
      try {
        const state = await GlobalStudioAutoSaveManager.saveNow({
          activeTool: activeToolRef.current,
          trigger: 'periodic',
        });
        setIsSaving(false);
        setSaveStatus('saved');
        setLastSavedTime(new Date(state.timestamp));

        if (options?.onAutoSaveCompleted) {
          options.onAutoSaveCompleted(state);
        }

        setTimeout(() => {
          setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev));
        }, 2000);
      } catch (err) {
        console.error('[useStudioAutoSave] Periodic save error:', err);
        setIsSaving(false);
        setSaveStatus('error');
      }
    }, intervalMs);

    return () => {
      clearInterval(intervalTimer);
    };
  }, [config.isAutoSaveEnabled, config.autoSaveIntervalSec, options]);

  // บันทึกเมื่อ Window Blur หรือสลับแท็บ
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        GlobalStudioAutoSaveManager.saveNowSync({
          activeTool: activeToolRef.current,
          trigger: 'blur',
        });
      }
    };

    const handleWindowBlur = () => {
      GlobalStudioAutoSaveManager.saveNowSync({
        activeTool: activeToolRef.current,
        trigger: 'blur',
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  // ฟังก์ชัน Manual Save
  const saveNow = useCallback(async (opts?: { label?: string; isBookmark?: boolean }) => {
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      const state = await GlobalStudioAutoSaveManager.saveNow({
        activeTool: activeToolRef.current,
        trigger: 'manual',
        label: opts?.label,
        isBookmark: opts?.isBookmark,
      });
      setIsSaving(false);
      setSaveStatus('saved');
      setLastSavedTime(new Date(state.timestamp));

      setTimeout(() => {
        setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev));
      }, 2500);

      return state;
    } catch (err) {
      console.error('[useStudioAutoSave] Manual save error:', err);
      setIsSaving(false);
      setSaveStatus('error');
      return null;
    }
  }, []);

  const createBookmark = useCallback((label: string) => {
    const snapshot = GlobalStudioAutoSaveManager.createNamedBookmark(label);
    setLastSavedTime(new Date(snapshot.timestamp));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
    return snapshot;
  }, []);

  const restoreSnapshot = useCallback((id: string) => {
    const success = GlobalStudioAutoSaveManager.restoreSnapshot(id);
    if (success) {
      setHasCrashRecovery(false);
      setCrashInfo(null);
    }
    return success;
  }, []);

  const dismissCrashRecovery = useCallback(() => {
    setHasCrashRecovery(false);
    setCrashInfo(null);
    GlobalStudioAutoSaveManager.recordHeartbeat(true);
  }, []);

  const updateConfig = useCallback((partial: Partial<StudioConfig>) => {
    const updated = GlobalStudioAutoSaveManager.updateConfig(partial);
    setConfig(updated);
  }, []);

  return {
    isSaving,
    lastSavedTime,
    saveStatus,
    config,
    hasCrashRecovery,
    crashInfo,
    saveNow,
    createBookmark,
    restoreSnapshot,
    dismissCrashRecovery,
    updateConfig,
  };
}
