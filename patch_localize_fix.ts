import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

code = code.replace(/isThai \? \\`จัดเต็มให้เลยครับพี่!/g, "isThai ? `จัดเต็มให้เลยครับพี่!");
code = code.replace(/Cultural Dictionary ให้ลึกถึงขีดสุดแล้วครับ!\\`/g, "Cultural Dictionary ให้ลึกถึงขีดสุดแล้วครับ!`");

code = code.replace(/isJapanese \? \\`「LocalizeAIEngine」を限界まで拡張/g, "isJapanese ? `「LocalizeAIEngine」を限界まで拡張");
code = code.replace(/行います。\\`/g, "行います。`");

code = code.replace(/\\`I've upgraded the/g, "`I've upgraded the");
code = code.replace(/deep-localization pipeline!\\`/g, "deep-localization pipeline!`");

code = code.replace(/content: \\`\/\//g, "content: `//");
code = code.replace(/\}\\\n\\`/g, "}\\n`");
code = code.replace(/\}\\\\n\\`/g, "}\\n`");
fs.writeFileSync('src/components/AIChat.tsx', code);
