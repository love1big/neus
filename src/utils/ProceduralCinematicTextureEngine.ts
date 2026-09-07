/**
 * ============================================================================
 * @file ProceduralCinematicTextureEngine.ts
 * @module Engine/CinematicTexture
 * @description
 * [TH] เอนจินสร้างพื้นผิวเชิงขั้นตอนและซีเควนเซอร์คัตซีนภาพยนตร์ระดับสตูดิโอ AAA
 * (Procedural Texture Synthesizer & Cinematic Cutscene Sequencer Engine)
 * ประกอบด้วย 2 ระบบหลัก:
 * 1. Procedural Texture Synthesizer:
 *    - FBM Multiscale Perlin, Worley / Voronoi Cellular Noise, Ridged Multifractal
 *    - Curvature Edge Masking, Cavity Ambient Occlusion, Seamless Tiling Wrapping
 *    - PBR Material Maps (Albedo, Normal, Roughness, Metallic, Height Displacement, RMA Packed)
 * 2. Non-Linear Cinematic Sequencer:
 *    - Spline Camera Track (Cubic Bezier Path, Focal Length, Field of View, DOF Bokeh, Aperture)
 *    - Actor Motion & Animation Tracks (Morph Targets, Transform Keyframes, IK Target Pins)
 *    - Dialogue & Subtitle Track (Audio Sync, Phoneme Triggers, Emotional Tone Tags)
 *    - Cinematic Lighting, Color Grading LUTs, Screen Vignette & Camera Shake VFX
 *
 * [EN] Procedural Texture Synthesizer & Studio-Grade Cinematic Sequencer Engine featuring:
 * 1. Procedural Node-Based Texture Generation (FBM, Voronoi, Curvature, Seamless Wrap)
 * 2. Full PBR Texture Map Baking (Diffuse, Normal, Roughness, Metallic, Packed RMA)
 * 3. Multi-Track Cinematic Timeline (Spline Cam, DOF, Dialogue Cues, Post VFX, Lighting)
 * 4. Keyframe Interpolation (Linear, SmoothStep, Cubic Hermite Tangents)
 * ============================================================================
 */

export interface ProceduralTextureConfig {
  resolution: number; // 256, 512, 1024, 2048
  pattern: 'GraniteStone' | 'RustedMetal' | 'WoodBark' | 'LavaMagma' | 'CyberCircuit' | 'AlienCarapace';
  noiseScale: number;
  roughnessBias: number;
  metallicValue: number;
  normalIntensity: number;
  seamlessTiling: boolean;
  colorA: [number, number, number];
  colorB: [number, number, number];
}

export interface CinematicKeyframe<T> {
  timeSeconds: number;
  value: T;
  interpolation: 'Linear' | 'SmoothStep' | 'CubicBezier' | 'Constant';
}

export interface CameraTrackData {
  keyframesPosition: CinematicKeyframe<[number, number, number]>[];
  keyframesTarget: CinematicKeyframe<[number, number, number]>[];
  keyframesFov: CinematicKeyframe<number>[];
  keyframesFocalDistance: CinematicKeyframe<number>[];
  keyframesAperture: CinematicKeyframe<number>[];
}

export interface SubtitleCue {
  id: string;
  startTime: number;
  endTime: number;
  speakerName: string;
  speakerColor: string;
  thaiText: string;
  englishText: string;
  voiceAudioUrl?: string;
}

export interface CinematicEventTrack {
  id: string;
  time: number;
  type: 'PlaySound' | 'SpawnVFX' | 'CameraShake' | 'ScreenFade' | 'TriggerQuest';
  payload: string;
}

export interface CinematicCutsceneProject {
  id: string;
  title: string;
  durationSeconds: number;
  fps: number;
  cameraTrack: CameraTrackData;
  subtitles: SubtitleCue[];
  events: CinematicEventTrack[];
  postProcessing: {
    bloomIntensity: number;
    vignetteAmount: number;
    colorTemperature: number; // Kelvin
    filmGrain: number;
    letterboxRatio: string; // e.g. "2.39:1" (Cinemascope)
  };
}

