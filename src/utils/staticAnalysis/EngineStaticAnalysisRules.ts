/**
 * ============================================================================
 * MODULE: EngineStaticAnalysisRules.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ของไฟล์ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * คลังกฎและข้อกำหนดการวิเคราะห์ Static Analysis สำหรับเกมเอนจิน (Engine Anti-Pattern Ruleset)
 * รวบรวมข้อผิดพลาดเชิงสถาปัตยกรรมและคอขวดที่พบบ่อยที่สุดในเกมเอนจินระดับ AAA และ Indie
 * เช่น Unity (C#), Unreal Engine (C++), WebGL/WebGPU (TypeScript/JavaScript),
 * และ Native Shaders (GLSL/HLSL)
 * 
 * สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น (Architecture & System Integration):
 * ----------------------------------------------------------------------------
 * - โมดูลนี้ส่งต่อ Ruleset ไปให้:
 *   - `EngineAstLinterEngine.ts`: นำ Regex Pattern และ Context Heuristics ไปสแกน Buffer
 *   - `PerformanceImpactEstimatorNode.ts`: ประเมินผลกระทบต่อเฟรมเรตและขยะ GC
 *   - `QuickFixRefactoringNode.ts`: นำตัวอย่าง `replacementTemplate` ไปแปลงโค้ด
 *   - `EngineStaticAnalysisPanel.tsx`: แสดงรายการกฎให้ผู้ใช้เลือกเปิด/ปิด หรือศึกษา Best Practices
 * 
 * รายการกฎหลักที่ครอบคลุม (Core Rules Covered):
 * ----------------------------------------------------------------------------
 * 1. GC_ALLOCATION: การจัดสรร Heap ใน Hot Path (Vector3, Lambda, String Concatenation, LINQ)
 * 2. HOT_PATH_QUERY: การ Query เอนทิตีหรือคอมโพเนนต์ซ้ำๆ ในลูป Update (GetComponent, FindTag)
 * 3. PHYSICS_MATH: การคำนวณคณิตศาสตร์ที่ไม่คุ้มค่า (Distance vs DistanceSquared, RaycastAll)
 * 4. GPU_SHADER: การโคลน Material, Draw Call Splitting, Dynamic Shader Loop Branching
 * 5. CONCURRENCY_IO: การโหลดไฟล์แบบ Synchronous Blocking บน Main Thread ในขณะเล่นเกม
 * 6. MEMORY_CACHE: การเปรียบเทียบ Tag ด้วย String, การ Boxing ข้อมูล, การอัปเดต Transform แยกส่วน
 * 
 * ============================================================================
 */

import { EngineAntiPatternRule } from './EngineAntiPatternTypes';

