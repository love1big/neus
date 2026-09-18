/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for the AAA StateTree Hierarchical Decision
 *          & Logic Graph System (Unreal Engine 5.3+ StateTree & CryEngine Modular
 *          Behavior Tree parity). Defines Hierarchical States, Sub-State trees,
 *          Transition Conditions, Enter/Exit Tasks, Utility Evaluators, and
 *          Blackboard Memory Keys.
 *    - TH: กำหนด Type และ Interface หลักสำหรับระบบ StateTree Hierarchical Decision
 *          และการตัดสินใจลำดับชั้นระดับ AAA (เทียบเท่า Unreal Engine 5.3+ StateTree
 *          และ CryEngine Modular Behavior Tree)
 *          ครอบคลุมสถานะตามลำดับชั้น (Root, Parent, Sub-States), เงื่อนไขการเปลี่ยนสถานะ
 *          (Transition Rules & Utility Scores), งานที่ทำงานเมื่อเข้า/ออกจากสถานะ (Tasks),
 *          และตัวแปรบนกระดานดำ (Blackboard Memory)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `StateTreeDecisionNode.ts` and `StateTreeHierarchicalDecisionStudio.tsx`
 *    - Controls autonomous AI agents, bosses, companion behaviors, and quest flow logic
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Interfaces: `StateTreeNode`, `StateTreeTransition`, `StateTreeTask`, `StateTreeBlackboard`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Fallback to Root Idle state if transition evaluation fails or conditions loop.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```ts
 *    import { StateTreeNode, StateTreeTransition } from '../types/stateTreeTypes';
 *    ```
 * ============================================================================
 */

export type StateTreeStatus = 'UNINITIALIZED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';

export type StateTreeTransitionTrigger = 'ON_STATE_COMPLETED' | 'ON_STATE_FAILED' | 'ON_TICK' | 'ON_EVENT';

export type StateTreeTransitionType = 'GOTO_STATE' | 'NEXT_SIBLING' | 'SUCCEED_TREE' | 'FAIL_TREE';

export interface StateTreeCondition {
  id: string;
  variableKey: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'BOOLEAN_IS';
  targetValue: any;
}

export interface StateTreeTransition {
  id: string;
  trigger: StateTreeTransitionTrigger;
  targetStateId: string;
  type: StateTreeTransitionType;
  priority: number;
  conditions: StateTreeCondition[];
}

export interface StateTreeTask {
  id: string;
  name: string;
  category: 'ANIMATION' | 'NAV_MOVE' | 'COMBAT_ATTACK' | 'AUDIO_PLAY' | 'CUSTOM_LOGIC';
  durationSec: number;
  isComplete: boolean;
}

export interface StateTreeNode {
  id: string;
  name: string;
  description: string;
  color: string;
  parentId: string | null;
  childrenIds: string[];
  tasks: StateTreeTask[];
  transitions: StateTreeTransition[];
  utilityScore?: number;
}

export interface StateTreeBlackboardVariable {
  key: string;
  type: 'BOOLEAN' | 'NUMBER' | 'STRING' | 'VECTOR3';
  value: any;
  description: string;
}

export interface StateTreeSchema {
  id: string;
  name: string;
  rootStateId: string;
  states: StateTreeNode[];
  blackboard: Record<string, StateTreeBlackboardVariable>;
}
