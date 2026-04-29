const fs = require('fs');
let f = fs.readFileSync('src/components/ModulePanel.tsx', 'utf8');
const regex = /          \);\n                            <span>Target Faces:<\/span>.*?      case 'ImageEdit':/s;
if (regex.test(f)) {
    fs.writeFileSync('src/components/ModulePanel.tsx', f.replace(regex, "          );\n      case 'ImageEdit':"));
    console.log('regex fixed exact');
} else {
    // try fallback
    const fallback = /<span>Target Faces:<\/span>.*?case 'ImageEdit':/s;
    if (fallback.test(f)) {
         fs.writeFileSync('src/components/ModulePanel.tsx', f.replace(fallback, "case 'ImageEdit':"));
         console.log('regex fixed fallback');
    } else {
         console.log('regex not found at all');
    }
}
