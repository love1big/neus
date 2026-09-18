/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript types and contracts for Unreal Engine 5 Gameplay Ability System
 *          (GAS) Gameplay Tag Hierarchies & Attribute Set Studio (UE5 GAS parity).
 *          Defines Gameplay Tags (hierarchical dot notation e.g. "State.Debuff.Stun"),
 *          Gameplay Attributes (BaseValue, CurrentValue), Gameplay Effects (Instant, Duration,
 *          Infinite with Modifiers), Gameplay Cues, and On-Device Offline AI Tag Replication.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ UE5 Gameplay Ability System (GAS)
 *          (เทียบเท่า Gameplay Ability System ใน Unreal Engine 5)
 *          ครอบคลุมระบบแท็กเกมเพลย์แบบลำดับชั้น (Gameplay Tags เช่น State.Debuff.Stun),
 *          ชุดค่าสถานะตัวละคร (AttributeSet: Health, Mana, Stamina, Armor),
 *          เอฟเฟกต์เกมเพลย์ (Gameplay Effects), และ AI ออฟไลน์คำนวณสูตรดาเมจแบบกระจายศูนย์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `UE5GameplayAbilitySystemEngineNode.ts` and `UE5GameplayAbilitySystemStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Tags: `Ability.Skill.Fireball`, `State.Combat.InBattle`, `State.Debuff.Frozen`
 * ============================================================================
 */

export interface GameplayAttribute {
  name: string;
  baseValue: number;
  currentValue: number;
  minValue: number;
  maxValue: number;
}

export interface GameplayTagItem {
  tag: string; // e.g. "State.Debuff.Stun"
  description: string;
  isActive: boolean;
}

export interface GameplayEffect {
  id: string;
  name: string;
  durationPolicy: 'INSTANT' | 'DURATION' | 'INFINITE';
  durationSeconds: number;
  targetAttribute: string;
  modifierOp: 'ADD' | 'MULTIPLY' | 'OVERRIDE';
  magnitude: number;
  grantedTag?: string;
}

export interface UE5GASProfile {
  characterClass: string;
  attributes: GameplayAttribute[];
  gameplayTags: GameplayTagItem[];
  activeEffects: GameplayEffect[];
  offlineAIFormulaAudit: string;
}
