import fs from 'fs';
let code = fs.readFileSync('src/components/AIChat.tsx', 'utf8');
code = code.replace(/\\`Project Settings > AI & Navigation\\`/g, "'Project Settings > AI & Navigation'");
code = code.replace(/\\`npcManager\.setGlobalLLMBrainActive\(true\);\\`/g, "'npcManager.setGlobalLLMBrainActive(true);'");
code = code.replace(/\\`npcObject\.awakenNeuralNetwork\(\);\\`/g, "'npcObject.awakenNeuralNetwork();'");

code = code.replace(/`Project Settings > AI & Navigation`/g, "'Project Settings > AI & Navigation'");
code = code.replace(/`npcManager\.setGlobalLLMBrainActive\(true\);`/g, "'npcManager.setGlobalLLMBrainActive(true);'");
code = code.replace(/`npcObject\.awakenNeuralNetwork\(\);`/g, "'npcObject.awakenNeuralNetwork();'");

// Just fix the outer string quotes
code = code.replace(/isThai \? \\`แน่นอนครับ!/g, "isThai ? `แน่นอนครับ!");
code = code.replace(/เข้าไปแล้วครับ!\\`/g, "เข้าไปแล้วครับ!`");
code = code.replace(/isJapanese \? \\`LLM NPCブレインには/g, "isJapanese ? `LLM NPCブレインには");
code = code.replace(/可能デス。\\`/g, "可能デス。`");
code = code.replace(/可能です。\\`/g, "可能です。`");
code = code.replace(/\\`Yes! The \*\*Neural Network/g, "`Yes! The **Neural Network");
code = code.replace(/Thinking LODs!\\`/g, "Thinking LODs!`");
code = code.replace(/content: \\`\/\//g, "content: `//");
code = code.replace(/\}\\\n\\`/g, "}\\n`");
code = code.replace(/\}\\\\n\\`/g, "}\\n`");

fs.writeFileSync('src/components/AIChat.tsx', code);
