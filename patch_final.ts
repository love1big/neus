import fs from 'fs';

const lines = fs.readFileSync('src/components/AIChat.tsx', 'utf8').split('\n');

let topEndIdx = -1;
for (let i = 1380; i < lines.length; i++) {
  if (lines[i] === "} " || lines[i] === "}") {
     // Ensure it's the class closure.
     if (lines[i-1].includes("  }") && lines[i-2].includes("console.log")) {
        topEndIdx = i;
        break;
     }
  }
}

if (topEndIdx === -1) {
    console.error("topEndIdx not found!");
    process.exit(1);
}

let bottomStartIdx = -1;
for (let i = topEndIdx; i < lines.length; i++) {
  if (lines[i].includes("isJapanese ? `インターネット")) {
     bottomStartIdx = i;
     break;
  }
}

if (bottomStartIdx === -1) {
    console.error("bottomStartIdx not found!");
    process.exit(1);
}

const topPart = lines.slice(0, topEndIdx + 1).join('\n');
const bottomPart = lines.slice(bottomStartIdx).join('\n');

const middlePart = `\`
        });
      } else {
        responseText += isThai ? \`ฉันได้ทำการค้นหาข้อมูลทางอินเทอร์เน็ตและวิเคราะห์วิดีโอเกี่ยวกับ: "\${userMessage}"\\n\\nนี่คือโครงสร้างพื้นฐานตามความรู้ใหม่ที่ค้นพบ:\\n\\n\\nfunction solveTask() {\\n  console.log("Task executed locally with global web knowledge.");\\n}\` :
`;

fs.writeFileSync('src/components/AIChat.tsx', topPart + "\n" + middlePart + bottomPart);
console.log("AIChat.tsx successfully restored and fixed!");
