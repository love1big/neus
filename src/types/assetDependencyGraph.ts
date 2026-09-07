/**
 * ============================================================================
 * @file assetDependencyGraph.ts
 * @system Art & 3D Asset Topology Architecture
 * @module Asset Dependency Graph Type Definitions
 * ============================================================================
 * 
 * 📌 [บทบาทและหน้าที่ / Module Purpose & Responsibility]:
 * ประกาศ Type Definitions และ Data Contracts ทั้งหมดสำหรับระบบแผนผังแสดงความเชื่อมโยงของแอสเซท
 * (Asset Dependency Graph) ครอบคลุม:
 * 1. โหนดของสินทรัพย์ (Asset Node) เช่น โมเดล 3D, เท็กเจอร์ PBR, แมทีเรียล, เชดเดอร์, เสียง, แอนิเมชัน
 * 2. ลิงก์ความสัมพันธ์ (Asset Dependency Link) เช่น โมเดลใช้แมทีเรียล, แมทีเรียลเรียกเท็กเจอร์
 * 3. คุณสมบัติของ PBR Texture Maps (Albedo, Normal, Roughness, Metallic, AO, Emission)
 * 4. พารามิเตอร์การจำลองฟิสิกส์ Force-Directed (D3 Force Simulation Config)
 * 5. สถานะตัวกรอง, เมตริก VRAM/Disk, และผลการตรวจจับ Circular / Orphaned Assets
 * 
 * 🏗️ [สถาปัตยกรรมและการเชื่อมต่อ / Architecture & Integration]:
 * - ใช้งานร่วมกับ AssetDependencyGraphRepository.ts, AssetForceDirectedSimulationNode.ts
 * - เชื่อมโยงเข้ากับ AssetDependencyGraphStudio.tsx ใน ArtStudioHub
 * 
 * 📥 [Data Contracts]:
 * - AssetNode: ข้อมูลสินทรัพย์พร้อมเมตริกขนาด, โพลีกอน, และสถานะการโหลด
 * - AssetLink: เส้นความสัมพันธ์ระบุชนิดของการพึ่งพา (e.g., 'uses_texture', 'binds_material')
 * - AssetDependencyMetrics: ข้อมูลสถิติรวมของโปรเจกต์
 * 
 * 🛡️ [Error Handling]:
 * - มีสถานะ 'missing' สำหรับตรวจจับลิงก์ที่ไฟล์ต้นทางสูญหาย
 * - มีสถานะ 'orphaned' สำหรับสินทรัพย์ที่ไม่มีใครเรียกใช้
 * ============================================================================
 */

import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

/**
 * ชนิดของสินทรัพย์ใน Engine
 */
export type AssetType = 
  | 'model_3d'         // 3D Mesh (.gltf, .fbx, .obj, procedural mesh)
  | 'texture'          // 2D Image / PBR Texture Map (.png, .dds, .ktx2, .exr)
  | 'material'         // PBR Material Definition (.mat, .json)
  | 'shader'           // Shader Graph / HLSL / GLSL code
  | 'animation'        // Skeletal Animation Clip (.anim, .bvh)
  | 'audio'            // Spatial Audio / Foley SFX (.wav, .ogg)
  | 'prefab'           // Composite Actor / Blueprint Prefab
  | 'environment_map'; // HDRI / Skybox Cubemap

/**
 * ชนิดของ PBR Texture Map Slot
 */
export type TextureMapType = 
  | 'albedo'
  | 'normal'
  | 'roughness'
  | 'metallic'
  | 'ambient_occlusion'
  | 'emission'
  | 'height_displacement'
  | 'orm_packed'
  | 'cubemap_sky'
  | 'custom_mask';

/**
 * สถานะความสมบูรณ์ของ Asset
 */
export type AssetStatus = 
  | 'loaded'     // แอสเซทพร้อมใช้งานปกติ
  | 'missing'    // แอสเซทสูญหาย / ลิงก์เสีย (Broken Reference)
  | 'orphaned'   // แอสเซทลอยอยู่โดยไม่มีใครเรียกใช้ (Unreferenced)
  | 'oversized'; // ขนาดเท็กเจอร์หรือโพลีกอนสูงเกินเกณฑ์กำหนด (>4K หรือ >100k tris)

/**
 * ชนิดของความสัมพันธ์ระหว่าง Asset
 */
