/**
 * =========================================================================================
 * @file moduleDependencyGraphData.ts
 * @system System Architecture & Dependency Graph Engine
 * @module Module Dependency Graph Data Repository & Relationship Resolver
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * 1. กำหนดโครงสร้างข้อมูล (Data Contracts & Interfaces) สำหรับโหนด โมดูล และความสัมพันธ์ในระบบ
 * 2. จัดเตรียม Dataset สถาปัตยกรรมเกมที่แยก 1 Node / 1 Module = 1 File สำหรับการจำลองและการแสดงผลแบบ Interactive
 * 3. มีฟังก์ชันคำนวณ Blast Radius (ผลกระทบเมื่อแก้ไฟล์), ตรวจสอบวงวน (Cycle Detection / DAG Validation),
 *    และการคำนวณคะแนนความสะอาดของสถาปัตยกรรม (Coupling Factor & Maintainability Index)
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น / Architecture]:
 * - เป็นแกนกลางข้อมูลให้กับ ModuleDependencyVisualizerStudio.tsx
 * - สอดคล้องกับข้อกำหนดใน AGENTS.md: Strict 1 Node = 1 File Policy และ Descriptive Naming
 * 
 * 📥 [Inputs / Data Contracts]:
 * - `SystemCategory`: ประเภทของระบบย่อยใน Game Engine
 * - `DependencyNode`: โครงสร้างรายละเอียดของแต่ละไฟล์/โหนด
 * - `DependencyLink`: โครงสร้างเส้นเชื่อมโยงความสัมพันธ์และประเภทของการสื่อสาร
 * 
 * 📤 [Outputs]:
 * - `INITIAL_PRESETS`: พรีเซ็ตสถาปัตยกรรมระบบเกมแยกไฟล์ที่สมบูรณ์
 * - `calculateBlastRadius()`: คำนวณรายชื่อโหนดที่จะได้รับผลกระทบเมื่อไฟล์ใดไฟล์หนึ่งถูกแก้ไข
 * - `validateDAG()`: ตรวจสอบว่าระบบมี Circular Dependency หรือไม่
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - ป้องกัน Cycle Infinite Loop ในการหาความสัมพันธ์ด้วย Visited Set
 * - มี Fallback Node ในกรณีที่ค้นหา Node ID ไม่พบ
 * 
 * 📝 [Usage Example]:
 * ```typescript
 * import { SYSTEM_PRESETS, calculateBlastRadius, validateDAG } from './moduleDependencyGraphData';
 * const graph = SYSTEM_PRESETS['combat_system'];
 * const blastRadius = calculateBlastRadius(graph.nodes, graph.links, 'DamageCalculationModule.ts');
 * ```
 * =========================================================================================
 */

export type DependencyNodeType = 
  | 'system_hub' 
  | 'node_file' 
  | 'module_file' 
  | 'state_contract' 
  | 'event_bus' 
  | 'hardware_layer';

export type DependencyLinkType = 
  | 'direct_call' 
  | 'event_dispatch' 
  | 'state_binding' 
  | 'pipeline_flow' 
  | 'hardware_io';

export type SystemCategory = 
  | 'CORE' 
  | 'AI_CODE' 
  | 'WORLD' 
  | 'ART' 
  | 'VFX' 
  | 'AUDIO' 
  | 'GAME_DESIGN' 
  | 'PHYSICS' 
  | 'RENDERING' 
  | 'UI_DATA' 
  | 'DEVOPS'
  | 'MODULAR_SYSTEM';

