/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Central Community Plugin Marketplace Registry and Local Storage Repository.
 *          Provides persistent storage, retrieval, installation, version update,
 *          uninstallation, and live execution status management for community-made
 *          engine extensions, scripts, and runtime modules.
 *    - TH: ศูนย์กลางทะเบียนปลั๊กอิน (Plugin Marketplace Registry & Storage)
 *          จัดการคลังส่วนขยาย สคริปต์คอมมูนิตี้ บันทึกสถานะการติดตั้งลง LocalStorage
 *          รองรับการเปิด/ปิด สลับเวอร์ชัน การนำเข้า/ส่งออกแพ็กเกจ .omni-plugin
 *          พร้อมระบบ Hot-Reload ปลั๊กอินแบบเรียลไทม์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Singleton design pattern with reactive Observer event subscriptions
 *    - Integrates with `PluginSecuritySandboxEvaluatorNode.ts` for safety ratings
 *    - Used by `PluginMarketplace.tsx`, `PluginDetailModal.tsx`, and `PluginPublishExtensionModal.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Inputs: pluginId, version, enable flags, custom configuration objects.
 *    - Outputs: Reactive updates on installed plugin states, catalog listings, telemetry.
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Auto-recovers gracefully if localStorage contains malformed JSON.
 *    - Auto-seeds default installed plugins on initial boot.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```ts
 *    import { PluginMarketplaceRegistryNode } from '../utils/PluginMarketplaceRegistryNode';
 *    const registry = PluginMarketplaceRegistryNode.getInstance();
 *    registry.installPlugin('plg_cloth_physics');
 *    ```
 * ============================================================================
 */

import { EnginePlugin, InstalledPluginState } from '../types/pluginMarketplaceTypes';

const STORAGE_KEY_INSTALLED = 'omni_installed_plugins_v1';
const STORAGE_KEY_CUSTOM = 'omni_community_custom_plugins_v1';

export class PluginMarketplaceRegistryNode {
  private static instance: PluginMarketplaceRegistryNode | null = null;
  private communityPlugins: EnginePlugin[] = [];
  private installedMap: Map<string, InstalledPluginState> = new Map();
  private listeners: Set<() => void> = new Set();

  public static getInstance(): PluginMarketplaceRegistryNode {
    if (!this.instance) {
      this.instance = new PluginMarketplaceRegistryNode();
    }
    return this.instance;
  }

  private constructor() {
    this.seedCommunityPlugins();
    this.loadFromStorage();
  }

  /**
   * Subscribe to registry changes
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => {
      try { fn(); } catch (e) { console.error('Error in PluginMarketplace listener:', e); }
    });
  }

  /**
   * Seed curated AAA community extensions
   */
  private seedCommunityPlugins(): void {
    this.communityPlugins = [
      {
        id: 'plg_euphoria_ragdoll',
        name: 'Euphoria Active Ragdoll & Muscle Solver',
        version: '2.4.1',
        author: 'BiomechanicsLabs',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&auto=format&fit=crop&q=80',
        category: 'PHYSICS',
        tagline: 'Real-time biomechanical active ragdolls with dynamic muscle contraction and balance recovery.',
        description: 'Simulates continuous neural muscle impulses, ground reaction forces, and procedural stumble recovery for humanoid and quadruped skeletal rigs.',
        detailedReadmeMarkdown: `# Euphoria Active Ragdoll & Muscle Solver

A studio-grade active ragdoll extension that injects procedural physical behavior directly into your skeletal meshes.

### Core Features
- **Dynamic Balance Preservation:** Inverts center-of-mass momentum upon ballistic impacts.
- **Muscle Stiffness Curves:** Configurable spring-damper joint matrices per bone node.
- **Fall & Stumble Recovery:** Transitions seamlessly back into IK root locomotion.
- **Zero-Pollution Sandbox:** Runs in dedicated WebAssembly/Worker thread with 0 engine state contamination.