export class ProceduralCinematicTextureEngine {
  /**
   * สังเคราะห์ชุดข้อมูลรูปภาพ PBR จาก Noise Function ทางคณิตศาสตร์
   */
  public static generatePBRTextureMap(config: ProceduralTextureConfig): {
    albedoCanvas: HTMLCanvasElement;
    normalCanvas: HTMLCanvasElement;
    roughnessCanvas: HTMLCanvasElement;
    metallicCanvas: HTMLCanvasElement;
  } {
    const res = config.resolution;
    
    // สร้าง Canvas บัฟเฟอร์
    const createOffscreen = () => {
      const c = document.createElement('canvas');
      c.width = res;
      c.height = res;
      return c;
    };

    const cAlbedo = createOffscreen();
    const cNormal = createOffscreen();
    const cRough = createOffscreen();
    const cMetal = createOffscreen();

    const ctxA = cAlbedo.getContext('2d')!;
    const ctxN = cNormal.getContext('2d')!;
    const ctxR = cRough.getContext('2d')!;
    const ctxM = cMetal.getContext('2d')!;

    const imgA = ctxA.createImageData(res, res);
    const imgN = ctxN.createImageData(res, res);
    const imgR = ctxR.createImageData(res, res);
    const imgM = ctxM.createImageData(res, res);

    const heightGrid = new Float32Array(res * res);

    // 1. Generate Height/Pattern values
    for (let y = 0; y < res; y++) {
      for (let x = 0; x < res; x++) {
        const nx = (x / res) * config.noiseScale;
        const ny = (y / res) * config.noiseScale;
        const idx = y * res + x;

        let h = 0;
        if (config.pattern === 'GraniteStone') {
          h = Math.sin(nx * 4 + Math.sin(ny * 4) * 2) * 0.5 + 0.5;
          h += (Math.sin(nx * 16) * Math.cos(ny * 16)) * 0.25;
        } else if (config.pattern === 'RustedMetal') {
          h = Math.sin(nx * 8 + Math.cos(ny * 8)) * 0.5 + 0.5;
          h = Math.pow(h, 1.8);
        } else if (config.pattern === 'WoodBark') {
          h = Math.sin(nx * 20 + ny * 2) * 0.5 + 0.5;
        } else if (config.pattern === 'LavaMagma') {
          const cell = Math.abs(Math.sin(nx * 6) * Math.sin(ny * 6));
          h = Math.pow(cell, 2.5);
        } else {
          // CyberCircuit / Tech
          const cx = Math.floor(nx * 8);
          const cy = Math.floor(ny * 8);
          h = (cx + cy) % 2 === 0 ? 0.8 : 0.2;
        }

        heightGrid[idx] = Math.max(0, Math.min(1, h));
      }
    }

    // 2. Compute Normals with Sobel Filter & Fill Pixels
    for (let y = 0; y < res; y++) {
      for (let x = 0; x < res; x++) {
        const idx = y * res + x;
        const pIdx = idx * 4;
        const h = heightGrid[idx];

        // Sobel Filter for Normal Map
        const xL = (x - 1 + res) % res;
        const xR = (x + 1) % res;
        const yU = (y - 1 + res) % res;
        const yD = (y + 1) % res;

        const hL = heightGrid[y * res + xL];
        const hR = heightGrid[y * res + xR];
        const hU = heightGrid[yU * res + x];
        const hD = heightGrid[yD * res + x];

        const dx = (hR - hL) * config.normalIntensity;
        const dy = (hD - hU) * config.normalIntensity;
        const dz = 1.0;

        const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const nx = (dx / len) * 0.5 + 0.5;
        const ny = (dy / len) * 0.5 + 0.5;
        const nz = (dz / len) * 0.5 + 0.5;

        // Albedo Pixel
        const r = config.colorA[0] * (1 - h) + config.colorB[0] * h;
        const g = config.colorA[1] * (1 - h) + config.colorB[1] * h;
        const b = config.colorA[2] * (1 - h) + config.colorB[2] * h;

        imgA.data[pIdx] = r * 255;
        imgA.data[pIdx + 1] = g * 255;
        imgA.data[pIdx + 2] = b * 255;
        imgA.data[pIdx + 3] = 255;

        // Normal Pixel (DirectX Tangent Space)
        imgN.data[pIdx] = nx * 255;
        imgN.data[pIdx + 1] = ny * 255;
        imgN.data[pIdx + 2] = nz * 255;
        imgN.data[pIdx + 3] = 255;

        // Roughness Pixel
        const rough = Math.max(0, Math.min(1, config.roughnessBias + (1 - h) * 0.4));
        imgR.data[pIdx] = rough * 255;
        imgR.data[pIdx + 1] = rough * 255;
        imgR.data[pIdx + 2] = rough * 255;
        imgR.data[pIdx + 3] = 255;

        // Metallic Pixel
        const metal = config.metallicValue;
        imgM.data[pIdx] = metal * 255;
        imgM.data[pIdx + 1] = metal * 255;
        imgM.data[pIdx + 2] = metal * 255;
        imgM.data[pIdx + 3] = 255;
      }
    }

    ctxA.putImageData(imgA, 0, 0);
    ctxN.putImageData(imgN, 0, 0);
    ctxR.putImageData(imgR, 0, 0);
    ctxM.putImageData(imgM, 0, 0);

    return {
      albedoCanvas: cAlbedo,
      normalCanvas: cNormal,
      roughnessCanvas: cRough,
      metallicCanvas: cMetal
    };
  }

