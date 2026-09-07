/**
 * ============================================================================
 * @file AssetDependencyGraphRepository.ts
 * @system Art & 3D Asset Topology Architecture
 * @module Asset Dependency Graph Repository & Project Presets
 * ============================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Purpose & Responsibility]:
 * คลังข้อมูลและตัวจัดการชุดข้อมูล Asset Dependency Topology (Asset Repository):
 * 1. บรรจุข้อมูลชุดสินทรัพย์ระดับสตูดิโอ AAA (Realistic Production Asset Presets)
 *    - "Sci-Fi Mech Cyber Titan": โมเดลหุ่นรบหลายชิ้นส่วน, LOD 0/1/2, PBR Maps 4K, เสียง และแอนิเมชัน
 *    - "Medieval Citadel & Gothic Cathedral": สถาปัตยกรรมโกธิก, Modular Kit, Trim Sheets, กระจกสี
 *    - "Cyberpunk Hoverbike Vehicle": ยานยนต์ลอยฟ้า, ชิ้นส่วนคาร์บอนไฟเบอร์, นีออน, เชดเดอร์กระจก
 *    - "Asset Health Audit (Orphans & Broken Refs)": โครงการสำหรับตรวจจับเท็กเจอร์ค้างทิ้งและลิงก์เสีย
 * 2. รองรับการเพิ่ม, ลบ, แก้ไข Asset Node และ Dependency Link แบบไดนามิก
 * 3. มีระบบ One-Click Clean Orphan Assets เพื่อล้างสินทรัพย์ที่ไม่จำเป็นออกจากโครงการ
 * 4. จัดการจัดเก็บและโหลดประวัติผ่าน localStorage
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture & Integration]:
 * - ให้บริการข้อมูลแก่ AssetDependencyGraphStudio.tsx
 * - ใช้งานร่วมกับ AssetDependencyCycleDetectorNode.ts เพื่อคำนวณ Metrics ทันที
 * 
 * 📥 [Inputs / Data Contracts]:
 * - Preset ID, Custom AssetNode, Custom AssetLink
 * 
 * 📤 [Outputs]:
 * - AssetProjectPreset, AssetNode[], AssetLink[]
 * 
 * 🛡️ [Error Handling & Fallbacks]:
 * - Deep Clone ข้อมูลเพื่อป้องกัน Mutation ระหว่างรัน D3 Physics Simulation
 * - Fallback ไปยัง Default Preset เสมอหากเกิดข้อผิดพลาดในการโหลด
 * ============================================================================
 */

import { AssetNode, AssetLink, AssetProjectPreset } from '../types/assetDependencyGraph';

/**
 * Helper แปลงขนาดไบต์เป็นข้อความอ่านง่าย (e.g. 14.2 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * 1. Preset: Sci-Fi Mech Cyber Titan (Titan หุ่นยนต์รบระดับ AAA)
 */
