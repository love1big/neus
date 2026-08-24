/**
 * =========================================================================================
 * @file architectureHeatmapData.ts
 * @system System Architecture & Codebase Telemetry Engine
 * @module Architecture Heatmap & Code Churn Analytics Repository
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * 1. รวบรวมและคำนวณข้อมูลสถิติความถี่ในการแก้ไขไฟล์ (Code Modification Frequency / Churn Rate)
 * 2. คำนวณดัชนี Hotspot Index (การผสานระหว่าง ความถี่การแก้ไข + ความซับซ้อน Cyclomatic Complexity + อัตราการเกิด Bug)
 * 3. จัดกลุ่มไฟล์ลงใน 4 Quadrants ตามแนวทาง Refactoring Matrix (Hotspots, Heavy Debt, Stable Core, Simple Leaves)
 * 4. วิเคราะห์และสร้างคำแนะนำการ Refactor (Actionable Refactoring Prescription) เพื่อแยกไฟล์ตามกฎ 1 Node = 1 File
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น / Architecture & System Integration]:
 * - เป็นศูนย์กลางข้อมูลการวิเคราะห์ให้กับ `ArchitectureHeatmap.tsx`
 * - เชื่อมโยงข้อมูลกับ `moduleDependencyGraphData.ts` และ `MegaCodeIDEMaster.tsx`
 * - สอดคล้องกับข้อกำหนดใน AGENTS.md: Strict 1 Node = 1 File Policy
 * 
 * 📥 [Inputs / Data Contracts]:
 * - `TimeRange`: ช่วงเวลาในการวิเคราะห์ (24h, 7d, 30d, 90d, all)
 * - `HotspotCategory`: หมวดหมู่ระบบใน Game Engine
 * - `ModuleHeatmapNode`: โครงสร้างข้อมูลสถิติของแต่ละไฟล์
 * - `CommitHistoryRecord`: ประวัติการ commit/แก้ไขไฟล์
 * 
 * 📤 [Outputs]:
 * - `PRESET_HEATMAP_DATASETS`: ชุดข้อมูลจำลองสถาปัตยกรรมเกมที่สมบูรณ์
 * - `calculateHotspotScore()`: คำนวณคะแนนความร้อนและความเสี่ยงของแต่ละโมดูล
 * - `generateRefactoringPlan()`: สร้างขั้นตอนการ Refactoring ทีละสเต็ป
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - ตรวจสอบค่าหารด้วยศูนย์ (Division by Zero Safeguards) ในการคำนวณสถิติ
 * - Fallback ข้อมูลเริ่มต้นกรณีไม่พบ Node หรือชุดข้อมูลว่างเปล่า
 * 
 * 📝 [Usage Example]:
 * ```typescript
 * import { PRESET_HEATMAP_DATASETS, calculateHotspotScore } from './architectureHeatmapData';
 * const nodes = PRESET_HEATMAP_DATASETS['action_rpg_engine'].nodes;
 * const hotspotScore = calculateHotspotScore(nodes[0]);
 * ```
 * =========================================================================================
 */

export type TimeRangeFilter = '24h' | '7d' | '30d' | '90d' | 'all';

export type HotspotSeverity = 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL_HOTSPOT';

export type RefactorQuadrant = 
  | 'CRITICAL_HOTSPOT'   // High Churn + High Complexity (Must Refactor immediately)
  | 'COMPLEX_STABLE'     // Low Churn + High Complexity (High skill, delicate, leave unless broken)
  | 'ACTIVE_UTILITY'     // High Churn + Low Complexity (Frequently touched but safe & simple)
  | 'STABLE_LEAF';       // Low Churn + Low Complexity (Ideal decoupled state)

export interface CommitHistoryRecord {
  id: string;
  timestamp: string;
  author: string;
  message: string;
  filesChanged: string[];
  insertions: number;
  deletions: number;
  isBugFix: boolean;
}

