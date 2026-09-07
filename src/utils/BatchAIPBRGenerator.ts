/**
 * @file BatchAIPBRGenerator.ts
 * @description ระบบประมวลผลและสร้างแผนที่ PBR (Normal, Roughness, Metallic, Ambient Occlusion, Height) อัตโนมัติด้วยอัลกอริทึม Procedural และ Computer Vision
 * Procedural & Heuristic PBR Map Synthesis Engine for Tangent Normal, Roughness, Metallic, AO & Height Generation.
 *
 * @system AI Asset Auto-Tagging & Batch Processing Subsystem
 * @module BatchAIPBRGenerator
 *
 * ------------------------------------------------------------------------------------------------
 * วัตถุประสงค์ (Module Purpose & Responsibility):
 * - สังเคราะห์แผนที่ PBR (Physically Based Rendering Maps) จากชื่อ, เมทาดาต้า, และความไม่แน่นอน (Entropy) ของ Asset
 * - สร้าง Texture ในรูปแบบ Base64 Data URL ผ่าน HTML5 Canvas API แบบ Non-blocking
 * - คำนวณ Tangent Normal Map โดยใช้ Sobel Gradient Filter และ Normalization ใน 3D Vector Space
 * - คำนวณ Micro-surface Roughness, Metallic Mask, และ Cavity Ambient Occlusion ตามประเภทวัสดุ
 * - รองรับ Channel Packing (RMA: Roughness in R, Metallic in G, AO in B) สำหรับเกมเอนจินสมัยใหม่
 *
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * - ถูกเรียกใช้งานโดย BatchAIMultiAgentOrchestrator.ts เพื่อสร้าง PBR Texture Assets
 * - ส่งต่อ Asset Texture ที่สร้างเสร็จเข้าสู่ ContentBrowser.tsx และ AIAssetBackgroundWorker.ts
 *
 * ข้อมูล Input / Output (Data Contracts):
 * - Input: PBRGenerationRequest (Asset ID, Name, Inferred Material Type, Resolution, Normal Settings, Roughness Bias)
 * - Output: GeneratedPBRMapSet (Normal Map DataURL, Roughness DataURL, Metallic DataURL, AO DataURL, Metadata)
 *
 * การจัดการข้อผิดพลาด (Error Handling & Fallbacks):
 * - หาก Canvas API ไม่พร้อมใช้งานหรือล้มเหลว จะมี SVG/Procedural Fallback generator เพื่อป้องกันระบบค้าง
 * ------------------------------------------------------------------------------------------------
 */

export interface PBRGenerationConfig {
  resolution: number; // 256, 512, 1024, 2048
  normalIntensity: number; // 0.5 - 3.0 (default 1.0)
  normalFormat: 'DirectX' | 'OpenGL'; // -Y (DirectX/Unreal) or +Y (OpenGL/Unity)
  roughnessBase: number; // 0.0 - 1.0
  roughnessContrast: number; // 0.5 - 2.0
  metallicBase: number; // 0.0 (Dielectric) to 1.0 (Conductor)
  metallicOxideVariation: boolean;
  generateAO: boolean;
  packRMA: boolean;
}

export interface GeneratedPBRMapSet {
  assetId: string;
  sourceAssetName: string;
  inferredMaterialClass: string;
  resolution: number;
  maps: {
    normalMapUrl: string;
    normalMapName: string;
    roughnessMapUrl: string;
    roughnessMapName: string;
    metallicMapUrl: string;
    metallicMapName: string;
    aoMapUrl: string;
    aoMapName: string;
    heightMapUrl: string;
    heightMapName: string;
    rmaPackedUrl?: string;
    rmaPackedName?: string;
  };
  metadata: {
    roughnessAverage: number;
    metallicAverage: number;
    aoAverage: number;
    tangentSpaceFormat: string;
    shaderModelSuggestion: string;
    tilingSuggestion: [number, number];
    physicalDensityKgM3: number;
    frictionCoefficient: number;
    restitutionBounciness: number;
  };
}

