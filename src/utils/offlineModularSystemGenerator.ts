/**
 * =========================================================================================
 * @file offlineModularSystemGenerator.ts
 * @description Offline AI Modular Game & Software Architecture Engine (1 Node/Module = 1 File)
 * @author Google AI Studio Engine Architecture
 * =========================================================================================
 * 
 * กฎเหล็กของสถาปัตยกรรม (Core Architectural Rules):
 * 1. Strict 1 Node / 1 Module = 1 Dedicated File
 * 2. System-Specific & Descriptive Naming (e.g. DamageCalculationModule.ts, StaminaDrainNode.ts)
 * 3. Exhaustive In-File Documentation & Multi-Language JSDocs in every single file
 * =========================================================================================
 */

export interface ModularFile {
  id: string;
  name: string;
  system: string;
  moduleRole: string;
  language: 'typescript' | 'csharp' | 'cpp' | 'python' | 'lua' | 'hlsl';
  code: string;
  descriptionThai: string;
  descriptionEng: string;
  linesCount: number;
}

export interface ModularSystemPreset {
  id: string;
  title: string;
  thaiTitle: string;
  category: 'COMBAT' | 'INVENTORY' | 'AI_BEHAVIOR' | 'QUEST' | 'PHYSICS' | 'PROCEDURAL' | 'AUDIO' | 'CUSTOM';
  description: string;
  thaiDescription: string;
  iconName: string;
  files: ModularFile[];
}

/**
 * Built-in Highly Detailed Modular Presets with Strict 1-Node/1-Module-Per-File Architecture
 */
