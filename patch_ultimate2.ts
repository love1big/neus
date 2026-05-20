import fs from 'fs';

let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

const regex = /responseText \+= isThai \? \\`จัดเต็ม/g;
if (regex.test(code)) {
    code = code.replace(/isThai \? \\`จัดเต็ม/, 'isThai ? `จัดเต็ม');
}

// Just match all escaped backticks and correct them if needed. 
// However, the issue is `\\`` appearing as `\`` in the actual TypeScript output, meaning it was written as \` inside the file, which is a syntax error since we are not inside a string! Wait, `isThai ? \`จัดเต็ม ... \` :`
// we used \` out there, which makes it \ in the tsx file. We want it to be a real backtick ` without the \ before it.

code = code.replace(/\\`จัดเต็ม/g, "`จัดเต็ม");
code = code.replace(/แล้วครับ!\\`/g, "แล้วครับ!`");

code = code.replace(/\\`究極/g, "`究極");
code = code.replace(/極めます。\\`/g, "極めます。`");

code = code.replace(/\\`Diving/g, "`Diving");
code = code.replace(/NPC_Brain\.ts'\.\\`/g, "NPC_Brain.ts'.`");

// Ensure content string literals are real backticks
code = code.replace(/content: \\`\/\//g, "content: `//");
code = code.replace(/\}\\\\n\\`/g, "}\\n`");
code = code.replace(/\}\\\n\\`/g, "}\\n`");
code = code.replace(/\}\\n\\`/g, "}\\n`");

fs.writeFileSync('src/components/AIChat.tsx', code);
