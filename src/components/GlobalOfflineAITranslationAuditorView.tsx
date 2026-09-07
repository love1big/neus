/**
 * ============================================================================
 * [THAI] หน้าจอมอนิเตอร์และศูนย์ตรวจการแปลภาษา AI ออฟไลน์ 8 มิติเชิงลึก
 * [ENGLISH] Global Offline AI Translation 8-Dimensional Audit & QA Studio View
 * ============================================================================
 *
 * วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 * - เป็นคอมโพเนนต์แสดงผลการตรวจสอบและประเมินคุณภาพการแปลภาษาออฟไลน์ 100%
 *   โดยใช้ `OfflineAITranslationAuditorNode` วิเคราะห์ 8 มิติหลัก:
 *   1. Grammar & Syntax: ไวยากรณ์ สอดคล้องประธาน-กริยา โครงสร้างประโยค
 *   2. Semantic Fidelity: การรักษาแก่นความหมายแท้จริง ไม่ตกหล่นหรือบิดเบือน
 *   3. Hallucination Risk: ป้องกัน AI กุคำศัพท์/แต่งประโยคเอง วนลูปหลอน
 *   4. Register & Politeness: ระดับภาษา ความสุภาพ ตรงตามที่ตั้งค่า
 *   5. Glossary Adherence: การรักษากฎคำศัพท์เฉพาะและชื่อทางเทคนิค
 *   6. Length Balance: สัดส่วนความยาวของประโยคตามธรรมชาติภาษา
 *   7. Script & Punctuation: อักขรวิธี ระบบวรรคตอน และทิศทางอักษร
 *   8. Cultural Appropriateness: ความเหมาะสมทางบริบทวัฒนธรรมและสำนวน
 * - แสดงคะแนน Overall Health Score (0-100) และเกรดคุณภาพ (A+, A, B, C, D, F)
 * - มีระบบ 1-Click "นำคำแนะนำที่แก้ไขแล้วไปใช้ (Apply Auto-Corrected Suggestion)"
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - รับ props จาก `GlobalOfflineAITranslationStudio.tsx`
 * - ใช้งาน Type Definition จาก `../types/offlineTranslation70`
 *
 * @author Global Offline AI Translation Directorate & NexusEngine Core Team
 */

import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
  ArrowRight,
  RefreshCw,
  BookOpen,
  Sliders,
  Check,
  Zap,
  Globe
} from 'lucide-react';
import {
  GlobalLanguageProfile,
  TranslationAuditReport
} from '../types/offlineTranslation70';

interface GlobalOfflineAITranslationAuditorViewProps {
  auditReport: TranslationAuditReport | null;
  sourceText: string;
  translatedText: string;
  sourceLang: GlobalLanguageProfile;
  targetLang: GlobalLanguageProfile;
  onApplyFix: (correctedText: string) => void;
  onSwitchToTranslate: () => void;
}