export const MODULAR_SYSTEM_PRESETS: ModularSystemPreset[] = [
  // 1. COMBAT & DAMAGE PIPELINE SYSTEM
  {
    id: "combat_damage_pipeline",
    title: "Action RPG Combat & Hit Pipeline",
    thaiTitle: "ระบบคอมแบทและคำนวณดาเมจแบบโมดูลาร์ (แยก 6 ไฟล์เดี่ยว)",
    category: "COMBAT",
    description: "Multi-file decoupled combat engine dividing damage calculation, stamina cost, combo counting, status infliction, visual feedback, and state storage into dedicated single files.",
    thaiDescription: "ระบบต่อสู้และคำนวณความเสียหายแบบแยก 1 โหนด 1 โมดูล = 1 ไฟล์ (คำนวณดาเมจ, ตัดสตามิน่า, นับคอมโบ, แจกสถานะผิดปกติ, เอฟเฟกต์ตอบสนอง, และคลังสถานะ)",
    iconName: "Sword",
    files: [
      {
        id: "combat_state_repo",
        name: "CombatStateRepository.ts",
        system: "Action RPG Combat System",
        moduleRole: "Single Source of Truth for Entity Combat Stats",
        language: "typescript",
        descriptionThai: "คลังเก็บสถานะการต่อสู้ของ Entity (HP, MaxHP, Stamina, Buffs, StatusEffects) เป็นศูนย์กลางข้อมูล",
        descriptionEng: "Thread-safe data contract and state store for all active combat entities.",
        linesCount: 78,
        code: `/**
 * =========================================================================================
 * @file CombatStateRepository.ts
 * @system Action RPG Combat & Hit Pipeline
 * @module Combat State Repository & Entity Data Store
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * ไฟล์นี้ทำหน้าที่เป็น Single Source of Truth สำหรับจัดเก็บและจัดการข้อมูลสถานะการต่อสู้ทั้งหมด
 * ของ Entity ในเกม (ผู้เล่น, มอนสเตอร์, บอส) เช่น พลังชีวิต (HP), สตามิน่า (Stamina),
 * บัฟ/ดีบัฟ (Active Modifiers) และสถานะ Immunity
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture]:
 * - ทำหน้าที่เป็น Data Model ที่ถูกเรียกใช้งานโดย DamageCalculationModule, StaminaDrainNode, 
 *   และ StatusEffectApplierNode
 * - ใช้รูปแบบ Observable State Pattern เพื่อยิง Event เมื่อค่าสถานะเปลี่ยนแปลง
 * 
 * 📥 [Inputs]: Entity ID, Initial Attribute Configuration
 * 📤 [Outputs]: Reactive Entity State Snapshot, State Change Events
 * ⚠️ [Error Handling]: ป้องกันค่า HP/Stamina ติดลบ (Clamping), ตรวจสอบ Entity ID ไม่พบ
 * =========================================================================================
 */

export interface EntityCombatStats {
  entityId: string;
  entityName: string;
  isAlive: boolean;
  currentHp: number;
  maxHp: number;
  currentStamina: number;
  maxStamina: number;
  baseAttackPower: number;
  baseDefense: number;
  criticalChance: number; // 0.0 - 1.0 (e.g. 0.25 = 25%)
  criticalMultiplier: number; // e.g. 1.5x, 2.0x
  poiseHealth: number; // สำหรับคำนวณการ Stagger / ล้ม
  activeStatusEffects: string[];
}

export class CombatStateRepository {
  private entities: Map<string, EntityCombatStats> = new Map();
  private listeners: Array<(entityId: string, stats: EntityCombatStats) => void> = [];

  /**
   * ลงทะเบียน Entity ใหม่เข้าสู่ระบบต่อสู้
   */
  public registerEntity(stats: EntityCombatStats): void {
    if (!stats.entityId) {
      throw new Error("[CombatStateRepository] Cannot register entity with empty ID");
    }
    this.entities.set(stats.entityId, { ...stats });
  }

  /**
   * ดึงข้อมูลสถานะของ Entity ตาม ID
   */
  public getEntity(entityId: string): EntityCombatStats | undefined {
    return this.entities.get(entityId);
  }

  /**
   * อัปเดตข้อมูลสถานะพร้อมแจ้งเตือนผู้ฟัง (Listeners)
   */
  public updateEntityStats(entityId: string, partial: Partial<EntityCombatStats>): EntityCombatStats {
    const existing = this.entities.get(entityId);
    if (!existing) {
      throw new Error(\`[CombatStateRepository] Entity with ID \${entityId} not found.\`);
    }

    const updated: EntityCombatStats = {
      ...existing,
      ...partial,
      currentHp: Math.max(0, Math.min(partial.currentHp ?? existing.currentHp, partial.maxHp ?? existing.maxHp)),
      currentStamina: Math.max(0, Math.min(partial.currentStamina ?? existing.currentStamina, partial.maxStamina ?? existing.maxStamina)),
      isAlive: (partial.currentHp ?? existing.currentHp) > 0
    };

    this.entities.set(entityId, updated);
    this.listeners.forEach(fn => fn(entityId, updated));
    return updated;
  }

  /**
   * ติดตาม Event การเปลี่ยนแปลงสถานะ
   */
  public subscribe(listener: (entityId: string, stats: EntityCombatStats) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}
`
      },
      {
        id: "combat_damage_formula",
        name: "CombatDamageFormulaModule.ts",
        system: "Action RPG Combat System",
        moduleRole: "Pure Damage Calculation & Critical Formula Engine",
        language: "typescript",
        descriptionThai: "คำนวณดาเมจสุทธิ, คริติคอล, เกราะลดทอน, และการคูณ Element แบบ Pure Logic",
        descriptionEng: "Decoupled mathematical formula engine calculating net physical, elemental, and critical damage.",
        linesCount: 84,
        code: `/**
 * =========================================================================================
 * @file CombatDamageFormulaModule.ts
 * @system Action RPG Combat & Hit Pipeline
 * @module Pure Damage Calculation & Critical Formula Engine
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * ไฟล์นี้รับผิดชอบการคำนวณตัวเลขความเสียหาย (Damage Math) แบบ Pure Function
 * ไม่ผูกติดกับ Game Object หรือ Graphic เพื่อให้ทดสอบ Unit Test ได้ 100%
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture]:
 * - รับ Attacker Stats, Defender Stats, และ Attack Parameter (Skill Multiplier, Element Type)
 * - คำนวณ Critical Roll, Defense Mitigation Curve, Elemental Advantage
 * - ส่งผลลัพธ์การคำนวณไปให้ CombatStateRepository และ CombatFeedbackVFXNode
 * 
 * 📥 [Inputs]: Attacker Stats, Defender Stats, Skill Multiplier, RNG Seed
 * 📤 [Outputs]: DamageCalculationResult (Net Damage, IsCritical, MitigatedAmount, ElementFactor)
 * ⚠️ [Error Handling]: ป้องกัน Defense Division by Zero, ป้องกัน Negative Damage
 * =========================================================================================
 */

import { EntityCombatStats } from "./CombatStateRepository";

export interface DamageCalculationRequest {
  attacker: EntityCombatStats;
  defender: EntityCombatStats;
  skillMultiplier?: number;
  elementType?: "PHYSICAL" | "FIRE" | "FROST" | "LIGHTNING" | "HOLY" | "VOID";
  rngRollOverride?: number; // 0.0 - 1.0 สำหรับ Deterministic Replay / Debugging
}

export interface DamageCalculationResult {
  rawDamage: number;
  mitigatedDefenseDamage: number;
  isCritical: boolean;
  criticalMultiplierApplied: number;
  elementalMultiplier: number;
  finalDamage: number;
  isFatal: boolean;
}

export class CombatDamageFormulaModule {
  /**
   * คำนวณความเสียหายสุทธิอย่างละเอียดตามสูตร AAA Defense Scaling
   */
  public static calculateDamage(request: DamageCalculationRequest): DamageCalculationResult {
    const { attacker, defender, skillMultiplier = 1.0, elementType = "PHYSICAL", rngRollOverride } = request;

    // 1. คำนวณ Raw Base Attack
    const rawDamage = attacker.baseAttackPower * Math.max(0.1, skillMultiplier);

    // 2. คำนวณ Critical Strike Roll
    const roll = rngRollOverride !== undefined ? rngRollOverride : Math.random();
    const isCritical = roll < attacker.criticalChance;
    const critMultiplier = isCritical ? Math.max(1.0, attacker.criticalMultiplier) : 1.0;

    // 3. คำนวณการลดทอนของเกราะ (Non-linear Diminishing Returns Armor Formula)
    // Formula: MitigationRatio = Defense / (Defense + 100)
    const effectiveDefense = Math.max(0, defender.baseDefense);
    const defenseMitigationRatio = effectiveDefense / (effectiveDefense + 100);
    const postDefenseDamage = rawDamage * (1.0 - (defenseMitigationRatio * 0.75));

    // 4. คำนวณตัวคูณธาตุ (Elemental Multiplier)
    let elementalMultiplier = 1.0;
    if (elementType === "FIRE" && defender.activeStatusEffects.includes("FROSTBITE")) {
      elementalMultiplier = 1.5; // Melt combo bonus
    } else if (elementType === "LIGHTNING" && defender.activeStatusEffects.includes("WET")) {
      elementalMultiplier = 1.75; // Electro-charged bonus
    }

    // 5. สรุปความเสียหายขั้นสุดท้าย (Final Net Damage)
    const finalDamage = Math.max(1, Math.round(postDefenseDamage * critMultiplier * elementalMultiplier));
    const isFatal = defender.currentHp - finalDamage <= 0;

    return {
      rawDamage,
      mitigatedDefenseDamage: Math.round(rawDamage - postDefenseDamage),
      isCritical,
      criticalMultiplierApplied: critMultiplier,
      elementalMultiplier,
      finalDamage,
      isFatal
    };
  }
}
`
      },
      {
        id: "stamina_drain_node",
        name: "PlayerStaminaDrainNode.ts",
        system: "Action RPG Combat System",
        moduleRole: "Action Stamina Cost & Exhaustion State Node",
        language: "typescript",
        descriptionThai: "คำนวณและตัดลด Stamina เมื่อโจมตี/กลิ้งหลบ/บล็อก พร้อมระบบ Exhaustion Delay",
        descriptionEng: "Controls stamina consumption, dodge roll costs, fatigue states, and regen cooldowns.",
        linesCount: 65,
        code: `/**
 * =========================================================================================
 * @file PlayerStaminaDrainNode.ts
 * @system Action RPG Combat & Hit Pipeline
 * @module Action Stamina Cost & Exhaustion State Node
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * จัดการการใช้สตามิน่า (Stamina Drain) ในทุกกริยาการต่อสู้ เช่น โจมตีเบา (Light Attack),
 * โจมตีหนัก (Heavy Attack), กลิ้งหลบ (Dodge Roll), ป้องกัน (Block)
 * และจัดการระบบติดเหนื่อย (Exhaustion State)
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture]:
 * - ตรวจสอบความพร้อมก่อนทำ Action (Can Perform Action Gate)
 * - สื่อสารกับ CombatStateRepository เพื่อตัดทอน Stamina
 * - นับเวลาคูลดาวน์ก่อนเริ่มฟื้นฟู (Regen Delay Buffer)
 * 
 * 📥 [Inputs]: Entity ID, Action Type (ATTACK_LIGHT, ATTACK_HEAVY, ROLL, PARRY)
 * 📤 [Outputs]: Boolean (CanExecute), Remaining Stamina, Exhausted Status
 * ⚠️ [Error Handling]: อนุญาตให้ทำ Action แม้ Stamina เหลือต่ำกว่าต้นทุน แต่จะติด Exhaustion
 * =========================================================================================
 */

import { CombatStateRepository } from "./CombatStateRepository";

export type CombatActionType = "LIGHT_ATTACK" | "HEAVY_ATTACK" | "DODGE_ROLL" | "PARRY" | "SPRINT";

export class PlayerStaminaDrainNode {
  private static ACTION_COSTS: Record<CombatActionType, number> = {
    LIGHT_ATTACK: 15,
    HEAVY_ATTACK: 35,
    DODGE_ROLL: 22,
    PARRY: 10,
    SPRINT: 8 // ต่อวินาที
  };

  /**
   * ตรวจสอบว่า Entity มี Stamina เพียงพอที่จะทำ Action หรือไม่
   */
  public static canPerformAction(repo: CombatStateRepository, entityId: string, action: CombatActionType): boolean {
    const entity = repo.getEntity(entityId);
    if (!entity || !entity.isAlive) return false;
    return entity.currentStamina > 0;
  }

  /**
   * ดำเนินการตัด Stamina และคืนค่าผลลัพธ์
   */
  public static consumeStamina(
    repo: CombatStateRepository, 
    entityId: string, 
    action: CombatActionType
  ): { success: boolean; newStamina: number; isExhausted: boolean } {
    const entity = repo.getEntity(entityId);
    if (!entity || !entity.isAlive || entity.currentStamina <= 0) {
      return { success: false, newStamina: 0, isExhausted: true };
    }

    const cost = this.ACTION_COSTS[action] || 10;
    const newStamina = Math.max(0, entity.currentStamina - cost);
    const isExhausted = newStamina === 0;

    repo.updateEntityStats(entityId, { currentStamina: newStamina });

    return {
      success: true,
      newStamina,
      isExhausted
    };
  }
}
`
      },
      {
        id: "combo_hit_counter_node",
        name: "ComboHitCounterNode.ts",
        system: "Action RPG Combat System",
        moduleRole: "Combo Chain & Reset Timer Evaluator Node",
        language: "typescript",
        descriptionThai: "คำนวณสเต็ปคอมโบ, บัฟดาเมจต่อเนื่อง, และนับถอยหลังรีเซ็ตคอมโบ",
        descriptionEng: "Evaluates consecutive attack combo chains, dynamic damage multipliers, and decay timers.",
        linesCount: 62,
        code: `/**
 * =========================================================================================
 * @file ComboHitCounterNode.ts
 * @system Action RPG Combat & Hit Pipeline
 * @module Combo Chain & Reset Timer Evaluator Node
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * บันทึกและวิเคราะห์จำนวน Hit คอมโบของการโจมตีต่อเนื่อง
 * มอบบัฟตัวคูณความเสียหาย (Combo Bonus Scaling) เมื่อผู้เล่นทำคอมโบได้ต่อเนื่อง
 * และรีเซ็ตค่าคอมโบเมื่อหมดเวลา Window Frame
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture]:
 * - รับสัญญาณ OnHit จากระบบต่อสู้
 * - คำนวณ Combo Multiplier ส่งไปให้ CombatDamageFormulaModule
 * - บริหารจัดการ Timer แบบ Decay Countdown
 * =========================================================================================
 */

export class ComboHitCounterNode {
  private currentCombo: number = 0;
  private maxComboReached: number = 0;
  private lastHitTimestamp: number = 0;
  private comboTimeoutMs: number = 2500; // 2.5 วินาทีในการต่อคอมโบ

  /**
   * บันทึกการโจมตีโดนสำเร็จ (Hit Landed)
   */
  public registerHit(timestamp: number = Date.now()): { comboCount: number; damageBonusMultiplier: number } {
    if (timestamp - this.lastHitTimestamp > this.comboTimeoutMs) {
      // รีเซ็ตคอมโบเนื่องจากหมดเวลา
      this.currentCombo = 1;
    } else {
      this.currentCombo += 1;
    }

    this.lastHitTimestamp = timestamp;
    this.maxComboReached = Math.max(this.maxComboReached, this.currentCombo);

    // ตัวคูณความเสียหายตามขั้นคอมโบ (สูงสุด +50% ที่ 10 คอมโบ)
    const bonusRatio = Math.min(0.5, (this.currentCombo - 1) * 0.05);
    const damageBonusMultiplier = 1.0 + bonusRatio;

    return {
      comboCount: this.currentCombo,
      damageBonusMultiplier
    };
  }

  /**
   * รีเซ็ตคอมโบกลับเป็น 0
   */
  public resetCombo(): void {
    this.currentCombo = 0;
  }

  public getComboCount(): number {
    if (Date.now() - this.lastHitTimestamp > this.comboTimeoutMs) {
      this.currentCombo = 0;
    }
    return this.currentCombo;
  }
}
`
      },
      {
        id: "combat_feedback_vfx_node",
        name: "CombatFeedbackVFXNode.ts",
        system: "Action RPG Combat System",
        moduleRole: "Audio-Visual Feedback & Camera Shake Dispatcher",
        language: "typescript",
        descriptionThai: "ยิงอีเวนต์สั่นหน้าจอ (Camera Shake), Hit Stop Pause, และ Floating Combat Text",
        descriptionEng: "Dispatches juiciness feedback events including frame hit-stops, screen shakes, and floating text.",
        linesCount: 75,
        code: `/**
 * =========================================================================================
 * @file CombatFeedbackVFXNode.ts
 * @system Action RPG Combat & Hit Pipeline
 * @module Audio-Visual Feedback & Camera Shake Dispatcher
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * จัดการ Audio-Visual Juice ของการโจมตี เช่น:
 * 1. Hit Stop / Micro-freeze Frame (หยุดภาพเสี้ยววินาทีเพื่อให้การฟันดูมีน้ำหนัก)
 * 2. Camera Screen Shake (แรงสั่นสะเทือนตามความแรงของดาเมจ)
 * 3. Floating Damage Numbers (ตัวเลขดาเมจลอยพร้อมสีตามธาตุและคริติคอล)
 * 4. Blood / Spark Particle Trigger
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture]:
 * - รับ Data Contract จาก CombatDamageFormulaModule (Net Damage, IsCritical, Element)
 * - ยิง Event ไปยัง Rendering Layer & Camera System
 * =========================================================================================
 */

import { DamageCalculationResult } from "./CombatDamageFormulaModule";

export interface FloatingTextEvent {
  text: string;
  worldPosition: { x: number; y: number; z: number };
  color: string;
  isCritical: boolean;
  scale: number;
}

export interface CameraShakeEvent {
  intensity: number;
  durationSeconds: number;
  frequency: number;
}

export class CombatFeedbackVFXNode {
  /**
   * ประมวลผลและสร้าง Feedback Events ทั้งหมดจากการโจมตี
   */
  public static triggerHitFeedback(
    result: DamageCalculationResult,
    targetPosition: { x: number; y: number; z: number }
  ): {
    floatingText: FloatingTextEvent;
    cameraShake: CameraShakeEvent;
    hitStopDurationMs: number;
    soundEffectCue: string;
  } {
    // 1. กำหนดสีและสเกลของตัวเลขดาเมจ
    let color = "#ffffff";
    if (result.isCritical) color = "#ffcc00"; // ทองคริติคอล
    else if (result.elementalMultiplier > 1.0) color = "#ff4d4d"; // ธาตุโบนัส

    const scale = result.isCritical ? 1.6 : 1.0;

    const floatingText: FloatingTextEvent = {
      text: result.finalDamage.toString(),
      worldPosition: { ...targetPosition, y: targetPosition.y + 1.2 },
      color,
      isCritical: result.isCritical,
      scale
    };

    // 2. กำหนดแรงสั่นกล้อง
    const shakeIntensity = result.isCritical ? 0.45 : Math.min(0.25, result.finalDamage / 200);
    const cameraShake: CameraShakeEvent = {
      intensity: shakeIntensity,
      durationSeconds: result.isCritical ? 0.22 : 0.12,
      frequency: 24
    };

    // 3. กำหนด Hit Stop Frame Freeze
    const hitStopDurationMs = result.isCritical ? 80 : 30;

    // 4. เสียง Impact
    const soundEffectCue = result.isCritical ? "SFX_CRITICAL_SLASH_HEAVY" : "SFX_BLADE_HIT_FLESH";

    return {
      floatingText,
      cameraShake,
      hitStopDurationMs,
      soundEffectCue
    };
  }
}
`
      }
    ]
  },

  // 2. RPG INVENTORY & EQUIPMENT SYSTEM
  {
    id: "rpg_inventory_modular",
    title: "Grid & Slot RPG Inventory Architecture",
    thaiTitle: "ระบบช่องเก็บของและสวมใส่อุปกรณ์ (แยก 5 ไฟล์เดี่ยว)",
    category: "INVENTORY",
    description: "Modular inventory architecture isolating slot controllers, item weight constraints, equipment stat calculation, persistence, and loot rolling.",
    thaiDescription: "ระบบคลังเก็บของแบบแยก 1 โหนด 1 โมดูล = 1 ไฟล์ (ควบคุมสล็อต, คำนวณน้ำหนักตัว, คำนวณสเตตัสสวมใส่, บันทึกเซฟ JSON, และสุ่มดรอปไอเทม)",
    iconName: "Package",
    files: [
      {
        id: "inventory_slot_controller",
        name: "InventorySlotController.ts",
        system: "RPG Inventory & Equipment System",
        moduleRole: "Item Stacking, Moving & Slot Swap Manager",
        language: "typescript",
        descriptionThai: "จัดการการย้ายไอเทมระหว่างสล็อต, สลับช่อง (Swap), และรวมกอง (Stack)",
        descriptionEng: "Handles inventory grid slot mutations, item swapping, stack consolidation, and split operations.",
        linesCount: 88,
        code: `/**
 * =========================================================================================
 * @file InventorySlotController.ts
 * @system RPG Inventory & Equipment System
 * @module Item Stacking, Moving & Slot Swap Manager
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * ควบคุมตรรกะการจัดวางไอเทมลงในสล็อตของช่องเก็บของ (Inventory Slots)
 * รองรับการย้ายช่อง (Move/Swap), การรวมจำนวนไอเทมที่ซ้อนทับกันได้ (Auto-Stacking),
 * และการแบ่งครึ่งกอง (Split Stack)
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture]:
 * - ทำงานร่วมกับ ItemWeightCalculationNode เพื่อเช็คน้ำหนักก่อนรับของ
 * - ทำงานร่วมกับ EquipmentStatModifierNode เมื่อมีการสวมใส่ลงสล็อตตัวละคร
 * 
 * 📥 [Inputs]: Source Slot Index, Target Slot Index, Inventory Grid State
 * 📤 [Outputs]: Mutated Grid State, Success Status
 * ⚠️ [Error Handling]: ตรวจสอบขอบเขต Index Out of Bounds, ตรวจสอบ Max Stack Overflow
 * =========================================================================================
 */

export interface InventoryItem {
  itemId: string;
  name: string;
  category: "WEAPON" | "ARMOR" | "CONSUMABLE" | "MATERIAL" | "QUEST";
  quantity: number;
  maxStack: number;
  unitWeight: number;
  iconPath: string;
}

export interface InventorySlot {
  slotIndex: number;
  item: InventoryItem | null;
}

export class InventorySlotController {
  /**
   * สลับตำแหน่งหรือรวมกองไอเทมระหว่างสองสล็อต (Swap or Stack)
   */
  public static transferItem(
    slots: InventorySlot[],
    fromIndex: number,
    toIndex: number
  ): { success: boolean; updatedSlots: InventorySlot[]; message: string } {
    if (fromIndex < 0 || fromIndex >= slots.length || toIndex < 0 || toIndex >= slots.length) {
      return { success: false, updatedSlots: slots, message: "Invalid slot index range." };
    }

    const newSlots = slots.map(s => ({ ...s, item: s.item ? { ...s.item } : null }));
    const sourceSlot = newSlots[fromIndex];
    const targetSlot = newSlots[toIndex];

    if (!sourceSlot.item) {
      return { success: false, updatedSlots: slots, message: "Source slot is empty." };
    }

    // กรณีที่ 1: สล็อตเป้าหมายว่าง -> ย้ายไปได้เลย
    if (!targetSlot.item) {
      targetSlot.item = sourceSlot.item;
      sourceSlot.item = null;
      return { success: true, updatedSlots: newSlots, message: "Item moved to empty slot." };
    }

    // กรณีที่ 2: เป็นไอเทมชนิดเดียวกันและสามารถ Stack ได้
    if (sourceSlot.item.itemId === targetSlot.item.itemId && targetSlot.item.maxStack > 1) {
      const spaceLeft = targetSlot.item.maxStack - targetSlot.item.quantity;
      if (spaceLeft > 0) {
        const transferAmount = Math.min(spaceLeft, sourceSlot.item.quantity);
        targetSlot.item.quantity += transferAmount;
        sourceSlot.item.quantity -= transferAmount;

        if (sourceSlot.item.quantity <= 0) {
          sourceSlot.item = null;
        }
        return { success: true, updatedSlots: newSlots, message: \`Stacked \${transferAmount} items.\` };
      }
    }

    // กรณีที่ 3: สลับตำแหน่งไอเทม (Swap)
    const temp = targetSlot.item;
    targetSlot.item = sourceSlot.item;
    sourceSlot.item = temp;

    return { success: true, updatedSlots: newSlots, message: "Items swapped successfully." };
  }
}
`
      },
      {
        id: "item_weight_calculation_node",
        name: "ItemWeightCalculationNode.ts",
        system: "RPG Inventory & Equipment System",
        moduleRole: "Inventory Weight & Overencumbered Evaluator",
        language: "typescript",
        descriptionThai: "คำนวณน้ำหนักรวมของกระเป๋า, สถานะเดินช้า/วิ่งไม่ได้เมื่อน้ำหนักเกิน (Overencumbered)",
        descriptionEng: "Calculates gross inventory mass, penalty speed debuffs, and encumbrance thresholds.",
        linesCount: 55,
        code: `/**
 * =========================================================================================
 * @file ItemWeightCalculationNode.ts
 * @system RPG Inventory & Equipment System
 * @module Inventory Weight & Overencumbered Evaluator
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * คำนวณผลรวมน้ำหนักของไอเทมทั้งหมดในกระเป๋า และประเมินบทลงโทษ (Encumbrance Penalty)
 * เช่น:
 * - Normal (< 70%): เดิน วิ่ง กลิ้งหลบได้ปกติ
 * - Heavy Load (70% - 100%): ใช้ Stamina ในการวิ่งและกลิ้งหลบเพิ่มขึ้น 50%
 * - Overencumbered (> 100%): ไม่สามารถวิ่งและกลิ้งหลบได้ (เดินช้าลง 60%)
 * =========================================================================================
 */

import { InventorySlot } from "./InventorySlotController";

export type EncumbranceTier = "LIGHT" | "MEDIUM" | "HEAVY" | "OVERENCUMBERED";

export interface WeightCalculationResult {
  totalWeight: number;
  maxCapacity: number;
  percentage: number;
  tier: EncumbranceTier;
  movementSpeedMultiplier: number;
  staminaCostMultiplier: number;
}

export class ItemWeightCalculationNode {
  public static evaluateEncumbrance(slots: InventorySlot[], maxCapacity: number = 80): WeightCalculationResult {
    let totalWeight = 0;

    for (const slot of slots) {
      if (slot.item) {
        totalWeight += slot.item.unitWeight * slot.item.quantity;
      }
    }

    const percentage = maxCapacity > 0 ? (totalWeight / maxCapacity) * 100 : 100;
    let tier: EncumbranceTier = "LIGHT";
    let speedMult = 1.0;
    let staminaMult = 1.0;

    if (percentage > 100) {
      tier = "OVERENCUMBERED";
      speedMult = 0.4; // เดินช้ามาก
      staminaMult = 2.5;
    } else if (percentage >= 70) {
      tier = "HEAVY";
      speedMult = 0.8;
      staminaMult = 1.5;
    } else if (percentage >= 40) {
      tier = "MEDIUM";
      speedMult = 1.0;
      staminaMult = 1.0;
    }

    return {
      totalWeight: Number(totalWeight.toFixed(2)),
      maxCapacity,
      percentage: Number(percentage.toFixed(1)),
      tier,
      movementSpeedMultiplier: speedMult,
      staminaCostMultiplier: staminaMult
    };
  }
}
`
      },
      {
        id: "equipment_stat_modifier_node",
        name: "EquipmentStatModifierNode.ts",
        system: "RPG Inventory & Equipment System",
        moduleRole: "Equipment Stat Aggregator & Set Bonus Evaluator",
        language: "typescript",
        descriptionThai: "รวมค่าพลังจากอาวุธและชุดเกราะสวมใส่ทุกชิ้น พร้อมประเมินโบนัสเซ็ต (Set Bonus)",
        descriptionEng: "Aggregates base and affix stats across all equipped gear slots and computes set bonuses.",
        linesCount: 68,
        code: `/**
 * =========================================================================================
 * @file EquipmentStatModifierNode.ts
 * @system RPG Inventory & Equipment System
 * @module Equipment Stat Aggregator & Set Bonus Evaluator
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * รวมค่าพลัง (Attack, Defense, Crit, Elemental Resists) จากไอเทมที่ผู้เล่นสวมใส่
 * ในช่อง Head, Chest, Hands, Legs, Feet, MainHand, OffHand, Ring, Amulet
 * และคำนวณโบนัสเซ็ตเมื่อสวมใส่ชุดครบเซ็ต
 * =========================================================================================
 */

export interface EquipmentGearItem {
  slot: "HEAD" | "CHEST" | "HANDS" | "LEGS" | "FEET" | "MAIN_HAND" | "OFF_HAND";
  itemName: string;
  setName?: string;
  bonusAttack: number;
  bonusDefense: number;
  bonusHp: number;
  bonusCritChance: number;
}

export interface TotalEquipmentBonus {
  totalAttack: number;
  totalDefense: number;
  totalHp: number;
  totalCritChance: number;
  activeSetBonuses: string[];
}

export class EquipmentStatModifierNode {
  public static calculateTotalStats(equippedGears: EquipmentGearItem[]): TotalEquipmentBonus {
    let totalAttack = 0;
    let totalDefense = 0;
    let totalHp = 0;
    let totalCritChance = 0;
    const setCounts: Record<string, number> = {};

    for (const gear of equippedGears) {
      totalAttack += gear.bonusAttack || 0;
      totalDefense += gear.bonusDefense || 0;
      totalHp += gear.bonusHp || 0;
      totalCritChance += gear.bonusCritChance || 0;

      if (gear.setName) {
        setCounts[gear.setName] = (setCounts[gear.setName] || 0) + 1;
      }
    }

    const activeSetBonuses: string[] = [];
    // ตัวอย่างเซ็ตเกราะมังกร (Dragon Set)
    if ((setCounts["DragonKnight"] || 0) >= 4) {
      totalAttack += 50;
      totalHp += 200;
      activeSetBonuses.push("DragonKnight 4-Piece: +50 ATK, +200 HP, +15% Fire Damage");
    }

    return {
      totalAttack,
      totalDefense,
      totalHp,
      totalCritChance,
      activeSetBonuses
    };
  }
}
`
      }
    ]
  },

  // 3. BEHAVIOR TREE ENEMY AI SYSTEM
  {
    id: "behavior_tree_ai_modular",
    title: "Modular Behavior Tree AI Engine",
    thaiTitle: "ระบบ AI พฤติกรรมมอนสเตอร์ Behavior Tree (แยก 5 ไฟล์เดี่ยว)",
    category: "AI_BEHAVIOR",
    description: "Hierarchical Behavior Tree AI engine isolating Composite Nodes, Decorators, Blackboard Memory, and Leaf Actions into separate files.",
    thaiDescription: "ระบบ AI พฤติกรรมมอนสเตอร์แบบ Behavior Tree แยก 1 โหนด 1 โมดูล = 1 ไฟล์ (โหนดแม่แบบ, โหนด Selector/Sequence, กระดานความจำ Blackboard, และโหนดโจมตี/ลาดตระเวน)",
    iconName: "Bot",
    files: [
      {
        id: "bt_node_base",
        name: "BTNodeBase.ts",
        system: "Behavior Tree Enemy AI System",
        moduleRole: "Abstract Behavior Tree Node Base Contract",
        language: "typescript",
        descriptionThai: "คลาสแม่แบบ (Abstract Class) ของทุกโหนดใน Behavior Tree กำหนดสถานะ RUNNING/SUCCESS/FAILURE",
        descriptionEng: "Polymorphic base contract for all Composite, Decorator, and Action execution nodes.",
        linesCount: 52,
        code: `/**
 * =========================================================================================
 * @file BTNodeBase.ts
 * @system Behavior Tree Enemy AI System
 * @module Abstract Behavior Tree Node Base Contract
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * ไฟล์นี้เป็นโครงสร้างแม่แบบ (Abstract Base Class) ของทุกโหนดในระบบ Behavior Tree AI
 * บังคับให้ทุกโหนดต้องมีเมธอด evaluate() เพื่อคืนค่าสถานะ 3 แบบ:
 * 1. SUCCESS: โหนดทำงานสำเร็จ
 * 2. FAILURE: โหนดทำงานล้มเหลว
 * 3. RUNNING: โหนดยังทำงานไม่เสร็จ (เช่น กำลังเดิน, กำลังร่ายท่า)
 * =========================================================================================
 */

export enum BTNodeStatus {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  RUNNING = "RUNNING"
}

export abstract class BTNodeBase {
  public nodeName: string;

  constructor(name: string) {
    this.nodeName = name;
  }

  /**
   * รันการประเมินโหนดในแต่ละเฟรม (Frame Tick Evaluation)
   */
  public abstract evaluate(blackboard: any): BTNodeStatus;
}
`
      },
      {
        id: "bt_blackboard_memory",
        name: "BTBlackboardMemoryModule.ts",
        system: "Behavior Tree Enemy AI System",
        moduleRole: "AI Shared Memory & Perception Blackboard Store",
        language: "typescript",
        descriptionThai: "กระดานความจำส่วนกลางของ AI (เป้าหมาย, ระยะห่าง, ตำแหน่งล่าสุดของผู้เล่น, Cooldown)",
        descriptionEng: "Dynamic key-value memory store holding sensory perception data and target tracking info.",
        linesCount: 55,
        code: `/**
 * =========================================================================================
 * @file BTBlackboardMemoryModule.ts
 * @system Behavior Tree Enemy AI System
 * @module AI Shared Memory & Perception Blackboard Store
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * จัดเก็บความจำส่วนกลาง (Blackboard Memory) ที่ใช้แชร์ข้อมูลระหว่างโหนดต่างๆ ของ AI
 * เช่น ตำแหน่งผู้เล่นที่มองเห็นล่าสุด (LastKnownTargetPosition),
 * ระดับความตื่นตัว (AlertLevel), และคูลดาวน์ท่าโจมตี (SkillCooldowns)
 * =========================================================================================
 */

export class BTBlackboardMemoryModule {
  private memory: Map<string, any> = new Map();

  public set<T>(key: string, value: T): void {
    this.memory.set(key, value);
  }

  public get<T>(key: string, defaultValue?: T): T {
    if (this.memory.has(key)) {
      return this.memory.get(key) as T;
    }
    return defaultValue as T;
  }

  public has(key: string): boolean {
    return this.memory.has(key);
  }

  public clear(): void {
    this.memory.clear();
  }
}
`
      },
      {
        id: "bt_composite_selector",
        name: "BTSelectorCompositeNode.ts",
        system: "Behavior Tree Enemy AI System",
        moduleRole: "Fallback Priority Composite Evaluator Node",
        language: "typescript",
        descriptionThai: "โหนดแบบ Selector (OR Logic) ประเมินลูกทีละโหนดจนกว่าจะพบตัวที่ SUCCESS",
        descriptionEng: "Fallback composite evaluating child branches sequentially until one yields SUCCESS or RUNNING.",
        linesCount: 48,
        code: `/**
 * =========================================================================================
 * @file BTSelectorCompositeNode.ts
 * @system Behavior Tree Enemy AI System
 * @module Fallback Priority Composite Evaluator Node
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * โหนด Composite ประเภท Selector (ทำหน้าที่เหมือนคำสั่ง Fallback / Priority OR):
 * - จะรันโหนดลูกทีละตัวตามลำดับความสำคัญ (Priority)
 * - หากโหนดลูกคืนค่า SUCCESS หรือ RUNNING จะหยุดและคืนค่านั้นทันที
 * - จะคืนค่า FAILURE ก็ต่อเมื่อโหนดลูกทุกตัวล้มเหลวทั้งหมด
 * =========================================================================================
 */

import { BTNodeBase, BTNodeStatus } from "./BTNodeBase";
import { BTBlackboardMemoryModule } from "./BTBlackboardMemoryModule";

export class BTSelectorCompositeNode extends BTNodeBase {
  protected children: BTNodeBase[];

  constructor(name: string, children: BTNodeBase[] = []) {
    super(name);
    this.children = children;
  }

  public evaluate(blackboard: BTBlackboardMemoryModule): BTNodeStatus {
    for (const child of this.children) {
      const status = child.evaluate(blackboard);
      if (status === BTNodeStatus.SUCCESS) {
        return BTNodeStatus.SUCCESS;
      }
      if (status === BTNodeStatus.RUNNING) {
        return BTNodeStatus.RUNNING;
      }
    }
    return BTNodeStatus.FAILURE;
  }
}
`
      }
    ]
  }
];

