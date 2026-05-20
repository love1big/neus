import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

code = code.replace(/isThai \? \\`ฉันได้สร้าง Blueprint Node ใหม่สำหรับ \*\*"Apply External Force"\*\* เรียบร้อยแล้ว! 💨\\n\\nโหนดนี้ให้คุณสามารถส่งแรง \(Force Vector\) ไปยัง Actor เป้าหมายได้อย่างอิสระ โดยคุณสามารถตั้งค่าขนาด \(Magnitude\) และทิศทาง \(Direction\) ได้แบบไดนามิกผ่านพารามิเตอร์ภายนอก\\n\\nลองดูสคริปต์ 'BPNode_ApplyForce.ts' สำหรับรายละเอียดครับ!\\` :/g, "isThai ? `ฉันได้สร้าง Blueprint Node ใหม่สำหรับ **\\\"Apply External Force\\\"** เรียบร้อยแล้ว! 💨\\n\\nโหนดนี้ให้คุณสามารถส่งแรง (Force Vector) ไปยัง Actor เป้าหมายได้อย่างอิสระ โดยคุณสามารถตั้งค่าขนาด (Magnitude) และทิศทาง (Direction) ได้แบบไดนามิกผ่านพารามิเตอร์ภายนอก\\n\\nลองดูสคริปต์ 'BPNode_ApplyForce.ts' สำหรับรายละเอียดครับ!` :");

code = code.replace(/isJapanese \? \\`外部パラメータに基づいてターゲットアクターに力を加える新しいブループリントノードを作成しました！💨\\n\\n力の大きさと方向を自由に設定できます。「BPNode_ApplyForce\.ts」を確認してください。\\` :/g, "isJapanese ? `外部パラメータに基づいてターゲットアクターに力を加える新しいブループリントノードを作成しました！💨\\n\\n力の大きさと方向を自由に設定できます。「BPNode_ApplyForce.ts」を確認してください。` :");

code = code.replace(/\\`I've created a new Blueprint Node for \*\*"Apply External Force"\*\*! 💨\\n\\nThis node allows you to apply a physical force to a target actor based on external parameters\. Both the magnitude and the direction vector are fully configurable as input pins, making it highly versatile for explosions, wind gusts, or custom abilities!\\n\\nCheck out the implementation in 'BPNode_ApplyForce\.ts'\.\\`;/g, "`I've created a new Blueprint Node for **\\\"Apply External Force\\\"**! 💨\\n\\nThis node allows you to apply a physical force to a target actor based on external parameters. Both the magnitude and the direction vector are fully configurable as input pins, making it highly versatile for explosions, wind gusts, or custom abilities!\\n\\nCheck out the implementation in 'BPNode_ApplyForce.ts'.`;");

fs.writeFileSync('src/components/AIChat.tsx', code);
