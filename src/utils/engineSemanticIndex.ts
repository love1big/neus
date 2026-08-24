import { ALL_NAV_TARGETS, NavTarget } from './aiOfflineNavigator';
import { SOUND_PRESETS, gameAudioEngine } from './offlineGameAudioEngine';

export type SearchCategory = 'all' | 'tool' | 'asset' | 'file' | 'code' | 'audio' | 'action';

export interface SemanticSearchResult {
  id: string;
  title: string;
  thaiTitle?: string;
  category: SearchCategory;
  categoryLabel: string;
  badge?: string;
  iconName: string;
  color: string;
  description: string;
  thaiDescription?: string;
  pathOrShortcut?: string;
  targetToolId?: string; // tool to switch to on action
  actionType?: 'jump_tool' | 'open_file' | 'play_sound' | 'execute_command';
  tags: string[];
  score: number;
  metadata?: {
    fileSize?: string;
    fileExtension?: string;
    lastModified?: string;
    author?: string;
    linkedTools?: string[];
    soundPresetId?: string;
    commandAction?: () => void;
  };
}

// Synonyms and semantic intent mappings for deep bilingual Thai-English understanding
const SEMANTIC_SYNONYMS: Record<string, string[]> = {
  // Navigation & Tools
  "map": ["terrain", "level", "world", "dungeon", "biome", "foliage", "overworld", "landscape", "แผนที่", "สร้างโลก", "ฉาก", "ภูมิประเทศ", "ดันเจี้ยน", "ป่า"],
  "terrain": ["map", "heightmap", "erosion", "generator", "ดิน", "ภูเขา", "ที่ดิน", "พื้นผิว"],
  "model": ["3d", "mesh", "sculpt", "zbrush", "blender", "geometry", "โมเดล", "ปั้น", "วัตถุ", "สามมิติ", "โพลีกอน"],
  "texture": ["material", "pbr", "shader", "albedo", "normal", "roughness", "substance", "พื้นผิว", "แมททีเรียล", "สี", "ลวดลาย"],
  "shader": ["hlsl", "glsl", "wgsl", "compute", "visual shader", "material graph", "เชดเดอร์", "แสงเงา", "กราฟิก"],
  "audio": ["sound", "sfx", "music", "dsp", "foley", "voice", "ambient", "เสียง", "ดนตรี", "เอฟเฟกต์", "ซาวด์", "พากย์", "สังเคราะห์"],
  "sound": ["audio", "sfx", "fx", "dsp", "wav", "mp3", "เสียง", "เอฟเฟกต์"],
  "code": ["script", "typescript", "csharp", "cpp", "visual script", "blueprint", "logic", "โค้ด", "เขียนโปรแกรม", "สคริปต์", "ตรรกะ"],
  "script": ["code", "typescript", "javascript", "compiler", "ast", "editor", "สคริปต์", "โปรแกรม"],
  "ai": ["npc", "behavior tree", "blackboard", "copilot", "bot", "brain", "agent", "เอไอ", "ปัญญาประดิษฐ์", "พฤติกรรม", "ตัวละคร"],
  "character": ["npc", "hero", "monster", "avatar", "rigging", "animation", "metahuman", "ตัวละคร", "มอนสเตอร์", "ฮีโร่", "คน"],
  "monster": ["enemy", "creature", "boss", "mob", "สัตว์ประหลาด", "มอนสเตอร์", "ศัตรู", "บอส"],
  "physics": ["rigidbody", "ragdoll", "collision", "fluid", "chaos", "destruction", "vehicle", "ฟิสิกส์", "การชน", "แรงโน้มถ่วง", "การพังทลาย"],
  "animation": ["mocap", "timeline", "sequencer", "rig", "bone", "ik", "แอนิเมชัน", "การเคลื่อนไหว", "ท่าทาง"],
  "quest": ["story", "dialogue", "lore", "mission", "narrative", "เควส", "ภารกิจ", "เนื้อเรื่อง", "บทสนทนา", "ตำนาน"],
  "network": ["multiplayer", "server", "netcode", "rpc", "replication", "socket", "ออนไลน์", "เซิร์ฟเวอร์", "มัลติเพลเยอร์"],
  "ui": ["ux", "gui", "hud", "canvas", "menu", "interface", "figma", "หน้าจอ", "เมนู", "อินเตอร์เฟซ", "ปุ่ม"],
  "save": ["load", "state", "serialization", "database", "json", "บันทึก", "เซฟ", "โหลด", "ฐานข้อมูล"],
  "build": ["export", "compile", "publish", "release", "package", "บิ้วด์", "ส่งออก", "คอมไพล์", "แพ็กเกจ"],
  "optimize": ["profiler", "memory", "heap", "gpu", "cpu", "performance", "fps", "ความเร็ว", "เพิ่มประสิทธิภาพ", "แรม", "ความจำ"],
  "vfx": ["particle", "emitter", "flame", "smoke", "spark", "magic", "ระเบิด", "ประกายไฟ", "พาร์ติเคิล", "เวทมนตร์"],
  "weapon": ["sword", "slash", "blade", "gun", "bow", "combat", "attack", "ดาบ", "อาวุธ", "การโจมตี", "ฟัน"],
  "slash": ["sword", "blade", "attack", "cut", "ฟัน", "ดาบ", "เชือด", "โจมตี"],
  "fire": ["flame", "burn", "explosion", "pyro", "lava", "ไฟ", "เพลิง", "เผา", "ระเบิด"],
  "wind": ["storm", "tornado", "breeze", "ambient", "forest", "ลม", "พายุ", "ลมพัด", "ป่า"],
  "lightning": ["thunder", "electric", "shock", "spark", "สายฟ้า", "ฟ้าร้อง", "ไฟฟ้า", "ฟ้าผ่า"],
  "ice": ["frost", "freeze", "crystal", "cold", "น้ำแข็ง", "เยือกแข็ง", "แช่แข็ง"],
  "heal": ["holy", "buff", "magic", "cure", "blessing", "ฮีล", "รักษา", "ฟื้นฟู", "บัฟ", "พร"],
  "debug": ["debugger", "breakpoint", "step over", "step into", "call stack", "watch", "repl", "variable", "inspect", "ดีบัก", "ดีบักเกอร์", "จุดพัก", "เบรกพอยต์", "ส่องตัวแปร", "คอลสแตก", "ตรวจสอบโค้ด"],
  "breakpoint": ["debug", "debugger", "pause", "step", "จุดพัก", "เบรกพอยต์", "หยุด"],
  "dependency": ["dependency tree", "graph", "topology", "module", "node", "architecture", "blast radius", "clean architecture", "dag", "cycle", "แผนผัง", "ความสัมพันธ์", "โครงสร้าง", "พึ่งพา", "วงวน", "สถาปัตยกรรม"],
  "architecture": ["dependency", "module", "node", "clean architecture", "layers", "blast radius", "topology", "heatmap", "churn", "hotspot", "สถาปัตยกรรม", "โครงสร้างระบบ", "1 node 1 file"],
  "heatmap": ["architecture heatmap", "code churn", "hotspot", "churn", "refactor", "complexity", "technical debt", "ความร้อน", "แก้บ่อย", "จุดความร้อน", "ฮีทแมพ", "รีแฟคเตอร์", "หนี้ทางเทคนิค"],
  "hotspot": ["heatmap", "churn", "refactoring", "technical debt", "complexity", "cyclomatic", "จุดความร้อน", "แก้บ่อย", "รีแฟคเตอร์", "ความเสี่ยงโค้ด"],
  "churn": ["heatmap", "hotspot", "modifications", "code churn", "lines changed", "แก้บ่อย", "ความถี่การแก้", "ฮีทแมพ"]
};

