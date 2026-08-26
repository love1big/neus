/**
 * @file RecentFilesTracker.ts
 * @description
 * ============================================================================
 * [THAI]
 * โมดูลระบบติดตามประวัติไฟล์และคอมโพเนนต์ที่เปิดล่าสุด (Recent Files & Assets Tracker)
 * จัดเก็บประวัติ 10 รายการล่าสุดลงใน localStorage พร้อมระบบ Reactive Subscription,
 * ปักหมุด (Pin), กรองตามประเภท (Filter), และส่ง Event นำทางอัตโนมัติ
 * 
 * [ENGLISH]
 * Enterprise-grade Recent Files & Assets Tracking System for OmniEngine IDE.
 * Persists the last 10 opened components, assets, blueprints, scripts, and 3D meshes
 * to localStorage with real-time event broadcasting, reactive subscribers, pinning,
 * type classification, and seamless navigation orchestration.
 * ============================================================================
 * 
 * 1. MODULE RESPONSIBILITY & PURPOSE:
 *    - Captures and stores up to 10 recently accessed assets and components.
 *    - Emits reactive updates to UI components (UnifiedHubWorkspace sidebar, CommandPalette).
 *    - Provides resilient serialization with error fallback mechanisms.
 * 
 * 2. ARCHITECTURE & SYSTEM INTEGRATION:
 *    - Integrated with: UnifiedHubWorkspace, App.tsx, ContentBrowser, OmniEngineIDE.
 *    - Storage Key: `omni_recent_files_history_v1`
 *    - Events Dispatched: `recent-files-updated`, `switch-tool`, `open-asset`.
 * 
 * 3. DATA CONTRACTS:
 *    - Input: `RecentFileItemInput` (id, name, type, category, path, hubId, etc.)
 *    - Output: `RecentFileItem[]` sorted by pin status and descending timestamp.
 * 
 * 4. ERROR HANDLING & FALLBACKS:
 *    - Catches corrupted localStorage data and resets gracefully.
 *    - Provides default initial project assets if storage is empty.
 * 
 * 5. USAGE EXAMPLE:
 *    ```ts
 *    import { RecentFilesTracker } from '../utils/RecentFilesTracker';
 *    
 *    RecentFilesTracker.trackOpenedItem({
 *      id: 'CodeEditor',
 *      name: 'CodeEditor.tsx',
 *      type: 'code',
 *      category: '🤖 AI & CODE',
 *      path: '/src/components/CodeEditor.tsx'
 *    });
 *    
 *    const unsubscribe = RecentFilesTracker.subscribe((items) => {
 *      console.log('Updated recent items:', items);
 *    });
 *    ```
 */

export type RecentItemType =
  | 'component'
  | 'asset'
  | 'subtool'
  | 'file'
  | 'blueprint'
  | 'mesh'
  | 'texture'
  | 'audio'
  | 'code'
  | 'level'
  | 'shader';

export interface RecentFileItem {
  id: string;
  name: string;
  type: RecentItemType;
  category?: string;
  path?: string;
  timestamp: number;
  iconName?: string;
  hubId?: string;
  description?: string;
  tags?: string[];
  pinned?: boolean;
  size?: string;
}

export type RecentFileItemInput = Omit<RecentFileItem, 'timestamp'> & {
  timestamp?: number;
};

const STORAGE_KEY = 'omni_recent_files_history_v1';
const MAX_RECENT_ITEMS = 10;

