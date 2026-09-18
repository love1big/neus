/**
 * ============================================================================
 * MODULE: SidebarQuickActionsNode.ts
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * โมดูลจัดการเมนูลอย Quick Actions บนแถบด้านข้าง (Sidebar Quick Actions Popover):
 *   - ติดตามความถี่ในการใช้งานเครื่องมือ (Tool Usage Frequency Tracking) บันทึกลงใน localStorage
 *   - ประเมินและคัดเลือก 3 เครื่องมือที่ถูกใช้งานบ่อยที่สุดตามบริบทของ Workspace (Top 3 Most-Used Tools)
 *   - จัดเตรียมปุ่ม Quick Actions Menu ให้ผู้ใช้สามารถสลับการทำงานระหว่างเครื่องมือหลักได้อย่างรวดเร็วทันใจ
 *   - รองรับฟังก์ชันปักหมุดเครื่องมือโปรด (Pin Favorite Tool)
 * 
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - นำเข้าใน:
 *     - `src/components/OmniEngineIDE.tsx` (เรนเดอร์ปุ่มลอย Quick Actions บน Sidebar ซ้าย)
 *     - `src/components/SidebarQuickActionsMenu.tsx` (UI เมนูแบบลอย Floating Popover)
 * - Key ใน localStorage:
 *     - `omni_tool_usage_frequency_v1`
 * 
 * 3. พารามิเตอร์ Input / Output ที่รับส่ง (Inputs & Outputs):
 * ----------------------------------------------------------------------------
 * - Input: `toolId: string` (เมื่อผู้ใช้เปิดใช้งานเครื่องมือใดๆ)
 * - Output: `QuickActionTool[]` (รายการ Top 3 เครื่องมือที่ใช้งานมากที่สุด พร้อมไอคอนและสถิติ)
 * 
 * 4. ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ----------------------------------------------------------------------------
 * import { sidebarQuickActionsTracker } from './SidebarQuickActionsNode';
 * sidebarQuickActionsTracker.recordToolUsage('CodeEditor');
 * const top3 = sidebarQuickActionsTracker.getTopMostUsedTools(allTools, 3);
 * ============================================================================
 */

export interface ToolUsageRecord {
  id: string;
  count: number;
  lastUsed: number;
  pinned?: boolean;
}

export interface QuickActionTool {
  id: string;
  label: string;
  iconName?: string;
  iconNode?: any;
  count: number;
  lastUsed: number;
  pinned?: boolean;
  category?: string;
}

const STORAGE_KEY = 'omni_tool_usage_frequency_v1';

export class SidebarQuickActionsTracker {
  private static instance: SidebarQuickActionsTracker | null = null;
  private usageMap: Map<string, ToolUsageRecord> = new Map();
  private listeners: Set<(records: ToolUsageRecord[]) => void> = new Set();

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): SidebarQuickActionsTracker {
    if (!SidebarQuickActionsTracker.instance) {
      SidebarQuickActionsTracker.instance = new SidebarQuickActionsTracker();
    }
    return SidebarQuickActionsTracker.instance;
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: ToolUsageRecord[] = JSON.parse(raw);
        parsed.forEach(item => {
          this.usageMap.set(item.id, item);
        });
      } else {
        // ค่าเริ่มต้น default 3 เครื่องมือหลักที่ใช้บ่อย
        this.seedInitialDefaults();
      }
    } catch (e) {
      console.warn('Failed to load tool usage records from localStorage', e);
      this.seedInitialDefaults();
    }
  }

  private seedInitialDefaults(): void {
    const defaults: ToolUsageRecord[] = [
      { id: 'CodeEditor', count: 18, lastUsed: Date.now() - 1000 * 60 * 5 },
      { id: 'AIChat', count: 25, lastUsed: Date.now() - 1000 * 60 * 2, pinned: true },
      { id: 'UnifiedHubWorkspace', count: 15, lastUsed: Date.now() - 1000 * 60 * 10 },
      { id: 'MapEdit', count: 12, lastUsed: Date.now() - 1000 * 60 * 30 }
    ];
    defaults.forEach(d => this.usageMap.set(d.id, d));
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      const array = Array.from(this.usageMap.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
      this.notifyListeners();
    } catch (e) {
      console.warn('Failed to save tool usage records to localStorage', e);
    }
  }

  public recordToolUsage(toolId: string): void {
    if (!toolId) return;
    const existing = this.usageMap.get(toolId) || {
      id: toolId,
      count: 0,
      lastUsed: Date.now()
    };
    existing.count += 1;
    existing.lastUsed = Date.now();
    this.usageMap.set(toolId, existing);
    this.saveToStorage();
  }

  public togglePin(toolId: string): void {
    const existing = this.usageMap.get(toolId);
    if (existing) {
      existing.pinned = !existing.pinned;
      this.saveToStorage();
    }
  }

  /**
   * คืนค่า 3 เครื่องมือที่ถูกใช้งานมากที่สุด โดยเรียงตาม Pin -> ความถี่การใช้งาน (Count) -> เวลาล่าสุด (LastUsed)
   */
  public getTopMostUsedTools(allTools: any[] = [], limit: number = 3): QuickActionTool[] {
    const toolLookup = new Map<string, any>();
    allTools.forEach(t => toolLookup.set(t.id, t));

    const records = Array.from(this.usageMap.values());

    // เรียงลำดับ: ปักหมุดมาก่อน จากนั้นเรียงตามจำนวนครั้งที่กดใช้งาน และเวลาที่ใช้งานล่าสุด
    records.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (b.count !== a.count) return b.count - a.count;
      return b.lastUsed - a.lastUsed;
    });

    const topList: QuickActionTool[] = [];

    for (const rec of records) {
      if (topList.length >= limit) break;
      const toolDef = toolLookup.get(rec.id);
      if (toolDef) {
        topList.push({
          id: rec.id,
          label: toolDef.label || rec.id,
          iconName: toolDef.iconName,
          iconNode: toolDef.iconNode,
          count: rec.count,
          lastUsed: rec.lastUsed,
          pinned: rec.pinned,
          category: toolDef.category
        });
      } else {
        // หากไม่มีใน lookup ให้สร้าง placeholder ป้องกัน null
        topList.push({
          id: rec.id,
          label: rec.id,
          count: rec.count,
          lastUsed: rec.lastUsed,
          pinned: rec.pinned
        });
      }
    }

    // หากยังไม่ครบ 3 ให้ดึงเครื่องมือพื้นฐานมาเติม
    if (topList.length < limit && allTools.length > 0) {
      for (const t of allTools) {
        if (topList.length >= limit) break;
        if (!topList.some(item => item.id === t.id)) {
          topList.push({
            id: t.id,
            label: t.label || t.id,
            iconName: t.iconName,
            iconNode: t.iconNode,
            count: 1,
            lastUsed: Date.now(),
            category: t.category
          });
        }
      }
    }

    return topList;
  }

  public subscribe(callback: (records: ToolUsageRecord[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    const list = Array.from(this.usageMap.values());
    this.listeners.forEach(cb => {
      try {
        cb(list);
      } catch (e) {
        console.error('Error in QuickActions subscriber', e);
      }
    });
  }
}

export const sidebarQuickActionsTracker = SidebarQuickActionsTracker.getInstance();