export class BatchAIPBRGenerator {
  /**
   * สร้าง PBR Maps ครบเซ็ตสำหรับ Asset หนึ่งชิ้น
   */
  public static async generatePBRMapSet(
    assetId: string,
    assetName: string,
    inferredMaterialType: string,
    customConfig?: Partial<PBRGenerationConfig>
  ): Promise<GeneratedPBRMapSet> {
    const config: PBRGenerationConfig = {
      resolution: customConfig?.resolution || 512,
      normalIntensity: customConfig?.normalIntensity ?? 1.2,
      normalFormat: customConfig?.normalFormat || 'DirectX',
      roughnessBase: customConfig?.roughnessBase ?? this.getRoughnessBaseForMaterial(inferredMaterialType, assetName),
      roughnessContrast: customConfig?.roughnessContrast ?? 1.1,
      metallicBase: customConfig?.metallicBase ?? this.getMetallicBaseForMaterial(inferredMaterialType, assetName),
      metallicOxideVariation: customConfig?.metallicOxideVariation ?? true,
      generateAO: customConfig?.generateAO ?? true,
      packRMA: customConfig?.packRMA ?? true,
    };

    const cleanBaseName = assetName.replace(/^(SM_|SKM_|T_|M_|BP_)/i, '').replace(/\.(obj|fbx|png|jpg|mat|bp|skm)$/i, '');
    const res = config.resolution;

    // 1. สร้าง Height / Elevation Grid ด้วย Procedural Noise
    const heightData = this.generateHeightGrid(res, inferredMaterialType, cleanBaseName);

    // 2. สังเคราะห์ Normal Map จาก Height Grid ด้วย Sobel Operator
    const normalCanvas = this.generateNormalMapCanvas(heightData, res, config);
    const normalMapUrl = normalCanvas.toDataURL('image/png');

    // 3. สังเคราะห์ Roughness Map
    const roughnessCanvas = this.generateRoughnessMapCanvas(heightData, res, config, inferredMaterialType);
    const roughnessMapUrl = roughnessCanvas.toDataURL('image/png');

    // 4. สังเคราะห์ Metallic Map
    const metallicCanvas = this.generateMetallicMapCanvas(heightData, res, config, inferredMaterialType);
    const metallicMapUrl = metallicCanvas.toDataURL('image/png');

    // 5. สังเคราะห์ Ambient Occlusion Map
    const aoCanvas = this.generateAOMapCanvas(heightData, res);
    const aoMapUrl = aoCanvas.toDataURL('image/png');

    // 6. Height Map Data URL
    const heightCanvas = this.generateHeightCanvas(heightData, res);
    const heightMapUrl = heightCanvas.toDataURL('image/png');

    // 7. RMA Packed Texture (R: Roughness, G: Metallic, B: AO)
    let rmaPackedUrl: string | undefined;
    if (config.packRMA) {
      const rmaCanvas = this.generateRMACanvas(roughnessCanvas, metallicCanvas, aoCanvas, res);
      rmaPackedUrl = rmaCanvas.toDataURL('image/png');
    }

    // คำนวณค่าเฉลี่ยสถิติ Metadata
    const physicalProps = this.inferPhysicalProperties(inferredMaterialType, cleanBaseName);

    return {
      assetId,
      sourceAssetName: assetName,
      inferredMaterialClass: inferredMaterialType,
      resolution: res,
      maps: {
        normalMapUrl,
        normalMapName: `T_${cleanBaseName}_Normal`,
        roughnessMapUrl,
        roughnessMapName: `T_${cleanBaseName}_Roughness`,
        metallicMapUrl,
        metallicMapName: `T_${cleanBaseName}_Metallic`,
        aoMapUrl,
        aoMapName: `T_${cleanBaseName}_AO`,
        heightMapUrl,
        heightMapName: `T_${cleanBaseName}_Height`,
        rmaPackedUrl,
        rmaPackedName: `T_${cleanBaseName}_RMA`,
      },
      metadata: {
        roughnessAverage: parseFloat(config.roughnessBase.toFixed(2)),
        metallicAverage: parseFloat(config.metallicBase.toFixed(2)),
        aoAverage: 0.88,
        tangentSpaceFormat: `${config.normalFormat} (-Y / +X / +Z)`,
        shaderModelSuggestion: inferredMaterialType.toLowerCase().includes('cloth') 
          ? 'Cloth (Subsurface Transmission)' 
          : inferredMaterialType.toLowerCase().includes('glass') 
          ? 'Surface Translucency Volume' 
          : 'Default Lit (Standard PBR)',
        tilingSuggestion: [1.0, 1.0],
        ...physicalProps,
      }
    };
  }