// Default initial recent items for immediate rich display
const DEFAULT_INITIAL_ITEMS: RecentFileItem[] = [
  {
    id: 'OmniCreatorMaster',
    name: 'Global Omniverse Dashboard',
    type: 'component',
    category: '🌟 CORE',
    path: '/src/components/OmniCreatorMaster.tsx',
    timestamp: Date.now() - 1000 * 60 * 5,
    hubId: 'ProjectHub',
    description: 'Central project orchestration & telemetry master overview',
    pinned: true,
  },
  {
    id: 'CodeEditor',
    name: 'LanguageDetectorStudio.tsx',
    type: 'code',
    category: '🤖 AI & CODE',
    path: '/src/components/LanguageDetectorStudio.tsx',
    timestamp: Date.now() - 1000 * 60 * 15,
    hubId: 'CodeIDEHub',
    description: 'AST parser & multi-language syntax detection editor',
  },
  {
    id: 'BP_PlayerCharacter',
    name: 'BP_PlayerCharacter.uasset',
    type: 'blueprint',
    category: 'Characters',
    path: 'CoreAssets/Characters/BP_PlayerCharacter',
    timestamp: Date.now() - 1000 * 60 * 30,
    hubId: 'GameDesignHub',
    description: 'Player controller blueprint with locomotion state machine',
  },
  {
    id: 'M_Ruby_PBR',
    name: 'M_Ruby_PBR.mat',
    type: 'texture',
    category: 'Materials',
    path: 'CoreAssets/Materials/M_Ruby_PBR',
    timestamp: Date.now() - 1000 * 60 * 45,
    hubId: 'TextureHub',
    description: 'Subsurface scattering refractive gemstone material',
  },
  {
    id: 'SKM_HeroMesh',
    name: 'SKM_HeroMesh.fbx',
    type: 'mesh',
    category: 'Meshes',
    path: 'CoreAssets/Characters/SKM_HeroMesh.fbx',
    timestamp: Date.now() - 1000 * 60 * 60,
    hubId: 'ArtStudioHub',
    description: 'High-poly rigged hero mesh with IK bones',
  },
  {
    id: 'OfflineAIContinuousErrorLearningStudio',
    name: 'Offline AI Continuous Error-Learning',
    type: 'component',
    category: '🤖 AI & CODE',
    path: '/src/components/OfflineAIContinuousErrorLearningStudio.tsx',
    timestamp: Date.now() - 1000 * 60 * 90,
    hubId: 'CodeIDEHub',
    description: 'Autonomous zero-loss self-healing engine',
  },
  {
    id: 'MapEdit',
    name: 'CyberpunkCity_Sector7.map',
    type: 'level',
    category: '🌍 WORLD BUILDING',
    path: 'Levels/CyberpunkCity_Sector7.map',
    timestamp: Date.now() - 1000 * 60 * 120,
    hubId: 'WorldHub',
    description: 'Volumetric lighted open-world environment grid',
  },
  {
    id: 'S_Jump_01',
    name: 'S_Spatial_Foley_Jump.wav',
    type: 'audio',
    category: 'Audio',
    path: 'CoreAssets/Audio/S_Spatial_Foley_Jump.wav',
    timestamp: Date.now() - 1000 * 60 * 180,
    hubId: 'AudioHub',
    description: '96kHz binaural spatial audio asset',
  }
];

type Listener = (items: RecentFileItem[]) => void;

class RecentFilesTrackerService {
  private listeners: Set<Listener> = new Set();
  private inMemoryCache: RecentFileItem[] | null = null;

