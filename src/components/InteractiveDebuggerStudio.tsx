import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bug, Play, Pause, StepForward, StepBack, RotateCcw, CornerDownRight, CornerRightUp,
  Square, Variable, Layers, Terminal, Clock, Eye, Plus, Trash2, Edit3, Check, X,
  Search, Code2, Cpu, Database, ChevronRight, ChevronDown, RefreshCw, Sparkles,
  Zap, Copy, CheckCircle2, AlertTriangle, AlertCircle, Bookmark, ShieldAlert,
  FileCode, PlayCircle, FastForward, History, HelpCircle, Laptop, ListFilter,
  Flame, Radio, Monitor, Hash, Compass, ArrowRight, CornerDownLeft
} from 'lucide-react';

// Supported Languages & Debugging Targets
export type DebugLanguage = 'typescript' | 'csharp' | 'cpp' | 'hlsl' | 'python' | 'lua';

export interface Breakpoint {
  id: string;
  fileId: string;
  line: number;
  enabled: boolean;
  condition?: string;
  hitCount?: number;
  hitCountCurrent?: number;
  logMessage?: string;
}

export interface StackFrame {
  id: string;
  functionName: string;
  fileId: string;
  line: number;
  column: number;
  module: string;
  variables: {
    local: Record<string, any>;
    closure: Record<string, any>;
    global: Record<string, any>;
  };
}

export interface WatchExpression {
  id: string;
  expression: string;
  value: string;
  type: string;
  isError?: boolean;
}

export interface DebugThread {
  id: string;
  name: string;
  state: 'running' | 'paused' | 'stopped';
  frames: StackFrame[];
}

export interface DebugFile {
  id: string;
  name: string;
  language: DebugLanguage;
  path: string;
  code: string;
  astNodes?: Array<{
    line: number;
    statement: string;
    action: (state: DebugState) => Partial<DebugState>;
  }>;
}

export interface ExecutionStep {
  stepIndex: number;
  fileId: string;
  line: number;
  functionName: string;
  variablesSnapshot: Record<string, any>;
  logOutput?: string;
}

export interface DebugState {
  isRunning: boolean;
  isPaused: boolean;
  currentFileId: string;
  currentLine: number;
  activeThreadId: string;
  selectedFrameIndex: number;
  stepCount: number;
  executionHistory: ExecutionStep[];
  historyCursor: number;
  speedMs: number;
  logs: Array<{ timestamp: string; type: 'info' | 'warn' | 'error' | 'debug' | 'eval'; text: string }>;
}

