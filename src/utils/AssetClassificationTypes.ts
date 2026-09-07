/**
 * @file AssetClassificationTypes.ts
 * @description สถาปัตยกรรมและโครงสร้างข้อมูลสำหรับการจัดหมวดหมู่และวิเคราะห์ Asset อัตโนมัติด้วย Entropy และ Heuristics
 * Architecture & Data Contracts for AI-Driven Asset Classification, File Entropy Analysis & Content Heuristics.
 *
 * @system AI Asset Auto-Tagging & Background Worker Subsystem
 * @module AssetClassificationTypes
 *
 * ------------------------------------------------------------------------------------------------
 * วัตถุประสงค์ (Module Purpose & Responsibility):
 * - กำหนด Type Definitions, Data Contracts, Enums, และ Feature Vectors สำหรับระบบ Background Worker
 * - รองรับการคำนวณ Shannon Entropy, Byte Frequency Histograms, Heuristic Scores, Multi-dimensional Tags
 * - โครงสร้างสำหรับการจัดระเบียบโครงสร้างโฟลเดอร์ใน Content Browser แบบอัตโนมัติ (Smart Taxonomy)
 *
 * การเชื่อมโยงกับระบบอื่น (System Integration):
 * - ใช้งานร่วมกับ AssetEntropyAnalyzer.ts, ContentHeuristicClassifier.ts, AIAssetBackgroundWorker.ts,
 *   ContentBrowser.tsx, และ AssetAutoTagWorkerInspector.tsx
 * ------------------------------------------------------------------------------------------------
 */

/**
 * หมวดหมู่หลักของ Asset ในเกมเอนจิน (Primary Engine Asset Category)
 */
export type EngineAssetCategory =
  | 'mesh'
  | 'texture'
  | 'audio'
  | 'material'
  | 'blueprint'
  | 'shader'
  | 'animation'
  | 'level'
  | 'vfx'
  | 'metadata'
  | 'unknown';

/**
 * ชนิดย่อยเฉพาะทางของ Asset (Specialized Sub-type)
 */
export type EngineAssetSubType =
  // Meshes
  | 'static_mesh'
  | 'skeletal_mesh'
  | 'collision_mesh'
  | 'lod_mesh'
  | 'destructible_chunk'
  // Textures
  | 'albedo_diffuse'
  | 'normal_map'
  | 'roughness_rough_spec'
  | 'metallic_map'
  | 'ambient_occlusion'
  | 'height_displacement'
  | 'emissive_map'
  | 'cubemap_hdr'
  | 'sprite_atlas'
  | 'ui_icon'
  // Audio
  | 'sfx_impact'
  | 'sfx_ui'
  | 'foley_movement'
  | 'voice_dialogue'
  | 'music_track'
  | 'ambient_loop'
  // Materials & Shaders
  | 'pbr_material'
  | 'unlit_material'
  | 'postprocess_shader'
  | 'compute_shader'
  // Logic
  | 'blueprint_class'
  | 'behavior_tree'
  | 'gameplay_ability'
  | 'generic_unknown';

/**
 * ข้อมูลการวิเคราะห์ความไม่แน่นอนของไฟล์ (Shannon File Entropy Profile)
 */
export interface FileEntropyProfile {
  /** ค่า Shannon Entropy อยู่ระหว่าง 0.0 (ข้อมูลซ้ำกันหมด) ถึง 8.0 (ข้อมูลสุ่มสมบูรณ์/บีบอัดสูง) */
  entropyScore: number;
  /** อัตราส่วนของ ASCII printable characters ต่อ binary bytes (0.0 - 1.0) */
  asciiPrintableRatio: number;
  /** อัตราส่วน Null bytes (0x00) ในไฟล์ */
  nullByteRatio: number;
  /** อัตราส่วน High-bit bytes (> 0x7F) ในไฟล์ */
  highBitByteRatio: number;
  /** ความสม่ำเสมอของการกระจายตัวไบต์ (Chi-Square Uniformity Deviation) */
  chiSquareDeviation: number;
  /** การประเมินระดับการบีบอัด (Estimated Compressibility: 'uncompressed' | 'partially_compressed' | 'heavily_compressed' | 'encrypted') */
  compressionEstimation: 'uncompressed' | 'partially_compressed' | 'heavily_compressed' | 'encrypted';
  /** Magic bytes / Header Signature Hex string (เช่น "89 50 4E 47" สำหรับ PNG) */
  headerMagicBytes: string;
  /** ชื่อทางการของ Signature ที่ตรวจสอบพบ (เช่น "PNG Image", "WAVE Audio", "FBX Binary") */
  identifiedMagicSignature?: string;
  /** 256-bin histogram แสดงความถี่ของแต่ละ Byte (0..255) */
  byteHistogram: number[];
  /** คำอธิบายสรุปเชิง Entropy สำหรับผู้ใช้ */
  entropySummary: string;
}