export const GlobalOfflineAITranslationAuditorView: React.FC<GlobalOfflineAITranslationAuditorViewProps> = ({
  auditReport,
  sourceText,
  translatedText,
  sourceLang,
  targetLang,
  onApplyFix,
  onSwitchToTranslate
}) => {
  if (!auditReport) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8b949e] bg-[#0d1117]">
        <ShieldCheck size={48} className="text-[#30363d] mb-4 animate-pulse" />
        <h3 className="text-base font-bold text-white mb-1">ยังไม่มีข้อมูลผลการแปลเพื่อตรวจสอบ</h3>
        <p className="text-xs text-[#8b949e] max-w-md mb-4">
          กรุณาแปลข้อความในห้องแปลภาษาเรียลไทม์ เพื่อให้ AI Offline ดำเนินการตรวจสอบคุณภาพแบบ 8 มิติ
        </p>
        <button
          onClick={onSwitchToTranslate}
          className="px-4 py-2 bg-[#1f6feb] hover:bg-[#388bfd] text-white text-xs font-semibold rounded-lg transition-all"
        >
          กลับไปที่ห้องแปลภาษา
        </button>
      </div>
    );
  }

  // กำหนดสีและ Badge ตามเกรด
  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-[#238636] text-white border-[#2ea043]';
      case 'B':
        return 'bg-[#1f6feb] text-white border-[#388bfd]';
      case 'C':
        return 'bg-[#d29922] text-black border-[#e3b341]';
      case 'D':
        return 'bg-[#db6d28] text-white border-[#f0883e]';
      default:
        return 'bg-[#da3633] text-white border-[#f85149]';
    }
  };

  const getDimensionStatusBadge = (status: 'pass' | 'info' | 'warning' | 'critical') => {
    switch (status) {
      case 'pass':
        return {
          icon: <CheckCircle2 size={13} className="text-[#3fb950]" />,
          text: 'สมบูรณ์ (PASS)',
          bg: 'bg-[#238636]/15 text-[#3fb950] border-[#238636]/30'
        };
      case 'info':
        return {
          icon: <Info size={13} className="text-[#58a6ff]" />,
          text: 'ข้อสังเกต (INFO)',
          bg: 'bg-[#1f6feb]/15 text-[#58a6ff] border-[#1f6feb]/30'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={13} className="text-[#d29922]" />,
          text: 'เฝ้าระวัง (WARN)',
          bg: 'bg-[#d29922]/15 text-[#d29922] border-[#d29922]/30'
        };
      case 'critical':
        return {
          icon: <XCircle size={13} className="text-[#f85149]" />,
          text: 'มีข้อผิดพลาด (FAIL)',
          bg: 'bg-[#da3633]/15 text-[#f85149] border-[#da3633]/30'
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto p-6 space-y-6">
      {/* 1. Header Overview & Health Score Gauge */}
      <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40">
              <ShieldCheck size={24} />
            </span>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>ศูนย์ตรวจการแปลภาษา AI ออฟไลน์ 8 มิติ</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40">
                  OFFLINE 100%
                </span>
              </h2>
              <p className="text-xs text-[#8b949e]">
                วิเคราะห์โครงสร้างไวยากรณ์ ความหมายแท้จริง การป้องกันการหลอน และความเหมาะสมทางวัฒนธรรม
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs pt-1">
            <span className="text-[#8b949e]">
              คู่ภาษา: <b className="text-white">{sourceLang.nameThai} ({sourceLang.nativeName})</b>
            </span>
            <ArrowRight size={12} className="text-[#8b949e]" />
            <span className="text-[#8b949e]">
              ภาษาเป้าหมาย: <b className="text-[#38bdf8]">{targetLang.nameThai} ({targetLang.nativeName})</b>
            </span>
          </div>
        </div>

        {/* Score Display Card */}
        <div className="flex items-center space-x-4 bg-[#0d1117] p-4 rounded-xl border border-[#30363d] shrink-0">
          <div className="text-center">
            <div className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-0.5">คะแนนคุณภาพรวม</div>
            <div className="text-3xl font-extrabold text-white font-mono flex items-baseline justify-center">
              <span>{auditReport.overallHealthScore}</span>
              <span className="text-xs text-[#8b949e] font-normal ml-0.5">/100</span>
            </div>
          </div>

          <div className="h-10 w-px bg-[#30363d]" />

          <div className="text-center">
            <div className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-0.5">เกรดคุณภาพ</div>
            <div
              className={`text-xl font-black px-3 py-1 rounded-lg border font-mono ${getGradeBadgeColor(
                auditReport.grade
              )}`}
            >
              {auditReport.grade}
            </div>
          </div>

          <div className="h-10 w-px bg-[#30363d]" />

          <div className="text-left text-xs">
            <div className="text-[#8b949e]">สถานะ:</div>
            <div
              className={`font-semibold flex items-center space-x-1 ${
                auditReport.overallHealthScore >= 80 ? 'text-[#3fb950]' : 'text-[#d29922]'
              }`}
            >
              {auditReport.overallHealthScore >= 80 ? (
                <>
                  <CheckCircle2 size={13} />
                  <span>ผ่านเกณฑ์มาตรฐาน</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={13} />
                  <span>ควรปรับปรุง</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Text Comparison & Quick Fix Suggestion */}
      <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <BookOpen size={14} className="text-[#58a6ff]" />
            <span>เปรียบเทียบข้อความต้นฉบับและผลลัพธ์</span>
          </h3>
          <button
            onClick={onSwitchToTranslate}
            className="text-xs text-[#58a6ff] hover:underline flex items-center space-x-1"
          >
            <span>แก้ไขข้อความในห้องแปล</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
            <span className="text-[#8b949e] font-semibold block">ต้นฉบับ ({sourceLang.nameThai}):</span>
            <p className="text-[#c9d1d9] leading-relaxed">{sourceText}</p>
          </div>

          <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
            <span className="text-[#38bdf8] font-semibold block">ผลการแปลปัจจุบัน ({targetLang.nameThai}):</span>
            <p className="text-[#38bdf8] font-medium leading-relaxed">{translatedText}</p>
          </div>
        </div>

        {/* Auto-Corrected Suggestion Banner */}
        {auditReport.autoCorrectedSuggestion && auditReport.autoCorrectedSuggestion !== translatedText && (
          <div className="p-4 rounded-lg bg-[#238636]/10 border border-[#238636]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#3fb950]">
                <Sparkles size={14} />
                <span>AI ข้อเสนอแนะประโยคที่แก้ไขสมบูรณ์แล้ว (Auto-Corrected Suggestion):</span>
              </div>
              <p className="text-xs text-white font-medium pl-5">{auditReport.autoCorrectedSuggestion}</p>
            </div>

            <button
              onClick={() => onApplyFix(auditReport.autoCorrectedSuggestion!)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded-lg transition-all shrink-0 shadow-sm"
            >
              <Check size={13} />
              <span>นำไปใช้ทันที</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. 8-Dimensional Quality Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Sliders size={14} className="text-[#d2a8ff]" />
            <span>ผลการประเมินเจาะลึก 8 มิติ (8-Dimensional Evaluation Matrix)</span>
          </h3>
          <span className="text-xs text-[#8b949e]">เกณฑ์มาตรฐาน AI ออฟไลน์ 70++ ภาษา</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(auditReport.dimensions).map(([key, dim]) => {
            const statusBadge = getDimensionStatusBadge(dim.status);
            return (
              <div
                key={key}
                className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between space-y-3 hover:border-[#484f58] transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{dim.nameTh}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center space-x-1 ${statusBadge.bg}`}
                    >
                      {statusBadge.icon}
                      <span>{statusBadge.text}</span>
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-[#8b949e] font-mono text-[11px]">{dim.nameEn}</span>
                    <span className="font-bold font-mono text-[#58a6ff]">{dim.score}/100</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        dim.score >= 85
                          ? 'bg-[#238636]'
                          : dim.score >= 70
                          ? 'bg-[#1f6feb]'
                          : dim.score >= 50
                          ? 'bg-[#d29922]'
                          : 'bg-[#da3633]'
                      }`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-[#8b949e] leading-relaxed border-t border-[#30363d]/60 pt-2">
                  {dim.summaryTh}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Identified Issues & Recommendations List */}
      <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <AlertTriangle size={14} className="text-[#d29922]" />
            <span>รายการข้อควรระวังและคำแนะนำ ({auditReport.detectedIssues.length} รายการ)</span>
          </h3>
          <span className="text-xs text-[#8b949e]">
            {auditReport.detectedIssues.filter((i) => i.severity === 'critical').length} ข้อผิดพลาดวิกฤต,{' '}
            {auditReport.detectedIssues.filter((i) => i.severity === 'warning').length} ข้อควรระวัง
          </span>
        </div>

        {auditReport.detectedIssues.length === 0 ? (
          <div className="p-4 rounded-lg bg-[#238636]/10 border border-[#238636]/30 text-center text-xs text-[#3fb950] flex items-center justify-center space-x-2">
            <CheckCircle2 size={16} />
            <span>ไม่พบข้อผิดพลาด การแปลมีความถูกต้อง แม่นยำ และสอดคล้องตามหลักภาษาสมบูรณ์</span>
          </div>
        ) : (
          <div className="divide-y divide-[#30363d] border border-[#30363d] rounded-lg overflow-hidden">
            {auditReport.detectedIssues.map((issue) => (
              <div key={issue.id} className="p-3.5 bg-[#0d1117] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#161b22] transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        issue.severity === 'critical'
                          ? 'bg-[#da3633]/20 text-[#f85149] border-[#da3633]'
                          : issue.severity === 'warning'
                          ? 'bg-[#d29922]/20 text-[#d29922] border-[#d29922]'
                          : 'bg-[#1f6feb]/20 text-[#58a6ff] border-[#1f6feb]'
                      }`}
                    >
                      {issue.severity}
                    </span>
                    <span className="text-xs font-semibold text-white">{issue.titleTh}</span>
                    {issue.affectedSegment && (
                      <span className="text-xs font-mono text-[#d2a8ff] bg-[#21262d] px-2 py-0.5 rounded">
                        "{issue.affectedSegment}"
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#c9d1d9] pl-1">{issue.descriptionTh}</p>
                  {issue.suggestedFix && (
                    <p className="text-[11px] text-[#3fb950] pl-1">
                      💡 <b>คำแนะนำ/ทางเลือก:</b> {issue.suggestedFix}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalOfflineAITranslationAuditorView;
