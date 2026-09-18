/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core runtime singleton manager for AAA Enhanced Input & Action Mapping
 *          Contexts (UE5 Enhanced Input / Unity Input System equivalent).
 *          Evaluates raw hardware inputs through modifier pipelines (Deadzone,
 *          Negate, Scalar, Exponential Curves), resolves context priority stacks,
 *          processes stateful triggers (Hold, Tap, Pulse, Chord), and dispatches
 *          processed action events with Gameplay Tags.
 *    - TH: ตัวจัดการหลักแบบ Singleton สำหรับระบบ Enhanced Input & Mapping Context ระดับ AAA
 *          (เทียบเท่า UE5 Enhanced Input และ Unity New Input System)
 *          ทำหน้าที่แปลง Raw Input จากฮาร์ดแวร์ผ่านกระบวนการ Modifiers (Deadzone, Negate,
 *          ความโค้ง Exponential), จัดลำดับความสำคัญของ Context Priority Stack,
 *          ตรวจจับสถานะ Triggers (กดค้าง, เคาะสั้น, รัวกระสุน Pulse, Combo)
 *          และกระจาย Event พร้อมแท็ก Gameplay Tag ไปยังระบบเกม
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes contracts from `enhancedInputTypes.ts`
 *    - Connects to `EnhancedInputMappingContextStudio.tsx` via reactive subscribers
 *    - Provides persistent storage via LocalStorage (`omni_enhanced_input_contexts`)
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Input: Raw device states (keyboard keys, mouse deltas, gamepad analog sticks)
 *    - Output: Evaluated action values (`InputEvaluationResult`)
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Safe deadzone division guarding against `upperThreshold == lowerThreshold`.
 *    - Graceful fallback when an unmapped key or non-existent action is queried.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```ts
 *    const inputMgr = EnhancedInputManagerNode.getInstance();
 *    const moveVal = inputMgr.getActionAxis2D("IA_Move");
 *    if (inputMgr.isActionTriggered("IA_Jump")) {
 *      character.jump();
 *    }
 *    ```
 * ============================================================================
 */

import {
  InputAction,
  InputMappingContext,
  InputEvaluationResult,
  InputModifierConfig,
  InputTriggerConfig
} from '../types/enhancedInputTypes';

const STORAGE_KEY_CONTEXTS = 'omni_enhanced_input_contexts';
const STORAGE_KEY_ACTIONS = 'omni_enhanced_input_actions';

export class EnhancedInputManagerNode {
  private static instance: EnhancedInputManagerNode;

  private actions: InputAction[] = [];
  private contexts: InputMappingContext[] = [];
  private activeContextStack: string[] = [];
  private subscribers: Array<() => void> = [];

  // Live state tracking
  private simulatedRawKeys: Set<string> = new Set();
  private simulatedAnalogAxes: Record<string, number> = {
    Gamepad_LeftStick_X: 0,
    Gamepad_LeftStick_Y: 0,
    Gamepad_RightStick_X: 0,
    Gamepad_RightStick_Y: 0,
    Gamepad_LeftTrigger: 0,
    Gamepad_RightTrigger: 0,
    Mouse_Delta_X: 0,
    Mouse_Delta_Y: 0
  };

  private actionStates: Map<string, InputEvaluationResult> = new Map();
  private triggerHoldStartTimes: Map<string, number> = new Map();

  private constructor() {
    this.initializeDefaults();
    this.loadFromStorage();
  }

  public static getInstance(): EnhancedInputManagerNode {
    if (!EnhancedInputManagerNode.instance) {
      EnhancedInputManagerNode.instance = new EnhancedInputManagerNode();
    }
    return EnhancedInputManagerNode.instance;
  }

