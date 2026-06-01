const fs = require('fs');

const path = 'src/components/AIChat.tsx';
let data = fs.readFileSync(path, 'utf8');

const replacement = `  private processHypothermia(actor: any, delta: number) {
     actor.stats.coreTemperature -= (0.1 * delta);
     if (actor.stats.coreTemperature < 35.0) {
        actor.animator.blendToState('Shivering_IK');
     }
  }
}
\`,
        });
      } else if (
        lowerInput.includes("โคลน") ||
        lowerInput.includes("พิษ") ||
        lowerInput.includes("หนองน้ำ") ||
        lowerInput.includes("ทรายดูด") ||
        lowerInput.includes("ลื่น") ||
        lowerInput.includes("น้ำแข็ง")
      ) {
        responseText += isThai
          ? \`จัดให้ครับ! ระบบ Hazardous Environments & Bio-Locomotion\\n\\n\` +
            \`### ☠️ Toxic Swamp & Biohazard (หนองน้ำพิษและแก๊ส)\\n\` +
            \`- **Choking & Vision Blur:** หากไม่มีหน้ากากกันแก๊ส (Gas Mask) เมื่อเข้าโซนป่าดิบชื้นมีพิษ หน้าจอจะเริ่มเบลอ คลื่นไส้ การเล็งปืนจะส่ายอย่างบ้าคลั่ง\\n\` +
            \`- **Lethal Mud & Leeches:** เดินลุยน้ำเน่า ตัวละครจะยกแขนปัดแมลง และถ้าอยู่นานจะมี 'ปลิง (Leech)' เกาะตามตัว ต้องกดปุ่ม QTE เพื่อดึงออก ไม่งั้นเลือดจะลดเรื่อยๆ\\n\\n\` +
            \`### ⏳ Quicksand & Heavy Mud (ทรายดูดและโคลนดูด)\\n\` +
            \`- **Sinking Dynamics:** เมื่อเหยียบ Quicksand ตัวละครจะค่อยๆ จมลงตามเวลาจริง ยิ่งดิ้น ยิ่งวิ่ง (Input Movement) ยิ่งจมเร็วขึ้น! แอนิเมชันจะเปลี่ยนเป็นท่าตะเกียกตะกาย (Desperate Struggle IK)\\n\` +
            \`- **Buddy Pull-Out:** หากเล่น Co-op หรือมี NPC ต้องโยนเชือกหรือยื่นมือไปดึงเพื่อนขึ้นมาพร้อม Physics แรงดึงที่สมจริง!\\n\\n\` +
            \`💡 **และ แน่นอน... ในหน้า Map Editor โหมด Volumes ตอนนี้คุณสามารถครอบพื้นที่แล้วเลือก 'Quicksand', 'Toxic Gas', 'Slippery Ice' ได้ทันที! ลองดูสิครับ?**\``;

data = data.replace(/  private processHyperthermia[\s\S]*?Slippery Ice' ได้ทันที! ลองดูสิครับ\?\*\*`/, replacement);

fs.writeFileSync(path, data);
console.log('Fixed syntax error via regex.');
