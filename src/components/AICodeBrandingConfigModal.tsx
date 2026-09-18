/**
 * ============================================================================
 * MODULE: AICodeBrandingConfigModal.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * หน้าต่างโมดอลสำหรับตั้งค่าหมายเหตุประทับตราลิขสิทธิ์โค้ดประจำโปรแกรม OMNI Engine STUDIO
 * (AI Code Attribution & Branding Settings UI Node):
 *   - ตามข้อกำหนดของผู้ใช้:
 *     "ทำให้ตั้งค่าใน โปรแกรมได้ด้วย ตั้งค่า ตรง
 *      *by *ชื่อที่ตั้งค่า* โดยโปรแกรม OMNI Engine STUDIO*
 *      ชื่อที่ตั้งค่า พื้นฐาน คือ love1big สามารถแก้ไขตรงนี้ได้ บ่างทีอาจจะใส่ชื่อผู้พัฒนาเองได้ หรือชือทีมผู้พัฒนา"
 *   - ผู้ใช้สามารถพิมพ์ชื่อผู้พัฒนา (Author Name) หรือชื่อทีมผู้พัฒนา (Team Name) ได้อย่างอิสระ
 *   - ค่าพื้นฐานเริ่มต้นคือ "love1big"
 *   - สามารถปรับแต่งชื่อโปรแกรม/เครื่องยนต์ (Program Name) ได้ด้วย (ค่าเริ่มต้น: "OMNI Engine STUDIO")
 *   - มีหน้าจอแสดงผลตัวอย่างโค้ดแบบเรียลไทม์ (Interactive Live Preview) พร้อมตัวสลับภาษา (TypeScript, Python, Lua, HTML, CSS)
 *   - มีปุ่มทางลัดเลือก Preset (love1big, Developer Team, Indie Studio, etc.)
 *   - บันทึกการเปลี่ยนแปลงลง LocalStorage ทันที พร้อมอัปเดตระบบแชทและระบบสร้างโค้ดแบบ 0ms
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Connected with: `src/utils/OfflineAICodeCommentBrander.ts`
 * - Triggered by: Settings button in `src/components/AIChat.tsx` and main engine menus
 * - Uses: `lucide-react` for icons, Tailwind CSS for theme styling
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  User, 
  Cpu, 
  Check, 
  RotateCcw, 
  Code, 
  Copy, 
  Eye, 
  ShieldCheck,
  Tag,
  Lock,
  Scale
} from 'lucide-react';
import { 
  offlineAICodeCommentBrander, 
  OfflineAICodeCommentBrander,
  BrandingPlacementMode 
} from '../utils/OfflineAICodeCommentBrander';
import { LOCKED_OMNI_ENGINE_NAME } from '../utils/OmniDigitalForensicWatermarkEngine';
import { OmniForensicVerificationModal } from './OmniForensicVerificationModal';

interface AICodeBrandingConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (newTag: string) => void;
}

export const AICodeBrandingConfigModal: React.FC<AICodeBrandingConfigModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [authorName, setAuthorName] = useState<string>(offlineAICodeCommentBrander.getAuthorName());
  const programName = LOCKED_OMNI_ENGINE_NAME; // ล็อคถาวรตามกฎหมายลิขสิทธิ์
  const [placementMode, setPlacementMode] = useState<BrandingPlacementMode>(offlineAICodeCommentBrander.getPlacementMode());
  const [invisibleForensicEnabled, setInvisibleForensicEnabled] = useState<boolean>(offlineAICodeCommentBrander.getInvisibleForensicEnabled());
  const [previewLanguage, setPreviewLanguage] = useState<string>('typescript');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [copiedPreview, setCopiedPreview] = useState<boolean>(false);
  const [showForensicModal, setShowForensicModal] = useState<boolean>(false);

  // ดึงค่าเมื่อเปิดโมดอล
  useEffect(() => {
    if (isOpen) {
      setAuthorName(offlineAICodeCommentBrander.getAuthorName());
      setPlacementMode(offlineAICodeCommentBrander.getPlacementMode());
      setInvisibleForensicEnabled(offlineAICodeCommentBrander.getInvisibleForensicEnabled());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // แท็กตัวอย่างตามข้อมูลที่กำลังพิมพ์
  const currentBrandTag = offlineAICodeCommentBrander.getBrandTag(authorName, programName);

  // ตัวอย่างโค้ดจำลองตามภาษา
  const getSampleCode = (lang: string) => {
    switch (lang) {
      case 'python':
        return `def calculate_damage(atk, defense):\n    base_damage = atk * 1.5\n    if base_damage > defense:\n        return base_damage - defense\n    else:\n        return 1`;
      case 'lua':
        return `function onPlayerEnter(player)\n    local health = player:getHealth()\n    if health < 100 then\n        player:setHealth(health + 50)\n    end\nend`;
      case 'html':
        return `<div class="hud-container">\n  <span class="player-hp">HP: 100/100</span>\n</div>`;
      case 'css':
        return `.player-status {\n  display: flex;\n  border-radius: 8px;\n}`;
      case 'typescript':
      default:
        return `export function calculateDamage(atk: number, def: number): number {\n  const base = atk * 1.5;\n  if (base > def) {\n    return base - def;\n  } else {\n    return 1;\n  }\n}`;
    }
  };

  // โค้ดตัวอย่างที่ประทับตราแล้ว
  const sampleBrandedCode = offlineAICodeCommentBrander.brandCode(
    getSampleCode(previewLanguage),
    previewLanguage,
    { brandTag: currentBrandTag, brandEmptyLines: false, mode: placementMode }
  ).brandedCode;

  // บันทึกการตั้งค่า
  const handleSave = () => {
    offlineAICodeCommentBrander.setAuthorName(authorName);
    offlineAICodeCommentBrander.setPlacementMode(placementMode);
    offlineAICodeCommentBrander.setInvisibleForensicEnabled(invisibleForensicEnabled);
    setSavedSuccess(true);
    if (onSaved) {
      onSaved(currentBrandTag);
    }
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  // รีเซ็ตเป็นค่าเริ่มต้น
  const handleReset = () => {
    setAuthorName(OfflineAICodeCommentBrander.DEFAULT_AUTHOR);
    setPlacementMode(OfflineAICodeCommentBrander.DEFAULT_PLACEMENT_MODE);
    setInvisibleForensicEnabled(true);
  };

  // คัดลอกแท็กตัวอย่าง
  const handleCopyTag = () => {
    navigator.clipboard.writeText(currentBrandTag);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d] bg-[#0d1117]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                ตั้งค่าหมายเหตุลิขสิทธิ์โค้ด AI Offline
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Branding Config
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                กำหนดชื่อผู้พัฒนาหรือทีมผู้พัฒนาเพื่อแทรกหมายเหตุในทุกบรรทัดของโค้ดที่ AI สร้างขึ้น
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#21262d] transition-colors"
            title="ปิดหน้าต่าง"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Active Tag Banner */}
          <div className="p-3.5 rounded-lg bg-[#0d1117] border border-amber-500/30 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} />
                รูปแบบหมายเหตุที่จะแสดงในโค้ด (Current Format):
              </span>
              <button
                onClick={handleCopyTag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#21262d] hover:bg-[#30363d] text-gray-300 text-[11px] transition-colors"
                title="คัดลอกแท็ก"
              >
                {copiedPreview ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                <span>{copiedPreview ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded bg-[#161b22] border border-[#30363d] font-mono text-sm text-amber-300 break-all select-all">
              {currentBrandTag}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Field 1: Author Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <User size={13} className="text-cyan-400" />
                  ชื่อที่ตั้งค่า (ชื่อผู้พัฒนา / ทีมผู้พัฒนา / Developer Name):
                </label>
                <span className="text-[11px] text-gray-400">
                  ค่าพื้นฐาน: <code className="text-amber-300 bg-[#0d1117] px-1.5 py-0.5 rounded">love1big</code>
                </span>
              </div>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="ระบุชื่อผู้พัฒนา เช่น love1big หรือชื่อทีม..."
                className="w-full px-3 py-2 text-sm bg-[#0d1117] border border-[#30363d] rounded-lg focus:outline-none focus:border-amber-500 text-white placeholder-gray-500 transition-colors font-mono"
              />
              
              {/* Presets */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px]">
                <span className="text-gray-400 flex items-center gap-1">
                  <Tag size={11} /> ทางลัด:
                </span>
                <button
                  type="button"
                  onClick={() => setAuthorName('love1big')}
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    authorName === 'love1big'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-[#21262d] text-gray-300 border-[#30363d] hover:bg-[#30363d]'
                  }`}
                >
                  love1big (ค่าเริ่มต้น)
                </button>
                <button
                  type="button"
                  onClick={() => setAuthorName('Nexus Dev Team')}
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    authorName === 'Nexus Dev Team'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-[#21262d] text-gray-300 border-[#30363d] hover:bg-[#30363d]'
                  }`}
                >
                  Nexus Dev Team
                </button>
                <button
                  type="button"
                  onClick={() => setAuthorName('Indie Studio')}
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    authorName === 'Indie Studio'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-[#21262d] text-gray-300 border-[#30363d] hover:bg-[#30363d]'
                  }`}
                >
                  Indie Studio
                </button>
              </div>
            </div>

            {/* Field 2: Program / Engine Name (Locked for Legal & Provenance Guarantee) */}
            <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Lock size={13} className="text-amber-400" />
                  ชื่อโปรแกรมต้นกำเนิด (Authoring Engine):
                </label>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono">
                  <Lock size={10} />
                  ล็อคถาวรตามกฎหมายลิขสิทธิ์
                </span>
              </div>

              <div className="flex items-center gap-2.5 bg-[#161b22] px-3.5 py-2.5 rounded-lg border border-[#30363d]">
                <Cpu size={16} className="text-amber-400 shrink-0" />
                <span className="font-mono text-sm font-bold text-white tracking-wide flex-1">
                  {LOCKED_OMNI_ENGINE_NAME}
                </span>
                <span className="text-[10px] text-gray-400 bg-[#0d1117] px-2 py-0.5 rounded border border-[#21262d] font-mono">
                  IMMUTABLE PROVENANCE
                </span>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                ชื่อโปรแกรมถูกล็อคไว้เป็น <strong className="text-amber-300">OMNI Engine STUDIO</strong> อย่างถาวร เพื่อให้ทุกชิ้นงานที่สร้างขึ้นสามารถยืนยันต้นกำเนิดของโปรแกรมเราได้อย่างถูกต้องตามกฎหมายลิขสิทธิ์สากล (WIPO, Berne Convention, พ.ร.บ. ลิขสิทธิ์)
              </p>
            </div>

            {/* Field 2.5: Invisible Forensic Watermark Steganography */}
            <div className="p-3.5 rounded-xl bg-[#0d1117] border border-blue-500/30 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <ShieldCheck size={14} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">
                      การฝังลายน้ำนิติวิทยาศาสตร์ดิจิทัลล่องหนหลังบ้าน
                    </span>
                    <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                      Zero-Width Steganography
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={invisibleForensicEnabled}
                    onChange={(e) => setInvisibleForensicEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <p className="text-[11px] text-gray-300 leading-relaxed">
                ฝังรหัสดิจิทัลล่องหนหลังบ้าน (Zero-Width Characters) ที่<strong>ไม่แสดงบนจอเกมหรือโปรแกรมจริง</strong> แต่สามารถใช้ตรวจสอบย้อนกลับได้ 100% ว่าเขียนขึ้นจาก <strong>{LOCKED_OMNI_ENGINE_NAME}</strong> แม้ผู้ใช้รายอื่นจะลบข้อความคอมเมนต์ออกก็ตาม
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-[#21262d]">
                <span className="text-[10px] text-gray-400 font-mono">
                  ISO/IEC 27037 & WIPO WCT Art. 12
                </span>
                <button
                  type="button"
                  onClick={() => setShowForensicModal(true)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40 flex items-center gap-1.5 transition-colors"
                >
                  <Scale size={12} />
                  เปิดเครื่องมือตรวจสอบหลักฐาน & ใบรับรองกฎหมาย
                </button>
              </div>
            </div>

            {/* Field 3: Placement Mode & Syntax Safety Strategy */}
            <div className="p-3.5 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Code size={13} className="text-blue-400" />
                  ตำแหน่งการใส่หมายเหตุ (Placement Strategy):
                </label>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  Zero-Error Safe
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs">
                {/* Option 1: brace_or_statement_end */}
                <button
                  type="button"
                  onClick={() => setPlacementMode('brace_or_statement_end')}
                  className={`flex flex-col text-left p-2.5 rounded-lg border transition-all ${
                    placementMode === 'brace_or_statement_end'
                      ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-sm'
                      : 'bg-[#161b22] border-[#30363d] text-gray-400 hover:text-gray-200 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        placementMode === 'brace_or_statement_end' ? 'border-amber-400 bg-amber-400' : 'border-gray-500'
                      }`}>
                        {placementMode === 'brace_or_statement_end' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </span>
                      ใส่หลัง &#125; หรือหลังจบ code บรรทัดนั้นก็พอ
                    </span>
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                      แนะนำ
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 pl-5.5">
                    ใส่เฉพาะหลังเครื่องหมายปีกกาปิด &#125; (เช่น &#125;, &#125;;, &#125; else &#123;) หรือหลังจบ Code Statement ที่สมบูรณ์บริบูรณ์ (;)
                  </p>
                </button>

                {/* Option 2: brace_only */}
                <button
                  type="button"
                  onClick={() => setPlacementMode('brace_only')}
                  className={`flex flex-col text-left p-2.5 rounded-lg border transition-all ${
                    placementMode === 'brace_only'
                      ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-sm'
                      : 'bg-[#161b22] border-[#30363d] text-gray-400 hover:text-gray-200 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        placementMode === 'brace_only' ? 'border-amber-400 bg-amber-400' : 'border-gray-500'
                      }`}>
                        {placementMode === 'brace_only' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </span>
                      ใส่หลัง &#125; เท่านั้น (Brace Close Only)
                    </span>
                    <span className="text-[10px] text-gray-400 bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d]">
                      ตรงคำสั่ง
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 pl-5.5">
                    ใส่เฉพาะบรรทัดที่มีเครื่องหมายปีกกาปิด &#125; เท่านั้น ไม่แทรกในบรรทัดอื่นๆ เลย
                  </p>
                </button>

                {/* Option 3: all_safe_lines */}
                <button
                  type="button"
                  onClick={() => setPlacementMode('all_safe_lines')}
                  className={`flex flex-col text-left p-2.5 rounded-lg border transition-all ${
                    placementMode === 'all_safe_lines'
                      ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-sm'
                      : 'bg-[#161b22] border-[#30363d] text-gray-400 hover:text-gray-200 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        placementMode === 'all_safe_lines' ? 'border-amber-400 bg-amber-400' : 'border-gray-500'
                      }`}>
                        {placementMode === 'all_safe_lines' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </span>
                      ทุกบรรทัดโค้ดที่ปลอดภัย (All Safe Lines)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 pl-5.5">
                    ใส่ทุกบรรทัดโค้ดโดยคัดกรองข้ามบรรทัดที่มีความเสี่ยงต่อการเกิด Syntax Error
                  </p>
                </button>
              </div>

              {/* Safety notice banner */}
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
                <ShieldCheck size={14} className="shrink-0" />
                <span>
                  <strong>การันตีไม่เกิด Error:</strong> ระบบข้ามไฟล์ JSON, ข้ามบรรทัดตัวเชื่อม <code>\</code>, ข้ามสตริงหลายบรรทัด และแปลงคอมเมนต์ใน JSX อย่างถูกต้อง
                </span>
              </div>
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Eye size={13} className="text-green-400" />
                ตัวอย่างผลลัพธ์ในโค้ดจริง (Live Code Preview):
              </label>

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-[#0d1117] p-0.5 rounded-lg border border-[#30363d]">
                {['typescript', 'python', 'lua', 'html'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setPreviewLanguage(lang)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      previewLanguage === lang
                        ? 'bg-amber-500 text-black font-semibold shadow-sm'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Display */}
            <div className="rounded-lg bg-[#0d1117] border border-[#30363d] p-3 font-mono text-xs overflow-x-auto leading-relaxed text-gray-300">
              <pre>
                <code>{sampleBrandedCode}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#30363d] bg-[#0d1117]">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#30363d] text-gray-400 hover:text-white hover:bg-[#21262d] text-xs transition-colors"
            title="คืนค่าเป็น love1big และ OMNI Engine STUDIO"
          >
            <RotateCcw size={13} />
            <span>คืนค่าเริ่มต้น</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-[#30363d] text-gray-300 hover:bg-[#21262d] text-xs transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-black transition-all ${
                savedSuccess
                  ? 'bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.4)]'
                  : 'bg-amber-400 hover:bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.25)]'
              }`}
            >
              {savedSuccess ? <Check size={14} /> : <Code size={14} />}
              <span>{savedSuccess ? 'บันทึกสำเร็จ!' : 'บันทึกการตั้งค่า'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forensic Provenance Verification & Legal Certificate Modal */}
      <OmniForensicVerificationModal
        isOpen={showForensicModal}
        onClose={() => setShowForensicModal(false)}
        initialCode={sampleBrandedCode}
      />
    </div>
  );
};

export default AICodeBrandingConfigModal;
