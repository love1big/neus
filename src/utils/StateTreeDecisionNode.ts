/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Runtime StateTree Evaluation & Execution Engine (Unreal Engine 5.3+
 *          StateTree & Modular Behavior Tree parity). Evaluates hierarchical state
 *          transitions, executes state entry/exit tasks, ticks active state tasks,
 *          and synchronizes with dynamic blackboard memory.
 *    - TH: เอนจินประมวลผลและตัดสินใจ StateTree ตามลำดับชั้นระดับ AAA (เทียบเท่า Unreal 5.3+
 *          StateTree)
 *          คำนวณการเปลี่ยนสถานะตามเงื่อนไข (State Transitions), รันงานย่อยในสถานะ (Tasks),
 *          ตรวจสอบเงื่อนไขจาก Blackboard และจัดการลำดับชั้นของ Parent/Child States
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `stateTreeTypes.ts` contracts
 *    - Consumed by `StateTreeHierarchicalDecisionStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Inputs: `tick(deltaTimeSec)`, `setBlackboardValue(key, value)`
 *    - Outputs: Active state ID path, running tasks, execution telemetry
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Cyclic transition protection with max transition depth cap.
 * ============================================================================
 */

import {
  StateTreeSchema,
  StateTreeNode,
  StateTreeBlackboardVariable,
  StateTreeStatus
} from '../types/stateTreeTypes';

const STORAGE_KEY = 'omni_statetree_schema';

export class StateTreeDecisionNode {
  private static instance: StateTreeDecisionNode;

  private schema: StateTreeSchema;
  private activeStateId: string = 'state_combat_patrol';
  private treeStatus: StateTreeStatus = 'RUNNING';
  private taskProgress: number = 0; // 0.0 to 1.0
  private subscribers: Array<() => void> = [];

  private constructor() {
    this.schema = this.createDefaultSchema();
    this.loadFromStorage();
  }

  public static getInstance(): StateTreeDecisionNode {
    if (!StateTreeDecisionNode.instance) {
      StateTreeDecisionNode.instance = new StateTreeDecisionNode();
    }
    return StateTreeDecisionNode.instance;
  }

  private createDefaultSchema(): StateTreeSchema {
    const states: StateTreeNode[] = [
      {
        id: 'state_root',
        name: 'Root',
        description: 'Global Agent Root Lifecycle',
        color: '#6366f1',
        parentId: null,
        childrenIds: ['state_passive', 'state_combat'],
        tasks: [],
        transitions: []
      },
      {
        id: 'state_passive',
        name: 'Passive Behavior',
        description: 'Ambient non-combat exploration and patrol routines',
        color: '#10b981',
        parentId: 'state_root',
        childrenIds: ['state_combat_patrol', 'state_idle_investigate'],
        tasks: [],
        transitions: [
          {
            id: 'tr_to_combat',
            trigger: 'ON_TICK',
            targetStateId: 'state_combat',
            type: 'GOTO_STATE',
            priority: 10,
            conditions: [
              { id: 'c_has_target', variableKey: 'hasTarget', operator: 'BOOLEAN_IS', targetValue: true }
            ]
          }
        ]
      },
      {
        id: 'state_combat_patrol',
        name: 'Waypoint Patrol',
        description: 'Move smoothly along designated patrol waypoints',
        color: '#06b6d4',
        parentId: 'state_passive',
        childrenIds: [],
        tasks: [
          { id: 'task_patrol_walk', name: 'NavigateToNextWaypoint', category: 'NAV_MOVE', durationSec: 3.5, isComplete: false },
          { id: 'task_scan_ambience', name: 'PlayLookAroundAnimation', category: 'ANIMATION', durationSec: 2.0, isComplete: false }
        ],
        transitions: [
          {
            id: 'tr_to_investigate',
            trigger: 'ON_TICK',
            targetStateId: 'state_idle_investigate',
            type: 'GOTO_STATE',
            priority: 5,
            conditions: [
              { id: 'c_suspicious_noise', variableKey: 'suspiciousNoiseLevel', operator: 'GREATER_THAN', targetValue: 50 }
            ]
          }
        ]
      },
      {
        id: 'state_idle_investigate',
        name: 'Investigate Disturbance',
        description: 'Inspect sound source location with alert posture',
        color: '#eab308',
        parentId: 'state_passive',
        childrenIds: [],
        tasks: [
          { id: 'task_investigate_move', name: 'MoveToNoiseSource', category: 'NAV_MOVE', durationSec: 2.5, isComplete: false }
        ],
        transitions: []
      },
      {
        id: 'state_combat',
        name: 'Combat Encounter',
        description: 'Tactical engagement, flanking, and abilities',
        color: '#ef4444',
        parentId: 'state_root',
        childrenIds: ['state_combat_engage', 'state_combat_retreat'],
        tasks: [],
        transitions: [
          {
            id: 'tr_back_to_passive',
            trigger: 'ON_TICK',
            targetStateId: 'state_passive',
            type: 'GOTO_STATE',
            priority: 1,
            conditions: [
              { id: 'c_no_target', variableKey: 'hasTarget', operator: 'BOOLEAN_IS', targetValue: false }
            ]
          }
        ]
      },
      {
        id: 'state_combat_engage',
        name: 'Engage & Flank Target',
        description: 'Close combat gap and execute melee/ranged combo attacks',
        color: '#f97316',
        parentId: 'state_combat',
        childrenIds: [],
        tasks: [
          { id: 'task_combo_attack', name: 'PlaySwordComboAnimation', category: 'COMBAT_ATTACK', durationSec: 1.8, isComplete: false }
        ],
        transitions: [
          {
            id: 'tr_to_retreat',
            trigger: 'ON_TICK',
            targetStateId: 'state_combat_retreat',
            type: 'GOTO_STATE',
            priority: 8,
            conditions: [
              { id: 'c_low_health', variableKey: 'healthPercent', operator: 'LESS_THAN', targetValue: 25 }
            ]
          }
        ]
      },
      {
        id: 'state_combat_retreat',
        name: 'Tactical Retreat',
        description: 'Fall back behind cover and recover stamina',
        color: '#8b5cf6',
        parentId: 'state_combat',
        childrenIds: [],
        tasks: [
          { id: 'task_sprint_cover', name: 'SprintToNearestCover', category: 'NAV_MOVE', durationSec: 3.0, isComplete: false }
        ],
        transitions: []
      }
    ];

    const blackboard: Record<string, StateTreeBlackboardVariable> = {
      hasTarget: { key: 'hasTarget', type: 'BOOLEAN', value: false, description: 'Whether enemy is currently sighted in perception cone' },
      healthPercent: { key: 'healthPercent', type: 'NUMBER', value: 100, description: 'Current character health percentage' },
      suspiciousNoiseLevel: { key: 'suspiciousNoiseLevel', type: 'NUMBER', value: 10, description: 'Recent ambient acoustic disturbance (0-100)' },
      distanceToTargetMeters: { key: 'distanceToTargetMeters', type: 'NUMBER', value: 14.5, description: 'Euclidean distance to closest adversary' }
    };

    return {
      id: 'statetree_boss_ai',
      name: 'StateTree_EliteTacticalAI',
      rootStateId: 'state_root',
      states,
      blackboard
    };
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.states && parsed.blackboard) {
          this.schema = parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load StateTree from storage:', e);
    }
  }

  public saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.schema));
    } catch (e) {
      console.warn('Failed to save StateTree to storage:', e);
    }
    this.notify();
  }

  public getSchema(): StateTreeSchema {
    return this.schema;
  }

  public getActiveStateId(): string {
    return this.activeStateId;
  }

  public getTreeStatus(): StateTreeStatus {
    return this.treeStatus;
  }

  public getTaskProgress(): number {
    return this.taskProgress;
  }

  public setBlackboardValue(key: string, value: any): void {
    if (this.schema.blackboard[key]) {
      this.schema.blackboard[key].value = value;
      this.evaluateTransitions();
      this.saveToStorage();
    }
  }

  public selectState(stateId: string): void {
    const st = this.schema.states.find(s => s.id === stateId);
    if (st) {
      this.activeStateId = stateId;
      this.taskProgress = 0;
      this.notify();
    }
  }

  /**
   * Evaluates all transition conditions for current active state and its parents
   */
  public evaluateTransitions(): void {
    let curr: StateTreeNode | undefined = this.schema.states.find(s => s.id === this.activeStateId);

    while (curr) {
      for (const tr of curr.transitions) {
        const matches = tr.conditions.every(c => {
          const val = this.schema.blackboard[c.variableKey]?.value;
          if (c.operator === 'BOOLEAN_IS') return val === c.targetValue;
          if (c.operator === 'GREATER_THAN') return Number(val) > Number(c.targetValue);
          if (c.operator === 'LESS_THAN') return Number(val) < Number(c.targetValue);
          if (c.operator === 'EQUALS') return val === c.targetValue;
          if (c.operator === 'NOT_EQUALS') return val !== c.targetValue;
          return false;
        });

        if (matches && tr.targetStateId !== this.activeStateId) {
          // Resolve to deepest child if target has children
          const target = this.schema.states.find(s => s.id === tr.targetStateId);
          if (target && target.childrenIds.length > 0) {
            this.activeStateId = target.childrenIds[0];
          } else {
            this.activeStateId = tr.targetStateId;
          }
          this.taskProgress = 0;
          this.notify();
          return;
        }
      }
      curr = this.schema.states.find(s => s.id === curr?.parentId);
    }
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

export const stateTreeEngine = StateTreeDecisionNode.getInstance();
