import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

const targetRegex = /      \} else if \(lowerInput\.includes\('blueprint'\) \|\| lowerInput\.includes\('bp_'\) \|\| lowerInput\.includes\('interactable'\) \|\| lowerInput\.includes\('pickup'\) \|\| lowerInput\.includes\('activation'\)\) \{/;

const replacement = `      } else if (lowerInput.includes('apply a force') || lowerInput.includes('blueprint node') || lowerInput.includes('apply force')) {
        responseText += isThai ? \\\`ฉันได้สร้าง Blueprint Node ใหม่สำหรับ **"Apply External Force"** เรียบร้อยแล้ว! 💨\\n\\nโหนดนี้ให้คุณสามารถส่งแรง (Force Vector) ไปยัง Actor เป้าหมายได้อย่างอิสระ โดยคุณสามารถตั้งค่าขนาด (Magnitude) และทิศทาง (Direction) ได้แบบไดนามิกผ่านพารามิเตอร์ภายนอก\\n\\nลองดูสคริปต์ 'BPNode_ApplyForce.ts' สำหรับรายละเอียดครับ!\\\` :
                        isJapanese ? \\\`外部パラメータに基づいてターゲットアクターに力を加える新しいブループリントノードを作成しました！💨\\n\\n力の大きさと方向を自由に設定できます。「BPNode_ApplyForce.ts」を確認してください。\\\` :
                        \\\`I've created a new Blueprint Node for **"Apply External Force"**! 💨\\n\\nThis node allows you to apply a physical force to a target actor based on external parameters. Both the magnitude and the direction vector are fully configurable as input pins, making it highly versatile for explosions, wind gusts, or custom abilities!\\n\\nCheck out the implementation in 'BPNode_ApplyForce.ts'.\\\`;
        
        generatedFiles.push({
           filename: 'BPNode_ApplyForce.ts',
           language: 'typescript',
           content: \\\`// [Auto-Generated Blueprint Node]\\\\n// Node: Apply External Force\\\\n// Category: Physics -> Forces\\\\n\\\\nexport class BPNode_ApplyForce {\\\\n  public ExecIn() {\\\\n    // Input execution pin\\\\n  }\\\\n\\\\n  public execute(targetActor: any, directionVector: {x: number, y: number, z: number}, magnitude: number) {\\\\n    if (!targetActor || !targetActor.physicsLayer) {\\\\n      console.warn('ApplyForce: Target actor is invalid or lacks a physics layer.');\\\\n      return;\\\\n    }\\\\n\\\\n    // Normalize the direction vector to ensure uniform scaling by magnitude\\\\n    const length = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2 + directionVector.z ** 2);\\\\n    let normDir = { x: 0, y: 0, z: 0 };\\\\n    \\\\n    if (length > 0) {\\\\n        normDir = {\\\\n            x: directionVector.x / length,\\\\n            y: directionVector.y / length,\\\\n            z: directionVector.z / length\\\\n        };\\\\n    }\\\\n\\\\n    // Calculate the final force vector\\\\n    const force = {\\\\n        x: normDir.x * magnitude,\\\\n        y: normDir.y * magnitude,\\\\n        z: normDir.z * magnitude\\\\n    };\\\\n\\\\n    // Apply to the actor's rigid body\\\\n    targetActor.physicsLayer.addForce(force);\\\\n    \\\\n    console.log(\\\\\\\`Applied force of \\\\\\\${magnitude} to actor in direction [\\\\\\\${normDir.x.toFixed(2)}, \\\\\\\${normDir.y.toFixed(2)}, \\\\\\\${normDir.z.toFixed(2)}]\\\\\\\`);\\\\n    \\\\n    this.ExecOut();\\\\n  }\\\\n\\\\n  public ExecOut() {\\\\n    // Output execution pin\\\\n  }\\\\n}\\\\n\\\`
        });
      } else if (lowerInput.includes('blueprint') || lowerInput.includes('bp_') || lowerInput.includes('interactable') || lowerInput.includes('pickup') || lowerInput.includes('activation')) {`;

if (code.match(targetRegex)) {
  code = code.replace(targetRegex, replacement);
  fs.writeFileSync('src/components/AIChat.tsx', code);
  console.log('Successfully patched blueprint node.');
} else {
  console.log('Regex failed');
}
