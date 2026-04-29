const fs = require('fs');
let f = fs.readFileSync('src/components/ModulePanel.tsx', 'utf8');
const regex = /                            <span>Target Faces:<\/span>.*?      case 'ImageEdit':/s;
if (regex.test(f)) {
    fs.writeFileSync('src/components/ModulePanel.tsx', f.replace(regex, "      case 'ImageEdit':"));
    console.log('regex fixed');
} else {
    console.log('regex not found');
}
