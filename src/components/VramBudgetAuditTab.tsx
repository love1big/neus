/**
 * ============================================================================
 * MODULE: VramBudgetAuditTab.tsx
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * คอมโพเนนต์หน้าจอแสดงผลการตรวจสอบงบประมาณหน่วยความจำวิดีโอ (VRAM Budget Audit Tab)
 * สำหรับสตูดิโอเกมระดับ AAA ช่วยให้ฝ่าย Technical Director และ 3D Artist สามารถ:
 *  1. ตรวจสอบปริมาณการใช้ VRAM เทียบกับเพดานจำกัด (Hard Budget Limit) ของแพลตฟอร์มเป้าหมาย
 *  2. ติดตามการจัดสรรหน่วยความจำแบบแยกประเภท (Textures, Meshes, Audio Streaming Buffer)
 *  3. ตรวจสอบคะแนนความสมบูรณ์ของงบประมาณ (Hardware Budget Health Score 0-100)
 *  4. ตรวจจับสินทรัพย์ที่เป็น Hotspots ซึ่งกินหน่วยความจำสูงเกินเกณฑ์ พร้อมคำแนะนำแก้ไข
 *  5. ส่งออกรายงานมาตรฐานอุตสาหกรรม (JSON Manifest, CSV Summary, Unreal INI, HTML Report)
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - ใช้งานโมดูล: VramBudgetAuditNode.ts ในการคำนวณและประมวลผล
 * - ใช้งานโมดูล: BatchOptimizationReportExporter.ts ในการดาวน์โหลดรายงาน
 * - ถูกเรนเดอร์ภายใน: BatchResourceOptimizer.tsx เมื่อ activeTab เป็น 'vram_audit'
 * 
 * ข้อมูลการรับส่ง (Inputs, Outputs & Data Contracts):
 * ----------------------------------------------------------------------------
 * - Props:
 *   - `manifest`: BatchOptimizationManifest หรือ null
 *   - `results`: OptimizedAssetResult[]
 *   - `presetId`: PlatformOptimizationPresetType
 *   - `totalAssetCount`: number
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - กรณีที่ยังไม่ได้รัน Pass จะแสดงสถานะ Pre-Pass Budget Estimation พร้อมคำแนะนำ
 * - กรณีเกิด Buffer Overflow เกิน 100% จะแสดงแถบเตือนสีแดงกะพริบและคำเตือนวิกฤต
 * 
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ----------------------------------------------------------------------------
 * <VramBudgetAuditTab
 *   manifest={latestManifest}
 *   results={Array.from(optimizationResults.values())}
 *   presetId={selectedPresetId}
 * />
 * ============================================================================
 */

import React, { useMemo } from 'react';
import {
  HardDrive,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  FileDown,
  Layers,
  Box,
  Image,
  Volume2,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Globe,
  TrendingDown
} from 'lucide-react';
import {
  OptimizedAssetResult,
  BatchOptimizationManifest,
  PlatformOptimizationPresetType
} from '../utils/batchOptimizer/BatchOptimizerTypes';
import {
  VramBudgetAuditNode,
  VramBudgetAuditReport
} from '../utils/batchOptimizer/VramBudgetAuditNode';
import {
  BatchOptimizationReportExporter
} from '../utils/batchOptimizer/BatchOptimizationReportExporter';

interface VramBudgetAuditTabProps {
  manifest: BatchOptimizationManifest | null;
  results: OptimizedAssetResult[];
  presetId: PlatformOptimizationPresetType;
  totalAssetCount: number;
}

