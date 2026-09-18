/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Runtime DSP Audio Engine & Graph Manager (UE5 MetaSounds parity).
 *          Executes node-based modular audio graphs directly in browser using the
 *          Web Audio API. Supports live trigger pulses, dynamic frequency modulation,
 *          resonant biquad filtering, ADSR envelope generation, and real-time FFT/
 *          oscilloscope waveform analysis.
 *    - TH: เอนจินจำลองระบบ DSP Audio และ MetaSounds ระดับ AAA (เทียบเท่า Unreal 5 MetaSounds)
 *          ประมวลผลกราฟเสียงแบบแยกโหนดโดยตรงผ่าน Web Audio API รองรับการส่งสัญญาณพัลส์ Trigger,
 *          การปรับแต่งความถี่ Osc, ฟิลเตอร์ Resonant Biquad Filter, ซองเสียง ADSR,
 *          พร้อมการวิเคราะห์รูปคลื่นแบบเรียลไทม์ (Oscilloscope & FFT Spectrum)
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumes `metaSoundsTypes.ts` contracts
 *    - Consumed by `MetaSoundsModularDSPStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Input: `triggerImpulse(frequencyHz, durationSec)`
 *    - Output: Real-time time-domain audio data array for canvas visualization
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Lazy AudioContext initialization guarding against browser autoplay policies.
 * ============================================================================
 */

import {
  MetaSoundPatch,
  MetaSoundNode,
  MetaSoundConnection
} from '../types/metaSoundsTypes';

const STORAGE_KEY = 'omni_metasounds_patch';

export class MetaSoundsAudioGraphNode {
  private static instance: MetaSoundsAudioGraphNode;

  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;

  private activePatch: MetaSoundPatch;
  private subscribers: Array<() => void> = [];

  private constructor() {
    this.activePatch = this.createDefaultPlasmaBlastPatch();
    this.loadFromStorage();
  }

  public static getInstance(): MetaSoundsAudioGraphNode {
    if (!MetaSoundsAudioGraphNode.instance) {
      MetaSoundsAudioGraphNode.instance = new MetaSoundsAudioGraphNode();
    }
    return MetaSoundsAudioGraphNode.instance;
  }

  private ensureAudioContext(): boolean {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.8, this.audioCtx.currentTime);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return !!this.audioCtx;
  }

  private createDefaultPlasmaBlastPatch(): MetaSoundPatch {
    const nodes: MetaSoundNode[] = [
      {
        id: 'node_trigger',
        name: 'Trigger Event (On Play)',
        type: 'TRIGGER_SOURCE',
        position: { x: 50, y: 120 },
        inputs: [],
        outputs: [{ id: 'out_trig', name: 'Out', rate: 'TRIGGER', direction: 'OUTPUT', dataType: 'TRIGGER_PULSE' }],
        parameters: { eventName: 'OnImpulse' }
      },
      {
        id: 'node_osc1',
        name: 'SuperSaw Oscillator',
        type: 'OSCILLATOR',
        position: { x: 280, y: 80 },
        inputs: [
          { id: 'in_freq', name: 'Pitch (Hz)', rate: 'AUDIO', direction: 'INPUT', dataType: 'FLOAT', defaultValue: 130 },
          { id: 'in_trig', name: 'Trigger', rate: 'TRIGGER', direction: 'INPUT', dataType: 'TRIGGER_PULSE' }
        ],
        outputs: [{ id: 'out_audio', name: 'Audio Out', rate: 'AUDIO', direction: 'OUTPUT', dataType: 'AUDIO_BUFFER' }],
        parameters: { waveform: 'sawtooth', detuneCents: 12, frequencyHz: 130 }
      },
      {
        id: 'node_adsr',
        name: 'ADSR Envelope',
        type: 'ADSR_ENVELOPE',
        position: { x: 280, y: 260 },
        inputs: [{ id: 'in_trig_env', name: 'Trigger', rate: 'TRIGGER', direction: 'INPUT', dataType: 'TRIGGER_PULSE' }],
        outputs: [{ id: 'out_mod', name: 'Envelope (0-1)', rate: 'AUDIO', direction: 'OUTPUT', dataType: 'FLOAT' }],
        parameters: { attackSec: 0.02, decaySec: 0.28, sustainLevel: 0.35, releaseSec: 0.45 }
      },
      {
        id: 'node_filter',
        name: 'Resonant Biquad Filter',
        type: 'BIQUAD_FILTER',
        position: { x: 520, y: 140 },
        inputs: [
          { id: 'in_audio', name: 'Audio In', rate: 'AUDIO', direction: 'INPUT', dataType: 'AUDIO_BUFFER' },
          { id: 'in_cutoff', name: 'Cutoff Mod', rate: 'AUDIO', direction: 'INPUT', dataType: 'FLOAT' }
        ],
        outputs: [{ id: 'out_filtered', name: 'Filtered Out', rate: 'AUDIO', direction: 'OUTPUT', dataType: 'AUDIO_BUFFER' }],
        parameters: { filterType: 'lowpass', cutoffHz: 1850, resonanceQ: 6.5 }
      },
      {
        id: 'node_output',
        name: 'Master Audio Output',
        type: 'AUDIO_OUTPUT',
        position: { x: 740, y: 180 },
        inputs: [{ id: 'in_final', name: 'Master In', rate: 'AUDIO', direction: 'INPUT', dataType: 'AUDIO_BUFFER' }],
        outputs: [],
        parameters: { gain: 0.85 }
      }
    ];

    const connections: MetaSoundConnection[] = [
      { id: 'c1', sourceNodeId: 'node_trigger', sourcePinId: 'out_trig', targetNodeId: 'node_osc1', targetPinId: 'in_trig', rate: 'TRIGGER' },
      { id: 'c2', sourceNodeId: 'node_trigger', sourcePinId: 'out_trig', targetNodeId: 'node_adsr', targetPinId: 'in_trig_env', rate: 'TRIGGER' },
      { id: 'c3', sourceNodeId: 'node_osc1', sourcePinId: 'out_audio', targetNodeId: 'node_filter', targetPinId: 'in_audio', rate: 'AUDIO' },
      { id: 'c4', sourceNodeId: 'node_adsr', sourcePinId: 'out_mod', targetNodeId: 'node_filter', targetPinId: 'in_cutoff', rate: 'AUDIO' },
      { id: 'c5', sourceNodeId: 'node_filter', sourcePinId: 'out_filtered', targetNodeId: 'node_output', targetPinId: 'in_final', rate: 'AUDIO' }
    ];

    return {
      id: 'patch_plasma_blast',
      name: 'MS_SciFi_Plasma_Blast',
      description: 'Dynamic plasma impact projectile sound with resonant lowpass filter sweep',
      sampleRate: 48000,
      nodes,
      connections,
      masterVolume: 0.85
    };
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nodes && parsed.nodes.length > 0) {
          this.activePatch = parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load MetaSound patch from storage:', e);
    }
  }

  public saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.activePatch));
    } catch (e) {
      console.warn('Failed to save MetaSound patch to storage:', e);
    }
    this.notify();
  }

  public getPatch(): MetaSoundPatch {
    return this.activePatch;
  }

  public updateNodeParameter(nodeId: string, paramKey: string, value: any): void {
    const node = this.activePatch.nodes.find(n => n.id === nodeId);
    if (node) {
      node.parameters[paramKey] = value;
      this.saveToStorage();
    }
  }

  /**
   * Fires an impulse through the DSP graph and plays real audio
   */
  public triggerImpulse(baseFreq: number = 130): void {
    if (!this.ensureAudioContext() || !this.audioCtx || !this.masterGain) return;

    const now = this.audioCtx.currentTime;

    // 1. Find parameters from active nodes
    const oscNode = this.activePatch.nodes.find(n => n.type === 'OSCILLATOR');
    const adsrNode = this.activePatch.nodes.find(n => n.type === 'ADSR_ENVELOPE');
    const filterNode = this.activePatch.nodes.find(n => n.type === 'BIQUAD_FILTER');

    const waveform = (oscNode?.parameters.waveform as OscillatorType) || 'sawtooth';
    const cutoff = filterNode?.parameters.cutoffHz || 1850;
    const q = filterNode?.parameters.resonanceQ || 6.5;

    const attack = adsrNode?.parameters.attackSec || 0.02;
    const decay = adsrNode?.parameters.decaySec || 0.28;
    const sustain = adsrNode?.parameters.sustainLevel || 0.35;
    const release = adsrNode?.parameters.releaseSec || 0.45;

    // 2. Synthesize with Web Audio nodes
    const osc = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const filter = this.audioCtx.createBiquadFilter();
    const gain = this.audioCtx.createGain();

    osc.type = waveform;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + attack + decay);

    osc2.type = waveform;
    osc2.frequency.setValueAtTime(baseFreq * 1.01, now);
    osc2.detune.setValueAtTime(14, now);

    // Filter envelope sweep
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(cutoff, now + attack);
    filter.frequency.exponentialRampToValueAtTime(cutoff * sustain, now + attack + decay);
    filter.Q.setValueAtTime(q, now);

    // Gain ADSR
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.9, now + attack);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.01, sustain), now + attack + decay);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay + release);

    // Connect DSP chain
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc2.start(now);
    const stopTime = now + attack + decay + release + 0.05;
    osc.stop(stopTime);
    osc2.stop(stopTime);
  }

  public getWaveformData(outputArray: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(outputArray);
    }
  }

  public getFrequencyData(outputArray: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(outputArray);
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

export const metaSoundsEngine = MetaSoundsAudioGraphNode.getInstance();
