/**
 * ============================================================================
 * [THAI] แดชบอร์ดตรวจสอบและยืนยันความถูกต้องของการแปลตามบริบทออฟไลน์อัตโนมัติ
 * [ENGLISH] Automated Localization Verification Dashboard & Context Cross-Checking Studio
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - เป็นคอมโพเนนต์แดชบอร์ดหลักสำหรับตรวจสอบและยืนยันคุณภาพการแปลภาษา (Localization QA)
 *   โดยทำการ Cross-Check คำแปลเทียบกับบริบทของภาษาต้นทางอย่างละเอียดลึกซึ้ง:
 *   1. Context Cross-Checking: ตรวจสอบความสอดคล้องกับบริบทเกม (Gaming HUD, Dialogue, Lore, Quest, Store)
 *   2. Variable & Placeholder Integrity: ตรวจสอบความสมบูรณ์ของตัวแปร {player}, %s, [item], <color>
 *   3. UI Overflow & Layout Bounds: คำนวณความเสี่ยงที่ข้อความจะล้นปุ่มหรือแถบ HUD
 *   4. Negation Clause Verification: ป้องกันข้อความกลับด้านหรือคำปฏิเสธตกหล่น
 *   5. Contextual Localization Variants: สังเคราะห์ทางเลือกการแปล 3-4 รูปแบบตามวัตถุประสงค์การใช้งานจริง
 *   6. 1-Click Auto-Heal: ปรับปรุงคำแปลให้อัตโนมัติด้วยคำแนะนำที่ดีที่สุดทันที
 *   7. Batch Localization Testbed: ตรวจสอบสตริงเกมแบบกลุ่ม พร้อมส่งออกรายงาน JSON / Markdown
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - ฝังตัวอยู่ภายใน `GlobalOfflineAITranslationStudio.tsx`
 * - ใช้อัลกอริทึมจาก `LocalizationVerificationEngineNode.ts`
 * - เชื่อมต่อข้อมูล Type Definitions จาก `../types/localizationVerification.ts`
 *
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * - รองรับกรณีที่ไม่มีข้อความแปล โดยแสดง Empty State แนะนำให้พิมพ์ข้อความ
 * - ป้องกันการเลือก Context ขัดแย้งด้วยการตรวจจับอัตโนมัติ (Heuristic Auto-Detect)
 *
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ```tsx
 * <LocalizationVerificationDashboard
 *   sourceText={sourceText}
 *   translatedText={translatedText}
 *   sourceLang={sourceLangProfile}
 *   targetLang={targetLangProfile}
 *   glossaryRules={glossaryRules}
 *   onApplyFix={(fixedText) => handleUpdateTranslation(fixedText)}
 *   onSwitchToConsole={() => setActiveTab('console')}
 * />
 * ```
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  Sliders,
  Maximize2,
  Minimize2,
  ArrowRight,
  Info,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Download,
  Terminal,
  Gamepad2,
  MessageSquare,
  BookOpen,
  Sword,
  ShoppingCart,
  Settings,
  Layers
} from 'lucide-react';

import {
  GlobalLanguageProfile,
  OfflineGlossaryRule
} from '../types/offlineTranslation70';
import {
  LocalizationContextCategory,
  LocalizationVerificationReport,
  ContextualLocalizationVariant,
  LocalizationVerificationIssue,
  BatchLocalizationItem
} from '../types/localizationVerification';
import { LocalizationVerificationEngineNode } from '../utils/LocalizationVerificationEngineNode';

interface LocalizationVerificationDashboardProps {
  sourceText: string;
  translatedText: string;
  sourceLang: GlobalLanguageProfile;
  targetLang: GlobalLanguageProfile;
  glossaryRules?: OfflineGlossaryRule[];
  onApplyFix: (correctedText: string) => void;
  onSwitchToConsole: () => void;
}

export const LocalizationVerificationDashboard: React.FC<LocalizationVerificationDashboardProps> = ({
  sourceText,
  translatedText,
  sourceLang,
  targetLang,
  glossaryRules = [],
  onApplyFix,
  onSwitchToConsole
}) => {
  // สลับแท็บย่อยภายในแดชบอร์ด (การตรวจรายข้อความ VS ชุดทดสอบสตริงแบบกลุ่ม)
  const [subView, setSubView] = useState<'single' | 'batch'>('single');

  // บริบทที่ผู้ใช้เลือก (ค่าเริ่มต้น: ตรวจจับอัตโนมัติ)
  const [selectedContext, setSelectedContext] = useState<LocalizationContextCategory>(() =>
    LocalizationVerificationEngineNode.detectSourceContext(sourceText)
  );

  // สถานะการคัดลอกข้อความ
  const [copiedVariantId, setCopiedVariantId] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // ตัวกรองข้อผิดพลาด
  const [issueSeverityFilter, setIssueSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'tip'>('all');

  // ข้อมูลชุดทดสอบเกมแบบกลุ่ม (Pre-loaded Game String Table)
  const [batchItems, setBatchItems] = useState<Array<{ id: string; keyName: string; sourceText: string; translatedText: string; context: LocalizationContextCategory }>>([
    {
      id: 'g-str-01',
      keyName: 'UI_BTN_START_GAME',
      sourceText: 'Press [SPACE] to start game',
      translatedText: 'กรุณากดปุ่ม [SPACE] เพื่อเริ่มเกม',
      context: 'gaming_hud_ui'
    },
    {
      id: 'g-str-02',
      keyName: 'HUD_ALERT_SAVE_SUCCESS',
      sourceText: 'Game saved successfully to slot {slotId}. Do not turn off power.',
      translatedText: 'ช่วยชีวิตเกมสำเร็จในช่อง {slotId} ห้ามปิดเครื่อง',
      context: 'gaming_hud_ui'
    },
    {
      id: 'g-str-03',
      keyName: 'QUEST_OBJ_GOBLIN_KILL',
      sourceText: 'Defeat {count} Mountain Goblins without taking damage from fire.',
      translatedText: 'กำจัดก็อบลินภูเขา {count} ตัว โดยไม่ได้รับดาเมจจากไฟ',
      context: 'quest_objective'
    },
    {
      id: 'g-str-04',
      keyName: 'NPC_DIALOGUE_SORCERESS',
      sourceText: '"I warned you, mortal. You cannot cast that forbidden spell in this sacred realm."',
      translatedText: '"ข้าเตือนเจ้าแล้ว มนุษย์ เจ้าหล่อโลหะเวทมนตร์ต้องห้ามในแดนศักดิ์สิทธิ์นี้ไม่ได้"',
      context: 'gaming_dialogue'
    },
    {
      id: 'g-str-05',
      keyName: 'SHOP_BUNDLE_VIP_OFFER',
      sourceText: 'Special Weekend Bundle: 5,000 Gems + {bonusGems} Bonus Coins for $19.99!',
      translatedText: 'แพ็กเกจพิเศษสุดสัปดาห์: 5,000 เพชร + {bonusGems} โบนัสเหรียญ ราคา $19.99!',
      context: 'store_monetization'
    }
  ]);

  const [batchStatusFilter, setBatchStatusFilter] = useState<'all' | 'issues' | 'pass'>('all');

  // คำนวณผลการตรวจสอบความถูกต้องเรียลไทม์
  const verificationReport: LocalizationVerificationReport = useMemo(() => {
    return LocalizationVerificationEngineNode.verifyLocalization(
      sourceText || 'Start Game',
      translatedText || 'เริ่มเกม',
      sourceLang,
      targetLang,
      selectedContext,
      glossaryRules
    );
  }, [sourceText, translatedText, sourceLang, targetLang, selectedContext, glossaryRules]);

  // คำนวณผลการทดสอบสตริงแบบกลุ่ม
  const batchVerificationResults = useMemo(() => {
    return LocalizationVerificationEngineNode.runBatchVerification(
      batchItems,
      sourceLang,
      targetLang
    );
  }, [batchItems, sourceLang, targetLang]);

  // กรองรายการปัญหาตาม Severity
  const filteredIssues = useMemo(() => {
    if (issueSeverityFilter === 'all') return verificationReport.issues;
    return verificationReport.issues.filter((i) => i.severity === issueSeverityFilter);
  }, [verificationReport.issues, issueSeverityFilter]);

  // กรองรายการกลุ่มตามสถานะ
  const filteredBatchResults = useMemo(() => {
    if (batchStatusFilter === 'all') return batchVerificationResults;
    if (batchStatusFilter === 'issues') {
      return batchVerificationResults.filter((r) => r.status !== 'verified_pass');
    }
    return batchVerificationResults.filter((r) => r.status === 'verified_pass');
  }, [batchVerificationResults, batchStatusFilter]);

  // คัดลอกข้อความ
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVariantId(id);
    setTimeout(() => setCopiedVariantId(null), 2000);
  };

  // ส่งออกรายงาน JSON
  const handleExportJsonReport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(verificationReport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `l10n-verification-report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // ส่งออกรายงาน Markdown
  const handleExportMarkdownReport = () => {
    const md = `# 🛡️ Automated Localization Verification Report
**Date:** ${new Date(verificationReport.timestamp).toLocaleString()}
**Source Language:** ${sourceLang.nameThai} (${sourceLang.id})
**Target Language:** ${targetLang.nameThai} (${targetLang.id})
**Context:** ${verificationReport.activeContext}

## Summary Metrics
- **Overall Accuracy Score:** ${verificationReport.metrics.overallAccuracyScore}% (${verificationReport.metrics.status.toUpperCase()})
- **Context Adherence:** ${verificationReport.metrics.contextAdherenceScore}%
- **Variable Integrity:** ${verificationReport.metrics.variablePreservationScore}%
- **UI Overflow Safety:** ${verificationReport.metrics.uiSafetyScore}%
- **String Expansion Ratio:** ${verificationReport.metrics.lengthExpansionRatio}x (${verificationReport.metrics.characterCountSource} -> ${verificationReport.metrics.characterCountTarget} chars)

## Source & Translation
- **Source:** \`${verificationReport.sourceText}\`
- **Translation:** \`${verificationReport.translatedText}\`
- **Auto-Healed Suggestion:** \`${verificationReport.autoHealedTranslation}\`

## Detected Issues (${verificationReport.issues.length})
${verificationReport.issues.map((i, idx) => `### ${idx + 1}. [${i.severity.toUpperCase()}] ${i.titleTh}
- **Description:** ${i.descriptionTh}
- **Suggested Fix:** ${i.suggestedFix || 'None'}
`).join('\n')}

---
*Generated by Global Offline AI Translation Studio - Localization Verification Engine*
`;

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `l10n-verification-${Date.now()}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto p-6 space-y-6 select-text">
      {/* 1. Header Toolbar & Context Selector */}
      <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40">
              <ShieldCheck size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  LOCALIZATION VERIFICATION DASHBOARD
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#238636]/30 text-[#3fb950] border border-[#238636] rounded-full">
                  AUTOMATED CONTEXT AUDIT
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#1f6feb]/30 text-[#58a6ff] border border-[#1f6feb] rounded-full">
                  100% OFFLINE
                </span>
              </div>
              <p className="text-xs text-[#8b949e]">
                ระบบตรวจสอบความแม่นยำเทียบกับบริบทต้นทางอัตโนมัติ ป้องกันการแปลผิดความหมายในเกมและข้อความล้นกรอบ UI
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Sub-view Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Subview Selector */}
          <div className="flex items-center p-1 rounded-lg bg-[#0d1117] border border-[#30363d]">
            <button
              onClick={() => setSubView('single')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                subView === 'single'
                  ? 'bg-[#1f6feb] text-white shadow-sm'
                  : 'text-[#8b949e] hover:text-white'
              }`}
            >
              <FileText size={13} />
              <span>ตรวจรายข้อความ</span>
            </button>
            <button
              onClick={() => setSubView('batch')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                subView === 'batch'
                  ? 'bg-[#238636] text-white shadow-sm'
                  : 'text-[#8b949e] hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>ชุดทดสอบสตริงเกม ({batchItems.length})</span>
            </button>
          </div>

          {/* Context Selector Dropdown */}
          <div className="flex items-center space-x-1.5 bg-[#0d1117] px-3 py-1.5 rounded-lg border border-[#30363d]">
            <Sliders size={13} className="text-[#58a6ff]" />
            <span className="text-[11px] text-[#8b949e] hidden sm:inline">บริบทการใช้งาน:</span>
            <select
              value={selectedContext}
              onChange={(e) => setSelectedContext(e.target.value as LocalizationContextCategory)}
              className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="gaming_hud_ui">🎮 ปุ่ม & HUD ในเกม (HUD & UI)</option>
              <option value="gaming_dialogue">🗣️ บทสนทนาตัวละคร (Dialogue)</option>
              <option value="gaming_lore">📜 ปกรณัม & เนื้อเรื่อง (Lore)</option>
              <option value="quest_objective">⚔️ ภารกิจ & คำสั่ง (Quest)</option>
              <option value="store_monetization">💰 ร้านค้า & ไอเทมมอลล์ (Store)</option>
              <option value="technical_settings">⚙️ ตั้งค่าระบบ & กราฟิก (Settings)</option>
              <option value="general_conversation">🌐 บทสนทนาทั่วไป (General)</option>
            </select>
          </div>

          {/* Export Report Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleExportJsonReport}
              className="p-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] text-xs transition-all"
              title="ส่งออกรายงาน JSON"
            >
              <Download size={14} />
            </button>
            <button
              onClick={handleExportMarkdownReport}
              className="p-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] text-xs transition-all"
              title="ส่งออกรายงาน Markdown สำหรับทีมพัฒนา"
            >
              <FileText size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Gauge & Health Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Overall Accuracy Score */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e]">คะแนนความแม่นยำรวม</span>
            {verificationReport.metrics.overallAccuracyScore >= 85 ? (
              <CheckCircle2 size={16} className="text-[#3fb950]" />
            ) : verificationReport.metrics.overallAccuracyScore >= 60 ? (
              <AlertTriangle size={16} className="text-[#d29922]" />
            ) : (
              <XCircle size={16} className="text-[#f85149]" />
            )}
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">
              {verificationReport.metrics.overallAccuracyScore}%
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                verificationReport.metrics.status === 'optimal'
                  ? 'bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40'
                  : verificationReport.metrics.status === 'acceptable'
                  ? 'bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40'
                  : verificationReport.metrics.status === 'needs_review'
                  ? 'bg-[#d29922]/20 text-[#d29922] border border-[#d29922]/40'
                  : 'bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/40'
              }`}
            >
              {verificationReport.metrics.status.toUpperCase()}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                verificationReport.metrics.overallAccuracyScore >= 85
                  ? 'bg-[#3fb950]'
                  : verificationReport.metrics.overallAccuracyScore >= 60
                  ? 'bg-[#d29922]'
                  : 'bg-[#f85149]'
              }`}
              style={{ width: `${verificationReport.metrics.overallAccuracyScore}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Context Adherence */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e]">ความตรงต่อบริบทเกม</span>
            <Gamepad2 size={16} className="text-[#58a6ff]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#58a6ff]">
            {verificationReport.metrics.contextAdherenceScore}%
          </div>
          <p className="text-[10px] text-[#8b949e] truncate">
            {verificationReport.insights.detectedContext}
          </p>
        </div>

        {/* Metric 3: Variable Integrity */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e]">ความสมบูรณ์ของตัวแปร</span>
            <Terminal size={16} className={verificationReport.metrics.missingOrAlteredVariables.length === 0 ? 'text-[#3fb950]' : 'text-[#f85149]'} />
          </div>
          <div className={`text-2xl font-bold font-mono ${verificationReport.metrics.missingOrAlteredVariables.length === 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
            {verificationReport.metrics.variablePreservationScore}%
          </div>
          <p className="text-[10px] text-[#8b949e]">
            {verificationReport.metrics.detectedVariablesInSource.length} ตัวแปรในต้นฉบับ
          </p>
        </div>

        {/* Metric 4: UI Overflow Safety */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e]">ความปลอดภัยต่อ UI</span>
            <Maximize2 size={16} className={verificationReport.metrics.uiSafetyScore >= 70 ? 'text-[#3fb950]' : 'text-[#d29922]'} />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {verificationReport.metrics.uiSafetyScore}%
          </div>
          <p className="text-[10px] text-[#8b949e]">
            สัดส่วนความยาว {verificationReport.metrics.lengthExpansionRatio}x
          </p>
        </div>

        {/* Metric 5: 1-Click Auto-Heal Action */}
        <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-gradient-to-br from-[#1f6feb]/20 to-[#238636]/20 border border-[#1f6feb]/40 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">การแก้ไขอัตโนมัติ</span>
            <Zap size={16} className="text-[#3fb950] animate-bounce" />
          </div>
          <button
            onClick={() => onApplyFix(verificationReport.autoHealedTranslation)}
            className="w-full py-2 px-3 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <Sparkles size={13} />
            <span>ปรับปรุงสมบูรณ์แบบ (Auto-Heal)</span>
          </button>
          <p className="text-[10px] text-[#3fb950] text-center truncate">
            แก้ปัญหาทั้งหมดใน 1 คลิก
          </p>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SUB-VIEW 1: ตรวจรายข้อความแบบเจาะลึก (Single-String Deep Verification) */}
      {/* =================================================================== */}
      {subView === 'single' && (
        <div className="space-y-6">
          {/* Side-by-Side Context Cross-Check Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Source Box */}
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    ข้อความภาษาต้นทาง (Source Context)
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#1f6feb]/20 text-[#58a6ff] text-[10px] font-mono font-bold">
                    {sourceLang.nameThai} ({sourceLang.id})
                  </span>
                </div>
                <span className="text-xs text-[#8b949e] font-mono">
                  {verificationReport.metrics.characterCountSource} ตัวอักษร
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] min-h-[90px] font-sans text-sm text-white leading-relaxed select-text">
                {sourceText || <span className="text-[#8b949e] italic">ไม่มีข้อความ</span>}
              </div>

              {/* Source Variables Highlight */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[#8b949e] text-[11px]">ตัวแปรที่พบ:</span>
                {verificationReport.metrics.detectedVariablesInSource.length === 0 ? (
                  <span className="text-[#8b949e] italic text-[11px]">ไม่มีตัวแปร</span>
                ) : (
                  verificationReport.metrics.detectedVariablesInSource.map((v, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40 font-mono text-[11px]">
                      {v}
                    </span>
                  ))
                )}
              </div>

              <div className="text-[11px] text-[#8b949e] bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d] space-y-1">
                <div>🎯 <b>เจตนาบริบท:</b> {verificationReport.insights.detectedIntentTh}</div>
                <div>💬 <b>น้ำเสียงที่เหมาะสม:</b> {verificationReport.insights.grammaticalToneTh}</div>
              </div>
            </div>

            {/* Target Translation Box */}
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    คำแปลปัจจุบัน (Current Translation)
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] text-[10px] font-mono font-bold">
                    {targetLang.nameThai} ({targetLang.id})
                  </span>
                </div>
                <span className="text-xs text-[#8b949e] font-mono">
                  {verificationReport.metrics.characterCountTarget} ตัวอักษร ({verificationReport.metrics.lengthExpansionRatio}x)
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] min-h-[90px] font-sans text-sm text-[#3fb950] font-medium leading-relaxed select-text">
                {translatedText || <span className="text-[#8b949e] italic">ไม่มีคำแปล</span>}
              </div>

              {/* Target Variables Status */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[#8b949e] text-[11px]">สถานะตัวแปรในคำแปล:</span>
                {verificationReport.metrics.missingOrAlteredVariables.length === 0 ? (
                  <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 text-[11px]">
                    <Check size={12} />
                    <span>ตัวแปรครบถ้วน 100%</span>
                  </span>
                ) : (
                  verificationReport.metrics.missingOrAlteredVariables.map((v, i) => (
                    <span key={i} className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/40 font-mono text-[11px]">
                      <XCircle size={11} />
                      <span>{v} ตกหล่น</span>
                    </span>
                  ))
                )}
              </div>

              <div className="text-[11px] text-[#8b949e] bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d] space-y-1">
                <div>📏 <b>การปรับตัวตามภาษาเป้าหมาย:</b> {verificationReport.insights.targetCulturalAdaptationNotes[0] || 'ปกติ'}</div>
                <div>⚠️ <b>ความเสี่ยงต่อกรอบ UI:</b> {verificationReport.insights.potentialUiOverflowRisk ? 'มีความเสี่ยงล้นกรอบปุ่ม' : 'อยู่ในเกณฑ์ปลอดภัย'}</div>
              </div>
            </div>
          </div>

          {/* Contextual Localization Variants (ทางเลือกการแปล 3-4 รูปแบบตามวัตถุประสงค์) */}
          <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles size={16} className="text-[#a371f7]" />
                  <span>ทางเลือกการแปลเฉพาะตามบริบท (Contextual Localization Variants)</span>
                </h3>
                <p className="text-xs text-[#8b949e]">
                  เลือกสไตล์การแปลที่เหมาะสมที่สุดสำหรับประเภทการแสดงผลของเกมและซอฟต์แวร์
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {verificationReport.suggestedVariants.map((variant) => (
                <div
                  key={variant.id}
                  className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#1f6feb]/60 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">
                        {variant.labelTh}
                      </span>
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${variant.badgeColor}20`,
                          color: variant.badgeColor,
                          borderColor: `${variant.badgeColor}40`,
                          borderWidth: 1
                        }}
                      >
                        {variant.characterCount} อักษร
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-[#161b22] border border-[#30363d] text-xs text-white font-medium select-text">
                      "{variant.text}"
                    </div>

                    <p className="text-[11px] text-[#8b949e] leading-relaxed">
                      {variant.descriptionTh}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#30363d]/60">
                    <button
                      onClick={() => handleCopyText(variant.text, variant.id)}
                      className="text-xs text-[#8b949e] hover:text-white flex items-center space-x-1"
                    >
                      {copiedVariantId === variant.id ? <Check size={12} className="text-[#3fb950]" /> : <Copy size={12} />}
                      <span>{copiedVariantId === variant.id ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                    </button>

                    <button
                      onClick={() => onApplyFix(variant.text)}
                      className="flex items-center space-x-1 px-3 py-1 bg-[#1f6feb]/20 hover:bg-[#1f6feb]/40 text-[#58a6ff] border border-[#1f6feb]/40 rounded-lg text-xs font-bold transition-all"
                    >
                      <span>เลือกใช้สำนวนนี้</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issues & Detailed Findings Feed */}
          <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#30363d] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ShieldCheck size={16} className="text-[#58a6ff]" />
                  <span>รายการประเด็นที่ตรวจพบและคำแนะนำ ({verificationReport.issues.length})</span>
                </h3>
                <p className="text-xs text-[#8b949e]">
                  ตรวจพบข้อบกพร่องทางบริบท ตัวแปร และอัตราการขยายตัวของข้อความ
                </p>
              </div>

              {/* Severity Filter Tabs */}
              <div className="flex items-center space-x-1 text-xs">
                <button
                  onClick={() => setIssueSeverityFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    issueSeverityFilter === 'all'
                      ? 'bg-[#1f6feb] text-white font-bold'
                      : 'text-[#8b949e] hover:text-white'
                  }`}
                >
                  ทั้งหมด ({verificationReport.issues.length})
                </button>
                <button
                  onClick={() => setIssueSeverityFilter('critical')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    issueSeverityFilter === 'critical'
                      ? 'bg-[#f85149] text-white font-bold'
                      : 'text-[#8b949e] hover:text-[#f85149]'
                  }`}
                >
                  วิกฤต ({verificationReport.issues.filter((i) => i.severity === 'critical').length})
                </button>
                <button
                  onClick={() => setIssueSeverityFilter('warning')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    issueSeverityFilter === 'warning'
                      ? 'bg-[#d29922] text-white font-bold'
                      : 'text-[#8b949e] hover:text-[#d29922]'
                  }`}
                >
                  คำเตือน ({verificationReport.issues.filter((i) => i.severity === 'warning').length})
                </button>
                <button
                  onClick={() => setIssueSeverityFilter('tip')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    issueSeverityFilter === 'tip'
                      ? 'bg-[#38bdf8] text-black font-bold'
                      : 'text-[#8b949e] hover:text-[#38bdf8]'
                  }`}
                >
                  ข้อเสนอแนะ ({verificationReport.issues.filter((i) => i.severity === 'tip').length})
                </button>
              </div>
            </div>

            {filteredIssues.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#0d1117] border border-[#238636]/40 flex flex-col items-center justify-center space-y-2 text-center">
                <CheckCircle2 size={36} className="text-[#3fb950]" />
                <h4 className="text-sm font-bold text-white">ไม่พบข้อบกพร่องตามเงื่อนไขที่เลือก</h4>
                <p className="text-xs text-[#8b949e]">
                  คำแปลนี้ผ่านการตรวจสอบตัวแปร บริบทเกม และสัดส่วนความยาวเรียบร้อยแล้ว
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start justify-between gap-4 transition-all ${
                      issue.severity === 'critical'
                        ? 'bg-[#f85149]/10 border-[#f85149]/40'
                        : issue.severity === 'warning'
                        ? 'bg-[#d29922]/10 border-[#d29922]/40'
                        : 'bg-[#38bdf8]/10 border-[#38bdf8]/40'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            issue.severity === 'critical'
                              ? 'bg-[#f85149] text-white'
                              : issue.severity === 'warning'
                              ? 'bg-[#d29922] text-black'
                              : 'bg-[#38bdf8] text-black'
                          }`}
                        >
                          {issue.severity}
                        </span>
                        <span className="text-sm font-bold text-white">{issue.titleTh}</span>
                      </div>
                      <p className="text-xs text-[#c9d1d9] leading-relaxed">
                        {issue.descriptionTh}
                      </p>
                      {issue.suggestedFix && (
                        <div className="p-2 rounded bg-black/40 border border-[#30363d] text-xs text-[#3fb950] font-medium flex items-center space-x-1.5">
                          <Sparkles size={12} className="shrink-0" />
                          <span><b>แนวทางแก้ไข:</b> {issue.suggestedFix}</span>
                        </div>
                      )}
                    </div>

                    {issue.autoFixAvailable && (
                      <button
                        onClick={() => onApplyFix(verificationReport.autoHealedTranslation)}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold transition-all shadow active:scale-95 flex items-center space-x-1"
                      >
                        <Zap size={13} />
                        <span>แก้ไขจุดนี้</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUB-VIEW 2: ชุดทดสอบสตริงเกมแบบกลุ่ม (Batch Game Localization Suite)  */}
      {/* =================================================================== */}
      {subView === 'batch' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Layers size={16} className="text-[#3fb950]" />
                  <span>ชุดทดสอบตรวจสอบสตริงเกมแบบกลุ่ม (Batch Game String Suite)</span>
                </h3>
                <p className="text-xs text-[#8b949e]">
                  ตรวจทานตารางสตริงของเกม (HUD, เควสต์, บทสนทนา, ร้านค้า) เพื่อค้นหาคำแปลที่ตกหล่นก่อนนำไป Build
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1 text-xs">
                <button
                  onClick={() => setBatchStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    batchStatusFilter === 'all'
                      ? 'bg-[#1f6feb] text-white shadow-sm'
                      : 'text-[#8b949e] hover:text-white'
                  }`}
                >
                  ทั้งหมด ({batchVerificationResults.length})
                </button>
                <button
                  onClick={() => setBatchStatusFilter('issues')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    batchStatusFilter === 'issues'
                      ? 'bg-[#f85149] text-white shadow-sm'
                      : 'text-[#8b949e] hover:text-[#f85149]'
                  }`}
                >
                  พบข้อบกพร่อง ({batchVerificationResults.filter((r) => r.status !== 'verified_pass').length})
                </button>
                <button
                  onClick={() => setBatchStatusFilter('pass')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    batchStatusFilter === 'pass'
                      ? 'bg-[#238636] text-white shadow-sm'
                      : 'text-[#8b949e] hover:text-[#3fb950]'
                  }`}
                >
                  ผ่านการตรวจ ({batchVerificationResults.filter((r) => r.status === 'verified_pass').length})
                </button>
              </div>
            </div>

            {/* Batch Table */}
            <div className="overflow-x-auto rounded-xl border border-[#30363d]">
              <table className="w-full text-left text-xs text-[#c9d1d9]">
                <thead className="bg-[#0d1117] text-[#8b949e] uppercase font-mono text-[11px] border-b border-[#30363d]">
                  <tr>
                    <th className="p-3">String ID / Key</th>
                    <th className="p-3">บริบท</th>
                    <th className="p-3">ต้นฉบับ ({sourceLang.iso639_1})</th>
                    <th className="p-3">คำแปล ({targetLang.iso639_1})</th>
                    <th className="p-3 text-center">คะแนน</th>
                    <th className="p-3 text-center">สถานะ</th>
                    <th className="p-3 text-right">การกระทำ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d] bg-[#161b22]">
                  {filteredBatchResults.map((item) => (
                    <tr key={item.id} className="hover:bg-[#21262d]/50">
                      <td className="p-3 font-mono text-[#58a6ff] font-bold">{item.keyName}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-[10px] text-[#8b949e]">
                          {item.contextCategory}
                        </span>
                      </td>
                      <td className="p-3 text-white max-w-xs truncate">{item.sourceText}</td>
                      <td className="p-3 text-[#3fb950] font-medium max-w-xs truncate">{item.translatedText}</td>
                      <td className="p-3 text-center font-mono font-bold">
                        <span
                          className={
                            (item.metrics?.overallAccuracyScore || 0) >= 80
                              ? 'text-[#3fb950]'
                              : (item.metrics?.overallAccuracyScore || 0) >= 60
                              ? 'text-[#d29922]'
                              : 'text-[#f85149]'
                          }
                        >
                          {item.metrics?.overallAccuracyScore || 0}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.status === 'verified_pass'
                              ? 'bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40'
                              : item.status === 'verified_warning'
                              ? 'bg-[#d29922]/20 text-[#d29922] border border-[#d29922]/40'
                              : 'bg-[#f85149]/20 text-[#f85149] border border-[#f85149]/40'
                          }`}
                        >
                          {item.status === 'verified_pass' ? 'PASS' : item.status === 'verified_warning' ? 'WARN' : 'CRITICAL'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            if (item.suggestedFix) {
                              onApplyFix(item.suggestedFix);
                              onSwitchToConsole();
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-[#1f6feb]/20 hover:bg-[#1f6feb]/40 text-[#58a6ff] border border-[#1f6feb]/40 text-[11px] font-bold transition-all"
                        >
                          โหลดเข้าห้องแปล
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LocalizationVerificationDashboard;
