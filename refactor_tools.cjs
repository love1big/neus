const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const toolsRegex = /const tools = \[\s*\{ id: 'OmniCreatorMaster'[\s\S]*?\];/;
const toolsMatch = code.match(toolsRegex);

if (toolsMatch) {
  const toolsDeclaration = toolsMatch[0];
  code = code.replace(toolsDeclaration, '');
  
  // place it before renderVerticalToolbar
  code = code.replace('const renderVerticalToolbar = () => {', toolsDeclaration + '\n\n  const renderVerticalToolbar = () => {');
  
  fs.writeFileSync('src/App.tsx', code, 'utf8');
  console.log('Tools moved successfully');
} else {
  console.log('Could not find tools definition');
}
