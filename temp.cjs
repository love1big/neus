const fs = require('fs');
let f = fs.readFileSync('src/components/ModulePanel.tsx', 'utf8');
const start = f.indexOf('<span>Target Faces:</span>');
if (start !== -1) {
  const preceding = f.indexOf('          );', start - 200);
  const end = f.indexOf('      case \'ImageEdit\':', start);
  console.log('Found:', start, preceding, end);
  if (preceding !== -1 && end !== -1) {
    fs.writeFileSync('src/components/ModulePanel.tsx', f.substring(0, preceding + 13) + f.substring(end));
    console.log('Fixed');
  }
}