export default function VramBudgetAuditTab({
  manifest,
  results,
  presetId,
  totalAssetCount
}: VramBudgetAuditTabProps) {
  // คำนวณรายงาน VRAM Budget Audit ผ่าน Node โดยเฉพาะ
  const auditReport: VramBudgetAuditReport = useMemo(() => {
    return VramBudgetAuditNode.auditManifestResults(results, presetId);
  }, [results, presetId]);

  // ฟังก์ชันดาวน์โหลดรายงานผ่านโมดูล Exporter
  const handleDownloadJson = () => {
    if (!manifest) return;
    BatchOptimizationReportExporter.downloadJsonManifest(manifest);
  };

  const handleDownloadCsv = () => {
    if (!manifest) return;
    BatchOptimizationReportExporter.downloadCsvSummary(manifest);
  };

  const handleDownloadUnrealIni = () => {
    if (!manifest) return;
    BatchOptimizationReportExporter.downloadUnrealConfig(manifest);
  };

  const handleDownloadHtmlReport = () => {
    if (!manifest) return;
    BatchOptimizationReportExporter.downloadHtmlReport(manifest);
  };

  const getStatusBadge = (status: VramBudgetAuditReport['statusTag']) => {
    switch (status) {
      case 'EXCELLENT':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
            <CheckCircle2 size={13} /> EXCELLENT FIT
          </span>
        );
      case 'STABLE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center gap-1.5">
            <ShieldCheck size={13} /> STABLE BUDGET
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5">
            <AlertTriangle size={13} /> BUDGET TIGHT (&gt;80%)
          </span>
        );
      case 'CRITICAL_OVERFLOW':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1.5 animate-pulse">
            <AlertTriangle size={13} /> CRITICAL VRAM OVERFLOW
          </span>
        );
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar text-gray-200">
      {/* 1. TOP HEADER & PLATFORM SPEC OVERVIEW */}
      <div className="bg-[#161b26] border border-[#21262d] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-lg">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <HardDrive size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-wide">
                Hardware VRAM & Platform Budget Audit
              </h2>
              {getStatusBadge(auditReport.statusTag)}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Target Profile: <strong className="text-gray-200">{auditReport.platformSpec.platformName}</strong> | Total Hard Ceiling: <strong className="text-amber-400">{auditReport.platformSpec.totalVramBudgetMb} MB</strong>
            </p>
          </div>
        </div>

        {/* Health Score Meter */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#21262d] pt-3 md:pt-0 md:pl-5 shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Budget Health Score</div>
            <div className={`text-2xl font-black font-mono ${
              auditReport.overallHealthScore >= 85 ? 'text-emerald-400' :
              auditReport.overallHealthScore >= 65 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {auditReport.overallHealthScore}<span className="text-xs text-gray-500">/100</span>
            </div>
          </div>

          <div className="w-14 h-14 rounded-full border-4 border-[#21262d] flex items-center justify-center relative">
            <div 
              className={`text-xs font-bold font-mono ${
                auditReport.overallHealthScore >= 85 ? 'text-emerald-400' :
                auditReport.overallHealthScore >= 65 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {auditReport.overallHealthScore}%
            </div>
          </div>
        </div>
      </div>

      {/* 2. OVERALL VRAM CONSUMPTION GAUGE BAR */}
      <div className="bg-[#161b26] border border-[#21262d] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-300 flex items-center gap-2">
            <Cpu size={14} className="text-blue-400" /> Resident VRAM Pool Allocation
          </span>
          <div className="font-mono text-xs">
            <strong className="text-white">{auditReport.totalVramUsedMb} MB</strong>
            <span className="text-gray-500"> / {auditReport.platformSpec.totalVramBudgetMb} MB</span>
            <span className={`ml-2 font-bold ${
              auditReport.overallBudgetUtilizationPct > 100 ? 'text-rose-400' :
              auditReport.overallBudgetUtilizationPct > 80 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              ({auditReport.overallBudgetUtilizationPct}%)
            </span>
          </div>
        </div>

        {/* Multi-Segment Stacked Progress Bar */}
        <div className="w-full h-3 bg-[#0d1117] rounded-full overflow-hidden flex border border-[#30363d]">
          {/* Textures (Purple) */}
          <div 
            style={{ width: `${Math.min(100, (auditReport.textureVramUsedMb / auditReport.platformSpec.totalVramBudgetMb) * 100)}%` }}
            className="h-full bg-purple-500 transition-all duration-500 relative group"
            title={`Textures: ${auditReport.textureVramUsedMb} MB`}
          />
          {/* Meshes (Cyan) */}
          <div 
            style={{ width: `${Math.min(100, (auditReport.meshVramUsedMb / auditReport.platformSpec.totalVramBudgetMb) * 100)}%` }}
            className="h-full bg-cyan-500 transition-all duration-500 relative group"
            title={`Geometry & Meshes: ${auditReport.meshVramUsedMb} MB`}
          />
          {/* Audio Buffers (Amber) */}
          <div 
            style={{ width: `${Math.min(100, (auditReport.audioBufferUsedMb / auditReport.platformSpec.totalVramBudgetMb) * 100)}%` }}
            className="h-full bg-amber-500 transition-all duration-500 relative group"
            title={`Audio Buffers: ${auditReport.audioBufferUsedMb} MB`}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-gray-400 flex-wrap pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block"></span>
            <span>Textures ({auditReport.textureVramUsedMb} MB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block"></span>
            <span>3D Meshes / VBO ({auditReport.meshVramUsedMb} MB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span>
            <span>Audio Buffers ({auditReport.audioBufferUsedMb} MB)</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto text-emerald-400 font-bold">
            <TrendingDown size={13} />
            <span>Net Saved: {auditReport.totalVramSavedMb} MB ({auditReport.vramSavingsPercentage}%)</span>
          </div>
        </div>
      </div>

      {/* 3. THREE-CATEGORY DETAILED BREAKDOWN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Textures */}
        <div className="bg-[#161b26] border border-[#21262d] rounded-xl p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Image size={15} /> PBR Textures
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
              Limit: {auditReport.platformSpec.textureBudgetMb} MB
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-gray-400">Allocated Resident:</span>
            <span className="font-mono font-bold text-white">{auditReport.textureVramUsedMb} MB</span>
          </div>
          <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
            <div 
              style={{ width: `${Math.min(100, auditReport.textureBudgetUtilizationPct)}%` }}
              className={`h-full ${auditReport.textureBudgetUtilizationPct > 100 ? 'bg-rose-500' : auditReport.textureBudgetUtilizationPct > 80 ? 'bg-amber-500' : 'bg-purple-500'}`}
            />
          </div>
          <div className="text-[10px] text-gray-400 flex items-center justify-between">
            <span>Utilization</span>
            <span className="font-mono font-bold text-gray-300">{auditReport.textureBudgetUtilizationPct}%</span>
          </div>
        </div>

        {/* Card 2: 3D Meshes */}
        <div className="bg-[#161b26] border border-[#21262d] rounded-xl p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <Box size={15} /> 3D Meshes & Geometry
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Limit: {auditReport.platformSpec.geometryMeshBudgetMb} MB
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-gray-400">Vertex / Index VRAM:</span>
            <span className="font-mono font-bold text-white">{auditReport.meshVramUsedMb} MB</span>
          </div>
          <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
            <div 
              style={{ width: `${Math.min(100, auditReport.meshBudgetUtilizationPct)}%` }}
              className={`h-full ${auditReport.meshBudgetUtilizationPct > 100 ? 'bg-rose-500' : auditReport.meshBudgetUtilizationPct > 80 ? 'bg-amber-500' : 'bg-cyan-500'}`}
            />
          </div>
          <div className="text-[10px] text-gray-400 flex items-center justify-between">
            <span>Utilization</span>
            <span className="font-mono font-bold text-gray-300">{auditReport.meshBudgetUtilizationPct}%</span>
          </div>
        </div>

        {/* Card 3: Audio Buffers */}
        <div className="bg-[#161b26] border border-[#21262d] rounded-xl p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Volume2 size={15} /> Audio Ring Buffers
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Limit: {auditReport.platformSpec.audioBufferBudgetMb} MB
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-gray-400">Streaming Memory:</span>
            <span className="font-mono font-bold text-white">{auditReport.audioBufferUsedMb} MB</span>
          </div>
          <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
            <div 
              style={{ width: `${Math.min(100, auditReport.audioBudgetUtilizationPct)}%` }}
              className={`h-full ${auditReport.audioBudgetUtilizationPct > 100 ? 'bg-rose-500' : auditReport.audioBudgetUtilizationPct > 80 ? 'bg-amber-500' : 'bg-amber-500'}`}
            />
          </div>
          <div className="text-[10px] text-gray-400 flex items-center justify-between">
            <span>Utilization</span>
            <span className="font-mono font-bold text-gray-300">{auditReport.audioBudgetUtilizationPct}%</span>
          </div>
        </div>
      </div>

      {/* 4. MEMORY HOTSPOTS TABLE (High Consumer Assets) */}
      <div className="bg-[#161b26] border border-[#21262d] rounded-xl overflow-hidden flex flex-col">
        <div className="p-3 bg-[#111622] border-b border-[#21262d] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
            <AlertTriangle size={14} className="text-amber-400" />
            Top VRAM Hotspots & Technical Recommendations
          </div>
          <span className="text-[10px] font-mono text-gray-400">
            Showing top {auditReport.hotspots.length} high-impact assets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#21262d] bg-[#0e121a] text-[10px] uppercase text-gray-400">
                <th className="p-2.5 pl-3">Asset Name</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Resident VRAM</th>
                <th className="p-2.5">% of Category</th>
                <th className="p-2.5">Severity</th>
                <th className="p-2.5 pr-3">Actionable Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {auditReport.hotspots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-xs text-gray-500">
                    No critical hotspots detected. All assets are well within platform memory thresholds!
                  </td>
                </tr>
              ) : (
                auditReport.hotspots.map((hotspot, idx) => (
                  <tr key={idx} className="hover:bg-[#1f2633] transition-colors">
                    <td className="p-2.5 pl-3 font-medium text-white">{hotspot.assetName}</td>
                    <td className="p-2.5 text-gray-400">{hotspot.category}</td>
                    <td className="p-2.5 font-mono text-amber-300 font-bold">{hotspot.residentVramMb} MB</td>
                    <td className="p-2.5 font-mono text-gray-300">{hotspot.budgetPercentageOfCategory}%</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        hotspot.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        hotspot.severity === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {hotspot.severity}
                      </span>
                    </td>
                    <td className="p-2.5 pr-3 text-[11px] text-gray-400">{hotspot.recommendation}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. STUDIO ADVISORIES & HARDWARE GUARDRAILS */}
      <div className="bg-[#161b26] border border-[#21262d] rounded-xl p-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
          <ShieldCheck size={14} className="text-emerald-400" />
          Technical Director & Pipeline Advisories
        </div>
        <div className="flex flex-col gap-1.5 pt-1">
          {auditReport.studioAdvisories.map((adv, idx) => (
            <div key={idx} className="text-xs text-gray-300 flex items-start gap-2 bg-[#0e121a] p-2 rounded-lg border border-[#21262d]">
              <span>{adv}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. EXPORT ARTIFACTS ACTION BAR */}
      <div className="bg-[#111622] border border-[#21262d] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <FileDown size={14} className="text-amber-400" /> Export Industry-Standard Artifacts & Reports
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Download production-ready build manifests, spreadsheets, and Unreal/Unity configuration profiles.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadJson}
            disabled={!manifest}
            className="bg-[#21262d] hover:bg-[#30363d] disabled:opacity-40 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CI/CD Build JSON Manifest"
          >
            <FileCode size={13} className="text-amber-400" /> JSON Manifest
          </button>

          <button
            onClick={handleDownloadCsv}
            disabled={!manifest}
            className="bg-[#21262d] hover:bg-[#30363d] disabled:opacity-40 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CSV Performance & Asset Budget Sheet"
          >
            <FileSpreadsheet size={13} className="text-emerald-400" /> CSV Sheet
          </button>

          <button
            onClick={handleDownloadUnrealIni}
            disabled={!manifest}
            className="bg-[#21262d] hover:bg-[#30363d] disabled:opacity-40 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download DefaultDeviceProfiles.ini for Unreal Engine"
          >
            <Layers size={13} className="text-cyan-400" /> Unreal INI
          </button>

          <button
            onClick={handleDownloadHtmlReport}
            disabled={!manifest}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="Generate & View Self-Contained Interactive HTML Report"
          >
            <Globe size={13} /> HTML Report
          </button>
        </div>
      </div>
    </div>
  );
}
