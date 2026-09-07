/**
 * ============================================================================
 * GLOBAL STUDIO AUTO-SAVE MANAGER (ระบบบันทึกสถานะอัตโนมัติของสตูดิโอแบบครอบคลุม)
 * ============================================================================
 * 
 * 1. MODULE PURPOSE & RESPONSIBILITY (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูล)
 * ----------------------------------------------------------------------------
 * ไฟล์นี้ทำหน้าที่เป็นศูนย์กลางการจัดเก็บและกู้คืนสถานะทั้งหมดของ Omni Engine Studio
 * (Studio State & Workspace Configuration) ลงใน Local Storage / Indexed Storage โดยอัตโนมัติ
 * เพื่อป้องกันข้อมูลสูญหาย (Zero Data Loss) จากการปิดแท็บโดยไม่ได้ตั้งใจ, การเปลี่ยนหน้า,
 * บราวเซอร์แคชหลุด หรือโปรแกรม Crash
 * 
 * หน้าที่หลัก:
 *  - ติดตาม Active Tool, Active SubTool, Breadcrumb และ Engine Workspace Mode
 *  - จัดเก็บการตั้งค่าระบบ (Global Studio Configurations, UI Layout, Side tools order)
 *  - รับข้อมูล Snapshot ของโมดูลต่างๆ (Code Editor Buffers, 3D Viewport, Map, Audio DAW, etc.)
 *  - จัดการ Rolling Checkpoints (ประวัติการเซฟย้อนหลัง 10 จุด) พร้อมฟังก์ชัน Rollback
 *  - ตรวจจับ Abnormal Shutdown / Crash Detection เพื่อแจ้งเตือนกู้คืนข้อมูล
 *  - รองรับการ Export / Import ข้อมูลสถานะสตูดิโอเป็นไฟล์ JSON
 *  - จัดการ Storage Quota ป้องกัน QuotaExceededError ด้วยการทำ Auto-Pruning
 * 
 * 2. ARCHITECTURE & SYSTEM INTEGRATION (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น)
 * ----------------------------------------------------------------------------
 *  - ผสานรวมกับ `App.tsx` ผ่าน `useStudioAutoSave` Hook
 *  - เชื่อมต่อกับ `OmniEngineIDE.tsx` ผ่าน Header Widget และ Menu Bar
 *  - เชื่อมต่อกับทุกโมดูลย่อยผ่าน Custom Event `studio-contribute-state` และ `GlobalStudioAutoSaveManager.registerModuleState`
 *  - ส่งสัญญาณแจ้งเตือนผ่าน Custom Event `studio-autosave-completed`, `studio-crash-detected`
 * 
 * 3. INPUTS, OUTPUTS & DATA CONTRACTS (พารามิเตอร์ Input / Output ที่รับส่ง)
 * ----------------------------------------------------------------------------
 *  - Input: `StudioAutoSaveState`, `StudioConfig`, `ModuleStateContribution`
 *  - Output: `AutoSaveSnapshot`, `StorageUsageMetrics`, `RecoveryCheckResult`
 * 
 * 4. ERROR HANDLING & FALLBACKS (การจัดการข้อผิดพลาดและ Edge Cases)
 * ----------------------------------------------------------------------------
 *  - หาก JSON ใน LocalStorage เสียหาย: ทำการ Fallback ไปยัง Default State และบันทึก Log ป้องกันหน้าจอขาว
 *  - หาก LocalStorage เต็ม (QuotaExceededError): ลบประวัติเก่าทิ้งอัตโนมัติ (LRU Pruning) และเซฟเฉพาะ Essential State
 *  - ป้องกัน Re-entrant Loop และ Debounce การบันทึกถี่เกินไป
 * 
 * 5. USAGE EXAMPLE (ตัวอย่างการเรียกใช้งาน)
 * ----------------------------------------------------------------------------
 *  ```ts
 *  import { GlobalStudioAutoSaveManager } from '../utils/GlobalStudioAutoSaveManager';
 * 
 *  // บันทึกสถานะทันที
 *  GlobalStudioAutoSaveManager.saveNow({ activeTool: 'CodeEditor', trigger: 'navigation' });
 * 
 *  // กู้คืนสถานะล่าสุด
 *  const state = GlobalStudioAutoSaveManager.loadLatestState();
 *  ```
 * ============================================================================
 */