// Engine Built-in Assets Index
export const BUILTIN_ASSETS: Omit<SemanticSearchResult, 'score'>[] = [
  // 3D Models & Meshes
  {
    id: 'asset_hero_knight_3d',
    title: 'SK_Hero_Paladin_Knight.gltf',
    thaiTitle: 'โมเดล 3 มิติ อัศวินฮีโร่พาลาดิน (Rigged & Textured)',
    category: 'asset',
    categoryLabel: '📦 3D ASSETS',
    badge: '3D MESH',
    iconName: 'Box',
    color: '#58a6ff',
    description: 'High-poly rigged hero model with 4K PBR textures, 35 combat animation blend shapes, and LOD0-LOD3 hierarchy.',
    thaiDescription: 'โมเดลฮีโร่อัศวินความละเอียดสูง พร้อมโครงกระดูก 35 ท่าทางการต่อสู้ และเท็กซ์เจอร์ PBR 4K',
    pathOrShortcut: '/assets/models/characters/SK_Hero_Paladin_Knight.gltf',
    targetToolId: 'Modeling',
    actionType: 'jump_tool',
    tags: ['model', 'character', 'hero', 'knight', 'mesh', 'gltf', 'rigged', '3d', 'ตัวละคร', 'โมเดล', 'อัศวิน'],
    metadata: { fileSize: '14.2 MB', fileExtension: '.gltf', lastModified: '2026-08-20', linkedTools: ['Modeling', 'Viewport3D', 'AnimationRiggingStudio'] }
  },
  {
    id: 'asset_cyber_katana_fbx',
    title: 'SM_Cyber_Energy_Katana.fbx',
    thaiTitle: 'โมเดลอาวุธ ดาบคาตานะพลังงานนีออน (SM)',
    category: 'asset',
    categoryLabel: '📦 3D ASSETS',
    badge: 'WEAPON',
    iconName: 'Box',
    color: '#e3b341',
    description: 'Sci-Fi Cyberpunk energy katana with emissive blade shader channels and modular hilt attachment sockets.',
    thaiDescription: 'ดาบซามูไรพลังงานไซเบอร์พังก์ พร้อมช่องปล่อยแสง Emissive และจุดเชื่อมต่อกระดูกมือ',
    pathOrShortcut: '/assets/models/weapons/SM_Cyber_Energy_Katana.fbx',
    targetToolId: 'Modeling',
    actionType: 'jump_tool',
    tags: ['weapon', 'sword', 'katana', 'cyberpunk', 'blade', 'fbx', 'slash', 'อาวุธ', 'ดาบ', 'ฟัน'],
    metadata: { fileSize: '2.8 MB', fileExtension: '.fbx', lastModified: '2026-08-21', linkedTools: ['Modeling', 'VisualShaderGraphEditor'] }
  },
  {
    id: 'asset_dragon_boss_mesh',
    title: 'SK_Inferno_Wyvern_Dragon.gltf',
    thaiTitle: 'โมเดลบอส มังกรเพลิงอินเฟอร์โน (Animated)',
    category: 'asset',
    categoryLabel: '📦 3D ASSETS',
    badge: 'BOSS MONSTER',
    iconName: 'Ghost',
    color: '#f85149',
    description: 'Gigantic flying dragon boss mesh featuring dynamic wing cloth physics and flame breath sockets.',
    thaiDescription: 'โมเดลมังกรเพลิงบอสขนาดใหญ่ พร้อมระบบฟิสิกส์ปีกและจุดปล่อยพ่นไฟ',
    pathOrShortcut: '/assets/models/monsters/SK_Inferno_Wyvern_Dragon.gltf',
    targetToolId: 'MonsterEdit',
    actionType: 'jump_tool',
    tags: ['monster', 'dragon', 'boss', 'enemy', 'creature', 'gltf', 'fire', 'สัตว์ประหลาด', 'บอส', 'มังกร'],
    metadata: { fileSize: '28.5 MB', fileExtension: '.gltf', lastModified: '2026-08-19', linkedTools: ['MonsterEdit', 'AINPCBehaviorTreeEditor'] }
  },

  // Shaders & Materials
  {
    id: 'asset_shader_pbr_master',
    title: 'M_Master_PBR_Volumetric.hlsl',
    thaiTitle: 'มาสเตอร์เชดเดอร์ PBR และหมอกเชิงปริมาตร (HLSL)',
    category: 'code',
    categoryLabel: '📜 SHADERS & SCRIPTS',
    badge: 'HLSL SHADER',
    iconName: 'Code2',
    color: '#bc8cff',
    description: 'Photorealistic PBR master shader supporting anisotropic hair, clearcoat car paint, and subsurface scattering.',
    thaiDescription: 'มาสเตอร์เชดเดอร์แสงเงาความสมจริงสูง รองรับ Subsurface Scattering, Anisotropy และหมอกเชิงปริมาตร',
    pathOrShortcut: '/engine/shaders/materials/M_Master_PBR_Volumetric.hlsl',
    targetToolId: 'VisualShaderGraphEditor',
    actionType: 'jump_tool',
    tags: ['shader', 'hlsl', 'material', 'pbr', 'rendering', 'lighting', 'เชดเดอร์', 'แสงเงา', 'กราฟิก'],
    metadata: { fileSize: '48 KB', fileExtension: '.hlsl', lastModified: '2026-08-22', linkedTools: ['VisualShaderGraphEditor', 'GraphicsRender'] }
  },
  {
    id: 'asset_shader_water_caustics',
    title: 'SH_Stylized_Ocean_Caustics.glsl',
    thaiTitle: 'เชดเดอร์ผิวน้ำ ทะเลใส และแสงสะท้อน Caustics (GLSL)',
    category: 'code',
    categoryLabel: '📜 SHADERS & SCRIPTS',
    badge: 'GLSL SHADER',
    iconName: 'Waves',
    color: '#38bdf8',
    description: 'Stylized ocean and dynamic foam shader with Gerstner wave displacement and depth foam absorption.',
    thaiDescription: 'เชดเดอร์ผิวน้ำทะเลสมจริง พร้อมคลื่น Gerstner และการคำนวณโฟมคลื่นตามระดับความลึก',
    pathOrShortcut: '/engine/shaders/water/SH_Stylized_Ocean_Caustics.glsl',
    targetToolId: 'VisualShaderGraphEditor',
    actionType: 'jump_tool',
    tags: ['shader', 'water', 'ocean', 'glsl', 'waves', 'caustics', 'น้ำ', 'ทะเล', 'เชดเดอร์'],
    metadata: { fileSize: '32 KB', fileExtension: '.glsl', lastModified: '2026-08-18', linkedTools: ['VisualShaderGraphEditor', 'OmniWorldBuilder'] }
  },
  {
    id: 'asset_mat_cliff_rock_4k',
    title: 'M_Cliff_Granite_PBR_4K.mat',
    thaiTitle: 'แมททีเรียล ผาหินแกรนิต PBR ความละเอียด 4K',
    category: 'asset',
    categoryLabel: '📦 PBR MATERIALS',
    badge: '4K MATERIAL',
    iconName: 'Layers',
    color: '#39d353',
    description: 'PBR rock material package including Albedo, Normal, Roughness, Height, and Ambient Occlusion maps.',
    thaiDescription: 'ชุดแมททีเรียลหินผา 4K ครบชุด Albedo, Normal, Roughness, Height และ AO',
    pathOrShortcut: '/assets/materials/environment/M_Cliff_Granite_PBR_4K.mat',
    targetToolId: 'TextureEdit',
    actionType: 'jump_tool',
    tags: ['texture', 'material', 'pbr', 'rock', 'stone', 'terrain', '4k', 'หิน', 'หน้าผา', 'พื้นผิว'],
    metadata: { fileSize: '64 MB', fileExtension: '.mat', lastModified: '2026-08-15', linkedTools: ['TextureEdit', 'SubstanceStyleTexturePainter'] }
  },

  // Project Files & Game Scripts
  {
    id: 'file_player_controller_ts',
    title: 'PlayerCharacterController.ts',
    thaiTitle: 'สคริปต์ควบคุมการเคลื่อนที่และการต่อสู้ของตัวละครหลัก',
    category: 'code',
    categoryLabel: '📜 SOURCE CODE',
    badge: 'TYPESCRIPT',
    iconName: 'Code2',
    color: '#58a6ff',
    description: 'Main player locomotion state machine supporting 8-way directional rolling, sprint, jumping, and combo attacks.',
    thaiDescription: 'สคริปต์ควบคุมการเคลื่อนไหว กลิ้งหลบ กระโดด และเชนคอมโบการโจมตีของตัวละครหลัก',
    pathOrShortcut: '/src/gameplay/controllers/PlayerCharacterController.ts',
    targetToolId: 'ScriptEditor',
    actionType: 'jump_tool',
    tags: ['script', 'code', 'player', 'controller', 'combat', 'movement', 'typescript', 'การควบคุม', 'ผู้เล่น', 'โค้ด'],
    metadata: { fileSize: '18 KB', fileExtension: '.ts', lastModified: '2026-08-22', linkedTools: ['ScriptEditor', 'VisualScripting'] }
  },
  {
    id: 'file_damage_calculator_ts',
    title: 'CombatDamageMatrix.ts',
    thaiTitle: 'สูตรคำนวณดาเมจ ธาตุ และคริติคอล (Combat Engine)',
    category: 'code',
    categoryLabel: '📜 SOURCE CODE',
    badge: 'MATH ENGINE',
    iconName: 'Calculator',
    color: '#ff7b72',
    description: 'Formulaic damage calculation system with elemental affinities, armor penetration, and dynamic RNG seed rolls.',
    thaiDescription: 'ระบบคำนวณค่าความเสียหาย เจาะเกราะ แพ้ทางธาตุ และการสุ่มคริติคอลตามค่าสถานะ',
    pathOrShortcut: '/src/gameplay/combat/CombatDamageMatrix.ts',
    targetToolId: 'EconomicBalancer',
    actionType: 'jump_tool',
    tags: ['combat', 'damage', 'calculation', 'rpg', 'stats', 'formula', 'ดาเมจ', 'คำนวณ', 'ระบบต่อสู้'],
    metadata: { fileSize: '12 KB', fileExtension: '.ts', lastModified: '2026-08-21', linkedTools: ['EconomicBalancer', 'GameSystems'] }
  },
  {
    id: 'file_loot_table_json',
    title: 'loot_tables_dungeon_bosses.json',
    thaiTitle: 'ตารางสุ่มดรอปไอเทมและไอเทมระดับตำนาน (Loot Table)',
    category: 'file',
    categoryLabel: '📁 DATA TABLES',
    badge: 'JSON DATA',
    iconName: 'Database',
    color: '#e3b341',
    description: 'Structured drop chances, rarity weightings, and legendary item conditions for dungeon raids.',
    thaiDescription: 'โครงสร้างอัตราการดรอปไอเทม น้ำหนักความหายาก และเงื่อนไขดรอปอาวุธระดับตำนาน',
    pathOrShortcut: '/data/tables/loot_tables_dungeon_bosses.json',
    targetToolId: 'LootTableEditor',
    actionType: 'jump_tool',
    tags: ['loot', 'item', 'drop', 'reward', 'json', 'data', 'ตารางไอเทม', 'ดรอป', 'ของรางวัล'],
    metadata: { fileSize: '95 KB', fileExtension: '.json', lastModified: '2026-08-21', linkedTools: ['LootTableEditor', 'DataTableJSONEditor'] }
  },
  {
    id: 'file_main_overworld_scene',
    title: 'World_Overworld_Kingdom.scene',
    thaiTitle: 'ซีนแผนที่หลัก อาณาจักรแฟนตาซี (Main Overworld Scene)',
    category: 'file',
    categoryLabel: '📁 SCENE FILES',
    badge: 'SCENE HIERARCHY',
    iconName: 'MapPin',
    color: '#39d353',
    description: 'Primary game world map containing terrain grids, foliage biomes, NPC spawners, and lighting baked probes.',
    thaiDescription: 'ไฟล์ซีนโลกหลัก ประกอบด้วยกริดแผนที่ ป่าไม้ จุดเกิดมอนสเตอร์ และโพรบแสงสว่าง',
    pathOrShortcut: '/scenes/world/World_Overworld_Kingdom.scene',
    targetToolId: 'OmniWorldBuilder',
    actionType: 'jump_tool',
    tags: ['scene', 'map', 'world', 'level', 'overworld', 'kingdom', 'ซีน', 'แผนที่', 'โลกหลัก'],
    metadata: { fileSize: '185 MB', fileExtension: '.scene', lastModified: '2026-08-22', linkedTools: ['OmniWorldBuilder', 'TerrainGenerator', 'BiomeFoliageGenerator'] }
  },

  // Audio DSP & Foley Presets
  {
    id: 'audio_slash_heavy_dsp',
    title: 'SFX_Blade_Slash_Heavy.dsp',
    thaiTitle: 'เสียงเอฟเฟกต์ ฟันดาบหนักคมกริบ (0ms Zero-Latency DSP)',
    category: 'audio',
    categoryLabel: '🎵 AUDIO & SFX',
    badge: '0MS DSP SOUND',
    iconName: 'Volume2',
    color: '#e3b341',
    description: 'Procedural metallic sword slice with air woosh and blade resonance decay curve.',
    thaiDescription: 'คลื่นเสียงดาบเหล็กกล้าฟันแหวกอากาศแบบ Procedural คมชัด ไร้ดีเลย์',
    pathOrShortcut: 'gameAudioEngine.playSound("slash_heavy")',
    targetToolId: 'OfflineGameAudioStudio',
    actionType: 'play_sound',
    tags: ['audio', 'sfx', 'sound', 'sword', 'slash', 'heavy', 'combat', 'เสียง', 'เสียงฟัน', 'ดาบ', 'เอฟเฟกต์'],
    metadata: { soundPresetId: 'slash_heavy', linkedTools: ['OfflineGameAudioStudio', 'OmniAudioStudio'] }
  },
  {
    id: 'audio_explosion_huge_dsp',
    title: 'SFX_Explosion_SubBass_Cataclysm.dsp',
    thaiTitle: 'เสียงเอฟเฟกต์ ระเบิดมหาประลัยสะเทือนแผ่นดิน (Sub-Bass)',
    category: 'audio',
    categoryLabel: '🎵 AUDIO & SFX',
    badge: '0MS DSP SOUND',
    iconName: 'Volume2',
    color: '#f85149',
    description: '40Hz Sub-bass shockwave combined with high-frequency debris scatter and acoustic echo.',
    thaiDescription: 'เสียงคลื่นกระแทกระเบิด 40Hz พร้อมสะเก็ดดินหินกระจายและเสียงสะท้อนก้องกังวาน',
    pathOrShortcut: 'gameAudioEngine.playSound("explosion_huge")',
    targetToolId: 'OfflineGameAudioStudio',
    actionType: 'play_sound',
    tags: ['audio', 'sfx', 'sound', 'explosion', 'blast', 'bomb', 'subbass', 'เสียง', 'เสียงระเบิด', 'ระเบิด', 'เอฟเฟกต์'],
    metadata: { soundPresetId: 'explosion_huge', linkedTools: ['OfflineGameAudioStudio', 'SpatialAudioFoley'] }
  },
  {
    id: 'audio_forest_wind_ambient',
    title: 'AMB_Forest_Wind_Canopy.dsp',
    thaiTitle: 'เสียงบรรยากาศ ลมพัดใบไม้เสียดสีในป่าทึบ (Ambient Loop)',
    category: 'audio',
    categoryLabel: '🎵 AUDIO & SFX',
    badge: '0MS DSP SOUND',
    iconName: 'Volume2',
    color: '#38bdf8',
    description: 'Multi-band filtered noise synthesis mimicking continuous autumn wind whistling through tree foliage.',
    thaiDescription: 'เสียงลมพัดผ่านพุ่มไม้และยอดไม้อย่างต่อเนื่อง สังเคราะห์สดแบบสมจริง',
    pathOrShortcut: 'gameAudioEngine.playSound("forest_wind_ambient")',
    targetToolId: 'OfflineGameAudioStudio',
    actionType: 'play_sound',
    tags: ['audio', 'sfx', 'ambient', 'forest', 'wind', 'nature', 'loop', 'เสียง', 'เสียงลม', 'เสียงป่า', 'บรรยากาศ'],
    metadata: { soundPresetId: 'forest_wind_ambient', linkedTools: ['OfflineGameAudioStudio', 'SpatialAudioMixer'] }
  },
  {
    id: 'audio_lightning_bolt_dsp',
    title: 'SFX_Thunder_Lightning_Strike.dsp',
    thaiTitle: 'เสียงเอฟเฟกต์ สายฟ้าฟาดและฟ้าร้องกึกก้อง (Thunder)',
    category: 'audio',
    categoryLabel: '🎵 AUDIO & SFX',
    badge: '0MS DSP SOUND',
    iconName: 'Volume2',
    color: '#bc8cff',
    description: 'High-voltage electric arc crackle with descending sub-rumble thunder resonance.',
    thaiDescription: 'เสียงไฟฟ้าช็อตแรงสูงผสานคลื่นเสียงฟ้าร้องสะท้านปฐพี',
    pathOrShortcut: 'gameAudioEngine.playSound("lightning_bolt")',
    targetToolId: 'OfflineGameAudioStudio',
    actionType: 'play_sound',
    tags: ['audio', 'sfx', 'sound', 'lightning', 'thunder', 'electric', 'spell', 'เสียง', 'เสียงสายฟ้า', 'ฟ้าร้อง', 'ฟ้าผ่า'],
    metadata: { soundPresetId: 'lightning_bolt', linkedTools: ['OfflineGameAudioStudio'] }
  },
  {
    id: 'audio_heal_sparkle_dsp',
    title: 'SFX_Divine_Heal_Blessing.dsp',
    thaiTitle: 'เสียงเอฟเฟกต์ แสงประกายฮีลและพรจากสวรรค์ (Holy Buff)',
    category: 'audio',
    categoryLabel: '🎵 AUDIO & SFX',
    badge: '0MS DSP SOUND',
    iconName: 'Volume2',
    color: '#39d353',
    description: 'Shimmering sine-wave arpeggio chime representing rejuvenation and health recovery.',
    thaiDescription: 'เสียงกระดิ่งเวทมนตร์ฮีลประกายระยิบระยับ เพิ่มพลังชีวิตและบัฟสถานะ',
    pathOrShortcut: 'gameAudioEngine.playSound("heal_sparkle")',
    targetToolId: 'OfflineGameAudioStudio',
    actionType: 'play_sound',
    tags: ['audio', 'sfx', 'heal', 'holy', 'buff', 'sparkle', 'magic', 'เสียง', 'เสียงฮีล', 'รักษา', 'บัฟ'],
    metadata: { soundPresetId: 'heal_sparkle', linkedTools: ['OfflineGameAudioStudio'] }
  },

  // Quick Engine Commands & Actions
  {
    id: 'action_playtest_f5',
    title: 'Playtest Game (F5)',
    thaiTitle: 'เริ่มเล่นและทดสอบเกมแบบ Standalone / Viewport',
    category: 'action',
    categoryLabel: '⚡ ENGINE ACTIONS',
    badge: 'EXECUTE',
    iconName: 'Play',
    color: '#39d353',
    description: 'Instant zero-lag local game simulation startup with live script hot-reloading.',
    thaiDescription: 'รันเกมทดสอบทันทีพร้อมระบบ Hot-Reload สคริปต์แบบเรียลไทม์',
    pathOrShortcut: 'F5',
    targetToolId: 'QuickStart',
    actionType: 'execute_command',
    tags: ['action', 'play', 'run', 'test', 'game', 'f5', 'เล่น', 'ทดสอบ', 'รันเกม'],
    metadata: { commandAction: () => console.log('Starting Playtest...') }
  },
  {
    id: 'action_build_export',
    title: 'Build & Package Project for Production',
    thaiTitle: 'บิ้วด์และส่งออกเกมไปยังแพลตฟอร์มต่างๆ (PC, Console, WebGL, Mobile)',
    category: 'action',
    categoryLabel: '⚡ ENGINE ACTIONS',
    badge: 'BUILD',
    iconName: 'Zap',
    color: '#58a6ff',
    description: 'Cross-platform compiler bundling shaders, compressed textures, and standalone executable binary.',
    thaiDescription: 'คอมไพล์และแพ็กเกจเกมสำหรับ Windows, Mac, Linux, iOS, Android และ WebGL',
    pathOrShortcut: 'Ctrl+Shift+B',
    targetToolId: 'BuildPublish',
    actionType: 'jump_tool',
    tags: ['action', 'build', 'export', 'package', 'publish', 'release', 'บิ้วด์', 'ส่งออก', 'คอมไพล์'],
    metadata: { linkedTools: ['BuildPublish', 'CrossPlatformBuildTargeter'] }
  },
  {
    id: 'action_ai_copilot',
    title: 'Summon Offline AI Engine Copilot',
    thaiTitle: 'เปิดผู้ช่วยเขียนโค้ดและสร้างเกม AI ออฟไลน์ (AI Copilot)',
    category: 'action',
    categoryLabel: '⚡ ENGINE ACTIONS',
    badge: 'AI COPILOT',
    iconName: 'Bot',
    color: '#bc8cff',
    description: 'On-device local LLM assistant to answer engine questions, generate scripts, and navigate tools.',
    thaiDescription: 'เปิดหน้าต่าง AI ผู้ช่วยออฟไลน์ ช่วยเขียนโค้ด ให้คำปรึกษา และค้นหาเครื่องมือ',
    pathOrShortcut: 'Ctrl+Shift+A',
    targetToolId: 'OmniAIAssistantStudio',
    actionType: 'jump_tool',
    tags: ['action', 'ai', 'copilot', 'assistant', 'chat', 'llm', 'เอไอ', 'ผู้ช่วย', 'แชท'],
    metadata: { linkedTools: ['OmniAIAssistantStudio', 'OfflineAICodingAssistant'] }
  },
  {
    id: 'action_bake_lighting',
    title: 'Bake Global Illumination & Lightmaps',
    thaiTitle: 'อบแสงเงา Global Illumination และ Lightmaps ความละเอียดสูง',
    category: 'action',
    categoryLabel: '⚡ ENGINE ACTIONS',
    badge: 'RENDER',
    iconName: 'Sun',
    color: '#ffc107',
    description: 'GPU-accelerated radiosity lightmap solver with ambient occlusion denoiser.',
    thaiDescription: 'คำนวณแสงตกกระทบและเงาแบบสมจริงด้วย GPU Radiosity Solver',
    pathOrShortcut: 'Ctrl+Alt+L',
    targetToolId: 'LightmapBakerStudio',
    actionType: 'jump_tool',
    tags: ['action', 'light', 'bake', 'render', 'gi', 'lightmap', 'แสง', 'อบแสง', 'เรนเดอร์'],
    metadata: { linkedTools: ['LightmapBakerStudio', 'RaytracingConfigurator'] }
  },
  {
    id: 'action_bake_navmesh',
    title: 'Bake AI Navigation Mesh (NavMesh)',
    thaiTitle: 'คำนวณและอบเส้นทางเดิน AI NavMesh สำหรับศัตรูและ NPC',
    category: 'action',
    categoryLabel: '⚡ ENGINE ACTIONS',
    badge: 'AI NAV',
    iconName: 'Waypoints',
    color: '#38bdf8',
    description: 'Voxelized Recast & Detour NavMesh generator with dynamic agent radius and obstacle avoidance.',
    thaiDescription: 'สร้างทางเดิน 3 มิติสำหรับ AI ศัตรู หลบหลีกสิ่งกีดขวางและปีนป่าย',
    pathOrShortcut: 'Ctrl+Alt+N',
    targetToolId: 'NavMeshBakingStudio',
    actionType: 'jump_tool',
    tags: ['action', 'navmesh', 'ai', 'pathfinding', 'navigation', 'เส้นทาง', 'เนฟเมช', 'การเดิน'],
    metadata: { linkedTools: ['NavMeshBakingStudio', 'PathfindingDebugger'] }
  }
];

