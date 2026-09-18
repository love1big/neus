/**
 * ============================================================================
 * MODULE: SidebarQuickActionsFloatingMenu.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * คอมโพเนนต์เมนูลอย Quick Actions บนแถบด้านข้าง (Sidebar Quick Actions Floating Menu):
 *   - แสดงปุ่มลัดและหน้าต่างป๊อปอัปแสดง 3 เครื่องมือที่ถูกเรียกใช้งานบ่อยที่สุด (Top 3 Most-Used Tools)
 *     ตามบริบทการทำงานใน Workspace
 *   - ช่วยให้ผู้ใช้สามารถสลับการทำงานระหว่างเครื่องมือสำคัญ (Task Switching) ได้รวดเร็วที่สุดเพียงคลิกเดียว
 *   - มีตัวแสดงสถิติการใช้งาน (Usage counter, badge, pin toggling)
 *   - ออกแบบ UI/UX ระดับพรีเมียม สอดรับกับธีมมืดของ OmniEngine IDE พร้อมแอนิเมชันลอยแบบ Non-intrusive
 * 
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - นำเข้าใน:
 *     - `src/components/OmniEngineIDE.tsx`
 * - ใช้งานคู่กับ:
 *     - `src/utils/SidebarQuickActionsNode.ts`
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Zap, Pin, ArrowRight, Activity, Sparkles, X, ChevronRight } from 'lucide-react';
import { sidebarQuickActionsTracker, QuickActionTool } from '../utils/SidebarQuickActionsNode';

interface SidebarQuickActionsFloatingMenuProps {
  allTools: any[];
  activeTool: string;
  onSelectTool: (toolId: string) => void;
  getIconForTool: (iconName: string) => React.ReactNode;
}

export const SidebarQuickActionsFloatingMenu: React.FC<SidebarQuickActionsFloatingMenuProps> = ({
  allTools,
  activeTool,
  onSelectTool,
  getIconForTool,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [topTools, setTopTools] = useState<QuickActionTool[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // อัปเดตรายการเมื่อ component โหลด หรือมีการบันทึกการใช้งานใหม่
  useEffect(() => {
    const updateList = () => {
      const top3 = sidebarQuickActionsTracker.getTopMostUsedTools(allTools, 3);
      setTopTools(top3);
    };

    updateList();
    const unsubscribe = sidebarQuickActionsTracker.subscribe(updateList);
    return () => unsubscribe();
  }, [allTools]);

  // ปิดเมนูเมื่อคลิกนอกพื้นที่
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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

  const handleToolClick = (toolId: string) => {
    sidebarQuickActionsTracker.recordToolUsage(toolId);
    onSelectTool(toolId);
    setIsOpen(false);
  };

  const handleTogglePin = (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    sidebarQuickActionsTracker.togglePin(toolId);
  };

  return (
    <div className="relative flex flex-col items-center w-full px-1" ref={menuRef}>
      {/* Trigger Button บน Sidebar */}
      <button
        type="button"
        id="sidebar-quick-actions-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all duration-200 relative group cursor-pointer border ${
          isOpen
            ? 'bg-gradient-to-br from-amber-500/30 via-purple-600/30 to-blue-600/30 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.35)] scale-105'
            : 'bg-[#1a1b2e] hover:bg-[#25273d] border-[#2a2b3d] hover:border-amber-400/40 text-amber-400 hover:shadow-md'
        }`}
        title="Quick Actions: 3 เครื่องมือที่ใช้บ่อยที่สุด"
      >
        <div className="relative">
          <Zap size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-12 scale-110 text-amber-300' : 'group-hover:scale-110'}`} />
          <span className="absolute -top-1 -right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </div>
        <span className="text-[9px] font-bold tracking-tight text-gray-300 group-hover:text-amber-300 mt-0.5 scale-90">
          Quick
        </span>
      </button>

      {/* Floating Popover Panel */}
      {isOpen && (
        <div className="absolute left-[70px] top-0 z-[100] w-72 bg-[#12131f]/95 backdrop-blur-md border border-[#2a2b3d] rounded-xl shadow-2xl p-3 animate-in fade-in slide-in-from-left-2 duration-150 text-white">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#2a2b3d]/70 mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Quick Actions</h4>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Top 3 Context
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#25273d] transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 mb-2.5">
            เครื่องมือที่เรียกใช้งานบ่อยที่สุดในบริบทปัจจุบัน สลับการทำงานได้ทันที:
          </p>

          {/* List of Top 3 Tools */}
          <div className="flex flex-col gap-1.5">
            {topTools.map((tool, index) => {
              const isActive = activeTool === tool.id;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-blue-600/20 border-blue-500/50 shadow-inner'
                      : 'bg-[#18192a] hover:bg-[#202238] border-[#2a2b3d] hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-bold font-mono w-4 text-center text-amber-400/80 group-hover:text-amber-300">
                      #{index + 1}
                    </span>
                    <div className="w-7 h-7 rounded bg-[#0d0e17] flex items-center justify-center shrink-0 border border-[#2a2b3d]">
                      {tool.iconNode || (tool.iconName ? getIconForTool(tool.iconName) : <Activity size={14} className="text-blue-400" />)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-gray-200 group-hover:text-white truncate">
                        {tool.label}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        ใช้งาน {tool.count} ครั้ง
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleTogglePin(e, tool.id)}
                      className={`p-1 rounded transition-colors ${
                        tool.pinned
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100'
                      }`}
                      title={tool.pinned ? 'ถอนหมุด' : 'ปักหมุดเป็นเครื่องมือประจำ'}
                    >
                      <Pin size={12} className={tool.pinned ? 'fill-amber-400' : ''} />
                    </button>
                    <ChevronRight size={13} className="text-gray-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-2.5 pt-2 border-t border-[#2a2b3d]/60 flex items-center justify-between text-[9px] text-gray-400">
            <span>บันทึกความถี่อัตโนมัติ</span>
            <span className="text-amber-400 font-mono">0ms Instant Switch</span>
          </div>
        </div>
      )}
    </div>
  );
};
