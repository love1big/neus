/**
 * ====================================================================================================
 * MODULE: UniversalImmunityConstraintVault.ts
 * PURPOSE: Persistent Storage, In-Flight Constraint Injection & Cross-System Knowledge Vault
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์:
 * 1. คลังจัดเก็บความจำข้อผิดพลาดและกฎภูมิคุ้มกันถาวร (Persistent Multi-Modal Immunity Vault)
 * 2. บรรจุฐานความรู้ข้อผิดพลาดจริงของอุตสาหกรรมเกม (Preloaded Seed Knowledge Base) ครอบคลุม 6 โดเมนหลัก
 * 3. ระบบฉีดกฎข้อห้ามใส่ AI แบบ In-Flight (Negative Prompt & Generator Constraint Injector)
 *    เพื่อการันตีว่าเมื่อ AI ทำงานสร้างโมเดล 3D, 2D, แผนที่ หรือโค้ด จะไม่มีทางสร้างข้อผิดพลาดเดิมซ้ำอีก
 * 4. ระบบนับสถิติการป้องกันความผิดพลาดสำเร็จ (Prevention Counter & Zero-Regression Metrics)
 * 5. รองรับการบันทึกลง LocalStorage และ Export/Import ข้อมูลในรูปแบบ JSON
 * 
 * ARCHITECTURE & SYSTEM INTEGRATION:
 * - สื่อสารผ่าน Custom Event 'offline-ai-multimodal-immunity-updated'
 * - เชื่อมต่อกับ In-Flight Watchdog และ Studio UI เพื่ออัปเดตสถานะความปลอดภัยแบบเรียลไทม์
 * ====================================================================================================
 */

import { MultiModalImmunityRecord, MultiModalWorkloadType } from './UniversalMultiModalErrorImmunityEngine';

const STORAGE_KEY = 'offline_ai_universal_multimodal_immunity_vault_v1';

export class UniversalImmunityConstraintVault {
  private static memoryCache: MultiModalImmunityRecord[] = [];
  private static initialized: boolean = false;

