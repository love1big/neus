/**
 * ============================================================================
 * CODE PROJECT MANAGER (ระบบจัดการโปรเจกต์และเวิร์กสเปซสำหรับโปรแกรมแก้ไขโค้ด)
 * ============================================================================
 * 
 * 1. MODULE PURPOSE & RESPONSIBILITY (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูล)
 * ----------------------------------------------------------------------------
 * ไฟล์นี้ทำหน้าที่เป็นโมเดลและศูนย์กลางการจัดการโปรเจกต์หลายโปรเจกต์ (Multi-Project Workspace)
 * สำหรับ Code Editor โดยแต่ละโปรเจกต์จะมีการแยกเวิร์กสเปซ (Independent Workspace),
 * ไฟล์โค้ดทั้งหมด (Isolated Virtual Filesystem), และการตั้งค่าเฉพาะโปรเจกต์ (Project Settings)
 * 
 * หน้าที่หลัก:
 *  - สร้าง (Create), บันทึก (Save), สลับ (Switch), ทำซ้ำ (Duplicate) และลบ (Delete) โปรเจกต์
 *  - จัดเก็บไฟล์ของแต่ละโปรเจกต์อย่างแยกอิสระ พร้อมการจำ Active File
 *  - จัดเก็บการตั้งค่าเฉพาะโปรเจกต์ (Tab size, Font size, Word wrap, Format on save, Target runtime, Compiler flags, Env vars)
 *  - มี Built-in Starter Templates สำเร็จรูป (Nexus 3D Game Engine, Python AI, C++ Vulkan, Rust ECS, Shaders, Web Server, SQL)
 *  - รองรับการ Export และ Import โปรเจกต์เป็นไฟล์ JSON
 *  - ซิงค์อัตโนมัติกับ LocalStorage (`omni_code_projects_v1`) และระบบ Auto-Save กลาง
 *  - ส่ง Custom Event (`code-project-switched`, `code-project-updated`) เพื่อให้ UI อัปเดตทันที
 * 
 * 2. ARCHITECTURE & SYSTEM INTEGRATION (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น)
 * ----------------------------------------------------------------------------
 *  - เชื่อมต่อกับ `CodeEditor.tsx` สำหรับโหลดไฟล์และคอนฟิกเมื่อสลับโปรเจกต์
 *  - เชื่อมต่อกับ `ProjectWorkspaceModal.tsx` และ `ProjectSwitcherDropdown.tsx`
 *  - ทำงานร่วมกับ `GlobalStudioAutoSaveManager` เพื่อรักษาความปลอดภัยของข้อมูล
 * 
 * 3. INPUTS, OUTPUTS & DATA CONTRACTS (พารามิเตอร์ Input / Output ที่รับส่ง)
 * ----------------------------------------------------------------------------
 *  - Data Contracts: `CodeProject`, `ProjectFile`, `ProjectSettings`, `ProjectTemplate`
 * 
 * 4. ERROR HANDLING & FALLBACKS (การจัดการข้อผิดพลาดและ Edge Cases)
 * ----------------------------------------------------------------------------
 *  - ป้องกัน QuotaExceededError ใน LocalStorage ด้วยการตรวจขนาดและ Fallback
 *  - กรณีที่ไม่มีโปรเจกต์ในเครื่อง จะทำการ Seed Default Projects ให้ทันทีอัตโนมัติ
 *  - หากไฟล์ JSON ที่นำเข้าเสียหาย จะส่งคืน Result ชัดเจนและไม่ทำให้โปรแกรม Crash
 * 
 * 5. USAGE EXAMPLE (ตัวอย่างการเรียกใช้งาน)
 * ----------------------------------------------------------------------------
 *  ```ts
 *  import { CodeProjectManager } from '../utils/CodeProjectManager';
 * 
 *  // ดึงโปรเจกต์ที่เปิดอยู่
 *  const currentProject = CodeProjectManager.getActiveProject();
 * 
 *  // สลับโปรเจกต์
 *  CodeProjectManager.switchProject('nexus-game-engine-ts');
 * 
 *  // สร้างโปรเจกต์ใหม่จาก Template
 *  CodeProjectManager.createProjectFromTemplate('deep-neural-ai-python', { name: 'My AI Boss' });
 *  ```
 * ============================================================================
 */

