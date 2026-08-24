/**
 * ====================================================================================================
 * COMPONENT: OfflineAIContinuousErrorLearningStudio.tsx
 * PURPOSE: Master Studio for Offline AI Continuous Self-Learning Error Memory & Bug Immunity System
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์:
 * 1. ศูนย์บัญชาการระบบเรียนรู้และจดจำบัค/ข้อผิดพลาดแบบออฟไลน์ 100% สำหรับ AI ทุกตัวในโปรเจกต์
 * 2. ป้องกันการทำผิดพลาดซ้ำ (Zero-Regression Guarantee) ด้วยการสร้าง Anti-Pattern Negative Constraints
 * 3. รวม 5 สตูดิโอย่อย:
 *    - 🛡️ Zero-Repeat Bug Immunity Vault (คลังความจำบัคและกฎข้อห้ามทั้งหมด)
 *    - ⚡ Real-Time Code Interceptor (ระบบสแกนและดักจับบัคแบบเรียลไทม์)
 *    - 🧬 Live Bug Ingestion Lab (ป้อน Error Log สดเพื่อสร้างภูมิคุ้มกันใหม่)
 *    - 🧪 Multi-Domain Bug Simulator (จำลองการเกิดบัค 8 โดเมนเพื่อทดสอบระบบ)
 *    - 📊 Immunity Metrics & Knowledge Graph (กราฟความสัมพันธ์และสถิติภูมิคุ้มกัน)
 * 4. รองรับการ Export / Import ความจำบัคเป็นไฟล์ JSON สำหรับแบ็คอัพหรือส่งต่อ
 * ====================================================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  Brain, ShieldCheck, ShieldAlert, Bug, Zap, Cpu, 
  RefreshCw, Download, Upload, Search, Trash2, Filter, 
  Sparkles, CheckCircle2, AlertTriangle, Network, Layers, 
  Activity, Play, Save, FileCode, Check
} from 'lucide-react';
import { 
  BugDomain, 
  BugKnowledgeRecord, 
  OfflineAIErrorImmunityCore 
} from '../utils/OfflineAIErrorImmunityCore';
import { OfflineErrorMemoryStore } from '../utils/OfflineErrorMemoryStore';
import { 
  OfflineErrorLearningDiagnostics, 
  ComprehensiveImmunityAuditReport 
} from '../utils/OfflineErrorLearningDiagnostics';
import OfflineErrorRegressionShieldView from './OfflineErrorRegressionShieldView';
import OfflineBugKnowledgeGraphView from './OfflineBugKnowledgeGraphView';
import OfflineErrorPatchSynthesizerView from './OfflineErrorPatchSynthesizerView';

export default function OfflineAIContinuousErrorLearningStudio({ onSelectTool }: { onSelectTool?: (toolId: string) => void }) {
  const [activeTab, setActiveTab] = useState<'vault' | 'shield' | 'ingest' | 'simulator' | 'graph'>('vault');
  const [records, setRecords] = useState<BugKnowledgeRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<BugKnowledgeRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [auditReport, setAuditReport] = useState<ComprehensiveImmunityAuditReport | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const loadData = () => {
    const allRecords = OfflineErrorMemoryStore.getAllRecords();
    setRecords(allRecords);
    if (allRecords.length > 0 && !selectedRecord) {
      setSelectedRecord(allRecords[0]);
    }
    const audit = OfflineErrorLearningDiagnostics.runFullImmunityAudit();
    setAuditReport(audit);
  };

  useEffect(() => {
    loadData();

    const handleMemoryUpdate = () => {
      loadData();
    };

    window.addEventListener('offline-ai-error-memory-updated', handleMemoryUpdate);
    return () => {
      window.removeEventListener('offline-ai-error-memory-updated', handleMemoryUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportJSON = () => {
    const json = OfflineErrorMemoryStore.exportAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `offline-ai-bug-immunity-memory-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported memory database snapshot successfully!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) {
        const res = OfflineErrorMemoryStore.importFromJSON(text);
        if (res.success) {
          loadData();
          showToast(`Imported ${res.count} bug memory records successfully!`);
        } else {
          showToast(`Import failed: ${res.error}`);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = () => {
    if (confirm('คุณต้องการรีเซ็ตฐานความจำบัคกลับเป็นค่ามาตรฐานจากโรงงานหรือไม่?')) {
      OfflineErrorMemoryStore.resetToFactorySeed();
      loadData();
      showToast('Reset to factory preloaded bug knowledge successfully.');
    }
  };

  const filteredRecords = records.filter(r => {
    const matchQuery = !searchQuery || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.titleThai.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.fingerprint.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDomain = selectedDomain === 'ALL' || r.domain === selectedDomain;
    return matchQuery && matchDomain;
  });

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#0a0c10] text-[#c9d1d9] font-sans overflow-hidden select-none">
      {/* Top Banner & Control Bar */}
      <div className="bg-[#0e1014] border-b border-[#21262d] px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1f6feb]/20 border border-[#1f6feb]/40 rounded-lg text-[#58a6ff]">
            <Brain size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                Offline AI Continuous Error-Learning & Bug Immunity System
              </h1>
              <span className="px-2 py-0.5 bg-[#238636]/20 border border-[#238636]/40 text-[#3fb950] text-[10px] rounded font-mono font-bold">
                🛡️ ZERO-REGRESSION ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e]">
              ระบบ AI ออฟไลน์เรียนรู้ จดจำ และสร้างภูมิคุ้มกันป้องกันการทำผิดพลาดซ้ำ 100% ตลอดชีพ
            </p>
          </div>
        </div>

        {/* Global Statistics Badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1 bg-[#161b22] border border-[#30363d] rounded flex items-center gap-2">
            <span className="text-[#8b949e]">Learned Bugs:</span>
            <strong className="text-white">{auditReport?.totalRecords || 0}</strong>
          </div>
          <div className="px-3 py-1 bg-[#161b22] border border-[#30363d] rounded flex items-center gap-2">
            <span className="text-[#8b949e]">Prevented:</span>
            <strong className="text-[#3fb950]">{auditReport?.totalPreventedIncidents || 0} times</strong>
          </div>
          <div className="px-3 py-1 bg-[#161b22] border border-[#30363d] rounded flex items-center gap-2">
            <span className="text-[#8b949e]">Immunity Index:</span>
            <strong className="text-[#58a6ff]">{auditReport?.globalImmunityIndex || 100}%</strong>
          </div>

          {/* Export / Import Buttons */}
          <button
            onClick={handleExportJSON}
            className="px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Export Memory Database JSON"
          >
            <Download size={13} /> Export
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Import Memory Database JSON"
          >
            <Upload size={13} /> Import
          </button>

          <button
            onClick={handleFactoryReset}
            className="px-2 py-1 bg-[#21262d] hover:bg-[#da3633]/20 border border-[#30363d] hover:border-[#da3633]/50 text-[#8b949e] hover:text-[#f85149] rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset to Factory Knowledge"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#161b22] border-b border-[#21262d] px-4 flex items-center gap-1 shrink-0 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-3 py-2 border-b-2 flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
            activeTab === 'vault'
              ? 'border-[#58a6ff] text-white font-bold bg-[#0d1117]'
              : 'border-transparent text-[#8b949e] hover:text-white'
          }`}
        >
          <ShieldCheck size={14} className="text-[#3fb950]" />
          <span>คลังความจำภูมิคุ้มกัน (Immunity Vault)</span>
          <span className="px-1.5 py-0.2 bg-[#21262d] rounded-full text-[10px] font-mono text-[#8b949e]">
            {records.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('shield')}
          className={`px-3 py-2 border-b-2 flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
            activeTab === 'shield'
              ? 'border-[#58a6ff] text-white font-bold bg-[#0d1117]'
              : 'border-transparent text-[#8b949e] hover:text-white'
          }`}
        >
          <ShieldAlert size={14} className="text-[#f85149]" />
          <span>ดักจับโค้ดเรียลไทม์ (Code Interceptor)</span>
        </button>

        <button
          onClick={() => setActiveTab('ingest')}
          className={`px-3 py-2 border-b-2 flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
            activeTab === 'ingest'
              ? 'border-[#58a6ff] text-white font-bold bg-[#0d1117]'
              : 'border-transparent text-[#8b949e] hover:text-white'
          }`}
        >
          <Sparkles size={14} className="text-[#58a6ff]" />
          <span>ป้อนบัคสด & สังเคราะห์ (Live Ingestion Lab)</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3 py-2 border-b-2 flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
            activeTab === 'simulator'
              ? 'border-[#58a6ff] text-white font-bold bg-[#0d1117]'
              : 'border-transparent text-[#8b949e] hover:text-white'
          }`}
        >
          <Activity size={14} className="text-[#e3b341]" />
          <span>จำลองบัค & Stress Test (Multi-Domain Simulator)</span>
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`px-3 py-2 border-b-2 flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
            activeTab === 'graph'
              ? 'border-[#58a6ff] text-white font-bold bg-[#0d1117]'
              : 'border-transparent text-[#8b949e] hover:text-white'
          }`}
        >
          <Network size={14} className="text-[#bc8cff]" />
          <span>กราฟความจำประสาท (Knowledge Topology)</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-[#1f6feb] text-white text-xs px-4 py-1.5 flex items-center justify-between shrink-0 shadow-md">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} />
            {toastMessage}
          </span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-75">✕</button>
        </div>
      )}

      {/* Tab Contents */}
      <div className="flex-1 flex overflow-hidden">
        {/* TAB 1: IMMUNITY VAULT */}
        {activeTab === 'vault' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden">
            {/* Left: List of Learned Records */}
            <div className="lg:col-span-5 flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
              {/* Search and Filters */}
              <div className="p-2.5 bg-[#0e1014] border-b border-[#30363d] space-y-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-[#8b949e]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาข้อผิดพลาด, Fingerprint, Root Cause..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded text-xs text-white outline-none focus:border-[#58a6ff]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full px-2 py-1 bg-[#0d1117] border border-[#30363d] rounded text-xs text-[#c9d1d9] outline-none"
                  >
                    <option value="ALL">ทุกโดเมน (All 10 Domains)</option>
                    <option value="MEMORY_MANAGEMENT">MEMORY_MANAGEMENT</option>
                    <option value="ASYNC_CONCURRENCY">ASYNC_CONCURRENCY</option>
                    <option value="WEBGPU_SHADER">WEBGPU_SHADER</option>
                    <option value="REACT_STATE_LIFECYCLE">REACT_STATE_LIFECYCLE</option>
                    <option value="TYPE_SAFETY_NARROWING">TYPE_SAFETY_NARROWING</option>
                    <option value="NUMERICAL_STABILITY">NUMERICAL_STABILITY</option>
                    <option value="ASSET_PIPELINE">ASSET_PIPELINE</option>
                    <option value="PHYSICS_STABILITY">PHYSICS_STABILITY</option>
                    <option value="NETCODE_REPLICATION">NETCODE_REPLICATION</option>
                    <option value="LOGIC_BOUNDARY">LOGIC_BOUNDARY</option>
                  </select>
                </div>
              </div>

              {/* Records List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {filteredRecords.map((rec) => {
                  const isSelected = selectedRecord?.id === rec.id;
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRecord(rec)}
                      className={`p-2.5 rounded border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1f242c] border-[#58a6ff] shadow-sm'
                          : 'bg-[#0d1117] border-[#21262d] hover:border-[#30363d]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#21262d] text-[#8b949e] rounded">
                          {rec.fingerprint}
                        </span>
                        <span className="text-[10px] text-[#3fb950] font-mono font-bold">
                          Immunity: {rec.immunityScore}%
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{rec.titleThai}</h4>
                      <p className="text-[10px] text-[#8b949e] truncate mt-0.5">{rec.title}</p>
                      
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#21262d] text-[10px] text-[#8b949e]">
                        <span className="text-[#58a6ff] font-mono">{rec.domain}</span>
                        <span>Prevented: <strong className="text-[#3fb950]">{rec.timesPrevented}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Detailed Record Inspector */}
            <div className="lg:col-span-7 flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
              <div className="bg-[#0e1014] px-3 py-2 border-b border-[#30363d] flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#3fb950]" />
                  ข้อมูลภูมิคุ้มกัน & กฎสกัดกั้น (Immunity Inspector)
                </span>
                {selectedRecord && (
                  <span className="px-2 py-0.5 bg-[#238636]/20 border border-[#238636]/40 text-[#3fb950] text-[10px] rounded font-mono">
                    Zero Repeat Certified
                  </span>
                )}
              </div>

              {selectedRecord ? (
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#30363d] text-[#8b949e]">
                        {selectedRecord.fingerprint}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f85149]/20 text-[#f85149] font-bold">
                        {selectedRecord.severity}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-white mt-1.5">{selectedRecord.titleThai}</h2>
                    <p className="text-xs text-[#8b949e]">{selectedRecord.title}</p>
                  </div>

                  {/* Root Cause Section */}
                  <div className="p-3 bg-[#0d1117] border border-[#21262d] rounded-lg">
                    <span className="text-[10px] font-bold text-[#e3b341] uppercase tracking-wider block mb-1">
                      สาเหตุแท้จริง (Root Cause Analysis - RCA):
                    </span>
                    <p className="text-[11px] text-[#c9d1d9] leading-relaxed">
                      {selectedRecord.rootCauseThai}
                    </p>
                    <p className="text-[10px] text-[#8b949e] mt-1 font-mono">
                      {selectedRecord.rootCause}
                    </p>
                  </div>

                  {/* Anti-Pattern Negative Constraint */}
                  <div className="p-3 bg-[#0d1117] border border-[#21262d] rounded-lg">
                    <span className="text-[10px] font-bold text-[#f85149] uppercase tracking-wider block mb-1">
                      กฎข้อห้าม (Anti-Pattern Negative Constraint):
                    </span>
                    <p className="text-[11px] text-[#ff7b72] leading-relaxed">
                      {selectedRecord.antiPattern.patternDescriptionThai}
                    </p>
                    <div className="mt-2 p-1.5 bg-[#0a0c10] rounded font-mono text-[10px] text-[#8b949e]">
                      Regex Pattern: {selectedRecord.antiPattern.forbiddenCodeRegex.join(' | ')}
                    </div>
                  </div>

                  {/* Failing Code vs Immune Code Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#f85149] uppercase tracking-wider mb-1">
                        ❌ โค้ดที่ก่อให้เกิดข้อผิดพลาด (Failing Code):
                      </span>
                      <pre className="p-2.5 bg-[#0a0c10] border border-[#da3633]/30 rounded font-mono text-[10px] text-[#ff7b72] overflow-x-auto leading-relaxed flex-1">
                        {selectedRecord.failingCodeSample}
                      </pre>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#3fb950] uppercase tracking-wider mb-1">
                        ✅ โค้ดที่สร้างภูมิคุ้มกันแล้ว (Immune Code):
                      </span>
                      <pre className="p-2.5 bg-[#0a0c10] border border-[#238636]/40 rounded font-mono text-[10px] text-[#7ee787] overflow-x-auto leading-relaxed flex-1">
                        {selectedRecord.immuneCodeSample}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[#8b949e]">
                  เลือกข้อผิดพลาดจากรายการฝั่งซ้ายเพื่อดูรายละเอียด
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CODE INTERCEPTOR */}
        {activeTab === 'shield' && <OfflineErrorRegressionShieldView />}

        {/* TAB 3: LIVE INGESTION LAB */}
        {activeTab === 'ingest' && <OfflineErrorPatchSynthesizerView onRecordLearned={loadData} />}

        {/* TAB 4: MULTI-DOMAIN SIMULATOR & STRESS TESTBED */}
        {activeTab === 'simulator' && (
          <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
            <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity size={18} className="text-[#e3b341]" />
                Multi-Domain Error Stress Testbed & Autonomous Immunity Benchmark
              </h2>
              <p className="text-xs text-[#8b949e] mt-1">
                ทดลองสั่งยิงข้อผิดพลาดจำลองใน 8 โดเมนหลัก เพื่อทดสอบการตอบสนอง การสกัดกั้น และการเรียนรู้ของ AI ออฟไลน์
              </p>
            </div>

            {/* Domains Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {auditReport?.domainMetrics.map((dm) => (
                <div key={dm.domain} className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#58a6ff] font-bold">{dm.domain}</span>
                      <span className="px-1.5 py-0.2 bg-[#238636]/20 text-[#3fb950] text-[9px] rounded font-mono font-bold">
                        {dm.status}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-1">{dm.domainThai}</h3>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#21262d] text-[11px] font-mono">
                      <div>
                        <span className="text-[#8b949e] block text-[10px]">Learned:</span>
                        <strong className="text-white">{dm.totalLearnedBugs}</strong>
                      </div>
                      <div>
                        <span className="text-[#8b949e] block text-[10px]">Prevented:</span>
                        <strong className="text-[#3fb950]">{dm.totalPrevented}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const scenario = OfflineErrorLearningDiagnostics.generateSimulatedBugScenario(dm.domain);
                      const rec = OfflineAIErrorImmunityCore.ingestAndLearnBug(scenario.errorLog, scenario.failingCode, scenario.fixedCode, scenario.title);
                      OfflineErrorMemoryStore.saveRecord(rec);
                      loadData();
                      showToast(`Triggered simulated crash for ${dm.domain} — AI healed and learned!`);
                    }}
                    className="w-full mt-3 py-1.5 bg-[#21262d] hover:bg-[#1f6feb] text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play size={11} /> จำลองข้อผิดพลาด & ทดสอบ AI
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: KNOWLEDGE GRAPH */}
        {activeTab === 'graph' && <OfflineBugKnowledgeGraphView />}
      </div>
    </div>
  );
}
