/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Burst Compiler & SIMD Code Generation Engine Node (Unity Burst & LLVM parity).
 *          Simulates LLVM vectorization passes, generates architecture-specific SIMD
 *          assembly (AVX-512, AVX2, ARM NEON), performs aliasing diagnostics, and
 *          evaluates microsecond execution speeds.
 *    - TH: เอนจินจำลองการแปลงโค้ดประสิทธิภาพสูง Burst Compiler & SIMD Vectorization
 *          สร้างชุดคำสั่ง Assembly เวกเตอร์เฉพาะสำหรับแต่ละสถาปัตยกรรม CPU,
 *          ตรวจสอบการวนลูป Loop Unrolling, และวัดค่าความเร็ว Benchmark เทียบกับโหมดสเกลาร์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `burstSIMDTypes.ts`
 *    - Consumed by `BurstCompilerSIMDInspectorStudio.tsx`
 * ============================================================================
 */

import {
  BurstJobProfile,
  SIMDTargetArch,
  BurstTelemetryStats,
  SIMDInstruction
} from '../types/burstSIMDTypes';

export class BurstCompilerSIMDNode {
  private static instance: BurstCompilerSIMDNode;

  private activeJob: BurstJobProfile;
  private subscribers: Array<() => void> = [];

  private constructor() {
    this.activeJob = this.createDefaultJob('AVX2');
  }

  public static getInstance(): BurstCompilerSIMDNode {
    if (!BurstCompilerSIMDNode.instance) {
      BurstCompilerSIMDNode.instance = new BurstCompilerSIMDNode();
    }
    return BurstCompilerSIMDNode.instance;
  }

  private createDefaultJob(arch: SIMDTargetArch): BurstJobProfile {
    const isAvx512 = arch === 'AVX512';
    const isArm = arch === 'ARM_NEON';

    const instructions: SIMDInstruction[] = [
      {
        address: '0x00401000',
        mnemonic: isArm ? 'LDP' : isAvx512 ? 'VMOVUPS' : 'VMOVUPS',
        operands: isArm ? 'q0, q1, [x1, #16]' : isAvx512 ? 'zmm0, [rcx + rax*4]' : 'ymm0, [rcx + rax*4]',
        explanation: 'Load packed single-precision floats into vector register',
        isVectorized: true,
        registerType: isArm ? 'ARM_V' : isAvx512 ? 'ZMM' : 'YMM'
      },
      {
        address: '0x00401006',
        mnemonic: isArm ? 'FMUL' : isAvx512 ? 'VMULPS' : 'VMULPS',
        operands: isArm ? 'v0.4s, v0.4s, v2.4s' : isAvx512 ? 'zmm0, zmm0, zmm1' : 'ymm0, ymm0, ymm1',
        explanation: 'Parallel vector multiplication across SIMD lanes',
        isVectorized: true,
        registerType: isArm ? 'ARM_V' : isAvx512 ? 'ZMM' : 'YMM'
      },
      {
        address: '0x0040100c',
        mnemonic: isArm ? 'FADD' : isAvx512 ? 'VFMADD231PS' : 'VFMADD231PS',
        operands: isArm ? 'v0.4s, v0.4s, v3.4s' : isAvx512 ? 'zmm2, zmm0, zmm3' : 'ymm2, ymm0, ymm3',
        explanation: 'Fused Multiply-Accumulate (FMA) 8x floats in single clock cycle',
        isVectorized: true,
        registerType: isArm ? 'ARM_V' : isAvx512 ? 'ZMM' : 'YMM'
      },
      {
        address: '0x00401012',
        mnemonic: isArm ? 'STP' : isAvx512 ? 'VMOVUPS' : 'VMOVUPS',
        operands: isArm ? 'q0, q1, [x0, #16]' : isAvx512 ? '[rdx + rax*4], zmm2' : '[rdx + rax*4], ymm2',
        explanation: 'Stream vectorized result directly back to main memory buffer',
        isVectorized: true,
        registerType: isArm ? 'ARM_V' : isAvx512 ? 'ZMM' : 'YMM'
      },
      {
        address: '0x00401018',
        mnemonic: 'ADD',
        operands: isAvx512 ? 'rax, 16' : 'rax, 8',
        explanation: 'Advance loop index by SIMD stride',
        isVectorized: false,
        registerType: 'GENERAL'
      },
      {
        address: '0x0040101c',
        mnemonic: 'CMP',
        operands: 'rax, r8',
        explanation: 'Compare stride pointer against buffer length limit',
        isVectorized: false,
        registerType: 'GENERAL'
      },
      {
        address: '0x00401020',
        mnemonic: 'JNE',
        operands: '0x00401000',
        explanation: 'Branch back to top of vectorized unrolled loop',
        isVectorized: false,
        registerType: 'GENERAL'
      }
    ];

    const llvmIRSnippet = `; ModuleID = 'BoidsFlockingPhysicsJob'
define void @BoidsFlockingJob_Execute(ptr noalias %positions, ptr noalias %velocities, i32 %count) #0 {
entry:
  %wide.load = load <8 x float>, ptr %positions, align 32
  %wide.vel = load <8 x float>, ptr %velocities, align 32
  %res = fmul fast <8 x float> %wide.load, %wide.vel
  store <8 x float> %res, ptr %positions, align 32
  ret void
}
attributes #0 = { "target-cpu"="haswell" "target-features"="+avx2,+fma" }`;

    const speedup = isAvx512 ? 22.4 : isArm ? 11.2 : 14.8;
    const execTime = isAvx512 ? 142 : isArm ? 280 : 215;

    return {
      id: 'job_boids_flocking_simd',
      jobName: 'ParallelBoidsFlockingIntegrationJob',
      sourceFile: 'Packages/com.engine.physics/Jobs/BoidsFlockingJob.cs',
      targetArch: arch,
      safetyChecksEnabled: false,
      fastMath: true,
      unrollFactor: 4,
      speedupVsMonoJit: speedup,
      executionTimeUs: execTime,
      scalarExecutionTimeUs: execTime * speedup,
      simdInstructions: instructions,
      llvmIRSnippet
    };
  }

  public getActiveJob(): BurstJobProfile {
    return this.activeJob;
  }

  public setTargetArch(arch: SIMDTargetArch): void {
    this.activeJob = this.createDefaultJob(arch);
    this.notify();
  }

  public toggleFastMath(): void {
    this.activeJob.fastMath = !this.activeJob.fastMath;
    if (this.activeJob.fastMath) {
      this.activeJob.speedupVsMonoJit *= 1.18;
      this.activeJob.executionTimeUs = Math.round(this.activeJob.executionTimeUs / 1.18);
    } else {
      this.activeJob.speedupVsMonoJit /= 1.18;
      this.activeJob.executionTimeUs = Math.round(this.activeJob.executionTimeUs * 1.18);
    }
    this.notify();
  }

  public setUnrollFactor(factor: number): void {
    this.activeJob.unrollFactor = factor;
    this.notify();
  }

  public getTelemetry(): BurstTelemetryStats {
    return {
      totalJobsCompiled: 142,
      avgVectorizationRatio: 0.94,
      registersUsedCount: this.activeJob.targetArch === 'AVX512' ? 28 : 14,
      spillCount: 0,
      memoryBandwidthGBs: 48.5
    };
  }

  public subscribe(fn: () => void): () => void {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  }

  private notify(): void {
    this.subscribers.forEach(cb => cb());
  }
}

export const burstCompilerNode = BurstCompilerSIMDNode.getInstance();