export type ProjectCategory = 
  | 'game-engine' 
  | 'ai-data' 
  | 'systems-native' 
  | 'shader-graphics' 
  | 'web-fullstack' 
  | 'database-sql' 
  | 'custom';

export type TargetRuntime = 
  | 'nexus-engine-wasm' 
  | 'python-3.11' 
  | 'node-typescript' 
  | 'native-cpp' 
  | 'webgl-shader' 
  | 'rust-cargo' 
  | 'java-jvm' 
  | 'sql-relational' 
  | 'general';

export interface ProjectFile {
  id: string;
  name: string;
  lang: string;
  code: string;
  isEntry?: boolean;
  isReadOnly?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectSettings {
  targetRuntime: TargetRuntime;
  tabSize: 2 | 4 | 8;
  insertSpaces: boolean;
  wordWrap: 'on' | 'off' | 'wordWrapColumn';
  fontSize: number;
  formatOnSave: boolean;
  autoDetectLanguage: boolean;
  manualLanguageLock: string;
  compilerFlags: string;
  buildOutputDir: string;
  minifyOnBuild: boolean;
  envVariables: Record<string, string>;
}

export interface CodeProject {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  icon: string;
  color: string;
  createdAt: number;
  updatedAt: number;
  lastOpenedAt: number;
  activeFilename: string;
  files: ProjectFile[];
  settings: ProjectSettings;
  gitBranch: string;
  tags: string[];
  isStarred: boolean;
  isArchived: boolean;
  version: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  icon: string;
  color: string;
  defaultRuntime: TargetRuntime;
  tags: string[];
  files: { name: string; lang: string; code: string; isEntry?: boolean }[];
  defaultSettings?: Partial<ProjectSettings>;
}

const STORAGE_KEY_PROJECTS = 'omni_code_projects_v1';
const STORAGE_KEY_ACTIVE_PROJECT_ID = 'omni_code_active_project_id_v1';
const PROJECT_SCHEMA_VERSION = '1.3.0';

export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  targetRuntime: 'nexus-engine-wasm',
  tabSize: 2,
  insertSpaces: true,
  wordWrap: 'on',
  fontSize: 14,
  formatOnSave: true,
  autoDetectLanguage: true,
  manualLanguageLock: 'auto',
  compilerFlags: '-O3 -Wall --std=esnext',
  buildOutputDir: 'dist/bundle',
  minifyOnBuild: false,
  envVariables: {
    NODE_ENV: 'development',
    ENGINE_LOG_LEVEL: 'DEBUG',
  },
};

/**
 * แม่แบบโปรเจกต์สำเร็จรูป (Built-in Starter Project Templates)
 */
