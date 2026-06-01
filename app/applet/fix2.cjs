const fs = require('fs');

const path = 'src/components/AIChat.tsx';
let data = fs.readFileSync(path, 'utf8');

const replacement = `      } else if (
        lowerInput.includes("สกิล")`;

// I will match from `      } else if (\n        (lowerInput.includes("ตั้งค่า")` until `      } else if (\n        lowerInput.includes("สกิล")`

data = data.replace(/      } else if \(\r?\n        \(lowerInput\.includes\("ตั้งค่า"\)[\s\S]*?\} else if \(\r?\n        lowerInput\.includes\("สกิล"\)/, replacement);

fs.writeFileSync(path, data);
console.log('Fixed ternary and parsing error');
