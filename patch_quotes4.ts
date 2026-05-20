import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

code = code.replace(
  "`Fluid Drag = 0.5`, `Depth = ปิดเท้า`",
  "'Fluid Drag = 0.5', 'Depth = ปิดเท้า'"
);

fs.writeFileSync('src/components/AIChat.tsx', code);
