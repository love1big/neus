/**
 * ============================================================================
 * MODULE: OptimizationPresetRepository.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * โมดูลนี้ทำหน้าที่เป็นคลังข้อมูลแม่แบบคอนฟิก (Standard Target Platform Presets Repository)
 * สำหรับระบบ Batch Resource Optimizer โดยรวบรวมค่าพารามิเตอร์ที่ได้รับการปรับแต่งมาอย่าง
 * แม่นยำตามข้อกำหนดทางฮาร์ดแวร์จริงของอุตสาหกรรมเกม (AAA PC, Steam Deck, Mobile Vulkan,
 * VR 90 FPS Headsets, และ WebGL Lightweight) ช่วยให้นักพัฒนาสามารถเลือกเป้าหมายการบีบอัด
 * ได้ในคลิกเดียวโดยไม่ต้องคำนวณสูตรด้วยตนเอง.
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - เรียกใช้โดย: BatchResourceOptimizer.tsx ใน Dropdown เลือก Preset
 * - ส่งข้อมูลให้: BatchOptimizationPassRunner.ts เพื่อเป็น Master Config ในการรัน Pass
 * - อิง Data Type จาก: BatchOptimizerTypes.ts (OptimizationPresetDefinition, PlatformOptimizationPresetType)
 * 
 * ข้อมูลการรับส่ง (Inputs, Outputs & Data Contracts):
 * ----------------------------------------------------------------------------
 * - Output: ชุดข้อมูล OptimizationPresetDefinition[] และ Helper method สำหรับ Get/Clone
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - หากระบุ Preset ID ไม่ถูกต้อง จะ Fallback ไปที่ 'AAA_PC_ULTRA' อัตโนมัติ
 * - ป้องกันการกลืนทับ Preset ดั้งเดิมด้วย Deep Clone Object
 * 
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ----------------------------------------------------------------------------
 * const preset = OptimizationPresetRepository.getPreset('MOBILE_VULKAN_PERF');
 * console.log(preset.textureConfig.targetFormat); // 'ASTC_6x6_Balanced'
 * ============================================================================
 */

import { OptimizationPresetDefinition, PlatformOptimizationPresetType } from './BatchOptimizerTypes';