export const ENGINE_STATIC_ANALYSIS_RULES: EngineAntiPatternRule[] = [
  // --------------------------------------------------------------------------
  // 1. GC_ALLOCATION RULES
  // --------------------------------------------------------------------------
  {
    id: 'ENG-GC-001',
    name: 'Heap Allocation in Hot Loop (Vector/Object Instantiation)',
    category: 'GC_ALLOCATION',
    severity: 'CRITICAL',
    targetPlatforms: ['UNIVERSAL', 'TYPESCRIPT_WEBGL', 'UNITY_CSHARP'],
    supportedLanguages: ['typescript', 'javascript', 'csharp'],
    shortDescription: 'Instantiating new vectors, matrices, or objects inside update/tick loop generates severe GC churn.',
    detailedExplanation: 'Calling `new Vector3()`, `new Ray()`, or `new Quaternion()` inside the per-frame update loop forces the garbage collector to frequently pause execution for memory collection cycles (Gen 0 GC spikes in C# or V8 Scavenge spikes in JavaScript), causing micro-stutters and frame drops.',
    engineContext: 'Update / Tick / FixedUpdate / Render Loop',
    regexPattern: /(?:new\s+(?:Vector2|Vector3|Vector4|Quaternion|Matrix4|Color|Ray|BoundingBox)\s*\()/i,
    scopeCondition: 'INSIDE_HOT_LOOP',
    enabled: true,
    alternative: {
      title: 'Cache Temporary Vector or Use Scratch Buffer Object Pooling',
      explanation: 'Allocate a reusable static/private scratch vector outside the loop or pass coordinates by reference to eliminate all per-frame heap allocations.',
      theoreticalFpsGainMs: 1.4,
      estimatedGcSavedKb: 48.0,
      originalAntiPatternCode: `// ❌ Bad: Allocates new Vector3 instance every frame\npublic update(deltaTime: number): void {\n  const dir = new Vector3(target.x - this.pos.x, 0, target.z - this.pos.z);\n  this.velocity.add(dir.multiplyScalar(deltaTime));\n}`,
      recommendedCode: `// ✅ Optimized: Reuses pre-allocated scratch vector\nprivate static readonly _scratchDir = new Vector3();\n\npublic update(deltaTime: number): void {\n  PlayerController._scratchDir.set(target.x - this.pos.x, 0, target.z - this.pos.z);\n  this.velocity.addScaledVector(PlayerController._scratchDir, deltaTime);\n}`,
      replacementTemplate: `/* REUSED SCRATCH BUFFER */ targetScratch.set($1)`
    }
  },
  {
    id: 'ENG-GC-002',
    name: 'Anonymous Function / Closure Allocation in Frame Loop',
    category: 'GC_ALLOCATION',
    severity: 'HIGH',
    targetPlatforms: ['UNIVERSAL', 'TYPESCRIPT_WEBGL', 'UNITY_CSHARP'],
    supportedLanguages: ['typescript', 'javascript', 'csharp'],
    shortDescription: 'Arrow functions, delegates, or anonymous callbacks defined inside tick allocate closure scopes.',
    detailedExplanation: 'Creating inline lambdas inside hot paths (e.g. `.forEach(x => ...)` or `delegate { ... }`) instantiates a new closure object on the heap every single frame, retaining captured variables and ballooning GC pressure.',
    engineContext: 'Update / Tick / Render Loop',
    regexPattern: /(?:\.forEach\s*\(\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>|\.filter\s*\(\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>|\.map\s*\(\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>)/,
    scopeCondition: 'INSIDE_HOT_LOOP',
    enabled: true,
    alternative: {
      title: 'Use Standard Indexed For-Loop or Static Bound Callback',
      explanation: 'Replace functional array abstractions with standard indexed `for (let i = 0; i < len; ++i)` loops to enable compiler loop unrolling and eliminate closure overhead.',
      theoreticalFpsGainMs: 0.8,
      estimatedGcSavedKb: 24.0,
      originalAntiPatternCode: `// ❌ Bad: Allocates closure and array iterator each frame\nentities.forEach(entity => {\n  entity.updatePosition(deltaTime);\n});`,
      recommendedCode: `// ✅ Optimized: Zero-allocation direct indexed loop\nfor (let i = 0, len = entities.length; i < len; ++i) {\n  entities[i].updatePosition(deltaTime);\n}`,
      replacementTemplate: `for (let i = 0, len = $1.length; i < len; ++i) { const item = $1[i]; $2 }`
    }
  },
  {
    id: 'ENG-GC-003',
    name: 'String Concatenation in Hot Path',
    category: 'GC_ALLOCATION',
    severity: 'HIGH',
    targetPlatforms: ['UNIVERSAL', 'UNITY_CSHARP', 'TYPESCRIPT_WEBGL'],
    supportedLanguages: ['typescript', 'javascript', 'csharp', 'cpp'],
    shortDescription: 'Concatenating strings using `+` or template strings in hot loop creates immutable garbage strings.',
    detailedExplanation: 'Strings in JavaScript, C#, and Java are immutable. Every `+` operation in a 60 FPS loop allocates a new string buffer on the heap, triggering continuous GC sweeps.',
    engineContext: 'Update / Tick / Draw / Debug GUI Loop',
    regexPattern: /(?:text|label|caption|name|debug)\s*(?:\+=|=.*\+\s*["'][^"']*["']|\s*=\s*`[^`]*\${)/,
    scopeCondition: 'INSIDE_HOT_LOOP',
    enabled: true,
    alternative: {
      title: 'Use StringBuilder, Pre-Allocated Text Cache, or String Interning',
      explanation: 'Update text only when numeric values change or use fixed-size char/byte buffers for real-time telemetry.',
      theoreticalFpsGainMs: 0.6,
      estimatedGcSavedKb: 32.0,
      originalAntiPatternCode: `// ❌ Bad: Generates new strings 60 times/sec even if score is constant\npublic update(dt: number): void {\n  this.fpsLabel.text = "FPS: " + Math.round(1 / dt) + " | Score: " + this.score;\n}`,
      recommendedCode: `// ✅ Optimized: Dirty flag caching; updates only on value change\nprivate _lastFps: number = 0;\npublic update(dt: number): void {\n  const currentFps = Math.round(1 / dt);\n  if (currentFps !== this._lastFps) {\n    this._lastFps = currentFps;\n    this.fpsLabel.text = \`FPS: \${currentFps} | Score: \${this.score}\`;\n  }\n}`
    }
  },
  {
    id: 'ENG-GC-004',
    name: 'LINQ Query / Array Chaining in Hot Loop',
    category: 'GC_ALLOCATION',
    severity: 'HIGH',
    targetPlatforms: ['UNITY_CSHARP', 'TYPESCRIPT_WEBGL'],
    supportedLanguages: ['csharp', 'typescript', 'javascript'],
    shortDescription: 'Chaining array operations (.Where().Select() / .filter().map()) allocates intermediate arrays and enumerators.',
    detailedExplanation: 'LINQ in C# allocates multiple iterator state machines, boxed structs, and delegate objects. In JavaScript, chaining `.filter().map()` creates multiple intermediate array buffers on the heap every frame.',
    engineContext: 'Update / Physics Step Loop',
    regexPattern: /(?:\.Where\s*\(|\.Select\s*\(|\.OrderBy\s*\(|\.filter\s*\(.*?\)\.map\s*\()/,
    scopeCondition: 'INSIDE_HOT_LOOP',
    enabled: true,
    alternative: {
      title: 'Single Pass Imperative Loop with Pre-Allocated Output Buffer',
      explanation: 'Process elements in a single sequential pass, filtering and writing results directly into a pre-allocated results array.',
      theoreticalFpsGainMs: 1.2,
      estimatedGcSavedKb: 64.0,
      originalAntiPatternCode: `// ❌ Bad: Creates 2 intermediate arrays and 2 closures\nconst activeEnemies = entities\n  .filter(e => e.isActive && e.isAlive)\n  .map(e => e.transform.position);`,
      recommendedCode: `// ✅ Optimized: Single pass into reusable scratch array\nthis._activeEnemyPosCache.length = 0;\nfor (let i = 0, len = entities.length; i < len; ++i) {\n  const e = entities[i];\n  if (e.isActive && e.isAlive) {\n    this._activeEnemyPosCache.push(e.transform.position);\n  }\n}`
    }
  },

  // --------------------------------------------------------------------------
  // 2. HOT_PATH_QUERY RULES
  // --------------------------------------------------------------------------
  {
    id: 'ENG-QUERY-001',
    name: 'Heavy Component / Node Query in Hot Loop',
    category: 'HOT_PATH_QUERY',
    severity: 'CRITICAL',
    targetPlatforms: ['UNIVERSAL', 'UNITY_CSHARP', 'TYPESCRIPT_WEBGL', 'UNREAL_CPP'],
    supportedLanguages: ['typescript', 'javascript', 'csharp', 'cpp'],
    shortDescription: 'Calling GetComponent<T>(), Find(), or findEntityByName() inside per-frame update.',
    detailedExplanation: 'Calling scene graph searches, string-based lookups, or reflection-based component lookups (e.g. `GetComponent<Rigidbody>()` or `scene.findEntityByName("Boss")`) inside the frame loop traverses hierarchical trees repeatedly, incurring CPU cache misses and dictionary lookup overhead.',
    engineContext: 'Update / Tick / Render Loop',
    regexPattern: /(?:GetComponent\s*<|findEntityByName\s*\(|findViewById\s*\(|FindGameObjectWithTag\s*\(|scene\.getObjectByName\s*\(|document\.querySelector\s*\()/i,
    scopeCondition: 'INSIDE_HOT_LOOP',
    enabled: true,
    alternative: {
      title: 'Cache Component Reference in Awake / Start / Constructor',
      explanation: 'Store the component or entity reference in a private member variable during initialization (`Awake`, `Start`, or `init`) and access the cached reference in `Update`.',
      theoreticalFpsGainMs: 2.1,
      estimatedGcSavedKb: 8.0,
      originalAntiPatternCode: `// ❌ Bad: Searches component dictionary 60-120 times every second\npublic update(): void {\n  const rb = this.GetComponent<Rigidbody>();\n  rb.addForce(Vector3.forward * 10.0);\n}`,
      recommendedCode: `// ✅ Optimized: Cached component reference\nprivate _cachedRb!: Rigidbody;\n\npublic awake(): void {\n  this._cachedRb = this.GetComponent<Rigidbody>();\n}\n\npublic update(): void {\n  this._cachedRb.addForce(Vector3.forward * 10.0);\n}`,
      replacementTemplate: `this._cachedComponent`
    }
  },
  {
    id: 'ENG-QUERY-002',
    name: 'Deep Scene Hierarchy Traversal in Hot Path',
    category: 'HOT_PATH_QUERY',
    severity: 'MEDIUM',
    targetPlatforms: ['UNIVERSAL', 'UNITY_CSHARP', 'TYPESCRIPT_WEBGL'],
    supportedLanguages: ['typescript', 'javascript', 'csharp', 'cpp'],
    shortDescription: 'Navigating parents and children iteratively (transform.parent.parent.Find) in tick.',
    detailedExplanation: 'Iterating up and down the scene graph hierarchy inside hot code causes pointer chasing and cache invalidation. A reorganization of the hierarchy can also cause silent null reference crashes.',
    engineContext: 'Update / Physics Step',
    regexPattern: /(?:transform\.parent\.parent|\.parent\.parent\.getChildByName|\.parent\.parent\.Find)/,
    scopeCondition: 'INSIDE_HOT_LOOP',
    enabled: true,
    alternative: {
      title: 'Store Direct Reference via Dependency Injection or Event Bus',
      explanation: 'Inject the target entity reference directly upon spawn or register it with a central spatial registry/manager.',
      theoreticalFpsGainMs: 0.5,
      estimatedGcSavedKb: 4.0,
      originalAntiPatternCode: `// ❌ Bad: Pointer chasing through 3 layers of parent hierarchies\nconst rootTarget = this.transform.parent.parent.Find("TargetRoot");`,
      recommendedCode: `// ✅ Optimized: Direct injected reference\n@Inject('TargetRoot')\nprivate _targetRoot!: Transform;`
    }
  },
  {
    id: 'ENG-QUERY-003',
    name: 'Camera.main / Main Viewport Lookup in Hot Loop',
    category: 'HOT_PATH_QUERY',
    severity: 'HIGH',
    targetPlatforms: ['UNITY_CSHARP', 'TYPESCRIPT_WEBGL'],
    supportedLanguages: ['csharp', 'typescript', 'javascript'],
    shortDescription: 'Calling Camera.main repeatedly triggers an expensive internal tag query.',
    detailedExplanation: 'In Unity and several WebGL engines, `Camera.main` internally performs `GameObject.FindGameObjectWithTag("MainCamera")` behind the scenes unless cached in modern versions, searching the entire scene hierarchy every frame.',
    engineContext: 'Update / Render Loop',
    regexPattern: /(?:Camera\.main|viewport\.getMainCamera\(\)|scene\.activeCamera)/,
    scopeCondition: 'INSIDE_HOT_LOOP',
    enabled: true,
    alternative: {
      title: 'Cache Camera Reference in Start / Awake',
      explanation: 'Store `Camera.main` in a local field during startup or use an event-driven camera switcher.',
      theoreticalFpsGainMs: 1.1,
      estimatedGcSavedKb: 6.0,
      originalAntiPatternCode: `// ❌ Bad: Searches scene tags every frame\nvoid Update() {\n  Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);\n}`,
      recommendedCode: `// ✅ Optimized: Cached camera reference\nprivate Camera _mainCamera;\nvoid Start() {\n  _mainCamera = Camera.main;\n}\nvoid Update() {\n  Ray ray = _mainCamera.ScreenPointToRay(Input.mousePosition);\n}`
    }
  },

  // --------------------------------------------------------------------------
  // 3. PHYSICS_MATH RULES
  // --------------------------------------------------------------------------
  {
    id: 'ENG-MATH-001',
    name: 'Vector Distance vs DistanceSquared in Proximity Checks',
    category: 'PHYSICS_MATH',
    severity: 'HIGH',
    targetPlatforms: ['UNIVERSAL', 'TYPESCRIPT_WEBGL', 'UNITY_CSHARP', 'NATIVE_CPP_RUST'],
    supportedLanguages: ['typescript', 'javascript', 'csharp', 'cpp', 'rust'],
    shortDescription: 'Using Vector3.Distance() in distance comparisons incurs an unnecessary square root operation.',
    detailedExplanation: '`Vector3.Distance(a, b)` computes `sqrt((x2-x1)^2 + (y2-y1)^2 + (z2-z1)^2)`. The square root operation (`Math.sqrt` / `fsqrt`) takes multiple CPU clock cycles (up to 15-30 cycles). Comparing against a pre-squared threshold with `distanceToSquared()` or `sqrMagnitude` eliminates the square root entirely.',
    engineContext: 'Entity AI / Proximity / Collision / Combat Checks',
    regexPattern: /(?:Vector3\.Distance\s*\([^)]+\)\s*(?:<|<=|>|>=)|Math\.sqrt\s*\([^)]+\)\s*(?:<|<=|>|>=)|\.distanceTo\s*\([^)]+\)\s*(?:<|<=|>|>=))/i,
    scopeCondition: 'ANY',
    enabled: true,
    alternative: {
      title: 'Compare Using DistanceSquared (sqrMagnitude)',
      explanation: 'Pre-calculate `range * range` and compare with `distanceSquared` to avoid square root CPU penalties across thousands of entities.',
      theoreticalFpsGainMs: 1.6,
      estimatedGcSavedKb: 0.0,
      originalAntiPatternCode: `// ❌ Bad: Square root calculated every frame for all nearby enemies\nif (Vector3.Distance(playerPos, enemyPos) < attackRange) {\n  this.triggerAttack();\n}`,
      recommendedCode: `// ✅ Optimized: Zero square root calculation\nconst attackRangeSqr = attackRange * attackRange;\nif (playerPos.distanceToSquared(enemyPos) < attackRangeSqr) {\n  this.triggerAttack();\n}`,
      replacementTemplate: `$1.distanceToSquared($2) < ($3 * $3)`
    }
  },
  {
    id: 'ENG-MATH-002',
    name: 'Allocating Raycast Query (RaycastAll vs RaycastNonAlloc)',
    category: 'PHYSICS_MATH',
    severity: 'CRITICAL',
    targetPlatforms: ['UNITY_CSHARP', 'UNIVERSAL'],
    supportedLanguages: ['csharp', 'typescript', 'cpp'],
    shortDescription: 'Physics.RaycastAll / OverlapSphere allocates a new RaycastHit[] array on every invocation.',
    detailedExplanation: 'Calling `Physics.RaycastAll()` or `Physics.OverlapSphere()` allocates a brand new array every time, even if no colliders are hit. In high-rate weapons, raycasts can generate hundreds of kilobytes of GC garbage per second.',
    engineContext: 'Weapons / Raycasting / Line-of-Sight Checks',
    regexPattern: /(?:Physics\.RaycastAll|Physics\.OverlapSphere|Physics\.BoxCastAll)/,
    scopeCondition: 'ANY',
    enabled: true,
    alternative: {
      title: 'Use Physics.RaycastNonAlloc with Pre-Allocated Buffer',
      explanation: 'Pre-allocate a fixed buffer (e.g. `RaycastHit[] hits = new RaycastHit[16]`) and use `RaycastNonAlloc`, which populates the buffer without any heap allocations.',
      theoreticalFpsGainMs: 1.8,
      estimatedGcSavedKb: 72.0,
      originalAntiPatternCode: `// ❌ Bad: Allocates new array every single gunshot\nvoid FireWeapon() {\n  RaycastHit[] hits = Physics.RaycastAll(transform.position, transform.forward, 100f);\n  for (int i = 0; i < hits.Length; ++i) ProcessHit(hits[i]);\n}`,
      recommendedCode: `// ✅ Optimized: Pre-allocated buffer for zero GC allocations\nprivate static readonly RaycastHit[] _hitBuffer = new RaycastHit[16];\nvoid FireWeapon() {\n  int hitCount = Physics.RaycastNonAlloc(transform.position, transform.forward, _hitBuffer, 100f);\n  for (int i = 0; i < hitCount; ++i) ProcessHit(_hitBuffer[i]);\n}`
    }
  },
  {
    id: 'ENG-MATH-003',
    name: 'Redundant Transcendental Functions in Particle Loop',
    category: 'PHYSICS_MATH',
    severity: 'MEDIUM',
    targetPlatforms: ['UNIVERSAL', 'TYPESCRIPT_WEBGL', 'NATIVE_CPP_RUST'],
    supportedLanguages: ['typescript', 'javascript', 'cpp', 'rust'],
    shortDescription: 'Calling Math.sin / Math.cos repeatedly inside high-count particle updates.',
    detailedExplanation: 'Computing `Math.sin()` or `Math.cos()` per-particle on thousands of particles per frame creates a CPU bottleneck. A precomputed Sine Lookup Table (LUT) or SIMD vectorization yields up to 4x faster execution.',
    engineContext: 'Particle Sim / Procedural Waves / Ribbon Meshes',
    regexPattern: /(?:for\s*\([^)]*\)\s*\{[^}]*Math\.(?:sin|cos|tan)\s*\()/s,
    scopeCondition: 'INSIDE_HOT_LOOP',
    enabled: true,
    alternative: {
      title: 'Use Fast Trigonometry Lookup Table (LUT) or Shader Displacement',
      explanation: 'Offload particle wave animations to a GPU Vertex Shader or use a fixed 256-entry float lookup table.',
      theoreticalFpsGainMs: 1.3,
      estimatedGcSavedKb: 0.0,
      originalAntiPatternCode: `// ❌ Bad: Thousands of CPU sin calls per frame\nfor (let i = 0; i < particles.length; ++i) {\n  particles[i].y += Math.sin(time + particles[i].x * 0.1) * 0.05;\n}`,
      recommendedCode: `// ✅ Optimized: Fast precomputed LUT or GPU Vertex displacement\nconst lutIndex = ((time * 64 + (particles[i].x | 0)) & 255);\nparticles[i].y += SIN_LOOKUP_TABLE[lutIndex] * 0.05;`
    }
  },

  // --------------------------------------------------------------------------
  // 4. GPU_SHADER RULES
  // --------------------------------------------------------------------------
  {
    id: 'ENG-GPU-001',
    name: 'Material Instance Cloning via renderer.material in Loop',
    category: 'GPU_SHADER',
    severity: 'CRITICAL',
    targetPlatforms: ['UNITY_CSHARP', 'TYPESCRIPT_WEBGL', 'UNIVERSAL'],
    supportedLanguages: ['csharp', 'typescript', 'javascript'],
    shortDescription: 'Accessing renderer.material creates a duplicate Material instance and breaks GPU instancing batching.',
    detailedExplanation: 'Accessing `.material` on a Renderer creates a brand new copy of the Material instance. This leaks GPU memory if not destroyed and breaks Dynamic Batching / GPU Instancing, doubling or tripling draw calls on screen.',
    engineContext: 'Rendering / Visual Highlighting / Damage Flashing',
    regexPattern: /(?:\.renderer\.material\s*=\s*|\.material\.color\s*=\s*|\.material\.SetColor\s*\()/i,
    scopeCondition: 'INSIDE_HOT_LOOP',
    enabled: true,
    alternative: {
      title: 'Use MaterialPropertyBlock or Shared Material',
      explanation: 'Use `MaterialPropertyBlock` (Unity) or Instanced Buffer Attributes (Three.js/WebGL) to change colors and properties without duplicating material instances.',
      theoreticalFpsGainMs: 3.2,
      estimatedGcSavedKb: 120.0,
      originalAntiPatternCode: `// ❌ Bad: Clones material, breaks batching, creates draw call leak\nvoid OnDamage() {\n  GetComponent<Renderer>().material.color = Color.red;\n}`,
      recommendedCode: `// ✅ Optimized: Zero draw call splitting via MaterialPropertyBlock\nprivate static MaterialPropertyBlock _propBlock;\nvoid OnDamage() {\n  if (_propBlock == null) _propBlock = new MaterialPropertyBlock();\n  _propBlock.SetColor("_BaseColor", Color.red);\n  GetComponent<Renderer>().SetPropertyBlock(_propBlock);\n}`
    }
  },
  {
    id: 'ENG-GPU-002',
    name: 'Dynamic Non-Uniform Branching in Fragment Shader',
    category: 'GPU_SHADER',
    severity: 'HIGH',
    targetPlatforms: ['UNIVERSAL', 'TYPESCRIPT_WEBGL'],
    supportedLanguages: ['glsl', 'hlsl', 'shader'],
    shortDescription: 'Dynamic loop bounds or non-uniform if statements inside fragment shaders cause GPU warp divergence.',
    detailedExplanation: 'GPUs execute fragment shaders in warps/wavefronts (32 or 64 lockstep threads). If adjacent pixels take different branch paths in an `if (variable)` or dynamic loop, both branches must be executed sequentially, halving fragment throughput.',
    engineContext: 'Fragment / Pixel Shader / Post-Processing',
    regexPattern: /(?:for\s*\(\s*int\s+[a-zA-Z0-9_]+\s*=\s*0\s*;\s*[a-zA-Z0-9_]+\s*<\s*(?!16|32|64|128)[a-zA-Z0-9_]+\s*;|if\s*\(\s*(?:texture2D|texture)\s*\()/i,
    scopeCondition: 'FILE_SCOPE',
    enabled: true,
    alternative: {
      title: 'Flatten Branches Using step(), mix(), or Compile-Time Constants',
      explanation: 'Replace branch conditionals with mathematical `mix()`, `step()`, or `clamp()` functions to keep GPU SIMD execution completely uniform.',
      theoreticalFpsGainMs: 2.4,
      estimatedGcSavedKb: 0.0,
      originalAntiPatternCode: `// ❌ Bad: Warp divergence in fragment execution\nif (color.a > 0.5) {\n  finalColor = color * lightMultiplier;\n} else {\n  finalColor = vec4(0.0);\n}`,
      recommendedCode: `// ✅ Optimized: Branchless arithmetic execution\nfloat mask = step(0.5, color.a);\nvec4 finalColor = mix(vec4(0.0), color * lightMultiplier, mask);`
    }
  },
  {
    id: 'ENG-GPU-003',
    name: 'Excessive Precision (highp) in Mobile Fragment Shader',
    category: 'GPU_SHADER',
    severity: 'MEDIUM',
    targetPlatforms: ['TYPESCRIPT_WEBGL', 'UNIVERSAL'],
    supportedLanguages: ['glsl', 'hlsl'],
    shortDescription: 'Using precision highp float in fragment shaders wastes bandwidth and register cache on mobile GPUs.',
    detailedExplanation: 'Mobile GPUs (Apple Bionic, Qualcomm Adreno, ARM Mali) feature 16-bit FPUs with double the arithmetic rate and half the register pressure. Using `highp` everywhere in fragment code restricts occupancy and causes thermal throttling.',
    engineContext: 'Mobile Fragment Shader',
    regexPattern: /precision\s+highp\s+float;/,
    scopeCondition: 'FILE_SCOPE',
    enabled: true,
    alternative: {
      title: 'Adopt precision mediump float for Colors and Normals',
      explanation: 'Reserve `highp` exclusively for world-space position and depth calculations, using `mediump` for lighting, normals, and color values.',
      theoreticalFpsGainMs: 1.8,
      estimatedGcSavedKb: 0.0,
      originalAntiPatternCode: `// ❌ Suboptimal: Forces full 32-bit floats across all mobile fragment calculations\nprecision highp float;\nvarying vec2 vUv;`,
      recommendedCode: `// ✅ Optimized: 16-bit half precision doubles mobile GPU ALU throughput\nprecision mediump float;\nvarying mediump vec2 vUv;`
    }
  },

  // --------------------------------------------------------------------------
  // 5. CONCURRENCY_IO RULES
  // --------------------------------------------------------------------------
  {
    id: 'ENG-IO-001',
    name: 'Synchronous Blocking Asset / File I/O on Main Thread',
    category: 'CONCURRENCY_IO',
    severity: 'CRITICAL',
    targetPlatforms: ['UNIVERSAL', 'TYPESCRIPT_WEBGL', 'UNITY_CSHARP'],
    supportedLanguages: ['typescript', 'javascript', 'csharp', 'cpp'],
    shortDescription: 'Calling readFileSync, Resources.Load, or synchronous network requests halts the game loop.',
    detailedExplanation: 'Synchronous I/O halts the entire rendering thread until the disk or network responds. This produces an immediate hitch (often hundreds of milliseconds long) where the frame rate drops to 0 FPS.',
    engineContext: 'Gameplay Frame / Level Streaming',
    regexPattern: /(?:fs\.readFileSync|Resources\.Load\s*\(|new\s+XMLHttpRequest\s*\(|File\.ReadAllText|File\.ReadAllBytes)/,
    scopeCondition: 'ANY',
    enabled: true,
    alternative: {
      title: 'Use Asynchronous Asset Streaming / Coroutines',
      explanation: 'Use `Resources.LoadAsync`, `Addressables.LoadAssetAsync`, or `fetch()` / `fs.promises.readFile` with async/await in background worker threads.',
      theoreticalFpsGainMs: 16.0,
      estimatedGcSavedKb: 256.0,
      originalAntiPatternCode: `// ❌ Bad: Synchronous block drops frames and freezes audio\npublic loadWeaponModel(name: string): ModelData {\n  const raw = fs.readFileSync(\`./assets/\${name}.bin\`);\n  return parseModel(raw);\n}`,
      recommendedCode: `// ✅ Optimized: Non-blocking asynchronous asset stream\npublic async loadWeaponModel(name: string): Promise<ModelData> {\n  const response = await fetch(\`/assets/\${name}.bin\`);\n  const buffer = await response.arrayBuffer();\n  return parseModel(buffer);\n}`
    }
  },
  {
    id: 'ENG-IO-002',
    name: 'Repeated JSON.parse / Deserialization in Hot Loop',
    category: 'CONCURRENCY_IO',
    severity: 'HIGH',
    targetPlatforms: ['TYPESCRIPT_WEBGL', 'UNIVERSAL'],
    supportedLanguages: ['typescript', 'javascript'],
    shortDescription: 'Parsing JSON strings inside tick or animation callbacks causes major main-thread stalling.',
    detailedExplanation: '`JSON.parse()` performs full lexical analysis and object tree construction on the main JS thread. Doing this per-frame generates massive garbage and locks the event loop.',
    engineContext: 'Update / Network Packet Handling',
    regexPattern: /(?:JSON\.parse\s*\(|JSON\.stringify\s*\()/i,
    scopeCondition: 'INSIDE_HOT_LOOP',
    enabled: true,
    alternative: {
      title: 'Use FlatBuffers, Protocol Buffers, or TypedArray Binary Payloads',
      explanation: 'Switch to zero-copy binary formats (FlatBuffers or struct views on `ArrayBuffer`) that allow direct memory reading without serialization overhead.',
      theoreticalFpsGainMs: 2.2,
      estimatedGcSavedKb: 80.0,
      originalAntiPatternCode: `// ❌ Bad: Parses string JSON in per-frame packet handler\npublic onNetworkTick(packetStr: string): void {\n  const data = JSON.parse(packetStr);\n  this.applyState(data);\n}`,
      recommendedCode: `// ✅ Optimized: Zero-copy TypedArray binary view\npublic onNetworkTick(buffer: ArrayBuffer): void {\n  const view = new Float32Array(buffer);\n  this.applyBinaryState(view);\n}`
    }
  },

  // --------------------------------------------------------------------------
  // 6. MEMORY_CACHE RULES
  // --------------------------------------------------------------------------
  {
    id: 'ENG-MEM-001',
    name: 'String Tag Comparison (tag == "Enemy" vs CompareTag)',
    category: 'MEMORY_CACHE',
    severity: 'HIGH',
    targetPlatforms: ['UNITY_CSHARP', 'UNIVERSAL', 'TYPESCRIPT_WEBGL'],
    supportedLanguages: ['csharp', 'typescript', 'javascript'],
    shortDescription: 'Using `gameObject.tag == "Name"` allocates a string copy; use CompareTag() or Numeric Layer Mask.',
    detailedExplanation: 'In Unity, `gameObject.tag` invokes native-to-managed marshaling and allocates a new string copy on the heap on every access. Using `gameObject.CompareTag("Enemy")` or bitwise layer masks bypasses string allocation completely.',
    engineContext: 'Collision / Trigger / AI Loop',
    regexPattern: /(?:\.tag\s*==\s*["'][^"']+["']|\.tag\.Equals\s*\(["'][^"']+["']\))/i,
    scopeCondition: 'ANY',
    enabled: true,
    alternative: {
      title: 'Use CompareTag() or Numeric Bitmask ID',
      explanation: 'Replace `tag == "Target"` with `CompareTag("Target")` or integer enum layer masks.',
      theoreticalFpsGainMs: 0.9,
      estimatedGcSavedKb: 36.0,
      originalAntiPatternCode: `// ❌ Bad: Allocates a new string copy on every single collision\nvoid OnTriggerEnter(Collider other) {\n  if (other.gameObject.tag == "Enemy") {\n    DealDamage();\n  }\n}`,
      recommendedCode: `// ✅ Optimized: Native comparison with zero GC allocation\nvoid OnTriggerEnter(Collider other) {\n  if (other.gameObject.CompareTag("Enemy")) {\n    DealDamage();\n  }\n}`,
      replacementTemplate: `$1CompareTag("$2")`
    }
  },
  {
    id: 'ENG-MEM-002',
    name: 'Separate Position & Rotation Writes (Double Matrix Recalculation)',
    category: 'MEMORY_CACHE',
    severity: 'MEDIUM',
    targetPlatforms: ['UNIVERSAL', 'UNITY_CSHARP', 'TYPESCRIPT_WEBGL'],
    supportedLanguages: ['csharp', 'typescript', 'javascript'],
    shortDescription: 'Setting transform.position and transform.rotation separately marks the local matrix dirty twice.',
    detailedExplanation: 'Assigning `transform.position` flags the scene graph transform matrix as dirty and recalculates hierarchical bounds. Setting `transform.rotation` on the next line immediately dirties it a second time, doing double work.',
    engineContext: 'Update / Physics Step',
    regexPattern: /(?:transform\.position\s*=[^;]+;\s*(?:[a-zA-Z0-9_.]+\.)?transform\.rotation\s*=)/s,
    scopeCondition: 'ANY',
    enabled: true,
    alternative: {
      title: 'Batch Updates with SetPositionAndRotation()',
      explanation: 'Use `SetPositionAndRotation(pos, rot)` to update both spatial vectors in a single atomic matrix calculation.',
      theoreticalFpsGainMs: 0.7,
      estimatedGcSavedKb: 0.0,
      originalAntiPatternCode: `// ❌ Bad: Calculates transform matrix and updates children twice\ntransform.position = newPos;\ntransform.rotation = newRot;`,
      recommendedCode: `// ✅ Optimized: Single atomic matrix recalculation\ntransform.SetPositionAndRotation(newPos, newRot);`
    }
  },
  {
    id: 'ENG-MEM-003',
    name: 'Unpooled Instantiation in Combat / Hot Path',
    category: 'MEMORY_CACHE',
    severity: 'CRITICAL',
    targetPlatforms: ['UNIVERSAL', 'UNITY_CSHARP', 'TYPESCRIPT_WEBGL', 'UNREAL_CPP'],
    supportedLanguages: ['csharp', 'typescript', 'javascript', 'cpp'],
    shortDescription: 'Calling Instantiate() or new Entity() for high-frequency objects (bullets, particles, damage numbers).',
    detailedExplanation: 'Instantiating and Destroying game objects during runtime causes heap fragmentation, garbage spikes, and CPU hitching on destruction. High-frequency entities must be recycled via an Object Pool.',
    engineContext: 'Weapon Fire / Spawner / Bullet Hell System',
    regexPattern: /(?:Instantiate\s*\([^)]+\)|new\s+BulletEntity\s*\(|new\s+Projectile\s*\()/i,
    scopeCondition: 'INSIDE_HOT_LOOP',
    enabled: true,
    alternative: {
      title: 'Implement Reusable Object Pool Pattern',
      explanation: 'Recycle disabled instances from an Object Pool rather than allocating and deallocating memory at runtime.',
      theoreticalFpsGainMs: 4.5,
      estimatedGcSavedKb: 160.0,
      originalAntiPatternCode: `// ❌ Bad: Allocates and destroys hundreds of objects per minute\npublic shootBullet(): void {\n  const bullet = Instantiate(this.bulletPrefab, this.muzzle.position, this.muzzle.rotation);\n}`,
      recommendedCode: `// ✅ Optimized: Zero-allocation retrieval from object pool\npublic shootBullet(): void {\n  const bullet = BulletPool.instance.get(this.muzzle.position, this.muzzle.rotation);\n}`
    }
  },
  {
    id: 'ENG-MEM-004',
    name: 'Unbounded Debug Logging in Production Hot Loop',
    category: 'MEMORY_CACHE',
    severity: 'HIGH',
    targetPlatforms: ['UNIVERSAL', 'TYPESCRIPT_WEBGL', 'UNITY_CSHARP'],
    supportedLanguages: ['typescript', 'javascript', 'csharp', 'cpp'],
    shortDescription: 'console.log() or Debug.Log() in update loop floods browser console and serializes call stacks.',
    detailedExplanation: 'Calling `console.log` in browser devtools or `Debug.Log` in Unity captures full stack traces, stringifies variables, and pauses V8/Mono JIT threads, crippling performance down to 15-20 FPS.',
    engineContext: 'Update / Tick Loop',
    regexPattern: /(?:console\.log\s*\(|Debug\.Log\s*\(|std::cout\s*<<)/i,
    scopeCondition: 'INSIDE_HOT_LOOP',
    enabled: true,
    alternative: {
      title: 'Wrap in Conditional Compilation Flag or Throttled Profiler',
      explanation: 'Strip debug logs in release builds or throttle logging to once every 60 frames.',
      theoreticalFpsGainMs: 2.8,
      estimatedGcSavedKb: 50.0,
      originalAntiPatternCode: `// ❌ Bad: Floods console 60 times/sec with string serialization\npublic update(): void {\n  console.log("Current player pos: " + this.pos.x + ", " + this.pos.y);\n}`,
      recommendedCode: `// ✅ Optimized: Stripped in production or throttled\n#if DEBUG\nif (Time.frameCount % 60 == 0) {\n  Debug.LogFormat("Player: {0}, {1}", this.pos.x, this.pos.y);\n}\n#endif`
    }
  }
];

/**
 * ดึงรายการกฎทั้งหมดที่รองรับ
 */
export function getAllEngineRules(): EngineAntiPatternRule[] {
  return ENGINE_STATIC_ANALYSIS_RULES;
}

/**
 * ค้นหากฎตาม ID
 */
export function getEngineRuleById(ruleId: string): EngineAntiPatternRule | undefined {
  return ENGINE_STATIC_ANALYSIS_RULES.find(r => r.id === ruleId);
}
