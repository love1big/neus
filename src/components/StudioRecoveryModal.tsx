/**
 * ============================================================================
 * STUDIO RECOVERY MODAL (หน้าต่างแจ้งเตือนและกู้คืนข้อมูลกรณีเซสชันปิดผิดปกติหรือแอป Crash)
 * ============================================================================
 * 
 * 1. MODULE PURPOSE & RESPONSIBILITY (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูล)
 * ----------------------------------------------------------------------------
 * โมดอลนี้ทำหน้าที่เป็น Safety Net กรณีที่ผู้ใช้ปิดแท็บโดยไม่ได้ตั้งใจ, ไฟดับ, หรือบราวเซอร์ Crash:
 *  - ตรวจจับว่าเซสชันก่อนหน้าไม่ได้ปิดแบบ Clean Exit หรือมี Snapshot ล่าสุดที่ยังไม่ได้นำไปใช้
 *  - แสดงหน้าต่างแจ้งเตือนที่ชัดเจน สุภาพ และปลอดภัย (Non-destructive)
 *  - แสดงรายละเอียดเครื่องมือ (Active Tool) และเวลาที่บันทึกก่อนหน้า
 *  - ให้ตัวเลือก:
 *    1. "กู้คืนสถานะสตูดิโอ (Restore Session)" : โหลดเครื่องมือและคอนฟิกกลับมาทันที
 *    2. "เริ่มต้นเซสชันใหม่ (Start Fresh)" : ปิดแจ้งเตือนและใช้ค่าเริ่มต้น
 * 
 * 2. ARCHITECTURE & SYSTEM INTEGRATION (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น)
 * ----------------------------------------------------------------------------
 *  - ผสานกับ `GlobalStudioAutoSaveManager` และ `useStudioAutoSave`
 *  - เรนเดอร์เป็น Top-level Modal ใน `App.tsx`
 *  - ส่ง Event แจ้งเตือนผ่าน NotificationSystem
 * 
 * 3. INPUTS, OUTPUTS & DATA CONTRACTS (พารามิเตอร์ Input / Output ที่รับส่ง)
 * ----------------------------------------------------------------------------
 *  - Props:
 *    - `isOpen: boolean`
 *    - `crashInfo: { lastState: StudioAutoSaveState | null; timeAgoText: string } | null`
 *    - `onRestore: () => void`
 *    - `onDismiss: () => void`
 * 
 * 4. ERROR HANDLING & FALLBACKS (การจัดการข้อผิดพลาดและ Edge Cases)
 * ----------------------------------------------------------------------------
 *  - หากข้อมูล State เสียหาย จะมีปุ่มเริ่มใหม่เสมอ ป้องกัน Modal ติดค้าง
 * 
 * 5. USAGE EXAMPLE (ตัวอย่างการเรียกใช้งาน)
 * ----------------------------------------------------------------------------
 *  ```tsx
 *  <StudioRecoveryModal
 *    isOpen={hasCrashRecovery}
 *    crashInfo={crashInfo}
 *    onRestore={() => restoreSnapshot(latestId)}
 *    onDismiss={dismissCrashRecovery}
 *  />
 *  ```
 * ============================================================================
 */

import React from 'react';
import {
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Clock,
  LayoutDashboard,
  CheckCircle,
  X,
  HardDrive,
  Cpu
} from 'lucide-react';
import { StudioAutoSaveState } from '../utils/GlobalStudioAutoSaveManager';

interface StudioRecoveryModalProps {
  isOpen: boolean;
  crashInfo: {
    lastState: StudioAutoSaveState | null;
    timeAgoText: string;
  } | null;
  onRestore: () => void;
  onDismiss: () => void;
}

export default function StudioRecoveryModal({
  isOpen,
  crashInfo,
  onRestore,
  onDismiss
}: StudioRecoveryModalProps) {
  if (!isOpen || !crashInfo || !crashInfo.lastState) {
    return null;
  }

  const lastState = crashInfo.lastState;
  const toolName = lastState.activeTool || 'OmniCreatorMaster';
  const timeText = crashInfo.timeAgoText || 'เซสชันก่อนหน้า';
  const sizeBytes = lastState.sessionMetadata?.totalDataSizeBytes || 0;
  const sizeText = sizeBytes > 0 ? `${(sizeBytes / 1024).toFixed(1)} KB` : 'สมบูรณ์';

  return (
    <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#121422] border border-amber-500/40 rounded-xl shadow-2xl overflow-hidden font-sans text-gray-200">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-amber-950/40 via-[#1a1b2d] to-[#121422] border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/40 rounded-lg text-amber-400">
              <ShieldAlert size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                ตรวจพบเซสชันก่อนหน้า (Session Recovery)
              </h3>
              <p className="text-xs text-amber-300/80">ระบบ Auto-Save ปกป้องข้อมูลของคุณไว้โดยอัตโนมัติ</p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#25283d] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-300 leading-relaxed">
            เบราว์เซอร์ของคุณอาจถูกปิดกะทันหัน หรือมีงานที่ยังไม่ได้บันทึกจากเซสชันก่อนหน้า
            ระบบได้สำรองสถานะเครื่องมือและการตั้งค่าไว้ในเครื่องของคุณเรียบร้อยแล้ว:
          </p>

          <div className="p-3.5 bg-[#17192b] border border-[#2c2f4a] rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <LayoutDashboard size={14} className="text-[#58a6ff]" /> เครื่องมือที่เปิดอยู่ล่าสุด:
              </span>
              <span className="text-xs font-bold text-white font-mono px-2 py-0.5 rounded bg-[#0d0e1a] border border-[#2a2d46]">
                {toolName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <Clock size={14} className="text-amber-400" /> บันทึกล่าสุดเมื่อ:
              </span>
              <span className="text-xs font-mono text-amber-300">{timeText}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <HardDrive size={14} className="text-emerald-400" /> ขนาดข้อมูล Snapshot:
              </span>
              <span className="text-xs font-mono text-emerald-300">{sizeText}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg flex items-start gap-2.5">
            <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-emerald-300 leading-normal">
              การกด <strong>"กู้คืนเซสชัน"</strong> จะเปิดเครื่องมือ <strong>{toolName}</strong> พร้อมโหลดบัฟเฟอร์งานและการตั้งค่าที่คุณทำค้างไว้ทันที
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#0d0e17] border-t border-[#23253a] flex items-center justify-end gap-2.5">
          <button
            onClick={onDismiss}
            className="px-4 py-2 bg-[#1a1c2e] hover:bg-[#25283f] text-gray-300 hover:text-white font-medium rounded-lg text-xs transition-colors cursor-pointer border border-[#2e314e]"
          >
            เริ่มเซสชันใหม่ (Start Fresh)
          </button>

          <button
            onClick={onRestore}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer border border-emerald-400/40"
          >
            <RotateCcw size={14} /> กู้คืนเซสชันและงานที่ค้างไว้
          </button>
        </div>
      </div>
    </div>
  );
}
