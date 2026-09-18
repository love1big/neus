/**
 * ============================================================================
 * MODULE: VramBudgetAuditNode.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * โมดูลวิเคราะห์งบประมาณหน่วยความจำวิดีโอ (VRAM & System Memory Budget Auditor)
 * ทำหน้าที่ประเมินและตรวจสอบความคุ้มค่าของการใช้หน่วยความจำ VRAM สำหรับสินทรัพย์
 * ทั้งหมดที่ผ่านกระบวนการ Batch Optimization โดยคำนวณแยกตามประเภทย่อย:
 *  1. Texture Resident & Streaming VRAM (คำนวณตาม Mipmap levels และ Block Compression format)
 *  2. Vertex Buffer (VBO) & Index Buffer (IBO) สำหรับ Mesh แต่ละระดับ LOD
 *  3. Audio Streaming Ring-Buffer และ In-Memory Audio Decode Buffer
 * พร้อมทั้งเปรียบเทียบกับเพดานจำกัด (Hard Budget Limits) ของเป้าหมายแต่ละฮาร์ดแวร์
 * เช่น Steam Deck (4GB VRAM Budget), Mobile Vulkan (1.5GB VRAM Budget), AAA PC (12GB+).
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - นำเข้า Types: BatchOptimizerTypes.ts
 * - เรียกใช้งานโดย: BatchOptimizationPassRunner.ts และ BatchResourceOptimizer.tsx
 * - ให้ผลลัพธ์การวินิจฉัยเพื่อส่งต่อให้ UI วาดกราฟเปรียบเทียบงบประมาณ (Budget Bar Chart)
 * 
 * ข้อมูลการรับส่ง (Inputs, Outputs & Data Contracts):
 * ----------------------------------------------------------------------------
 * - Inputs:
 *   - `results`: OptimizedAssetResult[] จากการรัน Batch Pass
 *   - `platformPreset`: PlatformOptimizationPresetType (เช่น 'STEAM_DECK_BALANCED', 'MOBILE_VULKAN_PERF')
 * - Outputs:
 *   - `VramBudgetAuditReport`: รายงานเชิงลึกระบุ VRAM ที่ใช้จริง, ส่วนที่ประหยัดได้,
 *     เปอร์เซ็นต์การใช้งบประมาณเทียบกับเพดาน (Budget Utilization %), รายการ Hotspots
 *     และคำแนะนำระดับสตูดิโอ (Actionable Studio Advisories).
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - ตรวจสอบ array เปล่าอย่างปลอดภัย (Graceful zero return)
 * - คำนวณ fallback ค่า VRAM ในกรณีที่สินทรัพย์ไม่มีการวิเคราะห์เชิงลึก
 * - ตรวจจับกรณี Buffer Overflow หรือเกินงบประมาณ (Over-Budget Warning flags)
 * 
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ----------------------------------------------------------------------------
 * const auditReport = VramBudgetAuditNode.auditManifestResults(
 *   manifest.results,
 *   manifest.presetUsed
 * );
 * console.log(`Budget Health: ${auditReport.overallHealthScore}/100`);
 * ============================================================================
 */

import {
  OptimizedAssetResult,
  PlatformOptimizationPresetType
} from './BatchOptimizerTypes';

export interface PlatformVramBudgetSpec {
  platformId: PlatformOptimizationPresetType;
  platformName: string;
  totalVramBudgetMb: number;
  textureBudgetMb: number;
  geometryMeshBudgetMb: number;
  audioBufferBudgetMb: number;
  targetDrawCallsPerFrame: number;
  maxTextureDimension: number;
}

export interface VramAssetHotspot {
  assetId: string;
  assetName: string;
  category: string;
  residentVramMb: number;
  budgetPercentageOfCategory: number;
  severity: 'normal' | 'warning' | 'critical';
  recommendation: string;
}

export interface VramBudgetAuditReport {
  platformSpec: PlatformVramBudgetSpec;
  
