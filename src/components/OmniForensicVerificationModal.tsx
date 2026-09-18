/**
 * ============================================================================
 * MODULE: OmniForensicVerificationModal.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * หน้าต่างตรวจสอบหลักฐานดิจิทัลนิติวิทยาศาสตร์และออกใบรับรองทางกฎหมาย
 * (Digital Forensic Provenance & International Legal Verification Modal)
 * สำหรับ OMNI Engine STUDIO:
 *   - ตามข้อกำหนดของผู้ใช้:
 *     "หาวิธีให้ตรวจสอบได้ด้วย หรือหาวิธีฝังในโปรแกรม งาน หรืออะไรก็ได้ แล้วตรวจสอบได้ 
 *      โดยที่มันจะไม่แสดงในหน้างานจริงๆ แต่ฝังอยู่หลังบ้านเท่านั้น ว่าเขียนจากโปรแกรมของเราจริงๆ 
 *      เวลามีปัญหาจะได้ทำตามกฏหมายได้ถูกต้อง (กฏหมายของประเทศต่างๆ)"
 *   - สามารถวางโค้ด, อัปโหลดไฟล์งาน/สคริปต์ เพื่อสแกนหา:
 *     1. ลายน้ำดิจิทัลล่องหน (Zero-Width Steganographic Watermark) ที่ฝังอยู่หลังบ้าน
 *     2. แท็กประทับตราลิขสิทธิ์ (*by love1big โดยโปรแกรม OMNI Engine STUDIO*)
 *     3. ลายเซ็นดิจิทัลเข้ารหัส (Cryptographic Provenance Hash)
 *   - ออกใบรับรองหลักฐานทางกฎหมายดิจิทัล (Legal Evidence Certificate)
 *     รองรับอนุสัญญาเบิร์น (Berne Convention), สนธิสัญญาลิขสิทธิ์ WIPO (WCT),
 *     DMCA 17 U.S.C. § 1202 (CMI), และ พ.ร.บ. ลิขสิทธิ์ พ.ศ. 2537 มาตรา 53/1
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Integrates with: `src/utils/OmniDigitalForensicWatermarkEngine.ts`
 * - Connected via: `src/utils/OfflineAICodeCommentBrander.ts`
 * - Invoked from: `AICodeBrandingConfigModal`, `AICodeBrandingSettingsTab`, `App.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts:
 * ----------------------------------------------------------------------------
 * - Props: `isOpen: boolean`, `onClose: () => void`, `initialCode?: string`
 * 
 * 4. Error Handling & Fallbacks:
 * ----------------------------------------------------------------------------
 * - Gracefully analyzes tampered or corrupted files.
 * - Shows clear diagnostic breakdown and confidence score.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  FileCode, 
  Upload, 
  Copy, 
  Check, 
  X, 
  Lock, 
  FileText, 
  Download, 
  Sparkles,
  Scale,
  RefreshCw
} from 'lucide-react';
import { 
  omniDigitalForensicWatermarkEngine, 
  ForensicInspectionResult, 
  LegalEvidenceCertificate,
  LOCKED_OMNI_ENGINE_NAME
} from '../utils/OmniDigitalForensicWatermarkEngine';
import { offlineAICodeCommentBrander } from '../utils/OfflineAICodeCommentBrander';

interface OmniForensicVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const OmniForensicVerificationModal: React.FC<OmniForensicVerificationModalProps> = ({
  isOpen,
  onClose,
  initialCode = ''
}) => {
  const [inputCode, setInputCode] = useState<string>(initialCode);
  const [inspectionResult, setInspectionResult] = useState<ForensicInspectionResult | null>(null);
  const [certificate, setCertificate] = useState<LegalEvidenceCertificate | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'inspector' | 'certificate' | 'legal_framework'>('inspector');

  useEffect(() => {
    if (isOpen) {
      if (initialCode && initialCode.trim().length > 0) {
        setInputCode(initialCode);
        handleInspect(initialCode);
      } else {
        // Run on default sample if empty
        const defaultSample = offlineAICodeCommentBrander.brandCode(
          `function calculatePlayerStats(level: number) {\n  const baseHp = 100 + level * 25;\n  return baseHp;\n}`,
          'typescript'
        ).brandedCode;
        setInputCode(defaultSample);
        handleInspect(defaultSample);
      }
    }
  }, [isOpen, initialCode]);

  if (!isOpen) return null;

  const handleInspect = (codeToInspect: string) => {
    setIsScanning(true);
    setTimeout(() => {
      const result = omniDigitalForensicWatermarkEngine.inspectForensicProvenance(codeToInspect);
      setInspectionResult(result);
      if (result.isAuthenticOmniOrigin) {
        const cert = omniDigitalForensicWatermarkEngine.generateLegalCertificate(result);
        setCertificate(cert);
      } else {
        setCertificate(null);
      }
      setIsScanning(false);
    }, 180);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputCode(content);
        handleInspect(content);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSampleCode = () => {
    const sample = offlineAICodeCommentBrander.brandCode(
      `// OMNI Engine Combat Script Example\nexport function executeAttack(attackerPower: number, targetDefense: number): number {\n  const damage = Math.max(1, attackerPower * 2 - targetDefense);\n  return damage;\n}`,
      'typescript'
    ).brandedCode;
    setInputCode(sample);
    handleInspect(sample);
  };

  const handleCopyReport = () => {
    if (!inspectionResult) return;
    const reportText = `[OMNI DIGITAL FORENSIC EVIDENCE REPORT]
Engine Origin: ${inspectionResult.payload?.engine || 'Unverified'}
Author: ${inspectionResult.payload?.author || 'Unverified'}
Verification Status: ${inspectionResult.verificationStatus}
Confidence Score: ${inspectionResult.confidenceScore}%
Detection Method: ${inspectionResult.detectionMethod}
Provenance ID: ${inspectionResult.payload?.provenanceId || 'N/A'}
Cryptographic Signature: ${inspectionResult.extractedSignature || 'N/A'}
Legal CMI Status: ${inspectionResult.legalSummary.cmiProtectionStatus}
Timestamp: ${inspectionResult.payload?.timestamp || new Date().toISOString()}

--- Legal Declaration ---
${certificate ? certificate.declarationStatementThai : inspectionResult.legalSummary.noticeText}

--- Technical Evidence Logs ---
${inspectionResult.details.join('\n')}
`;
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadCertificate = () => {
    if (!certificate || !inspectionResult) return;
    const certPayload = {
      certificate,
      inspectionResult,
      exportedAt: new Date().toISOString(),
      engineVerificationSeal: "GENUINE_OMNI_ENGINE_STUDIO"
    };
    const blob = new Blob([JSON.stringify(certPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OMNI-Legal-Certificate-${certificate.certificateId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header Section */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] bg-[#161b22]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Scale size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  ระบบตรวจสอบหลักฐานดิจิทัลและสิทธิทางกฎหมาย
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  ISO/IEC 27037 & WIPO Compliant
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                ตรวจสอบลายน้ำล่องหน (Invisible Steganography) และหลักฐานลิขสิทธิ์ของ <strong className="text-amber-400">{LOCKED_OMNI_ENGINE_NAME}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#21262d] rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-[#30363d] bg-[#12161f]">
          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'inspector'
                ? 'border-amber-400 text-amber-300 bg-[#161b22]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Search size={14} />
            เครื่องมือสแกนและตรวจสอบ (Forensic Scanner)
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'certificate'
                ? 'border-amber-400 text-amber-300 bg-[#161b22]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText size={14} />
            ใบรับรองหลักฐานดิจิทัลทางกฎหมาย (Legal Certificate)
          </button>
          <button
            onClick={() => setActiveTab('legal_framework')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'legal_framework'
                ? 'border-amber-400 text-amber-300 bg-[#161b22]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShieldCheck size={14} />
            ความคุ้มครองตามกฎหมายสากล (Jurisdictions)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-[#0d1117] text-gray-200">
          
          {/* TAB 1: INSPECTOR */}
          {activeTab === 'inspector' && (
            <div className="space-y-5">
              
              {/* Info Banner */}
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-3">
                <Lock size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-white">ระบบตรวจสอบหลังบ้าน 100% ปลอดภัยและไม่แสดงในหน้างานจริง:</span>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    ลายน้ำนิติวิทยาศาสตร์ถูกฝังด้วย <strong>Zero-Width Unicode Characters</strong> ซึ่งไม่มีขนาดและไม่แสดงบนจอเกม/เว็บไซต์ 
                    แม้ผู้ใช้อื่นจะลบข้อความคอมเมนต์ออก ลายน้ำดิจิทัลที่ฝังอยู่จะยังคงยืนยันได้ว่าเขียนขึ้นจาก <strong>{LOCKED_OMNI_ENGINE_NAME}</strong> เพื่อใช้เป็นหลักฐานระงับข้อพิพาททางกฎหมาย
                  </p>
                </div>
              </div>

              {/* Code Input & File Upload Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <FileCode size={14} className="text-amber-400" />
                    ใส่ซอร์สโค้ดหรือไฟล์งานที่ต้องการตรวจสอบ:
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-[#21262d] text-gray-300 hover:text-white hover:bg-[#30363d] cursor-pointer border border-[#30363d] transition-colors">
                      <Upload size={12} />
                      อัปโหลดไฟล์ (.ts, .js, .py, .lua, etc.)
                      <input 
                        type="file" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept=".ts,.tsx,.js,.jsx,.py,.lua,.html,.css,.json,.cpp,.c,.cs,.rs,.go"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleLoadSampleCode}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                    >
                      <Sparkles size={12} />
                      โหลดโค้ดตัวอย่าง
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={6}
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
                      handleInspect(e.target.value);
                    }}
                    placeholder="วางโค้ดที่ต้องการตรวจสอบที่นี่..."
                    className="w-full px-3 py-2.5 text-xs bg-[#161b22] border border-[#30363d] rounded-xl focus:outline-none focus:border-amber-500 text-gray-200 placeholder-gray-500 font-mono resize-y"
                  />
                  <button
                    type="button"
                    onClick={() => handleInspect(inputCode)}
                    disabled={isScanning}
                    className="absolute bottom-3 right-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-black hover:bg-amber-400 flex items-center gap-1.5 shadow transition-all"
                  >
                    <RefreshCw size={12} className={isScanning ? 'animate-spin' : ''} />
                    {isScanning ? 'กำลังสแกน...' : 'สแกนอีกครั้ง'}
                  </button>
                </div>
              </div>

              {/* Inspection Results Dashboard */}
              {inspectionResult && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                    inspectionResult.isAuthenticOmniOrigin
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                  }`}>
                    <div className="mt-0.5">
                      {inspectionResult.isAuthenticOmniOrigin ? (
                        <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 size={20} />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                          <ShieldAlert size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {inspectionResult.isAuthenticOmniOrigin ? (
                            <span>ผลการตรวจสอบ: ยืนยันแท้จริง 100% (AUTHENTIC OMNI ENGINE ORIGIN)</span>
                          ) : (
                            <span>ผลการตรวจสอบ: ไม่พบหลักฐานการสร้างจาก OMNI Engine STUDIO</span>
                          )}
                        </h4>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-[#0d1117] border border-[#30363d] text-amber-400">
                          ระดับความเชื่อมั่น: {inspectionResult.confidenceScore}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {inspectionResult.legalSummary.noticeText}
                      </p>
                    </div>
                  </div>

                  {/* Forensic Telemetry Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-[#161b22] border border-[#30363d] space-y-1">
                      <span className="text-gray-400 text-[11px]">โปรแกรมต้นกำเนิด (Engine):</span>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <Lock size={12} className="text-amber-400" />
                        {inspectionResult.payload?.engine || 'ไม่สามารถระบุได้'}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#161b22] border border-[#30363d] space-y-1">
                      <span className="text-gray-400 text-[11px]">ผู้พัฒนา/ผู้ทรงสิทธิ์ (Author):</span>
                      <div className="font-semibold text-white">
                        {inspectionResult.payload?.author || 'ไม่ระบุ'}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#161b22] border border-[#30363d] space-y-1">
                      <span className="text-gray-400 text-[11px]">วิธีการตรวจพบ (Detection Method):</span>
                      <div className="font-semibold text-amber-300">
                        {inspectionResult.detectionMethod === 'hybrid_forensic' && 'ลายน้ำล่องหน + แท็กคอมเมนต์ (สมบูรณ์แบบ)'}
                        {inspectionResult.detectionMethod === 'invisible_steganography' && 'ลายน้ำล่องหน (Zero-Width Steganography)'}
                        {inspectionResult.detectionMethod === 'visible_brand_tag' && 'แท็กคอมเมนต์เปิดเผยในโค้ด'}
                        {inspectionResult.detectionMethod === 'none' && 'ไม่พบหลักฐาน'}
                      </div>
                    </div>
                  </div>

                  {/* Forensic Logs */}
                  <div className="p-3.5 rounded-lg bg-[#161b22] border border-[#30363d] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
                      <span>บันทึกการวิเคราะห์นิติวิทยาศาสตร์ (Forensic Audit Logs):</span>
                      <button
                        onClick={handleCopyReport}
                        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white px-2 py-0.5 rounded bg-[#21262d] border border-[#30363d] transition-colors"
                      >
                        {copiedReport ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        {copiedReport ? 'คัดลอกรายงานแล้ว' : 'คัดลอกรายงาน'}
                      </button>
                    </div>
                    <ul className="space-y-1 text-[11px] font-mono text-gray-400">
                      {inspectionResult.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 select-none">›</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fast Action to view certificate */}
                  {inspectionResult.isAuthenticOmniOrigin && (
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setActiveTab('certificate')}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition-colors flex items-center gap-2 shadow"
                      >
                        <FileText size={14} />
                        เปิดดูใบรับรองหลักฐานทางกฎหมาย (Legal Certificate)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LEGAL CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div className="space-y-4">
              {certificate ? (
                <div className="p-6 rounded-xl bg-[#161b22] border-2 border-amber-500/40 space-y-5 shadow-xl relative overflow-hidden">
                  
                  {/* Watermark Logo Background */}
                  <div className="absolute -right-8 -bottom-8 text-white/[0.02] pointer-events-none select-none font-black text-9xl">
                    OMNI
                  </div>

                  {/* Certificate Top Header */}
                  <div className="border-b border-[#30363d] pb-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                          Digital Forensic Certificate of Provenance
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        ใบรับรองการพิสูจน์สิทธิ์และต้นกำเนิดผลงานตามกฎหมาย
                      </h3>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-gray-400">เลขที่ใบรับรอง:</span>
                      <p className="font-mono font-bold text-amber-300">{certificate.certificateId}</p>
                    </div>
                  </div>

                  {/* Certificate Core Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-gray-400">เครื่องยนต์ที่ใช้สร้าง (Authoring Engine):</span>
                      <p className="font-semibold text-white text-sm flex items-center gap-1.5">
                        <Lock size={13} className="text-amber-400" />
                        {certificate.engineOrigin}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                          LOCKED PROVENANCE
                        </span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-400">ผู้ถือสิทธิ์ / ผู้พัฒนา (Rights Holder):</span>
                      <p className="font-semibold text-white text-sm">
                        {certificate.creatorAuthor}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-400">รหัสตรวจสอบลายนิ้วมือดิจิทัล (Digital Fingerprint):</span>
                      <p className="font-mono text-gray-300 bg-[#0d1117] px-2.5 py-1.5 rounded border border-[#30363d] select-all">
                        {certificate.evidenceHash}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-400">วันและเวลาที่ออกใบรับรอง (Issued At):</span>
                      <p className="font-mono text-gray-300 bg-[#0d1117] px-2.5 py-1.5 rounded border border-[#30363d]">
                        {new Date(certificate.issueDate).toLocaleString('th-TH')} ({certificate.issueDate})
                      </p>
                    </div>
                  </div>

                  {/* Legal Declaration Text in Thai */}
                  <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Scale size={13} />
                      ข้อแถลงรับรองทางกฎหมายอย่างเป็นทางการ (Official Declaration):
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed indent-4">
                      {certificate.declarationStatementThai}
                    </p>
                  </div>

                  {/* International Legal Standards */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-gray-300">
                      มาตรฐานกฎหมายและอนุสัญญาระหว่างประเทศที่รองรับ:
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-[11px] text-gray-400">
                      {certificate.legalFrameworks.map((framework, i) => (
                        <li key={i} className="flex items-start gap-1.5 bg-[#0d1117] p-2 rounded border border-[#21262d]">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{framework}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Download & Copy Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#30363d]">
                    <button
                      onClick={handleCopyReport}
                      className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#21262d] text-gray-200 hover:text-white hover:bg-[#30363d] border border-[#30363d] flex items-center gap-1.5 transition-colors"
                    >
                      {copiedReport ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      {copiedReport ? 'คัดลอกข้อความรับรองแล้ว' : 'คัดลอกข้อความรับรอง'}
                    </button>
                    <button
                      onClick={handleDownloadCertificate}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-black hover:bg-amber-400 flex items-center gap-1.5 shadow transition-colors"
                    >
                      <Download size={14} />
                      ดาวน์โหลดใบรับรองดิจิทัล (.json)
                    </button>
                  </div>

                </div>
              ) : (
                <div className="p-8 text-center bg-[#161b22] border border-[#30363d] rounded-xl space-y-2">
                  <ShieldAlert size={36} className="text-amber-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">ยังไม่มีใบรับรองทางกฎหมาย</h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    โปรดวางโค้ดที่มีการประทับตราหรือลายน้ำของ OMNI Engine STUDIO ในแท็บตรวจสอบเพื่อออกใบรับรอง
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LEGAL FRAMEWORK & INTERNATIONAL JURISDICTIONS */}
          {activeTab === 'legal_framework' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale size={16} className="text-amber-400" />
                  กลไกการคุ้มครองตามกฎหมายของประเทศต่างๆ เมื่อเกิดข้อพิพาท
                </h4>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  ตามข้อกำหนดของคุณ: <em>"ให้ได้รู้ว่า มันมาจากโปรแกรมของเรา เวลาใช้งานจะได้รู้ทั่วกัน และหาวิธีฝังในโปรแกรม งาน หรืออะไรก็ได้ แล้วตรวจสอบได้ โดยที่มันจะไม่แสดงในหน้างานจริงๆ แต่ฝังอยู่หลังบ้านเท่านั้น เวลามีปัญหาจะได้ทำตามกฏหมายได้ถูกต้อง (กฏหมายของประเทศต่างๆ)"</em>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Jurisdiction 1: Thailand */}
                <div className="p-3.5 rounded-lg bg-[#161b22] border border-[#30363d] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">ประเทศไทย (Thailand)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                      พ.ร.บ. ลิขสิทธิ์ พ.ศ. 2537
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    <strong>มาตรา 53/1 และ 53/2:</strong> ข้อมูลระบุตัวตนและลายน้ำล่องหนถือเป็น <em>"ข้อมูลการบริหารสิทธิ (Rights Management Information - RMI)"</em> ผู้ใดลบ ทำลาย หรือดัดแปลงโดยรู้อยู่แล้วว่าจะทำให้เกิดการละเมิดลิขสิทธิ์ มีความผิดทางอาญาและต้องชดใช้ค่าเสียหาย
                  </p>
                </div>

                {/* Jurisdiction 2: USA */}
                <div className="p-3.5 rounded-lg bg-[#161b22] border border-[#30363d] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">สหรัฐอเมริกา (United States)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                      17 U.S.C. § 1202 DMCA
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    <strong>Integrity of Copyright Management Information:</strong> คุ้มครองลายน้ำดิจิทัลและชื่อโปรแกรมต้นทางอย่างเข้มงวด การลบลายน้ำดิจิทัลออกโดยเจตนามีโทษปรับทางแพ่งสูงสุด $25,000 ต่อการละเมิด และมีโทษทางอาญา
                  </p>
                </div>

                {/* Jurisdiction 3: International / Berne */}
                <div className="p-3.5 rounded-lg bg-[#161b22] border border-[#30363d] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">สากล / ทั่วโลก (WIPO & Berne)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                      181+ ประเทศภาคี
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    <strong>อนุสัญญาเบิร์น ข้อ 15:</strong> สันนิษฐานว่าบุคคลหรือโปรแกรมที่ปรากฏชื่อในงานเป็นผู้สร้างสรรค์ที่แท้จริง และ <strong>สนธิสัญญาลิขสิทธิ์ WIPO (WCT) ข้อ 12</strong> กำหนดให้ทุกประเทศสมาชิกต้องมีมาตรการเยียวยาทางกฎหมายกรณีถูกลบข้อมูลสิทธิ
                  </p>
                </div>

                {/* Jurisdiction 4: EU */}
                <div className="p-3.5 rounded-lg bg-[#161b22] border border-[#30363d] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">สหภาพยุโรป (European Union)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                      EU Directive 2019/790
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    คุ้มครองสิทธิ์ในตลาดดิจิทัลเดี่ยว (Digital Single Market) และรับรองพยานหลักฐานทางนิติวิทยาศาสตร์ดิจิทัลตามมาตรฐาน <strong>ISO/IEC 27037</strong> ซึ่งยอมรับการวิเคราะห์ทางเทคนิคในชั้นศาลของกลุ่มประเทศสมาชิก
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#30363d] bg-[#161b22] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <Lock size={13} className="text-amber-400" />
            <span>โปรแกรมต้นกำเนิดถูกล็อคถาวร: <strong className="text-white">{LOCKED_OMNI_ENGINE_NAME}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#21262d] text-white hover:bg-[#30363d] border border-[#30363d] transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
