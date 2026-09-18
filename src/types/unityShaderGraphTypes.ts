/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for Unity Shader Graph & Sub-Graph Node
 *          Architecture System (Unity 2023/6.0 Shader Graph parity).
 *          Defines Master Stacks (Universal Lit, Unlit, Decal), Sub-Graph ports,
 *          Custom Function Nodes (HLSL code injections), Precision switches
 *          (Half vs Float), Blackboard Exposed Properties, and On-Device Offline AI
 *          HLSL cross-compilation and instruction optimization.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Unity Shader Graph & Sub-Graph Node
 *          (เทียบเท่า Unity Shader Graph ใน Unity 6)
 *          ครอบคลุม Master Stack (URP Lit, Unlit), ซับกราฟที่เรียกใช้ซ้ำได้ (Sub-Graphs),
 *          โหนดฟังก์ชันแบบกำหนดเอง (Custom Function Node ฝังโค้ด HLSL), สวิตช์ความละเอียด
 *          Half / Float, กระดานตัวแปร Blackboard, และ AI ออฟไลน์ช่วยเขียนโค้ด HLSL
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `UnityShaderGraphEngineNode.ts` and `UnityShaderGraphSubGraphStudio.tsx`
 * ============================================================================
 */

export interface ShaderGraphPort {
  id: string;
  name: string;
  dataType: 'FLOAT' | 'VECTOR2' | 'VECTOR3' | 'VECTOR4' | 'TEXTURE2D';
  isInput: boolean;
}

export interface ShaderGraphNode {
  id: string;
  title: string;
  type: 'SAMPLE_TEXTURE_2D' | 'MULTIPLY' | 'VORONOI' | 'FRESNEL' | 'CUSTOM_FUNCTION_HLSL' | 'MASTER_STACK';
  x: number;
  y: number;
  precision: 'HALF' | 'FLOAT';
  inputs: ShaderGraphPort[];
  outputs: ShaderGraphPort[];
}

export interface UnityShaderGraphProfile {
  graphName: string;
  targetPipeline: 'UNIVERSAL_URP' | 'HIGH_DEFINITION_HDRP';
  precision: 'HALF' | 'FLOAT';
  nodes: ShaderGraphNode[];
  generatedHLSLCode: string;
  offlineAIOptimizeHLSL: boolean;
}