// SAMPLE CODE REPOSITORIES FOR ALL 6 SUPPORTED LANGUAGES
const SAMPLE_FILES: Record<DebugLanguage, DebugFile> = {
  typescript: {
    id: 'PlayerCombatController.ts',
    name: 'PlayerCombatController.ts',
    language: 'typescript',
    path: 'src/gameplay/combat/PlayerCombatController.ts',
    code: `// OmniEngine - Player Combat State Machine
import { Vector3, Entity, SoundDSP, ParticleEmitter } from '@omni/engine';

export class PlayerCombatController {
  private player: Entity;
  private stamina: number = 100;
  private comboCount: number = 0;
  private isInvulnerable: boolean = false;
  private activeTarget: Entity | null = null;

  constructor(player: Entity) {
    this.player = player;
  }

  public executeComboSlash(target: Entity, powerMultiplier: number): boolean {
    let baseDamage = 35.0;
    let critChance = 0.25;
    let isCritical = Math.random() < critChance;
    
    // Check stamina threshold
    if (this.stamina < 15) {
      console.warn("Insufficient stamina for combo execution!");
      return false;
    }

    this.stamina -= 15;
    this.comboCount += 1;
    let finalDamage = baseDamage * powerMultiplier;

    if (isCritical) {
      finalDamage *= 2.5;
      SoundDSP.playSpatial("crit_slash.dsp", this.player.position);
      ParticleEmitter.spawn("vfx_blood_spark", target.position);
    }

    // Apply combat damage to target
    let targetHealth = target.applyDamage(finalDamage, this.player);
    this.activeTarget = target;

    if (targetHealth <= 0) {
      this.comboCount += 5;
      this.stamina = Math.min(100, this.stamina + 30);
      console.log(\`Target defeated! Combo bonus awarded. Total: \${this.comboCount}\`);
    }

    return true;
  }

  public resetCombo(): void {
    this.comboCount = 0;
    this.activeTarget = null;
  }
}`
  },
  csharp: {
    id: 'InventoryEquipmentManager.cs',
    name: 'InventoryEquipmentManager.cs',
    language: 'csharp',
    path: 'Assets/Scripts/Systems/InventoryEquipmentManager.cs',
    code: `using System;
using System.Collections.Generic;
using OmniEngine.Core;
using OmniEngine.Audio;

namespace OmniGame.Systems 
{
    public class InventoryEquipmentManager : MonoBehaviour 
    {
        public int maxSlots = 30;
        private List<ItemData> inventory = new List<ItemData>();
        private Dictionary<EquipmentSlot, ItemData> equippedGear = new Dictionary<EquipmentSlot, ItemData>();
        private float totalWeight = 0.0f;

        public bool EquipItem(ItemData item, EquipmentSlot slot) 
        {
            if (item == null) throw new ArgumentNullException(nameof(item));

            int requiredLevel = item.requiredLevel;
            int playerLevel = GameManager.Instance.PlayerLevel;

            if (playerLevel < requiredLevel) 
            {
                Debug.LogWarning($"Level too low: requires {requiredLevel}, current {playerLevel}");
                return false;
            }

            if (equippedGear.ContainsKey(slot)) 
            {
                ItemData previousItem = equippedGear[slot];
                inventory.Add(previousItem);
                totalWeight -= previousItem.weight;
            }

            equippedGear[slot] = item;
            inventory.Remove(item);
            totalWeight += item.weight;

            AudioEngine.PlaySFX("equip_armor_metal");
            RecalculatePlayerStats();
            return true;
        }

        private void RecalculatePlayerStats() 
        {
            float bonusArmor = 0;
            float bonusAttack = 0;
            foreach (var kvp in equippedGear) 
            {
                bonusArmor += kvp.Value.armor;
                bonusAttack += kvp.Value.attackPower;
            }
            GameManager.Instance.ApplyStatModifiers(bonusArmor, bonusAttack);
        }
    }
}`
  },
  cpp: {
    id: 'SpatialOctreePhysics.cpp',
    name: 'SpatialOctreePhysics.cpp',
    language: 'cpp',
    path: 'Engine/Source/Physics/SpatialOctreePhysics.cpp',
    code: `#include "SpatialOctreePhysics.h"
#include <immintrin.h>
#include <cmath>

namespace OmniPhysics {

OctreeNode* OctreeNode::InsertBody(RigidBody* body, int depth) {
    if (depth >= MAX_OCTREE_DEPTH) {
        this->elements.push_back(body);
        return this;
    }

    Vec3 center = this->boundingBox.GetCenter();
    int octantIndex = 0;
    if (body->position.x > center.x) octantIndex |= 1;
    if (body->position.y > center.y) octantIndex |= 2;
    if (body->position.z > center.z) octantIndex |= 4;

    if (!this->children[octantIndex]) {
        AABB childBounds = CalculateOctantBounds(this->boundingBox, octantIndex);
        this->children[octantIndex] = new OctreeNode(childBounds, depth + 1);
    }

    return this->children[octantIndex]->InsertBody(body, depth + 1);
}

bool OctreeNode::RaycastBroadphase(const Ray& ray, RaycastHit& outHit) {
    float tNear = 0.0f, tFar = 1000.0f;
    if (!this->boundingBox.IntersectRay(ray, tNear, tFar)) {
        return false;
    }

    bool hitFound = false;
    float closestDist = 1e9f;

    for (RigidBody* body : this->elements) {
        float hitDist = 0.0f;
        if (body->collider->Intersect(ray, hitDist)) {
            if (hitDist < closestDist) {
                closestDist = hitDist;
                outHit.hitPoint = ray.origin + ray.direction * hitDist;
                outHit.collider = body->collider;
                hitFound = true;
            }
        }
    }
    return hitFound;
}

}`
  },
  hlsl: {
    id: 'PBRDeferredLighting.hlsl',
    name: 'PBRDeferredLighting.hlsl',
    language: 'hlsl',
    path: 'Shaders/PBRDeferredLighting.hlsl',
    code: `// OmniEngine Real-Time PBR Deferred Pixel Shader
#include "CommonShading.hlsli"

Texture2D g_GBufferAlbedo    : register(t0);
Texture2D g_GBufferNormal    : register(t1);
Texture2D g_GBufferMaterial  : register(t2); // R: Roughness, G: Metallic, B: AO
Texture2D g_DepthBuffer      : register(t3);
SamplerState g_LinearSampler : register(s0);

struct PS_INPUT {
    float4 Position : SV_POSITION;
    float2 TexCoord : TEXCOORD0;
};

float3 FresnelSchlick(float cosTheta, float3 F0) {
    return F0 + (1.0 - F0) * pow(saturate(1.0 - cosTheta), 5.0);
}

float DistributionGGX(float3 N, float3 H, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH * NdotH;
    float num = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    return num / (3.14159265 * denom * denom + 0.0001);
}

float4 MainPS(PS_INPUT input) : SV_TARGET {
    float3 albedo = g_GBufferAlbedo.Sample(g_LinearSampler, input.TexCoord).rgb;
    float3 normal = normalize(g_GBufferNormal.Sample(g_LinearSampler, input.TexCoord).xyz * 2.0 - 1.0);
    float4 matParams = g_GBufferMaterial.Sample(g_LinearSampler, input.TexCoord);
    
    float roughness = matParams.r;
    float metallic  = matParams.g;
    float ao        = matParams.b;

    float3 lightDir = normalize(float3(0.5, 1.0, -0.3));
    float3 lightColor = float3(1.2, 1.15, 1.0) * 4.5;
    float3 viewDir = normalize(float3(0, 0, -1));
    float3 halfVec = normalize(lightDir + viewDir);

    float NdotL = max(dot(normal, lightDir), 0.0);
    float3 F0 = lerp(float3(0.04, 0.04, 0.04), albedo, metallic);
    float3 F = FresnelSchlick(max(dot(halfVec, viewDir), 0.0), F0);
    float NDF = DistributionGGX(normal, halfVec, roughness);

    float3 directSpec = (NDF * F) / (4.0 * max(dot(normal, viewDir), 0.0) * NdotL + 0.001);
    float3 directDiffuse = (1.0 - metallic) * (albedo / 3.14159265);
    float3 finalColor = (directDiffuse + directSpec) * lightColor * NdotL * ao;

    return float4(finalColor, 1.0);
}`
  },
  python: {
    id: 'BehaviorTreeAIAgent.py',
    name: 'BehaviorTreeAIAgent.py',
    language: 'python',
    path: 'scripts/ai/BehaviorTreeAIAgent.py',
    code: `"""
OmniEngine - NPC Decision Making & Navigation Behavior Tree
"""
import math
import random

class AIBehaviorNode:
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"
    RUNNING = "RUNNING"

class CombatDecisionTree:
    def __init__(self, agent_name: str, aggression_factor: float = 0.75):
        self.agent_name = agent_name
        self.aggression = aggression_factor
        self.health = 100.0
        self.mana = 50.0
        self.blackboard = {}
        self.target_distance = 18.5
        self.has_line_of_sight = True

    def evaluate_threat(self, threat_level: int) -> str:
        danger_threshold = 40.0
        if self.health < danger_threshold:
            if self.mana >= 20.0:
                self.mana -= 20.0
                self.health += 35.0
                self.blackboard["last_action"] = "HEAL_SPELL"
                return AIBehaviorNode.SUCCESS
            else:
                self.blackboard["last_action"] = "RETREAT"
                return AIBehaviorNode.RUNNING

        # Aggressive branch
        if self.has_line_of_sight and self.target_distance <= 25.0:
            attack_roll = random.random()
            if attack_roll <= self.aggression:
                dmg = 20.0 + (threat_level * 2.5)
                self.blackboard["calculated_dmg"] = dmg
                self.blackboard["last_action"] = "EXECUTE_RANGED_FLURRY"
                return AIBehaviorNode.SUCCESS

        return AIBehaviorNode.FAILURE
`
  },
  lua: {
    id: 'DialogueQuestGraph.lua',
    name: 'DialogueQuestGraph.lua',
    language: 'lua',
    path: 'scripts/quests/DialogueQuestGraph.lua',
    code: `-- OmniEngine - Quest & Branching Dialogue Evaluator
local QuestEngine = require("OmniQuestCore")
local Audio = require("OmniAudio")

local DialogueEvaluator = {}
DialogueEvaluator.__index = DialogueEvaluator

function DialogueEvaluator.new(npcId, playerEntity)
    local self = setmetatable({}, DialogueEvaluator)
    self.npcId = npcId
    self.player = playerEntity
    self.currentReputation = 55
    self.questStage = 1
    self.goldReward = 250
    return self
end

function DialogueEvaluator:EvaluateNode(choiceIndex, karmaValue)
    local responseText = ""
    local isUnlocked = false

    if choiceIndex == 1 then
        if self.currentReputation >= 50 then
            responseText = "Thank you traveler! Take this ancient dragon map."
            self.questStage = 2
            self.player:AddGold(self.goldReward)
            Audio.PlayDialogue("npc_elder_gratitude.dsp")
            isUnlocked = true
        else
            responseText = "You are not yet trusted in this village."
            isUnlocked = false
        end
    elseif choiceIndex == 2 then
        self.currentReputation = self.currentReputation - 10
        responseText = "How dare you demand more compensation!"
        Audio.PlayDialogue("npc_elder_anger.dsp")
        isUnlocked = false
    end

    return {
        text = responseText,
        unlocked = isUnlocked,
        stage = self.questStage
    }
end

return DialogueEvaluator
`
  }
};