  // Realized Usages Post-Optimization
  totalVramUsedMb: number;
  textureVramUsedMb: number;
  meshVramUsedMb: number;
  audioBufferUsedMb: number;
  
  // Pre-Optimization Baseline Usages
  baselineTotalVramMb: number;
  totalVramSavedMb: number;
  vramSavingsPercentage: number;
  
  // Budget Utilization Percentages
  overallBudgetUtilizationPct: number;
  textureBudgetUtilizationPct: number;
  meshBudgetUtilizationPct: number;
  audioBudgetUtilizationPct: number;
  
  // Status & Health
  isWithinBudget: boolean;
  overallHealthScore: number; // 0 - 100
  statusTag: 'EXCELLENT' | 'STABLE' | 'WARNING' | 'CRITICAL_OVERFLOW';
  
  // High-Memory Hotspots (Top memory consumers)
  hotspots: VramAssetHotspot[];
  
  // Actionable Technical Advisories
  studioAdvisories: string[];
}

export class VramBudgetAuditNode {
  /**
   * ฐานข้อมูลข้อกำหนดเพดานงบประมาณ VRAM ประจำแต่ละแพลตฟอร์ม
   */
  private static readonly PLATFORM_BUDGET_SPECS: Record<PlatformOptimizationPresetType, PlatformVramBudgetSpec> = {
    AAA_PC_ULTRA: {
      platformId: 'AAA_PC_ULTRA',
      platformName: 'AAA High-End PC (RTX 4080 / RX 7900)',
      totalVramBudgetMb: 12288,      // 12 GB
      textureBudgetMb: 8192,         // 8 GB
      geometryMeshBudgetMb: 3072,    // 3 GB
      audioBufferBudgetMb: 1024,     // 1 GB
      targetDrawCallsPerFrame: 4500,
      maxTextureDimension: 4096
    },
    STEAM_DECK_BALANCED: {
      platformId: 'STEAM_DECK_BALANCED',
      platformName: 'Steam Deck & Handhelds (Unified LPDDR5)',
      totalVramBudgetMb: 4096,       // 4 GB Allocated VRAM
      textureBudgetMb: 2457,         // ~2.4 GB
      geometryMeshBudgetMb: 1228,    // ~1.2 GB
      audioBufferBudgetMb: 409,      // ~400 MB
      targetDrawCallsPerFrame: 1800,
      maxTextureDimension: 2048
    },
    MOBILE_VULKAN_PERF: {
      platformId: 'MOBILE_VULKAN_PERF',
      platformName: 'Mobile Vulkan / Apple Silicon (iOS & Android)',
      totalVramBudgetMb: 1536,       // 1.5 GB Unified
      textureBudgetMb: 921,          // ~900 MB
      geometryMeshBudgetMb: 460,     // ~460 MB
      audioBufferBudgetMb: 153,      // ~150 MB
      targetDrawCallsPerFrame: 800,
      maxTextureDimension: 1024
    },
    VR_90FPS_LOW_LATENCY: {
      platformId: 'VR_90FPS_LOW_LATENCY',
      platformName: 'Standalone VR Headsets (Meta Quest 3 / Vision)',
      totalVramBudgetMb: 2560,       // 2.5 GB
      textureBudgetMb: 1536,         // 1.5 GB
      geometryMeshBudgetMb: 819,     // ~800 MB
      audioBufferBudgetMb: 204,      // ~200 MB
      targetDrawCallsPerFrame: 1200,
      maxTextureDimension: 2048
    },
    WEBGL_LIGHTWEIGHT: {
      platformId: 'WEBGL_LIGHTWEIGHT',
      platformName: 'WebGL 2.0 & WebGPU In-Browser Micro-Target',
      totalVramBudgetMb: 512,        // 512 MB
      textureBudgetMb: 307,          // ~300 MB
      geometryMeshBudgetMb: 153,     // ~150 MB
      audioBufferBudgetMb: 51,       // ~50 MB
      targetDrawCallsPerFrame: 400,
      maxTextureDimension: 512
    },
    CUSTOM_USER_DEFINED: {
      platformId: 'CUSTOM_USER_DEFINED',
      platformName: 'Custom Pipeline Specification',
      totalVramBudgetMb: 4096,
      textureBudgetMb: 2560,
      geometryMeshBudgetMb: 1024,
      audioBufferBudgetMb: 512,
      targetDrawCallsPerFrame: 2000,
      maxTextureDimension: 2048
    }
  };

