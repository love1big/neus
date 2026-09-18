/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type definitions for the AAA Enhanced Input & Action
 *          Mapping Context System (analogous to Unreal Engine 5 Enhanced Input and
 *          Unity New Input System). Defines Input Actions, Value Types (Digital,
 *          Axis1D, Axis2D, Axis3D), Modifiers, Triggers, Mapping Contexts (IMC),
 *          and Gamepad/Hardware bindings.
 *    - TH: กำหนด Type และ Interface หลักสำหรับระบบ Enhanced Input และ Input Mapping Context
 *          ระดับ AAA (เทียบเท่า Unreal Engine 5 Enhanced Input และ Unity New Input System)
 *          ครอบคลุม Input Actions, ชนิดค่า (Boolean, Float, Vector2, Vector3),
 *          Modifiers (Deadzone, Negate, Swizzle), Triggers (Hold, Pulse, Tap, Chord),
 *          และการจับคู่ปุ่มควบคุมฮาร์ดแวร์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `EnhancedInputManagerNode.ts` and `EnhancedInputMappingContextStudio.tsx`
 *    - Integrates with Gameplay Tag subsystem and character movement controllers
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Interfaces: `InputAction`, `InputMappingContext`, `InputModifier`, `InputTrigger`, `InputDeviceBinding`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Safe fallback defaults for unmapped hardware keys.
 *    - Clamped Deadzone ranges [0.0, 1.0].
 * ============================================================================
 */

export type InputActionValueType = 'BOOLEAN' | 'AXIS1D' | 'AXIS2D' | 'AXIS3D';

export type InputModifierType = 
  | 'DEADZONE'
  | 'NEGATE'
  | 'SCALAR'
  | 'SWIZZLE_AXIS'
  | 'EXPONENTIAL_CURVE'
  | 'SMOOTH_INTERPOLATION';

export type InputTriggerType = 
  | 'DOWN'
  | 'PRESSED'
  | 'RELEASED'
  | 'HOLD'
  | 'HOLD_AND_RELEASE'
  | 'PULSE'
  | 'TAP'
  | 'CHORD_ACTION'
  | 'COMBO_SEQUENCE';

export type HardwareDeviceType = 'KEYBOARD' | 'MOUSE' | 'GAMEPAD_XBOX' | 'GAMEPAD_DUAL_SENSE' | 'TOUCH_JOYSTICK';

export interface InputModifierConfig {
  id: string;
  type: InputModifierType;
  enabled: boolean;
  lowerThreshold?: number; // for DEADZONE (e.g. 0.15)
  upperThreshold?: number; // for DEADZONE (e.g. 0.95)
  scalarMultiplier?: number; // for SCALAR (e.g. 1.5)
  swizzleOrder?: 'YXZ' | 'ZYX' | 'XZY'; // for SWIZZLE_AXIS
  curveExponent?: number; // for EXPONENTIAL_CURVE (e.g. 2.2)
  smoothRate?: number; // for SMOOTH_INTERPOLATION
}

export interface InputTriggerConfig {
  id: string;
  type: InputTriggerType;
  holdDurationSec?: number; // for HOLD (e.g. 0.4s)
  tapMaxDurationSec?: number; // for TAP (e.g. 0.2s)
  pulseIntervalSec?: number; // for PULSE (e.g. 0.1s)
  chordActionId?: string; // for CHORD_ACTION (must hold another action)
  comboSequenceIds?: string[]; // for COMBO_SEQUENCE (e.g. Down, Down-Forward, Forward + Punch)
}

export interface InputDeviceBinding {
  id: string;
  actionId: string;
  hardwareDevice: HardwareDeviceType;
  rawKeyOrAxis: string; // e.g. "KeyW", "Gamepad_LeftThumbstick_Y", "Mouse_X"
  modifiers: InputModifierConfig[];
  triggers: InputTriggerConfig[];
  isNegated?: boolean;
}

export interface InputAction {
  id: string;
  name: string;
  description: string;
  valueType: InputActionValueType;
  gameplayTag: string; // e.g. "Input.Action.Movement", "Input.Action.Jump"
  consumeInput: boolean;
  triggerWhenPaused: boolean;
}

export interface InputMappingContext {
  id: string;
  name: string;
  description: string;
  priority: number; // Higher priority context overrides lower ones in the active stack
  enabled: boolean;
  mappings: InputDeviceBinding[];
}

export interface InputEvaluationResult {
  actionId: string;
  valueType: InputActionValueType;
  boolValue: boolean;
  axis1DValue: number;
  axis2DValue: { x: number; y: number };
  axis3DValue: { x: number; y: number; z: number };
  triggeredThisFrame: boolean;
  ongoing: boolean;
  completed: boolean;
  canceled: boolean;
  activeContextId: string;
  timestamp: number;
}
