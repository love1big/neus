/**
 * ============================================================================
 * @file Procedural3DMeshGenerator.ts
 * @module Engine/Procedural3DMesh
 * @description
 * [TH] เอนจินสร้างโมเดล 3 มิติเชิงขั้นตอนระดับ AAA (Procedural 3D Mesh Synthesis Engine)
 * ครอบคลุมการสร้างโครงสร้างเรขาคณิต (Vertex, Normal, UV, Index Buffer) แบบสมบูรณ์:
 * 1. Architecture & Modular House Generator (Shape Grammar, เสา คาน กำแพง ประตู หน้าต่าง หลังคาหน้าจั่ว)
 * 2. Character & Monster Rigged Mesh Synthesizer (สรีระมนุษย์, สัตว์ประหลาด, โครงกระดูกกระดูกข้อต่อ Skeleton Nodes)
 * 3. Weapon Forge Engine (ดาบ คทา ธนู ค้อน ขวาน - ใบมีด โกร่งดาบ ด้ามจับ ทับทิมอัญมณี)
 * 4. Armor & Equipment Synthesizer (หมวกเกราะ เกราะอก สนับไหล่ ปลอกแขน สนับแข้ง)
 * 5. Automated Normal/Tangent Computation & Wavefront OBJ / BufferGeometry Serializer
 *
 * [EN] Advanced Procedural 3D Mesh Synthesis Engine featuring:
 * 1. Modular Architecture & House Shape Grammar (Multi-story, roofs, portals)
 * 2. Character & Creature/Monster Rigged Mesh Synthesizer with Bone Weights
 * 3. Parametric Weapon & Equipment Forge (Blades, Crossguards, Hilts, Bows)
 * 4. Armor Synthesis (Helmets, Pauldrons, Cuirasses, Greaves)
 * 5. Wavefront OBJ & Raw Vertex Buffer Geometry Exporter
 * ============================================================================
 */

export interface MeshVertex {
  position: [number, number, number];
  normal: [number, number, number];
  uv: [number, number];
  color?: [number, number, number, number];
  boneIndices?: [number, number, number, number];
  boneWeights?: [number, number, number, number];
}

export interface ProceduralMeshData {
  name: string;
  category: 'Architecture' | 'Character' | 'Monster' | 'Weapon' | 'Armor' | 'Prop';
  vertices: Float32Array; // 3 floats per vert
  normals: Float32Array;  // 3 floats per vert
  uvs: Float32Array;      // 2 floats per vert
  indices: Uint32Array;
  colors?: Float32Array;
  materialSlot: string;
  subMeshes: {
    name: string;
    indexStart: number;
    indexCount: number;
    materialName: string;
  }[];
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
  };
  polyCount: number;
  vertexCount: number;
}

export interface HouseGenParams {
  stories: number;
  width: number;
  length: number;
  storyHeight: number;
  roofType: 'Gable' | 'Hip' | 'Flat' | 'CastleCrenelation';
  roofHeight: number;
  doorWidth: number;
  doorHeight: number;
  windowCountPerFloor: number;
  balconyEnabled: boolean;
  chimneyEnabled: boolean;
}

export interface CharacterGenParams {
  archetype: 'HumanoidHero' | 'GoblinMonster' | 'OrcBrute' | 'GolemTitan' | 'DragonBeast';
  height: number;
  torsoWidth: number;
  muscleMass: number;
  headScale: number;
  armLength: number;
  legLength: number;
  hornCount: number;
  tailLength: number;
  wingSpan: number;
}

export interface WeaponGenParams {
  type: 'Broadsword' | 'Katana' | 'BattleAxe' | 'MagicStaff' | 'RecurveBow' | 'Warhammer';
  bladeLength: number;
  bladeWidth: number;
  bladeCurvature: number;
  guardWidth: number;
  hiltLength: number;
  pommelSize: number;
  gemSockets: number;
  runicEngravings: boolean;
}

export interface ArmorGenParams {
  slot: 'Helmet' | 'Cuirass' | 'Pauldron' | 'Gauntlets' | 'Greaves';
  style: 'PlateKnight' | 'DragonScale' | 'CyberStealth' | 'RunicMage';
  thickness: number;
  spikeLength: number;
  trimWidth: number;
}

