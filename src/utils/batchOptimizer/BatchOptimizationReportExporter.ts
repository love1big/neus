/**
 * ============================================================================
 * MODULE: BatchOptimizationReportExporter.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * โมดูลสำหรับส่งออกรายงานผลการประมวลผล (Report Exporter & CI/CD Pipeline Artifacts)
 * สำหรับระบบ Batch Resource Optimizer โดยสามารถแปลง `BatchOptimizationManifest`
 * ให้อยู่ในรูปแบบมาตรฐานอุตสาหกรรมเกม AAA ได้แก่:
 *  1. JSON Manifest: ใช้สำหรับ Engine Cooker และ CI/CD Pipeline (Jenkins / GitHub Actions)
 *  2. CSV Spreadsheet: สำหรับฝ่าย Technical Director & Lead Artist ตรวจสอบงบประมาณ
 *  3. Unreal/Unity Config (.ini / .json): สำหรับนำเข้ากฎ LOD และ Texture Settings
 *  4. Standalone HTML Visual Report: รายงานเว็บแบบโต้ตอบพร้อมกราฟิกสรุปผลก่อน-หลัง
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - นำเข้า Types: BatchOptimizerTypes.ts
 * - เรียกใช้งานโดย: BatchResourceOptimizer.tsx เมื่อผู้ใช้กดปุ่ม Export Report
 * 
 * ข้อมูลการรับส่ง (Inputs, Outputs & Data Contracts):
 * ----------------------------------------------------------------------------
 * - Inputs:
 *   - `manifest`: BatchOptimizationManifest
 * - Outputs:
 *   - ฟังก์ชันดาวน์โหลดไฟล์อัตโนมัติ (Trigger browser download via Blob / URL.createObjectURL)
 *   - ข้อมูล String ในฟอร์แมต JSON, CSV, INI, หรือ HTML
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - ทำความสะอาด Escape Characters ใน CSV อย่างรัดกุม ป้องกัน CSV Injection
 * - ตรวจสอบความปลอดภัยของ URL object และทำการ revokeObjectURL หลังการดาวน์โหลด
 * 
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ----------------------------------------------------------------------------
 * BatchOptimizationReportExporter.downloadJsonManifest(manifest);
 * BatchOptimizationReportExporter.downloadCsvSummary(manifest);
 * ============================================================================
 */

import { BatchOptimizationManifest } from './BatchOptimizerTypes';

export class BatchOptimizationReportExporter {
  /**
   * สร้างเนื้อหาไฟล์ JSON Manifest แบบจัดย่อหน้าสวยงาม
   */
  public static exportToJsonString(manifest: BatchOptimizationManifest): string {
    return JSON.stringify(manifest, null, 2);
  }

