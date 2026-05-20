import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

code = code.replace(
  'ระบบดึง \\\\`Albedo\\\\`, \\\\`Normal Map\\\\`, และรันรังสีตรวจสอบความลึก \\\\`Distance Map/Height Map\\\\`',
  "ระบบดึง 'Albedo', 'Normal Map', และรันรังสีตรวจสอบความลึก 'Distance Map/Height Map'"
);

code = code.replace(
  'สมการ \\\\`F = ma\\\\` ผูกโยง',
  "สมการ 'F = ma' ผูกโยง"
);

code = code.replace(
  'ดินจะยุบตัวด้วย \\\\`GPU Hardware Tessellation\\\\` ขอบรอยเท้า',
  "ดินจะยุบตัวด้วย 'GPU Hardware Tessellation' ขอบรอยเท้า"
);

code = code.replace(
  'Spring Physics` ค่อยๆ',
  "'Spring Physics' ค่อยๆ"
);

fs.writeFileSync('src/components/AIChat.tsx', code);
