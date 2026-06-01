const fs = require('fs');
const lines = fs.readFileSync('src/components/AIChat.tsx', 'utf8').split('\n');

// The file should end at line 1738 (if it's `}`). We just take slice(0, 1738)
const cleanLines = lines.slice(0, 1738); // 0 to 1737 (which is 1738 lines. Wait, line 1738 is index 1737.)
console.log(cleanLines[cleanLines.length - 1]); // Should be `}`
fs.writeFileSync('src/components/AIChat.tsx.clean', cleanLines.join('\n'));
console.log("Wrote clean version.");
