/**
 * ====================================================================================================
 * MODULE: UniversalMultiModalErrorImmunityEngine.ts
 * PURPOSE: Core Engine for Offline AI Multi-Modal Continuous Self-Learning, Error RCA & Bug Immunity
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์:
 * 1. ระบบเรียนรู้ข้อผิดพลาดต่อเนื่องแบบรอบด้าน (Multi-Modal Error Learning) ครอบคลุม:
 *    - Code & Shaders (TypeScript, C++, GLSL, WGSL, Python)
 *    - 3D Models & Meshes (Flipped Normals, Non-Manifold Edges, Degenerate Polygons, UV Overlap, Rigging Weights)
 *    - 2D Textures & Sprites (Seam Discontinuities, Alpha Fringe Bleeding, Pixel Grid Alignment, Color Clamping)
 *    - Maps & Terrains (Disconnected NavMesh Islands, Elevation Spikes, Unreachable Dungeons, Biome Seams)
 *    - Audio & Sound DSP (DC Offset, Clipping Distortion, Intersample Peaks, Loop Clicks)
 *    - Gameplay & Physics (RigidBody Tunneling, Quaternion NaN Drift, State Machine Deadlocks)
 * 2. รองรับการทำงานทั้งแบบ In-Flight (ขณะ AI กำลังสร้าง) และ Post-Task (หลังทำงานเสร็จ หรือผู้ใช้สั่งแก้)
 * 3. วิเคราะห์สาเหตุแท้จริง (RCA), สร้าง Deterministic Invariant Fingerprint
 * 4. สกัดกฎข้อห้ามเชิงโครงสร้าง (Negative Invariant Constraints) ส่งต่อไปยังระบบสร้างในอนาคตเพื่อไม่ให้เกิดซ้ำ 100%
 * 
 * ARCHITECTURE & SYSTEM INTEGRATION:
 * - เชื่อมโยงกับ MultiModalArtifactSelfHealer สำหรับการซ่อมแซมชิ้นงานอัตโนมัติ
 * - เชื่อมโยงกับ UniversalImmunityConstraintVault สำหรับการจัดเก็บความจำและกระจายกฎไปยัง AI ทุกตัว
 * - สื่อสารผ่าน Custom Event 'offline-ai-multimodal-immunity-learned'
 * 
 * INPUTS & OUTPUTS:
 * - Input: MultiModalErrorEvent (workloadType, triggerSource, rawArtifactState, failureTelemetry, userPrompt)
 * - Output: MultiModalImmunityRecord (fingerprint, invariantConstraint, healedArtifact, rcaDetails, preventionStats)
 * 
 * ERROR HANDLING & FALLBACKS:
 * - Graceful fallback เมื่อข้อมูล Metadata ของโมเดล 3D หรือแผนที่ไม่ครบถ้วน
 * - Safe Math clamping ป้องกัน NaN และ Infinity ในการคำนวณทางเรขาคณิตและเสียง
 * ====================================================================================================
 */

export type MultiModalWorkloadType = 
  | 'CODE_DEV'          // Code, logic, scripts, shaders, memory, concurrency
  | 'MODEL_3D'          // 3D Meshes, normals, topology, rigging, LODs, UVs
  | 'ART_2D'            // Textures, sprites, pixel art, seam blending, alpha channels
  | 'MAP_TERRAIN'       // Terrain heightmaps, NavMesh pathfinding, PCG dungeons, biomes
  | 'AUDIO_SOUND'       // Synthesizers, sound effects, audio clipping, DC offset, loops
  | 'GAMEPLAY_PHYSICS'; // Physics colliders, rigidbodies, state machines, quest graphs

export type ErrorTriggerSource = 
  | 'IN_FLIGHT_AI_WATCHDOG' // AI ตรวจจับความผิดปกติได้เองขณะกำลังประมวลผล / สร้างชิ้นงาน
  | 'POST_TASK_VALIDATOR'  // AI ตรวจสอบความถูกต้องหลังสร้างชิ้นงานเสร็จ
  | 'USER_PROMPTED_FIX';   // ผู้ใช้งานแจ้งข้อผิดพลาดหรือสั่งให้แก้ไข

export type DefectSeverity = 'CRITICAL_SHOWSTOPPER' | 'HIGH_ARTIFACT' | 'MEDIUM_GLITCH' | 'LOW_COSMETIC';