/**
 * เวกเตอร์คุณลักษณะสำหรับการจำแนกประเภทด้วย Heuristics (Heuristic Feature Vector)
 */
export interface HeuristicFeatureVector {
  detectedCategory: EngineAssetCategory;
  detectedSubType: EngineAssetSubType;
  confidence: number; // 0.0 - 1.0 (100%)
  matchedRules: string[];
  heuristicScores: {
    meshLikelihood: number;
    textureLikelihood: number;
    audioLikelihood: number;
    materialLikelihood: number;
    codeLikelihood: number;
  };
  // Texture Specific Heuristics
  textureFeatures?: {
    isNormalMapBlueBiased: boolean;
    isGrayscaleChannelUniform: boolean;
    isPowerOfTwoDimension: boolean;
    channelCountEstimated: number;
    mipMapLikelihood: boolean;
    colorSpaceSuggestion: 'sRGB' | 'Linear_Color' | 'NonColor_Data';
  };
  // Mesh Specific Heuristics
  meshFeatures?: {
    isTextBasedGeometry: boolean; // เช่น ASCII OBJ
    hasBonesOrSkeletons: boolean;
    estimatedTriCountTier: 'low_poly' | 'mid_poly' | 'high_poly' | 'cinematic_nanite';
    lodLevelDetected?: number;
    uvChannelCountEstimated: number;
  };
  // Audio Specific Heuristics
  audioFeatures?: {
    estimatedDurationTier: 'one_shot_short' | 'clip_medium' | 'extended_music';
    isSeamlessLoopCandidate: boolean;
    isSpeechFrequencyBiased: boolean;
    stereoChannelsEstimated: number;
    dynamicRangeTier: 'compact' | 'standard' | 'high_dynamic_range';
  };
}

/**
 * ป้ายกำกับอัจฉริยะ (Smart Auto-Generated Semantic Tag)
 */
export interface AssetSemanticTag {
  id: string;
  label: string;
  category: 'Type' | 'Role' | 'Format' | 'PBR' | 'Quality' | 'Engine' | 'LOD' | 'Audio_Genre' | 'Alert';
  confidence: number; // 0..1
  colorHex: string;
  source: 'entropy_analyzer' | 'heuristic_engine' | 'ai_inference' | 'user_override';
}

/**
 * ข้อเสนอแนะการจัดวางโฟลเดอร์ (Folder Relocation Suggestion)
 */
export interface FolderRelocationSuggestion {
  currentFolderId: string;
  currentPath: string;
  suggestedFolderId: string;
  suggestedFolderPath: string;
  folderCategory: string;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * โครงสร้างข้อมูล Asset ที่ผ่านการวิเคราะห์ด้วยระบบ AI Background Worker
 */
export interface AnalyzedProjectAsset {
  id: string;
  name: string;
  rawFileName: string;
  extension: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  folderId: string;
  currentPath: string;
  lastScannedTimestamp: number;
  // Entropy & Heuristic Data
  entropyProfile: FileEntropyProfile;
  heuristicFeatures: HeuristicFeatureVector;
  // AI Generated Metadata & Tags
  primaryCategory: EngineAssetCategory;
  subType: EngineAssetSubType;
  tags: AssetSemanticTag[];
  confidenceScore: number;
  suggestedFolder: FolderRelocationSuggestion;
  isOrganized: boolean;
  needsUserReview: boolean;
  optimizationAdvice: string[];
}

/**
 * สถานะการทำงานของ Background Worker (Worker Telemetry & Lifecycle)
 */
export type WorkerExecutionState = 'idle' | 'scanning' | 'paused' | 'throttled' | 'completed' | 'error';

export interface BackgroundWorkerMetrics {
  state: WorkerExecutionState;
  throttleLevel: 'low_power' | 'balanced' | 'turbo';
  totalAssetsInProject: number;
  scannedAssetsCount: number;
  pendingQueueCount: number;
  autoTaggedCount: number;
  reorganizedCount: number;
  scanProgressPercent: number;
  currentScanningFileName: string | null;
  averageScanDurationMs: number;
  entropyCalculationsPerSec: number;
  cpuLoadEstimatePercent: number;
  lastRunTimestamp: number;
  recentLogs: Array<{
    id: string;
    timestamp: number;
    level: 'info' | 'success' | 'warn' | 'error';
    message: string;
    assetName?: string;
  }>;
}

/**
 * กฎการสร้างโครงสร้างโฟลเดอร์สำหรับ Content Browser (Taxonomy Organization Rule)
 */
export interface TaxonomyFolderRule {
  targetCategory: EngineAssetCategory;
  subTypeMatcher?: EngineAssetSubType[];
  folderName: string;
  destinationPath: string;
  iconName: string;
  colorHex: string;
}