const PRESET_MECH_TITAN: AssetProjectPreset = {
  id: 'mech_titan',
  name: 'Sci-Fi Mech Cyber Titan (AAA Rig)',
  description: 'Multi-part mechanical battle suit with LODs, 4K PBR texture sets, audio foley and animation rigs.',
  thaiDescription: 'หุ่นรบจักรกลไซไฟพร้อม LOD 3 ระดับ, เท็กเจอร์ PBR 4K ครบชุด, ระบบเสียงและริกแอนิเมชัน',
  category: '🤖 Hard Surface & Characters',
  nodes: [
    // Top-Level Prefab
    {
      id: 'prefab_cyber_titan',
      name: 'BP_CyberTitan_Hero',
      type: 'prefab',
      path: '/Assets/Blueprints/BP_CyberTitan_Hero.uasset',
      format: 'uasset',
      fileSizeBytes: 2450000,
      vramEstimateBytes: 520000,
      status: 'loaded',
      tags: ['hero', 'character', 'mech', 'rigged'],
      lastModified: '2026-08-15'
    },
    // 3D Models (LODs & Parts)
    {
      id: 'model_titan_chassis_lod0',
      name: 'SM_Titan_Chassis_LOD0',
      type: 'model_3d',
      path: '/Assets/Meshes/Characters/SM_Titan_Chassis_LOD0.fbx',
      format: 'fbx',
      fileSizeBytes: 28400000,
      vramEstimateBytes: 32000000,
      status: 'loaded',
      triangles: 84200,
      vertices: 43100,
      lodLevel: 0,
      submeshCount: 3,
      tags: ['lod0', 'chassis', 'high-poly'],
      lastModified: '2026-08-20'
    },
    {
      id: 'model_titan_chassis_lod1',
      name: 'SM_Titan_Chassis_LOD1',
      type: 'model_3d',
      path: '/Assets/Meshes/Characters/SM_Titan_Chassis_LOD1.fbx',
      format: 'fbx',
      fileSizeBytes: 12200000,
      vramEstimateBytes: 14000000,
      status: 'loaded',
      triangles: 38400,
      vertices: 20100,
      lodLevel: 1,
      submeshCount: 2,
      tags: ['lod1', 'chassis', 'mid-poly'],
      lastModified: '2026-08-20'
    },
    {
      id: 'model_titan_railgun',
      name: 'SM_Titan_Railgun_Weapon',
      type: 'model_3d',
      path: '/Assets/Meshes/Weapons/SM_Titan_Railgun.gltf',
      format: 'gltf',
      fileSizeBytes: 15600000,
      vramEstimateBytes: 18000000,
      status: 'loaded',
      triangles: 42100,
      vertices: 22400,
      lodLevel: 0,
      submeshCount: 2,
      tags: ['weapon', 'hard-surface'],
      lastModified: '2026-08-22'
    },
    // PBR Materials
    {
      id: 'mat_titan_armor_pbr',
      name: 'M_Titan_Armor_Coated',
      type: 'material',
      path: '/Assets/Materials/M_Titan_Armor_Coated.mat',
      format: 'mat',
      fileSizeBytes: 124000,
      vramEstimateBytes: 64000,
      status: 'loaded',
      blendMode: 'Opaque',
      shaderModel: 'PBR Metallic/Roughness',
      tags: ['armor', 'pbr', 'military'],
      lastModified: '2026-08-25'
    },
    {
      id: 'mat_titan_cockpit_glass',
      name: 'M_Cockpit_Shield_Glass',
      type: 'material',
      path: '/Assets/Materials/M_Cockpit_Shield_Glass.mat',
      format: 'mat',
      fileSizeBytes: 98000,
      vramEstimateBytes: 128000,
      status: 'loaded',
      blendMode: 'Translucent',
      isTransparent: true,
      shaderModel: 'Refractive Glass',
      tags: ['glass', 'hologram', 'cockpit'],
      lastModified: '2026-08-26'
    },
    {
      id: 'mat_railgun_heavy',
      name: 'M_Railgun_HeavySteel',
      type: 'material',
      path: '/Assets/Materials/M_Railgun_HeavySteel.mat',
      format: 'mat',
      fileSizeBytes: 110000,
      vramEstimateBytes: 48000,
      status: 'loaded',
      blendMode: 'Opaque',
      shaderModel: 'PBR Metallic/Roughness',
      tags: ['metal', 'weapon'],
      lastModified: '2026-08-26'
    },
    // 4K Textures for Armor
    {
      id: 'tex_titan_albedo_4k',
      name: 'T_Titan_Armor_BaseColor_4K',
      type: 'texture',
      path: '/Assets/Textures/Characters/T_Titan_Armor_BaseColor_4K.png',
      format: 'png',
      fileSizeBytes: 38500000,
      vramEstimateBytes: 67108864, // 64 MB uncompressed
      status: 'loaded',
      width: 4096,
      height: 4096,
      textureMapType: 'albedo',
      hasMipmaps: true,
      compressionFormat: 'BC7',
      tags: ['albedo', '4k', 'armor'],
      lastModified: '2026-08-25'
    },
    {
      id: 'tex_titan_normal_4k',
      name: 'T_Titan_Armor_Normal_4K',
      type: 'texture',
      path: '/Assets/Textures/Characters/T_Titan_Armor_Normal_4K.png',
      format: 'png',
      fileSizeBytes: 42100000,
      vramEstimateBytes: 67108864,
      status: 'loaded',
      width: 4096,
      height: 4096,
      textureMapType: 'normal',
      hasMipmaps: true,
      compressionFormat: 'BC7',
      tags: ['normal', '4k', 'details'],
      lastModified: '2026-08-25'
    },
    {
      id: 'tex_titan_orm_4k',
      name: 'T_Titan_Armor_ORM_4K',
      type: 'texture',
      path: '/Assets/Textures/Characters/T_Titan_Armor_ORM_4K.png',
      format: 'png',
      fileSizeBytes: 28400000,
      vramEstimateBytes: 67108864,
      status: 'loaded',
      width: 4096,
      height: 4096,
      textureMapType: 'orm_packed',
      hasMipmaps: true,
      compressionFormat: 'BC7',
      tags: ['orm', 'roughness', 'metallic', 'ao'],
      lastModified: '2026-08-25'
    },
    {
      id: 'tex_titan_emission_2k',
      name: 'T_Titan_Plasma_Emissive_2K',
      type: 'texture',
      path: '/Assets/Textures/Characters/T_Titan_Plasma_Emissive_2K.png',
      format: 'png',
      fileSizeBytes: 6400000,
      vramEstimateBytes: 16777216,
      status: 'loaded',
      width: 2048,
      height: 2048,
      textureMapType: 'emission',
      hasMipmaps: true,
      compressionFormat: 'BC7',
      tags: ['emission', 'plasma', 'glow'],
      lastModified: '2026-08-25'
    },
    // Weapons Textures
    {
      id: 'tex_railgun_albedo_2k',
      name: 'T_Railgun_BaseColor_2K',
      type: 'texture',
      path: '/Assets/Textures/Weapons/T_Railgun_BaseColor_2K.png',
      format: 'png',
      fileSizeBytes: 8200000,
      vramEstimateBytes: 16777216,
      status: 'loaded',
      width: 2048,
      height: 2048,
      textureMapType: 'albedo',
      hasMipmaps: true,
      compressionFormat: 'BC7',
      tags: ['albedo', 'weapon'],
      lastModified: '2026-08-26'
    },
    {
      id: 'tex_railgun_normal_2k',
      name: 'T_Railgun_Normal_2K',
      type: 'texture',
      path: '/Assets/Textures/Weapons/T_Railgun_Normal_2K.png',
      format: 'png',
      fileSizeBytes: 9100000,
      vramEstimateBytes: 16777216,
      status: 'loaded',
      width: 2048,
      height: 2048,
      textureMapType: 'normal',
      hasMipmaps: true,
      compressionFormat: 'BC7',
      tags: ['normal', 'weapon'],
      lastModified: '2026-08-26'
    },
    // Shaders
    {
      id: 'shader_advanced_pbr',
      name: 'SH_Standard_PBR_ForwardPlus',
      type: 'shader',
      path: '/Assets/Shaders/SH_Standard_PBR_ForwardPlus.hlsl',
      format: 'hlsl',
      fileSizeBytes: 48000,
      vramEstimateBytes: 32000,
      status: 'loaded',
      shaderModel: 'SM 6.5 / DX12',
      tags: ['shader', 'hlsl', 'forward_plus'],
      lastModified: '2026-07-10'
    },
    // Animation & Audio
    {
      id: 'anim_titan_walk_cycle',
      name: 'A_Titan_HeavyStomp_Walk',
      type: 'animation',
      path: '/Assets/Animations/A_Titan_HeavyStomp_Walk.anim',
      format: 'anim',
      fileSizeBytes: 3200000,
      vramEstimateBytes: 4100000,
      status: 'loaded',
      tags: ['animation', 'locomotion', 'stomp'],
      lastModified: '2026-08-28'
    },
    {
      id: 'audio_titan_step_foley',
      name: 'SFX_Titan_HydraulicStep_01',
      type: 'audio',
      path: '/Assets/Audio/SFX/SFX_Titan_HydraulicStep_01.wav',
      format: 'wav',
      fileSizeBytes: 1840000,
      vramEstimateBytes: 1840000,
      status: 'loaded',
      tags: ['audio', 'foley', 'hydraulic'],
      lastModified: '2026-08-28'
    },
    // An Orphaned unused test texture
    {
      id: 'tex_titan_legacy_test',
      name: 'T_Titan_Desert_Camo_Prototype_Unused',
      type: 'texture',
      path: '/Assets/Textures/Old/T_Titan_Desert_Camo_Prototype.png',
      format: 'png',
      fileSizeBytes: 31000000,
      vramEstimateBytes: 67108864,
      status: 'orphaned',
      width: 4096,
      height: 4096,
      textureMapType: 'albedo',
      hasMipmaps: false,
      compressionFormat: 'RGBA8',
      tags: ['unused', 'prototype', 'orphan'],
      lastModified: '2026-06-12'
    }
  ],
  links: [
    // Prefab instantiates models
    { id: 'link_1', source: 'prefab_cyber_titan', target: 'model_titan_chassis_lod0', relation: 'instantiates_mesh', slotName: 'RootMesh_LOD0' },
    { id: 'link_2', source: 'prefab_cyber_titan', target: 'model_titan_chassis_lod1', relation: 'instantiates_mesh', slotName: 'RootMesh_LOD1' },
    { id: 'link_3', source: 'prefab_cyber_titan', target: 'model_titan_railgun', relation: 'instantiates_mesh', slotName: 'RightArm_WeaponSocket' },
    { id: 'link_4', source: 'prefab_cyber_titan', target: 'anim_titan_walk_cycle', relation: 'plays_animation', slotName: 'AnimSlot_Default' },
    { id: 'link_5', source: 'prefab_cyber_titan', target: 'audio_titan_step_foley', relation: 'emits_audio', slotName: 'Footstep_Notify_Event' },

    // Models bind Materials
    { id: 'link_6', source: 'model_titan_chassis_lod0', target: 'mat_titan_armor_pbr', relation: 'binds_material', slotName: 'MaterialSlot_0_OuterArmor' },
    { id: 'link_7', source: 'model_titan_chassis_lod0', target: 'mat_titan_cockpit_glass', relation: 'binds_material', slotName: 'MaterialSlot_1_Cockpit' },
    { id: 'link_8', source: 'model_titan_chassis_lod1', target: 'mat_titan_armor_pbr', relation: 'binds_material', slotName: 'MaterialSlot_0_OuterArmor' },
    { id: 'link_9', source: 'model_titan_railgun', target: 'mat_railgun_heavy', relation: 'binds_material', slotName: 'MaterialSlot_0_Barrel' },

    // Materials compile via Shader
    { id: 'link_10', source: 'mat_titan_armor_pbr', target: 'shader_advanced_pbr', relation: 'compiles_shader', slotName: 'HLSL_Pipeline' },
    { id: 'link_11', source: 'mat_titan_cockpit_glass', target: 'shader_advanced_pbr', relation: 'compiles_shader', slotName: 'HLSL_Pipeline' },
    { id: 'link_12', source: 'mat_railgun_heavy', target: 'shader_advanced_pbr', relation: 'compiles_shader', slotName: 'HLSL_Pipeline' },

    // Materials use Textures (Armor)
    { id: 'link_13', source: 'mat_titan_armor_pbr', target: 'tex_titan_albedo_4k', relation: 'uses_texture', slotName: 'BaseColorMap' },
    { id: 'link_14', source: 'mat_titan_armor_pbr', target: 'tex_titan_normal_4k', relation: 'uses_texture', slotName: 'NormalMap' },
    { id: 'link_15', source: 'mat_titan_armor_pbr', target: 'tex_titan_orm_4k', relation: 'uses_texture', slotName: 'OcclusionRoughnessMetallicMap' },
    { id: 'link_16', source: 'mat_titan_armor_pbr', target: 'tex_titan_emission_2k', relation: 'uses_texture', slotName: 'EmissiveMap' },

    // Materials use Textures (Railgun)
    { id: 'link_17', source: 'mat_railgun_heavy', target: 'tex_railgun_albedo_2k', relation: 'uses_texture', slotName: 'BaseColorMap' },
    { id: 'link_18', source: 'mat_railgun_heavy', target: 'tex_railgun_normal_2k', relation: 'uses_texture', slotName: 'NormalMap' }
  ]
};