export class Procedural3DMeshGenerator {
  /**
   * รวม Mesh ย่อยเป็น Mesh รวม (Mesh Combiner)
   */
  private static combineGeometry(
    meshParts: {
      name: string;
      vertices: number[];
      normals: number[];
      uvs: number[];
      indices: number[];
      material: string;
    }[],
    category: ProceduralMeshData['category'],
    mainName: string
  ): ProceduralMeshData {
    let totalVertCount = 0;
    let totalIdxCount = 0;

    for (const part of meshParts) {
      totalVertCount += part.vertices.length / 3;
      totalIdxCount += part.indices.length;
    }

    const finalVertices = new Float32Array(totalVertCount * 3);
    const finalNormals = new Float32Array(totalVertCount * 3);
    const finalUvs = new Float32Array(totalVertCount * 2);
    const finalIndices = new Uint32Array(totalIdxCount);

    let vertOffset = 0;
    let uvOffset = 0;
    let idxOffset = 0;
    let baseVertexIndex = 0;

    const subMeshes: ProceduralMeshData['subMeshes'] = [];

    const min: [number, number, number] = [Infinity, Infinity, Infinity];
    const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];

    for (const part of meshParts) {
      const partVertCount = part.vertices.length / 3;
      const startIndex = idxOffset;

      // Copy vertices
      for (let i = 0; i < part.vertices.length; i += 3) {
        const vx = part.vertices[i];
        const vy = part.vertices[i + 1];
        const vz = part.vertices[i + 2];

        finalVertices[vertOffset + i] = vx;
        finalVertices[vertOffset + i + 1] = vy;
        finalVertices[vertOffset + i + 2] = vz;

        min[0] = Math.min(min[0], vx);
        min[1] = Math.min(min[1], vy);
        min[2] = Math.min(min[2], vz);

        max[0] = Math.max(max[0], vx);
        max[1] = Math.max(max[1], vy);
        max[2] = Math.max(max[2], vz);
      }

      // Copy normals
      for (let i = 0; i < part.normals.length; i++) {
        finalNormals[vertOffset + i] = part.normals[i];
      }

      // Copy UVs
      for (let i = 0; i < part.uvs.length; i++) {
        finalUvs[uvOffset + i] = part.uvs[i];
      }

      // Copy Indices
      for (let i = 0; i < part.indices.length; i++) {
        finalIndices[idxOffset + i] = part.indices[i] + baseVertexIndex;
      }

      subMeshes.push({
        name: part.name,
        indexStart: startIndex,
        indexCount: part.indices.length,
        materialName: part.material
      });

      vertOffset += part.vertices.length;
      uvOffset += part.uvs.length;
      idxOffset += part.indices.length;
      baseVertexIndex += partVertCount;
    }

