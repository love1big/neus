/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Comprehensive modal component for inspecting individual community engine
 *          extensions and scripts. Features multi-tab navigation: Readme & Overview,
 *          Live Source Code Inspector, Security & Sandbox Audit Metrics, Version
 *          Changelogs, and Runtime Configuration.
 *    - TH: หน้าต่าง Modal แสดงรายละเอียดเชิงลึกของส่วนขยายและสคริปต์คอมมูนิตี้
 *          ประกอบด้วยแท็บเอกสาร Readme, ตัวตรวจสอบ Source Code แบบมี Syntax,
 *          รายงานการตรวจสอบความปลอดภัยและ Sandbox Isolation, ประวัติเวอร์ชัน
 *          พร้อมปุ่มติดตั้ง/เปิด-ปิด/ถอนการติดตั้ง
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Evaluates safety via `PluginSecuritySandboxEvaluatorNode.ts`
 *    - Connects directly to `PluginMarketplaceRegistryNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `plugin: EnginePlugin`, `installedState?: InstalledPluginState`, `onClose: () => void`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Prevents crashing if changelog is empty or source code is unavailable.
 *    - Safe copy-to-clipboard with visual feedback.
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  Trash2, 
  Power, 
  CheckCircle2, 
  ShieldCheck, 
  ShieldAlert, 
  Star, 
  Code2, 
  FileText, 
  History, 
  Sliders, 
  Copy, 
  Check, 
  Cpu, 
  HardDrive, 
  Layers, 
  Tag, 
  Lock, 
  AlertTriangle,
  ExternalLink,
  Zap,
  Activity
} from 'lucide-react';
import { EnginePlugin, InstalledPluginState } from '../types/pluginMarketplaceTypes';
import { PluginMarketplaceRegistryNode } from '../utils/PluginMarketplaceRegistryNode';
import { PluginSecuritySandboxEvaluatorNode } from '../utils/PluginSecuritySandboxEvaluatorNode';

interface PluginDetailModalProps {
  plugin: EnginePlugin;
  installedState?: InstalledPluginState;
  onClose: () => void;
}

type TabKey = 'readme' | 'code' | 'security' | 'versions' | 'runtime';

export default function PluginDetailModal({ plugin, installedState, onClose }: PluginDetailModalProps) {
  const registry = useMemo(() => PluginMarketplaceRegistryNode.getInstance(), []);
  const [activeTab, setActiveTab] = useState<TabKey>('readme');
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(plugin.version);

  const securityAudit = useMemo(() => {
    return PluginSecuritySandboxEvaluatorNode.evaluate(plugin);
  }, [plugin]);

  const isInstalled = Boolean(installedState);
  const isEnabled = installedState?.enabled ?? false;

  const handleInstall = () => {
    registry.installPlugin(plugin.id, selectedVersion);
  };

  const handleUninstall = () => {
    registry.uninstallPlugin(plugin.id);
  };

  const handleToggle = () => {
    if (installedState) {
      registry.togglePluginEnabled(plugin.id, !installedState.enabled);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(plugin.sourceCodePreview || '');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f141c] border border-[#2a3447] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#222b3d] bg-[#141b26] flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <Code2 size={28} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight truncate">{plugin.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e293b] text-[#94a3b8] font-mono border border-[#334155]">
                  v{selectedVersion}
                </span>
                {plugin.isOfficial && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-400 font-bold border border-blue-500/40 flex items-center gap-1">
                    <ShieldCheck size={12} /> Official Core
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                  {plugin.category}
                </span>
              </div>

              <p className="text-xs text-[#94a3b8] mt-1 line-clamp-2">
                {plugin.tagline || plugin.description}
              </p>

              <div className="flex items-center gap-4 mt-2 text-[11px] text-[#64748b] flex-wrap">
                <span>By <strong className="text-[#94a3b8]">{plugin.author}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <Star size={12} fill="currentColor" /> {plugin.rating.toFixed(2)} ({plugin.ratingCount} reviews)
                </span>
                <span>•</span>
                <span>{plugin.downloadCount.toLocaleString()} downloads</span>
                <span>•</span>
                <span>{plugin.sizeKb} KB</span>
                <span>•</span>
                <span className="text-emerald-400 font-mono">Min Engine: {plugin.minEngineVersion}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {isInstalled ? (
              <>
                <button
                  onClick={handleToggle}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isEnabled
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white'
                  }`}
                  title={isEnabled ? 'Click to Disable' : 'Click to Enable'}
                >
                  <Power size={13} />
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </button>
                <button
                  onClick={handleUninstall}
                  className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 border border-rose-500/30 hover:bg-rose-900/50 transition-colors"
                  title="Uninstall extension"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={handleInstall}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-900/30 cursor-pointer"
              >
                <Download size={14} /> Install Extension
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 border-b border-[#222b3d] bg-[#0c1017]">
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'readme' ? 'border-blue-500 text-white' : 'border-transparent text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            <FileText size={14} /> Readme & Guide
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'code' ? 'border-blue-500 text-white' : 'border-transparent text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            <Code2 size={14} /> Source Script ({plugin.language.toUpperCase()})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'security' ? 'border-blue-500 text-white' : 'border-transparent text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            <ShieldCheck size={14} className={securityAudit.score >= 85 ? 'text-emerald-400' : 'text-amber-400'} />
            Security & Sandbox ({securityAudit.score}/100)
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'versions' ? 'border-blue-500 text-white' : 'border-transparent text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            <History size={14} /> Changelog ({plugin.changelog.length})
          </button>
          {isInstalled && (
            <button
              onClick={() => setActiveTab('runtime')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'runtime' ? 'border-blue-500 text-white' : 'border-transparent text-[#64748b] hover:text-[#94a3b8]'
              }`}
            >
              <Activity size={14} className="text-emerald-400" /> Live Runtime Telemetry
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-[#cbd5e1]">
          
          {/* TAB 1: README */}
          {activeTab === 'readme' && (
            <div className="space-y-6">
              <div className="bg-[#141b26] border border-[#222b3d] rounded-lg p-5">
                <h3 className="text-xs uppercase font-bold text-[#64748b] tracking-wider mb-2">Overview</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{plugin.description}</p>
              </div>

              {/* Markdown Guide */}
              <div className="bg-[#090d14] border border-[#1e293b] rounded-lg p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap text-[#94a3b8]">
                {plugin.detailedReadmeMarkdown}
              </div>

              {/* Tags and Metadata */}
              <div className="flex flex-wrap gap-2 items-center pt-2">
                <span className="text-xs text-[#64748b] flex items-center gap-1 font-semibold">
                  <Tag size={12} /> Tags:
                </span>
                {plugin.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-[#1e293b] text-[#94a3b8] text-xs font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CODE INSPECTOR */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#141b26] px-4 py-2.5 rounded-t-lg border border-[#222b3d]">
                <span className="text-xs font-mono text-[#94a3b8] flex items-center gap-2">
                  <Code2 size={14} className="text-blue-400" />
                  {plugin.entryPointFilename} ({plugin.language})
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white px-2.5 py-1 rounded bg-[#1e293b] hover:bg-[#334155] transition-colors"
                >
                  {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copiedCode ? 'Copied' : 'Copy Code'}
                </button>
              </div>

              <div className="bg-[#06080d] border border-[#1e293b] rounded-b-lg p-4 font-mono text-xs overflow-x-auto text-[#38bdf8] leading-relaxed shadow-inner">
                <pre>{plugin.sourceCodePreview || '// No preview source available for this compiled extension.'}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & SANDBOX AUDIT */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-[#141b26] border border-[#222b3d]">
                  <div className="text-xs text-[#64748b] uppercase font-bold">Safety Score</div>
                  <div className="text-2xl font-mono font-bold mt-1 text-emerald-400">
                    {securityAudit.score} / 100
                  </div>
                  <div className="text-[11px] text-[#94a3b8] mt-1">
                    Risk Assessment: <strong className="text-white">{securityAudit.riskLevel}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#141b26] border border-[#222b3d]">
                  <div className="text-xs text-[#64748b] uppercase font-bold">Security Tier</div>
                  <div className="text-base font-bold mt-1 text-blue-400">
                    {securityAudit.tier.replace('_', ' ')}
                  </div>
                  <div className="text-[11px] text-[#94a3b8] mt-1">
                    Sandbox Isolation: <span className="text-emerald-400 font-bold">Active Enforced</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#141b26] border border-[#222b3d]">
                  <div className="text-xs text-[#64748b] uppercase font-bold">Memory Quota</div>
                  <div className="text-2xl font-mono font-bold mt-1 text-purple-400">
                    {securityAudit.maxMemoryQuotaMb} MB
                  </div>
                  <div className="text-[11px] text-[#94a3b8] mt-1">
                    Isolated Shadow Heap Allocation
                  </div>
                </div>
              </div>

              {/* Requested Permissions */}
              <div className="bg-[#141b26] border border-[#222b3d] rounded-lg p-5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Lock size={14} className="text-blue-400" /> Declared Subsystem Permissions ({plugin.permissions.length})
                </h4>

                {plugin.permissions.length === 0 ? (
                  <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Zero high-risk permissions requested. Completely isolated script execution.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {plugin.permissions.map(perm => (
                      <div key={perm} className="p-3 rounded bg-[#090d14] border border-[#1e293b] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white font-mono">{perm}</div>
                          <div className="text-[10px] text-[#64748b]">Hardware & Subsystem Direct Access</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                          Sandboxed
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vulnerabilities / Warnings */}
              {securityAudit.vulnerabilities.length > 0 && (
                <div className="bg-amber-950/20 border border-amber-500/40 rounded-lg p-5 space-y-3">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle size={14} /> Audit Vulnerability Notices ({securityAudit.vulnerabilities.length})
                  </h4>
                  {securityAudit.vulnerabilities.map(v => (
                    <div key={v.ruleId} className="p-3 rounded bg-[#090d14] border border-[#1e293b] space-y-1">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{v.title}</span>
                        <span className="text-[10px] font-mono text-amber-400">[{v.severity}]</span>
                      </div>
                      <p className="text-xs text-[#94a3b8]">{v.description}</p>
                      {v.lineRecommendation && (
                        <div className="text-[10px] font-mono text-emerald-400 mt-1">
                          Fix: {v.lineRecommendation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VERSIONS & CHANGELOG */}
          {activeTab === 'versions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#141b26] p-4 rounded-lg border border-[#222b3d]">
                <span className="text-xs text-[#94a3b8]">Select target engine version to download or pin:</span>
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="bg-[#090d14] border border-[#334155] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                >
                  {plugin.changelog.map(c => (
                    <option key={c.version} value={c.version}>v{c.version} ({c.releaseDate})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {plugin.changelog.map(log => (
                  <div key={log.version} className="p-4 rounded-lg bg-[#141b26] border border-[#222b3d]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-xs font-mono">Release v{log.version}</span>
                      <span className="text-[11px] text-[#64748b]">{log.releaseDate}</span>
                    </div>
                    <ul className="space-y-1 text-xs text-[#94a3b8] list-disc list-inside">
                      {log.highlights.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RUNTIME TELEMETRY */}
          {activeTab === 'runtime' && installedState && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-[#141b26] border border-[#222b3d]">
                  <div className="text-xs text-[#64748b] uppercase font-bold">Status</div>
                  <div className="text-lg font-mono font-bold mt-1 text-emerald-400">
                    {installedState.runtimeStatus}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[#141b26] border border-[#222b3d]">
                  <div className="text-xs text-[#64748b] uppercase font-bold">Memory</div>
                  <div className="text-lg font-mono font-bold mt-1 text-blue-400">
                    {installedState.memoryUsageKb} KB
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[#141b26] border border-[#222b3d]">
                  <div className="text-xs text-[#64748b] uppercase font-bold">CPU Overhead</div>
                  <div className="text-lg font-mono font-bold mt-1 text-amber-400">
                    {installedState.cpuOverheadPercent.toFixed(1)}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[#141b26] border border-[#222b3d]">
                  <div className="text-xs text-[#64748b] uppercase font-bold">Latency</div>
                  <div className="text-lg font-mono font-bold mt-1 text-purple-400">
                    {plugin.estimatedLatencyMs} ms
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#141b26] border border-[#222b3d] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Hot-Reload & State Flush</div>
                  <div className="text-[11px] text-[#64748b]">Re-executes the entry point without restarting NexusEngine.</div>
                </div>
                <button
                  onClick={() => registry.hotReloadPlugins()}
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Zap size={14} /> Trigger Hot-Reload
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#222b3d] bg-[#141b26] flex items-center justify-between text-xs text-[#64748b]">
          <span>License: <strong className="text-[#94a3b8]">{plugin.license}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-white font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