export interface ModuleHeatmapNode {
  id: string;
  fileName: string;
  filePath: string;
  system: string;
  category: 'CORE' | 'AI_CODE' | 'PHYSICS' | 'RENDERING' | 'AUDIO' | 'GAME_DESIGN' | 'WORLD' | 'UI_DATA' | 'NETWORKING' | 'MEMORY';
  linesOfCode: number;
  cyclomaticComplexity: number; // 1 - 50+
  modificationCount: number;    // จำนวนครั้งที่ไฟล์ถูกแก้ไขในช่วงเวลาที่เลือก
  linesChangedCount: number;   // จำนวนบรรทัดที่มีการ churn (add/edit/delete)
  bugFixCount: number;         // จำนวน commit ที่ระบุว่าเป็น bug fix
  distinctAuthorsCount: number;// จำนวนผู้พัฒนาที่เข้ามาแก้ไข
  couplingScore: number;       // 0.0 - 1.0 (ความผูกติดกับไฟล์อื่น)
  lastModifiedTimestamp: string;
  primaryReason: string;       // สาเหตุหลักที่มีการแก้ไขบ่อย
  refactoringPriority: number; // 0 - 100
  quadrant: RefactorQuadrant;
  recommendationsThai: string[];
  recommendationsEng: string[];
}

export interface HeatmapSystemDataset {
  id: string;
  title: string;
  thaiTitle: string;
  description: string;
  thaiDescription: string;
  totalCommits: number;
  totalFiles: number;
  nodes: ModuleHeatmapNode[];
  recentCommits: CommitHistoryRecord[];
}

/**
 * คำนวณคะแนน Hotspot Risk Index (0 - 100)
 */
export function calculateHotspotScore(node: ModuleHeatmapNode): number {
  const churnWeight = Math.min(40, (node.modificationCount / 25) * 40);
  const complexityWeight = Math.min(30, (node.cyclomaticComplexity / 40) * 30);
  const bugFixWeight = Math.min(20, (node.bugFixCount / 8) * 20);
  const authorCouplingWeight = Math.min(10, (node.distinctAuthorsCount / 5) * 10);

  const rawScore = churnWeight + complexityWeight + bugFixWeight + authorCouplingWeight;
  return Math.round(Math.min(100, Math.max(0, rawScore)));
}

/**
 * คำนวณ Quadrant ตาม Churn และ Complexity
 */
export function determineQuadrant(churn: number, complexity: number, churnThreshold = 12, complexityThreshold = 18): RefactorQuadrant {
  if (churn >= churnThreshold && complexity >= complexityThreshold) {
    return 'CRITICAL_HOTSPOT';
  } else if (churn < churnThreshold && complexity >= complexityThreshold) {
    return 'COMPLEX_STABLE';
  } else if (churn >= churnThreshold && complexity < complexityThreshold) {
    return 'ACTIVE_UTILITY';
  } else {
    return 'STABLE_LEAF';
  }
}

/**
 * ประเมินความรุนแรง (Severity) จากคะแนน Hotspot
 */
export function getHotspotSeverity(score: number): {
  severity: HotspotSeverity;
  label: string;
  thaiLabel: string;
  colorHex: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
} {
  if (score >= 75) {
    return {
      severity: 'CRITICAL_HOTSPOT',
      label: 'Critical Hotspot',
      thaiLabel: 'จุดความร้อนวิกฤต (ต้องแยกไฟล์ด่วน)',
      colorHex: '#ef4444',
      bgColor: 'bg-red-950/60',
      borderColor: 'border-red-500/80',
      textColor: 'text-red-400'
    };
  } else if (score >= 50) {
    return {
      severity: 'ELEVATED',
      label: 'Elevated Churn',
      thaiLabel: 'ความร้อนสูง (มีโอกาสเกิดบัคบ่อย)',
      colorHex: '#f97316',
      bgColor: 'bg-orange-950/50',
      borderColor: 'border-orange-500/70',
      textColor: 'text-orange-400'
    };
  } else if (score >= 25) {
    return {
      severity: 'MODERATE',
      label: 'Moderate Activity',
      thaiLabel: 'ความร้อนปานกลาง',
      colorHex: '#eab308',
      bgColor: 'bg-yellow-950/40',
      borderColor: 'border-yellow-500/60',
      textColor: 'text-yellow-400'
    };
  } else {
    return {
      severity: 'LOW',
      label: 'Cool & Stable',
      thaiLabel: 'เสถียรและแยกไฟล์ดีเยี่ยม',
      colorHex: '#10b981',
      bgColor: 'bg-emerald-950/30',
      borderColor: 'border-emerald-500/50',
      textColor: 'text-emerald-400'
    };
  }
}

