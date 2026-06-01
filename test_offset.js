const fs = require('fs');
const lines = fs.readFileSync('src/components/AIChat.tsx', 'utf8').split('\n');

console.log("Total lines:", lines.length);
console.log("Line 1:", lines[0]);
console.log("Line 2:", lines[1]);
console.log("Line 1385:", lines[1384]);
console.log("Line 1386:", lines[1385]);
console.log("Do they match? ", lines[1] === lines[1384] || lines[1].includes("Send,"));
