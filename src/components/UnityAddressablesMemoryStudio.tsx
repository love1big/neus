/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Unity Addressables Asset Management & Bundle Memory Profiler Studio (Unity parity).
 *          Visual asset bundle group hierarchy, live RAM allocation meter, duplicate dependency
 *          highlighter, async load/unload simulation, and On-Device Offline AI bundle deduplicator.
 *    - TH: สตูดิโอจัดการแอสเซตและมอนิเตอร์แรม Unity Addressables (Unity Parity)
 *          จัดกลุ่มบันเดิล (Asset Groups), มิเตอร์แสดงการใช้แรมจริงของแต่ละ Prefab/Texture,
 *          ระบบจำลองการโหลดและปล่อยหน่วยความจำ (Async Load / Release), ไฮไลต์ไฟล์ซ้ำซ้อน,
 *          และระบบ AI ออฟไลน์ช่วยแยกคอมมอนบันเดิลเพื่อประหยัดขนาดแอป
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `unityAddressablesTypes.ts` and `UnityAddressablesEngineNode.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Props: `onSelectTool?: (toolId: string) => void`
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Layers,
  Database,
  HardDrive,
  Sparkles,
  Zap,
  FolderTree,
  AlertTriangle,
  CheckCircle2,
  Download,
  Trash2,
  Activity
} from 'lucide-react';
import { unityAddressablesEngine } from '../utils/UnityAddressablesEngineNode';
import { UnityAddressablesProfile } from '../types/unityAddressablesTypes';

interface AddressablesStudioProps {
  onSelectTool?: (toolId: string) => void;
}

export default function UnityAddressablesMemoryStudio({ onSelectTool }: AddressablesStudioProps) {
  const [profile, setProfile] = useState<UnityAddressablesProfile>(() =>
    unityAddressablesEngine.getProfile()
  );

  useEffect(() => {
    return unityAddressablesEngine.subscribe(() => {
      setProfile({ ...unityAddressablesEngine.getProfile() });
    });
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#080d19] text-[#e2e8f0] font-sans select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 border-b border-[#1b253b] bg-[#0c1426] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
            <Boxes size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                Unity Addressables Asset Management & Bundle Memory Profiler
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 font-mono">
                Unity 6 Addressables Parity
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Asset Bundling Modes (LZ4/LZMA), Async Handle Lifecycles, and On-Device Offline AI Asset Deduplication.
            </p>
          </div>
        </div>

        {/* AI Action */}
        <button
          onClick={() => unityAddressablesEngine.optimizeDuplicatesWithAI()}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Sparkles size={13} />
          AI Deduplicate Shared Bundles
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* ASSET BUNDLE ENTRIES (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-r border-[#1b253b] bg-[#080d19] overflow-hidden">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1426] flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <FolderTree size={13} className="text-emerald-400" />
              Addressable Asset Catalog ({profile.assets.length} items)
            </span>

            <span className="text-emerald-400 font-bold">Profile: {profile.profileName}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {profile.assets.map(asset => (
              <div
                key={asset.guid}
                className={`p-3 rounded-xl border transition-all ${
                  asset.isLoadedInMemory
                    ? 'bg-[#0f1b2d] border-emerald-500/50 shadow-sm'
                    : 'bg-[#0b1220] border-[#1a263d] opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{asset.address}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#1e293b] text-[#94a3b8] text-[9px]">
                      {asset.groupName}
                    </span>
                  </div>

                  <span className="text-emerald-400 font-bold">
                    {(asset.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {asset.labels.map(l => (
                      <span key={l} className="px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 text-[9px] border border-teal-500/30">
                        {l}
                      </span>
                    ))}
                    {asset.duplicateRefCount > 1 && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[9px] border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle size={9} /> Duplicated in {asset.duplicateRefCount} Bundles
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => unityAddressablesEngine.toggleAssetMemory(asset.guid)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                      asset.isLoadedInMemory
                        ? 'bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-500/40'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                  >
                    {asset.isLoadedInMemory ? 'Release Handle' : 'Async Load'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-[#1b253b] bg-[#0c1426] flex items-center justify-between text-xs font-mono">
            <span className="text-[#94a3b8]">Live RAM Resident: <strong className="text-emerald-400">{profile.totalMemoryAllocatedMB} MB</strong></span>
            <span className="text-[#94a3b8]">Total Bundles: <strong>{profile.totalBundlesCount}</strong></span>
          </div>

        </div>

        {/* GROUP SETTINGS & DEDUPLICATION (5 cols) */}
        <div className="lg:col-span-5 bg-[#0a1122] flex flex-col overflow-hidden">
          
          <div className="p-3 border-b border-[#1b253b] bg-[#0c1426] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-emerald-400" /> Bundle Packing Schema
            </span>
            <span className="text-[10px] font-mono text-emerald-400">{profile.groups.length} Groups</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {profile.groups.map(g => (
              <div key={g.groupName} className="p-3 rounded-xl bg-[#0f1728] border border-[#1b273e] space-y-1.5">
                <div className="flex justify-between text-white font-bold">
                  <span>{g.groupName}</span>
                  <span className="text-teal-400 text-[10px]">{g.compression}</span>
                </div>
                <div className="text-[10px] text-[#94a3b8]">
                  Mode: <strong className="text-slate-300">{g.bundlingMode}</strong>
                </div>
                <div className="text-[10px] text-[#94a3b8]">
                  Build Target: <strong className="text-slate-300">{g.buildPath}</strong>
                </div>
              </div>
            ))}

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5 font-sans">
              <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">
                On-Device Offline AI Bundle Pruning
              </span>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                {profile.offlineAIDeduplicationSummary}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
