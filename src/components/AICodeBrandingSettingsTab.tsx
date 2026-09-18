/**
 * ============================================================================
 * MODULE: AICodeBrandingSettingsTab.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * แท็บการตั้งค่าหมายเหตุประทับตราลิขสิทธิ์โค้ดประจำโปรแกรม OMNI Engine STUDIO
 * ภายในหน้าต่างการตั้งค่าหลัก (Main Settings Modal Integration Node):
 *   - ตามข้อกำหนดของผู้ใช้:
 *     "ทำให้ตั้งค่าใน โปรแกรมได้ด้วย ตั้งค่า ตรง
 *      *by *ชื่อที่ตั้งค่า* โดยโปรแกรม OMNI Engine STUDIO*
 *      ชื่อที่ตั้งค่า พื้นฐาน คือ love1big สามารถแก้ไขตรงนี้ได้ บ่างทีอาจจะใส่ชื่อผู้พัฒนาเองได้ หรือชือทีมผู้พัฒนา"
 *   - แยกไฟล์เป็นโมดูลอิสระ (1 Node = 1 Dedicated File) ไม่ปะปนกับ SettingsModal
 *   - ควบคุมการตั้งชื่อผู้พัฒนา (Author Name) หรือชื่อทีมผู้พัฒนา (Developer / Team Name)
 *   - ควบคุมการตั้งชื่อโปรแกรม (Engine / Program Name)
 *   - จำลองการแสดงผลโค้ดตัวอย่างในหลายภาษา (TypeScript, Python, Lua, HTML, CSS)
 *   - แสดงผลสถานะการบันทึกข้อมูล พร้อมปุ่มรีเซ็ตเป็นค่าเริ่มต้น
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Connected with: `src/utils/OfflineAICodeCommentBrander.ts`
 * - Rendered by: `src/components/SettingsModal.tsx` under 'attribution' tab
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  User, 
  Cpu, 
  Check, 
  RotateCcw, 
  Copy, 
  Eye, 
  ShieldCheck, 
  Tag, 
  Code2,
  Code,
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

export const AICodeBrandingSettingsTab: React.FC = () => {
  const [authorName, setAuthorName] = useState<string>(offlineAICodeCommentBrander.getAuthorName());
  const programName = LOCKED_OMNI_ENGINE_NAME; // ล็อคถาวรตามกฎหมายลิขสิทธิ์
  const [placementMode, setPlacementMode] = useState<BrandingPlacementMode>(offlineAICodeCommentBrander.getPlacementMode());
  const [invisibleForensicEnabled, setInvisibleForensicEnabled] = useState<boolean>(offlineAICodeCommentBrander.getInvisibleForensicEnabled());
  const [previewLanguage, setPreviewLanguage] = useState<string>('typescript');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [copiedTag, setCopiedTag] = useState<boolean>(false);
  const [showForensicModal, setShowForensicModal] = useState<boolean>(false);

  useEffect(() => {
    return offlineAICodeCommentBrander.subscribe(() => {
      setAuthorName(offlineAICodeCommentBrander.getAuthorName());
      setPlacementMode(offlineAICodeCommentBrander.getPlacementMode());
      setInvisibleForensicEnabled(offlineAICodeCommentBrander.getInvisibleForensicEnabled());
    });
  }, []);

  const currentBrandTag = offlineAICodeCommentBrander.getBrandTag(authorName, programName);

  const getSampleCode = (lang: string) => {
    switch (lang) {
      case 'python':
        return `def spawn_enemy(pos_x, pos_y):\n    enemy = Enemy(x=pos_x, y=pos_y, hp=250)\n    if enemy.hp > 0:\n        world.add_entity(enemy)\n        return enemy\n    return None`;
      case 'lua':
        return `function onPlayerEnter(player)\n    local health = player:getHealth()\n    if health < 100 then\n        player:setHealth(health + 50)\n    end\nend`;
      case 'html':
        return `<div class="game-hud">\n  <span class="hud-tag">OMNI Engine</span>\n</div>`;
      case 'css':
        return `.game-viewport {\n  position: relative;\n  background: #000;\n}`;
      case 'typescript':
      default:
        return `export function calculateDamage(atk: number, def: number): number {\n  const base = atk * 1.5;\n  if (base > def) {\n    return base - def;\n  } else {\n    return 1;\n  }\n}`;
    }
  };

  const sampleBrandedCode = offlineAICodeCommentBrander.brandCode(
    getSampleCode(previewLanguage),
    previewLanguage,
    { brandTag: currentBrandTag, brandEmptyLines: false, mode: placementMode }
  ).brandedCode;

  const handleSave = () => {
    offlineAICodeCommentBrander.setAuthorName(authorName);
    offlineAICodeCommentBrander.setPlacementMode(placementMode);
    offlineAICodeCommentBrander.setInvisibleForensicEnabled(invisibleForensicEnabled);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    setAuthorName(OfflineAICodeCommentBrander.DEFAULT_AUTHOR);
    setPlacementMode(OfflineAICodeCommentBrander.DEFAULT_PLACEMENT_MODE);
    setInvisibleForensicEnabled(true);
    offlineAICodeCommentBrander.resetToDefaults();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCopyTag = () => {
    navigator.clipboard.writeText(currentBrandTag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 1500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl text-gray-200 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sparkles size={16} />
          </div>
          <h3 className="text-[#c9d1d9] text-[18px] font-semibold">
            ตั้งค่าหมายเหตุลิขสิทธิ์โค้ด AI Offline (Code Attribution & Branding)
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
            *by {offlineAICodeCommentBrander.getAuthorName()} โดยโปรแกรม OMNI Engine STUDIO*
          </span>
        </div>
        <p className="text-[#8b949e] text-[13px]">
          กำหนดชื่อผู้พัฒนาหรือทีมผู้พัฒนาเพื่อแทรกหมายเหตุประทับตราลิขสิทธิ์ในทุกบรรทัดของซอร์สโค้ดที่ระบบ AI Offline สร้างขึ้น
        </p>
      </div>

      {/* Active Branding Preview Card */}
      <div className="p-4 rounded-lg bg-[#161b22] border border-amber-500/30 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={15} />
            แท็กหมายเหตุลิขสิทธิ์ที่จะถูกประทับลงในโค้ด (Active Tag Pattern):
          </span>
          <button
            onClick={handleCopyTag}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-gray-300 text-[11px] transition-colors"
          >
            {copiedTag ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            <span>{copiedTag ? 'คัดลอกแล้ว' : 'คัดลอกแท็ก'}</span>
          </button>
        </div>
        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] font-mono text-sm text-amber-300 break-all select-all">
          {currentBrandTag}
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 gap-4">
        {/* Author / Team Name */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
              <User size={14} className="text-cyan-400" />
              ชื่อที่ตั้งค่า (ชื่อผู้พัฒนา หรือ ชื่อทีมผู้พัฒนา):
            </label>
            <span className="text-[11px] text-[#8b949e]">
              ค่าพื้นฐานเริ่มต้น: <code className="text-amber-300 bg-[#0d1117] px-1.5 py-0.5 rounded">love1big</code>
            </span>
          </div>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="เช่น love1big หรือ ชื่อทีมผู้พัฒนาของคุณ..."
            className="w-full px-3 py-2 text-sm bg-[#0d1117] border border-[#30363d] rounded-lg focus:outline-none focus:border-amber-500 text-white font-mono placeholder-gray-500 transition-colors"
          />

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap text-[11px]">
            <span className="text-gray-400 flex items-center gap-1">
              <Tag size={12} /> ตัวเลือกด่วน:
            </span>
            <button
              type="button"
              onClick={() => setAuthorName('love1big')}
              className={`px-2.5 py-0.5 rounded border transition-colors ${
                authorName === 'love1big'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#21262d] text-gray-300 border-[#30363d] hover:bg-[#30363d]'
              }`}
            >
              love1big (ค่าเริ่มต้น)
            </button>
            <button
              type="button"
              onClick={() => setAuthorName('Nexus Engine Team')}
              className={`px-2.5 py-0.5 rounded border transition-colors ${
                authorName === 'Nexus Engine Team'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#21262d] text-gray-300 border-[#30363d] hover:bg-[#30363d]'
              }`}
            >
              Nexus Engine Team
            </button>
            <button
              type="button"
              onClick={() => setAuthorName('OMNI Game Studio')}
              className={`px-2.5 py-0.5 rounded border transition-colors ${
                authorName === 'OMNI Game Studio'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#21262d] text-gray-300 border-[#30363d] hover:bg-[#30363d]'
              }`}
            >
              OMNI Game Studio
            </button>
          </div>
        </div>

        {/* Engine / Program Name (Locked for Legal & Provenance Guarantee) */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
              <Lock size={14} className="text-amber-400" />
              ชื่อโปรแกรมต้นกำเนิด (Engine / Program Name):
            </label>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono">
              <Lock size={10} />
              ล็อคถาวรตามกฎหมายลิขสิทธิ์
            </span>
          </div>

          <div className="flex items-center gap-2.5 bg-[#0d1117] px-3.5 py-2.5 rounded-lg border border-[#30363d]">
            <Cpu size={16} className="text-amber-400 shrink-0" />
            <span className="font-mono text-sm font-bold text-white tracking-wide flex-1">
              {LOCKED_OMNI_ENGINE_NAME}
            </span>
            <span className="text-[10px] text-gray-400 bg-[#161b22] px-2 py-0.5 rounded border border-[#21262d] font-mono">
              IMMUTABLE PROVENANCE
            </span>
          </div>

          <p className="text-[11px] text-[#8b949e] leading-relaxed">
            ชื่อโปรแกรมถูกล็อคไว้เป็น <strong className="text-amber-300">OMNI Engine STUDIO</strong> อย่างถาวร เพื่อให้ทุกชิ้นงานและโค้ดที่สร้างขึ้นสามารถระบุและพิสูจน์ต้นกำเนิดของโปรแกรมเราได้อย่างถูกต้องตามกฎหมายลิขสิทธิ์สากล (WIPO, Berne Convention, DMCA, พ.ร.บ. ลิขสิทธิ์)
          </p>
        </div>

        {/* Invisible Forensic Watermarking & Provenance Steganography */}
        <div className="bg-[#161b22] border border-blue-500/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck size={14} />
              </div>
              <div>
                <span className="text-xs font-bold text-white">
                  การฝังลายน้ำนิติวิทยาศาสตร์ดิจิทัลล่องหนหลังบ้าน (Invisible Watermark)
                </span>
                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
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
            ฝังรหัสกำเนิดดิจิทัลแบบล่องหน (Zero-Width Characters) ที่<strong>ไม่แสดงผลบนหน้าจอเกมหรือแอปพลิเคชันจริง</strong> แต่ฝังอยู่หลังบ้านอย่างแน่นหนา สามารถสแกนและตรวจสอบย้อนกลับได้ 100% ว่าเขียนขึ้นจาก <strong>{LOCKED_OMNI_ENGINE_NAME}</strong> แม้ผู้ใช้รายอื่นจะลบข้อความคอมเมนต์ออกไปแล้ว
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-[#21262d]">
            <span className="text-[11px] text-[#8b949e] font-mono">
              ISO/IEC 27037 Digital Forensics & WCT Art. 12
            </span>
            <button
              type="button"
              onClick={() => setShowForensicModal(true)}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40 flex items-center gap-1.5 transition-colors"
            >
              <Scale size={13} />
              เปิดเครื่องมือตรวจสอบหลักฐาน & ใบรับรองกฎหมาย
            </button>
          </div>
        </div>

        {/* Placement Strategy & Syntax Safety Selection */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
              <Code size={14} className="text-blue-400" />
              ตำแหน่งการแทรกหมายเหตุ (Comment Placement Strategy):
            </label>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
              Zero-Syntax-Error Guaranteed
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Option 1: brace_or_statement_end */}
            <button
              type="button"
              onClick={() => setPlacementMode('brace_or_statement_end')}
              className={`flex flex-col text-left p-3 rounded-lg border transition-all ${
                placementMode === 'brace_or_statement_end'
                  ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-sm'
                  : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between font-semibold text-xs">
                <span className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    placementMode === 'brace_or_statement_end' ? 'border-amber-400 bg-amber-400' : 'border-gray-500'
                  }`}>
                    {placementMode === 'brace_or_statement_end' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </span>
                  ใส่หลัง &#125; หรือหลังจบ code บรรทัดนั้นก็พอ
                </span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  แนะนำเป็นค่าเริ่มต้น
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 pl-5.5">
                ใส่เฉพาะหลังเครื่องหมายปีกกาปิด &#125; (เช่น &#125;, &#125;;, &#125; else &#123;) หรือบรรทัดที่ Code Statement จบสมบูรณ์ (;)
              </p>
            </button>

            {/* Option 2: brace_only */}
            <button
              type="button"
              onClick={() => setPlacementMode('brace_only')}
              className={`flex flex-col text-left p-3 rounded-lg border transition-all ${
                placementMode === 'brace_only'
                  ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-sm'
                  : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between font-semibold text-xs">
                <span className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    placementMode === 'brace_only' ? 'border-amber-400 bg-amber-400' : 'border-gray-500'
                  }`}>
                    {placementMode === 'brace_only' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </span>
                  ใส่หลัง &#125; เท่านั้น (Brace Close Only)
                </span>
                <span className="text-[10px] text-gray-400 bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]">
                  ตรงคำสั่งเป๊ะ
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 pl-5.5">
                ใส่เฉพาะบรรทัดที่เครื่องหมายปีกกาปิด &#125; เท่านั้น ไม่แทรกในบรรทัดคำสั่งอื่น
              </p>
            </button>

            {/* Option 3: all_safe_lines */}
            <button
              type="button"
              onClick={() => setPlacementMode('all_safe_lines')}
              className={`flex flex-col text-left p-3 rounded-lg border transition-all ${
                placementMode === 'all_safe_lines'
                  ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-sm'
                  : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between font-semibold text-xs">
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
                ใส่ทุกบรรทัดโค้ดโดยตรวจจับข้ามบรรทัดที่มีความเสี่ยงต่อการพังของไวยากรณ์
              </p>
            </button>
          </div>

          {/* Zero-Error Guarantee Badge */}
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5 rounded-lg">
            <ShieldCheck size={15} className="shrink-0" />
            <span>
              <strong>ระบบการันตีไม่เกิด Error:</strong> ข้ามไฟล์ JSON อัตโนมัติ, ข้ามบรรทัดตัวเชื่อม <code>\</code>, ข้ามข้อความหลายบรรทัด และสลับคอมเมนต์ JSX อย่างถูกต้อง
            </span>
          </div>
        </div>

        {/* Live Code Preview */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
              <Eye size={14} className="text-green-400" />
              <span>การจำลองการแสดงผลในซอร์สโค้ดจริง (Live Syntax Preview):</span>
            </div>
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

          <div className="rounded-lg bg-[#0d1117] border border-[#30363d] p-3 font-mono text-xs overflow-x-auto text-gray-300 leading-relaxed">
            <pre>
              <code>{sampleBrandedCode}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-[#30363d]">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#30363d] text-gray-400 hover:text-white hover:bg-[#21262d] text-xs transition-colors"
          title="คืนค่าเป็น love1big และ OMNI Engine STUDIO"
        >
          <RotateCcw size={13} />
          <span>คืนค่าเริ่มต้น</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-black transition-all ${
            savedSuccess
              ? 'bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.4)]'
              : 'bg-amber-400 hover:bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.25)]'
          }`}
        >
          {savedSuccess ? <Check size={14} /> : <Code2 size={14} />}
          <span>{savedSuccess ? 'บันทึกสำเร็จเรียบร้อย!' : 'บันทึกการตั้งค่า'}</span>
        </button>
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

export default AICodeBrandingSettingsTab;
