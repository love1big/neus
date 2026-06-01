import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

// The issue is \\` or \` at the end of the strings
code = code.replace(/แล้วครับ!\\*`\s*:/g, "แล้วครับ!` :");
code = code.replace(/แล้วครับ!\*\*\\`\s*:/g, "แล้วครับ!**` :");
code = code.replace(/แล้วครับ!\\`\s*:/g, "แล้วครับ!` :");
code = code.replace(/แล้วครับ!\\`/g, "แล้วครับ!`");
code = code.replace(/แล้วครับ! \*\*\\`/g, "แล้วครับ! **`");
// brute-force the specific line
code = code.replace(/Cultural Dictionary ให้ลึกถึงขีดสุดแล้วครับ!\*\*\\`/g, "Cultural Dictionary ให้ลึกถึงขีดสุดแล้วครับ!**`");
code = code.replace(/Cultural Dictionary ให้ลึกถึงขีดสุดแล้วครับ!\*\*`/g, "Cultural Dictionary ให้ลึกถึงขีดสุดแล้วครับ!**`");

fs.writeFileSync('src/components/AIChat.tsx', code);