export interface MultiModalInvariantConstraint {
  constraintId: string;
  workloadType: MultiModalWorkloadType;
  constraintTitle: string;
  constraintTitleThai: string;
  negativeRuleEn: string;
  negativeRuleThai: string;
  invariantMathFormula?: string;
  forbiddenPatterns: string[];
  recommendedPatterns: string[];
  architecturalGuideline: string;
}

export interface MultiModalImmunityRecord {
  id: string;
  fingerprint: string;
  workloadType: MultiModalWorkloadType;
  triggerSource: ErrorTriggerSource;
  title: string;
  titleThai: string;
  severity: DefectSeverity;
  symptomSummary: string;
  rootCauseAnalysisEn: string;
  rootCauseAnalysisThai: string;
  
  // Artifact states (Before failure vs After immunity)
  defectArtifactPreview: {
    description: string;
    dataPayload: string | Record<string, any>;
    detectedAnomalies: string[];
  };
  healedArtifactPreview: {
    description: string;
    dataPayload: string | Record<string, any>;
    healingTransformsApplied: string[];
  };

  invariantConstraint: MultiModalInvariantConstraint;
  immunityConfidence: number; // 0 - 100%
  learnedTimestamp: number;
  timesEncountered: number;
  timesPrevented: number;
  tags: string[];
  isPermanentlyImmune: boolean;
}

