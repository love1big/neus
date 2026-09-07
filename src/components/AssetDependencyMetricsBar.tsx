/**
 * ============================================================================
 * @file AssetDependencyMetricsBar.tsx
 * @system Art & 3D Asset Topology Architecture
 * @module Asset Dependency Metrics & Health Bar
 * ============================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Purpose & Responsibility]:
 * แถบแสดงสถิติและผลการวินิจฉัยสุขภาพของโครงสร้างสินทรัพย์ (Asset Topology Metrics):
 * 1. แสดงคะแนนสุขภาพของโครงการ (Health Score 0-100) พร้อมวงแหวนสถานะ
 * 2. แสดงจำนวน 3D Models, PBR Textures, Materials, Shaders, และ Prefabs
 * 3. คำนวณขนาดหน่วยความจำ VRAM รวม และขนาดไฟล์บนดิสก์
 * 4. แจ้งเตือนสินทรัพย์ตกค้าง (Orphans) พร้อมปุ่มคลิกเดียวเพื่อล้างขยะ (Quick Clean)
 * 5. แจ้งเตือนลิงก์ขาดหาย (Broken Links / Missing Assets) และการอ้างอิงวนลูป (Cycles)
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture & Integration]:
 * - รับข้อมูล AssetDependencyMetrics จาก AssetDependencyGraphStudio.tsx
 * - สื่อสารผ่าน Action Callbacks เช่น onCleanOrphans, onFilterStatus
 * 
 * 📥 [Data Contracts]:
 * - metrics: AssetDependencyMetrics
 * - onCleanOrphans?: () => void
 * - onFilterStatus?: (status: 'all' | 'orphans_only' | 'broken_only' | 'high_vram_only') => void
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - รองรับค่า undefined ใน metrics ด้วย default 0
 * ============================================================================
 */

import React from 'react';
import {
  Activity,
  Box,
  Image as ImageIcon,
  Layers,
  HardDrive,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Sparkles,
  RefreshCw,
  Zap,
  HelpCircle
} from 'lucide-react';
import { AssetDependencyMetrics } from '../types/assetDependencyGraph';
import { formatBytes } from '../utils/AssetDependencyGraphRepository';

interface Props {
  metrics: AssetDependencyMetrics;
  onCleanOrphans?: () => void;
  onFilterStatus?: (status: 'all' | 'orphans_only' | 'broken_only' | 'high_vram_only') => void;
  currentStatusFilter: string;
}