export class OptimizationPresetRepository {
  private static readonly PRESETS: Record<PlatformOptimizationPresetType, OptimizationPresetDefinition> = {
    AAA_PC_ULTRA: {
      id: 'AAA_PC_ULTRA',
      nameThai: '🖥️ AAA PC & คอนโซลระดับสูง (High-Fidelity)',
      nameEnglish: 'AAA PC & High-End Console (DirectX 12 / PS5)',
      description: 'คงความละเอียดสูงสุด 4K PBR, ใช้ BC7 บีบอัดแบบ Lossless-perceptual, LOD 4 ระดับแบบเนียนตา และเสียง Ogg 192kbps 48kHz',
      badgeColor: '#58a6ff',
      iconName: 'Monitor',
      globalTargetSavingsPct: 45,
      meshConfig: {
        enabled: true,
        lodCount: 4,
        decimationAlgorithm: 'QuadricErrorMetric',
        preserveUVSeams: true,
        preserveNormals: true,
        preserveHardEdges: true,
        normalAngleThresholdDeg: 60,
        weldingDistanceEpsilon: 0.0001,
        generateBillboardImposter: false,
        imposterResolution: 512,
        targetReductionFactors: [1.0, 0.60, 0.30, 0.12]
      },
      textureConfig: {
        enabled: true,
        targetFormat: 'BC7_HighQuality',
        maxResolution: 4096,
        generateMipmaps: true,
        mipmapFilter: 'Kaiser',
        normalizeNormalsInMipmaps: true,
        convertToLinearRGB: false,
        perceptualQualityTarget: 95,
        powerOfTwoPadded: true,
        alphaCoveragePreservation: true
      },
      audioConfig: {
        enabled: true,
        codec: 'Ogg_Vorbis',
        targetSampleRate: 48000,
        targetBitrateKbps: 192,
        downmixToMonoFor3DSpatial: true,
        normalizeLoudnessLUFS: -14,
        removeSubsonicFrequencies: true,
        streamingThresholdKb: 1024
      }
    },

    STEAM_DECK_BALANCED: {
      id: 'STEAM_DECK_BALANCED',
      nameThai: '🎮 เครื่องพกพา & Steam Deck (Balanced 60 FPS)',
      nameEnglish: 'Steam Deck & Handheld Gaming PC (Balanced)',
      description: 'ปรับสมดุลแบนด์วิดท์ VRAM และการใช้แบตเตอรี่, จำกัดความละเอียด 2K, บีบอัด BC7/BC1, LOD 4 ระดับ และเสียง Opus 128kbps',
      badgeColor: '#a371f7',
      iconName: 'Gamepad2',
      globalTargetSavingsPct: 62,
      meshConfig: {
        enabled: true,
        lodCount: 4,
        decimationAlgorithm: 'QuadricErrorMetric',
        preserveUVSeams: true,
        preserveNormals: true,
        preserveHardEdges: true,
        normalAngleThresholdDeg: 55,
        weldingDistanceEpsilon: 0.0005,
        generateBillboardImposter: true,
        imposterResolution: 256,
        targetReductionFactors: [1.0, 0.50, 0.22, 0.08]
      },
      textureConfig: {
        enabled: true,
        targetFormat: 'BC7_HighQuality',
        maxResolution: 2048,
        generateMipmaps: true,
        mipmapFilter: 'Lanczos3',
        normalizeNormalsInMipmaps: true,
        convertToLinearRGB: false,
        perceptualQualityTarget: 88,
        powerOfTwoPadded: true,
        alphaCoveragePreservation: true
      },
      audioConfig: {
        enabled: true,
        codec: 'Opus_VBR',
        targetSampleRate: 44100,
        targetBitrateKbps: 128,
        downmixToMonoFor3DSpatial: true,
        normalizeLoudnessLUFS: -14,
        removeSubsonicFrequencies: true,
        streamingThresholdKb: 512
      }
    },

    MOBILE_VULKAN_PERF: {
      id: 'MOBILE_VULKAN_PERF',
      nameThai: '📱 สมาร์ตโฟน & แท็บเล็ต (Mobile Vulkan / Metal)',
      nameEnglish: 'Mobile Vulkan / Metal (High-Efficiency ASTC)',
      description: 'ประหยัดหน่วยความจำและลดความร้อนชิปเซ็ต SoC ด้วย ASTC 6x6 Block Compression, จำกัด Texture 1K และ Resample เสียง 44.1kHz',
      badgeColor: '#3fb950',
      iconName: 'Smartphone',
      globalTargetSavingsPct: 78,
      meshConfig: {
        enabled: true,
        lodCount: 3,
        decimationAlgorithm: 'FastDecimate',
        preserveUVSeams: true,
        preserveNormals: false,
        preserveHardEdges: false,
        normalAngleThresholdDeg: 45,
        weldingDistanceEpsilon: 0.001,
        generateBillboardImposter: true,
        imposterResolution: 256,
        targetReductionFactors: [1.0, 0.40, 0.15]
      },
      textureConfig: {
        enabled: true,
        targetFormat: 'ASTC_6x6_Balanced',
        maxResolution: 1024,
        generateMipmaps: true,
        mipmapFilter: 'Bicubic',
        normalizeNormalsInMipmaps: true,
        convertToLinearRGB: false,
        perceptualQualityTarget: 80,
        powerOfTwoPadded: true,
        alphaCoveragePreservation: true
      },
      audioConfig: {
        enabled: true,
        codec: 'AAC_HE',
        targetSampleRate: 44100,
        targetBitrateKbps: 96,
        downmixToMonoFor3DSpatial: true,
        normalizeLoudnessLUFS: -16,
        removeSubsonicFrequencies: true,
        streamingThresholdKb: 256
      }
    },

    VR_90FPS_LOW_LATENCY: {
      id: 'VR_90FPS_LOW_LATENCY',
      nameThai: '🥽 แว่นเสมือนจริง VR (90/120 FPS Anti-Motion-Sickness)',
      nameEnglish: 'VR Headset Low-Latency (Meta Quest / PCVR)',
      description: 'ป้องกันอาการเมาคลื่นใน VR ด้วยการคุม Frame Time 11ms ไม่ให้ดรอป, LOD ลดโพลีรวดเร็ว, Spatial Audio Mono 48kHz คมชัด',
      badgeColor: '#f0883e',
      iconName: 'Glasses',
      globalTargetSavingsPct: 70,
      meshConfig: {
        enabled: true,
        lodCount: 4,
        decimationAlgorithm: 'QuadricErrorMetric',
        preserveUVSeams: true,
        preserveNormals: true,
        preserveHardEdges: true,
        normalAngleThresholdDeg: 50,
        weldingDistanceEpsilon: 0.0002,
        generateBillboardImposter: true,
        imposterResolution: 512,
        targetReductionFactors: [1.0, 0.45, 0.20, 0.06]
      },
      textureConfig: {
        enabled: true,
        targetFormat: 'ASTC_4x4_MobileHDR',
        maxResolution: 2048,
        generateMipmaps: true,
        mipmapFilter: 'Kaiser',
        normalizeNormalsInMipmaps: true,
        convertToLinearRGB: false,
        perceptualQualityTarget: 92,
        powerOfTwoPadded: true,
        alphaCoveragePreservation: true
      },
      audioConfig: {
        enabled: true,
        codec: 'Opus_VBR',
        targetSampleRate: 48000,
        targetBitrateKbps: 160,
        downmixToMonoFor3DSpatial: true,
        normalizeLoudnessLUFS: -14,
        removeSubsonicFrequencies: true,
        streamingThresholdKb: 512
      }
    },

    WEBGL_LIGHTWEIGHT: {
      id: 'WEBGL_LIGHTWEIGHT',
      nameThai: '🌐 เว็บบราวเซอร์ WebGL & HTML5 (Ultra-Fast Download)',
      nameEnglish: 'WebGL 2.0 / WebGPU Browser (Micro-Bundle)',
      description: 'โหลดเกมผ่านหน้าเว็บได้ทันทีใน 2 วินาที, ใช้ KTX2 Basis Universal / WebP, จำกัด Texture 512px, ตัดทอน Mesh 75% และเสียง 64kbps',
      badgeColor: '#d29922',
      iconName: 'Globe',
      globalTargetSavingsPct: 86,
      meshConfig: {
        enabled: true,
        lodCount: 3,
        decimationAlgorithm: 'FastDecimate',
        preserveUVSeams: true,
        preserveNormals: false,
        preserveHardEdges: false,
        normalAngleThresholdDeg: 40,
        weldingDistanceEpsilon: 0.002,
        generateBillboardImposter: true,
        imposterResolution: 128,
        targetReductionFactors: [1.0, 0.35, 0.10]
      },
      textureConfig: {
        enabled: true,
        targetFormat: 'KTX2_BasisUniversal',
        maxResolution: 512,
        generateMipmaps: true,
        mipmapFilter: 'Box',
        normalizeNormalsInMipmaps: false,
        convertToLinearRGB: false,
        perceptualQualityTarget: 75,
        powerOfTwoPadded: true,
        alphaCoveragePreservation: false
      },
      audioConfig: {
        enabled: true,
        codec: 'Opus_VBR',
        targetSampleRate: 32000,
        targetBitrateKbps: 64,
        downmixToMonoFor3DSpatial: true,
        normalizeLoudnessLUFS: -16,
        removeSubsonicFrequencies: true,
        streamingThresholdKb: 128
      }
    },

    CUSTOM_USER_DEFINED: {
      id: 'CUSTOM_USER_DEFINED',
      nameThai: '🛠️ ปรับแต่งเองตามใจชอบ (Custom Pipeline Tuning)',
      nameEnglish: 'Custom User Defined Pipeline',
      description: 'ปรับแต่งค่าพารามิเตอร์ของ Mesh LOD, Texture Compression และ Audio Codec ได้อย่างอิสระตามความต้องการของโปรเจกต์',
      badgeColor: '#ec4899',
      iconName: 'Sliders',
      globalTargetSavingsPct: 50,
      meshConfig: {
        enabled: true,
        lodCount: 4,
        decimationAlgorithm: 'QuadricErrorMetric',
        preserveUVSeams: true,
        preserveNormals: true,
        preserveHardEdges: true,
        normalAngleThresholdDeg: 60,
        weldingDistanceEpsilon: 0.0001,
        generateBillboardImposter: false,
        imposterResolution: 512,
        targetReductionFactors: [1.0, 0.60, 0.30, 0.12]
      },
      textureConfig: {
        enabled: true,
        targetFormat: 'BC7_HighQuality',
        maxResolution: 2048,
        generateMipmaps: true,
        mipmapFilter: 'Lanczos3',
        normalizeNormalsInMipmaps: true,
        convertToLinearRGB: false,
        perceptualQualityTarget: 90,
        powerOfTwoPadded: true,
        alphaCoveragePreservation: true
      },
      audioConfig: {
        enabled: true,
        codec: 'Ogg_Vorbis',
        targetSampleRate: 44100,
        targetBitrateKbps: 128,
        downmixToMonoFor3DSpatial: true,
        normalizeLoudnessLUFS: -14,
        removeSubsonicFrequencies: true,
        streamingThresholdKb: 512
      }
    }
  };

  /**
   * เรียกดูรายการ Preset ทั้งหมดในระบบ
   */
  public static getAllPresets(): OptimizationPresetDefinition[] {
    return Object.values(this.PRESETS);
  }

  /**
   * ดึงคอนฟิก Preset ตามรหัส ID พร้อมทำ Deep Clone เพื่อป้องกันการแก้ไขในคลังต้นฉบับ
   */
  public static getPreset(id: PlatformOptimizationPresetType): OptimizationPresetDefinition {
    const preset = this.PRESETS[id] || this.PRESETS.AAA_PC_ULTRA;
    return JSON.parse(JSON.stringify(preset));
  }
}
