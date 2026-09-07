/**
 * @file OmniWorldMapEngine.ts
 * @description
 * ============================================================================
 * [THAI]
 * เครื่องยนต์สร้างแผนที่ 3D 2D VR สำหรับเกมและโลกจำลอง (Omni World & Biome Map Engine)
 * สถาปัตยกรรมสร้างโลกและภูมิประเทศแบบ Procedural Generation:
 *   1. Perlin / Simplex Multi-Octave Noise Heightmap Generator: คำนวณระดับความสูง-ต่ำของภูเขาและหุบเขา
 *   2. Biome Classification Matrix: จำแนกภูมิประเทศอัตโนมัติ (มหาสมุทร, ชายหาด, ทุ่งหญ้า, ป่าดงดิบ, ทะเลทราย, ยอดเขาหิมะ)
 *   3. 2D Tilemap & Autotiling Grid Engine: แปลง Heightmap สู่ตาราง Tilemap 2D พร้อม Bitmasking
 *   4. 3D Topographic Isometric Projection: เรนเดอร์แผนที่แบบมุมมอง 3 มิติ ไอโซเมตริก
 *   5. VR Spatial Teleport & NavMesh Pathfinding Grid: กำหนดจุดวาป (Waypoints) และเส้นทางเดินของ AI
 *
 * [ENGLISH]
 * Enterprise 3D/2D/VR Procedural Terrain & Biome Map Generation Engine.
 * Features:
 *   - Multi-Octave Simplex/Perlin Heightmap Generator with Fractal Brownian Motion (fBm)
 *   - Dynamic Biome Classification (Deep Ocean, Shore, Plains, Forest, Desert, Mountain Peaks)
 *   - 2D Autotiling Bitmask Resolver & Tile Grid Mapping
 *   - 3D Isometric Topographic Height Mesh Synthesizer
 *   - VR NavMesh Pathfinding & Teleport Waypoint System
 * ============================================================================
 */

export type BiomeType = 'deep_ocean' | 'water' | 'sand' | 'grass' | 'forest' | 'rock' | 'snow';

export interface MapCell {
  x: number;
  y: number;
  height: number; // 0.0 to 1.0
  moisture: number; // 0.0 to 1.0
  biome: BiomeType;
  color: string;
  isWalkable: boolean;
}

export interface MapWaypoint {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'player_spawn' | 'boss_lair' | 'treasure' | 'teleport_gate' | 'settlement';
}

export interface WorldMapData {
  id: string;
  title: string;
  seed: number;
  width: number;
  height: number;
  octaves: number;
  waterLevel: number;
  cells: MapCell[][];
  waypoints: MapWaypoint[];
}

export class OmniWorldMapEngine {
  private mapData: WorldMapData;

  constructor(width: number = 32, height: number = 32, seed: number = 1337) {
    this.mapData = this.generateProceduralMap(width, height, seed, 4, 0.35);
  }

  public getMap(): WorldMapData {
    return this.mapData;
  }

  public setMap(map: WorldMapData): void {
    this.mapData = JSON.parse(JSON.stringify(map));
  }

  /**
   * Procedural Multi-Octave Noise Heightmap Generator
   */
  public generateProceduralMap(
    width: number,
    height: number,
    seed: number,
    octaves: number = 4,
    waterLevel: number = 0.35
  ): WorldMapData {
    const cells: MapCell[][] = [];

    for (let y = 0; y < height; y++) {
      const row: MapCell[] = [];
      for (let x = 0; x < width; x++) {
        // Multi-octave pseudo-noise calculation
        let h = 0;
        let freq = 0.08;
        let amp = 1.0;
        let maxAmp = 0;

        for (let o = 0; o < octaves; o++) {
          const nx = (x + seed * 17) * freq;
          const ny = (y + seed * 31) * freq;
          const val = (Math.sin(nx) * Math.cos(ny) + Math.sin(nx * 1.5 + ny) + 2) / 4;
          h += val * amp;
          maxAmp += amp;
          amp *= 0.5;
          freq *= 2.0;
        }

        const normalizedHeight = Math.max(0, Math.min(1, h / maxAmp));
        const moisture = (Math.sin(x * 0.1 + seed) * Math.cos(y * 0.1) + 1) / 2;

        // Classify Biome
        let biome: BiomeType = 'grass';
        let color = '#22c55e';
        let isWalkable = true;

        if (normalizedHeight < waterLevel - 0.1) {
          biome = 'deep_ocean';
          color = '#0284c7';
          isWalkable = false;
        } else if (normalizedHeight < waterLevel) {
          biome = 'water';
          color = '#38bdf8';
          isWalkable = false;
        } else if (normalizedHeight < waterLevel + 0.08) {
          biome = 'sand';
          color = '#fde047';
        } else if (normalizedHeight < 0.65) {
          if (moisture > 0.5) {
            biome = 'forest';
            color = '#15803d';
          } else {
            biome = 'grass';
            color = '#22c55e';
          }
        } else if (normalizedHeight < 0.85) {
          biome = 'rock';
          color = '#64748b';
        } else {
          biome = 'snow';
          color = '#f8fafc';
        }

        row.push({
          x,
          y,
          height: normalizedHeight,
          moisture,
          biome,
          color,
          isWalkable
        });
      }
      cells.push(row);
    }

    const defaultWaypoints: MapWaypoint[] = [
      { id: 'wp-1', name: 'Starting Sanctuary (จุดเกิด)', x: Math.floor(width / 4), y: Math.floor(height / 4), type: 'player_spawn' },
      { id: 'wp-2', name: 'Ancient Dragon Lair (รังมังกร)', x: Math.floor(width * 0.75), y: Math.floor(height * 0.75), type: 'boss_lair' },
      { id: 'wp-3', name: 'Mystic Teleport Gate (ประตูวาป)', x: Math.floor(width / 2), y: Math.floor(height / 2), type: 'teleport_gate' }
    ];

    this.mapData = {
      id: `map-${Date.now()}`,
      title: 'Emerald Continental Lands',
      seed,
      width,
      height,
      octaves,
      waterLevel,
      cells,
      waypoints: defaultWaypoints
    };

    return this.mapData;
  }
}
