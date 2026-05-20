const fs = require('fs');
let code = fs.readFileSync('src/components/ModulePanel.tsx', 'utf8');
code = code.replace(/import { Database/, 'import { Database, Waypoints');
fs.writeFileSync('src/components/ModulePanel.tsx', code);