export interface StudioConfig {
  theme: 'dark' | 'light' | 'high-contrast';
  language: 'th' | 'en';
  autoSaveIntervalSec: number; // 5, 10, 15, 30, 60, 300
  isAutoSaveEnabled: boolean;
  soundFeedback: boolean;
  notificationFeedback: boolean;
  maxRollingSnapshots: number;
  engineMode: '2D' | '3D' | 'RPG' | 'UI/UX' | 'MULTIPLAYER';
  resourceMonitorVisible: boolean;
  sideToolsOrder: string[];
  editorFontSize: number;
  editorWordWrap: boolean;
  showMinimap: boolean;
}

export interface SessionMetadata {
  sessionId: string;
  tabId: string;
  startedAt: number;
  lastHeartbeat: number;
  isCleanExit: boolean;
  crashRecovered: boolean;
  totalSaveCount: number;
  totalDataSizeBytes: number;
  lastTrigger: 'periodic' | 'navigation' | 'blur' | 'beforeunload' | 'manual' | 'critical_action' | 'init';
}

export interface StudioAutoSaveState {
  version: string;
  timestamp: number;
  lastSavedIso: string;
  activeTool: string;
  activeSubTool?: string;
  studioConfig: StudioConfig;
  moduleStates: Record<string, any>;
  sessionMetadata: SessionMetadata;
}

export interface AutoSaveSnapshot {
  id: string;
  timestamp: number;
  formattedTime: string;
  activeTool: string;
  trigger: string;
  label?: string;
  isBookmark?: boolean;
  state: StudioAutoSaveState;
  sizeBytes: number;
}

export interface StorageUsageMetrics {
  usedBytes: number;
  usedFormatted: string;
  snapshotCount: number;
  quotaEstimateBytes: number;
  percentUsed: number;
}

const STORAGE_KEY_CURRENT = 'omni_studio_current_state_v1';
const STORAGE_KEY_HISTORY = 'omni_studio_snapshots_history_v1';
const STORAGE_KEY_CONFIG = 'omni_studio_global_config_v1';
const STORAGE_KEY_HEARTBEAT = 'omni_studio_session_heartbeat_v1';
const CURRENT_SCHEMA_VERSION = '1.2.0';

export const DEFAULT_STUDIO_CONFIG: StudioConfig = {
  theme: 'dark',
  language: 'th',
  autoSaveIntervalSec: 15,
  isAutoSaveEnabled: true,
  soundFeedback: false,
  notificationFeedback: true,
  maxRollingSnapshots: 8,
  engineMode: '3D',
  resourceMonitorVisible: false,
  sideToolsOrder: [],
  editorFontSize: 14,
  editorWordWrap: true,
  showMinimap: false,
};

export class GlobalStudioAutoSaveManager {
  private static sessionId: string = 'session_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
  private static tabId: string = 'tab_' + Math.random().toString(36).substring(2, 7);
  private static registeredModuleStates: Record<string, any> = {};
  private static saveDebounceTimer: any = null;
  private static heartbeatIntervalTimer: any = null;
  private static isInitialized = false;

  /**
   * เริ่มต้นระบบ Heartbeat และ Crash Detection
   */
  public static init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // เริ่มต้น Heartbeat เพื่อตรวจจับ Crash
    this.recordHeartbeat(false);
    this.heartbeatIntervalTimer = setInterval(() => {
      this.recordHeartbeat(false);
    }, 5000);

    // Event listener สำหรับรับข้อมูล snapshot จากโมดูลต่างๆ
    window.addEventListener('studio-contribute-state', (event: any) => {
      if (event.detail && event.detail.moduleId && event.detail.state !== undefined) {
        this.registerModuleState(event.detail.moduleId, event.detail.state);
      }
    });

    // Event listener ก่อนปิดแท็บเพื่อบันทึกสถานะแบบ Clean Exit
    window.addEventListener('beforeunload', () => {
      this.recordHeartbeat(true);
      this.saveNowSync({ trigger: 'beforeunload' });
    });

