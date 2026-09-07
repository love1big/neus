/**
 * ============================================================================
 * @file AssetDependencyFilterToolbar.tsx
 * @system Art & 3D Asset Topology Architecture
 * @module Asset Dependency Filter Toolbar & Controls
 * ============================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Purpose & Responsibility]:
 * แถบเครื่องมือควบคุมการค้นหา กรอง และปรับแต่งพารามิเตอร์การแสดงผล Force Graph:
 * 1. ตัวเลือกชุดโครงการทดสอบ (Project Preset Selector)
 * 2. ค้นหาแบบเรียลไทม์ (Real-Time Search Box) ค้นหาจากชื่อไฟล์, นามสกุล, หรือแท็ก
 * 3. ปุ่มกรองประเภทสินทรัพย์ (Type Filter Chips): Models, Textures, Materials, Shaders
 * 4. ปุ่มควบคุมฟิสิกส์ (Physics Play/Pause, Re-heat Simulation, Unpin All)
 * 5. สลับโหมดจัดกลุ่ม (Cluster by Asset Type Toggle)
 * 6. สลับการแสดงป้ายชื่อ (Show/Hide Labels) และเส้นแสงเคลื่อนที่ (Particle Pulses)
 * 7. ปุ่มส่งออกข้อมูล (Export JSON Graph, Export SVG Snapshot)
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture & Integration]:
 * - รับและส่งค่า State ผ่าน Props ให้ AssetDependencyGraphStudio.tsx
 * 
 * 📥 [Data Contracts]:
 * - filterState: AssetGraphFilterState
 * - currentPresetId: string
 * - isPaused: boolean
 * - onUpdateFilter: (updates: Partial<AssetGraphFilterState>) => void
 * - onSelectPreset: (presetId: string) => void
 * - onTogglePause: () => void
 * - onReheat: () => void
 * - onUnpinAll: () => void
 * - onExportJSON: () => void
 * - onExportSVG: () => void
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - ควบคุม State ด้วย TypeScript Strict Types
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  Sliders,
  Layers,
  Box,
  Image as ImageIcon,
  Zap,
  Tag,
  PinOff,
  Eye,
  EyeOff,
  FileDown,
  Camera,
  FolderOpen
} from 'lucide-react';
import {
  AssetType,
  AssetGraphFilterState,
  AssetProjectPreset
} from '../types/assetDependencyGraph';
import { ALL_ASSET_PRESETS } from '../utils/AssetDependencyGraphRepository';

interface Props {
  filterState: AssetGraphFilterState;
  currentPresetId: string;
  isPaused: boolean;
  onUpdateFilter: (updates: Partial<AssetGraphFilterState>) => void;
  onSelectPreset: (presetId: string) => void;
  onTogglePause: () => void;
  onReheat: () => void;
  onUnpinAll: () => void;
  onExportJSON: () => void;
  onExportSVG: () => void;
  clusteringEnabled: boolean;
  onToggleClustering: () => void;
}

const FILTERABLE_TYPES: Array<{ type: AssetType; label: string; icon: React.ReactNode; color: string }> = [
  { type: 'model_3d', label: '3D Models', icon: <Box size={13} />, color: 'text-amber-400' },
  { type: 'texture', label: 'Textures', icon: <ImageIcon size={13} />, color: 'text-purple-400' },
  { type: 'material', label: 'Materials', icon: <Zap size={13} />, color: 'text-emerald-400' },
  { type: 'prefab', label: 'Prefabs', icon: <Layers size={13} />, color: 'text-orange-400' }
];

export default function AssetDependencyFilterToolbar({
  filterState,
  currentPresetId,
  isPaused,
  onUpdateFilter,
  onSelectPreset,
  onTogglePause,
  onReheat,
  onUnpinAll,
  onExportJSON,
  onExportSVG,
  clusteringEnabled,
  onToggleClustering
}: Props) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  // สลับการเลือกประเภทของตัวกรอง
  const handleToggleType = (type: AssetType) => {
    let newTypes: AssetType[];
    if (filterState.selectedTypes.includes(type)) {
      newTypes = filterState.selectedTypes.filter(t => t !== type);
    } else {
      newTypes = [...filterState.selectedTypes, type];
    }
    onUpdateFilter({ selectedTypes: newTypes });
  };

  const handleSelectAllTypes = () => {
    onUpdateFilter({ selectedTypes: [] }); // Empty = all
  };

  return (
    <div 
      id="asset-dependency-toolbar"
      className="w-full bg-[#161b22] border-b border-[#21262d] px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs z-10"
    >
      {/* ส่วนซ้าย: Preset Selector & Search Input */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 bg-[#0d1117] px-2 py-1 rounded border border-[#30363d]">
          <FolderOpen size={13} className="text-amber-400 shrink-0" />
          <select
            id="asset-preset-select"
            value={currentPresetId}
            onChange={(e) => onSelectPreset(e.target.value)}
            className="bg-transparent text-gray-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
          >
            {ALL_ASSET_PRESETS.map(preset => (
              <option key={preset.id} value={preset.id} className="bg-[#161b22] text-white">
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Real-time Search Box */}
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-2.5 text-gray-400 pointer-events-none" />
          <input
            id="asset-search-input"
            type="text"
            placeholder="Search textures, models, .fbx, .png..."
            value={filterState.searchQuery}
            onChange={(e) => onUpdateFilter({ searchQuery: e.target.value })}
            className="w-48 md:w-60 pl-8 pr-3 py-1 bg-[#0d1117] border border-[#30363d] focus:border-blue-500 rounded text-xs text-white placeholder-gray-500 focus:outline-none transition"
          />
          {filterState.searchQuery && (
            <button
              onClick={() => onUpdateFilter({ searchQuery: '' })}
              className="absolute right-2 text-gray-400 hover:text-white text-[11px]"
            >
              ×
            </button>
          )}
        </div>

        {/* Type Filter Chips */}
        <div className="hidden sm:flex items-center gap-1 border-l border-[#30363d] pl-2">
          <button
            onClick={handleSelectAllTypes}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              filterState.selectedTypes.length === 0
                ? 'bg-blue-600 text-white'
                : 'bg-[#21262d] text-gray-400 hover:text-gray-200'
            }`}
          >
            All
          </button>
          {FILTERABLE_TYPES.map(ft => {
            const isActive = filterState.selectedTypes.includes(ft.type);
            return (
              <button
                key={ft.type}
                onClick={() => handleToggleType(ft.type)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition border ${
                  isActive
                    ? 'bg-[#2d333b] text-white border-blue-500'
                    : 'bg-[#0d1117] text-gray-400 border-[#30363d] hover:text-gray-200'
                }`}
              >
                <span className={ft.color}>{ft.icon}</span>
                <span>{ft.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ส่วนขวา: Simulation Controls, View Toggles & Export */}
      <div className="flex items-center gap-1.5">
        {/* Type Clustering Toggle */}
        <button
          id="toggle-cluster-btn"
          onClick={onToggleClustering}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition ${
            clusteringEnabled
              ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/60 shadow-sm'
              : 'bg-[#0d1117] text-gray-400 border-[#30363d] hover:text-gray-200'
          }`}
          title={clusteringEnabled ? 'Switch to Freeform Physics Layout' : 'Organize in Functional Asset Type Clusters'}
        >
          <Layers size={13} className={clusteringEnabled ? 'text-indigo-400' : ''} />
          <span className="hidden md:inline">Type Clusters</span>
        </button>

        {/* Labels Toggle */}
        <button
          onClick={() => onUpdateFilter({ showLabels: !filterState.showLabels })}
          className={`p-1.5 rounded border transition ${
            filterState.showLabels
              ? 'bg-[#21262d] text-white border-blue-500/50'
              : 'bg-[#0d1117] text-gray-500 border-[#30363d]'
          }`}
          title={filterState.showLabels ? 'Hide Node Labels' : 'Show Node Labels'}
        >
          {filterState.showLabels ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>

        {/* Particle Pulses Toggle */}
        <button
          onClick={() => onUpdateFilter({ showParticlePulses: !filterState.showParticlePulses })}
          className={`p-1.5 rounded border transition ${
            filterState.showParticlePulses
              ? 'bg-amber-950/40 text-amber-300 border-amber-500/50'
              : 'bg-[#0d1117] text-gray-500 border-[#30363d]'
          }`}
          title={filterState.showParticlePulses ? 'Disable Dependency Stream Particles' : 'Enable Dependency Stream Particles'}
        >
          <Sparkles size={13} className={filterState.showParticlePulses ? 'fill-amber-400' : ''} />
        </button>

        {/* Unpin All Positions */}
        <button
          onClick={onUnpinAll}
          className="p-1.5 rounded bg-[#0d1117] hover:bg-[#21262d] text-gray-400 hover:text-white border border-[#30363d] transition"
          title="Release all pinned nodes"
        >
          <PinOff size={13} />
        </button>

        {/* Physics Play / Pause */}
        <button
          id="physics-play-pause-btn"
          onClick={onTogglePause}
          className={`p-1.5 rounded border transition ${
            isPaused
              ? 'bg-amber-600 text-white border-amber-500'
              : 'bg-[#0d1117] text-gray-300 border-[#30363d] hover:text-white'
          }`}
          title={isPaused ? 'Resume Physics Simulation' : 'Freeze / Pause Simulation'}
        >
          {isPaused ? <Play size={13} className="fill-white" /> : <Pause size={13} className="fill-gray-300" />}
        </button>

        {/* Reheat Simulation */}
        <button
          id="physics-reheat-btn"
          onClick={onReheat}
          className="p-1.5 rounded bg-[#0d1117] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363d] transition"
          title="Re-run / Jiggle Physics Layout"
        >
          <RotateCcw size={13} />
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            id="export-asset-graph-btn"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#2d333b] text-gray-200 border border-[#30363d] transition font-medium"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-1.5 w-48 bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl py-1 text-xs z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  onExportJSON();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-300 hover:bg-[#21262d] hover:text-white flex items-center gap-2"
              >
                <FileDown size={14} className="text-blue-400" />
                <span>Export Graph JSON</span>
              </button>
              <button
                onClick={() => {
                  onExportSVG();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-300 hover:bg-[#21262d] hover:text-white flex items-center gap-2"
              >
                <Camera size={14} className="text-emerald-400" />
                <span>Export SVG Snapshot</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