  constructor() {
    // Listen for storage events across browser windows or tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.inMemoryCache = null;
          this.notifyListeners();
        }
      });
    }
  }

  /**
   * Retrieve all recent items stored in localStorage (max 10 items)
   */
  public getRecentItems(): RecentFileItem[] {
    if (this.inMemoryCache !== null) {
      return this.inMemoryCache;
    }

    if (typeof window === 'undefined') {
      return DEFAULT_INITIAL_ITEMS;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialize with default items if first time
        this.saveItems(DEFAULT_INITIAL_ITEMS);
        this.inMemoryCache = DEFAULT_INITIAL_ITEMS;
        return DEFAULT_INITIAL_ITEMS;
      }

      const parsed: RecentFileItem[] = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveItems(DEFAULT_INITIAL_ITEMS);
        this.inMemoryCache = DEFAULT_INITIAL_ITEMS;
        return DEFAULT_INITIAL_ITEMS;
      }

      // Sort: pinned first, then newest timestamp first
      const sorted = parsed
        .map(item => ({
          ...item,
          timestamp: typeof item.timestamp === 'number' ? item.timestamp : Date.now()
        }))
        .sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b.timestamp - a.timestamp;
        })
        .slice(0, MAX_RECENT_ITEMS);

      this.inMemoryCache = sorted;
      return sorted;
    } catch (err) {
      console.warn('[RecentFilesTracker] Failed to load recent items from localStorage:', err);
      this.inMemoryCache = DEFAULT_INITIAL_ITEMS;
      return DEFAULT_INITIAL_ITEMS;
    }
  }

  /**
   * Track an opened component, asset, subtool, or file into recent history
   */
  public trackOpenedItem(itemInput: RecentFileItemInput): RecentFileItem[] {
    if (!itemInput || !itemInput.id) {
      return this.getRecentItems();
    }

    const currentItems = this.getRecentItems();
    const existingIndex = currentItems.findIndex((i) => i.id === itemInput.id);
    const existingItem = existingIndex !== -1 ? currentItems[existingIndex] : null;

    const newItem: RecentFileItem = {
      id: itemInput.id,
      name: itemInput.name || itemInput.id,
      type: itemInput.type || 'component',
      category: itemInput.category || existingItem?.category || 'General',
      path: itemInput.path || existingItem?.path || `/${itemInput.id}`,
      timestamp: Date.now(),
      iconName: itemInput.iconName || existingItem?.iconName,
      hubId: itemInput.hubId || existingItem?.hubId,
      description: itemInput.description || existingItem?.description,
      tags: itemInput.tags || existingItem?.tags,
      pinned: existingItem?.pinned ?? itemInput.pinned ?? false,
      size: itemInput.size || existingItem?.size,
    };

    // Filter out previous entry if present
    const withoutExisting = currentItems.filter((i) => i.id !== itemInput.id);

    // Unshift new item
    const updated = [newItem, ...withoutExisting].slice(0, MAX_RECENT_ITEMS);

    this.saveItems(updated);
    this.inMemoryCache = updated;
    this.notifyListeners();
    return updated;
  }

  /**
   * Remove a specific item from recent history
   */
  public removeRecentItem(id: string): RecentFileItem[] {
    const current = this.getRecentItems();
    const filtered = current.filter((i) => i.id !== id);
    this.saveItems(filtered);
    this.inMemoryCache = filtered;
    this.notifyListeners();
    return filtered;
  }

  /**
   * Toggle pinned status for an item
   */
  public togglePin(id: string): RecentFileItem[] {
    const current = this.getRecentItems();
    const updated = current.map((item) => {
      if (item.id === id) {
        return { ...item, pinned: !item.pinned };
      }
      return item;
    });

    const sorted = updated.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.timestamp - a.timestamp;
    });

    this.saveItems(sorted);
    this.inMemoryCache = sorted;
    this.notifyListeners();
    return sorted;
  }

  /**
   * Clear all recent files history
   */
  public clearRecentItems(): void {
    const empty: RecentFileItem[] = [];
    this.saveItems(empty);
    this.inMemoryCache = empty;
    this.notifyListeners();
  }

  /**
   * Reset to rich demo items
   */
  public resetToDefaults(): RecentFileItem[] {
    this.saveItems(DEFAULT_INITIAL_ITEMS);
    this.inMemoryCache = DEFAULT_INITIAL_ITEMS;
    this.notifyListeners();
    return DEFAULT_INITIAL_ITEMS;
  }

  /**
   * Launch/navigate to the selected recent item
   */
  public openItem(item: RecentFileItem): void {
    // 1. Update its timestamp to push it to the top
    this.trackOpenedItem(item);

    // 2. Dispatch the appropriate navigation event
    if (typeof window !== 'undefined') {
      if (item.type === 'asset' || item.type === 'texture' || item.type === 'mesh' || item.type === 'audio') {
        window.dispatchEvent(new CustomEvent('open-asset', { detail: item.id }));
        // Also ensure ContentBrowser or ArtStudio is selected if not active
        window.dispatchEvent(new CustomEvent('switch-tool', { detail: item.hubId || 'ContentBrowser' }));
      } else {
        window.dispatchEvent(new CustomEvent('switch-tool', { detail: item.id }));
      }
    }
  }

  /**
   * Subscribe to recent items changes
   */
  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Immediately emit current state
    listener(this.getRecentItems());

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Helper to format relative time ago
   */
  public formatTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = Math.max(0, now - timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 45) return 'Just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  }

  private saveItems(items: RecentFileItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_RECENT_ITEMS)));
      window.dispatchEvent(new CustomEvent('recent-files-updated', { detail: items }));
    } catch (err) {
      console.warn('[RecentFilesTracker] Failed to write to localStorage:', err);
    }
  }

  private notifyListeners(): void {
    const current = this.getRecentItems();
    this.listeners.forEach((listener) => {
      try {
        listener(current);
      } catch (err) {
        console.error('[RecentFilesTracker] Listener threw error:', err);
      }
    });
  }
}

export const RecentFilesTracker = new RecentFilesTrackerService();
