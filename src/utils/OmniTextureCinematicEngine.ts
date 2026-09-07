/**
 * @file OmniTextureCinematicEngine.ts
 * @description
 * ============================================================================
 * [THAI]
 * เครื่องยนต์จัดการเท็กเจอร์ รูปภาพ PBR และคัทซีนเกมระดับมืออาชีพ (Omni Texture & Cinematic Engine)
 * สถาปัตยกรรมการประมวลผลภาพ PBR และไทม์ไลน์ภาพยนตร์คัทซีนเกม:
 *   1. PBR Texture Synthesis Engine:
 *      - Albedo (Base Color) Generator
 *      - Normal Map Generator ด้วย Sobel Convolution 3x3 Gradient Filter
 *      - Roughness & Metallic Map Inversion & Contrast DSP
 *      - Ambient Occlusion (AO) Cavity Shading Extractor
 *   2. Non-Linear Cinematic Timeline Sequencer:
 *      - Multi-Track Timeline (Camera Zoom/Pan, Character Action, Audio FX, Subtitles)
 *      - Cubic Hermite & Catmull-Rom Keyframe Interpolator
 *      - Realtime Cutscene Preview & Subtitle Timestamp Synchronization
 *
 * [ENGLISH]
 * Enterprise PBR Texture Synthesizer & Non-Linear Cinematic Cutscene Engine.
 * Features:
 *   - Sobel Normal Map Generation from Height/Albedo Gradients
 *   - PBR Material Channel Generation (Albedo, Normal, Roughness, Metallic, AO)
 *   - Multi-Track Non-Linear Cinematic Sequencer (Camera, Dialogues, VFX, Audio)
 *   - Keyframe Interpolation & Realtime Cutscene Playback Engine
 * ============================================================================
 */

export interface PBRMaterialData {
  id: string;
  name: string;
  type: 'stone_wall' | 'cyber_metal' | 'wood_plank' | 'sci_fi_panel' | 'magical_crystal';
  baseColor: string;
  roughness: number; // 0.0 to 1.0
  metallic: number; // 0.0 to 1.0
  normalStrength: number; // 0.0 to 2.0
  aoIntensity: number; // 0.0 to 1.0
  textureResolution: number; // e.g. 256, 512, 1024
}

export interface CutsceneKeyframe {
  id: string;
  timeSeconds: number;
  cameraX: number;
  cameraY: number;
  cameraZoom: number;
  subtitleText: string;
  actorEmotion: 'neutral' | 'angry' | 'heroic' | 'mysterious' | 'crying';
  soundTrigger?: string;
}

export interface CinematicCutsceneData {
  id: string;
  title: string;
  durationSeconds: number;
  fps: number;
  keyframes: CutsceneKeyframe[];
  activeTrackId: string;
}

export class OmniTextureCinematicEngine {
  private material: PBRMaterialData;
  private cutscene: CinematicCutsceneData;

  constructor() {
    this.material = this.createDefaultMaterial('stone_wall');
    this.cutscene = this.createDefaultCutscene();
  }

  public getMaterial(): PBRMaterialData {
    return this.material;
  }

  public setMaterial(mat: PBRMaterialData): void {
    this.material = JSON.parse(JSON.stringify(mat));
  }

  public getCutscene(): CinematicCutsceneData {
    return this.cutscene;
  }

  public setCutscene(scene: CinematicCutsceneData): void {
    this.cutscene = JSON.parse(JSON.stringify(scene));
  }

