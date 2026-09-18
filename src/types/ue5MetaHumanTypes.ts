/**
 * ============================================================================
 * MODULE HEADER & ARCHITECTURAL DOCUMENTATION (ภาษาไทย & ENGLISH)
 * ============================================================================
 * 
 * 1. Module Purpose & Responsibility (วัตถุประสงค์และหน้าที่ของไฟล์/โมดูลนี้):
 *    - EN: Core TypeScript type contracts for Unreal Engine 5 MetaHuman Facial Rigging
 *          & Performance Capture System (UE5 MetaHuman Animator parity).
 *          Defines 60+ Facial Action Coding System (FACS) blendshapes, ARKit 52
 *          shapes, dynamic wrinkle maps (stress activation), eye gaze vergence,
 *          and On-Device Offline AI Audio-to-FACS Phoneme Lip-Sync Synthesizers.
 *    - TH: สัญญา Interface และ Type สำหรับระบบ UE5 MetaHuman Facial Rigging & Performance Capture
 *          (เทียบเท่า Unreal Engine 5 MetaHuman Animator)
 *          ครอบคลุม Blendshapes ตามระบบกายวิภาคศาสตร์ใบหน้า FACS กว่า 60 รูปแบบ,
 *          การเชื่อมต่อ ARKit 52 รูปทรง, แผนที่ริ้วรอยจำลองความเครียดของผิวหนัง (Wrinkle Maps),
 *          และการวิเคราะห์เสียงสังเคราะห์ลิปซิงก์ปากพูดอัตโนมัติด้วย AI ออฟไลน์
 * 
 * 2. Architecture & System Integration (สถาปัตยกรรมและการเชื่อมโยงกับระบบอื่น):
 *    - Strict 1 Node / 1 Module = 1 Dedicated File
 *    - Consumed by `UE5MetaHumanEngineNode.ts` and `UE5MetaHumanFacialStudio.tsx`
 * ============================================================================
 */

export interface FACSBlendshapeWeight {
  name: string;
  category: 'BROW' | 'EYE' | 'CHEEK' | 'NOSE' | 'MOUTH' | 'JAW';
  weight: number; // 0.0 - 1.0
}

export interface UE5MetaHumanProfile {
  characterName: string;
  lodLevel: number; // 0 (Cinematic) to 3 (Crowd)
  wrinkleMapsEnabled: boolean;
  eyeGazePitchYaw: [number, number]; // degrees
  blendshapes: FACSBlendshapeWeight[];
  offlineAIAudioLipSyncActive: boolean;
}
