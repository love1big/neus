const fs = require('fs');
const lines = fs.readFileSync('src/components/AIChat.tsx', 'utf8').split('\n');

let start = -1;
let end = -1;
for (let i = 1050; i < lines.length; i++) {
  if (lines[i].includes('export const Ultimate100Systems = [')) {
    start = i;
  }
  if (start !== -1 && lines[i].startsWith('];')) {
    end = i;
    break;
  }
}

console.log("Found from", start, "to", end);

if (start !== -1 && end !== -1) {
  const pureArray = lines.slice(start, end + 1).join('\n');
  if (!fs.existsSync('src/lib')) fs.mkdirSync('src/lib', { recursive: true });
  fs.writeFileSync('src/lib/Ultimate100Systems.ts', pureArray + '\n');
  console.log("Wrote src/lib/Ultimate100Systems.ts");

  let contentStart = -1;
  for (let i = 1050; i >= 1000; i--) {
     if (lines[i].includes('content: `// [The 100 Ultimate Systems Blueprint]')) {
        contentStart = i;
        break;
     }
  }

  let backtickEnd = -1;
  for (let i = end; i < lines.length; i++) {
     if (lines[i].includes('`')) {
        backtickEnd = i;
        break;
     }
  }

  console.log("Replacing from", contentStart, "to", backtickEnd);

  const newLines = [
    ...lines.slice(0, contentStart),
    `           content: \`// [The 100 Ultimate Systems Blueprint]\\n// An exhaustive, massively detailed architecture defining the most complete, perfect Game & Development IDE in existance.\\n\\nexport const Ultimate100Systems = \` + JSON.stringify(Ultimate100Systems, null, 2) + '\\n;\\n'`,
    ...lines.slice(backtickEnd + 1)
  ];
  
  const finalCode = "import { Ultimate100Systems } from '../lib/Ultimate100Systems';\n" + newLines.join('\n');
  fs.writeFileSync('src/components/AIChat.tsx', finalCode);
}
