/**
 * ============================================================================
 * MODULE: PerformanceImpactEstimatorNode.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * โมดูลวิเคราะห์และจำลองผลกระทบต่อประสิทธิภาพ (Performance Telemetry & Simulation Estimator)
 * ทำหน้าที่ประมวลผลรายการ Anti-Pattern Issues ทั้งหมดที่ตรวจพบในไฟล์ แล้วคำนวณ:
 * 1. ผลกระทบรวมต่อเวลาเฟรมเรต (Total Frame Time Penalty in milliseconds)
 * 2. ปริมาณการเกิดขยะหน่วยความจำ (Garbage Collection Pressure in KB/frame & KB/sec at 60 FPS)
 * 3. ประมาณการเพิ่มขึ้นของ Frame Rate (Projected FPS Improvement)
 * 4. เกรดคุณภาพโค้ด (Code Health Grade: A+, A, B, C, D, F) และคะแนน Cleanliness Score (0-100)
 * 5. ระบุรายชื่อฟังก์ชันจุดเสี่ยงสูง (Hotspot Analysis)
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - รับข้อมูล: `EngineAntiPatternIssue[]` จาก `EngineAstLinterEngine.ts`
 * - ส่งออกผลลัพธ์: `PerformanceImpactEstimate` ไปแสดงผลบน:
 *   - `EngineStaticAnalysisPanel.tsx` (Summary Cards, Telemetry Gauges, Grade Badge)
 *   - Monaco Status Bar (Cleanliness Score & Frame Time Saved)
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - เมื่อไม่มี Issue เลย ให้คืนคะแนน 100, เกรด A+, และผลกระทบเป็น 0
 * - เพดานสูงสุดของคะแนนถูกจำกัดระหว่าง 0 ถึง 100 เสมอ
 * - ป้องกันค่า NaN หรือ Infinity ในกรณีตัวเลขผิดปกติ
 * 
 * ============================================================================
 */

import { EngineAntiPatternIssue, PerformanceImpactEstimate } from './EngineAntiPatternTypes';

export class PerformanceImpactEstimatorNode {
  /**
   * คำนวณสรุปผลกระทบต่อประสิทธิภาพโดยรวมจากรายการ Issues
   * 
   * @param issues รายการจุดบกพร่องที่ตรวจพบ
   * @param targetFps ค่า FPS มาตรฐานของเกม (ค่าเริ่มต้น 60 FPS = 16.6ms frame budget)
   * @returns สรุปตัวเลขผลกระทบเชิงวิศวกรรม
   */
  public static calculateTelemetry(
    issues: EngineAntiPatternIssue[], 
    targetFps: number = 60
  ): PerformanceImpactEstimate {
    if (!issues || issues.length === 0) {
      return {
        totalIssuesCount: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        hintCount: 0,
        totalFrameTimeSavedMs: 0,
        totalGcPressureReducedKb: 0,
        projectedFpsImprovement: 0,
        codeHealthGrade: 'A+',
        codeHealthScore: 100,
        hotspotsDetected: []
      };
    }

    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let hintCount = 0;

    let totalFrameTimeSavedMs = 0;
    let totalGcPerFrameKb = 0;
    const hotspotFrequencyMap: Record<string, number> = {};

    for (const issue of issues) {
      switch (issue.severity) {
        case 'CRITICAL':
          criticalCount++;
          break;
        case 'HIGH':
          highCount++;
          break;
        case 'MEDIUM':
          mediumCount++;
          break;
        case 'HINT':
          hintCount++;
          break;
      }

      // สะสมเวลาและหน่วยความจำที่ประหยัดได้หากแก้ปัญหานี้
      totalFrameTimeSavedMs += issue.performanceImpact.frameTimePenaltyMs || 0;
      totalGcPerFrameKb += (issue.performanceImpact.gcChurnBytesPerFrame || 0) / 1024;

      // ติดตาม Hotspot Function
      if (issue.hotspotFunction) {
        const fnName = issue.hotspotFunction;
        hotspotFrequencyMap[fnName] = (hotspotFrequencyMap[fnName] || 0) + 1;
      }
    }

    // คำนวณขยะ GC ต่อวินาที (at targetFps)
    const totalGcPressureReducedKb = totalGcPerFrameKb * targetFps;

    // คำนวณคะแนนสุขภาพโค้ด (Code Health Score)
    // ฐาน 100 คะแนน ลบตามระดับความรุนแรง
    const penalty = (criticalCount * 25) + (highCount * 12) + (mediumCount * 5) + (hintCount * 1);
    const codeHealthScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));

    // จัดเกรด
    let codeHealthGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'A+';
    if (codeHealthScore >= 95) codeHealthGrade = 'A+';
    else if (codeHealthScore >= 85) codeHealthGrade = 'A';
    else if (codeHealthScore >= 70) codeHealthGrade = 'B';
    else if (codeHealthScore >= 50) codeHealthGrade = 'C';
    else if (codeHealthScore >= 35) codeHealthGrade = 'D';
    else codeHealthGrade = 'F';

    // คำนวณ Projected FPS improvement
    // Baseline frame time assumption: 16.66ms (60 FPS) + penalty
    const baselineFrameTime = 16.66 + totalFrameTimeSavedMs;
    const unoptimizedFps = baselineFrameTime > 0 ? 1000 / baselineFrameTime : targetFps;
    const optimizedFps = 1000 / 16.66;
    const projectedFpsImprovement = Math.max(0, Math.round(optimizedFps - unoptimizedFps));

    // ดึง Top Hotspots เรียงตามจำนวน
    const hotspotsDetected = Object.entries(hotspotFrequencyMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => `${name}() [${count} issue${count > 1 ? 's' : ''}]`);

    return {
      totalIssuesCount: issues.length,
      criticalCount,
      highCount,
      mediumCount,
      hintCount,
      totalFrameTimeSavedMs: Number(totalFrameTimeSavedMs.toFixed(2)),
      totalGcPressureReducedKb: Number(totalGcPressureReducedKb.toFixed(1)),
      projectedFpsImprovement,
      codeHealthGrade,
      codeHealthScore,
      hotspotsDetected
    };
  }
}