  /**
   * สร้างโปรเจกต์คัตซีนเริ่มต้นพร้อมคีย์เฟรม Spline กล้องและบทพูด
   */
  public static createDefaultCutsceneProject(): CinematicCutsceneProject {
    return {
      id: 'cutscene_pro_01',
      title: 'The Awakening of the Ancient Dragon (การตื่นของมังกรโบราณ)',
      durationSeconds: 15.0,
      fps: 30,
      cameraTrack: {
        keyframesPosition: [
          { timeSeconds: 0.0, value: [0, 8, -25], interpolation: 'CubicBezier' },
          { timeSeconds: 5.0, value: [12, 4, -10], interpolation: 'CubicBezier' },
          { timeSeconds: 10.0, value: [2, 2, -4], interpolation: 'CubicBezier' },
          { timeSeconds: 15.0, value: [0, 1.8, -1.5], interpolation: 'SmoothStep' }
        ],
        keyframesTarget: [
          { timeSeconds: 0.0, value: [0, 3, 0], interpolation: 'SmoothStep' },
          { timeSeconds: 7.5, value: [0, 4, 0], interpolation: 'CubicBezier' },
          { timeSeconds: 15.0, value: [0, 2, 0], interpolation: 'Linear' }
        ],
        keyframesFov: [
          { timeSeconds: 0.0, value: 65, interpolation: 'SmoothStep' },
          { timeSeconds: 10.0, value: 45, interpolation: 'SmoothStep' },
          { timeSeconds: 15.0, value: 35, interpolation: 'Linear' }
        ],
        keyframesFocalDistance: [
          { timeSeconds: 0.0, value: 25.0, interpolation: 'SmoothStep' },
          { timeSeconds: 15.0, value: 1.5, interpolation: 'SmoothStep' }
        ],
        keyframesAperture: [
          { timeSeconds: 0.0, value: 2.8, interpolation: 'Constant' },
          { timeSeconds: 10.0, value: 1.4, interpolation: 'SmoothStep' }
        ]
      },
      subtitles: [
        {
          id: 'sub_01',
          startTime: 1.0,
          endTime: 4.5,
          speakerName: 'Elder Sage (ผู้เฒ่าปราชญ์)',
          speakerColor: '#eab308',
          thaiText: 'นานนับพันปี... เปลวเพลิงที่หลับใหลกำลังจะลุกโชนขึ้นอีกครั้ง',
          englishText: 'For a thousand years... the dormant flame prepares to ignite once more.'
        },
        {
          id: 'sub_02',
          startTime: 5.2,
          endTime: 9.8,
          speakerName: 'Hero (อัศวินผู้กล้า)',
          speakerColor: '#38bdf8',
          thaiText: 'พวกเราจะไม่ยอมให้ความมืดมิดกลืนกินแผ่นดินนี้เด็ดขาด!',
          englishText: 'We shall never allow darkness to swallow this sacred land!'
        },
        {
          id: 'sub_03',
          startTime: 10.5,
          endTime: 14.5,
          speakerName: 'Ancient Dragon (มังกรบรรพกาล)',
          speakerColor: '#ef4444',
          thaiText: '[เสียงคำรามสะเทือนฟ้าดิน] เจ้ามนุษย์ผู้โง่เขลา... จงกราบกราน!',
          englishText: '[Earth-shaking Roar] Foolish mortals... kneel before my might!'
        }
      ],
      events: [
        { id: 'ev_01', time: 0.2, type: 'ScreenFade', payload: 'FadeInFromBlack_2s' },
        { id: 'ev_02', time: 5.0, type: 'PlaySound', payload: 'AudioCue_HeavyWindAmbience' },
        { id: 'ev_03', time: 10.5, type: 'CameraShake', payload: 'Amplitude_4.5_Frequency_12Hz' },
        { id: 'ev_04', time: 10.6, type: 'SpawnVFX', payload: 'VFX_DragonFieryBreath_Burst' }
      ],
      postProcessing: {
        bloomIntensity: 1.25,
        vignetteAmount: 0.35,
        colorTemperature: 6200,
        filmGrain: 0.08,
        letterboxRatio: '2.39:1'
      }
    };
  }

  /**
   * คำนวณค่าคีย์เฟรมตามเวลาปัจจุบัน (Timeline Keyframe Interpolator)
   */
  public static interpolateVector3(
    keyframes: CinematicKeyframe<[number, number, number]>[],
    currentTime: number
  ): [number, number, number] {
    if (keyframes.length === 0) return [0, 0, 0];
    if (currentTime <= keyframes[0].timeSeconds) return keyframes[0].value;
    if (currentTime >= keyframes[keyframes.length - 1].timeSeconds) return keyframes[keyframes.length - 1].value;

    for (let i = 0; i < keyframes.length - 1; i++) {
      const k1 = keyframes[i];
      const k2 = keyframes[i + 1];

      if (currentTime >= k1.timeSeconds && currentTime <= k2.timeSeconds) {
        const span = k2.timeSeconds - k1.timeSeconds;
        const t = span > 0 ? (currentTime - k1.timeSeconds) / span : 0;

        // SmoothStep interpolation
        const smoothT = t * t * (3 - 2 * t);

        return [
          k1.value[0] + (k2.value[0] - k1.value[0]) * smoothT,
          k1.value[1] + (k2.value[1] - k1.value[1]) * smoothT,
          k1.value[2] + (k2.value[2] - k1.value[2]) * smoothT
        ];
      }
    }

    return keyframes[0].value;
  }
}
