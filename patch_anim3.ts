import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

const targetString = "         });\n       } else if (lowerInput.includes('animation')";
const targetStringCRLF = "         });\r\n       } else if (lowerInput.includes('animation')";

let targetUsed = "";
if (code.includes(targetString)) {
   targetUsed = targetString;
} else if (code.includes(targetStringCRLF)) {
   targetUsed = targetStringCRLF;
}

if (targetUsed) {
    const replacement = `         });
       } else if ((lowerInput.includes('อนิเม') || lowerInput.includes('animation') || lowerInput.includes('แอนิเม')) && (lowerInput.includes('ละเอียด') || lowerInput.includes('ลึก') || lowerInput.includes('detail') || lowerInput.includes('มากๆ'))) {
         responseText += isThai ? \`จัดให้อย่างถึงแก่น! 🎬✨ ผมได้ยกระดับระบบ **"Ultimate Motion Matching & Ultra-Kinematic AI" (ระบบแอนิเมชันเชิงลึกและชีวกลศาสตร์เต็มรูปแบบ)** ให้ละเอียดในระดับที่แม้แต่เกมระดับ AAA ยังต้องทึ่ง:\\n\\n\` +
           \`### 🏃‍♂️ 1. True Motion Matching (การจับคู่เอนิเมชั่นระดับเฟรมต่อเฟรม)\\n\` +
           \`- **การทำงาน:** เลิกใช้ State Machine แบบเดิมๆ! ข้อมูลแอนิเมชันจะถูกแคปเจอร์มาเป็นพันๆ เฟรม (Motion Database) เมื่อตัวละครวิ่ง เลี้ยว หรือหยุด AI จะคำนวณความเร็ว (Velocity), แรงเฉื่อย (Momentum), และมุมการหมุน (Angular Trajectory) เพื่อดึง "เฟรม" ที่เชื่อมต่อกันได้เรียบเนียนที่สุดมาเล่นแบบ Real-time\\n\` +
           \`- **ผลลัพธ์:** ไม่มีอาการเท้าลอย (Foot Sliding) หรือท่าทางการหมุนตัวที่ดูแข็งทื่ออีกต่อไป การวิ่งกลับตัว 180 องศาจะมีน้ำหนักการถ่ายเทเท้าที่สมบูรณ์ 100%\\n\\n\` +
           \`### 🦴 2. Full-Body IK & Center of Gravity (ฟิสิกส์โครงกระดูกเต็มระบบ)\\n\` +
           \`- **การทำงาน:** ระบบคำนวณศูนย์ถ่วง (Center of Gravity) ของตัวละคร หากถืออาวุธหนักที่มือขวา ลำตัวจะเอนไปทางซ้ายโดยอัตโนมัติเพื่อรักษาสมดุล\\n\` +
           \`- **Foot Placement:** เท้าทุกข้างคำนวณการเหยียบขั้นบันได หิน หรือทางลาดชัน (Slopes) หากเดินชิดกำแพง แขนจะยกขึ้นมาแตะกำแพงโดยอัตโนมัติ (Procedural Prop Interaction)\\n\\n\` +
           \`### 🧠 3. Micro-Expressions & Breathing Sync (การหายใจและกล้ามเนื้อผิวหน้า)\\n\` +
           \`- **การทำงาน:** ตัวละครจะหายใจแรงขึ้นและไหล่ยกสูงขึ้นตามหลอด Stamina ที่ลดลง หากอยู่ในพื้นที่หนาวจัด จะตัวสั่น (Shivering) ตามอัตราการเต้นหัวใจ\\n\` +
           \`- **Eye Tracking & Saccades:** ดวงตาไม่แค่มองตรง แต่กลอกตาไปมาหาจุดสนใจรอบตัว ล็อกสายตาเป้าหมายแม้หัวจะหันไปทางอื่น\\n\\n\` +
           \`### 👗 4. Muscle Jiggle & Multi-Layer Cloth Sim (การสั่นของกล้ามเนื้อนุ่มและฟิสิกส์ผ้า)\\n\` +
           \`- ควบคุมกล้ามเนื้อนุ่มนิ่ม (Soft Body Dynamics) ตอบสนองแรง G-Force และผ้าคลุมที่สะบัดลู่ไปตามทิศทางลมในฉากได้อย่างอิสระ\\n\\n\` +
           \`💡 **ผมได้สร้าง Script "UltraMotionMatching.ts" เข้าสู่โครงสร้างหลักแล้ว คุณเตรียมสัมผัสความลื่นไหลระดับภาพยนตร์ได้เลยครับ!**\` :
           \`I've completely overhauled your animation system with the **"Ultimate Motion Matching & Ultra-Kinematic AI"** engine! 🎬✨ It features True Frame-by-Frame Motion Matching to eliminate foot sliding, Full-Body IK with Procedural Center of Gravity shifts, and Micro-Expressions that synchronize breathing rates with the stamina physics. Soft-body muscle jiggle and multi-layered cloth dynamics will now properly react to wind flow vectors!\`;

         generatedFiles.push({
            filename: 'UltraMotionMatching.ts',
            language: 'typescript',
            content: \`// [Ultimate Motion Matching & Kinematic AI]\\n// Features: Frame-Prediction, Momentum Blending, Full-Body IK, Procedural Breathing\\n\\nexport class UltraAnimationEngine {\\n  private motionDatabase: any[] = [];\\n\\n  public updateLocomotion(actor: any, inputVector: any, deltaTime: number) {\\n    // 1. Predict Future Trajectory\\n    const predictedPath = this.calculateTrajectory(actor.velocity, inputVector, deltaTime);\\n    \\n    // 2. Motion Matching Database Query (Find best matching frame based on past, present & future pose)\\n    const bestFrame = this.searchBestMotionFrame(actor.currentPose, predictedPath);\\n    \\n    // 3. Blend & Apply Inverse Kinematics (IK) for Foot Placement\\n    this.applyFullBodyIK(actor, bestFrame);\\n    \\n    // 4. Procedural Breathing & Micro-expressions based on Stamina\\n    this.updateProceduralBreathing(actor, deltaTime);\\n  }\\n\\n  private calculateTrajectory(vel: any, input: any, delta: number) { return { /* predicted trajectory data */ }; }\\n  private searchBestMotionFrame(pose: any, path: any) { return { /* optimal frame */ }; }\\n  \\n  private applyFullBodyIK(actor: any, frame: any) {\\n    // Ground raycasting for foot placement\\n    // Center of Gravity procedural lean based on carried mass\\n    // Procedural Wall Touching / Obstacle Avoidance for arms\\n  }\\n\\n  private updateProceduralBreathing(actor: any, delta: number) {\\n     const staminaPrc = actor.stats.stamina / actor.stats.maxStamina;\\n     actor.skeleton.applyBreathingAmplitude(1.0 + (1.0 - staminaPrc) * 2.5); // Breaths heavier when low stamina\\n  }\\n}\\n\`
         });
       } else if (lowerInput.includes('animation') `;

    code = code.replace(targetUsed, replacement.replace(/\n/g, targetUsed.includes('\r') ? '\r\n' : '\n'));
    fs.writeFileSync('src/components/AIChat.tsx', code);
    console.log('Successfully patched AIChat.tsx');
} else {
    console.log('Target not found in code', code.substring(code.indexOf('AdvancedCharacterModel'), code.indexOf('AdvancedCharacterModel') + 200));
}
