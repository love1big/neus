/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type definitions for the AAA MetaSounds & Modular DSP
 *          Audio Node Graph System (Unreal Engine 5 MetaSounds & Unity Audio Mixer
 *          parity). Defines Node Execution Rates (Audio Rate, Block Rate, Trigger Rate),
 *          Pins (Data & Trigger), DSP Nodes (Oscillators, ADSR Envelopes, Multi-mode
 *          Filters, Delays, Reverb, Sidechain Ducking), and Graph Connections.
 *    - TH: กำหนด Type และ Interface หลักสำหรับระบบ MetaSounds และ Modular DSP Audio Graph
 *          ระดับ AAA (เทียบเท่า Unreal Engine 5 MetaSounds และ Unity Audio Mixer)
 *          ครอบคลุมอัตราการประมวลผล (Audio Rate 48kHz, Block Rate, Trigger Rate),
 *          ขาพินเชื่อมต่อโหนด (Data Pins & Trigger Pins), โหนดสังเคราะห์เสียง (Oscillators,
 *          ADSR Envelope, Resonant Filter, Delay, Reverb, Ducking Sidechain)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `MetaSoundsAudioGraphNode.ts` and `MetaSoundsModularDSPStudio.tsx`
 *    - Drives in-game dynamic sound effects, footsteps, weapon impacts, and interactive music
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Interfaces: `MetaSoundNode`, `MetaSoundPin`, `MetaSoundConnection`, `MetaSoundPatch`
 * ============================================================================
 */

export type MetaSoundRate = 'AUDIO' | 'BLOCK' | 'TRIGGER';

export type MetaSoundNodeType = 
  | 'TRIGGER_SOURCE'
  | 'OSCILLATOR'
  | 'ADSR_ENVELOPE'
  | 'BIQUAD_FILTER'
  | 'DELAY_LINE'
  | 'REVERB_DIFFUSER'
  | 'WAVESHAPER_DISTORTION'
  | 'BUS_MIXER'
  | 'AUDIO_OUTPUT';

export interface MetaSoundPin {
  id: string;
  name: string;
  rate: MetaSoundRate;
  direction: 'INPUT' | 'OUTPUT';
  dataType: 'AUDIO_BUFFER' | 'FLOAT' | 'TRIGGER_PULSE' | 'INT';
  defaultValue?: number;
  currentValue?: number;
}

export interface MetaSoundNode {
  id: string;
  name: string;
  type: MetaSoundNodeType;
  position: { x: number; y: number };
  inputs: MetaSoundPin[];
  outputs: MetaSoundPin[];
  parameters: Record<string, any>;
}

export interface MetaSoundConnection {
  id: string;
  sourceNodeId: string;
  sourcePinId: string;
  targetNodeId: string;
  targetPinId: string;
  rate: MetaSoundRate;
}

export interface MetaSoundPatch {
  id: string;
  name: string;
  description: string;
  sampleRate: number; // 48000 Hz
  nodes: MetaSoundNode[];
  connections: MetaSoundConnection[];
  masterVolume: number;
}