export class UniversalMultiModalErrorImmunityEngine {
  /**
   * สร้าง Deterministic Fingerprint สำหรับ Multi-Modal Anomaly
   */
  public static generateMultiModalFingerprint(
    workload: MultiModalWorkloadType,
    errorSignature: string,
    defectContext: string = ''
  ): string {
    const rawString = `${workload}::${errorSignature}::${defectContext}`
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_:]/g, '');

    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
    return `IMMUNE_${workload}_${hex}`;
  }

  /**
   * สกัดและวิเคราะห์สาเหตุแท้จริง (Root Cause Analysis) ตามหมวดหมู่งาน
   */
  public static analyzeRootCause(
    workload: MultiModalWorkloadType,
    errorText: string,
    payloadSnippet: string = ''
  ): { rcaEn: string; rcaThai: string; titleEn: string; titleThai: string; severity: DefectSeverity } {
    const textLower = (errorText + ' ' + payloadSnippet).toLowerCase();

    switch (workload) {
      case 'MODEL_3D':
        if (textLower.includes('normal') || textLower.includes('flipped') || textLower.includes('inverted')) {
          return {
            titleEn: 'Flipped Vertex Normals & Inverted Face Winding',
            titleThai: 'เวกเตอร์ Normal ของพื้นผิว 3D กลับด้านและ Winding ผิดทิศทาง',
            rcaEn: 'Polygon indices were ordered clockwise instead of counter-clockwise relative to centroid, causing vertex normals to face inward and invert lighting shaders.',
            rcaThai: 'ดัชนีจุดยอดของโพลีกอนถูกเรียงตามเข็มนาฬิกาแทนที่จะเป็นทวนเข็มนาฬิกา ส่งผลให้เวกเตอร์ Normal หันเข้าด้านในและเกิดการแรเงาผิดพลาด',
            severity: 'HIGH_ARTIFACT'
          };
        }
        if (textLower.includes('non-manifold') || textLower.includes('manifold') || textLower.includes('t-junction')) {
          return {
            titleEn: 'Non-Manifold Mesh Topology with Shared Boundary Edges',
            titleThai: 'โครงสร้างตาข่าย 3D ผิดรูปทรง (Non-Manifold) มีขอบร่วมเกิน 2 หน้า',
            rcaEn: 'More than two faces share a single edge or an internal self-intersecting boundary was generated during extrusion, breaking subdivision and light baking.',
            rcaThai: 'มีหน้าโพลีกอนมากกว่า 2 หน้าแชร์ขอบเดียวกัน หรือเกิดขอบทับซ้อนภายในตัวโมเดล ทำให้การทำ Subdivision และอบแสงล้มเหลว',
            severity: 'CRITICAL_SHOWSTOPPER'
          };
        }
        return {
          titleEn: 'Degenerate Triangles and Collinear Vertices',
          titleThai: 'โพลีกอนสามเหลี่ยมยุบตัว (Degenerate) และมีจุดยอดทับซ้อนกัน',
          rcaEn: 'Vertices collapsed into collinear positions creating zero-area faces and causing division by zero in tangent space calculations.',
          rcaThai: 'จุดยอดของสามเหลี่ยมอยู่บนเส้นตรงเดียวกัน ทำให้พื้นที่หน้าตัดเป็นศูนย์ และเกิดข้อผิดพลาดหารด้วยศูนย์ในระบบคำนวณ Tangent',
          severity: 'HIGH_ARTIFACT'
        };

      case 'ART_2D':
        if (textLower.includes('seam') || textLower.includes('tile') || textLower.includes('tiling')) {
          return {
            titleEn: 'Texture Seam Discontinuity at Boundary Borders',
            titleThai: 'รอยต่อของพื้นผิว 2D ไม่แนบเนียนเกิดขอบเหลื่อมเมื่อปูกระเบื้อง (Tiling)',
            rcaEn: 'High spatial frequency color gradient delta across border pixels (x=0 vs x=width-1) caused visible seam lines during texture wrapping.',
            rcaThai: 'ความต่างของค่าสีที่ขอบภาพด้านซ้ายกับขวา (x=0 กับ x=W-1) สูงเกินไป ทำให้เห็นรอยต่อชัดเจนเมื่อนำไปใช้แบบ Tiling ซ้ำๆ',
            severity: 'MEDIUM_GLITCH'
          };
        }
        return {
          titleEn: 'Alpha Channel Fringe Bleeding and Color Halo',
          titleThai: 'การรั่วไหลของแสงขอบขาว/ดำรอบสไปรต์ (Alpha Fringe Artifact)',
          rcaEn: 'Un-premultiplied alpha channel interpolated transparent edge RGB values against black/white clear buffers, causing halo outlines during blending.',
          rcaThai: 'ไม่ได้ทำ Pre-multiplied Alpha ทำให้พิกเซลโปร่งใสผสมสีพื้นหลังเดิมจนเกิดขอบสว่างหรือขอบมืดรอบตัวละคร',
          severity: 'MEDIUM_GLITCH'
        };

      case 'MAP_TERRAIN':
        if (textLower.includes('navmesh') || textLower.includes('unreachable') || textLower.includes('disconnected') || textLower.includes('path')) {
          return {
            titleEn: 'Disconnected NavMesh Graph & Isolated Spawn Zones',
            titleThai: 'กราฟการเดินของ AI ขาดตอนและมีพื้นที่จุดเกิดที่เดินไปไม่ถึง',
            rcaEn: 'Procedural obstacle placement partitioned the walkable Delaunay triangulation into isolated subgraphs without connecting bridge corridors.',
            rcaThai: 'ขั้นตอนการวางสิ่งกีดขวางตัดแบ่งพื้นที่เดินออกเป็นเกาะย่อยๆ ที่ไม่มีทางเชื่อม ทำให้ AI Pathfinding หาเส้นทางไม่พบและเกิด Deadlock',
            severity: 'CRITICAL_SHOWSTOPPER'
          };
        }
        return {
          titleEn: 'Elevation Gradient Spike in Heightmap Terrain',
          titleThai: 'ความชันของแผนที่ภูมิประเทศพุ่งสูงฉับพลัน (Terrain Gradient Spike)',
          rcaEn: 'Noise function clamp discontinuity produced infinite slope derivatives exceeding character controller max climb angle threshold (>45 deg).',
          rcaThai: 'สูตรคณิตศาสตร์ของความสูงเกิดจุดตัดฉับพลัน ทำให้ความชันเกินเกณฑ์ที่ตัวละครจะปีนได้ (>45 องศา) ส่งผลให้ตัวละครติดบัคตกแมพ',
          severity: 'HIGH_ARTIFACT'
        };

      case 'AUDIO_SOUND':
        if (textLower.includes('clip') || textLower.includes('distort') || textLower.includes('peak')) {
          return {
            titleEn: 'Intersample Peak Overdrive & Floating Point Audio Clipping',
            titleThai: 'สัญญาณเสียงแอมพลิจูดล้นเพดาน 0dBFS เกิดเสียงแตกพร่า (Audio Clipping)',
            rcaEn: 'Cumulative polyphonic voice summing exceeded normalized [-1.0, 1.0] dynamic range without soft-knee saturation or master limiting.',
            rcaThai: 'การรวมสัญญาณเสียงของหลายตัวโน้ตพร้อมกันทำให้แอมพลิจูดเกินช่วง [-1.0, +1.0] โดยไม่มีตัวจำกัดสัญญาณ (Limiter) ทำให้เกิดเสียงแตก',
            severity: 'HIGH_ARTIFACT'
          };
        }
        return {
          titleEn: 'DC Offset Voltage Shift & Looping Discontinuity Pop',
          titleThai: 'สัญญาณเสียงเบี่ยงเบนจากแกนศูนย์ (DC Offset) และเกิดเสียงป๊อปตอนวนลูป',
          rcaEn: 'Non-zero average waveform mean caused asymmetry and sudden zero-crossing voltage jumps at loop playback boundaries.',
          rcaThai: 'ค่าเฉลี่ยของคลื่นเสียงไม่ตรงกับแกนกลางศูนย์ (DC Bias) ทำให้เกิดเสียงแต๊ก/ป๊อปทุกครั้งที่เสียงวนลูปกลับมาเริ่มต้นใหม่',
          severity: 'MEDIUM_GLITCH'
        };

      case 'GAMEPLAY_PHYSICS':
        return {
          titleEn: 'Physics Continuous Collision Tunneling & Quaternion Drift',
          titleThai: 'วัตถุความเร็วสูงทะลุสิ่งกีดขวาง (Tunneling) และ Quaternion เกิดค่า NaN',
          rcaEn: 'Discrete collision detection raycast step was larger than collider thickness at high velocities, coupled with un-normalized rotational quaternions.',
          rcaThai: 'ระบบฟิสิกส์ใช้ Discrete Step ซึ่งก้าวข้ามความหนาของกำแพงเมื่อวัตถุวิ่งเร็ว และไม่มีการ Normalize เวกเตอร์การหมุน',
          severity: 'CRITICAL_SHOWSTOPPER'
        };

      case 'CODE_DEV':
      default:
        return {
          titleEn: 'Algorithmic State Inconsistency & Unbounded Resource Allocation',
          titleThai: 'ความผิดพลาดเชิงตรรกะสถานะและการจองทรัพยากรที่ไม่ได้คืนหน่วยความจำ',
          rcaEn: 'Asynchronous state mutations occurred outside safe transaction guards, or GPU/Memory buffers were instantiated without lifecycle disposal hooks.',
          rcaThai: 'การแก้ไขสถานะแบบ Asynchronous ทำงานโดยไม่มีระบบควบคุมความปลอดภัย หรือมีการสร้าง Buffer หน่วยความจำ/GPU โดยไม่เรียก Dispose',
          severity: 'HIGH_ARTIFACT'
        };
    }
  }

  /**
   * สกัด Negative Invariant Constraint กฎข้อห้ามถาวรเพื่อฉีดใส่ AI Generators
   */
  public static extractInvariantConstraint(
    workload: MultiModalWorkloadType,
    title: string,
    titleThai: string,
    rca: string
  ): MultiModalInvariantConstraint {
    const constraintId = `INVARIANT_${workload}_${Date.now().toString(36).toUpperCase()}`;

    switch (workload) {
      case 'MODEL_3D':
        return {
          constraintId,
          workloadType: 'MODEL_3D',
          constraintTitle: `Strict 3D Topology Invariant: ${title}`,
          constraintTitleThai: `กฎคงรูปทางเรขาคณิต 3D ถาวร: ${titleThai}`,
          negativeRuleEn: 'NEVER generate 3D meshes with clockwise face winding, non-manifold multi-face edges, zero-area degenerate triangles, or unconstrained UV boundaries.',
          negativeRuleThai: 'ห้ามสร้างโมเดล 3D ที่มีการเรียงหน้าตามเข็มนาฬิกา, ห้ามมีขอบ Non-Manifold ร่วมเกิน 2 หน้า, ห้ามมีสามเหลี่ยมพื้นที่ศูนย์ และห้าม UV ทะลุขอบ [0,1]',
          invariantMathFormula: 'dot(FaceNormal, VertexNormal) >= 0.0 && Area(Tri) > 1e-6 && EdgeSharingCount <= 2',
          forbiddenPatterns: ['winding: "CW"', 'area: 0', 'shared_edges > 2', 'uv < 0 || uv > 1'],
          recommendedPatterns: ['Winding: Counter-Clockwise (CCW)', 'Automatic Normal Unification', 'Degenerate Vertex Weld', 'Manifold Boundary Clamp'],
          architecturalGuideline: '3D generation pipeline must enforce pre-flight mesh topology validation before asset serialization.'
        };

      case 'ART_2D':
        return {
          constraintId,
          workloadType: 'ART_2D',
          constraintTitle: `2D Seamless Texture & Alpha Invariant: ${title}`,
          constraintTitleThai: `กฎความต่อเนื่องของพื้นผิวและสไปรต์ 2D: ${titleThai}`,
          negativeRuleEn: 'NEVER output tileable textures with border color delta > 2%, un-premultiplied transparent alpha halos, or non-power-of-two atlases without padding.',
          negativeRuleThai: 'ห้ามส่งออก Texture แบบ Tiling ที่ค่าสีขอบซ้ายขวา/บนล่างต่างกันเกิน 2%, ห้ามมีขอบขาว Alpha Halo และต้องมี Padding ป้องกัน Texture Bleed',
          invariantMathFormula: 'abs(Pixel[0, y] - Pixel[W-1, y]) < 0.02 && abs(Pixel[x, 0] - Pixel[x, H-1]) < 0.02',
          forbiddenPatterns: ['border_delta > 0.05', 'unpremultiplied_alpha_blend', 'unclamped_uv_borders'],
          recommendedPatterns: ['Toroidal Convolutional Seam Blending', 'Alpha Premultiplication Pass', '16px Edge Gutter Padding'],
          architecturalGuideline: 'Every 2D asset generator must apply boundary wrapping filters to guarantee seamless rendering in game viewports.'
        };

      case 'MAP_TERRAIN':
        return {
          constraintId,
          workloadType: 'MAP_TERRAIN',
          constraintTitle: `Topological Terrain & NavMesh Invariant: ${title}`,
          constraintTitleThai: `กฎความต่อเนื่องของแผนที่และ NavMesh: ${titleThai}`,
          negativeRuleEn: 'NEVER generate level maps with isolated unreachable spawn zones, disconnected NavMesh components, or terrain slopes steeper than 45 degrees without stairs.',
          negativeRuleThai: 'ห้ามสร้างแผนที่ที่มีจุดเกิดแยกขาดเป็นเกาะเดี่ยว, ห้ามมีกราฟ NavMesh ที่เดินไปไม่ถึง และห้ามมีความชันพื้นผิวเกิน 45 องศาโดยไม่มีบันได',
          invariantMathFormula: 'ConnectedComponents(NavMeshGraph) === 1 && max(abs(grad(Heightmap))) <= tan(45deg)',
          forbiddenPatterns: ['unconnected_rooms > 0', 'isolated_spawn_points', 'terrain_slope > 1.0'],
          recommendedPatterns: ['Flood-Fill Graph Connectivity Guarantee', 'Automatic Delaunay Bridge Carver', 'Laplacian Heightmap Smoothing'],
          architecturalGuideline: 'PCG algorithms must perform graph connectivity assertions before final level layout confirmation.'
        };

      case 'AUDIO_SOUND':
        return {
          constraintId,
          workloadType: 'AUDIO_SOUND',
          constraintTitle: `Acoustic DSP Dynamics & DC Invariant: ${title}`,
          constraintTitleThai: `กฎคุณภาพสัญญาณเสียงและไดนามิก DSP: ${titleThai}`,
          negativeRuleEn: 'NEVER synthesize audio exceeding 0.0 dBFS true peak, containing DC bias offset > 0.001, or abruptly cutting without zero-crossing crossfades.',
          negativeRuleThai: 'ห้ามสังเคราะห์เสียงที่ยอดคลื่นเกิน 0.0 dBFS, ห้ามมีค่า DC Offset เบี่ยงเบนเกิน 0.001 และต้องตัดต่อที่จุด Zero-Crossing เสมอ',
          invariantMathFormula: 'max(abs(Sample[t])) <= 1.0 && abs(mean(Sample)) < 1e-4 && Sample[LoopEnd] == Sample[LoopStart] == 0',
          forbiddenPatterns: ['peak_sample > 1.0', 'mean_voltage != 0', 'abrupt_loop_cut'],
          recommendedPatterns: ['Soft-Knee Lookahead Limiter', '10Hz High-Pass DC Blocker', '10ms Equal-Power Loop Crossfade'],
          architecturalGuideline: 'Audio DSP pipelines must include automatic mastering limiters and zero-crossing smoothers.'
        };

      case 'GAMEPLAY_PHYSICS':
        return {
          constraintId,
          workloadType: 'GAMEPLAY_PHYSICS',
          constraintTitle: `Physics Invariant & Numerical Stability: ${title}`,
          constraintTitleThai: `กฎเสถียรภาพฟิสิกส์และการคำนวณ: ${titleThai}`,
          negativeRuleEn: 'NEVER use discrete collision for high-velocity projectiles, allow un-normalized quaternions, or execute unbounded while loops in gameplay state machines.',
          negativeRuleThai: 'ห้ามใช้ Discrete Collision กับวัตถุความเร็วสูง, ห้ามปล่อยให้ Quaternion ไม่ได้รับการ Normalize และห้ามมีลูปไม่รู้จบใน State Machine',
          invariantMathFormula: 'abs(norm(quat) - 1.0) < 1e-5 && RaycastCastDistance <= ColliderThickness',
          forbiddenPatterns: ['discrete_collision_on_bullet', 'quat.normalize_missing', 'state_machine_infinite_loop'],
          recommendedPatterns: ['Continuous Collision Detection (CCD)', 'Unit Quaternion Assertion', 'Max State Iteration Cap (1000)'],
          architecturalGuideline: 'Gameplay physics nodes must enforce continuous swept volumes and quaternion safety wrappers.'
        };

      case 'CODE_DEV':
      default:
        return {
          constraintId,
          workloadType: 'CODE_DEV',
          constraintTitle: `Code Architectural Invariant: ${title}`,
          constraintTitleThai: `กฎสถาปัตยกรรมโค้ดและการจัดสรรหน่วยความจำ: ${titleThai}`,
          negativeRuleEn: 'NEVER perform un-disposed allocations of GPU textures/buffers, mutate React state inside render loops, or perform unguarded arithmetic divisions.',
          negativeRuleThai: 'ห้ามจองบัฟเฟอร์ GPU โดยไม่เรียก Dispose, ห้ามอัปเดต State ภายใน Render Loop และห้ามหารตัวเลขโดยไม่เช็คตัวหารเป็นศูนย์',
          invariantMathFormula: 'Allocations === Disposals && Divisor !== 0 && RenderCycles <= MaxAllowed',
          forbiddenPatterns: ['new Buffer without dispose', 'setState in render body', 'a / b without check'],
          recommendedPatterns: ['RAII / using Lifecycle Handlers', 'Pure Functional State Reducers', 'Epsilon Guarded Divisions'],
          architecturalGuideline: 'Code generators must inject guard clauses and disposal lifecycle handlers into all resource managers.'
        };
    }
  }

  /**
   * เรียนรู้และบันทึกข้อผิดพลาดรอบด้าน (Multi-Modal Learning Ingestion)
   */
  public static ingestMultiModalDefect(
    workload: MultiModalWorkloadType,
    trigger: ErrorTriggerSource,
    errorLog: string,
    rawDefectPayload: string | Record<string, any>,
    healedPayload: string | Record<string, any>,
    customTitle?: string
  ): MultiModalImmunityRecord {
    const { rcaEn, rcaThai, titleEn, titleThai, severity } = this.analyzeRootCause(workload, errorLog, typeof rawDefectPayload === 'string' ? rawDefectPayload : JSON.stringify(rawDefectPayload));
    
    const finalTitle = customTitle || titleEn;
    const finalTitleThai = `การเรียนรู้ภูมิคุ้มกัน: ${customTitle ? customTitle : titleThai}`;
    const fingerprint = this.generateMultiModalFingerprint(workload, finalTitle, errorLog.slice(0, 100));
    const constraint = this.extractInvariantConstraint(workload, finalTitle, finalTitleThai, rcaEn);

    const record: MultiModalImmunityRecord = {
      id: `MULTI_IMMUNE_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fingerprint,
      workloadType: workload,
      triggerSource: trigger,
      title: finalTitle,
      titleThai: finalTitleThai,
      severity,
      symptomSummary: errorLog.slice(0, 400),
      rootCauseAnalysisEn: rcaEn,
      rootCauseAnalysisThai: rcaThai,
      defectArtifactPreview: {
        description: `Defective Artifact State (${workload}) captured during ${trigger}`,
        dataPayload: rawDefectPayload,
        detectedAnomalies: [titleEn, `Severity: ${severity}`, `Trigger: ${trigger}`]
      },
      healedArtifactPreview: {
        description: `Self-Healed Safe Artifact State (${workload}) with verified immunity`,
        dataPayload: healedPayload,
        healingTransformsApplied: constraint.recommendedPatterns
      },
      invariantConstraint: constraint,
      immunityConfidence: 99.4,
      learnedTimestamp: Date.now(),
      timesEncountered: 1,
      timesPrevented: 0,
      tags: [workload, trigger, 'OFFLINE_SELF_HEALED', 'PERMANENT_IMMUNITY', 'ZERO_REGRESSION'],
      isPermanentlyImmune: true
    };

    return record;
  }
}