export default function AssetDependencyMetricsBar({
  metrics,
  onCleanOrphans,
  onFilterStatus,
  currentStatusFilter
}: Props) {
  // สีคะแนนสุขภาพ
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div 
      id="asset-dependency-metrics-bar"
      className="w-full bg-[#11161f] border-b border-[#21262d] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs"
    >
      {/* ฝั่งซ้าย: Health Score & Asset Counts */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Health Score Badge */}
        <div 
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-semibold tracking-wide ${getHealthColor(metrics.healthScore)}`}
          title={`Asset Pipeline Health: ${metrics.healthScore}/100. Lower scores indicate broken links, orphans, or circular dependencies.`}
        >
          <Activity size={14} className="animate-pulse" />
          <span>Health: {metrics.healthScore}%</span>
        </div>

        {/* Total Assets */}
        <div className="flex items-center gap-1 text-gray-300 bg-[#161b22] px-2.5 py-1 rounded border border-[#30363d]">
          <Layers size={13} className="text-blue-400" />
          <span className="font-semibold text-white">{metrics.totalAssets}</span>
          <span className="text-gray-400 text-[11px]">Assets</span>
        </div>

        {/* 3D Models */}
        <div className="flex items-center gap-1 text-gray-300 bg-[#161b22] px-2.5 py-1 rounded border border-[#30363d]">
          <Box size={13} className="text-amber-400" />
          <span className="font-semibold text-white">{metrics.totalModels}</span>
          <span className="text-gray-400 text-[11px]">Models</span>
        </div>

        {/* Textures */}
        <div className="flex items-center gap-1 text-gray-300 bg-[#161b22] px-2.5 py-1 rounded border border-[#30363d]">
          <ImageIcon size={13} className="text-purple-400" />
          <span className="font-semibold text-white">{metrics.totalTextures}</span>
          <span className="text-gray-400 text-[11px]">Textures</span>
        </div>

        {/* Materials */}
        <div className="hidden md:flex items-center gap-1 text-gray-300 bg-[#161b22] px-2.5 py-1 rounded border border-[#30363d]">
          <Zap size={13} className="text-emerald-400" />
          <span className="font-semibold text-white">{metrics.totalMaterials}</span>
          <span className="text-gray-400 text-[11px]">Materials</span>
        </div>

        {/* Disk & VRAM Metrics */}
        <div className="hidden lg:flex items-center gap-2 border-l border-[#30363d] pl-2 text-gray-400">
          <div className="flex items-center gap-1" title="Combined asset disk footprint">
            <HardDrive size={13} className="text-cyan-400" />
            <span className="text-gray-200 font-mono">{formatBytes(metrics.totalDiskSizeBytes)}</span>
            <span className="text-[10px]">Disk</span>
          </div>
          <div className="flex items-center gap-1" title="Estimated GPU VRAM allocation when loaded">
            <Cpu size={13} className="text-rose-400" />
            <span className="text-gray-200 font-mono">{formatBytes(metrics.totalVRAMEstimateBytes)}</span>
            <span className="text-[10px]">Est. VRAM</span>
          </div>
        </div>
      </div>

      {/* ฝั่งขวา: Alerts, Filter Shortcuts & Quick Actions */}
      <div className="flex items-center gap-2">
        {/* Broken Links Filter Button */}
        {metrics.brokenLinkCount > 0 && (
          <button
            id="filter-broken-links-btn"
            onClick={() => onFilterStatus?.(currentStatusFilter === 'broken_only' ? 'all' : 'broken_only')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition border ${
              currentStatusFilter === 'broken_only'
                ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-900/40 font-semibold'
                : 'bg-rose-950/40 text-rose-300 border-rose-500/40 hover:bg-rose-900/50'
            }`}
            title="Click to toggle filtering broken references"
          >
            <AlertTriangle size={13} />
            <span>{metrics.brokenLinkCount} Broken</span>
          </button>
        )}

        {/* Orphan Assets Filter & Clean Button */}
        {metrics.orphanCount > 0 ? (
          <div className="flex items-center gap-1">
            <button
              id="filter-orphans-btn"
              onClick={() => onFilterStatus?.(currentStatusFilter === 'orphans_only' ? 'all' : 'orphans_only')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition border ${
                currentStatusFilter === 'orphans_only'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-900/40 font-semibold'
                  : 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-900/50'
              }`}
              title="Click to isolate unreferenced orphan assets"
            >
              <AlertTriangle size={13} />
              <span>{metrics.orphanCount} Orphans</span>
            </button>

            {onCleanOrphans && (
              <button
                id="clean-orphans-btn"
                onClick={onCleanOrphans}
                className="flex items-center gap-1 px-2 py-1 rounded bg-[#21262d] hover:bg-rose-900/50 text-gray-300 hover:text-rose-200 border border-[#30363d] hover:border-rose-500/50 text-xs transition"
                title="Remove unreferenced assets from project"
              >
                <Trash2 size={12} />
                <span className="hidden sm:inline">Clean</span>
              </button>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1 text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]">
            <CheckCircle2 size={12} />
            <span>0 Orphans</span>
          </div>
        )}

        {/* Circular Dependency Indicator */}
        {metrics.circularDependencyCount > 0 && (
          <div 
            className="flex items-center gap-1 text-orange-400 bg-orange-950/40 px-2 py-1 rounded border border-orange-500/40 text-xs"
            title={`${metrics.circularDependencyCount} circular reference cycles detected!`}
          >
            <RefreshCw size={12} className="animate-spin" />
            <span>{metrics.circularDependencyCount} Cycle</span>
          </div>
        )}
      </div>
    </div>
  );
}