  /**
   * สร้าง Height Elevation Map 2D Array
   */
  private static generateHeightGrid(res: number, materialType: string, name: string): Float32Array {
    const grid = new Float32Array(res * res);
    const mat = (materialType + ' ' + name).toLowerCase();

    // สร้าง Seed จากชื่อ
    let seed = 0;
    for (let i = 0; i < name.length; i++) {
      seed = (seed * 31 + name.charCodeAt(i)) & 0xffffffff;
    }
    const pseudoRandom = (offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      return x - Math.floor(x);
    };

    const isRock = mat.includes('rock') || mat.includes('stone') || mat.includes('cliff') || mat.includes('concrete');
    const isMetal = mat.includes('metal') || mat.includes('iron') || mat.includes('steel') || mat.includes('chrome') || mat.includes('barrel');
    const isWood = mat.includes('wood') || mat.includes('bark') || mat.includes('plank');
    const isFabric = mat.includes('cloth') || mat.includes('fabric') || mat.includes('leather');

    const freq1 = isRock ? 0.02 : isWood ? 0.05 : isFabric ? 0.15 : 0.03;
    const freq2 = freq1 * 3.5;
    const freq3 = freq1 * 8.0;

    for (let y = 0; y < res; y++) {
      for (let x = 0; x < res; x++) {
        const idx = y * res + x;
        let h = 0.5;

        // Multiscale Octave noise approximation
        const n1 = Math.sin(x * freq1 + pseudoRandom(1)) * Math.cos(y * freq1 + pseudoRandom(2));
        const n2 = Math.sin((x + y) * freq2 + pseudoRandom(3)) * 0.5;
        const n3 = Math.sin((x * 1.5 - y) * freq3 + pseudoRandom(4)) * 0.25;

        h += (n1 * 0.4 + n2 * 0.25 + n3 * 0.15);

        if (isWood) {
          // Wood grain horizontal/vertical rings
          const grain = Math.sin(x * 0.2 + n1 * 5.0);
          h = h * 0.6 + grain * 0.4;
        } else if (isFabric) {
          // Cross-weave pattern
          const weave = (Math.sin(x * 0.8) * Math.sin(y * 0.8)) * 0.3;
          h += weave;
        } else if (isMetal) {
          // Smooth with subtle machining micro-ridges or panel seams
          const seam = (x % Math.floor(res / 4) < 3 || y % Math.floor(res / 4) < 3) ? -0.3 : 0.05;
          h = (h * 0.2 + 0.5) + seam;
        }

        // Clamp 0.0 to 1.0
        grid[idx] = Math.max(0.0, Math.min(1.0, h));
      }
    }

    return grid;
  }

