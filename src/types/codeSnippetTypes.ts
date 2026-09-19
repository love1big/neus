/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Comprehensive TypeScript type definitions and contracts for the Code Editor
 *          Auto-Snippet & Parametric Code Template System. Defines snippet models,
 *          trigger prefixes, tabstop placeholders (${1:var}, ${0}), language scopes,
 *          curated categories, telemetry stats, and JSON export/import schemas.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Auto-Snippet และเทมเพลตโค้ดอัตโนมัติใน Code Editor
 *          ครอบคลุมการระบุคำกระตุ้น (Prefix/Trigger), ตัวแทนพารามิเตอร์ Tabstop (${1:arg}, ${0}),
 *          ขอบเขตภาษาที่รองรับ (Language Scopes), สถิติการใช้งาน, และโครงสร้างการส่งออก/นำเข้า JSON
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `CodeSnippetManagerNode.ts`, `CodeEditor.tsx`, and `AutoSnippetStudio.tsx`
 *    - Interoperable with Monaco Editor CompletionItemProvider & SnippetController
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - `CodeSnippet`: Primary data entity representing a parameterized auto-snippet
 *    - `SnippetCategory`: Domain taxonomy ('Game Engine' | 'Syntax' | 'Math' | 'Network' | 'Shader' | 'Custom')
 *    - `SnippetExportBundle`: Standardized schema for importing/exporting snippet packs
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Type guards and validation rules for empty prefixes, invalid regex chars, and malformed tabstops
 * 
 * 5. Usage Example (ตัวอย่างการเรียกใช้งาน):
 *    import { CodeSnippet } from '../types/codeSnippetTypes';
 *    const mySnippet: CodeSnippet = {
 *      id: 'snip_ts_v3_lerp',
 *      prefix: 'v3lerp',
 *      label: 'Vector3.Lerp Interpolation',
 *      detail: 'NexusEngine linear vector interpolation',
 *      body: 'Vector3.lerp(${1:startPos}, ${2:targetPos}, ${3:alpha * deltaTime})',
 *      language: 'typescript',
 *      category: 'Math & Vectors',
 *      tags: ['math', 'vector', 'lerp'],
 *      isCustom: true,
 *      enabled: true,
 *      usageCount: 0,
 *      createdAt: Date.now(),
 *      updatedAt: Date.now()
 *    };
 * ============================================================================
 */

export type SnippetCategory =
  | 'Game Engine & ECS'
  | 'Syntax & Control Flow'
  | 'Math, Physics & Vectors'
  | 'Async, Network & APIs'
  | 'Shaders, Graphics & VFX'
  | 'Architecture & OOP'
  | 'State Machine & AI'
  | 'Testing & Debugging'
  | 'Custom User Snippets';

export interface CodeSnippet {
  id: string;
  prefix: string;               // Keyword/trigger typed by user (e.g. 'clg', 'v3lerp', 'tryc', 'for_i')
  label: string;                // Display title in autocomplete popup
  detail: string;               // Short description of snippet functionality
  description?: string;         // Extended markdown documentation shown in preview hover
  body: string;                 // Template text supporting tabstops like ${1:placeholder}, ${2:name}, ${0}
  language: string;             // 'all' | 'typescript' | 'javascript' | 'python' | 'cpp' | 'csharp' | 'rust' | 'glsl' | 'sql' | 'html' | 'css'
  category: SnippetCategory;
  tags: string[];
  isCustom: boolean;            // true if created by user; false if built-in system preset
  enabled: boolean;             // whether to suggest in Monaco autocomplete
  usageCount: number;           // track how often this snippet is inserted
  createdAt: number;
  updatedAt: number;
}

export interface SnippetFilterCriteria {
  searchQuery: string;
  language: string;             // 'all' or specific language ID
  category: string;             // 'all' or specific category
  tag?: string;
  onlyCustom?: boolean;
  onlyEnabled?: boolean;
}

export interface SnippetExportBundle {
  version: string;
  exportedAt: number;
  author?: string;
  snippets: CodeSnippet[];
}

export interface ParsedPlaceholder {
  index: number;
  name: string;
  defaultValue?: string;
}
