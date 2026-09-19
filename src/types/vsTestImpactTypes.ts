/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript types and contracts for Visual Studio Enterprise Test Impact Analysis (TIA)
 *          & Dynamic Code Coverage Profiler Studio (Visual Studio Enterprise parity).
 *          Defines Source File Blocks, Code Coverage Metrics (Line, Branch, Function),
 *          Test Impact Mapping (which tests touch which lines of code), Code Changes (Git diff),
 *          Optimized Minimal Test Run Selection, and On-Device Offline AI Flaky Test & Regression Predictor.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Visual Studio Enterprise Test Impact Analysis (TIA)
 *          และการวิเคราะห์ Code Coverage (เทียบเท่า Visual Studio Enterprise TIA & Coverage Profiler)
 *          ครอบคลุมการตรวจสอบความครอบคลุมของการทดสอบระดับบรรทัดและกิ่งก้าน (Branch Coverage),
 *          ระบบวิเคราะห์ผลกระทบเมื่อมีการแก้โค้ด (TIA) เพื่อรันเฉพาะชุด Test ที่เกี่ยวข้อง,
 *          และ AI ออฟไลน์ทำนายความเสี่ยงของการเกิดบัคถดถอย (Regression Risk Analysis)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `VSTestImpactEngineNode.ts` and `VSTestImpactAnalyzerStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Coverage Types: `COVERED`, `PARTIALLY_COVERED`, `UNCOVERED`
 * ============================================================================
 */

export type CoverageStatus = 'COVERED' | 'PARTIALLY_COVERED' | 'UNCOVERED';

export interface CodeBlockCoverage {
  lineNumber: number;
  code: string;
  status: CoverageStatus;
  executionCount: number;
  coveringTests: string[];
}

export interface TestCaseImpact {
  testId: string;
  testName: string;
  suite: string;
  durationMs: number;
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  isImpactedByChanges: boolean;
  coveredLinesCount: number;
}

export interface VSTestImpactProfile {
  solutionName: string;
  targetBranch: string;
  totalLines: number;
  coveredLines: number;
  lineCoveragePercentage: number;
  branchCoveragePercentage: number;
  codeBlocks: CodeBlockCoverage[];
  testCases: TestCaseImpact[];
  offlineAIRegressionInsight: string;
}
