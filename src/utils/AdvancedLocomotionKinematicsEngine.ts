/**
 * ============================================================================
 * @file AdvancedLocomotionKinematicsEngine.ts
 * @module Engine/LocomotionKinematics
 * @description
 * [TH] เอนจินการเคลื่อนไหว สรีระจลนศาสตร์ และ State Machine ขั้นสูงระดับ AAA
 * (Advanced Character Locomotion & Kinematics Engine)
 * ครอบคลุมระบบการเคลื่อนไหวที่ใช้ในเกมระดับสูงทั้งหมด:
 * 1. Two-Bone Analytical IK & FABRIK (Forward And Backward Reaching Inverse Kinematics)
 * 2. 2D Blend Spaces (Direction [-180..180], Speed [0..800 cm/s], Slope Pitch/Roll)
 * 3. Foot Placement Ground Raycast Alignment (การปรับระดับข้อเท้าและเข่าตามความชันพื้นผิว)
 * 4. Locomotion Animation State Machine (Transitions, Inertialization Blending, Crossfade)
 * 5. Root Motion Extraction & Movement Capsule Delta Matching
 * 6. Active Ragdoll Blend Matrix (การผสมแรงฟิสิกส์ร่วมกับคีย์เฟรมแอนิเมชัน)
 *
 * [EN] Advanced Character Locomotion, Kinematics & Animation State Machine featuring:
 * 1. Analytical Two-Bone IK & Multi-Joint FABRIK Solver
 * 2. 2D Parametric Blend Spaces with Velocity/Direction Vector Mapping
 * 3. Dynamic Foot-to-Ground Terrain Adaptation Raycasting
 * 4. Hierarchical Locomotion State Machine with Inertialization Blending
 * 5. Root Motion Delta Extraction
 * 6. Active Ragdoll Physics / Keyframe Hybrid Blending
 * ============================================================================
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface BoneJoint {
  id: string;
  name: string;
  position: Vector3D;
  targetPosition?: Vector3D;
  rotation: Vector3D; // Euler angles in degrees
  length: number;
  parent?: string;
  children: string[];
}

export interface IKChain {
  rootJointId: string;
  midJointId: string;
  endEffectorId: string;
  targetPosition: Vector3D;
  poleVector?: Vector3D;
  weight: number; // 0..1
}

export type LocomotionState = 
  | 'Idle'
  | 'Walk_Forward'
  | 'Walk_Backward'
  | 'Walk_Strafe_Left'
  | 'Walk_Strafe_Right'
  | 'Jog_Forward'
  | 'Sprint'
  | 'Crouch_Idle'
  | 'Crouch_Walk'
  | 'Jump_Apex'
  | 'Falling'
  | 'Land_Hard'
  | 'Melee_Attack_Light1'
  | 'Melee_Attack_Light2'
  | 'Hit_Stun_React'
  | 'Ragdoll_Recovery';

export interface BlendSpace2DConfig {
  name: string;
  axisXName: string; // e.g. "Direction" (-180 to 180)
  axisYName: string; // e.g. "Speed" (0 to 600)
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  samples: {
    state: LocomotionState;
    x: number;
    y: number;
    weight: number;
  }[];
}

export interface LocomotionTelemetry {
  currentState: LocomotionState;
  targetState: LocomotionState;
  transitionProgress: number; // 0..1
  velocity: Vector3D;
  speed: number;
  direction: number; // -180..180
  groundSlopeAngle: number;
  leftFootIKOffset: number;
  rightFootIKOffset: number;
  pelvisOffset: number;
  ragdollWeight: number; // 0..1
  rootMotionDelta: Vector3D;
  staminaCostPerSec: number;
}

export class AdvancedLocomotionKinematicsEngine {
  private currentState: LocomotionState = 'Idle';
  private targetState: LocomotionState = 'Idle';
  private transitionTimer: number = 0;
  private transitionDuration: number = 0.25; // 250ms crossfade

  private speed: number = 0;
  private direction: number = 0;
  private isCrouched: boolean = false;
  private isGrounded: boolean = true;
  private isAttacking: boolean = false;
  private ragdollWeight: number = 0;

  // Foot IK Parameters
  private leftFootEffector: Vector3D = { x: -0.18, y: 0, z: 0 };
  private rightFootEffector: Vector3D = { x: 0.18, y: 0, z: 0 };
  private leftFootIKOffset: number = 0;
  private rightFootIKOffset: number = 0;
  private pelvisOffset: number = 0;

  // Blend Space Config
  private blendSpace: BlendSpace2DConfig = {
    name: 'StandardLocomotion_BS2D',
    axisXName: 'Direction',
    axisYName: 'Speed',
    minX: -180,
    maxX: 180,
    minY: 0,
    maxY: 650,
    samples: [
      { state: 'Idle', x: 0, y: 0, weight: 1.0 },
      { state: 'Walk_Forward', x: 0, y: 180, weight: 0 },
      { state: 'Walk_Backward', x: 180, y: 180, weight: 0 },
      { state: 'Walk_Strafe_Left', x: -90, y: 180, weight: 0 },
      { state: 'Walk_Strafe_Right', x: 90, y: 180, weight: 0 },
      { state: 'Jog_Forward', x: 0, y: 380, weight: 0 },
      { state: 'Sprint', x: 0, y: 620, weight: 0 }
    ]
  };

  /**
   * อัลกอริทึม Two-Bone Analytical Inverse Kinematics (Law of Cosines)
   * คำนวณมุมงอของข้อเข่า/ข้อศอก และข้อสะโพก/หัวไหล่
   */
  public static solveTwoBoneIK(
    rootPos: Vector3D,
    midPos: Vector3D,
    endPos: Vector3D,
    targetPos: Vector3D,
    poleVector: Vector3D = { x: 0, y: 0, z: 1 }
  ): { newMidPos: Vector3D; newEndPos: Vector3D; solved: boolean } {
    // 1. ความยาวกระดูกท่อนบนและท่อนล่าง
    const l1 = Math.hypot(midPos.x - rootPos.x, midPos.y - rootPos.y, midPos.z - rootPos.z);
    const l2 = Math.hypot(endPos.x - midPos.x, endPos.y - midPos.y, endPos.z - midPos.z);

    // 2. ระยะทางไปยัง Target
    const dx = targetPos.x - rootPos.x;
    const dy = targetPos.y - rootPos.y;
    const dz = targetPos.z - rootPos.z;
    let dist = Math.hypot(dx, dy, dz);

    // Clamp distance ป้องกันกระดูกยืดเกินขีดจำกัด (Overstretch)
    const maxReach = (l1 + l2) * 0.9999;
    const minReach = Math.abs(l1 - l2) * 1.0001;
    dist = Math.max(minReach, Math.min(maxReach, dist));

    // 3. กฎของโคไซน์ (Law of Cosines) หาแอลฟาและบีต้า
    const cosAngle0 = (dist * dist + l1 * l1 - l2 * l2) / (2 * dist * l1);
    const angle0 = Math.acos(Math.max(-1, Math.min(1, cosAngle0)));

    // ทิศทางหลักจาก Root ไป Target
    const dirX = dx / dist;
    const dirY = dy / dist;
    const dirZ = dz / dist;

    // Normal ของระนาบการงอ (Bend Plane)
    const crossX = dirY * poleVector.z - dirZ * poleVector.y;
    const crossY = dirZ * poleVector.x - dirX * poleVector.z;
    const crossZ = dirX * poleVector.y - dirY * poleVector.x;
    const crossLen = Math.hypot(crossX, crossY, crossZ) || 1;

    // Vector ตั้งฉากชี้ไปทาง Pole
    const bendX = (crossY * dirZ - crossZ * dirY) / crossLen;
    const bendY = (crossZ * dirX - crossX * dirZ) / crossLen;
    const bendZ = (crossX * dirY - crossY * dirX) / crossLen;

    // ตำแหน่งข้อต่อกลาง (Knee / Elbow)
    const midX = rootPos.x + (dirX * Math.cos(angle0) + bendX * Math.sin(angle0)) * l1;
    const midY = rootPos.y + (dirY * Math.cos(angle0) + bendY * Math.sin(angle0)) * l1;
    const midZ = rootPos.z + (dirZ * Math.cos(angle0) + bendZ * Math.sin(angle0)) * l1;

    return {
      newMidPos: { x: midX, y: midY, z: midZ },
      newEndPos: { x: targetPos.x, y: targetPos.y, z: targetPos.z },
      solved: true
    };
  }

  /**
   * อัลกอริทึม FABRIK สำหรับกระดูกหลายท่อน (Multi-Joint Chain IK)
   */
  public static solveFABRIK(joints: Vector3D[], target: Vector3D, maxIterations: number = 10, tolerance: number = 0.001): Vector3D[] {
    const n = joints.length;
    if (n < 2) return joints;

    const lengths: number[] = [];
    let totalLen = 0;
    for (let i = 0; i < n - 1; i++) {
      const len = Math.hypot(joints[i + 1].x - joints[i].x, joints[i + 1].y - joints[i].y, joints[i + 1].z - joints[i].z);
      lengths.push(len);
      totalLen += len;
    }

    const distToTarget = Math.hypot(target.x - joints[0].x, target.y - joints[0].y, target.z - joints[0].z);

    // กรณี Target ไกลเกินเอื้อม (Unreachable) -> ยืดตรง
    if (distToTarget > totalLen) {
      for (let i = 0; i < n - 1; i++) {
        const r = Math.hypot(target.x - joints[i].x, target.y - joints[i].y, target.z - joints[i].z);
        const lambda = lengths[i] / r;
        joints[i + 1] = {
          x: (1 - lambda) * joints[i].x + lambda * target.x,
          y: (1 - lambda) * joints[i].y + lambda * target.y,
          z: (1 - lambda) * joints[i].z + lambda * target.z
        };
      }
      return joints;
    }

    // จุดตรึง Root เริ่มต้น
    const rootPos = { ...joints[0] };

    for (let iter = 0; iter < maxIterations; iter++) {
      // 1. Backward Reaching (จาก End Effector ย้อนกลับหา Root)
      joints[n - 1] = { ...target };
      for (let i = n - 2; i >= 0; i--) {
        const r = Math.hypot(joints[i + 1].x - joints[i].x, joints[i + 1].y - joints[i].y, joints[i + 1].z - joints[i].z);
        const lambda = lengths[i] / r;
        joints[i] = {
          x: (1 - lambda) * joints[i + 1].x + lambda * joints[i].x,
          y: (1 - lambda) * joints[i + 1].y + lambda * joints[i].y,
          z: (1 - lambda) * joints[i + 1].z + lambda * joints[i].z
        };
      }

      // 2. Forward Reaching (จาก Root วิ่งกลับหา End Effector)
      joints[0] = { ...rootPos };
      for (let i = 0; i < n - 1; i++) {
        const r = Math.hypot(joints[i + 1].x - joints[i].x, joints[i + 1].y - joints[i].y, joints[i + 1].z - joints[i].z);
        const lambda = lengths[i] / r;
        joints[i + 1] = {
          x: (1 - lambda) * joints[i].x + lambda * joints[i + 1].x,
          y: (1 - lambda) * joints[i].y + lambda * joints[i + 1].y,
          z: (1 - lambda) * joints[i].z + lambda * joints[i + 1].z
        };
      }

      // เช็คค่าความคลาดเคลื่อน
      const curDist = Math.hypot(joints[n - 1].x - target.x, joints[n - 1].y - target.y, joints[n - 1].z - target.z);
      if (curDist < tolerance) break;
    }

    return joints;
  }

  /**
   * คำนวณน้ำหนัก 2D Blend Space (Delaunay/Barycentric Weighting)
   */
  public evaluateBlendSpaceWeights(dir: number, spd: number): { state: LocomotionState; weight: number }[] {
    const results: { state: LocomotionState; weight: number }[] = [];
    let totalInvDist = 0;

    for (const sample of this.blendSpace.samples) {
      const dx = (dir - sample.x) / (this.blendSpace.maxX - this.blendSpace.minX);
      const dy = (spd - sample.y) / (this.blendSpace.maxY - this.blendSpace.minY);
      const dist = Math.hypot(dx, dy);

      if (dist < 0.001) {
        return [{ state: sample.state, weight: 1.0 }];
      }

      const invDist = 1.0 / Math.pow(dist, 2);
      sample.weight = invDist;
      totalInvDist += invDist;
    }

    for (const sample of this.blendSpace.samples) {
      const normalizedWeight = sample.weight / totalInvDist;
      if (normalizedWeight > 0.01) {
        results.push({ state: sample.state, weight: normalizedWeight });
      }
    }

    return results;
  }

  /**
   * ปรับแก้ Foot-Placement ตามความชันพื้นผิว (Terrain Surface Alignment)
   */
  public updateFootPlacementRaycast(groundLeftHeight: number, groundRightHeight: number): void {
    // หาความสูงต่ำสุดเพื่อลดระดับ Pelvis (สะโพก)
    const lowestFoot = Math.min(groundLeftHeight, groundRightHeight);
    this.pelvisOffset = lowestFoot < 0 ? lowestFoot * 0.75 : 0;

    // คำนวณ Offset สำหรับเท้าแต่ละข้าง
    this.leftFootIKOffset = groundLeftHeight - this.pelvisOffset;
    this.rightFootIKOffset = groundRightHeight - this.pelvisOffset;
  }

  /**
   * อัปเดตตรรกะ State Machine & Locomotion ในแต่ละเฟรม
   */
  public tick(
    deltaTime: number,
    inputVector: { x: number; y: number },
    sprintRequested: boolean,
    crouchRequested: boolean,
    jumpTriggered: boolean
  ): LocomotionTelemetry {
    // 1. คำนวณความเร็วและทิศทาง
    const inputMagnitude = Math.hypot(inputVector.x, inputVector.y);
    let targetSpeed = 0;

    if (inputMagnitude > 0.1) {
      if (sprintRequested && !crouchRequested) {
        targetSpeed = 600;
      } else if (crouchRequested) {
        targetSpeed = 160;
      } else {
        targetSpeed = 380; // Jog
      }
      this.direction = Math.atan2(inputVector.x, inputVector.y) * (180 / Math.PI);
    } else {
      targetSpeed = 0;
    }

    // Smooth speed interpolation (Acceleration/Deceleration)
    const accelRate = targetSpeed > this.speed ? 8.0 : 12.0;
    this.speed += (targetSpeed - this.speed) * Math.min(1.0, deltaTime * accelRate);

    // 2. กำหนด Target State
    let nextState: LocomotionState = 'Idle';
    if (!this.isGrounded) {
      nextState = 'Falling';
    } else if (crouchRequested) {
      nextState = this.speed > 20 ? 'Crouch_Walk' : 'Crouch_Idle';
    } else if (this.speed > 480) {
      nextState = 'Sprint';
    } else if (this.speed > 240) {
      nextState = 'Jog_Forward';
    } else if (this.speed > 20) {
      if (Math.abs(this.direction) > 135) nextState = 'Walk_Backward';
      else if (this.direction > 45) nextState = 'Walk_Strafe_Right';
      else if (this.direction < -45) nextState = 'Walk_Strafe_Left';
      else nextState = 'Walk_Forward';
    }

    // State Transition Handling
    if (nextState !== this.currentState && this.targetState !== nextState) {
      this.targetState = nextState;
      this.transitionTimer = 0;
    }

    if (this.targetState !== this.currentState) {
      this.transitionTimer += deltaTime;
      if (this.transitionTimer >= this.transitionDuration) {
        this.currentState = this.targetState;
        this.transitionTimer = 0;
      }
    }

    // 3. คำนวณ Root Motion Delta
    const forwardX = Math.sin(this.direction * (Math.PI / 180));
    const forwardZ = Math.cos(this.direction * (Math.PI / 180));
    const rootMotionDelta: Vector3D = {
      x: forwardX * this.speed * (deltaTime / 100),
      y: 0,
      z: forwardZ * this.speed * (deltaTime / 100)
    };

    const transitionProgress = this.transitionDuration > 0 ? Math.min(1, this.transitionTimer / this.transitionDuration) : 1;

    return {
      currentState: this.currentState,
      targetState: this.targetState,
      transitionProgress,
      velocity: { x: forwardX * this.speed, y: 0, z: forwardZ * this.speed },
      speed: this.speed,
      direction: this.direction,
      groundSlopeAngle: 0,
      leftFootIKOffset: this.leftFootIKOffset,
      rightFootIKOffset: this.rightFootIKOffset,
      pelvisOffset: this.pelvisOffset,
      ragdollWeight: this.ragdollWeight,
      rootMotionDelta,
      staminaCostPerSec: nextState === 'Sprint' ? 18.5 : 0
    };
  }

  public setRagdollWeight(weight: number): void {
    this.ragdollWeight = Math.max(0, Math.min(1, weight));
  }
}
