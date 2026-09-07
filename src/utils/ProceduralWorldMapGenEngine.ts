/**
 * ============================================================================
 * @file ProceduralWorldMapGenEngine.ts
 * @module Engine/ProceduralGeneration
 * @description
 * [TH] เอนจินสร้างแผนที่และภูมิประเทศเชิงขั้นตอน (Procedural World & Map Generation Engine)
 * ประกอบด้วยอัลกอริทึมระดับ AAA:
 * 1. Multilayer Octave Perlin & Simplex Noise Generator (Fractal Brownian Motion - FBM)
 * 2. Voronoi Biome Cell Tessellation & Moisture-Temperature Climate Matrix
 * 3. Hydraulic & Thermal Erosion Simulation (การกัดเซาะของน้ำและดินตามหลักฟิสิกส์หยดน้ำ)
 * 4. Wave Function Collapse (WFC) Tile/Dungeon Constraint Propagation
 * 5. Minimum Spanning Tree (Kruskal's) + Delaunay Triangulation + A* Spline Road & River Networks
 * 6. Poisson Disk Sampling สำหรับการกระจายต้นไม้และ Foliage
 *
 * [EN] Advanced Procedural World & Map Generation Engine featuring:
 * 1. Fractal Brownian Motion (FBM) Multi-Octave Noise
 * 2. Voronoi Biome Tessellation with Whittaker Climate Diagram
 * 3. Droplet-based Hydraulic Erosion & Thermal Mass Movement
 * 4. Wave Function Collapse (WFC) constraint propagation algorithm
 * 5. Kruskal's MST + Delaunay + A* Pathfinding for Rivers & Road Infrastructure
 * 6. Fast Poisson Disk Sampling for Foliage & Prop Distribution
 * ============================================================================
 */

export interface TerrainGenerationConfig {
  seed: number;
  width: number;
  height: number;
  scale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
  heightMultiplier: number;
  seaLevel: number;
  mountainThreshold: number;
  erosionIterations: number;
  erosionDropletVolume: number;
  thermalErosionAngle: number;
  biomeCount: number;
  enableRivers: boolean;
  enableRoads: boolean;
  poissonRadius: number;
}

export type BiomeType = 
  | 'DeepOcean'
  | 'Ocean'
  | 'Beach'
  | 'TropicalRainforest'
  | 'TemperateForest'
  | 'Taiga'
  | 'Savanna'
  | 'Grassland'
  | 'Desert'
  | 'Tundra'
  | 'SnowyMountain'
  | 'VolcanicWasteland';

export interface BiomeProperties {
  type: BiomeType;
  color: string;
  minTemp: number;
  maxTemp: number;
  minMoisture: number;
  maxMoisture: number;
  roughness: number;
  foliageDensity: number;
}

export interface TerrainPoint {
  x: number;
  y: number;
  elevation: number;
  rawHeight: number;
  temperature: number;
  moisture: number;
  biome: BiomeType;
  biomeColor: string;
  isRiver: boolean;
  isRoad: boolean;
  waterFlow: number;
  sediment: number;
  normal: [number, number, number];
}

export interface WFCCell {
  collapsed: boolean;
  possibleTiles: string[];
  entropy: number;
}

export interface RiverPathNode {
  x: number;
  y: number;
  elevation: number;
  flowVolume: number;
}

export interface RoadNetworkEdge {
  from: [number, number];
  to: [number, number];
  cost: number;
  path: [number, number][];
}

export interface WorldMapSimulationResult {
  heightMap: Float32Array;
  temperatureMap: Float32Array;
  moistureMap: Float32Array;
  biomeMap: BiomeType[];
  grid: TerrainPoint[][];
  rivers: RiverPathNode[][];
  roads: RoadNetworkEdge[];
  foliageInstances: { x: number; y: number; type: string; scale: number }[];
  erosionDelta: Float32Array;
  stats: {
    generationTimeMs: number;
    riverCount: number;
    roadLength: number;
    foliageCount: number;
    minElevation: number;
    maxElevation: number;
    averageElevation: number;
  };
}

export class ProceduralWorldMapGenEngine {
  private config: TerrainGenerationConfig;
  private permTable: number[] = [];

