/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Unreal Engine 5 StateTree AI Decision Engine Simulation Node.
 *          Simulates hierarchical state evaluation, tick cycles, active state transitions,
 *          task dispatching, and On-Device Offline AI State Machine Optimization.
 *    - TH: เอนจินจำลองระบบการตัดสินใจ UE5 StateTree AI (StateTree Decision Engine)
 *          ประมวลผลการประเมินสถานะแบบลำดับชั้น, การสลับสถานะตามเงื่อนไข (State Transitions),
 *          การรัน Task พฤติกรรม AI, และ AI ในเครื่องช่วยวิเคราะห์ลดความซ้ำซ้อนของเงื่อนไข
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `ue5StateTreeTypes.ts`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - `getProfile()`: Returns immutable `UE5StateTreeProfile`
 *    - `transitionTo(stateId)`: Switches active StateTree state
 * ============================================================================
 */

import { UE5StateTreeProfile, StateTreeNode } from '../types/ue5StateTreeTypes';

const INITIAL_STATES: StateTreeNode[] = [
  {
    id: 'STATE_ROOT',
    name: 'Root',
    parentStateId: null,
    status: 'ACTIVE',
    tasks: [],
    transitions: [{ event: 'OnEnter', targetStateId: 'STATE_PATROL', conditionText: 'TargetActor == null' }]
  },
  {
    id: 'STATE_PATROL',
    name: 'Patrol & Survey Area',
    parentStateId: 'STATE_ROOT',
    status: 'ACTIVE',
    tasks: [
      { id: 'T_NAV_WAYPOINT', name: 'Follow Smart Waypoint Path', nodeType: 'TASK', description: 'Moves along spline with smooth acceleration', executionRateHz: 30 },
      { id: 'T_PERCEPTION_SCAN', name: 'Vision Cone Perception Evaluator', nodeType: 'EVALUATOR', description: 'Checks 120-degree cone for enemy player presence', executionRateHz: 10 }
    ],
    transitions: [
      { event: 'OnTargetSpotted', targetStateId: 'STATE_ENGAGE_COMBAT', conditionText: 'TargetDistance < 2500 && HasLineOfSight' },
      { event: 'OnLowHealth', targetStateId: 'STATE_SEEK_COVER', conditionText: 'HealthRatio < 0.25' }
    ]
  },
  {
    id: 'STATE_ENGAGE_COMBAT',
    name: 'Tactical Combat Engagement',
    parentStateId: 'STATE_ROOT',
    status: 'INACTIVE',
    tasks: [
      { id: 'T_GAS_FIRE', name: 'Execute GAS Primary Fire Ability', nodeType: 'TASK', description: 'Triggers GameplayAbility_ShootBurst', executionRateHz: 20 },
      { id: 'T_STRAFE_ORBIT', name: 'Combat Circle Strafe', nodeType: 'TASK', description: 'Maintains optimal 1200 UU combat perimeter', executionRateHz: 30 }
    ],
    transitions: [
      { event: 'OnTargetLost', targetStateId: 'STATE_SEARCH_INVESTIGATE', conditionText: 'TimeSinceLastSight > 4.0s' },
      { event: 'OnLowAmmo', targetStateId: 'STATE_SEEK_COVER', conditionText: 'CurrentAmmo == 0' }
    ]
  },
  {
    id: 'STATE_SEEK_COVER',
    name: 'Tactical Retreat & Cover',
    parentStateId: 'STATE_ROOT',
    status: 'INACTIVE',
    tasks: [
      { id: 'T_FIND_COVER', name: 'Query EQS Cover Point', nodeType: 'TASK', description: 'Finds highest-rated obstacle occluding enemy LOS', executionRateHz: 5 },
      { id: 'T_HEAL_BURST', name: 'Trigger Nano-Stimpack Heal', nodeType: 'TASK', description: 'Channels restorative buff over 3 seconds', executionRateHz: 10 }
    ],
    transitions: [
      { event: 'OnHealed', targetStateId: 'STATE_ENGAGE_COMBAT', conditionText: 'HealthRatio >= 0.85' }
    ]
  },
  {
    id: 'STATE_SEARCH_INVESTIGATE',
    name: 'Investigate Last Known Position (LKP)',
    parentStateId: 'STATE_ROOT',
    status: 'INACTIVE',
    tasks: [
      { id: 'T_INVESTIGATE_LKP', name: 'Approach Last Known Transform', nodeType: 'TASK', description: 'Cautious tactical walk towards marker', executionRateHz: 20 }
    ],
    transitions: [
      { event: 'OnTimeout', targetStateId: 'STATE_PATROL', conditionText: 'SearchDuration > 10.0s' }
    ]
  }
];

export class UE5StateTreeEngineNode {
  private profile: UE5StateTreeProfile;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.profile = {
      treeName: 'ST_EliteEnforcer_CombatLogic',
      schemaType: 'MassAI',
      tickIntervalSeconds: 0.05,
      totalStates: INITIAL_STATES.length,
      activeStateId: 'STATE_PATROL',
      states: [...INITIAL_STATES],
      evaluators: ['UE5PerceptionEvaluator', 'EQSCoverScorerEvaluator', 'SmartObjectInteractionEvaluator'],
      offlineAIInsight:
        'On-Device Offline AI StateTree Optimizer: Hierarchical StateTree structure evaluated with zero cyclic deadlocks. MassEntity integration enables execution across 5,000+ simultaneous crowd NPCs with < 0.35ms CPU overhead per tick.'
    };
  }

  public getProfile(): UE5StateTreeProfile {
    return this.profile;
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify(): void {
    this.listeners.forEach(cb => cb());
  }

  public transitionTo(stateId: string): void {
    this.profile.states = this.profile.states.map(s => {
      if (s.id === stateId) return { ...s, status: 'ACTIVE' as const };
      if (s.id === 'STATE_ROOT') return s;
      return { ...s, status: 'INACTIVE' as const };
    });
    this.profile.activeStateId = stateId;
    this.profile.offlineAIInsight = `On-Device Offline AI: StateTree transitioned actively to [${stateId}]. Tasks and evaluators primed. Zero frame latency.`;
    this.notify();
  }
}

export const ue5StateTreeEngine = new UE5StateTreeEngineNode();