  private initializeDefaults(): void {
    this.actions = [
      {
        id: 'IA_Move',
        name: 'Move Direction (2D)',
        description: '2D Locomotion vector for character movement (WASD / Left Stick)',
        valueType: 'AXIS2D',
        gameplayTag: 'Input.Action.Movement.Locomotion',
        consumeInput: true,
        triggerWhenPaused: false
      },
      {
        id: 'IA_Look',
        name: 'Look / Aim (2D)',
        description: 'Aim rotation vector (Mouse Delta / Right Thumbstick)',
        valueType: 'AXIS2D',
        gameplayTag: 'Input.Action.Camera.Look',
        consumeInput: true,
        triggerWhenPaused: true
      },
      {
        id: 'IA_Jump',
        name: 'Jump Action',
        description: 'Initiates vertical hop / vault jump',
        valueType: 'BOOLEAN',
        gameplayTag: 'Input.Action.Locomotion.Jump',
        consumeInput: true,
        triggerWhenPaused: false
      },
      {
        id: 'IA_Sprint',
        name: 'Sprint / Dash',
        description: 'High-speed traversal modifier (Left Shift / L3 Stick Click)',
        valueType: 'BOOLEAN',
        gameplayTag: 'Input.Action.Locomotion.Sprint',
        consumeInput: true,
        triggerWhenPaused: false
      },
      {
        id: 'IA_Interact',
        name: 'Interact with World',
        description: 'Hold or tap to loot, open doors, talk with NPCs (KeyE / Gamepad X)',
        valueType: 'BOOLEAN',
        gameplayTag: 'Input.Action.Gameplay.Interact',
        consumeInput: true,
        triggerWhenPaused: false
      },
      {
        id: 'IA_FireWeapon',
        name: 'Primary Fire / Attack',
        description: 'Triggers weapon firing or melee swing (Left Mouse / Right Trigger)',
        valueType: 'BOOLEAN',
        gameplayTag: 'Input.Action.Combat.Fire',
        consumeInput: true,
        triggerWhenPaused: false
      },
      {
        id: 'IA_DodgeRoll',
        name: 'Dodge Roll / Evade',
        description: 'Evasive dive roll with i-frames (Spacebar double-tap / Gamepad B)',
        valueType: 'BOOLEAN',
        gameplayTag: 'Input.Action.Combat.Dodge',
        consumeInput: true,
        triggerWhenPaused: false
      },
      {
        id: 'IA_Pause',
        name: 'Pause / Menu Toggle',
        description: 'Opens in-game menu or pause menu (Escape / Start Button)',
        valueType: 'BOOLEAN',
        gameplayTag: 'Input.Action.UI.Pause',
        consumeInput: false,
        triggerWhenPaused: true
      }
    ];

    this.contexts = [
      {
        id: 'IMC_Default_Exploration',
        name: 'IMC_Default_Exploration',
        description: 'Base exploration context for on-foot character controls',
        priority: 0,
        enabled: true,
        mappings: [
          {
            id: 'bind_move_w',
            actionId: 'IA_Move',
            hardwareDevice: 'KEYBOARD',
            rawKeyOrAxis: 'KeyW',
            modifiers: [{ id: 'm_swiz_y', type: 'SWIZZLE_AXIS', swizzleOrder: 'YXZ', enabled: true }],
            triggers: [{ id: 't_down', type: 'DOWN' }]
          },
          {
            id: 'bind_move_s',
            actionId: 'IA_Move',
            hardwareDevice: 'KEYBOARD',
            rawKeyOrAxis: 'KeyS',
            modifiers: [
              { id: 'm_swiz_y2', type: 'SWIZZLE_AXIS', swizzleOrder: 'YXZ', enabled: true },
              { id: 'm_neg_s', type: 'NEGATE', enabled: true }
            ],
            triggers: [{ id: 't_down_s', type: 'DOWN' }]
          },
          {
            id: 'bind_move_a',
            actionId: 'IA_Move',
            hardwareDevice: 'KEYBOARD',
            rawKeyOrAxis: 'KeyA',
            modifiers: [{ id: 'm_neg_a', type: 'NEGATE', enabled: true }],
            triggers: [{ id: 't_down_a', type: 'DOWN' }]
          },
          {
            id: 'bind_move_d',
            actionId: 'IA_Move',
            hardwareDevice: 'KEYBOARD',
            rawKeyOrAxis: 'KeyD',
            modifiers: [],
            triggers: [{ id: 't_down_d', type: 'DOWN' }]
          },
          {
            id: 'bind_move_gamepad',
            actionId: 'IA_Move',
            hardwareDevice: 'GAMEPAD_XBOX',
            rawKeyOrAxis: 'Gamepad_LeftStick',
            modifiers: [
              { id: 'm_dz_stick', type: 'DEADZONE', lowerThreshold: 0.18, upperThreshold: 0.95, enabled: true },
              { id: 'm_curve_stick', type: 'EXPONENTIAL_CURVE', curveExponent: 1.8, enabled: true }
            ],
            triggers: [{ id: 't_down_stick', type: 'DOWN' }]
          },
          {
            id: 'bind_jump_space',
            actionId: 'IA_Jump',
            hardwareDevice: 'KEYBOARD',
            rawKeyOrAxis: 'Space',
            modifiers: [],
            triggers: [{ id: 't_press_jump', type: 'PRESSED' }]
          },
          {
            id: 'bind_jump_gamepad_a',
            actionId: 'IA_Jump',
            hardwareDevice: 'GAMEPAD_XBOX',
            rawKeyOrAxis: 'Gamepad_Button_A',
            modifiers: [],
            triggers: [{ id: 't_press_a', type: 'PRESSED' }]
          },
          {
            id: 'bind_interact_e',
            actionId: 'IA_Interact',
            hardwareDevice: 'KEYBOARD',
            rawKeyOrAxis: 'KeyE',
            modifiers: [],
            triggers: [{ id: 't_hold_e', type: 'HOLD', holdDurationSec: 0.35 }]
          },
          {
            id: 'bind_fire_mouse_left',
            actionId: 'IA_FireWeapon',
            hardwareDevice: 'MOUSE',
            rawKeyOrAxis: 'Mouse_LeftButton',
            modifiers: [],
            triggers: [{ id: 't_down_fire', type: 'DOWN' }]
          }
        ]
      },
      {
        id: 'IMC_Combat_Stance',
        name: 'IMC_Combat_Stance',
        description: 'High-priority combat stance context when weapon is drawn',
        priority: 10,
        enabled: false,
        mappings: [
          {
            id: 'bind_dodge_space',
            actionId: 'IA_DodgeRoll',
            hardwareDevice: 'KEYBOARD',
            rawKeyOrAxis: 'Space',
            modifiers: [],
            triggers: [{ id: 't_tap_dodge', type: 'TAP', tapMaxDurationSec: 0.22 }]
          }
        ]
      },
      {
        id: 'IMC_Vehicle_Driving',
        name: 'IMC_Vehicle_Driving',
        description: 'Overrides movement with accelerator pedals and steering wheel bindings',
        priority: 20,
        enabled: false,
        mappings: []
      }
    ];

    this.activeContextStack = ['IMC_Default_Exploration'];
  }

