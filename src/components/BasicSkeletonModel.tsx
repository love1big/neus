import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface BasicSkeletonModelProps {
  position?: [number, number, number];
  isSimulating?: boolean;
  animState?: 'Idle' | 'Walk' | 'Run' | 'Jump' | 'Attack' | 'HitReaction' | 'Death' | 'ElfWalk' | 'ElfAttack';
  blendWeight?: number;
}

export default function BasicSkeletonModel({ position = [0, 1, 0], isSimulating = false, animState = 'Idle', blendWeight = 1.0 }: BasicSkeletonModelProps) {
  const group = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const leftLowerArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftHandIKTargetRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Group>(null);
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  const currentActionTime = useRef(0);

  // Very basic procedural animation to simulate an "AI generated" walk/idle cycle or IK result
  useFrame((state, delta) => {
    if (!group.current || !isSimulating) return;
    
    const time = state.clock.getElapsedTime() + timeOffset;
    if (animState === 'Attack' || animState === 'Jump' || animState === 'HitReaction' || animState === 'ElfAttack') {
       currentActionTime.current += delta;
    } else {
       currentActionTime.current = 0;
    }
    
    // Simple IK/Animation simulation
    let leftLegX = 0, rightLegX = 0;
    let leftArmX = 0, rightArmX = 0;
    let spineY = 0, spineZ = 0;

    // Idle
    const idleSpineY = Math.sin(time * 2) * 0.05;
    const idleArmX = Math.sin(time * 2) * 0.05;

    // Walk
    const walkCycle = Math.sin(time * 5);
    const armCycle = Math.cos(time * 5);
    const walkLegX = walkCycle * 0.5;
    const walkArmX = armCycle * 0.5;
    
    // Run
    const runCycle = Math.sin(time * 10);
    const runArmCycle = Math.cos(time * 10);
    const runLegX = runCycle * 0.9;
    const runArmX = runArmCycle * 0.9;

    // Jump
    const jumpLegX = currentActionTime.current < 0.3 ? -0.5 : (currentActionTime.current < 0.8 ? 0.2 : 0);
    const jumpArmX = currentActionTime.current < 0.3 ? 0.5 : (currentActionTime.current < 0.8 ? -0.8 : 0);
    
    // Attack
    const attackArmX = currentActionTime.current < 0.2 ? -1.5 : (currentActionTime.current < 0.5 ? 1.0 : 0);
    
    // Elf Walk (Stealthy, crouched)
    const elfWalkCycle = Math.sin(time * 6);
    const elfWalkLegX = elfWalkCycle * 0.4;
    const elfWalkArmX = Math.cos(time * 6) * 0.2;
    
    // Elf Attack (Bow draw)
    const bowDrawPhase = (currentActionTime.current % 1.5) / 1.5; // 1.5s loop
    const rightArmDraw = bowDrawPhase < 0.3 ? -0.5 : (bowDrawPhase < 0.8 ? -1.5 : (bowDrawPhase < 0.9 ? 1.0 : -0.5));
    
    // HitReaction
    const hitSpineZ = currentActionTime.current < 0.2 ? -0.4 : (currentActionTime.current < 0.4 ? 0.2 : 0);
    const hitArmX = currentActionTime.current < 0.2 ? -0.5 : 0;

    let targetLeftLegX = 0, targetRightLegX = 0;
    let targetLeftArmX = 0, targetRightArmX = 0;
    let targetSpineY = 0, targetSpineZ = 0;
    let targetSpineX = 0;

    switch (animState) {
       case 'Idle':
         targetSpineY = idleSpineY;
         targetLeftArmX = idleArmX;
         targetRightArmX = -idleArmX;
         break;
       case 'Walk':
         targetLeftLegX = walkLegX;
         targetRightLegX = -walkLegX;
         targetLeftArmX = -walkArmX;
         targetRightArmX = walkArmX;
         targetSpineY = Math.sin(time * 10) * 0.05;
         break;
       case 'Run':
         targetLeftLegX = runLegX;
         targetRightLegX = -runLegX;
         targetLeftArmX = -runArmX;
         targetRightArmX = runArmX;
         targetSpineY = Math.sin(time * 20) * 0.1;
         break;
       case 'Jump':
         targetLeftLegX = jumpLegX;
         targetRightLegX = jumpLegX;
         targetLeftArmX = jumpArmX;
         targetRightArmX = jumpArmX;
         break;
       case 'Attack':
         targetRightArmX = attackArmX;
         targetLeftArmX = idleArmX;
         targetSpineY = attackArmX * -0.2;
         if (currentActionTime.current > 0.6) currentActionTime.current = 0; // Loop attack
         break;
       case 'ElfWalk':
         targetLeftLegX = elfWalkLegX;
         targetRightLegX = -elfWalkLegX;
         targetLeftArmX = -elfWalkArmX;
         targetRightArmX = elfWalkArmX;
         targetSpineX = 0.3; // Crouch forward
         targetSpineY = Math.sin(time * 12) * 0.08;
         break;
       case 'ElfAttack':
         targetRightArmX = rightArmDraw;
         targetSpineY = -0.4; // Turn body sideways for archery
         targetLeftLegX = -0.2; // Staggered stance
         targetRightLegX = 0.1;
         break;
       case 'HitReaction':
         targetSpineZ = hitSpineZ;
         targetLeftArmX = hitArmX;
         targetRightArmX = hitArmX;
         targetLeftLegX = -0.2;
         targetRightLegX = 0.2;
         if (currentActionTime.current > 0.6) currentActionTime.current = 0; // Loop reaction
         break;
    }

    // Blend current rotation with target based on blendWeight (simple lerp)
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, targetLeftLegX, blendWeight * 0.1);
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, targetRightLegX, blendWeight * 0.1);
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, targetRightArmX, blendWeight * 0.1);
    }

    if (spineRef.current) {
      spineRef.current.rotation.x = THREE.MathUtils.lerp(spineRef.current.rotation.x, targetSpineX, blendWeight * 0.1);
      spineRef.current.rotation.y = THREE.MathUtils.lerp(spineRef.current.rotation.y, targetSpineY, blendWeight * 0.1);
      spineRef.current.rotation.z = THREE.MathUtils.lerp(spineRef.current.rotation.z, targetSpineZ, blendWeight * 0.1);
    }

    // Two-Bone IK Solver for Left Arm
    if (leftArmRef.current && leftLowerArmRef.current && leftHandIKTargetRef.current) {
      // Animate IK target smoothly
      leftHandIKTargetRef.current.position.y = 1.0 + Math.sin(time * 3) * 0.4;
      leftHandIKTargetRef.current.position.z = 0.5 + Math.cos(time * 3) * 0.4;
      leftHandIKTargetRef.current.position.x = -0.5 + Math.sin(time * 2) * 0.2;

      const upperArm = leftArmRef.current;
      const lowerArm = leftLowerArmRef.current;
      const target = leftHandIKTargetRef.current;

      const p1 = new THREE.Vector3();
      upperArm.getWorldPosition(p1);

      const p2 = new THREE.Vector3();
      lowerArm.getWorldPosition(p2);

      const pt = new THREE.Vector3();
      target.getWorldPosition(pt);

      // Distances
      // Upper arm joints offset is [-0.1, -0.5, 0], length approx 0.51
      const l1 = Math.sqrt(0.1 * 0.1 + 0.5 * 0.5); 
      // Lower arm length approx 0.5
      const l2 = 0.5;

      const lMax = l1 + l2;
      let d = p1.distanceTo(pt);
      d = Math.max(0.01, Math.min(d, lMax - 0.001));

      // Direction to target
      const dir = new THREE.Vector3().subVectors(pt, p1).normalize();

      // Pole vector (elbow hints outwards/backwards)
      const poleLocal = new THREE.Vector3(-1, 0, -1).normalize();
      const poleWorld = p1.clone().add(poleLocal);

      // Plane normal
      const normal = new THREE.Vector3().subVectors(poleWorld, p1).cross(dir).normalize();
      if (normal.length() === 0) normal.set(1, 0, 0);

      // Angles
      const cosAlpha = (d * d + l1 * l1 - l2 * l2) / (2 * d * l1);
      const alpha = Math.acos(THREE.MathUtils.clamp(cosAlpha, -1, 1));

      const cosBeta = (l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2);
      const beta = Math.acos(THREE.MathUtils.clamp(cosBeta, -1, 1));

      // Upper Arm rotation
      // Rest direction of upper arm (from parent to elbow) is roughly ( -0.1, -0.5, 0 ). Let's normalize it.
      const restDir1 = new THREE.Vector3(-0.1, -0.5, 0).normalize();
      const qLookAt = new THREE.Quaternion().setFromUnitVectors(restDir1, dir);
      const qBend = new THREE.Quaternion().setFromAxisAngle(normal, alpha);
      const qUpperWorld = qBend.multiply(qLookAt);

      const parent = upperArm.parent;
      const qParentWorld = new THREE.Quaternion();
      if (parent) {
        parent.getWorldQuaternion(qParentWorld);
      }
      const qLocalUpper = qParentWorld.invert().multiply(qUpperWorld);
      
      upperArm.quaternion.slerp(qLocalUpper, 0.8);

      // Lower Arm rotation
      // Rest direction of lower arm is ( 0, -0.5, 0 ).
      // It bends around the local normal axis.
      const normalLocal = normal.clone().applyQuaternion(qUpperWorld.clone().invert());
      // The lower arm needs to bend towards the target plane.
      const qLower = new THREE.Quaternion().setFromAxisAngle(normalLocal, Math.PI - beta);
      lowerArm.quaternion.slerp(qLower, 0.8);
    } else if (leftArmRef.current) {
      // Fallback if IK is disabled
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, targetLeftArmX, blendWeight * 0.1);
    }
  });

  const jointMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#58a6ff', roughness: 0.2, metalness: 0.8 }), []);
  const boneMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e6edf3', roughness: 0.6 }), []);

  return (
    <group ref={group} position={position}>
      {/* Pelvis / Root */}
      <mesh material={jointMaterial} position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.2]} />
      </mesh>

      {/* Spine & Head */}
      <group ref={spineRef} position={[0, 0.1, 0]}>
        {/* Spine Bone */}
        <mesh material={boneMaterial} position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.6]} />
        </mesh>
        
        {/* Chest Joint */}
        <mesh material={jointMaterial} position={[0, 0.6, 0]}>
          <boxGeometry args={[0.5, 0.2, 0.25]} />
        </mesh>

        {/* Neck & Head */}
        <mesh material={boneMaterial} position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2]} />
        </mesh>
        <mesh material={jointMaterial} position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
        </mesh>

        {/* Arms */}
        {/* Left Arm */}
        <group position={[-0.3, 0.6, 0]} ref={leftArmRef}>
          <mesh material={jointMaterial} position={[0, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
          </mesh>
          <mesh material={boneMaterial} position={[-0.05, -0.25, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.04, 0.03, 0.5]} />
          </mesh>
          {/* Elbow & Forearm */}
          <group position={[-0.1, -0.5, 0]} ref={leftLowerArmRef}>
            <mesh material={jointMaterial}>
              <sphereGeometry args={[0.08, 16, 16]} />
            </mesh>
            <mesh material={boneMaterial} position={[0, -0.25, 0]}>
              <cylinderGeometry args={[0.03, 0.02, 0.5]} />
            </mesh>
          </group>
        </group>

        {/* Right Arm */}
        <group position={[0.3, 0.6, 0]} ref={rightArmRef}>
          <mesh material={jointMaterial} position={[0, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
          </mesh>
          <mesh material={boneMaterial} position={[0.05, -0.25, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.04, 0.03, 0.5]} />
          </mesh>
          {/* Elbow & Forearm */}
          <group position={[0.1, -0.5, 0]}>
            <mesh material={jointMaterial}>
              <sphereGeometry args={[0.08, 16, 16]} />
            </mesh>
            <mesh material={boneMaterial} position={[0, -0.25, 0]}>
              <cylinderGeometry args={[0.03, 0.02, 0.5]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Legs */}
      {/* Left Leg */}
      <group position={[-0.15, 0, 0]} ref={leftLegRef}>
        <mesh material={jointMaterial}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>
        <mesh material={boneMaterial} position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.6]} />
        </mesh>
        {/* Knee & Calf */}
        <group position={[0, -0.6, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.1, 16, 16]} />
          </mesh>
          <mesh material={boneMaterial} position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.05, 0.04, 0.6]} />
          </mesh>
          {/* Foot */}
          <mesh material={jointMaterial} position={[0, -0.65, 0.1]}>
            <boxGeometry args={[0.12, 0.1, 0.25]} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group position={[0.15, 0, 0]} ref={rightLegRef}>
        <mesh material={jointMaterial}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>
        <mesh material={boneMaterial} position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.6]} />
        </mesh>
        {/* Knee & Calf */}
        <group position={[0, -0.6, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.1, 16, 16]} />
          </mesh>
          <mesh material={boneMaterial} position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.05, 0.04, 0.6]} />
          </mesh>
          {/* Foot */}
          <mesh material={jointMaterial} position={[0, -0.65, 0.1]}>
            <boxGeometry args={[0.12, 0.1, 0.25]} />
          </mesh>
        </group>
      </group>

      {/* Hand_IK_Target_L */}
      <group ref={leftHandIKTargetRef} position={[-0.8, 1.5, 0.5]} name="Hand_IK_Target_L">
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#f85149" wireframe />
        </mesh>
      </group>

    </group>
  );
}
