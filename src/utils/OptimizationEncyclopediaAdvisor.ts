/**
 * @file OptimizationEncyclopediaAdvisor.ts
 * @description
 * ============================================================================
 * [THAI - ภาษาไทย]
 * ระบบวิเคราะห์และแนะนำเอกสารการเพิ่มประสิทธิภาพตามบริบทของเครื่องมือที่กำลังใช้งาน
 * (Context-Sensitive Optimization Encyclopedia Advisor Engine)
 * 
 * 1. วัตถุประสงค์และหน้าที่ของไฟล์นี้ (Module Purpose & Responsibility):
 *    - วิเคราะห์ `activeTool` ID และหมวดหมู่ของเครื่องมือที่ผู้ใช้งานกำลังเปิดอยู่
 *    - จับคู่กับหัวข้อ เทคนิค และสูตรการปรับแต่งประสิทธิภาพ (Optimization Matrix) จาก
 *      OptimizationEncyclopedia โดยอัตโนมัติ
 *    - ส่งคืนคำแนะนำเชิงลึก (Deep Architectural Guidelines), สูตรคำนวณ (Formulas),
 *      และตัวชี้วัดประสิทธิภาพ (Metrics เช่น CPU -40%, VRAM -60%, Bandwidth -80%)
 *    - จัดเตรียมฟังก์ชันค้นหา (Search) และกรองหัวข้อที่เกี่ยวข้องสำหรับการกระโดดไปยังหน้าสารานุกรม
 * 
 * 2. สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 *    - เชื่อมต่อกับ `OptimizationEncyclopedia.tsx` ผ่าน Tab Identifier (`archetypes`, `world`,
 *      `graphics`, `physics`, `dynamic`, `vr`, `audio`, `network`, `offline_ai`, `visual`,
 *      `data`, `postprocess`, `advanced`, `backend`)
 *    - ให้บริการข้อมูลกับคอมโพเนนต์ `OptimizationHelperTooltip.tsx`
 *    - รองรับการทำงานร่วมกับ Global Event Dispatcher (`open-optimization-tab`)
 * 
 * 3. พารามิเตอร์ Input / Output ที่รับส่ง (Inputs, Outputs & Data Contracts):
 *    - Input: `toolId: string`, `toolsHierarchy?: any[]`
 *    - Output: `ToolOptimizationContext` (รวบรวม Primary Tab, คำแนะนำเด่น, กฎการออกแบบ 3 ข้อ, และ Code Snippet)
 * 
 * 4. การจัดการข้อผิดพลาดและ Edge Cases (Error Handling & Fallbacks):
 *    - หากไม่พบ Tool ID ในระบบตรงตัว จะใช้ Fuzzy Matching ตรวจสอบ Keyword จากชื่อและ Category
 *    - หากไม่ตรงกับ Keyword ใดๆ จะมี Default General Performance Architecture Context ส่งคืนเสมอ
 * 
 * 5. ตัวอย่างการเรียกใช้งาน (Usage Example):
 *    ```ts
 *    import { getOptimizationAdviceForTool } from './OptimizationEncyclopediaAdvisor';
 *    const advice = getOptimizationAdviceForTool('OmniMusicVocalDAWStudio');
 *    console.log(advice.primaryTab, advice.suggestions);
 *    ```
 * ============================================================================
 */

