/**
 * Ultra-Comprehensive Offline AI Navigation & Auto-Routing Engine
 * Supports natural language parsing, fuzzy matching, phonetic synonyms in Thai & English,
 * and smart multi-suggestion routing for all 150+ tools in the Omni Mega Engine.
 */

export interface NavTarget {
  id: string;
  title: string;
  thaiTitle: string;
  hubId: string;
  hubCategory: string;
  activeColor: string;
  description: string;
  thaiDescription: string;
  keywords: string[];
  iconName: string;
  badge?: string;
  shortcutHint?: string;
}

export interface NavMatchResult {
  isNavIntent: boolean;
  intentVerb?: string;
  cleanedQuery: string;
  bestTarget: NavTarget | null;
  confidence: number; // 0 to 1
  suggestions: NavTarget[];
  routeReason: string;
  thaiRouteReason: string;
}

// Full registry of Engine Subsystems & Tools
export const ALL_NAV_TARGETS: NavTarget[] = [
  // 1. 🌍 WORLD & MAPS
  {
    id: "MapEdit",
    title: "Map & Level Editor",
    thaiTitle: "เครื่องมือสร้างและแก้ไขแผนที่ / เลเวล",
    hubId: "WorldHub",
    hubCategory: "🌍 WORLD BUILDING",
    activeColor: "#58a6ff",
    description: "Multi-layered 3D level editor, terrain sculpting, entity placement, and biome tools.",
    thaiDescription: "ระบบจัดวางฉาก 3 มิติ ปรับแต่งภูมิประเทศ วางเอนทิตี และเครื่องมือไบโอมครบวงจร",
    keywords: ["map", "map edit", "level", "level edit", "mapeditor", "แผนที่", "แผ่นที่", "เลเวล", "ฉาก", "สร้างแผนที่", "แก้ไขแผนที่", "หน้าแผนที่", "หน้า map", "world", "landscape", "terrain", "แมพ"],
    iconName: "Map",
    badge: "CORE EDITOR",
    shortcutHint: "Ctrl+Shift+M"
  },
  {
    id: "OmniWorldBuilder",
    title: "MegaWorld Builder",
    thaiTitle: "สร้างโลกขนาดใหญ่และสภาพแวดล้อม",
    hubId: "WorldHub",
    hubCategory: "🌍 WORLD BUILDING",
    activeColor: "#58a6ff",
    description: "Endless procedural world generation with streaming LODs and dynamic biomes.",
    thaiDescription: "ระบบสร้างโลกโอเพ่นเวิลด์ขนาดใหญ่ โหลดฉากแบบสตรีมมิ่ง และสภาพแวดล้อมไดนามิก",
    keywords: ["world builder", "megaworld", "omniworld", "สร้างโลก", "โลก", "โอเพ่นเวิลด์", "open world", "biome", "สภาพแวดล้อม", "จักรวาล"],
    iconName: "Globe",
    badge: "WORLD ENGINE"
  },
  {
    id: "MapMegaToolsExtension",
    title: "300x Map & Level Tools",
    thaiTitle: "ชุดเครื่องมือสร้างแผนที่ 300+",
    hubId: "WorldHub",
    hubCategory: "🌍 WORLD BUILDING",
    activeColor: "#58a6ff",
    description: "Expanded suite with 300+ map utilities including roads, rivers, foliage, and lighting.",
    thaiDescription: "รวมเครื่องมือขยายพิเศษกว่า 300 รายการสำหรับสร้างถนน แม่น้ำ ป่าไม้ และอาคาร",
    keywords: ["map tools", "map extension", "mega map", "300 map", "เครื่องมือแผนที่", "ต่อเติมแผนที่", "สร้างถนน", "แม่น้ำ", "ป่าไม้"],
    iconName: "Mountain",
    badge: "EXTENSIONS"
  },
  {
    id: "TerrainEditor",
    title: "Terrain Editor & Sculpting",
    thaiTitle: "แก้ไขภูมิประเทศและความชัน",
    hubId: "WorldHub",
    hubCategory: "🌍 WORLD BUILDING",
    activeColor: "#58a6ff",
    description: "Sculpt mountains, valleys, procedural erosion, and blend texture layers.",
    thaiDescription: "ปั้นภูเขา หุบเขา กัดเซาะภูมิประเทศ และเบลนด์เลเยอร์พื้นผิว",
    keywords: ["terrain", "terrain edit", "sculpt terrain", "ภูมิประเทศ", "ภูเขา", "หุบเขา", "ความชัน", "ดิน", "erosion"],
    iconName: "Mountain"
  },
  {
    id: "AdvancedPCGEngine",
    title: "Procedural City & Terrain PCG",
    thaiTitle: "สร้างเมืองและภูมิประเทศอัตโนมัติ (PCG)",
    hubId: "WorldHub",
    hubCategory: "🌍 WORLD BUILDING",
    activeColor: "#58a6ff",
    description: "Procedural Content Generation graph for automatic cityscapes, road grids, and vegetation.",
    thaiDescription: "สร้างเมือง ตึกรามบ้านช่อง โครงข่ายถนน และป่าไม้อัตโนมัติด้วย Procedural Graph",
    keywords: ["pcg", "procedural", "city generator", "สร้างเมือง", "เมือง", "ตึก", "อัตโนมัติ", "procedural city"],
    iconName: "Mountain",
    badge: "PCG GRAPH"
  },
  {
    id: "WeatherAtmosphereEditor",
    title: "Weather & Atmosphere Editor",
    thaiTitle: "ระบบสภาพอากาศ ท้องฟ้า และฝนฟ้าคะนอง",
    hubId: "WorldHub",
    hubCategory: "🌍 WORLD BUILDING",
    activeColor: "#58a6ff",
    description: "Simulate volumetric clouds, dynamic day/night cycles, rain, snow, and wind gusts.",
    thaiDescription: "จำลองเมฆ 3 มิติ วัฏจักรกลางวัน/กลางคืน ฝนตก หิมะ และลมพายุ",
    keywords: ["weather", "sky", "atmosphere", "rain", "snow", "cloud", "สภาพอากาศ", "อากาศ", "ฝน", "หิมะ", "ท้องฟ้า", "เมฆ", "กลางคืน", "กลางวัน", "พายุ"],
    iconName: "CloudRain"
  },
  {
    id: "NavMeshBakingStudio",
    title: "NavMesh Baker & Pathfinding",
    thaiTitle: "อบเส้นทาง AI และคำนวณการเดิน (NavMesh)",
    hubId: "WorldHub",
    hubCategory: "🌍 WORLD BUILDING",
    activeColor: "#58a6ff",
    description: "Bake AI navigation meshes, test dynamic obstacles, and optimize A* pathfinding.",
    thaiDescription: "อบเนฟเมชสำหรับ AI ตรวจสอบสิ่งกีดขวาง และคำนวณเส้นทางเดินแบบ A*",
    keywords: ["navmesh", "navigation mesh", "pathfinding", "อบเส้นทาง", "ทางเดิน ai", "เส้นทาง", "หาทางเดิน", "การเคลื่อนที่"],
    iconName: "Route"
  },
  {
    id: "ProceduralDungeonGenerator",
    title: "Procedural Dungeon Generator",
    thaiTitle: "สร้างดันเจี้ยนและเขาวงกตอัตโนมัติ",
    hubId: "WorldHub",
    hubCategory: "🌍 WORLD BUILDING",
    activeColor: "#58a6ff",
    description: "Generate infinite roguelike dungeon maps, room links, secret doors, and loot spawners.",
    thaiDescription: "สร้างแผนที่ดันเจี้ยน เขาวงกตรูปแบบสุ่ม ห้องลับ และจุดเกิดมอนสเตอร์",
    keywords: ["dungeon", "maze", "roguelike", "ดันเจี้ยน", "เขาวงกต", "ถ้ำ", "ห้องลับ", "สุ่มห้อง"],
    iconName: "Box"
  },

  // 2. 🧊 3D MODELING & ART
  {
    id: "Modeling",
    title: "3D Modeling Studio",
    thaiTitle: "สตูดิโอสร้างและแก้ไขโมเดล 3D (Mesh Editor)",
    hubId: "ArtStudioHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#e3b341",
    description: "Polygon modeling, vertex manipulation, beveling, extrusions, and primitive mesh builders.",
    thaiDescription: "สร้างโมเดล 3D ปรับแต่งจุด/เส้น/โพลีกอน ดึงหน้า Extrude และขึ้นรูปวัตถุ",
    keywords: ["model", "modeling", "3d model", "mesh", "mesh edit", "โมเดล", "โมเดล 3d", "โมเดล edit", "เมช", "ขึ้นรูป 3d", "วัตถุ 3d", "3d", "polygon", "โพลีกอน", "หน้าโมเดล"],
    iconName: "Box",
    badge: "CORE EDITOR",
    shortcutHint: "Ctrl+Shift+3"
  },
  {
    id: "Mega3DModelStudio",
    title: "500x 3D Modeling Tools",
    thaiTitle: "ชุดเครื่องมือ 3D โมเดลลิ่ง 500x",
    hubId: "ArtStudioHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#e3b341",
    description: "High-density CAD and subdivision surface modeling toolchain with 500+ geometric modifiers.",
    thaiDescription: "ชุดเครื่องมือโมเดลลิ่งระดับสูงพร้อม Modifier กว่า 500 รายการสำหรับงาน AAA",
    keywords: ["mega model", "3d tools", "subdivision", "cad 3d", "โมเดล 500", "เครื่องมือโมเดล"],
    iconName: "Box",
    badge: "500X STUDIO"
  },
  {
    id: "Offline3DModeler",
    title: "Offline 3D Modeler",
    thaiTitle: "สร้างโมเดล 3D ออฟไลน์",
    hubId: "ArtStudioHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#e3b341",
    description: "Lightweight zero-dependency client-side mesh creator and procedural primitive studio.",
    thaiDescription: "เครื่องมือสร้างเมชแบบไม่ต้องใช้อินเทอร์เน็ต รันบนเครื่องทันที",
    keywords: ["offline 3d", "offline model", "โมเดลออฟไลน์", "สร้าง 3d ออฟไลน์"],
    iconName: "Box"
  },
  {
    id: "ZBrushStyleSculptingStudio",
    title: "ZBrush Style Sculpting Studio",
    thaiTitle: "สตูดิโอปั้นโมเดลสไตล์ ZBrush (Sculpting)",
    hubId: "ArtStudioHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#e3b341",
    description: "Organic digital sculpting with dynamic tessellation, clay brushes, crease, and pinch tools.",
    thaiDescription: "ปั้นดินเหนียวดิจิทัล แปรง Clay, Crease, Smooth สำหรับปั้นสิ่งมีชีวิตและใบหน้า",
    keywords: ["sculpt", "sculpting", "zbrush", "ปั้น", "ปั้นโมเดล", "แกะสลัก", "ดินเหนียว", "สคัลป์"],
    iconName: "Palette",
    badge: "SCULPT"
  },
  {
    id: "PhotogrammetryMeshBuilder",
    title: "Photogrammetry 3D Scanner",
    thaiTitle: "สแกนภาพถ่ายเป็นโมเดล 3D (Photogrammetry)",
    hubId: "ArtStudioHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#e3b341",
    description: "Turn multi-angle 2D photos into high-resolution textured 3D meshes with depth reconstruction.",
    thaiDescription: "แปลงรูปภาพหลายมุมมองให้กลายเป็นโมเดล 3 มิติพร้อมเท็กเจอร์สมจริง",
    keywords: ["photogrammetry", "3d scan", "scanner", "สแกน 3d", "ภาพถ่ายเป็น 3d", "สแกนโมเดล", "สร้างโมเดลจากรูป"],
    iconName: "Camera"
  },
  {
    id: "RealTimeHouse3DPrintStudio",
    title: "3D House CAD & Print Slicer",
    thaiTitle: "ออกแบบบ้าน 3D และเครื่องมือพิมพ์ 3D",
    hubId: "ArtStudioHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#e3b341",
    description: "Architectural floor planning, wall extrusion, CAD measurement, and G-Code 3D print slicing.",
    thaiDescription: "เขียนแบบแปลนบ้าน ผนัง เสา คำนวณขนาด และสไลซ์ไฟล์พิมพ์ 3D สู่ G-Code",
    keywords: ["house", "cad", "floor plan", "3d print", "slicer", "บ้าน", "แปลนบ้าน", "สถาปัตยกรรม", "พิมพ์ 3d", "ปริ้น 3d"],
    iconName: "Home"
  },
  {
    id: "ElectronicCircuitPCBStudio",
    title: "PCB & Electronic Circuit Studio",
    thaiTitle: "ออกแบบแผงวงจร PCB และวงจรอิเล็กทรอนิกส์",
    hubId: "ArtStudioHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#e3b341",
    description: "Schematic design, trace routing, component footprints, and Gerber manufacturing exports.",
    thaiDescription: "วาดวงจร เดินลายทองแดง วางอุปกรณ์อิเล็กทรอนิกส์ และส่งออกไฟล์ Gerber",
    keywords: ["pcb", "circuit", "electronic", "schematic", "วงจร", "แผงวงจร", "อิเล็กทรอนิกส์", "ฮาร์ดแวร์วงจร", "บอร์ด"],
    iconName: "CircuitBoard"
  },
  {
    id: "ModelOptimizer",
    title: "Model & Mesh Optimizer",
    thaiTitle: "ลดโพลีกอนและออปติไมซ์โมเดล (LOD Manager)",
    hubId: "ArtStudioHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#e3b341",
    description: "Automatic polygon reduction, LOD generation, draw-call batching, and vertex cache optimization.",
    thaiDescription: "ลดจำนวน Face/Vertex สร้างระดับ LOD อัตโนมัติ เพื่อให้เกมลื่นไหล",
    keywords: ["optimize model", "lod", "decimate", "reduce polygon", "ลดโพลี", "ลดโพลีกอน", "ออปติไมซ์โมเดล"],
    iconName: "Minimize"
  },
  {
    id: "AIAssetAutoTagOrganizer",
    title: "AI Model & Texture Auto-Tagger",
    thaiTitle: "AI จัดหมวดหมู่และแท็กโมเดลอัตโนมัติ",
    hubId: "ArtStudioHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#e3b341",
    description: "AI vision classification that scans 3D models and textures to auto-tag categories and metadata.",
    thaiDescription: "ใช้ AI สแกนโมเดลและเท็กเจอร์เพื่อใส่แท็ก ค้นหา และจัดระเบียบสินทรัพย์อัตโนมัติ",
    keywords: ["auto tag", "asset tag", "tagger", "จัดระเบียบ", "แท็กโมเดล", "ai tag"],
    iconName: "FolderTree"
  },
  {
    id: "AssetDependencyGraphStudio",
    title: "Asset Dependency Graph (Force Topology)",
    thaiTitle: "แผนผังโครงข่ายความสัมพันธ์สินทรัพย์และเท็กเจอร์ (Force Graph)",
    hubId: "ArtStudioHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#e3b341",
    description: "Interactive D3 force-directed graph visualizer mapping relationships between 3D models, PBR textures, materials, and shaders.",
    thaiDescription: "ระบบแสดงโครงข่ายความเชื่อมโยงของโมเดล 3D แมทีเรียล และเท็กเจอร์ PBR ด้วย Force-directed Graph พร้อมตรวจจับสินทรัพย์ตกค้าง",
    keywords: ["asset dependency", "asset graph", "force directed", "texture dependency", "model dependency", "ความสัมพันธ์สินทรัพย์", "แผนผังสินทรัพย์", "ความเชื่อมโยง", "กราฟโมเดล", "asset topology", "orphan assets"],
    iconName: "Network",
    badge: "TOPOLOGY"
  },

  // 3. ⚙️ SETTINGS & CONFIGURATION
  {
    id: "ProjectSettingsEditor",
    title: "Project Settings Editor",
    thaiTitle: "ตั้งค่าโปรเจกต์และระบบเอนจิน (Settings)",
    hubId: "DevOpsHub",
    hubCategory: "⚙️ DEVOPS",
    activeColor: "#f85149",
    description: "Manage global game settings, graphics fidelity, audio limits, physics ticks, and platform targets.",
    thaiDescription: "ปรับแต่งการตั้งค่าหลักของโปรเจกต์ กราฟิก เสียง ความถี่ฟิสิกส์ และแพลตฟอร์มปลายทาง",
    keywords: ["settings", "project settings", "config", "preferences", "ตั้งค่า", "การตั้งค่า", "เซ็ตติ้ง", "ตั้งค่าโปรเจกต์", "ตั้งค่าระบบ", "ปรับแต่ง", "หน้าตั้งค่า", "options", "ออปชั่น"],
    iconName: "Sliders",
    badge: "SYSTEM SETTINGS",
    shortcutHint: "Ctrl+,"
  },
  {
    id: "KeyboardShortcutMapper",
    title: "Keyboard Shortcut Mapper",
    thaiTitle: "ตั้งค่าคีย์ลัดและฮอตคีย์ (Keybindings)",
    hubId: "DevOpsHub",
    hubCategory: "⚙️ DEVOPS",
    activeColor: "#f85149",
    description: "Customize keybinds, chord macros, and editor navigation shortcuts for maximum developer speed.",
    thaiDescription: "ปรับแต่งปุ่มคีย์ลัด ฮอตคีย์ และปุ่มมาโครสำหรับควบคุมเอนจินอย่างรวดเร็ว",
    keywords: ["shortcut", "keyboard", "hotkey", "keybind", "คีย์ลัด", "ปุ่มลัด", "ฮอตคีย์", "ตั้งค่าปุ่ม", "shortcut mapper"],
    iconName: "Command",
    badge: "HOTKEYS"
  },
  {
    id: "HardwareConfig",
    title: "Hardware & Device Config",
    thaiTitle: "ตั้งค่าและตรวจสอบฮาร์ดแวร์ / GPU",
    hubId: "DevOpsHub",
    hubCategory: "⚙️ DEVOPS",
    activeColor: "#f85149",
    description: "Configure GPU compute device, VRAM allocation, CPU thread affinity, and Vulkan/DX12 switches.",
    thaiDescription: "เลือกการ์ดจอ กำหนดขนาด VRAM จัดสรรเธรด CPU และเลือก Driver กราฟิก",
    keywords: ["hardware", "gpu config", "cpu config", "vram", "ฮาร์ดแวร์", "การ์ดจอ", "อุปกรณ์"],
    iconName: "Cpu"
  },
  {
    id: "InputMappingEditor",
    title: "Input Mapping & Controller Setup",
    thaiTitle: "ตั้งค่าปุ่มควบคุมและจอยสติ๊ก (Game Input)",
    hubId: "GameDesignHub",
    hubCategory: "🎮 GAME DESIGN",
    activeColor: "#58a6ff",
    description: "Map game actions to keyboard, mouse, Xbox/DualSense controllers, gyro, and touchscreen sticks.",
    thaiDescription: "ผูกปุ่มคีย์บอร์ด เมาส์ จอยเกม Xbox/PlayStation ไจโรสโคป และหน้าจอสัมผัส",
    keywords: ["input", "gamepad", "controller", "joystick", "mapping", "จอย", "จอยสติ๊ก", "ปุ่มควบคุม", "ตั้งค่าจอย"],
    iconName: "Gamepad2"
  },

  // 4. 🤖 CODE, SCRIPTING & IDE
  {
    id: "Select",
    title: "Text Code Editor",
    thaiTitle: "โปรแกรมเขียนโค้ดและสคริปต์ (Code IDE)",
    hubId: "CodeIDEHub",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#ff7b72",
    description: "Full-fledged code IDE supporting C++, C#, TypeScript, Python, GLSL, and Lua with syntax highlighting.",
    thaiDescription: "โปรแกรมเขียนโค้ดรองรับภาษา C++, C#, TypeScript, Python, GLSL พร้อมระบบเน้นไวยากรณ์",
    keywords: ["code", "code editor", "script", "scripting", "ide", "c++", "c#", "typescript", "python", "โค้ด", "เขียนโค้ด", "สคริปต์", "โปรแกรม", "หน้าโค้ด", "หน้า ide", "text editor"],
    iconName: "Code2",
    badge: "CORE IDE",
    shortcutHint: "Ctrl+Shift+E"
  },
  {
    id: "MegaCodeIDEMaster",
    title: "100x Code & AST Tools",
    thaiTitle: "สุดยอด IDE และระบบวิเคราะห์ Abstract Syntax Tree",
    hubId: "CodeIDEHub",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#ff7b72",
    description: "Deep AST refactoring, multi-file symbol indexing, memory analyzer, and compiler integration.",
    thaiDescription: "ระบบจัดโครงสร้างโค้ดระดับลึก ค้นหาสัญลักษณ์ข้ามไฟล์ และตัวเชื่อมต่อคอมไพเลอร์",
    keywords: ["mega code", "ast", "refactor", "ide master", "100 code", "วิเคราะห์โค้ด"],
    iconName: "Code2",
    badge: "100X IDE"
  },
  {
    id: "VisualScripting",
    title: "Visual Script Editor",
    thaiTitle: "เขียนโค้ดแบบภาพ (Node-Based Visual Scripting)",
    hubId: "CodeIDEHub",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#ff7b72",
    description: "Node-based visual gameplay scripting without writing code, with real-time execution flow.",
    thaiDescription: "ต่อโหนดตรรกะเกมโดยไม่ต้องเขียนโค้ด พร้อมแสดงเส้นทางการรันข้อมูลแบบเรียลไทม์",
    keywords: ["visual script", "visual scripting", "node script", "blueprint", "สคริปต์ภาพ", "ต่อโหนด", "เขียนโค้ดแบบภาพ", "visual node"],
    iconName: "Network",
    badge: "NODE GRAPH"
  },
  {
    id: "OfflineAICodingAssistant",
    title: "Offline AI Modular Architect & Coding Copilot",
    thaiTitle: "AI สถาปัตยกรรมเกมโมดูลาร์และผู้ช่วยเขียนโค้ดออฟไลน์ (1 Node/Module = 1 File)",
    hubId: "CodeIDEHub",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#ff7b72",
    description: "On-device AI architect & copilot enforcing strict 1 Node / 1 Module = 1 File modularity, system-specific naming, and exhaustive in-file documentation.",
    thaiDescription: "AI ช่วยออกแบบสถาปัตยกรรมเกมและเขียนโค้ดออฟไลน์ 100% บังคับใช้กฎ 1 โหนด 1 โมดูล = 1 ไฟล์เดี่ยว ตั้งชื่อตรงระบบ และเขียนคำอธิบายละเอียดยิบในทุกไฟล์",
    keywords: [
      "ai code", "ai coding", "ai assistant", "offline ai code", "ai โค้ด", "ai ช่วยเขียนโค้ด", "ผู้ช่วยโค้ด",
      "แยกไฟล์", "โมดูลาร์", "modular", "1 node 1 file", "1 module 1 file", "สถาปัตยกรรม", "เขียนเกมแยกไฟล์", "โหนดละไฟล์"
    ],
    iconName: "Bot",
    badge: "1 NODE = 1 FILE"
  },
  {
    id: "ArchitectureHeatmap",
    title: "🔥 Architecture Heatmap & Churn Hotspots",
    thaiTitle: "แผนที่ความร้อนสถาปัตยกรรมและจุดแก้โค้ดบ่อย (Hotspot & Churn Visualizer)",
    hubId: "CodeIDEHub",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#f59e0b",
    description: "Visual telemetry and heat matrix identifying high-churn modules, code fatigue, cyclomatic complexity hotspots, and 1-Node/1-File automated refactoring prescriptions.",
    thaiDescription: "แผนที่ความร้อนแสดงความถี่การแก้ไขไฟล์ (Code Churn), ความซับซ้อน (Complexity), จุดเสี่ยงเกิดบัคบ่อย (Hotspots), พร้อมระบบวิเคราะห์ 2D Refactoring Matrix และคำแนะนำการแยกไฟล์ตามกฎ 1 Node = 1 File",
    keywords: [
      "heatmap", "architecture heatmap", "code churn", "hotspot", "churn", "refactor", "refactoring",
      "technical debt", "complexity", "cyclomatic complexity", "modifications", "code fatigue",
      "แผนที่ความร้อน", "ความร้อนโค้ด", "แก้บ่อย", "จุดความร้อน", "รีแฟคเตอร์", "หนี้ทางเทคนิค", "ความถี่การแก้โค้ด", "ฮีทแมพ"
    ],
    iconName: "Flame",
    badge: "CHURN & HOTSPOT",
    shortcutHint: "Ctrl+Shift+H"
  },
  {
    id: "ModuleDependencyVisualizerStudio",
    title: "🌐 Module & Node Dependency Tree Visualizer",
    thaiTitle: "แผนผังความสัมพันธ์โมดูลและโครงสร้างระบบ (1 Node / 1 Module = 1 File)",
    hubId: "CodeIDEHub",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#ff7b72",
    description: "Interactive 2D Topology Graph visualizer mapping dependencies between modules, nodes, and files with 4-Tier Clean Architecture Layer Matrix, Blast Radius Simulator, and DAG Cycle Auditor.",
    thaiDescription: "เครื่องมือแสดงผลแผนผังกราฟความสัมพันธ์ระหว่างโมดูล โหนด และไฟล์ต่างๆ พร้อมเมทริกซ์ 4 เลเยอร์ Clean Architecture, ระบบจำลอง Blast Radius และตัวตรวจจับ Circular Dependency แบบ Real-time",
    keywords: [
      "dependency", "dependency tree", "dependency graph", "module graph", "node graph", "system visualizer",
      "blast radius", "clean architecture", "dag", "circular dependency", "architecture", "topology",
      "สถาปัตยกรรม", "แผนผังความสัมพันธ์", "ความสัมพันธ์", "โครงสร้างระบบ", "พึ่งพา", "วงวน", "แยกไฟล์", "1 node 1 file"
    ],
    iconName: "Network",
    badge: "TOPOLOGY GRAPH",
    shortcutHint: "Ctrl+Shift+D"
  },
  {
    id: "InteractiveDebuggerStudio",
    title: "⚡ Interactive Code Debugger",
    thaiTitle: "ระบบดีบักเกอร์แบบอินเตอร์แอคทีฟ (Breakpoints, Step Through, Call Stack & Watch)",
    hubId: "CodeIDEHub",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#ff7b72",
    description: "Interactive multi-language debugger for TypeScript, C#, C++, HLSL Shaders, Python, and Lua with Breakpoint toggles, Step Over/Into/Out, Variable Scope Inspector, Call Stack Frames, Live Watch Expressions, and REPL console.",
    thaiDescription: "ระบบดีบักเกอร์ระดับโปร รองรับ 6 ภาษา (TS, C#, C++, HLSL, Python, Lua) ตั้ง Breakpoint, Step Over (F10), Step Into (F11), ตรวจสอบค่าตัวแปรใน Scope, สลับ Call Stack Frame, Watch Expressions และ Immediate REPL Window",
    keywords: [
      "debugger", "debug", "interactive debugger", "breakpoint", "step over", "step into",
      "step out", "call stack", "watch expression", "variable inspect", "repl", "interactive debug",
      "ดีบัก", "ดีบักเกอร์", "หาจุดผิดพลาด", "ส่องตัวแปร", "จุดพัก", "เบรกพอยต์", "คอลสแตก", "ตัวแปร"
    ],
    iconName: "Bug",
    badge: "INTERACTIVE DEBUG",
    shortcutHint: "F5 / F10 / F11"
  },
  {
    id: "VisualFlowDebugger",
    title: "Visual Flow & Call Stack Debugger",
    thaiTitle: "ดีบักเกอร์แบบภาพตามติดสแตกและตัวแปร",
    hubId: "CodeIDEHub",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#ff7b72",
    description: "Step-by-step logic tracing, variable breakpoints, memory inspection, and call stack visualization.",
    thaiDescription: "ตรวจสอบการทำงานของโปรแกรมทีละขั้น ตั้งจุด Breakpoint และส่องดูค่าตัวแปรในหน่วยความจำ",
    keywords: ["debugger", "debug", "flow debug", "ดีบัก", "ดีบักเกอร์", "หาบั๊ก", "breakpoint"],
    iconName: "Bug"
  },
  {
    id: "CodeProfilerTracer",
    title: "Code Profiler & Function Tracer",
    thaiTitle: "วัดประสิทธิภาพฟังก์ชันและค้นหาคอขวด",
    hubId: "CodeIDEHub",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#ff7b72",
    description: "Flame graph execution timing, CPU hot-spot analysis, and garbage collection spike identification.",
    thaiDescription: "ดูกราฟ Flame Graph วัดเวลาที่แต่ละฟังก์ชันใช้ และค้นหาจุดที่ทำให้เกมกระตุก",
    keywords: ["profiler", "tracer", "flame graph", "trace", "วัดประสิทธิภาพ", "คอขวด", "โปรไฟล์เลอร์"],
    iconName: "Activity"
  },

  // 5. 🎵 AUDIO & SOUND
  {
    id: "MegaAudioDSPStudio",
    title: "500x Audio DSP & Mastering Tools",
    thaiTitle: "สตูดิโอดนตรี เสียงประกอบ และ DSP มิกซิ่ง 500x",
    hubId: "AudioHub",
    hubCategory: "🎵 AUDIO",
    activeColor: "#e3b341",
    description: "Multi-track digital audio workstation (DAW), synthesizer, parametric EQ, compressor, and mastering suite.",
    thaiDescription: "สตูดิโอดนตรีเต็มรูปแบบ บันทึกหลายแทร็ก ซินธิไซเซอร์ อีควอไลเซอร์ และมาสเตอริ่ง",
    keywords: ["audio", "audio dsp", "music", "dsp", "sound", "daw", "เสียง", "เพลง", "ดนตรี", "แต่งเพลง", "ทำเพลง", "มิกซ์เสียง", "เอฟเฟกต์เสียง", "หน้าเสียง", "หน้าเพลง"],
    iconName: "Volume2",
    badge: "500X AUDIO",
    shortcutHint: "Ctrl+Shift+A"
  },
  {
    id: "OfflineGameAudioStudio",
    title: "Offline Dynamic Game Audio Engine",
    thaiTitle: "ระบบเสียงเอฟเฟกต์และดนตรีเกม 0ms Latency (Game Audio Engine)",
    hubId: "AudioHub",
    hubCategory: "🎵 AUDIO",
    activeColor: "#e3b341",
    description: "Instant 0ms latency sound synthesizer for combat weapons, explosions, elemental wind/fire/lightning/ice, forest ambients, and dynamic voice acting.",
    thaiDescription: "ระบบสังเคราะห์เสียงเอฟเฟกต์สกิล (ฟัน, ระเบิด, ลม, ไฟ, สายฟ้า, น้ำแข็ง, ฮีล) และเสียงลมพัดในป่าแบบเรียลไทม์ ไร้ดีเลย์",
    keywords: [
      "audio engine", "game audio", "sfx", "sound fx", "skill sound", "sound effect",
      "เสียง", "หน้าเสียง", "ระบบเสียง", "เสียงเอฟเฟกต์", "เสียงสกิล", "เสียงฟัน",
      "เสียงระเบิด", "เสียงลม", "เสียงไฟ", "เสียงป่า", "เสียงพากย์", "ซาวด์", "sound",
      "game sound", "dynamic audio", "offline audio"
    ],
    iconName: "Volume2",
    badge: "0MS LATENCY",
    shortcutHint: "Ctrl+Shift+S"
  },
  {
    id: "SpatialAudioFoley",
    title: "Spatial Audio & Foley Studio",
    thaiTitle: "เสียงรอบทิศทาง 3 มิติ และเสียงเอฟเฟกต์ Foley",
    hubId: "AudioHub",
    hubCategory: "🎵 AUDIO",
    activeColor: "#e3b341",
    description: "Binaural 3D audio, HRTF acoustic propagation, room reverb convolution, and Foley sound effect library.",
    thaiDescription: "จำลองเสียงรอบทิศทาง 3D เสียงสะท้อนในห้อง และคลังเสียงเดิน/ยิงปืน/สัมผัส",
    keywords: ["spatial audio", "foley", "3d audio", "binaural", "เสียง 3d", "เสียงรอบทิศ", "เสียงประกอบ", "foley sound"],
    iconName: "Ear"
  },
  {
    id: "GenerativeAudioStudio",
    title: "AI Generative Audio Studio",
    thaiTitle: "AI สร้างเพลงและซาวด์เอฟเฟกต์อัตโนมัติ",
    hubId: "AudioHub",
    hubCategory: "🎵 AUDIO",
    activeColor: "#e3b341",
    description: "Generate adaptive music stems, ambient background soundscapes, and weapon SFX on the fly.",
    thaiDescription: "ใช้ AI สังเคราะห์ท่วงทำนองดนตรี เสียงบรรยากาศ และเสียงอาวุธแบบไดนามิก",
    keywords: ["ai audio", "ai music", "generative audio", "ai เสียง", "ai เพลง", "สร้างเพลง ai"],
    iconName: "Music"
  },
  {
    id: "AudioMixingConsole",
    title: "Audio Mixing Console",
    thaiTitle: "มิกเซอร์ควบคุมเสียงระดับโปร (Audio Mixer)",
    hubId: "AudioHub",
    hubCategory: "🎵 AUDIO",
    activeColor: "#e3b341",
    description: "32-channel audio mixer with volume faders, bus routing, ducking, and sidechain compression.",
    thaiDescription: "โต๊ะมิกเซอร์ 32 ช่อง ปรับระดับเสียง จัดกลุ่ม Bus และควบคุมความดังอัตโนมัติ",
    keywords: ["mixer", "audio mixer", "mixing console", "มิกเซอร์", "คุมเสียง", "โต๊ะมิกซ์"],
    iconName: "Sliders"
  },

  // 6. 🎬 CINEMATICS & ANIMATION
  {
    id: "MegaCutsceneCinematicStudio",
    title: "300x Cinematic & Director Tools",
    thaiTitle: "สตูดิโอคัตซีนและกำกับภาพยนตร์ 300x",
    hubId: "AnimationHub",
    hubCategory: "🎬 ANIMATION",
    activeColor: "#bc8cff",
    description: "Cine-camera rigs, focal length, depth of field, dolly tracks, keyframe timeline, and dialogue timing.",
    thaiDescription: "ตั้งมุมกล้อง ระยะเลนส์ รางเลื่อนดอลลี่ ไทม์ไลน์คีย์เฟรม และการจับคู่จังหวะบทสนทนา",
    keywords: ["cinematic", "cutscene", "director", "movie", "film", "คัตซีน", "ภาพยนตร์", "กำกับหนัง", "ฉากมูฟวี่", "มุมกล้อง", "หน้าคัตซีน", "หน้าหนัง"],
    iconName: "Film",
    badge: "300X CINEMA",
    shortcutHint: "Ctrl+Shift+C"
  },
  {
    id: "Sequencer",
    title: "Cinematic Sequencer Editor",
    thaiTitle: "ไทม์ไลน์กำกับกล้องและคัตซีน (Sequencer)",
    hubId: "AnimationHub",
    hubCategory: "🎬 ANIMATION",
    activeColor: "#bc8cff",
    description: "Non-linear timeline editor for arranging camera cuts, animation tracks, audio cues, and VFX triggers.",
    thaiDescription: "ไทม์ไลน์จัดวางช็อตกล้อง ท่าทางตัวละคร คิวเสียง และจุดยิงเอฟเฟกต์",
    keywords: ["sequencer", "timeline", "camera sequencer", "ซีเควนเซอร์", "ไทม์ไลน์", "จัดช็อต"],
    iconName: "Clapperboard"
  },
  {
    id: "OmniAnimationStudio",
    title: "MoCap & Character Rigging Studio",
    thaiTitle: "สตูดิโอแอนิเมชัน ดัดกระดูก และจับการเคลื่อนไหว",
    hubId: "AnimationHub",
    hubCategory: "🎬 ANIMATION",
    activeColor: "#bc8cff",
    description: "Inverse kinematics (IK/FK), motion matching, skeletal retargeting, and webcam motion capture.",
    thaiDescription: "ระบบดัดกระดูก IK/FK เชื่อมโยงท่าทาง โมชั่นแคปเจอร์ผ่านกล้อง และรีทาร์เก็ตกระดูก",
    keywords: ["animation", "mocap", "rigging", "ik", "motion capture", "แอนิเมชัน", "แอนิเมชั่น", "ดัดกระดูก", "ริก", "ท่าทาง", "ขยับ"],
    iconName: "PersonStanding",
    badge: "MOCAP & RIG"
  },
  {
    id: "FacialAnimationMocap",
    title: "Facial Animation & Lip-Sync Studio",
    thaiTitle: "แอนิเมชันสีหน้าและขยับปากพูด (Lip-Sync)",
    hubId: "AnimationHub",
    hubCategory: "🎬 ANIMATION",
    activeColor: "#bc8cff",
    description: "Blendshape facial controls, emotive expressions, phonetic lip-sync, and ARKit blendshape tracker.",
    thaiDescription: "ควบคุมสีหน้า อารมณ์ ยิ้ม โกรธ และซิงค์ริมฝีปากกับเสียงพูดภาษาไทย/อังกฤษ",
    keywords: ["facial", "lipsync", "blendshape", "face animation", "สีหน้า", "ขยับปาก", "ลิปซิงค์", "หน้าตา"],
    iconName: "Smile"
  },
  {
    id: "SpriteAnimationEditor",
    title: "2D Sprite Animator",
    thaiTitle: "แอนิเมเตอร์สไปรต์ 2 มิติ (2D Sprite)",
    hubId: "AnimationHub",
    hubCategory: "🎬 ANIMATION",
    activeColor: "#bc8cff",
    description: "Frame-by-frame 2D pixel art and sprite sheet animator with hit-box and hurt-box collision editors.",
    thaiDescription: "แอนิเมชัน 2 มิติทีละเฟรม จัดการ Sprite Sheet และตีกรอบ Hitbox โจมตี",
    keywords: ["sprite", "2d animation", "pixel art", "spritesheet", "สไปรต์", "2d", "การ์ตูน 2d", "แอนิเมชัน 2d"],
    iconName: "Image"
  },

  // 7. ✨ VFX & PARTICLES
  {
    id: "OmniVFXStudio",
    title: "Ultimate VFX & Particle Studio",
    thaiTitle: "สตูดิโอเอฟเฟกต์และอนุภาคระเบิด (VFX Studio)",
    hubId: "VFXHub",
    hubCategory: "✨ EFFECTS",
    activeColor: "#4caf50]",
    description: "GPU accelerated particle simulations, smoke, fire, magic sparks, shockwaves, and ribbon trails.",
    thaiDescription: "จำลองอนุภาค GPU ควัน ไฟ เวทมนตร์ คลื่นระเบิด และประกายแสงสมจริง",
    keywords: ["vfx", "particle", "effect", "magic", "fire", "smoke", "เอฟเฟกต์", "พาร์ทิเคิล", "เวทมนตร์", "ไฟ", "ระเบิด", "ควัน", "แสงสี", "หน้า vfx", "หน้าเอฟเฟกต์"],
    iconName: "Wand2",
    badge: "VFX CORE",
    shortcutHint: "Ctrl+Shift+V"
  },
  {
    id: "ParticleEffectEditor",
    title: "Particle Designer & Emitter",
    thaiTitle: "ออกแบบตัวปล่อยอนุภาคและสสาร",
    hubId: "VFXHub",
    hubCategory: "✨ EFFECTS",
    activeColor: "#4caf50",
    description: "Tune particle velocity, lifetime curves, color gradients, collision bounce, and turbulence forces.",
    thaiDescription: "ปรับความเร็ว ความโค้งของเวลา การสะท้อน และแรงลมปั่นป่วนของอนุภาค",
    keywords: ["particle designer", "emitter", "spark", "ตัวปล่อยอนุภาค", "ประกายไฟ", "อนุภาค"],
    iconName: "Sparkles"
  },
  {
    id: "PostProcessingStack",
    title: "Post-Processing & Color Grading",
    thaiTitle: "เกรดสี กล้องภาพยนตร์ และเอฟเฟกต์หน้าจอ (Post-Process)",
    hubId: "VFXHub",
    hubCategory: "✨ EFFECTS",
    activeColor: "#4caf50",
    description: "ACES tone mapping, bloom, motion blur, chromatic aberration, depth of field, and vignette.",
    thaiDescription: "ปรับโทนสี แสงฟุ้ง Bloom เบลอขณะเคลื่อนไหว และขอบมืดสไตล์ภาพยนตร์ฮอลลีวูด",
    keywords: ["post processing", "bloom", "color grading", "lut", "tone mapping", "เกรดสี", "โพสต์โพรเซส", "แสงฟุ้ง", "ภาพสวย"],
    iconName: "Camera"
  },

  // 8. 🎨 TEXTURE & MATERIALS
  {
    id: "TexturePCBMasterStudio",
    title: "600x Texture & PCB Tools",
    thaiTitle: "ชุดเครื่องมือจัดการเท็กเจอร์และวัสดุ 600x",
    hubId: "TextureHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#ff9800",
    description: "PBR texture synthesis, normal map generation, roughness baking, and procedural pattern nodes.",
    thaiDescription: "สร้างเท็กเจอร์ PBR อบ Normal Map ปรับ Roughness และสร้างลวดลาย",
    keywords: ["texture", "texture master", "pbr", "material", "เท็กเจอร์", "พื้นผิว", "วัสดุ", "หน้าเท็กเจอร์"],
    iconName: "CircuitBoard",
    badge: "600X TEXTURE"
  },
  {
    id: "TextureEdit",
    title: "Texture Manager & PBR Painter",
    thaiTitle: "จัดการเท็กเจอร์และวาดลวดลาย PBR",
    hubId: "TextureHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#ff9800",
    description: "Inspect texture channels (Albedo, Normal, Roughness, Metallic, AO) and resize/compress formats.",
    thaiDescription: "ตรวจสอบชาแนลสี ความขรุขระ ความเงา และบีบอัดไฟล์เท็กเจอร์",
    keywords: ["texture edit", "texture manager", "pbr paint", "แก้ไขเท็กเจอร์", "วาดพื้นผิว", "ลงสีโมเดล"],
    iconName: "Image"
  },
  {
    id: "VisualShaderGraphEditor",
    title: "Visual Shader Graph Editor",
    thaiTitle: "สร้างและแก้ไข Shader แบบภาพ (Shader Graph)",
    hubId: "TextureHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#ff9800",
    description: "Node-based shader authoring for HLSL/GLSL shaders, water reflections, dissolving, and parallax.",
    thaiDescription: "สร้างเชดเดอร์โดยไม่ต้องเขียนโค้ด น้ำไหล แสงสะท้อน วัตถุละลาย และพารัลแลกซ์",
    keywords: ["shader", "shader graph", "hlsl", "glsl", "เชดเดอร์", "โหนดเชดเดอร์", "เขียน shader"],
    iconName: "Layers",
    badge: "SHADER GRAPH"
  },
  {
    id: "AITextureGenerator",
    title: "AI Texture Generator",
    thaiTitle: "AI สร้างพื้นผิวและเท็กเจอร์อัตโนมัติ",
    hubId: "TextureHub",
    hubCategory: "🎨 ART STUDIO",
    activeColor: "#ff9800",
    description: "Seamless tileable PBR texture creation from text prompts with automatic normal/height map baking.",
    thaiDescription: "พิมพ์คำสั่งให้ AI สร้างลายไม้ หิน เหล็ก ผ้า แบบไร้รอยต่อพร้อม Normal Map",
    keywords: ["ai texture", "generate texture", "ai เท็กเจอร์", "ai สร้างพื้นผิว", "สร้างลาย"],
    iconName: "Sparkles"
  },

  // 9. 🎮 GAME SYSTEMS & ECONOMY
  {
    id: "GameSystems",
    title: "Core Game Systems Editor",
    thaiTitle: "ตั้งค่าระบบหลักของเกม (Game Systems)",
    hubId: "GameDesignHub",
    hubCategory: "🎮 GAME DESIGN",
    activeColor: "#58a6ff",
    description: "Player attributes, health/mana pools, stamina, status effects, and victory/defeat rules.",
    thaiDescription: "ค่าสถานะตัวละคร พลังชีวิต มานา สเตตัส และกฎการแพ้ชนะของเกม",
    keywords: ["game systems", "game design", "rules", "ระบบเกม", "ตั้งค่าเกม", "กฎของเกม", "พลังชีวิต"],
    iconName: "Blocks",
    badge: "SYSTEMS CORE"
  },
  {
    id: "EconomicBalancer",
    title: "Game Economy & Combat Balancer",
    thaiTitle: "สมดุลเศรษฐกิจ ไอเทม และการต่อสู้ (Economy Balancer)",
    hubId: "GameDesignHub",
    hubCategory: "🎮 GAME DESIGN",
    activeColor: "#58a6ff",
    description: "Simulate currency circulation, gold sinks, drop rates, DPS curves, and armor damage scaling.",
    thaiDescription: "จำลองการหมุนเวียนของเงินในเกม อัตราดรอป กราฟ DPS และการคำนวณพลังป้องกัน",
    keywords: ["economy", "balance", "combat balance", "gold", "dps", "เศรษฐกิจ", "ความสมดุล", "เงินในเกม", "บาลานซ์", "คำนวณดาเมจ"],
    iconName: "Database"
  },
  {
    id: "LootTableEditor",
    title: "Loot & Drop Table Editor",
    thaiTitle: "ตารางดรอปไอเทมและกาชา (Loot Tables)",
    hubId: "GameDesignHub",
    hubCategory: "🎮 GAME DESIGN",
    activeColor: "#58a6ff",
    description: "Configure drop chances, rarity tiers (Common to Mythic), weighted loot chests, and gacha pools.",
    thaiDescription: "ตั้งค่าอัตราการดรอปของ ความหายาก (ธรรมดาถึงระดับตำนาน) และกล่องสุ่มกาชา",
    keywords: ["loot", "drop", "gacha", "loot table", "ดรอปของ", "กล่องสุ่ม", "กาชา", "ของรางวัล", "ไอเทมดรอป"],
    iconName: "Gift"
  },
  {
    id: "SkillTreeLevelingConfig",
    title: "Skill Trees & Leveling System",
    thaiTitle: "ผังทักษะ อัปเลเวล และสกิลทรี (Skill Trees)",
    hubId: "GameDesignHub",
    hubCategory: "🎮 GAME DESIGN",
    activeColor: "#58a6ff",
    description: "Branching skill trees, passive perks, talent nodes, EXP curves, and stat requirements.",
    thaiDescription: "สายสกิล สกิลติดตัว แต้มพรสวรรค์ กราฟ EXP และเงื่อนไขการอัปเลเวล",
    keywords: ["skill tree", "skill", "leveling", "exp", "talent", "สกิล", "สกิลทรี", "อัปเลเวล", "ผังทักษะ", "ความสามารถพิเศษ"],
    iconName: "TrendingUp"
  },
  {
    id: "GameplayAbilitySystem",
    title: "Gameplay Ability System (GAS)",
    thaiTitle: "ระบบอบิลิตี้และคูลดาวน์สกิล (Ability System)",
    hubId: "GameDesignHub",
    hubCategory: "🎮 GAME DESIGN",
    activeColor: "#58a6ff",
    description: "Modular abilities, cooldowns, gameplay tags, projectile triggers, and buff/debuff stacks.",
    thaiDescription: "ระบบสกิลกดใช้ คูลดาวน์ เอฟเฟกต์ติดพิษ/ใบ้/สตัน และการคำนวณแท็กเกมเพลย์",
    keywords: ["gas", "ability", "ability system", "cooldown", "buff", "สกิลกดใช้", "คูลดาวน์", "บัฟ", "ดีบัฟ"],
    iconName: "Zap"
  },

  // 10. 👤 CHARACTERS & AI NPC
  {
    id: "NPCEdit",
    title: "NPC & MetaHuman Editor",
    thaiTitle: "สร้างตัวละคร NPC และประชากร (NPC Studio)",
    hubId: "CharacterAIHub",
    hubCategory: "🎮 GAME DESIGN",
    activeColor: "#e91e63",
    description: "Create human NPCs, civilian dialogue personalities, daily schedules, and custom attire.",
    thaiDescription: "สร้างตัวละคร NPC ชาวบ้าน กำหนดนิสัย ตารางชีวิตประจำวัน และเครื่องแต่งกาย",
    keywords: ["npc", "character", "metahuman", "civilian", "ตัวละคร", "npc edit", "คน", "ชาวบ้าน", "หน้า npc"],
    iconName: "Users",
    badge: "NPC CORE"
  },
  {
    id: "MonsterEdit",
    title: "Monster & Boss Creator",
    thaiTitle: "สร้างมอนสเตอร์ บอส และสิ่งมีชีวิต (Monster Editor)",
    hubId: "CharacterAIHub",
    hubCategory: "🎮 GAME DESIGN",
    activeColor: "#e91e63",
    description: "Design creature anatomies, boss phases, rage mechanics, attack patterns, and loot rewards.",
    thaiDescription: "ออกแบบสิ่งมีชีวิต รูปร่างปีศาจ ท่าโจมตีของบอส เฟสการต่อสู้ และของรางวัลเมื่อชนะ",
    keywords: ["monster", "boss", "enemy", "creature", "มอนสเตอร์", "บอส", "ศัตรู", "สัตว์ประหลาด", "หน้ามอนสเตอร์"],
    iconName: "Ghost"
  },
  {
    id: "AINPCBehaviorTreeEditor",
    title: "AI NPC Behavior Trees",
    thaiTitle: "ต้นไม้การตัดสินใจและพฤติกรรม AI (Behavior Tree)",
    hubId: "CharacterAIHub",
    hubCategory: "🎮 GAME DESIGN",
    activeColor: "#e91e63",
    description: "Hierarchical behavior trees, selector/sequence nodes, blackboard keys, and perception vision cones.",
    thaiDescription: "ผังพฤติกรรม AI การมองเห็น การได้ยิน การลาดตระเวน และการไล่ล่าผู้เล่น",
    keywords: ["behavior tree", "ai behavior", "blackboard", "perception", "พฤติกรรม ai", "สมอง ai", "ai ต้นไม้", "การตัดสินใจ ai"],
    iconName: "BrainCircuit"
  },

  // 11. 📖 STORY, QUESTS & LORE
  {
    id: "WorldLore",
    title: "World Lore & Codex Editor",
    thaiTitle: "สารานุกรมจักรวาลและตำนานโลก (World Lore)",
    hubId: "StoryQuestHub",
    hubCategory: "🎮 GAME DESIGN",
    activeColor: "#9c27b0",
    description: "World lore timeline, historical eras, kingdom factions, mythologies, and encyclopedia entries.",
    thaiDescription: "ไทม์ไลน์ประวัติศาสตร์โลก อาณาจักร ศาสนา ความเชื่อ และสารานุกรมข้อมูลในเกม",
    keywords: ["lore", "story", "codex", "history", "เนื้อเรื่อง", "ตำนาน", "ประวัติ", "จักรวาล", "บทละคร", "หน้าเนื้อเรื่อง"],
    iconName: "BookOpen",
    badge: "NARRATIVE"
  },
  {
    id: "QuestDesigner",
    title: "Quest & Mission Designer",
    thaiTitle: "ออกแบบเควสและภารกิจ (Quest Designer)",
    hubId: "StoryQuestHub",
    hubCategory: "🎮 GAME DESIGN",
    activeColor: "#9c27b0",
    description: "Main quests, side missions, objective triggers, reward distribution, and quest journal tracking.",
    thaiDescription: "สร้างเควสหลัก ภารกิจย่อย เงื่อนไขผ่านด่าน ของรางวัล และสมุดบันทึกเควส",
    keywords: ["quest", "mission", "quest designer", "เควส", "ภารกิจ", "เควสหลัก", "เควสย่อย", "หน้าเควส"],
    iconName: "MapPin"
  },
  {
    id: "AdvancedDialogueSystem",
    title: "Advanced Branching Dialogue",
    thaiTitle: "ระบบบทสนทนาแตกกิ่งและตัวเลือก (Dialogue System)",
    hubId: "StoryQuestHub",
    hubCategory: "🎮 GAME DESIGN",
    activeColor: "#9c27b0",
    description: "Interactive conversation trees, condition gates, voice audio tags, and player choice consequences.",
    thaiDescription: "บทสนทนาหลายทางเลือก เงื่อนไขคำตอบ เสียงพากย์ และผลลัพธ์จากการตอบคำถาม",
    keywords: ["dialogue", "conversation", "chat system", "บทสนทนา", "คำพูด", "พูดคุย", "คุยกับ npc", "หน้าสนทนา"],
    iconName: "MessageCircle"
  },

  // 12. ⚛️ PHYSICS & SIMULATION
  {
    id: "DeterministicEngineeringSuite",
    title: "50x Pure Engineering Suite",
    thaiTitle: "ชุดวิศวกรรมฟิสิกส์และความแม่นยำสูง 50x",
    hubId: "PhysicsHub",
    hubCategory: "⚛️ SIMULATION",
    activeColor: "#ff5722",
    description: "High-precision physical simulation, stress analysis, aerodynamics, and mathematical calculations.",
    thaiDescription: "คำนวณฟิสิกส์แม่นยำสูง การรับแรง ความเค้น อากาศพลศาสตร์ และสูตรวิศวกรรม",
    keywords: ["engineering suite", "deterministic", "physics math", "วิศวกรรม", "คำนวณฟิสิกส์"],
    iconName: "Calculator",
    badge: "50X SUITE"
  },
  {
    id: "ChaosPhysicsFluidEngine",
    title: "Chaos Physics & Fluid Simulation",
    thaiTitle: "ฟิสิกส์เคออส ของเหลว และการชน (Fluid & Physics)",
    hubId: "PhysicsHub",
    hubCategory: "⚛️ SIMULATION",
    activeColor: "#ff5722",
    description: "Real-time fluid dynamics, buoyancy, cloth simulation, rigid-body constraints, and fracture joints.",
    thaiDescription: "จำลองน้ำ ของเหลว การลอยตัว ผ้าพริ้วไหว ข้อต่อวัตถุ และการชนกระแทกแบบเรียลไทม์",
    keywords: ["physics", "fluid", "chaos physics", "cloth", "buoyancy", "ฟิสิกส์", "น้ำ", "ของเหลว", "การชน", "ผ้า", "หน้าฟิสิกส์"],
    iconName: "Flame"
  },
  {
    id: "VehicleDynamicsTuner",
    title: "Vehicle Dynamics Tuner",
    thaiTitle: "จูนเนอร์ฟิสิกส์ยานพาหนะและรถยนต์ (Vehicle Tuner)",
    hubId: "PhysicsHub",
    hubCategory: "⚛️ SIMULATION",
    activeColor: "#ff5722",
    description: "Tire friction models (Pacejka), suspension stiffness, engine torque curves, gearbox, and drifting.",
    thaiDescription: "ปรับฟิสิกส์รถยนต์ แรงเสียดทานยาง ช่วงล่าง แรงบิดเครื่องยนต์ อัตราทดเกียร์ และการดริฟต์",
    keywords: ["vehicle", "car", "car physics", "tire", "suspension", "รถ", "รถยนต์", "ยานพาหนะ", "ฟิสิกส์รถ", "ขับรถ"],
    iconName: "Car"
  },
  {
    id: "ActiveRagdollEuphoriaEngine",
    title: "Active Ragdoll Euphoria Engine",
    thaiTitle: "แร็กดอลล์มีชีวิตสไตล์ Euphoria (Active Ragdoll)",
    hubId: "PhysicsHub",
    hubCategory: "⚛️ SIMULATION",
    activeColor: "#ff5722",
    description: "Self-balancing physical character ragdolls that react to impacts, stumble, and get back up naturally.",
    thaiDescription: "ตัวละครฟิสิกส์ทรงตัวอัตโนมัติ ตอบสนองต่อแรงกระแทก เซ ล้ม และลุกขึ้นอย่างเป็นธรรมชาติ",
    keywords: ["ragdoll", "euphoria", "active ragdoll", "physics character", "แร็กดอลล์", "ล้ม", "ทรงตัว", "ฟิสิกส์ตัวละคร"],
    iconName: "Activity"
  },

  // 13. 💡 LIGHTING & RENDER
  {
    id: "RuntimeGraphicsStreamingOptimizer",
    title: "4K Graphics & Streaming Optimizer",
    thaiTitle: "ออปติไมซ์สตรีมมิ่งกราฟิกและเรนเดอร์ 4K",
    hubId: "RenderHub",
    hubCategory: "💡 RENDERING",
    activeColor: "#ffc107",
    description: "Virtual texturing, occlusion culling, dynamic resolution scaling, and GPU memory streaming.",
    thaiDescription: "เพิ่มความลื่นไหล โหลดเท็กเจอร์แบบเสมือนจริง และปรับความละเอียดภาพอัตโนมัติตามเฟรมเรต",
    keywords: ["graphics optimizer", "streaming", "4k graphics", "culling", "กราฟิก", "ออปติไมซ์กราฟิก", "ความละเอียด"],
    iconName: "Zap",
    badge: "4K OPTIMIZER"
  },
  {
    id: "CinematicLightingEditor",
    title: "Cinematic Lighting Studio",
    thaiTitle: "จัดแสงภาพยนตร์และไฟสตูดิโอ (Lighting)",
    hubId: "RenderHub",
    hubCategory: "💡 RENDERING",
    activeColor: "#ffc107",
    description: "Directional sun lights, point/spot lights, IES profiles, volumetric light shafts, and shadows.",
    thaiDescription: "จัดแสงดวงอาทิตย์ สปอตไลท์ แสงลำหมอก Volumetric และเงาตกกระทบสมจริง",
    keywords: ["lighting", "light", "sun", "shadow", "ies", "แสง", "จัดแสง", "เงา", "ดวงอาทิตย์", "ไฟ", "หน้าแสง"],
    iconName: "Sun"
  },
  {
    id: "GraphicsRender",
    title: "Graphics Render Pipeline",
    thaiTitle: "ไพพ์ไลน์เรนเดอร์กราฟิกและเอนจิน",
    hubId: "RenderHub",
    hubCategory: "💡 RENDERING",
    activeColor: "#ffc107",
    description: "Forward+ vs Deferred rendering pipelines, anti-aliasing (TAA/FSR/DLSS), and rasterizer options.",
    thaiDescription: "เลือกสถาปัตยกรรมเรนเดอร์ Forward/Deferred ระบบลบรอยหยัก TAA/FSR/DLSS",
    keywords: ["render", "graphics render", "pipeline", "dlss", "fsr", "เรนเดอร์", "หน้าเรนเดอร์", "กราฟิกเรนเดอร์"],
    iconName: "Orbit"
  },
  {
    id: "RaytracingConfigurator",
    title: "Raytracing & Global Illumination",
    thaiTitle: "ตั้งค่า Raytracing และแสงสะท้อน GI",
    hubId: "RenderHub",
    hubCategory: "💡 RENDERING",
    activeColor: "#ffc107",
    description: "Hardware raytraced reflections, ambient occlusion, global illumination bounces, and denoisers.",
    thaiDescription: "เปิดใช้งาน Raytracing แสงสะท้อนบนกระจก/น้ำ และการสะท้อนแสงธรรมชาติแบบหลายเด้ง",
    keywords: ["raytracing", "rtx", "global illumination", "gi", "เรย์เทรซ", "แสงสะท้อน", "ray trace"],
    iconName: "Sun"
  },

  // 14. 📐 UI/UX & DATA
  {
    id: "MegaUIUXMasterStudio",
    title: "1,000x UI/UX Design System Tools",
    thaiTitle: "ระบบออกแบบ UI/UX สเกลยักษ์ 1000x (UI Studio)",
    hubId: "UIUXDataHub",
    hubCategory: "📐 INTERFACE",
    activeColor: "#03a9f4",
    description: "Figma-grade vector canvas, auto-layout, design tokens, interactive components, and state machines.",
    thaiDescription: "ออกแบบหน้าจอ UI เวกเตอร์ระดับมืออาชีพ Auto-layout คอมโพเนนต์ และแอนิเมชันปุ่ม",
    keywords: ["mega ui", "ui studio", "uiux", "figma", "ออกแบบ ui", "ดีไซน์ ui", "หน้าจอ ui", "หน้า ui"],
    iconName: "LayoutDashboard",
    badge: "1000X UI",
    shortcutHint: "Ctrl+Shift+U"
  },
  {
    id: "UIUXEdit",
    title: "UI Visual Builder",
    thaiTitle: "สร้างหน้าจอ UI แบบลากวาง (Visual Builder)",
    hubId: "UIUXDataHub",
    hubCategory: "📐 INTERFACE",
    activeColor: "#03a9f4",
    description: "Drag-and-drop HUD designer, health bars, minimap widgets, inventory grids, and responsive anchors.",
    thaiDescription: "ลากวางแถบเลือด มินิแมพ ช่องกระเป๋า เมนู Pause และจัดตำแหน่งยึดกับขอบจอ",
    keywords: ["ui builder", "hud", "ui edit", "หน้าจอ", "เมนู", "ปุ่ม", "อินเตอร์เฟซ", "แถบเลือด", "มินิแมพ"],
    iconName: "LayoutDashboard"
  },
  {
    id: "UXUISimulatorTestbed",
    title: "Multi-Device UI Simulator",
    thaiTitle: "ทดสอบหน้าจอบนอุปกรณ์ต่างๆ (Simulator)",
    hubId: "UIUXDataHub",
    hubCategory: "📐 INTERFACE",
    activeColor: "#03a9f4",
    description: "Simulate game interface on mobile notches, ultrawide 21:9, Steam Deck, 4K TV, and VR headsets.",
    thaiDescription: "จำลองการแสดงผล UI บนหน้าจอมือถือ จออัลตร้าไวด์ เครื่องพกพา และจอทีวี 4K",
    keywords: ["ui simulator", "device test", "mobile ui", "จำลองหน้าจอ", "ทดสอบหน้าจอ", "สัดส่วนจอ"],
    iconName: "Monitor"
  },
  {
    id: "DataTableJSONEditor",
    title: "Data Table & JSON Editor",
    thaiTitle: "ตารางข้อมูลและ JSON เอดิเตอร์ (Data Tables)",
    hubId: "UIUXDataHub",
    hubCategory: "📐 INTERFACE",
    activeColor: "#03a9f4",
    description: "Spreadsheet-style game data manipulation, schema validation, CSV/JSON import, and live sync.",
    thaiDescription: "จัดการตารางข้อมูลในเกม รูปแบบตาราง Excel/JSON อิมพอร์ตและอัปเดตข้อมูลแบบสด",
    keywords: ["data table", "json", "csv", "spreadsheet", "ตารางข้อมูล", "ฐานข้อมูล", "ข้อมูลเกม", "ตาราง"],
    iconName: "Table"
  },
  {
    id: "StateSerializationManager",
    title: "Save & Load State Serializer",
    thaiTitle: "ระบบเซฟเกมและโหลดสถานะ (Save Manager)",
    hubId: "UIUXDataHub",
    hubCategory: "📐 INTERFACE",
    activeColor: "#03a9f4",
    description: "Binary/JSON game save state serialization, slot management, cloud save syncing, and checksum hashing.",
    thaiDescription: "ระบบบันทึกและโหลดเกม จัดการสล็อตเซฟ เช็กความถูกต้องของไฟล์ และซิงค์เซฟ",
    keywords: ["save", "load", "serialization", "save manager", "เซฟเกม", "โหลดเกม", "บันทึกเกม", "ไฟล์เซฟ"],
    iconName: "Save"
  },

  // 15. ⚙️ DEVOPS, BUILD & PUBLISH
  {
    id: "BuildPublishAudit",
    title: "Pre-Flight Build & Publish Audit",
    thaiTitle: "ตรวจสอบความพร้อมก่อนบิลด์และรายงาน PDF (Build Audit)",
    hubId: "DevOpsHub",
    hubCategory: "⚙️ DEVOPS",
    activeColor: "#f85149",
    description: "Deep compiler sweep, memory budget audit, shader ABI verification, and downloadable PDF report generation.",
    thaiDescription: "สแกนตรวจสอบความพร้อมก่อนบิลด์ งบ VRAM/RAM ตรวจสอบเชดเดอร์ และออกรายงานสรุป PDF",
    keywords: ["audit", "pre flight", "build audit", "pdf report", "ตรวจสอบบิลด์", "ออดิท", "รายงานบิลด์", "ตรวจความพร้อม", "หน้า audit", "หน้าออดิท"],
    iconName: "ShieldCheck",
    badge: "PRE-FLIGHT & PDF",
    shortcutHint: "Ctrl+Shift+B"
  },
  {
    id: "BuildPublish",
    title: "Build & Deploy Pipeline",
    thaiTitle: "คอมไพล์ ส่งออกเกม และ Deploy (Build Pipeline)",
    hubId: "DevOpsHub",
    hubCategory: "⚙️ DEVOPS",
    activeColor: "#f85149",
    description: "Cross-compile binaries for Windows, Linux, Android, iOS, WebGPU, and Steam deployment packaging.",
    thaiDescription: "คอมไพล์และแพ็กเกจเกมสำหรับ Windows, Linux, มือถือ, WebGPU และเตรียมส่งขึ้น Steam",
    keywords: ["build", "publish", "deploy", "compile", "package", "บิลด์", "ส่งออก", "คอมไพล์", "เผยแพร่", "หน้า build", "หน้าบิลด์"],
    iconName: "Cloud",
    badge: "COMPILER"
  },
  {
    id: "VersionControlUI",
    title: "Version Control & Git Hub",
    thaiTitle: "ระบบควบคุมเวอร์ชันและ Git (VCS)",
    hubId: "DevOpsHub",
    hubCategory: "⚙️ DEVOPS",
    activeColor: "#f85149",
    description: "Git branch management, visual commit graphs, conflict resolution, LFS asset tracking, and remotes.",
    thaiDescription: "จัดการ Branch, Commit, แก้ไขข้อขัดแย้งของไฟล์ และติดตามโมเดล/เท็กเจอร์ขนาดใหญ่ด้วย Git LFS",
    keywords: ["git", "vcs", "version control", "commit", "branch", "กิต", "เวอร์ชัน", "ประวัติโค้ด", "หน้า git"],
    iconName: "GitCommit"
  },
  {
    id: "CrashAnalyticsDashboard",
    title: "Crash & Telemetry Analytics",
    thaiTitle: "แดชบอร์ดสถิติบั๊กและแครช (Crash Analytics)",
    hubId: "DevOpsHub",
    hubCategory: "⚙️ DEVOPS",
    activeColor: "#f85149",
    description: "Real-time exception tracking, minidump analysis, device breakdown, and crash reproduction traces.",
    thaiDescription: "ติดตามข้อผิดพลาดและอาการเกมเด้ง/แครช สถิติอุปกรณ์ผู้เล่น และบันทึกประวัติข้อผิดพลาด",
    keywords: ["crash", "analytics", "telemetry", "exception", "แครช", "เกมเด้ง", "สถิติบั๊ก", "วิเคราะห์"],
    iconName: "Activity"
  },
  {
    id: "PerformanceDashboard",
    title: "Performance Telemetry & FPS",
    thaiTitle: "วัดเฟรมเรตและประสิทธิภาพเรียลไทม์ (Telemetry)",
    hubId: "DevOpsHub",
    hubCategory: "⚙️ DEVOPS",
    activeColor: "#f85149",
    description: "Live FPS counter, frame time graphs (99th percentile), draw call counter, and CPU/GPU split.",
    thaiDescription: "วัดค่า FPS, กราฟ Frametime, จำนวน Draw Call และสัดส่วนภาระงานระหว่าง CPU/GPU",
    keywords: ["performance", "fps", "telemetry", "draw call", "เฟรมเรต", "ความเร็ว", "ประสิทธิภาพ", "วัด fps"],
    iconName: "Gauge"
  },
  {
    id: "MultiplayerServerOrchestrator",
    title: "Multiplayer Server Orchestrator",
    thaiTitle: "จัดการเซิร์ฟเวอร์มัลติเพลเยอร์และจับคู่ (Server Hub)",
    hubId: "DevOpsHub",
    hubCategory: "⚙️ DEVOPS",
    activeColor: "#f85149",
    description: "Dedicated game server fleet management, matchmaking queues, ping routing, and room scaling.",
    thaiDescription: "จัดการเซิร์ฟเวอร์เกมออนไลน์ ระบบจับคู่ผู้เล่น (Matchmaking) และตรวจสอบค่า Ping",
    keywords: ["multiplayer", "server", "matchmaking", "online", "มัลติเพลเยอร์", "ออนไลน์", "เซิร์ฟเวอร์", "เล่นด้วยกัน"],
    iconName: "Server"
  },
  {
    id: "AntiCheatSecurityHub",
    title: "Anti-Cheat & Security Hub",
    thaiTitle: "ระบบป้องกันโปรและตรวจสอบความปลอดภัย (Anti-Cheat)",
    hubId: "DevOpsHub",
    hubCategory: "⚙️ DEVOPS",
    activeColor: "#f85149",
    description: "Memory tampering detection, integrity verification, speedhack prevention, and packet encryption.",
    thaiDescription: "ป้องกันการแก้ไขหน่วยความจำ ป้องกันโปรสปีด ตรวจสอบความถูกต้องของไฟล์ และเข้ารหัสแพ็กเก็ต",
    keywords: ["anti cheat", "security", "cheat", "hack", "ป้องกันโปร", "กันโปร", "แฮก", "ความปลอดภัย"],
    iconName: "Shield"
  },

  // 16. 🧠 AI HUB & OFFLINE INTELLIGENCE
  {
    id: "AIHubMasterMenu",
    title: "AI Master Hub",
    thaiTitle: "ศูนย์รวมระบบ AI และโมเดลออฟไลน์ (AI Master)",
    hubId: "AIHubMaster",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#8a2be2",
    description: "Central command dashboard for all 50+ on-device specialized neural network agents.",
    thaiDescription: "ศูนย์บัญชาการหลักสำหรับโมเดล AI และตัวแทนปัญญาประดิษฐ์ออฟไลน์กว่า 50 สายงาน",
    keywords: ["ai hub", "ai master", "ai menu", "ศูนย์ ai", "รวม ai", "หน้า ai", "ai กลาง"],
    iconName: "Brain",
    badge: "AI HUB",
    shortcutHint: "Ctrl+Shift+I"
  },
  {
    id: "OmniMegaEngine300Studio",
    title: "335+ Mega Engine & AI Suite",
    thaiTitle: "ชุดสวีท AI และเครื่องมือ 335+",
    hubId: "AIHubMaster",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#8a2be2",
    description: "Unified matrix hub containing over 335 cutting-edge game creation and intelligence systems.",
    thaiDescription: "เมทริกซ์ฮับที่รวมเครื่องมือสร้างเกมและระบบ AI ขั้นสูงกว่า 335 ระบบ",
    keywords: ["mega engine", "300 studio", "335 engine", "ai suite", "สวีท ai", "เอนจิน 300"],
    iconName: "Cpu",
    badge: "335+ ENGINES"
  },
  {
    id: "OfflineAIEngineSuite",
    title: "50x Offline AI Suite",
    thaiTitle: "ชุด AI ออฟไลน์ 50 สายงาน (Offline AI Suite)",
    hubId: "AIHubMaster",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#8a2be2",
    description: "Specialized offline neural agents covering 3D, code, audio, narrative, physics, and game balance.",
    thaiDescription: "AI ออฟไลน์เฉพาะทาง 50 โมเดล ดูแลทั้งด้าน 3D, โค้ด, เสียง, เนื้อเรื่อง, ฟิสิกส์ และเศรษฐกิจ",
    keywords: ["offline ai", "50 ai", "ai suite", "ai ออฟไลน์", "ai 50", "ชุด ai ออฟไลน์"],
    iconName: "Brain"
  },
  {
    id: "UltimateOfflineAIStudio",
    title: "Ultimate Offline AI Studio",
    thaiTitle: "สตูดิโอโมเดล AI ออฟไลน์ระดับสูง (Ultimate AI)",
    hubId: "AIHubMaster",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#8a2be2",
    description: "Tensor acceleration, GGUF/ExLlama quantization, PagedAttention, and multi-agent hive mind.",
    thaiDescription: "ปรับแต่งพารามิเตอร์ AI ออฟไลน์ จัดการ VRAM และการเร่งความเร็วประมวลผล",
    keywords: ["ultimate ai", "neural studio", "llm studio", "ai studio", "สตูดิโอ ai", "อัลติเมท ai"],
    iconName: "Cpu"
  },
  {
    id: "AIOfflineDownloader",
    title: "Offline AI Downloader",
    thaiTitle: "ดาวน์โหลดและจัดการน้ำหนักโมเดล AI (Weights Manager)",
    hubId: "AIHubMaster",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#8a2be2",
    description: "Download and cache quantized neural models (Llama 3.2, DeepSeek, Qwen) for 100% offline usage.",
    thaiDescription: "ดาวน์โหลดและบันทึกโมเดล AI ลงเครื่องเพื่อใช้งานแบบออฟไลน์ 100% โดยไม่ต้องต่อเน็ต",
    keywords: ["download ai", "ai weights", "model download", "โหลด ai", "ดาวน์โหลด ai", "โมเดลออฟไลน์"],
    iconName: "Download"
  },
  {
    id: "AICodeQualityAuditor",
    title: "AI Code Quality Auditor",
    thaiTitle: "AI ตรวจสอบคุณภาพและมาตรฐานโค้ด (Code Auditor)",
    hubId: "AIHubMaster",
    hubCategory: "🤖 AI & CODE",
    activeColor: "#8a2be2",
    description: "Automated linting, memory leak detection, clean code standards, and security compliance scans.",
    thaiDescription: "ตรวจเช็กความสะอาดของโค้ด ปัญหาหน่วยความจำรั่วไหล และมาตรฐานความปลอดภัยอัตโนมัติ",
    keywords: ["code quality", "code auditor", "ai auditor", "ตรวจโค้ด", "คุณภาพโค้ด", "มาตรฐานโค้ด"],
    iconName: "ShieldCheck"
  }
];

