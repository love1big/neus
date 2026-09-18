/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for the Burst Compiler & SIMD Vectorization
 *          Inspector System (Unity Burst Compiler & Visual Studio C++ Vectorizer parity).
 *          Defines target instruction architectures (AVX-512, AVX2, SSE4.2, ARM NEON),
 *          LLVM IR intermediate representations, vectorized assembly disassemblies,
 *          aliasing analysis reports, and register allocation telemetry.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Burst Compiler & SIMD Vectorization
 *          Inspector (เทียบเท่า Unity Burst Compiler และ Visual Studio Vectorizer)
 *          ครอบคลุมการคอมไพล์ชุดคำสั่งเวกเตอร์ SIMD (AVX-512, AVX2, ARM NEON),
 *          การวิเคราะห์ LLVM IR, รายงานการแยกแยะตัวแปรอ้างอิง (Aliasing Analysis),
 *          และการวัดอัตราความเร็วเทียบกับ JIT ทั่วไป
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `BurstCompilerSIMDNode.ts` and `BurstCompilerSIMDInspectorStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Interfaces: `SIMDInstruction`, `BurstJobProfile`, `VectorizationReport`, `SIMDTargetArch`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Fallback to scalar SSE2 when target instruction set is unsupported.
 * ============================================================================
 */

export type SIMDTargetArch = 'AVX512' | 'AVX2' | 'SSE4_2' | 'ARM_NEON' | 'WASM_SIMD128';

export type OptimizationLevel = 'FAST' | 'SIZE' | 'BALANCED';

export interface SIMDInstruction {
  address: string;
  mnemonic: string;
  operands: string;
  explanation: string;
  isVectorized: boolean;
  registerType: 'YMM' | 'ZMM' | 'XMM' | 'ARM_V' | 'GENERAL';
}

export interface BurstJobProfile {
  id: string;
  jobName: string;
  sourceFile: string;
  targetArch: SIMDTargetArch;
  safetyChecksEnabled: boolean;
  fastMath: boolean;
  unrollFactor: number;
  speedupVsMonoJit: number; // e.g. 14.8x
  executionTimeUs: number; // microseconds
  scalarExecutionTimeUs: number;
  simdInstructions: SIMDInstruction[];
  llvmIRSnippet: string;
}

export interface BurstTelemetryStats {
  totalJobsCompiled: number;
  avgVectorizationRatio: number; // 0.0 - 1.0 (e.g. 0.94)
  registersUsedCount: number;
  spillCount: number;
  memoryBandwidthGBs: number;
}
