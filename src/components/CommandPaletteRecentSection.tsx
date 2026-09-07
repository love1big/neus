/**
 * @file CommandPaletteRecentSection.tsx
 * @description
 * ============================================================================
 * [THAI]
 * โมดูลส่วนแสดงรายการเซสชันล่าสุดแบบด่วน (Quick Recent Sessions Section)
 * สำหรับ CommandPalette แสดงประวัติการทำงาน 5 ล่าสุดจาก RecentFilesTracker
 * พร้อมคีย์ลัดตัวเลข [1] - [5] ช่วยให้ผู้ใช้งานสามารถกระโดดกลับไปยังเซสชัน
 * ก่อนหน้าได้ทันทีเพียงกดปุ่มเดียว รองรับการปักหมุด (Pin), ลบรายการ, และแสดงเวลาสัมพัทธ์
 *
 * [ENGLISH]
 * Enterprise Quick Recent Sessions Module for the Studio Command Palette.
 * Renders the persistent last 5 sessions tracked by RecentFilesTracker.
 * Features 1-keystroke jump hotkeys ([1] through [5]), type badge indicators,
 * live relative timestamps, pinning mechanisms, and smooth selection states.
 * ============================================================================
 *
 * 1. MODULE PURPOSE & RESPONSIBILITY:
 *    - Extract and visually render the 5 most recent sessions from RecentFilesTracker.
 *    - Provide instantaneous single-click and numerical key navigation.
 *    - Maintain high-contrast AAA dark IDE styling with tactile interaction feedback.
 *
 * 2. ARCHITECTURE & SYSTEM INTEGRATION:
 *    - Integrates with: CommandPalette.tsx, RecentFilesTracker.ts, App.tsx.
 *    - Reactive to: localStorage updates and 'recent-files-updated' custom events.
 *
 * 3. DATA CONTRACTS:
 *    - Inputs:
 *        - `recentSessions: RecentFileItem[]` (the 5 active recent sessions)
 *        - `selectedIndex: number` (currently highlighted item index)
 *        - `onSelectSession: (item: RecentFileItem) => void` (jump callback)
 *        - `onTogglePin?: (id: string) => void`
 *        - `onRemove?: (id: string) => void`
 *        - `isFocusedSection?: boolean`
 *    - Outputs:
 *        - Dispatches session activation and pin/unpin persistence updates.
 *
 * 4. ERROR HANDLING & FALLBACKS:
 *    - Gracefully handles empty lists with a reassuring placeholder and default recovery.
 *    - Guards against missing timestamps, null ids, or invalid category metadata.
 *
 * 5. USAGE EXAMPLE:
 *    ```tsx
 *    import CommandPaletteRecentSection from './CommandPaletteRecentSection';
 *
 *    <CommandPaletteRecentSection
 *      recentSessions={recentItems.slice(0, 5)}
 *      selectedIndex={selectedIndex}
 *      onSelectSession={(session) => handleJump(session)}
 *    />
 *    ```
 */

import React from 'react';
import {
  Clock,
  Pin,
  Trash2,
  CornerDownLeft,
  Box,
  Image as ImageIcon,
  Music,
  Palette,
  Layers,
  Cpu,
  FileCode,
  FileText,
  Sparkles,
  Zap,
  Bookmark
} from 'lucide-react';
import { RecentFileItem, RecentItemType, RecentFilesTracker } from '../utils/RecentFilesTracker';

export interface CommandPaletteRecentSectionProps {
  recentSessions: RecentFileItem[];
  selectedIndex: number;
  onSelectSession: (item: RecentFileItem) => void;
  onTogglePin?: (id: string) => void;
  onRemove?: (id: string) => void;
  isFocusedSection?: boolean;
  compact?: boolean;
}

/**
 * Returns a typed icon based on asset or component type
 */
const getItemIcon = (type: RecentItemType) => {
  switch (type) {
    case 'code':
      return <FileCode size={14} className="text-[#38bdf8]" />;
    case 'blueprint':
      return <Layers size={14} className="text-[#818cf8]" />;
    case 'mesh':
      return <Box size={14} className="text-[#10b981]" />;
    case 'texture':
      return <ImageIcon size={14} className="text-[#f59e0b]" />;
    case 'audio':
      return <Music size={14} className="text-[#ec4899]" />;
    case 'level':
      return <Palette size={14} className="text-[#a855f7]" />;
    case 'component':
      return <Cpu size={14} className="text-[#06b6d4]" />;
    case 'subtool':
      return <Sparkles size={14} className="text-[#eab308]" />;
    default:
      return <FileText size={14} className="text-[#94a3b8]" />;
  }
};

/**
 * Quick Recent Sessions List & Cards Component for Command Palette
 */
