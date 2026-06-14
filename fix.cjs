const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix `chatMessages.length`
code = code.replace(/\{chatMessages\.length > 0[^\}]*\}/g, '');
code = code.replace(/<span className="bg-\[#f85149\].*?chatMessages\.length.*?<\/span>/g, '<span className="bg-[#f85149] text-white text-[9px] font-black px-1\.5 rounded-full">0</span>');

code = code.replace(/<AIChat[\s\S]*?\/>/g, '');
code = code.replace(/\{.*?<LocalAIStudio \/>.*?\}/g, '');
code = code.replace(/\{.*?<BatchAIImporter \/>.*?\}/g, '');
code = code.replace(/\{.*?<AICommandCenter \/>.*?\}/g, '');

code = code.replace(/chatMessages/g, '[]');
code = code.replace(/setChatMessages/g, '(() => {})');

fs.writeFileSync('src/App.tsx', code);
