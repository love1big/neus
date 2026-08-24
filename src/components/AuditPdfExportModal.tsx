import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Download,
  CheckCircle2,
  X,
  ShieldCheck,
  HardDrive,
  Cpu,
  Layers,
  Workflow,
  Wrench,
  Sparkles,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { AuditIssue, PlatformProfile, AuditStep } from './BuildPublishAudit';
import { generateAuditPdfReport, AuditPdfOptions } from '../utils/auditPdfGenerator';

interface AuditPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlatformProfile;
  issues: AuditIssue[];
  steps: AuditStep[];
  healthScore: number;
  logs: string[];
}

export const AuditPdfExportModal: React.FC<AuditPdfExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  issues,
  steps,
  healthScore,
  logs
}) => {
  const [reportTitle, setReportTitle] = useState('Pre-Flight Build & Publish Audit Report');
  const [engineerName, setEngineerName] = useState('Lead Release & Build Engineer');
  const [releaseVersion, setReleaseVersion] = useState('v2.4.0-RC1 (Build #8942)');
  const [environment, setEnvironment] = useState('Production Release / Staging');
  const [scope, setScope] = useState<'full' | 'performance' | 'dependency' | 'memory'>('full');
  const [includeSnippets, setIncludeSnippets] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const criticalCount = issues.filter(i => i.severity === 'critical' && !i.fixed).length;
  const warningCount = issues.filter(i => i.severity === 'warning' && !i.fixed).length;
  const passedCount = issues.filter(i => i.severity === 'passed' || i.fixed).length;

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const options: AuditPdfOptions = {
          reportTitle,
          engineerName,
          releaseVersion,
          environment,
          includeSnippets,
          scope
        };
        generateAuditPdfReport(profile, issues, steps, healthScore, logs, options);
        setIsGenerating(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 1600);
      } catch (err) {
        console.error('PDF Generation failed', err);
        setIsGenerating(false);
      }
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans text-[#c9d1d9]"
        >
          {/* Header */}
          <div className="bg-[#0d1117] border-b border-[#30363d] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#1f6feb]/20 text-[#58a6ff] border border-[#58a6ff]/40">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">Generate Audit PDF Summary</h2>
                <p className="text-xs text-[#8b949e] mt-0.5">Export structured compliance & performance report for project stakeholders</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
            {/* Live Summary Preview Card */}
            <div className="p-3.5 bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center ${
                  healthScore > 85
                    ? 'bg-[#238636]/15 border-[#238636]/40 text-[#7ee787]'
                    : healthScore > 65
                    ? 'bg-[#d29922]/15 border-[#d29922]/40 text-[#e3b341]'
                    : 'bg-[#da3633]/15 border-[#da3633]/40 text-[#f85149]'
                }`}>
                  <span className="text-base font-extrabold leading-none">{healthScore}</span>
                  <span className="text-[9px] font-mono mt-0.5">Score</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{profile.name}</div>
                  <div className="text-[11px] text-[#8b949e] mt-0.5 font-mono">
                    {issues.length} Audit Items • {criticalCount} Blockers • {warningCount} Warnings • {passedCount} Passed
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-[10px] text-[#8b949e]">
                <div>VRAM: {profile.vramBudgetMB} MB</div>
                <div>Draw Calls: {profile.maxDrawCalls}</div>
              </div>
            </div>

            {/* Customization Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#8b949e] uppercase font-mono mb-1">
                  Report Document Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={e => setReportTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8b949e] uppercase font-mono mb-1">
                    Auditor / Engineer Name
                  </label>
                  <input
                    type="text"
                    value={engineerName}
                    onChange={e => setEngineerName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8b949e] uppercase font-mono mb-1">
                    Release Version / Build #
                  </label>
                  <input
                    type="text"
                    value={releaseVersion}
                    onChange={e => setReleaseVersion(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8b949e] uppercase font-mono mb-1">
                  Build Environment Target
                </label>
                <input
                  type="text"
                  value={environment}
                  onChange={e => setEnvironment(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              {/* Scope Selection */}
              <div>
                <label className="block text-[11px] font-bold text-[#8b949e] uppercase font-mono mb-1.5">
                  Audit Scope Included in PDF
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScope('full')}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      scope === 'full'
                        ? 'bg-[#1f6feb]/20 border-[#58a6ff] text-white ring-1 ring-[#58a6ff]'
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#58a6ff]" /> Full Pre-Flight Audit
                    </div>
                    <div className="text-[10px] text-[#8b949e] mt-0.5">All 4 subsystems + Findings table</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScope('performance')}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      scope === 'performance'
                        ? 'bg-[#1f6feb]/20 border-[#58a6ff] text-white ring-1 ring-[#58a6ff]'
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Cpu size={14} className="text-[#7ee787]" /> Performance & Shaders
                    </div>
                    <div className="text-[10px] text-[#8b949e] mt-0.5">ALU limits, Draw calls, Frametimes</div>
                  </button>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="pt-2 border-t border-[#30363d] flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 cursor-pointer text-[#c9d1d9]">
                  <input
                    type="checkbox"
                    checked={includeSnippets}
                    onChange={e => setIncludeSnippets(e.target.checked)}
                    className="rounded border-[#30363d] text-[#58a6ff] focus:ring-[#58a6ff]"
                  />
                  <span>Include remediation code snippets & compiler flags</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-[#0d1117] border-t border-[#30363d] px-5 py-3.5 flex items-center justify-between">
            <div className="text-[11px] font-mono text-[#8b949e] flex items-center gap-1.5">
              <FileCheck size={14} className="text-[#7ee787]" />
              <span>Multi-page vector PDF with digital checksum</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-xs font-semibold text-[#c9d1d9] border border-[#30363d] transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isGenerating}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#1f6feb] to-[#238636] hover:from-[#388bfd] hover:to-[#2ea043] text-white text-xs font-bold shadow-lg shadow-[#1f6feb]/20 flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Download size={14} />
                    </motion.div>
                    <span>Generating PDF...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={14} className="text-white" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Download Summary (PDF)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