/**
 * ชุดข้อมูลจำลองสถาปัตยกรรม AAA Action RPG Game Engine
 */
const ACTION_RPG_HEATMAP_PRESET: HeatmapSystemDataset = {
  id: "action_rpg_engine",
  title: "AAA Action RPG Game Engine Codebase",
  thaiTitle: "ฐานโค้ดระบบเกม Action RPG ระดับ AAA",
  description: "Comprehensive telemetry dataset of 2,400+ commits across Combat, Physics, AI, Networking, and Rendering subsystems.",
  thaiDescription: "ชุดข้อมูลสถิติการแก้ไขจาก 2,400+ คอมมิต ครอบคลุมระบบต่อสู้ ฟิสิกส์ ปัญญาประดิษฐ์ เน็ตเวิร์ก และเอนจินเรนเดอร์",
  totalCommits: 2480,
  totalFiles: 24,
  recentCommits: [
    {
      id: "c8f92a",
      timestamp: "10 mins ago",
      author: "Senior Combat Dev",
      message: "fix(combat): patch infinite hit stun lock during boss phase 2 transition",
      filesChanged: ["PlayerCombatControllerMonolith.ts", "CombatStateRepository.ts"],
      insertions: 48,
      deletions: 22,
      isBugFix: true
    },
    {
      id: "b4e119",
      timestamp: "42 mins ago",
      author: "Gameplay Engineer",
      message: "refactor(inventory): extract item stacking logic into ItemSlotValidatorNode",
      filesChanged: ["InventoryManager.ts", "ItemSlotValidatorNode.ts"],
      insertions: 85,
      deletions: 110,
      isBugFix: false
    },
    {
      id: "a77d34",
      timestamp: "2 hours ago",
      author: "AI Specialist",
      message: "fix(ai): resolve memory leak in NavMesh path corridor polygon buffer",
      filesChanged: ["AINavMeshPathFollowerNode.ts", "AIBlackboardRepository.ts"],
      insertions: 34,
      deletions: 16,
      isBugFix: true
    },
    {
      id: "9f02cb",
      timestamp: "5 hours ago",
      author: "Audio Programmer",
      message: "feat(audio): add subterranean low-pass Biquad filtering for cave reverb",
      filesChanged: ["BiquadFilterModule.ts", "Spatial3DReverbCalculatorNode.ts"],
      insertions: 62,
      deletions: 12,
      isBugFix: false
    },
    {
      id: "8e14ac",
      timestamp: "Yesterday",
      author: "Physics Engine Lead",
      message: "fix(physics): fix ragdoll constraint snapping on high impulse explosions",
      filesChanged: ["RagdollConstraintSolver.ts", "CollisionMatrixEvaluator.ts"],
      insertions: 74,
      deletions: 38,
      isBugFix: true
    }
  ],
  nodes: [
    {
      id: "node-combat-monolith",
      fileName: "PlayerCombatControllerMonolith.ts",
      filePath: "src/Combat/PlayerCombatControllerMonolith.ts",
      system: "Combat Subsystem",
      category: "GAME_DESIGN",
      linesOfCode: 1420,
      cyclomaticComplexity: 46,
      modificationCount: 42,
      linesChangedCount: 3180,
      bugFixCount: 16,
      distinctAuthorsCount: 7,
      couplingScore: 0.88,
      lastModifiedTimestamp: "10 mins ago",
      primaryReason: "Monolithic file handling inputs, damage formula, animations, VFX triggers, and network sync all in one.",
      refactoringPriority: 98,
      quadrant: "CRITICAL_HOTSPOT",
      recommendationsThai: [
        "แยกไฟล์ออกเป็น 1 โหนด = 1 ไฟล์ทันทีตามกฎ AGENTS.md",
        "แยกการคำนวณดาเมจออกไปเป็น DamageCalculationModule.ts (Pure Function)",
        "แยกการรับปุ่มกดไปที่ CombatInputTriggerNode.ts",
        "แยกการยิงเอฟเฟกต์และเสียงผ่าน CombatEventDispatcher.ts แบบ Decoupled"
      ],
      recommendationsEng: [
        "Decompose monolith into single-responsibility nodes immediately.",
        "Extract pure damage formula into DamageCalculationModule.ts.",
        "Move input buffer listener to CombatInputTriggerNode.ts.",
        "Route VFX & Audio impulses through decoupled CombatEventDispatcher.ts."
      ]
    },
    {
      id: "node-network-sync",
      fileName: "NetEntityReplicator.ts",
      filePath: "src/Networking/NetEntityReplicator.ts",
      system: "Multiplayer Network",
      category: "NETWORKING",
      linesOfCode: 980,
      cyclomaticComplexity: 38,
      modificationCount: 34,
      linesChangedCount: 2240,
      bugFixCount: 12,
      distinctAuthorsCount: 5,
      couplingScore: 0.74,
      lastModifiedTimestamp: "3 hours ago",
      primaryReason: "Frequent state drift bugfixes, rollback prediction tuning, and serialization buffer optimizations.",
      refactoringPriority: 88,
      quadrant: "CRITICAL_HOTSPOT",
      recommendationsThai: [
        "แยกส่วน Rollback Prediction ออกมาเป็น NetworkRollbackPredictorNode.ts",
        "แยก Serialization ออกมาเป็น BinaryStateSerializerNode.ts",
        "ลด Coupling กับ Game State โดยใช้ Snapshot Contract Repository"
      ],
      recommendationsEng: [
        "Extract rollback prediction engine into NetworkRollbackPredictorNode.ts.",
        "Isolate binary packet serialization into BinaryStateSerializerNode.ts.",
        "Decouple entity state mutation via Snapshot State Contract."
      ]
    },
    {
      id: "node-inventory-manager",
      fileName: "InventoryManager.ts",
      filePath: "src/Inventory/InventoryManager.ts",
      system: "Item & Inventory",
      category: "GAME_DESIGN",
      linesOfCode: 720,
      cyclomaticComplexity: 28,
      modificationCount: 26,
      linesChangedCount: 1450,
      bugFixCount: 7,
      distinctAuthorsCount: 4,
      couplingScore: 0.62,
      lastModifiedTimestamp: "42 mins ago",
      primaryReason: "Stacking limits, drag-and-drop validation, and equipment stat binding adjustments.",
      refactoringPriority: 72,
      quadrant: "CRITICAL_HOTSPOT",
      recommendationsThai: [
        "แยกตรรกะการตรวจสอบช่องกระเป๋าไปที่ ItemSlotValidatorNode.ts",
        "สร้าง InventoryStateRepository.ts สำหรับเก็บข้อมูลไอเทมและ Observable Event"
      ],
      recommendationsEng: [
        "Extract slot drop validator into ItemSlotValidatorNode.ts.",
        "Encapsulate inventory data inside dedicated InventoryStateRepository.ts."
      ]
    },
    {
      id: "node-ai-blackboard",
      fileName: "AIBlackboardRepository.ts",
      filePath: "src/AI/Memory/AIBlackboardRepository.ts",
      system: "AI Decision Architecture",
      category: "AI_CODE",
      linesOfCode: 380,
      cyclomaticComplexity: 14,
      modificationCount: 18,
      linesChangedCount: 620,
      bugFixCount: 3,
      distinctAuthorsCount: 3,
      couplingScore: 0.22,
      lastModifiedTimestamp: "2 hours ago",
      primaryReason: "Adding new sensory keys (Suspicion, Threat Level, Last Heard Noise).",
      refactoringPriority: 38,
      quadrant: "ACTIVE_UTILITY",
      recommendationsThai: [
        "โครงสร้างดีและมีการ Decoupled อยู่แล้ว รักษาความสะอาดตามมาตรฐาน 1 Node = 1 File"
      ],
      recommendationsEng: [
        "Well-structured reactive state contract. Maintain clean typing interfaces."
      ]
    },
    {
      id: "node-physics-ragdoll",
      fileName: "RagdollConstraintSolver.ts",
      filePath: "src/Physics/Constraints/RagdollConstraintSolver.ts",
      system: "Physics Engine",
      category: "PHYSICS",
      linesOfCode: 840,
      cyclomaticComplexity: 34,
      modificationCount: 14,
      linesChangedCount: 1100,
      bugFixCount: 6,
      distinctAuthorsCount: 2,
      couplingScore: 0.35,
      lastModifiedTimestamp: "Yesterday",
      primaryReason: "Joint angle limits, impulse damping tuning, and collision penetration resolution.",
      refactoringPriority: 60,
      quadrant: "COMPLEX_STABLE",
      recommendationsThai: [
        "เป็นโค้ดคณิตศาสตร์เชิงลึก มีความซับซ้อนแต่แตะต้องเฉพาะผู้เชี่ยวชาญ แนะนำเพิ่ม Unit Test ให้ครอบคลุม"
      ],
      recommendationsEng: [
        "High complexity domain math. Stable modification pattern. Add automated constraint regression tests."
      ]
    },
    {
      id: "node-render-forward",
      fileName: "ForwardPlusClusterShader.ts",
      filePath: "src/Rendering/Pipeline/ForwardPlusClusterShader.ts",
      system: "Graphics Pipeline",
      category: "RENDERING",
      linesOfCode: 1120,
      cyclomaticComplexity: 42,
      modificationCount: 9,
      linesChangedCount: 540,
      bugFixCount: 4,
      distinctAuthorsCount: 2,
      couplingScore: 0.28,
      lastModifiedTimestamp: "3 days ago",
      primaryReason: "GPU frustum grid clustering and point light culling shader updates.",
      refactoringPriority: 48,
      quadrant: "COMPLEX_STABLE",
      recommendationsThai: [
        "โมดูลเรนเดอร์ระดับล่าง มีความเสถียร ไม่จำเป็นต้องรีแฟคเตอร์ใหญ่เว้นแต่เปลี่ยนโครงสร้าง GPU pass"
      ],
      recommendationsEng: [
        "Low-level GPU compute pass. Highly stable; refactor only during render graph pipeline upgrades."
      ]
    },
    {
      id: "node-damage-formula",
      fileName: "DamageCalculationModule.ts",
      filePath: "src/Combat/Formula/DamageCalculationModule.ts",
      system: "Combat Subsystem",
      category: "GAME_DESIGN",
      linesOfCode: 140,
      cyclomaticComplexity: 6,
      modificationCount: 8,
      linesChangedCount: 180,
      bugFixCount: 1,
      distinctAuthorsCount: 2,
      couplingScore: 0.08,
      lastModifiedTimestamp: "4 days ago",
      primaryReason: "Balancing armor penetration formula curves.",
      refactoringPriority: 12,
      quadrant: "STABLE_LEAF",
      recommendationsThai: [
        "เป็นตัวอย่างที่ดีเยี่ยมของ Pure Function Module: ไม่มีการผูกติด แยกไฟล์เดี่ยว บัฟเฟอร์ความเสี่ยงเป็นศูนย์"
      ],
      recommendationsEng: [
        "Exemplary pure function node. Zero external coupling and high testability."
      ]
    },
    {
      id: "node-audio-biquad",
      fileName: "BiquadFilterModule.ts",
      filePath: "src/Audio/DSP/BiquadFilterModule.ts",
      system: "Audio Engine",
      category: "AUDIO",
      linesOfCode: 120,
      cyclomaticComplexity: 5,
      modificationCount: 6,
      linesChangedCount: 110,
      bugFixCount: 0,
      distinctAuthorsCount: 2,
      couplingScore: 0.06,
      lastModifiedTimestamp: "5 hours ago",
      primaryReason: "Added band-pass and notch filtering equation presets.",
      refactoringPriority: 8,
      quadrant: "STABLE_LEAF",
      recommendationsThai: [
        "โมดูลเสียงอิสระตามกฎ 1 Node = 1 File ทำงานสมบูรณ์แบบ"
      ],
      recommendationsEng: [
        "Decoupled audio math node adhering perfectly to 1 Node = 1 File convention."
      ]
    },
    {
      id: "node-navmesh-follower",
      fileName: "AINavMeshPathFollowerNode.ts",
      filePath: "src/AI/Navigation/AINavMeshPathFollowerNode.ts",
      system: "AI Decision Architecture",
      category: "AI_CODE",
      linesOfCode: 420,
      cyclomaticComplexity: 19,
      modificationCount: 16,
      linesChangedCount: 890,
      bugFixCount: 5,
      distinctAuthorsCount: 3,
      couplingScore: 0.32,
      lastModifiedTimestamp: "2 hours ago",
      primaryReason: "Corner smoothing splines and dynamic crowd avoidance.",
      refactoringPriority: 52,
      quadrant: "ACTIVE_UTILITY",
      recommendationsThai: [
        "แยก Steering Force ออกจาก Corridor Polygon Traversal เพื่อความคมชัดของหน้าที่"
      ],
      recommendationsEng: [
        "Isolate steering forces from geometric polygon traversal for sharper modular boundaries."
      ]
    },
    {
      id: "node-memory-allocator",
      fileName: "LinearMemoryArenaPool.ts",
      filePath: "src/Memory/LinearMemoryArenaPool.ts",
      system: "Memory Subsystem",
      category: "MEMORY",
      linesOfCode: 260,
      cyclomaticComplexity: 11,
      modificationCount: 4,
      linesChangedCount: 90,
      bugFixCount: 0,
      distinctAuthorsCount: 1,
      couplingScore: 0.05,
      lastModifiedTimestamp: "1 week ago",
      primaryReason: "Aligned 64-byte boundary SIMD support.",
      refactoringPriority: 5,
      quadrant: "STABLE_LEAF",
      recommendationsThai: [
        "โมดูลจัดสรรหน่วยความจำระดับต่ำ ปลอดภัยและมีประสิทธิภาพสูงมาก"
      ],
      recommendationsEng: [
        "Ultra-high efficiency linear arena allocator. Pristine modular state."
      ]
    }
  ]
};