### Quick Usage Example
\`\`\`typescript
import { EuphoriaMuscleRig } from 'nexus-plugin/euphoria';

const muscleRig = new EuphoriaMuscleRig(playerMesh);
muscleRig.setMuscleStiffness(0.85);
muscleRig.onImpact((forceVector) => {
  muscleRig.triggerBracePose(forceVector);
});
\`\`\``,
        rating: 4.95,
        ratingCount: 142,
        downloadCount: 8420,
        sizeKb: 340,
        minEngineVersion: 'v3.5.0',
        tags: ['Physics', 'Ragdoll', 'Animation', 'Muscles', 'IK'],
        permissions: ['GPU_COMPUTE', 'MEMORY_PROFILER'],
        securityTier: 'VERIFIED_OFFICIAL',
        securityAuditScore: 98,
        isOfficial: true,
        isFeatured: true,
        entryPointFilename: 'EuphoriaMuscleRig.ts',
        language: 'typescript',
        sourceCodePreview: `export class EuphoriaMuscleRig {
  private joints = new Map<string, { stiffness: number; damping: number }>();
  
  public updateBiomechanicalState(deltaTime: number): void {
    // Verlet impulse muscle damping
    for (const [bone, params] of this.joints) {
      params.stiffness = Math.min(1.0, params.stiffness + deltaTime * 0.1);
    }
  }
}`,
        dependencies: [],
        changelog: [
          { version: '2.4.1', releaseDate: '2026-08-10', highlights: ['Fixed quad-leg stability in low gravity', 'WASM SIMD acceleration'] },
          { version: '2.3.0', releaseDate: '2026-05-18', highlights: ['Added spinal torque balancing'] }
        ],
        runtimeMemoryFootprintKb: 1420,
        estimatedLatencyMs: 0.85,
        updatedAt: '2026-08-10',
        createdAt: '2025-11-12',
        license: 'MIT'
      },
      {
        id: 'plg_volumetric_fog',
        name: 'Photorealistic Volumetric Atmosphere & Raymarched Fog',
        version: '3.1.0',
        author: 'LumenVFX Studio',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&auto=format&fit=crop&q=80',
        category: 'GRAPHICS_SHADERS',
        tagline: 'Dual-scattering raymarched atmospheric volume fog with God rays and anisotropic phase functions.',
        description: 'Delivers cinema-quality atmospheric scattering, Mie-Rayleigh skylight penetration, and temporal reprojection for dense fog and smoky caverns.',
        detailedReadmeMarkdown: `# Photorealistic Volumetric Atmosphere

State-of-the-art volumetric lighting and raymarching shader extension for NexusEngine.

### Visual Capabilities
- **Henyey-Greenstein Phase Scattering:** Realistic directional light scattering forward and backward.
- **God Rays & Shadow Volumes:** Full occlusion with cascaded shadow maps.
- **Temporal Reprojection Jitter:** Temporal anti-aliasing reduces samples while keeping 60 FPS.`,
        rating: 4.88,
        ratingCount: 98,
        downloadCount: 6150,
        sizeKb: 210,
        minEngineVersion: 'v3.6.0',
        tags: ['Shaders', 'Volumetric', 'Lighting', 'GLSL', 'Atmosphere'],
        permissions: ['GPU_COMPUTE'],
        securityTier: 'COMMUNITY_CURATED',
        securityAuditScore: 92,
        isFeatured: true,
        entryPointFilename: 'VolumetricAtmosphere.glsl',
        language: 'glsl',
        sourceCodePreview: `// [Volumetric Rayleigh-Mie Scattering Kernel]
float henyeyGreenstein(float g, float cosTheta) {
  float g2 = g * g;
  return (1.0 - g2) / (4.0 * 3.14159265 * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5));
}`,
        dependencies: [],
        changelog: [
          { version: '3.1.0', releaseDate: '2026-07-22', highlights: ['Bilateral blur depth filter added', 'Support for dynamic fog density volumes'] }
        ],
        runtimeMemoryFootprintKb: 3100,
        estimatedLatencyMs: 1.45,
        updatedAt: '2026-07-22',
        createdAt: '2026-01-05',
        license: 'Apache-2.0'
      },
      {
        id: 'plg_goap_tactical_ai',
        name: 'Hierarchical GOAP Tactical AI Planner',
        version: '1.8.4',
        author: 'NeuroSim Cognitive',
        category: 'AI_BEHAVIOR',
        tagline: 'Goal-Oriented Action Planning (GOAP) engine with A* state search and dynamic tactical cover evaluation.',
        description: 'Enables squad-based tactical maneuvers, flank detection, threat assessment matrices, and dynamic cover-seeking for intelligent hostile agents.',
        detailedReadmeMarkdown: `# Hierarchical GOAP Tactical AI Planner

Unleash deeply intelligent NPC combatants that dynamically plan paths to achieve long-term tactical objectives.

### Features
- **A* State Graph Search:** Automatically resolves prerequisite action chains (e.g. FindAmmo -> Reload -> FlankTarget -> Fire).
- **Squad Blackboard:** Enemies coordinate suppressive fire while teammates flank.
- **Threat Vector Heatmap:** Computes dynamic line-of-sight exposure.`,
        rating: 4.92,
        ratingCount: 76,
        downloadCount: 4210,
        sizeKb: 185,
        minEngineVersion: 'v3.4.0',
        tags: ['AI', 'GOAP', 'Blackboard', 'Tactics', 'Pathfinding'],
        permissions: ['MEMORY_PROFILER'],
        securityTier: 'COMMUNITY_CURATED',
        securityAuditScore: 95,
        entryPointFilename: 'GoapTacticalPlanner.ts',
        language: 'typescript',
        sourceCodePreview: `export class GoapPlanner {
  public plan(startState: Record<string, boolean>, goalState: Record<string, boolean>): Action[] {
    // A* graph search across state-transition space
    return [];
  }
}`,
        dependencies: [],
        changelog: [
          { version: '1.8.4', releaseDate: '2026-06-15', highlights: ['Squad suppression coordination added'] }
        ],
        runtimeMemoryFootprintKb: 890,
        estimatedLatencyMs: 0.32,
        updatedAt: '2026-06-15',
        createdAt: '2025-09-20',
        license: 'MIT'
      },
      {
        id: 'plg_rollback_netcode',
        name: 'Deterministic Rollback Netcode & Lockstep Sync',
        version: '2.0.0',
        author: 'PacketForge Systems',
        category: 'NETCODE',
        tagline: 'GGPO-style predictive rollback multiplayer netcode with deterministic frame state hashing.',
        description: 'Provides input delay tuning, speculative simulation ticks, sub-millisecond rollback recovery, and state desync detection for competitive fast-paced action games.',
        detailedReadmeMarkdown: `# Deterministic Rollback Netcode & Lockstep Sync

High-precision deterministic state synchronization and rollback engine for competitive 60/120 FPS multiplayer games.

### Key Capabilities
- **Speculative Frame Execution:** Never wait for remote packets before rendering local input.
- **Desync Bit-Check:** Computes 64-bit cryptographic hashes of game state every frame.
- **Automated State Rewind:** Rolls back up to 10 frames and replays in under 2ms.`,
        rating: 4.98,
        ratingCount: 165,
        downloadCount: 9800,
        sizeKb: 290,
        minEngineVersion: 'v3.7.0',
        tags: ['Netcode', 'Rollback', 'Multiplayer', 'Deterministic', 'GGPO'],
        permissions: ['RAW_SOCKET', 'MEMORY_PROFILER'],
        securityTier: 'VERIFIED_OFFICIAL',
        securityAuditScore: 97,
        isOfficial: true,
        isFeatured: true,
        entryPointFilename: 'RollbackNetcodeBridge.ts',
        language: 'typescript',
        sourceCodePreview: `export class RollbackNetcodeBridge {
  private frameRingBuffer: Array<{ frame: number; stateHash: number }> = [];
  public rollbackAndResimulate(targetFrame: number, remoteInputs: any[]): void {
    // Deterministic state rewind
  }
}`,
        dependencies: [],
        changelog: [
          { version: '2.0.0', releaseDate: '2026-08-01', highlights: ['Rewritten in Zero-Alloc Ring Buffers', 'Dynamic Ping Auto-Jitter'] }
        ],
        runtimeMemoryFootprintKb: 2400,
        estimatedLatencyMs: 0.12,
        updatedAt: '2026-08-01',
        createdAt: '2025-06-10',
        license: 'BSD-3-Clause'
      },
      {
        id: 'plg_gpu_compute_particles',
        name: 'GPU Compute Shader Vortex Particle FX',
        version: '1.5.2',
        author: 'PixelSorcery',
        category: 'GRAPHICS_SHADERS',
        tagline: 'Simulate up to 2,000,000 particles at 60 FPS with GPU compute curl noise and vector fields.',
        description: 'Harness WebGPU/WebGL compute passes to render swirling vortices, magical spells, sandstorms, and sparks reacting to scene collision depth buffers.',
        detailedReadmeMarkdown: `# GPU Compute Shader Vortex Particle FX

Extreme performance GPU particle system utilizing Compute passes and Ping-Pong storage buffers.`,
        rating: 4.85,
        ratingCount: 54,
        downloadCount: 3900,
        sizeKb: 140,
        minEngineVersion: 'v3.6.0',
        tags: ['Compute', 'Particles', 'VFX', 'WebGPU', 'CurlNoise'],
        permissions: ['GPU_COMPUTE'],
        securityTier: 'COMMUNITY_CURATED',
        securityAuditScore: 94,
        entryPointFilename: 'ComputeParticleVortex.glsl',
        language: 'glsl',
        sourceCodePreview: `// Compute shader particle integration
void computePass() {
  vec3 curl = calculateCurlNoise(particlePos);
  particleVel += curl * 0.016;
}`,
        dependencies: [],
        changelog: [{ version: '1.5.2', releaseDate: '2026-05-12', highlights: ['Depth collision buffer integration'] }],
        runtimeMemoryFootprintKb: 4800,
        estimatedLatencyMs: 0.95,
        updatedAt: '2026-05-12',
        createdAt: '2026-02-14',
        license: 'MIT'
      },
      {
        id: 'plg_spatial_octree_culling',
        name: 'Hierarchical Spatial Octree & BVH Occlusion Culler',
        version: '2.2.0',
        author: 'EngineOps Engineering',
        category: 'TOOLS_UI',
        tagline: 'Dynamic loose octree and bounding volume hierarchy for instant frustum and occlusion culling.',
        description: 'Drastically reduces draw calls on massive open-world scenes by dividing space hierarchically with SIMD AABB ray intersections.',
        detailedReadmeMarkdown: `# Hierarchical Spatial Octree & BVH Occlusion Culler

Boost render frame rates by culling up to 80% of invisible draw calls before they reach the GPU.`,
        rating: 4.90,
        ratingCount: 88,
        downloadCount: 5400,
        sizeKb: 165,
        minEngineVersion: 'v3.5.0',
        tags: ['Culling', 'Octree', 'BVH', 'Optimization', 'SceneGraph'],
        permissions: ['MEMORY_PROFILER'],
        securityTier: 'VERIFIED_OFFICIAL',
        securityAuditScore: 99,
        isOfficial: true,
        entryPointFilename: 'LooseOctreeCuller.ts',
        language: 'typescript',
        sourceCodePreview: `export class LooseOctreeNode {
  public boundingBox: { min: [number, number, number]; max: [number, number, number] };
  public children: LooseOctreeNode[] = [];
}`,
        dependencies: [],
        changelog: [{ version: '2.2.0', releaseDate: '2026-07-01', highlights: ['SIMD ray-box intersection speedup'] }],
        runtimeMemoryFootprintKb: 920,
        estimatedLatencyMs: 0.28,
        updatedAt: '2026-07-01',
        createdAt: '2025-08-11',
        license: 'MIT'
      },
      {
        id: 'plg_zero_day_memory_guard',
        name: 'Zero-Day Memory Leak & Pointer Sentinel',
        version: '1.2.4',
        author: 'CyberShield SecDevOps',
        category: 'DEVOPS_CI',
        tagline: 'Continuous heap allocation tracer that catches dangling references, buffer overflows, and memory leaks.',
        description: 'Hooks into entity component lifecycles to detect undisposed textures, uncleaned event listeners, and runaway buffer spikes in development builds.',
        detailedReadmeMarkdown: `# Zero-Day Memory Leak & Pointer Sentinel

DevOps auditing extension for proactive leak discovery before shipping game builds.`,
        rating: 4.82,
        ratingCount: 41,
        downloadCount: 2890,
        sizeKb: 130,
        minEngineVersion: 'v3.4.0',
        tags: ['DevOps', 'Memory', 'Security', 'Profiler', 'Audit'],
        permissions: ['MEMORY_PROFILER'],
        securityTier: 'COMMUNITY_CURATED',
        securityAuditScore: 96,
        entryPointFilename: 'MemorySentinelTracer.ts',
        language: 'typescript',
        sourceCodePreview: `export class MemorySentinelTracer {
  private activePointers = new WeakSet();
  public trackAllocation(target: object): void {
    this.activePointers.add(target);
  }
}`,
        dependencies: [],
        changelog: [{ version: '1.2.4', releaseDate: '2026-04-10', highlights: ['Added automated leak snapshot diffing'] }],
        runtimeMemoryFootprintKb: 650,
        estimatedLatencyMs: 0.18,
        updatedAt: '2026-04-10',
        createdAt: '2026-01-20',
        license: 'MIT'
      },
      {
        id: 'plg_dungeon_cave_voxelizer',
        name: 'Procedural Infinite Dungeon & Cave Voxelizer',
        version: '1.9.0',
        author: 'WorldForge PCG',
        category: 'PROCEDURAL_PCG',
        tagline: 'Marching cubes voxel terrain synthesizer with dual-contouring and cellular automata cave networks.',
        description: 'Generates sprawling subterranean caverns, dungeon rooms, ore veins, and stalactites with zero baking time using 3D Simplex noise.',
        detailedReadmeMarkdown: `# Procedural Infinite Dungeon & Cave Voxelizer

Real-time 3D marching cubes voxel generator with manifold dual-contouring mesh generation.`,
        rating: 4.89,
        ratingCount: 73,
        downloadCount: 4670,
        sizeKb: 310,
        minEngineVersion: 'v3.5.0',
        tags: ['PCG', 'Voxel', 'Dungeon', 'Procedural', 'Terrain'],
        permissions: ['GPU_COMPUTE'],
        securityTier: 'COMMUNITY_CURATED',
        securityAuditScore: 93,
        entryPointFilename: 'MarchingCubesVoxelizer.ts',
        language: 'typescript',
        sourceCodePreview: `export class MarchingCubesVoxelizer {
  public generateChunk(chunkX: number, chunkZ: number): Float32Array {
    // Dual contouring mesh synthesis
    return new Float32Array(0);
  }
}`,
        dependencies: [],
        changelog: [{ version: '1.9.0', releaseDate: '2026-06-28', highlights: ['LOD mesh decimation algorithm'] }],
        runtimeMemoryFootprintKb: 5400,
        estimatedLatencyMs: 2.10,
        updatedAt: '2026-06-28',
        createdAt: '2025-10-04',
        license: 'MIT'
      },
      {
        id: 'plg_binaural_dsp_audio',
        name: 'Synthesizer Binaural Spatializer & Convolution Reverb',
        version: '2.1.2',
        author: 'AcousticWave Labs',
        category: 'AUDIO_DSP',
        tagline: 'True 3D HRTF audio spatializer with early reflections, ray-traced acoustic obstruction, and IR reverb.',
        description: 'Immerses players in true 3D spatial sound using real head-related transfer functions (HRTF) and impulse-response acoustic room modeling.',
        detailedReadmeMarkdown: `# Synthesizer Binaural Spatializer & Convolution Reverb

Professional 3D spatial audio processing node directly integrated into the Nexus Audio Graph.`,
        rating: 4.93,
        ratingCount: 62,
        downloadCount: 3750,
        sizeKb: 220,
        minEngineVersion: 'v3.6.0',
        tags: ['Audio', 'DSP', 'Binaural', 'Spatial', 'Reverb'],
        permissions: ['AUDIO_THREAD'],
        securityTier: 'COMMUNITY_CURATED',
        securityAuditScore: 97,
        entryPointFilename: 'BinauralSpatializerNode.ts',
        language: 'typescript',
        sourceCodePreview: `export class BinauralSpatializerNode {
  public applyHRTF(audioBuffer: AudioBuffer, listenerPos: [number, number, number]): void {
    // Convolution filter
  }
}`,
        dependencies: [],
        changelog: [{ version: '2.1.2', releaseDate: '2026-07-15', highlights: ['Doppler effect pitch curve smoothing'] }],
        runtimeMemoryFootprintKb: 1800,
        estimatedLatencyMs: 0.45,
        updatedAt: '2026-07-15',
        createdAt: '2025-12-01',
        license: 'MIT'
      },
      {
        id: 'plg_retro_crt_phosphor',
        name: 'Retro CRT Scanline & Phosphor Glitch Emulator',
        version: '1.1.0',
        author: 'ArcadeNostalgia',
        category: 'GRAPHICS_SHADERS',
        tagline: 'Curved cathode ray tube screen distortion with RGB phosphor triads, chromatic aberration, and tape flutter.',
        description: 'Instant retro aesthetic for cyberpunk, horror, or vintage arcade games with customizable shadow mask and bloom blooming.',
        detailedReadmeMarkdown: `# Retro CRT Scanline & Phosphor Glitch Emulator

Authentic analog CRT monitor simulation shader pass with aperture grille and phosphor persistence.`,
        rating: 4.79,
        ratingCount: 39,
        downloadCount: 2450,
        sizeKb: 95,
        minEngineVersion: 'v3.3.0',
        tags: ['Retro', 'CRT', 'Shader', 'PostProcess', 'Arcade'],
        permissions: [],
        securityTier: 'EXPERIMENTAL_SANDBOX',
        securityAuditScore: 89,
        entryPointFilename: 'RetroCRTPhosphor.glsl',
        language: 'glsl',
        sourceCodePreview: `// CRT barrel distortion
vec2 curveUV(vec2 uv) {
  uv = uv * 2.0 - 1.0;
  vec2 offset = abs(uv.yx) / vec2(6.0, 4.0);
  uv = uv + uv * offset * offset;
  return uv * 0.5 + 0.5;
}`,
        dependencies: [],
        changelog: [{ version: '1.1.0', releaseDate: '2026-03-14', highlights: ['Magnetic flutter artifacts toggle'] }],
        runtimeMemoryFootprintKb: 450,
        estimatedLatencyMs: 0.22,
        updatedAt: '2026-03-14',
        createdAt: '2026-02-01',
        license: 'MIT'
      },
      {
        id: 'plg_automated_playtest_swarm',
        name: 'Headless Multi-Agent Playtest Bot Swarm',
        version: '2.5.0',
        author: 'Nexus QA Automation',
        category: 'DEVOPS_CI',
        tagline: 'Spawns 64 concurrent headless virtual players to stress test game economy, level collisions, and balance.',
        description: 'Autonomous exploration bots navigate maps using navigational meshes to discover geometry holes, balance bottlenecks, and soft-lock scenarios.',
        detailedReadmeMarkdown: `# Headless Multi-Agent Playtest Bot Swarm

Automated DevOps CI testing extension that runs parallel virtual players to stress-test your games in seconds.`,
        rating: 4.96,
        ratingCount: 110,
        downloadCount: 7200,
        sizeKb: 280,
        minEngineVersion: 'v3.7.0',
        tags: ['QA', 'Playtest', 'Bots', 'DevOps', 'Swarm', 'CI'],
        permissions: ['MEMORY_PROFILER', 'WEB_WORKER'],
        securityTier: 'VERIFIED_OFFICIAL',
        securityAuditScore: 98,
        isOfficial: true,
        entryPointFilename: 'PlaytestBotSwarmOrchestrator.ts',
        language: 'typescript',
        sourceCodePreview: `export class PlaytestBotSwarmOrchestrator {
  public spawnSwarm(count: number = 64): void {
    // WebWorker swarm deployment
  }
}`,
        dependencies: [],
        changelog: [{ version: '2.5.0', releaseDate: '2026-08-05', highlights: ['Economy balance regression logger'] }],
        runtimeMemoryFootprintKb: 3800,
        estimatedLatencyMs: 0.60,
        updatedAt: '2026-08-05',
        createdAt: '2025-07-29',
        license: 'Apache-2.0'
      },
      {
        id: 'plg_wasm_physx_bridge',
        name: 'WebAssembly High-Precision PhysX Bridge',
        version: '3.0.1',
        author: 'HighPrecision Computes',
        category: 'PHYSICS',
        tagline: 'Compiled C++ PhysX 5.3 runtime running at native speed via WebAssembly with multi-threaded SIMD.',
        description: 'Extreme fidelity physics engine bridge supporting articulated vehicles, destruction meshes, cloth simulation, and particle fluids.',
        detailedReadmeMarkdown: `# WebAssembly High-Precision PhysX Bridge

Native C++ PhysX compilation for zero-compromise physical simulation inside NexusEngine.`,
        rating: 4.97,
        ratingCount: 198,
        downloadCount: 11400,
        sizeKb: 890,
        minEngineVersion: 'v3.7.0',
        tags: ['Physics', 'WASM', 'PhysX', 'Vehicles', 'Destruction'],
        permissions: ['GPU_COMPUTE', 'MEMORY_PROFILER', 'WEB_WORKER'],
        securityTier: 'VERIFIED_OFFICIAL',
        securityAuditScore: 99,
        isOfficial: true,
        isFeatured: true,
        entryPointFilename: 'PhysXWasmBridge.ts',
        language: 'wasm',
        sourceCodePreview: `// WASM Module Bindings
export async function initPhysX() {
  const wasmModule = await WebAssembly.instantiateStreaming(fetch('/physx.wasm'));
  return wasmModule.instance.exports;
}`,
        dependencies: [],
        changelog: [{ version: '3.0.1', releaseDate: '2026-08-14', highlights: ['PhysX 5.3 vehicle drivetrain updates'] }],
        runtimeMemoryFootprintKb: 8200,
        estimatedLatencyMs: 0.40,
        updatedAt: '2026-08-14',
        createdAt: '2025-04-18',
        license: 'BSD-3-Clause'
      }
    ];
  }

  /**
   * Load installed plugins from LocalStorage
   */
  private loadFromStorage(): void {
    try {
      const savedInstalled = localStorage.getItem(STORAGE_KEY_INSTALLED);
      if (savedInstalled) {
        const parsed = JSON.parse(savedInstalled) as InstalledPluginState[];
        parsed.forEach(item => {
          this.installedMap.set(item.pluginId, item);
        });
      } else {
        // Seed initial installed default plugins
        this.installPlugin('plg_euphoria_ragdoll', '2.4.1', false);
        this.installPlugin('plg_rollback_netcode', '2.0.0', false);
        this.installPlugin('plg_spatial_octree_culling', '2.2.0', false);
        this.persistInstalled();
      }

      // Load custom community published plugins
      const savedCustom = localStorage.getItem(STORAGE_KEY_CUSTOM);
      if (savedCustom) {
        const customParsed = JSON.parse(savedCustom) as EnginePlugin[];
        customParsed.forEach(p => {
          if (!this.communityPlugins.some(cp => cp.id === p.id)) {
            this.communityPlugins.unshift(p);
          }
        });
      }
    } catch (e) {
      console.warn('Could not parse installed plugins from storage, re-initializing:', e);
    }
  }

  private persistInstalled(): void {
    try {
      const arr = Array.from(this.installedMap.values());
      localStorage.setItem(STORAGE_KEY_INSTALLED, JSON.stringify(arr));
    } catch (e) {
      console.error('Failed to persist installed plugins:', e);
    }
  }

  private persistCustomPlugins(): void {
    try {
      const customOnes = this.communityPlugins.filter(p => p.id.startsWith('custom_'));
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customOnes));
    } catch (e) {
      console.error('Failed to persist custom plugins:', e);
    }
  }

  // ================= Public API =================

  public getAllPlugins(): EnginePlugin[] {
    return [...this.communityPlugins];
  }

  public getPlugin(pluginId: string): EnginePlugin | undefined {
    return this.communityPlugins.find(p => p.id === pluginId);
  }

  public getInstalledPlugins(): InstalledPluginState[] {
    return Array.from(this.installedMap.values());
  }

  public isInstalled(pluginId: string): boolean {
    return this.installedMap.has(pluginId);
  }

  public getInstalledState(pluginId: string): InstalledPluginState | undefined {
    return this.installedMap.get(pluginId);
  }

  /**
   * Install a plugin into local engine
   */
  public installPlugin(pluginId: string, version?: string, triggerNotify = true): boolean {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) return false;

    const state: InstalledPluginState = {
      pluginId,
      installedVersion: version || plugin.version,
      enabled: true,
      installedAtTimestamp: Date.now(),
      autoUpdate: true,
      runtimeStatus: 'ACTIVE',
      memoryUsageKb: plugin.runtimeMemoryFootprintKb,
      cpuOverheadPercent: Math.min(4.5, plugin.estimatedLatencyMs * 2.2),
      lastExecutionTimestamp: Date.now()
    };

    this.installedMap.set(pluginId, state);
    this.persistInstalled();
    if (triggerNotify) this.notify();
    return true;
  }

  /**
   * Uninstall a plugin
   */
  public uninstallPlugin(pluginId: string): boolean {
    if (!this.installedMap.has(pluginId)) return false;
    this.installedMap.delete(pluginId);
    this.persistInstalled();
    this.notify();
    return true;
  }

  /**
   * Toggle enabled / disabled
   */
  public togglePluginEnabled(pluginId: string, enabled: boolean): boolean {
    const current = this.installedMap.get(pluginId);
    if (!current) return false;

    current.enabled = enabled;
    current.runtimeStatus = enabled ? 'ACTIVE' : 'DISABLED';
    this.persistInstalled();
    this.notify();
    return true;
  }

  /**
   * Update plugin version
   */
  public updatePluginVersion(pluginId: string, targetVersion: string): boolean {
    const current = this.installedMap.get(pluginId);
    if (!current) return false;

    current.installedVersion = targetVersion;
    current.installedAtTimestamp = Date.now();
    this.persistInstalled();
    this.notify();
    return true;
  }

  /**
   * Hot Reload all active plugins
   */
  public hotReloadPlugins(): { reloadedCount: number; timestamp: number } {
    let count = 0;
    this.installedMap.forEach(state => {
      if (state.enabled) {
        state.lastExecutionTimestamp = Date.now();
        state.runtimeStatus = 'ACTIVE';
        count++;
      }
    });
    this.persistInstalled();
    this.notify();
    return { reloadedCount: count, timestamp: Date.now() };
  }

  /**
   * Register or publish custom extension created by user
   */
  public registerCustomPlugin(plugin: EnginePlugin, autoInstall = true): void {
    const existingIndex = this.communityPlugins.findIndex(p => p.id === plugin.id);
    if (existingIndex >= 0) {
      this.communityPlugins[existingIndex] = plugin;
    } else {
      this.communityPlugins.unshift(plugin);
    }

    this.persistCustomPlugins();
    if (autoInstall) {
      this.installPlugin(plugin.id, plugin.version, false);
    }
    this.notify();
  }

  /**
   * Export installed plugins manifest JSON
   */
  public exportInstalledManifestJson(): string {
    const data = {
      engineVersion: 'v3.8.4',
      exportedAt: new Date().toISOString(),
      installedPlugins: Array.from(this.installedMap.values()).map(state => {
        const meta = this.getPlugin(state.pluginId);
        return {
          id: state.pluginId,
          name: meta?.name || state.pluginId,
          version: state.installedVersion,
          enabled: state.enabled,
          category: meta?.category
        };
      })
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import installed plugins manifest
   */
  public importInstalledManifestJson(jsonStr: string): { successCount: number; errors: string[] } {
    const errors: string[] = [];
    let successCount = 0;

    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed.installedPlugins)) {
        throw new Error('Invalid manifest format: missing installedPlugins array');
      }

      parsed.installedPlugins.forEach((item: any) => {
        if (item.id) {
          const plugin = this.getPlugin(item.id);
          if (plugin) {
            this.installPlugin(item.id, item.version || plugin.version, false);
            if (item.enabled === false) {
              this.togglePluginEnabled(item.id, false);
            }
            successCount++;
          } else {
            errors.push(`Plugin '${item.id}' not found in registry.`);
          }
        }
      });

      this.persistInstalled();
      this.notify();
    } catch (e: any) {
      errors.push(`Parse error: ${e.message}`);
    }

    return { successCount, errors };
  }
}

export const pluginMarketplaceRegistry = PluginMarketplaceRegistryNode.getInstance();
