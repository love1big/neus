/**
 * ============================================================================
 * MODULE: BatchOptimizerTypes.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * ไฟล์นี้ทำหน้าที่เป็น Data Contract และ Type Definitions ศูนย์กลางสำหรับระบบ
 * "Batch Resource Optimizer" ใน OmniEngine IDE โดยครอบคลุมโครงสร้างข้อมูล
 * ทั้งหมดที่เกี่ยวข้องกับการทำ Mesh LOD Decimation, GPU Texture Block Compression,
 * Audio Bitrate Transcoding, Optimization Presets, และ Batch Processing Manifests.
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * 1. ContentBrowser.tsx: ส่งผ่าน Asset Items เข้าสู่ Optimizer Engine
 * 2. MeshLODOptimizerNode.ts: นำ Type การลดทอนโพลีกอน (QEM) ไปคำนวณ LOD0-LOD4
 * 3. TextureCompressionNode.ts: นำ Config BC7/ASTC/KTX2 ไปสร้าง Mipmap Pyramid
 * 4. AudioBitrateCompressorNode.ts: นำ Config Opus/Vorbis ไปแปลงบิตเรตและแชนแนล
 * 5. BatchOptimizationPassRunner.ts: ควบคุมคิวงานและออก Optimization Manifest
 * 6. BatchResourceOptimizer.tsx: Component UI หลักที่เรนเดอร์ข้อมูลและรับ Interaction
 * 
 * ข้อมูลการรับส่ง (Inputs, Outputs & Data Contracts):
 * ----------------------------------------------------------------------------
 * - OptimizableAsset: ข้อมูลแอสเซทเริ่มต้นที่รับจาก ContentBrowser
 * - UnifiedOptimizationConfig: ค่าคอนฟิกทั้งหมดสำหรับ Mesh, Texture, Audio
 * - OptimizedAssetResult: ผลลัพธ์การ Optimize แต่ละแอสเซท (Before/After, Savings, Mipmaps, LODs)
 * - BatchOptimizationManifest: สรุปผลการประมวลผลทั้ง Batch สำหรับ Export และ Project Save
 * 
 * การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 * ----------------------------------------------------------------------------
 * - รองรับ Asset ที่ไม่มีข้อมูลรูปทรงหรือขนาด (Fallback ไปที่ Default Estimation)
 * - ระบุสถานะ error/failed แยกแต่ละชิ้นโดยไม่ทำให้ทั้ง Batch สะดุด
 * 
 * ตัวอย่างการเรียกใช้งาน (Usage Example):
 * ----------------------------------------------------------------------------
 * import { OptimizableAsset, UnifiedOptimizationConfig, OptimizedAssetResult } from './BatchOptimizerTypes';
 * const asset: OptimizableAsset = { id: 'm1', name: 'SM_Barrel', type: 'obj', rawSizeKb: 4500, folderId: '5' };
 * ============================================================================
 */

export type AssetCategoryType = 'mesh' | 'texture' | 'audio' | 'material' | 'blueprint' | 'generic';

export type MeshFormat = 'obj' | 'fbx' | 'skm' | 'gltf';
export type TextureFormat = 'tex' | 'png' | 'jpg' | 'tga' | 'hdr';
export type AudioFormat = 'wav' | 'mp3' | 'ogg' | 'flac';

export interface OptimizableAsset {
  id: string;
  name: string;
  type: string;
  folderId: string;
  rawSizeKb: number;
  category: AssetCategoryType;
  dimensions?: { width: number; height: number; depth?: number };
  polyCount?: number;
  vertexCount?: number;
  audioSampleRate?: number;
  audioChannels?: number;
  audioDurationSec?: number;
  tags?: string[];
  thumbnailUrl?: string;
}

/**
 * ระดับความละเอียดของ Model LOD (Level of Detail)
 */
export interface LODLevelSpec {
  level: number;
  reductionRatio: number;      // e.g. 1.0 (LOD0), 0.5 (LOD1), 0.25 (LOD2), 0.10 (LOD3)
  targetTriangles: number;
  targetVertices: number;
  screenSizeThreshold: number; // สัดส่วนขนาดบนจอภาพที่จะสลับมาใช้ LOD นี้ (0.0 - 1.0)
  estimatedVramKb: number;
  quadricTolerance: number;
}

/**
 * คอนฟิกการทำ Mesh Decimation และ LOD Pyramid Generation
 */
export interface MeshLODConfig {
  enabled: boolean;
  lodCount: number; // 2 to 5 levels (LOD0 to LOD4)
  decimationAlgorithm: 'QuadricErrorMetric' | 'VertexCluster' | 'FastDecimate' | 'BoundaryPreserving';
  preserveUVSeams: boolean;
  preserveNormals: boolean;
  preserveHardEdges: boolean;
  normalAngleThresholdDeg: number; // 0 to 90 degrees
  weldingDistanceEpsilon: number;  // Distance to weld duplicate vertices
  generateBillboardImposter: boolean;
  imposterResolution: number;      // e.g. 512 or 256
  targetReductionFactors: number[]; // [1.0, 0.50, 0.25, 0.10, 0.03]
}

/**
 * รูปแบบการบีบอัด Texture บน GPU ระดับ Hardware
 */