/**
 * 2. Preset: Medieval Citadel & Gothic Cathedral (สถาปัตยกรรมยุคกลางและสิ่งปลูกสร้าง)
 */
const PRESET_MEDIEVAL_CITADEL: AssetProjectPreset = {
  id: 'medieval_citadel',
  name: 'Medieval Citadel & Gothic Cathedral',
  description: 'Modular architectural kit with trim sheets, stained glass, weathered stone materials, and environmental props.',
  thaiDescription: 'สถาปัตยกรรมโกธิกแบบชิ้นส่วนโมดูลาร์ พร้อม Trim Sheets, กระจกสี, หินโบราณ และพร็อพฉาก',
  category: '🏰 Architecture & Environment',
  nodes: [
    {
      id: 'prefab_cathedral_complex',
      name: 'BP_Cathedral_Complex',
      type: 'prefab',
      path: '/Assets/Environment/Cathedral/BP_Cathedral_Complex.uasset',
      format: 'uasset',
      fileSizeBytes: 3100000,
      vramEstimateBytes: 840000,
      status: 'loaded',
      tags: ['environment', 'building', 'landmark'],
      lastModified: '2026-08-10'
    },
    {
      id: 'model_cathedral_facade',
      name: 'SM_Cathedral_MainFacade_LOD0',
      type: 'model_3d',
      path: '/Assets/Environment/Cathedral/SM_Cathedral_MainFacade.fbx',
      format: 'fbx',
      fileSizeBytes: 42000000,
      vramEstimateBytes: 48000000,
      status: 'loaded',
      triangles: 112000,
      vertices: 61400,
      lodLevel: 0,
      tags: ['cathedral', 'facade', 'hero'],
      lastModified: '2026-08-14'
    },
    {
      id: 'model_modular_pillar',
      name: 'SM_Cathedral_GothicPillar_A',
      type: 'model_3d',
      path: '/Assets/Environment/Cathedral/SM_Cathedral_GothicPillar_A.obj',
      format: 'obj',
      fileSizeBytes: 6800000,
      vramEstimateBytes: 8200000,
      status: 'loaded',
      triangles: 14200,
      vertices: 8100,
      lodLevel: 0,
      tags: ['modular', 'pillar'],
      lastModified: '2026-08-14'
    },
    {
      id: 'model_stained_glass_window',
      name: 'SM_RoseWindow_Large',
      type: 'model_3d',
      path: '/Assets/Environment/Cathedral/SM_RoseWindow_Large.gltf',
      format: 'gltf',
      fileSizeBytes: 4100000,
      vramEstimateBytes: 5200000,
      status: 'loaded',
      triangles: 9800,
      vertices: 5400,
      tags: ['window', 'glass'],
      lastModified: '2026-08-15'
    },
    // Materials
    {
      id: 'mat_ancient_stone_trim',
      name: 'M_Cathedral_Stone_TrimSheet',
      type: 'material',
      path: '/Assets/Materials/M_Cathedral_Stone_TrimSheet.mat',
      format: 'mat',
      fileSizeBytes: 145000,
      vramEstimateBytes: 52000,
      status: 'loaded',
      blendMode: 'Opaque',
      shaderModel: 'PBR Masked Trim',
      tags: ['trim_sheet', 'stone'],
      lastModified: '2026-08-16'
    },
    {
      id: 'mat_stained_glass_rose',
      name: 'M_StainedGlass_Illuminated',
      type: 'material',
      path: '/Assets/Materials/M_StainedGlass_Illuminated.mat',
      format: 'mat',
      fileSizeBytes: 112000,
      vramEstimateBytes: 94000,
      status: 'loaded',
      blendMode: 'Translucent',
      isTransparent: true,
      tags: ['glass', 'stained', 'illuminated'],
      lastModified: '2026-08-16'
    },
    // Textures
    {
      id: 'tex_stone_trim_albedo_4k',
      name: 'T_Stone_Trim_BaseColor_4K',
      type: 'texture',
      path: '/Assets/Textures/Environment/T_Stone_Trim_BaseColor_4K.png',
      format: 'png',
      fileSizeBytes: 34500000,
      vramEstimateBytes: 67108864,
      status: 'loaded',
      width: 4096,
      height: 4096,
      textureMapType: 'albedo',
      tags: ['stone', 'albedo', '4k'],
      lastModified: '2026-08-16'
    },
    {
      id: 'tex_stone_trim_normal_4k',
      name: 'T_Stone_Trim_Normal_4K',
      type: 'texture',
      path: '/Assets/Textures/Environment/T_Stone_Trim_Normal_4K.png',
      format: 'png',
      fileSizeBytes: 39800000,
      vramEstimateBytes: 67108864,
      status: 'loaded',
      width: 4096,
      height: 4096,
      textureMapType: 'normal',
      tags: ['stone', 'normal', '4k'],
      lastModified: '2026-08-16'
    },
    {
      id: 'tex_stone_trim_height_4k',
      name: 'T_Stone_Trim_Displacement_4K',
      type: 'texture',
      path: '/Assets/Textures/Environment/T_Stone_Trim_Displacement_4K.png',
      format: 'png',
      fileSizeBytes: 22400000,
      vramEstimateBytes: 67108864,
      status: 'loaded',
      width: 4096,
      height: 4096,
      textureMapType: 'height_displacement',
      tags: ['stone', 'height', 'tessellation'],
      lastModified: '2026-08-16'
    },
    {
      id: 'tex_stained_glass_albedo_2k',
      name: 'T_StainedGlass_Rose_Albedo_2K',
      type: 'texture',
      path: '/Assets/Textures/Environment/T_StainedGlass_Rose_Albedo_2K.png',
      format: 'png',
      fileSizeBytes: 7800000,
      vramEstimateBytes: 16777216,
      status: 'loaded',
      width: 2048,
      height: 2048,
      textureMapType: 'albedo',
      tags: ['glass', 'rose_window'],
      lastModified: '2026-08-17'
    },
    {
      id: 'tex_sky_hdri_cubemap',
      name: 'HDR_Dusk_MedievalSky_4K',
      type: 'environment_map',
      path: '/Assets/Environment/Skies/HDR_Dusk_MedievalSky_4K.exr',
      format: 'exr',
      fileSizeBytes: 52000000,
      vramEstimateBytes: 83886080,
      status: 'loaded',
      width: 4096,
      height: 2048,
      textureMapType: 'cubemap_sky',
      tags: ['skybox', 'hdri', 'lighting'],
      lastModified: '2026-08-01'
    }
  ],
  links: [
    { id: 'c_link_1', source: 'prefab_cathedral_complex', target: 'model_cathedral_facade', relation: 'instantiates_mesh', slotName: 'FacadeMesh' },
    { id: 'c_link_2', source: 'prefab_cathedral_complex', target: 'model_modular_pillar', relation: 'instantiates_mesh', slotName: 'NavePillars_Instanced' },
    { id: 'c_link_3', source: 'prefab_cathedral_complex', target: 'model_stained_glass_window', relation: 'instantiates_mesh', slotName: 'RoseWindowSocket' },
    { id: 'c_link_4', source: 'model_cathedral_facade', target: 'mat_ancient_stone_trim', relation: 'binds_material', slotName: 'TrimMaterial_Slot0' },
    { id: 'c_link_5', source: 'model_modular_pillar', target: 'mat_ancient_stone_trim', relation: 'binds_material', slotName: 'TrimMaterial_Slot0' },
    { id: 'c_link_6', source: 'model_stained_glass_window', target: 'mat_stained_glass_rose', relation: 'binds_material', slotName: 'GlassMaterial_Slot0' },
    { id: 'c_link_7', source: 'mat_ancient_stone_trim', target: 'tex_stone_trim_albedo_4k', relation: 'uses_texture', slotName: 'BaseColorMap' },
    { id: 'c_link_8', source: 'mat_ancient_stone_trim', target: 'tex_stone_trim_normal_4k', relation: 'uses_texture', slotName: 'NormalMap' },
    { id: 'c_link_9', source: 'mat_ancient_stone_trim', target: 'tex_stone_trim_height_4k', relation: 'uses_texture', slotName: 'DisplacementMap' },
    { id: 'c_link_10', source: 'mat_stained_glass_rose', target: 'tex_stained_glass_albedo_2k', relation: 'uses_texture', slotName: 'BaseColorMap' }
  ]
};