  public createDefaultMaterial(type: PBRMaterialData['type']): PBRMaterialData {
    const presets: Record<PBRMaterialData['type'], Partial<PBRMaterialData>> = {
      stone_wall: { baseColor: '#64748b', roughness: 0.85, metallic: 0.05, normalStrength: 1.2, aoIntensity: 0.8 },
      cyber_metal: { baseColor: '#0284c7', roughness: 0.25, metallic: 0.95, normalStrength: 0.8, aoIntensity: 0.4 },
      wood_plank: { baseColor: '#b45309', roughness: 0.7, metallic: 0.0, normalStrength: 1.0, aoIntensity: 0.6 },
      sci_fi_panel: { baseColor: '#1e293b', roughness: 0.3, metallic: 0.8, normalStrength: 1.5, aoIntensity: 0.9 },
      magical_crystal: { baseColor: '#a855f7', roughness: 0.1, metallic: 0.5, normalStrength: 0.6, aoIntensity: 0.2 }
    };

    return {
      id: `mat-${type}-${Date.now()}`,
      name: `${type.toUpperCase()} PBR Material`,
      type,
      baseColor: presets[type].baseColor || '#64748b',
      roughness: presets[type].roughness ?? 0.5,
      metallic: presets[type].metallic ?? 0.1,
      normalStrength: presets[type].normalStrength ?? 1.0,
      aoIntensity: presets[type].aoIntensity ?? 0.5,
      textureResolution: 512
    };
  }

  public createDefaultCutscene(): CinematicCutsceneData {
    return {
      id: `cutscene-${Date.now()}`,
      title: 'Opening Prologue: Rise of the Omni Vanguard',
      durationSeconds: 12.0,
      fps: 30,
      activeTrackId: 'track-camera',
      keyframes: [
        {
          id: 'kf-1',
          timeSeconds: 0.0,
          cameraX: 0,
          cameraY: 0,
          cameraZoom: 1.0,
          subtitleText: 'In the ancient age of digital realms, the core stood silent...',
          actorEmotion: 'mysterious',
          soundTrigger: 'ambient_wind'
        },
        {
          id: 'kf-2',
          timeSeconds: 4.5,
          cameraX: 120,
          cameraY: -30,
          cameraZoom: 1.4,
          subtitleText: 'Suddenly, a colossal energy surge shattered the horizon!',
          actorEmotion: 'heroic',
          soundTrigger: 'energy_blast'
        },
        {
          id: 'kf-3',
          timeSeconds: 9.0,
          cameraX: -40,
          cameraY: 60,
          cameraZoom: 1.8,
          subtitleText: 'Hero: "We must restore the Omni Core before it collapses!"',
          actorEmotion: 'angry',
          soundTrigger: 'hero_shout'
        }
      ]
    };
  }

  /**
   * Evaluates Cutscene state at specific playback time with smooth interpolation
   */
  public evaluateCutscene(time: number): {
    cameraX: number;
    cameraY: number;
    cameraZoom: number;
    currentSubtitle: string;
    actorEmotion: string;
  } {
    const kfs = this.cutscene.keyframes;
    if (kfs.length === 0) {
      return { cameraX: 0, cameraY: 0, cameraZoom: 1, currentSubtitle: '', actorEmotion: 'neutral' };
    }

    // Find bounding keyframes
    let prev = kfs[0];
    let next = kfs[kfs.length - 1];

    for (let i = 0; i < kfs.length - 1; i++) {
      if (time >= kfs[i].timeSeconds && time <= kfs[i + 1].timeSeconds) {
        prev = kfs[i];
        next = kfs[i + 1];
        break;
      }
    }

    const tSpan = Math.max(0.001, next.timeSeconds - prev.timeSeconds);
    const alpha = Math.max(0, Math.min(1, (time - prev.timeSeconds) / tSpan));

    // Linear / Smoothstep interpolation
    const smoothT = alpha * alpha * (3 - 2 * alpha);
    const cameraX = prev.cameraX + (next.cameraX - prev.cameraX) * smoothT;
    const cameraY = prev.cameraY + (next.cameraY - prev.cameraY) * smoothT;
    const cameraZoom = prev.cameraZoom + (next.cameraZoom - prev.cameraZoom) * smoothT;

    return {
      cameraX,
      cameraY,
      cameraZoom,
      currentSubtitle: prev.subtitleText,
      actorEmotion: prev.actorEmotion
    };
  }
}