export interface OptimizationRule {
  id: string;
  ruleTitle: string;
  explanation: string;
  benefit: string;
  impactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface OptimizationSuggestion {
  id: string;
  title: string;
  tabId: string;
  category: string;
  badge: string;
  summary: string;
  practicalAction: string;
  codeSnippet?: string;
  metricBenefit: string;
  relatedSubtopics: string[];
}

export interface ToolOptimizationContext {
  toolId: string;
  toolName: string;
  primaryTabId: string;
  tabName: string;
  primaryMetricHighlight: string;
  corePhilosophy: string;
  suggestions: OptimizationSuggestion[];
  goldenRules: OptimizationRule[];
  relatedSearchKeywords: string[];
}

/**
 * ฐานข้อมูลองค์ความรู้เชิงสถาปัตยกรรมและการปรับแต่งประสิทธิภาพแบบครบวงจร
 */
const ENCYCLOPEDIA_TOPICS: Record<string, { tabName: string; corePhilosophy: string; suggestions: OptimizationSuggestion[]; goldenRules: OptimizationRule[] }> = {
  // 1. Audio Architecture & Sound DSP
  audio: {
    tabName: 'Audio Architecture',
    corePhilosophy: 'รักษา Audio Thread ไม่ให้สะดุด (No Glitches), ใช้ Spatial HRTF แบบแยก Raycast และส่งข้อมูลเสียงทางเครือข่ายด้วย RPC Integer Packet',
    suggestions: [
      {
        id: 'audio-hrtf-spatial',
        title: 'HRTF & 360° Binaural Spatial Panning',
        tabId: 'audio',
        category: 'Acoustics & Spatial Sound',
        badge: 'Immersion +300%',
        summary: 'ใช้ Head-Related Transfer Function เพื่อจำลองทิศทางเสียงแบบ 3 มิติ (หน้า/หลัง/บน/ล่าง) ผ่านหูฟังสเตอริโอ พร้อม Logarithmic Distance Roll-off',
        practicalAction: 'กำหนดเส้นโค้ง Distance Attenuation ให้เป็น Logarithmic Curve และจำกัด Max Distance ไม่ให้คำนวณเสียงไกลเกินจำเป็น',
        codeSnippet: `// Logarithmic Sound Falloff
const gain = Math.min(1.0, 1.0 / (1.0 + rollOffFactor * (distance - minDistance)));
pannerNode.positionX.setValueAtTime(x, audioCtx.currentTime);`,
        metricBenefit: 'ความสมจริงของมิติเสียง +300%, ลดภาระคำนวณเสียงนอกระยะ',
        relatedSubtopics: ['Binaural Panning', 'Distance Attenuation', 'Doppler Effect']
      },
      {
        id: 'audio-raytracing-occlusion',
        title: 'Ray-Traced Audio & Acoustic Occlusion',
        tabId: 'audio',
        category: 'Physics & DSP',
        badge: 'CPU -45%',
        summary: 'ยิง Audio Ray เพื่อคำนวณการสะท้อนของเสียง (Reflections), การดูดซับของพื้นผิว (Absorption) และการหักเหของเสียงอ้อมสิ่งกีดขวาง (Diffraction)',
        practicalAction: 'ใช้ Low-Pass Filter กรองย่านเสียงสูงออกเมื่อมีผนังขวางกั้นระหว่างผู้เล่นกับต้นกำเนิดเสียง (Occlusion Culling)',
        codeSnippet: `// Acoustic Wall Low-Pass Filter
if (isOccludedByWall) {
  biquadFilter.type = 'lowpass';
  biquadFilter.frequency.setTargetAtTime(450, audioCtx.currentTime, 0.05); // Muffler
}`,
        metricBenefit: 'ลดการประมวลผลเสียงสะท้อนที่ไม่จำเป็นลง 45%',
        relatedSubtopics: ['Occlusion Lowpass', 'Obstruction Wrapping', 'Room Reverberation']
      },
      {
        id: 'audio-network-rpc',
        title: 'Networked RPC Audio Execution (Bandwidth Saver)',
        tabId: 'audio',
        category: 'Multiplayer Audio',
        badge: 'Bandwidth -95%',
        summary: 'ห้ามส่ง Raw Audio Streams ผ่าน Network เด็ดขาด ส่งเพียง Integer Packet เล็กๆ เช่น PlaySound(SoundID: 45, Pos: X,Y,Z) ให้เครื่อง Client เล่นไฟล์ในเครื่องตนเอง',
        practicalAction: 'รวม Event เสียงเข้ากับ UDP State Payload โดยใช้ 2-byte Sound ID Index',
        codeSnippet: `// Compact RPC Sound Event (Only 8 Bytes total)
struct SoundEventPacket {
  uint16_t soundAssetIndex; // 2 bytes
  int16_t posX, posY, posZ;  // 6 bytes fixed point
};`,
        metricBenefit: 'ประหยัด Bandwidth ของระบบเสียงลงกว่า 95%',
        relatedSubtopics: ['Opus VOIP Compression', 'Client-Side Sound Intercept', 'Lag Compensation']
      },
      {
        id: 'audio-organic-variance',
        title: 'Pitch & Volume Organic Randomization',
        tabId: 'audio',
        category: 'Sound Polish',
        badge: 'Anti-Repetition',
        summary: 'สุ่มความถี่และระดับเสียง +/- 5% ในทุกๆ ครั้งที่มีการ Trigger เสียงฝีเท้าหรือเสียงยิง เพื่อทำลายความแข็งทื่อ (Robotic Machine-gun Effect)',
        practicalAction: 'ตั้งค่า Detune และ Gain แบบสุ่มเล็กน้อยใน Audio Buffer Source ทุกรอบ',
        metricBenefit: 'เพิ่มความเป็นธรรมชาติให้กับเสียงประกอบฉาก 100%',
        relatedSubtopics: ['Micro-pitch Shifting', 'Velocity Scaling', 'Dynamic Environmental Crossfade']
      }
    ],
    goldenRules: [
      {
        id: 'r-audio-1',
        ruleTitle: 'ห้ามรันการคำนวณหนักใน Audio Thread',
        explanation: 'Audio Callback ต้องใช้เวลาไม่เกิน 2-5ms เสมอ มิฉะนั้นจะเกิดเสียงแตก (Audio Dropout/Crackle)',
        benefit: 'เสียงลื่นไหลต่อเนื่อง 100%',
        impactLevel: 'CRITICAL'
      },
      {
        id: 'r-audio-2',
        ruleTitle: 'ใช้ Voice Pool & Culling เสมอ',
        explanation: 'จำกัด Max Active Voices (เช่น 32-64 Channels) และตัดเสียงที่เงียบหรืออยู่ไกลทิ้งทันที',
        benefit: 'CPU Usage -60%',
        impactLevel: 'HIGH'
      }
    ]
  },

  // 2. Next-Gen Graphics & Shaders
  graphics: {
    tabName: 'Next-Gen Graphics',
    corePhilosophy: 'ลด Draw Calls ให้เหลือน้อยที่สุดด้วย GPU Instancing, ใช้ Mipmapping & LOD และเลือกใช้ AI Upscaling (DLSS/FSR) แทน Native Resolution ที่หนักเกินไป',
    suggestions: [
      {
        id: 'gfx-vrs',
        title: 'Variable Rate Shading (VRS) & AI Upscaling',
        tabId: 'graphics',
        category: 'Render Pipeline',
        badge: 'FPS +85%',
        summary: 'เกลี่ยการคำนวณ Shader ให้เน้นความละเอียดสูงสุดเฉพาะจุดโฟกัสหรือขอบที่มี Contrast สูง และลดการ Render ในเงามืดหรือส่วนที่เคลื่อนไหวเร็ว',
        practicalAction: 'เปิดใช้งาน Dynamic Resolution Scaling ร่วมกับ Temporal Upscaling ในโหมด Performance',
        codeSnippet: `// VRS Tier 2 Allocation Matrix
renderPipeline.setVariableRateShadingLevel({
  focalArea: '1x1', // High-fidelity on center
  peripheralArea: '2x2', // Low shader load on edges
  motionBlurZones: '4x4' // Fast moving objects
});`,
        metricBenefit: 'ประหยัด GPU Shader Cycles ลงได้ถึง 40-85%',
        relatedSubtopics: ['DLSS 3.5 Frame Generation', 'FSR 3.0 Native-AA', 'Ray Reconstruction']
      },
      {
        id: 'gfx-vat-instancing',
        title: 'Vertex Animation Textures (VAT) & GPU Instancing',
        tabId: 'graphics',
        category: 'Crowd & Geometry',
        badge: 'DrawCalls -98%',
        summary: 'อบ (Bake) การเคลื่อนไหวของกระดูกอนิเมชันลงใน Texture แล้วให้ GPU อ่าน Pixel Color เพื่อขยับ Vertex โดยตรง ไม่ต้องคำนวณ Skeletal Matrix บน CPU',
        practicalAction: 'เปลี่ยนตัวละครฝูงชน (Crowd/Minions) ที่อยู่ไกลจาก CPU Bone Rig เป็น VAT Skinned Mesh',
        codeSnippet: `// VAT Vertex Shader Offset
vec2 uv = vec2(vertexID / textureWidth, currentFrame / totalFrames);
vec3 vertexOffset = texture2D(vatTexture, uv).xyz;
gl_Position = mvpMatrix * vec4(position + vertexOffset, 1.0);`,
        metricBenefit: 'เรนเดอร์ยูนิตฝูงชนได้ 50,000+ ตัวพร้อมกันที่ 60 FPS',
        relatedSubtopics: ['Indirect Draw Calls', 'Mesh Shaders', 'Texture Atlasing']
      },
      {
        id: 'gfx-lod-mipmaps',
        title: 'Hierarchical Mesh LOD & Mipmapping Management',
        tabId: 'graphics',
        category: 'Memory & Textures',
        badge: 'VRAM -65%',
        summary: 'สลับ Mesh เป็น Polygon ต่ำ (LOD 1-3) เมื่อตัวละครอยู่ไกล พร้อมใช้ Mipmap เพื่อป้องกัน Cache Miss บน GPU และตัดปัญหา Moire Pattern',
        practicalAction: 'สร้าง LOD Chains 3-4 ระดับสำหรับทุก 3D Asset ที่มี Polygons เกิน 5,000 Triss',
        metricBenefit: 'ลด Bandwidth ของ VRAM ลงกว่า 65%',
        relatedSubtopics: ['Nanite Virtualized Geometry', 'Texture Streaming Pool', 'Anisotropic Filtering']
      }
    ],
    goldenRules: [
      {
        id: 'r-gfx-1',
        ruleTitle: 'ห้ามปล่อยให้ Draw Calls ทะลุเกิน 2,000 ต่อเฟรม',
        explanation: 'ผสาน Mesh ที่ใช้วัสดุเดียวกันเป็น Texture Atlas และใช้ Static/Dynamic Batching',
        benefit: 'ป้องกัน CPU Bottleneck',
        impactLevel: 'CRITICAL'
      },
      {
        id: 'r-gfx-2',
        ruleTitle: 'Mipmap Texture ทุกผืนในเกม 3D',
        explanation: 'หากไม่มี Mipmap GPU จะต้องสุ่ม Sampling จากไฟล์ภาพขนาดใหญ่ทำให้เกิด Cache Miss มหาศาล',
        benefit: 'VRAM Bandwidth +200%',
        impactLevel: 'HIGH'
      }
    ]
  },

  // 3. World & Level Architecture
  world: {
    tabName: 'World & Memory',
    corePhilosophy: 'แบ่งแผนที่เป็น Grid Chunks, สตรีมฉากแบบ Asynchronous จาก SSD สู่ RAM และใช้ Imposters/Billboarding กับวัตถุในระยะไกล',
    suggestions: [
      {
        id: 'world-chunking',
        title: 'World Partitioning & Dynamic Grid Chunking',
        tabId: 'world',
        category: 'Open World Streaming',
        badge: 'RAM -75%',
        summary: 'ตัดแผนที่ขนาดใหญ่เป็นตารางกริด (เช่น 256x256m) โหลดเฉพาะ Chunk ที่ผู้เล่นยืนอยู่และรัศมีรอบข้าง 1-2 ช่อง ทำลาย Chunk ที่อยู่ไกลออกจาก RAM ทันที',
        practicalAction: 'กำหนด Active Ring Buffer และเริ่มโหลด Chunk ถัดไปล่วงหน้าเมื่อผู้เล่นเข้าใกล้ขอบเขต Chunk 80%',
        codeSnippet: `// Dynamic Chunk Coordinate Hash
const chunkX = Math.floor(player.x / CHUNK_SIZE);
const chunkZ = Math.floor(player.z / CHUNK_SIZE);
worldGrid.streamRadius(chunkX, chunkZ, activeRadius = 2);`,
        metricBenefit: 'สร้าง Open World ไร้รอยต่อขนาด 64km² โดยใช้ RAM ไม่เกิน 4GB',
        relatedSubtopics: ['Level Streaming Volumes', 'Seamless Transition Tunnels', 'Origin Re-basing']
      },
      {
        id: 'world-imposters',
        title: '3D Imposters / 2D Billboarding Trees & Foliage',
        tabId: 'world',
        category: 'Foliage & Biomes',
        badge: 'Polygons -90%',
        summary: 'อบโมเดลป่าไม้และอาคารระยะไกลเป็นภาพ 2D Texture Atlas บนแผ่น Quad ที่หันหน้าตามกล้องตลอดเวลา กิน Polygon แทบเป็นศูนย์',
        practicalAction: 'ตั้งค่า Billboard Transition Distance ที่ระยะ 100-150 เมตรจากมุมกล้อง',
        metricBenefit: 'เพิ่มการมองเห็นภูมิทัศน์ไกลสุดลูกหูลูกตาโดยไม่กินสเปกการ์ดจอ',
        relatedSubtopics: ['Octree Spatial Partitioning', 'Occlusion Culling', 'Frustum Culling']
      }
    ],
    goldenRules: [
      {
        id: 'r-world-1',
        ruleTitle: 'ห้ามโหลดฉากใหม่ด้วย Blocking Load Screen',
        explanation: 'ใช้ Background Worker Threads สตรีม Asset แบบ Async เพื่อกำจัดอาการกระตุก (Stuttering)',
        benefit: 'Frame Pacing ลื่นไหล 60-120 FPS',
        impactLevel: 'CRITICAL'
      }
    ]
  },

  // 4. Physics & Simulation
  physics: {
    tabName: 'Physics & Animation',
    corePhilosophy: 'ใช้ Primitive Hitboxes (Capsule/Sphere), ปิด Solver ด้วย Auto-Sleep และใช้ Deterministic Fixed Timestep (50-60Hz)',
    suggestions: [
      {
        id: 'phys-sleep-cull',
        title: 'Physics Auto-Sleep State & Distance Culling',
        tabId: 'physics',
        category: 'Rigidbodies & Solvers',
        badge: 'CPU Solvers -70%',
        summary: 'เมื่อความเร็วของ Rigidbody ลดลงต่ำกว่า Threshold ให้เปลี่ยนสถานะเป็น Sleeping เพื่อตัดออกจาก Solver Loop และ Cull วัตถุที่อยู่ไกลเกินระยะโต้ตอบ',
        practicalAction: 'ตั้งค่า Linear/Angular Sleep Threshold ให้เหมาะสม และกำหนด Max Simulation Distance ไม่เกิน 150m',
        codeSnippet: `// Physics Body Auto-Sleep Evaluation
if (body.velocity.lengthSquared() < 0.001 && body.angularVelocity.lengthSquared() < 0.001) {
  body.putToSleep(); // Completely skips solver matrix calculations
}`,
        metricBenefit: 'ลดเวลาประมวลผลของ Physics Thread ลง 70%',
        relatedSubtopics: ['Continuous Collision Detection (CCD)', 'Spatial Hash Grids', 'Broadphase Sweep and Prune']
      },
      {
        id: 'phys-primitives',
        title: 'Bone-Parented Capsule/Box Hitbox Primitives',
        tabId: 'physics',
        category: 'Collision & Combat',
        badge: 'Math Ops -99%',
        summary: 'ห้ามใช้ MeshCollider กับตัวละครที่เคลื่อนไหว ให้ใช้ Capsule/Box 12-14 ชิ้นผูกกับกระดูก เพราะการยิง Raycast เทียบกับ Capsule ใช้สมการทางคณิตศาสตร์เพียง 1 สเต็ป',
        practicalAction: 'สร้าง Ragdoll Bone Proxy Collider แทนการคำนวณ Polygons จริง',
        metricBenefit: 'รองรับการยิงกระสุน 1,000+ นัดพร้อมกันโดยไม่เกิด Frame Drop',
        relatedSubtopics: ['Raycast Buffering', 'Sub-stepping Solvers', 'Euphoria Ragdoll Dynamics']
      }
    ],
    goldenRules: [
      {
        id: 'r-phys-1',
        ruleTitle: 'รันฟิสิกส์ใน Fixed Timestep คงที่เสมอ',
        explanation: 'ห้ามคูณ DeltaTime แปรผันในฟิสิกส์หลัก เพื่อป้องกันการทะลุกำแพง (Tunneling) และผลลัพธ์ไม่เสถียร',
        benefit: 'ผลลัพธ์การเคลื่อนที่แน่นอน 100%',
        impactLevel: 'CRITICAL'
      }
    ]
  },

  // 5. Netcode & Multiplayer Server
  network: {
    tabName: 'Netcode & Server',
    corePhilosophy: 'Server Authoritative เสมอ, ใช้ Client Prediction + Server Reconciliation, ทำ Snapshot Interpolation และบีบอัดข้อมูลด้วย Delta Compression',
    suggestions: [
      {
        id: 'net-prediction-recon',
        title: 'Client-Side Prediction & Server Reconciliation',
        tabId: 'network',
        category: 'Movement & Latency',
        badge: 'Zero Input Lag',
        summary: 'ให้เครื่อง Client เคลื่อนที่ทันทีตาม Input ของผู้เล่นโดยไม่ต้องรอเซิร์ฟเวอร์ตอบกลับ เมื่อเซิร์ฟเวอร์ส่ง State กลับมา ให้นำมา Reconcile และแก้เฉพาะส่วนที่เบี่ยงเบน',
        practicalAction: 'เก็บ Input History Buffer พร้อม Sequence Number ฝั่ง Client ไว้ 64 Ticks ล่าสุด',
        codeSnippet: `// Client Prediction Buffer
inputs.push({ seq: currentSeq++, delta, moveVector });
applyLocalMovement(moveVector, delta);
// On server ack:
reconcileState(serverAckSeq, serverAuthoritativePosition);`,
        metricBenefit: 'ผู้เล่นรู้สึกตอบสนองทันที 0ms แม้มี Ping สูงถึง 150ms',
        relatedSubtopics: ['Snapshot Interpolation (Hermite Splines)', 'Lag Compensation Hitscan', 'Dead Reckoning']
      },
      {
        id: 'net-delta-compression',
        title: 'Delta Compression & Spatial Interest Management',
        tabId: 'network',
        category: 'Packets & Bandwidth',
        badge: 'Bandwidth -85%',
        summary: 'ส่งเฉพาะผลต่าง (Delta) ของตัวแปรที่มีการเปลี่ยนแปลง และส่งแพ็กเก็ตเฉพาะ Entity ที่อยู่ในระยะสายตา (Relevancy Range) ของผู้เล่นแต่ละคนเท่านั้น',
        practicalAction: 'ใช้ Bitmask ระบุฟิลด์ที่มีการเปลี่ยนแปลง และใช้ Octree ในการกรอง Entity รายบุคคล',
        metricBenefit: 'ลดปริมาณการรับส่งข้อมูลของผู้เล่นลงเหลือเพียง 15-25 KB/s',
        relatedSubtopics: ['Reliable UDP Protocol', 'Rollback Netcode', 'Tickrate Throttling']
      }
    ],
    goldenRules: [
      {
        id: 'r-net-1',
        ruleTitle: 'อย่าเชื่อข้อมูลจาก Client (Never Trust The Client)',
        explanation: 'การคำนวณดาเมจ, เงินในเกม, และการเกิดของไอเทม ต้องยืนยันบนเซิร์ฟเวอร์เสมอเพื่อป้องกันการแฮก',
        benefit: 'ความปลอดภัยและป้องกันโกง 100%',
        impactLevel: 'CRITICAL'
      }
    ]
  },

  // 6. Offline AI & Machine Learning
  offline_ai: {
    tabName: 'Offline AI Toolchains',
    corePhilosophy: 'ใช้โมเดล Quantized 4-bit (GGUF/ONNX) ออฟไลน์, ทำงานบน NPU/GPU ในเครื่อง, จับคู่ Decision Tree กับ Utility AI สำหรับเกมเพลย์',
    suggestions: [
      {
        id: 'ai-quantization',
        title: '4-bit INT4/GGUF Local Model Execution',
        tabId: 'offline_ai',
        category: 'Local LLMs & NPUs',
        badge: 'VRAM -75%',
        summary: 'บีบอัดพารามิเตอร์ของโมเดล AI จาก 16-bit Floating Point เหลือ 4-bit Integer รันผ่าน ONNX Runtime / WebAssembly แบบออฟไลน์ 100%',
        practicalAction: 'เลือกใช้โมเดลเฉพาะทางขนาดเล็ก (0.5B - 3B Parameters) สำหรับบทสนทนา NPC เพื่อให้ตอบสนองภายใน 150-300ms',
        codeSnippet: `// Local 4-bit Quantized Model Inference Configuration
const sessionOptions = {
  executionProviders: ['webgpu', 'wasm'],
  graphOptimizationLevel: 'all',
  enableQuantizedInference: true // INT4/INT8 accelerated
};`,
        metricBenefit: 'ทำงานได้บนเครื่องทั่วไปโดยไม่ต้องต่ออินเทอร์เน็ตและไม่เปลือง RAM',
        relatedSubtopics: ['Whisper Local STT', 'Piper Neural TTS', 'Vector Embeddings Cache']
      },
      {
        id: 'ai-utility-behavior',
        title: 'Behavior Trees & Utility AI Hybridization',
        tabId: 'offline_ai',
        category: 'NPC Intelligence',
        badge: 'Decision Time < 1ms',
        summary: 'ใช้ Behavior Tree คุมลำดับเงื่อนไขหลัก และใช้ Utility Curve คำนวณความต้องการของบอท (เช่น หิว, กลัว, ต้องการที่กำบัง) เพื่อพฤติกรรมที่เป็นธรรมชาติ',
        practicalAction: 'ประเมิน Utility Score ของ Action ต่างๆ แล้วเลือก Action ที่ได้คะแนนสูงสุดตามสถานการณ์',
        metricBenefit: 'บอท 500 ตัวสามารถตัดสินใจได้พร้อมกันในเวลาต่ำกว่า 1.5ms ต่อเฟรม',
        relatedSubtopics: ['Hierarchical Task Network (HTN)', 'GOAP Goal Oriented Planning', 'NavMesh Query Caching']
      }
    ],
    goldenRules: [
      {
        id: 'r-ai-1',
        ruleTitle: 'แคชผลลัพธ์การนำทาง (NavMesh Path Caching)',
        explanation: 'ห้ามค้นหาเส้นทาง A* ทุกเฟรม ให้ Repath เฉพาะเมื่อเป้าหมายเคลื่อนที่เกินระยะปลอดภัย',
        benefit: 'ประหยัด CPU AI Cycle 80%',
        impactLevel: 'HIGH'
      }
    ]
  },

  // 7. Data Architecture, Memory & Serialization
  data: {
    tabName: 'Data & Storage',
    corePhilosophy: 'ใช้ Data-Oriented Design (DoD / ECS) เรียงข้อมูลใน Memory แบบ Struct of Arrays (SoA) เพื่อรองรับ CPU Cache L1/L2 และบีบอัด Save State ด้วย LZ4/Zstandard',
    suggestions: [
      {
        id: 'data-soa-ecs',
        title: 'Data-Oriented Design & Struct of Arrays (SoA)',
        tabId: 'data',
        category: 'Memory & Cache Locality',
        badge: 'L1 Cache Hit 98%',
        summary: 'แทนที่จะสร้าง Array of Objects (AoS) เช่น `[Player1, Player2]` ให้แยกเป็น `Positions[]`, `Velocities[]` ต่อเนื่องกันใน Memory เพื่อให้ CPU ดึงเข้า Cache Line เดียวได้ทั้งชุด',
        practicalAction: 'จัดโครงสร้างข้อมูล Component แบบ Flat TypedArray (Float32Array / Uint32Array)',
        codeSnippet: `// Struct of Arrays (SoA) in TypedArrays
const positionsX = new Float32Array(MAX_ENTITIES);
const positionsY = new Float32Array(MAX_ENTITIES);
const velocitiesX = new Float32Array(MAX_ENTITIES);
// SIMD CPU executes thousands of updates in 1 burst
for (let i = 0; i < count; i++) {
  positionsX[i] += velocitiesX[i] * dt;
}`,
        metricBenefit: 'ความเร็วในการคำนวณ Entity สูงขึ้น 10-50 เท่าเมื่อเทียบกับ OOP ธรรมดา',
        relatedSubtopics: ['Memory Pooling', 'SIMD Vectorization', 'Zero-Allocation Loops']
      },
      {
        id: 'data-compression-lz4',
        title: 'Binary FlatBuffers & Fast LZ4 Compression',
        tabId: 'data',
        category: 'Serialization & Save Games',
        badge: 'Disk I/O 50x Faster',
        summary: 'หลีกเลี่ยงการใช้ JSON ขนาดใหญ่สำหรับ Save State ใช้ Binary Serialization (เช่น FlatBuffers หรือ MessagePack) พร้อมบีบอัดด้วย LZ4 เพื่อการเซฟ/โหลดที่รวดเร็วระดับเสี้ยววินาที',
        practicalAction: 'เซฟข้อมูลเป็น Uint8Array Binary Stream และใช้ Ring Buffer ป้องกัน Garbage Collection',
        metricBenefit: 'ขนาดไฟล์เซฟลดลง 80-90% และโหลดเสร็จในเวลาไม่ถึง 10ms',
        relatedSubtopics: ['Schema Migration', 'Checksum Verification', 'Transactional Auto-Save']
      }
    ],
    goldenRules: [
      {
        id: 'r-data-1',
        ruleTitle: 'กำจัด Garbage Collection ใน Game Loop',
        explanation: 'ห้ามสร้าง `new Object()` หรือ `new Array()` ภายใน Update Loop ให้ใช้ Object Pooling หมุนเวียนใช้ซ้ำ',
        benefit: 'ขจัดอาการค้างตึก (Zero Stutter)',
        impactLevel: 'CRITICAL'
      }
    ]
  },

  // 8. Gameplay Dynamics & Feel
  dynamic: {
    tabName: 'Gameplay Dynamics',
    corePhilosophy: 'สร้างความรู้สึกบังคับที่นุ่มนวลและยุติธรรมด้วย Coyote Time, Input Buffering, Jump Apex Float และ Dynamic Difficulty Adjustment (DDA)',
    suggestions: [
      {
        id: 'dyn-coyote-buffer',
        title: 'Coyote Time & Multi-Frame Input Buffering',
        tabId: 'dynamic',
        category: 'Game Feel & Controls',
        badge: 'Responsiveness +100%',
        summary: 'ให้สิทธิ์ผู้เล่นกดกระโดดได้แม้หลุดขอบผาไปแล้ว 6-8 เฟรม (Coyote Time) และจดจำปุ่มกดล่วงหน้า (Input Buffer) เพื่อให้ท่าต่อสู้หรือการหลบหลีกทำงานทันทีที่ท่าปัจจุบันจบลง',
        practicalAction: 'ตั้งค่า Coyote Window ไว้ที่ 0.1 - 0.15 วินาที และ Input Buffer ไว้ที่ 0.12 วินาที',
        codeSnippet: `// Coyote Time & Jump Buffer Logic
if (isGrounded) lastGroundedTime = currentTime;
if (jumpPressed) lastJumpPressTime = currentTime;

if (currentTime - lastJumpPressTime <= BUFFER_WINDOW && currentTime - lastGroundedTime <= COYOTE_WINDOW) {
  executeJump();
  lastJumpPressTime = 0; // Consume
}`,
        metricBenefit: 'เกมเพลย์ลื่นไหล ขจัดความรู้สึกกดไม่ติดหรือตายแบบไม่เป็นธรรม',
        relatedSubtopics: ['Variable Jump Heights', 'Apex Gravity Easing', 'Corner Correction']
      }
    ],
    goldenRules: [
      {
        id: 'r-dyn-1',
        ruleTitle: 'ตอบสนองต่อ Input ของผู้เล่นในเฟรมเดียวกัน',
        explanation: 'ประมวลผล Input ตอนต้นเฟรมเสมอเพื่อป้องกัน Input Delay ข้ามเฟรม',
        benefit: 'ความแม่นยำของการควบคุมสูงสุด',
        impactLevel: 'HIGH'
      }
    ]
  },

  // 9. VR / XR Architecture
  vr: {
    tabName: 'VR / XR Architecture',
    corePhilosophy: 'เรนเดอร์แบบ Single Pass Instancing, ทำ Foveated Rendering ตามสายตา, ใช้ PID Controller คุมมือฟิสิกส์ และรักษา Frame Time ภายใน 11.1ms (90Hz)',
    suggestions: [
      {
        id: 'vr-single-pass',
        title: 'Single Pass Instanced Stereoscopic Rendering',
        tabId: 'vr',
        category: 'VR Graphics Pipeline',
        badge: 'DrawCalls -50%',
        summary: 'ส่ง Geometry ไปที่ GPU เพียงรอบเดียวและใช้ Layered Viewports สำหรับตาซ้ายและตาขวาพร้อมกัน แทนที่จะเรนเดอร์ฉาก 2 รอบแบบดั้งเดิม',
        practicalAction: 'เปิดใช้งาน OpenXR Stereo Instancing ใน Render Settings',
        metricBenefit: 'ประหยัดเวลา CPU ในการ Dispatch งานลงถึงครึ่งหนึ่ง',
        relatedSubtopics: ['Dynamic Foveated Rendering', 'Asynchronous SpaceWarp (ASW)', 'Hidden Area Mesh']
      },
      {
        id: 'vr-pid-physics',
        title: 'Tactile VR Physics & PID Hand Controllers',
        tabId: 'vr',
        category: 'VR Immersion & Hands',
        badge: 'Realistic Mass',
        summary: 'จำลองน้ำหนักของสิ่งของเสมือนด้วย Rigidbody ที่วิ่งตามมือจริงผ่านสมการสปริง PID เพื่อให้ความรู้สึกมีมวลและไม่ทะลุสิ่งกีดขวาง',
        practicalAction: 'ปรับค่า Proportional, Integral, Derivative ให้มือเสมือนตามมือจริงอย่างนุ่มนวล',
        metricBenefit: 'เพิ่มความสมจริงของการหยิบจับและป้องกันอาการเมารถใน VR',
        relatedSubtopics: ['Full-Body VRIK', 'Mixed Reality Passthrough', 'Spatial Haptics']
      }
    ],
    goldenRules: [
      {
        id: 'r-vr-1',
        ruleTitle: 'ห้ามเฟรมตกต่ำกว่า 90 FPS ใน VR เด็ดขาด',
        explanation: 'Frame Rate ที่ไม่นิ่งใน VR จะกระตุ้นอาการคลื่นไส้ (Motion Sickness) แก่ผู้เล่นโดยตรง',
        benefit: 'ความสบายตาและความปลอดภัยของผู้ใช้',
        impactLevel: 'CRITICAL'
      }
    ]
  },

  // 10. Advanced AI & ECS Architecture
  advanced: {
    tabName: 'Advanced AI & ECS',
    corePhilosophy: 'แยก Logic กับ Data ออกจากกันด้วย Archetype ECS, ใช้ Multi-Threaded Job System กระจายงานทุก CPU Core และประมวลผลด้วย Cache-Friendly Patterns',
    suggestions: [
      {
        id: 'adv-job-system',
        title: 'Multi-Threaded Worker Job System',
        tabId: 'advanced',
        category: 'Parallel Computing',
        badge: 'Multi-Core 100%',
        summary: 'กระจายงานขนาดใหญ่ (เช่น การเคลื่อนที่ของยูนิต, การหาเส้นทาง, การคำนวณกระสุน) ออกเป็น Job ย่อยๆ รันบน Web Workers / Worker Threads ทุกคอร์ของ CPU',
        practicalAction: 'แยก System ที่ไม่มี Data Dependency ให้รันขนานกันอย่างอิสระ',
        metricBenefit: 'ดึงศักยภาพของ CPU หลายคอร์มาใช้ได้เต็ม 100%',
        relatedSubtopics: ['Entity Component System', 'Sparse Sets vs Archetypes', 'Lock-Free Queues']
      }
    ],
    goldenRules: [
      {
        id: 'r-adv-1',
        ruleTitle: 'หลีกเลี่ยง Race Conditions ด้วย Read/Write Locks',
        explanation: 'Jobs ที่อ่านข้อมูลพร้อมกันได้ แต่ Job ที่เขียนข้อมูลต้องรันแบบ Exclusive เสมอ',
        benefit: 'ความถูกต้องของข้อมูลและป้องกัน Memory Corruption',
        impactLevel: 'CRITICAL'
      }
    ]
  },

  // 11. Backend & Cloud Infrastructure
  backend: {
    tabName: 'MMO Backend & Cloud',
    corePhilosophy: 'แยก Server ตาม Spatial Region (Sharding), ใช้ Redis สำหรับ In-Memory Cache, และยืนยันความปลอดภัยด้วย Server Authority',
    suggestions: [
      {
        id: 'bk-spatial-sharding',
        title: 'Spatial Server Handoff & Micro-Sharding',
        tabId: 'backend',
        category: 'MMO Architecture',
        badge: 'Zero World Limits',
        summary: 'แบ่งโลกทั้งใบออกเป็นโหนดเซิร์ฟเวอร์ย่อยๆ เมื่อผู้เล่นข้ามพรมแดนระบบจะส่งต่อ Entity State ข้ามเซิร์ฟเวอร์แบบไร้รอยต่อ',
        practicalAction: 'ใช้ Redis Pub/Sub และ WebSocket Cluster ในการส่งต่อ State',
        metricBenefit: 'รองรับผู้เล่นหลักแสนคนในโลกใบเดียวกันได้อย่างเสถียร',
        relatedSubtopics: ['Distributed Redis Cache', 'Anti-Cheat Token Validation', 'Auto-scaling Pods']
      }
    ],
    goldenRules: [
      {
        id: 'r-bk-1',
        ruleTitle: 'ออกแบบ State ให้เป็น Stateless หรือ Replicable',
        explanation: 'เพื่อให้สามารถ Restart เซิร์ฟเวอร์หรือขยาย Scale ได้ทันทีโดยผู้เล่นไม่หลุดจากเกม',
        benefit: 'System Uptime 99.99%',
        impactLevel: 'HIGH'
      }
    ]
  },

  // 12. Post-Processing & Screen Effects
  postprocess: {
    tabName: 'Post-Processing',
    corePhilosophy: 'รวม Pass ต่างๆ เข้าด้วยกัน (Single Combined Uber-Shader) เพื่อลด Memory Bandwidth และใช้ ACES Color Grading สำหรับสีที่ถูกต้อง',
    suggestions: [
      {
        id: 'pp-uber-shader',
        title: 'Uber Post-Process Shader Integration',
        tabId: 'postprocess',
        category: 'Screen Effects',
        badge: 'Blit Passes -70%',
        summary: 'แทนที่จะ Render Bloom, Tonemapping, Vignette, Color Grading แยกคนละ Pass ให้รวมทั้งหมดไว้ใน Fragment Shader เดียวกันเพื่อลดการอ่าน/เขียน Framebuffer',
        practicalAction: 'สร้าง Shader Chain ที่ประมวลผลเอฟเฟกต์สีและแสงใน Pass สุดท้ายครั้งเดียว',
        metricBenefit: 'ประหยัด GPU Memory Fillrate ได้มากกว่า 70%',
        relatedSubtopics: ['ACES Tonemapping', 'Bloom Downsample/Upsample Pyramid', 'Film Grain Dithering']
      }
    ],
    goldenRules: [
      {
        id: 'r-pp-1',
        ruleTitle: 'ลดขนาด Texture ตอนคำนวณ Bloom',
        explanation: 'ดาวน์สเกลภาพเป็น 1/2, 1/4, 1/8 ก่อนทำ Gaussian Blur แล้วค่อยนำมา Additive Blend คืน',
        benefit: 'ความเร็ว Bloom สูงขึ้น 4 เท่า',
        impactLevel: 'HIGH'
      }
    ]
  },

  // 13. UI/UX & Visual Polish
  visual: {
    tabName: 'Level Design & Vision',
    corePhilosophy: 'ใช้ Contrast และแสงนำสายตา (Breadcrumbing & Weanies), จัด UI เป็น Batch Draw Calls เดียว และแบ่ง Safe Zones ชัดเจน',
    suggestions: [
      {
        id: 'ui-canvas-batch',
        title: 'UI Draw Call Batching & Sub-Canvas Isolation',
        tabId: 'visual',
        category: 'UI/UX & Canvas',
        badge: 'UI Render 60 FPS',
        summary: 'แยก UI ที่อยู่นิ่ง (Static Canvas เช่น กรอบหน้าต่าง) ออกจาก UI ที่ขยับตลอดเวลา (Dynamic Canvas เช่น ตัวเลขเลือด/พิกัด) เพื่อไม่ให้ทั้ง Canvas ต้อง Re-batch ทุกเฟรม',
        practicalAction: 'สร้าง Multi-Layer Canvas ซ้อนกัน โดยอัปเดตเฉพาะ Layer ที่มีการเปลี่ยนแปลง',
        metricBenefit: 'ลดภาระ CPU ในการคำนวณ UI Layout ลง 90%',
        relatedSubtopics: ['Font Atlas Caching', 'Safe-zone Device Clipping', 'Cognitive Load Reduction']
      }
    ],
    goldenRules: [
      {
        id: 'r-ui-1',
        ruleTitle: 'ใช้ Single Texture Atlas สำหรับ UI Sprites ทั้งหมด',
        explanation: 'รวมไอคอนและปุ่มทั้งหมดในหน้าจอลงในภาพเดียวเพื่อเรนเดอร์ UI ทั้งหมดใน 1 Draw Call',
        benefit: 'UI Draw Calls เหลือเพียง 1-2 Calls',
        impactLevel: 'HIGH'
      }
    ]
  },

  // 14. Game Archetypes
  archetypes: {
    tabName: 'Game Archetypes',
    corePhilosophy: 'เลือกโครงสร้างเอนจินให้ตรงกับแนวเกม เช่น MMORPG (Spatial Hashing), Action RPG (GAS/State Machine), Battle Royale (Deterministic Tickrate)',
    suggestions: [
      {
        id: 'arch-matching',
        title: 'Archetype-Specific Architecture Matrix',
        tabId: 'archetypes',
        category: 'Core Game Engines',
        badge: 'Architecture Fit 100%',
        summary: 'โครงสร้างสถาปัตยกรรมเฉพาะทางตามประเภทเกม เช่น Fighting Games ต้องใช้ Deterministic Frame-by-Frame Lockstep ขณะที่ Open World ต้องใช้ Hierarchical Streaming',
        practicalAction: 'เลือก Subsystem Core ให้ตรงกับความต้องการหลักของประเภทเกมที่กำลังสร้าง',
        metricBenefit: 'ป้องกันการรื้อโค้ดสถาปัตยกรรมกลางคันในระยะยาว',
        relatedSubtopics: ['Gameplay Ability System (GAS)', 'Fighting Game Rollback', 'Open World Memory Budgets']
      }
    ],
    goldenRules: [
      {
        id: 'r-arch-1',
        ruleTitle: 'กำหนด Performance Budget ตั้งแต่วันแรก',
        explanation: 'กำหนดโควตา Frame Time (16.6ms for 60FPS), RAM (max 4GB), และ Draw Calls ไม่ให้เกินเกณฑ์',
        benefit: 'เกมเสร็จตรงสเปกและไม่แล็ก',
        impactLevel: 'CRITICAL'
      }
    ]
  }
};

/**
 * แผนที่การจับคู่ Tool ID โดยตรงสู่ Encyclopedia Tab ID
 */
const TOOL_TO_TAB_MAP: Record<string, string> = {
  // Audio, DAW, Voice, Dubbing
  OmniMusicVocalDAWStudio: 'audio',
  ThaiVoiceDubbingStudio: 'audio',
  NaturalVocalVoiceStudio: 'audio',
  VoiceActorAI: 'audio',
  OmniAudioStudio: 'audio',
  OmniAudioDSPStudio: 'audio',
  SpatialAudioFoley: 'audio',
  SpatialAudioFoleyStudio: 'audio',
  SpatialAudioMixer: 'audio',
  VoiceQualityAssuranceStudio: 'audio',
  AudioCompressor: 'audio',
  AudioMixingConsole: 'audio',
  ProceduralAudioGen: 'audio',
  AdvancedAudioEditor: 'audio',
  AIOfflineVocalMusicWorkstation: 'audio',

  // Graphics, Shaders, Textures, Materials
  OmniTextureCinematicStudio: 'graphics',
  TextureEdit: 'graphics',
  TextureEditor: 'graphics',
  AdvancedShaderEditor: 'graphics',
  VisualShaderGraphEditor: 'graphics',
  PBRMaterialGraph: 'graphics',
  PBRTextureQualityAuditor: 'graphics',
  SubstanceStyleTexturePainter: 'graphics',
  AITextureGenerator: 'graphics',
  TextureCompressor: 'graphics',
  MaterialInstanceEditor: 'graphics',
  MaterialEditor: 'graphics',
  ReflectionProbeManager: 'graphics',
  LightmapBakerStudio: 'graphics',
  DecalProjectorManager: 'graphics',
  RaytracingConfigurator: 'graphics',
  GlobalIlluminationTuner: 'graphics',
  RuntimeGraphicsStreamingOptimizer: 'graphics',
  PhotorealisticRenderSettings: 'graphics',
  GraphicsRender: 'graphics',
  GraphicsRenderEditor: 'graphics',
  LODManager: 'graphics',

  // World, Terrain, Biome, Maps
  OmniWorldMapStudio: 'world',
  OmniWorldBuilder: 'world',
  OmniMegaWorldBuilder: 'world',
  TerrainEditor: 'world',
  TerrainGenerator: 'world',
  TerrainImportUtility: 'world',
  BiomeFoliageGenerator: 'world',
  ProceduralTerrainErosionSimulator: 'world',
  ProceduralDungeonGenerator: 'world',
  ProceduralCityGenerator: 'world',
  ProceduralGalaxyBuilder: 'world',
  AdvancedPCGEngine: 'world',
  PCGEditor: 'world',
  NavMeshBakingStudio: 'world',
  NavMeshRouter: 'world',
  MapEdit: 'world',
  MapTerrainEditor: 'world',
  MapBiomeEditor: 'world',
  MapEnvironmentEditor: 'world',
  MapPCGEditor: 'world',

  // Physics, Simulation, Destruction
  DeterministicEngineeringSuite: 'physics',
  ChaosPhysicsFluidEngine: 'physics',
  ChaosDestructionLab: 'physics',
  DestructibleMeshEditor: 'physics',
  DestructionFractureEditor: 'physics',
  FluidDynamicsSimulator: 'physics',
  SoftBodyPhysicsTuner: 'physics',
  VehicleDynamicsTuner: 'physics',
  VehicleDynamicsEditor: 'physics',
  VehicleRiggingEditor: 'physics',
  ActiveRagdollEuphoriaEngine: 'physics',
  AdvancedPhysicsEngine: 'physics',
  AdvancedPhysicsLab: 'physics',
  PhysicsAssetEditor: 'physics',
  PhysicsDebuggerPanel: 'physics',
  InverseKinematicsDebugger: 'physics',

  // Netcode, Multiplayer, Backend, Dedicated Servers
  MultiplayerServerOrchestrator: 'network',
  DedicatedServerConfig: 'network',
  NetworkPacketAnalyzer: 'network',
  NetworkReplicationSim: 'network',
  NetworkSim: 'network',
  NetcodeEditor: 'network',
  MultiplayerRelevancyGraph: 'network',
  ServerNetworkProfiler: 'network',
  AntiCheatSecurityHub: 'network',
  AdvancedSecuritySystem: 'network',
  OmniBackendNetworkingStudio: 'network',

  // Offline AI, Machine Learning, Copilots, Bots
  OmniMegaEngine300Studio: 'offline_ai',
  OfflineAIEngineSuite: 'offline_ai',
  OfflineAIDataEngineManager: 'offline_ai',
  AIOfflineDownloader: 'offline_ai',
  AICodeAgentStudio: 'offline_ai',
  OfflineAICodingAssistant: 'offline_ai',
  LocalAIStudio: 'offline_ai',
  MachineLearningIntegration: 'offline_ai',
  MLAgentsEditor: 'offline_ai',
  OfflineAIContinuousErrorLearningStudio: 'offline_ai',
  UniversalInFlightWatchdogView: 'offline_ai',
  InteractiveDebuggerStudio: 'offline_ai',
  AINPCBehaviorTreeEditor: 'offline_ai',
  BehaviorTreeEditor: 'offline_ai',
  AIBehaviorGraphEngine: 'offline_ai',
  AIWorkflowEditor: 'offline_ai',
  AIOfflineModelGenerator: 'offline_ai',
  AIOfflineImageGenerator: 'offline_ai',
  AIOfflineMapGenerator: 'offline_ai',
  AIOfflineUIUXGenerator: 'offline_ai',
  BatchAIImporter: 'offline_ai',
  AIChat: 'offline_ai',

  // 3D Modeling, Mesh, CAD, PCB
  Omni3D2DVRModelStudio: 'graphics',
  Modeling: 'graphics',
  ModelingEditor: 'graphics',
  Offline3DModeler: 'graphics',
  ZBrushStyleSculptingStudio: 'graphics',
  ZSculptEngine: 'graphics',
  TopologyUVPro: 'graphics',
  UVMappingStudio: 'graphics',
  OmniPCBDesignStudio: 'graphics',
  ElectronicCircuitPCBStudio: 'graphics',
  AIOfflinePCBStudio: 'graphics',
  Photogrammetry3DScanner: 'graphics',
  PhotogrammetryMeshBuilder: 'graphics',
  ModelOptimizer: 'graphics',

  // Animation, Cinematics, Sequencer
  Sequencer: 'graphics',
  CinematicSequencerEditor: 'graphics',
  CinematicTimelineSequencer: 'graphics',
  CinematicDirector: 'graphics',
  CutsceneEditor: 'graphics',
  CinematicCameraRig: 'graphics',
  OmniAnimationStudio: 'graphics',
  AnimationRiggingStudio: 'graphics',
  CharacterRiggingIK: 'graphics',
  FacialAnimationMocap: 'graphics',
  LipSyncAutomator: 'graphics',
  MotionCaptureStudio: 'graphics',
  MotionMatchingStudio: 'graphics',
  AdvancedAnimationBlender: 'graphics',
  SpriteAnimationEditor: 'graphics',
  SpriteSheetGen: 'graphics',

  // Game Systems, Narrative, Quests, Economy
  OmniGameCreationStudio: 'archetypes',
  GameSystems: 'archetypes',
  GameSystemsEditor: 'archetypes',
  GameplayAbilitySystem: 'archetypes',
  EconomicBalancer: 'data',
  GameEconomyBalancer: 'data',
  EconomyMonetization: 'data',
  EconomyLiveOpsEditor: 'data',
  LootTableEditor: 'data',
  CraftingRecipeManager: 'data',
  DamageCalculationConfig: 'dynamic',
  NPCEdit: 'offline_ai',
  NPCEditor: 'offline_ai',
  MonsterEdit: 'offline_ai',
  MonsterEditor: 'offline_ai',
  WorldLore: 'data',
  WorldLoreEditor: 'data',
  QuestDesigner: 'data',
  QuestMissionBuilder: 'data',
  AIQuestDialogueGraph: 'data',
  AdvancedDialogueSystem: 'data',
  AchievementSystemEditor: 'data',
  SkillTreeLevelingConfig: 'dynamic',
  FactionReputationSystem: 'data',
  OmniLocalizationStudio: 'data',
  DialogueLocalizationStudio: 'data',
  AdvancedLocalizationSystem: 'data',

  // Code IDE, Scripting, Visual Blueprints
  OmniSoftwareIDEStudio: 'data',
  CodeEditor: 'data',
  ScriptEditor: 'data',
  VisualScripting: 'advanced',
  VisualScriptEditor: 'advanced',
  VisualScriptingBlueprint: 'advanced',
  AdvancedNodeGraphEditor: 'advanced',
  StateLogicGraph: 'advanced',
  CodeProfilerTracer: 'data',
  ModuleDependencyVisualizerStudio: 'data',
  ASTNodeWeaver: 'data',

  // UI/UX, Interface, Safe Zones, DevOps
  MegaUIUXMasterStudio: 'visual',
  UIUXEdit: 'visual',
  UIUXEditor: 'visual',
  UXUISimulatorTestbed: 'visual',
  FigmaStyleCanvas: 'visual',
  VectorUIDesigner: 'visual',
  VectorHybrid: 'visual',
  DataTableJSONEditor: 'data',
  DataTableEditor: 'data',
  StateSerializationManager: 'data',
  GameSaveManager: 'data',
  DatabaseMigrationTool: 'data',
  CSVXMLImporter: 'data',
  BuildPublishAudit: 'data',
  BuildPublish: 'data',
  BuildPublishEditor: 'data',
  CrossPlatformBuildTargeter: 'data',
  CloudBuildPipeline: 'data',
  VersionControlUI: 'data',
  VersionControlStudio: 'data',
  GitPanel: 'data',
  PerformanceDashboard: 'data',
  PerformanceProfiler: 'data',
  GameEngineProfiler: 'data',
  MemoryProfiler: 'data',
  HardwareResourceOptimizer: 'data',

  // Flagship & Master Hubs
  OmniMasterCreatorSuite: 'archetypes',
  OmniCreatorMaster: 'archetypes',
  ProjectHub: 'archetypes',
  ProjectManagementSystem: 'archetypes',
  ProjectProgressDashboard: 'archetypes',
  LiveOpsManager: 'data',
  RemoteConfigABTesting: 'data',

  // VFX & Particles
  OmniVFXStudio: 'graphics',
  UltimateEffectVFXStudio: 'graphics',
  OmniVFXParticleStudio: 'graphics',
  OmniVFXCompositorStudio: 'graphics',
  ParticleEffectEditor: 'graphics',
  VFXNiagaraGraph: 'graphics',
  PostProcessVFXChain: 'postprocess',
  PostProcessingStack: 'postprocess',
  CinematicLightingEditor: 'graphics',
  VolumetricCloudAtmosphere: 'graphics',
  VolumetricCloudEditor: 'graphics',
  WeatherAtmosphereEditor: 'graphics'
};

/**
 * ฟังก์ชันหลักในการดึงคำแนะนำเชิงลึกตาม Tool ID ที่กำลังเปิดใช้งาน
 * @param toolId ID ของเครื่องมือปัจจุบัน
 * @param toolsList รายการโครงสร้างเครื่องมือทั้งหมด (Optional)
 * @returns ToolOptimizationContext ข้อมูลคำแนะนำและกฎการออกแบบที่ตรงกับบริบท
 */
export function getOptimizationAdviceForTool(toolId: string, toolsList?: any[]): ToolOptimizationContext {
  const safeId = toolId || 'OmniCreatorMaster';
  
  // 1. Direct Map
  let matchedTabId = TOOL_TO_TAB_MAP[safeId];

  // 2. Fuzzy Keyword Match if not mapped directly
  if (!matchedTabId) {
    const lower = safeId.toLowerCase();
    if (lower.includes('audio') || lower.includes('voice') || lower.includes('sound') || lower.includes('music') || lower.includes('daw') || lower.includes('dub')) {
      matchedTabId = 'audio';
    } else if (lower.includes('shader') || lower.includes('render') || lower.includes('texture') || lower.includes('material') || lower.includes('light') || lower.includes('graphic') || lower.includes('vfx') || lower.includes('particle')) {
      matchedTabId = 'graphics';
    } else if (lower.includes('physics') || lower.includes('fluid') || lower.includes('chaos') || lower.includes('ragdoll') || lower.includes('vehicle') || lower.includes('dynamics')) {
      matchedTabId = 'physics';
    } else if (lower.includes('world') || lower.includes('terrain') || lower.includes('map') || lower.includes('biome') || lower.includes('pcg') || lower.includes('navmesh')) {
      matchedTabId = 'world';
    } else if (lower.includes('net') || lower.includes('server') || lower.includes('multiplayer') || lower.includes('packet') || lower.includes('replicate')) {
      matchedTabId = 'network';
    } else if (lower.includes('ai') || lower.includes('bot') || lower.includes('npc') || lower.includes('model') || lower.includes('learn') || lower.includes('neural')) {
      matchedTabId = 'offline_ai';
    } else if (lower.includes('vr') || lower.includes('xr') || lower.includes('mocap') || lower.includes('spatial')) {
      matchedTabId = 'vr';
    } else if (lower.includes('ui') || lower.includes('ux') || lower.includes('canvas') || lower.includes('screen') || lower.includes('layout')) {
      matchedTabId = 'visual';
    } else if (lower.includes('code') || lower.includes('script') || lower.includes('ide') || lower.includes('data') || lower.includes('table') || lower.includes('save')) {
      matchedTabId = 'data';
    } else {
      matchedTabId = 'archetypes';
    }
  }

  // 3. Extract Topic Content
  const topic = ENCYCLOPEDIA_TOPICS[matchedTabId] || ENCYCLOPEDIA_TOPICS.archetypes;

  // 4. Resolve Tool Title
  let toolTitle = safeId;
  if (toolsList && Array.isArray(toolsList)) {
    const direct = toolsList.find(t => t.id === safeId);
    if (direct) {
      toolTitle = direct.title;
    } else {
      for (const hub of toolsList) {
        const sub = hub.subTools?.find((st: any) => st.id === safeId);
        if (sub) {
          toolTitle = sub.title;
          break;
        }
      }
    }
  }

  // Determine Primary Highlight Metric
  const primaryMetric = topic.suggestions[0]?.badge || 'Performance +100%';

  return {
    toolId: safeId,
    toolName: toolTitle,
    primaryTabId: matchedTabId,
    tabName: topic.tabName,
    primaryMetricHighlight: primaryMetric,
    corePhilosophy: topic.corePhilosophy,
    suggestions: topic.suggestions,
    goldenRules: topic.goldenRules,
    relatedSearchKeywords: [
      topic.tabName,
      safeId,
      ...topic.suggestions.map(s => s.title),
      ...topic.suggestions.flatMap(s => s.relatedSubtopics)
    ]
  };
}

/**
 * ค้นหาข้อเสนอแนะในสารานุกรมด้วยคำค้นหาอิสระ
 */
export function searchOptimizationEncyclopedia(query: string): OptimizationSuggestion[] {
  if (!query || query.trim() === '') return [];
  const q = query.toLowerCase().trim();
  const results: OptimizationSuggestion[] = [];

  Object.values(ENCYCLOPEDIA_TOPICS).forEach(topic => {
    topic.suggestions.forEach(suggestion => {
      if (
        suggestion.title.toLowerCase().includes(q) ||
        suggestion.summary.toLowerCase().includes(q) ||
        suggestion.category.toLowerCase().includes(q) ||
        suggestion.relatedSubtopics.some(sub => sub.toLowerCase().includes(q))
      ) {
        results.push(suggestion);
      }
    });
  });

  return results;
}