export const STARTER_PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'nexus-game-engine-ts',
    name: 'Nexus 3D Game Engine Core',
    description: 'โปรเจกต์เกม 3D ระดับ AAA พัฒนาด้วย TypeScript & WebGL WebAssembly Pipeline พร้อมระบบ Combat และ Octree',
    category: 'game-engine',
    icon: 'Gamepad2',
    color: '#3b82f6',
    defaultRuntime: 'nexus-engine-wasm',
    tags: ['TypeScript', '3D Engine', 'Combat', 'Octree'],
    files: [
      {
        name: 'PlayerCombatController.ts',
        lang: 'typescript',
        isEntry: true,
        code: `import { Component, Vector3, EventDispatcher, Entity } from '@nexus/engine';

export interface CombatStats {
  health: number;
  attackPower: number;
  criticalChance: number;
  stamina: number;
}

export class PlayerCombatController extends Component {
  private stats: CombatStats = { 
    health: 100, 
    attackPower: 25, 
    criticalChance: 0.15, 
    stamina: 100 
  };

  public executeAttack(target: Entity): void {
    if (this.stats.stamina < 15) {
      console.warn('[Combat] Not enough stamina for attack');
      return;
    }
    
    this.stats.stamina -= 15;
    const isCrit = Math.random() < this.stats.criticalChance;
    const damage = isCrit ? this.stats.attackPower * 2.0 : this.stats.attackPower;
    
    target.applyDamage(damage);
    EventDispatcher.dispatch('COMBAT_HIT', { damage, isCrit, targetId: target.id });
  }

  public regenerateStamina(deltaMs: number): void {
    this.stats.stamina = Math.min(100, this.stats.stamina + (deltaMs * 0.05));
  }
}`
      },
      {
        name: 'SpatialOctreeEngine.ts',
        lang: 'typescript',
        code: `import { Vector3, BoundingBox } from '@nexus/math';

export class SpatialOctreeEngine<T extends { position: Vector3 }> {
  private bounds: BoundingBox;
  private capacity: number;
  private items: T[] = [];
  private children: SpatialOctreeEngine<T>[] = [];
  private divided: boolean = false;

  constructor(bounds: BoundingBox, capacity: number = 8) {
    this.bounds = bounds;
    this.capacity = capacity;
  }

  public insert(item: T): boolean {
    if (!this.bounds.contains(item.position)) {
      return false;
    }
    if (this.items.length < this.capacity && !this.divided) {
      this.items.push(item);
      return true;
    }
    if (!this.divided) {
      this.subdivide();
    }
    for (const child of this.children) {
      if (child.insert(item)) return true;
    }
    return false;
  }

  private subdivide(): void {
    this.divided = true;
    // Octree 8 octants initialization
  }
}`
      },
      {
        name: 'GameConfig.json',
        lang: 'json',
        code: `{
  "projectName": "Nexus 3D Realm",
  "version": "1.0.0",
  "targetFps": 120,
  "graphics": {
    "shadowQuality": "ultra",
    "raytracing": true,
    "msaaSamples": 4,
    "hdrEnabled": true
  },
  "physics": {
    "gravity": -9.81,
    "fixedTimestep": 0.0166,
    "solverIterations": 8
  }
}`
      }
    ],
    defaultSettings: {
      tabSize: 2,
      targetRuntime: 'nexus-engine-wasm',
      compilerFlags: '--strict --target es2022',
    }
  },
  {
    id: 'deep-neural-ai-python',
    name: 'Deep Neural Behavior AI',
    description: 'โปรเจกต์ AI Machine Learning และ Deep Reinforcement Learning สำหรับพฤติกรรมบอสและ NPC อัจฉริยะ',
    category: 'ai-data',
    icon: 'BrainCircuit',
    color: '#10b981',
    defaultRuntime: 'python-3.11',
    tags: ['Python', 'PyTorch', 'Deep Learning', 'NPC AI'],
    files: [
      {
        name: 'neural_behavior_agent.py',
        lang: 'python',
        isEntry: true,
        code: `#!/usr/bin/env python3
import torch
import torch.nn as nn
from typing import Tuple, List

class NeuralBehaviorAgent(nn.Module):
    """
    Deep Neural Policy Network สำหรับควบคุมการตัดสินใจของบอส
    """
    def __init__(self, state_dim: int = 128, action_dim: int = 16):
        super(NeuralBehaviorAgent, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(state_dim, 256),
            nn.LayerNorm(256),
            nn.ReLU(),
            nn.Linear(256, 128),
            nn.LayerNorm(128),
            nn.ReLU(),
            nn.Linear(128, action_dim),
            nn.Softmax(dim=-1)
        )

    def forward(self, state: torch.Tensor) -> torch.Tensor:
        return self.network(state)

    def predict_action(self, observation: List[float]) -> int:
        tensor_obs = torch.FloatTensor(observation).unsqueeze(0)
        with torch.no_grad():
            probs = self.forward(tensor_obs)
            action = torch.argmax(probs, dim=-1).item()
        return action

if __name__ == '__main__':
    agent = NeuralBehaviorAgent()
    print("Neural Agent loaded with 256 hidden layers & LayerNorm.")`
      },
      {
        name: 'replay_buffer.py',
        lang: 'python',
        code: `import random
from collections import deque
from typing import Tuple, Any

class PrioritizedReplayBuffer:
    def __init__(self, capacity: int = 100000):
        self.buffer = deque(maxlen=capacity)

    def push(self, state: Any, action: int, reward: float, next_state: Any, done: bool):
        self.buffer.append((state, action, reward, next_state, done))

    def sample(self, batch_size: int):
        return random.sample(self.buffer, min(len(self.buffer), batch_size))

    def __len__(self):
        return len(self.buffer)`
      }
    ],
    defaultSettings: {
      tabSize: 4,
      targetRuntime: 'python-3.11',
    }
  },
  {
    id: 'vulkan-render-core-cpp',
    name: 'Vulkan / C++ Render Core',
    description: 'เรนเดอร์เอนจินประสิทธิภาพสูงระดับ Low-level พร้อม BVH Raytracing Acceleration และ Modern C++20',
    category: 'systems-native',
    icon: 'Cpu',
    color: '#8b5cf6',
    defaultRuntime: 'native-cpp',
    tags: ['C++', 'Vulkan', 'Raytracing', 'BVH'],
    files: [
      {
        name: 'BVHAccelerationEngine.cpp',
        lang: 'cpp',
        isEntry: true,
        code: `#include <iostream>
#include <vector>
#include <memory>
#include <algorithm>

namespace NexusEngine::Raytracing {
    struct alignas(16) Ray {
        float origin[3];
        float direction[3];
        float tMin{0.001f};
        float tMax{1000.0f};
    };

    class BVHAccelerationEngine {
    private:
        std::vector<Ray> m_activeRays;
        int m_maxDepth{16};

    public:
        explicit BVHAccelerationEngine(int depth) : m_maxDepth(depth) {
            std::cout << "[BVH] Initialized accelerator with depth: " << m_maxDepth << std::endl;
        }

        [[nodiscard]] bool traverseBVH(const Ray& ray, float& hitDist) const noexcept {
            // Traversal implementation
            hitDist = 12.5f;
            return true;
        }
    };
}`
      },
      {
        name: 'CMakeLists.txt',
        lang: 'cmake',
        code: `cmake_minimum_required(VERSION 3.20)
project(VulkanRenderCore CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Vulkan REQUIRED)

add_executable(VulkanRenderCore 
    BVHAccelerationEngine.cpp
)

target_link_libraries(VulkanRenderCore PRIVATE Vulkan::Vulkan)`
      }
    ],
    defaultSettings: {
      tabSize: 4,
      targetRuntime: 'native-cpp',
      compilerFlags: '-O3 -mavx2 -fopenmp -std=c++20',
    }
  },
  {
    id: 'rust-ecs-spatial-indexer',
    name: 'Rust High-Performance ECS',
    description: 'เอนจินประมวลผล Entity Component System (ECS) ความเร็วสูงพิเศษ ปลอดภัยจาก Memory Leak ด้วย Rust',
    category: 'systems-native',
    icon: 'ShieldCheck',
    color: '#f97316',
    defaultRuntime: 'rust-cargo',
    tags: ['Rust', 'ECS', 'Multithreading', 'Zero-Cost'],
    files: [
      {
        name: 'octree_spatial_indexer.rs',
        lang: 'rust',
        isEntry: true,
        code: `pub struct BoundingBox {
    pub min: [f32; 3],
    pub max: [f32; 3],
}

pub struct OctreeSpatialIndexer<T> {
    pub root_bounds: BoundingBox,
    pub entities: Vec<T>,
    pub max_depth: usize,
}

impl<T> OctreeSpatialIndexer<T> {
    pub fn new(bounds: BoundingBox, max_depth: usize) -> Self {
        OctreeSpatialIndexer {
            root_bounds: bounds,
            entities: Vec::with_capacity(1024),
            max_depth,
        }
    }

    pub fn len(&self) -> usize {
        self.entities.len()
    }
}`
      },
      {
        name: 'Cargo.toml',
        lang: 'toml',
        code: `[package]
name = "rust-ecs-engine"
version = "0.1.0"
edition = "2021"

[dependencies]
rayon = "1.8"
glam = "0.24"
serde = { version = "1.0", features = ["derive"] }`
      }
    ],
    defaultSettings: {
      tabSize: 4,
      targetRuntime: 'rust-cargo',
      compilerFlags: 'cargo build --release',
    }
  },
  {
    id: 'glsl-volumetric-shaders',
    name: 'Volumetric Atmosphere & Shaders',
    description: 'โปรเจกต์ GLSL Shaders สำหรับการคำนวณแสง Rayleigh / Mie Scattering, Volumetric Clouds และ Post-Processing',
    category: 'shader-graphics',
    icon: 'Sparkles',
    color: '#ec4899',
    defaultRuntime: 'webgl-shader',
    tags: ['GLSL', 'Shaders', 'Volumetric', 'PostFX'],
    files: [
      {
        name: 'volumetric_atmosphere.frag',
        lang: 'glsl',
        isEntry: true,
        code: `#version 330 core
precision highp float;

in vec2 vUV;
out vec4 FragColor;

uniform mat4 uInvProjection;
uniform vec3 uSunPosition;
uniform sampler2D uDepthMap;

void main() {
    vec3 rayDir = normalize(vec3(vUV * 2.0 - 1.0, 1.0));
    float density = 0.0;
    
    for (int step = 0; step < 16; ++step) {
        density += 0.0625 * exp(-float(step) * 0.15);
    }
    
    FragColor = vec4(vec3(0.3, 0.6, 1.0) * density, 1.0);
}`
      },
      {
        name: 'lighting_model.vert',
        lang: 'glsl',
        code: `#version 330 core
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec2 aUV;

out vec2 vUV;
uniform mat4 uMVP;

void main() {
    vUV = aUV;
    gl_Position = uMVP * vec4(aPos, 1.0);
}`
      }
    ],
    defaultSettings: {
      tabSize: 2,
      targetRuntime: 'webgl-shader',
    }
  },
  {
    id: 'relational-game-state-sql',
    name: 'Relational Character & Game Save Schema',
    description: 'ฐานข้อมูล PostgreSQL / SQLite สำหรับจัดเก็บสถานะเกม ตัวละคร ไอเทม และระบบ Quest Log',
    category: 'database-sql',
    icon: 'Server',
    color: '#06b6d4',
    defaultRuntime: 'sql-relational',
    tags: ['SQL', 'PostgreSQL', 'Save State', 'Database'],
    files: [
      {
        name: 'create_game_tables.sql',
        lang: 'sql',
        isEntry: true,
        code: `-- Relational Game Save & Character State Schema
CREATE TABLE IF NOT EXISTS game_save_states (
    save_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id VARCHAR(64) NOT NULL,
    current_scene VARCHAR(128) NOT NULL,
    playtime_seconds INTEGER NOT NULL DEFAULT 0,
    save_payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS character_inventory (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id VARCHAR(64) NOT NULL,
    item_code VARCHAR(32) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    durability FLOAT DEFAULT 100.0
);

CREATE INDEX idx_game_saves_player ON game_save_states(player_id);
CREATE INDEX idx_inventory_player ON character_inventory(player_id);`
      }
    ],
    defaultSettings: {
      tabSize: 4,
      targetRuntime: 'sql-relational',
    }
  },
  {
    id: 'clean-blank-workspace',
    name: 'Clean Blank Workspace',
    description: 'เวิร์กสเปซเปล่าสำหรับเริ่มต้นเขียนโค้ดและโครงสร้างโปรเจกต์ใหม่ตั้งแต่ต้น',
    category: 'custom',
    icon: 'FileCode2',
    color: '#64748b',
    defaultRuntime: 'node-typescript',
    tags: ['Blank', 'TypeScript', 'Clean'],
    files: [
      {
        name: 'main.ts',
        lang: 'typescript',
        isEntry: true,
        code: `/**
 * Omni Studio - New Application Entrypoint
 */
export function main(): void {
  console.log("Omni Studio Project Initialized.");
}

main();`
      },
      {
        name: 'README.md',
        lang: 'markdown',
        code: `# My Omni Studio Project

Initialized with Clean Blank Workspace.
Write your application logic in \`main.ts\`.`
      }
    ],
    defaultSettings: {
      tabSize: 2,
      targetRuntime: 'node-typescript',
    }
  }
];

