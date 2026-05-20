import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

code = code.replace(/\\\\`\\\\`\\\\`javascript/g, "");
code = code.replace(/}\\n````/g, "}");

fs.writeFileSync('src/components/AIChat.tsx', code);
