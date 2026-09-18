/**
 * ============================================================================
 * MODULE: EngineAntiPatternTypes.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * นิยามโครงสร้างข้อมูล ประเภทตัวแปร (Type Definitions, Interfaces, Enums)
 * สำหรับระบบ Real-time Static Analysis Tool ประจำ Code Editor
 * เพื่อตรวจสอบและตรวจจับแพตเทิร์นต้องห้ามที่ส่งผลเสียต่อประสิทธิภาพของเกมเอนจิน
 * (Engine-Specific Anti-Patterns) เช่น Garbage Collection ใน Hot Loop,
 * การเรียกใช้ Heavy Engine Queries ซ้ำซาก, การคำนวณคณิตศาสตร์/ฟิสิกส์สิ้นเปลือง,
 * การโคลน Material / Draw Call Splitting, และคอขวดของ GPU Shader Pipeline
 * พร้อมโครงสร้างรองรับ Quick-Fix และการจำลองผลกระทบต่อเฟรมเรต (Frame Time Impact)
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - โมดูลนี้เป็น Core Data Contracts สำหรับ:
 *   - EngineStaticAnalysisRules.ts (คลังกฎการตรวจสอบ)
 *   - EngineAstLinterEngine.ts (ตัวรันวิเคราะห์ไวยากรณ์และโครงสร้างโค้ด)
 *   - PerformanceImpactEstimatorNode.ts (คำนวณคะแนนประสิทธิภาพและเมมโมรี)
 *   - QuickFixRefactoringNode.ts (ตัวคำนวณและปรับเปลี่ยนโค้ดอัตโนมัติ)
 *   - EngineStaticAnalysisPanel.tsx (แผงควบคุม UI สำหรับผู้ใช้)
 *   - CodeEditor.tsx (อินทิเกรชันกับ Monaco Editor)
 * 
 * ข้อมูลการรับส่ง (Inputs, Outputs & Data Contracts):
 * ----------------------------------------------------------------------------
 * - Enums:
 *   - `EngineAntiPatternCategory`: หมวดหมู่ของปัญหา (GC_ALLOCATION, HOT_PATH_QUERY, PHYSICS_MATH, GPU_SHADER, CONCURRENCY_IO, MEMORY_CACHE)
 *   - `AntiPatternSeverity`: ระดับความรุนแรง (CRITICAL, HIGH, MEDIUM, HINT)
 *   - `EngineTargetPlatform`: แพลตฟอร์มเอนจินเป้าหมาย (UNIVERSAL, THREE_WEBGL, UNITY_CSHARP, UNREAL_CPP, NATIVE_DOD)
 * - Interfaces:
 *   - `EngineAntiPatternRule`: โครงสร้างกฎการวิเคราะห์
 *   - `EngineAntiPatternIssue`: ผลลัพธ์การตรวจพบจุดบกพร่องในไฟล์โค้ด
 *   - `PerformanceOptimizedAlternative`: ทางเลือกโค้ดที่ปรับให้มีประสิทธิภาพสูงขึ้น
 *   - `PerformanceImpactEstimate`: ผลการประเมินเวลาเฟรมเรตและเมมโมรีที่ประหยัดได้
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - รองรับช่วงบรรทัดที่ไม่ระบุ (Fallback to entire line)
 * - กำหนด flag `canAutoFix: boolean` ป้องกันการแทนที่โค้ดที่ไม่ปลอดภัย
 * 
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ----------------------------------------------------------------------------
 * import { EngineAntiPatternIssue, EngineAntiPatternCategory } from './EngineAntiPatternTypes';
 * const issue: EngineAntiPatternIssue = { ... };
 * ============================================================================
 */

export type AntiPatternSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'HINT';

export type EngineAntiPatternCategory = 
  | 'GC_ALLOCATION'      // Garbage Collection & Memory Churn in Hot Loops
  | 'HOT_PATH_QUERY'     // Heavy Scene/Component Queries in Tick/Update
  | 'PHYSICS_MATH'       // Expensive Math & Unbounded Physics Queries
  | 'GPU_SHADER'         // Draw Call Splitting, Material Cloning, Shader Branches
  | 'CONCURRENCY_IO'     // Main Thread Synchronous Blocking & File I/O
  | 'MEMORY_CACHE';      // Cache Misses, String Inefficiencies, AoS vs SoA

export type EngineTargetPlatform = 
  | 'UNIVERSAL'          // General Game Engine Architecture
  | 'TYPESCRIPT_WEBGL'   // WebGL / WebGPU / Three.js / Babylon.js / OmniEngine
  | 'UNITY_CSHARP'       // Unity MonoBehaviour / Burst / DOTS
  | 'UNREAL_CPP'         // Unreal Engine UObject / Garbage Collector / Slate
  | 'NATIVE_CPP_RUST';   // Native C++ / Rust DOD Systems

/**
 * โครงสร้างข้อมูลสำหรับข้อเสนอแนะทางเลือกที่ปรับแต่งประสิทธิภาพแล้ว (Optimized Alternative)
 */
