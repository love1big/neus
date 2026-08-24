/**
 * ====================================================================================================
 * COMPONENT: OfflineErrorRegressionShieldView.tsx
 * PURPOSE: Interactive Real-Time Code Interceptor & Zero-Regression Shield Panel
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์:
 * 1. ตรวจสอบโค้ดแบบ Real-time เปรียบเทียบกับ Anti-Pattern ทั้งหมดในความจำของ AI ออฟไลน์
 * 2. แสดงผลแจ้งเตือนพิกัดบรรทัด, ระดับความรุนแรง, คำอธิบายภาษาไทยและอังกฤษ
 * 3. ปุ่มกด 1-Click Apply Immunity Patch แก้ไขโค้ดให้อัตโนมัติทันที
 * 4. เมนูทดสอบโค้ดตัวอย่าง (Load Anti-Pattern Samples) เพื่อพิสูจน์การทำงานของระบบ
 * ====================================================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Zap, AlertTriangle, Bug, Code2, 
  CheckCircle2, RefreshCw, Sparkles, ArrowRight, Play, Wrench 
} from 'lucide-react';
import { 
  OfflineBugRegressionInterceptor, 
  InterceptionScanReport, 
  InterceptionDiagnostic 
} from '../utils/OfflineBugRegressionInterceptor';

const SAMPLE_BUGGY_CODES = [
  {
    title: 'WebGL Texture Memory Leak',
    code: `function loadLevelTextures(scene, urls) {
  urls.forEach(url => {
    const tex = new TextureLoader().load(url);
    const mat = new MeshStandardMaterial({ map: tex });
    scene.add(new Mesh(geometry, mat));
  });
  // Fails to retain or dispose textures on scene unmount!
}`
  },
  {
    title: 'React useEffect Infinite Re-render',
    code: `function PlayerProfile({ options }) {
  const [lastSynced, setLastSynced] = useState(0);

  useEffect(() => {
    fetchPlayerData(options.playerId, { filters: ['active', 'alive'] });
    setLastSynced(Date.now());
  }, [{ filters: ['active', 'alive'] }]); // BUG: Non-primitive inline object!

  return <div>Synced at {lastSynced}</div>;
}`
  },
  {
    title: 'Quaternion Normalization NaN Drift',
    code: `function normalizeQuaternion(q) {
  const len = Math.sqrt(q.x*q.x + q.y*q.y + q.z*q.z + q.w*q.w);
  return { x: q.x / len, y: q.y / len, z: q.z / len, w: q.w / len }; // BUG: len can be 0!
}`
  },
  {
    title: 'Nested Deep Property Unchecked Access',
    code: `function renderItemData(data) {
  return (
    <div className="card">
      <h3>{data.item.stats.attack.baseValue}</h3>
    </div>
  );
}`
  }
];

export default function OfflineErrorRegressionShieldView() {
  const [inputCode, setInputCode] = useState<string>(SAMPLE_BUGGY_CODES[0].code);
  const [scanReport, setScanReport] = useState<InterceptionScanReport | null>(null);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<InterceptionDiagnostic | null>(null);

  const runScan = (codeToScan: string) => {
    const report = OfflineBugRegressionInterceptor.scanCode(codeToScan);
    setScanReport(report);
    if (report.diagnostics.length > 0) {
      setSelectedDiagnostic(report.diagnostics[0]);
    } else {
      setSelectedDiagnostic(null);
    }
  };

  useEffect(() => {
    runScan(inputCode);
  }, [inputCode]);

  const handleApplyPatch = (diag: InterceptionDiagnostic) => {
    const healedCode = OfflineBugRegressionInterceptor.applyImmunePatch(inputCode, diag);
    setInputCode(healedCode);
    runScan(healedCode);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans p-4 overflow-hidden">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-[#30363d] shrink-0">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-[#f85149]" size={20} />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Real-Time Zero-Regression Code Shield & Interceptor
              <span className="px-2 py-0.5 bg-[#238636]/20 border border-[#238636]/40 text-[#3fb950] text-[10px] rounded font-mono">
                100% OFFLINE ACTIVE
              </span>
            </h2>
            <p className="text-xs text-[#8b949e]">
              ระบบดักจับและเตือนความผิดพลาดซ้ำแบบเรียลไทม์ ป้องกันไม่ให้ AI หรือผู้พัฒนาเขียนโค้ดติดบัคเดิมอีกต่อไป
            </p>
          </div>
        </div>

        {/* Preset Samples */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8b949e]">โหลดตัวอย่างบัค:</span>
          {SAMPLE_BUGGY_CODES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setInputCode(sample.code)}
              className="px-2 py-1 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-xs text-[#58a6ff] rounded transition-colors"
            >
              {sample.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3 overflow-hidden">
        {/* Left: Code Input & Editor */}
        <div className="lg:col-span-7 flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
          <div className="bg-[#0e1014] px-3 py-2 border-b border-[#30363d] flex items-center justify-between text-xs">
            <span className="font-mono text-[#8b949e] flex items-center gap-1.5">
              <Code2 size={14} className="text-[#58a6ff]" /> Active Code Buffer (Editable)
            </span>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span>Lines: {scanReport?.scannedLines || 0}</span>
              <span>Bytes: {scanReport?.scannedBytes || 0}</span>
              <span className="text-[#3fb950]">Latency: {scanReport?.scanDurationMs || 0}ms</span>
            </div>
          </div>

          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-1 w-full p-3 bg-[#0d1117] text-[#c9d1d9] font-mono text-xs outline-none resize-none selection:bg-[#58a6ff]/30 leading-relaxed"
            placeholder="พิมพ์หรือวางโค้ดที่ต้องการทดสอบการสกัดกั้นบัคที่นี่..."
            spellCheck={false}
          />

          {/* Bottom Bar in Code Editor */}
          <div className="bg-[#0e1014] px-3 py-2 border-t border-[#30363d] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {scanReport?.isImmune ? (
                <span className="flex items-center gap-1.5 text-[#3fb950] font-bold">
                  <ShieldCheck size={16} /> โค้ดปลอดภัยสมบูรณ์ (Zero Regressions Found)
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[#f85149] font-bold">
                  <AlertTriangle size={16} /> ตรวจพบ {scanReport?.diagnostics.length} รูปแบบบัคในอดีต!
                </span>
              )}
            </div>

            <button
              onClick={() => runScan(inputCode)}
              className="px-3 py-1 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={12} /> สแกนซ้ำทันที
            </button>
          </div>
        </div>

        {/* Right: Diagnostics & Patch Prescription Panel */}
        <div className="lg:col-span-5 flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
          <div className="bg-[#0e1014] px-3 py-2 border-b border-[#30363d] flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap size={14} className="text-[#e3b341]" />
              ผลการสแกน & คำแนะนำการแก้ (Immunity Prescriptions)
            </span>
            <span className="px-2 py-0.5 bg-[#30363d] text-[10px] rounded font-mono text-[#8b949e]">
              Score: {scanReport?.zeroRegressionScore}%
            </span>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {scanReport?.diagnostics.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8b949e]">
                <ShieldCheck size={48} className="text-[#3fb950] mb-3" />
                <h3 className="text-white font-bold text-sm">ไม่พบบัคหรือ Anti-Pattern เดิม</h3>
                <p className="text-xs mt-1 max-w-xs text-[#8b949e]">
                  โค้ดชุดนี้ผ่านการตรวจสอบภูมิคุ้มกันความจำบัค 100% ปลอดภัยจากการเกิดซ้ำของข้อผิดพลาดในอดีต
                </p>
              </div>
            ) : (
              scanReport?.diagnostics.map((diag, index) => (
                <div
                  key={diag.id}
                  className={`p-3 rounded border transition-all ${
                    selectedDiagnostic?.id === diag.id
                      ? 'bg-[#1f242c] border-[#f85149]'
                      : 'bg-[#0d1117] border-[#30363d] hover:border-[#8b949e]'
                  }`}
                  onClick={() => setSelectedDiagnostic(diag)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f85149]/20 text-[#f85149] font-bold border border-[#f85149]/40">
                      LINE {diag.lineNumber} : {diag.severity}
                    </span>
                    <span className="text-[10px] text-[#8b949e] font-mono">{diag.domain}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-1">{diag.bugTitleThai}</h4>
                  <p className="text-[11px] text-[#8b949e] mt-1 leading-relaxed">{diag.explanationThai}</p>

                  <div className="mt-2 p-2 bg-[#0a0c10] border border-[#21262d] rounded font-mono text-[10px] text-[#ff7b72] overflow-x-auto">
                    Matched: {diag.matchedSnippet}
                  </div>

                  {/* 1-Click Auto Patch */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyPatch(diag);
                    }}
                    className="w-full mt-2.5 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Wrench size={13} />
                    <span>ใช้โค้ดภูมิคุ้มกันแก้ไขทันที (1-Click Auto-Patch)</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
