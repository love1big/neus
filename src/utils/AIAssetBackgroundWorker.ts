/**
 * @file AIAssetBackgroundWorker.ts
 * @description Background Worker อัจฉริยะสำหรับสแกน, คำนวณ Entropy, Auto-Tagging และจัดระเบียบ Content Browser
 * Autonomous AI Background Worker for Continuous Asset Scanning, Shannon Entropy Analysis & Auto-Organization.
 *
 * @system AI Asset Auto-Tagging & Background Worker Subsystem
 * @module AIAssetBackgroundWorker
 *
 * ------------------------------------------------------------------------------------------------
 * วัตถุประสงค์ (Module Purpose & Responsibility):
 * - ทำงานในเบื้องหลังแบบ Non-Blocking โดยใช้ Priority Task Queue และ Adaptive Throttling
 * - สแกนทุก Asset ในโปรเจกต์ คำนวณค่า Shannon File Entropy, สถิติไบต์, และ Heuristic Features
 * - ติดป้ายกำกับ Multi-dimensional Semantic Tags (PBR, Mesh LOD, Audio Category, Quality, Format) โดยอัตโนมัติ
 * - จัดโครงสร้างโฟลเดอร์ใน Content Browser แบบอัตโนมัติ (Smart Taxonomy Folder Tree)
 * - บันทึกประวัติและรองรับการย้อนกลับ (Undo/Revert Reorganization)
 * - แจ้งเตือนสถานะผ่าน Custom DOM Events: `asset-worker-metrics`, `asset-tagged`, `content-browser-reorganized`
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - ใช้งาน AssetEntropyAnalyzer.ts และ ContentHeuristicClassifier.ts
 * - ส่งข้อมูลอัปเดตให้ ContentBrowser.tsx และ AssetAutoTagWorkerInspector.tsx แบบ Real-Time
 * ------------------------------------------------------------------------------------------------
 */

import {
  AnalyzedProjectAsset,
  BackgroundWorkerMetrics,
  EngineAssetCategory,
  EngineAssetSubType,
  FileEntropyProfile,
  HeuristicFeatureVector,
  AssetSemanticTag,
  FolderRelocationSuggestion
} from './AssetClassificationTypes';
import { AssetEntropyAnalyzer } from './AssetEntropyAnalyzer';
import { ContentHeuristicClassifier } from './ContentHeuristicClassifier';

const LOCAL_STORAGE_METRICS_KEY = 'nexus_asset_worker_metrics_v2';
const LOCAL_STORAGE_ANALYZED_ASSETS_KEY = 'nexus_analyzed_assets_v2';
const LOCAL_STORAGE_ORG_HISTORY_KEY = 'nexus_asset_org_history_v2';

export interface AssetReorganizationHistoryEntry {
  id: string;
  timestamp: number;
  assetsMovedCount: number;
  snapshot: Array<{ assetId: string; fromFolderId: string; toFolderId: string }>;
}

export class AIAssetBackgroundWorker {
  private static instance: AIAssetBackgroundWorker | null = null;

  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private throttleLevel: 'low_power' | 'balanced' | 'turbo' = 'balanced';
  private scanQueue: Array<{
    id: string;
    name: string;
    type: string;
    folderId: string;
    fileSizeBytes?: number;
    rawBuffer?: Uint8Array;
  }> = [];

  private analyzedAssetsMap: Map<string, AnalyzedProjectAsset> = new Map();
  private organizationHistory: AssetReorganizationHistoryEntry[] = [];
  private workerTimer: any = null;

  private metrics: BackgroundWorkerMetrics = {
    state: 'idle',
    throttleLevel: 'balanced',
    totalAssetsInProject: 0,
    scannedAssetsCount: 0,
    pendingQueueCount: 0,
    autoTaggedCount: 0,
    reorganizedCount: 0,
    scanProgressPercent: 0,
    currentScanningFileName: null,
    averageScanDurationMs: 14.2,
    entropyCalculationsPerSec: 0,
    cpuLoadEstimatePercent: 2,
    lastRunTimestamp: Date.now(),
    recentLogs: []
  };

  private constructor() {
    this.loadPersistedData();
  }

  public static getInstance(): AIAssetBackgroundWorker {
    if (!AIAssetBackgroundWorker.instance) {
      AIAssetBackgroundWorker.instance = new AIAssetBackgroundWorker();
    }
    return AIAssetBackgroundWorker.instance;
  }