/**
 * 3. Preset: Asset Health Audit (Orphans, Broken Links, Oversized Assets)
 * โครงการที่ออกแบบมาเพื่อทดสอบการตรวจจับจุดบกพร่องและล้างไฟล์ขยะโดยเฉพาะ
 */
const PRESET_HEALTH_AUDIT: AssetProjectPreset = {
  id: 'health_audit',
  name: 'Asset Health Audit & Orphan Cleanup',
  description: 'Project diagnostic scene demonstrating unreferenced 8K textures, missing file links, and circular shader chains for optimization tests.',
  thaiDescription: 'ฉากตรวจสุขภาพโปรเจกต์ จำลองเท็กเจอร์ 8K ที่ไม่มีใครใช้, ลิงก์ไฟล์สูญหาย (Broken Link), และการเรียกวนซ้ำ',
  category: '⚠️ Diagnostic & Optimization',
  nodes: [
    {
      id: 'model_hero_character',
      name: 'SM_Knight_Hero_LOD0',
      type: 'model_3d',
      path: '/Assets/Meshes/SM_Knight_Hero_LOD0.fbx',
      format: 'fbx',
      fileSizeBytes: 35000000,
      vramEstimateBytes: 42000000,
      status: 'loaded',
      triangles: 95000,
      vertices: 49000,
      tags: ['hero', 'character'],
      lastModified: '2026-08-30'
    },
    {
      id: 'mat_knight_plate',
      name: 'M_Knight_SteelPlate',
      type: 'material',
      path: '/Assets/Materials/M_Knight_SteelPlate.mat',
      format: 'mat',
      fileSizeBytes: 130000,
      vramEstimateBytes: 64000,
      status: 'loaded',
      tags: ['steel', 'plate'],
      lastModified: '2026-08-30'
    },
    {
      id: 'tex_knight_albedo_2k',
      name: 'T_Knight_Albedo_2K',
      type: 'texture',
      path: '/Assets/Textures/T_Knight_Albedo_2K.png',
      format: 'png',
      fileSizeBytes: 8400000,
      vramEstimateBytes: 16777216,
      status: 'loaded',
      width: 2048,
      height: 2048,
      textureMapType: 'albedo',
      tags: ['albedo'],
      lastModified: '2026-08-30'
    },
    // Missing Asset Node
    {
      id: 'tex_knight_normal_MISSING',
      name: 'T_Knight_Normal_MISSING_404',
      type: 'texture',
      path: '/Assets/Textures/Corrupted/T_Knight_Normal_Deleted.png',
      format: 'png',
      fileSizeBytes: 0,
      vramEstimateBytes: 0,
      status: 'missing',
      width: 0,
      height: 0,
      textureMapType: 'normal',
      tags: ['missing', 'broken_link'],
      lastModified: '2026-07-01'
    },
    // Orphaned 8K Heavy Texture taking 268 MB VRAM
    {
      id: 'tex_orphan_uncompressed_8k',
      name: 'T_Unused_Heavy_Background_8K_Orphan',
      type: 'texture',
      path: '/Assets/Textures/Legacy/T_Heavy_Background_8K.raw',
      format: 'raw',
      fileSizeBytes: 184000000,
      vramEstimateBytes: 268435456, // 256 MB!
      status: 'orphaned',
      width: 8192,
      height: 8192,
      textureMapType: 'albedo',
      tags: ['orphan', 'oversized', 'waste'],
      lastModified: '2026-05-10'
    },
    // Orphaned Mesh
    {
      id: 'model_orphan_sword',
      name: 'SM_TestSword_Prototype_Unused',
      type: 'model_3d',
      path: '/Assets/Meshes/Test/SM_TestSword_Prototype.obj',
      format: 'obj',
      fileSizeBytes: 14000000,
      vramEstimateBytes: 18000000,
      status: 'orphaned',
      triangles: 32000,
      vertices: 17000,
      tags: ['orphan', 'test'],
      lastModified: '2026-06-05'
    },
    // Circular Reference Materials
    {
      id: 'mat_circular_subsurface_a',
      name: 'M_Skin_Subsurface_NodeA',
      type: 'material',
      path: '/Assets/Materials/Skin/M_Skin_NodeA.mat',
      format: 'mat',
      fileSizeBytes: 89000,
      vramEstimateBytes: 45000,
      status: 'loaded',
      tags: ['skin', 'circular'],
      lastModified: '2026-08-20'
    },
    {
      id: 'mat_circular_subsurface_b',
      name: 'M_Skin_Subsurface_NodeB',
      type: 'material',
      path: '/Assets/Materials/Skin/M_Skin_NodeB.mat',
      format: 'mat',
      fileSizeBytes: 89000,
      vramEstimateBytes: 45000,
      status: 'loaded',
      tags: ['skin', 'circular'],
      lastModified: '2026-08-20'
    }
  ],
  links: [
    { id: 'h_link_1', source: 'model_hero_character', target: 'mat_knight_plate', relation: 'binds_material', slotName: 'Armor_Slot' },
    { id: 'h_link_2', source: 'mat_knight_plate', target: 'tex_knight_albedo_2k', relation: 'uses_texture', slotName: 'BaseColorMap' },
    // Broken link to missing normal texture
    { id: 'h_link_3', source: 'mat_knight_plate', target: 'tex_knight_normal_MISSING', relation: 'uses_texture', slotName: 'NormalMap' },
    // Circular link between Material A and Material B
    { id: 'h_link_4', source: 'mat_circular_subsurface_a', target: 'mat_circular_subsurface_b', relation: 'references_parent', slotName: 'LayerBlend' },
    { id: 'h_link_5', source: 'mat_circular_subsurface_b', target: 'mat_circular_subsurface_a', relation: 'references_parent', slotName: 'BaseLayer' }
  ]
};