export interface DependencyNode {
  id: string;
  name: string;
  path: string;
  role: string;
  system: string;
  category: SystemCategory;
  type: DependencyNodeType;
  linesCount: number;
  couplingFactor: number; // 0.00 (Purely Decoupled) - 1.00 (Heavily Coupled)
  layer: 1 | 2 | 3 | 4; // 1: Presentation/UI, 2: Logic Nodes, 3: State Repositories, 4: Engine/Hardware
  descriptionThai: string;
  descriptionEng: string;
  inputs: string[];
  outputs: string[];
  status: 'Clean' | 'Decoupled' | 'Refactored';
  codePreview?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface DependencyLink {
  source: string; // node id
  target: string; // node id
  type: DependencyLinkType;
  label: string;
  descriptionThai?: string;
  packetPayload?: string;
  latencyMs?: number;
}

export interface ArchitecturePreset {
  id: string;
  title: string;
  thaiTitle: string;
  category: string;
  description: string;
  thaiDescription: string;
  iconName: string;
  nodes: DependencyNode[];
  links: DependencyLink[];
}

/**
 * Combat & Damage Pipeline Modular Preset
 */
const COMBAT_SYSTEM_PRESET: ArchitecturePreset = {
  id: "combat_pipeline",
  title: "Combat & Damage Calculation Pipeline",
  thaiTitle: "ระบบคำนวณความเสียหายและการต่อสู้ (1 Node = 1 File)",
  category: "GAME_DESIGN",
  description: "Strict 1-Node/1-Module breakdown for action combat, hit registration, stamina drain, and decoupled VFX/Audio dispatching.",
  thaiDescription: "การแบ่งสถาปัตยกรรมระบบต่อสู้และดาเมจออกเป็นไฟล์เดี่ยว 1 โหนด 1 ไฟล์ คำนวณดาเมจ สตามิน่า และยิง Event ไปยัง VFX/Audio แบบ Decoupled",
  iconName: "Swords",
  nodes: [
    {
      id: "CombatInputTriggerNode",
      name: "CombatInputTriggerNode.ts",
      path: "src/Combat/Input/CombatInputTriggerNode.ts",
      role: "Action Map Combo Buffer Reader",
      system: "Combat Architecture",
      category: "GAME_DESIGN",
      type: "node_file",
      linesCount: 54,
      couplingFactor: 0.12,
      layer: 1,
      descriptionThai: "อ่านจังหวะการกดปุ่มโจมตี (Combo Buffer) และส่งค่า Action Request",
      descriptionEng: "Reads light/heavy attack inputs and manages combo buffer timing windows.",
      inputs: ["Raw Player Input Signals", "Attack Button Press"],
      outputs: ["AttackTriggerRequestEvent", "ComboChainIndex"],
      status: "Clean",
      codePreview: `export class CombatInputTriggerNode {
  private comboBuffer: string[] = [];
  public onAttackPress(type: 'light' | 'heavy') {
    this.comboBuffer.push(type);
    CombatEventDispatcher.emit('ATTACK_TRIGGERED', { type, time: performance.now() });
  }
}`
    },
    {
      id: "DamageCalculationModule",
      name: "DamageCalculationModule.ts",
      path: "src/Combat/Formula/DamageCalculationModule.ts",
      role: "Pure Deterministic Damage Formula Engine",
      system: "Combat Architecture",
      category: "GAME_DESIGN",
      type: "module_file",
      linesCount: 82,
      couplingFactor: 0.08,
      layer: 2,
      descriptionThai: "ฟังก์ชันคำนวณดาเมจแบบ Pure Function (Base Damage * Scaling - Armor Mitigation)",
      descriptionEng: "Pure mathematical formula calculating damage scaling, elemental multiplier, and defense penetration.",
      inputs: ["AttackerStats", "DefenderStats", "AttackSkillModifier"],
      outputs: ["FinalDamageResult", "MitigatedAmount", "IsCritical"],
      status: "Clean",
      codePreview: `export class DamageCalculationModule {
  public static calculateDamage(atk: number, def: number, skillMult: number): number {
    const raw = atk * skillMult;
    const mitigated = raw * (100 / (100 + def));
    return Math.max(1, Math.round(mitigated));
  }
}`
    },
    {
      id: "CombatCriticalHitEvaluatorNode",
      name: "CombatCriticalHitEvaluatorNode.ts",
      path: "src/Combat/Formula/CombatCriticalHitEvaluatorNode.ts",
      role: "Critical Hit & RNG Probability Evaluator",
      system: "Combat Architecture",
      category: "GAME_DESIGN",
      type: "node_file",
      linesCount: 46,
      couplingFactor: 0.06,
      layer: 2,
      descriptionThai: "คำนวณโอกาสติด Critical Hit และ Critical Damage Multiplier",
      descriptionEng: "Evaluates critical strike RNG thresholds, diminishing returns, and multiplier calculations.",
      inputs: ["CritChanceStat", "CritDamageStat", "LuckModifier"],
      outputs: ["CriticalEvaluationResult"],
      status: "Clean",
      codePreview: `export class CombatCriticalHitEvaluatorNode {
  public static evaluateCrit(chance: number, mult: number): { isCrit: boolean; multiplier: number } {
    const roll = Math.random() * 100;
    const isCrit = roll <= Math.min(100, Math.max(0, chance));
    return { isCrit, multiplier: isCrit ? mult : 1.0 };
  }
}`
    },
    {
      id: "CombatStateRepository",
      name: "CombatStateRepository.ts",
      path: "src/Combat/State/CombatStateRepository.ts",
      role: "Central Health & Combat State Store",
      system: "Combat Architecture",
      category: "GAME_DESIGN",
      type: "state_contract",
      linesCount: 95,
      couplingFactor: 0.15,
      layer: 3,
      descriptionThai: "แหล่งเก็บข้อมูล HP, Status Effect, และบันทึกประวัติการต่อสู้",
      descriptionEng: "Encapsulates reactive HP mutations, status effect timers, and combat telemetry log.",
      inputs: ["DamageApplicationPayload", "HealPayload", "StatusEffectPayload"],
      outputs: ["CurrentHealthState", "OnDeathSignal", "HealthChangedObservable"],
      status: "Clean",
      codePreview: `export class CombatStateRepository {
  private currentHealth: number = 1000;
  public applyDamage(amount: number): number {
    this.currentHealth = Math.max(0, this.currentHealth - amount);
    CombatEventDispatcher.emit('HEALTH_UPDATED', { current: this.currentHealth });
    return this.currentHealth;
  }
}`
    },
    {
      id: "CombatFeedbackVFXNode",
      name: "CombatFeedbackVFXNode.ts",
      path: "src/Combat/Feedback/CombatFeedbackVFXNode.ts",
      role: "Hit Spark & Screen Shake VFX Controller",
      system: "Combat Architecture",
      category: "VFX",
      type: "node_file",
      linesCount: 68,
      couplingFactor: 0.10,
      layer: 1,
      descriptionThai: "ควบคุมการ Spawn เอฟเฟกต์ประกายไฟ (Hit Sparks), เลือด (Blood Splatter) และสั่นจอ (Screen Shake)",
      descriptionEng: "Spawns particle sparks, directional blood decals, and camera impulse impulses on damage events.",
      inputs: ["HitPointVector3", "HitNormalVector3", "DamageSeverityLevel"],
      outputs: ["VFXParticleEmitterHandle", "CameraImpulseTrigger"],
      status: "Clean",
      codePreview: `export class CombatFeedbackVFXNode {
  public static onHitReceived(hitPoint: Vector3, isCrit: boolean) {
    ParticleEffectManager.spawnSpark(hitPoint, isCrit ? 'heavy_crit' : 'normal_slash');
    CameraShaker.shake(isCrit ? 0.35 : 0.12);
  }
}`
    },
    {
      id: "CombatAudioFeedbackNode",
      name: "CombatAudioFeedbackNode.ts",
      path: "src/Combat/Feedback/CombatAudioFeedbackNode.ts",
      role: "Dynamic Foley & Impact Sound Synthesizer",
      system: "Combat Architecture",
      category: "AUDIO",
      type: "node_file",
      linesCount: 58,
      couplingFactor: 0.09,
      layer: 1,
      descriptionThai: "เล่นเสียงฟันโดนเนื้อ/เกราะ (Dynamic Impact Foley) ตามประเภทอาวุธ",
      descriptionEng: "Synthesizes directional impact audio, sword clangs, and armor resonance sounds.",
      inputs: ["WeaponType", "ArmorMaterial", "IsCriticalHit"],
      outputs: ["AudioDSPOutputVoice"],
      status: "Clean",
      codePreview: `export class CombatAudioFeedbackNode {
  public static playImpact(material: string, isCrit: boolean) {
    const soundId = isCrit ? 'metal_slash_heavy_crit' : 'metal_slice_flesh';
    AudioManager.playSpatialSFX(soundId, { pitchVariation: 0.08 });
  }
}`
    },
    {
      id: "CombatEventDispatcher",
      name: "CombatEventDispatcher.ts",
      path: "src/Combat/Events/CombatEventDispatcher.ts",
      role: "Decoupled Event Bus & PubSub Pipeline",
      system: "Combat Architecture",
      category: "CORE",
      type: "event_bus",
      linesCount: 62,
      couplingFactor: 0.05,
      layer: 3,
      descriptionThai: "บัสสื่อสารแบบไร้การยึดติด (Decoupled Pub/Sub) ระหว่างตรรกะต่อสู้กับระบบ UI, เสียง และแอนิเมชัน",
      descriptionEng: "Decoupled Event Dispatcher routing combat payloads without tight cross-module coupling.",
      inputs: ["EventName", "PayloadData"],
      outputs: ["ListenerNotifications"],
      status: "Clean",
      codePreview: `export class CombatEventDispatcher {
  private static listeners: Map<string, Function[]> = new Map();
  public static emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(fn => fn(data));
  }
}`
    }
  ],
  links: [
    { source: "CombatInputTriggerNode", target: "DamageCalculationModule", type: "direct_call", label: "Invokes Damage Pipeline", packetPayload: "{ weaponDmg: 45, comboMult: 1.25 }" },
    { source: "DamageCalculationModule", target: "CombatCriticalHitEvaluatorNode", type: "direct_call", label: "Evaluates Crit Bonus", packetPayload: "{ baseDmg: 56, critChance: 25% }" },
    { source: "DamageCalculationModule", target: "CombatStateRepository", type: "state_binding", label: "Mutates HP State", packetPayload: "{ dmgApplied: 112, target: 'Boss_01' }" },
    { source: "CombatStateRepository", target: "CombatEventDispatcher", type: "event_dispatch", label: "Fires OnHit Event", packetPayload: "{ event: 'HIT_CONFIRMED', dmg: 112 }" },
    { source: "CombatEventDispatcher", target: "CombatFeedbackVFXNode", type: "event_dispatch", label: "Spawns Hit Sparks", packetPayload: "{ vfxType: 'slash_crit', pos: [12, 4, 8] }" },
    { source: "CombatEventDispatcher", target: "CombatAudioFeedbackNode", type: "event_dispatch", label: "Triggers Impact Audio", packetPayload: "{ sfx: 'heavy_blade_impact', volume: 0.9 }" }
  ]
};

/**
 * Player Movement & Kinematics Architecture Preset
 */
const PLAYER_MOVEMENT_PRESET: ArchitecturePreset = {
  id: "player_movement",
  title: "Player Movement & Character Kinematics",
  thaiTitle: "ระบบการเคลื่อนที่และฟิสิกส์ตัวละคร (1 Node = 1 File)",
  category: "PHYSICS",
  description: "Strict 1-Module/1-File architecture separating Input capture, kinematic physics, stamina costs, and animator parameter synchronization.",
  thaiDescription: "แยกไฟล์ระบบควบคุมตัวละคร: Input Node -> Kinematics Node -> Stamina Drain -> Animation Sync",
  iconName: "PersonStanding",
  nodes: [
    {
      id: "PlayerMovementInputNode",
      name: "PlayerMovementInputNode.cs",
      path: "src/Player/Movement/PlayerMovementInputNode.cs",
      role: "Input System Action Map Reader",
      system: "Player Movement Architecture",
      category: "PHYSICS",
      type: "node_file",
      linesCount: 52,
      couplingFactor: 0.11,
      layer: 1,
      descriptionThai: "อ่านค่า Vector2 Move, Jump Trigger, และ Sprint Hold จาก New Input System",
      descriptionEng: "Decoupled input listener polling Vector2 directional vectors and jump/sprint impulses.",
      inputs: ["Hardware Gamepad / Keyboard / Touch"],
      outputs: ["MoveVector2", "IsJumpTriggered", "IsSprintHeld"],
      status: "Clean"
    },
    {
      id: "PlayerKinematicsPhysicsNode",
      name: "PlayerKinematicsPhysicsNode.cs",
      path: "src/Player/Movement/PlayerKinematicsPhysicsNode.cs",
      role: "Kinematic Acceleration & Gravity Engine",
      system: "Player Movement Architecture",
      category: "PHYSICS",
      type: "module_file",
      linesCount: 94,
      couplingFactor: 0.14,
      layer: 2,
      descriptionThai: "คำนวณความเร็ว (Velocity), แรงเฉื่อย (Inertia), และแรงโน้มถ่วง (Decoupled Gravity)",
      descriptionEng: "Calculates kinematic velocity, acceleration curves, slope sliding, and vertical gravity integration.",
      inputs: ["MoveVector2", "GravityScale", "GroundNormal"],
      outputs: ["WorldDisplacementVector3", "CurrentVelocityMagnitude", "IsGrounded"],
      status: "Clean"
    },
    {
      id: "PlayerStaminaDrainNode",
      name: "PlayerStaminaDrainNode.ts",
      path: "src/Player/Movement/PlayerStaminaDrainNode.ts",
      role: "Sprint & Dash Stamina Consumption Evaluator",
      system: "Player Movement Architecture",
      category: "GAME_DESIGN",
      type: "node_file",
      linesCount: 48,
      couplingFactor: 0.07,
      layer: 2,
      descriptionThai: "คำนวณการหักสตามิน่าระหว่างวิ่ง (Sprint Drain Rate) และตรวจเงื่อนไขการเหนื่อยหอบ",
      descriptionEng: "Calculates continuous sprint stamina consumption and exhausted recovery delays.",
      inputs: ["IsSprintActive", "SprintDrainRatePerSec"],
      outputs: ["StaminaDrainDelta", "IsStaminaDepleted"],
      status: "Clean"
    },
    {
      id: "PlayerMovementStateRepository",
      name: "PlayerMovementStateRepository.ts",
      path: "src/Player/State/PlayerMovementStateRepository.ts",
      role: "Position, Speed & Movement Mode Store",
      system: "Player Movement Architecture",
      category: "CORE",
      type: "state_contract",
      linesCount: 78,
      couplingFactor: 0.12,
      layer: 3,
      descriptionThai: "จัดเก็บตำแหน่งพิกัด (Position), สถานะการเดิน/วิ่ง/ลอยตัว และโหมดการเคลื่อนไหว",
      descriptionEng: "Central repository holding reactive player transform coords, locomotion states, and stamina gauges.",
      inputs: ["VelocityVector3", "StaminaDelta", "LocomotionMode"],
      outputs: ["CurrentPlayerPosition", "CurrentStaminaRatio", "MovementStateObservable"],
      status: "Clean"
    },
    {
      id: "PlayerAnimationSyncModule",
      name: "PlayerAnimationSyncModule.cs",
      path: "src/Player/Animation/PlayerAnimationSyncModule.cs",
      role: "Animator Parameter Synchronizer",
      system: "Player Movement Architecture",
      category: "VFX",
      type: "node_file",
      linesCount: 42,
      couplingFactor: 0.08,
      layer: 1,
      descriptionThai: "อัปเดตตัวแปร Speed, IsGrounded, IsFalling เข้าสู่ Animator State Machine",
      descriptionEng: "Synchronizes locomotion speeds and ground contact booleans to Unity/Unreal Animator Controller.",
      inputs: ["VelocityMagnitude", "IsGroundedBoolean", "TurnAngle"],
      outputs: ["AnimatorParameterHashes"],
      status: "Clean"
    }
  ],
  links: [
    { source: "PlayerMovementInputNode", target: "PlayerKinematicsPhysicsNode", type: "direct_call", label: "Supplies Move Vector", packetPayload: "{ moveX: 0.85, moveY: 1.0, sprint: true }" },
    { source: "PlayerMovementInputNode", target: "PlayerStaminaDrainNode", type: "direct_call", label: "Checks Sprint Cost", packetPayload: "{ sprintHeld: true, dt: 0.016s }" },
    { source: "PlayerKinematicsPhysicsNode", target: "PlayerMovementStateRepository", type: "state_binding", label: "Updates Position & Speed", packetPayload: "{ pos: [102.4, 1.2, 45.1], speed: 6.8m/s }" },
    { source: "PlayerStaminaDrainNode", target: "PlayerMovementStateRepository", type: "state_binding", label: "Deducts Stamina Points", packetPayload: "{ staminaDrain: -0.24, current: 84.6% }" },
    { source: "PlayerMovementStateRepository", target: "PlayerAnimationSyncModule", type: "direct_call", label: "Syncs Animator Speed", packetPayload: "{ animSpeed: 6.8, isGrounded: true }" }
  ]
};

/**
 * AI Behavior Tree & Blackboard Subsystem Preset
 */
const AI_BEHAVIOR_PRESET: ArchitecturePreset = {
  id: "ai_behavior_tree",
  title: "AI Behavior Tree & Blackboard Subsystem",
  thaiTitle: "ระบบพฤติกรรม AI ปัญญาประดิษฐ์ (1 Node = 1 File)",
  category: "AI_CODE",
  description: "Modular AI decision hierarchy: Perception sensor, Blackboard memory repository, Composite Selector/Sequence nodes, and NavMesh router.",
  thaiDescription: "สถาปัตยกรรมต้นไม้พฤติกรรม AI: โหนดรับรู้ (Perception) -> กระดานข้อมูล (Blackboard) -> โหนดตัดสินใจ (Selector/Sequence) -> นำทาง (NavMesh)",
  iconName: "BrainCircuit",
  nodes: [
    {
      id: "AISensoryPerceptionNode",
      name: "AISensoryPerceptionNode.ts",
      path: "src/AI/Perception/AISensoryPerceptionNode.ts",
      role: "Vision Cone & Hearing Sensor Evaluator",
      system: "AI Behavior Subsystem",
      category: "AI_CODE",
      type: "node_file",
      linesCount: 66,
      couplingFactor: 0.10,
      layer: 1,
      descriptionThai: "คำนวณการมองเห็น (Vision Cone FOV) และการได้ยินเสียงฝีเท้า (Hearing Radius)",
      descriptionEng: "Raycasts vision cones and evaluates sound stimuli distance to detect player presence.",
      inputs: ["NearbyEntitiesList", "FOVAngle", "ViewDistance"],
      outputs: ["DetectedTargetTransform", "StimulusSeverityLevel"],
      status: "Clean"
    },
    {
      id: "AIBlackboardRepository",
      name: "AIBlackboardRepository.ts",
      path: "src/AI/Memory/AIBlackboardRepository.ts",
      role: "Shared AI Memory & Target Blackboard",
      system: "AI Behavior Subsystem",
      category: "AI_CODE",
      type: "state_contract",
      linesCount: 88,
      couplingFactor: 0.12,
      layer: 3,
      descriptionThai: "กระดานความจำ AI (Blackboard) เก็บพิกัดเป้าหมาย, ระดับความระแวง (Alert Level) และสถานะลาดตระเวน",
      descriptionEng: "Key-value reactive blackboard storing target transforms, suspicion meters, and patrol waypoint queues.",
      inputs: ["TargetCoordinates", "SuspicionValue", "CombatState"],
      outputs: ["BlackboardKeyObservables"],
      status: "Clean"
    },
    {
      id: "BTRootEvaluatorNode",
      name: "BTRootEvaluatorNode.ts",
      path: "src/AI/BehaviorTree/BTRootEvaluatorNode.ts",
      role: "Behavior Tree Root Tick Manager",
      system: "AI Behavior Subsystem",
      category: "AI_CODE",
      type: "module_file",
      linesCount: 54,
      couplingFactor: 0.08,
      layer: 2,
      descriptionThai: "ตัวควบคุมการ Tick ของ Behavior Tree ตามรอบเวลา DeltaTime",
      descriptionEng: "Executes tree ticks at variable frame intervals with execution state logging.",
      inputs: ["DeltaTime", "BlackboardReference"],
      outputs: ["TreeExecutionStatus"],
      status: "Clean"
    },
    {
      id: "BTSelectorCompositeNode",
      name: "BTSelectorCompositeNode.ts",
      path: "src/AI/BehaviorTree/BTSelectorCompositeNode.ts",
      role: "Selector Composite (Fallback) Evaluator",
      system: "AI Behavior Subsystem",
      category: "AI_CODE",
      type: "node_file",
      linesCount: 45,
      couplingFactor: 0.06,
      layer: 2,
      descriptionThai: "โหนด Composite ประเภท Selector รันจนกว่าจะเจอโหนดย่อยที่ให้ผล Success",
      descriptionEng: "Evaluates child branches sequentially until first SUCCESS node or returns FAILURE.",
      inputs: ["ChildNodesArray"],
      outputs: ["CompositeStatus (Running/Success/Failure)"],
      status: "Clean"
    },
    {
      id: "BTSequenceCombatNode",
      name: "BTSequenceCombatNode.ts",
      path: "src/AI/BehaviorTree/BTSequenceCombatNode.ts",
      role: "Sequence Combat Action Executor",
      system: "AI Behavior Subsystem",
      category: "AI_CODE",
      type: "node_file",
      linesCount: 62,
      couplingFactor: 0.09,
      layer: 2,
      descriptionThai: "โหนด Sequence รันขั้นตอนการต่อสู้ (เข้าใกล้เป้าหมาย -> ยกอาวุธ -> โจมตี)",
      descriptionEng: "Executes combat chain: approach target -> raise weapon -> strike animation.",
      inputs: ["TargetRangeThreshold", "AttackCooldown"],
      outputs: ["CombatActionSignal"],
      status: "Clean"
    },
    {
      id: "AINavMeshPathFollowerNode",
      name: "AINavMeshPathFollowerNode.ts",
      path: "src/AI/Navigation/AINavMeshPathFollowerNode.ts",
      role: "NavMesh Agent Waypoint Solver",
      system: "AI Behavior Subsystem",
      category: "WORLD",
      type: "node_file",
      linesCount: 74,
      couplingFactor: 0.13,
      layer: 1,
      descriptionThai: "คำนวณเส้นทาง A* Pathfinding และสั่งเลี้ยว/เคลื่อนที่ตาม Corner Waypoints",
      descriptionEng: "Queries NavMesh routing polygons, calculates spline corners, and drives character steering.",
      inputs: ["DestinationVector3", "AgentSpeed", "StoppingDistance"],
      outputs: ["VelocitySteeringVector3", "HasReachedDestination"],
      status: "Clean"
    }
  ],
  links: [
    { source: "AISensoryPerceptionNode", target: "AIBlackboardRepository", type: "state_binding", label: "Writes Target to Blackboard", packetPayload: "{ target: 'Player_01', alertLevel: 95% }" },
    { source: "BTRootEvaluatorNode", target: "AIBlackboardRepository", type: "direct_call", label: "Reads AI Memory", packetPayload: "{ query: 'target_coords' }" },
    { source: "BTRootEvaluatorNode", target: "BTSelectorCompositeNode", type: "direct_call", label: "Ticks Top Selector", packetPayload: "{ status: 'RUNNING' }" },
    { source: "BTSelectorCompositeNode", target: "BTSequenceCombatNode", type: "direct_call", label: "Triggers Combat Sequence", packetPayload: "{ branch: 'AggressiveCombat' }" },
    { source: "BTSequenceCombatNode", target: "AINavMeshPathFollowerNode", type: "direct_call", label: "Commands Navigation Target", packetPayload: "{ dest: [45.2, 0.0, -18.7], speed: 4.5 }" }
  ]
};

/**
 * Dynamic Audio DSP & Spatial Foley Architecture Preset
 */
const AUDIO_DSP_PRESET: ArchitecturePreset = {
  id: "audio_dsp_foley",
  title: "Dynamic Audio DSP & Spatial Foley Pipeline",
  thaiTitle: "ระบบประมวลผลเสียง DSP และเสียง 3 มิติ (1 Node = 1 File)",
  category: "AUDIO",
  description: "Modular low-latency audio processing: PCM Buffer reader, Biquad filter node, 3D Reverb convolution, and Foley triggers.",
  thaiDescription: "สถาปัตยกรรมระบบเสียง: ตัวอ่านบัฟเฟอร์เสียง -> โหนดฟิลเตอร์ Biquad -> เสียงสะท้อน 3D Reverb -> ตัวจัดการ Foley",
  iconName: "Volume2",
  nodes: [
    {
      id: "AudioDSPBufferReaderNode",
      name: "AudioDSPBufferReaderNode.ts",
      path: "src/Audio/DSP/AudioDSPBufferReaderNode.ts",
      role: "AudioContext Raw PCM Stream Reader",
      system: "Audio Architecture",
      category: "AUDIO",
      type: "node_file",
      linesCount: 60,
      couplingFactor: 0.09,
      layer: 4,
      descriptionThai: "อ่านบัฟเฟอร์สัญญาณเสียง PCM แบบ Real-Time จาก Web Audio API / FMOD Engine",
      descriptionEng: "Decodes 48kHz Float32Array PCM stream and outputs time-domain samples.",
      inputs: ["AudioBufferSource", "PlaybackRate"],
      outputs: ["Float32ArrayChannelData", "SampleRate"],
      status: "Clean"
    },
    {
      id: "BiquadFilterModule",
      name: "BiquadFilterModule.ts",
      path: "src/Audio/DSP/BiquadFilterModule.ts",
      role: "Low-Pass & High-Pass Frequency EQ Filter",
      system: "Audio Architecture",
      category: "AUDIO",
      type: "module_file",
      linesCount: 75,
      couplingFactor: 0.06,
      layer: 2,
      descriptionThai: "คำนวณสมการ Biquad Filter ปรับย่านความถี่ (Low-Pass สำหรับเสียงใต้น้ำ / หลังกำแพง)",
      descriptionEng: "Pure mathematical second-order IIR filter for underwater muffling and wall occlusion.",
      inputs: ["RawAudioStream", "CutoffFrequencyHz", "ResonanceQ"],
      outputs: ["FilteredAudioSignal"],
      status: "Clean"
    },
    {
      id: "Spatial3DReverbCalculatorNode",
      name: "Spatial3DReverbCalculatorNode.ts",
      path: "src/Audio/Spatial/Spatial3DReverbCalculatorNode.ts",
      role: "3D Convolver Reverb & Distance Attenuation",
      system: "Audio Architecture",
      category: "AUDIO",
      type: "node_file",
      linesCount: 82,
      couplingFactor: 0.11,
      layer: 2,
      descriptionThai: "คำนวณระยะห่าง (Distance Attenuation) และ Convolution Reverb ตามขนาดห้อง",
      descriptionEng: "Calculates inverse-square distance rolloff and room acoustic impulse responses.",
      inputs: ["EmitterPosition3D", "ListenerPosition3D", "RoomVolumeM3"],
      outputs: ["WetDryMixRatio", "SpatialPannedBuffer"],
      status: "Clean"
    },
    {
      id: "AudioMixingStateRepository",
      name: "AudioMixingStateRepository.ts",
      path: "src/Audio/State/AudioMixingStateRepository.ts",
      role: "Master, SFX, Music & Ambient Mixer Bus Store",
      system: "Audio Architecture",
      category: "AUDIO",
      type: "state_contract",
      linesCount: 68,
      couplingFactor: 0.10,
      layer: 3,
      descriptionThai: "จัดเก็บระดับเสียง Master, SFX, Music, Voice พร้อมระบบ Ducking อัตโนมัติ",
      descriptionEng: "Manages audio channel volume matrices, dB attenuations, and voice ducking sidechains.",
      inputs: ["VolumeFaderValues", "DuckingTriggerSignal"],
      outputs: ["FinalMasterGainNodeState"],
      status: "Clean"
    },
    {
      id: "DynamicFoleyTriggerNode",
      name: "DynamicFoleyTriggerNode.ts",
      path: "src/Audio/Foley/DynamicFoleyTriggerNode.ts",
      role: "Footstep & Terrain Material Foley Trigger",
      system: "Audio Architecture",
      category: "AUDIO",
      type: "node_file",
      linesCount: 56,
      couplingFactor: 0.08,
      layer: 1,
      descriptionThai: "สุ่มเสียงก้าวเท้า (Footsteps) ตามพื้นผิวที่เหยียบ (หญ้า, ไม้, หิน, น้ำ, โคลน)",
      descriptionEng: "Selects and triggers randomized footstep and clothing foley variations based on ground raycast material.",
      inputs: ["SurfacePhysicalMaterialTag", "MovementPace"],
      outputs: ["FoleyPlaybackCommand"],
      status: "Clean"
    }
  ],
  links: [
    { source: "AudioDSPBufferReaderNode", target: "BiquadFilterModule", type: "pipeline_flow", label: "Pipes PCM Audio Stream", packetPayload: "48,000 samples/sec (Stereo)" },
    { source: "BiquadFilterModule", target: "Spatial3DReverbCalculatorNode", type: "pipeline_flow", label: "Applies 3D Space Acoustics", packetPayload: "{ cutoff: 8,400Hz, reverbRoom: 'cave_large' }" },
    { source: "Spatial3DReverbCalculatorNode", target: "AudioMixingStateRepository", type: "state_binding", label: "Routes to SFX Submix Bus", packetPayload: "{ bus: 'SFX', gainDb: -3.5dB }" },
    { source: "DynamicFoleyTriggerNode", target: "AudioDSPBufferReaderNode", type: "direct_call", label: "Triggers Footstep Sample", packetPayload: "{ asset: 'step_stone_03.wav' }" }
  ]
};

/**
 * Global Engine Nexus Preset (Macro Multi-System Architecture)
 */
const GLOBAL_ENGINE_NEXUS_PRESET: ArchitecturePreset = {
  id: "global_engine_nexus",
  title: "Full Game Engine Cross-System Architecture",
  thaiTitle: "แผนผังสถาปัตยกรรมระบบรวมของ Game Engine ทั้งหมด",
  category: "CORE",
  description: "Macro-level dependency topology connecting Core IDE, AI Engines, World Generation, Physics, Render Pipeline, Audio, and UI/UX Systems.",
  thaiDescription: "ความเชื่อมโยงระดับสถาปัตยกรรมระบบใหญ่ทั้งหมดในเอนจิน ตั้งแต่ Code IDE, AI, โลกและฟิสิกส์, กราฟิก, เสียง ไปจนถึง DevOps",
  iconName: "Layers",
  nodes: [
    {
      id: "EngineCoreEditor",
      name: "EngineCoreEditor.tsx",
      path: "src/components/EngineCoreEditor.tsx",
      role: "Central Engine Kernel & Event Loop Coordinator",
      system: "Core Kernel Architecture",
      category: "CORE",
      type: "system_hub",
      linesCount: 420,
      couplingFactor: 0.18,
      layer: 4,
      descriptionThai: "แกนกลางควบคุม Game Loop, DeltaTime, Memory Allocation และ Subsystem Lifecycle",
      descriptionEng: "Kernel orchestrating engine main loop, frame budget allocations, and subsystem initialization.",
      inputs: ["Hardware Signals", "Window Events"],
      outputs: ["EngineTickSignal", "FrameTimeProfilerData"],
      status: "Clean"
    },
    {
      id: "AICodeAgentStudio",
      name: "AICodeAgentStudio.tsx",
      path: "src/components/AICodeAgentStudio.tsx",
      role: "1 Node / 1 Module AST Decomposition Architect",
      system: "AI & Code Hub",
      category: "AI_CODE",
      type: "system_hub",
      linesCount: 310,
      couplingFactor: 0.12,
      layer: 2,
      descriptionThai: "ผู้ช่วย AI วิเคราะห์โค้ดและบังคับใช้สถาปัตยกรรมแยก 1 โหนด = 1 ไฟล์",
      descriptionEng: "Autonomous code generation engine enforcing strict 1 Node / 1 Module = 1 File architecture.",
      inputs: ["User Prompts", "Source AST"],
      outputs: ["ModularSourceFiles", "HeaderDocs"],
      status: "Clean"
    },
    {
      id: "AdvancedPhysicsEngine",
      name: "AdvancedPhysicsEngine.tsx",
      path: "src/components/AdvancedPhysicsEngine.tsx",
      role: "RigidBody, Cloth & Ragdoll Physics Solver",
      system: "Physics Hub",
      category: "PHYSICS",
      type: "system_hub",
      linesCount: 560,
      couplingFactor: 0.14,
      layer: 4,
      descriptionThai: "เอนจินจำลองฟิสิกส์ การชน การสะท้อน และ Active Ragdoll",
      descriptionEng: "Multi-threaded physics simulator running sub-stepped constraint solvers.",
      inputs: ["ColliderMeshes", "ForceVectors"],
      outputs: ["RigidBodyTransforms", "ContactManifolds"],
      status: "Clean"
    },
    {
      id: "GraphicsRenderEditor",
      name: "GraphicsRenderEditor.tsx",
      path: "src/components/GraphicsRenderEditor.tsx",
      role: "Forward+ / Deferred PBR Rasterizer & Raytracer",
      system: "Rendering Hub",
      category: "RENDERING",
      type: "system_hub",
      linesCount: 680,
      couplingFactor: 0.15,
      layer: 4,
      descriptionThai: "ไปป์ไลน์เรนเดอร์กราฟิก PBR, Global Illumination และ Post-Processing",
      descriptionEng: "GPU render graph orchestrating G-Buffer passes, shadow cascades, and bloom filters.",
      inputs: ["SceneMeshDrawCalls", "LightSources"],
      outputs: ["FramebufferRT", "PostProcessedScreen"],
      status: "Clean"
    },
    {
      id: "OfflineGameAudioStudio",
      name: "OfflineGameAudioStudio.tsx",
      path: "src/components/OfflineGameAudioStudio.tsx",
      role: "Offline Dynamic Audio DSP & Mixing Console",
      system: "Audio Hub",
      category: "AUDIO",
      type: "system_hub",
      linesCount: 480,
      couplingFactor: 0.09,
      layer: 4,
      descriptionThai: "สตูดิโอเสียงออฟไลน์ 100% สังเคราะห์เสียงและจำลองมิติเสียง 3D",
      descriptionEng: "Zero-dependency client-side audio DSP synthesizer and spatial mixer.",
      inputs: ["AudioTriggers", "FoleyRequests"],
      outputs: ["HardwareAudioStream"],
      status: "Clean"
    },
    {
      id: "MapEdit",
      name: "MapEdit.tsx",
      path: "src/components/MapEdit.tsx",
      role: "World Terrain & Level Editor",
      system: "World Building Hub",
      category: "WORLD",
      type: "system_hub",
      linesCount: 520,
      couplingFactor: 0.13,
      layer: 2,
      descriptionThai: "สร้างและแก้ไขแผนที่ ภูมิประเทศ Procedural Foliage และสภาพอากาศ",
      descriptionEng: "Voxel terrain sculpting, procedural biome painter, and octree scene partitioner.",
      inputs: ["TerrainBrushInputs", "PCGSeeds"],
      outputs: ["HeightmapTextures", "PlacedEntityInstances"],
      status: "Clean"
    },
    {
      id: "UIUXEditor",
      name: "UIUXEditor.tsx",
      path: "src/components/UIUXEditor.tsx",
      role: "Visual UI Canvas & MVVM Data Binding Editor",
      system: "UI/UX Hub",
      category: "UI_DATA",
      type: "system_hub",
      linesCount: 390,
      couplingFactor: 0.10,
      layer: 1,
      descriptionThai: "ออกแบบหน้าจอ UI, HUD, เมนู และผูกข้อมูลกับ State แบบ MVVM",
      descriptionEng: "Visual vector canvas for in-game HUDs, dialogue boxes, and responsive layouts.",
      inputs: ["UIWidgetTrees", "ThemePalettes"],
      outputs: ["CompiledUIHierarchy", "DataBindingResolvers"],
      status: "Clean"
    },
    {
      id: "BuildPublishAudit",
      name: "BuildPublishAudit.tsx",
      path: "src/components/BuildPublishAudit.tsx",
      role: "Pre-Flight Architecture & Packaging Auditor",
      system: "DevOps Hub",
      category: "DEVOPS",
      type: "system_hub",
      linesCount: 340,
      couplingFactor: 0.08,
      layer: 1,
      descriptionThai: "ตรวจสอบความสะอาดของโค้ด สถาปัตยกรรม และเตรียมแพ็กเกจส่งออก",
      descriptionEng: "Audits asset bundles, validates 1-node modularity rules, and packs production binaries.",
      inputs: ["BuildTargetPlatform", "AssetManifests"],
      outputs: ["AuditReportVerdict", "ReleasePackageArtifacts"],
      status: "Clean"
    }
  ],
  links: [
    { source: "EngineCoreEditor", target: "AdvancedPhysicsEngine", type: "pipeline_flow", label: "Ticks Physics FixedStep", packetPayload: "FixedUpdate (60Hz / 16.6ms)" },
    { source: "EngineCoreEditor", target: "GraphicsRenderEditor", type: "pipeline_flow", label: "Dispatches Render Graph", packetPayload: "DrawScene (144Hz / 6.94ms)" },
    { source: "EngineCoreEditor", target: "OfflineGameAudioStudio", type: "pipeline_flow", label: "Syncs Audio DSP Clock", packetPayload: "DSP Audio Frames" },
    { source: "MapEdit", target: "GraphicsRenderEditor", type: "direct_call", label: "Pushes Mesh Chunks", packetPayload: "LOD0-LOD3 Chunks" },
    { source: "MapEdit", target: "AdvancedPhysicsEngine", type: "direct_call", label: "Bakes Heightmap Colliders", packetPayload: "Static Mesh BVH Tree" },
    { source: "AICodeAgentStudio", target: "EngineCoreEditor", type: "direct_call", label: "Compiles Modular Code", packetPayload: "Strict 1-Node AST Modules" },
    { source: "UIUXEditor", target: "GraphicsRenderEditor", type: "pipeline_flow", label: "Renders HUD Overlay", packetPayload: "SDF Vector Text & Sprites" },
    { source: "BuildPublishAudit", target: "AICodeAgentStudio", type: "direct_call", label: "Verifies 1-Module Rules", packetPayload: "Modularity Index 96/100" }
  ]
};

export const SYSTEM_PRESETS: Record<string, ArchitecturePreset> = {
  combat_pipeline: COMBAT_SYSTEM_PRESET,
  player_movement: PLAYER_MOVEMENT_PRESET,
  ai_behavior_tree: AI_BEHAVIOR_PRESET,
  audio_dsp_foley: AUDIO_DSP_PRESET,
  global_engine_nexus: GLOBAL_ENGINE_NEXUS_PRESET
};

export const ALL_PRESETS_LIST = Object.values(SYSTEM_PRESETS);

/**
 * คำนวณผลกระทบเมื่อมีการแก้ไขไฟล์ (Blast Radius Impact Calculation)
 * @param nodes รายการโหนดทั้งหมด
 * @param links รายการเส้นเชื่อมโยง
 * @param targetNodeId รหัสโหนดที่ถูกแก้ไข
 * @returns รายการโหนดที่ได้รับผลกระทบโดยตรงและโดยอ้อม
 */
export function calculateBlastRadius(
  nodes: DependencyNode[],
  links: DependencyLink[],
  targetNodeId: string
): {
  targetNode: DependencyNode | undefined;
  directConsumers: DependencyNode[];
  indirectConsumers: DependencyNode[];
  upstreamDependencies: DependencyNode[];
  impactScore: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
} {
  const targetNode = nodes.find(n => n.id === targetNodeId || n.name === targetNodeId);
  if (!targetNode) {
    return {
      targetNode: undefined,
      directConsumers: [],
      indirectConsumers: [],
      upstreamDependencies: [],
      impactScore: 0,
      riskLevel: 'LOW'
    };
  }

  // Upstream dependencies (โหนดที่ targetNode ต้องพึ่งพา / import)
  const upstreamIds = new Set<string>();
  links.forEach(link => {
    if (link.source === targetNode.id) {
      upstreamIds.add(link.target);
    }
  });

  // Direct downstream consumers (โหนดที่พึ่งพา targetNode โดยตรง)
  const directConsumerIds = new Set<string>();
  links.forEach(link => {
    if (link.target === targetNode.id) {
      directConsumerIds.add(link.source);
    }
  });

  // Indirect downstream consumers (โหนดที่พึ่งพาแบบลูกโซ่)
  const indirectConsumerIds = new Set<string>();
  const queue = Array.from(directConsumerIds);
  const visited = new Set<string>([targetNode.id, ...directConsumerIds]);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    links.forEach(link => {
      if (link.target === currentId && !visited.has(link.source)) {
        visited.add(link.source);
        indirectConsumerIds.add(link.source);
        queue.push(link.source);
      }
    });
  }