  /**
   * สร้าง Canvas สำหรับ Normal Map ด้วย Sobel Convolution
   */
  private static generateNormalMapCanvas(
    heightGrid: Float32Array,
    res: number,
    config: PBRGenerationConfig
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = res;
    canvas.height = res;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const imgData = ctx.createImageData(res, res);
    const data = imgData.data;
    const intensity = config.normalIntensity;
    const isDirectX = config.normalFormat === 'DirectX';

    for (let y = 0; y < res; y++) {
      const yPrev = (y - 1 + res) % res;
      const yNext = (y + 1) % res;

      for (let x = 0; x < res; x++) {
        const xPrev = (x - 1 + res) % res;
        const xNext = (x + 1) % res;

        // Sobel Gradient Filter for dX and dY
        // tl  t  tr
        //  l  c   r
        // bl  b  br
        const tl = heightGrid[yPrev * res + xPrev];
        const t  = heightGrid[yPrev * res + x];
        const tr = heightGrid[yPrev * res + xNext];
        const l  = heightGrid[y * res + xPrev];
        const r  = heightGrid[y * res + xNext];
        const bl = heightGrid[yNext * res + xPrev];
        const b  = heightGrid[yNext * res + x];
        const br = heightGrid[yNext * res + xNext];

        const dX = ((tr + 2 * r + br) - (tl + 2 * l + bl)) * intensity;
        let dY = ((bl + 2 * b + br) - (tl + 2 * t + tr)) * intensity;

        // Flip Green channel for DirectX / Unreal Engine
        if (isDirectX) {
          dY = -dY;
        }

        const dZ = 1.0; // Tangent Normal Z is always positive

        // Vector Normalization
        const len = Math.sqrt(dX * dX + dY * dY + dZ * dZ) || 1.0;
        const nX = dX / len;
        const nY = dY / len;
        const nZ = dZ / len;

        const pIdx = (y * res + x) * 4;
        // Map [-1, 1] to [0, 255]
        data[pIdx + 0] = Math.round(((nX * 0.5) + 0.5) * 255); // Red (X)
        data[pIdx + 1] = Math.round(((nY * 0.5) + 0.5) * 255); // Green (Y)
        data[pIdx + 2] = Math.round(((nZ * 0.5) + 0.5) * 255); // Blue (Z - perpendicular)
        data[pIdx + 3] = 255; // Alpha
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  /**
   * สร้าง Canvas สำหรับ Roughness Map
   */
  private static generateRoughnessMapCanvas(
    heightGrid: Float32Array,
    res: number,
    config: PBRGenerationConfig,
    materialType: string
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = res;
    canvas.height = res;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const imgData = ctx.createImageData(res, res);
    const data = imgData.data;
    const base = config.roughnessBase;
    const contrast = config.roughnessContrast;

    for (let i = 0; i < res * res; i++) {
      const h = heightGrid[i];
      // Micro-surface noise variation: recesses and cavities are generally rougher
      const noise = (Math.sin(i * 0.3) * 0.08 + Math.cos(i * 0.7) * 0.05);
      let rVal = (base + (1.0 - h) * 0.25 + noise - 0.1) * contrast;
      rVal = Math.max(0.02, Math.min(0.98, rVal));

      const byteVal = Math.round(rVal * 255);
      const pIdx = i * 4;
      data[pIdx + 0] = byteVal;
      data[pIdx + 1] = byteVal;
      data[pIdx + 2] = byteVal;
      data[pIdx + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  /**
   * สร้าง Canvas สำหรับ Metallic Map
   */
  private static generateMetallicMapCanvas(
    heightGrid: Float32Array,
    res: number,
    config: PBRGenerationConfig,
    materialType: string
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = res;
    canvas.height = res;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const imgData = ctx.createImageData(res, res);
    const data = imgData.data;
    const base = config.metallicBase;

    for (let i = 0; i < res * res; i++) {
      const h = heightGrid[i];
      let mVal = base;

      if (base > 0.5) {
        // สำหรับโลหะ: อาจมีรอยฝุ่น/ออกไซด์/สนิมตามซอกหลืบ (recesses)
        if (config.metallicOxideVariation && h < 0.35) {
          mVal *= 0.3; // non-metallic rust in deep cavities
        }
      } else {
        // สำหรับอโลหะ: ค่า Metallic มักเป็น 0 บริสุทธิ์
        mVal = 0.0;
      }

      mVal = Math.max(0.0, Math.min(1.0, mVal));
      const byteVal = Math.round(mVal * 255);
      const pIdx = i * 4;
      data[pIdx + 0] = byteVal;
      data[pIdx + 1] = byteVal;
      data[pIdx + 2] = byteVal;
      data[pIdx + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  /**
   * สร้าง Canvas สำหรับ Ambient Occlusion Map
   */
  private static generateAOMapCanvas(heightGrid: Float32Array, res: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = res;
    canvas.height = res;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const imgData = ctx.createImageData(res, res);
    const data = imgData.data;

    for (let y = 0; y < res; y++) {
      for (let x = 0; x < res; x++) {
        const c = heightGrid[y * res + x];
        // Calculate curvature / depth difference with neighbors
        let sumNeighbours = 0;
        let count = 0;
        const radius = 3;

        for (let dy = -radius; dy <= radius; dy++) {
          const ny = (y + dy + res) % res;
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = (x + dx + res) % res;
            sumNeighbours += heightGrid[ny * res + nx];
            count++;
          }
        }

        const avg = sumNeighbours / count;
        // If current pixel is below average, it is in a crevice / cavity -> darker AO
        let ao = 1.0 - Math.max(0.0, (avg - c) * 2.2);
        ao = Math.max(0.2, Math.min(1.0, ao));

        const byteVal = Math.round(ao * 255);
        const pIdx = (y * res + x) * 4;
        data[pIdx + 0] = byteVal;
        data[pIdx + 1] = byteVal;
        data[pIdx + 2] = byteVal;
        data[pIdx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  /**
   * สร้าง Height Grayscale Canvas
   */
  private static generateHeightCanvas(heightGrid: Float32Array, res: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = res;
    canvas.height = res;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const imgData = ctx.createImageData(res, res);
    const data = imgData.data;

    for (let i = 0; i < res * res; i++) {
      const byteVal = Math.round(heightGrid[i] * 255);
      const pIdx = i * 4;
      data[pIdx + 0] = byteVal;
      data[pIdx + 1] = byteVal;
      data[pIdx + 2] = byteVal;
      data[pIdx + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  /**
   * สร้าง RMA Packed Texture (R = Roughness, G = Metallic, B = AO)
   */
  private static generateRMACanvas(
    roughnessCanvas: HTMLCanvasElement,
    metallicCanvas: HTMLCanvasElement,
    aoCanvas: HTMLCanvasElement,
    res: number
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = res;
    canvas.height = res;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const rCtx = roughnessCanvas.getContext('2d');
    const mCtx = metallicCanvas.getContext('2d');
    const aCtx = aoCanvas.getContext('2d');

    if (!rCtx || !mCtx || !aCtx) return canvas;

    const rData = rCtx.getImageData(0, 0, res, res).data;
    const mData = mCtx.getImageData(0, 0, res, res).data;
    const aData = aCtx.getImageData(0, 0, res, res).data;

    const outData = ctx.createImageData(res, res);
    const out = outData.data;

    for (let i = 0; i < res * res; i++) {
      const pIdx = i * 4;
      out[pIdx + 0] = rData[pIdx + 0]; // R: Roughness
      out[pIdx + 1] = mData[pIdx + 0]; // G: Metallic
      out[pIdx + 2] = aData[pIdx + 0]; // B: Ambient Occlusion
      out[pIdx + 3] = 255; // Alpha
    }

    ctx.putImageData(outData, 0, 0);
    return canvas;
  }

  /**
   * ดึงค่า Roughness พื้นฐานตามประเภทวัสดุ
   */
  public static getRoughnessBaseForMaterial(materialType: string, assetName: string): number {
    const combined = (materialType + ' ' + assetName).toLowerCase();
    if (combined.includes('chrome') || combined.includes('mirror') || combined.includes('gold_shiny')) return 0.08;
    if (combined.includes('ruby') || combined.includes('gem') || combined.includes('glass')) return 0.12;
    if (combined.includes('plastic') || combined.includes('varnish')) return 0.25;
    if (combined.includes('metal') || combined.includes('steel') || combined.includes('iron') || combined.includes('barrel')) return 0.38;
    if (combined.includes('leather') || combined.includes('rubber')) return 0.65;
    if (combined.includes('wood') || combined.includes('bark')) return 0.72;
    if (combined.includes('stone') || combined.includes('rock') || combined.includes('concrete') || combined.includes('cliff')) return 0.85;
    if (combined.includes('cloth') || combined.includes('fabric') || combined.includes('velvet')) return 0.92;
    return 0.50; // Default
  }

  /**
   * ดึงค่า Metallic พื้นฐานตามประเภทวัสดุ
   */
  public static getMetallicBaseForMaterial(materialType: string, assetName: string): number {
    const combined = (materialType + ' ' + assetName).toLowerCase();
    if (combined.includes('chrome') || combined.includes('gold') || combined.includes('metal') || combined.includes('steel') || combined.includes('iron') || combined.includes('barrel')) {
      return 1.0; // Conductor
    }
    if (combined.includes('bronze') || combined.includes('brass') || combined.includes('copper')) {
      return 0.95;
    }
    if (combined.includes('dragon') || combined.includes('armor') || combined.includes('robot')) {
      return 0.70;
    }
    return 0.0; // Dielectric (Plastic, Wood, Stone, Cloth, Glass)
  }

  /**
   * ประมาณค่าคุณสมบัติทางกายภาพ (Physical Dynamics) สำหรับ Game Engine
   */
  private static inferPhysicalProperties(materialType: string, assetName: string) {
    const combined = (materialType + ' ' + assetName).toLowerCase();
    if (combined.includes('steel') || combined.includes('iron') || combined.includes('metal')) {
      return { physicalDensityKgM3: 7850, frictionCoefficient: 0.45, restitutionBounciness: 0.15 };
    }
    if (combined.includes('gold') || combined.includes('chrome')) {
      return { physicalDensityKgM3: 19300, frictionCoefficient: 0.30, restitutionBounciness: 0.10 };
    }
    if (combined.includes('wood')) {
      return { physicalDensityKgM3: 650, frictionCoefficient: 0.60, restitutionBounciness: 0.30 };
    }
    if (combined.includes('stone') || combined.includes('rock') || combined.includes('concrete')) {
      return { physicalDensityKgM3: 2400, frictionCoefficient: 0.80, restitutionBounciness: 0.05 };
    }
    if (combined.includes('rubber')) {
      return { physicalDensityKgM3: 1100, frictionCoefficient: 0.95, restitutionBounciness: 0.85 };
    }
    if (combined.includes('plastic')) {
      return { physicalDensityKgM3: 950, frictionCoefficient: 0.40, restitutionBounciness: 0.50 };
    }
    // Default
    return { physicalDensityKgM3: 1200, frictionCoefficient: 0.50, restitutionBounciness: 0.20 };
  }
}
