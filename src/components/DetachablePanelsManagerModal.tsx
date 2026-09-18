/**
 * ============================================================================
 * MODULE: DetachablePanelsManagerModal.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * หน้าต่างโมดอลศูนย์ควบคุมแผงหน้าต่างแยกทั้งหมด (Multi-Monitor Panel Manager)
 * ช่วยให้นักพัฒนาเกมและวิศวกรซอฟต์แวร์สามารถ:
 *   - ดูภาพรวมของหน้าต่างที่ถูกแยกออกไปบนจอมอนิเตอร์ต่างๆ ได้ในที่เดียว
 *   - สั่ง Focus นำหน้าต่างที่ซ่อนอยู่หลังโปรแกรมอื่นขึ้นมาด้านหน้า
 *   - สั่ง Re-attach ดึงโมดูลกลับมาทีละตัว หรือสั่ง "นำกลับเข้าจอหลักทั้งหมด (Re-attach All)"
 *   - แนะนำ Presets สำหรับ Multi-Monitor Workspace (เช่น จอ 1 เขียนโค้ด, จอ 2 พรีวิว 3D, จอ 3 มิกซ์เสียง)
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Connected with: `OmniDetachablePanelManager.ts`, `OmniEngineIDE.tsx`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  ExternalLink, 
  ArrowDownLeft, 
  Eye, 
  Layers, 
  X, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  LayoutDashboard, 
  Code2, 
  Box, 
  Disc, 
  Scale, 
  Gamepad2,
  Tv
} from 'lucide-react';
import { omniDetachablePanelManager } from '../utils/OmniDetachablePanelManager';
import { DetachedModuleMetadata } from '../types/detachablePanelTypes';
import { LOCKED_OMNI_ENGINE_NAME } from '../utils/OmniDigitalForensicWatermarkEngine';

interface DetachablePanelsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetachModule?: (moduleId: string, title: string) => void;
  tools?: any[];
}

export const DetachablePanelsManagerModal: React.FC<DetachablePanelsManagerModalProps> = ({
  isOpen,
  onClose,
  onDetachModule,
  tools = []
}) => {
  const [detachedList, setDetachedList] = useState<DetachedModuleMetadata[]>(
    omniDetachablePanelManager.getAllDetached()
  );

  useEffect(() => {
    return omniDetachablePanelManager.subscribe((list) => {
      setDetachedList(list);
    });
  }, []);

  if (!isOpen) return null;

  const popularDetachPresets = [
    { id: 'Viewport3D', title: '3D Viewport (เอนจินเรนเดอร์ 3D)', icon: <Box size={15} className="text-[#58a6ff]" /> },
    { id: 'OmniSoftwareIDEStudio', title: 'IDE Studio (ตัวเขียนโค้ดและคอมไพเลอร์)', icon: <Code2 size={15} className="text-[#ff7b72]" /> },
    { id: 'OmniMusicVocalDAWStudio', title: 'Audio DAW Studio (สตูดิโอเสียงดนตรี)', icon: <Disc size={15} className="text-amber-400" /> },
    { id: 'OmniForensicLegalVerificationStudio', title: 'Forensic Legal Hub (ตรวจสอบสิทธิ์)', icon: <Scale size={15} className="text-emerald-400" /> },
    { id: 'OmniGameCreationStudio', title: 'Game Creation Studio (ทดสอบเกมสด)', icon: <Gamepad2 size={15} className="text-purple-400" /> }
  ];

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#161b22] border-2 border-[#30363d] rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
              <Monitor size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ศูนย์จัดการหน้าต่างแยก Multi-Monitor (Detachable Panels Manager)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                ขับเคลื่อนด้วย React Portal ภายใต้ {LOCKED_OMNI_ENGINE_NAME}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-200">
          
          {/* Active Detached Panels Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-300 flex items-center gap-2">
                <Layers size={14} className="text-blue-400" />
                โมดูลที่กำลังแยกแสดงผลอยู่ขณะนี้ ({detachedList.length} รายการ):
              </span>

              {detachedList.length > 0 && (
                <button
                  type="button"
                  onClick={() => omniDetachablePanelManager.reattachAll()}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-colors font-semibold"
                >
                  <RotateCcw size={12} />
                  นำกลับเข้าจอหลักทั้งหมด (Re-attach All)
                </button>
              )}
            </div>

            {detachedList.length === 0 ? (
              <div className="p-8 text-center bg-[#0d1117] border border-[#21262d] rounded-xl space-y-2 text-gray-400">
                <Tv size={32} className="mx-auto text-gray-500 opacity-60" />
                <p className="text-xs font-semibold text-gray-300">
                  ขณะนี้ไม่มีโมดูลใดถูกแยกออกไปสู่หน้าต่างภายนอก
                </p>
                <p className="text-[11px] max-w-sm mx-auto">
                  คุณสามารถกดปุ่ม "แยกหน้าต่าง" ที่หัวข้อโมดูลใดก็ได้ หรือเลือกแยกโมดูลยอดนิยมด้านล่างเพื่อกระจายงานไปยังหน้าจออื่น
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {detachedList.map((panel) => (
                  <div 
                    key={panel.id}
                    className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-blue-500/50 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <div>
                        <h4 className="font-bold text-white text-xs">{panel.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono mt-0.5">
                          <span>ID: {panel.id}</span>
                          <span>•</span>
                          <span className="text-blue-300">{panel.displayMode === 'native_window' ? 'Native Window' : 'In-App Floating'}</span>
                          <span>•</span>
                          <span>แยกเมื่อ: {new Date(panel.detachedAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => omniDetachablePanelManager.focusWindow(panel.id)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-[#21262d] text-gray-300 hover:text-white hover:bg-[#30363d] border border-[#30363d] flex items-center gap-1.5 transition-colors"
                      >
                        <Eye size={12} className="text-blue-400" />
                        โฟกัสหน้าต่าง
                      </button>
                      <button
                        type="button"
                        onClick={() => omniDetachablePanelManager.reattachModule(panel.id)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 flex items-center gap-1.5 transition-colors font-semibold"
                      >
                        <ArrowDownLeft size={12} />
                        นำกลับเข้าจอหลัก
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Detach Recommendation Presets */}
          <div className="space-y-3 pt-4 border-t border-[#30363d]">
            <span className="font-semibold text-gray-300 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              โมดูลสตูดิโอยอดนิยมสำหรับแยกจอทำงาน (Recommended Multi-Monitor Modules):
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {popularDetachPresets.map((preset) => {
                const isCurrentlyDetached = omniDetachablePanelManager.isDetached(preset.id);
                return (
                  <div
                    key={preset.id}
                    className="p-3 rounded-xl bg-[#0d1117] border border-[#21262d] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {preset.icon}
                      <span className="font-semibold text-gray-200">{preset.title}</span>
                    </div>

                    {isCurrentlyDetached ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                        แยกอยู่แล้ว
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (onDetachModule) {
                            onDetachModule(preset.id, preset.title);
                            onClose();
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-gray-300 hover:text-white border border-[#30363d] flex items-center gap-1 transition-colors text-[11px]"
                      >
                        <ExternalLink size={11} />
                        แยกออกจอใหม่
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pro Tips */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1.5 text-[11px] text-gray-300">
            <span className="font-bold text-blue-300 flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              คำแนะนำสำหรับนักพัฒนา (Multi-Monitor Pro Tips):
            </span>
            <p className="leading-relaxed text-gray-400">
              ทุกหน้าต่างที่แยกออกไปด้วยระบบ React Portal จะใช้หน่วยความจำและตัวแปรสถานะชุดเดียวกับโปรแกรมหลักแบบ Real-time โดยไม่สูญเสียความเร็วและไม่กระตุก คุณสามารถจัดวางหน้าต่างบนหลายหน้าจอพร้อมกันได้อย่างไร้ขีดจำกัด
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#21262d] hover:bg-[#30363d] text-gray-200 hover:text-white border border-[#30363d] transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetachablePanelsManagerModal;