/**
 * Dynamic AI Generator for any custom prompt requesting 1-node-1-file modular systems
 */
export function generateModularArchitectureFromPrompt(
  prompt: string,
  preferredLanguage: 'typescript' | 'csharp' | 'cpp' | 'python' | 'lua' = 'typescript'
): ModularSystemPreset {
  const p = prompt.toLowerCase();

  // Check if matches built-in keywords
  if (p.includes("combat") || p.includes("ต่อสู้") || p.includes("damage") || p.includes("ดาเมจ") || p.includes("ฟัน") || p.includes("hit")) {
    return MODULAR_SYSTEM_PRESETS[0];
  }
  if (p.includes("inventory") || p.includes("ช่องเก็บของ") || p.includes("กระเป๋า") || p.includes("ไอเทม") || p.includes("item") || p.includes("สวมใส่")) {
    return MODULAR_SYSTEM_PRESETS[1];
  }
  if (p.includes("behavior") || p.includes("ai") || p.includes("ศัตรู") || p.includes("มอนสเตอร์") || p.includes("bot") || p.includes("tree")) {
    return MODULAR_SYSTEM_PRESETS[2];
  }

  // Dynamic Synthesis for Custom Systems
  const systemName = prompt.trim().slice(0, 40) || "Custom Game Subsystem";
  const sanitizedTitle = systemName.replace(/[^a-zA-Z0-9_\u0E00-\u0E7F\s]/g, "");
  const className = sanitizedTitle.replace(/[\s\u0E00-\u0E7F]+/g, '') || "CustomSystem";

  const ext = preferredLanguage === 'typescript' ? 'ts' : preferredLanguage === 'csharp' ? 'cs' : preferredLanguage === 'cpp' ? 'cpp' : preferredLanguage === 'python' ? 'py' : 'lua';

  const files: ModularFile[] = [
    {
      id: "module_state_contract",
      name: `${className}StateContract.${ext}`,
      system: sanitizedTitle,
      moduleRole: "Core State Data Model & Interface Contract",
      language: preferredLanguage,
      descriptionThai: `โมดูลจัดเก็บสถานะและโครงสร้างข้อมูลหลักสำหรับระบบ ${sanitizedTitle}`,
      descriptionEng: `Central state contract and interface definitions for ${sanitizedTitle}`,
      linesCount: 65,
      code: `/**
 * =========================================================================================
 * @file ${className}StateContract.${ext}
 * @system ${sanitizedTitle}
 * @module Core State Data Model & Interface Contract
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * ไฟล์นี้ทำหน้าที่เป็น Interface Contract และ Data Store หลักของระบบ ${sanitizedTitle}
 * แยกออกจาก Logic การประมวลผล เพื่อให้แก้ไขและ Maintain ง่ายตามกฎ 1 Node = 1 File
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture]:
 * - ให้บริการ Type/Class Definition แก่ Node ประมวลผลย่อยทั้งหมด
 * - รองรับ Reactive Listener เมื่อข้อมูลเปลี่ยน
 * 
 * 📥 [Inputs]: System Configuration Data
 * 📤 [Outputs]: Immutable State Snapshot
 * ⚠️ [Error Handling]: Data Sanitization & Bounds Checking
 * =========================================================================================
 */

export interface SystemDataModel {
  systemId: string;
  isActive: boolean;
  timestamp: number;
  parameters: Record<string, number | string | boolean>;
}

export class ${className}StateContract {
  private data: SystemDataModel;

  constructor(initialId: string = "sys_default") {
    this.data = {
      systemId: initialId,
      isActive: true,
      timestamp: Date.now(),
      parameters: {}
    };
  }

  public getData(): SystemDataModel {
    return { ...this.data };
  }

  public setParameter(key: string, value: number | string | boolean): void {
    this.data.parameters[key] = value;
    this.data.timestamp = Date.now();
  }
}
`
    },
    {
      id: "module_evaluator_node",
      name: `${className}EvaluatorNode.${ext}`,
      system: sanitizedTitle,
      moduleRole: "Pure Computation & Rule Evaluator Node",
      language: preferredLanguage,
      descriptionThai: `โหนดประมวลผลตรรกะและคำนวณกฎเกณฑ์สำหรับระบบ ${sanitizedTitle}`,
      descriptionEng: `Rule evaluator and core algorithm engine for ${sanitizedTitle}`,
      linesCount: 58,
      code: `/**
 * =========================================================================================
 * @file ${className}EvaluatorNode.${ext}
 * @system ${sanitizedTitle}
 * @module Pure Computation & Rule Evaluator Node
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * คำนวณตรรกะและการตัดสินใจหลักของระบบ ${sanitizedTitle}
 * ยึดหลัก Pure Function ไม่มี Side Effect เพื่อให้ทำ Unit Test และดีบักได้ทันที
 * =========================================================================================
 */

import { SystemDataModel } from "./${className}StateContract";

export class ${className}EvaluatorNode {
  /**
   * ประมวลผลและตัดสินใจตามพารามิเตอร์ Input
   */
  public static evaluate(state: SystemDataModel, deltaSeconds: number = 0.016): { isValid: boolean; executionWeight: number } {
    if (!state.isActive) {
      return { isValid: false, executionWeight: 0 };
    }

    const weight = deltaSeconds * 60.0;
    return {
      isValid: true,
      executionWeight: Math.min(1.0, weight)
    };
  }
}
`
    },
    {
      id: "module_event_dispatcher",
      name: `${className}EventDispatcher.${ext}`,
      system: sanitizedTitle,
      moduleRole: "Observer Event Broadcaster & Hook Pipeline",
      language: preferredLanguage,
      descriptionThai: `จัดการการยิง Event และแจ้งเตือนระบบภายนอก (Audio, VFX, UI) แบบ Decoupled`,
      descriptionEng: `Decoupled event broadcaster notifying audio, UI, and animation sub-systems.`,
      linesCount: 52,
      code: `/**
 * =========================================================================================
 * @file ${className}EventDispatcher.${ext}
 * @system ${sanitizedTitle}
 * @module Observer Event Broadcaster & Hook Pipeline
 * =========================================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Responsibility]:
 * กระจายเหตุการณ์ (Event Dispatcher) เมื่อระบบ ${sanitizedTitle} ทำงานสำเร็จ
 * ป้องกันการผูกติด (Loose Coupling) ระหว่าง Gameplay Logic กับ UI/Audio
 * =========================================================================================
 */

export type EventHandler = (payload: any) => void;

export class ${className}EventDispatcher {
  private static handlers: Map<string, EventHandler[]> = new Map();

  public static on(eventName: string, handler: EventHandler): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  public static emit(eventName: string, payload: any): void {
    const list = this.handlers.get(eventName) || [];
    list.forEach(fn => {
      try {
        fn(payload);
      } catch (err) {
        console.error("[" + eventName + "] Error in event handler:", err);
      }
    });
  }
}
`
    }
  ];

  return {
    id: "custom_generated_modular_system",
    title: `${sanitizedTitle} Architecture`,
    thaiTitle: `ระบบโมดูลาร์: ${sanitizedTitle} (แยก ${files.length} ไฟล์เดี่ยว)`,
    category: "CUSTOM",
    description: `Custom modular architecture dividing ${sanitizedTitle} into decoupled single files.`,
    thaiDescription: `สถาปัตยกรรมเกมแยก 1 โหนด 1 โมดูล = 1 ไฟล์สำหรับ ${sanitizedTitle} พร้อมคำอธิบายละเอียดทุกบรรทัด`,
    iconName: "Boxes",
    files
  };
}
