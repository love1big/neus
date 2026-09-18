/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Comprehensive TypeScript type definitions, interfaces, and contracts
 *          for the Community Plugin Marketplace subsystem. Supports browsing,
 *          installing, updating, configuring, and sandboxing community extensions,
 *          runtime scripts, and engine plugins.
 *    - TH: กำหนด Type และ Interface ทั้งหมดสำหรับระบบ Plugin Marketplace ของชุมชน
 *          ครอบคลุมการค้นหา ติดตั้ง เปิด/ปิดการทำงาน อัปเดต และตรวจสอบความปลอดภัย
 *          ของสคริปต์ ส่วนขยายเอนจิน และปลั๊กอินที่สร้างโดยคอมมูนิตี้
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Consumed by `PluginMarketplaceRegistryNode.ts` (Registry & Storage)
 *    - Validated by `PluginSecuritySandboxEvaluatorNode.ts` (Security & AST Audit)
 *    - Rendered in `PluginMarketplace.tsx`, `PluginDetailModal.tsx`, and `PluginPublishExtensionModal.tsx`
 *    - Registered into `DevOpsHub` inside `App.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - `EnginePlugin`: Complete metadata for a community plugin.
 *    - `InstalledPluginState`: Local state of an installed plugin with runtime telemetry.
 *    - `PluginCategory`: Subsystem categorization (Physics, Shaders, AI, Netcode, etc.).
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Graceful fallback for missing author avatars, empty changelogs, or unverified packages.
 *    - Strict typing prevents invalid permissions or corrupted local storage states.
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    ```ts
 *    import { EnginePlugin, InstalledPluginState } from '../types/pluginMarketplaceTypes';
 *    const plugin: EnginePlugin = registry.getPlugin('plg_cloth_physics');
 *    ```
 * ============================================================================
 */

export type PluginCategory = 
  | 'ALL'
  | 'PHYSICS'
  | 'GRAPHICS_SHADERS'
  | 'AI_BEHAVIOR'
  | 'NETCODE'
  | 'DEVOPS_CI'
  | 'AUDIO_DSP'
  | 'PROCEDURAL_PCG'
  | 'TOOLS_UI';

export type PluginPermission = 
  | 'FILE_SYSTEM'
  | 'RAW_SOCKET'
  | 'GPU_COMPUTE'
  | 'MEMORY_PROFILER'
  | 'INPUT_HOOK'
  | 'WEB_WORKER'
  | 'AUDIO_THREAD'
  | 'SCENE_GRAPH_MUTATION';

export type PluginSecurityTier = 
  | 'VERIFIED_OFFICIAL'     // Audited and signed by NexusEngine Core Team
  | 'COMMUNITY_CURATED'     // Peer-reviewed by Community Council (High trust)
  | 'EXPERIMENTAL_SANDBOX'  // Community experimental; restricted sandbox active
  | 'UNAUDITED';            // External script without formal verification

export type PluginRuntimeStatus = 'ACTIVE' | 'DISABLED' | 'ERROR' | 'STANDBY';

export interface PluginVersionChangelog {
  version: string;
  releaseDate: string;
  highlights: string[];
}

export interface PluginDependency {
  pluginId: string;
  minVersion: string;
  optional?: boolean;
}

export interface EnginePlugin {
  id: string;
  name: string;
  version: string;
  author: string;
  authorEmail?: string;
  authorAvatar?: string;
  category: PluginCategory;
  tagline: string;
  description: string;
  detailedReadmeMarkdown: string;
  rating: number; // 0.0 - 5.0
  ratingCount: number;
  downloadCount: number;
  sizeKb: number;
  minEngineVersion: string;
  tags: string[];
  permissions: PluginPermission[];
  securityTier: PluginSecurityTier;
  securityAuditScore: number; // 0 - 100
  isOfficial?: boolean;
  isFeatured?: boolean;
  entryPointFilename: string;
  language: 'typescript' | 'glsl' | 'wasm' | 'cpp' | 'lua';
  sourceCodePreview: string;
  dependencies: PluginDependency[];
  changelog: PluginVersionChangelog[];
  runtimeMemoryFootprintKb: number;
  estimatedLatencyMs: number;
  updatedAt: string;
  createdAt: string;
  repositoryUrl?: string;
  license: string;
}

export interface InstalledPluginState {
  pluginId: string;
  installedVersion: string;
  enabled: boolean;
  installedAtTimestamp: number;
  autoUpdate: boolean;
  runtimeStatus: PluginRuntimeStatus;
  memoryUsageKb: number;
  cpuOverheadPercent: number;
  lastExecutionTimestamp?: number;
  customConfigurationJson?: string;
  lastError?: string;
}

export type MarketplaceSortOption = 
  | 'MOST_POPULAR'
  | 'HIGHEST_RATED'
  | 'NEWEST'
  | 'NAME_ASC'
  | 'SMALLEST_SIZE';

export interface MarketplaceFilterState {
  category: PluginCategory;
  searchQuery: string;
  onlyInstalled: boolean;
  onlyVerified: boolean;
  sortOption: MarketplaceSortOption;
}