  /**
   * ดึงข้อกำหนดเพดาน VRAM ของแพลตฟอร์ม
   */
  public static getPlatformBudgetSpec(platform: PlatformOptimizationPresetType): PlatformVramBudgetSpec {
    return this.PLATFORM_BUDGET_SPECS[platform] || this.PLATFORM_BUDGET_SPECS.CUSTOM_USER_DEFINED;
  }

  /**
   * ดำเนินการวิเคราะห์และออกรายงาน VRAM Budget Audit จากผลการรัน Batch Optimization
   * 
   * @param results รายการผลลัพธ์รายสินทรัพย์จากการรัน Batch Runner
   * @param platformPreset เป้าหมายแพลตฟอร์มที่เลือกใช้งาน
   * @returns รายงานเชิงลึกพร้อมคะแนนความสมบูรณ์และข้อเสนอแนะ
   */
  public static auditManifestResults(
    results: OptimizedAssetResult[],
    platformPreset: PlatformOptimizationPresetType
  ): VramBudgetAuditReport {
    const spec = this.getPlatformBudgetSpec(platformPreset);
    
    let textureVramUsedBytes = 0;
    let meshVramUsedBytes = 0;
    let audioBufferUsedBytes = 0;
    
    let baselineTextureVramBytes = 0;
    let baselineMeshVramBytes = 0;
    let baselineAudioBufferBytes = 0;

    const hotspotCandidates: VramAssetHotspot[] = [];

    // ประมวลผลแจกแจงรายสินทรัพย์
    for (const res of results) {
      if (res.status === 'failed' || res.status === 'skipped') continue;

      let residentBytes = 0;
      let baselineBytes = 0;

      if (res.category === 'texture') {
        // คำนวณจาก Texture Diagnostics หรือประมาณจาก Optimized Size
        if (res.textureDiagnostics?.estimatedVramKb) {
          residentBytes = res.textureDiagnostics.estimatedVramKb * 1024;
          baselineBytes = (res.originalSizeKb * 1.33) * 1024; // Uncompressed RGBA VRAM multiplier
        } else {
          residentBytes = res.optimizedSizeKb * 1024;
          baselineBytes = res.originalSizeKb * 1024 * 1.5;
        }
        textureVramUsedBytes += residentBytes;
        baselineTextureVramBytes += baselineBytes;

        const residentMb = +(residentBytes / (1024 * 1024)).toFixed(2);
        const categoryPct = spec.textureBudgetMb > 0 ? (residentMb / spec.textureBudgetMb) * 100 : 0;
        
        if (categoryPct > 5.0) {
          hotspotCandidates.push({
            assetId: res.assetId,
            assetName: res.assetName,
            category: 'Textures',
            residentVramMb: residentMb,
            budgetPercentageOfCategory: +categoryPct.toFixed(1),
            severity: categoryPct > 15 ? 'critical' : categoryPct > 8 ? 'warning' : 'normal',
            recommendation: categoryPct > 15 
              ? `Texture บริโภค VRAM ถึง ${categoryPct.toFixed(1)}% ของงบภาพ ควรเปิดใช้งาน Virtual Texturing หรือลด Mip0` 
              : `พิจารณาบีบอัดเพิ่มเติมด้วย BC7/ASTC 6x6 เพื่อลดขนาด`
          });
        }
      } else if (res.category === 'mesh') {
        if (res.meshDiagnostics?.lodsGenerated && res.meshDiagnostics.lodsGenerated.length > 0) {
          // รวม VRAM ทุก LOD Level ที่ต้องเก็บไว้ใน Vertex Buffer Pool
          const lodSumKb = res.meshDiagnostics.lodsGenerated.reduce((acc, lod) => acc + lod.vramSizeKb, 0);
          residentBytes = lodSumKb * 1024;
          baselineBytes = (res.originalSizeKb * 1024);
        } else {
          residentBytes = res.optimizedSizeKb * 1024;
          baselineBytes = res.originalSizeKb * 1024;
        }
        meshVramUsedBytes += residentBytes;
        baselineMeshVramBytes += baselineBytes;

        const residentMb = +(residentBytes / (1024 * 1024)).toFixed(2);
        const categoryPct = spec.geometryMeshBudgetMb > 0 ? (residentMb / spec.geometryMeshBudgetMb) * 100 : 0;
        
        if (categoryPct > 4.0) {
          hotspotCandidates.push({
            assetId: res.assetId,
            assetName: res.assetName,
            category: 'Meshes',
            residentVramMb: residentMb,
            budgetPercentageOfCategory: +categoryPct.toFixed(1),
            severity: categoryPct > 12 ? 'critical' : categoryPct > 6 ? 'warning' : 'normal',
            recommendation: `โมเดล 3D มีความหนาแน่นสูง แนะนำให้เพิ่มอัตราส่วน Decimation ใน LOD1-LOD3`
          });
        }
      } else if (res.category === 'audio') {
        // Audio Ring Buffer (หาก Streaming จะใช้เพียงบัฟเฟอร์ขนาดเล็ก 64KB - 256KB)
        const isStreaming = res.audioDiagnostics?.isStreamingLoaded ?? (res.optimizedSizeKb > 512);
        residentBytes = isStreaming ? 128 * 1024 : (res.optimizedSizeKb * 1024);
        baselineBytes = res.originalSizeKb * 1024;
        
        audioBufferUsedBytes += residentBytes;
        baselineAudioBufferBytes += baselineBytes;
      } else {
        // Other / Material
        residentBytes = res.optimizedSizeKb * 1024;
        baselineBytes = res.originalSizeKb * 1024;
        textureVramUsedBytes += residentBytes;
        baselineTextureVramBytes += baselineBytes;
      }
    }

    const totalVramUsedMb = +((textureVramUsedBytes + meshVramUsedBytes + audioBufferUsedBytes) / (1024 * 1024)).toFixed(2);
    const textureVramUsedMb = +(textureVramUsedBytes / (1024 * 1024)).toFixed(2);
    const meshVramUsedMb = +(meshVramUsedBytes / (1024 * 1024)).toFixed(2);
    const audioBufferUsedMb = +(audioBufferUsedBytes / (1024 * 1024)).toFixed(2);

    const baselineTotalVramMb = +((baselineTextureVramBytes + baselineMeshVramBytes + baselineAudioBufferBytes) / (1024 * 1024)).toFixed(2);
    const totalVramSavedMb = +(Math.max(0, baselineTotalVramMb - totalVramUsedMb)).toFixed(2);
    const vramSavingsPercentage = baselineTotalVramMb > 0 
      ? Math.round((totalVramSavedMb / baselineTotalVramMb) * 100) 
      : 0;

    const overallBudgetUtilizationPct = +(Math.min(200, (totalVramUsedMb / spec.totalVramBudgetMb) * 100)).toFixed(1);
    const textureBudgetUtilizationPct = +(Math.min(200, (textureVramUsedMb / spec.textureBudgetMb) * 100)).toFixed(1);
    const meshBudgetUtilizationPct = +(Math.min(200, (meshVramUsedMb / spec.geometryMeshBudgetMb) * 100)).toFixed(1);
    const audioBudgetUtilizationPct = +(Math.min(200, (audioBufferUsedMb / spec.audioBufferBudgetMb) * 100)).toFixed(1);

    const isWithinBudget = totalVramUsedMb <= spec.totalVramBudgetMb;

    // คำนวณคะแนนสุขภาพโดยรวม (0 - 100)
    let healthScore = 100;
    if (overallBudgetUtilizationPct > 100) {
      healthScore -= Math.min(60, (overallBudgetUtilizationPct - 100) * 1.5);
    } else if (overallBudgetUtilizationPct > 80) {
      healthScore -= (overallBudgetUtilizationPct - 80) * 0.8;
    }
    
    // ตรวจสอบ Hotspots วิกฤต
    const criticalHotspots = hotspotCandidates.filter(h => h.severity === 'critical').length;
    healthScore -= criticalHotspots * 8;
    healthScore = Math.max(10, Math.min(100, Math.round(healthScore)));

    let statusTag: 'EXCELLENT' | 'STABLE' | 'WARNING' | 'CRITICAL_OVERFLOW' = 'EXCELLENT';
    if (overallBudgetUtilizationPct > 100) {
      statusTag = 'CRITICAL_OVERFLOW';
    } else if (overallBudgetUtilizationPct > 80 || criticalHotspots > 0) {
      statusTag = 'WARNING';
    } else if (overallBudgetUtilizationPct > 50) {
      statusTag = 'STABLE';
    }

    // จัดลำดับ Hotspots จากมากไปหาน้อย
    hotspotCandidates.sort((a, b) => b.residentVramMb - a.residentVramMb);

    // สร้างคำแนะนำระดับสตูดิโอ (Studio Advisories)
    const studioAdvisories: string[] = [];
    if (overallBudgetUtilizationPct > 90) {
      studioAdvisories.push(`⚠️ งบประมาณ VRAM รวมใช้ไปแล้ว ${overallBudgetUtilizationPct}% ของเป้าหมาย ${spec.platformName} ควรพิจารณาเปิด Streaming Pools`);
    } else {
      studioAdvisories.push(`✅ งบประมาณ VRAM รวมอยู่ในเกณฑ์ที่ยอดเยี่ยม (${overallBudgetUtilizationPct}% ของงบประมาณ ${spec.totalVramBudgetMb} MB)`);
    }

    if (textureBudgetUtilizationPct > 85) {
      studioAdvisories.push(`🖼️ เท็กเจอร์ครองงบประมาณสูง (${textureBudgetUtilizationPct}%) แนะนำให้เปิด Mipmap Streaming Drop Mip 0 บนฮาร์ดแวร์เป้าหมายนี้`);
    }

    if (meshBudgetUtilizationPct > 80) {
      studioAdvisories.push(`📐 จีโอเมทรี 3D ครอง VRAM บัฟเฟอร์ (${meshBudgetUtilizationPct}%) ให้ตรวจสอบโมเดลที่ไม่มี LOD3/Imposter`);
    }

    if (totalVramSavedMb > 0) {
      studioAdvisories.push(`🎉 การรัน Batch Pass นี้ช่วยประหยัด VRAM ได้ทั้งหมด ${totalVramSavedMb} MB (${vramSavingsPercentage}% Net Reduction)`);
    }

    return {
      platformSpec: spec,
      totalVramUsedMb,
      textureVramUsedMb,
      meshVramUsedMb,
      audioBufferUsedMb,
      baselineTotalVramMb,
      totalVramSavedMb,
      vramSavingsPercentage,
      overallBudgetUtilizationPct: Number(overallBudgetUtilizationPct),
      textureBudgetUtilizationPct: Number(textureBudgetUtilizationPct),
      meshBudgetUtilizationPct: Number(meshBudgetUtilizationPct),
      audioBudgetUtilizationPct: Number(audioBudgetUtilizationPct),
      isWithinBudget,
      overallHealthScore: healthScore,
      statusTag,
      hotspots: hotspotCandidates.slice(0, 8),
      studioAdvisories
    };
  }
}
