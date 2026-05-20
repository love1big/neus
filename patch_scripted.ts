import fs from 'fs';
const code = fs.readFileSync('src/components/ModulePanel.tsx', 'utf8');

const targetStart = code.indexOf("case 'ScriptEditor':");
const targetEnd = code.indexOf("case 'BuildPublish':");

if (targetStart !== -1 && targetEnd !== -1) {
  const newCode = code.substring(0, targetStart) + "case 'ScriptEditor':\n         return <ScriptEditor />;\n      " + code.substring(targetEnd);
  fs.writeFileSync('src/components/ModulePanel.tsx', newCode);
  console.log('Replaced ScriptEditor');
} else {
  console.log('Could not find markers');
}
