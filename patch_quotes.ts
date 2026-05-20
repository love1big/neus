import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

code = code.replace(
  '`Albedo`, `Normal Map`, และรันรังสีตรวจสอบความลึก `Distance Map/Height Map`',
  '\\\\`Albedo\\\\`, \\\\`Normal Map\\\\`, และรันรังสีตรวจสอบความลึก \\\\`Distance Map/Height Map\\\\`'
);

code = code.replace(
  'สมการ `F = ma` ผูกโยง',
  'สมการ \\\\`F = ma\\\\` ผูกโยง'
);

code = code.replace(
  'ดินจะยุบตัวด้วย `GPU Hardware Tessellation` ขอบรอยเท้าจะถูกดันนูนขึ้นมา',
  'ดินจะยุบตัวด้วย \\\\`GPU Hardware Tessellation\\\\` ขอบรอยเท้าจะถูกดันนูนขึ้นมา'
);

fs.writeFileSync('src/components/AIChat.tsx', code);
