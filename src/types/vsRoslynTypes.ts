/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript types and contracts for Visual Studio MSBuild Roslyn Diagnostic Analyzer
 *          & Automated CodeFix Provider (VS Enterprise Roslyn Analyzer parity).
 *          Defines AST syntax tree walk patterns, Diagnostic Descriptors (CA1822, CS8602, etc.),
 *          Fix Providers, Diagnostic Severities (Error, Warning, Info, Hidden), Source Spans,
 *          and On-Device Offline AI Roslyn AST Code Refactoring.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Visual Studio MSBuild Roslyn Diagnostic Analyzer
 *          & Automated CodeFix Provider (เทียบเท่า VS Enterprise Roslyn & MSBuild)
 *          ครอบคลุมการตรวจจับ AST Tree, กฎการวิเคราะห์โค้ดสถิต (Static Code Analysis Rules),
 *          การแจ้งเตือน Severity (Error, Warning, Info), การซ่อมแซมโค้ดอัตโนมัติ (Automated CodeFix),
 *          และการรีแฟกเตอร์โค้ด C# / TS ด้วย AI ออฟไลน์ระดับ Abstract Syntax Tree
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `VSRoslynAnalyzerEngineNode.ts` and `VSRoslynAnalyzerCodeFixStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Diagnostic Rules: `CA1822` (Make static), `CS8602` (Possible null dereference), `IDE0051` (Unused member)
 * ============================================================================
 */

export type DiagnosticSeverity = 'ERROR' | 'WARNING' | 'INFO' | 'HIDDEN';

export interface RoslynDiagnosticItem {
  id: string; // e.g. "CA1822", "CS8602"
  title: string;
  category: 'PERFORMANCE' | 'RELIABILITY' | 'STYLE' | 'SECURITY';
  severity: DiagnosticSeverity;
  lineNumber: number;
  column: number;
  message: string;
  sourceSpanCode: string;
  fixDescription: string;
  isFixed: boolean;
}

export interface VSRoslynProfile {
  targetSolution: string;
  targetFramework: 'NET8_0' | 'NET9_0';
  totalAnalyzersActive: number;
  diagnostics: RoslynDiagnosticItem[];
  codeContent: string;
  offlineAIRefactoringSummary: string;
}