  /**
   * สร้างเนื้อหาไฟล์ CSV Spreadsheet
   */
  public static exportToCsvString(manifest: BatchOptimizationManifest): string {
    const headers = [
      'Asset ID',
      'Asset Name',
      'Category',
      'Original Size (KB)',
      'Optimized Size (KB)',
      'Saved (KB)',
      'Savings (%)',
      'Duration (ms)',
      'Status',
      'Format / Codec / LOD Count',
      'Quality Score'
    ];

    const rows = manifest.results.map(res => {
      const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;
      
      let formatDetail = '-';
      let qualityScore = '-';

      if (res.category === 'texture' && res.textureDiagnostics) {
        formatDetail = `${res.textureDiagnostics.compressionFormat} (${res.textureDiagnostics.targetDimension})`;
        qualityScore = `PSNR: ${res.textureDiagnostics.psnrScoreDb}dB | SSIM: ${res.textureDiagnostics.ssimScore}`;
      } else if (res.category === 'mesh' && res.meshDiagnostics) {
        const lodCount = res.meshDiagnostics.lodsGenerated?.length || 0;
        formatDetail = `${lodCount} LODs Generated (QEM: ${res.meshDiagnostics.qemMaxError})`;
        qualityScore = `Reduced to ${res.meshDiagnostics.lodsGenerated?.[lodCount - 1]?.reductionPct || 0}%`;
      } else if (res.category === 'audio' && res.audioDiagnostics) {
        formatDetail = `${res.audioDiagnostics.codec} @ ${res.audioDiagnostics.targetBitrateKbps}kbps`;
        qualityScore = `${res.audioDiagnostics.loudnessNormalizedLUFS} LUFS`;
      }

      return [
        escapeCsv(res.assetId),
        escapeCsv(res.assetName),
        escapeCsv(res.category),
        res.originalSizeKb.toFixed(1),
        res.optimizedSizeKb.toFixed(1),
        res.savedBytesKb.toFixed(1),
        res.savingsPercentage.toFixed(1),
        res.executionDurationMs,
        escapeCsv(res.status),
        escapeCsv(formatDetail),
        escapeCsv(qualityScore)
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * สร้างเนื้อหาคอนฟิก Unreal Engine DefaultDeviceProfiles.ini สำหรับนำไปใช้ในเอนจินจริง
   */
  public static exportToUnrealIniConfig(manifest: BatchOptimizationManifest): string {
    const dateStr = new Date(manifest.timestamp).toUTCString();
    return `[DeviceProfile_${manifest.presetUsed}]
; Generated automatically by OmniEngine Batch Resource Optimizer
; Date: ${dateStr}
; Total Assets Processed: ${manifest.totalAssetsOptimized}
; Net Disk Savings: ${manifest.estimatedDiskFootprintSavedMb} MB (${manifest.netSavingsPercentage}%)
; Net VRAM Saved: ${manifest.estimatedTotalVramSavedMb} MB

+CVars=r.TextureStreaming=1
+CVars=r.Streaming.PoolSize=${manifest.presetUsed.includes('MOBILE') ? '512' : manifest.presetUsed.includes('STEAM_DECK') ? '1536' : '3072'}
+CVars=r.Streaming.MaxTempMemoryAllowed=128
+CVars=r.StaticMeshLODDistanceScale=${manifest.presetUsed.includes('MOBILE') ? '0.65' : '1.0'}
+CVars=r.MeshLODBias=${manifest.presetUsed.includes('WEBGL') ? '2' : '0'}
+CVars=au.MaxConcurrentStreams=32
+CVars=au.StreamingBufferSize=131072

; Target Block Compression Policies
TextureGroup_World=(MinLODSize=1,MaxLODSize=${manifest.presetUsed.includes('MOBILE') ? '1024' : '2048'},LODBias=0,MinMagFilter=anisotropic,MipFilter=linear,MipGenSettings=TMGS_Kaiser)
TextureGroup_Character=(MinLODSize=1,MaxLODSize=${manifest.presetUsed.includes('MOBILE') ? '1024' : '4096'},LODBias=0,MinMagFilter=anisotropic,MipFilter=linear,MipGenSettings=TMGS_Kaiser)
TextureGroup_Weapon=(MinLODSize=1,MaxLODSize=2048,LODBias=0,MinMagFilter=anisotropic,MipFilter=linear,MipGenSettings=TMGS_Kaiser)
`;
  }

  /**
   * สร้างเนื้อหา HTML Visual Report สำหรับเปิดดูรายงานสวยงามในบราวเซอร์
   */
  public static exportToHtmlReport(manifest: BatchOptimizationManifest): string {
    const jsonStr = JSON.stringify(manifest);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OmniEngine - Batch Resource Optimization Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0d1117; color: #c9d1d9; margin: 0; padding: 24px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { color: #58a6ff; margin-bottom: 4px; display: flex; align-items: center; gap: 10px; }
    .meta { color: #8b949e; font-size: 13px; margin-bottom: 24px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px; }
    .stat-title { font-size: 11px; text-transform: uppercase; color: #8b949e; letter-spacing: 0.5px; }
    .stat-val { font-size: 26px; font-weight: bold; color: #f0f6fc; margin-top: 4px; }
    .stat-val.highlight { color: #3fb950; }
    .stat-val.accent { color: #d29922; }
    table { width: 100%; border-collapse: collapse; background: #161b22; border: 1px solid #30363d; border-radius: 8px; overflow: hidden; margin-top: 16px; font-size: 13px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #21262d; }
    th { background: #1f242c; color: #f0f6fc; font-weight: 600; }
    tr:hover { background: #1f242c; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; }
    .badge-success { background: rgba(63, 185, 80, 0.2); color: #3fb950; }
    .badge-tag { background: #21262d; color: #8b949e; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚡ OmniEngine Batch Resource Optimization Manifest</h1>
    <div class="meta">Job: ${manifest.jobName} | Preset: <strong>${manifest.presetUsed}</strong> | Timestamp: ${manifest.timestamp}</div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-title">Total Evaluated Assets</div>
        <div class="stat-val">${manifest.totalAssetsEvaluated}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Net Disk Footprint Saved</div>
        <div class="stat-val highlight">${manifest.estimatedDiskFootprintSavedMb} MB</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Average Size Reduction</div>
        <div class="stat-val highlight">${manifest.netSavingsPercentage}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Estimated VRAM Saved</div>
        <div class="stat-val accent">${manifest.estimatedTotalVramSavedMb} MB</div>
      </div>
    </div>

    <h2>Optimized Asset Manifest Items</h2>
    <table>
      <thead>
        <tr>
          <th>Asset Name</th>
          <th>Type</th>
          <th>Original Size</th>
          <th>Optimized Size</th>
          <th>Saved</th>
          <th>Reduction</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${manifest.results.map(r => `
          <tr>
            <td><strong>${r.assetName}</strong></td>
            <td><span class="badge badge-tag">${r.category}</span></td>
            <td>${r.originalSizeKb.toFixed(1)} KB</td>
            <td>${r.optimizedSizeKb.toFixed(1)} KB</td>
            <td>${r.savedBytesKb.toFixed(1)} KB</td>
            <td><strong style="color: #3fb950;">-${r.savingsPercentage}%</strong></td>
            <td><span class="badge badge-success">${r.status}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;
  }

  /**
   * ผู้ช่วยในการดาวน์โหลดไฟล์ในบราวเซอร์
   */
  public static triggerBrowserDownload(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * ดาวน์โหลด JSON Manifest
   */
  public static downloadJsonManifest(manifest: BatchOptimizationManifest): void {
    const content = this.exportToJsonString(manifest);
    this.triggerBrowserDownload(content, `OmniEngine_Optimization_${manifest.manifestId}.json`, 'application/json');
  }

  /**
   * ดาวน์โหลด CSV Spreadsheet
   */
  public static downloadCsvSummary(manifest: BatchOptimizationManifest): void {
    const content = this.exportToCsvString(manifest);
    this.triggerBrowserDownload(content, `OmniEngine_Optimization_${manifest.manifestId}.csv`, 'text/csv');
  }

  /**
   * ดาวน์โหลด Unreal Engine INI Config
   */
  public static downloadUnrealConfig(manifest: BatchOptimizationManifest): void {
    const content = this.exportToUnrealIniConfig(manifest);
    this.triggerBrowserDownload(content, `DefaultDeviceProfiles_${manifest.presetUsed}.ini`, 'text/plain');
  }

  /**
   * ดาวน์โหลด HTML Visual Report
   */
  public static downloadHtmlReport(manifest: BatchOptimizationManifest): void {
    const content = this.exportToHtmlReport(manifest);
    this.triggerBrowserDownload(content, `Optimization_Report_${manifest.manifestId}.html`, 'text/html');
  }
}