/**
 * รายการ Presets ทั้งหมดที่พร้อมให้เลือก
 */
export const ALL_ASSET_PRESETS: AssetProjectPreset[] = [
  PRESET_MECH_TITAN,
  PRESET_MEDIEVAL_CITADEL,
  PRESET_HEALTH_AUDIT
];

/**
 * คลาส Singleton จัดการ Repository ของ Asset Dependencies
 */
export class AssetDependencyGraphRepository {
  private static instance: AssetDependencyGraphRepository | null = null;
  private currentPresetId: string = 'mech_titan';
  private nodes: AssetNode[] = [];
  private links: AssetLink[] = [];
  private listeners: Array<() => void> = [];

  private constructor() {
    this.loadPreset('mech_titan');
  }

  public static getInstance(): AssetDependencyGraphRepository {
    if (!AssetDependencyGraphRepository.instance) {
      AssetDependencyGraphRepository.instance = new AssetDependencyGraphRepository();
    }
    return AssetDependencyGraphRepository.instance;
  }

  /**
   * โหลด Preset ตาม ID พร้อม Deep Clone ข้อมูล
   */
  public loadPreset(presetId: string): void {
    const preset = ALL_ASSET_PRESETS.find(p => p.id === presetId) || ALL_ASSET_PRESETS[0];
    this.currentPresetId = preset.id;
    // Deep Clone เพื่อป้องกัน Mutation ขณะรัน D3 simulation
    this.nodes = JSON.parse(JSON.stringify(preset.nodes));
    this.links = JSON.parse(JSON.stringify(preset.links));
    this.notify();
  }

