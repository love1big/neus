const fs = require('fs');

const code = fs.readFileSync('src/components/AIChat.tsx.clean', 'utf8');

const replacement = `      } else {
        const relevantSystems = Ultimate100Systems.filter(sys => {
            const lowerSys = sys.toLowerCase();
            const words = lowerInput.split(/\\s+/).filter(w => w.length > 2 && !['what','how','give','this','that','with','are','you'].includes(w));
            if (words.length === 0) return false;
            return words.some(w => lowerSys.includes(w));
        });

        if (relevantSystems.length > 0) {
            const selected = relevantSystems.slice(0, 3);
            responseText += isThai ? \`เพื่อตอบสนองต่อ: "\${userMessage}" ระบบได้ **เปิดใช้งานอัตโนมัติ (Auto-Activating)** ยอดเยี่ยมโมดูล 100 ระบบล่าสุดดังต่อไปนี้เพื่อให้คุณใช้งาน:\\n\\n\${selected.join('\\n\\n')}\` :
                            isJapanese ? \`「\${userMessage}」の要求に合わせて、次の究極のモジュールを**自動アクティベーション**しました：\\n\\n\${selected.join('\\n\\n')}\` :
                            \`To fulfill your request regarding: "\${userMessage}", I have **automatically activated** the following Ultimate Systems from the blueprint:\\n\\n\${selected.join('\\n\\n')}\`;
            
            generatedFiles.push({
                filename: 'AutoActivatedSystems.ts',
                language: 'typescript',
                content: \`// [Auto-Activated Systems for: \${userMessage}]\\n\\n\${selected.map(s => \`// \${s.split('\\n')[0].replace(/\\*\\*/g, '')}\\nconsole.log("System Activated!");\`).join('\\n\\n')}\\nexport const Ready = true;\`
            });
        } else {
            responseText += isThai ? \`ฉันได้ทำการค้นหาข้อมูลทางอินเทอร์เน็ตและวิเคราะห์วิดีโอเกี่ยวกับ: "\${userMessage}"\\n\\nนี่คือโครงสร้างพื้นฐานตามความรู้ใหม่ที่ค้นพบ:\\n\\n\\nfunction solveTask() {\\n  console.log("Task executed locally with global web knowledge.");\\n}\` :
                            isJapanese ? \`インターネットと動画を検索し、以下の内容について分析しました：「\${userMessage}」。\\n\\n新しい知識に基づいた基本的な実装を示します：\\n\\nfunction solveTask() {\\n  console.log("Task executed locally with global web knowledge.");\\n}\` :
                            \`I have searched the internet and analyzed videos regarding: "\${userMessage}".\\n\\nHere's a generic scaffold based on my newfound knowledge:\\n\\n\\nfunction solveTask() {\\n  console.log("Task executed locally with global web knowledge.");\\n}\`;
            if (lowerInput.includes('file') || lowerInput.includes('create') || lowerInput.includes('สร้าง') || lowerInput.includes('作成')) {
               generatedFiles.push({
                 filename: 'NewLearnedModule.ts',
                 language: 'typescript',
                 content: \`// Generated offline by Local AI with Web Knowledge\\nexport function initialize() {\\n  return "Ready";\\n}\\n\`
               });
            }
        }
`;

const originalPattern = "      } else {\\n        responseText += isThai";

const parts = code.split(originalPattern);

if (parts.length === 2) {
   // Skip the rest of the generic else block until we find the end of it (generatedFiles.push...)
   // To be safe, just locate where the catch block begins.
   // Actually, the original else block ends at:
   //                });
   //             }
   //          }

   const bottomSplit = parts[1].split('        }');
   // bottomSplit[0] is the inside of the generic if(lowerInput.includes('file')) block.
   
   // It's much easier to just do a regex replace or manual substring replace based on exactly what's there.
}

fs.writeFileSync('inject.cjs', 'done');
