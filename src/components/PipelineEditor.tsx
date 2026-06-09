import React, { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle, Loader2, Server, FileText, Image as ImageIcon, Box, ShieldCheck, GitCommit, Bot, MessageSquare, Briefcase, Zap, Cpu, Users, GitPullRequest, Search, FileCode2, Crosshair, Cloud, Map, Database, Network, Globe, Boxes } from 'lucide-react';

type AgentMsg = {
  agentName: string;
  role: string;
  color: string;
  content: string;
  timestamp: string;
};

const SCENARIOS = {
  weapon: {
    id: 'weapon',
    name: 'AAA Combat Mechanics',
    icon: <Crosshair size={14} />,
    prompt: "Create a comprehensive full-stack Weapon System (Assault Rifle) for FPS/TPS. Generate 3D models with moving mechanical parts. Write C++ logic for Single, 3-burst, 5-burst, and Full Auto fire modes. Generate vast procedural animations: Idle variations, gun-twirling loops, tactical reload (round in chamber), empty reload, and jam-clearance, in both First-Person and 3rd-Person over-shoulder views. Generate Niagara VFX: Muzzle flash, physically simulated shell ejections, smoke bloom, and bullet impact scorches. Map dynamic audio for all mechanical states. Ensure 100% engine interoperability.",
    stages: [
      { 
        id: 0, 
        title: 'Commander Cluster (Planning & Analysis)', 
        desc: 'Parsing deep mechanical requirements, allocating physics and animation sub-routines.', 
        icon: <Server size={18} />,
        agents: [
          { name: 'Overlord-Prime', role: 'Task Manager', color: '#f85149' },
          { name: 'Resource-Node', role: 'VRAM Allocator', color: '#58a6ff' }
        ],
        chatSequence: [
          { a: 0, msg: "Massive prompt received. Parsing: high-poly mesh, C++ fire logic (Single, Burst-3, Burst-5, Auto), dual-perspective animations (FPS/TPS), tactical/empty reloads, twirl/inspect, Niagara VFX, Audio." },
          { a: 1, msg: "Demands are immense. Allocating 48GB VRAM across GPU cluster. Distributing LLaMA-3 x8, SDXL, AudioLDM, and CodeLlama." },
          { a: 0, msg: "Splitting into 6 massive execution stages. Logic First, then Mesh, Animation, VFX, Audio, and Final QA. Initiating." }
        ]
      },
      { 
        id: 1, 
        title: 'Logic & State Engine Cluster', 
        desc: 'Writing C++ state machines for complex fire selectors, ammo tracking, and jam probabilities.', 
        icon: <FileCode2 size={18} />,
        agents: [
          { name: 'CodeGenius-C', role: 'Lead Programmer', color: '#58a6ff' },
          { name: 'Reviewer-Sigma', role: 'QA Compiler', color: '#f85149' },
          { name: 'MathBot-X', role: 'Ballistics Engineer', color: '#e3b341' }
        ],
        chatSequence: [
          { a: 0, msg: "Building the `AWeaponBase` class. Implementing `enum EFireMode { Single, Burst3, Burst5, Auto }`. Building the selector toggle logic." },
          { a: 2, msg: "Calculating recoil impulse curves. Adding progressive muzzle climb for Burst-5 and Auto. Single fire will realign instantly." },
          { a: 0, msg: "Added logic for `CurrentAmmo` vs `ChamberedRound`. If reloading with ammo > 0, `bIsTacticalReload = true`. If 0, `bIsEmptyReload = true`." },
          { a: 0, msg: "Also added a 0.5% chance for `TriggerStoppage()` (Jam) during full-auto fire exceeding 50 continuous rounds." },
          { a: 1, msg: "Compiling AST. Validating memory pointers. No leaks detected. Logic is airtight. Ready for animations to hook." }
        ]
      },
      { 
        id: 2, 
        title: '3D Mechanics & Texturing Cluster', 
        desc: 'Generating weapon mesh with exact mechanical internal parts (bolt, mag, trigger, ejection port).', 
        icon: <Box size={18} />,
        agents: [
          { name: 'MeshWeaver-AI', role: '3D Modeler', color: '#3fb950' },
          { name: 'TextureDiff-X', role: 'Material Artist', color: '#bc8cff' }
        ],
        chatSequence: [
          { a: 0, msg: "Generating modular AR mesh. Creating separate sub-meshes: UpperReceiver, LowerReceiver, BoltCarrierPanel, Magazine, FireSelector, Trigger." },
          { a: 0, msg: "Rigging the skeleton. Root at grip, bones for Mag, Bolt, Trigger. Ensure inverse kinematics (IK) sockets are placed for the left hand." },
          { a: 1, msg: "Baking 4K PBR textures. Adding micro-scratches to the mag well. Adding thermal stress discoloration to the barrel tip." },
          { a: 1, msg: "Exporting Material instance with customizable wear parameters. Mesh and textures complete." }
        ]
      },
      { 
        id: 3, 
        title: 'Cinematic Animation Cluster', 
        desc: 'Synthesizing FPS & TPS animations: Inspect, twirling, tactical reload, empty reload.', 
        icon: <Boxes size={18} />,
        agents: [
          { name: 'MocapSim-9', role: 'Motion Generator', color: '#e3b341' },
          { name: 'KinematicBot', role: 'Rig Adjuster', color: '#3fb950' }
        ],
        chatSequence: [
          { a: 0, msg: "Generating FPS idle state with subtle breathing sway. Translating coordinate space for TPS over-the-shoulder matching." },
          { a: 0, msg: "Generating Tactical Reload (retention reload): Remove mag, insert new mag. Time: 1.8s." },
          { a: 0, msg: "Generating Empty Reload: Remove mag, insert new mag, hit bolt release paddle. Time: 2.4s." },
          { a: 1, msg: "IK hands are clipping the mag well on frame 34. Adjusting wrist solver..." },
          { a: 1, msg: "Fixed. Now generating 'Inspect/Twirl' loop. Right hand spins the weapon on the trigger guard, left hand checks the chamber. Time: 4.5s." },
          { a: 0, msg: "Don't forget the 'Jam Clearance' animation. Cocking handle pull to eject deformed brass. Done." }
        ]
      },
      { 
        id: 4, 
        title: 'VFX & Physics Simulation Cluster', 
        desc: 'Creating muzzle flashes, dynamic shell casing ejections, and impact decals.', 
        icon: <Zap size={18} />,
        agents: [
          { name: 'ParticleForge-9', role: 'Niagara Tech Art', color: '#f85149' },
          { name: 'Collider-Sigma', role: 'Physics Sim', color: '#58a6ff' }
        ],
        chatSequence: [
          { a: 0, msg: "Building Niagara system. `MuzzleFlash_Auto`: High volumetric bloom, directional spark emission, lingering barrel smoke." },
          { a: 1, msg: "Hooking up `ShellEjection`. Mapping velocity vector +X, +Y based on bolt cycle rate..." },
          { a: 1, msg: "Adding physics collision to brass casings. They will bounce on the floor geometry with randomized restitution (bounciness: 0.4)." },
          { a: 0, msg: "Spawning `Decal_ScorchedConcrete` on bullet hit traces. Added minor structural dust particle burst per impact." }
        ]
      },
      { 
        id: 5, 
        title: 'Acoustic & Audio Synthesis Cluster', 
        desc: 'Generating dynamic mechanical sound effects.', 
        icon: <Server size={18} />,
        agents: [
          { name: 'AudioWeave', role: 'Sound Designer', color: '#bc8cff' },
          { name: 'MixerBot', role: 'Acoustic Engineer', color: '#e3b341' }
        ],
        chatSequence: [
          { a: 0, msg: "Synthesizing base gunshot. Punchy 200Hz transient with 4kHz snap. Creating 5 pitch/yaw variations for Full-Auto cycle preventing phase cancellation." },
          { a: 1, msg: "Generating Foley sounds: Mag out, Mag in friction, Bolt release clack. Adding metallic ring to empty chamber trigger pull." },
          { a: 1, msg: "Mapping shell casing ground collision sounds based on physical velocity." }
        ]
      },
      { 
        id: 6, 
        title: 'Supreme QA & Final Assembly', 
        desc: 'Testing all fire modes, state transitions, and checking visual/audio sync.', 
        icon: <ShieldCheck size={18} />,
        agents: [
          { name: 'Overlord-QA', role: 'Director Validator', color: '#58a6ff' },
          { name: 'Assembler-Bot', role: 'Scene Builder', color: '#2ea043' }
        ],
        chatSequence: [
          { a: 0, msg: "Executing simulation array. Testing Burst-3 switch... fire rate is precise. Testing Tactical vs Empty reload states... animation triggers correctly." },
          { a: 1, msg: "Inspecting VFX alignment. Ejected casings originate precisely from the ejection port bone during the bolt open frame." },
          { a: 0, msg: "Inspecting Twirl animation. Collision vectors pass, audio foley syncs with hand slaps." },
          { a: 1, msg: "All modules nominal. The weapon system is a 100% complete, AAA-quality blueprint. Packing array." }
        ]
      }
    ]
  },
  saas: {
    id: 'saas',
    name: 'Enterprise Cloud SaaS',
    icon: <Cloud size={14} />,
    prompt: "Deploy a massive Enterprise Cloud SaaS Architecture. Write the entire codebase for a distributed microservices platform including an API Gateway, Auth Service (OAuth2, JWT), Real-time WebSocket Hub, and Billing Service (Stripe). Generate React 18 / Tailwind frontend UI. Provision Kubernetes (K8s) YAMLs, Terraform AWS infrastructure, and Grafana/Prometheus telemetry. Run strict OWASP penetration testing simulations on all generated code.",
    stages: [
      { 
        id: 0, 
        title: 'Commander Cluster (SysArch & Networks)', 
        desc: 'Analyzing requirements, selecting tech stack, parsing microservices topology.', 
        icon: <Server size={18} />,
        agents: [
          { name: 'SysArch-Alpha', role: 'Chief Architect', color: '#f85149' },
          { name: 'Network-Weaver', role: 'Topology Eng', color: '#58a6ff' }
        ],
        chatSequence: [
          { a: 0, msg: "Analyzing SaaS requirements. Choosing Event-Driven Microservices pattern via Kafka. Target: high-scalability Kubernetes." },
          { a: 1, msg: "Allocating sub-cluster resources. Booting API-Generator, DB-Schema-Optimizer, and React-Weaver into active VRAM." },
          { a: 0, msg: "Defining gRPC for internal service communication, REST/GraphQL for public API Gateway." }
        ]
      },
      { 
        id: 1, 
        title: 'Backend & Database Engineering', 
        desc: 'Generating Go/Node.js services, SQL schemas, and caching layers.', 
        icon: <Database size={18} />,
        agents: [
          { name: 'GoLang-Engine', role: 'Backend Dev', color: '#58a6ff' },
          { name: 'DB-Admin-X', role: 'Database Eng', color: '#e3b341' }
        ],
        chatSequence: [
          { a: 1, msg: "Drafting PostgreSQL relational schema. Enabling TimescaleDB extension for metric tracking. Compiling schema migrations." },
          { a: 0, msg: "Writing API Gateway in Go. Implementing rate-limiting middleware (Token Bucket algorithm) and JWT Auth." },
          { a: 1, msg: "Generating Redis caching layer logic for fast session retrievals. Target cache hit rate: >95%." },
          { a: 0, msg: "Deploying WebSocket Hub in Node.js for real-time bidirectional syncing." }
        ]
      },
      { 
        id: 2, 
        title: 'Frontend UI/UX Generation', 
        desc: 'Scaffolding React 18 frontend, writing Tailwind components, managing global state.', 
        icon: <Globe size={18} />,
        agents: [
          { name: 'React-Master', role: 'Frontend Dev', color: '#3fb950' },
          { name: 'Design-Ops', role: 'UI/UX Lead', color: '#bc8cff' }
        ],
        chatSequence: [
          { a: 0, msg: "Scaffolding React workspace with Vite. Installing Zustand for global state and React Query for server caching." },
          { a: 1, msg: "Generating Tailwind component library: Data Tables, Modal Dialogs, Navbars, and animated Skeleton loaders." },
          { a: 0, msg: "Implementing dynamic dashboard charts using Recharts. Linking them to the WebSocket Hub." },
          { a: 1, msg: "Running automated visual regression tests across Mobile, Tablet, and Desktop breakpoints. All pass." }
        ]
      },
      { 
        id: 3, 
        title: 'SecOps & OWASP Pen-Testing', 
        desc: 'Simulating cyber-attacks to automatically find and patch software vulnerabilities.', 
        icon: <ShieldCheck size={18} />,
        agents: [
          { name: 'RedTeam-Bot', role: 'Offensive Sec', color: '#f85149' },
          { name: 'Sec-Auditor', role: 'Defensive Sec', color: '#e3b341' }
        ],
        chatSequence: [
          { a: 0, msg: "Initiating OWASP Top 10 attack simulation. Attempting SQL injection on login endpoints: `' OR 1=1 --`." },
          { a: 1, msg: "SQLi attack blocked. Queries are strongly parameterized in the Go backend. Pass." },
          { a: 0, msg: "Attempting XSS payload injection via user profile bio field. `<script>alert('xss')</script>`" },
          { a: 1, msg: "XSS neutralized by React DOM auto-escaping. However, found missing CSRF tokens on the Stripe Billing endpoint." },
          { a: 0, msg: "Exploit successful. Applying automatic patch: updating JWT cookies to 'SameSite=Strict' and adding CSRF headers." }
        ]
      },
      { 
        id: 4, 
        title: 'DevOps & Infrastructure as Code', 
        desc: 'Writing Terraform, Dockerfiles, and Kubernetes manifests.', 
        icon: <Network size={18} />,
        agents: [
          { name: 'Cloud-Deployer', role: 'DevOps Eng', color: '#bc8cff' },
          { name: 'Terra-Forma', role: 'Cloud Arch', color: '#58a6ff' }
        ],
        chatSequence: [
          { a: 1, msg: "Generating Terraform scripts for AWS: provisioning VPC, Security Groups, EKS cluster, and RDS Multi-AZ instances." },
          { a: 0, msg: "Writing optimized Multi-stage Dockerfiles. Switching to Alpine base images to reduce attack surface and size." },
          { a: 0, msg: "Drafting Kubernetes Deployments, Services, and Ingress YAML objects. Auto-scaling rules applied." },
          { a: 1, msg: "Configuring Helm charts for Prometheus and Grafana monitoring stacks. Telemetry is active." }
        ]
      },
      { 
        id: 5, 
        title: 'CI/CD Assembly & QA', 
        desc: 'Validating final build pipeline and assuring delivery quality.', 
        icon: <CheckCircle size={18} />,
        agents: [
          { name: 'CI-CD-Bot', role: 'Release Manager', color: '#3fb950' }
        ],
        chatSequence: [
          { a: 0, msg: "Triggering mock GitHub Actions pipeline. Linting passes, unit tests pass, e2e Cypress tests pass." },
          { a: 0, msg: "Docker images successfully registered in the simulated ECR." },
          { a: 0, msg: "The entire Enterprise SaaS codebase is structurally perfect and ready for immediate deployment." }
        ]
      }
    ]
  },
  fullgame: {
    id: 'fullgame',
    name: 'Full AAA Game Studio (End-to-End)',
    icon: <Globe size={14} />,
    prompt: "Generate a complete AAA Multiplayer Game from scratch. Detail every microscopic aspect: Game Design Document (GDD), C++ Memory Allocators, Custom Network Sync (Client Prediction, Server Reconciliation, Delta Compression), 10-Layer Material Shaders, MetaHuman Rigging with Motion Matching, Fluid Compute Shaders, Wwise 3D Spatial Audio with Ray-traced Occlusion, Slate UI/UX, and console-ready packaging (PS5/Xbox) with CI/CD Jenkins pipeline. No detail left behind, calculate specific physics forces and exact buffer byte alignments.",
    stages: [
      { 
        id: 0, 
        title: 'Director Cluster (GDD & Engine Architecture)', 
        desc: 'Writing a 200-page GDD, setting up Git LFS, custom C++ macros, and memory allocators.', 
        icon: <Server size={18} />,
        agents: [
          { name: 'Director-Prime', role: 'Game Director', color: '#f85149' },
          { name: 'SysArch-C++', role: 'Lead Engine Arch', color: '#58a6ff' },
          { name: 'Math-Core', role: 'Memory Engineer', color: '#e3b341' }
        ],
        chatSequence: [
          { a: 0, msg: "Initiating Project 'Omniverse'. Setting target: 4K 120FPS on PS5/PC. We need a 200-page GDD outlining mechanics, lore, and monetization." },
          { a: 1, msg: "Initializing custom Engine fork. Setting up CMake and Git LFS. Writing custom C++ memory arenas (Bump Allocator for transient frames, Pool allocator for projectiles)." },
          { a: 2, msg: "Aligning data structures to 64-byte cache lines to prevent false sharing and L1 cache misses. Fast math intrinsics (AVX2/FMA) enabled for vector ops." },
          { a: 1, msg: "Engine architecture skeleton committed. Passing state to Network and Gameplay engineering." }
        ]
      },
      { 
        id: 1, 
        title: 'Netcode & Core Systems', 
        desc: 'Building UDP reliable/unreliable channels, Client Prediction, and Server Reconciliation.', 
        icon: <Network size={18} />,
        agents: [
          { name: 'Net-Weaver', role: 'Network Engineer', color: '#bc8cff' },
          { name: 'Logic-Bot', role: 'Gameplay C++', color: '#3fb950' }
        ],
        chatSequence: [
          { a: 0, msg: "Implementing custom UDP transport layer. TCP is too slow for 128-tick rate. Building bit-packer for delta compression." },
          { a: 1, msg: "Writing Character Movement Component. Integrating Client Prediction... storing input history buffer (size: 64 frames)." },
          { a: 0, msg: "Server Reconciliation logic added. If state diverges by > 2.5cm, client snaps back and replays unacknowledged inputs." },
          { a: 1, msg: "Writing Lag Compensation (Rewind) for hitscan weapons. Server caches exact hitboxes for the last 500ms. Perfect sync achieved." }
        ]
      },
      { 
        id: 2, 
        title: 'Procedural Art & Complex Rigging', 
        desc: 'MetaHuman integrations, facial blendshapes, and cloth physics parameters.', 
        icon: <Box size={18} />,
        agents: [
          { name: 'Rigging-Alpha', role: 'Tech Animator', color: '#e3b341' },
          { name: 'Texture-9', role: 'Material Tech', color: '#f85149' }
        ],
        chatSequence: [
          { a: 0, msg: "Importing MetaHuman base. Setting up ARKit 52 facial blendshapes. Hooking up Motion Matching (generating 5000+ transitions from mocap)." },
          { a: 1, msg: "Writing 10-layer Master Material in HLSL. Parallax Occlusion Mapping (POM), Subsurface Scattering for skin, and Anisotropic highlights for hair." },
          { a: 0, msg: "Configuring Cloth Physics solver. Tunic parameters: Mass=0.5, Stiffness=0.8, Iterations=8. Prevents clipping through legs during sprinting." },
          { a: 1, msg: "Baking Albedo/Normal/ORM maps to optimized BC7 compression. Visual fidelity maxed." }
        ]
      },
      { 
        id: 3, 
        title: 'Environmental Simulation & Render Graph', 
        desc: 'Fluid dynamics compute shaders, Nanite overhauls, and Lumen cache tuning.', 
        icon: <Map size={18} />,
        agents: [
          { name: 'Render-Arch', role: 'Graphics Eng', color: '#58a6ff' },
          { name: 'Physics-Gen', role: 'Simulation Eng', color: '#bc8cff' }
        ],
        chatSequence: [
          { a: 0, msg: "Tuning Lumen Global Illumination. Surface cache memory set to 512MB. Bounces increased to 4 for interior dark zones." },
          { a: 1, msg: "Writing Eulerian Fluid Dynamics compute shader for water interactions. Grid size: 256x256x64. Vorticity confinement enabled." },
          { a: 0, msg: "Configuring Virtual Shadow Maps (VSM). Page pool size: 128MB. Caching static geometry shadows to save 4ms per frame." },
          { a: 1, msg: "Enabling Chaos destruction physics. Pre-fracturing concrete columns into 500 chunks. Field System limits strain threshold." }
        ]
      },
      { 
        id: 4, 
        title: 'Spatial Audio & UI/UX', 
        desc: 'Wwise integration, HRTF, procedural footstep Foley, and Slate/React UI.', 
        icon: <Zap size={18} />,
        agents: [
          { name: 'Acoustic-AI', role: 'Audio Eng', color: '#3fb950' },
          { name: 'UX-Master', role: 'UI/UX Dev', color: '#e3b341' }
        ],
        chatSequence: [
          { a: 0, msg: "Initializing Wwise middleware. Setting up HRTF (Head-Related Transfer Function) for true 3D spatial audio." },
          { a: 0, msg: "Ray-tracing audio occlusion. High frequencies cut off when behind walls. Adding Doppler shift to fast-moving projectiles." },
          { a: 1, msg: "Building HUD in custom Slate (C++) / WebUI wrap. Creating dynamic crosshair expanding based on weapon spread bloom." },
          { a: 0, msg: "Procedural footsteps matrix: 12 surfaces x 4 speeds x 5 variations. Switching based on raycast to floor physics material." }
        ]
      },
      { 
        id: 5, 
        title: 'Console CI/CD & Profiler QA', 
        desc: 'Automated builds, RenderDoc profiling, and PS5/Xbox packaging.', 
        icon: <CheckCircle size={18} />,
        agents: [
          { name: 'DevOps-Bot', role: 'Release Eng', color: '#bc8cff' },
          { name: 'QA-Sigma', role: 'Performance Tester', color: '#f85149' }
        ],
        chatSequence: [
          { a: 0, msg: "Pipeline triggered. Jenkins spinning up 10 build nodes. Cooking assets (texture formats: ASTC for Mobile, Oodle/Kraken for PS5)." },
          { a: 1, msg: "Running automated bots on map. Attaching RenderDoc. Found GPU bottleneck in post-process volumetrics. Downgrading half-res buffers." },
          { a: 1, msg: "Running Valgrind memory checks. Cleared. No leaks after 48-hour stress test." },
          { a: 0, msg: "Packaging shipping build. Code stripped, DRM wrapper applied. 115 GB master branch submitted to certification servers." }
        ]
      }
    ]
  },
  openworld: {
    id: 'openworld',
    name: 'Procedural Open World (100km²)',
    icon: <Map size={14} />,
    prompt: "Generate a hyper-realistic 100km² Procedural Open World RPG System. Simulate 10,000 years of tectonic and hydraulic erosion for heightmaps. Generate PCG (Procedural Content Generation) rules for 5 distinct biomes (Desert, Tundra, Swamp, Redwoods, Volcanic). Build an autonomous Ecosystem AI where carnivores hunt herbivores. Generate road splines, modular medieval cities, and an active dynamic economy simulation.",
    stages: [
      { 
        id: 0, 
        title: 'Commander Cluster (World Parameters)', 
        desc: 'Processing immense scale, dividing workload into streamable chunks.', 
        icon: <Server size={18} />,
        agents: [
          { name: 'World-Builder', role: 'Director', color: '#f85149' },
          { name: 'Geo-Logic', role: 'Data Arch', color: '#58a6ff' }
        ],
        chatSequence: [
          { a: 0, msg: "Processing 100km² scale requirement. This will exceed regular RAM limits. Dividing into 64 streamable world chunks." },
          { a: 1, msg: "Allocating out-of-core compute memory. Setting World Z=0 as sea level. Preparing 8k heightmap grids." },
          { a: 0, msg: "Delegating parallel passes to Erosion, Flora, and AI ecosystem compute engines." }
        ]
      },
      { 
        id: 1, 
        title: 'Geological & Erosion Physics', 
        desc: 'Simulating tectonic shifts and 10,000 years of weather erosion.', 
        icon: <Map size={18} />,
        agents: [
          { name: 'Erosion-Sim', role: 'Physicist', color: '#e3b341' },
          { name: 'Heightmap-Gen', role: 'Geologist', color: '#bc8cff' }
        ],
        chatSequence: [
          { a: 1, msg: "Generating base Voronoi noise plates for continental drift simulation. Creating natural mountain ridges." },
          { a: 0, msg: "Running hydraulic erosion compute shader. Iteration 10,000. Carving realistic river networks and coastal cliff faces." },
          { a: 0, msg: "Calculating thermal weathering on steep peaks to form talus slopes at the basin foundations." },
          { a: 1, msg: "Complete. Baking normal maps, flow maps, and slope data to be used as physical masks for foliage algorithms." }
        ]
      },
      { 
        id: 2, 
        title: 'PCG Biome Algorithms', 
        desc: 'Rule-based foliage scattering, material layering, and volumetric setup.', 
        icon: <Box size={18} />,
        agents: [
          { name: 'Flora-Bot', role: 'Botanist AI', color: '#3fb950' },
          { name: 'Bio-Scripter', role: 'PCG Tech', color: '#58a6ff' }
        ],
        chatSequence: [
          { a: 1, msg: "Applying PCG scatter rules on slope masks. Pine forests assigned to slope < 30 degrees, altitude > 500m." },
          { a: 0, msg: "Generating swamp biome in low-altitude moisture basins. Replacing ground materials with mud and stagnant water." },
          { a: 1, msg: "Executing spatial hash grid for collision culling. Placed 2.4 million trees over 100km²." },
          { a: 0, msg: "Enabled Nanite instancing for all foliage assets. Spawning localized volumetric fog volumes in the Redwood and Swamp biomes." }
        ]
      },
      { 
        id: 3, 
        title: 'Sentient Ecosystem & AI Paths', 
        desc: 'Baking NavMesh, simulating animal behaviors, food chains, and logic.', 
        icon: <Users size={18} />,
        agents: [
          { name: 'FAUNA-Brain', role: 'Behavior Eng', color: '#e3b341' },
          { name: 'Path-Weaver', role: 'AI Logic', color: '#f85149' }
        ],
        chatSequence: [
          { a: 1, msg: "Baking massive dynamic NavMesh data. Processing chunks asynchronously. Marking steep cliffs as non-traversable." },
          { a: 0, msg: "Programming Deer herd GOAP logic: Forage, Drink, Sleep. Flee trigger set to 20m predator radius." },
          { a: 0, msg: "Programming Wolf pack flanking tactics. Using environmental queries to find ambush points." },
          { a: 1, msg: "Running fast-forward ecosystem simulation... Food chain reached equilibrium. Animals distribute naturally across biomes." }
        ]
      },
      { 
        id: 4, 
        title: 'Civil Engineering & Urban Planning', 
        desc: 'Tracing roads, generating modular cities, defining economy logic.', 
        icon: <Briefcase size={18} />,
        agents: [
          { name: 'City-Scripter', role: 'Civil Eng', color: '#bc8cff' },
          { name: 'Arch-Genius', role: 'Architect', color: '#e3b341' }
        ],
        chatSequence: [
          { a: 0, msg: "Tracing road splines via Dijkstra's pathfinding between high-value resource nodes. Roads avoid steep terrain naturally." },
          { a: 1, msg: "Spawning modular medieval city at the massive river delta. Zoning districts: Slums, Market, Upper Class, Castle." },
          { a: 1, msg: "Instantiating 300+ unique buildings using strict L-System grammar rules so no two houses look exactly identical." }
        ]
      },
      { 
        id: 5, 
        title: 'Macro-Economy & Render QA', 
        desc: 'Dynamic supply/demand tests and performance validation.', 
        icon: <ShieldCheck size={18} />,
        agents: [
          { name: 'Econ-Sim', role: 'Economist', color: '#3fb950' },
          { name: 'Render-Check', role: 'Lighting Tech', color: '#58a6ff' }
        ],
        chatSequence: [
          { a: 0, msg: "Simulating trade caravans. Iron ore values dynamically adjusting based on scarcity and distance from mines." },
          { a: 1, msg: "Validating Lumen Global Illumination bounce stability across fully dynamic Time-of-Day cycles." },
          { a: 1, msg: "Running flythrough load test. 120 FPS target maintained securely via aggressive level-of-detail and World Partition streaming." },
          { a: 0, msg: "100km² World completely generated, populated, and stabilized. Ready to play. Map packed." }
        ]
      }
    ]
  }
};