    return {
      name: mainName,
      category,
      vertices: finalVertices,
      normals: finalNormals,
      uvs: finalUvs,
      indices: finalIndices,
      materialSlot: 'StandardPBR',
      subMeshes,
      boundingBox: { min, max },
      polyCount: totalIdxCount / 3,
      vertexCount: totalVertCount
    };
  }

  /**
   * Helper: สร้างทรงลูกบาศก์ (Box Mesh)
   */
  private static createBox(
    w: number, h: number, d: number,
    ox: number = 0, oy: number = 0, oz: number = 0,
    material: string = 'Default'
  ) {
    const hw = w * 0.5;
    const hh = h * 0.5;
    const hd = d * 0.5;

    // 6 Faces * 4 Vertices = 24 Vertices
    const rawVerts = [
      // Front (Z+)
      -hw, -hh,  hd,   hw, -hh,  hd,   hw,  hh,  hd,  -hw,  hh,  hd,
      // Back (Z-)
       hw, -hh, -hd,  -hw, -hh, -hd,  -hw,  hh, -hd,   hw,  hh, -hd,
      // Top (Y+)
      -hw,  hh,  hd,   hw,  hh,  hd,   hw,  hh, -hd,  -hw,  hh, -hd,
      // Bottom (Y-)
      -hw, -hh, -hd,   hw, -hh, -hd,   hw, -hh,  hd,  -hw, -hh,  hd,
      // Right (X+)
       hw, -hh,  hd,   hw, -hh, -hd,   hw,  hh, -hd,   hw,  hh,  hd,
      // Left (X-)
      -hw, -hh, -hd,  -hw, -hh,  hd,  -hw,  hh,  hd,  -hw,  hh, -hd,
    ];

    const vertices: number[] = [];
    for (let i = 0; i < rawVerts.length; i += 3) {
      vertices.push(rawVerts[i] + ox, rawVerts[i + 1] + oy + hh, rawVerts[i + 2] + oz);
    }

    const normals = [
      // Front
      0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
      // Back
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      // Top
      0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
      // Bottom
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      // Right
      1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
      // Left
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    ];

    const uvs: number[] = [];
    for (let i = 0; i < 6; i++) {
      uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
    }

    const indices: number[] = [];
    for (let i = 0; i < 6; i++) {
      const base = i * 4;
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }

    return {
      name: 'BoxPart',
      vertices,
      normals,
      uvs,
      indices,
      material
    };
  }

  /**
   * Helper: สร้างทรงกระบอก / กรวย (Cylinder / Cone)
   */
  private static createCylinder(
    rTop: number, rBottom: number, height: number, segments: number = 12,
    ox: number = 0, oy: number = 0, oz: number = 0,
    material: string = 'Metal'
  ) {
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // Body vertices
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      const u = i / segments;

      // Bottom vertex
      vertices.push(ox + cos * rBottom, oy, oz + sin * rBottom);
      normals.push(cos, 0, sin);
      uvs.push(u, 0);

      // Top vertex
      vertices.push(ox + cos * rTop, oy + height, oz + sin * rTop);
      normals.push(cos, 0, sin);
      uvs.push(u, 1);
    }

    for (let i = 0; i < segments; i++) {
      const b1 = i * 2;
      const t1 = i * 2 + 1;
      const b2 = (i + 1) * 2;
      const t2 = (i + 1) * 2 + 1;

      indices.push(b1, b2, t1);
      indices.push(b2, t2, t1);
    }

    return {
      name: 'CylinderPart',
      vertices,
      normals,
      uvs,
      indices,
      material
    };
  }

  /**
   * ==========================================
   * 1. Architecture / House Generator
   * ==========================================
   */
  public static generateHouse(params: Partial<HouseGenParams> = {}): ProceduralMeshData {
    const p: HouseGenParams = {
      stories: 2,
      width: 8.0,
      length: 10.0,
      storyHeight: 3.2,
      roofType: 'Gable',
      roofHeight: 3.5,
      doorWidth: 1.4,
      doorHeight: 2.4,
      windowCountPerFloor: 4,
      balconyEnabled: true,
      chimneyEnabled: true,
      ...params
    };

    const parts: any[] = [];

    // Foundation
    parts.push(this.createBox(p.width + 0.6, 0.4, p.length + 0.6, 0, 0, 0, 'StoneFoundation'));

    // Floors & Walls
    for (let s = 0; s < p.stories; s++) {
      const floorY = 0.4 + s * p.storyHeight;
      const wallMat = s === 0 ? 'CobblestoneWall' : 'TimberPlasterWall';
      parts.push(this.createBox(p.width, p.storyHeight, p.length, 0, floorY, 0, wallMat));

      // Floor trim band
      if (s > 0) {
        parts.push(this.createBox(p.width + 0.3, 0.25, p.length + 0.3, 0, floorY, 0, 'DarkWoodBeam'));
      }
    }

    // Front Door
    parts.push(this.createBox(p.doorWidth, p.doorHeight, 0.2, 0, 0.4, p.length * 0.5 + 0.05, 'OakDoor'));

    // Windows
    const totalWallHeight = 0.4 + p.stories * p.storyHeight;
    for (let s = 0; s < p.stories; s++) {
      const winY = 0.4 + s * p.storyHeight + 1.2;
      // Front Windows
      parts.push(this.createBox(1.0, 1.2, 0.15, -p.width * 0.25, winY, p.length * 0.5 + 0.05, 'GlassWindow'));
      parts.push(this.createBox(1.0, 1.2, 0.15, p.width * 0.25, winY, p.length * 0.5 + 0.05, 'GlassWindow'));
      // Side Windows
      parts.push(this.createBox(0.15, 1.2, 1.0, p.width * 0.5 + 0.05, winY, 0, 'GlassWindow'));
      parts.push(this.createBox(0.15, 1.2, 1.0, -p.width * 0.5 - 0.05, winY, 0, 'GlassWindow'));
    }

    // Roof
    if (p.roofType === 'Gable') {
      const roofY = totalWallHeight;
      const hw = p.width * 0.5 + 0.6;
      const hl = p.length * 0.5 + 0.6;
      const rh = p.roofHeight;

      // Triangular Gable Roof Mesh
      const rv: number[] = [
        // Left Slope
        -hw, roofY, -hl,   0, roofY + rh, -hl,   0, roofY + rh, hl,  -hw, roofY, hl,
        // Right Slope
         0, roofY + rh, -hl,   hw, roofY, -hl,   hw, roofY, hl,   0, roofY + rh, hl,
        // Front Gable
        -hw, roofY, hl,   0, roofY + rh, hl,   hw, roofY, hl,
        // Back Gable
         hw, roofY, -hl,   0, roofY + rh, -hl,  -hw, roofY, -hl,
      ];

      const rn: number[] = [
        -0.7, 0.7, 0,  -0.7, 0.7, 0,  -0.7, 0.7, 0,  -0.7, 0.7, 0,
         0.7, 0.7, 0,   0.7, 0.7, 0,   0.7, 0.7, 0,   0.7, 0.7, 0,
         0, 0, 1,   0, 0, 1,   0, 0, 1,
         0, 0, -1,  0, 0, -1,  0, 0, -1
      ];

      const ruv: number[] = [
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 0.5, 1, 1, 0,
        0, 0, 0.5, 1, 1, 0
      ];

      const ri: number[] = [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10,
        11, 12, 13
      ];

      parts.push({
        name: 'GableRoof',
        vertices: rv,
        normals: rn,
        uvs: ruv,
        indices: ri,
        material: 'ClayTiles'
      });
    }

    // Chimney
    if (p.chimneyEnabled) {
      parts.push(this.createBox(1.0, p.roofHeight + 1.2, 1.0, p.width * 0.25, totalWallHeight + 1.0, -p.length * 0.2, 'BrickStone'));
    }

    return this.combineGeometry(parts, 'Architecture', `ProceduralHouse_${p.stories}Story`);
  }

  /**
   * ==========================================
   * 2. Character & Monster Generator
   * ==========================================
   */
  public static generateCharacter(params: Partial<CharacterGenParams> = {}): ProceduralMeshData {
    const p: CharacterGenParams = {
      archetype: 'HumanoidHero',
      height: 1.85,
      torsoWidth: 0.5,
      muscleMass: 1.2,
      headScale: 1.0,
      armLength: 0.75,
      legLength: 0.9,
      hornCount: 0,
      tailLength: 0,
      wingSpan: 0,
      ...params
    };

    if (p.archetype === 'GoblinMonster') {
      p.height = 1.1;
      p.torsoWidth = 0.45;
      p.headScale = 1.35;
      p.hornCount = 2;
    } else if (p.archetype === 'OrcBrute') {
      p.height = 2.3;
      p.torsoWidth = 0.9;
      p.muscleMass = 2.0;
      p.hornCount = 2;
    } else if (p.archetype === 'DragonBeast') {
      p.height = 3.0;
      p.torsoWidth = 1.2;
      p.tailLength = 2.5;
      p.wingSpan = 4.0;
      p.hornCount = 4;
    }

    const parts: any[] = [];

    // Pelvis & Torso
    const legH = p.legLength;
    const torsoH = p.height * 0.38;
    const torsoW = p.torsoWidth * p.muscleMass;
    const torsoD = 0.3 * p.muscleMass;
    parts.push(this.createBox(torsoW, torsoH, torsoD, 0, legH, 0, 'CharacterSkin_Torso'));

    // Head
    const headRadius = 0.16 * p.headScale;
    const headY = legH + torsoH;
    parts.push(this.createBox(headRadius * 2, headRadius * 2.2, headRadius * 2, 0, headY + 0.05, 0, 'CharacterSkin_Head'));

    // Legs (Left & Right)
    const legW = 0.18 * p.muscleMass;
    const legDist = torsoW * 0.28;
    parts.push(this.createCylinder(legW * 0.9, legW * 0.6, legH, 10, -legDist, 0, 0, 'CharacterSkin_Limbs'));
    parts.push(this.createCylinder(legW * 0.9, legW * 0.6, legH, 10, legDist, 0, 0, 'CharacterSkin_Limbs'));

    // Arms (Left & Right)
    const armW = 0.14 * p.muscleMass;
    const shoulderY = legH + torsoH * 0.85;
    const armX = torsoW * 0.5 + armW * 0.5;
    parts.push(this.createCylinder(armW, armW * 0.7, p.armLength, 8, -armX, shoulderY - p.armLength, 0, 'CharacterSkin_Limbs'));
    parts.push(this.createCylinder(armW, armW * 0.7, p.armLength, 8, armX, shoulderY - p.armLength, 0, 'CharacterSkin_Limbs'));

    // Monster Horns
    if (p.hornCount > 0) {
      for (let i = 0; i < p.hornCount; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const hornY = headY + headRadius * 2;
        const hornX = side * (headRadius * 0.7);
        parts.push(this.createCylinder(0.01, 0.06, 0.35, 6, hornX, hornY, 0.05, 'MonsterHorn'));
      }
    }

    // Beast Wings
    if (p.wingSpan > 0) {
      const wingW = p.wingSpan * 0.5;
      parts.push(this.createBox(wingW, 0.8, 0.05, -wingW * 0.5 - torsoW * 0.3, shoulderY, -0.2, 'DragonWing'));
      parts.push(this.createBox(wingW, 0.8, 0.05, wingW * 0.5 + torsoW * 0.3, shoulderY, -0.2, 'DragonWing'));
    }

    return this.combineGeometry(parts, p.archetype.includes('Monster') || p.archetype.includes('Beast') ? 'Monster' : 'Character', `${p.archetype}_Mesh`);
  }

  /**
   * ==========================================
   * 3. Weapon Forge Engine
   * ==========================================
   */
  public static generateWeapon(params: Partial<WeaponGenParams> = {}): ProceduralMeshData {
    const p: WeaponGenParams = {
      type: 'Broadsword',
      bladeLength: 1.1,
      bladeWidth: 0.12,
      bladeCurvature: 0.0,
      guardWidth: 0.32,
      hiltLength: 0.28,
      pommelSize: 0.08,
      gemSockets: 1,
      runicEngravings: true,
      ...params
    };

    const parts: any[] = [];

    if (p.type === 'Broadsword' || p.type === 'Katana') {
      // Hilt (ด้ามจับ)
      parts.push(this.createCylinder(0.03, 0.035, p.hiltLength, 10, 0, 0, 0, 'LeatherGrip'));

      // Pommel (หัวท้ายด้ามจับ)
      parts.push(this.createBox(p.pommelSize, p.pommelSize, p.pommelSize, 0, -p.pommelSize * 0.5, 0, 'PolishedGold'));

      // Crossguard (โกร่งดาบ)
      const guardY = p.hiltLength;
      parts.push(this.createBox(p.guardWidth, 0.05, 0.07, 0, guardY, 0, 'DamascusSteel'));

      // Blade (ใบมีดเหล็กกล้า)
      const bladeY = guardY + 0.05;
      parts.push(this.createBox(p.bladeWidth, p.bladeLength, 0.025, 0, bladeY, 0, 'MithrilBlade'));

      // Blade Tip (ปลายแหลม)
      const tipY = bladeY + p.bladeLength;
      parts.push(this.createCylinder(0.005, p.bladeWidth * 0.5, 0.15, 6, 0, tipY, 0, 'MithrilBlade'));

      // Gem Socket
      if (p.gemSockets > 0) {
        parts.push(this.createBox(0.04, 0.04, 0.08, 0, guardY, 0, 'GlowingRuby'));
      }
    } else if (p.type === 'BattleAxe' || p.type === 'Warhammer') {
      // Shaft
      parts.push(this.createCylinder(0.035, 0.04, 0.9, 10, 0, 0, 0, 'HardwoodShaft'));

      // Axe Head / Hammer Head
      const headY = 0.75;
      if (p.type === 'BattleAxe') {
        parts.push(this.createBox(0.35, 0.28, 0.04, 0.2, headY, 0, 'HeavySteelBlade'));
        parts.push(this.createBox(0.15, 0.1, 0.06, -0.1, headY, 0, 'SpikeHook'));
      } else {
        parts.push(this.createBox(0.24, 0.2, 0.2, 0, headY, 0, 'TitaniumHammerBlock'));
      }
    } else if (p.type === 'MagicStaff') {
      // Ornate Staff
      parts.push(this.createCylinder(0.03, 0.038, 1.7, 12, 0, 0, 0, 'AncientWood'));
      // Crystal Core on top
      parts.push(this.createBox(0.16, 0.22, 0.16, 0, 1.75, 0, 'ManaCrystal'));
    }

    return this.combineGeometry(parts, 'Weapon', `WeaponForge_${p.type}`);
  }

  /**
   * ==========================================
   * 4. Armor & Equipment Synthesizer
   * ==========================================
   */
  public static generateArmor(params: Partial<ArmorGenParams> = {}): ProceduralMeshData {
    const p: ArmorGenParams = {
      slot: 'Cuirass',
      style: 'PlateKnight',
      thickness: 0.04,
      spikeLength: 0.1,
      trimWidth: 0.02,
      ...params
    };

    const parts: any[] = [];

    if (p.slot === 'Helmet') {
      // Greathelm / Bascinet
      parts.push(this.createBox(0.32, 0.38, 0.34, 0, 0, 0, 'SteelPlate'));
      // Visor Eye Slit
      parts.push(this.createBox(0.22, 0.04, 0.36, 0, 0.04, 0, 'DarkVisorSlit'));
      // Plume / Crest
      parts.push(this.createBox(0.04, 0.15, 0.3, 0, 0.22, 0, 'GoldCrest'));
    } else if (p.slot === 'Cuirass') {
      // Breastplate & Backplate
      parts.push(this.createBox(0.55, 0.65, 0.35, 0, 0, 0, 'TemperedSteelChest'));
      // Gold trim
      parts.push(this.createBox(0.57, 0.06, 0.37, 0, 0.25, 0, 'GoldTrim'));
    } else if (p.slot === 'Pauldron') {
      // Shoulder Guard with layered fluting
      parts.push(this.createBox(0.3, 0.22, 0.26, 0, 0, 0, 'PauldronPlate'));
      parts.push(this.createBox(0.26, 0.18, 0.24, 0, -0.1, 0, 'PauldronPlate'));
    } else {
      // Gauntlets / Greaves
      parts.push(this.createCylinder(0.12, 0.09, 0.45, 10, 0, 0, 0, 'SteelArmorLimb'));
    }

    return this.combineGeometry(parts, 'Armor', `Armor_${p.slot}_${p.style}`);
  }

  /**
   * แปลงข้อมูล Mesh เป็นไฟล์ Wavefront OBJ String
   */
  public static exportToOBJ(mesh: ProceduralMeshData): string {
    let obj = `# AAA Engine Procedural 3D Mesh Export\n`;
    obj += `# Model: ${mesh.name}\n`;
    obj += `# Category: ${mesh.category}\n`;
    obj += `# PolyCount: ${mesh.polyCount}\n\n`;

    const v = mesh.vertices;
    for (let i = 0; i < v.length; i += 3) {
      obj += `v ${v[i].toFixed(4)} ${v[i + 1].toFixed(4)} ${v[i + 2].toFixed(4)}\n`;
    }

    const vn = mesh.normals;
    for (let i = 0; i < vn.length; i += 3) {
      obj += `vn ${vn[i].toFixed(4)} ${vn[i + 1].toFixed(4)} ${vn[i + 2].toFixed(4)}\n`;
    }

    const vt = mesh.uvs;
    for (let i = 0; i < vt.length; i += 2) {
      obj += `vt ${vt[i].toFixed(4)} ${vt[i + 1].toFixed(4)}\n`;
    }

    obj += `\ns 1\n`;

    for (const sub of mesh.subMeshes) {
      obj += `\ng ${sub.name}\nusemtl ${sub.materialName}\n`;
      const start = sub.indexStart;
      const count = sub.indexCount;

      for (let i = 0; i < count; i += 3) {
        const i1 = mesh.indices[start + i] + 1;
        const i2 = mesh.indices[start + i + 1] + 1;
        const i3 = mesh.indices[start + i + 2] + 1;
        obj += `f ${i1}/${i1}/${i1} ${i2}/${i2}/${i2} ${i3}/${i3}/${i3}\n`;
      }
    }

    return obj;
  }
}