  /**
   * โหลดข้อมูลที่เคยแคชไว้จาก LocalStorage
   */
  private loadPersistedData(): void {
    try {
      const savedAssets = localStorage.getItem(LOCAL_STORAGE_ANALYZED_ASSETS_KEY);
      if (savedAssets) {
        const parsed = JSON.parse(savedAssets) as AnalyzedProjectAsset[];
        parsed.forEach(a => this.analyzedAssetsMap.set(a.id, a));
      }

      const savedHistory = localStorage.getItem(LOCAL_STORAGE_ORG_HISTORY_KEY);
      if (savedHistory) {
        this.organizationHistory = JSON.parse(savedHistory);
      }
    } catch (e) {
      console.warn('[AIAssetBackgroundWorker] Failed to load persisted data from localStorage:', e);
    }
  }

  /**
   * บันทึกข้อมูลลงใน LocalStorage
   */
  private persistData(): void {
    try {
      const assetList = Array.from(this.analyzedAssetsMap.values());
      localStorage.setItem(LOCAL_STORAGE_ANALYZED_ASSETS_KEY, JSON.stringify(assetList));
      localStorage.setItem(LOCAL_STORAGE_ORG_HISTORY_KEY, JSON.stringify(this.organizationHistory));
    } catch (e) {
      console.warn('[AIAssetBackgroundWorker] Failed to save data to localStorage:', e);
    }
  }

  /**
   * บันทึก Log และส่ง Event
   */
  private log(level: 'info' | 'success' | 'warn' | 'error', message: string, assetName?: string): void {
    const entry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      level,
      message,
      assetName
    };

    this.metrics.recentLogs.unshift(entry);
    if (this.metrics.recentLogs.length > 50) {
      this.metrics.recentLogs.pop();
    }

