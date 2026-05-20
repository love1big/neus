import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

code = code.replace(
  "ลองไปดูที่ไฟล์ \\\\`BP_InteractableObject.ts\\\\` ได้เลยครับ!`",
  "ลองไปดูที่ไฟล์ 'BP_InteractableObject.ts' ได้เลยครับ!`"
);

fs.writeFileSync('src/components/AIChat.tsx', code);
