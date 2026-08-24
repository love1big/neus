import React, { useState, useMemo } from 'react';
import {
  Brain,
  Cpu,
  Bot,
  Zap,
  Activity,
  Layers,
  Search,
  Check,
  Copy,
  ChevronRight,
  Shield,
  Sparkles,
  Network,
  Database,
  Sliders,
  Terminal,
  Volume2,
  Eye,
  Play,
  Pause,
  HardDrive,
  Flame,
  Radio,
  FileCode,
  Gauge
} from 'lucide-react';

export default function OfflineAIEngineSuite() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedToolId, setSelectedToolId] = useState<string>('gguf_quantizer');
  const [copied, setCopied] = useState<boolean>(false);
  const [isNPUActive, setIsNPUActive] = useState<boolean>(true);

  const categories = [
    { id: 'offline_llm', name: '🤖 Local LLM & GGUF Tensors', count: 12 },
    { id: 'edge_vision', name: '👁️ Offline Vision & Neural 3D', count: 10 },
    { id: 'game_ai_heuristics', name: '🧠 Game AI, GOAP & MCTS', count: 10 },
    { id: 'offline_audio_voice', name: '🎙️ Offline Speech & Audio AI', count: 8 },
    { id: 'vector_embeddings', name: '📚 Local Vector RAG & Search', count: 10 }
  ];

  // 50 Professional Offline AI Tools
  const offlineAiTools = [
    // 1. Local LLM & GGUF Tensors (12 tools)
    {
      id: 'gguf_quantizer',
      category: 'offline_llm',
      name: 'On-Device GGUF Quantization Engine',
      tag: 'K-Quants Matrix',
      desc: 'แปลงโมเดล LLM ให้เป็นฟอร์แมต Q4_K_M, Q5_K_S, Q8_0 รันบน RAM ต่ำโดยตรงผ่าน llama.cpp / WASM',
      specs: 'Supported Quants: Q4_K_M (4.5 bpw), Q5_K_S (5.5 bpw), Q8_0 (8.5 bpw) | Perplexity Loss: <0.08',
      inputs: ['Raw FP16 Model Weights (14.2 GB)', 'Calibration Dataset (WikiText-2, 512 chunks)'],
      output: 'Quantized GGUF File: 4.12 GB (71% RAM Saved) | Generation Speed: 42 tokens/sec'
    },
    {
      id: 'kv_cache_allocator',
      category: 'offline_llm',
      name: 'PagedAttention KV-Cache Memory Pool',
      tag: 'Zero OOM',
      desc: 'จัดสรรพื้นที่ Key-Value Cache ของโมเดลภาษาแบบแบ่งเพจ (Paged Virtual Memory) ป้องกัน Out-Of-Memory',
      specs: 'Page Size: 16 tokens | Block Table Lookup: O(1) | Context Window: 32,768 tokens',
      inputs: ['Batch Size: 4 Sequences', 'Context Length: 8,192 tokens per stream'],
      output: 'VRAM Usage: 1.48 GB (vs 4.8 GB Unpaged) | 0% Memory Fragmentation'
    },
    {
      id: 'flash_attention_webgpu',
      category: 'offline_llm',
      name: 'WebGPU FlashAttention-2 Kernel',
      tag: 'GPU Accelerated',
      desc: 'ประมวลผล Self-Attention Matrix แบบ Tiled SRAM IO-Aware ไม่ต้องพัก Tensor ขนาดใหญ่ใน Global Memory',
      specs: 'Tile Size: 64x64 | Precision: FP16 / BF16 | Speedup: 3.8x over Standard Attention',
      inputs: ['Sequence Length: 4,096', 'Num Heads: 32', 'Head Dim: 128'],
      output: 'Kernel Latency: 1.84ms | Memory Read/Write Reduced by 82%'
    },
    {
      id: 'bpe_offline_tokenizer',
      category: 'offline_llm',
      name: 'Offline Byte-Pair Encoding (BPE) Tokenizer',
      tag: 'Local Vocab',
      desc: 'ตัดคำและแปลงข้อความเป็น Token ID ออฟไลน์ 100% พร้อมรองรับพจนานุกรมภาษาไทยและสัญลักษณ์โค้ด',
      specs: 'Vocab Size: 128,000 tokens | Encode Speed: 2,400,000 words/sec | Zero Cloud API',
      inputs: ['Raw Multilingual String (Thai + C++ Code snippet)'],
      output: 'Generated 42 Token IDs in 0.012ms | Character-to-Token Ratio: 3.4:1'
    },
    {
      id: 'speculative_decoding',
      category: 'offline_llm',
      name: 'Speculative Decoding Dual-Model Engine',
      tag: 'Fast Inference',
      desc: 'เร่งความเร็วการตอบกลับของ LLM 3 เท่า ด้วยการใช้โมเดลจิ๋ว (Draft Model 0.5B) คาดเดาคำล่วงหน้าแล้วให้โมเดลใหญ่ (7B) ตรวจสอบ',
      specs: 'Acceptance Rate: 78.4% | Draft Model: Gemma-2B-Q4 | Target Model: LLaMA3-8B-Q4',
      inputs: ['Prompt: "Write a high-performance C++ AABB collision check"'],
      output: 'Output: 94 tokens/sec (Speedup: 2.85x vs Single Model Inference)'
    },
    {
      id: 'grammar_constrained_sampling',
      category: 'offline_llm',
      name: 'BNF Grammar-Constrained JSON Sampler',
      tag: 'Guaranteed Schema',
      desc: 'บังคับให้โมเดลตอบกลับเฉพาะรูปแบบ JSON ที่ถูกต้อง 100% ตาม Backus-Naur Form (BNF) Grammar Masking',
      specs: 'Zero Parsing Syntax Errors | Token Masking Latency: <0.005ms',
      inputs: ['Target JSON Schema: { "name": string, "hp": int, "skills": string[] }'],
      output: '100% Valid Strict JSON Emitted without Retries or Hallucinations'
    },
    {
      id: 'lora_runtime_adapter',
      category: 'offline_llm',
      name: 'Dynamic Multi-LoRA Hot-Swapping Adapter',
      tag: 'Instant Specialization',
      desc: 'สลับโมเดลความเชี่ยวชาญเฉพาะทาง (Coding, Story Lore, Shader Math) ทันทีในหน่วยความจำโดยไม่ต้องโหลดโมเดลใหม่',
      specs: 'LoRA Rank: r=16, alpha=32 | Adapter Size: 18 MB | Hot-Swap Time: 0.4ms',
      inputs: ['Base Model: Mistral-7B', 'Active LoRA: "Unreal_Engine_Cplusplus_Expert"'],
      output: 'LoRA Weights Blended in 0.4ms | Zero VRAM Overhead'
    },
    {
      id: 'attention_head_visualizer',
      category: 'offline_llm',
      name: 'Attention Head Activation Matrix & Heatmap',
      tag: 'Model X-Ray',
      desc: 'ส่องดูการเชื่อมโยงความสัมพันธ์ของคำและโครงสร้างไวยากรณ์ผ่าน 32 Attention Heads',
      specs: 'Interactive Matrix View | Cross-Attention Heatmap | Entropy Scoring',
      inputs: ['Query Token: "PlayerTransform"', 'Key Matrix: Layer 18 / Head 7'],
      output: 'High Attention Weight (0.89) to "RigidBodyComponent.Position"'
    },
    {
      id: 'offline_system_prompt_compiler',
      category: 'offline_llm',
      name: 'System Prompt Template Variable Compiler',
      tag: 'Prompt Optimizer',
      desc: 'คอมไพล์ System Prompts และ Context Window แบบล่วงหน้า (Pre-tokenized KV-State)',
      specs: 'Zero Cold Start | Cached Token Prefix: 1,400 tokens',
      inputs: ['Role Definition: "Senior Gameplay Systems Architect"'],
      output: 'Prefix State Loaded in 0.00ms (100% Cache Hit)'
    },
    {
      id: 'rope_rotary_extender',
      category: 'offline_llm',
      name: 'RoPE Rotary Position Context Extender (YaRN)',
      tag: 'Long Context',
      desc: 'ขยายความยาวการจดจำบริบทของโมเดลจาก 8k สู่ 64k tokens ด้วย YaRN Frequency Interpolation',
      specs: 'Scale Factor: 8x | Base Frequency: 500,000 | Attention Softcapping: Active',
      inputs: ['Original Context: 8,192 tokens', 'Target Context: 65,536 tokens'],
      output: 'Perplexity Maintained Across 64k Tokens with 0 Degradation'
    },
    {
      id: 'temperature_top_p_sampler',
      category: 'offline_llm',
      name: 'Mirostat v2 Dynamic Entropy Adaptive Sampler',
      tag: 'Creative Balancing',
      desc: 'ปรับสมดุลความสุ่มของคำแบบไดนามิก ป้องกันการตอบซ้ำซากและลดการหลุดกรอบเนื้อหา',
      specs: 'Target Entropy (tau): 5.0 | Learning Rate: 0.1 | Perplexity Guard: Active',
      inputs: ['Temperature: 0.7', 'Top-P: 0.9', 'Mirostat: Mode 2'],
      output: 'High-Coherence Narrative Generation Maintained'
    },
    {
      id: 'onnx_runtime_web_engine',
      category: 'offline_llm',
      name: 'ONNX Runtime WebGPU Tensor Dispatcher',
      tag: 'Cross-Platform ML',
      desc: 'รันโมเดล Deep Learning ข้ามแพลตฟอร์มด้วย ONNX Runtime เชื่อมต่อการคำนวณเข้ากับ WebGPU และ WebAssembly',
      specs: 'Backend: WebGPU (DirectX12 / Vulkan / Metal) | FP16 Math Enabled',
      inputs: ['ONNX Model: bert-tiny-quantized.onnx (17.5 MB)'],
      output: 'Tensor Inference: 1.2ms per batch'
    },

    // 2. Offline Vision & Neural 3D (10 tools)
    {
      id: 'depth_estimation_monocular',
      category: 'edge_vision',
      name: 'MiDaS v3.1 Monocular Depth Estimation',
      tag: 'Offline 3D Map',
      desc: 'แปลงภาพถ่าย 2D ธรรมดาให้กลายเป็น 3D Depth Map และ Point Cloud แบบออฟไลน์',
      specs: 'Input: 512x512 RGB | Resolution: 16-bit Grayscale Depth | Speed: 30 FPS',
      inputs: ['2D Texture: Medieval_Wall_Diffuse.png'],
      output: 'Generated 16-bit Height & Displacement Map in 28ms'
    },
    {
      id: 'neural_super_resolution',
      category: 'edge_vision',
      name: 'ESRGAN 4x Neural Texture Upscaler',
      tag: 'Texture AI',
      desc: 'เพิ่มความละเอียดของ Texture 512x512 เป็น 2048x2048 (4K Detail) พร้อมฟื้นฟูเส้นใยผ้าและเนื้อไม้',
      specs: 'Residual-in-Residual Dense Block (RRDB) | Tile Overlap: 32px to avoid seam artifacts',
      inputs: ['Low-Res Asset: icon_shield.png (256x256)'],
      output: 'High-Res Asset: 1024x1024 (Sharp Edges, No Blurry Artifacts, 42ms)'
    },
    {
      id: 'yolo_edge_object_detector',
      category: 'edge_vision',
      name: 'YOLOv10-Nano Real-time Object Tracker',
      tag: 'Edge Vision',
      desc: 'ตรวจจับตัวละคร ยานพาหนะ และสิ่งกีดขวางจากกล้องหรือภาพมุมมองในเกมด้วยความเร็ว 120 FPS',
      specs: 'Model Size: 4.8 MB | Confidence Threshold: 0.65 | NMS IoU: 0.45',
      inputs: ['Scene Frame: 1920x1080 Viewport Buffer'],
      output: 'Detected: 8 Enemies, 2 Vehicles, 1 Loot Chest in 6.4ms'
    },
    {
      id: 'pose_landmark_tracker',
      category: 'edge_vision',
      name: 'BlazePose 33-Keypoint 3D Rig Tracker',
      tag: 'Offline MoCap',
      desc: 'จับการเคลื่อนไหวของมนุษย์จากกล้องเว็บแคมธรรมดาแล้วแปลงเป็น 3D Skeletal Rig Rotation ทันที',
      specs: '33 Full-Body 3D Landmarks | World Coordinates in Meters | Z-Depth Inferred',
      inputs: ['Video Stream: 60 FPS RGB Camera'],
      output: 'Mapped to Mixamo Skeleton: 33 Bones Rotated at 60 FPS'
    },
    {
      id: 'segment_anything_fast',
      category: 'edge_vision',
      name: 'MobileSAM Zero-Shot Mask Segmenter',
      tag: 'Texture Masking',
      desc: 'คลิกตัดแบ่งวัตถุใน Texture หรือ Concept Art เพื่อแยก Layer ผิว ลวดลาย หรือเงาอัตโนมัติ',
      specs: 'Single-Point Prompting | Real-time Mask Generation: 14ms',
      inputs: ['Click Coordinate: (240, 185) on Knight Armor'],
      output: 'Extracted Metal Chestplate Alpha Mask (99.4% Edge Accuracy)'
    },
    {
      id: 'neural_radiance_fields_nerf',
      category: 'edge_vision',
      name: 'Instant-NGP Neural Radiance Field (NeRF)',
      tag: 'Photogrammetry AI',
      desc: 'สร้างโมเดล 3 มิติพร้อมแสงสะท้อนเสมือนจริงจากภาพถ่ายหลายมุมด้วย Multi-Resolution Hash Encoding',
      specs: 'Hash Grid Resolution: 16 levels | Ray Marching Step: 1024 steps',
      inputs: ['32 Photos of Ancient Statue'],
      output: '3D NeRF Density & Radiance Field Trained in 4.2 seconds'
    },
    {
      id: 'normal_map_synthesizer',
      category: 'edge_vision',
      name: 'Neural Tangent-Space Normal Predictor',
      tag: 'PBR Synthesis',
      desc: 'ทำนาย Normal Map คุณภาพสูงพร้อมขจัดแสงเงาตกกระทบเดิม (Delighting) จากภาพถ่ายออฟไลน์',
      specs: 'Sobel Filter Blend + UNet Feature Extractor | 100% Seamless Tiling Option',
      inputs: ['Albedo Texture: Brick_Wall.jpg'],
      output: 'Generated Tangent Normal (OpenGL/DirectX inverted Y supported)'
    },
    {
      id: 'occlusion_culling_neural',
      category: 'edge_vision',
      name: 'Neural Visibility & Early-Z Occlusion Culler',
      tag: 'Render Boost',
      desc: 'ทำนายวัตถุที่ถูกบดบังในฉาก 3 มิติเพื่อข้ามขั้นตอนการเรนเดอร์ เพิ่มเฟรมเรตอย่างมหาศาล',
      specs: 'Inference Cost: 0.2ms | Conservative Culling (Zero Visual Popping)',
      inputs: ['Frustum Objects: 14,000 Mesh Draw Calls'],
      output: 'Culled 11,200 Hidden Objects (Saved 80% Draw Calls)'
    },
    {
      id: 'image_palette_clustering',
      category: 'edge_vision',
      name: 'K-Means Color Palette Vector Extractor',
      tag: 'Color Harmony',
      desc: 'สกัดโทนสีหลัก (Dominant Palettes) และ Mood & Tone ของภาพคอนเซปต์อาร์ต 32 สี',
      specs: 'Color Space: CIELAB (Perceptually Uniform) | Iterations: 20',
      inputs: ['Concept Art: Cyberpunk_City_Sunset.png'],
      output: 'Extracted 5 Dominant Lighting Colors + Color Grading LUT'
    },
    {
      id: 'hand_gesture_controller',
      category: 'edge_vision',
      name: 'MediaPipe 21-Joint Hand Gesture Controller',
      tag: 'VR/AR Input',
      desc: 'ตรวจจับท่าทางมือ (Pinch, Grab, Point, Thumbs-up) สำหรับควบคุมเกม VR โดยไม่ต้องใช้ Controller',
      specs: '21 3D Hand Joints | Gesture Classification Latency: 4ms',
      inputs: ['Hand Frame: Left & Right Hands in Camera Frustum'],
      output: 'Action Triggered: "Pinch & Drag 3D Gizmo"'
    },

    // 3. Game AI, GOAP & MCTS (10 tools)
    {
      id: 'goap_action_planner',
      category: 'game_ai_heuristics',
      name: 'Goal-Oriented Action Planning (GOAP) Solver',
      tag: 'Smart NPC',
      desc: 'ระบบวางแผนการตัดสินใจของ NPC ตามเป้าหมาย (เช่น หาที่หลบ -> เติมกระสุน -> โจมตีกลับ) ด้วย A* Graph Search',
      specs: 'World State Bitmask | Action Cost Optimization | Dynamic Replanning',
      inputs: ['Current State: { Ammo: 0, InCover: false, Health: 35% }', 'Goal: { EnemyDead: true }'],
      output: 'Plan: [TakeCover -> ReloadWeapon -> FlankEnemy -> Shoot]'
    },
    {
      id: 'mcts_strategy_engine',
      category: 'game_ai_heuristics',
      name: 'Monte Carlo Tree Search (MCTS) Strategy AI',
      tag: 'Board & RTS AI',
      desc: 'อัลกอริทึมจำลองการเล่นล่วงหน้านับแสนตา (Selection, Expansion, Simulation, Backpropagation) สำหรับบอทเกมวางแผน',
      specs: 'UCT Exploration Parameter (c): 1.414 | Rollout Depth: 64 steps | Multithreaded',
      inputs: ['Game Board State: 4X Strategy Territory Map', 'Simulations: 50,000 rollouts'],
      output: 'Optimal Move: "Fortify Sector Delta" (Win Probability: 84.2%)'
    },
    {
      id: 'behavior_tree_evaluator',
      category: 'game_ai_heuristics',
      name: 'Composite & Decorator Behavior Tree Runner',
      tag: 'Behavior Logic',
      desc: 'ตัวประมวลผลต้นไม้พฤติกรรม (Sequencer, Selector, Parallel, Decorator) ระดับเสี้ยววินาที',
      specs: 'Tick Rate: 60 Hz | Memory Footprint: 2 KB per Agent | 10,000 Agents Supported',
      inputs: ['Blackboard Data: { TargetDistance: 4.2m, ThreatLevel: HIGH }'],
      output: 'Running Node: "Execute Melee Combo #2" (Status: RUNNING)'
    },
    {
      id: 'hierarchical_task_network',
      category: 'game_ai_heuristics',
      name: 'Hierarchical Task Network (HTN) Planner',
      tag: 'Complex Tactics',
      desc: 'แยกย่อยภารกิจระดับสูง (เช่น สั่งกองทัพบุกเมือง) ให้กลายเป็นคำสั่งย่อยระดับบุคคลอย่างเป็นระบบ',
      specs: 'Compound Tasks Decomposer | Domain Axiom Evaluator',
      inputs: ['High-level Task: "Raid Enemy Fortress"'],
      output: 'Decomposed to 4 Squad Sub-tasks (Infiltrate, Disable Power, Extract)'
    },
    {
      id: 'neural_navmesh_cost_field',
      category: 'game_ai_heuristics',
      name: 'Influence Map & Dynamic Cost Field NavMesh',
      tag: 'Tactical Navigation',
      desc: 'คำนวณเส้นทางเดินของ AI โดยหลีกเลี่ยงพื้นที่เสี่ยงภัยกระสุน ดงระเบิด และแนวสายตาของศัตรู',
      specs: 'Spatial Diffusion Decay: 0.95 | Threat Vector Field: 128x128 Grid',
      inputs: ['Threat Origin: Sniper Nest at (45, 12, 80)'],
      output: 'NavMesh Cost Repulsion Applied (AI chooses shadowed alleyway)'
    },
    {
      id: 'fuzzy_logic_aggression',
      category: 'game_ai_heuristics',
      name: 'Mamdani Fuzzy Logic Boss Emotion Engine',
      tag: 'Dynamic Emotion',
      desc: 'ประเมินอารมณ์ความโกรธ ความกลัว และความก้าวร้าวของบอสเกมด้วย Fuzzy Sets (Low, Medium, High)',
      specs: 'Fuzzification -> Rule Base -> Defuzzification (Centroid Method)',
      inputs: ['Boss Health: 22% (LOW)', 'Player Combo Count: 14 (HIGH)'],
      output: 'Aggression Level: 92.4% -> Trigger Phase 3 Berserk Rage'
    },
    {
      id: 'flocking_boids_simd',
      category: 'game_ai_heuristics',
      name: 'Reynolds Flocking Boids (100k Agents)',
      tag: 'Crowd AI',
      desc: 'จำลองฝูงนก ฝูงปลา และกองทัพมอนสเตอร์นับแสนตัวด้วยกฎ 3 ข้อ: Separation, Alignment, Cohesion',
      specs: '100,000 Boids at 60 FPS | SIMD Spatial Grid Partitioning',
      inputs: ['Neighbor Radius: 3.5m', 'Obstacle Avoidance Weight: 2.5'],
      output: 'Cohesive Fluid Swarm Behavior with Zero Collisions'
    },
    {
      id: 'dynamic_difficulty_adjustment',
      category: 'game_ai_heuristics',
      name: 'Dynamic Difficulty Adjustment (DDA) Tracker',
      tag: 'Flow State AI',
      desc: 'ปรับความยากของเกม (ความแม่นยำศัตรู อัตราดรอปยา) อัตโนมัติตามทักษะของผู้เล่นเพื่อรักษา Flow State',
      specs: 'Skill Rating (Glicko-2) | Frustration & Boredom Detection Metric',
      inputs: ['Player Deaths in Last 5 mins: 3', 'Reaction Time: 280ms'],
      output: 'Difficulty Eased by 12% (Enemy Reaction Delay +150ms)'
    },
    {
      id: 'procedural_quest_generator',
      category: 'game_ai_heuristics',
      name: 'Grammar-Based Procedural Quest Graph',
      tag: 'Endless Quests',
      desc: 'สร้างเควสต์เนื้อเรื่องแบบสุ่มที่มีเหตุผลและแรงจูงใจสมจริงด้วย Context-Free Story Grammars',
      specs: 'Narrative Arcs: Setup -> Conflict -> Climax -> Resolution',
      inputs: ['Faction: Thieves Guild', 'Location: Sunken Temple'],
      output: 'Generated: "The Stolen Amulet of Nephthys" (3 Multi-Stage Objectives)'
    },
    {
      id: 'utility_ai_evaluator',
      category: 'game_ai_heuristics',
      name: 'Infinite Axis Utility System (IAUS)',
      tag: 'Utility AI',
      desc: 'ให้คะแนนการกระทำทุกอย่างของ AI ด้วยเส้นโค้ง Response Curves (Logistic, Linear, Exponential)',
      specs: 'Top Action Selection | Weight Normalization (0.0 - 1.0)',
      inputs: ['Candidate Actions: [EatFood: 0.42, Attack: 0.88, RunAway: 0.12]'],
      output: 'Selected Action: Attack (Utility Score: 0.88)'
    },

    // 4. Offline Speech & Audio AI (8 tools)
    {
      id: 'whisper_offline_transcriber',
      category: 'offline_audio_voice',
      name: 'Whisper.cpp Tiny/Base Offline Speech-to-Text',
      tag: 'Offline STT',
      desc: 'แปลงเสียงพูดผู้เล่นเป็นข้อความคำสั่งเกมออฟไลน์ 100% ปราศจากค่า API คลาวด์',
      specs: 'Model Size: 75 MB (Quantized) | Latency: 180ms | 99+ Languages Supported',
      inputs: ['Audio Chunk: 16kHz PCM (Voice Command: "Cast Fireball!")'],
      output: 'Transcribed Text: "Cast Fireball!" (Confidence: 98.7%)'
    },
    {
      id: 'piper_offline_tts',
      category: 'offline_audio_voice',
      name: 'Piper Fast Neural Text-to-Speech',
      tag: 'Offline TTS',
      desc: 'ออกเสียงบทพูด NPC ภาษาไทยและอังกฤษด้วยเสียงมนุษย์สมจริงที่สังเคราะห์แบบเรียลไทม์บนเครื่อง',
      specs: 'Real-time Factor (RTF): 0.15 (Generates 1s audio in 150ms) | VITS Architecture',
      inputs: ['Text: "ยินดีต้อนรับสู่นครแห่งแสงสว่าง ท่านผู้กล้า"'],
      output: 'Generated 24kHz High-Fidelity Audio Waveform in 0.22s'
    },
    {
      id: 'viseme_lipsync_synthesizer',
      category: 'offline_audio_voice',
      name: 'Acoustic Phoneme-to-Viseme LipSync Engine',
      tag: 'Auto LipSync',
      desc: 'วิเคราะห์คลื่นเสียงพูดแล้วแปลงเป็น BlendShape หน้าตา (A, E, I, O, U, M, B, P) สำหรับขยับปากโมเดล 3D',
      specs: '16 Standard ARKit Mouth Visemes | Latency: 12ms | Zero Animation Keyframing Needed',
      inputs: ['Audio Stream: NPC_Dialogue_Voiceline.wav'],
      output: 'Calculated 16 Weight Curves: [jawOpen: 0.75, mouthPucker: 0.20]'
    },
    {
      id: 'formant_pitch_tracker',
      category: 'offline_audio_voice',
      name: 'YIN Algorithm Fundamental Pitch & Formant Tracker',
      tag: 'Voice Analysis',
      desc: 'ตรวจจับระดับเสียงสูง-ต่ำ (Pitch F0) และ Formants สำหรับระบบไมโครโฟนร้องเพลงคาราโอเกะในเกม',
      specs: 'Frequency Range: 40 Hz - 2,000 Hz | Precision: ±0.5 Cents | Latency: 5ms',
      inputs: ['Microphone Input: Singing Voice'],
      output: 'Detected Note: C4 (261.63 Hz) | Cent Offset: +2.1 cents'
    },
    {
      id: 'neural_audio_denoiser',
      category: 'offline_audio_voice',
      name: 'RNNoise Deep Neural Microphone Denoiser',
      tag: 'Clean Voice Chat',
      desc: 'ตัดเสียงพัดลม เสียงพิมพ์คีย์บอร์ด และเสียงรบกวนรอบข้างใน Voice Chat ด้วย Recurrent Neural Network',
      specs: 'Model Footprint: 85 KB | CPU Usage: 0.3% | Zero Speech Muffling',
      inputs: ['Noisy Mic Stream: Voice + Mechanical Keyboard Clicks'],
      output: 'Clean Isolated Voice Stream (SNR Improved by +24 dB)'
    },
    {
      id: 'voice_changer_dsp_vocoder',
      category: 'offline_audio_voice',
      name: 'Phase Vocoder Real-time Voice Transformer',
      tag: 'Voice Changer',
      desc: 'แปลงเสียงพูดของผู้เล่นให้กลายเป็นเสียงหุ่นยนต์ ไซบอร์ก มังกร หรือปีศาจแบบเรียลไทม์',
      specs: 'Formant Preserved Pitch Shift | Ring Modulation & Robotize Filter',
      inputs: ['Preset: "Ancient Cyber Dragon" | Pitch Shift: -8 Semitones'],
      output: 'Metallic Resonant Monster Voice Emitted with 0 Delay'
    },
    {
      id: 'foley_sound_event_detector',
      category: 'offline_audio_voice',
      name: 'CNN Audio Classification Event Detector',
      tag: 'Sound Intelligence',
      desc: 'จำแนกประเภทเสียงในเกม (เสียงปืน เสียงระเบิด เสียงฝีเท้า) เพื่อส่งข้อมูลให้ AI ฝ่ายศัตรูตอบสนอง',
      specs: '521 Audio Event Classes (AudioSet) | Inference: 3.2ms',
      inputs: ['Audio Snapshot: Distant Gunshot Echo'],
      output: 'Classified: "Sniper Rifle Shot" (Prob: 0.94) -> Alerting nearby patrols'
    },
    {
      id: 'beat_tempo_onset_detector',
      category: 'offline_audio_voice',
      name: 'Spectral Flux Rhythm & BPM Beat Tracker',
      tag: 'Rhythm Game',
      desc: 'ตรวจจับจังหวะกลอง (Beat Drop) และค่า BPM ของเพลงอัตโนมัติสำหรับสร้างโน้ตเกมดนตรี',
      specs: 'Onset Detection Function: Complex Domain | BPM Range: 60 - 240',
      inputs: ['Background Track: Synthwave_Boss_Theme.mp3'],
      output: 'Detected BPM: 142.0 | Next Downbeat Timestamp: 14.82s'
    },

    // 5. Local Vector RAG & Search (10 tools)
    {
      id: 'vector_hnsw_indexer',
      category: 'vector_embeddings',
      name: 'Hierarchical Navigable Small World (HNSW) Indexer',
      tag: 'Local Vector DB',
      desc: 'ค้นหาเวกเตอร์ความคล้ายคลึงนับแสนรายการในเวลาเสี้ยววินาทีด้วย HNSW Graph Indexing บนเครื่อง 100%',
      specs: 'Vector Dim: 384 / 768 / 1536 | Metric: Cosine / L2 Distance | Search Time: 0.15ms',
      inputs: ['Query: "How to implement Octree LoD for Terrain?"', 'Indexed Chunks: 50,000 Documents'],
      output: 'Top 3 Relevant Code Chunks Retrieved in 0.18ms'
    },
    {
      id: 'mini_lm_embedder',
      category: 'offline_llm',
      name: 'All-MiniLM-L6-v2 Offline Sentence Embedder',
      tag: 'Local Embedding',
      desc: 'แปลงข้อความและเอกสารให้กลายเป็นเวกเตอร์ 384 มิติบนเครื่องโดยไม่ต้องต่อเน็ต',
      specs: 'Model Size: 45 MB | Embedding Dim: 384 | Speed: 1,500 sentences/sec on WebGPU',
      inputs: ['Text: "Entity Component System architecture in Rust"'],
      output: 'Normalized Vector: [0.042, -0.119, 0.842, ... 384 floats]'
    },
    {
      id: 'bm25_lexical_search',
      category: 'vector_embeddings',
      name: 'BM25 Okapi High-Performance Lexical Search',
      tag: 'Hybrid Search',
      desc: 'ค้นหาข้อความแบบ Exact Match & Keyword Relevance ด้วยสมการ BM25 เสริมความแม่นยำของ RAG',
      specs: 'Parameters: k1=1.5, b=0.75 | Inverted Index: Compressed Bitmaps',
      inputs: ['Keywords: "Vulkan Pipeline Barrier Layout Transition"'],
      output: 'Ranked 14 exact code matches from SDK documentation'
    },
    {
      id: 'semantic_chunking_engine',
      category: 'vector_embeddings',
      name: 'Semantic Boundary Markdown & Code Chunker',
      tag: 'RAG Preprocessor',
      desc: 'ตัดแบ่งเอกสารคู่มือและโค้ดตามขอบเขตฟังก์ชัน Class และหัวข้อ ไม่ให้ข้อมูลสำคัญถูกตัดครึ่ง',
      specs: 'AST-Aware Code Splitting | Overlap: 50 tokens | Markdown Header Hierarchy',
      inputs: ['Raw File: GameEngineArchitecture.md (450 KB)'],
      output: 'Created 84 Context-Preserved Semantic Chunks'
    },
    {
      id: 'reranker_cross_encoder',
      category: 'vector_embeddings',
      name: 'Mini-Cross-Encoder Neural Document Re-Ranker',
      tag: 'RAG Precision',
      desc: 'จัดอันดับเอกสารที่ค้นหาได้ใหม่อีกรอบด้วยโมเดล Cross-Encoder เพิ่มความแม่นยำคำตอบของ AI สู่ 98%',
      specs: 'Inference Time: 4.8ms for Top 10 Documents | Score Range: 0.0 - 1.0',
      inputs: ['Query + Top 10 Candidate Chunks'],
      output: 'Re-ordered Candidates: Chunk #7 Promoted to Rank #1 (Relevance: 0.96)'
    },
    {
      id: 'sqlite_vec_native_db',
      category: 'vector_embeddings',
      name: 'SQLite-vec Native Vector Database Extension',
      tag: 'Embedded Vector DB',
      desc: 'จัดเก็บและค้นหาเวกเตอร์พร้อมตารางข้อมูล SQL ปกติในไฟล์ฐานข้อมูลเดียวแบบ Zero Setup',
      specs: 'Simd-Accelerated Distance Functions | ACID Vector Transactions',
      inputs: ['SQL: SELECT chunk_text FROM docs WHERE vec_search(embedding, :query_vec, 5)'],
      output: '5 Rows Returned in 0.32ms'
    },
    {
      id: 'kd_tree_spatial_vector',
      category: 'vector_embeddings',
      name: 'K-Dimensional (KD-Tree) Nearest Neighbor Finder',
      tag: 'Fast Partition',
      desc: 'โครงสร้างต้นไม้แบ่งพื้นที่หลายมิติสำหรับค้นหาสีที่ใกล้เคียง จุดพิกัด 3D และเวกเตอร์มิติต่ำ',
      specs: 'Balanced Binary Space Partitioning | Search Complexity: O(log N)',
      inputs: ['Point Queries in 16-Dimensional Feature Space'],
      output: 'Nearest 5 Nodes Found in 0.008ms'
    },
    {
      id: 'document_summary_offline',
      category: 'vector_embeddings',
      name: 'TextRank Graph-Based Extractive Summarizer',
      tag: 'Fast Summary',
      desc: 'สรุปประเด็นสำคัญของบทความและข้อความยาวด้วยกราฟความเชื่อมโยงของประโยค (PageRank algorithm)',
      specs: 'Zero Model Weights Required | Execution Time: 2.1ms for 10-page doc',
      inputs: ['Long Log File: 5,000 Lines of Engine Crash Dumps'],
      output: 'Extracted Top 3 Critical Error Sentences'
    },
    {
      id: 'metadata_hybrid_filter',
      category: 'vector_embeddings',
      name: 'Boolean Metadata Filter & Vector Fusion',
      tag: 'Filtered RAG',
      desc: 'กรองข้อมูลด้วยเงื่อนไขทางตรรกะ (เช่น ปีที่สร้าง, ผู้เขียน, แท็ก) ควบคู่กับการค้นหาเวกเตอร์',
      specs: 'Pre-Filtering & Post-Filtering Support | Bitset Intersection',
      inputs: ['Filter: category == "Shaders" AND rating >= 4.5'],
      output: 'Reduced Search Space from 50,000 to 420 vectors'
    },
    {
      id: 'knowledge_graph_triplet_extractor',
      category: 'vector_embeddings',
      name: 'Subject-Predicate-Object Knowledge Graph Engine',
      tag: 'Graph RAG',
      desc: 'สร้างกราฟความสัมพันธ์ของตัวละคร ดินแดน และไอเทมในเกม (เช่น [Hero] -> [Wields] -> [Excalibur])',
      specs: 'RDF Triplestore Format | Cypher Graph Query Engine',
      inputs: ['Story Lore Text: "King Arthur drew the sword Excalibur from the stone"'],
      output: 'Graph Nodes Created: (Arthur:Person)-[:WIELDS]->(Excalibur:Weapon)'
    }
  ];

  const filteredTools = useMemo(() => {
    return offlineAiTools.filter((tool) => {
      const matchCat = activeCategory === 'all' || tool.category === activeCategory;
      const matchSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const selectedTool = offlineAiTools.find((t) => t.id === selectedToolId) || offlineAiTools[0];

  const copyToolSpecs = () => {
    const text = `### ${selectedTool.name} [${selectedTool.tag}]
- **Category**: ${selectedTool.category}
- **Description**: ${selectedTool.desc}
- **Technical Specs**: ${selectedTool.specs}
- **Inputs**: ${selectedTool.inputs.join(', ')}
- **Output**: ${selectedTool.output}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full bg-[#0a0a0f] text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#11111b] border-b border-[#2a2b3d] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Brain size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                Offline Edge AI & Neural Intelligence Suite
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-500/30">
                100% ON-DEVICE / ZERO INTERNET REQUIRED (50 TOOLS)
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              ชุดเครื่องมือ AI ออฟไลน์ระดับลึก: Local LLM, WebGPU Shaders, Computer Vision, GOAP/HTN Game AI, และ Vector RAG
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาเครื่องมือ AI ออฟไลน์ 50 ชนิด..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1a1b2e] border border-[#2a2b3d] focus:border-purple-500 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none w-64 font-mono"
            />
          </div>

          <button
            onClick={() => setIsNPUActive(!isNPUActive)}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border transition ${
              isNPUActive
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.2)]'
                : 'bg-[#21262d] text-gray-400 border-[#30363d]'
            }`}
          >
            <Cpu size={12} className={isNPUActive ? 'animate-pulse text-purple-400' : ''} />
            <span>{isNPUActive ? 'WebGPU / NPU: 45.2 TFLOPS' : 'NPU: Standby'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="px-4 py-2 bg-[#0d1117] border-b border-[#21262d] flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 rounded text-xs font-bold transition whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-[#161b22] text-gray-400 hover:text-white'
          }`}
        >
          ทั้งหมด (50 เครื่องมือ)
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded text-xs font-bold transition whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-purple-600 text-white shadow'
                : 'bg-[#161b22] text-gray-400 hover:text-white'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Main Grid & Inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tools List (30-50 Items) */}
        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
          {filteredTools.map((tool) => {
            const isSelected = tool.id === selectedToolId;
            return (
              <div
                key={tool.id}
                onClick={() => setSelectedToolId(tool.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#161b22] border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.15)] ring-1 ring-purple-500'
                    : 'bg-[#11111b] border-[#2a2b3d] hover:bg-[#161b22] hover:border-gray-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-purple-400">
                      {tool.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-500/30">
                      {tool.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2 mb-2 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#2a2b3d] flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span className="truncate max-w-[180px]">{tool.specs}</span>
                  <ChevronRight size={12} className={isSelected ? 'text-purple-400' : 'text-gray-600'} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Inspector & Live Tensor Sandbox */}
        <div className="w-[380px] bg-[#11111b] border-l border-[#2a2b3d] flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2a2b3d]">
            <div>
              <div className="text-xs font-bold text-white">{selectedTool.name}</div>
              <div className="text-[10px] text-purple-400 font-mono mt-0.5">{selectedTool.tag}</div>
            </div>
            <button
              onClick={copyToolSpecs}
              className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-gray-300 text-xs flex items-center gap-1 transition"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>

          {/* Description & Neural Architecture */}
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
              คำอธิบาย & สถาปัตยกรรมโมเดล (Offline Neural Architecture)
            </span>
            <p className="text-xs text-gray-300 leading-relaxed bg-[#0a0a0f] p-2.5 rounded border border-[#2a2b3d]">
              {selectedTool.desc}
            </p>
          </div>

          {/* Specifications */}
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
              พารามิเตอร์เทนเซอร์ (Tensor Specs & Benchmarks)
            </span>
            <div className="text-[11px] font-mono text-purple-300 bg-[#0a0a0f] p-2.5 rounded border border-[#2a2b3d]">
              {selectedTool.specs}
            </div>
          </div>

          {/* Live Tensor Execution Sandbox */}
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
              อินพุตการทดสอบ (On-Device Model Inputs)
            </span>
            <div className="space-y-1.5">
              {selectedTool.inputs.map((inp, idx) => (
                <div key={idx} className="text-[10px] font-mono bg-[#161b22] p-2 rounded border border-[#2a2b3d] text-gray-300 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-purple-900/50 text-purple-300 flex items-center justify-center text-[9px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{inp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Tensor Output */}
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
              ผลลัพธ์การประมวลผล (Local Neural Output)
            </span>
            <div className="text-[11px] font-mono text-emerald-400 bg-[#0a0a0f] p-2.5 rounded border border-emerald-500/30 flex items-start gap-2">
              <Zap size={14} className="text-emerald-400 mt-0.5 shrink-0" />
              <span>{selectedTool.output}</span>
            </div>
          </div>

          {/* Offline Privacy & Zero-Cloud Badge */}
          <div className="p-3 rounded bg-purple-500/10 border border-purple-500/30 text-xs">
            <div className="font-bold text-purple-400 flex items-center gap-1.5 mb-1">
              <Shield size={14} /> 100% Private On-Device Intelligence
            </div>
            <div className="text-[10px] text-gray-400 leading-relaxed">
              ไม่มีการส่งข้อมูลหรือ Key ออกนอกเครื่อง ประมวลผลผ่าน Local WebGPU / WASM SIMD ใน Browser / Standalone Native เสมือนจริง
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