/**
 * ชุดข้อมูลจำลอง Open-World Survival Crafting Engine
 */
const SURVIVAL_CRAFTING_HEATMAP_PRESET: HeatmapSystemDataset = {
  id: "survival_crafting_engine",
  title: "Open-World Voxel Survival & Crafting Engine",
  thaiTitle: "เอนจินเกมเอาชีวิตรอด Open-World และสร้างของ (Voxel Survival)",
  description: "Telemetry data for Voxel Octree generation, Crafting recipes, Weather simulation, and Persistent World Save states.",
  thaiDescription: "ข้อมูลสถิติการแก้ไขระบบสร้างโลก Voxel Octree, ระบบคราฟต์ไอเทม, การจำลองสภาพอากาศ และระบบเซฟโลก",
  totalCommits: 1840,
  totalFiles: 20,
  recentCommits: [
    {
      id: "f1a23e",
      timestamp: "18 mins ago",
      author: "Voxel Engine Dev",
      message: "fix(voxel): resolve chunk seam light bleeding on dynamic day-night cycle",
      filesChanged: ["VoxelWorldChunkManagerMonolith.ts", "VoxelLightingMeshBaker.ts"],
      insertions: 94,
      deletions: 42,
      isBugFix: true
    },
    {
      id: "e44d01",
      timestamp: "1 hour ago",
      author: "Economy Designer",
      message: "feat(crafting): add tier-4 alloy smelting recipe matrix with fuel efficiency",
      filesChanged: ["CraftingRecipeEvaluatorNode.ts"],
      insertions: 56,
      deletions: 8,
      isBugFix: false
    },
    {
      id: "d981aa",
      timestamp: "4 hours ago",
      author: "Core Systems Lead",
      message: "fix(save): patch async save corruption during unexpected player disconnect",
      filesChanged: ["SaveGameDataPersistenceManager.ts"],
      insertions: 112,
      deletions: 34,
      isBugFix: true
    }
  ],
  nodes: [
    {
      id: "surv-chunk-monolith",
      fileName: "VoxelWorldChunkManagerMonolith.ts",
      filePath: "src/World/Voxel/VoxelWorldChunkManagerMonolith.ts",
      system: "World Building Subsystem",
      category: "WORLD",
      linesOfCode: 1680,
      cyclomaticComplexity: 52,
      modificationCount: 48,
      linesChangedCount: 4120,
      bugFixCount: 19,
      distinctAuthorsCount: 8,
      couplingScore: 0.92,
      lastModifiedTimestamp: "18 mins ago",
      primaryReason: "Monolithic file handling Chunk meshing, LOD octree partitioning, foliage placement, collision generation, and networking.",
      refactoringPriority: 99,
      quadrant: "CRITICAL_HOTSPOT",
      recommendationsThai: [
        "เป็น Hotspot ที่เสี่ยงที่สุดในโปรเจกต์ ต้องแยกออกเป็น 1 โหนด 1 ไฟล์ทันที!",
        "แยกการสร้างตาข่าย Voxel Mesh ออกเป็น VoxelGreedyMesherNode.ts",
        "แยกการสร้าง Collider ออกเป็น VoxelChunkColliderBakerNode.ts",
        "แยกการสตรีมโหลด Chunk ออกเป็น ChunkStreamingOctreeRepository.ts"
      ],
      recommendationsEng: [
        "Highest risk hotspot in codebase. Immediate multi-file decomposition required.",
        "Extract greedy meshing algorithm into VoxelGreedyMesherNode.ts.",
        "Extract physics mesh baking into VoxelChunkColliderBakerNode.ts.",
        "Move spatial loading queues into ChunkStreamingOctreeRepository.ts."
      ]
    },
    {
      id: "surv-save-manager",
      fileName: "SaveGameDataPersistenceManager.ts",
      filePath: "src/Persistence/SaveGameDataPersistenceManager.ts",
      system: "Core Persistence",
      category: "CORE",
      linesOfCode: 890,
      cyclomaticComplexity: 32,
      modificationCount: 29,
      linesChangedCount: 1820,
      bugFixCount: 11,
      distinctAuthorsCount: 4,
      couplingScore: 0.71,
      lastModifiedTimestamp: "4 hours ago",
      primaryReason: "Database serialization, async compression, and backward-compatible schema migrations.",
      refactoringPriority: 82,
      quadrant: "CRITICAL_HOTSPOT",
      recommendationsThai: [
        "แยกการบีบอัดไฟล์ (Compression) ไปที่ SaveFileCompressionModule.ts",
        "แยกการอัปเกรด Schema ไปที่ SaveSchemaMigrationNode.ts"
      ],
      recommendationsEng: [
        "Isolate binary compression into SaveFileCompressionModule.ts.",
        "Extract versioned schema migrators into SaveSchemaMigrationNode.ts."
      ]
    },
    {
      id: "surv-craft-eval",
      fileName: "CraftingRecipeEvaluatorNode.ts",
      filePath: "src/Crafting/CraftingRecipeEvaluatorNode.ts",
      system: "Item & Crafting",
      category: "GAME_DESIGN",
      linesOfCode: 180,
      cyclomaticComplexity: 8,
      modificationCount: 14,
      linesChangedCount: 380,
      bugFixCount: 1,
      distinctAuthorsCount: 3,
      couplingScore: 0.12,
      lastModifiedTimestamp: "1 hour ago",
      primaryReason: "Updating crafting recipe tables and catalyst requirements.",
      refactoringPriority: 24,
      quadrant: "ACTIVE_UTILITY",
      recommendationsThai: [
        "ไฟล์ขนาดกะทัดรัด หน้าที่ชัดเจน มีความปลอดภัยสูง"
      ],
      recommendationsEng: [
        "Clean recipe match evaluator. High modular safety."
      ]
    }
  ]
};

export const PRESET_HEATMAP_DATASETS: Record<string, HeatmapSystemDataset> = {
  action_rpg_engine: ACTION_RPG_HEATMAP_PRESET,
  survival_crafting_engine: SURVIVAL_CRAFTING_HEATMAP_PRESET
};

export const ALL_HEATMAP_PRESETS = Object.values(PRESET_HEATMAP_DATASETS);
