/**
 * ============================================================================
 * GLOBAL AUTO-SAVE STATUS WIDGET (วิดเจ็ตแสดงสถานะและศูนย์ควบคุมการบันทึกข้อมูลสตูดิโอ)
 * ============================================================================
 * 
 * 1. MODULE PURPOSE & RESPONSIBILITY (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูล)
 * ----------------------------------------------------------------------------
 * วิดเจ็ตนี้ทำหน้าที่เป็น Interface ควบคุมระบบ Auto-Save ของ Omni Engine Studio:
 *  - แสดงสถานะการบันทึกแบบ Real-time บน Top Header Bar (Saving..., Auto-Saved, Error)
 *  - แสดงเวลาที่บันทึกล่าสุด (Time Ago) และปริมาณพื้นที่ Storage ที่ใช้งาน (KB)
 *  - มี Popover Menu เมื่อคลิก ให้ผู้ใช้สามารถ:
 *    1. กดปุ่ม "บันทึกทันที (Save Now)" พร้อม Effect แจ้งเตือน
 *    2. ปรับความถี่ในการบันทึก (5s, 15s, 30s, 60s, 5 นาที หรือปิด)
 *    3. ดูประวัติจุดกู้คืนย้อนหลัง (Rolling Snapshots Timeline) และกดย้อนเวลา (Rollback)
 *    4. สร้าง Bookmark Snapshot พร้อมตั้งชื่อกำกับได้เอง
 *    5. ส่งออก (Export) และนำเข้า (Import) ข้อมูลสถานะสตูดิโอเป็นไฟล์ JSON
 * 
 * 2. ARCHITECTURE & SYSTEM INTEGRATION (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น)
 * ----------------------------------------------------------------------------
 *  - เรียกใช้ `GlobalStudioAutoSaveManager` และ `useStudioAutoSave`
 *  - ติดตั้งลงบน Header ของ `OmniEngineIDE.tsx` หรือ Float Widget ใน `App.tsx`
 *  - ผสานกับระบบ `triggerNotification` เพื่อแจ้งเตือนเมื่อเซฟเสร็จ
 * 
 * 3. INPUTS, OUTPUTS & DATA CONTRACTS (พารามิเตอร์ Input / Output ที่รับส่ง)
 * ----------------------------------------------------------------------------
 *  - Props:
 *    - `activeTool?: string`
 *    - `onSelectTool?: (toolId: string) => void`
 *    - `compact?: boolean`
 * 
 * 4. ERROR HANDLING & FALLBACKS (การจัดการข้อผิดพลาดและ Edge Cases)
 * ----------------------------------------------------------------------------
 *  - มีการดักจับ JSON Import Corruptions พร้อมแสดงข้อความผิดพลาดชัดเจน
 *  - ปิด Popover อัตโนมัติเมื่อคลิกนอกพื้นที่ (Click Outside Handler)
 * 
 * 5. USAGE EXAMPLE (ตัวอย่างการเรียกใช้งาน)
 * ----------------------------------------------------------------------------
 *  ```tsx
 *  <GlobalAutoSaveStatusWidget activeTool={activeTool} />
 *  ```
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  HardDrive,
  Download,
  Upload,
  Bookmark,
  Sparkles,
  Sliders,
  ChevronDown,
  Trash2,
  X,
  History,
  ShieldCheck,
  RefreshCw,
  FolderSync
} from 'lucide-react';
import {
  GlobalStudioAutoSaveManager,
  StudioAutoSaveState,
  AutoSaveSnapshot,
  StorageUsageMetrics
} from '../utils/GlobalStudioAutoSaveManager';
import { useStudioAutoSave } from '../hooks/useStudioAutoSave';
import { triggerNotification } from './NotificationSystem';

interface GlobalAutoSaveStatusWidgetProps {
  activeTool?: string;
  onSelectTool?: (toolId: string) => void;
  compact?: boolean;
}

export default function GlobalAutoSaveStatusWidget({
  activeTool = 'OmniCreatorMaster',
  onSelectTool,
  compact = false
}: GlobalAutoSaveStatusWidgetProps) {
  const {
    isSaving,
    lastSavedTime,
    saveStatus,
    config,
    saveNow,
    createBookmark,
    restoreSnapshot,
    updateConfig
  } = useStudioAutoSave(activeTool);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'history' | 'backup'>('status');
  const [bookmarkName, setBookmarkName] = useState('');
  const [snapshots, setSnapshots] = useState<AutoSaveSnapshot[]>([]);
  const [metrics, setMetrics] = useState<StorageUsageMetrics>({
    usedBytes: 0,
    usedFormatted: '0 KB',
    snapshotCount: 0,
    quotaEstimateBytes: 5242880,
    percentUsed: 0
  });
  const [timeAgoText, setTimeAgoText] = useState('เมื่อสักครู่');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // คำนวณเวลา Time Ago อัปเดตทุก 3 วินาที
  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastSavedTime) {
        setTimeAgoText('ยังไม่ได้บันทึก');
        return;
      }
      const seconds = Math.floor((Date.now() - lastSavedTime.getTime()) / 1000);
      if (seconds < 5) {
        setTimeAgoText('เมื่อสักครู่');
      } else if (seconds < 60) {
        setTimeAgoText(`${seconds} วินาทีที่แล้ว`);
      } else {
        const minutes = Math.floor(seconds / 60);
        setTimeAgoText(`${minutes} นาทีที่แล้ว`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 3000);
    return () => clearInterval(interval);
  }, [lastSavedTime]);

  // โหลด Snapshots และ Storage Metrics เมื่อเปิด Popover
  const refreshData = () => {
    setSnapshots(GlobalStudioAutoSaveManager.getSnapshotHistory());
    setMetrics(GlobalStudioAutoSaveManager.getStorageMetrics());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen, lastSavedTime]);

  // ปิด Popover เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleManualSave = async () => {
    const state = await saveNow();
    if (state) {
      triggerNotification('success', 'บันทึกสถานะสตูดิโอเรียบร้อย', `บันทึกเครื่องมือ "${state.activeTool}" และการตั้งค่าแล้ว`, false);
      refreshData();
    }
  };

  const handleCreateBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookmarkName.trim()) return;
    createBookmark(bookmarkName.trim());
    setBookmarkName('');
    triggerNotification('success', 'สร้างจุดกู้คืน (Bookmark)', `บันทึก "${bookmarkName.trim()}" สำเร็จ`, false);
    refreshData();
  };

  const handleRestore = (snapshotId: string, toolName: string) => {
    if (window.confirm(`ต้องการย้อนสถานะสตูดิโอกลับไปยังจุดบันทึกของ "${toolName}" ใช่หรือไม่?`)) {
      const ok = restoreSnapshot(snapshotId);
      if (ok) {
        triggerNotification('info', 'กู้คืนสถานะสำเร็จ', `โหลดเครื่องมือและคอนฟิกของ "${toolName}" แล้ว`, false);
        setIsOpen(false);
        if (onSelectTool) {
          onSelectTool(toolName);
        }
      }
    }
  };

  const handleExport = () => {
    try {
      const json = GlobalStudioAutoSaveManager.exportStateAsJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OmniStudio_Backup_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '_')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      triggerNotification('success', 'ส่งออกข้อมูลสำเร็จ', 'ดาวน์โหลดไฟล์สำรองเรียบร้อยแล้ว', false);
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const ok = GlobalStudioAutoSaveManager.importStateFromJSON(text);
        if (ok) {
          setImportSuccess('นำเข้าสถานะสำเร็จ กำลังรีเฟรช...');
          triggerNotification('success', 'นำเข้าข้อมูลสำเร็จ', 'กู้คืนสตูดิโอจากไฟล์สำรองแล้ว', false);
          refreshData();
          setTimeout(() => setIsOpen(false), 1500);
        } else {
          setImportError('รูปแบบไฟล์สำรองไม่ถูกต้อง ไม่สามารถกู้คืนได้');
        }
      } catch (err) {
        setImportError('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON');
      }
    };
    reader.readAsText(file);
  };

  const handleClearHistory = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติการเซฟย้อนหลังทั้งหมด?')) {
      GlobalStudioAutoSaveManager.clearHistory();
      refreshData();
      triggerNotification('info', 'ล้างประวัติแล้ว', 'ลบแคชประวัติ Auto-Save เรียบร้อย', false);
    }
  };

  const getStatusColor = () => {
    if (isSaving) return 'text-amber-400';
    if (saveStatus === 'error') return 'text-red-400';
    if (!config.isAutoSaveEnabled) return 'text-gray-400';
    return 'text-emerald-400';
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Main Status Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all border cursor-pointer ${
          isOpen
            ? 'bg-[#222538] border-[#58a6ff]/60 text-white shadow-sm'
            : 'bg-[#161826] hover:bg-[#202236] border-[#2a2d42] text-gray-300 hover:text-white'
        }`}
        title={`ระบบ Auto-Save: ${config.isAutoSaveEnabled ? `เปิดอยู่ (ทุกๆ ${config.autoSaveIntervalSec} วินาที)` : 'ปิดอยู่'} • เซฟล่าสุด: ${timeAgoText}`}
      >
        {isSaving ? (
          <RefreshCw size={12} className="text-amber-400 animate-spin" />
        ) : saveStatus === 'error' ? (
          <AlertTriangle size={12} className="text-red-400 animate-bounce" />
        ) : config.isAutoSaveEnabled ? (
          <div className="relative flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          </div>
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block"></div>
        )}

        <span className={`font-mono ${getStatusColor()}`}>
          {isSaving ? 'กำลังบันทึก...' : config.isAutoSaveEnabled ? 'Auto-Saved' : 'Auto-Save Off'}
        </span>

        {!compact && (
          <span className="text-[10px] text-gray-400 border-l border-[#2a2d42] pl-1.5 hidden sm:inline">
            {timeAgoText}
          </span>
        )}

        <ChevronDown size={11} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Control Panel Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-[380px] bg-[#121420] border border-[#2a2d44] rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 font-sans text-xs">
          {/* Header */}
          <div className="p-3 bg-[#181a2b] border-b border-[#2a2d44] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400">
                <FolderSync size={15} />
              </div>
              <div>
                <h4 className="font-bold text-white text-[13px] flex items-center gap-1.5">
                  Studio Auto-Save Hub
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono">
                    ACTIVE
                  </span>
                </h4>
                <p className="text-[10px] text-gray-400">ป้องกันข้อมูลสูญหาย บันทึกสถานะอัตโนมัติลงเครื่อง</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#25283d] transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Quick Action & Status Bar */}
          <div className="p-3 bg-[#151726] border-b border-[#23253a] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400">เซฟล่าสุดเมื่อ</span>
              <span className="text-[11px] font-mono text-emerald-300 font-medium">{timeAgoText} ({metrics.usedFormatted})</span>
            </div>

            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={12} />
              <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกทันที (Save)'}</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#23253a] bg-[#0f111a]">
            <button
              onClick={() => setActiveTab('status')}
              className={`flex-1 py-2 text-center text-[11px] font-semibold transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'status'
                  ? 'border-emerald-400 text-emerald-300 bg-[#161826]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Sliders size={12} /> การตั้งค่า
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 text-center text-[11px] font-semibold transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'history'
                  ? 'border-emerald-400 text-emerald-300 bg-[#161826]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <History size={12} /> ประวัติจุดกู้คืน ({snapshots.length})
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex-1 py-2 text-center text-[11px] font-semibold transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'backup'
                  ? 'border-emerald-400 text-emerald-300 bg-[#161826]'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Download size={12} /> Backup/JSON
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-3 max-h-[340px] overflow-y-auto space-y-3">
            {/* TAB 1: STATUS & SETTINGS */}
            {activeTab === 'status' && (
              <div className="space-y-3">
                {/* Auto-Save Toggle */}
                <div className="flex items-center justify-between p-2.5 bg-[#171929] border border-[#262940] rounded-md">
                  <div>
                    <span className="font-semibold text-white block text-[11px]">เปิดใช้งาน Auto-Save อัตโนมัติ</span>
                    <span className="text-[10px] text-gray-400">บันทึกทุกครั้งที่มีการพิมพ์, สลับแท็บ หรือตามรอบเวลา</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.isAutoSaveEnabled}
                    onChange={(e) => updateConfig({ isAutoSaveEnabled: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                {/* Auto-Save Frequency */}
                <div className="p-2.5 bg-[#171929] border border-[#262940] rounded-md space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white text-[11px]">ความถี่ในการบันทึกอัตโนมัติ</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{config.autoSaveIntervalSec} วินาที</span>
                  </div>

                  <div className="grid grid-cols-5 gap-1 pt-1">
                    {[5, 15, 30, 60, 300].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => updateConfig({ autoSaveIntervalSec: sec })}
                        className={`py-1 rounded text-[10px] font-mono font-bold border transition-colors ${
                          config.autoSaveIntervalSec === sec
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                            : 'bg-[#121320] border-[#222436] text-gray-400 hover:text-white'
                        }`}
                      >
                        {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Storage Usage Gauge */}
                <div className="p-2.5 bg-[#171929] border border-[#262940] rounded-md space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-300 flex items-center gap-1.5">
                      <HardDrive size={13} className="text-blue-400" /> พื้นที่ LocalStorage ที่ใช้
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {metrics.usedFormatted} ({metrics.percentUsed}%)
                    </span>
                  </div>

                  <div className="w-full bg-[#0d0e17] h-1.5 rounded-full overflow-hidden border border-[#222436]">
                    <div
                      className={`h-full transition-all ${
                        metrics.percentUsed > 80 ? 'bg-red-500' : metrics.percentUsed > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.max(2, metrics.percentUsed)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[9px] text-gray-400">
                    <span>จุดบันทึกทั้งหมด: {metrics.snapshotCount} จุด</span>
                    <span>ความจุจำลอง: ~5 MB</span>
                  </div>
                </div>

                {/* Create Named Snapshot (Bookmark) */}
                <form onSubmit={handleCreateBookmark} className="p-2.5 bg-[#171929] border border-[#262940] rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-[11px] flex items-center gap-1">
                      <Bookmark size={12} className="text-amber-400" /> มาร์กจุดกู้คืน (Named Bookmark)
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={bookmarkName}
                      onChange={(e) => setBookmarkName(e.target.value)}
                      placeholder="เช่น ก่อนแก้โค้ดครั้งใหญ่, แผนที่ด่าน 1"
                      className="flex-1 px-2.5 py-1.5 bg-[#0f111c] border border-[#2a2d42] rounded text-white text-[11px] placeholder:text-gray-600 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      disabled={!bookmarkName.trim()}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
                    >
                      บันทึก
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: ROLLING CHECKPOINTS HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400">ประวัติบันทึกอัตโนมัติ 8 จุดล่าสุด</span>
                  {snapshots.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Trash2 size={10} /> ล้างประวัติ
                    </button>
                  )}
                </div>

                {snapshots.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Clock size={20} className="mx-auto mb-1 opacity-40" />
                    <p className="text-[11px]">ยังไม่มีประวัติการบันทึก</p>
                  </div>
                ) : (
                  snapshots.map((snap) => (
                    <div
                      key={snap.id}
                      className={`p-2 rounded border transition-colors flex items-center justify-between ${
                        snap.isBookmark
                          ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                          : 'bg-[#151726] border-[#23253a] hover:border-[#3b3e5c]'
                      }`}
                    >
                      <div className="space-y-0.5 max-w-[210px] truncate">
                        <div className="flex items-center gap-1.5">
                          {snap.isBookmark ? (
                            <Bookmark size={11} className="text-amber-400 shrink-0" />
                          ) : (
                            <Clock size={11} className="text-gray-400 shrink-0" />
                          )}
                          <span className="font-bold text-white text-[11px] truncate">
                            {snap.label || snap.activeTool}
                          </span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-[#0d0e17] text-gray-400 font-mono">
                            {snap.trigger}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {snap.formattedTime} • {(snap.sizeBytes / 1024).toFixed(1)} KB
                        </div>
                      </div>

                      <button
                        onClick={() => handleRestore(snap.id, snap.activeTool)}
                        className="px-2 py-1 bg-[#1e2238] hover:bg-[#2b304f] text-emerald-400 hover:text-emerald-300 font-semibold rounded text-[10px] border border-emerald-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                        title="กู้คืนสถานะสตูดิโอกลับมายังจุดนี้"
                      >
                        <RotateCcw size={10} /> ย้อนกลับ
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: BACKUP & JSON PORTABILITY */}
            {activeTab === 'backup' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#171929] border border-[#262940] rounded-md space-y-2">
                  <div className="flex items-center gap-2">
                    <Download size={14} className="text-emerald-400" />
                    <div>
                      <h5 className="font-bold text-white text-[11px]">ส่งออกไฟล์สำรอง (Export JSON)</h5>
                      <p className="text-[10px] text-gray-400">บันทึกโปรเจกต์ โค้ด และการตั้งค่าทั้งหมดเป็นไฟล์ .json</p>
                    </div>
                  </div>

                  <button
                    onClick={handleExport}
                    className="w-full py-1.5 bg-[#1f2238] hover:bg-[#2c304d] text-white font-bold rounded text-[11px] border border-[#3b3f60] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download size={12} /> ดาวน์โหลดไฟล์สำรอง
                  </button>
                </div>

                <div className="p-3 bg-[#171929] border border-[#262940] rounded-md space-y-2">
                  <div className="flex items-center gap-2">
                    <Upload size={14} className="text-blue-400" />
                    <div>
                      <h5 className="font-bold text-white text-[11px]">นำเข้าไฟล์สำรอง (Import JSON)</h5>
                      <p className="text-[10px] text-gray-400">กู้คืนโปรเจกต์จากไฟล์สำรอง .json ที่เคยส่งออกไว้</p>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportFile}
                    accept=".json,application/json"
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold rounded text-[11px] border border-blue-500/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload size={12} /> เลือกไฟล์ JSON นำเข้า
                  </button>

                  {importError && (
                    <div className="p-2 bg-red-950/40 border border-red-500/40 rounded text-red-300 text-[10px]">
                      ❌ {importError}
                    </div>
                  )}

                  {importSuccess && (
                    <div className="p-2 bg-emerald-950/40 border border-emerald-500/40 rounded text-emerald-300 text-[10px]">
                      ✨ {importSuccess}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#0e0f17] border-t border-[#23253a] flex items-center justify-between text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <ShieldCheck size={11} className="text-emerald-400" /> Zero Data Loss Engine
            </span>
            <span>Omni Auto-Save v1.2</span>
          </div>
        </div>
      )}
    </div>
  );
}
