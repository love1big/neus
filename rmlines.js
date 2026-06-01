import fs from 'fs';

let content = fs.readFileSync('src/components/AIChat.tsx', 'utf8');
const lines = content.split('\n');

// Arrays are 0-indexed, so line 1161 is index 1160, and line 1204 is index 1203
lines.splice(1160, 1204 - 1160 + 1);

fs.writeFileSync('src/components/AIChat.tsx', lines.join('\n'));
console.log('Lines removed safely.');