  const directConsumers = nodes.filter(n => directConsumerIds.has(n.id));
  const indirectConsumers = nodes.filter(n => indirectConsumerIds.has(n.id));
  const upstreamDependencies = nodes.filter(n => upstreamIds.has(n.id));

  const totalAffected = directConsumers.length + (indirectConsumers.length * 0.5);
  const impactScore = Math.min(100, Math.round((totalAffected / Math.max(1, nodes.length)) * 100) + (targetNode.couplingFactor * 30));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (impactScore > 65) riskLevel = 'CRITICAL';
  else if (impactScore > 40) riskLevel = 'HIGH';
  else if (impactScore > 15) riskLevel = 'MEDIUM';

  return {
    targetNode,
    directConsumers,
    indirectConsumers,
    upstreamDependencies,
    impactScore,
    riskLevel
  };
}

/**
 * ตรวจสอบความถูกต้องของโครงสร้าง DAG (Directed Acyclic Graph)
 * ตรวจสอบว่าไม่มี Circular Dependency ในระบบ
 */
export function validateDAG(nodes: DependencyNode[], links: DependencyLink[]): {
  isAcyclic: boolean;
  cyclesDetected: string[][];
  maxDepth: number;
} {
  const adj = new Map<string, string[]>();
  nodes.forEach(n => adj.set(n.id, []));
  links.forEach(l => {
    if (adj.has(l.source)) {
      adj.get(l.source)!.push(l.target);
    }
  });

  const visited = new Map<string, number>(); // 0: unvisited, 1: visiting, 2: visited
  nodes.forEach(n => visited.set(n.id, 0));

  const cycles: string[][] = [];
  let maxDepth = 0;

  function dfs(u: string, path: string[]): void {
    visited.set(u, 1);
    path.push(u);
    maxDepth = Math.max(maxDepth, path.length);

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      if (visited.get(v) === 1) {
        // Cycle found
        const cycleStartIndex = path.indexOf(v);
        if (cycleStartIndex !== -1) {
          cycles.push([...path.slice(cycleStartIndex), v]);
        }
      } else if (visited.get(v) === 0) {
        dfs(v, [...path]);
      }
    }

    visited.set(u, 2);
  }

  nodes.forEach(n => {
    if (visited.get(n.id) === 0) {
      dfs(n.id, []);
    }
  });

  return {
    isAcyclic: cycles.length === 0,
    cyclesDetected: cycles,
    maxDepth
  };
}
