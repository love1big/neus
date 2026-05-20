import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

code = code.replace(
  "`'Spring Physics'",
  "'Spring Physics'"
);

fs.writeFileSync('src/components/AIChat.tsx', code);