export default function PipelineEditor() {
  const [activeScenarioId, setActiveScenarioId] = useState<keyof typeof SCENARIOS>('fullgame');
  const [pipelineState, setPipelineState] = useState<'idle' | 'planning' | 'running' | 'completed'>('idle');
  const [masterPrompt, setMasterPrompt] = useState(SCENARIOS['fullgame'].prompt);

  const scenario = SCENARIOS[activeScenarioId];
  const stages = scenario.stages;
  
  // Pipeline state
  const [activeStage, setActiveStage] = useState(-1);
  const [stageProgress, setStageProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [interAgentChat, setInterAgentChat] = useState<AgentMsg[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interAgentChat]);

  const handleScenarioChange = (id: keyof typeof SCENARIOS) => {
    if (pipelineState === 'running' || pipelineState === 'planning') return;
    setActiveScenarioId(id);
    setMasterPrompt(SCENARIOS[id].prompt);
    setPipelineState('idle');
    setLogs([]);
    setInterAgentChat([]);
    setActiveStage(-1);
    setStageProgress(0);
  };

  const handleStartPipeline = () => {
    if (!masterPrompt.trim()) return;
    setPipelineState('planning');
    setLogs(['[SYSTEM] Initializing Offline Swarm Pipeline...', '[SYSTEM] Parsing massive continuous delegation logic...']);
    setInterAgentChat([]);
    setActiveStage(0);
    setStageProgress(0);
    
    // Slight delay before actual start
    setTimeout(() => {
       setPipelineState('running');
    }, 1500);
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (pipelineState === 'running') {
      const currentStageDef = stages[activeStage];
      if (!currentStageDef) return;

      let chatIndex = 0;
      let currentProgress = 0;
      
      const interval = setInterval(() => {
         // Increment progress
         currentProgress += 5 + Math.random() * 5;
         if (currentProgress > 100) currentProgress = 100;
         setStageProgress(currentProgress);

         // Handle simulated chat based on progress
         const expectedChatCount = Math.floor((currentProgress / 100) * currentStageDef.chatSequence.length);
         
         while (chatIndex < expectedChatCount && chatIndex < currentStageDef.chatSequence.length) {
            const chatLog = currentStageDef.chatSequence[chatIndex];
            const agent = currentStageDef.agents[chatLog.a];
            const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            setInterAgentChat(prev => [...prev, {
               agentName: agent.name,
               role: agent.role,
               color: agent.color,
               content: chatLog.msg,
               timestamp
            }]);
            
            setLogs(prev => [...prev, `[${agent.name}] Heavy compute action executed.`]);
            chatIndex++;
         }

         if (currentProgress >= 100) {
            clearInterval(interval);
            
            setLogs(prev => [...prev, `[SYSTEM] Massive Cluster '${currentStageDef.title}' completed successfully. Handover to next cluster...`]);
            
            if (activeStage < stages.length - 1) {
               if (timeoutRef.current) clearTimeout(timeoutRef.current);
               timeoutRef.current = setTimeout(() => {
                  setInterAgentChat(prev => [...prev, {
                     agentName: 'SYSTEM',
                     role: 'Handover',
                     color: '#8b949e',
                     content: `--- Transitioning massive workflow to ${stages[activeStage + 1].title} ---`,
                     timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  }]);
                  setActiveStage(prev => prev + 1);
                  setStageProgress(0);
               }, 2000);
            } else {
               setPipelineState('completed');
               setLogs(prev => [...prev, '[SYSTEM] Entire autonomous pipeline completed 100%. Complex architecture fully resolved & deployed.', 'ALL TASKS PERFECTLY EXECUTED.']);
            }
         }
      }, 350); // Speed of the pipeline

      return () => clearInterval(interval);
    }
  }, [pipelineState, activeStage, stages]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] font-['Helvetica_Neue',Arial,sans-serif] p-6 overflow-hidden">
      
      <div className="flex justify-between items-center mb-6 border-b border-[#30363d] pb-4 shrink-0">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-[#2ea043]/20 rounded-lg">
             <GitPullRequest className="text-[#3fb950]" size={24} />
           </div>
           <div>
             <h1 className="text-xl font-bold text-white tracking-wide">Autonomous AI Swarm (Delegation Network)</h1>
             <p className="text-[12px] text-[#8b949e] mt-1">Single-prompt 100% continuous execution for massive architectures. Offline agents collaborate, write code, and QA each other automatically.</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4 bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2">
           <div className="flex items-center gap-2">
              <Cpu size={16} className="text-[#bc8cff]" />
              <span className="text-[11px] font-bold text-[#8b949e]">Model Matrix:</span>
              <span className="text-[11px] font-mono text-white bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">LLaMA-3 x8 / SDXL / CodeLlama</span>
           </div>
           <div className="w-[1px] h-6 bg-[#30363d]"></div>
           <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#e3b341]" />
              <span className="text-[11px] font-bold text-[#8b949e]">VRAM Cost:</span>
              <span className="text-[11px] font-mono text-[#3fb950]">84.6 GB (Distributed)</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Left Column: Input & Workflow Hierarchy */}
        <div className="w-[400px] flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar">
          
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col shrink-0 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#58a6ff] via-[#bc8cff] to-[#f85149]"></div>
            
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Select Massive Target Topology</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(SCENARIOS) as Array<keyof typeof SCENARIOS>).map(key => (
                  <button 
                    key={key}
                    onClick={() => handleScenarioChange(key)}
                    disabled={pipelineState === 'running' || pipelineState === 'planning'}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all border ${activeScenarioId === key ? 'bg-[#21262d] border-[#8b949e] text-white shadow-sm' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#484f58]'} disabled:opacity-50`}
                  >
                    {SCENARIOS[key].icon} {SCENARIOS[key].name}
                  </button>
                ))}
              </div>
            </div>

            <label className="text-[12px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
               <Bot size={16} className="text-[#58a6ff]"/> Commander Override Prompt
            </label>
            <textarea 
              className="bg-[#0d1117] border border-[#30363d] rounded p-3 text-[12px] text-[#c9d1d9] resize-none h-[110px] focus:border-[#58a6ff] outline-none custom-scrollbar transition-colors leading-relaxed"
              value={masterPrompt}
              onChange={(e) => setMasterPrompt(e.target.value)}
              disabled={pipelineState !== 'idle' && pipelineState !== 'completed'}
            />
            <button 
              onClick={handleStartPipeline}
              disabled={pipelineState !== 'idle' && pipelineState !== 'completed'}
              className="mt-4 flex items-center justify-center gap-2 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#21262d] disabled:text-[#8b949e] disabled:border-[#30363d] text-white py-2.5 rounded font-bold text-[13px] transition-all shadow-[0_0_15px_rgba(46,160,67,0.3)] disabled:shadow-none border border-[#2ea043]"
            >
              {pipelineState === 'idle' || pipelineState === 'completed' ? (
                 <><Play size={16} fill="currentColor"/> Initiate Swarm Delegation (One-Click 100%)</>
              ) : pipelineState === 'planning' ? (
                 <><Search size={16} className="animate-spin" /> Planning Core Delegation...</>
              ) : (
                 <><Loader2 size={16} className="animate-spin" /> Massive Swarm Pipeline Active</>
              )}
            </button>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex-1 flex flex-col text-sm relative">
            <label className="text-[12px] font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Briefcase size={16} className="text-[#e3b341]"/> Delegation Workflow Hierarchy</label>
            
            <div className="flex flex-col gap-0 relative flex-1 pr-2 pb-8">
               {/* Trunk Connection Line */}
               <div className="absolute left-[19px] top-[24px] bottom-[24px] w-[2px] bg-[#30363d] z-0"></div>

               {stages.map((stage, index) => {
                 const isActive = activeStage === index && (pipelineState === 'running' || pipelineState === 'planning');
                 const isDone = activeStage > index || pipelineState === 'completed';
                 
                 return (
                   <div key={stage.id} className="relative z-10 flex gap-4 min-h-[70px]">
                     
                     <div className="flex flex-col items-center mt-1">
                        <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 z-10
                           ${isActive ? 'bg-[#161b22] border-[#58a6ff] text-[#58a6ff] shadow-[0_0_15px_rgba(88,166,255,0.4)]' : 
                             isDone ? 'bg-[#2ea043]/20 border-[#2ea043] text-[#2ea043]' : 
                             'bg-[#0d1117] border-[#30363d] text-[#8b949e]'}`}>
                           {isDone ? <CheckCircle size={18} /> : stage.icon}
                        </div>
                     </div>

                     <div className={`flex-1 pb-6 transition-all duration-300 ${isActive ? 'opacity-100' : isDone ? 'opacity-70' : 'opacity-40 grayscale'}`}>
                        <h3 className={`font-bold text-[13px] ${isActive ? 'text-[#58a6ff]' : isDone ? 'text-white' : 'text-[#c9d1d9]'}`}>{stage.title}</h3>
                        <p className="text-[11px] text-[#8b949e] mt-1 leading-tight">{stage.desc}</p>
                        
                        {isActive && (
                           <div className="w-full bg-[#0d1117] h-1.5 rounded-full mt-3 overflow-hidden border border-[#30363d]">
                              <div className="bg-gradient-to-r from-[#58a6ff] to-[#bc8cff] h-full transition-all duration-300 ease-out" style={{ width: `${stageProgress}%` }}></div>
                           </div>
                        )}
                        
                        {isDone && !isActive && (
                           <div className="mt-2 flex gap-1 flex-wrap">
                              {stage.agents.map((ag, i) => (
                                 <span key={i} className="text-[9px] px-1.5 py-0.5 rounded border border-[#30363d] bg-[#0d1117] text-[#8b949e]">{ag.name} ✓</span>
                              ))}
                           </div>
                        )}
                     </div>
                   </div>
                 )
               })}
            </div>
          </div>
        </div>

        {/* Right Column: Inter-Agent Live Chat & Simulation Matrix */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
           
           {/* Live Discussion Panel */}
           <div className="flex-[2] bg-[#161b22] border border-[#30363d] rounded-lg flex flex-col overflow-hidden relative shadow-lg">
              <div className="h-12 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between px-4">
                 <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#3fb950]"/>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Live Agent Collaboration Matrix</span>
                 </div>
                 {pipelineState === 'running' && (
                    <div className="flex items-center gap-2 bg-[#2ea043]/10 border border-[#2ea043] px-2 py-1 rounded">
                       <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></div>
                       <span className="text-[10px] text-[#3fb950] font-bold">Agents Connecting & Resolving...</span>
                    </div>
                 )}
              </div>
              
              {/* Internal Chat feed */}
              <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111823] to-[#0d1117]">
                 
                 {interAgentChat.length === 0 && pipelineState === 'idle' && (
                    <div className="h-full flex flex-col items-center justify-center text-[#8b949e]">
                       <MessageSquare size={40} className="mb-4 opacity-20" />
                       <div className="text-sm font-bold">Awaiting Commander Prompt</div>
                       <div className="text-xs max-w-sm text-center mt-2 opacity-70">Initiate the pipeline to watch local offline AI agents organize, discuss, and execute massive complex workflows together.</div>
                    </div>
                 )}

                 {interAgentChat.map((msg, i) => (
                    <div key={i} className="flex flex-col animate-[fadeIn_0.3s_ease-out]">
                       {msg.agentName === 'SYSTEM' ? (
                          <div className="flex items-center justify-center my-3 relative">
                             <div className="absolute w-full h-[1px] bg-[#30363d]"></div>
                             <div className="bg-[#111823] px-3 z-10 text-[10px] text-[#8b949e] font-mono tracking-widest uppercase border border-[#30363d] rounded-full">{msg.content}</div>
                          </div>
                       ) : (
                          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 max-w-[90%] shadow-sm self-start group hover:border-[#8b949e] transition-colors relative">
                             <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: msg.color, color: msg.color }}></div>
                                <span className="font-bold text-[12px] text-white tracking-wide">{msg.agentName}</span>
                                <span className="text-[10px] bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d] text-[#8b949e]">{msg.role}</span>
                                <span className="text-[9px] text-[#484f58] ml-auto font-mono">{msg.timestamp}</span>
                             </div>
                             <div className="text-[13px] text-[#c9d1d9] pl-4 leading-relaxed font-[Inter,sans-serif]">{msg.content}</div>
                          </div>
                       )}
                    </div>
                 ))}
                 <div ref={chatEndRef} />
              </div>

              {/* Status bar bottom of chat */}
              <div className="h-8 bg-[#0d1117] border-t border-[#30363d] flex items-center px-4 justify-between text-[10px] text-[#8b949e] font-mono shrink-0">
                 <div className="flex items-center gap-4">
                    <span>Active Model: {stages[activeStage]?.agents.length || 0} Agents Live</span>
                    <span>Context Win: 1M Tokens (RAG)</span>
                 </div>
                 <span>P2P Memory Pool: Synchronized</span>
              </div>
           </div>

           {/* System Terminal Box */}
           <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg flex flex-col overflow-hidden">
              <div className="h-8 bg-[#0d1117] border-b border-[#30363d] flex items-center px-3 gap-2">
                 <Server size={14} className="text-[#8b949e]"/>
                 <span className="text-[10px] font-bold text-[#8b949e] uppercase">Heavy Compute Background Terminal</span>
              </div>
              <div className="flex-1 p-3 overflow-y-auto custom-scrollbar bg-[#0d1117] text-[10px] font-mono text-[#c9d1d9] flex flex-col gap-1 tracking-wider leading-relaxed">
                 {logs.map((log, i) => (
                    <div key={i} className={`
                       ${log.includes('SYSTEM') ? 'text-[#8b949e]' : ''}
                       ${log.includes('successfully') || log.includes('PERFECTLY') ? 'text-[#3fb950] font-bold' : ''}
                    `}>
                       {log}
                    </div>
                 ))}
                 {pipelineState === 'running' && (
                    <div className="animate-pulse text-[#e3b341] opacity-70">$&gt; Waiting on core cluster response...</div>
                 )}
              </div>
           </div>

        </div>

      </div>
    </div>
  )
}