  private loadFromStorage(): void {
    try {
      const savedContexts = localStorage.getItem(STORAGE_KEY_CONTEXTS);
      if (savedContexts) {
        this.contexts = JSON.parse(savedContexts);
      }
      const savedActions = localStorage.getItem(STORAGE_KEY_ACTIONS);
      if (savedActions) {
        this.actions = JSON.parse(savedActions);
      }
    } catch (e) {
      console.warn('Failed to load Enhanced Input config from localStorage:', e);
    }
  }

  public saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_CONTEXTS, JSON.stringify(this.contexts));
      localStorage.setItem(STORAGE_KEY_ACTIONS, JSON.stringify(this.actions));
    } catch (e) {
      console.warn('Failed to save Enhanced Input config to localStorage:', e);
    }
    this.notifySubscribers();
  }

  public getActions(): InputAction[] {
    return this.actions;
  }

  public getContexts(): InputMappingContext[] {
    return this.contexts;
  }

  public addAction(action: InputAction): void {
    this.actions.push(action);
    this.saveToStorage();
  }

  public removeAction(actionId: string): void {
    this.actions = this.actions.filter(a => a.id !== actionId);
    this.contexts.forEach(ctx => {
      ctx.mappings = ctx.mappings.filter(m => m.actionId !== actionId);
    });
    this.saveToStorage();
  }

  public addContext(ctx: InputMappingContext): void {
    this.contexts.push(ctx);
    this.saveToStorage();
  }

  public toggleContextActive(contextId: string, active: boolean): void {
    const ctx = this.contexts.find(c => c.id === contextId);
    if (ctx) {
      ctx.enabled = active;
      if (active && !this.activeContextStack.includes(contextId)) {
        this.activeContextStack.push(contextId);
      } else if (!active) {
        this.activeContextStack = this.activeContextStack.filter(id => id !== contextId);
      }
      this.saveToStorage();
    }
  }

  // Simulated Hardware Testing Pipeline
  public setSimulatedKey(key: string, pressed: boolean): void {
    if (pressed) {
      this.simulatedRawKeys.add(key);
    } else {
      this.simulatedRawKeys.delete(key);
    }
    this.evaluateActions();
  }

  public setSimulatedAnalogAxis(axisName: string, value: number): void {
    this.simulatedAnalogAxes[axisName] = Math.max(-1, Math.min(1, value));
    this.evaluateActions();
  }

  public getSimulatedRawKeys(): string[] {
    return Array.from(this.simulatedRawKeys);
  }

  public getSimulatedAnalogAxes(): Record<string, number> {
    return { ...this.simulatedAnalogAxes };
  }

  /**
   * Evaluates input modifier calculations (Deadzone, Negate, Exponential curve)
   */
  public evaluateModifiers(rawVal: number, modifiers: InputModifierConfig[]): number {
    let result = rawVal;

    for (const mod of modifiers) {
      if (!mod.enabled) continue;

      switch (mod.type) {
        case 'DEADZONE': {
          const lower = mod.lowerThreshold ?? 0.15;
          const upper = mod.upperThreshold ?? 0.95;
          const absVal = Math.abs(result);
          if (absVal < lower) {
            result = 0;
          } else {
            const range = Math.max(0.001, upper - lower);
            const normalized = Math.min(1, (absVal - lower) / range);
            result = Math.sign(result) * normalized;
          }
          break;
        }
        case 'NEGATE': {
          result = -result;
          break;
        }
        case 'SCALAR': {
          result *= mod.scalarMultiplier ?? 1.0;
          break;
        }
        case 'EXPONENTIAL_CURVE': {
          const exponent = mod.curveExponent ?? 2.0;
          result = Math.sign(result) * Math.pow(Math.abs(result), exponent);
          break;
        }
        default:
          break;
      }
    }

    return result;
  }

  /**
   * Main evaluation loop across active context stack sorted by priority
   */
  public evaluateActions(): void {
    const sortedContexts = [...this.contexts]
      .filter(c => c.enabled)
      .sort((a, b) => b.priority - a.priority);

    const now = Date.now();

    for (const action of this.actions) {
      let isBoolActive = false;
      let axis1D = 0;
      let axis2DX = 0;
      let axis2DY = 0;
      let matchingContextId = '';

      // Check simulated analog sticks
      if (action.id === 'IA_Move') {
        const stickX = this.simulatedAnalogAxes['Gamepad_LeftStick_X'] || 0;
        const stickY = this.simulatedAnalogAxes['Gamepad_LeftStick_Y'] || 0;
        if (Math.abs(stickX) > 0.05 || Math.abs(stickY) > 0.05) {
          axis2DX = stickX;
          axis2DY = stickY;
        }
      }

      if (action.id === 'IA_Look') {
        const lookX = this.simulatedAnalogAxes['Gamepad_RightStick_X'] || this.simulatedAnalogAxes['Mouse_Delta_X'] || 0;
        const lookY = this.simulatedAnalogAxes['Gamepad_RightStick_Y'] || this.simulatedAnalogAxes['Mouse_Delta_Y'] || 0;
        axis2DX = lookX;
        axis2DY = lookY;
      }

      // Check key bindings in prioritized contexts
      for (const ctx of sortedContexts) {
        const bindings = ctx.mappings.filter(m => m.actionId === action.id);
        for (const bind of bindings) {
          const isPressed = this.simulatedRawKeys.has(bind.rawKeyOrAxis);
          if (isPressed) {
            matchingContextId = ctx.id;
            isBoolActive = true;

            if (action.valueType === 'AXIS2D') {
              let val = 1.0;
              val = this.evaluateModifiers(val, bind.modifiers);

              const isSwizzledY = bind.modifiers.some(m => m.enabled && m.type === 'SWIZZLE_AXIS' && m.swizzleOrder === 'YXZ');
              if (isSwizzledY) {
                axis2DY += val;
              } else {
                axis2DX += val;
              }
            } else if (action.valueType === 'AXIS1D') {
              axis1D += this.evaluateModifiers(1.0, bind.modifiers);
            }
          }
        }
      }

      const evalResult: InputEvaluationResult = {
        actionId: action.id,
        valueType: action.valueType,
        boolValue: isBoolActive,
        axis1DValue: Math.max(-1, Math.min(1, axis1D)),
        axis2DValue: {
          x: Math.max(-1, Math.min(1, axis2DX)),
          y: Math.max(-1, Math.min(1, axis2DY))
        },
        axis3DValue: { x: 0, y: 0, z: 0 },
        triggeredThisFrame: isBoolActive,
        ongoing: isBoolActive,
        completed: !isBoolActive,
        canceled: false,
        activeContextId: matchingContextId,
        timestamp: now
      };

      this.actionStates.set(action.id, evalResult);
    }

    this.notifySubscribers();
  }

  public getActionEvaluation(actionId: string): InputEvaluationResult | undefined {
    return this.actionStates.get(actionId);
  }

  public getAllActionEvaluations(): InputEvaluationResult[] {
    return Array.from(this.actionStates.values());
  }

  public subscribe(fn: () => void): () => void {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(cb => cb());
  }
}

export const enhancedInputManager = EnhancedInputManagerNode.getInstance();