// Initial stack frames per language for simulation
const INITIAL_STACK_FRAMES: Record<DebugLanguage, StackFrame[]> = {
  typescript: [
    {
      id: 'f1',
      functionName: 'executeComboSlash(target: Entity, powerMultiplier: 1.8)',
      fileId: 'PlayerCombatController.ts',
      line: 22,
      column: 5,
      module: 'OmniEngine.Gameplay.Combat',
      variables: {
        local: {
          baseDamage: 35.0,
          critChance: 0.25,
          isCritical: true,
          powerMultiplier: 1.8,
          finalDamage: 157.5,
          targetHealth: 42.5
        },
        closure: {
          this: {
            stamina: 85,
            comboCount: 3,
            isInvulnerable: false,
            activeTarget: { id: 'npc_boss_dragon_01', type: 'Boss', hp: 42.5, maxHp: 500 }
          }
        },
        global: {
          'Engine.Time.deltaTime': 0.0166,
          'Engine.Physics.gravity': -9.81,
          'World.activeEntitiesCount': 142
        }
      }
    },
    {
      id: 'f2',
      functionName: 'PlayerCombatController.onAttackTrigger()',
      fileId: 'PlayerCombatController.ts',
      line: 64,
      column: 12,
      module: 'OmniEngine.Gameplay.Input',
      variables: {
        local: { inputComboIndex: 2, chargeTime: 0.42 },
        closure: {},
        global: {}
      }
    },
    {
      id: 'f3',
      functionName: 'EngineLoop.Tick(deltaTime: 0.016)',
      fileId: 'EngineRuntime.ts',
      line: 198,
      column: 1,
      module: 'OmniEngine.Core',
      variables: {
        local: { frameIndex: 12490, frameBudgetMs: 16.6 },
        closure: {},
        global: {}
      }
    }
  ],
  csharp: [
    {
      id: 'f_cs1',
      functionName: 'EquipItem(ItemData item, EquipmentSlot slot)',
      fileId: 'InventoryEquipmentManager.cs',
      line: 28,
      column: 13,
      module: 'OmniGame.Systems',
      variables: {
        local: {
          item: { name: 'Dragonscale Plate Armor', requiredLevel: 15, armor: 85, weight: 14.5 },
          slot: 'Chest',
          requiredLevel: 15,
          playerLevel: 22,
          totalWeight: 42.8
        },
        closure: {
          this: { maxSlots: 30, inventoryCount: 14, equippedCount: 5 }
        },
        global: {
          'GameManager.Instance.PlayerLevel': 22,
          'GameManager.Instance.ActiveZone': 'Dragonspire Citadel'
        }
      }
    },
    {
      id: 'f_cs2',
      functionName: 'UIInventoryView.OnItemDoubleClicked(UIItemSlot slot)',
      fileId: 'UIInventoryView.cs',
      line: 112,
      column: 9,
      module: 'OmniGame.UI',
      variables: {
        local: { clickedSlotIndex: 4, clickInterval: 0.18 },
        closure: {},
        global: {}
      }
    }
  ],
  cpp: [
    {
      id: 'f_cpp1',
      functionName: 'OctreeNode::RaycastBroadphase(const Ray& ray, RaycastHit& outHit)',
      fileId: 'SpatialOctreePhysics.cpp',
      line: 32,
      column: 9,
      module: 'OmniPhysics.Core',
      variables: {
        local: {
          tNear: 4.12,
          tFar: 86.4,
          closestDist: 14.28,
          hitFound: true,
          'ray.origin': '{ x: 0.0, y: 1.8, z: -5.0 }',
          'ray.direction': '{ x: 0.12, y: -0.05, z: 0.99 }'
        },
        closure: {
          this: {
            depth: 3,
            elementsCount: 6,
            'boundingBox.min': '{ x: -10, y: -10, z: -10 }',
            'boundingBox.max': '{ x: 10, y: 10, z: 10 }'
          }
        },
        global: {
          MAX_OCTREE_DEPTH: 8,
          TotalCollidersInWorld: 4096
        }
      }
    }
  ],
  hlsl: [
    {
      id: 'f_hlsl1',
      functionName: 'MainPS(PS_INPUT input) : SV_TARGET',
      fileId: 'PBRDeferredLighting.hlsl',
      line: 48,
      column: 5,
      module: 'OmniShaders.PBR',
      variables: {
        local: {
          albedo: 'float3(0.85, 0.22, 0.18)',
          normal: 'float3(0.0, 0.92, 0.38)',
          roughness: 0.32,
          metallic: 0.85,
          ao: 0.95,
          NDF: 1.84,
          NdotL: 0.78,
          finalColor: 'float3(2.41, 0.82, 0.65)'
        },
        closure: {
          'CB_PerFrame': { lightCount: 8, ambientIntensity: 0.15 }
        },
        global: {
          'SV_Position': 'float4(960.0, 540.0, 0.98, 1.0)',
          'TexCoord': 'float2(0.5, 0.5)'
        }
      }
    }
  ],
  python: [
    {
      id: 'f_py1',
      functionName: 'evaluate_threat(threat_level=4)',
      fileId: 'BehaviorTreeAIAgent.py',
      line: 28,
      column: 9,
      module: 'scripts.ai.BehaviorTreeAIAgent',
      variables: {
        local: {
          threat_level: 4,
          danger_threshold: 40.0,
          attack_roll: 0.42,
          calculated_dmg: 30.0
        },
        closure: {
          'self.health': 78.0,
          'self.mana': 50.0,
          'self.aggression': 0.75,
          'self.target_distance': 18.5
        },
        global: {
          'AIBehaviorNode.SUCCESS': 'SUCCESS',
          'AIBehaviorNode.RUNNING': 'RUNNING'
        }
      }
    }
  ],
  lua: [
    {
      id: 'f_lua1',
      functionName: 'DialogueEvaluator:EvaluateNode(choiceIndex=1, karmaValue=10)',
      fileId: 'DialogueQuestGraph.lua',
      line: 23,
      column: 9,
      module: 'scripts.quests.DialogueQuestGraph',
      variables: {
        local: {
          choiceIndex: 1,
          karmaValue: 10,
          responseText: 'Thank you traveler! Take this ancient dragon map.',
          isUnlocked: true
        },
        closure: {
          'self.currentReputation': 55,
          'self.questStage': 2,
          'self.goldReward': 250
        },
        global: {
          '_G.ActiveQuestId': 'QUEST_DRAGON_LAIR_01'
        }
      }
    }
  ]
};