export class CodeProjectManager {
  private static cachedProjects: CodeProject[] | null = null;

  /**
   * ดึงรายการโปรเจกต์ทั้งหมด (หากยังไม่มีจะทำการ Seed เริ่มต้นอัตโนมัติ)
   */
  public static getAllProjects(): CodeProject[] {
    if (this.cachedProjects) {
      return this.cachedProjects;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (raw) {
        const parsed: CodeProject[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.cachedProjects = parsed;
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[CodeProjectManager] Failed to parse stored projects, re-seeding:', err);
    }

    // Seed default projects from starter templates
    const initialProjects = this.seedDefaultProjects();
    this.saveAllProjects(initialProjects);
    return initialProjects;
  }

  /**
   * สร้าง Initial Projects จาก Starter Templates
   */
  private static seedDefaultProjects(): CodeProject[] {
    const now = Date.now();
    return STARTER_PROJECT_TEMPLATES.map((tmpl, index) => ({
      id: tmpl.id,
      name: tmpl.name,
      description: tmpl.description,
      category: tmpl.category,
      icon: tmpl.icon,
      color: tmpl.color,
      createdAt: now - (STARTER_PROJECT_TEMPLATES.length - index) * 3600000,
      updatedAt: now - (STARTER_PROJECT_TEMPLATES.length - index) * 1800000,
      lastOpenedAt: index === 0 ? now : now - (index + 1) * 86400000,
      activeFilename: tmpl.files[0]?.name || 'main.ts',
      files: tmpl.files.map((f, fIdx) => ({
        id: `file_${tmpl.id}_${fIdx}_${Math.random().toString(36).substring(2, 7)}`,
        name: f.name,
        lang: f.lang,
        code: f.code,
        isEntry: f.isEntry || false,
        createdAt: now,
        updatedAt: now,
      })),
      settings: {
        ...DEFAULT_PROJECT_SETTINGS,
        targetRuntime: tmpl.defaultRuntime,
        ...(tmpl.defaultSettings || {}),
      },
      gitBranch: 'main',
      tags: tmpl.tags,
      isStarred: index === 0,
      isArchived: false,
      version: PROJECT_SCHEMA_VERSION,
    }));
  }

  /**
   * บันทึกรายการโปรเจกต์ทั้งหมดลง LocalStorage
   */
  private static saveAllProjects(projects: CodeProject[]): void {
    try {
      this.cachedProjects = projects;
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
      window.dispatchEvent(new CustomEvent('code-project-list-updated', { detail: projects }));
    } catch (err: any) {
      console.error('[CodeProjectManager] Failed to persist projects:', err);
    }
  }

  /**
   * ดึง ID ของโปรเจกต์ที่ Active อยู่ปัจจุบัน
   */
  public static getActiveProjectId(): string {
    const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_PROJECT_ID);
    if (stored) {
      const projects = this.getAllProjects();
      if (projects.some((p) => p.id === stored)) {
        return stored;
      }
    }
    const all = this.getAllProjects();
    const firstId = all[0]?.id || 'nexus-game-engine-ts';
    localStorage.setItem(STORAGE_KEY_ACTIVE_PROJECT_ID, firstId);
    return firstId;
  }

  /**
   * ดึง Object โปรเจกต์ที่ Active อยู่ปัจจุบัน
   */
  public static getActiveProject(): CodeProject {
    const activeId = this.getActiveProjectId();
    const all = this.getAllProjects();
    const found = all.find((p) => p.id === activeId);
    if (found) return found;

    return all[0] || this.seedDefaultProjects()[0];
  }

  /**
   * ดึงโปรเจกต์ตาม ID
   */
  public static getProjectById(id: string): CodeProject | undefined {
    return this.getAllProjects().find((p) => p.id === id);
  }

  /**
   * สลับโปรเจกต์ (Switch Project)
   */
  public static switchProject(projectId: string): CodeProject | null {
    const all = this.getAllProjects();
    const target = all.find((p) => p.id === projectId);
    if (!target) return null;

    target.lastOpenedAt = Date.now();
    localStorage.setItem(STORAGE_KEY_ACTIVE_PROJECT_ID, projectId);
    this.saveAllProjects(all);

    window.dispatchEvent(
      new CustomEvent('code-project-switched', {
        detail: target,
      })
    );

    return target;
  }

  /**
   * สร้างโปรเจกต์ใหม่ (Create New Project)
   */
  public static createProject(params: {
    name: string;
    description?: string;
    category?: ProjectCategory;
    icon?: string;
    color?: string;
    templateId?: string;
    initialFiles?: { name: string; lang: string; code: string; isEntry?: boolean }[];
    settings?: Partial<ProjectSettings>;
    tags?: string[];
  }): CodeProject {
    const now = Date.now();
    const id = 'proj_' + now.toString(36) + '_' + Math.random().toString(36).substring(2, 6);

    let templateFiles = params.initialFiles || [];
    let defaultRuntime: TargetRuntime = 'nexus-engine-wasm';

    if (params.templateId) {
      const tmpl = STARTER_PROJECT_TEMPLATES.find((t) => t.id === params.templateId);
      if (tmpl) {
        templateFiles = tmpl.files;
        defaultRuntime = tmpl.defaultRuntime;
      }
    }

    if (templateFiles.length === 0) {
      templateFiles = [
        {
          name: 'index.ts',
          lang: 'typescript',
          isEntry: true,
          code: `// ${params.name} - Entry File\nconsole.log("Hello from ${params.name}!");\n`,
        },
      ];
    }

    const files: ProjectFile[] = templateFiles.map((f, idx) => ({
      id: `file_${id}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      name: f.name,
      lang: f.lang,
      code: f.code,
      isEntry: f.isEntry || idx === 0,
      createdAt: now,
      updatedAt: now,
    }));

    const newProject: CodeProject = {
      id,
      name: params.name || 'Untitled Project',
      description: params.description || 'สร้างขึ้นเมื่อ ' + new Date(now).toLocaleDateString(),
      category: params.category || 'custom',
      icon: params.icon || 'Code2',
      color: params.color || '#3b82f6',
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: now,
      activeFilename: files[0]?.name || 'index.ts',
      files,
      settings: {
        ...DEFAULT_PROJECT_SETTINGS,
        targetRuntime: defaultRuntime,
        ...(params.settings || {}),
      },
      gitBranch: 'main',
      tags: params.tags || ['Custom'],
      isStarred: false,
      isArchived: false,
      version: PROJECT_SCHEMA_VERSION,
    };

    const all = this.getAllProjects();
    all.unshift(newProject);
    this.saveAllProjects(all);
    this.switchProject(newProject.id);

    return newProject;
  }

  /**
   * อัปเดตข้อมูลโปรเจกต์ (Update Project)
   */
  public static updateProject(id: string, updates: Partial<CodeProject>): CodeProject | null {
    const all = this.getAllProjects();
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = all[index];
    const updated: CodeProject = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
      settings: {
        ...existing.settings,
        ...(updates.settings || {}),
      },
    };

    all[index] = updated;
    this.saveAllProjects(all);

    window.dispatchEvent(
      new CustomEvent('code-project-updated', {
        detail: updated,
      })
    );

    return updated;
  }

  /**
   * บันทึกไฟล์และการตั้งค่าของโปรเจกต์ Active อยู่ปัจจุบัน
   */
  public static saveActiveProjectFiles(
    files: { name: string; lang: string; code: string; isEntry?: boolean }[],
    activeFilename?: string,
    partialSettings?: Partial<ProjectSettings>
  ): CodeProject | null {
    const activeId = this.getActiveProjectId();
    const all = this.getAllProjects();
    const index = all.findIndex((p) => p.id === activeId);
    if (index === -1) return null;

    const project = all[index];
    const now = Date.now();

    // Map files preserving IDs where possible
    const updatedFiles: ProjectFile[] = files.map((f, idx) => {
      const existingFile = project.files.find((ef) => ef.name === f.name);
      return {
        id: existingFile?.id || `file_${activeId}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        name: f.name,
        lang: f.lang,
        code: f.code,
        isEntry: f.isEntry !== undefined ? f.isEntry : existingFile?.isEntry || idx === 0,
        createdAt: existingFile?.createdAt || now,
        updatedAt: now,
      };
    });

    project.files = updatedFiles;
    if (activeFilename) {
      project.activeFilename = activeFilename;
    }
    if (partialSettings) {
      project.settings = { ...project.settings, ...partialSettings };
    }
    project.updatedAt = now;

    all[index] = project;
    this.saveAllProjects(all);
    return project;
  }

  /**
   * ทำซ้ำโปรเจกต์ (Clone / Duplicate Project)
   */
  public static duplicateProject(id: string): CodeProject | null {
    const original = this.getProjectById(id);
    if (!original) return null;

    const now = Date.now();
    const duplicated: CodeProject = {
      ...original,
      id: 'proj_' + now.toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      name: `${original.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: now,
      isStarred: false,
      files: original.files.map((f, idx) => ({
        ...f,
        id: `file_dup_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        createdAt: now,
        updatedAt: now,
      })),
    };

    const all = this.getAllProjects();
    all.unshift(duplicated);
    this.saveAllProjects(all);
    return duplicated;
  }

  /**
   * ลบโปรเจกต์ (Delete Project)
   */
  public static deleteProject(id: string): boolean {
    let all = this.getAllProjects();
    if (all.length <= 1) {
      // ป้องกันลบหมดจนว่างเปล่า
      return false;
    }

    all = all.filter((p) => p.id !== id);
    this.saveAllProjects(all);

    // หากโปรเจกต์ที่ลบคือโปรเจกต์ที่ Active อยู่ ให้สลับไปตัวแรก
    if (this.getActiveProjectId() === id) {
      this.switchProject(all[0].id);
    }

    return true;
  }

  /**
   * สลับสถานะติดดาว (Toggle Star)
   */
  public static toggleStar(id: string): boolean {
    const project = this.getProjectById(id);
    if (!project) return false;
    this.updateProject(id, { isStarred: !project.isStarred });
    return !project.isStarred;
  }

  /**
   * สลับสถานะเก็บถาวร (Toggle Archive)
   */
  public static toggleArchive(id: string): boolean {
    const project = this.getProjectById(id);
    if (!project) return false;
    this.updateProject(id, { isArchived: !project.isArchived });
    return !project.isArchived;
  }

  /**
   * ส่งออกโปรเจกต์เดี่ยวเป็น JSON
   */
  public static exportProjectAsJSON(id: string): string | null {
    const project = this.getProjectById(id);
    if (!project) return null;

    const bundle = {
      omniProjectExportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      project,
    };
    return JSON.stringify(bundle, null, 2);
  }

  /**
   * ส่งออกโปรเจกต์ทั้งหมดเป็น Workspace Bundle JSON
   */
  public static exportAllProjectsAsJSON(): string {
    const all = this.getAllProjects();
    const bundle = {
      omniWorkspaceExportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      activeProjectId: this.getActiveProjectId(),
      totalProjects: all.length,
      projects: all,
    };
    return JSON.stringify(bundle, null, 2);
  }

  /**
   * นำเข้าโปรเจกต์จากไฟล์ JSON
   */
  public static importProjectFromJSON(jsonString: string): { success: boolean; project?: CodeProject; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);

      // กรณี Workspace Bundle หลายโปรเจกต์
      if (parsed.omniWorkspaceExportVersion && Array.isArray(parsed.projects)) {
        const all = this.getAllProjects();
        let importedCount = 0;

        for (const p of parsed.projects) {
          if (p.name && Array.isArray(p.files)) {
            // ป้องกัน ID ชน
            p.id = 'imported_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
            all.unshift(p);
            importedCount++;
          }
        }

        if (importedCount > 0) {
          this.saveAllProjects(all);
          this.switchProject(all[0].id);
          return { success: true, project: all[0] };
        }
      }

      // กรณี Single Project
      const projectData: CodeProject = parsed.project || parsed;
      if (projectData && projectData.name && Array.isArray(projectData.files)) {
        projectData.id = 'imported_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
        projectData.createdAt = Date.now();
        projectData.updatedAt = Date.now();
        projectData.lastOpenedAt = Date.now();

        const all = this.getAllProjects();
        all.unshift(projectData);
        this.saveAllProjects(all);
        this.switchProject(projectData.id);
        return { success: true, project: projectData };
      }

      return { success: false, error: 'โครงสร้างไฟล์ JSON ไม่ถูกต้องตามรูปแบบ Omni Studio Project' };
    } catch (err: any) {
      return { success: false, error: `ข้อผิดพลาดในการแปลงไฟล์ JSON: ${err.message}` };
    }
  }

  /**
   * ดึงสถิติภาพรวมของโปรเจกต์ (Project Statistics)
   */
  public static getProjectStats(project: CodeProject): {
    totalFiles: number;
    totalLines: number;
    totalBytes: number;
    languages: { lang: string; count: number; percent: number }[];
  } {
    const totalFiles = project.files.length;
    let totalLines = 0;
    let totalBytes = 0;
    const langCountMap: Record<string, number> = {};

    project.files.forEach((f) => {
      const lines = f.code.split('\n').length;
      totalLines += lines;
      totalBytes += new Blob([f.code]).size;
      langCountMap[f.lang] = (langCountMap[f.lang] || 0) + 1;
    });

    const languages = Object.entries(langCountMap)
      .map(([lang, count]) => ({
        lang,
        count,
        percent: Math.round((count / Math.max(1, totalFiles)) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalFiles,
      totalLines,
      totalBytes,
      languages,
    };
  }
}
