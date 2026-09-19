/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript types and contracts for Unreal Engine 5 StateTree AI
 *          & Hierarchical State Machine (HSM) Decision Studio (UE5.4+ StateTree parity).
 *          Defines StateTree States, Evaluators (Environmental & Sensory input),
 *          Tasks (Executable gameplay actions), Transitions (Conditional state switches),
 *          Global Context Parameters, and On-Device Offline AI State Transition Optimizer.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Unreal Engine 5 StateTree AI (StateTree HSM Decision System)
 *          ครอบคลุมการกำหนดโครงสร้างสถานะลำดับชั้น (Hierarchical States), Evaluators รับรู้สภาพแวดล้อม,
 *          Tasks ปฏิบัติการของ AI, Transitions การเปลี่ยนสถานะตามเงื่อนไข,
 *          และ AI ออฟไลน์ช่วยปรับปรุงโครงสร้างการตัดสินใจลดความซับซ้อน (Zero-Token Guarantee)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `UE5StateTreeEngineNode.ts` and `UE5StateTreeAIStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - State Status: `ACTIVE`, `INACTIVE`, `FAILED`, `SUCCEEDED`
 * ============================================================================
 */

export type StateTreeStateStatus = 'ACTIVE' | 'INACTIVE' | 'FAILED' | 'SUCCEEDED';

export interface StateTreeTask {
  id: string;
  name: string;
  nodeType: 'TASK' | 'EVALUATOR' | 'CONDITION';
  description: string;
  executionRateHz: number;
}

export interface StateTreeNode {
  id: string;
  name: string;
  parentStateId: string | null;
  status: StateTreeStateStatus;
  tasks: StateTreeTask[];
  transitions: {
    event: string;
    targetStateId: string;
    conditionText: string;
  }[];
}

export interface UE5StateTreeProfile {
  treeName: string;
  schemaType: 'MassAI' | 'Component' | 'GameplayInteraction';
  tickIntervalSeconds: number;
  totalStates: number;
  activeStateId: string;
  states: StateTreeNode[];
  evaluators: string[];
  offlineAIInsight: string;
}