export type GPUBlockCompressionFormat = 
  | 'BC7_HighQuality'       // Desktop/Console Modern PBR Albedo / Gloss
  | 'BC1_DXT1_Opaque'       // Desktop/Console Non-Alpha Maps
  | 'BC3_DXT5_Alpha'        // Desktop/Console Alpha Maps
  | 'BC5_NormalRG'          // Desktop/Console 2-Channel High Precision Tangent Normal
  | 'ASTC_4x4_MobileHDR'    // Mobile High Quality
  | 'ASTC_6x6_Balanced'     // Mobile Balanced
  | 'ASTC_8x8_UltraCompact' // Mobile Extreme Compression
  | 'KTX2_BasisUniversal'   // Cross-Platform GPU Compressed Texture
  | 'WebP_NearLossless'     // WebGL Optimized
  | 'Raw_Uncompressed';

/**
 * คอนฟิกการทำ GPU Texture Compression และ Mipmap Generation
 */
export interface TextureCompressionConfig {
  enabled: boolean;
  targetFormat: GPUBlockCompressionFormat;
  maxResolution: 4096 | 2048 | 1024 | 512 | 256 | 128;
  generateMipmaps: boolean;
  mipmapFilter: 'Kaiser' | 'Lanczos3' | 'Bicubic' | 'Box';
  normalizeNormalsInMipmaps: boolean;
  convertToLinearRGB: boolean;
  perceptualQualityTarget: number; // 1 - 100
  powerOfTwoPadded: boolean;
  alphaCoveragePreservation: boolean;
}

/**
 * รูปแบบการเข้ารหัสและบีบอัดเสียงในเกม
 */
export type AudioCodecTarget = 'Ogg_Vorbis' | 'Opus_VBR' | 'AAC_HE' | 'ADPCM_Fast' | 'Raw_PCM';

/**
 * คอนฟิกการบีบอัดและแปลงสัญญาณเสียง
 */
export interface AudioCompressionConfig {
  enabled: boolean;
  codec: AudioCodecTarget;
  targetSampleRate: 48000 | 44100 | 32000 | 22050 | 16000;
  targetBitrateKbps: 320 | 256 | 192 | 160 | 128 | 96 | 64 | 48;
  downmixToMonoFor3DSpatial: boolean;
  normalizeLoudnessLUFS: number; // e.g. -14 LUFS (Sound FX) or -23 LUFS (Ambience/Music)
  removeSubsonicFrequencies: boolean; // High-pass filter at 30Hz
  streamingThresholdKb: number; // If size > threshold, mark as Streaming instead of In-Memory
}

/**
 * ชุด Preset สำเร็จรูปสำหรับเป้าหมายแพลตฟอร์มต่างๆ
 */
export type PlatformOptimizationPresetType = 
  | 'AAA_PC_ULTRA' 
  | 'STEAM_DECK_BALANCED' 
  | 'MOBILE_VULKAN_PERF' 
  | 'VR_90FPS_LOW_LATENCY' 
  | 'WEBGL_LIGHTWEIGHT' 
  | 'CUSTOM_USER_DEFINED';

export interface OptimizationPresetDefinition {
  id: PlatformOptimizationPresetType;
  nameThai: string;
  nameEnglish: string;
  description: string;
  badgeColor: string;
  iconName: string;
  meshConfig: MeshLODConfig;
  textureConfig: TextureCompressionConfig;
  audioConfig: AudioCompressionConfig;
  globalTargetSavingsPct: number;
}

/**
 * ผลลัพธ์การประมวลผลรายชิ้น
 */
export interface OptimizedAssetResult {
  assetId: string;
  assetName: string;
  category: AssetCategoryType;
  originalSizeKb: number;
  optimizedSizeKb: number;
  savedBytesKb: number;
  savingsPercentage: number;
  executionDurationMs: number;
  status: 'pending' | 'optimizing' | 'completed' | 'failed' | 'skipped';
  errorMessage?: string;
  
  // Mesh Specific Diagnostics
  meshDiagnostics?: {
    originalTriangles: number;
    originalVertices: number;
    lodsGenerated: Array<{
      lodLevel: number;
      triangles: number;
      vertices: number;
      reductionPct: number;
      vramSizeKb: number;
      switchDistanceMeters: number;
    }>;
    imposterGenerated: boolean;
    qemMaxError: number;
  };

  // Texture Specific Diagnostics
  textureDiagnostics?: {
    originalDimension: string;
    targetDimension: string;
    compressionFormat: GPUBlockCompressionFormat;
    mipLevelsCount: number;
    estimatedVramKb: number;
    psnrScoreDb: number;      // Peak Signal-to-Noise Ratio (dB)
    ssimScore: number;        // Structural Similarity Index (0.0 - 1.0)
    compressionSpeedMpixPerSec: number;
  };

  // Audio Specific Diagnostics
  audioDiagnostics?: {
    originalBitrateKbps: number;
    targetBitrateKbps: number;
    codec: AudioCodecTarget;
    originalChannels: number;
    finalChannels: number;
    sampleRateHz: number;
    isStreamingLoaded: boolean;
    loudnessNormalizedLUFS: number;
  };

  actionLogs: string[];
}

/**
 * ภาพรวมสรุปผลการรัน Batch Optimization Pass
 */
export interface BatchOptimizationManifest {
  manifestId: string;
  jobName: string;
  timestamp: string;
  presetUsed: PlatformOptimizationPresetType;
  totalAssetsEvaluated: number;
  totalAssetsOptimized: number;
  totalAssetsFailed: number;
  totalAssetsSkipped: number;
  
  totalOriginalSizeBytes: number;
  totalOptimizedSizeBytes: number;
  totalSavedSizeBytes: number;
  netSavingsPercentage: number;
  
  estimatedTotalVramSavedMb: number;
  estimatedDiskFootprintSavedMb: number;
  totalPassDurationMs: number;
  
  results: OptimizedAssetResult[];
  environmentMetadata: {
    engineVersion: string;
    targetPlatform: string;
    hardwareConcurrency: number;
  };
}