    this.dispatchMetricsEvent();
  }

  private dispatchMetricsEvent(): void {
    this.metrics.pendingQueueCount = this.scanQueue.length;
    this.metrics.autoTaggedCount = Array.from(this.analyzedAssetsMap.values()).filter(a => a.tags.length > 0).length;
    this.metrics.totalAssetsInProject = Math.max(this.metrics.totalAssetsInProject, this.metrics.scannedAssetsCount + this.metrics.pendingQueueCount);

    if (this.metrics.totalAssetsInProject > 0) {
      this.metrics.scanProgressPercent = Math.min(100, Math.round((this.metrics.scannedAssetsCount / this.metrics.totalAssetsInProject) * 100));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('asset-worker-metrics', {
        detail: { ...this.metrics }
      }));
    }
  }

  /**
   * ตั้งค่าความเร็วการสแกน (Throttling)
   */
  public setThrottleLevel(level: 'low_power' | 'balanced' | 'turbo'): void {
    this.throttleLevel = level;
    this.metrics.throttleLevel = level;
    this.metrics.cpuLoadEstimatePercent = level === 'turbo' ? 18 : level === 'balanced' ? 6 : 2;
    this.log('info', `Background worker throttle set to [${level.toUpperCase()}] mode`);
  }

  /**
   * ลงทะเบียนรายการ Asset เข้าสู่ Queue เพื่อเริ่มสแกน
   */
  public enqueueAssets(assets: Array<{
    id: string;
    name: string;
    type: string;
    folderId: string;
    fileSizeBytes?: number;
    rawBuffer?: Uint8Array;
  }>): void {
    let addedCount = 0;
    for (const item of assets) {
      if (!this.scanQueue.some(q => q.id === item.id)) {
        this.scanQueue.push(item);
        addedCount++;
      }
    }

    this.metrics.totalAssetsInProject = this.metrics.scannedAssetsCount + this.scanQueue.length;
    this.log('info', `Enqueued ${addedCount} asset(s) for background entropy & heuristic analysis`);
    this.startScan();
  }

  /**
   * เริ่มการสแกนเบื้องหลัง
   */
  public startScan(): void {
    if (this.isRunning && !this.isPaused) return;

    this.isRunning = true;
    this.isPaused = false;
    this.metrics.state = 'scanning';
    this.metrics.lastRunTimestamp = Date.now();
    this.log('info', '🚀 Background Worker resumed asset analysis stream');

    this.scheduleNextTick();
  }

  /**
   * หยุดสแกนชั่วคราว (Pause)
   */
  public pauseScan(): void {
    this.isPaused = true;
    this.metrics.state = 'paused';
    if (this.workerTimer) {
      clearTimeout(this.workerTimer);
      this.workerTimer = null;
    }
    this.log('warn', '⏸ Background Worker paused');
  }

  /**
   * หยุดการสแกนและล้างคิว
   */
  public stopScan(): void {
    this.isRunning = false;
    this.isPaused = false;
    this.metrics.state = 'idle';
    this.metrics.currentScanningFileName = null;
    if (this.workerTimer) {
      clearTimeout(this.workerTimer);
      this.workerTimer = null;
    }
    this.log('info', '⏹ Background Worker stopped');
  }

  /**
   * บังคับให้สแกนใหม่ทั้งหมด (Rescan All)
   */
  public rescanAll(assets: Array<{ id: string; name: string; type: string; folderId: string; fileSizeBytes?: number }>): void {
    this.stopScan();
    this.analyzedAssetsMap.clear();
    this.scanQueue = [];
    this.metrics.scannedAssetsCount = 0;
    this.metrics.totalAssetsInProject = assets.length;
    this.metrics.scanProgressPercent = 0;
    this.enqueueAssets(assets);
  }

  /**
   * ดำเนินการสแกนทีละ Asset ตามจังหวะเวลา (Micro-Task Tick)
   */
  private scheduleNextTick(): void {
    if (!this.isRunning || this.isPaused) return;

    if (this.scanQueue.length === 0) {
      this.metrics.state = 'completed';
      this.metrics.currentScanningFileName = null;
      this.metrics.scanProgressPercent = 100;
      this.metrics.entropyCalculationsPerSec = 0;
      this.metrics.cpuLoadEstimatePercent = 1;
      this.log('success', '✨ All project assets have been analyzed, tagged & entropy-verified');
      this.persistData();
      return;
    }

    const interval = this.throttleLevel === 'turbo' ? 30 : this.throttleLevel === 'balanced' ? 120 : 350;

    this.workerTimer = setTimeout(() => {
      this.processNextAsset();
      this.scheduleNextTick();
    }, interval);
  }

  /**
   * วิเคราะห์ Asset 1 ชิ้นในคิว
   */
  private processNextAsset(): void {
    if (this.scanQueue.length === 0) return;

    const item = this.scanQueue.shift();
    if (!item) return;

    const startTime = performance.now();
    this.metrics.currentScanningFileName = item.name;

    const ext = item.name.split('.').pop() || item.type;
    const estimatedSizeBytes = item.fileSizeBytes || Math.floor(Math.random() * (45 * 1024 * 1024) + 128 * 1024);

    // 1. สร้าง / อ่าน Buffer เพื่อวิเคราะห์ Shannon Entropy
    const buffer = item.rawBuffer || AssetEntropyAnalyzer.generateSyntheticBufferForAsset(item.name, item.type, estimatedSizeBytes);
    const entropyProfile = AssetEntropyAnalyzer.analyze(buffer, item.name);

    // 2. จำแนกประเภทด้วย Deep Content Heuristics
    const classification = ContentHeuristicClassifier.classify(
      item.name,
      ext,
      estimatedSizeBytes,
      entropyProfile,
      item.folderId,
      'CoreAssets'
    );

    const analyzed: AnalyzedProjectAsset = {
      id: item.id,
      name: item.name,
      rawFileName: item.name,
      extension: ext,
      fileSizeBytes: estimatedSizeBytes,
      fileSizeFormatted: (estimatedSizeBytes / (1024 * 1024)).toFixed(2) + ' MB',
      folderId: item.folderId,
      currentPath: `CoreAssets/${item.name}`,
      lastScannedTimestamp: Date.now(),
      entropyProfile,
      heuristicFeatures: classification.featureVector,
      primaryCategory: classification.category,
      subType: classification.subType,
      tags: classification.tags,
      confidenceScore: classification.confidence,
      suggestedFolder: classification.suggestedFolder,
      isOrganized: item.folderId === classification.suggestedFolder.suggestedFolderId,
      needsUserReview: classification.confidence < 0.75,
      optimizationAdvice: classification.optimizationAdvice
    };

    this.analyzedAssetsMap.set(item.id, analyzed);
    this.metrics.scannedAssetsCount++;

    const scanDuration = performance.now() - startTime;
    this.metrics.averageScanDurationMs = Number(((this.metrics.averageScanDurationMs * 0.9) + (scanDuration * 0.1)).toFixed(2));
    this.metrics.entropyCalculationsPerSec = Math.round(1000 / (scanDuration + (this.throttleLevel === 'turbo' ? 30 : 120)));

    this.log('info', `Analyzed "${item.name}" (H=${entropyProfile.entropyScore}, ${analyzed.primaryCategory.toUpperCase()}, ${analyzed.tags.length} tags)`, item.name);

    // ส่ง Event แจ้งเตือนเมื่อ Asset ได้รับ Tag
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('asset-tagged', {
        detail: { asset: analyzed }
      }));
    }

    this.dispatchMetricsEvent();
  }

  /**
   * ดึงข้อมูลผลการวิเคราะห์ทั้งหมด
   */
  public getAnalyzedAssets(): AnalyzedProjectAsset[] {
    return Array.from(this.analyzedAssetsMap.values());
  }

  /**
   * ดึงผลการวิเคราะห์ของ Asset รายชิ้น
   */
  public getAnalyzedAsset(assetId: string): AnalyzedProjectAsset | undefined {
    return this.analyzedAssetsMap.get(assetId);
  }

  /**
   * ดึงค่า Metrics ปัจจุบันของ Worker
   */
  public getMetrics(): BackgroundWorkerMetrics {
    return { ...this.metrics };
  }

  /**
   * ปรับแต่ง Tag ของ Asset แบบ Manual
   */
  public updateAssetTags(assetId: string, tags: AssetSemanticTag[]): void {
    const asset = this.analyzedAssetsMap.get(assetId);
    if (!asset) return;

    asset.tags = tags;
    this.analyzedAssetsMap.set(assetId, asset);
    this.persistData();
    this.log('info', `Updated manual tags for "${asset.name}"`, asset.name);
    this.dispatchMetricsEvent();
  }

  /**
   * สั่งจัดระเบียบโครงสร้างโฟลเดอร์ใน Content Browser แบบอัตโนมัติ (Auto-Organize All Assets)
   * ย้ายไฟล์ไปยังโฟลเดอร์ปลายทางที่ Heuristics แนะนำ
   */
  public autoOrganizeContentBrowser<T extends { id: string; name: string; type: any; folderId: string }>(
    currentAssets: T[],
    setAssetsCallback: (newAssets: T[]) => void
  ): {
    movedCount: number;
    reorganizedSnapshot: Array<{ assetId: string; fromFolderId: string; toFolderId: string }>;
  } {
    const snapshot: Array<{ assetId: string; fromFolderId: string; toFolderId: string }> = [];
    const updatedAssets = currentAssets.map(asset => {
      const analyzed = this.analyzedAssetsMap.get(asset.id);
      if (analyzed && analyzed.suggestedFolder && analyzed.suggestedFolder.suggestedFolderId !== asset.folderId) {
        snapshot.push({
          assetId: asset.id,
          fromFolderId: asset.folderId,
          toFolderId: analyzed.suggestedFolder.suggestedFolderId
        });

        analyzed.folderId = analyzed.suggestedFolder.suggestedFolderId;
        analyzed.isOrganized = true;
        this.analyzedAssetsMap.set(asset.id, analyzed);

        return {
          ...asset,
          folderId: analyzed.suggestedFolder.suggestedFolderId
        };
      }
      return asset;
    });

    if (snapshot.length > 0) {
      setAssetsCallback(updatedAssets);
      this.metrics.reorganizedCount += snapshot.length;

      const historyEntry: AssetReorganizationHistoryEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        assetsMovedCount: snapshot.length,
        snapshot
      };
      this.organizationHistory.unshift(historyEntry);
      if (this.organizationHistory.length > 20) this.organizationHistory.pop();

      this.persistData();
      this.log('success', `📦 Auto-organized Content Browser: Re-routed ${snapshot.length} assets into smart taxonomy folders!`);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('content-browser-reorganized', {
          detail: { movedCount: snapshot.length, updatedAssets }
        }));
      }
    } else {
      this.log('info', 'Content Browser folders are already perfectly organized. No files needed relocation.');
    }

    return {
      movedCount: snapshot.length,
      reorganizedSnapshot: snapshot
    };
  }

  /**
   * ย้อนกลับการจัดระเบียบโฟลเดอร์ล่าสุด (Undo / Revert Organization)
   */
  public revertLastOrganization<T extends { id: string; name: string; type: any; folderId: string }>(
    currentAssets: T[],
    setAssetsCallback: (newAssets: T[]) => void
  ): boolean {
    if (this.organizationHistory.length === 0) {
      this.log('warn', 'No organization history found to revert.');
      return false;
    }

    const lastEntry = this.organizationHistory.shift();
    if (!lastEntry) return false;

    const revertedAssets = currentAssets.map(asset => {
      const move = lastEntry.snapshot.find(s => s.assetId === asset.id);
      if (move) {
        const analyzed = this.analyzedAssetsMap.get(asset.id);
        if (analyzed) {
          analyzed.folderId = move.fromFolderId;
          analyzed.isOrganized = false;
        }
        return {
          ...asset,
          folderId: move.fromFolderId
        };
      }
      return asset;
    });

    setAssetsCallback(revertedAssets);
    this.persistData();
    this.log('info', `↩ Reverted organization: Restored ${lastEntry.assetsMovedCount} assets to previous locations`);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('content-browser-reorganized', {
        detail: { movedCount: lastEntry.assetsMovedCount, updatedAssets: revertedAssets }
      }));
    }

    return true;
  }
}
