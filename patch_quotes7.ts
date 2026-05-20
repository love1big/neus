import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

code = code.replace(/```javascript/g, "\\\\`\\\\`\\\\`javascript");
code = code.replace(/\\}\\n````/g, "}\\n\\\\`\\\\`\\\\``");

fs.writeFileSync('src/components/AIChat.tsx', code);