export type DependencyRelationType =
  | 'uses_texture'      // แมทีเรียลใช้เท็กเจอร์
  | 'binds_material'    // โมเดล 3D ผูกกับแมทีเรียล
  | 'instantiates_mesh' // พรีแฟบเรียกใช้งานโมเดล
  | 'plays_animation'   // โมเดล/พรีแฟบเรียกแอนิเมชัน
  | 'emits_audio'       // เหตุการณ์หรือโมเดลเรียกใช้เสียง
  | 'compiles_shader'   // แมทีเรียลคอมไพล์มาจากเชดเดอร์
  | 'references_parent';// การสืบทอดหรืออ้างอิงลำดับชั้น

/**
 * โหนดใน Force-Directed Graph สำหรับ Asset
 */
export interface AssetNode extends SimulationNodeDatum {
  id: string;
  name: string;
  type: AssetType;
  path: string;
  format: string;
  fileSizeBytes: number;        // ขนาดไฟล์ในดิสก์
  vramEstimateBytes: number;     // ขนาดหน่วยความจำ VRAM โดยประมาณ
  status: AssetStatus;
  
  // คุณสมบัติเฉพาะของ 3D Model
  triangles?: number;
  vertices?: number;
  lodLevel?: number;            // 0, 1, 2, ...
  submeshCount?: number;

  // คุณสมบัติเฉพาะของ Texture
  width?: number;
  height?: number;
  textureMapType?: TextureMapType;
  hasMipmaps?: boolean;
  compressionFormat?: 'BC7' | 'ASTC' | 'RGBA8' | 'BC1' | 'None';

  // คุณสมบัติเฉพาะของ Material / Shader
  shaderModel?: string;
  isTransparent?: boolean;
  blendMode?: 'Opaque' | 'Masked' | 'Translucent';

  // ข้อมูลเมทาดาทาเพิ่มเติม
  tags: string[];
  lastModified: string;
  author?: string;

  // Force simulation coordinates
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

/**
 * ลิงก์ความสัมพันธ์ระหว่าง Asset ใน Force-Directed Graph
 */
export interface AssetLink extends SimulationLinkDatum<AssetNode> {
  id: string;
  source: string | AssetNode;
  target: string | AssetNode;
  relation: DependencyRelationType;
  strength?: number;
  isCircular?: boolean;
  slotName?: string; // e.g. "BaseColorMap", "NormalMap", "MaterialSlot_0"
}

/**
 * สถิติรวมของระบบ Asset Dependencies
 */
export interface AssetDependencyMetrics {
  totalAssets: number;
  totalModels: number;
  totalTextures: number;
  totalMaterials: number;
  totalShaders: number;
  totalPrefabs: number;
  totalAudio: number;
  totalAnimations: number;
  totalDiskSizeBytes: number;
  totalVRAMEstimateBytes: number;
  orphanCount: number;
  brokenLinkCount: number;
  circularDependencyCount: number;
  healthScore: number; // 0 - 100
}

/**
 * ค่าคอนฟิกสำหรับการจำลอง Force-Directed Simulation
 */
export interface ForceSimulationConfig {
  chargeStrength: number;      // แรงผลักระหว่างโหนด (ค่าลบ เช่น -350)
  linkDistance: number;        // ระยะห่างมาตรฐานของลิงก์ (เช่น 80)
  linkStrength: number;        // ความตึงของสปริง (0.1 - 1.0)
  collisionRadius: number;     // รัศมีการชนกันของโหนด (เช่น 35)
  centerStrength: number;      // แรงดึงดูดเข้าสู่จุดศูนย์กลาง (0.01 - 0.2)
  alphaDecay: number;          // อัตราการลดความเร็วของฟิสิกส์
  clusteringEnabled: boolean;  // เปิดโหมดจัดกลุ่มแยกตามชนิดของแอสเซทหรือไม่
}

/**
 * ตัวกรองการแสดงผลของแผนผัง
 */
export interface AssetGraphFilterState {
  searchQuery: string;
  selectedTypes: AssetType[];
  statusFilter: 'all' | 'orphans_only' | 'broken_only' | 'high_vram_only';
  highlightNodeId: string | null;
  selectedNodeId: string | null;
  focusHops: number; // 1 = Direct neighbors, 2 = 2-hops, 0 = All
  showLabels: boolean;
  showParticlePulses: boolean;
  showOrphanCluster: boolean;
}

/**
 * พรีเซ็ตชุดข้อมูลสินทรัพย์สำหรับทดสอบ
 */
export interface AssetProjectPreset {
  id: string;
  name: string;
  description: string;
  thaiDescription: string;
  category: string;
  nodes: AssetNode[];
  links: AssetLink[];
}
