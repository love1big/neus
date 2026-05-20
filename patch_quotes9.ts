import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');

code = code.replace(
  '`ฉันได้ค้นหาและวิเคราะห์วิดีโอจากอินเทอร์เน็ตเกี่ยวกับ: "${userMessage}".\\n\\nนี่คือโครงสร้างโค้ดพื้นฐานที่คุณสามารถใช้ได้:\\n\\n\\nfunction solveTask() {\\n  console.log("Task executed locally with global web knowledge.");\\n} :',
  '`ฉันได้ค้นหาและวิเคราะห์วิดีโอจากอินเทอร์เน็ตเกี่ยวกับ: "${userMessage}".\\n\\nนี่คือโครงสร้างโค้ดพื้นฐานที่คุณสามารถใช้ได้:\\n\\nfunction solveTask() {\\n  console.log("Task executed locally with global web knowledge.");\\n}` :'
);

code = code.replace(
  '`インターネットと動画を検索し、以下の内容について分析しました：「${userMessage}」。\\n\\n新しい知識に基づいた基本的な実装を示します：\\n\\n\\nfunction solveTask() {\\n  console.log("Task executed locally with global web knowledge.");\\n} :',
  '`インターネットと動画を検索し、以下の内容について分析しました：「${userMessage}」。\\n\\n新しい知識に基づいた基本的な実装を示します：\\n\\nfunction solveTask() {\\n  console.log("Task executed locally with global web knowledge.");\\n}` :'
);

code = code.replace(
  "`" + "I have searched the internet and analyzed videos regarding: \\\"${userMessage}\\\".\\n\\nHere's a generic scaffold based on my newfound knowledge:\\n\\n\\nfunction solveTask() {\\n  console.log(\\\"Task executed locally with global web knowledge.\\\");\\n};",
  "`" + "I have searched the internet and analyzed videos regarding: \\\"${userMessage}\\\".\\n\\nHere's a generic scaffold based on my newfound knowledge:\\n\\nfunction solveTask() {\\n  console.log(\\\"Task executed locally with global web knowledge.\\\");\\n}`;"
);

fs.writeFileSync('src/components/AIChat.tsx', code);
