import fs from 'fs';
const code = fs.readFileSync('src/components/ModulePanel.tsx', 'utf8');

const uiuxStart = code.indexOf("case 'UIUXEdit':");
const audioStart = code.indexOf("case 'AudioEdit':");

if (uiuxStart !== -1 && audioStart !== -1) {
  const newCode = code.substring(0, uiuxStart) + "case 'UIUXEdit':\n         return <UIUXEditor />;\n      " + code.substring(audioStart);
  fs.writeFileSync('src/components/ModulePanel.tsx', newCode);
  console.log('Replaced UIUXEdit');
} else {
  console.log('Could not find markers');
}