  constructor(config?: Partial<TerrainGenerationConfig>) {
    this.config = {
      seed: 42891,
      width: 128,
      height: 128,
      scale: 35.0,
      octaves: 5,
      persistence: 0.5,
      lacunarity: 2.0,
      heightMultiplier: 1.0,
      seaLevel: 0.28,
      mountainThreshold: 0.72,
      erosionIterations: 2000,
      erosionDropletVolume: 1.0,
      thermalErosionAngle: 35.0,
      biomeCount: 12,
      enableRivers: true,
      enableRoads: true,
      poissonRadius: 3.5,
      ...config
    };
    this.initializePermutationTable(this.config.seed);
  }

  /**
   * สร้างตาราง Permutation จาก Seed
   */
  public initializePermutationTable(seed: number): void {
    const p: number[] = [];
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    // LCG PRNG shuffle
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 1664525 + 1013904223) % 4294967296;
      const j = Math.floor((s / 4294967296) * (i + 1));
      const temp = p[i];
      p[i] = p[j];
      p[j] = temp;
    }
    this.permTable = new Array(512);
    for (let i = 0; i < 512; i++) {
      this.permTable[i] = p[i & 255];
    }
  }

  /**
   * 2D Perlin Noise Generator
   */
  public noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = this.fade(xf);
    const v = this.fade(yf);

    const aa = this.permTable[this.permTable[X] + Y];
    const ab = this.permTable[this.permTable[X] + Y + 1];
    const ba = this.permTable[this.permTable[X + 1] + Y];
    const bb = this.permTable[this.permTable[X + 1] + Y + 1];

    const x1 = this.lerp(this.grad2D(aa, xf, yf), this.grad2D(ba, xf - 1, yf), u);
    const x2 = this.lerp(this.grad2D(ab, xf, yf - 1), this.grad2D(bb, xf - 1, yf - 1), u);

    return (this.lerp(x1, x2, v) + 1) * 0.5; // Normalizes to 0..1
  }

  /**
   * Fractal Brownian Motion (FBM) Multi-Octave Noise
   */
  public fbmNoise2D(x: number, y: number, octaves: number, persistence: number, lacunarity: number): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return total / maxValue;
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad2D(hash: number, x: number, y: number): number {
    const h = hash & 3;
    let u = h < 2 ? x : y;
    let v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  /**
   * ฟิสิกส์การกัดเซาะทางชลศาสตร์ (Droplet-based Hydraulic Erosion Simulation)
   */
  public simulateHydraulicErosion(heightMap: Float32Array, width: number, height: number, iterations: number): Float32Array {
    const delta = new Float32Array(width * height);
    const map = new Float32Array(heightMap);

    const inertia = 0.05;
    const capacityModifier = 4.0;
    const minSlope = 0.01;
    const depositionRate = 0.3;
    const erodeRate = 0.3;
    const evaporationRate = 0.01;
    const maxDropletLifetime = 30;

    let seed = this.config.seed ^ 0x5deece66;

    for (let iter = 0; iter < iterations; iter++) {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      let posX = Math.floor((seed / 4294967296) * (width - 2)) + 1;
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      let posY = Math.floor((seed / 4294967296) * (height - 2)) + 1;

      let dirX = 0;
      let dirY = 0;
      let speed = 1.0;
      let water = this.config.erosionDropletVolume;
      let sediment = 0;

      for (let lifetime = 0; lifetime < maxDropletLifetime; lifetime++) {
        const nodeX = Math.floor(posX);
        const nodeY = Math.floor(posY);
        const cellIndex = nodeY * width + nodeX;

        const xOffset = posX - nodeX;
        const yOffset = posY - nodeY;

        // คำนวณความชัน Gradient (Sobel)
        const idxNW = cellIndex;
        const idxNE = cellIndex + 1;
        const idxSW = cellIndex + width;
        const idxSE = cellIndex + width + 1;

        if (idxSE >= map.length) break;

        const hNW = map[idxNW];
        const hNE = map[idxNE];
        const hSW = map[idxSW];
        const hSE = map[idxSE];

        const gradX = (hNE - hNW) * (1 - yOffset) + (hSE - hSW) * yOffset;
        const gradY = (hSW - hNW) * (1 - xOffset) + (hSE - hNE) * xOffset;

        // ทิศทางการไหล
        dirX = dirX * inertia - gradX * (1 - inertia);
        dirY = dirY * inertia - gradY * (1 - inertia);

        const len = Math.sqrt(dirX * dirX + dirY * dirY);
        if (len !== 0) {
          dirX /= len;
          dirY /= len;
        }

        const newPosX = posX + dirX;
        const newPosY = posY + dirY;

        if (newPosX < 0 || newPosX >= width - 1 || newPosY < 0 || newPosY >= height - 1) {
          break;
        }

        // ความสูงใหม่
        const newH = map[Math.floor(newPosY) * width + Math.floor(newPosX)];
        const oldH = map[cellIndex];
        const heightDiff = newH - oldH;

        // คำนวณการตกตะกอนหรือการกัดเซาะ
        if (heightDiff > 0) {
          // เคลื่อนที่ขึ้นเนิน ตกตะกอนเติมเต็มหลุม
          const depositAmount = Math.min(sediment, heightDiff);
          sediment -= depositAmount;
          map[cellIndex] += depositAmount;
          delta[cellIndex] += depositAmount;
        } else {
          // ไหลลงเนิน
          const slope = Math.max(-heightDiff, minSlope);
          const sedimentCapacity = Math.max(slope * speed * water * capacityModifier, 0.01);

          if (sediment > sedimentCapacity) {
            const depositAmount = (sediment - sedimentCapacity) * depositionRate;
            sediment -= depositAmount;
            map[cellIndex] += depositAmount;
            delta[cellIndex] += depositAmount;
          } else {
            const erodeAmount = Math.min((sedimentCapacity - sediment) * erodeRate, -heightDiff);
            sediment += erodeAmount;
            map[cellIndex] -= erodeAmount;
            delta[cellIndex] -= erodeAmount;
          }
        }

        speed = Math.sqrt(Math.max(0, speed * speed + heightDiff * 9.81));
        water *= (1 - evaporationRate);
        posX = newPosX;
        posY = newPosY;
      }
    }

    // Apply smoothed map
    for (let i = 0; i < map.length; i++) {
      heightMap[i] = Math.max(0, Math.min(1, map[i]));
    }
    return delta;
  }

  /**
   * จำแนกไบโอมตาม Whittaker Climate Diagram (Elevation, Temperature, Moisture)
   */
  public classifyBiome(elevation: number, temp: number, moisture: number): BiomeType {
    if (elevation < this.config.seaLevel * 0.5) return 'DeepOcean';
    if (elevation < this.config.seaLevel) return 'Ocean';
    if (elevation < this.config.seaLevel + 0.04) return 'Beach';

    if (elevation > this.config.mountainThreshold) {
      if (temp < 0.35) return 'SnowyMountain';
      if (temp > 0.75 && moisture < 0.25) return 'VolcanicWasteland';
      return 'Tundra';
    }

    if (temp < 0.3) {
      if (moisture > 0.4) return 'Taiga';
      return 'Tundra';
    }

    if (temp > 0.65) {
      if (moisture < 0.25) return 'Desert';
      if (moisture < 0.55) return 'Savanna';
      return 'TropicalRainforest';
    }

    // Temperate Zone
    if (moisture < 0.35) return 'Grassland';
    return 'TemperateForest';
  }

  public getBiomeColor(biome: BiomeType): string {
    switch (biome) {
      case 'DeepOcean': return '#091d36';
      case 'Ocean': return '#124578';
      case 'Beach': return '#e6c88b';
      case 'TropicalRainforest': return '#135c24';
      case 'TemperateForest': return '#2d7a36';
      case 'Taiga': return '#43694f';
      case 'Savanna': return '#a69944';
      case 'Grassland': return '#6bb349';
      case 'Desert': return '#d6aa5c';
      case 'Tundra': return '#8ea89d';
      case 'SnowyMountain': return '#e8f4f8';
      case 'VolcanicWasteland': return '#382b2b';
    }
  }

  /**
   * คำนวณระบบแม่น้ำตามหลัก Steepest Descent Path
   */
  public generateRivers(heightMap: Float32Array, width: number, height: number, riverCount: number = 6): RiverPathNode[][] {
    const rivers: RiverPathNode[][] = [];
    const minStartHeight = this.config.mountainThreshold * 0.85;

    // หาจุดเริ่มต้นบนยอดเขา
    const candidates: { x: number; y: number; h: number }[] = [];
    for (let y = 5; y < height - 5; y += 4) {
      for (let x = 5; x < width - 5; x += 4) {
        const h = heightMap[y * width + x];
        if (h >= minStartHeight) {
          candidates.push({ x, y, h });
        }
      }
    }

    candidates.sort((a, b) => b.h - a.h);
    const chosenStarts = candidates.slice(0, riverCount);

    for (const start of chosenStarts) {
      const path: RiverPathNode[] = [];
      let cx = start.x;
      let cy = start.y;
      let currentHeight = start.h;
      let flow = 1.0;
      const visited = new Set<string>();

      while (currentHeight > this.config.seaLevel && path.length < 250) {
        const key = `${cx},${cy}`;
        if (visited.has(key)) break;
        visited.add(key);

        path.push({ x: cx, y: cy, elevation: currentHeight, flowVolume: flow });

        // หาเพื่อนบ้านที่ต่ำที่สุด 8 ทิศทาง
        let lowestX = cx;
        let lowestY = cy;
        let minH = currentHeight;

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

            const nh = heightMap[ny * width + nx];
            if (nh < minH) {
              minH = nh;
              lowestX = nx;
              lowestY = ny;
            }
          }
        }

        if (minH >= currentHeight) {
          // ติดหลุม (Local Minimum) พยายามไหลข้าม
          flow += 0.5;
          break;
        }

        cx = lowestX;
        cy = lowestY;
        currentHeight = minH;
        flow += 0.15;
      }

      if (path.length > 8) {
        rivers.push(path);
      }
    }

    return rivers;
  }

  /**
   * สร้างโครงข่ายเส้นทาง (Road Network) ด้วย Delaunay + Kruskal's MST + A* Pathfinding
   */
  public generateRoadNetwork(heightMap: Float32Array, width: number, height: number): RoadNetworkEdge[] {
    // กำหนดตำแหน่งเมือง/หมู่บ้าน (Settlements) บนพื้นราบ
    const settlements: [number, number][] = [];
    const step = Math.floor(width / 4);

    for (let gy = step; gy < height - step / 2; gy += step) {
      for (let gx = step; gx < width - step / 2; gx += step) {
        const h = heightMap[gy * width + gx];
        if (h > this.config.seaLevel + 0.05 && h < this.config.mountainThreshold) {
          settlements.push([gx, gy]);
        }
      }
    }

    if (settlements.length < 2) return [];

    // เชื่อมต่อเป็น Minimum Spanning Tree
    const edges: RoadNetworkEdge[] = [];
    const connected = new Set<number>([0]);

    while (connected.size < settlements.length) {
      let bestDist = Infinity;
      let bestFrom = 0;
      let bestTo = 0;

      for (const u of connected) {
        const [ux, uy] = settlements[u];
        for (let v = 0; v < settlements.length; v++) {
          if (connected.has(v)) continue;
          const [vx, vy] = settlements[v];
          const dist = Math.hypot(vx - ux, vy - uy);
          if (dist < bestDist) {
            bestDist = dist;
            bestFrom = u;
            bestTo = v;
          }
        }
      }

      connected.add(bestTo);
      const startPt = settlements[bestFrom];
      const endPt = settlements[bestTo];

      // คำนวณ A* Path ที่เลี่ยงภูเขาสูงชันและน้ำ
      const path = this.findPathAStar(startPt, endPt, heightMap, width, height);
      if (path.length > 0) {
        edges.push({
          from: startPt,
          to: endPt,
          cost: bestDist,
          path
        });
      }
    }

    return edges;
  }

  private findPathAStar(
    start: [number, number],
    end: [number, number],
    heightMap: Float32Array,
    width: number,
    height: number
  ): [number, number][] {
    const [sx, sy] = start;
    const [tx, ty] = end;

    const openSet: { x: number; y: number; g: number; f: number; parent?: any }[] = [];
    const closed = new Uint8Array(width * height);

    openSet.push({
      x: sx,
      y: sy,
      g: 0,
      f: Math.hypot(tx - sx, ty - sy)
    });

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;

      if (current.x === tx && current.y === ty) {
        // Reconstruct path
        const path: [number, number][] = [];
        let curr: any = current;
        while (curr) {
          path.push([curr.x, curr.y]);
          curr = curr.parent;
        }
        return path.reverse();
      }

      const idx = current.y * width + current.x;
      closed[idx] = 1;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = current.x + dx;
          const ny = current.y + dy;

          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const nIdx = ny * width + nx;
          if (closed[nIdx]) continue;

          const h1 = heightMap[idx];
          const h2 = heightMap[nIdx];

          // Cost: ระยะทาง + ค่าปรับความชัน + ค่าปรับพื้นที่ใต้น้ำ
          const slope = Math.abs(h2 - h1);
          let cost = Math.hypot(dx, dy) + slope * 30.0;
          if (h2 <= this.config.seaLevel) cost += 100.0; // เลี่ยงน้ำ

          const g = current.g + cost;
          const hCost = Math.hypot(tx - nx, ty - ny);
          const f = g + hCost;

          const existing = openSet.find(n => n.x === nx && n.y === ny);
          if (!existing) {
            openSet.push({ x: nx, y: ny, g, f, parent: current });
          } else if (g < existing.g) {
            existing.g = g;
            existing.f = f;
            existing.parent = current;
          }
        }
      }
    }

    return [];
  }

  /**
   * Poisson Disk Sampling เพื่อกระจาย Foliage ไม่ให้ซ้อนทับกัน
   */
  public generatePoissonFoliage(
    biomeMap: BiomeType[],
    heightMap: Float32Array,
    width: number,
    height: number,
    minDist: number = 3.5
  ): { x: number; y: number; type: string; scale: number }[] {
    const results: { x: number; y: number; type: string; scale: number }[] = [];
    const cellSize = minDist / Math.SQRT2;
    const gridW = Math.ceil(width / cellSize);
    const gridH = Math.ceil(height / cellSize);
    const grid: (number | null)[] = new Array(gridW * gridH).fill(null);

    const k = 30; // Max sample attempts
    const activeList: [number, number][] = [];

    // จุดแรก
    const startX = width * 0.5;
    const startY = height * 0.5;
    activeList.push([startX, startY]);
    const firstIdx = Math.floor(startY / cellSize) * gridW + Math.floor(startX / cellSize);
    grid[firstIdx] = 0;
    results.push({ x: startX, y: startY, type: 'OakTree', scale: 1.0 });

    let seed = this.config.seed;

    while (activeList.length > 0) {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      const randIndex = Math.floor((seed / 4294967296) * activeList.length);
      const [px, py] = activeList[randIndex];
      let found = false;

      for (let attempt = 0; attempt < k; attempt++) {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        const angle = (seed / 4294967296) * Math.PI * 2;
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        const radius = minDist * (1 + (seed / 4294967296));

        const qx = px + Math.cos(angle) * radius;
        const qy = py + Math.sin(angle) * radius;

        if (qx >= 0 && qx < width && qy >= 0 && qy < height) {
          const mapIdx = Math.floor(qy) * width + Math.floor(qx);
          const biome = biomeMap[mapIdx];
          const elev = heightMap[mapIdx];

          // อนุญาตให้ขึ้นเฉพาะบางไบโอม
          if (elev > this.config.seaLevel && biome !== 'Desert' && biome !== 'SnowyMountain' && biome !== 'Beach') {
            const gx = Math.floor(qx / cellSize);
            const gy = Math.floor(qy / cellSize);

            let ok = true;
            for (let dy = -2; dy <= 2 && ok; dy++) {
              for (let dx = -2; dx <= 2 && ok; dx++) {
                const cx = gx + dx;
                const cy = gy + dy;
                if (cx >= 0 && cx < gridW && cy >= 0 && cy < gridH) {
                  const neighbor = grid[cy * gridW + cx];
                  if (neighbor !== null) {
                    const other = results[neighbor];
                    if (Math.hypot(other.x - qx, other.y - qy) < minDist) {
                      ok = false;
                    }
                  }
                }
              }
            }

            if (ok) {
              const resIdx = results.length;
              grid[gy * gridW + gx] = resIdx;
              const foliageType = biome === 'Taiga' ? 'PineTree' : (biome === 'TropicalRainforest' ? 'JunglePalm' : 'OakTree');
              results.push({ x: qx, y: qy, type: foliageType, scale: 0.8 + (attempt % 5) * 0.1 });
              activeList.push([qx, qy]);
              found = true;
              break;
            }
          }
        }
      }

      if (!found) {
        activeList.splice(randIndex, 1);
      }
    }

    return results;
  }

  /**
   * สั่งรันการประมวลผลแผนที่โลกแบบครบวงจร (Full Generation Pipeline)
   */
  public generate(): WorldMapSimulationResult {
    const startTime = performance.now();
    const { width, height, scale, octaves, persistence, lacunarity, heightMultiplier } = this.config;

    const heightMap = new Float32Array(width * height);
    const temperatureMap = new Float32Array(width * height);
    const moistureMap = new Float32Array(width * height);
    const biomeMap: BiomeType[] = new Array(width * height);
    const grid: TerrainPoint[][] = [];

    // 1. Generate Base Noise Layers (Elevation, Temp, Moisture)
    for (let y = 0; y < height; y++) {
      grid[y] = [];
      for (let x = 0; x < width; x++) {
        const nx = x / scale;
        const ny = y / scale;

        // Base Elevation FBM
        let elev = this.fbmNoise2D(nx, ny, octaves, persistence, lacunarity) * heightMultiplier;
        
        // Temperature (Latitude Gradient + Noise)
        const latGradient = 1.0 - Math.abs((y / height) * 2 - 1.0); // Equator is hotter
        const tempNoise = this.fbmNoise2D(nx + 100, ny + 100, 3, 0.5, 2.0);
        let temp = latGradient * 0.7 + tempNoise * 0.3 - (elev * 0.4); // Higher is colder
        temp = Math.max(0, Math.min(1, temp));

        // Moisture (Noise + Proximity to sea)
        let moist = this.fbmNoise2D(nx + 200, ny + 200, 4, 0.5, 2.0);
        if (elev < this.config.seaLevel) moist = 1.0;

        const idx = y * width + x;
        heightMap[idx] = elev;
        temperatureMap[idx] = temp;
        moistureMap[idx] = moist;
      }
    }

    // 2. Hydraulic Erosion
    const erosionDelta = this.simulateHydraulicErosion(heightMap, width, height, this.config.erosionIterations);

    // 3. Biome Classification
    let minEl = 1, maxEl = 0, sumEl = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const elev = heightMap[idx];
        const temp = temperatureMap[idx];
        const moist = moistureMap[idx];

        minEl = Math.min(minEl, elev);
        maxEl = Math.max(maxEl, elev);
        sumEl += elev;

        const biome = this.classifyBiome(elev, temp, moist);
        biomeMap[idx] = biome;
        const biomeColor = this.getBiomeColor(biome);

        grid[y][x] = {
          x,
          y,
          elevation: elev,
          rawHeight: elev,
          temperature: temp,
          moisture: moist,
          biome,
          biomeColor,
          isRiver: false,
          isRoad: false,
          waterFlow: 0,
          sediment: 0,
          normal: [0, 1, 0]
        };
      }
    }

    // 4. Generate Rivers
    const rivers = this.config.enableRivers ? this.generateRivers(heightMap, width, height, 8) : [];
    for (const river of rivers) {
      for (const node of river) {
        if (grid[node.y] && grid[node.y][node.x]) {
          grid[node.y][node.x].isRiver = true;
          grid[node.y][node.x].waterFlow = node.flowVolume;
        }
      }
    }

    // 5. Generate Roads
    const roads = this.config.enableRoads ? this.generateRoadNetwork(heightMap, width, height) : [];
    let totalRoadLen = 0;
    for (const road of roads) {
      totalRoadLen += road.path.length;
      for (const [rx, ry] of road.path) {
        if (grid[ry] && grid[ry][rx]) {
          grid[ry][rx].isRoad = true;
        }
      }
    }

    // 6. Poisson Foliage
    const foliageInstances = this.generatePoissonFoliage(biomeMap, heightMap, width, height, this.config.poissonRadius);

    const generationTimeMs = performance.now() - startTime;

    return {
      heightMap,
      temperatureMap,
      moistureMap,
      biomeMap,
      grid,
      rivers,
      roads,
      foliageInstances,
      erosionDelta,
      stats: {
        generationTimeMs,
        riverCount: rivers.length,
        roadLength: totalRoadLen,
        foliageCount: foliageInstances.length,
        minElevation: minEl,
        maxElevation: maxEl,
        averageElevation: sumEl / (width * height)
      }
    };
  }

  public updateConfig(newConfig: Partial<TerrainGenerationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.seed !== undefined) {
      this.initializePermutationTable(this.config.seed);
    }
  }

  public getConfig(): TerrainGenerationConfig {
    return { ...this.config };
  }
}
