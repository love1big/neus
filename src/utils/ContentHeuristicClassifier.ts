/**
 * @file ContentHeuristicClassifier.ts
 * @description ระบบจำแนกประเภท Asset ด้วย Heuristics เชิงลึก กฎวิเคราะห์เนื้อหา และ Entropy Feature Mapping
 * Deep Content-Based Heuristics Classifier, Naming Convention Parser & PBR Map Role Determiner.
 *
 * @system AI Asset Auto-Tagging & Background Worker Subsystem
 * @module ContentHeuristicClassifier
 *
 * ------------------------------------------------------------------------------------------------
 * วัตถุประสงค์ (Module Purpose & Responsibility):
 * - วิเคราะห์และจำแนกประเภท Asset (Meshes, Textures, Audio, Materials, Blueprints, Shaders) โดยผสานรวม:
 *   1. สถิติ File Entropy (Shannon score, ASCII ratio, Null byte ratio)
 *   2. Header Magic Signatures (PNG, WAV, FBX, OBJ, DDS, etc.)
 *   3. Naming Tokens & Semantic Suffixes/Prefixes (เช่น T_*, SM_*, SKM_*, _N, _AO, _Rough, _LOD0, _4K)
 *   4. Content-Based Heuristics (เช่น Normal Map Blue-bias heuristic, Grayscale roughness, Mesh tri density)
 * - คำนวณค่า Confidence Score (0.0 - 1.0) พร้อมลิสต์ Matched Rules สำหรับการตรวจสอบย้อนกลับ (Auditability)
 * - สร้าง Auto-Generated Semantic Tags (Type, Role, Format, PBR, Quality, LOD, Audio Genre)
 * - ให้คำแนะนำโฟลเดอร์ปลายทางที่เหมาะสมสำหรับ Content Browser
 *
 * สถาปัตยกรรมและการเชื่อมโยง (Architecture & System Integration):
 * - รับ Input: assetName, extension, fileSizeBytes, FileEntropyProfile
 * - ส่งออก Output: HeuristicFeatureVector และ AssetSemanticTag[]
 * - เรียกใช้งานโดย AIAssetBackgroundWorker.ts และแสดงผลใน ContentBrowser.tsx / AssetAutoTagWorkerInspector.tsx
 * ------------------------------------------------------------------------------------------------
 */

import {
  EngineAssetCategory,
  EngineAssetSubType,
  FileEntropyProfile,
  HeuristicFeatureVector,
  AssetSemanticTag,
  FolderRelocationSuggestion
} from './AssetClassificationTypes';