/**
 * Converts all 150+ Navigation Targets from `aiOfflineNavigator` into Searchable Items
 */
function getNavTargetsAsSearchResults(): Omit<SemanticSearchResult, 'score'>[] {
  return ALL_NAV_TARGETS.map(target => ({
    id: `tool_${target.id}`,
    title: target.title,
    thaiTitle: target.thaiTitle,
    category: 'tool',
    categoryLabel: target.hubCategory || '🛠️ ENGINE TOOL',
    badge: target.badge || 'TOOL',
    iconName: target.iconName || 'Wrench',
    color: target.activeColor || '#58a6ff',
    description: target.description,
    thaiDescription: target.thaiDescription,
    pathOrShortcut: target.shortcutHint || `ID: ${target.id}`,
    targetToolId: target.id,
    actionType: 'jump_tool',
    tags: [
      target.id.toLowerCase(),
      target.title.toLowerCase(),
      target.hubCategory.toLowerCase(),
      ...(target.thaiTitle ? [target.thaiTitle.toLowerCase()] : []),
      ...target.keywords.map(k => k.toLowerCase()),
      'tool',
      'editor',
      'studio',
      'เครื่องมือ',
      'ระบบ'
    ],
    metadata: {
      linkedTools: [target.id]
    }
  }));
}

