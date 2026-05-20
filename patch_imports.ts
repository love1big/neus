import fs from 'fs';

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace('import { ShoppingCart', 'import { Brain, ShoppingCart');

fs.writeFileSync('src/App.tsx', appCode);
console.log('App.tsx Imports patched');