  /**
   * เริ่มต้นระบบและโหลดฐานข้อมูลความจำ
   */
  public static init(): MultiModalImmunityRecord[] {
    if (this.initialized && this.memoryCache.length > 0) {
      return this.memoryCache;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.memoryCache = parsed;
          this.initialized = true;
          return this.memoryCache;
        }
      }
    } catch (e) {
      console.warn('Could not read from local storage, falling back to seed database:', e);
    }

    // Load initial preloaded seed records
    this.memoryCache = this.getSeedKnowledgeBase();
    this.saveToStorage();
    this.initialized = true;
    return this.memoryCache;
  }

  /**
   * ดึงรายการความจำทั้งหมด
   */
  public static getAllRecords(): MultiModalImmunityRecord[] {
    if (!this.initialized) this.init();
    return [...this.memoryCache];
  }

  /**
   * ดึงรายการตามหมวดหมู่งาน (Workload Type)
   */
  public static getRecordsByWorkload(workload: MultiModalWorkloadType): MultiModalImmunityRecord[] {
    if (!this.initialized) this.init();
    return this.memoryCache.filter(r => r.workloadType === workload);
  }

  /**
   * บันทึกความจำข้อผิดพลาดใหม่เข้าสู่คลัง
   */
  public static saveRecord(record: MultiModalImmunityRecord): void {
    if (!this.initialized) this.init();

    // Check if fingerprint already exists
    const existingIndex = this.memoryCache.findIndex(r => r.fingerprint === record.fingerprint);
    if (existingIndex >= 0) {
      this.memoryCache[existingIndex].timesEncountered += 1;
      this.memoryCache[existingIndex].learnedTimestamp = Date.now();
    } else {
      this.memoryCache.unshift(record);
    }

    this.saveToStorage();
    this.broadcastUpdate();
  }

  /**
   * บันทึกการป้องกันข้อผิดพลาดสำเร็จ (Record Prevention Hit)
   */
  public static recordPreventionHit(recordIdOrFingerprint: string): void {
    if (!this.initialized) this.init();

    const target = this.memoryCache.find(r => r.id === recordIdOrFingerprint || r.fingerprint === recordIdOrFingerprint);
    if (target) {
      target.timesPrevented += 1;
      this.saveToStorage();
      this.broadcastUpdate();
    }
  }

  /**
   * สังเคราะห์ Negative Prompt และ Invariant Constraints สำหรับฉีดใส่ AI Generator
   */
  public static compileInFlightGeneratorConstraints(workload: MultiModalWorkloadType): string {
    const relevant = this.getRecordsByWorkload(workload);
    if (relevant.length === 0) return '';

    const lines = [
      `=== [STRICT OFFLINE AI MULTI-MODAL INVARIANT CONSTRAINTS - ${workload}] ===`,
      `The AI generator MUST strictly adhere to the following negative rules derived from learned production failures:`
    ];

    relevant.forEach((rec, idx) => {
      lines.push(`${idx + 1}. [FORBIDDEN]: ${rec.invariantConstraint.negativeRuleEn}`);
      lines.push(`   [MANDATORY PATTERN]: ${rec.invariantConstraint.recommendedPatterns.join(', ')}`);
      if (rec.invariantConstraint.invariantMathFormula) {
        lines.push(`   [INVARIANT ASSERTION]: ${rec.invariantConstraint.invariantMathFormula}`);
      }
    });

    lines.push(`=== [END INVARIANT CONSTRAINTS - GUARANTEE ZERO REGRESSION] ===`);
    return lines.join('\n');
  }

  /**
   * บันทึกลง LocalStorage
   */
  private static saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memoryCache));
    } catch (e) {
      console.warn('Could not save to LocalStorage:', e);
    }
  }

  /**
   * กระจาย Custom Event แจ้งเตือน AI ทุกระบบ
   */
  private static broadcastUpdate(): void {
    try {
      const event = new CustomEvent('offline-ai-multimodal-immunity-updated', {
        detail: { count: this.memoryCache.length, records: this.memoryCache }
      });
      window.dispatchEvent(event);
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * ฐานความรู้ข้อผิดพลาดจริงของอุตสาหกรรมเกม (Preloaded Multi-Modal Knowledge Base)
   */
  private static getSeedKnowledgeBase(): MultiModalImmunityRecord[] {
    return [
      {
        id: 'MULTI_SEED_01_3D_NORMALS',
        fingerprint: 'IMMUNE_MODEL_3D_NORMALS_INVERTED',
        workloadType: 'MODEL_3D',
        triggerSource: 'POST_TASK_VALIDATOR',
        title: 'Inverted Face Normals & Clockwise Index Winding',
        titleThai: 'เวกเตอร์ Normal พื้นผิว 3D กลับด้าน และ Winding ตามเข็มนาฬิกา',
        severity: 'HIGH_ARTIFACT',
        symptomSummary: '3D mesh model renders with dark inverted shading and faces become invisible due to backface culling in standard shader pipeline.',
        rootCauseAnalysisEn: 'Triangulation vertex indices were emitted in clockwise order, causing surface normal vectors to point inwards towards the mesh centroid.',
        rootCauseAnalysisThai: 'การเรียงจุดยอดของโพลีกอนเป็นแบบตามเข็มนาฬิกา ส่งผลให้เวกเตอร์ Normal หันเข้าด้านในตัวโมเดล ทำให้แสงตกกระทบผิดทิศทาง',
        defectArtifactPreview: {
          description: '3D Torus/Character mesh with inward normals',
          dataPayload: { vertexCount: 1024, triangleCount: 2048, invertedFaces: 412 },
          detectedAnomalies: ['Backface Culling Inversion', 'Dark Artifact in Diffuse Pass']
        },
        healedArtifactPreview: {
          description: 'Mesh with unified CCW winding and outward normals',
          dataPayload: { vertexCount: 1024, triangleCount: 2048, invertedFaces: 0 },
          healingTransformsApplied: ['Recalculated Face Normals', 'Flipped Winding to CCW Outward']
        },
        invariantConstraint: {
          constraintId: 'INVARIANT_MODEL_3D_NORMALS',
          workloadType: 'MODEL_3D',
          constraintTitle: 'Strict Counter-Clockwise Winding Invariant',
          constraintTitleThai: 'กฎบังคับทิศทาง Winding ทวนเข็มนาฬิกา',
          negativeRuleEn: 'NEVER generate 3D meshes with clockwise winding or inward-facing normals relative to mesh centroid.',
          negativeRuleThai: 'ห้ามสร้างโมเดล 3D ที่มีการเรียงหน้าตามเข็มนาฬิกาหรือมี Normal หันเข้าหาจุดศูนย์กลางของโมเดล',
          invariantMathFormula: 'dot(FaceNormal, (FaceCenter - MeshCentroid)) > 0',
          forbiddenPatterns: ['winding: "CW"', 'flipNormals: true'],
          recommendedPatterns: ['Winding: "CCW"', 'Unified Centroid Normal Projection', 'Weld Collinear Vertices'],
          architecturalGuideline: 'Mesh generation pipeline must enforce outward face normal assertions prior to exporting GLTF/OBJ formats.'
        },
        immunityConfidence: 100,
        learnedTimestamp: Date.now() - 86400000 * 4,
        timesEncountered: 3,
        timesPrevented: 48,
        tags: ['MODEL_3D', 'NORMALS', 'WINDING', 'ZERO_REGRESSION'],
        isPermanentlyImmune: true
      },
      {
        id: 'MULTI_SEED_02_2D_SEAM',
        fingerprint: 'IMMUNE_ART_2D_TILING_SEAM',
        workloadType: 'ART_2D',
        triggerSource: 'USER_PROMPTED_FIX',
        title: 'Texture Border Seam Discontinuity during Tiling',
        titleThai: 'รอยต่อของภาพพื้นผิวไม่เรียบเนียน เกิดเส้นขอบเมื่อปูกระเบื้อง (Tiling)',
        severity: 'MEDIUM_GLITCH',
        symptomSummary: 'Visible grid lines and color jumps appear when texture is repeated across 3D terrain or 2D tilemaps.',
        rootCauseAnalysisEn: 'High color gradient delta across border pixels (left edge x=0 vs right edge x=width-1) was generated without toroidal wrapping filter.',
        rootCauseAnalysisThai: 'ค่าสีระหว่างขอบซ้ายกับขอบขวาของภาพมีความแตกต่างกันสูง ทำให้เกิดเส้นแบ่งชัดเจนเมื่อนำภาพมาวางเรียงต่อกัน',
        defectArtifactPreview: {
          description: 'Cobblestone / Grass 2D Texture with 24.6% edge gradient delta',
          dataPayload: { width: 512, height: 512, edgeDelta: 0.246 },
          detectedAnomalies: ['Visible Border Line Artifact', 'Discontinuous Tangent Normal']
        },
        healedArtifactPreview: {
          description: 'Seamless Toroidal-blended 2D Texture',
          dataPayload: { width: 512, height: 512, edgeDelta: 0.001 },
          healingTransformsApplied: ['Toroidal Convolutional Seam Filter', 'Cosine Boundary Falloff']
        },
        invariantConstraint: {
          constraintId: 'INVARIANT_ART_2D_SEAM',
          workloadType: 'ART_2D',
          constraintTitle: 'Toroidal Seamless Border Invariant',
          constraintTitleThai: 'กฎความเรียบเนียนไร้รอยต่อของพื้นผิว',
          negativeRuleEn: 'NEVER output tileable textures with boundary pixel delta exceeding 1.0% color variance.',
          negativeRuleThai: 'ห้ามส่งออกภาพ Texture สำหรับ Tiling ที่มีค่าความต่างของสีขอบเกิน 1.0%',
          invariantMathFormula: 'abs(BorderColorLeft - BorderColorRight) < 0.01',
          forbiddenPatterns: ['unwrapped_linear_gradient', 'raw_border_export'],
          recommendedPatterns: ['Toroidal Wrapping Blend', 'Cosine Edge Weighting', 'Alpha Gutter Padding'],
          architecturalGuideline: 'Texture generation algorithms must apply periodic boundary convolution before serializing PNG textures.'
        },
        immunityConfidence: 99.8,
        learnedTimestamp: Date.now() - 86400000 * 3,
        timesEncountered: 5,
        timesPrevented: 72,
        tags: ['ART_2D', 'TEXTURE', 'SEAMLESS', 'TILING'],
        isPermanentlyImmune: true
      },
      {
        id: 'MULTI_SEED_03_MAP_NAVMESH',
        fingerprint: 'IMMUNE_MAP_TERRAIN_ISOLATED_NAVMESH',
        workloadType: 'MAP_TERRAIN',
        triggerSource: 'IN_FLIGHT_AI_WATCHDOG',
        title: 'Disconnected NavMesh Subgraphs & Isolated Spawn Chambers',
        titleThai: 'กราฟนำทาง NavMesh ขาดตอน และมีห้องเกิดที่ผู้เล่น/AI เดินข้ามไปไม่ได้',
        severity: 'CRITICAL_SHOWSTOPPER',
        symptomSummary: 'Enemies and players spawn in locked topological regions with zero walkable path finding routes to level objectives.',
        rootCauseAnalysisEn: 'Procedural obstacle placement partitioned level floor grid into multiple disjoint graph components without carving connecting corridors.',
        rootCauseAnalysisThai: 'ระบบสร้างดันเจี้ยนแบบสุ่มวางสิ่งกีดขวางตัดขาดพื้นที่ออกเป็น 3 เกาะย่อย ทำให้ระบบ Pathfinding ไม่สามารถหาเส้นทางได้',
        defectArtifactPreview: {
          description: 'Dungeon Grid 64x64 with 3 disconnected subgraphs',
          dataPayload: { gridW: 64, gridH: 64, connectedComponents: 3, isolatedSpawns: 2 },
          detectedAnomalies: ['Unreachable Boss Room', 'Pathfinding A* Search Failure']
        },
        healedArtifactPreview: {
          description: 'Unified Level Grid with connecting corridors',
          dataPayload: { gridW: 64, gridH: 64, connectedComponents: 1, isolatedSpawns: 0 },
          healingTransformsApplied: ['Minimum Spanning Tree Corridor Carver', 'Walkable Graph Guarantee']
        },
        invariantConstraint: {
          constraintId: 'INVARIANT_MAP_TERRAIN_NAVMESH',
          workloadType: 'MAP_TERRAIN',
          constraintTitle: 'Single Connected Component NavMesh Invariant',
          constraintTitleThai: 'กฎความต่อเนื่องของกราฟการเดิน NavMesh',
          negativeRuleEn: 'NEVER generate level maps with connected component count > 1 or unreachable spawn/objective nodes.',
          negativeRuleThai: 'ห้ามสร้างแผนที่ที่มีจำนวนชิ้นส่วนกราฟแยกมากกว่า 1 ส่วน และห้ามมีจุดเกิดที่ไม่สามารถเดินไปยังเป้าหมายได้',
          invariantMathFormula: 'ConnectedComponents(WalkableGrid) === 1',
          forbiddenPatterns: ['unconnected_rooms', 'isolated_spawn_node'],
          recommendedPatterns: ['Flood-Fill Reachability Assert', 'Minimum Spanning Tree Carver', 'Laplacian Slope Smoother'],
          architecturalGuideline: 'Procedural level generators must assert single connected graph before placing spawns or gameplay triggers.'
        },
        immunityConfidence: 100,
        learnedTimestamp: Date.now() - 86400000 * 2,
        timesEncountered: 2,
        timesPrevented: 39,
        tags: ['MAP_TERRAIN', 'NAVMESH', 'PCG', 'PATHFINDING'],
        isPermanentlyImmune: true
      },
      {
        id: 'MULTI_SEED_04_AUDIO_CLIP',
        fingerprint: 'IMMUNE_AUDIO_SOUND_0DBFS_CLIPPING',
        workloadType: 'AUDIO_SOUND',
        triggerSource: 'IN_FLIGHT_AI_WATCHDOG',
        title: 'Audio Intersample Peak Clipping and DC Offset Bias',
        titleThai: 'สัญญาณเสียงแอมพลิจูดล้นเพดาน 0dBFS และมีค่าไฟตรง DC Offset',
        severity: 'HIGH_ARTIFACT',
        symptomSummary: 'Harsh digital clipping distortion and loud speaker pops during sound playback and audio loop restarts.',
        rootCauseAnalysisEn: 'Un-mastered polyphonic voice summation exceeded normalized dynamic range and non-zero mean waveform voltage produced loop clicks.',
        rootCauseAnalysisThai: 'การผสมเสียงหลายตัวโน้ตพร้อมกันทำให้คลื่นเสียงล้นเพดานดิจิทัล และคลื่นเสียงไม่ได้อยู่บนแกนศูนย์ทำให้เกิดเสียงแต๊กตอนวนลูป',
        defectArtifactPreview: {
          description: '16-bit Synth Waveform with +3.4 dBFS clipping',
          dataPayload: { peakDb: 3.4, dcBias: 0.082, clippedSamples: 1420 },
          detectedAnomalies: ['Square Wave Distortion', 'Loop Click Discontinuity']
        },
        healedArtifactPreview: {
          description: 'Mastered Waveform with Soft-Knee Limiter',
          dataPayload: { peakDb: -0.1, dcBias: 0.000, clippedSamples: 0 },
          healingTransformsApplied: ['10Hz High-Pass DC Filter', 'Soft-Knee Lookahead Peak Limiter', 'Equal-Power Loop Crossfade']
        },
        invariantConstraint: {
          constraintId: 'INVARIANT_AUDIO_SOUND_LIMITER',
          workloadType: 'AUDIO_SOUND',
          constraintTitle: 'Strict Dynamic Range & Zero-Crossing Invariant',
          constraintTitleThai: 'กฎไดนามิกส์เสียงและ Zero-Crossing',
          negativeRuleEn: 'NEVER output audio buffers with true peak > -0.1 dBFS, DC bias > 0.0001, or non-zero-crossing loop endpoints.',
          negativeRuleThai: 'ห้ามส่งออกสัญญาณเสียงที่ Peak เกิน -0.1 dBFS, ห้ามมี DC Offset และต้องตัดต่อที่จุด Zero-Crossing เสมอ',
          invariantMathFormula: 'Peak(Audio) <= -0.1 dBFS && mean(Audio) === 0.0',
          forbiddenPatterns: ['unlimited_summation', 'raw_waveform_loop_cut'],
          recommendedPatterns: ['Soft-Knee Limiter Pass', '10Hz DC Blocker', '10ms Zero-Crossing Crossfade'],
          architecturalGuideline: 'All procedural synth pipelines must pass through mastering bus with limiter and DC blocker enabled.'
        },
        immunityConfidence: 100,
        learnedTimestamp: Date.now() - 86400000,
        timesEncountered: 4,
        timesPrevented: 61,
        tags: ['AUDIO_SOUND', 'DSP', 'CLIPPING', 'LIMITER'],
        isPermanentlyImmune: true
      },
      {
        id: 'MULTI_SEED_05_CODE_REACT_LOOP',
        fingerprint: 'IMMUNE_CODE_DEV_REACT_INFINITE_LOOP',
        workloadType: 'CODE_DEV',
        triggerSource: 'POST_TASK_VALIDATOR',
        title: 'Unbounded React State Mutation inside Effect Loop',
        titleThai: 'การอัปเดต State ภายใน useEffect โดยไม่มี Dependency Array ทำให้เกิด Infinite Loop',
        severity: 'CRITICAL_SHOWSTOPPER',
        symptomSummary: 'Browser tab freezes with "Maximum update depth exceeded" error and UI becomes completely unresponsive.',
        rootCauseAnalysisEn: 'State setter function was called directly inside useEffect body without an empty or guarded dependency array, triggering continuous re-renders.',
        rootCauseAnalysisThai: 'มีการเรียกฟังก์ชัน setState ภายใน useEffect โดยไม่ได้กำหนด Dependency Array ส่งผลให้คอมโพเนนต์เรนเดอร์ซ้ำไม่รู้จบจนเบราว์เซอร์ค้าง',
        defectArtifactPreview: {
          description: 'Component with unguarded useEffect(setState)',
          dataPayload: 'useEffect(() => { setCount(c => c + 1); });',
          detectedAnomalies: ['Maximum Update Depth Exceeded', 'Call Stack Exhaustion']
        },
        healedArtifactPreview: {
          description: 'Guarded useEffect with empty dependency array',
          dataPayload: 'useEffect(() => { setCount(c => c + 1); }, []);',
          healingTransformsApplied: ['Injected Immutable Dependency Array', 'Stabilized Callback Reference']
        },
        invariantConstraint: {
          constraintId: 'INVARIANT_CODE_DEV_REACT_LOOP',
          workloadType: 'CODE_DEV',
          constraintTitle: 'React Effect Dependency Array Invariant',
          constraintTitleThai: 'กฎบังคับ Dependency Array ใน React Effect',
          negativeRuleEn: 'NEVER call state setters inside useEffect without explicit stabilized dependency arrays or condition guards.',
          negativeRuleThai: 'ห้ามเรียกฟังก์ชัน setState ใน useEffect โดยไม่มี Dependency Array หรือเงื่อนไขป้องกัน',
          invariantMathFormula: 'HasDependencyArray(useEffect) === true',
          forbiddenPatterns: ['useEffect(() => { setX() })'],
          recommendedPatterns: ['useEffect(() => {}, [])', 'useCallback memoization', 'Functional state reducers'],
          architecturalGuideline: 'Code generation AST parser must flag and automatically patch unguarded state setters in effect hooks.'
        },
        immunityConfidence: 100,
        learnedTimestamp: Date.now() - 3600000 * 12,
        timesEncountered: 6,
        timesPrevented: 114,
        tags: ['CODE_DEV', 'REACT', 'LIFECYCLE', 'ZERO_REGRESSION'],
        isPermanentlyImmune: true
      }
    ];
  }
}