    window.addEventListener('pagehide', () => {
      this.recordHeartbeat(true);
      this.saveNowSync({ trigger: 'beforeunload' });
    });
  }

  /**
   * ตรวจสอบว่าเซสชันก่อนหน้าเกิดการ Crash หรือปิดผิดปกติหรือไม่
   */
  public static checkForAbnormalShutdown(): { hasCrash: boolean; lastState: StudioAutoSaveState | null; timeAgoText: string } {
    try {
      const rawHeartbeat = localStorage.getItem(STORAGE_KEY_HEARTBEAT);
      if (!rawHeartbeat) {
        return { hasCrash: false, lastState: null, timeAgoText: '' };
      }

      const heartbeat = JSON.parse(rawHeartbeat);
      // หาก Session ID แตกต่าง และ isCleanExit เป็น false และเวลาห่างไม่เกิน 48 ชม.
      if (heartbeat.sessionId !== this.sessionId && heartbeat.isCleanExit === false) {
        const lastSaved = this.loadLatestState();
        if (lastSaved && Date.now() - heartbeat.lastHeartbeat < 48 * 60 * 60 * 1000) {
          const diffMinutes = Math.max(1, Math.round((Date.now() - heartbeat.lastHeartbeat) / (1000 * 60)));
          const timeAgoText = diffMinutes < 60 ? `${diffMinutes} นาทีที่แล้ว` : `${Math.round(diffMinutes / 60)} ชั่วโมงที่แล้ว`;
          return { hasCrash: true, lastState: lastSaved, timeAgoText };
        }
      }
    } catch (err) {
      console.warn('[AutoSave] Failed to evaluate heartbeat crash detection:', err);
    }
    return { hasCrash: false, lastState: null, timeAgoText: '' };
  }

  /**
   * บันทึก Heartbeat ปัจจุบัน
   */
  public static recordHeartbeat(isCleanExit: boolean): void {
    try {
      const heartbeatData = {
        sessionId: this.sessionId,
        tabId: this.tabId,
        lastHeartbeat: Date.now(),
        isCleanExit,
      };
      localStorage.setItem(STORAGE_KEY_HEARTBEAT, JSON.stringify(heartbeatData));
    } catch (err) {
      // ignore
    }
  }

  /**
   * ลงทะเบียนหรืออัปเดตสถานะของโมดูลย่อย
   */
  public static registerModuleState(moduleId: string, state: any): void {
    if (!moduleId) return;
    this.registeredModuleStates[moduleId] = {
      ...this.registeredModuleStates[moduleId],
      ...state,
      _updatedAt: Date.now(),
    };
  }

  /**
   * ดึงสถานะของโมดูลย่อย
   */
  public static getModuleState<T = any>(moduleId: string): T | undefined {
    return this.registeredModuleStates[moduleId] as T;
  }

  /**
   * ล้างสถานะของโมดูลย่อย
   */
  public static clearModuleState(moduleId: string): void {
    delete this.registeredModuleStates[moduleId];
  }

  /**
   * ดึงการตั้งค่า Global Config ปัจจุบัน
   */
  public static getConfig(): StudioConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (raw) {
        return { ...DEFAULT_STUDIO_CONFIG, ...JSON.parse(raw) };
      }
    } catch (err) {
      console.warn('[AutoSave] Failed to parse config, using defaults:', err);
    }
    return { ...DEFAULT_STUDIO_CONFIG };
  }

  /**
   * อัปเดตและบันทึกการตั้งค่า Global Config
   */
  public static updateConfig(partialConfig: Partial<StudioConfig>): StudioConfig {
    const current = this.getConfig();
    const updated = { ...current, ...partialConfig };
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('studio-autosave-config-changed', { detail: updated }));
    } catch (err) {
      console.error('[AutoSave] Failed to save config:', err);
    }
    return updated;
  }

  /**
   * โหลด State ล่าสุดจาก LocalStorage
   */
  public static loadLatestState(): StudioAutoSaveState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (!raw) return null;
      const parsed: StudioAutoSaveState = JSON.parse(raw);
      return parsed;
    } catch (err) {
      console.error('[AutoSave] Failed to parse latest state:', err);
      return null;
    }
  }

  /**
   * บันทึกสถานะสตูดิโอทันที (Debounced & Safe)
   */
  public static saveNow(options: {
    activeTool?: string;
    activeSubTool?: string;
    trigger?: SessionMetadata['lastTrigger'];
    customModuleStates?: Record<string, any>;
    label?: string;
    isBookmark?: boolean;
  } = {}): Promise<StudioAutoSaveState> {
    return new Promise((resolve, reject) => {
      if (this.saveDebounceTimer) {
        clearTimeout(this.saveDebounceTimer);
      }

      this.saveDebounceTimer = setTimeout(() => {
        try {
          const result = this.saveNowSync(options);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, 100);
    });
  }

  /**
   * บันทึกสถานะสตูดิโอทันทีแบบ Synchronous
   */
  public static saveNowSync(options: {
    activeTool?: string;
    activeSubTool?: string;
    trigger?: SessionMetadata['lastTrigger'];
    customModuleStates?: Record<string, any>;
    label?: string;
    isBookmark?: boolean;
  } = {}): StudioAutoSaveState {
    const config = this.getConfig();
    if (!config.isAutoSaveEnabled && options.trigger !== 'manual' && !options.isBookmark) {
      // แม้ AutoSave จะปิดอยู่ แต่ถ้าเป็น manual หรือ bookmark ให้ยอมบันทึก
      const existing = this.loadLatestState();
      if (existing) return existing;
    }

    const activeTool = options.activeTool || localStorage.getItem('omni_activeTool') || 'OmniCreatorMaster';
    const now = Date.now();
    const trigger = options.trigger || 'periodic';

    // รวมโมดูลสเตต
    const combinedModuleStates = {
      ...this.registeredModuleStates,
      ...(options.customModuleStates || {}),
    };

    // สร้าง State Object
    const currentState: StudioAutoSaveState = {
      version: CURRENT_SCHEMA_VERSION,
      timestamp: now,
      lastSavedIso: new Date(now).toISOString(),
      activeTool,
      activeSubTool: options.activeSubTool,
      studioConfig: config,
      moduleStates: combinedModuleStates,
      sessionMetadata: {
        sessionId: this.sessionId,
        tabId: this.tabId,
        startedAt: now,
        lastHeartbeat: now,
        isCleanExit: false,
        crashRecovered: false,
        totalSaveCount: (this.loadLatestState()?.sessionMetadata.totalSaveCount || 0) + 1,
        totalDataSizeBytes: 0,
        lastTrigger: trigger,
      },
    };

    const serializedState = JSON.stringify(currentState);
    currentState.sessionMetadata.totalDataSizeBytes = new Blob([serializedState]).size;

    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(currentState));
    } catch (err: any) {
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        console.warn('[AutoSave] Quota exceeded. Performing emergency storage pruning...');
        this.pruneOldSnapshots(true);
        try {
          localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(currentState));
        } catch (retryErr) {
          console.error('[AutoSave] Critical: Unable to save state after pruning:', retryErr);
        }
      } else {
        console.error('[AutoSave] Unexpected error writing current state:', err);
      }
    }

    // บันทึกลงใน Rolling History Checkpoints
    this.appendSnapshotHistory({
      id: 'snap_' + now.toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: now,
      formattedTime: new Date(now).toLocaleTimeString(),
      activeTool,
      trigger,
      label: options.label,
      isBookmark: options.isBookmark || false,
      state: currentState,
      sizeBytes: currentState.sessionMetadata.totalDataSizeBytes,
    });

    // ส่ง Custom Event ให้ UI อัปเดต
    window.dispatchEvent(
      new CustomEvent('studio-autosave-completed', {
        detail: {
          timestamp: now,
          activeTool,
          trigger,
          sizeBytes: currentState.sessionMetadata.totalDataSizeBytes,
          label: options.label,
        },
      })
    );

    return currentState;
  }

  /**
   * เพิ่ม Snapshot ลงในประวัติย้อนหลัง
   */
  private static appendSnapshotHistory(snapshot: AutoSaveSnapshot): void {
    const config = this.getConfig();
    const maxSnapshots = Math.max(3, config.maxRollingSnapshots || 8);

    let history = this.getSnapshotHistory();

    // เพิ่ม Snapshot ใหม่ด้านหน้า
    history.unshift(snapshot);

    // เก็บ Bookmark ไว้เสมอ และจำกัดจำนวน Periodic Snapshots
    const bookmarks = history.filter((s) => s.isBookmark);
    const nonBookmarks = history.filter((s) => !s.isBookmark).slice(0, maxSnapshots);

    history = [...bookmarks, ...nonBookmarks].sort((a, b) => b.timestamp - a.timestamp);

    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (err: any) {
      if (err.name === 'QuotaExceededError') {
        // หากเต็ม ให้ตัดเหลือ 3 ตัวล่าสุด
        const trimmed = history.slice(0, 3);
        try {
          localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(trimmed));
        } catch (e) {
          console.error('[AutoSave] Failed to save trimmed history:', e);
        }
      }
    }
  }

  /**
   * ดึงรายการประวัติ Snapshot ทั้งหมด
   */
  public static getSnapshotHistory(): AutoSaveSnapshot[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (!raw) return [];
      const parsed: AutoSaveSnapshot[] = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('[AutoSave] Failed to parse snapshot history:', err);
      return [];
    }
  }

  /**
   * สร้าง Named Bookmark Snapshot ด้วยตนเอง
   */
  public static createNamedBookmark(label: string): AutoSaveSnapshot {
    const state = this.saveNowSync({ trigger: 'manual', label, isBookmark: true });
    const now = state.timestamp;
    return {
      id: 'bookmark_' + now,
      timestamp: now,
      formattedTime: new Date(now).toLocaleTimeString(),
      activeTool: state.activeTool,
      trigger: 'manual',
      label,
      isBookmark: true,
      state,
      sizeBytes: state.sessionMetadata.totalDataSizeBytes,
    };
  }

  /**
   * กู้คืน State จาก Snapshot ที่ระบุ
   */
  public static restoreSnapshot(snapshotId: string): boolean {
    const history = this.getSnapshotHistory();
    const target = history.find((s) => s.id === snapshotId);
    if (!target) return false;

    return this.applyRestoredState(target.state);
  }

  /**
   * นำ State ที่กู้คืนมาไปปรับใช้กับระบบ
   */
  public static applyRestoredState(state: StudioAutoSaveState): boolean {
    try {
      if (!state || !state.activeTool) return false;

      // อัปเดต localStorage activeTool
      localStorage.setItem('omni_activeTool', state.activeTool);

      // อัปเดต Module States
      if (state.moduleStates) {
        this.registeredModuleStates = { ...state.moduleStates };
      }

      // อัปเดต Config ถ้ามี
      if (state.studioConfig) {
        this.updateConfig(state.studioConfig);
      }

      // บันทึกเป็น State ปัจจุบัน
      state.sessionMetadata.crashRecovered = true;
      state.timestamp = Date.now();
      state.lastSavedIso = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(state));

      // ส่ง Event ให้ระบบเปลี่ยน Tool และโหลด State
      window.dispatchEvent(
        new CustomEvent('switch-tool', {
          detail: state.activeTool,
        })
      );

      window.dispatchEvent(
        new CustomEvent('studio-autosave-restored', {
          detail: state,
        })
      );

      return true;
    } catch (err) {
      console.error('[AutoSave] Failed to apply restored state:', err);
      return false;
    }
  }

  /**
   * ล้างประวัติ Snapshots ทั้งหมด
   */
  public static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  }

  /**
   * คำนวณปริมาณการใช้งาน Storage
   */
  public static getStorageMetrics(): StorageUsageMetrics {
    try {
      let totalBytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('omni_')) {
          const val = localStorage.getItem(key) || '';
          totalBytes += key.length + val.length * 2; // UTF-16 approximate
        }
      }

      const history = this.getSnapshotHistory();
      const quotaEstimate = 5 * 1024 * 1024; // 5 MB typical localStorage limit
      const percentUsed = Math.min(100, Math.round((totalBytes / quotaEstimate) * 100));

      const usedFormatted = totalBytes < 1024
        ? `${totalBytes} B`
        : totalBytes < 1024 * 1024
        ? `${(totalBytes / 1024).toFixed(1)} KB`
        : `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;

      return {
        usedBytes: totalBytes,
        usedFormatted,
        snapshotCount: history.length,
        quotaEstimateBytes: quotaEstimate,
        percentUsed,
      };
    } catch (err) {
      return {
        usedBytes: 0,
        usedFormatted: '0 KB',
        snapshotCount: 0,
        quotaEstimateBytes: 5242880,
        percentUsed: 0,
      };
    }
  }

  /**
   * ส่งออก State ปัจจุบันเป็นไฟล์ JSON สำหรับดาวน์โหลด
   */
  public static exportStateAsJSON(): string {
    const currentState = this.loadLatestState() || this.saveNowSync({ trigger: 'manual' });
    const history = this.getSnapshotHistory();

    const exportBundle = {
      omniStudioBackupVersion: '1.0',
      exportedAt: new Date().toISOString(),
      currentState,
      snapshotsHistory: history,
    };

    return JSON.stringify(exportBundle, null, 2);
  }

  /**
   * นำเข้า State จากไฟล์ JSON
   */
  public static importStateFromJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.currentState && parsed.currentState.activeTool) {
        if (Array.isArray(parsed.snapshotsHistory)) {
          localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(parsed.snapshotsHistory));
        }
        return this.applyRestoredState(parsed.currentState);
      } else if (parsed.activeTool) {
        return this.applyRestoredState(parsed);
      }
      return false;
    } catch (err) {
      console.error('[AutoSave] Failed to import JSON state:', err);
      return false;
    }
  }

  /**
   * ล้าง Snapshot เก่าเพื่อคืนพื้นที่ (LRU Pruning)
   */
  private static pruneOldSnapshots(aggressive: boolean = false): void {
    try {
      const history = this.getSnapshotHistory();
      const keepCount = aggressive ? 2 : 4;
      const pruned = history.slice(0, keepCount);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(pruned));
    } catch (err) {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    }
  }
}
