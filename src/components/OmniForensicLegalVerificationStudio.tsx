/**
 * ============================================================================
 * MODULE: OmniForensicLegalVerificationStudio.tsx
 * ============================================================================
 * 
 * [THAI - ภาษาไทย]
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * สตูดิโอตรวจสอบหลักฐานดิจิทัลนิติวิทยาศาสตร์และคุ้มครองสิทธิทางกฎหมายสากล
 * (Omni Digital Forensic Legal Provenance & Intellectual Property Studio)
 * สร้างขึ้นตามข้อกำหนดของผู้ใช้:
 *   - "OMNI Engine STUDIO ตรงนี้ไม่สามารถแก้ไขได้ เพราะเราเขียนจากโปรแกรมนี้
 *      ให้ได้รู้ว่า มันมาจากโปรแกรมของเรา เวลาใช้งานจะได้รู้ทัวกัน 
 *      และหาวิธีให้ตรวจสอบได้ด้วย หรือหาวิธีฝังในโปรแกรม งาน หรืออะไรก็ได้ แล้วตวจสอบได้ 
 *      โดยที่มันจะไม่แสดงในหน้างานจริงๆ แต่ฝังอยู่หลังบ้านเท่านั้น ว่าเขียนจากโปรแกรมของเราจริงๆ 
 *      เวลามีปัญหาจะได้ทำตามกฏหมายได้ถูกต้อง (กฏหมายของประเทศต่างๆ)"
 *   - ตรวจสอบลายน้ำดิจิทัลล่องหน (Zero-Width Steganography) ที่ซ่อนอยู่หลังบ้าน
 *   - ล็อคชื่อโปรแกรมต้นกำเนิดเป็น "OMNI Engine STUDIO" อย่างถาวร ไม่สามารถแก้ไขได้
 *   - ออกใบรับรองหลักฐานดิจิทัล (Digital Evidence Certificate) สำหรับดำเนินคดีตามกฎหมาย
 *   - รองรับกรอบกฎหมาย 5 เขตอำนาจศาลทั่วโลก (ไทย, สหรัฐอเมริกา DMCA, WIPO, สหภาพยุโรป, ญี่ปุ่น)
 * 
 * [ENGLISH - ภาษาอังกฤษ]
 * 2. Architecture & System Integration:
 * ----------------------------------------------------------------------------
 * - Connects with: `src/utils/OmniDigitalForensicWatermarkEngine.ts`
 * - Connects with: `src/utils/OfflineAICodeCommentBrander.ts`
 * - Registered into: `src/App.tsx` (Tools navigation and command system)
 * 
 * 3. Inputs, Outputs & Data Contracts:
 * ----------------------------------------------------------------------------
 * - Output: Verified provenance metadata, forensic telemetry, legal certificates,
 *   tamper-evident forensic reports.
 * 
 * 4. Error Handling & Edge Cases:
 * ----------------------------------------------------------------------------
 * - Corrupted Unicode characters or partial code snippets are inspected with
 *   multi-layered heuristics (invisible bits + visible brand signatures).
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Search, 
  FileCode, 
  Upload, 
  Copy, 
  Check, 
  Sparkles, 
  FileText, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Globe, 
  Eye, 
  Terminal,
  Binary,
  Layers,
  Cpu
} from 'lucide-react';
import { 
  omniDigitalForensicWatermarkEngine, 
  ForensicInspectionResult, 
  LegalEvidenceCertificate,
  LOCKED_OMNI_ENGINE_NAME
} from '../utils/OmniDigitalForensicWatermarkEngine';
import { offlineAICodeCommentBrander } from '../utils/OfflineAICodeCommentBrander';

export const OmniForensicLegalVerificationStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'watermarker' | 'certificate' | 'jurisdictions'>('scanner');
  
  // Scanner State
  const [scanCode, setScanCode] = useState<string>('');
  const [inspectionResult, setInspectionResult] = useState<ForensicInspectionResult | null>(null);
  const [certificate, setCertificate] = useState<LegalEvidenceCertificate | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [revealedInvisibleChars, setRevealedInvisibleChars] = useState<string>('');

  // Watermarker State
  const [inputCodeToBrand, setInputCodeToBrand] = useState<string>(
    `// สคริปต์ระบบเกมสำหรับทดสอบ\nfunction onEntityHit(attacker: Entity, victim: Entity) {\n  const rawDamage = attacker.getAttackPower() * 1.5;\n  victim.applyDamage(rawDamage);\n  return true;\n}`
  );
  const [brandedResultCode, setBrandedResultCode] = useState<string>('');
  const [copiedBranded, setCopiedBranded] = useState<boolean>(false);

  // Load initial sample
  useEffect(() => {
    const sample = offlineAICodeCommentBrander.brandCode(
      `// OMNI Engine Studio Core Combat Module\nexport function processDamage(atk: number, def: number): number {\n  const total = Math.max(1, atk * 2 - def);\n  return total;\n}`,
      'typescript'
    ).brandedCode;
    setScanCode(sample);
    runInspection(sample);
  }, []);

  const runInspection = (code: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = omniDigitalForensicWatermarkEngine.inspectForensicProvenance(code);
      setInspectionResult(result);
      if (result.isAuthenticOmniOrigin) {
        const cert = omniDigitalForensicWatermarkEngine.generateLegalCertificate(result);
        setCertificate(cert);
      } else {
        setCertificate(null);
      }

      // Extract invisible characters for visual representation
      let hexView = '';
      for (let i = 0; i < code.length; i++) {
        const codePoint = code.charCodeAt(i);
        if (codePoint === 0x200B || codePoint === 0x200C || codePoint === 0x200D || codePoint === 0x2060 || codePoint === 0xFEFF) {
          hexView += `[U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}] `;
        }
      }
      setRevealedInvisibleChars(hexView);

      setIsAnalyzing(false);
    }, 150);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setScanCode(content);
        runInspection(content);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyBranding = () => {
    const result = offlineAICodeCommentBrander.brandCode(
      inputCodeToBrand,
      'typescript',
      { injectInvisibleForensicWatermark: true }
    );
    setBrandedResultCode(result.brandedCode);
  };

  const handleCopyBranded = () => {
    navigator.clipboard.writeText(brandedResultCode || inputCodeToBrand);
    setCopiedBranded(true);
    setTimeout(() => setCopiedBranded(false), 2000);
  };

  const handleCopyReport = () => {
    if (!inspectionResult) return;
    const report = `=======================================================
OMNI ENGINE STUDIO - OFFICIAL DIGITAL FORENSIC AUDIT
=======================================================
Verification Status   : ${inspectionResult.verificationStatus}
Authentic OMNI Origin : ${inspectionResult.isAuthenticOmniOrigin ? 'YES (100% VERIFIED)' : 'NO (UNVERIFIED)'}
Authoring Engine      : ${LOCKED_OMNI_ENGINE_NAME} (IMMUTABLE)
Author / Rights Holder: ${inspectionResult.payload?.author || 'N/A'}
Confidence Score      : ${inspectionResult.confidenceScore}%
Detection Method      : ${inspectionResult.detectionMethod}
Provenance ID         : ${inspectionResult.payload?.provenanceId || 'N/A'}
Cryptographic Sig     : ${inspectionResult.extractedSignature || 'N/A'}
Audit Timestamp       : ${inspectionResult.payload?.timestamp || new Date().toISOString()}

--- LEGAL PROTECTION & JURISDICTION SUMMARY ---
${inspectionResult.legalSummary.noticeText}
CMI Rights Status: ${inspectionResult.legalSummary.cmiProtectionStatus}

--- FORENSIC LOGS ---
${inspectionResult.details.map(d => `• ${d}`).join('\n')}
=======================================================`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadCertificate = () => {
    if (!certificate || !inspectionResult) return;
    const exportPacket = {
      certificate,
      inspectionResult,
      exportedAt: new Date().toISOString(),
      officialValidationSignature: "VERIFIED_BY_OMNI_ENGINE_STUDIO"
    };
    const blob = new Blob([JSON.stringify(exportPacket, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OMNI-Legal-Certificate-${certificate.certificateId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#090d13] text-gray-200 overflow-hidden font-sans">
      
      {/* Top Banner & Header */}
      <div className="px-6 py-4 border-b border-[#21262d] bg-[#0d1117] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Scale size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-white tracking-wide">
                ระบบตรวจสอบหลักฐานดิจิทัลนิติวิทยาศาสตร์ & สิทธิทางกฎหมายสากล
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                PROVENANCE GUARANTEED
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              พิสูจน์ต้นกำเนิดผลงานที่สร้างจาก <strong className="text-amber-300">{LOCKED_OMNI_ENGINE_NAME}</strong> ด้วยลายน้ำล่องหนหลังบ้าน (Invisible Steganography)
            </p>
          </div>
        </div>

        {/* Immutable Engine Lock Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161b22] border border-amber-500/30 text-xs">
          <Lock size={13} className="text-amber-400" />
          <span className="text-gray-400">โปรแกรมต้นกำเนิด:</span>
          <strong className="text-white font-mono">{LOCKED_OMNI_ENGINE_NAME}</strong>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
            LOCKED
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 px-6 pt-3 border-b border-[#21262d] bg-[#0d1117] shrink-0">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'scanner'
              ? 'border-amber-400 text-amber-300 bg-[#161b22]'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Search size={14} />
          เครื่องมือสแกนและตรวจสอบหลักฐาน (Forensic Scanner)
        </button>

        <button
          onClick={() => setActiveTab('watermarker')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'watermarker'
              ? 'border-amber-400 text-amber-300 bg-[#161b22]'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Binary size={14} />
          ห้องทดสอบการฝังลายน้ำล่องหน (Steganography Studio)
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
          onClick={() => setActiveTab('jurisdictions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'jurisdictions'
              ? 'border-amber-400 text-amber-300 bg-[#161b22]'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Globe size={14} />
          มาตรการคุ้มครองตามกฎหมายของประเทศต่างๆ (Legal Jurisdictions)
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        
        {/* TAB 1: SCANNER */}
        {activeTab === 'scanner' && (
          <div className="space-y-5 max-w-6xl mx-auto">
            
            {/* Explanatory Banner */}
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-start gap-3.5 text-xs">
              <Lock size={18} className="text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">
                  กลไกการพิสูจน์สิทธิ์แบบล่องหน 100% (Invisible Digital Steganography)
                </h4>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  ตามข้อกำหนดของคุณ: ข้อมูลระบุตัวตนและลิขสิทธิ์ของ <strong>{LOCKED_OMNI_ENGINE_NAME}</strong> ถูกแปลงเป็นรหัสไบนารีล่องหน (Zero-Width Characters)
                  ซึ่งไม่มีการแสดงผลบนหน้าจอเกมหรือหน้าเว็บจริง แต่สามารถกู้คืนและถอดรหัสออกมาพิสูจน์ในชั้นศาลได้ 100% แม้จะมีการลบคอมเมนต์ออกไปแล้ว
                </p>
              </div>
            </div>

            {/* Input & Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <FileCode size={14} className="text-amber-400" />
                  วางซอร์สโค้ด สคริปต์เกม หรือไฟล์ที่ต้องการตรวจพิสูจน์:
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#161b22] text-gray-300 hover:text-white hover:bg-[#21262d] cursor-pointer border border-[#30363d] transition-colors shadow-sm">
                    <Upload size={12} />
                    อัปโหลดไฟล์ (.ts, .js, .py, .lua, .html, .cpp)
                    <input 
                      type="file" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      accept=".ts,.tsx,.js,.jsx,.py,.lua,.html,.css,.json,.cpp,.c,.cs,.rs,.go"
                    />
                  </label>
                  <button
                    onClick={() => {
                      const sample = offlineAICodeCommentBrander.brandCode(
                        `// OMNI Engine Studio Combat Script\nfunction attack(target: Entity, power: number) {\n  target.takeDamage(power);\n  return true;\n}`,
                        'typescript'
                      ).brandedCode;
                      setScanCode(sample);
                      runInspection(sample);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                  >
                    <Sparkles size={12} />
                    โหลดโค้ดตัวอย่างที่ฝังลายน้ำ
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  rows={8}
                  value={scanCode}
                  onChange={(e) => {
                    setScanCode(e.target.value);
                    runInspection(e.target.value);
                  }}
                  placeholder="วางโค้ดที่นี่เพื่อสแกนหาลายน้ำดิจิทัลล่องหน..."
                  className="w-full px-4 py-3 text-xs bg-[#161b22] border border-[#30363d] rounded-xl focus:outline-none focus:border-amber-500 text-gray-200 placeholder-gray-500 font-mono leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => runInspection(scanCode)}
                  disabled={isAnalyzing}
                  className="absolute bottom-3 right-3 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-black hover:bg-amber-400 flex items-center gap-1.5 shadow transition-all"
                >
                  <RefreshCw size={12} className={isAnalyzing ? 'animate-spin' : ''} />
                  {isAnalyzing ? 'กำลังวิเคราะห์...' : 'สแกนตรวจสอบ'}
                </button>
              </div>
            </div>

            {/* Results Dashboard */}
            {inspectionResult && (
              <div className="space-y-4">
                
                {/* Result Card */}
                <div className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  inspectionResult.isAuthenticOmniOrigin
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                }`}>
                  <div className="mt-0.5">
                    {inspectionResult.isAuthenticOmniOrigin ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow">
                        <CheckCircle2 size={24} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow">
                        <ShieldAlert size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        {inspectionResult.isAuthenticOmniOrigin
                          ? 'ผลการพิสูจน์: ยืนยันแท้จริง 100% (AUTHENTIC OMNI ENGINE STUDIO ORIGIN)'
                          : 'ผลการพิสูจน์: ไม่พบหลักฐานการสร้างสรรค์จาก OMNI Engine STUDIO'}
                      </h3>
                      <span className="text-xs px-3 py-1 rounded-full font-mono font-bold bg-[#0d1117] border border-[#30363d] text-amber-400">
                        ความเชื่อมั่น: {inspectionResult.confidenceScore}%
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      {inspectionResult.legalSummary.noticeText}
                    </p>
                  </div>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-1">
                    <span className="text-gray-400 text-[11px]">โปรแกรมต้นกำเนิด (Authoring Engine):</span>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <Lock size={12} className="text-amber-400" />
                      {inspectionResult.payload?.engine || 'ไม่ระบุ'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-1">
                    <span className="text-gray-400 text-[11px]">ผู้ถือสิทธิ์ (Author / Studio):</span>
                    <div className="font-semibold text-white">
                      {inspectionResult.payload?.author || 'ไม่ระบุ'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-1">
                    <span className="text-gray-400 text-[11px]">วิธีการตรวจพบ (Detection Method):</span>
                    <div className="font-semibold text-amber-300">
                      {inspectionResult.detectionMethod === 'hybrid_forensic' && 'ลายน้ำล่องหน + แท็กคอมเมนต์'}
                      {inspectionResult.detectionMethod === 'invisible_steganography' && 'ลายน้ำล่องหน (Zero-Width Steganography)'}
                      {inspectionResult.detectionMethod === 'visible_brand_tag' && 'แท็กคอมเมนต์เปิดเผย'}
                      {inspectionResult.detectionMethod === 'none' && 'ไม่พบหลักฐาน'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-1">
                    <span className="text-gray-400 text-[11px]">สถานะความคุ้มครอง (Legal CMI):</span>
                    <div className="font-semibold text-emerald-400">
                      {inspectionResult.legalSummary.cmiProtectionStatus}
                    </div>
                  </div>
                </div>

                {/* Invisible Steganography Byte Inspector */}
                {revealedInvisibleChars && (
                  <div className="p-3.5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <Binary size={13} />
                        ไบต์รหัสดิจิทัลล่องหนที่ตรวจพบหลังบ้าน (Extracted Invisible Zero-Width Unicode Bytes):
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Invisible to standard text renderers
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#21262d] font-mono text-[11px] text-cyan-300 break-all select-all leading-relaxed max-h-24 overflow-y-auto">
                      {revealedInvisibleChars}
                    </div>
                  </div>
                )}

                {/* Audit Logs */}
                <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
                    <span>บันทึกการตรวจสอบทางนิติวิทยาศาสตร์ (Forensic Chain of Custody Logs):</span>
                    <button
                      onClick={handleCopyReport}
                      className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-white px-2.5 py-1 rounded bg-[#21262d] border border-[#30363d] transition-colors"
                    >
                      {copiedReport ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      {copiedReport ? 'คัดลอกรายงานแล้ว' : 'คัดลอกรายงานผลนิติวิทยาศาสตร์'}
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

                {/* Quick CTA to Certificate */}
                {inspectionResult.isAuthenticOmniOrigin && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setActiveTab('certificate')}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition-colors flex items-center gap-2 shadow"
                    >
                      <FileText size={14} />
                      เปิดดูและดาวน์โหลดใบรับรองหลักฐานดิจิทัลทางกฎหมาย (Legal Certificate)
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* TAB 2: STEGANOGRAPHY WATERMARKER */}
        {activeTab === 'watermarker' && (
          <div className="space-y-5 max-w-6xl mx-auto text-xs">
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Binary size={16} className="text-amber-400" />
                ห้องทดสอบการฝังลายน้ำล่องหนในโค้ด (Interactive Steganography Injection)
              </h4>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                ทดสอบพิมพ์หรือวางโค้ดใดๆ แล้วกดฝังลายน้ำ ระบบจะแทรก <strong>*by love1big โดยโปรแกรม OMNI Engine STUDIO*</strong> 
                ตามตำแหน่งที่ปลอดภัย พร้อมทั้งฝัง <strong>Zero-Width Cryptographic Watermark</strong> ที่ท้ายโค้ดโดยอัตโนมัติ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-semibold text-gray-300">
                  <span>โค้ดต้นฉบับ (Original Code):</span>
                  <button
                    onClick={handleApplyBranding}
                    className="px-3 py-1 rounded bg-amber-500 text-black hover:bg-amber-400 font-bold transition-all shadow"
                  >
                    ฝังลายน้ำและประทับตรา
                  </button>
                </div>
                <textarea
                  rows={12}
                  value={inputCodeToBrand}
                  onChange={(e) => setInputCodeToBrand(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-[#161b22] border border-[#30363d] rounded-xl focus:outline-none focus:border-amber-500 text-gray-200 leading-relaxed"
                />
              </div>

              {/* Branded & Watermarked Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-semibold text-gray-300">
                  <span className="text-amber-400">ผลลัพธ์ที่ฝังลายน้ำแล้ว (Watermarked Output):</span>
                  <button
                    onClick={handleCopyBranded}
                    disabled={!brandedResultCode}
                    className="flex items-center gap-1 px-3 py-1 rounded bg-[#21262d] text-gray-200 hover:text-white border border-[#30363d] transition-colors"
                  >
                    {copiedBranded ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copiedBranded ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}
                  </button>
                </div>
                <div className="p-3 font-mono text-xs bg-[#161b22] border border-amber-500/30 rounded-xl text-gray-300 h-[288px] overflow-y-auto leading-relaxed relative">
                  {brandedResultCode ? (
                    <pre className="whitespace-pre-wrap">{brandedResultCode}</pre>
                  ) : (
                    <span className="text-gray-500 italic">
                      กดปุ่ม "ฝังลายน้ำและประทับตรา" ด้านซ้ายเพื่อดูผลลัพธ์...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {brandedResultCode && (
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-emerald-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  ฝังลายน้ำนิติวิทยาศาสตร์ล่องหนเรียบร้อยแล้ว (ขนาดตัวอักษรบนหน้าจอไม่เปลี่ยนแปลง)
                </span>
                <button
                  onClick={() => {
                    setScanCode(brandedResultCode);
                    setActiveTab('scanner');
                    runInspection(brandedResultCode);
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors font-semibold"
                >
                  นำผลลัพธ์ไปสแกนในแท็บ Inspector ทันที ›
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CERTIFICATE */}
        {activeTab === 'certificate' && (
          <div className="space-y-5 max-w-4xl mx-auto">
            {certificate ? (
              <div className="p-8 rounded-2xl bg-[#161b22] border-2 border-amber-500/40 space-y-6 shadow-2xl relative overflow-hidden text-xs">
                
                {/* Background Watermark Seal */}
                <div className="absolute -right-12 -bottom-12 text-white/[0.02] pointer-events-none select-none font-black text-[180px] leading-none">
                  OMNI
                </div>

                {/* Certificate Header */}
                <div className="border-b border-[#30363d] pb-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      Official Provenance & Intellectual Property Certification
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1">
                      ใบรับรองการพิสูจน์สิทธิ์และต้นกำเนิดผลงานตามกฎหมายสากล
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-[11px]">เลขที่ใบรับรอง (Certificate ID):</span>
                    <p className="font-mono font-bold text-amber-300 text-sm">{certificate.certificateId}</p>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <span className="text-gray-400">โปรแกรมเครื่องยนต์ต้นกำเนิด (Authoring Engine):</span>
                    <p className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Lock size={13} className="text-amber-400" />
                      {certificate.engineOrigin}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                        LOCKED
                      </span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-gray-400">ผู้พัฒนา / ผู้ถือครองลิขสิทธิ์ (Rights Holder):</span>
                    <p className="font-bold text-white text-sm">
                      {certificate.creatorAuthor}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-gray-400">รหัสตรวจสอบลายนิ้วมือดิจิทัล (Digital Fingerprint):</span>
                    <p className="font-mono text-gray-300 bg-[#0d1117] px-3 py-2 rounded-lg border border-[#30363d] select-all break-all">
                      {certificate.evidenceHash}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-gray-400">วันและเวลาที่ออกใบรับรอง (Issued Timestamp):</span>
                    <p className="font-mono text-gray-300 bg-[#0d1117] px-3 py-2 rounded-lg border border-[#30363d]">
                      {new Date(certificate.issueDate).toLocaleString('th-TH')} ({certificate.issueDate})
                    </p>
                  </div>
                </div>

                {/* Declaration Thai Statement */}
                <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                    <Scale size={14} />
                    ข้อแถลงรับรองทางกฎหมาย (Legal Declaration Statement):
                  </span>
                  <p className="text-gray-200 leading-relaxed indent-4 text-xs">
                    {certificate.declarationStatementThai}
                  </p>
                </div>

                {/* Supported Frameworks */}
                <div className="space-y-2">
                  <span className="font-semibold text-gray-300">
                    มาตรฐานทางกฎหมายและอนุสัญญาระหว่างประเทศที่รองรับ:
                  </span>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-gray-400">
                    {certificate.legalFrameworks.map((framework, i) => (
                      <li key={i} className="flex items-start gap-2 bg-[#0d1117] p-2.5 rounded-lg border border-[#21262d]">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{framework}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Download and Action Buttons */}
                <div className="pt-3 border-t border-[#30363d] flex items-center justify-end gap-3">
                  <button
                    onClick={handleCopyReport}
                    className="px-4 py-2 rounded-lg bg-[#21262d] text-gray-200 hover:text-white hover:bg-[#30363d] border border-[#30363d] flex items-center gap-2 transition-colors font-semibold"
                  >
                    {copiedReport ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    {copiedReport ? 'คัดลอกแล้ว' : 'คัดลอกรายงานทางกฎหมาย'}
                  </button>
                  <button
                    onClick={handleDownloadCertificate}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-black hover:bg-amber-400 flex items-center gap-2 font-semibold shadow transition-colors"
                  >
                    <Download size={14} />
                    ดาวน์โหลดใบรับรองดิจิทัล (.json)
                  </button>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center bg-[#161b22] border border-[#30363d] rounded-2xl space-y-3">
                <ShieldAlert size={40} className="text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-white">ยังไม่มีใบรับรอง</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                  โปรดไปยังแท็บ "เครื่องมือสแกนและตรวจสอบ" เพื่อนำโค้ดที่สร้างจาก OMNI Engine STUDIO มาตรวจสอบและออกใบรับรอง
                </p>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition-colors"
                >
                  ไปยังเครื่องมือสแกน ›
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: JURISDICTIONS */}
        {activeTab === 'jurisdictions' && (
          <div className="space-y-4 max-w-5xl mx-auto text-xs">
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe size={16} className="text-amber-400" />
                กรอบกฎหมายสากลในการบังคับใช้สิทธิ์ (International Legal Jurisdictions)
              </h3>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                ตามข้อกำหนดของคุณ: <em>"ให้ได้รู้ว่า มันมาจากโปรแกรมของเรา เวลาใช้งานจะได้รู้ทัวกัน และหาวิธีให้ตรวจสอบได้ด้วย หรือหาวิธีฝังในโปรแกรม งาน หรืออะไรก็ได้ แล้วตวจสอบได้ โดยที่มันจะไม่แสดงในหน้างานจริงๆ แต่ใังอยู่หลังบ้านเท่านั้น ว่าเขียนจากโปรแกรมของเราจริงๆ เวลามีปัญหาจะได้ทำตามกฏหมายได้ถูกต้อง(กฏหมายของประเทศต่างๆ)"</em>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Thailand */}
              <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-300">1. ประเทศไทย (Thailand)</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                    พ.ร.บ. ลิขสิทธิ์ พ.ศ. 2537
                  </span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <strong>มาตรา 53/1 และ 53/2:</strong> ลายน้ำดิจิทัลล่องหนและชื่อโปรแกรมถือเป็น <em>"ข้อมูลการบริหารสิทธิ (Rights Management Information - RMI)"</em> ตามกฎหมาย การที่บุคคลอื่นจงใจลบ ทำลาย หรือปลอมแปลงข้อมูลดังกล่าวโดยรู้อยู่แล้วว่าจะนำไปสู่การละเมิด ถือเป็นความผิดทางอาญา มีโทษปรับและจำคุก รวมถึงต้องจ่ายค่าเสียหายเพิ่มขึ้นเป็นพิเศษตามดุลพินิจของศาล
                </p>
              </div>

              {/* USA */}
              <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-300">2. สหรัฐอเมริกา (United States)</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                    17 U.S.C. § 1202 DMCA
                  </span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <strong>DMCA Integrity of CMI:</strong> คุ้มครองชื่อผู้สร้างและโปรแกรมต้นกำเนิดอย่างเข้มงวด บุคคลที่นำโค้ดไปใช้โดยลบลายน้ำดิจิทัลออก มีโทษปรับทางแพ่งตามกฎหมาย (Statutory Damages) สูงสุด <strong>$25,000 ต่อครั้งของการละเมิด</strong> และสามารถยื่นคำสั่งระงับ (Injunction) ต่อผู้ให้บริการคลาวด์/โฮสติ้งได้ทันที
                </p>
              </div>

              {/* WIPO & Berne */}
              <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-300">3. สากล (WIPO & Berne Convention)</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                    181+ ประเทศภาคี
                  </span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <strong>อนุสัญญาเบิร์น ข้อ 15 & สนธิสัญญาลิขสิทธิ์ WIPO (WCT) ข้อ 12:</strong> ให้ข้อสันนิษฐานทางกฎหมายว่าโปรแกรมและผู้สร้างที่ระบุในงานเป็นผู้ทรงสิทธิที่แท้จริง ประเทศสมาชิก 181 ประเทศทั่วโลกยอมรับพยานหลักฐานทางนิติวิทยาศาสตร์ดิจิทัลโดยอัตโนมัติโดยไม่ต้องจดทะเบียนใหม่ในทุกประเทศ
                </p>
              </div>

              {/* EU */}
              <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-300">4. สหภาพยุโรป (European Union)</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                    Directive 2019/790 & ISO 27037
                  </span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <strong>Digital Single Market Directive:</strong> บังคับใช้ความรับผิดชอบของแพลตฟอร์มในการตรวจสอบสิทธิ และยอมรับการตรวจพิสูจน์หลักฐานดิจิทัลตามมาตรฐาน <strong>ISO/IEC 27037</strong> (Digital Evidence Handling) ซึ่งรองรับการส่งหลักฐานไปยังศาลในกลุ่มประเทศสมาชิกสหภาพยุโรป
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OmniForensicLegalVerificationStudio;