export const CommandPaletteRecentSection: React.FC<CommandPaletteRecentSectionProps> = ({
  recentSessions,
  selectedIndex,
  onSelectSession,
  onTogglePin,
  onRemove,
  isFocusedSection = false,
  compact = false
}) => {
  if (!recentSessions || recentSessions.length === 0) {
    return (
      <div className="py-6 px-4 text-center rounded-xl bg-[#0d1117]/60 border border-[#21262d] my-1">
        <Clock size={20} className="text-[#8b949e] mx-auto mb-2 opacity-50" />
        <p className="text-xs text-[#8b949e]">No recent sessions recorded yet</p>
        <span className="text-[10px] text-[#6e7681] block mt-1 font-mono">
          Opened tools and assets will automatically appear here
        </span>
      </div>
    );
  }

  // Display max 5 items for the "Last 5 Sessions" contract
  const displayItems = recentSessions.slice(0, 5);

  return (
    <div className="w-full space-y-1.5 mb-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono tracking-wider text-[#8b949e] uppercase">
        <div className="flex items-center gap-1.5 font-semibold text-[#58a6ff]">
          <Zap size={13} className="text-[#f59e0b] fill-[#f59e0b]/20" />
          <span>Quick Recent (Last {displayItems.length} Sessions)</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#8b949e]">
          <span className="hidden sm:inline">Press</span>
          <span className="px-1.5 py-0.5 rounded bg-[#21262d] text-[#c9d1d9] border border-[#30363d] font-bold">
            1 - 5
          </span>
          <span className="hidden sm:inline">to instant jump</span>
        </div>
      </div>

      {/* Grid of Quick Cards or List Rows */}
      <div className="grid grid-cols-1 gap-1">
        {displayItems.map((item, idx) => {
          const isSelected = isFocusedSection && idx === selectedIndex;
          const hotkeyNumber = idx + 1;
          const timeAgo = RecentFilesTracker.formatTimeAgo(item.timestamp);

          return (
            <div
              key={item.id + '-' + idx}
              id={`recent-session-item-${idx}`}
              onClick={() => onSelectSession(item)}
              className={`group relative flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer border select-none ${
                isSelected
                  ? 'bg-[#1f6feb]/20 border-[#38bdf8]/60 shadow-[0_0_15px_rgba(56,189,248,0.15)] ring-1 ring-[#38bdf8]/30'
                  : 'bg-[#161b22]/70 hover:bg-[#1f242c] border-[#21262d] hover:border-[#30363d]'
              }`}
            >
              {/* Left Side: Number Hotkey + Icon + Info */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* Hotkey Badge [1] - [5] */}
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[11px] font-bold shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#38bdf8] text-[#0d1117] shadow-sm'
                      : 'bg-[#0d1117] text-[#8b949e] border border-[#30363d] group-hover:text-white group-hover:border-[#58a6ff]'
                  }`}
                  title={`Press '${hotkeyNumber}' or Alt+${hotkeyNumber} to jump`}
                >
                  {hotkeyNumber}
                </div>

                {/* Type Icon */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected
                      ? 'bg-[#0d1117] border-[#38bdf8]/40 shadow-inner'
                      : 'bg-[#0d1117]/80 border-[#21262d] group-hover:border-[#30363d]'
                  }`}
                >
                  {getItemIcon(item.type)}
                </div>

                {/* Text Metadata */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-white' : 'text-[#c9d1d9] group-hover:text-white'
                      }`}
                    >
                      {item.name || item.id}
                    </span>
                    {item.pinned && (
                      <Bookmark size={11} className="text-[#f59e0b] fill-[#f59e0b] shrink-0" />
                    )}
                    {item.category && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#0d1117] text-[#8b949e] border border-[#21262d] shrink-0 truncate max-w-[120px]">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#8b949e] font-mono mt-0.5">
                    <span className="truncate max-w-[200px]">
                      {item.path || `/${item.id}`}
                    </span>
                    <span>•</span>
                    <span className="text-[#6e7681] flex items-center gap-1 shrink-0">
                      <Clock size={10} />
                      {timeAgo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Quick Action Buttons & Jump Indicator */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {/* Pin Button */}
                {onTogglePin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(item.id);
                    }}
                    className={`p-1.5 rounded-lg text-[#8b949e] hover:text-white transition-colors ${
                      item.pinned
                        ? 'text-[#f59e0b] bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20'
                        : 'hover:bg-[#21262d] opacity-0 group-hover:opacity-100'
                    }`}
                    title={item.pinned ? 'Unpin session' : 'Pin to top'}
                  >
                    <Pin size={12} className={item.pinned ? 'fill-[#f59e0b]' : ''} />
                  </button>
                )}

                {/* Remove Button */}
                {onRemove && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.id);
                    }}
                    className="p-1.5 rounded-lg text-[#8b949e] hover:text-[#f85149] hover:bg-[#f85149]/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from recent history"
                  >
                    <Trash2 size={12} />
                  </button>
                )}

                {/* Jump Status Badge */}
                <div
                  className={`flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-md border transition-all ${
                    isSelected
                      ? 'bg-[#38bdf8]/20 border-[#38bdf8]/50 text-[#38bdf8]'
                      : 'bg-[#0d1117] border-[#21262d] text-[#8b949e] group-hover:text-[#c9d1d9] group-hover:border-[#30363d]'
                  }`}
                >
                  <span className="hidden sm:inline">Jump</span>
                  <CornerDownLeft size={11} className={isSelected ? 'text-[#38bdf8]' : ''} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommandPaletteRecentSection;