// Master Index combining all tools, assets, project files, code, and audio
let cachedMasterIndex: Omit<SemanticSearchResult, 'score'>[] | null = null;

export function getFullEngineIndex(): Omit<SemanticSearchResult, 'score'>[] {
  if (cachedMasterIndex) return cachedMasterIndex;
  const toolResults = getNavTargetsAsSearchResults();
  cachedMasterIndex = [...toolResults, ...BUILTIN_ASSETS];
  return cachedMasterIndex;
}

/**
 * Calculate string similarity using Levenshtein distance normalized to [0, 1]
 */
function calculateLevenshteinSimilarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;

  // Simple edit distance
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return (longerLength - costs[s2.length]) / longerLength;
}

/**
 * Core Semantic Search Query Engine
 * Performs multi-field scoring with semantic synonym expansion, fuzzy matching, and category filtering.
 */
export function searchFullEngine(
  query: string,
  categoryFilter: SearchCategory = 'all',
  limit: number = 30
): SemanticSearchResult[] {
  const masterIndex = getFullEngineIndex();
  const trimmed = query.trim().toLowerCase();

  // If query is empty, return popular/top items by category
  if (!trimmed) {
    let filtered = masterIndex;
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    return filtered.slice(0, limit).map(item => ({ ...item, score: 1.0 }));
  }

  // Tokenize query
  const queryTokens = trimmed.split(/[\s,+/\\_-]+/).filter(t => t.length > 0);

  // Expand query tokens with semantic synonyms
  const expandedTokens = new Set<string>(queryTokens);
  for (const token of queryTokens) {
    for (const [key, synonyms] of Object.entries(SEMANTIC_SYNONYMS)) {
      if (token === key || synonyms.includes(token)) {
        expandedTokens.add(key);
        synonyms.forEach(syn => expandedTokens.add(syn));
      }
    }
  }

  const results: SemanticSearchResult[] = [];

  for (const item of masterIndex) {
    // Check Category Filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      continue;
    }

    let score = 0;
    const titleLower = item.title.toLowerCase();
    const thaiTitleLower = (item.thaiTitle || '').toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    const thaiDescLower = (item.thaiDescription || '').toLowerCase();
    const tagsCombined = item.tags.join(' ').toLowerCase();

    // 1. Exact Match on Title or ID (Highest Priority: +150 pts)
    if (titleLower === trimmed || item.id.toLowerCase() === trimmed || thaiTitleLower === trimmed) {
      score += 150;
    }

    // 2. Title Starts With query (+80 pts)
    if (titleLower.startsWith(trimmed) || thaiTitleLower.startsWith(trimmed)) {
      score += 80;
    }

    // 3. Substring Contains Full Query in Title (+60 pts)
    if (titleLower.includes(trimmed) || thaiTitleLower.includes(trimmed)) {
      score += 60;
    }

    // 4. Substring Contains in Description (+30 pts)
    if (descLower.includes(trimmed) || thaiDescLower.includes(trimmed)) {
      score += 30;
    }

    // 5. Individual Token & Semantic Synonym Matches
    let matchedTokenCount = 0;
    for (const token of Array.from(expandedTokens)) {
      let tokenMatched = false;

      if (titleLower.includes(token) || thaiTitleLower.includes(token)) {
        score += 25;
        tokenMatched = true;
      } else if (item.tags.some(tag => tag === token || tag.includes(token))) {
        score += 18;
        tokenMatched = true;
      } else if (descLower.includes(token) || thaiDescLower.includes(token)) {
        score += 10;
        tokenMatched = true;
      }

      if (tokenMatched) matchedTokenCount++;
    }

    // 6. Fuzzy Match (Typo Tolerance) on Title
    if (score === 0 && trimmed.length >= 3) {
      const fuzzyScore = calculateLevenshteinSimilarity(trimmed, titleLower);
      if (fuzzyScore > 0.6) {
        score += fuzzyScore * 35;
      }
    }

    // Boost if query matched multiple search terms
    if (matchedTokenCount > 1) {
      score += matchedTokenCount * 12;
    }

    // Boost items matching exact user intent words (like "sound", "map", "code")
    if (queryTokens.some(t => item.tags.includes(t))) {
      score += 15;
    }

    if (score > 0) {
      results.push({
        ...item,
        score
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}

/**
 * Execute search item action (Jump to tool, open file, play sound, run command)
 */
export function executeSearchResultAction(
  result: SemanticSearchResult,
  onSwitchTool?: (toolId: string) => void
) {
  // 1. Play feedback haptic sound
  try {
    if (result.actionType === 'play_sound' && result.metadata?.soundPresetId) {
      gameAudioEngine.playSound(result.metadata.soundPresetId);
    } else {
      gameAudioEngine.playSound('ui_click_chime');
    }
  } catch (e) {}

  // 2. Handle Action Types
  if (result.actionType === 'execute_command' && result.metadata?.commandAction) {
    result.metadata.commandAction();
  }

  if (result.targetToolId) {
    if (onSwitchTool) {
      onSwitchTool(result.targetToolId);
    }
    // Also dispatch global event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('switch-tool', { detail: result.targetToolId }));
      localStorage.setItem('omni_activeTool', result.targetToolId);
    }
  }

  // Save to recent searches
  saveRecentSearch(result);
}

// Recent Searches LocalStorage Manager
const RECENT_SEARCHES_KEY = 'omni_semantic_recent_searches';

export function getRecentSearches(): SemanticSearchResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveRecentSearch(item: SemanticSearchResult) {
  if (typeof window === 'undefined') return;
  try {
    const recents = getRecentSearches().filter(r => r.id !== item.id);
    recents.unshift({ ...item, score: 999 });
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recents.slice(0, 10)));
  } catch (e) {}
}

export function clearRecentSearches() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (e) {}
}