// Navigation verbs and prefixes in Thai and English
const NAV_PREFIXES_THAI = [
  "ไปหน้า", "ไปที่", "ไป", "เปิดหน้า", "เปิด", "พาไปหน้า", "พาไป", 
  "วาร์ปไปหน้า", "วาร์ปไป", "วาร์ป", "สลับไปหน้า", "สลับไป", "สลับหน้า", "สลับ", 
  "เปลี่ยนไปหน้า", "เปลี่ยนไป", "เปลี่ยนหน้า", "เข้าหน้า", "เข้าสู่", "เข้า", 
  "ขอดูหน้า", "ดูหน้า", "พาฉันไป", "อยากไป", "พาไปที่", "กระโดดไป"
];

const NAV_PREFIXES_ENG = [
  "/goto", "/open", "/nav", "/warp", "/switch", "/jump",
  "go to page", "go to", "goto", "go page", "go", "open page", "open", 
  "navigate to", "navigate", "nav to", "nav", "switch to page", "switch to", "switch", 
  "launch page", "launch", "take me to", "jump to", "teleport to", "warp to", 
  "view page", "view", "show page", "show me", "show"
];

/**
 * Intelligent NLP & Fuzzy Pattern Recognizer for AI Chat Navigation
 */
export function parseNavigationIntent(input: string): NavMatchResult {
  const raw = input.trim();
  if (!raw) {
    return {
      isNavIntent: false,
      cleanedQuery: "",
      bestTarget: null,
      confidence: 0,
      suggestions: [],
      routeReason: "",
      thaiRouteReason: ""
    };
  }

  const lower = raw.toLowerCase();

  // Check if input starts with or includes navigation keywords
  let detectedVerb = "";
  let queryBody = lower;
  let isNav = false;

  // 1. Explicit Slash Commands
  if (lower.startsWith('/') || lower.startsWith('!')) {
    for (const prefix of ["/goto", "/open", "/nav", "/warp", "/switch", "/jump", "!goto", "!open"]) {
      if (lower.startsWith(prefix)) {
        isNav = true;
        detectedVerb = prefix;
        queryBody = lower.substring(prefix.length).trim();
        break;
      }
    }
  }

  // 2. Thai Prefixes Check
  if (!isNav) {
    for (const prefix of NAV_PREFIXES_THAI) {
      if (lower.startsWith(prefix)) {
        isNav = true;
        detectedVerb = prefix;
        queryBody = lower.substring(prefix.length).trim();
        break;
      }
    }
  }

  // 3. English Prefixes Check
  if (!isNav) {
    for (const prefix of NAV_PREFIXES_ENG) {
      if (lower.startsWith(prefix + " ") || lower === prefix) {
        isNav = true;
        detectedVerb = prefix;
        queryBody = lower.substring(prefix.length).trim();
        break;
      }
    }
  }

  // 4. Natural Question / Request Patterns (e.g. "อยากแก้ไขแผนที่", "where can I edit 3d models?", "ขอหน้าตั้งค่าหน่อย")
  if (!isNav) {
    if (
      lower.includes("อยากไป") || 
      lower.includes("ช่วยพาไป") || 
      lower.includes("พาไปที่") || 
      lower.includes("เปิดโปรแกรม") ||
      lower.includes("แก้ไข") ||
      lower.includes("where can i edit") ||
      lower.includes("take me to") ||
      lower.includes("how to open")
    ) {
      isNav = true;
      detectedVerb = "assist";
      queryBody = lower
        .replace(/อยากไป|ช่วยพาไป|พาไปที่|เปิดโปรแกรม|where can i edit|take me to|how to open/g, "")
        .trim();
    }
  }

  // Clean query body by removing filler words
  const sanitizedQuery = queryBody
    .replace(/[?,.!:;]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Score all targets
  const scoredTargets: { target: NavTarget; score: number }[] = [];

  for (const target of ALL_NAV_TARGETS) {
    let score = 0;

    const lowerId = target.id.toLowerCase();
    const lowerTitle = target.title.toLowerCase();
    const lowerThaiTitle = target.thaiTitle.toLowerCase();

    // Exact matches
    if (sanitizedQuery === lowerId || sanitizedQuery === lowerTitle) {
      score += 100;
    } else if (sanitizedQuery === lowerThaiTitle) {
      score += 95;
    }

    // Keyword matches
    for (const kw of target.keywords) {
      const lowerKw = kw.toLowerCase();
      if (sanitizedQuery === lowerKw) {
        score += 85;
      } else if (sanitizedQuery.startsWith(lowerKw) || sanitizedQuery.endsWith(lowerKw)) {
        score += 65;
      } else if (sanitizedQuery.includes(lowerKw)) {
        score += 45;
      } else if (lowerKw.includes(sanitizedQuery) && sanitizedQuery.length >= 2) {
        score += 35;
      }
    }

    // Partial word overlap
    const queryTokens = sanitizedQuery.split(" ").filter(t => t.length > 0);
    for (const token of queryTokens) {
      if (token.length < 2) continue;
      if (lowerId.includes(token)) score += 20;
      if (lowerTitle.includes(token)) score += 20;
      if (lowerThaiTitle.includes(token)) score += 20;
      if (target.hubCategory.toLowerCase().includes(token)) score += 15;
    }

    if (score > 0) {
      scoredTargets.push({ target, score });
    }
  }

  // Sort by score descending
  scoredTargets.sort((a, b) => b.score - a.score);

  if (scoredTargets.length === 0) {
    return {
      isNavIntent: isNav,
      intentVerb: detectedVerb,
      cleanedQuery: sanitizedQuery,
      bestTarget: null,
      confidence: 0,
      suggestions: ALL_NAV_TARGETS.slice(0, 4), // Default popular tools
      routeReason: `No exact matching tool found for query: "${sanitizedQuery}"`,
      thaiRouteReason: `ไม่พบเครื่องมือที่ตรงกับคำค้นหา: "${sanitizedQuery}"`
    };
  }

  const topMatch = scoredTargets[0];
  const maxScore = 100;
  const confidence = Math.min(1, topMatch.score / maxScore);

  // Collect other close suggestions (top 4 distinct)
  const suggestions = scoredTargets
    .slice(1, 5)
    .map(s => s.target);

  return {
    isNavIntent: isNav || confidence >= 0.35,
    intentVerb: detectedVerb || "go",
    cleanedQuery: sanitizedQuery,
    bestTarget: topMatch.target,
    confidence,
    suggestions,
    routeReason: `Identified destination: ${topMatch.target.title} (${topMatch.target.id}) with ${(confidence * 100).toFixed(0)}% match confidence.`,
    thaiRouteReason: `ระบุปลายทาง: ${topMatch.target.thaiTitle} (${topMatch.target.title}) ความแม่นยำ ${(confidence * 100).toFixed(0)}%`
  };
}

/**
 * Execute tool navigation event
 */
export function navigateToTool(toolId: string) {
  if (typeof window !== "undefined") {
    // Fire global engine switch tool event
    const event = new CustomEvent("switch-tool", { detail: toolId });
    window.dispatchEvent(event);
    localStorage.setItem("omni_activeTool", toolId);
  }
}

// Convenient Export Aliases for AI Chat Integration
export const parseNavIntent = parseNavigationIntent;
export const executeOfflineNavigation = navigateToTool;

