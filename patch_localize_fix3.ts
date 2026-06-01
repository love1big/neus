import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

code = code.replace(/\$\{PlayerName\}/g, "\\${PlayerName}");
code = code.replace(/\$\{ItemCount\}/g, "\\${ItemCount}");
code = code.replace(/\$\{ItemName\}/g, "\\${ItemName}");

fs.writeFileSync('src/components/AIChat.tsx', code);
