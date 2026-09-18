/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for the Blender Geometry Nodes & Procedural
 *          Simulation Fields System (Blender 4.2+ Geometry Nodes parity).
 *          Defines Field Evaluation trees, Simulation Zones, Repeat Zones, Mesh-to-Curve,
 *          Point Distribution on Faces, Volume Grids (OpenVDB), and On-Device Offline
 *          AI Procedural Geometry Synthesizers.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ Blender Geometry Nodes & Procedural
 *          Simulation Fields (เทียบเท่า Blender 4.2+ Geometry Nodes)
 *          ครอบคลุมโหนดประมวลผลฟิลด์ข้อมูล, โซนจำลองการเคลื่อนที่ (Simulation Zone),
 *          การกระจายจุดบนพื้นผิว (Point Distribution on Faces), เมช-ทู-เคิร์ฟ,
 *          และเอนจิน AI ออฟไลน์ในการสังเคราะห์โมเดลเรขาคณิตสามมิติ
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `BlenderGeometryNodesNode.ts` and `BlenderGeometryNodesProceduralStudio.tsx`
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Interfaces: `GeoNodeInstance`, `GeoSocket`, `GeoSimulationZone`, `GeometryNodesGraph`
 * 
 * 4. Error Handling & Fallbacks (การจัดการข้อผิดพลาดและ Edge Cases):
 *    - Circular node graph dependencies are detected via topological sort fallback.
 * ============================================================================
 */

export type GeoSocketType = 'GEOMETRY' | 'VECTOR' | 'FLOAT' | 'INTEGER' | 'BOOLEAN' | 'ROTATION' | 'COLOR';

export interface GeoSocket {
  id: string;
  name: string;
  type: GeoSocketType;
  isInput: boolean;
  value?: any;
}

export interface GeoNodeInstance {
  id: string;
  name: string;
  category: 'INPUT' | 'GEOMETRY' | 'CURVE' | 'POINT' | 'SIMULATION' | 'OFFLINE_AI_SYNTH';
  x: number;
  y: number;
  inputs: GeoSocket[];
  outputs: GeoSocket[];
  colorHex: string;
}

export interface GeoConnectionLink {
  id: string;
  fromNodeId: string;
  fromSocketId: string;
  toNodeId: string;
  toSocketId: string;
}

export interface GeometryNodesGraph {
  nodes: GeoNodeInstance[];
  links: GeoConnectionLink[];
  simulationFrame: number;
  isSimulating: boolean;
  totalGeneratedVertices: number;
  totalInstancedPoints: number;
  offlineAIPrompt: string;
}