export default function InteractiveDebuggerStudio() {
  // Current active language & file
  const [selectedLanguage, setSelectedLanguage] = useState<DebugLanguage>('typescript');
  const activeFile = SAMPLE_FILES[selectedLanguage];

  // Breakpoints
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([
    { id: 'bp1', fileId: 'PlayerCombatController.ts', line: 22, enabled: true, condition: 'powerMultiplier > 1.0', hitCountCurrent: 3 },
    { id: 'bp2', fileId: 'PlayerCombatController.ts', line: 36, enabled: true, logMessage: 'Critical hit evaluated: {isCritical}' },
    { id: 'bp3', fileId: 'InventoryEquipmentManager.cs', line: 28, enabled: true },
    { id: 'bp4', fileId: 'SpatialOctreePhysics.cpp', line: 32, enabled: true, condition: 'hitDist < closestDist' },
    { id: 'bp5', fileId: 'PBRDeferredLighting.hlsl', line: 48, enabled: true },
    { id: 'bp6', fileId: 'BehaviorTreeAIAgent.py', line: 28, enabled: true }
  ]);

  // Watch expressions
  const [watchExpressions, setWatchExpressions] = useState<WatchExpression[]>([
    { id: 'w1', expression: 'finalDamage', value: '157.5', type: 'number' },
    { id: 'w2', expression: 'this.stamina', value: '85', type: 'number' },
    { id: 'w3', expression: 'this.activeTarget.hp', value: '42.5', type: 'number' },
    { id: 'w4', expression: 'isCritical && powerMultiplier > 1.5', value: 'true', type: 'boolean' }
  ]);
  const [newWatchInput, setNewWatchInput] = useState('');
  const [isAddingWatch, setIsAddingWatch] = useState(false);

  // Stack frames & threads
  const [stackFrames, setStackFrames] = useState<StackFrame[]>(INITIAL_STACK_FRAMES.typescript);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);

  // Threads
  const [threads, setThreads] = useState<DebugThread[]>([
    { id: 't1', name: 'Main Game Thread (Thread 0)', state: 'paused', frames: INITIAL_STACK_FRAMES.typescript },
    { id: 't2', name: 'Physics Worker (PhysX Pool 1)', state: 'running', frames: [] },
    { id: 't3', name: 'Audio DSP Thread (0ms Latency)', state: 'running', frames: [] },
    { id: 't4', name: 'Render Hardware Pipeline (GPU)', state: 'running', frames: [] }
  ]);
  const [activeThreadId, setActiveThreadId] = useState('t1');

  // Debug State Engine
  const [debugState, setDebugState] = useState<DebugState>({
    isRunning: true,
    isPaused: true,
    currentFileId: activeFile.id,
    currentLine: 22,
    activeThreadId: 't1',
    selectedFrameIndex: 0,
    stepCount: 142,
    executionHistory: [
      { stepIndex: 140, fileId: 'PlayerCombatController.ts', line: 18, functionName: 'executeComboSlash', variablesSnapshot: { stamina: 100, baseDamage: 35.0 } },
      { stepIndex: 141, fileId: 'PlayerCombatController.ts', line: 20, functionName: 'executeComboSlash', variablesSnapshot: { stamina: 85, baseDamage: 35.0, isCritical: true } },
      { stepIndex: 142, fileId: 'PlayerCombatController.ts', line: 22, functionName: 'executeComboSlash', variablesSnapshot: { stamina: 85, finalDamage: 157.5, isCritical: true } }
    ],
    historyCursor: 2,
    speedMs: 300,
    logs: [
      { timestamp: '10:42:01.102', type: 'info', text: '[Debugger] Attached to runtime process (PID: 94812, Arch: x86_64 SIMD AVX2).' },
      { timestamp: '10:42:01.450', type: 'info', text: '[Symbols] Loaded debug symbols (.pdb / .d.ts / sourcemaps).' },
      { timestamp: '10:42:02.018', type: 'debug', text: '[Break] Hit breakpoint #1 at PlayerCombatController.ts:22 (Condition satisfied: powerMultiplier > 1.0)' },
      { timestamp: '10:42:02.020', type: 'warn', text: '[Watchdog] Target Boss health dropped below 15% threshold.' }
    ]
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'variables' | 'watch' | 'callstack' | 'breakpoints' | 'memory' | 'history'>('variables');
  const [consoleInput, setConsoleInput] = useState('');
  const [hoveredVar, setHoveredVar] = useState<{ name: string; value: string; type: string; x: number; y: number } | null>(null);
  const [editingVar, setEditingVar] = useState<{ path: string; value: string } | null>(null);
  const [editingVarValue, setEditingVarValue] = useState('');
  const [conditionalModalBp, setConditionalModalBp] = useState<Breakpoint | null>(null);
  const [bpConditionInput, setBpConditionInput] = useState('');
  const [bpLogInput, setBpLogInput] = useState('');

  // Auto-scrolling logs
  const logsEndRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLDivElement>(null);

  // Update frames and active line when language changes
  useEffect(() => {
    const defaultFrames = INITIAL_STACK_FRAMES[selectedLanguage] || [];
    setStackFrames(defaultFrames);
    setSelectedFrameIndex(0);
    const topFrame = defaultFrames[0];
    if (topFrame) {
      setDebugState(prev => ({
        ...prev,
        currentFileId: topFrame.fileId,
        currentLine: topFrame.line,
        logs: [
          ...prev.logs,
          { timestamp: new Date().toLocaleTimeString(), type: 'info', text: `[Language] Switched debugger context to: ${selectedLanguage.toUpperCase()} (${topFrame.fileId})` }
        ]
      }));
    }
  }, [selectedLanguage]);

  // Current scope variables from selected frame
  const currentFrame = stackFrames[selectedFrameIndex] || stackFrames[0];

  // Evaluate Watch Expressions dynamically
  const evaluateExpressions = () => {
    if (!currentFrame) return;
    const allVars: Record<string, any> = {
      ...currentFrame.variables.global,
      ...currentFrame.variables.closure,
      ...currentFrame.variables.local
    };

    setWatchExpressions(prev => prev.map(w => {
      try {
        if (w.expression in allVars) {
          return { ...w, value: JSON.stringify(allVars[w.expression]), type: typeof allVars[w.expression], isError: false };
        }
        if (w.expression.includes('.')) {
          const parts = w.expression.split('.');
          let val: any = allVars;
          for (const p of parts) {
            if (val && typeof val === 'object' && p in val) {
              val = val[p];
            } else if (p === 'stamina' && allVars['this']?.stamina !== undefined) {
              val = allVars['this'].stamina;
            } else if (p === 'hp' && allVars['this']?.activeTarget?.hp !== undefined) {
              val = allVars['this'].activeTarget.hp;
            } else {
              val = undefined;
              break;
            }
          }
          if (val !== undefined) {
            return { ...w, value: typeof val === 'object' ? JSON.stringify(val) : String(val), type: typeof val, isError: false };
          }
        }
        // Simulated math or boolean eval
        if (w.expression.includes('>')) {
          return { ...w, value: 'true', type: 'boolean', isError: false };
        }
        return { ...w, value: 'undefined', type: 'undefined', isError: false };
      } catch (err: any) {
        return { ...w, value: err.message || 'Evaluation Error', type: 'error', isError: true };
      }
    }));
  };

  useEffect(() => {
    evaluateExpressions();
  }, [selectedFrameIndex, stackFrames, debugState.currentLine]);

  // Step Controls (F10: Step Over, F11: Step Into, Shift+F11: Step Out, F5: Continue)
  const handleStepOver = () => {
    setDebugState(prev => {
      const nextLine = prev.currentLine >= 45 ? 18 : prev.currentLine + 2;
      const newStep = prev.stepCount + 1;
      const newSnapshot = {
        ...currentFrame?.variables.local,
        stamina: Math.max(0, (currentFrame?.variables.local.stamina || 85) - 5),
        comboCount: (currentFrame?.variables.closure.this?.comboCount || 3) + 1
      };
      
      const newHistory = [
        ...prev.executionHistory,
        {
          stepIndex: newStep,
          fileId: prev.currentFileId,
          line: nextLine,
          functionName: currentFrame?.functionName || 'exec',
          variablesSnapshot: newSnapshot
        }
      ];

      return {
        ...prev,
        isPaused: true,
        currentLine: nextLine,
        stepCount: newStep,
        executionHistory: newHistory,
        historyCursor: newHistory.length - 1,
        logs: [
          ...prev.logs,
          {
            timestamp: new Date().toLocaleTimeString(),
            type: 'debug',
            text: `[Step Over] Advanced to line ${nextLine} in ${prev.currentFileId}`
          }
        ]
      };
    });

    // Mutate frame local vars
    setStackFrames(prev => {
      const copy = [...prev];
      if (copy[0]) {
        copy[0] = {
          ...copy[0],
          line: copy[0].line + 2 > 45 ? 18 : copy[0].line + 2,
          variables: {
            ...copy[0].variables,
            local: {
              ...copy[0].variables.local,
              finalDamage: +(copy[0].variables.local.finalDamage * 1.05).toFixed(2),
              targetHealth: Math.max(0, +(copy[0].variables.local.targetHealth - 12).toFixed(1))
            }
          }
        };
      }
      return copy;
    });
  };

  const handleStepInto = () => {
    setDebugState(prev => ({
      ...prev,
      isPaused: true,
      logs: [
        ...prev.logs,
        {
          timestamp: new Date().toLocaleTimeString(),
          type: 'debug',
          text: `[Step Into] Entered function: applyDamage() at Entity.ts:88`
        }
      ]
    }));

    setStackFrames(prev => [
      {
        id: 'f_into_' + Date.now(),
        functionName: 'Entity.applyDamage(amount: 157.5, attacker: Player)',
        fileId: 'Entity.ts',
        line: 88,
        column: 3,
        module: 'OmniEngine.Core.Entities',
        variables: {
          local: { amount: 157.5, attackerId: 'player_01', armorMitigation: 0.15 },
          closure: { isInvulnerable: false, currentHp: 42.5 },
          global: {}
        }
      },
      ...prev
    ]);
    setSelectedFrameIndex(0);
  };

  const handleStepOut = () => {
    if (stackFrames.length > 1) {
      setStackFrames(prev => prev.slice(1));
      setSelectedFrameIndex(0);
      setDebugState(prev => ({
        ...prev,
        isPaused: true,
        currentLine: stackFrames[1]?.line || 22,
        logs: [
          ...prev.logs,
          {
            timestamp: new Date().toLocaleTimeString(),
            type: 'debug',
            text: `[Step Out] Returned to frame: ${stackFrames[1]?.functionName}`
          }
        ]
      }));
    }
  };

  const handleContinue = () => {
    setDebugState(prev => ({
      ...prev,
      isPaused: false,
      logs: [
        ...prev.logs,
        { timestamp: new Date().toLocaleTimeString(), type: 'info', text: '[Continue] Resumed execution until next breakpoint.' }
      ]
    }));

    setTimeout(() => {
      // simulate hitting breakpoint again
      setDebugState(prev => ({
        ...prev,
        isPaused: true,
        currentLine: 22,
        logs: [
          ...prev.logs,
          { timestamp: new Date().toLocaleTimeString(), type: 'debug', text: '[Break] Paused at Breakpoint #1 (PlayerCombatController.ts:22)' }
        ]
      }));
    }, 800);
  };

  const handlePause = () => {
    setDebugState(prev => ({
      ...prev,
      isPaused: true,
      logs: [
        ...prev.logs,
        { timestamp: new Date().toLocaleTimeString(), type: 'warn', text: '[Pause] Interrupted by user pause request.' }
      ]
    }));
  };

  const handleRestart = () => {
    setStackFrames(INITIAL_STACK_FRAMES[selectedLanguage]);
    setSelectedFrameIndex(0);
    setDebugState(prev => ({
      ...prev,
      isPaused: true,
      currentLine: INITIAL_STACK_FRAMES[selectedLanguage][0]?.line || 22,
      stepCount: 1,
      logs: [
        ...prev.logs,
        { timestamp: new Date().toLocaleTimeString(), type: 'info', text: '[Restart] Debugger reset to initial entry state.' }
      ]
    }));
  };

  const handleToggleBreakpoint = (line: number) => {
    const existing = breakpoints.find(b => b.fileId === activeFile.id && b.line === line);
    if (existing) {
      setBreakpoints(prev => prev.filter(b => b.id !== existing.id));
      setDebugState(prev => ({
        ...prev,
        logs: [...prev.logs, { timestamp: new Date().toLocaleTimeString(), type: 'info', text: `[Breakpoint] Removed at ${activeFile.id}:${line}` }]
      }));
    } else {
      const newBp: Breakpoint = {
        id: 'bp_' + Date.now(),
        fileId: activeFile.id,
        line,
        enabled: true
      };
      setBreakpoints(prev => [...prev, newBp]);
      setDebugState(prev => ({
        ...prev,
        logs: [...prev.logs, { timestamp: new Date().toLocaleTimeString(), type: 'info', text: `[Breakpoint] Added at ${activeFile.id}:${line}` }]
      }));
    }
  };

  const handleAddWatch = () => {
    if (!newWatchInput.trim()) return;
    const newW: WatchExpression = {
      id: 'w_' + Date.now(),
      expression: newWatchInput.trim(),
      value: 'evaluating...',
      type: 'unknown'
    };
    setWatchExpressions(prev => [...prev, newW]);
    setNewWatchInput('');
    setIsAddingWatch(false);
  };

  const handleREPLEval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;
    const cmd = consoleInput.trim();
    setConsoleInput('');

    let evalResult = '';
    const locals = currentFrame?.variables.local || {};
    const closures = currentFrame?.variables.closure || {};

    if (cmd in locals) {
      evalResult = JSON.stringify(locals[cmd]);
    } else if (cmd in closures) {
      evalResult = JSON.stringify(closures[cmd]);
    } else if (cmd.startsWith('player.') || cmd.includes('damage') || cmd.includes('hp')) {
      evalResult = '>> Applied runtime hot-patch: Entity state updated successfully.';
    } else {
      try {
        // Safe mock evaluator
        evalResult = `>> Result: ${eval(cmd) ?? 'undefined'}`;
      } catch (err: any) {
        evalResult = `>> ReferenceError: "${cmd}" is not defined in current scope frame.`;
      }
    }

    setDebugState(prev => ({
      ...prev,
      logs: [
        ...prev.logs,
        { timestamp: new Date().toLocaleTimeString(), type: 'eval', text: `> ${cmd}` },
        { timestamp: new Date().toLocaleTimeString(), type: evalResult.includes('Error') ? 'error' : 'info', text: evalResult }
      ]
    }));
  };

  const handleEditVariableSubmit = (path: string) => {
    if (!editingVar) return;
    setStackFrames(prev => {
      const copy = [...prev];
      if (copy[selectedFrameIndex]) {
        const frame = { ...copy[selectedFrameIndex] };
        if (path in frame.variables.local) {
          let parsedVal: any = editingVarValue;
          if (!isNaN(Number(editingVarValue))) parsedVal = Number(editingVarValue);
          else if (editingVarValue === 'true') parsedVal = true;
          else if (editingVarValue === 'false') parsedVal = false;
          frame.variables.local[path] = parsedVal;
        }
        copy[selectedFrameIndex] = frame;
      }
      return copy;
    });
    setEditingVar(null);
  };

  // Split code lines
  const codeLines = useMemo(() => activeFile.code.split('\n'), [activeFile.code]);

  return (
    <div className="w-full h-full bg-[#0d1117] text-gray-200 flex flex-col font-sans overflow-hidden select-none border border-[#30363d]">
      
      {/* Top Header Bar & Debug Control Toolbar */}
      <div className="h-12 bg-[#161b22] border-b border-[#30363d] px-3 flex items-center justify-between shrink-0">
        
        {/* Left: Branding & Language Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#21262d] px-2.5 py-1 rounded-md border border-[#30363d]">
            <Bug size={16} className="text-[#f85149] animate-pulse" />
            <span className="font-bold text-xs text-white tracking-wide">OMNI INTERACTIVE DEBUGGER</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 font-mono font-bold">
              ATTACHED: PID 94812
            </span>
          </div>

          <div className="h-5 w-[1px] bg-[#30363d]" />

          {/* Language Selector Pills */}
          <div className="flex items-center gap-1 bg-[#0d1117] p-0.5 rounded-lg border border-[#30363d]">
            {(['typescript', 'csharp', 'cpp', 'hlsl', 'python', 'lua'] as DebugLanguage[]).map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2 py-0.5 text-[11px] font-mono font-medium rounded transition-all flex items-center gap-1.5 ${
                  selectedLanguage === lang
                    ? 'bg-[#1f6feb] text-white shadow-sm font-bold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]'
                }`}
              >
                <FileCode size={12} />
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Debug Stepper Floating Action Ribbon */}
        <div className="flex items-center gap-1 bg-[#21262d] p-1 rounded-lg border border-[#30363d] shadow-lg">
          {debugState.isPaused ? (
            <button
              onClick={handleContinue}
              title="Continue / Resume (F5)"
              className="flex items-center gap-1.5 px-3 py-1 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold rounded transition-all active:scale-95 shadow-sm"
            >
              <Play size={14} className="fill-white" />
              <span>Resume (F5)</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              title="Pause Execution (F8)"
              className="flex items-center gap-1.5 px-3 py-1 bg-[#d29922] hover:bg-[#e3b341] text-black text-xs font-bold rounded transition-all active:scale-95 shadow-sm"
            >
              <Pause size={14} className="fill-black" />
              <span>Pause (F8)</span>
            </button>
          )}

          <div className="h-4 w-[1px] bg-[#30363d] mx-0.5" />

          <button
            onClick={handleStepOver}
            title="Step Over (F10) - Execute next line"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#30363d] hover:bg-[#388bfd]/20 hover:text-[#58a6ff] hover:border-[#58a6ff]/50 text-gray-200 text-xs font-medium rounded border border-[#30363d] transition-all"
          >
            <StepForward size={14} className="text-[#58a6ff]" />
            <span>Step Over (F10)</span>
          </button>

          <button
            onClick={handleStepInto}
            title="Step Into (F11) - Enter function call"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#30363d] hover:bg-[#a371f7]/20 hover:text-[#bc8cff] hover:border-[#bc8cff]/50 text-gray-200 text-xs font-medium rounded border border-[#30363d] transition-all"
          >
            <CornerDownRight size={14} className="text-[#bc8cff]" />
            <span>Step Into (F11)</span>
          </button>

          <button
            onClick={handleStepOut}
            title="Step Out (Shift+F11) - Return to caller"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#30363d] hover:bg-[#f0883e]/20 hover:text-[#ffa657] hover:border-[#ffa657]/50 text-gray-200 text-xs font-medium rounded border border-[#30363d] transition-all"
          >
            <CornerRightUp size={14} className="text-[#ffa657]" />
            <span>Step Out (⇧F11)</span>
          </button>

          <button
            onClick={handleRestart}
            title="Restart Debug Session (Ctrl+Shift+F5)"
            className="p-1.5 bg-[#30363d] hover:bg-[#21262d] text-gray-300 hover:text-white rounded border border-[#30363d] transition-all"
          >
            <RotateCcw size={14} />
          </button>

          <button
            onClick={() => setDebugState(prev => ({ ...prev, isRunning: false, isPaused: false }))}
            title="Stop Debugger (Shift+F5)"
            className="p-1.5 bg-[#30363d] hover:bg-[#f85149]/20 hover:text-[#f85149] rounded border border-[#30363d] transition-all"
          >
            <Square size={14} className="fill-[#f85149] text-[#f85149]" />
          </button>
        </div>

        {/* Right: Status & Step Metrics */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-gray-400 font-mono">STEP COUNTER</div>
            <div className="text-xs font-bold text-[#58a6ff] font-mono">#{debugState.stepCount}</div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0d1117] rounded border border-[#30363d]">
            <span className={`w-2 h-2 rounded-full ${debugState.isPaused ? 'bg-[#d29922] animate-ping' : 'bg-[#3fb950]'}`} />
            <span className="text-[11px] font-mono font-medium text-gray-300">
              {debugState.isPaused ? `PAUSED AT L:${debugState.currentLine}` : 'RUNNING'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Multi-Pane Debug Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Interactive Code Editor with Breakpoint Gutters */}
        <div className="flex-1 flex flex-col bg-[#0d1117] border-r border-[#30363d] overflow-hidden">
          
          {/* File Tab Bar */}
          <div className="h-8 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-3">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
              <Code2 size={14} className="text-[#58a6ff]" />
              <span className="font-semibold text-white">{activeFile.name}</span>
              <span className="text-gray-500 text-[10px]">({activeFile.path})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400 bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]">
                UTF-8 • {activeFile.language.toUpperCase()} • 60 FPS Engine Trace
              </span>
            </div>
          </div>

          {/* Interactive Code Gutter & Viewer */}
          <div ref={codeEditorRef} className="flex-1 overflow-auto font-mono text-xs leading-6 p-2 relative bg-[#090d13]">
            {codeLines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const hasBreakpoint = breakpoints.find(b => b.fileId === activeFile.id && b.line === lineNum);
              const isCurrentExecutingLine = debugState.currentLine === lineNum && debugState.isPaused;

              return (
                <div
                  key={lineNum}
                  className={`flex items-center group relative hover:bg-[#161b22]/70 rounded transition-colors ${
                    isCurrentExecutingLine ? 'bg-[#d29922]/20 border-y border-[#d29922]/60 font-semibold' : ''
                  }`}
                >
                  {/* Breakpoint Gutter Trigger */}
                  <div
                    onClick={() => handleToggleBreakpoint(lineNum)}
                    className="w-8 flex items-center justify-center shrink-0 cursor-pointer select-none relative group/bp"
                    title={`Click to toggle breakpoint on line ${lineNum}`}
                  >
                    {hasBreakpoint ? (
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-125 ${
                          hasBreakpoint.enabled
                            ? hasBreakpoint.condition
                              ? 'bg-[#a371f7] ring-2 ring-[#a371f7]/50'
                              : hasBreakpoint.logMessage
                                ? 'bg-[#58a6ff] ring-2 ring-[#58a6ff]/50'
                                : 'bg-[#f85149] ring-2 ring-[#f85149]/50'
                            : 'border-2 border-[#f85149] bg-transparent'
                        }`}
                      >
                        {hasBreakpoint.condition && <span className="text-[7px] text-white font-bold">?</span>}
                        {hasBreakpoint.logMessage && <span className="text-[7px] text-white font-bold">L</span>}
                      </div>
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f85149]/30 opacity-0 group-hover/bp:opacity-100 transition-opacity" />
                    )}
                  </div>

                  {/* Execution Pointer Arrow */}
                  <div className="w-5 flex items-center justify-center shrink-0">
                    {isCurrentExecutingLine && (
                      <ArrowRight size={14} className="text-[#d29922] animate-bounce-horizontal fill-[#d29922]" />
                    )}
                  </div>

                  {/* Line Number */}
                  <div className={`w-10 text-right pr-3 shrink-0 select-none text-[11px] ${
                    isCurrentExecutingLine ? 'text-[#d29922] font-bold' : 'text-gray-500'
                  }`}>
                    {lineNum}
                  </div>

                  {/* Code Line Content with Syntax Highlighting and Variable Hover Evaluator */}
                  <div className="flex-1 whitespace-pre pl-1 text-gray-300 hover:text-white">
                    {lineText.split(/(\b(?:let|const|var|function|public|private|class|return|if|else|bool|float|int|void|struct|namespace|float3|float4|local)\b|\b\d+\b|"[^"]*"|'[^']*'|\/\/.*$)/g).map((token, tIdx) => {
                      if (!token) return null;
                      const isKeyword = /^(let|const|var|function|public|private|class|return|if|else|bool|float|int|void|struct|namespace|float3|float4|local)$/.test(token);
                      const isNumber = /^\d+$/.test(token);
                      const isString = /^["'].*["']$/.test(token);
                      const isComment = token.startsWith('//') || token.startsWith('--') || token.startsWith('"""');

                      let colorClass = 'text-gray-300';
                      if (isKeyword) colorClass = 'text-[#ff7b72] font-semibold';
                      else if (isNumber) colorClass = 'text-[#79c0ff]';
                      else if (isString) colorClass = 'text-[#a5d6ff]';
                      else if (isComment) colorClass = 'text-[#8b949e] italic';
                      else if (/^[A-Z][a-zA-Z0-9]+$/.test(token)) colorClass = 'text-[#ffa657] font-semibold';

                      return (
                        <span
                          key={tIdx}
                          className={`${colorClass} hover:underline cursor-text`}
                          onMouseEnter={(e) => {
                            if (currentFrame?.variables.local[token] !== undefined) {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredVar({
                                name: token,
                                value: JSON.stringify(currentFrame.variables.local[token]),
                                type: typeof currentFrame.variables.local[token],
                                x: rect.left,
                                y: rect.bottom + 4
                              });
                            }
                          }}
                          onMouseLeave={() => setHoveredVar(null)}
                        >
                          {token}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Variable Hover Tooltip */}
          {hoveredVar && (
            <div
              style={{ top: hoveredVar.y, left: hoveredVar.x }}
              className="fixed z-50 bg-[#1f242c] border border-[#58a6ff] rounded-md shadow-2xl p-2.5 text-xs font-mono text-white pointer-events-none max-w-xs animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="flex items-center gap-2 pb-1 border-b border-[#30363d] mb-1.5">
                <Variable size={12} className="text-[#58a6ff]" />
                <span className="font-bold text-[#58a6ff]">{hoveredVar.name}</span>
                <span className="px-1 py-0.2 rounded text-[9px] bg-[#30363d] text-gray-300">{hoveredVar.type}</span>
              </div>
              <div className="text-gray-200 break-all">{hoveredVar.value}</div>
            </div>
          )}

          {/* Bottom Execution Log & REPL Console */}
          <div className="h-44 bg-[#161b22] border-t border-[#30363d] flex flex-col shrink-0">
            <div className="h-7 bg-[#21262d] border-b border-[#30363d] px-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                <Terminal size={13} className="text-[#58a6ff]" />
                <span>DEBUG CONSOLE & REPL (IMMEDIATE WINDOW)</span>
              </div>
              <button
                onClick={() => setDebugState(prev => ({ ...prev, logs: [] }))}
                className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
              >
                <Trash2 size={10} /> Clear Console
              </button>
            </div>

            {/* Log Stream */}
            <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] flex flex-col gap-1 bg-[#0d1117]">
              {debugState.logs.map((log, lIdx) => (
                <div key={lIdx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-gray-500 text-[10px] shrink-0">{log.timestamp}</span>
                  {log.type === 'eval' ? (
                    <span className="text-[#58a6ff] font-bold">{log.text}</span>
                  ) : log.type === 'error' ? (
                    <span className="text-[#f85149]">{log.text}</span>
                  ) : log.type === 'warn' ? (
                    <span className="text-[#d29922]">{log.text}</span>
                  ) : log.type === 'debug' ? (
                    <span className="text-[#a371f7]">{log.text}</span>
                  ) : (
                    <span className="text-gray-300">{log.text}</span>
                  )}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Live REPL Input */}
            <form onSubmit={handleREPLEval} className="h-8 bg-[#21262d] border-t border-[#30363d] flex items-center px-2">
              <span className="text-[#58a6ff] font-mono font-bold mr-2 text-xs">{'>'}</span>
              <input
                type="text"
                value={consoleInput}
                onChange={e => setConsoleInput(e.target.value)}
                placeholder="Type expression to evaluate in current stack frame (e.g. finalDamage * 2, this.stamina)..."
                className="flex-1 bg-transparent text-white font-mono text-xs outline-none placeholder-gray-500"
              />
              <button type="submit" className="text-gray-400 hover:text-white p-1">
                <CornerDownLeft size={12} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Variable Inspector, Call Stack, Watch Expressions & Breakpoint Manager */}
        <div className="w-96 bg-[#161b22] flex flex-col shrink-0 overflow-hidden">
          
          {/* Navigation Tabs */}
          <div className="flex items-center bg-[#0d1117] border-b border-[#30363d] p-1 gap-1">
            <button
              onClick={() => setActiveTab('variables')}
              className={`flex-1 py-1.5 text-[11px] font-semibold rounded flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'variables'
                  ? 'bg-[#21262d] text-[#58a6ff] border border-[#30363d]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Variable size={13} />
              <span>Variables</span>
            </button>

            <button
              onClick={() => setActiveTab('watch')}
              className={`flex-1 py-1.5 text-[11px] font-semibold rounded flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'watch'
                  ? 'bg-[#21262d] text-[#a371f7] border border-[#30363d]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Eye size={13} />
              <span>Watch ({watchExpressions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('callstack')}
              className={`flex-1 py-1.5 text-[11px] font-semibold rounded flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'callstack'
                  ? 'bg-[#21262d] text-[#3fb950] border border-[#30363d]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Layers size={13} />
              <span>Call Stack</span>
            </button>

            <button
              onClick={() => setActiveTab('breakpoints')}
              className={`flex-1 py-1.5 text-[11px] font-semibold rounded flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'breakpoints'
                  ? 'bg-[#21262d] text-[#f85149] border border-[#30363d]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Bookmark size={13} />
              <span>Breakpoints</span>
            </button>
          </div>

          {/* Sub-Pane Contents */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4 font-mono text-xs">
            
            {/* 1. VARIABLES SCOPE INSPECTOR */}
            {activeTab === 'variables' && currentFrame && (
              <div className="flex flex-col gap-3">
                {/* Local Scope */}
                <div className="bg-[#0d1117] rounded-lg border border-[#30363d] overflow-hidden">
                  <div className="bg-[#21262d] px-3 py-1.5 border-b border-[#30363d] flex items-center justify-between">
                    <span className="font-bold text-[#58a6ff] text-[11px] flex items-center gap-1.5">
                      <ChevronDown size={14} /> Local Scope ({Object.keys(currentFrame.variables.local).length})
                    </span>
                    <span className="text-[10px] text-gray-500">{currentFrame.functionName.split('(')[0]}</span>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    {Object.entries(currentFrame.variables.local).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between py-1 px-1.5 hover:bg-[#161b22] rounded group">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-[#ffa657] font-semibold">{key}:</span>
                          {editingVar?.path === key ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editingVarValue}
                                onChange={e => setEditingVarValue(e.target.value)}
                                className="bg-[#21262d] text-white px-1.5 py-0.5 rounded text-xs border border-[#58a6ff] outline-none"
                              />
                              <button onClick={() => handleEditVariableSubmit(key)} className="text-[#3fb950] p-0.5">
                                <Check size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[#79c0ff] truncate">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingVar({ path: key, value: String(val) });
                              setEditingVarValue(String(val));
                            }}
                            title="Edit value in memory"
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Edit3 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Closure / Object Scope */}
                <div className="bg-[#0d1117] rounded-lg border border-[#30363d] overflow-hidden">
                  <div className="bg-[#21262d] px-3 py-1.5 border-b border-[#30363d] flex items-center justify-between">
                    <span className="font-bold text-[#a371f7] text-[11px] flex items-center gap-1.5">
                      <ChevronDown size={14} /> Closure & Object Scope (this)
                    </span>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    {Object.entries(currentFrame.variables.closure).map(([key, val]) => (
                      <div key={key} className="flex flex-col py-1 px-1.5 hover:bg-[#161b22] rounded">
                        <div className="text-[#bc8cff] font-semibold">{key}:</div>
                        <pre className="text-[10px] text-gray-400 pl-3 whitespace-pre-wrap">
                          {JSON.stringify(val, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Global & Engine Scope */}
                <div className="bg-[#0d1117] rounded-lg border border-[#30363d] overflow-hidden">
                  <div className="bg-[#21262d] px-3 py-1.5 border-b border-[#30363d]">
                    <span className="font-bold text-[#3fb950] text-[11px] flex items-center gap-1.5">
                      <ChevronDown size={14} /> Global Engine State
                    </span>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    {Object.entries(currentFrame.variables.global).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between py-1 px-1.5 hover:bg-[#161b22] rounded">
                        <span className="text-[#7ee787]">{key}:</span>
                        <span className="text-gray-300 font-bold">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. WATCH EXPRESSIONS PANE */}
            {activeTab === 'watch' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Live Watch Expressions</span>
                  <button
                    onClick={() => setIsAddingWatch(true)}
                    className="flex items-center gap-1 px-2 py-0.5 bg-[#238636] hover:bg-[#2ea043] text-white text-[11px] font-semibold rounded"
                  >
                    <Plus size={12} /> Add Watch
                  </button>
                </div>

                {isAddingWatch && (
                  <div className="flex items-center gap-2 bg-[#21262d] p-2 rounded border border-[#58a6ff]">
                    <input
                      type="text"
                      value={newWatchInput}
                      onChange={e => setNewWatchInput(e.target.value)}
                      placeholder="Expression (e.g. this.stamina * 2)..."
                      className="flex-1 bg-transparent text-white text-xs outline-none font-mono"
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && handleAddWatch()}
                    />
                    <button onClick={handleAddWatch} className="text-[#3fb950] p-1"><Check size={14} /></button>
                    <button onClick={() => setIsAddingWatch(false)} className="text-[#f85149] p-1"><X size={14} /></button>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  {watchExpressions.map(w => (
                    <div key={w.id} className="bg-[#0d1117] border border-[#30363d] p-2.5 rounded-lg flex items-center justify-between group">
                      <div className="flex flex-col truncate">
                        <span className="text-[#a371f7] font-bold text-xs">{w.expression}</span>
                        <span className={`text-xs ${w.isError ? 'text-[#f85149]' : 'text-[#79c0ff]'}`}>
                          = {w.value}
                        </span>
                      </div>
                      <button
                        onClick={() => setWatchExpressions(prev => prev.filter(item => item.id !== w.id))}
                        className="text-gray-500 hover:text-[#f85149] opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CALL STACK & THREADS PANE */}
            {activeTab === 'callstack' && (
              <div className="flex flex-col gap-3">
                {/* Thread Selector */}
                <div className="bg-[#0d1117] rounded-lg border border-[#30363d] p-2">
                  <div className="text-[10px] text-gray-400 font-bold mb-1">ACTIVE THREAD</div>
                  <select
                    value={activeThreadId}
                    onChange={e => setActiveThreadId(e.target.value)}
                    className="w-full bg-[#21262d] text-white text-xs p-1.5 rounded border border-[#30363d] outline-none"
                  >
                    {threads.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.state.toUpperCase()})</option>
                    ))}
                  </select>
                </div>

                {/* Stack Frames List */}
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-bold text-gray-400">STACK FRAMES (CLICK TO JUMP FRAME CONTEXT)</div>
                  {stackFrames.map((frame, fIdx) => (
                    <div
                      key={frame.id}
                      onClick={() => {
                        setSelectedFrameIndex(fIdx);
                        setDebugState(prev => ({
                          ...prev,
                          currentFileId: frame.fileId,
                          currentLine: frame.line
                        }));
                      }}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        selectedFrameIndex === fIdx
                          ? 'bg-[#1f6feb]/20 border-[#58a6ff] shadow-sm'
                          : 'bg-[#0d1117] border-[#30363d] hover:bg-[#21262d]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-xs truncate ${selectedFrameIndex === fIdx ? 'text-[#58a6ff]' : 'text-gray-200'}`}>
                          {frame.functionName}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">Frame #{fIdx}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                        <span>{frame.fileId}:{frame.line}</span>
                        <span>•</span>
                        <span className="text-gray-500 truncate">{frame.module}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. BREAKPOINTS MANAGER PANE */}
            {activeTab === 'breakpoints' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Active Breakpoints ({breakpoints.length})</span>
                  <button
                    onClick={() => setBreakpoints([])}
                    className="text-[10px] text-[#f85149] hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  {breakpoints.map(bp => (
                    <div key={bp.id} className="bg-[#0d1117] border border-[#30363d] p-2.5 rounded-lg flex items-center justify-between group">
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={bp.enabled}
                          onChange={e => setBreakpoints(prev => prev.map(b => b.id === bp.id ? { ...b, enabled: e.target.checked } : b))}
                          className="rounded border-[#30363d] accent-[#f85149]"
                        />
                        <div className="flex flex-col truncate">
                          <span className="text-gray-200 font-bold text-xs">
                            {bp.fileId}:{bp.line}
                          </span>
                          {bp.condition && (
                            <span className="text-[10px] text-[#a371f7] truncate font-mono">
                              When: {bp.condition}
                            </span>
                          )}
                          {bp.logMessage && (
                            <span className="text-[10px] text-[#58a6ff] truncate font-mono">
                              Log: {bp.logMessage}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setBreakpoints(prev => prev.filter(b => b.id !== bp.id))}
                        className="text-gray-500 hover:text-[#f85149] p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Bottom Diagnostics Strip */}
          <div className="h-8 bg-[#21262d] border-t border-[#30363d] px-3 flex items-center justify-between text-[10px] font-mono text-gray-400">
            <span className="flex items-center gap-1 text-[#3fb950]">
              <CheckCircle2 size={12} /> Live Hot-Reload Engine Ready
            </span>
            <span>Speed: {debugState.speedMs}ms</span>
          </div>

        </div>

      </div>

    </div>
  );
}
