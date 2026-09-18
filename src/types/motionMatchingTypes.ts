/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type definitions for the AAA Motion Matching & Pose Search
 *          Database Engine (equivalent to Unreal Engine 5.4 Motion Matching / Pose Search
 *          and Ubisoft/EA Next-Gen Locomotion Framework).
 *          Defines Pose Feature Vectors, Future/Past Trajectory Samples, Bone Channels
 *          (Feet, Pelvis, Facing), Cost Weights, Pose Search Queries, and Inertializers.
 *    - TH: กำหนด Type และ Interface หลักสำหรับระบบ Motion Matching และ Pose Search Database
 *          ระดับ AAA (เทียบเท่า Unreal Engine 5.4 Motion Matching และระบบ Locomotion สมัยใหม่)
 *          ครอบคลุม Feature Vectors ของกระดูก, จุดพิกัดวิถีการเคลื่อนที่ (Trajectory),
 *          น้ำหนักการคำนวณ Cost (Cost Weights), และการเกลี่ยแอนิเมชันแบบ Inertialization
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `MotionMatchingDatabaseNode.ts` and `MotionMatchingPoseSearchStudio.tsx`
 *    - Integrates with Character Rigging, Locomotion Controller, and Animation Blender
 * 
 * 3. Inputs, Outputs & Data Contracts (พารามิเตอร์ Input / Output ที่รับส่ง):
 *    - Interfaces: `MotionPoseSample`, `TrajectoryPoint`, `PoseSearchCostWeights`, `PoseSearchDatabase`
 * ============================================================================
 */

export interface TrajectoryPoint {
  timeOffsetSec: number; // e.g. -0.4s, -0.2s, 0.0s, +0.2s, +0.4s, +0.8s
  position: { x: number; y: number; z: number }; // local offset relative to character root
  facingDirection: { x: number; y: number }; // 2D unit vector
  speed: number;
}

export interface BoneFeatureData {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  phase: 'GROUNDED' | 'PLANTING' | 'PASSING' | 'FLIGHT';
}

export interface MotionPoseSample {
  id: string;
  clipName: string;
  frameIndex: number;
  timeSec: number;
  rootVelocity: { x: number; y: number; z: number };
  rootAngularVelocity: number;
  leftFoot: BoneFeatureData;
  rightFoot: BoneFeatureData;
  pelvisHeight: number;
  trajectory: TrajectoryPoint[];
  tags: string[]; // e.g. ["Jog_Forward", "Sharp_Turn_Right", "Sprint_Stop"]
}

export interface PoseSearchCostWeights {
  trajectoryWeight: number; // 0.0 - 5.0
  posePositionWeight: number; // 0.0 - 5.0
  poseVelocityWeight: number; // 0.0 - 5.0
  facingAngleWeight: number; // 0.0 - 5.0
  continuingPoseBias: number; // Hysteresis to prevent pose flickering (e.g. -0.2)
}

export interface InertializationSettings {
  blendDurationSec: number; // 0.15s - 0.35s
  halfLifeSec: number; // Half-life damping decay
  smoothingProfile: 'QUADRATIC' | 'CUBIC' | 'QUINTIC';
}

export interface PoseSearchQueryResult {
  bestPose: MotionPoseSample;
  calculatedCost: number;
  trajectoryCost: number;
  poseCost: number;
  searchTimeMs: number;
  candidatesEvaluated: number;
}

export interface PoseSearchDatabase {
  id: string;
  name: string;
  characterArchetype: string;
  samplingRateFps: number;
  totalPoses: number;
  costWeights: PoseSearchCostWeights;
  inertialization: InertializationSettings;
  samples: MotionPoseSample[];
}