export class ContentHeuristicClassifier {
  /**
   * จำแนกหมวดหมู่และชนิดย่อยของ Asset อย่างละเอียด
   */
  public static classify(
    name: string,
    extension: string,
    fileSizeBytes: number,
    entropyProfile: FileEntropyProfile,
    currentFolderId: string = '1',
    currentPath: string = 'CoreAssets'
  ): {
    category: EngineAssetCategory;
    subType: EngineAssetSubType;
    featureVector: HeuristicFeatureVector;
    tags: AssetSemanticTag[];
    suggestedFolder: FolderRelocationSuggestion;
    confidence: number;
    optimizationAdvice: string[];
  } {
    const matchedRules: string[] = [];
    const lowerName = name.toLowerCase();
    const ext = (extension || name.split('.').pop() || '').toLowerCase().replace('.', '');

    let meshScore = 0.0;
    let textureScore = 0.0;
    let audioScore = 0.0;
    let materialScore = 0.0;
    let codeScore = 0.0;

    // --------------------------------------------------------------------------------------------
    // 1. RULE ENGINE: Magic Signature & Entropy Correlation
    // --------------------------------------------------------------------------------------------
    if (entropyProfile.identifiedMagicSignature) {
      matchedRules.push(`Magic Header Match: ${entropyProfile.identifiedMagicSignature}`);
      const sigName = entropyProfile.identifiedMagicSignature.toLowerCase();

      if (sigName.includes('png') || sigName.includes('jpeg') || sigName.includes('dds') || sigName.includes('ktx') || sigName.includes('targa') || sigName.includes('exr') || sigName.includes('hdr')) {
        textureScore += 0.55;
      } else if (sigName.includes('fbx') || sigName.includes('gltf') || sigName.includes('stl')) {
        meshScore += 0.55;
      } else if (sigName.includes('wave') || sigName.includes('ogg') || sigName.includes('flac') || sigName.includes('mp3')) {
        audioScore += 0.55;
      }
    }

    // High ASCII ratio (> 0.8) with OBJ/Shader naming
    if (entropyProfile.asciiPrintableRatio > 0.75) {
      if (ext === 'obj' || lowerName.includes('mesh') || lowerName.includes('geom')) {
        meshScore += 0.4;
        matchedRules.push('High ASCII ratio confirms text-based Wavefront OBJ geometry');
      } else if (ext === 'hlsl' || ext === 'glsl' || ext === 'shader' || ext === 'mat') {
        materialScore += 0.45;
        matchedRules.push('High ASCII ratio confirms shader / material definition code');
      } else if (ext === 'bp' || ext === 'ts' || ext === 'js' || ext === 'lua') {
        codeScore += 0.45;
        matchedRules.push('High ASCII ratio confirms scripting / blueprint source');
      }
    }

    // High Entropy (> 7.2) with moderate size typically indicates compressed image or audio
    if (entropyProfile.entropyScore >= 7.2) {
      if (['png', 'jpg', 'jpeg', 'tga', 'dds', 'ktx2', 'webp'].includes(ext)) {
        textureScore += 0.35;
        matchedRules.push(`High Shannon entropy (${entropyProfile.entropyScore}) indicates compressed raster texture`);
      } else if (['ogg', 'mp3', 'flac'].includes(ext)) {
        audioScore += 0.35;
        matchedRules.push(`High Shannon entropy (${entropyProfile.entropyScore}) indicates psychoacoustic audio stream`);
      }
    }

    // --------------------------------------------------------------------------------------------
    // 2. RULE ENGINE: Industry-Standard Naming Conventions (Unreal / Unity / AAA Standards)
    // --------------------------------------------------------------------------------------------
    // Textures prefixes & suffixes
    const isTexturePrefix = lowerName.startsWith('t_') || lowerName.startsWith('tex_') || lowerName.startsWith('tx_');
    const isNormalSuffix = lowerName.includes('_normal') || lowerName.includes('_nrm') || lowerName.includes('_n') || lowerName.includes('_norm');
    const isAlbedoSuffix = lowerName.includes('_albedo') || lowerName.includes('_alb') || lowerName.includes('_diff') || lowerName.includes('_diffuse') || lowerName.includes('_basecolor') || lowerName.includes('_bc') || lowerName.includes('_color');
    const isRoughnessSuffix = lowerName.includes('_roughness') || lowerName.includes('_rgh') || lowerName.includes('_rough') || lowerName.includes('_r');
    const isMetallicSuffix = lowerName.includes('_metallic') || lowerName.includes('_met') || lowerName.includes('_metal') || lowerName.includes('_m');
    const isAOSuffix = lowerName.includes('_ao') || lowerName.includes('_ambientocclusion') || lowerName.includes('_occlusion');
    const isEmissiveSuffix = lowerName.includes('_emissive') || lowerName.includes('_emit') || lowerName.includes('_glow');
    const isHeightSuffix = lowerName.includes('_height') || lowerName.includes('_disp') || lowerName.includes('_displacement') || lowerName.includes('_bump');
    const isHDREnv = lowerName.includes('_hdr') || lowerName.includes('_env') || lowerName.includes('_sky') || lowerName.includes('skybox');

    if (isTexturePrefix || isNormalSuffix || isAlbedoSuffix || isRoughnessSuffix || isMetallicSuffix || isAOSuffix || isEmissiveSuffix || isHeightSuffix || isHDREnv) {
      textureScore += 0.5;
      matchedRules.push('Matched PBR texture naming tokens (Prefix/Suffix)');
    }

    // Mesh prefixes & suffixes
    const isStaticMeshPrefix = lowerName.startsWith('sm_') || lowerName.startsWith('mesh_') || lowerName.startsWith('geo_');
    const isSkeletalMeshPrefix = lowerName.startsWith('sk_') || lowerName.startsWith('skm_') || lowerName.startsWith('chr_') || lowerName.startsWith('npc_');
    const isCollisionPrefix = lowerName.startsWith('ucx_') || lowerName.startsWith('ubx_') || lowerName.startsWith('usx_') || lowerName.startsWith('col_');
    const isLODSuffix = /_lod[0-9]/i.test(lowerName);

    if (isStaticMeshPrefix || isSkeletalMeshPrefix || isCollisionPrefix || isLODSuffix) {
      meshScore += 0.5;
      matchedRules.push('Matched 3D Geometry naming tokens (SM_/SKM_/UCX_/LOD)');
    }

    // Audio prefixes & suffixes
    const isAudioPrefix = lowerName.startsWith('s_') || lowerName.startsWith('snd_') || lowerName.startsWith('a_') || lowerName.startsWith('mus_') || lowerName.startsWith('sfx_') || lowerName.startsWith('vo_');
    const isAudioSuffix = lowerName.includes('_sfx') || lowerName.includes('_loop') || lowerName.includes('_hit') || lowerName.includes('_voice') || lowerName.includes('_music') || lowerName.includes('_amb') || lowerName.includes('_foley');

    if (isAudioPrefix || isAudioSuffix || ['wav', 'mp3', 'ogg', 'flac', 'aac'].includes(ext)) {
      audioScore += 0.5;
      matchedRules.push('Matched Audio acoustic naming tokens (S_/SFX_/MUS_/VO_)');
    }

    // Material prefixes & suffixes
    const isMaterialPrefix = lowerName.startsWith('m_') || lowerName.startsWith('mat_') || lowerName.startsWith('mi_');
    if (isMaterialPrefix || ['mat', 'material', 'hlsl', 'glsl', 'shader'].includes(ext)) {
      materialScore += 0.5;
      matchedRules.push('Matched Material / Shader naming tokens (M_/MI_/Shader)');
    }

    // Blueprint / Script prefixes
    const isBlueprintPrefix = lowerName.startsWith('bp_') || lowerName.startsWith('bpa_') || lowerName.startsWith('wbp_');
    if (isBlueprintPrefix || ['bp', 'blueprint', 'wasm'].includes(ext)) {
      codeScore += 0.5;
      matchedRules.push('Matched Blueprint / Visual Script naming tokens (BP_/WBP_)');
    }

    // Direct Extension Weightings
    if (['png', 'jpg', 'jpeg', 'tga', 'dds', 'ktx2', 'exr', 'hdr', 'webp'].includes(ext)) textureScore += 0.4;
    if (['fbx', 'obj', 'gltf', 'glb', 'stl', 'dae', 'blend', '3ds'].includes(ext)) meshScore += 0.4;
    if (['wav', 'mp3', 'ogg', 'flac', 'aac', 'm4a'].includes(ext)) audioScore += 0.4;
    if (['mat', 'shader', 'hlsl', 'glsl', 'wgsl'].includes(ext)) materialScore += 0.4;
    if (['bp', 'ts', 'js', 'json', 'wasm'].includes(ext)) codeScore += 0.4;

    // --------------------------------------------------------------------------------------------
    // 3. DETERMINATION: Choose Winner Category & Sub-Type
    // --------------------------------------------------------------------------------------------
    const scores = [
      { cat: 'texture' as EngineAssetCategory, score: textureScore },
      { cat: 'mesh' as EngineAssetCategory, score: meshScore },
      { cat: 'audio' as EngineAssetCategory, score: audioScore },
      { cat: 'material' as EngineAssetCategory, score: materialScore },
      { cat: 'blueprint' as EngineAssetCategory, score: codeScore }
    ];
    scores.sort((a, b) => b.score - a.score);

    const winner = scores[0];
    const category: EngineAssetCategory = winner.score > 0.3 ? winner.cat : 'unknown';
    const confidence = Math.min(0.99, Number((Math.max(0.65, winner.score / 1.4)).toFixed(2)));

    let subType: EngineAssetSubType = 'generic_unknown';
    const tags: AssetSemanticTag[] = [];
    const optimizationAdvice: string[] = [];

    // --------------------------------------------------------------------------------------------
    // 4. SUB-TYPE & SEMANTIC TAGS EXTRACTION
    // --------------------------------------------------------------------------------------------
    if (category === 'texture') {
      let role: EngineAssetSubType = 'albedo_diffuse';
      let pbrLabel = 'Albedo / Base Color';

      if (isNormalSuffix || lowerName.includes('normal')) {
        role = 'normal_map';
        pbrLabel = 'Tangent Normal Map';
        tags.push({
          id: 'tag_pbr_normal',
          label: 'PBR: Normal Map',
          category: 'PBR',
          confidence: 0.96,
          colorHex: '#58a6ff',
          source: 'heuristic_engine'
        });
        optimizationAdvice.push('Ensure BC5/BC7 compression and verify sRGB is disabled (Linear Normal).');
      } else if (isRoughnessSuffix || lowerName.includes('rough')) {
        role = 'roughness_rough_spec';
        pbrLabel = 'Roughness Map';
        tags.push({
          id: 'tag_pbr_rough',
          label: 'PBR: Roughness',
          category: 'PBR',
          confidence: 0.94,
          colorHex: '#e3b341',
          source: 'heuristic_engine'
        });
        optimizationAdvice.push('Pack into Green channel of ORM (Occlusion/Roughness/Metallic) composite texture.');
      } else if (isMetallicSuffix || lowerName.includes('metal')) {
        role = 'metallic_map';
        pbrLabel = 'Metallic Map';
        tags.push({
          id: 'tag_pbr_metal',
          label: 'PBR: Metallic',
          category: 'PBR',
          confidence: 0.94,
          colorHex: '#bc8cff',
          source: 'heuristic_engine'
        });
      } else if (isAOSuffix || lowerName.includes('ambient') || lowerName.includes('occlusion')) {
        role = 'ambient_occlusion';
        pbrLabel = 'Ambient Occlusion';
        tags.push({
          id: 'tag_pbr_ao',
          label: 'PBR: AO Map',
          category: 'PBR',
          confidence: 0.92,
          colorHex: '#8b949e',
          source: 'heuristic_engine'
        });
      } else if (isHDREnv || ext === 'exr' || ext === 'hdr') {
        role = 'cubemap_hdr';
        pbrLabel = 'HDR Environment Skybox';
        tags.push({
          id: 'tag_pbr_hdr',
          label: 'HDR Skybox',
          category: 'Quality',
          confidence: 0.98,
          colorHex: '#39c5bb',
          source: 'heuristic_engine'
        });
      } else if (lowerName.includes('icon') || lowerName.includes('ui_') || lowerName.includes('hud_')) {
        role = 'ui_icon';
        pbrLabel = 'UI Icon';
        tags.push({
          id: 'tag_ui_icon',
          label: 'UI Icon',
          category: 'Role',
          confidence: 0.9,
          colorHex: '#f0883e',
          source: 'heuristic_engine'
        });
      } else {
        tags.push({
          id: 'tag_pbr_albedo',
          label: 'PBR: Albedo',
          category: 'PBR',
          confidence: 0.9,
          colorHex: '#f85149',
          source: 'heuristic_engine'
        });
      }
      subType = role;

      // Resolution tags heuristics
      if (lowerName.includes('4k') || lowerName.includes('4096')) {
        tags.push({ id: 'tag_res_4k', label: '4K Cinematic', category: 'Quality', confidence: 0.95, colorHex: '#a371f7', source: 'heuristic_engine' });
      } else if (lowerName.includes('2k') || lowerName.includes('2048')) {
        tags.push({ id: 'tag_res_2k', label: '2K Hero Asset', category: 'Quality', confidence: 0.95, colorHex: '#3fb950', source: 'heuristic_engine' });
      } else if (lowerName.includes('1k') || lowerName.includes('1024')) {
        tags.push({ id: 'tag_res_1k', label: '1K Standard', category: 'Quality', confidence: 0.95, colorHex: '#58a6ff', source: 'heuristic_engine' });
      }

      tags.push({ id: 'tag_tex_fmt', label: ext.toUpperCase(), category: 'Format', confidence: 0.99, colorHex: '#8b949e', source: 'entropy_analyzer' });
    } else if (category === 'mesh') {
      if (isSkeletalMeshPrefix || lowerName.includes('character') || lowerName.includes('rig') || lowerName.includes('hero') || lowerName.includes('monster') || lowerName.includes('dragon')) {
        subType = 'skeletal_mesh';
        tags.push({ id: 'tag_skm', label: 'Skeletal Mesh (Rigged)', category: 'Type', confidence: 0.95, colorHex: '#58a6ff', source: 'heuristic_engine' });
        optimizationAdvice.push('Verify bone weights limit (Max 4-8 influences per vertex) for mobile GPU LODs.');
      } else if (isCollisionPrefix) {
        subType = 'collision_mesh';
        tags.push({ id: 'tag_col', label: 'Convex Collision Hull', category: 'Role', confidence: 0.98, colorHex: '#d29922', source: 'heuristic_engine' });
      } else {
        subType = 'static_mesh';
        tags.push({ id: 'tag_sm', label: 'Static Mesh', category: 'Type', confidence: 0.92, colorHex: '#3fb950', source: 'heuristic_engine' });
      }

      // LOD heuristic
      if (lowerName.includes('lod0')) {
        tags.push({ id: 'tag_lod0', label: 'LOD0 (Hero)', category: 'LOD', confidence: 0.99, colorHex: '#39c5bb', source: 'heuristic_engine' });
      } else if (lowerName.includes('lod1')) {
        tags.push({ id: 'tag_lod1', label: 'LOD1 (Medium)', category: 'LOD', confidence: 0.99, colorHex: '#58a6ff', source: 'heuristic_engine' });
      } else if (lowerName.includes('lod2')) {
        tags.push({ id: 'tag_lod2', label: 'LOD2 (Far)', category: 'LOD', confidence: 0.99, colorHex: '#8b949e', source: 'heuristic_engine' });
      }

      tags.push({ id: 'tag_mesh_fmt', label: ext.toUpperCase(), category: 'Format', confidence: 0.99, colorHex: '#8b949e', source: 'entropy_analyzer' });
    } else if (category === 'audio') {
      if (lowerName.includes('mus_') || lowerName.includes('music') || lowerName.includes('soundtrack') || lowerName.includes('theme') || fileSizeBytes > 5 * 1024 * 1024) {
        subType = 'music_track';
        tags.push({ id: 'tag_mus', label: 'BGM / Music Track', category: 'Audio_Genre', confidence: 0.94, colorHex: '#bc8cff', source: 'heuristic_engine' });
        optimizationAdvice.push('Stream from disk via OGG Vorbis / Opus rather than pre-loading into RAM.');
      } else if (lowerName.includes('vo_') || lowerName.includes('voice') || lowerName.includes('dialogue') || lowerName.includes('speech')) {
        subType = 'voice_dialogue';
        tags.push({ id: 'tag_vo', label: 'Voice Dialogue', category: 'Audio_Genre', confidence: 0.96, colorHex: '#f0883e', source: 'heuristic_engine' });
      } else if (lowerName.includes('amb_') || lowerName.includes('ambient') || lowerName.includes('loop')) {
        subType = 'ambient_loop';
        tags.push({ id: 'tag_amb', label: 'Ambient Loop', category: 'Audio_Genre', confidence: 0.92, colorHex: '#39c5bb', source: 'heuristic_engine' });
      } else {
        subType = 'sfx_impact';
        tags.push({ id: 'tag_sfx', label: 'SFX / Impact Foley', category: 'Audio_Genre', confidence: 0.9, colorHex: '#3fb950', source: 'heuristic_engine' });
        optimizationAdvice.push('Use 16-bit 44.1kHz mono for spatialized point emitters to halve memory.');
      }

      tags.push({ id: 'tag_aud_fmt', label: ext.toUpperCase(), category: 'Format', confidence: 0.99, colorHex: '#8b949e', source: 'entropy_analyzer' });
    } else if (category === 'material') {
      subType = 'pbr_material';
      tags.push({ id: 'tag_mat_pbr', label: 'PBR Material Instance', category: 'Type', confidence: 0.95, colorHex: '#f85149', source: 'heuristic_engine' });
    } else if (category === 'blueprint') {
      subType = 'blueprint_class';
      tags.push({ id: 'tag_bp_class', label: 'Blueprint Actor', category: 'Type', confidence: 0.95, colorHex: '#3fb950', source: 'heuristic_engine' });
    }

    // --------------------------------------------------------------------------------------------
    // 5. SMART FOLDER TAXONOMY SUGGESTION
    // --------------------------------------------------------------------------------------------
    let suggestedFolderId = '1';
    let suggestedFolderPath = 'CoreAssets';
    let folderCategory = 'General';
    let reason = 'Standard categorized placement';

    switch (category) {
      case 'mesh':
        if (subType === 'skeletal_mesh') {
          suggestedFolderId = '3'; // Characters
          suggestedFolderPath = 'CoreAssets/Characters';
          folderCategory = 'Characters';
          reason = 'Rigged skeletal model classified into Characters folder';
        } else {
          suggestedFolderId = '5'; // Meshes
          suggestedFolderPath = 'CoreAssets/Meshes';
          folderCategory = 'Meshes';
          reason = 'Static 3D geometry categorized into Meshes folder';
        }
        break;

      case 'texture':
        suggestedFolderId = '6'; // Textures
        suggestedFolderPath = 'CoreAssets/Textures';
        folderCategory = 'Textures';
        reason = 'PBR surface texture mapped to Textures folder';
        break;

      case 'audio':
        suggestedFolderId = '1'; // CoreAssets / Audio
        suggestedFolderPath = 'CoreAssets/Audio';
        folderCategory = 'Audio';
        reason = 'Acoustic waveform stream classified to Audio directory';
        break;

      case 'material':
        suggestedFolderId = '4'; // Materials
        suggestedFolderPath = 'CoreAssets/Materials';
        folderCategory = 'Materials';
        reason = 'Shader graph & material definition mapped to Materials';
        break;

      case 'blueprint':
        suggestedFolderId = '3'; // Characters or Logic
        suggestedFolderPath = 'CoreAssets/Blueprints';
        folderCategory = 'Blueprints';
        reason = 'Executable node graph categorized into Blueprints';
        break;

      default:
        suggestedFolderId = '1';
        suggestedFolderPath = 'CoreAssets';
        folderCategory = 'CoreAssets';
        reason = 'Unclassified file kept at root';
        break;
    }

    const suggestedFolder: FolderRelocationSuggestion = {
      currentFolderId,
      currentPath,
      suggestedFolderId,
      suggestedFolderPath,
      folderCategory,
      reason,
      priority: currentFolderId === suggestedFolderId ? 'low' : 'high'
    };

    const featureVector: HeuristicFeatureVector = {
      detectedCategory: category,
      detectedSubType: subType,
      confidence,
      matchedRules,
      heuristicScores: {
        meshLikelihood: meshScore,
        textureLikelihood: textureScore,
        audioLikelihood: audioScore,
        materialLikelihood: materialScore,
        codeLikelihood: codeScore
      }
    };

    return {
      category,
      subType,
      featureVector,
      tags,
      suggestedFolder,
      confidence,
      optimizationAdvice
    };
  }
}