  public getCurrentPreset(): AssetProjectPreset {
    return ALL_ASSET_PRESETS.find(p => p.id === this.currentPresetId) || ALL_ASSET_PRESETS[0];
  }

  public getNodes(): AssetNode[] {
    return this.nodes;
  }

  public getNodeById(nodeId: string): AssetNode | undefined {
    return this.nodes.find(n => n.id === nodeId);
  }

  public getLinks(): AssetLink[] {
    return this.links;
  }

  /**
   * ลบ Orphaned Assets ออกจากโครงการในคลิกเดียว (One-Click Cleanup)
   */
  public removeOrphanAssets(orphanIds: Set<string>): number {
    const initialCount = this.nodes.length;
    this.nodes = this.nodes.filter(n => !orphanIds.has(n.id));
    // ลบ Links ที่เกี่ยวข้อง
    this.links = this.links.filter(l => {
      const s = typeof l.source === 'string' ? l.source : l.source.id;
      const t = typeof l.target === 'string' ? l.target : l.target.id;
      return !orphanIds.has(s) && !orphanIds.has(t);
    });
    this.notify();
    return initialCount - this.nodes.length;
  }

  /**
   * เพิ่มโหนด Asset ใหม่
   */
  public addNode(node: AssetNode): void {
    this.nodes.push(node);
    this.notify();
  }

  /**
   * เพิ่มความสัมพันธ์ Dependency Link ใหม่
   */
  public addLink(link: AssetLink): void {
    this.links.push(link);
    this.notify();
  }

  /**
   * ลบโหนด Asset ตาม ID
   */
  public deleteNode(nodeId: string): void {
    this.nodes = this.nodes.filter(n => n.id !== nodeId);
    this.links = this.links.filter(l => {
      const s = typeof l.source === 'string' ? l.source : l.source.id;
      const t = typeof l.target === 'string' ? l.target : l.target.id;
      return s !== nodeId && t !== nodeId;
    });
    this.notify();
  }

  /**
   * Subscribe การเปลี่ยนแปลงข้อมูล
   */
  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