export interface PerformanceOptimizedAlternative {
  title: string;
  explanation: string;
  theoreticalFpsGainMs: number;       // ประมาณการเวลาเฟรมเรตที่ประหยัดได้ (ms / frame)
  estimatedGcSavedKb: number;          // ประมาณการลดภาระขยะในหน่วยความจำ (KB / frame)
  recommendedCode: string;             // ตัวอย่างโค้ดฉบับ Optimized
  originalAntiPatternCode: string;     // ตัวอย่างโค้ดฉบับ Anti-Pattern
  replacementTemplate?: string;        // เทมเพลตสำหรับแทนที่แบบ Auto-Fix
}

/**
 * โครงสร้างกฎการวิเคราะห์ข้อผิดพลาดระดับเอนจิน (Static Analysis Rule Definition)
 */
export interface EngineAntiPatternRule {
  id: string;                          // รหัสกฎ เช่น 'ENG-GC-001'
  name: string;                        // ชื่อกฎ เช่น 'Heap Allocation in Update/Tick Loop'
  category: EngineAntiPatternCategory; // หมวดหมู่
  severity: AntiPatternSeverity;       // ระดับความรุนแรง
  targetPlatforms: EngineTargetPlatform[]; // เอนจินที่กฎนี้มีผล
  supportedLanguages: string[];        // ภาษา เช่น ['typescript', 'javascript', 'csharp', 'cpp']
  shortDescription: string;            // คำอธิบายสั้น
  detailedExplanation: string;         // คำอธิบายทางเทคนิคเชิงลึก
  engineContext: string;               // บริบททางเอนจิน เช่น 'Tick / Render / Update Loop'
  regexPattern?: RegExp;               // Regular Expression สำหรับตรวจจับ pattern
  scopeCondition?: 'INSIDE_HOT_LOOP' | 'INSIDE_CLASS' | 'FILE_SCOPE' | 'ANY';
  alternative: PerformanceOptimizedAlternative; // ทางเลือกที่ optimized
  enabled: boolean;                    // ผู้ใช้สามารถเปิด/ปิดการตรวจจับกฎนี้ได้
}

/**
 * ผลการตรวจพบจุดบกพร่องของ Anti-Pattern ในโค้ดจริง (Detected Issue Instance)
 */
export interface EngineAntiPatternIssue {
  id: string;                          // Unique instance ID
  ruleId: string;                      // อ้างอิง EngineAntiPatternRule.id
  ruleName: string;                    // ชื่อกฎ
  category: EngineAntiPatternCategory; // หมวดหมู่
  severity: AntiPatternSeverity;       // ระดับความรุนแรง
  lineNumber: number;                  // ตำแหน่งบรรทัดที่พบ (1-indexed)
  columnNumber: number;                // ตำแหน่งคอลัมน์เริ่มต้น (1-indexed)
  endLineNumber: number;               // ตำแหน่งบรรทัดสิ้นสุด
  endColumnNumber: number;             // ตำแหน่งคอลัมน์สิ้นสุด
  matchedCode: string;                 // โค้ดที่ตรวจพบบนบรรทัดนั้น
  contextSnippet: string;              // โค้ดรอบข้าง 3-5 บรรทัด
  hotspotFunction?: string;            // ฟังก์ชันที่เป็น Hot Path เช่น 'update', 'tick', 'render'
  explanation: string;                 // คำอธิบายเหตุผลที่เป็นคอขวด
  performanceImpact: {
    frameTimePenaltyMs: number;        // โทษเวลาเฟรมเรตโดยประมาณ
    gcChurnBytesPerFrame: number;      // อัตราขยะหน่วยความจำต่อเฟรม
    impactDescription: string;         // คำอธิบายผลกระทบต่อเครื่องเล่น
  };
  optimizedAlternative: PerformanceOptimizedAlternative;
  canAutoFix: boolean;                 // สามารถกดปุ่ม Quick-Fix ได้ทันทีหรือไม่
  suggestedReplacement?: string;       // โค้ดที่เตรียมไว้สำหรับแทนที่อัตโนมัติ
}

/**
 * ผลสรุปการคำนวณผลกระทบต่อประสิทธิภาพโดยรวมของไฟล์ (Global File Performance Impact Estimate)
 */
export interface PerformanceImpactEstimate {
  totalIssuesCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  hintCount: number;
  totalFrameTimeSavedMs: number;       // เวลาเฟรมเรตที่สามารถประหยัดได้รวม (ms / frame)
  totalGcPressureReducedKb: number;    // ปริมาณขยะ GC ที่ลดลงได้ต่อวินาที (KB / sec at 60 FPS)
  projectedFpsImprovement: number;     // ประมาณการเพิ่มขึ้นของ FPS บนเครื่องเป้าหมาย
  codeHealthGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  codeHealthScore: number;             // 0 - 100 คะแนนความสะอาดและประสิทธิภาพ
  hotspotsDetected: string[];          // รายชื่อฟังก์ชันที่มีปัญหาหนาแน่น
}

/**
 * ข้อมูลการตั้งค่าการรัน Static Analysis (Analysis Configuration Options)
 */
export interface EngineAnalysisConfig {
  targetPlatform: EngineTargetPlatform;
  includeHints: boolean;
  activeCategories: Record<EngineAntiPatternCategory, boolean>;
  hotFunctionNames: string[];          // รายชื่อฟังก์ชันที่ถือเป็น Hot Path (เช่น update, tick, render, fixedUpdate)
  strictAllocations: boolean;          // บังคับห้าม new Object() แม้ในลูปย่อย
}
