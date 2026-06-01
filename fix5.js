import fs from 'fs';

const path = 'src/components/AIChat.tsx';
let data = fs.readFileSync(path, 'utf8');

// The mangled piece starts around "เสาที่เปลี่ยนเป็นเ"
// We will replace from "เสาที่เปลี่ยนเป็นเ" until "โหมดฟิสิกส์!\\n\\n\` +"
// Wait, the end is: "} else if (ลี่ยนคานเหล็กเป็นแก้ว (มวลน้อยลง ความเปราะบางสูง) บ้านจะถล่มลงมาทันทีที่รัน Simulation โหมดฟิสิกส์!\\n\\n\` +"

data = data.replace(/- \*\*Electrical Conductivity \(การนำไฟฟ้า\):\*\* เสาที่เปลี่ยนเป็นเ[\s\S]*?\} else if \(ลี่ยนคานเหล็กเป็นแก้ว \(มวลน้อยลง ความเปราะบางสูง\) บ้านจะถล่มลงมาทันทีที่รัน Simulation โหมดฟิสิกส์!\\n\\n` \+/, 
`- **Electrical Conductivity (การนำไฟฟ้า):** เสาที่เปลี่ยนเป็นเหล็กจะนำไฟฟ้า หากสายไฟขาดไปโดน มันจะช็อตผู้เล่นทันที แต่ถ้าเปลี่ยนเป็นไม้ก็ปลอดภัย\\n\\n\` +`);

// Also fix magnitude issue in BPNode_ApplyForce
data = data.replace(/console\.log\(\\\`Applied force of \$\{magnitude\} to actor in direction/g, 
"console.log(\\\`Applied force of \\\\${magnitude} to actor in direction");

data = data.replace(/\[\$\{normDir\.x\.toFixed\(2\)\}, \$\{normDir\.y\.toFixed\(2\)\}, \$\{normDir\.z\.toFixed\(2\)\}\]\\\`/g,
"[\\\\${normDir.x.toFixed(2)}, \\\\${normDir.y.toFixed(2)}, \\\\${normDir.z.toFixed(2)}]\\\`");

// Wait, the icons! 
// src/components/AudioEditor.tsx(87,96): error TS2304: Cannot find name 'MousePointer2'.
// src/components/AudioEditor.tsx(89,91): error TS2304: Cannot find name 'Copy'.
// src/components/ImageEditor.tsx(188,29): error TS2304: Cannot find name 'LayoutTemplateIcon'.
// Let's just fix the AIChat.tsx first!
fs.writeFileSync(path, data);
console.log('Fixed AIChat.tsx syntax part 5');
